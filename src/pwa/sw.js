// Poke Gacha Online · service worker
// Siempre intenta descargar la versión más nueva del juego; la copia guardada solo se usa sin conexión.
const C="pokegacha-v1";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(["./","manifest.webmanifest","icon-192.png","icon-512.png"]).catch(()=>{})))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;            // Firebase, sprites, etc.: directo a internet
  if(u.searchParams.has("_v"))return;                                   // comprobación de versión nueva
  if(r.mode==="navigate"||/\.html?$/.test(u.pathname)||u.pathname.endsWith("/")){
    e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put("./",cp)).catch(()=>{});return res}).catch(()=>caches.match("./")));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r)));
});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(L=>{for(const c of L){if("focus" in c)return c.focus()}return self.clients.openWindow("./")}))});
