// ================= menú principal (opción A): el botón flotante abre una cuadrícula y cada menú se abre en una ventana =================
const HUB=[
  {k:"dex",n:"Pokédex",ic:"📚",c:"#2f6fd8",d:"Tu colección",tabs:[["collP","Pokédex"]]},
  {k:"bag",n:"Mochila",ic:"🎒",c:"#d06a00",d:"Objetos, tienda y Centro Pokémon",tabs:[["bagU","Mochila"],["bagP","Tienda de objetos"],["healP","Centro Pokémon"]]},
  {k:"adv",n:"Aventura",ic:"🗺️",c:"#0e7f63",d:"Gimnasios y Liga Pokémon",tabs:[["gymP","Gimnasios"],["lgP","Liga Pokémon"]]},
  {k:"onl",n:"Online",ic:"🌐",c:"#7a4ae0",d:"PVP, temporada y clasificación",tabs:[["pvpP","PVP"],["rkP","Clasificación"]]},
  {k:"soc",n:"Social",ic:"👥",c:"#c42a5e",d:"Amigos, intercambios y gremio",tabs:[["frP","Amigos"],["gdP","Gremio"]]},
  {k:"prg",n:"Progreso",ic:"🏅",c:"#a87800",d:"Misiones, logros y prestigio",tabs:[["qP","Misiones"],["achP","Logros"],["prsP","Prestigio"]]},
  {k:"trn",n:"Tu entrenador",ic:"🧑",c:"#13a37f",d:"Personalización y logros conseguidos",tabs:[["trP","Tu entrenador"],["trAchP","Logros conseguidos"]]},
  {k:"mas",n:"Más",ic:"⚙️",c:"#4a5070",d:"Novedades, sugerencias y apoyo",tabs:[["newsP","Novedades"],["sugP","Sugerencias"],["supP","Apoyar"]],act:[["⚙️ Ajustes y música","opt"],["❓ Cómo se juega","welc"]]}
];
const HUBP={};HUB.forEach(g=>g.tabs.forEach(t=>{HUBP[t[0]]=g.k}));
const HB={g:null,t:null,last:{}};
const hubG=k=>HUB.find(g=>g.k===k);
function hubStore(){let s=$("hubStore");if(!s){s=document.createElement("div");s.id="hubStore";s.hidden=true;document.body.appendChild(s)}return s}
function hubPark(id){const p=$(id);if(!p)return;if(id==="pvpP"&&p.dataset.duel)return;hubStore().appendChild(p)}
// refresco del contenido al abrir cada pestaña (por si cambió mientras estaba guardado)
const HUBR={collP:()=>render(),bagU:()=>{bagUI()},bagP:()=>{bagUI()},healP:()=>{healUI()},gymP:()=>{_gyk="";gymUI()},lgP:()=>{leagueUI()},rkP:()=>{rkLoad()},frP:()=>{frUI()},gdP:()=>{gUI(true)},qP:()=>{qUI()},achP:()=>render(),prsP:()=>{prsUI()},trP:()=>{trUI()},trAchP:()=>{trAchUI()},newsP:()=>{newsUI()},supP:()=>{supUI()},pvpP:()=>{seasonUI()}};
function hubOpen(k,tab){
  const g=hubG(k);if(!g)return;hubMenu(false);
  if(g.k==="onl"&&$("pvpP")&&$("pvpP").dataset.duel){try{Element.prototype._siv.call($("pvpP"),{behavior:"smooth",block:"start"})}catch(e){}return}
  tab=tab||HB.last[k]||g.tabs[0][0];
  if(HB.t&&HB.t!==tab)hubPark(HB.t);
  HB.g=k;HB.t=tab;HB.last[k]=tab;
  const M=$("hubM");M.style.setProperty("--hc",g.c);
  $("hubI").textContent=g.ic;$("hubT").textContent=g.n;$("hubD").textContent=g.d;
  $("hubTabs").innerHTML=(g.tabs.length>1?g.tabs.map(t=>'<button class="'+(t[0]===tab?"on":"")+'" data-ht="'+t[0]+'">'+t[1]+'</button>').join(""):"")+(g.act||[]).map(a=>'<button class="hact" data-ha="'+a[1]+'">'+a[0]+'</button>').join("");
  $("hubTabs").hidden=!(g.tabs.length>1||g.act);
  const p=$(tab),b=$("hubB");if(p&&p.parentNode!==b){b.innerHTML="";b.appendChild(p)}b.scrollTop=0;
  const wasHidden=M.hidden;M.hidden=false;document.body.classList.add("hubon");
  if(wasHidden){M.classList.remove("in");void M.offsetWidth;M.classList.add("in")}
  try{(HUBR[tab]||(()=>{}))()}catch(e){}
  snd("ui");
}
function hubClose(){
  const M=$("hubM");if(!M||M.hidden)return;
  if(HB.t)hubPark(HB.t);HB.t=null;HB.g=null;M.hidden=true;document.body.classList.remove("hubon");
}
// ---- cuadrícula del botón flotante ----
function hubBadges(){
  const o={};
  try{const dm=dmEnsure();o.prg=dm.l.filter(m=>!m.c&&m.p>=MISM[m.id][2]).length+ACHS().filter(achReady).length}catch(e){}
  try{o.bag=evoReadyList().length}catch(e){}
  try{o.soc=(FR.inc||[]).length}catch(e){}
  try{const i=gymNext(),n=(S.team||[]).find(x=>x&&S.owned[x]);if(i>=0&&n&&lvd(n).l>=lvCap())o.adv="!"}catch(e){}
  return o;
}
let _hubAnim=0;
const hubCalm=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches||!O.fx||!!O.calm}catch(e){return false}};
function hubBallC(){const r=$("navb").getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function hubSparks(c){
  const cols=["#ffffff","#fff59a","#ffd35c","#ff8a8a","#9ad7ff"];
  const fl=document.createElement("div");fl.className="hubburst";fl.style.left=c.x+"px";fl.style.top=c.y+"px";document.body.appendChild(fl);
  fl.animate([{transform:"translate(-50%,-50%) scale(.1)",opacity:1},{transform:"translate(-50%,-50%) scale(1)",opacity:.9,offset:.35},{transform:"translate(-50%,-50%) scale(1.6)",opacity:0}],{duration:480,easing:"ease-out"}).onfinish=()=>fl.remove();
  const rg=document.createElement("div");rg.className="hubring";rg.style.left=c.x+"px";rg.style.top=c.y+"px";document.body.appendChild(rg);
  rg.animate([{transform:"translate(-50%,-50%) scale(.2)",opacity:1},{transform:"translate(-50%,-50%) scale(3.2)",opacity:0}],{duration:540,easing:"cubic-bezier(.2,.8,.3,1)"}).onfinish=()=>rg.remove();
  for(let i=0;i<16;i++){const sp=document.createElement("span");sp.className="hubspark";sp.textContent=i%3?"✦":"★";sp.style.left=c.x+"px";sp.style.top=c.y+"px";sp.style.color=cols[i%cols.length];sp.style.fontSize=(10+Math.random()*14)+"px";document.body.appendChild(sp);
    const a=-Math.PI*(.15+Math.random()*.85)-(Math.random()<.25?Math.PI*.1:0),d=90+Math.random()*260,dx=Math.cos(a)*d,dy=Math.sin(a)*d;
    sp.animate([{transform:"translate(-50%,-50%) scale(.3) rotate(0deg)",opacity:1},{transform:"translate(calc(-50% + "+dx+"px),calc(-50% + "+dy+"px)) scale(1) rotate("+(Math.random()*360)+"deg)",opacity:0}],{duration:520+Math.random()*320,easing:"cubic-bezier(.1,.7,.3,1)",delay:Math.random()*80}).onfinish=()=>sp.remove()}
}
function hubMenu(show){
  const m=$("hubG");if(!m)return;if(show==null)show=m.hidden||m.classList.contains("out");
  const nb=$("navb"),lab=nb.querySelector(".nblab"),tok=++_hubAnim;
  if(show){const bd=hubBadges();
    $("hubGl").innerHTML=HUB.map(g=>'<button class="hubtile" data-hg="'+g.k+'" style="--hc:'+g.c+'">'+(bd[g.k]?'<i>'+bd[g.k]+'</i>':'')+'<span class="hti">'+g.ic+'</span><b>'+g.n+'</b><small>'+g.d+'</small></button>').join("")+
      '<div class="hubq">'+[["🎯","Entrenar","farm"],["🎰","Tiradas","stage"],["⚔️","Combate","batP"],["🎟️","Tickets gratis","earnP"]].map(q=>'<button data-hq="'+q[2]+'">'+q[0]+' '+q[1]+'</button>').join("")+'</div>';
    m.classList.remove("out");m.hidden=false;nb.classList.add("open");document.body.classList.add("menuon");$("navp").hidden=true;$("optp").hidden=true;if(lab)lab.textContent="CERRAR";
    m.getAnimations().forEach(a=>a.cancel());m.classList.remove("blur");
    if(hubCalm()){m.classList.add("blur");return}
    setTimeout(()=>{if(tok===_hubAnim&&!m.hidden&&!m.classList.contains("out"))m.classList.add("blur")},780);
    snd("open");const c=hubBallC();hubSparks(c);
    
    const tiles=[...m.querySelectorAll(".hubtile")].map(t=>{const r=t.getBoundingClientRect();return{t:t,dx:c.x-(r.left+r.width/2),dy:c.y-(r.top+r.height/2)}}).sort((a,b)=>Math.hypot(a.dx,a.dy)-Math.hypot(b.dx,b.dy));
    tiles.forEach((o,i)=>{const dl=50+i*36;o.t.style.willChange="transform,opacity";
      o.t.animate([{transform:"translate("+o.dx+"px,"+o.dy+"px) scale(.12) rotate(-30deg)",opacity:0},{opacity:1,offset:.25},{transform:"translate(0,0) scale(1.1) rotate(4deg)",offset:.7},{transform:"translate(0,0) scale(.97) rotate(-1deg)",offset:.85},{transform:"none",opacity:1}],{duration:470,delay:dl,easing:"cubic-bezier(.2,.8,.25,1)",fill:"backwards"}).onfinish=()=>{o.t.style.willChange=""};
      const ic=o.t.querySelector(".hti");if(ic)ic.animate([{transform:"scale(.3) rotate(-200deg)"},{transform:"scale(1.25) rotate(10deg)",offset:.7},{transform:"none"}],{duration:520,delay:dl+50,easing:"ease-out",fill:"backwards"});
      const bg=o.t.querySelector("i");if(bg)bg.animate([{transform:"scale(0)"},{transform:"scale(1.4)",offset:.6},{transform:"scale(1)"}],{duration:340,delay:dl+380,fill:"backwards"});
    });
    m.querySelectorAll(".hubq button").forEach((b,i)=>b.animate([{transform:"translateY(16px)",opacity:0},{transform:"none",opacity:1}],{duration:260,delay:330+i*40,easing:"ease-out",fill:"backwards"}));
  }else{
    nb.classList.remove("open");if(lab)lab.textContent="MENÚ";
    if(m.hidden)return;
    if(hubCalm()){m.hidden=true;document.body.classList.remove("menuon");return}
    m.classList.add("out");m.classList.remove("blur");const c=hubBallC();
    const tiles=[...m.querySelectorAll(".hubtile")].map(t=>{const r=t.getBoundingClientRect();return{t:t,dx:c.x-(r.left+r.width/2),dy:c.y-(r.top+r.height/2)}}).sort((a,b)=>Math.hypot(b.dx,b.dy)-Math.hypot(a.dx,a.dy));
    tiles.forEach((o,i)=>o.t.animate([{transform:"none",opacity:1},{transform:"translate("+o.dx+"px,"+o.dy+"px) scale(.1) rotate(25deg)",opacity:0}],{duration:240,delay:i*22,easing:"cubic-bezier(.5,0,.8,.4)",fill:"forwards"}));
    m.querySelectorAll(".hubq button").forEach(b=>b.animate([{opacity:1},{opacity:0}],{duration:120,fill:"forwards"}));
    m.animate([{opacity:1},{opacity:0}],{duration:200,delay:220,fill:"forwards"});
    setTimeout(()=>{if(tok!==_hubAnim)return;m.hidden=true;m.classList.remove("out");document.body.classList.remove("menuon");m.getAnimations({subtree:true}).forEach(a=>a.cancel())},430);
  }
}
// ---- las demas partes del juego que "van a" un panel abren su ventana ----
Element.prototype._siv=Element.prototype.scrollIntoView;
Element.prototype.scrollIntoView=function(o){
  try{const pan=this.closest&&this.closest("section.panel,aside.panel");
    if(pan&&HUBP[pan.id]&&!(pan.id==="pvpP"&&pan.dataset.duel)){if(!this.closest("#hubM"))hubOpen(HUBP[pan.id],pan.id);return}
    if(pan&&!this.closest("#hubM")&&!$("hubM").hidden)hubClose();
  }catch(e){}
  return this._siv(o);
};
// ---- durante un duelo PVP el panel vuelve a la página para jugarlo en grande ----
function hubDuelWatch(){
  const d=$("pvDuel");if(!d)return;
  new MutationObserver(()=>{const p=$("pvpP"),on=!!d.querySelector("#arena");
    if(on&&!p.dataset.duel){p.dataset.duel="1";hubClose();hubMenu(false);$("batP").after(p);setTimeout(()=>{try{p._siv({behavior:"smooth",block:"start"})}catch(e){}},50)}
    else if(!on&&p.dataset.duel){delete p.dataset.duel;if(HB.t!=="pvpP")hubPark("pvpP")}}).observe(d,{childList:true});
  const r=$("r2Room");
}
// ---- barra superior: avatar, medallas y racha ----
let _hudk="";
function hudUI(){
  const h=$("hud");if(!h)return;let st=0;try{st=strkNow()}catch(e){}
  const k=trEnc(myLook())+"|"+medCount()+"|"+st;if(k===_hudk)return;_hudk=k;
  h.innerHTML='<button class="hudav" data-hg="trn" title="Tu entrenador">'+trImg(myLook(),"f","i")+'</button><button class="hudc" data-hg="adv" title="Gimnasios">🏅 '+medCount()+' / 8</button><button class="hudc" id="hudStk" title="Pase diario">🔥 '+st+'</button>';
}
// ---- vitrina de logros conseguidos (en la ventana de tu entrenador) ----
function trAchUI(){
  const box=$("trAchB");if(!box)return;
  const A=ACHS(),got=A.filter(a=>achLv(a)>0),tot=A.reduce((t,a)=>t+a[5].length,0),lv=A.reduce((t,a)=>t+achLv(a),0),full=got.filter(a=>achLv(a)>=a[5].length).length;
  const card=a=>{const k=achLv(a),n=a[5].length,done=k>=n,g=a[5][k-1][0];
    return '<div class="tacard'+(done?' done':'')+'"><div class="taic">'+a[1]+'</div><div class="tainf"><b>'+a[2]+'</b><small>'+esc(a[3].replace("{g}",fmt(g)))+'</small><div class="tapip">'+a[5].map((x,i)=>'<i class="'+(i<k?"on":"")+'"></i>').join("")+'<span>'+(done?"¡Completado!":"Nivel "+k+" / "+n)+'</span></div></div></div>'};
  box.innerHTML='<div class="tasum"><div><b>'+lv+'</b><small>niveles de logro</small></div><div><b>'+got.length+'</b><small>logros empezados</small></div><div><b>'+full+'</b><small>completados</small></div><div><b>'+Math.round(lv/Math.max(1,tot)*100)+'%</b><small>del total'+(PRS()?' (prestigio '+PRS()+')':'')+'</small></div></div>'+
    (got.length?'<div class="tagrid">'+got.sort((a,b)=>(achLv(b)>=b[5].length)-(achLv(a)>=a[5].length)||achLv(b)/b[5].length-achLv(a)/a[5].length).map(card).join("")+'</div>':'<p class="rates">Todavía no has conseguido ningún logro. Mira cuáles hay en 🏅 Progreso › Logros y reclámalos cuando los completes.</p>')+
    '<p class="rates" style="margin-top:12px">Aquí aparecen los logros que ya has reclamado. Al subir de prestigio empiezan unos logros nuevos.</p>';
}
function hubInit(){
  if($("hubM"))return;
  if(!$("trAchP")){const s=document.createElement("section");s.className="panel";s.id="trAchP";s.setAttribute("aria-label","Logros conseguidos");s.innerHTML='<h2>🏆 Logros conseguidos</h2><div id="trAchB"></div>';document.body.appendChild(s)}
  const M=document.createElement("div");M.id="hubM";M.hidden=true;M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  M.innerHTML='<div class="hubw"><div class="hubh"><span class="hubi" id="hubI"></span><div class="hubtt"><b id="hubT"></b><small id="hubD"></small></div><button id="hubX" aria-label="Cerrar">✕</button></div><div class="hubtabs" id="hubTabs"></div><div class="hubb" id="hubB"></div></div>';
  document.body.appendChild(M);
  const G=document.createElement("div");G.id="hubG";G.hidden=true;G.innerHTML='<div class="hubgl" id="hubGl"></div>';document.body.appendChild(G);
  HUB.forEach(g=>g.tabs.forEach(t=>hubPark(t[0])));
  const hd=document.querySelector("main>header");if(hd&&!$("hud")){const d=document.createElement("div");d.id="hud";hd.insertBefore(d,hd.querySelector(".tk"));hudUI();setInterval(hudUI,2000)}
  {const nb=$("navb"),nn=$("navn");nb.innerHTML='<span class="nbring" aria-hidden="true"></span><span class="nbball" aria-hidden="true"><svg viewBox="0 0 100 100"><defs><radialGradient id="nbg" cx="34%" cy="30%" r="80%"><stop offset="0" stop-color="#ff7d7d"/><stop offset=".5" stop-color="#e3263a"/><stop offset="1" stop-color="#9a1222"/></radialGradient><linearGradient id="nbw" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9d5ea"/></linearGradient><radialGradient id="nbl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fff3b0"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient></defs><ellipse class="nbin" cx="50" cy="48" rx="54" ry="20" fill="url(#nbl)"/><g class="nbbot"><path d="M5 50 A45 45 0 0 0 95 50 Z" fill="url(#nbw)" stroke="#1c1f3a" stroke-width="5" stroke-linejoin="round"/><rect x="5" y="50" width="90" height="5.5" fill="#1c1f3a"/></g><g class="nbtop"><path d="M5 50 A45 45 0 0 1 95 50 Z" fill="url(#nbg)" stroke="#1c1f3a" stroke-width="5" stroke-linejoin="round"/><rect x="5" y="44.5" width="90" height="5.5" fill="#1c1f3a"/><ellipse cx="32" cy="25" rx="10" ry="5.5" fill="#ffffff" opacity=".75" transform="rotate(-32 32 25)"/></g><g class="nbbtn"><circle cx="50" cy="50" r="15" fill="#1c1f3a"/><circle cx="50" cy="50" r="9.5" fill="#ffffff"/><circle class="nbdot" cx="50" cy="50" r="5" fill="#ffffff"/></g></svg></span><span class="nblab">MENÚ</span>';if(nn)nb.appendChild(nn);nb.setAttribute("aria-label","Abrir el menú");nb.title="Menú"}
  $("navb").onclick=()=>{snd("ui");hubMenu()};
  hubDuelWatch();
}
document.addEventListener("click",e=>{
  const t=e.target;if(!t.closest)return;
  const hg=t.closest("[data-hg]");if(hg){hubOpen(hg.dataset.hg);return}
  const hq=t.closest("[data-hq]");if(hq){hubMenu(false);hubClose();try{$(hq.dataset.hq)._siv({behavior:"smooth",block:"start"})}catch(x){}return}
  const ht=t.closest("#hubTabs [data-ht]");if(ht){hubOpen(HB.g,ht.dataset.ht);return}
  const ha=t.closest("#hubTabs [data-ha]");if(ha){if(ha.dataset.ha==="opt"){hubClose();$("optp").hidden=false}else if(ha.dataset.ha==="welc"){hubClose();welcShow()}return}
  if(t.closest("#hubX")){hubClose();return}
  if(t.id==="hubM"){hubClose();return}
  if(t.id==="hubG"||t.id==="hubGl"){hubMenu(false);return}
  if(t.closest("#hudStk")){const b=$("strkB");if(b)b.click()}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("hubG").hidden)hubMenu(false);else if(!$("hubM").hidden&&$("trdM").hidden&&$("prof").hidden&&$("evo").hidden)hubClose()}});
hubInit();
// ================= ajustes en una ventana con secciones (Sonido, Gráficos, Controles, Accesibilidad, Cuenta, Acerca de) =================
const SETT=[["snd","🔊 Sonido"],["gfx","🎨 Gráficos"],["ctl","🎮 Controles"],["acc","♿ Accesibilidad"],["acct","👤 Cuenta"],["about","ℹ️ Acerca de"]];
let SETTAB="snd";
function setTab(k){SETTAB=k;document.querySelectorAll("#optp .settabs button").forEach(b=>b.classList.toggle("on",b.dataset.st===k));document.querySelectorAll("#optp .setpane").forEach(p=>{p.hidden=p.dataset.st!==k});const b=document.querySelector("#optp .setbody");if(b)b.scrollTop=0}
function setInit(){
  const op=$("optp");if(!op||op.dataset.v2)return;op.dataset.v2="1";const vEl=$("vol"),sEl=$("svol");
  const lab=k=>{const i=op.querySelector('input[data-o="'+k+'"]');return i?i.closest("label"):null};
  const byId=id=>$(id),par=id=>{const e=$(id);return e?e.closest("label,.mrow")||e:null};
  const panes={};
  const mk=(k,title)=>{const d=document.createElement("div");d.className="setpane";d.dataset.st=k;d.innerHTML='<h3>'+title+'</h3>';panes[k]=d;return d};
  const sec=(pane,t)=>{const h=document.createElement("h4");h.textContent=t;pane.appendChild(h)};
  const add=(pane,els)=>els.forEach(e=>{if(e){if(e.tagName==="LABEL"&&e.querySelector('input[type="checkbox"]'))e.classList.add("tog");pane.appendChild(e)}});
  // sonido
  const sP=mk("snd","Sonido");
  [["vol","🎵 Música"],["svol","🔔 Efectos"]].forEach(([id,t])=>{const l=par(id);if(l){l.classList.add("slid");const tn=[...l.childNodes].find(n=>n.nodeType===3);if(tn)tn.textContent="";const s=document.createElement("span");s.textContent=t;l.insertBefore(s,l.firstChild)}add(sP,[l])});
  {const b=document.createElement("button");b.className="setbtn";b.id="setMute";b.type="button";sP.appendChild(b);
    const upd=()=>{b.textContent=(O.vol>0||O.svol>0)?"🔇 Silenciar todo":"🔊 Activar el sonido"};upd();
    b.onclick=()=>{if(O.vol>0||O.svol>0){O._mv=O.vol;O._ms=O.svol;O.vol=0;O.svol=0}else{O.vol=O._mv||.5;O.svol=O._ms||.7}
      vEl.value=O.vol;sEl.value=O.svol;try{if(mgain)mgain.gain.value=O.vol;if(sgain)sgain.gain.value=O.svol}catch(e){}saveO();upd()};
    [vEl,sEl].forEach(e=>e&&e.addEventListener("input",upd))}
  sec(sP,"Música de fondo");add(sP,[byId("song"),par("mplay"),byId("mnow"),lab("auto")]);
  sec(sP,"Combate");add(sP,[lab("sfx"),lab("cry")]);
  // graficos
  const gP=mk("gfx","Gráficos");
  sec(gP,"Efectos");add(gP,[lab("fx"),lab("intro"),lab("rain"),lab("flt"),lab("fists"),lab("bg")]);
  sec(gP,"Pantalla");
  {const d=document.createElement("label");d.className="slid";d.innerHTML='<span>🌙 Tema</span><select id="setTheme"><option value="">Automático (como tu dispositivo)</option><option value="light">☀️ Claro</option><option value="dark">🌙 Oscuro</option></select>';gP.appendChild(d)}
  {const d=document.createElement("label");d.className="slid";d.innerHTML='<span>🖼️ Sprites</span><select id="setSpr"><option value="">Alta definición en la vista ampliada (recomendado)</option><option value="px">Píxel animados en todo el juego</option></select>';gP.appendChild(d)}
  add(gP,[par("bigopt"),lab("pShop"),lab("pBat")]);
  // controles
  const cP=mk("ctl","Controles");
  sec(cP,"Tecla de la Pokéball");add(cP,[byId("tkl"),par("tkadd"),byId("tkmsg")]);
  sec(cP,"Juego");add(cP,[lab("askip"),lab("skip"),lab("bgprod")]);
  // accesibilidad
  const aP=mk("acc","Accesibilidad");
  {const d=document.createElement("div");d.innerHTML='<label class="slid"><span>🔠 Tamaño del texto</span><select id="setTxt"><option value="1">Normal</option><option value="1.1">Grande</option><option value="1.22">Muy grande</option></select></label><label class="tog"><input type="checkbox" data-o="calm"> Reducir el movimiento (sin animaciones ni balanceos)</label><label class="tog"><input type="checkbox" data-o="hc"> Alto contraste (textos y bordes más marcados)</label><small class="setnote">Estas opciones solo cambian cómo se ve el juego en este dispositivo.</small>';[...d.childNodes].forEach(n=>aP.appendChild(n))}
  // cuenta
  const kP=mk("acct","Cuenta y guardado");
  add(kP,[byId("clInfo"),par("clNow"),par("clDel"),par("clExp"),byId("clImpOk"),byId("clFile"),byId("clCloud"),byId("clMsg")]);
  // acerca de
  const bP=mk("about","Acerca de");
  bP.insertAdjacentHTML("beforeend",'<div class="setabout"><b>Poke Gacha Online</b><small>Juego de fans hecho con cariño. Colecciona, combate y comercia con jugadores de todo el mundo.</small></div><div class="setlinks"><button type="button" class="setbtn" data-sa="news">📰 Novedades</button><button type="button" class="setbtn" data-sa="welc">❓ Cómo se juega</button><button type="button" class="setbtn" data-sa="sug">💡 Enviar una sugerencia</button><button type="button" class="setbtn" data-sa="sup">💖 Apoyar el juego</button><button type="button" class="setbtn" data-sa="priv">🔒 Política de privacidad</button></div><small class="setnote">Pokémon y sus personajes son marcas de Nintendo, Game Freak y The Pokémon Company. Sprites de PokeAPI y Pokémon Showdown. Este juego no es oficial ni tiene relación con ellas.</small>');
  // montaje
  const w=document.createElement("div");w.className="setw";w.setAttribute("role","dialog");w.setAttribute("aria-label","Ajustes");
  w.innerHTML='<div class="seth"><h2>Ajustes</h2><button type="button" class="setx" id="setX">Cerrar</button></div><div class="settabs">'+SETT.map(t=>'<button type="button" data-st="'+t[0]+'">'+t[1]+'</button>').join("")+'</div><div class="setbody"></div>';
  const body=w.querySelector(".setbody");SETT.forEach(t=>body.appendChild(panes[t[0]]));
  [...op.childNodes].forEach(n=>n.remove());op.appendChild(w);
  {const s=$("setTxt");s.value=String(O.txt||1);s.onchange=()=>{O.txt=+s.value;saveO();applyO()}}
  {const s=$("setSpr");s.value=O.spr||"";s.onchange=()=>{O.spr=s.value;saveO();snd("ui");try{render()}catch(e){}toast(O.spr==="px"?"🖼️ Sprites clásicos animados en todo el juego.":"🖼️ Pokémon del gacha en alta definición.")}}
  {const s=$("setTheme");s.value=O.theme||"";s.onchange=()=>{O.theme=s.value;saveO();applyO();snd("ui")}}
  applyO();setTab(SETTAB);
  op.addEventListener("click",e=>{const t=e.target;if(t===op||t.closest("#setX")){op.hidden=true;return}
    const st=t.closest(".settabs [data-st]");if(st){snd("ui");setTab(st.dataset.st);return}
    const sa=t.closest("[data-sa]");if(sa){op.hidden=true;const a=sa.dataset.sa;if(a==="news")newsShow(true);else if(a==="welc")welcShow();else if(a==="sug")hubOpen("mas","sugP");else if(a==="sup")hubOpen("mas","supP");else if(a==="priv")privShow()}});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!op.hidden)op.hidden=true});
}
const _applyOBase=applyO;
applyO=function(){_applyOBase();const b=document.body;if(!b)return;b.classList.toggle("calm",!!O.calm);b.classList.toggle("hicon",!!O.hc);const z=+O.txt||1;document.documentElement.style.zoom=z===1?"":String(z);const r=document.documentElement;if(O.theme==="dark"||O.theme==="light")r.dataset.theme=O.theme;else delete r.dataset.theme};
setInit();
// ================= botón de pantalla completa en la pantalla principal =================
(function(){
  const d=document,el=d.documentElement,can=!!(el.requestFullscreen||el.webkitRequestFullscreen);if(!can||$("fsb"))return;
  const IC_ON='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
        IC_OFF='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  const fsEl=()=>d.fullscreenElement||d.webkitFullscreenElement;
  const b=d.createElement("button");b.id="fsb";b.type="button";d.body.appendChild(b);
  const upd=()=>{const on=fsEl()===el;b.innerHTML=on?IC_OFF:IC_ON;b.title=on?"Salir de pantalla completa":"Pantalla completa";b.setAttribute("aria-label",b.title);b.classList.toggle("on",on)};
  b.onclick=()=>{snd("ui");try{if(fsEl()){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else{const r=(el.requestFullscreen||el.webkitRequestFullscreen).call(el);if(r&&r.catch)r.catch(()=>{})}}catch(e){}};
  d.addEventListener("fullscreenchange",upd);d.addEventListener("webkitfullscreenchange",upd);upd();
})();
// ================= ver en grande los Pokémon que salen en el gacha =================
function pkView(n,sh){
  const p=PM[n];if(!p)return;let m=$("pkv");
  if(!m){m=document.createElement("div");m.id="pkv";m.hidden=true;m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");document.body.appendChild(m);
    m.addEventListener("click",e=>{if(e.target===m||e.target.closest(".pkvx"))pkClose();const c=e.target.closest(".pkvcry");if(c)cry(c.dataset.n)})}
  const own=S.owned[n]||0,shn=(S.shiny&&S.shiny[n])||0,RN={C:"Común",R:"Raro",E:"Épico",M:"Forma especial",L:"Legendario"}[p[2]]||"";
  m.innerHTML='<div class="pkvw '+p[2]+(sh?' shiny':'')+'" style="--tc:'+(TC[p[1]]||"#999")+'"><button class="pkvx" aria-label="Cerrar">✕</button>'+
    '<div class="pkvdex">#'+String(p[4]||0).padStart(4,"0")+'</div><div class="pkvspr">'+icoHD(p,210,false,!!sh)+'</div>'+
    '<h3>'+(sh?"✨ ":"")+esc(n)+'</h3><div class="pkvtags"><span class="pkvty">'+tyTxt(p)+'</span><span class="pkvr">'+STAR[p[2]]+' '+RN+'</span></div>'+
    '<div class="pkvinfo"><span>Tienes <b>×'+own+'</b></span>'+(shn?'<span>✨ Variocolor <b>×'+shn+'</b></span>':'')+(S.lv&&S.lv[n]?'<span>Nivel <b>'+S.lv[n].l+'</b></span>':'')+'</div>'+
    '<button class="pkvcry" data-n="'+esc(n)+'">🔊 Escuchar su grito</button></div>';
  m.hidden=false;const w=m.querySelector(".pkvw");w.animate([{transform:"scale(.6) rotate(-4deg)",opacity:0},{transform:"scale(1.04)",opacity:1,offset:.7},{transform:"none"}],{duration:380,easing:"cubic-bezier(.2,.9,.3,1.2)"});
  m.animate([{opacity:0},{opacity:1}],{duration:200});
  if(O.cry!==0)setTimeout(()=>{try{cry(n)}catch(e){}},200);
}
function pkClose(){const m=$("pkv");if(m)m.hidden=true}
document.addEventListener("click",e=>{const c=e.target.closest&&e.target.closest("#out .card[data-pn]");if(c){snd("ui");pkView(c.dataset.pn,c.dataset.sh==="1")}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){const m=$("pkv");if(m&&!m.hidden)pkClose()}});
// ---- con los Ajustes o la ficha de Pokémon abiertos también se pausan las animaciones de detrás ----
(function(){const ids=["optp","pkv"],upd=()=>document.body.classList.toggle("modalon",ids.some(i=>{const e=$(i);return e&&!e.hidden}));
  const mo=new MutationObserver(upd);const watch=()=>ids.forEach(i=>{const e=$(i);if(e&&!e.dataset.mw){e.dataset.mw=1;mo.observe(e,{attributes:true,attributeFilter:["hidden"]})}});
  watch();document.addEventListener("click",()=>setTimeout(()=>{watch();upd()},0),true)})();
// ================= el fondo decorativo no se vuelve a sortear al cambiar de tamaño (pantalla completa, girar el móvil...) =================
(function(){
  const CS=118,done=new Set();
  bgBuild=function(){
    const w=$("bgw");if(!w||!(innerWidth>0))return;
    if(!done.size)w.querySelectorAll("i").forEach(i=>{const l=parseFloat(i.style.left),t=parseFloat(i.style.top);if(l>=0&&t>=0)done.add(Math.floor(t/CS)+","+Math.floor(l/CS))});
    const cols=Math.ceil(innerWidth/CS),rows=Math.ceil(innerHeight/CS);let add="";
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const k=r+","+c;if(done.has(k))continue;done.add(k);
      const p=P[Math.floor(Math.random()*P.length)],sz=50+Math.random()*36;
      add+='<i style="left:'+(c*CS+Math.random()*(CS-sz))+'px;top:'+(r*CS+Math.random()*(CS-sz))+'px;transform:rotate('+(Math.random()*40-20)+'deg);animation-duration:'+(6+Math.random()*6)+'s;animation-delay:-'+(Math.random()*8)+'s">'+ico(p,sz)+'</i>'}
    if(add)w.insertAdjacentHTML("beforeend",add);
  };
})();
// ================= conjuntos guardados del entrenador (hasta 5) =================
const TRSETN=5;let TRSEL=null;
function trSetsUI(){
  const box=$("trSets");if(!box)return;
  S.trSets=Array.isArray(S.trSets)?S.trSets.slice(0,TRSETN):[];while(S.trSets.length<TRSETN)S.trSets.push(null);
  const cur=trEnc(myLook());
  if(TRSEL==null){const i=S.trSets.findIndex(x=>!x);TRSEL=i<0?0:i}
  box.innerHTML='<div class="trsh"><b>👕 Mis conjuntos</b><small>'+S.trSets.filter(Boolean).length+' / '+TRSETN+'</small></div><div class="trsg">'+S.trSets.map((e,i)=>{
    const on=e&&e===cur;
    return '<div class="trslot'+(i===TRSEL?' sel':'')+(e?'':' empty')+(on?' on':'')+'" data-ts="'+i+'" role="button" tabindex="0" title="'+(e?"Conjunto "+(i+1)+": pulsa para ponértelo":"Ranura vacía: selecciónala y pulsa Guardar")+'">'+
      (e?trImg(trDec(e),"f","i"):'<span class="trsplus">+</span>')+'<i>'+(i+1)+'</i>'+(on?'<em>✓</em>':'')+(e?'<button class="trsdel" data-tsd="'+i+'" aria-label="Borrar conjunto '+(i+1)+'">✕</button>':'')+'</div>'}).join("")+'</div>'+
    '<button id="trSave" class="trsave">💾 Guardar en la ranura '+(TRSEL+1)+'</button><small class="trsmsg">Selecciona una ranura y guarda tu aspecto actual. Pulsa un conjunto guardado para ponértelo.</small>';
}
const _trUIBase=trUI;
trUI=function(){_trUIBase();trSetsUI()};
document.addEventListener("click",e=>{
  const t=e.target;if(!t.closest||!t.closest("#trSets"))return;
  const del=t.closest("[data-tsd]");if(del){const i=+del.dataset.tsd;if(!confirm("¿Borrar el conjunto "+(i+1)+"?"))return;S.trSets[i]=null;TRSEL=i;save();snd("ui");trSetsUI();return}
  if(t.closest("#trSave")){const i=TRSEL|0,had=S.trSets[i];if(had&&had!==trEnc(myLook())&&!confirm("La ranura "+(i+1)+" ya tiene un conjunto. ¿Sustituirlo por tu aspecto actual?"))return;
    S.trSets[i]=trEnc(myLook());save();snd("lvl");toast("💾 Conjunto guardado en la ranura "+(i+1)+".");const nx=S.trSets.findIndex(x=>!x);trSetsUI();
    const s=document.querySelector('#trSets [data-ts="'+i+'"]');if(s)s.animate([{transform:"scale(1.15)"},{transform:"none"}],{duration:300});return}
  const sl=t.closest("[data-ts]");if(sl){const i=+sl.dataset.ts,e2=S.trSets[i];TRSEL=i;
    if(e2){S.tr=Object.assign({},TRDEF,trDec(e2));save();snd("ui");trUI();if(typeof pvPub==="function")pvPub();toast("👕 Te has puesto el conjunto "+(i+1)+".")}else{snd("ui");trSetsUI()}}
});
document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.closest&&e.target.closest("#trSets [data-ts]")){e.preventDefault();e.target.click()}});
// ================= sprites en alta definición (renders de Pokémon HOME, 512 px) =================
const HDH={"1":7,"2":10,"3":20,"4":6,"5":11,"6":17,"7":5,"8":10,"9":16,"10":3,"11":7,"12":11,"13":3,"14":6,"15":10,"16":3,"17":11,"18":15,"19":3,"20":7,"21":3,"22":12,"23":20,"24":35,"25":4,"26":8,"27":6,"28":10,"29":4,"30":8,"31":13,"32":5,"33":9,"34":14,"35":6,"36":13,"37":6,"38":11,"39":5,"40":10,"41":8,"42":16,"43":5,"44":8,"45":12,"46":3,"47":10,"48":10,"49":15,"50":2,"51":7,"52":4,"53":10,"54":8,"55":17,"56":5,"57":10,"58":7,"59":19,"60":6,"61":10,"62":13,"63":9,"64":13,"65":15,"66":8,"67":15,"68":16,"69":7,"70":10,"71":17,"72":9,"73":16,"74":4,"75":10,"76":14,"77":10,"78":17,"79":12,"80":16,"81":3,"82":10,"83":8,"84":14,"85":18,"86":11,"87":17,"88":9,"89":12,"90":3,"91":15,"92":13,"93":16,"94":15,"95":88,"96":10,"97":16,"98":4,"99":13,"100":5,"101":12,"102":4,"103":20,"104":4,"105":10,"106":15,"107":14,"108":12,"109":6,"110":12,"111":10,"112":19,"113":11,"114":10,"115":22,"116":4,"117":12,"118":6,"119":13,"120":8,"121":11,"122":13,"123":15,"124":14,"125":11,"126":13,"127":15,"128":14,"129":9,"130":65,"131":25,"132":3,"133":3,"134":10,"135":8,"136":9,"137":8,"138":4,"139":10,"140":5,"141":13,"142":18,"143":21,"144":17,"145":16,"146":20,"147":18,"148":40,"149":22,"150":20,"151":4,"152":9,"153":12,"154":18,"155":5,"156":9,"157":17,"158":6,"159":11,"160":23,"161":8,"162":18,"163":7,"164":16,"165":10,"166":14,"167":5,"168":11,"169":18,"170":5,"171":12,"172":3,"173":3,"174":3,"175":3,"176":6,"177":2,"178":15,"179":6,"180":8,"181":14,"182":4,"183":4,"184":8,"185":12,"186":11,"187":4,"188":6,"189":8,"190":8,"191":3,"192":8,"193":12,"194":4,"195":14,"196":9,"197":10,"198":5,"199":20,"200":7,"201":5,"202":13,"203":15,"204":6,"205":12,"206":15,"207":11,"208":92,"209":6,"210":14,"211":5,"212":18,"213":6,"214":15,"215":9,"216":6,"217":18,"218":7,"219":8,"220":4,"221":11,"222":6,"223":6,"224":9,"225":9,"226":21,"227":17,"228":6,"229":14,"230":18,"231":5,"232":11,"233":6,"234":14,"235":12,"236":7,"237":14,"238":4,"239":6,"240":7,"241":12,"242":15,"243":19,"244":21,"245":20,"246":6,"247":12,"248":20,"249":52,"250":38,"251":6,"252":5,"253":9,"254":17,"255":4,"256":9,"257":19,"258":4,"259":7,"260":15,"261":5,"262":10,"263":4,"264":5,"265":3,"266":6,"267":10,"268":7,"269":12,"270":5,"271":12,"272":15,"273":5,"274":10,"275":13,"276":3,"277":7,"278":6,"279":12,"280":4,"281":8,"282":16,"283":5,"284":8,"285":4,"286":12,"287":8,"288":14,"289":20,"290":5,"291":8,"292":8,"293":6,"294":10,"295":15,"296":10,"297":23,"298":2,"299":10,"300":6,"301":11,"302":5,"303":6,"304":4,"305":9,"306":21,"307":6,"308":13,"309":6,"310":15,"311":4,"312":4,"313":7,"314":6,"315":3,"316":4,"317":17,"318":8,"319":18,"320":20,"321":145,"322":7,"323":19,"324":5,"325":7,"326":9,"327":11,"328":7,"329":11,"330":20,"331":4,"332":13,"333":4,"334":11,"335":13,"336":27,"337":10,"338":12,"339":4,"340":9,"341":6,"342":11,"343":5,"344":15,"345":10,"346":15,"347":7,"348":15,"349":6,"350":62,"351":3,"352":10,"353":6,"354":11,"355":8,"356":16,"357":20,"358":6,"359":12,"360":6,"361":7,"362":15,"363":8,"364":11,"365":14,"366":4,"367":17,"368":18,"369":10,"370":6,"371":6,"372":11,"373":15,"374":6,"375":12,"376":16,"377":17,"378":18,"379":19,"380":14,"381":20,"382":45,"383":35,"384":70,"385":3,"386":17,"387":4,"388":11,"389":22,"390":5,"391":9,"392":12,"393":4,"394":8,"395":17,"396":3,"397":6,"398":12,"399":5,"400":10,"401":3,"402":10,"403":5,"404":9,"405":14,"406":2,"407":9,"408":9,"409":16,"410":5,"411":13,"412":2,"413":5,"414":9,"415":3,"416":12,"417":4,"418":7,"419":11,"420":4,"421":5,"422":3,"423":9,"424":12,"425":4,"426":12,"427":4,"428":12,"429":9,"430":9,"431":5,"432":10,"433":2,"434":4,"435":10,"436":5,"437":13,"438":5,"439":6,"440":6,"441":5,"442":10,"443":7,"444":14,"445":19,"446":6,"447":7,"448":12,"449":8,"450":20,"451":8,"452":13,"453":7,"454":13,"455":14,"456":4,"457":12,"458":10,"459":10,"460":22,"461":11,"462":12,"463":17,"464":24,"465":20,"466":18,"467":16,"468":15,"469":19,"470":10,"471":8,"472":20,"473":25,"474":9,"475":16,"476":14,"477":22,"478":13,"479":3,"480":3,"481":3,"482":3,"483":54,"484":42,"485":17,"486":37,"487":45,"488":15,"489":4,"490":3,"491":15,"492":2,"493":32,"494":4,"495":6,"496":8,"497":33,"498":5,"499":10,"500":16,"501":5,"502":8,"503":15,"504":5,"505":11,"506":4,"507":9,"508":12,"509":4,"510":11,"511":6,"512":11,"513":6,"514":10,"515":6,"516":10,"517":6,"518":11,"519":3,"520":6,"521":12,"522":8,"523":16,"524":4,"525":9,"526":17,"527":4,"528":9,"529":3,"530":7,"531":11,"532":6,"533":12,"534":14,"535":5,"536":8,"537":15,"538":13,"539":14,"540":3,"541":5,"542":12,"543":4,"544":12,"545":25,"546":3,"547":7,"548":5,"549":11,"550":10,"551":7,"552":10,"553":15,"554":6,"555":13,"556":10,"557":3,"558":14,"559":6,"560":11,"561":14,"562":5,"563":17,"564":7,"565":12,"566":5,"567":14,"568":6,"569":19,"570":7,"571":16,"572":4,"573":5,"574":4,"575":7,"576":15,"577":3,"578":6,"579":10,"580":5,"581":13,"582":4,"583":11,"584":13,"585":6,"586":19,"587":4,"588":5,"589":10,"590":2,"591":6,"592":12,"593":22,"594":12,"595":1,"596":8,"597":6,"598":10,"599":3,"600":6,"601":6,"602":2,"603":12,"604":21,"605":5,"606":10,"607":3,"608":6,"609":10,"610":6,"611":10,"612":18,"613":5,"614":26,"615":11,"616":4,"617":8,"618":7,"619":9,"620":14,"621":16,"622":10,"623":28,"624":5,"625":16,"626":16,"627":5,"628":15,"629":5,"630":12,"631":14,"632":3,"633":8,"634":14,"635":18,"636":11,"637":16,"638":21,"639":19,"640":20,"641":15,"642":15,"643":32,"644":29,"645":15,"646":30,"647":14,"648":6,"649":15,"650":4,"651":7,"652":16,"653":4,"654":10,"655":15,"656":3,"657":6,"658":15,"659":4,"660":10,"661":3,"662":7,"663":12,"664":3,"665":3,"666":12,"667":6,"668":15,"669":1,"670":2,"671":11,"672":9,"673":17,"674":6,"675":21,"676":12,"677":3,"678":6,"679":8,"680":8,"681":17,"682":2,"683":8,"684":4,"685":8,"686":4,"687":15,"688":5,"689":13,"690":5,"691":18,"692":5,"693":13,"694":5,"695":10,"696":8,"697":25,"698":13,"699":27,"700":10,"701":8,"702":2,"703":3,"704":3,"705":8,"706":20,"707":2,"708":4,"709":15,"710":4,"711":9,"712":10,"713":20,"714":5,"715":15,"716":30,"717":58,"718":50,"719":7,"720":5,"721":17,"722":3,"723":7,"724":16,"725":4,"726":7,"727":18,"728":4,"729":6,"730":18,"731":3,"732":6,"733":11,"734":4,"735":7,"736":4,"737":5,"738":15,"739":6,"740":17,"741":6,"742":1,"743":2,"744":5,"745":8,"746":2,"747":4,"748":7,"749":10,"750":25,"751":3,"752":18,"753":3,"754":9,"755":2,"756":10,"757":6,"758":12,"759":5,"760":21,"761":3,"762":7,"763":12,"764":1,"765":15,"766":20,"767":5,"768":20,"769":5,"770":13,"771":3,"772":19,"773":23,"774":3,"775":4,"776":20,"777":3,"778":2,"779":9,"780":30,"781":39,"782":6,"783":12,"784":16,"785":18,"786":12,"787":19,"788":13,"789":2,"790":1,"791":34,"792":40,"793":12,"794":24,"795":18,"796":38,"797":92,"798":3,"799":55,"800":24,"801":10,"802":7,"803":6,"804":36,"805":55,"806":18,"807":15,"808":2,"809":25,"810":3,"811":7,"812":21,"813":3,"814":6,"815":14,"816":3,"817":7,"818":19,"819":3,"820":6,"821":2,"822":8,"823":22,"824":4,"825":4,"826":4,"827":6,"828":12,"829":4,"830":5,"831":6,"832":13,"833":3,"834":10,"835":3,"836":10,"837":3,"838":11,"839":28,"840":2,"841":3,"842":4,"843":22,"844":38,"845":8,"846":5,"847":13,"848":4,"849":16,"850":7,"851":30,"852":6,"853":16,"854":1,"855":2,"856":4,"857":6,"858":21,"859":4,"860":8,"861":15,"862":16,"863":8,"864":10,"865":8,"866":15,"867":16,"868":2,"869":3,"870":30,"871":3,"872":3,"873":13,"874":25,"875":14,"876":9,"877":3,"878":12,"879":30,"880":18,"881":23,"882":23,"883":20,"884":18,"885":5,"886":14,"887":30,"888":28,"889":29,"890":200,"891":6,"892":19,"893":18,"894":12,"895":21,"896":22,"897":20,"898":11,"899":18,"900":18,"901":24,"902":30,"903":13,"904":25,"905":16,"906":4,"907":9,"908":15,"909":4,"910":10,"911":16,"912":5,"913":12,"914":18,"915":5,"916":10,"917":3,"918":10,"919":2,"920":10,"921":3,"922":4,"923":9,"924":3,"925":3,"926":3,"927":5,"928":3,"929":6,"930":14,"931":6,"932":4,"933":6,"934":23,"935":6,"936":15,"937":16,"938":3,"939":12,"940":4,"941":14,"942":5,"943":11,"944":2,"945":7,"946":6,"947":12,"948":9,"949":19,"950":13,"951":3,"952":9,"953":2,"954":3,"955":2,"956":19,"957":4,"958":7,"959":7,"960":12,"961":12,"962":15,"963":13,"964":13,"965":10,"966":18,"967":16,"968":25,"969":7,"970":15,"971":6,"972":20,"973":16,"974":12,"975":45,"976":25,"977":120,"978":3,"979":12,"980":18,"981":32,"982":36,"983":20,"984":22,"985":12,"986":12,"987":14,"988":32,"989":23,"990":9,"991":6,"992":18,"993":13,"994":12,"995":16,"996":5,"997":8,"998":21,"999":3,"1000":12,"1001":15,"1002":19,"1003":27,"1004":4,"1005":20,"1006":14,"1007":25,"1008":35,"1009":35,"1010":15,"1011":4,"1012":1,"1013":2,"1014":18,"1015":10,"1016":14,"1017":12,"1018":20,"1019":18,"1020":35,"1021":52,"1022":15,"1023":16,"1024":2,"1025":3,"10001":17,"10002":17,"10003":17,"10004":5,"10005":5,"10006":4,"10007":69,"10008":3,"10009":3,"10010":3,"10011":3,"10012":3,"10013":3,"10014":3,"10015":3,"10016":10,"10017":13,"10018":6,"10019":14,"10020":30,"10021":13,"10022":33,"10023":36,"10024":14,"10025":6,"10026":17,"10027":3,"10028":5,"10029":8,"10030":7,"10031":11,"10032":17,"10033":24,"10034":17,"10035":17,"10036":16,"10037":12,"10038":14,"10039":22,"10040":17,"10041":65,"10042":21,"10043":23,"10044":15,"10045":14,"10046":20,"10047":17,"10048":19,"10049":25,"10050":19,"10051":16,"10052":10,"10053":22,"10054":13,"10055":18,"10056":12,"10057":12,"10058":19,"10059":13,"10060":27,"10061":2,"10062":18,"10063":23,"10064":19,"10065":19,"10066":5,"10067":15,"10068":16,"10069":15,"10070":25,"10071":20,"10072":105,"10073":22,"10074":21,"10075":11,"10076":25,"10077":98,"10078":50,"10079":108,"10086":65,"10087":25,"10088":13,"10089":18,"10090":14,"10091":3,"10092":7,"10093":14,"10094":4,"10095":4,"10096":4,"10097":4,"10098":4,"10099":4,"10100":7,"10101":7,"10102":12,"10103":6,"10104":11,"10105":2,"10106":7,"10107":4,"10108":11,"10109":4,"10110":10,"10111":17,"10112":7,"10113":10,"10114":109,"10115":10,"10116":15,"10117":15,"10118":12,"10119":50,"10120":45,"10121":14,"10122":26,"10123":6,"10124":6,"10125":6,"10126":11,"10127":82,"10128":15,"10129":21,"10130":3,"10131":3,"10132":3,"10133":3,"10134":3,"10135":3,"10136":3,"10137":3,"10138":3,"10139":3,"10140":3,"10141":3,"10142":3,"10143":2,"10144":4,"10145":4,"10146":24,"10147":10,"10148":4,"10149":17,"10150":4,"10151":5,"10152":8,"10153":31,"10154":6,"10155":38,"10156":42,"10157":75,"10160":4,"10161":4,"10162":8,"10163":17,"10164":12,"10165":16,"10166":8,"10167":30,"10168":14,"10169":17,"10170":16,"10171":20,"10172":18,"10173":6,"10174":4,"10175":5,"10176":7,"10177":17,"10178":17,"10179":5,"10180":7,"10181":12,"10182":8,"10183":8,"10184":16,"10185":14,"10186":9,"10187":3,"10188":28,"10189":29,"10190":1000,"10191":19,"10192":18,"10193":24,"10194":24,"10195":240,"10196":280,"10197":250,"10198":170,"10199":210,"10200":330,"10201":250,"10202":200,"10203":190,"10204":240,"10205":180,"10206":350,"10207":210,"10208":250,"10209":280,"10210":270,"10211":400,"10212":140,"10213":140,"10214":240,"10215":420,"10216":240,"10217":240,"10218":220,"10219":240,"10220":750,"10221":260,"10222":320,"10223":300,"10224":230,"10225":430,"10226":290,"10227":260,"10228":240,"10229":8,"10230":20,"10231":5,"10232":12,"10233":16,"10234":5,"10235":9,"10236":15,"10237":12,"10238":7,"10239":16,"10240":17,"10241":7,"10242":17,"10243":14,"10244":16,"10245":70,"10246":63,"10247":10,"10248":30,"10249":16,"10250":14,"10251":14,"10252":14,"10253":4,"10254":10,"10255":45,"10256":18,"10257":3,"10258":3,"10259":3,"10260":6,"10261":6,"10262":6,"10263":1,"10272":24,"10273":12,"10274":12,"10275":12,"10276":3,"10277":17,"10278":17,"10279":45,"10280":23,"10281":22,"10282":24,"10283":23,"10284":17,"10285":26,"10286":18,"10287":9,"10288":32,"10289":11,"10290":30,"10291":25,"10292":16,"10293":15,"10294":15,"10295":15,"10296":2,"10297":29,"10298":22,"10299":21,"10300":10,"10301":77,"10302":30,"10303":16,"10304":12,"10305":10,"10306":12,"10307":12,"10308":19,"10309":19,"10310":13,"10311":28,"10312":30,"10313":40,"10314":8,"10315":26,"10316":23,"10317":13,"10318":13,"10319":15,"10320":12,"10321":28,"10322":6,"10323":6,"10324":6,"10325":21,"10326":8};
const HDON=()=>O.spr!=="px"&&!!window._wantHD&&!window._noHD;
const _icoBase=ico;
ico=function(p,s,back,sh){
  if(back||!HDON())return _icoBase(p,s,back,sh);
  const id=window._spr&&window._spr[p[0]];if(!id||!HDH[id])return _icoBase(p,s,back,sh);
  const w=Math.round(s*1.4),mm=Math.round(s*.2);
  return '<img class="pk hd'+(sh?' shy':'')+'" src="'+sprHost()+'other/home/'+(sh?"shiny/":"")+id+'.png" width="'+w+'" height="'+w+'" style="margin:-'+mm+'px" alt="" loading="lazy" decoding="async" data-n="'+esc(p[0])+'" data-s="'+s+'" data-i="'+id+'"'+(sh?' data-sh="1"':'')+' onerror="icoHDErr(this)">';
};
function icoHD(p,s,back,sh){window._wantHD=1;try{return ico(p,s,back,sh)}finally{window._wantHD=0}}
function icoHDErr(el){
  if(!el.dataset.r){el.dataset.r=1;el.src=SPRU2+"other/home/"+(el.dataset.sh?"shiny/":"")+el.dataset.i+".png";return}
  const p=PM[el.dataset.n];if(!p){el.remove();return}const t=document.createElement("div");t.innerHTML=_icoBase(p,+el.dataset.s,false,!!el.dataset.sh);if(t.firstChild)el.replaceWith(t.firstChild);
}
// el fondo decorativo sigue con los sprites clásicos (son muchos y pequeños)
{const _bgB=bgBuild;bgBuild=function(){window._noHD=1;try{_bgB()}finally{window._noHD=0}}}

// ---- política de privacidad ----
const PRIV=[
  ["💚 Gratis y sin ánimo de lucro","Poke Gacha Online es un juego de fans <b>gratuito y sin ánimo de lucro</b>. <b>No tiene anuncios ni compras dentro del juego</b>: todo se consigue jugando. Se puede apoyar con <b>donaciones totalmente voluntarias</b>, que se usan solo para pagar los servidores y el dominio, y que <b>no dan ninguna ventaja en el juego</b>. Tus datos no se venden ni se ceden a nadie."],
  ["📋 Qué datos se guardan",'<ul><li><b>Cuenta</b>: tu nombre de usuario o correo, o tu cuenta de Google si entras con ella. La contraseña la gestiona Firebase y nadie más puede verla.</li><li><b>Partida</b>: tu progreso (Pokémon, objetos, tickets, logros, ajustes…).</li><li><b>Perfil público</b>: apodo, tarjeta de entrenador, equipo, vitrina y puntuaciones de los rankings.</li><li><b>Funciones online</b>: mensajes del chat, mensajes privados, amigos, gremios, intercambios, mercado, regalos, incursiones, sugerencias y denuncias.</li></ul>Si juegas <b>sin cuenta</b>, la partida se guarda solo en tu navegador y no se envía a ningún sitio.'],
  ["🎯 Para qué se usan","Solo para que el juego funcione: guardar tu partida en la nube, mostrar rankings y perfiles, permitir las funciones online y moderar el chat para que sea un sitio seguro."],
  ["👀 Qué ven otros jugadores","Tu apodo, tu tarjeta de entrenador (equipo, vitrina, título, estadísticas), tus puntuaciones en los rankings y los mensajes que escribas en los chats. Tu correo y tu contraseña <b>nunca</b> se muestran."],
  ["🔧 Servicios que utiliza el juego",'<ul><li><b>Google Firebase</b>: inicio de sesión y base de datos.</li><li><b>GitHub Pages</b>: aloja la página del juego.</li><li><b>PokeAPI, Pokémon Showdown, jsDelivr y Google Fonts</b>: imágenes, datos y tipografías.</li></ul>Estos servicios pueden registrar datos técnicos (como la dirección IP) según sus propias políticas de privacidad. El juego <b>no usa herramientas de analítica, publicidad ni rastreo</b>.'],
  ["🍪 Almacenamiento en tu dispositivo","El juego guarda tu partida y tus ajustes en el almacenamiento local del navegador. No se usan cookies publicitarias ni de seguimiento."],
  ["🗑️ Tus derechos","Puedes pedir ver, corregir o borrar tus datos enviando una <b>sugerencia</b> desde el juego (Más → Sugerencias). La copia de la nube también se puede borrar en Ajustes → Cuenta, y la partida local desaparece al borrar los datos del navegador."],
  ["🧒 Menores","Si eres menor de 14 años, pide permiso a tu padre, madre o tutor antes de crear una cuenta o usar el chat."],
  ["™️ Marcas","Pokémon y sus personajes son marcas de Nintendo, Game Freak y The Pokémon Company. Este juego no es oficial ni tiene relación con ellas."],
  ["📝 Cambios","Si esta política cambia, se avisará en las Novedades del juego. Última actualización: 30 de octubre de 2026."]];
function privShow(){
  let m=$("privM");
  if(!m){m=document.createElement("div");m.id="privM";m.hidden=true;m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-label","Política de privacidad");
    m.innerHTML='<div class="jbox"><h2>🔒 Política de privacidad</h2>'+PRIV.map(x=>'<h3>'+x[0]+'</h3><div class="privt">'+x[1]+'</div>').join("")+'<div class="jrow"><button class="red" id="privOk">Entendido</button></div></div>';
    document.body.appendChild(m);
    m.addEventListener("click",e=>{if(e.target===m||e.target.closest("#privOk"))m.hidden=true});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!m.hidden)m.hidden=true})}
  m.hidden=false;m.querySelector(".jbox").scrollTop=0;try{$("privOk").focus({preventScroll:true})}catch(e){}
}
