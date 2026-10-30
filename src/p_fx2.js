// ================= Poké Balls, lanzamientos, captura, salida, retirada y debilitado (estilo de los juegos) =================
const BALLC={pb:["#ff5a5f","#e3263a","#8e0f1e"],sb:["#5aa0ff","#2a6ee0","#123c8a"],ub:["#4a4a55","#26262e","#0c0c10"],mb:["#b67cff","#8a3fd0","#4a1a80"]};
const BALLG={pb:"#ff6a6a",sb:"#7fb8ff",ub:"#ffd35c",mb:"#e7a6ff"};
// dibuja una Poké Ball con volumen; op: 0 cerrada → 1 abierta; dim: oscurecida tras la captura
function pbPaint(c,x,y,r,id,rot,op,dim,blink){
  const col=BALLC[id]||BALLC.pb,lw=Math.max(1.2,r*.13);
  c.save();c.translate(x,y);c.rotate(rot||0);c.globalCompositeOperation="source-over";c.lineJoin="round";
  // interior luminoso al abrirse
  if(op>0){c.save();c.globalCompositeOperation="lighter";c.globalAlpha=Math.min(1,op*1.4);c.drawImage(pxGlow("#ffffff"),-r*1.6,-r*1.9,r*3.2,r*3.2);c.restore()}
  // mitad inferior (blanca)
  const gb=c.createLinearGradient(-r*.6,-r*.2,r*.7,r);gb.addColorStop(0,"#ffffff");gb.addColorStop(.6,"#e6e8f0");gb.addColorStop(1,"#a8adbf");
  c.beginPath();c.arc(0,0,r,0,Math.PI);c.closePath();c.fillStyle=gb;c.fill();c.lineWidth=lw;c.strokeStyle="#16161e";c.stroke();
  // mitad superior (bisagra a la izquierda)
  c.save();if(op>0){c.translate(-r,0);c.rotate(-op*1.75);c.translate(r,0)}
  const gt=c.createRadialGradient(-r*.35,-r*.55,r*.1,0,-r*.1,r*1.15);gt.addColorStop(0,col[0]);gt.addColorStop(.55,col[1]);gt.addColorStop(1,col[2]);
  c.beginPath();c.arc(0,0,r,Math.PI,2*Math.PI);c.closePath();c.fillStyle=gt;c.fill();
  c.save();c.clip();
  if(id==="sb"){c.fillStyle="#e3263a";c.beginPath();c.ellipse(-r*.62,-r*.5,r*.32,r*.18,-.6,0,6.283);c.ellipse(r*.62,-r*.5,r*.32,r*.18,.6,0,6.283);c.fill()}
  if(id==="ub"){c.fillStyle="#f5c400";c.fillRect(-r*.62,-r,r*.26,r*.95);c.fillRect(r*.36,-r,r*.26,r*.95);c.fillRect(-r*.36,-r*.62,r*.72,r*.2)}
  if(id==="mb"){c.fillStyle="#ff7ac8";c.beginPath();c.arc(-r*.55,-r*.42,r*.2,0,6.283);c.arc(r*.55,-r*.42,r*.2,0,6.283);c.fill();c.fillStyle="#ffffff";c.font="900 "+(r*.55)+"px sans-serif";c.textAlign="center";c.textBaseline="middle";c.fillText("M",0,-r*.52)}
  c.restore();
  c.lineWidth=lw;c.strokeStyle="#16161e";c.beginPath();c.arc(0,0,r,Math.PI,2*Math.PI);c.closePath();c.stroke();
  // brillo especular
  c.globalAlpha=.75;c.fillStyle="#ffffff";c.beginPath();c.ellipse(-r*.42,-r*.6,r*.24,r*.13,-.6,0,6.283);c.fill();c.globalAlpha=1;
  c.restore();
  // banda y boton
  if(!(op>.05)){c.fillStyle="#16161e";c.fillRect(-r,-r*.1,2*r,r*.2);
    c.beginPath();c.arc(0,0,r*.34,0,6.283);c.fillStyle="#16161e";c.fill();
    c.beginPath();c.arc(0,0,r*.22,0,6.283);c.fillStyle=blink?"#ff4a4a":"#f6f6fa";c.fill();
    if(blink){c.globalCompositeOperation="lighter";c.drawImage(pxGlow("#ff3a3a"),-r*.7,-r*.7,r*1.4,r*1.4);c.globalCompositeOperation="source-over"}
    c.strokeStyle="#9aa0b4";c.lineWidth=Math.max(.8,r*.05);c.beginPath();c.arc(0,0,r*.15,0,6.283);c.stroke()}
  if(dim){c.globalAlpha=.42;c.fillStyle="#000";c.beginPath();c.arc(0,0,r+lw/2,0,6.283);c.fill()}
  c.restore();
}
const pbR=()=>Math.max(9,Math.min(18,(PX.w||600)/48));
// lanzamiento con parabola, giro y estela; o.open: se abre al llegar; devuelve una promesa
function pbThrow(id,f,t,o){
  o=o||{};if(!O.fx||!pxCv())return sleep(o.d||600);
  const d=o.d||620,arc=o.arc==null?-110:o.arc,r=o.r||pbR(),spin=o.spin||14,hist=[];
  const g=BALLG[id]||"#ffffff";
  return pxDraw(d,(c,u)=>{
    const e=u,x=f.x+(t.x-f.x)*e,y=f.y+(t.y-f.y)*e+arc*4*e*(1-e),sc=o.grow?(.55+.45*u):1,rot=u*spin;
    hist.push([x,y,rot]);if(hist.length>6)hist.shift();
    // estela de luz
    c.globalCompositeOperation="lighter";
    for(let i=0;i<hist.length-1;i++){const h=hist[i],k=(i+1)/hist.length;c.globalAlpha=.18*k;c.drawImage(pxGlow(g),h[0]-r*1.3*sc,h[1]-r*1.3*sc,r*2.6*sc,r*2.6*sc)}
    if(Math.random()<.55)pxAdd({x:x+fxR(-3,3),y:y+fxR(-3,3),vx:fxR(-30,30),vy:fxR(-30,30),sh:"star",c:["#ffffff",g],add:1,sz:fxR(2,4),life:.35,vr:6});
    c.globalAlpha=1;
    // sombra en el suelo
    if(o.ground!=null){c.globalCompositeOperation="source-over";c.globalAlpha=.22*(.5+.5*u);c.fillStyle="#000";c.beginPath();c.ellipse(f.x+(t.x-f.x)*e,o.ground,r*sc*1.1,r*sc*.32,0,0,6.283);c.fill();c.globalAlpha=1}
    pbPaint(c,x,y,r*sc,id,rot,0);
  }).then(()=>o.open?pbOpen(id,t,r*(o.grow?1:1)):null);
}
// la bola se abre en el aire con destello y rafaga de luz
function pbOpen(id,p,r,keep){
  if(!O.fx||!pxCv())return Promise.resolve();
  r=r||pbR();const g=BALLG[id]||"#ffffff";snd("open");
  pxFlare(p,g,60,.35);pxRing(p,"#ffffff",r,r*6,.42,5);pxRing(p,g,r,r*9,.6,3);
  for(let i=0;i<22;i++){const a=i/22*6.283;pxAdd({x:p.x,y:p.y,vx:Math.cos(a)*fxR(160,320),vy:Math.sin(a)*fxR(160,320),sh:i%2?"star":"streak",c:["#ffffff",g],add:1,sz:i%2?fxR(3,6):2.2,st:.05,dr:.9,life:fxR(.35,.6),vr:5})}
  return pxDraw(keep?420:300,(c,u)=>{const op=Math.min(1,u*2.4);c.globalAlpha=keep?1:1-Math.max(0,(u-.55)/.45);pbPaint(c,p.x,p.y,r,id,0,op);
    c.globalCompositeOperation="lighter";c.globalAlpha=(1-u)*.9;const w=r*2.4*(1-u*.4),h=r*8*u;const lg=c.createLinearGradient(p.x,p.y,p.x,p.y-h);lg.addColorStop(0,"#ffffff");lg.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=lg;c.fillRect(p.x-w/2,p.y-h,w,h)});
}
// el Pokemon aparece desde la luz (silueta blanca que crece y se colorea)
async function pbMaterialize(sid,shiny){
  const el=$(sid);if(!el)return;el.style.opacity=1;
  if(!O.intro&&!O.fx)return;
  const p=pos(sid),s=pxSpd();
  if(O.fx&&pxCv()){pxFlare({x:p.x,y:p.y},"#ffffff",p.w*.55,.45);pxRing({x:p.x,y:p.y+p.h*.36},"#ffffff",8,p.w*.75,.55,4,{ell:.28});
    for(let i=0;i<16;i++)pxAdd({x:p.x+fxR(-p.w*.35,p.w*.35),y:p.y+p.h*.35,vy:fxR(-220,-120),vx:fxR(-20,20),sh:"glow",c:["#ffffff","#bfe6ff"],add:1,sz:fxR(4,8),life:fxR(.4,.7),dl:i*.012})}
  await el.animate([{scale:".05",filter:"brightness(0) invert(1) drop-shadow(0 0 18px #fff)",opacity:.9},{scale:"1.12",filter:"brightness(0) invert(1) drop-shadow(0 0 14px #fff)",opacity:1,offset:.55},{scale:".96",filter:"brightness(2.2)",offset:.78},{scale:"1",filter:"brightness(1)"}],{duration:560/s,easing:"cubic-bezier(.2,.8,.3,1)"}).finished.catch(()=>{});
  if(shiny)await fxShiny(sid);
}
// destellos de variocolor (estrellas que giran y salen despedidas)
async function fxShiny(sid){
  if(!O.fx||!pxCv()||!$(sid))return;const p=pos(sid);snd("lvl");
  for(let w=0;w<3;w++){const cx=p.x+fxR(-p.w*.2,p.w*.2),cy=p.y+fxR(-p.h*.25,p.h*.1);
    for(let i=0;i<8;i++){const a=i/8*6.283+w*.4;pxAdd({x:cx,y:cy,vx:Math.cos(a)*fxR(90,150),vy:Math.sin(a)*fxR(90,150),sh:"star",c:["#ffffff","#fff59a","#ffd35c"],add:1,sz:fxR(4,7),sz1:.3,dr:.9,life:.65,vr:8,dl:w*.22})}
    pxAdd({x:cx,y:cy,sh:"glow",c:"#fffbe0",add:1,sz:30,sz1:.2,life:.4,dl:w*.22})}
  await sleep(700);
}
// rayo rojo de retirada: el Pokemon vuelve a su bola
async function pbRecall(sid){
  const el=$(sid);if(!el||el.style.opacity==="0")return;
  if(!O.intro&&!O.fx){el.style.opacity=0;return}
  const p=pos(sid),s=pxSpd(),mine=sid[0]==="m",to=mine?{x:-20,y:PX.h||300}:{x:(PX.w||600)+20,y:p.y-60};
  snd("flee");
  if(O.fx&&pxCv()){pxDraw(520,(c,u)=>{c.globalCompositeOperation="lighter";c.globalAlpha=u<.2?u/.2:u>.75?(1-u)/.25:1;c.lineCap="round";
      c.strokeStyle="#ff3a3a";c.shadowColor="#ff2a2a";c.shadowBlur=16;c.lineWidth=7;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(to.x,to.y);c.stroke();c.strokeStyle="#ffd6d6";c.lineWidth=2.5;c.stroke()});
    for(let i=0;i<18;i++)pxAdd({x:p.x+fxR(-p.w*.3,p.w*.3),y:p.y+fxR(-p.h*.3,p.h*.3),to:to,pull:5,dr:.88,sh:"glow",c:["#ffffff","#ff4a4a"],add:1,sz:fxR(4,8),life:.55,dl:i*.015})}
  await el.animate([{scale:"1",filter:"none",translate:"0 0"},{scale:"1",filter:"brightness(0) invert(1) sepia(1) saturate(8) hue-rotate(-50deg) drop-shadow(0 0 12px #f33)",offset:.3},{scale:".05",filter:"brightness(0) invert(1) sepia(1) saturate(8) hue-rotate(-50deg)",translate:((to.x-p.x)*.35)+"px "+((to.y-p.y)*.35)+"px"}],{duration:520/s,easing:"ease-in"}).finished.catch(()=>{});
  el.style.opacity=0;
}
// debilitado: el sprite cae y se hunde tras la plataforma (como en los juegos)
async function fxFaint(sid){
  const el=$(sid);if(!el)return;const s=pxSpd();
  if(!O.intro&&!O.fx)return;
  const im=el.querySelector("img,svg");if(!im)return;
  const a=im.animate([{translate:"0 0",clipPath:"inset(0 0 0 0)",filter:"none"},{translate:"0 -6px",clipPath:"inset(0 0 0 0)",offset:.15},{translate:"0 105%",clipPath:"inset(0 0 100% 0)",filter:"brightness(.6)"}],{duration:620/s,easing:"cubic-bezier(.5,0,.9,.6)"});
  await a.finished.catch(()=>{});
  el.classList.add("faint");a.cancel();
}
// ---------------- captura completa ----------------
// shakes: sacudidas antes de terminar (0-3); ok: capturado
async function catchFx(id,shakes,ok){
  const sp=$("osp"),t=pos("osp"),s=pxSpd();
  if(!O.fx||!pxCv()){sp.style.transform="scale(.25)";sp.style.filter="brightness(3)";for(let i=0;i<shakes;i++){snd("click");await sleep(400)}if(!ok){sp.style.transform="";sp.style.filter="drop-shadow(0 0 12px "+GLW[beAct(B.E.sd[1]).p[2]]+")"}return}
  const r=pbR(),ps=$("psp"),psOn=ps&&ps.style.opacity!=="0",gnd=t.y+t.h*.36,top={x:t.x,y:t.y-t.h*.12};
  // 1) lanzamiento: desde la mano del entrenador si esta en pantalla
  let f;
  if(psOn){const img=ps.querySelector("img"),L=myLook();if(img&&O.intro){img.classList.remove("pidle");img.src=trURL(L,"b","t");await sleep(130);img.src=trURL(L,"b","m");await sleep(90);img.src=trURL(L,"b","u")}
    const rr=(img||ps).getBoundingClientRect(),b=BTE().getBoundingClientRect();f={x:rr.left-b.left+rr.width*.9,y:rr.top-b.top+rr.height*.28};
    setTimeout(()=>{if(img){img.src=trURL(L,"b","f");setTimeout(()=>{img.src=trURL(L,"b","i");img.classList.add("pidle")},380)}},150)}
  else f={x:-20,y:PX.h*.7};
  snd("throw");
  await pbThrow(id,f,top,{d:620,arc:-120,r:r,ground:gnd});
  // 2) rebota en el Pokemon, se abre y lo absorbe con luz roja
  snd("open");
  const hold={op:0,on:1};
  pxDraw(460,(c,u)=>{hold.op=Math.min(1,u*3);pbPaint(c,top.x,top.y-14*Math.sin(Math.min(1,u*2)*Math.PI),r,id,-.4,u<.75?hold.op:(1-u)/.25)});
  pxFlare(top,"#ffffff",50,.3);
  for(let i=0;i<26;i++)pxAdd({x:t.x+fxR(-t.w*.35,t.w*.35),y:t.y+fxR(-t.h*.35,t.h*.3),to:{x:top.x,y:top.y-12},pull:9,dr:.84,sh:i%3?"glow":"streak",c:["#ffffff","#ff5a5a"],add:1,sz:i%3?fxR(4,8):2,st:.05,life:.5,dl:.08+i*.008});
  await sp.animate([{scale:"1",filter:"none",translate:"0 0",opacity:1},{scale:"1",filter:"brightness(0) invert(1) sepia(1) saturate(8) hue-rotate(-50deg) drop-shadow(0 0 14px #f33)",offset:.35,opacity:1},{scale:".02",filter:"brightness(0) invert(1) sepia(1) saturate(8) hue-rotate(-50deg)",translate:"0 "+(-t.h*.12)+"px",opacity:.6}],{duration:460/s,easing:"ease-in",fill:"forwards"}).finished.catch(()=>{});
  sp.style.opacity=0;sp.getAnimations().forEach(a=>a.cancel());
  // 3) cae al suelo y rebota
  const fall=[[top.y-14,gnd-r,260],[gnd-r,gnd-r-16,150],[gnd-r-16,gnd-r,150],[gnd-r,gnd-r-5,90],[gnd-r-5,gnd-r,90]];
  for(const[a0,a1,dd] of fall){await pxDraw(dd,(c,u)=>{const y=a0+(a1-a0)*(a1>a0?u*u:1-(1-u)*(1-u));c.globalAlpha=.25;c.fillStyle="#000";c.beginPath();c.ellipse(top.x,gnd,r*1.1,r*.3,0,0,6.283);c.fill();c.globalAlpha=1;pbPaint(c,top.x,y,r,id,0,0)});if(a1>a0)snd("click")}
  const bx=top.x,by=gnd-r,shadow=c=>{c.globalAlpha=.25;c.fillStyle="#000";c.beginPath();c.ellipse(bx,gnd,r*1.1,r*.3,0,0,6.283);c.fill();c.globalAlpha=1};
  // 4) sacudidas
  for(let k=0;k<shakes;k++){
    await pxDraw(320,(c)=>{shadow(c);pbPaint(c,bx,by,r,id,0,0)});
    snd("click");
    await pxDraw(520,(c,u)=>{shadow(c);const w=Math.sin(u*Math.PI*2)*(1-u*.3)*.42*(k%2?-1:1);pbPaint(c,bx+w*r*.5,by,r,id,w,0,0,u>.35&&u<.75)});
  }
  // 5) resultado
  if(ok){
    await pxDraw(260,(c)=>{shadow(c);pbPaint(c,bx,by,r,id,0,0)});snd("capok");
    for(let i=0;i<3;i++){const a=-Math.PI/2+(i-1)*.7;pxAdd({x:bx,y:by-r*.4,vx:Math.cos(a)*120,vy:Math.sin(a)*150,ay:260,sh:"star5",c:["#fff59a","#ffd35c"],sz:7,life:.9,vr:6,a:1})}
    for(let i=0;i<12;i++)pxAdd({x:bx,y:by,vx:fxR(-160,160),vy:fxR(-200,-40),sh:"star",c:["#ffffff","#fff59a"],add:1,sz:fxR(2,4),life:.6,vr:6});
    await pxDraw(1100,(c,u)=>{shadow(c);c.globalAlpha=u>.8?(1-u)/.2:1;pbPaint(c,bx,by,r,id,0,0,1)});
  }else{
    await pxDraw(160,(c)=>{shadow(c);pbPaint(c,bx,by,r,id,0,0)});
    pbOpen(id,{x:bx,y:by},r);fxFlash("#fff",.5,260);
    sp.style.opacity=1;sp.style.transform="";sp.style.filter="drop-shadow(0 0 12px "+GLW[beAct(B.E.sd[1]).p[2]]+")";
    await sp.animate([{scale:".1",filter:"brightness(0) invert(1)"},{scale:"1.1",filter:"brightness(2)",offset:.6},{scale:"1",filter:"brightness(1)"}],{duration:420/s,easing:"ease-out"}).finished.catch(()=>{});
  }
}
// ---------------- lineas de velocidad / fotograma de impacto (golpes criticos y super eficaces) ----------------
function pxSpeed(p,c1,d){if(!O.fx||!pxCv())return;const L=[];for(let i=0;i<34;i++){const a=fxR(0,6.283);L.push([a,fxR(.55,.95),fxR(1.5,4)])}
  return pxDraw(d||300,(c,u)=>{const R=Math.hypot(PX.w,PX.h);c.globalCompositeOperation="source-over";c.globalAlpha=(u<.15?u/.15:1-(u-.15)/.85)*.55;c.fillStyle=c1||"#ffffff";
    L.forEach(([a,k,w])=>{const r0=R*(k-.35*u),r1=R;c.beginPath();c.moveTo(p.x+Math.cos(a)*r1,p.y+Math.sin(a)*r1);c.lineTo(p.x+Math.cos(a+w*.006)*r0,p.y+Math.sin(a+w*.006)*r0);c.lineTo(p.x+Math.cos(a-w*.006)*r0,p.y+Math.sin(a-w*.006)*r0);c.closePath();c.fill()})})}
// ---------------- auras y movimientos de estado especiales ----------------
function fxAura(id,col,d){if(!O.fx||!$(id)||!pxCv())return Promise.resolve();const p=pos(id),hw=Math.max(30,p.w*.34);
  for(let i=0;i<40;i++)pxAdd({x:p.x+fxR(-hw,hw),y:p.y+p.h*fxR(.1,.4),vy:fxR(-160,-80),vx:fxR(-12,12),sh:"glow",c:["#ffffff",col],add:1,sz:fxR(6,12),sz1:.3,life:fxR(.45,.75),dl:i*((d||900)/1000/40),wob:[40,8]});
  return pxDraw(d||900,(c,u)=>{c.globalCompositeOperation="lighter";c.globalAlpha=Math.sin(u*Math.PI)*.55;const g=c.createRadialGradient(p.x,p.y+p.h*.1,4,p.x,p.y,p.w*.7);g.addColorStop(0,col);g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.beginPath();c.ellipse(p.x,p.y,p.w*.62,p.h*.6,0,0,6.283);c.fill()})}
async function fxSwords(id){const p=pos(id);fxAura(id,"#ff8a3a",1000);
  await pxDraw(900,(c,u)=>{const k=Math.min(1,u/.5);c.globalAlpha=u>.8?(1-u)/.2:1;
    for(const s of[-1,1]){c.save();c.translate(p.x+s*(1-k)*p.w*.7,p.y-p.h*.25);c.rotate(s*(.78*k+(1-k)*1.6));c.fillStyle="#e8ecf6";c.strokeStyle="#5a6278";c.lineWidth=1.5;
      c.beginPath();c.moveTo(0,-p.h*.55);c.lineTo(5,-p.h*.45);c.lineTo(5,p.h*.12);c.lineTo(-5,p.h*.12);c.lineTo(-5,-p.h*.45);c.closePath();c.fill();c.stroke();
      c.fillStyle="#c9a24a";c.fillRect(-12,p.h*.12,24,5);c.fillStyle="#6a3a1a";c.fillRect(-3,p.h*.12+5,6,16);c.restore()}
    if(u>.5&&u<.56)pxFlare({x:p.x,y:p.y-p.h*.3},"#ffffff",40,.3)});}
async function fxAfterimg(id,n){const el=$(id),im=el&&el.querySelector("img");if(!im||!O.fx)return;const b=BTE().getBoundingClientRect(),a=im.getBoundingClientRect(),flip=getComputedStyle(el).transform.includes("-1");
  for(let i=0;i<(n||4);i++){const g=document.createElement("img");g.src=im.src;g.className="fxghost";g.style.cssText="left:"+(a.left-b.left)+"px;top:"+(a.top-b.top)+"px;width:"+a.width+"px;height:"+a.height+"px"+(flip?";transform:scaleX(-1)":"");fxL().appendChild(g);
    const dx=(i%2?1:-1)*(18+i*10);fxAnim(g,[{translate:"0 0",opacity:.7},{translate:dx+"px 0",opacity:0}],{duration:520/pxSpd(),delay:i*70/pxSpd()})}
  await sleep(600)}
async function fxBarrier(id,col){const p=pos(id),w=p.w*1.1,h=p.h*1.05;
  await pxDraw(900,(c,u)=>{const k=Math.min(1,u/.3);c.globalAlpha=(u>.75?(1-u)/.25:1)*.75;c.globalCompositeOperation="lighter";
    const x0=p.x-w/2+(p.x>PX.w/2?-30:30),g=c.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,col+"00");g.addColorStop(.5,col);g.addColorStop(1,col+"00");
    c.fillStyle=g;c.globalAlpha*=.35;c.fillRect(x0,p.y-h/2+h*(1-k),w,h*k);c.globalAlpha/=.35;c.strokeStyle="#ffffff";c.lineWidth=2;c.strokeRect(x0,p.y-h/2+h*(1-k),w,h*k);
    const sx=x0+w*((u*1.6)%1);c.fillStyle="#ffffff";c.globalAlpha*=.5;c.beginPath();c.moveTo(sx,p.y-h/2);c.lineTo(sx+14,p.y-h/2);c.lineTo(sx-6,p.y+h/2);c.lineTo(sx-20,p.y+h/2);c.closePath();c.fill()})}
// ---------------- chorro continuo (lanzallamas, hidrobomba...) ----------------
function pxStream(ty,f,t,d,w){const C=FXC[ty]||FXC.normal,ang=Math.atan2(t.y-f.y,t.x-f.x),L=Math.hypot(t.x-f.x,t.y-f.y),sp=L/.3,ds=d/1000;
  return pxDraw(d,(c,u,D)=>{const on=u<.85,dt=Math.max(0,(u-(D.lu||0))*ds);D.lu=u;
    if(on){const n=Math.min(40,Math.ceil(dt*(ty==="fire"?190:150)));
      for(let i=0;i<n;i++){const a=ang+fxR(-.08,.08),age=fxR(0,dt),vx=Math.cos(a)*sp*fxR(.9,1.1),vy=Math.sin(a)*sp*fxR(.9,1.1),x=f.x+vx*age,y=f.y+vy*age;
        if(ty==="fire")pxAdd({x:x,y:y,vx:vx,vy:vy,sh:"glow",c:["#fffbe0","#fff1a0","#ffb030","#ff5a14","#a01c08"],add:1,sz:fxR(6,10)*w,sz1:2.6,life:.34,dr:1});
        else if(ty==="water")pxAdd({x:x,y:y,vx:vx,vy:vy,sh:i%3?"glow":"drop",c:i%3?["#ffffff","#8fd4ff","#2a7ee0"]:["#e8f8ff","#6cc6ff"],add:i%3?1:0,sz:(i%3?fxR(5,9):fxR(4,6))*w,sz1:i%3?1.8:1,life:.32,dr:1,rot:a+Math.PI/2});
        else pxType(ty,x,y,{a:a,sp:sp,life:.5,dr:1,ay:0})}}
    const k=Math.min(1,u/.25),fade=u>.8?(1-u)/.2:1;c.globalCompositeOperation="lighter";c.globalAlpha=.6*fade;c.translate(f.x,f.y);c.rotate(ang);
    const g=c.createLinearGradient(0,-9*w,0,9*w);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(.5,C[0]);g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(0,-9*w,L*k,18*w);
    if(u>.25&&on&&Math.random()<.8)pxType(ty,t.x+fxR(-12,12),t.y+fxR(-12,12),{sp:fxR(80,240),life:.55})})}
// ---------------- esfera de energia (bola sombra, esfera aural, pulso dragon...) ----------------
async function pxOrb(ty,f,t,big){const C=FXC[ty]||FXC.normal,R=big?26:19;
  // carga: espiral de particulas que convergen
  pxDraw(520,(c,u)=>{c.globalCompositeOperation="lighter";const rr=R*u;c.drawImage(pxGlow(C[1]),f.x-rr*2.2,f.y-rr*2.2,rr*4.4,rr*4.4);c.drawImage(pxGlow("#ffffff"),f.x-rr*.8,f.y-rr*.8,rr*1.6,rr*1.6);
    for(let i=0;i<3;i++){c.strokeStyle=C[i%2?0:1];c.lineWidth=2;c.globalAlpha=.7;c.beginPath();c.ellipse(f.x,f.y,rr*1.5,rr*.5,u*8+i*1.05,0,6.283);c.stroke()}});
  for(let i=0;i<30;i++){const a=fxR(0,6.283),rr=fxR(60,110);pxAdd({x:f.x+Math.cos(a)*rr,y:f.y+Math.sin(a)*rr,vx:Math.cos(a+1.6)*140,vy:Math.sin(a+1.6)*140,to:f,pull:24,dr:.86,sh:"glow",c:[C[0],C[1]],add:1,sz:fxR(3,6),life:.52,dl:i*.01})}
  await sleep(520);
  await pxProj(ty,f,t,{arc:-18,d:.5,tn:3,draw:(c,x,y,u)=>{c.globalCompositeOperation="lighter";c.drawImage(pxGlow(C[2]),x-R*2.4,y-R*2.4,R*4.8,R*4.8);c.drawImage(pxGlow(C[1]),x-R*1.5,y-R*1.5,R*3,R*3);
    if(ty==="dark"||ty==="ghost"||ty==="poison"){c.globalCompositeOperation="source-over";c.fillStyle=ty==="poison"?"#5e2280":"#1a0e24";c.beginPath();c.arc(x,y,R*.55,0,6.283);c.fill();c.globalCompositeOperation="lighter"}
    for(let i=0;i<3;i++){c.strokeStyle=C[0];c.lineWidth=2;c.globalAlpha=.8;c.beginPath();c.ellipse(x,y,R*1.1,R*.4,u*14+i*1.05,0,6.283);c.stroke()}c.globalAlpha=1;c.drawImage(pxGlow("#ffffff"),x-R*.5,y-R*.5,R,R)}});
  pxImpact(t,ty,big?1.6:1.25);pxRing(t,C[1],10,120,.6,8);pxRing(t,"#ffffff",10,80,.4,4);pxBurst(ty,t,24,{r:16});shake(big?12:8,450);fxFlash(C[0],.35,240);
  await sleep(220)}
// movimientos con animacion propia segun su nombre
const SIGMV=[
  [/lanzallamas|llamarada|sofoco|anillo ígneo|nitrocarga|pirotecnia|calcinación/,"stream"],
  [/hidrobomba|pistola agua|hidropulso|escaldar|rayo burbuja|hidrocañón|salmuera/,"stream"],
  [/bola sombra|esfera aural|bola energía|pulso dragón|pulso umbrío|bomba lodo|bola voltio|bola hielo|esfera|pulso/,"orb"],
  [/danza espada/,"swords"],[/agilidad|velocidad extrema|doble equipo|ataque rápido/,"ghost"],
  [/reflejo|pantalla de luz|velo sagrado|neblina/,"wall"],[/maquinación|paz mental|meditación|corpulencia|danza dragón|danza aleteo|refuerzo|afilar|rizo defensa|fortaleza|carga/,"aura"]
];
const _fxMoveBase=fxMove;
fxMove=async function(mv,fid,tid,mine){
  if(!O.fx||!$(fid)||!$(tid))return;pxCv();
  const nm=(mv.n||"").toLowerCase(),ty=mv.typeless?"normal":mv.t,big=mv.pw>=100||mv.rech;let sig=null;
  for(const[re,k] of SIGMV)if(re.test(nm)){sig=k;break}
  const f=pos(fid),t=pos(tid);
  if(sig==="stream"&&(ty==="fire"||ty==="water")){
    if(big)pxBg(FXC[ty][1],FXC[ty][2],1500,.4);
    fxSprFlash(fid,"brightness(1.6) drop-shadow(0 0 14px "+FXC[ty][1]+")",500);
    await pxStream(ty,{x:f.x+(t.x-f.x)*.12,y:f.y+(t.y-f.y)*.12-6},t,big?1300:950,big?1.5:1.1);
    pxImpact(t,ty,big?1.5:1.1);if(big)shake(10,500);await sleep(160);return}
  if(sig==="orb"){if(big)pxBg(FXC[ty][1],FXC[ty][2],1600,.4);await pxOrb(ty,{x:f.x+(t.x-f.x)*.1,y:f.y-10},t,big);return}
  if(mv.fx==="c"||mv.fx==="u"||mv.fx==="l"||mv.fx==="i")fxAfterimg(fid,3);
  return _fxMoveBase(mv,fid,tid,mine);
};
const _fxStatusBase=fxStatusMove;
fxStatusMove=async function(mv,id){
  if(!O.fx||!$(id))return;pxCv();const nm=(mv.n||"").toLowerCase(),C=FXC[mv.typeless?"normal":mv.t]||FXC.normal;let sig=null;
  for(const[re,k] of SIGMV)if(re.test(nm)){sig=k;break}
  if(sig==="swords"){await fxSwords(id);return}
  if(sig==="ghost"){await fxAfterimg(id,5);return}
  if(sig==="wall"){await fxBarrier(id,nm.includes("luz")?"#ffd35c":nm.includes("reflejo")?"#7fe0ff":C[1]);return}
  if(sig==="aura"){fxSprFlash(id,"brightness(1.5) drop-shadow(0 0 16px "+C[1]+")",900);await fxAura(id,C[1],950);return}
  return _fxStatusBase(mv,id);
};
// golpes: lineas de velocidad y fotograma de impacto en los super eficaces
const _hitBase=hitFx;
hitFx=function(el,e){_hitBase(el,e);if(!O.fx||!el||!el.id)return;try{if(e>1){const p=pos(el.id);pxSpeed(p,"#ffffff",320);pxFlare(p,"#ffffff",70,.22)}}catch(x){}};
// compatibilidad con el lanzamiento simple
ballfx=async function(id){};
// ---------------- ambiente del escenario: motas de luz, hojas, nieve, burbujas o brasas ----------------
const AMB={grass:["#ffffff","#fff8c8"],water:["#e8f8ff","#9ad7ff"],ice:["#ffffff","#e0f6ff"],canyon:["#ffe2b0","#ffb070"],night:["#c8b8ff","#8a6aff"],cave:["#ffe2b0","#c8a070"]};
let _amb=0;
function ambStart(env){
  ambStop();if(!O.fx)return;const cs=AMB[env]||AMB.grass,bt=BTE();if(!bt)return;
  let cv=bt.querySelector("canvas.ambc");if(!cv){cv=document.createElement("canvas");cv.className="ambc";bt.insertBefore(cv,bt.children[1]||null)}
  const ctx=cv.getContext("2d"),P2=[],dpr=Math.min(2,window.devicePixelRatio||1);let last=performance.now();
  const snow=env==="ice",up=env==="water"||env==="canyon",n=snow?40:24;
  const step=now=>{if(!cv.isConnected||$("arena").hidden){_amb=0;return}
    const w=bt.clientWidth,h=bt.clientHeight;if(cv.width!==Math.round(w*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);
    const dt=Math.min(.05,(now-last)/1000);last=now;ctx.clearRect(0,0,w,h);
    while(P2.length<n)P2.push({x:Math.random()*w,y:Math.random()*h,v:snow?fxR(14,30):fxR(6,16),s:snow?fxR(1.2,2.6):fxR(1,2.2),ph:Math.random()*6.283,c:cs[Math.random()<.5?0:1]});
    ctx.globalCompositeOperation="lighter";
    P2.forEach(q=>{q.ph+=dt;q.y+=(snow?q.v:up?-q.v:-q.v*.3)*dt;q.x+=Math.sin(q.ph*.8)*(snow?14:8)*dt+(snow?6*dt:0);
      if(q.y>h+5)q.y=-5;if(q.y<-5)q.y=h+5;if(q.x>w+5)q.x=-5;if(q.x<-5)q.x=w+5;
      ctx.globalAlpha=(snow?.8:.35+.35*Math.sin(q.ph*2.2));ctx.fillStyle=q.c;ctx.beginPath();ctx.arc(q.x,q.y,q.s,0,6.283);ctx.fill()});
    _amb=requestAnimationFrame(step)};
  _amb=requestAnimationFrame(step)}
function ambStop(){if(_amb)cancelAnimationFrame(_amb);_amb=0;const c=document.querySelector("#arena canvas.ambc");if(c){const x=c.getContext("2d");x.clearRect(0,0,c.width,c.height)}}
const _setSceneBase=setScene;
setScene=function(el,env){_setSceneBase(el,env);if(el&&el.id==="bscene")ambStart(env)};
// ================= colocacion de los Pokémon sobre la plataforma =================
// se mide la caja visible del sprite (sin el borde transparente) y se apoya en el centro de la plataforma,
// con un tamaño parecido para todos (los pequeños crecen y los gigantes se limitan)
const _bbx={};
function sprBox(im,cb){
  const src=im.currentSrc||im.src;if(_bbx[src])return cb(_bbx[src]);
  const nw=im.naturalWidth,nh=im.naturalHeight,gif=/\.gif(\?|$)/.test(src),fb={x:0,y:0,w:nw,h:gif?nh:nh*.84,nw:nw,nh:nh};
  if(!nw)return;if(/^data:/.test(src))return cb(_bbx[src]=fb);
  const t=new Image();t.crossOrigin="anonymous";
  t.onload=()=>{try{const W=t.naturalWidth,H=t.naturalHeight,c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d",{willReadFrequently:true});g.drawImage(t,0,0);const d=g.getImageData(0,0,W,H).data;
      let x0=W,y0=H,x1=-1,y1=-1;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
      _bbx[src]=x1<0?fb:{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,nw:W,nh:H}}catch(e){_bbx[src]=fb}
    cb(_bbx[src])};
  t.onerror=()=>cb(_bbx[src]=fb);t.src=src;
}
function sprFit(el){
  const im=el&&el.querySelector("img");if(!im||!im.naturalWidth)return;
  sprBox(im,bb=>{
    if(!el.isConnected||el.querySelector("img")!==im)return;
    const bt=el.closest(".bt");if(!bt)return;const me=el.id[0]==="m",dbl=bt.classList.contains("dbl"),sec=/2$/.test(el.id);
    const pl=bt.querySelector(".plat."+(me?"me":"opp"));if(!pl)return;const op=el.offsetParent;if(!op)return;
    // medidas en pixeles CSS del contenedor: se corrige cualquier escala/animacion (ventanas que se abren, zoom, pantalla completa)
    const R=op.getBoundingClientRect(),P=pl.getBoundingClientRect();if(!P.width||!R.width||!op.offsetWidth)return;
    const sx=R.width/op.offsetWidth,sy=R.height/(op.offsetHeight||op.offsetWidth)||sx;
    const r={left:R.left+op.clientLeft*sx,top:R.top+op.clientTop*sy},pr={left:P.left,top:P.top,width:P.width/sx,height:P.height/sy};pr.left=(P.left-r.left)/sx+r.left;pr.top=(P.top-r.top)/sy+r.top;
    const z=parseFloat(getComputedStyle(bt).getPropertyValue("--z"))||1;
    const big=Math.max(bb.w,bb.h)||1,k=(me?1.9:1.75)*z,mn=(me?(dbl?84:104):(dbl?68:84))*z,mx=(me?(dbl?140:168):(dbl?118:150))*z;
    let s=Math.min(mx,Math.max(mn,big*k))/big;
    if(im.classList.contains("hd")){const hm=(typeof HDH!=="undefined"&&HDH[im.dataset.i])||10,t=Math.max(0,Math.min(1,(Math.log(hm)-Math.log(3))/(Math.log(45)-Math.log(3))));s=(mn+(mx-mn)*(.15+.85*t))/big}
    const ax=pr.left-r.left+pr.width*(dbl?(me?(sec?.72:.28):(sec?.28:.72)):.5);
    let ay=pr.top-r.top+pr.height*.56-(dbl&&sec?14*z:0);
    const p=PM[im.dataset.n];if(p&&p[1]==="flying")ay-=12*z;
    if(!me){const room=ay-8*z;if(bb.h*s>room)s=Math.max(.05,room/bb.h)}
    const st=(e,k2,v)=>e.style.setProperty(k2,v,"important");
    st(im,"width",(bb.nw*s).toFixed(1)+"px");st(im,"height",(bb.nh*s).toFixed(1)+"px");st(im,"margin","0");st(im,"max-width","none");
    st(el,"left",(ax-(bb.x+bb.w/2)*s).toFixed(1)+"px");st(el,"top",(ay-(bb.y+bb.h)*s).toFixed(1)+"px");st(el,"right","auto");st(el,"bottom","auto");
    el.style.setProperty("--fb",((bb.nh-bb.y-bb.h)*s).toFixed(1)+"px");el.dataset.fit="1";
  });
}
function sprFitAll(){document.querySelectorAll(".bt .spr").forEach(e=>{if(!e.hidden)sprFit(e)})}
document.addEventListener("load",e=>{const t=e.target;if(t&&t.tagName==="IMG"&&t.closest){const s=t.closest(".bt .spr");if(s)sprFit(s)}},true);
// reajuste continuo: cada vez que cambia el tamaño del combate (redimensionar, pantalla completa, girar el movil, ventana que se muestra)
let _fitQ=0;const sprFitSoon=()=>{if(_fitQ)return;_fitQ=requestAnimationFrame(()=>{_fitQ=0;sprFitAll()})};
window.addEventListener("resize",()=>{sprFitSoon();setTimeout(sprFitAll,120);setTimeout(sprFitAll,400)});
document.addEventListener("fullscreenchange",()=>{setTimeout(sprFitAll,80);setTimeout(sprFitAll,450)});
if(window.ResizeObserver){const _ro=new ResizeObserver(sprFitSoon),_seen=new WeakSet();
  const _obs=()=>document.querySelectorAll(".bt,.bt .plat").forEach(b=>{if(!_seen.has(b)){_seen.add(b);_ro.observe(b)}});
  _obs();let _oq=0;new MutationObserver(()=>{if(!_oq)_oq=setTimeout(()=>{_oq=0;_obs()},700)}).observe(document.body,{childList:true,subtree:true})}
const _setSprBase=setSpr;
setSpr=function(i,sn){_setSprBase(i,sn);const sl=B&&B.SL&&B.SL[i];if(sl&&$(sl.sp)){const e=$(sl.sp);sprFit(e);requestAnimationFrame(()=>sprFit(e));setTimeout(()=>sprFit(e),350)}};
const _bigZoomBase=bigZoom;
bigZoom=function(){_bigZoomBase();setTimeout(sprFitAll,30)};
