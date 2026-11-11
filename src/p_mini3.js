// =====================================================================================
// MINIJUEGOS NUEVOS: Rompecabezas Pokémon, Puzle de piezas y Más o menos
// =====================================================================================
const mgImgSrc=p=>{const m=/src="([^"]+)"/.exec(icoHD(p,256,false,false));return m?m[1]:""};

// ---------------- guardar una partida a medias (Rompecabezas y Puzle de piezas) ----------------
const mgSaveGet=id=>S.mgSave&&S.mgSave[id]?S.mgSave[id]:null;
const mgSavePut=(id,v)=>{S.mgSave=S.mgSave||{};S.mgSave[id]=v;save()};
const mgSaveDel=id=>{if(S.mgSave&&S.mgSave[id]){delete S.mgSave[id];save()}};
const mgClk=ms=>{const s=Math.floor((ms|0)/1000);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
function mgSaveHTML(sv,desc){if(!sv)return "";return '<div class="mgsave"><b>💾 Tienes una partida guardada</b><small>'+esc(desc(sv))+' · guardada el '+new Date(sv.at||Date.now()).toLocaleDateString("es")+'</small><div><button class="red" data-mgcont>▶ Continuar</button><button class="alt" data-mgdel>🗑️ Borrarla</button></div><small class="mut">Si empiezas una nueva, la guardada se borra.</small></div>'}
function mgSaveBind(B,sv,cont){if(!sv)return;const c=B.querySelector("[data-mgcont]"),d=B.querySelector("[data-mgdel]");if(c)c.onclick=()=>{snd("ui");cont()};if(d)d.onclick=async()=>{if(!await askOk("¿Borrar la partida guardada?"))return;mgSaveDel(MG.g.id);const g=MG.g;g.start(B,mgEnd)}}

// ---------------- ROMPECABEZAS POKÉMON (antes «Puzle de sprites»): recompón la imagen de un Pokémon intercambiando piezas ----------------
const PZ_SIZES=[3,4,5,6,7,8,10];
const G_PUZ={id:"puz",n:"Rompecabezas Pokémon",ic:"🧩",c:"#d8456f",d:"Recompón la imagen de un Pokémon intercambiando sus piezas. Elige de 9 a 100 piezas: cuantas más, más puntos. Puedes guardar la partida y seguir otro día.",
  rw:s=>s*45,
  start(B,end){
    const pick=()=>{const sv=mgSaveGet("puz");
      B.innerHTML=mgSaveHTML(sv,s=>s.N*s.N+" piezas · "+mgClk(s.el)+" · "+s.ord.filter((v,i)=>v===i).length+" bien colocadas")+'<div class="pzpick"><h3>¿Cuántas piezas?</h3><div class="pzsz">'+PZ_SIZES.map(n=>'<button data-pzn="'+n+'"><b>'+(n*n)+'</b><small>'+n+'×'+n+'</small><i>×'+(n*n*40>=1000?fmt(n*n*40):n*n*40)+' pts</i></button>').join("")+'</div><small class="mut">Toca dos piezas para intercambiarlas, o arrastra una encima de otra. Las piezas bien colocadas se quedan fijas en verde.</small></div>';
      B.querySelectorAll("[data-pzn]").forEach(b=>b.onclick=()=>{snd("ui");if(sv)mgSaveDel("puz");play(+b.dataset.pzn)});
      mgSaveBind(B,sv,()=>play(sv.N,sv))};
    const play=(N,sv)=>{
      const pool=P.filter(p=>p[2]!=="M");let mon=sv&&PM[sv.m]?PM[sv.m]:pool[Math.floor(Math.random()*pool.length)],src=sv&&sv.src?sv.src:mgImgSrc(mon),tries=0;
      const T=N*N;let ord=[...Array(T).keys()];
      // barajar sin dejar demasiadas piezas ya en su sitio
      if(sv&&Array.isArray(sv.ord)&&sv.ord.length===T)ord=sv.ord.slice();else do{for(let i=T-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}}while(ord.filter((v,i)=>v===i).length>Math.max(1,T*.08));
      const minSw=(()=>{const seen=new Array(T).fill(false);let c=0;for(let i=0;i<T;i++){if(seen[i])continue;let j=i;while(!seen[j]){seen[j]=true;j=ord[j]}c++}return T-c})();
      let moves=sv?sv.mv|0:0,sel=-1,t0=performance.now()-(sv?sv.el|0:0),done=false;if(sv)mgSaveDel("puz");
      B.innerHTML='<div class="whohd"><span>🧩 <b>'+T+'</b> piezas</span><span>⏱️ <b id="pzT">0:00</b></span><span>🔄 <b id="pzM">0</b></span><span>✅ <b id="pzOk">0</b>/'+T+'</span></div>'+
        '<div class="pzwrap" style="--n:'+N+';--c1:'+(TC[tys(mon)[0]]||"#4a6ae0")+';--c2:'+(TC[tys(mon)[1]||"fairy"]||"#ff8ad8")+'"><div class="pzb" id="pzB"></div><img class="pzref" id="pzRef" alt=""></div>'+
        '<div class="mgbtns"><button class="alt" id="pzPeek">👁️ Ver la imagen (mantén pulsado)</button><button class="alt" id="pzSave">💾 Guardar y salir</button></div>';
      const box=$("pzB"),ref=$("pzRef");
      const draw=()=>{let ok=0;box.innerHTML=ord.map((v,i)=>{const good=v===i;if(good)ok++;const x=v%N,y=Math.floor(v/N);
          return '<div class="pzp'+(good?' ok':'')+(i===sel?' sel':'')+'" data-pz="'+i+'" style="--img:url(\''+src+'\');background-position:'+(N>1?x*100/(N-1):0)+'% '+(N>1?y*100/(N-1):0)+'%"></div>'}).join("");
        $("pzOk").textContent=ok;$("pzM").textContent=moves;return ok};
      const im=new Image();im.onload=()=>{draw()};im.onerror=()=>{tries++;const id=(/\/(\d+)\.png/.exec(src)||[])[1];if(tries===1&&id&&typeof SPRU2!=="undefined"){src=SPRU2+"other/home/"+id+".png"}else if(tries<4){mon=pool[Math.floor(Math.random()*pool.length)];src=mgImgSrc(mon)}else{draw();return}im.src=src;ref.src=src;draw()};im.src=src;ref.src=src;draw();
      const tick=()=>{if(done)return;const s=Math.floor((performance.now()-t0)/1000),e=$("pzT");if(e)e.textContent=Math.floor(s/60)+":"+String(s%60).padStart(2,"0");MG.raf=requestAnimationFrame(tick)};MG.raf=requestAnimationFrame(tick);
      const swap=(a,b)=>{if(done||a===b||a<0||b<0||ord[a]===a||ord[b]===b)return;[ord[a],ord[b]]=[ord[b],ord[a]];moves++;sel=-1;snd(ord[a]===a||ord[b]===b?"lvl":"ui");
        const ok=draw();[a,b].forEach(i=>{if(ord[i]===i){const el=box.querySelector('[data-pz="'+i+'"]');if(el&&!hubCalm())el.animate([{transform:"scale(1.15)",filter:"brightness(1.6)"},{transform:"none",filter:"none"}],{duration:300})}});
        if(ok===T)win()};
      const win=()=>{done=true;MG.onClose=null;cancelAnimationFrame(MG.raf);const t=(performance.now()-t0)/1000,par=T*3.2+8,base=T*40,eff=Math.min(1,minSw/Math.max(1,moves)),spd=Math.min(1,par/Math.max(1,t));
        const sc=Math.round(base*(.5+.5*spd)*(.6+.4*eff));mgSet(sc);box.classList.add("pzdone");snd("win");mgConfetti();try{cry(mon[0])}catch(e){}
        B.querySelector(".mgbtns").innerHTML='<p class="pzres">¡Es <b>'+esc(mon[0])+'</b>! · '+Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,"0")+' · '+moves+' cambios (mínimo '+minSw+')</p>';
        mgT(()=>end(sc),2600)};
      // tocar dos piezas o arrastrar una encima de otra
      let down=-1;
      box.addEventListener("pointerdown",e=>{const p=e.target.closest("[data-pz]");if(!p||done)return;const i=+p.dataset.pz;if(ord[i]===i)return;down=i;try{box.setPointerCapture(e.pointerId)}catch(x){}});
      box.addEventListener("pointerup",e=>{if(down<0||done)return;const el=document.elementFromPoint(e.clientX,e.clientY),p=el&&el.closest&&el.closest("[data-pz]"),i=p?+p.dataset.pz:-1,d=down;down=-1;
        if(i>=0&&i!==d){swap(d,i);return}
        if(i===d){if(sel<0){sel=d;draw()}else if(sel===d){sel=-1;draw()}else swap(sel,d)}});
      // se guarda con «Guardar y salir», al cerrar con la ✕ o Esc, y si se cierra la página
      MG.onClose=()=>{if(done)return;mgSavePut("puz",{N:N,m:mon[0],src:src,ord:ord.slice(),mv:moves,el:Math.round(performance.now()-t0),at:Date.now()});toast("💾 Rompecabezas guardado. Puedes seguir cuando quieras.")};
      $("pzSave").onclick=()=>{if(!done)mgClose()};
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

// ---------------- PUZLE DE PIEZAS: un puzle de verdad, con piezas que encajan unas con otras ----------------
// Las piezas empiezan sueltas debajo del tablero; se arrastran a su sitio y, si quedan cerca, encajan solas.
// Coordenadas en «anchos de la zona de juego» (0-1) para que se vea igual en cualquier pantalla.
const JG_BX=.17,JG_BY=.04,JG_BW=.66;
// borde de una pieza de (x0,y0) a (x1,y1); t: 0 recto, 1 saliente, -1 entrante
function jgEdge(g,x0,y0,x1,y1,t){const dx=x1-x0,dy=y1-y0;if(!t){g.lineTo(x1,y1);return}
  const nx=dy*t,ny=-dx*t,P=(u,v)=>[x0+dx*u+nx*v,y0+dy*u+ny*v],L=(u,v)=>{const p=P(u,v);g.lineTo(p[0],p[1])},C=(a,b,c,d,e,f)=>{const p=P(a,b),q=P(c,d),r=P(e,f);g.bezierCurveTo(p[0],p[1],q[0],q[1],r[0],r[1])};
  L(.36,0);C(.42,.02,.30,.22,.5,.22);C(.70,.22,.58,.02,.64,0);g.lineTo(x1,y1)}
function jgPath(c,m,e){const g=new Path2D();g.moveTo(m,m);jgEdge(g,m,m,m+c,m,e[0]);jgEdge(g,m+c,m,m+c,m+c,e[1]);jgEdge(g,m+c,m+c,m,m+c,e[2]);jgEdge(g,m,m+c,m,m,e[3]);g.closePath();return g}
const G_JIG={id:"jig",n:"Puzle de piezas",ic:"🧷",c:"#2f9e8f",d:"Un puzle como los de verdad: las piezas tienen salientes y huecos, empiezan sueltas y tienes que montarlo desde cero. Elige de 9 a 100 piezas. Puedes guardar la partida y seguir otro día.",
  rw:s=>s*45,
  start(B,end){
    const pick=()=>{const sv=mgSaveGet("jig");
      B.innerHTML=mgSaveHTML(sv,s=>s.N*s.N+" piezas · "+mgClk(s.el)+" · "+s.p.filter(q=>q[2]).length+" encajadas")+'<div class="pzpick"><h3>¿De cuántas piezas quieres el puzle?</h3><div class="pzsz">'+PZ_SIZES.map(n=>'<button data-jgn="'+n+'"><b>'+(n*n)+'</b><small>'+n+'×'+n+'</small><i>×'+fmt(n*n*50)+' pts</i></button>').join("")+'</div><small class="mut">Arrastra cada pieza a su sitio en el tablero: si la sueltas cerca, encaja sola.</small></div>';
      B.querySelectorAll("[data-jgn]").forEach(b=>b.onclick=()=>{snd("ui");if(sv)mgSaveDel("jig");play(+b.dataset.jgn)});
      mgSaveBind(B,sv,()=>play(sv.N,sv))};
    const play=(N,sv)=>{
      const pool=P.filter(p=>p[2]!=="M");let mon=sv&&PM[sv.m]?PM[sv.m]:pool[Math.floor(Math.random()*pool.length)],src=sv&&sv.src?sv.src:mgImgSrc(mon),tries=0;
      const T=N*N,s=JG_BW/N,m=s*.25,rnd=()=>Math.random()<.5?1:-1;
      // salientes de las uniones: h = entre una fila y la de debajo, v = entre una columna y la de la derecha
      const okArr=(a,n)=>Array.isArray(a)&&a.length===n&&a.every(x=>x===1||x===-1);
      const H=sv&&okArr(sv.h,(N-1)*N)?sv.h.slice():Array.from({length:(N-1)*N},rnd),V=sv&&okArr(sv.v,N*(N-1))?sv.v.slice():Array.from({length:N*(N-1)},rnd);
      const edges=i=>{const r=Math.floor(i/N),c=i%N;return [r>0?-H[(r-1)*N+c]:0,c<N-1?V[r*(N-1)+c]:0,r<N-1?H[r*N+c]:0,c>0?-V[r*(N-1)+c-1]:0]};
      const perRow=Math.max(3,Math.floor(1/(s*1.3))),rows=Math.ceil(T/perRow),trayH=Math.min(.62,Math.max(.34,rows*s*1.25+s*.7)),AH=JG_BY+JG_BW+.04+trayH;
      // piezas: x,y = esquina del cuadrado (sin salientes); l = encajada; z = orden de dibujo
      const PC=[...Array(T).keys()].map(i=>({i,x:0,y:0,l:false,z:i,cv:null,path:null}));
      const home=i=>[JG_BX+(i%N)*s,JG_BY+Math.floor(i/N)*s];
      const scatter=list=>{const L=list.slice();for(let i=L.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[L[i],L[j]]=[L[j],L[i]]}
        const top=JG_BY+JG_BW+.04+m,rs=Math.min(s*1.25,(trayH-s-2*m)/Math.max(1,Math.ceil(L.length/perRow)-1||1)),cs=1/perRow;
        L.forEach((p,k)=>{p.x=Math.min(1-s-m,Math.max(m,(k%perRow+.5)*cs-s/2+(Math.random()-.5)*cs*.25));p.y=Math.min(AH-s-m,Math.max(top,top+Math.floor(k/perRow)*rs+(Math.random()-.5)*s*.2))})};
      if(sv&&Array.isArray(sv.p)&&sv.p.length===T)sv.p.forEach((q,i)=>{const p=PC[i];p.l=!!q[2];if(p.l){[p.x,p.y]=home(i)}else{p.x=+q[0]||0;p.y=+q[1]||0}});else scatter(PC);
      let zTop=T+1,t0=performance.now()-(sv?sv.el|0:0),done=false,ready=false;if(sv)mgSaveDel("jig");
      const c1=TC[tys(mon)[0]]||"#4a6ae0",c2=TC[tys(mon)[1]||"fairy"]||"#ff8ad8";
      B.innerHTML='<div class="whohd"><span>🧷 <b>'+T+'</b> piezas</span><span>⏱️ <b id="jgT">0:00</b></span><span>✅ <b id="jgOk">0</b>/'+T+'</span></div>'+
        '<div class="jgw" id="jgW" style="aspect-ratio:1/'+AH.toFixed(4)+'"><div class="jgbd" id="jgBd" style="left:'+JG_BX*100+'%;top:'+(JG_BY/AH*100)+'%;width:'+JG_BW*100+'%;height:'+(JG_BW/AH*100)+'%;--c1:'+c1+';--c2:'+c2+'"><img alt="" id="jgRef"></div><div class="jgld">Cargando las piezas…</div></div>'+
        '<div class="mgbtns"><button class="alt" id="jgPeek">👁️ Ver la imagen</button><button class="alt" id="jgMix">🧺 Recoger las sueltas</button><button class="alt" id="jgSave">💾 Guardar y salir</button></div>';
      const W=$("jgW"),ref=$("jgRef");let wpx=W.clientWidth||400;
      const okN=()=>PC.filter(p=>p.l).length;
      const place=p=>{const e=p.cv;if(!e)return;e.style.left=(p.x-m)*wpx+"px";e.style.top=(p.y-m)*wpx+"px";e.style.width=e.style.height=(s+2*m)*wpx+"px";e.style.zIndex=p.l?1:10+p.z;e.classList.toggle("ok",p.l)};
      const layout=()=>{wpx=W.clientWidth||wpx;PC.forEach(place)};
      const ro=typeof ResizeObserver!=="undefined"?new ResizeObserver(()=>{if(!W.isConnected){ro.disconnect();return}layout()}):null;if(ro)ro.observe(W);
      let cpx=0;
      const build=img=>{
        cpx=Math.max(28,Math.min(180,Math.round(JG_BW*wpx*(window.devicePixelRatio||1)/N)));const R=cpx*N,bd=document.createElement("canvas");bd.width=bd.height=R;const g=bd.getContext("2d");
        // fondo con un paisaje sencillo (sol, nubes, colinas y luz que cambia de un lado a otro): cada zona es distinta y se sabe dónde va cada pieza
        const lg=g.createLinearGradient(0,0,0,R),mix=(a,b,k)=>{const h=x=>[1,3,5].map(o=>parseInt(x.slice(o,o+2),16));try{const A=h(a),Bc=h(b);return "rgb("+A.map((v,n)=>Math.round(v+(Bc[n]-v)*k)).join(",")+")"}catch(e){return a}};
        lg.addColorStop(0,mix(c1,"#ffffff",.55));lg.addColorStop(.55,c1);lg.addColorStop(1,c2);g.fillStyle=lg;g.fillRect(0,0,R,R);
        const hg=g.createLinearGradient(0,0,R,0);hg.addColorStop(0,"rgba(255,255,255,.28)");hg.addColorStop(.45,"rgba(255,255,255,0)");hg.addColorStop(1,"rgba(0,0,0,.16)");g.fillStyle=hg;g.fillRect(0,0,R,R);
        g.fillStyle="rgba(255,249,205,.4)";g.beginPath();g.arc(R*.18,R*.18,R*.13,0,Math.PI*2);g.fill();g.fillStyle="rgba(255,249,205,.98)";g.beginPath();g.arc(R*.18,R*.18,R*.08,0,Math.PI*2);g.fill();
        g.fillStyle="rgba(255,255,255,.9)";g.beginPath();g.ellipse(R*.74,R*.16,R*.13,R*.06,0,0,Math.PI*2);g.fill();g.fillStyle="rgba(255,255,255,.75)";g.beginPath();g.ellipse(R*.84,R*.2,R*.09,R*.05,0,0,Math.PI*2);g.fill();
        g.fillStyle=mix(c2,"#000000",.22);g.beginPath();g.ellipse(R*.92,R*1.04,R*.6,R*.32,0,0,Math.PI*2);g.fill();
        g.fillStyle=mix(c2,"#000000",.45);g.beginPath();g.ellipse(R*.22,R*1.02,R*.75,R*.26,0,0,Math.PI*2);g.fill();
        if(img&&img.naturalWidth){const pd=R*.06,sz=R-pd*2,k=Math.min(sz/img.naturalWidth,sz/img.naturalHeight),w=img.naturalWidth*k,h=img.naturalHeight*k;g.shadowColor="rgba(0,0,0,.35)";g.shadowBlur=R*.02;g.drawImage(img,(R-w)/2,(R-h)/2,w,h);g.shadowBlur=0}
        const mp=Math.round(cpx*.25),S2=cpx+2*mp;
        PC.forEach(p=>{const cv=document.createElement("canvas");cv.width=cv.height=S2;cv.className="jgp";const x=cv.getContext("2d"),path=jgPath(cpx,mp,edges(p.i));
          x.save();x.clip(path);x.drawImage(bd,mp-(p.i%N)*cpx,mp-Math.floor(p.i/N)*cpx);x.restore();
          x.lineWidth=Math.max(1,cpx*.025);x.strokeStyle="rgba(255,255,255,.55)";x.stroke(path);x.lineWidth=Math.max(1,cpx*.012);x.strokeStyle="rgba(0,0,0,.45)";x.stroke(path);
          p.cv=cv;p.path=path;W.appendChild(cv)});
        const rc=document.createElement("canvas");rc.width=rc.height=Math.min(R,600);rc.getContext("2d").drawImage(bd,0,0,rc.width,rc.height);$("jgBd").appendChild(rc);const ld=W.querySelector(".jgld");if(ld)ld.remove();ready=true;layout();$("jgOk").textContent=okN();if(okN()===T)win()};
      const hc=document.createElement("canvas").getContext("2d");
      const hit=(ux,uy)=>{const L=PC.filter(p=>!p.l&&p.path).sort((a,b)=>b.z-a.z);
        for(const p of L){const lx=ux-(p.x-m),ly=uy-(p.y-m),sz=s+2*m;if(lx<0||ly<0||lx>sz||ly>sz)continue;const k=(cpx+2*Math.round(cpx*.25))/sz;if(hc.isPointInPath(p.path,lx*k,ly*k))return p}
        return null};
      const im=new Image();im.onload=()=>build(im);im.onerror=()=>{tries++;const id=(/\/(\d+)\.png/.exec(src)||[])[1];if(tries===1&&id&&typeof SPRU2!=="undefined"){src=SPRU2+"other/home/"+id+".png"}else if(tries<4&&!sv){mon=pool[Math.floor(Math.random()*pool.length)];src=mgImgSrc(mon)}else{build(null);return}im.src=src;ref.src=src};im.src=src;ref.src=src;
      const tick=()=>{if(done)return;const e=$("jgT");if(!e)return;e.textContent=mgClk(performance.now()-t0);MG.raf=requestAnimationFrame(tick)};MG.raf=requestAnimationFrame(tick);
      // arrastrar
      let dr=null;
      const pt=e=>{const r=W.getBoundingClientRect();return [(e.clientX-r.left)/wpx,(e.clientY-r.top)/wpx]};
      W.addEventListener("pointerdown",e=>{if(done||!ready)return;const [ux,uy]=pt(e),p=hit(ux,uy);if(!p)return;e.preventDefault();p.z=zTop++;dr={p,dx:ux-p.x,dy:uy-p.y,id:e.pointerId};p.cv.classList.add("drag");place(p);try{W.setPointerCapture(e.pointerId)}catch(x){}});
      W.addEventListener("pointermove",e=>{if(!dr||e.pointerId!==dr.id)return;const [ux,uy]=pt(e),p=dr.p;p.x=Math.min(1-s*.5,Math.max(-s*.5,ux-dr.dx));p.y=Math.min(AH-s*.5,Math.max(-s*.5,uy-dr.dy));place(p)});
      const up=e=>{if(!dr||e.pointerId!==dr.id)return;const p=dr.p;dr=null;p.cv.classList.remove("drag");const [hx,hy]=home(p.i);
        if(Math.abs(p.x-hx)<s*.3&&Math.abs(p.y-hy)<s*.3){p.x=hx;p.y=hy;p.l=true;place(p);snd("lvl");if(!hubCalm())p.cv.animate([{filter:"brightness(1.7)"},{filter:"none"}],{duration:350});const k=okN();$("jgOk").textContent=k;if(k===T)win()}
        else{place(p);snd("ui")}};
      W.addEventListener("pointerup",up);W.addEventListener("pointercancel",up);
      const win=()=>{if(done)return;done=true;MG.onClose=null;cancelAnimationFrame(MG.raf);const t=(performance.now()-t0)/1000,par=T*6+20,spd=Math.min(1,par/Math.max(1,t)),sc=Math.round(T*50*(.5+.5*spd));
        mgSet(sc);W.classList.add("jgdone");snd("win");mgConfetti();try{cry(mon[0])}catch(e){}
        B.querySelector(".mgbtns").innerHTML='<p class="pzres">¡Es <b>'+esc(mon[0])+'</b>! · '+T+' piezas en '+mgClk(t*1000)+'</p>';
        mgT(()=>end(sc),2600)};
      $("jgPeek").onclick=()=>{$("jgBd").classList.toggle("peek")};
      $("jgMix").onclick=()=>{if(done||!ready)return;snd("ui");scatter(PC.filter(p=>!p.l));layout()};
      // se guarda con «Guardar y salir», al cerrar con la ✕ o Esc, y si se cierra la página
      MG.onClose=()=>{if(done)return;const r4=v=>Math.round(v*1e4)/1e4;
        mgSavePut("jig",{N:N,m:mon[0],src:src,h:H,v:V,p:PC.map(p=>p.l?[0,0,1]:[r4(p.x),r4(p.y),0]),el:Math.round(performance.now()-t0),at:Date.now()});toast("💾 Puzle guardado. Puedes seguir cuando quieras.")};
      $("jgSave").onclick=()=>{if(!done)mgClose()};
    };
    mgSet(0);pick();
  }};

// si se cierra o recarga la página con un puzle a medias, también se guarda
window.addEventListener("pagehide",()=>{if(MG.onClose){const f=MG.onClose;MG.onClose=null;try{f()}catch(e){}}});
MGS.push(G_PUZ,G_JIG,G_HL);
// entran en la rotación del Torneo semanal a partir de la semana que viene (no cambia el torneo en curso)
TOUR_ROT.push(["2026-W46","who mem dig fish thr run exc wgt fos puz hl"]);
TOUR_ROT.push(["2026-W47","who mem dig fish thr run exc wgt fos puz jig hl"]);
Object.assign(MGHOW,{
  jig:["Elige de <b>9 a 100 piezas</b>: cada pieza vale hasta <b>50 puntos</b> (con 100 piezas, hasta 5.000).","Las piezas empiezan sueltas debajo del tablero. Arrástralas a su sitio: si la sueltas cerca, <b>encaja sola</b> y se queda fija.","Fíjate en la forma: cada pieza tiene salientes y huecos que solo encajan con sus vecinas. Las de los bordes tienen un lado recto.","<b>Rapidez</b>: la mitad de los puntos dependen de lo rápido que termines.","<b>👁️ Ver la imagen</b> muestra el dibujo en el tablero; <b>🧺 Recoger las sueltas</b> vuelve a ordenar las piezas sueltas.","<b>💾 Guardar y salir</b> (o cerrar con la ✕) guarda el puzle tal cual, con el tiempo parado, para seguir otro día."],
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
function ckBadges(){const K=ckKeys();ckBtns().forEach((b,i)=>{if(i>3)return;let s=b.querySelector(".ckk");if(!s){s=document.createElement("span");s.className="ckk noi18n";b.appendChild(s)}const t=/^mouse/.test(K[i])?"🖱️":tkLabel(K[i]);if(s.textContent!==t)s.textContent=t})}
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
