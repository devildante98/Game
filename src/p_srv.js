// =====================================================================================
// TIRADAS Y MEJORAS EN EL SERVIDOR (versión 7.2)
// Con cuenta, las tiradas del gacha y las mejoras de edificios y guantes las hace el servidor (_server/gacha.js y
// _server/tienda.js): él cobra, decide el azar y guarda la partida con el resultado; aquí solo se aplica lo que
// devuelve y se enseña igual que antes. Sin cuenta, todo sigue funcionando en el navegador como siempre.
// Las peticiones van en fila (window.srvAccion, en el módulo de Firebase): cada una sale con la partida ya al día.
// =====================================================================================
const srvOn=()=>!!(window.srvAccion&&window.FB&&window.FB.uid&&window.FB.uid()&&!window.__sessLocked);
const srvJ=()=>{delete S._h;return sigAdd(JSON.stringify(S))};
const SRV_TXT={saldo:"No tienes tickets suficientes.",maximo:"Ya está al nivel máximo.",cantidad:"Cantidad no válida.",version:"Hay una versión nueva del juego: recarga la página."};
const SRV_RED="Sin conexión con el servidor: con cuenta, las tiradas y las mejoras necesitan conexión. Inténtalo de nuevo.";
// (sesión en otro dispositivo o partida rechazada: ya sale su propio aviso)
const srvErr=r=>r&&["sesion","rechazado","pausa","nada"].includes(r.why)?"":(r&&SRV_TXT[r.why])||SRV_RED;

// ---- tiradas ----
// aplica lo que ha salido en el servidor exactamente como lo hace pull(): Pokémon, variocolores, Poké Ball con la que
// llegan, tickets de repetidos, megas repetidas, misiones y la animación
function srvPullApply(t,n,sup){
  MDUP={c:0,t:0};$("out").innerHTML="";$("out").classList.remove("nox");$("msg").textContent="";
  // (si estás en un combate de Exploración, los Pokémon van a tu partida normal)
  const xg=typeof XGSW!=="undefined"&&XGSW&&typeof xgOut==="function";if(xg)xgOut();
  const res=[];let back=0;
  try{
    S.t-=t.coste;if(sup)S.sp=t.sp;else S.np=t.np;S.pity=t.pity;S.balls=S.balls||{};S.when=S.when||{};S.bag=S.bag||{};
    for(const x of t.res||[]){const p=PM[x[0]];if(!p)continue;const name=x[0],isNew=!!x[1],r=+x[2]||0,sh=!!x[3],md=x[4]|0;
      if(!S.owned[name]){S.balls[name]=BALLR[p[2]];S.when[name]=Date.now()}
      S.owned[name]=(S.owned[name]||0)+1;S.pulls=(S.pulls||0)+1;
      if(sh){S.shiny=S.shiny||{};S.shiny[name]=(S.shiny[name]||0)+1;qEv("shiny")}
      if(md){S.owned[name]=Math.max(1,(S.owned[name]|0)-1);if(md===1){S.bag.cand=(S.bag.cand||0)-r;MDUP.c-=r}else MDUP.t+=r}
      back+=Math.max(0,r);res.push([p,isNew,r,sh])}
    qEv("pull",n);if(sup)qEv("spull",n);const nn=res.filter(x=>x[1]).length;if(nn)qEv("new",nn);
    S.t+=back;
  }finally{if(xg&&typeof xgIn==="function")xgIn()}
  save();render();
  const RC={C:"#fff",R:"#7fb6ff",E:"#d3a2ff",M:"#ff9ad8",L:"#ffd15c"};
  const best=res.reduce((a,x)=>"CREML".indexOf(x[0][2])>"CREML".indexOf(a)?x[0][2]:a,"C");
  gachaShow(res,n,best,back,sup,RC);
  if(MDUP.c||MDUP.t){const c=MDUP.c,tk=MDUP.t;setTimeout(()=>toast("🔑 Megas/Gigamax repetidas convertidas en: "+[c?c+" Caramelo"+(c>1?"s":"")+" Raro"+(c>1?"s":""):"",tk?fmt(tk)+" 🎟️":""].filter(Boolean).join(" y ")+"."),1800)}
}
{const _pl=pull;pull=function(n,sup){
  if(!srvOn())return _pl.apply(this,arguments);
  if(busy||S.t<cost(n,sup))return;
  busy=true;$("msg").textContent="🎰 Tirando…";
  // (r.tirada falta solo si el servidor aún no se ha actualizado: entonces no se ha tirado ni cobrado nada)
  window.srvAccion({k:"tirar",n:n,sup:!!sup},srvJ,r=>{if(r.tirada)srvPullApply(r.tirada,n,sup)})
    .then(r=>{if(!r||!r.ok||!r.tirada){busy=false;const m=r&&r.ok?"El servidor se está actualizando: espera un momento y vuelve a tirar.":srvErr(r);$("msg").textContent=m;if(m)toast("⚠️ "+m)}})
    .catch(()=>{busy=false;$("msg").textContent=SRV_RED;toast("⚠️ "+SRV_RED)})}}

// ---- mejoras de la tienda (edificios y guantes) ----
// Van de una en una: cada compra se calcula cuando le toca, con los tickets y niveles ya actualizados. Si tocas varias
// veces seguidas el mismo edificio mientras otra compra está en camino, se juntan en una sola petición.
// srvShopN: cuántos niveles (como mucho lim) se pueden pagar ahora y cuánto cuestan (como shopN)
function srvShopN(i,lim){const lv0=i<0?(S.cl|0):(S.g[i]|0),unit=k=>i<0?Math.round(25*Math.pow(3,lv0+k)):Math.ceil(G[i][1]*Math.pow(GGR[i]||1.15,lv0+k));
  let n=0,c=0;while(n<lim){if(i<0&&lv0+n>=GLMAX)break;const u=unit(n);if(c+u>S.t)break;c+=u;n++}return [n,c]}
const SRVSH={};
{const _sb=shopBuy;shopBuy=function(i){
  if(!srvOn())return _sb.apply(this,arguments);
  if(i<0&&(S.cl|0)>=GLMAX)return;const [n0,c0]=shopN(i);if(!n0||S.t<c0)return;
  const mx=SHQ==="max",k=String(i),q=SRVSH[k];
  // ya hay una compra de este edificio esperando su turno: se suma a esa
  if(q&&!q.go){if(mx)q.mx=1;else q.u+=n0;return}
  const ac={k:"mejorar",i:i,n:0},job={u:n0,mx:mx,go:0};SRVSH[k]=job;
  // (si cuando le toca ya no llega para ninguna, no se envía)
  window.srvAccion(ac,()=>{job.go=1;if(SRVSH[k]===job)delete SRVSH[k];const [n]=job.mx?shopN(i):srvShopN(i,job.u);if(!n)return null;ac.n=n;return srvJ()},
      r=>{const m=r.mejora;if(!m)return;S.t-=m.coste;if(i<0){S.cl=m.nivel;window._fk=null}else{S.g[i]=m.nivel}window._gk=null;save();render()})
    .then(r=>{if(SRVSH[k]===job)delete SRVSH[k];if(!r||!r.ok||!r.mejora){const m=r&&r.ok?"El servidor se está actualizando: espera un momento y vuelve a intentarlo.":srvErr(r);if(m)toast("⚠️ "+m)}})
    .catch(()=>{if(SRVSH[k]===job)delete SRVSH[k];toast("⚠️ "+SRV_RED)})}}

// ---- premios de la semana pasada (torneo semanal y clasificación de cada minijuego) ----
// Con cuenta los calcula el servidor (_server/semana.js): mira tu puesto real en cada clasificación, te da el premio y
// apunta que ya lo has cobrado. Aquí solo se añade a tu partida lo mismo que ha guardado él y se enseña como siempre.
let SRVSEM=0;
function srvSemApply(s){
  if(!s)return null;const pw=s.pw;
  const xg=typeof XGSW!=="undefined"&&XGSW&&typeof xgOut==="function";if(xg)xgOut();
  let tr=null,won=[];
  try{
    S.tourDone=pw;S.mgrDone=pw;delete S.mgwPrev;
    if(!s.ya){
      const t=s.torneo;
      if(t){grant(t.rw);let isNew=false;
        if(t.mon&&PM[t.mon]){const lv=clampL(Math.max(10,Math.min(lvCap(),leadLevel())));isNew=giveMon(t.mon,lv,!!t.sh)}
        if(t.pos>=0&&t.pos<10){S.trophies=S.trophies||[];S.trophies.push({w:pw,p:t.pos+1,g:t.g});if(t.pos<3)S.crown={w:tourWeek(),p:t.pos+1}}
        tr={rw:t.rw,mon:t.mon&&PM[t.mon]?PM[t.mon]:null,isNew:isNew,T:tierOf(t.pos),sh:!!t.sh,pos:t.pos}}
      won=(s.mgr||[]).map(x=>{grant(x.rw);return {g:MGS.find(g=>g.id===x.gid),i:x.pos,rw:x.rw}});
    }
  }finally{if(xg&&typeof xgIn==="function")xgIn()}
  save();render();return {pw:pw,tr:tr,won:won};
}
function srvSemShow(o){
  const mg=()=>mgrShow(o.won,o.pw);
  if(o.tr){tourGiveShow(o.tr.pos,o.pw,o.tr);const b=$("tourOk");if(b&&o.won.length)b.onclick=()=>{nxModalClose();setTimeout(mg,300)}}
  else mg();
}
async function srvSemana(){
  if(SRVSEM||!srvOn())return;const pw=tourPrevWeek();if(S.tourDone===pw&&S.mgrDone===pw)return;SRVSEM=1;
  let o=null,r=null;
  try{r=await window.srvAccion({k:"semana"},srvJ,x=>{o=srvSemApply(x.semana)})}catch(e){r=null}
  if(!r||!r.ok){SRVSEM=0;if(!r||!["version","sesion","rechazado","pausa"].includes(r.why))setTimeout(srvSemana,60000);return}
  if(o&&(o.tr||o.won.length))srvSemShow(o);
}
// con cuenta, el cobro siempre va por el servidor (aunque en ese momento no se pueda: se reintenta solo)
{const _tc=tourClaim;tourClaim=function(){if(window.FB&&window.FB.uid&&window.FB.uid())return srvSemana();return _tc.apply(this,arguments)}}
{const _mc=mgrClaim;mgrClaim=function(){if(window.FB&&window.FB.uid&&window.FB.uid())return srvSemana();return _mc.apply(this,arguments)}}
setTimeout(()=>{try{srvSemana()}catch(e){}},20000);

// ---- regalo diario y racha ----
// Con cuenta los da el servidor (_server/diario.js): una vez al día y con su propia cuenta de la racha. Aquí se
// añade lo mismo que ha guardado él y se avisa como siempre.
let SRVDAY=0;
function srvDayApply(d){
  if(!d)return;
  const xg=typeof XGSW!=="undefined"&&XGSW&&typeof xgOut==="function";if(xg)xgOut();
  try{S.daily=d.hoy;S.dg=d.dg;S.sk=Object.assign({},d.sk);
    if(!d.ya){S.t+=(d.gf||0)+(d.tk||0);S.bag=S.bag||{};Object.keys(d.it||{}).forEach(k=>{S.bag[k]=(S.bag[k]||0)+d.it[k]});qEv("daily")}
  }finally{if(xg&&typeof xgIn==="function")xgIn()}
  save();render();try{_sk="";strkUI()}catch(e){}
  if(d.ya){toast("🔥 El regalo de hoy ya lo habías cobrado.");return}
  snd("win");const got=[];if(d.tk)got.push("+"+fmt(d.tk)+" 🎟️ extra");Object.keys(d.it||{}).forEach(k=>got.push(d.it[k]+" "+IN(k)));
  $("msg").textContent="¡+"+fmt(d.gf)+" 🎟️ de regalo diario! Mañana será mayor.";
  toast("🔥 ¡Racha de "+S.sk.n+" día"+(S.sk.n===1?"":"s")+"! +"+fmt(d.gf)+" 🎟️"+(got.length?" y "+got.join(", "):""));
}
{const _d=$("daily").onclick;$("daily").onclick=function(){
  if(!(window.FB&&window.FB.uid&&window.FB.uid()))return _d.apply(this,arguments);
  if(S.daily===today()||SRVDAY||!srvOn())return;SRVDAY=1;$("daily").disabled=true;
  window.srvAccion({k:"diario"},srvJ,r=>srvDayApply(r.diario))
    .then(r=>{SRVDAY=0;if(!r||!r.ok||!r.diario){const m=r&&r.ok?"El servidor se está actualizando: espera un momento y vuelve a intentarlo.":srvErr(r);if(m)toast("⚠️ "+m);render()}})
    .catch(()=>{SRVDAY=0;toast("⚠️ "+SRV_RED);render()})}}
