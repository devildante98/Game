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
  const pr=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed),ax=gp.axes||[];
  // configurar un botón: el siguiente botón pulsado se asigna a la acción
  if(GP.bind){for(let i=0;i<gp.buttons.length;i++)if(pr(i)&&!GP.prev[i]){const P0=exPad();for(const k in P0)if(P0[k]===i&&k!==GP.bind)P0[k]=-1;P0[GP.bind]=i;S.exPad=P0;save();GP.bind=null;snd("lvl");exCtlUI();break}
    for(let i=0;i<gp.buttons.length;i++)GP.prev[i]=pr(i);return}
  const P0=exPad();
  // dirección: cruceta (12-15) o stick
  let d=null;if(pr(12)||ax[1]<-.5)d="u";else if(pr(13)||ax[1]>.5)d="d";else if(pr(14)||ax[0]<-.5)d="l";else if(pr(15)||ax[0]>.5)d="r";
  const DK={u:"ArrowUp",d:"ArrowDown",l:"ArrowLeft",r:"ArrowRight"},inBattle=typeof fcd!=="undefined"&&fcd;
  if(d!==GP.dir){if(GP.dir&&!inBattle)gpKey("keyup",gpKeyOf(GP.dir));if(d){if(inBattle)gpNav(d);else gpKey("keydown",gpKeyOf(d))}GP.dir=d;GP.rep=performance.now()+380}
  else if(d&&(inBattle||exMenuOpen()||EX.choice)&&performance.now()>GP.rep){GP.rep=performance.now()+160;if(inBattle)gpNav(d);else gpKey("keydown",gpKeyOf(d))}
  const edge=k=>{const i=P0[k];return i>=0&&pr(i)&&!GP.prev[i]},rel=k=>{const i=P0[k];return i>=0&&!pr(i)&&GP.prev[i]};
  if(inBattle){if(edge("a"))gpClick();if(edge("b")){const bk=document.querySelector('#menu button[data-k="b"],#menu .mvback');if(bk)bk.click()}}
  else{
    if(edge("a"))gpKey("keydown",gpKeyOf("a"));
    if(edge("b")){if(exMenuOpen())gpKey("keydown","Escape");else{const ov=["exTeam","exDexP","exCtl"].map($).find(x=>x&&!x.hidden);if(ov){ov.hidden=true;snd("ui")}else if(typeof WM!=="undefined"&&WM.open)wmHide();else gpKey("keydown",gpKeyOf("b"))}}
    if(rel("b"))gpKey("keyup",gpKeyOf("b"));
    if(edge("menu"))gpKey("keydown",gpKeyOf("menu"));
    if(edge("sp"))gpKey("keydown",gpKeyOf("sp"))}
  for(let i=0;i<gp.buttons.length;i++)GP.prev[i]=pr(i)}
// en los combates: la cruceta mueve la selección entre los botones y A pulsa
function gpBtns(){return [...document.querySelectorAll("#menu button:not([disabled])")].filter(b=>b.offsetParent)}
function gpNav(d){const L=gpBtns();if(!L.length)return;let i=L.indexOf(document.activeElement);if(i<0){L[0].focus();return}
  const r=L[i].getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let best=null,bd=1e9;
  L.forEach((b,j)=>{if(j===i)return;const q=b.getBoundingClientRect(),x=q.left+q.width/2-cx,y=q.top+q.height/2-cy;const ok=d==="u"?y<-4:d==="d"?y>4:d==="l"?x<-4:x>4;if(!ok)return;const s=(d==="u"||d==="d")?Math.abs(y)+Math.abs(x)*2:Math.abs(x)+Math.abs(y)*2;if(s<bd){bd=s;best=b}});
  if(best){best.focus();snd("ui")}}
function gpClick(){const L=gpBtns();const a=document.activeElement;if(a&&L.includes(a)){a.click();return}if(L[0])L[0].focus();else{const s=document.querySelector("#bmsg,#say,.bsay");if(s)s.click()}}
(function gpLoop(){try{gpPoll()}catch(e){}requestAnimationFrame(gpLoop)})();
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
