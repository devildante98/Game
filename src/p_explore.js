// ================= EXPLORACIÓN: rutas por casillas como en los juegos (hierba alta, entrenadores, carteles, objetos) =================
const EXM={"ruta":{"n":"Ruta 1 · Pradera","z":"pra","base":".","g":["mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm","m##mmmmmmmmmmm1mmmmmmmmmmmm##m","###...........=............###","#..~~~TTTTT...=H..TTTITT...###","#.~~~~TTTTT...=.,,TTTTTT..o###","#~~~~~TTTTT...=.,,TTTTTT...###","#.~~~~TTTTT...=...TTTTTT...###","#..~~~........=..............#","#.............===============2","#.o....o......=..............#","#.........,,,.=..........b...#","#..TTTTTT.,,,.=..............#","#..TTTTTT.....=.b..TITTTTT.o.#","#..TTTTTT.....=....TTTTTTT...#","#..TTTTTT.....=....TTTTTTT...#","#........b=====....TTTTTTT...#","#.............=....TTTTTTT...#","#.,,,...TTTTT.=..............#","#.,,,...TTTTT.=..o......,,,..#","#.,,,b..TTTTTH=.......b.,,,..#","#.............=..............#","##############3###############"],"w":{"1":{"to":"cueva","x":14,"y":19,"f":"u","look":"cave","med":1},"2":{"to":"bosque","x":1,"y":11,"f":"r","look":"path"},"3":{"to":"playa","x":14,"y":1,"f":"d","look":"path","med":2}},"sg":{"13,19":"RUTA 1 · PRADERA\n↑ Cueva Roca · → Bosque Verde · ↓ Playa Coral","15,3":"CUEVA ROCA\nSolo para entrenadores con al menos 1 medalla."},"npc":[{"x":17,"y":10,"f":"l","n":"Joven Leo","t":["Rattata","Pidgey","Sentret"],"sight":4,"txt":"¡Eh! ¡Nuestras miradas se han cruzado! ¡Combatamos!"},{"x":5,"y":16,"f":"u","n":"Chica Ana","t":["Oddish","Bellsprout"],"sight":4,"txt":"¡Mis Pokémon de planta te van a sorprender!"}],"music":"route"},"bosque":{"n":"Bosque Verde","z":"bos","base":".","g":["##############################","##############################","##############################","################dddddduuddddd#","##uudduud.ddddudd.udd.dd.d.dd#","##d.dd.d.uddd.ddddd========uu#","##.du========d..ddd=d.ddd.=dd#","##.dd=dd.ddd=.d..dd=dddudd=dd#","##dd.=d...ud=ddu.uu=d.dudu=..#","#.dd.=udu..u=...udd=d....d=.d#","#uddd=.dd.du=ddud.d=..,,Id=du#","1=====dddd.d=d.u...=..,,..=dd#","#H...d..dddu=u.uuud=......=dd#","#u.d.dddd.d.=ddu.dd=ddu.dd=..#","#########d.d=dddddd=.u.u.u=.d#","#########.dd========.duddd=d.#","#########.dud..uu.u.udu...=d.#","#########duuI..d.d.ddu.udd...#","#######################dddu.d#","##############################","##############################","##############################"],"w":{"1":{"to":"ruta","x":28,"y":8,"f":"l","look":"path"}},"sg":{"1,12":"BOSQUE VERDE\nCuidado: la hierba oscura está llena de Pokémon Bicho."},"npc":[{"x":12,"y":9,"f":"d","n":"Cazabichos Teo","t":["Caterpie","Weedle","Metapod"],"sight":4,"txt":"¡Mis bichos son los más fuertes del bosque!"},{"x":19,"y":10,"f":"r","n":"Exploradora Iris","t":["Paras","Venonat","Oddish"],"sight":4,"txt":"¡Llevo días en el bosque entrenando!"}],"music":"forest"},"playa":{"n":"Playa Coral","z":"mar","base":"s","g":["##############1###############","psssssssssssss=ssssssssss~~~~~","pspssssssspsss=sHsssssssp~~~~~","psssssssssssssssgggggggss~~~~~","pssggggggssossssgggggggss~~~~~","pssggggggsssssssgggggggss~~~~~","pssggggggsssssssgggggggss~~~~~","pssggggggssssssssssssssss~~~~~","psssssssssssspsssssssIpss~~~~~","psssossssssssssggggssssss~~~~~","psssssgggggggssggggssssss~~~~~","psssssgggggggssggggsossss~~~~~","pspsssgggggggssggggssssss~~~~~","pssIssgggggggsssssss~~~~~~~~~~","psssssssssssssssssss~~~~~~~~~~","~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~","~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~","~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~","~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~","~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~","~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~","~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"],"w":{"1":{"to":"ruta","x":14,"y":20,"f":"u","look":"path"}},"sg":{"16,2":"PLAYA CORAL\nLa hierba de las dunas esconde Pokémon de agua."},"npc":[{"x":10,"y":8,"f":"r","n":"Nadador Marco","t":["Tentacool","Staryu","Horsea"],"sight":5,"txt":"¡El mar me ha hecho fuerte! ¡A ver qué tienes!"},{"x":20,"y":7,"f":"d","n":"Pescador Rubén","t":["Magikarp","Goldeen","Poliwag","Krabby"],"sight":4,"txt":"¡Hoy han picado unos Pokémon estupendos!"}],"music":"beach"},"cueva":{"n":"Cueva Roca","z":"cue","base":"c","g":["XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","XXXXXXXXXXcckccccccXXXXXXXXXXX","XXXXXXXccccccccwcccwccXXXXXXXX","XXXXXwwwcccccccwcccccXcXXXXXXX","XXXXcwwwccccccccccccccIccXXXXX","XXXcccccccccccccckccccccccXXXX","XXXccckkccccccccccccccccccXXXX","XXccckccccckcccccccccccccccXXX","XXcccccccccccccccccccccccccXXX","XXccccccccccccXccccccccccckXXX","XcccccccccccccccccccccccccccXX","XXcccccccccccccccccccccccccXXX","XXccccccccccccccXccccccccccXXX","XXcccccccccccccccccccwwwcckXXX","XXXcccIcckcccccccccccwwwckXXXX","XXXccccwccccccccccccccccccXXXX","XXXXkcccccccccccHccccccccXXXXX","XXXXXXkcccccwccccccccccXXXXXXX","XXXXXXXcccccccccccccccXXXXXXXX","XXXXXXXXXXcccc1ccccXXXXXXXXXXX","XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"],"w":{"1":{"to":"ruta","x":14,"y":2,"f":"d","look":"ladder"}},"sg":{"16,17":"CUEVA ROCA\nEn las cuevas aparecen Pokémon en cualquier sitio."},"npc":[{"x":10,"y":8,"f":"r","n":"Montañero Gus","t":["Geodude","Onix","Machop"],"sight":4,"txt":"¡Las rocas no me asustan, y tú tampoco!"},{"x":20,"y":10,"f":"l","n":"Karateka Kai","t":["Mankey","Machop","Hitmonlee"],"sight":4,"txt":"¡Hiyaa! ¡Pon a prueba tu espíritu!"}],"music":"cave"}};
const EXTL=32,EXS=2;// casilla de 32 px de pixel art, dibujada al doble
const EXBLK="#mXpo~bkwuHfI";
const EX={on:false,raf:0,cv:null,g:null,map:null,x:0,y:0,f:"d",mv:null,keys:{},dlg:null,trans:null,npcs:[],fol:null,steps:0,battle:null,t:0,run:false,pend:[]};
const exDay=()=>today();
function exSt(){S.ex=S.ex&&EXM[S.ex.m]?S.ex:{m:"ruta",x:14,y:18,f:"u"};if(!S.ex.d||S.ex.d.day!==exDay())S.ex.d={day:exDay(),it:{},npc:{}};return S.ex}
// ---------- casillas dibujadas a mano en pixel art ----------
const EXTILE={};
function exRnd(x,y,k){let h=(x*374761393+y*668265263+k*2147483647)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296}
function exTile(ch,v,fr,bs){bs=bs||".";const key=ch+v+"|"+fr+bs;if(EXTILE[key])return EXTILE[key];const c=document.createElement("canvas");c.width=c.height=EXTL;const g=c.getContext("2d");
  const px=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)},R=k=>exRnd(v,k,ch.charCodeAt(0));
  const grass=(b1,b2,b3)=>{px(0,0,32,32,b1);for(let i=0;i<10;i++){const x=Math.floor(R(i)*30),y=Math.floor(R(i+20)*30);px(x,y,2,1,b2);px(x+1,y-1,1,1,b2)}for(let i=0;i<4;i++){const x=Math.floor(R(i+40)*28),y=Math.floor(R(i+50)*28);px(x,y,1,2,b3)}};
  const G1="#78c850",G2="#5aa83a",G3="#98e070",ground=()=>{if(bs!==".")g.drawImage(exTile(bs,v,0),0,0);else grass(G1,G2,G3)};
  if(ch==="."||ch==="1"&&0)grass(G1,G2,G3);
  else if(ch==="T"||ch==="d"||ch==="g"){const P=ch==="T"?["#4f9a35","#3a7d26","#7cc85a","#2f6a1e"]:ch==="d"?["#2f7a3a","#215c2a","#4fa05a","#163f1c"]:["#e8d088","#c9b060","#a8c860","#7a9a40"];
    if(ch==="g"){px(0,0,32,32,"#f0dca0")}else px(0,0,32,32,P[0]);
    for(let r=0;r<2;r++)for(let k=0;k<4;k++){const bx=k*8+(r?4:0)+(fr&&ch!=="g"?1:0),by=r*16+4;
      g.fillStyle=ch==="g"?P[2]:P[1];g.beginPath();g.moveTo(bx,by+12);g.lineTo(bx+3,by);g.lineTo(bx+6,by+12);g.fill();
      g.fillStyle=ch==="g"?P[3]:P[2];g.beginPath();g.moveTo(bx+1,by+12);g.lineTo(bx+3,by+3);g.lineTo(bx+4,by+12);g.fill();
      px(bx,by+12,7,1,P[3])}}
  else if(ch==="="){px(0,0,32,32,"#e0c88a");for(let i=0;i<9;i++){const x=Math.floor(R(i)*29),y=Math.floor(R(i+9)*29);px(x,y,3,2,"#c8ac6a");px(x,y,1,1,"#f0dca8")}}
  else if(ch==="s"){px(0,0,32,32,"#f2dfa4");for(let i=0;i<14;i++){const x=Math.floor(R(i)*31),y=Math.floor(R(i+14)*31);px(x,y,1,1,i%3?"#d8c080":"#fff4cc")}}
  else if(ch==="~"){px(0,0,32,32,"#3f8fe0");for(let i=0;i<3;i++){const y=4+i*10+(fr?2:0),x=(i*11+(fr?5:0))%24;px(x,y,8,2,"#7fc0ff");px(x+2,y-1,4,1,"#cfe8ff")}px(0,0,32,1,"#5aa0f0")}
  else if(ch==="w"){px(0,0,32,32,"#7a6a5a");g.fillStyle="#3a6aa8";g.beginPath();g.ellipse(16,16,14,11,0,0,7);g.fill();px(8,12+(fr?2:0),8,2,"#7fb0e8")}
  else if(ch===","){grass(G1,G2,G3);const C=["#ff5a6a","#ffd23f","#ffffff","#ff8fd0"];for(let i=0;i<4;i++){const x=4+(i%2)*14+(fr&&i%2?1:0),y=5+Math.floor(i/2)*14;g.fillStyle=C[(v+i)%4];px(x,y,2,2,C[(v+i)%4]);px(x+2,y+2,2,2,C[(v+i)%4]);px(x-2+2,y+4,2,2,C[(v+i)%4]);px(x+4,y+2,2,2,C[(v+i)%4]);px(x+2,y+2,2,2,"#ffe25a");px(x+2,y+6,1,4,"#3a7d26")}}
  else if(ch==="#"){grass(G1,G2,G3);px(13,22,6,8,"#7a4a26");px(13,22,2,8,"#9a6a3a");g.fillStyle="#2f7a2a";g.beginPath();g.arc(16,14,14,0,7);g.fill();g.fillStyle="#3f9a35";g.beginPath();g.arc(13,11,9,0,7);g.fill();g.fillStyle="#5cbc48";g.beginPath();g.arc(11,8,4,0,7);g.fill();g.fillStyle="rgba(0,0,0,.18)";g.fillRect(6,27,20,3)}
  else if(ch==="p"){px(0,0,32,32,"#f2dfa4");g.strokeStyle="#9a6a3a";g.lineWidth=4;g.beginPath();g.moveTo(17,31);g.quadraticCurveTo(13,18,16,8);g.stroke();g.fillStyle="#3fae4a";for(const a of[-2.6,-1.9,-1.2,-.5,.3]){g.beginPath();g.ellipse(16+Math.cos(a)*7,8+Math.sin(a)*4,9,3,a,0,7);g.fill()}}
  else if(ch==="m"){px(0,0,32,32,"#a8845a");for(let y=0;y<32;y+=8){px(0,y,32,2,"#8a6a44");px((y*3)%24,y+3,8,2,"#c8a070")}px(0,30,32,2,"#6a4e30")}
  else if(ch==="o"||ch==="k"){(ch==="o"?ground():px(0,0,32,32,"#8a7a6a"));g.fillStyle="#7a7a8a";g.beginPath();g.ellipse(16,18,13,11,0,0,7);g.fill();g.fillStyle="#9a9aaa";g.beginPath();g.ellipse(13,14,8,6,0,0,7);g.fill();px(10,11,4,2,"#c8c8d8");g.fillStyle="rgba(0,0,0,.2)";g.fillRect(5,28,22,2)}
  else if(ch==="b"){ground();g.fillStyle="#2f7a2a";g.beginPath();g.ellipse(16,18,14,12,0,0,7);g.fill();g.fillStyle="#4fa03a";g.beginPath();g.ellipse(13,14,8,7,0,0,7);g.fill();px(20,18,3,3,"#ff5a6a");px(9,20,3,3,"#ff5a6a")}
  else if(ch==="u"){grass("#2f7a3a","#215c2a","#4fa05a");px(13,18,6,10,"#f4eadc");g.fillStyle="#e84a4a";g.beginPath();g.ellipse(16,16,11,7,0,Math.PI,0);g.fill();px(10,12,3,3,"#fff");px(19,11,3,3,"#fff")}
  else if(ch==="c"){px(0,0,32,32,"#8a7a6a");for(let i=0;i<6;i++){const x=Math.floor(R(i)*28),y=Math.floor(R(i+6)*28);px(x,y,4,1,"#6a5a4a");px(x+1,y+1,2,1,"#a8988a")}}
  else if(ch==="X"){px(0,0,32,32,"#4a3a2e");for(let y=0;y<32;y+=8){px(0,y,32,1,"#3a2a20");px((y*5)%20,y+2,10,3,"#5a4a3c")}px(0,28,32,4,"#2e2218")}
  else if(ch==="H"){ground();px(14,16,4,14,"#7a4a26");px(5,6,22,13,"#c8955a");px(5,6,22,2,"#e8b57a");px(5,17,22,2,"#8a5a2e");px(8,10,16,1,"#6a4020");px(8,13,12,1,"#6a4020")}
  else if(ch==="f"){grass(G1,G2,G3);px(0,12,32,4,"#e8d8c0");px(0,20,32,4,"#e8d8c0");for(let x=2;x<32;x+=10)px(x,8,4,20,"#fff4e0")}
  else grass(G1,G2,G3);
  return EXTILE[key]=c}
function exWarpTile(g,look,fr){const c=document.createElement("canvas");c.width=c.height=EXTL;const x=c.getContext("2d");
  if(look==="cave"){x.drawImage(exTile("m",1,0),0,0);x.fillStyle="#1a120c";x.beginPath();x.ellipse(16,24,12,14,0,Math.PI,0);x.fill();x.fillRect(4,24,24,8)}
  else if(look==="ladder"){x.drawImage(exTile("c",1,0),0,0);x.fillStyle="#2a1a10";x.fillRect(6,4,20,26);x.fillStyle="#c8955a";x.fillRect(8,4,3,26);x.fillRect(21,4,3,26);for(let y=7;y<30;y+=6)x.fillRect(8,y,16,2)}
  else x.drawImage(exTile("=",1,0),0,0);return c}
// ---------- sprites del entrenador (andar en 4 direcciones) ----------
const EXSP={};
function exImg(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src})}
async function exTrainer(code,face){const k=code+face;if(EXSP[k])return EXSP[k];
  const L=trDec(code),view=face==="u"?"b":"f",img=await exImg(trURL(L,view,"i"));if(!img)return null;
  const base=document.createElement("canvas");base.width=64;base.height=96;const bg=base.getContext("2d");bg.imageSmoothingEnabled=false;bg.drawImage(img,0,0,64,96);
  // tres fotogramas: quieto, paso izquierdo y paso derecho (se levanta una pierna)
  const fr=[0,1,2].map(s=>{const c=document.createElement("canvas");c.width=64;c.height=96;const g=c.getContext("2d");g.imageSmoothingEnabled=false;
    if(!s){g.drawImage(base,0,0);return c}
    g.drawImage(base,0,0,64,72,0,0,64,72);const half=s===1?[0,32]:[32,32],other=s===1?[32,32]:[0,32];
    g.drawImage(base,other[0],72,other[1],24,other[0],72,other[1],24);g.drawImage(base,half[0],72,half[1],24,half[0],70,half[1],24);return c});
  // vista de lado: el de frente un poco estrecho e inclinado hacia donde camina
  return EXSP[k]={fr:fr,side:face==="l"||face==="r"}}
// ---------- estado del mapa ----------
function exLoad(m,x,y,f){const M=EXM[m];EX.map=m;EX.M=M;EX.x=x;EX.y=y;EX.f=f||EX.f;EX.mv=null;EX.px=x;EX.py=y;EX.trail=[{x:x,y:y}];
  const st=exSt();st.m=m;st.x=x;st.y=y;st.f=EX.f;
  EX.grid=M.g.map(r=>r.split(""));for(const k in st.d.it)if(k.startsWith(m+":")){const[,xy]=k.split(":"),[ix,iy]=xy.split(",").map(Number);if(EX.grid[iy]&&EX.grid[iy][ix]==="I")EX.grid[iy][ix]=M.base}
  EX.npcs=(M.npc||[]).map((n,i)=>Object.assign({},n,{id:m+":"+i,beat:!!st.d.npc[m+":"+i],px:n.x,py:n.y,f0:n.f,look:exNpcLook(m+":"+i)}));
  EX.banner={t:M.n,t0:performance.now()};EX.cam=null;save()}
function exNpcLook(id){const r=rngS(pvHash("npc"+id)),L={};TRO.forEach(o=>{const n=trN(o);L[o[0]]=Math.floor(r()*n)});L.brd=r()<.8?0:L.brd;L.mk=0;L.hat=r()<.4?0:L.hat;L.gl=r()<.7?0:L.gl;TRO.forEach(o=>{if(!trOk(o[0],L[o[0]]))L[o[0]]=0});return trEnc(L)}
const exAt=(x,y)=>EX.grid[y]&&EX.grid[y][x]!=null?EX.grid[y][x]:"#";
function exBlocked(x,y){const c=exAt(x,y);if(EXBLK.includes(c))return true;if(EX.npcs.some(n=>n.px===x&&n.py===y))return true;return false}
const EXDIR={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
// ---------- bucle ----------
function exStart(){const st=exSt();if(!EX.cv)return;EX.on=true;if(EX.map!==st.m||!EX.grid)exLoad(st.m,st.x,st.y,st.f);exFollower();if(!EX.raf)EX.raf=requestAnimationFrame(exLoop)}
function exStop(){EX.on=false;if(EX.raf)cancelAnimationFrame(EX.raf);EX.raf=0;EX.keys={}}
function exLoop(ts){EX.raf=0;if(!EX.on||!EX.cv||!EX.cv.isConnected||!EX.cv.offsetParent){EX.on=false;return}
  const dt=Math.min(50,ts-(EX.t||ts));EX.t=ts;exUpdate(dt,ts);exDraw(ts);EX.raf=requestAnimationFrame(exLoop)}
function exKeyDir(){const k=EX.keys;return k.u?"u":k.d?"d":k.l?"l":k.r?"r":null}
function exUpdate(dt,ts){
  if(EX.trans){EX.trans.t+=dt;if(EX.trans.t>=EX.trans.d){const f=EX.trans.done;EX.trans=null;f&&f()}return}
  if(EX.walkTo){exNpcWalk(dt);return}
  if(EX.dlg)return;
  if(EX.mv){EX.mv.t+=dt;const p=Math.min(1,EX.mv.t/EX.mv.d);EX.px=EX.mv.x0+(EX.x-EX.mv.x0)*p;EX.py=EX.mv.y0+(EX.y-EX.mv.y0)*p;
    if(p>=1){EX.mv=null;EX.px=EX.x;EX.py=EX.y;exArrive()}else return}
  const d=exKeyDir();if(!d){EX.anim=0;return}
  if(EX.f!==d&&!EX.turned){EX.f=d;EX.turned=ts;return}if(EX.turned&&ts-EX.turned<90)return;EX.turned=0;
  const[dx,dy]=EXDIR[d],nx=EX.x+dx,ny=EX.y+dy;EX.f=d;
  if(exBlocked(nx,ny)){if(!EX.bump||ts-EX.bump>350){EX.bump=ts;snd("ui")}return}
  EX.trail.unshift({x:EX.x,y:EX.y});EX.trail.length=3;
  EX.mv={x0:EX.x,y0:EX.y,t:0,d:EX.keys.b||EX.run?120:220};EX.x=nx;EX.y=ny;EX.step=(EX.step||0)+1}
function exArrive(){const st=exSt();st.x=EX.x;st.y=EX.y;st.f=EX.f;EX.steps++;if(EX.steps%20===0)save();
  const c=exAt(EX.x,EX.y),M=EX.M;
  if(M.w&&M.w[c]){const w=M.w[c];if(w.med&&medCount()<w.med){exSay(["Un guardia te detiene:","«Para entrar ahí necesitas al menos "+w.med+" medalla"+(w.med>1?"s":"")+" de gimnasio.»"],()=>{exStepBack()});return}
    snd("ui");EX.trans={t:0,d:500,k:"fade",done:()=>{exLoad(w.to,w.x,w.y,w.f);EX.trans={t:0,d:400,k:"fadein"};exFollowerReset()}};return}
  if(exNpcSight())return;
  const enc=c==="T"||c==="d"||c==="g"?1/9:c==="c"?1/15:0;
  if(enc&&Math.random()<enc)exEncounter()}
function exStepBack(){const t=EX.trail[0];if(t){EX.x=t.x;EX.y=t.y;EX.px=t.x;EX.py=t.y}EX.f={u:"d",d:"u",l:"r",r:"l"}[EX.f]}
// ---------- entrenadores que te ven ----------
function exNpcSight(){for(const n of EX.npcs){if(n.beat)continue;const[dx,dy]=EXDIR[n.f];for(let i=1;i<=n.sight;i++){const x=n.px+dx*i,y=n.py+dy*i;if(exBlocked(x,y)&&!(x===EX.x&&y===EX.y))break;
    if(x===EX.x&&y===EX.y){EX.alert={n:n,t0:performance.now()};snd("lvl");EX.keys={};setTimeout(()=>{EX.alert=null;EX.walkTo={n:n,tx:EX.x-dx,ty:EX.y-dy,t:0}},700);return true}}}return false}
function exNpcWalk(dt){const w=EX.walkTo,n=w.n;if(n.px===w.tx&&n.py===w.ty){EX.walkTo=null;EX.f={u:"d",d:"u",l:"r",r:"l"}[n.f];exSay([n.n+":","«"+n.txt+"»"],()=>exTrainerBattle(n));return}
  w.t+=dt;if(w.t<200)return;w.t=0;const[dx,dy]=EXDIR[n.f];n.px+=dx;n.py+=dy;n.step=(n.step||0)+1}
// ---------- diálogos ----------
function exSay(lines,cb){EX.dlg={l:lines,i:0,c:0,cb:cb};EX.keys={}}
function exDlgNext(){const d=EX.dlg;if(!d)return;const t=d.l[d.i];if(d.c<t.length){d.c=t.length;return}d.i++;d.c=0;snd("ui");if(d.i>=d.l.length){EX.dlg=null;d.cb&&d.cb()}}
function exInteract(){if(EX.dlg){exDlgNext();return}if(EX.mv||EX.trans)return;const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy,c=exAt(x,y);
  const n=EX.npcs.find(q=>q.px===x&&q.py===y);if(n){n.f={u:"d",d:"u",l:"r",r:"l"}[EX.f];if(n.beat)exSay([n.n+":","«¡Qué buen combate! Sigue entrenando, que se nota que tus Pokémon te quieren.»"]);else{exSay([n.n+":","«"+n.txt+"»"],()=>exTrainerBattle(n))}return}
  if(c==="H"){const t=(EX.M.sg||{})[x+","+y];if(t)exSay(t.split("\n"));return}
  if(c==="I"){const st=exSt(),k=EX.map+":"+x+","+y;st.d.it[k]=1;EX.grid[y][x]=EX.M.base;const it=exLoot();S.bag[it]=(S.bag[it]||0)+1;save();snd("lvl");exSay(["¡Has encontrado "+IN2(it)+"!","Lo guardas en la Mochila."]);return}
  if(c==="~")exSay(["El agua está tranquila… Parece que hay Pokémon nadando."])}
function exLoot(){const r=Math.random();return r<.3?"pot":r<.5?"sb":r<.65?"ub":r<.78?"hpot":r<.88?"rev":r<.97?"cand":"mb"}
// ---------- combates ----------
function exTeamOk(){const L=(S.team||[]).filter(n=>n&&S.owned[n]);return L.length&&L.some(n=>S.hp[n]!==0)}
function exEncounter(){if(!exTeamOk()){exSay(["¡Algo se mueve en la hierba!","…pero tus Pokémon están demasiado cansados para luchar. Cúralos en el Centro Pokémon."]);return}
  EX.keys={};snd("wild");EX.trans={t:0,d:1300,k:"wild",done:()=>exBattle(null)}}
function exTrainerBattle(n){if(!exTeamOk()){exSay(["Tus Pokémon están debilitados. ¡Vuelve cuando estén curados!"]);return}
  const names=(S.team||[]).filter(x=>x&&S.owned[x]),lead=Math.min(...names.map(x=>lvd(x).l)),cap=lvCap(),lv=Math.max(2,Math.min(cap,lead))-1;
  const team=n.t.filter(x=>PM[x]).map((x,i)=>mkEnemy(stageFor(PM[x],clampL(lv+i))||PM[x],clampL(lv+i)));
  EX.trans={t:0,d:1300,k:"trainer",done:()=>exBattle({eteam:team,trainer:n.n,tsrc:{c:n.look,n:n.n}},n)}}
async function exBattle(cfg,npc){EX.battle={npc:npc?npc.id:null,win:false,map:EX.map};exStop();
  const z0=S.zone;S.zone=EX.M.z;try{hubClose()}catch(e){}
  const p=startBattle(cfg||{wild:1});S.zone=z0;await p;
  if(!fcd){EX.battle=null;hubOpen("adv","explP");return}}
// ¿has ganado? (cuenta las victorias de combate durante el combate de exploración)
{const _q=qEv;qEv=function(k){if(EX.battle&&(k==="win"||k==="twin"||k==="tr"))EX.battle.win=true;return _q.apply(this,arguments)}}
setInterval(()=>{if(EX.battle&&!fcd){const b=EX.battle;EX.battle=null;
  if(b.npc&&b.win){exSt().d.npc[b.npc]=1;const n=EX.npcs.find(q=>q.id===b.npc);if(n)n.beat=true;save()}
  if(!exTeamOk()){const st=exSt();st.m="ruta";st.x=14;st.y=18;st.f="u";EX.map=null;EX.pend.push(["¡Tus Pokémon se han debilitado!","Corres de vuelta a la entrada de la Ruta 1… Cúralos en el Centro Pokémon."])}
  hubOpen("adv","explP")}},600);
// ---------- compañero que te sigue ----------
async function exFollower(){const b=S.buddy&&S.owned[S.buddy.n]>0?S.buddy.n:(S.team||[]).find(n=>n&&S.owned[n]);if(!b){EX.fol=null;return}
  if(EX.fol&&EX.fol.n===b)return;EX.fol={n:b,d:null};const d=typeof pmdLoad==="function"?await pmdLoad(b,!!(S.shiny&&S.shiny[b]>0)):null;
  if(EX.fol&&EX.fol.n===b){EX.fol.d=d;if(d){const img=new Image();img.src=d.Walk.url;EX.fol.img=img}else{const i=new Image();i.src=SPRU+(window._spr&&window._spr[b])+".png";EX.fol.st=i}}}
function exFollowerReset(){if(EX.fol){EX.fol.x=null}}
// ---------- dibujo ----------
function exCam(W,H){const M=EX.M,mw=M.g[0].length*EXTL,mh=M.g.length*EXTL,cx=EX.px*EXTL+EXTL/2-W/2,cy=EX.py*EXTL+EXTL/2-H/2;return[Math.max(0,Math.min(mw-W,cx)),Math.max(0,Math.min(mh-H,cy))]}
function exDraw(ts){const cv=EX.cv,g=cv.getContext("2d"),W=cv.width/EXS,H=cv.height/EXS;g.imageSmoothingEnabled=false;g.setTransform(EXS,0,0,EXS,0,0);
  g.fillStyle="#000";g.fillRect(0,0,W,H);const[cx,cy]=exCam(W,H),fr=Math.floor(ts/500)%2;
  const x0=Math.floor(cx/EXTL),y0=Math.floor(cy/EXTL),x1=Math.ceil((cx+W)/EXTL),y1=Math.ceil((cy+H)/EXTL);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const c=exAt(x,y),v=Math.floor(exRnd(x,y,7)*4);let t;
    if(EX.M.w&&EX.M.w[c]){t=EXTILE["w"+EX.map+c]||(EXTILE["w"+EX.map+c]=exWarpTile(null,EX.M.w[c].look))}
    else if(c==="I"){t=exTile(EX.M.base,v,0)}else t=exTile(c,v,(c==="~"||c===","||c==="w"||c==="T"||c==="d")?fr:0,EX.M.base);
    g.drawImage(t,Math.round(x*EXTL-cx),Math.round(y*EXTL-cy));
    if(c==="I"){const X=x*EXTL-cx+16,Y=y*EXTL-cy+18;g.fillStyle="rgba(0,0,0,.2)";g.fillRect(X-7,Y+6,14,3);g.fillStyle="#e83a50";g.beginPath();g.arc(X,Y,7,Math.PI,0);g.fill();g.fillStyle="#f4f4f8";g.beginPath();g.arc(X,Y,7,0,Math.PI);g.fill();g.fillStyle="#222";g.fillRect(X-7,Y-1,14,2);g.fillStyle="#fff";g.fillRect(X-2,Y-2,4,4)}}
  // personajes ordenados por profundidad
  const ents=[];EX.npcs.forEach(n=>ents.push({y:n.py,d:()=>exDrawTr(g,n.look,n.f,n.px*EXTL-cx,n.py*EXTL-cy,(n.step||0)%2&&EX.walkTo&&EX.walkTo.n===n?1+((n.step||0)%4>1?1:0):0,n.beat)}));
  const walking=!!EX.mv,ph=walking?Math.min(1,EX.mv.t/EX.mv.d):0,sf=walking?(ph<.5?((EX.step||0)%2?1:2):0):0;
  ents.push({y:EX.py,d:()=>exDrawTr(g,trEnc(myLook()),EX.f,EX.px*EXTL-cx,EX.py*EXTL-cy,sf,false,true)});
  if(EX.fol)ents.push({y:exFolPos().y-.01,d:()=>exDrawFol(g,cx,cy,ts)});
  ents.sort((a,b)=>a.y-b.y).forEach(e=>e.d());
  // hierba alta por encima de los pies
  const gr=(x,y)=>{const c=exAt(Math.round(x),Math.round(y));return c==="T"||c==="d"||c==="g"};
  if(gr(EX.x,EX.y)&&(!EX.mv||ph>.5)){const t=exTile(exAt(EX.x,EX.y),0,fr);g.drawImage(t,0,18,32,14,Math.round(EX.px*EXTL-cx),Math.round(EX.py*EXTL-cy)+18,32,14)}
  if(EX.alert){const n=EX.alert.n,X=n.px*EXTL-cx+16,Y=n.py*EXTL-cy-30;g.fillStyle="#fff";g.fillRect(X-7,Y-14,14,18);g.strokeStyle="#222";g.lineWidth=2;g.strokeRect(X-7,Y-14,14,18);g.fillStyle="#e83a50";g.fillRect(X-2,Y-11,4,9);g.fillRect(X-2,Y,4,3)}
  // cartel con el nombre de la zona
  if(EX.banner){const e=ts-EX.banner.t0;if(e>3200)EX.banner=null;else{const k=e<300?e/300:e>2800?(3200-e)/400:1;g.globalAlpha=Math.max(0,k);g.fillStyle="#f4e2b8";g.fillRect(8,8-(1-k)*30,170,30);g.strokeStyle="#7a4a26";g.lineWidth=3;g.strokeRect(8,8-(1-k)*30,170,30);g.fillStyle="#4a2a10";g.font="bold 13px system-ui,sans-serif";g.fillText(EX.banner.t,16,28-(1-k)*30);g.globalAlpha=1}}
  // transiciones
  if(EX.trans){const p=Math.min(1,EX.trans.t/EX.trans.d),k=EX.trans.k;
    if(k==="fade"){g.fillStyle="rgba(0,0,0,"+p+")";g.fillRect(0,0,W,H)}
    else if(k==="fadein"){g.fillStyle="rgba(0,0,0,"+(1-p)+")";g.fillRect(0,0,W,H)}
    else{const fl=p<.45?(Math.floor(p*14)%2):0;if(fl){g.fillStyle=k==="trainer"?"rgba(0,0,0,.85)":"rgba(255,255,255,.9)";g.fillRect(0,0,W,H)}
      if(p>=.45){const q=(p-.45)/.55;g.fillStyle="#000";const n=8;for(let i=0;i<n;i++){const hh=H/n;g.fillRect(i%2?W*(1-q):0,i*hh,W*q,hh+1)}}}}
  g.setTransform(1,0,0,1,0,0);exDlgDraw()}
function exDrawTr(g,code,face,x,y,sf,beat,me){const k=code+face,sp=EXSP[k];if(!sp){if(!EXSP["_"+k]){EXSP["_"+k]=1;exTrainer(code,face).then(s=>{EXSP[k]=s})}return}
  const img=sp.fr[sf]||sp.fr[0],w=32,h=48;g.fillStyle="rgba(0,0,0,.22)";g.beginPath();g.ellipse(x+16,y+30,10,4,0,0,7);g.fill();
  g.save();g.translate(Math.round(x+16),Math.round(y+32));if(face==="r")g.scale(-1,1);if(sp.side){g.scale(.84,1);g.rotate((face==="r"?-1:1)*.04*0)}
  g.drawImage(img,-w/2,-h+2,w,h);g.restore()}
function exFolPos(){const t=EX.trail[0]||{x:EX.x,y:EX.y};if(!EX.mv)return{x:t.x,y:t.y};const p=Math.min(1,EX.mv.t/EX.mv.d),u=EX.trail[1]||t;return{x:u.x+(t.x-u.x)*p,y:u.y+(t.y-u.y)*p}}
function exDrawFol(g,cx,cy,ts){const f=EX.fol;if(!f)return;const p=exFolPos();if(p.x===EX.px&&p.y===EX.py)return;
  const dx=EX.px-p.x,dy=EX.py-p.y,face=Math.abs(dx)>Math.abs(dy)?(dx>0?"r":"l"):(dy>0?"d":"u"),X=p.x*EXTL-cx+16,Y=p.y*EXTL-cy+28;
  g.fillStyle="rgba(0,0,0,.2)";g.beginPath();g.ellipse(X,Y,9,3.5,0,0,7);g.fill();
  if(f.d&&f.img&&f.img.complete){const a=f.d.Walk,row=a.rows<8?0:{d:0,r:2,u:4,l:6}[face],fr=EX.mv?pmdFrame(ts,a):0,sc=Math.min(1,40/Math.max(8,a.bot-a.top+1));
    g.drawImage(f.img,fr*a.fw,row*a.fh,a.fw,a.fh,Math.round(X-a.fw*sc/2),Math.round(Y-(a.bot+1)*sc+2),a.fw*sc,a.fh*sc)}
  else if(f.st&&f.st.complete){g.save();g.translate(X,Y);if(face==="r")g.scale(-1,1);g.drawImage(f.st,-20,-38,40,40);g.restore()}}
function exDlgDraw(){const box=$("exDlg");if(!box)return;const d=EX.dlg||(EX.pend.length?null:null);if(!d){box.hidden=true;return}
  const t=d.l[d.i]||"";d.c=Math.min(t.length,(d.c||0)+1.2);box.hidden=false;const s=t.slice(0,Math.floor(d.c));if(box._s!==s+d.i){box._s=s+d.i;box.innerHTML=esc(s)+(d.c>=t.length?'<i class="exnx">▼</i>':'')}}
// ---------- panel ----------
nxPanel("explP","🗺️ Exploración","Recorre las rutas con tu entrenador. En la hierba alta aparecen Pokémon salvajes del tipo de cada zona, los entrenadores te retarán si te ven y hay objetos escondidos que se renuevan cada día.");
{const g=HUB.find(x=>x.k==="adv");if(g&&!g.tabs.some(t=>t[0]==="explP"))g.tabs.unshift(["explP","Exploración"]);HUBP.explP="adv";HUBR.explP=()=>exUI()}
function exUI(){const b=$("explPB");if(!b)return;
  if(!b.querySelector("canvas")){b.innerHTML='<div class="exwrap"><div class="exscr"><canvas id="exCv" width="960" height="640" tabindex="0" aria-label="Mapa de exploración"></canvas><div id="exDlg" class="exdlg" hidden></div></div>'+
    '<div class="expad"><div class="exdp"><button data-exd="u" aria-label="Arriba">▲</button><button data-exd="l" aria-label="Izquierda">◀</button><button data-exd="r" aria-label="Derecha">▶</button><button data-exd="d" aria-label="Abajo">▼</button></div><div class="exab"><button data-exa="b" class="alt" aria-label="Correr">B<small>Correr</small></button><button data-exa="a" aria-label="Hablar">A<small>Hablar</small></button></div></div></div>'+
    '<small class="mut">Muévete con las flechas o WASD (Mayús para correr) y habla o recoge con Espacio/Intro. En el móvil usa la cruceta.</small>';
    EX.cv=$("exCv");wirePad(b)}
  EX.cv=$("exCv");exStart();if(EX.pend.length){exSay(EX.pend.shift())}}
function wirePad(b){b.querySelectorAll("[data-exd]").forEach(bt=>{const d=bt.dataset.exd,on=e=>{e.preventDefault();EX.keys={};EX.keys[d]=1},off=e=>{e.preventDefault();delete EX.keys[d]};
    bt.addEventListener("pointerdown",on);bt.addEventListener("pointerup",off);bt.addEventListener("pointerleave",off);bt.addEventListener("pointercancel",off)});
  const A=b.querySelector('[data-exa="a"]'),Bt=b.querySelector('[data-exa="b"]');A.addEventListener("click",e=>{e.preventDefault();exInteract()});Bt.addEventListener("click",e=>{e.preventDefault();EX.run=!EX.run;Bt.classList.toggle("on",EX.run)});
  $("exDlg").addEventListener("click",()=>exDlgNext());EX.cv.addEventListener("click",()=>{if(EX.dlg)exDlgNext()})}
const EXK={ArrowUp:"u",ArrowDown:"d",ArrowLeft:"l",ArrowRight:"r",w:"u",s:"d",a:"l",d:"r",W:"u",S:"d",A:"l",D:"r"};
document.addEventListener("keydown",e=>{if(!EX.on)return;const t=e.target;if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName))return;
  if(EXK[e.key]){e.preventDefault();EX.keys={};EX.keys[EXK[e.key]]=1;return}if(e.key==="Shift")EX.keys.b=1;
  if(e.key===" "||e.key==="Enter"||e.key==="z"||e.key==="Z"){e.preventDefault();exInteract()}});
document.addEventListener("keyup",e=>{if(!EX.on)return;if(EXK[e.key])delete EX.keys[EXK[e.key]];if(e.key==="Shift")delete EX.keys.b});
setInterval(()=>{if(!EX.on&&EX.cv&&EX.cv.isConnected&&EX.cv.offsetParent&&!fcd)exStart()},800);
