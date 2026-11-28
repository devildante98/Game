// =====================================================================================
// EXPLORACIÓN · ASPECTO MÁS CLÁSICO (8.8)
// 1) Bosques compactos: las copas de los árboles vecinos se unen (sin huecos de césped entre árbol y árbol)
// 2) Hierba alta: también tapa los pies de los NPC y del compañero
// 3) Escenario vivo: huellas en la arena, salpicaduras al andar bajo la lluvia, hojas que vuelan con el viento
// 4) Caja de diálogo clásica (estilos en p_v8.css) con un «bip» suave al escribir
// 5) Transiciones al combate: remolino para los salvajes, círculo que se cierra para los entrenadores
// 6) Suelo con más textura (césped con dibujo en mosaico)
// 7) Interiores con sombra al pie de las paredes
// 8) Pantalla más limpia: minimapa oculto por defecto y objetivo más discreto
// 9) Nitidez: el pixel art ya se escala sin suavizado y personajes y objetos ya tenían sombra; se mantiene
// Todo está dibujado a mano para este juego (no se usa ningún gráfico de otros juegos).
// =====================================================================================
const XV={on:true,fp:[],sp:[],lv:[],lvT:0};
const xvTree=c=>c==="#";
// ---------- 6) césped con dibujo en mosaico ----------
{const _gb=xGrassBase;xGrassBase=function(g,v,pal){_gb.apply(this,arguments);try{pal=pal||GRP;
    // retícula diagonal de briznas claras y oscuras (como el césped de los juegos clásicos), cada 8 px y alternando
    g.save();g.globalAlpha=.55;
    for(let y=0;y<32;y+=8)for(let x=((y/8)%2)*4;x<32;x+=8){const r=X2R(v,x*7+y,9);if(r<.35)continue;
      g.fillStyle=pal.l;g.fillRect(x,y,2,2);g.fillStyle=pal.d;g.fillRect(x+2,y+2,2,2)}
    g.restore()}catch(e){}}
  Object.keys(XG).forEach(k=>delete XG[k]);Object.keys(EXTILE).forEach(k=>delete EXTILE[k])}
// ---------- 7) interiores: sombra al pie de las paredes ----------
{const _g=xGround;xGround=function(x,y,fr){const t=_g.apply(this,arguments);try{const M=EX.M;if(!M||M.base!=="F"||!t)return t;
    const up=exAt(x,y-1),c=exAt(x,y);if(up!=="W"||c==="W"||c==="x")return t;
    const k="XVSH|"+(t.__xv||(t.__xv=Math.random().toString(36).slice(2)));if(XG[k])return XG[k];
    const o=xc(32,32),g=o.getContext("2d");g.drawImage(t,0,0);const gr=g.createLinearGradient(0,0,0,12);gr.addColorStop(0,"rgba(20,10,30,.5)");gr.addColorStop(1,"rgba(20,10,30,0)");g.fillStyle=gr;g.fillRect(0,0,32,12);
    return XG[k]=o}catch(e){return t}}}
// ---------- 1, 2, 3 y 9: capas extra entre los personajes ----------
// cortes del árbol: la copa (sin tronco ni sombra) se copia en la unión entre dos árboles vecinos
function xvCanopy(o){return o&&o.height>=48?o:null}
{const _x=exExtraEnts;exExtraEnts=function(ents,g,cx,cy,ts){const r=_x.apply(this,arguments);try{if(EX.title||!XV.on)return r;const M=EX.M;if(!M)return r;
    const W=g.canvas.width/EXS,H=g.canvas.height/EXS,x0=Math.floor(cx/EXTL)-1,y0=Math.floor(cy/EXTL)-1,x1=Math.ceil((cx+W)/EXTL)+1,y1=Math.ceil((cy+H)/EXTL)+2;
    // 1) bosques compactos
    if(M.base!=="F"&&M.base!=="c"){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!xvTree(exAt(x,y)))continue;
        const sw=Math.round(Math.sin(ts/1300+x*.9+y*1.7)*.75+Math.sin(ts/470+x)*.25);
        if(xvTree(exAt(x+1,y))){const o=xvCanopy(xObj("#",x+1,y));if(o){const X=x*EXTL-cx+16,Y=y*EXTL-cy-16;ents.push({y:y-.0006,d:()=>g.drawImage(o,0,0,32,34,X+sw,Y+2,32,34)})}}
        if(xvTree(exAt(x+1,y))&&xvTree(exAt(x,y+1))&&xvTree(exAt(x+1,y+1))){const o=xvCanopy(xObj("#",x,y+1));if(o){const X=x*EXTL-cx+16,Y=y*EXTL-cy;ents.push({y:y+.4,d:()=>g.drawImage(o,0,0,32,34,X+sw,Y+2,32,34)})}}}}
    // 2) hierba alta sobre los pies de los NPC y del compañero
    const gr=(x,y)=>{const c=exAt(Math.round(x),Math.round(y));return c==="T"||c==="d"||c==="g"};
    const cover=(px,py,yy)=>{const tx=Math.round(px),ty=Math.round(py);if(!gr(tx,ty)||Math.abs(px-tx)>.3||Math.abs(py-ty)>.3)return;
      ents.push({y:yy+.0004,d:()=>{const t=xGround(tx,ty,Math.floor(ts/500)%2);g.drawImage(t,0,16,32,16,Math.round(px*EXTL-cx),Math.round(py*EXTL-cy)+16,32,16)}})};
    (EX.npcs||[]).forEach(n=>{const q=exNpcPos(n);cover(q.x,q.y,q.y)});
    if(EX.fol&&typeof exFolPos==="function"){const p=exFolPos();cover(p.x,p.y,p.y-.01)}
    // 3) huellas en la arena (se borran solas)
    const now=performance.now();XV.fp=XV.fp.filter(f=>now-f.t<5000);
    XV.fp.forEach(f=>{const a=1-(now-f.t)/5000;ents.push({y:f.y-.6,d:()=>{g.globalAlpha=.55*a;g.fillStyle="#9a7640";const X=f.x*EXTL-cx,Y=f.y*EXTL-cy,v=f.f==="l"||f.f==="r";
      if(v){g.fillRect(X+7,Y+18,6,3);g.fillRect(X+18,Y+23,6,3)}else{g.fillRect(X+10,Y+16,3,6);g.fillRect(X+19,Y+22,3,6)}g.globalAlpha=1}})});
    // 3) salpicaduras bajo la lluvia
    XV.sp=XV.sp.filter(s=>now-s.t<420);
    XV.sp.forEach(s=>{const k=(now-s.t)/420;ents.push({y:s.y+.002,d:()=>{g.globalAlpha=.7*(1-k);g.strokeStyle="#d8ecff";g.lineWidth=1;g.beginPath();g.ellipse(s.x*EXTL-cx+16,s.y*EXTL-cy+29,3+k*9,1+k*3,0,0,Math.PI*2);g.stroke();
      g.fillStyle="#e8f4ff";for(let i=0;i<3;i++){const a=i*2.1+s.r;g.fillRect(Math.round(s.x*EXTL-cx+16+Math.cos(a)*(4+k*8)),Math.round(s.y*EXTL-cy+27-k*8+k*k*10),1.5,1.5)}g.globalAlpha=1}})});
    // 3) hojas que cruzan la pantalla con el viento (exteriores con árboles, sin lluvia ni nieve fuerte)
    if(M.base!=="F"&&M.base!=="c"&&!(typeof hubCalm==="function"&&hubCalm())){
      if(ts-XV.lvT>900&&XV.lv.length<6&&Math.random()<.35){XV.lvT=ts;const pal=M.pal==="snow"?["#ffffff","#e4f0ff"]:M.pal==="ash"?["#9a8f86","#c8bfb6"]:(typeof SEA_I!=="undefined"&&SEA_I==="oto")||new Date().getMonth()>=8&&new Date().getMonth()<=10?["#e8a040","#d0603a","#f0c858"]:["#6cc05a","#9ade70","#4e9a48"];
        XV.lv.push({x:cx-10,y:cy+Math.random()*H*.8,vx:28+Math.random()*30,vy:6+Math.random()*10,a:Math.random()*6,c:pal[Math.floor(Math.random()*pal.length)],t0:ts})}
      XV.lv=XV.lv.filter(l=>ts-l.t0<14000&&l.x<cx+W+20);
      ents.push({y:1e6,d:()=>{const dt=Math.min(.05,(ts-(XV.lvL||ts))/1000);XV.lvL=ts;XV.lv.forEach(l=>{l.x+=l.vx*dt;l.y+=(l.vy+Math.sin(ts/300+l.a)*14)*dt;l.a+=dt*3;
        const X=Math.round(l.x-cx),Y=Math.round(l.y-cy),fl=Math.sin(l.a)>0;g.fillStyle=l.c;g.fillRect(X,Y,fl?3:2,fl?2:3);g.fillStyle="rgba(0,0,0,.18)";g.fillRect(X+(fl?1:0),Y+(fl?2:3),fl?2:1,1)})}})}
  }catch(e){XV.err=String(e&&e.stack||e)}return r}}
// 3) al pisar: huellas en la arena y salpicaduras si llueve
{const _s=exStepFx;exStepFx=function(x,y,f,run){const r=_s.apply(this,arguments);try{const c=exAt(x,y),now=performance.now();
    if(c==="s")XV.fp.push({x,y,f,t:now});
    if(EX.wx==="rain"&&EX.M&&EX.M.base!=="F"&&c!=="~"&&c!=="w")XV.sp.push({x,y,t:now,r:Math.random()*6})}catch(e){}return r}}
// ---------- 4) diálogo: «bip» suave mientras se escribe ----------
{const _d=exDlgDraw;exDlgDraw=function(){const d=EX.dlg,c0=d?Math.floor(d.c||0):0,r=_d.apply(this,arguments);try{if(d&&!O.exTxt&&O.exBip!==false){const c1=Math.floor(d.c||0);
      if(c1>c0&&c1%4===0&&typeof snd==="function"&&(!XV.bipT||performance.now()-XV.bipT>70)){XV.bipT=performance.now();xvBip()}}}catch(e){}return r}}
function xvBip(){try{const c=typeof sx==="function"?sx():null;if(!c||typeof sgain==="undefined")return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime;
  o.type="square";o.frequency.setValueAtTime(900+Math.random()*80,t);g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.0001,t+.035);o.connect(g);g.connect(sgain);o.start(t);o.stop(t+.045)}catch(e){}}
// ---------- 5) transiciones al combate ----------
{const _d=exDraw;exDraw=function(ts){const T0=EX.trans,hide=T0&&(T0.k==="wild"||T0.k==="trainer")&&T0.t/T0.d>=.45;
  // en la segunda mitad, las franjas antiguas no se dibujan: solo la transición nueva
  if(hide)EX.trans=null;let r;try{r=_d.apply(this,arguments)}finally{if(hide)EX.trans=T0}
  try{const T=EX.trans;if(!T||(T.k!=="wild"&&T.k!=="trainer")||!EX.cv)return r;
    const p=Math.min(1,T.t/T.d);if(p<.45)return r;const q=Math.min(1,(p-.45)/.5),cv=EX.cv,g=cv.getContext("2d"),W=cv.width,H=cv.height;g.save();g.setTransform(1,0,0,1,0,0);
    // fondo: lo que había antes de las barras del juego (las tapamos con nuestra transición)
    if(T.k==="wild"){// remolino: 8 aspas negras que giran y se ensanchan hasta cubrirlo todo
      const R=Math.hypot(W,H),N=8,cxp=W/2,cyp=H/2,rot=q*Math.PI*1.2;g.fillStyle="#000";
      for(let i=0;i<N;i++){const a0=rot+i*2*Math.PI/N;g.beginPath();g.moveTo(cxp,cyp);g.arc(cxp,cyp,R,a0,a0+(2*Math.PI/N)*Math.min(1,q*1.15));g.closePath();g.fill()}}
    else{// entrenador: círculo que se cierra sobre ti, con borde de cuadros
      const cam=EX.cam||[0,0],px=(EX.px*EXTL+16-cam[0])*EXS,py=(EX.py*EXTL+8-cam[1])*EXS,R=Math.hypot(W,H)*(1-q);
      g.fillStyle="#000";g.beginPath();g.rect(0,0,W,H);g.arc(px,py,Math.max(0,R),0,Math.PI*2,true);g.fill("evenodd");
      if(R>8){g.fillStyle="#e83a50";const n=28;for(let i=0;i<n;i++){const a=i*2*Math.PI/n+q*3;g.fillRect(Math.round(px+Math.cos(a)*R)-4,Math.round(py+Math.sin(a)*R)-4,8,8)}}}
    g.restore()}catch(e){}return r}}
// ---------- 8) pantalla más limpia: el minimapa empieza oculto (se puede volver a mostrar con 🧭) ----------
try{if(localStorage.getItem("exmm")==null&&typeof EXMM!=="undefined")EXMM.on=false}catch(e){}
