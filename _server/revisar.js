// =====================================================================================
// Revisión de cada guardado: compara la partida nueva con la última aceptada y el tiempo real que ha pasado.
//  · "ok": todo cuadra.
//  · "sospechoso": se sale de lo normal pero podría ser legítimo → se guarda y se apunta para moderación.
//  · "imposible": no se puede conseguir jugando → no se guarda y el jugador vuelve a su última partida buena.
// Los márgenes son generosos a propósito: es mejor dejar pasar algo raro (queda apuntado) que quitarle progreso
// a alguien que juega limpio.
// =====================================================================================
const E = require("./economia");

const NUEVA = {t: 3, g: [0, 0, 0, 0, 0, 0, 0], cl: 0, owned: {}, shiny: {}, bag: {}, np: 0, sp: 0, prs: 0, lv: {}};
const DIA = 86400;

const n = E.num;
const f = (x) => Math.round(Number(x) || 0).toLocaleString("es-ES"); // números legibles en los avisos
const total = (o) => {
  let s = 0;
  if (o && typeof o === "object") for (const k in o) s += Math.max(0, n(o[k]));
  return s;
};
const esEntero = (v, lo, hi) => typeof v === "number" && Number.isFinite(v) && v >= lo && v <= hi;

// extra: tickets que el servidor sabe con certeza que ha recibido en este rato (ventas del mercadillo cobradas y
// tickets devueltos por un administrador)
function revisar(prevIn, next, dtSeg, extra) {
  const prev = prevIn || NUEVA;
  const motivos = [];
  let peor = "ok";
  const marca = (estado, txt) => {
    motivos.push(txt);
    if (estado === "imposible" || (estado === "sospechoso" && peor === "ok")) peor = estado;
  };
  if (!next || typeof next !== "object" || Array.isArray(next)) return {estado: "imposible", motivos: ["la partida no tiene un formato válido"], datos: {}};

  // ---- 1. valores que no pueden existir ----
  if (!esEntero(n(next.t), 0, 1e18) || typeof next.t !== "number") marca("imposible", "tickets no válidos (" + next.t + ")");
  const g = Array.isArray(next.g) ? next.g : [];
  g.forEach((v, i) => { if (!esEntero(v, 0, 5000)) marca("imposible", "edificio " + i + " con nivel no válido (" + v + ")"); });
  if (next.cl != null && !esEntero(next.cl, 0, 30)) marca("imposible", "guantes con nivel no válido (" + next.cl + ")");
  if (next.prs != null && !esEntero(next.prs, 0, 500)) marca("imposible", "prestigio no válido (" + next.prs + ")");
  if (next.lv && typeof next.lv === "object") {
    for (const k in next.lv) {
      const l = next.lv[k] && next.lv[k].l;
      if (l != null && !esEntero(l, 1, 100)) { marca("imposible", "Pokémon " + k + " con nivel no válido (" + l + ")"); break; }
    }
  }
  for (const [k, mx] of [["owned", 1e6], ["shiny", 1e6], ["bag", 1e8]]) {
    const o = next[k];
    if (o && typeof o === "object") for (const x in o) if (!esEntero(o[x], 0, mx)) { marca("imposible", k + "." + x + " con cantidad no válida (" + o[x] + ")"); break; }
  }
  if (E.prs(next) > E.prs(prev) + 1) marca("imposible", "el prestigio sube más de 1 de golpe (" + E.prs(prev) + " → " + E.prs(next) + ")");

  const dt = Math.max(0, Math.min(n(dtSeg), 14 * DIA));
  const venta = Math.max(0, n(extra));
  const datos = {dt: Math.round(dt), t0: n(prev.t), t1: n(next.t)};
  if (venta) datos.mercado = Math.round(venta);

  // el contador del regalo automático sube 10 cada 30 s de juego: si sube más, alguien lo ha cambiado
  const dak = n(next.ak) - n(prev.ak), maxAk = 10 * (dt / E.TICK + 2);
  if (next.ak != null && !esEntero(next.ak, 0, 1e12)) marca("imposible", "regalo automático no válido (" + next.ak + ")");
  else if (dak > maxAk * 5 + 1000) marca("imposible", "el regalo automático sube de golpe: +" + f(dak));
  else if (dak > maxAk + 20) marca("sospechoso", "el regalo automático sube más de lo normal: +" + f(dak));

  // ---- 2. tickets: lo que tienes + lo que has gastado no puede pasar de lo que tenías + lo que has podido ganar ----
  // (si has hecho prestigio en este rato, la partida se reinicia y no se compara)
  if (E.prs(next) === E.prs(prev)) {
    const g0 = Array.isArray(prev.g) ? prev.g : [];
    let gasto = 0;
    for (let i = 0; i < E.G.length; i++) { const a = n(g0[i]), b = n(g[i]); if (b > a) gasto += E.costeEdificio(i, a, b); }
    if (n(next.cl) > n(prev.cl)) gasto += E.costeGuantes(n(prev.cl), n(next.cl));
    if (n(next.np) > n(prev.np)) gasto += E.costeTiradas(n(prev.np), n(next.np), false, prev);
    if (n(next.sp) > n(prev.sp)) gasto += E.costeTiradas(n(prev.sp), n(next.sp), true, prev);
    // ganado como mucho: producción (×3 por eventos y mejoras a medias), toques a 40 por segundo (20 con el evento ×2),
    // el regalo automático, y premios grandes (torneo, clasificaciones…) hasta 2 días de producción + 300 millones
    const prod = E.tps(prev);
    const ganado = E.RMUL(prev) * (prod * dt * 3 + E.cpc(prev) * 40 * dt + E.regaloAuto(prev, dt) * 2 + prod * 2 * DIA + 3e8);
    // lo que tenías y lo que se sabe seguro (ventas, devoluciones) cuenta tal cual; solo lo ganado jugando lleva margen:
    // ×5 (y 1.000 millones más) antes de dar algo por imposible
    const base = n(prev.t) + venta, tope = base + ganado, usado = n(next.t) + gasto;
    Object.assign(datos, {gasto: Math.round(gasto), ganadoMax: Math.round(ganado), prod: Math.round(prod)});
    if (usado > base + ganado * 5 + 1e9) marca("imposible", "tickets imposibles: tiene " + f(n(next.t)) + " y ha gastado " + f(gasto) + ", pero como mucho podía llegar a " + f(tope));
    else if (usado > tope) marca("sospechoso", "más tickets de lo normal: " + f(usado) + " frente a un máximo esperado de " + f(tope));
  }

  // ---- 3. Pokémon: los nuevos tienen que salir de tiradas, capturas, huevos, premios o intercambios ----
  const tiradas = Math.max(0, n(next.np) - n(prev.np)) + Math.max(0, n(next.sp) - n(prev.sp));
  const nuevos = total(next.owned) - total(prev.owned);
  const maxNuevos = tiradas + dt / 5 + 100;
  Object.assign(datos, {tiradas, pokeNuevos: nuevos});
  if (nuevos > maxNuevos * 5 + 500) marca("imposible", "Pokémon de la nada: +" + f(nuevos) + " con solo " + tiradas + " tiradas");
  else if (nuevos > maxNuevos) marca("sospechoso", "muchos Pokémon nuevos: +" + nuevos + " con " + tiradas + " tiradas");

  const shinies = total(next.shiny) - total(prev.shiny), maxSh = tiradas * 0.1 + dt / 60 + 30;
  if (shinies > maxSh * 10 + 300) marca("imposible", "variocolor de la nada: +" + shinies);
  else if (shinies > maxSh) marca("sospechoso", "muchos variocolor nuevos: +" + shinies);

  // ---- 4. objetos muy valiosos: cantidades absurdas ----
  const bag = next.bag && typeof next.bag === "object" ? next.bag : {};
  const prevBag = prev.bag && typeof prev.bag === "object" ? prev.bag : {};
  for (const [k, porDia, base] of [["mb", 40, 50], ["cand", 300, 200], ["crys", 20, 10]]) {
    const d = n(bag[k]) - n(prevBag[k]), mx = base + porDia * dt / DIA;
    if (d > mx * 20 + 1000) marca("imposible", k + " de la nada: +" + f(d));
    else if (d > mx) marca("sospechoso", "muchos " + k + " nuevos: +" + d);
  }
  return {estado: peor, motivos, datos};
}

module.exports = {revisar, NUEVA};
