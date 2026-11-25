// =====================================================================================
// RACHA DE REGALOS (8.1)
// Con cada amigo: si los dos os enviáis un regalo el mismo día, la racha sube 🔥. Si un día uno de los dos no lo envía,
// vuelve a empezar. Cada 3, 7, 14, 30, 60 y 100 días seguidos, los dos recibís un premio. Los días son los de la hora
// UTC (como el regalo diario entre amigos). Firestore: gstreak/{a_b}; las reglas solo dejan subir la racha de 1 en 1.
// =====================================================================================
const GSTK={L:{},at:0,busy:false};
const gsDayN=()=>Math.floor((typeof window.srvNow==="function"?window.srvNow():Date.now())/864e5);
const gsOther=g=>g.a===v8Uid()?g.b:g.a;
const gsMyF=g=>g.a===v8Uid()?"la":"lb",gsOtF=g=>g.a===v8Uid()?"lb":"la";
// racha viva: el último día completo es hoy o ayer
const gsCur=g=>{if(!g)return 0;return(g.d|0)>=gsDayN()-1?(g.n|0):0};
const gsOf=u=>GSTK.L[u]||null;
// estado de hoy con ese amigo: sent = yo ya he enviado, got = él/ella ya ha enviado, done = día completo, risk = se pierde si no
function gsToday(u){const g=gsOf(u),t=gsDayN();if(!g)return{n:0,sent:false,got:false,done:false,risk:false};const n=gsCur(g),sent=g[gsMyF(g)]===t,got=g[gsOtF(g)]===t,done=(g.d|0)===t;
  return{n,sent,got,done,risk:n>0&&!done}}
const GS_MS=[[3,{h:.25,it:{ub:3}}],[7,{h:1,it:{cand:1}}],[14,{h:1.5,it:{cand:2,ppmax:1}}],[30,{h:3,it:{mb:1}}],[60,{h:4,it:{mb:1,crys:1}}],[100,{h:6,it:{mb:2,crys:2}}]];
// (si ya se está cargando y se pide de nuevo con «force», se espera a que acabe y se vuelve a cargar: así no quedan datos viejos)
async function gsLoad(force){if(!window.FB||!window.FB.gsMine||!v8Uid())return;if(GSTK.p){if(!force)return GSTK.p;try{await GSTK.p}catch(e){}}if(!force&&Date.now()-GSTK.at<90000)return;
  GSTK.p=(async()=>{try{const L=await window.FB.gsMine();const o={};L.forEach(g=>{o[gsOther(g)]=g});GSTK.L=o;GSTK.at=Date.now();gsRewards();gsDecor()}catch(e){}})();
  try{await GSTK.p}finally{GSTK.p=null}}
setInterval(()=>{try{if(typeof FR!=="undefined"&&Object.keys(FR.l||{}).length)gsLoad(nxOpen&&nxOpen("frP"))}catch(e){}},20000);
// premios al llegar a cada marca (cada uno cobra el suyo en su partida, una vez por amigo y marca)
function gsRewards(){S.gsr=S.gsr&&typeof S.gsr==="object"?S.gsr:{};let best=S.gsBest|0;
  Object.keys(GSTK.L).forEach(u=>{const g=GSTK.L[u],n=gsCur(g);best=Math.max(best,g.best|0);const got=S.gsr[g.id]|0;
    const ms=GS_MS.filter(m=>m[0]<=n&&m[0]>got);if(!ms.length)return;const m=ms[ms.length-1];S.gsr[g.id]=m[0];
    const rw={t:v8Tk(m[1].h,300000),it:Object.assign({},m[1].it)};grant(rw);const nm=frName(u);snd("lvl");
    toast("🔥 ¡Racha de "+m[0]+" días de regalos con "+nm+"! Premio: "+rwTxt(rw));
    if(m[0]>=7)diaryAdd("🔥","¡"+m[0]+" días seguidos regalándoos cosas con "+nm+"!",null,0,"o")});
  if(best!==(S.gsBest|0))S.gsBest=best;save();render()}
TITLES.push(["gs30","🔥 Amistad inquebrantable",()=>(S.gsBest|0)>=30]);
// al enviar un regalo se apunta también en la racha
{const _gs=gfSend;gfSend=async function(u){const before=gfSentToday(u);const r=await _gs.apply(this,arguments);
  if(!before&&gfSentToday(u)&&window.FB&&window.FB.gsSend){try{const g=await window.FB.gsSend(u);g.id=g.id||(g.a+"_"+g.b);GSTK.L[u]=g;const st=gsToday(u);
      if(st.done&&st.n>0)toast("🔥 ¡Racha de "+st.n+(st.n===1?" día":" días")+" con "+frName(u)+"! Mañana, otra vez.");
      else if(!st.got)toast("🎁 ¡Regalo enviado! Si "+frName(u)+" te envía uno hoy, la racha "+(st.n?"sube a "+(st.n+1):"empieza")+".");
      gsRewards();gsDecor()}catch(e){}}
  return r}}
// al abrir un regalo: recordatorio para devolverlo y no perder la racha
{const _go=gfOpen;gfOpen=async function(id){const g=(GF.inc||[]).find(x=>x.id===id),from=g&&g.from;const r=await _go.apply(this,arguments);
  try{if(from&&!gfSentToday(from)){const st=gsToday(from),m=$("nxM");const box=m&&m.querySelector(".nxmw");if(box&&!box.querySelector(".gsrem")){box.querySelector("button").insertAdjacentHTML("beforebegin",'<p class="gsrem">🔥 '+(st.n?'Tenéis una racha de <b>'+st.n+' días</b>: ':'')+'¡devuélvele el regalo hoy para '+(st.n?'que suba':'empezar una racha')+'!</p><button class="red" id="gsBack">🎁 Enviarle un regalo</button>');
      const b=$("gsBack");if(b)b.onclick=async()=>{b.disabled=true;await gfSend(from);nxModalClose()}}}}catch(e){}return r}}
// en la lista de amigos: 🔥 junto al nombre, aviso si está en peligro y resumen arriba
function gsDecor(){const box=document.querySelector("#frP .frl");if(!box)return;
  box.querySelectorAll(".pvrow").forEach(row=>{const b=row.querySelector("b.plink[data-prof]");if(!b)return;const u=b.dataset.prof,st=gsToday(u);let s=row.querySelector(".gsb");
    const html=st.n?'🔥'+st.n+(st.risk?(st.sent?' ⏳':' ⚠️'):''):(st.sent&&!st.got?'⏳':'');
    const tip=st.n?(st.done?"Racha de "+st.n+" días. ¡Hoy ya está! Mañana, otra vez.":st.sent?"Racha de "+st.n+" días: ya has enviado tu regalo, falta el suyo":"Racha de "+st.n+" días: ¡envíale un regalo hoy o se perderá!"):st.sent?"Si te envía un regalo hoy, empieza vuestra racha":"";
    if(!html){if(s)s.remove();return}if(!s){s=document.createElement("span");s.className="gsb";b.after(s)}if(s.innerHTML!==html)s.innerHTML=html;s.title=tip;s.classList.toggle("risk",st.risk&&!st.sent)});
  const p=box.parentNode;let sum=p.querySelector(".gssum");const L=Object.keys(GSTK.L).filter(u=>isFriend(u)).map(u=>({u,st:gsToday(u)})).filter(x=>x.st.n||x.st.sent).sort((a,b)=>b.st.n-a.st.n);
  if(!L.length){if(sum)sum.remove();return}const risk=L.filter(x=>x.st.risk&&!x.st.sent);
  const h='<b>🔥 Rachas de regalos</b><small class="mut">Si los dos os enviáis un regalo cada día, la racha sube. Premios a los 3, 7, 14, 30, 60 y 100 días.</small>'+
    (risk.length?'<small class="gsrisk">⚠️ Envía hoy un regalo a '+risk.slice(0,4).map(x=>esc(frName(x.u))).join(", ")+(risk.length>4?" y "+(risk.length-4)+" más":"")+' para no perder la racha.</small>':'')+
    '<div class="gslist">'+L.slice(0,8).map(x=>'<span class="'+(x.st.done?'ok':x.st.risk&&!x.st.sent?'risk':'')+'">'+esc(frName(x.u))+' <b>🔥'+x.st.n+'</b>'+(x.st.done?' ✅':x.st.sent?' ⏳':'')+'</span>').join("")+'</div>';
  if(!sum){sum=document.createElement("div");sum.className="lgnow gssum";p.insertBefore(sum,box)}if(sum._h!==h){sum._h=h;sum.innerHTML=h}}
{const _f=frUI;frUI=function(){const r=_f.apply(this,arguments);try{gsDecor();gsLoad(false)}catch(e){}return r}}
setInterval(()=>{try{if(nxOpen("frP"))gsDecor()}catch(e){}},5000);
// aviso en el menú si alguna racha está en peligro y aún no has enviado tu regalo
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{const n=Object.keys(GSTK.L).filter(u=>{const st=gsToday(u);return st.risk&&!st.sent}).length;if(n)o.soc=(o.soc|0)+n}catch(e){}return o}}
