// =====================================================================================
// Guardar la partida: el servidor es el único que puede escribirla (las reglas de Firestore lo impiden al navegador).
// 1) Comprueba que quien guarda es el dispositivo activo (una sola partida abierta a la vez) y que el juego es de la
//    versión actual.
// 2) Compara la partida nueva con la última aceptada (revisar.js).
// 3) Si es imposible, no la guarda y devuelve la última partida buena para que el juego vuelva a ella.
//    Si es sospechosa, la guarda pero la apunta en flags/ para que la revise un administrador.
// 4) Con «accion», además hace en el servidor una tirada del gacha (gacha.js) o una mejora de la tienda (tienda.js)
//    sobre esa partida y la guarda ya con el resultado. Desde la versión 7.2 las tiradas, los edificios y los guantes
//    solo cambian así (modo estricto de revisar.js).
// Todo va en una transacción: dos peticiones a la vez nunca se pisan, y una petición antigua que llegue tarde
// (número q menor que el último guardado de esa sesión) no sobrescribe una más nueva.
// =====================================================================================
const crypto = require("crypto");
const {FieldValue, Timestamp} = require("firebase-admin/firestore");
const {revisar} = require("./revisar");
const gacha = require("./gacha");
const tienda = require("./tienda");
const semana = require("./semana");
const diario = require("./diario");
const minijuego = require("./minijuego");
const codigo = require("./codigo");

const MAX = 1000000;
const VMIN = [7, 2];

function leer(txt) {
  if (typeof txt !== "string") return null;
  try {
    const o = JSON.parse(txt);
    return o && typeof o === "object" && !Array.isArray(o) ? o : null;
  } catch (e) {
    return null;
  }
}
const ver = (v) => { const m = /^(\d+)\.(\d+)/.exec(String(v || "")); return m ? [+m[1], +m[2]] : [0, 0]; };
const verOk = (v) => { const a = ver(v); return a[0] > VMIN[0] || (a[0] === VMIN[0] && a[1] >= VMIN[1]); };

// firma de la partida, la misma que pone el juego (si no cuadra, el juego cree que alguien la ha editado a mano)
const _hs = (str) => {
  let h1 = 0xdeadbeef ^ 0x5f3a, h2 = 0x41c6ce57 ^ 0x2b9d;
  for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
};
function firmar(obj, uid) {
  const o = Object.assign({}, obj);
  delete o._h;
  const j = JSON.stringify(o), k = "pgc·" + ("gacha-pkmn-v3-" + uid).length * 7919 + "·brisa";
  return j.slice(0, -1) + ',"_h":"' + _hs(j + k) + '"}';
}

const rndCripto = () => crypto.randomInt(0, 4294967296) / 4294967296;
// fecha de hoy en Madrid (AAAA-MM-DD): el presupuesto diario de premios empieza de cero cada día
const DMF = new Intl.DateTimeFormat("en-CA", {timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit"});
const diaMadrid = (t) => DMF.format(new Date(t));

// db: Firestore (admin) · uid: quién llama · p: {data, sess, v, q, accion} · ahora: ms · cuentaSeg: antigüedad (s)
async function guardar(db, uid, p, ahora, cuentaSeg, rnd) {
  if (!uid) return {ok: false, why: "sin-cuenta"};
  const ac = p && p.accion && typeof p.accion === "object" ? p.accion : null;
  if (ac && ac.k === "hola") return {ok: true, hola: 1}; // para despertar el servidor al entrar
  if (!verOk(p && p.v)) return {ok: false, why: "version"};
  const data = p && p.data, sess = p && typeof p.sess === "string" ? p.sess.slice(0, 64) : "";
  const q = p && typeof p.q === "number" && isFinite(p.q) ? p.q : 0;
  if (typeof data !== "string" || data.length > MAX) return {ok: false, why: "formato"};
  if (!leer(data)) return {ok: false, why: "formato"};
  if (ac && !["tirar", "mejorar", "semana", "diario", "minijuego", "codigo"].includes(ac.k)) return {ok: false, why: "accion"};

  let flags = [];
  const out = await db.runTransaction(async (tx) => {
    // (Firestore repite la transacción si choca con otra petición: cada intento parte de la partida recibida, sin tocar)
    flags = [];
    const next = leer(data);
    // solo guarda el dispositivo que tiene la partida abierta
    const ss = await tx.get(db.doc("sess/" + uid));
    if (ss.exists && ss.data().s && ss.data().s !== sess) return {ok: false, why: "sesion", d: String(ss.data().d || "")};
    const ref = db.doc("users/" + uid);
    const snap = await tx.get(ref);
    const cur = snap.exists ? snap.data() : null;
    if (cur && sess && cur.sess === sess && q && typeof cur.q === "number" && q <= cur.q) return {ok: false, why: "viejo"};
    const prevTxt = cur ? cur.data : null;
    const prev = leer(prevTxt);
    const upd = cur && cur.updated && cur.updated.toMillis ? cur.updated.toMillis() : 0;
    const dt = prev && upd ? (ahora - upd) / 1000 : Math.max(0, Number(cuentaSeg) || 0);
    const venta = (await ventas(db, uid, prev, next)) + (await devuelto(db, uid, prev, next));
    // modo estricto cuando la última partida guardada ya venía de la versión 7.2 o posterior
    const estricto = !!prev && verOk(cur && cur.v);
    const r = revisar(prev, next, dt, venta, {estricto, eco: cur && cur.eco, hoy: diaMadrid(ahora)});
    const apunta = (estado) => flags.push({uid, n: String(next.nick || "").slice(0, 40), at: FieldValue.serverTimestamp(), estado,
      motivos: r.motivos.slice(0, 10), datos: r.datos, primera: !prev});

    // una cuenta sin partida en la nube puede estar subiendo la que jugó sin cuenta: se acepta y, si es rara, se apunta
    if (r.estado === "imposible" && prev) {
      apunta("rechazado");
      return {ok: false, why: "rechazado", motivos: r.motivos.slice(0, 5), last: typeof prevTxt === "string" ? prevTxt : null};
    }
    let dataOut = data;
    const extra = {};
    if (ac && ac.k === "tirar") {
      const t = gacha.tirar(next, ac.n, ac.sup, ahora, rnd || rndCripto);
      if (t.error) return {ok: false, why: t.error, coste: t.coste};
      Object.assign(extra, {tirada: t});
      dataOut = firmar(next, uid);
    } else if (ac && ac.k === "semana") {
      // premios de la semana pasada (torneo y clasificaciones): puesto y premio calculados aquí, una sola vez
      const s = await semana.cobrarSemana(db, uid, next, ahora, cur && cur.sem, rnd || rndCripto);
      Object.assign(extra, {semana: s});
      extra.sem = s.pw;
      if (!s.ya) dataOut = firmar(next, uid);
    } else if (ac && ac.k === "diario") {
      // regalo diario y racha: una vez al día, con la cuenta del servidor
      const d = diario.cobrarDiario(next, cur && cur.dia, prev, ahora, cuentaSeg, rnd || rndCripto);
      Object.assign(extra, {diario: d.out});
      extra.dia = d.dia;
      dataOut = firmar(next, uid);
    } else if (ac && ac.k === "codigo") {
      // código de regalo: comprobado aquí (existe, quedan usos, no lo has usado ya) y su premio va en este guardado
      const k = await codigo.canjear(tx, db, uid, next, ac, ahora);
      if (k.error) return {ok: false, why: k.error};
      Object.assign(extra, {codigo: k.out});
      dataOut = firmar(next, uid);
    } else if (ac && ac.k === "minijuego") {
      // premio de una partida de minijuego: puntuación comprobada y 3 partidas con premio al día, contadas aquí
      const m = await minijuego.premioMinijuego(db, uid, next, cur && cur.mgd, prev, ac, ahora, rnd || rndCripto);
      if (m.error) return {ok: false, why: m.error};
      Object.assign(extra, {minijuego: m.out});
      extra.mgd = m.mgd;
      dataOut = firmar(next, uid);
    } else if (ac && ac.k === "mejorar") {
      const m = tienda.mejorar(next, ac.i, ac.n);
      if (m.error) return {ok: false, why: m.error, coste: m.coste};
      Object.assign(extra, {mejora: m});
      dataOut = firmar(next, uid);
    }
    const doc = {data: dataOut, updated: Timestamp.fromMillis(ahora), sess: sess || null, v: String(p.v).slice(0, 12), q};
    if (r.eco) doc.eco = r.eco; // lo ganado hoy por premios
    const sem = extra.sem || (cur && cur.sem);
    if (sem) doc.sem = sem; // última semana cuyos premios ya se cobraron
    delete extra.sem;
    const dia = extra.dia || (cur && cur.dia);
    if (dia) doc.dia = dia; // regalo diario: último día cobrado, racha y regalos cobrados
    delete extra.dia;
    const mgd = extra.mgd || (cur && cur.mgd);
    if (mgd) doc.mgd = mgd; // partidas de minijuego con premio de hoy
    delete extra.mgd;
    tx.set(ref, doc);
    if (r.estado !== "ok") apunta(r.estado === "imposible" ? "primera subida rara" : "sospechoso");
    // at: la hora exacta del guardado, para que el juego sepa al volver a entrar si su copia es la continuación de esta
    return Object.assign({ok: true, estado: r.estado, at: ahora}, extra);
  });
  for (const f of flags) await db.collection("flags").add(f).catch(() => {});
  return out;
}

// ventas del mercadillo cobradas desde el último guardado: el juego apunta en mkPaid cada venta que cobra y no borra el
// anuncio hasta que el guardado se ha aceptado, así el servidor puede comprobar que esa venta existe y lo que valía
const FEE = 0.05;
async function ventas(db, uid, prev, next) {
  const pp = prev && prev.mkPaid && typeof prev.mkPaid === "object" ? prev.mkPaid : {};
  const np = next && next.mkPaid && typeof next.mkPaid === "object" ? next.mkPaid : {};
  const ids = Object.keys(np).filter((k) => !(k in pp) && /^[A-Za-z0-9_-]{1,64}$/.test(k)).slice(0, 60);
  if (!ids.length) return 0;
  try {
    const docs = await db.getAll(...ids.map((k) => db.doc("market/" + k)));
    let s = 0;
    for (const d of docs) {
      const v = d.exists ? d.data() : null;
      if (v && v.s === uid && v.st === "sold" && typeof v.pr === "number") s += Math.floor(Math.max(0, Math.min(v.pr, 2e9)) * (1 - FEE));
    }
    return s;
  } catch (e) {
    return 0;
  }
}

// tickets devueltos por un administrador (Moderación → corregir partida): el juego apunta fixAt al aplicarla y no borra
// la corrección hasta que este guardado se ha aceptado
async function devuelto(db, uid, prev, next) {
  const a = next && typeof next.fixAt === "number" ? next.fixAt : 0;
  if (!a || (prev && prev.fixAt === a)) return 0;
  try {
    const d = await db.doc("fixes/" + uid).get();
    const v = d.exists ? d.data() : null;
    return v && v.at === a && typeof v.add === "number" ? Math.max(0, Math.min(v.add, 1e18)) : 0;
  } catch (e) {
    return 0;
  }
}

module.exports = {guardar, leer, firmar, verOk, diaMadrid};
