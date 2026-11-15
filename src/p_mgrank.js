// =====================================================================================
// CLASIFICACIÓN SEMANAL DE CADA MINIJUEGO (Firestore: tours/{semana_juego}/s/{uid})
// Cada lunes los 25 mejores de cada minijuego reciben premio (los tickets crecen con la producción de cada jugador)
// =====================================================================================
const MGR_KEY=(w,g)=>w+"_"+g;
const MGR_EX={who:{cand:1},mem:{ub:3},dig:{_hold:1},fish:{sb:8},thr:{ub:3},run:{lucky:1},exc:{_evo:1},wgt:{ppmax:1},fos:{_hold:1},puz:{cand:1},jig:{ub:3},hl:{ppmax:1}};
// t = tickets mínimos, h = horas de tu producción (se da lo mayor), x = veces el premio especial del juego
const MGR_TIER=[{p:1,ic:"🥇",t:10000000,h:6,x:3,it:{mb:1,cand:3}},{p:2,ic:"🥈",t:6000000,h:4,x:2,it:{cand:2}},{p:3,ic:"🥉",t:4000000,h:3,x:2,it:{cand:1}},{p:10,ic:"🎖️",t:1500000,h:1,x:1,it:{}},{p:25,ic:"🏅",t:500000,h:.33,x:0,it:{}}];
const mgrTier=pos=>pos<0?null:pos<3?MGR_TIER[pos]:pos<10?MGR_TIER[3]:pos<25?MGR_TIER[4]:null;
function mgrRw(gid,pos){const T=mgrTier(pos);if(!T)return null;const rw={t:tkOf(T),it:Object.assign({},T.it)};const ex=MGR_EX[gid]||{};
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
  try{const l=await window.FB.tourTop(MGR_KEY(w,gid),25);MGR.top[gid]={w:w,l:l};MGR.at[gid]=Date.now();
    // si en la nube tienes una marca mejor que la de este dispositivo, se usa esa
    const me=window.FB.uid&&window.FB.uid(),x=me&&l.find(y=>y.id===me);if(x&&(x.sc|0)>0){S.mgw=S.mgw&&S.mgw.w===w?S.mgw:{w:w,b:{}};if((x.sc|0)>(S.mgw.b[gid]|0)){S.mgw.b[gid]=x.sc|0;save()}}
  }catch(e){MGR.top[gid]=MGR.top[gid]||{w:w,l:[]}}return MGR.top[gid].l}
// premios de la semana pasada
async function mgrClaim(){
  const pw=tourPrevWeek();if(!window.FB||!window.FB.tourTop||!window.FB.uid||!window.FB.uid())return;if(!S.mgw||S.mgw.w!==pw||S.mgrDone===pw)return;
  const me=window.FB.uid(),won=[];
  for(const gid of Object.keys(S.mgw.b||{})){if(!(S.mgw.b[gid]>0))continue;let top=null;try{top=await window.FB.tourTop(MGR_KEY(pw,gid),25)}catch(e){return}const i=(top||[]).findIndex(x=>x.id===me);const rw=mgrRw(gid,i);if(rw){grant(rw);won.push({g:MGS.find(x=>x.id===gid),i:i,rw:rw})}}
  S.mgrDone=pw;save();render();if(!won.length)return;snd("win");
  nxModal('<div class="hofb">📊</div><h3>¡Premios de la clasificación semanal!</h3><p class="mut">Semana '+pw.split("-W")[1]+'</p><div class="mgrwon">'+won.map(x=>'<div><span>'+(MGR_TIER.find(t=>t.p>=x.i+1)||{}).ic+'</span><b>'+(x.g?x.g.ic+" "+x.g.n:"")+'</b><small>'+(x.i+1)+'º · '+rwTxt(x.rw)+'</small></div>').join("")+'</div><button id="mgrOk">¡Genial!</button>');$("mgrOk").onclick=nxModalClose;
}
setTimeout(()=>{try{mgrClaim()}catch(e){}},9000);
// ---- panel ----
nxPanel("mgrP","📊 Clasificación de minijuegos","Los mejores de cada minijuego esta semana. Cada lunes, los 25 primeros de cada uno reciben premio: tickets que crecen con tu pueblo (hasta 6 horas de tu producción), Master Ball, Caramelos Raros y el premio especial de cada juego.");
{const g=HUB.find(x=>x.k==="mg");if(g&&!g.tabs.some(t=>t[0]==="mgrP"))g.tabs.push(["mgrP","Clasificación"]);HUBP.mgrP="mg";HUBR.mgrP=()=>mgrUI(true)}
async function mgrUI(force){
  const box=$("mgrPB");if(!box)return;MGR.g=MGR.g||MGS[0].id;const g=MGS.find(x=>x.id===MGR.g)||MGS[0],w=tourWeek(),ms=tourEndsIn(),d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),my=S.mgw&&S.mgw.w===w?(S.mgw.b[g.id]|0):0,me=window.FB&&window.FB.uid?window.FB.uid():null;
  const draw=()=>{const L=MGR.top[g.id]&&MGR.top[g.id].w===w?MGR.top[g.id].l:null,pos=L?L.findIndex(x=>x.id===me):-1;
    box.innerHTML='<div class="mgrtabs">'+MGS.map(x=>'<button class="'+(x.id===g.id?'on':'')+'" data-mgr="'+x.id+'" style="--mc:'+x.c+'"><span>'+x.ic+'</span><small>'+x.n+'</small></button>').join("")+'</div>'+
      '<div class="mgrb" style="--mc:'+g.c+'"><div class="mgrh"><span>'+g.ic+'</span><div><b>'+g.n+'</b><small>Termina en '+(d?d+" d ":"")+h+' h · Premio especial: '+(mgrExTxt(g.id)||'—')+'</small></div><button class="tourgo" data-mgo="'+g.id+'">▶ Jugar</button></div>'+
      '<div class="tourx mgrx">'+MGR_TIER.map(T=>{const it=Object.keys(T.it).map(k=>T.it[k]+" "+IN2(k)).concat(T.x&&mgrExTxt(g.id)?[(T.x>1?T.x+"× ":"")+mgrExTxt(g.id)]:[]);return '<span>'+T.ic+' <b>'+(T.p===1?'1º':T.p===2?'2º':T.p===3?'3º':T.p===10?'4º–10º':'11º–25º')+':</b> '+fmt(Math.round(tkOf(T)*RMUL()))+' 🎟️'+(it.length?' + '+it.join(" + "):'')+'</span>'}).join("")+'</div>'+
      '<div class="tourl">'+(!window.FB?'<small>Inicia sesión para aparecer en la clasificación.</small>':!L?'<small>Cargando clasificación…</small>':L.length?L.slice(0,10).map((x,i)=>'<div class="tourr'+(x.id===me?' me':'')+(i<3?' top':'')+'"><span class="tourp">'+(["🥇","🥈","🥉"][i]||(i+1)+"º")+'</span><span class="chav">'+chAv(x.tr)+'</span><b class="plink" data-prof="'+esc(x.id)+'">'+(x.cr?["👑","🥈","🥉"][x.cr-1]+" ":"")+esc(pvClean(x.n||"Entrenador"))+'</b>'+(x.g?' <span class="gtag">'+esc(String(x.g).slice(0,4))+'</span>':'')+'<span class="tours">'+fmt(x.sc|0)+'</span></div>').join(""):'<small>Nadie ha jugado todavía esta semana. ¡Sé el primero!</small>')+
      '<div class="tourmy">Tu mejor marca esta semana: <b>'+fmt(my)+'</b>'+(pos>=0?' · vas <b>'+(pos+1)+'º</b>'+(pos<3?' 🔥':pos>=10?' (Top 25)':''):my?' · fuera del top 25':'')+'</div></div></div>'};
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
