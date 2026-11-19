// =====================================================================================
// SORTEOS
// · Jugadores: en Más › 🎉 Sorteos ven los sorteos abiertos (premio, ganadores, cuánto falta y cuántos se han apuntado)
//   y se apuntan con un toque (una vez por cuenta; pueden borrarse mientras siga abierto). Si ganan, al entrar les sale
//   un aviso para reclamar el premio, que entrega el servidor (_server/sorteo.js).
// · Administradores: en el mismo apartado crean sorteos (título, premio, nº de ganadores y fecha de cierre), los sortean
//   cuando quieran (los ganadores salen al azar entre los apuntados) y los borran.
// =====================================================================================
const RF={list:[],cnt:{},inn:{},got:{},busy:false,t:0};
const RF_TXT={"sorteo-no":"Ese sorteo ya no existe.","sorteo-abierto":"Ese sorteo todavía no se ha hecho.","sorteo-no-ganador":"No estás entre los ganadores de ese sorteo.","sorteo-cobrado":"Ya has reclamado ese premio."};
const rfOn=()=>!!(window.FB&&window.FB.uid&&window.FB.uid()&&window.FB.rfList);
const rfLeft=ms=>{if(ms<=0)return "cerrado";const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.ceil(ms%36e5/6e4);return d?d+" d "+h+" h":h?h+" h "+m+" min":m+" min"};
const rfPrize=r=>typeof codePrizeTxt==="function"?codePrizeTxt({t:r.t,it:r.it,mon:r.mon,sh:r.sh}):"";
async function rfLoad(){if(!rfOn())return;try{RF.list=await window.FB.rfList()}catch(e){return}const me=window.FB.uid();
  await Promise.all(RF.list.map(async r=>{RF.cnt[r.id]=await window.FB.rfCount(r.id);if(r.st==="open")try{RF.inn[r.id]=await window.FB.rfIn(r.id)}catch(e){}
    if(r.st==="done"&&Array.isArray(r.win)&&r.win.includes(me)&&RF.got[r.id]==null)RF.got[r.id]=await window.FB.rfClaimed(r.id)}));RF.t=Date.now()}
function rfUI(){const b=$("rafPB");if(!b)return;if(!rfOn()){b.innerHTML='<p class="mut">Inicia sesión con tu cuenta para apuntarte a los sorteos.</p>';return}
  const me=window.FB.uid(),adm=typeof MOD!=="undefined"&&MOD.admin,now=Date.now();
  const open=RF.list.filter(r=>r.st==="open"),done=RF.list.filter(r=>r.st==="done").slice(0,8);
  const card=r=>{const left=r.end-now,cnt=RF.cnt[r.id],win=Array.isArray(r.win)&&r.win.includes(me);
    let act="";
    if(r.st==="open")act=left>0?(RF.inn[r.id]?'<span class="rfin">✅ Estás apuntado</span><button class="alt mini" data-rfl="'+esc(r.id)+'">Borrarme</button>':'<button class="red" data-rfj="'+esc(r.id)+'">🎟️ ¡Apuntarme!</button>'):'<span class="mut">⏳ Cerrado, pendiente de sortear</span>';
    else act=(r.wn&&r.wn.length?'<span class="rfwin">🏆 '+r.wn.map(n=>esc(pvClean(n))).join(" · ")+'</span>':'<span class="mut">Nadie se apuntó</span>')+(win?(RF.got[r.id]?'<span class="rfin">✅ Premio reclamado</span>':'<button class="red" data-rfc="'+esc(r.id)+'">🎁 ¡Reclamar mi premio!</button>'):'');
    const ad=adm?'<div class="rfadm">'+(r.st==="open"?'<button class="alt mini" data-rfd="'+esc(r.id)+'">🎲 Sortear ahora</button>':'')+'<button class="alt mini" data-rfx="'+esc(r.id)+'">🗑️ Borrar</button></div>':'';
    return '<div class="rfcard'+(r.st==="done"?' done':'')+(win?' won':'')+'"><div class="rfh"><b>'+esc(r.tt||"Sorteo")+'</b><small>'+(r.st==="open"?(left>0?'Cierra en '+rfLeft(left):'Cerrado'):'Sorteado')+'</small></div>'+
      '<div class="rfp">🎁 '+esc(rfPrize(r))+'</div><small class="mut">'+(r.nw|0)+' ganador'+((r.nw|0)===1?'':'es')+(cnt!=null?' · '+cnt+' apuntado'+(cnt===1?'':'s'):'')+'</small><div class="rfact">'+act+'</div>'+ad+'</div>'};
  let h='';
  if(adm)h+='<details class="rfnew"'+(RF.newOpen?' open':'')+'><summary>➕ Crear un sorteo (solo administradores)</summary><div class="codeform">'+
    '<label class="cdwide">Título<input id="rfT" maxlength="80" placeholder="Sorteo de Navidad"></label><label>Tickets<input id="rfTk" type="number" min="0" value="0"></label>'+
    (typeof CODE_ITEMS!=="undefined"?CODE_ITEMS:[]).map(x=>'<label>'+x[1]+'<input data-rfi="'+x[0]+'" type="number" min="0" value="0"></label>').join("")+
    '<label>Pokémon (opcional)<input id="rfM" list="cdML" placeholder="Nombre exacto"></label><label class="cdchk"><input id="rfS" type="checkbox"> Variocolor</label>'+
    '<label>Nº de ganadores<input id="rfN" type="number" min="1" value="1"></label><label>Cierra el día<input id="rfD" type="date"></label><label>a las<input id="rfH" type="time" value="21:00"></label>'+
    '</div><button class="red" id="rfSave">🎉 Crear sorteo</button><small id="rfMsg" class="mut"></small>'+(typeof P!=="undefined"&&!$("cdML")?'<datalist id="cdML">'+P.map(p=>'<option value="'+esc(p[0])+'">').join("")+'</datalist>':'')+'</details>';
  h+='<h3 class="shh">🎉 Sorteos abiertos</h3>'+(open.length?'<div class="rfl">'+open.map(card).join("")+'</div>':'<p class="mut">Ahora mismo no hay sorteos abiertos. ¡Atento a las Novedades y al chat!</p>');
  if(done.length)h+='<h3 class="shh">🏆 Últimos sorteos</h3><div class="rfl">'+done.map(card).join("")+'</div>';
  const keep=adm&&$("rfT")?{t:$("rfT").value,tk:$("rfTk").value,m:$("rfM").value,s:$("rfS").checked,n:$("rfN").value,d:$("rfD").value,h:$("rfH").value,it:[...document.querySelectorAll("[data-rfi]")].map(i=>i.value)}:null;
  b.innerHTML=h;
  if(keep){$("rfT").value=keep.t;$("rfTk").value=keep.tk;$("rfM").value=keep.m;$("rfS").checked=keep.s;$("rfN").value=keep.n;$("rfD").value=keep.d;$("rfH").value=keep.h;document.querySelectorAll("[data-rfi]").forEach((i,k)=>i.value=keep.it[k]||0)}
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
  try{await window.FB.rfSave(id,{st:"done",win:W.map(x=>x.u),wn:W.map(x=>String(x.n||"Entrenador").slice(0,30)),drawAt:Date.now()});snd("win");
    toast(W.length?"🎉 Ganador"+(W.length>1?"es":"")+": "+W.map(x=>pvClean(x.n||"")).join(", "):"Nadie se había apuntado.");rfRefresh()}catch(e){toast("No se ha podido guardar el resultado ("+((e&&e.code)||"error")+").")}}
async function rfCreate(){const m=$("rfMsg"),tt=$("rfT").value.trim().slice(0,80);if(!tt){m.textContent="Ponle un título al sorteo.";return}
  const it={};document.querySelectorAll("[data-rfi]").forEach(i=>{const v=Math.floor(+i.value||0);if(v>0)it[i.dataset.rfi]=Math.min(v,9999)});
  const mon=$("rfM").value.trim(),t=Math.max(0,Math.floor(+$("rfTk").value||0));if(mon&&!PM[mon]){m.textContent="Ese Pokémon no existe. Elige uno de la lista.";return}
  if(!t&&!mon&&!Object.keys(it).length){m.textContent="Pon al menos un premio.";return}
  const d=$("rfD").value,h=$("rfH").value||"21:00";if(!d){m.textContent="Elige el día de cierre.";return}const end=new Date(d+"T"+h+":00").getTime();
  if(!(end>Date.now())){m.textContent="La fecha de cierre tiene que ser en el futuro.";return}
  const nw=Math.max(1,Math.min(100,Math.floor(+$("rfN").value||1)));
  try{await window.FB.rfSave(null,{tt:tt,t:t,it:it,mon:mon||null,sh:mon&&$("rfS").checked?1:0,nw:nw,end:end,st:"open",win:[],wn:[],at:Date.now()});RF.msg="✅ Sorteo «"+tt+"» creado.";$("rfT").value="";snd("win");rfRefresh()}
  catch(e){m.textContent="No se ha podido crear ("+((e&&e.code)||"error")+")."}}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest||!t.closest("#rafPB,#rfWinM"))return;
  if(t.closest("#rfSave")){rfCreate();return}
  const j=t.closest("[data-rfj]");if(j){j.disabled=true;try{await window.FB.rfJoin(j.dataset.rfj,pvClean(pvNick()));RF.inn[j.dataset.rfj]=true;snd("ui");toast("🎟️ ¡Te has apuntado al sorteo! Mucha suerte.")}catch(x){toast("No te has podido apuntar ("+((x&&x.code)||"error")+"). Puede que ya haya cerrado.")}rfRefresh();return}
  const l=t.closest("[data-rfl]");if(l){try{await window.FB.rfLeave(l.dataset.rfl);RF.inn[l.dataset.rfl]=false;toast("Te has borrado del sorteo.")}catch(x){toast("No se ha podido.")}rfRefresh();return}
  const c=t.closest("[data-rfc]");if(c){rfClaim(c.dataset.rfc);return}
  const d=t.closest("[data-rfd]");if(d){rfDraw(d.dataset.rfd);return}
  const x=t.closest("[data-rfx]");if(x){if(!(await askOk("¿Borrar este sorteo?")))return;try{await window.FB.rfDel(x.dataset.rfx);rfRefresh()}catch(y){toast("No se ha podido borrar.")}return}
  if(t.closest("#rfWinX")){const m=$("rfWinM");if(m)m.remove()}});
// ---------- aviso al ganador ----------
async function rfWinCheck(){try{if(!rfOn()||$("rfWinM"))return;if(Date.now()-RF.t>120000)await rfLoad();const me=window.FB.uid();
  const r=RF.list.find(x=>x.st==="done"&&Array.isArray(x.win)&&x.win.includes(me)&&RF.got[x.id]===false&&!(S.rfSeen||{})[x.id]);if(!r)return;
  if(typeof evpFree==="function"&&!evpFree())return;(S.rfSeen=S.rfSeen||{})[r.id]=1;
  const M=document.createElement("div");M.id="rfWinM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  M.innerHTML='<div class="nxmw"><div class="rfbig">🎉</div><h3>¡Has ganado un sorteo!</h3><p>Te ha tocado el sorteo <b>«'+esc(r.tt||"Sorteo")+'»</b>.</p><p class="rfp">🎁 '+esc(rfPrize(r))+'</p><button class="red" data-rfc="'+esc(r.id)+'">🎁 ¡Reclamar mi premio!</button><button class="alt" id="rfWinX">Más tarde</button><small class="mut">También lo puedes reclamar en Más › 🎉 Sorteos.</small></div>';
  document.body.appendChild(M);snd("lvl")}catch(e){}}
setTimeout(rfWinCheck,8000);setInterval(rfWinCheck,60000);
