// =====================================================================================
// AVISO DE EVENTOS EN UNA VENTANA
// Cuando empieza una hora feliz, el Día de la Comunidad o un evento de temporada, sale una ventana en el centro de la
// pantalla (una sola vez por evento; si entras con el evento ya empezado, también sale). No interrumpe: espera a que
// termines el combate o cierres otras ventanas.
// =====================================================================================
const EVP={seen:null,cur:null};
function evpSeen(){if(EVP.seen)return EVP.seen;try{EVP.seen=JSON.parse(localStorage.getItem("pgc-evseen")||"{}")}catch(e){EVP.seen={}}return EVP.seen}
function evpMark(k){const s=evpSeen();s[k]=Date.now();for(const x in s)if(Date.now()-s[x]>40*864e5)delete s[x];try{localStorage.setItem("pgc-evseen",JSON.stringify(s))}catch(e){}}
const evpHora=t=>new Date(t).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Madrid"});
// ¿se puede enseñar ahora? (sin combate, sin otras ventanas abiertas)
function evpFree(){try{if(typeof fcd!=="undefined"&&fcd)return false;if(typeof popFree==="function"&&!popFree())return false;
  if(document.hidden||$("evpM")||$("updM")||$("hlpM")||$("lrnM")||document.querySelector(".uidlg"))return false;const m=$("nxM");if(m&&!m.hidden)return false;
  if(typeof R2!=="undefined"&&R2&&R2.ph==="battle"&&!R2.done)return false}catch(e){return false}return true}
function evpShow(o){
  const M=document.createElement("div");M.id="evpM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");M.setAttribute("aria-label","Evento");
  M.innerHTML='<div class="evpbox '+(o.cls||"")+'"><button type="button" class="evpx" aria-label="Cerrar">✕</button><div class="evpic">'+o.ic+'</div><small class="evpk">'+esc(o.kind)+'</small><h2>'+esc(o.t)+'</h2><p>'+esc(o.d)+'</p>'+(o.when?'<p class="evpw">⏰ '+esc(o.when)+'</p>':'')+
    '<div class="evpb">'+(o.go?'<button type="button" class="red" data-evp="go">'+esc(o.goT)+'</button>':'')+'<button type="button" class="alt" data-evp="x">¡Entendido!</button></div></div>';
  document.body.appendChild(M);try{snd("lvl")}catch(e){}
  const close=()=>{M.remove();document.removeEventListener("keydown",kd,true)},kd=e=>{if(e.key==="Escape"){e.stopPropagation();close()}};
  M.addEventListener("click",e=>{const b=e.target.closest("[data-evp]");if(e.target===M||e.target.closest(".evpx")||(b&&b.dataset.evp==="x")){close();return}if(b&&b.dataset.evp==="go"){close();try{o.go()}catch(x){}}});
  document.addEventListener("keydown",kd,true);
}
// lo que está pasando ahora y aún no has visto
function evpNext(){
  const out=[];
  try{(hhNow()||[]).forEach(s=>{const k="hh"+s.k+s.a;if(evpSeen()[k])return;const i=hhInfo(s);
    out.push(s.k==="cd"?{k,cls:"cd",ic:ico(s.mon,96),kind:"🎉 DÍA DE LA COMUNIDAD",t:"¡Hoy es el Día de la Comunidad de "+s.mon[0]+"!",d:i[1],when:"Hasta las "+evpHora(s.b)+" (quedan "+hhFmt(s.b-Date.now())+")",goT:"🎰 Ir al Gacha",go:()=>{if(typeof gmOpen==="function"&&gmOn())gmOpen("stage")}}
      :{k,cls:"hh",ic:(i[0].match(/^\S+/)||["🎉"])[0],kind:"⏰ ¡EMPIEZA LA HORA FELIZ!",t:i[0].replace(/^\S+\s*/,""),d:i[1],when:"De "+evpHora(s.a)+" a "+evpHora(s.b)+" (quedan "+hhFmt(s.b-Date.now())+")",goT:"Ver horas felices",go:()=>hubOpen("act","hhP")})})}catch(e){}
  try{const e=typeof evNow==="function"?evNow():null;if(e){const k="ev"+e.n+new Date().getFullYear();if(!evpSeen()[k]){const tp=(e.t||[]).map(t=>(EM[t]||"")+" "+(TIPO[t]||t)).join(" y ");
    out.push({k,cls:"ev",ic:(e.n.match(/^\S+/)||["🎊"])[0],kind:"🎊 EVENTO DE TEMPORADA",t:e.n.replace(/^\S+\s*/,""),d:"Durante el evento salen más Pokémon de tipo "+tp+" en las tiradas.",goT:"🎰 Ir al Gacha",go:()=>{if(typeof gmOpen==="function"&&gmOn())gmOpen("stage")}})}}}catch(e){}
  return out[0]||null}
setInterval(()=>{if(typeof S==="undefined"||!S||!evpFree())return;const o=evpNext();if(!o)return;evpMark(o.k);evpShow(o)},4000);
