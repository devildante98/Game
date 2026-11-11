// =====================================================================================
// EXPLORACIÓN · GIMNASIOS, REGIÓN CELESTE Y LIGA POKÉMON («Acto V»)
// Ocho gimnasios con sus líderes (uno en cada pueblo), medallas propias de Exploración,
// la región Celeste (Puerto Celeste, Ruta 5, Ciudad Lunar), la Calle Victoria y la Liga
// Pokémon con el Alto Mando y el Campeón.
// =====================================================================================
// ---------- líderes de gimnasio ----------
const XGYM=[
 {m:"gym_pueblo",t:"pueblo",n:"Líder Brezo",ty:"grass",b:"Medalla Brote",ic:"🌱",lk:"lider-brezo",
  team:[["Oddish",9],["Bellsprout",10],["Ivysaur",12]],
  hi:["¡Hola! Soy Brezo, líder del Gimnasio de Pueblo Brisa.","Mis Pokémon de tipo Planta crecen con el sol y con el cariño. ¿Te atreves con ellos?"],
  win:["¡Qué bien has combatido! Mis plantas necesitan regarse un poco…","Te has ganado la Medalla Brote. ¡Es la primera de ocho!"]},
 {m:"gym_pe",t:"pe",n:"Líder Marina",ty:"water",b:"Medalla Marea",ic:"🌊",lk:"lider-marina",
  team:[["Seaking",33],["Lanturn",34],["Starmie",35],["Gyarados",37]],
  hi:["Bienvenido al Gimnasio de Puerto Escarcha. Soy Marina.","El mar helado es implacable… igual que mis Pokémon de tipo Agua."],
  win:["La marea ha cambiado a tu favor. Lo reconozco.","Toma la Medalla Marea. ¡Que el viento te lleve lejos!"]},
 {m:"gym_pn",t:"pn",n:"Líder Albo",ty:"ice",b:"Medalla Glaciar",ic:"❄️",lk:"lider-albo",
  team:[["Sneasel",37],["Piloswine",38],["Glalie",39],["Walrein",41]],
  hi:["Soy Albo. En Pueblo Nevado el frío forja a los entrenadores.","¿Aguantarás la ventisca de mis Pokémon de tipo Hielo?"],
  win:["Tu espíritu arde más que cualquier ventisca…","Te entrego la Medalla Glaciar. Te la has ganado."]},
 {m:"gym_pb",t:"pb",n:"Líder Pedro",ty:"fighting",b:"Medalla Puño",ic:"🥊",lk:"lider-pedro",
  team:[["Hitmonlee",45],["Hariyama",46],["Machamp",47],["Lucario",49]],
  hi:["¡Uooh! ¡Soy Pedro, líder del Gimnasio de Puerto Brasa!","¡Mis Pokémon de tipo Lucha entrenan día y noche junto al volcán! ¡En guardia!"],
  win:["¡Qué combate más intenso! ¡Me has dejado sin aliento!","¡La Medalla Puño es tuya! ¡Sigue entrenando duro!"]},
 {m:"gym_vv",t:"vv",n:"Líder Ígnea",ty:"fire",b:"Medalla Lava",ic:"🔥",lk:"lider-ignea",
  team:[["Magmar",50],["Ninetales",51],["Torkoal",52],["Arcanine",53],["Typhlosion",54]],
  hi:["Soy Ígnea. Mis Pokémon nacieron entre la lava de Villa Volcán.","Si no soportas el calor… ¡sal de mi gimnasio!"],
  win:["Has apagado mi llama… por ahora.","Llévate la Medalla Lava. Brilla como el magma."]},
 {m:"gym_ct",t:"ct",n:"Líder Voltio",ty:"electric",b:"Medalla Voltio",ic:"⚡",lk:"lider-voltio",
  team:[["Electabuzz",56],["Manectric",57],["Jolteon",57],["Ampharos",58],["Luxray",60]],
  hi:["¡Bzzzt! Soy Voltio, el líder más rápido de Ciudad Trueno.","¡Prepárate para un millón de voltios!"],
  win:["¡Cortocircuito total! Eres un rayo, ¿eh?","La Medalla Voltio es tuya. ¡Ya te faltan pocas!"]},
 {m:"gym_pc",t:"pc",n:"Líder Sibila",ty:"psychic",b:"Medalla Aura",ic:"🔮",lk:"lider-sibila",
  team:[["Espeon",61],["Gardevoir",62],["Bronzong",62],["Alakazam",63],["Metagross",64]],
  hi:["Ya sabía que hoy vendrías. Lo he visto en mis sueños.","Soy Sibila. Veamos si tu mente es tan fuerte como tu equipo."],
  win:["Mis visiones no me mostraron esta derrota… Interesante.","Toma la Medalla Aura. Tu futuro brilla con fuerza."]},
 {m:"gym_cl",t:"cl",n:"Líder Drakón",ty:"dragon",b:"Medalla Dragón",ic:"🐉",lk:"lider-drakon",
  team:[["Altaria",64],["Flygon",65],["Kingdra",66],["Salamence",67],["Garchomp",68]],
  hi:["Soy Drakón, el último líder antes de la Liga Pokémon.","Solo quien domina a los dragones merece cruzar la Calle Victoria."],
  win:["Ningún dragón ha podido contigo… Increíble.","Aquí tienes la Medalla Dragón, la octava. ¡La Liga Pokémon te espera!"]}];
// ---------- Alto Mando y Campeón ----------
const XELITE=[
 {n:"Alto Mando Umbra",ty:"dark",lk:"alto-mando-umbra",x:5,y:11,f:"r",team:[["Umbreon",68],["Houndoom",68],["Honchkrow",69],["Weavile",70],["Tyranitar",71]],
  hi:["Bienvenido a la Liga Pokémon. Soy Umbra, del Alto Mando.","En la oscuridad, mis Pokémon ven lo que tú no puedes."],win:["La noche… ha terminado para mí. Sigue adelante."]},
 {n:"Alto Mando Ferra",ty:"steel",lk:"alto-mando-ferra",x:14,y:9,f:"l",team:[["Skarmory",69],["Scizor",70],["Aggron",70],["Lucario",71],["Metagross",72]],
  hi:["Soy Ferra. Mis Pokémon de Acero son una muralla infranqueable."],win:["Has atravesado el acero… Impresionante."]},
 {n:"Alto Mando Lumen",ty:"fairy",lk:"alto-mando-lumen",x:5,y:7,f:"r",team:[["Clefable",70],["Togekiss",71],["Sylveon",71],["Azumarill",72],["Gardevoir",73]],
  hi:["¡Hola! Soy Lumen. ¿A que mis Pokémon son preciosos?","Pues no te dejes engañar: ¡son muy fuertes!"],win:["¡Ay! ¡Qué combate más bonito! Ve a por el último."]},
 {n:"Alto Mando Espectra",ty:"ghost",lk:"alto-mando-espectra",x:14,y:5,f:"l",team:[["Mismagius",71],["Chandelure",72],["Dusknoir",72],["Aegislash",73],["Gengar",74]],
  hi:["Soy Espectra, la última del Alto Mando…","Los espíritus de esta sala susurran tu nombre."],win:["Los espíritus se calman… El Campeón te espera."]}];
// ---------- medallas de Exploración (independientes de los gimnasios del juego base) ----------
const xbHas=i=>!!stSt().f["xb"+i];
const xbCount=()=>XGYM.reduce((a,g,i)=>a+(xbHas(i)?1:0),0);
// ---------- niveles de las zonas nuevas ----------
Object.assign(XGZ,{gym_pueblo:[7,9,9],gym_pe:[30,33,32],gym_pn:[34,37,36],gym_pb:[42,45,44],gym_vv:[47,50,49],gym_ct:[53,56,55],gym_pc:[58,61,60],gym_cl:[61,64,63],ruta5:[58,62,61],victoria:[62,66,65]});
// ---------- tiendas de la región Celeste ----------
Object.assign(XS_TOWN,{
  pc:{n:"Puerto Celeste",it:["ub","hpot","mpot","mrev","elix","meter","melix"],st:["moon-stone","dawn-stone","shiny-stone","dusk-stone","razor-claw","reaper-cloth"],mt:[["psychic",3],["water",2],["fairy",2],["ghost",2]],ms:["Maquinación","Paz Mental","Danza Espada"],hold:["cspecs","wglass","ebelt","bsludge","wlens"],mint:["mint1","mint3","mint5","mint10","mint13","mint15","mint17","mint20"]},
  cl:{n:"Ciudad Lunar",it:["ub","hpot","mpot","mrev","elix","meter","melix"],st:["dragon-scale","up-grade","dubious-disc","protector","electirizer","magmarizer"],mt:[["dragon",3],["dark",2],["steel",2],["fighting",2]],ms:["Danza Dragón","Corpulencia","Pulimento"],hold:["cband","cscarf","mband","eviol","rhelm","torb","forb","bpow","lball"],mint:["mint1","mint3","mint5","mint10","mint13","mint15","mint17","mint20"]}});
// ---------- el barco: más destinos y medallas de Exploración ----------
// (si tu historia ya pasó por una región, no te pide las medallas para volver)
REG.forEach(r=>{const q={alba:[0,0],esc:[1,11],bra:[3,16],tor:[5,21]}[r.k];if(q){r.need=q[0];r.pass=q[1]}});
REG.push({k:"cel",n:"Región Celeste · Puerto Celeste",m:"pc",x:13,y:13,need:6,from:24,pass:99});
SAILOR.pc=[13,16];
const regOk=r=>!r.need||xbCount()>=r.need||(stSt().s|0)>=(r.pass||99);
STX.sailor=()=>stRun(async()=>{const s=stSt().s,cur=EX.map,opts=REG.filter(r=>r.m!==cur&&s>=r.from);
  if(!opts.length){await sSay(S_("Marinero","¡Ahoy! Cuando tengas a dónde ir, aquí estaré."));return}
  await sSay(S_("Marinero","¡Ahoy! Mi barco va a cualquier región que conozcas. ¿A dónde vamos?"));
  const i=await sChoice("¿A dónde quieres viajar?",opts.map(r=>({t:r.n.split(" · ")[0],s:r.n.split(" · ")[1]+(r.need&&!regOk(r)?" · "+r.need+" medallas":"")})).concat([{t:"Quedarme aquí"}]));
  const r=opts[i];if(!r){await sSay(S_("Marinero","¡Cuando quieras, grumete!"));return}
  if(!regOk(r)){await sSay(S_("Marinero","Las aguas hacia allí son peligrosas. Necesitas al menos "+r.need+" medallas de gimnasio para que te lleve.","(Tienes "+xbCount()+". ¡Vence a los líderes de los gimnasios de cada pueblo!)"));return}
  await sSay(S_("Marinero","¡Leven anclas! ¡Rumbo a "+r.n.split(" · ")[0]+"!"));snd("ui");await sFade("fade",500);
  const card=$("exCard");if(card){card.innerHTML='<small>⚓ Viaje en barco</small><b>'+esc(r.n.split(" · ")[0])+'</b>';card.hidden=false;card.classList.remove("in");void card.offsetWidth;card.classList.add("in")}
  await sW(1600);if(card)card.hidden=true;exLoad(r.m,r.x,r.y,"u");EX.banner=null;exFollowerReset();await sFade("fadein",600);
  const nx={esc:[10,11,7],bra:[15,16,11],tor:[20,21,15],cel:[24,25,18]}[r.k];if(nx&&s===nx[0]){sStep(nx[1]);await sCard(nx[2]);if(r.k==="cel")await xCelIntro()}});
// ---------- historia: Acto V ----------
STO_CH.push({c:"Acto V",t:"La región Celeste"},{c:"Capítulo 19",t:"La Calle Victoria"},{c:"Final",t:"La Liga Pokémon"},{c:"Epílogo",t:"Campeón de la Liga"});
// 18 Acto V · 19 Calle Victoria · 20 Liga · 21 Epílogo
Object.assign(STO_OBJ,{
 4:[3,"Gana la Medalla Brote en el Gimnasio de Pueblo Brisa y persigue al Equipo Ocaso hasta la Cueva Roca (Ruta 1 → norte)"],
 10:[7,"Viaja a la región de Escarcha: habla con el marinero del muelle de la Playa Coral (1 medalla)"],
 15:[11,"Viaja a la región de Brasa: habla con el marinero del muelle de Puerto Escarcha (3 medallas: vence a los gimnasios de Escarcha)"],
 20:[15,"Viaja a la región de Tormenta: habla con el marinero del muelle de Puerto Brasa (5 medallas: vence a los gimnasios de Brasa)"],
 24:[18,"Vence a los líderes de gimnasio y viaja a la región Celeste con el marinero (6 medallas)"],
 25:[18,"Gana las medallas de Puerto Celeste y Ciudad Lunar (8 medallas en total)"],
 26:[19,"Atraviesa la Calle Victoria, al norte de Ciudad Lunar"],
 27:[20,"Vence al Alto Mando y al Campeón de la Liga Pokémon"],
 28:[21,"¡Eres Campeón de la Liga! Puedes revalidar el título una vez al día"]});
// el objetivo muestra también tus medallas
{const _h=stHud;stHud=function(){_h.apply(this,arguments);try{const o=$("exObj");if(!o||o.hidden)return;let m=o.querySelector(".xbadges");if(!m){m=document.createElement("small");m.className="xbadges";o.appendChild(m)}
  const t="🏅 Medallas: "+XGYM.map((g,i)=>xbHas(i)?g.ic:"·").join(" ")+" ("+xbCount()+"/8)";if(m.textContent!==t)m.textContent=t}catch(e){}}}
// ---------- personajes: líderes, Alto Mando, Campeón, enfermera de la Liga y marinero ----------
Object.assign(STO_L,{champ:STO_L.dani});
{const _n=stNPCs;stNPCs=function(m){const L=_n(m),s=stSt().s;const P=(id,x,y,fc,n,look,o)=>L.push(Object.assign({sid:id,x:x,y:y,f:fc,n:n,look:look,t:[],sight:0,txt:"",id:"sto:"+m+":"+id,story:1,still:1,beat:true,px:x,py:y,f0:fc},o||{}));
  const gi=XGYM.findIndex(g=>g.m===m);if(gi>=0)P("gl",7,2,"d",XGYM[gi].n,exNpcLook(XGYM[gi].lk));
  if(m==="liga"){XELITE.forEach((e,k)=>P("e"+k,e.x,e.y,e.f,e.n,exNpcLook(e.lk)));P("champ",9,3,"d","Campeón Dani",STO_L.dani);P("enf",2,12,"r","Enfermera",STO_L.enf)}
  if(m==="pc"){P("v7",8,12,"r","Marinera",STO_L.v1)}
  if(m==="cl"){P("v8",20,15,"l","Anciano",STO_L.v3)}
  return L}}
// ---------- combate de líder ----------
const xTeam=team=>team.filter(([x])=>PM[x]).map(([x,l])=>mkEnemy(stageFor(PM[x],clampL(l))||PM[x],clampL(l)));
const xTr=(nm,team)=>({eteam:xTeam(team),trainer:nm,tsrc:{k:exTrKey(nm),n:nm}});
STX.gymL=i=>stRun(async()=>{const g=XGYM[i],nm=g.n.replace(/^Líder /,"");
  if(xbHas(i)){await sSay(S_(nm,"¡Ya tienes la "+g.b+"! Sigue adelante: "+(xbCount()>=8?"la Liga Pokémon te espera al norte de Ciudad Lunar.":"te quedan "+(8-xbCount())+" medallas por conseguir.")));return}
  await sSay(S_(nm,...g.hi));
  const r=await sBattle(xTr(g.n,g.team),"trainer");if(!r){if(r===false)await sSay(S_(nm,"¡Vuelve cuando estés preparado! Mi gimnasio siempre está abierto."));return}
  stSt().f["xb"+i]=1;save();await sSay(S_(nm,...g.win));await sFlash(2);
  await sSay(["¡Has conseguido la "+g.b+" "+g.ic+"!","¡Recibes "+sGive({t:40000*(i+1),it:{cand:2+Math.floor(i/2)}})+"!"]);
  stHud();xCheck8()});
// ---------- Calle Victoria: 8 medallas ----------
{const _a=exArrive;exArrive=function(){if(!EX.cut&&EX.M&&EX.M.w){const w=EX.M.w[exAt(EX.x,EX.y)];
    const need=w&&w.to==="victoria"&&EX.map==="cl"?8:w&&w.to==="cueva"&&EX.map==="ruta"&&(stSt().s|0)<=4?1:0;
    if(need&&xbCount()<need){const st=exSt();snd("ui");exSay(["Un guardia te detiene:","«Para pasar necesitas "+(need===8?"las 8 medallas de gimnasio":"la medalla del Gimnasio de Pueblo Brisa")+". Ahora tienes "+xbCount()+".»"],()=>{exStepBack();st.x=EX.x;st.y=EX.y;st.f=EX.f});return}}
  return _a.apply(this,arguments)}}
function xCheck8(){const t=stSt();if(t.s===25&&xbCount()>=8){sStep(26);stRun(()=>sCard(19))}}
// ---------- llegada a la región Celeste ----------
async function xCelIntro(){await sSay(S_("Marinera","¡Bienvenido a Puerto Celeste!","Más allá de la Ruta 5 está Ciudad Lunar, y al norte la Calle Victoria, el camino a la Liga Pokémon.","Pero solo dejan pasar a quien tiene las 8 medallas de gimnasio. ¡Mucha suerte!"))}
{const _en=stEnter;stEnter=function(m){const s=stSt().s;if(EX.cut||EX.title)return _en(m);
  if(m==="cl")xCheck8();
  if(m==="liga"&&s===26){sStep(27);return stRun(()=>sCard(20))}
  return _en(m)}}
// ---------- Liga Pokémon ----------
STX.elite=k=>stRun(async()=>{const e=XELITE[k],f=stSt().f,nm=e.n.replace(/^Alto Mando /,"");
  if(f.lgDay===today()&&f.champ){await sSay(S_(nm,"Hoy ya has revalidado tu título. ¡Vuelve mañana!"));return}
  if(f["el"+k]){await sSay(S_(nm,"Ya me has vencido. ¡Sigue adelante!"));return}
  if(k>0&&!f["el"+(k-1)]){await sSay(S_(nm,"Primero tienes que vencer a "+XELITE[k-1].n+"."));return}
  await sSay(S_(nm,...e.hi));const r=await sBattle(xTr(e.n,e.team),"trainer");
  if(!r){if(r===false){XELITE.forEach((q,j)=>{delete f["el"+j]});save();await sSay(S_(nm,"Has perdido… Tendrás que empezar de nuevo desde el primer miembro del Alto Mando."))}return}
  f["el"+k]=1;save();await sSay(S_(nm,...e.win))});
STX.champ=()=>stRun(async()=>{const f=stSt().f;
  if(f.lgDay===today()&&f.champ){await sSay(S_("Dani","¡Hoy ya me has ganado! Mañana quiero la revancha, Campeón."));return}
  if(!XELITE.every((e,k)=>f["el"+k])){await sSay(S_("Dani","¡Eh! Primero tienes que vencer a los cuatro miembros del Alto Mando."));return}
  await sSay(S_("Dani",...(f.champ?["¡Ya estás aquí otra vez! Esta vez el título será mío."]:["¡Por fin llegas! ¿Sorprendido? Llegué antes que tú a la Liga…","…¡y ahora soy el Campeón! Desde Pueblo Brisa hasta aquí, siempre has sido mi rival.","¡Este es nuestro combate definitivo!"])));
  const rv=f.rv&&PM[f.rv]?f.rv:"Charizard";
  const r=await sBattle(xTr("Campeón Dani",[["Pidgeot",74],["Alakazam",75],["Gyarados",75],["Arcanine",76],["Snorlax",76],[rv,78]]),"trainer");
  XELITE.forEach((q,j)=>{delete f["el"+j]});save();
  if(!r){if(r===false)await sSay(S_("Dani","¡Ja! ¡Sigo siendo el Campeón! Entrena y vuelve a intentarlo desde el principio."));return}
  const first=!f.champ;f.champ=1;f.lgDay=today();f.lgWins=(f.lgWins|0)+1;save();
  await sSay(S_("Dani","…No me lo puedo creer. Has ganado.","Eres el nuevo Campeón de la Liga Pokémon. ¡Enhorabuena, de verdad!"));await sFlash(3);
  await sSay(["🏆 ¡Has entrado en el Salón de la Fama de la Liga Pokémon!","¡Recibes "+sGive(first?{t:2000000,it:{mb:1,cand:10}}:{t:500000,it:{cand:3}})+"!"]);
  if(first){sStep(28);await sCard(21);await sSay(S_("Dani","Mañana vuelvo a por el título. ¡No te acomodes!"))}});
{const _t=stTalk;stTalk=function(n){const id=n.sid,m=EX.map;
  if(id==="gl"){const i=XGYM.findIndex(g=>g.m===m);if(i>=0)return STX.gymL(i)}
  if(m==="liga"&&/^e\d$/.test(id))return STX.elite(+id.slice(1));
  if(m==="liga"&&id==="champ")return STX.champ();
  if(id==="v7")return stRun(()=>sSay(S_("Marinera",xbCount()>=8?"¡Ocho medallas! La Calle Victoria está al norte de Ciudad Lunar.":"El gimnasio de Puerto Celeste es de tipo Psíquico. ¡Cuidado con su líder, Sibila!")));
  if(id==="v8")return stRun(()=>sSay(S_("Anciano",stSt().f.champ?"¡El nuevo Campeón en persona! Qué honor.":"Al norte está la Calle Victoria. Muchos lo intentan… pocos llegan a la Liga.")));
  return _t(n)}}
// ---------- el edificio del gimnasio: tejado naranja, cartel «GIMNASIO» y emblema ----------
{const _b=xBld;xBld=function(b){if(b.k!=="gym")return _b(b);const k="BDgym"+b.w+b.h+b.door;if(XG[k])return XG[k];
  const W=b.w*32,H=b.h*32+26,c=xc(W,H),g=c.getContext("2d"),ink="#2b2440",R=(x,y,w,h,col)=>xr(g,Math.round(x),Math.round(y),Math.round(w),Math.round(h),col),dx=b.door*32;
  xdisc(g,W/2,H-3,W/2-2,5,"rgba(0,0,0,.22)");
  // tejado escalonado
  R(0,10,W,30,ink);for(let r=0;r<26;r+=4){R(2,12+r,W-4,2,r%8?"#f08a2a":"#d86a1a");R(2,14+r,W-4,2,"#f6a24a")}
  R(W/2-18,0,36,14,ink);R(W/2-16,2,32,10,"#ffd23f");xdisc(g,W/2,7,4,4,ink);xdisc(g,W/2,7,3,3,"#fff");
  // fachada
  const wy=40;R(0,wy,W,H-wy-4,ink);R(2,wy,W-4,H-wy-6,"#f3ead6");R(2,wy,W-4,3,"#d8ccb2");
  R(4,wy+4,W-8,10,ink);R(5,wy+5,W-10,8,"#3a3f8f");g.fillStyle="#ffd23f";g.font="bold 7px monospace";g.textAlign="center";g.fillText("GIMNASIO",W/2,wy+12);
  const LW=[];const win=(x,y)=>{R(x-2,y-2,18,16,ink);R(x,y,14,12,"#8fd0ff");R(x,y,14,3,"#d8f2ff");LW.push([x,y,14,12])};
  win(8,wy+20);win(W-22,wy+20);
  const x=dx+4,y=H-38;R(x-2,y-2,28,34,ink);R(x,y,24,32,"#c0392b");R(x+11,y,2,32,ink);R(x,y,24,4,"#e8604f");R(x-4,H-8,32,4,"#c9c0ae");
  const n=xc(W,H),q=n.getContext("2d");q.drawImage(c,0,0);q.globalCompositeOperation="source-atop";q.fillStyle="rgba(20,24,60,.32)";q.fillRect(0,0,W,H);q.globalCompositeOperation="source-over";
  LW.forEach(r=>{q.fillStyle="#ffcf5a";q.fillRect(r[0],r[1],r[2],r[3])});c._n=n;return XG[k]=c}}
// ================= EQUIPO DE EXPLORACIÓN: arrastrar para ordenar, meter o sacar Pokémon =================
// Suelta una tarjeta del equipo sobre otra para intercambiarlas; una de la caja sobre una del equipo para cambiarlas;
// una de la caja en la zona del equipo para meterla (si hay sitio) y una del equipo en la caja para sacarla.
const XD={src:null,n:"",inT:false,on:false,x0:0,y0:0,gh:null,tgt:null,skip:0};
function xdZone(x,y){if(XD.gh)XD.gh.style.display="none";const el=document.elementFromPoint(x,y);if(XD.gh)XD.gh.style.display="";if(!el||!el.closest)return null;
  const c=el.closest("#exTeam .xgc");if(c&&c!==XD.src)return {c:c,n:c.dataset.xg,inT:c.classList.contains("on")};
  const l=el.closest("#exTeam .xgl");if(l)return {list:l,inT:!!l.querySelector(".xgc.on")||(!l.querySelector(".xgc")&&false)};return null}
document.addEventListener("pointerdown",e=>{if(e.button!==0)return;const c=e.target.closest&&e.target.closest("#exTeam .xgc");if(!c)return;XD.src=c;XD.n=c.dataset.xg;XD.inT=c.classList.contains("on");XD.x0=e.clientX;XD.y0=e.clientY;XD.on=false;XD.pid=e.pointerId});
document.addEventListener("pointermove",e=>{if(!XD.src||e.pointerId!==XD.pid)return;
  if(!XD.on){if(Math.hypot(e.clientX-XD.x0,e.clientY-XD.y0)<8)return;XD.on=true;const r=XD.src.getBoundingClientRect(),g=XD.src.cloneNode(true);g.classList.add("xgghost");g.style.width=r.width+"px";g.style.height=r.height+"px";XD.dx=XD.x0-r.left;XD.dy=XD.y0-r.top;document.body.appendChild(g);XD.gh=g;XD.src.classList.add("xgdrag")}
  e.preventDefault();XD.gh.style.left=(e.clientX-XD.dx)+"px";XD.gh.style.top=(e.clientY-XD.dy)+"px";
  const z=xdZone(e.clientX,e.clientY),t=z&&(z.c||z.list);if(t!==XD.tgt){if(XD.tgt)XD.tgt.classList.remove("xgover");XD.tgt=t;if(t)t.classList.add("xgover")}},{passive:false});
function xdEnd(e,cancel){if(!XD.src)return;const was=XD.on,z=was&&!cancel?xdZone(e.clientX,e.clientY):null;
  if(XD.gh)XD.gh.remove();XD.src.classList.remove("xgdrag");if(XD.tgt)XD.tgt.classList.remove("xgover");const n=XD.n,inT=XD.inT;XD.src=null;XD.gh=null;XD.tgt=null;XD.on=false;
  if(!was)return;XD.skip=Date.now();if(!z)return;let msg="";
  xgRun(()=>{let T=(S.team||[]).filter(x=>x&&S.owned[x]);const i=T.indexOf(n);
    if(z.c){const j=T.indexOf(z.n);
      if(inT&&z.inT&&i>=0&&j>=0){T[i]=z.n;T[j]=n;msg="🔄 "+nk(n)+" y "+nk(z.n)+" han intercambiado sus puestos"}
      else if(!inT&&z.inT&&j>=0){T[j]=n;msg="🔄 "+nk(n)+" entra en el equipo y "+nk(z.n)+" va a la caja"}
      else if(inT&&!z.inT&&i>=0){T[i]=z.n;msg="🔄 "+nk(z.n)+" entra en el equipo y "+nk(n)+" va a la caja"}}
    else if(z.list){const toTeam=z.list===document.querySelector("#exTeam .xgl")&&!!document.querySelector("#exTeam .xgl .xgc.on");
      if(!inT&&toTeam){if(T.length>=6){msg="Tu equipo ya tiene 6 Pokémon: suéltalo encima de uno para cambiarlos."}else{T.push(n);msg="✅ "+nk(n)+" entra en el equipo"}}
      else if(inT&&!toTeam){if(T.length<=1)msg="Necesitas al menos un Pokémon en el equipo.";else{T.splice(i,1);msg="📦 "+nk(n)+" va a la caja"}}}
    S.team=T.concat(["","","","","",""]).slice(0,6);save()});
  if(msg)toast(msg);snd("ui");xgPanel()}
document.addEventListener("pointerup",e=>xdEnd(e,false));document.addEventListener("pointercancel",e=>xdEnd(e,true));
document.addEventListener("click",e=>{if(Date.now()-XD.skip<350){e.stopImmediatePropagation();e.preventDefault()}},true);
{const _xp=xgPanel;xgPanel=function(){const r=_xp.apply(this,arguments);try{const box=$("exTeam"),h=box&&box.querySelector(".xgs");if(h&&!box.querySelector(".xgdh")){const t=document.createElement("small");t.className="mut xgdh";t.textContent="💡 También puedes arrastrar las tarjetas: entre el equipo para ordenarlo, o entre el equipo y la caja para cambiarlos.";box.querySelector(".xgh").after(t)}}catch(e){}return r}}
document.addEventListener("dragstart",e=>{if(e.target&&e.target.closest&&e.target.closest("#exTeam .xgc,.tmbtn"))e.preventDefault()},true);
// ================= lo que el HTML y Firebase necesitan ver desde fuera del juego =================
// (el resto del código queda encerrado y no se puede manipular desde la consola)
if(typeof pvRender!=="undefined"&&window.pvRender!==pvRender)window.pvRender=function(){return pvRender.apply(this,arguments)};
if(typeof save!=="undefined"&&window.save!==save)window.save=function(){return save.apply(this,arguments)};
if(typeof render!=="undefined"&&window.render!==render)window.render=function(){return render.apply(this,arguments)};
if(typeof updTeam!=="undefined"&&window.updTeam!==updTeam)window.updTeam=function(){return updTeam.apply(this,arguments)};
if(typeof icoErr!=="undefined"&&window.icoErr!==icoErr)window.icoErr=function(){return icoErr.apply(this,arguments)};
if(typeof badgeErr!=="undefined"&&window.badgeErr!==badgeErr)window.badgeErr=function(){return badgeErr.apply(this,arguments)};
if(typeof chImgLd!=="undefined"&&window.chImgLd!==chImgLd)window.chImgLd=function(){return chImgLd.apply(this,arguments)};
if(typeof icoHDErr!=="undefined"&&window.icoHDErr!==icoHDErr)window.icoHDErr=function(){return icoHDErr.apply(this,arguments)};
if(typeof icoLoad!=="undefined"&&window.icoLoad!==icoLoad)window.icoLoad=function(){return icoLoad.apply(this,arguments)};
if(typeof itemErr!=="undefined"&&window.itemErr!==itemErr)window.itemErr=function(){return itemErr.apply(this,arguments)};
if(typeof srch!=="undefined"&&window.srch!==srch)window.srch=function(){return srch.apply(this,arguments)};
if(typeof tImgErr!=="undefined"&&window.tImgErr!==tImgErr)window.tImgErr=function(){return tImgErr.apply(this,arguments)};
if(typeof zImgErr!=="undefined"&&window.zImgErr!==zImgErr)window.zImgErr=function(){return zImgErr.apply(this,arguments)};
