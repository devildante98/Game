// =====================================================================================
// HISTORIA MÁS VIVA: personajes que te guían andando (tú les sigues) y visitas guiadas por cada pueblo
// =====================================================================================
// en las escenas no salen Pokémon salvajes
{const _e=exEncounter;exEncounter=function(){if(EX.cut)return;return _e.apply(this,arguments)}}
// camino más corto (sin pisar puertas ni personas); el jugador cuenta como libre porque te sigue
function exBFS(sx,sy,tx,ty){const M=EX.M,W=EX.grid[0].length,H=EX.grid.length,key=(x,y)=>y*W+x,prev=new Map([[key(sx,sy),null]]),q=[[sx,sy]];
  const free=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return false;if(x===tx&&y===ty)return true;const c=exAt(x,y);if(EXBLK.includes(c))return false;if(M.w&&M.w[c])return false;if(EX.npcs.some(n=>n.px===x&&n.py===y&&!n.guide))return false;return true};
  while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty){const out=[];let k=key(x,y);while(prev.get(k)){const[d,pk]=prev.get(k);out.unshift(d);k=pk}return out}
    for(const d of ["u","d","l","r"]){const[a,b]=EXDIR[d],nx=x+a,ny=y+b,nk=key(nx,ny);if(prev.has(nk)||!free(nx,ny))continue;prev.set(nk,[d,key(x,y)]);q.push([nx,ny])}}return null}
const dirTo=(x,y,tx,ty)=>tx>x?"r":tx<x?"l":ty>y?"d":ty<y?"u":null;
// el personaje camina hasta (tx,ty) y tú le sigues pisando sus pasos
async function sGuide(n,tx,ty){n.guide=1;try{for(let i=0;i<160;i++){if(n.px===tx&&n.py===ty)break;const p=exBFS(n.px,n.py,tx,ty);if(!p||!p.length)break;const d=p[0],[a,b]=EXDIR[d],ox=n.px,oy=n.py;
    let pd=null;if(n.px+a===EX.x&&n.py+b===EX.y)pd=OPP[d];else if(Math.abs(EX.x-ox)+Math.abs(EX.y-oy)===1)pd=dirTo(EX.x,EX.y,ox,oy);
    await Promise.all([sStepN(n,d),pd?sPStep(pd):null])}}finally{n.guide=0}}
// casilla justo debajo de una puerta (o de la salida) del mapa actual
function exDoor(ch){const g=EX.grid;for(let y=0;y<g.length;y++)for(let x=0;x<g[y].length;x++)if(g[y][x]===ch){for(const[a,b]of[[0,1],[-1,0],[1,0],[0,-1]]){const nx=x+a,ny=y+b;if(ny>=0&&ny<g.length&&nx>=0&&nx<g[0].length&&!EXBLK.includes(exAt(nx,ny))&&!(EX.M.w&&EX.M.w[exAt(nx,ny)]))return [nx,ny]}}return null}
// coloca a alguien al lado del jugador
function sAddNear(id,nm,look){for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0]]){const x=EX.x+a,y=EX.y+b;if(!EXBLK.includes(exAt(x,y))&&!(EX.M.w&&EX.M.w[exAt(x,y)])&&!EX.npcs.some(n=>n.px===x&&n.py===y)){const n=sAdd(id,x,y,"d",nm,look);sFaceTo(n);return n}}return sAdd(id,EX.x,EX.y+1,"u",nm,look)}
async function sGoDoor(n,ch){const t=exDoor(ch);if(!t)return false;await sGuide(n,t[0],t[1]);n.f="u";EX.f=dirTo(EX.x,EX.y,n.px,n.py)||"u";return true}
const TY_WEAK={normal:"Lucha",fire:"Agua, Tierra o Roca",water:"Planta o Eléctrico",electric:"Tierra",grass:"Fuego, Hielo, Volador, Veneno o Bicho",ice:"Fuego, Lucha, Roca o Acero",fighting:"Volador, Psíquico o Hada",poison:"Tierra o Psíquico",ground:"Agua, Planta o Hielo",flying:"Eléctrico, Hielo o Roca",psychic:"Bicho, Fantasma o Siniestro",bug:"Fuego, Volador o Roca",rock:"Agua, Planta, Lucha, Tierra o Acero",ghost:"Fantasma o Siniestro",dragon:"Hielo, Dragón o Hada",dark:"Lucha, Bicho o Hada",steel:"Fuego, Lucha o Tierra",fairy:"Veneno o Acero"};
// ---------- 1) la Profesora Vega te enseña Pueblo Brisa (al salir del laboratorio con tu primer Pokémon) ----------
STX.tourVega=()=>stRun(async()=>{const f=stSt().f;f.tourV=1;const v=sAddNear("vega_t","Profesora Vega",STO_L.vega);await sW(250);
  await sSay(S_("Profesora Vega","¡Espera! Antes de que te vayas, deja que te enseñe el pueblo.","Un buen entrenador conoce bien su casa. ¡Sígueme!"));
  if(await sGoDoor(v,"6"))await sSay(S_("Profesora Vega","Este es el Centro Pokémon. Si tus Pokémon se debilitan, aquí los curan gratis y en un momento.","Si pierdes un combate fuera, volverás corriendo al último Centro en el que hayas estado. ¡Recuérdalo!"));
  if(await sGoDoor(v,"7"))await sSay(S_("Profesora Vega","Y esta es la Tienda Pokémon. Aquí compras Poké Balls, Pociones y objetos para equipar.","En Exploración se paga con tus propios tickets de Exploración: los ganas en combates, con la historia y vendiendo cosas."));
  if(await sGoDoor(v,"8"))await sSay(S_("Profesora Vega","Esto es el Gimnasio de Pueblo Brisa. Lo dirige Brezo, que entrena Pokémon de tipo Planta.","Hasta que le ganes, tus Pokémon no pasarán del nivel 14. Cada medalla sube ese límite.","Contra la Planta van bien los ataques de tipo Fuego, Volador, Hielo, Veneno o Bicho."));
  if(await sGoDoor(v,"4"))await sSay(S_("Profesora Vega","Por aquí viven los Prado y los Vela. Son muy amables: entra cuando quieras a charlar.","Los vecinos saben muchas cosas útiles, ¡escúchales!"));
  const ex=exDoor("1");if(ex){await sGuide(v,ex[0],ex[1]);sFaceTo(v)}
  await sSay(S_("Profesora Vega","Y por aquí se sale a la Ruta 1. Lía está esperándote un poco más adelante.","Una última cosa: abre el menú con el botón ☰ (o la tecla Tab). Ahí tienes tu equipo, la mochila, el mapa y más.","¡Mucha suerte! Confío en ti."));
  await sFade("fade",300);sDel("vega_t");await sFade("fadein",300)});
// ---------- 2) Lía te acompaña hasta la entrada del Bosque Verde ----------
{const _r=STX.ruta2;STX.ruta2=async function(){await _r.apply(this,arguments);try{const f=stSt().f;if(stSt().s===3&&EX.map==="ruta"&&!f.escL){await sW(200);await stRun(async()=>{f.escL=1;
  const l=sAddNear("lia_e","Lía",STO_L.lia);await sSay(S_("Lía","¡Espera! Me lo he pensado mejor: te acompaño hasta la entrada del bosque.","El Bosque Verde es fácil de recorrer… si sabes por dónde ir. ¡Sígueme!"));
  const t=exDoor("2");if(t){await sGuide(l,t[0],t[1]);sFaceTo(l)}
  await sSay(S_("Lía","Aquí empieza el Bosque Verde. Dentro hay mucha hierba alta: es donde se esconden los Pokémon salvajes.","Si encuentras a los del Equipo Ocaso, no te confíes. Luchan sucio.","Cuando quieras volver a casa, el mapa (botón 🗺️) te dice dónde estás. ¡Suerte!"));
  await sFade("fade",300);sDel("lia_e");await sFade("fadein",300)})}}catch(e){console.error(e)}}}
// ---------- 3) visita guiada la primera vez que llegas a cada pueblo ----------
const TOUR={
 pe:{g:"Farera Nieves",lk:"guia-pe",hi:["¡Bienvenido a Puerto Escarcha! Aquí llegan los barcos del sur.","Hace frío, pero la gente es cálida. ¿Quieres que te enseñe el puerto?"],
  c:["El Centro Pokémon está aquí al lado. Con este frío, ¡no dejes que tus Pokémon se congelen!"],m:["En la tienda de aquí venden piedras para evolucionar a Pokémon de agua y de hielo, y algún objeto útil para el frío."],
  bye:["La Ruta 2 sale por el este del puerto y lleva a Pueblo Nevado, donde está el segundo gimnasio de la región.","¡Abrígate bien y buen viaje!"]},
 pn:{g:"Leñador Abeto",lk:"guia-pn",hi:["¡Eh, viajero! Pueblo Nevado no recibe muchas visitas con esta nieve.","Te enseño dónde está todo, que con la ventisca es fácil perderse."],
  c:["El Centro Pokémon. Entra a calentarte cuando quieras."],m:["La tienda. Llévate pociones: en la Caverna Glaciar no hay dónde curarse."],
  bye:["Al norte está la Caverna Glaciar. Dicen que en lo más hondo duerme algo… muy frío.","¡Cuídate!"]},
 pb:{g:"Estibador Fermín",lk:"guia-pb",hi:["¡Bienvenido a Puerto Brasa! Aquí todo huele a carbón y a mar.","¿Primera vez por aquí? Ven, que te enseño lo importante."],
  c:["Este es el Centro Pokémon. Los Pokémon de fuego de aquí siempre están muy calentitos."],m:["En esta tienda encontrarás objetos para la lucha y para el fuego."],
  bye:["La Ruta 3 sale hacia el este y llega a Villa Volcán. Por el camino hay mucha ceniza: ¡no te pierdas!","¡Hasta otra!"]},
 vv:{g:"Guía Magma",lk:"guia-vv",hi:["¡Hola! Bienvenido a Villa Volcán, el pueblo más caliente de la región.","¿Te enseño las termas, el gimnasio y todo lo demás?"],
  c:["El Centro Pokémon. Las enfermeras de aquí son las más rápidas: ¡están acostumbradas a las quemaduras!"],m:["La tienda tiene de todo, incluso objetos raros para los Pokémon más fuertes."],
  bye:["Al norte está el Cráter. Solo deberías entrar si tu equipo está bien preparado.","¡Que el fuego te acompañe!"]},
 ct:{g:"Electricista Volta",lk:"guia-ct",hi:["¡Bienvenido a Ciudad Trueno, la ciudad que nunca se queda a oscuras!","Es grande, así que te acompaño un momento. ¡Sígueme!"],
  c:["El Centro Pokémon. Funciona con la electricidad de los Pokémon de la ciudad."],m:["Esta tienda es la más moderna de la región. Mira los objetos para equipar, que hay muchos."],
  bye:["La Ruta 4 sale por el este, hacia la Torre Relámpago.","¡Que no te caiga un rayo!"]},
 pc:{g:"Marinera Brisa",lk:"guia-pc",hi:["¡Bienvenido a Puerto Celeste! Desde aquí se ve el cielo más bonito del mundo.","Has llegado lejos. Te enseño el puerto en un momento."],
  c:["El Centro Pokémon. Ya queda poco para la Liga: aprovecha para curar a tu equipo."],m:["La tienda tiene lo mejor para el final del viaje: Hiperpociones, Revivir y mucho más."],
  bye:["La Ruta 5 lleva a Ciudad Lunar, la última ciudad antes de la Liga Pokémon.","¡Ánimo, que ya casi lo tienes!"]},
 cl:{g:"Sereno Luis",lk:"guia-cl",hi:["Buenas noches… o buenos días, aquí nunca se sabe. Bienvenido a Ciudad Lunar.","Esta es la última parada antes de la Liga. Te enseño la ciudad."],
  c:["El Centro Pokémon está abierto toda la noche. Como todo aquí."],m:["En la tienda encontrarás lo que necesites para la Calle Victoria."],
  bye:["Al norte está la Calle Victoria. Solo pueden pasar quienes tienen las ocho medallas.","¡Que la Luna te guíe!"]}};
function stTour(t){const T=TOUR[t];if(!T)return;stRun(async()=>{const f=stSt().f;f["tour_"+t]=1;const n=sAddNear("guia_"+t,T.g,exNpcLook(T.lk));await sAlert(n);await sApproach(n);
  await sSay(S_(T.g,...T.hi));const i=await sChoice("¿Quieres que te enseñe "+(EXM[t]?EXM[t].n:"el pueblo")+"?",[{t:"¡Sí, por favor!"},{t:"No, gracias"}]);
  if(i!==0){await sSay(S_(T.g,"¡Como quieras! Si te pierdes, el Centro Pokémon tiene el tejado rojo.",...T.bye));await sFade("fade",250);sDel("guia_"+t);await sFade("fadein",250);return}
  await sSay(S_(T.g,"¡Genial! Sígueme."));
  if(await sGoDoor(n,"6"))await sSay(S_(T.g,...T.c));
  if(await sGoDoor(n,"7"))await sSay(S_(T.g,...T.m));
  const gi=XGYM.findIndex(g=>g.t===t);
  if(gi>=0&&await sGoDoor(n,"8")){const G=XGYM[gi],lv=Math.max(...G.team.map(x=>x[1]));await sSay(S_(T.g,"Y este es el Gimnasio. Lo dirige "+G.n.replace(/^Líder /,"")+", que usa Pokémon de tipo "+(TYN[G.ty]||G.ty)+".",
    xbHas(gi)?"¡Ah, pero si ya tienes su "+G.b+"! Entonces no necesitas mis consejos.":"Contra el tipo "+(TYN[G.ty]||G.ty)+" van muy bien los ataques de tipo "+(TY_WEAK[G.ty]||"variado")+".",
    xbHas(gi)?"":"Su Pokémon más fuerte está al nivel "+lv+". Prepara bien a tu equipo antes de entrar.").filter(x=>!/\|$/.test(x)))}
  if(await sGoDoor(n,"4"))await sSay(S_(T.g,"Aquí viven algunos vecinos. Entra a saludar: les encanta tener visita."));
  await sSay(S_(T.g,...T.bye));await sSay(["¡Recibes "+sGive({t:3000,it:{pot:3}})+"!"]);
  await sFade("fade",250);sDel("guia_"+t);await sFade("fadein",250)})}
// al entrar en un mapa: ¿toca una visita guiada?
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{let n=0;const tk=()=>{if(EX.map!==m||EX.title)return;if(EX.cut||EX.dlg||EX.trans||EX.choice){if(++n<40)setTimeout(tk,400);return}const s=stSt().s,f=stSt().f;
  if(m==="pueblo"&&s===2&&!f.tourV)STX.tourVega();
  else if(TOUR[m]&&!f["tour_"+m])stTour(m)};setTimeout(tk,700)}catch(e){}return r}}

// ---------- tu casa: te despiertas arriba, en tu dormitorio, y mamá te espera abajo ----------
WM_IN.casa_up="pueblo";
STX.intro=()=>{const f=stSt().f;if(f.woke&&EX.map==="casa")return STX.introMama();if(f.woke&&EX.map==="casa_up")return;
  return stRun(async()=>{await sFade("fade",300);exLoad("casa_up",4,3,"d");EX.banner=null;await sFade("fadein",700);await sCard(0);
    await sSay(["…","¡Bip, bip, bip! El despertador suena sin parar.","¡Hoy es el día! La Profesora Vega te ha prometido tu primer Pokémon.","Desde abajo llega el olor del desayuno… y la voz de mamá llamándote."]);
    await sSay(S_("Mamá","¡Venga, dormilón, baja ya! ¡Que se enfría el desayuno!"));
    f.woke=1;save();await sSay(["(Baja por la escalera de la esquina para ir con mamá.)"])})};
STX.introMama=()=>stRun(async()=>{const m=stN("mama");if(m){await sAlert(m);await sApproach(m)}
  await sSay(S_("Mamá","¡Por fin te despiertas! Te he oído bajar la escalera como un Tauros.","¡Hoy es el gran día! La Profesora Vega ha llamado esta mañana. Dice que tiene algo muy importante que pedirte.","Su laboratorio es el edificio blanco de la parte de arriba del pueblo.","Ah, y llévate esto. ¡Quien sale de viaje nunca va sin Pociones!"));
  await sSay(["¡Recibes "+sGive({it:{pot:5}})+"!"]);
  await sSay(S_("Mamá","Si tus Pokémon se cansan, vuelve a casa a descansar. ¡Te espero con la comida hecha!","Y no te olvides de escribirme de vez en cuando… aunque sea con un Pidgey mensajero."));
  sStep(1)});
// al bajar a la cocina por primera vez, mamá te habla
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{if(m==="casa"&&stSt().s===0&&stSt().f.woke){let n=0;const tk=()=>{if(EX.map!=="casa")return;if(EX.cut||EX.dlg||EX.trans){if(++n<30)setTimeout(tk,300);return}STX.introMama()};setTimeout(tk,900)}}catch(e){}return r}}
// cosas que mirar en tu casa
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&(EX.map==="casa"||EX.map==="casa_up")){const[dx,dy]=EXDIR[EX.f],c=exAt(EX.x+dx,EX.y+dy);
  const T={B:["Tu cama. Todavía está calentita.","En la almohada hay un peluche de Pikachu."],O:["Tu ordenador. Tienes un correo de Dani: «¡Hoy nos dan Pokémon! ¡Llegaré pronto! (Seguro que me duermo)»."],C:["Tu armario. Ahí está tu ropa de viaje, lista desde hace semanas."],E:["Tu cómoda. En el espejo hay una foto tuya de pequeño con mamá en la Playa Coral."],V:["En la tele hablan de unas luces extrañas sobre la Cima Aurora…"],L:["La nevera. Mamá ha dejado una nota: «Bocadillo para el viaje, ¡no lo olvides!»."],G:["Huele a tortitas recién hechas."],Z:["Libros de mamá: «Recetas con bayas», «Cuidados del Pokémon»…"],S:["El sofá favorito de mamá."],D:["La mesa del desayuno. Hay un vaso de leche Mu-Mu."],K:["La encimera de la cocina."],M:["Una silla."]};
  if(T[c]&&!EX.npcs.some(n=>n.px===EX.x+dx&&n.py===EX.y+dy)){snd("ui");exSay(T[c]);return}}}catch(e){}return _i.apply(this,arguments)}}

// =====================================================================================
// GIMNASIOS OBLIGATORIOS: para seguir avanzando hay que ganar las medallas de Exploración, sin excepciones
// · Región de Alba: la Cueva Roca, la Playa Coral y la Cima Aurora piden la Medalla Brote (Gimnasio de Pueblo Brisa)
// · Barco: Escarcha 1 medalla, Brasa 3, Tormenta 5, Celeste 6; la Liga, las 8
// =====================================================================================
REG.forEach(r=>{r.pass=99});
{const _a=exArrive;exArrive=function(){try{const c=exAt(EX.x,EX.y),w=EX.M&&EX.M.w&&EX.M.w[c];if(w&&w.xb&&xbCount()<w.xb){const st=exSt(),g=XGYM[0];snd("ui");
  exSay(["Un guarda te detiene:","«Por aquí solo pueden pasar quienes tengan la "+g.b+" "+g.ic+".»","«Ve al Gimnasio de Pueblo Brisa y vence a la "+g.n+". ¡Te estaré esperando!»"],()=>{exStepBack();st.x=EX.x;st.y=EX.y;st.f=EX.f});return}}catch(e){}return _a.apply(this,arguments)}}
Object.assign(STO_OBJ,{5:[4,"Detén a Noctis en la Playa Coral (Ruta 1 → sur · necesitas la Medalla Brote)"],6:[5,"Sube a la Cima Aurora (Pueblo Brisa → norte · necesitas la Medalla Brote)"]});
