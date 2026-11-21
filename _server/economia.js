// =====================================================================================
// Cuentas de la economía del juego (las mismas fórmulas que usa el navegador), para que el servidor pueda
// comprobar por su cuenta lo que es posible: producción del pueblo, coste de mejoras, guantes y tiradas.
// =====================================================================================

// edificios: [coste base, tickets por segundo por nivel] y lo que sube el coste por nivel
const G = [[15, 0.1], [100, 0.6], [600, 3], [3500, 15], [20000, 80], [400000, 500], [6000000, 2500]];
const GGR = [1.15, 1.15, 1.15, 1.15, 1.15, 1.18, 1.25];

const num = (v) => (typeof v === "number" && isFinite(v) ? v : 0);
const prs = (S) => Math.max(0, Math.floor(num(S.prs)));
const PMUL = (S) => 1 + 0.5 * prs(S); // producción
const RMUL = (S) => 1 + 0.25 * prs(S); // premios
const PDISC = (S) => Math.max(0.5, 1 - 0.05 * prs(S)); // descuento en tiradas

// tickets por segundo del pueblo
function tps(S) {
  const g = Array.isArray(S.g) ? S.g : [];
  let a = 0;
  for (let i = 0; i < G.length; i++) a += G[i][1] * Math.max(0, num(g[i]));
  return a * PMUL(S);
}
// tickets por toque a la Poké Ball (guantes)
const cpc = (S) => 0.1 * Math.pow(2, Math.max(0, num(S.cl))) * PMUL(S);

// lo que cuesta subir el edificio i del nivel a al b
function costeEdificio(i, a, b) {
  let t = 0;
  for (let l = Math.max(0, a); l < b && l < 5000; l++) t += Math.ceil(G[i][0] * Math.pow(GGR[i] || 1.15, l));
  return t;
}
// lo que cuestan los guantes del nivel a al b
function costeGuantes(a, b) {
  let t = 0;
  for (let l = Math.max(0, a); l < b && l < 200; l++) t += Math.round(25 * Math.pow(3, Math.min(l, 20)) * Math.pow(2.3, Math.max(0, l - 20))); // ×3 por nivel hasta el 20, ×2,3 desde ahí
  return t;
}
// lo que cuestan las tiradas desde el contador c1 al c2 (normales o súper)
function costeTiradas(c1, c2, sup, S) {
  const b = sup ? 100 : 1, st = sup ? 300 : 30, q = sup ? 30 : 3;
  let t = 0;
  for (let c = Math.max(0, c1); c < c2 && c < c1 + 200000; c++) {
    const s = Math.floor(c / 10);
    t += b + st * s + q * s * s;
  }
  return t * PDISC(S);
}

// regalo automático de la Poké Ball: cada 30 s da (ak+11) tickets y ak sube 10, así que crece con el tiempo jugado
const TICK = 30;
function regaloAuto(S, dtSeg) {
  const n = Math.ceil(Math.max(0, num(dtSeg)) / TICK) + 1, a = Math.max(0, num(S.ak));
  return (n * (a + 11) + 5 * n * (n - 1)) * PMUL(S);
}

module.exports = {G, GGR, TICK, num, prs, PMUL, RMUL, PDISC, tps, cpc, costeEdificio, costeGuantes, costeTiradas, regaloAuto};
