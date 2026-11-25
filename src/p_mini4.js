// =====================================================================================
// MINIJUEGOS NUEVOS (8.0): Ekans hambriento, Lluvia de bayas (3D), Vuelo de Pidgeot (3D) y Cueva oscura
// Mismo sistema que los demás: 3 partidas con premio al día (las calcula el servidor), récord, clasificación semanal y
// azar común (la partida n.º k de la semana es igual para todos: mgR). No entran en la rotación del torneo semanal.
// =====================================================================================
// ---------- utilidades comunes ----------
// teclas mientras dura la partida (no se activan si estás escribiendo); devuelve la función que las quita
function m4Keys(down,up){const t=e=>{const el=e.target;return !!(el&&el.closest&&el.closest("input,textarea,select,[contenteditable]")&&el.getClientRects().length&&!el.closest("#mgM"))};
  const d=e=>{if(t(e)||!$("mgM")||$("mgM").hidden)return;if(down(e)===true)e.preventDefault()},u=e=>{if(t(e))return;if(up&&up(e)===true)e.preventDefault()};
  document.addEventListener("keydown",d,true);document.addEventListener("keyup",u,true);return()=>{document.removeEventListener("keydown",d,true);document.removeEventListener("keyup",u,true)}}
// lienzo que se adapta a su caja (con la densidad de píxeles de la pantalla)
function m4Fit(cv,cb){const f=()=>{const r=cv.getBoundingClientRect();if(!r.width)return;const dpr=Math.min(2,window.devicePixelRatio||1);cb(Math.max(200,r.width),Math.max(160,r.height),dpr)};
  let ro=null;try{ro=new ResizeObserver(f);ro.observe(cv)}catch(e){addEventListener("resize",f)}f();return()=>{try{ro&&ro.disconnect()}catch(e){}removeEventListener("resize",f)}}
const m4Img=p=>{const i=new Image();i.decoding="async";if(p)i.src=mgImgSrc(p);return i};
const m4Ready=(L,ms)=>Promise.race([Promise.all(L.filter(i=>i&&i.src&&!(i.complete&&i.naturalWidth)).map(i=>new Promise(r=>{i.addEventListener("load",r,{once:true});i.addEventListener("error",r,{once:true})}))),new Promise(r=>setTimeout(r,ms||4000))]);
const m4Ok=i=>i&&i.complete&&i.naturalWidth>0;
// texto flotante encima del lienzo (x, y en píxeles del lienzo)
function m4Pop(cv,x,y,txt,col){const r=cv.getBoundingClientRect();mgPop(r.left+x,r.top+y,txt,col)}
// corazones de vidas
const m4Hearts=(n,max)=>Array.from({length:max},(_,i)=>i<n?"❤️":"🖤").join("");
// botones que se mantienen pulsados (móvil): on(true) al pulsar, on(false) al soltar
function m4Hold(b,on){if(!b)return;const dn=e=>{e.preventDefault();on(true)},upf=e=>{on(false)};b.addEventListener("pointerdown",dn);b.addEventListener("pointerup",upf);b.addEventListener("pointerleave",upf);b.addEventListener("pointercancel",upf)}

// ================= EKANS HAMBRIENTO =================
const EKN_C=17,EKN_R=15,EKN_T=120;
const G_EKN={id:"ekn",n:"Ekans hambriento",ic:"🐍",c:"#8e44ad",d:"Guía a Ekans por la hierba y cómete todas las bayas que puedas sin chocar con las rocas ni con tu propia cola.",
  dl:"Guía a Ekans por la pradera y cómete las bayas: cada una lo hace más largo y más rápido. Las Bayas Frambu doradas valen el cuádruple, pero desaparecen pronto. Con el tiempo salen rocas: si chocas con ellas, con el borde o con tu propia cola, se acaba. Tienes 2 minutos. Flechas o WASD para girar; en el móvil, desliza o usa los botones.",
  rw:s=>s*400,
  start(B,end){
    B.innerHTML='<div class="whohd"><span>🍇 <b id="ekN">0</b></span><span>⏱️ <b id="ekT">'+EKN_T+'</b> s</span><span id="ekL" class="mut">Largo 4</span></div>'+
      '<div class="m4w ekw"><canvas id="ekC"></canvas><div class="rumsg" id="ekM">Pulsa una flecha o desliza para empezar</div></div>'+
      '<div class="m4pad"><button type="button" class="alt" data-ek="u" aria-label="Arriba">▲</button><div><button type="button" class="alt" data-ek="l" aria-label="Izquierda">◀</button><button type="button" class="alt" data-ek="d" aria-label="Abajo">▼</button><button type="button" class="alt" data-ek="r" aria-label="Derecha">▶</button></div></div>'+
      '<small class="mut m4keys">Flechas o WASD: girar · En el móvil: desliza sobre la pradera o usa los botones</small>';
    const cv=$("ekC"),g=cv.getContext("2d"),msg=$("ekM");let W=300,H=260,dpr=1,cs=16,ox=0,oy=0;
    const D={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
    let body=[[6,7],[5,7],[4,7],[3,7]],prev=body.map(p=>p.slice()),dir="r",q=[],started=false,dead=false,eaten=0,gold=null,rocks=[],fruit=null,lastStep=0,acc=0,t0=0,left=EKN_T,grow=0,tongue=0,crash=0,nGold=0;
    const spd=()=>Math.min(13,6.5+eaten*.22);
    const busy=(x,y,skipTail)=>body.some((p,i)=>(!skipTail||i<body.length-1)&&p[0]===x&&p[1]===y)||rocks.some(r=>r[0]===x&&r[1]===y)||(fruit&&fruit[0]===x&&fruit[1]===y)||(gold&&gold.x===x&&gold.y===y);
    const free=(minD)=>{const h=body[0];for(let k=0;k<400;k++){const x=Math.floor(mgR()*EKN_C),y=Math.floor(mgR()*EKN_R);if(busy(x,y))continue;if(minD&&Math.abs(x-h[0])+Math.abs(y-h[1])<minD)continue;return[x,y]}
      for(let y=0;y<EKN_R;y++)for(let x=0;x<EKN_C;x++)if(!busy(x,y))return[x,y];return null};
    fruit=free(3);
    const turn=k=>{if(dead)return;if(!started){started=true;msg.textContent="";t0=performance.now();lastStep=t0;MG.raf=requestAnimationFrame(loop)}
      const last=q.length?q[q.length-1]:dir;if(k===last)return;const a=D[k],b=D[last];if(a[0]===-b[0]&&a[1]===-b[1])return;if(q.length<3)q.push(k)};
    const unkey=m4Keys(e=>{const m={ArrowUp:"u",KeyW:"u",ArrowDown:"d",KeyS:"d",ArrowLeft:"l",KeyA:"l",ArrowRight:"r",KeyD:"r"}[e.code];if(m){turn(m);return true}});
    B.querySelectorAll("[data-ek]").forEach(b=>b.addEventListener("pointerdown",e=>{e.preventDefault();turn(b.dataset.ek)}));
    let sw=null;cv.addEventListener("pointerdown",e=>{sw=[e.clientX,e.clientY];try{cv.setPointerCapture(e.pointerId)}catch(x){}});
    cv.addEventListener("pointermove",e=>{if(!sw)return;const dx=e.clientX-sw[0],dy=e.clientY-sw[1];if(Math.max(Math.abs(dx),Math.abs(dy))<22)return;turn(Math.abs(dx)>Math.abs(dy)?(dx>0?"r":"l"):(dy>0?"d":"u"));sw=[e.clientX,e.clientY]});
    cv.addEventListener("pointerup",()=>{sw=null});
    let unfit=()=>{};const cleanup=()=>{unkey();unfit()};MG.onClose=cleanup;
    const finish=()=>{if(dead===2)return;dead=2;cleanup();MG.onClose=null;end(MG.score)};
    const step=()=>{prev=body.map(p=>p.slice());if(q.length)dir=q.shift();const h=body[0],n=[h[0]+D[dir][0],h[1]+D[dir][1]];
      const wall=n[0]<0||n[1]<0||n[0]>=EKN_C||n[1]>=EKN_R,self=body.some((p,i)=>i<body.length-(grow?0:1)&&p[0]===n[0]&&p[1]===n[1]),rock=rocks.some(r=>r[0]===n[0]&&r[1]===n[1]);
      if(wall||self||rock){dead=true;crash=performance.now();snd("miss");msg.textContent=wall?"¡Contra el borde!":rock?"¡Contra una roca!":"¡Te has mordido la cola!";mgT(finish,1100);return}
      body.unshift(n);if(grow>0)grow--;else body.pop();if(prev.length<body.length)prev.push(prev[prev.length-1].slice());
      const at=(x,y)=>n[0]===x&&n[1]===y,px=ox+(n[0]+.5)*cs,py=oy+(n[1]+.5)*cs;
      if(fruit&&at(fruit[0],fruit[1])){eaten++;grow+=1;mgSet(MG.score+10);snd("pop");m4Pop(cv,px,py,"+10","#b8f0ff");fruit=free(2);
        if(eaten%6===0&&!gold){const p=free(4);if(p){gold={x:p[0],y:p[1],t:performance.now()};nGold++}}
        if(eaten>=8&&eaten%4===0&&rocks.length<10){const p=free(4);if(p)rocks.push(p)}
        $("ekN").textContent=eaten}
      if(gold&&at(gold.x,gold.y)){grow+=2;mgSet(MG.score+40);snd("lvl");m4Pop(cv,px,py,"+40 ✨","#ffd35c");gold=null;eaten++;$("ekN").textContent=eaten}
      $("ekL").textContent="Largo "+(body.length+grow)};
    const loop=ts=>{if(dead===2)return;const el=(ts-t0)/1000;left=Math.max(0,EKN_T-el);const tt=$("ekT");if(tt)tt.textContent=Math.ceil(left);
      if(!dead){if(left<=0){dead=true;msg.textContent="⏱️ ¡Tiempo!";snd("win");mgT(finish,900)}
        else{const iv=1000/spd();acc+=ts-lastStep;lastStep=ts;let k=0;while(acc>=iv&&!dead&&k<3){acc-=iv;step();k++}
          if(gold&&ts-gold.t>7000)gold=null}}
      draw(dead?1:Math.min(1,acc/(1000/spd())));MG.raf=requestAnimationFrame(loop)};
    // ---------- dibujo ----------
    const berry=(x,y,r,c1,c2,glow)=>{if(glow){g.save();g.shadowColor="#ffd84a";g.shadowBlur=14}const gr=g.createRadialGradient(x-r*.35,y-r*.35,r*.15,x,y,r);gr.addColorStop(0,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();if(glow)g.restore();
      g.fillStyle="#3fae4a";g.beginPath();g.ellipse(x+r*.35,y-r*.95,r*.42,r*.2,-.5,0,7);g.fill();g.fillStyle="rgba(255,255,255,.55)";g.beginPath();g.arc(x-r*.35,y-r*.35,r*.22,0,7);g.fill()};
    function draw(f){g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle="#1f5130";g.fillRect(0,0,W,H);
      for(let y=0;y<EKN_R;y++)for(let x=0;x<EKN_C;x++){g.fillStyle=(x+y)%2?"#7fcf5f":"#8ad868";g.fillRect(ox+x*cs,oy+y*cs,cs,cs)}
      g.strokeStyle="#2c6b35";g.lineWidth=3;g.strokeRect(ox-1.5,oy-1.5,cs*EKN_C+3,cs*EKN_R+3);
      rocks.forEach(r=>{const x=ox+(r[0]+.5)*cs,y=oy+(r[1]+.5)*cs;g.fillStyle="#7d7f86";g.beginPath();g.moveTo(x-cs*.42,y+cs*.3);g.lineTo(x-cs*.3,y-cs*.28);g.lineTo(x+cs*.1,y-cs*.42);g.lineTo(x+cs*.42,y-cs*.1);g.lineTo(x+cs*.36,y+cs*.34);g.closePath();g.fill();g.fillStyle="#a3a6ad";g.beginPath();g.moveTo(x-cs*.28,y-cs*.22);g.lineTo(x+cs*.08,y-cs*.36);g.lineTo(x+cs*.1,y);g.closePath();g.fill()});
      if(fruit)berry(ox+(fruit[0]+.5)*cs,oy+(fruit[1]+.5)*cs,cs*.34,"#9fd6ff","#2f73d8");
      if(gold){const age=performance.now()-gold.t;if(age<5000||Math.floor(age/150)%2)berry(ox+(gold.x+.5)*cs,oy+(gold.y+.5)*cs,cs*.38,"#fff4b0","#e6a400",true)}
      // cuerpo (interpolado entre casillas para que se mueva suave)
      const pts=body.map((p,i)=>{const a=prev[i]||p;return[ox+(a[0]+(p[0]-a[0])*f+.5)*cs,oy+(a[1]+(p[1]-a[1])*f+.5)*cs]});
      const sh=dead&&crash?Math.sin(performance.now()/30)*2:0;
      for(let i=pts.length-1;i>=1;i--){const[x,y]=pts[i],k=i/pts.length,r=cs*(.4-.14*k);g.fillStyle=i===pts.length-1?"#e6c84a":(i%4===2?"#f2d55a":"#9b59c6");g.beginPath();g.arc(x+sh,y,r,0,7);g.fill()}
      for(let i=pts.length-2;i>=1;i--){const[x,y]=pts[i],[x2,y2]=pts[i+1];g.strokeStyle=i%4===2?"#f2d55a":"#9b59c6";g.lineWidth=cs*(.78-.26*i/pts.length);g.lineCap="round";g.beginPath();g.moveTo(x+sh,y);g.lineTo(x2+sh,y2);g.stroke()}
      // cabeza
      const[hx,hy]=pts[0],dv=D[q.length&&!dead?dir:dir],ang=Math.atan2(dv[1],dv[0]);g.save();g.translate(hx+sh,hy);g.rotate(ang);
      tongue=(performance.now()%1400)<260&&!dead;if(tongue){g.strokeStyle="#e8455a";g.lineWidth=2;g.beginPath();g.moveTo(cs*.4,0);g.lineTo(cs*.72,0);g.moveTo(cs*.72,0);g.lineTo(cs*.84,-cs*.08);g.moveTo(cs*.72,0);g.lineTo(cs*.84,cs*.08);g.stroke()}
      g.fillStyle="#a463d0";g.beginPath();g.ellipse(0,0,cs*.52,cs*.44,0,0,7);g.fill();g.fillStyle="#f2d55a";g.beginPath();g.ellipse(-cs*.1,0,cs*.18,cs*.4,0,0,7);g.fill();
      [-1,1].forEach(s=>{g.fillStyle=dead?"#fff":"#ffe14a";g.beginPath();g.ellipse(cs*.18,s*cs*.2,cs*.12,cs*.1,0,0,7);g.fill();g.fillStyle="#111";if(dead){g.strokeStyle="#111";g.lineWidth=1.5;g.beginPath();g.moveTo(cs*.12,s*cs*.2-3);g.lineTo(cs*.24,s*cs*.2+3);g.moveTo(cs*.24,s*cs*.2-3);g.lineTo(cs*.12,s*cs*.2+3);g.stroke()}else g.fillRect(cs*.17,s*cs*.2-cs*.08,cs*.035,cs*.16)});
      g.restore()}
    unfit=m4Fit(cv,(w,h,d)=>{W=w;H=h;dpr=d;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cs=Math.floor(Math.min(W/EKN_C,H/EKN_R));ox=(W-cs*EKN_C)/2;oy=(H-cs*EKN_R)/2;draw(0)});
    mgSet(0);draw(0);
    MG.ekDbg={get:()=>({body:body.map(p=>p.slice()),dir,eaten,dead,fruit,gold,rocks:rocks.length,left}),turn}
  }};

// ================= LLUVIA DE BAYAS (3D) =================
const BAY_T=60,BAY_X=4.2;
const BAY_K={oran:{v:10,c:"#3f86e8",n:"Aranja"},pecha:{v:15,c:"#ff8fbf",n:"Meloc"},razz:{v:20,c:"#e8344a",n:"Frambu"},gold:{v:50,c:"#ffcf2a",n:"Dorada"},volt:{v:0,bad:1},rock:{v:0,bad:1}};
const G_BAY={id:"bay",n:"Lluvia de bayas",ic:"🍓",c:"#e8457a",d:"¡Llueven bayas! Mueve a Snorlax para atraparlas al vuelo y esquiva los Voltorb y las rocas.",
  dl:"¡Llueven bayas del cielo! Mueve a Snorlax a izquierda y derecha para atraparlas: Aranja (+10), Meloc (+15), Frambu (+20) y la Baya Dorada (+50). Si atrapas varias seguidas sin que caiga ninguna al suelo, ganas un multiplicador de hasta ×5. Cuidado con los Voltorb y las rocas: te quitan una vida (tienes 3). Dura 1 minuto. Ratón o dedo sobre el campo, flechas/A-D o los botones.",
  rw:s=>s*70,
  start(B,end){
    B.innerHTML='<div class="whohd"><span id="byH">'+m4Hearts(3,3)+'</span><span>⏱️ <b id="byT">'+BAY_T+'</b> s</span><span id="byC" class="m4combo"></span></div>'+
      '<div class="m4w m4w3"><canvas id="byC3"></canvas><canvas id="byC2"></canvas><div class="rumsg" id="byM">Toca o pulsa una flecha para empezar</div></div>'+
      '<div class="m4pad m4pad2"><button type="button" class="alt" id="byL" aria-label="Izquierda">◀</button><button type="button" class="alt" id="byR" aria-label="Derecha">▶</button></div>'+
      '<small class="mut m4keys">Ratón o dedo sobre el campo, ←/→ o A/D para moverte</small>';
    const c3=$("byC3"),c2=$("byC2"),msg=$("byM");let E=null;try{E=G3D(c3)}catch(e){E=null}
    if(E)c2.classList.add("m4ovl");else c3.remove();
    const g2=c2.getContext("2d");let W=300,H=300,dpr=1;
    const SN=PM.Snorlax||PM.Munchlax||P[0],VO=PM.Voltorb||null;const im=m4Img(SN);const tx=E?E.tex(mgImgSrc(SN)):null;
    // escena 3D
    let M=null;if(E){const B3=G3B,T=G3M.trs;E.sky=[.62,.82,1];E.fogR=[18,60];
      const tree=(x,z,s)=>[[B3.cyl(.18*s,.24*s,1.2*s,7,"#7a5230"),T([x,.6*s,z])],[B3.cyl(0,1.1*s,2.2*s,8,"#3e9c4a"),T([x,2.1*s,z])],[B3.cyl(0,.85*s,1.6*s,8,"#4fb85a"),T([x,3*s,z])]];
      let sc=[[B3.box(60,1,40,"#7fcf5f"),T([0,-.5,-10])],[B3.box(60,.06,3.2,"#a8e07c"),T([0,.02,0])]];
      for(let i=0;i<16;i++){const x=-15+i*2+(i%3)*.6,z=-6-(i%4)*2.2;sc=sc.concat(tree(x,z,.9+(i%3)*.25))}
      for(let i=0;i<4;i++)sc.push([B3.sphere(5+i,10,i%2?"#6fbf58":"#78c862"),T([-18+i*12,-2.5,-22-(i%2)*4],[0,0,0],[1.6,.7,1])]);
      for(let i=0;i<9;i++)sc.push([B3.box(.12,.7,.12,"#c9a46a"),T([-5+i*1.25,.35,1.6])]);sc.push([B3.box(10.6,.1,.08,"#c9a46a"),T([0,.55,1.6])]);
      const cloud=B3.merge([[B3.sphere(1,8,"#ffffff"),T([0,0,0])],[B3.sphere(.8,8,"#ffffff"),T([1,-.15,.1])],[B3.sphere(.75,8,"#ffffff"),T([-1,-.2,0])]]);
      const leaf=B3.box(.32,.04,.16,"#3fae4a"),stem=B3.cyl(.03,.03,.18,5,"#6b4a2a");
      const mk=(c)=>E.mesh(B3.merge([[B3.sphere(.32,10,c),null],[leaf,T([.12,.36,0],[0,0,.4])],[stem,T([0,.36,0])]]));
      M={scene:E.mesh(B3.merge(sc)),cloud:E.mesh(cloud),oran:mk("#3f86e8"),pecha:mk("#ff8fbf"),razz:E.mesh(B3.merge([[B3.sphere(.34,10,"#e8344a"),null],[B3.cyl(0,.12,.22,6,"#3fae4a"),T([0,.38,0])]])),gold:mk("#ffcf2a"),
        volt:E.mesh(B3.sphere(.42,12,(x,y)=>Math.abs(y)<.06?[.15,.15,.18]:y>0?[.88,.18,.2]:[.97,.97,.97])),rock:E.mesh(B3.sphere(.4,5,"#8a8c92")),
        spark:E.mesh(B3.box(.12,.12,.12,"#ffffff")),blob:E.mesh(B3.merge([[B3.sphere(1,12,"#3a6f8f"),T([0,1,0],[0,0,0],[1.05,1,.8])],[B3.sphere(.7,10,"#f0e2c0"),T([0,.9,.45],[0,0,0],[1,1,.5])]])),
        shadow:E.mesh(B3.cyl(1,1,.02,16,"#2f6a2c"))}}
    const unfit=m4Fit(c2,(w,h,d)=>{W=w;H=h;dpr=d;c2.width=Math.round(W*dpr);c2.height=Math.round(H*dpr);if(E)E.resize(W,H,dpr)});
    let px=0,tgt=null,kv=0,lives=3,started=false,over=false,t0=0,last=0,spawnT=0,items=[],parts=[],combo=0,best=0,inv=0,shake=0,face=1,caught=0,el=0;
    const comboM=()=>Math.min(5,1+Math.floor(combo/4));
    const go=()=>{if(over||started)return;started=true;msg.textContent="";t0=performance.now();last=t0;MG.raf=requestAnimationFrame(loop)};
    const unkey=m4Keys(e=>{if(e.code==="ArrowLeft"||e.code==="KeyA"){kv=-1;tgt=null;go();return true}if(e.code==="ArrowRight"||e.code==="KeyD"){kv=1;tgt=null;go();return true}if(e.code==="Space"){go();return true}},
      e=>{if((e.code==="ArrowLeft"||e.code==="KeyA")&&kv<0)kv=0;if((e.code==="ArrowRight"||e.code==="KeyD")&&kv>0)kv=0});
    m4Hold($("byL"),on=>{kv=on?-1:(kv<0?0:kv);tgt=null;if(on)go()});m4Hold($("byR"),on=>{kv=on?1:(kv>0?0:kv);tgt=null;if(on)go()});
    // el dedo o el ratón: Snorlax va hacia ese punto del campo
    const toX=cx=>{const r=c2.getBoundingClientRect(),fx=(cx-r.left)/r.width;if(E){const a=E.toScreen([-BAY_X,1,0]),b=E.toScreen([BAY_X,1,0]);if(a&&b)return Math.max(-BAY_X,Math.min(BAY_X,-BAY_X+(fx*W-a[0])/(b[0]-a[0])*BAY_X*2))}return Math.max(-BAY_X,Math.min(BAY_X,(fx-.5)*2*BAY_X*1.1))};
    c2.addEventListener("pointerdown",e=>{go();tgt=toX(e.clientX);try{c2.setPointerCapture(e.pointerId)}catch(x){}});
    c2.addEventListener("pointermove",e=>{if(e.pointerType==="mouse"||e.buttons)tgt=toX(e.clientX)});
    const cleanup=()=>{unkey();unfit();if(E)E.free()};MG.onClose=cleanup;
    const finish=()=>{if(over===2)return;over=2;cleanup();MG.onClose=null;end(MG.score)};
    const spawn=()=>{const q=mgR(),bad=.1+Math.min(.12,el*.002);let k=q<.06?"gold":q<.2?"razz":q<.42?"pecha":q<1-bad*2?"oran":q<1-bad?"volt":"rock";
      items.push({k,x:(mgR()*2-1)*(BAY_X-.3),y:11,v:3.1+el*.05+mgR()*.8,r:mgR()*6,vr:(mgR()-.5)*4})};
    const scr=(x,y)=>E?E.toScreen([x,y,0]):[W/2+x/BAY_X*(W*.45),H-30-y*(H-50)/11];
    const loop=ts=>{if(over===2)return;const dt=Math.min(.05,(ts-last)/1000);last=ts;el=(ts-t0)/1000;const left=Math.max(0,BAY_T-el);const tt=$("byT");if(tt)tt.textContent=Math.ceil(left);
      if(!over){if(left<=0||lives<=0){over=true;msg.textContent=lives<=0?"¡Sin vidas!":"⏱️ ¡Tiempo!";snd(lives<=0?"miss":"win");mgT(finish,1000)}
        // movimiento de Snorlax
        let vx=kv*9;if(tgt!=null){const d=tgt-px;vx=Math.max(-9,Math.min(9,d*12))}px=Math.max(-BAY_X,Math.min(BAY_X,px+vx*dt));if(Math.abs(vx)>.5)face=vx>0?-1:1;
        spawnT-=dt;if(spawnT<=0){spawn();spawnT=Math.max(.38,1-el*.011)}
        inv=Math.max(0,inv-dt);
        for(const it of items){it.y-=it.v*dt;it.r+=it.vr*dt;
          if(!it.done&&it.y<=1.7&&it.y>.5&&Math.abs(it.x-px)<1){it.done=1;const s=scr(it.x,it.y+.5)||[W/2,H/2];
            if(BAY_K[it.k].bad){if(inv<=0){lives--;inv=1.1;shake=.4;combo=0;snd("miss");m4Pop(c2,s[0],s[1],it.k==="volt"?"💥 ¡Voltorb!":"🪨 ¡Ay!","#ff6b6b");$("byH").textContent=m4Hearts(lives,3);for(let i=0;i<14;i++)parts.push({x:it.x,y:it.y,vx:(Math.random()-.5)*6,vy:Math.random()*5,l:.6,c:[1,.6,.2]})}}
            else{combo++;best=Math.max(best,combo);const pts=BAY_K[it.k].v*comboM();mgSet(MG.score+pts);caught++;snd(it.k==="gold"?"lvl":"pop");m4Pop(c2,s[0],s[1],"+"+pts,it.k==="gold"?"#ffd35c":"#fff");
              const cc=G3B.hex(BAY_K[it.k].c);for(let i=0;i<8;i++)parts.push({x:it.x,y:it.y,vx:(Math.random()-.5)*4,vy:Math.random()*4,l:.5,c:cc})}}
          if(!it.done&&it.y<=0){it.done=1;if(!BAY_K[it.k].bad&&combo){combo=0;snd("click")}}}
        items=items.filter(it=>!it.done&&it.y>-1);
        const cb=$("byC");if(cb)cb.textContent=comboM()>1?"🔥 ×"+comboM():combo?"Racha "+combo:""}
      parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy-=12*dt;p.l-=dt});parts=parts.filter(p=>p.l>0);shake=Math.max(0,shake-dt);
      render(ts);MG.raf=requestAnimationFrame(loop)};
    function render(ts){const sk=shake>0?(Math.random()-.5)*shake*.6:0,asp=W/Math.max(1,H),dist=Math.max(10.5,5.6/(.47*asp));
      if(E){E.camera([sk,4.4,dist],[0,3.6,0],.9);E.begin();E.draw(M.scene);
        for(let i=0;i<4;i++){const cx=((i*9+ts/1000*.4)%40)-20;E.draw(M.cloud,G3M.trs([cx,8+i%2*1.4,-14-i*2],[0,0,0],1.4+i%2*.4),null,.35)}
        E.draw(M.shadow,G3M.trs([px,.04,0],[0,0,0],[1.1,1,.55]),[.6,.6,.6],0,.45);
        const blink=inv>0&&Math.floor(ts/90)%2;if(!blink&&!E.sprite(tx,[px,0,0],2.4,null,face<0))E.draw(M.blob,G3M.trs([px,0,0]));
        items.forEach(it=>{const m=M[it.k];if(!m)return;E.draw(m,G3M.trs([it.x,it.y,0],[it.r*.6,it.r,0],it.k==="gold"?1.15:1),null,it.k==="gold"?.45:0);if(it.y>2)E.draw(M.shadow,G3M.trs([it.x,.05,0],[0,0,0],[.3,1,.3]),[.6,.6,.6],0,.25)});
        parts.forEach(p=>E.draw(M.spark,G3M.trs([p.x,p.y,0],[p.l*9,p.l*7,0],p.l*1.6),p.c,1));
        g2.setTransform(dpr,0,0,dpr,0,0);g2.clearRect(0,0,W,H)}
      else{const g=g2;g.setTransform(dpr,0,0,dpr,0,0);const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,"#9fd2ff");gr.addColorStop(1,"#dff1ff");g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle="#7fcf5f";g.fillRect(0,H-30,W,30);
        items.forEach(it=>{const[x,y]=scr(it.x,it.y);g.fillStyle=it.k==="volt"?"#e33":it.k==="rock"?"#888":BAY_K[it.k].c;g.beginPath();g.arc(x,y,12,0,7);g.fill()});
        const[sx]=scr(px,0);if(m4Ok(im))g.drawImage(im,sx-40,H-110,80,80);else{g.fillStyle="#3a6f8f";g.beginPath();g.arc(sx,H-60,30,0,7);g.fill()}}}
    mgSet(0);render(0);
    MG.byDbg={get:()=>({px,lives,items:items.length,combo,over,caught,el,e3:!!E}),put:(k,x,y)=>items.push({k,x,y:y==null?2:y,v:1,r:0,vr:0}),move:x=>{tgt=x}}
  }};

// ================= VUELO DE PIDGEOT (3D) =================
const PDG_T=90;
const G_PDG={id:"pdg",n:"Vuelo de Pidgeot",ic:"🦅",c:"#d9932a",d:"Vuela con Pidgeot entre las montañas: atraviesa los aros y esquiva las columnas de roca.",
  dl:"Vuela con Pidgeot entre las montañas. Pulsa (o toca) para batir las alas y subir; si no, va bajando. Atraviesa los aros: cada uno vale 10 puntos (+5 si pasas por el centro) y los dorados 30. Encadena aros para multiplicar los puntos (hasta ×3). Las columnas de roca y el suelo te quitan una vida (tienes 3). Dura 90 segundos y cada vez vas más rápido; al final, cada vida que te quede suma 50 puntos.",
  rw:s=>s*450,
  start(B,end){
    B.innerHTML='<div class="whohd"><span id="pgH">'+m4Hearts(3,3)+'</span><span>⏱️ <b id="pgT">'+PDG_T+'</b> s</span><span id="pgC" class="m4combo"></span></div>'+
      '<div class="m4w m4w3"><canvas id="pgC3"></canvas><canvas id="pgC2"></canvas><div class="rumsg" id="pgM">Toca o pulsa espacio para despegar</div></div>'+
      '<div class="m4pad m4pad2"><button type="button" class="red" id="pgF">🪽 Aletear</button></div>'+
      '<small class="mut m4keys">Espacio, W, ↑, clic o toque: batir las alas</small>';
    const c3=$("pgC3"),c2=$("pgC2"),msg=$("pgM");let E=null;try{E=G3D(c3)}catch(e){E=null}
    if(E)c2.classList.add("m4ovl");else c3.remove();
    const g2=c2.getContext("2d");let W=300,H=300,dpr=1;
    const PG=PM.Pidgeot||PM.Pidgeotto||P[0];const im=m4Img(PG);const tx=E?E.tex(mgImgSrc(PG)):null;
    let M=null;if(E){const B3=G3B,T=G3M.trs;E.sky=[.6,.8,1];E.fogR=[16,70];
      const mt=(x,z,h,c)=>[B3.cyl(0,h*.7,h,7,c),T([x,h/2-1,z])];let far=[];for(let i=0;i<14;i++)far.push(mt(-30+i*5.2,-26-(i%3)*3,7+(i*37%5),i%2?"#7d8fb0":"#8b9cbc"));
      for(let i=0;i<14;i++)far.push([B3.cyl(0,.8,.9,7,"#f4f6ff"),T([-30+i*5.2,(7+(i*37%5))-1.45,-26-(i%3)*3])]);
      let mid=[];for(let i=0;i<20;i++){const x=-20+i*2.1,s=.8+(i%3)*.3;mid.push([B3.cyl(.12*s,.16*s,1*s,6,"#7a5230"),T([x,.5*s,-7-(i%2)*1.5])],[B3.cyl(0,.9*s,2.2*s,7,i%2?"#3e9c4a":"#4fb85a"),T([x,1.9*s,-7-(i%2)*1.5])])}
      M={far:E.mesh(B3.merge(far)),mid:E.mesh(B3.merge(mid)),ground:E.mesh(B3.box(80,1,30,"#79c45a")),
        col:E.mesh(B3.merge([[B3.box(1.2,1,1.2,"#9a7b5c"),null],[B3.box(1.32,.12,1.32,"#7d6046"),T([0,.3,0])],[B3.box(1.32,.12,1.32,"#7d6046"),T([0,-.25,0])]])),
        cap:E.mesh(B3.box(1.6,.35,1.6,"#6e543c")),ring:E.mesh(B3.torus(.95,.11,28,8,"#4fb4ff")),gring:E.mesh(B3.torus(.95,.13,28,8,"#ffcf2a")),
        cloud:E.mesh(B3.merge([[B3.sphere(1,8,"#ffffff"),null],[B3.sphere(.8,8,"#ffffff"),T([1,-.15,.1])],[B3.sphere(.75,8,"#ffffff"),T([-1,-.2,0])]])),
        feather:E.mesh(B3.box(.08,.25,.02,"#c98a3a")),bird:E.mesh(B3.merge([[B3.sphere(.45,10,"#b07a3a"),null],[B3.box(1.4,.08,.4,"#c99a5a"),T([0,.1,0])],[B3.cyl(0,.12,.3,6,"#f0c040"),T([.5,0,0],[0,0,-1.57])]]))}}
    const unfit=m4Fit(c2,(w,h,d)=>{W=w;H=h;dpr=d;c2.width=Math.round(W*dpr);c2.height=Math.round(H*dpr);if(E)E.resize(W,H,dpr)});
    // el mundo avanza hacia la izquierda; Pidgeot está en x = 0
    let y=4.5,vy=0,lives=3,started=false,over=false,t0=0,last=0,dist=0,nextX=10,obs=[],rings=[],parts=[],combo=0,inv=0,flapT=0,el=0,shake=0,pass=0,nRing=0;
    const comboM=()=>Math.min(3,1+Math.floor(combo/3));
    const flap=()=>{if(over)return;if(!started){started=true;msg.textContent="";t0=performance.now();last=t0;MG.raf=requestAnimationFrame(loop)}vy=6.4;flapT=.18;snd("pop")};
    const unkey=m4Keys(e=>{if(["Space","KeyW","ArrowUp"].includes(e.code)){if(!e.repeat)flap();return true}});
    c2.addEventListener("pointerdown",e=>{e.preventDefault();flap()});const fb=$("pgF");if(fb)fb.addEventListener("pointerdown",e=>{e.preventDefault();flap()});
    const cleanup=()=>{unkey();unfit();if(E)E.free()};MG.onClose=cleanup;
    const finish=()=>{if(over===2)return;over=2;cleanup();MG.onClose=null;end(MG.score)};
    // obstáculos: pareja de columnas con un hueco; dentro del hueco, un aro (a veces dorado)
    const addSet=x=>{const gap=Math.max(2.5,3.6-el*.012),cy=1.9+gap/2+mgR()*(8.4-gap-1.9),gold=mgR()<.14;obs.push({x,top:cy+gap/2,bot:cy-gap/2});rings.push({x,y:cy,gold});nRing++;
      if(mgR()<.5){const ry=1.8+mgR()*6.2;rings.push({x:x+(2.6+mgR()),y:ry,gold:false,free:1});nRing++}};
    const speed=()=>4.6+el*.045;
    const hurt=why=>{if(inv>0)return;lives--;inv=1.5;combo=0;shake=.4;snd("miss");const s=scr(0,y);m4Pop(c2,s[0],s[1]-20,why,"#ff6b6b");$("pgH").textContent=m4Hearts(Math.max(0,lives),3);for(let i=0;i<10;i++)parts.push({x:0,y,vx:(Math.random()-.5)*5,vy:Math.random()*4,l:.8})};
    const scr=(x,yy)=>E?(E.toScreen([x,yy,0])||[W/3,H/2]):[W*.3+x*(W/14),H-20-yy*(H-30)/10];
    const loop=ts=>{if(over===2)return;const dt=Math.min(.05,(ts-last)/1000);last=ts;el=(ts-t0)/1000;const left=Math.max(0,PDG_T-el);const tt=$("pgT");if(tt)tt.textContent=Math.ceil(left);
      if(!over){if(left<=0||lives<=0){over=true;if(lives>0){const b=lives*50;mgSet(MG.score+b);msg.textContent="⏱️ ¡Tiempo! +"+b+" por las vidas";snd("win")}else{msg.textContent="¡Sin vidas!";snd("miss")}mgT(finish,1300)}
        const v=speed();dist+=v*dt;vy-=15.5*dt;y+=vy*dt;flapT=Math.max(0,flapT-dt);inv=Math.max(0,inv-dt);
        if(y>9.6){y=9.6;vy=Math.min(0,vy)}if(y<.45){y=.45;vy=6;hurt("¡Al suelo!")}
        while(nextX<dist+26){addSet(nextX);nextX+=Math.max(6.2,8.4-el*.03)}
        for(const o of obs){const ox=o.x-dist;if(Math.abs(ox)<.75&&(y>o.top-.25||y<o.bot+.25))hurt("¡Contra la roca!")}
        for(const r of rings){const rx=r.x-dist;if(!r.done&&rx<0){r.done=1;const dy=Math.abs(y-r.y);
          if(dy<.85){combo++;const perf=dy<.32,pts=((r.gold?30:10)+(perf?5:0))*comboM();mgSet(MG.score+pts);pass++;snd(r.gold?"lvl":"pop");const s=scr(0,y);m4Pop(c2,s[0]+20,s[1]-20,(perf?"¡Perfecto! ":"")+"+"+pts,r.gold?"#ffd35c":"#fff")}
          else if(combo){combo=0}}}
        obs=obs.filter(o=>o.x-dist>-12);rings=rings.filter(r=>r.x-dist>-12);
        const cb=$("pgC");if(cb)cb.textContent=comboM()>1?"🔥 ×"+comboM():combo?"Aros "+combo:""}
      parts.forEach(p=>{p.x+=p.vx*dt-speed()*dt;p.y+=p.vy*dt;p.vy-=8*dt;p.l-=dt});parts=parts.filter(p=>p.l>0);shake=Math.max(0,shake-dt);
      render(ts);MG.raf=requestAnimationFrame(loop)};
    function render(ts){const sk=shake>0?(Math.random()-.5)*shake:0,asp=W/Math.max(1,H),dz=Math.max(12.5,7.4/(.46*asp));
      if(E){const cx=3+sk;E.camera([cx,5.1+(y-4.5)*.12,dz],[cx,4.6+(y-4.5)*.1,0],.9);E.begin();
        const fo=-(dist*.15)%10.4,mo=-(dist*.55)%4.2,go=-(dist)%4;
        E.draw(M.far,G3M.trs([fo,0,0]));E.draw(M.far,G3M.trs([fo+72.8,0,0]));E.draw(M.mid,G3M.trs([mo,0,0]));E.draw(M.mid,G3M.trs([mo+42,0,0]));
        E.draw(M.ground,G3M.trs([go,-.5,-5]));
        for(let i=0;i<5;i++){const x=((i*11-dist*.35)%50+50)%50-18;E.draw(M.cloud,G3M.trs([x,8.4+(i%2)*1.2,-10-i]),null,.3)}
        obs.forEach(o=>{const x=o.x-dist,hb=o.bot,ht=12-o.top;E.draw(M.col,G3M.trs([x,hb/2,0],[0,0,0],[1,hb,1]));E.draw(M.cap,G3M.trs([x,hb,0]));E.draw(M.col,G3M.trs([x,o.top+ht/2,0],[0,0,0],[1,ht,1]));E.draw(M.cap,G3M.trs([x,o.top,0]))});
        rings.forEach(r=>{if(r.done)return;const x=r.x-dist;E.draw(r.gold?M.gring:M.ring,G3M.trs([x,r.y,0],[0,1.1,0]),null,r.gold?.5:.25)});
        const blink=inv>0&&Math.floor(ts/90)%2,h=2.1*(flapT>0?.9:1);
        if(!blink&&!E.sprite(tx,[0,y-h*.45,0],h,null,true))E.draw(M.bird,G3M.trs([0,y,0],[0,0,Math.max(-.5,Math.min(.5,vy*.06))]));
        parts.forEach(p=>E.draw(M.feather,G3M.trs([p.x,p.y,.2],[p.l*5,0,p.l*7]),null,.2));
        g2.setTransform(dpr,0,0,dpr,0,0);g2.clearRect(0,0,W,H)}
      else{const g=g2;g.setTransform(dpr,0,0,dpr,0,0);const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,"#9fd2ff");gr.addColorStop(1,"#e8f6ff");g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle="#79c45a";g.fillRect(0,H-20,W,20);
        obs.forEach(o=>{const[x]=scr(o.x-dist,0),yt=scr(0,o.top)[1],yb=scr(0,o.bot)[1];g.fillStyle="#9a7b5c";g.fillRect(x-14,0,28,yt);g.fillRect(x-14,yb,28,H-yb)});
        rings.forEach(r=>{if(r.done)return;const[x,yy]=scr(r.x-dist,r.y);g.strokeStyle=r.gold?"#ffcf2a":"#4fb4ff";g.lineWidth=4;g.beginPath();g.ellipse(x,yy,6,18,0,0,7);g.stroke()});
        const[bx,by]=scr(0,y);if(m4Ok(im)){g.save();g.translate(bx,by);g.scale(-1,1);g.drawImage(im,-32,-32,64,64);g.restore()}else{g.fillStyle="#b07a3a";g.beginPath();g.arc(bx,by,14,0,7);g.fill()}}}
    mgSet(0);render(0);
    MG.pgDbg={get:()=>({y,vy,lives,dist,obs:obs.length,rings:rings.length,pass,over,e3:!!E,el}),flap,setY:v=>{y=v;vy=0}}
  }};

// ================= CUEVA OSCURA =================
const CUE_R=8,CUE_T=20;
const CUE_MON=["Zubat","Golbat","Geodude","Graveler","Onix","Diglett","Dugtrio","Sableye","Mawile","Aron","Lairon","Gible","Roggenrola","Boldore","Woobat","Drilbur","Dunsparce","Machop","Cubone","Larvitar","Noibat","Carbink","Clefairy","Paras","Rhyhorn","Nosepass","Bronzor","Riolu","Shuckle","Seviper","Croagunk","Bonsly","Nosepass","Swinub","Spheal","Trapinch","Kabuto","Omanyte"];
const G_CUE={id:"cue",n:"Cueva oscura",ic:"🔦",c:"#5b4a8f",d:"Ilumina la cueva con Destello y encuentra al Pokémon que te piden antes de que se acabe el tiempo.",
  dl:"La cueva está a oscuras: mueve la luz de Destello (con el ratón, el dedo o las flechas) y encuentra al Pokémon que te piden. Cuando esté iluminado, haz clic o tócalo. Si tocas al Pokémon equivocado pierdes 2 segundos, y los Zubat que pasan volando te tapan la luz un momento. 8 rondas de 20 segundos: cuanto antes lo encuentres, más puntos, y en cada ronda la luz es más pequeña.",
  rw:s=>s*160,
  start(B,end){
    const pool=[...new Set(CUE_MON)].map(n=>PM[n]).filter(Boolean),ZU=PM.Zubat||pool[0];
    B.innerHTML='<div class="whohd"><span>Ronda <b id="cuR">1</b>/'+CUE_R+'</span><span class="cuwant" id="cuW"></span><span>⏱️ <b id="cuT">'+CUE_T+'</b></span></div>'+
      '<div class="m4w cuw"><canvas id="cuC"></canvas><div class="rumsg" id="cuM">Cargando la cueva…</div></div>'+
      '<small class="mut m4keys">Mueve la luz con el ratón, el dedo o las flechas · Clic, toque, Espacio o Intro sobre el Pokémon iluminado</small>';
    const cv=$("cuC"),g=cv.getContext("2d"),msg=$("cuM");let W=300,H=300,dpr=1;const bg=document.createElement("canvas"),dk=document.createElement("canvas");
    let round=0,mons=[],want=null,lx=150,ly=150,keys={},t0=0,last=0,left=CUE_T,state="load",over=false,bats=[],dim=0,nextBat=3,penal=0,found=0,bonusT=0,flick=0;
    const radius=()=>Math.max(54,(98-round*5.5)*Math.min(1.15,Math.max(.75,Math.min(W,H)/340)))*(dim>0?.55:1)*(1+Math.sin(flick)*.025);
    const drawBg=()=>{bg.width=Math.round(W*dpr);bg.height=Math.round(H*dpr);const b=bg.getContext("2d");b.setTransform(dpr,0,0,dpr,0,0);
      const gr=b.createLinearGradient(0,0,0,H);gr.addColorStop(0,"#3a3148");gr.addColorStop(1,"#2a2234");b.fillStyle=gr;b.fillRect(0,0,W,H);
      let s=7;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
      for(let i=0;i<70;i++){b.fillStyle=["#463c56","#352d42","#4f4460","#2f2839"][i%4];b.beginPath();const x=r()*W,y=r()*H,rr=10+r()*38;b.ellipse(x,y,rr,rr*.6,r()*3,0,7);b.fill()}
      for(let i=0;i<9;i++){const x=r()*W,w=10+r()*16,h=20+r()*50;b.fillStyle="#5a4e6c";b.beginPath();b.moveTo(x-w,0);b.lineTo(x+w,0);b.lineTo(x,h);b.closePath();b.fill()}
      for(let i=0;i<7;i++){const x=r()*W,w=10+r()*18,h=18+r()*36;b.fillStyle="#4a3f5a";b.beginPath();b.moveTo(x-w,H);b.lineTo(x+w,H);b.lineTo(x,H-h);b.closePath();b.fill()}
      for(let i=0;i<10;i++){const x=r()*W,y=r()*H,c=["#7fe0ff","#c58cff","#ff9cd6"][i%3];b.fillStyle=c;b.globalAlpha=.75;b.beginPath();b.moveTo(x,y-9);b.lineTo(x+5,y);b.lineTo(x,y+9);b.lineTo(x-5,y);b.closePath();b.fill();b.globalAlpha=1}
      for(let i=0;i<4;i++){b.fillStyle="rgba(90,140,200,.35)";b.beginPath();b.ellipse(r()*W,H*.6+r()*H*.35,30+r()*30,7,0,0,7);b.fill()}};
    const unfit=m4Fit(cv,(w,h,d)=>{const sx=w/(W||w),sy=h/(H||h);W=w;H=h;dpr=d;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);dk.width=cv.width;dk.height=cv.height;drawBg();
      mons.forEach(m=>{m.x*=sx;m.y*=sy});lx*=sx;ly*=sy;draw()});
    const unkey=m4Keys(e=>{if(e.code.startsWith("Arrow")){keys[e.code]=1;return true}if(e.code==="Space"||e.code==="Enter"){tap(lx,ly,true);return true}},e=>{if(e.code.startsWith("Arrow")){keys[e.code]=0;return true}});
    const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]};
    cv.addEventListener("pointermove",e=>{if(e.pointerType==="mouse"||e.buttons){const[x,y]=pos(e);lx=x;ly=y}});
    cv.addEventListener("pointerdown",e=>{const[x,y]=pos(e);const lit=Math.hypot(x-lx,y-ly)<radius()*.9;if(e.pointerType!=="mouse"&&!lit){lx=x;ly=y;return}lx=x;ly=y;tap(x,y,false)});
    const cleanup=()=>{unkey();unfit()};MG.onClose=cleanup;
    const finish=()=>{if(over===2)return;over=2;cleanup();MG.onClose=null;end(MG.score)};
    const hit=(m,x,y)=>Math.abs(x-m.x)<m.s*.38&&Math.abs(y-m.y)<m.s*.4;
    const tap=(x,y,kb)=>{if(state!=="play")return;const r=radius(),lit=m=>Math.hypot(m.x-lx,m.y-ly)<r+m.s*.2;
      const m=mons.filter(q=>hit(q,x,y)&&lit(q)).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(!m){if(kb)snd("click");return}
      if(m.p===want){const pts=100+Math.ceil(left)*10;mgSet(MG.score+pts);found++;snd("lvl");try{cry(m.p[0])}catch(e){}m4Pop(cv,m.x,m.y-m.s*.4,"¡"+m.p[0]+"! +"+pts,"#ffd35c");m.found=1;state="reveal";bonusT=performance.now();mgT(next,1400)}
      else{penal+=2;snd("miss");m4Pop(cv,m.x,m.y-m.s*.4,"¡Ese es "+m.p[0]+"! −2 s","#ff8a8a");m.wrong=performance.now()}};
    const next=()=>{if(over)return;if(round>=CUE_R){over=true;state="end";msg.textContent="¡Has salido de la cueva!";snd("win");mgT(finish,1100);return}round++;$("cuR").textContent=round;
      const n=Math.min(14,9+round),pk=mgPickR(pool,n);want=pk[Math.floor(mgR()*pk.length)];
      // sin solaparse: una cuadrícula con un poco de desorden
      const cols=Math.ceil(Math.sqrt(n*W/H)),rows=Math.ceil(n/cols),cw=W/cols,ch=H/rows,cells=mgShuf(Array.from({length:cols*rows},(_,i)=>i)).slice(0,n),sz=Math.min(cw,ch)*.92;
      mons=pk.map((p,i)=>{const c=cells[i],cx=(c%cols+.5)*cw,cy=(Math.floor(c/cols)+.5)*ch;return{p,im:m4Img(p),s:Math.max(44,Math.min(96,sz)),x:cx+(mgR()-.5)*cw*.25,y:cy+(mgR()-.5)*ch*.25}});
      const wi=icoHD(want,40,false,false);$("cuW").innerHTML='Busca a <span class="cuwi">'+wi+'</span><b>'+esc(want[0])+'</b>';
      state="load";msg.textContent="";penal=0;bats=[];dim=0;
      m4Ready(mons.map(m=>m.im).concat([zi]),4000).then(()=>{if(over)return;state="play";t0=performance.now();last=t0;nextBat=2+mgR()*3})};
    const zi=m4Img(ZU);
    const loop=ts=>{if(over===2)return;const dt=Math.min(.05,(ts-(last||ts))/1000);last=ts;flick+=dt*9;
      const sp=380*dt;if(keys.ArrowLeft)lx-=sp;if(keys.ArrowRight)lx+=sp;if(keys.ArrowUp)ly-=sp;if(keys.ArrowDown)ly+=sp;lx=Math.max(0,Math.min(W,lx));ly=Math.max(0,Math.min(H,ly));
      if(state==="play"){left=Math.max(0,CUE_T-(ts-t0)/1000-penal);const tt=$("cuT");if(tt)tt.textContent=Math.ceil(left);
        dim=Math.max(0,dim-dt);nextBat-=dt;if(nextBat<=0){const fromL=Math.random()<.5;bats.push({x:fromL?-30:W+30,y:30+Math.random()*(H-60),vx:(fromL?1:-1)*(150+Math.random()*80),ph:0});nextBat=2.5+Math.random()*3}
        bats.forEach(b=>{b.x+=b.vx*dt;b.ph+=dt*14;if(!b.hit&&Math.hypot(b.x-lx,b.y-ly)<radius()*.8){b.hit=1;dim=1.2;snd("click")}});bats=bats.filter(b=>b.x>-60&&b.x<W+60);
        if(left<=0){state="reveal";snd("miss");const m=mons.find(q=>q.p===want);if(m){m.found=1;m4Pop(cv,m.x,m.y-m.s*.4,"Era "+want[0],"#ffb0b0")}mgT(next,1600)}}
      draw();MG.raf=requestAnimationFrame(loop)};
    function draw(){g.setTransform(dpr,0,0,dpr,0,0);g.drawImage(bg,0,0,W,H);
      mons.forEach(m=>{if(!m4Ok(m.im))return;const sh=m.wrong&&performance.now()-m.wrong<400?Math.sin(performance.now()/25)*4:0;g.drawImage(m.im,m.x-m.s/2+sh,m.y-m.s/2,m.s,m.s)});
      bats.forEach(b=>{if(m4Ok(zi)){g.save();g.translate(b.x,b.y);if(b.vx<0)g.scale(-1,1);g.drawImage(zi,-26,-26+Math.sin(b.ph)*4,52,52);g.restore()}});
      // oscuridad con el círculo de luz
      const d=dk.getContext("2d");d.setTransform(dpr,0,0,dpr,0,0);d.globalCompositeOperation="source-over";d.clearRect(0,0,W,H);d.fillStyle="rgba(6,4,14,.993)";d.fillRect(0,0,W,H);
      const reveal=state==="reveal"||state==="end";
      if(!reveal&&state!=="load"){const r=radius();d.globalCompositeOperation="destination-out";const gr=d.createRadialGradient(lx,ly,r*.35,lx,ly,r);gr.addColorStop(0,"rgba(0,0,0,1)");gr.addColorStop(.75,"rgba(0,0,0,.85)");gr.addColorStop(1,"rgba(0,0,0,0)");d.fillStyle=gr;d.beginPath();d.arc(lx,ly,r,0,7);d.fill()}
      if(reveal){d.globalCompositeOperation="destination-out";const m=mons.find(q=>q.found);if(m){const r=m.s*.75,gr=d.createRadialGradient(m.x,m.y,r*.3,m.x,m.y,r);gr.addColorStop(0,"rgba(0,0,0,1)");gr.addColorStop(1,"rgba(0,0,0,0)");d.fillStyle=gr;d.beginPath();d.arc(m.x,m.y,r,0,7);d.fill()}}
      g.setTransform(1,0,0,1,0,0);g.drawImage(dk,0,0);g.setTransform(dpr,0,0,dpr,0,0);
      if(!reveal&&state==="play"){const r=radius();g.strokeStyle="rgba(255,240,180,.25)";g.lineWidth=2;g.beginPath();g.arc(lx,ly,r,0,7);g.stroke()}
      if(dim>0){g.fillStyle="rgba(255,255,255,.85)";g.font="bold 14px sans-serif";g.textAlign="center";g.fillText("¡Un Zubat te tapa la luz!",W/2,22)}}
    mgSet(0);lx=W/2;ly=H/2;next();MG.raf=requestAnimationFrame(loop);
    MG.cuDbg={get:()=>({round,state,want:want&&want[0],mons:mons.map(m=>({n:m.p[0],x:Math.round(m.x),y:Math.round(m.y),s:m.s})),left,found,r:radius()}),light:(x,y)=>{lx=x;ly=y},tap:(x,y)=>tap(x,y,false)}
  }};

MGS.push(G_EKN,G_BAY,G_PDG,G_CUE);
// premio especial de cada uno en la clasificación semanal
Object.assign(MGR_EX,{ekn:{cand:1},bay:{ub:3},pdg:{ppmax:1},cue:{_hold:1}});
if(typeof MGHOW!=="undefined")Object.assign(MGHOW,{
  ekn:["Cada baya vale 10 y la dorada 40: ¡ve a por las doradas antes de que desaparezcan!","Planifica el camino: cuanto más largo eres, más fácil es acorralarte.","Gira con antelación: puedes encadenar hasta tres giros rápidos."],
  bay:["Encadena bayas sin dejar caer ninguna: cada 4 seguidas sube el multiplicador (hasta ×5).","La Baya Dorada vale 50 por el multiplicador: ¡no la dejes escapar!","Si un Voltorb cae cerca de una baya, a veces compensa dejar pasar la baya."],
  pdg:["Pasa por el centro de los aros: +5 puntos más cada vez.","Encadena aros para llegar al ×3; si te saltas uno, vuelve a ×1.","Las vidas que te queden al final valen 50 puntos cada una."],
  cue:["Cuanto antes encuentres al Pokémon, más puntos: 10 por cada segundo que sobre.","Mira la silueta de arriba antes de buscar.","No toques a lo loco: cada error te quita 2 segundos."]});
// etiqueta «¡NUEVO!» en la lista de minijuegos durante las primeras semanas
const MG_NEW=new Set(["ekn","bay","pdg","cue"]),MG_NEW_HASTA=Date.UTC(2026,11,23);
{const _mu=mgUI;mgUI=function(){_mu.apply(this,arguments);if(Date.now()>MG_NEW_HASTA)return;document.querySelectorAll("#mgPB [data-mgo]").forEach(b=>{if(MG_NEW.has(b.dataset.mgo)&&!b.querySelector(".mgnew"))b.insertAdjacentHTML("beforeend",'<span class="mgnew">¡NUEVO!</span>')})}}
