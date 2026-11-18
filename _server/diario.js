// =====================================================================================
// Regalo diario y racha en el servidor. El servidor lleva su propia cuenta (users.dia: último día cobrado, racha y
// regalos cobrados), así que el regalo solo se cobra una vez al día y la racha no se puede inventar. La cantidad y
// los premios de la racha son los mismos que en el juego (datos.json → racha).
// =====================================================================================
const D = require("./datos.json");
const E = require("./economia");
const R = D.racha;

// el juego usa la fecha UTC (toISOString)
const diaUTC = (t) => new Date(t).toISOString().slice(0, 10);
const regalo = (dg, S) => { const n = Math.min(60, Math.max(0, Math.floor(E.num(dg)))); return Math.round((15000 + 4500 * n + 450 * n * n) * E.RMUL(S)); };
const temporada = (d) => Math.floor((Math.max(1, d) - 1) / 30);
function premioRacha(d) {
  const c = ((d - 1) % 30) + 1, ss = Math.min(4, temporada(d)), m = 1 + ss * 0.5, r = {}, b = R.T[c - 1];
  for (const k in b) r[k] = k === "mb" || k === "mint" || k === "hold" || k === "ppmax" ? b[k] + (ss >= 2 ? 1 : 0) : Math.max(1, Math.round(b[k] * m));
  if (ss >= 3 && c === 30) r.mb = (r.mb || 0) + 1;
  return r;
}

// la cuenta del servidor; la primera vez se toma de la última partida guardada, con topes: no más regalos que días
// tiene la cuenta, ni más racha que regalos
function cuentaInicial(prev, cuentaSeg) {
  const S = prev || {}, maxDias = Math.ceil(Math.max(0, E.num(cuentaSeg)) / 86400) + 1;
  const dg = Math.min(Math.max(0, Math.floor(E.num(S.dg))), maxDias);
  const sk = S.sk && typeof S.sk === "object" ? S.sk : {};
  return {d: typeof S.daily === "string" ? S.daily.slice(0, 10) : "", n: Math.min(Math.max(0, Math.floor(E.num(sk.n))), dg + 1),
    last: typeof sk.last === "string" ? sk.last.slice(0, 10) : "", best: Math.max(0, Math.floor(E.num(sk.best))), dg};
}

// S: la partida (se modifica) · dia: cuenta del servidor (o null) · prev: última partida guardada
function cobrarDiario(S, dia, prev, ahora, cuentaSeg, rnd) {
  const c = Object.assign({}, dia && typeof dia === "object" && typeof dia.dg === "number" ? dia : cuentaInicial(prev, cuentaSeg));
  const hoy = diaUTC(ahora), ayer = diaUTC(ahora - 864e5);
  const sk = () => ({n: c.n, last: c.last, best: c.best});
  if (c.d === hoy) {
    // ya cobrado hoy (en este u otro dispositivo): se devuelve la cuenta para que el juego se ponga al día
    Object.assign(S, {daily: hoy, dg: c.dg, sk: sk()});
    return {dia: c, out: {ya: 1, hoy, dg: c.dg, sk: sk()}};
  }
  c.n = c.last === ayer ? c.n + 1 : 1;
  c.last = hoy;
  c.best = Math.max(c.best, c.n);
  c.d = hoy;
  const gf = regalo(c.dg, S);
  c.dg += 1;
  const rw = premioRacha(c.n), it = {};
  let tk = 0;
  for (const k of Object.keys(rw)) {
    if (k === "t") { tk = Math.round(regalo(c.dg, S) * 0.3 * rw.t); continue; }
    if (k === "evo" || k === "mint" || k === "hold") {
      const L = R[k];
      for (let i = 0; i < rw[k]; i++) if (L.length) { const id = L[Math.floor(rnd() * L.length)]; it[id] = (it[id] || 0) + 1; }
      continue;
    }
    it[k] = (it[k] || 0) + rw[k];
  }
  S.t = E.num(S.t) + gf + tk;
  S.bag = S.bag && typeof S.bag === "object" ? S.bag : {};
  for (const k in it) S.bag[k] = (S.bag[k] || 0) + it[k];
  Object.assign(S, {daily: hoy, dg: c.dg, sk: sk()});
  return {dia: c, out: {hoy, gf, tk, it, dg: c.dg, sk: sk()}};
}

module.exports = {cobrarDiario, regalo, premioRacha, diaUTC};
