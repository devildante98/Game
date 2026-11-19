// =====================================================================================
// CÓDIGOS DE REGALO Y TÍTULO BETA-TESTER
// · Los jugadores canjean códigos en Premios › 🎁 Canjear código. El servidor comprueba el código y que no lo hayas
//   usado ya, y mete el premio en tu partida (_server/codigo.js). Hace falta una cuenta iniciada.
// · Los administradores crean, desactivan y borran códigos en Más › 🎁 Códigos (solo lo ven ellos).
// · Título «🧪 Beta-Tester»: para las cuentas creadas en las dos primeras semanas del juego (del 29 de octubre al 11 de
//   noviembre de 2026, ambos incluidos).
// =====================================================================================
const CODE_TXT={"codigo-mal":"Escribe un código válido.","codigo-no":"Ese código no existe. Revisa que esté bien escrito.","codigo-off":"Ese código ya no está activo.",
  "codigo-caducado":"Ese código ha caducado.","codigo-usado":"Ya has canjeado ese código.","codigo-agotado":"Ese código ya se ha usado todas las veces posibles."};
const codeClean=c=>String(c||"").toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,24);
function codePrizeTxt(p){const L=[];if(p.mon)L.push((p.sh?"✨ ":"")+p.mon);if(p.t)L.push(fmt(p.t)+" 🎟️");Object.keys(p.it||{}).forEach(k=>L.push(p.it[k]+" "+IN2(k)));return L.join(" + ")||"—"}
// ---------- canjear (jugadores) ----------
let CODE_BUSY=false;
function codeRedeem(){if(CODE_BUSY)return;const i=$("codeIn"),msg=$("codeMsg"),c=codeClean(i&&i.value);
  if(!(window.FB&&window.FB.uid&&window.FB.uid())||typeof window.srvAccion!=="function"){msg.textContent="Inicia sesión con tu cuenta para canjear códigos.";return}
  if(c.length<3){msg.textContent=CODE_TXT["codigo-mal"];return}
  CODE_BUSY=true;$("codeGo").disabled=true;msg.textContent="⏳ Comprobando el código…";
  window.srvAccion({k:"codigo",c:c},srvJ,r=>{const p=r.codigo;if(!p)return;
      S.t=(S.t||0)+(p.t||0);S.bag=S.bag||{};Object.keys(p.it||{}).forEach(k=>{S.bag[k]=(S.bag[k]||0)+p.it[k]});
      if(p.mon&&PM[p.mon]){const lv=typeof clampL==="function"?clampL(Math.max(5,Math.min(typeof lvCap==="function"?lvCap():50,typeof leadLevel==="function"?leadLevel():5))):5;giveMon(p.mon,lv,!!p.sh)}
      (S.codes=S.codes||{})[p.c]=Date.now();save();try{render()}catch(e){}
      snd("win");i.value="";msg.innerHTML="✅ ¡Código canjeado! Has recibido: <b>"+esc(codePrizeTxt(p))+"</b>"+(p.msg?"<br>"+esc(p.msg):"");
      toast("🎁 ¡Código canjeado! "+codePrizeTxt(p))})
    .then(r=>{if(!r||!r.ok){msg.textContent=(r&&CODE_TXT[r.why])||(r&&typeof srvErr==="function"&&srvErr(r))||"No se ha podido canjear. Inténtalo en un momento."}})
    .catch(()=>{msg.textContent="No hay conexión con el servidor. Inténtalo en un momento."})
    .finally(()=>{CODE_BUSY=false;const b=$("codeGo");if(b)b.disabled=false})}
function codeUI(){const b=$("codePB");if(!b)return;if($("codeIn"))return;
  b.innerHTML='<div class="codebox"><div class="codei">🎁</div><p>¿Tienes un código de regalo? Lo damos en sorteos, eventos y redes sociales. Cada código se puede canjear una vez por cuenta.</p>'+
    '<div class="coderow"><input id="codeIn" maxlength="24" autocomplete="off" spellcheck="false" placeholder="ESCRIBE TU CÓDIGO" aria-label="Código de regalo"><button class="red" id="codeGo">Canjear</button></div><small id="codeMsg" class="mut"></small></div>';
  $("codeGo").onclick=codeRedeem;$("codeIn").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();codeRedeem()}});
  $("codeIn").addEventListener("input",e=>{const t=e.target,p=t.selectionStart;t.value=codeClean(t.value);try{t.setSelectionRange(p,p)}catch(x){}})}
nxPanel("codeP","🎁 Canjear código","Escribe un código de regalo para recibir su premio.");
{const gk=(typeof HUBP!=="undefined"&&HUBP.earnP)||"mas",g=HUB.find(x=>x.k===gk)||HUB.find(x=>x.k==="mas");if(g&&!g.tabs.some(t=>t[0]==="codeP"))g.tabs.push(["codeP","🎁 Canjear código"]);HUBP.codeP=g?g.k:"mas";HUBR.codeP=()=>codeUI()}
// ---------- elegir un Pokémon en una ventana con imágenes y buscador (formularios de administración) ----------
// el campo guarda el nombre en un <input hidden> y enseña la imagen del elegido
function pkPickField(id){return '<span class="pkpf" data-pkpf="'+id+'"><input type="hidden" id="'+id+'"><button type="button" class="alt pkpfb" data-pkpick="'+id+'"><span class="pkpfi">❔</span><span class="pkpfn">Elegir Pokémon…</span></button><button type="button" class="alt mini pkpfx" data-pkclr="'+id+'" hidden title="Quitar">✕</button></span>'}
function pkPickSet(id,n){const i=$(id);if(!i)return;i.value=n||"";const w=document.querySelector('[data-pkpf="'+id+'"]');if(!w)return;
  w.querySelector(".pkpfi").innerHTML=n&&PM[n]?ico(PM[n],34):"❔";w.querySelector(".pkpfn").textContent=n||"Elegir Pokémon…";w.querySelector(".pkpfx").hidden=!n}
const PKP={id:null,q:"",r:""};
function pkPickOpen(id){PKP.id=id;let M=$("pkPickM");if(M)M.remove();M=document.createElement("div");M.id="pkPickM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");M.setAttribute("aria-label","Elegir Pokémon");
  M.innerHTML='<div class="nxmw pkpw"><div class="pkph"><h3>Elige un Pokémon</h3><button type="button" class="alt pkpxb" data-pkpx="1" aria-label="Cerrar">✕</button></div>'+
    '<div class="tfil"><input id="pkpQ" placeholder="🔍 Buscar Pokémon…" autocomplete="off" value="'+esc(PKP.q)+'"><select id="pkpR"><option value="">Todas</option>'+["C","R","E","M","L"].map(r=>'<option value="'+r+'"'+(PKP.r===r?' selected':'')+'>'+(STAR[r]||r)+'</option>').join("")+'</select></div>'+
    '<div class="pkpg" id="pkpG"></div><small class="mut" id="pkpN"></small></div>';
  document.body.appendChild(M);pkPickDraw();setTimeout(()=>{try{$("pkpQ").focus()}catch(e){}},50)}
function pkPickDraw(){const g=$("pkpG");if(!g)return;const q=nrm(PKP.q||""),L=P.filter(p=>(!q||nrm(p[0]).includes(q)||nrm(nk(p[0])).includes(q))&&(!PKP.r||p[2]===PKP.r)),S2=L.slice(0,240);
  g.innerHTML=S2.length?S2.map(p=>'<button type="button" class="pkpc r'+p[2]+'" data-pkpn="'+esc(p[0])+'" title="'+esc(p[0])+'">'+'<span class="pkpci">'+ico(p,56)+'</span><small>'+esc(p[0])+'</small></button>').join(""):'<small class="mut">Ningún Pokémon coincide.</small>';
  $("pkpN").textContent=L.length>S2.length?"Se ven "+S2.length+" de "+L.length+". Escribe para buscar.":L.length+" Pokémon"}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;
  const o=t.closest("[data-pkpick]");if(o){pkPickOpen(o.dataset.pkpick);return}
  const c=t.closest("[data-pkclr]");if(c){pkPickSet(c.dataset.pkclr,"");return}
  const M=$("pkPickM");if(!M||!M.contains(t))return;
  const n=t.closest("[data-pkpn]");if(n){pkPickSet(PKP.id,n.dataset.pkpn);M.remove();snd("ui");return}
  if(t===M||t.closest("[data-pkpx]"))M.remove()});
document.addEventListener("input",e=>{if(e.target&&e.target.id==="pkpQ"){PKP.q=e.target.value;pkPickDraw()}});
document.addEventListener("change",e=>{if(e.target&&e.target.id==="pkpR"){PKP.r=e.target.value;pkPickDraw()}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("pkPickM")){e.stopPropagation();$("pkPickM").remove()}},true);
// ---------- crear y gestionar (administradores) ----------
const CODE_ITEMS=[["mb","Master Ball"],["crys","Cristal Supremo"],["cand","Caramelo Raro"],["ppmax","PP máximos"],["tshard","Teralito"],["ub","Ultra Ball"],["sb","Super Ball"],["pb","Poké Ball"]];
let CODES=[];
async function codeAdmUI(reload){const b=$("codeAPB");if(!b||!(typeof MOD!=="undefined"&&MOD.admin))return;
  if(reload||!b.dataset.ok){b.dataset.ok=1;
    b.innerHTML='<h3 class="shh">Nuevo código</h3><div class="codeform">'+
      '<label>Código<input id="cdC" maxlength="24" placeholder="NAVIDAD2026"></label>'+
      '<label>Tickets<input id="cdT" type="number" min="0" value="0"></label>'+
      CODE_ITEMS.map(x=>'<label>'+x[1]+'<input data-cdi="'+x[0]+'" type="number" min="0" value="0"></label>').join("")+
      '<label>Pokémon (opcional)'+pkPickField("cdM")+'</label>'+
      '<label class="cdchk"><input id="cdS" type="checkbox"> Variocolor</label>'+
      '<label>Usos máximos (0 = sin límite)<input id="cdN" type="number" min="0" value="0"></label>'+
      '<label>Válido hasta (opcional)<input id="cdU" type="date"></label>'+
      '<label class="cdwide">Mensaje al canjearlo (opcional)<input id="cdG" maxlength="140" placeholder="¡Gracias por participar en el sorteo!"></label>'+
      '</div><button class="red" id="cdSave">🎁 Crear código</button><small id="cdMsg" class="mut"></small><h3 class="shh">Códigos creados</h3><div id="cdList" class="mut">Cargando…</div>';
    $("cdC").addEventListener("input",e=>{e.target.value=codeClean(e.target.value)})}
  try{CODES=(await window.FB.codeList()).sort((a,z)=>(z.at||0)-(a.at||0))}catch(e){$("cdList").textContent="No se han podido cargar los códigos ("+((e&&e.code)||"error")+").";return}
  const L=$("cdList");if(!L)return;
  L.innerHTML=CODES.length?CODES.map(c=>{const p={t:c.t,it:c.it,mon:c.mon,sh:c.sh},exp=c.until&&Date.now()>c.until,full=c.max&&(c.n||0)>=c.max;
    return '<div class="cdrow'+(c.on===false||exp||full?' off':'')+'"><b class="noi18n">'+esc(c.id)+'</b><span>'+esc(codePrizeTxt(p))+'</span><small>'+(c.n||0)+(c.max?' / '+c.max:'')+' usos'+(c.until?' · hasta el '+new Date(c.until).toLocaleDateString("es"):'')+(c.on===false?' · desactivado':exp?' · caducado':full?' · agotado':'')+'</small>'+
      '<button class="alt mini" data-cdon="'+esc(c.id)+'">'+(c.on===false?'Activar':'Desactivar')+'</button><button class="alt mini" data-cddel="'+esc(c.id)+'">🗑️</button></div>'}).join(""):'Todavía no hay códigos.'}
async function codeAdmSave(){const m=$("cdMsg"),c=codeClean($("cdC").value);if(c.length<3){m.textContent="El código debe tener al menos 3 letras o números.";return}
  if(CODES.some(x=>x.id===c)&&!(await askOk("El código «"+c+"» ya existe. ¿Sustituir su premio?")))return;
  const it={};document.querySelectorAll("#codeAPB [data-cdi]").forEach(i=>{const v=Math.floor(+i.value||0);if(v>0)it[i.dataset.cdi]=Math.min(v,9999)});
  const mon=$("cdM").value.trim(),t=Math.max(0,Math.floor(+$("cdT").value||0));if(mon&&!PM[mon]){m.textContent="Ese Pokémon no existe. Elige uno de la lista.";return}
  if(!t&&!mon&&!Object.keys(it).length){m.textContent="Pon al menos un premio.";return}
  const u=$("cdU").value,d={t:t,it:it,mon:mon||null,sh:mon&&$("cdS").checked?1:0,max:Math.max(0,Math.floor(+$("cdN").value||0)),until:u?new Date(u+"T23:59:59").getTime():0,msg:$("cdG").value.trim().slice(0,140),on:true,at:Date.now()};
  if(!CODES.some(x=>x.id===c))d.n=0;
  try{await window.FB.codeSet(c,d);m.textContent="✅ Código «"+c+"» creado: "+codePrizeTxt(d);snd("win");$("cdC").value="";codeAdmUI(false)}catch(e){m.textContent="No se ha podido guardar ("+((e&&e.code)||"error")+")."}}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest||!t.closest("#codeAPB"))return;
  if(t.closest("#cdSave")){codeAdmSave();return}
  const on=t.closest("[data-cdon]");if(on){const c=CODES.find(x=>x.id===on.dataset.cdon);if(c)try{await window.FB.codeSet(c.id,{on:c.on===false});codeAdmUI()}catch(x){toast("No se ha podido cambiar.")}return}
  const del=t.closest("[data-cddel]");if(del){if(!(await askOk("¿Borrar el código «"+del.dataset.cddel+"»? Ya no se podrá canjear.")))return;try{await window.FB.codeDel(del.dataset.cddel);codeAdmUI()}catch(x){toast("No se ha podido borrar.")}}});
// la pestaña solo aparece a los administradores
setInterval(()=>{if(typeof MOD==="undefined"||!MOD.admin||$("codeAP"))return;nxPanel("codeAP","🎁 Códigos de regalo","Solo lo ves tú porque eres administrador. Crea códigos con premio para sorteos, eventos o compensaciones. Cada cuenta puede canjear cada código una vez.");
  const g=HUB.find(x=>x.k==="mas");if(g&&!g.tabs.some(t=>t[0]==="codeAP"))g.tabs.push(["codeAP","🎁 Códigos"]);HUBP.codeAP="mas";HUBR.codeAP=()=>codeAdmUI(true)},2000);
// ---------- título Beta-Tester ----------
const BETA_HASTA=Date.UTC(2026,10,11,23,0,0);// 12 de noviembre a las 0:00 en España
TITLES.push(["beta","🧪 Beta-Tester",()=>!!S.beta]);
setInterval(()=>{try{if(typeof S==="undefined"||!S||S.beta||!window.FB||!window.FB.created)return;const c=window.FB.created();if(c&&c<BETA_HASTA){S.beta=1;save();
  toast("🧪 ¡Gracias por jugar desde el principio! Tienes el título exclusivo «Beta-Tester»: póntelo en Tu entrenador › Mi tarjeta.")}}catch(e){}},5000);
