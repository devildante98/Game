// =====================================================================================
// BUSCAPELEA (como en la saga): úsalo en una ruta y los entrenadores a los que ya ganaste querrán la revancha,
// con Pokémon más fuertes. Hay que cargarlo andando 100 pasos entre uso y uso.
// =====================================================================================
const VS_STEP=100;
const vsLeft=()=>{try{const f=stSt().f;return Math.max(0,VS_STEP-((EX.steps|0)-(f.vsAt==null?-1e9:f.vsAt|0)))}catch(e){return 0}};
function vsUse(){const f=stSt().f;if(EX.M&&EX.M.base==="F"){exSay(["Aquí dentro no hay entrenadores a los que retar."]);return}
  const left=vsLeft();if(left>0){exSay(["La batería del Buscapelea se está cargando…","Anda "+left+" pasos más y podrás volver a usarlo."]);return}
  const L=EX.npcs.filter(n=>!n.story&&n.t&&n.t.length&&n.beat);snd("lvl");EX.vsT=performance.now();
  if(!L.length){exSay(["¡Bip, bip! El Buscapelea busca entrenadores…","…pero aquí no hay nadie a quien ya hayas ganado."]);return}
  f.vsAt=EX.steps|0;save();let w=L.filter(()=>Math.random()<.6);if(!w.length)w=[L[Math.floor(Math.random()*L.length)]];
  w.forEach(n=>{n.beat=false;n.rematch=1;n.txt=exPick(["¡Te estaba esperando! ¡Quiero la revancha!","¡He entrenado muchísimo desde la última vez! ¡Combate!","¡Esta vez no pienso perder!","¡Revancha! ¡Mis Pokémon son mucho más fuertes ahora!"])});
  exSay(["¡Bip, bip! El Buscapelea busca entrenadores…","¡"+(w.length===1?"Un entrenador quiere":w.length+" entrenadores quieren")+" la revancha!"])}
// revancha: equipo más fuerte (+3 niveles y un Pokémon más)
{const _t=exTrainerBattle;exTrainerBattle=function(n){if(!n||!n.rematch)return _t.apply(this,arguments);
  if(!exTeamOk()){exSay(["Tus Pokémon están debilitados. ¡Vuelve cuando estén curados!"]);return}
  const names=(S.team||[]).filter(x=>x&&S.owned[x]),lead=Math.min(...names.map(x=>lvd(x).l)),cap=lvCap(),lv=Math.max(3,Math.min(cap,lead+3)-1);
  const sp=n.t.filter(x=>PM[x]);if(sp.length<6)sp.push(sp[sp.length-1]);
  const team=sp.map((x,i)=>{const l=clampL(lv+Math.min(i,3));return mkEnemy(stageFor(PM[x],l)||PM[x],l)});
  EX.trans={t:0,d:1300,k:"trainer",done:()=>exBattle({eteam:team,trainer:n.n,tsrc:{k:exTrKey(n.n),n:n.n}},n)}}}
// al ganar la revancha, el entrenador vuelve a quedar vencido
setInterval(()=>{try{(EX.npcs||[]).forEach(n=>{if(n.rematch&&n.beat)n.rematch=0})}catch(e){}},700);
// los que quieren la revancha levantan la mano (una «!» que bota)
{const _d=exDraw;exDraw=function(ts){const r=_d.apply(this,arguments);try{if(!EX.cv||EX.title)return r;const L=(EX.npcs||[]).filter(n=>n.rematch&&!n.beat);const g=EX.cv.getContext("2d"),cam=EX.cam||[0,0];g.setTransform(EXS,0,0,EXS,0,0);
  L.forEach(n=>{const X=Math.round(n.px*EXTL-cam[0]+16),Y=Math.round(n.py*EXTL-cam[1]-26+Math.abs(Math.sin(ts/220))*-3);g.fillStyle="#222";g.fillRect(X-6,Y-12,12,15);g.fillStyle="#ffe040";g.fillRect(X-5,Y-11,10,13);g.fillStyle="#c83020";g.fillRect(X-1,Y-9,3,7);g.fillRect(X-1,Y-1,3,2)});
  if(EX.vsT){const e=(performance.now()-EX.vsT)/900;if(e>1)EX.vsT=0;else{const X=EX.px*EXTL-cam[0]+16,Y=EX.py*EXTL-cam[1]+16;g.strokeStyle="rgba(255,224,64,"+(1-e)+")";g.lineWidth=3;g.beginPath();g.arc(X,Y,12+e*140,0,7);g.stroke()}}}catch(x){}return r}}
// la Enfermera de Pueblo Brisa te lo regala al ganar tu primera medalla
setInterval(()=>{try{if(!EX.on||EX.title||EX.cut||EX.dlg||EX.battle||(typeof fcd!=="undefined"&&fcd))return;const f=stSt().f;if(f.vs||!xbHas(0))return;f.vs=1;save();
  stRun(async()=>{snd("lvl");await sSay(["📦 Te llega un paquete de la Enfermera del Centro Pokémon de Pueblo Brisa.","«¡Enhorabuena por tu primera medalla! Te mando un Buscapelea para que entrenes todavía más.»","¡Has recibido el Buscapelea!","Úsalo en una ruta desde la Mochila (Objetos de campo): los entrenadores a los que ya ganaste te pedirán la revancha."])})}catch(e){}},3000);
