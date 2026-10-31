// =====================================================================================
// TUTORIAL INTERACTIVO PARA JUGADORES NUEVOS
// =====================================================================================
const TUT=[
 {el:"#train",t:"🎟️ Consigue tickets",d:"Los tickets son la moneda del juego. Toca la Poké Ball grande unas cuantas veces (o pulsa la tecla U).",ok:()=>(window._tutCk|0)>=5},
 {el:"#daily",t:"🎁 Tu regalo diario",d:"Cada día puedes reclamar un regalo de tickets. ¡Reclámalo todos los días para mantener tu racha!",ok:()=>S.daily===today(),skipIf:()=>S.daily===today()},
 {el:"#p1",t:"🎰 Tu primera tirada",d:"Gasta tickets en una tirada para conseguir un Pokémon. ¡A ver qué te toca!",ok:()=>(S.pulls|0)>0},
 {el:"#out .card",t:"🔍 Míralo de cerca",d:"Toca el Pokémon que te ha salido para verlo en grande: ahí puedes ponerle mote y añadirlo a tu equipo.",ok:()=>{const m=$("pkv");return !!(m&&!m.hidden)},next:1},
 {el:"#team",t:"🧩 Forma tu equipo",d:"Pon al menos un Pokémon en tu equipo tocando una casilla. Con él lucharás en los combates.",ok:()=>(S.team||[]).some(n=>n&&S.owned[n])},
 {el:"#fgo",t:"⚔️ ¡A combatir!",d:"Pulsa «¡Combatir!» para luchar contra un Pokémon salvaje. Ganando, tus Pokémon suben de nivel y evolucionan.",ok:()=>!!fcd||(stt().win|0)>0},
 {el:"#navb",t:"🧭 El menú",d:"Desde la Poké Ball MENÚ abres todo lo demás: Pokédex, Mochila, Gimnasios, Online, Minijuegos, Actividades… Los números rojos te avisan de lo pendiente.",ok:()=>{const g=$("hubG");return !!(g&&!g.hidden)}}];
var TS={i:-1,box:null,spot:null,iv:0};
const TUT_RW={t:20000,it:{pb:5,pot:3}};
function tutStart(force){if(TS.i>=0)return;if(!force&&(S.tutDone||(S.pulls|0)>0))return;TS.i=0;window._tutCk=0;tutStep();clearInterval(TS.iv);TS.iv=setInterval(tutTick,300)}
function tutEls(){if(!TS.box){TS.spot=document.createElement("div");TS.spot.id="tutSpot";TS.box=document.createElement("div");TS.box.id="tutBox";document.body.append(TS.spot,TS.box);
  TS.box.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.tu==="skip"){tutEnd(false)}else if(b.dataset.tu==="next"){TS.i++;tutStep()}else if(b.dataset.tu==="done")tutEnd(true)})}}
function tutStep(){
  tutEls();while(TS.i<TUT.length&&TUT[TS.i].skipIf&&TUT[TS.i].skipIf())TS.i++;
  if(TS.i>=TUT.length){TS.spot.hidden=true;TS.box.className="fin";TS.box.innerHTML='<b>🎉 ¡Ya sabes lo básico!</b><p>Premio por completar el tutorial: <b>'+rwTxt(TUT_RW)+'</b>. Si tienes dudas, abre ⚙️ Más → «Cómo se juega».</p><div><button class="red" data-tu="done">¡A jugar!</button></div>';TS.box.hidden=false;snd("lvl");return}
  const s=TUT[TS.i];TS.box.className="";TS.box.innerHTML='<small>Paso '+(TS.i+1)+' de '+TUT.length+'</small><b>'+s.t+'</b><p>'+s.d+'</p><div>'+(s.next?'<button class="red" data-tu="next">Siguiente</button>':'')+'<button class="alt" data-tu="skip">Saltar tutorial</button></div>';
  TS.box.hidden=false;TS.spot.hidden=false;const el=document.querySelector(s.el);if(el&&!/navb/.test(s.el))try{Element.prototype._siv.call(el,{behavior:"smooth",block:"center"})}catch(e){}
  snd("ui");tutPos();
}
function tutPos(){
  const s=TUT[TS.i];if(!s||!TS.box)return;const el=document.querySelector(s.el),bad=document.querySelector("#hubM:not([hidden]),#mgM:not([hidden]),#nxM:not([hidden]),#welc:not([hidden]),#strkM:not([hidden]),#newsM:not([hidden])");
  const hideSpot=!el||!el.offsetParent||(bad&&!/navb/.test(s.el));
  if(hideSpot){TS.spot.hidden=true;TS.box.classList.add("float")}
  else{TS.box.classList.remove("float");TS.spot.hidden=false;const r=el.getBoundingClientRect(),p=8;Object.assign(TS.spot.style,{left:(r.left-p)+"px",top:(r.top-p)+"px",width:(r.width+p*2)+"px",height:(r.height+p*2)+"px"});
    const bh=TS.box.offsetHeight||140,bw=Math.min(340,innerWidth-24),below=r.bottom+p+12+bh<innerHeight;
    TS.box.style.width=bw+"px";TS.box.style.left=Math.max(12,Math.min(innerWidth-bw-12,r.left+r.width/2-bw/2))+"px";TS.box.style.top=(below?r.bottom+p+12:Math.max(12,r.top-p-12-bh))+"px"}
}
function tutTick(){if(TS.i<0)return;const s=TUT[TS.i];if(s&&s.ok()){TS.i++;tutStep();return}tutPos()}
function tutEnd(done){clearInterval(TS.iv);TS.i=-1;if(TS.box)TS.box.hidden=true;if(TS.spot)TS.spot.hidden=true;S.tutDone=1;if(done&&!S.tutRw){S.tutRw=1;grant(TUT_RW);snd("win");toast("🎁 ¡Premio del tutorial: "+rwTxt(TUT_RW)+"!")}save();render()}
document.addEventListener("click",e=>{if(TS.i>=0&&e.target.closest&&e.target.closest("#train"))window._tutCk=(window._tutCk|0)+1},true);
document.addEventListener("keydown",e=>{if(TS.i>=0&&(O.tkeys||["u"]).includes(String(e.key).toLowerCase()))window._tutCk=(window._tutCk|0)+1},true);
// empieza solo para jugadores nuevos, cuando no hay otras ventanas abiertas
setInterval(()=>{try{if(TS.i>=0||S.tutDone||(S.pulls|0)>0)return;if(!$("welc").hidden||!$("newsM").hidden||!$("strkM").hidden)return;if(typeof popBusy==="function"&&popBusy())return;if(typeof nkPopNeeded==="function"&&nkPopNeeded())return;tutStart(false)}catch(e){}},2000);
// repetir el tutorial desde «Cómo se juega»
(function(){const w=$("welcOk");if(!w||$("tutRe"))return;const b=document.createElement("button");b.id="tutRe";b.className="alt";b.type="button";b.textContent="🧭 Ver el tutorial guiado";b.onclick=()=>{$("welc").hidden=true;S.tutDone=0;TS.i=-1;tutStart(true)};w.after(b)})();
