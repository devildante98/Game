// =====================================================================================
// INTERCAMBIO MILAGROSO
// Mandas un Pokémon y recibes al azar el que haya mandado otro entrenador. Si hay alguno esperando, el cambio es al
// momento; si no, el tuyo se queda esperando y, en cuanto otro entrenador mande uno, te llega el suyo (aunque no estés
// jugando: lo recibes al volver). Puedes retirar el que espera mientras nadie se lo haya llevado.
// Usa la colección «wonder» (reglas en firestore.rules) y las mismas copias que los intercambios entre amigos
// (pkTake / pkGive de p_more.js): el principal con su nivel o un repetido a nivel 1.
// =====================================================================================
const WN_DAY=10,WN_WAIT=3;
// si nadie se lleva tu Pokémon en 20 minutos, lo cambia un entrenador de otra región (un Pokémon al azar de la misma rareza)
const WN_NPC=20*60*1000;
// las llamadas al servidor no pueden quedarse colgadas para siempre (conexión lenta o caída)
const wnTO=(p,ms)=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r({code:"timeout"}),ms||15000))]);
const WN={sel:null,q:"",f:"",mine:[],unsub:null,busy:false,last:null};
const wnDay=()=>{const d=today();if(!S.wt||S.wt.d!==d)S.wt={d:d,n:0};return S.wt};
const wnOn=()=>!!(window.FB&&window.FB.uid&&window.FB.uid()&&window.FB.wnPool);
// lo que llega no pasa de tu límite de nivel (el del próximo gimnasio)
const wnFix=r=>({n:r.n,l:Math.max(1,Math.min(r.l|0,typeof lvCap==="function"?lvCap():100)),s:r.s?1:0});
function wnShow(sent,got,from){
  nxModal('<div class="wnres"><h3>✨ ¡Intercambio Milagroso!</h3><div class="wnrow">'+trCard(sent,"Has enviado","")+'<div class="wnarrow">⇄</div>'+trCard(got,"Has recibido",from?"De "+esc(pvClean(from)):"")+'</div>'+(from?'<p class="mut wnfrom">Te lo ha mandado <b>'+esc(/^Entrenador de /.test(from)?String(from).slice(0,30):pvClean(from))+'</b></p>':'')+
    '<button class="red" onclick="nxModalClose()">¡Genial!</button></div>');snd("lvl");try{if(got&&PM[got.n])setTimeout(()=>cry(got.n),300)}catch(e){}
}
async function wnSend(){
  if(WN.busy)return;if(!wnOn()){toast("Inicia sesión con tu cuenta para usar el Intercambio Milagroso.");return}
  if(typeof fcd!=="undefined"&&fcd){toast("Termina el combate primero.");return}
  const key=WN.sel,rec=trRecK(key);if(!rec){toast("Elige un Pokémon para enviar.");return}
  const[n,k]=trSplit(key);if(k==="m"&&typeof busyMon==="function"&&busyMon(n)){toast("Ese Pokémon está "+busyTxt(n)+".");return}
  const day=wnDay();if(day.n>=WN_DAY){toast("Hoy ya has hecho "+WN_DAY+" Intercambios Milagrosos. ¡Vuelve mañana!");return}
  const waiting=WN.mine.filter(x=>x.st==="wait").length;
  if(!await askOk("¿Enviar a "+(rec.s?"✨ ":"")+nk(n)+" (Nv"+rec.l+") al Intercambio Milagroso? No sabrás qué Pokémon recibes hasta el final."))return;
  WN.busy=true;wnUI(true);const nick=pvClean(pvNick());
  try{
    // primero se busca uno que esté esperando (de otro entrenador), al azar
    let pool=[];try{pool=(await wnTO(window.FB.wnPool(),12000)).filter(x=>x.u!==window.FB.uid())}catch(e){pool=[]}
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
    let got=null,from="";
    for(const x of pool.slice(0,4)){const pr=window.FB.wnTake(x.id,rec,nick);
      try{const d=await wnTO(pr,15000);got=d.m;from=d.un||"";break}
      catch(e){if(e&&e.code==="timeout"){
        // la conexión va lenta: si al final el cambio sale, se termina en cuanto llegue la respuesta
        pr.then(d=>{const out=trTakeK(key);if(!out)return;day.n++;const g=wnFix(d.m);pkGive(g,true).then(()=>{save();render();wnShow(out,g,d.un||"");if(window.cloudFlush)try{window.cloudFlush(true)}catch(x){}})}).catch(()=>{});
        toast("📶 La conexión va lenta. Si el intercambio termina, te avisaremos.");return}}}
    if(!got&&waiting>=WN_WAIT){toast("Ya tienes "+WN_WAIT+" Pokémon esperando. Espera a que alguien se los lleve o retira alguno.");return}
    if(!got)await wnTO(window.FB.wnPut(rec,nick),15000);
    // ya en la nube: ahora sale de tu partida
    const out=trTakeK(key);if(!out){toast("Ese Pokémon ya no está en tu partida.");return}
    day.n++;WN.sel=null;
    if(got){const g=wnFix(got);await pkGive(g,true);save();render();wnShow(out,g,from)}
    else{save();render();snd("throw");toast("🌀 "+nk(n)+" está esperando a otro entrenador. Si nadie se lo lleva en 20 minutos, lo cambiará un entrenador de otra región.")}
    if(window.cloudFlush)try{window.cloudFlush(true)}catch(e){}
  }catch(e){toast(e&&e.code==="timeout"?"📶 No hay conexión con el servidor. Tu Pokémon sigue contigo: inténtalo en un momento.":"No se ha podido hacer el intercambio ("+((e&&e.code)||"error")+"). Inténtalo otra vez.")}
  finally{WN.busy=false;wnUI(true)}
}
// los tuyos que estaban esperando: si alguien se los ha llevado, recibes lo que dejó
async function wnCollect(){
  const S2=S.wnGot=S.wnGot||{};
  for(const x of WN.mine){if(x.st!=="done"||!x.b)continue;
    if(!S2[x.id]){S2[x.id]=Date.now();const g=wnFix(x.b);await pkGive(g,true);save();render();wnShow(x.m,g,x.bn||"");if(window.cloudFlush)try{window.cloudFlush(true)}catch(e){}}
    window.FB.wnDel(x.id).catch(()=>{});}
  // (se olvidan los apuntes de hace más de una semana)
  for(const k in S2)if(Date.now()-S2[k]>7*864e5)delete S2[k];
}
// ---------- entrenadores de otras regiones: se llevan los que llevan 20 minutos esperando ----------
const WN_REG=["Kanto","Johto","Hoenn","Sinnoh","Teselia","Kalos","Alola","Galar","Paldea"];
function wnNpcMon(sent){const r=PM[sent.n]?PM[sent.n][2]:"C",L=P.filter(p=>p[2]===r&&p[0]!==sent.n&&!(typeof isSup==="function"&&isSup(p[0]))&&!/^Mega-|Gigamax|Primigenio/.test(p[0]));
  const A=L.length?L:P.filter(p=>p[2]==="C"),p=A[Math.floor(Math.random()*A.length)];return{n:p[0],l:Math.max(1,sent.l|0),s:sent.s?1:(Math.random()<.01?1:0)}}
async function wnNpc(){if(WN.busy||WN.npc||!wnOn())return;const old=WN.mine.filter(x=>x.st==="wait"&&x.at&&Date.now()-x.at>WN_NPC);if(!old.length)return;WN.npc=true;
  try{for(const x of old){let d=null;try{d=await wnTO(window.FB.wnCancel(x.id),15000)}catch(e){continue}if(!d)continue;S.wnGot=S.wnGot||{};if(S.wnGot[x.id])continue;S.wnGot[x.id]=Date.now();
      if(d.st==="done"&&d.b){const g=wnFix(d.b);await pkGive(g,true);save();render();wnShow(d.m,g,d.bn||"");continue}
      const g=wnFix(wnNpcMon(d.m)),from="Entrenador de "+WN_REG[Math.floor(Math.random()*WN_REG.length)];await pkGive(g,true);save();render();wnShow(d.m,g,from);
      if(window.cloudFlush)try{window.cloudFlush(true)}catch(e){}}}
  finally{WN.npc=false;wnUI(true)}}
setInterval(()=>{try{wnNpc()}catch(e){}},30000);
async function wnCancel(id){
  if(WN.busy)return;WN.busy=true;
  try{const d=await wnTO(window.FB.wnCancel(id),15000);if(!d)return;
    if(d.st==="done"&&d.b){S.wnGot=S.wnGot||{};if(!S.wnGot[id]){S.wnGot[id]=Date.now();const g=wnFix(d.b);await pkGive(g,true);save();render();wnShow(d.m,g,d.bn||"")}}
    else{await pkGive(d.m,false);save();render();toast("↩️ "+nk(d.m.n)+" ha vuelto contigo.")}
  }catch(e){toast("No se ha podido retirar.")}finally{WN.busy=false;wnUI(true)}
}
function wnUI(force){
  const box=$("wonPB");if(!box)return;
  if(!wnOn()){box.innerHTML='<p class="mut">Inicia sesión con tu cuenta para usar el Intercambio Milagroso.</p>';return}
  const day=wnDay(),wait=WN.mine.filter(x=>x.st==="wait"),rec=trRecK(WN.sel);
  let h='<div class="wntop"><div class="wnbox">'+trCard(rec,"Vas a enviar","Elige abajo")+'<div class="wnarrow">⇄</div><div class="tcard empty wnq"><small>Recibirás</small><div class="tqm">?</div><small class="mut">¡Sorpresa!</small></div></div>'+
    '<div class="wnside"><button class="red big" id="wnGo"'+(WN.busy||!rec||day.n>=WN_DAY?' disabled':'')+'>'+(WN.busy?'🌀 Buscando entrenador…':'✨ Intercambio Milagroso')+'</button><small class="mut">Hoy: '+day.n+' / '+WN_DAY+'</small></div></div>';
  if(wait.length)h+='<h3 class="shh">🌀 Esperando a otro entrenador ('+wait.length+'/'+WN_WAIT+')</h3><div class="wnwait">'+wait.map(x=>'<div class="wnw">'+(PM[x.m.n]?ico(PM[x.m.n],48,false,!!x.m.s):'')+'<b>'+recTxt(x.m)+'</b><small class="mut">'+(x.at?(Date.now()-x.at>=WN_NPC?'Buscando un entrenador de otra región…':'Otra región en '+Math.max(1,Math.ceil((WN_NPC-(Date.now()-x.at))/6e4))+' min'):'')+'</small><button class="alt mini" data-wnc="'+esc(x.id)+'">Retirar</button></div>').join("")+'</div>';
  h+='<h3 class="shh">Elige qué Pokémon envías</h3>';
  const q=nrm(WN.q),L=trOwnList().filter(p=>(!q||nrm(p[0]).includes(q)||nrm(nk(p[0])).includes(q))&&(!WN.f||p[2]===WN.f)).sort((a,b)=>WW[a[2]]-WW[b[2]]||lvd(a[0]).l-lvd(b[0]).l).slice(0,240);
  h+='<div class="tfil"><input id="wnQ" placeholder="Buscar Pokémon..." value="'+esc(WN.q)+'"><select id="wnF"><option value="">Todas</option>'+["C","R","E","L"].map(r=>'<option value="'+r+'"'+(WN.f===r?' selected':'')+'>'+STAR[r]+'</option>').join("")+'</select></div>'+
    '<div class="tgrid">'+(L.length?trCells(L,WN.sel,"data-wnp"):'<small class="mut">No hay Pokémon con ese filtro.</small>')+'</div>';
  const a=document.activeElement,aid=a&&a.id==="wnQ",pos=aid?a.selectionStart:null;
  box.innerHTML=h;if(aid){const i=$("wnQ");if(i){i.focus();try{i.setSelectionRange(pos,pos)}catch(e){}}}
}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest||!t.closest("#wonPB"))return;
  const p=t.closest("[data-wnp]");if(p){WN.sel=WN.sel===p.dataset.wnp?null:p.dataset.wnp;snd("ui");wnUI(true);return}
  const c=t.closest("[data-wnc]");if(c){wnCancel(c.dataset.wnc);return}
  if(t.closest("#wnGo"))wnSend()});
document.addEventListener("input",e=>{if(e.target&&e.target.id==="wnQ"){WN.q=e.target.value;wnUI(true)}});
document.addEventListener("change",e=>{if(e.target&&e.target.id==="wnF"){WN.f=e.target.value;wnUI(true)}});
nxPanel("wonP","✨ Intercambio Milagroso","Manda un Pokémon y recibe al azar el que haya mandado otro entrenador. ¡Nunca sabes qué te va a tocar!");
{const g=HUB.find(x=>x.k==="soc");if(g&&!g.tabs.some(t=>t[0]==="wonP")){const i=g.tabs.findIndex(t=>t[0]==="mktP");g.tabs.splice(i<0?g.tabs.length:i,0,["wonP","✨ Intercambio Milagroso"])}HUBP.wonP="soc";HUBR.wonP=()=>wnUI(true)}
// se vigilan tus Pokémon en espera desde que inicias sesión (para recibir el cambio aunque estés en otra parte del juego)
setInterval(()=>{if(!wnOn()){if(WN.unsub){try{WN.unsub()}catch(e){}WN.unsub=null;WN.mine=[]}return}
  const u=window.FB.uid();if(WN.unsub&&WN.uid===u)return;if(WN.unsub){try{WN.unsub()}catch(e){}}WN.uid=u;
  WN.unsub=window.FB.wnMine(L=>{WN.mine=L;wnCollect().catch(()=>{});wnNpc().catch(()=>{});wnUI(true)},
    ()=>{/* se ha cortado: se vuelve a conectar en la próxima vuelta */const f=WN.unsub;WN.unsub=null;try{f&&f()}catch(e){}})},2000);
