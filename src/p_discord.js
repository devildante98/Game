// =====================================================================================
// DISCORD: botón para entrar al servidor de Discord de los jugadores
// · Pantallas anchas: botón «Discord» en la barra de arriba, a la izquierda del chat (el recuadro Guardar/Salir se aparta).
// · En cualquier pantalla: acceso «Discord» en el menú Más.
// =====================================================================================
const DISCORD_URL="https://discord.gg/Eqt62JDPGF";
const DC_IC='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M19.3 5.4A16.6 16.6 0 0 0 15.2 4l-.5 1.1a15.3 15.3 0 0 0-5.4 0L8.8 4a16.6 16.6 0 0 0-4.1 1.4C2.1 9.3 1.4 13.1 1.8 16.8a16.8 16.8 0 0 0 5 2.6l1.1-1.7c-.6-.2-1.2-.5-1.7-.9l.4-.3a11.9 11.9 0 0 0 10.8 0l.4.3c-.5.4-1.1.7-1.7.9l1.1 1.7a16.8 16.8 0 0 0 5-2.6c.5-4.3-.8-8.1-2.9-11.4zM8.7 14.6c-1 0-1.8-.9-1.8-2.1s.8-2.1 1.8-2.1 1.8.9 1.8 2.1-.8 2.1-1.8 2.1zm6.6 0c-1 0-1.8-.9-1.8-2.1s.8-2.1 1.8-2.1 1.8.9 1.8 2.1-.8 2.1-1.8 2.1z"/></svg>';
function dcOpen(){try{snd("ui")}catch(e){}window.open(DISCORD_URL,"_blank","noopener")}
(function(){if(document.getElementById("dcb"))return;
  const a=document.createElement("a");a.id="dcb";a.href=DISCORD_URL;a.target="_blank";a.rel="noopener";a.title="Únete al servidor de Discord de Poke Gacha Online";a.setAttribute("aria-label",a.title);
  a.innerHTML=DC_IC+'<span>Discord</span>';a.addEventListener("click",()=>{try{snd("ui")}catch(e){}});document.body.appendChild(a)})();
// colocación: a la izquierda del primero de los botones redondos de arriba (chat, pantalla completa, ajustes)
function dcPlace(){const a=document.getElementById("dcb");if(!a)return;
  const vis=e=>{if(!e||e.hidden)return false;const c=getComputedStyle(e);return c.display!=="none"&&c.visibility!=="hidden"};// (son fijos: offsetParent siempre es null)
  const R=["chb","fsb","optb"].map(id=>document.getElementById(id)).filter(vis).map(e=>e.getBoundingClientRect()).filter(r=>r.top<80&&r.width>0);
  const ac=document.getElementById("acct");
  if(innerWidth<900||!R.length||document.body.classList.contains("hubon")||document.body.classList.contains("exfsOn")){a.hidden=true;if(ac&&ac._dcR){ac.style.right="";ac._dcR=0}return}
  const L=Math.min(...R.map(r=>r.left)),top=R[0].top,h=R[0].height;a.hidden=false;
  a.style.right=Math.round(innerWidth-L+8)+"px";a.style.top=Math.round(top)+"px";a.style.height=Math.round(h)+"px";
  // hasta dónde llega lo de la izquierda de la barra (avatar, tickets, racha, nivel)
  const gt=document.getElementById("gTop"),edge=gt?Math.max(0,...[...gt.children].filter(e=>e.id!=="acct"&&e.id!=="dcb").map(e=>e.getBoundingClientRect()).filter(r=>r.width>0&&r.top<80).map(r=>r.right)):0;
  const acOn=ac&&!ac.hidden&&ac.getBoundingClientRect().top<80,acW=acOn?ac.getBoundingClientRect().width:0;
  // con texto si cabe; si no, solo el logo; y si tampoco, se oculta (sigue en el menú Más)
  for(const mini of [false,true]){a.classList.toggle("mini",mini);const w=a.getBoundingClientRect().width,leftAll=L-8-w-(acOn?10+acW:0);
    if(leftAll>edge+8){if(acOn){const r=Math.round(innerWidth-L+8+w+10);if(ac._dcR!==r){ac.style.right=r+"px";ac._dcR=r}}return}}
  a.hidden=true;if(ac&&ac._dcR){ac.style.right="";ac._dcR=0}}
addEventListener("resize",dcPlace);setInterval(dcPlace,1000);setTimeout(dcPlace,300);
// acceso en el menú Más
{const g=HUB.find(x=>x.k==="mas");if(g){g.act=g.act||[];if(!g.act.some(x=>x[1]==="discord"))g.act.unshift(["💬 Discord","discord"])}}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;const b=t.closest('#hubTabs [data-ha="discord"]');if(b){e.preventDefault();dcOpen()}});
