// =====================================================================================
// MENÚ PRINCIPAL DE EXPLORACIÓN (como en los juegos clásicos)
// Al pulsar «▶ Iniciar» se abre la ventana: Continuar · Partida nueva · Cargar partida · Borrar partida · Opciones.
// Hay 3 ranuras de guardado: la activa vive en S.ex / S.xg (como siempre) y las otras se guardan en S.exSl.d.
// Desde el menú del juego, «Salir al menú principal» vuelve a la pantalla de título.
// =====================================================================================
const SL_N=3;
function slD(){if(!S.exSl||typeof S.exSl!=="object")S.exSl={cur:1,d:{}};S.exSl.d=S.exSl.d||{};if(!(S.exSl.cur>=1&&S.exSl.cur<=SL_N))S.exSl.cur=1;return S.exSl}
function slData(k){const L=slD();return k===L.cur?{ex:S.ex,xg:S.xg}:(L.d[k]||{})}
function slHas(k){const d=slData(k),sto=d.ex&&d.ex.sto,xg=d.xg;
  return !!((xg&&xg.started)||(sto&&((sto.s|0)>0||(sto.f&&(sto.f.woke||sto.f.st))))||(xg&&xg.owned&&Object.keys(xg.owned).some(n=>xg.owned[n]>0)))}
function slInfo(k){const d=slData(k),ex=d.ex||{},xg=d.xg||{},f=(ex.sto&&ex.sto.f)||{};let med=0;try{med=XGYM.reduce((a,g,i)=>a+(f["xb"+i]?1:0),0)}catch(e){}
  const dex=xg.owned?Object.keys(xg.owned).filter(n=>xg.owned[n]>0&&PM[n]).length:0,pt=xg.pt|0,h=Math.floor(pt/3600),m=Math.floor(pt%3600/60);
  const team=(xg.team||[]).filter(n=>n&&PM[n]&&xg.owned&&xg.owned[n]>0).slice(0,6);
  return {loc:(EXM[ex.m]||{}).n||"—",med:med,dex:dex,time:h+"h "+m+"m",team:team,mote:xg.mote||{},lk:!!(xg.lk&&xg.lk.on),lost:!!xg.lost,rnd:!!(xg.rnd&&(xg.rnd.w||xg.rnd.t||xg.rnd.i))}}
// deja la Exploración lista para la ranura activa (mapa, historia, compañero…)
function slReset(){try{if(typeof XGSW!=="undefined"&&XGSW)xgOut()}catch(e){}
  Object.assign(EX,{map:null,grid:null,dlg:null,pend:[],cut:null,walkTo:null,fol:null,battle:null,trans:null,choice:null,mv:null,banner:null});
  try{XFM=null}catch(e){}try{exStart()}catch(e){console.error(e)}try{exTitleUI()}catch(e){}save()}
function slSwitch(k){const L=slD();if(k===L.cur)return;try{if(typeof XGSW!=="undefined"&&XGSW)xgOut()}catch(e){}
  L.d[L.cur]={ex:S.ex,xg:S.xg};const t=L.d[k]||{};delete L.d[k];
  if(t.ex)S.ex=t.ex;else delete S.ex;if(t.xg)S.xg=t.xg;else delete S.xg;L.cur=k;slReset()}
function slWipe(k){const L=slD();if(k===L.cur){delete S.ex;delete S.xg;slReset()}else{delete L.d[k];save()}}
// tiempo de juego de cada partida
setInterval(()=>{try{if(EX.on&&!EX.title&&!document.hidden&&EX.cv&&EX.cv.isConnected&&EX.cv.offsetParent){const X=xgData();X.pt=(X.pt|0)+5}}catch(e){}},5000);
// velocidad del texto de los diálogos
if(O.exTxt==null)O.exTxt=0;
{const _d=exDlgDraw;exDlgDraw=function(){try{const d=EX.dlg;if(d&&O.exTxt){const t=exDlgT(d.l[d.i]||"");d.c=O.exTxt===2?t.length:Math.min(t.length,(d.c||0)+1.6)}}catch(e){}return _d.apply(this,arguments)}}
// ---------- la ventana ----------
const SM={v:null,go:false};
{const _g=exGo;exGo=function(){if(!EX.title)return;if(!SM.go){smOpen("main");return}SM.go=false;smClose(true);return _g.apply(this,arguments)}}
function smBox(){const T=$("exTitle");if(!T)return null;let b=$("exStartM");if(!b){b=document.createElement("div");b.id="exStartM";b.className="exsm";b.hidden=true;T.appendChild(b);b.addEventListener("click",smClick)}return b}
function smOpen(v){const b=smBox();if(!b)return;SM.v=v;b.hidden=false;$("exTitle").classList.add("smopen");smRender();snd("ui")}
function smClose(quiet){const b=$("exStartM");if(b)b.hidden=true;SM.v=null;const T=$("exTitle");if(T)T.classList.remove("smopen");if(!quiet)snd("ui")}
function smStart(){SM.go=true;exGo()}
const smBtn=(act,t,sub,cls)=>'<button type="button" class="smb'+(cls?" "+cls:"")+'" data-sm="'+act+'"><b>'+t+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</button>';
// ficha de la partida (como en los juegos clásicos): lugar, entrenador, medallas, Pokédex, tiempo y equipo
function smCard(k,act){const has=slHas(k),cur=slD().cur===k;
  if(!has)return '<button type="button" class="smb smcard empty" data-sm="'+act+'" data-k="'+k+'"><div class="sch"><b>Partida '+k+'</b><span>— Vacía —</span></div></button>';
  const i=slInfo(k);let tr="";try{tr='<img class="sctr" src="'+trURL(myLook(),"f","i")+'" alt="">'}catch(e){}
  return '<button type="button" class="smb smcard" data-sm="'+act+'" data-k="'+k+'"><div class="sch"><b>Partida '+k+(cur&&act!=="cont"?' <i>· activa</i>':'')+'</b><span>'+esc(i.loc)+'</span></div>'+
    '<div class="scb"><div class="scl"><div class="scw">'+tr+'<b class="scn">'+esc(S.nick||"Entrenador")+'</b></div>'+
    '<dl><dt>Medallas:</dt><dd>'+i.med+'</dd><dt>Pokédex:</dt><dd>'+i.dex+'</dd><dt>Tiempo:</dt><dd>'+i.time+'</dd></dl>'+
    (i.lost?'<em class="sclost">☠️ Desafío perdido</em>':i.lk||i.rnd?'<em>'+(i.lk?'🔒 Locke ':'')+(i.rnd?'🎲 Random':'')+'</em>':'')+'</div>'+
    '<div class="sct">'+i.team.map(n=>'<span title="'+esc(i.mote[n]||n)+'">'+ico(PM[n],56)+'</span>').join("")+'</div></div></button>'}
function smSlot(k,act){return smCard(k,act)}
function smRender(){const b=$("exStartM");if(!b)return;const v=SM.v,L=slD(),has=slHas(L.cur);let h="";
  if(v==="main"){
    h=(has?'<h3>CONTINUAR</h3>'+smCard(L.cur,"cont"):'<h3>MENÚ PRINCIPAL</h3>')+
      smBtn("new","PARTIDA NUEVA")+smBtn("load","CARGAR PARTIDA")+smBtn("del","BORRAR PARTIDA")+smBtn("opt","OPCIONES")+smBtn("back","VOLVER","","smx")}
  else if(v==="new")h='<h3>PARTIDA NUEVA</h3><p>Elige una ranura. Si ya tiene una partida, se borrará.</p>'+[1,2,3].map(k=>smSlot(k,"newk")).join("")+smBtn("main","VOLVER","","smx");
  else if(v==="load")h='<h3>CARGAR PARTIDA</h3>'+[1,2,3].map(k=>smSlot(k,"loadk")).join("")+smBtn("main","VOLVER","","smx");
  else if(v==="del")h='<h3>BORRAR PARTIDA</h3><p>⚠️ Se borra todo lo de esa partida de Exploración: historia, Pokémon, objetos y medallas. No se puede deshacer.</p>'+[1,2,3].map(k=>smSlot(k,"delk")).join("")+smBtn("main","VOLVER","","smx");
  else if(v==="opt"){const ts=["Normal","Rápida","Instantánea"][O.exTxt|0];
    h='<h3>OPCIONES</h3>'+smBtn("o_txt","VELOCIDAD DEL TEXTO","◀ "+ts+" ▶")+smBtn("o_spd","VELOCIDAD DEL JUEGO","◀ x"+exSpd()+" ▶")+
      smBtn("o_mus","MÚSICA",typeof mplaying!=="undefined"&&mplaying?"Activada":"Desactivada")+smBtn("o_sec","MÚSICA SEGÚN LA ZONA",O.secMus?"Sí":"No")+
      smBtn("o_mp","OTROS JUGADORES",O.exMp===false?"Ocultos":"Visibles")+smBtn("o_ctl","CONTROLES","Teclado y mando")+smBtn("main","VOLVER","","smx")}
  b.innerHTML='<div class="smin">'+h+'</div>';
  const first=b.querySelector(".smb");if(first)first.classList.add("on")}
function smFocus(el){const b=$("exStartM");b.querySelectorAll(".smb.on").forEach(x=>x.classList.remove("on"));el.classList.add("on");try{el.scrollIntoView({block:"nearest"})}catch(e){}}
async function smClick(e){const t=e.target.closest("[data-sm]");if(!t)return;e.stopPropagation();const a=t.dataset.sm,k=+t.dataset.k||0,L=slD();snd("ui");
  if((a==="cont"||a==="loadk")&&slData(k||L.cur).xg&&slData(k||L.cur).xg.lost){await uiDlg("☠️ La Partida "+(k||L.cur)+" perdió el desafío (Cláusula Sin Piedad). Ya no se puede continuar: bórrala desde «Borrar partida» y empieza una Partida nueva.",{alert:true,yes:"Entendido"});return}
  if(a==="cont"){smStart();return}
  if(a==="back"){smClose();return}
  if(["main","new","load","del","opt"].includes(a)){SM.v=a;smRender();return}
  if(a==="newk"){if(slHas(k)&&!await uiDlg("La Partida "+k+" ya tiene datos. ¿Borrarla y empezar una partida nueva en esa ranura?",{yes:"Sí, empezar de cero",no:"Cancelar",danger:true}))return;
    if(k!==L.cur)slSwitch(k);delete S.ex;delete S.xg;slReset();xgData().started=Date.now();save();toast("✨ Partida nueva en la ranura "+k);smStart();return}
  if(a==="loadk"){if(!slHas(k)){toast("Esa ranura está vacía. Usa «Partida nueva».");return}if(k!==L.cur)slSwitch(k);smStart();return}
  if(a==="delk"){if(!slHas(k)){toast("Esa ranura ya está vacía.");return}
    if(!await uiDlg("¿Borrar la Partida "+k+"? Se perderá todo su progreso de Exploración.",{yes:"Borrar",no:"Cancelar",danger:true}))return;
    if(!await uiDlg("¿Seguro? Esto no se puede deshacer.",{yes:"Sí, borrar para siempre",no:"No",danger:true}))return;
    slWipe(k);snd("faint");toast("🗑️ Partida "+k+" borrada");smRender();return}
  if(a==="o_txt"){O.exTxt=((O.exTxt|0)+1)%3;saveO();smRender();smFocus($("exStartM").querySelector('[data-sm="o_txt"]'));return}
  if(a==="o_spd"){exSpdNext();smRender();smFocus($("exStartM").querySelector('[data-sm="o_spd"]'));return}
  if(a==="o_mus"){try{if(mplaying)mstop();else mstart()}catch(x){}smRender();smFocus($("exStartM").querySelector('[data-sm="o_mus"]'));return}
  if(a==="o_sec"){O.secMus=O.secMus?0:1;saveO();try{applyO()}catch(x){}smRender();smFocus($("exStartM").querySelector('[data-sm="o_sec"]'));return}
  if(a==="o_mp"){O.exMp=O.exMp===false;save();smRender();smFocus($("exStartM").querySelector('[data-sm="o_mp"]'));return}
  if(a==="o_ctl"){const c=$("exCtl");if(c){c.hidden=false;EX.bind=null;exCtlUI()}return}}
// teclado y mando en la ventana
window.addEventListener("keydown",e=>{const b=$("exStartM");if(!b||b.hidden||!EX.title||document.querySelector(".uidlg:not(.mvdlg)"))return;if($("exCtl")&&!$("exCtl").hidden)return;
  const a=exAct(e.key),dir={ArrowUp:"u",ArrowDown:"d"}[e.key]||(a==="u"||a==="d"?a:null);e.preventDefault();e.stopImmediatePropagation();
  const L=[...b.querySelectorAll(".smb")],i=Math.max(0,L.findIndex(x=>x.classList.contains("on")));
  if(dir){smFocus(L[(i+(dir==="d"?1:-1)+L.length)%L.length]);snd("ui");return}
  if(a==="l"||a==="r"||e.key==="ArrowLeft"||e.key==="ArrowRight"){const c=L[i];if(c&&/^o_(txt|spd|mus|sec|mp)$/.test(c.dataset.sm))c.click();return}
  if(e.repeat)return;
  if(a==="a"||e.key==="Enter"||e.key===" "){if(L[i])L[i].click();return}
  if(a==="b"||a==="back"||e.key==="Escape"||e.key==="Backspace"){if(SM.v==="main")smClose();else{SM.v="main";smRender()}snd("ui")}},true);
// ---------- «Salir al menú principal» desde el menú del juego ----------
EXM_IT.splice(EXM_IT.findIndex(x=>x[0]==="x"),0,["title","🏠","Salir al menú principal"]);
function exToTitle(){if((typeof fcd!=="undefined"&&fcd)||EX.trans){toast("Termina el combate para salir al menú principal.");return}
  try{exMenuClose()}catch(e){}XOV_IDS.forEach(id=>{const e=$(id);if(e)e.hidden=true});try{if(typeof WM!=="undefined"&&WM.open)wmHide()}catch(e){}try{if(typeof XSH!=="undefined"&&XSH.open)xsClose()}catch(e){}
  try{XFM=null}catch(e){}if(!EX.cut){EX.dlg=null;EX.choice=null}EX.keys={};EX.kst=[];save();try{if(window.cloudFlush)window.cloudFlush()}catch(e){}
  EX.title=true;exTitleUI();smOpen("main");toast("💾 Partida guardada")}
{const _md=exMenuDo;exMenuDo=function(k){if(k==="title"){try{exMenuClose()}catch(e){}exToTitle();return}return _md.apply(this,arguments)}}
// el texto de la pantalla de título habla de la ranura activa
{const _t=exTitleUI;exTitleUI=function(){const r=_t.apply(this,arguments);try{if(EX.title){const w=$("exWhere"),L=slD();if(w&&!slHas(L.cur))w.textContent="✨ Pulsa Iniciar para empezar una partida nueva";else if(w&&!/^Partida/.test(w.textContent))w.textContent="Partida "+L.cur+" · "+w.textContent}else smClose(true)}catch(e){}return r}}
