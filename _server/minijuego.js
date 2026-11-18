// =====================================================================================
// Premios de los minijuegos en el servidor. El servidor lleva su propio contador de partidas con premio de cada día
// (users.mgd: 3 por minijuego), comprueba que la puntuación es posible (máximos de cada juego y, en los que no tienen
// final, el tiempo jugado desde que empezó la partida según el servidor) y calcula el premio con las fórmulas del
// juego: tickets según la puntuación (como mucho 400.000, ×2 en la franja de minijuegos) y objetos al azar.
// =====================================================================================
const E = require("./economia");
const gacha = require("./gacha");

const MG_DAY = 3;
// tickets por punto de cada minijuego (jig: el extra por jugar sin ayuda no cuenta para el premio)
const RW = {who: 60, mem: 90, dig: 2500, fish: 700, thr: 90, run: 180, exc: 150, wgt: 110, fos: 120, puz: 45, hl: 110, jig: 45};
// puntuación máxima (los que tienen un número fijo de rondas); run, wgt y hl dependen del tiempo jugado
const MAX = {who: 6000, mem: 1700, dig: 400, fish: 3000, thr: 2500, exc: 2500, fos: 2500, puz: 50000, jig: 50000};
const PORTIEMPO = {
  run: (s) => Math.max(350 * s + 5000, 420 * s + 3000),
  wgt: (s) => { const n = s / 0.45 + 3; return 175 * n + 5 * n * n; },
  hl: (s) => { const n = s / 0.45 + 3; return 175 * n + 5 * n * n; },
};
const diaUTC = (t) => new Date(t).toISOString().slice(0, 10);

// ¿es posible esa puntuación? (inicio: hora en que empezó la partida según el servidor, o 0 si no consta)
function puntosOk(g, sc, inicio, ahora) {
  if (!(typeof sc === "number" && Number.isFinite(sc) && sc >= 0 && sc <= 5e6)) return false;
  if (MAX[g] != null) return sc <= MAX[g];
  const f = PORTIEMPO[g];
  if (!f) return false;
  if (!inicio) return false;
  const s = Math.min(10800, Math.max(0, (ahora - inicio) / 1000));
  return sc <= f(s);
}

// S: la partida (se modifica) · mgd: contador del servidor · prev: última partida guardada · ac: {g, sc, b}
async function premioMinijuego(db, uid, S, mgd, prev, ac, ahora, rnd) {
  const g = String(ac && ac.g || "");
  if (!RW[g]) return {error: "minijuego"};
  const sc = Math.round(E.num(ac.sc));
  const hoy = diaUTC(ahora);
  // contador del día: el del servidor; la primera vez, el de la última partida guardada
  let c = mgd && mgd.d === hoy ? mgd : null;
  if (!c) { const pm = prev && prev.mg && prev.mg.d === hoy && prev.mg.n ? prev.mg.n : {}; c = {d: hoy, n: Object.assign({}, pm)}; }
  c = {d: hoy, n: Object.assign({}, c.n || {})};
  S.mg = S.mg && typeof S.mg === "object" ? S.mg : {};
  if (S.mg.d !== hoy) { S.mg.d = hoy; S.mg.n = {}; }
  S.mg.n = S.mg.n || {};
  S.mg.best = S.mg.best || {};
  const ya = Math.max(0, Math.floor(E.num(c.n[g])));
  if (ya >= MG_DAY || sc <= 0) { S.mg.n[g] = ya; return {mgd: c, out: {g, premio: null, n: ya, left: Math.max(0, MG_DAY - ya)}}; }
  let inicio = 0;
  if (PORTIEMPO[g]) {
    try { const d = await db.doc("play/" + uid + "/g/" + g).get(); if (d.exists && d.data().at && d.data().at.toMillis) inicio = d.data().at.toMillis(); } catch (e) { inicio = 0; }
  }
  if (!puntosOk(g, sc, inicio, ahora)) return {error: "puntos"};
  // premio, como mgEnd() del juego
  const old = Math.max(0, Math.floor(E.num(prev && prev.mg && prev.mg.best && prev.mg.best[g]))), rec = sc > old;
  const b = g === "jig" && ac.b === 1.5 ? 1.5 : 1;
  const mul = gacha.franjas(ahora).some((s) => s.k === "mg") ? 2 : 1;
  const rw = {t: Math.min(400000, Math.round(sc / b * RW[g])) * mul, it: {}};
  const q = rnd();
  if (q < 0.12) rw.it.ub = 1; else if (q < 0.35) rw.it.sb = 2; else if (q < 0.5) rw.it.pot = 2;
  if (rec && old > 0 && rnd() < 0.25) rw.it.cand = 1;
  S.t = E.num(S.t) + Math.round(rw.t * E.RMUL(S));
  S.bag = S.bag && typeof S.bag === "object" ? S.bag : {};
  for (const k in rw.it) S.bag[k] = (S.bag[k] || 0) + rw.it[k];
  c.n[g] = ya + 1;
  S.mg.n[g] = ya + 1;
  if (rec) S.mg.best[g] = Math.max(E.num(S.mg.best[g]), sc);
  return {mgd: c, out: {g, premio: rw, n: ya + 1, left: MG_DAY - ya - 1, rec}};
}

module.exports = {premioMinijuego, puntosOk, RW, MG_DAY};
