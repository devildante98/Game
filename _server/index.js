// =====================================================================================
// SERVIDOR DE POKE GACHA ONLINE (Cloud Functions de Firebase)
// Aquí irá, poco a poco, la lógica que decide de verdad (tickets, tiradas, premios…), para que la partida no se
// pueda modificar desde el navegador. GitHub lo publica solo en Firebase cada vez que cambia (.github/workflows).
// =====================================================================================
const {onCall} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");

// Europa (Bélgica), cerca de los jugadores; como mucho 10 copias a la vez para que el gasto no se dispare nunca
setGlobalOptions({region: "europe-west1", maxInstances: 10});

// prueba de conexión: responde con la hora del servidor y quién llama
exports.ping = onCall((req) => ({ok: true, uid: req.auth ? req.auth.uid : null, t: Date.now()}));
