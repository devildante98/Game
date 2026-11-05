// =====================================================================================
// HISTORIA DEL MODO EXPLORACIÓN: «La leyenda de la Piedra Aurora» (región de Alba)
// Prólogo en Pueblo Brisa, cinco capítulos por las rutas y un epílogo con créditos.
// =====================================================================================
const STO_CH=[
 {c:"Prólogo",t:"Un nuevo comienzo"},
 {c:"Capítulo 1",t:"Sombras en la Ruta 1"},
 {c:"Capítulo 2",t:"El bosque en peligro"},
 {c:"Capítulo 3",t:"La Escama Celeste"},
 {c:"Capítulo 4",t:"El despertar del guardián"},
 {c:"Capítulo 5",t:"Cima Aurora"},
 {c:"Epílogo",t:"Un nuevo amanecer"}];
// paso de la historia → [capítulo, objetivo]
const STO_OBJ={0:[0,"Habla con mamá"],1:[0,"Ve al laboratorio de la Profesora Vega (arriba del pueblo)"],2:[1,"Sal a la Ruta 1 por el este de Pueblo Brisa"],
 3:[2,"Busca al Equipo Ocaso en el Bosque Verde (Ruta 1 → este)"],4:[3,"Persigue al Equipo Ocaso hasta la Cueva Roca (Ruta 1 → norte · 1 medalla)"],
 5:[4,"Detén a Noctis en la Playa Coral (Ruta 1 → sur · 2 medallas)"],6:[5,"Sube a la Cima Aurora (Pueblo Brisa → norte · 3 medallas)"],
 7:[5,"El Pokémon legendario te espera junto al lago de la Cima Aurora"],8:[6,"Vuelve al laboratorio de la Profesora Vega"],9:[6,"¡Historia completada! Dani te espera cada día en Pueblo Brisa"]};
const stSt=()=>{const e=exSt();if(!e.sto||typeof e.sto!=="object")e.sto={s:0,f:{}};e.sto.f=e.sto.f||{};return e.sto};
const STO_L={dani:exNpcLook("rival-dani"),mama:exNpcLook("mama-casa"),vega:exNpcLook("profesora-vega"),lia:exNpcLook("ayudante-lia"),ocaso:exNpcLook("recluta-ocaso"),bruma:exNpcLook("comandante-bruma"),noctis:exNpcLook("lider-noctis"),enf:exNpcLook("enfermera-centro"),v1:exNpcLook("vecina-1"),v2:exNpcLook("nino-estanque"),v3:exNpcLook("abuelo-pueblo")};
// ---------- personajes de la historia en cada mapa (aparecen según el paso) ----------
function stNPCs(m){const s=stSt().s,f=stSt().f,L=[];const P=(id,x,y,fc,n,look,o)=>L.push(Object.assign({sid:id,x:x,y:y,f:fc,n:n,look:look,t:[],sight:0,txt:""},o||{}));
  if(m==="casa")P("mama",5,4,"r","Mamá",STO_L.mama);
  if(m==="lab"){P("vega",7,3,"d","Profesora Vega",STO_L.vega);if(s>=3&&s<9)P("lia",12,4,"l","Lía",STO_L.lia)}
  if(m==="centro")P("enf",7,2,"d","Enfermera",STO_L.enf);
  if(m==="pueblo"){P("v1",9,7,"l","Vecina",STO_L.v1);P("v2",11,14,"l","Niño",STO_L.v2);P("v3",20,12,"l","Abuelo",STO_L.v3);if(s>=9)P("dani",10,10,"d","Dani",STO_L.dani)}
  if(m==="ruta"&&s===2){P("lia",18,7,"d","Lía",STO_L.lia);P("g1",18,8,"l","Recluta",STO_L.ocaso,{sight:4})}
  if(m==="bosque"&&s===3){if(!f.g3a)P("g3a",5,8,"d","Recluta",STO_L.ocaso,{sight:3});if(!f.g3b)P("g3b",17,12,"r","Recluta",STO_L.ocaso,{sight:3});P("bruma",22,7,"u","Bruma",STO_L.bruma,{sight:2})}
  if(m==="cueva"&&s===4){if(!f.g4c)P("g4c",12,12,"r","Recluta",STO_L.ocaso,{sight:4});if(!f.g4d)P("g4d",17,8,"l","Recluta",STO_L.ocaso,{sight:4});P("bruma",14,6,"d","Bruma",STO_L.bruma,{sight:4})}
  if(m==="playa"&&s===5){if(!f.g5e)P("g5e",14,5,"u","Recluta",STO_L.ocaso,{sight:2});if(!f.g5f)P("g5f",10,8,"r","Recluta",STO_L.ocaso,{sight:4});P("noctis",13,12,"u","Noctis",STO_L.noctis,{sight:3})}
  if(m==="cima"&&s===6){if(!f.g6g)P("g6g",14,17,"d","Recluta",STO_L.ocaso,{sight:3});if(!f.g6h)P("g6h",9,13,"r","Recluta",STO_L.ocaso,{sight:5});if(!f.b6)P("bruma",14,11,"d","Bruma",STO_L.bruma,{sight:2});P("noctis",14,8,"d","Noctis",STO_L.noctis,{sight:2})}
  return L.map(n=>Object.assign(n,{id:"sto:"+m+":"+n.sid,story:1,still:1,beat:true,px:n.x,py:n.y,f0:n.f}))}
function stRefresh(){if(!EX.M)return;EX.npcs=EX.npcs.filter(n=>!n.story).concat(stNPCs(EX.map))}
const stN=id=>EX.npcs.find(n=>n.story&&n.sid===id);
// ---------- utilidades de las escenas ----------
const sW=ms=>new Promise(r=>setTimeout(r,ms));
const sSay=lines=>new Promise(r=>exSay(lines,r));
const S_=(nm,...t)=>t.map(x=>"§"+nm+"|"+x);// líneas con el nombre de quien habla
const OPP={u:"d",d:"u",l:"r",r:"l"};
async function sStepN(n,d){const[dx,dy]=EXDIR[d];n.f=d;n.mv={x0:n.px,y0:n.py,t:0,d:240};n.px+=dx;n.py+=dy;n.step=(n.step||0)+1;while(n.mv)await sW(30)}
async function sWalkN(n,path){for(const d of path)await sStepN(n,d)}
// camina hasta quedar al lado del jugador (primero en horizontal y luego en vertical, o al revés si hay algo en medio)
async function sApproach(n){for(let i=0;i<20;i++){const dx=EX.x-n.px,dy=EX.y-n.py;if(Math.abs(dx)+Math.abs(dy)<=1)break;
    const opts=[];if(dx)opts.push(dx>0?"r":"l");if(dy)opts.push(dy>0?"d":"u");if(Math.abs(dy)>Math.abs(dx))opts.reverse();
    const d=opts.find(o=>{const[a,b]=EXDIR[o],x=n.px+a,y=n.py+b;return !(x===EX.x&&y===EX.y)&&!EXBLK.includes(exAt(x,y))&&!EX.npcs.some(q=>q!==n&&q.px===x&&q.py===y)});if(!d)break;await sStepN(n,d)}
  sFaceTo(n)}
function sFaceTo(n){const dx=EX.x-n.px,dy=EX.y-n.py;n.f=Math.abs(dx)>Math.abs(dy)?(dx>0?"r":"l"):(dy>0?"d":"u");EX.f=OPP[n.f]}
async function sPStep(d){const[dx,dy]=EXDIR[d];EX.f=d;EX.trail.unshift({x:EX.x,y:EX.y});EX.trail.length=3;EX.mv={x0:EX.x,y0:EX.y,t:0,d:240};EX.x+=dx;EX.y+=dy;while(EX.mv)await sW(30);const st=exSt();st.x=EX.x;st.y=EX.y;st.f=EX.f}
async function sAlert(n){EX.alert={n:n,t0:performance.now()};snd("lvl");await sW(750);EX.alert=null}
function sAdd(id,x,y,f,nm,look){const n={sid:id,id:"sto:"+EX.map+":"+id,story:1,still:1,beat:true,x:x,y:y,px:x,py:y,f:f,f0:f,n:nm,look:look,t:[],sight:0};EX.npcs.push(n);return n}
function sDel(id){EX.npcs=EX.npcs.filter(n=>!(n.story&&n.sid===id))}
const sFade=(k,d)=>new Promise(r=>{EX.trans={t:0,d:d||450,k:k,done:r}});
async function sFlash(n){for(let i=0;i<(n||3);i++){EX.flash=1;await sW(90);EX.flash=0;await sW(90)}}
function sStep(k){const t=stSt();if(k>t.s){t.s=k;t.at=Date.now()}save();stRefresh();stHud()}
function sGive(r){grant(r);save();try{render()}catch(e){}snd("lvl");return rwTxt(r)}
// nivel de los rivales: según el nivel medio de tu equipo (y el tope de las medallas)
function sLv(b){const N=(S.team||[]).filter(x=>x&&S.owned[x]),avg=N.length?Math.round(N.reduce((a,x)=>a+lvd(x).l,0)/N.length):5,cap=lvCap();return Math.max(3,Math.min(cap,avg))-1+(b||0)}
const sTeam=(names,b)=>{const lv=sLv(b);return names.filter(x=>PM[x]).map((x,i)=>mkEnemy(stageFor(PM[x],clampL(lv+i))||PM[x],clampL(lv+i)))};
// combate de historia: devuelve true si ganas, false si pierdes y null si no se pudo combatir
async function sBattle(cfg,kind){
  if(!exTeamOk()){await sSay(["Tus Pokémon están demasiado cansados para luchar.","Cúralos en el Centro Pokémon o descansa en casa y vuelve."]);return null}
  EX.keys={};EX.kst=[];snd(kind==="wild"?"wild":"ui");await new Promise(r=>{EX.trans={t:0,d:1300,k:kind==="wild"?"wild":"trainer",done:r}});
  if(fcd||(typeof D!=="undefined"&&D)||(typeof PV!=="undefined"&&PV.st!=="idle")){await sSay(["Ahora mismo no puedes combatir (tienes otro combate o un reto PVP pendiente)."]);return null}
  const own0=cfg.cap?(S.owned[cfg.cap]||0):0,m0=EX.map;exBattle(cfg,null);const b=EX.battle;
  while(EX.battle===b||!EX.on)await sW(250);await sW(400);
  if(cfg.cap&&(S.owned[cfg.cap]||0)>own0)return "cap";
  if(EX.map!==m0)return null;// tus Pokémon se debilitaron y has vuelto al Centro Pokémon
  return b.win?true:false}
const sTr=(names,b,nm,look)=>({eteam:sTeam(names,typeof ROLE==="function"?ROLE(nm):b),trainer:nm,tsrc:{k:exTrKey(nm),n:nm}});
// elección con botones (por ejemplo, el Pokémon inicial)
function sChoice(title,opts){return new Promise(res=>{const box=$("exCh");if(!box){res(0);return}EX.choice=1;
  box.innerHTML='<b>'+esc(title)+'</b><div>'+opts.map((o,i)=>'<button type="button" data-ch="'+i+'"'+(i?'':' class="on"')+'>'+(o.img||"")+'<span>'+esc(o.t)+'</span>'+(o.s?'<small>'+esc(o.s)+'</small>':'')+'</button>').join("")+'</div>';box.hidden=false;
  const done=i=>{box.hidden=true;EX.choice=0;document.removeEventListener("keydown",kd,true);snd("ui");res(i)};
  const kd=e=>{const bs=[...box.querySelectorAll("button")],cur=bs.findIndex(b=>b.classList.contains("on")),a=exAct(e.key);
    if(["l","u"].includes(a)||e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();e.stopPropagation();bs[cur].classList.remove("on");bs[(cur-1+bs.length)%bs.length].classList.add("on");snd("ui")}
    else if(["r","d"].includes(a)||e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();e.stopPropagation();bs[cur].classList.remove("on");bs[(cur+1)%bs.length].classList.add("on");snd("ui")}
    else if(a==="a"||e.key==="Enter"){e.preventDefault();e.stopPropagation();done(cur)}
    else if(e.key==="Escape"){e.preventDefault();e.stopPropagation();done(bs.length-1)}};
  document.addEventListener("keydown",kd,true);box.querySelectorAll("button").forEach(b=>b.onclick=()=>done(+b.dataset.ch))})}
// cartel de capítulo
async function sCard(k){const c=STO_CH[k],box=$("exCard");if(!box||!c)return;box.innerHTML='<small>'+esc(c.c)+'</small><b>'+esc(c.t)+'</b>';box.hidden=false;box.classList.remove("in");void box.offsetWidth;box.classList.add("in");snd("lvl");await sW(2600);box.hidden=true}
// ---------- ejecución de escenas (una a la vez; nada de moverse mientras tanto) ----------
async function stRun(fn){if(EX.cut)return;EX.cut=1;EX.keys={};EX.kst=[];try{await fn()}catch(e){console.error(e)}finally{EX.cut=0;EX.alert=null;stRefresh();stHud();save()}}
function stTeamAdd(n){S.team=S.team||[];const i=S.team.findIndex(x=>!x||!S.owned[x]);if(i>=0)S.team[i]=n;else if(S.team.length<6)S.team.push(n);try{updTeam()}catch(e){}}
// ================= GUION =================
const STX={};
// --- prólogo: mamá te despierta ---
STX.intro=()=>stRun(async()=>{await sFade("fade",300);exLoad("casa",2,3,"r");EX.banner=null;await sFade("fadein",700);await sCard(0);
  const m=stN("mama");
  await sSay(S_("Mamá","¡Por fin te despiertas! ¡Hoy es el gran día!","La Profesora Vega ha llamado esta mañana. Dice que tiene algo muy importante que pedirte.","Su laboratorio es el edificio blanco de la parte de arriba del pueblo.","Ah, y llévate esto. ¡Una entrenadora o un entrenador nunca sale sin Pociones!"));
  await sSay(["¡Recibes "+sGive({it:{pot:5}})+"!"]);
  await sSay(S_("Mamá","Si tus Pokémon se cansan, vuelve a casa a descansar. ¡Te espero con la comida hecha!"));
  sStep(1)});
STX.mama=()=>stRun(async()=>{const s=stSt().s,t=stSt();
  const ln=s<2?["La Profesora Vega te espera en su laboratorio. ¡No la hagas esperar!"]:s<6?["¿Qué tal el viaje? Dicen que hay gente muy rara con capas moradas por las rutas… ¡Ten cuidado!"]:s<9?["¿Has visto esas luces sobre la Cima Aurora? Toda la región habla de ello…"]:["¡Estoy muy orgullosa de ti! Has salvado a toda la región de Alba."];
  await sSay(S_("Mamá",...ln));
  if(t.hd!==today()){t.hd=today();stHeal();await sSay(S_("Mamá","¡Tienes cara de cansancio! Descansa un poco."));await sFade("fade",400);snd("heal");await sW(500);await sFade("fadein",500);await sSay(["¡Tus Pokémon se han recuperado por completo!"])}
  else await sSay(S_("Mamá","Hoy ya has descansado en casa. Si lo necesitas, el Centro Pokémon está al lado del estanque."))});
function stHeal(){const N=(S.team||[]).filter(n=>n&&S.owned[n]);N.forEach(n=>{delete S.hp[n];if(S.pp)delete S.pp[n]});save();try{updTeam();render()}catch(e){}}
// --- laboratorio: el Pokémon inicial y el primer combate contra Dani ---
const STARTERS=[["Bulbasaur","Planta"],["Charmander","Fuego"],["Squirtle","Agua"]],RIVAL_OF={Bulbasaur:"Charmander",Charmander:"Squirtle",Squirtle:"Bulbasaur"};
STX.lab1=()=>stRun(async()=>{const v=stN("vega");await sSay(S_("Profesora Vega","¡Ah, ya estás aquí! Te doy la bienvenida al laboratorio. Soy la Profesora Vega.","Estudio la Piedra Aurora, una roca antiquísima de la región de Alba.","Según las leyendas, si se le devuelven sus tres Escamas, el guardián de la región despierta junto al lago de la Cima Aurora.","Hace unos días, un grupo que se hace llamar Equipo Ocaso empezó a buscar esas Escamas por todas partes…","Necesito a alguien valiente que vigile las rutas y me cuente lo que vea. ¡Y he pensado en ti!","Para el viaje quiero regalarte un compañero. Elige uno de estos tres Pokémon."));
  // el Pokémon inicial se elige una sola vez (si la escena se repite, ya lo tienes)
  if(!stSt().f.st){const i=await sChoice("Elige tu compañero de viaje",STARTERS.map(s=>({t:s[0],s:s[1],img:ico(PM[s[0]],56)})));
    const st=STARTERS[i][0],lv=5;stSt().f.st=st;stSt().f.rv=RIVAL_OF[st];xgGive(st,lv);save();snd("capok");
    await sSay(["¡Has recibido a "+st+" (Nv. "+lv+")!",st+" se ha unido a tu equipo."])}
  else await sSay(S_("Profesora Vega","Veo que "+stSt().f.st+" y tú ya os lleváis de maravilla."));
  snd("ui");const d=sAdd("dani",7,9,"u","Dani",STO_L.dani);await sW(300);sFaceTo(d);
  await sSay(S_("Dani","¡Profe! ¡Perdón, perdón, me he dormido!","¿Eh? ¿Ya has elegido? Entonces yo me quedo con "+stSt().f.rv+". ¡Le tengo ventaja al tuyo!"));
  await sApproach(d);
  await sSay(S_("Dani","¡Vamos a probarlos ahora mismo! ¡Combate!"));
  stHeal();EX.noFaint=1;let r;try{r=await sBattle(sTr([stSt().f.rv],0,"Dani",STO_L.dani))}finally{EX.noFaint=0}
  if(r===null)r=false;stHeal();// como en los juegos: el primer combate no se pierde nada, y la Profesora cura a tu Pokémon
  await sSay(S_("Dani",...(r?["¡¿Qué?! ¡He perdido! Bueno… ¡la próxima vez te ganaré seguro!"]:["¡Toma ya! ¡He ganado! No te preocupes, es tu primer combate."])));
  await sSay(S_("Profesora Vega","¡Qué combate más emocionante! Se nota que vais a ser buenos rivales.","Mi ayudante, Lía, ha salido hacia la Ruta 1. Sal del pueblo por el este y búscala, por favor.","¡Y toma esto para el camino!"));
  await sSay(["¡Recibes "+sGive({t:5000,it:{pb:10}})+"!"]);
  await sSay(S_("Dani","¡Yo me voy por mi cuenta! ¡Nos vemos!"));await sFade("fade",350);sDel("dani");snd("ui");await sFade("fadein",350);sStep(2)});
STX.vega=()=>stRun(async()=>{const s=stSt().s;const L={2:"Lía está en la Ruta 1, al este del pueblo. ¡Ve a buscarla!",3:"Lía me ha contado lo de la ruta… El Equipo Ocaso se ha metido en el Bosque Verde. ¡Ten mucho cuidado!",4:"Si ese grupo busca las Escamas, irán a la Cueva Roca.",5:"¡La última Escama está en la Playa Coral!",6:"¡El guardián ha volado a la Cima Aurora! El camino sale del norte del pueblo.",7:"¡El guardián te espera junto al lago de la Cima!",9:"Gracias a ti, la Piedra Aurora vuelve a estar a salvo. ¡Sigue completando tu Pokédex!"};
  await sSay(S_("Profesora Vega",L[s]||"¡Sigue así!"))});
STX.lia=()=>stRun(async()=>{await sSay(S_("Lía","Estoy apuntando todo lo que el Equipo Ocaso hace por la región.","Por lo que he visto, su líder se llama Noctis… y su mano derecha es la comandante Bruma."))});
// --- capítulo 1: Ruta 1 ---
STX.ruta2=()=>stRun(async()=>{const l=stN("lia"),g=stN("g1");if(!g)return;
  await sSay(S_("Lía","¡Socorro! ¡Ese tipo quiere llevarse a los Pokémon que estaba estudiando!"));
  await sSay(S_("Recluta","¡Apártate! El Equipo Ocaso necesita la energía de todos los Pokémon de la región.","¿Y tú quién eres? ¿Vienes a molestar? ¡Pues te enseñaré lo que es bueno!"));
  await sApproach(g);
  const r=await sBattle(sTr(["Zubat","Rattata"],0,"Recluta del Equipo Ocaso",STO_L.ocaso));
  if(!r){if(r===false)await sSay(S_("Recluta","¡Ja! Vuelve cuando seas más fuerte."));return}
  await sSay(S_("Recluta","¡No puede ser! ¡La comandante Bruma me va a castigar!","¡Me largo al Bosque Verde con los demás!"));
  snd("ui");await sFlash(1);sDel("g1");
  sFaceTo(l);await sApproach(l);
  await sSay(S_("Lía","¡Gracias! Soy Lía, la ayudante de la Profesora Vega.","El Equipo Ocaso está capturando Pokémon en el Bosque Verde, al este de esta ruta.","Toma, seguro que te vienen bien."));
  await sSay(["¡Recibes "+sGive({t:5000,it:{sb:5}})+"!"]);
  await sSay(S_("Lía","Yo voy a avisar a la Profesora. ¡Ten cuidado en el bosque!"));await sFade("fade",300);sDel("lia");await sFade("fadein",300);sStep(3)});
// --- capítulo 2: Bosque Verde ---
const GRUNT_TXT={g3a:["¡Alto ahí! Nadie entra en el bosque mientras trabajamos."],g3b:["¿Otra vez tú? ¡Los Pokémon de este bosque son nuestros!"],g4c:["¡Shhh! Estamos buscando algo muy valioso en esta cueva."],g4d:["¡La comandante dijo que no dejáramos pasar a nadie!"],g5e:["¡La playa está cerrada por orden del Equipo Ocaso!"],g5f:["¡El jefe Noctis está ocupado! ¡Fuera de aquí!"],g6g:["¡El amanecer eterno… digo, el ocaso eterno está a punto de llegar!"],g6h:["¡No subirás a la cima mientras yo esté aquí!"]};
const GRUNT_TEAM={g3a:["Ekans","Zubat"],g3b:["Koffing","Grimer"],g4c:["Houndour","Sableye"],g4d:["Zubat","Murkrow"],g5e:["Carvanha","Murkrow"],g5f:["Houndour","Grimer","Zubat"],g6g:["Zorua","Pawniard"],g6h:["Skorupi","Carvanha","Zubat"]};
const GRUNT_B={g3a:0,g3b:0,g4c:1,g4d:1,g5e:2,g5f:2,g6g:3,g6h:3};
STX.grunt=id=>stRun(async()=>{const g=stN(id);if(!g)return;await sApproach(g);await sSay(S_("Recluta",...GRUNT_TXT[id]));
  const r=await sBattle(sTr(GRUNT_TEAM[id],GRUNT_B[id],"Recluta del Equipo Ocaso",STO_L.ocaso));
  if(!r){if(r===false)await sSay(S_("Recluta","¡Ja! ¡El Equipo Ocaso es invencible!"));return}
  stSt().f[id]=1;await sSay(S_("Recluta","¡Uf! Eres demasiado fuerte… ¡Me retiro!"));await sSay(["¡Recibes "+sGive({t:4000})+"!"]);await sFlash(1);sDel(id);snd("ui");save()});
STX.bruma3=()=>stRun(async()=>{const b=stN("bruma");await sApproach(b);
  await sSay(S_("Bruma","Vaya, vaya… ¿Así que tú eres quien está molestando a mis reclutas?","Soy Bruma, comandante del Equipo Ocaso. Y no me gusta que se metan en mis asuntos.","Ya tenemos la primera Escama de la Piedra Aurora. ¡Las demás no tardarán en ser nuestras!"));
  const r=await sBattle(sTr(["Poochyena","Zubat","Koffing"],1,"Comandante Bruma",STO_L.bruma));
  if(!r){if(r===false)await sSay(S_("Bruma","Hmpf. Lo sabía. Vuelve a casa, aquí no pintas nada."));return}
  await sSay(S_("Bruma","…Interesante. Tienes más talento del que parece.","Pero da igual. La segunda Escama está escondida en lo más profundo de la Cueva Roca.","Cuando tengamos las tres, el cielo de Alba se teñirá de ocaso para siempre… ¡y el guardián obedecerá a Noctis!"));
  await sFlash(2);sDel("bruma");await sSay(["Bruma desaparece entre una nube de humo morado…","¡Recibes "+sGive({t:15000,it:{cand:2}})+"!"]);
  await sSay(["Los Pokémon del bosque salen de sus escondites. ¡Parecen muy contentos!","Ahora el Equipo Ocaso irá a la Cueva Roca, al norte de la Ruta 1."]);sStep(4)});
// --- capítulo 3: Cueva Roca ---
STX.bruma4=()=>stRun(async()=>{const b=stN("bruma");await sApproach(b);
  await sSay(S_("Bruma","¡Otra vez tú! ¿Es que no te cansas nunca?","La Escama Celeste está aquí mismo, en este altar. ¡No dejaré que me la quites!"));
  const r=await sBattle(sTr(["Poochyena","Golbat","Koffing","Sneasel"],2,"Comandante Bruma",STO_L.bruma));
  if(!r){if(r===false)await sSay(S_("Bruma","¡Ja! Más suerte la próxima vez."));return}
  await sSay(S_("Bruma","¡Grr! ¡Está bien, quédate con la Escama!","Pero el jefe Noctis ya tiene la tercera… ¡y te está esperando en la Playa Coral!"));
  await sFlash(2);sDel("bruma");await sSay(["Bruma huye por un pasadizo de la cueva…"]);
  stSt().f.esc=1;await sSay(["En el altar brilla una escama azul clara, fría como el hielo…","¡Has conseguido la ESCAMA CELESTE!","¡Recibes también "+sGive({t:25000,it:{ub:5}})+"!"]);
  const d=sAdd("dani",14,14,"u","Dani",STO_L.dani);snd("ui");await sSay(S_("Dani","¡Eh! ¡Por fin te encuentro!"));await sApproach(d);
  await sSay(S_("Dani","La Profe me lo ha contado todo. ¡Has plantado cara al Equipo Ocaso tú solo!","Antes de seguir… ¡quiero ver cuánto has mejorado! ¡Combate!"));
  const r2=await sBattle(sTr(["Pidgey","Abra",stSt().f.rv],1,"Dani",STO_L.dani));
  await sSay(S_("Dani",...(r2?["¡Increíble! Cada vez eres más fuerte… ¡Me has dejado sin palabras!"]:["¡Esta vez he ganado yo! Pero no te desanimes, ¿eh?"]),"Yo voy a avisar a la Profe. Noctis te espera en la Playa Coral, al sur de la Ruta 1. ¡Prepárate bien!"));
  await sWalkN(d,"dd");sDel("dani");sStep(5)});
// --- capítulo 4: Playa Coral ---
STX.noctis5=()=>stRun(async()=>{const n=stN("noctis");await sApproach(n);
  await sSay(S_("Noctis","Así que eres tú quien tanto molesta a Bruma.","Soy Noctis, líder del Equipo Ocaso.","Cuando la Piedra Aurora reciba sus tres Escamas, su guardián despertará… y yo seré quien lo controle.","Un cielo de ocaso eterno, sin amaneceres. Un mundo tranquilo, sin sorpresas. ¿No te parece perfecto?","Dame la Escama Celeste que llevas. ¿No? Entonces te la quitaré."));
  const r=await sBattle(sTr(["Murkrow","Houndour","Absol","Sableye"],3,"Líder Noctis",STO_L.noctis));
  if(!r){if(r===false)await sSay(S_("Noctis","Todavía no estás a mi altura. Vuelve cuando lo estés."));return}
  await sSay(S_("Noctis","…Qué fuerza tan extraña tienes.","Pero no importa. Con dos Escamas me basta para empezar."));
  await sSay(["Noctis levanta dos escamas brillantes hacia el cielo…"]);await sFlash(5);snd("wild");
  await sSay(["¡Un rugido enorme recorre toda la playa!","¡Un Pokémon rojo y blanco cruza el cielo a toda velocidad hacia el norte!"]);
  await sSay(S_("Noctis","¡El guardián ha despertado! ¡Ha volado hacia la Cima Aurora!","Te espero allí arriba. Esta vez no habrá nadie que me detenga."));
  await sFlash(2);sDel("noctis");await sSay(["¡Recibes "+sGive({t:40000,it:{cand:2}})+"!"]);
  await sSay(["La Cima Aurora está al norte de Pueblo Brisa.","¡Prepara bien a tu equipo!"]);sStep(6)});
// --- capítulo 5: Cima Aurora ---
STX.bruma6=()=>stRun(async()=>{const b=stN("bruma");await sApproach(b);
  await sSay(S_("Bruma","Has llegado hasta aquí… Esta es tu última oportunidad de dar media vuelta.","¡No permitiré que estropees el plan de Noctis!"));
  const r=await sBattle(sTr(["Mightyena","Weezing","Golbat","Sneasel"],3,"Comandante Bruma",STO_L.bruma));
  if(!r){if(r===false)await sSay(S_("Bruma","¡Ja! Baja de la montaña antes de que te hagas daño."));return}
  stSt().f.b6=1;await sSay(S_("Bruma","…Ya no sé si lo que hacemos está bien.","Noctis está junto al lago. Ve. Yo no te detendré."));await sSay(["¡Recibes "+sGive({t:30000})+"!"]);await sWalkN(b,"r");sDel("bruma")});
STX.noctis6=()=>stRun(async()=>{const n=stN("noctis");await sApproach(n);
  await sSay(S_("Noctis","Llegas justo a tiempo para ver el último amanecer de Alba.","Mira el lago. El guardián, Latias, está a punto de obedecerme.","¡Dame la Escama Celeste y todo terminará!"));
  const r=await sBattle(sTr(["Honchkrow","Houndoom","Absol","Crobat","Zoroark","Tyranitar"],5,"Líder Noctis",STO_L.noctis));
  if(!r){if(r===false)await sSay(S_("Noctis","Era de esperar. Nadie puede detener el ocaso."));return}
  await sSay(S_("Noctis","…No lo entiendo. He perdido."));snd("wild");await sFlash(4);
  await sSay(["¡Latias lanza un grito agudo sobre el lago!","Las dos escamas se escapan de las manos de Noctis y vuelan hacia el altar…"]);
  await sSay(S_("Noctis","Las Escamas… vuelven a la Piedra Aurora por sí solas.","Este Pokémon nunca me habría obedecido. Solo responde a quien de verdad cuida de los demás.","El Equipo Ocaso se disuelve hoy. Lo siento mucho… por todo."));
  await sFlash(2);sDel("noctis");await sSay(["Noctis baja de la montaña en silencio.","¡Recibes "+sGive({t:80000,it:{mb:1}})+"!"]);
  stSt().f.esc=2;sStep(7);await sW(300);await STX.latias(true)});
STX.latias=inner=>{const go=async()=>{
  await sSay(["Colocas la Escama Celeste en el altar. ¡La Piedra Aurora brilla con todos los colores del amanecer!","Latias desciende despacio y te mira fijamente…","¡Parece que quiere ponerte a prueba!"]);
  const m=mkEnemy(PM.Latias,clampL(sLv(5)));m.mx=Math.round(m.mx*1.3);m.mh=m.mx;
  const r=await sBattle({eteam:[m],cap:"Latias"},"wild");
  if(r===null)return;
  if(r===false){await sSay(["Latias vuelve a volar sobre el lago. Te sigue observando…","(Cura a tu equipo y vuelve a acercarte al altar.)"]);return}
  if(r!=="cap")xgGive("Latias",m.l);else stTeamAdd("Latias");await sSay(["Latias se acerca y apoya la cabeza en tu hombro.","¡Latias se ha unido a ti! ¡Ahora es tu compañera!","Vuelve a Pueblo Brisa y cuéntaselo todo a la Profesora Vega."]);sStep(8)};
  return inner?go():stRun(go)};
// --- epílogo ---
STX.lab8=()=>stRun(async()=>{await sCard(6);const v=stN("vega");const d=sAdd("dani",8,6,"l","Dani",STO_L.dani);
  await sSay(S_("Profesora Vega","¡Has vuelto! Lía y Dani me lo han contado todo.","Detuviste al Equipo Ocaso, devolviste las Escamas a la Piedra Aurora… ¡y el guardián de Alba te eligió a ti!","Eres el orgullo de Pueblo Brisa. Toma, te lo has ganado."));
  await sSay(["¡Recibes "+sGive({t:150000,it:{mb:1,cand:5}})+"!"]);
  sFaceTo(d);await sSay(S_("Dani","¡Eh! ¡No te vayas todavía!","He entrenado sin parar mientras estabas en la cima. ¡Quiero un último combate de verdad!"));
  const r=await sBattle(sTr(["Pidgey","Abra","Eevee","Growlithe",stSt().f.rv],3,"Dani",STO_L.dani));
  await sSay(S_("Dani",...(r?["¡Jaja! Ya no hay duda: ¡eres la mejor persona entrenadora de toda Alba!"]:["¡Por fin te gano! Pero sé que la Cima Aurora era mucho más difícil que yo."]),"A partir de ahora estaré en la plaza del pueblo. ¡Ven a combatir conmigo cada día!"));
  await sSay(S_("Profesora Vega","Y ahora… ¡a seguir explorando! La región de Alba todavía guarda muchos secretos."));
  sStep(9);sDel("dani");await stCredits()});
async function stCredits(){const box=$("exEnd");if(!box)return;snd("win");
  box.innerHTML='<div class="exroll"><b class="exfin">LA LEYENDA DE LA PIEDRA AURORA</b><p>Región de Alba</p><p><i>Protagonista</i><br>'+esc(S.nick||"Tú")+'</p><p><i>Compañera legendaria</i><br>Latias</p><p><i>Rival</i><br>Dani</p><p><i>Profesora</i><br>Vega · con la ayuda de Lía</p><p><i>Equipo Ocaso</i><br>Noctis · Bruma · y sus reclutas</p><p><i>Mamá</i><br>Siempre esperando en Pueblo Brisa</p><b class="exfin">¡GRACIAS POR JUGAR!</b><p>Poke Gacha Online</p></div><button type="button" class="red" id="exEndX">Seguir explorando</button>';
  box.hidden=false;await new Promise(r=>{$("exEndX").onclick=()=>{box.hidden=true;snd("ui");r()}})}
// --- después de la historia: Dani te reta cada día ---
STX.dani9=()=>stRun(async()=>{const d=stN("dani"),t=stSt();if(t.dd===today()){await sSay(S_("Dani","¡Hoy ya hemos combatido! Mañana te espero aquí otra vez."));return}
  await sSay(S_("Dani","¡Hola! ¿Combate diario? ¡Esta vez pienso ganarte!"));
  const r=await sBattle(sTr(["Pidgey","Abra","Eevee","Growlithe","Lapras",t.f.rv],4,"Dani",STO_L.dani));if(r===null)return;t.dd=today();
  if(r){await sSay(S_("Dani","¡Otra vez me ganas! Toma, te lo has ganado."));await sSay(["¡Recibes "+sGive({t:30000,it:{cand:1}})+"!"])}else await sSay(S_("Dani","¡Gané! ¡Mañana te doy la revancha!"))});
// --- gente del pueblo ---
STX.v1=()=>stRun(async()=>{const s=stSt().s;await sSay(S_("Vecina",s<2?"¡Buenos días! ¿Vas al laboratorio? La Profesora lleva días sin dormir estudiando esa piedra.":s<9?"Dicen que el Equipo Ocaso lleva capas moradas… ¡Qué miedo!":"¡Eres la estrella del pueblo! Todo el mundo habla de ti."))});
STX.v2=()=>stRun(async()=>{const s=stSt().s;await sSay(S_("Niño",s<5?"En el estanque a veces salta un Magikarp. ¡Yo quiero pescar uno!":s<8?"¡He visto un Pokémon rojo y blanco volando hacia la cima! ¡Era enorme!":"¿Es verdad que Latias es tu amiga? ¡Qué envidia!"))});
STX.v3=()=>stRun(async()=>{await sSay(S_("Abuelo","Cuando yo era joven, contaban que la Piedra Aurora solo brilla para los corazones sinceros.","Si tus Pokémon se debilitan en una ruta, volverás corriendo al Centro Pokémon de aquí al lado."))});
STX.enf=()=>stRun(async()=>{const t=stSt(),N=(S.team||[]).filter(n=>n&&S.owned[n]);
  await sSay(S_("Enfermera","¡Hola! Te damos la bienvenida al "+(EX.M&&EX.M.n&&EX.M.n!=="Centro Pokémon"?EX.M.n:"Centro Pokémon de Pueblo Brisa")+"."));
  const free=t.hd!==today();const i=await sChoice(free?"¿Curar a tus Pokémon? (hoy la primera cura es gratis)":"¿Curar a tus Pokémon por "+fmt(HEAL_COST)+" 🎟️?",[{t:"Sí, por favor"},{t:"No, gracias"}]);
  if(i!==0){await sSay(S_("Enfermera","¡Esperamos verte pronto!"));return}
  if(!free&&S.t<HEAL_COST){await sSay(S_("Enfermera","Lo siento, no tienes tickets suficientes. Hoy ya usaste la cura gratuita (también la de casa)."));return}
  if(free)t.hd=today();else{S.t-=HEAL_COST;try{qEv("heal")}catch(e){}}
  await sSay(S_("Enfermera","¡Muy bien! Deja tus Poké Balls aquí un momento…"));snd("heal");try{healJingle()}catch(e){}await sFade("fade",350);stHeal();await sW(900);await sFade("fadein",450);
  await sSay(S_("Enfermera","¡Tus Pokémon están totalmente recuperados! ¡Esperamos verte pronto!"))});
// ---------- qué pasa al hablar con cada personaje ----------
function stTalk(n){const s=stSt().s,id=n.sid;
  if(id==="mama")return s===0?STX.intro():STX.mama();
  if(id==="vega")return s<=1?STX.lab1():s===8?STX.lab8():STX.vega();
  if(id==="lia")return EX.map==="ruta"?STX.ruta2():STX.lia();
  if(id==="g1")return STX.ruta2();
  if(GRUNT_TEAM[id])return STX.grunt(id);
  if(id==="bruma")return s===3?STX.bruma3():s===4?STX.bruma4():STX.bruma6();
  if(id==="noctis")return s===5?STX.noctis5():STX.noctis6();
  if(id==="dani")return STX.dani9();
  if(STX[id])return STX[id]()}
// al entrar en un mapa
function stEnter(m){const s=stSt().s;if(EX.cut||EX.title)return;
  if(m==="lab"&&s===1)return STX.lab1();if(m==="lab"&&s===8)return STX.lab8();
  const cs={ruta:[2,1],bosque:[3,2],cueva:[4,3],playa:[5,4],cima:[6,5]}[m];if(cs&&s===cs[0]&&!stSt().f["c"+cs[1]]){stSt().f["c"+cs[1]]=1;save();stRun(()=>sCard(cs[1]))}}
// el personaje de la historia te ve
function stSight(){if(EX.cut)return false;for(const n of EX.npcs){if(!n.story||!n.sight)continue;const[dx,dy]=EXDIR[n.f];
  for(let i=1;i<=n.sight;i++){const x=n.px+dx*i,y=n.py+dy*i;if(x===EX.x&&y===EX.y){stRun(async()=>{await sAlert(n)}).then(()=>stTalk(n));return true}if(EXBLK.includes(exAt(x,y))||EX.npcs.some(q=>q!==n&&q.px===x&&q.py===y))break}}return false}
// ---------- integración con el motor de exploración ----------
{const _l=exLoad;exLoad=function(m,x,y,f){const r=_l.apply(this,arguments);try{stRefresh();clearTimeout(EX.stT);EX.stT=setTimeout(()=>{if(EX.map===m)stEnter(m)},650)}catch(e){console.error(e)}return r}}
{const _a=exArrive;exArrive=function(){if(EX.cut){const st=exSt();st.x=EX.x;st.y=EX.y;st.f=EX.f;return}
  const s=stSt().s;if(EX.map==="cima"&&s===7&&EX.x===14&&EX.y===8){const st=exSt();st.x=EX.x;st.y=EX.y;st.f=EX.f;EX.f="u";STX.latias();return}
  const r=_a.apply(this,arguments);if(!EX.dlg&&!EX.trans&&!EX.walkTo&&!EX.alert)stSight();return r}}
{const _i=exInteract;exInteract=function(){if(EX.cut&&!EX.dlg)return;if(EX.dlg||EX.mv||EX.trans)return _i.apply(this,arguments);
  const[dx,dy]=EXDIR[EX.f];let x=EX.x+dx,y=EX.y+dy;if(exAt(x,y)==="Y"){x+=dx;y+=dy}// se habla por encima del mostrador
  const n=EX.npcs.find(q=>q.story&&q.px===x&&q.py===y);if(n){n.f=OPP[EX.f];stTalk(n);return}
  const c=exAt(EX.x+dx,EX.y+dy);
  if(c==="A"){const s=stSt().s;if(EX.map==="cima"&&s===7)return STX.latias();
    return stRun(()=>sSay(EX.map==="cima"?(s>=8?["La Piedra Aurora brilla con calma. Latias vuela feliz sobre el lago."]:["Una gran roca de cristal… La Piedra Aurora. Le faltan sus tres Escamas."]):EX.map==="cueva"?(stSt().f.esc?["Un altar de piedra vacío. Aquí estaba la Escama Celeste."]:["En el altar brilla algo azul… pero el Equipo Ocaso lo vigila."]):["Un pequeño altar de piedra mirando al mar. Tiene grabado un Pokémon con alas."]))}
  if(EX.map==="casa"&&c==="V")return stRun(()=>sSay(["En la tele hablan de unas luces extrañas sobre la Cima Aurora…"]));
  if(EX.map==="casa"&&c==="Q")return stRun(()=>sSay(["Tu cama. Todavía está calentita."]));
  if(EX.map==="lab"&&(c==="Z"||c==="V"))return stRun(()=>sSay(c==="Z"?["Libros sobre Pokémon legendarios: «El guardián de Alba vuela más rápido que un avión a reacción»."]:["Una máquina llena de luces que analiza la energía de la Piedra Aurora."]));
  if(EX.map==="centro"&&c==="Z")return stRun(()=>sSay(["Folletos: «¡Completa tu Pokédex en la región de Alba!»."]));
  return _i.apply(this,arguments)}}
// durante las escenas el jugador no se mueve (pero los personajes, los fundidos y los pasos de la escena sí)
{const _u=exUpdate;exUpdate=function(dt,ts){if(!EX.cut||EX.title)return _u.apply(this,arguments);
  EX.npcs.forEach(n=>{if(n.mv)exNpcStep(n,dt)});
  if(EX.trans){EX.trans.t+=dt;if(EX.trans.t>=EX.trans.d){const f=EX.trans.done;EX.trans=null;f&&f()}return}
  if(EX.mv){EX.mv.t+=dt;const p=Math.min(1,EX.mv.t/EX.mv.d);EX.px=EX.mv.x0+(EX.x-EX.mv.x0)*p;EX.py=EX.mv.y0+(EX.y-EX.mv.y0)*p;EX.dist=(EX.dist||0)+dt/EX.mv.d;if(p>=1){EX.mv=null;EX.px=EX.x;EX.py=EX.y}}}}
// el prólogo empieza al pulsar «Iniciar» la primera vez
{const _g=exGo;exGo=function(){const was=EX.title;const r=_g.apply(this,arguments);if(was)setTimeout(()=>{if(EX.cut)return;if(stSt().s===0)STX.intro();else stEnter(EX.map)},350);return r}}
// si tus Pokémon se debilitan, vuelves corriendo al Centro Pokémon de Pueblo Brisa
function exFaint(){const st=exSt();st.m="centro";st.x=7;st.y=6;st.f="u";EX.map=null;EX.pend.push(["¡Tus Pokémon se han debilitado!","Vuelves corriendo al Centro Pokémon de Pueblo Brisa… Habla con la enfermera para curarlos."])}
// ---------- objetivo en pantalla, portada y capas de la historia ----------
function stHud(){const o=$("exObj");if(!o)return;const s=stSt().s,ob=STO_OBJ[s];if(!ob||EX.title){o.hidden=true;return}o.hidden=false;const ch=STO_CH[ob[0]];
  const h='<small>📜 '+esc(ch.c)+' · '+esc(ch.t)+'</small><b>'+esc(ob[1])+'</b>';if(o._h!==h){o._h=h;o.innerHTML=h;o.classList.remove("new");void o.offsetWidth;o.classList.add("new")}}
{const _t=exTitleUI;exTitleUI=function(){const r=_t.apply(this,arguments);try{const w=$("exWhere");if(w&&EX.title){const s=stSt().s,ob=STO_OBJ[s],ch=STO_CH[ob[0]];w.textContent=(s===0?"📜 ¡Nueva historia! La leyenda de la Piedra Aurora":"📜 "+ch.c+": "+ch.t)+" · "+w.textContent}}catch(e){}stHud();return r}}
{const _x=exUI;exUI=function(){const r=_x.apply(this,arguments);const sc=document.querySelector("#explPB .exscr");
  if(sc&&!$("exObj")){sc.insertAdjacentHTML("beforeend",'<div id="exObj" class="exobj" hidden></div><div id="exCh" class="exch" hidden></div><div id="exCard" class="excard" hidden></div><div id="exEnd" class="exend" hidden></div>')}
  stHud();return r}}
setInterval(()=>{if(EX.on)stHud()},1500);
// ---------- dibujo: interiores, edificios, altar, Pokémon legendario y Poké Balls del laboratorio ----------
function xFloor(fl,x,y){const v=(x*7+y*3)%4,k="FL"+fl+v+(y%2);if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  if(fl==="wood"){xr(g,0,0,32,32,"#c99560");for(let r=0;r<4;r++){xr(g,0,r*8,32,1,"#a9733e");const o=((r+y)%2)*16+(v*5)%16;xr(g,o,r*8,1,8,"#a9733e");xr(g,0,r*8+1,32,1,"#d9a874")}xr(g,4+v*6,5,2,1,"#9a6634")}
  else if(fl==="tile"){xr(g,0,0,32,32,"#e8edf4");xr(g,0,0,32,1,"#cfd7e3");xr(g,0,16,32,1,"#cfd7e3");xr(g,0,0,1,32,"#cfd7e3");xr(g,16,0,1,32,"#cfd7e3");xr(g,2,2,6,1,"#fff");xr(g,18,18,6,1,"#fff")}
  else{xr(g,0,0,32,32,"#f6ead6");for(let i=0;i<32;i+=8)xr(g,i,0,1,32,"#efe0c6");xr(g,0,31,32,1,"#e6d4b6")}
  return XG[k]=c}
function xWall(fl,x,y){const win=y===1&&x%5===2,k="WL"+fl+y+(win?"w":"")+(x%2);if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  const wp=fl==="wood"?["#f4e2bc","#e8d0a0"]:fl==="tile"?["#eef3f8","#dde6ef"]:["#ffe3e6","#f7cdd2"];
  if(y===0){xr(g,0,0,32,32,fl==="wood"?"#8a5a34":fl==="tile"?"#7a8aa0":"#c9505a");xr(g,0,26,32,6,"#2b2440");xr(g,0,24,32,2,"rgba(255,255,255,.25)")}
  else{xr(g,0,0,32,32,wp[0]);for(let i=x%2*4;i<32;i+=8)xr(g,i,0,2,26,wp[1]);xr(g,0,26,32,6,fl==="wood"?"#8a5a34":"#9aa6b8");xr(g,0,26,32,1,"#2b2440");
    if(win){xr(g,4,3,24,18,"#2b2440");xr(g,6,5,20,14,"#9fdcff");xr(g,6,5,20,4,"#d8f2ff");xr(g,15,5,2,14,"#fff");xr(g,6,11,20,2,"#fff");xr(g,3,20,26,3,"#c9b28a")}}
  return XG[k]=c}
function xRug(x,y,mat){const m=xMask(x,y,q=>q==="R"),k="RG"+m+(mat?"m":"");if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  if(mat){xr(g,0,0,32,32,"#c99560");xr(g,3,6,26,22,"#2b2440");xr(g,4,7,24,20,"#3a8a4a");xr(g,6,9,20,16,"#4aa85a");xr(g,8,15,16,2,"#2f6e3a");return XG[k]=c}
  xr(g,0,0,32,32,"#c8414f");for(let i=0;i<32;i+=4)xr(g,i,(i/4)%2?8:22,2,2,"#e8737e");
  const b="#ffd36a";if(!(m&1))xr(g,0,0,32,3,b);if(!(m&4))xr(g,0,29,32,3,b);if(!(m&8))xr(g,0,0,3,32,b);if(!(m&2))xr(g,29,0,3,32,b);return XG[k]=c}
function xIntObj(ch,fl,x){const k="IO"+ch+fl+(x%3);if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d"),ink="#2b2440";
  const sh=()=>xdisc(g,16,45,13,3,"rgba(0,0,0,.22)");
  if(ch==="Y"){sh();if(fl==="clean"){xr(g,0,14,32,30,ink);xr(g,1,15,30,28,"#fff");xr(g,1,15,30,6,"#ff8a94");xr(g,1,21,30,2,"#c8414f");xr(g,1,38,30,5,"#e6d4d8")}
    else if(fl==="tile"){xr(g,0,18,32,26,ink);xr(g,1,19,30,24,"#f4f7fb");xr(g,1,19,30,5,"#c9d4e4");xr(g,1,39,30,4,"#9aa6b8")}
    else{xr(g,1,20,30,12,ink);xr(g,2,21,28,10,"#b07a44");xr(g,2,21,28,3,"#cf9a62");xr(g,4,32,3,12,ink);xr(g,25,32,3,12,ink);xr(g,5,32,1,11,"#8a5a34");xr(g,26,32,1,11,"#8a5a34")}}
  else if(ch==="Z"){sh();xr(g,1,2,30,42,ink);xr(g,2,3,28,40,"#8a5a34");[6,19,32].forEach((yy,r)=>{xr(g,3,yy,26,11,"#5a3a20");const C=["#e8414f","#3a8cff","#ffd23f","#5ad1a0","#b58aff","#ff8a1e"];let xx=4;for(let i=0;i<6;i++){const w=3+((i+r+x)%2);xr(g,xx,yy+1+(i%2),w,10-(i%2),C[(i+r+x)%6]);xx+=w+1}})}
  else if(ch==="V"){sh();if(fl==="clean"){xr(g,2,10,28,34,ink);xr(g,3,11,26,32,"#e8414f");xr(g,5,14,22,12,"#fff");for(let i=0;i<3;i++){xdisc(g,9+i*7,20,3,3,ink);xdisc(g,9+i*7,20,2,2,"#ff6b78")}xr(g,7,30,18,8,"#c8414f");xr(g,9,32,4,2,"#5ad1a0")}
    else if(fl==="tile"){xr(g,3,6,26,38,ink);xr(g,4,7,24,36,"#c9d4e4");xr(g,6,10,20,12,"#14304a");xr(g,8,12,8,2,"#5ad1a0");xr(g,8,16,14,2,"#3a8cff");xr(g,7,28,4,4,"#ffd23f");xr(g,14,28,4,4,"#ff5a6a");xr(g,21,28,4,4,"#5ad1a0")}
    else{xr(g,4,30,24,14,ink);xr(g,5,31,22,12,"#8a5a34");xr(g,3,12,26,19,ink);xr(g,4,13,24,17,"#3a3f58");xr(g,6,15,20,13,"#5aa8e8");xr(g,6,15,20,4,"#9fd4ff")}}
  else if(ch==="Q"){sh();if(fl==="clean"){xr(g,2,18,28,24,ink);xr(g,3,19,26,22,"#5aa0ff");xr(g,3,19,26,6,"#8ac0ff")}else{xr(g,2,8,28,36,ink);xr(g,3,9,26,34,"#fff");xr(g,3,9,26,10,"#f4f4f4");xr(g,6,11,20,6,"#dfe6ff");xr(g,3,20,26,23,"#e8414f");xr(g,3,20,26,3,"#ff7a84");xr(g,3,28,26,1,"#c8303c")}}
  else if(ch==="J"){sh();xr(g,9,32,14,12,ink);xr(g,10,33,12,10,"#c8643a");xr(g,10,33,12,3,"#e08050");xdisc(g,16,24,10,9,ink);xdisc(g,16,24,9,8,"#3f9a42");xdisc(g,12,20,4,4,"#5ac05a");xdisc(g,20,26,3,3,"#2f7a34")}
  return XG[k]=c}
function xAltar(lit){const k="AL"+(lit?1:0);if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d"),ink="#2b2440";xdisc(g,16,44,13,3,"rgba(0,0,0,.25)");
  xr(g,4,30,24,14,ink);xr(g,5,31,22,12,"#a8a8b8");xr(g,5,31,22,3,"#c8c8d8");xr(g,7,36,18,1,"#8a8a9a");
  xr(g,9,10,14,21,ink);const cs=lit?["#ffe9a8","#ff9ad8","#9ad8ff"]:["#bfe6ff","#8ac8f0","#6aa8e0"];xr(g,10,11,12,19,cs[1]);xr(g,10,11,6,19,cs[0]);xr(g,16,17,6,13,cs[2]);xr(g,12,13,2,6,"#fff");return XG[k]=c}
function xFence(){const k="FN";if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");xdisc(g,16,44,14,2,"rgba(0,0,0,.18)");
  for(const xx of [2,14,26]){xr(g,xx,24,5,20,"#2b2440");xr(g,xx+1,25,3,18,"#fff");xr(g,xx+1,24,3,1,"#fff")}xr(g,0,29,32,4,"#2b2440");xr(g,0,30,32,2,"#fff");xr(g,0,37,32,4,"#2b2440");xr(g,0,38,32,2,"#fff");return XG[k]=c}
// edificios del pueblo (se dibujan como una sola pieza encima de su huella)
function xBld(b){const k="BD"+b.k+b.w+b.h+b.door;if(XG[k])return XG[k];const W=b.w*32,H=b.h*32+26,c=xc(W,H),g=c.getContext("2d"),ink="#2b2440",R=(x,y,w,h,col)=>xr(g,Math.round(x),Math.round(y),Math.round(w),Math.round(h),col);
  const dk=(h,f)=>gbDk(h,f),base=H,dx=b.door*32;
  xdisc(g,W/2,H-3,W/2-2,5,"rgba(0,0,0,.22)");
  const roof=(y,h,col)=>{R(0,y,W,h,ink);for(let r=2;r<h-2;r++){const ph=Math.floor((r-2)/4)%2;R(2,y+r,W-4,1,r%4===0?dk(col,.78):ph?col:dk(col,1.1));if(r%4===2)for(let q=4+(Math.floor(r/4)%2)*6;q<W-4;q+=12)R(q,y+r,1,4,dk(col,.72))}R(2,y+2,W-4,2,dk(col,1.3));R(2,y+h-4,W-4,2,dk(col,.62))};
  const wall=(y,col)=>{R(0,y,W,base-y-4,ink);R(2,y,W-4,base-y-6,col);R(2,y,W-4,3,dk(col,.85));R(2,base-10,W-4,4,dk(col,.82));for(let i=8;i<W-8;i+=14)R(i,y+6,1,base-y-18,dk(col,.95))};
  const win=(x,y,w,h)=>{R(x-2,y-2,w+4,h+4,ink);R(x,y,w,h,"#8fd0ff");R(x,y,w,4,"#d8f2ff");R(x+w/2-1,y,2,h,"#fff");R(x,y+h/2-1,w,2,"#fff");R(x-3,y+h+2,w+6,3,"#c9b28a");LITW.push([x,y,w,h])};
  const door=(col)=>{const x=dx+6,y=base-34;R(x-2,y-2,24,32,ink);R(x,y,20,30,col);R(x+2,y+2,7,12,dk(col,1.2));R(x+11,y+2,7,12,dk(col,1.2));R(x+16,y+16,2,2,"#ffd34a");R(x-4,base-6,28,4,"#c9c0ae")};
  const LITW=[];
  if(b.k==="house"||b.k==="house2"){const rc=b.k==="house"?"#e0533f":"#3a78d8",wy=Math.round(H*.48);R(W-30,4,12,22,ink);R(W-28,6,8,20,"#a49a90");roof(10,wy-8,rc,0);wall(wy,b.k==="house"?"#f6ecd2":"#f2f0e6");if(b.door>=0)door("#8a5a34");
    win(10,wy+10,18,14);win(W-30,wy+10,18,14);if(b.door<0)win(W/2-9,wy+10,18,14);R(6,base-8,12,4,"#ff7aa8");R(W-18,base-8,12,4,"#ffd23f")}
  else if(b.k==="lab"){const wy=34;R(16,0,2,14,ink);xdisc(g,17,4,6,3,"#dfe4ee");R(W-50,8,30,10,ink);R(W-48,10,26,8,"#c9d4e4");roof(16,22,"#a8b2c4",0);wall(wy,"#fbfcff");
    for(let x=10;x<W-14;x+=30)if(Math.abs(x-dx)>24)win(x,wy+12,22,18);R(W/2-26,wy+2,52,9,ink);R(W/2-25,wy+3,50,7,"#3a8cff");g.fillStyle="#fff";g.font="bold 7px monospace";g.fillText("LABORATORIO",W/2-23,wy+9);door("#9fdcff")}
  else if(b.k==="center"){const wy=40;roof(8,36,"#ee4a4f",0);wall(wy,"#fbf6ee");R(2,base-18,W-4,4,"#e8414f");
    const bx=W/2,by=24;xdisc(g,bx,by,11,11,ink);xdisc(g,bx,by,9,9,"#fff");g.save();g.beginPath();g.arc(bx,by,9,0,Math.PI*2);g.clip();R(bx-10,by-10,20,10,"#ee3b4b");g.restore();R(bx-10,by-1,20,2,ink);xdisc(g,bx,by,3,3,ink);xdisc(g,bx,by,2,2,"#fff");
    win(12,wy+10,22,16);win(W-34,wy+10,22,16);const x=dx+2,y=base-36;R(x-2,y-2,32,34,ink);R(x,y,28,32,"#9fdcff");R(x+13,y,2,32,ink);R(x,y,28,4,"#e2f5ff");R(x-4,base-6,36,4,"#c9c0ae");LITW.push([x,y+4,28,26])}
  // versión nocturna con las ventanas encendidas
  const n=xc(W,H),q=n.getContext("2d");q.drawImage(c,0,0);q.globalCompositeOperation="source-atop";q.fillStyle="rgba(20,24,60,.32)";q.fillRect(0,0,W,H);q.globalCompositeOperation="source-over";
  LITW.forEach(r=>{q.fillStyle="#ffcf5a";q.fillRect(r[0],r[1],r[2],r[3]);q.fillStyle="#fff1b0";q.fillRect(r[0],r[1],r[2],Math.max(2,r[3]/3))});c._n=n;
  return XG[k]=c}
{const _gr=xGround;xGround=function(x,y,fr){const c=exAt(x,y),M=EX.M,w=M.w&&M.w[c];
  if(w&&w.look==="mat")return xRug(x,y,1);
  if(c==="F"||c==="Y"||c==="Z"||c==="V"||c==="Q"||c==="J")return xFloor(M.fl||"wood",x,y);
  if(c==="W")return xWall(M.fl||"wood",x,y);
  if(c==="R")return xRug(x,y,0);
  if(c==="h"||c==="N"||c==="A"||(w&&w.look==="door")){if(M.base==="s")return xSand(xMask(x,y,xIsWater),0);if(M.base==="c")return xCave(Math.floor(exRnd(x,y,7)*4));const k="G"+Math.floor(exRnd(x,y,7)*4);return XG[k]||_gr(x,y,fr)}
  return _gr(x,y,fr)}}
{const _o=xObj;xObj=function(c,x,y){if(/[YZVQJ]/.test(c))return xIntObj(c,EX.M.fl||"wood",x);if(c==="A")return xAltar(EX.map==="cima"&&stSt().s>=8);if(c==="N")return xFence();return _o(c,x,y)}}
const STO_IMG={};
function stMonImg(n){if(STO_IMG[n])return STO_IMG[n];const i=new Image();i.src=(typeof sprHost==="function"?sprHost():SPRU)+(window._spr&&window._spr[n])+".png";return STO_IMG[n]=i}
function exExtraEnts(ents,g,cx,cy,ts){const M=EX.M,night=(()=>{const h=new Date().getHours();return h>=20||h<7})();
  (M.bld||[]).forEach(b=>{const im=xBld(b),X=b.x*32-cx,Y=(b.y+b.h)*32-im.height-cy;ents.push({y:b.y+b.h-1+.45,d:()=>g.drawImage(night&&im._n?im._n:im,X,Y)})});
  const s=stSt().s;
  // Poké Balls sobre la mesa del laboratorio
  if(EX.map==="lab"){const f=stSt().f;[["Bulbasaur",6],["Charmander",7],["Squirtle",8]].forEach(([n,x])=>{if(s>=2&&(f.st===n||f.rv===n))return;const X=x*32-cx+16,Y=5*32-cy+4;ents.push({y:5.1,d:()=>{xdisc(g,X,Y+5,5,1.5,"rgba(0,0,0,.25)");xdisc(g,X,Y,6,6,"#2b2440");xdisc(g,X,Y,5,5,"#fff");g.fillStyle="#ee3b4b";g.fillRect(X-5,Y-5,10,5);g.fillStyle="#2b2440";g.fillRect(X-6,Y-1,12,2);xdisc(g,X,Y,2,2,"#2b2440");xdisc(g,X,Y,1,1,"#fff")}})})}
  // Latias sobre el lago de la cima
  if(EX.map==="cima"&&(s===6||s===7)){const im=stMonImg("Latias");if(im.complete&&im.naturalWidth){const X=14*32-cx+16,bob=Math.sin(ts/500)*5,Y=5*32-cy+2+bob;ents.push({y:5.5,d:()=>{xdisc(g,X,5*32-cy+28,14-bob/2,4,"rgba(0,40,80,.3)");g.drawImage(im,X-40,Y-48,80,80)}})}}
  // brillo de la Escama Celeste en la cueva y de la Piedra Aurora
  const sp=(x,y)=>{const X=x*32-cx+16,Y=y*32-cy-6;ents.push({y:y+.01,d:()=>{const a=(Math.sin(ts/300)+1)/2;g.globalAlpha=.35+a*.5;g.fillStyle="#bfe6ff";g.fillRect(X-1,Y-8-a*4,2,6);g.fillRect(X-4,Y-6-a*4,8,2);g.globalAlpha=1}})};
  if(EX.map==="cueva"&&!stSt().f.esc)sp(14,4);if(EX.map==="cima"&&s>=7)sp(14,7);
  if(EX.flash){ents.push({y:9999,d:()=>{g.fillStyle="rgba(255,255,255,.85)";g.fillRect(0,0,g.canvas.width,g.canvas.height)}})}}
