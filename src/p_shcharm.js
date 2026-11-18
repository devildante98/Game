// =====================================================================================
// AMULETO IRIS (Exploración)
// Como en los juegos: al completar la Pokédex de Exploración (todas las especies comunes, raras y épicas, las que
// pueden aparecer en la hierba, el agua y la pesca; los legendarios y las formas especiales no cuentan), la Profesora
// Vega te llama y te da el Amuleto Iris. Con él, los Pokémon variocolor salen el triple en Exploración (hierba alta,
// surf y pesca). Cuentan los que has capturado alguna vez (aunque ya no los tengas).
// =====================================================================================
const SHC_LIST=P.filter(p=>p[2]==="C"||p[2]==="R"||p[2]==="E");
function shcK(){try{return S&&S.shc?3:1}catch(e){return 1}}
function shcCount(){return xgRun(()=>{let n=0;const o=S.owned||{},r=S.reg||{};for(const p of SHC_LIST)if((o[p[0]]|0)>0||r[p[0]])n++;return n})}
// en cuanto completes la Pokédex (estando en Exploración y sin nada en marcha), la profesora te llama
setInterval(()=>{try{if(typeof S==="undefined"||!S||S.shc||typeof EX==="undefined"||!EX.on||EX.title||EX.dlg||EX.trans||EX.cut||(typeof fcd!=="undefined"&&fcd))return;
  if(shcCount()<SHC_LIST.length)return;S.shc=1;save();if(window.cloudFlush)try{window.cloudFlush(true)}catch(e){}snd("lvl");
  exSay(["📞 ¡Bip, bip! Te llama la Profesora Vega.","«¡No me lo puedo creer! ¡Has completado la Pokédex de Exploración! Has registrado las "+SHC_LIST.length+" especies.»","«¡Qué talento tienes con los Pokémon! Toma, te lo has ganado: es el objeto más especial de mi laboratorio.»","✨ ¡Has recibido el Amuleto Iris!","Desde ahora, los Pokémon variocolor aparecerán tres veces más a menudo en la hierba alta, al hacer surf y al pescar."])}catch(e){}},2500);
