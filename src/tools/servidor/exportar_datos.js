// =====================================================================================
// Exporta al servidor (_server/datos.json) los datos del juego que necesita para hacer las tiradas igual que el
// navegador: la lista de Pokémon (nombre, tipo, rareza, generación), las formas supremas y los eventos de temporada.
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
  }));
  await b.close();
  const out = path.join(__dirname, "..", "..", "..", "_server", "datos.json");
  fs.writeFileSync(out, JSON.stringify(d));
  console.log("datos.json:", d.P.length, "Pokémon,", d.sup.length, "formas supremas,", d.eventos.length, "eventos");
})();
