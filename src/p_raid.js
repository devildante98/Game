// =====================================================================================
// INCURSIONES EN DIRECTO: de 1 a 4 jugadores contra un jefe enorme con PS compartidos
// Firestore: raids/{id}
// =====================================================================================
const RD_MAX=4,RD_DUR=180000,RD_HP=14000,RD_DAY=5;
var RD={id:null,d:null,unsub:null,list:null,at:0,acc:0,flushT:0,me:null,team:null,ai:0,cd:0,out:false,phase:"",res:null};
function raidBoss(t){// jefe que cambia cada 3 horas, igual para todos
  const k=Math.floor((t||Date.now())/(3*36e5));let h=0;for(const ch of "raid"+k)h=(h*31+ch.charCodeAt(0))|0;h=Math.abs(h);
  const pool=P.filter(p=>p[2]==="M"||p[2]==="L");return pool[h%pool.length]}
const raidLeft=()=>{const s=mgState();return Math.max(0,RD_DAY-(s.n.raid|0))};
function rdShell(){
  mgStop();MG.g={id:"raid",n:"Incursión",ic:"🔴",c:"#b3123b"};hubClose();
  let m=$("mgM");if(!m){m=document.createElement("div");m.id="mgM";m.setAttribute("role","dialog");document.body.appendChild(m)}m.style.setProperty("--mc","#b3123b");
  m.innerHTML='<div class="mgw rdw"><div class="mgh"><span class="mgic">🔴</span><b>Incursión</b><span class="mgsc" id="rdTm">--:--</span><button class="mgx rdchb" data-rdchat="1" aria-label="Abrir el chat" title="Chat">💬</button><button class="mgx" aria-label="Salir de la incursión">✕</button></div><div class="mgb" id="mgB"></div></div>';m.hidden=false;
  m.querySelector(".mgx:not(.rdchb)").onclick=()=>{rdLeave();mgClose()};
}
async function rdCreate(){
  if(!window.FB||!window.FB.raidNew)return;if(fcd){toast("Termina el combate primero.");return}
  const me=window.FB.uid(),b=raidBoss(),id=me+"_"+Date.now();
  const d={h:me,hn:pvClean(pvNick()).slice(0,30),boss:b[0],st:"lobby",hp:0,mx:0,pl:{[me]:rdMe()},at:Date.now()};
  try{await window.FB.raidNew(id,d)}catch(e){toast("No se ha podido crear la sala.");return}rdJoinWatch(id);
}
function rdMe(){const t=(S.team||[]).filter(n=>n&&S.owned[n]);return{n:pvClean(pvNick()).slice(0,30),tr:trEnc(myLook()),dmg:0,lead:t[0]||"",at:Date.now()}}
async function rdJoin(id){
  if(!window.FB)return;if(fcd){toast("Termina el combate primero.");return}if(!(S.team||[]).some(n=>n&&S.owned[n])){toast("Necesitas un equipo para entrar en una incursión.");return}
  try{await window.FB.raidJoin(id,window.FB.uid(),rdMe())}catch(e){toast("No se ha podido entrar: la sala está llena o ya ha empezado.");return}rdJoinWatch(id);
}
function rdJoinWatch(id){
  if(RD.unsub)try{RD.unsub()}catch(e){}RD.id=id;RD.me=window.FB.uid();RD.phase="lobby";RD.res=null;RD.out=false;RD.acc=0;
  const names=(S.team||[]).filter(n=>n&&S.owned[n]);RD.team=names.map(n=>{const ids=moveIds(n),m=beMon(PM[n],lvd(n).l,null,ids);monX(m,natOf(n),heldOf(n));m.mh=m.mx;m.sh=S.shiny&&S.shiny[n]>0?1:0;return m});RD.ai=0;
  rdShell();
  RD.unsub=window.FB.raidWatch(id,d=>{if(RD.id!==id)return;if(!d){if(RD.phase==="lobby"){toast("La sala se ha cerrado.");mgClose();rdLeave()}return}RD.d=d;rdTick(true)});
  mgI(()=>rdTick(false),250);
}
function rdLeave(){
  rdFlush();if(RD.unsub)try{RD.unsub()}catch(e){}RD.unsub=null;
  const d=RD.d,me=RD.me;if(d&&RD.id&&window.FB){if(d.st==="lobby"){if(d.h===me)window.FB.raidDel(RD.id).catch(()=>{});else window.FB.raidUpd(RD.id,{["pl."+me]:S_DEL()}).catch(()=>{})}}
  RD.id=null;RD.d=null;RD.phase="";
}
const S_DEL=()=>window.FB.del();
function rdTick(fromSnap){
  const d=RD.d;if(!d||!$("mgB"))return;const now=Date.now(),me=RD.me,pl=d.pl||{},ids=Object.keys(pl);
  if(d.st==="lobby"){RD.phase="lobby";const b=PM[d.boss]||raidBoss();if(!fromSnap&&$("rdLob"))return;
    $("rdTm").textContent=ids.length+"/"+RD_MAX;
    $("mgB").innerHTML='<div class="rdlob" id="rdLob"><div class="rdbossv">'+icoHD(b,180,false,false)+'</div><h3>'+esc(d.boss)+' <small>'+STAR[b[2]]+' · '+tyTxt(b)+'</small></h3><p class="mut">Esperando entrenadores… ('+ids.length+'/'+RD_MAX+'). Tenéis 3 minutos para derrotarlo entre todos.</p>'+(ids.length<RD_MAX?'<button class="rdinv" data-rdchat="inv">📨 Invitar a más gente por el chat</button>':'')+'<div class="rdpl">'+ids.map(u=>'<div class="rdp"><span class="chav">'+chAv(pl[u].tr)+'</span><b>'+esc(pvClean(pl[u].n||""))+(u===d.h?' 👑':'')+'</b>'+(pl[u].lead&&PM[pl[u].lead]?'<span class="rdlead">'+ico(PM[pl[u].lead],36)+'</span>':'')+'</div>').join("")+'</div>'+
      (d.h===me?'<button class="red big" id="rdGo">⚔️ ¡Empezar la incursión!</button><small class="mut">Cuantos más seáis, más PS tendrá el jefe… ¡pero más probabilidades de ganar!</small>':'<p><b>Esperando a que el anfitrión empiece…</b></p>')+'</div>';
    const g=$("rdGo");if(g)g.onclick=()=>{const n=Object.keys(RD.d.pl||{}).length,mx=Math.round(RD_HP*n*(PM[d.boss][2]==="L"?1.15:1));window.FB.raidUpd(RD.id,{st:"fight",hp:mx,mx:mx,go:Date.now()+3500,end:Date.now()+3500+RD_DUR}).catch(()=>toast("No se ha podido empezar."))};
    return}
  if(d.st==="fight"||d.st==="end"){
    if(RD.phase==="lobby"||RD.phase==="")rdFightUI();RD.phase=RD.phase==="catch"||RD.phase==="done"?RD.phase:"fight";
    const hp=Math.max(0,(d.hp|0)-RD.acc),k=d.mx?hp/d.mx:0,bar=$("rdHp");if(bar){bar.style.width=(k*100)+"%";bar.style.background=k>.5?"#3ecf8e":k>.2?"#ffd35c":"#e63950"}
    const hpt=$("rdHpT");if(hpt)hpt.textContent=fmt(hp)+" / "+fmt(d.mx|0);
    const t0=d.go||now,tl=Math.max(0,(d.end||now)-now);$("rdTm").textContent=now<t0?"¡"+Math.ceil((t0-now)/1000)+"!":Math.floor(tl/60000)+":"+String(Math.floor(tl%60000/1000)).padStart(2,"0");
    const rk=$("rdRk");if(rk&&fromSnap)rk.innerHTML=ids.sort((a,b)=>(pl[b].dmg|0)-(pl[a].dmg|0)).map(u=>'<span class="'+(u===me?'me':'')+'"><span class="chav">'+chAv(pl[u].tr)+'</span>'+esc(pvClean(pl[u].n||"").slice(0,10))+' <b>'+fmt((pl[u].dmg|0)+(u===me?RD.acc:0))+'</b></span>').join("");
    if(RD.phase==="fight"){
      if(hp<=0&&d.mx){rdFlush();if(d.st!=="end")window.FB.raidUpd(RD.id,{st:"end",win:1}).catch(()=>{});rdWin();return}
      if(d.st==="end"&&!d.win||now>(d.end||Infinity)+1500){rdFlush();if(d.st!=="end")window.FB.raidUpd(RD.id,{st:"end",win:0}).catch(()=>{});rdLose();return}
      if(now>=t0&&!RD.out&&now-(RD.bossAt||0)>3600){RD.bossAt=now;if(RD.bossAt0)rdBossHit();RD.bossAt0=1}
    }
  }
}
function rdFightUI(){
  const d=RD.d,b=PM[d.boss];RD.bossAt=Date.now()+2000;RD.bossAt0=0;
  $("mgB").innerHTML='<div class="rdf"><div class="rdtop"><div class="rdhpw"><b>'+esc(d.boss)+'</b><div class="rdhp"><i id="rdHp"></i></div><small id="rdHpT"></small></div><div class="rdbig" id="rdBoss">'+icoHD(b,200,false,false)+'</div></div>'+
    '<div class="rdrk" id="rdRk"></div><div class="rdme" id="rdMe"></div><div class="rdmv" id="rdMv"></div><p class="rdmsg" id="rdMsg">¡El jefe ruge con fuerza!</p></div>';
  rdMeUI();
}
function rdMeUI(){const m=RD.team[RD.ai],box=$("rdMe");if(!box)return;
  if(!m||RD.out){box.innerHTML='<b>Todo tu equipo se ha debilitado. ¡Anima a tus compañeros!</b>';$("rdMv").innerHTML="";return}
  box.innerHTML='<span class="rdmspr">'+ico(m.p,72,true,!!m.sh)+'</span><div><b>'+esc(nk(m.p[0]))+' <small>Nv'+m.l+'</small></b><div class="rdhp sm"><i style="width:'+(m.mh/m.mx*100)+'%;background:'+(m.mh/m.mx>.5?"#3ecf8e":m.mh/m.mx>.2?"#ffd35c":"#e63950")+'"></i></div><small>PS '+m.mh+'/'+m.mx+'</small></div>';
  const foe=PM[RD.d.boss];$("rdMv").innerHTML=m.m.filter(mv=>mv.cl>0).slice(0,4).map((mv,k)=>'<button class="mvb" data-rdm="'+m.m.indexOf(mv)+'" style="--tc:'+(TC[mv.t]||"#999")+'"><span>'+esc(mv.n)+'</span><small>'+EM[mv.t]+' '+TIPO[mv.t]+' · Pot. '+(mv.pw||40)+effTag(mv,{p:foe})+'</small></button>').join("")||'<button class="mvb" data-rdm="-1"><span>Placaje</span><small>Pot. 40</small></button>';
}
function rdAttack(k){
  if(RD.phase!=="fight"||RD.out||!RD.d)return;const now=Date.now();if(now<(RD.d.go||0)||now<RD.cd)return;const m=RD.team[RD.ai];if(!m||m.mh<=0)return;
  const mv=k>=0?m.m[k]:{n:"Placaje",pw:40,t:"normal",cl:1},foe=PM[RD.d.boss],e=mv.typeless?1:effP(mv.t,foe),stab=stabP(mv.t,m.p)?1.5:1,cr=Math.random()<(m.it==="scope"?.12:.06);
  const dmg=Math.max(1,Math.round(m.ma*(mv.pw||40)/45*e*stab*(.85+Math.random()*.15)*(cr?1.5:1)*(m.it==="lorb"?1.3:1)*2.2));
  RD.acc+=dmg;RD.cd=now+Math.max(650,900+(mv.pw||40)*3);snd("hit",e);
  const bs=$("rdBoss");if(bs&&!hubCalm()){bs.animate([{transform:"translateX(0)",filter:"brightness(1)"},{transform:"translateX(-8px)",filter:"brightness(2.2)"},{transform:"translateX(6px)"},{transform:"none",filter:"brightness(1)"}],{duration:300});const r=bs.getBoundingClientRect();mgPop(r.left+r.width/2+Math.random()*80-40,r.top+r.height/3,(cr?"¡Crítico! ":"")+fmt(dmg),e>1?"#ffd35c":e<1?"#9aa":"#fff")}
  $("rdMsg").textContent=nk(m.p[0])+" usa "+mv.n+(e>1?". ¡Es súper eficaz!":e<1?". No es muy eficaz…":"");
  document.querySelectorAll("#rdMv button").forEach(b=>{b.disabled=true;setTimeout(()=>{b.disabled=false},RD.cd-now)});
  if(!RD.flushT)RD.flushT=setTimeout(rdFlush,900);rdTick(false);
}
function rdFlush(){clearTimeout(RD.flushT);RD.flushT=0;const a=RD.acc;if(!a||!RD.id||!window.FB)return;RD.acc=0;window.FB.raidHit(RD.id,RD.me,a).catch(()=>{RD.acc+=a})}
function rdBossHit(){
  const m=RD.team[RD.ai];if(!m||RD.out)return;const foe=PM[RD.d.boss],e=effP(foe[1],m.p),dmg=Math.max(1,Math.round(m.mx*(.11+Math.random()*.1)*e/(m.nd||1)));
  m.mh=Math.max(0,m.mh-dmg);snd("hit",1);const me=$("rdMe");if(me&&!hubCalm())me.animate([{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"none"}],{duration:220});
  const bs=$("rdBoss");if(bs&&!hubCalm())bs.animate([{transform:"scale(1)"},{transform:"scale(1.08) translateY(10px)"},{transform:"none"}],{duration:300});
  $("rdMsg").textContent="¡"+RD.d.boss+" ataca! "+(e>1?"¡Es súper eficaz! ":"")+nk(m.p[0])+" pierde "+dmg+" PS.";
  if(m.mh<=0){const nx=RD.team.findIndex(t=>t.mh>0);if(nx<0){RD.out=true;$("rdMsg").textContent="¡Todo tu equipo se ha debilitado!";snd("faint")}else{RD.ai=nx;snd("faint");$("rdMsg").textContent=nk(m.p[0])+" se ha debilitado. ¡Adelante, "+nk(RD.team[nx].p[0])+"!"}}
  rdMeUI();
}
async function rdWin(){
  if(RD.phase!=="fight")return;RD.phase="catch";mgStop();const d=RD.d,b=PM[d.boss],pl=d.pl||{},ids=Object.keys(pl).sort((a,c)=>(pl[c].dmg|0)-(pl[a].dmg|0)),rank=ids.indexOf(RD.me);
  const st=mgState(),prize=raidLeft()>0;if(prize){st.n.raid=(st.n.raid|0)+1}
  let rw=null;if(prize){rw={t:400000+(rank===0?200000:0),it:{ub:2}};if(Math.random()<.4)rw.it.cand=1;if(Math.random()<.3){const k=HOLD[Math.floor(Math.random()*HOLD.length)][0];rw.it[k]=1}grant(rw)}
  qEv("win");save();render();snd("win");mgConfetti();
  let balls=prize?5+(rank===0?2:rank===1?1:0):0;const sh=Math.random()<1/50;
  const draw=msg=>{$("mgB").innerHTML='<div class="mgintro"><h3>¡Habéis derrotado a '+esc(d.boss)+'!</h3><div class="rdcatch" id="rdC">'+icoHD(b,170,false,sh)+'</div><p>'+(msg||'¡Ahora puedes intentar capturarlo! Te quedan <b>'+balls+'</b> Poké Balls Honor.')+'</p>'+(rw?'<p>Premio: <b>'+rwTxt(rw)+'</b></p>':'<p class="mut">Hoy ya has cobrado los '+RD_DAY+' premios de incursiones.</p>')+
    '<div class="mgbtns">'+(balls>0&&RD.phase==="catch"?'<button class="red big" id="rdT">🔴 Lanzar Poké Ball Honor</button>':'')+'<button class="alt" id="rdX">Cerrar</button></div><div class="rdrk">'+ids.map((u,i)=>'<span class="'+(u===RD.me?'me':'')+'">'+(["🥇","🥈","🥉"][i]||"")+' '+esc(pvClean(pl[u].n||"").slice(0,10))+' <b>'+fmt(pl[u].dmg|0)+'</b></span>').join("")+'</div></div>';
    const t=$("rdT");if(t)t.onclick=throwB;$("rdX").onclick=()=>{rdLeave();mgClose()}};
  const throwB=async()=>{if(balls<=0||RD.phase!=="catch")return;balls--;snd("throw");const c=$("rdC");if(c&&!hubCalm()){await c.animate([{transform:"scale(1)"},{transform:"scale(.2)",opacity:.2},{transform:"scale(.2)",opacity:.2,offset:.8},{transform:"scale(1)",opacity:1}],{duration:1400}).finished}
    const ok=Math.random()<(b[2]==="L"?.22:.32)+(rank===0?.05:0);
    if(ok){RD.phase="done";const lv=clampL(Math.min(lvCap(),leadLevel())),isNew=giveMon(d.boss,lv,sh);qEv("cap");save();render();snd("capok");mgConfetti();draw('🎉 ¡Has capturado a '+(sh?'✨ ':'')+'<b>'+esc(d.boss)+'</b>!'+(isNew?' <b class="mgnew">¡NUEVO!</b>':''))}
    else{snd("capfail");if(balls<=0){RD.phase="done";draw('¡'+esc(d.boss)+' ha escapado! Más suerte la próxima vez.')}else draw('¡Oh, no! ¡Se ha escapado de la Poké Ball! Te quedan <b>'+balls+'</b>.')}};
  draw();
}
function rdLose(){if(RD.phase!=="fight")return;RD.phase="done";mgStop();const d=RD.d,rw={t:50000};grant(rw);save();render();snd("lose");
  $("mgB").innerHTML='<div class="mgintro"><div class="mgbig">⌛</div><h3>¡'+esc(d.boss)+' ha resistido!</h3><p>Se ha acabado el tiempo. Premio de consolación: <b>'+rwTxt(rw)+'</b></p><div class="mgbtns"><button class="alt" id="rdX">Cerrar</button></div></div>';$("rdX").onclick=()=>{rdLeave();mgClose()}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#mgB [data-rdm]");if(b)rdAttack(+b.dataset.rdm)});
document.addEventListener("keydown",e=>{if(RD.phase==="fight"&&/^[1-4]$/.test(e.key)){const b=document.querySelectorAll("#rdMv button")[+e.key-1];if(b&&!b.disabled)b.click()}});
// ---- panel ----
nxPanel("raidP","🔴 Incursiones","Uníos hasta 4 entrenadores para derrotar a un jefe gigante entre todos. Si lo vencéis, cada uno puede intentar capturarlo. El jefe cambia cada 3 horas.");
{const g=HUB.find(x=>x.k==="onl");if(g&&!g.tabs.some(t=>t[0]==="raidP"))g.tabs.splice(1,0,["raidP","Incursiones"]);HUBP.raidP="onl";HUBR.raidP=()=>raidUI(true)}
async function raidUI(force){
  const box=$("raidPB");if(!box)return;const b=raidBoss(),nxt=(Math.floor(Date.now()/(3*36e5))+1)*3*36e5;
  let h='<div class="rdcard"><div class="rdbossv">'+icoHD(b,170,false,false)+'</div><div><small>JEFE ACTUAL · cambia en '+hhFmt(nxt-Date.now())+'</small><h3>'+esc(b[0])+'</h3><small>'+STAR[b[2]]+' · '+tyTxt(b)+' · Débil a: '+Object.keys(TIPO).filter(t=>effP(t,b)>1).map(t=>EM[t]).join(" ")+'</small><div class="mginf"><span>🎁 Premios hoy: <b>'+raidLeft()+'/'+RD_DAY+'</b></span></div>'+(window.FB?'<button class="red big" id="rdNew">➕ Crear sala</button>':'<small class="mut">Inicia sesión para participar en incursiones.</small>')+'</div></div>';
  h+='<h3 class="shh">Salas abiertas</h3><div id="rdList">'+rdListHTML()+'</div>';box.innerHTML=h;const n=$("rdNew");if(n)n.onclick=rdCreate;
  if(window.FB&&window.FB.raidList&&(force||!RD.list||Date.now()-RD.at>15e3)){try{RD.list=await window.FB.raidList();RD.at=Date.now()}catch(e){RD.list=RD.list||[]}const l=$("rdList");if(l)l.innerHTML=rdListHTML()}
}
function rdListHTML(){if(!window.FB)return "";if(!RD.list)return '<small class="mut">Cargando…</small>';const now=Date.now(),L=RD.list.filter(d=>d.st==="lobby"&&now-(d.at||0)<10*6e4);
  return L.length?L.map(d=>{const n=Object.keys(d.pl||{}).length,b=PM[d.boss];return '<div class="pvrow rdrow">'+(b?ico(b,40):'')+'<b>'+esc(d.boss)+'</b><small class="mut">de '+esc(pvClean(d.hn||""))+' · '+n+'/'+RD_MAX+'</small><span style="flex:1"></span><button class="red mini" data-rdj="'+esc(d.id)+'"'+(n>=RD_MAX?' disabled':'')+'>Unirse</button></div>'}).join("")+'<button class="alt mini" data-rdr="1">🔄 Actualizar</button>':'<small class="mut">No hay salas abiertas ahora mismo. ¡Crea una y avisa a tus amigos por el chat!</small> <button class="alt mini" data-rdr="1">🔄 Actualizar</button>'}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-rdj],[data-rdr]");if(!b)return;if(b.dataset.rdj)rdJoin(b.dataset.rdj);else raidUI(true)});
setInterval(()=>{try{if(nxOpen("raidP"))raidUI(false)}catch(e){}},15000);
// el chat se puede abrir encima de la incursión para invitar a más gente
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-rdchat]");if(!b||typeof chToggle!=="function")return;snd("ui");
  chToggle(true);if(b.dataset.rdchat==="inv"&&typeof CH!=="undefined"){CH.inv=true;CH.emo=CH.pick=false;try{chPanels()}catch(x){}}});
