// =====================================================================================
// PESCA (como en la saga): Caña Vieja (Pueblo Brisa), Caña Buena (Puerto Escarcha) y Súper Caña (Puerto Celeste).
// Mira al agua y pulsa A: lanzas la caña y, cuando salga la «!», pulsa A rápido para que no se escape.
// =====================================================================================
const FISH_RN=["","Caña Vieja","Caña Buena","Súper Caña"];
const fRod=()=>{try{return stSt().f.rod|0}catch(e){return 0}};
const FISH_TZ={pueblo:"pra",pe:"nie",pn:"nie",pb:"vol",vv:"vol",ct:"ciu",pc:"mar",cl:"ciu"};
const FISH_G={pra:["Poliwag","Goldeen","Magikarp","Psyduck","Barboach"],bos:["Poliwag","Goldeen","Magikarp"],mar:["Krabby","Horsea","Shellder","Tentacool","Staryu","Magikarp"],
  nie:["Seel","Shellder","Horsea","Magikarp","Spheal"],vol:["Barboach","Goldeen","Magikarp","Tentacool"],ciu:["Chinchou","Remoraid","Horsea","Magikarp"],cue:["Goldeen","Magikarp","Barboach"]};
const FISH_S={pra:["Seaking","Poliwhirl","Gyarados","Corphish","Whiscash"],mar:["Kingler","Seadra","Starmie","Gyarados","Wailmer","Sharpedo"],nie:["Dewgong","Cloyster","Gyarados","Sealeo","Seadra"],
  vol:["Whiscash","Seaking","Gyarados","Tentacruel"],ciu:["Lanturn","Octillery","Seadra","Gyarados"]};
const FISH_RARE=["Dratini","Lapras","Feebas"];
function fishZone(){const m=EX.map||"";return FISH_TZ[m]||(EX.M&&EX.M.z)||"pra"}
function fishMon(rod){let n=null;
  try{const R=typeof rnD==="function"?rnD():null;if(R&&R.w&&typeof rndPool==="function"){const P=rndPool(!!R.l),p=P[Math.floor(Math.random()*P.length)];if(p)n=p[0]}}catch(e){}
  const z=fishZone(),pick=L=>{L=(L||[]).filter(q=>PM[q]);return L[Math.floor(Math.random()*L.length)]};
  if(!n){if(rod<=1)n=Math.random()<.8?"Magikarp":pick((FISH_G[z]||FISH_G.pra).slice(0,2));
    else if(rod===2)n=pick(FISH_G[z]||FISH_G.pra);
    else n=Math.random()<.05?pick(FISH_RARE):pick(FISH_S[z]||FISH_S.pra)}
  n=n&&PM[n]?n:"Magikarp";const b=sLv(0),lv=clampL(rod<=1?Math.max(2,Math.min(b,10)+Math.floor(Math.random()*3)-1):rod===2?Math.max(3,b-3+Math.floor(Math.random()*3)):b-1+Math.floor(Math.random()*4));
  const m=mkEnemy(stageFor(PM[n],lv)||PM[n],lv);if(Math.random()<SHINY_W)m.sh=1;return m}
// esperar a que pulses A en cuanto pica
function fishReact(ms){return new Promise(res=>{let done=false;const fin=v=>{if(done)return;done=true;document.removeEventListener("keydown",kd,true);EX.fishWait=null;clearTimeout(t);res(v)};
  const kd=e=>{const a=typeof exAct==="function"?exAct(e.key):"";if(a==="a"||e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();fin(true)}};
  document.addEventListener("keydown",kd,true);EX.fishWait=fin;const t=setTimeout(()=>fin(false),ms)})}
async function fishRun(x,y){const rod=fRod();if(!exTeamOk()){await sSay(["Tus Pokémon están demasiado cansados. Cúralos antes de ponerte a pescar."]);return}
  EX.fish={x:x,y:y,t0:performance.now(),bite:0};snd("ui");await sSay(["Lanzas la "+FISH_RN[rod]+" al agua…"]);
  await sW(1300+Math.random()*2400);if(!EX.fish)return;
  if(Math.random()<.18){EX.fish=null;await sSay(["…","No pica nada. Prueba otra vez o en otro sitio."]);return}
  EX.fish.bite=performance.now();snd("lvl");const ok=await fishReact(rod>=3?1000:1150);EX.fish=null;
  if(!ok){await sSay(["¡Oh, no! Se ha escapado…","(Pulsa A en cuanto veas la «!» sobre tu cabeza.)"]);return}
  await sSay(["¡Ha picado algo!"]);await sBattle({eteam:[fishMon(rod)]},"wild")}
// mirar el agua: pescar, navegar o nada
{const _i=exInteract;exInteract=function(){if(EX.fishWait){EX.fishWait(true);return}
  try{if(!EX.dlg&&!EX.mv&&!EX.trans&&!EX.cut&&EX.M&&EX.M.base!=="F"&&fRod()){const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy;
    if(exAt(x,y)==="~"&&!EX.npcs.some(n=>n.px===x&&n.py===y)){
      if(EX.surf||!hmHas("surf")){stRun(()=>fishRun(x,y));return}
      stRun(async()=>{const c=await sChoice("El agua está tranquila. ¿Qué quieres hacer?",[{t:"🎣 Pescar"},{t:"🌊 Surf"},{t:"Nada"}]);
        if(c===0)await fishRun(x,y);else if(c===1){const u=hmUser("surf");snd("lvl");await sSay(["¡"+hmName(u)+" ha usado Surf!"]);EX.surf=1;await sPStep(EX.f)}});return}}}catch(e){console.error(e)}
  return _i.apply(this,arguments)}}
// la caña, el sedal y el corcho; y la «!» cuando pica
{const _d=exDraw;exDraw=function(ts){const r=_d.apply(this,arguments);try{const F=EX.fish;if(!F||!EX.cv)return r;const g=EX.cv.getContext("2d"),cam=EX.cam||[0,0],now=performance.now();g.setTransform(EXS,0,0,EXS,0,0);
  const px=EX.px*EXTL-cam[0]+16,py=EX.py*EXTL-cam[1]+8,[dx,dy]=EXDIR[EX.f],hx=Math.round(px+dx*12),hy=Math.round(py+dy*10+2),bx=Math.round(F.x*EXTL-cam[0]+16),by=Math.round(F.y*EXTL-cam[1]+16+(F.bite?3:Math.sin(now/300)*1.5));
  g.strokeStyle="#5a3a1c";g.lineWidth=2;g.beginPath();g.moveTo(px+dx*4,py+2);g.lineTo(hx,hy);g.stroke();
  g.strokeStyle="rgba(255,255,255,.85)";g.lineWidth=1;g.beginPath();g.moveTo(hx,hy);g.quadraticCurveTo((hx+bx)/2,Math.max(hy,by)+6,bx,by);g.stroke();
  g.fillStyle="#1c1c26";g.fillRect(bx-3,by-3,6,6);g.fillStyle="#e83a50";g.fillRect(bx-2,by-2,4,2);g.fillStyle="#fff";g.fillRect(bx-2,by,4,2);
  if(F.bite){g.fillStyle="rgba(255,255,255,.7)";g.fillRect(bx-7,by+3,4,1);g.fillRect(bx+3,by+3,4,1);
    const X=Math.round(px),Y=Math.round(py-30+Math.sin(now/60)*1.5);g.fillStyle="#222";g.fillRect(X-8,Y-17,16,22);g.fillStyle="#fff";g.fillRect(X-7,Y-16,14,20);g.fillStyle="#e83a50";g.fillRect(X-2,Y-13,4,10);g.fillRect(X-2,Y-1,4,3)}}catch(e){}return r}}
// ---------- los pescadores que te dan las cañas ----------
const FISH_NPC={pueblo:["fish1",30,11,"d",1],pe:["fish2",31,11,"d",2],pc:["fish3",31,11,"d",3]};
{const _n=stNPCs;stNPCs=function(m){const L=_n.apply(this,arguments);try{const F=FISH_NPC[m];if(F&&stSt().s>=2){const[id,x,y,f]=F;
  L.push({sid:id,x:x,y:y,f:f,n:"Pescador",look:chClassLook("fisherman",id),t:[],sight:0,txt:"",id:"sto:"+m+":"+id,story:1,still:1,beat:true,px:x,py:y,f0:f})}}catch(e){console.error(e)}return L}}
function fishGive(lv,hi){return stRun(async()=>{const f=stSt().f,n=stN(["","fish1","fish2","fish3"][lv]);if(n)sFaceTo(n);
  if(fRod()>=lv){await sSay(S_("Pescador",...(lv===1?["¿Qué tal pican? Recuerda: en cuanto veas la «!», ¡pulsa A rápido!","Con la Caña Vieja casi todo son Magikarp… pero un Magikarp bien criado da muchas sorpresas."]
    :lv===2?["Con la Caña Buena pican Pokémon distintos según el sitio: no es lo mismo el mar que un lago.","¡Prueba a pescar en todas las regiones!"]:["Con la Súper Caña pican los Pokémon más fuertes… y alguno muy raro.","Dicen que en estas aguas vive un Pokémon que casi nadie ha visto."])));return}
  await sSay(S_("Pescador",...hi));snd("lvl");f.rod=Math.max(fRod(),lv);save();
  await sSay(["¡Has recibido la "+FISH_RN[lv]+"!","Mira hacia el agua y pulsa A para pescar."]);
  await sSay(S_("Pescador","Cuando pique, saldrá una «!» encima de tu cabeza. ¡Pulsa A rápido o se escapará!"))})}
STX.fish1=()=>fishGive(1,["¡Hola! ¿A que es bonito este estanque?","Yo vengo cada mañana a pescar. Es lo más relajante del mundo.","Toma, te regalo mi Caña Vieja. ¡Ya me he comprado una nueva!"]);
STX.fish2=()=>fishGive(2,["¡Eh, tú! Tienes pinta de que te gusta pescar.","Aquí en el puerto pican Pokémon muy distintos a los del interior.","Llévate esta Caña Buena. ¡Con ella pescarás mucho más que Magikarp!"]);
STX.fish3=()=>fishGive(3,["Llevo toda la vida pescando en Puerto Celeste. Ya he visto de todo…","Veo que eres una persona entrenadora de verdad. Te mereces esto.","Es mi Súper Caña. Con ella pican los Pokémon más fuertes del mar."]);
