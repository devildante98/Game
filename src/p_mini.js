// =====================================================================================
// MINIJUEGOS: ¿Quién es ese Pokémon?, Memoria, Golpea al Diglett, Pesca y Lanzamiento perfecto
// Las 3 primeras partidas de cada minijuego al día dan premio; después se puede seguir jugando por el récord.
// =====================================================================================
var MG={g:null,t:[],raf:0,score:0,busy:false};
const MG_DAY=3;
function mgState(){const d=today();S.mg=S.mg||{};if(S.mg.d!==d){S.mg.d=d;S.mg.n={}}S.mg.n=S.mg.n||{};S.mg.best=S.mg.best||{};return S.mg}
const mgLeft=id=>Math.max(0,MG_DAY-(mgState().n[id]|0));
const mgT=(f,ms)=>{const h=setTimeout(f,ms);MG.t.push(h);return h};
const mgI=(f,ms)=>{const h=setInterval(f,ms);MG.t.push(h);return h};
function mgStop(){MG.t.forEach(h=>{clearTimeout(h);clearInterval(h)});MG.t=[];if(MG.raf)cancelAnimationFrame(MG.raf);MG.raf=0}
const mgPick=(a,n)=>{const c=a.slice(),o=[];while(o.length<n&&c.length)o.push(c.splice(Math.floor(Math.random()*c.length),1)[0]);return o};
const mgSet=s=>{MG.score=Math.max(0,Math.round(s));const e=$("mgSc");if(e)e.textContent=fmt(MG.score)};
function mgPop(x,y,txt,col){const b=$("mgB");if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement("span");s.className="mgpop";s.textContent=txt;s.style.left=(x-r.left)+"px";s.style.top=(y-r.top)+"px";if(col)s.style.color=col;b.appendChild(s);s.animate([{transform:"translate(-50%,-50%) scale(.6)",opacity:1},{transform:"translate(-50%,-160%) scale(1.15)",opacity:0}],{duration:800,easing:"ease-out"}).onfinish=()=>s.remove()}
function mgConfetti(){if(hubCalm())return;const b=$("mgB");if(!b)return;for(let i=0;i<40;i++){const s=document.createElement("span");s.className="mgconf";s.textContent=["🎉","✨","⭐","🎊","💥"][i%5];s.style.left=Math.random()*100+"%";b.appendChild(s);s.animate([{transform:"translateY(-20px) rotate(0)",opacity:1},{transform:"translateY("+(250+Math.random()*250)+"px) rotate("+(Math.random()*720-360)+"deg)",opacity:0}],{duration:1400+Math.random()*900,delay:Math.random()*300,easing:"ease-in"}).onfinish=()=>s.remove()}}

// ---------------- ¿QUIÉN ES ESE POKÉMON? ----------------
const G_WHO={id:"who",n:"¿Quién es ese Pokémon?",ic:"❓",c:"#2f6fd8",d:"Adivina el Pokémon por su silueta antes de que acabe el tiempo. 10 rondas.",
  rw:s=>s*60,
  start(B,end){
    let r=0,streak=0;const R=10;
    const round=()=>{
      if(r>=R){end(MG.score);return}r++;
      const pool=P.filter(p=>p[2]!=="M"),ans=pool[Math.floor(Math.random()*pool.length)],same=pool.filter(p=>p!==ans&&p[3]===ans[3]),opts=mgPick(same.length>=3?same:pool.filter(p=>p!==ans),3).concat([ans]).sort(()=>Math.random()-.5);
      B.innerHTML='<div class="whohd"><span>Ronda <b>'+r+'</b>/'+R+'</span>'+(streak>1?'<span class="whost">🔥 Racha ×'+streak+'</span>':'')+'</div><div class="whobg"><div class="whosil">'+icoHD(ans,190,false,false)+'</div><div class="whoq">¿Quién es ese Pokémon?</div></div><div class="mgtime"><i id="whoT"></i></div><div class="whoopt">'+opts.map(o=>'<button data-who="'+esc(o[0])+'">'+esc(o[0])+'</button>').join("")+'</div>';
      const T=8000,t0=performance.now(),bar=$("whoT");let done=false;
      const tick=()=>{if(done)return;const k=1-(performance.now()-t0)/T;if(bar)bar.style.width=Math.max(0,k*100)+"%";if(k<=0){pick(null);return}MG.raf=requestAnimationFrame(tick)};MG.raf=requestAnimationFrame(tick);
      const pick=name=>{
        if(done)return;done=true;cancelAnimationFrame(MG.raf);const ok=name===ans[0],left=Math.max(0,1-(performance.now()-t0)/T);
        B.querySelectorAll("[data-who]").forEach(b=>{b.disabled=true;if(b.dataset.who===ans[0])b.classList.add("ok");else if(b.dataset.who===name)b.classList.add("bad")});
        B.querySelector(".whosil").classList.add("rev");B.querySelector(".whoq").innerHTML=ok?'¡Es <b>'+esc(ans[0])+'</b>!':'Era <b>'+esc(ans[0])+'</b>';
        if(ok){streak++;const pts=100+Math.round(left*100)+(streak>2?25*(streak-2):0);mgSet(MG.score+pts);snd("lvl");const s=B.querySelector(".whosil").getBoundingClientRect();mgPop(s.left+s.width/2,s.top+s.height/2,"+"+pts,"#ffd35c");try{cry(ans[0])}catch(e){}}
        else{streak=0;snd("miss")}
        mgT(round,ok?1300:1700);
      };
      B.querySelectorAll("[data-who]").forEach(b=>b.onclick=()=>pick(b.dataset.who));
    };
    mgSet(0);round();
  }};

// ---------------- MEMORIA ----------------
const G_MEM={id:"mem",n:"Memoria Pokémon",ic:"🃏",c:"#7a4ae0",d:"Encuentra las 8 parejas con el menor número de intentos y lo más rápido posible.",
  rw:s=>s*90,
  start(B,end){
    const pk=mgPick(P.filter(p=>p[2]!=="M"),8),cards=pk.concat(pk).sort(()=>Math.random()-.5);let open=[],moves=0,pairs=0,lock=false;const t0=Date.now();
    B.innerHTML='<div class="whohd"><span>Intentos: <b id="memM">0</b></span><span>Parejas: <b id="memP">0</b>/8</span><span>⏱️ <b id="memT">0</b> s</span></div><div class="memg">'+cards.map((p,i)=>'<button class="memc" data-mi="'+i+'" aria-label="Carta"><span class="memf memb"></span><span class="memf memp '+p[2]+'">'+ico(p,64)+'</span></button>').join("")+'</div>';
    mgI(()=>{const e=$("memT");if(e)e.textContent=Math.floor((Date.now()-t0)/1000)},250);mgSet(0);
    B.querySelectorAll(".memc").forEach(c=>c.onclick=()=>{
      if(lock||c.classList.contains("up"))return;c.classList.add("up");snd("click");open.push(c);
      if(open.length<2)return;moves++;$("memM").textContent=moves;const [a,b]=open;open=[];
      if(cards[+a.dataset.mi]===cards[+b.dataset.mi]){pairs++;$("memP").textContent=pairs;snd("buff");mgT(()=>{a.classList.add("done");b.classList.add("done")},250);const r=b.getBoundingClientRect();mgPop(r.left+r.width/2,r.top,"¡Pareja!","#3ecf8e");
        if(pairs===8){const sec=(Date.now()-t0)/1000;mgSet(Math.max(100,1600-moves*40-sec*8));mgT(()=>end(MG.score),900)}}
      else{lock=true;mgT(()=>{a.classList.remove("up");b.classList.remove("up");lock=false},800)}
    });
  }};

// ---------------- GOLPEA AL DIGLETT ----------------
const G_DIG={id:"dig",n:"¡Golpea al Diglett!",ic:"🔨",c:"#c0782a",d:"Toca a los Diglett (+1) y a los Dugtrio (+3) antes de que se escondan. ¡Cuidado con Voltorb (−3)! 30 segundos.",
  rw:s=>s*2500,
  start(B,end){
    const D=PM.Diglett||P[0],T=PM.Dugtrio||D,V=PM.Voltorb||D,dur=30000,t0=Date.now();let hits=0,combo=0;
    B.innerHTML='<div class="whohd"><span>⏱️ <b id="digT">30</b> s</span><span id="digC"></span></div><div class="digg">'+[...Array(9)].map((_,i)=>'<div class="digh" data-h="'+i+'"><div class="digback"></div><div class="digclip"><div class="digm"></div></div><div class="diglip"></div></div>').join("")+'</div>';
    mgSet(0);const holes=[...B.querySelectorAll(".digh")];
    const spawn=()=>{
      const el=Date.now()-t0;if(el>=dur){holes.forEach(h=>h.querySelector(".digm").classList.remove("up"));mgT(()=>end(MG.score),600);return}
      $("digT").textContent=Math.ceil((dur-el)/1000);
      const free=holes.filter(h=>!h.querySelector(".digm").classList.contains("up"));
      if(free.length){const h=free[Math.floor(Math.random()*free.length)],m=h.querySelector(".digm"),r=Math.random(),k=r<.15?"t":r<.3&&el>4000?"v":"d",p=k==="t"?T:k==="v"?V:D;
        m.innerHTML=ico(p,88);m.dataset.k=k;m.classList.remove("hit");m.classList.add("up");const up=Math.max(520,1050-el/45);
        mgT(()=>{if(m.classList.contains("up")&&!m.classList.contains("hit")){m.classList.remove("up");if(k!=="v")combo=0;$("digC").textContent=""}},up)}
      mgT(spawn,Math.max(330,780-el/60));
    };
    holes.forEach(h=>h.addEventListener("pointerdown",e=>{const m=h.querySelector(".digm");if(!m.classList.contains("up")||m.classList.contains("hit"))return;m.classList.add("hit");
      const k=m.dataset.k;let pts=k==="t"?3:k==="v"?-3:1;
      if(k==="v"){combo=0;snd("hit",1);h.animate([{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"none"}],{duration:180,iterations:2})}else{combo++;hits++;snd("pop");if(combo>=5)pts+=1}
      mgSet(MG.score+pts);mgPop(e.clientX,e.clientY,(pts>0?"+":"")+pts+(k==="v"?" 💥":""),pts>0?"#ffd35c":"#ff5a5a");$("digC").textContent=combo>=5?"🔥 Combo ×"+combo:"";
      mgT(()=>m.classList.remove("up"),180)}));
    spawn();
  }};

// ---------------- PESCA ----------------
const FISH=[["Magikarp",40],["Goldeen",18],["Poliwag",14],["Tentacool",12],["Horsea",9],["Staryu",8],["Chinchou",7],["Remoraid",6],["Feebas",4],["Lapras",2],["Gyarados",1.4],["Dratini",1.2]].filter(f=>PM[f[0]]);
const G_FISH={id:"fish",n:"Pesca",ic:"🎣",c:"#1e88c8",d:"Lanza la caña y pulsa en cuanto pique (¡!). Cuanto más raro el Pokémon, menos tiempo tienes. Los raros pueden quedarse contigo.",
  rw:s=>s*700,
  start(B,end){
    let cast=0,st="idle";const N=8,caught=[];
    B.innerHTML='<div class="whohd"><span>Lanzamientos: <b id="fiN">0</b>/'+N+'</span><span id="fiC"></span></div><div class="fiw" id="fiW"><div class="fisky"></div><div class="fiwater"><div class="fiwave"></div></div><div class="filine" id="fiL"></div><div class="fibob" id="fiB"></div><div class="fiex" id="fiE" hidden>¡!</div><div class="fimsg" id="fiM">Pulsa «Lanzar» para empezar</div><div class="ficatch" id="fiK"></div></div><div class="fibtns"><button class="red big" id="fiGo">🎣 Lanzar</button></div><div class="fibag" id="fiG"></div>';
    mgSet(0);const W=$("fiW"),bob=$("fiB"),ex=$("fiE"),msg=$("fiM"),go=$("fiGo");let bite=0,win=0,fish=null;
    const pickFish=()=>{const t=FISH.reduce((a,f)=>a+f[1],0);let x=Math.random()*t;for(const f of FISH){x-=f[1];if(x<=0)return PM[f[0]]}return PM[FISH[0][0]]};
    const reset=()=>{st="idle";ex.hidden=true;bob.className="fibob";go.textContent=cast>=N?"🏁 Ver resultado":"🎣 Lanzar";go.disabled=false};
    const doCast=()=>{
      if(cast>=N){end(MG.score);return}
      cast++;$("fiN").textContent=cast;st="wait";go.textContent="✋ ¡Tirar!";msg.textContent="Esperando a que pique…";snd("throw");bob.className="fibob in";fish=pickFish();
      // amagos antes de picar de verdad
      const wait=1600+Math.random()*3800;let t=600;while(t<wait-500){const q=t;mgT(()=>{if(st==="wait"){bob.classList.remove("nib");void bob.offsetWidth;bob.classList.add("nib");snd("click")}},q);t+=500+Math.random()*900}
      mgT(()=>{if(st!=="wait")return;st="bite";bite=performance.now();win=fish[2]==="C"?900:fish[2]==="R"?620:430;ex.hidden=false;bob.className="fibob bite";snd("flash");msg.textContent="¡Ha picado!";
        mgT(()=>{if(st==="bite"){st="miss";ex.hidden=true;msg.textContent="Se ha escapado… ¡Has tardado demasiado!";snd("miss");mgT(reset,1100)}},win)},wait);
    };
    const pull=()=>{
      if(st==="idle"){doCast();return}
      if(st==="wait"){st="miss";msg.textContent="¡Demasiado pronto! Has asustado a los peces.";snd("miss");bob.className="fibob";mgT(reset,1100);return}
      if(st==="bite"){st="got";const rt=performance.now()-bite,p=fish,base={C:10,R:30,E:90,L:150}[p[2]]||10,bonus=Math.max(0,Math.round((1-rt/win)*base*.5)),pts=base+bonus;
        ex.hidden=true;bob.className="fibob";mgSet(MG.score+pts);snd("capok");caught.push(p);
        const k=$("fiK");k.innerHTML=ico(p,96);k.classList.remove("jump");void k.offsetWidth;k.classList.add("jump");
        msg.innerHTML='¡Has pescado un <b>'+esc(p[0])+'</b>! '+STAR[p[2]]+' <b>+'+pts+'</b>'+(rt<200?' ⚡ ¡Reflejos de campeón!':'');
        $("fiG").innerHTML=caught.map(c=>'<span class="'+c[2]+'">'+ico(c,40)+'</span>').join("");mgT(reset,1500)}
    };
    go.onclick=pull;W.addEventListener("pointerdown",e=>{if(st==="bite"||st==="wait")pull()});
    MG.fish=caught;
  },
  after(score){// los Pokémon raros que pesques se quedan contigo (uno por partida)
    const best=(MG.fish||[]).filter(p=>p[2]!=="C").sort((a,b)=>"CREML".indexOf(b[2])-"CREML".indexOf(a[2]))[0];
    if(!best)return "";const lv=clampL(Math.min(lvCap(),leadLevel())-3),isNew=giveMon(best[0],lv,Math.random()<SHINY_W*2);save();render();
    return '<div class="mgget">'+ico(best,56)+'<span>¡<b>'+esc(best[0])+'</b> se queda contigo!'+(isNew?' <b class="mgnew">¡NUEVO!</b>':'')+'</span></div>';
  }};

// ---------------- LANZAMIENTO PERFECTO ----------------
const G_THR={id:"thr",n:"Lanzamiento perfecto",ic:"🎯",c:"#e63950",d:"Lanza la Poké Ball cuando el círculo sea pequeño y el Pokémon esté en el centro. ¡Excelente, Genial o Bien! 10 lanzamientos.",
  rw:s=>s*90,
  start(B,end){
    let n=0,combo=0,busy=false;const N=10;
    B.innerHTML='<div class="whohd"><span>Lanzamiento <b id="thN">1</b>/'+N+'</span><span id="thC"></span></div><div class="thw" id="thW"><div class="thgr"></div><div class="thmon" id="thMon"><div class="thring" id="thR"></div><div class="thspr" id="thS"></div></div><div class="thball" id="thB"></div><div class="thmsg" id="thM">¡Toca para lanzar!</div></div>';
    mgSet(0);const W=$("thW"),mon=$("thMon"),ring=$("thR"),spr=$("thS"),ball=$("thB"),msg=$("thM");let p=null,t0=0,amp=0,per=1500,spd=1;
    const next=()=>{if(n>=N){end(MG.score);return}n++;$("thN").textContent=n;const pool=P.filter(x=>x[2]!=="M");p=pool[Math.floor(Math.random()*pool.length)];spr.innerHTML=ico(p,96);spr.style.opacity=1;amp=n<=3?0:Math.min(110,(n-3)*18);per=Math.max(700,1500-n*70);spd=.6+n*.08;t0=performance.now();busy=false;ball.className="thball";msg.textContent=amp?"¡Se mueve! Espera a que pase por el centro…":"¡Toca para lanzar!";loop()};
    const st=()=>{const t=performance.now()-t0,k=(t%per)/per,sc=1-.78*k,x=amp*Math.sin(t/1000*spd*3.2);return{sc:sc,x:x}};
    const loop=()=>{const s=st();ring.style.transform="translate(-50%,-50%) scale("+s.sc.toFixed(3)+")";ring.style.borderColor=s.sc<.45?"#3ecf8e":s.sc<.7?"#ffd35c":"#ff8a3c";mon.style.transform="translateX("+s.x.toFixed(1)+"px)";MG.raf=requestAnimationFrame(loop)};
    const throwB=async()=>{
      if(busy||!p)return;busy=true;const s=st();cancelAnimationFrame(MG.raf);snd("throw");
      const hit=Math.abs(s.x)<34,q=s.sc<.45?["¡Excelente!",100,"#3ecf8e"]:s.sc<.7?["¡Genial!",60,"#ffd35c"]:["¡Bien!",30,"#ff8a3c"];
      const wr=W.getBoundingClientRect(),mr=mon.getBoundingClientRect(),tx=hit?mr.left+mr.width/2-wr.left:wr.width/2+(s.x>0?-60:60),ty=mr.top+mr.height/2-wr.top;
      ball.style.left=tx+"px";ball.style.top=ty+"px";
      if(!hubCalm())await ball.animate([{transform:"translate(calc(-50% + "+(wr.width/2-tx)+"px),"+(wr.height-ty-40)+"px) scale(1.4) rotate(0)"},{transform:"translate(-50%,-140%) scale(.9) rotate(540deg)",offset:.6},{transform:"translate(-50%,-50%) scale(.7) rotate(720deg)"}],{duration:520,easing:"cubic-bezier(.3,.6,.4,1)"}).finished;
      if(!hit){ball.className="thball miss";combo=0;$("thC").textContent="";msg.textContent="¡Fallaste! El Pokémon se movió.";snd("miss");mgT(next,1100);return}
      ball.className="thball in";spr.style.opacity=0;snd("open");combo++;const pts=q[1]+(combo>=3?(combo-2)*10:0);mgSet(MG.score+pts);
      mgPop(mr.left+mr.width/2,mr.top,q[0]+" +"+pts,q[2]);$("thC").textContent=combo>=3?"🔥 Combo ×"+combo:"";msg.textContent=q[0];
      await new Promise(r=>mgT(r,500));snd("capok");ball.className="thball ok";mgT(next,800);
    };
    W.addEventListener("pointerdown",throwB);next();
  }};

const MGS=[G_WHO,G_MEM,G_DIG,G_FISH,G_THR];

// ---------------- ventana del minijuego ----------------
function mgOpen(id){
  const g=MGS.find(x=>x.id===id);if(!g)return;if(fcd){toast("Termina el combate primero.");return}
  hubClose();mgStop();MG.g=g;MG.score=0;MG.fish=null;
  let m=$("mgM");if(!m){m=document.createElement("div");m.id="mgM";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");document.body.appendChild(m)}
  m.style.setProperty("--mc",g.c);
  m.innerHTML='<div class="mgw"><div class="mgh"><span class="mgic">'+g.ic+'</span><b>'+g.n+'</b><span class="mgsc">⭐ <b id="mgSc">0</b></span><button class="mgx" aria-label="Salir del minijuego">✕</button></div><div class="mgb" id="mgB"></div></div>';
  m.hidden=false;m.querySelector(".mgx").onclick=mgClose;
  const left=mgLeft(id),best=mgState().best[id]|0;
  $("mgB").innerHTML='<div class="mgintro"><div class="mgbig">'+g.ic+'</div><h3>'+g.n+'</h3><p>'+g.d+'</p><div class="mginf"><span>🏆 Récord: <b>'+fmt(best)+'</b></span><span>🎁 Partidas con premio hoy: <b>'+left+'/'+MG_DAY+'</b></span></div><button class="red big" id="mgGo">▶ ¡Jugar!</button>'+(left?'':'<small class="mut">Hoy ya has ganado todos los premios de este minijuego, pero puedes seguir jugando para batir tu récord.</small>')+'</div>';
  $("mgGo").onclick=()=>{snd("ui");g.start($("mgB"),mgEnd)};
  m.querySelector(".mgw").animate([{transform:"scale(.85)",opacity:0},{transform:"none",opacity:1}],{duration:240,easing:"cubic-bezier(.2,.9,.3,1.2)"});
}
function mgClose(){mgStop();const m=$("mgM");if(m){m.hidden=true;m.innerHTML=""}MG.g=null;try{if(nxOpen("mgP"))mgUI()}catch(e){}}
function mgEnd(score){
  const g=MG.g;if(!g)return;mgStop();score=Math.max(0,Math.round(score));const st=mgState(),old=st.best[g.id]|0,rec=score>old&&score>0,left=mgLeft(g.id);
  if(rec)st.best[g.id]=score;let rw=null,extra="";
  if(left>0&&score>0){st.n[g.id]=(st.n[g.id]|0)+1;rw={t:Math.min(400000,Math.round(g.rw(score)))*(typeof hhMul==="function"?hhMul("mg"):1),it:{}};
    const q=Math.random();if(q<.12)rw.it.ub=1;else if(q<.35)rw.it.sb=2;else if(q<.5)rw.it.pot=2;
    if(rec&&old>0&&Math.random()<.25)rw.it.cand=1;grant(rw)}
  if(g.after)extra=g.after(score,!!rw)||"";
  if(typeof tourSubmit==="function")try{extra+=tourSubmit(g.id,score)||""}catch(e){}
  if(typeof mgrSubmit==="function")try{extra+=mgrSubmit(g.id,score)||""}catch(e){}
  qEv("mg");save();render();
  if(rec){snd("lvl");setTimeout(()=>snd("win"),400);mgConfetti()}else snd("win");
  $("mgB").innerHTML='<div class="mgintro"><div class="mgbig">'+(rec?"🏆":g.ic)+'</div><h3>'+(rec?"¡Nuevo récord!":"¡Partida terminada!")+'</h3><div class="mgfinal">'+fmt(score)+'<small>puntos</small></div>'+
    (rw?'<p>Premio: <b>'+rwTxt(rw)+'</b></p>':'<p class="mut">'+(score>0?'Hoy ya no quedan premios en este minijuego.':'¡Sin puntos esta vez!')+'</p>')+extra+
    '<div class="mginf"><span>🏆 Récord: <b>'+fmt(st.best[g.id]|0)+'</b></span><span>🎁 Premios hoy: <b>'+mgLeft(g.id)+'/'+MG_DAY+'</b></span></div><div class="mgbtns"><button class="red big" id="mgAg">🔁 Otra vez</button><button class="alt" id="mgBk">Volver a los minijuegos</button></div></div>';
  $("mgAg").onclick=()=>{MG.score=0;mgSet(0);MG.fish=null;g.start($("mgB"),mgEnd)};$("mgBk").onclick=()=>{mgClose();hubOpen("mg")};
}
document.addEventListener("keydown",e=>{if(e.key==="Escape"){const m=$("mgM");if(m&&!m.hidden)mgClose()}});

// ---------------- panel y accesos ----------------
nxPanel("mgP","🎮 Minijuegos","¡Juega, bate tus récords y gana tickets y objetos! Cada minijuego da premio en sus 3 primeras partidas del día.");
if(!HUB.some(x=>x.k==="mg"))HUB.splice(HUB.findIndex(x=>x.k==="act")+1,0,{k:"mg",n:"Minijuegos",ic:"🎮",c:"#e0447a",d:"¡Juega y gana premios!",tabs:[["mgP","Minijuegos"]]});
HUBP.mgP="mg";HUBR.mgP=()=>mgUI();
function mgUI(){
  const box=$("mgPB");if(!box)return;const st=mgState();
  box.innerHTML='<div class="mggrid">'+MGS.map(g=>{const l=mgLeft(g.id);return '<button class="mgcard" data-mgo="'+g.id+'" style="--mc:'+g.c+'"><span class="mgcic">'+g.ic+'</span><b>'+g.n+'</b><small>'+g.d+'</small><span class="mgcf"><span>🏆 '+fmt(st.best[g.id]|0)+'</span><span class="'+(l?'on':'')+'">🎁 '+l+'/'+MG_DAY+'</span></span><span class="mgplay">▶ Jugar</span></button>'}).join("")+'</div>';
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-mgo]");if(b){snd("ui");mgOpen(b.dataset.mgo)}});
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{const n=MGS.filter(g=>mgLeft(g.id)>0).length;if(n)o.mg=n}catch(e){}return o}}
// anuncio llamativo en la página principal
(function(){const ep=$("earnP");if(!ep||$("mgBan"))return;const d=document.createElement("button");d.id="mgBan";d.type="button";
  d.innerHTML='<span class="mgbi">🎮</span><span class="mgbt"><b>¡Minijuegos!</b><small>¿Quién es ese Pokémon?, Pesca, Diglett… ¡gana tickets jugando!</small></span><span class="mgbg">JUGAR ▶</span>';
  d.onclick=()=>{snd("ui");hubOpen("mg")};const h=ep.querySelector("h2");if(h)h.after(d);else ep.prepend(d)})();
