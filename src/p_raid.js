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
  const d={h:me,hn:pvClean(pvNick()).slice(0,30),boss:b[0],st:"lobby",hp:0,mx:0,pl:{[me]:rdMe(b[0])},at:Date.now()};
  try{await window.FB.raidNew(id,d)}catch(e){toast("No se ha podido crear la sala.");return}rdJoinWatch(id);
}
function rdMe(boss){const t=(S.team||[]).filter(n=>n&&S.owned[n]);let pw=0;try{pw=Math.round(rdPow(rdBuildTeam(),PM[boss]||raidBoss()))}catch(e){}return{n:pvClean(pvNick()).slice(0,30),tr:trEnc(myLook()),dmg:0,lead:t[0]||"",pw:pw,at:Date.now()}}
async function rdJoin(id){
  if(!window.FB)return;if(fcd){toast("Termina el combate primero.");return}if(!(S.team||[]).some(n=>n&&S.owned[n])){toast("Necesitas un equipo para entrar en una incursión.");return}
  const it=(RD.list||[]).find(x=>x.id===id);try{await window.FB.raidJoin(id,window.FB.uid(),rdMe(it&&it.boss))}catch(e){toast("No se ha podido entrar: la sala está llena o ya ha empezado.");return}rdJoinWatch(id);
}
function rdJoinWatch(id){
  if(RD.unsub)try{RD.unsub()}catch(e){}RD.id=id;RD.me=window.FB.uid();RD.phase="lobby";RD.res=null;RD.out=false;RD.acc=0;
  RD.team=rdBuildTeam();RD.ai=0;
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
    $("mgB").innerHTML='<div class="rdlob" id="rdLob"><div class="rdbossv">'+icoHD(b,180,false,false)+'</div><h3>'+esc(d.boss)+' <small>'+STAR[b[2]]+' · '+tyTxt(b)+'</small></h3><p class="mut">Esperando entrenadores… ('+ids.length+'/'+RD_MAX+'). Tenéis 3 minutos para derrotarlo entre todos. Toca para atacar, carga los ataques fuertes y esquiva cuando el jefe brille en amarillo.</p>'+(ids.length<RD_MAX?'<button class="rdinv" data-rdchat="inv">📨 Invitar a más gente por el chat</button>':'')+'<div class="rdpl">'+ids.map(u=>'<div class="rdp"><span class="chav">'+chAv(pl[u].tr)+'</span><b>'+esc(pvClean(pl[u].n||""))+(u===d.h?' 👑':'')+'</b>'+(pl[u].lead&&PM[pl[u].lead]?'<span class="rdlead">'+ico(PM[pl[u].lead],36)+'</span>':'')+'</div>').join("")+'</div>'+
      (d.h===me?'<button class="red big" id="rdGo">⚔️ ¡Empezar la incursión!</button><small class="mut">Cuantos más seáis, más PS tendrá el jefe… ¡pero más probabilidades de ganar!</small>':'<p><b>Esperando a que el anfitrión empiece…</b></p>')+'</div>';
    const g=$("rdGo");if(g)g.onclick=()=>{const mx=rdBossHP(RD.d);window.FB.raidUpd(RD.id,{st:"fight",hp:mx,mx:mx,go:Date.now()+3500,end:Date.now()+3500+RD_DUR}).catch(()=>toast("No se ha podido empezar."))};
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
    }
  }
}
// ---------- combate al estilo de las incursiones en directo: tocar, cargar y esquivar ----------
const RDT=180,RDTAP={n:"Placaje",pw:40,t:"normal",cl:1};
function rdBuildTeam(){return (S.team||[]).filter(n=>n&&S.owned[n]).map(n=>{const ids=moveIds(n),m=beMon(PM[n],blv(n),null,ids);monX(m,natOf(n),heldOf(n));m.ab=abOf(n);m.mh=m.mx;m.sh=S.shiny&&S.shiny[n]>0?1:0;rdPrep(m);return m})}
// ataque rápido: el más flojo; ataques cargados: los dos más fuertes
const RDFAST={normal:"Placaje",fire:"Ascuas",water:"Pistola Agua",grass:"Látigo Cepa",electric:"Impactrueno",ice:"Nieve Polvo",fighting:"Golpe Karate",poison:"Picotazo Veneno",ground:"Bofetón Lodo",flying:"Ataque Ala",psychic:"Confusión",bug:"Picadura",rock:"Lanzarrocas",ghost:"Lengüetazo",dragon:"Dragoaliento",dark:"Mordisco",steel:"Garra Metal",fairy:"Viento Feérico"};
function rdPrep(m){const dm=m.m.filter(mv=>mv&&mv.cl>0&&(mv.pw|0)>0).sort((a,b)=>(a.pw|0)-(b.pw|0));
  const t=tys(m.p)[0],sp=bsSR(m.p)>1;m.fm=dm.length>1&&(dm[0].pw|0)<=65?dm[0]:{n:RDFAST[t]||"Placaje",pw:45,t:RDFAST[t]?t:"normal",cl:sp?2:1};m.cm=dm.filter(mv=>mv!==m.fm).reverse().slice(0,2).map(mv=>({mv:mv,cost:(mv.pw|0)>=110?100:(mv.pw|0)>=80?50:34}));
  if(!m.cm.length&&dm.length)m.cm=[{mv:dm[dm.length-1],cost:50}];m.en=0;
  m.fcd=Math.round(480+(m.fm.pw|0)*6);m.fen=Math.round(7+(m.fm.pw|0)/10)}
function rdBase(m,mv,foe){const e=mv.typeless?1:effP(mv.t,foe),st=stabP(mv.t,m.p)?1.5:1;
  return {d:m.ma*(mv.cl===2?(m.nsa||1)*bsSR(m.p):(m.na||1))*bsDF(foe,mv.cl!==2)*(mv.pw||40)/45*e*st*(m.it==="lorb"?1.3:1),e:e}}
const rdFastDmg=(m,foe)=>{const b=rdBase(m,m.fm,foe);return {d:b.d*.7,e:b.e}},rdChDmg=(m,c,foe)=>{const b=rdBase(m,c.mv,foe);return {d:b.d*(c.cost>=100?3.4:c.cost>=50?2.3:1.6),e:b.e}};
// daño por segundo de un equipo (para calcular los PS del jefe)
function rdPow(team,foe){if(!team.length)return 0;const v=team.map(m=>{const f=rdFastDmg(m,foe).d*.925,fd=f/(m.fcd/1000),er=m.fen/(m.fcd/1000);
    const c=m.cm.length?Math.max(...m.cm.map(c=>rdChDmg(m,c,foe).d*.925*er/c.cost)):0;return fd+c}).sort((a,b)=>b-a);
  return v.slice(0,3).reduce((a,b)=>a+b,0)/Math.min(3,v.length)}
function rdBossHP(d){const pl=d.pl||{},b=PM[d.boss],L=b&&b[2]==="L";let sum=0;Object.values(pl).forEach(x=>{sum+=x.pw>0?x.pw:(RD_HP/90)});
  const n=Math.max(1,Object.keys(pl).length);return Math.max(4000,Math.round(sum*(L?108:92)*(1-.07*(n-1))))}
// movimientos del jefe
function rdBossMoves(b){let ids=[];try{ids=defMoves(b[0],100)}catch(e){}const L=ids.map(MVI).filter(mv=>mv&&mv.cl>0&&(mv.pw|0)>0).sort((a,c)=>(a.pw|0)-(c.pw|0));
  return {f:L[0]||RDTAP,c:L.length>1?L.slice(-2):[L[0]||{n:"Hiperrayo",pw:150,t:"normal",cl:2}]}}
function rdFightUI(){
  const d=RD.d,b=PM[d.boss],now=Date.now();RD.bm=rdBossMoves(b);RD.bNext=(d.go||now)+2200;RD.bAtk=null;RD.lastDodge=0;RD.busyUntil=0;RD.swUntil=0;RD.rejoinAt=0;RD.cAnim=null;RD.nBoss=0;
  const env=b?(TC[tys(b)[0]]||"#4a6ae0"):"#4a6ae0";
  $("mgB").innerHTML='<div class="rdgo" id="rdGo" style="--rc:'+env+'"><div class="rdgtop"><div class="rdhpw"><b>'+esc(d.boss)+' <small class="rdcp">PC '+fmt(Math.round((d.mx|0)/3))+'</small></b><div class="rdhp"><i id="rdHp"></i></div><small id="rdHpT"></small></div></div>'+
    '<div class="rdgboss" id="rdBoss">'+icoHD(b,220,false,false)+'</div><div class="rdwarn" id="rdWarn"></div>'+
    '<div class="rdgme" id="rdMeS"></div><div class="rdhint" id="rdHint">👆 Toca para atacar · ↔ Desliza para esquivar</div>'+
    '<div class="rdgbar"><div class="rdme" id="rdMe"></div><div class="rdparty" id="rdParty"></div></div>'+
    '<div class="rdmv" id="rdMv"></div><div class="rddg"><button class="alt" data-rddg="-1">⬅️ Esquivar</button><button class="alt" data-rddg="1">Esquivar ➡️</button></div></div>'+
    '<div class="rdrk" id="rdRk"></div><p class="rdmsg" id="rdMsg">¡El jefe ruge con fuerza!</p>';
  rdMeUI();mgI(rdLoop,60);
}
function rdMeUI(){const m=RD.team[RD.ai],box=$("rdMe");if(!box)return;const now=Date.now();
  const party=$("rdParty");if(party)party.innerHTML=RD.team.map((t,i)=>'<span class="'+(i===RD.ai?'on':'')+(t.mh<=0?' ko':'')+'">'+ico(t.p,30,false,!!t.sh)+'<i style="width:'+(t.mh/t.mx*100)+'%"></i></span>').join("");
  const ms=$("rdMeS");
  if(RD.out){box.innerHTML='<b>Todo tu equipo se ha debilitado.</b>';if(ms)ms.innerHTML="";
    $("rdMv").innerHTML=RD.rejoinAt?'<button class="mvb" disabled><span>⏳ Volviendo a entrar… '+Math.max(0,Math.ceil((RD.rejoinAt-now)/1000))+' s</span></button>':'<button class="red big" data-rdrj="1">🔄 Volver a entrar (pierdes 10 s)</button>';return}
  if(!m)return;
  if(ms&&ms.dataset.n!==m.p[0]+RD.ai){ms.dataset.n=m.p[0]+RD.ai;ms.innerHTML=icoHD(m.p,150,true,!!m.sh)}
  const k=m.mh/m.mx;box.innerHTML='<div><b>'+esc(nk(m.p[0]))+' <small>Nv'+m.l+'</small></b><div class="rdhp sm"><i style="width:'+(k*100)+'%;background:'+(k>.5?"#3ecf8e":k>.2?"#ffd35c":"#e63950")+'"></i></div><small>PS '+m.mh+'/'+m.mx+' · ⚡ '+esc(m.fm.n)+'</small></div>';
  const foe=PM[RD.d.boss];
  $("rdMv").innerHTML=m.cm.map((c,i)=>{const bars=c.cost>=100?1:c.cost>=50?2:3,seg=c.cost,full=Math.floor(m.en/seg),ok=m.en>=seg;
    return '<button class="mvb rdcm'+(ok?' ok':'')+'" data-rdc="'+i+'" style="--tc:'+(TC[c.mv.t]||"#999")+'"'+(ok?'':' disabled')+'><span>'+esc(c.mv.n)+'</span><small>'+EM[c.mv.t]+' '+TIPO[c.mv.t]+effTag(c.mv,{p:foe})+'</small><span class="rden">'+Array.from({length:bars},(_,j)=>'<i style="--f:'+(Math.max(0,Math.min(1,(m.en-j*seg)/seg))*100)+'%"></i>').join("")+'</span></button>'}).join("")||'<small class="mut">Este Pokémon no tiene ataques cargados.</small>'}
function rdFloat(txt,col,big){const bs=$("rdBoss");if(!bs)return;const r=bs.getBoundingClientRect();mgPop(r.left+r.width/2+Math.random()*90-45,r.top+r.height/3,txt,col);if(big)bs.classList.add("rdhitb"),setTimeout(()=>bs.classList.remove("rdhitb"),260)}
// ataque rápido: tocar
function rdTap(){if(RD.phase!=="fight"||RD.out||!RD.d)return;const now=Date.now(),m=RD.team[RD.ai];if(!m||m.mh<=0||now<(RD.d.go||0)||now<RD.busyUntil||now<RD.swUntil||RD.cAnim)return;
  const foe=PM[RD.d.boss],r=rdFastDmg(m,foe),cr=Math.random()<(m.it==="scope"?.12:.06),dmg=Math.max(1,Math.round(r.d*(.85+Math.random()*.15)*(cr?1.5:1)));
  RD.acc+=dmg;RD.busyUntil=now+m.fcd;m.en=Math.min(100,m.en+m.fen);snd("hit",r.e);
  const ms=$("rdMeS");if(ms&&!hubCalm())ms.animate([{transform:"none"},{transform:"translate(18px,-14px)"},{transform:"none"}],{duration:Math.min(300,m.fcd-60)});
  rdFloat((cr?"¡Crítico! ":"")+fmt(dmg),r.e>1?"#ffd35c":r.e<1?"#9aa":"#fff");
  if(!RD.flushT)RD.flushT=setTimeout(rdFlush,900);rdMeUI()}
// ataque cargado
function rdCharged(i){if(RD.phase!=="fight"||RD.out||RD.cAnim)return;const now=Date.now(),m=RD.team[RD.ai];if(!m||m.mh<=0||now<RD.swUntil)return;const c=m.cm[i];if(!c||m.en<c.cost)return;
  m.en-=c.cost;RD.cAnim={t:now+900,i:i};snd("ui");$("rdMsg").textContent="¡"+nk(m.p[0])+" usa "+c.mv.n+"!";
  const g=$("rdGo");if(g){g.classList.add("rdcharge");g.style.setProperty("--cc",TC[c.mv.t]||"#fff")}
  setTimeout(()=>{if(RD.phase!=="fight"){RD.cAnim=null;return}const foe=PM[RD.d.boss],r=rdChDmg(m,c,foe),cr=Math.random()<.06,dmg=Math.max(1,Math.round(r.d*(.85+Math.random()*.15)*(cr?1.5:1)));
    RD.acc+=dmg;RD.cAnim=null;RD.busyUntil=Date.now()+350;snd("hit",Math.max(1.5,r.e));if(g)g.classList.remove("rdcharge");
    rdFloat((cr?"¡Crítico! ":"")+fmt(dmg),r.e>1?"#ffd35c":r.e<1?"#9aa":"#fff",1);
    $("rdMsg").textContent=c.mv.n+(r.e>1?": ¡es súper eficaz!":r.e<1?": no es muy eficaz…":"")+" (−"+fmt(dmg)+")";
    if(!RD.flushT)RD.flushT=setTimeout(rdFlush,900);rdMeUI()},900);rdMeUI()}
// esquivar: deslizar, flechas o botones
function rdDodge(dir){if(RD.phase!=="fight"||RD.out)return;const now=Date.now();if(now-RD.lastDodge<550||RD.cAnim)return;RD.lastDodge=now;RD.busyUntil=Math.max(RD.busyUntil,now+450);
  const ms=$("rdMeS");if(ms&&!hubCalm())ms.animate([{transform:"none"},{transform:"translateX("+(dir*70)+"px) rotate("+(dir*8)+"deg)"},{transform:"none"}],{duration:450,easing:"ease-out"})}
// el jefe: avisa (brilla) y ataca
function rdLoop(){if(RD.phase!=="fight"||!RD.d)return;const now=Date.now(),m=RD.team[RD.ai];
  if(RD.out){if(RD.rejoinAt&&now>=RD.rejoinAt){RD.team.forEach(t=>{t.mh=t.mx;t.en=0});RD.ai=0;RD.out=false;RD.rejoinAt=0;RD.swUntil=now+800;RD.bNext=now+2000;RD.bAtk=null;$("rdMsg").textContent="¡Has vuelto a la incursión!";rdMeUI()}else if(RD.rejoinAt)rdMeUI();return}
  if(now<(RD.d.go||0))return;
  if(!RD.bAtk&&now>=RD.bNext){RD.nBoss++;const ch=RD.nBoss>3&&Math.random()<.3,mv=ch?RD.bm.c[Math.floor(Math.random()*RD.bm.c.length)]:RD.bm.f,warn=ch?1150:650;
    RD.bAtk={mv:mv,ch:ch,land:now+warn,warn:warn};const w=$("rdWarn"),bs=$("rdBoss");if(bs)bs.classList.add(ch?"rdtell2":"rdtell");
    if(w){w.className="rdwarn on"+(ch?" big":"");w.textContent=ch?"⚠️ "+mv.n+"":"⚠️"}}
  const a=RD.bAtk;if(a&&now>=a.land){RD.bAtk=null;const w=$("rdWarn"),bs=$("rdBoss");if(w)w.className="rdwarn";if(bs){bs.classList.remove("rdtell","rdtell2");if(!hubCalm())bs.animate([{transform:"none"},{transform:"scale(1.1) translateY(14px)"},{transform:"none"}],{duration:280})}
    RD.bNext=now+(a.ch?2400:1500+Math.random()*1100);
    if(m&&m.mh>0&&now>=RD.swUntil){const dodged=RD.lastDodge&&RD.lastDodge>=a.land-a.warn&&RD.lastDodge<=a.land,foe=PM[RD.d.boss],e=a.mv.typeless?1:effP(a.mv.t,m.p),L=foe&&foe[2]==="L"?1.2:1,
        df=Math.min(1.35,Math.max(.6,bsDF(m.p,a.mv.cl!==2)/.9)),fr=a.ch?.34+Math.random()*.1:.075+Math.random()*.035,dmg=Math.max(1,Math.round(m.mx*fr*e*df*L*(dodged?.25:1)));
      m.mh=Math.max(0,m.mh-dmg);m.en=Math.min(100,m.en+Math.round(dmg/m.mx*60));snd("hit",e);
      const me=$("rdMeS");if(me&&!hubCalm())me.animate([{transform:"translateX(-8px)",filter:"brightness(2)"},{transform:"translateX(8px)"},{transform:"none",filter:"none"}],{duration:260});
      $("rdMsg").textContent=(dodged?"💨 ¡Esquivado! ":"")+RD.d.boss+" usa "+a.mv.n+(e>1?". ¡Es súper eficaz!":".")+" "+nk(m.p[0])+" pierde "+dmg+" PS.";
      if(m.mh<=0){snd("faint");const nx=RD.team.findIndex(t=>t.mh>0);if(nx<0){RD.out=true;$("rdMsg").textContent="¡Todo tu equipo se ha debilitado! Vuelve a entrar para seguir luchando.";}else{RD.ai=nx;RD.swUntil=now+1300;RD.busyUntil=now+1300;$("rdMsg").textContent=nk(m.p[0])+" se ha debilitado. ¡Adelante, "+nk(RD.team[nx].p[0])+"!"}}
      rdMeUI()}}}
function rdAttack(k){rdTap()}
function rdFlush(){clearTimeout(RD.flushT);RD.flushT=0;const a=RD.acc;if(!a||!RD.id||!window.FB)return;RD.acc=0;window.FB.raidHit(RD.id,RD.me,a).catch(()=>{RD.acc+=a})}
function rdBossHit(){}
async function rdWin(){
  if(RD.phase!=="fight")return;RD.phase="catch";mgStop();const d=RD.d,b=PM[d.boss],pl=d.pl||{},ids=Object.keys(pl).sort((a,c)=>(pl[c].dmg|0)-(pl[a].dmg|0)),rank=ids.indexOf(RD.me);
  const st=mgState(),prize=raidLeft()>0;if(prize){st.n.raid=(st.n.raid|0)+1}
  let rw=null;if(prize){rw={t:650000+(rank===0?250000:0),it:{ub:3}};if(Math.random()<.4)rw.it.cand=1;if(Math.random()<.3){const k=HOLD[Math.floor(Math.random()*HOLD.length)][0];rw.it[k]=1}grant(rw)}
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
document.addEventListener("click",e=>{if(!e.target.closest)return;const c=e.target.closest("#mgB [data-rdc]");if(c){rdCharged(+c.dataset.rdc);return}const d=e.target.closest("#mgB [data-rddg]");if(d){rdDodge(+d.dataset.rddg);return}
  if(e.target.closest("#mgB [data-rdrj]")){RD.rejoinAt=Date.now()+10000;snd("ui");rdMeUI()}});
// tocar el campo = ataque rápido; deslizar = esquivar
{let sx=null,sy=0,st=0;document.addEventListener("pointerdown",e=>{if(RD.phase!=="fight"||!e.target.closest||!e.target.closest("#rdGo")||e.target.closest("button"))return;sx=e.clientX;sy=e.clientY;st=Date.now()});
  document.addEventListener("pointerup",e=>{if(sx==null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))rdDodge(dx>0?1:-1);else if(Date.now()-st<600)rdTap()})}
document.addEventListener("keydown",e=>{if(RD.phase!=="fight")return;const k=e.key;if(k===" "||k==="Enter"){e.preventDefault();rdTap()}else if(k==="ArrowLeft"||k==="a"||k==="A")rdDodge(-1);else if(k==="ArrowRight"||k==="d"||k==="D")rdDodge(1);else if(k==="1"||k==="2"){rdCharged(+k-1)}});
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
setInterval(()=>{try{if(nxOpen("raidP")&&!document.hidden)raidUI(false)}catch(e){}},15000);
// el chat se puede abrir encima de la incursión para invitar a más gente
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-rdchat]");if(!b||typeof chToggle!=="function")return;snd("ui");
  chToggle(true);if(b.dataset.rdchat==="inv"&&typeof CH!=="undefined"){CH.inv=true;CH.emo=CH.pick=false;try{chPanels()}catch(x){}}});
