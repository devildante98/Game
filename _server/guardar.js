// =====================================================================================
// Guardar la partida: el servidor es el único que puede escribirla (las reglas de Firestore lo impiden al navegador).
// 1) Comprueba que quien guarda es el dispositivo activo (una sola partida abierta a la vez).
// 2) Compara la partida nueva con la última aceptada (revisar.js).
// 3) Si es imposible, no la guarda y devuelve la última partida buena para que el juego vuelva a ella.
//    Si es sospechosa, la guarda pero la apunta en flags/ para que la revise un administrador.
// =====================================================================================
const {FieldValue, Timestamp} = require("firebase-admin/firestore");
const {revisar} = require("./revisar");

const MAX = 1000000;

function leer(txt) {
  if (typeof txt !== "string") return null;
  try {
    const o = JSON.parse(txt);
    return o && typeof o === "object" && !Array.isArray(o) ? o : null;
  } catch (e) {
    return null;
  }
}

// db: Firestore (admin) · uid: quién llama · p: {data, sess} · ahora: ms · cuentaSeg: antigüedad de la cuenta (s)
async function guardar(db, uid, p, ahora, cuentaSeg) {
  if (!uid) return {ok: false, why: "sin-cuenta"};
  const data = p && p.data, sess = p && typeof p.sess === "string" ? p.sess.slice(0, 64) : "";
  if (typeof data !== "string" || data.length > MAX) return {ok: false, why: "formato"};
  const next = leer(data);
  if (!next) return {ok: false, why: "formato"};

  // solo guarda el dispositivo que tiene la partida abierta
  const ss = await db.doc("sess/" + uid).get();
  if (ss.exists && ss.data().s && ss.data().s !== sess) return {ok: false, why: "sesion", d: String(ss.data().d || "")};

  const ref = db.doc("users/" + uid);
  const snap = await ref.get();
  const prevTxt = snap.exists ? snap.data().data : null;
  const prev = leer(prevTxt);
  const upd = snap.exists && snap.data().updated && snap.data().updated.toMillis ? snap.data().updated.toMillis() : 0;
  const dt = prev && upd ? (ahora - upd) / 1000 : Math.max(0, Number(cuentaSeg) || 0);
  const venta = (await ventas(db, uid, prev, next)) + (await devuelto(db, uid, prev, next));
  const r = revisar(prev, next, dt, venta);

  const apunta = (estado) => db.collection("flags").add({
    uid, n: String(next.nick || "").slice(0, 40), at: FieldValue.serverTimestamp(), estado,
    motivos: r.motivos.slice(0, 10), datos: r.datos, primera: !prev,
  }).catch(() => {});

  // una cuenta sin partida en la nube puede estar subiendo la que jugó sin cuenta: se acepta y, si es rara, se apunta
  if (r.estado === "imposible" && prev) {
    await apunta("rechazado");
    return {ok: false, why: "rechazado", motivos: r.motivos.slice(0, 5), last: typeof prevTxt === "string" ? prevTxt : null};
  }
  await ref.set({data, updated: Timestamp.fromMillis(ahora), sess: sess || null});
  if (r.estado !== "ok") await apunta(r.estado === "imposible" ? "primera subida rara" : "sospechoso");
  // at: la hora exacta del guardado, para que el juego sepa al volver a entrar si su copia es la continuación de esta
  return {ok: true, estado: r.estado, at: ahora};
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

module.exports = {guardar, leer};
