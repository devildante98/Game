// =====================================================================================
// Avisos en el servidor de Discord de los jugadores (webhooks).
// · Códigos públicos y sorteos: los pide el juego al crearlos o sortearlos (solo administradores, función «discord»).
// · Torneo semanal: el primer guardado de la semana nueva (lunes o martes) anuncia el podio de la anterior.
// Las direcciones de los webhooks NO están en el código: llegan como variables de entorno al publicar
// (secretos de GitHub DISCORD_WEBHOOK_CODIGOS, DISCORD_WEBHOOK_SORTEOS y DISCORD_WEBHOOK_TORNEOS; opcional
// DISCORD_ROL_AVISOS con el ID del rol que se menciona). Si falta alguno, ese aviso simplemente no se envía.
// Cada aviso se apunta en discordLog/ para no publicarlo dos veces.
// =====================================================================================
const {semanaAnterior, claveTorneo, juegoTorneo, semanaISO} = require("./semana");

const WEB = "https://pokegachaonline.es";
const HOOK = () => ({
  codigo: process.env.DISCORD_WEBHOOK_CODIGOS || "",
  sorteo: process.env.DISCORD_WEBHOOK_SORTEOS || "",
  torneo: process.env.DISCORD_WEBHOOK_TORNEOS || "",
  // mercader misterioso, pistas del tesoro y meta de la comunidad: canal propio si existe; si no, el de sorteos (como hasta
  // ahora). Las novedades de cada versión van aparte, al canal #novedades (src/tools/discord/novedades.js).
  eventos: process.env.DISCORD_WEBHOOK_EVENTOS || process.env.DISCORD_WEBHOOK_SORTEOS || "",
});
const ROL = () => String(process.env.DISCORD_ROL_AVISOS || "").replace(/\D/g, "");
const ok = (u) => /^https:\/\/(discord\.com|discordapp\.com|canary\.discord\.com|ptb\.discord\.com)\/api\/webhooks\/\d+\/[\w-]+$/.test(u);

const OBJ = {mb: "Master Ball", crys: "Cristal Supremo", cand: "Caramelo Raro", ppmax: "PP máximos", tshard: "Teralito",
  ub: "Ultra Ball", sb: "Super Ball", pb: "Poké Ball", mint: "Menta", hold: "Objeto equipable"};
const MG = {fos: "Cazafósiles", who: "¿Quién es ese Pokémon?", mem: "Memoria Pokémon", dig: "¡Golpea al Diglett!", fish: "Pesca",
  thr: "Lanzamiento perfecto", run: "Carrera de Rapidash", exc: "Excavación subterránea", wgt: "Peso y altura",
  puz: "Rompecabezas Pokémon", hl: "Más o menos", jig: "Puzle de piezas",
  ekn: "Ekans hambriento", bay: "Lluvia de bayas", pdg: "Vuelo de Pidgeot", cue: "Cueva oscura"};
const n = (v) => (typeof v === "number" && isFinite(v) ? v : 0);
const fmt = (v) => Math.round(n(v)).toLocaleString("es-ES");
// texto de otros (títulos, apodos): sin saltos, sin formato de Discord y corto
const limpio = (s, max) => String(s || "").replace(/[\r\n]+/g, " ").replace(/([\\*_~`|>])/g, "\\$1").replace(/@/g, "@\u200b").slice(0, max || 80);
const ts = (ms, f) => "<t:" + Math.floor(n(ms) / 1000) + ":" + (f || "f") + ">";

function premio(d) {
  const L = [];
  if (d.mon) L.push((d.sh ? "✨ " : "") + limpio(d.mon, 40) + (d.sh ? " variocolor" : ""));
  if (n(d.t) > 0) L.push(fmt(d.t) + " 🎟️ tickets");
  const it = d.it && typeof d.it === "object" ? d.it : {};
  for (const k of Object.keys(it).slice(0, 12)) if (n(it[k]) > 0) L.push(fmt(it[k]) + " × " + (OBJ[k] || limpio(k, 20)));
  return L.length ? L.join("\n") : "—";
}

async function enviar(tipo, payload) {
  const url = HOOK()[tipo];
  if (!ok(url)) return false;
  const rol = ROL();
  const body = Object.assign({username: "Poke Gacha Online", avatar_url: WEB + "/icon-192.png",
    allowed_mentions: {parse: [], roles: rol ? [rol] : []}}, payload);
  if (rol && tipo !== "torneo") body.content = "<@&" + rol + ">" + (body.content ? " " + body.content : "");
  try {
    const r = await fetch(url + "?wait=true", {method: "POST", headers: {"content-type": "application/json"},
      body: JSON.stringify(body), signal: AbortSignal.timeout(6000)});
    return r.ok;
  } catch (e) {
    return false;
  }
}

// apunta el aviso una sola vez; si ya estaba, no se repite. Si el envío falla, se borra la marca para poder reintentar
async function unaVez(db, clave, fn) {
  const ref = db.doc("discordLog/" + clave.replace(/[^\w-]/g, "_").slice(0, 120));
  try { await ref.create({at: Date.now()}); } catch (e) { return {ok: true, ya: 1}; }
  const sent = await fn();
  if (!sent) { await ref.delete().catch(() => {}); return {ok: false, why: "discord"}; }
  return {ok: true};
}

const embedCodigo = (c, d) => ({embeds: [{color: 0x3bd16f, title: "🎁 ¡Nuevo código de regalo!",
  url: WEB, description: "Canjéalo en el juego: **Más › 🎁 Canjear código**",
  fields: [
    {name: "Código", value: "```" + String(c).replace(/[^A-Z0-9_-]/g, "") + "```", inline: false},
    {name: "Premio", value: premio(d), inline: true},
    {name: "Usos", value: n(d.max) ? fmt(d.max) + " en total" : "Ilimitados", inline: true},
    {name: "Válido hasta", value: n(d.until) ? ts(d.until, "f") + " (" + ts(d.until, "R") + ")" : "Sin fecha límite", inline: true},
  ],
  thumbnail: {url: WEB + "/icon-192.png"}, footer: {text: "Poke Gacha Online · pokegachaonline.es"}}]});

const embedSorteo = (d) => ({embeds: [{color: 0xb06cf0, title: "🎉 ¡Nuevo sorteo! · " + limpio(d.tt || "Sorteo", 80), url: WEB,
  description: "Apúntate dentro del juego en **Más › 🎉 Sorteos**. ¡Mucha suerte!",
  fields: [
    {name: "Premio", value: premio(d), inline: true},
    {name: "Ganadores", value: String(Math.max(1, n(d.nw))), inline: true},
    {name: "Cierra", value: n(d.end) ? ts(d.end, "f") + " (" + ts(d.end, "R") + ")" : "—", inline: true},
  ],
  image: {url: WEB + "/discord/evento_sorteo.png"}, footer: {text: "Poke Gacha Online · pokegachaonline.es"}}]});

const embedGanadores = (d) => {
  const wn = Array.isArray(d.wn) ? d.wn.slice(0, 25).map((x) => "🏆 **" + limpio(x, 30) + "**") : [];
  return {embeds: [{color: 0xffcc33, title: "🏆 ¡Ya hay ganadores! · " + limpio(d.tt || "Sorteo", 80), url: WEB,
    description: (wn.length ? wn.join("\n") : "Nadie se apuntó a este sorteo.") +
      (wn.length ? "\n\n¡Enhorabuena! Al entrar en el juego os saldrá el aviso para reclamar el premio." : ""),
    fields: [{name: "Premio", value: premio(d), inline: false}],
    footer: {text: "Poke Gacha Online · pokegachaonline.es"}}]};
};

// función «discord» (solo administradores): k "codigo" (id = código) o "sorteo" (id = sorteo)
async function avisar(db, uid, data) {
  if (!uid) return {ok: false, why: "sin-cuenta"};
  const adm = await db.doc("admins/" + uid).get();
  if (!adm.exists) return {ok: false, why: "no-admin"};
  const k = data && data.k, id = String((data && data.id) || "").slice(0, 64);
  if (!id) return {ok: false, why: "falta-id"};
  if (k === "codigo") {
    const c = id.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    const s = await db.doc("codesPub/" + c).get();
    if (!s.exists) return {ok: false, why: "no-publico"};
    const d = s.data() || {};
    if (d.on === false || (n(d.until) && Date.now() > n(d.until))) return {ok: false, why: "no-activo"};
    return unaVez(db, "codigo_" + c, () => enviar("codigo", embedCodigo(c, d)));
  }
  if (k === "sorteo") {
    const s = await db.doc("raffles/" + id.replace(/[^\w-]/g, "")).get();
    if (!s.exists) return {ok: false, why: "no-existe"};
    const d = s.data() || {};
    if (d.st === "done") return unaVez(db, "sorteo_" + id + "_hecho", () => enviar("sorteo", embedGanadores(d)));
    return unaVez(db, "sorteo_" + id + "_abierto", () => enviar("sorteo", embedSorteo(d)));
  }
  return {ok: false, why: "tipo"};
}

// podio del torneo de la semana pasada: se llama en cada guardado, pero solo trabaja una vez por semana y copia
let TORNEO_VISTO = "";
async function torneoSemanal(db, ahora) {
  const pw = semanaAnterior(ahora);
  if (TORNEO_VISTO === pw || !ok(HOOK().torneo)) return;
  // solo el lunes o el martes (hora de España), para no anunciar semanas viejas al publicar a mitad de semana
  const dia = new Intl.DateTimeFormat("en-GB", {timeZone: "Europe/Madrid", weekday: "short"}).format(new Date(ahora));
  if (dia !== "Mon" && dia !== "Tue") return;
  TORNEO_VISTO = pw;
  const key = claveTorneo(pw);
  const sn = await db.collection("tours").doc(key).collection("s").orderBy("sc", "desc").limit(3).get();
  if (sn.empty) return;
  const med = ["🥇", "🥈", "🥉"];
  const top = sn.docs.map((x, i) => med[i] + " **" + limpio(x.get("n") || "Entrenador", 30) + "** · " + fmt(x.get("sc")) + " puntos");
  const juego = MG[juegoTorneo(pw)] || "";
  await unaVez(db, "torneo_" + pw, () => enviar("torneo", {embeds: [{color: 0xffcc33,
    title: "🏆 Torneo semanal · resultados (" + pw.replace("-W", " · semana ") + ")", url: WEB,
    description: (juego ? "Minijuego: **" + juego + "**\n\n" : "") + top.join("\n") +
      "\n\n¡Enhorabuena! Los premios se recogen al entrar en el juego. El torneo de esta semana ya ha empezado en el juego. ¡A por el podio!",
    image: {url: WEB + "/discord/evento_torneo.png"}, footer: {text: "Poke Gacha Online · pokegachaonline.es"}}]}));
}

// ======================= 8.0: Mercader misterioso y pistas del tesoro =======================
// El mismo horario que el juego (src/p_v8b.js: merSlots) y las pistas que exporta el juego (datos.json → tesoro).
const D8 = (() => { try { return require("./datos.json"); } catch (e) { return {}; } })();
function rng8(str) {
  let h = 2166136261;
  for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  let a = h >>> 0;
  return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function mad(t) {
  const o = {};
  new Intl.DateTimeFormat("en-GB", {timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false})
    .formatToParts(new Date(t)).forEach((x) => { o[x.type] = x.value; });
  return {y: +o.year, m: +o.month, d: +o.day, h: (+o.hour) % 24, mi: +o.minute, wd: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(o.weekday), day: o.year + "-" + o.month + "-" + o.day};
}
function madTs(y, m, d, h, mi) {
  const base = Date.UTC(y, m - 1, d, h, mi);
  for (const off of [60, 120]) { const t = base - off * 6e4, q = mad(t); if (q.h === h && q.mi === mi && q.d === d) return t; }
  return base - 60 * 6e4;
}
function merSlots(day) {
  const [y, m, d] = day.split("-").map(Number), r = rng8("mer|" + day), out = [];
  let tries = 0;
  while (out.length < 3 && tries++ < 60) { const mi = 600 + Math.floor(r() * 26) * 30; if (out.every((x) => Math.abs(x - mi) >= 120)) out.push(mi); }
  return out.sort((a, b) => a - b).map((mi, i) => { const a = madTs(y, m, d, Math.floor(mi / 60), mi % 60); return {id: day + "_" + i, a, b: a + 30 * 6e4}; });
}
// semana ISO de una fecha de España (como isoWeek() del juego)
function semana8(y, m, d) {
  const t = new Date(Date.UTC(y, m - 1, d)), n = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - n);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return t.getUTCFullYear() + "-W" + String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, "0");
}
let V8_VISTO = 0;
async function eventosV8(db, ahora) {
  if (ahora - V8_VISTO < 60000 || !ok(HOOK().eventos)) return;
  V8_VISTO = ahora;
  const M = mad(ahora);
  // el mercader está en el pueblo ahora mismo
  const w = merSlots(M.day).find((s) => ahora >= s.a && ahora < s.b);
  if (w) {
    await unaVez(db, "mercader_" + w.id, () => enviar("eventos", {embeds: [{color: 0xb07a2a, title: "🧳 ¡Ha llegado el Mercader misterioso!", url: WEB,
      description: "Trae ofertas que no verás en ninguna tienda: Pokémon poco comunes, lotes de objetos y huevos especiales.\n\nSe va " + ts(w.b, "R") + " (a las " + ts(w.b, "t") + "). ¡Corre a **Actividades › 🧳 Mercader**!",
      footer: {text: "Poke Gacha Online · pokegachaonline.es"}}]}));
  }
  // a partir de las 10:00, la pista del tesoro de mañana
  if (M.h >= 10 && D8.tesoro) {
    const t2 = mad(ahora + 864e5), wk = semana8(t2.y, t2.m, t2.d), L = D8.tesoro[wk];
    if (Array.isArray(L) && L[t2.wd]) {
      const dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
      await unaVez(db, "tesoro_" + t2.day, () => enviar("eventos", {embeds: [{color: 0xffcf2a, title: "🗺️ Búsqueda del tesoro · ¡pista adelantada!", url: WEB,
        description: "La pista del **" + dias[t2.wd] + "** antes que nadie:\n\n> " + limpio(L[t2.wd], 300) + "\n\nBusca el tesoro en la Exploración y apúntate en el cuadro de honor (**Retos › 🗺️ Tesoro semanal**).",
        footer: {text: "Poke Gacha Online · pokegachaonline.es"}}]}));
    }
  }
  // meta de la comunidad (8.3): aviso al llegar a la mitad y al completarla (la meta, como en el juego: un 10 % más que
  // lo que se tiró la semana anterior, como mínimo 20 000)
  try {
    const wk = semanaISO(ahora), pw = semanaISO(ahora - 7 * 864e5);
    const [a, b] = await Promise.all([db.doc("comunidad/" + wk).get(), db.doc("comunidad/" + pw).get()]);
    const tot = a.exists ? n(a.data().n) : 0, prev = b.exists ? n(b.data().n) : 0;
    const nice = (x) => { if (x <= 0) return 0; const e = Math.pow(10, Math.max(0, Math.floor(Math.log10(x)) - 1)); return Math.ceil(x / e) * e; };
    const meta = Math.max(20000, nice(prev * 1.1));
    for (const [pct, tt, txt] of [[100, "🌍 ¡META DE LA COMUNIDAD CONSEGUIDA!", "¡Entre todos hemos llegado a las **" + fmt(meta) + "** tiradas de la semana! Pasa por **Retos › 🌍 Meta de la comunidad** a por tu premio. Y si llegamos al 150 %, ¡hay otro más!"],
      [50, "🌍 ¡Vamos por la mitad de la meta de la comunidad!", "Ya llevamos **" + fmt(tot) + "** de **" + fmt(meta) + "** tiradas esta semana. Cada tirada del gacha suma: ¡a por el 75 %!"]]) {
      if (tot >= meta * pct / 100) { await unaVez(db, "comunidad_" + wk + "_" + pct, () => enviar("eventos", {embeds: [{color: 0x38c1d8, title: tt, url: WEB, description: txt, footer: {text: "Poke Gacha Online · pokegachaonline.es"}}]})); break; }
    }
  } catch (e) { /* sin aviso */ }
}

module.exports = {avisar, torneoSemanal, eventosV8, merSlots, enviar, premio, limpio};
