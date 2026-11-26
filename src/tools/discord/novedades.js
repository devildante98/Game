// =====================================================================================
// Anuncia en Discord las novedades de cada versión nueva del juego (la lista NEWS de src/assemble.py, la misma que se
// ve en el juego en «Novedades»). Lo ejecuta GitHub Actions (.github/workflows/novedades.yml) al publicar en main.
//  · Cada versión se anuncia una sola vez: la última anunciada se apunta en Firestore (discordLog/novedades_canal).
//  · La primera vez solo se anuncia la versión más reciente, para no llenar el canal con las antiguas.
//  · Canal: #novedades (secreto DISCORD_WEBHOOK_NOVEDADES). Se menciona el rol DISCORD_ROL_NOVEDADES («Avisos de novedades»;
//    si no existe, DISCORD_ROL_AVISOS). Sin el webhook no se envía nada (nunca a otro canal).
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
// mensajes como los que se ponían a mano en #novedades: la portada «NOVEDADES» y debajo el título, la mención al rol de avisos,
// la lista con viñetas y el enlace al juego. Si no cabe en un mensaje (2000 letras), sigue en otro.
const limpiar = (x) => String(x).replace(/@/g, "@​").replace(/([\\*_~`|])/g, "\\$1");
function mensajes(o, rol) {
  const ic = (/^(\p{Extended_Pictographic}️?)/u.exec(o.t || "") || [])[1] || "🆕";
  const tit = o.tt ? String(o.tt) : /Arreglos|Mejoras/.test(o.t || "") ? "Arreglos y mejoras" : "¡Novedades!";
  const cab = "## " + ic + " Versión " + o.ver + " · " + limpiar(tit) + (rol ? "\n<@&" + rol + ">" : "");
  const fin = "\n\n¡Gracias por jugar! 🎮 " + WEB + "/";
  const out = [WEB + "/discord/novedades.png"];
  let cur = cab;
  for (const x of o.l) {
    const ln = "\n• " + limpiar(x);
    if ((cur + ln).length > 1850) { out.push(cur); cur = ln.slice(1); } else cur += ln;
  }
  if ((cur + fin).length > 1990) { out.push(cur); cur = fin.trim(); } else cur += fin;
  out.push(cur);
  return out;
}
const okURL = (u) => /^https:\/\/(discord\.com|discordapp\.com|canary\.discord\.com|ptb\.discord\.com)\/api\/webhooks\/\d+\/[\w-]+$/.test(u);
async function enviar(url, rol, content) {
  try {
    const r = await fetch(url + "?wait=true", {method: "POST", headers: {"content-type": "application/json"}, signal: AbortSignal.timeout(8000),
      body: JSON.stringify({username: "Poke Gacha Online", avatar_url: WEB + "/icon-192.png", content, allowed_mentions: {parse: [], roles: rol ? [rol] : []}})});
    return r.ok;
  } catch (e) { return false; }
}
(async () => {
  const N = novedades();
  if (!N.length) { console.log("Sin novedades"); return; }
  if (PROBAR) { mensajes(N[0], "123").forEach((m) => console.log("----- (" + m.length + ")\n" + m)); return; }
  try { require(R.resolve("dotenv")).config({path: path.join(RAIZ, "_server/.env")}); } catch (e) {
    // sin dotenv: se lee el .env a mano
    const f = path.join(RAIZ, "_server/.env");
    if (fs.existsSync(f)) for (const l of fs.readFileSync(f, "utf8").split("\n")) { const m = /^([A-Z_]+)=(.*)$/.exec(l); if (m && !process.env[m[1]]) process.env[m[1]] = m[2]; }
  }
  const {initializeApp} = R("firebase-admin/app"), {getFirestore} = R("firebase-admin/firestore");
  initializeApp({projectId: "pokegacha-fdef9"});
  const db = getFirestore();
  const url = process.env.DISCORD_WEBHOOK_NOVEDADES || "", rol = String(process.env.DISCORD_ROL_NOVEDADES || process.env.DISCORD_ROL_AVISOS || "").replace(/\D/g, "");
  if (!okURL(url)) { console.log("::warning::Falta el secreto DISCORD_WEBHOOK_NOVEDADES (el webhook del canal #novedades): no se anuncia nada."); return; }
  const ref = db.doc("discordLog/novedades_canal"), s = await ref.get();
  const ult = s.exists ? String(s.data().v || "") : "";
  // nuevas: las que van antes de la última anunciada (como mucho 4); la primera vez, solo la más reciente
  let nuevas = ult ? N.slice(0, Math.max(0, N.findIndex((o) => o.v === ult))) : N.slice(0, 1);
  if (ult && !N.some((o) => o.v === ult)) nuevas = N.slice(0, 1);
  nuevas = nuevas.slice(0, 4).reverse();
  if (!nuevas.length) { console.log("Nada nuevo que anunciar (última: " + ult + ")"); return; }
  for (const o of nuevas) {
    let ok = true;
    for (const m of mensajes(o, rol)) { ok = await enviar(url, rol, m); if (!ok) break; await new Promise((r) => setTimeout(r, 700)); }
    if (!ok) { console.log("::warning::Discord no ha aceptado el mensaje de la versión " + o.ver + " (¿el webhook sigue existiendo?)"); return; }
    await ref.set({v: o.v, at: Date.now()});
    console.log("Anunciada la versión " + o.ver);
    await new Promise((r) => setTimeout(r, 1500));
  }
})().catch((e) => { console.error(e); process.exit(1); });
