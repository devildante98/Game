// =====================================================================================
// VERSIÓN 8.0 (3/4): Retos semanales con reglas, Búsqueda del tesoro semanal y Base secreta (3D)
// =====================================================================================
// ejecuta algo sobre la partida principal aunque estés dentro de la Exploración (que tiene su propia mochila)
function v8Main(fn){if(typeof XGSW!=="undefined"&&XGSW){xgOut();try{return fn()}finally{xgIn()}}return fn()}

// ================= RETOS SEMANALES CON REGLAS =================
// Cada semana una regla distinta. Eliges 3 Pokémon que la cumplan y te enfrentas a 10 entrenadores seguidos (tu equipo
// se cura entre combate y combate). Puntos: 100 por victoria + lo que les quede de vida al final. Clasificación propia.
const WCH_N=10,WCH_RUNS=3;
const WCH_TY=["water","fire","grass","electric","psychic","ghost","dragon","bug","rock","ice","fighting","fairy","dark","steel","ground","poison","flying","normal"];
function wchRule(w){const r=v8Rng("wch|"+w),k=Math.floor(r()*6);
  if(k<=1){const t=WCH_TY[Math.floor(r()*WCH_TY.length)];return{id:"t_"+t,n:"Solo tipo "+TIPO[t],ic:EM[t],d:"Tu equipo y los rivales solo pueden ser Pokémon de tipo "+TIPO[t]+".",ok:p=>tys(p).includes(t)}}
  if(k===2)return{id:"noleg",n:"Sin legendarios",ic:"🚫",d:"Nada de legendarios ni formas especiales: solo Pokémon de 1 a 3 estrellas.",ok:p=>!/[LM]/.test(p[2])};
  if(k===3)return{id:"low",n:"Comunes y raros",ic:"⭐",d:"Solo Pokémon de 1 y 2 estrellas. ¡Demuestra que no hace falta un legendario para ganar!",ok:p=>p[2]==="C"||p[2]==="R"};
  if(k===4){const g=1+Math.floor(r()*4);return{id:"g"+g,n:"Solo generación "+g,ic:"🕰️",d:"Solo Pokémon de la generación "+g+".",ok:p=>(p[3]|0)===g}}
  return{id:"lv50",n:"Nivel 50 como máximo",ic:"🎚️",d:"Tus Pokémon no pueden pasar del nivel 50 (y los rivales tampoco).",ok:(p,n)=>!n||lvd(n).l<=50,cap:50}}
const wchWeek=()=>tourWeek();
function wchSt(){const w=wchWeek();S.wch=S.wch&&S.wch.w===w?S.wch:{w,runs:0,best:0,cur:null,ms:{}};return S.wch}
const wchOkMon=(n,R)=>S.owned[n]>0&&PM[n]&&R.ok(PM[n],n)&&!busyMon(n);
v8Tab("ret","wchP","Reto semanal","📜 Reto semanal con reglas","Cada semana, una regla distinta. Elige 3 Pokémon que la cumplan y vence a 10 entrenadores seguidos. ¡Compite en la clasificación del reto!",()=>wchUI());
let WCHT={w:"",L:null,at:0};
function wchUI(){const b=$("wchPB");if(!b)return;const s=wchSt(),R=wchRule(s.w),c=s.cur;
  let h='<div class="wchrule"><span class="wchic">'+R.ic+'</span><div><small>Regla de esta semana</small><b>'+esc(R.n)+'</b><p>'+esc(R.d)+'</p></div><div class="wchend"><small>Termina en</small><b>'+H2(tourEndsIn()/1000)+'</b></div></div>'+
    '<div class="wchstats"><span>🏆 Tu mejor marca <b>'+fmt(s.best)+'</b></span><span>🔁 Intentos <b>'+s.runs+'/'+WCH_RUNS+'</b></span></div>'+
    '<div class="wchms">'+[[3,"1 h de producción + 3 Ultra Balls"],[6,"2 h de producción + 2 Caramelos Raros"],[10,"3 h de producción + 1 Master Ball + título"]].map(([k,t])=>'<span class="'+(s.ms[k]?'on':'')+'">'+(s.ms[k]?'✅':'🎯')+' <b>'+k+' victorias</b><small>'+t+'</small></span>').join("")+'</div>';
  if(c){h+='<div class="wchrun"><b>En marcha: '+c.wins+' / '+WCH_N+' victorias</b><div class="wchteam">'+c.team.map(n=>'<span>'+icoHD(PM[n],56,false,!!(S.shiny&&S.shiny[n]))+'<small>'+esc(nk(n))+'</small></span>').join("")+'</div><div class="mgbtns"><button class="red" id="wchGo">⚔️ Combate '+(c.wins+1)+'</button><button class="alt" id="wchQuit">Retirarse</button></div></div>'}
  else if(s.runs>=WCH_RUNS)h+='<p class="rates">Ya has usado tus '+WCH_RUNS+' intentos de esta semana. ¡Vuelve el lunes con una regla nueva!</p>';
  else{const L=Object.keys(S.owned||{}).filter(n=>wchOkMon(n,R)).sort((a,b)=>lvd(b).l-lvd(a).l),sel=(NX.wchSel||[]).filter(n=>L.includes(n));NX.wchSel=sel;
    h+='<h3 class="shh">Elige 3 Pokémon ('+sel.length+'/3)</h3>'+(L.length<3?'<p class="mut">Necesitas al menos 3 Pokémon que cumplan la regla. ¡Consigue más y vuelve!</p>':'<div class="conpick wchpick">'+L.slice(0,80).map(n=>'<button class="'+(sel.includes(n)?'on':'')+'" data-wchp="'+esc(n)+'"><span>'+icoHD(PM[n],56,false,!!(S.shiny&&S.shiny[n]))+'</span><b>'+esc(nk(n))+'</b><small>Nv'+lvd(n).l+'</small></button>').join("")+'</div><button class="red big" id="wchStart"'+(sel.length===3?'':' disabled')+'>▶ Empezar el reto (intento '+(s.runs+1)+'/'+WCH_RUNS+')</button>')}
  h+='<h3 class="shh">🏅 Clasificación del reto</h3><div id="wchTop" class="wchtop"><small class="mut">Cargando…</small></div>';
  b.innerHTML=h;
  const st=$("wchStart");if(st)st.onclick=()=>{const sel=NX.wchSel||[];if(sel.length!==3)return;s.runs++;s.cur={team:sel.slice(),wins:0};NX.wchSel=[];save();snd("lvl");wchUI()};
  const go=$("wchGo");if(go)go.onclick=wchFight;const q=$("wchQuit");if(q)q.onclick=async()=>{if(!(await askOk("¿Retirarte? Se guardará tu marca actual y este intento terminará.")))return;wchFinish();wchUI()};
  wchTop(s.w)}
async function wchTop(w){const box=$("wchTop");if(!box)return;if(!(window.FB&&window.FB.wchTop)){box.innerHTML='<small class="mut">La clasificación se ve con una cuenta iniciada.</small>';return}
  try{if(WCHT.w!==w||Date.now()-WCHT.at>60000){WCHT={w,L:await window.FB.wchTop(w),at:Date.now()}}}catch(e){box.innerHTML='<small class="mut">No se ha podido cargar.</small>';return}
  const me=v8Uid(),L=WCHT.L||[];box.innerHTML=L.length?'<ol>'+L.map((x,i)=>'<li class="'+(x.u===me?'me':'')+'"><span>'+(i<3?["🥇","🥈","🥉"][i]:(i+1)+".")+'</span><b class="plink" data-prof="'+esc(x.u)+'">'+esc(pvClean(x.n||"Entrenador"))+'</b><em>'+fmt(+x.sc||0)+'</em></li>').join("")+'</ol>':'<small class="mut">Nadie ha completado aún el reto de esta semana. ¡Sé el primero!</small>'}
function wchEnemies(s,R){const r=v8Rng("wche|"+s.w+"|"+s.runs+"|"+s.cur.wins),k=s.cur.wins,boss=k===WCH_N-1,avg=s.cur.team.reduce((a,n)=>a+lvd(n).l,0)/3;
  const pool=P.filter(p=>R.ok(p)&&v8Base(p)&&p[2]!=="L"),legs=P.filter(p=>R.ok(p)&&p[2]==="L"&&v8Base(p));
  const names=[];const n=boss?4:3;if(boss&&legs.length&&!/noleg|low/.test(R.id))names.push(v8Pick(r,legs)[0]);
  let g=0;while(names.length<n&&g++<200){const p=v8Pick(r,pool);if(p&&!names.includes(p[0]))names.push(p[0])}
  let lv=clampL(Math.max(5,avg-3)+Math.floor(k*.8)+(boss?3:0));if(R.cap)lv=Math.min(lv,R.cap);return{names,lv,r,boss}}
function wchFight(){const s=wchSt(),R=wchRule(s.w),c=s.cur;if(!c)return;if(fcd){toast("Termina lo que estás haciendo primero.");return}
  if(!c.team.every(n=>S.owned[n]>0)){toast("Alguno de tus Pokémon del reto ya no está en tu colección.");s.cur=null;save();wchUI();return}
  const E=wchEnemies(s,R),tr=TRAINERS[Math.floor(E.r()*TRAINERS.length)],nm=E.boss?"Campeón del reto":tr[0]+" del reto";
  c.team.forEach(n=>{delete S.hp[n]});const t0=S.team;S.team=c.team.slice();hubClose();
  try{startBattle({eteam:v8Team(E.names,E.lv,E.r),trainer:nm,tsrc:{k:E.boss?"acetrainer":tr[3],n:nm},v8:{done:async res=>{const s2=wchSt(),c2=s2.cur;if(!c2)return;
    if(res==="win"){c2.wins++;c2.hpb=Math.round(c2.team.filter(n=>S.hp[n]!==0).length/3*99);
      await say("📜 ¡Victoria "+c2.wins+" de "+WCH_N+" en el reto semanal!");wchMs(c2.wins);c2.team.forEach(n=>{delete S.hp[n]});
      if(c2.wins>=WCH_N){await say("🏆 ¡Has completado el reto de la semana!");wchFinish()}else await say("Tu equipo del reto se ha recuperado. ¡Sigue desde Retos → Reto semanal!")}
    else if(res!=="flee"){await say("📜 Tu intento en el reto termina con "+c2.wins+" victoria"+(c2.wins===1?"":"s")+".");wchFinish()}
    save()}}})}finally{S.team=t0}}
function wchMs(w){const s=wchSt();const M={3:{h:1,it:{ub:3}},6:{h:2,it:{cand:2}},10:{h:3,it:{mb:1}}};const m=M[w];if(!m||s.ms[w])return;s.ms[w]=1;const rw={t:v8Tk(m.h,500000*m.h),it:m.it};grant(rw);toast("📜 ¡"+w+" victorias en el reto! "+rwTxt(rw));
  if(w===10){S.wchT=(S.wchT|0)+1;diaryAdd("📜","¡Has completado el reto semanal «"+wchRule(s.w).n+"»!",null,0,"cb")}}
TITLES.push(["wch","📜 Maestro de retos",()=>(S.wchT|0)>=1]);
function wchFinish(){const s=wchSt(),c=s.cur;if(!c)return;const sc=c.wins*100+(c.wins?Math.max(0,Math.min(99,c.hpb|0)):0);s.best=Math.max(s.best,sc);s.cur=null;save();
  if(sc>0&&window.FB&&window.FB.wchSet&&v8Uid())window.FB.wchSet(s.w,{sc,n:v8Nick().slice(0,30),tr:trEnc(myLook()),at:Date.now()}).then(()=>{WCHT.at=0;if(nxOpen("wchP"))wchTop(s.w)}).catch(()=>{})}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#wchPB [data-wchp]");if(!t)return;const n=t.dataset.wchp,sel=NX.wchSel=NX.wchSel||[];const i=sel.indexOf(n);if(i>=0)sel.splice(i,1);else if(sel.length<3)sel.push(n);snd("ui");wchUI()});

// ================= BÚSQUEDA DEL TESORO SEMANAL =================
// Cada semana hay un tesoro escondido en el primer pueblo de la Exploración o sus alrededores (todos pueden llegar).
// Cada día se desbloquea una pista; desde el sábado el Zahorí también lo detecta y el domingo brilla en el suelo.
// Los primeros en encontrarlo entran en el cuadro de honor (Firestore: tesoro/{semana}/f/{uid}).
const TRE_MAPS=["pueblo","ruta","bosque","playa","cueva","cima"];
const TRE_PLACE={pueblo:"un pueblo tranquilo",ruta:"un camino con hierba alta",bosque:"un bosque frondoso",playa:"un lugar con arena y mar",cueva:"un sitio oscuro y rocoso",cima:"un lugar muy alto"};
function treSpot(w){const r=v8Rng("tre|"+w),maps=TRE_MAPS.filter(m=>EXM[m]);if(!maps.length)return null;
  for(let k=0;k<20;k++){const m=maps[Math.floor(r()*maps.length)],M=EXM[m],g=M.g,hid=typeof fdHidden==="function"?fdHidden(m):[];
    for(let t=0;t<300;t++){const x=1+Math.floor(r()*(g[0].length-2)),y=2+Math.floor(r()*(g.length-3)),c=g[y][x];if(!(c==="."||c===","||c==="c"||c==="s"))continue;if(hid.some(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<3))continue;
      return{m,x,y,W:g[0].length,H:g.length}}}
  return null}
function treNear(sp){const g=EXM[sp.m].g,cnt={};for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const c=(g[sp.y+dy]||"")[sp.x+dx];if(c)cnt[c]=(cnt[c]||0)+1}
  const L=[];if(cnt["~"])L.push("agua");if((cnt.T|0)+(cnt.t|0))L.push("árboles");if(cnt.H||cnt.h)L.push("una casa");if(cnt["="]||cnt[","])L.push("un camino");if(cnt.m||cnt["#"])L.push("rocas o un acantilado");return L.length?L.slice(0,2).join(" y "):"campo abierto"}
// pistas: lunes a domingo (0 a 6)
function treClues(w){const sp=treSpot(w);if(!sp)return[];const M=EXM[sp.m],ns=sp.y<sp.H/2?"norte":"sur",eo=sp.x<sp.W/2?"oeste":"este";
  return["El tesoro de esta semana está en "+TRE_PLACE[sp.m]+" de la primera región.","Cerca del tesoro hay "+treNear(sp)+".","El tesoro está en «"+M.n+"».","Busca en la mitad "+ns+" del mapa.","Está en la parte "+ns+(eo==="este"?"este":"oeste")+" de «"+M.n+"».",
    "Desde hoy, el Zahorí también reacciona al tesoro: úsalo en «"+M.n+"» y te dirá hacia dónde ir.","¡Hoy el tesoro brilla en el suelo! Mira bien por «"+M.n+"» y pulsa A sobre la casilla que reluce."]}
const treDay=()=>{const d=v8Mad().wd;return d<0?0:d};
const treSt=()=>{const w=tourWeek();S.tre=S.tre&&S.tre.w===w?S.tre:{w,f:0};return S.tre};
function treFind(sp){const s=treSt();if(s.f)return;s.f=Date.now();let rw={t:v8Tk(3,2e6),it:{cand:2,ub:5}};
  v8Main(()=>{grant(rw);S.treN=(S.treN|0)+1});save();snd("lvl");setTimeout(()=>snd("win"),400);
  try{exSay(["¡Has encontrado el tesoro de la semana!","Dentro hay: "+rwTxt(rw)+".","¡Mira el cuadro de honor en Retos → Tesoro semanal!"])}catch(e){toast("🗺️ ¡Tesoro encontrado! "+rwTxt(rw))}
  diaryAdd("🗺️","¡Has encontrado el tesoro semanal en «"+EXM[sp.m].n+"»!",null,0,"lg");
  if(window.FB&&window.FB.treFound&&v8Uid())window.FB.treFound(s.w,{n:v8Nick().slice(0,30),tr:trEnc(myLook())}).then(async()=>{TRET.at=0;const L=await window.FB.treList(s.w);const pos=L.findIndex(x=>x.u===v8Uid());
    if(pos>=0&&pos<3){v8Main(()=>{S.bag.mb=(S.bag.mb||0)+1});save();toast("🗺️ ¡Eres de los 3 primeros en encontrarlo! +1 Master Ball")}}).catch(()=>{})}
TITLES.push(["tre","🗺️ Cazatesoros",()=>(S.treN|0)>=1]);
// pulsar A sobre la casilla (o estando encima)
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&!EX.cut&&EX.M){const sp=treSpot(tourWeek());if(sp&&EX.map===sp.m&&!treSt().f){const[dx,dy]=EXDIR[EX.f];
  if((EX.x+dx===sp.x&&EX.y+dy===sp.y)||(EX.x===sp.x&&EX.y===sp.y)){treFind(sp);return}}}}catch(e){console.error(e)}return _i.apply(this,arguments)}}
// el Zahorí lo detecta desde el sábado
{const _z=fdScan;fdScan=function(){try{const sp=treSpot(tourWeek());if(sp&&treDay()>=5&&EX.map===sp.m&&!treSt().f){const dx=sp.x-EX.x,dy=sp.y-EX.y,d=Math.abs(dx)+Math.abs(dy);
  const dir=(dy<0?"norte":dy>0?"sur":"")+(dx&&dy?" y ":"")+(dx>0?"este":dx<0?"oeste":"");snd("lvl");exSay(["¡El Zahorí brilla en dorado!","El tesoro de la semana está a unos "+d+" pasos"+(dir?" hacia el "+dir:"")+"."]);return}}catch(e){}return _z.apply(this,arguments)}}
// el domingo reluce en el suelo
{const _d=exDraw;exDraw=function(ts){const r=_d.apply(this,arguments);try{if(EX.title||!EX.cv||!EX.cam||treDay()<6||treSt().f)return r;const sp=treSpot(tourWeek());if(!sp||EX.map!==sp.m)return r;
  const g=EX.cv.getContext("2d");g.setTransform(EXS,0,0,EXS,0,0);const cx=Math.round(EX.cam[0]*2)/2,cy=Math.round(EX.cam[1]*2)/2,x=sp.x*EXTL-cx+16,y=sp.y*EXTL-cy+16,t=performance.now()/300;
  g.save();g.globalAlpha=.55+Math.sin(t)*.35;g.fillStyle="#ffe14a";for(let i=0;i<4;i++){const a=t+i*Math.PI/2,rr=7+Math.sin(t*1.7+i)*2;g.beginPath();g.arc(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.6,2.2,0,7);g.fill()}g.globalAlpha=.35;g.beginPath();g.ellipse(x,y+4,9,4,0,0,7);g.fill();g.restore()}catch(e){}return r}}
let TRET={w:"",L:null,at:0};
v8Tab("ret","treP","Tesoro semanal","🗺️ Búsqueda del tesoro semanal","Cada semana hay un tesoro escondido en la Exploración. Cada día se desbloquea una pista nueva. ¡Los primeros en encontrarlo entran en el cuadro de honor!",()=>treUI());
function treUI(){const b=$("trePB");if(!b)return;const s=treSt(),L=treClues(s.w),d=treDay();
  b.innerHTML='<div class="treHd"><span class="trebig">'+(s.f?'💰':'🗺️')+'</span><div><b>'+(s.f?'¡Ya has encontrado el tesoro de esta semana!':'Tesoro de la semana')+'</b><small>'+(s.f?'Lo encontraste el '+new Date(s.f).toLocaleDateString("es-ES",{weekday:"long",day:"numeric"})+'. ¡Vuelve el lunes a por el siguiente!':'Entra en la Exploración y pulsa A sobre la casilla del tesoro. Se renueva cada lunes.')+'</small></div>'+(!s.f?'<button class="red" id="treEx">🧭 Ir a la Exploración</button>':'')+'</div>'+
    '<div class="trecl">'+L.map((c,i)=>'<div class="'+(i<=d?'on':'')+'"><span>'+["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"][i]+'</span><p>'+(i<=d?esc(c):'🔒 Se desbloquea el '+["lunes","martes","miércoles","jueves","viernes","sábado","domingo"][i])+'</p></div>').join("")+'</div>'+
    '<small class="mut">💬 Truco: ¡en Discord se adelanta cada día la pista del día siguiente!</small><h3 class="shh">🏅 Cuadro de honor</h3><div id="treTop" class="wchtop"><small class="mut">Cargando…</small></div>';
  const ex=$("treEx");if(ex)ex.onclick=()=>{try{hubOpen("adv","explP")}catch(e){}};
  treTop(s.w)}
async function treTop(w){const box=$("treTop");if(!box)return;if(!(window.FB&&window.FB.treList)){box.innerHTML='<small class="mut">El cuadro de honor se ve con una cuenta iniciada.</small>';return}
  try{if(TRET.w!==w||Date.now()-TRET.at>60000)TRET={w,L:await window.FB.treList(w),at:Date.now()}}catch(e){box.innerHTML='<small class="mut">No se ha podido cargar.</small>';return}
  const me=v8Uid(),L=TRET.L||[];box.innerHTML=L.length?'<ol>'+L.map((x,i)=>'<li class="'+(x.u===me?'me':'')+'"><span>'+(i<3?["🥇","🥈","🥉"][i]:(i+1)+".")+'</span><b class="plink" data-prof="'+esc(x.u)+'">'+esc(pvClean(x.n||"Entrenador"))+'</b><em>'+(x.at?new Date(x.at).toLocaleString("es-ES",{weekday:"short",hour:"2-digit",minute:"2-digit"}):"")+'</em></li>').join("")+'</ol>':'<small class="mut">Nadie lo ha encontrado todavía. ¡Puedes ser el primero!</small>'}

// ================= BASE SECRETA (3D) =================
// Tu habitación en 3D: compra muebles y peluches, coloca tus trofeos y elige el suelo y las paredes. Puedes publicarla
// para que tus amigos (y cualquier entrenador) la visiten y te dejen un «me gusta».
const BS_N=8;
const BS_WALL={cr:["Crema","#f3e6c8"],az:["Azul cielo","#bfe0ff"],ro:["Rosa","#ffd0e0"],ve:["Menta","#c8f0d8"],li:["Lila","#e0d0ff"],os:["Noche","#3a3f6a"]};
const BS_FLOOR={wd:["Madera","#c89a62","#b88a52"],ti:["Baldosas","#e8e8f0","#cfd2e0"],gr:["Césped","#7fcf5f","#72c052"],mo:["Moqueta roja","#c8505a","#b8444e"],ma:["Mármol","#f4f2ee","#dedad2"],ne:["Neón","#2a2f5a","#3a3f8a"]};
const BS_PLUSH=["Pikachu","Eevee","Snorlax","Jigglypuff","Clefairy","Psyduck","Bulbasaur","Charmander","Squirtle","Togepi","Gengar","Lapras","Mew","Dragonite","Ditto","Mimikyu"];
const BT3=(...a)=>G3M.trs(...a);
const BS_F={
  bed:{n:"Cama",ic:"🛏️",h:.3,mk:()=>G3B.merge([[G3B.box(.9,.3,.95,"#8a5a3a"),BT3([0,.15,0])],[G3B.box(.84,.12,.9,"#f4f4ff"),BT3([0,.36,0])],[G3B.box(.8,.1,.42,"#e2573b"),BT3([0,.43,.18])],[G3B.box(.5,.12,.22,"#ffffff"),BT3([0,.46,-.3])],[G3B.box(.9,.5,.08,"#8a5a3a"),BT3([0,.4,-.46])]])},
  table:{n:"Mesa",ic:"🪑",h:.25,mk:()=>G3B.merge([[G3B.box(.86,.08,.86,"#b07a48"),BT3([0,.55,0])]].concat([[-.36,-.36],[.36,-.36],[-.36,.36],[.36,.36]].map(([x,z])=>[G3B.box(.07,.52,.07,"#8a5a32"),BT3([x,.26,z])])))},
  chair:{n:"Silla",ic:"🪑",h:.15,mk:()=>G3B.merge([[G3B.box(.5,.07,.5,"#c98a52"),BT3([0,.32,0])],[G3B.box(.5,.45,.06,"#c98a52"),BT3([0,.55,-.22])]].concat([[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]].map(([x,z])=>[G3B.box(.05,.3,.05,"#8a5a32"),BT3([x,.15,z])])))},
  sofa:{n:"Sofá",ic:"🛋️",h:.5,mk:()=>G3B.merge([[G3B.box(.95,.28,.7,"#5a7ad8"),BT3([0,.2,0])],[G3B.box(.95,.42,.18,"#4a68c0"),BT3([0,.45,-.28])],[G3B.box(.14,.36,.7,"#4a68c0"),BT3([-.42,.32,0])],[G3B.box(.14,.36,.7,"#4a68c0"),BT3([.42,.32,0])]])},
  shelf:{n:"Estantería",ic:"📚",h:.4,mk:()=>{const L=[[G3B.box(.9,1.6,.4,"#8a5a3a"),BT3([0,.8,0])]];[.35,.8,1.25].forEach((y,i)=>{L.push([G3B.box(.82,.04,.36,"#6a4228"),BT3([0,y-.2,.02])]);for(let k=0;k<6;k++)L.push([G3B.box(.1,.28,.26,["#e2573b","#3a8cf0","#ffd23f","#3fbf6a","#a46aff"][(k+i)%5]),BT3([-.32+k*.13,y-.04,.04])])});return G3B.merge(L)}},
  plant:{n:"Planta",ic:"🪴",h:.12,mk:()=>G3B.merge([[G3B.cyl(.2,.15,.32,10,"#c8643a"),BT3([0,.16,0])],[G3B.sphere(.3,9,"#3fae4a"),BT3([0,.55,0])],[G3B.sphere(.22,8,"#4fbe5a"),BT3([.12,.75,.05])]])},
  lamp:{n:"Lámpara",ic:"💡",h:.1,glow:1,mk:()=>G3B.merge([[G3B.cyl(.18,.2,.05,10,"#555"),BT3([0,.03,0])],[G3B.cyl(.03,.03,1.1,6,"#777"),BT3([0,.58,0])],[G3B.cyl(.14,.3,.32,12,"#fff3b0"),BT3([0,1.22,0])]])},
  tv:{n:"Televisión",ic:"📺",h:.6,mk:()=>G3B.merge([[G3B.box(.9,.32,.42,"#5a4a3a"),BT3([0,.16,0])],[G3B.box(.86,.55,.06,"#222"),BT3([0,.66,-.08])],[G3B.box(.78,.47,.02,"#3a6ad8"),BT3([0,.66,-.045])]])},
  pc:{n:"Ordenador",ic:"💻",h:.7,mk:()=>G3B.merge([[G3B.box(.9,.06,.6,"#e8e8ee"),BT3([0,.62,0])],[G3B.box(.06,.6,.55,"#cfd2dc"),BT3([-.4,.3,0])],[G3B.box(.06,.6,.55,"#cfd2dc"),BT3([.4,.3,0])],[G3B.box(.5,.34,.04,"#222"),BT3([0,.86,-.15])],[G3B.box(.44,.28,.02,"#5fd0ff"),BT3([0,.86,-.125])],[G3B.box(.4,.03,.16,"#444"),BT3([0,.66,.08])]])},
  arcade:{n:"Máquina recreativa",ic:"🕹️",h:1.2,mk:()=>G3B.merge([[G3B.box(.7,1.5,.6,"#e0447a"),BT3([0,.75,0])],[G3B.box(.56,.4,.05,"#111"),BT3([0,1.1,.28])],[G3B.box(.5,.34,.02,"#7aff8a"),BT3([0,1.1,.31])],[G3B.box(.6,.08,.3,"#333"),BT3([0,.8,.35])],[G3B.sphere(.05,6,"#ff3a3a"),BT3([-.12,.88,.4])],[G3B.sphere(.04,6,"#3a8cff"),BT3([.1,.86,.42])]])},
  rug:{n:"Alfombra",ic:"🟥",h:.15,flat:1,big:1,mk:()=>G3B.merge([[G3B.box(1.9,.03,1.9,"#e2573b"),BT3([0,.015,0])],[G3B.box(1.6,.035,1.6,"#f08a5a"),BT3([0,.02,0])]])},
  rugpb:{n:"Alfombra Poké Ball",ic:"🔴",h:.3,flat:1,big:1,mk:()=>G3B.merge([[G3B.cyl(.95,.95,.03,28,"#222"),BT3([0,.015,0])],[G3B.cyl(.9,.9,.035,28,"#fff"),BT3([0,.02,0])],[G3B.box(1.8,.04,.12,"#222"),BT3([0,.025,0])],[G3B.cyl(.25,.25,.045,16,"#222"),BT3([0,.03,0])],[G3B.cyl(.17,.17,.05,16,"#fff"),BT3([0,.035,0])]])},
  pbig:{n:"Poké Ball gigante",ic:"⚪",h:.8,mk:()=>G3B.merge([[G3B.sphere(.42,14,(x,y)=>Math.abs(y)<.07?[.15,.15,.15]:y>0?[.9,.2,.22]:[.96,.96,.96]),BT3([0,.44,0])],[G3B.cyl(.13,.13,.06,12,"#fff"),BT3([0,.44,.4],[1.57,0,0])]])},
  // trofeos (gratis, se ganan jugando)
  cup:{n:"Copa de la Liga",ic:"🏆",free:1,req:()=>Object.values(S.lgDone||{}).reduce((a,b)=>a+(b|0),0)>=1,why:"Gana la Liga Pokémon",glow:.4,mk:()=>G3B.merge([[G3B.box(.5,.3,.5,"#3a2a6a"),BT3([0,.15,0])],[G3B.cyl(.06,.1,.3,8,"#ffcf2a"),BT3([0,.45,0])],[G3B.cyl(.28,.1,.36,14,"#ffcf2a"),BT3([0,.78,0])],[G3B.torus(.16,.03,12,6,"#ffcf2a"),BT3([-.3,.78,0],[0,0,1.57])],[G3B.torus(.16,.03,12,6,"#ffcf2a"),BT3([.3,.78,0],[0,0,1.57])]])},
  medals:{n:"Vitrina de medallas",ic:"🏅",free:1,req:()=>medCount()>=1,why:"Consigue tu primera medalla",mk:()=>{const L=[[G3B.box(.9,.9,.3,"#6a4228"),BT3([0,.45,0])],[G3B.box(.8,.8,.04,"#2a1f4a"),BT3([0,.47,.14])]];for(let i=0;i<8;i++)L.push([G3B.cyl(.07,.07,.03,8,i<medCount()?["#ffcf2a","#bfc8d0","#e2573b","#3a8cf0","#3fbf6a","#a46aff","#ff7ac8","#fff36a"][i]:"#444"),BT3([-.27+(i%4)*.18,.62-Math.floor(i/4)*.3,.17],[1.57,0,0])]);return G3B.merge(L)}},
  tour:{n:"Trofeo de torneo",ic:"🥇",free:1,req:()=>(S.trophies||[]).length>=1,why:"Gana un trofeo de torneo",glow:.3,mk:()=>G3B.merge([[G3B.box(.4,.2,.4,"#222"),BT3([0,.1,0])],[G3B.cyl(.05,.05,.4,6,"#ccc"),BT3([0,.4,0])],[G3B.sphere(.2,12,"#ffcf2a"),BT3([0,.7,0])],[G3B.cyl(0,.12,.18,5,"#ffcf2a"),BT3([0,.95,0])]])},
  ribbons:{n:"Panel de cintas",ic:"🎀",free:1,req:()=>Object.keys(S.rib||{}).length>=1,why:"Gana un concurso Pokémon",mk:()=>{const L=[[G3B.box(.85,.9,.12,"#f4e8ff"),BT3([0,.75,0])],[G3B.box(.06,.3,.06,"#6a4228"),BT3([0,.15,0])]];["#4aa8ff","#ff5a5a","#ff7ac8","#3fbf6a","#e0952a"].forEach((c,i)=>{L.push([G3B.cyl(.07,.07,.03,10,c),BT3([-.3+i*.15,.85,.07],[1.57,0,0])]);L.push([G3B.box(.06,.18,.02,c),BT3([-.3+i*.15,.68,.07])])});return G3B.merge(L)}},
  goldball:{n:"Poké Ball dorada",ic:"🟡",free:1,req:()=>!!(S.skins&&S.skins.gold),why:"Consigue el aspecto Dorado de la Poké Ball",glow:.35,mk:()=>G3B.merge([[G3B.box(.5,.2,.5,"#3a2a6a"),BT3([0,.1,0])],[G3B.sphere(.32,14,(x,y)=>Math.abs(y)<.07?[.35,.25,.05]:[1,.82,.2]),BT3([0,.55,0])]])},
};
Object.keys(BS_F).forEach(k=>{if(!BS_F[k].free)BS_F[k].price=()=>Math.max(1e6*(1+BS_F[k].h*5),prodH(BS_F[k].h))});
BS_PLUSH.forEach(n=>{BS_F["pl_"+n]={n:"Peluche de "+n,ic:"🧸",plush:n,h:.25,mk:()=>G3B.merge([[G3B.cyl(.32,.34,.12,14,"#ffb0c8"),BT3([0,.06,0])],[G3B.cyl(.28,.3,.04,14,"#ffd0e0"),BT3([0,.13,0])]])};BS_F["pl_"+n].price=()=>Math.max(2e6,prodH(.25))});
function hbSt(){S.base=S.base&&typeof S.base==="object"?S.base:{w:"cr",f:"wd",it:[],inv:{}};S.base.it=Array.isArray(S.base.it)?S.base.it:[];S.base.inv=S.base.inv||{};return S.base}
const bsOwn=k=>{const F=BS_F[k];if(!F)return 0;if(F.free)return F.req()?1:0;return hbSt().inv[k]|0};
const bsUsed=k=>hbSt().it.filter(x=>x[0]===k).length;
// casillas ocupadas (las alfombras van por debajo y pueden tener cosas encima)
function bsFree(i,j,flat,ignore){const s=hbSt();if(i<0||j<0||i>=BS_N||j>=BS_N)return false;return !s.it.some((x,ix)=>ix!==ignore&&!!BS_F[x[0]]&&!!BS_F[x[0]].flat===!!flat&&(BS_F[x[0]].big?(i>=x[1]&&i<=x[1]+1&&j>=x[2]&&j<=x[2]+1):(x[1]===i&&x[2]===j)))}
// ---------- dibujo 3D de una habitación (se usa para la tuya y para las visitas) ----------
function bsRoom(cv,data,opt){let E=null;try{E=G3D(cv)}catch(e){E=null}if(!E)return null;const R={E,data,yaw:.78,pitch:.68,dist:13.5,meshes:{},tex:{},sel:-1,hand:null,hover:null,dirty:true,raf:0,alive:true};
  E.sky=[.16,.14,.28];E.fogR=[40,90];E.amb=[.62,.6,.66];E.sun=[.55,.52,.46];E.L=[.45,.85,.35];
  const mk=k=>R.meshes[k]||(R.meshes[k]=E.mesh(BS_F[k].mk()));
  R.build=()=>{const d=R.data,fl=BS_FLOOR[d.f]||BS_FLOOR.wd,wl=BS_WALL[d.w]||BS_WALL.cr,L=[];
    for(let i=0;i<BS_N;i++)for(let j=0;j<BS_N;j++)L.push([G3B.box(1,.1,1,(i+j)%2?fl[1]:fl[2]),BT3([i-BS_N/2+.5,-.05,j-BS_N/2+.5])]);
    L.push([G3B.box(BS_N+.3,3.2,.15,wl[1]),BT3([0,1.6,-BS_N/2-.075])],[G3B.box(.15,3.2,BS_N+.3,wl[1]),BT3([-BS_N/2-.075,1.6,0])]);
    L.push([G3B.box(BS_N+.3,.18,.18,"#fff"),BT3([0,.09,-BS_N/2+.02])],[G3B.box(.18,.18,BS_N+.3,"#fff"),BT3([-BS_N/2+.02,.09,0])]);
    L.push([G3B.box(2,1.3,.05,"#dff4ff"),BT3([1.2,1.9,-BS_N/2+.01])],[G3B.box(2.2,.1,.08,"#fff"),BT3([1.2,1.2,-BS_N/2+.03])],[G3B.box(.06,1.3,.06,"#fff"),BT3([1.2,1.9,-BS_N/2+.03])],[G3B.box(2,.06,.06,"#fff"),BT3([1.2,1.9,-BS_N/2+.03])]);
    L.push([G3B.box(.05,1.2,.9,"#7a5cff"),BT3([-BS_N/2+.01,1.9,-1.5])],[G3B.box(.06,.08,1,"#ffd23f"),BT3([-BS_N/2+.03,2.45,-1.5])]);
    if(R.room)R.room=null;R.room=E.mesh(G3B.merge(L));R.dirty=true};
  R.build();
  R.tile=(i,j)=>[i-BS_N/2+.5,0,j-BS_N/2+.5];
  R.render=()=>{if(!R.alive)return;const cx=Math.sin(R.yaw)*Math.cos(R.pitch)*R.dist,cz=Math.cos(R.yaw)*Math.cos(R.pitch)*R.dist,cy=Math.sin(R.pitch)*R.dist;
    E.camera([cx,cy+.2,cz+.6],[0,.15,.6],.78);E.begin();E.draw(R.room);
    const d=R.data;(d.it||[]).forEach((x,ix)=>{const F=BS_F[x[0]];if(!F)return;const big=F.big,p=R.tile(x[1]+(big?.5:0),x[2]+(big?.5:0)),m=BT3(p,[0,(x[3]|0)*Math.PI/2,0]);
      E.draw(mk(x[0]),m,ix===R.sel?[1.25,1.25,1.1]:null,F.glow||0);
      if(F.plush){const n=F.plush;const t=R.tex[n]||(R.tex[n]=PM[n]?E.tex(mgImgSrc(PM[n])):null);if(t&&!E.sprite(t,[p[0],.12,p[2]],.7)&&!t.ok)R.dirty=true}});
    if(R.hover&&R.hand){const F=BS_F[R.hand.k],big=F&&F.big,ok=R.hover.ok,p=R.tile(R.hover.i+(big?.5:0),R.hover.j+(big?.5:0));E.draw(mk(R.hand.k),BT3(p,[0,(R.hand.r|0)*Math.PI/2,0]),ok?[.7,1.3,.7]:[1.4,.5,.5],.3,.6)}
    R.dirty=false};
  const loop=()=>{if(!R.alive)return;if(R.dirty||Object.values(R.tex).some(t=>t&&!t.ok&&!t.bad))R.render();R.raf=requestAnimationFrame(loop)};R.raf=requestAnimationFrame(loop);
  // giro con el ratón o el dedo, zoom con la rueda o pellizco
  let drag=null,moved=0,pinch=null;const pts=new Map();
  cv.addEventListener("pointerdown",e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const a=[...pts.values()];pinch={d:Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]),z:R.dist}}else{drag=[e.clientX,e.clientY,R.yaw,R.pitch];moved=0}try{cv.setPointerCapture(e.pointerId)}catch(x){}});
  cv.addEventListener("pointermove",e=>{if(pts.has(e.pointerId))pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pinch&&pts.size===2){const a=[...pts.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);R.dist=Math.max(7,Math.min(17,pinch.z*pinch.d/Math.max(20,d)));R.dirty=true;return}
    if(drag){const dx=e.clientX-drag[0],dy=e.clientY-drag[1];moved=Math.max(moved,Math.abs(dx)+Math.abs(dy));if(moved>6){R.yaw=Math.max(.08,Math.min(1.5,drag[2]-dx*.008));R.pitch=Math.max(.3,Math.min(1.25,drag[3]+dy*.006));R.dirty=true}}
    if(opt&&opt.hover&&e.pointerType==="mouse"){const t=R.pick(e.clientX,e.clientY);opt.hover(t)}});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;if(drag&&moved<=6&&opt&&opt.tap){const t=R.pick(e.clientX,e.clientY);opt.tap(t,e)}drag=null};
  cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",e=>{pts.delete(e.pointerId);drag=null;pinch=null});
  cv.addEventListener("wheel",e=>{e.preventDefault();R.dist=Math.max(7,Math.min(17,R.dist+Math.sign(e.deltaY)*.8));R.dirty=true},{passive:false});
  // casilla bajo el puntero (proyectando las 4 esquinas de cada casilla)
  R.pick=(cx0,cy0)=>{const r=cv.getBoundingClientRect(),px=cx0-r.left,py=cy0-r.top,inq=(q)=>{let c=false;for(let a=0,b=3;a<4;b=a++){const[xa,ya]=q[a],[xb,yb]=q[b];if((ya>py)!==(yb>py)&&px<(xb-xa)*(py-ya)/(yb-ya)+xa)c=!c}return c};
    for(let i=0;i<BS_N;i++)for(let j=0;j<BS_N;j++){const x=i-BS_N/2,z=j-BS_N/2,q=[[x,0,z],[x+1,0,z],[x+1,0,z+1],[x,0,z+1]].map(v=>E.toScreen(v));if(q.some(v=>!v))continue;if(inq(q))return{i,j}}return null};
  R.fit=()=>{const r=cv.getBoundingClientRect();if(r.width>0){E.resize(r.width,r.height,Math.min(document.body.classList.contains("lite")?1:1.5,window.devicePixelRatio||1));R.dirty=true}};
  try{R.ro=new ResizeObserver(R.fit);R.ro.observe(cv)}catch(e){}R.fit();
  R.free=()=>{R.alive=false;cancelAnimationFrame(R.raf);try{R.ro&&R.ro.disconnect()}catch(e){}E.free()};
  return R}
// ---------- tu base ----------
let SBASE3=null;
v8Tab("trn","baseP","Base secreta","🏠 Base secreta","Tu propia habitación en 3D: decórala con muebles, peluches y los trofeos que ganes jugando. Publícala para que otros entrenadores la visiten y te dejen un «me gusta».",()=>bsUI());
function bsUI(){const b=$("basePB");if(!b)return;const s=hbSt(),tab=NX.bsTab||"f";
  if(!b.querySelector("#bsCv")){b.innerHTML='<div class="bswrap"><canvas id="bsCv"></canvas><div class="bshint" id="bsHint"></div><div class="bstools" id="bsTools"></div></div><div class="bstabs" id="bsTabs"></div><div id="bsBody"></div>';
    if(SBASE3){SBASE3.free();SBASE3=null}
    SBASE3=bsRoom($("bsCv"),s,{tap:bsTap,hover:t=>{if(!SBASE3||!SBASE3.hand)return;const k=SBASE3.hand.k,F=BS_F[k];const h=t?{i:t.i,j:t.j,ok:bsFree(t.i,t.j,F.flat)&&(!F.big||bsFree(t.i+1,t.j,1)&&bsFree(t.i,t.j+1,1)&&bsFree(t.i+1,t.j+1,1)&&t.i<BS_N-1&&t.j<BS_N-1)}:null;if(JSON.stringify(h)!==JSON.stringify(SBASE3.hover)){SBASE3.hover=h;SBASE3.dirty=true}}});
    if(!SBASE3){$("bsCv").replaceWith(Object.assign(document.createElement("p"),{className:"mut",textContent:"Tu navegador no puede mostrar gráficos 3D, así que la base secreta no está disponible aquí."}))}}
  if(SBASE3){SBASE3.data=s}
  $("bsTabs").innerHTML=[["f","🛋️ Muebles"],["p","🧸 Peluches"],["t","🏆 Trofeos"],["s","🎨 Estilo"],["v","👥 Visitar"]].map(t=>'<button class="'+(t[0]===tab?'on':'')+'" data-bst="'+t[0]+'">'+t[1]+'</button>').join("");
  bsTools();bsBody()}
function bsTools(){const el=$("bsTools"),h=$("bsHint");if(!el)return;const s=hbSt();
  if(SBASE3&&SBASE3.hand){const F=BS_F[SBASE3.hand.k];el.innerHTML='<span>'+F.ic+' Colocando: <b>'+esc(F.n)+'</b></span><button class="alt" data-bsa="rot">↻ Girar</button><button class="alt" data-bsa="cancel">✕ Cancelar</button>';h.textContent="Toca una casilla del suelo para colocarlo. Arrastra para girar la cámara."}
  else if(SBASE3&&SBASE3.sel>=0&&s.it[SBASE3.sel]){const x=s.it[SBASE3.sel],F=BS_F[x[0]];el.innerHTML='<span>'+F.ic+' <b>'+esc(F.n)+'</b></span><button class="alt" data-bsa="srot">↻ Girar</button><button class="alt" data-bsa="move">✋ Mover</button><button class="alt" data-bsa="del">🗑️ Guardar</button><button class="alt" data-bsa="unsel">✓ Listo</button>';h.textContent=""}
  else{el.innerHTML='<span class="mut">'+s.it.length+' objetos colocados</span><button class="'+(S.basePub?'alt':'red')+'" data-bsa="pub">'+(S.basePub?'🔄 Actualizar publicación':'📢 Publicar mi base')+'</button>'+(S.basePub?'<button class="alt" data-bsa="unpub">🙈 Dejar de publicar</button>':'');h.textContent="Arrastra para girar · rueda o pellizco para acercar · toca un objeto para moverlo"}}
function bsBody(){const el=$("bsBody");if(!el)return;const s=hbSt(),tab=NX.bsTab||"f";
  if(tab==="s"){el.innerHTML='<h3 class="shh">Paredes</h3><div class="bsstyle">'+Object.keys(BS_WALL).map(k=>'<button class="'+(s.w===k?'on':'')+'" data-bsw="'+k+'"><i style="background:'+BS_WALL[k][1]+'"></i>'+BS_WALL[k][0]+'</button>').join("")+'</div><h3 class="shh">Suelo</h3><div class="bsstyle">'+Object.keys(BS_FLOOR).map(k=>'<button class="'+(s.f===k?'on':'')+'" data-bsf="'+k+'"><i style="background:linear-gradient(135deg,'+BS_FLOOR[k][1]+' 50%,'+BS_FLOOR[k][2]+' 50%)"></i>'+BS_FLOOR[k][0]+'</button>').join("")+'</div>';return}
  if(tab==="v"){el.innerHTML='<div id="bsVis"><small class="mut">Cargando bases…</small></div>';bsVisList();return}
  const keys=Object.keys(BS_F).filter(k=>tab==="p"?BS_F[k].plush:tab==="t"?BS_F[k].free:!BS_F[k].plush&&!BS_F[k].free);
  el.innerHTML='<div class="bsgrid">'+keys.map(k=>{const F=BS_F[k],own=bsOwn(k),used=bsUsed(k),left=own-used;
    return '<div class="bsit"><span class="bsic">'+(F.plush&&PM[F.plush]?icoHD(PM[F.plush],48,false,false):F.ic)+'</span><b>'+esc(F.n)+'</b>'+(F.free?(own?'<small>'+(left>0?'✅ Disponible':'Colocado')+'</small>':'<small class="mut">🔒 '+esc(F.why)+'</small>'):'<small>Tienes '+own+(used?' · '+used+' colocado'+(used>1?'s':''):'')+'</small>')+
      '<div class="bsbtn">'+(left>0?'<button class="red" data-bsput="'+k+'">Colocar</button>':'')+(!F.free?'<button class="alt" data-bsbuy="'+k+'"'+(S.t<F.price()?' disabled':'')+'>Comprar · '+fmt(F.price())+' 🎟️</button>':'')+'</div></div>'}).join("")+'</div>'}
function bsTap(t){if(!SBASE3)return;const s=hbSt();if(!t)return;
  if(SBASE3.hand){const k=SBASE3.hand.k,F=BS_F[k];const ok=bsFree(t.i,t.j,F.flat)&&(!F.big||(t.i<BS_N-1&&t.j<BS_N-1&&bsFree(t.i+1,t.j,1)&&bsFree(t.i,t.j+1,1)&&bsFree(t.i+1,t.j+1,1)));
    if(!ok){snd("miss");toast("Ahí no cabe.");return}if(s.it.length>=64){toast("Tu base ya tiene 64 objetos: guarda alguno antes.");return}
    s.it.push([k,t.i,t.j,SBASE3.hand.r|0]);snd("pop");SBASE3.hand=null;SBASE3.hover=null;SBASE3.dirty=true;save();bsTools();bsBody();return}
  // tocar un objeto colocado: primero los de encima, luego las alfombras
  const ix=s.it.findIndex(x=>BS_F[x[0]]&&!BS_F[x[0]].flat&&x[1]===t.i&&x[2]===t.j);const ix2=ix>=0?ix:s.it.findIndex(x=>BS_F[x[0]]&&BS_F[x[0]].flat&&t.i>=x[1]&&t.i<=x[1]+1&&t.j>=x[2]&&t.j<=x[2]+1);
  SBASE3.sel=ix2;SBASE3.dirty=true;if(ix2>=0)snd("ui");bsTools()}
document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("#basePB [data-bst],#basePB [data-bsa],#basePB [data-bsput],#basePB [data-bsbuy],#basePB [data-bsw],#basePB [data-bsf],#basePB [data-bsvis]");if(!t)return;const s=hbSt();snd("ui");
  if(t.dataset.bst){NX.bsTab=t.dataset.bst;bsUI();return}
  if(t.dataset.bsw){s.w=t.dataset.bsw;save();if(SBASE3)SBASE3.build();bsBody();return}
  if(t.dataset.bsf){s.f=t.dataset.bsf;save();if(SBASE3)SBASE3.build();bsBody();return}
  if(t.dataset.bsput){if(!SBASE3)return;SBASE3.sel=-1;SBASE3.hand={k:t.dataset.bsput,r:0};SBASE3.dirty=true;bsTools();try{$("bsCv").scrollIntoView({behavior:"smooth",block:"center"})}catch(x){}return}
  if(t.dataset.bsbuy){const k=t.dataset.bsbuy,F=BS_F[k];if(!F||F.free)return;const p=F.price();if(S.t<p){toast("No tienes tickets suficientes.");return}S.t-=p;s.inv[k]=(s.inv[k]|0)+1;save();render();snd("lvl");toast("🏠 ¡Has comprado: "+F.n+"!");bsBody();return}
  if(t.dataset.bsvis){bsVisit(t.dataset.bsvis);return}
  const a=t.dataset.bsa;if(!a||!SBASE3)return;
  if(a==="rot"&&SBASE3.hand){SBASE3.hand.r=((SBASE3.hand.r|0)+1)%4;SBASE3.dirty=true}
  else if(a==="cancel"){SBASE3.hand=null;SBASE3.hover=null;SBASE3.dirty=true}
  else if(a==="srot"&&s.it[SBASE3.sel]){s.it[SBASE3.sel][3]=((s.it[SBASE3.sel][3]|0)+1)%4;save();SBASE3.dirty=true}
  else if(a==="move"&&s.it[SBASE3.sel]){const x=s.it.splice(SBASE3.sel,1)[0];SBASE3.sel=-1;SBASE3.hand={k:x[0],r:x[3]|0};save();SBASE3.dirty=true;bsBody()}
  else if(a==="del"&&s.it[SBASE3.sel]){s.it.splice(SBASE3.sel,1);SBASE3.sel=-1;save();SBASE3.dirty=true;bsBody()}
  else if(a==="unsel"){SBASE3.sel=-1;SBASE3.dirty=true}
  else if(a==="pub"){if(!(window.FB&&window.FB.baseSet&&v8Uid())){toast("Para publicar tu base necesitas una cuenta.");return}
    try{await window.FB.baseSet({n:v8Nick().slice(0,30),tr:trEnc(myLook()),w:s.w,f:s.f,it:s.it.slice(0,64).map(x=>x.join(","))});S.basePub=1;save();toast("📢 ¡Base publicada! Ya pueden visitarla.")}catch(x){toast("No se ha podido publicar ahora.")}}
  else if(a==="unpub"){try{await window.FB.baseOff();S.basePub=0;save();toast("Tu base ya no es pública.")}catch(x){toast("No se ha podido cambiar ahora.")}}
  bsTools()});
// al cerrar el panel se libera la tarjeta gráfica
setInterval(()=>{try{if(SBASE3&&!nxOpen("baseP")){SBASE3.free();SBASE3=null;const c=$("bsCv");if(c&&c.closest("#basePB"))$("basePB").innerHTML=""}}catch(e){}},2000);
// ---------- visitas ----------
async function bsVisList(){const box=$("bsVis");if(!box)return;if(!(window.FB&&window.FB.baseRecent)){box.innerHTML='<small class="mut">Para visitar bases necesitas una cuenta.</small>';return}
  let L=[];try{L=await window.FB.baseRecent()}catch(e){box.innerHTML='<small class="mut">No se han podido cargar.</small>';return}const me=v8Uid();
  const fr=L.filter(x=>isFriend(x.u)),ot=L.filter(x=>!isFriend(x.u)&&x.u!==me),row=x=>'<button class="bsvis" data-bsvis="'+esc(x.u)+'"><span class="bsvav">'+trImg(trDec(x.tr),"f","i")+'</span><b>'+esc(pvClean(x.n||"Entrenador"))+'</b><small>'+((x.it||[]).length)+' objetos</small></button>';
  box.innerHTML=(fr.length?'<h3 class="shh">👥 Tus amigos</h3><div class="bsvl">'+fr.map(row).join("")+'</div>':'<p class="mut">Ninguno de tus amigos ha publicado su base todavía.</p>')+(ot.length?'<h3 class="shh">🌍 Bases recientes</h3><div class="bsvl">'+ot.map(row).join("")+'</div>':'')}
async function bsVisit(u){if(!(window.FB&&window.FB.baseGet))return;let d=null;try{d=await window.FB.baseGet(u)}catch(e){}if(!d){toast("Esa base ya no está publicada.");return}
  const it=(Array.isArray(d.it)?d.it:[]).slice(0,64).map(x=>String(x).split(",")).map(a=>[a[0],a[1]|0,a[2]|0,a[3]|0]).filter(a=>BS_F[a[0]]&&a[1]>=0&&a[1]<BS_N&&a[2]>=0&&a[2]<BS_N);
  const data={w:BS_WALL[d.w]?d.w:"cr",f:BS_FLOOR[d.f]?d.f:"wd",it};
  nxModal('<h3>🏠 Base de '+esc(pvClean(d.n||"Entrenador"))+'</h3><div class="bswrap bsvisw"><canvas id="bsVCv"></canvas></div><div class="mgbtns"><button class="red" id="bsLk" disabled>❤️ …</button><button class="alt" id="bsVX">Cerrar</button></div><small class="mut">Arrastra para girar la cámara.</small>');
  const R=bsRoom($("bsVCv"),data,{});const close=()=>{if(R)R.free();nxModalClose()};$("bsVX").onclick=close;
  const me=v8Uid(),lk=$("bsLk");let liked=false,n=0;try{[liked,n]=await Promise.all([window.FB.baseLiked(u),window.FB.baseLikes(u)])}catch(e){}
  const paint=()=>{if(!lk)return;lk.disabled=u===me;lk.textContent=(liked?"💖 Te gusta":"🤍 Me gusta")+" · "+n};paint();
  if(lk)lk.onclick=async()=>{if(u===me)return;lk.disabled=true;try{await window.FB.baseLike(u,!liked);liked=!liked;n+=liked?1:-1;snd(liked?"lvl":"ui")}catch(e){toast("No se ha podido ahora.")}paint()};
  // al cerrar la ventana de otra forma, se libera también
  const iv=setInterval(()=>{const m=$("nxM");if(!m||m.hidden||!m.querySelector("#bsVCv")){clearInterval(iv);if(R&&R.alive)R.free()}},1000)}
// botón «Visitar base» en los perfiles
{const _op=openProf;openProf=async function(uid,dIn,tgt){const r=await _op.apply(this,arguments);try{if(!dIn&&uid&&uid!==v8Uid()){const box=tgt||$("profB");const row=box&&box.querySelector(".jrow");const bt=document.createElement("button");bt.className="alt";bt.textContent="🏠 Visitar su base";bt.onclick=()=>bsVisit(uid);if(row)row.prepend(bt);else if(box)box.appendChild(bt)}}catch(e){}return r}}
