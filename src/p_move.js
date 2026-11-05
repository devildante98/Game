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
function mvCheck(){if(window.__KEY||typeof S==="undefined"||!S)return false;
  if(mvOld()){if(mvBusy())return false;if(mvGet("gacha-mv-exp")||mvGet("gacha-mv-seen")===mvToday())return true;mvShowOld();return true}
  const fresh=!Object.keys(S.owned||{}).length&&!(S.pulls||S.np||S.sp);if(!fresh||mvGet("gacha-mv-new"))return true;const L=document.getElementById("gLoad");if(document.querySelector(".uidlg")||(L&&!L.hidden&&L.offsetParent!==null))return false;mvShowNew();return true}
{let mvT=0;const iv=setInterval(()=>{if(++mvT<3)return;if(mvCheck()||mvT>300)clearInterval(iv)},2000)}
// al importar desde el aviso, se confirma sola (el archivo ya lo ha elegido la persona)
document.addEventListener("change",e=>{if(e.target&&e.target.id==="clFile"&&mvGet("gacha-mv-new")==="1"&&!window.__KEY)setTimeout(()=>{const ok=document.getElementById("clImpOk");if(ok&&!ok.hidden&&confirm("¿Cargar la partida importada? Se sustituirá la partida de este navegador."))ok.click()},400)});
