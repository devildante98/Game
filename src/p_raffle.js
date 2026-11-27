// =====================================================================================
// SORTEOS
// · Jugadores: en Más › 🎉 Sorteos ven los sorteos abiertos (premio, ganadores, cuánto falta y cuántos se han apuntado)
//   y se apuntan con un toque (una vez por cuenta; pueden borrarse mientras siga abierto). Si ganan, al entrar les sale
//   un aviso para reclamar el premio, que entrega el servidor (_server/sorteo.js).
// · Administradores: ven la lista de apuntados (👥 Ver apuntados) y en el mismo apartado crean sorteos (título, premio, nº de ganadores y fecha de cierre), los sortean
//   cuando quieran (los ganadores salen al azar entre los apuntados) y los borran.
// =====================================================================================
const RF={list:[],cnt:{},inn:{},got:{},busy:false,t:0};
const RF_TXT={"sorteo-no":"Ese sorteo ya no existe.","sorteo-abierto":"Ese sorteo todavía no se ha hecho.","sorteo-no-ganador":"No estás entre los ganadores de ese sorteo.","sorteo-cobrado":"Ya has reclamado ese premio."};
const rfOn=()=>!!(window.FB&&window.FB.uid&&window.FB.uid()&&window.FB.rfList);
const rfLeft=ms=>{if(ms<=0)return "cerrado";const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.ceil(ms%36e5/6e4);return d?d+" d "+h+" h":h?h+" h "+m+" min":m+" min"};
const rfPrize=r=>typeof codePrizeTxt==="function"?codePrizeTxt({t:r.t,it:r.it,mon:r.mon,sh:r.sh}):"";
async function rfLoad(){if(!rfOn())return;try{RF.list=await window.FB.rfList()}catch(e){return}const me=window.FB.uid(),adm=typeof MOD!=="undefined"&&MOD.admin;
  await Promise.all(RF.list.map(async r=>{
    // los jugadores ven el contador del sorteo; los administradores cuentan la lista real y corrigen el contador si no cuadra
    if(adm){const c=await window.FB.rfCount(r.id);RF.cnt[r.id]=c;if(c!=null&&r.st==="open"&&(+r.n||0)!==c)try{await window.FB.rfSave(r.id,{n:c});r.n=c}catch(e){}}
    else RF.cnt[r.id]=typeof r.n==="number"?Math.max(0,r.n):null;if(r.st==="open")try{RF.inn[r.id]=await window.FB.rfIn(r.id)}catch(e){}
    if(r.st==="done"&&Array.isArray(r.win)&&r.win.includes(me)&&RF.got[r.id]==null)RF.got[r.id]=await window.FB.rfClaimed(r.id)}));RF.t=Date.now()}
function rfUI(){const b=$("rafPB");if(!b)return;if(!rfOn()){b.innerHTML='<p class="mut">Inicia sesión con tu cuenta para apuntarte a los sorteos.</p>';return}
  const me=window.FB.uid(),adm=typeof MOD!=="undefined"&&MOD.admin,now=Date.now();
  const open=RF.list.filter(r=>r.st==="open"),done=RF.list.filter(r=>r.st==="done").slice(0,8);
  const card=r=>{const left=r.end-now,cnt=RF.cnt[r.id],win=Array.isArray(r.win)&&r.win.includes(me);
    let act="";
    if(r.st==="open")act=left>0?(RF.inn[r.id]?'<span class="rfin">✅ Estás apuntado</span><button class="alt mini" data-rfl="'+esc(r.id)+'">Borrarme</button>':'<button class="red" data-rfj="'+esc(r.id)+'">🎟️ ¡Apuntarme!</button>'):'<span class="mut">⏳ Cerrado, pendiente de sortear</span>';
    else act=(r.wn&&r.wn.length?'<span class="rfwin">🏆 '+r.wn.map(n=>esc(pvClean(n))).join(" · ")+'</span>':'<span class="mut">Nadie se apuntó</span>')+(win?(RF.got[r.id]?'<span class="rfin">✅ Premio reclamado</span>':'<button class="red" data-rfc="'+esc(r.id)+'">🎁 ¡Reclamar mi premio!</button>'):'');
    const ad=adm?'<div class="rfadm">'+(r.st==="open"?'<button class="alt mini" data-rfe="'+esc(r.id)+'">✏️ Cambiar premio</button><button class="alt mini" data-rfd="'+esc(r.id)+'">🎲 Sortear ahora</button>':'')+'<button class="alt mini" data-rfx="'+esc(r.id)+'">🗑️ Borrar</button></div>':'';
    return '<div class="rfcard'+(r.st==="done"?' done':'')+(win?' won':'')+'"><div class="rfh"><b>'+esc(r.tt||"Sorteo")+'</b><small>'+(r.st==="open"?(left>0?'Cierra en '+rfLeft(left):'Cerrado'):'Sorteado')+'</small></div>'+
      (r.up&&r.st==="open"?'<span class="rfup">✨ ¡Premio mejorado!</span>':'')+'<div class="rfp">🎁 '+esc(rfPrize(r))+'</div><small class="mut">'+(r.nw|0)+' ganador'+((r.nw|0)===1?'':'es')+(cnt!=null?' · '+cnt+' apuntado'+(cnt===1?'':'s'):'')+'</small>'+(adm&&cnt?'<button class="alt mini rfwho" data-rfw="'+esc(r.id)+'">👥 Ver apuntados</button>':'')+'<div class="rfact">'+act+'</div>'+ad+'</div>'};
  let h='';
  if(adm)h+='<details class="rfnew"'+(RF.newOpen?' open':'')+'><summary>➕ Crear un sorteo (solo administradores)</summary><div class="codeform">'+
    '<label class="cdwide">Título<input id="rfT" maxlength="80" placeholder="Sorteo de Navidad"></label><label>Tickets<input id="rfTk" type="number" min="0" value="0"></label>'+
    (typeof CODE_ITEMS!=="undefined"?CODE_ITEMS:[]).map(x=>'<label>'+x[1]+'<input data-rfi="'+x[0]+'" type="number" min="0" value="0"></label>').join("")+
    '<label>Pokémon (opcional)'+(typeof pkPickField==="function"?pkPickField("rfM"):'<input id="rfM">')+'</label><label class="cdchk"><input id="rfS" type="checkbox"> Variocolor</label>'+
    '<label>Nº de ganadores<input id="rfN" type="number" min="1" value="1"></label><label>Cierra el día<input id="rfD" type="date"></label><label>a las<input id="rfH" type="time" value="21:00"></label>'+
    '</div><button class="red" id="rfSave">🎉 Crear sorteo</button><small id="rfMsg" class="mut"></small>'+'</details>';
  h+='<h3 class="shh">🎉 Sorteos abiertos</h3>'+(open.length?'<div class="rfl">'+open.map(card).join("")+'</div>':'<p class="mut">Ahora mismo no hay sorteos abiertos. ¡Atento a las Novedades y al chat!</p>');
  if(done.length)h+='<h3 class="shh">🏆 Últimos sorteos</h3><div class="rfl">'+done.map(card).join("")+'</div>';
  const keep=adm&&$("rfT")?{t:$("rfT").value,tk:$("rfTk").value,m:$("rfM").value,s:$("rfS").checked,n:$("rfN").value,d:$("rfD").value,h:$("rfH").value,it:[...document.querySelectorAll("[data-rfi]")].map(i=>i.value)}:null;
  b.innerHTML=h;
  if(keep){$("rfT").value=keep.t;$("rfTk").value=keep.tk;if(typeof pkPickSet==="function")pkPickSet("rfM",keep.m);else $("rfM").value=keep.m;$("rfS").checked=keep.s;$("rfN").value=keep.n;$("rfD").value=keep.d;$("rfH").value=keep.h;document.querySelectorAll("[data-rfi]").forEach((i,k)=>i.value=keep.it[k]||0)}
  if(RF.msg&&$("rfMsg")){$("rfMsg").textContent=RF.msg;RF.msg=""}
  const det=b.querySelector(".rfnew");if(det)det.addEventListener("toggle",()=>{RF.newOpen=det.open})}
async function rfRefresh(){await rfLoad();rfUI()}
nxPanel("rafP","🎉 Sorteos","Apúntate a los sorteos con un toque y, si te toca, reclama tu premio. Cada cuenta se puede apuntar una vez a cada sorteo.");
{const g=HUB.find(x=>x.k==="mas");if(g&&!g.tabs.some(t=>t[0]==="rafP"))g.tabs.splice(Math.min(2,g.tabs.length),0,["rafP","🎉 Sorteos"]);HUBP.rafP="mas";HUBR.rafP=()=>{rfUI();rfRefresh()}}
setInterval(()=>{try{if(typeof nxOpen==="function"&&nxOpen("rafP"))rfRefresh()}catch(e){}},30000);
// ---------- acciones ----------
async function rfClaim(id){if(RF.busy)return;RF.busy=true;
  try{const r=await window.srvAccion({k:"sorteo",id:id},srvJ,r=>{const p=r.sorteo;if(!p)return;
      S.t=(S.t||0)+(p.t||0);S.bag=S.bag||{};Object.keys(p.it||{}).forEach(k=>{S.bag[k]=(S.bag[k]||0)+p.it[k]});
      if(p.mon&&PM[p.mon]){const lv=typeof clampL==="function"?clampL(Math.max(5,Math.min(typeof lvCap==="function"?lvCap():50,typeof leadLevel==="function"?leadLevel():5))):5;giveMon(p.mon,lv,!!p.sh)}
      save();try{render()}catch(e){}RF.got[id]=true;snd("win");toast("🎉 ¡Premio del sorteo «"+(p.tt||"")+"» recibido! "+rfPrize(p))});
    if(!r||!r.ok){const m=(r&&RF_TXT[r.why])||(r&&typeof srvErr==="function"&&srvErr(r))||"No se ha podido reclamar. Inténtalo en un momento.";toast("⚠️ "+m);if(r&&r.why==="sorteo-cobrado")RF.got[id]=true}}
  catch(e){toast("⚠️ No hay conexión con el servidor. Inténtalo en un momento.")}
  finally{RF.busy=false;const m=$("rfWinM");if(m&&RF.got[id])m.remove();rfUI()}}
async function rfDraw(id){const r=RF.list.find(x=>x.id===id);if(!r)return;
  let E=[];try{E=await window.FB.rfEntries(id)}catch(e){toast("No se han podido leer los apuntados.");return}
  if(!(await askOk("¿Sortear «"+(r.tt||"Sorteo")+"» ahora entre "+E.length+" apuntado"+(E.length===1?"":"s")+"? Saldrán "+Math.min(r.nw|0,E.length)+" ganador"+(Math.min(r.nw|0,E.length)===1?"":"es")+".")))return;
  // ganadores al azar (con números aleatorios seguros del navegador)
  const rnd=n=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n};
  for(let i=E.length-1;i>0;i--){const j=rnd(i+1);[E[i],E[j]]=[E[j],E[i]]}
  const W=E.slice(0,Math.max(0,r.nw|0));
  try{await window.FB.rfSave(id,{st:"done",win:W.map(x=>x.u),wn:W.map(x=>String(x.n||"Entrenador").slice(0,30)),drawAt:Date.now()});snd("win");if(typeof dcAviso==="function")dcAviso("sorteo",id);
    toast(W.length?"🎉 Ganador"+(W.length>1?"es":"")+": "+W.map(x=>pvClean(x.n||"")).join(", "):"Nadie se había apuntado.");rfRefresh()}catch(e){toast("No se ha podido guardar el resultado ("+((e&&e.code)||"error")+").")}}
async function rfCreate(){const m=$("rfMsg"),tt=$("rfT").value.trim().slice(0,80);if(!tt){m.textContent="Ponle un título al sorteo.";return}
  const it={};document.querySelectorAll("[data-rfi]").forEach(i=>{const v=Math.floor(+i.value||0);if(v>0)it[i.dataset.rfi]=Math.min(v,9999)});
  const mon=$("rfM").value.trim(),t=Math.max(0,Math.floor(+$("rfTk").value||0));if(mon&&!PM[mon]){m.textContent="Ese Pokémon no existe. Elige uno de la lista.";return}
  if(!t&&!mon&&!Object.keys(it).length){m.textContent="Pon al menos un premio.";return}
  const d=$("rfD").value,h=$("rfH").value||"21:00";if(!d){m.textContent="Elige el día de cierre.";return}const end=new Date(d+"T"+h+":00").getTime();
  if(!(end>Date.now())){m.textContent="La fecha de cierre tiene que ser en el futuro.";return}
  const nw=Math.max(1,Math.min(100,Math.floor(+$("rfN").value||1)));
  try{const ref=await window.FB.rfSave(null,{tt:tt,t:t,it:it,mon:mon||null,sh:mon&&$("rfS").checked?1:0,nw:nw,end:end,st:"open",win:[],wn:[],at:Date.now()});RF.msg="✅ Sorteo «"+tt+"» creado.";if(ref&&ref.id&&typeof dcAviso==="function")dcAviso("sorteo",ref.id);$("rfT").value="";snd("win");rfRefresh()}
  catch(e){m.textContent="No se ha podido crear ("+((e&&e.code)||"error")+")."}}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest||!t.closest("#rafPB,#rfWinM,#rfAnnM,#rfEdM"))return;
  if(t.closest("#rfSave")){rfCreate();return}
  const ed=t.closest("[data-rfe]");if(ed){rfEdit(ed.dataset.rfe);return}
  if(t.closest("#rfEdOk")){rfEditSave();return}
  if(t.closest("[data-rfex]")||t.id==="rfEdM"){const M=$("rfEdM");if(M)M.remove();return}
  const j=t.closest("[data-rfj]");if(j){j.disabled=true;{const a=$("rfAnnM");if(a)a.remove()}try{await window.FB.rfJoin(j.dataset.rfj,pvClean(pvNick()));RF.inn[j.dataset.rfj]=true;snd("ui");toast("🎟️ ¡Te has apuntado al sorteo! Mucha suerte.")}catch(x){toast("No te has podido apuntar ("+((x&&x.code)||"error")+"). Puede que ya haya cerrado.")}rfRefresh();return}
  const l=t.closest("[data-rfl]");if(l){try{await window.FB.rfLeave(l.dataset.rfl);RF.inn[l.dataset.rfl]=false;toast("Te has borrado del sorteo.")}catch(x){toast("No se ha podido.")}rfRefresh();return}
  const c=t.closest("[data-rfc]");if(c){rfClaim(c.dataset.rfc);return}
  const d=t.closest("[data-rfd]");if(d){rfDraw(d.dataset.rfd);return}
  const x=t.closest("[data-rfx]");if(x){if(!(await askOk("¿Borrar este sorteo?")))return;try{await window.FB.rfDel(x.dataset.rfx);rfRefresh()}catch(y){toast("No se ha podido borrar.")}return}
  const w=t.closest("[data-rfw]");if(w){rfWho(w.dataset.rfw);return}
  if(t.closest("#rfWinX")){const m=$("rfWinM");if(m)m.remove()}});
// ---------- cambiar el premio de un sorteo abierto (administradores) ----------
// el premio se lee al reclamarlo (_server/sorteo.js), así que el cambio vale para los ganadores aunque ya estuvieran apuntados
function rfEdit(id){if(typeof MOD==="undefined"||!MOD.admin)return;const r=RF.list.find(x=>x.id===id);if(!r||r.st!=="open")return;
  let M=$("rfEdM");if(M)M.remove();M=document.createElement("div");M.id="rfEdM";M.dataset.id=id;M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  M.innerHTML='<div class="nxmw rfedw"><div class="pkph"><h3>✏️ Cambiar el premio</h3><button type="button" class="alt pkpxb" data-rfex="1" aria-label="Cerrar">✕</button></div>'+
    '<small class="mut">«'+esc(r.tt||"Sorteo")+'» · ahora: '+esc(rfPrize(r))+'</small><div class="codeform">'+
    '<label>Tickets<input id="rfeTk" type="number" min="0" value="'+(+r.t||0)+'"></label>'+
    (typeof CODE_ITEMS!=="undefined"?CODE_ITEMS:[]).map(x=>'<label>'+x[1]+'<input data-rfei="'+x[0]+'" type="number" min="0" value="'+((r.it||{})[x[0]]|0)+'"></label>').join("")+
    '<label>Pokémon (opcional)'+(typeof pkPickField==="function"?pkPickField("rfeM"):'<input id="rfeM">')+'</label><label class="cdchk"><input id="rfeS" type="checkbox"'+(r.sh?' checked':'')+'> Variocolor</label>'+
    '<label>Nº de ganadores<input id="rfeN" type="number" min="1" value="'+Math.max(1,r.nw|0)+'"></label>'+
    '<label class="cdchk cdwide"><input id="rfeD" type="checkbox" checked> Anunciarlo en Discord y avisar en el juego a quien no se ha apuntado</label>'+
    '</div><button class="red" id="rfEdOk">💾 Guardar el premio nuevo</button><small id="rfeMsg" class="mut"></small></div>';
  document.body.appendChild(M);if(typeof pkPickSet==="function")pkPickSet("rfeM",r.mon||"");else $("rfeM").value=r.mon||""}
async function rfEditSave(){const M=$("rfEdM");if(!M)return;const id=M.dataset.id,r=RF.list.find(x=>x.id===id),m=$("rfeMsg");if(!r)return;
  const it={};document.querySelectorAll("[data-rfei]").forEach(i=>{const v=Math.floor(+i.value||0);if(v>0)it[i.dataset.rfei]=Math.min(v,9999)});
  const mon=$("rfeM").value.trim(),t=Math.max(0,Math.floor(+$("rfeTk").value||0));if(mon&&!PM[mon]){m.textContent="Ese Pokémon no existe. Elige uno de la lista.";return}
  if(!t&&!mon&&!Object.keys(it).length){m.textContent="Pon al menos un premio.";return}
  const nw=Math.max(1,Math.min(100,Math.floor(+$("rfeN").value||1))),dc=$("rfeD").checked;
  if(r.end<=Date.now()){m.textContent="Este sorteo ya ha cerrado.";return}
  const d={t:t,it:it,mon:mon||null,sh:mon&&$("rfeS").checked?1:0,nw:nw};if(dc)d.up=Date.now();
  const b=$("rfEdOk");b.disabled=true;
  try{await window.FB.rfUpd(id,d);Object.assign(r,d);M.remove();snd("win");toast("✅ Premio cambiado: "+rfPrize(r));if(dc&&typeof dcAviso==="function")dcAviso("sorteo",id);rfRefresh()}
  catch(e){b.disabled=false;m.textContent="No se ha podido guardar ("+((e&&e.code)||"error")+")."}}
// ---------- lista de apuntados ----------
const RFW={E:[],q:"",id:null};
async function rfWho(id){if(typeof MOD==="undefined"||!MOD.admin)return;const r=RF.list.find(x=>x.id===id);if(!r)return;let E;
  try{E=await window.FB.rfEntries(id)}catch(e){toast("No se han podido leer los apuntados.");return}
  E.sort((a,b)=>(a.at||0)-(b.at||0));RFW.E=E;RFW.q="";RFW.id=id;let M=$("rfWhoM");if(M)M.remove();
  M=document.createElement("div");M.id="rfWhoM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  M.innerHTML='<div class="nxmw rfww"><div class="pkph"><h3>👥 Apuntados</h3><button type="button" class="alt pkpxb" data-rfwx="1" aria-label="Cerrar">✕</button></div>'+
    '<small class="mut">«'+esc(r.tt||"Sorteo")+'» · '+E.length+' jugador'+(E.length===1?'':'es')+'</small>'+(E.length>8?'<input id="rfwQ" placeholder="🔍 Buscar jugador…" autocomplete="off">':'')+'<ol class="rfwl" id="rfwL"></ol></div>';
  document.body.appendChild(M);rfWhoDraw();const q=$("rfwQ");if(q)q.focus()}
function rfWhoDraw(){const L=$("rfwL");if(!L)return;const me=window.FB&&window.FB.uid&&window.FB.uid(),r=RF.list.find(x=>x.id===RFW.id)||{},W=Array.isArray(r.win)?r.win:[],q=nrm(RFW.q||"");
  const f=RFW.E.map((e,i)=>[e,i]).filter(([e])=>!q||nrm(pvClean(e.n||"")).includes(q));
  const tm=ms=>{if(!ms)return "";const d=new Date(ms);return d.toLocaleDateString("es-ES",{day:"numeric",month:"short"})+" "+d.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})};
  L.innerHTML=f.length?f.map(([e,i])=>'<li class="'+(e.u===me?'me ':'')+(W.includes(e.u)?'win':'')+'"><span class="rfwn">'+(i+1)+'</span><b>'+esc(pvClean(e.n||"Entrenador"))+'</b>'+(W.includes(e.u)?' 🏆':'')+(e.u===me?' <small>(tú)</small>':'')+'<small class="mut">'+tm(e.at)+'</small></li>').join(""):'<li class="mut">Nadie coincide.</li>'}
document.addEventListener("click",e=>{const M=$("rfWhoM");if(!M)return;if(e.target===M||(e.target.closest&&e.target.closest("[data-rfwx]")))M.remove()});
document.addEventListener("input",e=>{if(e.target&&e.target.id==="rfwQ"){RFW.q=e.target.value;rfWhoDraw()}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){const M=$("rfWhoM");if(M)M.remove()}});
// ---------- aviso al ganador ----------
async function rfWinCheck(){try{if(!rfOn()||$("rfWinM"))return;if(Date.now()-RF.t>120000)await rfLoad();const me=window.FB.uid();
  const r=RF.list.find(x=>x.st==="done"&&Array.isArray(x.win)&&x.win.includes(me)&&RF.got[x.id]===false&&!(S.rfSeen||{})[x.id]);if(!r)return;
  if(typeof evpFree==="function"&&!evpFree())return;(S.rfSeen=S.rfSeen||{})[r.id]=1;
  const M=document.createElement("div");M.id="rfWinM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  M.innerHTML='<div class="nxmw"><div class="rfbig">🎉</div><h3>¡Has ganado un sorteo!</h3><p>Te ha tocado el sorteo <b>«'+esc(r.tt||"Sorteo")+'»</b>.</p><p class="rfp">🎁 '+esc(rfPrize(r))+'</p><button class="red" data-rfc="'+esc(r.id)+'">🎁 ¡Reclamar mi premio!</button><button class="alt" id="rfWinX">Más tarde</button><small class="mut">También lo puedes reclamar en Más › 🎉 Sorteos.</small></div>';
  document.body.appendChild(M);snd("lvl")}catch(e){}}
// ---------- aviso de sorteo nuevo ----------
// a cada jugador le sale una vez por sorteo abierto al que todavía no se ha apuntado
async function rfAnnCheck(){try{if(!rfOn()||$("rfWinM")||$("rfAnnM"))return;if(Date.now()-RF.t>120000)await rfLoad();const now=Date.now(),seen=S.rfSeen||{};
  const sk=x=>"n_"+x.id+(x.up?"_"+x.up:""),r=RF.list.find(x=>x.st==="open"&&x.end>now+60000&&RF.inn[x.id]===false&&!seen[sk(x)]);if(!r)return;
  if(typeof evpFree==="function"&&!evpFree())return;(S.rfSeen=S.rfSeen||{})[sk(r)]=1;try{save()}catch(e){}
  const end=new Date(r.end),cnt=RF.cnt[r.id];
  const M=document.createElement("div");M.id="rfAnnM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  M.innerHTML='<div class="nxmw"><div class="rfbig">'+(r.up?'✨':'🎉')+'</div><h3>'+(r.up?'¡Premio mejorado!':'¡Nuevo sorteo!')+'</h3><p><b>«'+esc(r.tt||"Sorteo")+'»</b></p><p class="rfp">🎁 '+esc(rfPrize(r))+'</p>'+
    '<small class="mut">'+(r.nw|0)+' ganador'+((r.nw|0)===1?'':'es')+' · cierra el '+end.toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})+' a las '+end.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})+(cnt?' · ya hay '+cnt+' apuntado'+(cnt===1?'':'s'):'')+'</small>'+
    '<button class="red" data-rfj="'+esc(r.id)+'">🎟️ ¡Apuntarme!</button><button class="alt" id="rfAnnV">Ver sorteos</button><button class="alt" id="rfAnnX">Más tarde</button><small class="mut">Puedes apuntarte cuando quieras en Más › 🎉 Sorteos.</small></div>';
  document.body.appendChild(M);snd("lvl")}catch(e){}}
document.addEventListener("click",e=>{const M=$("rfAnnM");if(!M||!e.target.closest)return;
  if(e.target.closest("#rfAnnX")||e.target===M)M.remove();else if(e.target.closest("#rfAnnV")){M.remove();try{hubOpen("mas","rafP")}catch(x){}}});
setTimeout(rfWinCheck,8000);setInterval(()=>{rfWinCheck().then(()=>setTimeout(rfAnnCheck,1500))},60000);setTimeout(rfAnnCheck,14000);
