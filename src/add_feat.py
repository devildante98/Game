# ===================== variocolor, racha diaria y clasificacion =====================
rep('const REF={C:0,R:1,E:2,L:4}', 'const SHINY_G=1/500,SHINY_S=1/250,SHINY_W=1/400,shinyTotal=()=>Object.values(S.shiny||{}).reduce((a,b)=>a+b,0);\nconst REF={C:0,R:1,E:2,L:4}')
# ---- tiradas ----
rep('const r=isNew?0:REF[p[2]];back+=r;res.push([p,isNew,r]);', 'const sh=Math.random()<(sup?SHINY_S:SHINY_G);if(sh){S.shiny=S.shiny||{};S.shiny[p[0]]=(S.shiny[p[0]]||0)+1;qEv("shiny")}\n    const r=isNew?0:REF[p[2]];back+=r;res.push([p,isNew,r,sh]);')
rep('const cards=res.map(x=>cardHTML(x[0],x[1],x[2],n===1));', 'const cards=res.map(x=>cardHTML(x[0],x[1],x[2],n===1,x[3])),anySh=res.some(x=>x[3]);')
rep('''function cardHTML(p,isNew,back,big){
  return `<div class="card ${p[2]} ${big?"big":""}"><span class="tag ${isNew?"":"dup"}">${isNew?"¡NUEVO!":"+"+back+" 🎟️"}</span><div class="em">${ico(p,big?76:46)}</div><b>${p[0]}</b>''',
'''function cardHTML(p,isNew,back,big,sh){
  return `<div class="card ${p[2]} ${big?"big":""} ${sh?"shiny":""}"><span class="tag ${isNew?"":"dup"}">${isNew?"¡NUEVO!":"+"+back+" 🎟️"}</span>${sh?'<span class="shtag">✨ VARIOCOLOR</span>':""}<div class="em">${ico(p,big?76:46,false,sh)}</div><b>${sh?"✨ ":""}${p[0]}</b>''')
rep('$("msg").textContent=(best==="L"?"¡LEGENDARIO! ":best==="E"?"¡Épico! ":"")', '$("msg").textContent=(anySh?"✨ ¡VARIOCOLOR! ":"")+(best==="L"?"¡LEGENDARIO! ":best==="E"?"¡Épico! ":"")')
rep('if(n===1){$("out").innerHTML=cards[0];tm(end,300)}', 'if(n===1){$("out").innerHTML=cards[0];snd("rev",anySh&&best!=="L"?"S":best);if(anySh){flash("#fff6a0")}tm(end,300)}')
rep('sl[i].innerHTML=cards[i];if("CREL".indexOf(x[0][2])>1)flash(RC[x[0][2]])', 'sl[i].innerHTML=cards[i];snd("rev",x[3]&&x[0][2]!=="L"?"S":x[0][2]);if(x[3]){flash("#fff6a0")}else if("CREL".indexOf(x[0][2])>1)flash(RC[x[0][2]])')
# ---- Pokedex ----
rep('const dk=JSON.stringify(S.owned)+JSON.stringify(S.reg||{})', 'const dk=JSON.stringify(S.owned)+JSON.stringify(S.reg||{})+JSON.stringify(S.shiny||{})')
rep('<div class="em">${r?ico(p,36):"❔"}</div>', '${S.shiny&&S.shiny[p[0]]?\'<span class="shb" title="Variocolor ×\'+S.shiny[p[0]]+\'">✨\'+(S.shiny[p[0]]>1?S.shiny[p[0]]:"")+\'</span>\':""}<div class="em">${r?ico(p,36,false,!!(S.shiny&&S.shiny[p[0]])):"❔"}</div>')
rep('<option value="2">Repetidos</option>', '<option value="2">Repetidos</option><option value="3">✨ Variocolor</option>')
rep('(s==="1"?hasP(p[0]):s==="0"?!hasP(p[0]):c>1)', '(s==="1"?hasP(p[0]):s==="0"?!hasP(p[0]):s==="3"?!!(S.shiny&&S.shiny[p[0]]):c>1)')
rep('$("prog").textContent=got+" / "+P.length;', '$("prog").textContent=got+" / "+P.length+(shinyTotal()?" · ✨ "+shinyTotal()+" variocolor":"");')
# ---- racha diaria ----
rep('<div><small>Regalo diario (sube cada día)</small><button id="daily">Reclamar +5.000 🎟️</button></div>',
    '<div class="dly"><small>Regalo diario (sube cada día) · ¡Reclámalo cada día para mantener tu racha!</small><button id="daily">Reclamar +5.000 🎟️</button><div id="strk"></div></div>')
rep('''$("daily").onclick=()=>{if(S.daily===today())return;S.daily=today();const gf=gift();S.t+=gf;S.dg=(S.dg||0)+1;qEv("daily");save();render();$("msg").textContent="¡+"+gf+" 🎟️ de regalo diario! Mañana será mayor."};''',
'''// racha de dias seguidos: premios extra que crecen (cada 7 dias un Caramelo Raro, el dia 30 una Master Ball) y el ciclo vuelve a empezar
const yday=()=>new Date(Date.now()-864e5).toISOString().slice(0,10);
const STRK_W=[{pb:3},{pot:2},{sb:5},{eter:2},{ub:2},{hpot:2},{cand:1}];
const strkRw=d=>{const c=((d-1)%30)+1;return c===30?{mb:1,cand:2}:c===28?{cand:2,evo:1}:c===21?{cand:2,ub:3}:c===14?{cand:1,ub:3,evo:1}:STRK_W[(c-1)%7]};
const strkNow=()=>S.sk&&(S.sk.last===today()||S.sk.last===yday())?S.sk.n:0;
let _sk="";
function strkUI(){
  const n=strkNow(),claimed=S.daily===today(),nx=n+(claimed?1:1),key=n+":"+claimed+":"+(S.sk&&S.sk.best);if(key===_sk)return;_sk=key;
  const cell=d=>{const r=strkRw(d),big=d%7===0||((d-1)%30)+1===30;return '<div class="skd'+(d===nx&&!claimed?' now':'')+(big?' big':'')+'"><small>Día '+d+'</small><span>'+Object.keys(r).map(k=>itemIco(k==="evo"?"fire-stone":k,22)+(r[k]>1?'<b>×'+r[k]+'</b>':'')).join("")+'</span></div>'};
  $("strk").innerHTML='<div class="skh"><b>🔥 Racha: '+n+' día'+(n===1?"":"s")+'</b><small class="mut">'+(claimed?"¡Hecho por hoy! Vuelve mañana para el día "+(n+1)+".":n>0?"¡Reclama hoy para no perder tu racha!":"Empieza tu racha reclamando el regalo.")+(S.sk&&S.sk.best?" · Mejor racha: "+S.sk.best:"")+'</small></div><div class="skrow">'+[0,1,2,3,4,5,6].map(i=>cell(nx+i)).join("")+'</div>';
}
$("daily").onclick=()=>{
  if(S.daily===today())return;
  S.sk=S.sk||{n:0};S.sk.n=S.sk.last===yday()?S.sk.n+1:1;S.sk.last=today();S.sk.best=Math.max(S.sk.best||0,S.sk.n);
  S.daily=today();const gf=gift();S.t+=gf;S.dg=(S.dg||0)+1;qEv("daily");
  const rw=strkRw(S.sk.n),got=[];
  Object.keys(rw).forEach(k=>{let id=k;if(k==="evo"){const ev=ITEMS.filter(i=>i[7]==="evo"&&/stone/.test(i[0]));id=ev[Math.floor(Math.random()*ev.length)][0]}S.bag[id]=(S.bag[id]||0)+rw[k];got.push(rw[k]+" "+IN(id))});
  save();render();snd("win");
  $("msg").textContent="¡+"+fmt(gf)+" 🎟️ de regalo diario! Mañana será mayor.";
  toast("🔥 ¡Racha de "+S.sk.n+" día"+(S.sk.n===1?"":"s")+"! +"+fmt(gf)+" 🎟️ y "+got.join(", "));
};''')
rep('updShop();updBag();rows();fists();healUI();bagUI();leagueUI();qUI();gUI();', 'updShop();updBag();rows();fists();healUI();bagUI();leagueUI();qUI();gUI();strkUI();')
# ---- logros extra (dependen de la suerte o de la constancia: no cuentan para el prestigio) ----
rep('["jp","🎉","¡Qué suerte!","Consigue el premio gordo ({g} vez)",()=>S.jp||0,[[1,5]],"x"]];',
    '["shy","✨","Cazador de variocolor","Consigue {g} Pokémon variocolor",()=>stt().shiny||0,[[1,3],[5,4],[20,5]],"x"],\n["strk","🔥","Racha imparable","Reclama el regalo diario {g} días seguidos",()=>(S.sk&&S.sk.best)||0,[[7,1],[30,3],[100,5]],"x"],\n["jp","🎉","¡Qué suerte!","Consigue el premio gordo ({g} vez)",()=>S.jp||0,[[1,5]],"x"]];')
# ---- clasificacion ----
rep('<section class="panel" aria-label="Novedades" id="newsP">', '''<section class="panel" aria-label="Clasificación" id="rkP">
  <div class="hhead"><h2>📊 Clasificación</h2><button id="rkRe" style="background:var(--line);color:var(--ink)">🔄 Actualizar</button></div>
  <p class="rates">Los mejores entrenadores entre todos los jugadores con cuenta. Tu puntuación se actualiza cuando la partida se guarda en la nube (cada 5 minutos o al pulsar «💾 Guardar»).</p>
  <div class="rktabs" id="rkTabs"></div>
  <div id="rkBox"></div>
</section>
<section class="panel" aria-label="Novedades" id="newsP">''')
rep('["🌟","Prestigio","prsP"]', '["🌟","Prestigio","prsP"],["📊","Clasificación","rkP"]')
s0 = H.index('// ================= sugerencias (solo las lee el creador del juego) =================')
H = H[:s0] + r'''// ================= clasificacion =================
const RKC=[["dex","📚 Pokédex","registrados"],["pw","⚔️ PVP","victorias PVP"],["win","🎯 Combates","combates ganados"],["sh","✨ Variocolor","variocolor"],["prs","🌟 Prestigio","prestigio"],["guild","🛡️ Gremios","miembros"]];
let RK={tab:"dex",cache:{},busy:false,err:""};
window.rankData=()=>{if(typeof nickOk!=="function"||!nickOk()||!window.FB)return null;return{n:pvClean(pvNick()),tr:trEnc(myLook()),g:GS.doc?String(GS.doc.tag):"",gi:GS.doc?GS.doc.icon|0:0,dex:P.filter(p=>hasP(p[0])).length,pw:(S.pvp&&S.pvp.w)||0,win:stt().win||0,sh:shinyTotal(),prs:PRS()}};
async function rkLoad(force){
  if(!window.FB||!window.FB.rankTop){rkUI();return}
  const t=RK.tab,c=RK.cache[t];if(c&&!force&&Date.now()-c.at<120000){rkUI();return}
  RK.busy=true;RK.err="";rkUI();
  try{
    if(t==="guild"){const l=await window.FB.gList();RK.cache[t]={at:Date.now(),rows:l.map(g=>({id:g.id,n:g.name,g:g.tag,gi:g.icon,v:g.n|0,fl:g.fl}))}}
    else{const me=window.rankData();if(me)await window.FB.rankSave(me);const r=await window.FB.rankTop(t,50);let pos=null;if(me)try{pos=await window.FB.rankPos(t,me[t])}catch(e){}RK.cache[t]={at:Date.now(),rows:r.map(x=>Object.assign({},x,{v:x[t]|0})),pos:pos,mine:me?me[t]:null}}
  }catch(e){RK.err=(e&&e.code)||"error"}
  RK.busy=false;rkUI();
}
function rkUI(){
  $("rkTabs").innerHTML=RKC.map(c=>'<button class="'+(RK.tab===c[0]?"on":"alt")+'" data-rk="'+c[0]+'">'+c[1]+'</button>').join("");
  const box=$("rkBox");
  if(!window.FB||!window.FB.rankTop){box.innerHTML='<small class="mut">Inicia sesión con tu cuenta para aparecer en la clasificación y verla.</small>';return}
  if(RK.err){box.innerHTML='<small class="mut">No se pudo cargar la clasificación ('+esc(RK.err)+'). Si pone «permission-denied», añade en Firestore las reglas de «ranks».</small>';return}
  const c=RK.cache[RK.tab];if(!c){box.innerHTML='<small class="mut">'+(RK.busy?"Cargando…":"Pulsa «Actualizar» para ver la clasificación.")+'</small>';return}
  const lab=RKC.find(x=>x[0]===RK.tab)[2],me=window.FB.uid(),md=["🥇","🥈","🥉"];
  box.innerHTML=(c.pos?'<div class="rkme">Tu posición: <b>#'+c.pos+'</b> · '+fmt(c.mine||0)+' '+lab+'</div>':'')+(c.rows.length?'<div class="frl">'+c.rows.map((r,i)=>'<div class="pvrow rkrow'+(r.id===me||(RK.tab==="guild"&&r.id===S.gid)?' rkmine':'')+'"><b class="rkpos">'+(md[i]||"#"+(i+1))+'</b>'+(RK.tab==="guild"?gFlag(r.fl,r.gi,40):'<span class="pvav">'+trImg(trDec(r.tr),"f","i")+'</span>')+'<b style="flex:1"'+(RK.tab==="guild"?'':' class="plink" data-prof="'+esc(r.id)+'"')+'>'+esc(RK.tab==="guild"?r.n:pvClean(r.n))+' '+(r.g?'<span class="gtag">'+esc(String(r.g).slice(0,4))+'</span>':'')+'</b><span class="rkv">'+fmt(r.v)+' <small>'+lab+'</small></span></div>').join("")+'</div>':'<small class="mut">Todavía no hay nadie en esta clasificación.</small>')+(RK.busy?'<small class="mut">Actualizando…</small>':'');
}
$("rkTabs").addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!b.dataset.rk)return;RK.tab=b.dataset.rk;snd("ui");rkLoad(false)});
$("rkRe").onclick=()=>rkLoad(true);
if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){io.disconnect();rkLoad(false)}});setTimeout(()=>io.observe($("rkP")),2000)}
''' + H[s0:]
rep('trUI();supUI();frUI();gUI(true);', 'trUI();supUI();frUI();gUI(true);rkUI();strkUI();')
# ---- Firebase: puntuaciones (una escritura como mucho por guardado y solo si cambian) ----
rep('    gDisband:gid=>S.deleteDoc(S.doc(db,"guilds",gid))\n  };', '''    gDisband:gid=>S.deleteDoc(S.doc(db,"guilds",gid)),
    async rankSave(d){if(!d||!uid)return;const j=JSON.stringify(d);if(j===lastRank)return;await S.setDoc(S.doc(db,"ranks",uid),Object.assign({},d,{at:Date.now()}));lastRank=j},
    async rankTop(f,lim){const sn=await S.getDocs(S.query(S.collection(db,"ranks"),S.orderBy(f,"desc"),S.limit(lim)));return sn.docs.map(d=>Object.assign({id:d.id},d.data()))},
    async rankPos(f,v){const c=await S.getCountFromServer(S.query(S.collection(db,"ranks"),S.where(f,">",v)));return c.data().count+1}
  };
  let lastRank="";''')
rep('try{await S.setDoc(S.doc(db,"users",uid),{data:d,updated:S.serverTimestamp()});lastSaved=d;lastW=Date.now()}',
    'try{await S.setDoc(S.doc(db,"users",uid),{data:d,updated:S.serverTimestamp()});lastSaved=d;lastW=Date.now();try{if(window.rankData)await FB.rankSave(window.rankData())}catch(e){}}')
# ---- estilos ----
rep('.dexn{position:absolute;', '''.card.shiny{border-color:transparent!important;background:linear-gradient(var(--bg),var(--bg)) padding-box,linear-gradient(120deg,#ff5f9e,#ffd35c,#5fe0c0,#6aa8ff,#c57bff,#ff5f9e) border-box!important;background-size:100% 100%,300% 300%!important;animation:shgrad 3s linear infinite,pop .8s cubic-bezier(.2,.9,.3,1.15) backwards!important;box-shadow:0 0 22px rgba(255,220,120,.8)!important}
@keyframes shgrad{to{background-position:0 0,300% 0}}
.dex .card.shiny,.nox .card.shiny{animation:shgrad 3s linear infinite!important}
.shtag{position:absolute;bottom:-9px;left:50%;transform:translateX(-50%);white-space:nowrap;z-index:2;background:linear-gradient(90deg,#ff5f9e,#ffd35c,#5fe0c0);color:#2a1a00;border-radius:99px;padding:1px 8px;font-size:.66rem;font-weight:800}
.shb{position:absolute;bottom:2px;right:5px;font-size:.72rem;font-weight:700;color:#d4a000}
img.shy{filter:drop-shadow(0 0 6px rgba(255,230,120,.95))}
.dly{display:flex;flex-direction:column;gap:6px}
#strk{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px}
.skh{display:flex;flex-direction:column;gap:2px;margin-bottom:6px}
.skrow{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}
.skd{display:flex;flex-direction:column;align-items:center;gap:2px;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:4px 2px;min-width:0}
.skd small{font-size:.6rem;color:var(--mute);white-space:nowrap}
.skd span{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:1px;min-height:24px}
.skd span b{font-size:.6rem}
.skd.big{border-color:var(--yel);background:color-mix(in srgb,var(--yel) 15%,var(--bg))}
.skd.now{border:2px solid var(--teal);box-shadow:0 0 10px color-mix(in srgb,var(--teal) 50%,transparent)}
.rktabs{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 4px}
.rktabs button{padding:6px 12px;font-size:.85rem}
.rktabs button.alt{background:var(--line);color:var(--ink)}
.rkme{background:var(--bg);border:2px solid var(--teal);border-radius:12px;padding:8px 12px;margin-top:8px}
.rkpos{min-width:38px;text-align:center;font-size:1.05rem}
.rkv{font-weight:800;color:var(--teal);white-space:nowrap}.rkv small{font-weight:400;color:var(--mute)}
.rkmine{border-color:var(--teal)!important;background:color-mix(in srgb,var(--teal) 12%,var(--bg))!important}
.dexn{position:absolute;''')
# ---- novedades ----
rep('"🎞️ Los Pokémon ahora tienen sprites originales ANIMADOS', '"✨ ¡Pokémon VARIOCOLOR! 1 de cada 500 tiradas (1 de cada 250 en las súper tiradas) y 1 de cada 400 Pokémon salvajes son variocolor. Tienen su propio filtro en la Pokédex y salen brillando en combate.",\n"🔥 Racha diaria: reclama el regalo cada día seguido para conseguir premios extra (Caramelos Raros cada semana y una Master Ball el día 30).",\n"📊 Clasificación de los mejores entrenadores: Pokédex, PVP, combates, variocolor, prestigio y gremios.",\n"🎞️ Los Pokémon ahora tienen sprites originales ANIMADOS')
