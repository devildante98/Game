// =====================================================================================
// MINIJUEGOS NUEVOS: Puzle de sprites y Más o menos
// =====================================================================================
const mgImgSrc=p=>{const m=/src="([^"]+)"/.exec(icoHD(p,256,false,false));return m?m[1]:""};

// ---------------- PUZLE DE SPRITES: recompón la imagen de un Pokémon intercambiando piezas ----------------
const PZ_SIZES=[3,4,5,6,7,8,10];
const G_PUZ={id:"puz",n:"Puzle de sprites",ic:"🧩",c:"#d8456f",d:"Recompón la imagen de un Pokémon intercambiando sus piezas. Elige de 9 a 100 piezas: cuantas más, más puntos.",
  rw:s=>s*45,
  start(B,end){
    const pick=()=>{
      B.innerHTML='<div class="pzpick"><h3>¿Cuántas piezas?</h3><div class="pzsz">'+PZ_SIZES.map(n=>'<button data-pzn="'+n+'"><b>'+(n*n)+'</b><small>'+n+'×'+n+'</small><i>×'+(n*n*40>=1000?fmt(n*n*40):n*n*40)+' pts</i></button>').join("")+'</div><small class="mut">Toca dos piezas para intercambiarlas, o arrastra una encima de otra. Las piezas bien colocadas se quedan fijas en verde.</small></div>';
      B.querySelectorAll("[data-pzn]").forEach(b=>b.onclick=()=>{snd("ui");play(+b.dataset.pzn)})};
    const play=N=>{
      const pool=P.filter(p=>p[2]!=="M");let mon=pool[Math.floor(Math.random()*pool.length)],src=mgImgSrc(mon),tries=0;
      const T=N*N;let ord=[...Array(T).keys()];
      // barajar sin dejar demasiadas piezas ya en su sitio
      do{for(let i=T-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}}while(ord.filter((v,i)=>v===i).length>Math.max(1,T*.08));
      const minSw=(()=>{const seen=new Array(T).fill(false);let c=0;for(let i=0;i<T;i++){if(seen[i])continue;let j=i;while(!seen[j]){seen[j]=true;j=ord[j]}c++}return T-c})();
      let moves=0,sel=-1,t0=performance.now(),done=false;
      B.innerHTML='<div class="whohd"><span>🧩 <b>'+T+'</b> piezas</span><span>⏱️ <b id="pzT">0:00</b></span><span>🔄 <b id="pzM">0</b></span><span>✅ <b id="pzOk">0</b>/'+T+'</span></div>'+
        '<div class="pzwrap"><div class="pzb" id="pzB" style="--n:'+N+';--c1:'+(TC[tys(mon)[0]]||"#4a6ae0")+';--c2:'+(TC[tys(mon)[1]||"fairy"]||"#ff8ad8")+'"></div><img class="pzref" id="pzRef" alt=""></div>'+
        '<div class="mgbtns"><button class="alt" id="pzPeek">👁️ Ver la imagen (mantén pulsado)</button></div>';
      const box=$("pzB"),ref=$("pzRef");
      const draw=()=>{let ok=0;box.innerHTML=ord.map((v,i)=>{const good=v===i;if(good)ok++;const x=v%N,y=Math.floor(v/N);
          return '<div class="pzp'+(good?' ok':'')+(i===sel?' sel':'')+'" data-pz="'+i+'" style="--img:url(\''+src+'\');background-position:'+(N>1?x*100/(N-1):0)+'% '+(N>1?y*100/(N-1):0)+'%"></div>'}).join("");
        $("pzOk").textContent=ok;$("pzM").textContent=moves;return ok};
      const im=new Image();im.onload=()=>{draw()};im.onerror=()=>{tries++;const id=(/\/(\d+)\.png/.exec(src)||[])[1];if(tries===1&&id&&typeof SPRU2!=="undefined"){src=SPRU2+"other/home/"+id+".png"}else if(tries<4){mon=pool[Math.floor(Math.random()*pool.length)];src=mgImgSrc(mon)}else{draw();return}im.src=src;ref.src=src;draw()};im.src=src;ref.src=src;draw();
      const tick=()=>{if(done)return;const s=Math.floor((performance.now()-t0)/1000),e=$("pzT");if(e)e.textContent=Math.floor(s/60)+":"+String(s%60).padStart(2,"0");MG.raf=requestAnimationFrame(tick)};MG.raf=requestAnimationFrame(tick);
      const swap=(a,b)=>{if(done||a===b||a<0||b<0||ord[a]===a||ord[b]===b)return;[ord[a],ord[b]]=[ord[b],ord[a]];moves++;sel=-1;snd(ord[a]===a||ord[b]===b?"lvl":"ui");
        const ok=draw();[a,b].forEach(i=>{if(ord[i]===i){const el=box.querySelector('[data-pz="'+i+'"]');if(el&&!hubCalm())el.animate([{transform:"scale(1.15)",filter:"brightness(1.6)"},{transform:"none",filter:"none"}],{duration:300})}});
        if(ok===T)win()};
      const win=()=>{done=true;cancelAnimationFrame(MG.raf);const t=(performance.now()-t0)/1000,par=T*3.2+8,base=T*40,eff=Math.min(1,minSw/Math.max(1,moves)),spd=Math.min(1,par/Math.max(1,t));
        const sc=Math.round(base*(.5+.5*spd)*(.6+.4*eff));mgSet(sc);box.classList.add("pzdone");snd("win");mgConfetti();try{cry(mon[0])}catch(e){}
        B.querySelector(".mgbtns").innerHTML='<p class="pzres">¡Es <b>'+esc(mon[0])+'</b>! · '+Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,"0")+' · '+moves+' cambios (mínimo '+minSw+')</p>';
        mgT(()=>end(sc),2600)};
      // tocar dos piezas o arrastrar una encima de otra
      let down=-1;
      box.addEventListener("pointerdown",e=>{const p=e.target.closest("[data-pz]");if(!p||done)return;const i=+p.dataset.pz;if(ord[i]===i)return;down=i;try{box.setPointerCapture(e.pointerId)}catch(x){}});
      box.addEventListener("pointerup",e=>{if(down<0||done)return;const el=document.elementFromPoint(e.clientX,e.clientY),p=el&&el.closest&&el.closest("[data-pz]"),i=p?+p.dataset.pz:-1,d=down;down=-1;
        if(i>=0&&i!==d){swap(d,i);return}
        if(i===d){if(sel<0){sel=d;draw()}else if(sel===d){sel=-1;draw()}else swap(sel,d)}});
      const pk=$("pzPeek"),on=()=>{ref.classList.add("on")},off=()=>{ref.classList.remove("on")};
      pk.addEventListener("pointerdown",on);["pointerup","pointerleave","pointercancel"].forEach(ev=>pk.addEventListener(ev,off));
    };
    mgSet(0);pick();
  }};

// ---------------- MÁS O MENOS: ¿el siguiente Pokémon tiene más o menos estadística? ----------------
const HL_ST=[["PS",0],["Ataque",1],["Defensa",2],["Ataque Especial",3],["Defensa Especial",4],["Velocidad",5],["Total",-1]];
const hlVal=(p,k)=>{const b=BSD[p[0]];if(!b)return 0;return k<0?b.reduce((a,x)=>a+x,0):b[k]};
const G_HL={id:"hl",n:"Más o menos",ic:"📊",c:"#3a7be0",d:"Mira la estadística base de un Pokémon y adivina si el siguiente tiene MÁS o MENOS. Acierta seguidas todas las que puedas: un fallo y se acaba.",
  rw:s=>s*110,
  start(B,end){
    const pool=P.filter(p=>p[2]!=="M"&&BSD[p[0]]);let a=pool[Math.floor(Math.random()*pool.length)],streak=0,busy=false;
    const round=()=>{
      const st=HL_ST[Math.floor(Math.random()*HL_ST.length)],va=hlVal(a,st[1]),hard=Math.min(.85,.3+streak*.05);
      // con la racha, los valores se parecen cada vez más
      let b=null;for(let g=0;g<400&&!b;g++){const c=pool[Math.floor(Math.random()*pool.length)];if(c===a)continue;const vb=hlVal(c,st[1]),r=Math.max(va,vb)/Math.max(1,Math.min(va,vb));if(Math.random()<hard&&r>(st[1]<0?1.15:1.35))continue;b=c}
      if(!b)b=pool.find(c=>c!==a);
      const T=Math.max(4500,10000-streak*400),t0=performance.now();busy=false;
      B.innerHTML='<div class="whohd"><span>🔥 Racha: <b>'+streak+'</b></span><span>📊 '+st[0]+'</span></div><div class="mgtime"><i id="hlT"></i></div>'+
        '<div class="hlvs"><div class="hlc '+a[2]+'"><div class="hlspr">'+icoHD(a,150,false,false)+'</div><b>'+esc(a[0])+'</b><small>'+tyTxt(a)+'</small><div class="hlv"><small>'+st[0]+' base</small><b>'+va+'</b></div></div>'+
        '<div class="hlmid">VS</div>'+
        '<div class="hlc '+b[2]+'"><div class="hlspr">'+icoHD(b,150,false,false)+'</div><b>'+esc(b[0])+'</b><small>'+tyTxt(b)+'</small><div class="hlv" id="hlV"><small>'+st[0]+' base</small><b>?</b></div>'+
          '<div class="hlbtn"><button class="red" data-hl="1">⬆️ Más</button><button class="alt" data-hl="-1">⬇️ Menos</button></div></div></div>'+
        '<p class="hlq">¿<b>'+esc(b[0])+'</b> tiene más o menos <b>'+st[0]+'</b> que '+esc(a[0])+'?</p>';
      const tick=()=>{if(busy)return;const k=1-(performance.now()-t0)/T,bar=$("hlT");if(bar)bar.style.width=Math.max(0,k*100)+"%";if(k<=0){pick(0);return}MG.raf=requestAnimationFrame(tick)};MG.raf=requestAnimationFrame(tick);
      const pick=dir=>{if(busy)return;busy=true;cancelAnimationFrame(MG.raf);const vb=hlVal(b,st[1]),ok=dir!==0&&(vb===va||(dir>0?vb>va:vb<va)),left=Math.max(0,1-(performance.now()-t0)/T);
        B.querySelectorAll("[data-hl]").forEach(x=>{x.disabled=true});const v=$("hlV");if(v){v.classList.add(ok?"ok":"bad");const n=v.querySelector("b"),s0=performance.now();const an=()=>{const k=Math.min(1,(performance.now()-s0)/600);n.textContent=Math.round(vb*k);if(k<1)requestAnimationFrame(an)};an()}
        if(ok){streak++;const pts=100+Math.round(left*60)+streak*10;mgSet(MG.score+pts);snd("lvl");const c=B.querySelectorAll(".hlc")[1].getBoundingClientRect();mgPop(c.left+c.width/2,c.top+30,"+"+pts,"#ffd35c");a=b;mgT(round,1400)}
        else{snd("miss");mgT(()=>end(MG.score),1900)}};
      B.querySelectorAll("[data-hl]").forEach(x=>x.onclick=()=>pick(+x.dataset.hl));
    };
    mgSet(0);round();
  }};
// teclas: flecha arriba = más, abajo = menos
document.addEventListener("keydown",e=>{if(!MG.g||MG.g.id!=="hl")return;const b=e.key==="ArrowUp"?'[data-hl="1"]':e.key==="ArrowDown"?'[data-hl="-1"]':null;if(!b)return;const x=document.querySelector("#mgB "+b);if(x&&!x.disabled){e.preventDefault();x.click()}});

MGS.push(G_PUZ,G_HL);
// entran en la rotación del Torneo semanal a partir de la semana que viene (no cambia el torneo en curso)
TOUR_ROT.push(["2026-W46","who mem dig fish thr run exc wgt fos puz hl"]);
Object.assign(MGHOW,{
  puz:["Elige de <b>9 a 100 piezas</b>: cada pieza vale <b>40 puntos</b> (con 100 piezas, hasta 4.000).","Toca dos piezas para intercambiarlas o arrastra una encima de otra. Las bien colocadas se quedan fijas en verde.","<b>Rapidez</b>: hasta la mitad de los puntos dependen de lo rápido que termines.","<b>Precisión</b>: cuantos menos cambios hagas (cerca del mínimo), más puntos.","Mantén pulsado «👁️ Ver la imagen» para mirar el Pokémon completo."],
  hl:["Se compara una estadística base oficial: PS, Ataque, Defensa, Ataque Especial, Defensa Especial, Velocidad o el Total.","Cada acierto da <b>100 puntos</b>, más <b>hasta 60</b> por rapidez, más <b>10 × tu racha</b>. Si empatan, cuenta como acierto.","Con la racha, los valores se parecen cada vez más y tienes menos tiempo.","Teclado: <b>↑</b> más, <b>↓</b> menos."]});
// =====================================================================================
// TECLAS DE RESPUESTA EN LOS MINIJUEGOS (¿Quién es ese Pokémon?, ¿Cuál pesa más?, Más o menos…)
// Cada casilla tiene su tecla (por defecto 1, 2, 3, 4) y se pueden cambiar en Ajustes → Controles.
// Solo funcionan con un minijuego abierto: no compran mejoras de la tienda ni tocan la Poké Ball.
// =====================================================================================
const CK_DEF=["1","2","3","4"],CK_SEL="[data-who],[data-wg],[data-hl]";
const ckKeys=()=>Array.isArray(O.ckeys)&&O.ckeys.length===4&&O.ckeys.every(k=>typeof k==="string"&&k)?O.ckeys:CK_DEF.slice();
const CK_RES=["escape","enter"," ","tab","shift","control","alt","meta","capslock","backspace","delete","dead","unidentified","process","arrowup","arrowdown","arrowleft","arrowright","contextmenu","os"];
function ckBtns(){const B=$("mgB"),M=$("mgM");if(!B||!M||M.hidden)return [];return [...B.querySelectorAll(CK_SEL)].filter(b=>b.offsetParent)}
// marca en cada casilla con su tecla
function ckBadges(){const K=ckKeys();ckBtns().forEach((b,i)=>{if(i>3)return;let s=b.querySelector(".ckk");if(/^mouse/.test(K[i])){if(s)s.remove();return}if(!s){s=document.createElement("span");s.className="ckk noi18n";b.appendChild(s)}const t=tkLabel(K[i]);if(s.textContent!==t)s.textContent=t})}
new MutationObserver(()=>{try{ckBadges()}catch(e){}}).observe(document.body,{childList:true,subtree:true});
window.addEventListener("keydown",e=>{
  if(window._cap||window._ckCap!=null||e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;
  const L=ckBtns();if(!L.length)return;
  // escribiendo en un campo visible (por ejemplo el chat) no se responde; un campo que se quedó con el foco detrás del minijuego no cuenta
  const t=e.target,tg=t&&t.tagName;if((tg==="INPUT"||tg==="SELECT"||tg==="TEXTAREA"||(t&&t.isContentEditable))&&t.offsetParent&&!$("mgM").contains(t))return;if(!L.length)return;const i=ckKeys().indexOf(String(e.key).toLowerCase());if(i<0)return;
  e.preventDefault();e.stopImmediatePropagation();const b=L[i];if(b&&!b.disabled){b.click();b.animate([{transform:"scale(.95)"},{transform:"none"}],140)}},true);
// ---- ajustes: cuatro casillas para cambiar las teclas ----
function ckUI(){const w=$("ckl");if(!w)return;const K=ckKeys();
  w.innerHTML=K.map((k,i)=>'<button type="button" class="ckslot'+(window._ckCap===i?' on':'')+'" data-cks="'+i+'"><small>Casilla '+(i+1)+'</small><kbd>'+(window._ckCap===i?'…':esc(tkLabel(k)))+'</kbd></button>').join("")}
function ckMsg(t){const m=$("ckmsg");if(m)m.textContent=t}
function ckInit(){const tm=$("tkmsg");if(!tm||$("ckl"))return;
  const h=document.createElement("div");h.className="ckwrap";
  h.innerHTML='<b class="cksec">🎮 Teclas de respuesta (minijuegos)</b><div id="ckl" class="ckl"></div><div class="mrow"><button type="button" id="ckreset" class="alt">Restablecer (1, 2, 3, 4)</button></div><small id="ckmsg" class="mut">Toca una casilla y pulsa la tecla (o un botón del ratón: central, derecho, atrás o adelante) que quieras para elegir esa respuesta en «¿Quién es ese Pokémon?» y los demás minijuegos de respuestas. Solo funcionan con el minijuego abierto.</small>';
  tm.after(h);ckUI();
  $("ckl").addEventListener("click",e=>{const b=e.target.closest("[data-cks]");if(!b)return;window._ckCap=+b.dataset.cks;ckUI();ckMsg("Pulsa ahora la tecla o el botón del ratón para la casilla "+(+b.dataset.cks+1)+" (Esc para cancelar)…")});
  $("ckreset").onclick=()=>{window._ckCap=null;O.ckeys=CK_DEF.slice();saveO();ckUI();ckMsg("Restablecidas a 1, 2, 3 y 4.")}}
window.addEventListener("keydown",e=>{if(window._ckCap==null)return;e.preventDefault();e.stopImmediatePropagation();
  const i=window._ckCap,k=String(e.key).toLowerCase();window._ckCap=null;
  if(k==="escape"){ckUI();ckMsg("Cancelado.");return}
  if(CK_RES.includes(k)||k.length>1&&!/^(f\d+|mouse[1-4])$/.test(k)){ckUI();ckMsg("Esa tecla está reservada (Esc, Enter, Espacio, flechas…): elige otra.");return}
  if((O.tkeys||["u"]).includes(k)){ckUI();ckMsg("Esa tecla ya la usas para tocar la Poké Ball. Elige otra o quítala de allí primero.");return}
  const K=ckKeys().slice(),j=K.indexOf(k);
  if(j>=0&&j!==i){ckUI();ckMsg("Esa tecla ya es la de la casilla "+(j+1)+".");return}
  K[i]=k;O.ckeys=K;saveO();ckUI();ckMsg("Casilla "+(i+1)+": tecla "+tkLabel(k)+".")},true);
// la tecla de la Poké Ball tampoco puede coincidir con las de respuesta
{const _tc=tkCapture;tkCapture=function(e){const k=String(e.key).toLowerCase();if(k!=="escape"&&ckKeys().includes(k)){window._cap=false;const m=$("tkmsg");if(m)m.textContent="Esa tecla ya la usas para las respuestas de los minijuegos (Ajustes → Controles). Elige otra.";return}return _tc.apply(this,arguments)}}
setTimeout(ckInit,500);setInterval(ckInit,3000);
// ---- Espacio (o Enter) para empezar la partida o jugar otra vez ----
window.addEventListener("keydown",e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||window._cap||window._ckCap!=null)return;if(e.key!==" "&&e.code!=="Space"&&e.key!=="Enter")return;
  const M=$("mgM");if(!M||M.hidden)return;const b=$("mgGo")||$("mgAg");if(!b||!b.offsetParent||b.disabled)return;
  const t=e.target,tg=t&&t.tagName;if(/INPUT|TEXTAREA|SELECT/.test(tg||""))return;
  e.preventDefault();e.stopImmediatePropagation();b.click()},true);
{const go=()=>{const b=$("mgGo");if(b&&!b.querySelector(".mgspk")){const s=document.createElement("span");s.className="mgspk";s.textContent="Espacio";b.appendChild(s)}};new MutationObserver(()=>{try{go()}catch(e){}}).observe(document.body,{childList:true,subtree:true})}
// =====================================================================================
// BOTONES DEL RATÓN como teclas (Poké Ball y respuestas de minijuegos)
// Se guardan como «mouse1» (rueda/central), «mouse2» (derecho), «mouse3» (atrás) y «mouse4» (adelante).
// El clic izquierdo no se puede asignar: es el que se usa para todo lo demás.
// =====================================================================================
const MSN={mouse1:"🖱️ Central",mouse2:"🖱️ Derecho",mouse3:"🖱️ Atrás",mouse4:"🖱️ Adelante"};
{const _tl=tkLabel;tkLabel=function(k){return MSN[k]||_tl(k)}}
const msKey=e=>e.button>0&&e.button<5?"mouse"+e.button:null;
const msUsed=k=>(O.tkeys||[]).includes(k)||ckKeys().includes(k);
// al asignar: el botón del ratón cuenta como una tecla pulsada
window.addEventListener("mousedown",e=>{const k=msKey(e);if(!k)return;
  if(window._cap){e.preventDefault();e.stopImmediatePropagation();tkCapture({key:k,preventDefault(){},stopPropagation(){}});return}
  if(window._ckCap!=null){e.preventDefault();e.stopImmediatePropagation();window.dispatchEvent(new KeyboardEvent("keydown",{key:k}));return}
  if(!msUsed(k))return;
  const t=e.target;if(t&&t.closest&&t.closest("input,textarea,select,[contenteditable]"))return;
  e.preventDefault();
  // respuestas de minijuego
  const L=ckBtns();if(L.length){const i=ckKeys().indexOf(k);if(i>=0){const b=L[i];if(b&&!b.disabled){b.click();b.animate([{transform:"scale(.95)"},{transform:"none"}],140)}}return}
  // tocar la Poké Ball (como con la tecla), fuera de combates y minijuegos
  if((O.tkeys||[]).includes(k)&&!(typeof kbFight==="function"&&kbFight())){const tr=$("train");if(tr&&(!window._u||Date.now()-window._u>=60)){window._u=Date.now();tr.click();tr.animate([{transform:"scale(.93)"},{transform:"none"}],120)}}},true);
// que los botones asignados no abran el menú del clic derecho ni vayan atrás/adelante en el navegador
["mouseup","auxclick"].forEach(t=>window.addEventListener(t,e=>{const k=msKey(e);if(k&&(msUsed(k)||window._cap||window._ckCap!=null)){e.preventDefault();e.stopPropagation()}},true));
window.addEventListener("contextmenu",e=>{if(msUsed("mouse2")||window._cap||window._ckCap!=null)e.preventDefault()},true);
