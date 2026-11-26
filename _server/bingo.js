// =====================================================================================
// BINGO POKÉMON (8.3)
// Hay tres salas, cada una con su precio de cartón. Cada 6 minutos empieza una partida en cada sala:
//   · 0–90 s: se venden cartones (hasta 4 por jugador y partida, 40 al día entre todas las salas).
//   · desde los 90 s, el Entrenador virtual canta un Pokémon cada 3,5 s (60 Pokémon en el bombo).
// Cada cartón tiene 15 Pokémon en 3 filas de 5. Línea = una fila entera; Bingo = el cartón entero.
// Para ganar hay que «cantar» (como en el bingo de verdad) y hacerlo a tiempo: como mucho 3 bolas después de completar.
// Si varios completan con la misma bola, se reparten el premio. El bote son el 90 % de lo vendido (con 2 o más
// jugadores, como mínimo 3 cartones), un 30 % para la línea y un 70 % para el bingo, y objetos que mejoran si hay
// 3 jugadores o más.
// Los cartones los saca el servidor al azar al comprarlos. El orden de las bolas sale de «x», que cambia con cada
// cartón vendido: nadie lo puede saber hasta que se cierra la venta.
// Firestore (solo escribe el servidor):
//   bingo/{sala_ronda}: {s, r, n: cartones, np: jugadores, x, nk: [apodos], ln: {c, w: [uid], wn}, bn: {…}}
//   bingo/{sala_ronda}/p/{uid}: {c: [cartones en texto], nk, pl: cobrada la línea, pb: cobrado el bingo}
// =====================================================================================
const E = require("./economia");

const PER = 360000, LOB = 90000, CALL = 3500, POOL = 60, MAXC = 4, DIA = 40, GR = 3;
// salas: precio del cartón y objetos de premio (línea / bingo / bingo con 3 jugadores o más)
const SALAS = {
  b: {p: 10000, l: {pb: 5}, b: {sb: 5}, b3: {cand: 1}},
  c: {p: 1000000, l: {sb: 5}, b: {ub: 5}, b3: {cand: 3, ppmax: 1}},
  l: {p: 100000000, l: {ub: 5}, b: {cand: 3, tshard: 2}, b3: {mb: 1, crys: 1}},
};

function rng(str) {
  let h = 2166136261;
  for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  let a = h >>> 0;
  return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
// orden de las 60 bolas
function bolas(s, r, x) {
  const R = rng("bingo|" + s + "|" + r + "|" + (x >>> 0)), L = [];
  for (let i = 0; i < POOL; i++) L.push(i);
  for (let i = POOL - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [L[i], L[j]] = [L[j], L[i]]; }
  return L;
}
// bolas cantadas en este momento
function cantadas(r, ahora) {
  const t = ahora - (r * PER + LOB);
  return t < 0 ? 0 : Math.min(POOL, Math.floor(t / CALL) + 1);
}
// cartón: 15 números distintos (0–59), en texto de 30 letras (2 cifras en base 36 cada uno)
function carton(rnd) {
  const L = [];
  while (L.length < 15) { const v = Math.floor(rnd() * POOL); if (!L.includes(v)) L.push(v); }
  return [0, 1, 2].map((f) => L.slice(f * 5, f * 5 + 5).sort((a, b) => a - b)).flat().map((v) => v.toString(36).padStart(2, "0")).join("");
}
const leer = (c) => { const o = []; for (let i = 0; i < 30; i += 2) o.push(parseInt(c.slice(i, i + 2), 36)); return o; };
// en qué bola (1…60) se completa la primera línea y el cartón entero
function completa(c, orden) {
  const pos = {};
  orden.forEach((v, i) => { pos[v] = i + 1; });
  const v = leer(c), fila = (f) => Math.max(...v.slice(f * 5, f * 5 + 5).map((x) => pos[x]));
  return {l: Math.min(fila(0), fila(1), fila(2)), b: Math.max(...v.map((x) => pos[x]))};
}
// bote de una partida
function bote(s, d) {
  const S = SALAS[s], n = Math.max(0, d.n | 0), np = Math.max(0, d.np | 0);
  const t = Math.max(Math.floor(0.9 * n * S.p), np >= 2 ? 3 * S.p : 0);
  return {l: Math.floor(t * 0.3), b: t - Math.floor(t * 0.3), il: S.l, ib: Object.assign({}, S.b, np >= 3 ? S.b3 : {})};
}
const sumar = (a, b) => { const o = Object.assign({}, a); for (const k in b) o[k] = (o[k] | 0) + b[k]; return o; };
const idOk = (ac) => {
  const s = String((ac && ac.s) || ""), r = Math.floor(Number(ac && ac.r));
  return SALAS[s] && isFinite(r) && r > 0 ? {s, r, id: s + "_" + r} : null;
};

// ac: {k:"bingo", op:"comprar"|"cantar"|"cobrar", s: sala, r: ronda, n?: cartones, t?: "l"|"b"}
// prevDia: {d, n} cartones comprados hoy (del documento del usuario) · hoy: AAAA-MM-DD
async function bingo(tx, db, uid, S, ac, ahora, prevDia, hoy, rnd) {
  const op = ac && ac.op, k = idOk(ac);
  if (!k) return {error: "bingo-sala"};
  const ref = db.doc("bingo/" + k.id), pref = db.doc("bingo/" + k.id + "/p/" + uid);
  const rs = await tx.get(ref), ps = await tx.get(pref);
  const d = rs.exists ? rs.data() : {s: k.s, r: k.r, n: 0, np: 0, x: 0, nk: []}, p = ps.exists ? ps.data() : null;
  const ahoraR = Math.floor(ahora / PER);

  if (op === "comprar") {
    const n = Math.floor(Number(ac.n));
    if (!(n >= 1 && n <= MAXC)) return {error: "bingo-n"};
    if (k.r < ahoraR || k.r > ahoraR + 1 || ahora >= k.r * PER + LOB) return {error: "bingo-cerrado"};
    const ya = p && Array.isArray(p.c) ? p.c.length : 0;
    if (ya + n > MAXC) return {error: "bingo-max"};
    const dia = prevDia && prevDia.d === hoy ? Math.max(0, prevDia.n | 0) : 0;
    if (dia + n > DIA) return {error: "bingo-dia"};
    const coste = SALAS[k.s].p * n;
    if (!(E.num(S.t) + 1e-6 >= coste)) return {error: "saldo", coste};
    S.t = E.num(S.t) - coste;
    const nuevos = [];
    for (let i = 0; i < n; i++) nuevos.push(carton(rnd));
    const nk = String(S.nick || "Entrenador").replace(/[<>]/g, "").slice(0, 20) || "Entrenador";
    let x = d.x >>> 0;
    for (let i = 0; i < n; i++) x = (x ^ Math.floor(rnd() * 4294967296)) >>> 0;
    const out = {s: k.s, r: k.r, n: (d.n | 0) + n, np: (d.np | 0) + (p ? 0 : 1), x,
      nk: p ? (Array.isArray(d.nk) ? d.nk : []) : (Array.isArray(d.nk) ? d.nk : []).concat([nk]).slice(-40)};
    if (d.ln) out.ln = d.ln;
    if (d.bn) out.bn = d.bn;
    tx.set(ref, out);
    tx.set(pref, Object.assign({}, p || {}, {c: (p && Array.isArray(p.c) ? p.c : []).concat(nuevos), nk, at: ahora}));
    return {out: {op, s: k.s, r: k.r, c: nuevos, coste}, dia: {d: hoy, n: dia + n}};
  }

  if (op === "cantar") {
    const t = ac.t === "b" ? "b" : ac.t === "l" ? "l" : "";
    if (!t) return {error: "bingo-op"};
    if (!p || !Array.isArray(p.c) || !p.c.length) return {error: "bingo-sin-carton"};
    const cur = cantadas(k.r, ahora);
    if (!cur) return {error: "bingo-pronto"};
    if (ahora >= (k.r + 1) * PER) return {error: "bingo-tarde"};
    const orden = bolas(k.s, k.r, d.x);
    // la mejor jugada de sus cartones que ya se ha completado
    let ci = 99;
    for (const c of p.c) { const m = completa(String(c), orden); if (m[t] <= cur) ci = Math.min(ci, m[t]); }
    if (ci === 99) return {error: "bingo-falso"};
    // en el bingo, la línea tiene que estar cerrada antes (siempre lo está: una línea sale antes que el cartón entero)
    const key = t === "l" ? "ln" : "bn", prev = d[key];
    if (prev && cur > prev.c + GR) return {error: "bingo-tarde"};
    if (cur > ci + GR) return {error: "bingo-tarde"};
    const nk = String((p && p.nk) || S.nick || "Entrenador").slice(0, 20);
    let nuevo;
    if (!prev || ci < prev.c) nuevo = {c: ci, w: [uid], wn: [nk]};
    else if (ci === prev.c) {
      if ((prev.w || []).includes(uid)) return {out: {op, s: k.s, r: k.r, t, c: ci, ya: 1}};
      nuevo = {c: ci, w: (prev.w || []).concat([uid]).slice(0, 50), wn: (prev.wn || []).concat([nk]).slice(0, 50)};
    } else return {error: "bingo-ya"};
    tx.set(ref, Object.assign({}, d, {[key]: nuevo}));
    return {out: {op, s: k.s, r: k.r, t, c: ci}};
  }

  if (op === "cobrar") {
    if (!p) return {error: "bingo-sin-carton"};
    const cur = cantadas(k.r, ahora), b = bote(k.s, d);
    const cerrado = (x) => x && (cur > x.c + GR || ahora >= (k.r + 1) * PER);
    let t = 0, it = {}, pl = !!p.pl, pb = !!p.pb, ok = 0;
    if (!pl && cerrado(d.ln) && (d.ln.w || []).includes(uid)) { const w = d.ln.w.length; t += Math.floor(b.l / w); it = sumar(it, w === 1 ? b.il : {}); pl = true; ok |= 1; }
    if (!pb && cerrado(d.bn) && (d.bn.w || []).includes(uid)) { const w = d.bn.w.length; t += Math.floor(b.b / w); it = sumar(it, b.ib); pb = true; ok |= 2; }
    if (!ok) return {error: "bingo-nada"};
    S.t = E.num(S.t) + t;
    S.bag = S.bag && typeof S.bag === "object" ? S.bag : {};
    for (const i in it) S.bag[i] = E.num(S.bag[i]) + it[i];
    tx.set(pref, Object.assign({}, p, {pl, pb}));
    return {out: {op, s: k.s, r: k.r, t, it, l: !!(ok & 1), b: !!(ok & 2)}};
  }
  return {error: "bingo-op"};
}

module.exports = {bingo, bolas, cantadas, carton, completa, bote, leer, SALAS, PER, LOB, CALL, POOL, MAXC, DIA, GR};
