// =====================================================================================
// MEJORAS: selector visual del equipo, añadir al equipo desde la ficha, orden alfabético
// y dos mejoras nuevas en la tienda
// =====================================================================================
// ---------- dos mejoras nuevas en la tienda ----------
G.push(["Estadio Pokémon",400000,250],["Laboratorio del Profesor",6000000,1000]);GI.push("🏟️","🔬");
// las dos últimas mejoras suben de precio más rápido (×1,18 y ×1,40)
const GGR=[1.15,1.15,1.15,1.15,1.15,1.18,1.40];
gc=i=>Math.ceil(G[i][1]*Math.pow(GGR[i]||1.15,S.g[i]||0));
function gPad(){S.g=S.g||[];while(S.g.length<G.length)S.g.push(0)}
gPad();{const _r=render;render=function(){gPad();if(!$("bg"+(G.length-1))&&$("shop"))try{buildShop()}catch(e){}return _r.apply(this,arguments)}}

// ---------- orden de la lista del equipo ----------
var TP={slot:-1,q:"",o:"lv"};
const tpSorts={lv:["Nivel (mayor primero)",(a,b)=>lvd(b[0]).l-lvd(a[0]).l||a[0].localeCompare(b[0],"es")],az:["Alfabético (A-Z)",(a,b)=>nk(a[0]).localeCompare(nk(b[0]),"es")],za:["Alfabético (Z-A)",(a,b)=>nk(b[0]).localeCompare(nk(a[0]),"es")],rar:["Rareza",(a,b)=>"CREML".indexOf(b[2])-"CREML".indexOf(a[2])||lvd(b[0]).l-lvd(a[0]).l],dex:["Número de Pokédex",(a,b)=>(a[4]||0)-(b[4]||0)]};
function tpOwn(){
  const q=nrm(($("fq")||{}).value||"").trim(),r=($("fr2")||{}).value,t=($("ft2")||{}).value,g=($("fg2")||{}).value,q2=nrm(TP.q||"");
  return P.filter(p=>S.owned[p[0]]&&!isSup(p[0])&&(!r||p[2]===r)&&(!t||p[1]===t)&&(!g||p[3]===+g)&&(nrm(p[0]).includes(q)||nrm(nk(p[0])).includes(q))&&(!q2||nrm(p[0]).includes(q2)||nrm(nk(p[0])).includes(q2))).sort(tpSorts[TP.o]?tpSorts[TP.o][1]:tpSorts.lv[1]);
}
// ---------- casillas visuales del equipo ----------
{const _u=updTeam;updTeam=function(){_u.apply(this,arguments);try{tmCards()}catch(e){console.error(e)}}}
function tmCards(){
  for(let i=0;i<6;i++){
    const sel=$("tm"+i);if(!sel)continue;const slot=sel.closest(".slot6");if(!slot)continue;slot.classList.add("tmv");
    let b=slot.querySelector(".tmbtn");if(!b){b=document.createElement("button");b.type="button";b.className="tmbtn";b.dataset.tm=i;slot.appendChild(b)}
    const n=S.team[i],p=n&&PM[n];
    b.innerHTML=p?'<span class="tmn">'+(i+1)+'</span><span class="tmspr">'+ico(p,64,false,!!(S.shiny&&S.shiny[n]>0))+'</span><span class="tmt"><b>'+esc(nk(n))+'</b><small>Nv'+lvd(n).l+' · '+STAR[p[2]]+'</small><small>'+EM[p[1]]+' '+TIPO[p[1]]+(S.hp[n]===0?' · <span class="tmko">debilitado</span>':'')+'</small></span><span class="tmch">Cambiar</span>':'<span class="tmn">'+(i+1)+'</span><span class="tmspr tmempty">＋</span><span class="tmt"><b>Casilla vacía</b><small>Toca para elegir un Pokémon</small></span>';
    b.classList.toggle("on",!!p);
  }
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".tmbtn");if(b){snd("ui");tpOpen(+b.dataset.tm)}});
function tpOpen(slot){TP.slot=slot;TP.q="";let m=$("tpM");if(!m){m=document.createElement("div");m.id="tpM";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");document.body.appendChild(m);
  m.addEventListener("click",e=>{if(e.target===m||e.target.closest(".tpx")){tpClose();return}const c=e.target.closest("[data-tpn]");if(c){tpSet(TP.slot,c.dataset.tpn);tpClose();return}const s=e.target.closest("[data-tps]");if(s){TP.slot=+s.dataset.tps;tpRender()}});
  m.addEventListener("input",e=>{if(e.target.id==="tpQ"){TP.q=e.target.value;tpList()}});m.addEventListener("change",e=>{if(e.target.id==="tpO"){TP.o=e.target.value;tpList()}})}
  m.hidden=false;tpRender();setTimeout(()=>{const q=$("tpQ");if(q&&matchMedia("(pointer:fine)").matches)q.focus()},50)}
function tpClose(){const m=$("tpM");if(m)m.hidden=true}
function tpRender(){const m=$("tpM");
  m.innerHTML='<div class="tpw"><div class="tph"><b>Elige un Pokémon para el equipo</b><button class="tpx" aria-label="Cerrar">✕</button></div>'+
    '<div class="tpslots">'+[0,1,2,3,4,5].map(i=>{const n=S.team[i];return '<button class="'+(i===TP.slot?'on':'')+'" data-tps="'+i+'" title="Casilla '+(i+1)+'">'+(n&&PM[n]?ico(PM[n],34):'<span>'+(i+1)+'</span>')+'</button>'}).join("")+'</div>'+
    '<div class="tpf"><input id="tpQ" placeholder="Buscar por nombre o mote..." value="'+esc(TP.q)+'"><select id="tpO" aria-label="Ordenar">'+Object.keys(tpSorts).map(k=>'<option value="'+k+'"'+(TP.o===k?' selected':'')+'>'+tpSorts[k][0]+'</option>').join("")+'</select></div><div class="tpl" id="tpL"></div></div>';
  tpList()}
function tpList(){const L=$("tpL");if(!L)return;const own=tpOwn(),cur=S.team[TP.slot];
  L.innerHTML=(cur?'<button class="tpc tpquit" data-tpn=""><span class="tpspr">✖</span><b>Dejar vacía</b><small>Quitar a '+esc(nk(cur))+'</small></button>':'')+
    (own.length?own.slice(0,400).map(p=>{const n=p[0],inT=S.team.indexOf(n),bz=busyMon(n),sh=S.shiny&&S.shiny[n]>0;
      return '<button class="tpc '+p[2]+(inT===TP.slot?' cur':'')+(bz?' busy':'')+'" data-tpn="'+esc(n)+'"'+(bz?' disabled title="Está '+esc(busyTxt(n))+'"':'')+'><span class="tpspr">'+ico(p,56,false,sh)+'</span><b>'+(sh?"✨ ":"")+esc(nk(n))+'</b><small>Nv'+lvd(n).l+' · '+STAR[p[2]]+'</small><small>'+EM[p[1]]+' '+TIPO[p[1]]+'</small>'+(inT>=0?'<i class="tpin">En casilla '+(inT+1)+'</i>':'')+(S.hp[n]===0?'<i class="tpko">Debilitado</i>':'')+'</button>'}).join(""):'<small class="mut">No tienes Pokémon que coincidan con la búsqueda o los filtros.</small>')}
function tpSet(i,n){
  if(fcd){toast("Termina el combate antes de cambiar el equipo.");return false}
  if(n&&isSup(n)){toast("💠 "+n+" es una forma suprema: lleva a "+SUP[n]+" y transfórmalo en combate.");return false}
  if(n&&busyMon(n)){toast("🔒 "+n+" está "+busyTxt(n)+".");return false}
  S.team[i]=n||"";if(n)S.team.forEach((x,j)=>{if(j!==i&&x===n)S.team[j]=""});save();updTeam();snd("ui");return true}
// ---------- añadir al equipo desde la ficha ----------
{const _pv=pkView;pkView=function(n,sh){_pv(n,sh);try{if(!(S.owned[n]>0)||isSup(n))return;const w=document.querySelector("#pkv .fich");if(!w)return;const d=document.createElement("div");d.className="fichr fteam";d.innerHTML=fteamHTML(n);w.prepend(d)}catch(e){console.error(e)}}}
function fteamHTML(n){const at=S.team.indexOf(n);
  return '<span>Equipo</span><div><div class="ftslots">'+[0,1,2,3,4,5].map(i=>{const x=S.team[i];return '<button class="'+(x===n?'me':'')+'" data-fts="'+i+'" data-fn="'+esc(n)+'" title="'+(x?esc(nk(x))+' — toca para cambiarlo por '+esc(nk(n)):'Casilla '+(i+1)+' vacía')+'">'+(x&&PM[x]?ico(PM[x],34):'<span>＋</span>')+'<i>'+(i+1)+'</i></button>'}).join("")+'</div><small class="mut">'+(at>=0?'Está en la casilla '+(at+1)+'. Toca otra casilla para moverlo, o la suya para sacarlo.':'Toca una casilla para poner a '+esc(nk(n))+' en tu equipo.')+'</small></div>'}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-fts]");if(!b)return;const i=+b.dataset.fts,n=b.dataset.fn;
  const ok=S.team[i]===n?tpSet(i,""):tpSet(i,n);if(ok!==false){toast(S.team[i]===n?"⭐ "+nk(n)+" está ahora en la casilla "+(i+1)+" de tu equipo":"Has sacado a "+nk(n)+" del equipo");const r=b.closest(".fteam");if(r)r.innerHTML=fteamHTML(n)}});
// ---------- orden alfabético en la Pokédex ----------
{const fo=$("fo");if(fo&&!fo.querySelector('option[value="az"]'))fo.insertAdjacentHTML("beforeend",'<option value="az">Alfabético (A-Z)</option><option value="za">Alfabético (Z-A)</option>')}
{const _sd=sortDex;sortDex=function(a){const o=$("fo").value;if(o==="az"||o==="za"){const k=p=>hasP(p[0])?nk(p[0]):"￿"+p[0];return a.slice().sort((x,y)=>o==="az"?k(x).localeCompare(k(y),"es"):k(y).localeCompare(k(x),"es"))}return _sd(a)}}
// al cargar una partida guardada el equipo se dibuja antes de que exista esta mejora: se rehace al momento y se vigila
setTimeout(()=>{try{tmCards()}catch(e){}},0);
setInterval(()=>{try{const s=document.querySelector("#team .slot6:not(.tmv)");if(s)tmCards()}catch(e){}},700);
{const _r2=render;render=function(){const x=_r2.apply(this,arguments);try{if(document.querySelector("#team .slot6:not(.tmv)"))tmCards()}catch(e){}return x}}
// ================= SUGERENCIAS CON FOTOS =================
const SUG_MAXI=3,SUG_IMGB=230000;var SUGI=[];
function sugImgUI(){
  let w=$("sugImgs");const t=$("sugT");if(!t)return;
  if(!w){w=document.createElement("div");w.id="sugImgs";t.after(w);
    const bar=document.createElement("div");bar.className="sugbar";bar.innerHTML='<label class="sugadd" title="Añadir fotos"><input type="file" id="sugFile" accept="image/*" multiple hidden>📷 Añadir fotos</label><small class="mut">Máx. '+SUG_MAXI+' fotos · Enter para enviar, Shift+Enter para saltar de línea · también puedes pegar capturas con Ctrl+V</small>';w.before(bar);
    $("sugFile").onchange=e=>{sugAddFiles([...e.target.files]);e.target.value=""};
    w.addEventListener("click",e=>{const b=e.target.closest("[data-sx]");if(b){SUGI.splice(+b.dataset.sx,1);sugImgUI()}});
    t.addEventListener("paste",e=>{const f=[...(e.clipboardData||{}).items||[]].filter(i=>i.kind==="file"&&/^image\//.test(i.type)).map(i=>i.getAsFile());if(f.length){e.preventDefault();sugAddFiles(f)}});
    t.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();e.stopPropagation();$("sugGo").click()}});
  }
  w.innerHTML=SUGI.map((s,i)=>'<span class="sugth"><img src="'+s+'" alt="Foto '+(i+1)+'"><button type="button" data-sx="'+i+'" aria-label="Quitar foto">✕</button></span>').join("");
}
async function sugComp(file){
  const url=await new Promise((r,j)=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.onerror=j;fr.readAsDataURL(file)});
  const img=await new Promise((r,j)=>{const im=new Image();im.onload=()=>r(im);im.onerror=j;im.src=url});
  let max=1100,q=.72,out="";
  for(let k=0;k<8;k++){const s=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement("canvas");c.width=Math.max(1,Math.round(img.width*s));c.height=Math.max(1,Math.round(img.height*s));const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);out=c.toDataURL("image/jpeg",q);if(out.length<=SUG_IMGB)break;max*=.8;q=Math.max(.4,q-.08)}
  return out;
}
async function sugAddFiles(files){
  for(const f of files){if(SUGI.length>=SUG_MAXI){sugMsg("Puedes adjuntar como máximo "+SUG_MAXI+" fotos.");break}if(!/^image\//.test(f.type))continue;try{SUGI.push(await sugComp(f))}catch(e){sugMsg("No se ha podido leer esa imagen.")}}
  sugImgUI();
}
$("sugGo").onclick=async()=>{
  const t=$("sugT").value.trim();
  if(!window.sugSend){sugMsg("Para enviar sugerencias tienes que haber iniciado sesión con tu cuenta.");return}
  if(t.length<5&&!SUGI.length){sugMsg("Escribe un poco más (mínimo 5 caracteres) o adjunta una foto.");return}
  $("sugGo").disabled=true;sugMsg("Enviando…");
  try{await window.sugSend(t.slice(0,1000),pvNick(),SUGI.slice(0,SUG_MAXI));$("sugT").value="";SUGI=[];sugImgUI();sugMsg("✅ ¡Gracias! Tu sugerencia se ha enviado.");if(!$("sugAdm").hidden)sugLoad()}
  catch(e){sugMsg("No se pudo enviar la sugerencia ("+((e&&e.code)||"error")+"). Inténtalo más tarde.")}
  $("sugGo").disabled=false;
};
sugLoad=async function(){
  if(!window.sugList)return;
  let l;try{l=await window.sugList()}catch(e){$("sugAdm").hidden=true;return}
  $("sugAdm").hidden=false;
  $("sugList").innerHTML=l.length?l.map(s=>{const im=Array.isArray(s.imgs)?s.imgs:[];return '<div class="sugi"><div class="sugbt">'+(im.length?'<button class="alt" data-sdi="'+esc(s.id)+'">🖼️ Borrar fotos</button>':'')+'<button class="alt" data-sd="'+esc(s.id)+'">🗑️ Borrar</button></div><b>'+esc(s.name||"Anónimo")+'</b>'+(s.nick?' <small class="mut">('+esc(s.nick)+')</small>':'')+' <small class="mut">· '+(s.at?new Date(s.at).toLocaleString("es"):"")+'</small> '+sugStB(s.st)+'<p>'+esc(s.text||"").replace(/\n/g,"<br>")+'</p>'+sugAdmBox(s)+
    (im.length?'<div class="sugims">'+im.map(u=>/^data:image\/(jpeg|png|webp);base64,/.test(u)?'<a href="#" data-sgv="1"><img src="'+u+'" alt="Foto adjunta"></a>':'').join("")+'</div>':(s.nimg?'<small class="mut">🖼️ '+s.nimg+' foto'+(s.nimg>1?'s':'')+' borrada'+(s.nimg>1?'s':'')+'</small>':''))+'</div>'}).join(""):'<small class="mut">Aún no hay sugerencias.</small>';
};
$("sugRe").onclick=()=>sugLoad();
$("sugList").addEventListener("click",async e=>{
  const v=e.target.closest("[data-sgv]");if(v){e.preventDefault();const u=v.querySelector("img").src;nxModal('<img class="sugbig" src="'+u+'" alt="Foto adjunta"><button id="sgOk">Cerrar</button>');$("sgOk").onclick=nxModalClose;return}
  const b=e.target.closest("[data-sdi]");if(!b||!window.sugImgDel)return;
  if(!confirm("¿Borrar las fotos de esta sugerencia? El texto se conserva."))return;
  b.disabled=true;try{await window.sugImgDel(b.dataset.sdi)}catch(x){toast("No se han podido borrar las fotos ("+((x&&x.code)||"error")+").")}
  sugLoad();
});
setTimeout(sugImgUI,300);
// ================= SEGUIMIENTO DE SUGERENCIAS: estado, respuesta del desarrollador y cancelar =================
const SUGST={"":["⏳","Pendiente","#8a8fa8"],seen:["👀","Vista","#3f86f0"],wip:["🛠️","En desarrollo","#d8961e"],done:["✅","Completada","#2fa36b"],no:["🚫","Descartada","#c43c3c"]};
const sugSt=st=>SUGST[st]||SUGST[""];
function sugStB(st){const x=sugSt(st);return '<span class="sugst" style="--sc:'+x[2]+'">'+x[0]+' '+x[1]+'</span>'}
const sugDate=t=>t?new Date(t).toLocaleString("es",{dateStyle:"medium",timeStyle:"short"}):"";
function sugAdmBox(s){
  return '<div class="sugadm" data-sid="'+esc(s.id)+'"><div class="sets-row"><label class="mut">Estado <select data-sst>'+Object.keys(SUGST).map(k=>'<option value="'+k+'"'+((s.st||"")===k?' selected':'')+'>'+SUGST[k][0]+' '+SUGST[k][1]+'</option>').join("")+'</select></label></div>'+
    '<textarea data-srp maxlength="1000" rows="2" placeholder="Responder al jugador (lo verá en «Mis sugerencias»)…">'+esc(s.rp||"")+'</textarea>'+
    '<div class="sets-row"><button class="mini" data-ssv>💾 Guardar estado y respuesta</button>'+(s.rpAt?'<small class="mut">Respondida el '+sugDate(s.rpAt)+'</small>':'')+'</div></div>';
}
$("sugList").addEventListener("click",async e=>{
  const b=e.target.closest("[data-ssv]");if(!b||!window.sugUpd)return;
  const w=b.closest("[data-sid]"),st=w.querySelector("[data-sst]").value,rp=w.querySelector("[data-srp]").value.trim().slice(0,1000);
  const f={st:st,rp:rp};if(rp)f.rpAt=Date.now();
  b.disabled=true;try{await window.sugUpd(w.dataset.sid,f);toast("💾 Sugerencia actualizada.")}catch(x){toast("No se ha podido guardar ("+((x&&x.code)||"error")+").")}
  sugLoad();
});
// ---- mis sugerencias ----
nxPanel("mySugP","📨 Mis sugerencias","Aquí ves las sugerencias que has enviado, en qué estado están y lo que te ha contestado el desarrollador. Puedes cancelar cualquiera que todavía no esté completada.");
{const g=HUB.find(x=>x.k==="mas");if(g&&!g.tabs.some(t=>t[0]==="mySugP")){const i=g.tabs.findIndex(t=>t[0]==="sugP");g.tabs.splice(i+1,0,["mySugP","Mis sugerencias"])}HUBP.mySugP="mas";HUBR.mySugP=()=>mySugUI(true)}
let MYSUG=null,_mysAt=0;
async function mySugFetch(){if(!window.sugMine)return null;try{MYSUG=await window.sugMine();_mysAt=Date.now()}catch(e){MYSUG=e&&e.code==="sin-cuenta"?"login":"err"}return MYSUG}
const sugNew=s=>s.rpAt&&s.rpAt>(S.sugSeen||0);
async function mySugUI(fetch){
  const box=$("mySugPB");if(!box)return;
  if(!window.sugMine){box.innerHTML='<p class="mut">Inicia sesión con tu cuenta para enviar sugerencias y ver las respuestas.</p>';return}
  if(fetch||!MYSUG){box.innerHTML='<p class="mut">Cargando tus sugerencias…</p>';await mySugFetch()}
  if(MYSUG==="login"){box.innerHTML='<p class="mut">Inicia sesión con tu cuenta para ver tus sugerencias.</p>';return}
  if(MYSUG==="err"){box.innerHTML='<p class="mut">No se han podido cargar tus sugerencias ahora mismo. Inténtalo más tarde.</p><button class="alt" data-mys="re">🔄 Reintentar</button>';return}
  const l=MYSUG||[];
  box.innerHTML='<div class="sets-row"><button class="alt" data-mys="re">🔄 Actualizar</button><button class="alt" data-mys="new">✏️ Escribir otra</button><small class="mut">'+l.length+' sugerencia'+(l.length===1?'':'s')+'</small></div>'+
    (l.length?l.map(s=>{const done=s.st==="done",nw=sugNew(s);return '<div class="sugi mys'+(nw?' nw':'')+'">'+
      '<div class="mysh">'+sugStB(s.st)+'<small class="mut">'+sugDate(s.at)+'</small>'+(done?'':'<button class="alt mini" data-mysc="'+esc(s.id)+'">✖ Cancelar</button>')+'</div>'+
      '<p>'+esc(s.text||"").replace(/\n/g,"<br>")+'</p>'+(s.nimg?'<small class="mut">🖼️ '+s.nimg+' foto'+(s.nimg>1?'s':'')+' adjunta'+(s.nimg>1?'s':'')+'</small>':'')+
      (s.rp?'<div class="sugrp"><b>💬 Respuesta del desarrollador'+(nw?' <span class="sugnw">NUEVA</span>':'')+'</b><p>'+esc(s.rp).replace(/\n/g,"<br>")+'</p><small class="mut">'+sugDate(s.rpAt)+'</small></div>':'')+'</div>'}).join(""):'<p class="mut">Todavía no has enviado ninguna sugerencia.</p>');
  const mx=Math.max(S.sugSeen||0,...l.map(s=>s.rpAt||0));if(mx>(S.sugSeen||0)){S.sugSeen=mx;save()}
}
document.addEventListener("click",async e=>{
  const b=e.target.closest&&e.target.closest("#mySugPB [data-mys],#mySugPB [data-mysc]");if(!b)return;
  if(b.dataset.mys==="re"){snd("ui");mySugUI(true);return}
  if(b.dataset.mys==="new"){snd("ui");hubOpen("mas","sugP");setTimeout(()=>{try{$("sugT").focus()}catch(x){}},200);return}
  const id=b.dataset.mysc,s=(Array.isArray(MYSUG)?MYSUG:[]).find(x=>x.id===id);if(!s||s.st==="done")return;
  if(!confirm("¿Cancelar esta sugerencia? Se borrará y el desarrollador ya no la verá."))return;
  b.disabled=true;try{await window.sugDel(id);toast("✖ Sugerencia cancelada.");MYSUG=MYSUG.filter(x=>x.id!==id);mySugUI(false)}catch(x){toast("No se ha podido cancelar ("+((x&&x.code)||"error")+").");b.disabled=false}
});
// después de enviar, la lista se refresca; y avisa si el desarrollador ha respondido
{const _go=$("sugGo").onclick;$("sugGo").onclick=async function(){await _go.apply(this,arguments);MYSUG=null;if(/✅/.test($("sugMsg").textContent))$("sugMsg").innerHTML='✅ ¡Gracias! Tu sugerencia se ha enviado. Puedes seguirla en <a href="#" data-mys2>📨 Mis sugerencias</a>.'}}
document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("[data-mys2]");if(a){e.preventDefault();hubOpen("mas","mySugP")}});
async function sugReplyCheck(){
  if(!window.sugMine||Date.now()-_mysAt<120000)return;
  const l=await mySugFetch();if(!Array.isArray(l))return;
  const n=l.filter(sugNew).length;
  if(n){toast("💬 El desarrollador ha respondido a "+(n===1?"una de tus sugerencias":n+" de tus sugerencias")+". Míralo en Más → Mis sugerencias.")}
}
setTimeout(sugReplyCheck,9000);setInterval(sugReplyCheck,10*60000);
// ================= VENTANA DE COMBATE: se recuerda el modo elegido =================
{const w=$("bigW"),f=$("bigF");if(w){const o=w.onclick;w.onclick=()=>{o();O.bigmode=bigMode==="win"?"win":"";saveO();try{$("bigopt").value=O.bigmode}catch(e){}}}
 if(f){const o=f.onclick;f.onclick=()=>{o();O.bigmode=bigMode==="full"?"full":"";saveO();try{$("bigopt").value=O.bigmode}catch(e){}}}}
