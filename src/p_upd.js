// =====================================================================================
// MEJORAS: selector visual del equipo, añadir al equipo desde la ficha, orden alfabético
// y dos mejoras nuevas en la tienda
// =====================================================================================
// ---------- dos mejoras nuevas en la tienda ----------
G.push(["Estadio Pokémon",400000,250],["Laboratorio del Profesor",6000000,1000]);GI.push("🏟️","🔬");
// las dos últimas mejoras suben de precio más rápido (×1,18 y ×1,25)
const GGR=[1.15,1.15,1.15,1.15,1.15,1.18,1.25];
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
  return P.filter(p=>S.owned[p[0]]&&!isSup(p[0])&&!isMegaF(p[0])&&(!r||p[2]===r)&&(!t||tys(p).includes(t))&&(!g||p[3]===+g)&&(nrm(p[0]).includes(q)||nrm(nk(p[0])).includes(q))&&(!q2||nrm(p[0]).includes(q2)||nrm(nk(p[0])).includes(q2))).sort(tpSorts[TP.o]?tpSorts[TP.o][1]:tpSorts.lv[1]);
}
// ---------- casillas visuales del equipo ----------
{const _u=updTeam;updTeam=function(){_u.apply(this,arguments);try{tmCards()}catch(e){console.error(e)}}}
function tmCards(){
  for(let i=0;i<6;i++){
    const sel=$("tm"+i);if(!sel)continue;const slot=sel.closest(".slot6");if(!slot)continue;slot.classList.add("tmv");
    let b=slot.querySelector(".tmbtn");if(!b){b=document.createElement("button");b.type="button";b.className="tmbtn";b.dataset.tm=i;slot.appendChild(b)}
    const n=S.team[i],p=n&&PM[n];
    const h=p?'<span class="tmn">'+(i+1)+'</span><span class="tmspr">'+ico(p,64,false,!!(S.shiny&&S.shiny[n]>0))+'</span><span class="tmt"><b>'+esc(nk(n))+'</b><small>Nv'+lvd(n).l+' · '+STAR[p[2]]+'</small><small>'+tyTxt(p)+(S.hp[n]===0?' · <span class="tmko">debilitado</span>':'')+'</small>'+tmHp(n)+tmItem(n)+'</span><span class="tmch">Cambiar</span><span class="tmfi" data-tmf="'+esc(n)+'" role="button" title="Ver la ficha: objeto, habilidad, movimientos…">🔍 Ficha</span>':'<span class="tmn">'+(i+1)+'</span><span class="tmspr tmempty">＋</span><span class="tmt"><b>Casilla vacía</b><small>Toca para elegir un Pokémon</small></span>';
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
  if(n&&isMegaF(n)){toast("🧬 "+n+" no va en el equipo: lleva a "+megaBase(n)+" y "+megaVerb(n)+" en combate.");return false}
  if(n&&busyMon(n)){toast("🔒 "+n+" está "+busyTxt(n)+".");return false}
  // si ya estaba en otra casilla, intercambian posiciones (no sale del equipo)
  const old=S.team[i]||"",from=n?S.team.findIndex((x,j)=>j!==i&&x===n):-1;
  S.team[i]=n||"";if(from>=0)S.team[from]=old;save();updTeam();snd("ui");
  if(from>=0){toast(old?"🔄 "+nk(n)+" y "+nk(old)+" han intercambiado sus casillas ("+(i+1)+" ↔ "+(from+1)+")":"🔄 "+nk(n)+" ha pasado de la casilla "+(from+1)+" a la "+(i+1));return "swap"}
  return true}
// ---------- añadir al equipo desde la ficha ----------
{const _pv=pkView;pkView=function(n,sh){_pv(n,sh);try{if(!(S.owned[n]>0)||isSup(n))return;const w=document.querySelector("#pkv .fich");if(!w)return;if(isMegaF(n)){const d=document.createElement("div");d.className="fichr fteam";d.innerHTML='<span>Equipo</span><div><small class="mut">🧬 '+(/ Gigamax$/.test(n)?'Las formas Gigamax':'Las megaevoluciones')+' no van en el equipo: pon a <b>'+esc(megaBase(n))+'</b> y pulsa «'+(/ Gigamax$/.test(n)?'Gigamax':'Megaevolucionar')+'» en combate.</small></div>';w.prepend(d);return}const d=document.createElement("div");d.className="fichr fteam";d.innerHTML=fteamHTML(n);w.prepend(d)}catch(e){console.error(e)}}}
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
  if(!await askOk("¿Borrar las fotos de esta sugerencia? El texto se conserva."))return;
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
  if(!await askOk("¿Cancelar esta sugerencia? Se borrará y el desarrollador ya no la verá."))return;
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
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest)return;
  const a=t.closest("[data-trshop]");if(a){e.preventDefault();snd("ui");hubOpen("trn","trShopP");return}
  const w=t.closest("#trShopPB [data-tsw]");if(w){const[k,v]=w.dataset.tsw.split(":");trSet(k,+v);snd("ui");trShopUI();toast("👕 ¡Te queda genial!");return}
  const tw=t.closest("#trShopPB [data-tiw]");if(tw){if(!trOwn("ti",tw.dataset.tiw))return;shwGet().tit=tw.dataset.tiw;save();snd("ui");trShopUI();toast("🏷️ ¡Título cambiado!");return}
  const tb=t.closest("#trShopPB [data-tib]");if(tb){const it=TITLE_SHOP.find(x=>x[0]===tb.dataset.tib),ev=evNow();if(!it||trOwn("ti",it[0]))return;
    if(it[3]&&(!ev||ev.n!==it[3])){toast("Este título solo se vende durante "+it[3]+".");return}
    if(S.t<it[2]){toast("Te faltan "+fmt(it[2]-S.t)+" 🎟️.");return}
    if(!await askOk("¿Comprar el título «"+it[1]+"» por "+fmt(it[2])+" 🎟️?"))return;
    S.t-=it[2];S.trOwn=S.trOwn||{};S.trOwn["ti:"+it[0]]=1;shwGet().tit=it[0];save();render();snd("lvl");toast("🏷️ ¡Has comprado el título «"+it[1]+"»! Ya lo luces en tu vitrina y tu perfil.");trShopUI();return}
  const cq=t.closest("#trShopPB [data-cbq]");if(cq){S.card=Object.assign({},S.card,{[cq.dataset.cbq]:""});save();snd("ui");trShopUI();return}
  const cw=t.closest("#trShopPB [data-cbw]");if(cw){const[k,id]=cw.dataset.cbw.split(":");if(!trOwn(k,id))return;S.card=Object.assign({},S.card,{[k]:id});save();snd("ui");trShopUI();toast("🖼️ ¡Tarjeta actualizada!");return}
  const cb=t.closest("#trShopPB [data-cbb]");if(cb){const[k,id]=cb.dataset.cbb.split(":"),it=cardIt(k,id),ev=evNow();if(!it||trOwn(k,id))return;
    if(it[3]&&(!ev||ev.n!==it[3])){toast("Esto solo se vende durante "+it[3]+".");return}
    if(S.t<it[2]){toast("Te faltan "+fmt(it[2]-S.t)+" 🎟️.");return}
    if(!await askOk("¿Comprar «"+it[1]+"» por "+fmt(it[2])+" 🎟️?"))return;
    S.t-=it[2];S.trOwn=S.trOwn||{};S.trOwn[k+":"+id]=1;S.card=Object.assign({},S.card,{[k]:id});save();render();snd("lvl");toast("🛍️ ¡Has comprado «"+it[1]+"» en la Tienda de Evento! Ya está en tu tarjeta.");trShopUI();return}
  const b=t.closest("#trShopPB [data-tsb]");if(b){const[k,v0]=b.dataset.tsb.split(":"),v=+v0,it=trShopIt(k,v),ev=evNow();if(!it||trOwn(k,v))return;
    if(it[3]&&(!ev||ev.n!==it[3])){toast("Esta prenda solo se vende durante "+it[3]+".");return}
    if(S.t<it[2]){toast("Te faltan "+fmt(it[2]-S.t)+" 🎟️.");return}
    const o=TRO.find(x=>x[0]===k);if(!await askOk("¿Comprar «"+o[2][v]+"» por "+fmt(it[2])+" 🎟️?"))return;
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
// ================= menú: volver al panel anterior =================
// 1) botón «‹» en la cabecera de cada ventana del menú para volver a la cuadrícula del menú
// 2) si algo se abre desde una ventana del menú (un minijuego, un combate, los ajustes…), al cerrarlo se vuelve a esa ventana
const HBR={ret:null,at:0};let _hubU=false;
const hubUser=()=>{_hubU=true;setTimeout(()=>{_hubU=false},0)};
{const _hc=hubClose;hubClose=function(){const M=$("hubM");if(M&&!M.hidden&&HB.g){if(_hubU)HBR.ret=null;else{HBR.ret={g:HB.g,t:HB.t};HBR.at=Date.now()}}_hubU=false;return _hc.apply(this,arguments)}}
document.addEventListener("click",e=>{const t=e.target;if(t&&(t.id==="hubM"||(t.closest&&t.closest("#hubX,#hubBk"))))hubUser()},true);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("hubM")&&!$("hubM").hidden)hubUser()},true);
function hubBackBtn(){const h=document.querySelector("#hubM .hubh");if(!h||$("hubBk"))return;const b=document.createElement("button");b.id="hubBk";b.type="button";b.title="Volver al menú";b.setAttribute("aria-label","Volver al menú");b.textContent="‹";
  b.addEventListener("click",()=>{snd("ui");hubClose();hubMenu(true)});h.prepend(b)}
const HB_OV=["mgM","optp","welc","arena","evo","chw","jlv","prof"];
function hubWatch(){hubBackBtn();HB_OV.forEach(id=>{const el=$(id);if(!el)return;
  const bind=()=>{if(!el.hidden&&HBR.ret&&Date.now()-HBR.at<2500){el._ret=HBR.ret;HBR.ret=null}};
  if(!el._hw){el._hw=1;new MutationObserver(()=>{if(!el.hidden)bind();else if(el._ret){const r=el._ret;el._ret=null;setTimeout(()=>{if($("hubM").hidden&&!fcd&&$("arena").hidden)hubOpen(r.g,r.t)},120)}}).observe(el,{attributes:true,attributeFilter:["hidden"]})}
  bind()})}
hubWatch();setInterval(hubWatch,250);

// equipo: objeto equipado en la casilla y botón «Ficha» para ampliar la información (objeto, habilidad, movimientos, mote…)
function tmItem(n){const h=typeof heldOf==="function"?heldOf(n):"",it=h&&ITEMS.find(x=>x[0]===h);return it?'<small class="tmit">'+itemIco(h,16)+' '+esc(it[1])+'</small>':''}
document.addEventListener("click",e=>{const f=e.target.closest&&e.target.closest("[data-tmf]");if(!f)return;e.preventDefault();e.stopPropagation();snd("ui");const n=f.dataset.tmf;if(S.owned[n]>0)pkView(n,!!(S.shiny&&S.shiny[n]>0))},true);
{const _pc=pkClose;pkClose=function(){const r=_pc.apply(this,arguments);try{tmCards()}catch(e){}return r}}
// ================= ficha: estadísticas del Pokémon =================
function fstatHTML(n){const p=PM[n];if(!p)return "";const l=lvd(n).l,N=NAT[natOf(n)]||NAT[0],f=k=>N[1]===k?1.1:N[2]===k?.9:1,
  hp=stH(p,l),atk=Math.round(stA(p,l)*f("atk")),spa=Math.round(stA(p,l)*f("spa")),sdf=f("spd"),spe=Math.round((l+WW[p[2]]*4)*f("spe")),df=f("def"),
  mxH=stH(["","","L"],100),mxA=Math.round(stA(["","","L"],100)*1.1),mxS=Math.round((100+16)*1.1),
  arr=k=>N[1]===k?' <i class="fsup">▲10%</i>':N[2]===k?' <i class="fsdn">▼10%</i>':'',
  bar=(v,m,c)=>'<span class="fsb"><i style="width:'+Math.min(100,v/m*100).toFixed(1)+'%;background:'+c+'"></i></span>';
  return '<span>Estadísticas</span><div class="fstat">'+
    '<div><b>❤️ PS</b><span>'+hp+'</span>'+bar(hp,mxH,"#3ecf5a")+'</div>'+
    '<div><b>⚔️ Ataque</b><span>'+atk+arr("atk")+'</span>'+bar(atk,mxA,"#ff6b5a")+'</div>'+
    '<div><b>✨ Ataque Esp.</b><span>'+spa+arr("spa")+'</span>'+bar(spa,mxA,"#ff9a3c")+'</div>'+
    '<div><b>🛡️ Defensa</b><span>'+(df>1?'Alta':df<1?'Baja':'Normal')+arr("def")+'</span>'+bar(df,1.1,"#5aa0ff")+'</div>'+
    '<div><b>🔰 Defensa Esp.</b><span>'+(sdf>1?'Alta':sdf<1?'Baja':'Normal')+arr("spd")+'</span>'+bar(sdf,1.1,"#6be0ff")+'</div>'+
    '<div><b>💨 Velocidad</b><span>'+spe+arr("spe")+'</span>'+bar(spe,mxS,"#ffcc33")+'</div>'+
    '<small class="mut">Dependen de la rareza ('+({C:"Común",R:"Raro",E:"Épico",M:"Forma especial",L:"Legendario"}[p[2]]||"")+'), el nivel y la naturaleza ('+esc(N[0])+'). Suben al subir de nivel.</small></div>'}
{const _pv=pkView;pkView=function(n,sh){_pv(n,sh);try{if(!(S.owned[n]>0)||isSup(n))return;const w=document.querySelector("#pkv .fich");if(!w)return;
  const d=document.createElement("div");d.className="fichr fstatr";d.innerHTML=fstatHTML(n);const mv=w.querySelector(".fmovr");if(mv)mv.before(d);else w.appendChild(d)}catch(e){console.error(e)}}}
// ================= Más → Próximamente: proyectos que vienen =================
// Para añadir un proyecto: una línea nueva en ROADMAP [icono, título, descripción]
const ROADMAP=[
 ["📊","Estadísticas base reales de cada especie","Cada Pokémon tendrá sus propias estadísticas oficiales (PS, Ataque, Defensa, Ataque Especial, Defensa Especial y Velocidad): Snorlax aguantará muchísimo, Jolteon será rapidísimo, Alakazam tendrá un Ataque Especial enorme… Los combates se parecerán mucho más a los juegos originales."]];
nxPanel("roadP","🚀 Próximas actualizaciones","Lo que estamos preparando para el juego. ¡Atento a las Novedades!");
{const g=HUB.find(x=>x.k==="mas");if(g&&!g.tabs.some(t=>t[0]==="roadP"))g.tabs.splice(1,0,["roadP","Próximamente"]);HUBP.roadP="mas";HUBR.roadP=()=>roadUI()}
function roadUI(){const b=$("roadPB");if(!b)return;b.innerHTML='<div class="roadl">'+ROADMAP.map(r=>'<div class="roadc"><span class="roadi">'+r[0]+'</span><div><b>'+esc(r[1])+'</b><span class="roadt">⏳ Próximamente</span><p>'+esc(r[2])+'</p></div></div>').join("")+'</div><small class="mut">¿Tienes alguna idea? Envíala desde Más → Sugerencias.</small>'}

// ================= megaevoluciones: solo en combate, nunca directamente en el equipo =================
const isMegaF=n=>/^Mega-| Gigamax$/.test(String(n||""))&&!(typeof isSup==="function"&&isSup(n));
const megaBase=n=>String(n).replace(/^Mega-/,"").replace(/ [XY]$/,"").replace(/ Gigamax$/,"");
const megaVerb=n=>/ Gigamax$/.test(String(n))?"gigamaxízalo":"megaevoluciónalo";
// compensación: quien tenía una mega o Gigamax y no tenía su forma base, la recibe (al nivel de la forma, si es mayor)
function megaComp(n){const b=megaBase(n);if(!PM[b]||isMegaF(b)||(typeof isSup==="function"&&isSup(b)))return "";const L=Math.max(1,Math.min(100,(S.lv[n]&&S.lv[n].l)||1));let got="";
  if(!(S.owned[b]>0)){S.owned[b]=1;got=b}
  S.lv=S.lv||{};if(!S.lv[b]||S.lv[b].l<L){S.lv[b]={l:L,x:0};delete S.mv[b];S.ml=S.ml||{};S.ml[b]=L;if(S.hp)delete S.hp[b]}
  return got}
function megaClean(){if(fcd)return;const out=[],slots=[];const f=(t,main)=>(t||[]).map((n,i)=>{if(n&&isMegaF(n)){out.push(n);if(main)slots.push([i,n]);return ""}return n});
  S.team=f(S.team,1);(S.sets||[]).forEach(st=>{st.team=f(st.team)});
  // una sola vez: quien ya perdió su mega/Gigamax del equipo antes de esta compensación y no tiene la forma base
  let gift=[];if(!S.megaComp){S.megaComp=1;Object.keys(S.owned||{}).forEach(n=>{if(S.owned[n]>0&&isMegaF(n)&&!(S.owned[megaBase(n)]>0)){const g=megaComp(n);if(g)gift.push(g)}});if(!gift.length)save()}
  if(out.length){const u=[...new Set(out)];u.forEach(n=>{const g=megaComp(n);if(g)gift.push(g)});
    // el Pokémon base ocupa la casilla que dejó su forma (si no está ya en el equipo)
    slots.forEach(([i,n])=>{const b=megaBase(n);if(PM[b]&&S.owned[b]>0&&!S.team.includes(b)&&!S.team[i])S.team[i]=b});
    toast("🧬 "+u.join(", ")+(u.length>1?" han salido":" ha salido")+" del equipo: las megaevoluciones y formas Gigamax se activan en combate desde "+[...new Set(u.map(megaBase))].join(", ")+".")}
  gift=[...new Set(gift)];
  if(out.length||gift.length){save();try{updTeam();render()}catch(e){}}
  if(gift.length)setTimeout(()=>toast("🎁 Compensación: has recibido "+gift.join(", ")+" para poder megaevolucionar o gigamaxizar en combate."),4500)}
setTimeout(megaClean,1500);setInterval(megaClean,4000);

// ================= megas y Gigamax en la colección: son «llaves» para transformarse en combate =================
// 1) ficha: sin nivel, movimientos, habilidad, objeto ni estadísticas (no se usan); explica a qué Pokémon desbloquea
{const _pv=pkView;pkView=function(n,sh){_pv(n,sh);if(isMegaF(n)&&S.owned[n]>0)Promise.resolve().then(()=>{try{megaFicha(n)}catch(e){console.error(e)}})}}
function megaFicha(n){const m=$("pkv");if(!m||m.hidden)return;const b=megaBase(n),gm=/ Gigamax$/.test(n),lb=S.owned[b]>0?lvd(b).l:0;
  const inf=m.querySelector(".pkvinfo");if(inf)[...inf.children].forEach(x=>{if(/Nivel/.test(x.textContent))x.remove()});
  const w=m.querySelector(".fich");if(!w)return;
  [...w.querySelectorAll(".fichr")].forEach(r=>{const l=(r.querySelector("span")||{}).textContent||"";if(!/Mote|Favorito/.test(l))r.remove()});
  const k=document.createElement("div");k.className="fichr fkey";
  k.innerHTML='<span>🔑 Llave</span><div><b>Desbloquea '+(gm?'la forma Gigamax':'la megaevolución')+' de '+esc(b)+'</b><small class="mut">Pon a '+esc(b)+' en tu equipo y pulsa «'+(gm?'🔴 Gigamax':'🧬 Megaevolucionar')+'» en combate. Usará el nivel y los movimientos de tu '+esc(b)+(lb?' (Nv'+lb+')':' (todavía no lo tienes)')+'.<br>Solo necesitas una: las copias repetidas del gacha se convierten en Caramelos Raros o tickets.</small></div>';
  w.prepend(k)}
// 2) los Caramelos Raros y las MT no se ofrecen para estas formas (ver p_bag: candList y mtList)
// 3) copias repetidas del gacha: al azar, Caramelos Raros o tickets
let MDUP={c:0,t:0};
function megaDup(n){if(!isMegaF(n))return null;S.owned[n]=Math.max(1,(S.owned[n]|0)-1);
  if(Math.random()<.5){const q=1+(Math.random()<.35?1:0);S.bag.cand=(S.bag.cand||0)+q;MDUP.c+=q;return -q}
  const t=Math.round(Math.max(5000,cost(1,false)*5));MDUP.t+=t;return t}
{const _pu=pull;pull=function(){MDUP={c:0,t:0};const r=_pu.apply(this,arguments);if(MDUP.c||MDUP.t){const c=MDUP.c,t=MDUP.t;setTimeout(()=>toast("🔑 Megas/Gigamax repetidas convertidas en: "+[c?c+" Caramelo"+(c>1?"s":"")+" Raro"+(c>1?"s":""):"",t?fmt(t)+" 🎟️":""].filter(Boolean).join(" y ")+"."),1800)}return r}}
// ================= tienda de mejoras: comprar ×1, ×10, ×50 o el máximo =================
// Guantes de entrenador: nivel máximo 30 (cada nivel duplica los tickets por toque; más allá el juego se rompe)
const GLMAX=30;
if((S.cl|0)>GLMAX){S.cl=GLMAX;save()}
let SHQ=(()=>{try{return localStorage.getItem("pg_shq")||"1"}catch(e){return "1"}})();
function shopN(i){const lv0=i<0?(S.cl|0):(S.g[i]|0),unit=k=>i<0?Math.round(25*Math.pow(3,lv0+k)):Math.ceil(G[i][1]*Math.pow(GGR[i]||1.15,lv0+k));
  const mx=SHQ==="max",lim=mx?100000:+SHQ;let n=0,c=0;
  while(n<lim){if(i<0&&lv0+n>=GLMAX)break;const u=unit(n);if(mx&&c+u>S.t){if(!n)c=u;break}c+=u;n++}
  return [n,c]}
function shopBuy(i){if(i<0&&(S.cl|0)>=GLMAX)return;const [n,c]=shopN(i);if(!n||S.t<c)return;S.t-=c;if(i<0)S.cl=(S.cl|0)+n;else S.g[i]=(S.g[i]|0)+n;window._gk=null;save();render()}
function shopWire(){const sh=$("shop");if(!sh)return;
  if(!$("shopQ")){const q=document.createElement("div");q.id="shopQ";q.innerHTML='<small>Comprar:</small>'+["1","10","50","max"].map(v=>'<button type="button" data-shq="'+v+'">'+(v==="max"?"Máx":"×"+v)+'</button>').join("");sh.before(q);
    q.addEventListener("click",e=>{const b=e.target.closest("[data-shq]");if(!b)return;SHQ=b.dataset.shq;try{localStorage.setItem("pg_shq",SHQ)}catch(x){}snd("ui");updShop()})}
  const bc=$("bcl");if(bc)bc.onclick=()=>shopBuy(-1);G.forEach((g,i)=>{const b=$("bg"+i);if(b)b.onclick=()=>shopBuy(i)})}
{const _bs=buildShop;buildShop=function(){_bs.apply(this,arguments);shopWire()}}
updShop=function(){
  if((S.cl|0)>GLMAX){S.cl=GLMAX;window._fk=null;save()}
  const set=(id,i,lv)=>{const e=$(id);if(!e)return;const [n,c]=shopN(i),full=i<0&&lv>=GLMAX;
    $(id+"q").textContent="Nv "+lv+(full?" · MÁX":"");$(id+"c").textContent=full?"Nivel máximo":"🎟️ "+fmt(c)+(n>1?" (×"+n+")":SHQ!=="1"&&n===1?" (×1)":"");e.disabled=full||!n||S.t<c};
  set("bcl",-1,S.cl|0);G.forEach((g,i)=>set("bg"+i,i,S.g[i]||0));
  const q=$("shopQ");if(q)q.querySelectorAll("[data-shq]").forEach(b=>b.classList.toggle("on",b.dataset.shq===SHQ))};
shopWire();try{updShop()}catch(e){}
// ================= evoluciones: si ya tenías esa especie, eliges con cuál te quedas =================
// el juego guarda un solo registro por especie (nivel, movimientos, naturaleza, habilidad, objeto, mote…)
const EVK=["lv","mv","ml","pp","ppu","hp","nat","abil","held","mote"];
const evoRec=n=>{const r={};EVK.forEach(k=>{const o=S[k];if(o&&o[n]!=null)r[k]=JSON.parse(JSON.stringify(o[n]))});return r};
function evoPut(n,r){EVK.forEach(k=>{S[k]=S[k]||{};if(r[k]!=null)S[k][n]=JSON.parse(JSON.stringify(r[k]));else delete S[k][n]})}
{const _ea=evoApply;evoApply=function(a,b){
  const had=S.owned[b]>0&&S.lv&&S.lv[b],ra=evoRec(a),rb=had?evoRec(b):null;
  const r=_ea.apply(this,arguments);
  try{
    // naturaleza, habilidad, objeto y mote pasan a la evolución (antes se quedaban en la forma anterior)
    const nr=Object.assign({},evoRec(b));["nat","held","mote"].forEach(k=>{if(ra[k]!=null&&(!had||nr[k]==null))nr[k]=ra[k]});
    if(!had){evoPut(b,Object.assign(nr,{abil:undefined}));if(ra.held!=null)S.held[b]=ra.held}
    ["nat","abil","held","mote"].forEach(k=>{if(S[k])delete S[k][a]});save();
    if(had)evoChoose(a,b,Object.assign({},ra,{abil:undefined}),rb);
  }catch(e){console.error(e)}
  return r}}
function evoChoose(a,b,rn,ro){
  const mv=r=>(r.mv||[]).map(id=>MVD[id]?MVD[id].n:"").filter(Boolean).join(", ")||"—",nat=r=>r.nat!=null&&NAT[r.nat]?NAT[r.nat][0]:"—";
  const card=(k,t,r)=>'<button class="evcc" data-evc="'+k+'"><b>'+t+'</b><span>Nv'+((r.lv||{}).l||1)+' · '+nat(r)+(r.mote?' · «'+esc(r.mote)+'»':'')+'</span><small>'+esc(mv(r))+'</small></button>';
  const M=document.createElement("div");M.id="evcM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  M.innerHTML='<div class="jbox"><h3>🧬 Ya tenías un '+esc(b)+'</h3><p>Solo puedes tener un registro de cada especie. ¿Con cuál te quedas? El otro se suma como copia.</p><div class="evcg">'+
    card("old",esc(b)+" que ya tenías",ro)+card("new",esc(b)+" recién evolucionado (antes "+esc(a)+")",rn)+'</div></div>';
  document.body.appendChild(M);
  M.addEventListener("click",e=>{const c=e.target.closest("[data-evc]");if(!c)return;const keep=c.dataset.evc==="new"?rn:ro,drop=c.dataset.evc==="new"?ro:rn;
    if(drop.held&&drop.held!==keep.held){S.bag[drop.held]=(S.bag[drop.held]||0)+1}
    evoPut(b,keep);save();M.remove();snd("ui");toast("✅ Te quedas con "+b+" Nv"+((keep.lv||{}).l||1)+".");try{render();updTeam()}catch(x){}})}

// ================= recordador de movimientos y movimientos huevo =================
// Desde la ficha: recuerda movimientos de nivel (también los de sus formas anteriores) y aprende movimientos huevo.
const EGG=__EGG__;
const PREVO={};Object.keys(GD.EV).forEach(a=>GD.EV[a].forEach(e=>{if(!PREVO[e[0]])PREVO[e[0]]=a}));
const prevos=n=>{const o=[];let x=PREVO[n],k=0;while(x&&k++<4){o.push(x);x=PREVO[x]}return o};
const REM_COST={lv:5000,egg:25000};
function remList(n){const l=lvd(n).l,known=moveIds(n),out=new Map();
  [n].concat(prevos(n)).forEach(sp=>learn(sp).forEach(x=>{if(x[0]<=l&&!known.includes(x[1])&&MVD[x[1]]&&!out.has(x[1]))out.set(x[1],"lv")}));
  [n].concat(prevos(n)).forEach(sp=>(EGG[sp]||[]).forEach(id=>{if(!known.includes(id)&&MVD[id]&&!out.has(id))out.set(id,"egg")}));
  return [...out].map(([id,k])=>({id:id,k:k,m:MVD[id]})).sort((a,b)=>(a.k===b.k?0:a.k==="lv"?-1:1)||a.m.t.localeCompare(b.m.t)||(b.m.pw||0)-(a.m.pw||0))}
function remOpen(n){const L=remList(n);let M=$("remM");if(M)M.remove();M=document.createElement("div");M.id="remM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  const row=x=>{const c=Math.round(REM_COST[x.k]);return '<button class="remb" data-rem="'+x.id+'" data-rk="'+x.k+'" style="--tc:'+(TC[x.m.t]||"#999")+'"'+(S.t<c?' disabled':'')+'><b>'+esc(x.m.n)+'</b><small>'+EM[x.m.t]+' '+TIPO[x.m.t]+(x.m.cl?' · Poder '+(x.m.pw||"—"):' · Estado')+' · '+(x.k==="egg"?'🥚 Huevo':'📘 Nivel')+'</small><em>🎟️ '+fmt(c)+'</em></button>'};
  M.innerHTML='<div class="jbox"><div class="remh"><h3>🧠 Recordador de movimientos</h3><button class="alt" data-remx="1">✕</button></div><p class="mut">'+esc(nk(n))+' puede recordar los movimientos que ya podría saber por su nivel (también los de sus formas anteriores) y aprender sus <b>movimientos huevo</b>.</p>'+
    (L.length?'<div class="remg">'+L.map(row).join("")+'</div>':'<small class="mut">No hay movimientos que recordar ahora mismo.</small>')+'</div>';
  document.body.appendChild(M);
  M.addEventListener("click",async e=>{if(e.target===M||e.target.closest("[data-remx]")){M.remove();return}const b=e.target.closest("[data-rem]");if(!b||b.disabled)return;
    if(fcd){toast("Termina el combate primero.");return}const id=b.dataset.rem,c=Math.round(REM_COST[b.dataset.rk]),mv=MVD[id];if(S.t<c)return;
    const ids=moveIds(n).slice();let k=-1;if(ids.length>=4){M.hidden=true;k=await lrnAsk(n,mv,ids);M.hidden=false;if(k<0){toast(nk(n)+" no ha aprendido "+mv.n+".");return}}
    S.t-=c;if(k<0)ids.push(id);else{const old=ids[k];ids[k]=id;if(S.pp&&S.pp[n])delete S.pp[n][old]}S.mv[n]=ids;save();snd("lvl");toast("🧠 ¡"+nk(n)+" ha aprendido "+mv.n+"!");
    M.remove();render();try{fichaRefresh(n)}catch(x){}})}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-remo]");if(!b)return;snd("ui");remOpen(b.dataset.remo)});
{const _fm=fmovHTML;fmovHTML=function(n){const h=_fm(n);if(!h||isMegaF(n))return h;const k=remList(n).length;return h.replace(/<\/div>$/,'<button type="button" class="alt mini remopen" data-remo="'+esc(n)+'">🧠 Recordar movimientos'+(k?' ('+k+')':'')+'</button></div>')}}
// ================= ventanas que salen al terminar un combate (Salón de la Fama, evolución, premio gordo…) =================
// en modo «Ventana» o «Pantalla completa» quedaban ocultas detrás del combate: se sale de ese modo antes de mostrarlas
function bigFree(){try{if(typeof bigMode!=="undefined"&&bigMode)bigSet("")}catch(e){}}
{const _nm=nxModal;nxModal=function(){bigFree();return _nm.apply(this,arguments)}}
const BIG_OV=["nxM","evo","jack","jlv","lrnM","evcM"];
setInterval(()=>{BIG_OV.forEach(id=>{const el=$(id);if(!el||el._bw)return;el._bw=1;new MutationObserver(()=>{if(!el.hidden)bigFree()}).observe(el,{attributes:true,attributeFilter:["hidden"]});if(!el.hidden)bigFree()})},500);
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&BIG_OV.includes(n.id)&&!n.hidden)bigFree()}))).observe(document.body,{childList:true});

// ================= sugerencias (administrador): en tiempo real y el estado se guarda al cambiarlo =================
let SUGW=null,SUGC=null,SUGP=false;
function sugRefresh(){const a=document.activeElement;if(a&&a.closest&&a.closest("#sugList")&&/TEXTAREA|INPUT|SELECT/.test(a.tagName)){SUGP=true;return}SUGP=false;try{sugLoad()}catch(e){}}
function sugWatchStart(){if(SUGW||!window.sugWatch||!(typeof MOD!=="undefined"&&MOD.admin))return;
  if(!window._sugL0){window._sugL0=window.sugList;window.sugList=async()=>SUGC||window._sugL0()}
  SUGW=window.sugWatch(l=>{if(l===null){SUGC=null;return}SUGC=l;sugRefresh()})||null}
setInterval(sugWatchStart,2000);
document.addEventListener("focusout",e=>{if(SUGP&&e.target.closest&&e.target.closest("#sugList"))setTimeout(()=>{if(SUGP)sugRefresh()},200)});
// cambiar el estado lo guarda al momento (la respuesta se sigue guardando con su botón)
document.addEventListener("change",async e=>{const sel=e.target.closest&&e.target.closest("#sugList [data-sst]");if(!sel||!window.sugUpd)return;const w=sel.closest("[data-sid]");
  try{await window.sugUpd(w.dataset.sid,{st:sel.value});toast("💾 Estado guardado: "+SUGST[sel.value][0]+" "+SUGST[sel.value][1])}catch(x){toast("No se ha podido guardar ("+((x&&x.code)||"error")+").")}
  sel.blur()});
// ================= MOVIMIENTOS Z Y POKÉMON DOMINANTES =================
const ZN={normal:"Carrera Arrolladora",fire:"Hecatombe Pírica",water:"Hidrovórtice Abisal",electric:"Gigavoltio Destructor",grass:"Megatón Floral",ice:"Glaciación Apocalíptica",fighting:"Ráfaga Demoledora",poison:"Diluvio Corrosivo",
  ground:"Barrena Telúrica",flying:"Picado Supersónico",psychic:"Disruptor Psíquico",bug:"Guadaña Sedosa",rock:"Aplastamiento Gaia",ghost:"Presa Espectral",dragon:"Dracoaliento Devastador",dark:"Agujero Negro Aniquilador",steel:"Embestida Metálica",fairy:"Arrumaco Sideral"};
const zPow=p=>{p=p||60;return p<=55?100:p<=65?120:p<=75?140:p<=85?160:p<=95?175:p<=100?180:p<=110?185:p<=125?190:p<=130?195:200};
function zMove(mv){if(!mv)return mv;return Object.assign({},mv,{id:"z:"+mv.id,n:ZN[mv.t]||"Movimiento Z",pw:mv.fixed||mv.flv||mv.half?150:zPow(mv.pw),ac:0,ailc:0,fl:0,ch:[],sc:0,hits:null,rec:0,drain:0,kami:0,rech:0,fixed:0,flv:0,half:0,z:1})}
Object.assign(HIMG,{z_normal:"normalium-z",z_fire:"firium-z",z_water:"waterium-z",z_electric:"electrium-z",z_grass:"grassium-z",z_ice:"icium-z",z_fighting:"fightinium-z",z_poison:"poisonium-z",z_ground:"groundium-z",z_flying:"flyinium-z",z_psychic:"psychium-z",z_bug:"buginium-z",z_rock:"rockium-z",z_ghost:"ghostium-z",z_dragon:"dragonium-z",z_dark:"darkinium-z",z_steel:"steelium-z",z_fairy:"fairium-z"});
// los cristales Z no se venden en la tienda
{const _bb=buildBag;buildBag=function(){_bb.apply(this,arguments);try{ITEMS.forEach((it,i)=>{if(/^zx?_/.test(it[0])||!(it[2]>0)){const e=$("bq"+i),b=$("bb"+i);const r=e&&e.closest(".row");if(r)r.hidden=true;if(b){b.onclick=null;b.disabled=true}}})}catch(e){}}}
try{ITEMS.forEach((it,i)=>{if(/^zx?_/.test(it[0])||!(it[2]>0)){const e=$("bq"+i),b=$("bb"+i);const r=e&&e.closest(".row");if(r)r.hidden=true;if(b){b.onclick=null;b.disabled=true}}})}catch(e){}
// botón «Movimiento Z» en combate (una vez por combate)
function zOpts(){if(!B||B.mode!=="s"||B.zUsed||!B.E)return [];const m=beAct(B.E.sd[0]);if(!m||m.mh<=0||!/^z_/.test(m.it||""))return [];const t=m.it.slice(2);
  return m.m.map((mv,k)=>({mv:mv,k:k})).filter(o=>o.mv&&o.mv.cl>0&&o.mv.t===t&&m.pp[o.k]>0)}
{const _sm=setMenu;setMenu=function(v){_sm.apply(this,arguments);try{if(v===true&&zOpts().length){const mn=$("menu");if(mn&&!mn.querySelector('[data-k="zmenu"]'))mn.insertAdjacentHTML("beforeend",'<button data-k="zmenu" class="zbtn">💎 Movimiento Z</button>')}}catch(e){}}}
{const _t=turn;turn=async function(k){if(typeof k==="string"){
    if(k==="zmenu"){const L=zOpts();$("menu").innerHTML=L.map(o=>{const z=zMove(o.mv);return '<button class="mvb zmv" data-k="z'+o.k+'" style="--tc:'+(TC[o.mv.t]||"#999")+'">💎 '+esc(z.n)+'<small>desde '+esc(o.mv.n)+' · Poder '+z.pw+'</small></button>'}).join("")+'<button data-k="zback">Volver</button>';return}
    if(k==="zback"){setMenu(true);return}
    if(/^z\d$/.test(k)){if(!zOpts().some(o=>"z"+o.k===k))return;B.zUsed=1;return sTurn(k)}}
  return _t.apply(this,arguments)}}
// ---- Pokémon dominantes: uno por tipo, se puede retar a cada uno una vez al día; el primero de cada tipo da su cristal Z ----
const TOTEM={normal:"Gumshoos",fire:"Salazzle",water:"Araquanid",electric:"Togedemaru",grass:"Lurantis",ice:"Crabominable",fighting:"Hariyama",poison:"Toxapex",ground:"Mudsdale",flying:"Toucannon",psychic:"Oranguru",bug:"Vikavolt",rock:"Lycanroc",ghost:"Mimikyu",dragon:"Kommo-o",dark:"Absol",steel:"Scizor",fairy:"Ribombee"};
const totSp=t=>{let n=TOTEM[t];if(PM[n])return PM[n];return P.filter(p=>tys(p).includes(t)&&p[2]!=="L"&&p[2]!=="M"&&!isMegaF(p[0])).sort((a,b)=>WW[b[2]]-WW[a[2]])[0]};
const totSt=()=>{S.tot=S.tot||{d:"",w:{},z:{}};if(S.tot.d!==today()){S.tot.d=today();S.tot.w={}}return S.tot};
const totLv=()=>clampL(Math.min(lvCap(),Math.max(10,leadLevel()))+3);
nxPanel("totP","🌟 Pokémon dominantes","Pokémon especialmente poderosos rodeados de un aura que aumenta sus características. Véncelos para conseguir el cristal Z de su tipo.");
{const g=HUB.find(x=>x.k==="adv");if(g&&!g.tabs.some(t=>t[0]==="totP"))g.tabs.push(["totP","Dominantes"]);HUBP.totP="adv";HUBR.totP=()=>totUI()}
function totUI(){const b=$("totPB");if(!b)return;const st=totSt();
  if(!st.gift){st.gift=1;S.bag.z_normal=(S.bag.z_normal|0)+1;save();toast("🎁 ¡Regalo: Normastal Z! Equípaselo a un Pokémon que sepa un ataque de tipo Normal.")}
  const L=leadLevel(),zl=Object.keys(ZN);
  b.innerHTML='<p class="mut">💎 <b>Movimientos Z</b>: equipa un cristal Z (desde la ficha o la Mochila) a un Pokémon que sepa un ataque de ese tipo. En combate aparecerá el botón «💎 Movimiento Z»: un ataque muchísimo más fuerte que no falla (una vez por combate).</p>'+
    '<div class="totg">'+zl.map(t=>{const p0=totSp(t);if(!p0)return "";const p=stageFor(p0,totLv());const won=!!(st.z&&st.z[t]),done=!!st.w[t],zi="z_"+t,it=ITEMS.find(x=>x[0]===zi);
      return '<div class="totc" style="--tc:'+(TC[t]||"#999")+'"><span class="totsp">'+ico(p,64)+'</span><div><b>'+esc(p[0])+' dominante</b><small>'+EM[t]+' '+TIPO[t]+' · Nv'+totLv()+'</small><small>'+(won?'✅ '+esc(it?it[1]:"Cristal")+' conseguido':'🎁 Premio: '+esc(it?it[1]:"Cristal Z"))+' · tienes ×'+(S.bag[zi]|0)+'</small></div><button data-tot="'+t+'"'+(done||fcd?' disabled':'')+'>'+(done?'✔️ Mañana':'⚔️ Retar')+'</button></div>'}).join("")+'</div>'}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-tot]");if(!b)return;const t=b.dataset.tot,p=totSp(t);if(!p||fcd)return;
  if(!(S.team||[]).some(n=>n&&S.owned[n]&&S.hp[n]!==0)){toast("Necesitas un equipo con al menos un Pokémon con PS.");return}
  const L=totLv();startBattle({eteam:[mkEnemy(stageFor(p,L),L)],trainer:null,totem:t})});
{const _ab=afterBattle;afterBattle=async function(res){await _ab(res);try{if(B&&B.totem){const t=B.totem,st=totSt();st.w[t]=1;
  if(res==="win"){if(!st.z[t]){st.z[t]=1;S.bag["z_"+t]=(S.bag["z_"+t]|0)+1;const it=ITEMS.find(x=>x[0]==="z_"+t);snd("lvl");await say("💎 ¡Has conseguido "+(it?it[1]:"un cristal Z")+"!")}
    else{const rw={t:150000,it:{cand:1}};grant(rw);await say("🎁 ¡El Pokémon dominante te deja "+rwTxt(rw)+"!")}}
  save()}}catch(e){console.error(e)}}}
// ================= MOVIMIENTOS Z EXCLUSIVOS =================
// clave: [especies, ataque necesario, nombre del movimiento Z, poder, efecto extra, tipo]
const ZX={incin:[["Incineroar"],"Lariat Oscuro","Hiperplancha Oscura",180,"","dark"],decid:[["Decidueye"],"Puntada Sombría","Aluvión de Flechas Sombrías",180,"","ghost"],
 prima:[["Primarina"],"Aria Burbuja","Sinfonía de la Diva Marina",195,"","water"],pika:[["Pikachu"],"Rayo","Pikavoltio Letal",195,"crit","electric"],raichu:[["Raichu de Alola"],"Rayo","Surfeo Galvánico",175,"par","electric"],
 snor:[["Snorlax"],"Gigaimpacto","Arrojo Intempestivo",210,"","normal"],mimi:[["Mimikyu"],"Carantoña","Somanta Amistosa",190,"","fairy"],lycan:[["Lycanroc","Lycanroc Forma Nocturna","Lycanroc Forma Crepuscular"],"Roca Afilada","Tempestad Rocosa",190,"clrTr","rock"],
 kommo:[["Kommo-o"],"Fragor Escamas","Estruendo Implacable",185,"allup","dragon"],solga:[["Solgaleo","Necrozma Melena Crepuscular"],"Meteoimpacto","Embestida Solar",200,"","steel"],
 luna:[["Lunala","Necrozma Alas del Alba"],"Rayo Umbrío","Deflagración Lunar",200,"","ghost"],marsha:[["Marshadow"],"Robasombra","Constelación Robaalmas",195,"steal","ghost"],
 tapu:[["Tapu Koko","Tapu Lele","Tapu Bulu","Tapu Fini"],"Furia Natural","Cólera del Guardián",0,"pct","fairy"],mew:[["Mew"],"Psíquico","Supernova Original",185,"terr","psychic"],
 unec:[["Ultra-Necrozma"],"Géiser Fotónico","Fotodestrucción Apocalíptica",200,"","psychic"]};
Object.assign(HIMG,{zx_incin:"incinium-z",zx_decid:"decidium-z",zx_prima:"primarium-z",zx_pika:"pikashunium-z",zx_raichu:"aloraichium-z",zx_snor:"snorlium-z",zx_mimi:"mimikium-z",zx_lycan:"lycanium-z",zx_kommo:"kommonium-z",zx_solga:"solganium-z",zx_luna:"lunalium-z",zx_marsha:"marshadium-z",zx_tapu:"tapunium-z",zx_mew:"mewnium-z",zx_unec:"ultranecrozium-z"});
function zxById(k){const z=ZX[k];if(!z)return null;const b=MVX.find(m=>m.n===z[1])||{t:z[5],cl:2,pw:90,pp:5,pr:0,fx:"",ch:[]};
  return Object.assign({},b,{id:"zx:"+k,n:z[2],t:z[5],pw:z[4]==="pct"?0:z[3],pct:z[4]==="pct"?75:0,ac:0,ailc:0,fl:0,ch:[],sc:0,hits:null,rec:0,drain:0,kami:0,rech:0,fixed:0,flv:0,half:0,crit:z[4]==="crit"?1:0,z:1,zxe:z[4]||""})}
function zxMove(me,mv){const k=String(me.it||"").replace(/^zx_/,"");return zxById(k)||zMove(mv)}
function zxEffect(E,i,tg,me,tm,mv,push,rng){axSafe(()=>{const x=mv.zxe;
  if(x==="par"&&tm.mh>0)beAil(E,tg,"par",push,rng,false,i);
  else if(x==="allup")beStat(E,i,[["atk",1],["def",1],["spa",1],["spd",1],["spe",1]],push);
  else if(x==="terr")axTrSet(E,"psychic",5,push);
  else if(x==="clrTr"&&E.tr){E.tr=null;push({k:"msg",t:"¡El campo ha desaparecido!"})}
  else if(x==="steal"){const fv=E.sd[tg].v.st,up=Object.keys(fv).filter(s=>fv[s]>0).map(s=>[s,fv[s]]);if(up.length){up.forEach(q=>{fv[q[0]]=0});axSay(push,i,me,"¡{w} ha robado las mejoras de {o}!",{i:tg,m:tm});beStat(E,i,up,push)}}})}
const zxFor=m=>{const k=String(m.it||"").replace(/^zx_/,""),z=ZX[k];if(!z)return null;const sp=[m.p[0],(m.p0||[])[0]];return z[0].some(n=>sp.includes(n))?z:null};
{const _zo=zOpts;zOpts=function(){if(B&&B.mode==="s"&&!B.zUsed&&B.E){const m=beAct(B.E.sd[0]);if(m&&m.mh>0&&/^zx_/.test(m.it||"")){const z=zxFor(m);if(!z)return [];
  return m.m.map((mv,k)=>({mv:mv,k:k,x:1})).filter(o=>o.mv&&o.mv.n===z[1]&&m.pp[o.k]>0)}}return _zo()}}
{const _t=turn;turn=async function(k){if(k==="zmenu"){const L=zOpts();if(L.length&&L[0].x){const m=beAct(B.E.sd[0]),z=zxMove(m,L[0].mv);
    $("menu").innerHTML=L.map(o=>'<button class="mvb zmv" data-k="x'+o.k+'" style="--tc:'+(TC[z.t]||"#999")+'">💎 '+esc(z.n)+'<small>desde '+esc(o.mv.n)+(z.pct?' · quita el 75% de sus PS':' · Poder '+z.pw)+'</small></button>').join("")+'<button data-k="zback">Volver</button>';return}}
  if(typeof k==="string"&&/^x\d$/.test(k)){if(!zOpts().some(o=>"x"+o.k===k))return;B.zUsed=1;return sTurn(k)}
  return _t.apply(this,arguments)}}
// cómo se consiguen: prueba exclusiva contra el Pokémon dominante de esa especie (si lo tienes en tu colección)
const zxOwnSp=k=>ZX[k][0].find(n=>S.owned[n]>0||(n==="Ultra-Necrozma"&&S.owned["Necrozma"]>0));
{const _tu=totUI;totUI=function(){_tu.apply(this,arguments);try{const b=$("totPB");if(!b)return;const st=totSt();
  const L=Object.keys(ZX).filter(k=>zxOwnSp(k));
  b.insertAdjacentHTML("beforeend",'<h3 class="zxh">💎 Cristales Z exclusivos</h3><p class="mut">Cada uno desbloquea el movimiento Z propio de un Pokémon (por ejemplo, Hiperplancha Oscura de Incineroar con Lariat Oscuro). Aparece la prueba de los Pokémon que tienes en tu colección.</p>'+
    (L.length?'<div class="totg">'+L.map(k=>{const z=ZX[k],sp=zxOwnSp(k),p0=PM[sp==="Ultra-Necrozma"?"Necrozma":sp]||PM[z[0][0]],p=p0?stageFor(p0,totLv()):null,won=!!(st.z&&st.z["x:"+k]),done=!!st.w["x:"+k],it=ITEMS.find(x=>x[0]==="zx_"+k);if(!p)return "";
      return '<div class="totc" style="--tc:'+(TC[z[5]]||"#999")+'"><span class="totsp">'+ico(p,64)+'</span><div><b>'+esc(it?it[1]:k)+'</b><small>'+esc(z[2])+' · necesita '+esc(z[1])+'</small><small>'+(won?'✅ Conseguido':'⚔️ Vence a '+esc(p[0])+' dominante')+' · tienes ×'+(S.bag["zx_"+k]|0)+'</small></div><button data-totx="'+k+'"'+(done||fcd?' disabled':'')+'>'+(done?'✔️ Mañana':'⚔️ Retar')+'</button></div>'}).join("")+'</div>':'<small class="mut">Consigue a Incineroar, Decidueye, Primarina, Pikachu, Raichu de Alola, Snorlax, Mimikyu, Lycanroc, Kommo-o, Solgaleo, Lunala, Marshadow, un Tapu, Mew o Necrozma para desbloquear su prueba.</small>'))}catch(e){console.error(e)}}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-totx]");if(!b||fcd)return;const k=b.dataset.totx,z=ZX[k];if(!z)return;const sp=zxOwnSp(k),p0=PM[sp==="Ultra-Necrozma"?"Necrozma":sp]||PM[z[0][0]];if(!p0)return;
  if(!(S.team||[]).some(n=>n&&S.owned[n]&&S.hp[n]!==0)){toast("Necesitas un equipo con al menos un Pokémon con PS.");return}
  const L=totLv();startBattle({eteam:[mkEnemy(stageFor(p0,L),L)],trainer:null,totem:"x:"+k})});
{const _ab=afterBattle;afterBattle=async function(res){
  const t=B&&B.totem;if(t&&String(t).startsWith("x:")){const k=t.slice(2),st=totSt();B.totem=null;try{await _ab(res)}finally{if(B)B.totem=t}
    st.w[t]=1;if(res==="win"){if(!st.z[t]){st.z[t]=1;S.bag["zx_"+k]=(S.bag["zx_"+k]|0)+1;const it=ITEMS.find(x=>x[0]==="zx_"+k);snd("lvl");await say("💎 ¡Has conseguido "+(it?it[1]:"un cristal Z exclusivo")+"!")}else{const rw={t:150000,it:{cand:1}};grant(rw);await say("🎁 ¡El Pokémon dominante te deja "+rwTxt(rw)+"!")}}save();return}
  return _ab(res)}}
// ================= MENTAS: cambiar la naturaleza =================
{const _uu=useUI;useUI=function(msg){_uu.apply(this,arguments);try{const it=ITEMS.find(i=>i[0]===useId);if(!it||it[7]!=="mint"||!(S.bag[useId]>0))return;const q=$("buse"),ni=+useId.slice(4);
  const L=P.filter(p=>S.owned[p[0]]>0&&!isMegaF(p[0])&&!(typeof isSup==="function"&&isSup(p[0]))).sort((a,b)=>((S.team.includes(b[0])?1:0)-(S.team.includes(a[0])?1:0))||(lvd(b[0]).l-lvd(a[0]).l)).slice(0,200);
  q.innerHTML='<div class="buse-h"><span class="iico">'+itemIco(useId,40)+'</span><b>'+it[1]+' ×'+S.bag[useId]+'</b><button class="alt" id="buClose">✕ Cerrar</button></div><small class="mut">Nueva naturaleza: <b>'+NAT[ni][0]+'</b> ('+natTxt(ni)+')</small>'+
    '<div class="bul">'+L.map(p=>{const n=p[0],cur=natOf(n);return '<button class="bunit" data-mint="'+esc(n)+'"'+(cur===ni?' disabled':'')+'>'+ico(p,30)+'<span><b>'+esc(nk(n))+(S.team.includes(n)?' ⭐':'')+'</b> <small>Nv'+lvd(n).l+' · ahora '+NAT[cur][0]+(cur===ni?' (ya la tiene)':'')+'</small></span></button>'}).join("")+'</div><small id="buMsg" class="mut">'+(msg||"")+'</small>'}catch(e){console.error(e)}}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-mint]");if(!b||!useId||!/^mint\d+$/.test(useId))return;if(fcd){toast("Termina el combate primero.");return}
  const n=b.dataset.mint,ni=+useId.slice(4);if(!(S.bag[useId]>0)||!S.owned[n])return;S.nat=S.nat||{};S.nat[n]=ni;S.bag[useId]--;save();snd("lvl");render();useUI("🌿 "+nk(n)+" ahora tiene naturaleza "+NAT[ni][0]+".")});
Object.keys(NAT).forEach(i=>{const N=NAT[i];HIMG["mint"+i]=N[1]==="atk"?"adamant-mint":N[1]==="def"?"bold-mint":N[1]==="spa"?"modest-mint":N[1]==="spd"?"calm-mint":N[1]==="spe"?"jolly-mint":"serious-mint"});
// ================= corrección puntual: Guantes de entrenador =================
// las partidas que llegaron al nivel 30 o más por un fallo (imposible jugando normal) pasan al nivel 8, una sola vez
setInterval(()=>{try{if(!S||S.glFix8||fcd)return;if((S.cl|0)>=30){S.cl=8;window._fk=null}S.glFix8=1;save();render()}catch(e){}},3000);
// ================= MODERACIÓN: corregir la partida de un jugador =================
// El administrador fija desde el perfil del jugador un máximo de tickets y de niveles de la tienda de mejoras;
// se aplica (una sola vez) la próxima vez que ese jugador entra en el juego.
{const _rd=window.rankData;if(_rd)window.rankData=function(){const d=_rd();if(!d)return d;d.eco={t:Math.floor(S.t||0),cl:S.cl|0,g:(S.g||[]).map(x=>x|0)};return d}}
{const _op=openProf;openProf=async function(uid,dIn,tgt){const r=await _op.apply(this,arguments);try{
  const me=window.FB&&window.FB.uid?window.FB.uid():null;if(!(typeof MOD!=="undefined"&&MOD.admin)||!uid||uid===me||!window.FB||!window.FB.fixSet)return r;
  const box=tgt||$("profB");if(!box||box.querySelector(".fixbox"))return r;let d=dIn;if(!d)try{d=await window.FB.rankGet(uid)}catch(e){}
  const eco=(d&&d.eco)||null,nm=pvClean((d&&d.n)||"Jugador");
  const row=(lab,id,cur)=>'<label><span>'+lab+'</span><input type="number" min="0" id="'+id+'" placeholder="sin cambios"><small>ahora: '+(cur==null?'?':fmt(cur))+'</small></label>';
  box.insertAdjacentHTML("beforeend",'<div class="fixbox"><button class="alt" data-fixo="1">🛠️ Corregir partida (moderación)</button><div class="fixf" hidden>'+
    '<p class="mut">Pon un <b>máximo</b> en lo que quieras corregir (si ya tiene menos, no se toca). Se aplicará la próxima vez que <b>'+esc(nm)+'</b> entre en el juego. Datos de su última partida guardada'+(eco?'':' (todavía no disponibles: aparecerán cuando vuelva a guardar)')+'.</p>'+
    row("🎟️ Tickets","fxT",eco&&eco.t)+row("🥊 Guantes de entrenador","fxCl",eco&&eco.cl)+G.map((g,i)=>row(GI[i]+" "+g[0],"fxG"+i,eco&&eco.g?eco.g[i]:null)).join("")+
    '<label class="fxm"><span>Mensaje para el jugador</span><textarea id="fxM" rows="2" maxlength="300">Tu partida se ha corregido por un fallo de los Guantes de entrenador.</textarea></label>'+
    '<div class="jrow"><button class="red" data-fixgo="'+esc(uid)+'" data-fixn="'+esc(nm)+'">💾 Aplicar corrección</button></div></div></div>')}catch(e){console.error(e)}return r}}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest)return;
  const o=t.closest("[data-fixo]");if(o){const f=o.parentNode.querySelector(".fixf");f.hidden=!f.hidden;return}
  const b=t.closest("[data-fixgo]");if(!b||!(typeof MOD!=="undefined"&&MOD.admin))return;
  const num=id=>{const v=($(id)||{}).value;return v===""||v==null?null:Math.max(0,Math.floor(+v))};
  const fx={t:num("fxT"),cl:num("fxCl"),g:G.map((g,i)=>num("fxG"+i)),msg:String(($("fxM")||{}).value||"").slice(0,300),at:Date.now(),n:b.dataset.fixn};
  if(fx.t==null&&fx.cl==null&&fx.g.every(x=>x==null)){toast("Pon al menos un máximo.");return}
  if(!await askOk("¿Aplicar esta corrección a "+b.dataset.fixn+"? Se aplicará la próxima vez que entre."))return;
  b.disabled=true;try{await window.FB.fixSet(b.dataset.fixgo,fx);toast("🛠️ Corrección guardada para "+b.dataset.fixn+". Se aplicará cuando entre.")}catch(x){toast("No se ha podido guardar ("+((x&&x.code)||"error")+"). ¿Has añadido la regla «fixes» en Firebase?");b.disabled=false}});
// el jugador: al entrar comprueba si tiene una corrección pendiente (1 lectura por sesión)
let _fixChk=0;
async function fixCheck(){if(_fixChk||!window.FB||!window.FB.fixGet||!window.FB.uid||!window.FB.uid())return;_fixChk=1;let fx=null;try{fx=await window.FB.fixGet()}catch(e){return}
  if(!fx||!(fx.at>(S.fixAt||0)))return;
  const ch=[];if(fx.t!=null&&S.t>fx.t){ch.push("🎟️ Tickets: "+fmt(S.t)+" → "+fmt(fx.t));S.t=fx.t}
  if(fx.cl!=null&&(S.cl|0)>fx.cl){ch.push("🥊 Guantes: Nv"+S.cl+" → Nv"+fx.cl);S.cl=fx.cl;window._fk=null}
  (fx.g||[]).forEach((v,i)=>{if(v!=null&&G[i]&&(S.g[i]|0)>v){ch.push(GI[i]+" "+G[i][0]+": "+fmt(S.g[i])+" → "+fmt(v));S.g[i]=v}});window._gk=null;
  S.fixAt=fx.at;save();try{if(window.cloudFlush)window.cloudFlush(true)}catch(e){}try{await window.FB.fixDel()}catch(e){}render();
  nxModal('<div class="hofb">🛠️</div><h3>Tu partida se ha corregido</h3><p>'+esc(fx.msg||"El equipo del juego ha corregido tu partida.")+'</p>'+(ch.length?'<ul class="fixl">'+ch.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>':'<p class="mut">No ha hecho falta cambiar nada.</p>')+'<button id="fixOk">Entendido</button>');$("fixOk").onclick=nxModalClose}
setInterval(()=>{try{fixCheck()}catch(e){}},4000);
// ================= cristales Z: icono oficial de la mochila (repositorio pokesprite) =================
function zImgErr(el){if(!el.dataset.r){el.dataset.r=1;el.src=el.src.replace("https://cdn.jsdelivr.net/gh/msikma/pokesprite@master/","https://raw.githubusercontent.com/msikma/pokesprite/master/");return}const s=document.createElement("span");s.textContent="💎";s.style.fontSize=Math.round((+el.dataset.s||32)*.6)+"px";el.replaceWith(s)}
{const _ii=itemIco;itemIco=function(id,s,noImg){if(/^zx?_/.test(String(id))&&HIMG[id]&&!noImg)return '<img class="pk item zitem" src="https://cdn.jsdelivr.net/gh/msikma/pokesprite@master/items/z-crystals/'+HIMG[id]+'--bag.png" width="'+s+'" height="'+s+'" alt="" loading="lazy" data-s="'+s+'" onerror="zImgErr(this)">';return _ii.apply(this,arguments)}}

// Ayuda de tipos: debilidades reales con los dos tipos del Pokémon (×4, ×2, ×½, ×¼, ×0)
helpHTML=function(){const keys=Object.keys(TIPO);
  const grp=(p,ab)=>{const g={4:[],2:[],.5:[],.25:[],0:[]};keys.forEach(a=>{let e=effP(a,p);if(ab&&((a==="ground"&&(ab===26||ab===297))||(a==="water"&&[11,87,114].includes(ab))||(a==="electric"&&[10,31,78].includes(ab))||(a==="fire"&&[18,273].includes(ab))||(a==="grass"&&ab===157)))e=0;if(e in g)g[e].push(a)});return g};
  const line=(t,l)=>l.length?'<div>'+t+': '+l.map(typeChip).join("")+'</div>':'';
  const prow=(label,m)=>{if(!m||!m.p)return "";const g=grp(m.p,m.ab),an=m.ab&&typeof abName==="function"&&abName(m.ab);return '<div class="hlprow"><b>'+label+' '+esc(m.p[0])+' '+tys(m.p).map(typeChip).join("")+'</b>'+line("Muy débil a (×4)",g[4])+line("Débil a (×2)",g[2])+line("Resiste (×½)",g[.5])+line("Resiste mucho (×¼)",g[.25])+line("No le afecta (×0)",g[0])+(g[0].length&&m.ab&&[26,297,11,87,114,10,31,78,18,273,157].includes(m.ab)?'<small class="mut">Incluye la inmunidad de su habilidad'+(an?' ('+esc(an)+')':'')+'</small>':'')+'</div>'};
  const trow=t=>{const g=grp([" ",t]);return '<div class="hlprow"><b>'+typeChip(t)+'</b>'+line("Débil a (×2)",g[2])+line("Resiste (×½)",g[.5])+line("No le afecta (×0)",g[0])+'</div>'};
  let h='<button id="hlpx" aria-label="Cerrar ayuda" style="float:right;padding:2px 10px">✕</button><h4>Ventajas de tipo</h4><small style="color:var(--mute)">Tabla oficial: ×2 contra un tipo débil, ×½ si lo resiste y ×0 si es inmune. Con dos tipos se multiplican (×4, ×¼…).</small>';
  try{if(typeof B!=="undefined"&&B&&B.E&&B.E.sd){const sd=B.E.sd,me=[],op=[];sd.forEach((x,i)=>{const m=beAct(x);if(!m||m.mh<=0)return;(beTeamOf(B.E,i)===beTeamOf(B.E,0)?me:op).push(m)});
    if(me.length||op.length)h+='<h5>Este combate</h5>'+op.map(m=>prow("Rival:",m)).join("")+me.map(m=>prow("Tu",m)).join("")}
   else if(typeof B!=="undefined"&&B&&B.op&&B.me)h+='<h5>Este combate</h5>'+prow("Rival:",{p:B.op})+prow("Tu",{p:B.me})}catch(e){}
  return h+'<h5>Todos los tipos</h5>'+keys.map(trow).join("")};

// ================= sets de cada Pokémon: naturaleza, objeto, habilidad y movimientos intercambiables =================
// S.bld[n]={a:set activo,l:[{nm,nat,held,abil,mv,ppu}]}. El set activo vive en S.nat/S.held/S.abil/S.mv/S.ppu (lo que usa el resto del juego).
const BLDMAX=4;
const bldCp=o=>o==null?o:JSON.parse(JSON.stringify(o));
const bldSnap=n=>({nat:natOf(n),held:heldOf(n),abil:S.abil&&S.abil[n]!=null?S.abil[n]:null,mv:moveIds(n).slice(),ppu:bldCp(S.ppu&&S.ppu[n])||null});
function bldGet(n){S.bld=S.bld||{};let b=S.bld[n];if(!b||!Array.isArray(b.l)||!b.l.length){b=S.bld[n]={a:0,l:[Object.assign({nm:"Set 1"},bldSnap(n))]}}if(!(b.a>=0&&b.a<b.l.length))b.a=0;return b}
function bldStore(n){const b=bldGet(n),nm=b.l[b.a].nm;b.l[b.a]=Object.assign({nm:nm},bldSnap(n))}
function bldLoad(n,x){S.nat=S.nat||{};S.held=S.held||{};S.abil=S.abil||{};S.ppu=S.ppu||{};
  S.nat[n]=x.nat|0;if(x.held&&HOLDK[x.held])S.held[n]=x.held;else delete S.held[n];if(x.abil!=null)S.abil[n]=x.abil;else delete S.abil[n];
  S.mv[n]=(Array.isArray(x.mv)&&x.mv.length&&x.mv.every(id=>MVD[id]))?x.mv.slice():defMoves(n,lvd(n).l);if(x.ppu)S.ppu[n]=bldCp(x.ppu);else delete S.ppu[n];if(S.pp)delete S.pp[n]}
const bldBusy=()=>{if(typeof fcd!=="undefined"&&fcd){toast("Termina el combate antes de cambiar de set.");return true}return false};
function bldSwitch(n,k,quiet){const b=bldGet(n);if(!b.l[k]||k===b.a)return false;bldStore(n);b.a=k;bldLoad(n,b.l[k]);if(typeof _hbk!=="undefined")_hbk="";if(!quiet){save();snd("ui");toast("🔁 "+nk(n)+" usa ahora «"+b.l[k].nm+"»")}return true}
function bldNew(n,x,nm){const b=bldGet(n);if(b.l.length>=BLDMAX){toast("Máximo "+BLDMAX+" sets por Pokémon.");return -1}bldStore(n);
  let q=1;while(b.l.some(x=>x.nm==="Set "+q))q++;b.l.push(Object.assign({nm:nm||("Set "+q)},x||{nat:natOf(n),held:"",abil:null,mv:defMoves(n,lvd(n).l),ppu:null}));return b.l.length-1}
function bldDel(n,k){const b=bldGet(n);if(b.l.length<2||!b.l[k])return;if(k===b.a)bldSwitch(n,k===0?1:0,1);const x=b.l[k];if(x.held)S.bag[x.held]=(S.bag[x.held]||0)+1;b.l.splice(k,1);if(b.a>k)b.a--;if(b.l.length===1)b.l[0].nm=b.l[0].nm||"Set 1"}
function bldHTML(n){const b=bldGet(n),mvs=x=>(x.mv||[]).map(id=>MVD[id]?MVD[id].n:"").filter(Boolean).join(", ")||"—";
  return '<span>Sets</span><div class="bldw"><small class="mut">Cada set guarda su naturaleza, objeto, habilidad y movimientos. Cámbialo para usar este Pokémon de otra forma en otro equipo. Un set nuevo empieza con los movimientos básicos de su nivel: los demás tendrás que enseñárselos con MT o el recordador.</small><div class="bldl">'+
    b.l.map((x,i)=>{const on=i===b.a,X=on?bldSnap(n):x,it=X.held&&ITEMS.find(q=>q[0]===X.held);return '<div class="bldc'+(on?" on":"")+'"><b>'+esc(x.nm)+(on?' <i>✓ En uso</i>':'')+'</b><small>🌿 '+esc((NAT[X.nat|0]||NAT[0])[0])+' · ✨ '+esc(abName(X.abil!=null&&abValid(n,X.abil)?X.abil:(on?abOf(n):abDefault(PM[n]))))+(it?' · 🎒 '+esc(it[1]):'')+'</small><small>⚔️ '+esc(mvs(X))+'</small><div class="bldb">'+
      (on?'':'<button data-bldu="'+i+'">Usar</button>')+'<button class="alt" data-bldr="'+i+'">✏️</button>'+(b.l.length>1?'<button class="alt" data-bldd="'+i+'">🗑️</button>':'')+'</div></div>'}).join("")+
    (b.l.length<BLDMAX?'<button class="bldnew" data-bldn="1">＋ Nuevo set</button>':'')+'</div></div>'}
{const _pv=pkView;pkView=function(n,sh){_pv(n,sh);try{if(!(S.owned[n]>0)||isSup(n))return;const w=document.querySelector("#pkv .fich");if(!w)return;
  const d=document.createElement("div");d.className="fichr bldr";d.dataset.bn=n;d.dataset.bs=sh?1:0;d.innerHTML=bldHTML(n);const st=w.querySelector(".fstatr");if(st)st.before(d);else w.appendChild(d)}catch(e){console.error(e)}}}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest)return;const r=t.closest(".bldr");if(!r)return;const n=r.dataset.bn,sh=r.dataset.bs==="1",re=()=>{try{updTeam();render()}catch(x){}pkView(n,sh)};
  let q=t.closest("[data-bldu]");if(q){if(bldBusy())return;bldSwitch(n,+q.dataset.bldu);re();return}
  q=t.closest("[data-bldn]");if(q){if(bldBusy())return;const k=bldNew(n);if(k>=0){bldSwitch(n,k,1);save();snd("lvl");toast("🆕 Nuevo set para "+nk(n)+": ya está en uso.")}re();return}
  q=t.closest("[data-bldr]");if(q){const b=bldGet(n),x=b.l[+q.dataset.bldr];const nm=await askText("Nombre del set:",x.nm,{max:20});if(nm&&nm.trim()){x.nm=nm.trim().slice(0,20);save()}re();return}
  q=t.closest("[data-bldd]");if(q){if(bldBusy())return;const b=bldGet(n),x=b.l[+q.dataset.bldd];if(!await askOk("¿Eliminar el set «"+x.nm+"»? Su objeto vuelve a la Mochila."))return;bldDel(n,+q.dataset.bldd);save();snd("ui");re()}});
// los sets de equipo recuerdan qué set usa cada Pokémon
{const bmap=team=>{const o={};(team||[]).forEach(n=>{if(n&&S.bld&&S.bld[n]&&S.bld[n].l.length>1)o[n]=S.bld[n].a});return o};
  const wrapSave=id=>{const el=$(id);if(!el||!el.onclick)return;const _o=el.onclick;el.onclick=function(){const L0=(S.sets||[]).length,i=+$("setSel").value;_o.apply(this,arguments);try{const st=id==="setNew"?(S.sets.length>L0?S.sets[S.sets.length-1]:null):S.sets[i];if(st){st.bld=bmap(st.team);save()}}catch(x){}}};
  wrapSave("setNew");wrapSave("setUpd");
  const el=$("setLoad");if(el&&el.onclick){const _o=el.onclick;el.onclick=function(){const st=(S.sets||[])[+$("setSel").value];if(st&&st.bld&&Object.keys(st.bld).length&&bldBusy())return;_o.apply(this,arguments);
    try{if(st&&st.bld){let c=0;for(const n in st.bld)if(S.owned[n]>0&&S.bld&&S.bld[n]&&bldSwitch(n,st.bld[n]|0,1))c++;if(c){save();updTeam();setMsg("Equipo «"+st.name+"» cargado con los sets de cada Pokémon.")}}}catch(x){console.error(x)}}}}
// al evolucionar, los sets pasan a la evolución
{const _ea=evoApply;evoApply=function(a,b){const had=S.owned[b]>0&&S.lv&&S.lv[b],ba=S.bld&&S.bld[a];
  if(ba){try{bldStore(a)}catch(x){}}
  const r=_ea.apply(this,arguments);
  try{if(ba){const others=ba.l.filter((x,i)=>i!==ba.a);delete S.bld[a];
    if(!had&&others.length){const nb=bldGet(b);others.forEach(x=>{if(nb.l.length<BLDMAX)nb.l.push(x);else if(x.held)S.bag[x.held]=(S.bag[x.held]||0)+1})}
    else others.forEach(x=>{if(x.held)S.bag[x.held]=(S.bag[x.held]||0)+1});save()}}catch(x){console.error(x)}
  return r}}
// al elegir entre la versión antigua y la nueva, también puedes quedarte con las dos (la nueva como set)
{const _ec=evoChoose;evoChoose=function(a,b,rn,ro){_ec.apply(this,arguments);try{const M=$("evcM");if(!M)return;const g=M.querySelector(".evcg");const full=bldGet(b).l.length>=BLDMAX;
  g.insertAdjacentHTML("beforeend",'<button class="evcc evcb" data-evb="1"'+(full?' disabled':'')+'><b>🔁 Quedarme con los dos</b><span>El que ya tenías sigue en uso y el recién evolucionado se guarda como un set nuevo</span><small>'+(full?'Ya tiene '+BLDMAX+' sets: borra alguno desde la ficha':'Nivel: el más alto de los dos')+'</small></button>');
  M.addEventListener("click",e=>{const c=e.target.closest("[data-evb]");if(!c||c.disabled)return;e.stopImmediatePropagation();
    const lv=Math.max(((ro.lv||{}).l)||1,((rn.lv||{}).l)||1),L=[ro.lv,rn.lv].find(x=>x&&x.l===lv);evoPut(b,ro);S.lv[b]=Object.assign({},L||{l:lv,x:0});
    bldNew(b,{nat:rn.nat|0,held:rn.held||"",abil:null,mv:(rn.mv||[]).slice(),ppu:bldCp(rn.ppu)||null},"Evolucionado");save();M.remove();snd("lvl");toast("✅ Te quedas con los dos: el nuevo está en los sets de "+b+".");try{render();updTeam()}catch(x){}},true)}catch(x){console.error(x)}}}

// ================= compañero: animaciones reales de PMDCollab (caminar, quieto, dormir, saltar en 8 direcciones) =================
const PMDU="https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/",PMDC={};
const PMDF={"Mega Charizard X":"0006/0001","Mega Alakazam":"0065/0001","Mega Slowbro":"0080/0002","Mega Gengar":"0094/0001","Mega Kangaskhan":"0115/0001","Mega Aerodactyl":"0142/0001","Mega Mewtwo Y":"0150/0002","Mega Steelix":"0208/0001","Mega Houndoom":"0229/0001","Mega Tyranitar":"0248/0001","Mega Sceptile":"0254/0001","Mega Gardevoir":"0282/0001","Mega Sableye":"0302/0001","Mega Mawile":"0303/0001","Mega Medicham":"0308/0001","Mega Manectric":"0310/0001","Mega Sharpedo":"0319/0001","Mega Camerupt":"0323/0001","Mega Altaria":"0334/0001","Mega Banette":"0354/0001","Mega Absol":"0359/0001","Mega Glalie":"0362/0001","Mega Latias":"0380/0001","Mega Latios":"0381/0001","Mega Rayquaza":"0384/0001","Mega Lopunny":"0428/0001","Mega Lucario":"0448/0001","Mega Gallade":"0475/0001","Mega Diancie":"0719/0001","Primal Kyogre":"0382/0001","Primal Groudon":"0383/0001","Alolan Rattata":"0019/0001","Alolan Raticate":"0020/0001","Alolan Raichu":"0026/0001","Alolan Sandshrew":"0027/0001","Alolan Sandslash":"0028/0001","Alolan Vulpix":"0037/0001","Alolan Ninetales":"0038/0001","Alolan Diglett":"0050/0001","Alolan Dugtrio":"0051/0001","Alolan Meowth":"0052/0001","Alolan Persian":"0053/0001","Alolan Geodude":"0074/0001","Alolan Graveler":"0075/0001","Alolan Golem":"0076/0001","Alolan Grimer":"0088/0001","Alolan Muk":"0089/0001","Alolan Exeggutor":"0103/0001","Alolan Marowak":"0105/0001","Galarian Meowth":"0052/0002","Galarian Ponyta":"0077/0001","Galarian Rapidash":"0078/0001","Galarian Slowpoke":"0079/0001","Galarian Slowbro":"0080/0001","Galarian Slowking":"0199/0001","Galarian Weezing":"0110/0001","Galarian Articuno":"0144/0001","Galarian Zapdos":"0145/0001","Galarian Moltres":"0146/0001","Galarian Corsola":"0222/0001","Galarian Zigzagoon":"0263/0001","Galarian Linoone":"0264/0001","Galarian Darumaka":"0554/0001","Galarian Yamask":"0562/0001","Hisuian Growlithe":"0058/0001","Hisuian Arcanine":"0059/0001","Hisuian Voltorb":"0100/0001","Hisuian Electrode":"0101/0001","Hisuian Typhlosion":"0157/0001","Hisuian Qwilfish":"0211/0001","Hisuian Sneasel":"0215/0001","Hisuian Samurott":"0503/0001","Hisuian Lilligant":"0549/0001","Hisuian Zorua":"0570/0001","Hisuian Zoroark":"0571/0001","Hisuian Braviary":"0628/0001","Hisuian Sliggoo":"0705/0001","Hisuian Goodra":"0706/0001","Hisuian Avalugg":"0713/0001","Hisuian Decidueye":"0724/0001","Paldean Wooper":"0194/0002","Deoxys Attack Forme":"0386/0001","Deoxys Defense Forme":"0386/0002","Deoxys Speed Forme":"0386/0003","Wormadam Trash Cloak":"0413/0002","Shaymin Sky Forme":"0492/0001","Giratina Origin Forme":"0487/0001","Dialga Origin Forme":"0483/0001","Palkia Origin Forme":"0484/0001","Rotom Heat":"0479/0001","Rotom Wash":"0479/0002","Rotom Frost":"0479/0003","Rotom Fan":"0479/0004","Rotom Mow":"0479/0005","Castform Sunny":"0351/0001","Castform Rainy":"0351/0002","Castform Snowy":"0351/0003","Darmanitan Zen Mode":"0555/0001","Landorus Therian Forme":"0645/0001","Enamorus Therian Forme":"0905/0001","Black Kyurem":"0646/0001","White Kyurem":"0646/0002","Meloetta Pirouette Form":"0648/0001","Aegislash Blade Forme":"0681/0001","Zygarde 10% Forme":"0718/0001","Zygarde Complete Forme":"0718/0002","Hoopa Unbound":"0720/0001","Lycanroc Midnight":"0745/0001","Lycanroc Dusk":"0745/0002","Oricorio Sensu":"0741/0003","Wishiwashi School":"0746/0001","Ultra Necrozma":"0800/0003","Morpeko Hangry":"0877/0001","Crowned Zacian":"0888/0001","Crowned Zamazenta":"0889/0001","Eternamax Eternatus":"0890/0001","Urshifu Rapid Strike":"0892/0001","Bloodmoon Ursaluna":"0901/0001","Ogerpon Wellspring Mask":"1017/0005","Ogerpon Hearthflame Mask":"1017/0006","Ogerpon Cornerstone Mask":"1017/0007","Terapagos Terastal Form":"1024/0001","Palafin Hero Form":"0964/0001","Mimikyu Busted Form":"0778/0001","Tatsugiri Stretchy Form":"0978/0001","Galarian Darmanitan":"0555/0002","Paldean Tauros":"0128/0001","Paldean Tauros Aqua":"0128/0003","Paldean Tauros Blaze":"0128/0002","Keldeo Resolute Form":"0647","Meowstic Female":"0678","Indeedee Female":"0876","Basculegion Female":"0902","Toxtricity Low Key":"0849"};let _pmdR=null;
const pmdId=n=>{const d=window._dexN&&window._dexN[n];if(d&&window._spr&&window._spr[n]===d&&d<=1025)return String(d).padStart(4,"0");
  if(!_pmdR){_pmdR={};const R=window._ren||{};Object.keys(PMDF).forEach(k=>{_pmdR[R[k]||k]=PMDF[k]})}return _pmdR[n]||null};
function pmdLoad(n,sh){const id=pmdId(n);if(!id)return Promise.resolve(null);const key=id+(sh?"s":"");if(PMDC[key])return PMDC[key];
  return PMDC[key]=(async()=>{try{const sp=id.split("/"),base=PMDU+sp[0]+"/"+(sh?(sp[1]||"0000")+"/0001/":sp[1]?sp[1]+"/":"");const r=await fetch(base+"AnimData.xml");if(!r.ok)throw 0;
    const x=new DOMParser().parseFromString(await r.text(),"text/xml"),A={};
    x.querySelectorAll("Anim").forEach(a=>{const g=t=>{const e=a.querySelector(t);return e?e.textContent.trim():null};A[g("Name")]={copy:g("CopyOf"),fw:+g("FrameWidth"),fh:+g("FrameHeight"),d:[...a.querySelectorAll("Duration")].map(e=>+e.textContent*1000/60)}});
    const get=nm=>{let a=A[nm],k=0;while(a&&a.copy&&k++<6){nm=a.copy;a=A[nm]}return a&&a.fw&&a.d.length?Object.assign({nm:nm},a):null};
    const out={};for(const nm of["Walk","Idle","Sleep","Hop"]){const a=get(nm);if(!a)continue;const img=new Image();img.crossOrigin="anonymous";img.src=base+a.nm+"-Anim.png";await img.decode();
      a.W=img.naturalWidth;a.H=img.naturalHeight;a.rows=Math.max(1,Math.round(a.H/a.fh));a.url=img.src;a.T=a.d.reduce((u,v)=>u+v,0);
      const c=document.createElement("canvas");c.width=a.fw;c.height=a.fh;const g2=c.getContext("2d");g2.drawImage(img,0,0,a.fw,a.fh,0,0,a.fw,a.fh);
      let top=a.fh,bot=0;try{const px=g2.getImageData(0,0,a.fw,a.fh).data;for(let y=0;y<a.fh;y++)for(let q=0;q<a.fw;q++)if(px[(y*a.fw+q)*4+3]>20){if(y<top)top=y;if(y>bot)bot=y}}catch(e){top=0;bot=a.fh-1}
      a.top=top;a.bot=bot;out[nm]=a}
    if(!out.Walk)throw 0;out.Idle=out.Idle||out.Walk;const h=Math.max(8,out.Idle.bot-out.Idle.top+1);out.sc=Math.min(3,Math.max(1,Math.round(62/h*2)/2));return out}
  catch(e){if(sh)return pmdLoad(n,false);return null}})()}
function pmdFrame(t,a){let m=t%a.T;for(let i=0;i<a.d.length;i++){if(m<a.d[i])return i;m-=a.d[i]}return 0}
// ================= compañero: paseo natural (mira hacia donde camina, se para, salta, se duerme…) =================
const BW={w:null};
function bwSay(w,txt,ms){const s=document.createElement("span");s.className="bwfx";s.textContent=txt;w.appendChild(s);s.animate([{transform:"translate(-50%,0) scale(.6)",opacity:0},{transform:"translate(-50%,-14px) scale(1)",opacity:1,offset:.25},{transform:"translate(-50%,-30px) scale(1)",opacity:0}],{duration:ms||1400}).onfinish=()=>s.remove()}
function bwPick(t,W){const r=Math.random(),sw=84;
  if(BW.st==="sleep"&&Math.random()<.5){BW.st="idle";BW.until=t+1200;bwSay(BW.w,"❗",900);return}
  if(r<.5){BW.st="walk";BW.tx=Math.max(0,Math.min(W-sw,BW.x+(Math.random()<.5?-1:1)*(40+Math.random()*W*.5)));if(BW.tx<=2||BW.tx>=W-sw-2)BW.tx=Math.random()*(W-sw);BW.ty=Math.random()*10;BW.spd=.035+Math.random()*.03}
  else if(r<.62){BW.st="hop";BW.t0=t;BW.until=t+520;BW.hops=1+(Math.random()<.4?1:0)}
  else if(r<.78){BW.st="look";BW.t0=t;BW.until=t+1400+Math.random()*1200}
  else if(r<.92){BW.st="idle";BW.until=t+1500+Math.random()*2500;if(Math.random()<.3)bwSay(BW.w,["♪","💭","✨","❤️"][Math.floor(Math.random()*4)])}
  else{BW.st="sleep";BW.until=t+6000+Math.random()*6000;BW.zz=0}}
function bwTick(t){requestAnimationFrame(bwTick);const w=document.querySelector("#budC .bcwalk");
  if(!w||!w.isConnected||!w.offsetParent){BW.w=null;return}
  const f=w.parentNode,W=f.clientWidth,spr=w.querySelector(".bcspr"),img=spr&&spr.querySelector("img"),sh=w.querySelector(".bcshadow");if(!spr)return;
  if(BW.w!==w){BW.w=w;BW.x=Math.max(0,W*.5-42);BW.y=4;BW.dir=-1;BW.st="idle";BW.until=t+800;BW.last=t;BW.ph=0;BW.pm=null;BW.at=0;BW.an="";w.style.left="0";w.style.animation="none";spr.style.animation="none";
    {const b=S.buddy;if(b){const ww=w;pmdLoad(b.n,!!(S.shiny&&S.shiny[b.n]>0)).then(d=>{if(!d||BW.w!==ww)return;BW.pm=d;const im=spr.querySelector("img");if(im)im.style.display="none";
      spr.style.width="84px";spr.style.height="84px";const el=document.createElement("div");el.className="bwpmd";spr.appendChild(el);BW.el=el;BW.an=""})}}
    w.addEventListener("click",()=>{if(BW.st==="sleep")bwSay(w,"❗",900);BW.st="hop";BW.t0=performance.now();BW.until=BW.t0+520;BW.hops=2})}
  const dt=Math.min(60,t-BW.last);BW.last=t;
  const calm=typeof hubCalm==="function"&&hubCalm();if(calm&&!BW.pm){w.style.transform="translate("+BW.x+"px,0)";spr.style.transform="";if(img)img.style.transform="";return}if(calm){BW.st="idle";BW.until=t+500}
  if(BW.st==="walk"){const dx=BW.tx-BW.x;BW.dir=dx>0?1:-1;const st=Math.min(Math.abs(dx),BW.spd*dt);BW.x+=BW.dir*st;BW.y+=(BW.ty-BW.y)*Math.min(1,dt/600);BW.ph+=dt*BW.spd*.45;
    if(Math.abs(dx)<1){BW.st="idle";BW.until=t+700+Math.random()*1800}}
  else if(t>BW.until)bwPick(t,W);
  BW.x=Math.max(0,Math.min(W-84,BW.x));
  let ty=0,rot=0,sx=1,sy=1,face=BW.dir;
  if(BW.st==="walk"){ty=-Math.abs(Math.sin(BW.ph))*5;rot=Math.sin(BW.ph)*4;sy=1-Math.abs(Math.cos(BW.ph))*.04}
  else if(BW.st==="hop"){const p=Math.min(1,(t-BW.t0)/520);ty=-Math.sin(p*Math.PI)*20;sy=p<.12||p>.88?.9:1.05;sx=2-sy;if(p>=1){if(--BW.hops>0){BW.t0=t;BW.until=t+520}else{BW.st="idle";BW.until=t+900}}}
  else if(BW.st==="look"){face=((t-BW.t0)%1400)<700?-1:1;sy=1+Math.sin(t/420)*.02}
  else if(BW.st==="sleep"){sy=.94+Math.sin(t/700)*.03;rot=-4;if(t-(BW.zz||0)>1600){BW.zz=t;bwSay(w,"💤",1600)}}
  else{sy=1+Math.sin(t/420)*.025}
  if(BW.pm&&BW.el){const P=BW.pm,nm=BW.st==="walk"?"Walk":BW.st==="sleep"&&P.Sleep?"Sleep":BW.st==="hop"&&P.Hop?"Hop":"Idle",a=P[nm]||P.Idle;
    if(nm!==BW.an){BW.an=nm;BW.at=0;const sc=P.sc;BW.el.style.cssText="width:"+a.fw*sc+"px;height:"+a.fh*sc+"px;bottom:"+(-(a.fh-1-a.bot)*sc)+"px;background-image:url("+a.url+");background-size:"+a.W*sc+"px "+a.H*sc+"px"}
    BW.at+=calm?0:dt*(nm==="Walk"?Math.max(.7,BW.spd*28):1);
    const row=a.rows<8?0:BW.st==="walk"||BW.st==="hop"?(BW.dir>0?2:6):BW.st==="look"?(face>0?1:7):BW.st==="sleep"?0:(BW.dir>0?1:7),fr=pmdFrame(BW.at,a);
    BW.el.style.backgroundPosition=(-fr*a.fw*P.sc)+"px "+(-row*a.fh*P.sc)+"px";rot=0;sx=1;sy=1;if(BW.st==="walk")ty=0}
  const depth=1-BW.y/90;
  w.style.transform="translate("+BW.x.toFixed(1)+"px,"+(-BW.y).toFixed(1)+"px) scale("+depth.toFixed(3)+")";w.style.zIndex=String(20-Math.round(BW.y));
  spr.style.transform="translateY("+ty.toFixed(1)+"px) rotate("+rot.toFixed(1)+"deg) scale("+sx.toFixed(3)+","+sy.toFixed(3)+")";
  if(img&&!BW.pm)img.style.transform=face>0?"scaleX(-1)":"";
  if(sh){const k=1+ty/40;sh.style.transform="scale("+k.toFixed(2)+")";sh.style.opacity=String(Math.max(.4,k))}}
requestAnimationFrame(bwTick);

// ================= PVP: modo Clásico (sin megas, Dinamax ni Z) y modo Libre (con todo) =================
const pvMd=()=>S.pvMode==="l"?"l":"c";
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-pvmd]");if(!b)return;if(PV.st!=="idle"){toast("Cancela tu reto antes de cambiar de modo.");return}S.pvMode=b.dataset.pvmd;save();snd("ui");pvPub();pvRender()});
{const _pc=pvChallenge;pvChallenge=function(peer){const o=pvOthers().find(p=>p.peer===peer);if(o&&(o.presence.pvp.md==="l"?"l":"c")!==pvMd()){toast("Ese jugador está en el modo "+(o.presence.pvp.md==="l"?"Libre":"Clásico")+". Cambia de modo para retarle.");return false}return _pc.apply(this,arguments)}}
// formas disponibles del Pokémon activo (las que tienes en la colección)
function pvFormsOf(sd){const m=beAct(sd),own=(sd.fo&&sd.fo[sd.ai])||[],base=(m.p0||m.p)[0];return {mega:(FORMS[base]||[]).filter(f=>f[1]==="mega").map((f,k)=>[f[0],k]).filter(f=>own.includes(f[0])),gmax:(FORMS[base]||[]).find(f=>f[1]==="gmax"&&own.includes(f[0]))}}
function pvZOk(m,mv){if(!mv||mv.cl<=0)return "";if(/^z_/.test(m.it||"")&&mv.t===m.it.slice(2))return "z";if(/^zx_/.test(m.it||"")&&typeof zxFor==="function"){const z=zxFor(m);if(z&&mv.n===z[1])return "x"}return ""}
function pvFreeBtns(side,pm){if(!D||!D.E||!D.E.free||!pm||pm.mh<=0)return "";let h="";
  if(!side.fu&&!pm.dmx&&!pm.p0){const F=pvFormsOf(side);F.mega.forEach(f=>{h+='<button class="frmb mega'+(D.pre==="M"+f[1]?" on":"")+'" data-pv="fM'+f[1]+'">🧬 Megaevolucionar'+(F.mega.length>1?' ('+esc(f[0].slice(-1))+')':'')+'</button>'});
    h+=F.gmax?'<button class="frmb gmax'+(D.pre==="G"?" on":"")+'" data-pv="fG">🔴 Gigamax</button>':'<button class="frmb dmax'+(D.pre==="D"?" on":"")+'" data-pv="fD">🔴 Dinamax</button>'}
  if(!side.zu&&pm.m.some((mv,k)=>pm.pp[k]>0&&pvZOk(pm,mv)))h+='<button class="zbtn'+(D.zm?" on":"")+'" data-pv="zm">💎 Movimiento Z</button>';
  if(D.pre)h='<small class="pvpre">✨ '+(D.pre[0]==="M"?"Megaevolucionará":D.pre==="G"?"Se gigamaxizará":"Se dinamaxizará")+' antes de atacar: elige un ataque.</small>'+h;
  return h}
{const _pm=pvMenu;pvMenu=function(){_pm.apply(this,arguments);try{if(!D||!D.E||!D.zm||!D.E.free)return;const E=D.E,side=E.sd[pvMy()],pm=beAct(side),m=$("menu");if(!m.querySelector('[data-pv="zm"]'))return;
  m.innerHTML=pm.m.map((mv,k)=>{const z=pvZOk(pm,mv);if(!z||pm.pp[k]<=0)return "";const Z=z==="x"?zxMove(pm,mv):zMove(mv);return '<button class="mvb zmv" data-pv="'+z+k+'" style="--tc:'+(TC[mv.t]||"#999")+'">💎 '+esc(Z.n)+'<small>desde '+esc(mv.n)+(Z.pw?' · Poder '+Z.pw:'')+'</small></button>'}).join("")+'<button data-pv="zm">Volver</button>'}catch(e){console.error(e)}}}
// motor: las transformaciones y los Z van como acciones, así los dos jugadores calculan lo mismo
{const _bt=beTurn;beTurn=function(E,acts,rng){if(!E.pvp)return _bt.apply(this,arguments);
  const pre=[];acts=acts.map((a,i)=>{let s=String(a==null?"":a);const sd=E.sd[i];if(!sd||sd.out)return a;const m=beAct(sd);
    const q=s.match(/^([MGD])(\d?)\|(.+)$/);if(q){s=q[3];if(E.free&&!sd.fu&&m&&m.mh>0&&!m.p0){const F=pvFormsOf(sd);let np=null,kind="";
      if(q[1]==="M"){const f=F.mega.find(f=>f[1]===(+q[2]||0));if(f){np=PM[f[0]];kind="mega"}}else if(q[1]==="G"){if(F.gmax){np=PM[F.gmax[0]];kind="gmax"}}else{np=m.p;kind="dmax"}
      if(np){sd.fu=1;pre.push([i,kind,np,m.p[0]])}}}
    const z=s.match(/^([zx])(\d)(t\d)?$/);if(z){const mv=m&&m.m[+z[2]];if(!E.free||sd.zu||!m||pvZOk(m,mv)!==z[1])s="m"+z[2]+(z[3]||"");else sd.zu=1}
    return s});
  const ev0=[];pre.forEach(([i,kind,np,base])=>{const m=beAct(E.sd[i]);if(kind==="mega")formApply(m,np,1,1.12);else{formApply(m,np,2,1.35);m.dmx=1;E.sd[i].dmx=3;if(kind==="gmax"&&typeof GMX!=="undefined"&&GMX[np[0]])m.gmx=np[0]}ev0.push({k:"form",s:i,kind:kind,n:base,f:np[0],snap:beSnap(E)})});
  const ev=_bt.call(this,E,acts,rng);
  E.sd.forEach((sd,i)=>{if(sd.dmx>0&&--sd.dmx<=0){const m=sd.t.find(t=>t.dmx);if(m){formRevert(m);ev.push({k:"dmxend",s:i,n:m.p[0],snap:beSnap(E)})}}});
  return ev0.concat(ev)}}
{const _pa=pvAct;pvAct=function(a){if(D&&!/\|/.test(String(a))){D.pre="";D.zm=0}return _pa.apply(this,arguments)}}

// ================= máquina de gacha: palanca, bolas que caen según su rareza y apertura =================
const GBR={C:"C",R:"R",E:"E",M:"E",L:"L"};
const gbHTML=(r,c)=>'<i class="gb gb'+(GBR[r]||"C")+(c?" "+c:"")+'"></i>';
function gmFill(){const g=document.querySelector("#gmach .gmballs");if(!g||g.childElementCount)return;const L=["C","R","C","E","C","R","L","C","R","C","E","C","R","C","C"],P=[[8,96],[40,104],[72,108],[104,104],[132,94],[20,64],[54,72],[88,74],[118,62],[30,32],[64,40],[98,36],[128,30],[48,8],[86,6]];
  g.innerHTML=L.map((r,i)=>gbHTML(r).replace('class="gb','style="left:'+P[i][0]+'px;top:'+P[i][1]+'px" class="gb')).join("")}
setTimeout(gmFill,300);
function gachaShow(res,n,best,back,sup,RC){
  gmFill();const out=$("out"),M=$("gmach"),calm=typeof hubCalm==="function"&&hubCalm(),stage=$("stage");
  const cards=res.map(x=>cardHTML(x[0],x[1],x[2],n===1,x[3])),anySh=res.some(x=>x[3]);
  const cnt={};res.forEach(x=>{const r=x[0][2];cnt[r]=(cnt[r]||0)+1});const nn=res.filter(x=>x[1]).length;
  const sum=n>=100?["C","R","E","M","L"].filter(r=>cnt[r]).map(r=>({C:"Común",R:"Raro",E:"Épico",M:"Forma especial",L:"Legendario"}[r])+" ×"+cnt[r]).join(" · ")+(nn?" · ¡"+nn+" nuevos!":"")+(anySh?" · ✨ "+res.filter(x=>x[3]).length+" variocolor":""):"";
  out.className="results"+(n>=100?" x100":n===1?" one":"");
  const flash=c=>{const f=$("flash");f.style.background="radial-gradient(circle,"+c+",transparent 70%)";f.classList.remove("go");void f.offsetWidth;f.classList.add("go")};
  const end=()=>{PT.forEach(clearTimeout);PT=[];SK=null;$("skip").hidden=true;if(M)M.classList.remove("spin","pull","chute");
    if(sum&&!out.querySelector(".gsum"))out.insertAdjacentHTML("afterbegin",'<div class="gsum">'+esc(sum)+'</div>');
    $("msg").textContent=(anySh?"✨ ¡VARIOCOLOR! ":"")+(best==="L"?"¡LEGENDARIO! ":best==="M"?"¡FORMA ESPECIAL! ":best==="E"?"¡Épico! ":"")+(back?"Repetidos devueltos: +"+fmt(back)+" 🎟️":"");busy=false;render()};
  SK=()=>{out.innerHTML=res.map((x,i)=>'<div class="slot">'+cards[i]+'</div>').join("");snd("rev",anySh&&best!=="L"?"S":best);end()};
  $("skip").hidden=!O.skip||!!O.askip;
  if(O.askip||calm||!M){SK();return}
  out.innerHTML="";M.classList.toggle("sup",!!sup);M.classList.remove("pull","spin","chute");void M.offsetWidth;M.classList.add("pull","spin");snd("click");
  const big=n>=100,step=big?16:n>1?190:0,t0=720;
  res.forEach((x,i)=>tm(()=>{const s=document.createElement("div");s.className="slot";s.innerHTML=gbHTML(x[0][2],"drop"+(x[3]?" shiny":"")+(n===1?" big":""));
    s.firstChild.style.setProperty("--dx",(Math.random()*60-30).toFixed(0)+"px");out.appendChild(s);
    if(!big||i%10===0){snd(big?"pop":"ui");M.classList.remove("chute");void M.offsetWidth;M.classList.add("chute")}},t0+i*step));
  const t1=t0+res.length*step+(big?350:550),lv=({C:0,R:1,E:2,M:2,L:3})[best];
  tm(()=>{M.classList.remove("spin");
    // tensión: las bolas mejores tiemblan antes de abrirse
    out.querySelectorAll(".gb").forEach((b,i)=>{if(({C:0,R:1,E:2,M:2,L:3})[res[i][0][2]]>=2||n===1)b.classList.add("wob")});
    if(lv>=2){snd("buff");flash(RC[best])}
    if(best==="L"){snd("lvl");const r=document.createElement("div");r.className="grays";stage.appendChild(r);setTimeout(()=>r.remove(),1900);stage.animate([{transform:"translate(0,0)"},{transform:"translate(-6px,2px)"},{transform:"translate(6px,-2px)"},{transform:"translate(0,0)"}],{duration:420})}
  },t1);
  const t2=t1+(lv>=2||n===1?900:250),rs=big?14:n>1?300:0;
  tm(()=>{if(n===1&&lv>=2)cry(res[0][0][0]);snd("rev",anySh&&best!=="L"?"S":best);
    const sl=out.querySelectorAll(".slot");
    res.forEach((x,i)=>tm(()=>{const b=sl[i]&&sl[i].querySelector(".gb");if(b){b.classList.remove("wob");b.classList.add("open")}
      tm(()=>{if(!sl[i])return;sl[i].innerHTML=cards[i];const c=sl[i].querySelector(".card");if(c)c.classList.add("pop");
        if(!big||x[0][2]==="L"||x[3]){if(x[3])flash("#fff6a0");else if("CREML".indexOf(x[0][2])>1)flash(RC[x[0][2]])}
        if(!big&&n>1)snd("rev",x[3]&&x[0][2]!=="L"?"S":x[0][2])},big?40:240)},i*rs));
    tm(end,res.length*rs+(big?300:500))},t2);
}

// ================= clima y campos visibles en combate =================
const WXV={t:"",tr:"",raf:0,p:[],cv:null,last:0};
function wxSet(t,tr){if(t===WXV.t&&tr===WXV.tr)return;WXV.t=t;WXV.tr=tr;WXV.p=[];const bt=document.querySelector("#arena .bt");if(!bt)return;
  let o=bt.querySelector(".wxfx");if(!o){o=document.createElement("div");o.className="wxfx";o.innerHTML='<canvas></canvas>';bt.insertBefore(o,bt.querySelector("#oi"))}
  o.className="wxfx"+(t?" w-"+t:"")+(tr?" t-"+tr:"");WXV.cv=o.querySelector("canvas");if((t||tr)&&!WXV.raf)WXV.raf=requestAnimationFrame(wxDraw)}
function wxSync(){try{const E=typeof B!=="undefined"&&B&&B.E;wxSet(E?axWx(E):"",E?axTr(E):"")}catch(e){}}
function wxDraw(ts){WXV.raf=0;const cv=WXV.cv;if(!cv||!cv.isConnected||(!WXV.t&&!WXV.tr))return;const r=cv.getBoundingClientRect();if(!r.width){WXV.raf=requestAnimationFrame(wxDraw);return}
  const W=Math.round(r.width),H=Math.round(r.height);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  const g=cv.getContext("2d"),dt=Math.min(.05,(ts-(WXV.last||ts))/1000);WXV.last=ts;g.clearRect(0,0,W,H);const P=WXV.p,t=WXV.t,calm=typeof hubCalm==="function"&&hubCalm();
  if(calm){return}
  const want=t==="rain"?140:t==="snow"?90:t==="sand"?160:t==="wind"?40:t==="sun"?18:0,trw=WXV.tr==="electric"?10:WXV.tr==="grassy"?24:WXV.tr==="misty"?30:WXV.tr==="psychic"?22:0;
  while(P.filter(p=>!p.tr).length<want)P.push(wxNew(t,W,H,true));while(P.filter(p=>p.tr).length<trw)P.push(wxNewT(WXV.tr,W,H,true));
  for(let i=P.length-1;i>=0;i--){const p=P[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.a+=dt;if(p.wb)p.x+=Math.sin(p.a*p.wb)*20*dt;
    if(p.y>H+20||p.x<-60||p.x>W+60||(p.life&&p.a>p.life)){P[i]=p.tr?wxNewT(WXV.tr,W,H):wxNew(t,W,H);continue}
    g.globalAlpha=p.al*(p.life?Math.sin(Math.PI*p.a/p.life):1);
    if(p.k==="rain"){g.strokeStyle="#cfe8ff";g.lineWidth=1.5;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*.025,p.y-p.vy*.025);g.stroke()}
    else if(p.k==="snow"){g.fillStyle="#fff";g.beginPath();g.arc(p.x,p.y,p.s,0,7);g.fill()}
    else if(p.k==="sand"){g.fillStyle=p.c;g.fillRect(p.x,p.y,p.s,p.s*.7)}
    else if(p.k==="wind"){g.strokeStyle="#ffffff";g.lineWidth=2;g.beginPath();g.moveTo(p.x,p.y);g.quadraticCurveTo(p.x-40,p.y-6,p.x-90,p.y);g.stroke()}
    else if(p.k==="sun"){g.fillStyle="#fff6c0";g.beginPath();g.arc(p.x,p.y,p.s,0,7);g.fill()}
    else if(p.k==="spark"){g.strokeStyle="#ffe94a";g.lineWidth=2;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+5,p.y-7);g.lineTo(p.x+1,p.y-7);g.lineTo(p.x+6,p.y-14);g.stroke()}
    else if(p.k==="leaf"){g.fillStyle=p.c;g.beginPath();g.ellipse(p.x,p.y,p.s,p.s*.5,p.a*2,0,7);g.fill()}
    else if(p.k==="mist"){const gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,p.s);gr.addColorStop(0,"rgba(255,190,230,.5)");gr.addColorStop(1,"rgba(255,190,230,0)");g.fillStyle=gr;g.fillRect(p.x-p.s,p.y-p.s,p.s*2,p.s*2)}
    else if(p.k==="psy"){g.strokeStyle="#d58bff";g.lineWidth=2;g.beginPath();g.arc(p.x,p.y,p.s*(1+p.a),0,7);g.stroke()}}
  g.globalAlpha=1;WXV.raf=requestAnimationFrame(wxDraw)}
function wxNew(t,W,H,init){const R=Math.random,y0=init?R()*H:-10;
  if(t==="rain")return {k:"rain",x:R()*(W+80),y:y0,vx:-140,vy:700+R()*300,al:.55,a:0};
  if(t==="snow")return {k:"snow",x:R()*W,y:y0,vx:-15+R()*30,vy:35+R()*45,s:1.5+R()*2.5,wb:1+R()*2,al:.85,a:R()*6};
  if(t==="sand")return {k:"sand",x:init?R()*W:-10,y:R()*H,vx:260+R()*200,vy:20+R()*30,s:2+R()*3,c:["#d9b46a","#c99a52","#e8cf98"][Math.floor(R()*3)],al:.75,a:0};
  if(t==="wind")return {k:"wind",x:init?R()*W:-20,y:R()*H*.8,vx:380+R()*200,vy:0,al:.35,a:0};
  if(t==="sun")return {k:"sun",x:R()*W,y:R()*H,vx:0,vy:-8,s:1.5+R()*2.5,al:.9,a:0,life:2+R()*2};
  return {k:"none",x:0,y:H+99,vx:0,vy:0,al:0,a:0}}
function wxNewT(tr,W,H){const R=Math.random,y=H*(.55+R()*.45);
  if(tr==="electric")return {tr:1,k:"spark",x:R()*W,y:y,vx:0,vy:0,al:1,a:0,life:.25+R()*.3};
  if(tr==="grassy")return {tr:1,k:"leaf",x:R()*W,y:y,vx:-10+R()*20,vy:-20-R()*20,s:3+R()*2,c:R()<.5?"#6fd16a":"#3fae4a",al:.9,a:0,life:2+R()*2,wb:2};
  if(tr==="misty")return {tr:1,k:"mist",x:R()*W,y:y,vx:-8+R()*16,vy:-5,s:30+R()*40,al:.8,a:0,life:3+R()*3};
  if(tr==="psychic")return {tr:1,k:"psy",x:R()*W,y:y,vx:0,vy:-6,s:6+R()*8,al:.7,a:0,life:1.2+R()};
  return {tr:1,k:"none",x:0,y:H+99,vx:0,vy:0,al:0,a:0}}
// aparece cuando sale el mensaje del clima (así coincide con la animación) y se sincroniza al acabar cada turno
{const _say=say;say=function(t){try{const s=String(t);for(const k in AXWX){if(s===AXWX[k][0])wxSet(k,WXV.tr);else if(s===AXWX[k][1])wxSet("",WXV.tr)}for(const k in AXTR){if(s===AXTR[k][0])wxSet(WXV.t,k);else if(s===AXTR[k][1])wxSet(WXV.t,"")}}catch(e){}return _say.apply(this,arguments)}}
{const _bp=bePlay;bePlay=async function(){const r=await _bp.apply(this,arguments);wxSync();return r}}
{const _ar=arenaReset;arenaReset=function(){wxSet("","");return _ar.apply(this,arguments)}}
