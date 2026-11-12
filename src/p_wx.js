// =====================================================================================
// CLIMA, DÍA/NOCHE, BAYAS Y PAREJAS DE ENTRENADORES (como en la saga)
// · Clima por zona: nieve en Escarcha, sol abrasador en el Cráter, lluvia en Tormenta, ceniza en Brasa…
//   y en el resto de rutas cambia cada pocas horas (lluvia o sol fuerte). El clima pasa también a los combates.
// · Con lluvia salen más Pokémon de Agua, con nieve de Hielo, con sol de Fuego… y de noche, más Pokémon nocturnos.
// · Árboles de bayas: dan bayas una vez al día.
// · Parejas de entrenadores: si te ve una, combates contra las dos a la vez (sus equipos juntos).
// =====================================================================================
const WX_IC={rain:"🌧️",snow:"❄️",sun:"☀️",sand:"🌫️"},WX_N={rain:"Lluvia",snow:"Nieve",sun:"Sol abrasador",sand:"Ceniza"};
function wxNow(){const M=EX.M;if(!M||M.base==="F"||M.base==="c"&&M.pal!=="magma")return null;
  if(M.pal==="snow")return "snow";if(M.pal==="storm")return "rain";if(M.pal==="magma")return "sun";if(M.pal==="ash")return "sand";if(M.pal==="ice")return null;
  if(M.base==="c")return null;const slot=Math.floor(Date.now()/(3*3600e3)),h=(pvHash("wx"+EX.map+slot)>>>0)%100;
  if(h<20)return "rain";if(h<30&&(M.music==="beach"||M.music==="route"))return "sun";return null}
const wxNight=()=>{const h=new Date().getHours();return h>=20||h<6};
// el nombre de la zona muestra el clima
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{const w=wxNow();if(w&&EX.banner)EX.banner.t=EX.M.n+"  "+WX_IC[w];EX.wx=w}catch(e){}return r}}
setInterval(()=>{try{if(EX.on&&EX.M)EX.wx=wxNow()}catch(e){}},60000);
// lluvia y sol en las rutas que no tenían su propio clima
{const _x=exExtraEnts;exExtraEnts=function(ents,g,cx,cy,ts){const r=_x.apply(this,arguments);try{const w=EX.wx,M=EX.M;if(!w||!M||M.pal||(typeof hubCalm==="function"&&hubCalm()))return r;const W=g.canvas.width/EXS,H=g.canvas.height/EXS;
  ents.push({y:9997,d:()=>{const t=ts/1000;if(w==="rain"){g.fillStyle="rgba(20,30,60,.16)";g.fillRect(0,0,W,H);g.strokeStyle="rgba(190,215,255,.5)";g.lineWidth=1;g.beginPath();for(let i=0;i<70;i++){const x=((i*83.7+t*50)%(W+30))-15,y=((i*47.1+t*(240+i%5*30))%(H+20))-10;g.moveTo(x,y);g.lineTo(x-3,y+10)}g.stroke()}
    else if(w==="sun"){const gr=g.createRadialGradient(W*.85,-20,10,W*.85,-20,W*.9);gr.addColorStop(0,"rgba(255,230,150,.35)");gr.addColorStop(1,"rgba(255,200,80,0)");g.fillStyle=gr;g.fillRect(0,0,W,H)}}})}catch(e){}return r}}
// el clima en los combates de Exploración
{const _sb=startBattle;startBattle=function(cfg){const pr=_sb.apply(this,arguments);try{if(typeof XGSW!=="undefined"&&XGSW&&typeof B!=="undefined"&&B&&B.E&&!B.E.wx){const w=EX.wx||wxNow();if(w&&w!=="sand")B.E.wx={t:w,n:999,pr:0};else if(w==="sand")B.E.wx={t:"sand",n:999,pr:0}}}catch(e){}return pr}}
// qué Pokémon salen según el clima y la hora
const WX_TY={rain:["water","electric"],snow:["ice"],sun:["fire","grass"],sand:["ground","rock","fire"]};
{const _w=wildPick;wildPick=function(r){const p=_w.apply(this,arguments);try{if(!(typeof XGSW!=="undefined"&&XGSW)||!EX.M)return p;const w=EX.wx,want=w?WX_TY[w]:wxNight()?["dark","ghost","poison","psychic"]:null;
  if(want&&Math.random()<.35){const pool=P.filter(q=>q&&q[2]===r&&want.includes(q[1]));if(pool.length)return pool[Math.floor(Math.random()*pool.length)]}}catch(e){}return p}}
// ---------- árboles de bayas (;) ----------
const BR_T=["oran","sitrus","pecha","cheri","chesto","oran","sitrus","lum"];
const brKey=(m,x,y)=>m+":"+x+","+y;
const brType=(m,x,y)=>{const id=BR_T[(pvHash("br"+m+x+y)>>>0)%BR_T.length];return typeof ITEMS!=="undefined"&&ITEMS.find(i=>i[0]===id)?id:"oran"};
const brRipe=(m,x,y)=>{try{const f=stSt().f;return !(f.br&&f.br[brKey(m,x,y)]===today())}catch(e){return true}};
{const _b=exBlocked;exBlocked=function(x,y){if(exAt(x,y)===";")return true;return _b.apply(this,arguments)}}
{const _g=xGround;xGround=function(x,y,fr){try{if(exAt(x,y)===";"){const v=(x*3+y)%4,k="BRG"+v;if(XG[k])return XG[k];const c=xc(32,32);xGrassBase(c.getContext("2d"),v);return XG[k]=c}}catch(e){}return _g.apply(this,arguments)}}
function brObj(ripe,col){const k="BRO"+(ripe?col:"0");if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d"),O="#123a22";xdisc(g,16,44,11,3,"rgba(10,40,20,.28)");
  X2(g,7,16,2,7,O);X2(g,7,16,1,7,"#8a5a2c");const W=[2,4,5,6,6,6,5,4,2];for(let i=0;i<W.length;i++){const w=W[i];X2(g,8-w-1,6+i,w*2+2,1,O)}X2(g,6,5,4,1,O);
  for(let i=0;i<W.length;i++){const w=W[i];X2(g,8-w,6+i,w*2,1,"#3a9040");X2(g,8-w,6+i,Math.max(1,Math.round(w*.6)),1,"#58b050")}X2(g,4,15,8,1,O);
  if(ripe)[[5,8],[10,9],[7,11],[4,12],[11,12]].forEach(([a,b])=>{X2(g,a,b,2,2,O);X2(g,a,b,1,1,col)});return XG[k]=c}
const BR_C={oran:"#4a8ae8",sitrus:"#f0d040",pecha:"#f090c0",cheri:"#e84848",chesto:"#8a5ad8",lum:"#5ad1a0"};
{const _o=xObj;xObj=function(c,x,y){if(c===";"){const ty=brType(EX.map,x,y);return brObj(brRipe(EX.map,x,y),BR_C[ty]||"#e84848")}return _o.apply(this,arguments)}}
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&!EX.cut){const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy;if(exAt(x,y)===";"){const id=brType(EX.map,x,y),f=stSt().f;
  if(!brRipe(EX.map,x,y)){exSay(["Es un árbol de bayas.","Hoy ya has recogido sus bayas. ¡Mañana tendrá más!"]);return}
  const n=1+((pvHash("brn"+EX.map+x+y+today())>>>0)%3);f.br=f.br||{};f.br[brKey(EX.map,x,y)]=today();xgRun(()=>{S.bag[id]=(S.bag[id]||0)+n});save();snd("lvl");
  exSay(["¡Es un árbol de bayas!","Has recogido "+n+" × "+IN2(id)+".","(Vuelve mañana: dará bayas otra vez.)"]);return}}}catch(e){console.error(e)}return _i.apply(this,arguments)}}
// ---------- parejas de entrenadores ----------
{const _t=exTrainerBattle;exTrainerBattle=function(n){if(!n||!n.pair)return _t.apply(this,arguments);const o=EX.npcs.find(q=>q!==n&&q.pair===n.pair);if(!o)return _t.apply(this,arguments);
  if(!exTeamOk()){exSay(["Tus Pokémon están debilitados. ¡Vuelve cuando estén curados!"]);return}
  const names=(S.team||[]).filter(x=>x&&S.owned[x]),lead=Math.min(...names.map(x=>lvd(x).l)),cap=lvCap(),lv=Math.max(2,Math.min(cap,lead))-1+(n.rematch?3:0);
  const sp=n.t.concat(o.t).filter(x=>PM[x]).slice(0,6),team=sp.map((x,i)=>{const l=clampL(lv+(i%2));return mkEnemy(stageFor(PM[x],l)||PM[x],l)});o.beat=true;
  EX.trans={t:0,d:1300,k:"trainer",done:()=>exBattle({eteam:team,trainer:n.pn||n.n,tsrc:{k:exTrKey(n.n),n:n.pn||n.n}},n)}}}
// al ganar a una, la otra también queda vencida (y al perder, las dos siguen esperando)
setInterval(()=>{try{if(EX.battle)return;const st=exSt();(EX.npcs||[]).forEach(n=>{if(!n.pair)return;const o=EX.npcs.find(q=>q!==n&&q.pair===n.pair);if(!o)return;
  const won=!!st.npc[n.id]||!!st.npc[o.id];if(won){if(!st.npc[n.id]||!st.npc[o.id]){st.npc[n.id]=1;st.npc[o.id]=1;save()}if(!n.rematch)n.beat=true;if(!o.rematch)o.beat=true}else if(!n.rematch&&!o.rematch){n.beat=false;o.beat=false}})}catch(e){}},600);
