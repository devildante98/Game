// =====================================================================================
// CHAT DENTRO DEL JUEGO: canal global, chat del gremio y mensajes privados con amigos
// Firestore: chats/global/msgs, gchats/{gid}/msgs, dms/{uidA_uidB}/msgs
// =====================================================================================
var CH={open:false,tab:"global",dm:null,msgs:{},unsub:{},seen:{},last:0,emo:false,pick:false,q:""};
const CH_MAX=200,CH_WAIT=2500;
const CH_BAD=["puta","puto","gilipollas","cabron","cabrón","maricon","maricón","zorra","mierda","joder","coño","hijo de puta","hdp","pendejo","subnormal","retrasado","imbecil","imbécil","idiota","polla","follar","nazi","fuck","shit","bitch"];
const chSeenGet=()=>{try{return JSON.parse(localStorage.getItem("chSeen")||"{}")}catch(e){return {}}};
CH.seen=chSeenGet();
function chSeenSet(k,at){CH.seen[k]=Math.max(CH.seen[k]||0,at||0);try{localStorage.setItem("chSeen",JSON.stringify(CH.seen))}catch(e){}}
function chClean(t){t=String(t||"").replace(/[\u0000-\u001f]/g," ").replace(/\s+/g," ").trim().slice(0,CH_MAX);if(O.chf===false)return t;
  CH_BAD.forEach(w=>{const re=new RegExp("(^|[^a-záéíóúñ])("+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")(?=$|[^a-záéíóúñ])","gi");t=t.replace(re,(m,a,b)=>a+"*".repeat(b.length))});return t}
const chMe=()=>window.FB&&window.FB.uid?window.FB.uid():null;
const chMuted=u=>!!(S.chMute&&S.chMute[u]);
const dmKey=u=>{const me=chMe();return [me,u].sort().join("_")};
const chKey=()=>CH.tab==="global"?"global":CH.tab==="guild"?(GS.gid?"g:"+GS.gid:""):CH.dm?"d:"+dmKey(CH.dm):"";
// ---- suscripciones ----
function chSub(k){
  if(!k||CH.unsub[k]||!window.FB||!window.FB.chWatch)return;
  const [t,id]=k==="global"?["global","global"]:k.split(":");
  try{CH.unsub[k]=window.FB.chWatch(t,id,l=>{CH.msgs[k]=l.sort((a,b)=>(a.at||0)-(b.at||0));chOnMsgs(k)})}catch(e){CH.unsub[k]=null}
}
function chUnsub(k){if(CH.unsub[k]){try{CH.unsub[k]()}catch(e){}delete CH.unsub[k];delete CH.msgs[k]}}
let _chSync="";
function chSync(){
  if(!window.FB||!window.FB.chWatch||!chMe())return;
  const want=["global"];if(GS.gid)want.push("g:"+GS.gid);Object.keys(FR.l||{}).slice(0,40).forEach(u=>want.push("d:"+dmKey(u)));
  const key=want.join("|");if(key===_chSync)return;_chSync=key;
  Object.keys(CH.unsub).forEach(k=>{if(!want.includes(k))chUnsub(k)});want.forEach(chSub);
}
setInterval(()=>{try{chSync();chBtn()}catch(e){}},3000);
function chUnread(k){const me=chMe(),s=CH.seen[k]||0;return (CH.msgs[k]||[]).filter(m=>m.u!==me&&(m.at||0)>s&&!chMuted(m.u)).length}
function chUnreadAll(){let n=0;Object.keys(CH.msgs).forEach(k=>{if(k==="global")return;n+=chUnread(k)});return n}
function chOnMsgs(k){
  if(CH.open&&k===chKey()){chRender(true);const l=CH.msgs[k];if(l&&l.length)chSeenSet(k,l[l.length-1].at)}
  else if(CH.open)chTabs();
  chBtn();
}
// ---- botón flotante ----
function chBtn(){
  let b=$("chb");if(!b){b=document.createElement("button");b.id="chb";b.type="button";b.setAttribute("aria-label","Abrir el chat");b.title="Chat";b.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5" stroke-linecap="round"/></svg><i hidden></i>';b.onclick=()=>chToggle();document.body.appendChild(b)}
  const n=chUnreadAll(),g=chUnread("global"),i=b.querySelector("i");
  i.hidden=!(n||g);i.textContent=n?(n>99?"99+":n):"";i.className=n?"":"dot";
}
// ---- ventana ----
function chToggle(v){
  CH.open=v==null?!CH.open:v;let w=$("chw");
  if(!w){w=document.createElement("aside");w.id="chw";w.setAttribute("role","dialog");w.setAttribute("aria-label","Chat");w.hidden=true;
    w.innerHTML='<div class="chh"><b>💬 Chat</b><button class="chx" aria-label="Cerrar el chat">✕</button></div><div class="chtabs" id="chTabs"></div><div class="chsub" id="chSub"></div><div class="chl" id="chL" aria-live="polite"></div>'+
      '<div class="chpk" id="chPk" hidden></div><div class="chemo" id="chEmo" hidden></div>'+
      '<form class="chf" id="chF"><button type="button" class="chib" id="chEB" title="Emojis" aria-label="Emojis">😊</button><button type="button" class="chib" id="chVB" title="Enviar una invitación (gremio o combate)" aria-label="Invitar">✉️</button><button type="button" class="chib" id="chIB" title="Enviar una foto temporal (desaparece en 24 h)" aria-label="Enviar foto">📷</button><input type="file" id="chFile" accept="image/*" hidden><button type="button" class="chib" id="chPB" title="Enseñar un Pokémon" aria-label="Enseñar un Pokémon">'+'<svg viewBox="0 0 100 100" width="20" height="20" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#1c1f3a" stroke-width="8"/><path d="M6 50A44 44 0 0 1 94 50Z" fill="#e3263a" stroke="#1c1f3a" stroke-width="8"/><circle cx="50" cy="50" r="13" fill="#fff" stroke="#1c1f3a" stroke-width="8"/></svg>'+'</button><input id="chI" maxlength="'+CH_MAX+'" placeholder="Escribe un mensaje..." autocomplete="off" aria-label="Mensaje"><button class="red" id="chS" aria-label="Enviar">➤</button></form>';
    document.body.appendChild(w);
    w.addEventListener("click",chClick);
    $("chF").addEventListener("submit",e=>{e.preventDefault();chSend()});
    $("chEB").onclick=()=>{CH.emo=!CH.emo;CH.pick=false;CH.inv=false;chPanels()};
    $("chVB").onclick=()=>{CH.inv=!CH.inv;CH.emo=CH.pick=false;chPanels()};
    $("chIB").onclick=()=>$("chFile").click();$("chFile").onchange=e=>{const f=e.target.files[0];e.target.value="";if(f)chSendImg(f)};
    $("chI").addEventListener("paste",e=>{const f=[...((e.clipboardData||{}).items||[])].find(i=>i.kind==="file"&&/^image\//.test(i.type));if(f){e.preventDefault();chSendImg(f.getAsFile())}});
    $("chPB").onclick=()=>{CH.pick=!CH.pick;CH.emo=false;CH.inv=false;CH.q="";chPanels()};
    w.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();chToggle(false)}});
  }
  w.hidden=!CH.open;document.body.classList.toggle("chon",CH.open);
  if(CH.open){chSync();chTabs();chRender();w.animate([{transform:"translateX(30px)",opacity:0},{transform:"none",opacity:1}],{duration:200,easing:"ease-out"});setTimeout(()=>{const i=$("chI");if(i&&matchMedia("(pointer:fine)").matches)i.focus()},50)}
  chBtn();
}
function chTabs(){
  const t=$("chTabs");if(!t)return;const gu=GS.gid?chUnread("g:"+GS.gid):0,du=Object.keys(FR.l||{}).reduce((a,u)=>a+chUnread("d:"+dmKey(u)),0);
  const b=(k,lab,n)=>'<button class="'+(CH.tab===k?'on':'')+'" data-cht="'+k+'">'+lab+(n?'<i>'+n+'</i>':'')+'</button>';
  t.innerHTML=b("global","🌍 Global",0)+b("guild","🛡️ Gremio",gu)+b("dm","👥 Amigos",du);
}
const chAv=(()=>{const c={};return tr=>{tr=String(tr||"");if(!c[tr]){try{c[tr]=trImg(trDec(tr),"f","i")}catch(e){c[tr]='<span>👤</span>'}}return c[tr]}})();
const chTime=at=>{const d=new Date(at||0),n=new Date();return d.toDateString()===n.toDateString()?d.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}):d.toLocaleDateString("es",{day:"2-digit",month:"2-digit"})+" "+d.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})};
function chRender(keep){
  const L=$("chL"),sub=$("chSub");if(!L)return;const me=chMe();
  $("chF").hidden=false;sub.innerHTML="";
  if(!window.FB||!me){L.innerHTML='<p class="chempty">Inicia sesión con tu cuenta para chatear con otros jugadores.</p>';$("chF").hidden=true;return}
  if(CH.tab==="guild"&&!GS.gid){L.innerHTML='<p class="chempty">Únete a un gremio para hablar con sus miembros. Lo encontrarás en Social → Gremio.</p>';$("chF").hidden=true;return}
  if(CH.tab==="dm"&&!CH.dm){
    const ids=Object.keys(FR.l||{});$("chF").hidden=true;
    L.innerHTML=ids.length?'<div class="chdml">'+ids.map(u=>{const k="d:"+dmKey(u),l=CH.msgs[k]||[],last=l[l.length-1],n=chUnread(k),f=FR.l[u];return '<button class="chdm" data-chdm="'+esc(u)+'"><span class="chav">'+(last&&last.u===u?chAv(last.tr):'👤')+'</span><span class="chdmt"><b>'+esc(pvClean(f.n||"Amigo"))+'</b><small>'+(last?esc((last.u===me?"Tú: ":"")+(last.p?"📸 Pokémon: "+last.p.n:last.t)).slice(0,60):"Sin mensajes todavía")+'</small></span>'+(n?'<i>'+n+'</i>':'')+'</button>'}).join("")+'</div>':'<p class="chempty">Añade amigos en Social → Amigos para poder escribirles en privado.</p>';
    return;
  }
  if(CH.tab==="dm"&&CH.dm){const f=(FR.l||{})[CH.dm];sub.innerHTML='<button class="chback" data-chback="1">← Amigos</button><b>'+esc(pvClean(f?f.n:"Amigo"))+'</b><span class="mut">Conversación privada</span>'}
  else if(CH.tab==="guild"&&GS.doc)sub.innerHTML='<span class="mut">Solo lo ven los miembros de</span> <b>'+esc(GS.doc.name||"tu gremio")+'</b>';
  else if(CH.tab==="global")sub.innerHTML='<span class="mut">Sé amable 😊 · Pulsa un nombre para ver su perfil</span>';
  const k=chKey();chSub(k);const list=(CH.msgs[k]||[]).filter(m=>!chMuted(m.u));
  const atB=L.scrollHeight-L.scrollTop-L.clientHeight<60;
  L.innerHTML=list.length?list.map((m,i)=>{const mine=m.u===me,prev=list[i-1],grp=prev&&prev.u===m.u&&(m.at-prev.at)<120e3;
    const body=(m.inv?chInvHTML(m,mine):'')+(m.img?chImgHTML(m):'')+((m.img||m.inv)&&!m.t?'':(m.p&&PM[m.p.n]?'<div class="chpkm '+PM[m.p.n][2]+(m.p.s?' shiny':'')+'">'+ico(PM[m.p.n],56,false,!!m.p.s)+'<div><b>'+(m.p.s?"✨ ":"")+esc(m.p.k||m.p.n)+'</b><small>'+(m.p.k?esc(m.p.n)+' · ':'')+'Nv'+(m.p.l|0)+' · '+STAR[PM[m.p.n][2]]+'</small></div></div>'+(m.t?'<p>'+esc(m.t)+'</p>':''):'<p>'+esc(m.t||"")+'</p>'));
    return '<div class="chm'+(mine?' me':'')+(grp?' grp':'')+'">'+(mine||grp?'':'<span class="chav" data-prof="'+esc(m.u)+'">'+chAv(m.tr)+'</span>')+'<div class="chbub">'+(grp||mine?'':'<div class="chn"><b class="plink" data-prof="'+esc(m.u)+'">'+(m.cr>=1&&m.cr<=3?'<span class="chcr" title="'+["Campeón","Subcampeón","Podio"][m.cr-1]+' del torneo semanal">'+["👑","🥈","🥉"][m.cr-1]+'</span> ':'')+esc(pvClean(m.n||"Entrenador"))+'</b>'+(m.g?' <span class="gtag">'+esc(String(m.g).slice(0,4))+'</span>':'')+'</div>')+body+'<small class="cht">'+chTime(m.at)+(mine?' <button class="chdel" data-chdel="'+esc(m.id)+'" title="Borrar mensaje" aria-label="Borrar mensaje">🗑️</button>':' <button class="chmute" data-chmute="'+esc(m.u)+'" data-chmn="'+esc(pvClean(m.n||""))+'" title="Silenciar a este jugador" aria-label="Silenciar">🔇</button> <button class="chmute" data-chrep="'+esc(m.id)+'" title="Reportar este mensaje" aria-label="Reportar">🚩</button>'+((typeof MOD!=="undefined"&&MOD.admin)?' <button class="chmute" data-chadel="'+esc(m.id)+'" title="Borrar (moderación)">🗑️</button>':''))+'</small></div></div>'}).join(""):'<p class="chempty">'+(CH.msgs[k]?'Todavía no hay mensajes. ¡Saluda! 👋':'Cargando mensajes…')+'</p>';
  if(!keep||atB)L.scrollTop=L.scrollHeight;
  if(list.length)chSeenSet(k,list[list.length-1].at);chBtn();chTabs();
}
function chPanels(){
  const e=$("chEmo"),p=$("chPk");chInvPanel();
  e.hidden=!CH.emo;p.hidden=!CH.pick;
  if(CH.emo&&!e.innerHTML)e.innerHTML=["👋","😀","😂","🥹","😍","😎","🤔","😮","😭","😡","👍","👏","🙏","🔥","✨","💯","🎉","❤️","⚔️","🛡️","🏆","🥚","🎁","🎟️","⚡","💧","🍃","👻","🐉","❄️"].map(x=>'<button type="button" data-che="'+x+'">'+x+'</button>').join("");
  if(CH.pick){const q=nrm(CH.q||""),L=P.filter(x=>S.owned[x[0]]>0&&(!q||nrm(x[0]).includes(q)||nrm(nk(x[0])).includes(q))).sort((a,b)=>((S.team.includes(b[0])?1:0)-(S.team.includes(a[0])?1:0))||"CREML".indexOf(b[2])-"CREML".indexOf(a[2])||lvd(b[0]).l-lvd(a[0]).l).slice(0,40);
    p.innerHTML='<input id="chPq" placeholder="¿Qué Pokémon quieres enseñar?" value="'+esc(CH.q||"")+'" aria-label="Buscar Pokémon"><div class="chpkg">'+(L.length?L.map(x=>{const sh=S.shiny&&S.shiny[x[0]]>0;return '<button type="button" class="'+x[2]+'" data-chp="'+esc(x[0])+'" title="'+esc(nk(x[0]))+'">'+ico(x,40,false,sh)+'<small>'+esc(nk(x[0]))+'</small></button>'}).join(""):'<small class="mut">No tienes ese Pokémon.</small>')+'</div>';
    const i=$("chPq");i.oninput=()=>{CH.q=i.value;const pos=i.selectionStart;chPanels();const j=$("chPq");j.focus();try{j.setSelectionRange(pos,pos)}catch(x){}}}
}
async function chSend(pk){
  const i=$("chI"),t=chClean(i.value);if(!t&&!pk)return;const me=chMe();if(!me||!window.FB||!window.FB.chSend)return;
  const k=chKey();if(!k)return;const now=Date.now();
  if(now-CH.last<CH_WAIT){chFlash("Espera un momento antes de enviar otro mensaje.");return}
  CH.last=now;
  const d={u:me,n:pvClean(pvNick()).slice(0,30),cr:typeof myCrown==="function"?myCrown():0,tr:trEnc(myLook()),g:GS.doc&&GS.doc.tag?String(GS.doc.tag).slice(0,4):"",t:pk?"":t,at:now};
  if(pk){const sh=S.shiny&&S.shiny[pk]>0;d.p={n:pk,l:lvd(pk).l,s:sh?1:0,k:S.mote&&S.mote[pk]?String(S.mote[pk]).slice(0,12):""}}
  const [tp,id]=k==="global"?["global","global"]:k.split(":");
  if(!pk)i.value="";
  try{await window.FB.chSend(tp,id,d);snd("click")}catch(e){chFlash("No se ha podido enviar el mensaje.");if(!pk)i.value=t}
}
function chFlash(t){const s=$("chSub");if(!s)return;const o=s.innerHTML;s.innerHTML='<span class="chwarn">'+esc(t)+'</span>';setTimeout(()=>{if($("chSub"))chRender(true)},2200)}
function chClick(e){
  const b=e.target.closest("button,[data-prof]");if(!b)return;const d=b.dataset;
  if(b.classList.contains("chx")){chToggle(false);return}
  if(d.cht){CH.tab=d.cht;CH.dm=null;CH.emo=CH.pick=false;chPanels();chTabs();chRender();return}
  if(d.chdm){CH.dm=d.chdm;chRender();return}
  if(d.chback){CH.dm=null;chRender();return}
  if(d.che){const i=$("chI");i.value=(i.value+d.che).slice(0,CH_MAX);i.focus();return}
  if(d.chp){CH.pick=false;chPanels();chSend(d.chp);return}
  if(d.chdel){const k=chKey(),[tp,id]=k==="global"?["global","global"]:k.split(":");window.FB.chDel(tp,id,d.chdel).catch(()=>chFlash("No se ha podido borrar."));return}
  if(d.chmute){S.chMute=S.chMute||{};S.chMute[d.chmute]=d.chmn||1;save();chRender(true);toast("🔇 Has silenciado a "+(d.chmn||"ese jugador")+". Puedes quitarlo en ⚙️ Ajustes → Cuenta.");return}
}
// silenciados: se gestionan desde los ajustes (Cuenta)
function chMuteUI(){
  const host=document.querySelector('#optp .setpane[data-st="acct"]');if(!host)return;
  let box=$("chMuteBox");if(!box){box=document.createElement("div");box.id="chMuteBox";box.className="slid";host.appendChild(box)}
  const L=Object.keys(S.chMute||{});
  box.innerHTML='<span>💬 Chat</span><div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="chFil"'+(O.chf===false?'':' checked')+'> Ocultar palabrotas</label>'+(L.length?L.map(u=>'<span style="display:flex;gap:6px;align-items:center"><small>🔇 '+esc(String(S.chMute[u]===1?"Jugador":S.chMute[u]))+'</small><button class="alt mini" data-chun="'+esc(u)+'">Quitar</button></span>').join(""):'<small class="mut">No has silenciado a nadie</small>')+'</div>';
  $("chFil").onchange=e=>{O.chf=e.target.checked;try{saveO()}catch(x){}};
  box.onclick=e=>{const b=e.target.closest("[data-chun]");if(b){delete S.chMute[b.dataset.chun];save();chMuteUI();if(CH.open)chRender(true)}};
}
setInterval(()=>{const o=$("optp");if(o&&!o.hidden&&!$("chMuteBox"))chMuteUI()},800);
{const o=$("optp");if(o)new MutationObserver(()=>{if(!o.hidden)chMuteUI()}).observe(o,{attributes:true,attributeFilter:["hidden"]})}
// escribir sin que las teclas del juego (por ejemplo la U de los tickets) se disparen
document.addEventListener("keydown",e=>{if(e.target&&e.target.closest&&e.target.closest("#chw")&&e.key!=="Escape")e.stopPropagation()},true);
document.addEventListener("keyup",e=>{if(e.target&&e.target.closest&&e.target.closest("#chw"))e.stopPropagation()},true);
chBtn();
// ================= pestaña «Chat» dentro de Social =================
function chOpenAt(tab,dm){hubClose();CH.tab=tab||"global";CH.dm=dm||null;CH.emo=CH.pick=false;if(CH.open){chPanels();chTabs();chRender()}else chToggle(true);snd("ui")}
nxPanel("chatP","💬 Chat","Habla con todos los jugadores, con tu gremio o en privado con tus amigos. El chat se abre en un panel lateral, así que puedes seguir jugando mientras hablas.");
{const g=HUB.find(x=>x.k==="soc");if(g&&!g.tabs.some(t=>t[0]==="chatP")){g.tabs.splice(1,0,["chatP","Chat"]);g.d="Amigos, chat, intercambios y gremio"}HUBP.chatP="soc";HUBR.chatP=()=>chHubUI()}
function chLast(k){const l=CH.msgs[k]||[],m=[...l].reverse().find(x=>!chMuted(x.u));return m?esc(pvClean(m.n||""))+": "+esc(m.inv?"✉️ Invitación":m.img?"📷 Foto temporal":m.p?"📸 "+m.p.n:m.t||"").slice(0,70):""}
function chHubUI(){
  const box=$("chatPB");if(!box)return;const on=!!(window.FB&&chMe());if(on)chSync();
  const card=(ic,t,d,k,btn,attr,n,last)=>'<div class="chcard"><span class="chci">'+ic+'</span><div><b>'+t+(n?' <i class="chcn">'+n+'</i>':'')+'</b><small class="mut">'+d+'</small>'+(last?'<small class="chcl">'+last+'</small>':'')+'</div><button class="red" '+attr+'>'+btn+'</button></div>';
  if(!on){box.innerHTML='<p class="mut">Inicia sesión con tu cuenta para chatear con otros jugadores.</p>';return}
  const ids=Object.keys(FR.l||{}),du=ids.reduce((a,u)=>a+chUnread("d:"+dmKey(u)),0);
  let h='<div class="chcards">'+card("🌍","Chat global","Todos los jugadores conectados","global","Abrir",'data-cho="global"',0,chLast("global"))+
    card("🛡️","Chat del gremio",GS.gid?"Solo para los miembros de "+esc((GS.doc&&GS.doc.name)||"tu gremio"):"Únete a un gremio para usarlo","guild","Abrir",'data-cho="guild"'+(GS.gid?'':' disabled'),GS.gid?chUnread("g:"+GS.gid):0,GS.gid?chLast("g:"+GS.gid):"")+
    card("👥","Mensajes privados",ids.length?ids.length+" amigo"+(ids.length===1?"":"s"):"Añade amigos para escribirles","dm","Abrir",'data-cho="dm"',du,"")+'</div>';
  if(ids.length)h+='<h3 class="shh">Escribir a un amigo</h3><div class="chdml">'+ids.map(u=>{const k="d:"+dmKey(u),n=chUnread(k),f=FR.l[u];return '<button class="chdm" data-chodm="'+esc(u)+'"><span class="chav">👤</span><span class="chdmt"><b>'+esc(pvClean(f.n||"Amigo"))+'</b><small>'+(chLast(k)||"Sin mensajes todavía")+'</small></span>'+(n?'<i>'+n+'</i>':'')+'<span>💬</span></button>'}).join("")+'</div>';
  box.innerHTML=h;
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-cho],[data-chodm],[data-frmsg]");if(!b)return;
  if(b.dataset.cho)chOpenAt(b.dataset.cho);else chOpenAt("dm",b.dataset.chodm||b.dataset.frmsg)});
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{const n=chUnreadAll();if(n)o.soc=(o.soc|0)+n}catch(e){}return o}}
setInterval(()=>{try{if(nxOpen("chatP"))chHubUI()}catch(e){}},3000);

// ================= FOTOS TEMPORALES EN EL CHAT (desaparecen a las 24 horas) =================
const CH_IMG_TTL=24*36e5;
function chImgHTML(m){const left=(m.exp||0)-Date.now();
  if(left<=0||!/^data:image\/(jpeg|png|webp);base64,/.test(m.img))return '<div class="chimg gone">📷 <span>Foto caducada</span></div>';
  const h=Math.floor(left/36e5),mi=Math.max(1,Math.floor(left%36e5/6e4));
  return '<div class="chimg"><a href="#" data-chimg="'+esc(m.id)+'"><img src="'+m.img+'" alt="Foto" onload="chImgLd(this)"></a><small>⏳ Desaparece en '+(h?h+' h ':'')+(h<3?mi+' min':'')+'</small></div>'}
async function chSendImg(file){
  const me=chMe();if(!me||!window.FB||!window.FB.chSend){chFlash("Inicia sesión para enviar fotos.");return}const k=chKey();if(!k)return;
  if(Date.now()-CH.last<CH_WAIT){chFlash("Espera un momento antes de enviar otra foto.");return}
  let img="";try{img=await sugComp(file)}catch(e){chFlash("No se ha podido leer esa imagen.");return}
  if(img.length>240000){chFlash("La foto es demasiado grande.");return}
  CH.last=Date.now();const i=$("chI"),t=chClean(i.value);i.value="";
  const d={u:me,n:pvClean(pvNick()).slice(0,30),cr:typeof myCrown==="function"?myCrown():0,tr:trEnc(myLook()),g:GS.doc&&GS.doc.tag?String(GS.doc.tag).slice(0,4):"",t:t,img:img,exp:Date.now()+CH_IMG_TTL,at:Date.now()};
  const [tp,id]=k==="global"?["global","global"]:k.split(":");
  try{await window.FB.chSend(tp,id,d);snd("click")}catch(e){chFlash("No se ha podido enviar la foto.");i.value=t}
}
document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("[data-chimg]");if(!a)return;e.preventDefault();const u=a.querySelector("img").src;nxModal('<img class="sugbig" src="'+u+'" alt="Foto"><small class="mut">Foto temporal · desaparece a las 24 horas de enviarse</small><button id="chiOk">Cerrar</button>');$("chiOk").onclick=nxModalClose});
// limpieza: cada jugador borra de Firebase sus propias fotos caducadas
setInterval(()=>{try{const me=chMe();if(!me||!window.FB||!window.FB.chDel)return;Object.keys(CH.msgs).forEach(k=>{(CH.msgs[k]||[]).forEach(m=>{if(m.u===me&&m.img&&(m.exp||0)<Date.now()&&!m._del){m._del=1;const [tp,id]=k==="global"?["global","global"]:k.split(":");window.FB.chDel(tp,id,m.id).catch(()=>{})}})})}catch(e){}},60e3);
setInterval(()=>{try{if(CH.open&&document.querySelector("#chL .chimg"))chRender(true)}catch(e){}},60e3);
function chImgLd(im){const L=$("chL");if(L&&L.scrollHeight-L.scrollTop-L.clientHeight<im.clientHeight+120)L.scrollTop=L.scrollHeight}

// ================= INVITACIONES POR EL CHAT: gremio, duelo PVP 1 vs 1 y sala 2 vs 2 =================
const INV_TTL={guild:24*36e5,pvp:10*6e4,r2:15*6e4,raid:10*6e4,du:10*6e4};
function chInvPanel(){
  let p=$("chInv");if(!p){p=document.createElement("div");p.id="chInv";p.className="chemo chinvp";p.hidden=true;$("chF").before(p);
    p.addEventListener("click",e=>{const b=e.target.closest("[data-civ]");if(b){CH.inv=false;chPanels();chSendInv(b.dataset.civ)}})}
  p.hidden=!CH.inv;if(!CH.inv)return;
  const g=GS.gid&&GS.doc,r2=typeof R2!=="undefined"&&R2&&R2.ph==="lobby";
  p.innerHTML='<b>✉️ Enviar una invitación</b>'+
    '<button type="button" data-civ="guild"'+(g?'':' disabled')+'>🛡️ Invitar a mi gremio'+(g?' <small>'+esc(GS.doc.name||"")+'</small>':' <small>(no tienes gremio)</small>')+'</button>'+
    '<button type="button" data-civ="pvp"'+(pvTeamData().length?'':' disabled')+'>⚔️ Retar a un duelo PVP 1 vs 1 <small>(10 min para aceptar)</small></button>'+
    '<button type="button" data-civ="du">❓ Duelo de siluetas 1 vs 1 <small>(¿Quién es ese Pokémon?)</small></button>'+
    '<button type="button" data-civ="raid"'+(typeof RD!=="undefined"&&RD.id&&RD.phase==="lobby"?'':' disabled')+'>🔴 Invitar a mi incursión'+(typeof RD!=="undefined"&&RD.id&&RD.phase==="lobby"&&RD.d?' <small>'+esc(RD.d.boss||"")+'</small>':' <small>(crea o únete antes a una sala en Incursiones)</small>')+'</button>'+
    '<button type="button" data-civ="r2"'+(r2?'':' disabled')+'>👥 Invitar a mi sala 2 vs 2'+(r2?' <small>código '+esc(R2.code)+'</small>':' <small>(crea antes una sala en PVP)</small>')+'</button>';
}
async function chSendInv(k){
  const me=chMe();if(!me||!window.FB||!window.FB.chSend)return;const key=chKey();if(!key)return;
  if(Date.now()-CH.last<CH_WAIT){chFlash("Espera un momento antes de enviar otra invitación.");return}
  let inv=null,t="";
  if(k==="guild"){if(!GS.gid||!GS.doc)return;inv={k:"guild",gid:GS.gid,nm:String(GS.doc.name||"").slice(0,40),tag:String(GS.doc.tag||"").slice(0,4),open:GS.doc.open?1:0,n:Object.keys(GS.doc.members||{}).length}}
  else if(k==="pvp"){if(!pvTeamData().length){chFlash("Necesitas un equipo para retar.");return}inv={k:"pvp"};CH.pvInvAt=Date.now()}
  else if(k==="du"){inv={k:"du"};CH.duInvAt=Date.now()}
  else if(k==="raid"){if(!(typeof RD!=="undefined"&&RD.id&&RD.phase==="lobby"&&RD.d))return;inv={k:"raid",id:String(RD.id),boss:String(RD.d.boss||"")}}
  else if(k==="r2"){if(!(typeof R2!=="undefined"&&R2&&R2.ph==="lobby"))return;inv={k:"r2",code:String(R2.code)}}
  if(!inv)return;inv.exp=Date.now()+INV_TTL[k];CH.last=Date.now();
  const d={u:me,n:pvClean(pvNick()).slice(0,30),cr:typeof myCrown==="function"?myCrown():0,tr:trEnc(myLook()),g:GS.doc&&GS.doc.tag?String(GS.doc.tag).slice(0,4):"",t:"",inv:inv,at:Date.now()};
  const [tp,id]=key==="global"?["global","global"]:key.split(":");
  try{await window.FB.chSend(tp,id,d);snd("pop");if(k==="pvp"||k==="du")toast((k==="du"?"❓":"⚔️")+" Reto enviado. Cuando alguien lo acepte, el duelo empezará solo (mantén el juego abierto).")}catch(e){chFlash("No se ha podido enviar la invitación.")}
}
function chInvHTML(m,mine){
  const v=m.inv||{},left=(v.exp||0)-Date.now(),no=S.invNo&&S.invNo[m.id],ok=S.invOk&&S.invOk[m.id];
  const ic=v.k==="guild"?"🛡️":v.k==="pvp"?"⚔️":v.k==="du"?"❓":v.k==="raid"?"🔴":"👥",tit=v.k==="du"?'Reto a un <b>Duelo de siluetas</b>':v.k==="raid"?'Invitación a una <b>incursión</b> contra <b>'+esc(v.boss||"")+'</b>':v.k==="guild"?'Invitación al gremio <b>'+esc(v.nm||"")+'</b>'+(v.tag?' <span class="gtag">'+esc(v.tag)+'</span>':''):v.k==="pvp"?'Reto a un <b>duelo PVP 1 vs 1</b>':'Invitación a una <b>sala 2 vs 2</b>';
  const sub=v.k==="du"?'8 rondas de «¿Quién es ese Pokémon?» en directo':v.k==="raid"?'Hasta 4 entrenadores · 3 minutos':v.k==="guild"?((v.n|0)+'/'+GUILD_MAX+' miembros · '+(v.open?'abierto':'con solicitud')):v.k==="r2"?'Código '+esc(v.code||""):'Con tu equipo actual';
  let st="";
  if(mine)st='<small class="chinvst">Tu invitación'+(left>0?' · caduca en '+(left>=36e5?Math.ceil(left/36e5)+' h':Math.max(1,Math.ceil(left/6e4))+' min'):' · caducada')+'</small>';
  else if(left<=0)st='<small class="chinvst">⌛ Invitación caducada</small>';
  else if(no)st='<small class="chinvst">❌ La has rechazado</small>';
  else if(ok)st='<small class="chinvst">✅ Aceptada</small>';
  else st='<div class="chinvb"><button class="red mini" data-cia="'+esc(m.id)+'">Aceptar</button><button class="alt mini" data-cin="'+esc(m.id)+'">Rechazar</button></div>';
  return '<div class="chinv chinv-'+esc(v.k||"")+'"><span class="chinvi">'+ic+'</span><div><div>'+tit+'</div><small>'+sub+'</small>'+st+'</div></div>';
}
function chFindMsg(id){for(const k in CH.msgs){const m=(CH.msgs[k]||[]).find(x=>x.id===id);if(m)return m}return null}
async function chInvAccept(id){
  const m=chFindMsg(id);if(!m||!m.inv)return;const v=m.inv;if((v.exp||0)<Date.now()){chRender(true);return}
  const mark=()=>{S.invOk=S.invOk||{};S.invOk[id]=1;save();chRender(true)};
  if(v.k==="guild"){
    if(S.gid){toast("Ya perteneces a un gremio. Sal de él antes de unirte a otro.");return}
    const g=await new Promise(res=>{let u=null;const tm=setTimeout(()=>{try{u&&u()}catch(e){}res(undefined)},6000);u=window.FB.gWatch(v.gid,d=>{clearTimeout(tm);setTimeout(()=>{try{u&&u()}catch(e){}},0);res(d)})});
    if(!g){toast("Ese gremio ya no existe.");return}if(Object.keys(g.members||{}).length>=GUILD_MAX){toast("Ese gremio está lleno.");return}
    const nick=pvClean(pvNick());
    try{if(g.open){await window.FB.gJoin(v.gid,nick);S.gid=v.gid;save();gWatch(v.gid);toast("🛡️ ¡Te has unido a "+g.name+"!");snd("lvl")}
      else{await window.FB.gRequest(v.gid,nick);S.greq=v.gid;save();gReqWatch(v.gid);toast("📨 Solicitud enviada a "+g.name+". El líder o el sublíder la aprobará.")}
      mark();try{gRefresh()}catch(e){}}catch(e){toast("No se ha podido completar ("+((e&&e.code)||"error")+").")}
  }else if(v.k==="pvp"){
    if(m.u===chMe())return;if(fcd||PV.st!=="idle"){toast("Termina lo que estás haciendo antes de aceptar el duelo.");return}
    if(!pvTeamData().length){toast("Necesitas un equipo para combatir.");return}
    if(!pvOthers().some(p=>p.peer===m.u)){toast("⚫ "+pvClean(m.n||"Ese jugador")+" no está conectado ahora mismo.");return}
    if(pvChallenge(m.u)){mark();toast("⚔️ ¡Aceptado! Conectando con "+pvClean(m.n||"")+"…");chToggle(false);try{hubOpen("onl","pvpP")}catch(e){}}
  }else if(v.k==="du"){
    if(m.u===chMe())return;if(fcd||DU.cur){toast("Termina lo que estás haciendo antes de aceptar el duelo.");return}
    mark();chToggle(false);duChallenge(m.u,pvClean(m.n||""));
  }else if(v.k==="raid"){
    if(fcd||(typeof RD!=="undefined"&&RD.id)){toast("Ya estás en un combate o en otra incursión.");return}
    mark();chToggle(false);rdJoin(String(v.id));
  }else if(v.k==="r2"){
    if(fcd||PV.st!=="idle"||(typeof R2!=="undefined"&&R2)){toast("Ya estás en un combate o en otra sala.");return}
    try{await r2Open(String(v.code),false);mark();chToggle(false);try{hubOpen("onl","pvpP")}catch(e){}}catch(e){toast("No se ha podido entrar en la sala.")}
  }
}
document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("[data-cia],[data-cin]");if(!a)return;
  if(a.dataset.cia)chInvAccept(a.dataset.cia);else{S.invNo=S.invNo||{};S.invNo[a.dataset.cin]=1;save();chRender(true)}});
// quien envió un reto por el chat acepta solo el primer reto que le llegue en los 10 minutos siguientes
setInterval(()=>{try{if(!CH.pvInvAt||Date.now()-CH.pvInvAt>INV_TTL.pvp){CH.pvInvAt=0;return}if(fcd||PV.st!=="idle")return;const inc=pvIncoming().ch;if(inc.length){const p=inc[0];CH.pvInvAt=0;toast("⚔️ ¡"+pvClean(p.presence.pvp.n)+" ha aceptado tu reto!");pvAccept(p.peer);chToggle(false)}}catch(e){}},1000);

// quien envió un Duelo de siluetas por el chat acepta solo el primero que le llegue en 10 minutos
{const _da=duAsk;duAsk=function(d){if(CH.duInvAt&&Date.now()-CH.duInvAt<INV_TTL.du&&!DU.cur&&!fcd){CH.duInvAt=0;toast("❓ ¡"+pvClean(d.an||"Alguien")+" ha aceptado tu reto de siluetas!");chToggle(false);duAccept(d);return}return _da.apply(this,arguments)}}
