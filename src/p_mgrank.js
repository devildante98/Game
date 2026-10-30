// =====================================================================================
// CLASIFICACIÓN SEMANAL DE CADA MINIJUEGO (Firestore: tours/{semana_juego}/s/{uid})
// Cada lunes los 10 mejores de cada minijuego reciben premio
// =====================================================================================
const MGR_KEY=(w,g)=>w+"_"+g;
const MGR_EX={who:{cand:1},mem:{ub:3},dig:{_hold:1},fish:{sb:8},thr:{ub:3},run:{lucky:1},exc:{_evo:1},wgt:{ppmax:1}};
const MGR_TIER=[{p:1,ic:"🥇",t:1000000,x:2},{p:2,ic:"🥈",t:500000,x:1},{p:3,ic:"🥉",t:250000,x:1},{p:10,ic:"🎖️",t:100000,x:0}];
const mgrTier=pos=>pos<0?null:pos===0?MGR_TIER[0]:pos===1?MGR_TIER[1]:pos===2?MGR_TIER[2]:pos<10?MGR_TIER[3]:null;
function mgrRw(gid,pos){const T=mgrTier(pos);if(!T)return null;const rw={t:T.t,it:{}};const ex=MGR_EX[gid]||{};
  for(let k=0;k<T.x;k++)Object.keys(ex).forEach(i=>{if(i==="_hold"){const h=HOLD[Math.floor(Math.random()*HOLD.length)][0];rw.it[h]=(rw.it[h]||0)+1}else if(i==="_evo"){const ev=ITEMS.filter(q=>q[7]==="evo"),e=ev[Math.floor(Math.random()*ev.length)][0];rw.it[e]=(rw.it[e]||0)+1}else rw.it[i]=(rw.it[i]||0)+ex[i]});
  return rw}
const mgrExTxt=gid=>{const e=MGR_EX[gid]||{};return Object.keys(e).map(k=>k==="_hold"?"objeto equipable":k==="_evo"?"piedra evolutiva":(e[k]>1?e[k]+" ":"")+IN2(k)).join(" + ")};
var MGR={g:null,top:{},at:{},prev:{}};
function mgrSubmit(gid,score){
  if(score<=0||!MGS.some(g=>g.id===gid))return "";const w=tourWeek();S.mgw=S.mgw&&S.mgw.w===w?S.mgw:{w:w,b:{}};
  if(score<=(S.mgw.b[gid]|0))return "";S.mgw.b[gid]=score;save();
  if(window.FB&&window.FB.tourSet&&window.FB.uid&&window.FB.uid())window.FB.tourSet(MGR_KEY(w,gid),{sc:score,cr:myCrown(),n:pvClean(pvNick()).slice(0,30),tr:trEnc(myLook()),g:GS.doc&&GS.doc.tag?String(GS.doc.tag).slice(0,4):"",at:Date.now()}).then(()=>{MGR.at[gid]=0}).catch(()=>{});
  return '<p class="tourm">📊 Nueva mejor marca semanal en la clasificación: <b>'+fmt(score)+'</b></p>';
}
async function mgrLoad(gid,force){if(!window.FB||!window.FB.tourTop)return null;const w=tourWeek();if(!force&&MGR.top[gid]&&MGR.top[gid].w===w&&Date.now()-(MGR.at[gid]||0)<60e3)return MGR.top[gid].l;
  try{const l=await window.FB.tourTop(MGR_KEY(w,gid),10);MGR.top[gid]={w:w,l:l};MGR.at[gid]=Date.now()}catch(e){MGR.top[gid]=MGR.top[gid]||{w:w,l:[]}}return MGR.top[gid].l}
// premios de la semana pasada
async function mgrClaim(){
  const pw=tourPrevWeek();if(!window.FB||!window.FB.tourTop||!window.FB.uid||!window.FB.uid())return;if(!S.mgw||S.mgw.w!==pw||S.mgrDone===pw)return;
  const me=window.FB.uid(),won=[];
  for(const gid of Object.keys(S.mgw.b||{})){if(!(S.mgw.b[gid]>0))continue;let top=null;try{top=await window.FB.tourTop(MGR_KEY(pw,gid),10)}catch(e){return}const i=(top||[]).findIndex(x=>x.id===me);const rw=mgrRw(gid,i);if(rw){grant(rw);won.push({g:MGS.find(x=>x.id===gid),i:i,rw:rw})}}
  S.mgrDone=pw;save();render();if(!won.length)return;snd("win");
  nxModal('<div class="hofb">📊</div><h3>¡Premios de la clasificación semanal!</h3><p class="mut">Semana '+pw.split("-W")[1]+'</p><div class="mgrwon">'+won.map(x=>'<div><span>'+(MGR_TIER.find(t=>t.p>=x.i+1)||{}).ic+'</span><b>'+(x.g?x.g.ic+" "+x.g.n:"")+'</b><small>'+(x.i+1)+'º · '+rwTxt(x.rw)+'</small></div>').join("")+'</div><button id="mgrOk">¡Genial!</button>');$("mgrOk").onclick=nxModalClose;
}
setTimeout(()=>{try{mgrClaim()}catch(e){}},9000);
// ---- panel ----
nxPanel("mgrP","📊 Clasificación de minijuegos","Los mejores de cada minijuego esta semana. Cada lunes, los 10 primeros de cada uno reciben premio: 🥇 1.000.000 🎟️, 🥈 500.000 🎟️, 🥉 250.000 🎟️ y 🎖️ 100.000 🎟️ del 4º al 10º, más un premio especial de cada juego para el podio.");
{const g=HUB.find(x=>x.k==="mg");if(g&&!g.tabs.some(t=>t[0]==="mgrP"))g.tabs.push(["mgrP","Clasificación"]);HUBP.mgrP="mg";HUBR.mgrP=()=>mgrUI(true)}
async function mgrUI(force){
  const box=$("mgrPB");if(!box)return;MGR.g=MGR.g||MGS[0].id;const g=MGS.find(x=>x.id===MGR.g)||MGS[0],w=tourWeek(),ms=tourEndsIn(),d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),my=S.mgw&&S.mgw.w===w?(S.mgw.b[g.id]|0):0,me=window.FB&&window.FB.uid?window.FB.uid():null;
  const draw=()=>{const L=MGR.top[g.id]&&MGR.top[g.id].w===w?MGR.top[g.id].l:null,pos=L?L.findIndex(x=>x.id===me):-1;
    box.innerHTML='<div class="mgrtabs">'+MGS.map(x=>'<button class="'+(x.id===g.id?'on':'')+'" data-mgr="'+x.id+'" style="--mc:'+x.c+'"><span>'+x.ic+'</span><small>'+x.n+'</small></button>').join("")+'</div>'+
      '<div class="mgrb" style="--mc:'+g.c+'"><div class="mgrh"><span>'+g.ic+'</span><div><b>'+g.n+'</b><small>Termina en '+(d?d+" d ":"")+h+' h · Podio: +'+mgrExTxt(g.id)+'</small></div><button class="tourgo" data-mgo="'+g.id+'">▶ Jugar</button></div>'+
      '<div class="tourl">'+(!window.FB?'<small>Inicia sesión para aparecer en la clasificación.</small>':!L?'<small>Cargando clasificación…</small>':L.length?L.map((x,i)=>'<div class="tourr'+(x.id===me?' me':'')+(i<3?' top':'')+'"><span class="tourp">'+(["🥇","🥈","🥉"][i]||(i+1)+"º")+'</span><span class="chav">'+chAv(x.tr)+'</span><b class="plink" data-prof="'+esc(x.id)+'">'+(x.cr?["👑","🥈","🥉"][x.cr-1]+" ":"")+esc(pvClean(x.n||"Entrenador"))+'</b>'+(x.g?' <span class="gtag">'+esc(String(x.g).slice(0,4))+'</span>':'')+'<span class="tours">'+fmt(x.sc|0)+'</span></div>').join(""):'<small>Nadie ha jugado todavía esta semana. ¡Sé el primero!</small>')+
      '<div class="tourmy">Tu mejor marca esta semana: <b>'+fmt(my)+'</b>'+(pos>=0?' · vas <b>'+(pos+1)+'º</b>'+(pos<3?' 🔥':''):my?' · fuera del top 10':'')+'</div></div></div>'};
  draw();if(window.FB){await mgrLoad(g.id,force);if(nxOpen("mgrP")&&MGR.g===g.id)draw()}
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-mgr]");if(b){MGR.g=b.dataset.mgr;snd("ui");mgrUI(false)}});
// ================= avisos en cada pestaña de las ventanas del menú =================
function tabBadges(){const o={};
  const t=(k,f)=>{try{const v=f();if(v)o[k]=v}catch(e){}};
  t("qP",()=>dmEnsure().l.filter(m=>!m.c&&m.p>=MISM[m.id][2]).length);
  t("achP",()=>ACHS().filter(achReady).length);
  t("passP",()=>{const s=passSt();let r=0;for(let i=1;i<=passLv();i++)if(!s.cl[i])r++;return r});
  t("bagU",()=>evoReadyList().length);
  t("frP",()=>(FR.inc||[]).length+((typeof GF!=="undefined"&&GF.inc)?GF.inc.length:0));
  t("chatP",()=>chUnreadAll());
  t("budP",()=>{const b=S.buddy;return b&&S.owned[b.n]>0&&Date.now()-(b.gift||0)>=10*6e4?1:0});
  t("dcP",()=>(dcEggReady()?1:0)+(S.eggs||[]).filter(eggDone).length);
  t("expP",()=>(S.exp||[]).filter(x=>Date.now()>=x.t0+x.dur).length);
  t("safP",()=>(S.saf||{}).d!==today()?1:0);
  t("mgP",()=>MGS.filter(g=>mgLeft(g.id)>0).length);
  t("gymP",()=>{const i=gymNext(),n=(S.team||[]).find(x=>x&&S.owned[x]);return i>=0&&n&&lvd(n).l>=lvCap()?"!":0});
  return o}
let _tbk="";
function tabBadgeUI(){const box=$("hubTabs");if(!box||$("hubM").hidden)return;const o=tabBadges(),k=JSON.stringify(o);
  box.querySelectorAll("[data-ht]").forEach(b=>{let i=b.querySelector(".tbdg");const v=o[b.dataset.ht];if(!v){if(i)i.remove();return}if(!i){i=document.createElement("i");i.className="tbdg";b.appendChild(i)}i.textContent=v})}
{const _ho=hubOpen;hubOpen=function(){const r=_ho.apply(this,arguments);try{tabBadgeUI()}catch(e){}return r}}
setInterval(()=>{try{tabBadgeUI()}catch(e){}},1500);
document.addEventListener("click",()=>setTimeout(()=>{try{tabBadgeUI()}catch(e){}},200));
