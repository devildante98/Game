// =====================================================================================
// Mejoras de la tienda en el servidor: edificios del pueblo (los que producen tickets) y guantes de entrenador.
// El precio lo calcula el servidor con las mismas fórmulas que el juego y lo cobra de la partida.
// =====================================================================================
const E = require("./economia");
const GLMAX = 30;

// i: edificio (0..6) o -1 para los guantes · n: niveles a subir. Modifica S. Devuelve {coste, nivel} o {error}.
function mejorar(S, i, n) {
  i = Number(i);
  n = Math.floor(Number(n));
  if (!Number.isInteger(i) || i < -1 || i >= E.G.length) return {error: "mejora"};
  if (!(n >= 1 && n <= 100000)) return {error: "cantidad"};
  S.g = Array.isArray(S.g) ? S.g : [];
  while (S.g.length < E.G.length) S.g.push(0);
  const a = i < 0 ? (S.cl | 0) : (S.g[i] | 0);
  if (i < 0 && a + n > GLMAX) n = GLMAX - a;
  if (n <= 0) return {error: "maximo"};
  const c = i < 0 ? E.costeGuantes(a, a + n) : E.costeEdificio(i, a, a + n);
  if (!(E.num(S.t) + 1e-6 >= c)) return {error: "saldo", coste: c};
  S.t = E.num(S.t) - c;
  if (i < 0) S.cl = a + n; else S.g[i] = a + n;
  return {coste: c, nivel: a + n, n};
}

module.exports = {mejorar, GLMAX};
