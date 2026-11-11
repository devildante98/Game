// =====================================================================================
// TICKETS DE EXPLORACIÓN: una cartera aparte de la del juego normal.
// En Exploración solo se gastan los tickets ganados en Exploración (combates, historia, ventas en la tienda).
// Los tickets del juego normal no se pueden usar aquí, ni al revés.
// =====================================================================================
const XT0=30000;   // tickets para empezar
function xT(){const X=xgData();if(typeof X.t!=="number"||!isFinite(X.t)||X.t<0){let b=0;try{b=typeof xbCount==="function"?xbCount():0}catch(e){}X.t=XT0+b*20000}return X.t}
function xTadd(n){xT();S.xg.t=Math.max(0,Math.round(S.xg.t+(+n||0)))}
const xTtxt=n=>fmt(Math.round(n))+" 🎟️";
// premios de la historia: los tickets van a la cartera de Exploración y los objetos a la mochila de Exploración
sGive=function(r){const t=Math.round(r.t||0);if(t)xTadd(t);if(r.it&&Object.keys(r.it).length)xgRun(()=>{grant({it:r.it})});save();try{render()}catch(e){}snd("lvl");
  return [t?xTtxt(t):""].concat(Object.keys(r.it||{}).map(k=>r.it[k]+" "+IN(k))).filter(x=>x).join(" + ")};
// premio por ganar combates en Exploración, como el dinero de los juegos
{const _eb=exBattle;exBattle=function(cfg,npc){const pr=_eb.apply(this,arguments);try{if(EX.battle){let rw;
    if(cfg&&cfg.eteam&&cfg.eteam.length){const sl=cfg.eteam.reduce((a,m)=>a+(m.l|0),0);rw=Math.round(sl*(cfg.trainer?60:30))}
    else{const L=(S.team||[]).filter(n=>n&&S.owned[n]).map(n=>lvd(n).l);rw=Math.round((L.length?Math.max(...L):5)*25)}
    EX.battle.rw=Math.max(50,rw)}}catch(e){}return pr}}
// Centro Pokémon de Exploración: gratis, como en los juegos
STX.enf=()=>stRun(async()=>{
  await sSay(S_("Enfermera","¡Hola! Te damos la bienvenida al "+(EX.M&&EX.M.n&&EX.M.n!=="Centro Pokémon"?EX.M.n:"Centro Pokémon de Pueblo Brisa")+"."));
  const i=await sChoice("¿Curar a tus Pokémon?",[{t:"Sí, por favor"},{t:"No, gracias"}]);
  if(i!==0){await sSay(S_("Enfermera","¡Esperamos verte pronto!"));return}
  try{qEv("heal")}catch(e){}
  await sSay(S_("Enfermera","¡Muy bien! Deja tus Poké Balls aquí un momento…"));snd("heal");try{healJingle()}catch(e){}await sFade("fade",350);stHeal();await sW(900);await sFade("fadein",450);
  await sSay(S_("Enfermera","¡Tus Pokémon están totalmente recuperados! ¡Esperamos verte pronto!"))});
// marcador de tickets de Exploración en la pantalla del mapa
setInterval(()=>{const sc=document.querySelector("#explPB .exscr");if(!sc)return;let e=$("exMoney");
  if(!e){e=document.createElement("div");e.id="exMoney";e.className="exmoney";e.title="Tickets de Exploración (aparte de los del juego normal)";sc.appendChild(e)}
  const t="🎟️ "+fmt(xT());if(e.textContent!==t)e.textContent=t},500);
