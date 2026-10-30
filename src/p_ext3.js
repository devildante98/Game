// =====================================================================================
// CALENDARIO DE EVENTOS, VITRINA DEL PERFIL Y ESTADÍSTICAS
// =====================================================================================
// ---------- tiempo jugado ----------
setInterval(()=>{if(!document.hidden){S.ptime=(S.ptime||0)+30}},30000);
// ---------- CALENDARIO ----------
nxPanel("calP","📅 Calendario de eventos","Todo lo que pasa en los próximos 7 días, a la misma hora para todos los jugadores (hora de España). ¡Conéctate a tiempo!");
{const g=HUB.find(x=>x.k==="act");if(g&&!g.tabs.some(t=>t[0]==="calP"))g.tabs.push(["calP","Calendario"]);HUBP.calP="act";HUBR.calP=()=>calUI()}
function calEvents(){
  const now=Date.now(),end=now+7*864e5,L=[];
  hhSlots(7).filter(s=>s.b>now&&s.a<end).forEach(s=>{const i=hhInfo(s);L.push({a:s.a,b:s.b,ic:s.k==="cd"?"🎉":"⏰",t:i[0],d:i[1],c:s.k==="cd"?"#e0447a":"#ffb02e",mon:s.k==="cd"?s.mon:null})});
  // jefes de incursión (cada 3 horas)
  for(let k=0;k<8;k++){const t=(Math.floor(now/(3*36e5))+k)*3*36e5;if(t+3*36e5<now)continue;const b=raidBoss(t+1000);L.push({a:t,b:t+3*36e5,ic:"🔴",t:"Jefe de incursión: "+b[0],d:STAR[b[2]]+" · "+TIPO[b[1]],c:"#b3123b",mon:b,raid:1})}
  // fin del torneo semanal y de las clasificaciones
  const te=now+tourEndsIn(),tg=tourGameOf(tourWeek());L.push({a:te,b:te,ic:"🏆",t:"Termina el Torneo semanal ("+tg.n+")",d:"Se reparten los premios del torneo y de la clasificación de cada minijuego",c:"#ffb02e",pt:1});
  // pase de temporada
  {const d=new Date(),e=new Date(d.getFullYear(),d.getMonth()+1,1).getTime();if(e<end)L.push({a:e,b:e,ic:"🎫",t:"Termina el pase de temporada",d:"Reclama tus premios antes de que empiece la nueva temporada",c:"#7a4ae0",pt:1})}
  // evento de temporada
  {const ev=evNow();if(ev){const d=new Date(),y=d.getFullYear(),e=new Date(ev.b[0]<ev.a[0]&&d.getMonth()+1>=ev.a[0]?y+1:y,ev.b[0]-1,ev.b[1],23,59).getTime();L.push({a:now,b:e,ic:"🎊",t:"Evento "+ev.n,d:"Más Pokémon de tipo "+ev.t.map(t=>TIPO[t]).join(" y ")+" en tiradas y combates",c:"#13a37f",long:1})}}
  // reinicios
  {const d=new Date();d.setHours(24,0,0,0);L.push({a:d.getTime(),b:d.getTime(),ic:"📅",t:"Nuevas misiones diarias y minijuegos con premio",d:"Cada día a medianoche",c:"#2f6fd8",pt:1})}
  return L.sort((x,y)=>x.a-y.a);
}
function calUI(){
  const box=$("calPB");if(!box)return;const now=Date.now(),L=calEvents(),act=L.filter(e=>e.a<=now&&e.b>now&&!e.pt),days={};
  L.filter(e=>!(e.a<=now&&e.b>now&&!e.pt)).forEach(e=>{const k=new Date(e.a).toDateString();(days[k]=days[k]||[]).push(e)});
  const row=e=>'<div class="calr" style="--cc:'+e.c+'"><span class="calt">'+(e.pt||e.a>now?new Date(e.a).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}):'AHORA')+'</span><span class="cali">'+(e.mon?ico(e.mon,36):e.ic)+'</span><div><b>'+esc(e.t)+'</b><small>'+esc(e.d)+(e.a<=now&&e.b>now?' · quedan '+hhFmt(e.b-now):'')+'</small></div></div>';
  box.innerHTML=(act.length?'<h3 class="shh">🟢 Ahora mismo</h3><div class="call">'+act.map(row).join("")+'</div>':'')+
    Object.keys(days).slice(0,7).map(k=>{const d=new Date(k),t=new Date().toDateString()===k?"Hoy":new Date(Date.now()+864e5).toDateString()===k?"Mañana":d.toLocaleDateString("es",{weekday:"long",day:"numeric",month:"long"});return '<h3 class="shh">'+t.charAt(0).toUpperCase()+t.slice(1)+'</h3><div class="call">'+days[k].map(row).join("")+'</div>'}).join("");
}
setInterval(()=>{try{if(nxOpen("calP"))calUI()}catch(e){}},30000);

// ---------- TÍTULOS ----------
const TITLES=[["nov","🌱 Entrenador novato",()=>true],["col","📚 Coleccionista",()=>P.filter(p=>hasP(p[0])).length>=150],["mpk","📖 Maestro Pokédex",()=>P.filter(p=>hasP(p[0])).length>=600],
 ["shy","✨ Cazador de variocolores",()=>shinyTotal()>=5],["med","🏅 Ocho medallas",()=>medCount()>=8],["lga","🏆 Campeón de Liga",()=>Object.keys(S.lgDone||{}).length>0],
 ["twr","🗼 As de la Torre",()=>((S.tw||{}).best|0)>=10],["cmp","👑 Campeón semanal",()=>(S.trophies||[]).some(x=>x.p===1)],["rai","🔴 Cazador de jefes",()=>((stt().raid)|0)>=10],
 ["gld","🛡️ Líder de gremio",()=>!!(GS.doc&&window.FB&&GS.doc.owner===window.FB.uid())],["prs","🌟 Leyenda",()=>PRS()>=3],["mkt","🛒 Mercader",()=>((stt().mksold)|0)>=10]];
// títulos de la Tienda de Evento: [id, título, precio, evento (null = todo el año)]
const TITLE_SHOP=[
 ["s_fire","🔥 Entrenador en llamas",1.5e7,null],["s_bolt","⚡ Rayo veloz",1.5e7,null],["s_aqua","💧 Corazón de agua",1.5e7,null],["s_leaf","🍃 Alma de la naturaleza",1.5e7,null],
 ["s_moon","🌙 Noctámbulo",3e7,null],["s_luck","🍀 Afortunado",3e7,null],["s_gacha","🎰 Adicto al gacha",5e7,null],["s_brain","🧠 Gran estratega",5e7,null],
 ["s_rich","💎 Coleccionista de lujo",1e8,null],["s_drag","🐉 Domador de dragones",1e8,null],["s_royal","👑 Realeza Pokémon",2.5e8,null],["s_cosmo","🌌 Leyenda cósmica",5e8,null],
 ["s_hw1","🎃 Rey de las calabazas",2e7,"🎃 Halloween"],["s_hw2","👻 Alma en pena",2e7,"🎃 Halloween"],["s_hw3","🦇 Señor de la noche",3e7,"🎃 Halloween"],["s_hw4","🕸️ Tejedor de sustos",3e7,"🎃 Halloween"],
 ["s_xm1","🎄 Espíritu navideño",2e7,"🎄 Navidad"],["s_xm2","❄️ Corazón de hielo",2e7,"🎄 Navidad"],["s_xm3","🎁 Repartidor de regalos",3e7,"🎄 Navidad"],["s_xm4","⛄ Guardián del invierno",3e7,"🎄 Navidad"],
 ["s_vl1","💘 Flechazo Pokémon",2e7,"💘 San Valentín"],["s_vl2","💖 Corazón de entrenador",2e7,"💘 San Valentín"],["s_vl3","🌹 Romántico empedernido",3e7,"💘 San Valentín"],
 ["s_sp1","🌸 Flor de cerezo",2e7,"🌸 Primavera"],["s_sp2","🦋 Alma libre",2e7,"🌸 Primavera"],["s_sp3","🌱 Brote de primavera",3e7,"🌸 Primavera"],
 ["s_su1","☀️ Rey del verano",2e7,"☀️ Verano"],["s_su2","🏖️ Surfista legendario",2e7,"☀️ Verano"],["s_su3","🍉 Fresquito total",3e7,"☀️ Verano"],["s_su4","🌊 Domador de olas",3e7,"☀️ Verano"]];
TITLE_SHOP.forEach(t=>TITLES.push([t[0],t[1],()=>trOwn("ti",t[0])]));
const isShopTit=k=>TITLE_SHOP.some(x=>x[0]===k);
const titleOk=k=>{const t=TITLES.find(x=>x[0]===k);try{return !!(t&&t[2]())}catch(e){return false}};
// ---------- VITRINA ----------
nxPanel("shwP","🖼️ Vitrina y estadísticas","Elige los 3 Pokémon y el título que verán los demás jugadores en tu perfil, y consulta tus estadísticas.");
{const g=HUB.find(x=>x.k==="trn");if(g&&!g.tabs.some(t=>t[0]==="shwP"))g.tabs.push(["shwP","Vitrina y estadísticas"]);HUBP.shwP="trn";HUBR.shwP=()=>shwUI()}
function shwGet(){S.shw=S.shw||{pk:[],tit:"nov"};return S.shw}
function shwUI(){
  const box=$("shwPB");if(!box)return;const s=shwGet(),st=stt();
  const slot=i=>{const n=s.pk[i];return '<button class="shws'+(n&&PM[n]?' on':'')+'" data-shw="'+i+'">'+(n&&PM[n]?icoHD(PM[n],96,false,!!(S.shiny&&S.shiny[n]>0))+'<b>'+esc(nk(n))+'</b>':'<span>＋</span><b>Hueco '+(i+1)+'</b>')+'</button>'};
  const H=Math.floor((S.ptime||0)/3600),M=Math.floor((S.ptime||0)%3600/60);
  const stats=[["⏱️","Tiempo jugado",H+" h "+M+" min"],["🎰","Tiradas",fmt((S.np||0)+(S.sp||0))],["✨","Súper tiradas",fmt(S.sp||0)],["📚","Pokédex",P.filter(p=>hasP(p[0])).length+" / "+P.length],["🧺","Pokémon en total",fmt(Object.values(S.owned||{}).reduce((a,b)=>a+(b|0),0))],
    ["🌈","Variocolores",fmt(shinyTotal())],["🎯","Combates ganados",fmt(st.win||0)],["🔴","Capturas",fmt(st.cap||0)],["👥","Entrenadores vencidos",fmt(st.tr||0)],["⚔️","PVP (victorias / derrotas)",((S.pvp||{}).w|0)+" / "+((S.pvp||{}).l|0)],
    ["🗼","Récord Torre Batalla",fmt((S.tw||{}).best|0)],["🏅","Medallas",medCount()+" / 8"],["🏆","Ligas ganadas",fmt(Object.values(S.lgDone||{}).reduce((a,b)=>a+(b|0),0))],["🧬","Evoluciones",fmt(st.evo||0)],["🎮","Partidas de minijuegos",fmt(st.mg||0)],
    ["🥚","Huevos eclosionados",fmt(st.hatch||0)],["🏆","Trofeos de torneo",fmt((S.trophies||[]).length)],["🎖️","Logros",fmt(Object.values(S.ach||{}).reduce((a,b)=>a+b,0))],["🎟️","Tickets ahora",fmt(S.t)]];
  box.innerHTML='<h3 class="shh">🖼️ Tu vitrina</h3><div class="shwg">'+[0,1,2].map(slot).join("")+'</div>'+
    '<div class="fichr shwt"><span>Título</span><div class="fichin"><select id="shwT">'+TITLES.filter(t=>!isShopTit(t[0])||titleOk(t[0])).map(t=>'<option value="'+t[0]+'"'+(s.tit===t[0]?' selected':'')+(titleOk(t[0])?'':' disabled')+'>'+t[1]+(titleOk(t[0])?'':' 🔒')+'</option>').join("")+'</select><small class="mut">🛍️ Consigue más títulos en la <a href="#" data-trshop>Tienda de Evento</a>.</small></div></div>'+
    '<small class="mut">Los títulos con 🔒 se desbloquean jugando: Pokédex, variocolores, medallas, Liga, Torre, torneos, incursiones, gremio, prestigio y mercadillo.</small>'+
    (NX.shwSel!=null?'<div class="nxpick"><div class="sets-row"><input id="shwQ" placeholder="Buscar Pokémon..." value="'+esc(NX.shwQ||"")+'"><button class="alt" data-shwx="1">Cancelar</button></div><div class="nxgrid">'+P.filter(p=>S.owned[p[0]]>0&&(!NX.shwQ||nrm(p[0]).includes(nrm(NX.shwQ))||nrm(nk(p[0])).includes(nrm(NX.shwQ)))).sort((a,b)=>"CREML".indexOf(b[2])-"CREML".indexOf(a[2])||lvd(b[0]).l-lvd(a[0]).l).slice(0,90).map(p=>'<button class="nxcell" data-shwn="'+esc(p[0])+'">'+ico(p,48,false,!!(S.shiny&&S.shiny[p[0]]>0))+'<b>'+esc(nk(p[0]))+'</b><small>'+STAR[p[2]]+'</small></button>').join("")+'</div></div>':'')+
    '<h3 class="shh">📊 Tus estadísticas</h3><div class="profst shwst">'+stats.map(x=>'<div><span>'+x[0]+'</span><b>'+x[2]+'</b><small>'+x[1]+'</small></div>').join("")+'</div>';
  const t=$("shwT");if(t)t.onchange=()=>{if(!titleOk(t.value))return;s.tit=t.value;save();snd("ui");toast("🏷️ Título cambiado")};
  const q=$("shwQ");if(q)q.oninput=()=>{NX.shwQ=q.value;const pos=q.selectionStart;shwUI();const q2=$("shwQ");q2.focus();try{q2.setSelectionRange(pos,pos)}catch(e){}};
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#shwPB button");if(!b)return;const d=b.dataset;
  if(d.shw!=null){NX.shwSel=+d.shw;NX.shwQ="";shwUI()}else if(d.shwx){NX.shwSel=null;shwUI()}
  else if(d.shwn){const s=shwGet();s.pk=s.pk.filter(x=>x!==d.shwn);s.pk[NX.shwSel]=d.shwn;s.pk=s.pk.slice(0,3);NX.shwSel=null;save();snd("ui");shwUI()}});
// contar algunas estadísticas nuevas
{const _q=qEv;qEv=function(ev,n){if(ev==="cap"&&typeof RD!=="undefined"&&RD.phase==="catch"){}return _q(ev,n)}}
{const _rw=rdWin;rdWin=async function(){const st=stt();st.raid=(st.raid|0)+1;return _rw.apply(this,arguments)}}
{const _eh=eggHatch;eggHatch=async function(i){const g=(S.eggs||[])[i];const r=await _eh.apply(this,arguments);if(g&&!(S.eggs||[]).includes(g)){const st=stt();st.hatch=(st.hatch|0)+1;save()}return r}}
{const _mc=mkCollect;mkCollect=async function(d){const st=stt();if(!(S.mkPaid&&S.mkPaid[d.id])){st.mksold=(st.mksold|0)+1}return _mc.apply(this,arguments)}}
// datos públicos del perfil
{const _rd=window.rankData;if(_rd)window.rankData=function(){const d=_rd();if(!d)return d;const s=shwGet();d.shw=(s.pk||[]).filter(n=>n&&PM[n]&&S.owned[n]>0).slice(0,3).map(n=>({n:n,l:lvd(n).l,s:S.shiny&&S.shiny[n]>0?1:0,k:S.mote&&S.mote[n]?String(S.mote[n]).slice(0,12):""}));
  const t=TITLES.find(x=>x[0]===s.tit);d.tit=t&&titleOk(t[0])?t[1]:"";d.pt=Math.floor((S.ptime||0)/3600);d.pulls=(S.np||0)+(S.sp||0);return d}}
