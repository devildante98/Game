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
  return guardar(db, uid, req.data, Date.now(), cuentaSeg);
});
