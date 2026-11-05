// =====================================================================================
// EXPLORACIÓN · frases de los entrenadores de las rutas
// pre: antes del combate · win: cuando les ganas · lose: cuando te ganan · after: si les vuelves a hablar
// =====================================================================================
const EXDLG=[
 [/^Joven/,{pre:["¡Eh! ¡Nuestras miradas se han cruzado! ¡Combatamos!","¡Mis Pokémon llevan toda la mañana entrenando! ¡Vamos!","¿Es tu primera vez por aquí? ¡Te enseñaré cómo se combate en esta ruta!","¡Llevo pantalones cortos todo el año! ¡Son muy cómodos para combatir!"],
   win:["¡Ay! ¡Mis pobres Pokémon!","¡Vaya paliza! Tendré que entrenar más.","¡No es justo! ¡Estaba a punto de ganar!"],lose:["¡Sí! ¡Lo sabía!","¡Jeje! Mis Pokémon son los mejores de la ruta.","¡Toma ya! ¡Otra victoria para mi colección!"],
   after:["Cuando sea mayor quiero ser campeón de la Liga.","Mis amigos dicen que en la hierba alta hay Pokémon muy raros.","¡La próxima vez te ganaré seguro!"]}],
 [/^(Chica|Niña)/,{pre:["¡Mis Pokémon son tan monos como fuertes!","¿Combatimos? ¡Prometo no llorar si pierdo!","¡Te he visto pasar y no he podido resistirme!","¡Hoy estrenamos estrategia! ¿Quieres probarla?"],
   win:["¡Ooh! Mis Pokémon necesitan una siesta…","Has ganado… ¡pero mis Pokémon siguen siendo los más adorables!","¡Qué fuerte eres! ¿Me das algún consejo?"],lose:["¡Bien! ¡Sabía que podíamos!","¡Lo siento! ¡Hoy estamos en racha!","¡Jiji! ¡Ve a curarlos al Centro Pokémon!"],
   after:["Me encanta cepillar a mis Pokémon después de cada combate.","¿Has visto algún Pokémon brillante? Dicen que salen muy de vez en cuando.","¡Algún día seré líder de gimnasio!"]}],
 [/^Cazabichos/,{pre:["¡Mis bichos son los más fuertes del bosque!","¡Shhh! Estaba cazando… ¡pero un combate es todavía mejor!","¿Sabías que los Pokémon Bicho evolucionan muy rápido? ¡Mira!","¡He atrapado un montón de bichos esta mañana! ¡Te los presento!"],
   win:["¡Mis bichitos! ¡Volved a la red!","Vaya… quizá necesito un bicho más grande.","¡Has aplastado a mis bichos! Literalmente…"],lose:["¡Bzzz! ¡Los bichos al poder!","¡Te lo dije! ¡Los bichos son lo más!","¡Mi red y mis Pokémon nunca fallan!"],
   after:["Un Caterpie que entrenes bien puede ser un Butterfree precioso en nada.","Por la mañana temprano salen bichos que no ves a otras horas.","¡No pises la hierba alta sin mirar, que hay bichos durmiendo!"]}],
 [/^Exploradora/,{pre:["¡Llevo días en el bosque entrenando!","¡Cada rincón esconde un Pokémon nuevo! ¿Lo comprobamos combatiendo?","¡Una exploradora siempre está preparada para un combate!","He cartografiado toda esta zona. ¡Ahora toca medirnos!"],
   win:["Increíble… Lo apunto en mi diario de viaje.","Tus Pokémon están muy bien entrenados. ¿Desde dónde vienes?","Perder también enseña. ¡Gracias!"],lose:["¡La experiencia de campo se nota!","¡Ja! Este bosque no tiene secretos para mí.","Vuelve cuando hayas explorado un poco más."],
   after:["Hay objetos escondidos por las rutas. ¡Se renuevan cada día!","Si te pierdes, busca los carteles: siempre indican el camino.","Me han hablado de una cima donde vive un Pokémon legendario…"]}],
 [/^Nadador/,{pre:["¡El mar me ha hecho fuerte! ¡A ver qué tienes!","¡Acabo de salir del agua y aún tengo energía de sobra!","¡Las olas de hoy están perfectas para un combate!","¿Sabes nadar? ¡Mis Pokémon sí, y muy rápido!"],
   win:["¡Glub, glub! Me he hundido…","¡Qué combate! Necesito darme otro chapuzón para despejarme.","Me has dejado como un Magikarp fuera del agua."],lose:["¡Ja! ¡La marea está de mi lado!","¡El agua siempre gana!","¡A nadar se aprende perdiendo, y a combatir también!"],
   after:["Los Pokémon de agua se esconden entre las dunas de la playa.","Después de combatir, un buen chapuzón lo arregla todo.","¿Has probado a pescar? Mi amigo el pescador sabe mucho."]}],
 [/^Pescador/,{pre:["¡Hoy han picado unos Pokémon estupendos!","¡Llevo horas sin pescar nada! ¡Por lo menos combatamos!","¡Shhh, que asustas a los peces! …Bueno, ya que estás aquí, ¡combate!","¡Mira qué ejemplares he sacado del agua!"],
   win:["¡Se me ha escapado el combate como un pez!","Hoy no es mi día… ni con la caña ni con los Pokémon.","Vaya. Tendré que volver a la pesca."],lose:["¡Picaste el anzuelo!","¡Ja! ¡El Magikarp también sabe pelear!","Paciencia: así se pesca y así se gana."],
   after:["Dicen que un Magikarp que no se rinde se convierte en algo enorme.","Los mejores Pokémon de agua salen cuando el mar está tranquilo.","Si pescas algo gordo, ¡avísame!"]}],
 [/^Montañero/,{pre:["¡Las rocas no me asustan, y tú tampoco!","¡He subido montañas más altas que tú! ¡Combate!","¡Mis Pokémon son duros como una roca!","¡Uf! Necesitaba un descanso… ¡y un buen combate!"],
   win:["¡Ay, ay! ¡Avalancha de golpes!","Me has dejado más agotado que una subida a la cima.","Tus Pokémon son más duros que mis rocas."],lose:["¡Jo, jo! ¡La montaña siempre gana!","¡Fuerte como una roca, ya te lo dije!","Entrena en las cuevas y vuelve."],
   after:["En las cuevas hay Pokémon en cualquier sitio, ¡no solo en la hierba!","Lleva siempre Pociones cuando vayas a la montaña.","Desde la cima se ve toda la región. ¡Merece la pena!"]}],
 [/^Karateka/,{pre:["¡Hiyaa! ¡Pon a prueba tu espíritu!","¡Mis puños y mis Pokémon están listos!","¡Mil flexiones al día! ¡Hoy toca combate!","¡Un verdadero luchador nunca rechaza un desafío!"],
   win:["¡Ugh! ¡Tu espíritu es más fuerte que el mío!","Me inclino ante ti. ¡Gran combate!","¡Tengo que volver a entrenar bajo la cascada!"],lose:["¡Hiyaa! ¡La disciplina gana!","¡Entrena cuerpo y mente, y vuelve!","¡Así se lucha!"],
   after:["La fuerza no lo es todo: la velocidad también cuenta.","Un buen entrenador cuida a sus Pokémon antes y después de luchar.","¡Mañana, más entrenamiento!"]}],
 [/^Esquiadora|^(Esquiador|Patinador)/,{pre:["¡Bajo las pistas más rápido que nadie! ¿Y tú?","¡La nieve está perfecta para un combate!","¡Combate sobre hielo! ¡Cuidado, que resbala!","¡Mis Pokémon no tienen frío nunca!"],
   win:["¡Me he caído de culo!","¡Brrr! Qué combate más helador.","¡Vaya derrape! Has ganado."],lose:["¡Ja! ¡Más rápido que una avalancha!","¡El hielo es mi terreno!","Abrígate antes de volver a intentarlo."],
   after:["En la nieve, los Pokémon de hielo se camuflan muy bien.","¡No te alejes del camino, que con la ventisca te pierdes!","Un chocolate caliente después de combatir es lo mejor."]}],
 [/^Excursionista/,{pre:["¡La ceniza volcánica es buenísima para la piel!","¡Llevo toda la mañana caminando! ¡Hora de combatir!","¡Mi mochila pesa, pero mis Pokémon pegan más fuerte!","¡Un combate en plena excursión, qué bien!"],
   win:["¡Uf! Necesito sentarme un rato…","¡Qué paliza! Y yo que venía de excursión tranquila…","¡Ganas tú! Te invito a merendar."],lose:["¡Ja! ¡El aire libre nos sienta genial!","¡Una excursión y una victoria! ¡Día perfecto!","¡Ánimo! Ya ganarás la próxima."],
   after:["Bebe mucha agua: con este calor se cansan hasta los Pokémon.","Las aguas termales de la villa curan cualquier cansancio.","¡Me encanta caminar con mis Pokémon fuera de la Poké Ball!"]}],
 [/^Domador/,{pre:["¡Mis Pokémon arden de ganas de combatir!","¡Cuidado, que mis Pokémon queman!","¡El fuego es pura energía! ¿Lo notas?","¡Prepárate para sudar!"],
   win:["¡Mis llamas se han apagado!","¡Me has dejado frío!","¡Qué calor me ha entrado de la vergüenza!"],lose:["¡Ardiente victoria!","¡Te he dejado chamuscado!","¡El fuego siempre gana!"],
   after:["Los Pokémon de fuego odian la lluvia. ¡Acuérdate!","Con el volcán activo, mis Pokémon están más fuertes que nunca.","¡Un día domaré al ave de fuego!"]}],
 [/^(Bombero|Ingeniero)/,{pre:["¡Yo apago fuegos… y tú vas a apagarte!","¡He cargado a mis Pokémon al cien por cien!","¡Revisión técnica completada! ¡Listo para combatir!","¡En mi trabajo no hay descanso, y en los combates tampoco!"],
   win:["¡Avería total!","Vale, vale… me retiro a revisar el equipo.","¡Necesito una recarga!"],lose:["¡Misión cumplida!","¡Funcionamiento perfecto!","¡Ja! ¡Bien calibrado!"],
   after:["Revisa siempre a tus Pokémon antes de una aventura larga.","La seguridad es lo primero: ¡no te acerques demasiado a la lava!","Mis Pokémon me ayudan en el trabajo todos los días."]}],
 [/^(Científica|Geóloga|Científico)/,{pre:["¡Estudio la temperatura de tus derrotas!","¡Experimento número 42: tu derrota!","¡Estas rocas tienen miles de años! ¡Y tus Pokémon, pocos minutos!","¡Hipótesis: mis Pokémon ganarán! ¡Comprobémoslo!"],
   win:["¡Hipótesis refutada!","Interesante… anotaré estos datos.","¡Mis cálculos han fallado!"],lose:["¡Resultado confirmado!","¡La ciencia no se equivoca!","¡Datos perfectos para mi investigación!"],
   after:["Las estadísticas base de cada especie lo cambian todo en combate.","¿Sabías que la Velocidad decide quién ataca primero?","Estoy estudiando a los Pokémon legendarios de esta región."]}],
 [/^Motero/,{pre:["¡Más rápido que un relámpago!","¡Brrrum! ¡Aparta o combate!","¡Mi moto y mis Pokémon van a toda velocidad!","¡Nadie pasa por esta ruta sin vérselas conmigo!"],
   win:["¡Me has dejado sin gasolina!","¡Frenazo! Has ganado.","¡Ay! ¡He derrapado en la curva!"],lose:["¡Brrrum! ¡Te he dejado atrás!","¡Velocidad pura!","¡Vuelve cuando tengas más potencia!"],
   after:["En la tormenta hay que conducir con cuidado.","¡Mis Pokémon eléctricos cargan la moto!","¡Un día recorreré todas las regiones sobre ruedas!"]}],
 [/./,{pre:["¡Eh, tú! ¡Combate conmigo!","¡Vamos a ver de qué eres capaz!","¡Nuestras miradas se han cruzado! ¡Ya sabes lo que significa!"],
   win:["¡Has ganado! ¡Qué bien combates!","¡Vaya! Tengo que entrenar más.","¡Buen combate!"],lose:["¡He ganado!","¡Sigue entrenando!","¡Más suerte la próxima vez!"],
   after:["¡Qué buen combate! Sigue entrenando, que se nota que tus Pokémon te quieren.","Cada día salen entrenadores nuevos por las rutas.","¡Cuida mucho a tus Pokémon!"]}]];
const exDlgOf=nm=>{for(const d of EXDLG)if(d[0].test(nm||""))return d[1];return EXDLG[EXDLG.length-1][1]};
const exPick=a=>a[Math.floor(Math.random()*a.length)];
// cada vez que entras en un mapa, cada entrenador elige qué decir (incluida su frase original)
{const _l=exLoad;exLoad=function(){const r=_l.apply(this,arguments);try{EX.npcs.forEach(n=>{if(n.story)return;const d=exDlgOf(n.n);if(n.txt0==null)n.txt0=n.txt;n.txt=exPick(d.pre.concat(n.txt0?[n.txt0]:[]))})}catch(e){}return r}}
// si les vuelves a hablar después de ganarles
{const _i=exInteract;exInteract=function(){if(!EX.cut&&!EX.dlg&&!EX.mv&&!EX.trans){const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy,n=EX.npcs.find(q=>!q.story&&q.px===x&&q.py===y);
    if(n&&n.beat){n.f=OPP[EX.f];exSay([n.n+":","«"+exPick(exDlgOf(n.n).after)+"»"]);return}}
  return _i.apply(this,arguments)}}
// frase al terminar el combate (derrota o victoria del entrenador)
{const _b=exBattle;exBattle=function(cfg,npc){const r=_b.apply(this,arguments);try{if(npc&&!npc.story&&EX.battle)EX.lastTr={b:EX.battle,n:npc,m:EX.map}}catch(e){}return r}}
setInterval(()=>{const L=EX.lastTr;if(!L||EX.battle===L.b||!EX.on||EX.title||EX.dlg||EX.trans||EX.cut)return;EX.lastTr=null;if(EX.map!==L.m)return;
  const d=exDlgOf(L.n.n);exSay([L.n.n+":","«"+exPick(L.b.win?d.win:d.lose)+"»"])},400);
