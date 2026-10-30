// =====================================================================================
// HABILIDADES DE LOS POKÉMON
// =====================================================================================
const ABD=__ABIL__;
const ABDESC={22:"Al entrar en combate baja el Ataque de los rivales",26:"Inmune a los ataques de tipo Tierra",11:"Los ataques de tipo Agua le curan en vez de dañarle",10:"Los ataques de tipo Eléctrico le curan en vez de dañarle",18:"Inmune al Fuego; al recibirlo, potencia sus ataques de Fuego",
 65:"Potencia sus ataques de Planta cuando le quedan pocos PS",66:"Potencia sus ataques de Fuego cuando le quedan pocos PS",67:"Potencia sus ataques de Agua cuando le quedan pocos PS",68:"Potencia sus ataques de Bicho cuando le quedan pocos PS",
 9:"Puede paralizar al rival que le golpee",38:"Puede envenenar al rival que le golpee",49:"Puede quemar al rival que le golpee",27:"Puede envenenar, paralizar o dormir al rival que le golpee",
 5:"Con los PS al máximo, aguanta siempre un golpe con 1 PS",47:"Recibe la mitad de daño de Fuego y Hielo",37:"Sus ataques físicos son mucho más fuertes",74:"Sus ataques físicos son mucho más fuertes",62:"Pega más fuerte si tiene un problema de estado (y las quemaduras no le debilitan)",
 3:"Su Velocidad sube al final de cada turno",144:"Recupera PS al retirarse del combate",30:"Se cura de los problemas de estado al retirarse",101:"Potencia los movimientos débiles (potencia 60 o menos)",91:"Sus ataques de su propio tipo pegan todavía más fuerte",
 24:"Quien le golpee pierde PS",160:"Quien le golpee pierde PS",15:"No puede dormirse",72:"No puede dormirse",17:"No puede envenenarse",7:"No puede paralizarse",69:"No sufre daño de retroceso",136:"Recibe la mitad de daño con los PS al máximo",105:"Más probabilidad de golpe crítico"};
const abName=a=>ABD.n[a]||"habilidad";
function abList(p){const id=window._spr&&window._spr[p[0]];return (id&&ABD.ab[id])||[]}
function abDefault(p){const L=abList(p);return L[0]||0}
function abValid(n,a){return PM[n]&&abList(PM[n]).includes(a)}
function abOf(n){const a=S.abil&&S.abil[n];return a&&abValid(n,a)?a:abDefault(PM[n]||[n])}
{const _bm=beMon;beMon=function(p,l,mh,ids,pps){const m=_bm(p,l,mh,ids,pps);try{m.ab=abDefault(p)}catch(e){m.ab=0}return m}}
// ficha: elegir la habilidad
{const _pv=pkView;pkView=function(n,sh){_pv(n,sh);try{if(!(S.owned[n]>0))return;const w=document.querySelector("#pkv .fich");if(!w)return;const L=abList(PM[n]);if(!L.length)return;const cur=abOf(n);
  const d=document.createElement("div");d.className="fichr fabil";d.innerHTML='<span>Habilidad</span><div><div class="fichin"><select id="fAbil" data-fn="'+esc(n)+'">'+L.map(a=>'<option value="'+a+'"'+(a===cur?' selected':'')+'>'+esc(abName(a))+(ABDESC[a]?'':' (sin efecto todavía)')+'</option>').join("")+'</select></div><small class="mut" id="fAbilD">'+esc(ABDESC[cur]||"Esta habilidad todavía no tiene efecto en los combates del juego.")+'</small></div>';
  const nat=[...w.querySelectorAll(".fichr")].find(x=>/Naturaleza/.test(x.textContent));if(nat)nat.after(d);else w.appendChild(d)}catch(e){console.error(e)}}}
document.addEventListener("change",e=>{if(e.target&&e.target.id==="fAbil"){const n=e.target.dataset.fn,a=+e.target.value;if(fcd){toast("Termina el combate antes de cambiar la habilidad.");e.target.value=abOf(n);return}if(!abValid(n,a))return;S.abil=S.abil||{};S.abil[n]=a;save();snd("ui");const dd=$("fAbilD");if(dd)dd.textContent=ABDESC[a]||"Esta habilidad todavía no tiene efecto en los combates del juego.";toast("✨ "+nk(n)+" ahora tiene la habilidad "+abName(a))}});
