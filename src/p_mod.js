// =====================================================================================
// MODERACIÓN Y PROTECCIÓN: reportes, panel de administrador, silenciar / expulsar,
// limpiar clasificaciones y comprobaciones contra valores imposibles
// Firestore: reports/{id}, bans/{uid} (admins/{uid} ya existe)
// =====================================================================================
var MOD={admin:false,ban:null,reports:null,bans:null,unsub:null};
const MOD_WHY=["Insultos o acoso","Spam o publicidad","Contenido inapropiado","Trampas","Otro"];
function modInit(){if(MOD.on||!window.FB||!window.FB.uid||!window.FB.uid()||!window.FB.modIsAdmin)return;MOD.on=1;
  if(!$("sugAdm").hidden){MOD.admin=true;modTab()}
  window.FB.modIsAdmin().then(a=>{MOD.admin=MOD.admin||!!a;if(MOD.admin){modTab();if(CH.open)chRender(true)}}).catch(()=>{});
  try{MOD.unsub=window.FB.banWatch(b=>{MOD.ban=b;})}catch(e){}}
setInterval(modInit,3000);
const banActive=b=>!!(b&&((b.until|0)===0||b.until>Date.now()));
const banTxt=b=>(b.until|0)===0?"de forma permanente":"hasta el "+new Date(b.until).toLocaleString("es",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
// el jugador silenciado no puede escribir en el chat
{const _s=chSend;chSend=async function(pk){if(banActive(MOD.ban)){chFlash("🔇 Estás silenciado en el chat "+banTxt(MOD.ban)+(MOD.ban.why?" ("+MOD.ban.why+")":"")+".");return}return _s.apply(this,arguments)}}
{const _s=chSendImg;chSendImg=async function(f){if(banActive(MOD.ban)){chFlash("🔇 Estás silenciado en el chat "+banTxt(MOD.ban)+".");return}return _s.apply(this,arguments)}}
{const _s=chSendInv;chSendInv=async function(k){if(banActive(MOD.ban)){chFlash("🔇 Estás silenciado en el chat "+banTxt(MOD.ban)+".");return}return _s.apply(this,arguments)}}
{const _s=mkSell;mkSell=async function(){if(banActive(MOD.ban)&&MOD.ban.all){toast("⛔ Tu cuenta no puede usar el mercadillo "+banTxt(MOD.ban)+".");return}return _s.apply(this,arguments)}}
// ---- reportar un mensaje ----
document.addEventListener("click",e=>{
  const r=e.target.closest&&e.target.closest("[data-chrep]");
  if(r){const m=chFindMsg(r.dataset.chrep);if(!m)return;nxModal('<div class="hofb">🚩</div><h3>Reportar mensaje de '+esc(pvClean(m.n||""))+'</h3><p class="mut">«'+esc(String(m.t||(m.img?"📷 Foto":m.inv?"✉️ Invitación":"")).slice(0,140))+'»</p><div class="modwhy">'+MOD_WHY.map((w,i)=>'<button data-mrw="'+i+'">'+w+'</button>').join("")+'</div><button class="alt" id="mrX">Cancelar</button>');
    $("mrX").onclick=nxModalClose;document.querySelectorAll("[data-mrw]").forEach(b=>b.onclick=async()=>{nxModalClose();try{await window.FB.reportAdd({mid:m.id,key:chKey(),u:m.u,un:pvClean(m.n||"").slice(0,30),t:String(m.t||"").slice(0,300),img:m.img?1:0,why:MOD_WHY[+b.dataset.mrw],by:window.FB.uid(),byn:pvClean(pvNick()).slice(0,30),at:Date.now()});toast("🚩 Gracias. Un moderador revisará el mensaje.")}catch(x){toast("No se ha podido enviar el reporte.")}});return}
  const d=e.target.closest&&e.target.closest("[data-chadel]");
  if(d&&MOD.admin){const k=chKey(),[tp,id]=k==="global"?["global","global"]:k.split(":");window.FB.chDel(tp,id,d.dataset.chadel).then(()=>toast("🗑️ Mensaje borrado")).catch(()=>toast("No se ha podido borrar"))}
});
// ---- panel de moderación (solo administradores) ----
function modTab(){nxPanel("modP","🛠️ Moderación","Solo lo ves tú porque eres administrador. Revisa los reportes, silencia o expulsa jugadores y quita marcas falsas de las clasificaciones.");
  const g=HUB.find(x=>x.k==="mas");if(g&&!g.tabs.some(t=>t[0]==="modP"))g.tabs.push(["modP","🛠️ Moderación"]);HUBP.modP="mas";HUBR.modP=()=>modUI(true)}
async function modUI(force){
  const box=$("modPB");if(!box||!MOD.admin)return;
  if(force||!MOD.reports){box.innerHTML='<small class="mut">Cargando…</small>';try{MOD.reports=await window.FB.reportList();MOD.bans=await window.FB.banList()}catch(e){box.innerHTML='<p class="mut">No se han podido cargar los datos ('+((e&&e.code)||"error")+'). Revisa las reglas de Firestore.</p>';return}}
  const R=MOD.reports||[],Bn=(MOD.bans||[]).filter(banActive);
  box.innerHTML='<h3 class="shh">🚩 Reportes ('+R.length+')</h3>'+(R.length?R.map(r=>'<div class="modr"><div><b>'+esc(r.un||"?")+'</b> <small class="mut">reportado por '+esc(r.byn||"?")+' · '+esc(r.why||"")+' · '+new Date(r.at||0).toLocaleString("es")+'</small><p>'+(r.img?'📷 ':'')+esc(r.t||"(sin texto)")+'</p></div><div class="modb">'+
      '<button class="alt mini" data-mdm="'+esc(r.id)+'">🗑️ Borrar mensaje</button><button class="mini" data-mban="'+esc(r.u)+'" data-mbn="'+esc(r.un||"")+'" data-mbt="24">🔇 Silenciar 24 h</button><button class="mini" data-mban="'+esc(r.u)+'" data-mbn="'+esc(r.un||"")+'" data-mbt="168">🔇 7 días</button><button class="red mini" data-mban="'+esc(r.u)+'" data-mbn="'+esc(r.un||"")+'" data-mbt="0" data-mball="1">⛔ Expulsar</button><button class="alt mini" data-mrd="'+esc(r.id)+'">✅ Descartar</button></div></div>').join(""):'<small class="mut">No hay reportes pendientes. 🎉</small>')+
    '<h3 class="shh">🔇 Jugadores sancionados ('+Bn.length+')</h3>'+(Bn.length?Bn.map(b=>'<div class="modr"><div><b>'+esc(b.n||b.id)+'</b> <small class="mut">'+(b.all?'⛔ Expulsado (chat, mercadillo y clasificaciones)':'🔇 Silenciado en el chat')+' '+banTxt(b)+(b.why?' · '+esc(b.why):'')+'</small></div><div class="modb"><button class="alt mini" data-munb="'+esc(b.id)+'">Quitar sanción</button></div></div>').join(""):'<small class="mut">Nadie está sancionado.</small>')+
    '<h3 class="shh">🏆 Clasificaciones</h3><small class="mut">En las clasificaciones del Torneo semanal y de los minijuegos verás un botón 🗑️ junto a cada jugador para quitar marcas imposibles o hechas con trampas.</small>'+
    '<h3 class="shh">💾 Copias de seguridad</h3><small class="mut">Actívalas en la consola de Firebase → Firestore → <b>Recuperación ante desastres</b> → «Crear programación» (diaria). Así podrás recuperar los datos si algo se borra por error.</small>';
}
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("#modPB button");if(!b||!MOD.admin)return;const d=b.dataset;
  try{
    if(d.mdm){const r=(MOD.reports||[]).find(x=>x.id===d.mdm);if(r&&r.key){const [tp,id]=r.key==="global"?["global","global"]:r.key.split(":");await window.FB.chDel(tp,id,r.mid).catch(()=>{})}await window.FB.reportDel(d.mdm);toast("🗑️ Mensaje borrado")}
    else if(d.mban){const h=+d.mbt,why=prompt("Motivo (lo verá el jugador):",h?"Mal comportamiento en el chat":"Trampas o abuso")||"";await window.FB.banSet(d.mban,{n:String(d.mbn||"").slice(0,30),until:h?Date.now()+h*36e5:0,all:d.mball?1:0,why:why.slice(0,80),by:window.FB.uid(),at:Date.now()});toast(h?"🔇 Jugador silenciado":"⛔ Jugador expulsado")}
    else if(d.mrd){await window.FB.reportDel(d.mrd);toast("✅ Reporte descartado")}
    else if(d.munb){await window.FB.banDel(d.munb);toast("Sanción quitada")}
  }catch(x){toast("No se ha podido completar ("+((x&&x.code)||"error")+")")}
  modUI(true)});
// ---- quitar entradas de las clasificaciones (administrador) ----
function modRankBtns(){if(!MOD.admin)return;document.querySelectorAll(".tourl .tourr").forEach(r=>{if(r.querySelector(".modrk"))return;const p=r.querySelector("[data-prof]");if(!p)return;const b=document.createElement("button");b.className="modrk alt mini";b.textContent="🗑️";b.title="Quitar de la clasificación (moderación)";b.dataset.mrk=p.dataset.prof;r.appendChild(b)})}
setInterval(()=>{try{modRankBtns()}catch(e){}},1500);
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("[data-mrk]");if(!b||!MOD.admin)return;const u=b.dataset.mrk,box=b.closest("#mgrPB")?"mgr":"tour";
  if(!confirm("¿Quitar a este jugador de esta clasificación?"))return;const w=tourWeek(),key=box==="mgr"?MGR_KEY(w,MGR.g):w;
  try{await window.FB.tourDel(key,u);toast("🗑️ Quitado de la clasificación");if(box==="mgr"){MGR.at[MGR.g]=0;mgrUI(true)}else{TR_.at=0;await tourLoad(true);mgUI()}}catch(x){toast("No se ha podido quitar ("+((x&&x.code)||"error")+")")}});
// ---- expulsados: fuera de clasificaciones ----
{const _ts=tourSubmit;tourSubmit=function(id,sc){if(banActive(MOD.ban)&&MOD.ban.all)return "";return _ts(id,sc)}}
{const _ms=mgrSubmit;mgrSubmit=function(id,sc){if(banActive(MOD.ban)&&MOD.ban.all)return "";return _ms(id,sc)}}

// =====================================================================================
// COMPROBACIONES CONTRA VALORES IMPOSIBLES (protección básica en el propio juego)
// =====================================================================================
const MG_MAX={who:6000,mem:1700,dig:400,fish:3000,thr:2500,run:20000,exc:2500,wgt:40000};
{const _ms=mgrSubmit;mgrSubmit=function(id,sc){if(MG_MAX[id]&&sc>MG_MAX[id])return "";return _ms(id,sc)}}
{const _ts=tourSubmit;tourSubmit=function(id,sc){if(MG_MAX[id]&&sc>MG_MAX[id])return "";return _ts(id,sc)}}
function sanity(){let fix=0;
  if(!(S.t>=0)||!isFinite(S.t)){S.t=0;fix++}if(S.t>1e15){S.t=1e15;fix++}
  for(const n in S.owned){const c=S.owned[n];if(!PM[n]||!(c>0)||!isFinite(c)){delete S.owned[n];fix++}else if(c>99999){S.owned[n]=99999;fix++}}
  for(const n in S.lv){const d=S.lv[n];if(!d||!(d.l>=1)||d.l>100||!isFinite(d.l)){S.lv[n]={l:Math.max(1,Math.min(100,(d&&d.l)|0||1)),x:0};fix++}}
  for(const k in S.bag){const q=S.bag[k];if(!(q>=0)||!isFinite(q)){S.bag[k]=0;fix++}else if(q>999999){S.bag[k]=999999;fix++}}
  if(fix)save();return fix}
setTimeout(sanity,3000);setInterval(sanity,60000);
// si el panel de sugerencias de administrador aparece después, también activa la moderación
setInterval(()=>{try{if(!MOD.admin&&$("sugAdm")&&!$("sugAdm").hidden){MOD.admin=true;modTab();if(typeof CH!=="undefined"&&CH.open)chRender(true)}}catch(e){}},3000);
