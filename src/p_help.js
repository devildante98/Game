// =====================================================================================
// AYUDA AMPLIADA DEL BOTÓN (?)
// Explicación de «cómo funciona» de las secciones que tenían poca información o ninguna. La ventana de ayuda
// (gmHelpT, p_game.js) la añade debajo de la introducción de cada sección, con el título «📖 Cómo funciona».
// Clave: el id de la sección (pestaña del menú o pantalla del modo juego).
// =====================================================================================
const HELPX={
  advP:[
    "Del 1 al 24 de diciembre se abre una casilla cada día (con la fecha de España). Solo puedes abrir la del día.",
    "Si un día no la abres, verás encima lo que te habría tocado. Del 25 al 31 de diciembre puedes recuperar todas las que te falten.",
    "Cada regalo es mayor que el anterior: los tickets crecen día a día (y con tu pueblo, en horas de producción) y los objetos y Pokémon son cada vez mejores.",
    "Hay Pokémon de hielo casi cada semana: legendarios como Articuno (día 12), Regice (día 18) y Kyurem (día 22), y variocolores a partir del día 16.",
    "El 24, la gran sorpresa: ✨ Delibird y ✨ Articuno variocolores, 5 Master Ball, 2 Cristales Supremos, 15 Caramelos Raros y 15 millones de tickets o más.",
    "En la parte de arriba ves qué trae la casilla de mañana.",
  ],
  wonP:[
    "Elige un Pokémon y pulsa «Intercambio Milagroso». Si otro entrenador ha dejado uno, te lo llevas al momento y él recibe el tuyo.",
    "Si no hay nadie esperando, tu Pokémon se queda esperando (hasta 3 a la vez). En cuanto otro entrenador mande uno, te llega el suyo, aunque no estés jugando.",
    "Puedes retirar un Pokémon que espera mientras nadie se lo haya llevado, y vuelve contigo.",
    "Puedes mandar tu Pokémon principal (con su nivel) o un repetido (a nivel 1). El que recibes llega con su nivel, sin pasar tu límite de nivel.",
    "Puedes hacer hasta 10 Intercambios Milagrosos al día. Necesitas una cuenta iniciada.",
  ],
  stage:[
    "Cada tirada te da un Pokémon al azar. Puedes hacer 1, 10 o 100 tiradas a la vez.",
    "Garantía: si encadenas muchas tiradas normales sin un Épico o un Legendario, la siguiente es Épico o mejor seguro (cada 30 tiradas; cada 25 desde el prestigio 3 y cada 20 desde el prestigio 6).",
    "La Súper tirada cuesta más, pero da muchas más probabilidades de Épico y Legendario, y el doble de probabilidad de variocolor (1 de cada 250, frente a 1 de cada 500).",
    "El precio sube cada 10 tiradas que haces. Cada nivel de prestigio te da un 5 % de descuento en las tiradas (hasta un 50 %).",
    "Cada semana hay un Pokémon destacado que sale más a menudo, y durante los eventos de temporada salen más los Pokémon de sus tipos.",
    "Los Pokémon que ya tienes salen algo más a menudo. Si sale un repetido, recuperas tickets según su rareza, y con 5 copias consigues su pegatina brillante en el Álbum.",
    "En las horas felices de «Lluvia de legendarios» hay más legendarios, y en las de «Variocolores ×3» salen tres veces más variocolores.",
  ],
  earnP:[
    "🎁 Regalo diario: reclámalo una vez al día. Cada día que lo reclamas da más tickets (sigue subiendo durante 60 días).",
    "🔥 Racha: si lo reclamas días seguidos, la racha sube y cada día da un premio extra (objetos, Caramelos Raros, Master Ball…). Los premios se repiten cada 30 días y son mejores en cada vuelta. Si te saltas un día, la racha vuelve a 1.",
    "⏱️ Ticket automático: mientras tienes el juego abierto y a la vista, cada 30 segundos recibes tickets, y cada vez 10 más que la anterior.",
    "Además puedes ganar tickets con los minijuegos, el Pase de temporada, las misiones, los combates y tocando la Poké Ball.",
  ],
  shopP:[
    "Cada edificio de tu pueblo produce tickets cada segundo, también mientras no juegas. Cuanto más nivel tiene, más produce.",
    "Cada nivel de los Guantes de entrenador duplica los tickets que ganas con cada toque en la Poké Ball.",
    "Con los botones ×1, ×10, ×50 y Máx compras varios niveles de una vez. El precio de cada nivel sube un poco cada vez.",
    "Cada nivel de prestigio aumenta un 50 % la producción de todo tu pueblo.",
  ],
  collP:[
    "Aquí están todos los Pokémon del juego. Los que tienes se ven en color y los que te faltan aparecen como ❔.",
    "Toca un Pokémon que tengas para abrir su ficha con toda su información.",
    "Usa los filtros para buscar por rareza, tipo, generación o fecha, ver solo los que te faltan, los repetidos, los variocolores o tus favoritos, y cambiar el orden.",
    "El número ×N indica cuántas copias tienes. Con 5 copias consigues su pegatina brillante en el Álbum.",
  ],
  dcP:[
    "Elige dos Pokémon que se lleven bien: del mismo tipo, o cualquiera junto a Ditto. Los legendarios y las formas especiales no pueden criar.",
    "Cada 30 minutos el encargado encuentra un huevo. Puedes llevar hasta 6 huevos a la vez.",
    "El huevo es de la primera fase de la evolución del Pokémon (si dejas un Charizard, sale un Charmander).",
    "Los huevos eclosionan después de unos combates (4 si es común, 5 si es raro, 7 si es épico) o, si no, a las 3 horas.",
    "Puede heredar la naturaleza de uno de los padres y, con mucha suerte (1 de cada 120), salir variocolor.",
    "Los Pokémon de la Guardería no pueden estar a la vez en tu equipo.",
  ],
  budP:[
    "Toca a tu compañero para hacerle mimos y dale bayas (una vez cada 30 minutos) para que suba vuestra amistad. También sube cuando ganas combates con él en el equipo.",
    "Cada 10 minutos encuentra un regalo con tickets.",
    "Niveles de amistad: Conocido, Buen amigo (regalos con más tickets y a veces objetos), Gran amigo (objetos más valiosos), Muy buen amigo (en combate a veces aguanta un golpe con 1 PS) y Mejor amigo (puede evolucionar por amistad sin Cascabel Alivio).",
    "Puedes cambiar de compañero cuando quieras: cada Pokémon recuerda su amistad.",
  ],
  twP:[
    "Cada combate es contra un entrenador con 3 Pokémon, y cada vez son más fuertes. A partir del combate 9, algunos llevan objetos.",
    "Cada 10 combates te espera el As de la Torre, con 4 Pokémon y uno de ellos legendario. Vencerlo da el triple de Puntos Torre.",
    "Cada victoria da Puntos Torre (más cuanto más alta es tu racha). Si pierdes, la racha vuelve a 0, pero no pierdes los puntos.",
    "Gasta los Puntos Torre en la Tienda de la Torre: objetos para equipar (Restos, Vidasfera, Banda Focus…), Caramelos Raros, PP máximos, Cristal Supremo y Master Ball.",
  ],
  expP:[
    "Puedes tener 3 expediciones a la vez. Elige el lugar, la duración (1, 4 u 8 horas) y un Pokémon que no esté en tu equipo.",
    "Cuanto más larga es la expedición, más traen. Si el tipo del Pokémon encaja con el lugar (los marcados en verde), traen un 50 % más.",
    "Vuelven con tickets (más cuanto mayor sea su nivel y su rareza), Poké Balls, pociones y, a veces, Caramelos Raros, objetos evolutivos u objetos para equipar.",
    "También ganan experiencia, sin pasar el límite de nivel del próximo gimnasio.",
  ],
  hhP:[
    "Hay 5 tipos de hora feliz: ✨ Variocolores ×3 · 🎟️ Tickets ×2 por toque · ⭐ Experiencia ×2 · 🌟 Lluvia de legendarios en las tiradas · 🎮 Premios de minijuegos ×2.",
    "🎉 Día de la Comunidad (sábados de 16:00 a 19:00): un Pokémon sale muchísimo en tiradas y combates, con variocolores ×5 para él. Los demás variocolores salen el doble.",
    "Las horas son las mismas para todos los jugadores (hora de España). Te avisamos cuando empieza una.",
  ],
  calP:[
    "Aquí ves las horas felices, el Día de la Comunidad y los jefes de incursión de los próximos días, con su hora.",
    "Cada día a medianoche hay misiones diarias nuevas y vuelven a dar premio las partidas de los minijuegos.",
    "El jefe de incursión cambia cada 3 horas: mira cuál viene para preparar un equipo con ventaja de tipo.",
  ],
  mgP:[
    "Cada minijuego da premio en sus 3 primeras partidas de cada día: tickets según tu puntuación y, a veces, Super Ball, Ultra Ball o pociones. Si bates tu récord, a veces también un Caramelo Raro.",
    "En la hora feliz de «Minijuegos ×2» los premios se duplican.",
    "🏆 Torneo semanal: cada semana hay un minijuego de torneo. Los mejores de la semana ganan Pokémon exclusivos, Master Ball y muchos tickets.",
    "Además, cada minijuego tiene su propia clasificación semanal (Clasificación). Para competir necesitas una cuenta iniciada.",
    "Jugar minijuegos también da experiencia para el Pase de temporada.",
  ],
  raidP:[
    "Crea una sala o únete a una abierta. Cuando estéis listos (de 1 a 4 entrenadores), tenéis 3 minutos para quitarle todos los PS al jefe entre todos.",
    "Usa Pokémon con ventaja de tipo: debajo del jefe ves a qué tipos es débil.",
    "Si lo derrotáis, cada uno recibe tickets, Ultra Balls y a veces un Caramelo Raro u objeto para equipar. Quien hace más daño gana más tickets y más Poké Balls Honor.",
    "Con las Poké Balls Honor puedes intentar capturar al jefe (1 de cada 50 sale variocolor).",
    "Los premios se cobran en las 5 primeras incursiones de cada día. Puedes seguir jugando después, pero sin premio.",
  ],
  mktP:[
    "Vende Pokémon y objetos poniendo el precio que quieras (entre 1.000 y 2.000.000.000 🎟️). Puedes tener hasta 5 cosas a la venta a la vez.",
    "Cuando alguien compra lo tuyo, cobras automáticamente el precio menos un 5 % de comisión.",
    "Puedes retirar lo que tengas a la venta mientras nadie lo haya comprado, y lo recuperas.",
    "Lo que compras llega al momento a tu Pokédex o a tu Mochila.",
  ],
  passP:[
    "Ganas experiencia del pase jugando: combate ganado +12 · captura +10 · tirada +2 (súper +3, hasta 200 al día) · minijuego +15 · combate PVP +15 (+10 si ganas) · Pokémon nuevo +6 · evolución +20 · regalo diario +30 · variocolor +25 · misión diaria +8.",
    "Cada nivel tiene su premio: tickets, Poké Balls, pociones, Caramelos Raros, piedras evolutivas, Master Ball… Y en el nivel 30, un Pokémon legendario.",
    "El pase dura un mes. Cuando termina empieza uno nuevo desde el nivel 0, con otros premios.",
  ],
  achP:[
    "Cada logro tiene varios niveles. Cuando completas uno, pulsa «Reclamar» (o «Reclamar todos») para recibir su premio y pasar al siguiente nivel.",
    "La dificultad (★) indica lo difícil que es: cuantas más estrellas, mejor premio.",
    "Para subir de prestigio necesitas todos los logros, menos los marcados como «extra».",
  ],
  trAchP:[
    "Aquí ves los logros que ya has reclamado y cuánto llevas del total.",
    "Para conseguir más, ve a Progreso › Logros y reclama los que tengas completados.",
    "Al subir de prestigio empiezan unos logros nuevos, distintos y al azar.",
  ],
  trP:[
    "Elige el cuerpo, la cara, el pelo, la ropa y los accesorios de tu entrenador.",
    "Arrástralo para girarlo y verlo en 3D, y pulsa «Ver lanzamiento» para ver cómo lanza la Poké Ball en combate.",
    "Guarda hasta 5 conjuntos en «Mis conjuntos» para cambiar de aspecto con un toque, o pulsa «Aleatorio» para probar algo nuevo.",
    "Más ropa en la Tienda de Evento y como premio al subir de prestigio.",
  ],
  newsP:[
    "Aquí están todas las actualizaciones del juego, de la más nueva a la más antigua, con su fecha y lo que ha cambiado.",
    "Cuando sale una versión nueva te avisamos con una ventana para actualizar (puedes hacerlo más tarde si estás en mitad de algo).",
  ],
  roadP:[
    "Lo que aparece aquí está en preparación y llegará en próximas actualizaciones.",
    "¿Echas algo en falta? Envíalo desde Más › Sugerencias: el creador del juego las lee todas.",
  ],
  refP:[
    "Comparte tu código con quien quieras. Sirve para personas que empiezan a jugar (hasta 15 invitados).",
    "Tú ganas por cada invitado: 300.000 🎟️ + 2 Ultra Ball cuando se une, 1.000.000 🎟️ + 2 Caramelos Raros cuando consigue 2 medallas y 2.500.000 🎟️ + 1 Master Ball cuando consigue 4. Los reclamas aquí, en la lista de tus invitados.",
    "Tu invitado recibe 500.000 🎟️ + 10 Poké Ball al entrar, y 1.000.000 🎟️ cuando consigue 4 medallas.",
    "Necesitas una cuenta iniciada para invitar.",
  ],
};
