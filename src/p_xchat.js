// =====================================================================================
// CHAT DE EXPLORACIÓN (independiente del chat del juego base) Y ATAJOS DE TECLADO PARA CADA FUNCIÓN
// · Desde el botón 💬 (donde los emoticonos) o con la tecla T se escribe un mensaje corto: aparece unos segundos
//   en un bocadillo sobre tu cabeza y lo ven los jugadores que están en tu mismo mapa. No se guarda en ningún sitio.
// · Atajos nuevos (se cambian en Controles): Chat, Pokédex, Tarjeta, Guardar y Pantalla completa (el Mapa, el minimapa, la Mochila y los Controles ya tenían).
// =====================================================================================
const XC_MAX=60,XC_MS=7000,XC={log:[],last:0};
function xcClean(t){try{t=chClean(t)}catch(e){t=String(t||"").replace(/[\u0000-\u001f]/g," ").replace(/\s+/g," ").trim()}return t.replace(/[<>]/g,"").slice(0,XC_MAX)}
function xcLog(n,t,me){XC.log.push({n:n,t:t,me:!!me});if(XC.log.length>6)XC.log.shift();const p=XO.panel&&XO.panel.querySelector(".xclog");if(p)p.innerHTML=xcLogH()}
const xcLogH=()=>XC.log.map(m=>'<div'+(m.me?' class="me"':'')+'><b>'+esc(m.n)+':</b> '+esc(m.t)+'</div>').join("");
function xcSend(t){t=xcClean(t);if(!t)return false;if(Date.now()-XC.last<1200){toast("Espera un momento antes de enviar otro mensaje");return false}XC.last=Date.now();XO.msg=t;XO.msgT=Date.now();XO.emoT=0;snd("ui");xcLog(pvNick(),t,true);return true}
// los mensajes de los demás: se anota la hora a la que NOS llegan (los relojes de cada móvil pueden no coincidir)
{const _p=xoPeers;xoPeers=function(peers){const r=_p.apply(this,arguments);try{(peers||[]).forEach(p=>{const o=XO.peers[p.peer],q=p.presence;if(!o||!q)return;const mt=+q.mt||0,m=mt?xcClean(q.m):"";
    if(m&&mt!==o.mt){o.mt=mt;o.m=m;o.mAt=Date.now();xcLog(o.n,m)}else if(!m)o.m=""})}catch(e){}return r}}
// bocadillo de texto sobre la cabeza
function xcWrap(g,t,w){const L=[];let cur="";t.split(" ").forEach(wd=>{while(g.measureText(wd).width>w){let i=wd.length;while(i>1&&g.measureText(wd.slice(0,i)).width>w)i--;if(cur){L.push(cur);cur=""}L.push(wd.slice(0,i));wd=wd.slice(i)}
    const n=cur?cur+" "+wd:wd;if(g.measureText(n).width>w&&cur){L.push(cur);cur=wd}else cur=n});if(cur)L.push(cur);if(L.length>3){L.length=3;L[2]=L[2].replace(/.{0,2}$/,"…")}return L}
function xcBubble(g,X,Y,t,W){g.font="bold 8px system-ui,sans-serif";g.textAlign="left";g.textBaseline="top";const L=xcWrap(g,t,118),tw=Math.ceil(Math.max(...L.map(l=>g.measureText(l).width))),w=tw+10,h=L.length*10+7;
  let x=Math.round(X-w/2);x=Math.max(3,Math.min(W-w-3,x));const y=Math.round(Y-h-5),R=(a,b,c,d,col)=>{g.fillStyle=col;g.fillRect(a,b,c,d)};
  R(x+1,y-1,w-2,h+2,"#202838");R(x-1,y+1,w+2,h-2,"#202838");R(x,y,w,h,"#202838");R(x+1,y,w-2,h,"#fff");R(x,y+1,w,h-2,"#fff");R(x+1,y+h-2,w-2,2,"#d8e0ee");
  const tx=Math.max(x+4,Math.min(x+w-8,Math.round(X)-2));R(tx-1,y+h,6,1,"#202838");R(tx,y+h,4,1,"#fff");R(tx,y+h+1,4,1,"#202838");R(tx+1,y+h+1,2,1,"#fff");R(tx+1,y+h+2,2,1,"#202838");
  g.fillStyle="#202838";L.forEach((l,i)=>g.fillText(l,x+5,y+4+i*10))}
{const _d=exDraw;exDraw=function(ts){const r=_d.apply(this,arguments);try{if(EX.title||!EX.cv||!EX.cam)return r;const g=EX.cv.getContext("2d"),W=EX.cv.width/EXS;g.setTransform(EXS,0,0,EXS,0,0);const cx=Math.round(EX.cam[0]*2)/2,cy=Math.round(EX.cam[1]*2)/2,now=Date.now();
    if(xoOn()&&XO.room)Object.values(XO.peers).forEach(o=>{if(o.m&&now-(o.mAt||0)<XC_MS)xcBubble(g,o.dx*EXTL-cx+16,o.dy*EXTL-cy-12,o.m,W)});
    if(XO.msg&&now-XO.msgT<XC_MS)xcBubble(g,EX.px*EXTL-cx+16,EX.py*EXTL-cy-12,XO.msg,W)}catch(e){}return r}}
// el panel 💬 gana una caja para escribir y los últimos mensajes
{const _p=xoPanel;xoPanel=function(o){_p.apply(this,arguments);const d=XO.panel;if(!d)return;const row=document.createElement("div");row.className="xcbox";
    row.innerHTML='<div class="xclog">'+xcLogH()+'</div><div class="xcrow"><input class="xcin" type="text" maxlength="'+XC_MAX+'" placeholder="Escribe un mensaje…" autocomplete="off" enterkeyhint="send" aria-label="Mensaje"><button type="button" class="grn xcsend">Enviar</button></div>';
    d.insertBefore(row,d.querySelector(".xoemo"));const inp=row.querySelector(".xcin"),go=()=>{if(xcSend(inp.value)){xoClose();try{EX.cv.focus({preventScroll:true})}catch(e){}}};
    row.querySelector(".xcsend").addEventListener("click",e=>{e.stopPropagation();go()});row.addEventListener("click",e=>e.stopPropagation());
    inp.addEventListener("keydown",e=>{e.stopPropagation();if(e.key==="Enter"){e.preventDefault();go()}else if(e.key==="Escape"){e.preventDefault();xoClose();try{EX.cv.focus({preventScroll:true})}catch(_){}}});
    inp.addEventListener("keyup",e=>e.stopPropagation());EX.keys={};EX.kst=[]}}
function xcOpen(){if(XO.panel){xoClose();return}xoPanel(null);const i=XO.panel&&XO.panel.querySelector(".xcin");if(i)setTimeout(()=>{try{i.focus()}catch(e){}},30)}
// mientras se escribe, el personaje no se mueve
setInterval(()=>{try{if(XO.panel&&document.activeElement&&document.activeElement.classList.contains("xcin")){EX.keys={};EX.kst=[]}}catch(e){}},100);
// ---------- una tecla para cada función ----------
Object.assign(EXKB0,{chat:["t",""],dex:["o",""],card:["k",""],save:["g",""],fs:["f",""]});
Object.assign(EXKN,{chat:"Chat (escribir un mensaje)",dex:"Pokédex",card:"Tarjeta de entrenador",save:"Guardar partida",fs:"Pantalla completa"});
EXPAD0.chat=6;EXPADN.chat="Chat (escribir un mensaje)";EXPAD0.wm=7;EXPADN.wm="Mapa de la región";
function xcFree(){try{return !!(EX.on&&!EX.title&&!EX.dlg&&!EX.cut&&!EX.trans&&!EX.battle&&!EX.choice&&!EX.bind&&!(typeof GP!=="undefined"&&GP.bind)&&!(typeof fcd!=="undefined"&&fcd)&&!exPaused())}catch(e){return false}}
function xcKeyDo(a){if(a==="fs"){if(EX.on&&!EX.bind){exFsToggle();return true}return false}if(!xcFree())return false;EX.keys={};EX.kst=[];
  if(a==="chat")xcOpen();else if(a==="card")tcOpen();else if(a==="wm")exMenuDo("map");else exMenuDo(a);return true}
window.addEventListener("keydown",e=>{try{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||XO.panel)return;const t=e.target;if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable))return;
  const a=exAct(e.key);if(a&&["chat","dex","card","save","fs"].includes(a)&&xcKeyDo(a))e.preventDefault()}catch(_){}});
{const _gp=gpPoll;gpPoll=function(){let ec=false,em=false;try{const L=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[],gp=L[0];if(gp&&!GP.bind){const P0=exPad(),pr=i=>i>=0&&!!(gp.buttons[i]&&gp.buttons[i].pressed),c=pr(P0.chat),m=pr(P0.wm);ec=c&&!GP.pCh;em=m&&!GP.pMp;GP.pCh=c;GP.pMp=m}}catch(e){}
  const r=_gp.apply(this,arguments);try{if(ec&&!XO.panel)xcKeyDo("chat");if(em)xcKeyDo("wm")}catch(e){}return r}}
