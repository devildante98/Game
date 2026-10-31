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
gPad();
// la lista de ayudantes ya se dibujó con 5 mejoras al arrancar: se fuerza a rehacerla con las 7
window._gk=null;
{const _r=render;render=function(){gPad();if(!$("bg"+(G.length-1))&&$("shop"))try{buildShop()}catch(e){}return _r.apply(this,arguments)}}

// ---------- orden de la lista del equipo ----------
var TP={slot:-1,q:"",o:"lv"};
const tpSorts={lv:["Nivel (mayor primero)",(a,b)=>lvd(b[0]).l-lvd(a[0]).l||a[0].localeCompare(b[0],"es")],az:["Alfabético (A-Z)",(a,b)=>nk(a[0]).localeCompare(nk(b[0]),"es")],za:["Alfabético (Z-A)",(a,b)=>nk(b[0]).localeCompare(nk(a[0]),"es")],rar:["Rareza",(a,b)=>"CREML".indexOf(b[2])-"CREML".indexOf(a[2])||lvd(b[0]).l-lvd(a[0]).l],dex:["Número de Pokédex",(a,b)=>(a[4]||0)-(b[4]||0)]};
function tpOwn(){
  const q=nrm(($("fq")||{}).value||"").trim(),r=($("fr2")||{}).value,t=($("ft2")||{}).value,g=($("fg2")||{}).value,q2=nrm(TP.q||"");
  return P.filter(p=>S.owned[p[0]]&&!isSup(p[0])&&(!r||p[2]===r)&&(!t||tys(p).includes(t))&&(!g||p[3]===+g)&&(nrm(p[0]).includes(q)||nrm(nk(p[0])).includes(q))&&(!q2||nrm(p[0]).includes(q2)||nrm(nk(p[0])).includes(q2))).sort(tpSorts[TP.o]?tpSorts[TP.o][1]:tpSorts.lv[1]);
}
// ---------- casillas visuales del equipo ----------
{const _u=updTeam;updTeam=function(){_u.apply(this,arguments);try{tmCards()}catch(e){console.error(e)}}}
function tmCards(){
  for(let i=0;i<6;i++){
    const sel=$("tm"+i);if(!sel)continue;const slot=sel.closest(".slot6");if(!slot)continue;slot.classList.add("tmv");
    let b=slot.querySelector(".tmbtn");if(!b){b=document.createElement("button");b.type="button";b.className="tmbtn";b.dataset.tm=i;slot.appendChild(b)}
    const n=S.team[i],p=n&&PM[n];
    const h=p?'<span class="tmn">'+(i+1)+'</span><span class="tmspr">'+ico(p,64,false,!!(S.shiny&&S.shiny[n]>0))+'</span><span class="tmt"><b>'+esc(nk(n))+'</b><small>Nv'+lvd(n).l+' · '+STAR[p[2]]+'</small><small>'+tyTxt(p)+(S.hp[n]===0?' · <span class="tmko">debilitado</span>':'')+'</small>'+tmHp(n)+'</span><span class="tmch">Cambiar</span>':'<span class="tmn">'+(i+1)+'</span><span class="tmspr tmempty">＋</span><span class="tmt"><b>Casilla vacía</b><small>Toca para elegir un Pokémon</small></span>';
    if(b._h!==h){b._h=h;b.innerHTML=h}
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
      return '<button class="tpc '+p[2]+(inT===TP.slot?' cur':'')+(bz?' busy':'')+'" data-tpn="'+esc(n)+'"'+(bz?' disabled title="Está '+esc(busyTxt(n))+'"':'')+'><span class="tpspr">'+ico(p,56,false,sh)+'</span><b>'+(sh?"✨ ":"")+esc(nk(n))+'</b><small>Nv'+lvd(n).l+' · '+STAR[p[2]]+'</small><small>'+tyTxt(p)+'</small>'+(inT>=0?'<i class="tpin">En casilla '+(inT+1)+'</i>':'')+(S.hp[n]===0?'<i class="tpko">Debilitado</i>':'')+'</button>'}).join(""):'<small class="mut">No tienes Pokémon que coincidan con la búsqueda o los filtros.</small>')}
function tpSet(i,n){
  if(fcd){toast("Termina el combate antes de cambiar el equipo.");return false}
  if(n&&isSup(n)){toast("💠 "+n+" es una forma suprema: lleva a "+SUP[n]+" y transfórmalo en combate.");return false}
  if(n&&busyMon(n)){toast("🔒 "+n+" está "+busyTxt(n)+".");return false}
  // si ya estaba en otra casilla, intercambian posiciones (no sale del equipo)
  const old=S.team[i]||"",from=n?S.team.findIndex((x,j)=>j!==i&&x===n):-1;
  S.team[i]=n||"";if(from>=0)S.team[from]=old;save();updTeam();snd("ui");
  if(from>=0){toast(old?"🔄 "+nk(n)+" y "+nk(old)+" han intercambiado sus casillas ("+(i+1)+" ↔ "+(from+1)+")":"🔄 "+nk(n)+" ha pasado de la casilla "+(from+1)+" a la "+(i+1));return "swap"}
  return true}
// ---------- añadir al equipo desde la ficha ----------
{const _pv=pkView;pkView=function(n,sh){_pv(n,sh);try{if(!(S.owned[n]>0)||isSup(n))return;const w=document.querySelector("#pkv .fich");if(!w)return;const d=document.createElement("div");d.className="fichr fteam";d.innerHTML=fteamHTML(n);w.prepend(d)}catch(e){console.error(e)}}}
function fteamHTML(n){const at=S.team.indexOf(n);
  return '<span>Equipo</span><div><div class="ftslots">'+[0,1,2,3,4,5].map(i=>{const x=S.team[i];return '<button class="'+(x===n?'me':'')+'" data-fts="'+i+'" data-fn="'+esc(n)+'" title="'+(x?esc(nk(x))+' — toca para cambiarlo por '+esc(nk(n)):'Casilla '+(i+1)+' vacía')+'">'+(x&&PM[x]?ico(PM[x],34):'<span>＋</span>')+'<i>'+(i+1)+'</i></button>'}).join("")+'</div><small class="mut">'+(at>=0?'Está en la casilla '+(at+1)+'. Toca otra casilla para moverlo, o la suya para sacarlo.':'Toca una casilla para poner a '+esc(nk(n))+' en tu equipo.')+'</small></div>'}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-fts]");if(!b)return;const i=+b.dataset.fts,n=b.dataset.fn;
  const ok=S.team[i]===n?tpSet(i,""):tpSet(i,n);if(ok!==false){if(ok!=="swap")toast(S.team[i]===n?"⭐ "+nk(n)+" está ahora en la casilla "+(i+1)+" de tu equipo":"Has sacado a "+nk(n)+" del equipo");const r=b.closest(".fteam");if(r)r.innerHTML=fteamHTML(n)}});
// ---------- orden alfabético en la Pokédex ----------
{const fo=$("fo");if(fo&&!fo.querySelector('option[value="az"]'))fo.insertAdjacentHTML("beforeend",'<option value="az">Alfabético (A-Z)</option><option value="za">Alfabético (Z-A)</option>')}
{const _sd=sortDex;sortDex=function(a){const o=$("fo").value;if(o==="az"||o==="za"){const k=p=>hasP(p[0])?nk(p[0]):"￿"+p[0];return a.slice().sort((x,y)=>o==="az"?k(x).localeCompare(k(y),"es"):k(y).localeCompare(k(x),"es"))}return _sd(a)}}
// al cargar una partida guardada el equipo se dibuja antes de que exista esta mejora: se rehace al momento y se vigila
setTimeout(()=>{try{tmCards()}catch(e){}},0);
setInterval(()=>{try{const s=document.querySelector("#team .slot6:not(.tmv)");if(s)tmCards()}catch(e){}},700);
{const _r2=render;render=function(){const x=_r2.apply(this,arguments);try{tmCards()}catch(e){}return x}}
// barra de vida en las casillas del equipo
function tmHp(n){const mx=mxOf(n),hp=S.hp[n]==null?mx:Math.max(0,Math.min(mx,S.hp[n])),k=mx?hp/mx:0,c=k>.5?"#3ecf5a":k>.2?"#f5c400":"#e63950";
  return '<span class="tmhp" title="PS '+hp+' / '+mx+'"><i style="width:'+(k*100).toFixed(1)+'%;background:'+c+'"></i></span><small class="tmhpt">PS '+hp+' / '+mx+'</small>'}
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
// ================= TIENDA DE EVENTO: ropa, fondos y marcos de tarjeta (de temporada solo durante su evento, y de catálogo), con tickets =================
nxPanel("trShopP","🛍️ Tienda de Evento","Ropa para tu entrenador, fondos y marcos animados para tu tarjeta de perfil y títulos para tu vitrina. Lo de temporada solo se vende mientras dura su evento, ¡no lo dejes escapar! Lo que compras es tuyo para siempre, también al subir de prestigio.");
{const g=HUB.find(x=>x.k==="trn");if(g&&!g.tabs.some(t=>t[0]==="trShopP"))g.tabs.splice(1,0,["trShopP","Tienda de Evento"]);HUBP.trShopP="trn";HUBR.trShopP=()=>trShopUI()}
const evDates=n=>{const e=EVENTS.find(x=>x.n===n);return e?e.a[1]+" "+MESES[e.a[0]-1]+" – "+e.b[1]+" "+MESES[e.b[0]-1]:""};
function trShopCard(it,mode){const[k,v,pr,e]=it,o=TRO.find(x=>x[0]===k),L=myLook(),own=trOwn(k,v),on=L[k]===v,look=Object.assign({},L,{[k]:v});
  const btn=mode==="soon"?'<small class="mut">🔒 Vuelve en '+esc(e)+' ('+evDates(e)+')</small>':own?(on?'<span class="tshon">✅ Te la has puesto</span>':'<button data-tsw="'+k+':'+v+'">👕 Ponérmela</button>'):'<button class="red" data-tsb="'+k+':'+v+'"'+(S.t<pr?' disabled title="Te faltan tickets"':'')+'>Comprar · '+fmt(pr)+' 🎟️</button>';
  return '<div class="tshc'+(own?' own':'')+(mode==="soon"?' soon':'')+'"><div class="tshpv '+(k==="wr"||k==="bp"?"zm":"zt")+'">'+trImg(look,k==="bp"?"b":"f","i","idle")+'</div><b>'+esc(o[2][v])+'</b><small class="mut">'+esc(o[1])+(e?' · '+esc(e):'')+'</small>'+btn+'</div>'}
// ---- tarjeta de perfil: fondos y marcos animados ----
const cbPat=(a,b,c)=>'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text x="4" y="24" font-size="18">'+a+'</text><text x="36" y="58" font-size="16">'+b+'</text></svg>')+'")';
// [id, nombre, precio, evento, fondo CSS, animado]
const CARD_BG=[["sun","Atardecer",3e7,null,"linear-gradient(160deg,#ffb36e,#ff6fa8 50%,#6a5acd)",0],
  ["night","Noche estrellada",6e7,null,"radial-gradient(1.5px 1.5px at 10% 20%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 40% 70%,#fff 50%,transparent 51%),radial-gradient(2px 2px at 70% 30%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 85% 80%,#cfe8ff 50%,transparent 51%),linear-gradient(160deg,#0f1640,#2a1a5a)",1],
  ["sea","Océano",6e7,null,"repeating-linear-gradient(120deg,rgba(255,255,255,.14) 0 12px,transparent 12px 40px),linear-gradient(180deg,#5fd0e6,#1d6fa8)",1],
  ["poke","Lluvia de Poké Balls",1.5e8,null,cbPat("🔴","⚪")+",linear-gradient(160deg,#ff8a8a,#e63950)",1],
  ["hw","Noche de Halloween",4e7,"🎃 Halloween",cbPat("🎃","👻")+",linear-gradient(160deg,#2a1340,#5a2a0a)",1],
  ["xm","Nevada navideña",4e7,"🎄 Navidad",cbPat("❄️","🎁")+",linear-gradient(180deg,#1d3b6a,#3f86c0)",1],
  ["vl","Lluvia de corazones",4e7,"💘 San Valentín",cbPat("💖","💌")+",linear-gradient(160deg,#ff9ec7,#c42a5e)",1],
  ["sp","Pétalos de cerezo",4e7,"🌸 Primavera",cbPat("🌸","🌱")+",linear-gradient(160deg,#ffe0ec,#a8d84a)",1],
  ["su","Día de playa",4e7,"☀️ Verano",cbPat("☀️","🌊")+",linear-gradient(180deg,#7fd6ff 55%,#ffe08a 56%)",1]];
// [id, nombre, precio, evento]  (la animación va en la clase .fr-id)
const CARD_FR=[["gold","Marco dorado",7.5e7,null],["rain","Marco arcoíris",1.5e8,null],["neon","Marco de neón",3e8,null],
  ["hw","Marco fantasmal",5e7,"🎃 Halloween"],["xm","Marco de guirnalda",5e7,"🎄 Navidad"],["vl","Marco latido",5e7,"💘 San Valentín"],["sp","Marco floral",5e7,"🌸 Primavera"],["su","Marco de olas",5e7,"☀️ Verano"]];
const cardIt=(t,id)=>(t==="bg"?CARD_BG:CARD_FR).find(x=>x[0]===id)||null;
function cardGet(){const c=S.card||{};return{bg:c.bg&&trOwn("bg",c.bg)?c.bg:"",fr:c.fr&&trOwn("fr",c.fr)?c.fr:""}}
// clase y estilo de una tarjeta (también para la de otros jugadores)
function cardAttr(bg,fr){const b=cardIt("bg",bg),f=cardIt("fr",fr);return ' class="pcard'+(b&&b[5]?' cba':'')+(b?' cbg':'')+(f?' fr fr-'+f[0]:'')+'"'+(b?' style="background:'+b[4].replace(/"/g,"&quot;")+'"':'')}
function cardMini(L,bg,fr,name){return '<div'+cardAttr(bg,fr)+'><div class="pcmini">'+trImg(L,"f","i")+'<b>'+esc(name)+'</b></div></div>'}
function cardShopCard(t,it,mode){const[id,nm,pr,e]=it,own=trOwn(t,id),cur=cardGet(),on=cur[t]===id,c=Object.assign({},cur,{[t]:id});
  const btn=mode==="soon"?'<small class="mut">🔒 Vuelve en '+esc(e)+' ('+evDates(e)+')</small>':own?(on?'<button class="alt" data-cbq="'+t+'">✖ Quitar</button>':'<button data-cbw="'+t+':'+id+'">🖼️ Usar</button>'):'<button class="red" data-cbb="'+t+':'+id+'"'+(S.t<pr?' disabled title="Te faltan tickets"':'')+'>Comprar · '+fmt(pr)+' 🎟️</button>';
  return '<div class="tshc'+(own?' own':'')+(mode==="soon"?' soon':'')+'"><div class="tshcard">'+cardMini(myLook(),c.bg,c.fr,pvNick?pvClean(pvNick())||"Entrenador":"Entrenador")+'</div><b>'+esc(nm)+'</b><small class="mut">'+(t==="bg"?"Fondo de tarjeta":"Marco animado")+(e?' · '+esc(e):'')+'</small>'+btn+'</div>'}
// títulos (los compras y te los pones en la vitrina)
function titShopCard(it,mode){const[id,tx,pr,e]=it,own=trOwn("ti",id),on=typeof shwGet==="function"&&shwGet().tit===id;
  const btn=mode==="soon"?'<small class="mut">🔒 Vuelve en '+esc(e)+' ('+evDates(e)+')</small>':own?(on?'<span class="tshon">✅ Lo llevas puesto</span>':'<button data-tiw="'+id+'">🏷️ Ponérmelo</button>'):'<button class="red" data-tib="'+id+'"'+(S.t<pr?' disabled title="Te faltan tickets"':'')+'>Comprar · '+fmt(pr)+' 🎟️</button>';
  return '<div class="tshc'+(own?' own':'')+(mode==="soon"?' soon':'')+'"><div class="tshtit"><span>'+esc(tx)+'</span></div><b>Título</b><small class="mut">Para tu vitrina y tu perfil'+(e?' · '+esc(e):'')+'</small>'+btn+'</div>'}
function trShopUI(){const box=$("trShopPB");if(!box)return;const ev=evNow(),en=ev?ev.n:null;
  // todo lo de la tienda como [tipo, item]: ropa ("tr") y tarjeta ("bg"/"fr")
  const all=[...TRSHOP.map(x=>["tr",x,x[3]]),...CARD_BG.map(x=>["bg",x,x[3]]),...CARD_FR.map(x=>["fr",x,x[3]]),...(typeof TITLE_SHOP!=="undefined"?TITLE_SHOP.map(x=>["ti",x,x[3]]):[])],own=q=>q[0]==="tr"?trOwn(q[1][0],q[1][1]):trOwn(q[0],q[1][0]);
  const card=(q,m)=>q[0]==="tr"?trShopCard(q[1],m):q[0]==="ti"?titShopCard(q[1],m):cardShopCard(q[0],q[1],m);
  const sec=(t,L,m)=>L.length?'<h3 class="shh">'+t+'</h3><div class="tshg">'+L.map(q=>card(q,m)).join("")+'</div>':"";
  const cur=all.filter(q=>en&&q[2]===en),cat=all.filter(q=>!q[2]),mine=all.filter(q=>q[2]&&q[2]!==en&&own(q)),soon=all.filter(q=>q[2]&&q[2]!==en&&!own(q));
  const c=cardGet();
  box.innerHTML='<div class="tshtop"><div class="tshcard big">'+cardMini(myLook(),c.bg,c.fr,pvNick?pvClean(pvNick())||"Entrenador":"Entrenador")+'</div><div><b>Tu tarjeta de entrenador</b><small class="mut">Así la ven los demás jugadores cuando abren tu perfil.</small><button class="alt mini" data-myc>👁️ Ver mi tarjeta completa</button><div class="tshtk">🎟️ Tienes <b>'+fmt(S.t)+'</b></div></div></div>'+
    (cur.length?sec(ev.n+' · ¡solo hasta el '+ev.b[1]+' '+MESES[ev.b[0]-1]+'!',cur,""):'<p class="mut">Ahora mismo no hay ningún evento de temporada. Lo próximo aparecerá con el siguiente evento.</p>')+
    sec("🛍️ Catálogo",cat,"")+sec("🎁 Tus artículos de temporada",mine,"")+sec("📅 Próximamente en otros eventos",soon,"soon");
}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;
  const a=t.closest("[data-trshop]");if(a){e.preventDefault();snd("ui");hubOpen("trn","trShopP");return}
  const w=t.closest("#trShopPB [data-tsw]");if(w){const[k,v]=w.dataset.tsw.split(":");trSet(k,+v);snd("ui");trShopUI();toast("👕 ¡Te queda genial!");return}
  const tw=t.closest("#trShopPB [data-tiw]");if(tw){if(!trOwn("ti",tw.dataset.tiw))return;shwGet().tit=tw.dataset.tiw;save();snd("ui");trShopUI();toast("🏷️ ¡Título cambiado!");return}
  const tb=t.closest("#trShopPB [data-tib]");if(tb){const it=TITLE_SHOP.find(x=>x[0]===tb.dataset.tib),ev=evNow();if(!it||trOwn("ti",it[0]))return;
    if(it[3]&&(!ev||ev.n!==it[3])){toast("Este título solo se vende durante "+it[3]+".");return}
    if(S.t<it[2]){toast("Te faltan "+fmt(it[2]-S.t)+" 🎟️.");return}
    if(!confirm("¿Comprar el título «"+it[1]+"» por "+fmt(it[2])+" 🎟️?"))return;
    S.t-=it[2];S.trOwn=S.trOwn||{};S.trOwn["ti:"+it[0]]=1;shwGet().tit=it[0];save();render();snd("lvl");toast("🏷️ ¡Has comprado el título «"+it[1]+"»! Ya lo luces en tu vitrina y tu perfil.");trShopUI();return}
  const cq=t.closest("#trShopPB [data-cbq]");if(cq){S.card=Object.assign({},S.card,{[cq.dataset.cbq]:""});save();snd("ui");trShopUI();return}
  const cw=t.closest("#trShopPB [data-cbw]");if(cw){const[k,id]=cw.dataset.cbw.split(":");if(!trOwn(k,id))return;S.card=Object.assign({},S.card,{[k]:id});save();snd("ui");trShopUI();toast("🖼️ ¡Tarjeta actualizada!");return}
  const cb=t.closest("#trShopPB [data-cbb]");if(cb){const[k,id]=cb.dataset.cbb.split(":"),it=cardIt(k,id),ev=evNow();if(!it||trOwn(k,id))return;
    if(it[3]&&(!ev||ev.n!==it[3])){toast("Esto solo se vende durante "+it[3]+".");return}
    if(S.t<it[2]){toast("Te faltan "+fmt(it[2]-S.t)+" 🎟️.");return}
    if(!confirm("¿Comprar «"+it[1]+"» por "+fmt(it[2])+" 🎟️?"))return;
    S.t-=it[2];S.trOwn=S.trOwn||{};S.trOwn[k+":"+id]=1;S.card=Object.assign({},S.card,{[k]:id});save();render();snd("lvl");toast("🛍️ ¡Has comprado «"+it[1]+"» en la Tienda de Evento! Ya está en tu tarjeta.");trShopUI();return}
  const b=t.closest("#trShopPB [data-tsb]");if(b){const[k,v0]=b.dataset.tsb.split(":"),v=+v0,it=trShopIt(k,v),ev=evNow();if(!it||trOwn(k,v))return;
    if(it[3]&&(!ev||ev.n!==it[3])){toast("Esta prenda solo se vende durante "+it[3]+".");return}
    if(S.t<it[2]){toast("Te faltan "+fmt(it[2]-S.t)+" 🎟️.");return}
    const o=TRO.find(x=>x[0]===k);if(!confirm("¿Comprar «"+o[2][v]+"» por "+fmt(it[2])+" 🎟️?"))return;
    S.t-=it[2];S.trOwn=S.trOwn||{};S.trOwn[k+":"+v]=1;trSet(k,v);save();render();snd("lvl");toast("🛍️ ¡Has comprado «"+o[2][v]+"» en la Tienda de Evento! Ya la llevas puesta.");trShopUI()}
});
// la tarjeta se publica con el perfil
{const _rd=window.rankData;if(_rd)window.rankData=function(){const d=_rd();if(!d)return d;const c=cardGet();d.cbg=c.bg;d.cfr=c.fr;return d}}
// ================= MI TARJETA: tu perfil tal y como lo ven los demás =================
nxPanel("myCardP","🪪 Mi tarjeta","Así ven tu perfil los demás jugadores cuando lo abren desde la clasificación, el chat o la lista de amigos.");
{const g=HUB.find(x=>x.k==="trn");if(g&&!g.tabs.some(t=>t[0]==="myCardP"))g.tabs.splice(1,0,["myCardP","Mi tarjeta"]);HUBP.myCardP="trn";HUBR.myCardP=()=>myCardUI()}
function myCardData(){window._rdForce=1;let d=null;try{d=window.rankData?window.rankData():null}catch(e){}window._rdForce=0;
  d=d||{n:pvClean(pvNick())||"Entrenador",tr:trEnc(myLook()),dex:P.filter(p=>hasP(p[0])).length,prs:S.prs|0};const c=cardGet();d.cbg=c.bg;d.cfr=c.fr;return d}
async function myCardUI(){const box=$("myCardPB");if(!box)return;
  box.innerHTML='<div class="mycbar"><button class="red" data-mycs>🛍️ Personalizar en la Tienda de Evento</button><button class="alt" data-mycv>🧑 Cambiar mi entrenador</button></div><div class="mycwrap" id="myCardV"></div>'+(typeof nickOk==="function"&&nickOk()&&window.FB?'':'<small class="mut">Para que los demás puedan ver tu perfil necesitas una cuenta iniciada y un apodo registrado (en PVP online).</small>');
  const me=window.FB&&window.FB.uid?window.FB.uid():"me";await openProf(me,myCardData(),$("myCardV"))}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;if(t.closest("[data-mycs]")){snd("ui");hubOpen("trn","trShopP")}else if(t.closest("[data-mycv]")){snd("ui");hubOpen("trn","trP")}else if(t.closest("[data-myc]")){e.preventDefault();snd("ui");hubOpen("trn","myCardP")}});
// ================= TIENDA DE MT: compra discos que enseñan movimientos fuera de combate =================
nxPanel("mtP","💿 Tienda de MT","Las MT enseñan un movimiento a un Pokémon fuera de combate. Cada Pokémon solo puede aprender las MT que aprende en los juegos originales. Se usan desde la Mochila (un solo uso).");
{const g=HUB.find(x=>x.k==="bag");if(g&&!g.tabs.some(t=>t[0]==="mtP")){const i=g.tabs.findIndex(t=>t[0]==="bagP");g.tabs.splice(i+1,0,["mtP","Tienda de MT"])}HUBP.mtP="bag";HUBR.mtP=()=>mtShopUI()}
let MTF={t:"",q:"",mine:false};
function mtShopUI(){const box=$("mtPB");if(!box)return;const own=P.filter(p=>S.owned[p[0]]>0),types=[...new Set(MT_LIST.map(m=>m.t))];
  const q=nrm(MTF.q||"");const L=MT_LIST.filter(m=>(!MTF.t||m.t===MTF.t)&&(!q||nrm(m.n).includes(q))&&(!MTF.mine||own.some(p=>mtOk(p[0],m.id))));
  let h='<div class="mttop"><div class="tshtk">🎟️ Tienes <b>'+fmt(S.t)+'</b></div><input id="mtQ" placeholder="Buscar MT..." value="'+esc(MTF.q||"")+'" aria-label="Buscar MT"><label class="mtmine"><input type="checkbox" id="mtMine"'+(MTF.mine?' checked':'')+'> Solo las que puede aprender alguno de mis Pokémon</label></div>'+
    '<div class="mtty"><button class="'+(!MTF.t?'on':'')+'" data-mtt="">Todas</button>'+types.map(t=>'<button class="'+(MTF.t===t?'on':'')+'" data-mtt="'+t+'" style="--tc:'+TC[t]+'">'+EM[t]+' '+TIPO[t]+'</button>').join("")+'</div>';
  let last="";h+=L.length?'<div class="mtg">'+L.map(m=>{const id="mt"+m.id,pr=mtPrice(m),n=S.bag[id]|0,cnt=own.filter(p=>mtOk(p[0],m.id)).length,hd=m.t!==last?'</div><h3 class="shh">'+EM[m.t]+' '+TIPO[m.t]+'</h3><div class="mtg">':'';last=m.t;
    return hd+'<div class="mtc" style="--tc:'+TC[m.t]+'"><div class="mtch">'+itemIco(id,42)+'<div><b>MT '+esc(m.n)+'</b><small>'+EM[m.t]+' '+TIPO[m.t]+' · '+(m.cl===0?'Estado':m.cl===1?'Físico':'Especial')+'</small></div></div>'+
      '<small class="mut mtd">'+esc(mvDesc(m))+'</small><small class="mtcp">'+(cnt?'✅ La pueden aprender <b>'+cnt+'</b> de tus Pokémon':'⚪ Ninguno de tus Pokémon la aprende')+(n?' · Tienes ×'+n:'')+'</small>'+
      '<button class="red" data-mtb="'+id+'"'+(S.t<pr?' disabled title="Te faltan tickets"':'')+'>Comprar · '+fmt(pr)+' 🎟️</button></div>'}).join("")+'</div>':'<p class="mut">No hay MT con esos filtros.</p>';
  h=h.replace('<div class="mtg"></div>','');
  box.innerHTML=h+'<small class="mut">💡 Después de comprarla, ve a la <a href="#" data-mtbag>Mochila</a>, pulsa «Usar» en la MT y elige qué Pokémon la aprende y qué movimiento olvida.</small>';
  const qi=$("mtQ");if(qi){qi.oninput=()=>{MTF.q=qi.value;const p=qi.selectionStart;mtShopUI();const n=$("mtQ");n.focus();try{n.setSelectionRange(p,p)}catch(e){}}}
  const mm=$("mtMine");if(mm)mm.onchange=()=>{MTF.mine=mm.checked;mtShopUI()};
}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;
  const ty=t.closest("#mtPB [data-mtt]");if(ty){MTF.t=ty.dataset.mtt;snd("ui");mtShopUI();return}
  const bg=t.closest("#mtPB [data-mtbag]");if(bg){e.preventDefault();hubOpen("bag","bagU");return}
  const b=t.closest("#mtPB [data-mtb]");if(b){const id=b.dataset.mtb,m=MVD[id.slice(2)],pr=mtPrice(m);if(S.t<pr){toast("Te faltan "+fmt(pr-S.t)+" 🎟️.");return}
    S.t-=pr;S.bag[id]=(S.bag[id]|0)+1;qEv("buy",1);save();render();snd("lvl");toast("💿 Has comprado la MT "+m.n+". Úsala desde la Mochila.");mtShopUI()}});
// ================= ficha: movimientos que conoce el Pokémon =================
function fmovHTML(n){const L=moves(PM[n]).filter(x=>x);if(!L.length)return "";const CL=["💫 Estado","💥 Físico","🔮 Especial"];
  return '<span>Movimientos</span><div class="fmovs">'+L.map(mv=>{const c=ppCur(n,mv.id),x=ppMax(n,mv.id),fx=String(mvDesc(mv)).split(" · ").filter(t=>!/^(PP|Poder|Prec\.)\s|^(Físico|Especial|Estado)$/.test(t)).slice(1).join(" · ");
    return '<div class="fmov" style="--tc:'+(TC[mv.t]||"#999")+'" title="'+esc(mvDesc(mv))+'"><b>'+esc(mv.n)+'</b><small><i>'+EM[mv.t]+' '+TIPO[mv.t]+'</i> '+(CL[mv.cl]||"")+'</small><small class="mut">'+(mv.cl?'Poder '+(mv.pw||"—")+' · ':'')+'Prec. '+(mv.ac?mv.ac+'%':'—')+' · <span class="'+(c<=0?'fmov0':'')+'">PP '+c+'/'+x+'</span></small>'+(fx?'<small class="fmovd">'+esc(fx)+'</small>':'')+'</div>'}).join("")+fmovNext(n)+'</div>'}
// próximo movimiento que aprenderá al subir de nivel
function fmovNext(n){const l=lvd(n).l,from=S.ml&&S.ml[n]!=null?S.ml[n]:l,ids=moveIds(n);
  const pend=learn(n).filter(x=>x[0]>from&&x[0]<=l&&!ids.includes(x[1])),nx=learn(n).find(x=>x[0]>l&&!ids.includes(x[1]));
  if(pend.length)return '<small class="fmovnx">✨ Tiene '+pend.length+' movimiento(s) nuevo(s) por aprender: se le ofrecerán en su próximo combate.</small>';
  return nx&&MVD[nx[1]]?'<small class="fmovnx">📈 Próximo: <b>'+esc(MVD[nx[1]].n)+'</b> al Nv'+nx[0]+'</small>':''}
{const _pv=pkView;pkView=function(n,sh){_pv(n,sh);try{if(!(S.owned[n]>0)||isSup(n))return;const w=document.querySelector("#pkv .fich");if(!w)return;const h=fmovHTML(n);if(!h)return;const d=document.createElement("div");d.className="fichr fmovr";d.innerHTML=h;w.appendChild(d)}catch(e){console.error(e)}}}

// ================= partidas exportadas: firma y comprobación de valores imposibles =================
// La firma detecta archivos editados a mano (no es infalible: el código del juego es visible, pero frena la edición casual).
const SAVE_SALT="pgo·v1·a7f3c91e5b·🎟️";
async function saveSign(j){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(SAVE_SALT+j+SAVE_SALT));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function saveCheck(d){
  const isI=(v,mx)=>Number.isInteger(v)&&v>=0&&v<=mx,obj=v=>v&&typeof v==="object"&&!Array.isArray(v);
  if(!obj(d)||!obj(d.owned)||typeof d.t!=="number")return "no es una partida válida";
  if(!Number.isFinite(d.t)||d.t<0||d.t>1e18)return "la cantidad de tickets es imposible";
  for(const k in d.owned){if(!isI(d.owned[k],1e7))return "tiene una cantidad imposible de "+String(k).slice(0,30)}
  if(d.shiny!=null){if(!obj(d.shiny))return "datos de variocolores incorrectos";for(const k in d.shiny){if(!isI(d.shiny[k],1e7))return "datos de variocolores incorrectos"}}
  if(d.lv!=null){if(!obj(d.lv))return "datos de niveles incorrectos";for(const k in d.lv){const v=d.lv[k];if(!obj(v)||!isI(v.l,100)||v.l<1||!(v.x>=0))return "tiene un nivel imposible ("+String(k).slice(0,30)+")"}}
  if(d.bag!=null){if(!obj(d.bag))return "datos de la mochila incorrectos";for(const k in d.bag)if(!isI(d.bag[k],1e9))return "tiene una cantidad imposible de objetos"}
  if(d.g!=null&&(!Array.isArray(d.g)||d.g.some(v=>!isI(v,1e7))))return "tiene una cantidad imposible de ayudantes";
  if(d.prs!=null&&!isI(d.prs,1000))return "el prestigio es imposible";
  if(d.pulls!=null&&!isI(d.pulls,1e9))return "el número de tiradas es imposible";
  return "";
}
// ================= jugadores nuevos: ventana para elegir el apodo =================
// sale una vez a quien todavía tiene el apodo automático («Entrenador1234»), después de la bienvenida
function nkPopNeeded(){return !S.nickPick&&/^Entrenador\d+$/.test(pvNick())}
function nkPop(){
  if(!nkPopNeeded()||$("nkM"))return;
  if(popBusy()){setTimeout(nkPop,1500);return}
  const m=document.createElement("div");m.id="nkM";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-label","Elige tu apodo");
  m.innerHTML='<div class="jbox"><h2>✏️ Elige tu apodo</h2><p>Es el nombre con el que te verán los demás jugadores en el chat, los rankings, los combates y tu tarjeta de entrenador. Es único: nadie más podrá usarlo.</p>'+
    '<input id="nkIn" maxlength="16" autocomplete="off" spellcheck="false" placeholder="Tu apodo" aria-label="Tu apodo"><small id="nkMsg" class="mut">Puedes cambiarlo cuando quieras en Online → PVP.</small>'+
    '<div class="jrow"><button class="red" id="nkOk">Guardar apodo</button><button class="alt" id="nkLater">Más tarde</button></div></div>';
  document.body.appendChild(m);const inp=$("nkIn");inp.value="";
  const close=()=>{S.nickPick=1;save();m.remove()};
  const go=async()=>{const nn=pvClean(inp.value);if(!inp.value.trim()||nn.length<3){$("nkMsg").textContent="El apodo debe tener al menos 3 caracteres.";return}
    $("nkOk").disabled=true;$("pvNick").value=nn;try{await nickSave()}catch(e){}$("nkOk").disabled=false;
    const r=$("pvNickMsg").textContent||"";if(r.startsWith("✅")){close();snd("lvl");toast("✏️ ¡Tu apodo ahora es «"+pvNick()+"»!")}else $("nkMsg").textContent=r||"No se pudo guardar el apodo. Inténtalo de nuevo."};
  $("nkOk").onclick=go;inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();e.stopPropagation();go()}});
  $("nkLater").onclick=close;
  setTimeout(()=>{try{inp.focus()}catch(e){}},100);
}
setTimeout(nkPop,2500);
{const b=$("welcOk");if(b)b.addEventListener("click",()=>setTimeout(nkPop,500))}
// ================= mochila: barra de búsqueda =================
function bagFilter(){const g=$("bgrid"),i=$("bagQ");if(!g||!i)return;const q=nrm(i.value.trim());let n=0,t=0;
  g.querySelectorAll(".btile").forEach(el=>{t++;const ok=!q||nrm(el.querySelector("b")?el.querySelector("b").textContent+" "+el.textContent:el.textContent).includes(q);el.hidden=!ok;if(ok)n++});
  let e=$("bagQn");if(!e){e=document.createElement("small");e.id="bagQn";e.className="mut";g.after(e)}e.textContent=q&&t?(n?"":"Ningún objeto coincide con «"+i.value.trim()+"».")
:""}
{const _bu=bagUI;bagUI=function(){_bu.apply(this,arguments);try{const g=$("bgrid");if(!g)return;if(!$("bagQ")){const w=document.createElement("div");w.className="bagq";w.innerHTML='<input id="bagQ" type="search" placeholder="🔎 Buscar en la mochila…" aria-label="Buscar en la mochila" autocomplete="off">';g.before(w);$("bagQ").addEventListener("input",bagFilter)}bagFilter()}catch(e){console.error(e)}}}
// ================= mochila: usar un objeto en una ventana emergente =================
{const bu=$("buse");if(bu){const M=document.createElement("div");M.id="buseM";M.hidden=true;M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");M.setAttribute("aria-label","Usar objeto");
  const W=document.createElement("div");W.className="busew";const msg=document.createElement("small");msg.id="buseMsg";msg.className="mut";
  W.appendChild(bu);W.appendChild(msg);M.appendChild(W);document.body.appendChild(M);
  const sync=()=>{M.hidden=bu.hidden;const t=$("bagMsg");msg.textContent=t?t.textContent:"";msg.hidden=!msg.textContent};
  new MutationObserver(sync).observe(bu,{attributes:true,attributeFilter:["hidden"]});
  {const t=$("bagMsg");if(t)new MutationObserver(sync).observe(t,{childList:true,characterData:true,subtree:true})}
  M.addEventListener("click",e=>{if(e.target===M){const c=$("buClose");if(c)c.click()}});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!M.hidden){const c=$("buClose");if(c){e.stopPropagation();c.click()}}},true);
  sync()}}

// ================= ventanas al entrar: de una en una =================
// orden para jugadores nuevos: bienvenida → apodo → tutorial → pase diario; los avisos de logros esperan a que no haya ventanas
function popBusy(){return ["welc","newsM","strkM","privM","lrnM","nkM"].some(id=>{const e=$(id);return e&&!e.hidden})||(typeof TS!=="undefined"&&TS.i>=0)}
const tutPending=()=>typeof TS!=="undefined"&&(TS.i>=0||(!S.tutDone&&!((S.pulls|0)>0)));
function popFree(){return !popBusy()&&!tutPending()&&!(typeof nkPopNeeded==="function"&&nkPopNeeded())}
const _popQ=[];let _popT=0;
function popToast(t){_popQ.push(t);popFlush()}
function popFlush(){if(!_popQ.length||Date.now()<_popT)return;if(popBusy())return;_popT=Date.now()+4300;toast(_popQ.shift())}
setInterval(popFlush,1000);
// ================= textos de introducción largos: una línea y «Más información» =================
function introCollapse(){document.querySelectorAll("section.panel > p.rates, section.panel > p.nxi").forEach(p=>{
  if(p.dataset.ic)return;p.dataset.ic=1;const pr=p.previousElementSibling;if(!pr||pr.tagName!=="H2"||p.querySelector("[id]")||p.textContent.length<150)return;
  const h=p.innerHTML,m=h.match(/^([\s\S]*?[.!?])\s+(?=[A-ZÁÉÍÓÚ¿¡<])/);if(!m||m[1].replace(/<[^>]*>/g,"").length>140)return;
  const rest=h.slice(m[0].length);if(rest.replace(/<[^>]*>/g,"").trim().length<30)return;
  p.innerHTML=m[1]+' <button type="button" class="infob" aria-expanded="false">ℹ️ Más información</button><span class="infor" hidden> '+rest+'</span>'})}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".infob");if(!b)return;const r=b.nextElementSibling;if(!r)return;const o=r.hidden;r.hidden=!o;b.setAttribute("aria-expanded",String(o));b.textContent=o?"▲ Menos":"ℹ️ Más información"});
introCollapse();setInterval(introCollapse,2000);

// ================= minijuegos: cómo se consiguen puntos =================
const MGHOW={
 who:["10 rondas de 8 segundos: adivina el Pokémon por su silueta.","Cada acierto da <b>100 puntos</b>, más <b>hasta 100</b> según lo rápido que respondas.","<b>Racha</b>: desde el 3.er acierto seguido sumas +25, +50, +75… extra. Un fallo la corta.","Máximo posible: <b>2.900</b> (acertar las 10 al instante)."],
 mem:["Encuentra las 8 parejas.","Empiezas con <b>1.600 puntos</b> y pierdes <b>40 por cada intento</b> (cada par de cartas que levantas) y <b>8 por cada segundo</b>.","Memoriza bien las cartas que ves: menos intentos y más rápido = más puntos.","Máximo posible: unos <b>1.280</b> (8 intentos perfectos)."],
 dig:["Tienes 30 segundos y los topos salen cada vez más rápido.","<b>Diglett +1</b>, <b>Dugtrio +3</b>. ¡No toques a <b>Voltorb</b>: −3 y pierdes el combo!","<b>Combo</b>: a partir de 5 aciertos seguidos, cada golpe vale +1 extra. Si se te escapa un Diglett, el combo vuelve a 0.","Una partida muy buena ronda los <b>110–130</b>."],
 fish:["8 lanzamientos: pulsa en cuanto aparezca <b>¡!</b>","Cada Pokémon común da <b>10 puntos</b>; Lapras y Gyarados (raros) dan <b>90</b>.","Cuanto más rápido reacciones, más <b>bonus</b> (hasta +50%). Los raros te dan muy poco tiempo.","Si pulsas antes de tiempo o tarde, se escapa. Los raros que pesques pueden quedarse contigo."],
 thr:["10 lanzamientos: lanza cuando el círculo sea <b>pequeño</b> y el Pokémon esté en el <b>centro</b>.","<b>¡Excelente!</b> 100 · <b>¡Genial!</b> 60 · <b>¡Bien!</b> 30. Si el Pokémon no está centrado, fallas.","<b>Combo</b>: desde el 3.er acierto seguido, +10, +20, +30… extra. Fallar lo corta.","Máximo posible: <b>1.360</b> (10 Excelentes seguidos)."],
 run:["Toca la pantalla o pulsa espacio para saltar vallas y rocas.","Ganas <b>1 punto por metro</b> recorrido y <b>15</b> por cada 🎟️ que recojas en el aire.","Rapidash va cada vez más rápido: no hay límite, aguanta todo lo que puedas."],
 exc:["Pica la pared para <b>desenterrar tesoros</b> (hay de 2 a 4 escondidos).","<b>Solo puntúa el tesoro que queda totalmente al descubierto</b>: si queda una casilla de roca encima, no cuenta.","⛏️ <b>Pico</b>: rompe la casilla y un poco las de alrededor (en cruz). Daña poco la pared.<br>🔨 <b>Martillo</b>: rompe un cuadrado de 3×3. Daña el doble la pared.","La barra de arriba es la <b>estabilidad</b>: si llega a 0, la pared se derrumba y termina la partida (conservas lo ya desenterrado).","Las rocas más oscuras son más duras. Usa el martillo para abrir zonas y el pico para terminar de destapar los bordes.","Puntos por tesoro: Esfera Roja/Azul 40 · Perla 60 · Pepita 90 · Esfera Grande 120 · Hueso Raro 140 · Trozo Estrella 160 · Piedra evolutiva 200 · Objeto escondido 220 · Caramelo Raro 260 · Fósil 300."],
 wgt:["Dos Pokémon: elige cuál pesa más o menos, o cuál es más alto o más bajo.","Cada acierto da <b>100 puntos</b>, más <b>hasta 60</b> por rapidez, más <b>10 × tu racha</b>.","Se juega hasta el <b>primer fallo</b>: cuantas más seguidas aciertes, más vale cada una."],
 fos:["Igual que la Excavación: destapa del todo cada fósil para que cuente.","Cada fósil vale <b>300–520 puntos</b> (el Ámbar Viejo es el que más). Los tesoros pequeños dan 40–110.","Cuida la <b>estabilidad</b>: el martillo daña el doble que el pico.","Los fósiles que saques van al 🧪 Laboratorio, donde puedes revivirlos."]};
function mgHow(id){const L=MGHOW[id];return L?'<details class="mghow" open><summary>🏆 Cómo conseguir más puntos</summary><ul>'+L.map(x=>'<li>'+x+'</li>').join("")+'</ul></details>':""}
