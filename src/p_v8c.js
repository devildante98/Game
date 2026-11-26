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
function treFind(sp){const s=treSt();if(s.f)return;s.f=Date.now();let rw={t:Math.round(v8Tk(3,2e6)*(1+.25*specRank("X"))),it:{cand:2,ub:5}};
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
// paredes y suelos (p: dibujo — st rayas, br ladrillo, wd friso de madera · pl tablones, ch damero)
const BS_WALL={cr:["Crema","#f3e6c8"],az:["Azul cielo","#bfe0ff"],ro:["Rosa","#ffd0e0"],ve:["Menta","#c8f0d8"],li:["Lila","#e0d0ff"],os:["Noche","#3a3f6a"],
  ra:["Rayas","#fff2d8","st","#f6c9a8"],rz:["Rayas azules","#e6f2ff","st","#b8d6f6"],la:["Ladrillo","#c8735a","br","#b05e48"],ma:["Madera","#d9b088","wd","#b58658"],pk:["Poké Ball","#ffe8e8","pb","#e8444a"]};
const BS_FLOOR={wd:["Madera","#c89a62","#b88a52"],ti:["Baldosas","#e8e8f0","#cfd2e0"],gr:["Césped","#7fcf5f","#72c052"],mo:["Moqueta roja","#c8505a","#b8444e"],ma:["Mármol","#f4f2ee","#dedad2"],ne:["Neón","#2a2f5a","#3a3f8a"],
  pl:["Tablones","#b98a5a","#a87a4c","pl"],bl:["Moqueta azul","#4a72c8","#4266b8"],ar:["Arena","#f0dca8","#e6cf96"],aj:["Ajedrez","#f4f4f4","#2a2a2a"]};
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
// (8.0.2) superficies (se pueden poner cosas pequeñas encima) y objetos pequeños
BS_F.table.surf=.59;["cup","tour","goldball"].forEach(k=>{BS_F[k].small=1});
Object.assign(BS_F,{
  side:{n:"Mesita",ic:"🟫",h:.12,surf:.5,mk:()=>G3B.merge([[G3B.box(.6,.46,.55,"#b07a48"),BT3([0,.23,0])],[G3B.box(.64,.05,.6,"#c98a52"),BT3([0,.48,0])],[G3B.box(.5,.16,.02,"#8a5a32"),BT3([0,.3,.28])],[G3B.sphere(.03,6,"#ffd23f"),BT3([0,.3,.3])]])},
  dresser:{n:"Cómoda",ic:"🗄️",h:.35,surf:.82,mk:()=>{const L=[[G3B.box(.92,.78,.5,"#c98a52"),BT3([0,.39,0])],[G3B.box(.96,.05,.54,"#b07a48"),BT3([0,.8,0])]];[.2,.42,.64].forEach(y=>{L.push([G3B.box(.82,.18,.02,"#d9a060"),BT3([0,y,.26])],[G3B.sphere(.03,6,"#6a4228"),BT3([-.2,y,.28])],[G3B.sphere(.03,6,"#6a4228"),BT3([.2,y,.28])])});return G3B.merge(L)}},
  wardrobe:{n:"Armario",ic:"🚪",h:.5,mk:()=>G3B.merge([[G3B.box(.95,1.9,.6,"#a87444"),BT3([0,.95,0])],[G3B.box(.45,1.75,.02,"#c08a56"),BT3([-.23,.98,.31])],[G3B.box(.45,1.75,.02,"#c08a56"),BT3([.23,.98,.31])],[G3B.box(.03,.25,.03,"#ffd23f"),BT3([-.05,1,.33])],[G3B.box(.03,.25,.03,"#ffd23f"),BT3([.05,1,.33])],[G3B.box(1,.06,.64,"#8a5a32"),BT3([0,1.92,0])]])},
  beanbag:{n:"Puf",ic:"🫘",h:.15,mk:()=>G3B.merge([[G3B.sphere(.42,12,"#ff8a3c"),BT3([0,.3,0],[0,0,0],[1,.7,1])],[G3B.sphere(.25,10,"#ffa65c"),BT3([0,.45,-.18],[0,0,0],[1.3,.8,.6])]])},
  aquarium:{n:"Pecera",ic:"🐠",h:.45,mk:()=>{const L=[[G3B.box(.9,.5,.45,"#5a4a3a"),BT3([0,.25,0])],[G3B.box(.86,.5,.4,"#7fd8ff"),BT3([0,.75,0])],[G3B.box(.9,.04,.45,"#333"),BT3([0,1.02,0])],[G3B.box(.86,.06,.4,"#e8d08a"),BT3([0,.53,0])]];
    [[-.2,.75,"#ff8a3c"],[.15,.85,"#ffd23f"],[.25,.68,"#ff5a8a"]].forEach(([x,y,c])=>L.push([G3B.sphere(.06,6,c),BT3([x,y,.21],[0,0,0],[1.4,.8,.5])]));L.push([G3B.cyl(.02,.03,.3,5,"#3fae4a"),BT3([-.32,.7,.1])],[G3B.cyl(.02,.03,.22,5,"#3fae4a"),BT3([.34,.66,0])]);return G3B.merge(L)}},
  fire:{n:"Chimenea",ic:"🔥",h:.8,glow:.15,mk:()=>G3B.merge([[G3B.box(1,1.1,.45,"#b05e48"),BT3([0,.55,0])],[G3B.box(1.08,.1,.52,"#e8e0d0"),BT3([0,1.12,0])],[G3B.box(.56,.5,.1,"#2a1a12"),BT3([0,.3,.19])],[G3B.cyl(0,.14,.32,6,"#ff8a1a"),BT3([-.08,.24,.2])],[G3B.cyl(0,.1,.24,6,"#ffd23f"),BT3([.1,.2,.21])],[G3B.box(.4,.06,.1,"#6a3a1a"),BT3([0,.08,.2])]])},
  piano:{n:"Piano",ic:"🎹",h:1,mk:()=>{const L=[[G3B.box(.95,.95,.45,"#1c1c22"),BT3([0,.62,-.05])],[G3B.box(.95,.06,.3,"#1c1c22"),BT3([0,.66,.3])],[G3B.box(.9,.04,.16,"#f4f4f4"),BT3([0,.7,.3])],[G3B.box(.06,.62,.06,"#1c1c22"),BT3([-.4,.31,.35])],[G3B.box(.06,.62,.06,"#1c1c22"),BT3([.4,.31,.35])]];for(let i=0;i<7;i++)L.push([G3B.box(.05,.03,.09,"#111"),BT3([-.36+i*.12,.73,.27])]);return G3B.merge(L)}},
  toybox:{n:"Baúl de juguetes",ic:"🧸",h:.2,surf:.5,mk:()=>G3B.merge([[G3B.box(.85,.45,.55,"#3a8cf0"),BT3([0,.23,0])],[G3B.box(.9,.08,.6,"#ffd23f"),BT3([0,.49,0])],[G3B.sphere(.08,8,"#e8444a"),BT3([-.2,.56,.05])],[G3B.box(.12,.12,.12,"#3fbf6a"),BT3([.15,.58,0],[0,.5,0])]])},
  bunk:{n:"Litera",ic:"🛏️",h:.8,mk:()=>{const L=[];[0,.95].forEach(y=>{L.push([G3B.box(.84,.14,.92,"#f4f4ff"),BT3([0,.34+y,0])],[G3B.box(.8,.08,.4,"#3a8cf0"),BT3([0,.43+y,.2])],[G3B.box(.5,.1,.2,"#fff"),BT3([0,.44+y,-.3])])});[[-.44,-.46],[.44,-.46],[-.44,.46],[.44,.46]].forEach(([x,z])=>L.push([G3B.box(.07,1.7,.07,"#8a5a3a"),BT3([x,.85,z])]));L.push([G3B.box(.9,.06,.95,"#8a5a3a"),BT3([0,.26,0])],[G3B.box(.9,.06,.95,"#8a5a3a"),BT3([0,1.21,0])]);return G3B.merge(L)}},
  // pequeños: van en el suelo o encima de una mesa, mesita, cómoda o baúl
  lampd:{n:"Lamparita",ic:"🪔",h:.08,small:1,glow:.7,mk:()=>G3B.merge([[G3B.cyl(.1,.12,.04,10,"#444"),BT3([0,.02,0])],[G3B.cyl(.015,.015,.26,6,"#777"),BT3([0,.15,0])],[G3B.cyl(.08,.15,.16,10,"#ffe58a"),BT3([0,.32,0])]])},
  cactus:{n:"Cactus",ic:"🌵",h:.06,small:1,mk:()=>G3B.merge([[G3B.cyl(.1,.08,.14,8,"#c8643a"),BT3([0,.07,0])],[G3B.cyl(.06,.06,.3,8,"#3fae4a"),BT3([0,.28,0])],[G3B.sphere(.06,7,"#3fae4a"),BT3([0,.43,0])],[G3B.cyl(.03,.03,.12,6,"#3fae4a"),BT3([.07,.3,0],[0,0,-.9])],[G3B.sphere(.035,6,"#ff7ac8"),BT3([0,.49,0])]])},
  vase:{n:"Jarrón con flores",ic:"💐",h:.08,small:1,mk:()=>G3B.merge([[G3B.cyl(.06,.1,.22,10,"#5ab4ff"),BT3([0,.11,0])],[G3B.sphere(.07,7,"#ff5a8a"),BT3([-.05,.32,0])],[G3B.sphere(.07,7,"#ffd23f"),BT3([.06,.34,.02])],[G3B.sphere(.06,7,"#a46aff"),BT3([0,.36,-.05])],[G3B.cyl(.01,.01,.12,4,"#3fae4a"),BT3([0,.26,0])]])},
  radio:{n:"Radio",ic:"📻",h:.06,small:1,mk:()=>G3B.merge([[G3B.box(.34,.2,.14,"#e2573b"),BT3([0,.1,0])],[G3B.cyl(.06,.06,.02,10,"#333"),BT3([-.08,.1,.07],[1.57,0,0])],[G3B.box(.1,.06,.02,"#ffe58a"),BT3([.09,.13,.07])],[G3B.cyl(.006,.006,.24,4,"#999"),BT3([.12,.3,0],[0,0,.4])]])},
  ballstand:{n:"Poké Ball en peana",ic:"🔴",h:.1,small:1,mk:()=>G3B.merge([[G3B.cyl(.12,.14,.06,10,"#d8b45a"),BT3([0,.03,0])],[G3B.sphere(.13,12,(x,y)=>Math.abs(y)<.08?[.15,.15,.15]:y>0?[.9,.2,.22]:[.96,.96,.96]),BT3([0,.19,0])]])},
});
// ---- objetos de pared (cada uno ocupa un hueco; «w2»: dos huecos de ancho) ----
const BS_PAINT=["Pikachu","Charizard","Mew","Lugia","Rayquaza","Eevee","Gengar","Lucario","Greninja","Sylveon"];
Object.assign(BS_F,{
  clock:{n:"Reloj",ic:"🕰️",h:.08,wall:1,mk:()=>{const L=[[G3B.cyl(.3,.3,.06,20,"#8a5a3a"),BT3([0,0,.03],[1.57,0,0])],[G3B.cyl(.26,.26,.07,20,"#fff8e8"),BT3([0,0,.04],[1.57,0,0])],[G3B.box(.03,.18,.02,"#222"),BT3([0,.07,.08])],[G3B.box(.13,.03,.02,"#222"),BT3([.05,0,.08])]];for(let i=0;i<12;i++){const a=i/12*Math.PI*2;L.push([G3B.box(.02,.04,.01,"#444"),BT3([Math.sin(a)*.21,Math.cos(a)*.21,.08],[0,0,-a])])}return G3B.merge(L)}},
  wshelf:{n:"Estante de pared",ic:"📚",h:.12,wall:1,mk:()=>{const L=[[G3B.box(.9,.05,.26,"#a87444"),BT3([0,-.2,.13])]];for(let k=0;k<5;k++)L.push([G3B.box(.08,.26,.18,["#e2573b","#3a8cf0","#ffd23f","#3fbf6a","#a46aff"][k]),BT3([-.32+k*.09,-.04,.12])]);L.push([G3B.cyl(.06,.05,.1,8,"#c8643a"),BT3([.25,-.12,.12])],[G3B.sphere(.08,7,"#3fae4a"),BT3([.25,0,.12])]);return G3B.merge(L)}},
  wpb:{n:"Poké Ball de pared",ic:"🔴",h:.1,wall:1,mk:()=>G3B.merge([[G3B.sphere(.3,14,(x,y)=>Math.abs(y)<.07?[.15,.15,.15]:y>0?[.9,.2,.22]:[.96,.96,.96]),BT3([0,0,.1],[0,0,0],[1,1,.35])],[G3B.cyl(.08,.08,.04,12,"#fff"),BT3([0,0,.2],[1.57,0,0])]])},
  pennant:{n:"Banderín",ic:"🚩",h:.05,wall:1,mk:()=>G3B.merge([[G3B.cyl(.015,.015,.8,5,"#8a5a3a"),BT3([0,.25,.04],[0,0,1.57])],[G3B.cyl(0,.22,.6,3,"#e2573b"),BT3([0,-.05,.04],[0,0,3.14],[1,1,.12])]])},
  mirror:{n:"Espejo",ic:"🪞",h:.15,wall:1,mk:()=>G3B.merge([[G3B.box(.56,.82,.05,"#d8b45a"),BT3([0,0,.03])],[G3B.box(.48,.74,.02,"#cfe8ff"),BT3([0,0,.06])],[G3B.box(.12,.5,.01,"#ffffff"),BT3([-.12,.05,.075],[0,0,.3])]])},
  sconce:{n:"Aplique",ic:"💡",h:.08,wall:1,glow:.8,mk:()=>G3B.merge([[G3B.box(.12,.2,.05,"#777"),BT3([0,-.05,.03])],[G3B.cyl(.05,.11,.18,10,"#fff3b0"),BT3([0,.1,.12])]])},
  wtv:{n:"Tele de pared",ic:"🖥️",h:.7,wall:1,w2:1,mk:()=>G3B.merge([[G3B.box(1.6,.9,.06,"#1a1a1e"),BT3([0,0,.04])],[G3B.box(1.5,.8,.02,"#2a5ad8"),BT3([0,0,.08])],[G3B.box(.5,.2,.01,"#7fd8ff"),BT3([-.3,.15,.095])],[G3B.box(.3,.12,.01,"#ffd23f"),BT3([.4,-.2,.095])]])},
  tapestry:{n:"Tapiz",ic:"🧶",h:.3,wall:1,w2:1,mk:()=>{const L=[[G3B.cyl(.02,.02,1.7,6,"#8a5a3a"),BT3([0,.42,.05],[0,0,1.57])],[G3B.box(1.5,.8,.02,"#7a5cff"),BT3([0,0,.04])]];["#ffd23f","#ff7ac8","#5fd0ff"].forEach((c,i)=>L.push([G3B.box(1.5,.08,.025,c),BT3([0,.22-i*.22,.045])]));return G3B.merge(L)}},
  diploma:{n:"Diploma de la Liga",ic:"📜",free:1,wall:1,req:()=>Object.values(S.lgDone||{}).reduce((a,b)=>a+(b|0),0)>=1,why:"Gana la Liga Pokémon",mk:()=>G3B.merge([[G3B.box(.6,.45,.05,"#d8b45a"),BT3([0,0,.03])],[G3B.box(.52,.37,.02,"#fff8e0"),BT3([0,0,.06])],[G3B.box(.3,.03,.01,"#333"),BT3([0,.1,.075])],[G3B.box(.36,.02,.01,"#666"),BT3([0,.02,.075])],[G3B.cyl(.05,.05,.02,10,"#e2573b"),BT3([.16,-.1,.075],[1.57,0,0])]])},
});
BS_PAINT.forEach(n=>{BS_F["pa_"+n]={n:"Cuadro de "+n,ic:"🖼️",paint:n,h:.3,wall:1,mk:()=>G3B.merge([[G3B.box(.74,.74,.05,"#8a5a3a"),BT3([0,0,.03])],[G3B.box(.64,.64,.02,"#fff8e8"),BT3([0,0,.06])]])}});
Object.keys(BS_F).forEach(k=>{if(!BS_F[k].free)BS_F[k].price=()=>v8Disc(Math.max(1e6*(1+BS_F[k].h*5),prodH(BS_F[k].h)))});
BS_PLUSH.forEach(n=>{BS_F["pl_"+n]={n:"Peluche de "+n,ic:"🧸",plush:n,h:.25,mk:()=>G3B.merge([[G3B.cyl(.32,.34,.12,14,"#ffb0c8"),BT3([0,.06,0])],[G3B.cyl(.28,.3,.04,14,"#ffd0e0"),BT3([0,.13,0])]])};BS_F["pl_"+n].price=()=>v8Disc(Math.max(2e6,prodH(.25)))});
// Datos de cada objeto colocado: suelo [k, i, j, giro, encima] (encima = 1 si está sobre una mesa, mesita…) ·
// pared [k, -1 = pared del fondo | -2 = pared izquierda, hueco 0..7, altura 0 abajo | 1 arriba]
function hbSt(){S.base=S.base&&typeof S.base==="object"?S.base:{w:"cr",f:"wd",it:[],inv:{}};S.base.it=Array.isArray(S.base.it)?S.base.it:[];S.base.inv=S.base.inv||{};return S.base}
const bsOwn=k=>{const F=BS_F[k];if(!F)return 0;if(F.free)return F.req()?1:0;return hbSt().inv[k]|0};
const bsUsed=k=>hbSt().it.filter(x=>x[0]===k).length;
const bsIsW=x=>x[1]<0;
// huecos de la pared que tapan la ventana (fondo) y la puerta (izquierda)
const BS_WBLOCK={"-1":[3,4,5,6],"-2":[5,6]};
const bsBase=(it,i,j,ig)=>it.findIndex((x,ix)=>ix!==ig&&!bsIsW(x)&&BS_F[x[0]]&&!BS_F[x[0]].flat&&!x[4]&&x[1]===i&&x[2]===j);
const bsTop=(it,i,j,ig)=>it.findIndex((x,ix)=>ix!==ig&&!bsIsW(x)&&x[4]&&x[1]===i&&x[2]===j);
// ¿cabe en el suelo? → {ok, top} (top: va encima de una superficie)
function bsCanFloor(it,k,i,j,ig){const F=BS_F[k];if(!F||F.wall)return{ok:false};const inb=(a,b)=>a>=0&&b>=0&&a<BS_N&&b<BS_N;if(!inb(i,j))return{ok:false};
  if(F.flat){const cells=F.big?[[i,j],[i+1,j],[i,j+1],[i+1,j+1]]:[[i,j]];if(!cells.every(c=>inb(c[0],c[1])))return{ok:false};
    return{ok:!it.some((x,ix)=>ix!==ig&&!bsIsW(x)&&BS_F[x[0]]&&BS_F[x[0]].flat&&cells.some(c=>c[0]>=x[1]&&c[0]<=x[1]+(BS_F[x[0]].big?1:0)&&c[1]>=x[2]&&c[1]<=x[2]+(BS_F[x[0]].big?1:0)))}}
  const b=bsBase(it,i,j,ig);if(b<0)return{ok:true,top:false};
  if(F.small&&BS_F[it[b][0]].surf&&bsTop(it,i,j,ig)<0)return{ok:true,top:true};return{ok:false}}
function bsCanWall(it,k,w,p,h,ig){const F=BS_F[k];if(!F||!F.wall||(w!==-1&&w!==-2)||(h!==0&&h!==1))return false;const cells=F.w2?[p,p+1]:[p];
  if(!cells.every(c=>c>=0&&c<BS_N&&!BS_WBLOCK[w].includes(c)))return false;
  return !it.some((x,ix)=>ix!==ig&&x[1]===w&&x[3]===h&&BS_F[x[0]]&&(BS_F[x[0]].w2?[x[2],x[2]+1]:[x[2]]).some(c=>cells.includes(c)))}
const bsSurfH=(it,x)=>{if(!x[4])return 0;const b=bsBase(it,x[1],x[2],-1);return b>=0&&BS_F[it[b][0]]?BS_F[it[b][0]].surf||0:0};
// ---------- dibujo 3D de una habitación (se usa para la tuya y para las visitas) ----------
function bsRoom(cv,data,opt){let E=null;try{E=G3D(cv)}catch(e){E=null}if(!E)return null;const R={E,data,yaw:.78,pitch:.62,dist:11.2,meshes:{},tex:{},sel:-1,hand:null,hover:null,dirty:true,raf:0,alive:true,t0:performance.now()};
  const mk=k=>R.meshes[k]||(R.meshes[k]=E.mesh(BS_F[k].mk()));
  const SH=E.mesh(G3B.cyl(.5,.5,.01,18,"#000000")),ARW=E.mesh(G3B.merge([[G3B.cyl(.12,0,.2,10,"#ffd23f"),BT3([0,0,0],[3.14,0,0])],[G3B.cyl(.05,.05,.16,8,"#ffd23f"),BT3([0,.17,0])]]));
  R.light=()=>{const n=!!R.data.nt;E.sky=n?[.06,.06,.14]:[.16,.14,.28];E.amb=n?[.32,.32,.46]:[.62,.6,.66];E.sun=n?[.18,.18,.3]:[.55,.52,.46];E.L=[.45,.85,.35]};
  R.build=()=>{const d=R.data,fl=BS_FLOOR[d.f]||BS_FLOOR.wd,wl=BS_WALL[d.w]||BS_WALL.cr,L=[],H=BS_N/2,c2=wl[3]||wl[1],dark=c=>G3B.hex(c).map(v=>v*.82);
    // suelo: damero o tablones
    if(fl[3]==="pl"){for(let j=0;j<BS_N*2;j++){let x=-H,r=0;while(x<H-.01){const w=Math.min(H-x,1.2+((j*7+r*3)%5)*.35);L.push([G3B.box(w-.02,.1,.48,(j+r)%2?fl[1]:fl[2]),BT3([x+w/2,-.05,-H+.25+j*.5])]);x+=w;r++}}}
    else for(let i=0;i<BS_N;i++)for(let j=0;j<BS_N;j++)L.push([G3B.box(1,.1,1,(i+j)%2?fl[1]:fl[2]),BT3([i-H+.5,-.05,j-H+.5])]);
    // paredes con zócalo y moldura
    const wall=(x,z,w,d2)=>L.push([G3B.box(w,3.2,d2,wl[1]),BT3([x,1.6,z])]);wall(0,-H-.075,BS_N+.3,.15);wall(-H-.075,0,.15,BS_N+.3);
    if(wl[2]==="st")for(let k=0;k<BS_N*2;k+=2){L.push([G3B.box(.5,2.9,.02,c2),BT3([-H+.25+k*.5,1.75,-H+.005])],[G3B.box(.02,2.9,.5,c2),BT3([-H+.005,1.75,-H+.25+k*.5])])}
    if(wl[2]==="br")for(let r=0;r<9;r++)for(let k=0;k<9;k++){const off=r%2?.5:0;const bx=-H+k+off;if(bx<H)L.push([G3B.box(.94,.3,.02,c2),BT3([Math.min(bx+.47,H-.47),.25+r*.34,-H+.005])]);const bz=-H+k+off;if(bz<H)L.push([G3B.box(.02,.3,.94,c2),BT3([-H+.005,.25+r*.34,Math.min(bz+.47,H-.47)])])}
    if(wl[2]==="wd")for(let k=0;k<BS_N*4;k++){L.push([G3B.box(.02,1,.02,c2),BT3([-H+k*.25,.6,-H+.01])],[G3B.box(.02,1,.02,c2),BT3([-H+.01,.6,-H+k*.25])])}
    if(wl[2]==="pb"){for(let k=0;k<4;k++){L.push([G3B.cyl(.16,.16,.02,14,c2),BT3([-H+1+k*2,2.5,-H+.01],[1.57,0,0])],[G3B.cyl(.16,.16,.02,14,c2),BT3([-H+.01,2.5,-H+1+k*2],[0,0,1.57])])}}
    const wd=dark(wl[1]);L.push([G3B.box(BS_N+.3,1,.04,wd),BT3([0,.6,-H+.02])],[G3B.box(.04,1,BS_N+.3,wd),BT3([-H+.02,.6,0])]);
    L.push([G3B.box(BS_N+.3,.06,.08,"#fff"),BT3([0,1.12,-H+.04])],[G3B.box(.08,.06,BS_N+.3,"#fff"),BT3([-H+.04,1.12,0])]);
    L.push([G3B.box(BS_N+.3,.18,.18,"#fff"),BT3([0,.09,-H+.02])],[G3B.box(.18,.18,BS_N+.3,"#fff"),BT3([-H+.02,.09,0])]);
    L.push([G3B.box(BS_N+.3,.14,.2,"#fff"),BT3([0,3.13,-H+.02])],[G3B.box(.2,.14,BS_N+.3,"#fff"),BT3([-H+.02,3.13,0])]);
    // ventana con cortinas (pared del fondo) y puerta (pared izquierda)
    const win=d.nt?"#1c2a5a":"#bfe8ff";L.push([G3B.box(1.9,1.3,.04,win),BT3([1,1.95,-H+.01])],[G3B.box(2.1,.1,.12,"#fff"),BT3([1,1.27,-H+.06])],[G3B.box(2.1,.08,.08,"#fff"),BT3([1,2.63,-H+.04])],[G3B.box(.06,1.3,.06,"#fff"),BT3([1,1.95,-H+.04])],[G3B.box(1.9,.05,.06,"#fff"),BT3([1,1.95,-H+.04])]);
    if(d.nt)[[.4,2.3],[1.5,2.2],[.8,1.7],[1.7,2.45]].forEach(([x,y])=>L.push([G3B.box(.04,.04,.01,"#fff6c0"),BT3([x,y,-H+.04])]));
    L.push([G3B.box(.35,1.6,.06,"#e2573b"),BT3([-.12,1.95,-H+.09])],[G3B.box(.35,1.6,.06,"#e2573b"),BT3([2.12,1.95,-H+.09])],[G3B.box(2.7,.06,.06,"#8a5a3a"),BT3([1,2.78,-H+.1])]);
    L.push([G3B.box(.06,2.1,1.05,"#a87444"),BT3([-H+.03,1.05,2.1])],[G3B.box(.04,1.9,.85,"#c08a56"),BT3([-H+.06,1.05,2.1])],[G3B.sphere(.05,6,"#ffd23f"),BT3([-H+.1,1.05,1.75])],[G3B.box(.08,.08,1.15,"#fff"),BT3([-H+.05,2.12,2.1])]);
    R.room=E.mesh(G3B.merge(L));R.light();R.dirty=true};
  R.build();
  R.tile=(i,j)=>[i-BS_N/2+.5,0,j-BS_N/2+.5];
  // posición y giro de un objeto de pared
  R.wpos=(w,p,h,F)=>{const off=F&&F.w2?.5:0,y=h?2.25:1.3;return w===-1?{p:[p-BS_N/2+.5+off,y,-BS_N/2+.02],r:0,Rv:[1,0,0]}:{p:[-BS_N/2+.02,y,p-BS_N/2+.5+off],r:Math.PI/2,Rv:[0,0,-1]}};
  const drawItem=(x,ix,ghost)=>{const F=BS_F[x[0]];if(!F)return;const sel=ix===R.sel,night=!!R.data.nt,tint=ghost?(ghost.ok?[.7,1.3,.7]:[1.4,.5,.5]):sel?[1.25,1.25,1.1]:null,glow=ghost?.3:(F.glow?(night?Math.min(1,F.glow+.5):F.glow):0),al=ghost?.6:null;
    let pos,ry;if(bsIsW(x)){const W=R.wpos(x[1],x[2],x[3],F);pos=W.p;ry=W.r;E.draw(mk(x[0]),BT3(pos,[0,ry,0]),tint,glow,al);
        if(F.paint&&!ghost){const t=R.tex[F.paint]||(R.tex[F.paint]=PM[F.paint]?E.tex(mgImgSrc(PM[F.paint])):null);const W2=R.wpos(x[1],x[2],x[3],F),c=x[1]===-1?[W2.p[0],W2.p[1]-.3,W2.p[2]+.08]:[W2.p[0]+.08,W2.p[1]-.3,W2.p[2]];if(t)E.sprite(t,c,.6,null,false,W2.Rv,[0,1,0])}}
    else{const big=F.big,p=R.tile(x[1]+(big?.5:0),x[2]+(big?.5:0)),y=ghost?ghost.y||0:bsSurfH(R.data.it||[],x);pos=[p[0],y,p[2]];ry=(x[3]|0)*Math.PI/2;
      if(!F.flat&&!ghost&&!x[4])E.draw(SH,BT3([p[0],.012,p[2]],[0,0,0],[.95,1,.95]),[0,0,0],0,.22);
      E.draw(mk(x[0]),BT3(pos,[0,ry,0]),tint,glow,al);
      if(F.plush&&!ghost){const n=F.plush;const t=R.tex[n]||(R.tex[n]=PM[n]?E.tex(mgImgSrc(PM[n])):null);if(t)E.sprite(t,[p[0],y+.12,p[2]],.7)}}
    if(sel&&!ghost){const bob=Math.sin((performance.now()-R.t0)/250)*.08,top=bsIsW(x)?pos[1]+.6:pos[1]+(F.h||.5)+.9;const ap=bsIsW(x)?(x[1]===-1?[pos[0],top+bob,pos[2]+.4]:[pos[0]+.4,top+bob,pos[2]]):[pos[0],top+bob,pos[2]];E.draw(ARW,BT3(ap),null,.6)}};
  R.render=()=>{if(!R.alive)return;const cx=Math.sin(R.yaw)*Math.cos(R.pitch)*R.dist,cz=Math.cos(R.yaw)*Math.cos(R.pitch)*R.dist,cy=Math.sin(R.pitch)*R.dist;
    E.camera([cx,cy+.2,cz+.6],[0,.35,.6],.78);E.begin();E.draw(R.room);
    const it=R.data.it||[];it.forEach((x,ix)=>{if(BS_F[x[0]]&&BS_F[x[0]].flat)drawItem(x,ix)});it.forEach((x,ix)=>{if(BS_F[x[0]]&&!BS_F[x[0]].flat)drawItem(x,ix)});
    if(R.hover&&R.hand){const F=BS_F[R.hand.k],h=R.hover;if(F.wall)drawItem([R.hand.k,h.w,h.p,h.h],-2,{ok:h.ok});else drawItem([R.hand.k,h.i,h.j,R.hand.r|0],-2,{ok:h.ok,y:h.y||0})}
    R.dirty=false};
  const loop=()=>{if(!R.alive)return;if(R.dirty||R.sel>=0||Object.values(R.tex).some(t=>t&&!t.ok&&!t.bad))R.render();R.raf=requestAnimationFrame(loop)};R.raf=requestAnimationFrame(loop);
  // giro con el ratón o el dedo, zoom con la rueda o pellizco
  let drag=null,moved=0,pinch=null;const pts=new Map();
  cv.addEventListener("pointerdown",e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const a=[...pts.values()];pinch={d:Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]),z:R.dist}}else{drag=[e.clientX,e.clientY,R.yaw,R.pitch];moved=0}try{cv.setPointerCapture(e.pointerId)}catch(x){}});
  cv.addEventListener("pointermove",e=>{if(pts.has(e.pointerId))pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pinch&&pts.size===2){const a=[...pts.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);R.dist=Math.max(6,Math.min(17,pinch.z*pinch.d/Math.max(20,d)));R.dirty=true;return}
    if(drag){const dx=e.clientX-drag[0],dy=e.clientY-drag[1];moved=Math.max(moved,Math.abs(dx)+Math.abs(dy));if(moved>6){R.yaw=Math.max(.08,Math.min(1.5,drag[2]-dx*.008));R.pitch=Math.max(.25,Math.min(1.25,drag[3]+dy*.006));R.dirty=true}}
    else if(opt&&opt.hover)opt.hover(e.clientX,e.clientY)});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;if(drag&&moved<=6&&opt&&opt.tap)opt.tap(e.clientX,e.clientY);drag=null};
  cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",e=>{pts.delete(e.pointerId);drag=null;pinch=null});
  cv.addEventListener("wheel",e=>{e.preventDefault();R.zoom(Math.sign(e.deltaY)*.8)},{passive:false});
  R.zoom=d=>{R.dist=Math.max(6,Math.min(17,R.dist+d));R.dirty=true};R.reset=()=>{R.yaw=.78;R.pitch=.62;R.dist=11.2;R.dirty=true};
  // lo que hay bajo el puntero: casilla del suelo o hueco de una pared (proyectando sus esquinas)
  const inq=(q,px,py)=>{let c=false;for(let a=0,b=3;a<4;b=a++){const[xa,ya]=q[a],[xb,yb]=q[b];if((ya>py)!==(yb>py)&&px<(xb-xa)*(py-ya)/(yb-ya)+xa)c=!c}return c};
  const loc=(cx0,cy0)=>{const r=cv.getBoundingClientRect();return[cx0-r.left,cy0-r.top]};
  R.pick=(cx0,cy0)=>{const[px,py]=loc(cx0,cy0);for(let i=0;i<BS_N;i++)for(let j=0;j<BS_N;j++){const x=i-BS_N/2,z=j-BS_N/2,q=[[x,0,z],[x+1,0,z],[x+1,0,z+1],[x,0,z+1]].map(v=>E.toScreen(v));if(q.some(v=>!v))continue;if(inq(q,px,py))return{i,j}}return null};
  R.pickWall=(cx0,cy0)=>{const[px,py]=loc(cx0,cy0),H=BS_N/2;for(const w of [-1,-2])for(let p=0;p<BS_N;p++)for(const h of [0,1]){const y0=h?1.78:.82,y1=h?2.75:1.78,a=p-H,b=p-H+1;
      const q=(w===-1?[[a,y0,-H],[b,y0,-H],[b,y1,-H],[a,y1,-H]]:[[-H,y0,a],[-H,y0,b],[-H,y1,b],[-H,y1,a]]).map(v=>E.toScreen(v));if(q.some(v=>!v))continue;if(inq(q,px,py))return{w,p,h}}return null};
  R.fit=()=>{const r=cv.getBoundingClientRect();if(r.width>0){E.resize(r.width,r.height,Math.min(document.body.classList.contains("lite")?1:1.5,window.devicePixelRatio||1));R.dirty=true}};
  try{R.ro=new ResizeObserver(R.fit);R.ro.observe(cv)}catch(e){}R.fit();
  R.free=()=>{R.alive=false;cancelAnimationFrame(R.raf);try{R.ro&&R.ro.disconnect()}catch(e){}E.free()};
  return R}
// ---------- tu base ----------
let SBASE3=null;
v8Tab("trn","baseP","Base secreta","🏠 Base secreta","Tu propia habitación en 3D: decórala con muebles, objetos de pared, peluches y los trofeos que ganes jugando. Publícala para que otros entrenadores la visiten y te dejen un «me gusta».",()=>bsUI());
// a dónde iría el objeto en la mano bajo el puntero
function bsAim(cx,cy){const R=SBASE3;if(!R||!R.hand)return null;const s=hbSt(),k=R.hand.k,F=BS_F[k],ig=R.hand.from==null?-1:R.hand.from;
  if(F.wall){const w=R.pickWall(cx,cy);if(!w)return null;return Object.assign(w,{ok:bsCanWall(s.it,k,w.w,w.p,w.h,ig)})}
  const t=R.pick(cx,cy);if(!t)return null;const c=bsCanFloor(s.it,k,t.i,t.j,ig);let y=0;if(c.top){const b=bsBase(s.it,t.i,t.j,ig);y=b>=0?BS_F[s.it[b][0]].surf:0}return{i:t.i,j:t.j,ok:c.ok,top:!!c.top,y}}
function bsUI(){const b=$("basePB");if(!b)return;const s=hbSt(),tab=NX.bsTab||"f";
  if(!b.querySelector("#bsCv")){b.innerHTML='<div class="bswrap"><canvas id="bsCv" tabindex="0"></canvas><div class="bshint" id="bsHint"></div><div class="bstools" id="bsTools"></div><div class="bscam"><button type="button" data-bsa="zin" aria-label="Acercar">＋</button><button type="button" data-bsa="zout" aria-label="Alejar">－</button><button type="button" data-bsa="view" aria-label="Vista inicial">⟲</button><button type="button" data-bsa="night" aria-label="Día o noche">'+(s.nt?"☀️":"🌙")+'</button></div></div><div class="bstabs" id="bsTabs"></div><div id="bsBody"></div>';
    if(SBASE3){SBASE3.free();SBASE3=null}
    SBASE3=bsRoom($("bsCv"),s,{tap:bsTap,hover:(cx,cy)=>{const R=SBASE3;if(!R||!R.hand)return;const h=bsAim(cx,cy);if(JSON.stringify(h)!==JSON.stringify(R.hover)){R.hover=h;R.dirty=true}}});
    if(!SBASE3){$("bsCv").replaceWith(Object.assign(document.createElement("p"),{className:"mut",textContent:"Tu navegador no puede mostrar gráficos 3D, así que la base secreta no está disponible aquí."}))}}
  if(SBASE3)SBASE3.data=s;
  $("bsTabs").innerHTML=[["f","🛋️ Muebles"],["w","🖼️ Pared"],["p","🧸 Peluches"],["t","🏆 Trofeos"],["s","🎨 Estilo"],["v","👥 Visitar"]].map(t=>'<button class="'+(t[0]===tab?'on':'')+'" data-bst="'+t[0]+'">'+t[1]+'</button>').join("");
  bsTools();bsBody()}
function bsTools(){const el=$("bsTools"),h=$("bsHint");if(!el)return;const s=hbSt(),R=SBASE3;
  if(R&&R.hand){const F=BS_F[R.hand.k];el.innerHTML='<span>'+F.ic+' Colocando: <b>'+esc(F.n)+'</b></span>'+(F.wall?'':'<button class="alt" data-bsa="rotl" aria-label="Girar a la izquierda">↺</button><button class="alt" data-bsa="rot" aria-label="Girar a la derecha">↻</button>')+'<button class="alt" data-bsa="cancel">✕ Cancelar</button>';
    h.textContent=F.wall?"Toca un hueco libre de una pared (abajo o arriba) para colgarlo.":F.small?"Toca una casilla del suelo, o una mesa, mesita, cómoda o baúl para ponerlo encima. R: girar.":"Toca una casilla libre del suelo para colocarlo. R: girar · Esc: cancelar."}
  else if(R&&R.sel>=0&&s.it[R.sel]){const x=s.it[R.sel],F=BS_F[x[0]];el.innerHTML='<span>'+F.ic+' <b>'+esc(F.n)+'</b></span>'+(bsIsW(x)?'':'<button class="alt" data-bsa="srotl" aria-label="Girar a la izquierda">↺</button><button class="alt" data-bsa="srot" aria-label="Girar a la derecha">↻</button>')+'<button class="alt" data-bsa="move">✋ Mover</button><button class="alt" data-bsa="del">🗑️ Guardar</button><button class="alt" data-bsa="unsel">✓</button>';h.textContent="R: girar · M: mover · Supr: guardar · Esc: listo"}
  else{el.innerHTML='<span class="mut">'+s.it.length+'/64 objetos</span><button class="'+(S.basePub?'alt':'red')+'" data-bsa="pub">'+(S.basePub?'🔄 Actualizar publicación':'📢 Publicar mi base')+'</button>'+(S.basePub?'<button class="alt" data-bsa="unpub">🙈 Dejar de publicar</button>':'');h.textContent="Arrastra para girar la cámara · rueda, pellizco o ＋/－ para acercar · toca un objeto para girarlo, moverlo o guardarlo"}}
function bsBody(){const el=$("bsBody");if(!el)return;const s=hbSt(),tab=NX.bsTab||"f";
  if(tab==="s"){el.innerHTML='<h3 class="shh">Paredes</h3><div class="bsstyle">'+Object.keys(BS_WALL).map(k=>{const W=BS_WALL[k];return '<button class="'+(s.w===k?'on':'')+'" data-bsw="'+k+'"><i style="background:'+(W[2]?'repeating-linear-gradient(90deg,'+W[1]+' 0 6px,'+W[3]+' 6px 12px)':W[1])+'"></i>'+W[0]+'</button>'}).join("")+'</div><h3 class="shh">Suelo</h3><div class="bsstyle">'+Object.keys(BS_FLOOR).map(k=>'<button class="'+(s.f===k?'on':'')+'" data-bsf="'+k+'"><i style="background:linear-gradient(135deg,'+BS_FLOOR[k][1]+' 50%,'+BS_FLOOR[k][2]+' 50%)"></i>'+BS_FLOOR[k][0]+'</button>').join("")+'</div>';return}
  if(tab==="v"){el.innerHTML='<div id="bsVis"><small class="mut">Cargando bases…</small></div>';bsVisList();return}
  const keys=Object.keys(BS_F).filter(k=>{const F=BS_F[k];return tab==="p"?F.plush:tab==="t"?F.free:tab==="w"?F.wall&&!F.free:!F.plush&&!F.free&&!F.wall});
  el.innerHTML=(tab==="f"?'<p class="mut bsnote">🪔 Los objetos pequeños (lamparita, cactus, jarrón, radio, trofeos…) también se pueden poner encima de mesas, mesitas, cómodas y baúles.</p>':tab==="w"?'<p class="mut bsnote">Cada pared tiene huecos abajo y arriba. La ventana y la puerta no se pueden tapar.</p>':'')+
    '<div class="bsgrid">'+keys.map(k=>{const F=BS_F[k],own=bsOwn(k),used=bsUsed(k),left=own-used;
    return '<div class="bsit"><span class="bsic">'+((F.plush||F.paint)&&PM[F.plush||F.paint]?icoHD(PM[F.plush||F.paint],48,false,false):F.ic)+'</span><b>'+esc(F.n)+'</b>'+(F.small?'<small class="bstag">pequeño</small>':F.surf?'<small class="bstag">superficie</small>':F.w2?'<small class="bstag">2 huecos</small>':'')+(F.free?(own?'<small>'+(left>0?'✅ Disponible':'Colocado')+'</small>':'<small class="mut">🔒 '+esc(F.why)+'</small>'):'<small>Tienes '+own+(used?' · '+used+' colocado'+(used>1?'s':''):'')+'</small>')+
      '<div class="bsbtn">'+(left>0?'<button class="red" data-bsput="'+k+'">Colocar</button>':'')+(!F.free?'<button class="alt" data-bsbuy="'+k+'"'+(S.t<F.price()?' disabled':'')+'>Comprar · '+fmt(F.price())+' 🎟️</button>':'')+'</div></div>'}).join("")+'</div>'}
function bsPlace(cx,cy){const R=SBASE3,s=hbSt();const a=bsAim(cx,cy);if(!a)return;if(!a.ok){snd("miss");toast(BS_F[R.hand.k].wall?"Ese hueco de la pared está ocupado.":"Ahí no cabe.");return}
  if(R.hand.from==null&&s.it.length>=64){toast("Tu base ya tiene 64 objetos: guarda alguno antes.");return}
  const k=R.hand.k,F=BS_F[k],rec=F.wall?[k,a.w,a.p,a.h]:[k,a.i,a.j,R.hand.r|0].concat(a.top?[1]:[]);
  if(R.hand.from!=null&&s.it[R.hand.from]){const old=s.it[R.hand.from];s.it[R.hand.from]=rec;
    // al mover una mesa, lo que tenía encima se va con ella
    if(!F.wall&&F.surf&&!bsIsW(old)){const ti=s.it.findIndex(x=>!bsIsW(x)&&x[4]&&x[1]===old[1]&&x[2]===old[2]);if(ti>=0){s.it[ti][1]=a.i;s.it[ti][2]=a.j}}}
  else s.it.push(rec);
  snd("pop");R.hand=null;R.hover=null;R.sel=-1;R.dirty=true;save();bsTools();bsBody()}
function bsTap(cx,cy){const R=SBASE3;if(!R)return;const s=hbSt();if(R.hand){bsPlace(cx,cy);return}
  // primero las paredes, luego lo de encima de las mesas, luego los muebles y por último las alfombras
  const w=R.pickWall(cx,cy);let ix=-1;if(w)ix=s.it.findIndex(x=>x[1]===w.w&&x[3]===w.h&&(x[2]===w.p||(BS_F[x[0]]&&BS_F[x[0]].w2&&x[2]+1===w.p)));
  if(ix<0){const t=R.pick(cx,cy);if(t){ix=bsTop(s.it,t.i,t.j,-1);if(ix<0)ix=bsBase(s.it,t.i,t.j,-1);if(ix<0)ix=s.it.findIndex(x=>!bsIsW(x)&&BS_F[x[0]]&&BS_F[x[0]].flat&&t.i>=x[1]&&t.i<=x[1]+(BS_F[x[0]].big?1:0)&&t.j>=x[2]&&t.j<=x[2]+(BS_F[x[0]].big?1:0))}}
  R.sel=ix;R.dirty=true;if(ix>=0)snd("ui");bsTools()}
function bsAct(a){const R=SBASE3,s=hbSt();if(!R)return;const x=s.it[R.sel];
  if(a==="rot"||a==="rotl"){if(R.hand){R.hand.r=((R.hand.r|0)+(a==="rot"?1:3))%4;R.dirty=true;snd("ui")}}
  else if(a==="cancel"){R.hand=null;R.hover=null;R.dirty=true}
  else if((a==="srot"||a==="srotl")&&x&&!bsIsW(x)){x[3]=((x[3]|0)+(a==="srot"?1:3))%4;save();R.dirty=true;snd("ui")}
  else if(a==="move"&&x){R.hand={k:x[0],r:x[3]|0,from:R.sel};R.sel=-1;R.dirty=true}
  else if(a==="del"&&x){const F=BS_F[x[0]];s.it.splice(R.sel,1);
    // si era una mesa con algo encima, eso baja al suelo si cabe (si no, se guarda)
    if(F&&F.surf&&!bsIsW(x)){const ti=s.it.findIndex(y=>!bsIsW(y)&&y[4]&&y[1]===x[1]&&y[2]===x[2]);if(ti>=0){if(bsBase(s.it,x[1],x[2],ti)<0)s.it[ti].length=4;else s.it.splice(ti,1)}}
    R.sel=-1;save();R.dirty=true;bsBody();snd("ui")}
  else if(a==="unsel"){R.sel=-1;R.dirty=true}
  else if(a==="zin")R.zoom(-1.2);else if(a==="zout")R.zoom(1.2);else if(a==="view")R.reset();
  else if(a==="night"){s.nt=s.nt?0:1;save();R.data=s;R.build();const nb=document.querySelector('#basePB [data-bsa="night"]');if(nb)nb.textContent=s.nt?"☀️":"🌙";snd("ui")}
  bsTools()}
document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("#basePB [data-bst],#basePB [data-bsa],#basePB [data-bsput],#basePB [data-bsbuy],#basePB [data-bsw],#basePB [data-bsf],#basePB [data-bsvis]");if(!t)return;const s=hbSt();snd("ui");
  if(t.dataset.bst){NX.bsTab=t.dataset.bst;bsUI();return}
  if(t.dataset.bsw){s.w=t.dataset.bsw;save();if(SBASE3)SBASE3.build();bsBody();return}
  if(t.dataset.bsf){s.f=t.dataset.bsf;save();if(SBASE3)SBASE3.build();bsBody();return}
  if(t.dataset.bsput){if(!SBASE3)return;SBASE3.sel=-1;SBASE3.hand={k:t.dataset.bsput,r:0};SBASE3.dirty=true;bsTools();try{$("bsCv").scrollIntoView({behavior:"smooth",block:"center"})}catch(x){}return}
  if(t.dataset.bsbuy){const k=t.dataset.bsbuy,F=BS_F[k];if(!F||F.free)return;const p=F.price();if(S.t<p){toast("No tienes tickets suficientes.");return}S.t-=p;s.inv[k]=(s.inv[k]|0)+1;qEv("buy",1);save();render();snd("lvl");toast("🏠 ¡Has comprado: "+F.n+"!");bsBody();return}
  if(t.dataset.bsvis){bsVisit(t.dataset.bsvis);return}
  const a=t.dataset.bsa;if(!a)return;
  if(a==="pub"){if(!(window.FB&&window.FB.baseSet&&v8Uid())){toast("Para publicar tu base necesitas una cuenta.");return}
    try{await window.FB.baseSet({n:v8Nick().slice(0,30),tr:trEnc(myLook()),w:s.w,f:s.f,it:s.it.slice(0,64).map(x=>x.join(","))});S.basePub=1;save();toast("📢 ¡Base publicada! Ya pueden visitarla.")}catch(x){toast("No se ha podido publicar ahora.")}bsTools();return}
  if(a==="unpub"){try{await window.FB.baseOff();S.basePub=0;save();toast("Tu base ya no es pública.")}catch(x){toast("No se ha podido cambiar ahora.")}bsTools();return}
  bsAct(a)});
// teclado: R girar (Mayús+R al otro lado), M mover, Supr guardar, Esc cancelar
document.addEventListener("keydown",e=>{if(!SBASE3||!nxOpen("baseP"))return;const tg=e.target;if(tg&&tg.closest&&tg.closest("input,textarea,select"))return;const R=SBASE3,k=e.key.toLowerCase();
  if(k==="r"){bsAct(R.hand?(e.shiftKey?"rotl":"rot"):(e.shiftKey?"srotl":"srot"));e.preventDefault()}
  else if(k==="m"&&R.sel>=0){bsAct("move");e.preventDefault()}
  else if((k==="delete"||k==="backspace")&&R.sel>=0){bsAct("del");e.preventDefault()}
  else if(k==="escape"&&(R.hand||R.sel>=0)){bsAct(R.hand?"cancel":"unsel");e.preventDefault();e.stopPropagation()}},true);
// al cerrar el panel se libera la tarjeta gráfica
setInterval(()=>{try{if(SBASE3&&!nxOpen("baseP")){SBASE3.free();SBASE3=null;const c=$("bsCv");if(c&&c.closest("#basePB"))$("basePB").innerHTML=""}}catch(e){}},2000);
// ---------- visitas ----------
async function bsVisList(){const box=$("bsVis");if(!box)return;if(!(window.FB&&window.FB.baseRecent)){box.innerHTML='<small class="mut">Para visitar bases necesitas una cuenta.</small>';return}
  let L=[];try{L=await window.FB.baseRecent()}catch(e){box.innerHTML='<small class="mut">No se han podido cargar.</small>';return}const me=v8Uid();
  const fr=L.filter(x=>isFriend(x.u)),ot=L.filter(x=>!isFriend(x.u)&&x.u!==me),row=x=>'<button class="bsvis" data-bsvis="'+esc(x.u)+'"><span class="bsvav">'+trImg(trDec(x.tr),"f","i")+'</span><b>'+esc(pvClean(x.n||"Entrenador"))+'</b><small>'+((x.it||[]).length)+' objetos</small></button>';
  box.innerHTML=(fr.length?'<h3 class="shh">👥 Tus amigos</h3><div class="bsvl">'+fr.map(row).join("")+'</div>':'<p class="mut">Ninguno de tus amigos ha publicado su base todavía.</p>')+(ot.length?'<h3 class="shh">🌍 Bases recientes</h3><div class="bsvl">'+ot.map(row).join("")+'</div>':'')}
// objetos de una base publicada (se comprueba todo: viene de otro jugador)
function bsParse(L){const out=[];(Array.isArray(L)?L:[]).slice(0,64).forEach(s=>{const a=String(s).split(",");const k=a[0],F=BS_F[k];if(!F)return;const n=a.slice(1).map(v=>parseInt(v,10)|0);
  if(F.wall){if((n[0]===-1||n[0]===-2)&&bsCanWall(out,k,n[0],n[1],n[2],-1))out.push([k,n[0],n[1],n[2]])}
  else{const c=bsCanFloor(out,k,n[0],n[1],-1);if(c.ok)out.push([k,n[0],n[1],((n[2]%4)+4)%4].concat(c.top?[1]:[]))}});return out}
async function bsVisit(u){if(!(window.FB&&window.FB.baseGet))return;let d=null;try{d=await window.FB.baseGet(u)}catch(e){}if(!d){toast("Esa base ya no está publicada.");return}
  const data={w:BS_WALL[d.w]?d.w:"cr",f:BS_FLOOR[d.f]?d.f:"wd",it:bsParse(d.it),nt:0};
  nxModal('<h3>🏠 Base de '+esc(pvClean(d.n||"Entrenador"))+'</h3><div class="bswrap bsvisw"><canvas id="bsVCv"></canvas><div class="bscam"><button type="button" id="bsVN" aria-label="Día o noche">🌙</button></div></div><div class="mgbtns"><button class="red" id="bsLk" disabled>❤️ …</button><button class="alt" id="bsVX">Cerrar</button></div><small class="mut">Arrastra para girar la cámara.</small>');
  const R=bsRoom($("bsVCv"),data,{});const close=()=>{if(R)R.free();nxModalClose()};$("bsVX").onclick=close;
  const vn=$("bsVN");if(vn&&R)vn.onclick=()=>{data.nt=data.nt?0:1;R.build();vn.textContent=data.nt?"☀️":"🌙"};
  const me=v8Uid(),lk=$("bsLk");let liked=false,n=0;try{[liked,n]=await Promise.all([window.FB.baseLiked(u),window.FB.baseLikes(u)])}catch(e){}
  const paint=()=>{if(!lk)return;lk.disabled=u===me;lk.textContent=(liked?"💖 Te gusta":"🤍 Me gusta")+" · "+n};paint();
  if(lk)lk.onclick=async()=>{if(u===me)return;lk.disabled=true;try{await window.FB.baseLike(u,!liked);liked=!liked;n+=liked?1:-1;snd(liked?"lvl":"ui")}catch(e){toast("No se ha podido ahora.")}paint()};
  const iv=setInterval(()=>{const m=$("nxM");if(!m||m.hidden||!m.querySelector("#bsVCv")){clearInterval(iv);if(R&&R.alive)R.free()}},1000)}
// botón «Visitar base» en los perfiles
{const _op=openProf;openProf=async function(uid,dIn,tgt){const r=await _op.apply(this,arguments);try{if(!dIn&&uid&&uid!==v8Uid()){const box=tgt||$("profB");const row=box&&box.querySelector(".jrow");const bt=document.createElement("button");bt.className="alt";bt.textContent="🏠 Visitar su base";bt.onclick=()=>bsVisit(uid);if(row)row.prepend(bt);else if(box)box.appendChild(bt)}}catch(e){}return r}}
