// =====================================================================================
// TARJETA DE ENTRENADOR (como en la saga): tu nombre, tu aspecto, el tiempo de juego, la Pokédex, el dinero,
// las medallas… y puedes frotar las medallas para que brillen (con el tiempo se vuelven a ensuciar).
// Se abre desde el menú de Exploración: «Tarjeta».
// =====================================================================================
// tiempo de juego en Exploración
setInterval(()=>{try{if(EX.on&&!EX.title&&document.visibilityState==="visible"){const f=stSt().f;f.play=(f.play|0)+5}}catch(e){}},5000);
const tcF=()=>stSt().f;
function tcShine(i){const f=tcF(),s=(f.shine||{})[i];if(!s)return 0;const days=Math.floor((Date.now()-s.t)/(864e5*2));return Math.max(0,s.l-days)}
function tcTime(sec){sec=sec|0;const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60);return h+" h "+String(m).padStart(2,"0")+" min"}
function tcHTML(){const f=tcF(),nm=(typeof S!=="undefined"&&S.nick)||"Entrenador";let look="";try{const u=typeof av3URL==="function"?av3URL(myLook(),240,360,{yaw:.3}):null;look=u?'<img class="trimg tc3d" src="'+u+'" alt="" draggable="false">':trImg(myLook(),"front")}catch(e){}
  const own=xgRun(()=>Object.keys(S.owned||{}).filter(k=>S.owned[k]>0).length),seen=xgRun(()=>Object.keys(S.seen||S.owned||{}).length),id=String((pvHash("id"+nm)>>>0)%100000).padStart(5,"0");
  const start=stSt().t0||f.t0;const meds=XGYM.map((g,i)=>{const has=xbHas(i),sh=has?tcShine(i):0;return '<div class="tcm'+(has?" on":"")+' s'+sh+'" data-tcm="'+i+'" title="'+esc(g.b)+'"><span>'+(has?g.ic:"")+'</span>'+(has?'<i></i>':'')+'</div>'}).join("");
  return '<div class="tcbox" role="dialog" aria-label="Tarjeta de entrenador"><div class="tchd"><b>TARJETA DE ENTRENADOR</b><small>ID Nº '+id+'</small></div>'+
    '<div class="tcbody"><div class="tcinfo"><div class="tcrow"><span>NOMBRE</span><b>'+esc(nm)+'</b></div><div class="tcrow"><span>DINERO</span><b>'+fmt(xT())+' 🎟️</b></div>'+
    '<div class="tcrow"><span>POKÉDEX</span><b>'+own+'</b></div><div class="tcrow"><span>TIEMPO</span><b>'+tcTime(f.play)+'</b></div>'+
    '<div class="tcrow"><span>MEDALLAS</span><b>'+xbCount()+' / 8</b></div>'+(f.champ?'<div class="tcrow tcch"><span>LIGA</span><b>🏆 Campeón/a</b></div>':'')+
    (typeof rvName==="function"?'<div class="tcrow"><span>RIVAL</span><b>'+esc(rvName())+'</b></div>':'')+'</div><div class="tcav">'+look+'</div></div>'+
    '<div class="tcmeds">'+meds+'</div><small class="tchint">✨ Frota tus medallas con el ratón o el dedo para sacarles brillo.</small>'+
    '<div class="tcbt"><button type="button" data-tcx="1">Cerrar</button></div></div>'}
function tcOpen(){const sc=(EX.cv&&EX.cv.closest(".exscr"))||document.querySelector(".exwrap .exscr");if(!sc)return;let o=$("exTCard");if(!o){o=document.createElement("div");o.id="exTCard";o.className="extcard";sc.appendChild(o)}else if(o.parentElement!==sc)sc.appendChild(o);
  o.innerHTML=tcHTML();o.hidden=false;EX.keys={};EX.kst=[];snd("ui");tcBind(o)}
function tcClose(){const o=$("exTCard");if(o&&!o.hidden){o.hidden=true;snd("ui");try{EX.cv.focus({preventScroll:true})}catch(e){}}}
function tcBind(o){o.querySelector("[data-tcx]").onclick=e=>{e.stopPropagation();tcClose()};
  o.querySelectorAll(".tcm.on").forEach(el=>{let acc=0,last=null;const rub=(x,y)=>{if(last){acc+=Math.hypot(x-last[0],y-last[1])}last=[x,y];
      if(acc>260){acc=0;const i=+el.dataset.tcm,f=tcF();f.shine=f.shine||{};const cur=tcShine(i);if(cur<3){f.shine[i]={l:cur+1,t:Date.now()};save();snd(cur+1>=3?"lvl":"ui");el.className="tcm on s"+(cur+1)}else{f.shine[i]={l:3,t:Date.now()};el.classList.add("pop");setTimeout(()=>el.classList.remove("pop"),300)}}};
    el.addEventListener("mousemove",e=>rub(e.clientX,e.clientY));el.addEventListener("mouseleave",()=>{last=null});
    el.addEventListener("touchmove",e=>{const t=e.touches[0];if(t){e.preventDefault();rub(t.clientX,t.clientY)}},{passive:false});el.addEventListener("touchend",()=>{last=null})})}
window.addEventListener("keydown",e=>{const o=$("exTCard");if(!o||o.hidden)return;if(e.key==="Escape"||(typeof exAct==="function"&&["b","a","menu"].includes(exAct(e.key)))){e.preventDefault();e.stopPropagation();tcClose()}else e.stopPropagation()},true);
setInterval(()=>{const o=$("exTCard");if(o&&!o.hidden){EX.keys={};EX.kst=[]}},100);
// opción «Tarjeta» en el menú, justo debajo de Mochila/Equipo
try{if(!EXM_IT.some(x=>x[0]==="card"))EXM_IT.splice(EXM_IT.findIndex(x=>x[0]==="map"),0,["card","🪪",((typeof S!=="undefined"&&S.nick)||"Tarjeta")])}catch(e){}
{const _m=exMenu;exMenu=function(){try{const it=EXM_IT.find(x=>x[0]==="card");if(it)it[2]=(typeof S!=="undefined"&&S.nick)||"Tarjeta"}catch(e){}return _m.apply(this,arguments)}}
{const _md=exMenuDo;exMenuDo=function(k){if(k==="card"){try{exMenuClose(true)}catch(e){}tcOpen();return}return _md.apply(this,arguments)}}
