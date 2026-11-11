// ================= Exploración: minimapa de la zona =================
// Se dibuja la zona entera en pequeño con las mismas casillas del mapa (colores reales de cada región),
// y encima: tu posición, los entrenadores, las salidas y el trozo de mapa que ves en pantalla.
const EXMM={map:null,base:null,S:4,on:true,big:false,t:0};
try{EXMM.on=localStorage.getItem("exmm")!=="0"}catch(e){}
function exMiniBase(){const M=EX.M;if(!M||!EX.grid)return null;const S=EXMM.S,H=EX.grid.length,W=EX.grid[0].length;
  const c=document.createElement("canvas");c.width=W*S;c.height=H*S;const g=c.getContext("2d");g.imageSmoothingEnabled=true;g.imageSmoothingQuality="high";
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=exAt(x,y),w=M.w&&M.w[ch];let t=null;
    try{t=ch==="w"?xCavePuddle(0,0):w&&w.look==="ladder"?xLadder():w&&w.look==="cave"?xCaveMouth():xGround(x,y,0)}catch(e){}
    if(t)g.drawImage(t,0,Math.max(0,t.height-32),32,32,x*S,y*S,S,S)}
  // edificios: la misma pieza que en el mapa, reducida
  (M.bld||[]).forEach(b=>{try{const im=xBld(b),k=S/32;g.drawImage(im,b.x*S,(b.y+b.h)*S-im.height*k,im.width*k,im.height*k)}catch(e){}});
  return c}
function exMiniUI(){const sc=(EX.cv&&EX.cv.closest(".exscr"))||document.querySelector("#explPB .exscr");if(!sc)return null;let w=$("exMini");if(w&&!sc.contains(w)){sc.appendChild(w);["exMiniB","exWmB"].forEach(i=>{const e=$(i);if(e)sc.appendChild(e)})}
  if(!w){sc.insertAdjacentHTML("beforeend",'<div id="exMini" class="exmini" hidden title="Minimapa · tócalo para ampliarlo"><canvas id="exMiniCv"></canvas><b id="exMiniN"></b></div>'+
      '<button type="button" class="exfsb exmmb" id="exMiniB" title="Mostrar u ocultar el minimapa" aria-label="Minimapa">🧭</button><button type="button" class="exfsb exwmb" id="exWmB" title="Mapa de la región" aria-label="Mapa de la región">🗺️</button>');
    w=$("exMini");w.addEventListener("click",e=>{e.stopPropagation();EXMM.big=!EXMM.big;snd("ui");exMiniDraw(true)});
    $("exMiniB").addEventListener("click",e=>{e.stopPropagation();exMiniToggle()});$("exWmB").addEventListener("click",e=>{e.stopPropagation();if(EX.dlg||EX.cut||EX.trans)return;wmShow()});setTimeout(()=>{try{exKeysTxt()}catch(e){}},0)}
  return w}
function exMiniToggle(){EXMM.on=!EXMM.on;EXMM.big=false;try{localStorage.setItem("exmm",EXMM.on?"1":"0")}catch(e){}snd("ui");exMiniDraw(true);try{EX.cv.focus({preventScroll:true})}catch(e){}}
function exMiniDraw(force){const w=exMiniUI();if(!w)return;const bt=$("exMiniB");if(bt)bt.classList.toggle("on",EXMM.on);
  const hide=!EXMM.on||!EX.on||EX.title||!!EX.dlg||!!EX.trans||(!!EX.banner&&!EXMM.big)||!EX.M||!EX.grid;
  w.hidden=hide;w.classList.toggle("big",EXMM.big);if(hide)return;
  if(EXMM.map!==EX.map||!EXMM.base||EXMM.grid!==EX.grid){EXMM.base=exMiniBase();EXMM.map=EX.map;EXMM.grid=EX.grid;$("exMiniN").textContent=EX.M.n||""}
  const B=EXMM.base;if(!B)return;const cv=$("exMiniCv"),S=EXMM.S,k=EXMM.big?3:2;
  if(cv.width!==B.width*k||cv.height!==B.height*k){cv.width=B.width*k;cv.height=B.height*k}
  const g=cv.getContext("2d"),Z=S*k,now=performance.now();g.imageSmoothingEnabled=false;g.clearRect(0,0,cv.width,cv.height);g.drawImage(B,0,0,cv.width,cv.height);
  const dot=(x,y,r,fill,line)=>{g.beginPath();g.arc((x+.5)*Z,(y+.5)*Z,r,0,Math.PI*2);g.fillStyle=fill;g.fill();if(line){g.lineWidth=Math.max(1.5,k*.9);g.strokeStyle=line;g.stroke()}};
  // salidas y puertas
  const M=EX.M;for(let y=0;y<EX.grid.length;y++)for(let x=0;x<EX.grid[0].length;x++){const ch=exAt(x,y),wp=M.w&&M.w[ch];if(!wp)continue;
    g.fillStyle="#2b2440";g.fillRect(x*Z+Z*.15-1,y*Z+Z*.15-1,Z*.7+2,Z*.7+2);g.fillStyle=wp.look==="door"||wp.look==="mat"?"#ffd34d":"#5ad2ff";g.fillRect(x*Z+Z*.15,y*Z+Z*.15,Z*.7,Z*.7)}
  // personas: entrenadores sin vencer en rojo, el resto en blanco
  (EX.npcs||[]).forEach(n=>{if(n.hide||n.gone)return;const tr=!n.story&&n.t&&!n.beat;dot(n.px,n.py,Math.max(2.2,Z*.32),tr?"#ff4d5e":"#f4f1ff","#2b2440")});
  // lo que se ve en pantalla
  try{const W=EX.cv.width/EXS,H=EX.cv.height/EXS,[cx,cy]=exCam(W,H),q=Z/EXTL;g.lineWidth=Math.max(1,k*.6);g.strokeStyle="rgba(255,255,255,.85)";g.setLineDash([Z*.6,Z*.4]);
    g.strokeRect(Math.max(0,cx*q)+.5,Math.max(0,cy*q)+.5,Math.min(cv.width,W*q)-1,Math.min(cv.height,H*q)-1);g.setLineDash([])}catch(e){}
  // tú (parpadea suavemente)
  const a=.6+.4*Math.sin(now/220);dot(EX.px,EX.py,Math.max(3,Z*.42)*(1+.18*a),"#ff3a3a","#fff")}
{const _d=exDraw;exDraw=function(ts){const r=_d.apply(this,arguments);try{if(ts-EXMM.t>90){EXMM.t=ts;exMiniDraw()}}catch(e){}return r}}
// ================= mapa de la región (todas las islas, pueblos y rutas) =================
const WM_R={alba:{n:"Región de Alba",c:"#86cf6a",d:"#3f7d3a",tx:300,ty:612},esc:{n:"Región de Escarcha",c:"#e9f3ff",d:"#7f9cc4",tx:258,ty:28},bra:{n:"Región de Brasa",c:"#b98a6c",d:"#6a3f2c",tx:742,ty:28},tor:{n:"Región de Tormenta",c:"#8f8ac0",d:"#3f3a6e",tx:742,ty:612},cel:{n:"Región Celeste",c:"#9fe0f0",d:"#3a8aa8",tx:500,ty:84}};
// k: mapa · r: región · t: tipo (town/route/cave/peak/forest/beach/tower) · x,y: posición en el dibujo
const WM_N=[
  {k:"pueblo",r:"alba",t:"town",x:180,y:450},{k:"ruta",r:"alba",t:"route",x:300,y:450},{k:"cima",r:"alba",t:"peak",x:180,y:350},
  {k:"cueva",r:"alba",t:"cave",x:300,y:355},{k:"bosque",r:"alba",t:"forest",x:415,y:450},{k:"playa",r:"alba",t:"beach",x:300,y:545},
  {k:"pe",r:"esc",t:"town",x:150,y:210},{k:"ruta2",r:"esc",t:"route",x:255,y:210},{k:"pn",r:"esc",t:"town",x:360,y:210},{k:"glaciar",r:"esc",t:"cave",x:360,y:135},{k:"pico_e",r:"esc",t:"peak",x:360,y:65},
  {k:"pb",r:"bra",t:"town",x:620,y:210},{k:"ruta3",r:"bra",t:"route",x:730,y:210},{k:"vv",r:"bra",t:"town",x:840,y:210},{k:"crater",r:"bra",t:"cave",x:840,y:135},{k:"cumbre",r:"bra",t:"peak",x:840,y:65},
  {k:"ct",r:"tor",t:"town",x:640,y:470},{k:"ruta4",r:"tor",t:"route",x:760,y:470},{k:"torre",r:"tor",t:"tower",x:760,y:385},
  {k:"pc",r:"cel",t:"town",x:505,y:395},{k:"ruta5",r:"cel",t:"route",x:505,y:330},{k:"cl",r:"cel",t:"town",x:505,y:262},{k:"victoria",r:"cel",t:"cave",x:505,y:192},{k:"liga",r:"cel",t:"tower",x:505,y:122}];
const WM_E=[["pueblo","ruta"],["pueblo","cima"],["ruta","cueva"],["ruta","bosque"],["ruta","playa"],["pe","ruta2"],["ruta2","pn"],["pn","glaciar"],["glaciar","pico_e"],["pb","ruta3"],["ruta3","vv"],["vv","crater"],["crater","cumbre"],["ct","ruta4"],["ruta4","torre"],["pc","ruta5"],["ruta5","cl"],["cl","victoria"],["victoria","liga"]];
const WM_SEA=[["playa","pe"],["playa","pb"],["playa","ct"],["playa","pc"]];
const WM_IN={casa:"pueblo",lab:"pueblo",centro:"pueblo",centro_pe:"pe",centro_pn:"pn",centro_pb:"pb",centro_vv:"vv",centro_ct:"ct",tienda_pueblo:"pueblo",tienda_pe:"pe",tienda_pn:"pn",tienda_pb:"pb",tienda_vv:"vv",tienda_ct:"ct",gym_pueblo:"pueblo",gym_pe:"pe",gym_pn:"pn",gym_pb:"pb",gym_vv:"vv",gym_ct:"ct",gym_pc:"pc",gym_cl:"cl",centro_pc:"pc",tienda_pc:"pc",centro_cl:"cl",tienda_cl:"cl"};
const WM_T={town:"Pueblo",route:"Ruta",cave:"Cueva",peak:"Cima",forest:"Bosque",beach:"Playa",tower:"Torre"};
const WM={open:false,sel:null,raf:0};
const wmNode=k=>WM_N.find(n=>n.k===k);
const wmHere=()=>{const m=EX.map||exSt().m;return WM_IN[m]||m};
function wmOpenZone(k){try{const n=wmNode(k);if(!n)return true;const s=stSt().s|0,r=REG.find(q=>q.k===n.r);if(r&&s<(r.from|0))return false;return typeof xgOpen!=="function"||xgOpen(k)}catch(e){return true}}
function wmVis(){const st=exSt();st.vis=st.vis&&typeof st.vis==="object"?st.vis:{};return st.vis}
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{const v=wmVis();v[WM_IN[m]||m]=1}catch(e){}return r}}
function wmInfo(k){const n=wmNode(k);if(!n)return"";const M=EXM[k]||{},open=wmOpenZone(k),here=wmHere()===k,vis=!!wmVis()[k]||here;
  const reg=WM_R[n.r].n;if(!open&&!vis){let why="";try{const R=REG.find(q=>q.k===n.r),s=stSt().s|0;if(R&&s<(R.from|0))why="Esta región aún está lejos. Llegarás en barco desde el muelle de la Playa Coral cuando avances en la historia.";else{const g=XGGATE[k];why=g?g[1]:""}}catch(e){}
    return '<b>🔒 ???</b><small>'+esc(reg)+'</small><p>'+esc(why||"Avanza en la historia para llegar hasta aquí.")+'</p>'}
  const z=typeof XGZ!=="undefined"&&XGZ[k],tr=(M.npc||[]).filter(q=>q.t&&q.t.length).length;let beat=0;try{const d=exSt().d.npc;(M.npc||[]).forEach((q,i)=>{if(q.t&&q.t.length&&d[k+":"+i])beat++})}catch(e){}
  const cen=Object.values(M.w||{}).some(w=>/^centro/.test(w.to)),mart=Object.values(M.w||{}).some(w=>/^tienda/.test(w.to));
  return '<b>'+esc(M.n||k)+(here?' <i class="wmhere">📍 Estás aquí</i>':'')+'</b><small>'+esc(reg)+' · '+WM_T[n.t]+(vis?' · ✓ Visitado':'')+'</small>'+
    '<p>'+(z?'🌿 Pokémon salvajes: Nv '+z[0]+'–'+z[1]+'<br>':'')+(tr?'🧢 Entrenadores vencidos hoy: '+beat+'/'+tr+'<br>':'')+(cen?'🏥 Centro Pokémon: cura gratis<br>':'')+(mart?'🛒 Tienda Pokémon: compra y vende objetos<br>':'')+(n.t==="beach"?'⛵ Muelle: barco a las demás regiones<br>':'')+(!z&&!tr&&!cen?'Un lugar tranquilo.':'')+'</p>'}
function wmDraw(ts){const cv=$("wmCv");if(!cv)return;const g=cv.getContext("2d"),W=1000,H=640;g.setTransform(cv.width/W,0,0,cv.height/H,0,0);
  // mar
  const sea=g.createLinearGradient(0,0,0,H);sea.addColorStop(0,"#3b78c9");sea.addColorStop(1,"#2a5aa8");g.fillStyle=sea;g.fillRect(0,0,W,H);
  g.strokeStyle="rgba(255,255,255,.16)";g.lineWidth=2;for(let y=20;y<H;y+=34)for(let x=((y/34)%2)*40+((ts/90)%80);x<W+80;x+=80){g.beginPath();g.moveTo(x-80,y);g.quadraticCurveTo(x-70,y-5,x-60,y);g.stroke()}
  // islas: muchos círculos (borde oscuro y luego relleno)
  const blob=(r,pts)=>{const R=WM_R[r];[[R.d,10],[R.c,0]].forEach(([c,o])=>{g.fillStyle=c;pts.forEach(([x,y,rr])=>{g.beginPath();g.arc(x,y,rr+o,0,Math.PI*2);g.fill()})})};
  blob("alba",[[180,450,80],[300,450,85],[300,360,62],[180,350,62],[415,450,70],[300,545,62],[240,400,70],[360,500,60],[240,500,60]]);
  blob("esc",[[150,210,70],[255,210,70],[360,210,72],[360,135,60],[360,65,52],[205,170,48],[300,250,50]]);
  blob("bra",[[620,210,70],[730,210,70],[840,210,72],[840,135,60],[840,65,52],[690,250,50],[780,170,50]]);
  blob("tor",[[640,470,74],[760,470,74],[760,385,60],[700,520,56],[820,520,46]]);
  blob("cel",[[505,395,42],[505,330,40],[505,262,42],[505,192,40],[505,122,40]]);
  // textura de cada isla (árboles, nieve, lava, rayos)
  const deco=(x,y,t)=>{g.font="16px serif";g.textAlign="center";g.globalAlpha=.55;g.fillText(t,x,y);g.globalAlpha=1};
  [[110,390,"🌳"],[250,520,"🌳"],[455,500,"🌲"],[440,400,"🌲"],[220,560,"🌴"],[95,470,"🌳"]].forEach(a=>deco(...a));
  [[110,170,"❄️"],[300,260,"❄️"],[410,95,"❄️"],[200,250,"⛄"]].forEach(a=>deco(...a));
  [[680,160,"🔥"],[890,250,"🔥"],[580,260,"🌋"]].forEach(a=>deco(...a));
  [[600,420,"⚡"],[820,430,"⚡"],[700,540,"🌩️"]].forEach(a=>deco(...a));
  // rutas en barco
  const P=k=>wmNode(k);g.setLineDash([10,9]);g.lineWidth=3;g.strokeStyle="rgba(255,255,255,.75)";
  const SC={pe:[-80,600],pb:[560,640],ct:[470,660],pc:[400,600]};
  WM_SEA.forEach(([a,b])=>{const A=P(a),B=P(b),[mx,my]=SC[b],ax=A.x,ay=A.y+20,bx=B.x,by=B.y+28;
    g.beginPath();g.moveTo(ax,ay);g.quadraticCurveTo(mx,my,bx,by);g.stroke();g.setLineDash([]);g.font="20px serif";g.textAlign="center";g.fillText("⛵",(ax+2*mx+bx)/4,(ay+2*my+by)/4+6);g.setLineDash([10,9])});
  g.setLineDash([]);
  // caminos
  WM_E.forEach(([a,b])=>{const A=P(a),B=P(b),op=wmOpenZone(a)&&wmOpenZone(b);[["#3a2a1c",16],[op?"#efd9a0":"#b8b0a0",10]].forEach(([c,w])=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap="round";g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke()})});
  // nombres de región
  g.textAlign="center";g.font="900 22px Fredoka,system-ui,sans-serif";for(const r in WM_R){const R=WM_R[r];g.lineWidth=6;g.strokeStyle="rgba(15,23,58,.85)";g.strokeText(R.n,R.tx,R.ty);g.fillStyle="#fff";g.fillText(R.n,R.tx,R.ty)}
  // lugares
  const here=wmHere(),vis=wmVis();
  WM_N.forEach(n=>{const op=wmOpenZone(n.k),kn=op||vis[n.k]||here===n.k,sel=WM.sel===n.k,x=n.x,y=n.y;g.lineWidth=4;g.strokeStyle="#1b2340";
    const col=kn?({town:"#ff5a5a",route:"#ffd35c",cave:"#8a6a4a",peak:"#cfd8e6",forest:"#3f9d4a",beach:"#58c8f0",tower:"#ffd94a"}[n.t]):"#8d8a9a";
    if(sel){g.fillStyle="rgba(255,255,255,.55)";g.beginPath();g.arc(x,y,30+Math.sin(ts/200)*3,0,Math.PI*2);g.fill()}
    g.fillStyle=col;g.beginPath();
    if(n.t==="town"){g.roundRect?g.roundRect(x-20,y-16,40,32,7):g.rect(x-20,y-16,40,32);g.fill();g.stroke();if(kn){g.fillStyle="#fff";g.fillRect(x-13,y-2,26,12);g.fillStyle="#1b2340";g.fillRect(x-3,y+2,6,8)}}
    else if(n.t==="peak"||n.t==="cave"){g.moveTo(x,y-22);g.lineTo(x+22,y+15);g.lineTo(x-22,y+15);g.closePath();g.fill();g.stroke();if(kn&&n.t==="cave"){g.fillStyle="#1b2340";g.beginPath();g.arc(x,y+15,8,Math.PI,0);g.fill()}if(kn&&n.t==="peak"){g.fillStyle="#fff";g.beginPath();g.moveTo(x,y-22);g.lineTo(x+7,y-10);g.lineTo(x-7,y-10);g.closePath();g.fill()}}
    else if(n.t==="tower"){g.rect(x-10,y-26,20,42);g.fill();g.stroke();if(kn){g.fillStyle="#1b2340";g.font="16px serif";g.textAlign="center";g.fillText("⚡",x,y)}}
    else{g.arc(x,y,13,0,Math.PI*2);g.fill();g.stroke()}
    if(!kn){g.fillStyle="#fff";g.font="900 18px Fredoka,system-ui,sans-serif";g.textAlign="center";g.fillText("?",x,y+6)}
    const nm=kn?((EXM[n.k]||{}).n||n.k).replace(/ · .*/,""):"???";g.font="800 15px Fredoka,system-ui,sans-serif";g.textAlign="center";g.lineWidth=5;g.strokeStyle="rgba(15,23,58,.9)";
    const ly=n.t==="tower"?y+36:y+34;g.strokeText(nm,x,ly);g.fillStyle=kn?"#fff":"#c9c6d6";g.fillText(nm,x,ly)});
  // estás aquí
  const H0=wmNode(here);if(H0){const b=Math.abs(Math.sin(ts/260))*8;g.font="34px serif";g.textAlign="center";g.fillText("📍",H0.x,H0.y-24-b)}}
function wmLoop(ts){if(!WM.open){WM.raf=0;return}wmDraw(ts);WM.raf=requestAnimationFrame(wmLoop)}
function wmShow(){let o=$("wmO");const host=document.fullscreenElement&&document.fullscreenElement!==document.documentElement?document.fullscreenElement:document.body;
  if(!o){o=document.createElement("div");o.id="wmO";o.className="wmo";o.innerHTML='<div class="wmbox" role="dialog" aria-label="Mapa de la región"><div class="wmh"><b>🗺️ Mapa de la región</b><button type="button" class="alt" id="wmX">Cerrar</button></div><div class="wmcv"><canvas id="wmCv" width="1000" height="640"></canvas></div><div class="wminf" id="wmInf"></div><small class="wmobj" id="wmObj"></small></div>';
    o.addEventListener("click",e=>{if(e.target===o)wmHide()});
    o.querySelector("#wmX").onclick=()=>wmHide();
    o.querySelector("#wmCv").addEventListener("click",e=>{const c=e.currentTarget,r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*1000,y=(e.clientY-r.top)/r.height*640;
      let best=null,bd=46;WM_N.forEach(n=>{const d=Math.hypot(n.x-x,n.y-y);if(d<bd){bd=d;best=n}});if(best){WM.sel=best.k;snd("ui");$("wmInf").innerHTML=wmInfo(best.k)}})}
  if(o.parentElement!==host)host.appendChild(o);
  const dpr=Math.min(2,window.devicePixelRatio||1),cv=$("wmCv");cv.width=1000*dpr;cv.height=640*dpr;
  WM.sel=wmHere();$("wmInf").innerHTML=wmInfo(WM.sel);
  const ob=document.querySelector(".exobj b"),os=document.querySelector(".exobj small");$("wmObj").textContent=ob&&ob.textContent?"🎯 "+(os?os.textContent+": ":"")+ob.textContent:"";
  o.hidden=false;WM.open=true;EX.keys={};EX.kst=[];if(!WM.raf)WM.raf=requestAnimationFrame(wmLoop);snd("ui")}
function wmHide(){const o=$("wmO");if(o)o.hidden=true;WM.open=false;try{EX.cv.focus({preventScroll:true})}catch(e){}}
// mientras el mapa está abierto no se mueve el personaje
window.addEventListener("keydown",e=>{if(!WM.open)return;if(e.key==="Escape"||exAct(e.key)==="wm"){e.preventDefault();e.stopPropagation();wmHide();return}e.stopPropagation()},true);
setInterval(()=>{if(WM.open){EX.keys={};EX.kst=[]}},100);

// ================= atajos de teclado configurables: minimapa, mapa, equipo/mochila y controles =================
Object.assign(EXKB0,{mm:["m",""],wm:["n",""],bag:["i",""],ctl:["c",""]});
Object.assign(EXKN,{mm:"Mostrar u ocultar el minimapa",wm:"Mapa de la región",bag:"Equipo y mochila",ctl:"Controles"});
const EXSC={mm:"exMiniB",wm:"exWmB",bag:"exTeamB"};
function exBagToggle(){const b=$("exTeam");if(!b)return;if(!b.hidden){b.hidden=true;snd("ui");try{EX.cv.focus({preventScroll:true})}catch(e){}}else{snd("ui");xgPanel()}}
function exCtlToggle(){const c=$("exCtl");if(!c)return;c.hidden=!c.hidden;EX.bind=null;exCtlUI();snd("ui");if(c.hidden)try{EX.cv.focus({preventScroll:true})}catch(e){}}
document.addEventListener("keydown",e=>{if(!EX.on||EX.title||EX.bind||WM.open||e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;
  const t=e.target;if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName))return;if(!EX.cv||!EX.cv.isConnected||EX.cv.offsetParent===null)return;
  const ctlOpen=$("exCtl")&&!$("exCtl").hidden;
  const a=exAct(e.key);if(!a||!(a in EXSC)&&a!=="ctl")return;e.preventDefault();
  if(a==="ctl"){exCtlToggle();return}
  if(ctlOpen)return;
  if(a==="mm"){exMiniToggle();return}
  if(EX.dlg||EX.cut||EX.trans)return;
  if(a==="wm"){const b=$("exTeam");if(b)b.hidden=true;wmShow();return}
  if(a==="bag")exBagToggle()});
// los textos de ayuda y los botones muestran la tecla que tenga asignada cada persona
{const _k=exKeysTxt;exKeysTxt=function(){const r=_k.apply(this,arguments);try{const kb=exKB(),f=a=>kb[a].filter(Boolean).map(exKName).join(" / ")||"sin tecla";
  const e=$("exKeys");
  if(e)e.textContent=e.textContent.replace(/ · (Pantalla completa|Fullscreen)/," · Minimapa: "+f("mm")+" · Mapa: "+f("wm")+" · Equipo y mochila: "+f("bag")+" · Controles: "+f("ctl")+" · Pantalla completa");
  const T={exMiniB:"Mostrar u ocultar el minimapa",exWmB:"Mapa de la región",exTeamB:"Tu equipo de Exploración"};for(const a in EXSC){const b=$(EXSC[a]);if(b)b.title=T[EXSC[a]]+" ("+f(a)+")"}
  document.querySelectorAll(".exkb").forEach(b=>b.title="Controles ("+f("ctl")+")");const m=$("exMini");if(m)m.title="Minimapa · tócalo para ampliarlo"}catch(x){}return r}}
setTimeout(()=>{try{exKeysTxt()}catch(e){}},0);
// Esc cierra primero lo que esté abierto (controles o equipo/mochila) sin salir de la pantalla completa
window.addEventListener("keydown",e=>{if(e.key!=="Escape"||!EX.on||EX.bind||WM.open)return;const c=$("exCtl"),b=$("exTeam");
  if(c&&!c.hidden){e.preventDefault();e.stopPropagation();exCtlToggle();return}
  if(b&&!b.hidden){e.preventDefault();e.stopPropagation();b.hidden=true;snd("ui");try{EX.cv.focus({preventScroll:true})}catch(x){}}},true);
