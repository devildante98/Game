// ================= ventanas emergentes para las solicitudes que te llegan =================
// Retos PVP, salas 2 vs 2, solicitudes de amistad, solicitudes para entrar en tu gremio e invitaciones por mensaje privado.
// (Los intercambios ya tienen su propia ventana.) Una ventana cada vez; esperan a que termine el combate.
const RQ={seen:{},cur:null};
function rqBusy(){const vis=id=>{const e=document.getElementById(id);return e&&!e.hidden&&e.offsetParent!==null};
  return (typeof fcd!=="undefined"&&fcd)||!!document.querySelector(".uidlg")||vis("ltM")||vis("trdM")||vis("welc")||vis("tutBox")||vis("gLoad")||(typeof EX!=="undefined"&&EX.cut)||(typeof WM!=="undefined"&&WM.open)}
function rqItems(){const L=[];const me=window.FB&&window.FB.uid?window.FB.uid():null;if(!me)return L;
  // retos de duelo PVP y salas 2 vs 2
  try{if(typeof PR!=="undefined"&&PR&&PV.st==="idle"&&!D&&!R2){const inc=pvIncoming();
    inc.ch.forEach(p=>{const v=p.presence.pvp,n=pvClean(v.n);L.push({k:"c"+p.peer+(v.ch.room||""),ic:"⚔️",t:"¡"+esc(n)+" te reta a un duelo PVP!",s:"Modo "+(v.ch.md==="l"?"libre (con megas, Dinamax y movimientos Z)":"clásico")+" · con tu equipo de combate",
      ok:"⚔️ Aceptar duelo",no:"Rechazar",alive:()=>pvIncoming().ch.some(q=>q.peer===p.peer),
      onOk:()=>{if(!pvTeamData().length){toast("Necesitas un equipo de combate para aceptar.");return}pvAccept(p.peer)},onNo:()=>pvDecline(p.peer)})});
    inc.inv.forEach(p=>{const v=p.presence.pvp,c=v.inv.code;L.push({k:"i"+p.peer+c,ic:"👥",t:esc(pvClean(v.n))+" te invita a su sala 2 vs 2",s:"Código de sala: <b>"+esc(c)+"</b>",ok:"👥 Unirme",no:"No, gracias",
      alive:()=>pvIncoming().inv.some(q=>q.peer===p.peer&&q.presence.pvp.inv.code===c),onOk:()=>{try{hubOpen("onl","pvpP")}catch(e){}setTimeout(()=>r2Open(c,false),300)}})})}}catch(e){}
  // solicitudes de amistad
  try{if(typeof FR!=="undefined"&&FR.inc)FR.inc.forEach(r=>{const n=pvClean(r.fn);L.push({k:"f"+r.from,ic:"🤝",t:esc(n)+" quiere ser tu amigo",s:"Si aceptas, podréis chatear, enviaros regalos e intercambiar en directo.",ok:"✅ Aceptar",no:"Rechazar",
    alive:()=>FR.inc.some(q=>q.from===r.from),onOk:async()=>{try{await window.FB.frAccept(r.from,n,pvClean(pvNick()));toast("👥 ¡Ahora eres amigo de "+n+"!")}catch(e){toast("No se ha podido aceptar.")}},
    onNo:async()=>{try{await window.FB.frDecline(r.from)}catch(e){}}})})}catch(e){}
  // solicitudes para entrar en tu gremio (si eres líder o sublíder)
  try{const g=typeof GS!=="undefined"&&GS.doc;if(g&&(g.owner===me||g.sub===me)&&g.req){const full=Object.keys(g.members||{}).length>=GUILD_MAX;
    Object.keys(g.req).forEach(u=>{const n=pvClean(g.req[u].n||"");L.push({k:"g"+GS.gid+u,ic:"🛡️",t:esc(n)+" quiere unirse a tu gremio",s:esc(g.name||"")+(full?" · ⚠️ El gremio está lleno":""),ok:"✅ Aceptar",no:"Rechazar",okOff:full,
      alive:()=>!!(GS.doc&&GS.doc.req&&GS.doc.req[u]),onOk:async()=>{try{await window.FB.gAccept(GS.gid,u,n);gAnnounce(GS.gid,n,pvNick())}catch(e){toast("No se ha podido aceptar.")}},
      onNo:async()=>{try{await window.FB.gReject(GS.gid,u)}catch(e){}}})})}}catch(e){}
  // invitaciones por mensaje privado (duelo, duelo de siluetas, incursión, gremio, sala 2 vs 2)
  try{if(typeof CH!=="undefined")Object.keys(CH.msgs).forEach(key=>{if(key.indexOf("d:")!==0)return;(CH.msgs[key]||[]).forEach(m=>{const v=m.inv;if(!v||m.u===me||!m.id)return;
    if((v.exp||0)<pvT()||(S.invOk&&S.invOk[m.id])||(S.invNo&&S.invNo[m.id])||(typeof chMuted==="function"&&chMuted(m.u)))return;
    const n=pvClean(m.n||""),T={pvp:["⚔️","te reta a un duelo PVP","Con tu equipo actual"],du:["❓","te reta a un Duelo de siluetas","8 rondas de «¿Quién es ese Pokémon?» en directo"],raid:["🔴","te invita a una incursión","Contra "+esc(v.boss||"un Pokémon muy fuerte")+" · hasta 4 entrenadores"],
      guild:["🛡️","te invita a su gremio",esc(v.nm||"")],r2:["👥","te invita a su sala 2 vs 2","Código "+esc(v.code||"")]}[v.k]||["✉️","te ha enviado una invitación",""];
    L.push({k:"m"+m.id,ic:T[0],t:esc(n)+" "+T[1],s:T[2],ok:"✅ Aceptar",no:"Rechazar",alive:()=>(v.exp||0)>pvT()&&!(S.invOk&&S.invOk[m.id])&&!(S.invNo&&S.invNo[m.id]),
      onOk:()=>chInvAccept(m.id),onNo:()=>{S.invNo=S.invNo||{};S.invNo[m.id]=1;save();try{chRender(true)}catch(e){}}})})})}catch(e){}
  return L}
function rqShow(it){RQ.seen[it.k]=1;const M=document.createElement("div");M.className="uidlg rqdlg";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  M.innerHTML='<div class="uidbox rqbox"><div class="rqh"><span class="rqic">'+it.ic+'</span><div><b>'+it.t+'</b>'+(it.s?'<small>'+it.s+'</small>':'')+'</div></div>'+
    '<div class="uidb"><button type="button" class="alt" data-rq="later">Más tarde</button><button type="button" class="alt" data-rq="no">'+it.no+'</button><button type="button" class="red" data-rq="ok"'+(it.okOff?' disabled':'')+'>'+it.ok+'</button></div></div>';
  const close=()=>{M.remove();document.removeEventListener("keydown",kd,true);clearInterval(iv);RQ.cur=null};
  const kd=e=>{if(e.key==="Escape"){e.preventDefault();e.stopPropagation();close()}};
  const iv=setInterval(()=>{let ok=true;try{ok=it.alive()}catch(e){}if(!ok){close();toast(it.ic+" Esa solicitud ya no está disponible.")}},1000);
  M.addEventListener("click",e=>{e.stopPropagation();const b=e.target.closest("[data-rq]");if(!b){if(e.target===M)close();return}const a=b.dataset.rq;close();snd("ui");
    try{if(a==="ok")it.onOk&&it.onOk();else if(a==="no")it.onNo&&it.onNo()}catch(x){}});
  document.addEventListener("keydown",kd,true);
  (document.fullscreenElement&&document.fullscreenElement!==document.documentElement?document.fullscreenElement:document.body).appendChild(M);
  RQ.cur=it;snd("lvl");setTimeout(()=>{const f=M.querySelector('[data-rq="ok"]');if(f&&!f.disabled)f.focus()},40)}
setInterval(()=>{if(RQ.cur||!window.FB||rqBusy())return;let L=[];try{L=rqItems()}catch(e){}const it=L.find(x=>!RQ.seen[x.k]);if(it)rqShow(it)},1500);
