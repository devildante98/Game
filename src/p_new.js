// =====================================================================================
// NOVEDADES: ficha del Pokémon (motes, favoritos, naturaleza y objeto), guardería con huevos,
// Zona Safari, Torre Batalla, expediciones, Salón de la Fama y regalos entre amigos
// =====================================================================================
const NX={};// estado temporal de las ventanas nuevas
function nk(n){const m=S.mote&&S.mote[n];return m?m:n}
function isFav(n){return !!(S.fav&&S.fav[n])}
const IN2=k=>{const it=ITEMS.find(i=>i[0]===k);return it?it[1]:k};
const H2=s=>{const m=Math.floor(s/60);return m>=60?Math.floor(m/60)+" h "+(m%60?m%60+" min":""):m>0?m+" min":Math.max(0,Math.ceil(s))+" s"};
// --- dar un Pokémon (huevos, Safari...) ---
function giveMon(n,lv,sh){
  if(!PM[n])return false;const isNew=!hasP(n);
  if(!S.owned[n]){(S.balls=S.balls||{})[n]=BALLR[PM[n][2]];(S.when=S.when||{})[n]=Date.now()}
  S.owned[n]=(S.owned[n]||0)+1;if(isNew)qEv("new");
  if(sh){S.shiny=S.shiny||{};S.shiny[n]=(S.shiny[n]||0)+1;qEv("shiny")}
  lv=Math.max(1,Math.min(100,lv|0));if(!S.lv[n]||S.lv[n].l<lv){S.lv[n]={l:lv,x:0};delete S.mv[n];S.ml=S.ml||{};S.ml[n]=lv}
  return isNew;
}
// --- naturalezas: los repetidos traen naturalezas nuevas que puedes elegir en la ficha ---
let _ownPrev=null;
function natTrack(){
  const o=S.owned||{};S.nat=S.nat||{};
  if(_ownPrev){for(const n in o){const c=o[n]|0,b=_ownPrev[n]|0;if(c<=b)continue;const had=S.nat[n]!=null;natOf(n);natAlt(n,c-b-(had?0:1))}}
  else for(const n in o)if(o[n]>0)natOf(n);
  _ownPrev=Object.assign({},o);
}
const natSync=n=>{if(_ownPrev)_ownPrev[n]=S.owned[n]|0};
function natAlt(n,k){if(k<=0)return;S.natAlt=S.natAlt||{};const L=S.natAlt[n]=S.natAlt[n]||[];for(let i=0;i<Math.min(k,6);i++){const x=Math.floor(Math.random()*NAT.length);if(x!==natOf(n)&&!L.includes(x))L.push(x)}while(L.length>6)L.shift();if(!L.length)delete S.natAlt[n]}
{const _r=render;render=function(){try{natTrack()}catch(e){}return _r.apply(this,arguments)}}
// --- al entregar un Pokémon en un intercambio se limpian sus datos y vuelve su objeto a la Mochila ---
{const _t=pkTake;pkTake=function(n){const h=heldOf(n),r=_t(n);if(r&&!(S.owned[n]>0)){if(h)S.bag[h]=(S.bag[h]||0)+1;[S.held,S.mote,S.fav,S.nat,S.natAlt].forEach(o=>{if(o)delete o[n]});save()}return r}}
// Pokémon ocupados (guardería o expedición)
function busyMon(n){return !!(S.dc&&(S.dc.a===n||S.dc.b===n))||!!(S.exp||[]).some(x=>x.n===n)}
function busyTxt(n){return S.dc&&(S.dc.a===n||S.dc.b===n)?"en la Guardería":(S.exp||[]).some(x=>x.n===n)?"de expedición":""}

// ================= objetos equipables =================
function holdEquip(n,id){
  if(!(S.owned[n]>0)||!HOLDK[id])return "";if(fcd)return "Termina el combate antes de cambiar objetos.";
  if(!(S.bag[id]>0))return "No te quedan "+IN2(id)+".";
  S.held=S.held||{};const old=heldOf(n);if(old===id)return nk(n)+" ya lleva "+IN2(id)+".";
  if(old)S.bag[old]=(S.bag[old]||0)+1;S.held[n]=id;S.bag[id]--;save();snd("buff");_hbk="";
  return nk(n)+" ahora lleva "+IN2(id)+(old?" (y "+IN2(old)+" vuelve a la Mochila)":"")+".";
}
function holdRemove(n){const h=heldOf(n);if(!h)return;if(fcd){toast("Termina el combate antes de cambiar objetos.");return}S.bag[h]=(S.bag[h]||0)+1;delete S.held[n];save();snd("ui");_hbk=""}
function holdPickHTML(id){return '<small class="mut">'+esc(HOLDK[id][3])+'. Elige quién lo llevará (cada Pokémon puede llevar un objeto):</small><div class="sets-row"><input id="bhQ" placeholder="Buscar Pokémon..." aria-label="Buscar Pokémon"></div><div class="bul" id="bhL">'+holdListHTML(id,"")+'</div>'}
function holdListHTML(id,q){
  q=nrm(q||"");const L=P.filter(p=>S.owned[p[0]]>0&&(!q||nrm(p[0]).includes(q)||nrm(nk(p[0])).includes(q))).sort((a,b)=>((S.team.includes(b[0])?1:0)-(S.team.includes(a[0])?1:0))||(lvd(b[0]).l-lvd(a[0]).l)).slice(0,60);
  return L.length?L.map(p=>{const h=heldOf(p[0]);return '<button class="bunit" data-beq="'+esc(p[0])+'">'+ico(p,30)+'<span><b>'+esc(nk(p[0]))+'</b> <small>Nv'+lvd(p[0]).l+(S.team.includes(p[0])?' · ⭐ equipo':'')+(h?' · lleva '+IN2(h):'')+'</small></span></button>'}).join(""):'<small class="mut">No hay Pokémon con ese nombre.</small>';
}
function holdList(id){const l=$("bhL");if(l)l.innerHTML=holdListHTML(id,$("bhQ").value)}
let _hbk="";
function heldBoxUI(){
  let box=$("heldBox");if(!box){const g=$("bgrid");if(!g)return;box=document.createElement("div");box.id="heldBox";g.after(box)}
  const L=Object.keys(S.held||{}).filter(n=>S.owned[n]>0&&heldOf(n)),k=L.map(n=>n+S.held[n]).join("|");if(k===_hbk)return;_hbk=k;
  box.innerHTML=L.length?'<div class="lgnow"><b>🎒 Objetos equipados</b><small class="mut">Se usan solos en combate. Puedes quitarlos cuando quieras y vuelven a la Mochila.</small><div class="frl">'+L.map(n=>'<div class="pvrow"><span class="pvav">'+ico(PM[n],34)+'</span><b>'+esc(nk(n))+'</b><span class="iico">'+itemIco(S.held[n],26)+'</span><small class="mut" style="flex:1">'+IN2(S.held[n])+'</small><button class="alt" data-hrm="'+esc(n)+'">Quitar</button></div>').join("")+'</div></div>':'';
}
{const _b=bagUI;bagUI=function(){_b.apply(this,arguments);try{heldBoxUI()}catch(e){}}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-hrm]");if(b){holdRemove(b.dataset.hrm);_bk="";bagUI();if(useId)useUI("")}});

// ================= ficha del Pokémon (vista ampliada) =================
function fichaHTML(n){
  if(!(S.owned[n]>0))return "";const nt=natOf(n),N=NAT[nt],h=heldOf(n),alt=(S.natAlt&&S.natAlt[n])||[],bz=busyTxt(n);
  const inv=HOLD.filter(x=>S.bag[x[0]]>0||x[0]===h);
  return '<div class="fich">'+
    '<div class="fichr"><label for="fNick">Mote</label><div class="fichin"><input id="fNick" maxlength="12" placeholder="'+esc(n)+'" value="'+esc((S.mote&&S.mote[n])||"")+'"><button data-fnk="'+esc(n)+'">Guardar</button></div></div>'+
    '<div class="fichr"><span>Favorito</span><button class="ffav'+(isFav(n)?' on':'')+'" data-ffv="'+esc(n)+'" aria-pressed="'+isFav(n)+'">'+(isFav(n)?'⭐ Es favorito':'☆ Marcar como favorito')+'</button></div>'+
    '<div class="fichr"><span>Naturaleza</span><div><b>'+N[0]+'</b> <small class="mut">'+natTxt(nt)+'</small>'+
      (alt.length?'<div class="fnat"><small>Tus repetidos traían otras naturalezas. Puedes cambiarla:</small>'+alt.map(x=>'<button class="alt mini" data-fnt="'+x+'" data-fn="'+esc(n)+'" title="'+esc(natTxt(x))+'">'+NAT[x][0]+(NAT[x][1]?' <small>+'+NSTAT[NAT[x][1]].slice(0,3)+' −'+NSTAT[NAT[x][2]].slice(0,3)+'</small>':' <small>neutra</small>')+'</button>').join("")+'</div>':'')+'</div></div>'+
    '<div class="fichr"><span>Objeto</span><div class="fichin"><select id="fHeld" data-fn="'+esc(n)+'"><option value="">— Ninguno —</option>'+inv.map(x=>'<option value="'+x[0]+'"'+(x[0]===h?' selected':'')+'>'+x[1]+(x[0]===h?' (equipado)':' ×'+S.bag[x[0]])+'</option>').join("")+'</select></div></div>'+
    (h?'<small class="mut fichd">'+itemIco(h,20)+' '+esc(HOLDK[h][3])+'</small>':(!inv.length?'<small class="mut fichd">No tienes objetos equipables. Cómpralos en la Tienda o consíguelos en la Torre Batalla y las expediciones.</small>':''))+
    (bz?'<small class="fichb">📍 Ahora mismo está '+bz+'.</small>':'')+
  '</div>';
}
{const _pv=pkView;pkView=function(n,sh){_pv(n,sh);try{const w=document.querySelector("#pkv .pkvw");if(!w)return;const c=w.querySelector(".pkvcry");if(S.owned[n]>0){
  const t=w.querySelector("h3");if(t&&S.mote&&S.mote[n])t.innerHTML=(sh?"✨ ":"")+esc(S.mote[n])+' <small class="mut">('+esc(n)+')</small>';
  const d=document.createElement("div");d.innerHTML=fichaHTML(n);if(c)c.before(d.firstChild);else w.appendChild(d.firstChild)}}catch(e){console.error(e)}}}
function fichaRefresh(n){const m=$("pkv");if(!m||m.hidden)return;const sh=!!m.querySelector(".pkvw.shiny");pkView(n,sh);const w=m.querySelector(".pkvw");if(w)w.getAnimations().forEach(a=>a.finish())}
document.addEventListener("click",e=>{
  const c=e.target.closest&&e.target.closest("#dex .card[data-dn]");if(c){snd("ui");pkView(c.dataset.dn,!!(S.shiny&&S.shiny[c.dataset.dn]));return}
  const b=e.target.closest&&e.target.closest("#pkv button");if(!b)return;
  if(b.dataset.fnk){const n=b.dataset.fnk,v=String($("fNick").value||"").replace(/[<>]/g,"").trim().slice(0,12);S.mote=S.mote||{};if(v&&v!==n)S.mote[n]=v;else delete S.mote[n];save();render();snd("ui");toast(v&&v!==n?"✏️ Ahora se llama "+v:"✏️ Mote quitado");fichaRefresh(n)}
  else if(b.dataset.ffv){const n=b.dataset.ffv;S.fav=S.fav||{};if(S.fav[n])delete S.fav[n];else S.fav[n]=1;save();render();snd(S.fav[n]?"buff":"ui");fichaRefresh(n)}
  else if(b.dataset.fnt!=null){const n=b.dataset.fn,x=+b.dataset.fnt,L=(S.natAlt&&S.natAlt[n])||[];if(!L.includes(x))return;if(fcd){toast("Termina el combate antes de cambiar la naturaleza.");return}const old=natOf(n);S.nat[n]=x;L.splice(L.indexOf(x),1,old);snd("lvl");save();toast("🌿 "+nk(n)+" ahora tiene naturaleza "+NAT[x][0]);fichaRefresh(n)}
});
document.addEventListener("change",e=>{if(e.target&&e.target.id==="fHeld"){const n=e.target.dataset.fn,v=e.target.value;if(fcd){toast("Termina el combate antes de cambiar objetos.");fichaRefresh(n);return}if(!v)holdRemove(n);else{const r=holdEquip(n,v);if(r)toast(r)}_bk="";try{bagUI()}catch(x){}fichaRefresh(n)}});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target&&e.target.id==="fNick"){const b=document.querySelector("#pkv [data-fnk]");if(b)b.click()}});

// ================= paneles nuevos dentro del menú =================
function nxPanel(id,title,intro){let p=$(id);if(!p){p=document.createElement("section");p.className="panel nxp";p.id=id;p.innerHTML='<h2>'+title+'</h2>'+(intro?'<p class="mut nxi">'+intro+'</p>':'')+'<div id="'+id+'B"></div>';hubStore().appendChild(p)}return p}
nxPanel("dcP","🥚 Guardería Pokémon","Deja dos Pokémon compatibles (del mismo tipo, o cualquiera con Ditto) y cada 30 minutos encontrarás un huevo. Los huevos eclosionan tras unos combates o, si no, con el tiempo.");
nxPanel("safP","🌾 Zona Safari","Una salida gratis al día con 20 Safari Balls. Aquí no se combate: lanza cebo para que no huyan, rocas para que sean más fáciles de atrapar, ¡y apunta bien!");
nxPanel("twP","🗼 Torre Batalla","Combates seguidos contra entrenadores cada vez más fuertes. Tu equipo se cura antes de cada combate. Si pierdes, la racha vuelve a empezar. Cada victoria da Puntos Torre (PT).");
nxPanel("expP","🧭 Expediciones","Manda a los Pokémon que no usas a explorar. Vuelven con tickets, objetos y experiencia. Si su tipo encaja con el lugar, traen más.");
nxPanel("hofP","🏛️ Salón de la Fama","Cada vez que ganas una Liga Pokémon tu equipo queda registrado aquí para siempre, y los demás jugadores pueden verlo en tu perfil.");
{const g=HUB.find(x=>x.k==="adv");if(g&&!g.tabs.some(t=>t[0]==="hofP")){g.tabs.push(["hofP","Salón de la Fama"]);g.d="Gimnasios, Liga y Salón de la Fama"}}
if(!HUB.some(x=>x.k==="act"))HUB.splice(HUB.findIndex(x=>x.k==="adv")+1,0,{k:"act",n:"Actividades",ic:"🎪",c:"#e0782a",d:"Guardería, Safari, Torre y expediciones",tabs:[["dcP","Guardería"],["safP","Zona Safari"],["twP","Torre Batalla"],["expP","Expediciones"]]});
HUB.forEach(g=>g.tabs.forEach(t=>{HUBP[t[0]]=g.k}));
Object.assign(HUBR,{dcP:()=>dcUI(true),safP:()=>safUI(),twP:()=>twUI(),expP:()=>expUI(true),hofP:()=>hofUI(true)});
{const _hb=hubBadges;hubBadges=function(){const o=_hb();let a=0;try{a+=dcEggReady()?1:0;a+=(S.eggs||[]).filter(eggDone).length;a+=(S.exp||[]).filter(x=>Date.now()>=x.t0+x.dur).length;if((S.saf||{}).d!==today())a+=1}catch(e){}if(a)o.act=a;try{const g=(GF.inc||[]).length;if(g)o.soc=(o.soc|0)+g}catch(e){}return o}}
const nxOpen=id=>{const p=$(id);return !!(p&&p.isConnected&&p.closest("#hubB"))};

// ================= GUARDERÍA =================
const PREV={};Object.keys(GD.EV).forEach(n=>(GD.EV[n]||[]).forEach(e=>{if(PM[e[0]]&&PM[n]&&!PREV[e[0]])PREV[e[0]]=n}));
function eggBase(n){let b=n,g=0;while(PREV[b]&&g++<5)b=PREV[b];return b}
const DC_T=30*60e3,EGG_T=3*3600e3;
function dcOk(a,b){if(!a||!b||a===b||!PM[a]||!PM[b])return false;const A=PM[a],B2=PM[b];if(/[LM]/.test(A[2])||/[LM]/.test(B2[2]))return false;if(a==="Ditto"&&b==="Ditto")return false;return a==="Ditto"||b==="Ditto"||A[1]===B2[1]}
function dcClean(){const d=S.dc;if(!d)return;["a","b"].forEach(k=>{if(d[k]&&!(S.owned[d[k]]>0))d[k]=""});if(!dcOk(d.a,d.b))d.t=0;else if(!d.t)d.t=Date.now()}
const dcEggReady=()=>{const d=S.dc;return !!(d&&dcOk(d.a,d.b)&&d.t&&Date.now()-d.t>=DC_T)};
const eggNeed=n=>({C:4,R:5,E:7}[PM[n]?PM[n][2]:"C"]||5);
const eggDone=g=>g.st>=g.need||Date.now()-g.at>=EGG_T;
function dcPut(slot,n){if(fcd){toast("Termina el combate primero.");return}S.dc=S.dc||{a:"",b:"",t:0};if(n&&S.team.includes(n)){toast("Ese Pokémon está en tu equipo. Sácalo del equipo antes de dejarlo en la Guardería.");return}if(n&&busyMon(n)){toast("Ese Pokémon está "+busyTxt(n)+".");return}S.dc[slot]=n||"";S.dc.t=dcOk(S.dc.a,S.dc.b)?Date.now():0;save();dcUI(true)}
function dcTake(){if(!dcEggReady())return;if((S.eggs||[]).length>=6){toast("Ya llevas 6 huevos. Haz que eclosione alguno antes.");return}
  const d=S.dc,par=d.a==="Ditto"?d.b:d.a,sp=eggBase(par);
  const nt=Math.random()<.5?natOf(Math.random()<.5?d.a:d.b):Math.floor(Math.random()*NAT.length);
  S.eggs=S.eggs||[];S.eggs.push({s:sp,st:0,need:eggNeed(sp),at:Date.now(),sh:Math.random()<1/120?1:0,nt:nt});d.t=Date.now();save();snd("pop");toast("🥚 ¡Has recogido un huevo!");dcUI(true)}
let _dck="";
function dcUI(force){
  const box=$("dcPB");if(!box)return;dcClean();const d=S.dc||{a:"",b:"",t:0},ok=dcOk(d.a,d.b),eggs=S.eggs||[];
  const key=JSON.stringify([d,eggs,NX.dcq||"",NX.dcs||"",dcEggReady(),eggs.map(eggDone)]);if(!force&&key===_dck){dcTick();return}_dck=key;
  const slot=k=>{const n=d[k];return '<div class="dcs'+(n?' on':'')+'">'+(n?'<div class="dcspr">'+ico(PM[n],72,false,!!(S.shiny&&S.shiny[n]))+'</div><b>'+esc(nk(n))+'</b><small class="mut">'+tyTxt(PM[n])+' · Nv'+lvd(n).l+'</small><button class="alt mini" data-dcx="'+k+'">Recoger</button>':'<div class="dcplus">＋</div><b>Hueco libre</b><button class="mini" data-dcp="'+k+'">Elegir Pokémon</button>')+'</div>'};
  let h='<div class="dcrow">'+slot("a")+'<div class="dcmid">'+(d.a&&d.b?(ok?'<span class="dcheart">💞</span><small>Se llevan muy bien</small>':'<span class="dcheart">💔</span><small>'+(/[LM]/.test(PM[d.a][2]+PM[d.b][2])?'Los legendarios y las formas especiales no ponen huevos':'No son compatibles (necesitan el mismo tipo, o que uno sea Ditto)')+'</small>'):'<span class="dcheart off">🤍</span><small>Deja dos Pokémon</small>')+'</div>'+slot("b")+'</div>';
  if(ok){h+='<div class="dcegg">'+(dcEggReady()?'<span class="egg big wob"></span><div><b>¡El encargado ha encontrado un huevo!</b><small class="mut">No sabe de dónde ha salido…</small></div><button class="red" data-dct="1">Recoger huevo</button>':'<span class="egg big"></span><div><b>Esperando un huevo…</b><small class="mut" id="dcLeft"></small><div class="nxbar"><i id="dcBar"></i></div></div>')+'</div>'}
  if(NX.dcs){const q=nrm(NX.dcq||""),other=d[NX.dcs==="a"?"b":"a"];
    const L=P.filter(p=>S.owned[p[0]]>0&&!/[LM]/.test(p[2])&&p[0]!==other&&!S.team.includes(p[0])&&!busyMon(p[0])&&(!q||nrm(p[0]).includes(q)||nrm(nk(p[0])).includes(q))).sort((a,b)=>(other?(dcOk(b[0],other)-dcOk(a[0],other)):0)||lvd(b[0]).l-lvd(a[0]).l).slice(0,90);
    h+='<div class="nxpick"><div class="sets-row"><input id="dcQ" placeholder="Buscar Pokémon..." value="'+esc(NX.dcq||"")+'" aria-label="Buscar Pokémon"><button class="alt" data-dcc="1">Cancelar</button></div><small class="mut">'+(other?'Arriba salen los compatibles con '+esc(nk(other))+'. ':'')+'No aparecen los de tu equipo ni los legendarios.</small><div class="nxgrid">'+(L.length?L.map(p=>'<button class="nxcell'+(other&&dcOk(p[0],other)?' good':'')+'" data-dcn="'+esc(p[0])+'">'+ico(p,48)+'<b>'+esc(nk(p[0]))+'</b><small>Nv'+lvd(p[0]).l+' · '+EM[p[1]]+'</small></button>').join(""):'<small class="mut">No hay Pokémon disponibles.</small>')+'</div></div>'}
  h+='<h3 class="shh">🥚 Tus huevos ('+eggs.length+'/6)</h3>'+(eggs.length?'<div class="eggl">'+eggs.map((g,i)=>{const dn=eggDone(g),left=Math.max(0,g.need-g.st);return '<div class="eggc'+(dn?' ready':'')+'"><span class="egg'+(dn?' wob':'')+'"></span><b>'+(dn?'¡Se mueve!':'Huevo')+'</b><small class="mut">'+(dn?'Está a punto de eclosionar':left+' combate'+(left===1?'':'s')+' o '+H2((g.at+EGG_T-Date.now())/1000))+'</small>'+(dn?'<button class="red mini" data-dch="'+i+'">¡Eclosionar!</button>':'<div class="nxbar"><i style="width:'+Math.min(100,Math.max(g.st/g.need,(Date.now()-g.at)/EGG_T)*100)+'%"></i></div>')+'</div>'}).join("")+'</div>':'<small class="mut">Todavía no tienes huevos.</small>');
  box.innerHTML=h;const q=$("dcQ");if(q){q.oninput=()=>{NX.dcq=q.value;const pos=q.selectionStart;dcUI(true);const q2=$("dcQ");if(q2){q2.focus();try{q2.setSelectionRange(pos,pos)}catch(e){}}}}
  dcTick();
}
function dcTick(){const d=S.dc;if(!d||!dcOk(d.a,d.b)||!d.t)return;const el=$("dcLeft"),b=$("dcBar"),r=DC_T-(Date.now()-d.t);if(r<=0){if(el)dcUI(true);return}if(el)el.textContent="Faltan "+H2(r/1000);if(b)b.style.width=Math.min(100,(1-r/DC_T)*100)+"%"}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#dcPB button");if(!b)return;const d=b.dataset;
  if(d.dcp){NX.dcs=d.dcp;NX.dcq="";dcUI(true);snd("ui")}else if(d.dcc){NX.dcs="";dcUI(true)}else if(d.dcn){const s=NX.dcs;NX.dcs="";dcPut(s,d.dcn);snd("ui")}
  else if(d.dcx){dcPut(d.dcx,"")}else if(d.dct){dcTake()}else if(d.dch!=null)eggHatch(+d.dch)});
async function eggHatch(i){
  const g=(S.eggs||[])[i];if(!g||!eggDone(g)||NX.hatching)return;if(fcd){toast("Termina el combate primero.");return}NX.hatching=1;
  S.eggs.splice(i,1);const n=g.s,had=S.owned[n]>0,isNew=giveMon(n,5,g.sh);
  S.nat=S.nat||{};if(!had)S.nat[n]=g.nt|0;else if((g.nt|0)!==natOf(n)){S.natAlt=S.natAlt||{};const L=S.natAlt[n]=S.natAlt[n]||[];if(!L.includes(g.nt|0))L.push(g.nt|0);while(L.length>6)L.shift()}
  natSync(n);
  qEv("cap");save();
  const m=nxModal('<div class="hatch"><span class="egg huge"></span></div><h3 id="hT">¿Eh…?</h3><p class="mut" id="hD">¡El huevo se está moviendo!</p><button id="hOk" hidden>¡Genial!</button>');
  const egg=m.querySelector(".egg"),calm=hubCalm();
  if(!calm){for(let k=0;k<3;k++){snd("click");await egg.animate([{transform:"rotate(0)"},{transform:"rotate(-16deg)"},{transform:"rotate(14deg)"},{transform:"rotate(0)"}],{duration:520+k*80,easing:"ease-in-out"}).finished;egg.classList.add("c"+(k+1));await sleep(260)}
    snd("flash");const f=document.createElement("div");f.className="hflash";m.querySelector(".hatch").appendChild(f);await f.animate([{opacity:0,transform:"scale(.2)"},{opacity:1,transform:"scale(1.6)"},{opacity:0,transform:"scale(2.4)"}],{duration:700,easing:"ease-out"}).finished;f.remove()}
  m.querySelector(".hatch").innerHTML='<div class="hmon">'+ico(PM[n],120,false,!!g.sh)+'</div>';snd("lvl");setTimeout(()=>{try{cry(n)}catch(e){}},200);
  $("hT").textContent=(g.sh?"✨ ":"")+"¡Ha nacido "+n+"!";
  $("hD").innerHTML=(isNew?'<b>¡Nuevo en tu Pokédex!</b> ':'')+(g.sh?'<b>¡Es variocolor!</b> ':'')+'Naturaleza '+NAT[g.nt|0][0]+(had&&g.nt!==natOf(n)?' (como ya lo tenías, puedes elegir esta naturaleza en su ficha)':'')+'.';
  const ok=$("hOk");ok.hidden=false;ok.focus();await new Promise(r=>{ok.onclick=r});nxModalClose();NX.hatching=0;render();dcUI(true);
}
function nxModal(html){let m=$("nxM");if(!m){m=document.createElement("div");m.id="nxM";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");document.body.appendChild(m)}m.innerHTML='<div class="nxmw">'+html+'</div>';m.hidden=false;m.querySelector(".nxmw").animate([{transform:"scale(.7)",opacity:0},{transform:"none",opacity:1}],{duration:260,easing:"cubic-bezier(.2,.9,.3,1.2)"});return m}
function nxModalClose(){const m=$("nxM");if(m)m.hidden=true}

// ================= ZONA SAFARI =================
const SAF_EXTRA=750000;
function safPick(){const x=Math.random()*100,r=x<3?"L":x<23?"E":x<60?"R":"C",pool=P.filter(p=>p[2]===r);return pool[Math.floor(Math.random()*pool.length)]}
function safNew(){const p=safPick(),s=S.saf.s;s.enc={n:p[0],sh:Math.random()<SHINY_W*2?1:0,eat:0,ang:0,turns:0};s.msg="¡Ha aparecido "+p[0]+" salvaje!";snd("wild")}
function safStart(paid){
  if(fcd){toast("Termina el combate primero.");return}S.saf=S.saf||{};
  if(S.saf.s){safUI();return}
  if(paid){if(S.t<SAF_EXTRA){toast("Te faltan tickets.");return}S.t-=SAF_EXTRA}else{if(S.saf.d===today())return;S.saf.d=today()}
  S.saf.s={balls:20,caught:[],seen:0,msg:""};safNew();S.saf.s.seen=1;save();render();safUI();
}
const SAF_C={C:.45,R:.32,E:.2,L:.08},SAF_F={C:.08,R:.12,E:.18,L:.28};
async function safAct(a){
  const s=S.saf&&S.saf.s;if(!s||!s.enc||NX.safBusy)return;const e=s.enc,p=PM[e.n],r=p[2];NX.safBusy=1;
  const box=document.querySelector("#safPB .safmon"),spr=box&&box.querySelector(".safspr");
  try{
  if(a==="run"){s.msg="Te has alejado de "+e.n+".";snd("flee");await safNext(s);return}
  if(a==="bait"){e.eat=1+Math.floor(Math.random()*3);e.ang=0;s.msg="¡"+e.n+" está comiendo el cebo!";snd("pop");if(spr)spr.animate([{transform:"none"},{transform:"translateY(-6px) scale(1.04)"},{transform:"none"}],{duration:500,iterations:2})}
  else if(a==="rock"){e.ang=1+Math.floor(Math.random()*3);e.eat=0;s.msg="¡"+e.n+" se ha enfadado!";snd("hit",1);if(spr)spr.animate([{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"none"}],{duration:200,iterations:3})}
  else if(a==="ball"){
    if(s.balls<=0)return;s.balls--;snd("throw");
    let c=SAF_C[r]*(e.ang?1.8:1)*(e.eat?.75:1);c=Math.min(.95,c);const ok=Math.random()<c,sh=ok?3:Math.random()<c*1.6?2:Math.random()<.5?1:0;
    if(box&&!hubCalm()){const b=document.createElement("span");b.className="safball";box.appendChild(b);await b.animate([{transform:"translate(-160px,140px) scale(.6) rotate(0)"},{transform:"translate(-60px,-40px) scale(.9) rotate(360deg)",offset:.55},{transform:"translate(0,0) scale(1) rotate(720deg)"}],{duration:520,easing:"cubic-bezier(.3,.6,.4,1)"}).finished;
      if(spr)spr.style.opacity=0;snd("open");
      for(let k=0;k<sh;k++){await sleep(220);snd("click");await b.animate([{transform:"rotate(0)"},{transform:"rotate(-22deg)"},{transform:"rotate(18deg)"},{transform:"rotate(0)"}],{duration:420}).finished}
      await sleep(250);if(!ok){b.remove();if(spr){spr.style.opacity=1;spr.animate([{transform:"scale(.3)",opacity:.3},{transform:"none",opacity:1}],{duration:260})}}else{b.classList.add("ok");snd("capok")}}
    if(ok){const lv=clampL(Math.min(lvCap(),leadLevel())-1),isNew=giveMon(e.n,lv,e.sh);qEv("cap");s.caught.push({n:e.n,sh:e.sh,nw:isNew?1:0});s.msg="¡Has atrapado a "+(e.sh?"✨ ":"")+e.n+"!"+(isNew?" ¡Nuevo en tu Pokédex!":"");save();render();await sleep(hubCalm()?0:500);await safNext(s,1);return}
    snd("capfail");s.msg=["¡Oh, no! ¡Se ha escapado!","¡Vaya! ¡Parecía que lo tenías!","¡Casi lo consigues!","¡Qué rabia! ¡Por muy poco!"][sh];
  }
  e.turns++;
  const fl=Math.min(.9,SAF_F[r]*(e.ang?1.7:1)*(e.eat?.45:1)+e.turns*.01);if(e.eat)e.eat--;if(e.ang)e.ang--;
  if(Math.random()<fl){s.msg+=" ¡"+e.n+" ha huido!";snd("flee");if(spr&&!hubCalm())await spr.animate([{transform:"none",opacity:1},{transform:"translateX(120px)",opacity:0}],{duration:420}).finished;await safNext(s);return}
  if(s.balls<=0){await safNext(s);return}
  save();safUI();
  }finally{NX.safBusy=0}
}
async function safNext(s,caught){
  if(s.balls<=0){s.enc=null;s.end=1;save();safUI();snd(s.caught.length?"win":"ui");return}
  await sleep(hubCalm()?0:350);const m=s.msg;safNew();s.seen++;s.msg=m+" · "+s.msg;save();safUI();
}
function safEnd(){const s=S.saf&&S.saf.s;if(!s)return;S.saf.s=null;save();safUI();toast("🌾 Salida terminada: "+s.caught.length+" capturado"+(s.caught.length===1?"":"s"))}
function safUI(){
  const box=$("safPB");if(!box)return;S.saf=S.saf||{};const s=S.saf.s,free=S.saf.d!==today();let h="";
  if(!s){h='<div class="safin"><div class="safgate">🌾</div><div><b>'+(free?'¡Tu salida de hoy está disponible!':'Ya has hecho tu salida gratis de hoy')+'</b><small class="mut">'+(free?'Entra gratis una vez al día.':'Vuelve mañana o paga una entrada extra.')+'</small></div>'+(free?'<button class="red" data-saf="go">Entrar gratis</button>':'<button data-saf="pay"'+(S.t<SAF_EXTRA?' disabled':'')+'>Entrada extra · '+fmt(SAF_EXTRA)+' 🎟️</button>')+'</div>'+
    '<small class="mut">Probabilidades: Común 40% · Raro 37% · Épico 20% · Legendario 3%. Los Pokémon que atrapes llegan con el nivel de tu equipo (sin pasar el límite del próximo gimnasio).</small>'}
  else if(s.end||!s.enc){h='<div class="safsum"><b>📢 «¡Ding-dong! Se han acabado tus Safari Balls.»</b><p>Has visto '+s.seen+' Pokémon y has atrapado '+s.caught.length+'.</p>'+(s.caught.length?'<div class="safcl">'+s.caught.map(c=>'<span title="'+esc(c.n)+'">'+ico(PM[c.n],46,false,!!c.sh)+(c.nw?'<i>NUEVO</i>':'')+'</span>').join("")+'</div>':'')+'<button class="red" data-saf="end">Salir de la Zona Safari</button></div>'}
  else{const e=s.enc,p=PM[e.n];
    h='<div class="safbar"><span>🔴 Safari Balls: <b>'+s.balls+'</b></span><span>👀 Vistos: <b>'+s.seen+'</b></span><span>🎒 Atrapados: <b>'+s.caught.length+'</b></span></div>'+
    '<div class="safmon"><div class="safgr"></div><div class="safspr">'+ico(p,128,false,!!e.sh)+'</div><div class="safname">'+(e.sh?"✨ ":"")+esc(e.n)+' <small>'+STAR[p[2]]+' · '+EM[p[1]]+'</small>'+(e.eat?' <span class="safst eat">🍓 Comiendo</span>':'')+(e.ang?' <span class="safst ang">💢 Enfadado</span>':'')+'</div></div>'+
    '<p class="safmsg">'+esc(s.msg||"")+'</p>'+
    '<div class="safbtn"><button class="red" data-saf="ball">🔴 Safari Ball</button><button data-saf="bait">🍓 Cebo</button><button data-saf="rock">🪨 Roca</button><button class="alt" data-saf="run">🏃 Huir</button></div>'+
    '<small class="mut">🍓 El cebo hace que huya menos (pero cuesta un poco más atraparlo). 🪨 La roca lo hace más fácil de atrapar, pero huye antes.</small>'+(s.caught.length?'<div class="safcl">'+s.caught.map(c=>'<span>'+ico(PM[c.n],36,false,!!c.sh)+'</span>').join("")+'</div>':'')}
  box.innerHTML=h;
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#safPB [data-saf]");if(!b)return;const a=b.dataset.saf;if(a==="go")safStart(false);else if(a==="pay")safStart(true);else if(a==="end")safEnd();else safAct(a)});

// ================= TORRE BATALLA =================
const TW_SHOP=[["left",8],["lorb",12],["sash",10],["sitrus",4],["lum",5],["qclaw",7],["scope",7],["shell",8],["lucky",9],["cand",15],["ppmax",10],["mb",60]];
function twTeam(k){
  const boss=k%10===9,lv=twLv(k),n=boss?4:3;
  const w=k<5?{C:5,R:4,E:1}:k<15?{C:2,R:5,E:3}:k<30?{C:1,R:4,E:4,M:1}:{R:3,E:5,M:2};
  const out=[];
  if(boss){const L=P.filter(p=>p[2]==="L");out.push(L[Math.floor(Math.random()*L.length)])}
  while(out.length<n){let t=Object.values(w).reduce((a,b)=>a+b,0),x=Math.random()*t,r="C";for(const q in w){x-=w[q];if(x<=0){r=q;break}}const pl=P.filter(p=>p[2]===r);const p=pl[Math.floor(Math.random()*pl.length)];if(p&&!out.includes(p))out.push(p)}
  return out.map((p,i)=>monX(mkEnemy(p,clampL(lv+(i===out.length-1?1:0))),Math.floor(Math.random()*NAT.length),k>=8&&Math.random()<.5?HOLD[Math.floor(Math.random()*HOLD.length)][0]:""));
}
function twLv(k){const L=(S.team||[]).filter(n=>n&&S.owned[n]).map(n=>lvd(n).l),a=L.length?L.reduce((x,y)=>x+y,0)/L.length:5;return clampL(Math.max(3,a-4)+Math.floor(k/2)+(k%10===9?3:0))}
function twGo(){
  if(fcd||busy){toast("Termina lo que estás haciendo primero.");return}
  const names=(S.team||[]).filter(n=>n&&S.owned[n]);if(!names.length){toast("Necesitas un equipo para entrar en la Torre.");return}
  S.tw=S.tw||{cur:0,best:0,pts:0};const k=S.tw.cur,boss=k%10===9;
  names.forEach(n=>{delete S.hp[n]});save();
  const tr=TRAINERS[Math.floor(Math.random()*TRAINERS.length)],nm=boss?"As de la Torre":tr[0]+" de la Torre";
  hubClose();startBattle({eteam:twTeam(k),trainer:nm,tsrc:{k:boss?"acetrainer":tr[3],n:nm},tower:1});
}
async function afterBattle(res){
  if(B&&B.tower){S.tw=S.tw||{cur:0,best:0,pts:0};
    if(res==="win"){const k=S.tw.cur,boss=k%10===9,pt=(1+Math.floor(k/5))*(boss?3:1);S.tw.cur++;S.tw.best=Math.max(S.tw.best,S.tw.cur);S.tw.pts+=pt;(S.team||[]).forEach(n=>{if(n)delete S.hp[n]});
      await say("🗼 ¡Victoria nº "+S.tw.cur+" seguida en la Torre Batalla! +"+pt+" PT."+(boss?" ¡Has vencido al As de la Torre!":""));await say("Tu equipo se ha recuperado. ¡Puedes seguir subiendo desde la Torre Batalla!")}
    else{const c=S.tw.cur;S.tw.cur=0;await say("🗼 Tu racha en la Torre Batalla ha terminado con "+c+" victoria"+(c===1?"":"s")+". Récord: "+S.tw.best+".")}
  }
  // los huevos avanzan con cada combate
  if(res!=="flee"&&(S.eggs||[]).length){let r=0;S.eggs.forEach(g=>{const was=eggDone(g);g.st++;if(!was&&eggDone(g))r++});if(r)await say("🥚 ¡"+(r>1?"Algunos huevos se mueven":"Un huevo se mueve")+"! Ve a la Guardería para verlo eclosionar.")}
}
function twUI(){
  const box=$("twPB");if(!box)return;const t=S.tw=S.tw||{cur:0,best:0,pts:0},k=t.cur,boss=k%10===9,lv=twLv(k);
  box.innerHTML='<div class="twtop"><div class="twst"><span>🔥</span><b>'+t.cur+'</b><small>Racha actual</small></div><div class="twst"><span>🏆</span><b>'+t.best+'</b><small>Récord</small></div><div class="twst"><span>🪙</span><b>'+t.pts+'</b><small>Puntos Torre</small></div></div>'+
    '<div class="twnext'+(boss?' boss':'')+'"><div><b>'+(boss?'👑 ¡Combate contra el As de la Torre!':'Combate nº '+(k+1))+'</b><small class="mut">'+(boss?'4 Pokémon, uno de ellos legendario':'3 Pokémon')+' · alrededor del Nv'+lv+(k>=8?' · algunos llevan objetos':'')+'</small></div><button class="red" data-tw="go"'+(fcd?' disabled':'')+'>⚔️ Combatir</button></div>'+
    '<h3 class="shh">🪙 Tienda de la Torre</h3><div class="twshop">'+TW_SHOP.map(x=>'<div class="twit"><span class="iico">'+itemIco(x[0],36)+'</span><div><b>'+IN2(x[0])+'</b><small class="mut">Tienes ×'+(S.bag[x[0]]||0)+'</small></div><button data-twb="'+x[0]+'"'+(t.pts<x[1]?' disabled':'')+'>'+x[1]+' PT</button></div>').join("")+'</div>';
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#twPB button");if(!b)return;
  if(b.dataset.tw==="go")twGo();
  else if(b.dataset.twb){const x=TW_SHOP.find(q=>q[0]===b.dataset.twb),t=S.tw;if(!x||!t||t.pts<x[1])return;t.pts-=x[1];S.bag[x[0]]=(S.bag[x[0]]||0)+1;save();snd("ui");toast("🪙 Has conseguido "+IN2(x[0]));render();twUI()}});

// ================= EXPEDICIONES =================
const DEST=[["🌲","Bosque Verde",["grass","bug","normal","fairy"]],["⛰️","Cueva Celeste",["rock","ground","fighting","steel"]],["🌊","Playa Marina",["water","ice","flying"]],["🌋","Volcán Ardiente",["fire","dragon","dark","poison"]],["🌌","Torre Misteriosa",["ghost","psychic","electric","normal"]]];
const EXD=[[3600e3,"1 hora",1],[4*3600e3,"4 horas",4.5],[8*3600e3,"8 horas",10]];
function expSend(){
  const n=NX.exn,d=NX.exd|0,u=NX.exu|0;if(!n||!(S.owned[n]>0))return;S.exp=S.exp||[];if(S.exp.length>=3){toast("Ya tienes 3 expediciones en marcha.");return}
  if(S.team.includes(n)){toast("Ese Pokémon está en tu equipo.");return}if(busyMon(n)){toast("Ese Pokémon está "+busyTxt(n)+".");return}
  S.exp.push({n:n,d:d,u:u,t0:Date.now(),dur:EXD[u][0]});NX.exn="";NX.exq="";save();snd("throw");toast("🧭 "+nk(n)+" se ha ido a "+DEST[d][1]);expUI(true);
}
function expClaim(i){
  const x=(S.exp||[])[i];if(!x||Date.now()<x.t0+x.dur)return;if(fcd){toast("Termina el combate primero.");return}
  const n=x.n,p=PM[n];S.exp.splice(i,1);if(!p||!(S.owned[n]>0)){save();expUI(true);return}
  const m=EXD[x.u][2],match=DEST[x.d][2].includes(p[1]),k=m*(match?1.5:1),l=lvd(n).l,rw={t:Math.round((6000+l*700)*WW[p[2]]*k),it:{}},got=[];
  const add=(id,q)=>{rw.it[id]=(rw.it[id]||0)+q};
  for(let j=0;j<Math.ceil(m);j++){const r=Math.random();if(r<.35)add("pb",1);else if(r<.55)add("sb",1);else if(r<.65)add("ub",1);else if(r<.8)add("pot",1);else if(r<.9)add("spot",1);else add("eter",1)}
  if(Math.random()<.06*k)add("cand",1);
  if(Math.random()<.05*k){const ev=ITEMS.filter(q=>q[7]==="evo");add(ev[Math.floor(Math.random()*ev.length)][0],1)}
  if(Math.random()<.04*k)add(HOLD[Math.floor(Math.random()*HOLD.length)][0],1);
  grant(rw);
  // experiencia (sin pasar el límite del próximo gimnasio)
  const d=lvd(n),cap=lvCap(),l0=d.l;let xp=Math.round((30+l*8)*k);if(heldOf(n)==="lucky")xp=Math.round(xp*1.5);
  if(d.l<cap){d.x+=xp;while(d.l<cap&&d.x>=need(d.l)){d.x-=need(d.l);d.l++;qEv("lvl")}if(d.l>=cap)d.x=0}
  save();render();snd("win");
  nxModal('<div class="exret">'+DEST[x.d][0]+'</div><div class="hmon">'+ico(p,96,false,!!(S.shiny&&S.shiny[n]))+'</div><h3>¡'+esc(nk(n))+' ha vuelto de '+DEST[x.d][1]+'!</h3>'+(match?'<small class="exm">✨ Su tipo encajaba con el lugar: ¡ha traído un 50% más!</small>':'')+
    '<p>Ha traído: <b>'+rwTxt(rw)+'</b></p><p class="mut">'+(d.l>l0?'¡Ha subido de Nv'+l0+' a Nv'+d.l+'!':d.l>=cap&&cap<100?'Está en el límite de nivel (Nv'+cap+') y no gana experiencia. '+capWhy():'Ha ganado '+fmt(xp)+' puntos de experiencia.')+'</p><button id="exOk">¡Genial!</button>');
  $("exOk").onclick=()=>{nxModalClose();if(d.l>l0&&evoLvReady(n).length)toast("🧬 ¡"+nk(n)+" ya puede evolucionar! Míralo en la Mochila.")};$("exOk").focus();expUI(true);
}
let _exk="";
function expUI(force){
  const box=$("expPB");if(!box)return;const L=S.exp||[];const key=JSON.stringify([L,NX.exn,NX.exd,NX.exu,NX.exq,L.map(x=>Date.now()>=x.t0+x.dur)]);if(!force&&key===_exk){expTick();return}_exk=key;
  let h='<div class="exsl">'+[0,1,2].map(i=>{const x=L[i];if(!x)return '<div class="exc empty"><span>🧭</span><b>Hueco libre</b><small class="mut">Elige un Pokémon abajo</small></div>';const dn=Date.now()>=x.t0+x.dur,p=PM[x.n];
    return '<div class="exc'+(dn?' done':'')+'"><div class="exspr">'+(p?ico(p,56):'')+'</div><b>'+esc(nk(x.n))+'</b><small>'+DEST[x.d][0]+' '+DEST[x.d][1]+'</small>'+(dn?'<button class="red mini" data-exc="'+i+'">Recoger</button>':'<small class="mut" data-ext="'+i+'"></small><div class="nxbar"><i data-exb="'+i+'"></i></div>')+'</div>'}).join("")+'</div>';
  if(L.length<3){const q=nrm(NX.exq||"");
    const C=P.filter(p=>S.owned[p[0]]>0&&!S.team.includes(p[0])&&!busyMon(p[0])&&(!q||nrm(p[0]).includes(q)||nrm(nk(p[0])).includes(q))).sort((a,b)=>lvd(b[0]).l-lvd(a[0]).l||WW[b[2]]-WW[a[2]]).slice(0,80);
    const d=NX.exd|0,u=NX.exu|0,sel=NX.exn&&PM[NX.exn]?PM[NX.exn]:null;
    h+='<h3 class="shh">Nueva expedición</h3><div class="exdest">'+DEST.map((x,i)=>'<button class="'+(i===d?'on':'')+'" data-exd="'+i+'"><span>'+x[0]+'</span><b>'+x[1]+'</b><small>'+x[2].map(t=>EM[t]).join(" ")+'</small></button>').join("")+'</div>'+
      '<div class="exdur">'+EXD.map((x,i)=>'<button class="'+(i===u?'on':'')+'" data-exu="'+i+'">⏱️ '+x[1]+'</button>').join("")+'</div>'+
      '<div class="sets-row"><input id="exQ" placeholder="Buscar Pokémon (no salen los de tu equipo)..." value="'+esc(NX.exq||"")+'" aria-label="Buscar Pokémon"></div>'+
      '<div class="nxgrid">'+(C.length?C.map(p=>'<button class="nxcell'+(NX.exn===p[0]?' sel':'')+(DEST[d][2].includes(p[1])?' good':'')+'" data-exn="'+esc(p[0])+'">'+ico(p,48)+'<b>'+esc(nk(p[0]))+'</b><small>Nv'+lvd(p[0]).l+' · '+EM[p[1]]+'</small></button>').join(""):'<small class="mut">No tienes Pokémon libres para mandar (los del equipo no pueden ir).</small>')+'</div>'+
      '<div class="exgo"><small class="mut">'+(sel?(DEST[d][2].includes(sel[1])?'✨ '+esc(nk(NX.exn))+' conoce bien este lugar: traerá un 50% más.':'Consejo: los Pokémon de tipo '+DEST[d][2].map(t=>TIPO[t]).join(", ")+' traen más de aquí.'):'Los marcados en verde conocen bien este lugar.')+'</small><button class="red" data-exgo="1"'+(sel?'':' disabled')+'>🧭 Enviar'+(sel?' a '+esc(nk(NX.exn)):'')+'</button></div>'}
  box.innerHTML=h;const q=$("exQ");if(q)q.oninput=()=>{NX.exq=q.value;const pos=q.selectionStart;expUI(true);const q2=$("exQ");if(q2){q2.focus();try{q2.setSelectionRange(pos,pos)}catch(e){}}};
  expTick();
}
function expTick(){(S.exp||[]).forEach((x,i)=>{const t=document.querySelector('#expPB [data-ext="'+i+'"]'),b=document.querySelector('#expPB [data-exb="'+i+'"]'),r=x.t0+x.dur-Date.now();if(r<=0){if(t)expUI(true);return}if(t)t.textContent="Vuelve en "+H2(r/1000);if(b)b.style.width=Math.min(100,(1-r/x.dur)*100)+"%"})}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#expPB button");if(!b)return;const d=b.dataset;
  if(d.exd!=null){NX.exd=+d.exd;expUI(true)}else if(d.exu!=null){NX.exu=+d.exu;expUI(true)}else if(d.exn){NX.exn=NX.exn===d.exn?"":d.exn;expUI(true);snd("ui")}else if(d.exgo)expSend();else if(d.exc!=null)expClaim(+d.exc)});
setInterval(()=>{try{if(nxOpen("dcP"))dcUI();if(nxOpen("expP"))expUI();}catch(e){}},1000);

// ================= SALÓN DE LA FAMA =================
{const _lw=leagueWin;leagueWin=async function(){const lg=S.lg,fin=lg&&lg.k>=4,li=lg?lg.li:0;await _lw.apply(this,arguments);if(fin&&!S.lg)await hofEnter(li)}}
async function hofEnter(li){
  const tm=(S.team||[]).filter(n=>n&&S.owned[n]).slice(0,6).map(n=>({n:n,l:lvd(n).l,s:S.shiny&&S.shiny[n]>0?1:0,k:S.mote&&S.mote[n]?S.mote[n]:""}));
  S.hof=S.hof||[];S.hof.push({at:Date.now(),lg:LEAGUES[li].n,tm:tm});while(S.hof.length>60)S.hof.shift();save();
  const m=nxModal('<div class="hofb">🏛️</div><h3>¡Bienvenido al Salón de la Fama!</h3><p class="mut">'+esc(LEAGUES[li].n)+' · '+new Date().toLocaleDateString("es")+'</p><div class="hoftm">'+tm.map(x=>'<div>'+ico(PM[x.n],64,false,!!x.s)+'<b>'+esc(x.k||x.n)+'</b><small>Nv'+x.l+'</small></div>').join("")+'</div><button id="hofOk">¡Qué orgullo!</button>');
  snd("win");if(!hubCalm())m.querySelectorAll(".hoftm>div").forEach((d,i)=>d.animate([{transform:"translateY(20px) scale(.6)",opacity:0},{transform:"none",opacity:1}],{duration:400,delay:150+i*160,fill:"backwards",easing:"cubic-bezier(.2,.9,.3,1.3)"}));
  await new Promise(r=>{$("hofOk").onclick=r});nxModalClose();
}
let _hofG=null,_hofAt=0;
async function hofUI(force){
  const box=$("hofPB");if(!box)return;const L=(S.hof||[]).slice().reverse();
  const row=(e,mine)=>'<div class="hofe"><div class="hofh"><b>'+(mine?'🏆 '+esc(e.lg):'👤 <span class="plink" data-prof="'+esc(e.id)+'">'+esc(pvClean(e.n||""))+'</span>')+'</b><small class="mut">'+(e.at?new Date(e.at).toLocaleDateString("es"):"")+(mine?'':' · '+(e.hof|0)+' entrada'+((e.hof|0)===1?'':'s'))+'</small></div><div class="hoftm sm">'+(e.tm||[]).filter(x=>x&&PM[x.n]).map(x=>'<div>'+ico(PM[x.n],48,false,!!x.s)+'<small>'+esc(x.k||x.n)+' · Nv'+(x.l|0)+'</small></div>').join("")+'</div></div>';
  let h='<h3 class="shh">Tus campeones ('+L.length+')</h3>'+(L.length?L.slice(0,20).map(e=>row(e,1)).join(""):'<small class="mut">Todavía no has ganado ninguna Liga. Gana las 8 medallas y desafía a una Liga Pokémon en Aventura.</small>');
  h+='<h3 class="shh">Últimos campeones del mundo</h3><div id="hofW">'+(_hofG?hofW():'<small class="mut">Cargando…</small>')+'</div>';
  box.innerHTML=h;
  if(window.FB&&window.FB.rankTop&&(force&&Date.now()-_hofAt>60e3||!_hofG)){_hofAt=Date.now();try{const r=await window.FB.rankTop("hfa",12);_hofG=r.filter(x=>Array.isArray(x.hft));}catch(e){_hofG=[]}const w=$("hofW");if(w)w.innerHTML=hofW()}
  else if(!window.FB){const w=$("hofW");if(w)w.innerHTML='<small class="mut">Inicia sesión para ver a los campeones de otros jugadores.</small>'}
  function hofW(){return _hofG&&_hofG.length?_hofG.map(x=>row({id:x.id,n:x.n,at:x.hfa,hof:x.hof,tm:x.hft},0)).join(""):'<small class="mut">Todavía nadie ha entrado en el Salón de la Fama. ¡Sé el primero!</small>'}
}
{const _rd=window.rankData;if(_rd)window.rankData=function(){const d=_rd();if(!d)return d;const L=S.hof||[];if(L.length){const e=L[L.length-1];d.hof=L.length;d.hfa=e.at;d.hft=e.tm.map(x=>({n:x.n,l:x.l,s:x.s,k:String(x.k||"").slice(0,12)}))}if(S.tw&&S.tw.best)d.tw=S.tw.best;return d}}

// ================= REGALOS ENTRE AMIGOS =================
var GF={inc:[]};
const GF_MAX=20;
function gfInit(){if(!window.FB||!window.FB.gfWatch||GF.on)return;GF.on=1;try{window.FB.gfWatch(l=>{GF.inc=l.filter(g=>g&&g.from&&g.d);_frk="";try{frUI()}catch(e){}})}catch(e){GF.on=0}}
setInterval(gfInit,3000);
function gfSentToday(u){const g=S.gfs;return !!(g&&g.d===today()&&g.u&&g.u[u])}
async function gfSend(u){
  if(!window.FB||!window.FB.gfSend)return;if(gfSentToday(u)){toast("Ya le has enviado un regalo hoy.");return}
  try{await window.FB.gfSend(u,pvNick(),today());S.gfs=S.gfs&&S.gfs.d===today()?S.gfs:{d:today(),u:{}};S.gfs.u[u]=1;save();snd("pop");toast("🎁 ¡Regalo enviado!");_frk="";frUI()}catch(e){toast("No se ha podido enviar el regalo. Inténtalo más tarde.")}
}
async function gfOpen(id){
  const g=GF.inc.find(x=>x.id===id);if(!g)return;S.gfo=S.gfo&&S.gfo.d===today()?S.gfo:{d:today(),n:0};
  if(S.gfo.n>=GF_MAX){toast("Ya has abierto "+GF_MAX+" regalos hoy. Los demás te esperan mañana.");return}
  try{await window.FB.gfDel(id)}catch(e){toast("No se ha podido abrir. Inténtalo más tarde.");return}
  GF.inc=GF.inc.filter(x=>x.id!==id);S.gfo.n++;
  const r=Math.random(),rw={t:0,it:{}};
  if(r<.55)rw.t=50000+Math.floor(Math.random()*250000);else if(r<.75)rw.it[Math.random()<.7?"sb":"ub"]=Math.random()<.5?2:1;else if(r<.92){const k=["pot","spot","eter","rev"][Math.floor(Math.random()*4)];rw.it[k]=2}else if(r<.98)rw.it[HOLD[Math.floor(Math.random()*HOLD.length)][0]]=1;else rw.it.cand=1;
  grant(rw);save();render();snd("lvl");
  nxModal('<div class="gfbox">🎁</div><h3>Regalo de '+esc(pvClean(g.fn||"un amigo"))+'</h3><p>¡Dentro había <b>'+rwTxt(rw)+'</b>!</p><small class="mut">Hoy has abierto '+S.gfo.n+'/'+GF_MAX+'. No olvides devolverle el detalle.</small><button id="gfOk">¡Gracias!</button>');
  $("gfOk").onclick=nxModalClose;$("gfOk").focus();_frk="";frUI();
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-gfs],[data-gfo],[data-gfall]");if(!b)return;
  if(b.dataset.gfs)gfSend(b.dataset.gfs);else if(b.dataset.gfo)gfOpen(b.dataset.gfo);else if(b.dataset.gfall){const ids=Object.keys(FR.l||{}).filter(u=>!gfSentToday(u));(async()=>{for(const u of ids)await gfSend(u)})()}});
