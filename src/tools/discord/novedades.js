// =====================================================================================
// Anuncia en Discord las novedades de cada versión nueva del juego (la lista NEWS de src/assemble.py, la misma que se
// ve en el juego en «Novedades»). Lo ejecuta GitHub Actions (.github/workflows/novedades.yml) al publicar en main.
//  · Cada versión se anuncia una sola vez: la última anunciada se apunta en Firestore (discordLog/novedades_avisos).
//  · La primera vez solo se anuncia la versión más reciente, para no llenar el canal con las antiguas.
//  · Canal: DISCORD_WEBHOOK_NOVEDADES; si no existe, el de Avisos (DISCORD_WEBHOOK_AVISOS). Nunca el de sorteos.
// Uso: node src/tools/discord/novedades.js [--probar]   (--probar: enseña lo que enviaría, sin enviar ni apuntar nada)
// =====================================================================================
const fs = require("fs"), path = require("path");
const RAIZ = path.join(__dirname, "../../..");
const R = require("module").createRequire(path.join(RAIZ, "_server/index.js"));
const PROBAR = process.argv.includes("--probar");

// entradas de NEWS (una por línea, objetos de JavaScript escritos por nosotros en assemble.py)
function novedades() {
  const s = fs.readFileSync(path.join(RAIZ, "src/assemble.py"), "utf8"), i = s.indexOf("const NEWS=[\n");
  if (i < 0) throw new Error("No encuentro const NEWS en src/assemble.py");
  const out = [];
  for (const ln of s.slice(i + 13).split("\n")) {
    const t = ln.trim();
    if (!t.startsWith("{v:")) break;
    try { const o = Function('"use strict";return (' + t.replace(/,$/, "") + ")")(); if (o && o.v && o.at && Array.isArray(o.l)) out.push(o); } catch (e) { break; }
  }
  return out; // de la más nueva a la más vieja
}
const WEB = "https://pokegachaonline.es";
function embed(o) {
  const L = o.l.map((x) => "• " + String(x).replace(/@/g, "@​").replace(/([\\*_~`|])/g, "\\$1"));
  let d = "";
  for (const x of L) { if ((d + x + "\n").length > 3800) { d += "…"; break; } d += x + "\n"; }
  const arreglo = /Arreglos|Mejoras/.test(o.t || "");
  return {embeds: [{color: arreglo ? 0x3b9bd8 : 0xe2573b, title: (o.t || "🆕 Novedad") + (o.ver ? " · versión " + o.ver : ""), url: WEB,
    description: d.trim() + "\n\n¡Entra a jugar en **pokegachaonline.es**! (Si ya lo tenías abierto, recarga para tener la versión nueva.)",
    footer: {text: "Poke Gacha Online · Novedades"}}]};
}
(async () => {
  const N = novedades();
  if (!N.length) { console.log("Sin novedades"); return; }
  if (PROBAR) { console.log(JSON.stringify(embed(N[0]), null, 1)); return; }
  try { require(R.resolve("dotenv")).config({path: path.join(RAIZ, "_server/.env")}); } catch (e) {
    // sin dotenv: se lee el .env a mano
    const f = path.join(RAIZ, "_server/.env");
    if (fs.existsSync(f)) for (const l of fs.readFileSync(f, "utf8").split("\n")) { const m = /^([A-Z_]+)=(.*)$/.exec(l); if (m && !process.env[m[1]]) process.env[m[1]] = m[2]; }
  }
  const {initializeApp} = R("firebase-admin/app"), {getFirestore} = R("firebase-admin/firestore");
  initializeApp({projectId: "pokegacha-fdef9"});
  const db = getFirestore(), D = require(path.join(RAIZ, "_server/discord.js"));
  const ref = db.doc("discordLog/novedades_avisos"), s = await ref.get();
  const ult = s.exists ? String(s.data().v || "") : "";
  // nuevas: las que van antes de la última anunciada (como mucho 4); la primera vez, solo la más reciente
  let nuevas = ult ? N.slice(0, Math.max(0, N.findIndex((o) => o.v === ult))) : N.slice(0, 1);
  if (ult && !N.some((o) => o.v === ult)) nuevas = N.slice(0, 1);
  nuevas = nuevas.slice(0, 4).reverse();
  if (!nuevas.length) { console.log("Nada nuevo que anunciar (última: " + ult + ")"); return; }
  for (const o of nuevas) {
    const ok = await D.enviar("novedades", embed(o));
    if (!ok) { console.log("::warning::No se ha podido enviar a Discord la versión " + o.ver + " (falta el secreto DISCORD_WEBHOOK_AVISOS con el webhook del canal de Avisos)"); process.exitCode = 0; return; }
    await ref.set({v: o.v, at: Date.now()});
    console.log("Anunciada la versión " + o.ver);
    await new Promise((r) => setTimeout(r, 1500));
  }
})().catch((e) => { console.error(e); process.exit(1); });
