// =====================================================================================
// Exporta al servidor (_server/datos.json) los datos del juego que necesita para hacer las tiradas igual que el
// navegador: la lista de Pokémon (nombre, tipo, rareza, generación), las formas supremas, los eventos de temporada y
// los premios de los logros (para descontarlos del presupuesto diario de premios).
// Se ejecuta con el juego servido en local:  node src/tools/servidor/exportar_datos.js [http://localhost:8765/index.html]
// Hay que volver a ejecutarlo cuando cambie la lista de Pokémon (las pruebas del servidor avisan si no coincide).
// =====================================================================================
const {chromium} = require("playwright");
const fs = require("fs"), path = require("path");
const URL = process.argv[2] || "http://localhost:8765/index.html";
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.route(/pokeapi|jsdelivr|showdown|githubusercontent|gstatic|googleapis|firebase/, (r) => r.abort());
  await p.goto(URL);
  await p.waitForTimeout(1500);
  await p.evaluate(() => { const a = document.getElementById("alocal"); if (a) a.click(); });
  for (let i = 0; i < 60; i++) { if (await p.evaluate(() => typeof P !== "undefined" && P.length > 100 && typeof isSup === "function").catch(() => false)) break; await p.waitForTimeout(500); }
  const d = await p.evaluate(() => ({
    P: P.map((x) => [x[0], x[1], x[2], x[3] | 0]),
    sup: P.filter((x) => isSup(x[0])).map((x) => x[0]),
    eventos: EVENTS.map((e) => ({t: e.t, a: e.a, b: e.b})),
    hh: HH_KINDS.map((k) => k[0]),
    // logros sin prestigio: [id, dificultad de cada nivel] · AR: premio de cada dificultad
    logros0: ACH0.map((a) => [a[0], a[5].map((l) => l[1])]),
    AR: AR,
    // premios semanales: torneo y clasificaciones de minijuegos (_server/semana.js)
    semanal: {
      tourTiers: TOUR_TIERS.map((T) => ({k: T.k, t: T.t, h: T.h, it: T.it, hold: T.hold | 0, mon: T.mon || null, sh: T.sh || 0})),
      mgrTier: MGR_TIER.map((T) => ({p: T.p, t: T.t, h: T.h, x: T.x, it: T.it})),
      mgrEx: MGR_EX, tourRot: TOUR_ROT, tourFix: TOUR_FIX, tourFuera: [...MEGA_ZA], tourMgrFrom: TOUR_MGR_FROM, mgs: MGS.map((g) => g.id),
      hold: HOLD.map((h) => h[0]), evo: ITEMS.filter((q) => q[7] === "evo").map((q) => q[0]),
    },
    // regalo diario y racha (_server/diario.js): premios de cada día del ciclo de 30 y objetos que pueden tocar
    // (8.0) pistas del tesoro semanal de las próximas 60 semanas (el servidor adelanta en Discord la del día siguiente)
    tesoro: (() => { const o = {}; for (let k = -1; k < 60; k++) { const w = isoWeek(new Date(Date.now() + k * 7 * 864e5)); if (!o[w]) o[w] = treClues(w); } return o; })(),
    racha: {T: STRK_T, evo: ITEMS.filter((i) => strkOk("evo", i)).map((i) => i[0]), mint: ITEMS.filter((i) => strkOk("mint", i)).map((i) => i[0]),
      hold: ITEMS.filter((i) => strkOk("hold", i)).map((i) => i[0])},
  }));
  await b.close();
  const out = path.join(__dirname, "..", "..", "..", "_server", "datos.json");
  fs.writeFileSync(out, JSON.stringify(d));
  console.log("datos.json:", d.P.length, "Pokémon,", d.sup.length, "formas supremas,", d.eventos.length, "eventos,", d.logros0.length, "logros");
})();
