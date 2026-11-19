// =====================================================================================
// Premios semanales en el servidor: torneo semanal y clasificación de cada minijuego.
// El servidor mira la clasificación real de la semana pasada (tours/), calcula el puesto y el premio con las mismas
// tablas que el juego (datos.json → semanal) y los mete en la partida. Así nadie puede darse un puesto mejor ni
// cobrar dos veces. El juego solo enseña el premio.
// =====================================================================================
const D = require("./datos.json");
const E = require("./economia");
const W = D.semanal;
const P = D.P;

// fecha de Madrid y semana ISO, como isoWeek() del juego (que usa la hora del navegador)
const MDF = new Intl.DateTimeFormat("en-CA", {timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit"});
function semanaISO(t) {
  const [y, m, d0] = MDF.format(new Date(t)).split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, d0)), n = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - n);
  const y1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return d.getUTCFullYear() + "-W" + String(Math.ceil(((d - y1) / 864e5 + 1) / 7)).padStart(2, "0");
}
const semanaAnterior = (t) => semanaISO(t - 7 * 864e5);

function juegoTorneo(w) {
  const n = parseInt(String(w).split("-W")[1], 10) + parseInt(w, 10) * 53;
  let ids = W.tourRot[0][1];
  for (const r of W.tourRot) if (String(w) >= r[0]) ids = r[1];
  const L = ids.split(" ").filter((id) => W.mgs.includes(id));
  return L[n % L.length];
}
const claveTorneo = (w) => (String(w) >= W.tourMgrFrom ? w + "_" + juegoTorneo(w) : w);

function rngS(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
// Pokémon de premio de cada semana (los mismos que enseña el juego)
function pokemonSemana(w) {
  let h = 0;
  for (const ch of String(w)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const r = rngS(h), pk = (a) => a[Math.floor(r() * a.length)];
  // los Pokémon añadidos después (Megas de Z-A) no entran, para que los premios anunciados no cambien
  const fuera = new Set(W.tourFuera || []), P0 = P.filter((p) => !fuera.has(p[0]));
  const o = {leg: pk(P0.filter((p) => p[2] === "L")), mega: pk(P0.filter((p) => p[2] === "M"))};
  o.shy = pk(P0.filter((p) => p[2] === "E"));
  o.top = pk(P0.filter((p) => p[2] === "E" && p !== o.shy));
  // premios fijados a mano para alguna semana
  const fx = (W.tourFix || {})[w];
  if (fx) for (const k in fx) { const q = P.find((p) => p[0] === fx[k]); if (q) o[k] = q; }
  return o;
}

// tickets: lo mayor entre una cantidad fija y unas horas de producción (el juego multiplica después por el prestigio)
const tkOf = (T, S) => Math.max(T.t, Math.round(E.tps(S) * 3600 * (T.h || 0)));
const nivelTorneo = (pos) => W.tourTiers[pos < 0 ? 5 : pos < 3 ? pos : pos < 10 ? 3 : pos < 25 ? 4 : 5];
const nivelMgr = (pos) => (pos < 0 ? null : pos < 3 ? W.mgrTier[pos] : pos < 10 ? W.mgrTier[3] : pos < 25 ? W.mgrTier[4] : null);
const sumar = (it, k, q) => { it[k] = (it[k] || 0) + q; };

function premioTorneo(pos, w, S, rnd) {
  const T = nivelTorneo(pos), rw = {t: tkOf(T, S), it: Object.assign({}, T.it)};
  for (let n = 0; n < (T.hold | 0); n++) sumar(rw.it, W.hold[Math.floor(rnd() * W.hold.length)], 1);
  let mon = null, sh = false;
  if (T.mon) { mon = pokemonSemana(w)[T.mon][0]; sh = T.sh >= 1 || rnd() < (T.sh || 0.05); }
  return {pos, k: T.k, rw, mon, sh};
}
function premioMgr(gid, pos, S, rnd) {
  const T = nivelMgr(pos);
  if (!T) return null;
  const rw = {t: tkOf(T, S), it: Object.assign({}, T.it)}, ex = W.mgrEx[gid] || {};
  for (let k = 0; k < T.x; k++) {
    for (const i of Object.keys(ex)) {
      if (i === "_hold") sumar(rw.it, W.hold[Math.floor(rnd() * W.hold.length)], 1);
      else if (i === "_evo") sumar(rw.it, W.evo[Math.floor(rnd() * W.evo.length)], 1);
      else sumar(rw.it, i, ex[i]);
    }
  }
  return {gid, pos, rw};
}

// lo que da el juego al recibir un premio: tickets × prestigio y objetos a la mochila
function aplicar(S, rw) {
  S.t = E.num(S.t) + Math.round((rw.t || 0) * E.RMUL(S));
  S.bag = S.bag && typeof S.bag === "object" ? S.bag : {};
  for (const k in rw.it || {}) S.bag[k] = (S.bag[k] || 0) + rw.it[k];
}

// puesto en una clasificación (como el juego: los 25 primeros por puntuación; -1 si no está entre ellos)
async function puesto(db, key, uid) {
  const sn = await db.collection("tours").doc(key).collection("s").orderBy("sc", "desc").limit(25).get();
  return sn.docs.findIndex((d) => d.id === uid);
}

// S: la partida (se modifica) · ya: semana que ya cobró según el servidor. Devuelve lo cobrado o {ya:1}
async function cobrarSemana(db, uid, S, ahora, ya, rnd) {
  const pw = semanaAnterior(ahora);
  const tYa = ya === pw || S.tourDone === pw, mYa = ya === pw || S.mgrDone === pw;
  if (tYa && mYa) return {pw, ya: 1};
  const out = {pw, torneo: null, mgr: []};
  // ¿en qué clasificaciones de la semana pasada participó? (una lectura por minijuego)
  const keys = W.mgs.map((g) => pw + "_" + g);
  const tk = claveTorneo(pw);
  if (!keys.includes(tk)) keys.push(tk);
  const docs = await db.getAll(...keys.map((k) => db.doc("tours/" + k + "/s/" + uid)));
  const esta = {};
  docs.forEach((d, i) => { if (d.exists && E.num(d.data().sc) > 0) esta[keys[i]] = 1; });
  if (!tYa && esta[tk]) {
    out.torneo = premioTorneo(await puesto(db, tk, uid), pw, S, rnd);
    out.torneo.g = juegoTorneo(pw);
    aplicar(S, out.torneo.rw);
    if (out.torneo.mon) {
      S.owned = S.owned && typeof S.owned === "object" ? S.owned : {};
      S.owned[out.torneo.mon] = (S.owned[out.torneo.mon] || 0) + 1;
      if (out.torneo.sh) { S.shiny = S.shiny || {}; S.shiny[out.torneo.mon] = (S.shiny[out.torneo.mon] || 0) + 1; }
    }
  }
  if (!mYa) {
    for (const g of W.mgs) {
      const k = pw + "_" + g;
      if (!esta[k]) continue;
      const p = premioMgr(g, await puesto(db, k, uid), S, rnd);
      if (p) { aplicar(S, p.rw); out.mgr.push(p); }
    }
  }
  S.tourDone = pw;
  S.mgrDone = pw;
  delete S.mgwPrev;
  return out;
}

module.exports = {cobrarSemana, semanaISO, semanaAnterior, juegoTorneo, claveTorneo, pokemonSemana};
