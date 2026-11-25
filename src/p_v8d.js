// =====================================================================================
// VERSIÓN 8.0 (4/4): Torneos de amigos (eliminatorias) y Modo espectador
// =====================================================================================
// ================= TORNEOS DE AMIGOS =================
// Torneos por eliminatorias de 4, 8 o 16 entrenadores. Se entra con un código. Cada ronda dura 24 horas y cada combate
// es contra el equipo que el rival guardó al apuntarse (no hace falta estar conectados a la vez). Los dos de cada cruce
// juegan su combate; gana quien saque más puntos (victoria + vida que te quede). Si uno no juega a tiempo, pasa el otro.
// Firestore: ftours/{código} y ftours/{código}/s/{ronda_uid} (cada uno solo escribe su puntuación, una vez).
const FT_RD=24*36e5;
const ftCode=()=>{const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let s="";for(let i=0;i<6;i++)s+=A[Math.floor(Math.random()*A.length)];return s};
const ftTeamEnc=()=>JSON.stringify(pvTeamData().map(x=>({n:x.n,l:x.l,m:x.m,sh:x.sh,nt:x.nt,it:x.it,ab:x.ab})));
function ftTeamDec(s){try{const t=JSON.parse(s);return pvOkTeam(t)?t:null}catch(e){return null}}
// cuadro: orden sembrado por la semilla; se rellena hasta una potencia de 2 con huecos (pase directo)
function ftBracket(T,sc){const mem=(T.mem||[]).slice(),r=v8Rng("ft|"+T.id+"|"+(T.seed|0));for(let i=mem.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[mem[i],mem[j]]=[mem[j],mem[i]]}
  let size=2;while(size<mem.length)size*=2;const slots=[];for(let i=0;i<size;i++)slots.push(mem[i]||null);
  const rounds=[],now=Date.now();let cur=slots,rn=0;
  while(cur.length>1){const M=[];for(let i=0;i<cur.length;i+=2){const a=cur[i],b=cur[i+1],end=(T.start||0)+(rn+1)*FT_RD,sa=a&&sc[rn+"_"+a],sb=b&&sc[rn+"_"+b];let w=null,why="";
      if(a===undefined||b===undefined){w=null}
      else if(!a&&!b)w=null;
      else if(!a||!b){w=a||b;why="bye"}
      else if(a==="?"||b==="?")w="?";
      else if(sa&&sb){w=sb.sc>sa.sc?b:a;why="sc"}
      else if(now>=end){w=sa?a:sb?b:a;why=sa||sb?"plazo":"nadie"}
      else w="?";
      M.push({a,b,sa,sb,w,why,end,rn})}
    rounds.push(M);cur=M.map(m=>m.w==="?"?"?":m.w);rn++}
  const champ=cur[0]&&cur[0]!=="?"?cur[0]:null;return{rounds,champ,size}}
let FTV={id:null,T:null,sc:{},at:0};
v8Tab("onl","ftP","Torneos de amigos","🏟️ Torneos de amigos","Crea un torneo por eliminatorias de 4, 8 o 16 entrenadores e invita a tus amigos o a tu gremio con un código. ¡El campeón se lleva un trofeo!",()=>ftUI());
async function ftUI(){const b=$("ftPB");if(!b)return;if(!(window.FB&&window.FB.ftMine&&v8Uid())){b.innerHTML='<p class="mut">Los torneos de amigos necesitan una cuenta iniciada.</p>';return}
  if(FTV.id)return ftView(FTV.id);
  b.innerHTML='<div class="ftnew"><div><b>🏆 Crear un torneo</b><input id="ftN" maxlength="30" placeholder="Nombre del torneo" value="'+esc(NX.ftN||("Torneo de "+v8Nick()))+'"><div class="ftsz">'+[4,8,16].map(n=>'<button class="'+((NX.ftS||8)===n?'on':'')+'" data-ftsz="'+n+'">'+n+' entrenadores</button>').join("")+'</div><button class="red" id="ftMk">Crear torneo</button></div>'+
    '<div><b>🔑 Entrar con un código</b><input id="ftC" maxlength="6" placeholder="Ej.: K7P2QX" style="text-transform:uppercase"><button class="alt" id="ftJ">Entrar</button><small class="mut">Al apuntarte se guarda tu equipo actual: es el que usarán tus rivales.</small></div></div><h3 class="shh">Tus torneos</h3><div id="ftMine"><small class="mut">Cargando…</small></div>';
  const n=$("ftN");n.oninput=()=>{NX.ftN=n.value};
  $("ftMk").onclick=async()=>{const nm=pvClean(n.value||"Torneo").slice(0,30);if(!pvTeamData().length){toast("Necesitas un equipo para apuntarte.");return}const id=ftCode();
    try{await window.FB.ftCreate(id,{t:nm,size:NX.ftS||8,st:"open",mem:[v8Uid()],names:{[v8Uid()]:v8Nick().slice(0,30)},teams:{[v8Uid()]:ftTeamEnc()},seed:0});snd("lvl");FTV={id,T:null,sc:{},at:0};ftUI()}catch(e){toast("No se ha podido crear el torneo.")}};
  $("ftJ").onclick=async()=>{const id=String($("ftC").value||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(id.length!==6){toast("El código tiene 6 letras o números.");return}let T=null;try{T=await window.FB.ftGet(id)}catch(e){}
    if(!T){toast("No existe ningún torneo con ese código.");return}if((T.mem||[]).includes(v8Uid())){FTV={id,T:null,sc:{},at:0};ftUI();return}
    if(T.st!=="open"){toast("Ese torneo ya ha empezado.");return}if((T.mem||[]).length>=T.size){toast("Ese torneo está completo.");return}if(!pvTeamData().length){toast("Necesitas un equipo para apuntarte.");return}
    try{await window.FB.ftJoin(id,v8Nick().slice(0,30),ftTeamEnc());snd("lvl");toast("🏟️ ¡Te has apuntado a «"+T.t+"»!");FTV={id,T:null,sc:{},at:0};ftUI()}catch(e){toast("No se ha podido entrar.")}};
  let L=[];try{L=await window.FB.ftMine()}catch(e){}L.sort((a,c)=>(c.start||0)-(a.start||0));const box=$("ftMine");if(!box)return;
  box.innerHTML=L.length?'<div class="ftlist">'+L.map(T=>'<button data-ftv="'+esc(T.id)+'"><b>'+esc(T.t||"Torneo")+'</b><small>'+(T.st==="open"?"⏳ Esperando jugadores · "+(T.mem||[]).length+"/"+T.size:"⚔️ En juego")+' · código '+esc(T.id)+'</small></button>').join("")+'</div>':'<p class="mut">Aún no estás en ningún torneo. ¡Crea uno e invita a tus amigos!</p>'}
async function ftView(id){const b=$("ftPB");if(!b)return;let T=null,sc={};try{[T,sc]=await Promise.all([window.FB.ftGet(id),window.FB.ftScores(id)])}catch(e){}
  if(!T){FTV.id=null;b.innerHTML='<p class="mut">Ese torneo ya no existe.</p><button class="alt" data-ftback="1">← Volver</button>';return}FTV={id,T,sc,at:Date.now()};
  const me=v8Uid(),host=T.host===me,nm=u=>u?esc(pvClean((T.names||{})[u]||"Entrenador")):"<i>—</i>";
  let h='<button class="alt" data-ftback="1">← Mis torneos</button><div class="fthd"><span>🏟️</span><div><b>'+esc(T.t||"Torneo")+'</b><small>Código: <b>'+esc(T.id)+'</b> · '+(T.mem||[]).length+'/'+T.size+' entrenadores</small></div><button class="alt" data-ftcopy="1">📋 Copiar invitación</button></div>';
  if(T.st==="open"){h+='<div class="ftmem">'+(T.mem||[]).map(u=>'<span>'+nm(u)+(u===T.host?' 👑':'')+'</span>').join("")+'</div>'+
      (host?'<p class="mut">Cuando estéis todos, empieza el torneo. Cada ronda dura 24 horas.</p><div class="mgbtns"><button class="red" data-ftgo="1"'+((T.mem||[]).length<2?' disabled':'')+'>▶ Empezar el torneo</button><button class="alt" data-ftdel="1">🗑️ Cancelar torneo</button></div>':'<p class="mut">Esperando a que el organizador empiece el torneo…</p>');b.innerHTML=h;return}
  const Bk=ftBracket(T,sc);
  if(Bk.champ){h+='<div class="ftchamp">🏆 <b>¡'+nm(Bk.champ)+' es el campeón del torneo!</b></div>';ftChampCheck(T,Bk)}
  // mi combate pendiente
  let mine=null;Bk.rounds.forEach(R=>R.forEach(m=>{if(!mine&&m.w==="?"&&(m.a===me||m.b===me)&&m.a&&m.b&&m.a!=="?"&&m.b!=="?"&&!sc[m.rn+"_"+me])mine=m}));
  if(mine){const op=mine.a===me?mine.b:mine.a;h+='<div class="ftmine"><b>⚔️ Tu combate de la ronda '+(mine.rn+1)+': contra '+nm(op)+'</b><small>Tienes hasta el '+new Date(mine.end).toLocaleString("es-ES",{weekday:"long",hour:"2-digit",minute:"2-digit"})+'. Solo hay un intento.</small><button class="red" data-ftplay="'+mine.rn+'">⚔️ Jugar mi combate</button></div>'}
  const rName=(i,n)=>i===n-1?"Final":i===n-2?"Semifinales":i===n-3?"Cuartos":"Ronda "+(i+1);
  h+='<div class="ftbr">'+Bk.rounds.map((R,i)=>'<div class="ftcol"><b class="ftrn">'+rName(i,Bk.rounds.length)+'</b>'+R.map(m=>{const cell=(u,s)=>'<div class="ftp'+(m.w&&m.w!=="?"&&u===m.w?' win':'')+(u===me?' me':'')+'">'+(u==="?"?'<i>¿?</i>':nm(u))+'<em>'+(s?s.sc:m.why==="bye"&&u?'pasa':'')+'</em></div>';
      return '<div class="ftm">'+cell(m.a,m.sa)+cell(m.b,m.sb)+'</div>'}).join("")+'</div>').join("")+'</div>';
  b.innerHTML=h}
function ftChampCheck(T,Bk){const me=v8Uid();S.ftDone=S.ftDone||{};if(S.ftDone[T.id])return;S.ftDone[T.id]=1;
  if(Bk.champ===me){S.ftw=(S.ftw|0)+1;const rw={t:v8Tk(4,3e6),it:{mb:1,cand:3}};grant(rw);snd("win");diaryAdd("🏟️","¡Has ganado el torneo de amigos «"+(T.t||"Torneo")+"»!",null,0,"cb");
    nxModal('<div class="hofb">🏆</div><h3>¡Campeón del torneo!</h3><p>Has ganado «'+esc(T.t||"Torneo")+'».</p><p>Premio: <b>'+rwTxt(rw)+'</b> y el título «🏟️ Campeón entre amigos».</p><button id="ftOk">¡Genial!</button>');$("ftOk").onclick=nxModalClose}
  save()}
TITLES.push(["ftw","🏟️ Campeón entre amigos",()=>(S.ftw|0)>=1]);
document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("#ftPB [data-ftsz],#ftPB [data-ftv],#ftPB [data-ftback],#ftPB [data-ftgo],#ftPB [data-ftdel],#ftPB [data-ftcopy],#ftPB [data-ftplay]");if(!t)return;snd("ui");
  if(t.dataset.ftsz){NX.ftS=+t.dataset.ftsz;ftUI();return}
  if(t.dataset.ftv){FTV={id:t.dataset.ftv,T:null,sc:{},at:0};ftUI();return}
  if(t.dataset.ftback){FTV={id:null,T:null,sc:{},at:0};ftUI();return}
  const T=FTV.T;if(!T)return;
  if(t.dataset.ftcopy){v8Copy("🏟️ ¡Te invito a mi torneo «"+(T.t||"Torneo")+"» en Poke Gacha Online! Entra en Online → Torneos de amigos y usa el código "+T.id+"\nhttps://pokegachaonline.es");return}
  if(t.dataset.ftgo){try{await window.FB.ftStart(T.id,Math.floor(Math.random()*1e9));toast("🏟️ ¡Empieza el torneo!");ftView(T.id)}catch(x){toast("No se ha podido empezar.")}return}
  if(t.dataset.ftdel){if(!(await askOk("¿Cancelar el torneo? Se borrará para todos.")))return;try{await window.FB.ftDel(T.id);FTV={id:null,T:null,sc:{},at:0};ftUI()}catch(x){toast("No se ha podido cancelar.")}return}
  if(t.dataset.ftplay!=null)ftPlay(+t.dataset.ftplay)});
function ftPlay(rn){const T=FTV.T,me=v8Uid();if(!T)return;const Bk=ftBracket(T,FTV.sc);const m=(Bk.rounds[rn]||[]).find(x=>x.a===me||x.b===me);if(!m||FTV.sc[rn+"_"+me])return;
  const op=m.a===me?m.b:m.a,team=ftTeamDec((T.teams||{})[op]);if(!team){toast("El equipo del rival no es válido.");return}if(fcd){toast("Termina lo que estás haciendo primero.");return}
  const names=(S.team||[]).filter(n=>n&&S.owned[n]);if(!names.length){toast("Necesitas un equipo.");return}names.forEach(n=>{delete S.hp[n]});
  const onm=pvClean((T.names||{})[op]||"Rival");hubClose();
  startBattle({eteam:pvMk(team),trainer:onm,tsrc:{k:"acetrainer",n:onm},v8:{done:async res=>{let sc=0;try{const E=B&&B.E;const mine=E?E.sd[0].t:[],theirs=E?E.sd[1].t:[];
      sc=res==="win"?500+Math.round(mine.filter(x=>x.mh>0).length/Math.max(1,mine.length)*400)+Math.min(99,Math.round(mine.reduce((a,x)=>a+Math.max(0,x.mh)/Math.max(1,x.mx),0)/Math.max(1,mine.length)*99)):theirs.filter(x=>x.mh<=0).length*20}catch(x){sc=res==="win"?500:0}
    names.forEach(n=>{delete S.hp[n]});save();
    try{await window.FB.ftScore(T.id,rn,sc);await say("🏟️ Tu puntuación en el torneo: "+sc+". "+(res==="win"?"¡Buen combate!":"¡Mala suerte!")+" Mira el cuadro en Online → Torneos de amigos.")}catch(x){await say("No se ha podido guardar tu resultado del torneo.")}
    FTV.at=0}}})}
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{if(FTV.T&&FTV.T.st==="run"){const Bk=ftBracket(FTV.T,FTV.sc),me=v8Uid();if(Bk.rounds.some(R=>R.some(m=>m.w==="?"&&(m.a===me||m.b===me)&&m.a!=="?"&&m.b!=="?"&&!FTV.sc[m.rn+"_"+me])))o.onl=(o.onl|0)+1}}catch(e){}return o}}

// ================= MODO ESPECTADOR =================
// Ves en directo los duelos PVP de otros entrenadores: el combate se reproduce aquí con las mismas reglas (los duelos
// son deterministas: con la semilla y las elecciones de cada uno sale exactamente lo mismo) y puedes mandar reacciones,
// que también ven los dos jugadores. Firestore: duels/{sala}/p (solo lectura) y duels/{sala}/rx (reacciones).
const SPX_EM=["👏","🔥","😮","😂","❤️","💪"];
let SPX=null;
function spxDuels(){const L=pvOthers().filter(p=>p.presence.pvp.st==="duel"),out=[];
  L.forEach(p=>{const v=p.presence.pvp,ch=v.ch;if(!ch||typeof ch.room!=="string")return;const o=L.find(q=>q.presence.pvp.ok&&q.presence.pvp.ok.room===ch.room);if(!o)return;out.push({room:ch.room,seed:ch.seed|0,a:pvClean(v.n),b:pvClean(o.presence.pvp.n),ua:p.peer,ub:o.peer})});return out}
v8Tab("onl","spxP","Espectador","👀 Modo espectador","Mira en directo los duelos PVP de otros entrenadores y anímalos con reacciones que les salen en pantalla.",()=>spxUI());
function spxUI(){const b=$("spxPB");if(!b)return;if(SPX){spxDraw();return}
  if(typeof PR==="undefined"||!PR){b.innerHTML='<p class="mut">Para ver duelos necesitas una cuenta iniciada y entrar una vez en Online → PVP.</p>';return}
  const L=spxDuels();b.innerHTML=L.length?'<div class="spxl">'+L.map((d,i)=>'<div class="spxr"><b>'+esc(d.a)+'</b><span>⚔️</span><b>'+esc(d.b)+'</b><button class="red" data-spxw="'+i+'">👀 Ver</button></div>').join("")+'</div>':'<div class="merwait"><div class="merbig">👀</div><b>Ahora mismo no hay duelos en directo.</b><small class="mut">Vuelve en un rato o reta tú a alguien en Online → PVP.</small></div>';
  b._L=L}
function spxWatch(d){spxStop();SPX={d,A:null,Bv:null,E:null,log:[],rx:[],shown:{},over:null};SPX.un=window.FB.duelWatch(d.room,L=>{if(!SPX)return;if(!L){SPX.err=1;spxDraw();return}
    const A=L.find(x=>x.r==="A"),Bv=L.find(x=>x.r==="B");SPX.A=A;SPX.Bv=Bv;spxStep();spxDraw()});
  SPX.unrx=window.FB.duelRxWatch(d.room,L=>{if(!SPX)return;L.forEach(x=>{if(!SPX.shown[x.id]){SPX.shown[x.id]=1;if(Date.now()-x.at<15000)spxFloat(x.e,"#spxStage")}})});spxDraw()}
function spxStop(){if(SPX){try{SPX.un&&SPX.un()}catch(e){}try{SPX.unrx&&SPX.unrx()}catch(e){}}SPX=null}
const SPXK={use:e=>"¡"+e.n+" usa "+(MVI(e.mv)||{}).n+"!",miss:()=>"¡Pero ha fallado!",fail:()=>"¡Pero ha fallado!",faint:e=>"¡"+e.n+" se ha debilitado!",send:e=>"¡Sale "+e.n+"!",prot:e=>"¡"+e.n+" se protege!",heal:e=>"¡"+e.n+" recupera PS!",
  after:e=>(e.crit?"¡Golpe crítico! ":"")+(e.e>1?"¡Es súper eficaz!":e.e<1&&e.e>0?"No es muy eficaz…":e.e===0?"No le afecta…":""),noeff:()=>"No ha tenido efecto.",msg:e=>e.t||e.m||""};
function spxStep(){const X=SPX;if(!X||!X.A||!X.Bv)return;
  if(!X.E){if(!pvOkTeam(X.A.team)||!pvOkTeam(X.Bv.team))return;try{X.E=beNew([beSide(pvMk(X.A.team)),beSide(pvMk(X.Bv.team))],[[0],[1]],X.d.seed);X.E.pvp=1;X.E.free=X.A.md==="l"&&X.Bv.md==="l"?1:0;
    [X.A.team,X.Bv.team].forEach((tm,i)=>{X.E.sd[i].fo=tm.map(x=>Array.isArray(x.f)?x.f.filter(f=>typeof f==="string"&&PM[f]):[])});X.log.push("¡Empieza el duelo entre "+pvClean(X.A.n)+" y "+pvClean(X.Bv.n)+"!")}catch(e){return}}
  const E=X.E;let guard=0;
  while(E.over==null&&guard++<400){const swap=E.sd.some(s=>s.need),key=E.turn+":"+(swap?"swap":"act"),ra=swap?E.sd[0].need:true,rb=swap?E.sd[1].need:true;
    const a=ra?(X.A.h||{})[key]:"-",b=rb?(X.Bv.h||{})[key]:"-";if(a==null||b==null)break;
    let ev=[];try{ev=swap?beSwap(E,[a,b].map(x=>x==="-"?"":x)):beTurn(E,[a,b],rngS(pvHash(X.d.seed+":"+E.turn)))}catch(e){X.err=1;break}
    ev.forEach(e=>{const f=SPXK[e.k];if(f){const t=f(e);if(t)X.log.push((e.s===1&&e.k==="use"?"🔵 ":e.s===0&&e.k==="use"?"🔴 ":"")+t)}})}
  if(X.log.length>60)X.log.splice(0,X.log.length-60);
  if(E.over!=null&&X.over==null){X.over=E.over;X.log.push("🏆 ¡"+pvClean(E.over===0?X.A.n:X.Bv.n)+" gana el duelo!")}}
function spxDraw(){const b=$("spxPB"),X=SPX;if(!b||!X)return;
  const side=i=>{const E=X.E;if(!E)return'<div class="spxs"><small class="mut">Esperando…</small></div>';const sd=E.sd[i],m=beAct(sd),pct=Math.max(0,m.mh)/Math.max(1,m.mx)*100,nm=pvClean(i===0?X.A.n:X.Bv.n);
    return '<div class="spxs"><b>'+(i===0?"🔴 ":"🔵 ")+esc(nm)+'</b><div class="spxmon">'+icoHD(m.p,110,false,!!m.sh)+'</div><span>'+esc(m.p[0])+' · Nv'+m.l+'</span><div class="spxhp"><i style="width:'+pct+'%;background:'+(pct>50?"#3fbf6a":pct>20?"#f0b030":"#e8444a")+'"></i></div><small>'+sd.t.map(t=>t.mh>0?"⚪":"⚫").join("")+'</small></div>'};
  b.innerHTML='<button class="alt" id="spxBack">← Volver a la lista</button><div class="spxstage" id="spxStage"><div class="spxvs">'+side(0)+'<span class="spxv">VS</span>'+side(1)+'</div></div>'+
    '<div class="spxlog">'+(X.err?'<p class="mut">No se puede seguir este duelo.</p>':'')+X.log.slice(-6).map(t=>'<p>'+esc(t)+'</p>').join("")+'</div>'+
    '<div class="spxrx">'+SPX_EM.map(e=>'<button data-spxe="'+e+'">'+e+'</button>').join("")+'</div><small class="mut">Tus reacciones las ven los dos jugadores y los demás espectadores.</small>';
  $("spxBack").onclick=()=>{spxStop();spxUI()}}
let _spxLast=0;
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#spxPB [data-spxw],#spxPB [data-spxe]");if(!t)return;snd("ui");
  if(t.dataset.spxw!=null){const L=$("spxPB")._L||[],d=L[+t.dataset.spxw];if(d)spxWatch(d);return}
  if(t.dataset.spxe&&SPX){if(Date.now()-_spxLast<1500){toast("¡Un poco más despacio!");return}_spxLast=Date.now();spxFloat(t.dataset.spxe,"#spxStage");window.FB.duelRx(SPX.d.room,t.dataset.spxe,v8Nick().slice(0,30)).catch(()=>{})}});
// emoji que sube flotando
function spxFloat(em,sel){const host=document.querySelector(sel);if(!host)return;const s=document.createElement("span");s.className="spxfl";s.textContent=SPX_EM.includes(em)?em:"👏";s.style.left=(10+Math.random()*80)+"%";host.appendChild(s);setTimeout(()=>s.remove(),2200)}
// al cerrar el panel se deja de escuchar
setInterval(()=>{try{if(SPX&&!nxOpen("spxP"))spxStop();else if(!SPX&&nxOpen("spxP")){const b=$("spxPB");const L=spxDuels();if(b&&JSON.stringify(L.map(d=>d.room))!==JSON.stringify((b._L||[]).map(d=>d.room)))spxUI()}}catch(e){}},3000);
// los jugadores del duelo también ven las reacciones del público
{const _ps=pvStart;pvStart=async function(role,room,seed){const r=await _ps.apply(this,arguments);try{if(D&&D.room===room&&window.FB&&window.FB.duelRxWatch){const seen={};const t0=Date.now();
  D.unrx=window.FB.duelRxWatch(room,L=>{L.forEach(x=>{if(seen[x.id])return;seen[x.id]=1;if(x.at>=t0-2000&&Date.now()-x.at<15000){spxFloat(x.e,"#arena");if(!D||!D.rxn){if(D)D.rxn=1;toast("👀 ¡Hay público viendo tu duelo!")}}})})}}catch(e){}return r}}
{const _pe=pvEnd;pvEnd=function(){try{if(D&&D.unrx){D.unrx();D.unrx=null}}catch(e){}return _pe.apply(this,arguments)}}
// (8.0) móvil: la pestaña abierta siempre a la vista en la fila deslizable
{const _ho=hubOpen;hubOpen=function(){const r=_ho.apply(this,arguments);try{const T=$("hubTabs"),on=T&&T.querySelector("button.on");if(on&&T.scrollWidth>T.clientWidth){const x=on.offsetLeft-(T.clientWidth-on.offsetWidth)/2;T.scrollLeft=Math.max(0,x)}}catch(e){}return r}}
