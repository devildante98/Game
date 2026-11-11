// =====================================================================================
// PC DE TU HABITACIÓN: retos de partida para Exploración
// · Modo Locke (como los retos «Nuzlocke» de los fans y el Pokémon Añil): motes obligatorios, solo el primer
//   Pokémon de cada zona, muerte permanente (Cementerio), cláusulas de duplicados y variocolor, sin objetos en
//   combate, modo Set y rivales más fuertes.
// · Modo Random: Pokémon salvajes y de entrenadores totalmente aleatorios de todas las generaciones.
// Todo se guarda en S.xg (la partida de Exploración), así que no afecta al juego normal.
// =====================================================================================
const LKR=[
  ["mote","🏷️ Motes obligatorios","Cada Pokémon que captures tiene que llevar mote (también tu equipo al activar el reto)."],
  ["first","1️⃣ Solo el primer Pokémon de cada zona","Únicamente puedes capturar el primer Pokémon salvaje que encuentres en cada ruta, cueva o zona. Si huyes, lo debilitas o se escapa, ya no podrás capturar en esa zona."],
  ["death","💀 Muerte permanente","Si un Pokémon se debilita, muere: se va al Cementerio del PC y no puede volver al equipo. No se pueden usar Revivir en combate."],
  ["dupe","♻️ Cláusula de duplicados","Si el primer Pokémon de una zona es de una especie que ya tienes (o que está en el Cementerio), no cuenta y puedes seguir buscando."],
  ["shiny","✨ Cláusula variocolor","Los Pokémon variocolor se pueden capturar siempre, aunque ya hayas usado la captura de esa zona."],
  ["noitem","🎒 Sin objetos en combate","En combate solo puedes usar Poké Balls (nada de pociones ni curas)."],
  ["set","🔁 Modo Set","Cuando el rival va a sacar otro Pokémon, no se te ofrece cambiar el tuyo."],
  ["hard","💪 Rivales más fuertes","Los Pokémon de los entrenadores tienen 2 niveles más."]];
const LKDEF={mote:1,first:1,death:1,dupe:1,shiny:1,noitem:0,set:0,hard:0};
const RNDR=[["w","🌿 Pokémon salvajes aleatorios","Cada Pokémon salvaje es de una especie al azar de cualquier generación."],["t","🧢 Entrenadores aleatorios","Los equipos de todos los entrenadores (también líderes, Alto Mando y Equipo Ocaso) son aleatorios. Se mantienen sus niveles."],["l","👑 Incluir legendarios y singulares","Si está apagado, el azar no saca legendarios ni singulares."]];
function lkD(){const X=xgData();if(!X.lk||typeof X.lk!=="object")X.lk={on:0,r:Object.assign({},LKDEF),z:{},dead:[],fail:0};const L=X.lk;L.r=L.r||Object.assign({},LKDEF);L.z=L.z||{};L.dead=L.dead||[];
  if(!X.rnd||typeof X.rnd!=="object")X.rnd={w:0,t:0,l:1};return L}
const rnD=()=>{lkD();return S.xg.rnd};
const lkOn=r=>{const L=lkD();return !!L.on&&(!r||!!L.r[r])};
const lkDead=n=>lkD().dead.some(d=>d.n===n);
const lkEx=()=>typeof XGSW!=="undefined"&&!!XGSW&&typeof EX!=="undefined"&&!!EX.battle;
// ---------- Modo Random ----------
let RNDP=null;
function rndPool(leg){if(!RNDP)RNDP=P.filter(p=>p&&p[0]&&PM[p[0]]&&!/^Mega[ -]|Gigamax|Primigeni|Eternamax|Dinamax/i.test(p[0]));
  return leg?RNDP:RNDP.filter(p=>p[2]!=="L")}
function rndMon(m,leg){const L=rndPool(leg),p=L[Math.floor(Math.random()*L.length)],e=mkEnemy(p,m.l);if(m.sh)e.sh=1;return e}
// ---------- combates de Exploración: azar, niveles y la regla de la primera captura ----------
{const _xb=exBattle;exBattle=function(cfg,npc){
  try{if(cfg&&Array.isArray(cfg.eteam)&&cfg.eteam.length&&!cfg.cap){const R=rnD();
      if(R.w&&cfg.wild)cfg.eteam=cfg.eteam.map(m=>rndMon(m,!!R.l));
      else if(R.t&&cfg.trainer)cfg.eteam=cfg.eteam.map(m=>rndMon(m,!!R.l));
      if(lkOn("hard")&&cfg.trainer)cfg.eteam=cfg.eteam.map(m=>{const e=mkEnemy(m.p,clampL(m.l+2));if(m.sh)e.sh=1;return e})}}catch(e){console.error(e)}
  const pr=_xb.apply(this,arguments);
  try{const L=lkD();if(EX.battle&&L.on&&cfg&&cfg.wild&&cfg.eteam&&cfg.eteam[0]){const m=cfg.eteam[0],sp=m.p[0],z=EX.map,zn=(EX.M&&EX.M.n)||z,st=L.z[z];
    const own=xgRun(()=>S.owned[sp]>0)||lkDead(sp);let lk;
    if(!L.r.first)lk={ok:1};
    else if(L.r.shiny&&m.sh)lk={ok:1,sh:1};
    else if(st)lk={ok:0,why:"used",st:st};
    else if(L.r.dupe&&own)lk={ok:0,why:"dupe"};
    else{L.z[z]={p:sp,s:"e",n:zn,t:Date.now()};lk={ok:1,z:z};save();setTimeout(()=>toast("🎯 Primer encuentro en "+zn+": ¡es tu única oportunidad de capturar aquí!"),900)}
    EX.battle.lk=lk}}catch(e){console.error(e)}
  return pr}}
// Poké Balls: se bloquean si la regla no te deja capturar este Pokémon
{const _t=turn;turn=async function(k){try{if(typeof k==="string"&&k.slice(0,2)==="i:"&&B&&B.mode==="s"&&!B.busy&&!B.trainer&&lkEx()&&lkOn()){
    const it=ITEMS.find(i=>i[0]===k.slice(2));if(it&&it[3]&&S.bag[it[0]]>0){const lk=EX.battle.lk||{ok:1},sp=beAct(B.E.sd[1]).p[0];let msg="";
      if(lkDead(sp))msg="🔒 Regla Locke: "+sp+" está en tu Cementerio. No puedes capturar otro.";
      else if(!lk.ok)msg=lk.why==="dupe"?"🔒 Regla Locke: ya tienes un "+sp+". Por la cláusula de duplicados no cuenta: sigue buscando en esta zona.":"🔒 Regla Locke: ya usaste la captura de esta zona ("+(lk.st&&lk.st.p?lk.st.p:"")+"). Solo puedes capturar el primer Pokémon de cada zona.";
      if(msg){B.busy=true;setMenu(false);await say(msg);B.busy=false;setMenu(true);return}}}}catch(e){console.error(e)}
  return _t.apply(this,arguments)}}
// sin objetos / sin Revivir en la Bolsa de combate
{const _sm=setMenu;setMenu=function(v){const r=_sm.apply(this,arguments);try{if(v==="bag"&&lkEx()&&lkOn()){const L=lkD();
  $("menu").querySelectorAll('[data-k^="i:"]').forEach(b=>{const it=ITEMS.find(i=>i[0]===b.dataset.k.slice(2));if(!it)return;if((L.r.noitem&&!it[3])||(L.r.death&&it[5]))b.remove()});
  if(L.r.noitem&&!$("menu").querySelector(".lkno"))$("menu").insertAdjacentHTML("afterbegin",'<p class="lkno mut">🔒 Regla Locke: en combate solo puedes usar Poké Balls.</p>')}}catch(e){}return r}}
// Modo Set: no se ofrece cambiar cuando el rival saca otro Pokémon
{const _as=askShift;askShift=async function(){if(lkEx()&&lkOn("set"))return -1;return _as.apply(this,arguments)}}
// ---------- motes obligatorios ----------
const LKMOTES=["Chispa","Bruma","Pistacho","Ruedas","Galleta","Trueno","Canela","Rocky","Luna","Coco","Nube","Tango","Mango","Brisa","Kiwi","Fuego","Lince","Sombra","Pipo","Nieve","Pepa","Cometa","Toffee","Ámbar","Ciruela","Lucero","Pimienta","Roble"];
async function lkAskMote(sp,why){for(;;){const v=await uiDlg((why||"🏷️ Regla Locke: ponle un mote a ")+sp+". (Si no se te ocurre ninguno, pulsa «Al azar».)",{inp:"",max:12,yes:"Poner mote",no:"🎲 Al azar"});
  let n=v==null?LKMOTES[Math.floor(Math.random()*LKMOTES.length)]:String(v).replace(/[<>]/g,"").trim().slice(0,12);if(n&&n!==sp)return n;if(v==null)return LKMOTES[0]}}
function lkSetMote(sp,n){xgRun(()=>{S.mote=S.mote||{};S.mote[sp]=n});save()}
// ---------- muerte permanente y fin del reto ----------
async function lkDeaths(){if(!lkEx()||!lkOn("death")||EX.noFaint)return;const L=lkD(),sd=B&&B.E&&B.E.sd[0];if(!sd||sd._lkDone)return;sd._lkDone=1;
  const fall=sd.t.filter(t=>t.mh<=0).map(t=>t.p[0]).filter(n=>!lkDead(n));
  for(const n of fall){const k=xgRun(()=>(S.mote&&S.mote[n])||"");L.dead.push({n:n,k:k,l:xgRun(()=>lvd(n).l),z:(EX.M&&EX.M.n)||EX.map,t:Date.now()});
    xgRun(()=>{S.team=(S.team||[]).map(x=>x===n?"":x);S.hp[n]=0});snd("faint");try{await say("💀 "+(k||n)+(k?" ("+n+")":"")+" ha caído en combate. Descansará para siempre en el Cementerio del PC.")}catch(e){}}
  if(fall.length)save();lkWipe()}
function lkWipe(){const L=lkD();if(!L.on||!L.r.death||L.fail)return;const alive=xgRun(()=>Object.keys(S.owned).filter(n=>S.owned[n]>0&&PM[n]&&!lkDead(n)));
  if(!alive.length){L.fail=Date.now();save();setTimeout(()=>uiDlg("☠️ Todos tus Pokémon han caído. Tu reto Locke ha terminado. Puedes verlo en el PC de tu habitación, donde también puedes desactivar el modo Locke.",{alert:true,yes:"Entendido"}),400)}}
{const _f=finish;finish=async function(res){try{if(lkEx()&&lkOn()){
    if(res==="cap"){const L=lkD(),lk=EX.battle.lk,sp=beAct(B.E.sd[1]).p[0];if(lk&&lk.z&&L.z[lk.z])L.z[lk.z].s="c";
      if(L.r.mote&&!xgRun(()=>S.mote&&S.mote[sp])){const n=await lkAskMote(sp);lkSetMote(sp,n);try{await say("¡"+sp+" ahora se llama «"+n+"»!")}catch(e){}}}
    await lkDeaths()}}catch(e){console.error(e)}
  return _f.apply(this,arguments)}}
// huir no pasa por finish: también cuenta para los caídos
{const _t2=turn;turn=async function(k){const r=await _t2.apply(this,arguments);try{if(k==="f"&&B&&!B.trainer&&lkEx()&&lkOn("death")&&$("menu").querySelector('[data-k="9"]'))await lkDeaths()}catch(e){}return r}}
// los caídos no pueden volver al equipo (ni recibir objetos)
window.addEventListener("click",e=>{try{if(!lkOn("death"))return;const box=e.target.closest&&e.target.closest("#exTeam");if(!box)return;const el=e.target.closest("[data-xg],[data-xun],[data-xub],[data-xuse],[data-xgi]");if(!el)return;
  const v=Object.values(el.dataset);const n=v.find(x=>lkDead(x));if(n){e.preventDefault();e.stopImmediatePropagation();snd("ui");toast("🪦 "+n+" está en el Cementerio: no puede volver a luchar.")}}catch(x){}},true);
setInterval(()=>{try{const L=lkD();if(!L.on||!L.r.death||!L.dead.length||(typeof fcd!=="undefined"&&fcd))return;
  const bad=xgRun(()=>(S.team||[]).some(n=>n&&lkDead(n)));if(bad){xgRun(()=>{S.team=S.team.map(n=>n&&lkDead(n)?"":n)});save();const t=$("exTeam");if(t&&!t.hidden)try{xgPanel()}catch(e){}}}catch(e){}},1000);
{const _p=xgPanel;xgPanel=function(){const r=_p.apply(this,arguments);try{if(lkOn("death")){const box=$("exTeam");if(box)box.querySelectorAll(".xgc[data-xg]").forEach(c=>{if(lkDead(c.dataset.xg)){c.classList.add("lkdead");c.title="En el Cementerio";if(!c.querySelector(".lkrip"))c.insertAdjacentHTML("beforeend",'<small class="lkrip">🪦 Cementerio</small>')}})}}catch(e){}return r}}
// ---------- el PC ----------
function lkOpen(){const sc=document.querySelector("#explPB .exscr")||document.querySelector(".exwrap .exscr");if(!sc)return;let d=$("exPC");
  if(!d){d=document.createElement("div");d.id="exPC";d.className="exteam expc";sc.appendChild(d);d.addEventListener("click",lkClick);d.addEventListener("change",lkChange)}
  lkUI();d.hidden=false;snd("ui")}
function lkUI(){const d=$("exPC");if(!d)return;const L=lkD(),R=rnD(),zs=Object.values(L.z).sort((a,b)=>(a.t||0)-(b.t||0)),alive=xgRun(()=>Object.keys(S.owned).filter(n=>S.owned[n]>0&&PM[n]&&!lkDead(n)).length);
  const chk=(attr,on,dis)=>'<input type="checkbox" '+attr+(on?' checked':'')+(dis?' disabled':'')+'>';
  d.innerHTML='<div class="xgh"><b>💻 PC de tu habitación</b><button type="button" class="alt" data-lkx="close">Cerrar</button></div>'+
  '<p class="mut">Retos para tu partida de Exploración, como los que hacen los fans de la saga (por ejemplo, el Pokémon Añil). No afectan al juego normal.</p>'+
  '<section class="lksec'+(L.on?' on':'')+'"><label class="lkmain">'+chk('data-lk="on"',L.on)+'<span><b>🔒 Modo Locke</b><small>'+(L.on?(L.fail?'☠️ Reto terminado: todos tus Pokémon cayeron.':'Activo · '+zs.length+' zonas usadas · '+L.dead.length+' caídos · '+alive+' vivos'):'Apagado. Elige las reglas y actívalo cuando quieras.')+'</small></span></label>'+
  '<div class="lkrules">'+LKR.map(([k,t,s])=>'<label class="lkr">'+chk('data-lkr="'+k+'"',L.r[k])+'<span><b>'+t+'</b><small>'+s+'</small></span></label>').join("")+'</div></section>'+
  '<section class="lksec'+(R.w||R.t||R.i?' on':'')+'"><b class="lkh">🎲 Modo Random</b><div class="lkrules">'+RNDR.map(([k,t,s])=>'<label class="lkr">'+chk('data-rn="'+k+'"',R[k])+'<span><b>'+t+'</b><small>'+s+'</small></span></label>').join("")+'</div></section>'+
  (L.on||zs.length?'<section class="lksec"><b class="lkh">🗺️ Capturas por zona</b>'+(zs.length?'<div class="lkzs">'+zs.map(z=>'<span class="lkz '+(z.s==="c"?"ok":"ko")+'"><b>'+esc(z.n)+'</b>'+(PM[z.p]?ico(PM[z.p],32):'')+esc(z.p)+' · '+(z.s==="c"?'✅ capturado':'❌ perdido')+'</span>').join("")+'</div>':'<p class="mut">Todavía no has tenido ningún encuentro con el modo Locke activo.</p>')+'</section>':'')+
  (L.dead.length?'<section class="lksec"><b class="lkh">🪦 Cementerio ('+L.dead.length+')</b><div class="lkzs">'+L.dead.map(x=>'<span class="lkz rip">'+(PM[x.n]?ico(PM[x.n],32):'')+'<b>'+esc(x.k||x.n)+'</b>'+(x.k?esc(x.n)+' · ':'')+'Nv'+x.l+' · '+esc(x.z||"")+'</span>').join("")+'</div></section>':'')+
  (L.on?'<div class="jrow"><button type="button" class="alt" data-lkx="reset">↺ Empezar el reto de nuevo</button></div>':'')}
async function lkChange(e){const t=e.target;if(!t||t.type!=="checkbox")return;const L=lkD(),R=rnD();
  if(t.dataset.lk==="on"){if(t.checked){t.checked=false;
      if(!await uiDlg("¿Activar el modo Locke en tu partida de Exploración? Las reglas marcadas se aplican desde ahora. Las capturas que ya tienes no cuentan, y puedes cambiar las reglas cuando quieras desde este PC.",{yes:"¡Activar!",no:"Todavía no"})){lkUI();return}
      L.on=1;L.fail=0;L.since=Date.now();save();snd("lvl");
      if(L.r.mote){const tm=xgRun(()=>(S.team||[]).filter(n=>n&&S.owned[n]&&!(S.mote&&S.mote[n])));for(const n of tm){const k=await lkAskMote(n,"🏷️ Regla Locke: tu equipo también lleva mote. ¿Cómo se llama tu ");lkSetMote(n,k)}}
      toast("🔒 Modo Locke activado. ¡Suerte!")}
    else{t.checked=true;if(!await uiDlg("¿Desactivar el modo Locke? Tus caídos se quedan en el Cementerio y las zonas usadas se guardan por si lo vuelves a activar.",{yes:"Desactivar",no:"Seguir con el reto",danger:true})){lkUI();return}L.on=0;save();toast("Modo Locke desactivado")}
    lkUI();return}
  if(t.dataset.lkr){L.r[t.dataset.lkr]=t.checked?1:0;save();snd("ui");lkUI();return}
  if(t.dataset.rn){R[t.dataset.rn]=t.checked?1:0;save();snd("ui");toast(t.dataset.rn==="l"?(t.checked?"👑 El azar puede sacar legendarios":"El azar ya no saca legendarios"):"🎲 "+(t.checked?"Activado":"Desactivado")+": "+RNDR.find(x=>x[0]===t.dataset.rn)[1].replace(/^\S+ /,""));lkUI()}}
async function lkClick(e){const b=e.target.closest("[data-lkx]");if(!b)return;e.stopPropagation();
  if(b.dataset.lkx==="close"){$("exPC").hidden=true;snd("ui");try{EX.cv.focus({preventScroll:true})}catch(x){}return}
  if(b.dataset.lkx==="reset"){if(!await uiDlg("¿Empezar el reto Locke de nuevo? Se borran las zonas usadas, el Cementerio se vacía y tus caídos pueden volver al equipo.",{yes:"Empezar de nuevo",no:"Cancelar",danger:true}))return;
    const L=lkD();L.z={};L.dead=[];L.fail=0;L.since=Date.now();save();snd("lvl");lkUI();toast("↺ Reto Locke reiniciado")}}
// el PC se maneja con el mando y el teclado como los demás paneles
XOV_IDS.push("exPC");
// interactuar con el ordenador de tu cuarto
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&EX.map==="casa_up"){const[dx,dy]=EXDIR[EX.f],c=exAt(EX.x+dx,EX.y+dy);
  if(c==="O"&&!EX.npcs.some(n=>n.px===EX.x+dx&&n.py===EX.y+dy)){snd("ui");exSay(["Enciendes tu PC…","«Retos de partida» · Modo Locke y Modo Random."],()=>lkOpen());return}}}catch(e){}return _i.apply(this,arguments)}}
// aviso en pantalla mientras hay un reto activo
setInterval(()=>{try{const sc=document.querySelector("#explPB .exscr");if(!sc)return;let e=$("exLkChip");const L=lkD(),R=rnD(),on=L.on||R.w||R.t||R.i;
  if(!on){if(e)e.remove();return}if(!e){e=document.createElement("div");e.id="exLkChip";e.className="exlkchip";sc.appendChild(e)}
  let t=(L.on?(L.fail?"☠️ Locke terminado":"🔒 Locke"):"")+(R.w||R.t||R.i?(L.on?" · ":"")+"🎲 Random":"");
  if(L.on&&L.r.first&&EX.M&&!/^(casa|centro|tienda|gym_|liga|lab)|_h/.test(EX.map||"")){const z=L.z[EX.map];t+=" · "+(z?(z.s==="c"?"✅ ":"❌ ")+"captura usada aquí":"🎯 captura libre aquí")}
  if(e.textContent!==t)e.textContent=t}catch(x){}},700);
// mando: con un cuadro de texto abierto (mote), A acepta y B pone uno al azar
{const _gp=gpPoll;gpPoll=function(){const dl=document.querySelector(".uidlg .uidin");if(dl){const L=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[],gp=L[0];
  if(gp){const P0=exPad(),pr=i=>i>=0&&!!(gp.buttons[i]&&gp.buttons[i].pressed);const ea=pr(P0.a)&&!GP.prev[P0.a],eb=pr(P0.b)&&!GP.prev[P0.b];
    for(let i=0;i<gp.buttons.length;i++)GP.prev[i]=pr(i);const M=dl.closest(".uidlg");
    if(ea){const y=M.querySelector('[data-u="1"]');if(!dl.value.trim()){const n=M.querySelector('[data-u="0"]');if(n)n.click()}else if(y)y.click()}else if(eb){const n=M.querySelector('[data-u="0"]');if(n)n.click()}return}}
  return _gp.apply(this,arguments)}}
