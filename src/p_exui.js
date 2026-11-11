// =====================================================================================
// EXPLORACIÓN: velocidad x1/x2/x3, compatibilidad con mando (configurable) y menú lateral (como en los juegos)
// =====================================================================================
// nuevas acciones del teclado (se pueden cambiar en Controles)
EXKB0.menu=["Tab","q"];EXKN.menu="Abrir el menú";EXKB0.sp=["v",""];EXKN.sp="Velocidad x1 / x2 / x3";
// ---------- velocidad: afecta a todo (caminar, personajes, transiciones y combates) ----------
const exSpd=()=>typeof BS!=="undefined"&&[1,2,3].includes(BS)?BS:1;
{const _u=exUpdate;exUpdate=function(dt,ts){return _u.call(this,dt*exSpd(),ts)}}
function exSpdNext(){const n=exSpd()%3+1;try{setBS(n)}catch(e){}snd("ui");toast("⏩ Velocidad x"+n);exSpdUI()}
function exSpdUI(){const b=$("exSpdB");if(b)b.textContent="⏩x"+exSpd();const m=document.querySelector("[data-exm=sp] small");if(m)m.textContent="x"+exSpd()}
// ---------- botones nuevos en la pantalla ----------
setInterval(()=>{const sc=document.querySelector("#explPB .exscr")||document.querySelector(".exwrap .exscr");if(!sc)return;
  if(!$("exSpdB")){sc.insertAdjacentHTML("beforeend",'<button type="button" class="exfsb exspdb" id="exSpdB" title="Velocidad del juego (V)">⏩x1</button><button type="button" class="exfsb exmenub" id="exMenuB" title="Menú (Tab)" aria-label="Menú">☰</button>');
    $("exSpdB").onclick=e=>{e.stopPropagation();exSpdNext()};$("exMenuB").onclick=e=>{e.stopPropagation();exMenu()}}
  exSpdUI()},600);
// ---------- menú lateral ----------
const EXM_IT=[["team","👥","Equipo y Mochila"],["dex","📖","Pokédex"],["map","🗺️","Mapa"],["mini","🧭","Minimapa"],["sp","⏩","Velocidad"],["ctl","🎮","Controles"],["mp","👫","Otros jugadores"],["save","💾","Guardar"],["x","✖","Cerrar"]];
function exMenu(force){const sc=document.querySelector("#explPB .exscr")||document.querySelector(".exwrap .exscr");if(!sc)return;let m=$("exMenu");
  if(m&&!m.hidden&&!force){exMenuClose();return}
  if(!m){m=document.createElement("div");m.id="exMenu";m.className="exmenu";sc.appendChild(m);
    m.addEventListener("click",e=>{const b=e.target.closest("[data-exm]");if(!b)return;e.stopPropagation();exMenuDo(b.dataset.exm)})}
  m.innerHTML=EXM_IT.map(([k,i,t],j)=>'<button type="button" data-exm="'+k+'"'+(j===0?' class="on"':'')+'><span>'+i+'</span><b>'+t+'</b>'+(k==="sp"?'<small>x'+exSpd()+'</small>':k==="mp"?'<small>'+(O.exMp===false?'ocultos':'visibles')+'</small>':'')+'</button>').join("");
  m.hidden=false;EX.kst=[];EX.keys={};snd("ui")}
function exMenuClose(){const m=$("exMenu");if(m&&!m.hidden){m.hidden=true;snd("ui");try{EX.cv.focus({preventScroll:true})}catch(e){}}}
const exMenuOpen=()=>{const m=$("exMenu");return !!m&&!m.hidden};
function exMenuDo(k){if(k!=="sp"&&k!=="mp")exMenuClose();
  if(k==="team"){try{xgPanel()}catch(e){}}
  else if(k==="dex")exDex();
  else if(k==="map"){try{wmShow()}catch(e){}}
  else if(k==="mini"){const b=$("exMiniB");if(b)b.click()}
  else if(k==="sp"){exSpdNext();exMenu(true)}
  else if(k==="ctl"){const c=$("exCtl");if(c){c.hidden=false;EX.bind=null;exCtlUI()}}
  else if(k==="mp"){O.exMp=O.exMp===false;save();try{if(O.exMp===false)xoLeave()}catch(e){}toast(O.exMp===false?"🙈 Has ocultado a los demás jugadores":"👥 Ahora ves a los demás jugadores");exMenu(true)}
  else if(k==="save"){save();try{if(window.cloudFlush)window.cloudFlush()}catch(e){}snd("lvl");toast("💾 Partida guardada")}}
// Pokédex de Exploración: los Pokémon que has capturado en este modo
function exDex(){const sc=document.querySelector("#explPB .exscr")||document.querySelector(".exwrap .exscr");if(!sc)return;let d=$("exDexP");if(!d){d=document.createElement("div");d.id="exDexP";d.className="exteam exdex";sc.appendChild(d)}
  const own=xgRun(()=>Object.keys(S.owned).filter(n=>S.owned[n]>0&&PM[n])),tot=P.filter(p=>p[2]!=="M").length;
  own.sort((a,b)=>(+PM[a][4]||9999)-(+PM[b][4]||9999));
  d.innerHTML='<div class="xgh"><b>📖 Pokédex de Exploración · '+own.length+' / '+tot+'</b><button type="button" class="alt" data-exdx="1">Cerrar</button></div>'+
    (own.length?'<div class="exdexg">'+own.map(n=>'<div class="exdexc" title="'+esc(n)+'">'+ico(PM[n],48)+'<small>#'+(PM[n][4]||"?")+'</small><b>'+esc(n)+'</b><i>'+tyTxt(PM[n])+'</i></div>').join("")+'</div>':'<p class="mut">Aún no has capturado ningún Pokémon en Exploración. ¡Busca en la hierba alta!</p>');
  d.hidden=false;d.querySelector("[data-exdx]").onclick=e=>{e.stopPropagation();d.hidden=true;snd("ui")};snd("ui")}
// teclas M (menú) y V (velocidad), y moverse por el menú con las flechas
window.addEventListener("keydown",e=>{if(!EX.on||EX.title||EX.bind)return;const t=e.target;if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName))return;const a=exAct(e.key);
  if(exMenuOpen()){const bs=[...$("exMenu").querySelectorAll("button")],i=Math.max(0,bs.findIndex(b=>b.classList.contains("on")));
    if(a==="u"||a==="d"){e.preventDefault();e.stopPropagation();bs[i].classList.remove("on");bs[(i+(a==="d"?1:-1)+bs.length)%bs.length].classList.add("on");snd("ui");return}
    if(a==="a"){e.preventDefault();e.stopPropagation();bs[i].click();return}
    if(a==="b"||a==="menu"||e.key==="Escape"){e.preventDefault();e.stopPropagation();exMenuClose();return}
    e.stopPropagation();return}
  if(e.repeat)return;
  if(a==="menu"&&!EX.dlg&&!EX.choice){e.preventDefault();e.stopPropagation();exMenu();return}
  if(a==="sp"){e.preventDefault();e.stopPropagation();exSpdNext()}},true);
// ---------- mando (Gamepad API) ----------
// por defecto: cruceta / stick izquierdo = moverse · A = hablar · B = correr · Start = menú · Select = velocidad
const EXPAD0={a:0,b:1,menu:9,sp:8};const EXPADN={a:"Hablar / aceptar",b:"Correr / volver",menu:"Menú",sp:"Velocidad"};
const exPad=()=>{const p=S.exPad&&typeof S.exPad==="object"?S.exPad:{};const o={};for(const k in EXPAD0)o[k]=Number.isInteger(p[k])?p[k]:EXPAD0[k];return o};
const GP={prev:{},dir:null,bind:null,on:false};
function gpKey(type,key){document.dispatchEvent(new KeyboardEvent(type,{key:key,bubbles:true,cancelable:true}))}
function gpKeyOf(act){const kb=exKB();return (kb[act]&&kb[act].find(Boolean))||EXKB0[act][0]}
function gpPoll(){const L=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[];const gp=L[0];if(!gp){GP.on=false;return}GP.on=true;
  const pr=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed),ax=gp.axes||[];if(gp.buttons.some(b=>b&&b.pressed)||ax.some(v=>Math.abs(v)>.5))GP.used=1;
  // configurar un botón: el siguiente botón pulsado se asigna a la acción
  if(GP.bind){for(let i=0;i<gp.buttons.length;i++)if(pr(i)&&!GP.prev[i]){const P0=exPad();for(const k in P0)if(P0[k]===i&&k!==GP.bind)P0[k]=-1;P0[GP.bind]=i;S.exPad=P0;save();GP.bind=null;snd("lvl");exCtlUI();break}
    for(let i=0;i<gp.buttons.length;i++)GP.prev[i]=pr(i);return}
  const P0=exPad();
  // dirección: cruceta (12-15) o stick
  let d=null;if(pr(12)||ax[1]<-.5)d="u";else if(pr(13)||ax[1]>.5)d="d";else if(pr(14)||ax[0]<-.5)d="l";else if(pr(15)||ax[0]>.5)d="r";
  const DK={u:"ArrowUp",d:"ArrowDown",l:"ArrowLeft",r:"ArrowRight"},inBattle=typeof fcd!=="undefined"&&fcd;
  if(d!==GP.dir){if(GP.dir&&!inBattle)gpKey("keyup",gpKeyOf(GP.dir));if(d){if(inBattle)gpNav(d);else gpKey("keydown",gpKeyOf(d))}GP.dir=d;GP.rep=performance.now()+380}
  else if(d&&(inBattle||exMenuOpen()||EX.choice||exOverlay())&&performance.now()>GP.rep){GP.rep=performance.now()+160;if(inBattle)gpNav(d);else gpKey("keydown",gpKeyOf(d))}
  const edge=k=>{const i=P0[k];return i>=0&&pr(i)&&!GP.prev[i]},rel=k=>{const i=P0[k];return i>=0&&!pr(i)&&GP.prev[i]};
  if(inBattle){if(edge("a"))gpClick();if(edge("b"))exBackBattle()}
  else{
    if(edge("a"))gpKey("keydown",exOverlay()?"Enter":gpKeyOf("a"));
    if(edge("b")){const ovb=exOverlay();if(exMenuOpen())exMenuClose();else if(ovb)ovBack(ovb);else if(typeof WM!=="undefined"&&WM.open){wmHide();if(XFM==="map")xfmBack()}else gpKey("keydown",gpKeyOf("b"))}
    if(rel("b"))gpKey("keyup",gpKeyOf("b"));
    if(edge("menu"))gpKey("keydown",gpKeyOf("menu"));
    if(edge("sp"))gpKey("keydown",gpKeyOf("sp"))}
  for(let i=0;i<gp.buttons.length;i++)GP.prev[i]=pr(i)}
// en los combates: la cruceta mueve la selección entre los botones y A pulsa
function gpBtns(){return [...document.querySelectorAll("#menu button:not([disabled])")].filter(b=>b.offsetParent)}
// marca visible del botón elegido con el mando (el foco por código no activa :focus-visible)
function gpSel(b){document.querySelectorAll(".gpsel").forEach(x=>{if(x!==b)x.classList.remove("gpsel")});if(!b)return;b.classList.add("gpsel");try{b.focus({preventScroll:true})}catch(e){}}
function gpCur(L){return L.find(b=>b.classList.contains("gpsel"))||(L.includes(document.activeElement)?document.activeElement:null)}
function gpNav(d){const L=gpBtns();if(!L.length)return;const c=gpCur(L);if(!c){gpSel(L[0]);snd("ui");return}
  const r=c.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let best=null,bd=1e9;
  L.forEach(b=>{if(b===c)return;const q=b.getBoundingClientRect(),x=q.left+q.width/2-cx,y=q.top+q.height/2-cy;const ok=d==="u"?y<-4:d==="d"?y>4:d==="l"?x<-4:x>4;if(!ok)return;const s=(d==="u"||d==="d")?Math.abs(y)+Math.abs(x)*2:Math.abs(x)+Math.abs(y)*2;if(s<bd){bd=s;best=b}});
  if(best){gpSel(best);snd("ui")}}
function gpClick(){const L=gpBtns();const c=gpCur(L);if(c){c.click();return}if(L[0])gpSel(L[0]);else{const s=document.querySelector("#bmsg,#say,.bsay");if(s)s.click()}}
// si se está usando el mando en un combate, siempre hay un botón marcado
function gpAuto(){if(!GP.on||!GP.used||!(typeof fcd!=="undefined"&&fcd))return;const L=gpBtns();if(L.length&&!L.some(b=>b.classList.contains("gpsel")))gpSel(gpCur(L)||L[0])}
(function gpLoop(){try{gpPoll()}catch(e){}try{gpAuto()}catch(e){}requestAnimationFrame(gpLoop)})();
window.addEventListener("gamepadconnected",()=>{toast("🎮 Mando conectado. Configúralo en Exploración → Menú → Controles.")});
// controles: añadir la sección del mando
{const _c=exCtlUI;exCtlUI=function(){_c.apply(this,arguments);const box=$("exCtl"),inn=box&&box.querySelector(".exctlin");if(!inn)return;const P0=exPad(),h=inn.querySelector("h3");if(h)h.textContent="🎮 Controles (teclado y mando)";
  const sec=document.createElement("div");sec.className="expadsec";
  sec.innerHTML='<b class="xgs">🎮 Mando '+(GP.on?'<small class="ok">conectado</small>':'<small class="mut">(conéctalo y pulsa cualquier botón)</small>')+'</b><small class="mut">La cruceta y el stick izquierdo mueven. Pulsa en una acción y después el botón del mando.</small><div class="exctlg">'+
    Object.keys(EXPAD0).map(k=>'<b>'+EXPADN[k]+'</b><button type="button" class="'+(GP.bind===k?'on':'alt')+'" data-expad="'+k+'">'+(GP.bind===k?'Pulsa un botón…':P0[k]>=0?'Botón '+P0[k]+gpName(P0[k]):'—')+'</button><span></span>').join("")+'</div><button type="button" class="alt" data-expadr="1">↺ Restablecer el mando</button>';
  const jr=inn.querySelector(".jrow");inn.insertBefore(sec,jr);
  sec.addEventListener("click",e=>{const b=e.target.closest("[data-expad]");if(b){e.stopPropagation();GP.bind=b.dataset.expad;exCtlUI();return}if(e.target.closest("[data-expadr]")){e.stopPropagation();delete S.exPad;save();GP.bind=null;exCtlUI()}})}}
const gpName=i=>({0:" (A / ✕)",1:" (B / ◯)",2:" (X / ▢)",3:" (Y / △)",4:" (LB)",5:" (RB)",6:" (LT)",7:" (RT)",8:" (Select)",9:" (Start)"}[i]||"");
// ---------- límite de nivel en Exploración: como en el juego normal, según el próximo gimnasio ----------
// Nadie sube por encima del as del siguiente Líder + 2 (Brezo: Nv14) hasta ganar su medalla.
// Si un Pokémon ya tiene más nivel, lucha al nivel del límite (su nivel real no cambia).
function xgCapGym(){let best=-1,lv=1e9;XGYM.forEach((g,i)=>{if(xbHas(i))return;const a=Math.max(...g.team.map(t=>t[1]))+2;if(a<lv){lv=a;best=i}});return best<0?null:{i:best,l:lv}}
function xgCap(){try{const g=xgCapGym();if(g)return g.l;const f=stSt().f;if(!f.champ)return Math.max(...XELITE.map(e=>Math.max(...e.team.map(t=>t[1]))))+6;return 100}catch(e){return 100}}
function xgCapWhy(){try{const g=xgCapGym();if(g)return "Límite Nv"+g.l+": derrota a "+XGYM[g.i].n+" ("+XGYM[g.i].b+") para subirlo.";const f=stSt().f;return f.champ?"":"Límite Nv"+xgCap()+": derrota al Campeón de la Liga para quitarlo."}catch(e){return ""}}
// mostrar el límite en el panel del equipo
{const _xp=xgPanel;xgPanel=function(){const r=_xp.apply(this,arguments);try{const box=$("exTeam"),h=box&&box.querySelector(".xgh");if(h&&!box.querySelector(".xgcap")){const w=xgRun(()=>xgCapWhy());if(w){const t=document.createElement("small");t.className="xgcap";t.textContent="🔒 "+w;h.after(t)}}}catch(e){}return r}}

// =====================================================================================
// COMBATE: interfaz clásica. Primero «¿Qué debería hacer…?» con LUCHAR / MOCHILA / POKÉMON / HUIR;
// al pulsar LUCHAR, los 4 ataques en un cuadro de 2×2 con un panel de tipo y PP.
// =====================================================================================
{const _sm=setMenu;setMenu=function(v){_sm.apply(this,arguments);try{if(v!==true||!B||B.mode!=="s"||!B.E||O.bclassic===false)return;bcLayout()}catch(e){}}}
function bcLayout(){const mn=$("menu");if(!mn||mn.querySelector(".bcmd"))return;const sd=B.E.sd[0],m=beAct(sd);if(!m)return;
  const all=[...mn.children],mvs=all.filter(b=>b.matches&&b.matches('[data-k^="m"],[data-k="st"]')),cmd={};
  ["b","e","f"].forEach(k=>{cmd[k]=all.find(b=>b.dataset&&b.dataset.k===k)});const extra=all.filter(b=>!mvs.includes(b)&&!Object.values(cmd).includes(b));
  const hid=document.createElement("div");hid.hidden=true;Object.values(cmd).forEach(b=>{if(b)hid.appendChild(b)});
  const nm=typeof nk==="function"&&S.owned[m.p[0]]?nk(m.p[0]):m.p[0];
  const C=document.createElement("div");C.className="bcmd";
  C.innerHTML='<div class="bcq">¿Qué debería hacer<br><b>'+esc(nm)+'</b>?</div><div class="bcg"><button type="button" class="bcb bc-f" data-cm="fight">LUCHAR</button><button type="button" class="bcb bc-b" data-cm="b">MOCHILA</button><button type="button" class="bcb bc-p" data-cm="e">POKÉMON</button><button type="button" class="bcb bc-r" data-cm="f">'+(B.trainer?'RENDIRSE':'HUIR')+'</button></div>';
  const F=document.createElement("div");F.className="bfight";const G=document.createElement("div");G.className="bcmv";mvs.forEach(b=>G.appendChild(b));
  const I=document.createElement("div");I.className="bcinfo";const X=document.createElement("div");X.className="bcx";extra.forEach(b=>X.appendChild(b));
  X.insertAdjacentHTML("beforeend",'<button type="button" class="alt bcback" data-cm="back">◀ Atrás</button>');
  F.appendChild(G);F.appendChild(I);F.appendChild(X);
  mn.innerHTML="";mn.appendChild(C);mn.appendChild(F);mn.appendChild(hid);mn.classList.add("bclassic");
  const info=b=>{const k=b&&b.dataset.k&&/^m\d$/.test(b.dataset.k)?+b.dataset.k[1]:-1,mv=k>=0?m.m[k]:null;
    I.innerHTML=mv?'<span class="bcty" style="--tc:'+(TC[mv.t]||"#999")+'">'+(EM[mv.t]||"")+' '+(TIPO[mv.t]||mv.t).toUpperCase()+'</span><b>PP: '+m.pp[k]+'/'+ppMax(m.p[0],mv.id)+'</b><small>'+(mv.cl===0?'Estado':mv.cl===1?'Físico':'Especial')+(mv.pw?' · Pot. '+mv.pw:'')+'</small>'+(()=>{try{const foe=beAct(B.E.sd[1]);return '<small class="bceff">'+(effTag(mv,foe,m)||'&nbsp;')+'</small>'}catch(e){return '<small class="bceff">&nbsp;</small>'}})():'<small class="mut">Elige un ataque</small>'};
  G.querySelectorAll("button").forEach(b=>{b.addEventListener("mouseenter",()=>info(b));b.addEventListener("focus",()=>info(b))});info(mvs[0]);
  const view=v=>{mn.classList.toggle("bcf",v==="fight");mn.classList.toggle("bcc",v!=="fight");B.bcv=v;const f=(v==="fight"?G:C).querySelector("button:not([disabled])");if(f&&GP.on){if(GP.used)gpSel(f);else f.focus()}};
  view(B.bcv==="fight"&&B.bcKeep?"fight":"cmd");B.bcKeep=false;
  mn.addEventListener("click",bcClick,true)}
function bcClick(e){const b=e.target.closest&&e.target.closest("[data-cm]");if(!b)return;e.stopPropagation();const mn=$("menu"),k=b.dataset.cm;snd("ui");
  if(k==="fight"){mn.classList.add("bcf");mn.classList.remove("bcc");const f=mn.querySelector(".bcmv button:not([disabled])");if(f&&GP.on)f.focus();return}
  if(k==="back"){mn.classList.remove("bcf");mn.classList.add("bcc");const f=mn.querySelector(".bcmd button");if(f&&GP.on)f.focus();return}
  const o=mn.querySelector('[hidden] [data-k="'+k+'"]');if(o)o.click()}
// al volver de la mochila o del equipo con «Atrás», se vuelve al cuadro de órdenes

// =====================================================================================
// CASAS VISITABLES: vecinos con los que charlar (sin combate) y escaleras al piso de arriba
// =====================================================================================
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans){const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy,n=EX.npcs.find(q=>q.px===x&&q.py===y);
  if(n&&Array.isArray(n.chat)){n.f={u:"d",d:"u",l:"r",r:"l"}[EX.f];snd("ui");exSay(n.chat.map((l,k)=>k===0?n.n+": «"+l+"»":"«"+l+"»"));return}}}catch(e){}return _i.apply(this,arguments)}}
// escaleras (dibujo propio)
function xStairs(up){const k="ST"+(up?1:0);if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d"),ink="#2b2440";
  xr(g,0,0,32,32,"#7a5634");for(let i=0;i<5;i++){const y=i*6+1,sh=up?i:4-i;xr(g,2,y,28,6,ink);xr(g,3,y+1,26,4,sh%2?"#c8955a":"#b07a44");xr(g,3,y+1,26,1,"#e2b27a")}
  xr(g,0,0,3,32,ink);xr(g,29,0,3,32,ink);xr(g,1,0,1,32,"#9a6a3a");xr(g,30,0,1,32,"#9a6a3a");return XG[k]=c}
{const _g=xGround;xGround=function(x,y,fr){try{const c=exAt(x,y),w=EX.M&&EX.M.w&&EX.M.w[c];if(w&&w.look==="stairs")return xStairs(/_h2$/.test(EX.map))}catch(e){}return _g.apply(this,arguments)}}

// =====================================================================================
// MAPA DE LA REGIÓN: islas bien separadas (nada se monta), dibujadas siguiendo sus caminos
// =====================================================================================
["pueblo","pe","pn","pb","vv","ct","pc","cl"].forEach(t=>{["_h1","_h2","_h2b"].forEach(s=>{WM_IN[t+s]=t})});
{const POS={pe:[110,205],ruta2:[215,205],pn:[320,205],glaciar:[320,138],pico_e:[320,74],
  liga:[500,76],victoria:[500,140],cl:[500,204],ruta5:[500,276],pc:[500,348],
  pb:[660,205],ruta3:[760,205],vv:[860,205],crater:[860,138],cumbre:[860,74],
  cima:[130,430],cueva:[255,430],pueblo:[130,515],ruta:[255,515],bosque:[370,515],playa:[255,592],
  ct:[690,520],ruta4:[805,520],torre:[805,440]};
 WM_N.forEach(n=>{const p=POS[n.k];if(p){n.x=p[0];n.y=p[1]}});
 const LB={alba:[250,380],esc:[215,278],bra:[760,278],tor:[750,600],cel:[500,404]};for(const r in LB)if(WM_R[r]){WM_R[r].tx=LB[r][0];WM_R[r].ty=LB[r][1]}}
const WM_DECO={alba:[[70,470,"🌳"],[420,470,"🌲"],[330,575,"🌴"],[190,470,"🌳"],[70,560,"🌳"]],esc:[[60,150,"❄️"],[260,130,"❄️"],[380,90,"❄️"],[160,235,"⛄"]],
  bra:[[630,150,"🔥"],[945,240,"🌋"],[740,235,"🔥"],[840,90,"🔥"]],tor:[[640,470,"⚡"],[870,560,"🌩️"],[740,565,"⚡"]],cel:[[555,100,"✨"],[445,240,"✨"],[555,310,"🌙"]]};
wmDraw=function(ts){const cv=$("wmCv");if(!cv)return;const g=cv.getContext("2d"),W=1000,H=640;g.setTransform(cv.width/W,0,0,cv.height/H,0,0);
  const sea=g.createLinearGradient(0,0,0,H);sea.addColorStop(0,"#3e7fd0");sea.addColorStop(1,"#2a5aa8");g.fillStyle=sea;g.fillRect(0,0,W,H);
  g.strokeStyle="rgba(255,255,255,.14)";g.lineWidth=2;for(let y=20;y<H;y+=34)for(let x=((y/34)%2)*40+((ts/90)%80);x<W+80;x+=80){g.beginPath();g.moveTo(x-80,y);g.quadraticCurveTo(x-70,y-5,x-60,y);g.stroke()}
  const P=k=>wmNode(k);
  // rutas en barco (por el mar, entre las islas)
  const SC={pe:[60,330],pb:[600,420],ct:[470,600],pc:[420,470]};g.setLineDash([10,9]);g.lineWidth=3;g.strokeStyle="rgba(255,255,255,.7)";
  WM_SEA.forEach(([a,b])=>{const A=P(a),B=P(b);if(!A||!B)return;const[mx,my]=SC[b]||[(A.x+B.x)/2,(A.y+B.y)/2];g.beginPath();g.moveTo(A.x,A.y+18);g.quadraticCurveTo(mx,my,B.x,B.y+22);g.stroke();
    g.setLineDash([]);g.font="20px serif";g.textAlign="center";g.fillText("⛵",(A.x+2*mx+B.x)/4,(A.y+18+2*my+B.y+22)/4+6);g.setLineDash([10,9])});g.setLineDash([]);
  // islas: cápsulas a lo largo de los caminos de cada región (borde, arena y hierba)
  const reg={};WM_N.forEach(n=>{(reg[n.r]=reg[n.r]||[]).push(n)});
  const segs=r=>WM_E.filter(([a,b])=>{const A=P(a),B=P(b);return A&&B&&A.r===r&&B.r===r}).map(([a,b])=>[P(a),P(b)]);
  for(const r in reg){const R=WM_R[r];if(!R)continue;const N=reg[r],S2=segs(r);
    [[R.d,64],["#f1dfae",58],[R.c,50]].forEach(([c,rad])=>{g.fillStyle=c;g.strokeStyle=c;g.lineCap="round";g.lineWidth=rad*2;
      S2.forEach(([A,B])=>{g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke()});N.forEach(n=>{g.beginPath();g.arc(n.x,n.y,rad+4,0,Math.PI*2);g.fill()})});
    (WM_DECO[r]||[]).forEach(([x,y,t])=>{g.font="16px serif";g.textAlign="center";g.globalAlpha=.6;g.fillText(t,x,y);g.globalAlpha=1})}
  // caminos
  WM_E.forEach(([a,b])=>{const A=P(a),B=P(b);if(!A||!B)return;const op=wmOpenZone(a)&&wmOpenZone(b);[["#3a2a1c",14],[op?"#efd9a0":"#b8b0a0",8]].forEach(([c,w])=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap="round";g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke()})});
  // nombres de región (con cartel)
  g.textAlign="center";g.font="900 20px Fredoka,system-ui,sans-serif";for(const r in WM_R){const R2=WM_R[r],w=g.measureText(R2.n).width+22;g.fillStyle="rgba(15,23,58,.78)";g.beginPath();g.roundRect?g.roundRect(R2.tx-w/2,R2.ty-20,w,28,9):g.rect(R2.tx-w/2,R2.ty-20,w,28);g.fill();g.fillStyle="#fff";g.fillText(R2.n,R2.tx,R2.ty+1)}
  // lugares
  const here=wmHere(),vis=wmVis();
  WM_N.forEach(n=>{const op=wmOpenZone(n.k),kn=op||vis[n.k]||here===n.k,sel=WM.sel===n.k,x=n.x,y=n.y;g.lineWidth=3;g.strokeStyle="#1b2340";
    const col=kn?({town:"#ff5a5a",route:"#ffd35c",cave:"#8a6a4a",peak:"#cfd8e6",forest:"#3f9d4a",beach:"#58c8f0",tower:"#ffd94a"}[n.t]):"#8d8a9a";
    if(sel){g.fillStyle="rgba(255,255,255,.55)";g.beginPath();g.arc(x,y,26+Math.sin(ts/200)*3,0,Math.PI*2);g.fill()}
    g.fillStyle=col;g.beginPath();
    if(n.t==="town"){g.roundRect?g.roundRect(x-17,y-14,34,28,6):g.rect(x-17,y-14,34,28);g.fill();g.stroke();if(kn){g.fillStyle="#fff";g.fillRect(x-11,y-2,22,10);g.fillStyle="#1b2340";g.fillRect(x-3,y+1,6,7)}}
    else if(n.t==="peak"||n.t==="cave"){g.moveTo(x,y-19);g.lineTo(x+19,y+13);g.lineTo(x-19,y+13);g.closePath();g.fill();g.stroke();if(kn&&n.t==="cave"){g.fillStyle="#1b2340";g.beginPath();g.arc(x,y+13,7,Math.PI,0);g.fill()}if(kn&&n.t==="peak"){g.fillStyle="#fff";g.beginPath();g.moveTo(x,y-19);g.lineTo(x+6,y-9);g.lineTo(x-6,y-9);g.closePath();g.fill()}}
    else if(n.t==="tower"){g.rect(x-9,y-22,18,36);g.fill();g.stroke();if(kn){g.font="14px serif";g.textAlign="center";g.fillText(n.k==="liga"?"🏆":"⚡",x,y)}}
    else{g.arc(x,y,11,0,Math.PI*2);g.fill();g.stroke()}
    if(!kn){g.fillStyle="#fff";g.font="900 16px Fredoka,system-ui,sans-serif";g.textAlign="center";g.fillText("?",x,y+5)}
    const nm=kn?((EXM[n.k]||{}).n||n.k).replace(/ · .*/,""):"???";g.font="800 13px Fredoka,system-ui,sans-serif";g.textAlign="center";g.lineWidth=4;g.strokeStyle="rgba(15,23,58,.9)";
    const side=n.r==="cel"||((n.t==="peak"||n.t==="cave")&&n.r!=="alba");const lft=side&&n.r==="bra",lx=side?(lft?x-28:x+28):x,ly=side?y+5:y+30;g.textAlign=side?(lft?"right":"left"):"center";
    g.strokeText(nm,lx,ly);g.fillStyle=kn?"#fff":"#c9c6d6";g.fillText(nm,lx,ly)});
  const H0=wmNode(here);if(H0){const b=Math.abs(Math.sin(ts/260))*8;g.font="30px serif";g.textAlign="center";g.fillText("📍",H0.x,H0.y-20-b)}};

// =====================================================================================
// PANELES DE EXPLORACIÓN CON MANDO Y TECLADO (Equipo y Mochila, Pokédex, Controles, Tiendas…)
// Mientras hay un panel abierto, la cruceta/flechas mueven la selección (no al personaje), A pulsa y B vuelve o cierra.
// =====================================================================================
const XOV_IDS=["exTeam","exDexP","exCtl"];
function exOverlay(){for(const id of XOV_IDS){const e=$(id);if(e&&!e.hidden&&e.offsetParent!==null)return e}return null}
const XOV_SEL='button:not([disabled]),[data-xgi],[data-xg],[data-xun],[data-xub],[data-xuse],input,select,[data-xsb],[data-xss]';
function ovItems(ov){return [...ov.querySelectorAll(XOV_SEL)].filter(el=>el.offsetParent!==null&&!el.closest("[hidden]"))}
function ovCur(ov){const a=document.activeElement;return a&&ov.contains(a)&&a.matches(XOV_SEL)?a:ov.querySelector(".gpf")}
let OVL=null,OVSTK=[];// OVSTK: desde dónde has entrado en cada pantalla (para volver al mismo sitio con B)// último elemento seleccionado: sus datos, su texto y su posición
function ovDesc(el,ov){const L=ovItems(ov),d={};for(const k in el.dataset)d[k]=el.dataset[k];return {d:d,t:(el.textContent||"").trim().slice(0,40),i:L.indexOf(el),card:el.classList.contains("xgc"),ci:el.classList.contains("xgc")?[...ov.querySelectorAll(".xgc")].indexOf(el):-1,inT:el.classList.contains("on")}}
function ovRestore(ov){const L=ovItems(ov);if(!L.length)return null;const o=OVL;if(!o)return L[0];
  // tarjetas de Pokémon: se queda en la misma casilla (aunque haya cambiado el Pokémon que hay en ella)
  if(o.card){const C=[...ov.querySelectorAll(".xgc")].filter(e=>e.offsetParent!==null);if(C.length)return C[Math.min(o.ci,C.length-1)]}
  const same=L.find(e=>{const ks=Object.keys(o.d);return ks.length&&ks.every(k=>e.dataset[k]===o.d[k])});if(same)return same;
  const tx=L.find(e=>(e.textContent||"").trim().slice(0,40)===o.t&&o.t);if(tx)return tx;return L[Math.max(0,Math.min(o.i,L.length-1))]}
function ovFocus(el){document.querySelectorAll(".gpf").forEach(x=>x.classList.remove("gpf"));if(!el)return;try{const ov=el.closest(XOV_IDS.map(i=>"#"+i).join(","));if(ov)OVL=ovDesc(el,ov)}catch(e){}if(!el.matches("button,input,select")&&!el.hasAttribute("tabindex"))el.setAttribute("tabindex","-1");el.classList.add("gpf");try{el.focus({preventScroll:true})}catch(e){}try{el.scrollIntoView({block:"nearest"})}catch(e){}}
function ovMove(ov,d){const L=ovItems(ov);if(!L.length)return;const cur=ovCur(ov);if(!cur||!L.includes(cur)){ovFocus(L[0]);return}
  const r=cur.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let best=null,bd=1e9;
  L.forEach(b=>{if(b===cur)return;const q=b.getBoundingClientRect(),x=q.left+q.width/2-cx,y=q.top+q.height/2-cy;const ok=d==="u"?y<-4:d==="d"?y>4:d==="l"?x<-4:x>4;if(!ok)return;const s=(d==="u"||d==="d")?Math.abs(y)+Math.abs(x)*2.2:Math.abs(x)+Math.abs(y)*2.2;if(s<bd){bd=s;best=b}});
  if(best){ovFocus(best);snd("ui")}}
function ovBack(ov){const vis=[...ov.querySelectorAll("button")].filter(b=>b.offsetParent!==null);const back=vis.find(b=>/Volver|Atrás|Cancelar/i.test(b.textContent))||vis.find(b=>/Cerrar|Listo|Salir/i.test(b.textContent));if(back){const ret=OVSTK.pop();back.click();setTimeout(()=>{const o2=exOverlay();if(o2){if(ret)OVL=ret;const r=ovRestore(o2);if(r)ovFocus(r)}},60);return}ov.hidden=true;snd("ui")}
window.addEventListener("keydown",e=>{if(!EX.on||EX.title||EX.bind||exMenuOpen())return;const ov=exOverlay();if(!ov)return;const t=e.target,inInput=t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName);
  const a=exAct(e.key),dir=["u","d","l","r"].includes(a)?a:{ArrowUp:"u",ArrowDown:"d",ArrowLeft:"l",ArrowRight:"r"}[e.key];
  if(inInput&&e.key!=="Escape"&&!(dir&&(e.key==="ArrowUp"||e.key==="ArrowDown")))return;
  if(dir){e.preventDefault();e.stopPropagation();ovMove(ov,dir);return}
  if(a==="a"||e.key==="Enter"){const c=ovCur(ov);if(c){e.preventDefault();e.stopPropagation();OVSTK.push(ovDesc(c,ov));if(OVSTK.length>8)OVSTK.shift();c.click();setTimeout(()=>{const o2=exOverlay();if(o2&&!ovCur(o2)){const r=ovRestore(o2);if(r)ovFocus(r)}},60)}else{e.preventDefault();e.stopPropagation();const L=ovItems(ov);if(L.length)ovFocus(L[0])}return}
  if(a==="b"||e.key==="Escape"){e.preventDefault();e.stopPropagation();ovBack(ov);return}
  if(a)e.stopPropagation()},true);
// al abrir un panel con el mando, se selecciona el primer elemento
setInterval(()=>{if(uiDlgOpen())return;const ov=exOverlay();if(!ov){OVL=null;OVSTK=[];return}if(!GP.on&&!OVL)return;if(!ovCur(ov)){const r=ovRestore(ov);if(r)ovFocus(r)}},150);

// =====================================================================================
// EQUIPO: cambiar de posición a un Pokémon sin arrastrar (sirve con mando, teclado, ratón y pantalla táctil)
// En su ficha: «🔀 Cambiar de posición» → eliges con quién. Con el mando: botón X sobre una tarjeta y luego A sobre otra.
// =====================================================================================
let XSW=null;
function xswStart(n){XSW=n;snd("ui");xgPanel();setTimeout(()=>{const ov=exOverlay();if(!ov)return;const c=[...ov.querySelectorAll(".xgc")].find(b=>b.dataset.xg!==n);if(c)ovFocus(c)},80)}
function xswDo(a,b){xgRun(()=>{let T=(S.team||[]).map(x=>x&&S.owned[x]?x:"");while(T.length<6)T.push("");const ia=T.indexOf(a),ib=T.indexOf(b);
    if(ia<0)return;if(ib>=0){T[ia]=b;T[ib]=a}else{T[ia]=b}S.team=T.filter(x=>x).concat(["","","","","",""]).slice(0,6);save()});
  snd("lvl");toast("🔀 "+nk(a)+" y "+nk(b)+" han cambiado de posición");XSW=null;xgPanel();try{const ov=exOverlay();if(ov){const r=ovRestore(ov);if(r)ovFocus(r)}}catch(e){}try{updTeam()}catch(e){}}
window.addEventListener("click",e=>{if(!XSW)return;const c=e.target.closest&&e.target.closest(".xgc[data-xg]");if(!c)return;e.stopPropagation();e.preventDefault();const n=c.dataset.xg;if(n===XSW){XSW=null;snd("ui");xgPanel();return}xswDo(XSW,n)},true);
{const _xp=xgPanel;xgPanel=function(){const r=_xp.apply(this,arguments);try{const box=$("exTeam");if(!box)return r;
  if(XSW){const h=box.querySelector(".xgh");if(h&&!box.querySelector(".xswb")){const d=document.createElement("div");d.className="xswb";d.innerHTML='🔀 Elige con quién cambiar de posición a <b>'+esc(nk(XSW))+'</b> <button type="button" class="alt" data-xswx="1">Cancelar</button>';h.after(d);d.querySelector("[data-xswx]").onclick=ev=>{ev.stopPropagation();XSW=null;xgPanel()}}
    box.querySelectorAll(".xgc").forEach(c=>c.classList.toggle("xgsw",c.dataset.xg===XSW))}
  else{const h=box.querySelector(".xgs");if(h&&!box.querySelector(".xswh")&&box.querySelector(".xgl .xgc.on")){const t=document.createElement("small");t.className="mut xswh";t.textContent="🎮 Con el mando: pulsa X sobre un Pokémon y después A sobre otro para cambiarlos de posición.";box.querySelector(".xgl").after(t)}}}catch(e){}return r}}
{const _xf=xfOpen;xfOpen=function(n){const r=_xf.apply(this,arguments);try{const box=$("exTeam"),inT=xgRun(()=>(S.team||[]).includes(n));const h=box&&box.querySelector(".xgh");
  if(h&&inT&&!h.querySelector("[data-xsw]")){const b=document.createElement("button");b.type="button";b.className="red";b.dataset.xsw="1";b.textContent="🔀 Cambiar de posición";b.onclick=ev=>{ev.stopPropagation();xswStart(n)};h.insertBefore(b,h.lastElementChild)}}catch(e){}return r}}
// botón X del mando sobre una tarjeta: empezar el cambio
{const _gp=gpPoll;gpPoll=function(){try{const L=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[];const gp=L[0];if(gp&&!GP.bind){const x=!!(gp.buttons[2]&&gp.buttons[2].pressed);
  if(x&&!GP.xPrev){const ov=exOverlay(),c=ov&&ovCur(ov);if(c&&c.classList.contains("xgc")){if(XSW&&XSW!==c.dataset.xg)xswDo(XSW,c.dataset.xg);else if(xgRun(()=>(S.team||[]).includes(c.dataset.xg)))xswStart(c.dataset.xg)}}GP.xPrev=x}}catch(e){}return _gp.apply(this,arguments)}}

// =====================================================================================
// LÍMITE DE NIVEL EN EXPLORACIÓN SIN BLOQUEAR: los Pokémon por encima del límite luchan al nivel del límite
// (su nivel real no cambia; no ganan experiencia hasta que consigas la medalla siguiente)
// =====================================================================================
{const _cb=capBlock;capBlock=function(){if(typeof XGSW!=="undefined"&&XGSW)return false;return _cb.apply(this,arguments)}}
{const _sb=startBattle;startBattle=function(){if(typeof XGSW!=="undefined"&&XGSW){const cap=lvCap(),saved=[];
    try{(S.team||[]).forEach(n=>{if(n&&S.owned[n]){const d=lvd(n);if(d.l>cap){saved.push([d,d.l]);d.l=cap}}})}catch(e){}
    try{return _sb.apply(this,arguments)}finally{saved.forEach(([d,l])=>{d.l=l})}}
  return _sb.apply(this,arguments)}}
// en el panel del equipo se avisa de a qué nivel luchan
{const _xp=xgPanel;xgPanel=function(){const r=_xp.apply(this,arguments);try{const box=$("exTeam");if(!box)return r;const cap=xgRun(()=>lvCap());
  box.querySelectorAll(".xgc").forEach(c=>{const l=xgRun(()=>lvd(c.dataset.xg).l);if(l>cap&&!c.querySelector(".xgcapl")){const s=document.createElement("small");s.className="xgcapl";s.textContent="🔒 lucha a Nv"+cap;c.appendChild(s)}})}catch(e){}return r}}
// =====================================================================================
// VOLVER AL MENÚ: los paneles abiertos desde el menú lateral (Equipo, Pokédex, Controles) tienen «◀ Menú»
// que cierra el panel y vuelve a abrir el menú en la misma opción. B (mando) y Esc también vuelven al menú.
// =====================================================================================
let XFM=null;// opción del menú desde la que se abrió el panel actual
{const _md=exMenuDo;exMenuDo=function(k){const r=_md.apply(this,arguments);XFM=["team","dex","ctl"].includes(k)?k:null;setTimeout(xfmBtn,30);return r}}
function xfmBtn(){const ov=exOverlay();if(!ov||!XFM)return;if(ov.querySelector("[data-xmenu]"))return;
  const vis=[...ov.querySelectorAll("button")].filter(b=>b.offsetParent!==null),cl=vis.find(b=>/^\s*(✕\s*)?(Cerrar|Listo)/i.test(b.textContent));
  const b=document.createElement("button");b.type="button";b.className="alt xmenub";b.dataset.xmenu="1";b.textContent="◀ Menú";b.title="Volver al menú";
  if(cl&&cl.parentNode){cl.parentNode.insertBefore(b,cl)}else ov.insertBefore(b,ov.firstChild)}
function xfmBack(){const k=XFM;XFM=null;OVSTK=[];OVL=null;XOV_IDS.forEach(id=>{const e=$(id);if(e)e.hidden=true});exMenu(true);
  const m=$("exMenu");if(m&&k){m.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.exm===k))}}
window.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-xmenu]");if(!b)return;e.preventDefault();e.stopPropagation();xfmBack()},true);
// el panel se redibuja a menudo: se vuelve a poner el botón; si el panel se cierra, se olvida el menú
setInterval(()=>{if(!XFM){document.querySelectorAll("[data-xmenu]").forEach(b=>b.remove());return}const ov=exOverlay();if(!ov){if(!exMenuOpen()&&!(XFM==="map"&&typeof WM!=="undefined"&&WM.open))XFM=null;return}xfmBtn()},150);
// B / Esc: si no hay un «Volver» propio del panel (una ficha, una subpantalla…), vuelve al menú en vez de cerrar
{const _ob=ovBack;ovBack=function(ov){if(XFM&&ov){const vis=[...ov.querySelectorAll("button")].filter(b=>b.offsetParent!==null&&!b.dataset.xmenu);if(!vis.some(b=>/Volver|Atrás|Cancelar/i.test(b.textContent))){snd("ui");xfmBack();return}}return _ob.apply(this,arguments)}}
// =====================================================================================
// ACCIONES CONFIGURABLES: «Volver al menú anterior» y «Abrir la mochila» (teclado y mando)
// =====================================================================================
EXKB0.back=["Backspace",""];EXKN.back="Volver al menú anterior";
EXPAD0.bag=3;EXPADN.bag="Abrir la mochila";EXPAD0.back=4;EXPADN.back="Volver al menú anterior";
// en combate: de los ataques vuelve a LUCHAR/MOCHILA/POKÉMON/HUIR (o sale de la mochila / del cambio de Pokémon)
function exBackBattle(){const vis=b=>b&&b.offsetParent!==null;const L=[...document.querySelectorAll('#menu .bcback,#menu .mvback')].filter(vis);
  const bk=L[0]||[...document.querySelectorAll("#menu button")].filter(vis).find(b=>/Atrás|Volver|Cancelar/i.test(b.textContent));if(bk){bk.click();return true}return false}
function exBackAct(){if(typeof fcd!=="undefined"&&fcd)return exBackBattle();
  if(exMenuOpen()){exMenuClose();return true}
  if(typeof XSH!=="undefined"&&XSH.open){xsClose();return true}
  if(typeof WM!=="undefined"&&WM.open){wmHide();if(XFM==="map")xfmBack();return true}
  const ov=exOverlay();if(ov){ovBack(ov);return true}
  return false}
function exBagAct(){if(typeof fcd!=="undefined"&&fcd||!EX.on||EX.dlg||EX.cut||EX.trans||EX.choice)return;
  if(exMenuOpen())exMenuClose();XFM=null;
  ["exDexP","exCtl"].forEach(id=>{const e=$(id);if(e)e.hidden=true});if(typeof WM!=="undefined"&&WM.open)wmHide();if(typeof XSH!=="undefined"&&XSH.open)xsClose();
  exBagToggle()}
// el mapa abierto desde el menú también vuelve al menú
{const _md=exMenuDo;exMenuDo=function(k){const r=_md.apply(this,arguments);if(k==="map")XFM="map";return r}}
// teclado
window.addEventListener("keydown",e=>{if(!EX.cv||!EX.cv.isConnected||EX.title||EX.bind||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName))return;
  const a=exAct(e.key);if(a==="back"){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat&&exBackAct())snd("ui");return}
  if(a==="bag"&&!e.repeat&&(exMenuOpen()||exOverlay()||(typeof WM!=="undefined"&&WM.open))){e.preventDefault();e.stopImmediatePropagation();exBagAct()}},true);
// mando
{const _gp=gpPoll;gpPoll=function(){const L=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[],gp=L[0];let eb=false,eg=false;
  if(gp&&!GP.bind){const P0=exPad(),pr=i=>i>=0&&!!(gp.buttons[i]&&gp.buttons[i].pressed);GP.p3=GP.p3||{};eb=pr(P0.back)&&!GP.p3.back;eg=pr(P0.bag)&&!GP.p3.bag;GP.p3.back=pr(P0.back);GP.p3.bag=pr(P0.bag)}
  const r=_gp.apply(this,arguments);try{if(eb&&exBackAct())snd("ui");if(eg)exBagAct()}catch(e){}return r}}
// =====================================================================================
// VENTANAS DE CONFIRMACIÓN (¿Activar…? ¿Borrar…?): con el mando o el teclado se elige entre sus botones,
// y el panel de detrás se queda quieto mientras están abiertas
// =====================================================================================
const uiDlgOpen=()=>{const d=[...document.querySelectorAll(".uidlg")].find(x=>!x.hidden&&x.getClientRects().length>0);return d||null};
{const _eo=exOverlay;exOverlay=function(){if(uiDlgOpen())return null;return _eo.apply(this,arguments)}}
function udBtns(d){return [...d.querySelectorAll("button")].filter(b=>b.offsetParent!==null&&!b.disabled)}
function udMove(d,dir){const L=udBtns(d);if(!L.length)return;const a=document.activeElement;let i=L.indexOf(a);
  if(a&&a.classList&&a.classList.contains("uidin")){if(dir==="d"||dir==="r"){L[L.length-1].focus();udMark(L[L.length-1])}return}
  if(i<0)i=L.length-1;else i=(i+(dir==="l"||dir==="u"?-1:1)+L.length)%L.length;L[i].focus();udMark(L[i]);snd("ui")}
function udMark(b){document.querySelectorAll(".uidlg .gpf").forEach(x=>x.classList.remove("gpf"));if(b)b.classList.add("gpf")}
// teclado: flechas entre los botones (Intro y Esc ya los entiende la ventana)
window.addEventListener("keydown",e=>{const d=uiDlgOpen();if(!d)return;const t=e.target;if(t&&t.classList&&t.classList.contains("uidin")&&(e.key==="ArrowLeft"||e.key==="ArrowRight"))return;
  const dir={ArrowUp:"u",ArrowDown:"d",ArrowLeft:"l",ArrowRight:"r"}[e.key];if(dir){e.preventDefault();e.stopImmediatePropagation();udMove(d,dir);return}
  if(e.key==="Enter"&&t&&t.tagName==="BUTTON"&&d.contains(t)){e.preventDefault();e.stopImmediatePropagation();t.click()}},true);
// mando: cruceta/stick mueve, A pulsa el botón elegido, B cancela
{const _gp=gpPoll;gpPoll=function(){const d=uiDlgOpen();if(!d||d.querySelector(".uidin"))return _gp.apply(this,arguments);
  const L=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[],gp=L[0];if(!gp)return;const P0=exPad(),pr=i=>i>=0&&!!(gp.buttons[i]&&gp.buttons[i].pressed),ax=gp.axes||[];
  let dir=null;if(pr(12)||ax[1]<-.5)dir="u";else if(pr(13)||ax[1]>.5)dir="d";else if(pr(14)||ax[0]<-.5)dir="l";else if(pr(15)||ax[0]>.5)dir="r";
  if(dir&&dir!==GP.udDir)udMove(d,dir);GP.udDir=dir;
  const ea=pr(P0.a)&&!GP.prev[P0.a],eb=pr(P0.b)&&!GP.prev[P0.b];for(let i=0;i<gp.buttons.length;i++)GP.prev[i]=pr(i);
  if(ea){const B=udBtns(d),a=document.activeElement;(B.includes(a)?a:B[B.length-1]).click();snd("ui")}
  else if(eb){const n=d.querySelector('[data-u="0"]')||udBtns(d).pop();if(n)n.click();snd("ui")}}}
// al abrirse, se marca el botón por defecto para que se vea qué está elegido
setInterval(()=>{const d=uiDlgOpen();if(!d||d.querySelector(".gpf"))return;const a=document.activeElement;if(a&&d.contains(a)&&a.tagName==="BUTTON")udMark(a)},150);
