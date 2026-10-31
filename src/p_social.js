// ================= amigos =================
// Las solicitudes viajan por Firestore (colecciones friends y freq). Solo con cuenta iniciada.
let FR={l:{},inc:[],out:[],ready:false},_frk="";
const isFriend=u=>!!(FR.l&&FR.l[u]);
// apodo actual de un amigo: el de su presencia en línea, el de su perfil público o, si no, el guardado al hacerse amigos
const FRN={};let _frnAt=0;
function frName(u){const o=pvOthers().find(p=>p.peer===u);if(o&&o.presence&&o.presence.pvp&&o.presence.pvp.n){FRN[u]=pvClean(o.presence.pvp.n);return FRN[u]}return FRN[u]||pvClean((FR.l[u]&&FR.l[u].n)||"")||"Amigo"}
async function frNamesRefresh(force){if(!window.FB||!window.FB.rankGet||(!force&&(document.hidden||Date.now()-_frnAt<30*60000)))return;_frnAt=Date.now();let ch=false;
  for(const u of Object.keys(FR.l||{})){try{const d=await window.FB.rankGet(u);if(d&&d.n){const n=pvClean(d.n);if(n&&FRN[u]!==n){FRN[u]=n;ch=true}
    if(n&&FR.l[u]&&FR.l[u].n!==n&&window.FB.frRename)window.FB.frRename(u,n).catch(()=>{})}}catch(e){}}
  if(ch){_frk="";try{frUI()}catch(e){}try{if(typeof chRender==="function")chRender()}catch(e){}}}
setInterval(()=>frNamesRefresh(false),60000);
const frOnline=()=>pvOthers().filter(p=>isFriend(p.peer)).map(p=>({uid:p.peer,n:pvClean(p.presence.pvp.n),st:p.presence.pvp.st}));
function frMsg(t){const e=$("frMsg");if(e)e.textContent=t}
async function frSend(nick){
  if(!window.FB){frMsg("Para tener amigos tienes que iniciar sesión con tu cuenta.");return}
  nick=pvClean(nick);if(!nick){frMsg("Escribe el apodo de tu amigo.");return}
  if(nick.toLowerCase()===pvClean(pvNick()).toLowerCase()){frMsg("No puedes enviarte una solicitud a ti mismo 😅");return}
  if(Object.keys(FR.l).length>=100){frMsg("Has llegado al máximo de 100 amigos.");return}
  frMsg("Enviando solicitud…");
  try{const r=await window.FB.frSend(nick,pvClean(pvNick()));frMsg(r==="accepted"?"✅ ¡Ahora sois amigos!":r==="already"?"Ya sois amigos.":"📨 Solicitud enviada a «"+nick+"».");if($("frNick"))$("frNick").value=""}
  catch(e){frMsg(e&&e.code==="nf"?"❌ No existe ningún jugador con el apodo «"+nick+"».":e&&e.code==="self"?"No puedes enviarte una solicitud a ti mismo.":"No se pudo enviar ("+((e&&e.code)||"error")+").")}
}
function frUI(){
  const box=$("frBox");if(!box)return;
  if(!window.FB){box.innerHTML='<small class="mut">Inicia sesión con tu cuenta para añadir amigos, ver cuándo están conectados e invitarlos a combatir.</small>';return}
  const on={};pvOthers().forEach(p=>{on[p.peer]=p.presence.pvp});
  const key=JSON.stringify([typeof GF!=="undefined"?GF.inc.map(g=>g.id):0,S.gfs,FR,Object.keys(on).map(k=>k+on[k].st+on[k].n),PV.st,!!R2,R2&&R2.ph,fcd,PV.inv]);if(key===_frk)return;_frk=key;
  const ids=Object.keys(FR.l).sort((a,b)=>(on[b]?1:0)-(on[a]?1:0)||String(FR.l[a].n).localeCompare(FR.l[b].n));
  let h="";
  if(FR.inc.length)h+='<div class="lgnow"><b>📩 Solicitudes recibidas</b>'+FR.inc.map(r=>'<div class="pvrow"><b>'+esc(pvClean(r.fn))+'</b><span style="flex:1"></span><button data-fra="'+esc(r.from)+'" data-frn="'+esc(pvClean(r.fn))+'">✅ Aceptar</button><button class="alt" data-frd="'+esc(r.from)+'">Rechazar</button></div>').join("")+'</div>';
  {const gi=typeof GF!=="undefined"?GF.inc:[];if(gi.length)h+='<div class="lgnow gfin"><b>🎁 Regalos recibidos ('+gi.length+')</b><small class="mut">Tus amigos te han enviado un detalle. Puedes abrir hasta 20 al día.</small><div class="gfl">'+gi.slice(0,30).map(g=>'<button class="gfb" data-gfo="'+esc(g.id)+'"><span>🎁</span><b>'+esc(pvClean(g.fn||"Amigo"))+'</b><small>Abrir</small></button>').join("")+'</div></div>'}
  if(ids.length&&window.FB&&window.FB.gfSend){const left=ids.filter(u=>!gfSentToday(u)).length;h+='<div class="gfsend"><small class="mut">🎁 Envía un regalo a cada amigo una vez al día: tickets, Poké Balls u objetos.</small>'+(left?'<button data-gfall="1">🎁 Enviar a todos ('+left+')</button>':'<small>✅ Hoy ya has enviado regalos a todos</small>')+'</div>'}
  if(FR.out.length)h+='<small class="mut">Solicitudes enviadas: '+FR.out.map(r=>esc(pvClean(r.tn))+' <button class="alt mini" data-frc="'+esc(r.to)+'" title="Cancelar">✕</button>').join(" · ")+'</small>';
  h+=ids.length?'<div class="frl">'+ids.map(u=>{const f=FR.l[u],o=on[u],n=o?pvClean(o.n):frName(u);
    const st=o?(o.st==="duel"?"🟠 En un duelo":o.st==="room"?"🟠 En una sala 2vs2":o.st==="wait"?"🟠 Retando":"🟢 Conectado"):"⚫ Desconectado";
    const canDuel=o&&o.st==="idle"&&PV.st==="idle"&&!fcd&&!R2&&pvTeamData().length,canInv=o&&R2&&R2.ph==="lobby";
    return '<div class="pvrow">'+(o?'<span class="pvav">'+trImg(trDec(o.tr),"f","i")+'</span>':'<span class="pvav off">👤</span>')+'<b class="plink" data-prof="'+esc(u)+'">'+esc(n)+' '+gdBadge(o&&o.gd)+'</b><small class="mut" style="flex:1">'+st+'</small>'+
      (canInv?'<button data-frinv="'+esc(u)+'">'+(PV.inv&&PV.inv.to.includes(u)?'✅ Invitado':'📨 Invitar a la sala')+'</button>':'')+
      '<button data-frch="'+esc(u)+'"'+(canDuel?'':' disabled')+' title="Retar a un duelo 1 vs 1">⚔️ Retar</button>'+
      '<button data-fr2="'+esc(u)+'"'+(o&&!R2&&!fcd&&PV.st==="idle"?'':' disabled')+' title="Crear una sala 2 vs 2 e invitarle">👥 2vs2</button>'+
      (window.FB&&window.FB.gfSend?'<button class="'+(gfSentToday(u)?'alt':'')+'" data-gfs="'+esc(u)+'"'+(gfSentToday(u)?' disabled title="Ya le has enviado un regalo hoy"':' title="Enviar un regalo"')+'>'+(gfSentToday(u)?'✅':'🎁')+'</button>':'')+
      (window.FB&&window.FB.chSend?'<button class="alt" data-frmsg="'+esc(u)+'" title="Enviar un mensaje privado">💬</button>':'')+
      '<button class="alt" data-frt="'+esc(u)+'" data-frtn="'+esc(n)+'" title="Proponer un intercambio">🔄</button><button class="alt" data-frx="'+esc(u)+'" title="Eliminar de amigos">🗑️</button></div>'}).join("")+'</div>':'<small class="mut">Todavía no tienes amigos. Escribe el apodo de otro jugador para enviarle una solicitud, o pulsa «+👥» junto a un jugador en el PVP.</small>';
  box.innerHTML=h;$("frCnt").textContent=ids.length+" amigo"+(ids.length===1?"":"s")+" · "+ids.filter(u=>on[u]).length+" conectados";
  const n=FR.inc.length;if($("navfr"))$("navfr").hidden=!n,$("navfr").textContent=n;
}
let _frAsk="";
document.addEventListener("click",async e=>{
  const b=e.target.closest&&e.target.closest("#frP button,#frBox button");if(!b||!window.FB)return;
  const d=b.dataset;
  try{
    if(b.id==="frGo")return frSend($("frNick").value);
    if(d.fra){await window.FB.frAccept(d.fra,d.frn,pvClean(pvNick()));toast("👥 ¡Ahora eres amigo de "+d.frn+"!");return}
    if(d.frd){await window.FB.frDecline(d.frd);return}
    if(d.frc){await window.FB.frCancel(d.frc);return}
    if(d.frx){if(_frAsk!==d.frx){_frAsk=d.frx;b.textContent="¿Seguro?";setTimeout(()=>{_frAsk="";_frk="";frUI()},3000);return}_frAsk="";await window.FB.frRemove(d.frx,pvClean(pvNick()));return}
    if(d.frch){if(pvChallenge(d.frch)){toast("⚔️ Reto enviado");try{$("pvpP").scrollIntoView({behavior:"smooth"})}catch(x){}}return}
    if(d.frinv){r2InviteFriend(d.frinv);return}
    if(d.fr2){await r2Open(r2NewCode(),true);if(R2)r2InviteFriend(d.fr2);return}
  }catch(x){frMsg("No se pudo completar ("+((x&&x.code)||"error")+").")}
});
// aviso en el chat del gremio cuando entra alguien (lo envía quien entra o quien acepta la solicitud)
async function gAnnounce(gid,who,by){try{if(!gid||!window.FB||!window.FB.chSend)return;const me=window.FB.uid(),now=Date.now();
  const d={u:me,n:pvClean(pvNick()).slice(0,30),tr:trEnc(myLook()),g:GS.doc&&GS.doc.tag?String(GS.doc.tag).slice(0,4):"",t:"🛡️ ¡"+pvClean(who||"Un entrenador").slice(0,30)+" se ha unido al gremio!"+(by?" (aceptado por "+pvClean(by).slice(0,30)+")":""),sys:"join",at:now};
  await window.FB.chSend("g",gid,d)}catch(e){}}
function frState(st){FR=Object.assign({ready:true},st);_frk="";frUI();pvRender();frNamesRefresh(Object.keys(FR.l||{}).some(u=>!FRN[u]))}
// ================= gremios =================
const GUILD_COST=50000000,GUILD_EDIT=500000,GUILD_MAX=30;
const GPAL=["#e63950","#f57c20","#f5c400","#2fa36b","#0fa97d","#3f86f0","#233f94","#8a3fd0","#e86aa8","#f4f2ff","#9aa7b8","#2b2b34","#7a4a26","#c9a227","#5fd0e6","#a8d84a"];
const GICO=["🛡️","⚔️","🐉","🔥","💧","⚡","🍃","❄️","🌙","☀️","⭐","👑","💎","🦅","🐺","🦊","🐲","🌸","🍀","💀","🎯","🏔️","🌊","🌪️"];
const GSHP=["Rectangular","Cola de golondrina","Estandarte","Escudo"],GPAT=["Liso","Franja horizontal","Franja vertical","Diagonal","Cruz","Aspa","Cuartelado","Chevrón","Borde","Dos franjas"];
let GS={doc:null,gid:null,list:[],unsub:null},GE={name:"",tag:"",icon:0,s:0,p:1,c1:5,c2:9,c3:2,desc:"",open:1},_gk="";
const myGuildBadge=()=>GS.doc?{t:GS.doc.tag,i:GS.doc.icon}:null;
function gFlag(f,icon,w){
  f=f||{};const id="gf"+Math.floor(Math.random()*1e9),c1=GPAL[f.c1]||GPAL[5],c2=GPAL[f.c2]||GPAL[9],c3=GPAL[f.c3]||GPAL[2];
  const SH=["M0 0H60V40H0Z","M0 0H60L48 20L60 40H0Z","M8 0H52V36L30 46L8 36Z","M6 0H54V20Q54 38 30 46Q6 38 6 20Z"][f.s|0]||"M0 0H60V40H0Z";
  const PT=["","M0 14H60V27H0Z","M22 0H38V46H22Z","M0 46L0 34L50 0H60V8L10 46Z","M24 0H36V46H24ZM0 16H60V28H0Z","M0 0L8 0L60 38V46L52 46L0 8ZM60 0V8L8 46H0V38L52 0Z","M0 0H30V22H0ZM30 22H60V46H30Z","M0 0L30 22L60 0V14L30 36L0 14Z","M0 0H60V46H0ZM6 5V41H54V5Z","M0 4H60V12H0ZM0 30H60V38H0Z"][f.p|0]||"";
  return '<svg class="gflag" viewBox="-2 -2 64 50" width="'+(w||60)+'" height="'+Math.round((w||60)*50/64)+'" aria-hidden="true"><defs><clipPath id="'+id+'"><path d="'+SH+'"/></clipPath></defs><g clip-path="url(#'+id+')"><rect x="-2" y="-2" width="64" height="50" fill="'+c1+'"/>'+(PT?'<path d="'+PT+'" fill="'+c2+'" fill-rule="evenodd"/>':'')+'<circle cx="30" cy="21" r="11" fill="'+c3+'" stroke="#fff" stroke-width="1.5"/><text x="30" y="26.5" text-anchor="middle" font-size="14">'+esc(GICO[icon|0]||icon||"🛡️")+'</text></g><path d="'+SH+'" fill="none" stroke="#1c1f3a" stroke-width="2"/></svg>';
}
function gMsg(t){const e=$("gdMsg");if(e)e.textContent=t}
const gTagOk=t=>/^[A-Z0-9]{2,4}$/.test(t);
function gEditor(edit){
  const sw=(k)=>GPAL.map((c,i)=>'<button class="'+(GE[k]===i?"on":"")+'" style="background:'+c+'" data-ge="'+k+'" data-v="'+i+'" aria-label="Color '+(i+1)+'"></button>').join("");
  return '<div class="gedit"><div class="gprev">'+gFlag(GE,GE.icon,150)+'<b>'+esc(GE.name||"Nombre del gremio")+' <span class="gtag">['+esc(GE.tag||"TAG")+']</span></b><small class="mut">'+esc(GE.desc||"")+'</small></div><div class="gopts">'+
    (edit?'':'<label>Nombre <input id="geName" maxlength="20" value="'+esc(GE.name)+'" placeholder="3-20 caracteres"></label>')+
    '<label>Siglas <input id="geTag" maxlength="4" value="'+esc(GE.tag)+'" placeholder="2-4 letras o números" style="text-transform:uppercase"></label>'+
    '<label>Lema / descripción <input id="geDesc" maxlength="120" value="'+esc(GE.desc)+'" placeholder="Opcional"></label>'+
    '<div><small>Icono</small><div class="gico">'+GICO.map((c,i)=>'<button class="'+(GE.icon===i?"on":"")+'" data-ge="icon" data-v="'+i+'">'+c+'</button>').join("")+'</div></div>'+
    '<div class="sets-row"><label>Forma <select id="geS">'+GSHP.map((n,i)=>'<option value="'+i+'"'+(GE.s===i?" selected":"")+'>'+n+'</option>').join("")+'</select></label><label>Dibujo <select id="geP">'+GPAT.map((n,i)=>'<option value="'+i+'"'+(GE.p===i?" selected":"")+'>'+n+'</option>').join("")+'</select></label></div>'+
    '<div><small>Color de fondo</small><div class="trsw">'+sw("c1")+'</div></div><div><small>Color del dibujo</small><div class="trsw">'+sw("c2")+'</div></div><div><small>Color del emblema</small><div class="trsw">'+sw("c3")+'</div></div>'+
    '<label><input type="checkbox" id="geOpen"'+(GE.open?" checked":"")+'> Abierto: cualquiera puede unirse sin pedir permiso</label>'+
    '<div class="sets-row">'+(edit?'<button class="red" id="geSave"'+(S.t<GUILD_EDIT?" disabled":"")+'>💾 Guardar cambios ('+fmt(GUILD_EDIT)+' 🎟️)</button><button class="alt" id="geCancel">Cancelar</button>':'<button class="red" id="geCreate"'+(S.t<GUILD_COST?" disabled":"")+'>🛡️ Fundar gremio ('+fmt(GUILD_COST)+' 🎟️)</button>')+'</div></div></div>';
}
function gUI(force){
  const box=$("gdBox");if(!box)return;
  if(!window.FB){box.innerHTML='<small class="mut">Inicia sesión con tu cuenta para crear un gremio o unirte a uno.</small>';return}
  const on={};pvOthers().forEach(p=>{on[p.peer]=1});
  const key=JSON.stringify([GS.doc,GS.list.length,GS.list.map(g=>g.id+g.n).join(),GS.editing,GS.creating,S.t>=GUILD_COST,S.t>=GUILD_EDIT,Object.keys(on)]);
  if(key===_gk&&!force){return}_gk=key;
  const ae=document.activeElement,aid=ae&&ae.id,caret=ae&&ae.selectionStart;
  let h="";const me=window.FB.uid(),g=GS.doc;
  if(g){
    const lead=g.owner===me,sub=g.sub&&g.members&&g.members[g.sub]?g.sub:"",isSub=!!sub&&sub===me,mem=Object.keys(g.members||{}).sort((a,b)=>(g.owner===b)-(g.owner===a)||(sub===b)-(sub===a)||(on[b]?1:0)-(on[a]?1:0));
    h+='<div class="ghead">'+gFlag(g.fl,g.icon,110)+'<div><b class="gname">'+esc(g.name)+' <span class="gtag">['+esc(g.tag)+']</span></b><small class="mut">'+esc(g.desc||"")+'</small><small>'+mem.length+' / '+GUILD_MAX+' miembros · '+(g.open?"Abierto":"Con solicitud")+'</small><small>👑 Líder: <b>'+esc(pvClean((g.members[g.owner]||{}).n||"?"))+'</b>'+(sub?' · ⭐ Sublíder: <b>'+esc(pvClean(g.members[sub].n))+'</b>':'')+'</small>'+(lead?'':isSub?'<small class="mut">Eres el sublíder: puedes aceptar o rechazar solicitudes para unirse.</small>':'')+'</div></div>';
    h+=gBossHTML(g);
    if(GS.editing)h+=gEditor(true);
    h+='<div class="frl">'+mem.map(u=>{const m=g.members[u];return '<div class="pvrow"><b class="plink" data-prof="'+esc(u)+'">'+(g.owner===u?"👑 ":sub===u?"⭐ ":"")+esc(pvClean(m.n))+(sub===u?' <small class="gtag">Sublíder</small>':'')+(u===me?" (tú)":"")+'</b><small class="mut" style="flex:1">'+(on[u]||u===me?"🟢 Conectado":"⚫ Desconectado")+'</small>'+(lead&&u!==me?'<button class="alt" data-gk="'+esc(u)+'">Expulsar</button>'+(sub===u?'<button class="alt" data-gunsub="1">Quitar sublíder</button>':'<button class="alt" data-gsub="'+esc(u)+'">⭐ Hacer sublíder</button>')+'<button class="alt" data-gt="'+esc(u)+'">👑 Hacer líder</button>':'')+(u!==me&&!isFriend(u)?'<button class="alt" data-gfr="'+esc(pvClean(m.n))+'">+👥</button>':'')+'</div>'}).join("")+'</div>';
    const rq=Object.keys(g.req||{});
    if((lead||isSub)&&rq.length)h+='<div class="lgnow"><b>📩 Solicitudes para unirse</b>'+rq.map(u=>'<div class="pvrow"><b>'+esc(pvClean(g.req[u].n))+'</b><span style="flex:1"></span><button data-gacc="'+esc(u)+'"'+(mem.length>=GUILD_MAX?" disabled":"")+'>Aceptar</button><button class="alt" data-grej="'+esc(u)+'">Rechazar</button></div>').join("")+'</div>';
    h+='<div class="sets-row" style="margin-top:10px">'+(lead?'<button id="gdEdit" class="alt">🎨 Personalizar</button><button id="gdDis" class="alt">💥 Disolver gremio</button>':'<button id="gdLeave" class="alt">🚪 Salir del gremio</button>')+'</div>';
  }else{
    h+='<div class="lgbtn"><button id="gdNew"'+(GS.creating?' class="alt"':' class="red"')+'>'+(GS.creating?"Cerrar":"🛡️ Fundar un gremio")+'</button><button class="alt" id="gdRef">🔄 Actualizar lista</button></div>';
    if(GS.creating)h+='<p class="rates">Fundar un gremio cuesta <b>'+fmt(GUILD_COST)+' 🎟️</b>. El nombre es único y no se puede cambiar después.</p>'+gEditor(false);
    h+=GS.list.length?'<div class="frl">'+GS.list.map(x=>'<div class="pvrow">'+gFlag(x.fl,x.icon,48)+'<b>'+esc(x.name)+' <span class="gtag">['+esc(x.tag)+']</span></b><small class="mut" style="flex:1">'+(x.n|0)+'/'+GUILD_MAX+' · '+(x.open?"Abierto":"Con solicitud")+(x.desc?" · "+esc(x.desc):"")+'</small>'+((x.req||{})[me]?'<small>⏳ Solicitud enviada</small>':'<button data-gj="'+esc(x.id)+'"'+((x.n|0)>=GUILD_MAX?" disabled":"")+'>'+(x.open?"Unirse":"Pedir unirse")+'</button>')+'</div>').join("")+'</div>':'<small class="mut">No hay gremios todavía (o pulsa «Actualizar lista»). ¡Funda el primero!</small>';
  }
  h+='<small id="gdMsg" class="mut"></small>';
  box.innerHTML=h;
  if(aid&&$(aid)){try{$(aid).focus();if(caret!=null)$(aid).setSelectionRange(caret,caret)}catch(e){}}
}
async function gRefresh(){if(!window.FB)return;try{GS.list=await window.FB.gList()}catch(e){gMsg("No se pudo cargar la lista ("+((e&&e.code)||"error")+").")}
  const me=window.FB.uid();if(!S.gid){const g=GS.list.find(x=>x.members&&x.members[me]);if(g){S.gid=g.id;delete S.greq;save();gWatch(g.id)}}
  gUI(true)}
// busca en la nube a qué gremio perteneces (por si entraste aceptado por el líder o desde otro dispositivo)
async function gFindMine(){if(!window.FB||!window.FB.gMine||S.gid)return;try{const id=await window.FB.gMine();if(id&&!S.gid){S.gid=id;delete S.greq;save();gWatch(id);toast("🛡️ Formas parte del gremio.")}}catch(e){}}
// mientras tu solicitud esta pendiente, se vigila el gremio para entrar en cuanto el líder te acepte
let _grqU=null;
function gReqWatch(gid){
  if(_grqU){try{_grqU()}catch(e){}_grqU=null}if(!gid||!window.FB||S.gid)return;
  _grqU=window.FB.gWatch(gid,d=>{const me=window.FB.uid();
    if(d&&d.members&&d.members[me]){if(_grqU){try{_grqU()}catch(e){}_grqU=null}S.gid=gid;delete S.greq;save();gWatch(gid);snd("lvl");toast("🛡️ ¡Te han aceptado en el gremio "+d.name+"!");return}
    if(!d||!(d.req||{})[me]){if(_grqU){try{_grqU()}catch(e){}_grqU=null}if(S.greq===gid){delete S.greq;save();toast("Tu solicitud al gremio no ha sido aceptada.");gRefresh()}}});
}
function gWatch(gid){
  if(GS.unsub){try{GS.unsub()}catch(e){}GS.unsub=null}
  GS.gid=gid;GS.doc=null;
  if(!gid||!window.FB){gUI(true);return}
  GS.unsub=window.FB.gWatch(gid,d=>{try{const me=window.FB.uid(),cur=pvClean(pvNick());if(d&&d.members&&d.members[me]&&cur&&d.members[me].n!==cur&&window.FB.gRename)window.FB.gRename(gid,cur).catch(()=>{})}catch(e){}
    const me=window.FB.uid();
    if(!d||!d.members||!d.members[me]){if(GS.doc||S.gid){toast(d?"Ya no formas parte del gremio.":"El gremio ha sido disuelto.")}GS.doc=null;S.gid=null;save();if(GS.unsub){try{GS.unsub()}catch(e){}GS.unsub=null}gUI(true);pvPub();return}
    GS.doc=d;if(S.gid!==gid){S.gid=gid;save()}gUI(true);pvPub();
  });
}
function geRead(){const v=id=>$(id)?$(id).value:"";if($("geName"))GE.name=v("geName").replace(/\s+/g," ").slice(0,20);GE.tag=v("geTag").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,4);GE.desc=v("geDesc").slice(0,120);if($("geS"))GE.s=+v("geS");if($("geP"))GE.p=+v("geP");if($("geOpen"))GE.open=$("geOpen").checked?1:0}
document.addEventListener("input",e=>{if(e.target&&/^ge/.test(e.target.id)){geRead();const p=document.querySelector(".gprev");if(p)p.innerHTML=gFlag(GE,GE.icon,150)+'<b>'+esc(GE.name||"Nombre del gremio")+' <span class="gtag">['+esc(GE.tag||"TAG")+']</span></b><small class="mut">'+esc(GE.desc||"")+'</small>'}});
document.addEventListener("change",e=>{if(e.target&&/^ge(S|P|Open)$/.test(e.target.id)){geRead();gUI(true)}});
document.addEventListener("click",async e=>{
  const b=e.target.closest&&e.target.closest("#gdBox button");if(!b||!window.FB)return;const d=b.dataset,me=window.FB.uid(),nick=pvClean(pvNick());
  try{
    if(d.ge){GE[d.ge]=+d.v;geRead();gUI(true);return}
    if(b.id==="gdNew"){GS.creating=!GS.creating;gUI(true);return}
    if(b.id==="gdRef"){gMsg("Cargando…");await gRefresh();return}
    if(b.id==="geCreate"){
      geRead();const nm=GE.name.trim();
      if(nm.length<3){gMsg("El nombre debe tener al menos 3 caracteres.");return}
      if(!gTagOk(GE.tag)){gMsg("Las siglas deben tener de 2 a 4 letras o números.");return}
      if(S.t<GUILD_COST){gMsg("Necesitas "+fmt(GUILD_COST)+" 🎟️ para fundar un gremio.");return}
      if(S.gid){gMsg("Ya perteneces a un gremio.");return}
      b.disabled=true;gMsg("Fundando el gremio…");
      const gid=await window.FB.gCreate({name:nm,tag:GE.tag,icon:GE.icon,fl:{s:GE.s,p:GE.p,c1:GE.c1,c2:GE.c2,c3:GE.c3},desc:GE.desc.trim(),open:GE.open?true:false},nick);
      S.t-=GUILD_COST;S.gid=gid;qEv("guild");save();if(window.cloudFlush)window.cloudFlush(true);GS.creating=false;gWatch(gid);toast("🛡️ ¡Has fundado el gremio "+nm+"!");snd("lvl");return;
    }
    if(d.gj){
      if(S.gid){gMsg("Ya perteneces a un gremio. Sal de él antes de unirte a otro.");return}
      const g=GS.list.find(x=>x.id===d.gj);if(!g)return;
      if(g.open){await window.FB.gJoin(d.gj,nick);S.gid=d.gj;save();gWatch(d.gj);toast("🛡️ ¡Te has unido a "+g.name+"!");gAnnounce(d.gj,nick)}
      else{await window.FB.gRequest(d.gj,nick);gMsg("📨 Solicitud enviada. El líder del gremio tiene que aceptarla.");S.greq=d.gj;save();gReqWatch(d.gj);await gRefresh()}
      return;
    }
    if(b.id==="gdLeave"){if(!confirm("¿Seguro que quieres salir del gremio?"))return;await window.FB.gLeave(GS.gid,!!GS.doc&&GS.doc.sub===window.FB.uid());S.gid=null;save();gWatch(null);gRefresh();return}
    if(b.id==="gdDis"){if(!confirm("¿Seguro que quieres DISOLVER el gremio? Todos los miembros lo perderán y no se devuelven los tickets."))return;await window.FB.gDisband(GS.gid);S.gid=null;save();gWatch(null);gRefresh();return}
    if(b.id==="gdEdit"){const g=GS.doc;GE=Object.assign({},GE,{name:g.name,tag:g.tag,icon:g.icon|0,s:(g.fl||{}).s|0,p:(g.fl||{}).p|0,c1:(g.fl||{}).c1|0,c2:(g.fl||{}).c2|0,c3:(g.fl||{}).c3|0,desc:g.desc||"",open:g.open?1:0});GS.editing=!GS.editing;gUI(true);return}
    if(b.id==="geCancel"){GS.editing=false;gUI(true);return}
    if(b.id==="geSave"){geRead();if(!gTagOk(GE.tag)){gMsg("Las siglas deben tener de 2 a 4 letras o números.");return}if(S.t<GUILD_EDIT)return;await window.FB.gEdit(GS.gid,{tag:GE.tag,icon:GE.icon,fl:{s:GE.s,p:GE.p,c1:GE.c1,c2:GE.c2,c3:GE.c3},desc:GE.desc.trim(),open:!!GE.open});S.t-=GUILD_EDIT;save();GS.editing=false;toast("🎨 Gremio actualizado");return}
    if(d.gacc){const r=GS.doc.req[d.gacc];await window.FB.gAccept(GS.gid,d.gacc,r?r.n:"");gAnnounce(GS.gid,r?r.n:"",pvNick());return}
    if(d.grej){await window.FB.gReject(GS.gid,d.grej);return}
    if(d.gk){if(!confirm("¿Expulsar a este miembro del gremio?"))return;await window.FB.gKick(GS.gid,d.gk,GS.doc.sub===d.gk);return}
    if(d.gt){if(!confirm("¿Nombrar líder a este miembro? Tú pasarás a ser un miembro normal."))return;await window.FB.gTransfer(GS.gid,d.gt,GS.doc.sub===d.gt);return}
    if(d.gsub){if(!confirm("¿Nombrar sublíder a este miembro? Podrá aceptar y rechazar solicitudes para unirse, pero nada más."+(GS.doc.sub?" El sublíder actual dejará de serlo.":"")))return;await window.FB.gSetSub(GS.gid,d.gsub);toast("⭐ Nuevo sublíder nombrado.");return}
    if(d.gunsub){await window.FB.gSetSub(GS.gid,"");toast("Has quitado el cargo de sublíder.");return}
    if(d.gfr){frSend(d.gfr);return}
  }catch(x){gMsg(x&&x.code==="exists"?"❌ Ya existe un gremio con ese nombre. Elige otro.":"No se pudo completar ("+((x&&x.code)||"error")+").");gUI(true)}
});
// ================= apoyar el juego =================
// Pon aqui tus enlaces de donacion (por ejemplo Ko-fi o PayPal). Si un enlace esta vacio, su boton no aparece.
const SUPPORT=[{n:"Ko-fi",i:"☕",u:"https://ko-fi.com/devildante98"},{n:"PayPal",i:"💳",u:"https://paypal.me/devildante98"},{n:"Patreon",i:"🎁",u:""}];
function supUI(){
  const box=$("supBox");if(!box)return;const L=SUPPORT.filter(s=>/^https:\/\//.test(s.u));
  box.innerHTML=L.length?L.map(s=>'<a class="supb" href="'+esc(s.u)+'" target="_blank" rel="noopener noreferrer">'+s.i+' Donar con '+esc(s.n)+'</a>').join(""):'<small class="mut">Los enlaces de donación se activarán muy pronto. ¡Gracias por tu interés!</small>';
}
