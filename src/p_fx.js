// ================= efectos de combate: motor de partículas en canvas (luz aditiva, estelas, rayos, ondas) =================
const BTE=()=>document.querySelector("#arena .bt")||document.querySelector(".bt");
function pos(id){const el=$(id),a=(el.querySelector("img,svg")||el).getBoundingClientRect(),b=BTE().getBoundingClientRect();return{x:a.left-b.left+a.width/2,y:a.top-b.top+a.height/2,w:a.width,h:a.height}}
function mkfx(t,x,y,sz){const e=document.createElement("span");e.className="pj";e.textContent=t;e.style.left=x+"px";e.style.top=y+"px";e.style.fontSize=(sz||30)+"px";fxL().appendChild(e);return e}
function burst(t,p,n,r,sz){if(!O.fx)return;for(let i=0;i<n;i++){const e=mkfx(t,p.x,p.y,sz||22),a=Math.PI*2*i/n;e.animate([{transform:"translate(0,0) scale(.5)",opacity:1},{transform:"translate("+Math.cos(a)*r+"px,"+Math.sin(a)*r+"px) scale(1.2)",opacity:0}],{duration:600,easing:"ease-out"}).onfinish=()=>e.remove()}}
function shake(px,dur){if(!O.fx)return;px=px||7;const k=[];for(let i=0;i<8;i++){const f=1-i/8;k.push({transform:"translate("+((i%2?1:-1)*px*f)+"px,"+((i%3-1)*px*.5*f)+"px)"})}k.push({transform:"translate(0,0)"});BTE().animate(k,{duration:dur||360})}
const FXC={normal:["#ffffff","#f1ead8","#c9b79c"],fire:["#fff6b0","#ffa62b","#f03c12"],water:["#eefaff","#6cc6ff","#1d6fd8"],grass:["#efffc8","#79d84a","#24852a"],electric:["#fffbe0","#ffe34a","#f59a00"],psychic:["#ffe6f7","#ff78cf","#a8329a"],ghost:["#ecdcff","#9a6ad8","#2e1a58"],dragon:["#e6e8ff","#7f7cff","#3424b0"],bug:["#f4ffc8","#b4d83a","#5e7c10"],poison:["#f6dcff","#c46ae2","#5e2280"],rock:["#f3e4c0","#c4a165","#6e5530"],ground:["#f6e2b8","#d8a85a","#7a5424"],steel:["#ffffff","#c4ccdc","#6c7890"],ice:["#ffffff","#a6ecff","#3ca6d8"],fighting:["#ffe0c8","#ff8a4a","#b02a10"],flying:["#ffffff","#c8dcff","#7f9ad8"],dark:["#d8c8d8","#6a4a5a","#1e1218"],fairy:["#fff0fa","#ffb0e0","#e05aa8"]};
function fxL(){let l=BTE().querySelector(".fxl");if(!l){l=document.createElement("div");l.className="fxl";BTE().appendChild(l)}return l}
const fxR=(a,b)=>a+Math.random()*(b-a);
function fxEl(html,x,y,cls){const e=document.createElement("div");e.className="fxp"+(cls?" "+cls:"");e.innerHTML=html;e.style.left=x+"px";e.style.top=y+"px";fxL().appendChild(e);return e}
function fxAnim(e,k,o){const a=e.animate(k,Object.assign({fill:"both"},o));return a.finished.then(()=>e.remove(),()=>e.remove())}
function fxFlash(c,op,d){const e=document.createElement("div");e.className="fxflash";e.style.background=c;fxL().appendChild(e);return fxAnim(e,[{opacity:0},{opacity:op||.6,offset:.25},{opacity:0}],{duration:(d||420)/pxSpd()})}
function fxTint(id,f,d){const e=$(id);if(!e)return;e.animate([{filter:"none"},{filter:f,offset:.3},{filter:f,offset:.7},{filter:"none"}],{duration:(d||500)/pxSpd()})}
function fxLunge(id,f,t,d){const e=$(id);if(!e)return Promise.resolve();const dx=(t.x-f.x)*.42,dy=(t.y-f.y)*.42;return e.animate([{translate:"0 0"},{translate:(-dx*.14)+"px "+(-dy*.14)+"px",offset:.3},{translate:dx+"px "+dy+"px",offset:.58},{translate:dx*.9+"px "+dy*.9+"px",offset:.66},{translate:"0 0"}],{duration:(d||480)/pxSpd(),easing:"ease-in-out"}).finished.catch(()=>{})}
// ---------------- motor de particulas ----------------
const PX={cv:null,c:null,ps:[],dr:[],raf:0,last:0,w:0,h:0};
const pxSpd=()=>(typeof B!=="undefined"&&B&&$("arena")&&!$("arena").hidden?BS:1)||1;
function pxCv(){
  const bt=BTE();if(!bt)return null;let cv=bt.querySelector("canvas.fxc");
  if(!cv){cv=document.createElement("canvas");cv.className="fxc";bt.appendChild(cv)}
  const w=bt.clientWidth,h=bt.clientHeight,d=Math.min(2,window.devicePixelRatio||1);
  if(cv.width!==Math.round(w*d)||cv.height!==Math.round(h*d)){cv.width=Math.round(w*d);cv.height=Math.round(h*d)}
  PX.cv=cv;PX.c=cv.getContext("2d");PX.c.setTransform(d,0,0,d,0,0);PX.w=w;PX.h=h;return cv;
}
const _rgb={};
function pxRgb(c){if(_rgb[c])return _rgb[c];const h=c.replace("#","");return _rgb[c]=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function pxMix(cs,t){if(typeof cs==="string")return cs;if(cs.length===1)return cs[0];const f=Math.max(0,Math.min(.9999,t))*(cs.length-1),i=Math.floor(f),k=f-i,a=pxRgb(cs[i]),b=pxRgb(cs[i+1]);return"rgb("+Math.round(a[0]+(b[0]-a[0])*k)+","+Math.round(a[1]+(b[1]-a[1])*k)+","+Math.round(a[2]+(b[2]-a[2])*k)+")"}
const _glow={};
function pxGlow(c){c=c||"#ffffff";if(_glow[c])return _glow[c];const g=document.createElement("canvas");g.width=g.height=64;const x=g.getContext("2d"),r=x.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,c);r.addColorStop(.25,c);r.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=r;x.globalAlpha=1;x.fillRect(0,0,64,64);
  const r2=x.createRadialGradient(32,32,0,32,32,32);r2.addColorStop(0,c);r2.addColorStop(.6,"rgba(0,0,0,0)");return _glow[c]=g}
function pxAdd(p){if(!O.fx||!pxCv())return;if(PX.ps.length>1100)PX.ps.splice(0,60);
  p.t=0;p.life=p.life||.6;p.vx=p.vx||0;p.vy=p.vy||0;p.a=p.a==null?1:p.a;p.rot=p.rot||0;PX.ps.push(p);pxRun()}
function pxDraw(dur,fn,o){if(!O.fx||!pxCv())return Promise.resolve();return new Promise(res=>{PX.dr.push(Object.assign({t:0,d:dur/1000,fn:fn,res:res},o||{}));pxRun()})}
function pxRun(){if(PX.raf)return;PX.last=performance.now();
  const step=now=>{const dt=Math.max(0,Math.min(.05,(now-PX.last)/1000))*pxSpd();PX.last=Math.max(PX.last,now);try{pxFrame(dt)}catch(e){console.warn("fx",e);PX.ps=[];PX.dr.forEach(d=>{try{d.res()}catch(x){}});PX.dr=[]}
    if(PX.ps.length||PX.dr.length)PX.raf=requestAnimationFrame(step);else{PX.raf=0;if(PX.c)PX.c.clearRect(0,0,PX.w,PX.h)}};
  PX.raf=requestAnimationFrame(step)}
function pxFrame(dt){
  if(!PX.cv||!PX.cv.isConnected){PX.ps=[];PX.dr.forEach(d=>d.res());PX.dr=[];return}
  const c=PX.c;c.clearRect(0,0,PX.w,PX.h);
  // capas de fondo (tintes) primero
  for(let i=0;i<PX.dr.length;i++){const d=PX.dr[i];if(!d.bg)continue;d.t+=dt;c.save();try{d.fn(c,Math.max(0,Math.min(1,d.t/d.d)),d)}catch(e){d.t=d.d}c.restore()}
  for(let i=PX.ps.length-1;i>=0;i--){const p=PX.ps[i];p.t+=dt;if(p.t>=p.life){PX.ps.splice(i,1);continue}
    if(p.dl&&p.t<p.dl)continue;
    const k=Math.pow(p.dr||1,dt*60);p.vx=p.vx*k+(p.ax||0)*dt;p.vy=p.vy*k+(p.ay||0)*dt;
    if(p.to){const dx=p.to.x-p.x,dy=p.to.y-p.y;p.vx+=dx*(p.pull||8)*dt;p.vy+=dy*(p.pull||8)*dt}
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=(p.vr||0)*dt;if(p.wob)p.x+=Math.sin(p.t*p.wob[1]+(p.ph||0))*p.wob[0]*dt;
    try{pxPart(c,p,p.t/p.life)}catch(e){PX.ps.splice(i,1)}}
  for(let i=PX.dr.length-1;i>=0;i--){const d=PX.dr[i];if(!d.bg){d.t+=dt;c.save();try{d.fn(c,Math.max(0,Math.min(1,d.t/d.d)),d)}catch(e){d.t=d.d}c.restore()}if(d.t>=d.d){PX.dr.splice(i,1);d.res()}}
}
function pxPart(c,p,u){
  const sz=(p.sz||6)*(p.sz1==null?1:1+(p.sz1-1)*u),al=(p.a1==null?p.a*(1-u):p.a+(p.a1-p.a)*u)*(p.fi&&u<p.fi?u/p.fi:1);if(al<=.01||sz<=.1)return;
  const col=pxMix(p.c||"#fff",u);c.globalAlpha=Math.min(1,al);c.globalCompositeOperation=p.add?"lighter":"source-over";
  const sh=p.sh||"dot";
  if(sh==="glow"){const g=pxGlow(typeof p.c==="string"?p.c:Array.isArray(p.c)?p.c[Math.max(0,Math.min(p.c.length-1,Math.floor(u*p.c.length)))]:"#ffffff");c.drawImage(g,p.x-sz,p.y-sz,sz*2,sz*2);return}
  c.fillStyle=col;c.strokeStyle=col;
  if(sh==="dot"){c.beginPath();c.arc(p.x,p.y,sz,0,6.283);c.fill();return}
  if(sh==="streak"){const v=Math.hypot(p.vx,p.vy)||1,L=Math.min(80,v*(p.st||.05));c.lineCap="round";c.lineWidth=sz;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx/v*L,p.y-p.vy/v*L);c.stroke();return}
  if(sh==="ring"){c.lineWidth=p.lw||3;c.beginPath();c.arc(p.x,p.y,sz,0,6.283);c.stroke();return}
  c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.scale(sz/10,sz/10);c.beginPath();
  switch(sh){
    case "leaf":c.moveTo(-10,0);c.quadraticCurveTo(0,-8,10,0);c.quadraticCurveTo(0,8,-10,0);c.fill();c.strokeStyle="rgba(0,60,0,.55)";c.lineWidth=1.2;c.beginPath();c.moveTo(-9,0);c.lineTo(9,0);c.stroke();break;
    case "shard":c.moveTo(0,-11);c.lineTo(4,0);c.lineTo(0,11);c.lineTo(-4,0);c.closePath();c.fill();c.fillStyle="rgba(255,255,255,.75)";c.beginPath();c.moveTo(0,-9);c.lineTo(1.6,0);c.lineTo(0,2);c.closePath();c.fill();break;
    case "rock":c.moveTo(-9,3);c.lineTo(-6,-7);c.lineTo(3,-9);c.lineTo(9,-2);c.lineTo(7,7);c.lineTo(-3,9);c.closePath();c.fill();c.fillStyle="rgba(0,0,0,.28)";c.beginPath();c.moveTo(9,-2);c.lineTo(7,7);c.lineTo(-3,9);c.lineTo(2,1);c.closePath();c.fill();c.fillStyle="rgba(255,255,255,.3)";c.beginPath();c.moveTo(-6,-7);c.lineTo(3,-9);c.lineTo(0,-3);c.closePath();c.fill();break;
    case "star":for(let i=0;i<8;i++){const r=i%2?3:10,a=i*Math.PI/4;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fill();break;
    case "star5":for(let i=0;i<10;i++){const r=i%2?4.2:10,a=-Math.PI/2+i*Math.PI/5;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fill();break;
    case "heart":c.moveTo(0,8);c.bezierCurveTo(-12,0,-8,-11,0,-4);c.bezierCurveTo(8,-11,12,0,0,8);c.fill();break;
    case "drop":c.moveTo(0,-10);c.quadraticCurveTo(8,2,0,9);c.quadraticCurveTo(-8,2,0,-10);c.fill();c.fillStyle="rgba(255,255,255,.7)";c.beginPath();c.arc(-2,1,2,0,6.283);c.fill();break;
    case "bubble":c.lineWidth=1.6;c.arc(0,0,9,0,6.283);c.globalAlpha*=.9;c.stroke();c.globalAlpha*=.35;c.fill();c.globalAlpha/=.35;c.fillStyle="#fff";c.beginPath();c.arc(-3.5,-3.5,2.4,0,6.283);c.fill();break;
    case "feather":c.moveTo(-10,0);c.quadraticCurveTo(-2,-5,10,-1);c.quadraticCurveTo(-2,5,-10,0);c.fill();break;
    case "bolt":c.moveTo(2,-11);c.lineTo(-5,1);c.lineTo(0,1);c.lineTo(-3,11);c.lineTo(6,-2);c.lineTo(1,-2);c.closePath();c.fill();break;
    case "fist":c.arc(0,0,8,0,6.283);c.fill();c.fillStyle="rgba(0,0,0,.25)";for(let i=0;i<3;i++){c.fillRect(-6+i*4.4,-2,1,7)}break;
    case "crescent":c.arc(0,0,10,-1.9,1.9);c.arc(-5,0,8,1.3,-1.3,true);c.closePath();c.fill();break;
    default:c.arc(0,0,10,0,6.283);c.fill();
  }
  c.restore();
}
// ---------------- recetas de particulas por tipo ----------------
const PXT={
  fire:{c:["#ffffff","#fff1a0","#ffb030","#ff5a14","#a01c08"],sh:"glow",add:1,ay:-260,dr:.94,sz:[10,20],sz1:.35,life:[.35,.7]},
  water:{c:["#ffffff","#bfeaff","#4fb0ff","#1d6fd8"],sh:"drop",ay:520,dr:.98,sz:[4,8],life:[.45,.8]},
  grass:{c:["#d6ff9a","#79d84a","#2f8a2a"],sh:"leaf",dr:.95,sz:[6,10],life:[.6,1],vr:[-9,9],ay:60},
  electric:{c:["#ffffff","#fff59a","#ffd21a","#ff9a00"],sh:"streak",add:1,dr:.9,sz:[1.6,3],st:.04,life:[.2,.42]},
  ice:{c:["#ffffff","#d8f6ff","#8fe0ff","#3ca6d8"],sh:"shard",dr:.95,sz:[5,9],life:[.5,.9],vr:[-6,6],ay:90},
  rock:{c:["#d9c08a","#b08a50","#6e5530"],sh:"rock",ay:700,dr:.99,sz:[5,10],life:[.6,1],vr:[-6,6]},
  ground:{c:["#f2dcae","#c9984e","#7a5424"],sh:"rock",ay:620,dr:.98,sz:[3,7],life:[.5,.9],vr:[-5,5]},
  psychic:{c:["#ffffff","#ffb4e8","#ff5ec8","#a8329a"],sh:"glow",add:1,dr:.93,sz:[8,16],life:[.4,.8]},
  ghost:{c:["#efe2ff","#b48cff","#6a3ab0","#2e1a58"],sh:"glow",add:1,dr:.95,sz:[10,20],life:[.5,1],ay:-60},
  dragon:{c:["#ffffff","#b8b6ff","#6e6aff","#3424b0"],sh:"glow",add:1,dr:.93,sz:[9,18],life:[.4,.8]},
  dark:{c:["#6a4a5a","#3a2232","#120a10"],sh:"glow",dr:.94,sz:[12,22],life:[.5,.9],a:.9},
  fairy:{c:["#ffffff","#ffd0ee","#ff7ac8"],sh:"star",add:1,dr:.94,sz:[4,8],life:[.5,1],vr:[-4,4]},
  poison:{c:["#f2c4ff","#c46ae2","#7a2aa8"],sh:"bubble",dr:.95,sz:[4,8],life:[.6,1],ay:-90},
  bug:{c:["#e8ff9a","#b4d83a","#5e7c10"],sh:"dot",dr:.95,sz:[2,4],life:[.4,.8]},
  steel:{c:["#ffffff","#e6ecf6","#9aa6bc"],sh:"star",add:1,dr:.92,sz:[4,9],life:[.3,.6],vr:[-8,8]},
  fighting:{c:["#ffffff","#ffd0a0","#ff7a3a"],sh:"glow",add:1,dr:.9,sz:[8,16],life:[.25,.5]},
  flying:{c:["#ffffff","#e4eeff","#a8c0f0"],sh:"feather",dr:.95,sz:[5,9],life:[.6,1],vr:[-5,5],ay:80},
  normal:{c:["#ffffff","#fff6d8","#e8dcc0"],sh:"star",add:1,dr:.92,sz:[4,9],life:[.25,.5],vr:[-6,6]}
};
const pick=v=>Array.isArray(v)?fxR(v[0],v[1]):v;
function pxType(ty,x,y,o){o=o||{};const r=PXT[ty]||PXT.normal,a=o.a==null?fxR(0,6.283):o.a,sp=o.sp==null?fxR(60,260):o.sp;
  pxAdd({x:x,y:y,vx:Math.cos(a)*sp+(o.vx||0),vy:Math.sin(a)*sp+(o.vy||0),ax:o.ax||0,ay:o.ay==null?(r.ay||0):o.ay,dr:o.dr||r.dr,c:o.c||r.c,sh:o.sh||r.sh,add:o.add==null?r.add:o.add,sz:(o.sz||1)*pick(r.sz),sz1:o.sz1==null?r.sz1:o.sz1,
    life:(o.life||1)*pick(r.life),vr:r.vr?pick(r.vr):0,rot:fxR(0,6.283),st:r.st,a:o.al||r.a||1,dl:o.dl,to:o.to,pull:o.pull,wob:o.wob,ph:fxR(0,6),fi:o.fi})}
function pxBurst(ty,p,n,o){o=o||{};for(let i=0;i<n;i++)pxType(ty,p.x+fxR(-(o.r||6),o.r||6),p.y+fxR(-(o.r||6),o.r||6),Object.assign({},o,{a:o.ang!=null?o.ang+fxR(-(o.spr||.5),o.spr||.5):undefined,sp:o.spd?fxR(o.spd[0],o.spd[1]):undefined}))}
// destello de luz en un punto
function pxFlare(p,c,s,d){pxAdd({x:p.x,y:p.y,sh:"glow",c:"#ffffff",add:1,sz:s*.55,sz1:1.6,life:(d||.3),a:1});pxAdd({x:p.x,y:p.y,sh:"glow",c:c,add:1,sz:s,sz1:1.8,life:(d||.3)*1.4,a:.9})}
function pxRing(p,c,r0,r1,d,lw,o){return pxDraw((d||.5)*1000,(c2,u)=>{const r=r0+(r1-r0)*(1-Math.pow(1-u,2.4));c2.globalCompositeOperation=o&&o.add===false?"source-over":"lighter";c2.globalAlpha=(1-u)*.95;c2.strokeStyle=c;c2.lineWidth=(lw||5)*(1-u*.6);c2.shadowColor=c;c2.shadowBlur=14;c2.beginPath();if(o&&o.ell)c2.ellipse(p.x,p.y,r,r*o.ell,0,0,6.283);else c2.arc(p.x,p.y,r,0,6.283);c2.stroke()})}
// impacto: estrella de golpe + anillo + chispas
function pxImpact(p,ty,pow){const C=FXC[ty]||FXC.normal;pow=pow||1;
  pxFlare(p,C[1],46*pow,.28);pxRing(p,"#ffffff",8,52*pow,.32,6);pxRing(p,C[1],6,70*pow,.45,4);
  pxDraw(220,(c,u)=>{c.globalCompositeOperation="lighter";c.globalAlpha=1-u;c.translate(p.x,p.y);c.rotate(.3);const s=(.5+u*.8)*34*pow;c.fillStyle="#fffbe8";c.beginPath();for(let i=0;i<16;i++){const r=i%2?s*.32:s*(i%4===0?1:.7),a=i*Math.PI/8;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fill()});
  for(let i=0;i<10*pow;i++)pxAdd({x:p.x,y:p.y,vx:fxR(-1,1)*420,vy:fxR(-1,1)*420,sh:"streak",c:["#ffffff",C[1]],add:1,sz:2.2,st:.035,dr:.86,life:fxR(.18,.32)})}
// tinte de pantalla de fondo (como cuando cambia el fondo en los ataques fuertes)
function pxBg(c1,c2,dur,al){return pxDraw(dur,(c,u)=>{const e=u<.18?u/.18:u>.8?(1-u)/.2:1;c.globalAlpha=e*(al||.55);const g=c.createRadialGradient(PX.w/2,PX.h/2,10,PX.w/2,PX.h/2,Math.max(PX.w,PX.h)*.75);g.addColorStop(0,c1);g.addColorStop(1,c2);c.fillStyle=g;c.fillRect(0,0,PX.w,PX.h)},{bg:1})}
// rayo electrico ramificado
function pxLightning(f,t,o){o=o||{};const C=o.c||"#fff36a";
  const mk=(a,b,dep)=>{const pts=[[a.x,a.y]],n=10;for(let i=1;i<n;i++){const k=i/n;pts.push([a.x+(b.x-a.x)*k+fxR(-1,1)*(o.j||22)*(1-Math.abs(k-.5)),a.y+(b.y-a.y)*k+fxR(-1,1)*(o.j||22)*.4])}pts.push([b.x,b.y]);const br=[];if(dep<2)for(let i=0;i<2;i++){const s=pts[2+Math.floor(Math.random()*6)];br.push(mk({x:s[0],y:s[1]},{x:s[0]+fxR(-60,60),y:s[1]+fxR(10,70)},dep+1))}return{p:pts,b:br}};
  let L=mk(f,t,0),tick=0;
  return pxDraw(o.d||420,(c,u,d)=>{tick++;if(tick%3===0)L=mk(f,t,0);c.globalCompositeOperation="lighter";const fl=u<.15?1:Math.random()<.3?.35:1;c.globalAlpha=(1-u*.7)*fl;c.lineJoin="round";c.lineCap="round";
    const draw=(l,w)=>{c.beginPath();l.p.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.lineWidth=w*3.2;c.strokeStyle=C;c.shadowColor=C;c.shadowBlur=18;c.stroke();c.lineWidth=w;c.strokeStyle="#ffffff";c.shadowBlur=0;c.stroke();l.b.forEach(b=>draw(b,w*.55))};draw(L,o.w||3)})}
// rayo (haz) del atacante al objetivo
function pxBeam(f,t,ty,w,dur){const C=FXC[ty]||FXC.normal;
  return pxDraw(dur,(c,u)=>{const grow=Math.min(1,u/.22),fade=u>.78?(1-u)/.22:1,ex=f.x+(t.x-f.x)*grow,ey=f.y+(t.y-f.y)*grow,ang=Math.atan2(t.y-f.y,t.x-f.x),len=Math.hypot(ex-f.x,ey-f.y),ww=w*fade*(1+.12*Math.sin(u*80));
    c.globalCompositeOperation="lighter";c.translate(f.x,f.y);c.rotate(ang);
    const g=c.createLinearGradient(0,-ww,0,ww);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(.25,C[2]);g.addColorStop(.42,C[1]);g.addColorStop(.5,"#ffffff");g.addColorStop(.58,C[1]);g.addColorStop(.75,C[2]);g.addColorStop(1,"rgba(0,0,0,0)");
    c.globalAlpha=.95;c.fillStyle=g;c.shadowColor=C[1];c.shadowBlur=24;c.beginPath();c.moveTo(0,-ww*.35);c.lineTo(len,-ww*.5);c.arc(len,0,ww*.5,-Math.PI/2,Math.PI/2);c.lineTo(0,ww*.35);c.closePath();c.fill();
    c.globalAlpha=fade;c.drawImage(pxGlow(C[1]),-ww*1.2,-ww*1.2,ww*2.4,ww*2.4);
    for(let i=0;i<3;i++){const k=((u*6+i/3)%1)*len;c.globalAlpha=.7*fade;c.drawImage(pxGlow("#ffffff"),k-ww*.5,-ww*.5,ww,ww)}})}
// estela que sigue a un proyectil
function pxProj(ty,f,t,o){o=o||{};const C=FXC[ty]||FXC.normal,d=(o.d||.45),arc=o.arc==null?-40:o.arc,sz=o.sz||16;
  return pxDraw(d*1000,(c,u,D)=>{const e=o.lin?u:u*u*(3-2*u)*.4+u*.6,x=f.x+(t.x-f.x)*e,y=f.y+(t.y-f.y)*e+arc*4*e*(1-e);
    const vx=(t.x-f.x),vy=(t.y-f.y)+arc*4*(1-2*e);D.n=(D.n||0)+1;
    if(o.trail!==false)for(let i=0;i<(o.tn||2);i++)pxType(ty,x+fxR(-4,4),y+fxR(-4,4),{sp:fxR(10,60),vx:-vx*.15,vy:-vy*.15,sz:.7,life:.6});
    if(o.draw)o.draw(c,x,y,u,vx,vy);
    else{c.globalCompositeOperation="lighter";c.drawImage(pxGlow(C[1]),x-sz*1.6,y-sz*1.6,sz*3.2,sz*3.2);c.drawImage(pxGlow("#ffffff"),x-sz*.6,y-sz*.6,sz*1.2,sz*1.2)}})}
// mascara del sprite con franjas (subida/bajada de caracteristicas, como en los juegos)
function fxStripes(id,up,c,dur){
  const el=$(id),im=el&&el.querySelector("img");if(!im||!O.fx)return Promise.resolve();
  const a=im.getBoundingClientRect(),b=BTE().getBoundingClientRect(),o=document.createElement("div");o.className="fxmask";
  const u="url(\""+im.src+"\")";o.style.cssText="left:"+(a.left-b.left)+"px;top:"+(a.top-b.top)+"px;width:"+a.width+"px;height:"+a.height+"px;-webkit-mask-image:"+u+";mask-image:"+u+";background:repeating-linear-gradient(0deg,"+c+" 0 7px,transparent 7px 15px)";
  if(getComputedStyle(el).transform.includes("-1"))o.style.transform="scaleX(-1)";
  fxL().appendChild(o);
  return o.animate([{backgroundPosition:"0 0",opacity:0},{opacity:.85,offset:.2},{opacity:.85,offset:.8},{backgroundPosition:"0 "+(up?-90:90)+"px",opacity:0}],{duration:(dur||900)/pxSpd(),easing:"linear"}).finished.then(()=>o.remove(),()=>o.remove())}
function fxSprFlash(id,f,d){const el=$(id);if(!el)return;el.animate([{filter:f},{filter:"none"}],{duration:(d||260)/pxSpd()})}
// ---------------- efectos de estado, curacion, proteccion ----------------
function fxZ(id){if(!O.fx||!$(id))return Promise.resolve();const p=pos(id),ps=[];for(let i=0;i<3;i++){const e=fxEl('<b style="font:900 '+(16+i*7)+'px sans-serif;color:#dfe8ff;-webkit-text-stroke:1.5px #2a3a8a;text-shadow:0 0 6px #6a86ff">Z</b>',p.x+18,p.y-24);ps.push(fxAnim(e,[{transform:"translate(0,0) rotate(-12deg) scale(.6)",opacity:0},{opacity:1,offset:.3},{transform:"translate("+(24+i*12)+"px,-"+(46+i*14)+"px) rotate(12deg) scale(1)",opacity:0}],{duration:1000/pxSpd(),delay:i*230/pxSpd()}))}return Promise.all(ps)}
const AILFX={par:["electric","#ffe34a"],slp:["psychic","#9fb4ff"],psn:["poison","#c46ae2"],tox:["poison","#8a2ab0"],brn:["fire","#ff7a3c"],frz:["ice","#7fe0f0"],cnf:["fairy","#ffd35c"]};
async function fxAil(id,a){
  if(!O.fx||!$(id))return;const q=AILFX[a];if(!q)return;const p=pos(id),hw=Math.max(30,p.w*.32);
  if(a==="slp"){fxTint(id,"brightness(.8) hue-rotate(200deg)",900);await fxZ(id);return}
  if(a==="cnf"){await pxDraw(1100,(c,u)=>{for(let i=0;i<4;i++){const an=u*9+i*Math.PI/2,x=p.x+Math.cos(an)*hw,y=p.y-p.h*.38+Math.sin(an)*10;c.globalAlpha=u>.85?(1-u)/.15:1;c.save();c.translate(x,y);c.rotate(u*12);c.fillStyle=i%2?"#ffe25a":"#fff6c0";c.strokeStyle="#b07a00";c.lineWidth=1.2;c.beginPath();for(let k=0;k<10;k++){const r=k%2?3:7,aa=-Math.PI/2+k*Math.PI/5;c.lineTo(Math.cos(aa)*r,Math.sin(aa)*r)}c.closePath();c.fill();c.stroke();c.restore()}});return}
  if(a==="frz"){fxTint(id,"brightness(1.35) hue-rotate(160deg) saturate(1.8)",1100);pxBg("rgba(200,240,255,.0)","rgba(120,200,255,.5)",900,.6);
    for(let i=0;i<16;i++)pxType("ice",p.x+fxR(-hw,hw),p.y+fxR(-p.h*.35,p.h*.35),{sp:fxR(10,40),ay:0,dl:i*.03,life:1.2});
    await pxDraw(900,(c,u)=>{c.globalAlpha=u<.2?u/.2*.55:u>.8?(1-u)/.2*.55:.55;c.fillStyle="#c8f2ff";c.strokeStyle="#ffffff";c.lineWidth=2;const w=hw*2.2,h=p.h*.9;c.beginPath();c.moveTo(p.x-w/2,p.y+h/2);c.lineTo(p.x-w/2+8,p.y-h/2);c.lineTo(p.x+w/2-4,p.y-h/2+6);c.lineTo(p.x+w/2,p.y+h/2);c.closePath();c.fill();c.globalAlpha*=1.4;c.stroke()});return}
  if(a==="par"){const e=$(id);e.animate([{translate:"-3px 0"},{translate:"3px 0"},{translate:"-3px 0"},{translate:"3px 0"},{translate:"0 0"}],{duration:420/pxSpd()});fxTint(id,"brightness(1.7) sepia(1) hue-rotate(10deg) saturate(3)",520);
    const pr=[];for(let i=0;i<4;i++){const s={x:p.x+fxR(-hw,hw),y:p.y-p.h*.4+fxR(0,10)};pr.push(new Promise(r=>setTimeout(()=>pxLightning(s,{x:s.x+fxR(-26,26),y:s.y+fxR(30,60)},{d:220,j:12,w:2}).then(r),i*110/pxSpd())))}
    pxBurst("electric",p,14,{r:hw});await Promise.all(pr);return}
  if(a==="brn"){fxTint(id,"brightness(1.15) sepia(1) hue-rotate(-30deg) saturate(3.2)",800);for(let i=0;i<34;i++)pxType("fire",p.x+fxR(-hw,hw),p.y+p.h*.3,{a:-Math.PI/2,sp:fxR(40,120),dl:i*.018,sz:.8,life:1.1});await sleep(800);return}
  if(a==="psn"||a==="tox"){fxTint(id,"sepia(1) hue-rotate(230deg) saturate(2.6)",800);for(let i=0;i<18;i++)pxType("poison",p.x+fxR(-hw,hw),p.y+fxR(0,p.h*.3),{a:-Math.PI/2+fxR(-.3,.3),sp:fxR(30,90),dl:i*.035,life:1.1,c:a==="tox"?["#e2a4ff","#8a2ab0","#3a0a58"]:undefined,wob:[30,9]});await sleep(850);return}
}
async function fxHeal(id){if(!O.fx||!$(id))return;const p=pos(id),hw=Math.max(30,p.w*.3);fxTint(id,"brightness(1.45) drop-shadow(0 0 12px #7dffa0)",900);
  pxRing({x:p.x,y:p.y+p.h*.35},"#7dffa0",10,hw*1.5,.7,4,{ell:.3});
  for(let i=0;i<26;i++)pxAdd({x:p.x+fxR(-hw,hw),y:p.y+fxR(0,p.h*.4),vy:fxR(-120,-60),vx:fxR(-10,10),sh:i%3?"glow":"star",c:i%3?"#7dffa0":"#ffffff",add:1,sz:i%3?fxR(6,11):fxR(4,7),life:fxR(.7,1.1),dl:i*.025,vr:3,fi:.2});
  await sleep(900)}
async function fxProt(id,c){if(!O.fx||!$(id))return;c=c||"#7fe0ff";const p=pos(id),R=Math.max(52,p.w*.55);
  await pxDraw(900,(x,u)=>{const e=u<.25?u/.25:u>.75?(1-u)/.25:1,r=R*(.85+.15*Math.min(1,u/.25));x.globalCompositeOperation="lighter";x.globalAlpha=e*.9;
    const g=x.createRadialGradient(p.x,p.y,r*.55,p.x,p.y,r);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(.8,c+"55");g.addColorStop(1,c);x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,r,0,6.283);x.fill();
    x.strokeStyle=c;x.lineWidth=1.2;x.globalAlpha=e*.55;for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const hx=p.x+i*r*.3+(j%2?r*.15:0),hy=p.y+j*r*.26;if(Math.hypot(hx-p.x,hy-p.y)>r*.88)continue;x.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;x.lineTo(hx+Math.cos(a)*r*.15,hy+Math.sin(a)*r*.15)}x.closePath();x.stroke()}
    const sw=(u*2)%1;x.globalAlpha=e*.6;x.strokeStyle="#ffffff";x.lineWidth=3;x.beginPath();x.arc(p.x,p.y,r,-Math.PI/2+sw*6.283,-Math.PI/2+sw*6.283+.7);x.stroke()})}
const STC={atk:"#ff5a4a",def:"#4f9dff",spe:"#ff7ad0",acc:"#2fe0b0",eva:"#c9a0ff"};
async function fxStat(id,s,up){if(!O.fx||!$(id))return;const c=up?(STC[s]||"#ff8a3a"):"#5aa0ff",p=pos(id),hw=Math.max(28,p.w*.3);
  fxTint(id,up?"brightness(1.25) drop-shadow(0 0 10px "+c+")":"brightness(.75) saturate(.6)",900);
  for(let i=0;i<18;i++)pxAdd({x:p.x+fxR(-hw,hw),y:up?p.y+p.h*.3:p.y-p.h*.35,vy:up?fxR(-170,-90):fxR(90,170),sh:"glow",c:up?[c,"#ffffff"]:["#ffffff",c],add:1,sz:fxR(4,8),life:fxR(.5,.8),dl:i*.03,fi:.15});
  await fxStripes(id,up,up?c:"#3a7cff",950)}
async function fxStatusMove(mv,id){if(!O.fx||!$(id))return;const ty=mv.typeless?"normal":mv.t,C=FXC[ty]||FXC.normal,p=pos(id),hw=Math.max(30,p.w*.32);
  pxRing({x:p.x,y:p.y+p.h*.36},C[1],10,hw*1.6,.8,4,{ell:.3});
  for(let i=0;i<22;i++)pxAdd({x:p.x+fxR(-hw,hw),y:p.y+p.h*.35,vy:fxR(-200,-110),sh:"streak",c:[C[0],C[1]],add:1,sz:fxR(2,4),st:.06,life:fxR(.4,.7),dl:i*.025});
  fxSprFlash(id,"brightness(1.6) drop-shadow(0 0 14px "+C[1]+")",700);await sleep(750)}
async function fxSelf(txt,mine,id){if(!O.fx)return;burst(txt,pos(id||(mine?"msp":"osp")),6,50,28);await sleep(700)}
function hitFx(el,e){
  if(!el)return;el.classList.remove("hit");void el.offsetWidth;
  if(O.fx){const s=pxSpd();el.animate([{filter:"brightness(4) saturate(0)",opacity:1},{opacity:0,offset:.2},{filter:"none",opacity:1,offset:.35},{opacity:0,offset:.5},{opacity:1,offset:.65},{opacity:0,offset:.8},{opacity:1}],{duration:560/s});
    el.animate([{translate:"0 0"},{translate:(el.id&&el.id[0]==="o"?10:-10)+"px 0",offset:.15},{translate:"0 0"}],{duration:260/s});
    if(e>1){shake(9,380);pxBg("rgba(255,255,255,.4)","rgba(255,255,255,0)",200,.5)}}
  else el.classList.add("hit");
}
// ---------------- animacion de cada movimiento ----------------
// estilos: c contacto, l zarpazo, u golpe, i mordisco, o proyectil, b rayo, k desde el cielo, w en area
async function fxMove(mv,fid,tid,mine){
  if(!O.fx||!$(fid)||!$(tid))return;pxCv();
  const ty=mv.typeless?"normal":mv.t,C=FXC[ty]||FXC.normal,f=pos(fid),t=pos(tid),big=mv.pw>=100||mv.rech,pw=big?1.5:mv.pw>=70?1.15:1,st=mv.fx,nm=(mv.n||"").toLowerCase();
  const dirx=Math.sign(t.x-f.x)||1,ang=Math.atan2(t.y-f.y,t.x-f.x);
  if(big){pxBg(C[1]+"",C[2]+"",1500,.38);fxSprFlash(fid,"brightness(1.8) drop-shadow(0 0 16px "+C[1]+")",600)}
  const charge=async(ms)=>{for(let i=0;i<24;i++){const a=fxR(0,6.283),r=fxR(50,90);pxAdd({x:f.x+Math.cos(a)*r,y:f.y+Math.sin(a)*r,to:f,pull:30,dr:.82,sh:"glow",c:[C[0],C[1]],add:1,sz:fxR(4,8),life:ms/1000,fi:.2,dl:i*.01})}pxFlare(f,C[1],34,ms/1000);await sleep(ms)};
  // --- contacto ---
  if(st==="c"||st==="l"||st==="u"||st==="i"){
    for(let i=0;i<8;i++)pxAdd({x:f.x+fxR(-40,40),y:f.y+fxR(-30,30),vx:(t.x-f.x)*2.2,vy:(t.y-f.y)*2.2,sh:"streak",c:"#ffffff",sz:2,st:.06,life:.22,dl:.12+i*.012,a:.7});
    const lg=fxLunge(fid,f,t,480);await sleep(250);
    if(st==="l"){const n=mv.hits?2:3;for(let i=0;i<n;i++){const off=(i-(n-1)/2)*16;pxDraw(300,(c,u)=>{const k=Math.min(1,u/.45);c.globalCompositeOperation="lighter";c.globalAlpha=u>.6?(1-u)/.4:1;c.lineCap="round";c.translate(t.x+off,t.y);c.rotate(-.75+i*.12);c.shadowColor=C[1];c.shadowBlur=12;c.strokeStyle=C[1];c.lineWidth=9;c.beginPath();c.moveTo(-60,0);c.lineTo(-60+120*k,0);c.stroke();c.strokeStyle="#ffffff";c.lineWidth=3;c.stroke()});await sleep(70)}pxImpact(t,ty,.8*pw)}
    else if(st==="i"){await pxDraw(380,(c,u)=>{const k=u<.55?u/.55:1,gap=60*(1-k)+4;c.globalAlpha=u>.75?(1-u)/.25:1;c.fillStyle="#ffffff";c.strokeStyle=C[2];c.lineWidth=2.5;
      for(const s of[-1,1]){c.beginPath();c.moveTo(t.x-46,t.y+s*(gap+18));c.lineTo(t.x+46,t.y+s*(gap+18));for(let i=0;i<=6;i++){const x=t.x+46-i*15.3;c.lineTo(x,t.y+s*(gap+(i%2?0:-2)));if(i<6)c.lineTo(x-7.6,t.y+s*(gap+14))}c.closePath();c.fill();c.stroke()}});pxImpact(t,ty,.9*pw)}
    else if(st==="u"){const fist=/patada|pisot|tajo|rodilla|talón|pie/.test(nm)?"rock":"fist";
      pxAdd({x:t.x-dirx*60,y:t.y,vx:dirx*500,vy:0,sh:fist,c:[C[0],C[1]],sz:14,sz1:1.6,life:.16,a:1,add:0});await sleep(120);pxImpact(t,ty,1.1*pw)}
    else pxImpact(t,ty,pw);
    if(ty!=="normal")pxBurst(ty,t,10+6*pw,{r:12});
    await lg;await sleep(80);
  }
  // --- proyectil ---
  else if(st==="o"){
    await charge(big?320:200);
    const n=mv.hits?Math.min(4,mv.hits[1]):["rock","ice","bug","steel","grass","flying"].includes(ty)?3:1,sh=[];
    for(let i=0;i<n;i++){const tt={x:t.x+fxR(-14,14),y:t.y+fxR(-14,14)},del=i*110;
      sh.push(new Promise(r=>setTimeout(()=>{let pr;
        if(ty==="grass")pr=pxProj(ty,f,tt,{arc:-30,d:.42,tn:1,draw:(c,x,y,u)=>{c.save();c.translate(x,y);c.rotate(u*18);c.fillStyle="#79d84a";c.strokeStyle="#24852a";c.lineWidth=1.5;c.beginPath();c.moveTo(-12,0);c.quadraticCurveTo(0,-9,12,0);c.quadraticCurveTo(0,9,-12,0);c.fill();c.stroke();c.restore()}});
        else if(ty==="rock"||ty==="ground")pr=pxProj(ty,f,tt,{arc:-60,d:.48,tn:1,draw:(c,x,y,u)=>{c.save();c.translate(x,y);c.rotate(u*10);c.scale(1.6*pw,1.6*pw);c.fillStyle="#b08a50";c.strokeStyle="#4a3418";c.lineWidth=1;c.beginPath();c.moveTo(-9,3);c.lineTo(-6,-7);c.lineTo(3,-9);c.lineTo(9,-2);c.lineTo(7,7);c.lineTo(-3,9);c.closePath();c.fill();c.stroke();c.restore()}});
        else if(ty==="ice"||ty==="steel"||ty==="bug")pr=pxProj(ty,f,tt,{arc:-12,d:.36,lin:1,draw:(c,x,y,u,vx,vy)=>{c.save();c.translate(x,y);c.rotate(Math.atan2(vy,vx)+Math.PI/2);c.fillStyle=C[1];c.strokeStyle="#ffffff";c.lineWidth=1.5;c.beginPath();c.moveTo(0,-14);c.lineTo(5,0);c.lineTo(0,14);c.lineTo(-5,0);c.closePath();c.fill();c.stroke();c.restore()}});
        else if(ty==="water")pr=pxProj(ty,f,tt,{arc:-30,d:.42,tn:3,sz:14*pw});
        else if(ty==="electric")pr=pxProj(ty,f,tt,{arc:-20,d:.4,tn:3,sz:15*pw,draw:(c,x,y)=>{c.globalCompositeOperation="lighter";c.drawImage(pxGlow("#ffe34a"),x-26*pw,y-26*pw,52*pw,52*pw);c.strokeStyle="#ffffff";c.lineWidth=2;for(let k=0;k<3;k++){c.beginPath();c.moveTo(x,y);for(let j=1;j<4;j++)c.lineTo(x+fxR(-18,18)*pw,y+fxR(-18,18)*pw);c.stroke()}}});
        else if(ty==="poison")pr=pxProj(ty,f,tt,{arc:-50,d:.46,tn:2,draw:(c,x,y)=>{c.fillStyle="#9a3ad0";c.strokeStyle="#4a0a70";c.lineWidth=2;c.beginPath();c.arc(x,y,9*pw,0,6.283);c.fill();c.stroke();c.fillStyle="#e6b8ff";c.beginPath();c.arc(x-3,y-3,2.6,0,6.283);c.fill()}});
        else if(ty==="flying")pr=pxProj(ty,f,tt,{arc:-10,d:.32,lin:1,tn:1,draw:(c,x,y,u,vx,vy)=>{c.save();c.translate(x,y);c.rotate(Math.atan2(vy,vx));c.globalCompositeOperation="lighter";c.strokeStyle="#ffffff";c.lineWidth=4;c.shadowColor="#a8c0f0";c.shadowBlur=10;c.beginPath();c.arc(-6,0,16,-1.2,1.2);c.stroke();c.restore()}});
        else if(ty==="psychic")pr=pxProj(ty,f,tt,{arc:0,d:.5,lin:1,tn:1,draw:(c,x,y,u)=>{c.globalCompositeOperation="lighter";for(let k=0;k<3;k++){c.strokeStyle=k%2?"#ffb4e8":"#ff5ec8";c.lineWidth=3;c.globalAlpha=.8;c.beginPath();c.arc(x-(t.x-f.x)*.06*k,y-(t.y-f.y)*.06*k,(14-k*3)*pw,0,6.283);c.stroke()}}});
        else if(ty==="fairy")pr=pxProj(ty,f,tt,{arc:-40,d:.5,tn:3,sz:12});
        else pr=pxProj(ty,f,tt,{arc:ty==="fire"?-28:-34,d:ty==="fire"?.42:.45,tn:ty==="fire"?4:2,sz:(ty==="dark"||ty==="ghost"?18:14)*pw});
        pr.then(()=>{pxImpact(tt,ty,.7*pw);pxBurst(ty,tt,8,{r:8});r()})},del/pxSpd())))}
    await Promise.all(sh);
    if(["ghost","dark","dragon","psychic"].includes(ty))pxRing(t,C[1],10,90*pw,.5,6);
    await sleep(160);
  }
  // --- rayo / haz ---
  else if(st==="b"){
    await charge(big?420:260);
    if(ty==="electric"){pxBg("#2a2a60","#05051a",900,.5);const pr=[];for(let i=0;i<3;i++)pr.push(new Promise(r=>setTimeout(()=>pxLightning(f,t,{d:380,j:30,w:big?4:3}).then(r),i*120/pxSpd())));await sleep(200);pxImpact(t,ty,pw);await Promise.all(pr)}
    else{const d=big?1100:780,b=pxBeam({x:f.x,y:f.y-4},t,ty,big?30:18,d);
      const iv=setInterval(()=>{for(let i=0;i<3;i++)pxType(ty,t.x+fxR(-10,10),t.y+fxR(-10,10),{sp:fxR(80,240),life:.6})},50);
      await sleep(d*.25);pxImpact(t,ty,pw);if(big)shake(10,700);await b;clearInterval(iv)}
  }
  // --- desde el cielo ---
  else if(st==="k"){
    if(ty==="electric"){pxBg("#26264a","#020210",1000,.6);for(let i=0;i<(big?3:2);i++){const s={x:t.x+fxR(-30,30),y:-10};pxLightning(s,{x:t.x+fxR(-8,8),y:t.y+10},{d:320,j:34,w:big?5:3.5});await sleep(90);fxFlash("#fffbe0",.55,180);pxImpact(t,ty,pw*.8);shake(8,240);await sleep(180)}}
    else{
      if(ty==="fire")pxBg("#ff9a3a","#5a0a00",1000,.45);else if(ty==="ice")pxBg("#e8fbff","#3a7ab0",1000,.4);else if(ty==="water")pxBg("#6aa8ff","#0a2a6a",1000,.4);else pxBg(C[1],C[2],900,.3);
      const n=ty==="rock"||ty==="fire"?5:10,pr=[];
      for(let i=0;i<n;i++){const tt={x:t.x+fxR(-50,50),y:t.y+fxR(-10,20)},fr={x:tt.x+fxR(-60,20)*dirx,y:-30};
        pr.push(new Promise(r=>setTimeout(()=>pxProj(ty,fr,tt,{arc:0,lin:1,d:.32,tn:ty==="fire"?5:1,sz:ty==="fire"?16:10,draw:ty==="rock"?(c,x,y,u)=>{c.save();c.translate(x,y);c.rotate(u*8);c.scale(1.8,1.8);c.fillStyle="#b08a50";c.strokeStyle="#4a3418";c.beginPath();c.moveTo(-9,3);c.lineTo(-6,-7);c.lineTo(3,-9);c.lineTo(9,-2);c.lineTo(7,7);c.lineTo(-3,9);c.closePath();c.fill();c.stroke();c.restore()}:ty==="ice"||ty==="water"?(c,x,y,u,vx,vy)=>{c.save();c.translate(x,y);c.rotate(Math.atan2(vy,vx)+Math.PI/2);c.fillStyle=C[1];c.strokeStyle="#fff";c.lineWidth=1.5;c.beginPath();c.moveTo(0,-12);c.lineTo(4,0);c.lineTo(0,10);c.lineTo(-4,0);c.closePath();c.fill();c.stroke();c.restore()}:null}).then(()=>{pxBurst(ty,tt,6,{r:6});if(ty==="rock"||ty==="fire")pxImpact(tt,ty,.6);r()}),i*80/pxSpd())))}
      await Promise.all(pr);shake(big?11:7,360);pxImpact(t,ty,pw*.8);await sleep(160);
    }
  }
  // --- en area ---
  else if(st==="w"){
    if(ty==="ground"||ty==="rock"){shake(13,1000);pxBg("#c9984e","#3a2410",1000,.35);
      for(let i=0;i<40;i++)pxType(ty,fxR(0,PX.w),PX.h*fxR(.55,1),{a:-Math.PI/2+fxR(-.5,.5),sp:fxR(200,420),dl:i*.018,life:1.3});
      for(let i=0;i<14;i++)pxAdd({x:fxR(0,PX.w),y:PX.h*fxR(.7,1),vx:fxR(-30,30),vy:fxR(-60,-20),sh:"glow",c:["#e8d2a8","#a88a60"],sz:fxR(18,34),sz1:1.6,life:1.2,a:.55,dl:i*.04});
      await sleep(700);pxImpact(t,ty,pw)}
    else if(ty==="water"||ty==="fire"||ty==="ice"||ty==="grass"||ty==="poison"){
      const C2=C,W=PX.w,H=PX.h,from=mine?-W*.6:W*1.6;
      if(ty==="fire")pxBg("#ffb040","#6a0a00",1000,.45);
      await pxDraw(1000,(c,u)=>{const x=from+(mine?1:-1)*u*W*2.2,top=H*.25;c.globalAlpha=.9;
        if(ty==="fire"||ty==="poison"){for(let i=0;i<6;i++)pxType(ty,x+fxR(-W*.3,W*.3),H*fxR(.6,1),{a:-Math.PI/2+fxR(-.3,.3),sp:fxR(80,200),sz:1.3,life:.7});return}
        if(ty==="grass"){for(let i=0;i<4;i++)pxType("grass",x+fxR(-W*.3,W*.3),fxR(top,H),{a:mine?0:Math.PI,sp:fxR(200,400),life:.8,wob:[60,6]});return}
        const g=c.createLinearGradient(0,top,0,H);g.addColorStop(0,"#ffffff");g.addColorStop(.12,C2[1]);g.addColorStop(1,C2[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-W*.6,H);
        for(let k=0;k<=24;k++){const xx=x-W*.6+k*W*.05;c.lineTo(xx,top+Math.sin(k*.8+u*20)*10+(Math.abs(k-12)/12)*H*.25)}c.lineTo(x+W*.6,H);c.closePath();c.fill();
        if(Math.random()<.6)pxType(ty,x+(mine?W*.5:-W*.5),top+fxR(0,40),{a:-Math.PI/2+fxR(-.6,.6),sp:fxR(100,260)})});
      pxImpact(t,ty,pw)}
    else if(ty==="electric"){for(let i=0;i<3;i++){pxRing(f,C[1],10,PX.w*.7,.6,6);await sleep(130)}for(let i=0;i<5;i++)pxLightning({x:f.x,y:f.y},{x:fxR(0,PX.w),y:fxR(0,PX.h)},{d:260,j:18,w:2});pxLightning(f,t,{d:320,w:3.5});await sleep(200);pxImpact(t,ty,pw)}
    else if(ty==="flying"||ty==="dragon"||ty==="bug"){const W=PX.w;
      await pxDraw(900,(c,u)=>{for(let i=0;i<3;i++)pxAdd({x:mine?-20:W+20,y:fxR(PX.h*.1,PX.h*.9),vx:(mine?1:-1)*fxR(600,900),vy:fxR(-40,40),sh:"streak",c:ty==="dragon"?["#ffffff","#7f7cff"]:ty==="bug"?["#e8ff9a","#5e7c10"]:["#ffffff","#c8dcff"],add:1,sz:fxR(2,4),st:.07,life:.6,wob:[120,10]});
        if(ty==="flying"&&Math.random()<.3)pxType("flying",fxR(0,W),fxR(0,PX.h),{vx:(mine?1:-1)*300,sp:40})});pxImpact(t,ty,pw)}
    else{const n=ty==="psychic"?5:3;if(ty==="psychic")pxBg("#ff9ae0","#400a40",1100,.45);if(ty==="dark"||ty==="ghost")pxBg("#3a1a4a","#000000",1100,.6);
      for(let i=0;i<n;i++){pxRing(f,C[1],10,PX.w*.9,.75,7);await sleep(120)}
      for(let i=0;i<24;i++)pxType(ty,t.x+fxR(-40,40),t.y+fxR(-30,30),{sp:fxR(60,180)});await sleep(250);pxImpact(t,ty,pw)}
    await sleep(120);
  }
  if(big){shake(9,420);fxFlash("#fff",.4,280)}
}
// compatibilidad: lanzamiento simple (la animacion completa de captura esta en catchFx)
async function ballfx(id){if(!O.fx)return;const f=$("psp")&&$("psp").style.opacity!=="0"?pos("psp"):pos("msp"),t=pos("osp");await pbThrow(id,{x:f.x+30,y:f.y-50},t,{d:620,arc:-110});fxFlash("#fff",.6,300)}
