// =====================================================================================
// VERSIÓN 8.0 (2/4): Mercader misterioso, Rival personal, Investigaciones del Profesor y Concursos Pokémon
// =====================================================================================
const v8Tsrc=k=>TSPR+k+".png";
const v8Pick=(r,a)=>a[Math.floor(r()*a.length)];
// equipo rival a partir de una lista de nombres, al nivel indicado (con naturaleza y, a veces, objeto)
function v8Team(names,lv,r){return names.filter(n=>PM[n]).map((n,i)=>monX(mkEnemy(PM[n],clampL(lv+(i===names.length-1?1:0))),Math.floor((r?r():Math.random())*NAT.length),(r?r():Math.random())<.35?HOLD[Math.floor((r?r():Math.random())*HOLD.length)][0]:""))}
const v8Pool=(rar,r,not)=>{const L=P.filter(p=>p[2]===rar&&v8Base(p)&&!(not||[]).includes(p[0]));return L.length?v8Pick(r,L)[0]:null};

// ================= MERCADER MISTERIOSO =================
// Llega 3 veces al día (hora de España, igual para todos) y se queda 30 minutos con 4 ofertas que cambian en cada visita.
// El servidor usa el mismo horario para avisar en Discord (_server/discord.js → mercader).
const MER_D=30*60e3;
// hora de España → momento exacto (teniendo en cuenta el horario de verano)
function v8MadTs(y,m,d,h,mi){const base=Date.UTC(y,m-1,d,h,mi);for(const off of [60,120]){const t=base-off*6e4,q=v8Mad(t);if(q.h===h&&q.mi===mi&&q.d===d)return t}return base-60*6e4}
// visitas de un día: 3 inicios entre las 10:00 y las 23:00, separados al menos 2 horas
const MER_C={};
function merSlots(day){if(MER_C[day])return MER_C[day];return MER_C[day]=merSlots0(day)}
function merSlots0(day){const[y,m,d]=day.split("-").map(Number),r=v8Rng("mer|"+day),out=[];let tries=0;
  while(out.length<3&&tries++<60){const mi=600+Math.floor(r()*26)*30;if(out.every(x=>Math.abs(x-mi)>=120))out.push(mi)}
  return out.sort((a,b)=>a-b).map((mi,i)=>{const a=v8MadTs(y,m,d,Math.floor(mi/60),mi%60);return{id:day+"_"+i,a,b:a+MER_D}})}
function merNow(t){t=t||Date.now();for(const off of [0,-864e5]){const s=merSlots(v8Day(t+off)).find(x=>t>=x.a&&t<x.b);if(s)return s}return null}
function merNext(t){t=t||Date.now();for(const off of [0,864e5,2*864e5]){const s=merSlots(v8Day(t+off)).find(x=>x.a>t);if(s)return s}return null}
// (8.6.5) precios de verdad: los objetos, con descuento sobre el precio de la tienda; los Pokémon y el huevo, con descuento
// sobre lo que costaría sacarlos en el gacha con tus tiradas de ahora (un Épico sale de media 1 de cada 25 tiradas).
// ref = precio normal (se ve tachado) · price = precio del mercader
const merShopP=id=>{const a=(typeof ITEMS!=="undefined"&&ITEMS.find(i=>i[0]===id))||(typeof HOLD!=="undefined"&&HOLD.find(i=>i[0]===id));return a&&+a[2]>0?+a[2]:id==="crys"?5e6:2e6};
const merItRef=it=>Object.keys(it).reduce((a,k)=>a+merShopP(k)*it[k],0);
const merPull=()=>{try{return Math.max(1,cost(1,false))}catch(e){return 1000}};
function merOffers(w){const r=v8Rng("merof|"+w.id),out=[],pc=merPull(),off=(ref,d)=>({ref:Math.round(ref),price:Math.max(1,Math.round(ref*(1-d))),pct:Math.round(d*100)});
  // 1) Pokémon: a veces legendario (1 de cada 10 visitas), y variocolor 1 de cada 5 · 75 % menos que en el gacha
  const leg=r()<.1,pk=(leg&&v8Pool("L",r))||v8Pool("E",r)||v8Pool("R",r),rar=PM[pk]?PM[pk][2]:"E",sh=r()<.2,pref=pc*(rar==="L"?100:rar==="E"?25:5)*(sh?8:1);
  out.push(Object.assign({k:"mon",n:pk,sh,ic:"🌟",t:(sh?"✨ ":"")+pk+(sh?" variocolor":""),d:(rar==="L"?"¡Un Pokémon legendario":"Un Pokémon poco común")+(sh?" y brillante":"")+" a tu nivel! En el gacha te costaría unas "+fmt(Math.round(pref/pc))+" tiradas."},off(pref,.75)));
  // 2) lote de objetos, grande · 65 % menos que en la tienda
  const bundles=[{cand:10,ub:20},{mb:2,ub:10},{ppmax:5,cand:5},{crys:3,ub:15},{sb:40,ub:20,cand:4},{mb:1,cand:5,crys:1}],bd=v8Pick(r,bundles);
  out.push(Object.assign({k:"it",it:bd,ic:"🎁",t:"Lote de objetos",d:Object.keys(bd).map(k=>bd[k]+" "+IN2(k)).join(" + ")},off(merItRef(bd),.65)));
  // 3) huevo especial (variocolor 1 de cada 20) · 75 % menos
  const eg=v8Pool("E",r,[pk])||v8Pool("R",r);out.push(Object.assign({k:"egg",n:eg,ic:"🥚",t:"Huevo especial",d:"¿Qué saldrá? Un Pokémon poco común (y 1 de cada 20, variocolor). Eclosiona con unos combates."},off(pc*15,.75)));
  // 4) Master Ball (en la mitad de las visitas; a veces 2) o un objeto equipable · 70 % menos que en la tienda
  if(r()<.5){const n=r()<.3?2:1;out.push(Object.assign({k:"it",it:{mb:n},ic:"🟣",t:n>1?"2 Master Ball":"Master Ball",d:"La Poké Ball definitiva: nunca falla. ¡A precio de ganga!"},off(merItRef({mb:n}),.7)))}
  else{const h=v8Pick(r,HOLD)[0];out.push(Object.assign({k:"it",it:{[h]:1},ic:"💼",t:IN2(h),d:"Objeto equipable difícil de encontrar."},off(merItRef({[h]:1}),.7)))}
  return out}
const merSt=w=>{S.mer=S.mer&&S.mer.w===w.id?S.mer:{w:w.id,b:{}};return S.mer};
v8Tab("act","merP","🧳 Mercader","🧳 Mercader misterioso","Llega al pueblo 3 veces al día y se queda solo 30 minutos con ofertas que no verás en ninguna tienda. ¡Te avisamos en el juego y en Discord!",()=>merUI(),0);
const merHM=t=>new Date(t).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Madrid"});
function merUI(){const b=$("merPB");if(!b)return;const w=merNow();
  if(!w){const n=merNext(),today=merSlots(v8Day());b.innerHTML='<div class="merwait"><div class="merbig">🧳</div><b>El mercader no está ahora mismo.</b>'+(n?'<p>Volverá a las <b>'+merHM(n.a)+'</b> (hora de España) — dentro de '+H2((n.a-Date.now())/1000)+'.</p>':'')+
    '<small class="mut">Visitas de hoy: '+today.map(s=>merHM(s.a)).join(" · ")+'. Cada visita dura 30 minutos.</small></div>';return}
  const st=merSt(w),L=merOffers(w),left=w.b-Date.now();
  b.innerHTML='<div class="merhd"><span class="merbig">🧳</span><div><b>¡El mercader está en el pueblo!</b><small>Se va en <b id="merLeft">'+H2(left/1000)+'</b>. Cada oferta se puede comprar una vez.</small></div></div>'+
    '<div class="mergrid">'+L.map((o,i)=>{const got=st.b[i],can=S.t>=v8Disc(o.price)&&!got&&!(o.k==="egg"&&(S.eggs||[]).length>=6);
      return '<div class="merc'+(got?' got':'')+'"><span class="meric">'+(o.n&&PM[o.n]?icoHD(PM[o.n],72,false,!!o.sh):'<span class="merem">'+o.ic+'</span>')+'</span><b>'+esc(o.t)+'</b><small>'+esc(o.d)+'</small>'+
        (got?'<span class="skon">✓ Comprado</span>':'<span class="merpct">−'+Math.round((1-v8Disc(o.price)/o.ref)*100)+' %</span><small class="merref">Precio normal: <s>'+fmt(o.ref)+' 🎟️</s></small><button class="red" data-merb="'+i+'"'+(can?'':' disabled')+'>'+fmt(v8Disc(o.price))+' 🎟️</button>')+(o.k==="egg"&&(S.eggs||[]).length>=6&&!got?'<small class="mut">Ya llevas 6 huevos.</small>':'')+'</div>'}).join("")+'</div>'}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#merPB [data-merb]");if(!t)return;const w=merNow();if(!w){merUI();return}
  const st=merSt(w),i=+t.dataset.merb,o=merOffers(w)[i];if(!o||st.b[i]||S.t<v8Disc(o.price))return;if(o.k==="egg"&&(S.eggs||[]).length>=6){toast("Ya llevas 6 huevos.");return}
  S.t-=v8Disc(o.price);st.b[i]=1;qEv("buy",1);
  if(o.k==="mon"){const lv=clampL(Math.max(5,leadLevel()-2));giveMon(o.n,lv,o.sh);toast("🧳 ¡"+o.t+" se une a tu equipo!");if(o.sh)diaryAdd("🧳","Has comprado un "+o.n+" variocolor al mercader misterioso.",o.n,1,"pk")}
  else if(o.k==="egg"){const sp=eggBase(o.n);S.eggs=S.eggs||[];S.eggs.push({s:sp,st:0,need:Math.max(2,eggNeed(sp)-2),at:Date.now(),sh:Math.random()<1/20?1:0,nt:Math.floor(Math.random()*NAT.length),mer:1});toast("🥚 ¡Huevo especial! Llévalo contigo en los combates para que eclosione.")}
  else{Object.keys(o.it).forEach(k=>{S.bag[k]=(S.bag[k]||0)+o.it[k]});toast("🧳 Has comprado: "+o.d)}
  snd("lvl");save();render();merUI()});
// aviso al llegar (una vez por visita) y botón en la pantalla principal mientras está
let _merSeen="";
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.owned)return;const w=merNow();const el=$("merLeft");if(el&&w)el.textContent=H2((w.b-Date.now())/1000);
  let bt=$("gMer");const side=$("gSideL");
  if(w&&side){if(!bt){bt=document.createElement("button");bt.id="gMer";bt.type="button";bt.style.setProperty("--c","#b07a2a");bt.innerHTML='<span class="gsi"><span class="mersi">🧳</span></span><b>Mercader</b>';bt.onclick=()=>{snd("ui");hubOpen("act","merP")};side.appendChild(bt)}}
  else if(bt)bt.remove();
  if(w&&_merSeen!==w.id&&S.merSeen!==w.id&&(typeof evpFree!=="function"||evpFree())){_merSeen=w.id;S.merSeen=w.id;save();
    nxModal('<div class="hofb">🧳</div><h3>¡Ha llegado el Mercader misterioso!</h3><p>Trae ofertas que no verás en ninguna tienda, pero solo se queda <b>hasta las '+merHM(w.b)+'</b>.</p><div class="mgbtns"><button class="red" id="merGo">Ver ofertas</button><button class="alt" id="merNo">Ahora no</button></div>');
    $("merGo").onclick=()=>{nxModalClose();hubOpen("act","merP")};$("merNo").onclick=()=>nxModalClose();snd("lvl")}}catch(e){}},3000);
{const _ce=calEvents;calEvents=function(){const L=_ce.apply(this,arguments);try{const now=Date.now();[0,864e5].forEach(off=>merSlots(v8Day(now+off)).forEach(s=>{if(s.b>now)L.push({a:s.a,b:s.b,ic:"🧳",t:"Mercader misterioso",d:"Ofertas especiales durante 30 minutos",c:"#b07a2a"})}));L.sort((a,b)=>a.a-b.a)}catch(e){}return L}}
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{const w=merNow();if(w){const st=merSt(w);if(Object.keys(st.b).length<4)o.act=(o.act|0)+1}}catch(e){}return o}}

// ================= RIVAL PERSONAL =================
// Un rival con nombre y carácter propios (salen de tu cuenta, siempre los mismos). Te reta cada 2 días con un equipo a tu
// nivel; si pierdes puedes repetir a las 6 horas. Cada 3 victorias seguidas te hace un regalo especial.
const RIV_N=["Álex","Noa","Iker","Vera","Leo","Mar","Hugo","Alba","Izan","Lía","Teo","Nora","Gael","Ari","Dani","Sol"];
const RIV_P={
  ch:{n:"Chulería",ic:"😏",intro:["¡Por fin te encuentro! Soy {n}. Dicen que eres buen entrenador… ya veremos.","Te reto a un combate. Prepárate, porque no pienso perder."],
    pre:["¿Otra vez tú? Esta vez no tendrás suerte.","He estado entrenando sin parar. ¡Vas a ver!","Mi equipo es mucho mejor que el tuyo. Te lo demuestro."],
    win:["¡Ja! Te lo dije. Entrena un poco más y vuelve.","Demasiado fácil. ¿Seguro que eres tú quien sale en el ranking?"],
    lose:["¿Qué? ¡Imposible! …Vale, esta vez has ganado. La próxima será distinta.","Grr… Has tenido suerte. ¡Volveré más fuerte!"],
    note:["He visto que tienes {dex} Pokémon distintos. Yo tendré más pronto.","¿{sh} variocolores? Bah, yo los encuentro sin buscar.","¿Solo {med} medallas? Yo voy a por todas."]},
  am:{n:"Simpatía",ic:"😄",intro:["¡Hola! Soy {n}. ¡Me encanta conocer a otros entrenadores!","¿Hacemos un combate amistoso? ¡Así los dos mejoramos!"],
    pre:["¡Qué ganas tenía de volver a verte! ¿Combatimos?","He preparado un equipo nuevo. ¡A ver qué te parece!"],
    win:["¡Buen combate! Has estado muy cerca. ¡La próxima seguro que me ganas!","¡Uf, qué emoción! Gracias por el combate."],
    lose:["¡Increíble! Tu equipo está genial. ¡Enhorabuena!","¡Qué bien combates! Tengo que aprender de ti."],
    note:["¡Ya tienes {dex} Pokémon distintos! Qué colección más bonita.","¡{sh} variocolores! ¿Cuál es tu favorito?","¡Ánimo con las medallas! Llevas {med}."]},
  mi:{n:"Misterio",ic:"🌙",intro:["…Te estaba esperando. Me llamo {n}.","Las estrellas dicen que nuestros caminos se cruzarán muchas veces. Empecemos."],
    pre:["El viento ha cambiado. Es hora de combatir.","Mis Pokémon sienten tu presencia…"],
    win:["Todavía no estás preparado. Lo sabía.","Interesante… pero no suficiente."],
    lose:["Así que eres tú quien está destinado… Lo veremos.","Tu fuerza crece. Las estrellas no mentían."],
    note:["{dex} Pokémon… Tu Pokédex guarda secretos.","He soñado con tus {sh} variocolores brillando en la oscuridad.","{med} medallas. El camino continúa."]}
};
const RIV_SPR=["acetrainer","acetrainerf","blackbelt","psychicf","scientist","skierf","ninjaboy","swimmerf"];
function rivSt(){if(S.riv&&S.riv.n)return S.riv;const r=v8Rng("riv|"+(v8Uid()||S.nyid||"local"));S.riv={n:v8Pick(r,RIV_N),p:v8Pick(r,Object.keys(RIV_P)),spr:v8Pick(r,RIV_SPR),k:0,st:0,w:0,l:0,next:0,met:0,msg:[]};return S.riv}
const rivTxt=(t,R)=>t.replace("{n}",R.n).replace("{dex}",Object.keys(S.owned||{}).filter(n=>S.owned[n]>0).length).replace("{sh}",Object.keys(S.shiny||{}).filter(n=>S.shiny[n]>0).length).replace("{med}",medCount());
function rivTeam(R){const r=v8Rng("rivt|"+R.n+"|"+R.k),med=medCount(),n=Math.max(2,Math.min(6,2+Math.floor(med/2)+(R.w>=6?1:0))),lv=clampL(leadLevel()+1+Math.min(3,Math.floor(R.w/4)));
  // su Pokémon estrella: de un tipo que tiene ventaja contra el primero de tu equipo
  const lead=(S.team||[]).find(x=>x&&S.owned[x]),lt=lead&&PM[lead]?PM[lead][1]:"normal",ADV={grass:"fire",fire:"water",water:"grass",electric:"ground",ground:"water",rock:"water",ice:"fire",bug:"fire",fighting:"psychic",psychic:"dark",dark:"fighting",ghost:"dark",poison:"psychic",flying:"electric",dragon:"ice",fairy:"steel",steel:"fire",normal:"fighting"};
  const at=ADV[lt]||"water",star=P.filter(p=>p[1]===at&&v8Base(p)&&p[2]===(med>=5?"E":"R"));const out=[];if(star.length)out.push(v8Pick(r,star)[0]);
  while(out.length<n){const rr=r(),rar=med>=6&&rr<.15&&!out.some(x=>PM[x][2]==="L")?"L":med>=3&&rr<.5?"E":rr<.8?"R":"C";const x=v8Pool(rar,r,out);if(x)out.push(x)}
  return{names:out.slice(-n).reverse(),lv,r}}
v8Tab("ret","rivP","Rival","🥊 Rival personal","Un entrenador rival que crece contigo. Te reta cada 2 días con un equipo a tu nivel y, si le ganas 3 veces seguidas, te hace un regalo especial.",()=>rivUI());
function rivUI(){const b=$("rivPB");if(!b)return;const R=rivSt(),P2=RIV_P[R.p],now=Date.now(),ready=now>=R.next,lst=(R.msg||[]).slice(-4).reverse();
  if(!R.met){b.innerHTML='<div class="rivcard"><img class="rivimg" src="'+v8Tsrc(R.spr)+'" alt="" onerror="this.style.visibility=\'hidden\'"><div class="rivtxt"><small>Un entrenador se acerca…</small><b>'+esc(R.n)+'</b>'+P2.intro.map(t=>'<p>«'+esc(rivTxt(t,R))+'»</p>').join("")+'<button class="red" id="rivGo">⚔️ Aceptar el reto</button></div></div>';$("rivGo").onclick=rivFight;return}
  b.innerHTML='<div class="rivcard"><img class="rivimg" src="'+v8Tsrc(R.spr)+'" alt="" onerror="this.style.visibility=\'hidden\'"><div class="rivtxt"><b>'+esc(R.n)+' <small class="rivp">'+P2.ic+' '+P2.n+'</small></b>'+
    '<div class="rivst"><span>✅ Victorias <b>'+R.w+'</b></span><span>❌ Derrotas <b>'+R.l+'</b></span><span>🔥 Seguidas <b>'+R.st+'</b>/3</span></div>'+
    (ready?'<p>«'+esc(rivTxt(P2.pre[R.k%P2.pre.length],R))+'»</p><button class="red" id="rivGo">⚔️ ¡Combatir!</button><small class="mut">Su equipo: '+rivTeam(R).names.length+' Pokémon, alrededor del Nv'+rivTeam(R).lv+'.</small>'
      :'<p class="mut">Volverá a retarte en <b>'+H2((R.next-now)/1000)+'</b>.</p>')+
    '<div class="rivgift"><span>🎁</span><div><b>Regalo especial</b><small>'+(3-R.st)+' victoria'+(3-R.st===1?'':'s')+' seguida'+(3-R.st===1?'':'s')+' más</small><div class="bar"><i style="width:'+(R.st/3*100)+'%"></i></div></div></div></div></div>'+
    (lst.length?'<h3 class="shh">💬 Mensajes de '+esc(R.n)+'</h3><div class="rivmsgs">'+lst.map(m=>'<div class="rivm"><small>'+new Date(m.t).toLocaleDateString("es-ES",{day:"numeric",month:"short"})+'</small><p>«'+esc(m.x)+'»</p></div>').join("")+'</div>':'');
  const g=$("rivGo");if(g)g.onclick=rivFight}
function rivFight(){const R=rivSt();if(Date.now()<R.next&&R.met)return;if(fcd){toast("Termina lo que estás haciendo primero.");return}
  const names=(S.team||[]).filter(n=>n&&S.owned[n]);if(!names.length){toast("Necesitas un equipo para combatir.");return}
  const T=rivTeam(R),nm="Rival "+R.n;R.met=1;save();hubClose();
  startBattle({eteam:v8Team(T.names,T.lv,T.r),trainer:nm,tsrc:{k:R.spr,n:nm},v8:{done:async res=>{const P2=RIV_P[R.p];
    if(res==="win"){R.w++;R.st++;R.k++;R.next=Date.now()+48*36e5;const rw={t:v8Tk(1.5,800000),it:{ub:3,pot:2}};grant(rw);
      await say("«"+rivTxt(P2.lose[R.w%P2.lose.length],R)+"»");await say("¡Has ganado a "+R.n+"! "+rwTxt(rw));
      if(R.st>=3){R.st=0;const r=Math.random();let txt;if(r<.5){const n=v8Pool("E",Math.random);if(n){giveMon(n,clampL(leadLevel()),true);txt="¡un "+n+" variocolor!";diaryAdd("🥊",R.n+" te ha regalado un "+n+" variocolor tras 3 victorias seguidas.",n,1,"pk")}}
        if(!txt){S.bag.mb=(S.bag.mb||0)+1;S.bag.cand=(S.bag.cand||0)+3;txt="una Master Ball y 3 Caramelos Raros.";diaryAdd("🥊",R.n+" te ha hecho un regalo especial tras 3 victorias seguidas.",null,0,"cb")}
        await say("«Vale… reconozco que eres muy bueno. Toma, esto es para ti.»");await say("🎁 "+R.n+" te regala "+txt)}
      if(R.w===1)diaryAdd("🥊","¡Primera victoria contra tu rival "+R.n+"!",null,0,"cb")}
    else if(res!=="flee"){R.l++;R.st=0;R.next=Date.now()+6*36e5;await say("«"+rivTxt(P2.win[R.l%P2.win.length],R)+"»")}
    else{R.next=Date.now()+6*36e5}
    save();render()}}})}
// de vez en cuando te deja un mensaje
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.riv||!S.riv.met)return;const R=S.riv,d=v8Day();if(R.md===d)return;R.md=d;const P2=RIV_P[R.p];R.msg=R.msg||[];R.msg.push({t:Date.now(),x:rivTxt(P2.note[Math.floor(Math.random()*P2.note.length)],R)});if(R.msg.length>12)R.msg.splice(0,R.msg.length-12);save()}catch(e){}},20000);
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{const R=S.riv;if(!R||!R.met||Date.now()>=R.next)o.ret=(o.ret|0)+1}catch(e){}return o}}

// ================= INVESTIGACIONES DEL PROFESOR =================
// Cadenas de misiones con historia (la Profesora Vega). Cada etapa tiene sus tareas; al acabarla, la siguiente llega al
// día siguiente, así que cada investigación dura varios días y todas juntas, semanas.
const RES_PROF="Profesora Vega";
const resOwnT=t=>Object.keys(S.owned||{}).filter(n=>S.owned[n]>0&&PM[n]&&tys(PM[n]).includes(t)).length;
const resSumT=t=>Object.keys(S.owned||{}).reduce((a,n)=>a+(PM[n]&&tys(PM[n]).includes(t)?Math.max(0,S.owned[n]|0):0),0);
const resLvT=t=>Object.keys(S.owned||{}).reduce((a,n)=>S.owned[n]>0&&PM[n]&&tys(PM[n]).includes(t)?Math.max(a,lvd(n).l):a,0);
const resMg=g=>v8C()["mg_"+g]|0;
{const _me=mgEnd;mgEnd=function(score){try{if(MG.g&&score>0){const c=v8C();c["mg_"+MG.g.id]=(c["mg_"+MG.g.id]|0)+1}}catch(e){}return _me.apply(this,arguments)}}
// tareas: k = own (tener N distintos de un tipo) · get (conseguir N más de un tipo) · ev (sucesos) · lv (nivel de un tipo) · mg (partidas de un minijuego) · hatch · boss (combate especial)
const RES=[
  {id:"gh",ic:"👻",n:"Los misterios del tipo Fantasma",t:"ghost",fin:"Spiritomb",st:[
    {say:["Hola. Tengo un encargo muy especial para ti.","Por la noche, en el pueblo, se oyen ruidos extraños y las luces parpadean. Creo que son Pokémon de tipo Fantasma.","Para empezar, necesito que reúnas varios Pokémon de este tipo. Así podré estudiarlos."],tk:[{k:"own",t:"ghost",n:3}],rw:{h:.5,it:{ub:2}}},
    {say:["¡Qué Pokémon tan curiosos! Algunos se esconden en las cuevas y en las sombras.","Gana combates para que se fíen de ti y consigue un par más."],tk:[{k:"ev",e:"win",n:10,d:"Gana 10 combates"},{k:"get",t:"ghost",n:2}],rw:{h:.6,it:{pot:3}}},
    {say:["He descubierto que les encanta la oscuridad total. ¿Conoces la Cueva oscura de los minijuegos?","Explórala y entrena a uno de tus Fantasma: quiero ver de lo que son capaces."],tk:[{k:"mg",g:"cue",n:3,d:"Juega 3 partidas de la Cueva oscura"},{k:"lv",t:"ghost",n:30}],rw:{h:.8,it:{cand:2}}},
    {say:["Lo sabía… Hay una sombra enorme detrás de todo esto. ¡Esta noche aparecerá en el pueblo!","Tienes que enfrentarte a ella. ¡Ten mucho cuidado!"],tk:[{k:"boss",nm:"Sombra misteriosa",team:["Gengar","Banette","Dusknoir","Chandelure"],d:"Derrota a la Sombra misteriosa"}],rw:{h:1,it:{}}}
  ]},
  {id:"dr",ic:"🐉",n:"La ruta de los dragones",t:"dragon",fin:"Bagon",finSh:1,st:[
    {say:["¡Enhorabuena por resolver el misterio de los Fantasma!","Mi siguiente investigación es sobre los dragones: Pokémon fuertes, orgullosos y muy difíciles de encontrar.","Consigue algunos para empezar."],tk:[{k:"own",t:"dragon",n:3}],rw:{h:.5,it:{ub:3}}},
    {say:["Los dragones solo respetan a quien demuestra su fuerza en combate."],tk:[{k:"ev",e:"win",n:15,d:"Gana 15 combates"},{k:"get",t:"dragon",n:3}],rw:{h:.7,it:{ppmax:2}}},
    {say:["Dicen que los dragones nacidos en la Guardería se encariñan mucho con su entrenador.","Haz eclosionar un huevo y entrena a un dragón hasta que sea fuerte."],tk:[{k:"hatch",n:1,d:"Haz eclosionar 1 huevo"},{k:"lv",t:"dragon",n:40}],rw:{h:.9,it:{cand:3}}},
    {say:["Un Criador de dragones legendario ha oído hablar de ti y quiere ponerte a prueba.","¡Es tu gran oportunidad!"],tk:[{k:"boss",nm:"Maestro dragón",team:["Dragonite","Salamence","Garchomp","Kingdra","Haxorus"],d:"Derrota al Maestro dragón"}],rw:{h:1.2,it:{}}}
  ]},
  {id:"wa",ic:"🌊",n:"Pokémon de los siete mares",t:"water",fin:"Lapras",st:[
    {say:["El mar esconde más especies que ningún otro lugar.","Empecemos por algo sencillo: quiero ver tu colección de Pokémon de tipo Agua."],tk:[{k:"own",t:"water",n:10}],rw:{h:.5,it:{sb:10}}},
    {say:["¡Vamos a pescar! Y a comer bayas en la playa, que el mar da hambre."],tk:[{k:"mg",g:"fish",n:3,d:"Juega 3 partidas de Pesca"},{k:"mg",g:"bay",n:2,d:"Juega 2 partidas de Lluvia de bayas"}],rw:{h:.7,it:{ub:4}}},
    {say:["Para viajar por el mar hace falta un compañero fuerte."],tk:[{k:"lv",t:"water",n:45},{k:"get",t:"water",n:4}],rw:{h:.9,it:{cand:3}}},
    {say:["¡Un pirata de los mares está asustando a los pescadores del puerto!","Solo tú puedes detenerlo."],tk:[{k:"boss",nm:"Pirata de los mares",team:["Gyarados","Kingler","Sharpedo","Starmie","Kingdra"],d:"Derrota al Pirata de los mares"}],rw:{h:1.2,it:{}}}
  ]},
  {id:"fo",ic:"🦴",n:"Fósiles vivientes",t:"rock",fin:"Aerodactyl",st:[
    {say:["Mi última investigación es la más antigua de todas: ¡Pokémon de hace millones de años!","Busca fósiles en el Cazafósiles y reúne Pokémon de tipo Roca."],tk:[{k:"mg",g:"fos",n:3,d:"Juega 3 partidas del Cazafósiles"},{k:"own",t:"rock",n:6}],rw:{h:.6,it:{ub:4}}},
    {say:["Los fósiles aparecen en las cuevas más profundas. Excava y combate."],tk:[{k:"mg",g:"exc",n:2,d:"Juega 2 partidas de Excavación"},{k:"ev",e:"win",n:20,d:"Gana 20 combates"}],rw:{h:.8,it:{crys:1}}},
    {say:["¡Casi lo tenemos! Necesito un Pokémon de tipo Roca muy fuerte para la última expedición."],tk:[{k:"lv",t:"rock",n:50},{k:"get",t:"rock",n:4}],rw:{h:1,it:{cand:4}}},
    {say:["¡Un Pokémon prehistórico ha despertado y está furioso!","Cálmalo en un combate antes de que destroce el laboratorio."],tk:[{k:"boss",nm:"Coloso prehistórico",team:["Tyranitar","Aerodactyl","Rampardos","Tyrantrum","Aurorus","Armaldo"],d:"Derrota al Coloso prehistórico"}],rw:{h:1.5,it:{}}}
  ]}
];
function resSt(){S.res=S.res&&typeof S.res==="object"?S.res:{c:0,s:0,b:null,done:{},av:""};return S.res}
// línea de partida de cada tarea al empezar la etapa
const resBase=()=>({ev:Object.assign({},v8C()),sum:Object.fromEntries(Object.keys(TIPO).map(t=>[t,resSumT(t)])),hatch:stt().hatch|0,boss:{}});
function resProg(tk,b){switch(tk.k){case"own":return[resOwnT(tk.t),tk.n];case"get":return[Math.max(0,resSumT(tk.t)-((b.sum||{})[tk.t]|0)),tk.n];case"ev":return[Math.max(0,(v8C()[tk.e]|0)-((b.ev||{})[tk.e]|0)),tk.n];
  case"lv":return[resLvT(tk.t),tk.n];case"mg":return[Math.max(0,resMg(tk.g)-((b.ev||{})["mg_"+tk.g]|0)),tk.n];case"hatch":return[Math.max(0,(stt().hatch|0)-(b.hatch|0)),tk.n];case"boss":return[(b.boss||{})[tk.nm]?1:0,1]}return[0,1]}
const resTxt=tk=>tk.d||({own:"Consigue "+tk.n+" Pokémon distintos de tipo "+TIPO[tk.t],get:"Consigue "+tk.n+" Pokémon más de tipo "+TIPO[tk.t]+" (tiradas, capturas o huevos)",lv:"Ten un Pokémon de tipo "+TIPO[tk.t]+" a nivel "+tk.n}[tk.k]||"");
v8Tab("ret","resP","Investigaciones","🔬 Investigaciones del Profesor","Ayuda a la Profesora Vega con sus investigaciones: varias etapas con historia, tareas y una gran recompensa al final. Cada etapa nueva llega al día siguiente.",()=>resUI());
function resUI(){const b=$("resPB");if(!b)return;const s=resSt(),C=RES[s.c];
  const list='<div class="resl">'+RES.map((c,i)=>'<div class="resc'+(i===s.c?' on':'')+(s.done[c.id]?' done':'')+(i>s.c?' lock':'')+'"><span>'+c.ic+'</span><b>'+esc(c.n)+'</b><small>'+(s.done[c.id]?'✅ Completada':i===s.c?'Etapa '+(Math.min(s.s,c.st.length-1)+1)+'/'+c.st.length:'🔒')+'</small></div>').join("")+'</div>';
  if(!C){b.innerHTML=list+'<p class="rates">🎉 ¡Has completado todas las investigaciones! La Profesora Vega está preparando nuevas.</p>';return}
  const st=C.st[s.s];
  if(!s.b){b.innerHTML=list+'<div class="resnew"><span class="resprof">👩‍🔬</span><div><b>'+RES_PROF+'</b>'+st.say.map(t=>'<p>«'+esc(t)+'»</p>').join("")+(s.av&&s.av>v8Day()?'<p class="mut">La siguiente etapa estará lista mañana.</p>':'<button class="red" id="resGo">📋 Aceptar el encargo</button>')+'</div></div>';
    const g=$("resGo");if(g)g.onclick=()=>{s.b=resBase();save();snd("ui");resUI()};return}
  const pr=st.tk.map(tk=>resProg(tk,s.b)),ok=pr.every(p=>p[0]>=p[1]);
  b.innerHTML=list+'<div class="resstage"><div class="reshd"><span>'+C.ic+'</span><div><b>'+esc(C.n)+'</b><small>Etapa '+(s.s+1)+' de '+C.st.length+'</small></div></div><p class="mut">«'+esc(st.say[st.say.length-1])+'»</p>'+
    st.tk.map((tk,i)=>{const[v,n]=pr[i],dn=v>=n;return '<div class="restk'+(dn?' ok':'')+'"><span>'+(dn?'✅':'⬜')+'</span><div><b>'+esc(resTxt(tk))+'</b><div class="bar"><i style="width:'+Math.min(100,v/n*100)+'%"></i></div><small>'+fmt(Math.min(v,n))+' / '+fmt(n)+'</small></div>'+(tk.k==="boss"&&!dn?'<button class="red" data-resb="'+i+'">⚔️ Enfrentarse</button>':'')+'</div>'}).join("")+
    '<div class="resrw">🎁 Recompensa de la etapa: <b>'+rwTxt(resRw(st))+'</b>'+(s.s===C.st.length-1?' + <b>'+(C.finSh?'✨ ':'')+C.fin+(C.finSh?' variocolor':'')+'</b>':'')+'</div>'+(ok?'<button class="red big" id="resDone">🎉 Entregar a la Profesora</button>':'')+'</div>';
  const d=$("resDone");if(d)d.onclick=resClaim}
const resRw=st=>({t:Math.round(v8Tk(st.rw.h,500000)*(1+.15*specRank("R"))),it:Object.assign({},st.rw.it)});
async function resClaim(){const s=resSt(),C=RES[s.c];if(!C||!s.b)return;const st=C.st[s.s];if(!st.tk.every(tk=>{const p=resProg(tk,s.b);return p[0]>=p[1]}))return;
  const rw=resRw(st);grant(rw);let extra="";
  if(s.s===C.st.length-1){if(PM[C.fin]){giveMon(C.fin,clampL(Math.max(20,leadLevel())),!!C.finSh);extra=" ¡Y "+(C.finSh?"un "+C.fin+" variocolor":C.fin)+" se une a ti!"}
    s.done[C.id]=1;s.c++;s.s=0;diaryAdd(C.ic,"Investigación completada: «"+C.n+"».",C.fin,!!C.finSh,"lg")}
  else s.s++;
  s.b=null;s.av=v8Day(Date.now()+864e5);save();render();snd("lvl");setTimeout(()=>snd("win"),300);
  nxModal('<div class="hofb">👩‍🔬</div><h3>¡Gracias por tu ayuda!</h3><p>«¡Excelente trabajo! Esto me ayuda muchísimo.»</p><p>Recompensa: <b>'+rwTxt(rw)+'</b>'+esc(extra)+'</p><button id="resOk">¡Genial!</button>');$("resOk").onclick=()=>{nxModalClose();resUI()}}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#resPB [data-resb]");if(!t)return;const s=resSt(),C=RES[s.c];if(!C||!s.b)return;const tk=C.st[s.s].tk[+t.dataset.resb];if(!tk||tk.k!=="boss")return;
  if(fcd){toast("Termina lo que estás haciendo primero.");return}if(!(S.team||[]).some(n=>n&&S.owned[n])){toast("Necesitas un equipo para combatir.");return}
  const lv=clampL(leadLevel()+3),names=tk.team.filter(n=>PM[n]).slice(0,Math.max(3,Math.min(6,2+medCount())));hubClose();
  startBattle({eteam:v8Team(names,lv),trainer:tk.nm,tsrc:{k:"acetrainer",n:tk.nm},v8:{done:async res=>{if(res==="win"){const s2=resSt();if(s2.b){s2.b.boss=s2.b.boss||{};s2.b.boss[tk.nm]=1;save()}await say("🔬 ¡Has derrotado a "+tk.nm+"! Vuelve con la Profesora Vega para contárselo.")}else if(res!=="flee")await say("¡"+tk.nm+" es muy fuerte! Entrena un poco más y vuelve a intentarlo.")}}})});
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{const s=resSt(),C=RES[s.c];if(C){if(!s.b&&!(s.av&&s.av>v8Day()))o.ret=(o.ret|0)+1;else if(s.b&&C.st[s.s].tk.every(tk=>{const p=resProg(tk,s.b);return p[0]>=p[1]}))o.ret=(o.ret|0)+1}}catch(e){}return o}}

// ================= CONCURSOS POKÉMON =================
// 5 categorías, 4 rangos (Normal, Súper, Hiper y Master). Eliges un Pokémon y, en 5 rondas, uno de sus movimientos por
// ronda: los del tipo de la categoría gustan más, repetir aburre al público y llenar la emoción da un gran extra.
const CON_K={bel:{n:"Belleza",ic:"💎",c:"#4aa8ff",t:["water","ice","fairy"]},car:{n:"Carisma",ic:"😎",c:"#ff5a5a",t:["fire","electric","dragon","flying"]},dul:{n:"Dulzura",ic:"🍬",c:"#ff7ac8",t:["normal","grass","bug"]},
  ing:{n:"Ingenio",ic:"🧠",c:"#3fbf6a",t:["psychic","ghost","poison","dark"]},dur:{n:"Dureza",ic:"💪",c:"#e0952a",t:["rock","ground","fighting","steel"]}};
const CON_R=["Normal","Súper","Hiper","Master"],CON_DAY=5;
const CON_NPC=["Coordinadora Lis","Coordinador Bruno","Coordinadora Celia","Coordinador Fabio","Coordinadora Ruth","Coordinador Íñigo","Coordinadora Paz","Coordinador Saúl"];
const conCat=t=>Object.keys(CON_K).find(k=>CON_K[k].t.includes(t))||"dul";
function conSt(){const d=v8Day();S.con=S.con&&typeof S.con==="object"?S.con:{w:0,r:{},d:"",n:0};if(S.con.d!==d){S.con.d=d;S.con.n=0}S.con.r=S.con.r||{};return S.con}
const conRank=k=>conSt().r[k]|0;// rango más alto desbloqueado (0..3); ganar el rango r desbloquea r+1
v8Tab("act","conP","🎀 Concursos","🎀 Concursos Pokémon","Luce a tus Pokémon en concursos de Belleza, Carisma, Dulzura, Ingenio y Dureza. Elige bien los movimientos para ganarte al público y consigue cintas.",()=>conUI(),1);
let CON=null;
function conUI(){const b=$("conPB");if(!b)return;if(CON&&CON.on){conDraw();return}const s=conSt(),ribs=S.rib||{};
  const sel=NX.conK||"bel",rk=Math.min(3,NX.conR==null?conRank(sel):NX.conR);
  b.innerHTML='<div class="concats">'+Object.keys(CON_K).map(k=>'<button class="'+(k===sel?'on':'')+'" data-conk="'+k+'" style="--cc:'+CON_K[k].c+'"><span>'+CON_K[k].ic+'</span>'+CON_K[k].n+'<small>'+CON_R[Math.min(3,conRank(k))]+'</small></button>').join("")+'</div>'+
    '<div class="conranks">'+CON_R.map((r,i)=>'<button class="'+(i===rk?'on':'')+'" data-conr="'+i+'"'+(i>conRank(sel)?' disabled':'')+'>'+(i>conRank(sel)?'🔒 ':'')+r+'</button>').join("")+'</div>'+
    '<p class="mut">Los movimientos de tipo '+CON_K[sel].t.map(t=>EM[t]+" "+TIPO[t]).join(", ")+' encantan en '+CON_K[sel].n+'. Premios hoy: <b>'+Math.max(0,CON_DAY-s.n)+'/'+CON_DAY+'</b>.</p>'+
    '<h3 class="shh">Elige a tu Pokémon</h3><input id="conQ" placeholder="Buscar Pokémon…" value="'+esc(NX.conQ||"")+'"><div class="conpick">'+conList(sel).slice(0,60).map(n=>'<button data-conp="'+esc(n)+'"><span>'+icoHD(PM[n],56,false,!!(S.shiny&&S.shiny[n]))+'</span><b>'+esc(nk(n))+'</b><small>Nv'+lvd(n).l+' · '+EM[PM[n][1]]+'</small>'+(ribs[n]?'<i class="conrib">🎀'+Object.keys(ribs[n]).length+'</i>':'')+'</button>').join("")+'</div>'+
    (Object.keys(ribs).length?'<h3 class="shh">🎀 Tus cintas</h3><div class="conribs">'+Object.keys(ribs).filter(n=>PM[n]).map(n=>'<div><span>'+icoHD(PM[n],40,false,false)+'</span><b>'+esc(nk(n))+'</b><small>'+Object.keys(ribs[n]).map(k=>CON_K[k]?CON_K[k].ic+' '+CON_R[ribs[n][k]]:"").join(" · ")+'</small></div>').join("")+'</div>':'');
  const q=$("conQ");if(q)q.oninput=()=>{NX.conQ=q.value;const pos=q.selectionStart;conUI();const q2=$("conQ");if(q2){q2.focus();try{q2.setSelectionRange(pos,pos)}catch(e){}}}}
function conList(k){const q=nrm(NX.conQ||""),T=CON_K[k].t;return Object.keys(S.owned||{}).filter(n=>S.owned[n]>0&&PM[n]&&(!q||nrm(n).includes(q)||nrm(nk(n)).includes(q))).sort((a,b)=>(tys(PM[b]).some(t=>T.includes(t))-tys(PM[a]).some(t=>T.includes(t)))||lvd(b).l-lvd(a).l)}
function conStart(n){const k=NX.conK||"bel",rk=Math.min(conRank(k),NX.conR==null?conRank(k):NX.conR);if(!PM[n])return;
  const ids=moveIds(n).filter(id=>MVD[id]).slice(0,4);if(!ids.length){toast("Ese Pokémon no tiene movimientos.");return}
  const T=CON_K[k].t,cond=Math.round(lvd(n).l/10+(S.shiny&&S.shiny[n]>0?2:0)+(heldOf(n)?1:0)+(tys(PM[n]).some(t=>T.includes(t))?3:0));
  const npc=CON_NPC.slice().sort(()=>Math.random()-.5).slice(0,3);
  const rv=npc.map(nm=>{const p=v8Pool(Math.random()<.4+rk*.15?"E":"R",Math.random)||"Eevee";return{nm,p,sc:Math.round(2+rk*2+Math.random()*4)}});
  CON={on:1,k,rk,n,ids,round:0,me:cond,cond,ex:0,last:"",log:["¡Empieza el concurso de "+CON_K[k].n+" (rango "+CON_R[rk]+")! "+nk(n)+" sale al escenario. Presentación: +"+cond+" ♥"],rv};snd("lvl");conDraw()}
function conAppeal(i){const C=CON;if(!C||!C.on||C.round>=5||C.busy)return;const id=C.ids[i],mv=MVD[id];if(!mv)return;C.busy=1;
  const cat=conCat(mv.t),match=cat===C.k,base=mv.cl===0?2:mv.pw>=90?4:mv.pw>=60?3:2;let pts=base+(match?2:0),msg=nk(C.n)+" usa "+mv.n+": +";
  if(C.last===id){pts-=2;msg+=Math.max(0,pts)+" ♥ — ¡el público se aburre de ver lo mismo!"}else msg+=pts+" ♥"+(match?" ¡Al público le encanta!":"");
  pts=Math.max(0,pts);if(match&&C.last!==id){C.ex++;if(C.ex>=5){pts+=5;C.ex=0;msg+=" 🎆 ¡EMOCIÓN AL MÁXIMO! +5 ♥"}}
  C.last=id;C.me+=pts;C.round++;C.lastPts=pts;
  C.rv.forEach(r=>{const a=Math.max(0,Math.round(1+C.rk*.6+Math.random()*4.2));r.sc+=a});C.log.push(msg);snd(pts>=5?"lvl":"pop");
  conDraw(true);setTimeout(()=>{C.busy=0;if(C.round>=5)conEnd();else conDraw()},900)}
function conEnd(){const C=CON;if(!C)return;C.on=0;const all=[{nm:"Tú",sc:C.me,me:1}].concat(C.rv.map(r=>({nm:r.nm,sc:r.sc,p:r.p}))).sort((a,b)=>b.sc-a.sc),pos=all.findIndex(x=>x.me),s=conSt();
  let rw=null,extra="";if(pos===0){S.rib=S.rib||{};S.rib[C.n]=S.rib[C.n]||{};const had=S.rib[C.n][C.k];S.rib[C.n][C.k]=Math.max(had==null?-1:had,C.rk);s.w=(s.w|0)+1;
    if(C.rk>=conRank(C.k)&&C.rk<3){s.r[C.k]=C.rk+1;extra="¡Has desbloqueado el rango "+CON_R[C.rk+1]+" de "+CON_K[C.k].n+"!"}
    if(C.rk===3)diaryAdd("🎀","¡"+nk(C.n)+" ha ganado el concurso Master de "+CON_K[C.k].n+"!",C.n,0,"lg");else if(s.w===1)diaryAdd("🎀","¡Tu primer concurso ganado con "+nk(C.n)+"!",C.n,0,"lg")}
  if(s.n<CON_DAY){s.n++;const m=[1,.5,.3,.2][pos],it=pos===0?[{pot:2},{ub:3},{cand:1},{cand:2,ppmax:1}][C.rk]:{};rw={t:Math.round(v8Tk(.25+C.rk*.25,200000)*m),it};grant(rw)}
  save();render();snd(pos===0?"win":"ui");
  const b=$("conPB");if(!b)return;b.innerHTML='<div class="conres"><div class="mgbig">'+(pos===0?"🏆":["🥇","🥈","🥉","🎗️"][pos])+'</div><h3>'+(pos===0?"¡"+esc(nk(C.n))+" gana el concurso!":"Puesto "+(pos+1)+" de 4")+'</h3>'+
    '<ol class="conrank">'+all.map(x=>'<li class="'+(x.me?'me':'')+'"><b>'+esc(x.nm)+'</b><span>'+x.sc+' ♥</span></li>').join("")+'</ol>'+(pos===0?'<p>🎀 ¡'+esc(nk(C.n))+' consigue la cinta de '+CON_K[C.k].n+' '+CON_R[C.rk]+'!</p>':'')+(extra?'<p><b>'+extra+'</b></p>':'')+
    (rw?'<p>Premio: <b>'+rwTxt(rw)+'</b></p>':'<p class="mut">Hoy ya no quedan premios (sí cintas).</p>')+'<div class="mgbtns"><button class="red" id="conAg">🔁 Otro concurso</button></div></div>';$("conAg").onclick=()=>{CON=null;conUI()}}
function conDraw(anim){const b=$("conPB"),C=CON;if(!b||!C)return;const K=CON_K[C.k];
  b.innerHTML='<div class="constage" style="--cc:'+K.c+'"><div class="conlights"></div><div class="conhd"><span>'+K.ic+' '+K.n+' · '+CON_R[C.rk]+'</span><span>Ronda <b>'+Math.min(5,C.round+1)+'</b>/5</span></div>'+
    '<div class="conjudges"><span>🧑‍⚖️</span><span>👩‍⚖️</span><span>🧑‍⚖️</span></div><div class="conmon'+(anim?' hop':'')+'">'+icoHD(PM[C.n],150,false,!!(S.shiny&&S.shiny[C.n]))+(anim&&C.lastPts?'<span class="conhearts">'+"♥".repeat(Math.min(10,C.lastPts))+'</span>':'')+'</div>'+
    '<div class="conex"><small>Emoción del público</small><div class="conexb">'+[0,1,2,3,4].map(i=>'<i class="'+(i<C.ex?'on':'')+'"></i>').join("")+'</div></div>'+
    '<div class="consc"><div class="me"><b>'+esc(nk(C.n))+'</b><span>'+C.me+' ♥</span></div>'+C.rv.map(r=>'<div><b>'+esc(r.nm)+'</b><small>'+esc(r.p)+'</small><span>'+r.sc+' ♥</span></div>').join("")+'</div></div>'+
    '<div class="conlog">'+C.log.slice(-3).map(t=>'<p>'+esc(t)+'</p>').join("")+'</div>'+
    (C.round<5?'<div class="conmoves">'+C.ids.map((id,i)=>{const mv=MVD[id],cat=conCat(mv.t),ck=CON_K[cat];return '<button data-cona="'+i+'"'+(C.busy?' disabled':'')+' style="--cc:'+ck.c+'"><b>'+esc(mv.n)+'</b><small>'+EM[mv.t]+' '+TIPO[mv.t]+' · '+ck.ic+' '+ck.n+(cat===C.k?' ✨':'')+(C.last===id?' · 😴 repetido':'')+'</small></button>'}).join("")+'</div>':'')}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#conPB [data-conk],#conPB [data-conr],#conPB [data-conp],#conPB [data-cona]");if(!t)return;snd("ui");
  if(t.dataset.conk){NX.conK=t.dataset.conk;NX.conR=null;conUI()}else if(t.dataset.conr){NX.conR=+t.dataset.conr;conUI()}else if(t.dataset.conp)conStart(t.dataset.conp);else if(t.dataset.cona!=null)conAppeal(+t.dataset.cona)});
