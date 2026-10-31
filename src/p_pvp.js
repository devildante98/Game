// ================= PVP online =================
let PR=null,PV={st:"idle",ch:null,ok:null,no:null,t0:0,inv:null},D=null;
const pvNick=()=>{if(!S.nick){S.nick=O.nick?pvClean(O.nick):"Entrenador"+Math.floor(1000+Math.random()*9000);save()}return S.nick};
const pvClean=t=>Array.from(String(t==null?"":t).replace(/[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g,"").replace(/\s+/g," ").trim()).slice(0,16).join("").trim()||"Jugador";
const PVP_CAP=5000000;
const pvDay=()=>{const d=today();if(!S.pvd||S.pvd.d!==d)S.pvd={d:d,t:0};return S.pvd};
const pvHash=str=>{let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const pvTeamData=()=>(S.team||[]).filter(n=>n&&S.owned[n]&&PM[n]).slice(0,6).map(n=>({n:n,l:lvd(n).l,m:moveIds(n).slice(),sh:S.shiny&&S.shiny[n]>0?1:0,nt:natOf(n),it:heldOf(n),ab:abOf(n)}));
function pvOkTeam(t){return Array.isArray(t)&&t.length>=1&&t.length<=6&&t.every(x=>x&&typeof x.n==="string"&&PM[x.n]&&Number.isInteger(x.l)&&x.l>=1&&x.l<=100&&Array.isArray(x.m)&&x.m.length>=1&&x.m.length<=4&&x.m.every(id=>typeof id==="string"&&MVD[id])&&new Set(x.m).size===x.m.length)&&new Set(t.map(x=>x.n)).size===t.length}
const pvMk=team=>team.map(x=>{const m=beMon(PM[x.n],x.l,null,x.m);m.sh=x.sh?1:0;monX(m,Number.isInteger(x.nt)&&x.nt>=0&&x.nt<NAT.length?x.nt:0,HOLDK[x.it]?x.it:"");m.ab=abValid(x.n,x.ab)?x.ab:abDefault(PM[x.n]);return m});
const gdBadge=g=>g&&typeof g==="object"&&g.t?'<span class="gtag" title="Gremio '+esc(g.t)+'">'+esc(String(g.i||"🛡️").slice(0,4))+' '+esc(String(g.t).slice(0,4))+'</span>':"";
// ---- lobby ----
const pvMe=()=>PR&&PR.peers().find(p=>p.sameTab);
const pvOthers=()=>PR?PR.peers().filter(p=>!p.isMe&&p.kind==="viewer"&&p.presence&&p.presence.pvp&&p.presence.pvp.v===3):[];
function pvPub(){if(!PR)return;if(!nickOk()){PR.presence({pvp:null}).catch(()=>{});return}
  PR.presence({pvp:{v:3,prs:PRS(),n:pvClean(pvNick()),tr:trEnc(myLook()),gd:myGuildBadge(),tm:pvTeamData().map(x=>({n:x.n,l:x.l})),st:PV.st,ch:PV.ch,ok:PV.ok,no:PV.no,inv:PV.inv}}).catch(()=>{})}
function pvMsg(t){$("pvIn").innerHTML='<small class="mut">'+esc(t)+'</small>'}
const _seenInv={};
function pvIncoming(){
  const me=pvMe();if(!me)return {ch:[],inv:[]};
  const o=pvOthers();
  return{ch:o.filter(p=>{const c=p.presence.pvp.ch;return p.presence.pvp.st==="wait"&&c&&c.to===me.peer&&Date.now()-(c.t||0)<35000}),
    inv:o.filter(p=>{const v=p.presence.pvp.inv;return v&&Array.isArray(v.to)&&v.to.includes(me.peer)&&typeof v.code==="string"&&/^[A-Z0-9]{4,6}$/.test(v.code)&&Date.now()-(v.t||0)<600000&&p.presence.pvp.st==="room"})};
}
function pvRender(){
  if(!PR){$("pvSt").textContent="No disponible";$("pvList").innerHTML='<small class="mut">El PVP online necesita iniciar sesión con una cuenta; no funciona en «Jugar sin cuenta».</small>';frUI();return}
  if(window.__pvErr){$("pvSt").textContent="Sin permisos";$("pvList").innerHTML='<small class="mut">Firestore ha rechazado el acceso al PVP. Actualiza las reglas de Firestore con las del README (colecciones lobby y duels).</small>';return}
  const me=pvMe(),others=pvOthers(),inc=pvIncoming();
  $("pvSt").textContent=(others.length+1)+" jugador"+(others.length?"es":"")+" aquí";
  const tm=pvTeamData();
  $("pvTeam").textContent=tm.length?"Tu equipo: "+tm.length+" Pokémon":"Elige un equipo de combate arriba para poder jugar.";
  $("pvRec").textContent=(S.pvp?"Récord: "+(S.pvp.w||0)+" V · "+(S.pvp.l||0)+" D · ":"")+"Hoy: "+fmt(pvDay().t)+" / "+fmt(PVP_CAP)+" 🎟️";
  // avisos de retos e invitaciones aunque estes en otro apartado
  inc.ch.forEach(p=>{const k="c"+p.peer+(p.presence.pvp.ch.room||"");if(!_seenInv[k]){_seenInv[k]=1;toast("⚔️ "+pvClean(p.presence.pvp.n)+" te reta a un duelo PVP. ¡Míralo en PVP online!")}});
  inc.inv.forEach(p=>{const k="i"+p.peer+p.presence.pvp.inv.code;if(!_seenInv[k]){_seenInv[k]=1;toast("👥 "+pvClean(p.presence.pvp.n)+" te invita a su sala 2 vs 2 ("+p.presence.pvp.inv.code+")")}});
  frUI();
  if(D||R2)return;
  if(!nickOk()){$("pvIn").innerHTML="";$("pvList").innerHTML='<small class="mut">Para jugar al PVP tu apodo tiene que estar registrado. Escribe un apodo y pulsa «💾 Guardar apodo».</small>';return}
  let h="";
  if(PV.st==="idle")inc.ch.forEach(p=>{h+='<div class="lgnow"><b>⚔️ '+esc(pvClean(p.presence.pvp.n))+' te reta a un duelo</b>'+(fcd?'<small class="mut">Termina tu combate actual (pulsa «Volver») para poder aceptar.</small>':'')+'<div class="lgbtn"><button class="red" data-pvacc="'+esc(p.peer)+'"'+(fcd?' disabled':'')+'>Aceptar</button><button class="alt" data-pvno="'+esc(p.peer)+'">Rechazar</button></div></div>'});
  if(PV.st==="idle")inc.inv.forEach(p=>{h+='<div class="lgnow"><b>👥 '+esc(pvClean(p.presence.pvp.n))+' te invita a su sala 2 vs 2</b><div class="lgbtn"><button class="red" data-r2inv="'+esc(p.presence.pvp.inv.code)+'"'+(fcd?' disabled':'')+'>Unirse a la sala '+esc(p.presence.pvp.inv.code)+'</button></div></div>'});
  if(PV.st==="wait"){const o=PV.ch&&others.find(p=>p.peer===PV.ch.to);h+='<div class="lgnow"><b>Reto enviado a '+esc(o?pvClean(o.presence.pvp.n):"otro jugador")+'…</b><small class="mut">Esperando respuesta (30 s).</small><div class="lgbtn"><button class="alt" data-pvcancel="1">Cancelar</button></div></div>'}
  $("pvIn").innerHTML=h;
  {const c=$("pvCnt");if(c)c.textContent=others.length?others.length+(others.length===1?" jugador":" jugadores"):"Nadie más ahora"}
  $("pvList").innerHTML=others.length?others.map(p=>{const v=p.presence.pvp,busy=v.st==="duel",fr=isFriend(p.peer);return '<div class="pvrow"><span class="pvav">'+trImg(trDec(v.tr),"f","i")+'</span><b class="plink" data-prof="'+esc(p.peer)+'">'+esc(pvClean(v.n))+(v.prs?' 🌟'+(v.prs|0):'')+(fr?' <small title="Amigo">👥</small>':'')+' '+gdBadge(v.gd)+'</b><span class="pvtm">'+(Array.isArray(v.tm)?v.tm.filter(x=>x&&PM[x.n]).slice(0,6).map(x=>'<span title="'+esc(x.n)+' Nv'+(+x.l||1)+'">'+ico(PM[x.n],26)+'</span>').join(""):"")+'</span><small class="mut">'+(busy?"En duelo":v.st==="wait"?"Retando…":v.st==="room"?"En sala 2 vs 2":"Libre")+'</small>'+(fr||!window.FB?'':frPend(p.peer)?'<button class="alt" disabled title="Solicitud de amistad enviada">📨</button>':'<button class="alt" data-fradd="'+esc(pvClean(v.n))+'" title="Enviar solicitud de amistad">+👥</button>')+'<button data-pvch="'+esc(p.peer)+'"'+((PV.st!=="idle"||busy||v.st!=="idle"||!tm.length||fcd)?' disabled':'')+'>⚔️ Retar</button></div>'}).join(""):'<small class="mut">Ahora mismo no hay otros jugadores. Comparte el enlace de la página para que alguien se conecte.</small>';
  if(PV.st==="wait"&&PV.ch&&me){
    const acc=others.find(p=>{const o=p.presence.pvp.ok;return o&&o.from===me.peer&&o.room===PV.ch.room});
    const rej=others.find(p=>{const n=p.presence.pvp.no;return n&&n.from===me.peer&&n.room===PV.ch.room&&Date.now()-(n.t||0)<10000});
    if(acc)pvStart("A",PV.ch.room,PV.ch.seed);
    else if(rej){PV.st="idle";PV.ch=null;pvPub();pvMsg(pvClean(rej.presence.pvp.n)+" ha rechazado el reto.")}
    else if(Date.now()-PV.t0>30000){PV.st="idle";PV.ch=null;pvPub();pvMsg("El reto no ha sido respondido.")}
  }
}
function pvChallenge(peer){
  const me=pvMe();if(!me||PV.st!=="idle"||!pvTeamData().length||fcd)return false;
  PV.st="wait";PV.t0=Date.now();PV.ch={to:peer,room:"d"+Math.floor(Math.random()*1e9).toString(36)+Date.now().toString(36),seed:Math.floor(Math.random()*2147483647),t:Date.now()};PV.ok=null;pvPub();pvRender();return true;
}
function pvAccept(peer){
  const o=pvOthers().find(p=>p.peer===peer);if(!o||PV.st!=="idle"||fcd)return;
  const c=o.presence.pvp.ch;if(!c||typeof c.room!=="string"||!/^[a-z0-9][a-z0-9_.-]{0,47}$/.test(c.room))return;
  PV.st="duel";PV.ok={from:peer,room:c.room};PV.no=null;pvPub();pvStart("B",c.room,c.seed|0);
}
function pvDecline(peer){const o0=pvOthers().find(p=>p.peer===peer),rm=o0&&o0.presence.pvp.ch?o0.presence.pvp.ch.room:"";PV.no={from:peer,room:rm,t:Date.now()};pvPub();setTimeout(()=>{PV.no=null;pvPub()},8000);pvRender()}
// ---- duelo 1 vs 1 (misma arena, motor y animaciones que los combates normales) ----
const pvOpp=()=>{if(!D)return null;const p=D.DR.peers().find(x=>!x.isMe&&x.kind==="viewer"&&x.presence&&x.presence.pv&&x.presence.pv.v===3);return p?p.presence.pv:null};
function pvDPub(){const h={};Object.keys(D.hist).slice(-8).forEach(k=>{h[k]=D.hist[k]});D.DR.presence({pv:Object.assign({},D.base,{h:h})}).catch(()=>{})}
const pvMy=()=>D.role==="A"?0:1;
async function pvStart(role,room,seed){
  PV.st="duel";pvPub();
  let DR;try{DR=await PR.join(room)}catch(e){PV.st="idle";PV.ch=null;PV.ok=null;pvPub();pvMsg("No se pudo entrar en la sala del duelo.");return}
  D={role:role,room:room,DR:DR,seed:seed,hist:{},E:null,playing:false,ready:false,over:false,t0:Date.now(),lastSeen:Date.now(),sw:false,waitSince:0,base:{v:3,n:pvClean(pvNick()),r:role,tr:trEnc(myLook()),team:pvTeamData()}};
  fcd=true;updTeam();
  const a=$("arena");$("pvDuel").appendChild(a);a.hidden=false;arenaReset();
  $("pvLobby").hidden=true;$("pvDuel").hidden=false;$("pvVs").textContent="Duelo online";
  $("hlpp").hidden=true;setScene($("bscene"),"grass");
  ["oi","mi"].forEach(id=>{$(id).style.opacity=0});
  $("fmsg").textContent="Preparando el duelo… Esperando a que el rival entre en la sala.";$("menu").innerHTML="";
  if(O.bigmode&&!bigMode)bigSet(O.bigmode);
  try{$("pvpP").scrollIntoView({behavior:"smooth",block:"start"})}catch(e){}
  D.unsub=DR.onPeers(()=>pvTick());D.iv=setInterval(pvTick,400);
  pvDPub();pvTick();
}
function pvBegin(){
  const me=pvMy(),op=1-me,sl=[];sl[me]=SL_ME;sl[op]=SL_OP;
  B={mode:"p",E:D.E,me:me,SL:sl,trainer:D.oppNick,trainerName:D.oppNick,tsrc:{c:D.oppTr},showOpp:true,busy:true,
    who:(i,n)=>i===me?n:n+" de "+D.oppNick,mine:i=>i===me,onSend:pvSend};
  const sn=beSnap(D.E);setSpr(0,sn);setSpr(1,sn);bePaint(sn);xpBar();$("otn").textContent="👤 "+D.oppNick;
  setScene($("bscene"),envOf(beAct(D.E.sd[op]).p[1]));$("menu").innerHTML="";
  ["osp","msp","oi","mi"].forEach(id=>{$(id).style.opacity=0});
  D.playing=true;const d=D;
  (async()=>{try{await introFlash();playerIn();await trainerEnter("i");snd("wild");await say("¡"+D.oppNick+" te desafía!");await trainerSendOut(true,"osp","oi",beAct(d.E.sd[op]).p[0]);await playerThrow(beAct(d.E.sd[me]),"msp","mi")}catch(e){}
    if(D!==d||d.over)return;d.playing=false;d.ready=true;pvMenu();pvTick()})();
}
const pvKey=()=>D.E.turn+":"+(D.E.sd.some(s=>s.need)?"swap":"act");
function pvTick(){
  if(!D||D.over)return;
  const op=pvOpp(),me=pvMy(),other=1-me;
  if(op)D.lastSeen=Date.now();
  if(!D.E){
    if(op&&pvOkTeam(op.team)&&pvOkTeam(D.base.team)){
      const mine=D.base.team,theirs=op.team,tA=D.role==="A"?mine:theirs,tB=D.role==="A"?theirs:mine;
      D.E=beNew([beSide(pvMk(tA)),beSide(pvMk(tB))],[[0],[1]],D.seed);
      D.oppNick=pvClean(op.n);D.oppTr=typeof op.tr==="string"?op.tr:"";$("pvVs").textContent=pvClean(D.base.n)+" ⚔️ "+D.oppNick;
      pvBegin();
    }else if(Date.now()-D.t0>25000)pvEnd("timeout");
    return;
  }
  if(D.playing)return;
  if(op&&op.ff){pvEnd("ff");return}
  if(!op&&Date.now()-D.lastSeen>9000){pvEnd("left");return}
  const key=pvKey(),E=D.E,swap=E.sd.some(s=>s.need);
  const mineReq=swap?E.sd[me].need:true,theirReq=swap?E.sd[other].need:true;
  const mine=mineReq?D.hist[key]:"-",theirs=theirReq?(op&&op.h&&op.h[key]):"-";
  if(mine==null||theirs==null||!op){pvMenu();return}
  const acts=[];acts[me]=mine;acts[other]=theirs;
  pvPlayTurn(acts);
}
function pvAct(a){
  if(!D||!D.E||D.playing||D.over||!D.ready)return;
  const key=pvKey();if(D.hist[key]!=null)return;
  D.hist[key]=a;D.sw=false;D.waitSince=Date.now();pvDPub();pvMenu();snd("ui");pvTick();
}
async function pvPlayTurn(acts){
  const d=D;d.playing=true;$("menu").innerHTML="";
  const swap=d.E.sd.some(s=>s.need),ev=swap?beSwap(d.E,acts.map(a=>a==="-"?"":a)):beTurn(d.E,acts,rngS(pvHash(d.seed+":"+d.E.turn)));
  try{await bePlay(ev)}catch(e){}
  if(D!==d||d.over)return;
  if(d.E.over!=null){
    const won=d.E.over===pvMy();
    try{if(won){$("osp").style.opacity=0;await trainerEnter("l");await say("¡Has derrotado a "+B.trainer+"!");await say("«"+TQ_WIN[Math.floor(Math.random()*TQ_WIN.length)]+"»")}
      else{await trainerEnter("w");await say("¡"+B.trainer+" ha ganado el combate!");await say("¡Todo tu equipo se debilitó! Has perdido...")}}catch(e){}
    d.playing=false;if(D===d)pvEnd("done");return;
  }
  d.playing=false;d.waitSince=0;pvMenu();pvTick();
}
async function pvSend(e){
  const me=pvMy();
  if(e.s===me){
    if(!e.forced){await say("¡Vuelve "+e.old+"!");await pbRecall("msp")}
    $("msp").style.opacity=0;setSpr(e.s,e.snap);bePaint(e.snap);if(!$("hlpp").hidden)$("hlpp").innerHTML=helpHTML();$("msp").style.opacity=0;
    const sp=say("¡Adelante, "+e.n+"!");await sendOut(PM[e.n]);await sp;
  }else{
    if(!e.forced){await say("¡"+D.oppNick+" retira a "+e.old+"!");await pbRecall("osp")}
    $("osp").style.opacity=0;setSpr(e.s,e.snap);bePaint(e.snap);if(!$("hlpp").hidden)$("hlpp").innerHTML=helpHTML();$("osp").style.opacity=0;
    await trainerSendOut(false,"osp","oi",e.n);
  }
}
function pvMenu(){
  const m=$("menu");if(!D||!D.E||D.over||!D.ready)return;
  if(D.playing){m.innerHTML="";return}
  const E=D.E,me=pvMy(),key=pvKey(),mine=D.hist[key],swap=E.sd.some(s=>s.need),side=E.sd[me],box=$("fmsg");
  const alive=side.t.map((t,i)=>({t:t,i:i})).filter(x=>x.t.mh>0&&x.i!==side.ai);
  const claim=D.waitSince&&Date.now()-D.waitSince>90000?'<button data-pv="claim">Reclamar victoria (rival inactivo)</button>':"";
  if(swap){
    if(side.need&&mine==null){box.textContent="Elige tu siguiente Pokémon:";m.innerHTML=swGrid(side.t.map((t,i)=>t.mh>0?swCard(t,'data-pv="s'+i+'"',false,""):"").join(""));return}
    box.textContent="Esperando a que "+D.oppNick+" elija su siguiente Pokémon…";m.innerHTML=claim;return;
  }
  if(mine!=null){box.textContent="Esperando la elección de "+D.oppNick+"…";m.innerHTML=claim;return}
  const pm=beAct(side),foe=beAct(E.sd[1-me]);
  if(D.sw){m.innerHTML=swGrid(side.t.map((t,i)=>swCard(t,'data-pv="s'+i+'"',i===side.ai||t.mh<=0,i===side.ai?"En combate":t.mh<=0?"Debilitado":"")).join(""))+'<button data-pv="back">Atrás</button>';return}
  box.textContent="¿Qué hará "+pm.p[0]+"?";
  m.innerHTML=(pm.pp.every(v=>v<=0)?'<button class="mvb" data-pv="st" style="--tc:#999">Forcejeo<small>¡Sin PP! Ataque desesperado</small></button>':pm.m.map((mv,i)=>mvBtn(mv,pm.pp[i],mv.pp,'data-pv="m'+i+'"',foe)).join(""))+'<button data-pv="d">🛡️ Defensa</button><button disabled title="En PVP no se pueden usar objetos">🎒 Bolsa</button><button data-pv="sw"'+(alive.length?'':' disabled')+'>🔁 Equipo</button><button data-pv="ff">🏳️ Huir</button>';
}
function pvEnd(r){
  if(!D||D.over)return;
  D.over=true;clearInterval(D.iv);try{D.unsub&&D.unsub()}catch(e){}
  let win=null;
  if(r==="done")win=D.E.over===pvMy();else if(r==="ff"||r==="left")win=true;else if(r==="self")win=false;
  S.pvp=S.pvp||{w:0,l:0};
  let txt;
  if(win===true){
    const rw0=200000+Math.floor(Math.random()*300001),pd=pvDay(),rw=Math.min(rw0,Math.max(0,PVP_CAP-pd.t));
    S.t+=rw;pd.t+=rw;S.pvp.w++;snd("win");seasonRes(true);
    txt=(r==="done"?"¡Victoria!":(r==="ff"?"El rival ha abandonado. ¡Victoria!":"El rival se ha desconectado. ¡Victoria!"))+(rw?" +"+fmt(rw)+" 🎟️":"")+(rw<rw0?(rw?" (has llegado al límite diario de "+fmt(PVP_CAP)+" 🎟️ en PVP)":" Ya has llegado al límite diario de "+fmt(PVP_CAP)+" 🎟️ ganados en PVP: hoy no recibes más tickets por duelos."):"");
  }
  else if(win===false){S.pvp.l++;seasonRes(false);snd("lose");txt=r==="self"?"Has abandonado el duelo.":"Derrota. ¡Suerte en la próxima!"}
  else txt="El rival no ha llegado a conectarse al duelo.";
  if(win!==null){qEv("pvp");if(win)qEv("pvpwin")}
  save();
  $("fmsg").textContent=txt;
  $("menu").innerHTML='<button data-pv="exit">Volver al lobby</button>';
  try{D.DR.leave()}catch(e){}
  PV.st="idle";PV.ch=null;PV.ok=null;pvPub();
}
function pvExit(){
  if(bigMode)bigSet("");
  arenaReset();const a=$("arena");a.hidden=true;$("batP").appendChild(a);
  D=null;B=null;fcd=false;
  $("pvDuel").hidden=true;$("pvLobby").hidden=false;$("fsel").hidden=false;
  updTeam();render();pvRender();
}
$("menu").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b||!b.dataset.pv)return;const v=b.dataset.pv;
  if(v==="exit"){snd("ui");pvExit();return}
  if(!D)return;
  if(v==="sw"){snd("ui");D.sw=true;pvMenu();return}
  if(v==="back"){snd("ui");D.sw=false;pvMenu();return}
  if(v==="claim"){pvEnd("left");return}
  if(v==="ff"){if(confirm("¿Seguro que quieres huir del duelo? Contará como derrota."))$("pvFf").click();return}
  if(/^(m[0-3]|d|st|s[0-5])$/.test(v))pvAct(v);
});
$("pvFf").onclick=()=>{if(R2&&R2.E){if(confirm("¿Seguro que quieres abandonar el combate 2 vs 2? Tus Pokémon contarán como debilitados."))dvAct("ff");return}if(!D||D.over)return;D.base.ff=1;pvDPub();setTimeout(()=>pvEnd("self"),250)};
$("pvList").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.pvch)pvChallenge(b.dataset.pvch);else if(b.dataset.fradd)frSend(b.dataset.fradd,b)});
$("pvIn").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.pvacc)pvAccept(b.dataset.pvacc);else if(b.dataset.pvno)pvDecline(b.dataset.pvno);else if(b.dataset.r2inv)r2Open(b.dataset.r2inv,false);else if(b.dataset.pvcancel){PV.st="idle";PV.ch=null;pvPub();pvRender()}});
// ---- apodos unicos (registro en la nube) ----
const NK={ok:false};
const nickMsg=t=>{$("pvNickMsg").textContent=t};
const nickOk=()=>NK.ok||!window.nickClaim;
async function nickInit(){
  if(!window.nickClaim)return;
  let n=pvNick(),r=await window.nickClaim(n,null);
  if(r==="taken"){
    const old=n;
    for(let k=0;k<6&&r==="taken";k++){n="Entrenador"+Math.floor(10000+Math.random()*90000);r=await window.nickClaim(n,null)}
    if(r==="ok"){S.nick=n;save();$("pvNick").value=n;nickMsg("Tu apodo «"+old+"» ya lo tiene otro jugador, así que te hemos puesto «"+n+"». Puedes cambiarlo y pulsar «Guardar apodo».")}
  }
  NK.ok=r==="ok"||r==="local";
  if(!NK.ok)nickMsg("⚠️ No se pudo registrar tu apodo ("+String(r).replace(/^error:/,"")+"). Hasta que no esté registrado no podrás jugar al PVP. Si el error es «permission-denied», revisa que las reglas de Firestore tengan el bloque «nicks».");
  pvPub();pvRender();
}
async function nickSave(){
  const old=pvNick(),nn=pvClean($("pvNick").value);
  if(nn===old&&nickOk()){$("pvNick").value=old;nickMsg("✅ Ese ya es tu apodo.");return}
  const low=nn.toLowerCase();
  if(pvOthers().some(p=>pvClean(p.presence.pvp.n).toLowerCase()===low)){nickMsg("❌ El apodo «"+nn+"» ya está siendo usado por otro jugador. Elige otro.");return}
  if(window.nickClaim){
    $("pvNick").disabled=true;$("pvNickGo").disabled=true;nickMsg("Comprobando si el apodo está libre…");
    let r;try{r=await window.nickClaim(nn,NK.ok?old:null)}catch(e){r="error:"+((e&&e.message)||"")}
    $("pvNick").disabled=false;$("pvNickGo").disabled=false;
    if(r==="taken"){nickMsg("❌ El apodo «"+nn+"» ya está siendo usado por otro jugador. Elige otro.");return}
    if(r!=="ok"&&r!=="local"){nickMsg("No se pudo comprobar el apodo ("+String(r).replace(/^error:/,"")+"). Inténtalo de nuevo.");return}
    NK.ok=r==="ok"||r==="local";
  }
  S.nick=nn;save();$("pvNick").value=nn;nickMsg("✅ Apodo guardado: «"+nn+"». Es solo tuyo: nadie más puede usarlo.");pvPub();pvRender();
}
$("pvNickGo").onclick=nickSave;
$("pvNick").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();nickSave()}};
// ================= salas 2 vs 2 con codigo =================
// Asientos 0 y 1 = Equipo A, 2 y 3 = Equipo B. Cada jugador controla su propio equipo y tiene 1 Pokémon en el campo.
let R2=null;
const dvFoes=i=>i<2?[2,3]:[0,1];
const dvKey=()=>R2.E.turn+":"+(R2.E.sd.some(s=>s.need)?"swap":"act");
const dvReq=()=>{const E=R2.E,sw=E.sd.some(s=>s.need);return [0,1,2,3].filter(i=>sw?E.sd[i].need:!E.sd[i].out)};
const r2Msg=t=>{$("r2Msg").textContent=t};
const r2NewCode=()=>{const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let c="";for(let i=0;i<5;i++)c+=A[Math.floor(Math.random()*A.length)];return c};
const r2MyId=()=>{const p=R2&&R2.room.peers().find(x=>x.isMe);return p?p.peer:null};
const r2Peers=()=>R2?R2.room.peers().filter(p=>p.presence&&p.presence.r2&&p.presence.r2.v===3&&(p.isMe||Date.now()-(p.updatedAt||0)<60000)):[];
function r2Pub(){if(!R2)return;const h={};Object.keys(R2.hist).slice(-8).forEach(k=>{h[k]=R2.hist[k]});R2.room.presence({r2:{v:3,n:pvClean(pvNick()),tr:trEnc(myLook()),prs:PRS(),host:R2.host?1:0,seat:R2.seat,seatT:R2.seatT,team:pvTeamData(),start:R2.host&&R2.start?R2.start:null,h:h}}).catch(()=>{})}
function r2Seats(){
  const own=[null,null,null,null];
  r2Peers().forEach(p=>{const v=p.presence.r2,s=v.seat;if(!(s>=0&&s<4)||!pvOkTeam(v.team))return;const c=own[s];if(!c||(v.seatT||0)<(c.presence.r2.seatT||0)||((v.seatT||0)===(c.presence.r2.seatT||0)&&p.peer<c.peer))own[s]=p});
  return own;
}
async function r2Open(code,host){
  if(R2||D||!PR)return;
  if(!nickOk()){r2Msg("Primero guarda tu apodo.");return}
  if(fcd){r2Msg("Termina tu combate actual (pulsa «Volver») antes de entrar en una sala.");return}
  if(PV.st!=="idle"){r2Msg("Cancela tu reto pendiente antes de entrar en una sala.");return}
  if(!pvTeamData().length){r2Msg("Elige un equipo de combate (arriba) para poder jugar.");return}
  code=String(code||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(code.length<4){r2Msg("Escribe un código de sala válido.");return}
  let room;try{room=await PR.join("sala-"+code.toLowerCase())}catch(e){r2Msg("No se pudo entrar en la sala.");return}
  R2={code:code,host:host,room:room,seat:-1,seatT:0,hist:{},E:null,t0:Date.now(),ph:"lobby",start:null};
  PV.st="room";pvPub();r2Msg("");
  $("pvLobby").hidden=true;$("r2Room").hidden=false;
  try{$("pvpP").scrollIntoView({behavior:"smooth",block:"start"})}catch(e){}
  R2.unsub=room.onPeers(()=>r2Tick());R2.iv=setInterval(r2Tick,500);
  r2Pub();r2Render();
}
function r2Leave(msg){
  if(!R2)return;
  clearInterval(R2.iv);try{R2.unsub&&R2.unsub()}catch(e){}try{R2.room.leave()}catch(e){}
  R2=null;PV.st="idle";PV.inv=null;pvPub();
  $("r2Room").hidden=true;$("pvLobby").hidden=false;pvRender();if(msg)r2Msg(msg);
}
function r2InviteFriend(uid){
  if(!R2)return;PV.inv=PV.inv&&PV.inv.code===R2.code?PV.inv:{to:[],code:R2.code,t:Date.now()};
  if(!PV.inv.to.includes(uid))PV.inv.to=PV.inv.to.concat(uid).slice(-8);PV.inv.t=Date.now();pvPub();R2._h="";r2Render();toast("📨 Invitación enviada");
}
function r2Render(){
  if(!R2||R2.ph!=="lobby")return;
  const own=r2Seats(),me=r2MyId(),ps=r2Peers(),full=own.every(x=>x);
  const seat=i=>{const p=own[i];if(p){const v=p.presence.r2,mine=p.peer===me;return '<div class="pvrow"><span class="pvav">'+trImg(trDec(v.tr),"f","i")+'</span><b>'+esc(pvClean(v.n))+(v.prs?' 🌟'+(v.prs|0):'')+(mine?' (tú)':'')+'</b><span class="pvtm">'+v.team.filter(x=>x&&PM[x.n]).slice(0,6).map(x=>'<span title="'+esc(x.n)+' Nv'+(+x.l||1)+'">'+ico(PM[x.n],26)+'</span>').join("")+'</span>'+(mine?'<button class="alt" data-r2up="1">Levantarse</button>':'')+'</div>'}
    return '<div class="pvrow"><small class="mut">Sitio libre</small><button data-r2seat="'+i+'">Sentarse aquí</button></div>'};
  const free=ps.filter(p=>!own.some(o=>o&&o.peer===p.peer)).map(p=>esc(pvClean(p.presence.r2.n))+(p.peer===me?' (tú)':''));
  if(R2.seat>=0&&own[R2.seat]&&own[R2.seat].peer!==me){R2.seat=-1;r2Pub();r2Msg("Ese sitio lo ha ocupado otro jugador antes que tú. Elige otro.")}
  const inRoom=new Set(ps.map(p=>p.peer)),onl=frOnline().filter(f=>!inRoom.has(f.uid));
  const inv=onl.length?'<div class="frinv"><small class="mut">Invitar a amigos conectados:</small> '+onl.map(f=>'<button class="alt" data-r2fr="'+esc(f.uid)+'">'+(PV.inv&&PV.inv.to.includes(f.uid)?'✅ ':'📨 ')+esc(f.n)+'</button>').join("")+'</div>':(window.FB?'<small class="mut">Ninguno de tus amigos está conectado ahora mismo para invitarlo.</small>':'');
  const h='<div class="lgnow"><b>👥 Sala 2 vs 2 · Código: <span style="font-size:1.4rem;letter-spacing:4px">'+esc(R2.code)+'</span></b><small class="mut">Comparte este código con 3 jugadores más o invita a tus amigos. Sentaos 2 en cada equipo; '+(R2.host?'cuando estéis los 4, pulsa «Empezar combate».':'el creador de la sala empezará el combate cuando estéis los 4.')+'</small>'+inv+
    '<div class="qgrid"><div class="qc"><b>🔴 Equipo A</b>'+seat(0)+seat(1)+'</div><div class="qc"><b>🔵 Equipo B</b>'+seat(2)+seat(3)+'</div></div>'+
    (free.length?'<small class="mut">Sin sitio: '+free.join(", ")+'</small>':'')+
    '<div class="lgbtn">'+(R2.host?'<button class="red" data-r2go="1"'+(full?'':' disabled')+'>▶ Empezar combate</button>':'')+'<button class="alt" data-r2leave="1">Salir de la sala</button></div></div>';
  if(h!==R2._h){R2._h=h;$("r2Room").innerHTML=h}
}
function r2Tick(){
  if(!R2)return;
  if(R2.ph==="lobby"){
    const ps=r2Peers(),hp=ps.find(p=>p.presence.r2.host);
    if(!R2.host&&!hp){if(Date.now()-R2.t0>8000){r2Leave("No hay ninguna sala abierta con ese código (o su creador se ha ido).");return}}
    else if(!R2.host&&hp&&hp.presence.r2.start){
      const st=hp.presence.r2.start,me=r2MyId();
      if(st&&Array.isArray(st.s)&&st.s.length===4&&st.s.some(x=>x&&x.u===me)){dvBegin(st);return}
      if(st&&!R2.spect){R2.spect=1;r2Msg("El combate de esta sala ya ha empezado sin ti.")}
    }
    r2Render();return;
  }
  dvTick();
}
function r2Start(){
  if(!R2||!R2.host||R2.ph!=="lobby")return;
  const own=r2Seats();if(!own.every(x=>x)){r2Msg("Faltan jugadores: tienen que estar los 4 sitios ocupados.");return}
  R2.start={seed:Math.floor(Math.random()*2147483647),s:own.map(p=>({u:p.peer,n:pvClean(p.presence.r2.n),tr:p.presence.r2.tr||"",team:p.presence.r2.team})),t:Date.now()};
  r2Pub();
  if(R2.start.s.some(x=>x.u===r2MyId()))dvBegin(R2.start);
  else r2Msg("¡Combate iniciado! Como no estás sentado, solo lo has organizado.");
}
$("r2New").onclick=()=>r2Open(r2NewCode(),true);
$("r2Join").onclick=()=>r2Open($("r2Code").value,false);
$("r2Code").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();r2Open($("r2Code").value,false)}};
$("r2Room").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b||!R2)return;snd("ui");
  if(b.dataset.r2seat!==undefined){R2.seat=+b.dataset.r2seat;R2.seatT=Date.now();r2Pub();R2._h="";r2Render();return}
  if(b.dataset.r2up){R2.seat=-1;r2Pub();R2._h="";r2Render();return}
  if(b.dataset.r2fr){r2InviteFriend(b.dataset.r2fr);return}
  if(b.dataset.r2go){r2Start();return}
  if(b.dataset.r2leave)r2Leave("Has salido de la sala.");
});
// ---- combate 2 vs 2 en la arena ----
const DVX=["osp2","msp2","oi2","mi2"];
function dvSlots(){
  const me=R2.me,al=me^1,fo=dvFoes(me),o=[];
  o[me]=SL_ME;
  o[al]={sp:"msp2",n:"mn2",l:"ml2",h:"mh2",hp:"mhp2",st:"mst2",tn:"mtn2",i:"mi2",back:1};
  o[fo[0]]={sp:"osp",n:"on",l:"ol",h:"oh",hp:"ohp",st:"ost",tn:"otn",i:"oi",pt:"oparty"};
  o[fo[1]]={sp:"osp2",n:"on2",l:"ol2",h:"oh2",hp:"ohp2",st:"ost2",tn:"otn2",i:"oi2"};
  return o;
}
function dvWho(i,n){return i===R2.me?n:n+" de "+R2.seats[i].n}
async function dvFoeOut(i,first){
  const sl=R2.SL[i],m=snapMon(B.snap,i);
  B.trainerName=R2.seats[i].n;
  await trainerSendOut(first,sl.sp,sl.i,m.p[0],BALLR[m.p[2]]||"pb");
}
async function dvAllyOut(i){
  const sl=R2.SL[i],m=snapMon(B.snap,i),sp=say(R2.seats[i].n+" envía a "+m.p[0]+"!");
  await sendOut(m.p,sl.sp,BALLR[m.p[2]]||"pb");
  $(sl.i).style.opacity=1;if(O.intro)$(sl.i).animate([{translate:"260px 0"},{translate:"0 0"}],{duration:600,easing:"ease-out"});
  await sp;
}
async function dvSend(e){
  const i=e.s,sl=R2.SL[i],mine=(i<2)===(R2.me<2);
  if(!e.forced)await say(i===R2.me?"¡Vuelve "+e.old+"!":R2.seats[i].n+" retira a "+e.old+".");
  $(sl.sp).style.opacity=0;setSpr(i,e.snap);bePaint(e.snap);$(sl.sp).style.opacity=0;
  if(i===R2.me){const sp=say("¡Adelante, "+e.n+"!");await sendOut(PM[e.n],sl.sp);await sp}
  else if(mine)await dvAllyOut(i);else await dvFoeOut(i,false);
}
function dvBegin(start){
  const me=start.s.findIndex(x=>x&&x.u===r2MyId());if(me<0)return;
  if(!start.s.every(x=>x&&pvOkTeam(x.team))){r2Leave("Los datos del combate no son válidos.");return}
  R2.ph="battle";R2.me=me;R2.seats=start.s.map(x=>({u:x.u,n:pvClean(x.n),tr:typeof x.tr==="string"?x.tr:"",team:x.team}));
  R2.E=beNew(R2.seats.map(x=>beSide(pvMk(x.team))),[[0,1],[2,3]],start.seed|0);R2.SL=dvSlots();
  R2.playing=true;R2.ready=false;R2.sub="";R2.lastAct=Date.now();
  fcd=true;updTeam();
  const a=$("arena");$("pvDuel").appendChild(a);a.hidden=false;arenaReset();
  $("r2Room").hidden=true;$("pvLobby").hidden=true;$("pvDuel").hidden=false;
  const fo=dvFoes(me);
  $("pvVs").textContent="2 vs 2 · "+R2.seats[me].n+" y "+R2.seats[me^1].n+" ⚔️ "+R2.seats[fo[0]].n+" y "+R2.seats[fo[1]].n;
  BTE().classList.add("dbl");DVX.forEach(id=>{$(id).hidden=false});
  B={mode:"dv",E:R2.E,me:me,SL:R2.SL,trainer:R2.seats[fo[0]].n,tsrc:{c:R2.seats[fo[0]].tr},showOpp:true,busy:true,
    who:dvWho,mine:i=>(i<2)===(me<2),onSend:dvSend,
    onFf:async e=>{await say(e.s===R2.me?"Has abandonado el combate.":R2.seats[e.s].n+" ha abandonado el combate.")},
    onOut:async e=>{await say(e.s===R2.me?"¡Te has quedado sin Pokémon!":"¡"+R2.seats[e.s].n+" se ha quedado sin Pokémon!")}};
  const sn=beSnap(R2.E);[0,1,2,3].forEach(i=>setSpr(i,sn));bePaint(sn);xpBar();
  [me^1,fo[0],fo[1]].forEach(i=>{const t=R2.SL[i].tn;if(t)$(t).textContent="👤 "+R2.seats[i].n});
  $("hlpp").hidden=true;setScene($("bscene"),envOf(snapMon(sn,fo[0]).p[1]));$("menu").innerHTML="";
  ["osp","msp","oi","mi"].concat(DVX).forEach(id=>{$(id).style.opacity=0});
  if(O.bigmode&&!bigMode)bigSet(O.bigmode);
  try{$("pvpP").scrollIntoView({behavior:"smooth",block:"start"})}catch(e){}
  const r=R2;
  (async()=>{
    try{
      await introFlash();playerIn();
      await trainerEnter("i");snd("wild");
      await say("¡"+r.seats[fo[0]].n+" y "+r.seats[fo[1]].n+" os desafían!");
      await dvFoeOut(fo[0],true);await dvFoeOut(fo[1],false);
      await playerThrow(beAct(r.E.sd[me]),"msp","mi");await dvAllyOut(me^1);
    }catch(e){}
    if(R2!==r)return;r.playing=false;r.ready=true;dvTick();
  })();
}
function dvAct(a){
  if(!R2||!R2.E||R2.playing||!R2.ready||R2.E.over!=null)return;
  const key=dvKey();if(R2.hist[key]!=null||!dvReq().includes(R2.me))return;
  R2.hist[key]=a;R2.sub="";R2.lastAct=Date.now();r2Pub();snd("ui");dvTick();
}
function dvTick(){
  if(!R2||R2.ph!=="battle"||R2.playing||!R2.ready||R2.E.over!=null)return;
  const key=dvKey(),req=dvReq(),ps=R2.room.peers(),acts=[null,null,null,null];
  req.forEach(i=>{if(i===R2.me)acts[i]=R2.hist[key];else{const p=ps.find(x=>x.peer===R2.seats[i].u),v=p&&p.presence&&p.presence.r2;acts[i]=v&&v.h?v.h[key]:null}});
  if(req.every(i=>acts[i]!=null))dvPlayTurn(acts);else dvMenu(req,acts);
}
async function dvPlayTurn(acts){
  const r=R2;r.playing=true;$("menu").innerHTML="";r._m="";
  const ev=r.E.sd.some(s=>s.need)?beSwap(r.E,acts):beTurn(r.E,acts,rngS(pvHash(r.E.seed+":2v2:"+r.E.turn)));
  try{await bePlay(ev)}catch(e){}
  if(R2!==r)return;
  r.playing=false;r.lastAct=Date.now();
  if(r.E.over!=null){dvEnd(r.E.over);return}
  dvTick();
}
function dvMenu(req,acts){
  const r=R2,E=r.E,me=r.me,side=E.sd[me],key=dvKey(),box=$("fmsg"),m=$("menu");
  let h="",t="";
  const waitN=req.filter(i=>acts[i]==null&&i!==me).map(i=>r.seats[i].n);
  const claimable=waitN.length&&Date.now()-r.lastAct>120000&&req.filter(i=>acts[i]==null).every(i=>dvFoes(me).includes(i));
  const foesAlive=dvFoes(me).filter(i=>!E.sd[i].out&&beAct(E.sd[i]).mh>0);
  if(!req.includes(me)){t=side.out?"Ya no te quedan Pokémon. Esperando a que termine el combate… ("+waitN.join(", ")+")":"Esperando a: "+waitN.join(", ")+"…";h=claimable?'<button data-dv="claim">Reclamar victoria (rivales inactivos)</button>':""}
  else if(r.hist[key]!=null){t="Esperando a: "+waitN.join(", ")+"…";h=claimable?'<button data-dv="claim">Reclamar victoria (rivales inactivos)</button>':""}
  else if(side.need){t="Elige tu siguiente Pokémon:";h=swGrid(side.t.map((x,i)=>x.mh>0?swCard(x,'data-dv="s'+i+'"',false,""):"").join(""))}
  else{
    const pm=beAct(side);
    if(r.sub==="sw"){t="¿A qué Pokémon cambias?";h=swGrid(side.t.map((x,i)=>swCard(x,'data-dv="s'+i+'"',i===side.ai||x.mh<=0,i===side.ai?"En combate":x.mh<=0?"Debilitado":"")).join(""))+'<button data-dv="back">Atrás</button>'}
    else if(r.sub[0]==="t"){const mvk=r.sub.slice(1),mv=mvk==="st"?STRUG:pm.m[+mvk.slice(1)];t="¿A quién atacas con "+mv.n+"?";h=foesAlive.map(i=>{const q=beAct(E.sd[i]);return '<button data-dv="'+mvk+'t'+i+'">'+esc(q.p[0])+'<small>de '+esc(r.seats[i].n)+' · PS '+q.mh+'/'+q.mx+effTag(mv,q)+'</small></button>'}).join("")+'<button data-dv="back">Atrás</button>'}
    else{
      t="¿Qué hará "+pm.p[0]+"?";
      const alive=side.t.some((x,i)=>x.mh>0&&i!==side.ai),foe=foesAlive.length?beAct(E.sd[foesAlive[0]]):null;
      h=(pm.pp.every(v=>v<=0)?'<button class="mvb" data-dv="pk:st" style="--tc:#999">Forcejeo<small>¡Sin PP! Ataque desesperado</small></button>':pm.m.map((mv,i)=>mvBtn(mv,pm.pp[i],mv.pp,'data-dv="pk:m'+i+'"',foesAlive.length===1?foe:null)).join(""))+'<button data-dv="d">🛡️ Defensa</button><button disabled title="En PVP no se pueden usar objetos">🎒 Bolsa</button><button data-dv="sw"'+(alive?'':' disabled')+'>🔁 Equipo</button><button data-dv="ff">🏳️ Huir</button>';
    }
  }
  if(box.textContent!==t)box.textContent=t;
  if(r._m!==h){r._m=h;m.innerHTML=h}
}
function dvEnd(w){
  const r=R2;if(!r||r.done)return;r.done=true;
  const mySide=r.me<2?0:1;S.pvp=S.pvp||{w:0,l:0};let txt;
  if(w==="D"){txt="¡Empate! Los dos equipos se han quedado sin Pokémon a la vez."}
  else if(w===mySide){
    const rw0=200000+Math.floor(Math.random()*300001),pd=pvDay(),rw=Math.min(rw0,Math.max(0,PVP_CAP-pd.t));
    S.t+=rw;pd.t+=rw;S.pvp.w++;seasonRes(true);snd("win");qEv("pvp");qEv("pvpwin");
    txt="¡Vuestro equipo ha ganado el combate 2 vs 2!"+(rw?" +"+fmt(rw)+" 🎟️":"")+(rw<rw0?(rw?" (has llegado al límite diario de "+fmt(PVP_CAP)+" 🎟️ en PVP)":" Ya has llegado al límite diario de "+fmt(PVP_CAP)+" 🎟️ en PVP."):"");
  }else{S.pvp.l++;seasonRes(false);snd("lose");qEv("pvp");txt="Vuestro equipo ha perdido el combate 2 vs 2. ¡Suerte en la próxima!"}
  save();
  $("fmsg").textContent=txt;r._m="";$("menu").innerHTML='<button data-dv="exit">Volver al lobby</button>';
  clearInterval(r.iv);
}
function dvExit(){
  if(bigMode)bigSet("");
  arenaReset();
  const a=$("arena");a.hidden=true;$("batP").appendChild(a);
  B=null;fcd=false;$("pvDuel").hidden=true;
  r2Leave("");updTeam();render();
}
$("menu").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b||!b.dataset.dv)return;const v=b.dataset.dv;
  if(v==="exit"){snd("ui");dvExit();return}
  if(!R2||!R2.E)return;
  if(v==="claim"){dvEnd(R2.me<2?0:1);return}
  if(v==="sw"){snd("ui");R2.sub="sw";R2._m="";dvTick();return}
  if(v==="back"){snd("ui");R2.sub="";R2._m="";dvTick();return}
  if(v==="ff"){if(confirm("¿Seguro que quieres abandonar el combate 2 vs 2? Tus Pokémon contarán como debilitados."))dvAct("ff");return}
  if(v.slice(0,3)==="pk:"){
    const mk=v.slice(3),side=R2.E.sd[R2.me],pm=beAct(side),mv=mk==="st"?STRUG:pm.m[+mk.slice(1)];
    const foes=dvFoes(R2.me).filter(i=>!R2.E.sd[i].out&&beAct(R2.E.sd[i]).mh>0);
    if(!mv)return;
    if(mv.tself||foes.length<2){dvAct(mk+(foes.length===1&&!mv.tself?"t"+foes[0]:""));return}
    snd("ui");R2.sub="t"+mk;R2._m="";dvTick();return;
  }
  if(/^(?:(?:m[0-3]|st)t[0-3]|d|s[0-5])$/.test(v))dvAct(v);
});
