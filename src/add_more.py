# ===================== resto de mejoras: eventos, zonas, gimnasios, temporadas, gremio, perfiles, intercambios, gritos =====================
s0 = H.index('// ================= sugerencias (solo las lee el creador del juego) =================')
H = H[:s0] + open(W + 'p_more.js', encoding='utf-8').read() + '\n$("zoneSel").onchange=()=>{S.zone=$("zoneSel").value;save()};\n' + H[s0:]
# ---- tiradas: Pokémon de la semana y evento ----
rep('function pickR(r){\n  const pool=P.filter(p=>p[2]===r);\n', 'function pickR(r){\n  const pool=P.filter(p=>p[2]===r);\n  {const f=featured();if(f&&f[2]===r&&Math.random()<.15)return f}\n  {const ev=evNow();if(ev&&Math.random()<.35){const ep=pool.filter(p=>ev.t.includes(p[1]));if(ep.length)return ep[Math.floor(Math.random()*ep.length)]}}\n')
# ---- tiradas: suspense segun la rareza (la capsula cambia de color antes de abrirse) ----
rep('const b=$("ball");b.style.opacity=1;b.className="ball "+best;', 'const b=$("ball");b.style.opacity=1;b.className="ball C";')
rep("""'<div class="slot"><div class="ball mini '+x[0][2]+' shake"></div></div>'""", """'<div class="slot"><div class="ball mini C shake"></div></div>'""")
rep('  tm(()=>{\n    flash(RC[best]);b.style.opacity=.35;', '''  const lvl="CREL".indexOf(best),up=k=>{const L=n===1?[b]:[...document.querySelectorAll(".slot .ball")];L.forEach((e,i)=>{if(n===1||"CREL".indexOf(res[i][0][2])>="CREL".indexOf(k)){e.className="ball "+(n===1?"":"mini ")+k;void e.offsetWidth;e.classList.add("shake")}})};
  [["R",480],["E",900],["L",1320]].forEach((q,j)=>{if(lvl>=j+1)tm(()=>{up(q[0]);snd(j?"buff":"ui");if(j){flash(RC[q[0]])}if(q[0]==="L"){snd("lvl");$("stage").animate([{transform:"translate(0,0)"},{transform:"translate(-6px,2px)"},{transform:"translate(6px,-2px)"},{transform:"translate(0,0)"}],{duration:420})}},q[1])});
  const rev=(n===1?700:900)+[0,380,800,1220][lvl];
  tm(()=>{
    flash(RC[best]);b.style.opacity=.35;if(n===1&&lvl>=2)cry(res[0][0][0]);''')
rep('  },n===1?700:900);', '  },rev);')
# ---- misiones: aportaciones al gremio ----
rep('function qEv(ev,n){\n  n=n||1;', 'function qEv(ev,n){\n  n=n||1;if(window.gAccEv)window.gAccEv(ev,n);')
# ---- clasificacion: temporada y datos del perfil ----
rep('sh:shinyTotal(),prs:PRS()}};', 'sh:shinyTotal(),prs:PRS(),med:medCount(),bs:(S.sk&&S.sk.best)||0,ach:Object.values(S.ach||{}).reduce((a,b)=>a+b,0),tm:(S.team||[]).filter(n=>n&&S.owned[n]).slice(0,6).map(n=>({n:n,l:lvd(n).l,s:S.shiny&&S.shiny[n]>0?1:0})),...(seasonCheck(),S.ssn.w+S.ssn.l>0?{[ssnField()]:S.ssn.p}:{})}};')
rep('["sh","✨ Variocolor","variocolor"],', '["sh","✨ Variocolor","variocolor"],["ssn","🏅 Temporada PVP","puntos de temporada"],')
rep('const r=await window.FB.rankTop(t,50);let pos=null;if(me)try{pos=await window.FB.rankPos(t,me[t])}catch(e){}RK.cache[t]={at:Date.now(),rows:r.map(x=>Object.assign({},x,{v:x[t]|0})),pos:pos,mine:me?me[t]:null}',
    'const f=t==="ssn"?ssnField():t,r=await window.FB.rankTop(f,50);let pos=null;if(me&&me[f]!=null)try{pos=await window.FB.rankPos(f,me[f])}catch(e){}RK.cache[t]={at:Date.now(),rows:r.map(x=>Object.assign({},x,{v:x[f]|0})),pos:pos,mine:me?me[f]:null}')
# ---- HTML ----
rep('<div class="flash" id="flash"></div>\n  <div class="gbtn">', '<div class="flash" id="flash"></div>\n  <div id="evBan"></div>\n  <div class="gbtn">')
rep('<button class="red" id="fgo">¡Combatir!</button>', '<select id="zoneSel" aria-label="Zona de exploración"></select><button class="red" id="fgo">¡Combatir!</button>')
rep('<section class="panel" aria-label="Liga Pokémon" id="lgP">', '''<section class="panel" aria-label="Gimnasios" id="gymP">
  <div class="hhead"><h2>🏅 Gimnasios</h2><span class="hcost">8 medallas</span></div>
  <p class="rates">Derrota a los 8 Líderes de Gimnasio en orden para conseguir sus medallas. Cada medalla da un buen premio y desbloquea nuevas zonas de exploración, y con las 8 podrás desafiar a la Liga Pokémon. Cada gimnasio marca el <b>límite de nivel</b>: tus Pokémon no pueden pasar del nivel del as del siguiente Líder (ni puedes capturar salvajes más fuertes) hasta que consigas su medalla. Puedes repetir los combates (revancha) con rivales a tu nivel.</p>
  <div id="gymBox"></div>
</section>
<section class="panel" aria-label="Liga Pokémon" id="lgP">''')
rep('  <div id="pvLobby">', '  <div id="ssnBox"></div>\n  <div id="pvLobby">')
rep('  <div id="frBox"></div>', '  <div id="frBox"></div>\n  <div id="trdBox" style="margin-top:12px"></div>')
rep('<div id="evo" hidden role="dialog"', '<div id="prof" hidden role="dialog" aria-modal="true" aria-label="Perfil de jugador"><div class="jbox"><div id="profB"></div></div></div>\n<div id="evo" hidden role="dialog"')
rep('<label><input type="checkbox" data-o="sfx"> Sonidos de combate</label>', '<label><input type="checkbox" data-o="sfx"> Sonidos de combate</label>\n  <label><input type="checkbox" data-o="cry"> Gritos de los Pokémon</label>')
rep(',sfx:1,svol:.7,', ',sfx:1,cry:1,svol:.7,')
rep('["⚔️","Combate","batP"]', '["⚔️","Combate","batP"],["🏅","Gimnasios","gymP"]')
rep('<li>⚔️ <b>Combate</b>:', '<li>🏅 <b>Gimnasios y zonas</b>: gana las 8 medallas para desbloquear zonas de exploración y la Liga.</li>\n    <li>⚔️ <b>Combate</b>:')
rep('qUI();gUI();strkUI();', 'qUI();gUI();strkUI();gymUI();zoneUI();seasonUI();evBanUI();trdUI();')
rep('trUI();supUI();frUI();gUI(true);rkUI();strkUI();', 'trUI();supUI();frUI();gUI(true);rkUI();strkUI();gymUI();zoneUI();seasonUI();evBanUI();')
rep('if(window.FB){try{window.FB.frInit(frState)}catch(e){}', 'if(window.FB){try{window.FB.frInit(frState);window.FB.trInit(trState)}catch(e){}')
# ---- logros ----
rep('["shy","✨","Cazador de variocolor"', '["med","🏅","Medallista","Consigue {g} medallas de gimnasio",()=>medCount(),[[1,0],[4,1],[8,2]]],\n["trd","🔄","Comerciante","Haz {g} intercambios con amigos",()=>stt().trade||0,[[1,1],[10,3]],"x"],\n["gboss","🐲","Cazagigantes","Derrota {g} jefes de gremio",()=>stt().gboss||0,[[1,2],[10,4]],"x"],\n["ssnp","🏅","Gladiador","Consigue {g} puntos en una temporada PVP",()=>stt().ssnb||0,[[300,2],[1000,3],[2000,5]],"x"],\n["shy","✨","Cazador de variocolor"')
# ---- Firebase: jefe/misiones de gremio, perfiles e intercambios ----
rep('    async rankSave(d){', '''    gContrib:(gid,d)=>S.updateDoc(S.doc(db,"guilds",gid),{["bd."+uid]:S.increment(d.dmg),bh:S.increment(-d.dmg),"gm.cap":S.increment(d.cap),"gm.win":S.increment(d.win),"gm.pull":S.increment(d.pull)}),
    async rankGet(u){const s=await S.getDoc(S.doc(db,"ranks",u));return s.exists()?s.data():null},
    trInit(cb){const st={inc:[],out:[]},emit=()=>cb({inc:st.inc.slice(),out:st.out.slice()});
      S.onSnapshot(S.query(S.collection(db,"trades"),S.where("to","==",uid)),sn=>{st.inc=sn.docs.map(d=>Object.assign({id:d.id},d.data()));emit()},()=>{});
      S.onSnapshot(S.query(S.collection(db,"trades"),S.where("from","==",uid)),sn=>{st.out=sn.docs.map(d=>Object.assign({id:d.id},d.data()));emit()},()=>{})},
    trSend:(to,tn,fn,o)=>S.addDoc(S.collection(db,"trades"),{from:uid,to:to,fn:String(fn),tn:String(tn),o:o,st:"req",at:Date.now()}),
    trUpd:(id,f)=>S.updateDoc(S.doc(db,"trades",id),Object.assign({},f,{at:Date.now()})),
    trDel:id=>S.deleteDoc(S.doc(db,"trades",id)),
    async rankSave(d){''')
rep('try{if(window.rankData)await FB.rankSave(window.rankData())}catch(e){}', 'try{if(window.rankData)await FB.rankSave(window.rankData())}catch(e){}try{if(window.gFlushHook)await window.gFlushHook()}catch(e){}')
# ---- estilos ----
rep('.dexn{position:absolute;', '''#evBan{width:100%;display:flex;flex-direction:column;gap:6px}
.evb{display:flex;align-items:center;gap:10px;border-radius:12px;padding:6px 12px;font-size:.85rem;text-align:left}
.evb.ev{display:block;background:linear-gradient(90deg,#3a1c5c,#7a3b12);color:#ffe7b0}
.evb.ft{background:color-mix(in srgb,var(--yel) 18%,var(--bg));border:1px solid var(--yel)}
.evb.ft .pk{flex:none}
#zoneSel{max-width:260px}
.medal{--ms:34px;position:relative;display:inline-grid;place-items:center;width:var(--ms);height:var(--ms);font-size:calc(var(--ms)*.5);filter:grayscale(1) brightness(.55);opacity:.35}
.medal img{width:100%;height:100%;object-fit:contain;image-rendering:auto;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))}
.medal.on{filter:none;opacity:1}
.medal.on img{filter:drop-shadow(0 0 6px color-mix(in srgb,var(--mc) 70%,#fff)) drop-shadow(0 2px 2px rgba(0,0,0,.35))}
.medal.on img{animation:mshine 3.2s ease-in-out infinite}
@keyframes mshine{0%,70%,100%{filter:drop-shadow(0 0 6px color-mix(in srgb,var(--mc) 70%,#fff)) drop-shadow(0 2px 2px rgba(0,0,0,.35))}82%{filter:brightness(1.45) drop-shadow(0 0 10px #fff) drop-shadow(0 2px 2px rgba(0,0,0,.35))}}
.medrow{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:6px 0}
.capbar{display:flex;gap:8px;align-items:flex-start;margin:4px 0 10px;padding:8px 12px;border-radius:12px;background:color-mix(in srgb,#f59e0b 14%,transparent);border:1px solid color-mix(in srgb,#f59e0b 45%,transparent);font-size:13px;line-height:1.4}
.capbar.ok{background:color-mix(in srgb,#10b981 14%,transparent);border-color:color-mix(in srgb,#10b981 45%,transparent)}
.ssn{display:flex;gap:12px;align-items:center;flex-wrap:wrap;background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:10px 12px;margin:8px 0}
.tier{display:inline-block;font-weight:800;border-radius:10px;padding:4px 10px;color:#fff;background:#b07a4a}
.tier.t1{background:#8c97a8}.tier.t2{background:#d4a000}.tier.t3{background:#2fb0c0}.tier.t4{background:#3f86f0}.tier.t5{background:linear-gradient(90deg,#8a3fd0,#e86aa8)}
.gboss{display:flex;gap:14px;align-items:center;flex-wrap:wrap;background:linear-gradient(135deg,color-mix(in srgb,var(--red) 14%,var(--bg)),var(--bg));border:2px solid var(--red);border-radius:14px;padding:12px;margin:10px 0}
.gboss>div{display:flex;flex-direction:column;gap:4px}
.gbimg{width:110px;height:110px;display:grid;place-items:center}
.gbhp{height:12px}.gbhp i{background:linear-gradient(90deg,#e63950,#f57c20)!important}
.plink{cursor:pointer;text-decoration:underline dotted;text-underline-offset:3px}
#prof{position:fixed;inset:0;z-index:105;background:rgba(10,12,30,.72);display:flex;align-items:center;justify-content:center;padding:16px}
#prof .jbox{text-align:left;max-height:calc(100vh - 32px);overflow:auto}
.profh{display:flex;gap:14px;align-items:center}.profh h2{margin:0 0 4px;color:var(--ink);font-size:1.4rem}
.profav{width:96px;flex:none;background:linear-gradient(#8fd0ff,#dff3ff 60%,#9ad260 61%);border-radius:14px;padding:6px;display:grid;place-items:center}.profav img{width:84px}
.profst{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:12px 0}
@media (max-width:520px){.profst{grid-template-columns:repeat(2,minmax(0,1fr))}}
.profst div{background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:6px;display:flex;flex-direction:column;align-items:center;text-align:center}
.profst b{font-size:1.1rem}.profst small{color:var(--mute);font-size:.7rem}
.proftm{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 10px}.proftm div{display:flex;flex-direction:column;align-items:center;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:4px 6px;min-width:80px}
.trsel2{font:inherit;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink);flex:1;min-width:200px}
.dexn{position:absolute;''')
# ---- novedades ----
rep('"📊 Clasificación de los mejores entrenadores', '"🏅 Gimnasios: consigue las 8 medallas para desbloquear zonas de exploración (Cueva, Mar, Volcán, Torre Fantasma...) y la Liga.",\n"🌍 Zonas de exploración: elige dónde combatir y encontrarás Pokémon de los tipos de esa zona.",\n"🏅 Temporadas PVP mensuales con rangos (de Bronce a Maestro) y premio al acabar el mes.",\n"🐲 Gremios: jefe semanal que derrotáis entre todos y misiones de gremio con premios.",\n"👤 Perfiles públicos: toca el nombre de un jugador para ver su entrenador, su equipo y sus estadísticas.",\n"🔄 Intercambios entre amigos (y los Pokémon que evolucionan por intercambio, ¡evolucionan!).",\n"🎃 Eventos de temporada (ahora: Halloween, con más Pokémon Fantasma y Siniestro) y Pokémon de la semana.",\n"🎰 Las cápsulas cambian de color antes de abrirse según la rareza: ¡suspense!",\n"🔊 Gritos originales de los Pokémon al salir a combate y al tocar su carta en la Pokédex.",\n"📊 Clasificación de los mejores entrenadores')
