// =====================================================================================
// Tiradas del gacha en el servidor: las mismas reglas que el juego (p_*.js / orig.html), pero aquí el azar y el cobro
// los decide el servidor, así que no se pueden elegir resultados ni tirar gratis.
//  · rareza: normales 75 % C, 20 % R, 4 % E, 1 % L, con garantía (pity) de E/L; súper 45/33/17/5
//  · Pokémon de la rareza: destacado de la semana (15 %), evento de temporada (35 %), alguno que ya tienes (20 %)
//  · franjas especiales (hora de Madrid): lluvia de legendarios, variocolores ×3 y Día de la Comunidad
//  · repetidos: devuelven tickets según rareza; megas/Gigamax repetidas → Caramelos Raros o tickets
// Los datos (lista de Pokémon, formas supremas, eventos) salen del juego: src/tools/servidor/exportar_datos.js
// =====================================================================================
const crypto = require("crypto");
const D = require("./datos.json");
const E = require("./economia");

const P = D.P; // [nombre, tipo, rareza, generación]
const PM = {};
P.forEach((p) => { PM[p[0]] = p; });
const SUP = new Set(D.sup);
const isSup = (n) => SUP.has(n);
const isMegaF = (n) => /^Mega-| Gigamax$/.test(String(n || "")) && !isSup(n);
const REF = {C: 0, R: 1, E: 2, M: 3, L: 4};
const BALLR = {C: "pb", R: "sb", E: "ub", M: "ub", L: "mb"};
const SHINY_G = 1 / 500, SHINY_S = 1 / 250;
const ORD = "CREML";
const PITY = (S) => (E.prs(S) >= 6 ? 20 : E.prs(S) >= 3 ? 25 : 30);
const POOL = {};
for (const r of ["C", "R", "E", "M", "L"]) POOL[r] = P.filter((p) => p[2] === r || (r === "E" && p[2] === "M"));

const rndCripto = () => crypto.randomInt(0, 4294967296) / 4294967296;

// ---- calendario (hora de Madrid, como el juego) ----
let MDF = null;
function madrid(t) {
  if (!MDF) MDF = new Intl.DateTimeFormat("es-ES", {timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false});
  const o = {};
  MDF.formatToParts(new Date(t)).forEach((x) => { o[x.type] = x.value; });
  return o;
}
function cdMon(key) {
  let h = 0;
  for (const ch of "cd" + key) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const pool = P.filter((p) => p[2] === "R" || p[2] === "E");
  return pool[Math.abs(h) % pool.length];
}
function franjas(now) {
  const out = [];
  for (let d = -1; d <= 1; d++) {
    const t = now + d * 864e5, o = madrid(t), key = o.year + o.month + o.day;
    const base = t - ((+o.hour) * 36e5 + (+o.minute) * 6e4) - (new Date(t).getSeconds() * 1e3 + new Date(t).getMilliseconds());
    let h = 0;
    for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) | 0;
    h = Math.abs(h);
    out.push({a: base + 13 * 36e5, b: base + 14 * 36e5, k: D.hh[h % D.hh.length]}, {a: base + 20 * 36e5, b: base + 21 * 36e5, k: D.hh[(h >> 3) % D.hh.length]});
    if (/^s[aá]b/i.test(o.weekday || "")) out.push({a: base + 16 * 36e5, b: base + 19 * 36e5, k: "cd", mon: cdMon(key)});
  }
  return out.filter((s) => now >= s.a && now < s.b);
}
const multShiny = (L) => (L.some((s) => s.k === "shiny") ? 3 : L.some((s) => s.k === "cd") ? 2 : 1);
function eventoTemporada(now) {
  const o = madrid(now), v = (+o.month) * 100 + (+o.day);
  return D.eventos.find((e) => { const a = e.a[0] * 100 + e.a[1], b = e.b[0] * 100 + e.b[1]; return a <= b ? v >= a && v <= b : (v >= a || v <= b); }) || null;
}
// el lunes de la semana (fecha de Madrid), como weekKey() del juego
function semana(now) {
  const o = madrid(now), d = new Date(Date.UTC(+o.year, +o.month - 1, +o.day, 12));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + String(d.getUTCDate()).padStart(2, "0");
}
function rngS(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const pvHash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
function destacado(now) {
  const r = rngS(pvHash("feat" + semana(now))), pool = P.filter((p) => (p[2] === "E" || p[2] === "R") && p[3] < 10);
  return pool[Math.floor(r() * pool.length)];
}

// ---- una tirada ----
function crearTirador(S, now, rnd) {
  const L = franjas(now), cd = L.find((s) => s.k === "cd"), leg = L.some((s) => s.k === "leg");
  const ev = eventoTemporada(now), feat = destacado(now);
  const elegirBase = (r) => {
    const pool = POOL[r];
    if (feat && feat[2] === r && rnd() < 0.15) return feat;
    if (ev && rnd() < 0.35) { const ep = pool.filter((p) => ev.t.includes(p[1])); if (ep.length) return ep[Math.floor(rnd() * ep.length)]; }
    if (rnd() < 0.2) { const own = pool.filter((p) => S.owned[p[0]]); if (own.length) return own[Math.floor(rnd() * own.length)]; }
    return pool[Math.floor(rnd() * pool.length)];
  };
  const elegirCd = (r) => (cd && rnd() < 0.3 && ORD.indexOf(cd.mon[2]) <= ORD.indexOf(r) + 1 ? cd.mon : elegirBase(r));
  const elegir = (r) => { let p = elegirCd(r); for (let i = 0; i < 20 && p && isSup(p[0]); i++) p = elegirCd(r); return p; };
  const normal = () => {
    if (leg && rnd() < 0.02) { S.pity = 0; return elegir("L"); }
    let r;
    if ((S.pity | 0) >= PITY(S) - 1) r = rnd() < 0.25 ? "L" : "E";
    else { const x = rnd() * 100; r = x < 1 ? "L" : x < 5 ? "E" : x < 25 ? "R" : "C"; }
    S.pity = (r === "E" || r === "L") ? 0 : (S.pity | 0) + 1;
    return elegir(r);
  };
  const super_ = () => { const x = rnd() * 100, r = x < 5 ? "L" : x < 22 ? "E" : x < 55 ? "R" : "C"; if (r === "E" || r === "L") S.pity = 0; return elegir(r); };
  return {normal, super_, mShiny: multShiny(L)};
}

// coste exacto de n tiradas (el juego redondea a décimas)
function coste(S, n, sup) {
  const c = (sup ? S.sp : S.np) || 0;
  return Math.round(E.costeTiradas(c, c + n, sup, S) * 10) / 10;
}

// S: la partida (se modifica). Devuelve lo que el juego tiene que aplicar, o {error}.
function tirar(S, n, sup, now, rnd) {
  rnd = rnd || rndCripto;
  n = n | 0;
  sup = !!sup;
  if (![1, 10, 100].includes(n)) return {error: "cantidad"};
  S.owned = S.owned && typeof S.owned === "object" ? S.owned : {};
  S.bag = S.bag && typeof S.bag === "object" ? S.bag : {};
  const c = coste(S, n, sup);
  if (!(E.num(S.t) + 1e-6 >= c)) return {error: "saldo", coste: c};
  S.t = E.num(S.t) - c;
  if (sup) S.sp = (S.sp || 0) + n; else S.np = (S.np || 0) + n;
  const T = crearTirador(S, now, rnd), shG = SHINY_G * T.mShiny, shS = SHINY_S * T.mShiny;
  const res = [];
  let back = 0, cand = 0;
  S.balls = S.balls || {};
  S.when = S.when || {};
  for (let i = 0; i < n; i++) {
    const p = sup ? T.super_() : T.normal(), name = p[0];
    const isNew = !((S.owned[name] || 0) > 0 || !!(S.reg && S.reg[name]));
    if (!S.owned[name]) { S.balls[name] = BALLR[p[2]]; S.when[name] = now; }
    S.owned[name] = (S.owned[name] || 0) + 1;
    S.pulls = (S.pulls || 0) + 1;
    const sh = rnd() < (sup ? shS : shG);
    if (sh) { S.shiny = S.shiny || {}; S.shiny[name] = (S.shiny[name] || 0) + 1; }
    let r = isNew ? 0 : REF[p[2]], md = 0;
    if (!isNew && isMegaF(name)) {
      // mega/Gigamax repetida: no se acumula; al azar 1-2 Caramelos Raros o tickets
      S.owned[name] = Math.max(1, (S.owned[name] | 0) - 1);
      if (rnd() < 0.5) { const q = 1 + (rnd() < 0.35 ? 1 : 0); S.bag.cand = (S.bag.cand || 0) + q; cand += q; r = -q; md = 1; }
      else { r = Math.round(Math.max(5000, coste(S, 1, false) * 5)); md = 2; }
    }
    back += Math.max(0, r);
    res.push([name, isNew ? 1 : 0, r, sh ? 1 : 0, md]);
  }
  S.t += back;
  return {res, coste: c, back, cand, pity: S.pity | 0, np: S.np | 0, sp: S.sp | 0};
}

module.exports = {tirar, coste, PM, isSup, isMegaF, franjas, eventoTemporada, destacado, semana, POOL};
