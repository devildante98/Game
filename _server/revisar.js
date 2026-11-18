// =====================================================================================
// Revisión de cada guardado: compara la partida nueva con la última aceptada y el tiempo real que ha pasado.
//  · "ok": todo cuadra.
//  · "sospechoso": se sale de lo normal pero podría ser legítimo → se guarda y se apunta para moderación.
//  · "imposible": no se puede conseguir jugando → no se guarda y el jugador vuelve a su última partida buena.
// Los márgenes son generosos a propósito: es mejor dejar pasar algo raro (queda apuntado) que quitarle progreso
// a alguien que juega limpio.
// =====================================================================================
const E = require("./economia");

// rareza de cada Pokémon (L legendario, M singular…), de los datos del juego
const D = require("./datos.json");
const RAR = {};
D.P.forEach((p) => { RAR[p[0]] = p[2]; });
const LOGROS0 = new Map(D.logros0.map(([id, ds]) => [id, ds]));

// Premios de los logros reclamados en este rato (pueden ser de hasta 500 millones cada uno, así que se descuentan aparte
// del presupuesto diario). Sin prestigio, con la tabla exacta del juego; con prestigio los logros se generan al azar,
// así que se cuenta el premio más alto posible de cada nivel (12 logros como mucho, de hasta 5 niveles).
function creditoLogros(prev, next) {
  const p0 = prev.ach && typeof prev.ach === "object" ? prev.ach : {}, p1 = next.ach && typeof next.ach === "object" ? next.ach : {};
  const prs = E.prs(next), extra = prs >= 3 ? 1 : 0;
  let t = 0, mb = 0, cand = 0, niveles = 0, ids = 0;
  for (const id in p1) {
    const a = Math.max(0, Math.floor(n(p0[id]))), b = Math.min(prs ? 5 : 10, Math.floor(n(p1[id])));
    if (b <= a) continue;
    if (prs && ++ids > 12) break;
    for (let k = a; k < b; k++) {
      let d;
      if (!prs) { const ds = LOGROS0.get(id); if (!ds || k >= ds.length) continue; d = ds[k]; } else d = k === 0 ? Math.min(5, extra) : Math.min(5, 4 + extra);
      const r = D.AR[d] || {t: 0, it: {}};
      t += n(r.t); mb += n((r.it || {}).mb); cand += n((r.it || {}).cand); niveles++;
    }
  }
  return {t: Math.round(t * E.RMUL(prev)), mb, cand, niveles};
}

// límites del día: «sos» = se apunta para moderación (una vez al día) · «imp» = no se guarda
function limites(S) {
  const prod = E.tps(S), R = E.RMUL(S);
  return {
    tk: {sos: R * (prod * DIA * 1.5 + 2e8), imp: R * (prod * DIA * 3 + 1.5e9), txt: "tickets de premios"},
    ach: {sos: 40, imp: 150, txt: "niveles de logros reclamados"},
    pk: {sos: 500, imp: 4000, txt: "Pokémon nuevos (sin contar tiradas)"},
    leg: {sos: 15, imp: 80, txt: "legendarios y singulares nuevos"},
    sh: {sos: 40, imp: 400, txt: "variocolores nuevos"},
    mb: {sos: 15, imp: 100, txt: "Master Ball nuevas"},
    cand: {sos: 400, imp: 4000, txt: "Caramelos Raros nuevos"},
    crys: {sos: 25, imp: 200, txt: "Cristales Supremos nuevos"},
  };
}

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
// op.eco / op.hoy: lo que lleva ganado hoy por premios (lo guarda el servidor) y la fecha de hoy en Madrid.
// op.estricto: la partida anterior ya venía de un juego 7.2 o posterior, en el que las tiradas, los edificios y los
// guantes solo cambian en el servidor (acción «tirar» o «mejorar»); un guardado normal no puede subirlos.
function revisar(prevIn, next, dtSeg, extra, op) {
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

  // ---- modo estricto: tiradas, edificios, guantes y garantía de raro solo cambian en el servidor ----
  if (op && op.estricto) {
    const g0 = Array.isArray(prev.g) ? prev.g : [], g1 = Array.isArray(next.g) ? next.g : [];
    // empezar de cero (o prestigio): todo a cero y casi sin Pokémon
    const reinicio = g1.every((v) => !n(v)) && !n(next.cl) && total(next.owned) <= Math.max(10, total(prev.owned) * 0.2) && n(next.pulls) < n(prev.pulls) + 1;
    for (let i = 0; i < Math.max(g0.length, g1.length); i++) if (n(g1[i]) > n(g0[i])) { marca("imposible", "edificio " + i + " mejorado fuera del servidor (" + n(g0[i]) + " → " + n(g1[i]) + ")"); break; }
    if (n(next.cl) > n(prev.cl)) marca("imposible", "guantes mejorados fuera del servidor (" + n(prev.cl) + " → " + n(next.cl) + ")");
    if (n(next.np) > n(prev.np) || n(next.sp) > n(prev.sp)) marca("imposible", "tiradas hechas fuera del servidor");
    if (!reinicio) {
      if (n(next.np) < n(prev.np) || n(next.sp) < n(prev.sp)) marca("imposible", "tiradas deshechas (" + n(prev.np) + "+" + n(prev.sp) + " → " + n(next.np) + "+" + n(next.sp) + ")");
      if (n(next.pity) !== n(prev.pity)) marca("imposible", "garantía de raro cambiada fuera del servidor (" + n(prev.pity) + " → " + n(next.pity) + ")");
      if (E.prs(next) > E.prs(prev)) marca("imposible", "prestigio sin reiniciar la partida");
    }
  }

  const dt = Math.max(0, Math.min(n(dtSeg), 14 * DIA));
  const venta = Math.max(0, n(extra));
  const datos = {dt: Math.round(dt), t0: n(prev.t), t1: n(next.t)};
  if (venta) datos.mercado = Math.round(venta);

  // el contador del regalo automático sube 10 cada 30 s de juego: si sube más, alguien lo ha cambiado
  const dak = n(next.ak) - n(prev.ak), maxAk = 10 * (dt / E.TICK + 2);
  if (next.ak != null && !esEntero(next.ak, 0, 1e12)) marca("imposible", "regalo automático no válido (" + next.ak + ")");
  else if (dak > maxAk * 5 + 1000) marca("imposible", "el regalo automático sube de golpe: +" + f(dak));
  else if (dak > maxAk + 20) marca("sospechoso", "el regalo automático sube más de lo normal: +" + f(dak));

  const g0 = Array.isArray(prev.g) ? prev.g : [];
  const tiradas = Math.max(0, n(next.np) - n(prev.np)) + Math.max(0, n(next.sp) - n(prev.sp));
  const nuevos = total(next.owned) - total(prev.owned);
  const shinies = total(next.shiny) - total(prev.shiny);
  const bag = next.bag && typeof next.bag === "object" ? next.bag : {};
  const prevBag = prev.bag && typeof prev.bag === "object" ? prev.bag : {};
  const mismoPrs = E.prs(next) === E.prs(prev); // (con prestigio la partida se reinicia y no se compara)
  const logros = mismoPrs ? creditoLogros(prev, next) : {t: 0, mb: 0, cand: 0, niveles: 0};
  if (logros.niveles) datos.logros = logros;
  // ---- 2. tickets: lo que tienes + lo que has gastado frente a lo que tenías + lo ganado jugando ----
  let gasto = 0, prodGanado = 0, usado = 0, base = 0;
  if (mismoPrs) {
    for (let i = 0; i < E.G.length; i++) { const a = n(g0[i]), b = n(g[i]); if (b > a) gasto += E.costeEdificio(i, a, b); }
    if (n(next.cl) > n(prev.cl)) gasto += E.costeGuantes(n(prev.cl), n(next.cl));
    if (n(next.np) > n(prev.np)) gasto += E.costeTiradas(n(prev.np), n(next.np), false, prev);
    if (n(next.sp) > n(prev.sp)) gasto += E.costeTiradas(n(prev.sp), n(next.sp), true, prev);
    // lo ganado sin premios, según el tiempo: producción (×3 por eventos), toques a 40 por segundo y el regalo automático
    const prod = E.tps(prev);
    prodGanado = E.RMUL(prev) * (prod * dt * 3 + E.cpc(prev) * 40 * dt + E.regaloAuto(prev, dt) * 2);
    base = n(prev.t) + venta + (prevIn ? logros.t : 0);
    usado = n(next.t) + gasto;
    Object.assign(datos, {gasto: Math.round(gasto), prodGanado: Math.round(prodGanado), prod: Math.round(prod)});
  }

  if (!prevIn) {
    // primera subida a la nube (puede venir de jugar sin cuenta): se compara con el tiempo que tiene la cuenta
    const ganado = prodGanado + E.RMUL(prev) * (E.tps(prev) * 2 * DIA + 3e8);
    if (mismoPrs) {
      if (usado > base + ganado * 5 + 1e9) marca("imposible", "tickets imposibles: tiene " + f(n(next.t)) + " y ha gastado " + f(gasto) + ", pero como mucho podía llegar a " + f(base + ganado));
      else if (usado > base + ganado) marca("sospechoso", "más tickets de lo normal: " + f(usado) + " frente a un máximo esperado de " + f(base + ganado));
    }
    const maxNuevos = tiradas + dt / 5 + 100;
    Object.assign(datos, {tiradas, pokeNuevos: nuevos});
    if (nuevos > maxNuevos * 5 + 500) marca("imposible", "Pokémon de la nada: +" + f(nuevos) + " con solo " + tiradas + " tiradas");
    else if (nuevos > maxNuevos) marca("sospechoso", "muchos Pokémon nuevos: +" + nuevos + " con " + tiradas + " tiradas");
    const maxSh = tiradas * 0.1 + dt / 60 + 30;
    if (shinies > maxSh * 10 + 300) marca("imposible", "variocolor de la nada: +" + shinies);
    else if (shinies > maxSh) marca("sospechoso", "muchos variocolor nuevos: +" + shinies);
    for (const [k, porDia, b0] of [["mb", 40, 50], ["cand", 300, 200], ["crys", 20, 10]]) {
      const d = n(bag[k]) - n(prevBag[k]), mx = b0 + porDia * dt / DIA;
      if (d > mx * 20 + 1000) marca("imposible", k + " de la nada: +" + f(d));
      else if (d > mx) marca("sospechoso", "muchos " + k + " nuevos: +" + d);
    }
    return {estado: peor, motivos, datos, eco: null};
  }

  // ---- 3. presupuesto del día (hora de Madrid) ----
  // Todo lo que entra por premios (minijuegos, misiones, logros, combates, clasificaciones, huevos, capturas…) se va
  // sumando en el día. Los límites son muy altos para quien juega mucho, pero ya no se acumulan con cada guardado.
  const eco = Object.assign({}, op && op.eco && op.eco.d === (op && op.hoy) ? op.eco : {d: op && op.hoy || ""});
  eco.f = Object.assign({}, eco.f || {});
  let leg = 0;
  if (next.owned && typeof next.owned === "object") for (const k in next.owned) if (RAR[k] === "L" || RAR[k] === "M") leg += Math.max(0, n(next.owned[k]) - n((prev.owned || {})[k]));
  const suma = {
    tk: mismoPrs ? Math.max(0, usado - (base + prodGanado)) : 0,
    pk: Math.max(0, nuevos - tiradas),
    leg: Math.max(0, leg - tiradas * 0.1),
    sh: Math.max(0, shinies - tiradas * 0.01),
    mb: Math.max(0, n(bag.mb) - n(prevBag.mb) - logros.mb),
    cand: Math.max(0, n(bag.cand) - n(prevBag.cand) - logros.cand),
    ach: logros.niveles,
    crys: Math.max(0, n(bag.crys) - n(prevBag.crys)),
  };
  const L = limites(prev);
  for (const k in L) {
    eco[k] = n(eco[k]) + suma[k];
    if (eco[k] > L[k].imp) marca("imposible", "hoy, demasiados " + L[k].txt + ": " + f(eco[k]) + " (máximo " + f(L[k].imp) + ")");
    else if (eco[k] > L[k].sos && !eco.f[k]) { eco.f[k] = 1; marca("sospechoso", "hoy, más " + L[k].txt + " de lo normal: " + f(eco[k])); }
  }
  datos.hoy = Object.fromEntries(Object.keys(L).map((k) => [k, Math.round(eco[k])]));
  datos.tiradas = tiradas;
  return {estado: peor, motivos, datos, eco};
}

module.exports = {revisar, NUEVA, limites};
