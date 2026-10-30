// ================= FÓSILES: minijuego para desenterrarlos y laboratorio para revivirlos =================
// [clave, nombre, sprite, Pokémon (o mitad: "a" = Pájaro/Pez, "b" = Dragón/Plesio), ancho, alto, peso, puntos, emoji]
const FOSD=[
  ["helix","Fósil Hélix","helix-fossil","Omanyte",3,3,10,320,"🐚"],["dome","Fósil Domo","dome-fossil","Kabuto",3,3,10,320,"🦀"],
  ["amber","Ámbar Viejo","old-amber","Aerodactyl",2,2,4,520,"🟠"],["root","Fósil Raíz","root-fossil","Lileep",3,3,9,340,"🌿"],
  ["claw","Fósil Garra","claw-fossil","Anorith",3,3,9,340,"🦞"],["skull","Fósil Cráneo","skull-fossil","Cranidos",3,3,7,380,"💀"],
  ["armor","Fósil Coraza","armor-fossil","Shieldon",3,3,7,380,"🛡️"],["cover","Fósil Tapa","cover-fossil","Tirtouga",3,3,7,380,"🐢"],
  ["plume","Fósil Pluma","plume-fossil","Archen",3,3,7,380,"🪶"],["jaw","Fósil Mandíbula","jaw-fossil","Tyrunt",3,3,5,420,"🦖"],
  ["sail","Fósil Aleta","sail-fossil","Amaura",3,3,5,420,"🦕"],
  ["bird","Fósil Pájaro","fossilized-bird","a",3,2,6,300,"🐦"],["fish","Fósil Pez","fossilized-fish","a",3,2,6,300,"🐟"],
  ["drake","Fósil Dragón","fossilized-drake","b",3,2,6,300,"🐉"],["dino","Fósil Plesio","fossilized-dino","b",3,2,6,300,"🦕"]];
const FOSK={};FOSD.forEach(f=>FOSK[f[0]]=f);
// los fósiles de Galar se combinan de dos en dos, como en los juegos
const FOSC={"bird+drake":"Dracozolt","bird+dino":"Arctozolt","fish+drake":"Dracovish","fish+dino":"Arctovish"};
const FOS_MS=10*60000,FOS_SH=300;
function fosAdd(k,n){if(!FOSK[k])return;S.fos=S.fos||{};S.fos[k]=(S.fos[k]||0)+n;if(S.fos[k]<=0)delete S.fos[k]}
const fosN=k=>(S.fos&&S.fos[k])|0;
function fosIco(k,s){const f=FOSK[k];if(!f)return "";
  return '<img class="fosimg" src="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/'+f[2]+'.png" width="'+s+'" height="'+s+'" alt="" loading="lazy" onerror="this.outerHTML=\'<span class=&quot;fosemo&quot; style=&quot;font-size:'+Math.round(s*.62)+'px&quot;>'+f[8]+'</span>\'">'}

// ---------------- minijuego ----------------
// tesoros pequeños que pueden salir junto a los fósiles
const FOSX=[["red","Esfera roja",1,1,40,{t:20000}],["blu","Esfera azul",1,1,40,{t:20000}],["nug","Pepita",2,1,90,{t:60000}],["bone","Hueso Raro",3,1,110,{t:90000}]];
const fosEnt=f=>[f[0],f[1],f[4],f[5],f[7],{fos:f[0]}];
const G_FOS={id:"fos",n:"Cazafósiles",ic:"🦴",c:"#6b7a3a",d:"Excava una pared llena de fósiles. Desentiérralos sin que se derrumbe y llévalos al Laboratorio para revivir Pokémon prehistóricos, ¡como en los juegos!",
  rw:s=>s*120,
  start(B,end){
    const pick=()=>{const t=FOSD.reduce((a,f)=>a+f[6],0);let x=Math.random()*t;for(const f of FOSD){x-=f[6];if(x<=0)return f}return FOSD[0]};
    const must=[fosEnt(pick())];if(Math.random()<.3)must.push(fosEnt(pick()));
    const extra=Math.floor(Math.random()*3),pool=FOSX;
    excRun(B,end,{pool:pool,weights:[3,3,2,1],must:must,want:must.length+extra,art:e=>FOSK[e[0]]?'<span class="exfoss">'+fosIco(e[0],64)+'</span>':exArt(e)});
    const h=B.querySelector(".whohd span");if(h)h.innerHTML='🦴 Hallazgos: <b id="exF">0</b>/'+(must.length+extra);
  },
  after(score,prize){return excAfter(score,prize,"🦴 Hallazgos")}};
MGS.push(G_FOS);
document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("[data-fosgo]");if(a){e.preventDefault();mgClose();hubOpen("mg","fosP")}});

// ---------------- laboratorio ----------------
nxPanel("fosP","🧪 Laboratorio de fósiles","Mete un fósil en la máquina y en unos minutos revivirá el Pokémon que guardaba. Los fósiles de Galar (Pájaro, Pez, Dragón y Plesio) se combinan de dos en dos. Consigue fósiles en el minijuego Cazafósiles o en la Excavación subterránea.");
{const g=HUB.find(x=>x.k==="mg");if(g&&!g.tabs.some(t=>t[0]==="fosP"))g.tabs.push(["fosP","Laboratorio de fósiles"]);HUBP.fosP="mg";HUBR.fosP=()=>fosUI()}
let FOSSEL=null,_fosT=0;
const fosLab=()=>S.fosLab||null,fosDone=()=>{const l=fosLab();return !!l&&Date.now()>=l.at+FOS_MS};
function fosUI(){
  const box=$("fosPB");if(!box)return;const L=fosLab(),inv=FOSD.filter(f=>fosN(f[0])>0);
  let h='<div class="foslab"><div class="fosmach'+(L?(fosDone()?' ready':' busy'):'')+'"><div class="fostube">'+
    (L?(fosDone()?'<div class="fosmon">'+ico(PM[L.n],96,false,!!L.sh)+'</div>':'<div class="fosin">'+L.k.split("+").map(k=>fosIco(k,48)).join("")+'</div><div class="fosbub"></div>'):'<div class="fosempty">Vacía</div>')+
    '</div><div class="fosinfo">'+
    (L?(fosDone()?'<b>¡'+esc(L.n)+' ha revivido!</b><button class="red" data-fosc="1">Recoger</button>':'<b>Reviviendo '+L.k.split("+").map(k=>FOSK[k][1]).join(" + ")+'…</b><div class="nxbar"><i id="fosBar"></i></div><small class="mut" id="fosLeft"></small>'):
      '<b>La máquina está libre</b><small class="mut">'+(inv.length?'Elige un fósil de tu colección para revivirlo.':'No tienes fósiles. ¡Juega a Cazafósiles para conseguirlos!')+'</small>')+
    '</div></div>';
  h+='<h3 class="shh">🦴 Tus fósiles</h3>'+(inv.length?'<div class="fosinv">'+inv.map(f=>{const half=f[3].length===1,sel=FOSSEL&&FOSSEL.includes(f[0]);
    return '<button class="fosc'+(sel?' on':'')+'" data-fosk="'+f[0]+'"'+(L?' disabled':'')+'>'+fosIco(f[0],56)+'<b>'+f[1]+'</b><small class="mut">'+(half?'Se combina con '+(f[3]==="a"?'Dragón o Plesio':'Pájaro o Pez'):'Revive a '+esc(f[3]))+'</small><span class="fosq">×'+fosN(f[0])+'</span></button>'}).join("")+'</div>':'<p class="mut">Todavía no tienes ningún fósil.</p><button class="red" data-mgo="fos">🦴 Jugar a Cazafósiles</button>');
  if(FOSSEL&&!L){const t=fosTarget(FOSSEL);
    h+='<div class="fosgo">'+(t?'<span>'+FOSSEL.map(k=>fosIco(k,36)).join(" + ")+' → <b>'+esc(t)+'</b></span><button class="red" data-fosr="1">🧪 Revivir</button>':'<span class="mut">Elige otra mitad para combinar con el '+FOSK[FOSSEL[0]][1]+'.</span>')+'<button class="alt" data-fosx="1">Cancelar</button></div>'}
  box.innerHTML=h+'</div>';fosTick();
}
function fosTarget(sel){if(!sel||!sel.length)return null;if(sel.length===1){const f=FOSK[sel[0]];return f[3].length>1?f[3]:null}
  const a=sel.find(k=>FOSK[k][3]==="a"),b=sel.find(k=>FOSK[k][3]==="b");return a&&b?FOSC[a+"+"+b]:null}
function fosTick(){const L=fosLab(),bar=$("fosBar");if(!L||!bar)return;const k=Math.min(1,(Date.now()-L.at)/FOS_MS);bar.style.width=(k*100)+"%";
  const left=Math.max(0,L.at+FOS_MS-Date.now()),m=Math.floor(left/60000),s=Math.floor(left%60000/1000);const t=$("fosLeft");if(t)t.textContent="Faltan "+m+" min "+String(s).padStart(2,"0")+" s";if(k>=1)fosUI()}
setInterval(()=>{if(nxOpen("fosP"))fosTick()},1000);
document.addEventListener("click",e=>{
  const t=e.target;if(!t.closest||!t.closest("#fosPB"))return;
  const c=t.closest("[data-fosk]");if(c&&!fosLab()){const k=c.dataset.fosk,f=FOSK[k];snd("ui");
    if(f[3].length>1)FOSSEL=[k];
    else if(FOSSEL&&FOSSEL.length===1&&FOSK[FOSSEL[0]][3].length===1&&FOSK[FOSSEL[0]][3]!==f[3])FOSSEL=[FOSSEL[0],k];
    else FOSSEL=[k];
    fosUI();return}
  if(t.closest("[data-fosx]")){FOSSEL=null;snd("ui");fosUI();return}
  if(t.closest("[data-fosr]")){const sel=FOSSEL,n=fosTarget(sel);if(!n||fosLab()||!sel.every(k=>fosN(k)>0))return;
    sel.forEach(k=>fosAdd(k,-1));S.fosLab={k:sel.join("+"),n:n,at:Date.now(),sh:Math.random()<1/FOS_SH};FOSSEL=null;save();snd("lvl");toast("🧪 La máquina ha empezado a revivir el fósil. ¡Vuelve en 10 minutos!");fosUI();return}
  if(t.closest("[data-fosc]"))fosCollect();
});
async function fosCollect(){
  const L=fosLab();if(!L||!fosDone()||_fosT)return;if(fcd){toast("Termina el combate primero.");return}_fosT=1;
  S.fosLab=null;const n=L.n,isNew=giveMon(n,5,L.sh);qEv("cap");save();
  const m=nxModal('<div class="hatch fosrev"><div class="fosflash">'+L.k.split("+").map(k=>fosIco(k,72)).join("")+'</div></div><h3 id="fsT">¡La máquina está funcionando!</h3><p class="mut" id="fsD">Bzzzt…</p><button id="fsOk" hidden>¡Genial!</button>');
  const w=m.querySelector(".fosflash");
  if(!hubCalm()){for(let k=0;k<3;k++){snd("click");await w.animate([{transform:"scale(1)",filter:"brightness(1)"},{transform:"scale(1.08)",filter:"brightness(1.8)"},{transform:"scale(1)",filter:"brightness(1)"}],{duration:420}).finished}snd("flash")}
  m.querySelector(".hatch").innerHTML='<div class="hmon">'+ico(PM[n],120,false,!!L.sh)+'</div>';snd("lvl");setTimeout(()=>{try{cry(n)}catch(e){}},200);
  $("fsT").textContent=(L.sh?"✨ ":"")+"¡Has revivido a "+n+"!";
  $("fsD").innerHTML=(isNew?'<b>¡Nuevo en tu Pokédex!</b> ':'')+(L.sh?'<b>¡Es variocolor!</b> ':'')+'Lo encontrarás en tu colección.';
  const ok=$("fsOk");ok.hidden=false;ok.focus();await new Promise(r=>{ok.onclick=r});nxModalClose();_fosT=0;render();fosUI();
}
// aviso en el menú cuando hay un Pokémon listo para recoger
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{if(fosDone())o.mg=(o.mg||0)+1}catch(e){}return o}}
