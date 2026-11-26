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
      toast("🎁 ¡Código canjeado! "+codePrizeTxt(p));setTimeout(()=>codePubLoad(true),800)})
    .then(r=>{if(r&&r.why==="codigo-usado"){(S.codes=S.codes||{})[c]=S.codes[c]||Date.now();codePubDraw()}if(!r||!r.ok){msg.textContent=(r&&CODE_TXT[r.why])||(r&&typeof srvErr==="function"&&srvErr(r))||"No se ha podido canjear. Inténtalo en un momento."}})
    .catch(()=>{msg.textContent="No hay conexión con el servidor. Inténtalo en un momento."})
    .finally(()=>{CODE_BUSY=false;const b=$("codeGo");if(b)b.disabled=false})}
function codeUI(){const b=$("codePB");if(!b)return;codePubLoad();if($("codeIn"))return;
  b.innerHTML='<div class="codebox"><div class="codei">🎁</div><p>¿Tienes un código de regalo? Lo damos en sorteos, eventos y redes sociales. Cada código se puede canjear una vez por cuenta.</p>'+
    '<div class="coderow"><input id="codeIn" maxlength="24" autocomplete="off" spellcheck="false" placeholder="ESCRIBE TU CÓDIGO" aria-label="Código de regalo"><button class="red" id="codeGo">Canjear</button></div><small id="codeMsg" class="mut"></small></div><div id="codeLst"></div>';
  $("codeGo").onclick=codeRedeem;$("codeIn").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();codeRedeem()}});
  $("codeIn").addEventListener("input",e=>{const t=e.target,p=t.selectionStart;t.value=codeClean(t.value);try{t.setSelectionRange(p,p)}catch(x){}})}
// ---------- lista pública: códigos activos y pasados ----------
const CPUB={L:null,t:0,busy:false};
const codeState=c=>c.on===false?"off":c.until&&Date.now()>c.until?"exp":c.max&&(c.n||0)>=c.max?"full":"ok";
async function codePubLoad(force){if(CPUB.busy||!(window.FB&&window.FB.codePubList&&window.FB.uid&&window.FB.uid()))return codePubDraw();
  if(!force&&CPUB.L&&Date.now()-CPUB.t<60000)return codePubDraw();CPUB.busy=true;
  try{CPUB.L=await window.FB.codePubList();CPUB.t=Date.now()}catch(e){if(!CPUB.L)CPUB.L=[]}finally{CPUB.busy=false}codePubDraw()}
function codePubDraw(){const b=$("codeLst");if(!b)return;
  if(!(window.FB&&window.FB.uid&&window.FB.uid())){b.innerHTML='<p class="mut">Inicia sesión con tu cuenta para ver los códigos activos.</p>';return}
  if(!CPUB.L){b.innerHTML='<p class="mut">Cargando códigos…</p>';return}
  const mine=S.codes||{},act=CPUB.L.filter(c=>codeState(c)==="ok"),old=CPUB.L.filter(c=>codeState(c)!=="ok").sort((a,z)=>(z.until||z.at||0)-(a.until||a.at||0)).slice(0,20);
  const day=ms=>new Date(ms).toLocaleDateString("es-ES",{day:"numeric",month:"long",year:"numeric"});
  const left=ms=>{const d=ms-Date.now();if(d<=0)return "";const D=Math.floor(d/864e5),H=Math.floor(d%864e5/36e5);return D?"quedan "+D+" d "+H+" h":H?"quedan "+H+" h":"¡última hora!"};
  const card=(c,on)=>{const p={t:c.t,it:c.it,mon:c.mon,sh:c.sh},st=codeState(c),got=!!mine[c.id];
    const info=[c.max?(on?Math.max(0,c.max-(c.n||0))+" de "+c.max+" usos disponibles":c.max+(c.max===1?" uso":" usos")):"Usos ilimitados",c.until?(on?"válido hasta el "+day(c.until)+(left(c.until)?" ("+left(c.until)+")":""):"caducó el "+day(c.until)):"sin fecha límite"];
    const tag=on?(got?'<span class="cpgot">✅ Ya lo has canjeado</span>':'<button class="red mini" data-cpuse="'+esc(c.id)+'">🎁 Canjear</button>'):'<span class="cpend">'+(st==="exp"?"⌛ Caducado":st==="full"?"🚫 Agotado":"⛔ Desactivado")+(got?" · ✅ lo canjeaste":"")+'</span>';
    return '<div class="cpcard'+(on?'':' old')+(got?' got':'')+'"><div class="cph"><b class="cpc noi18n" title="Toca para copiarlo" data-cpcopy="'+esc(c.id)+'">'+esc(c.id)+'</b>'+tag+'</div><div class="cpp">🎁 '+esc(codePrizeTxt(p))+'</div><small class="mut">'+esc(info.join(" · "))+'</small></div>'};
  b.innerHTML='<h3 class="shh">🟢 Códigos activos</h3>'+(act.length?'<div class="cpl">'+act.map(c=>card(c,true)).join("")+'</div>':'<p class="mut">Ahora mismo no hay códigos activos. ¡Atento a las Novedades, al chat y a las redes!</p>')+
    (old.length?'<h3 class="shh">⌛ Códigos pasados</h3><div class="cpl">'+old.map(c=>card(c,false)).join("")+'</div>':'')}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest||!t.closest("#codeLst"))return;
  const u=t.closest("[data-cpuse]");if(u){const i=$("codeIn");if(i){i.value=u.dataset.cpuse;codeRedeem()}return}
  const c=t.closest("[data-cpcopy]");if(c){try{await navigator.clipboard.writeText(c.dataset.cpcopy);toast("📋 Código «"+c.dataset.cpcopy+"» copiado")}catch(x){}const i=$("codeIn");if(i)i.value=c.dataset.cpcopy}});
nxPanel("codeP","🎁 Canjear código","Escribe un código de regalo para recibir su premio. Debajo tienes los códigos activos y los que ya han pasado.");
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
      '<label class="cdchk cdwide"><input id="cdP" type="checkbox" checked> 📢 Mostrar en la lista pública de códigos (desmárcalo para códigos personales)</label>'+
      '</div><button class="red" id="cdSave">🎁 Crear código</button><small id="cdMsg" class="mut"></small><h3 class="shh">Códigos creados</h3><div id="cdList" class="mut">Cargando…</div>';
    $("cdC").addEventListener("input",e=>{e.target.value=codeClean(e.target.value)})}
  try{CODES=(await window.FB.codeList()).sort((a,z)=>(z.at||0)-(a.at||0))}catch(e){$("cdList").textContent="No se han podido cargar los códigos ("+((e&&e.code)||"error")+").";return}
  const L=$("cdList");if(!L)return;
  L.innerHTML=CODES.length?CODES.map(c=>{const p={t:c.t,it:c.it,mon:c.mon,sh:c.sh},exp=c.until&&Date.now()>c.until,full=c.max&&(c.n||0)>=c.max;
    return '<div class="cdrow'+(c.on===false||exp||full?' off':'')+'"><b class="noi18n">'+esc(c.id)+'</b><span>'+esc(codePrizeTxt(p))+'</span><small>'+(c.n||0)+(c.max?' / '+c.max:'')+' usos'+(c.until?' · hasta el '+new Date(c.until).toLocaleDateString("es"):'')+(c.on===false?' · desactivado':exp?' · caducado':full?' · agotado':'')+(c.pub?' · 📢 público':' · 🔒 oculto')+'</small>'+
      '<button class="alt mini" data-cdpub="'+esc(c.id)+'">'+(c.pub?'Ocultar':'📢 Publicar')+'</button><button class="alt mini" data-cdon="'+esc(c.id)+'">'+(c.on===false?'Activar':'Desactivar')+'</button><button class="alt mini" data-cddel="'+esc(c.id)+'">🗑️</button></div>'}).join(""):'Todavía no hay códigos.'}
async function codeAdmSave(){const m=$("cdMsg"),c=codeClean($("cdC").value);if(c.length<3){m.textContent="El código debe tener al menos 3 letras o números.";return}
  if(CODES.some(x=>x.id===c)&&!(await askOk("El código «"+c+"» ya existe. ¿Sustituir su premio?")))return;
  const it={};document.querySelectorAll("#codeAPB [data-cdi]").forEach(i=>{const v=Math.floor(+i.value||0);if(v>0)it[i.dataset.cdi]=Math.min(v,9999)});
  const mon=$("cdM").value.trim(),t=Math.max(0,Math.floor(+$("cdT").value||0));if(mon&&!PM[mon]){m.textContent="Ese Pokémon no existe. Elige uno de la lista.";return}
  if(!t&&!mon&&!Object.keys(it).length){m.textContent="Pon al menos un premio.";return}
  const u=$("cdU").value,d={t:t,it:it,mon:mon||null,sh:mon&&$("cdS").checked?1:0,max:Math.max(0,Math.floor(+$("cdN").value||0)),until:u?new Date(u+"T23:59:59").getTime():0,msg:$("cdG").value.trim().slice(0,140),on:true,at:Date.now()};
  const old=CODES.find(x=>x.id===c);if(!old)d.n=0;d.pub=!!($("cdP")&&$("cdP").checked);
  try{await window.FB.codeSet(c,d);if(d.pub){await window.FB.codePubSet(c,codePubData(Object.assign({},old||{},d)));dcAviso("codigo",c)}else if(old&&old.pub)await window.FB.codePubDel(c);m.textContent="✅ Código «"+c+"» creado: "+codePrizeTxt(d);snd("win");$("cdC").value="";codeAdmUI(false)}catch(e){m.textContent="No se ha podido guardar ("+((e&&e.code)||"error")+")."}}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest||!t.closest("#codeAPB"))return;
  if(t.closest("#cdSave")){codeAdmSave();return}
  const on=t.closest("[data-cdon]");if(on){const c=CODES.find(x=>x.id===on.dataset.cdon);if(c)try{await window.FB.codeSet(c.id,{on:c.on===false});if(c.pub)await window.FB.codePubSet(c.id,{on:c.on===false});codeAdmUI()}catch(x){toast("No se ha podido cambiar.")}return}
  const pb=t.closest("[data-cdpub]");if(pb){const c=CODES.find(x=>x.id===pb.dataset.cdpub);if(c)try{if(c.pub){await window.FB.codePubDel(c.id);await window.FB.codeSet(c.id,{pub:false})}else{await window.FB.codeSet(c.id,{pub:true});await window.FB.codePubSet(c.id,codePubData(c));dcAviso("codigo",c.id)}codeAdmUI()}catch(x){toast("No se ha podido cambiar ("+((x&&x.code)||"error")+").")}return}
  const del=t.closest("[data-cddel]");if(del){if(!(await askOk("¿Borrar el código «"+del.dataset.cddel+"»? Ya no se podrá canjear.")))return;try{const c=CODES.find(x=>x.id===del.dataset.cddel);await window.FB.codeDel(del.dataset.cddel);if(c&&c.pub)await window.FB.codePubDel(del.dataset.cddel);codeAdmUI()}catch(x){toast("No se ha podido borrar.")}}});
// aviso en el servidor de Discord (si está configurado); no molesta si falla
function dcAviso(k,id){try{if(window.FB&&window.FB.discord)window.FB.discord(k,id).then(r=>{if(r&&r.ok&&!r.ya)toast("💬 Anunciado en Discord")})}catch(e){}}
// lo que se publica de un código en la lista pública (el mensaje al canjearlo no, que es una sorpresa)
function codePubData(c){return {t:c.t||0,it:c.it||{},mon:c.mon||null,sh:c.sh?1:0,max:c.max||0,n:c.n||0,until:c.until||0,on:c.on!==false,at:c.at||Date.now()}}
// la pestaña solo aparece a los administradores
setInterval(()=>{if(typeof MOD==="undefined"||!MOD.admin||$("codeAP"))return;nxPanel("codeAP","🎁 Códigos de regalo","Solo lo ves tú porque eres administrador. Crea códigos con premio para sorteos, eventos o compensaciones. Cada cuenta puede canjear cada código una vez.");
  const g=HUB.find(x=>x.k==="mas");if(g&&!g.tabs.some(t=>t[0]==="codeAP"))g.tabs.push(["codeAP","🎁 Códigos"]);HUBP.codeAP="mas";HUBR.codeAP=()=>codeAdmUI(true)},2000);
// ---------- título Beta-Tester ----------
const BETA_HASTA=Date.UTC(2026,10,11,23,0,0);// 12 de noviembre a las 0:00 en España
TITLES.push(["beta","🧪 Beta-Tester",()=>!!S.beta]);
// el título Beta-Tester se ve con un formato especial (arcoíris animado) en el perfil y la vitrina
// ---------- título «👑 Creador del juego» (solo una cuenta en todo el juego) ----------
// quién es el creador lo guarda la base de datos (config/creador): lo reclama un administrador una sola vez y ya no se puede
// cambiar. Así nadie puede ponerse el título editando su perfil: en los perfiles y el chat se comprueba el uid.
window.CREADOR_UID=(()=>{try{return localStorage.getItem("pgc-crea")||""}catch(e){return ""}})();
let CREA_OK=false;
async function creaLoad(){if(!window.FB||!window.FB.creadorGet)return;try{const d=await window.FB.creadorGet();CREA_OK=true;window.CREADOR_UID=d&&d.uid?String(d.uid):"";
  try{localStorage.setItem("pgc-crea",window.CREADOR_UID)}catch(e){}}catch(e){}}
const esCreador=u=>!!(u&&window.CREADOR_UID&&u===window.CREADOR_UID);
const yoCreador=()=>{try{return esCreador(window.FB&&window.FB.uid&&window.FB.uid())}catch(e){return false}};
TITLES.unshift(["crea","👑 Creador del juego",yoCreador]);
setInterval(()=>{if(!CREA_OK&&window.FB&&window.FB.creadorGet&&window.FB.uid&&window.FB.uid())creaLoad()},3000);
// formato especial de los títulos únicos: Beta-Tester (arcoíris) y Creador del juego (oro y diamante, aún más especial)
function titHTML(tx,k,u){const s=String(tx||"");
  if(k==="crea"||(!k&&/Creador del juego/i.test(s))){if(!esCreador(u))return "";
    return '<span class="titcrea" title="Creador de Poke Gacha Online"><span class="tcring" aria-hidden="true"></span><span class="tcin"><span class="tcc">👑</span><span class="tctx">Creador del juego</span><span class="tcc tcc2" aria-hidden="true">💎</span></span>'+
      '<i class="tcs s1" aria-hidden="true">✦</i><i class="tcs s2" aria-hidden="true">✧</i><i class="tcs s3" aria-hidden="true">✦</i><i class="tcs s4" aria-hidden="true">✧</i></span>'}
  if(k==="beta"||(!k&&/Beta-Tester/.test(s)))return '<span class="titbeta" title="Jugó en las dos primeras semanas del juego"><span class="tbe">🧪</span><span class="tbtx">Beta-Tester</span><span class="tbsp" aria-hidden="true">✦</span></span>';return esc(s)}
// el perfil del creador lleva un marco dorado
{const _op=openProf;openProf=async function(uid){const r=await _op.apply(this,arguments);try{const me=window.FB&&window.FB.uid&&window.FB.uid(),box=arguments[2]||$("profB"),c=box&&box.firstElementChild;
  if(c&&esCreador(uid||me)&&c.querySelector(".titcrea"))c.classList.add("pcrea")}catch(e){}return r}}
// reclamar el título (solo administradores y solo si nadie lo tiene aún): tarjeta en Más › 🎁 Códigos
setInterval(()=>{const P=$("codeAP"),B=$("codeAPB");if(!P||!B||!CREA_OK||typeof MOD==="undefined"||!MOD.admin)return;let c=$("creaBox");
  const st=window.CREADOR_UID?(yoCreador()?"yo":"otro"):"libre";if(c&&c.dataset.st===st)return;
  if(st==="otro"){if(c)c.remove();return}
  if(!c){c=document.createElement("div");c.id="creaBox";c.className="creabox";P.insertBefore(c,B)}c.dataset.st=st;
  c.innerHTML=st==="yo"?'<div>'+titHTML("","crea",window.CREADOR_UID)+'</div><small class="mut">Esta cuenta es la del creador del juego. Póntelo en Tu entrenador › Mi tarjeta › Título. En el chat, tu nombre lleva la insignia «👑 Creador».</small>'
    :'<b>👑 Título «Creador del juego»</b><small class="mut">Un título único: solo lo puede tener una cuenta en todo el juego, y después ya no se puede cambiar. Reclámalo solo si esta es la cuenta del creador.</small><button type="button" id="creaGo" class="red">👑 Esta es la cuenta del creador: reclamar el título</button>';
  const g=$("creaGo");if(g)g.onclick=async()=>{if(!(await askOk("¿Seguro que esta es la cuenta del creador del juego? Solo una cuenta puede tener este título y no se podrá cambiar.")))return;g.disabled=true;
    try{await window.FB.creadorSet();await creaLoad();if(yoCreador()){const t=shwGet();t.tit="crea";save();if(window.cloudFlush)try{window.cloudFlush(true)}catch(e){}snd("lvl");toast("👑 ¡Ya tienes el título «Creador del juego»! Lo llevas puesto en tu tarjeta.")}}
    catch(e){g.disabled=false;await creaLoad();toast(window.CREADOR_UID?"Otra cuenta ya tiene el título de creador.":"No se ha podido reclamar ahora. Inténtalo de nuevo.")}}},1500);
setInterval(()=>{try{if(typeof S==="undefined"||!S||S.beta||!window.FB||!window.FB.created)return;const c=window.FB.created();if(c&&c<BETA_HASTA){S.beta=1;save();
  toast("🧪 ¡Gracias por jugar desde el principio! Tienes el título exclusivo «Beta-Tester»: póntelo en Tu entrenador › Mi tarjeta.")}}catch(e){}},5000);
// ---------- título «💖 Pareja del Creador» (solo una cuenta, la que elija el creador) ----------
// config/consorte = {uid, n}: lo escribe solo el creador del juego (reglas). La cuenta elegida ve el título en su lista y
// lo lleva con un formato propio (rosa y oro con corazones); en el chat, insignia «💖 Pareja del creador», y marco en el perfil.
let CONS_OK=false;
window.CONSORTE_UID=(()=>{try{return localStorage.getItem("pgc-cons")||""}catch(e){return ""}})();
async function consLoad(){if(!window.FB||!window.FB.consGet)return;try{const d=await window.FB.consGet();CONS_OK=true;window.CONSORTE_UID=d&&d.uid?String(d.uid):"";window.CONSORTE_N=d&&d.n?String(d.n):"";
  try{localStorage.setItem("pgc-cons",window.CONSORTE_UID)}catch(e){}}catch(e){}}
const esConsorte=u=>!!(u&&window.CONSORTE_UID&&u===window.CONSORTE_UID);
const yoConsorte=()=>{try{return esConsorte(window.FB&&window.FB.uid&&window.FB.uid())}catch(e){return false}};
TITLES.splice(1,0,["cons","💖 Pareja del Creador",yoConsorte]);
setInterval(()=>{if(!CONS_OK&&window.FB&&window.FB.consGet&&window.FB.uid&&window.FB.uid())consLoad()},3000);
setInterval(()=>{try{if(window.FB&&window.FB.consGet&&window.FB.uid&&window.FB.uid())consLoad()}catch(e){}},600000);
{const _t=titHTML;titHTML=function(tx,k,u){const s=String(tx||"");
  if(k==="cons"||(!k&&/Pareja del Creador/i.test(s))){if(!esConsorte(u))return "";
    return '<span class="titcons" title="Pareja del creador de Poke Gacha Online"><span class="tkin"><span class="tkh">💖</span><span class="tktx">Pareja del Creador</span><span class="tkh tkh2" aria-hidden="true">👑</span></span>'+
      '<i class="tks k1" aria-hidden="true">♥</i><i class="tks k2" aria-hidden="true">✦</i><i class="tks k3" aria-hidden="true">♥</i><i class="tks k4" aria-hidden="true">✧</i></span>'}
  return _t.apply(this,arguments)}}
// la primera vez que la cuenta elegida entra con el título disponible, se lo ponemos y se lo contamos
setInterval(()=>{try{if(typeof S==="undefined"||!S||!yoConsorte()||S.consSeen)return;S.consSeen=1;const t=shwGet();t.tit="cons";save();
  setTimeout(()=>{toast("💖 ¡Tienes un título único: «Pareja del Creador»! Lo llevas puesto en tu tarjeta de entrenador.");snd("win")},1500)}catch(e){}},5000);
// el perfil de la pareja del creador lleva un marco rosa
{const _op=openProf;openProf=async function(uid){const r=await _op.apply(this,arguments);try{const me=window.FB&&window.FB.uid&&window.FB.uid(),box=arguments[2]||$("profB"),c=box&&box.firstElementChild;
  if(c&&esConsorte(uid||me)&&c.querySelector(".titcons"))c.classList.add("pcons")}catch(e){}return r}}
// tarjeta para el creador (Más › 🎁 Códigos): elegir la cuenta por su nombre de jugador
setInterval(()=>{const P=$("codeAP"),B=$("codeAPB");if(!P||!B||!CONS_OK||typeof yoCreador!=="function"||!yoCreador())return;let c=$("consBox");const st=window.CONSORTE_UID||"-";
  if(c&&c.dataset.st===st)return;if(!c){c=document.createElement("div");c.id="consBox";c.className="creabox";const cb=$("creaBox");if(cb&&cb.parentNode===P)cb.after(c);else P.insertBefore(c,B)}c.dataset.st=st;
  c.innerHTML=window.CONSORTE_UID?'<div>'+titHTML("","cons",window.CONSORTE_UID)+'</div><small class="mut">Lo lleva la cuenta de <b>'+esc(window.CONSORTE_N||"")+'</b>. Solo esa cuenta puede tenerlo; en el chat lleva la insignia «💖 Pareja del creador».</small><button type="button" class="alt mini" id="consDel">Quitar el título</button>'
    :'<b>💖 Título «Pareja del Creador»</b><small class="mut">Un título único para la pareja del creador del juego. Escribe su nombre de jugador (tal cual sale en el juego):</small><div class="coderow"><input id="consNk" maxlength="30" placeholder="Nombre de jugador"><button class="red" id="consGo">💖 Darle el título</button></div><small id="consMsg" class="mut"></small>';
  const g=$("consGo");if(g)g.onclick=async()=>{const nk=String(($("consNk")||{}).value||"").trim(),m=$("consMsg");if(!nk){m.textContent="Escribe su nombre de jugador.";return}
    if(!(await askOk("¿Dar el título «💖 Pareja del Creador» a «"+nk+"»?")))return;g.disabled=true;
    try{await window.FB.consSet(nk);await consLoad();snd("win");toast("💖 ¡"+nk+" ya tiene el título «Pareja del Creador»!")}
    catch(e){g.disabled=false;m.textContent=e&&e.code==="nf"?"No hay ningún jugador con ese nombre. Revisa que esté bien escrito (mayúsculas incluidas no importan).":e&&e.code==="self"?"Ese es tu propio nombre.":"No se ha podido guardar. Inténtalo de nuevo."}};
  const d=$("consDel");if(d)d.onclick=async()=>{if(!(await askOk("¿Quitar el título «Pareja del Creador» a "+(window.CONSORTE_N||"esa cuenta")+"?")))return;try{await window.FB.consDel();await consLoad();toast("Título quitado.")}catch(e){toast("No se ha podido quitar.")}}},1500);
