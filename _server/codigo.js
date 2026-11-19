// =====================================================================================
// Códigos de regalo. Un administrador los crea desde el juego (Más → 🎁 Códigos) en codes/{CODIGO}:
//   {t: tickets, it: {objeto: cantidad}, mon: "Pokémon", sh: 1 si es variocolor, max: usos (0 = sin límite),
//    n: usos hechos, until: fecha límite en ms (0 = sin fecha), on: false si está desactivado, msg: texto opcional}
// Al canjearlo, el servidor comprueba el código, que esa cuenta no lo haya usado (codes/{CODIGO}/r/{uid}) y que queden
// usos, y mete el premio en la partida dentro de la misma transacción del guardado. Así no se puede canjear dos veces
// ni inventar códigos, y los jugadores nunca ven la lista de códigos (solo la leen los administradores).
// =====================================================================================
const {FieldValue} = require("firebase-admin/firestore");
const E = require("./economia");
const D = require("./datos.json");

const NOMBRES = new Set(D.P.map((p) => p[0]));
const limpiar = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 24);

// premio del código, ya limitado a valores razonables
function premio(d) {
  const t = Math.max(0, Math.min(1e13, Math.floor(E.num(d.t))));
  const it = {};
  const src = d.it && typeof d.it === "object" ? d.it : {};
  for (const k of Object.keys(src).slice(0, 30)) {
    const v = Math.floor(E.num(src[k]));
    if (/^[a-z0-9_-]{1,30}$/i.test(k) && v > 0) it[k] = Math.min(v, 9999);
  }
  const mon = typeof d.mon === "string" && NOMBRES.has(d.mon) ? d.mon : null;
  return {t, it, mon, sh: mon && d.sh ? 1 : 0};
}

// tx: transacción del guardado (todavía sin escrituras) · S: la partida que se va a guardar (se modifica)
async function canjear(tx, db, uid, S, ac, ahora) {
  const c = limpiar(ac && ac.c);
  if (c.length < 3) return {error: "codigo-mal"};
  const ref = db.doc("codes/" + c), rref = db.doc("codes/" + c + "/r/" + uid);
  const cs = await tx.get(ref);
  const rs = await tx.get(rref);
  if (!cs.exists) return {error: "codigo-no"};
  const d = cs.data() || {};
  if (d.on === false) return {error: "codigo-off"};
  if (d.until && ahora > E.num(d.until)) return {error: "codigo-caducado"};
  if (rs.exists) return {error: "codigo-usado"};
  if (d.max && E.num(d.n) >= E.num(d.max)) return {error: "codigo-agotado"};
  const p = premio(d);
  S.t = E.num(S.t) + p.t;
  S.bag = S.bag && typeof S.bag === "object" ? S.bag : {};
  for (const k in p.it) S.bag[k] = E.num(S.bag[k]) + p.it[k];
  if (p.mon) {
    S.owned = S.owned && typeof S.owned === "object" ? S.owned : {};
    S.owned[p.mon] = E.num(S.owned[p.mon]) + 1;
    if (p.sh) { S.shiny = S.shiny && typeof S.shiny === "object" ? S.shiny : {}; S.shiny[p.mon] = E.num(S.shiny[p.mon]) + 1; }
  }
  tx.update(ref, {n: FieldValue.increment(1)});
  tx.set(rref, {at: ahora});
  return {out: Object.assign({c, msg: String(d.msg || "").slice(0, 140)}, p)};
}

module.exports = {canjear, limpiar, premio};
