// =====================================================================================
// APP INSTALABLE (PWA) Y NOTIFICACIONES
// =====================================================================================
var PWA={prompt:null,reg:null};
if("serviceWorker" in navigator&&(/^https:/.test(location.protocol)||/^(localhost|127\.0\.0\.1)$/.test(location.hostname))){navigator.serviceWorker.register("sw.js").then(r=>{PWA.reg=r}).catch(()=>{})}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();PWA.prompt=e;pwaUI()});
addEventListener("appinstalled",()=>{PWA.prompt=null;S.pwaInst=1;save();toast("📲 ¡Juego instalado! Ya puedes abrirlo desde tu pantalla de inicio.");pwaUI()});
const pwaStand=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const pwaIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
async function pwaInstall(){
  if(PWA.prompt){PWA.prompt.prompt();try{await PWA.prompt.userChoice}catch(e){}PWA.prompt=null;pwaUI();return}
  nxModal('<div class="hofb">📲</div><h3>Instalar Poke Gacha Online</h3>'+(pwaIOS()?'<p>En iPhone o iPad: pulsa el botón <b>Compartir</b> (el cuadrado con la flecha) y elige <b>«Añadir a pantalla de inicio»</b>.</p>':'<p>Abre el menú del navegador (⋮ arriba a la derecha) y elige <b>«Instalar aplicación»</b> o <b>«Añadir a pantalla de inicio»</b>.</p>')+'<button id="pwOk">Entendido</button>');$("pwOk").onclick=nxModalClose}
// ---- notificaciones ----
const NOTI_K=[["egg","🥚 Huevos y guardería"],["exp","🧭 Expediciones que vuelven"],["bud","🤝 Regalos del compañero"],["hh","🎉 Horas felices y Día de la Comunidad"],["ch","⚔️ Retos e invitaciones"],["msg","💬 Mensajes privados y del gremio"],["gift","🎁 Regalos de amigos e intercambios"]];
function notiOn(k){return O.noti&&(!O.notiK||O.notiK[k]!==false)}
async function notiAsk(){if(!("Notification" in window)){toast("Tu navegador no permite notificaciones.");return false}
  let p=Notification.permission;if(p==="default")p=await Notification.requestPermission();
  if(p!=="granted"){toast("No se han activado: tienes que permitir las notificaciones en el navegador.");O.noti=false;saveO();return false}
  O.noti=true;saveO();notiSend("🔔 ¡Notificaciones activadas!","Te avisaremos de huevos, expediciones, horas felices, retos y mensajes.","test",true);return true}
function notiSend(t,b,tag,force){if(!force&&!document.hidden)return;if(!("Notification" in window)||Notification.permission!=="granted")return;
  const o={body:b,tag:tag||"pg",icon:"icon-192.png",badge:"icon-192.png",renotify:true};
  try{if(PWA.reg&&PWA.reg.showNotification)PWA.reg.showNotification(t,o);else new Notification(t,o)}catch(e){}}
var NW={};
function notiWatch(){if(!O.noti)return;const was=NW,now={};
  try{now.egg=(dcEggReady()?1:0)+(S.eggs||[]).filter(eggDone).length}catch(e){}
  try{now.exp=(S.exp||[]).filter(x=>Date.now()>=x.t0+x.dur).length}catch(e){}
  try{const b=S.buddy;now.bud=b&&S.owned[b.n]>0&&Date.now()-(b.gift||0)>=10*6e4?1:0}catch(e){}
  try{now.hh=hhNow().map(s=>s.k+s.a).join("|")}catch(e){}
  try{now.ch=pvIncoming().ch.length+(DU.inv||[]).length}catch(e){}
  try{let n=0;Object.keys(CH.msgs).forEach(k=>{if(k!=="global")n+=chUnread(k)});now.msg=n}catch(e){}
  try{now.gift=((typeof GF!=="undefined"&&GF.inc)?GF.inc.length:0)+((typeof TRD!=="undefined"&&TRD.inc)?TRD.inc.length:0)}catch(e){}
  if(NW._init){
    if(notiOn("egg")&&now.egg>(was.egg|0))notiSend("🥚 ¡Algo pasa en la Guardería!","Tienes un huevo listo para recoger o a punto de eclosionar.","egg");
    if(notiOn("exp")&&now.exp>(was.exp|0))notiSend("🧭 ¡Ha vuelto una expedición!","Tu Pokémon ha vuelto cargado de premios.","exp");
    if(notiOn("bud")&&now.bud>(was.bud|0)){const b=S.buddy;notiSend("🎁 "+nk(b.n)+" ha encontrado un regalo","Ve a Actividades → Compañero para recogerlo.","bud")}
    if(notiOn("hh")&&now.hh&&now.hh!==was.hh){const s=hhNow()[0],i=hhInfo(s);notiSend("🎉 ¡Empieza "+i[0]+"!",i[1],"hh")}
    if(notiOn("ch")&&now.ch>(was.ch|0))notiSend("⚔️ ¡Te han retado!","Alguien quiere combatir contigo. ¡Entra antes de que caduque!","ch");
    if(notiOn("msg")&&now.msg>(was.msg|0))notiSend("💬 Mensaje nuevo","Tienes "+now.msg+" mensaje"+(now.msg>1?"s":"")+" sin leer.","msg");
    if(notiOn("gift")&&now.gift>(was.gift|0))notiSend("🎁 ¡Tienes algo nuevo!","Un amigo te ha enviado un regalo o un intercambio.","gift");
  }
  now._init=1;NW=now;
  try{if("setAppBadge" in navigator){const t=(now.egg|0)+(now.exp|0)+(now.bud|0)+(now.ch|0)+(now.msg|0)+(now.gift|0);t?navigator.setAppBadge(t).catch(()=>{}):navigator.clearAppBadge().catch(()=>{})}}catch(e){}
}
setInterval(()=>{try{notiWatch()}catch(e){}},15000);
// ---- interfaz: ajustes → Cuenta y botón del menú ----
function pwaUI(){
  const host=document.querySelector('#optp .setpane[data-st="acct"]');if(host){let b=$("pwaBox");if(!b){b=document.createElement("div");b.id="pwaBox";b.className="pwabox";host.prepend(b)}
    const perm="Notification" in window?Notification.permission:"none";
    b.innerHTML='<h4>📲 App y notificaciones</h4>'+(pwaStand()?'<small class="mut">✅ Estás usando el juego instalado como app.</small>':'<button type="button" class="setbtn" id="pwaI">📲 Instalar el juego como app</button>')+
      (perm==="none"?'<small class="mut">Tu navegador no admite notificaciones.</small>':O.noti&&perm==="granted"?'<label class="tog"><input type="checkbox" id="notiOn" checked> 🔔 Notificaciones activadas</label><div class="notik">'+NOTI_K.map(k=>'<label class="tog"><input type="checkbox" data-nk="'+k[0]+'"'+(!O.notiK||O.notiK[k[0]]!==false?' checked':'')+'> '+k[1]+'</label>').join("")+'</div><small class="mut">Los avisos llegan mientras el juego está abierto, aunque estés en otra pestaña o con la app en segundo plano.</small>':'<button type="button" class="setbtn" id="notiA">🔔 Activar notificaciones</button>'+(perm==="denied"?'<small class="mut">Las tienes bloqueadas: permítelas en el candado de la barra de direcciones.</small>':''));
    const i=$("pwaI");if(i)i.onclick=pwaInstall;const a=$("notiA");if(a)a.onclick=async()=>{await notiAsk();pwaUI()};
    const o=$("notiOn");if(o)o.onchange=()=>{O.noti=o.checked;saveO();pwaUI()};
    b.querySelectorAll("[data-nk]").forEach(x=>x.onchange=()=>{O.notiK=O.notiK||{};O.notiK[x.dataset.nk]=x.checked;saveO()})}
  const g=HUB.find(x=>x.k==="mas");if(g){g.act=g.act||[];if(!pwaStand()&&!g.act.some(a=>a[1]==="pwa"))g.act.unshift(["📲 Instalar app","pwa"])}
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest('[data-ha="pwa"]');if(b){e.stopPropagation();hubClose();pwaInstall()}},true);
{const o=$("optp");if(o)new MutationObserver(()=>{if(!o.hidden)pwaUI()}).observe(o,{attributes:true,attributeFilter:["hidden"]})}
setTimeout(pwaUI,1500);
