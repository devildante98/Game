# ===================== novedades: ficha, naturalezas, objetos equipables, guardería, safari, torre, expediciones, salón de la fama y regalos =====================
_gi=H.index('<script type="text/plain" id="game">');_ge=H.index('</script>',_gi)
H=H[:_ge]+open(W+'p_new.js',encoding='utf-8').read()+'\n'+open(W+'p_chat.js',encoding='utf-8').read()+'\n'+open(W+'p_mini.js',encoding='utf-8').read()+'\n'+open(W+'p_mini2.js',encoding='utf-8').read().replace('__WEIGHTS__',open(W+'p_weights.json').read())+'\n'+open(W+'p_fossil.js',encoding='utf-8').read()+'\n'+open(W+'p_extra.js',encoding='utf-8').read()+'\n'+open(W+'p_raid.js',encoding='utf-8').read()+'\n'+open(W+'p_market.js',encoding='utf-8').read()+'\n'+open(W+'p_supreme.js',encoding='utf-8').read()+'\n'+open(W+'p_upd.js',encoding='utf-8').read()+'\n'+open(W+'p_mgrank.js',encoding='utf-8').read()+'\n'+open(W+'p_abil.js',encoding='utf-8').read().replace('__ABIL__',open(W+'p_abil.json',encoding='utf-8').read())+'\n'+open(W+'p_abfx.js',encoding='utf-8').read()+'\n'+open(W+'p_dbl.js',encoding='utf-8').read()+'\n'+open(W+'p_ext3.js',encoding='utf-8').read()+'\n'+open(W+'p_mod.js',encoding='utf-8').read()+'\n'+open(W+'p_pwa.js',encoding='utf-8').read()+'\n'+open(W+'p_tut.js',encoding='utf-8').read()+'\n'+H[_ge:]
# ---- Firestore: regalos entre amigos (colección gifts) ----
rep('trDel:id=>S.deleteDoc(S.doc(db,"trades",id)),','''trDel:id=>S.deleteDoc(S.doc(db,"trades",id)),
    gfWatch(cb){S.onSnapshot(S.query(S.collection(db,"gifts"),S.where("to","==",uid)),sn=>cb(sn.docs.map(d=>Object.assign({id:d.id},d.data()))),()=>{})},
    gfSend:(to,fn,d)=>S.setDoc(S.doc(db,"gifts",uid+"_"+to+"_"+d),{from:uid,to:to,fn:String(fn||"").slice(0,30),d:String(d),at:Date.now()}),
    gfDel:id=>S.deleteDoc(S.doc(db,"gifts",id)),
    chWatch(tp,id,cb,lim){const c=tp==="global"?S.collection(db,"chats","global","msgs"):tp==="g"?S.collection(db,"gchats",id,"msgs"):S.collection(db,"dms",id,"msgs");return S.onSnapshot(S.query(c,S.orderBy("at","desc"),S.limit(lim||(tp==="global"?40:tp==="g"?30:15))),sn=>cb(sn.docs.map(d=>Object.assign({id:d.id},d.data()))),()=>{})},
    chSend(tp,id,d){const c=tp==="global"?S.collection(db,"chats","global","msgs"):tp==="g"?S.collection(db,"gchats",id,"msgs"):S.collection(db,"dms",id,"msgs");return S.addDoc(c,d)},
    del:()=>S.deleteField(),
    async modIsAdmin(){try{const s=await S.getDoc(S.doc(db,"admins",uid));if(s.exists())return true}catch(e){}
      try{await S.getDocs(S.query(S.collection(db,"suggestions"),S.limit(1)));return true}catch(e){}
      try{await S.getDocs(S.query(S.collection(db,"reports"),S.limit(1)));return true}catch(e){}return false},
    banWatch(cb){return S.onSnapshot(S.doc(db,"bans",uid),sn=>cb(sn.exists()?sn.data():null),()=>{})},
    reportAdd:d=>S.addDoc(S.collection(db,"reports"),d),
    async reportList(){const sn=await S.getDocs(S.query(S.collection(db,"reports"),S.orderBy("at","desc"),S.limit(100)));return sn.docs.map(d=>Object.assign({id:d.id},d.data()))},
    reportDel:id=>S.deleteDoc(S.doc(db,"reports",id)),
    async banList(){const sn=await S.getDocs(S.collection(db,"bans"));return sn.docs.map(d=>Object.assign({id:d.id},d.data()))},
    banSet:(u,d)=>S.setDoc(S.doc(db,"bans",u),d),
    banDel:u=>S.deleteDoc(S.doc(db,"bans",u)),
    tourDel:(w,u)=>S.deleteDoc(S.doc(db,"tours",w,"s",u)),
    raidNew:(id,d)=>S.setDoc(S.doc(db,"raids",id),d),
    async raidJoin(id,u,me){const ref=S.doc(db,"raids",id);await S.runTransaction(db,async tx=>{const s=await tx.get(ref);if(!s.exists())throw {code:"nf"};const v=s.data();if(v.st!=="lobby"||Object.keys(v.pl||{}).length>=4)throw {code:"full"};tx.update(ref,{["pl."+u]:me})})},
    raidWatch:(id,cb)=>S.onSnapshot(S.doc(db,"raids",id),sn=>cb(sn.exists()?Object.assign({id:sn.id},sn.data()):null),()=>{}),
    raidUpd:(id,f)=>S.updateDoc(S.doc(db,"raids",id),f),
    raidHit:(id,u,a)=>S.updateDoc(S.doc(db,"raids",id),{hp:S.increment(-a),["pl."+u+".dmg"]:S.increment(a)}),
    raidDel:id=>S.deleteDoc(S.doc(db,"raids",id)),
    async raidList(){const sn=await S.getDocs(S.query(S.collection(db,"raids"),S.where("st","==","lobby"),S.limit(30)));return sn.docs.map(d=>Object.assign({id:d.id},d.data()))},
    async mkList(){const sn=await S.getDocs(S.query(S.collection(db,"market"),S.where("st","==","open"),S.limit(150)));return sn.docs.map(d=>Object.assign({id:d.id},d.data()))},
    mkMine(cb){return S.onSnapshot(S.query(S.collection(db,"market"),S.where("s","==",uid)),sn=>cb(sn.docs.map(d=>Object.assign({id:d.id},d.data()))),()=>{})},
    mkAdd:d=>S.addDoc(S.collection(db,"market"),d),
    mkDel:id=>S.deleteDoc(S.doc(db,"market",id)),
    async mkBuy(id,bn){const ref=S.doc(db,"market",id);await S.runTransaction(db,async tx=>{const s=await tx.get(ref);if(!s.exists()||s.data().st!=="open"||s.data().s===uid)throw {code:"gone"};tx.update(ref,{st:"sold",b:uid,bn:String(bn||"")})})},
    async mkCancel(id){const ref=S.doc(db,"market",id);await S.runTransaction(db,async tx=>{const s=await tx.get(ref);if(!s.exists()||s.data().st!=="open")throw {code:"gone"};tx.delete(ref)})},
    refSet:(c,d)=>S.setDoc(S.doc(db,"refs",c),d),
    async refGet(c){const s=await S.getDoc(S.doc(db,"refs",c));return s.exists()?s.data():null},
    refJoin:(c,d)=>S.setDoc(S.doc(db,"refs",c,"inv",uid),d),
    refUpd:(c,f)=>S.updateDoc(S.doc(db,"refs",c,"inv",uid),f),
    async refInv(c){const sn=await S.getDocs(S.collection(db,"refs",c,"inv"));return sn.docs.map(d=>Object.assign({id:d.id},d.data()))},
    duCreate:(id,d)=>S.setDoc(S.doc(db,"sdu",id),d),
    duUpd:(id,f)=>S.updateDoc(S.doc(db,"sdu",id),f),
    duDel:id=>S.deleteDoc(S.doc(db,"sdu",id)),
    duWatch:(id,cb)=>S.onSnapshot(S.doc(db,"sdu",id),sn=>cb(sn.exists()?Object.assign({id:sn.id},sn.data()):null),()=>{}),
    duInbox(cb){return S.onSnapshot(S.query(S.collection(db,"sdu"),S.where("b","==",uid)),sn=>cb(sn.docs.map(d=>Object.assign({id:d.id},d.data()))),()=>{})},
    // solo sube la marca si es mejor que la guardada (si no, una partida de otro dispositivo podía bajarla)
    tourSet:(w,d)=>{const r=S.doc(db,"tours",w,"s",uid);return S.runTransaction(db,async tx=>{const o=await tx.get(r);if(o.exists()&&(+o.data().sc||0)>=(+d.sc||0))return;tx.set(r,d)})},
    async tourTop(w,n){const sn=await S.getDocs(S.query(S.collection(db,"tours",w,"s"),S.orderBy("sc","desc"),S.limit(n)));return sn.docs.map(d=>Object.assign({id:d.id},d.data()))},
    chDel(tp,id,m){return S.deleteDoc(tp==="global"?S.doc(db,"chats","global","msgs",m):tp==="g"?S.doc(db,"gchats",id,"msgs",m):S.doc(db,"dms",id,"msgs",m))},''')
rep('const k=GD.EI[id]?id:ITEM_IMG[id];','const k=GD.EI[id]?id:ITEM_IMG[id]||HIMG[id];')
rep('const SHINY_G=1/500,SHINY_S=1/250,SHINY_W=1/400,shinyTotal=','var SHINY_G=1/500,SHINY_S=1/250,SHINY_W=1/400;const shinyTotal=')
rep('const cpc=()=>.1*Math.pow(2,S.cl)*PMUL(),','const cpc=()=>.1*Math.pow(2,S.cl)*PMUL()*(typeof hhMul==="function"?hhMul("tk"):1),')
rep('<h2>👋 ¡Bienvenido a PokeGacha!</h2>\n  <p>Colecciona más de 1.200 Pokémon, entrénalos y combate. Esto es lo más importante que debes saber:</p>\n  <ul>\n    <li>🎟️ <b>Tickets</b>: son la moneda del juego. Consíguelos tocando la <b>Pokéball grande</b> (o con la tecla <b>U</b>), con el regalo diario, el ticket automático, los combates, las misiones y los logros.</li>\n    <li>🛍️ <b>Tienda de mejoras</b>: compra Guantes (más tickets por toque) y ayudantes que generan tickets por segundo.</li>\n    <li>🎰 <b>Tiradas</b>: gasta tickets para conseguir Pokémon (Común, Raro, Épico y Legendario). Cada 30 tiradas tienes un Épico o mejor garantizado. Cada 10 tiradas el precio sube.</li>\n    <li>📚 <b>Pokedex</b>: mira los Pokémon que tienes y los que te faltan.</li>\n    <li>🏅 <b>Gimnasios y zonas</b>: gana las 8 medallas para desbloquear zonas de exploración y la Liga.</li>\n    <li>🔥 <b>Pase diario</b>: reclama el regalo cada día seguido para avanzar en tu racha (botón 🔥 junto al regalo diario).</li>\n    <li>⚔️ <b>Combate</b>: forma un equipo de hasta 6 Pokémon. Ganando suben de nivel, aprenden habilidades y consigues tickets y objetos. ¡También puedes capturar Pokémon salvajes! Cada movimiento tiene <b>PP</b> (usos limitados): recupéralos con Éter, Elixir o en el Centro Pokémon.</li>\n    <li>🏥 <b>Centro Pokémon</b> y 🎒 <b>Mochila</b>: los PS no se recuperan solos; cura a tu equipo o usa pociones.</li>\n    <li>🏆 <b>Liga Pokémon</b> y 🌐 <b>PVP online</b>: reta al Alto Mando o a otros jugadores conectados, en duelos 1 contra 1 o en salas 2 vs 2 con código.</li>\n    <li>📅 <b>Misiones diarias</b> y 🏅 <b>Logros</b>: complétalos para ganar grandes recompensas.</li>\n    <li>🌟 <b>Prestigio</b>: cuando tengas todos los logros, reinicia la partida para conseguir ventajas permanentes y logros nuevos.</li>\n    <li>🧬 <b>Evoluciones</b>: tus Pokémon evolucionan al llegar a su nivel o con objetos como la Piedra Fuego, la Piedra Lunar o el Cordón Unión (en la tienda y como botín).</li>\n    <li>👥 <b>Amigos</b> y 🛡️ <b>Gremios</b>: añade amigos para retarles e invitarles a tus salas, o únete a un gremio.</li>\n    <li>🧑 <b>Tu entrenador</b>: personaliza su cara, pelo, ropa y mochila. ¡Aparece en tus combates!</li>\n    <li>🧭 Usa el botón de <b>accesos directos</b> (abajo a la derecha) para ir a cualquier parte sin hacer scroll, y ⚙️ (arriba a la derecha) para la música y las opciones.</li>\n  </ul>\n  <p>Si has iniciado sesión, tu progreso se guarda solo en la nube cada pocos minutos (y al pulsar «💾 Guardar» arriba). ¡Mucha suerte, entrenador!</p>\n  ','<h2>👋 ¡Bienvenido a Poke Gacha Online!</h2>\n  <p class="wlead">Un juego de <b>coleccionar Pokémon</b>: consigues tickets, los gastas en <b>tiradas</b> para obtener Pokémon (más de 1.200, incluidos legendarios, megas y variocolores), formas un equipo, lo haces más fuerte combatiendo y compites y colaboras con otros jugadores.</p>\n  <div class="wloop"><span>🎟️ Consigue tickets</span><i>→</i><span>🎰 Haz tiradas</span><i>→</i><span>⚔️ Combate y sube de nivel</span><i>→</i><span>🏅 Gana medallas</span></div>\n  <h3>🔑 Lo básico</h3>\n  <ul>\n    <li>🎟️ <b>Tickets</b>: la moneda del juego. Toca la Poké Ball grande (o la tecla <b>U</b>), compra ayudantes en la tienda para generarlos solos y reclama el regalo diario 🔥 para mantener tu racha.</li>\n    <li>🎰 <b>Tiradas</b>: Común ★, Raro ★★, Épico ★★★, Forma especial ★★★★ y Legendario ★★★★★. Cada 30 tiradas, Épico o mejor garantizado. Toca un Pokémon que te salga para verlo en grande.</li>\n    <li>⚔️ <b>Combates</b>: equipo de hasta 6. Ganando suben de nivel, aprenden movimientos, <b>evolucionan</b> y consigues tickets y objetos. Captura Pokémon salvajes con Poké Balls. Los PS y los PP no se recuperan solos: usa el Centro Pokémon o la Mochila.</li>\n    <li>🏅 <b>Gimnasios</b>: tus Pokémon no pueden pasar del nivel del siguiente líder. Vence los 8 gimnasios para subir el límite y desbloquear la <b>Liga</b> y el <b>Salón de la Fama</b>.</li>\n    <li>🧬 <b>Profundidad</b>: cada Pokémon tiene <b>naturaleza</b> y puede llevar un <b>objeto</b> (Restos, Vidasfera…). Si tienes su forma Mega o Gigamax, puedes <b>megaevolucionar o dinamaxizar</b> en combate. Toca un Pokémon en la Pokédex para ver su ficha, ponerle mote o marcarlo como favorito.</li>\n  </ul>\n  <h3>🎪 Cosas que hacer cada día</h3>\n  <ul class="wgrid">\n    <li>📅 <b>Misiones</b> y 🎫 <b>Pase de temporada</b> (30 niveles al mes, legendario al final)</li>\n    <li>🎮 <b>Minijuegos</b> con premio y 🏆 <b>Torneo semanal</b> con Pokémon exclusivos</li>\n    <li>🤝 <b>Compañero</b>, 🥚 <b>Guardería</b>, 🌾 <b>Safari</b>, 🗼 <b>Torre Batalla</b> y 🧭 <b>Expediciones</b></li>\n    <li>🎉 <b>Horas felices</b> a las 13:00 y 20:00, y 🌙 Pokémon distintos de <b>día y de noche</b></li>\n    <li>📔 <b>Álbum de pegatinas</b>, 🏅 <b>Logros</b> y 🌟 <b>Prestigio</b> para ventajas permanentes</li>\n  </ul>\n  <h3>🌐 Con otros jugadores</h3>\n  <ul class="wgrid">\n    <li>⚔️ <b>PVP</b> 1 vs 1 y salas 2 vs 2, con temporadas y clasificación</li>\n    <li>🔴 <b>Incursiones</b>: hasta 4 contra un jefe gigante que luego podéis capturar</li>\n    <li>👥 <b>Amigos</b>, 💬 <b>chat</b>, 🎁 regalos diarios, 🔄 intercambios y ⚔️ duelos de siluetas</li>\n    <li>🛡️ <b>Gremios</b>, 🛒 <b>Mercadillo</b> y 📨 <b>invitar amigos</b> con tu código</li>\n  </ul>\n  <h3>🧭 Cómo moverte</h3>\n  <p>Pulsa la <b>Poké Ball MENÚ</b> (abajo a la derecha) para abrir cualquier sección en una ventana; los números rojos te avisan de lo que tienes pendiente. Arriba tienes 💬 chat, pantalla completa y ⚙️ ajustes. Tu entrenador se personaliza en «Tu entrenador».</p>\n  <p class="mut">Con sesión iniciada tu progreso se guarda en la nube automáticamente. ¡Mucha suerte, entrenador!</p>\n  ')
rep('const own=P.filter(p=>S.owned[p[0]]&&(!r||p[2]===r)','const own=P.filter(p=>S.owned[p[0]]&&!(typeof isSup==="function"&&isSup(p[0]))&&(!r||p[2]===r)')
rep('const gc=i=>Math.ceil(G[i][1]*Math.pow(1.15,S.g[i]));','var gc=i=>Math.ceil(G[i][1]*Math.pow(1.15,S.g[i]));')

# ---- versión de compilación: cada vez que se publica el juego se detecta y se recarga sin caché ----
import time as _t
_BID=str(int(_t.time()))
rep('<meta charset="utf-8">','<meta charset="utf-8">\n<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n<meta http-equiv="Pragma" content="no-cache">\n<meta http-equiv="Expires" content="0">\n<meta name="game-build" content="'+_BID+'">')
rep("""function verCheck(){
  if(!/^https?:/.test(location.protocol))return;
  fetch(location.href.split("#")[0],{cache:"no-store"}).then(r=>r.text()).then(h=>{const m=h.match(new RegExp('\\\\{v:"([^"]+)"'));if(m&&m[1]!==GAME_V)$("updB").hidden=false}).catch(()=>{});
}
$("updGo").onclick=async()=>{save();try{if(window.cloudFlush)await window.cloudFlush()}catch(e){}location.reload()};""","""const GAME_B="__BID__";
function verURL(){const u=new URL(location.href);u.hash="";u.searchParams.set("_v",Date.now());return u.toString()}
function verCheck(auto){
  if(!/^https?:/.test(location.protocol))return;
  fetch(verURL(),{cache:"no-store"}).then(r=>r.text()).then(h=>{const m=h.match(/name="game-build" content="(\\d+)"/);if(m&&m[1]!==GAME_B&&+m[1]>+GAME_B){if(auto===true&&!fcd)verGo();else $("updB").hidden=false}}).catch(()=>{});
}
async function verGo(){try{save()}catch(e){}try{if(window.cloudFlush)await window.cloudFlush()}catch(e){}const u=new URL(location.href);u.searchParams.set("v",Date.now());location.replace(u.toString())}
$("updGo").onclick=verGo;
setTimeout(()=>verCheck(true),1500);document.addEventListener("visibilitychange",()=>{if(!document.hidden)verCheck(false)});""".replace("__BID__",_BID))
rep('setInterval(verCheck,5*60000);','setInterval(()=>verCheck(false),2*60000);')
rep('else if(/^[1-6]$/.test(k)&&!e.repeat)','else if(/^[1-8]$/.test(k)&&!e.repeat)')
rep('  if(Date.now()-last<60000){sugMsg("Espera un minuto antes de enviar otra sugerencia.");return}\n','')
rep('window.sugSend=async(text,nick)=>{if(!uid)throw {code:"sin-cuenta"};await S.addDoc(S.collection(db,"suggestions"),{uid:uid,name:cu?label(cu):"",nick:String(nick||"").slice(0,40),text:String(text).slice(0,1000),at:Date.now()})};',
 'window.sugSend=async(text,nick,imgs)=>{if(!uid)throw {code:"sin-cuenta"};const d={uid:uid,name:cu?label(cu):"",nick:String(nick||"").slice(0,40),text:String(text).slice(0,1000),at:Date.now()};if(Array.isArray(imgs)&&imgs.length){d.imgs=imgs.slice(0,3);d.nimg=d.imgs.length}await S.addDoc(S.collection(db,"suggestions"),d)};\n  window.sugImgDel=async id=>{await S.updateDoc(S.doc(db,"suggestions",id),{imgs:S.deleteField()})};')
# ---- favicon ----
import base64 as _b64
_fsv=_b64.b64encode(open(W+'favicon.svg','rb').read()).decode();_fap=_b64.b64encode(open(W+'favicon_apple.png','rb').read()).decode()
rep('<title>Poke Gacha Online · Gacha</title>','<title>Poke Gacha Online · Gacha</title>\n<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,'+_fsv+'">\n<link rel="apple-touch-icon" href="data:image/png;base64,'+_fap+'">\n<meta name="theme-color" content="#c42a5e">\n<link rel="manifest" href="manifest.webmanifest">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="PokeGacha">\n<meta name="description" content="Colecciona más de 1.200 Pokémon, haz tiradas, combate en gimnasios, incursiones y torneos, y juega con entrenadores de todo el mundo. Gratis y en el navegador.">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Poke Gacha Online">\n<meta property="og:title" content="Poke Gacha Online">\n<meta property="og:description" content="Colecciona más de 1.200 Pokémon, haz tiradas, combate en gimnasios, incursiones y torneos, y juega con entrenadores de todo el mundo. Gratis y en el navegador.">\n<meta property="og:url" content="https://devildante98.github.io/Game/">\n<meta property="og:image" content="https://devildante98.github.io/Game/og.png">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="Poke Gacha Online: Mewtwo, Charizard y Pikachu">\n<meta property="og:locale" content="es_ES">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="Poke Gacha Online">\n<meta name="twitter:description" content="Colecciona más de 1.200 Pokémon, haz tiradas, combate en gimnasios, incursiones y torneos, y juega con entrenadores de todo el mundo. Gratis y en el navegador.">\n<meta name="twitter:image" content="https://devildante98.github.io/Game/og.png">')
# ---- aviso de fangame en la pantalla de acceso ----
rep('<p id="amsg" role="alert">Comprobando sesión…</p>','<p id="amsg" role="alert">Comprobando sesión…</p>\n    <small class="afan">Fangame gratuito y sin ánimo de lucro. Pokémon y sus personajes son marcas de Nintendo, Game Freak y The Pokémon Company; este juego no es oficial ni tiene relación con ellas.</small>')
rep('#amsg{min-height:1.3em;color:var(--red);font-size:.9rem;text-align:center;margin:0}','#amsg{min-height:1.3em;color:var(--red);font-size:.9rem;text-align:center;margin:0}\n#aform .afan{display:block;text-align:center;color:var(--mute);font-size:.7rem;line-height:1.35;opacity:.8;margin-top:2px}')
rep("""'</h2><span class="tier t'+tierIdx(sp)+'">'""","""'</h2>'+(d.tit?'<div class="proftit">'+esc(String(d.tit).slice(0,40))+'</div>':'')+'<span class="tier t'+tierIdx(sp)+'">'""")
rep("""    (Array.isArray(d.tm)&&d.tm.length?'<b>Equipo</b>""","""    (Array.isArray(d.shw)&&d.shw.length?'<b>🖼️ Vitrina</b><div class="proftm profshw">'+d.shw.filter(x=>x&&PM[x.n]).map(x=>'<div>'+icoHD(PM[x.n],80,false,!!x.s)+'<small>'+esc(x.k||x.n)+' Nv'+(x.l|0)+'</small></div>').join("")+'</div>':'')+
    (Array.isArray(d.tm)&&d.tm.length?'<b>Equipo</b>""")
rep('["🏆","Logros",d.ach|0]];','["🏆","Logros",d.ach|0],["⏱️","Horas jugadas",d.pt|0],["🎰","Tiradas",d.pulls|0]];')
# ---- tienda: sección de objetos equipables ----
rep('''it[7]==="evo"&&ITEMS[i-1][7]!=="evo"?'<h3 class="shh">🧬 Objetos evolutivos</h3>':\'\'''','''it[7]==="evo"&&ITEMS[i-1][7]!=="evo"?'<h3 class="shh">🧬 Objetos evolutivos</h3>':it[7]==="hold"&&ITEMS[i-1][7]!=="hold"?'<h3 class="shh">🎒 Objetos para equipar</h3>':it[7]==="crys"?'<h3 class="shh">💠 Cristales</h3>':\'\'''')
# ---- Pokédex: ficha al tocar, motes, favoritos y filtro ----
rep('return `<div class="card ${p[2]} ${r?"":"lock"}"','return `<div class="card ${p[2]} ${r?"":"lock"}${r&&isFav(p[0])?" fav":""}"${r&&S.owned[p[0]]>0?\' data-dn="\'+esc(p[0])+\'"\':""}')
rep('<b>${r?p[0]:"???"}</b>','<b>${r?(isFav(p[0])?"⭐ ":"")+esc(nk(p[0])):"???"}</b>')
rep('JSON.stringify(S.shiny||{})+$("fr").value','JSON.stringify(S.shiny||{})+JSON.stringify(S.fav||{})+JSON.stringify(S.mote||{})+$("fr").value')
rep('s==="3"?!!(S.shiny&&S.shiny[p[0]]):c>1','s==="3"?!!(S.shiny&&S.shiny[p[0]]):s==="4"?isFav(p[0]):c>1')
rep('<option value="3">✨ Variocolor</option></select>','<option value="3">✨ Variocolor</option><option value="4">⭐ Favoritos</option></select>')
# ---- intercambios: los favoritos (si solo tienes uno) y los ocupados no se pueden dar ----
rep('const trOwnList=()=>P.filter(p=>S.owned[p[0]]>0);','const trOwnList=()=>P.filter(p=>S.owned[p[0]]>0&&!(isFav(p[0])&&S.owned[p[0]]<=1)&&!busyMon(p[0]));')
# ---- equipo: no se puede usar a los que están en la guardería o de expedición ----
rep('const v=$("tm"+i).value;S.team[i]=v;','const v=$("tm"+i).value;if(v&&busyMon(v)){toast("🔒 "+v+" está "+busyTxt(v)+". Recógelo primero.");updTeam();return}const _o=S.team[i];S.team[i]=v;')
rep('S.team=S.team.map(n=>S.owned[n]?n:"");','S.team=S.team.map(n=>S.owned[n]&&!(typeof busyMon==="function"&&busyMon(n))?n:"");')
# ---- perfil público: récord de la Torre y Salón de la Fama ----
rep('<h2>\'+esc(pvClean(d.n))+\' \'+','<h2>\'+(d.cr>=1&&d.cr<=3?["👑 ","🥈 ","🥉 "][d.cr-1]:"")+esc(pvClean(d.n))+\' \'+')
rep('["🔥","Mejor racha",d.bs|0]','["🔥","Mejor racha",d.bs|0],["🗼","Récord Torre",d.tw|0],["🏛️","Salón de la Fama",d.hof|0],["🏆","Trofeos de torneo",Array.isArray(d.tro)?d.tro.reduce((x,y)=>x+(y|0),0):0]')
rep("""'<div class="jrow">'+(uid!==me&&!isFriend(uid)""","""(Array.isArray(d.hft)&&d.hft.length?'<b>🏛️ Último equipo en el Salón de la Fama</b><div class="proftm">'+d.hft.filter(x=>x&&PM[x.n]).map(x=>'<div>'+ico(PM[x.n],56,false,!!x.s)+'<small>'+esc(x.k||x.n)+' Nv'+(x.l|0)+'</small></div>').join("")+'</div>':'')+
    '<div class="jrow">'+(uid!==me&&!isFriend(uid)""")
# ---- estilos ----
rep('body.hicon .panel{border-width:2px}',r'''body.hicon .panel{border-width:2px}
.hubgl{grid-template-columns:repeat(5,150px)}
@media (max-width:980px){.hubgl{grid-template-columns:repeat(3,150px)}}
#hubG{overflow-y:auto}
@media (max-width:700px){.hubgl{grid-template-columns:repeat(2,minmax(0,1fr))}.hubtile:nth-last-child(2):nth-child(odd){grid-column:span 2}}
.nxp input:not([type=checkbox]){font:inherit;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--panel);color:var(--ink);width:100%;box-sizing:border-box}.nxp .sets-row{display:flex;gap:8px;align-items:center}.nxp .sets-row button{flex:none}
.nxi{margin:-4px 0 14px;font-size:.92rem;line-height:1.4}
.nxbar{height:8px;border-radius:99px;background:var(--line);overflow:hidden;margin-top:6px}.nxbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#3ecf8e,#13a37f);border-radius:99px;transition:width .6s}
.nxgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;max-height:330px;overflow:auto;padding:2px}
.nxcell{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px;border-radius:14px;background:var(--panel);color:var(--ink);border:2px solid var(--line);min-width:0}
.nxcell b{font-size:.82rem;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nxcell small{font-size:.72rem;color:var(--mute);font-weight:600}
.nxcell.good{border-color:#3ecf8e;background:color-mix(in srgb,#3ecf8e 10%,var(--panel))}.nxcell.sel{border-color:var(--hc,#e0782a);box-shadow:0 0 0 3px color-mix(in srgb,var(--hc,#e0782a) 30%,transparent)}
.nxpick{background:var(--bg);border:1px solid var(--line);border-radius:16px;padding:12px;margin:12px 0;display:flex;flex-direction:column;gap:8px}
#nxM{position:fixed;inset:0;z-index:95;background:rgba(14,16,40,.62);display:grid;place-items:center;padding:16px}#nxM[hidden]{display:none}
.nxmw{background:var(--panel);color:var(--ink);border-radius:24px;padding:24px 22px;width:min(420px,100%);text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;box-shadow:0 24px 60px rgba(0,0,0,.4);border:3px solid #ffd35c}
.nxmw h3{margin:4px 0 0;font-size:1.35rem}.nxmw p{margin:0}.nxmw button{margin-top:8px;min-width:160px}
/* ficha */
.fich{width:100%;display:flex;flex-direction:column;gap:8px;background:var(--bg);border:1px solid var(--line);border-radius:16px;padding:12px;text-align:left;box-sizing:border-box}
.fichr{display:grid;grid-template-columns:96px 1fr;gap:10px;align-items:center}.fichr>span,.fichr>label{font-weight:800;font-size:.85rem;color:var(--mute)}
.fichin{display:flex;gap:6px;min-width:0}.fichin input,.fichin select{flex:1;min-width:0;font:inherit;padding:7px 10px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink)}.fichin button{padding:7px 12px}
.ffav{justify-self:start;background:var(--panel);color:var(--ink);border:1px solid var(--line)}.ffav.on{background:#ffd35c;color:#2a2200;border-color:#e0b020}
.fnat{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.fnat button{background:var(--panel);color:var(--ink);border:1px solid var(--line);padding:4px 9px;font-size:.8rem}.fnat button:hover{border-color:#13a37f}.fnat small{width:100%;color:var(--mute)}.fnat button small{opacity:.75;font-size:.7rem}
.fichd{display:flex;align-items:center;gap:6px;font-size:.8rem}.fichb{color:#e0782a;font-weight:700;font-size:.82rem}
.pkvw{max-height:calc(100vh - 32px);overflow:auto}
#dex .card[data-dn]{cursor:pointer}#dex .card.fav{box-shadow:0 0 0 2px #ffd35c inset}
/* guardería y huevos */
.dcrow{display:grid;grid-template-columns:1fr 130px 1fr;gap:10px;align-items:stretch}
.dcs{display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px;border-radius:18px;border:2px dashed var(--line);background:var(--bg);text-align:center}
.dcs.on{border-style:solid;background:linear-gradient(#fff6e8,#ffe9cc);border-color:#f0c48a}
.dcspr{height:80px;display:grid;place-items:end center}.dcplus{font-size:2.4rem;color:var(--mute);height:80px;display:grid;place-items:center}
.dcmid{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:4px;font-size:.8rem;color:var(--mute)}
.dcheart{font-size:2.2rem;animation:dch 1.4s ease-in-out infinite}.dcheart.off{animation:none;opacity:.5}@keyframes dch{50%{transform:scale(1.15)}}
.dcegg{display:flex;align-items:center;gap:14px;margin-top:12px;padding:12px 16px;border-radius:16px;background:var(--bg);border:1px solid var(--line)}.dcegg>div{flex:1;display:flex;flex-direction:column}
.egg{display:inline-block;flex:none;width:34px;height:42px;border-radius:50%/58% 58% 42% 42%;background:radial-gradient(circle at 34% 28%,#fff 0 12%,#fbf6e6 30%,#e9dfbf 75%,#cfc39b);box-shadow:inset -3px -4px 0 rgba(0,0,0,.07),0 4px 6px rgba(0,0,0,.18);position:relative;transform-origin:50% 90%}
.egg:before,.egg:after{content:"";position:absolute;border-radius:50%;background:#7ccf6a}
.egg:before{width:26%;height:20%;left:18%;top:46%}.egg:after{width:18%;height:14%;right:20%;top:24%}
.egg.big{width:56px;height:70px}.egg.huge{width:120px;height:150px}
.egg.wob{animation:eggw 1.8s ease-in-out infinite}@keyframes eggw{0%,60%,100%{transform:none}70%{transform:rotate(-10deg)}80%{transform:rotate(9deg)}90%{transform:rotate(-4deg)}}
.egg.c1,.egg.c2,.egg.c3{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M10 42 L24 52 L34 40 L46 54 L58 41 L70 53 L82 42 L92 50' fill='none' stroke='%23574a2c' stroke-width='3'/%3E%3C/svg%3E"),radial-gradient(circle at 34% 28%,#fff 0 12%,#fbf6e6 30%,#e9dfbf 75%,#cfc39b);background-size:100% 100%}
.egg.c3{filter:brightness(1.15)}
.eggl{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
.eggc{display:flex;flex-direction:column;align-items:center;gap:3px;padding:12px 8px;border-radius:16px;background:var(--bg);border:1px solid var(--line);text-align:center}.eggc .nxbar{width:100%}.eggc.ready{border-color:#ffb62e;box-shadow:0 0 0 3px rgba(255,182,46,.25)}
.hatch{position:relative;height:170px;display:grid;place-items:center;width:100%}.hflash{position:absolute;width:150px;height:150px;border-radius:50%;background:radial-gradient(#fff,rgba(255,255,255,0) 70%)}
.hmon{height:130px;display:grid;place-items:center;filter:drop-shadow(0 8px 8px rgba(0,0,0,.25))}
@media (max-width:620px){.dcrow{grid-template-columns:1fr 1fr}.dcmid{grid-column:span 2;grid-row:2;flex-direction:row}.dcheart{font-size:1.6rem}}
/* safari */
.safin{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:linear-gradient(135deg,#e6f6cf,#c5e8a0);color:#1d3a12;margin-bottom:10px;flex-wrap:wrap}.safin>div{flex:1;display:flex;flex-direction:column;min-width:180px}.safin .mut{color:#3d5a2c}
.safgate{font-size:2.6rem}
.safbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.safbar span{background:var(--bg);border:1px solid var(--line);border-radius:99px;padding:5px 12px;font-size:.88rem}
.safmon{position:relative;height:250px;border-radius:20px;overflow:hidden;background:linear-gradient(#bfe6ff,#e6f6ff 55%,#a8dc7a 56%,#79bf4c);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:16px;box-sizing:border-box}
.safgr{position:absolute;left:0;right:0;bottom:0;height:46%;background:repeating-linear-gradient(100deg,rgba(255,255,255,.0) 0 18px,rgba(40,110,30,.18) 18px 22px)}
.safspr{position:relative;z-index:1;height:190px;display:grid;place-items:end center;margin-bottom:4px;animation:tbreath 2s ease-in-out infinite;transform-origin:50% 100%}
.safspr img{max-height:190px;object-fit:contain}.safname{position:absolute;top:12px;left:12px;z-index:2;background:rgba(255,255,255,.88);color:#1c1f3a;border-radius:99px;padding:4px 14px;font-weight:800}.safname small{color:#555;font-weight:700}
.safst{display:inline-block;border-radius:99px;padding:1px 8px;font-size:.72rem;color:#fff}.safst.eat{background:#e0507a}.safst.ang{background:#d33}
.safball{position:absolute;z-index:3;left:calc(50% - 14px);bottom:70px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0 8%,transparent 9%),linear-gradient(#7aa83a 0 46%,#222 46% 54%,#f2f0e4 54%);border:2px solid #222;box-sizing:border-box;transform-origin:50% 100%}
.safball:after{content:"";position:absolute;left:50%;top:50%;width:9px;height:9px;margin:-5px;border-radius:50%;background:#fff;border:2px solid #222}
.safball.ok:after{background:#ff5a5a;box-shadow:0 0 8px #ff5a5a}
.safmsg{min-height:1.4em;text-align:center;font-weight:700;margin:10px 0}
.safbtn{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:8px}@media (max-width:620px){.safbtn{grid-template-columns:repeat(2,minmax(0,1fr))}}
.safcl{display:flex;flex-wrap:wrap;gap:4px;margin-top:10px}.safcl span{position:relative;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:2px}.safcl i{position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);font-style:normal;font-size:.55rem;font-weight:900;background:#e63950;color:#fff;border-radius:6px;padding:0 4px}
.safsum{text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px}.safsum .safcl{justify-content:center}
/* torre */
.twtop{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.twst{display:flex;flex-direction:column;align-items:center;padding:12px 6px;border-radius:16px;background:var(--bg);border:1px solid var(--line)}.twst span{font-size:1.5rem}.twst b{font-size:1.5rem}.twst small{color:var(--mute);font-weight:700;font-size:.78rem}
.twnext{display:flex;align-items:center;gap:12px;margin:12px 0;padding:14px 16px;border-radius:18px;background:linear-gradient(135deg,#2b2f5a,#4a3f8a);color:#fff;flex-wrap:wrap}.twnext>div{flex:1;display:flex;flex-direction:column;min-width:180px}.twnext .mut{color:#cfd3ff}
.twnext.boss{background:linear-gradient(135deg,#6b1d2a,#c0392b 60%,#f0a030);animation:twb 2s ease-in-out infinite}@keyframes twb{50%{box-shadow:0 0 22px rgba(240,160,48,.6)}}
.twshop{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}
.twit{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:14px;background:var(--bg);border:1px solid var(--line)}.twit>div{flex:1;display:flex;flex-direction:column;min-width:0}.twit b{font-size:.88rem}.twit button{padding:6px 10px;white-space:nowrap}
/* expediciones */
.exsl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.exc{display:flex;flex-direction:column;align-items:center;gap:2px;padding:12px 8px;border-radius:16px;background:var(--bg);border:1px solid var(--line);text-align:center;min-width:0}.exc .nxbar{width:100%}.exc small{font-size:.78rem}
.exc.empty{border-style:dashed;color:var(--mute);justify-content:center}.exc.empty span{font-size:1.8rem;opacity:.6}
.exc.done{border-color:#3ecf8e;box-shadow:0 0 0 3px rgba(62,207,142,.25)}.exspr{height:60px;display:grid;place-items:end center}
.exdest{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin-bottom:8px}
.exdest button{display:flex;flex-direction:column;align-items:center;gap:1px;padding:8px 4px;background:var(--panel);color:var(--ink);border:2px solid var(--line);border-radius:14px;min-width:0}.exdest button span{font-size:1.5rem}.exdest button b{font-size:.75rem;line-height:1.1}.exdest button small{font-size:.65rem}
.exdest button.on,.exdur button.on{border-color:#e0782a;background:color-mix(in srgb,#e0782a 12%,var(--panel))}
.exdur{display:flex;gap:6px;margin-bottom:8px}.exdur button{flex:1;background:var(--panel);color:var(--ink);border:2px solid var(--line)}
.exgo{display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap}.exgo small{flex:1;min-width:180px}
.exret{font-size:2.4rem}.exm{color:#13a37f;font-weight:800}
@media (max-width:620px){.exdest{grid-template-columns:repeat(3,minmax(0,1fr))}.exsl{grid-template-columns:1fr}}
/* salón de la fama */
.hofe{padding:10px 12px;border-radius:16px;background:var(--bg);border:1px solid var(--line);margin-bottom:8px}.hofh{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.hoftm{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.hoftm>div{display:flex;flex-direction:column;align-items:center;min-width:70px}.hoftm b{font-size:.85rem}.hoftm small{font-size:.72rem;color:var(--mute)}
.hoftm.sm{justify-content:flex-start}.hofb{font-size:3rem;animation:dch 1.6s ease-in-out infinite}
/* regalos */
.gfin{border-color:#ffb62e!important}.gfl{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.gfb{display:flex;flex-direction:column;align-items:center;gap:0;padding:8px 12px;background:linear-gradient(#fff4dc,#ffe3a8);color:#5a3a00;border:1px solid #f0c060;border-radius:14px}.gfb span{font-size:1.5rem;animation:dch 1.6s ease-in-out infinite}.gfb b{font-size:.78rem}.gfb small{font-size:.68rem}
.gfsend{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:6px 0}.gfsend small{flex:1}
.gfbox{font-size:3.4rem;animation:dch 1.2s ease-in-out infinite}
#chb{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));right:108px;z-index:60;width:42px;height:42px;border-radius:50%;padding:0;display:grid;place-items:center;background:var(--panel);color:var(--ink);border:1px solid var(--line);box-shadow:0 2px 8px rgba(0,0,0,.18);cursor:pointer;transition:transform .15s}
#chb:hover{transform:scale(1.08)}#chb i{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:#e63950;color:#fff;font-style:normal;font-size:.68rem;font-weight:900;display:grid;place-items:center;padding:0 4px;box-sizing:border-box;border:2px solid var(--panel)}#chb i.dot{min-width:12px;width:12px;height:12px;padding:0;top:-1px;right:-1px}#chb i[hidden]{display:none}
#chw{position:fixed;top:calc(58px + env(safe-area-inset-top,0px));right:12px;bottom:calc(150px + env(safe-area-inset-bottom,0px));width:min(380px,calc(100vw - 24px));z-index:70;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:20px;box-shadow:0 18px 50px rgba(20,24,60,.35);display:flex;flex-direction:column;overflow:hidden}#chw[hidden]{display:none}
.chh{display:flex;align-items:center;justify-content:space-between;padding:10px 12px 6px 16px}.chh b{font-size:1.05rem}.chx{width:34px;height:34px;padding:0;border-radius:10px;background:var(--bg);color:var(--ink);border:1px solid var(--line)}
.chtabs{display:flex;gap:6px;padding:0 12px 8px}.chtabs button{flex:1;position:relative;padding:7px 4px;font-size:.82rem;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:12px}.chtabs button.on{background:#13a37f;color:#fff;border-color:#13a37f}
.chtabs i,.chdm i{position:absolute;top:-6px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:#e63950;color:#fff;font-style:normal;font-size:.68rem;font-weight:900;display:grid;place-items:center;padding:0 4px;box-sizing:border-box}
.chsub{display:flex;align-items:center;gap:8px;padding:6px 14px;font-size:.8rem;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--bg);min-height:20px}.chwarn{color:#e63950;font-weight:700}
.chback{padding:3px 8px;font-size:.78rem;background:var(--panel);color:var(--ink);border:1px solid var(--line)}
.chl{flex:1;overflow-y:auto;padding:10px 10px 4px;display:flex;flex-direction:column;gap:2px;overscroll-behavior:contain}
.chempty{text-align:center;color:var(--mute);margin:auto;padding:20px;font-size:.9rem}
.chm{display:flex;gap:6px;align-items:flex-end;margin-top:6px;max-width:100%}.chm.grp{margin-top:0;padding-left:38px}.chm.me{flex-direction:row-reverse;padding-left:0}
.chav{flex:none;width:32px;height:32px;border-radius:50%;overflow:hidden;background:linear-gradient(#bfe6ff,#e8f6ff);display:grid;place-items:center;cursor:pointer;border:1px solid var(--line)}.chav img{width:150%;margin-top:30%;image-rendering:pixelated}
.chbub{max-width:78%;background:var(--bg);border:1px solid var(--line);border-radius:16px 16px 16px 4px;padding:6px 10px;min-width:0}.chm.me .chbub{background:#13a37f;color:#fff;border-color:#13a37f;border-radius:16px 16px 4px 16px}
.chbub p{margin:0;word-wrap:break-word;overflow-wrap:anywhere;font-size:.92rem;line-height:1.35}.chn{font-size:.78rem;margin-bottom:1px}.chn .plink{cursor:pointer}
.cht{display:flex;align-items:center;justify-content:flex-end;gap:4px;font-size:.66rem;opacity:.65;margin-top:2px}.cht button{padding:0 2px;background:none;border:none;font-size:.72rem;opacity:0;cursor:pointer;color:inherit}.chm:hover .cht button,.chm:focus-within .cht button{opacity:1}@media (hover:none){.cht button{opacity:.6}}
.chpkm{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);color:#1c1f3a;border-radius:12px;padding:4px 10px 4px 4px;margin:2px 0}.chpkm>div{display:flex;flex-direction:column}.chpkm b{font-size:.88rem}.chpkm small{font-size:.72rem;color:#555}.chpkm.shiny{background:linear-gradient(135deg,#fff7d6,#ffe1f3)}
.chf{display:flex;gap:6px;padding:8px 10px 10px;border-top:1px solid var(--line)}.chf[hidden]{display:none}.chf input{flex:1;min-width:0;font:inherit;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--ink)}.chf .red{padding:8px 14px}
.chib{width:38px;flex:none;padding:0;display:grid;place-items:center;background:var(--bg);color:var(--ink);border:1px solid var(--line);font-size:1.1rem}
.chemo,.chpk{border-top:1px solid var(--line);padding:8px 10px;max-height:170px;overflow:auto;background:var(--bg)}.chemo[hidden],.chpk[hidden]{display:none}
.chemo{display:grid;grid-template-columns:repeat(10,1fr);gap:2px}.chemo button{padding:4px 0;background:none;border:none;font-size:1.25rem;border-radius:8px}.chemo button:hover{background:var(--line)}
.chpk input{width:100%;box-sizing:border-box;font:inherit;padding:7px 10px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink);margin-bottom:6px}
.chpkg{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:4px}.chpkg button{display:flex;flex-direction:column;align-items:center;padding:4px 2px;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:10px;min-width:0}.chpkg small{font-size:.62rem;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.chdml{display:flex;flex-direction:column;gap:6px}.chdm{position:relative;display:flex;align-items:center;gap:10px;padding:8px 10px;text-align:left;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:14px}.chdmt{display:flex;flex-direction:column;min-width:0;flex:1}.chdmt small{color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chdm i{position:static}
@media (max-width:560px){main>header h1{font-size:1.15rem;padding-right:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;box-sizing:border-box}}
@media (max-width:620px){#chw{top:0;left:0;right:0;bottom:0;width:auto;border-radius:0;z-index:96}}
.chcards{display:flex;flex-direction:column;gap:8px;margin-bottom:6px}
.chcard{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;background:var(--bg);border:1px solid var(--line)}.chcard>div{flex:1;display:flex;flex-direction:column;min-width:0}
.chci{font-size:1.8rem;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:var(--panel);border:1px solid var(--line);flex:none}
.chcn{display:inline-grid;place-items:center;min-width:18px;height:18px;border-radius:9px;background:#e63950;color:#fff;font-style:normal;font-size:.68rem;font-weight:900;padding:0 4px;vertical-align:middle}
.chcl{color:var(--ink);opacity:.8;font-size:.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
/* minijuegos */
#mgBan{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 12px;padding:12px 14px;border:none;border-radius:18px;text-align:left;color:#fff;background:linear-gradient(120deg,#e0447a,#7a4ae0 55%,#2f6fd8);background-size:200% 100%;animation:mgban 4s ease-in-out infinite;box-shadow:0 8px 20px rgba(122,74,224,.35);cursor:pointer}
@keyframes mgban{50%{background-position:100% 0}}#mgBan:hover{transform:translateY(-2px)}
.mgbi{font-size:2rem;animation:mgwig 1.6s ease-in-out infinite}@keyframes mgwig{0%,60%,100%{transform:none}70%{transform:rotate(-14deg) scale(1.1)}85%{transform:rotate(12deg) scale(1.1)}}
.mgbt{flex:1;display:flex;flex-direction:column;min-width:0}.mgbt b{font-size:1.1rem}.mgbt small{opacity:.92}.mgbg{background:#fff;color:#7a4ae0;font-weight:900;border-radius:99px;padding:6px 14px;font-size:.85rem;white-space:nowrap}
.mggrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}
.mgcard{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:16px;border-radius:20px;text-align:left;color:#fff;border:none;background:linear-gradient(150deg,color-mix(in srgb,var(--mc) 85%,#fff),var(--mc) 60%,color-mix(in srgb,var(--mc) 70%,#000));box-shadow:0 8px 18px color-mix(in srgb,var(--mc) 40%,transparent);overflow:hidden;transition:transform .15s;cursor:pointer;min-height:190px}
.mgcard:hover{transform:translateY(-3px) rotate(-.5deg)}.mgcard b{font-size:1.1rem}.mgcard small{opacity:.92;line-height:1.3;flex:1}
.mgcic{font-size:2.4rem;filter:drop-shadow(0 4px 4px rgba(0,0,0,.25))}
.mgcf{display:flex;gap:6px;flex-wrap:wrap}.mgcf span{background:rgba(0,0,0,.22);border-radius:99px;padding:2px 9px;font-size:.78rem;font-weight:800}.mgcf span.on{background:#ffd35c;color:#3a2a00}
.mgplay{position:absolute;right:12px;top:14px;background:#fff;color:var(--mc);font-weight:900;border-radius:99px;padding:4px 12px;font-size:.8rem}
#mgM{position:fixed;inset:0;z-index:97;background:rgba(10,12,32,.72);display:grid;place-items:center;padding:12px}#mgM[hidden]{display:none}
.mgw{width:min(620px,100%);max-height:calc(100vh - 24px);display:flex;flex-direction:column;background:var(--panel);color:var(--ink);border-radius:24px;overflow:hidden;border:3px solid var(--mc);box-shadow:0 24px 60px rgba(0,0,0,.45)}
.mgh{display:flex;align-items:center;gap:10px;padding:10px 12px 10px 16px;background:var(--mc);color:#fff}.mgh b{flex:1;font-size:1.05rem}.mgic{font-size:1.4rem}
.mgsc{background:rgba(0,0,0,.25);border-radius:99px;padding:4px 12px;font-weight:800}.mgx{width:36px;height:36px;padding:0;border-radius:10px;background:rgba(255,255,255,.2);color:#fff;border:none}
.mgb{position:relative;flex:1;overflow:auto;padding:14px;min-height:360px}
.mgintro{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:10px 6px}.mgintro h3{margin:0;font-size:1.5rem}.mgintro p{margin:0;max-width:440px}
.mgbig{font-size:4rem;animation:mgwig 2s ease-in-out infinite}.mginf{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.mginf span{background:var(--bg);border:1px solid var(--line);border-radius:99px;padding:4px 12px;font-size:.88rem}
button.big{font-size:1.15rem;padding:12px 30px;border-radius:16px}.mgbtns{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.mgfinal{font-size:3rem;font-weight:900;color:var(--mc);line-height:1;display:flex;flex-direction:column;align-items:center}.mgfinal small{font-size:.9rem;color:var(--mute)}
.mgget{display:flex;align-items:center;gap:8px;background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:4px 12px 4px 4px}.mgnew{color:#e63950}
.mgpop{position:absolute;z-index:5;font-weight:900;font-size:1.3rem;pointer-events:none;text-shadow:0 2px 0 rgba(0,0,0,.35),0 0 8px rgba(0,0,0,.25);white-space:nowrap}
.mgconf{position:absolute;top:0;z-index:6;font-size:1.4rem;pointer-events:none}
.whohd{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;font-size:.92rem;min-height:24px}.whost{color:#e0782a;font-weight:800}
.mgtime{height:10px;border-radius:99px;background:var(--line);overflow:hidden;margin:8px 0}.mgtime i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#e63950,#ffd35c,#3ecf8e)}
.whobg{position:relative;height:250px;border-radius:20px;overflow:hidden;background:repeating-conic-gradient(from 0deg at 50% 50%,#3d7ff0 0 10deg,#5f97f5 10deg 20deg);display:grid;place-items:center}
.whosil{width:200px;height:200px;display:grid;place-items:center}.whosil img{max-width:200px;max-height:200px;object-fit:contain;filter:brightness(0) drop-shadow(0 0 2px rgba(255,255,255,.6));transition:filter .5s}.whosil.rev img{filter:none}
.whoq{position:absolute;left:12px;bottom:10px;background:#ffd35c;color:#1c1f3a;border:3px solid #1c1f3a;border-radius:12px;padding:4px 12px;font-weight:900;font-size:1rem;transform:rotate(-3deg)}
.whoopt{display:grid;grid-template-columns:1fr 1fr;gap:8px}.whoopt button{padding:12px 6px;font-size:1rem;background:var(--bg);color:var(--ink);border:2px solid var(--line)}.whoopt button.ok{background:#3ecf8e;color:#fff;border-color:#3ecf8e}.whoopt button.bad{background:#e63950;color:#fff;border-color:#e63950}
.memg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;perspective:800px}
.memc{position:relative;aspect-ratio:1;padding:0;border:none;background:none;-webkit-transform-style:preserve-3d;transform-style:preserve-3d;transition:transform .4s cubic-bezier(.3,.7,.4,1.2);will-change:transform;-webkit-tap-highlight-color:transparent}.memc.up{transform:rotateY(180deg)}
/* el brillo general de los botones al pasar el ratón (filter) aplana el 3D y la carta se ve del revés: aquí se resalta solo la cara visible */
.memc:hover:not(:disabled),.memc:active{filter:none!important}.memc:not(.up):hover .memb{box-shadow:0 0 0 3px rgba(255,255,255,.55),0 6px 12px rgba(0,0,0,.25)}
.memf{position:absolute;inset:0;border-radius:14px;-webkit-backface-visibility:hidden;backface-visibility:hidden;display:grid;place-items:center;overflow:hidden}
.memb{transform:rotateY(0deg)}
.memb{background:radial-gradient(circle at 50% 50%,#fff 0 12%,#1c1f3a 12% 17%,transparent 17%),linear-gradient(#e3263a 0 46%,#1c1f3a 46% 54%,#f2f0fa 54%);border:3px solid #1c1f3a;box-shadow:0 3px 6px rgba(0,0,0,.2)}
.memp{transform:rotateY(180deg);background:var(--bg);border:3px solid var(--line)}.memp img{max-width:90%;max-height:90%}
.memc.done .memp{border-color:#3ecf8e;box-shadow:0 0 0 3px rgba(62,207,142,.35)}
.digg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px;border-radius:20px;background:linear-gradient(#9bd36a,#6aa63e);touch-action:manipulation;user-select:none}
.digh{position:relative;aspect-ratio:1.1;cursor:pointer}
.digback{position:absolute;left:8%;right:8%;bottom:6%;height:26%;border-radius:50%;background:radial-gradient(#2a180c 0 55%,#4a2e16 70%,#6b4423 100%)}
.digclip{position:absolute;left:0;right:0;top:0;bottom:19%;overflow:hidden}
.digm{position:absolute;left:0;right:0;bottom:0;height:100%;display:grid;place-items:end center;transform:translateY(105%);transition:transform .14s ease-out}.digm.up{transform:translateY(8%)}.digm.hit{filter:brightness(1.7) saturate(.4);transform:translateY(35%) scale(.92)}
.digm img{width:92%!important;height:auto!important;max-height:none;margin-bottom:-14%;pointer-events:none}
.diglip{position:absolute;left:8%;right:8%;bottom:6%;height:13%;border-radius:0 0 50% 50%/0 0 100% 100%;background:linear-gradient(#7a4f29,#5a3a1c);box-shadow:0 4px 0 rgba(0,0,0,.15)}
.fiw{position:relative;height:280px;border-radius:20px;overflow:hidden;cursor:pointer;user-select:none;touch-action:manipulation}
.fisky{position:absolute;inset:0 0 55% 0;background:linear-gradient(#ffd9a8,#ffb98a 60%,#ff9d8a)}.fiwater{position:absolute;inset:45% 0 0 0;background:linear-gradient(#3a9ad9,#1c5f9e)}
.fiwave{position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 30px,transparent 30px 70px);animation:fiw 3s linear infinite;opacity:.6;height:8px}@keyframes fiw{to{background-position:70px 0}}
.filine{position:absolute;left:78%;top:0;width:2px;height:58%;background:rgba(255,255,255,.75);transform-origin:top;transform:rotate(14deg)}
.fibob{position:absolute;left:62%;top:-30px;width:22px;height:22px;border-radius:50%;background:linear-gradient(#e63950 0 50%,#fff 50%);border:2px solid #222;transition:top .5s cubic-bezier(.3,1.4,.5,1)}
.fibob.in,.fibob.nib,.fibob.bite{top:52%}.fibob.nib{animation:fnib .35s}.fibob.bite{animation:fbite .25s infinite}@keyframes fnib{50%{transform:translateY(5px)}}@keyframes fbite{50%{transform:translateY(12px) scale(.9)}}
.fiex{position:absolute;left:calc(62% + 18px);top:28%;font-size:2.4rem;font-weight:900;color:#ffd35c;text-shadow:0 3px 0 #b33,0 0 10px #fff;animation:fex .3s infinite alternate}@keyframes fex{to{transform:scale(1.25)}}
.fimsg{position:absolute;left:12px;right:12px;bottom:10px;text-align:center;color:#fff;font-weight:800;text-shadow:0 2px 4px rgba(0,0,0,.5)}
.ficatch{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);opacity:0;pointer-events:none}.ficatch.jump{animation:fjump 1.4s ease-out}@keyframes fjump{0%{opacity:0;transform:translate(-50%,20%) scale(.4)}25%{opacity:1;transform:translate(-50%,-80%) scale(1.2)}70%{opacity:1;transform:translate(-50%,-70%) scale(1)}100%{opacity:0;transform:translate(-50%,-70%) scale(1)}}
.fibtns{display:flex;justify-content:center;margin:10px 0}.fibag{display:flex;flex-wrap:wrap;gap:4px;justify-content:center}.fibag span{background:var(--bg);border:1px solid var(--line);border-radius:10px}
.thw{position:relative;height:330px;border-radius:20px;overflow:hidden;background:linear-gradient(#bfe6ff,#e6f6ff 55%,#a8dc7a 56%,#79bf4c);cursor:pointer;user-select:none;touch-action:manipulation}
.thgr{position:absolute;left:50%;top:44%;width:180px;height:40px;margin-left:-90px;border-radius:50%;background:rgba(0,0,0,.12)}
.thmon{position:absolute;left:50%;top:22%;width:0;height:0}.thspr{position:absolute;left:0;top:0;transform:translate(-50%,-30%);transition:opacity .2s}
.thring{position:absolute;left:0;top:28px;width:130px;height:130px;border-radius:50%;border:5px solid #3ecf8e;box-sizing:border-box;transform:translate(-50%,-50%)}
.thball{position:absolute;left:50%;top:100%;width:34px;height:34px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle at 50% 50%,#fff 0 13%,#222 13% 20%,transparent 20%),linear-gradient(#e3263a 0 46%,#222 46% 54%,#f2f0e4 54%);border:2px solid #222;box-sizing:border-box;opacity:0}
.thball.in,.thball.ok,.thball.miss{opacity:1}.thball.in{animation:thsh .5s ease-in-out}.thball.ok{box-shadow:0 0 18px #ffd35c}.thball.miss{opacity:0;transition:opacity .6s}
@keyframes thsh{25%{transform:translate(-50%,-50%) rotate(-20deg)}75%{transform:translate(-50%,-50%) rotate(18deg)}}
.thmsg{position:absolute;left:0;right:0;bottom:12px;text-align:center;font-weight:900;color:#1c1f3a;text-shadow:0 1px 0 #fff}
/* carrera */
.ruw{position:relative;height:280px;border-radius:20px;overflow:hidden;cursor:pointer;user-select:none;touch-action:manipulation}
.rusky{position:absolute;inset:0;background:linear-gradient(#ffcf8a,#ffe7c2 60%,#fff3dc)}.rumt{position:absolute;left:0;right:0;bottom:46px;height:90px;background:radial-gradient(ellipse 120px 80px at 15% 100%,#d9a46a 98%,transparent),radial-gradient(ellipse 160px 90px at 55% 100%,#caa070 98%,transparent),radial-gradient(ellipse 130px 70px at 90% 100%,#d9a46a 98%,transparent);opacity:.8}
.rugr{position:absolute;left:0;right:0;bottom:0;height:46px;background:repeating-linear-gradient(90deg,#8a5a2b 0 30px,#9a6a38 30px 60px);border-top:4px solid #5aa832}
.rupk{position:absolute;left:58px;bottom:40px;width:80px;height:80px;display:grid;place-items:end center}.rupk img{width:96px!important;height:96px!important;max-width:none}.rupk.rucrash{filter:grayscale(.6);animation:ruc .5s}@keyframes ruc{50%{transform:rotate(-20deg) scaleX(-1)}}
.ruob{position:absolute;left:0;top:0;z-index:2}.rufence{background:repeating-linear-gradient(90deg,#fff 0 6px,#d33 6px 10px);border:2px solid #7a2a2a;border-radius:4px 4px 0 0}.rurock{background:radial-gradient(circle at 35% 30%,#bbb,#777 60%,#555);border-radius:50% 50% 10% 10%}
.rucoin{position:absolute;left:0;top:0;font-size:22px;z-index:2}.rucoin span{display:inline-block;animation:mgwig 1s infinite}.rumsg{position:absolute;left:0;right:0;top:40%;text-align:center;font-weight:900;font-size:1.2rem;color:#5a2a00;text-shadow:0 1px 0 #fff}
/* excavación */
.exstab{flex:1;max-width:220px;height:12px;border-radius:99px;background:var(--line);overflow:hidden;margin-left:10px}.exstab i{display:block;height:100%;transition:width .2s,background .3s}
.exwall{display:grid;grid-template-columns:repeat(var(--cw),1fr);gap:0;border-radius:14px;overflow:hidden;background:#3a2414;border:4px solid #3a2414;aspect-ratio:var(--cw)/var(--ch);position:relative;max-width:min(100%,64vh);margin:0 auto}
.excell{border:none;padding:0;margin:0;border-radius:0;aspect-ratio:1;z-index:2;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18);cursor:pointer}
.excell.h1{background:#c9a477}.excell.h2{background:#a8794a}.excell.h3{background:#86592f}.excell.h4{background:#6b4423}.excell.h5{background:#55351a}.excell.gone{background:transparent;box-shadow:none;cursor:default;pointer-events:none}
.excell:not(.gone):hover{filter:brightness(1.15)}
.exitm{z-index:1;display:grid;place-items:center;background:#2a1a0e}.exitm.found{animation:exf .6s ease-out;background:radial-gradient(#ffe9a8,#2a1a0e 75%)}@keyframes exf{50%{filter:brightness(2)}}
.exorb{width:70%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0 12%,var(--oc) 45%,color-mix(in srgb,var(--oc) 60%,#000));box-shadow:0 0 8px var(--oc)}.exorb.ev{--oc:#3ecf8e;border-radius:30%;transform:rotate(45deg)}
.exstar{font-size:2.4rem;color:#ffd35c;text-shadow:0 0 8px #ffd35c}.exbone{width:90%;height:40%;border-radius:20px;background:#f2ead6;box-shadow:inset 0 -3px 0 #cbbf9e}.exbox,.exfos{font-size:2rem}.exfos{font-size:3rem}
.exfoss{display:grid;place-items:center;width:100%;height:100%;background:radial-gradient(circle,#d9c8a4 0 45%,#b39b72 70%,transparent 72%)}.exfoss .fosimg{width:80%;height:auto;image-rendering:pixelated}.fosemo{line-height:1}
.foslab{display:flex;flex-direction:column;gap:6px}.fosmach{display:flex;gap:16px;align-items:center;padding:14px;border-radius:18px;background:linear-gradient(135deg,#2c3a4f,#1b2433);color:#fff;border:3px solid #5f7690;box-shadow:inset 0 0 0 2px rgba(255,255,255,.06)}
.fostube{flex:none;width:120px;height:130px;border-radius:60px 60px 16px 16px;background:linear-gradient(180deg,rgba(120,220,255,.25),rgba(60,160,220,.45));border:3px solid #9fd8ff;display:grid;place-items:center;position:relative;overflow:hidden;box-shadow:inset 0 0 18px rgba(160,230,255,.5)}
.fosmach.busy .fostube{animation:fosglow 1.6s ease-in-out infinite}@keyframes fosglow{50%{box-shadow:inset 0 0 30px rgba(160,255,200,.9),0 0 18px rgba(120,255,180,.6)}}
.fosmach.ready .fostube{border-color:#ffd35c;box-shadow:0 0 20px rgba(255,211,92,.7)}
.fosin{display:flex;gap:2px}.fosin .fosimg{image-rendering:pixelated}.fosempty{color:#9fb6cc;font-weight:700}
.fosbub{position:absolute;inset:0;background:radial-gradient(circle at 30% 80%,rgba(255,255,255,.5) 0 3px,transparent 4px),radial-gradient(circle at 70% 60%,rgba(255,255,255,.4) 0 2px,transparent 3px),radial-gradient(circle at 50% 90%,rgba(255,255,255,.5) 0 4px,transparent 5px);animation:fosbub 2s linear infinite}@keyframes fosbub{to{transform:translateY(-60%)}}
.fosinfo{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.fosinfo .mut{color:#b9c6da!important}.fosinfo .nxbar{background:rgba(255,255,255,.15)}
.fosinv{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.fosc{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;background:var(--bg);color:var(--ink);border:2px solid var(--line);border-radius:14px;padding:10px 8px;box-shadow:none}.fosc.on{border-color:#13a37f;box-shadow:0 0 0 3px rgba(19,163,127,.25)}.fosc small{font-size:.75rem}.fosc .fosimg{image-rendering:pixelated}
.fosq{position:absolute;top:6px;right:8px;font-weight:800;font-size:.85rem;color:var(--mute)}
.fosgo{position:sticky;bottom:0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px;padding:10px 12px;border-radius:14px;background:var(--panel);border:2px solid #13a37f}.fosgo span{flex:1;display:flex;align-items:center;gap:6px;flex-wrap:wrap}.fosgo .fosimg{image-rendering:pixelated}
.fosflash{display:flex;gap:6px;justify-content:center}.fosflash .fosimg{image-rendering:pixelated}
@media (max-width:600px){.fosmach{flex-direction:column;text-align:center}}
.exwall.collapse .excell{animation:exc .9s ease-in forwards}@keyframes exc{to{transform:translateY(40px);opacity:0}}
.extools{display:flex;gap:8px;margin-top:10px}.extools button{flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;padding:8px;background:var(--bg);color:var(--ink);border:2px solid var(--line)}.extools button small{font-size:.68rem;color:var(--mute);font-weight:600}.extools button.on{border-color:#8a5a2b;background:color-mix(in srgb,#8a5a2b 14%,var(--bg))}.extools .alt{flex:.6}
/* pesos */
.wgvs{display:flex;align-items:stretch;gap:8px}.wgor{align-self:center;font-weight:900;font-size:1.3rem;color:var(--mute)}
.wgc{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 8px;background:var(--bg);color:var(--ink);border:3px solid var(--line);border-radius:18px;min-width:0}.wgc:hover:not(:disabled){transform:translateY(-3px)}
.wgs{height:160px;display:grid;place-items:center}.wgs img{max-width:160px;max-height:160px;object-fit:contain}.wgc b{font-size:1rem}
.wgv{font-size:1.4rem;font-weight:900;color:var(--mute)}.wgc.ok{border-color:#3ecf8e;background:color-mix(in srgb,#3ecf8e 14%,var(--bg))}.wgc.ok .wgv{color:#13a37f}.wgc.bad{opacity:.75}
/* torneo y duelos */
.tourb{margin-bottom:12px;border-radius:20px;overflow:hidden;border:2px solid var(--mc);background:var(--bg)}
.tourh{display:flex;align-items:center;gap:12px;padding:12px 14px;background:linear-gradient(120deg,#ffcf3a,#ffb02e 40%,var(--mc));color:#2a1a00}.tourh>div{flex:1;display:flex;flex-direction:column;min-width:0}.tourh b{font-size:1.15rem}.tourh small{font-weight:700;font-size:.74rem;opacity:.9}
.tourc{font-size:2.4rem;animation:mgwig 1.8s ease-in-out infinite}.tourgo{background:#fff;color:#2a1a00;border:none;font-weight:900;padding:8px 16px;border-radius:99px;white-space:nowrap}
.tourl{padding:8px 12px;display:flex;flex-direction:column;gap:4px}.tourr{display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:10px}.tourr.me{background:color-mix(in srgb,#ffd35c 25%,transparent)}.tourp{width:30px;text-align:center;font-weight:900}.tourr .chav{width:26px;height:26px}.tours{margin-left:auto;font-weight:900}
.tourmy{font-size:.85rem;color:var(--mute);border-top:1px dashed var(--line);padding-top:6px;margin-top:2px}.tourm{margin:0;font-weight:700}
.duelb{margin-top:12px;padding:12px 14px;border-radius:20px;background:linear-gradient(135deg,color-mix(in srgb,#c42a5e 12%,var(--bg)),var(--bg));border:2px solid #c42a5e;display:flex;flex-direction:column;gap:8px}
.duelh{display:flex;align-items:center;gap:10px}.duelh>span{font-size:2rem}.duelh div{display:flex;flex-direction:column}.duelh small{color:var(--mute)}
.dufl{display:flex;flex-direction:column;gap:4px;max-height:220px;overflow:auto}.duinv .pvrow{background:#fff3d6;border-radius:10px;padding:6px 8px;color:#3a2a00}
.whoopt button.sel{border-color:#7a4ae0;background:color-mix(in srgb,#7a4ae0 15%,var(--bg))}
.tpods{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:8px;align-items:end;padding:14px 12px 0;background:radial-gradient(ellipse at 50% 0%,color-mix(in srgb,#ffd35c 35%,transparent),transparent 70%)}
.tpod{display:flex;flex-direction:column;align-items:center;text-align:center;gap:2px;min-width:0}.tpod b{font-size:.92rem}.tpod small{font-size:.68rem;color:var(--mute);line-height:1.25;font-weight:700}
.tpm{position:relative;height:100px;width:100%;display:flex;align-items:flex-end;justify-content:center;filter:drop-shadow(0 8px 8px rgba(0,0,0,.25))}.tpm img{height:100%!important;width:auto!important;max-width:100%!important;margin:0!important;object-fit:contain}.p1 .tpm{height:130px;animation:tpf 2.6s ease-in-out infinite}.tpm img{max-height:100%;object-fit:contain}
.p1 .tpm:before{content:"";position:absolute;inset:-10px -20px 0;background:radial-gradient(circle,rgba(255,215,90,.75),transparent 65%);z-index:-1;animation:tpg 2s ease-in-out infinite}
@keyframes tpf{50%{transform:translateY(-6px)}}@keyframes tpg{50%{opacity:.5;transform:scale(1.1)}}
.tpsh{position:absolute;top:4px;right:18%;font-size:1.2rem;animation:mgwig 1.4s infinite}.tpic{font-size:1.6rem;line-height:1}
.tpbar{width:100%;border-radius:10px 10px 0 0;margin-top:6px}.p1 .tpbar{height:46px;background:linear-gradient(#ffe27a,#e0a800)}.p2 .tpbar{height:30px;background:linear-gradient(#eef1f8,#aab3c5)}.p3 .tpbar{height:20px;background:linear-gradient(#f0c08a,#b8743a)}
.tourx{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px 0;font-size:.8rem}.tourx span{background:var(--panel);border:1px solid var(--line);border-radius:99px;padding:3px 10px}
.tourr.top{font-size:1.02rem}.tourvit{display:block;margin-top:4px;color:var(--ink);font-weight:700}
.tourwin{position:relative;width:120px;height:110px;display:grid;place-items:center}.tourwin .hofb{position:relative;z-index:1;font-size:4rem}
.tourwin.big .tourrays{position:absolute;inset:-40px;background:repeating-conic-gradient(rgba(255,211,92,.55) 0 12deg,transparent 12deg 24deg);border-radius:50%;animation:trot 8s linear infinite;-webkit-mask:radial-gradient(circle,#000 30%,transparent 70%);mask:radial-gradient(circle,#000 30%,transparent 70%)}@keyframes trot{to{transform:rotate(360deg)}}
.tourmonw{display:flex;flex-direction:column;align-items:center;gap:2px;background:radial-gradient(circle,rgba(255,215,90,.4),transparent 70%);padding:6px 20px}.tourmonw img{height:140px!important;width:auto!important;max-width:220px!important;margin:0!important;object-fit:contain}.tourtit{font-size:.9rem;background:#fff4d0;color:#5a3a00;border-radius:12px;padding:6px 12px}
.nxmw{position:relative;overflow:hidden}.chcr{font-size:.9em}
/* formas en combate */
.frmb{font-weight:900;color:#fff!important;border:none!important}.frmb.mega{background:linear-gradient(135deg,#7a4ae0,#e0447a)!important}.frmb.gmax,.frmb.dmax{background:linear-gradient(135deg,#e63950,#ff7a3c)!important}
.megafx{position:absolute;left:8%;bottom:10%;width:300px;height:300px;margin-left:-60px;border-radius:50%;z-index:8;pointer-events:none;background:radial-gradient(circle,#fff 0 10%,rgba(255,120,220,.9) 25%,rgba(122,74,224,.6) 45%,transparent 70%)}
.spr.dmax img{filter:drop-shadow(0 0 10px #ff2a55) drop-shadow(0 0 22px #ff2a55) saturate(1.2)!important;transform:scale(1.4);transform-origin:50% 100%}
/* día y noche */
#dayB{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));right:158px;z-index:60;width:42px;height:42px;border-radius:50%;padding:0;font-size:1.25rem;display:grid;place-items:center;background:var(--panel);border:1px solid var(--line);box-shadow:0 2px 8px rgba(0,0,0,.18)}
body[data-phase=night]:before,body[data-phase=dawn]:before,body[data-phase=dusk]:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0}
body[data-phase=night]:before{background:radial-gradient(1.5px 1.5px at 20% 15%,#fff,transparent),radial-gradient(1px 1px at 60% 8%,#fff,transparent),radial-gradient(1.5px 1.5px at 80% 25%,#fff,transparent),radial-gradient(1px 1px at 35% 30%,#fff,transparent),linear-gradient(rgba(20,26,80,.28),rgba(20,26,80,.18))}
body[data-phase=dawn]:before{background:linear-gradient(rgba(255,170,120,.16),transparent 60%)}body[data-phase=dusk]:before{background:linear-gradient(rgba(255,120,60,.14),rgba(120,60,140,.1))}
#bscene[data-phase=night]{filter:brightness(.62) saturate(.85) hue-rotate(-12deg)}#bscene[data-phase=dusk]{filter:sepia(.25) saturate(1.2) brightness(.92)}#bscene[data-phase=dawn]{filter:sepia(.15) brightness(1.05)}
@media (max-width:560px){#dayB{display:none}}
/* horas felices */
#hhBan{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 10px;padding:10px 14px;border-radius:16px;text-align:left;background:var(--bg);color:var(--ink);border:2px dashed #ffb02e;cursor:pointer}
#hhBan.on{border:none;color:#3a2200;background:linear-gradient(120deg,#ffe27a,#ffb02e,#ff7a3c);background-size:200% 100%;animation:mgban 3s ease-in-out infinite;box-shadow:0 6px 16px rgba(255,150,40,.4)}
.hhi{font-size:1.8rem;display:grid;place-items:center;min-width:44px}
.hhl{display:flex;flex-direction:column;gap:8px}.hhc{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:16px;background:var(--bg);border:1px solid var(--line)}.hhc>div{flex:1;display:flex;flex-direction:column}.hhc small{color:var(--mute)}
.hhc.on{border:2px solid #ffb02e;background:color-mix(in srgb,#ffd35c 20%,var(--bg))}.hhc.cd{border-color:#e0447a}.hht{text-align:right;font-weight:800;display:flex;flex-direction:column;font-size:.9rem}.hht small{font-weight:600}
/* compañero */
.budh{position:absolute;left:45%;top:10px;pointer-events:none;font-size:1.3rem;z-index:3}
#budC{display:flex;align-items:stretch;gap:14px;padding:12px;border-radius:20px;overflow:hidden;background:linear-gradient(135deg,color-mix(in srgb,#ff8ab5 16%,var(--panel)),var(--panel) 60%);border:2px solid color-mix(in srgb,#ff6fa0 45%,var(--line))}
.bcfield{position:relative;flex:0 0 46%;min-height:120px;border-radius:16px;overflow:hidden;background:linear-gradient(#bfe6ff,#e6f6ff 58%,#a8dc7a 59%,#79bf4c)}
.bcwalk{position:absolute;left:8%;bottom:6px;cursor:pointer;animation:bcwalk 16s ease-in-out infinite}
@keyframes bcwalk{0%,100%{left:6%;transform:scaleX(1)}46%{left:calc(94% - 84px);transform:scaleX(1)}50%{left:calc(94% - 84px);transform:scaleX(-1)}96%{left:6%;transform:scaleX(-1)}}
.bcspr{position:relative;z-index:1;animation:bchop .55s ease-in-out infinite alternate;transform-origin:50% 100%}.bcspr img{width:84px!important;height:84px!important;display:block}
@keyframes bchop{to{transform:translateY(-4px)}}.bcshadow{position:absolute;left:18%;right:18%;bottom:2px;height:8px;border-radius:50%;background:rgba(0,0,0,.18)}
.bcinfo{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;justify-content:center}.bchead{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px}.bchead small{width:100%;font-weight:900;letter-spacing:.5px;color:#c42a5e;font-size:.7rem}.bchead b{font-size:1.25rem}.bclv{font-size:.8rem;font-weight:800;color:#c42a5e;background:#ffe3ee;border-radius:99px;padding:1px 8px}
.bcbtns{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}.bcbtns button{white-space:nowrap}.bcbtns button{padding:7px 11px;font-size:.85rem}.bcgift{animation:bcg 1.1s ease-in-out infinite}@keyframes bcg{50%{transform:scale(1.06);box-shadow:0 0 0 6px rgba(230,57,80,.2)}}
.bcempty{display:flex;align-items:center;gap:12px;width:100%;flex-wrap:wrap}.bcempty>div{flex:1;min-width:180px;display:flex;flex-direction:column}.bcempty small{color:var(--mute)}.bcegg{font-size:2.2rem}
@media (max-width:560px){#budC{flex-direction:column}.bcfield{flex-basis:auto}}
body.calm .bcwalk,body.calm .bcspr,body.calm .bcgift{animation:none!important}
.budcard{display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:14px;border-radius:20px;background:linear-gradient(135deg,#ffe8ef,var(--bg));border:1px solid var(--line)}.budbig{height:160px;display:grid;place-items:center;flex:none}.budbig img{max-height:160px;object-fit:contain}
.budinfo{flex:1;min-width:220px;display:flex;flex-direction:column;gap:4px}.budinfo h3{margin:0}.budlv{color:#c42a5e}.budbtn{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}
.budperk{margin-top:10px;display:flex;flex-direction:column;gap:4px;font-size:.88rem}.budperk div{color:var(--mute)}.budperk div.on{color:var(--ink)}
.budev{margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 14px;border-radius:14px;background:#fff3d6;color:#3a2a00}.budev b{flex:1}
/* álbum */
.albtop{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}.albtop span{background:var(--bg);border:1px solid var(--line);border-radius:99px;padding:4px 12px;font-size:.85rem}.albtop .albrdy{background:#ffd35c;color:#3a2a00;border-color:#e0b020;font-weight:800}
.albnav{display:flex;gap:6px;margin-bottom:10px}.albnav select{flex:1;font:inherit;padding:8px;border-radius:12px;border:1px solid var(--line);background:var(--panel);color:var(--ink)}
.albpage{display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:8px;padding:12px;border-radius:18px;background:repeating-linear-gradient(0deg,var(--bg) 0 28px,color-mix(in srgb,var(--line) 50%,var(--bg)) 28px 29px);border:2px solid var(--line)}
.albs{position:relative;aspect-ratio:3/4;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;background:rgba(0,0,0,.05);border:2px dashed var(--line);overflow:hidden;text-align:center}
.albs small{font-size:.62rem;font-weight:700;max-width:96%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.albq{font-weight:900;color:var(--mute);font-size:.8rem}
.albs.got{background:#fff;border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.18);transform:rotate(-1.5deg)}.albs.got:nth-child(even){transform:rotate(1.5deg)}
.albs.shine{background:linear-gradient(135deg,#fff,#fff6c8 40%,#fff);border-color:#ffd35c}
.albs.holo{background:linear-gradient(115deg,#ffd1f0,#c9f1ff,#d8ffd1,#fff2b8,#ffd1f0);background-size:300% 300%;animation:holo 4s linear infinite;border-color:#c9b6ff}@keyframes holo{to{background-position:300% 0}}
.albs i{position:absolute;top:2px;right:4px;font-style:normal;font-size:.8rem}
.albrw{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-top:10px}.albr{display:flex;flex-direction:column;gap:3px;padding:10px 12px;border-radius:14px;background:var(--bg);border:1px solid var(--line)}.albr.done{border-color:#3ecf8e}.albr.got{opacity:.7}.albr small{color:var(--mute)}
body.calm .albs.holo{animation:none}
/* pase */
#passMini{display:flex;align-items:center;gap:10px;width:100%;margin:0 0 12px;padding:9px 14px;border-radius:14px;border:1px solid var(--line);background:var(--bg);color:var(--ink);cursor:pointer;text-align:left}#passMini b{white-space:nowrap}
.pmbar{flex:1;height:10px;border-radius:99px;background:var(--line);overflow:hidden}.pmbar i{display:block;height:100%;background:linear-gradient(90deg,#7a4ae0,#e0447a)}#passMini em{font-style:normal;background:#e63950;color:#fff;border-radius:99px;padding:1px 8px;font-weight:900;font-size:.8rem}
.passtop{display:flex;gap:14px;align-items:center;padding:14px;border-radius:20px;background:linear-gradient(135deg,#2b2f5a,#7a4ae0 60%,#e0447a);color:#fff;flex-wrap:wrap}.passtop>div:last-child{flex:1;display:flex;flex-direction:column;gap:4px;min-width:220px}.passtop b{font-size:1.3rem}.passtop small{opacity:.9}
.passmon{height:120px;display:grid;place-items:center;filter:drop-shadow(0 0 14px rgba(255,215,90,.8))}.passmon img{max-height:120px;object-fit:contain}.nxbar.pbig{height:14px;width:100%;background:rgba(255,255,255,.25)}
.passtop .red{align-self:flex-start;margin-top:4px}
.passtrk{display:flex;gap:8px;overflow-x:auto;padding:12px 2px;margin-top:6px;scroll-snap-type:x proximity}
.passn{position:relative;flex:none;width:118px;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 6px;border-radius:16px;background:var(--bg);border:2px solid var(--line);text-align:center;scroll-snap-align:center}
.passn small{font-size:.66rem;line-height:1.2;color:var(--mute);min-height:2.4em}.passn.big{background:linear-gradient(#fff6d8,var(--bg));border-color:#ffd35c}.passn.ok{border-color:#3ecf8e;box-shadow:0 0 0 3px rgba(62,207,142,.25)}.passn.got{opacity:.6}
.passl{position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#2b2f5a;color:#fff;border-radius:99px;padding:0 9px;font-weight:900;font-size:.75rem}.passi{height:58px;display:grid;place-items:center;font-size:1.8rem}.passi img{max-height:58px}
.passok,.passlk{font-size:1rem}.passhow{margin-top:8px;display:flex;flex-direction:column;gap:2px;font-size:.85rem}.passhow small{color:var(--mute)}
/* invitar */
.refbox{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px;border-radius:20px;background:linear-gradient(135deg,#e8f0ff,var(--bg));border:1px solid var(--line);text-align:center}.refcode{font-size:2.4rem;font-weight:900;letter-spacing:6px;color:#2f6fd8;font-family:monospace}
.refms,.refuse{margin-top:10px;display:flex;flex-direction:column;gap:4px;padding:12px;border-radius:16px;background:var(--bg);border:1px solid var(--line)}.refms div{display:flex;justify-content:space-between;gap:8px;font-size:.88rem}
.refr{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:12px;background:var(--bg);border:1px solid var(--line);margin-bottom:6px}.refk{font-size:1rem}
/* incursiones */
.rdcard{display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:14px;border-radius:20px;background:linear-gradient(135deg,#3a0a18,#b3123b 60%,#ff7a3c);color:#fff}.rdcard>div:last-child{flex:1;display:flex;flex-direction:column;gap:4px;min-width:220px}.rdcard h3{margin:0;font-size:1.5rem}.rdcard .mginf span{background:rgba(0,0,0,.25);border:none;color:#fff}
.rdbossv{height:180px;display:grid;place-items:center;filter:drop-shadow(0 0 18px rgba(255,60,90,.8))}.rdbossv img{max-height:180px;object-fit:contain}
.chsys{display:flex;flex-direction:column;align-items:center;gap:1px;margin:8px auto;max-width:90%;text-align:center}.chsys span{background:color-mix(in srgb,#13a37f 14%,var(--panel));color:var(--ink);border:1px solid color-mix(in srgb,#13a37f 40%,var(--line));border-radius:999px;padding:5px 14px;font-weight:700;font-size:.85rem}.chsys small{color:var(--mute);font-size:.7rem}
.rdrow{gap:8px}.rdw{width:min(680px,100%)}
body:has(#mgM:not([hidden]) .rdw) #chw{z-index:99}
.mgx.rdchb{margin-right:-4px}.rdinv{display:block;margin:4px auto 10px;background:#3f86f0}
.rdlob{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}.rdlob h3{margin:0}.rdpl{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.rdp{display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:14px;background:var(--bg);border:1px solid var(--line)}
.rdf{display:flex;flex-direction:column;gap:8px}.rdtop{position:relative;border-radius:20px;overflow:hidden;background:radial-gradient(ellipse at 50% 80%,#ff3a5e,#5a0a20 60%,#1a0410);padding:10px 12px 0;min-height:250px}
.rdhpw{position:relative;z-index:2;color:#fff;display:flex;flex-direction:column;gap:3px}.rdhp{height:14px;border-radius:99px;background:rgba(0,0,0,.4);overflow:hidden;border:2px solid rgba(255,255,255,.6)}.rdhp i{display:block;height:100%;transition:width .3s}.rdhp.sm{height:10px;border-color:var(--line);background:var(--line);width:160px}
.rdbig{height:200px;display:grid;place-items:end center;filter:drop-shadow(0 0 20px rgba(255,60,90,.9))}.rdbig img{max-height:200px;object-fit:contain;transform:scale(1.15);transform-origin:50% 100%}
.rdrk{display:flex;flex-wrap:wrap;gap:6px}.rdrk>span{display:flex;align-items:center;gap:5px;background:var(--bg);border:1px solid var(--line);border-radius:99px;padding:2px 10px 2px 2px;font-size:.8rem}.rdrk>span.me{border-color:#e63950}.rdrk .chav{width:22px;height:22px}
.rdme{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:14px;background:var(--bg);border:1px solid var(--line)}.rdmspr{width:80px;height:72px;display:grid;place-items:end center;overflow:hidden;flex:none}.rdmspr img{max-width:80px!important;max-height:72px!important;width:auto!important;height:auto!important;margin:0!important}
.rdmv{display:grid;grid-template-columns:1fr 1fr;gap:6px}.rdmsg{margin:0;text-align:center;font-weight:700;min-height:1.3em}
.rdcatch{height:180px;display:grid;place-items:center}.rdcatch img{max-height:170px;object-fit:contain}
/* mercadillo */
.mktabs{display:flex;gap:6px;margin-bottom:10px}.mktabs button{flex:1;background:var(--bg);color:var(--ink);border:2px solid var(--line)}.mktabs button.on{border-color:#c42a5e;background:color-mix(in srgb,#c42a5e 12%,var(--bg))}
.mkgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px}.mkc{display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 8px;border-radius:16px;background:var(--bg);border:2px solid var(--line);text-align:center}
.mkc.shiny{border-color:#ffd35c}.mki{height:66px;display:grid;place-items:center}.mkc small{font-size:.74rem}.mkc button{width:100%;margin-top:auto}
.mksell{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px;padding:12px;border-radius:16px;background:var(--bg);border:2px solid #c42a5e}.mksell label{display:flex;align-items:center;gap:6px}.mksell input{width:140px}
#welc .jbox{max-height:calc(100vh - 32px);overflow:auto;width:min(720px,calc(100vw - 24px));max-width:none;box-sizing:border-box}#welc li{margin:0!important}#welc h3{margin:14px 0 4px;font-size:1.02rem}#welc ul{margin:0;padding-left:0;list-style:none;display:flex;flex-direction:column;gap:6px}#welc li{line-height:1.4}
.wlead{font-size:1.02rem;line-height:1.45}.wloop{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0 4px}.wloop span{background:color-mix(in srgb,#13a37f 14%,var(--bg));border:1px solid color-mix(in srgb,#13a37f 40%,var(--line));border-radius:99px;padding:4px 10px;font-weight:800;font-size:.85rem}.wloop i{font-style:normal;color:var(--mute);font-weight:900}
#welc ul.wgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:6px}#welc .wgrid li{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:7px 10px;font-size:.9rem}
.frmb.sup{background:linear-gradient(135deg,#2bd1ff,#7a4ae0 55%,#e0447a)!important;box-shadow:0 0 14px rgba(122,74,224,.6)}.frmb.sup small{opacity:.9}
.supfx{position:absolute;left:8%;bottom:6%;width:320px;height:320px;margin-left:-70px;z-index:8;pointer-events:none;border-radius:50%;background:conic-gradient(from 0deg,#8fe9ff,#7a4ae0,#e0447a,#ffd35c,#8fe9ff);-webkit-mask:radial-gradient(circle,transparent 18%,#000 22%,#000 40%,transparent 62%);mask:radial-gradient(circle,transparent 18%,#000 22%,#000 40%,transparent 62%)}
.supnote{background:linear-gradient(135deg,#e6f9ff,#efe6ff);color:#2b1d5a;border:1px solid #b9a4ff;border-radius:12px;padding:8px 12px;font-size:.88rem;text-align:left}
.wgq{display:flex;align-items:center;justify-content:center;gap:10px;margin:2px 0 8px;padding:12px 14px;border-radius:16px;font-size:1.45rem;font-weight:800;text-align:center;color:#fff;background:linear-gradient(135deg,#13a37f,#0e7f63);box-shadow:0 6px 16px rgba(19,163,127,.35);animation:wgq .5s cubic-bezier(.2,.9,.3,1.4)}
.wgq.h{background:linear-gradient(135deg,#2f6fd8,#7a4ae0);box-shadow:0 6px 16px rgba(47,111,216,.35)}.wgq.w.inv{background:linear-gradient(135deg,#e0782a,#c0392b);box-shadow:0 6px 16px rgba(224,120,42,.35)}.wgq.h.inv{background:linear-gradient(135deg,#c42a5e,#7a4ae0);box-shadow:0 6px 16px rgba(196,42,94,.35)}.wgq b{font-weight:900;letter-spacing:.5px;color:#ffe27a}.wgq span{font-size:1.8rem}@keyframes wgq{from{transform:scale(.7);opacity:0}}
#team{gap:10px!important;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))!important}.slot6.tmv{position:relative;padding:0;border:none;background:none}.slot6.tmv select,.slot6.tmv .tsp{display:none!important}
.menu .swgrid{grid-column:1/-1;display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:8px}
.menu .swc{position:relative;display:flex;align-items:center;gap:10px;text-align:left;padding:6px 12px 6px 6px;border-radius:16px;background:var(--bg);color:var(--ink);border:2px solid var(--line);min-height:84px;font-size:.95rem;box-shadow:none;cursor:pointer}
.menu .swc:hover:not(:disabled){border-color:#13a37f;filter:none}.menu .swc:disabled{opacity:.55;cursor:default}
.menu .swc.L{border-color:color-mix(in srgb,var(--L) 60%,var(--line))}.menu .swc.E{border-color:color-mix(in srgb,var(--E) 50%,var(--line))}
.swspr{flex:none;width:64px;height:64px;display:grid;place-items:center;border-radius:14px;background:radial-gradient(circle at 50% 70%,rgba(19,163,127,.18),transparent 70%)}.swspr img{max-width:64px;max-height:64px}
.swt{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:1px}.swt b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.swc.tg .swt b{padding-right:74px}.menu .swt small{display:block;color:var(--mute);font-size:.76rem;font-weight:500;opacity:1}
.swhp{display:block;height:6px;margin:3px 0 1px;border-radius:4px;background:color-mix(in srgb,var(--ink) 14%,transparent);overflow:hidden}.swhp i{display:block;height:100%;border-radius:4px}
.swtag{position:absolute;top:6px;right:8px;font-style:normal;font-size:.66rem;font-weight:800;padding:1px 7px;border-radius:999px;background:#13a37f;color:#fff}.swc.ko .swtag{background:#e63950}
#arena.bigbat .menu .swc{padding:6px 12px 6px 6px;font-size:1rem}
@media (max-width:560px){.menu .swgrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.menu .swc{flex-direction:column;align-items:stretch;gap:2px;padding:6px 8px 8px;min-height:0;text-align:center}.swspr{width:100%;height:56px}.swspr img{max-height:56px}.swc.tg .swt b{padding-right:0}.swtag{top:4px;right:4px;font-size:.6rem}.menu .swt small{font-size:.72rem}}
/* ---- tarjeta de perfil: fondos y marcos animados ---- */
.pcard{position:relative;border-radius:18px;padding:12px;isolation:isolate}.pcard.cbg{padding:18px}
.pcard.cbg .profh>div:last-child,.pcard.cbg .pcmini b{background:color-mix(in srgb,var(--panel) 68%,transparent);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);border-radius:12px;padding:6px 10px}.pcard.cbg .profh .profav{box-shadow:0 4px 12px rgba(0,0,0,.3)}
.pcard.cba{background-size:64px 64px,auto!important;animation:cbdrift 9s linear infinite}
.pcard.cba[style*="radial-gradient(1.5px"]{background-size:auto!important;animation:cbtwk 3s ease-in-out infinite}
@keyframes cbdrift{to{background-position:64px 64px,0 0}}@keyframes cbtwk{50%{filter:brightness(1.25)}}
.pcard.fr::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:4px;pointer-events:none;z-index:2;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);background-size:300% 100%;animation:frmv 3s linear infinite}
@keyframes frmv{to{background-position:300% 0}}
.fr-gold::after{background-image:linear-gradient(90deg,#c99a1e,#fff3b0,#ffd35c,#c99a1e,#fff3b0,#c99a1e)}
.fr-rain::after{background-image:linear-gradient(90deg,#ff4d5e,#ffb62e,#ffe25a,#3ecf8e,#3fb0ff,#8a3fd0,#ff4d5e)}
.fr-neon::after{background-image:linear-gradient(90deg,#3fe0ff,#b6f6ff,#3fe0ff);background-size:100% 100%}.pcard.fr-neon{animation:frneon 1.6s ease-in-out infinite}@keyframes frneon{50%{box-shadow:0 0 18px 4px rgba(63,224,255,.7)}}
.fr-hw::after{background-image:linear-gradient(90deg,#8a3fd0,#ff8c2e,#2a1340,#8a3fd0,#ff8c2e);animation:frmv 2.4s linear infinite,frflk 1.8s steps(2) infinite}@keyframes frflk{50%{opacity:.75}}
.fr-xm::after{background-image:repeating-linear-gradient(45deg,#e63950 0 8px,#fff 8px 16px,#2fa36b 16px 24px,#ffd35c 24px 28px);background-size:200% 200%;animation:frmv 6s linear infinite}
.fr-vl::after{background-image:linear-gradient(90deg,#ff6fa8,#ffd0dc,#e63970,#ff6fa8)}.pcard.fr-vl{animation:frbeat 1.2s ease-in-out infinite}@keyframes frbeat{15%,45%{box-shadow:0 0 14px 3px rgba(255,111,168,.65)}30%{box-shadow:none}}
.fr-sp::after{background-image:linear-gradient(90deg,#ffb6c9,#a8d84a,#fff,#ffb6c9,#a8d84a)}
.fr-su::after{background-image:linear-gradient(90deg,#3fb0ff,#ffe08a,#5fd0e6,#3fb0ff)}
.pcmini{display:flex;flex-direction:column;align-items:center;gap:4px;position:relative;z-index:1}.pcmini img{height:96px;image-rendering:pixelated}.pcmini b{font-size:.85rem}
.tshcard{width:100%}.tshcard .pcard{padding:10px 6px;min-height:132px;box-sizing:border-box;display:grid;place-items:center}
.tshtop{display:flex;gap:14px;align-items:center;margin-bottom:6px}.tshtop>div:last-child{display:flex;flex-direction:column;gap:4px}.tshcard.big{width:170px;flex:none}
@media (prefers-reduced-motion:reduce){.pcard,.pcard::after{animation:none!important}}
body.calm .pcard,body.calm .pcard::after{animation:none!important}
.mycbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.mycwrap{max-width:640px}
.mtrow{display:none!important}
.mtico{display:inline-grid;place-items:center;flex:none;vertical-align:middle}.mtico>*{grid-area:1/1}.mtico img{image-rendering:pixelated;object-fit:contain;z-index:1}.mtico img+svg{visibility:hidden}
.mttop{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px}.mttop input#mtQ{flex:1;min-width:160px;font:inherit;padding:8px 12px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--ink)}.mtmine{display:flex;gap:6px;align-items:center;font-size:.85rem}
.mtty{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}.mtty button{padding:5px 10px;font-size:.8rem;border-radius:999px;background:var(--bg);color:var(--ink);border:1.5px solid var(--line);box-shadow:none}.mtty button.on{background:var(--tc,#13a37f);border-color:var(--tc,#13a37f);color:#fff}
.mtg{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.mtc{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border-radius:16px;background:var(--bg);border:2px solid color-mix(in srgb,var(--tc) 45%,var(--line));border-left-width:6px}.mtch{display:flex;gap:10px;align-items:center}.mtch small{display:block;color:var(--mute);font-size:.75rem}.mtd{font-size:.75rem;flex:1}.mtcp{font-size:.78rem}.mtc button{padding:7px 10px;font-size:.85rem}
.mtinfo{display:flex;flex-direction:column;gap:2px;margin:4px 0 8px}.mtl{display:flex;flex-direction:column;gap:8px;max-height:420px;overflow:auto}
.mtpk{padding:8px 10px;border-radius:14px;background:var(--bg);border:1px solid var(--line)}.mtpk.knows{opacity:.6}.mtpkh{display:flex;gap:8px;align-items:center}.mtpkh small{display:block}
.mtmv{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;align-items:center}.mtmv .mtfor{border-left:4px solid var(--tc)}
.tshtit{width:100%;min-height:72px;display:grid;place-items:center;border-radius:12px;background:linear-gradient(135deg,color-mix(in srgb,#c42a5e 12%,var(--panel)),var(--bg));padding:8px;box-sizing:border-box}.tshtit span{font-weight:800;color:#c42a5e;font-size:.95rem;text-align:center}
.tshtk{display:inline-block;padding:6px 14px;border-radius:999px;border:2px solid var(--yel);background:var(--panel);font-weight:700;margin-bottom:4px}
.tshg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.tshc{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;padding:10px;border-radius:16px;background:var(--bg);border:2px solid var(--line)}.tshc.own{border-color:#13a37f}.tshc.soon{opacity:.6;filter:grayscale(.5)}
.tshpv{width:100%;height:120px;display:grid;place-items:center;border-radius:12px;background:linear-gradient(#bfe6ff,#e8f6ff);overflow:hidden}.tshpv img{image-rendering:pixelated;animation:none!important;transform:none!important;margin:0!important;width:100%;height:100%;object-fit:cover}.tshpv.zt img{object-position:50% 4%}.tshpv.zm img{object-position:50% 62%}
.tshc button{width:100%;padding:7px 8px;font-size:.85rem}.tshon{font-weight:700;color:#13a37f;font-size:.85rem}
.evshop{display:inline-block;margin-left:6px;padding:2px 10px;border-radius:999px;background:#ffd35c;color:#3a2a00!important;font-weight:800;text-decoration:none}
.tmbtn{position:relative;width:100%;box-sizing:border-box;display:flex;align-items:center;gap:10px;padding:8px 12px 8px 8px;border-radius:16px;background:var(--bg);color:var(--ink);border:2px dashed var(--line);text-align:left;min-height:84px;cursor:pointer}
.tmbtn.on{border-style:solid;background:linear-gradient(135deg,var(--panel),var(--bg))}.tmbtn:hover{border-color:#13a37f}
.tmn{flex:none;width:24px;height:24px;border-radius:50%;background:#2b2f5a;color:#fff;display:grid;place-items:center;font-weight:900;font-size:.8rem}
.tmspr{flex:none;width:68px;height:68px;display:grid;place-items:center;border-radius:14px;background:radial-gradient(circle at 50% 70%,rgba(19,163,127,.18),transparent 70%)}.tmspr img{max-width:68px;max-height:68px}.tmempty{font-size:1.8rem;color:var(--mute);border:2px dashed var(--line);box-sizing:border-box}
.tmt{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding-right:46px}.tmt b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tmt small{color:var(--mute);font-size:.78rem}.tmko{color:#e63950;font-weight:800}
.tmch{position:absolute;top:6px;right:8px;font-size:.66rem;background:var(--panel);font-weight:800;color:#13a37f;border:1px solid #13a37f;border-radius:99px;padding:2px 8px}
#tpM{position:fixed;inset:0;z-index:96;background:rgba(14,16,40,.62);display:grid;place-items:center;padding:12px}#tpM[hidden]{display:none}
.tpw{width:min(760px,100%);max-height:calc(100vh - 24px);display:flex;flex-direction:column;background:var(--panel);color:var(--ink);border-radius:22px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.4)}
.tph{display:flex;align-items:center;justify-content:space-between;padding:12px 14px 6px 18px}.tph b{font-size:1.1rem}.tpx{width:36px;height:36px;padding:0;border-radius:10px;background:var(--bg);color:var(--ink);border:1px solid var(--line)}
.tpslots{display:flex;gap:6px;padding:0 14px 8px}.tpslots button{flex:1;height:48px;padding:0;border-radius:12px;background:var(--bg);color:var(--mute);border:2px solid var(--line);display:grid;place-items:center;font-weight:900}.tpslots button.on{border-color:#13a37f;box-shadow:0 0 0 3px rgba(19,163,127,.25)}.tpslots img{max-height:40px}
.tpf{display:flex;gap:8px;padding:0 14px 10px}.tpf input{flex:1;min-width:0;font:inherit;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--ink)}.tpf select{font:inherit;padding:8px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--ink)}
.tpl{flex:1;overflow:auto;padding:4px 14px 14px;display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:10px;align-content:start}
.tpc{position:relative;display:flex;flex-direction:column;align-items:center;gap:1px;padding:10px 6px 8px;border-radius:16px;background:var(--bg);color:var(--ink);border:2px solid var(--line);text-align:center;min-width:0}.tpc:hover:not(:disabled){transform:translateY(-2px);border-color:#13a37f}
.tpc.R{border-color:color-mix(in srgb,#4f9dff 45%,var(--line))}.tpc.E{border-color:color-mix(in srgb,#b26cff 50%,var(--line))}.tpc.M{border-color:color-mix(in srgb,#ff5fb8 50%,var(--line))}.tpc.L{border-color:color-mix(in srgb,#ffb62e 60%,var(--line))}
.tpc.cur{background:color-mix(in srgb,#13a37f 14%,var(--bg))}.tpc.busy{opacity:.45}.tpspr{height:60px;display:grid;place-items:center;font-size:1.6rem}.tpc b{font-size:.84rem;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tpc small{font-size:.7rem;color:var(--mute)}
.tpin,.tpko{position:absolute;top:4px;left:4px;font-style:normal;font-size:.6rem;font-weight:900;border-radius:6px;padding:1px 5px;background:#13a37f;color:#fff}.tpko{left:auto;right:4px;background:#e63950}.tpquit{border-style:dashed}
.fteam>div{min-width:0}.fteam .ftslots{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px}.ftslots button{position:relative;aspect-ratio:1;min-width:0;padding:0;border-radius:10px;background:var(--panel);color:var(--mute);border:2px dashed var(--line);display:grid;place-items:center;font-weight:900}.ftslots button.me{border:2px solid #13a37f;background:color-mix(in srgb,#13a37f 15%,var(--panel))}.ftslots img{max-width:90%;max-height:90%}.ftslots i{position:absolute;left:3px;top:1px;font-style:normal;font-size:.6rem;color:var(--mute)}.fteam small{display:block;margin-top:3px;font-size:.72rem}
@media (max-width:560px){.tpl{grid-template-columns:repeat(auto-fill,minmax(98px,1fr))}.tmspr{width:56px;height:56px}}
.sugbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:-2px 0 8px}.sugadd{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:12px;border:1px dashed var(--line);background:var(--bg);cursor:pointer;font-weight:700;font-size:.88rem}.sugadd:hover{border-color:#13a37f}
#sugImgs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}#sugImgs:empty{display:none}.sugth{position:relative;width:84px;height:84px;border-radius:12px;overflow:hidden;border:1px solid var(--line)}.sugth img{width:100%;height:100%;object-fit:cover}.sugth button{position:absolute;top:3px;right:3px;width:22px;height:22px;padding:0;border-radius:50%;background:rgba(0,0,0,.65);color:#fff;border:none;font-size:.7rem}
.sugst{display:inline-block;padding:2px 9px;border-radius:999px;font-size:.75rem;font-weight:700;color:#fff;background:var(--sc)}
.sugadm{margin-top:8px;padding-top:8px;border-top:1px dashed var(--line)}.sugadm textarea{width:100%;font:inherit;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink);margin:6px 0;resize:vertical}.sugadm select{margin-left:6px}
.mysh{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.mysh .mini{margin-left:auto}.sugi.mys.nw{border-color:#3f86f0;box-shadow:0 0 0 2px rgba(63,134,240,.25)}
.sugrp{margin-top:8px;padding:8px 10px;border-radius:10px;background:color-mix(in srgb,#3f86f0 10%,var(--panel));border-left:4px solid #3f86f0}.sugrp p{margin:4px 0}.sugnw{background:#e63950;color:#fff;border-radius:6px;padding:1px 6px;font-size:.7rem;margin-left:4px}
.sugbt{float:right;display:flex;gap:6px}.sugims{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}.sugims img{width:120px;height:90px;object-fit:cover;border-radius:10px;border:1px solid var(--line)}.sugbig{max-width:100%;max-height:70vh;border-radius:12px}
.mgrtabs{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:6px;margin-bottom:10px}.mgrtabs button{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px;border-radius:14px;background:var(--bg);color:var(--ink);border:2px solid var(--line);min-width:0}.mgrtabs button span{font-size:1.4rem}.mgrtabs button small{font-size:.66rem;font-weight:700;line-height:1.15;text-align:center}.mgrtabs button.on{border-color:var(--mc);background:color-mix(in srgb,var(--mc) 15%,var(--bg))}
.mgrb{border-radius:20px;overflow:hidden;border:2px solid var(--mc);background:var(--bg)}.mgrh{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--mc);color:#fff}.mgrh>span{font-size:2rem}.mgrh>div{flex:1;display:flex;flex-direction:column;min-width:0}.mgrh b{font-size:1.1rem}.mgrh small{opacity:.92;font-size:.76rem}
.mgrwon{display:flex;flex-direction:column;gap:6px;width:100%}.mgrwon div{display:grid;grid-template-columns:32px 1fr;text-align:left;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:6px 10px}.mgrwon span{grid-row:span 2;font-size:1.5rem}.mgrwon small{color:var(--mute)}
#hubTabs [data-ht]{position:relative}.tbdg{position:absolute;top:-7px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#e63950;color:#fff;font-style:normal;font-size:.72rem;font-weight:900;display:grid;place-items:center;padding:0 5px;box-sizing:border-box;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25);animation:tbdg 1.6s ease-in-out infinite}@keyframes tbdg{50%{transform:scale(1.12)}}body.calm .tbdg{animation:none}
.chimg{margin:2px 0;display:flex;flex-direction:column;gap:2px}.chimg img{display:block;max-width:220px;max-height:220px;border-radius:12px;object-fit:cover;cursor:zoom-in}.chimg small{font-size:.66rem;opacity:.75}.chimg.gone{flex-direction:row;align-items:center;gap:6px;font-size:.82rem;opacity:.7;font-style:italic}
.chinvp{display:flex!important;flex-direction:column;gap:6px;max-height:300px!important}.chinvp[hidden]{display:none!important}.chinvp button{display:block;width:100%;text-align:left;padding:8px 10px;border-radius:10px;background:var(--panel);color:var(--ink);border:1px solid var(--line);font-size:.86rem}.chinvp button:disabled{opacity:.5}.chinvp small{color:var(--mute)}
.chinv{display:flex;gap:10px;align-items:flex-start;background:#fff;color:#1c1f3a;border-radius:14px;padding:10px 12px;margin:2px 0;border:2px solid #7a4ae0;min-width:210px}.chinv-guild{border-color:#13a37f}.chinv-pvp{border-color:#e63950}.chinv-du{border-color:#2f6fd8}.chinv-raid{border-color:#b3123b}.chinvi{font-size:1.7rem;line-height:1}.chinv>div{display:flex;flex-direction:column;gap:2px;flex:1}.chinv small{color:#555;font-size:.74rem}.chinvb{display:flex;gap:6px;margin-top:4px}.chinvst{font-weight:700}
.dbgo{background:linear-gradient(135deg,#7a4ae0,#2f6fd8)!important;color:#fff!important;border:none!important}
.call{display:flex;flex-direction:column;gap:6px}.calr{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:14px;background:var(--bg);border:1px solid var(--line);border-left:5px solid var(--cc)}.calr>div{flex:1;display:flex;flex-direction:column;min-width:0}.calr small{color:var(--mute)}
.calt{flex:none;width:58px;font-weight:900;font-size:.85rem}.cali{flex:none;width:40px;display:grid;place-items:center;font-size:1.4rem}
.shwg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.shws{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:150px;border-radius:18px;background:var(--bg);color:var(--ink);border:2px dashed var(--line)}.shws.on{border:2px solid #ffd35c;background:radial-gradient(circle at 50% 40%,rgba(255,211,92,.25),var(--bg) 70%)}.shws span{font-size:2rem;color:var(--mute)}.shws img{max-height:100px;object-fit:contain}
.shwt{margin:12px 0 4px}.shwst{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))!important}
.proftit{font-weight:800;color:#c42a5e;margin:-2px 0 4px}.profshw img{max-height:84px}
.modwhy{display:flex;flex-direction:column;gap:6px;width:100%}.modwhy button{background:var(--bg);color:var(--ink);border:1px solid var(--line)}
.modr{display:flex;gap:10px;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;padding:10px 12px;border-radius:14px;background:var(--bg);border:1px solid var(--line);margin-bottom:6px}.modr>div:first-child{flex:1;min-width:220px}.modr p{margin:4px 0 0;word-break:break-word}.modb{display:flex;gap:4px;flex-wrap:wrap}
.modrk{margin-left:6px;padding:2px 6px}
.pwabox{display:flex;flex-direction:column;gap:6px;padding:10px 12px;margin-bottom:10px;border-radius:14px;background:var(--bg);border:1px solid var(--line)}.pwabox h4{margin:0}.notik{display:flex;flex-direction:column;gap:2px;padding-left:10px}
#tutSpot{position:fixed;z-index:150;border-radius:16px;box-shadow:0 0 0 4px #ffd35c,0 0 0 9999px rgba(10,12,32,.55);pointer-events:none;transition:all .25s ease;animation:tutp 1.4s ease-in-out infinite}#tutSpot[hidden]{display:none}@keyframes tutp{50%{box-shadow:0 0 0 8px #ffd35c,0 0 0 9999px rgba(10,12,32,.55)}}
#tutBox{position:fixed;z-index:151;width:340px;background:var(--panel);color:var(--ink);border:3px solid #ffd35c;border-radius:18px;padding:12px 14px;box-shadow:0 14px 40px rgba(0,0,0,.4);display:flex;flex-direction:column;gap:4px;transition:top .25s,left .25s}#tutBox[hidden]{display:none}
#tutBox small{color:var(--mute);font-weight:800;font-size:.72rem}#tutBox b{font-size:1.1rem}#tutBox p{margin:0;font-size:.92rem;line-height:1.4}#tutBox>div{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
#tutBox.float,#tutBox.fin{left:50%!important;top:auto!important;bottom:20px;transform:translateX(-50%);width:min(380px,calc(100vw - 24px))!important}#tutBox.fin{bottom:auto;top:50%!important;transform:translate(-50%,-50%);text-align:center}#tutBox.fin>div{justify-content:center}
#tutRe{margin-left:6px}body.calm #tutSpot{animation:none}
body.calm .p1 .tpm,body.calm .p1 .tpm:before,body.calm .tourrays,body.calm .tpsh,body.calm .tourc,body.calm .rucoin span,body.calm #mgBan,body.calm .mgbi,body.calm .mgbig{animation:none!important}
body.calm .dcheart,body.calm .egg.wob,body.calm .gfb span,body.calm .gfbox,body.calm .hofb,body.calm .twnext.boss,body.calm .safspr{animation:none!important}''')
rep('#welc,#newsM{','#privM .jbox{max-height:calc(100vh - 32px);overflow:auto;width:min(680px,calc(100vw - 24px));max-width:none;box-sizing:border-box;text-align:left}\n#privM h2{text-align:center}\n#privM h3{margin:14px 0 4px;font-size:1rem}\n#privM .privt{font-size:.9rem;line-height:1.45;color:var(--ink)}\n#privM .privt ul{margin:4px 0;padding-left:20px}\n#privM .privt li{margin:2px 0}\n#privM[hidden]{display:none}\n#privM{z-index:140!important}\n#welc,#newsM,#privM{')
rep('#welc,#newsM,#privM{','#legalF{text-align:center;font-size:.68rem;color:var(--mute);opacity:.6;padding:18px 12px 6px;line-height:1.4}\n#legalF a{color:inherit;text-decoration:underline;text-underline-offset:2px}\n#legalF a:hover{opacity:1;color:var(--ink)}\n@media (max-width:700px){#legalF{padding:14px 96px 10px 12px;text-align:left}}\n#welc,#newsM,#privM{')
rep('#welc,#newsM,#privM{','.fmovr{align-items:start}\n.fichr>div{min-width:0}\n.fabil select{max-width:100%}\n.fmovs{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px}\n.fmov{border:1px solid var(--line);border-left:4px solid var(--tc);border-radius:10px;padding:6px 8px;background:var(--panel);display:flex;flex-direction:column;gap:1px;line-height:1.25}\n.fmov b{font-size:.88rem}\n.fmov small{font-size:.72rem}\n.fmov small i{font-style:normal;color:var(--tc);font-weight:700}\n.fmov .fmovd{color:var(--mute);font-size:.68rem;opacity:.85}\n.fmov .fmov0{color:var(--red);font-weight:700}\n.fmovnx{grid-column:1/-1;color:var(--mute);font-size:.74rem}\n@media (max-width:480px){.fmovr{grid-template-columns:1fr!important}.fmovr>span{font-weight:700}}\n#welc,#newsM,#privM{')
rep('#welc,#newsM,#privM{','.pkvspr img.hd{margin:0!important}\n.pkvw h3{position:relative;z-index:1}\n#welc,#newsM,#privM{')
# ---- partidas exportadas: nombre nuevo, firma y comprobaciones al importar ----
rep('''      if(!d){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:"application/json"}));a.download="capsula-pokemon-partida.json";document.body.appendChild(a);a.click();a.remove();clMsg("Partida exportada.");return}
      await d.save({filename:"capsula-pokemon-partida.json",data:JSON.stringify(S)});clMsg("Partida exportada.");''',
'''      const sj=JSON.stringify(S),out=JSON.stringify({pgo:1,d:sj,s:await saveSign(sj)});
      if(!d){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([out],{type:"application/json"}));a.download="poke-gacha-online-partida.json";document.body.appendChild(a);a.click();a.remove();clMsg("Partida exportada.");return}
      await d.save({filename:"poke-gacha-online-partida.json",data:out});clMsg("Partida exportada.");''')
rep('''      const t=await f.text(),d=JSON.parse(t);
      if(!d||typeof d!=="object"||typeof d.owned!=="object"||typeof d.t!=="number")throw 0;''',
'''      const raw=JSON.parse(await f.text());
      if(!raw||raw.pgo!==1||typeof raw.d!=="string"||typeof raw.s!=="string"){clMsg("Este archivo no tiene firma: es de una versión anterior del juego o se ha modificado. Exporta tu partida otra vez desde el juego.");$("clImpOk").hidden=true;return}
      if(await saveSign(raw.d)!==raw.s){clMsg("❌ Este archivo se ha modificado fuera del juego y no se puede importar.");$("clImpOk").hidden=true;return}
      const t=raw.d,d=JSON.parse(t),bad=saveCheck(d);
      if(bad){clMsg("❌ No se puede importar: "+bad+".");$("clImpOk").hidden=true;return}''')
rep('#welc,#newsM,#privM{','#nkM{position:fixed;inset:0;z-index:170;background:rgba(10,12,30,.75);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(2px)}\n#nkM .jbox{width:min(440px,calc(100vw - 24px));box-sizing:border-box;text-align:center}\n#nkM input{width:100%;box-sizing:border-box;font-size:1.15rem;padding:10px 12px;border-radius:12px;border:2px solid var(--line);background:var(--bg);color:var(--ink);text-align:center;margin:6px 0 4px}\n#nkM #nkMsg{display:block;min-height:1.2em;margin-bottom:6px}\n#welc,#newsM,#privM{')
rep('#welc,#newsM,#privM{','.bagq{margin:0 0 8px}\n.bagq input{width:100%;box-sizing:border-box;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font-size:.95rem}\n.btile[hidden]{display:none!important}\n#welc,#newsM,#privM{')
rep('#welc,#newsM,#privM{','#buseM{position:fixed;inset:0;z-index:75;background:rgba(10,12,30,.72);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(2px)}\n#buseM[hidden]{display:none}\n#buseM .busew{width:min(560px,calc(100vw - 24px));max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.45)}\n#buseM .buse{margin:0;background:var(--panel)}\n#buseM #buseMsg{display:block;padding:8px 4px 0;color:#fff;text-align:center}\n#buseM #buseMsg[hidden]{display:none}\n#welc,#newsM,#privM{')
rep('#welc,#newsM,#privM{','#lrnM{position:fixed;inset:0;z-index:85;background:rgba(10,12,30,.75);display:flex;align-items:center;justify-content:center;padding:16px}\n#lrnM .jbox{width:min(480px,calc(100vw - 24px));box-sizing:border-box;text-align:left}\n#lrnM .lrnh{display:flex;gap:10px;align-items:center}\n#lrnM h3{margin:0 0 2px;font-size:1.05rem}\n#lrnM .lrng{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}\n#lrnM .lrnb{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-left:5px solid var(--tc);font-weight:600}\n#lrnM .lrnb small{font-weight:500;color:var(--mute)}\n#lrnM>.jbox>.alt{width:100%}\n#welc,#newsM,#privM{')
# ventanas al entrar de una en una: el pase diario espera a la bienvenida, el apodo y el tutorial; los logros esperan a que no haya ventanas
rep('setTimeout(()=>{if(S.daily!==today()&&$("welc").hidden&&$("newsM").hidden)strkOpen();else if(S.daily!==today()){const iv=setInterval(()=>{if($("welc").hidden&&$("newsM").hidden){clearInterval(iv);if(S.daily!==today())strkOpen()}},800)}},1200);',
 'setTimeout(()=>{const iv=setInterval(()=>{if(S.daily===today()){clearInterval(iv);return}if(typeof popFree==="function"?popFree():($("welc").hidden&&$("newsM").hidden)){clearInterval(iv);strkOpen()}},800)},1200);')
rep('toast("🏅 ¡Logro conseguido: "+a[2]+"! Reclama tu recompensa.")','(typeof popToast==="function"?popToast:toast)("🏅 ¡Logro conseguido: "+a[2]+"! Reclama tu recompensa.")')
rep('#welc,#newsM,#privM{','.infob{display:inline;background:none;border:0;padding:0 2px;margin:0;color:var(--teal);font:inherit;font-weight:700;cursor:pointer;box-shadow:none;min-height:0;width:auto}\n.infob:hover{text-decoration:underline;transform:none}\n#welc,#newsM,#privM{')
rep('#welc,#newsM,#privM{','.tmhp{display:block;height:7px;border-radius:99px;background:rgba(0,0,0,.18);overflow:hidden;margin-top:4px;max-width:170px}\n.tmhp i{display:block;height:100%;border-radius:99px;transition:width .3s}\n.tmhpt{font-size:.68rem!important;opacity:.8}\n#welc,#newsM,#privM{')
# recompensas de los logros más bajas (antes 100K / 1M / 10M / 50M / 250M / 1.000M y más objetos)
rep('''const AR=[
{t:100000,it:{pb:5,pot:3}},
{t:1000000,it:{sb:5,spot:3}},
{t:10000000,it:{ub:5,hpot:5,cand:1}},
{t:50000000,it:{ub:10,mpot:5,cand:3,mb:1}},
{t:250000000,it:{mrev:5,cand:10,mb:3}},
{t:1000000000,it:{mrev:10,cand:25,mb:10}}];''','''const AR=[
{t:10000,it:{pb:3,pot:2}},
{t:75000,it:{sb:3,spot:2}},
{t:500000,it:{ub:3,hpot:3}},
{t:3000000,it:{ub:5,mpot:3,cand:1}},
{t:15000000,it:{mrev:3,cand:3,mb:1}},
{t:60000000,it:{mrev:5,cand:8,mb:3}}];''')
rep('#welc,#newsM,#privM{','.mghow{margin:12px auto 0;max-width:520px;text-align:left;background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:10px 14px}\n.mghow summary{cursor:pointer;font-weight:800}\n.mghow ul{margin:8px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:5px;font-size:.88rem;line-height:1.4}\n#welc,#newsM,#privM{')
