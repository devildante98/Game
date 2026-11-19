// =====================================================================================
// CUMPLEAÑOS DEL ENTRENADOR
// Después del apodo (y del tutorial) el juego pregunta el día y el mes del cumpleaños (sin año). El día de tu cumpleaños
// (o en los 6 días siguientes, si no entras ese día) sale una ventana felicitándote con un gran regalo, una vez al año.
// Para que nadie haga trampas, la fecha no se puede cambiar una vez puesta y el regalo solo llega si la pusiste al
// menos 7 días antes del cumpleaños. Se usa la fecha de tu dispositivo. El 29 de febrero, en los años no bisiestos,
// se celebra el 28.
// =====================================================================================
const BD_MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const BD_DIAS=[31,29,31,30,31,30,31,31,30,31,30,31];
const BD_TXT=b=>b.d+" de "+BD_MES[b.m-1];
const bdOk=b=>!!(b&&b.m>=1&&b.m<=12&&b.d>=1&&b.d<=BD_DIAS[b.m-1]);
// el regalo: lo mismo para todos (tickets, objetos) y un legendario variocolor que cambia de un jugador a otro
const BD_GIFT=()=>({t:Math.max(100000000,Math.round((typeof tps==="function"?tps():0)*3600*24)),it:{mb:5,crys:3,cand:30,ppmax:5,tshard:10},hold:3});
// fecha del cumpleaños en un año (a las 0:00 de tu dispositivo)
function bdDate(b,y){let d=b.d;if(b.m===2&&d===29&&!(y%4===0&&(y%100!==0||y%400===0)))d=28;return new Date(y,b.m-1,d)}
// ¿hay un cumpleaños por celebrar ahora? Devuelve su año o 0
function bdNow(){const b=S.bday;if(!bdOk(b))return 0;const now=new Date(),t0=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
  for(const y of [now.getFullYear(),now.getFullYear()-1]){const d=bdDate(b,y).getTime();
    if(t0>=d&&t0<=d+6*864e5&&S.bdy!==y&&(b.at||0)<=d-7*864e5)return y}
  return 0}
function bdLeg(y){const L=typeof NY_LEGS==="function"?NY_LEGS():P.filter(p=>p[2]==="L").map(p=>p[0]);if(!L.length)return null;
  let id="";try{id=(window.FB&&window.FB.uid&&window.FB.uid())||""}catch(e){}if(!id){S.nyid=S.nyid||Math.random().toString(36).slice(2);id=S.nyid}
  let h=2166136261;for(const ch of id+"|bday|"+y){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return L[h%L.length]}
function bdTxt(g,leg){return "✨ "+(leg||"Un legendario")+" variocolor + "+fmt(Math.round(g.t*RMUL()))+" 🎟️ + "+g.it.mb+" Master Ball + "+g.it.crys+" Cristales Supremos + "+g.it.cand+" Caramelos Raros + "+g.it.ppmax+" PP máximos + "+g.it.tshard+" Teralitos + "+g.hold+" objetos equipables"}
function bdClaim(y){if(S.bdy===y||bdNow()!==y)return null;const g=BD_GIFT(),leg=bdLeg(y);S.bdy=y;
  const rw={t:g.t,it:Object.assign({},g.it)};for(let i=0;i<g.hold;i++){const k=HOLD[Math.floor(Math.random()*HOLD.length)][0];rw.it[k]=(rw.it[k]||0)+1}grant(rw);
  let nw=false;if(leg){const lv=typeof clampL==="function"?clampL(Math.max(10,Math.min(typeof lvCap==="function"?lvCap():50,typeof leadLevel==="function"?leadLevel():10))):10;nw=giveMon(leg,lv,true)}
  save();try{render()}catch(e){}if(window.cloudFlush)try{window.cloudFlush(true)}catch(e){}return{leg,nw,g}}
// ---------- ventana: ¡feliz cumpleaños! ----------
function bdShow(y){if($("bdM"))return;const g=BD_GIFT(),leg=bdLeg(y),nick=typeof pvNick==="function"?pvClean(pvNick()):"";
  const M=document.createElement("div");M.id="bdM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");M.setAttribute("aria-label","Feliz cumpleaños");
  M.innerHTML='<div class="bdbox"><div class="bdconf" aria-hidden="true"></div><div class="bdcake" aria-hidden="true">🎂</div><small class="bdk">🎈 HOY ES UN DÍA ESPECIAL 🎈</small><h2>¡Feliz cumpleaños'+(nick?', '+esc(nick):'')+'!</h2>'+
    '<p>Todo el equipo de Poke Gacha Online te desea un día genial. ¡Gracias por jugar con nosotros! Aquí tienes tu regalo de cumpleaños:</p>'+
    (leg&&PM[leg]?'<div class="bdmon"><span class="bdimg">'+icoHD(PM[leg],120,false,true)+'</span><b>✨ '+esc(leg)+'</b><small>¡Un legendario variocolor solo para ti!</small></div>':'')+
    '<p class="bdgift">'+fmt(Math.round(g.t*RMUL()))+' 🎟️ · '+g.it.mb+' Master Ball · '+g.it.crys+' Cristales Supremos · '+g.it.cand+' Caramelos Raros · '+g.it.ppmax+' PP máximos · '+g.it.tshard+' Teralitos · '+g.hold+' objetos equipables</p>'+
    '<button type="button" class="red big" id="bdGo">🎁 ¡Abrir mi regalo!</button><button type="button" class="alt" id="bdX">Más tarde</button></div>';
  document.body.appendChild(M);try{snd("lvl")}catch(e){}
  const cf=M.querySelector(".bdconf");if(!(typeof hubCalm==="function"&&hubCalm()))for(let i=0;i<60;i++){const s=document.createElement("i");s.style.left=(Math.random()*100)+"%";s.style.background=["#ff5a6a","#ffd23f","#5ab4ff","#7aff8a","#e07aff","#ff9a3c"][i%6];s.style.animationDelay=(Math.random()*3)+"s";s.style.animationDuration=(2.4+Math.random()*2)+"s";cf.appendChild(s)}
  M.querySelector("#bdX").onclick=()=>M.remove();
  M.querySelector("#bdGo").onclick=()=>{const r=bdClaim(y);const b=M.querySelector("#bdGo");if(!r){b.disabled=true;b.textContent="✅ Ya lo has abierto";return}
    b.disabled=true;b.textContent="✅ ¡Regalo abierto!";M.querySelector("#bdX").textContent="Cerrar";snd("capok");try{if(r.leg&&PM[r.leg])cry(r.leg)}catch(e){}
    toast("🎂 ¡Feliz cumpleaños! "+(r.leg?"✨ "+r.leg+" se une a tu equipo. ":"")+"¡Regalo recibido!")};
}
// ---------- ventana: ¿cuándo es tu cumpleaños? ----------
function bdAsk(fromSettings){if($("bdAskM"))return;
  const M=document.createElement("div");M.id="bdAskM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");M.setAttribute("aria-label","Tu cumpleaños");
  M.innerHTML='<div class="jbox"><h2>🎂 ¿Cuándo es tu cumpleaños?</h2><p>El día de tu cumpleaños te felicitaremos con un <b>gran regalo</b>: tickets, Master Ball, Cristales Supremos… ¡y un legendario variocolor!</p>'+
    '<div class="bdsel"><select id="bdD" aria-label="Día"><option value="">Día</option>'+Array.from({length:31},(_,i)=>'<option value="'+(i+1)+'">'+(i+1)+'</option>').join("")+'</select>'+
    '<select id="bdMo" aria-label="Mes"><option value="">Mes</option>'+BD_MES.map((m,i)=>'<option value="'+(i+1)+'">'+m+'</option>').join("")+'</select></div>'+
    '<small id="bdMsg" class="mut">Solo el día y el mes, sin el año. Ojo: después no se puede cambiar.</small>'+
    '<div class="jrow"><button class="red" id="bdOk">Guardar</button><button class="alt" id="bdLater">'+(fromSettings?'Cancelar':'Más tarde')+'</button></div></div>';
  document.body.appendChild(M);
  const close=()=>{M.remove();bdSetUI()};
  M.querySelector("#bdLater").onclick=()=>{if(!fromSettings){if(S.bdAsk)S.bdAsk2=1;S.bdAsk=Date.now();save()}close()};
  M.querySelector("#bdOk").onclick=async()=>{const d=+$("bdD").value,m=+$("bdMo").value,msg=$("bdMsg");
    if(!d||!m){msg.textContent="Elige el día y el mes.";return}const b={d:d,m:m};if(!bdOk(b)){msg.textContent="Esa fecha no existe. Revisa el día y el mes.";return}
    if(!(await askOk("¿Tu cumpleaños es el "+BD_TXT(b)+"? Después no se podrá cambiar.")))return;
    S.bday={d:d,m:m,at:Date.now()};save();if(window.cloudFlush)try{window.cloudFlush(true)}catch(e){}snd("lvl");
    toast("🎂 ¡Apuntado! El "+BD_TXT(b)+" te espera un regalo especial.");close()};
}
// se pregunta después del apodo y del tutorial, sin pisar otras ventanas; si dices «Más tarde», se vuelve a preguntar una vez a la semana
function bdAskCheck(){try{if(typeof S==="undefined"||!S||S.bday||$("bdAskM")||$("bdM"))return;if(S.bdAsk2||(S.bdAsk&&Date.now()-S.bdAsk<7*864e5))return;
  if(!S.tutDone&&!((S.pulls|0)>0))return;if(typeof nkPopNeeded==="function"&&nkPopNeeded())return;if(typeof evpFree==="function"&&!evpFree())return;
  if($("nyM")||$("advM"))return;bdAsk(false)}catch(e){}}
function bdCheck(){try{if(typeof S==="undefined"||!S||$("bdM"))return;const y=bdNow();if(!y)return;if(window._bdShown===y)return;
  if(typeof evpFree==="function"&&!evpFree())return;if($("nyM")||$("bdAskM"))return;window._bdShown=y;bdShow(y)}catch(e){}}
setInterval(()=>{bdCheck();bdAskCheck()},4000);
// ---------- en Ajustes › Juego ----------
function bdSetUI(){const host=document.querySelector('#optp .setpane[data-st="game"]');if(!host)return;let box=$("bdSetBox");
  if(!box){box=document.createElement("div");box.id="bdSetBox";host.appendChild(box)}
  const b=S.bday;box.innerHTML='<h4>🎂 Cumpleaños</h4>'+(bdOk(b)?'<div class="slid"><span>Tu cumpleaños: <b>'+BD_TXT(b)+'</b></span><small class="mut">No se puede cambiar</small></div>':
    '<div class="slid"><span>Pon tu cumpleaños y te felicitaremos con un gran regalo</span><button type="button" id="bdSetBtn">🎂 Poner mi cumpleaños</button></div>')}
document.addEventListener("click",e=>{if(e.target&&e.target.id==="bdSetBtn")bdAsk(true)});
setInterval(()=>{const b=$("bdSetBox"),k=JSON.stringify(S.bday||0);if(!b||b.dataset.k!==k){bdSetUI();const n=$("bdSetBox");if(n)n.dataset.k=k}},2000);
// ---------- en el calendario de eventos: tu cumpleaños, si es en los próximos 7 días ----------
{const _ce=calEvents;calEvents=function(){const L=_ce.apply(this,arguments);try{const b=S.bday;if(bdOk(b)){const now=new Date();
  for(const y of [now.getFullYear(),now.getFullYear()+1]){const a=bdDate(b,y).getTime();if(a+864e5>Date.now()&&a<Date.now()+7*864e5){
    L.push({a:a,b:a+864e5,ic:"🎂",t:"¡Tu cumpleaños!",d:"Te espera un regalo especial: "+bdTxt(BD_GIFT(),bdLeg(y)),c:"#ff7ab6"});break}}}
  L.sort((x,z)=>x.a-z.a)}catch(e){}return L}}
// (para el orden de las ventanas al entrar)
{const _pb=popBusy;popBusy=function(){return _pb.apply(this,arguments)||!!$("bdAskM")||!!$("bdM")}}
