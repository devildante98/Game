// =====================================================================================
// Sorteos. Un administrador los crea y los sortea desde el juego (Más → 🎉 Sorteos) en raffles/{id}:
//   {tt: título, t, it, mon, sh (premio, como los códigos), nw: nº de ganadores, end: cierre en ms,
//    st: "open" | "done", win: [uid de los ganadores], wn: [apodos], at}
// Los jugadores se apuntan en raffles/{id}/e/{uid}. Al reclamar, el servidor comprueba que el sorteo está hecho, que
// esa cuenta está entre los ganadores y que no lo ha cobrado ya (raffles/{id}/c/{uid}), y mete el premio en la
// partida dentro de la misma transacción del guardado.
// =====================================================================================
const E = require("./economia");
const {premio} = require("./codigo");

// tx: transacción del guardado (todavía sin escrituras) · S: la partida que se va a guardar (se modifica)
async function reclamar(tx, db, uid, S, ac, ahora) {
  const id = String((ac && ac.id) || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
  if (!id) return {error: "sorteo-no"};
  const ref = db.doc("raffles/" + id), cref = db.doc("raffles/" + id + "/c/" + uid);
  const rs = await tx.get(ref);
  const cs = await tx.get(cref);
  if (!rs.exists) return {error: "sorteo-no"};
  const d = rs.data() || {};
  if (d.st !== "done") return {error: "sorteo-abierto"};
  if (!Array.isArray(d.win) || !d.win.includes(uid)) return {error: "sorteo-no-ganador"};
  if (cs.exists) return {error: "sorteo-cobrado"};
  const p = premio(d);
  S.t = E.num(S.t) + p.t;
  S.bag = S.bag && typeof S.bag === "object" ? S.bag : {};
  for (const k in p.it) S.bag[k] = E.num(S.bag[k]) + p.it[k];
  if (p.mon) {
    S.owned = S.owned && typeof S.owned === "object" ? S.owned : {};
    S.owned[p.mon] = E.num(S.owned[p.mon]) + 1;
    if (p.sh) { S.shiny = S.shiny && typeof S.shiny === "object" ? S.shiny : {}; S.shiny[p.mon] = E.num(S.shiny[p.mon]) + 1; }
  }
  tx.set(cref, {at: ahora});
  return {out: Object.assign({id, tt: String(d.tt || "").slice(0, 80)}, p)};
}

module.exports = {reclamar};
