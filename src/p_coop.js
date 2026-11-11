// =====================================================================================
// EXPLORACIÓN EN COMPAÑÍA: ves en tiempo real a los jugadores que están en el mismo mapa,
// puedes saludarles con emoticonos y retarles a un combate. Usa salas «duels/ex_<mapa>/p/<uid>».
// =====================================================================================
const XO={room:null,key:"",peers:{},emo:"",emoT:0,lastW:0,lastJ:"",joining:false,leaveT:0,panel:null};
const XO_EMO=["👋","❤️","😂","😮","🔥","👍","🎉","😢"];
const xoOn=()=>O.exMp!==false;
const xoUid=()=>{try{return window.FB&&window.FB.uid&&window.FB.uid()}catch(e){return null}};
async function xoJoin(map){const key="ex_"+map;if(XO.key===key&&XO.room)return;if(XO.joining)return;XO.joining=true;
  try{await xoLeave();const lb=window.claude&&await window.claude.use("room");if(!lb||!lb.join)return;const r=await lb.join(key);XO.room=r;XO.key=key;XO.peers={};XO.lastJ="";
    r.onPeers(({peers})=>{xoPeers(peers)});
    // si nadie actualiza la sala, comprobamos igualmente quién sigue conectado
    clearInterval(XO.chk);XO.chk=setInterval(()=>{if(XO.room&&XO.last)xoPeers(XO.last)},5000)}
  catch(e){XO.room=null;XO.key=""}finally{XO.joining=false}}
// ¿sigue conectado? Se mide con la hora a la que NOS llega cada actualización (no con el reloj de cada móvil,
// que puede ir adelantado o atrasado y hacía que uno viera al otro pero no al revés)
XO.rc={};
function xoFresh(p){const k=p.peer,u=+p.updatedAt||0,now=Date.now(),r=XO.rc[k];
  if(!r||r.u!==u){const far=Math.abs((typeof srvNow==="function"?srvNow():now)-u)>15*60000&&!r;XO.rc[k]={u:u,at:far?0:now}}
  return now-XO.rc[k].at<75000}
function xoPeers(peers){XO.last=peers;const seen={};
      peers.forEach(p=>{if(p.isMe||!p.presence||!p.presence.x&&p.presence.x!==0)return;if(!xoFresh(p))return;const q=p.presence,o=XO.peers[p.peer]||{dx:q.x,dy:q.y};
        Object.assign(o,{id:p.peer,n:pvClean(q.n||"Jugador"),lk:q.lk||"",x:+q.x||0,y:+q.y||0,f:EXDIR[q.f]?q.f:"d",e:XO_EMO.includes(q.e)?q.e:"",et:+q.et||0});XO.peers[p.peer]=o;seen[p.peer]=1});
      Object.keys(XO.peers).forEach(k=>{if(!seen[k])delete XO.peers[k]})}
async function xoLeave(){const r=XO.room;XO.room=null;XO.key="";XO.peers={};if(r)try{await r.leave()}catch(e){}}
// publicar mi posición (como mucho cada 350 ms y solo si ha cambiado)
setInterval(()=>{try{
  const active=typeof EX!=="undefined"&&EX.map&&EX.map!=="casa"&&(EX.on||EX.battle)&&!EX.title&&xoOn()&&xoUid();
  if(!active){if(XO.room&&!XO.leaveT)XO.leaveT=Date.now();if(XO.room&&Date.now()-XO.leaveT>6000){XO.leaveT=0;xoLeave()}return}XO.leaveT=0;
  if(XO.key!=="ex_"+EX.map){xoJoin(EX.map);return}if(!XO.room)return;
  const p={n:pvNick(),lk:trEnc(myLook()),x:EX.x,y:EX.y,f:EX.f,e:Date.now()-XO.emoT<4000?XO.emo:"",et:XO.emoT},j=JSON.stringify(p);
  const j2=j;if(j2!==XO.lastJ&&Date.now()-XO.lastW>=350){XO.lastJ=j2;XO.lastW=Date.now();XO.room.presence(p).catch(()=>{})}
}catch(e){}},120);
// dibujar a los demás jugadores encima del mapa
{const _d=exDraw;exDraw=function(ts){_d.apply(this,arguments);try{if(!xoOn()||EX.title||!XO.room)return;const L=Object.values(XO.peers);if(!L.length)return;
  const cv=EX.cv,g=cv.getContext("2d");g.setTransform(EXS,0,0,EXS,0,0);const cx=Math.round(EX.cam[0]*2)/2,cy=Math.round(EX.cam[1]*2)/2,dt=Math.min(.1,(ts-(XO.lt||ts))/1000);XO.lt=ts;
  L.sort((a,b)=>a.dy-b.dy).forEach(o=>{const ddx=o.x-o.dx,ddy=o.y-o.dy,dd=Math.hypot(ddx,ddy);let mv=false;
    if(dd>6){o.dx=o.x;o.dy=o.y}else if(dd>.01){const s=Math.min(dd,dt*6.5);o.dx+=ddx/dd*s;o.dy+=ddy/dd*s;mv=true}
    const fr=mv?(Math.floor(ts/130)%2?1:3):0,x=o.dx*EXTL-cx,y=o.dy*EXTL-cy;
    try{exDrawTr(g,o.lk||"acetrainer",o.f,x,y,fr,false,false,0)}catch(e){}
    g.font="bold 7px sans-serif";g.textAlign="center";g.textBaseline="bottom";const w=g.measureText(o.n).width+6;
    g.fillStyle="rgba(10,14,30,.7)";g.fillRect(Math.round(x+16-w/2),Math.round(y-9),Math.round(w),9);g.fillStyle="#9fe6ff";g.fillText(o.n,Math.round(x+16),Math.round(y-1));
    if(o.e&&Date.now()-o.et<4500){const by=y-24+Math.sin(ts/200)*1.5;g.fillStyle="#fff";g.beginPath();g.ellipse(x+16,by,9,8,0,0,7);g.fill();g.beginPath();g.moveTo(x+13,by+6);g.lineTo(x+16,by+11);g.lineTo(x+19,by+6);g.fill();g.font="10px serif";g.textBaseline="middle";g.fillText(o.e,x+16,by+1)}});
  // mi emoticono
  if(XO.emo&&Date.now()-XO.emoT<4000){const x=EX.px*EXTL-cx,y=EX.py*EXTL-cy-24;g.fillStyle="#fff";g.beginPath();g.ellipse(x+16,y,9,8,0,0,7);g.fill();g.font="10px serif";g.textAlign="center";g.textBaseline="middle";g.fillText(XO.emo,x+16,y+1)}
 }catch(e){}}}
// hablar con otro jugador (botón A mirando hacia él)
function xoAt(x,y){return Object.values(XO.peers).find(o=>Math.round(o.x)===x&&Math.round(o.y)===y)}
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&xoOn()){const[dx,dy]=EXDIR[EX.f],o=xoAt(EX.x+dx,EX.y+dy);if(o){xoPanel(o);return}}}catch(e){}return _i.apply(this,arguments)}}
// los demás jugadores no bloquean el paso (se puede pasar a través, como en los juegos online)
function xoEmote(e){XO.emo=e;XO.emoT=Date.now();snd("ui")}
function xoPanel(o){const sc=document.querySelector("#explPB .exscr")||document.querySelector(".exwrap .exscr");if(!sc)return;xoClose();
  const d=document.createElement("div");d.className="xopan";XO.panel=d;
  d.innerHTML='<b>'+(o?'👤 '+esc(o.n):'💬 Saludar')+'</b><div class="xoemo">'+XO_EMO.map(e=>'<button type="button" data-xoe="'+e+'">'+e+'</button>').join("")+'</div>'+
    (o?'<button type="button" class="red" data-xoc="'+esc(o.id)+'">⚔️ Retar a un combate</button>':'')+'<button type="button" class="alt" data-xox="1">Cerrar</button>';
  d.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;e.stopPropagation();
    if(b.dataset.xoe){xoEmote(b.dataset.xoe);xoClose();return}
    if(b.dataset.xoc){const ok=typeof pvChallenge==="function"&&pvChallenge(b.dataset.xoc);toast(ok?"⚔️ Reto enviado a "+o.n+". Espera a que acepte.":"No se puede retar ahora (¿tienes equipo y estás en línea?).");xoClose();return}
    xoClose()});
  sc.appendChild(d)}
function xoClose(){if(XO.panel){XO.panel.remove();XO.panel=null}}
// botón 💬 y contador de jugadores en el mapa
setInterval(()=>{const sc=document.querySelector("#explPB .exscr")||document.querySelector(".exwrap .exscr");if(!sc)return;let b=sc.querySelector(".xobtn");
  if(!b){b=document.createElement("div");b.className="xobtn";b.innerHTML='<button type="button" data-xog="1" title="Saludar a los jugadores cercanos">💬</button><button type="button" data-xot="1" title="Ver u ocultar a los demás jugadores">👥 <span>0</span></button>';sc.appendChild(b);
    b.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;e.stopPropagation();if(t.dataset.xog){if(XO.panel)xoClose();else xoPanel(null)}else{O.exMp=!xoOn();save();toast(xoOn()?"👥 Ahora ves a los demás jugadores":"🙈 Has ocultado a los demás jugadores");if(!xoOn())xoLeave()}})}
  const n=xoOn()?Object.keys(XO.peers).length:0,s=b.querySelector("span"),txt=xoOn()?String(n):"off";if(s.textContent!==txt)s.textContent=txt;b.hidden=!!EX.title;b.classList.toggle("off",!xoOn())},500);

// =====================================================================================
// PUZLE DE PIEZAS EN EQUIPO: varios jugadores montan el mismo puzle a la vez, en tiempo real.
// Quien crea la sala elige las piezas y comparte el código; los demás se unen con él.
// Cada jugador publica las piezas que ha encajado y las que ha movido; todos ven lo mismo.
// =====================================================================================
const JC_MAX=4;
function jgCoop(B,end){
  if(!xoUid()){B.innerHTML='<div class="pzpick"><h3>👥 Puzle en equipo</h3><p>Para jugar en equipo necesitas iniciar sesión con tu cuenta.</p><button class="alt" data-jcb="1">Volver</button></div>';B.querySelector("[data-jcb]").onclick=()=>MG.g.start(B,end);return}
  B.innerHTML='<div class="pzpick"><h3>👥 Puzle de piezas en equipo</h3><p class="mut">Montad el mismo puzle entre 2 y '+JC_MAX+' jugadores, en tiempo real: veréis moverse las piezas de los demás.</p>'+
    '<div class="jcrow"><b>Crear una sala</b><div class="pzsz">'+PZ_SIZES.filter(n=>n>=4).map(n=>'<button data-jcn="'+n+'"><b>'+(n*n)+'</b><small>'+n+'×'+n+'</small></button>').join("")+'</div></div>'+
    '<div class="jcrow"><b>Unirse con un código</b><div class="jcjoin"><input id="jcCode" maxlength="5" placeholder="Código" autocomplete="off"><button class="red" data-jcj="1">Unirse</button></div></div>'+
    '<button class="alt" data-jcb="1">Volver</button></div>';
  B.querySelector("[data-jcb]").onclick=()=>MG.g.start(B,end);
  B.querySelectorAll("[data-jcn]").forEach(b=>b.onclick=()=>{snd("ui");const code=Array.from({length:5},()=>"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random()*32)]).join(""),pool=P.filter(p=>p[2]!=="M");
    jcRoom(B,end,code,{N:+b.dataset.jcn,m:pool[Math.floor(Math.random()*pool.length)][0],seed:Math.floor(Math.random()*2e9)})});
  const go=()=>{const c=String($("jcCode").value||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(c.length!==5){toast("El código tiene 5 letras o números.");return}snd("ui");jcRoom(B,end,c,null)};
  B.querySelector("[data-jcj]").onclick=go;$("jcCode").addEventListener("keydown",e=>{if(e.key==="Enter")go()})}
async function jcRoom(B,end,code,cfg){
  const lb=window.claude&&await window.claude.use("room");if(!lb||!lb.join){toast("No se ha podido conectar. Inténtalo de nuevo.");return}
  const room=await lb.join("jg_"+code),me=xoUid(),host=!!cfg,J={room,code,host,cfg,peers:[],started:false,mine:{n:pvNick(),h:host?1:0,L:[],M:{},d:null}};MG.jc=J;
  if(host)J.mine.cfg=cfg;
  const pub=()=>{const now=Date.now();if(now-(J.lw||0)<220){if(!J.pt)J.pt=setTimeout(()=>{J.pt=0;pub()},230);return}J.lw=now;room.presence(J.mine).catch(()=>{})};J.pub=pub;
  MG.onClose=()=>{try{room.leave()}catch(e){}MG.jc=null};
  const lobbyUI=()=>{if(J.started)return;const ps=J.peers.filter(p=>p.presence&&p.presence.n),hostP=ps.find(p=>p.presence.h&&p.presence.cfg);if(!host&&hostP)J.cfg=hostP.presence.cfg;
    if(J.cfg&&ps.some(p=>p.presence.go)){start();return}
    B.innerHTML='<div class="pzpick"><h3>👥 Sala <span class="jccode">'+esc(code)+'</span></h3><p class="mut">'+(host?'Pasa este código a tus amigos para que se unan desde «Puzle de piezas → Jugar en equipo».':'Esperando a que quien ha creado la sala empiece…')+'</p>'+
      (J.cfg?'<p>🧩 <b>'+J.cfg.N*J.cfg.N+'</b> piezas</p>':'<p class="mut">'+(host?'':'Buscando la sala…')+'</p>')+
      '<div class="jcpl">'+ps.slice(0,JC_MAX).map(p=>'<span>'+(p.presence.h?'👑 ':'🙂 ')+esc(pvClean(p.presence.n))+(p.isMe?' (tú)':'')+'</span>').join("")+'</div>'+
      (host?'<button class="red big" data-jcs="1"'+(ps.length<2?' disabled':'')+'>▶ Empezar'+(ps.length<2?' (espera a otro jugador)':'')+'</button>':'')+'<button class="alt" data-jcx="1">Salir de la sala</button></div>';
    const s=B.querySelector("[data-jcs]");if(s)s.onclick=()=>{J.mine.go=1;J.mine.t0=typeof srvNow==="function"?srvNow():Date.now();pub();start()};
    B.querySelector("[data-jcx]").onclick=()=>{MG.onClose=null;try{room.leave()}catch(e){}MG.jc=null;jgCoop(B,end)}};
  room.onPeers(({peers})=>{const now=typeof srvNow==="function"?srvNow():Date.now();J.peers=peers.filter(p=>p.isMe||Math.abs(now-(p.updatedAt||0))<15*60000);if(!J.started)lobbyUI();else if(J.sync)J.sync()});
  pub();lobbyUI();
  // ---------- partida ----------
  function start(){if(J.started)return;J.started=true;const c=J.cfg,N=c.N,T=N*N,s=JG_BW/N,m=s*.25,r=rngS(c.seed|0),rnd=()=>r()<.5?1:-1;
    const H=Array.from({length:(N-1)*N},rnd),V=Array.from({length:N*(N-1)},rnd);
    const edges=i=>{const rr=Math.floor(i/N),cc=i%N;return [rr>0?-H[(rr-1)*N+cc]:0,cc<N-1?V[rr*(N-1)+cc]:0,rr<N-1?H[rr*N+cc]:0,cc>0?-V[rr*(N-1)+cc-1]:0]};
    const perRow=Math.max(3,Math.floor(1/(s*1.3))),rows=Math.ceil(T/perRow),trayH=Math.min(.62,Math.max(.34,rows*s*1.25+s*.7)),AH=JG_BY+JG_BW+.04+trayH,top=JG_BY+JG_BW+.04+m,rs=Math.min(s*1.25,(trayH-s-2*m)/Math.max(1,rows-1)),cs=1/perRow;
    const ord=[...Array(T).keys()];for(let i=T-1;i>0;i--){const j=Math.floor(r()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}
    const PC=[...Array(T).keys()].map(i=>({i,x:0,y:0,l:false,z:i,t:0}));ord.forEach((pi,k)=>{const p=PC[pi];p.x=Math.min(1-s-m,Math.max(m,(k%perRow+.5)*cs-s/2+(r()-.5)*cs*.25));p.y=Math.min(AH-s-m,top+Math.floor(k/perRow)*rs)});
    const home=i=>[JG_BX+(i%N)*s,JG_BY+Math.floor(i/N)*s],mon=PM[c.m]||P[0],c1=TC[tys(mon)[0]]||"#4a6ae0",c2=TC[tys(mon)[1]||"fairy"]||"#ff8ad8";
    B.innerHTML='<div class="whohd"><span>👥 Sala '+esc(code)+'</span><span>⏱️ <b id="jcT">0:00</b></span><span>✅ <b id="jcOk">0</b>/'+T+'</span></div><div class="jcpl" id="jcPl"></div>'+
      '<div class="jgw" id="jcW" style="aspect-ratio:1/'+AH.toFixed(4)+'"><div class="jgbd" id="jcBd" style="left:'+JG_BX*100+'%;top:'+(JG_BY/AH*100)+'%;width:'+JG_BW*100+'%;height:'+(JG_BW/AH*100)+'%"></div><div class="jgld">Cargando las piezas…</div></div>'+
      '<div class="mgbtns"><button class="alt" id="jcPeek">👁️ Ver la imagen</button></div>';
    const W=$("jcW");let wpx=W.clientWidth||400,cpx=0,ready=false,done=false,zTop=T+1;const t0=()=>{const h=J.peers.find(p=>p.presence&&p.presence.t0);return h?h.presence.t0:J.mine.t0||Date.now()};
    const place=p=>{const e=p.cv;if(!e)return;e.style.left=(p.x-m)*wpx+"px";e.style.top=(p.y-m)*wpx+"px";e.style.width=e.style.height=(s+2*m)*wpx+"px";e.style.zIndex=p.l?1:10+p.z;e.classList.toggle("ok",p.l)};
    const layout=()=>{wpx=W.clientWidth||wpx;PC.forEach(place)};const ro=typeof ResizeObserver!=="undefined"?new ResizeObserver(()=>{if(!W.isConnected){ro.disconnect();return}layout()}):null;if(ro)ro.observe(W);
    const im=new Image();im.onload=()=>build(im);im.onerror=()=>build(null);im.src=mgImgSrc(mon);
    function build(img){cpx=Math.max(28,Math.min(180,Math.round(JG_BW*wpx*(window.devicePixelRatio||1)/N)));const R=cpx*N,bd=document.createElement("canvas");bd.width=bd.height=R;const g=bd.getContext("2d");
      const lg=g.createLinearGradient(0,0,0,R);lg.addColorStop(0,"#ffffff");lg.addColorStop(.12,c1);lg.addColorStop(1,c2);g.fillStyle=lg;g.fillRect(0,0,R,R);
      g.fillStyle="rgba(255,249,205,.95)";g.beginPath();g.arc(R*.18,R*.18,R*.08,0,7);g.fill();g.fillStyle="rgba(255,255,255,.85)";g.beginPath();g.ellipse(R*.76,R*.17,R*.13,R*.06,0,0,7);g.fill();
      g.fillStyle="rgba(0,0,0,.28)";g.beginPath();g.ellipse(R*.22,R*1.02,R*.75,R*.26,0,0,7);g.fill();
      if(img&&img.naturalWidth){const pd=R*.06,sz=R-pd*2,k=Math.min(sz/img.naturalWidth,sz/img.naturalHeight),w=img.naturalWidth*k,h=img.naturalHeight*k;g.drawImage(img,(R-w)/2,(R-h)/2,w,h)}
      const rc=document.createElement("canvas");rc.width=rc.height=Math.min(R,600);rc.getContext("2d").drawImage(bd,0,0,rc.width,rc.height);$("jcBd").appendChild(rc);
      const mp=Math.round(cpx*.25),S2=cpx+2*mp;
      PC.forEach(p=>{const cv=document.createElement("canvas");cv.width=cv.height=S2;cv.className="jgp";const x=cv.getContext("2d"),path=jgPath(cpx,mp,edges(p.i));x.save();x.clip(path);x.drawImage(bd,mp-(p.i%N)*cpx,mp-Math.floor(p.i/N)*cpx);x.restore();
        x.lineWidth=Math.max(1,cpx*.025);x.strokeStyle="rgba(255,255,255,.55)";x.stroke(path);x.lineWidth=Math.max(1,cpx*.012);x.strokeStyle="rgba(0,0,0,.45)";x.stroke(path);p.cv=cv;p.path=path;W.appendChild(cv)});
      const ld=W.querySelector(".jgld");if(ld)ld.remove();ready=true;layout();sync()}
    // mezclar lo que hacen todos: piezas encajadas (unión) y la última posición de cada pieza
    function sync(){if(!ready)return;const all=J.peers.map(p=>p.isMe?J.mine:p.presence).filter(Boolean),L={},MV={},drag={};
      all.forEach(q=>{(q.L||[]).forEach(i=>{L[i]=1});const M=q.M||{};for(const k in M){const v=M[k];if(Array.isArray(v)&&(!MV[k]||v[2]>MV[k][2]))MV[k]=v}if(q!==J.mine&&Array.isArray(q.d))drag[q.d[0]]=q.d});
      PC.forEach(p=>{if(dr&&dr.p===p)return;if(L[p.i]&&!p.l){p.l=true;[p.x,p.y]=home(p.i);if(p.cv&&!hubCalm())p.cv.animate([{filter:"brightness(1.7)"},{filter:"none"}],{duration:350})}
        else if(!p.l){const d=drag[p.i];if(d){p.x=+d[1];p.y=+d[2];p.z=zTop+1}else{const v=MV[p.i];if(v&&v[2]>p.t){p.x=+v[0];p.y=+v[1];p.t=v[2]}}}place(p)});
      const k=PC.filter(p=>p.l).length;$("jcOk").textContent=k;
      $("jcPl").innerHTML=J.peers.filter(p=>p.presence&&p.presence.n).map(p=>'<span>'+(p.presence.h?'👑 ':'🙂 ')+esc(pvClean(p.presence.n))+' · '+((p.isMe?J.mine:p.presence).L||[]).length+' 🧩</span>').join("");
      if(k===T&&!done)win()}
    J.sync=sync;
    const hc=document.createElement("canvas").getContext("2d");
    const hit=(ux,uy)=>{const L=PC.filter(p=>!p.l&&p.path).sort((a,b)=>b.z-a.z);for(const p of L){const lx=ux-(p.x-m),ly=uy-(p.y-m),sz=s+2*m;if(lx<0||ly<0||lx>sz||ly>sz)continue;const k=(cpx+2*Math.round(cpx*.25))/sz;if(hc.isPointInPath(p.path,lx*k,ly*k))return p}return null};
    let dr=null;const pt=e=>{const rr=W.getBoundingClientRect();return [(e.clientX-rr.left)/wpx,(e.clientY-rr.top)/wpx]},r4=v=>Math.round(v*1e4)/1e4;
    W.addEventListener("pointerdown",e=>{if(done||!ready)return;const [ux,uy]=pt(e),p=hit(ux,uy);if(!p)return;e.preventDefault();p.z=zTop++;dr={p,dx:ux-p.x,dy:uy-p.y,id:e.pointerId};p.cv.classList.add("drag");place(p);try{W.setPointerCapture(e.pointerId)}catch(x){}});
    W.addEventListener("pointermove",e=>{if(!dr||e.pointerId!==dr.id)return;const [ux,uy]=pt(e),p=dr.p;p.x=Math.min(1-s*.5,Math.max(-s*.5,ux-dr.dx));p.y=Math.min(AH-s*.5,Math.max(-s*.5,uy-dr.dy));place(p);J.mine.d=[p.i,r4(p.x),r4(p.y)];pub()});
    const up=e=>{if(!dr||e.pointerId!==dr.id)return;const p=dr.p;dr=null;p.cv.classList.remove("drag");J.mine.d=null;const [hx,hy]=home(p.i),now=Date.now();
      if(Math.abs(p.x-hx)<s*.3&&Math.abs(p.y-hy)<s*.3){p.x=hx;p.y=hy;p.l=true;J.mine.L=J.mine.L.concat([p.i]);snd("lvl")}else snd("ui");
      p.t=now;J.mine.M[p.i]=[r4(p.x),r4(p.y),now];const ks=Object.keys(J.mine.M);if(ks.length>60){ks.sort((a,b)=>J.mine.M[a][2]-J.mine.M[b][2]).slice(0,ks.length-60).forEach(k=>delete J.mine.M[k])}
      place(p);pub();sync()};
    W.addEventListener("pointerup",up);W.addEventListener("pointercancel",up);
    $("jcPeek").onclick=()=>$("jcBd").classList.toggle("peek");
    const tick=()=>{if(done||!W.isConnected)return;const e=$("jcT");if(e)e.textContent=mgClk((typeof srvNow==="function"?srvNow():Date.now())-t0());MG.raf=requestAnimationFrame(tick)};MG.raf=requestAnimationFrame(tick);
    function win(){done=true;cancelAnimationFrame(MG.raf);const t=((typeof srvNow==="function"?srvNow():Date.now())-t0())/1000,np=Math.max(1,J.peers.length),par=(T*6+20)/Math.min(2.5,1+.5*(np-1)),mine=(J.mine.L||[]).length;
      // todos ganan por terminarlo; quien más piezas ha encajado, un poco más
      const sc=Math.round(T*50*(.5+.5*Math.min(1,par/Math.max(1,t)))*(.75+.25*Math.min(1,mine/Math.max(1,T/np))));
      mgSet(sc);W.classList.add("jgdone");snd("win");mgConfetti();try{cry(mon[0])}catch(e){}
      B.querySelector(".mgbtns").innerHTML='<p class="pzres">¡Puzle completado en equipo! Es <b>'+esc(mon[0])+'</b> · '+mgClk(t*1000)+' · tú encajaste '+mine+' piezas</p>';
      MG.onClose=null;mgT(()=>{try{room.leave()}catch(e){}MG.jc=null;end(sc)},3000)}
  }
}
