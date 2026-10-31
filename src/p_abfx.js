// =====================================================================================
// HABILIDADES: EFECTOS EN COMBATE DE TODAS LAS HABILIDADES (clima, terrenos, inmunidades,
// cambios de características, reacciones al recibir golpes, efectos al entrar y al final del turno)
// Todo es determinista (usa el mismo rng del motor), así que también funciona en el PVP.
// =====================================================================================
Object.assign(ABDESC,{
 1:"Sus ataques pueden hacer retroceder al rival (10%)",2:"Al entrar en combate hace que llueva durante 5 turnos",4:"No puede recibir golpes críticos",6:"Nadie puede usar movimientos explosivos mientras está en combate",
 8:"Más difícil de golpear durante una tormenta de arena",12:"No puede ser confundido ni asustado por Intimidación",13:"Anula los efectos del tiempo atmosférico",14:"Sus movimientos tienen un 30% más de precisión",
 16:"Al recibir un ataque, se adapta y resiste más ese tipo",19:"Inmune a los efectos secundarios de los ataques rivales",20:"No puede ser confundido ni asustado por Intimidación",21:"Se agarra al suelo: Intimidación no le afecta",
 23:"Los Pokémon salvajes no pueden huir de él, y si es salvaje no puedes huir",25:"Solo le afectan los ataques súper eficaces",28:"Si le envenenan, paralizan o queman, el rival sufre lo mismo",29:"Los rivales no pueden bajarle las características",
 31:"Atrae los ataques eléctricos: no le afectan y suben su Ataque",32:"Duplica la probabilidad de los efectos secundarios de sus ataques",33:"Su Velocidad se duplica con lluvia",34:"Su Velocidad se duplica con sol",
 35:"Su precisión no puede bajar",36:"Al entrar copia la habilidad del rival",39:"No retrocede y no le afecta Intimidación",40:"No puede ser congelado",41:"No puede sufrir quemaduras",
 42:"Los Pokémon de tipo Acero salvajes no pueden huir; si es salvaje, los tuyos de Acero tampoco",43:"Inmune a los movimientos de sonido",44:"Recupera PS cada turno con lluvia",45:"Al entrar levanta una tormenta de arena durante 5 turnos",
 46:"Los rivales gastan el doble de PP",48:"Se despierta el doble de rápido",50:"Siempre puede huir de los combates salvajes y corre más con pocos PS",51:"Su precisión no baja e ignora la evasión del rival",
 52:"Su Ataque no puede bajar",53:"Puede encontrar objetos al ganar un combate",54:"Solo puede atacar un turno de cada dos",55:"Ataques físicos un 50% más fuertes, pero menos precisos",
 56:"Al recibir un ataque físico puede confundir al atacante (30%)",57:"Ataques especiales más fuertes, mucho más junto a un aliado con Más o Menos",58:"Ataques especiales más fuertes, mucho más junto a un aliado con Más o Menos",
 59:"Sus ataques son más fuertes con cualquier tiempo atmosférico",60:"No le pueden quitar su objeto",61:"Puede curarse de los problemas de estado al final de cada turno",63:"Con un problema de estado recibe menos daño físico",
 64:"Quien le absorba PS los pierde en vez de recuperarlos",70:"Al entrar hace que salga el sol durante 5 turnos",71:"Si es salvaje, tus Pokémon (salvo voladores) no pueden huir",73:"Los rivales no pueden bajarle las características",
 75:"No puede recibir golpes críticos",76:"Anula los efectos del tiempo atmosférico",77:"Si está confuso, es mucho más difícil de golpear",78:"Los ataques eléctricos no le afectan y suben su Velocidad",
 79:"Pega más fuerte a los rivales que comparten tipo con él",80:"Si retrocede, sube su Velocidad. Intimidación no le afecta",81:"Más difícil de golpear cuando nieva",82:"Saca más provecho de sus bayas",
 83:"Si recibe un golpe crítico, su Ataque sube al máximo",84:"Su Velocidad se duplica cuando consume su objeto",85:"Recibe la mitad de daño del fuego y de las quemaduras",86:"Sus cambios de características son el doble de intensos",
 87:"El agua le cura y la lluvia le sienta bien, pero el sol y el fuego le dañan más",88:"Al entrar sube su Ataque",89:"Los movimientos de puñetazo son más fuertes",90:"El veneno le cura en vez de dañarle",
 92:"Los ataques de varios golpes siempre golpean el máximo de veces",93:"Con lluvia se cura de los problemas de estado",94:"Con sol, ataques especiales más fuertes, pero pierde PS cada turno",
 95:"Con un problema de estado, su Velocidad sube",96:"Todos sus ataques son de tipo Normal y un poco más fuertes",97:"Sus golpes críticos hacen todavía más daño",98:"Solo recibe daño de los ataques directos",
 99:"Sus ataques y los que recibe nunca fallan",100:"Siempre actúa el último",102:"Con sol no sufre problemas de estado",103:"No puede usar el objeto que lleva",104:"Sus ataques ignoran las habilidades defensivas del rival",
 106:"Si cae por un ataque físico, el atacante pierde muchos PS",107:"Al entrar presiente los ataques peligrosos del rival y sube su Evasión",108:"Al entrar descubre el ataque más fuerte del rival y sube su Precisión",
 109:"Ignora los cambios de características del rival",110:"Sus ataques poco eficaces hacen el doble de daño",111:"Recibe menos daño de los ataques súper eficaces",112:"Los primeros 5 turnos su Ataque y su Velocidad están a la mitad",
 113:"Sus ataques Normal y Lucha no pierden fuerza contra ningún tipo",114:"Atrae los ataques de agua: no le afectan y suben su Ataque",115:"Recupera PS cada turno cuando nieva",116:"Recibe menos daño de los ataques súper eficaces",
 117:"Al entrar hace que nieve durante 5 turnos",118:"Puede encontrar pociones al ganar un combate",119:"Al entrar descubre los objetos de los rivales",120:"Los ataques con daño de retroceso son más fuertes",
 121:"Todos sus ataques reciben la bonificación de su propio tipo",122:"Con sol, sus ataques físicos y los de sus aliados son más fuertes",123:"Los rivales dormidos pierden PS cada turno",124:"Si le golpean físicamente, roba el objeto del atacante",
 125:"Ataques más fuertes, pero sin efectos secundarios",126:"Sus cambios de características se invierten",127:"Los rivales no pueden comer bayas",128:"Si un rival le baja una característica, su Ataque sube mucho",
 129:"Con la mitad de PS o menos, sus ataques pierden fuerza",130:"Al recibir un ataque, puede debilitar el movimiento del atacante",131:"Puede curar los problemas de estado suyos o de un aliado",132:"Él y sus aliados reciben menos daño",
 133:"Al recibir un golpe físico baja su Defensa pero sube mucho su Velocidad",134:"Es muy pesado: recibe menos daño físico, pero es algo más lento",135:"Es muy ligero: es más rápido",137:"Envenenado, sus ataques físicos son más fuertes",
 138:"Quemado, sus ataques especiales son más fuertes",139:"Puede recuperar la baya que ha consumido",140:"Prevé los ataques: es algo más difícil de golpear",141:"Cada turno sube mucho una característica y baja otra",
 142:"No sufre daño del tiempo atmosférico ni le afectan los polvos",143:"Sus ataques físicos pueden envenenar al rival (30%)",145:"Su Defensa no puede bajar",146:"Su Velocidad se duplica en una tormenta de arena",
 147:"Los movimientos de estado rivales fallan más contra él",148:"Si ataca después que el rival, pega más fuerte",149:"El primer golpe que recibe le hace la mitad de daño",150:"Al entrar se transforma copiando los cambios y la habilidad del rival",
 151:"Sus ataques no se ven reducidos cuando el rival se pone en guardia",152:"Quien le golpee físicamente pasa a tener Momia",153:"Al debilitar a un rival sube su Ataque",154:"Si le golpea un ataque Siniestro, sube su Ataque",
 155:"Si le golpean ataques Bicho, Fantasma o Siniestro, o le intimidan, sube su Velocidad",156:"Devuelve los movimientos de estado al rival",157:"Atrae los ataques de planta: no le afectan y suben su Ataque",
 158:"Sus movimientos de estado tienen prioridad",159:"En una tormenta de arena, sus ataques Roca, Tierra y Acero son más fuertes",161:"Con la mitad de PS o menos entra en Modo Daruma y pega más fuerte",162:"Él y sus aliados son más precisos",
 163:"Sus ataques ignoran las habilidades defensivas del rival",164:"Sus ataques ignoran las habilidades defensivas del rival",165:"Él y sus aliados no pueden ser confundidos",166:"Protege a los Pokémon de tipo Planta de bajadas de características y estados",
 167:"Al comer una baya recupera además PS",168:"Todos sus ataques reciben la bonificación de su propio tipo",169:"Recibe la mitad de daño de los ataques físicos",170:"Al golpear roba el objeto del rival si no tiene ninguno",
 171:"Inmune a bolas y bombas",172:"Si un rival le baja una característica, su Ataque sube mucho",173:"Los mordiscos son más fuertes",174:"Sus ataques de tipo Normal pasan a ser Hielo y más fuertes",175:"Él y sus aliados no pueden dormirse",
 176:"Cambia a su forma ofensiva al atacar y pega más fuerte",177:"Con los PS al máximo, sus ataques Volador tienen prioridad",178:"Los ataques de pulso y aura son más fuertes",179:"En campo de hierba recibe menos daño físico",
 180:"Al comer su baya recupera además algunos PS",181:"Sus ataques físicos son más fuertes",182:"Sus ataques de tipo Normal pasan a ser Hada y más fuertes",183:"Quien le golpee físicamente pierde Velocidad",
 184:"Sus ataques de tipo Normal pasan a ser Volador y más fuertes",185:"Sus ataques golpean dos veces (el segundo, más flojo)",186:"Potencia los ataques Siniestro de todos",187:"Potencia los ataques Hada de todos",
 188:"Invierte las auras: los ataques Siniestro y Hada pierden fuerza",189:"Mientras está en combate llueve sin parar",190:"Mientras está en combate hace un sol abrasador",191:"Protege a los Pokémon Volador de los ataques súper eficaces",
 192:"Cada vez que recibe un golpe sube su Defensa",193:"Al bajar de la mitad de PS, sube mucho su Velocidad",194:"Al bajar de la mitad de PS, sube mucho su Velocidad",195:"Si le golpea un ataque de agua, sube mucho su Defensa",
 196:"Sus ataques son siempre críticos contra rivales envenenados",197:"Con más de la mitad de PS recibe menos daño y no sufre estados; con menos, pega más fuerte",198:"Pega el doble de fuerte al rival que acaba de entrar",
 199:"Sus ataques de agua son el doble de fuertes; resiste el fuego y no se quema",200:"Sus ataques de tipo Acero son más fuertes",201:"Al bajar de la mitad de PS sube su Ataque",202:"Su Velocidad se duplica cuando nieva",
 203:"Ataca a distancia: no activa las habilidades de contacto del rival",204:"Sus movimientos de sonido pasan a ser de tipo Agua",205:"Sus movimientos que curan tienen mucha prioridad",206:"Sus ataques de tipo Normal pasan a ser Eléctrico y más fuertes",
 207:"Su Velocidad se duplica en campo eléctrico",208:"Con más de 1/4 de PS forma un banco: pega más fuerte y recibe menos daño",209:"El primer ataque que recibe no le hace daño",210:"Al debilitar a un rival se fortalece y pega más fuerte",
 211:"Al bajar de la mitad de PS se recompone y recupera muchos PS (una vez)",212:"Puede envenenar incluso a los Pokémon de tipo Veneno y Acero",213:"Está siempre adormilado: no sufre problemas de estado",
 214:"Los rivales no pueden usar ataques con prioridad contra él",215:"Si le debilitan, el atacante pierde tantos PS como le quedaban",216:"Copia las subidas de características de los rivales",217:"Potencia los ataques especiales de sus aliados",
 218:"Recibe la mitad de daño físico, pero el doble del fuego",219:"Los rivales no pueden usar ataques con prioridad contra él",220:"Cada vez que se debilita un Pokémon, sube su Ataque",221:"Quien le golpee físicamente pierde Velocidad",
 222:"Al entrar tras caer un compañero, copia su habilidad",223:"Al entrar tras caer un compañero, copia su habilidad",224:"Al debilitar a un rival sube su Ataque",225:"Todos sus ataques reciben la bonificación de su propio tipo",
 226:"Al entrar crea un campo eléctrico durante 5 turnos",227:"Al entrar crea un campo psíquico durante 5 turnos",228:"Al entrar crea un campo de niebla durante 5 turnos",229:"Al entrar crea un campo de hierba durante 5 turnos",
 230:"Los rivales no pueden bajarle las características",231:"Con los PS al máximo recibe la mitad de daño",232:"Recibe menos daño de los ataques súper eficaces",233:"Sus ataques súper eficaces son todavía más fuertes",
 234:"Al entrar por primera vez sube su Ataque",235:"Al entrar por primera vez sube su Defensa",236:"Todos sus ataques reciben la bonificación de su propio tipo",237:"Puede encontrar Poké Balls al ganar un combate",
 238:"Al recibir un golpe suelta pelusa que baja la Velocidad de los rivales",239:"Sus ataques ignoran la evasión del rival",240:"Devuelve al rival las bajadas de características",241:"Al recibir un golpe puede escupir un proyectil al atacante",
 242:"Sus ataques no se ven reducidos cuando el rival se pone en guardia",243:"Si le golpean ataques de fuego o agua, su Velocidad sube al máximo",244:"Sus movimientos de sonido son más fuertes y recibe menos daño de ellos",
 245:"Al recibir un golpe levanta una tormenta de arena",246:"Recibe la mitad de daño de los ataques especiales",247:"Sus bayas tienen el doble de efecto",248:"El primer ataque físico que recibe no le hace daño",
 249:"Potencia los ataques de sus aliados",250:"Pega más fuerte cuando hay un campo activo",251:"Al entrar anula las defensas y la evasión subidas de los rivales",252:"Sus ataques de tipo Acero son más fuertes",
 253:"Quien le golpee físicamente pierde PS",254:"Quien le golpee físicamente intercambia la habilidad con él",255:"Sus ataques físicos son más fuertes",256:"Mientras está en combate, las habilidades de los rivales no tienen efecto",
 257:"Él y sus aliados no pueden ser envenenados",258:"Cambia de humor cada turno: sus ataques son más fuertes",259:"A veces ataca el primero (30%)",260:"Sus ataques físicos atraviesan las protecciones",
 261:"Al entrar anula los cambios de características de los rivales",262:"Sus ataques de tipo Eléctrico son más fuertes",263:"Sus ataques de tipo Dragón son más fuertes",264:"Al debilitar a un rival sube su Ataque",
 265:"Al debilitar a un rival sube su Ataque",266:"Los rivales no pueden comer bayas; al debilitar a un rival sube su Ataque",267:"Los rivales no pueden comer bayas; al debilitar a un rival sube su Ataque",
 268:"Quien le golpee físicamente pasa a tener Olor Persistente",269:"Al recibir un golpe crea un campo de hierba",270:"Si le golpea el fuego sube su Ataque; no puede quemarse",271:"Al bajar de la mitad de PS sube su Ataque y su Velocidad, pero baja su Defensa",
 272:"No sufre problemas de estado y resiste los ataques Fantasma",273:"El fuego no le afecta y sube mucho su Defensa",274:"Los ataques de viento no le afectan y suben su Ataque",275:"Intimidación le sube el Ataque en vez de bajarlo",
 276:"Sus ataques de tipo Roca son más fuertes",277:"Si le golpea un ataque de viento, se carga: su siguiente ataque eléctrico es el doble de fuerte",278:"Al volver al combate tras retirarse, se transforma y pega mucho más fuerte",
 279:"Al entrar sube su Defensa y su Velocidad",280:"Al recibir un golpe se carga: su siguiente ataque eléctrico es el doble de fuerte",281:"Con sol, sus ataques son más fuertes",282:"En campo eléctrico, sus ataques son más fuertes",
 283:"Inmune a los movimientos de estado de los rivales",284:"Debilita los ataques especiales de todos los demás",285:"Debilita la defensa física de todos los demás",286:"Debilita los ataques físicos de todos los demás",
 287:"Debilita la defensa especial de todos los demás",288:"Al entrar hace salir el sol; con sol, sus ataques físicos son más fuertes",289:"Al entrar crea un campo eléctrico; en él, sus ataques especiales son más fuertes",
 290:"Copia las subidas de características de los rivales",291:"Vuelve a comerse su baya un turno después",292:"Los ataques cortantes son más fuertes",293:"Pega más fuerte por cada compañero debilitado",
 294:"Al entrar sube su Ataque",295:"Al recibir un golpe físico puede envenenar al atacante",296:"Los rivales no pueden usar ataques con prioridad contra él",297:"Los ataques de tierra le curan en vez de dañarle",
 298:"Sus movimientos de estado no fallan nunca",299:"Ignora la evasión y sus ataques Normal y Lucha no pierden fuerza",300:"Al entrar baja la Evasión de los rivales",301:"Al entrar cura un poco a su aliado (o a sí mismo)",
 302:"Sus ataques pueden envenenar gravemente al rival (30%)",304:"Al entrar cambia a su Forma Teracristal y sube su Defensa",305:"Con los PS al máximo, todos los ataques le son poco eficaces",306:"Al entrar borra el tiempo atmosférico y los campos",
 307:"Los rivales que envenena también quedan confusos"});
// ---------- utilidades ----------
const AXR={punch:/Puño|Gancho Alto/,bite:/Mordisco|Colmillo|Triturar|Superdiente|Presa Maxilar|Branquibocado|Golpe Mordaza/,pulse:/Pulso|Esfera Aural|Psicoonda|Onda Certera/,
  slice:/Corte|Tajo|Cuchillada|Hoja Aguda|Hoja Afilada|Garra Umbría|Psicocorte|Tijera X|Espada|Concha Filo|Cuchilla|Hachazo|Filo|Psicohojas/,
  sound:/Gruñido|Canto|Supersónico|Chirrido|Alboroto|Vozarrón|Eco Voz|Canon|Cháchara|Estruendo|Alarido|Rugido|Voz Cautivadora|Aria Burbuja|Fragor Escamas|Zumbido|Silbato|Última Palabra/,
  ball:/Bola|Bomba|Esfera|Balón|Bala|Pedrada|Disparo Lodo|Lanzamugre|Meteorobola/,wind:/Viento|Tornado|Vendaval|Ciclón|Aire Afilado|Simún|Tormenta Floral|Electormenta/,powder:/Polvo|Espora|Somnífero|Paralizador|Esporagodón/};
const axLive=E=>E.sd.map((s,i)=>({i:i,m:beAct(s),s:s})).filter(o=>!o.s.out&&o.m&&o.m.mh>0);
const axHas=(E,ab)=>axLive(E).some(o=>o.m.ab===ab);
const axAllies=(E,i)=>{const ti=beTeamOf(E,i);return axLive(E).filter(o=>o.i!==i&&beTeamOf(E,o.i)===ti).map(o=>o.m)};
const axFoesL=(E,i)=>axLive(E).filter(o=>beTeamOf(E,o.i)!==beTeamOf(E,i));
const axMB=me=>!!me&&[104,163,164].includes(me.ab);
const axWx=E=>E.wx&&!axHas(E,13)&&!axHas(E,76)?E.wx.t:"";
const axTr=E=>E.tr?E.tr.t:"";
const axSay=(push,s,m,t,o,x)=>push(Object.assign({k:"abil",s:s,n:m.p[0],ab:m.ab,t:t},o!=null?{o:o.i,on:o.m.p[0]}:{},x||{}));
const axFmt=(e,who,an)=>String(e.t).replace(/\{w\}/g,who).replace(/\{a\}/g,an).replace(/\{o\}/g,e.o!=null?beWho(e.o,e.on):"");
const AXWX={rain:["¡Ha empezado a llover!","Ha dejado de llover."],sun:["¡El sol pega con fuerza!","El sol ya no pega tan fuerte."],sand:["¡Se ha levantado una tormenta de arena!","La tormenta de arena ha amainado."],
  snow:["¡Ha empezado a nevar!","Ha dejado de nevar."],wind:["¡Unas misteriosas turbulencias protegen a los Pokémon de tipo Volador!","Las turbulencias han desaparecido."]};
const AXTR={electric:["¡Se ha formado un campo eléctrico!","El campo eléctrico ha desaparecido."],psychic:["¡El terreno de combate se ha vuelto muy extraño!","El campo psíquico ha desaparecido."],
  misty:["¡La niebla ha cubierto el terreno de combate!","La niebla ha desaparecido."],grassy:["¡La hierba ha crecido en el terreno de combate!","La hierba ha desaparecido."]};
function axWxSet(E,t,n,push,pr){if(E.wx&&E.wx.t===t&&!pr){E.wx.n=Math.max(E.wx.n,n);return}if(E.wx&&E.wx.pr&&!pr)return;E.wx={t:t,n:n,pr:pr||0};push({k:"msg",t:AXWX[t][0]})}
function axTrSet(E,t,n,push){if(E.tr&&E.tr.t===t){E.tr.n=Math.max(E.tr.n,n);return}E.tr={t:t,n:n};push({k:"msg",t:AXTR[t][0]})}
const axTy=(me,mv)=>{const a=me.ab;if(a===96)return "normal";if(mv.t==="normal"){if(a===174)return "ice";if(a===182)return "fairy";if(a===184)return "flying";if(a===206)return "electric"}if(a===204&&AXR.sound.test(mv.n))return "water";return mv.t};
const axSecMv=mv=>!!(mv.ailc>0||mv.fl>0||(mv.ch.length&&!mv.self));
const axHeal=(m,fr)=>{const b=m.mh;m.mh=Math.min(m.mx,m.mh+Math.max(1,Math.floor(m.mx*fr)));return m.mh-b};
const axHurt=(m,fr)=>{const d=Math.max(1,Math.floor(m.mx*fr));m.mh=Math.max(0,m.mh-d);return d};
const axSafe=(f,d)=>{try{return f()}catch(e){console.error(e);return d}};
// ---------- velocidad y prioridad ----------
function axSpdK(s,E){return axSafe(()=>{const m=beAct(s),a=m.ab,wx=axWx(E);let k=1;
  if((a===33&&wx==="rain")||(a===34&&wx==="sun")||(a===146&&wx==="sand")||(a===202&&wx==="snow")||(a===207&&axTr(E)==="electric"))k*=2;
  if(a===95&&m.sts)k*=m.sts==="par"?3:1.5;if(a===84&&m.ius)k*=2;if(a===112&&(s.v.tn|0)<5)k*=.5;if(a===135)k*=1.25;if(a===134)k*=.9;if(a===50&&m.mh<m.mx/4)k*=1.5;return k},1)}
function axPri(E,i,a,rng,push){return axSafe(()=>{E.prv=E.prv||{};E.prv[i]=0;const q=String(a||"").match(/^m(\d)/);if(!q)return 0;const sd=E.sd[i],m=beAct(sd),mv=m.m[+q[1]];if(!mv)return 0;
  let b=0;if(m.ab===158&&mv.cl===0)b+=1;if(m.ab===177&&mv.t==="flying"&&m.mh>=m.mx)b+=1;if(m.ab===205&&(mv.heal||mv.drain))b+=3;if(m.ab===100)b-=.5;
  if(m.ab===259&&mv.cl>0&&rng()<.3){b+=.4;axSay(push,i,m,"¡{w} se mueve más rápido gracias a {a}!")}
  E.prv[i]=(mv.pr||0)+b;return b},0)}
function axPriBlock(E,i,tg,tm,push){if(!(E.prv&&E.prv[i]>0)||beTeamOf(E,i)===beTeamOf(E,tg))return false;
  const me=beAct(E.sd[i]);if(!axMB(me)){const bl=[{i:tg,m:tm}].concat(axLive(E).filter(o=>o.i!==tg&&beTeamOf(E,o.i)===beTeamOf(E,tg))).find(o=>[214,219,296].includes(o.m.ab));
    if(bl){axSay(push,bl.i,bl.m,"¡{a} de {w} impide el ataque rápido!");return true}}
  if(axTr(E)==="psychic"){push({k:"msg",t:"¡El campo psíquico impide el ataque rápido!"});return true}return false}
// ---------- precisión ----------
function axHitK(E,i,tg,me,tm,mv){return axSafe(()=>{if(me.ab===99||tm.ab===99)return true;if(mv.cl===0&&me.ab===298)return true;
  let k=1;if(me.ab===14)k*=1.3;if(me.ab===55&&mv.cl===1)k*=.8;if(me.ab===162||axAllies(E,i).some(x=>x.ab===162))k*=1.1;
  if(!axMB(me)){const d=tm.ab,wx=axWx(E);if(d===8&&wx==="sand")k*=.8;if(d===81&&wx==="snow")k*=.8;if(d===77&&E.sd[tg].v.cnf)k*=.5;if(d===140)k*=.9;if(d===147&&mv.cl===0)k*=.5}return k},1)}
const axEva=(me,ts)=>[51,239,109,299].includes(me.ab)?0:ts.v.st.eva;
// ---------- golpes críticos y eficacia ----------
const axNoCrit=(me,tm)=>!axMB(me)&&(tm.ab===4||tm.ab===75);
const axCritK=(me,tm)=>me.ab===196&&(tm.sts==="psn"||tm.sts==="tox")?99:1;
function axEff(E,me,tm,ty,e){return axSafe(()=>{if((me.ab===113||me.ab===299)&&(ty==="normal"||ty==="fighting")&&e<1)e=1;
  if(!axMB(me)){if(tm.ab===305&&tm.mh>=tm.mx)e=Math.min(e,.5);if(tm.ab===16&&tm.cc===ty)e*=.5}
  if(axWx(E)==="wind"&&tys(tm.p).includes("flying")&&e>1)e=1;return e},e)}
// ---------- multiplicador de daño ----------
function axDmg(E,i,tg,me,tm,mv,ty,e,acted){return axSafe(()=>{
  let k=1;const a=me.ab,d=axMB(me)?0:tm.ab,ph=mv.cl===1,sp=mv.cl===2,nm=mv.n||"",wx=axWx(E),tr=axTr(E),hp=me.mh/me.mx;
  if(a===89&&AXR.punch.test(nm))k*=1.2;if(a===173&&AXR.bite.test(nm))k*=1.5;if(a===178&&AXR.pulse.test(nm))k*=1.5;if(a===292&&AXR.slice.test(nm))k*=1.5;if(a===244&&AXR.sound.test(nm))k*=1.3;
  if(a===181&&ph)k*=1.3;if(a===55&&ph)k*=1.5;if(a===120&&mv.rec)k*=1.2;if(a===125&&axSecMv(mv))k*=1.3;if(a===110&&e<1)k*=2;if(a===233&&e>1)k*=1.25;
  if(a===96||([174,182,184,206].includes(a)&&mv.t==="normal"))k*=1.2;if(a===79&&tys(tm.p).some(t=>tys(me.p).includes(t)))k*=1.25;
  if((a===57||a===58)&&sp)k*=axAllies(E,i).some(x=>x.ab===57||x.ab===58)?1.5:1.1;
  if(a===94&&wx==="sun"&&sp)k*=1.5;if(a===159&&wx==="sand"&&["rock","ground","steel"].includes(ty))k*=1.3;
  if(a===262&&ty==="electric")k*=1.3;if(a===263&&ty==="dragon")k*=1.5;if((a===200||a===252)&&ty==="steel")k*=1.5;if(a===276&&ty==="rock")k*=1.5;if(a===199&&ty==="water")k*=2;
  if(a===148&&acted&&acted[tg])k*=1.3;if(a===129&&hp<=.5)k*=.5;if(a===112&&(E.sd[i].v.tn|0)<5)k*=.5;
  if(a===137&&(me.sts==="psn"||me.sts==="tox")&&ph)k*=1.5;if(a===138&&me.sts==="brn"&&sp)k*=1.5;
  if(a===161&&hp<=.5)k*=1.4;if(a===208&&hp>.25)k*=1.4;if(a===197&&hp<=.5)k*=1.5;if(a===176||a===258)k*=1.2;if(a===255&&ph)k*=1.3;
  if(me.bb)k*=1.5;if(me.hero)k*=1.5;if(me.chg&&ty==="electric")k*=2;
  if(a===281&&wx==="sun")k*=1.3;if(a===282&&tr==="electric")k*=1.3;if(a===288&&wx==="sun"&&ph)k*=1.33;if(a===289&&tr==="electric"&&sp)k*=1.33;
  if(a===293)k*=1+.1*E.sd[i].t.filter(x=>x!==me&&x.mh<=0).length;if(a===122&&wx==="sun"&&ph)k*=1.5;if(a===59&&wx)k*=1.2;if(a===250&&tr)k*=1.2;
  if(a===198&&E.sd[tg].v.nw)k*=2;if(a===249)k*=1.1;if(a===217&&sp)k*=1.1;
  axAllies(E,i).forEach(x=>{if(x.ab===249)k*=1.3;if(x.ab===217&&sp)k*=1.3;if(x.ab===122&&wx==="sun"&&ph)k*=1.5});
  const aur=(t,ab)=>ty===t&&axHas(E,ab)?(axHas(E,188)?.75:1.33):1;k*=aur("dark",186)*aur("fairy",187);
  if(sp&&axHas(E,284)&&a!==284)k*=.75;if(ph&&axHas(E,286)&&a!==286)k*=.75;if(ph&&axHas(E,285)&&tm.ab!==285)k*=1.33;if(sp&&axHas(E,287)&&tm.ab!==287)k*=1.33;
  if(wx==="rain"){if(ty==="water")k*=1.5;if(ty==="fire")k*=.5}if(wx==="sun"){if(ty==="fire")k*=1.5;if(ty==="water")k*=.5}
  if(wx==="snow"&&ph&&tys(tm.p).includes("ice"))k*=.67;if(wx==="sand"&&sp&&tys(tm.p).includes("rock"))k*=.67;
  if(tr==="electric"&&ty==="electric")k*=1.3;if(tr==="grassy"&&ty==="grass")k*=1.3;if(tr==="psychic"&&ty==="psychic")k*=1.3;if(tr==="misty"&&ty==="dragon")k*=.5;
  if(d===85&&ty==="fire")k*=.5;if(d===87&&ty==="fire")k*=1.25;if(d===199&&ty==="fire")k*=.5;if(d===169&&ph)k*=.5;if(d===218){if(ph)k*=.5;if(ty==="fire")k*=2}if(d===246&&sp)k*=.5;
  if((d===111||d===116||d===232)&&e>1)k*=.75;if(d===231&&tm.mh>=tm.mx)k*=.5;if(d===63&&tm.sts&&ph)k*=.67;if(d===179&&tr==="grassy"&&ph)k*=.67;if(d===272&&ty==="ghost")k*=.5;if(d===134&&ph)k*=.85;
  if(d===208&&tm.mh>tm.mx/4)k*=.7;if(d===197&&tm.mh>tm.mx/2)k*=.6;if(d===149&&!tm.ilu)k*=.5;if(d===244&&AXR.sound.test(nm))k*=.5;if(d===132)k*=.9;
  axAllies(E,tg).forEach(x=>{if(x.ab===132)k*=.75});
  return k},1)}
// ---------- inmunidades ----------
function axImm(E,i,tg,me,tm,mv,push,rng){return axSafe(()=>{
  if(axPriBlock(E,i,tg,tm,push))return true;
  if(mv.kami){const dp=axLive(E).find(o=>o.m.ab===6);if(dp){axSay(push,dp.i,dp.m,"¡{a} de {w} impide la explosión!");return true}}
  if(axMB(me))return false;const d=tm.ab,ty=axTy(me,mv),nm=mv.n||"";
  const imm=x=>{push(Object.assign({k:"abil",s:tg,n:tm.p[0],ab:d,imm:1},x||{}));return true};
  const gain=st=>{imm();beStat(E,tg,st,push);return true};
  const heal=()=>{const h=axHeal(tm,.25);return imm({h:h})};
  if(d===25&&!mv.fixed&&!mv.flv&&effP(ty,tm.p)<=1)return imm();
  if(d===31&&ty==="electric")return gain([["atk",1]]);if(d===114&&ty==="water")return gain([["atk",1]]);if(d===157&&ty==="grass")return gain([["atk",1]]);
  if(d===78&&ty==="electric")return gain([["spe",1]]);if(d===274&&AXR.wind.test(nm))return gain([["atk",1]]);if(d===273&&ty==="fire")return gain([["def",2]]);
  if(d===87&&ty==="water")return heal();if(d===297&&ty==="ground")return heal();
  if(d===43&&AXR.sound.test(nm))return imm();if(d===171&&AXR.ball.test(nm))return imm();
  return false},false)}
function axStatusImm(E,i,tg,me,tm,mv,push,rng){return axSafe(()=>{
  if(axPriBlock(E,i,tg,tm,push))return true;if(me.ab===298||axMB(me))return false;const d=tm.ab,nm=mv.n||"";
  const imm=()=>{push({k:"abil",s:tg,n:tm.p[0],ab:d,imm:1});return true};
  if(beTeamOf(E,i)===beTeamOf(E,tg))return false;
  if(d===283)return imm();if(AXR.powder.test(nm)&&(d===142||tys(tm.p).includes("grass")))return imm();if(d===43&&AXR.sound.test(nm))return imm();
  if(d===156&&(mv.ail||(mv.ch.length&&!mv.self))){axSay(push,tg,tm,"¡{a} de {w} devuelve el movimiento!");if(mv.ail)beAil(E,i,mv.ail,push,rng,true,tg);if(mv.ch.length&&!mv.self&&rng()*100<mv.sc)beStat(E,i,mv.ch,push,tg);return true}
  return false},false)}
// ---------- golpes que no hacen daño (Disfraz, Cara de Hielo) ----------
function axZero(E,tg,tm,mv,me,push){if(axMB(me))return false;
  if(tm.ab===209&&!tm.dsf){tm.dsf=1;axSay(push,tg,tm,"¡El disfraz de {w} ha recibido el golpe y se ha roto!");return true}
  if(tm.ab===248&&!tm.icf&&mv.cl===1){tm.icf=1;axSay(push,tg,tm,"¡La cara de hielo de {w} ha absorbido el golpe!");return true}return false}
// ---------- efectos secundarios ----------
const axNoSec=(me,tm)=>me.ab===125||(tm.ab===19&&!axMB(me));
const axSec=me=>me.ab===32?2:1;
// ---------- problemas de estado ----------
function axAilBlock(E,j,a,push,status,src){return axSafe(()=>{
  const sd=E.sd[j],m=beAct(sd);const sm=src!=null&&src!==j?beAct(E.sd[src]):null;if(sm&&axMB(sm))return false;
  const ab=m.ab,al=axAllies(E,j),wx=axWx(E),tr=axTr(E),grass=tys(m.p).includes("grass");
  const blk=(x,who)=>{if(status)push({k:"abil",s:who!=null?who.i:j,n:(who?who.m:m).p[0],ab:x,blk:1});return true};
  if(a==="cnf"){if([20,12,165].includes(ab))return blk(ab);const v=al.find(x=>x.ab===165);if(v)return blk(165);if(tr==="misty"){if(status)push({k:"abil",s:j,n:m.p[0],ab:0,t:"¡La niebla protege a {w}!"});return true}return false}
  if(m.sts)return false;
  if(ab===213||ab===272||(ab===102&&wx==="sun")||(ab===197&&m.mh>m.mx/2))return blk(ab);
  if(a==="brn"&&(ab===41||ab===199||ab===270))return blk(ab);if(a==="frz"&&ab===40)return blk(ab);
  if(a==="slp"&&(ab===175||al.some(x=>x.ab===175)))return blk(175);if((a==="psn"||a==="tox")&&(ab===257||al.some(x=>x.ab===257)))return blk(257);
  if(grass&&(ab===166||al.some(x=>x.ab===166)))return blk(166);
  if(tr==="misty"||(tr==="electric"&&a==="slp")){if(status)push({k:"abil",s:j,n:m.p[0],ab:0,t:tr==="misty"?"¡La niebla protege a {w}!":"¡El campo eléctrico impide que {w} se duerma!"});return true}
  return false},false)}
function axAilPost(E,j,a,push,rng,src){axSafe(()=>{if(src==null||src===j)return;const m=beAct(E.sd[j]),sm=beAct(E.sd[src]);if(!sm)return;
  if(m.ab===28&&["psn","tox","par","brn"].includes(a)&&sm.mh>0&&!sm.sts){axSay(push,j,m,"¡{a} de {w} le devuelve el problema a {o}!",{i:src,m:sm});beAil(E,src,a==="tox"?"psn":a,push,rng,false)}
  if(sm.ab===307&&(a==="psn"||a==="tox")&&m.mh>0)beAil(E,j,"cnf",push,rng,false)})}
const axCorr=(E,src,a)=>src!=null&&(a==="psn"||a==="tox")&&beAct(E.sd[src])&&beAct(E.sd[src]).ab===212;
// ---------- cambios de características ----------
function axStatPre(E,j,ch,push,src,tag){return axSafe(()=>{
  const m=beAct(E.sd[j]);let L=ch.map(q=>[q[0],q[1]]);const foe=src!=null&&src!==j;
  if(foe&&L.some(q=>q[1]<0)){const sm=beAct(E.sd[src]),mb=axMB(sm),ab=mb?0:m.ab,al=axAllies(E,j);
    if(tag==="int"&&[39,12,20,80,21].includes(ab)){push({k:"abil",s:j,n:m.p[0],ab:ab,blk:1});return []}
    if(tag==="int"&&ab===275){axSay(push,j,m,"¡{a} de {w} se rebela contra la intimidación!");return [["atk",1]]}
    if(tag==="int"&&ab===155)L=L.concat([["spe",1]]);
    const keep=q=>{if(q[1]>=0)return true;if([29,73,230].includes(ab))return false;if(tys(m.p).includes("grass")&&(ab===166||al.some(x=>x.ab===166)))return false;
      if(q[0]==="atk"&&ab===52)return false;if(q[0]==="def"&&ab===145)return false;if(q[0]==="acc"&&(ab===51||ab===35))return false;return true};
    const drop=L.filter(q=>!keep(q));L=L.filter(keep);
    if(drop.length){if(ab===240&&sm.mh>0){axSay(push,j,m,"¡{a} de {w} devuelve la bajada a {o}!",{i:src,m:sm});beStat(E,src,drop,push)}else push({k:"abil",s:j,n:m.p[0],ab:ab,blk:1})}}
  if(m.ab===126)L=L.map(q=>[q[0],-q[1]]);if(m.ab===86)L=L.map(q=>[q[0],q[1]*2]);
  return L},ch)}
function axStatPost(E,j,ch,push,src,tag){axSafe(()=>{const m=beAct(E.sd[j]);if(m.mh<=0)return;const foe=src!=null&&src!==j;
  if(foe&&ch.some(q=>q[1]<0)&&(m.ab===128||m.ab===172)&&tag!=="ab"){axSay(push,j,m,"¡{a} de {w} se ha activado!");beStat(E,j,[["atk",2]],push,undefined,"ab")}
  if(!foe&&tag!=="copy"&&ch.some(q=>q[1]>0)){const up=ch.filter(q=>q[1]>0);axFoesL(E,j).forEach(o=>{if(o.m.ab===290||o.m.ab===216){axSay(push,o.i,o.m,"¡{a} de {w} copia la mejora!");beStat(E,o.i,up,push,undefined,"copy")}})}})}
// ---------- después de golpear ----------
function axAfterHit(E,i,tg,me,tm,mv,ty,tot,e,crit,h0,k,push,rng,acted,faint){axSafe(()=>{
  if(tg===i)return;if(me.chg&&ty==="electric")me.chg=0;if(!tot)return;
  const ph=mv.cl===1,contact=ph&&me.ab!==203,fainted=tm.mh<=0,d=tm.ab,O={i:i,m:me},T={i:tg,m:tm};
  if(d===149)tm.ilu=1;
  if(!fainted&&tot){
    if(d===83&&crit&&E.sd[tg].v.st.atk<6){E.sd[tg].v.st.atk=6;axSay(push,tg,tm,"¡{a} de {w} ha subido su Ataque al máximo!")}
    if(d===133&&ph){axSay(push,tg,tm,"¡{a} de {w} se ha activado!");beStat(E,tg,[["def",-1],["spe",2]],push)}
    if(d===192)beStat(E,tg,[["def",1]],push);if(d===154&&ty==="dark")beStat(E,tg,[["atk",1]],push);if(d===155&&["bug","ghost","dark"].includes(ty))beStat(E,tg,[["spe",1]],push);
    if(d===195&&ty==="water")beStat(E,tg,[["def",2]],push);if(d===243&&(ty==="fire"||ty==="water"))beStat(E,tg,[["spe",6]],push);if(d===270&&ty==="fire")beStat(E,tg,[["atk",1]],push);
    if(d===280||(d===277&&AXR.wind.test(mv.n||""))){if(!tm.chg){tm.chg=1;axSay(push,tg,tm,"¡{w} se ha cargado de electricidad!")}}
    const half=tm.mx/2;if(h0>half&&tm.mh<=half){
      if(d===201)beStat(E,tg,[["atk",1]],push);if(d===271){axSay(push,tg,tm,"¡{a} de {w} se ha activado!");beStat(E,tg,[["atk",1],["spe",1],["def",-1]],push)}
      if(d===193||d===194){axSay(push,tg,tm,"¡{w} intenta escapar del peligro!");beStat(E,tg,[["spe",2]],push)}
      if(d===211&&!tm.ag){tm.ag=1;axHeal(tm,.5);axSay(push,tg,tm,"¡{w} se ha recompuesto y ha recuperado PS!",null,{hl:1})}}
    if(d===245)axWxSet(E,"sand",5,push);if(d===269)axTrSet(E,"grassy",5,push);
    if(d===16&&tm.cc!==ty){tm.cc=ty;axSay(push,tg,tm,"¡{w} se ha adaptado al tipo "+(TIPO[ty]||ty)+"!")}
    if(d===130&&k>=0&&me.pp[k]>0&&rng()<.3){me.pp[k]=Math.max(0,me.pp[k]-5);axSay(push,tg,tm,"¡{a} de {w} debilita el movimiento de {o}!",O)}
    if(d===241&&me.mh>0&&rng()<.3){axHurt(me,.25);axSay(push,tg,tm,"¡{w} escupe un proyectil a {o}!",O);faint(i)}}
  if(tot&&contact&&me.mh>0){
    if(d===56&&rng()<.3){axSay(push,tg,tm,"¡{a} de {w} ha cautivado a {o}!",O);beAil(E,i,"cnf",push,rng,false,tg)}
    if((d===152||d===268)&&me.ab!==d){me.ab=d;axSay(push,tg,tm,"¡{o} ha adquirido {a}!",O)}
    if(d===254&&me.ab!==254){const x=me.ab;me.ab=254;tm.ab=x;axSay(push,i,me,"¡{w} ha intercambiado su habilidad con {o}!",T)}
    if(d===183||d===221){axSay(push,tg,tm,"¡{a} de {w} se ha activado!");beStat(E,i,[["spe",-1]],push,tg)}
    if(d===295&&!me.sts&&rng()<.3){axSay(push,tg,tm,"¡{a} de {w} se ha activado!");beAil(E,i,"psn",push,rng,false,tg)}
    if(d===124&&!fainted&&!tm.it&&me.it&&me.ab!==60){tm.it=me.it;me.it="";axSay(push,tg,tm,"¡{w} le ha robado el objeto a {o}!",O)}
    if(d===253){axHurt(me,1/8);axSay(push,tg,tm,"¡{o} se ha hecho daño con {a} de {w}!",O,{});faint(i)}
    if(fainted&&d===106){axHurt(me,.25);axSay(push,tg,tm,"¡{a} de {w} ha dañado a {o}!",O);faint(i)}}
  if(tot&&d===238){axSay(push,tg,tm,"¡{w} suelta pelusa!");axFoesL(E,tg).forEach(o=>beStat(E,o.i,[["spe",-1]],push,tg))}
  if(fainted&&d===215&&me.mh>0){const x=Math.max(1,Math.min(me.mh,h0));me.mh-=x;axSay(push,tg,tm,"¡{a} de {w} ha dañado a {o}!",O);faint(i)}
  if(!fainted&&tm.mh>0&&tot&&me.mh>0){
    if(me.ab===143&&contact&&!tm.sts&&rng()<.3)beAil(E,tg,"psn",push,rng,false,i);
    if(me.ab===302&&!tm.sts&&rng()<.3)beAil(E,tg,"tox",push,rng,false,i);
    if(me.ab===170&&!me.it&&tm.it&&tm.ab!==60){me.it=tm.it;tm.it="";axSay(push,i,me,"¡{w} le ha robado el objeto a {o}!",T)}
    if(me.ab===1&&!acted[tg]&&tm.ab!==39&&rng()<.1)E.sd[tg].v.fl=1}
  if(fainted&&me.mh>0){if([153,224,264,265,266,267].includes(me.ab)){axSay(push,i,me,"¡{a} de {w} se ha activado!");beStat(E,i,[["atk",1]],push)}
    if(me.ab===210&&!me.bb){me.bb=1;axSay(push,i,me,"¡{w} se ha fortalecido gracias a {a}!")}}})}
// ---------- al entrar y al salir del combate ----------
function axGasIn(E,i){axSafe(()=>{const m=beAct(E.sd[i]);if(m&&m.ab&&m.ab!==256&&!m.ab0&&axFoesL(E,i).some(o=>o.m.ab===256)){m.ab0=m.ab;m.ab=0}})}
function axEnter(E,i,push,rec){axSafe(()=>{const sd=E.sd[i],m=beAct(sd);if(!m||m.mh<=0||!m.ab)return;const a=m.ab,F=axFoesL(E,i);
  const st=(L,t)=>{if(t)axSay(push,i,m,t);beStat(E,i,L,push)};
  if(a===2)axWxSet(E,"rain",5,push);if(a===70)axWxSet(E,"sun",5,push);if(a===45)axWxSet(E,"sand",5,push);if(a===117)axWxSet(E,"snow",5,push);
  if(a===189)axWxSet(E,"rain",99,push,189);if(a===190)axWxSet(E,"sun",99,push,190);if(a===191)axWxSet(E,"wind",99,push,191);
  if(a===288){axWxSet(E,"sun",5,push);axSay(push,i,m,"¡{w} late con fuerza bajo el sol!")}if(a===289){axTrSet(E,"electric",5,push);axSay(push,i,m,"¡El motor de {w} ruge!")}
  if(a===226)axTrSet(E,"electric",5,push);if(a===227)axTrSet(E,"psychic",5,push);if(a===228)axTrSet(E,"misty",5,push);if(a===229)axTrSet(E,"grassy",5,push);
  if(a===13||a===76)axSay(push,i,m,"¡Los efectos del tiempo atmosférico han desaparecido!");
  if(a===306&&(E.wx||E.tr)){E.wx=null;E.tr=null;axSay(push,i,m,"¡{w} ha borrado el tiempo atmosférico y los campos!")}
  if(a===88)st([["atk",1]],"¡{a} de {w} se ha activado!");if(a===234&&!m.ei){m.ei=1;st([["atk",1]],"¡{a} de {w} se ha activado!")}if(a===235&&!m.ei){m.ei=1;st([["def",1]],"¡{a} de {w} se ha activado!")}
  if(a===279)st([["def",1],["spe",1]],"¡{a} de {w} se ha activado!");if(a===294)st([["atk",1]],"¡{a} de {w} se ha activado!");if(a===304)st([["def",1]],"¡{w} ha cambiado a su Forma Teracristal!");
  if(a===46)axSay(push,i,m,"¡{w} ejerce presión!");if([127,266,267].includes(a))axSay(push,i,m,"¡Los rivales están tan nerviosos que no pueden comer bayas!");
  if(axMB(m))axSay(push,i,m,"¡{w} rompe moldes!");if(a===186)axSay(push,i,m,"¡{w} irradia un aura oscura!");if(a===187)axSay(push,i,m,"¡{w} irradia un aura feérica!");if(a===188)axSay(push,i,m,"¡{w} invierte las auras!");
  if(a===119)F.forEach(o=>{const it=o.m.it&&ITEMS.find(x=>x[0]===o.m.it);axSay(push,i,m,it?"¡{w} cachea a {o} y descubre su "+it[1]+"!":"¡{w} cachea a {o}: no lleva ningún objeto!",o)});
  if(a===107&&F.some(o=>o.m.m.some(mv=>mv.cl>0&&effP(mv.t,m.p)>1)))st([["eva",1]],"¡{w} se estremece: presiente un ataque peligroso!");
  if(a===108){let best=null;F.forEach(o=>o.m.m.forEach(mv=>{if(mv.cl>0&&(!best||(mv.pw||0)>(best.pw||0)))best=mv}));if(best)st([["acc",1]],"¡{w} ha descubierto que el rival tiene "+best.n+"!")}
  if(a===36&&!rec){const o=F.find(x=>![36,150,256,121,225,213,209,248,278,279].includes(x.m.ab)&&x.m.ab);if(o){m.ab=o.m.ab;axSay(push,i,m,"¡{w} ha copiado {a} de {o}!",o);if(m.ab===22)beIntim(E,i,push);axEnter(E,i,push,1)}}
  if(a===150&&!rec){const o=F[0];if(o){sd.v.st=Object.assign({},E.sd[o.i].v.st);if(o.m.ab&&o.m.ab!==150)m.ab=o.m.ab;axSay(push,i,m,"¡{w} se ha transformado en {o}!",o);if(m.ab===22)beIntim(E,i,push);if(m.ab!==150)axEnter(E,i,push,1)}}
  if(a===256){axSay(push,i,m,"¡Un gas reactivo se extiende por el terreno de combate!");F.forEach(o=>{if(!o.m.ab0&&o.m.ab){o.m.ab0=o.m.ab;o.m.ab=0}})}
  if(a===300){axSay(push,i,m,"¡{w} desprende un néctar muy dulce!");F.forEach(o=>beStat(E,o.i,[["eva",-1]],push,i))}
  if(a===261){axSay(push,i,m,"¡{w} administra una medicina extraña!");F.forEach(o=>{E.sd[o.i].v.st={atk:0,def:0,spe:0,acc:0,eva:0}})}
  if(a===251){axSay(push,i,m,"¡{w} ha limpiado las barreras de los rivales!");F.forEach(o=>{const v=E.sd[o.i].v.st;v.def=Math.min(0,v.def);v.eva=Math.min(0,v.eva)})}
  if(a===301){const al=axAllies(E,i).find(x=>x.mh<x.mx),t=al||m;if(t.mh<t.mx){axHeal(t,al?.25:.125);axSay(push,i,m,"¡{w} ofrece un té y recupera fuerzas!",null,{hl:1})}}
  if(a===278&&m.zh&&!m.hero){m.hero=1;axSay(push,i,m,"¡{w} se ha transformado en su forma heroica!")}
  if(a===103&&m.it){m.itz=m.it;m.it="";axSay(push,i,m,"¡{w} no sabe usar su objeto!")}})}
function axLeave(E,i,old){axSafe(()=>{old.zh=1;if(old.ab0){old.ab=old.ab0;delete old.ab0}if(old.ab===256)axGasOff(E)})}
function axGasOff(E){E.sd.forEach(s=>s.t.forEach(x=>{if(x.ab0){x.ab=x.ab0;delete x.ab0}}))}
function axRecv(E,i,prev,push){axSafe(()=>{const m=beAct(E.sd[i]);if(!m||!prev||![222,223].includes(m.ab)||!prev.ab||[222,223,256,150,36].includes(prev.ab))return;m.ab=prev.ab;axSay(push,i,m,"¡{w} ha heredado {a} de "+prev.p[0]+"!");axEnter(E,i,push,1)})}
function beEnter(E,i,push){axGasIn(E,i);beIntim(E,i,push);axEnter(E,i,push)}
// ---------- bayas ----------
const axNoBerry=(E,j)=>axFoesL(E,j).some(o=>[127,266,267].includes(o.m.ab));
const axBerryK=m=>{let k=m.ab===82?1/3:.25;if(m.ab===247)k*=2;if(m.ab===167)k+=1/3;if(m.ab===180)k+=1/8;return k};
// ---------- final del turno ----------
function axEnd(E,i,push,rng,faint){axSafe(()=>{const sd=E.sd[i],m=beAct(sd);sd.v.tn=(sd.v.tn|0)+1;sd.v.nw=0;if(!m||m.mh<=0)return;
  const a=m.ab,wx=axWx(E),tr=axTr(E),ty=tys(m.p),hl=(fr,t)=>{if(m.mh<m.mx){axHeal(m,fr);axSay(push,i,m,t,null,{hl:1})}},hu=(fr,t)=>{axHurt(m,fr);axSay(push,i,m,t,null,{dm:1});faint(i)};
  if(wx==="sand"&&!ty.some(t=>["rock","ground","steel"].includes(t))&&![8,146,159,142,98].includes(a)){axHurt(m,1/16);axSay(push,i,m,"¡La tormenta de arena zarandea a {w}!",null,{dm:1});faint(i)}
  if(wx==="snow"&&!ty.includes("ice")&&![81,115,142,98].includes(a)&&m.mh>0){axHurt(m,1/16);axSay(push,i,m,"¡La nieve golpea a {w}!",null,{dm:1});faint(i)}
  if(m.mh<=0)return;
  if(a===44&&wx==="rain")hl(1/16,"¡{w} recupera PS con la lluvia!");if(a===115&&wx==="snow")hl(1/16,"¡{w} recupera PS con la nieve!");
  if(a===87&&wx==="rain")hl(1/8,"¡{w} recupera PS con la lluvia!");if((a===87||a===94)&&wx==="sun"&&a!==98)hu(1/8,"¡El sol abrasa a {w}!");
  if(m.mh<=0)return;
  if(tr==="grassy"&&m.mh<m.mx)hl(1/16,"¡La hierba cura a {w}!");
  if(m.sts&&((a===93&&wx==="rain")||(a===61&&rng()<1/3)||(a===131&&rng()<.3))){m.sts="";m.slp=0;m.tox=0;axSay(push,i,m,"¡{a} de {w} le ha curado su problema de estado!")}
  if(a===131){const al=axAllies(E,i).find(x=>x.sts);if(al&&rng()<.3){al.sts="";al.slp=0;al.tox=0;axSay(push,i,m,"¡{w} ha curado a su aliado!")}}
  if(a===141){const ks=["atk","def","spe","acc","eva"],up=ks.filter(x=>sd.v.st[x]<6);if(up.length){const u=up[Math.floor(rng()*up.length)],dn=ks.filter(x=>x!==u&&sd.v.st[x]>-6);
    axSay(push,i,m,"¡{a} de {w} se ha activado!");beStat(E,i,dn.length?[[u,2],[dn[Math.floor(rng()*dn.length)],-1]]:[[u,2]],push)}}
  if(a===123)axFoesL(E,i).forEach(o=>{if(o.m.sts==="slp"){axHurt(o.m,1/8);axSay(push,i,m,"¡{o} tiene pesadillas por {a} de {w}!",o,{});faint(o.i)}});
  if(a===139&&m.it==="sitrus"&&m.ius&&(wx==="sun"||rng()<.5)){m.ius=0;axSay(push,i,m,"¡{w} ha recogido otra baya!")}
  if(a===291&&m.ru===E.turn&&m.mh<m.mx){m.ru=0;hl(axBerryK(m),"¡{w} rumia su baya y recupera PS!")}})}
function axField(E,push){axSafe(()=>{
  if(E.wx){if(E.wx.pr){if(!axHas(E,E.wx.pr)){push({k:"msg",t:AXWX[E.wx.t][1]});E.wx=null}}else if(--E.wx.n<=0){push({k:"msg",t:AXWX[E.wx.t][1]});E.wx=null}}
  if(E.tr&&--E.tr.n<=0){push({k:"msg",t:AXTR[E.tr.t][1]});E.tr=null}
  const fc=E.sd.reduce((a,s)=>a+s.t.filter(x=>x.mh<=0).length,0),df=fc-(E.fcl|0);E.fcl=fc;
  if(df>0)axLive(E).forEach(o=>{if(o.m.ab===220){axSay(push,o.i,o.m,"¡{a} de {w} se ha activado!");beStat(E,o.i,[["atk",df]],push)}});
  if(!axHas(E,256))axGasOff(E)})}
// ---------- fuera del motor: huir y objetos al ganar ----------
function axTrapped(){return axSafe(()=>{if(!B||!B.E||B.trainer)return "";const me=beAct(B.E.sd[0]),fo=beAct(B.E.sd[1]);if(!me||!fo||fo.mh<=0||me.ab===50)return "";
  const t=tys(me.p);if(fo.ab===23||(fo.ab===71&&!t.includes("flying")&&me.ab!==26)||(fo.ab===42&&t.includes("steel")))return "¡No puedes huir! "+abName(fo.ab)+" de "+fo.p[0]+" salvaje te lo impide.";return ""},"")}
{const _ab=afterBattle;afterBattle=async function(res){await _ab(res);try{if((res==="win"||res==="cap")&&B&&B.mode==="s"&&B.E){
  for(const t of B.E.sd[0].t){if(!t.played||t.mh<=0||!S.owned[t.p[0]])continue;let id=null;
    if(t.ab===53&&Math.random()<.3){const L=["pot","pot","pb","pb","sb","eter","rev","spot"];id=Math.random()<.05?"cand":L[Math.floor(Math.random()*L.length)]}
    else if(t.ab===118&&Math.random()<.4)id="pot";else if(t.ab===237&&Math.random()<.4)id=Math.random()<.25?"sb":"pb";
    if(id){const it=ITEMS.find(x=>x[0]===id);if(!it)continue;S.bag[id]=(S.bag[id]||0)+1;save();await say("¡"+t.p[0]+" ha encontrado "+it[1]+" gracias a "+abName(t.ab)+"!")}}}}catch(e){console.error(e)}}}
