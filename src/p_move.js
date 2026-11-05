// ================= mudanza a pokegachaonline.es: aviso para las partidas sin cuenta =================
const MV_DOM="pokegachaonline.es";
const mvOld=()=>!/(^|\.)pokegachaonline\.es$/.test(location.hostname);
const mvGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}},mvSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const mvToday=()=>new Date().toISOString().slice(0,10);
function mvBusy(){const vis=id=>{const e=document.getElementById(id);return e&&!e.hidden&&e.offsetParent!==null};
  return !!document.querySelector(".uidlg")||vis("welc")||vis("tutBox")||vis("newsM")||vis("privM")||vis("gLoad")||(typeof fcd!=="undefined"&&fcd)}
function mvModal(html,btns){const M=document.createElement("div");M.className="uidlg mvdlg";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  M.innerHTML='<div class="uidbox mvbox">'+html+'<div class="uidb mvbtns">'+btns.map((b,i)=>'<button type="button" class="'+(b.cls||"")+'" data-mv="'+i+'">'+b.t+'</button>').join("")+'</div></div>';
  M.addEventListener("click",e=>{const b=e.target.closest("[data-mv]");if(!b)return;const f=btns[+b.dataset.mv];if(f.keep!==true)M.remove();try{f.fn&&f.fn(b,M)}catch(x){}});
  (document.fullscreenElement&&document.fullscreenElement!==document.documentElement?document.fullscreenElement:document.body).appendChild(M);return M}
function mvExport(){const b=document.getElementById("clExp");if(!b)return false;b.click();mvSet("gacha-mv-exp",mvToday());return true}
function mvShowOld(){mvSet("gacha-mv-seen",mvToday());const n=Object.keys(S.owned||{}).length;
  mvModal('<b class="mvt">📢 ¡Nos mudamos a '+MV_DOM+'!</b>'+
    '<p>Muy pronto Poke Gacha Online estará en su propia dirección: <b>'+MV_DOM+'</b>.</p>'+
    '<p>Estás jugando <b>sin cuenta</b>, así que tu partida'+(n?' ('+n+' Pokémon)':'')+' solo está guardada en este navegador y <b>no pasará sola</b> a la nueva dirección. Para no perderla, elige una opción:</p>'+
    '<ul class="mvl"><li><b>Crea una cuenta</b> (es gratis): al crearla, el juego te preguntará si quieres pasarle esta partida y quedará guardada en la nube.</li>'+
    '<li><b>O exporta tu partida</b> a un archivo y luego impórtala en '+MV_DOM+' desde <i>Ajustes › Importar partida</i>.</li></ul>',
    [{t:"⬇️ Exportar partida",cls:"",keep:true,fn:(b)=>{if(mvExport()){b.textContent="✅ Partida exportada";b.disabled=true}}},
     {t:"👤 Crear una cuenta",cls:"alt",fn:()=>{try{save()}catch(e){}setTimeout(()=>location.reload(),150)}},
     {t:"Entendido",cls:"alt"}])}
function mvShowNew(){mvSet("gacha-mv-new","1");
  mvModal('<b class="mvt">👋 ¡Te damos la bienvenida a '+MV_DOM+'!</b>'+
    '<p>¿Ya jugabas en la dirección antigua (devildante98.github.io) <b>sin cuenta</b>? Si exportaste tu partida allí, impórtala ahora y sigue donde lo dejaste.</p>'+
    '<p class="mvs">Si jugabas con cuenta no tienes que hacer nada: inicia sesión y tu progreso estará aquí.</p>',
    [{t:"⬆️ Importar partida",fn:()=>{const f=document.getElementById("clFile");if(f)f.click()}},{t:"Empezar de cero",cls:"alt"}])}
function mvCheck(){if(window.__KEY||typeof S==="undefined"||!S||mvGet("gacha-rescue")||mvRescBusy)return false;
  if(mvOld()){if(mvBusy())return false;if(mvGet("gacha-mv-exp")||mvGet("gacha-mv-seen")===mvToday())return true;mvShowOld();return true}
  const fresh=!Object.keys(S.owned||{}).length&&!(S.pulls||S.np||S.sp);if(!fresh||mvGet("gacha-mv-new"))return true;const L=document.getElementById("gLoad");if(document.querySelector(".uidlg")||(L&&!L.hidden&&L.offsetParent!==null))return false;mvShowNew();return true}
{let mvT=0;const iv=setInterval(()=>{if(++mvT<3)return;if(mvCheck()||mvT>300)clearInterval(iv)},2000)}
// al importar desde el aviso, se confirma sola (el archivo ya lo ha elegido la persona)
document.addEventListener("change",e=>{if(e.target&&e.target.id==="clFile"&&mvGet("gacha-mv-new")==="1"&&!window.__KEY)setTimeout(()=>{const ok=document.getElementById("clImpOk");if(ok&&!ok.hidden&&confirm("¿Cargar la partida importada? Se sustituirá la partida de este navegador."))ok.click()},400)});

// ---------- partida rescatada desde devildante98.github.io/rescate ----------
async function mvRescueData(){const r=mvGet("gacha-rescue");if(!r)return null;
  const b64=r.replace(/-/g,"+").replace(/_/g,"/"),bin=atob(b64+"===".slice((b64.length+3)%4)),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  let txt;if(u[0]===0x1f&&u[1]===0x8b){const st=new Blob([u]).stream().pipeThrough(new DecompressionStream("gzip"));txt=await new Response(st).text()}else txt=new TextDecoder().decode(u);
  const d=JSON.parse(txt);return{txt,d}}
let mvRescBusy=false;
async function mvRescue(){if(mvRescBusy||!mvGet("gacha-rescue")||typeof S==="undefined"||!S)return false;if(document.querySelector(".uidlg"))return false;mvRescBusy=true;
  let R=null,bad="";try{R=await mvRescueData();bad=saveCheck(R.d)}catch(e){bad="el enlace está incompleto o dañado"}
  if(bad){try{localStorage.removeItem("gacha-rescue")}catch(e){}mvModal('<b class="mvt">❌ No se ha podido recuperar la partida</b><p>'+esc(bad)+'. Vuelve a abrir la página de rescate en el navegador donde jugabas.</p>',[{t:"Entendido"}]);mvRescBusy=false;return true}
  const n=Object.keys(R.d.owned||{}).length,tk=typeof fmt==="function"?fmt(R.d.t||0):R.d.t;
  if(window.__KEY){mvModal('<b class="mvt">📦 Tienes una partida rescatada</b><p>Ha llegado tu partida sin cuenta de la dirección antigua ('+n+' Pokémon · '+tk+' 🎟️), pero ahora has entrado con una cuenta.</p><p>Para cargarla, sal de la cuenta y pulsa <b>«Jugar sin cuenta»</b>. Después, si quieres, podrás pasarla a una cuenta nueva.</p>',[{t:"Entendido"}]);mvRescBusy=false;return true}
  const cur=Object.keys(S.owned||{}).length,fresh=!cur&&!(S.pulls||S.np||S.sp);
  mvModal('<b class="mvt">📦 ¡Tu partida ha llegado!</b><p>Hemos recibido la partida que tenías sin cuenta en la dirección antigua: <b>'+n+' Pokémon · '+tk+' 🎟️</b>.</p>'+(fresh?'':'<p>⚠️ Sustituirá a la partida que tienes ahora en este navegador ('+cur+' Pokémon).</p>')+'<p class="mvs">Consejo: después crea una cuenta para tenerla guardada en la nube.</p>',
    [{t:"✅ Cargar mi partida",fn:()=>{try{localStorage.setItem(KEY,R.txt);localStorage.removeItem("gacha-rescue");mvSet("gacha-mv-new","1")}catch(e){}location.reload()}},
     {t:"Ahora no",cls:"alt",fn:()=>{mvRescBusy=false}},{t:"Descartarla",cls:"alt",fn:()=>{try{localStorage.removeItem("gacha-rescue")}catch(e){}mvRescBusy=false}}]);return true}
{let t=0;const iv=setInterval(()=>{if(++t>200){clearInterval(iv);return}mvRescue().then(r=>{if(r)clearInterval(iv)})},1500)}
