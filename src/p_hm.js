// =====================================================================================
// MO DE EXPLORACIÓN (como en la saga)
// · Corte (j): arbolitos que tapan caminos y rincones.  · Golpe Roca (r): rocas agrietadas.
// · Fuerza (v): rocas enormes que se empujan.           · Surf: navegar por el agua (~), con Pokémon acuáticos.
// · Destello: ilumina las cuevas oscuras (Cueva Roca y Calle Victoria).
// Cada Líder de Gimnasio entrega su MO al ganarle; para usarla, un Pokémon del equipo la «aprende» al momento.
// =====================================================================================
const HM={cut:{n:"Corte",mo:"MO01",g:0,ty:["grass","bug","steel","dark","dragon","fighting","normal"]},
  flash:{n:"Destello",mo:"MO05",g:0,ty:["electric","psychic","fairy","fire","normal"]},
  surf:{n:"Surf",mo:"MO03",g:1,ty:["water","ice","dragon","normal"]},
  str:{n:"Fuerza",mo:"MO04",g:2,ty:["fighting","rock","ground","steel","normal"]},
  rock:{n:"Golpe Roca",mo:"MO06",g:3,ty:["fighting","rock","ground","steel","normal"]},
  fly:{n:"Vuelo",mo:"MO02",g:4,ty:["flying","dragon","normal"]}};
const HM_DARK={cueva:1,victoria:1};
const hmHas=k=>{try{return xbHas(HM[k].g)}catch(e){return false}};
function hmUser(k){const T=xgTeam(),ty=HM[k].ty;for(const t of ty){const n=T.find(n=>{try{return tys(PM[n]).includes(t)}catch(e){return false}});if(n)return n}return T[0]||"Tu Pokémon"}
const hmName=n=>{try{const m=xgRun(()=>S.mote&&S.mote[n]);return m||n}catch(e){return n}};
function hmBaseCh(){const b=EX.M&&EX.M.base;return b==="c"?"c":b==="s"?"s":"."}
const hmGymTxt=k=>{const G=XGYM[HM[k].g];return G?" Te la da "+G.n+" al ganar la "+G.b+".":""};
// ---------- bloqueos ----------
{const _b=exBlocked;exBlocked=function(x,y){const c=exAt(x,y);
  if(c==="j"||c==="r"||c==="v"){if(c==="v")hmPush(x,y);return true}
  if(c==="~"&&EX.surf){if(EX.npcs.some(n=>n.px===x&&n.py===y))return true;return false}
  return _b.apply(this,arguments)}}
// empujar una roca de Fuerza (solo la que tienes delante, al intentar andar hacia ella)
function hmPush(x,y){try{if(EX.strength!==EX.map||EX.mv||EX.cut||EX.dlg)return;const[dx,dy]=EXDIR[EX.f];if(x!==EX.x+dx||y!==EX.y+dy)return;const now=performance.now();if(now-(EX.pushT||0)<380)return;
  const nx=x+dx,ny=y+dy,c=exAt(nx,ny),M=EX.M;if(!"c.,s".includes(c)||(M.w&&M.w[c])||EX.npcs.some(n=>n.px===nx&&n.py===ny))return;
  EX.pushT=now;EX.grid[ny][nx]="v";EX.grid[y][x]=hmBaseCh();snd("ui")}catch(e){}}
// ---------- usar las MO al mirar algo ----------
async function hmAsk(k,intro){if(!hmHas(k)){await sSay([...intro,"(Necesitas la "+HM[k].mo+" "+HM[k].n+"."+hmGymTxt(k)+")"]);return false}
  await sSay(intro);const c=await sChoice("¿Quieres usar "+HM[k].n+"?",[{t:"Sí"},{t:"No"}]);if(c!==0)return false;
  const u=hmUser(k);snd("lvl");await sSay(["¡"+hmName(u)+" ha usado "+HM[k].n+"!"]);return true}
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&!EX.cut&&EX.M&&EX.M.base!=="F"){const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy,c=exAt(x,y);
  if(c==="j"){stRun(async()=>{if(await hmAsk("cut",["Este arbolito parece que se puede cortar."])){await hmPoof(x,y);EX.grid[y][x]=hmBaseCh()}});return}
  if(c==="r"){stRun(async()=>{if(await hmAsk("rock",["Es una roca agrietada. Parece que se podría romper."])){await hmPoof(x,y);EX.grid[y][x]=hmBaseCh()}});return}
  if(c==="v"){if(EX.strength===EX.map){exSay(["Ya puedes mover las rocas grandes. ¡Empújalas andando hacia ellas!"]);return}
    stRun(async()=>{if(await hmAsk("str",["Es una roca enorme. Un Pokémon muy fuerte podría moverla."])){EX.strength=EX.map;await sSay(["¡Ahora puedes empujar las rocas grandes!"])}});return}
  if(c==="~"&&!EX.surf&&!EX.npcs.some(n=>n.px===x&&n.py===y)){stRun(async()=>{if(await hmAsk("surf",["El agua está tranquila y es de un azul precioso."])){EX.surf=1;await sPStep(EX.f)}});return}}}catch(e){console.error(e)}
  return _i.apply(this,arguments)}}
async function hmPoof(x,y){EX.poof={x:x,y:y,t0:performance.now()};snd("hit");await sW(380);EX.poof=null}
// al pisar tierra se deja de navegar; en el agua salen Pokémon acuáticos
const HM_WATER={pra:["Magikarp","Poliwag","Goldeen","Psyduck","Marill","Wooper"],bos:["Magikarp","Poliwag","Psyduck","Lotad"],mar:["Tentacool","Magikarp","Shellder","Staryu","Krabby","Horsea","Wingull"],
  nie:["Seel","Spheal","Magikarp","Shellder","Psyduck","Swinub"],vol:["Magikarp","Barboach","Tentacool","Wooper"],ciu:["Magikarp","Chinchou","Tentacool","Horsea","Goldeen"],cue:["Magikarp","Zubat","Goldeen"]};
const HM_RARE={mar:"Lapras",nie:"Lapras",pra:"Dratini",ciu:"Lanturn"};
function hmWaterMon(){try{const R=typeof rnD==="function"?rnD():null;if(R&&R.w&&typeof rndPool==="function"){const P=rndPool(!!R.l);const p=P[Math.floor(Math.random()*P.length)];if(p)return p[0]}}catch(e){}
  const z=(EX.M&&EX.M.z)||(EX.M&&EX.M.music==="town"?"pra":"pra"),L=(HM_WATER[z]||HM_WATER.pra).filter(n=>PM[n]);if(Math.random()<.03&&HM_RARE[z]&&PM[HM_RARE[z]])return HM_RARE[z];return L[Math.floor(Math.random()*L.length)]||"Magikarp"}
{const _a=exArrive;exArrive=function(){const r=_a.apply(this,arguments);try{if(EX.surf&&!EX.cut){const c=exAt(EX.x,EX.y);
  if(c!=="~")EX.surf=0;
  else if(!EX.dlg&&!EX.trans&&!(typeof fdRep==="function"&&fdRep())&&EX.steps-(EX.encAt||-99)>=6&&Math.random()<1/14){EX.encAt=EX.steps;if(!exTeamOk()){exSay(["¡Algo se mueve bajo el agua!","…pero tus Pokémon están demasiado cansados para luchar."]);return r}
    const n=hmWaterMon(),lv=clampL(sLv(0)+Math.floor(Math.random()*4)-2);const m=mkEnemy(stageFor(PM[n],lv)||PM[n],lv);if(Math.random()<SHINY_W)m.sh=1;
    EX.keys={};EX.kst=[];snd("wild");EX.trans={t:0,d:1300,k:"wild",done:()=>exBattle({eteam:[m]})}}}}catch(e){console.error(e)}return r}}
// al cambiar de mapa se baja del agua y la Fuerza se apaga (como en los juegos)
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{EX.surf=0;EX.strength=null;EX.lit=null;if(HM_DARK[m]){let n=0;const tk=()=>{if(EX.map!==m||EX.lit)return;if(EX.title||EX.cut||EX.dlg||EX.trans){if(++n<60)setTimeout(tk,250);return}hmDark()};setTimeout(tk,900)}}catch(e){}return r}}
function hmDark(){stRun(async()=>{if(!hmHas("flash")){await sSay(["Está muy oscuro… Casi no ves nada.","(Con la "+HM.flash.mo+" "+HM.flash.n+" podrías iluminar la cueva."+hmGymTxt("flash")+")"]);return}
  await sSay(["Está oscurísimo aquí dentro…"]);const c=await sChoice("¿Quieres usar Destello?",[{t:"Sí"},{t:"No"}]);if(c!==0)return;
  const u=hmUser("flash");snd("lvl");EX.flashT=performance.now();await sSay(["¡"+hmName(u)+" ha usado Destello!","¡La cueva se ha iluminado!"]);EX.lit=EX.map})}
// ---------- avisos: el Líder te entrega su MO ----------
setInterval(()=>{try{if(!EX.on||EX.title||EX.cut||EX.dlg||EX.trans||EX.battle||(typeof fcd!=="undefined"&&fcd))return;const f=stSt().f;
  const nw=Object.keys(HM).filter(k=>hmHas(k)&&!f["mo_"+k]);if(!nw.length)return;nw.forEach(k=>f["mo_"+k]=1);save();
  stRun(async()=>{snd("lvl");for(const k of nw){const G=XGYM[HM[k].g];await sSay(["¡Has recibido la "+HM[k].mo+" "+HM[k].n+"!"+(G?" (regalo de "+G.n+")":""),
    {cut:"Con Corte puedes talar los arbolitos que tapan algunos caminos. Mira el arbolito y pulsa A.",flash:"Con Destello puedes iluminar las cuevas oscuras.",surf:"Con Surf puedes navegar por el agua: mira hacia el agua y pulsa A. ¡En el agua viven otros Pokémon!",
     str:"Con Fuerza puedes empujar las rocas enormes andando hacia ellas.",rock:"Con Golpe Roca puedes romper las rocas agrietadas.",fly:"Con Vuelo puedes viajar al instante a cualquier pueblo que ya hayas visitado: abre el Mapa y elige el pueblo."}[k]])}})}catch(e){}},1500);
// ---------- dibujo ----------
function hmGround(x,y){const b=hmBaseCh(),v=Math.floor(exRnd(x,y,7)*4),k="HMG"+b+v+((EX.M&&EX.M.music)||"");if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  if(b==="c")g.drawImage(xCave(v),0,0);else if(b==="s")g.drawImage(xSand(0,v),0,0);else xGrassBase(g,v);return XG[k]=c}
{const _g=xGround;xGround=function(x,y,fr){try{const c=exAt(x,y);if((c==="j"||c==="r"||c==="v")&&EX.M&&EX.M.base!=="F")return hmGround(x,y)}catch(e){}return _g.apply(this,arguments)}}
function hmObjJ(){const k="HMJ";if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d"),O="#103a24";xdisc(g,16,44,10,3,"rgba(10,40,20,.28)");
  X2(g,7,17,2,5,O);X2(g,7,17,1,5,"#8a5a2c");X2(g,8,17,1,5,"#6a4020");
  const W=[2,4,5,6,6,6,6,5,4];for(let i=0;i<W.length;i++){const w=W[i],y=8+i;X2(g,8-w-1,y,w*2+2,1,O)}
  for(let i=0;i<W.length;i++){const w=W[i],y=8+i;if(i===0)continue;X2(g,8-w,y,w*2,1,"#3a9a48");X2(g,8-w,y,Math.max(1,Math.round(w*.7)),1,"#58b858");X2(g,8+Math.round(w*.4),y,Math.round(w*.6),1,"#2a7a38")}
  X2(g,8-W[0],7,W[0]*2,1,O);X2(g,5,10,1,1,"#8ee070");X2(g,9,12,1,1,"#8ee070");X2(g,6,14,2,1,"#2a7a38");X2(g,4,16,8,1,O);return XG[k]=c}
function hmObjR(){const k="HMR";if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d"),O="#2a2430";xdisc(g,16,45,12,3,"rgba(0,0,0,.25)");
  const W=[3,5,6,7,7,7,7,7,6,5];for(let i=0;i<W.length;i++){const w=W[i],y=13+i;X2(g,8-w-1,y,w*2+2,1,O)}X2(g,8-W[0],12,W[0]*2,1,O);
  for(let i=0;i<W.length;i++){const w=W[i],y=13+i;X2(g,8-w,y,w*2,1,"#9c8e84");X2(g,8-w,y,Math.max(1,Math.round(w*.6)),1,"#b8aca2");X2(g,8+Math.round(w*.3),y,Math.round(w*.7),1,"#7c6e66")}
  X2(g,6,14,1,3,O);X2(g,7,16,1,2,O);X2(g,8,17,2,1,O);X2(g,10,15,1,3,O);X2(g,4,18,2,1,O);X2(g,5,13,2,1,"#d4c8be");return XG[k]=c}
function hmObjV(){const k="HMV";if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d"),O="#24202a";xdisc(g,16,45,14,3.5,"rgba(0,0,0,.28)");
  const W=[3,5,6,7,7,8,8,8,8,8,7,7,6,5,3];for(let i=0;i<W.length;i++){const w=W[i],y=8+i;X2(g,8-w-1,y,w*2+2,1,O)}X2(g,8-W[0],7,W[0]*2,1,O);X2(g,8-W[W.length-1],8+W.length,W[W.length-1]*2,1,O);
  for(let i=0;i<W.length;i++){const w=W[i],y=8+i;X2(g,8-w,y,w*2,1,"#8c8a96");X2(g,8-w,y,Math.max(1,Math.round(w*.55)),1,"#aaa8b4");X2(g,8+Math.round(w*.35),y,Math.round(w*.65),1,"#6c6a78")}
  X2(g,5,9,3,2,"#cfcdd8");X2(g,4,11,1,1,"#cfcdd8");X2(g,9,18,3,1,"#5a5866");X2(g,3,15,2,1,"#5a5866");return XG[k]=c}
{const _o=xObj;xObj=function(c,x,y){try{if(EX.M&&EX.M.base!=="F"){if(c==="j")return hmObjJ();if(c==="r")return hmObjR();if(c==="v")return hmObjV()}}catch(e){}return _o.apply(this,arguments)}}
// navegando: vas montado en tu Pokémon de agua (dibujo propio), sin compañero detrás
function hmMount(g,face,x,y){const t=performance.now(),bob=Math.round(Math.sin(t/260)*1),O="#1a2a4a",B="#4a8ad8",L="#8ac0f0",D="#2a5aa8",X=Math.round(x),Y=Math.round(y)+bob;
  g.fillStyle="rgba(255,255,255,.55)";const w=Math.floor(t/180)%2;g.fillRect(X+2-w,Y+30,6,2);g.fillRect(X+24+w,Y+30,6,2);
  const R=(a,b,w2,h,c)=>{g.fillStyle=c;g.fillRect(X+a,Y+b,w2,h)};
  R(3,16,26,14,O);R(5,15,22,16,O);R(5,17,22,12,B);R(7,16,18,14,B);R(6,18,8,3,L);R(8,17,6,2,L);R(5,25,22,3,D);R(9,28,14,2,D);
  if(face==="d"){R(11,22,10,10,O);R(12,23,8,8,B);R(13,24,3,2,L);R(13,27,2,2,"#fff");R(17,27,2,2,"#fff");R(14,28,1,1,O);R(18,28,1,1,O)}
  else if(face==="u"){R(11,10,10,9,O);R(12,11,8,7,B);R(13,12,3,2,L)}
  else{const dx=face==="l"?-1:1,hx=face==="l"?0:22;R(hx,15,10,10,O);R(hx+1,16,8,8,B);R(hx+2,17,3,2,L);R(hx+(face==="l"?2:5),19,2,2,"#fff");R(hx+(face==="l"?2:6),20,1,1,O)}}
{const _t=exDrawTr;exDrawTr=function(g,code,face,x,y,fr,beat,me,ph){if(me&&EX.surf){hmMount(g,face,x,y);g.save();g.beginPath();g.rect(x-4,y-24,40,40);g.clip();const r=_t.call(this,g,code,face,x,y-4,0,beat,me,ph);g.restore();return r}return _t.apply(this,arguments)}}
{const _f=exDrawFol;exDrawFol=function(){if(EX.surf)return;return _f.apply(this,arguments)}}
// cuevas oscuras (hasta usar Destello) y nube de polvo al cortar o romper
{const _d=exDraw;exDraw=function(ts){const r=_d.apply(this,arguments);try{if(!EX.on&&!EX.cv)return r;const cv=EX.cv,g=cv.getContext("2d"),W=cv.width/EXS,H=cv.height/EXS,cam=EX.cam||[0,0];g.setTransform(EXS,0,0,EXS,0,0);
  if(EX.poof){const p=EX.poof,e=(performance.now()-p.t0)/380,X=p.x*EXTL-cam[0]+16,Y=p.y*EXTL-cam[1]+12;g.fillStyle="rgba(240,236,228,"+(1-e)+")";for(let i=0;i<6;i++){const a=i*1.05+e*2,rr=6+e*14;g.fillRect(Math.round(X+Math.cos(a)*rr)-3,Math.round(Y+Math.sin(a)*rr*.7)-3,6,6)}}
  if(HM_DARK[EX.map]&&EX.lit!==EX.map&&!EX.title){const px=EX.px*EXTL-cam[0]+16,py=EX.py*EXTL-cam[1]+12,rad=EX.flashT&&performance.now()-EX.flashT<900?40+(performance.now()-EX.flashT)/2:44;
    const gr=g.createRadialGradient(px,py,rad*.55,px,py,rad*1.25);gr.addColorStop(0,"rgba(0,0,8,0)");gr.addColorStop(1,"rgba(0,0,8,.94)");g.fillStyle=gr;g.fillRect(0,0,W,H)}}catch(e){}return r}}
