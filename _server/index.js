// =====================================================================================
// SERVIDOR DE POKE GACHA ONLINE (Cloud Functions de Firebase)
// Aquí va, poco a poco, la lógica que decide de verdad, para que la partida no se pueda modificar desde el
// navegador. GitHub lo publica solo en Firebase cada vez que cambia (.github/workflows/firebase.yml).
// =====================================================================================
const {onCall} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {getAuth} = require("firebase-admin/auth");
const {guardar} = require("./guardar");
const discord = require("./discord");

initializeApp();
const db = getFirestore();

// Europa (Bélgica), cerca de los jugadores; como mucho 10 copias a la vez para que el gasto no se dispare nunca
setGlobalOptions({region: "europe-west1", maxInstances: 10});

// prueba de conexión: responde con la hora del servidor y quién llama
exports.ping = onCall((req) => ({ok: true, uid: req.auth ? req.auth.uid : null, t: Date.now()}));

// guardar la partida (fase 1): el servidor comprueba la sesión y que la partida sea posible antes de guardarla
exports.guardar = onCall({memory: "512MiB", timeoutSeconds: 30}, async (req) => {
  const uid = req.auth ? req.auth.uid : null;
  let cuentaSeg = 0;
  if (uid) {
    try {
      const u = await getAuth().getUser(uid);
      cuentaSeg = (Date.now() - new Date(u.metadata.creationTime).getTime()) / 1000;
    } catch (e) {
      cuentaSeg = 0;
    }
  }
  const r = await guardar(db, uid, req.data, Date.now(), cuentaSeg);
  // el primer guardado de la semana nueva anuncia en Discord el podio del torneo de la anterior (una sola vez)
  try { await discord.torneoSemanal(db, Date.now()); } catch (e) { /* un fallo de Discord nunca afecta al guardado */ }
  // (8.0) llegada del Mercader misterioso y pista adelantada del tesoro semanal
  try { await discord.eventosV8(db, Date.now()); } catch (e) { /* tampoco */ }
  return r;
});

// avisos en Discord de códigos públicos y sorteos (solo administradores; lo pide el juego al crearlos o sortearlos)
exports.discord = onCall({timeoutSeconds: 20}, async (req) => {
  try { return await discord.avisar(db, req.auth ? req.auth.uid : null, req.data); } catch (e) { return {ok: false, why: "error"}; }
});
