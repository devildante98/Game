// =====================================================================================
// GRÁFICOS DE EXPLORACIÓN AL ESTILO CLÁSICO (dibujos propios, pixel a pixel)
// Hierba con matas en patrón regular, hierba alta más densa y oscura, y suelos interiores en damero o tarima.
// =====================================================================================
Object.assign(GRP,{b:"#78c858",d:"#50a040",l:"#a8e488",k:"#3a8030"});
// mata de hierba de 6×4 (como en los juegos clásicos: dos hojitas en «V»)
const XTUFT=[".d..d.","dld.ld","d.dd.d",".k..k."];
xGrassBase=function(g,v,pal){pal=pal||GRP;xr(g,0,0,32,32,pal.b);
  // tramado suave en diagonal para dar textura sin ruido
  g.fillStyle=pal.l;g.globalAlpha=.22;for(let y=0;y<32;y+=4)for(let x=(y/4%2)*4;x<32;x+=8)g.fillRect(x,y,2,1);g.globalAlpha=1;
  // matas en posiciones fijas (patrón regular) con un poco de variación por casilla
  const spots=[[3,4],[19,2],[11,13],[26,16],[4,23],[18,26]];
  spots.forEach(([x,y],i)=>{if((v+i)%5===4)return;xbmp(g,x,y,XTUFT,{d:pal.d,l:pal.l,k:pal.k||pal.d},(v+i)%2===1)});
  // alguna florecilla o piedrecita muy de vez en cuando
  if(v===1){xr(g,27,6,1,1,"#ffffff");xr(g,26,7,3,1,"#ffffff");xr(g,27,8,1,1,"#ffffff");xr(g,27,7,1,1,"#f8d030")}
  if(v===3){xr(g,9,28,2,1,"#9aa0a8");xr(g,9,27,2,1,"#c8ccd2")}};
// hierba alta: 4 matas grandes de hojas con contorno oscuro sobre la hierba (dibujo propio)
const XTALL=["......k.........",".....klk....k...","..k..kllk..klk..",".klk.kldk.klldk.",".kldkkldkkldldk.","kldmkldmkldmmdk.","kdmmkdmmkdmmmdk.","kdmdmdmmdmmdmdk.","kdmmmdmmmdmmmdk.",".kddmmddmmddmk..","..kkdddddddkk...","....kkkkkkk....."];
xTall=function(kind,v,fr,base){const k="T3"+kind+v+fr+base;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  if(base==="s")g.drawImage(xSand(0,v),0,0);else xGrassBase(g,v,kind==="d"?{b:"#4a8a40",d:"#356a30",l:"#68a858",k:"#2a5a28"}:kind==="g"?{b:"#c8c070",d:"#a89a48",l:"#e0d890",k:"#8a7a30"}:GRP);
  const P=kind==="d"?{k:"#0f2e12",d:"#1d4f22",m:"#2a6e30",l:"#5aa858"}:kind==="g"?{k:"#5a4a18",d:"#8a7a30",m:"#b0a048",l:"#ece0a0"}:{k:"#1f4f1c",d:"#2f7a2a",m:"#44a03a",l:"#8ee070"};
  [[0,3],[16,3],[0,19],[16,19]].forEach(([x,y],i)=>xbmp(g,x+(fr&&i%2?1:0),y,XTALL,P,i%2===1));
  return XG[k]=c};
// suelos interiores
{const _f=xFloor;xFloor=function(fl,x,y){if(fl==="wood"){const v=(x*7+y*3)%4,k="FW2"+v+(y%2)+(x%2);if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
    xr(g,0,0,32,32,"#c08850");for(let r=0;r<4;r++){const yy=r*8;xr(g,0,yy,32,1,"#8a5a2c");xr(g,0,yy+1,32,1,"#d8a46c");const o=((r+y+x)%3)*11;xr(g,o,yy,1,8,"#8a5a2c");xr(g,o+1,yy+1,1,7,"#d29a60");
      xr(g,(o+6+v*3)%30,yy+4,4,1,"#a8743e")}return XG[k]=c}
  if(fl==="clean"||fl==="tile"){const dark=(x+y)%2===1,k="FC2"+(dark?1:0);if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
    const b=dark?"#cfd4dc":"#f2f4f8",hi=dark?"#e4e8ee":"#ffffff",sh=dark?"#b2b8c4":"#d8dde6";
    xr(g,0,0,32,32,b);xr(g,0,0,32,2,hi);xr(g,0,0,2,32,hi);xr(g,0,30,32,2,sh);xr(g,30,0,2,32,sh);xr(g,6,6,4,1,hi);xr(g,6,6,1,4,hi);return XG[k]=c}
  return _f.apply(this,arguments)}}
// agua: más profunda, con olas en «~» y orilla con borde oscuro y espuma
xWater=function(m,v,fr){const k="W2"+m+"_"+v+"_"+fr;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  xr(g,0,0,32,32,"#4a88e0");for(let y=0;y<32;y+=2)if((y/2+v)%4===0)xr(g,0,y,32,1,"#5294e6");
  // olas
  [[4,6],[18,14],[8,22],[22,28]].forEach(([x,y],i)=>{const o=(fr+i)%2;xr(g,x+o,y,2,1,"#a8d4ff");xr(g,x+2+o,y-1,2,1,"#e0f2ff");xr(g,x+4+o,y,2,1,"#a8d4ff");xr(g,x+o,y+1,6,1,"#3a74c8")});
  // orilla: borde oscuro y espuma blanca en los lados que tocan tierra
  const edge=(hor,pos,dir)=>{for(let t=0;t<32;t++){const X=hor?t:pos,Y=hor?pos:t;xr(g,X,Y,1,1,"#2a4a8a");const w=1+((t+fr*3+v)%7<3?1:0);for(let d=1;d<=w;d++){xr(g,hor?t:pos+d*dir,hor?pos+d*dir:t,1,1,d===1?"#ffffff":"#cfe8ff")}}};
  if(!(m&1))edge(true,0,1);if(!(m&4))edge(true,31,-1);if(!(m&8))edge(false,0,1);if(!(m&2))edge(false,31,-1);
  return XG[k]=c};

// =====================================================================================
// INTERIORES: muebles nuevos (dibujos propios) y escaleras con animación al subir y bajar
// B cama · C armario · D mesa de comedor · E cómoda · G fogones · K encimera · L nevera · M silla · O escritorio · S sofá · U parte alta de la escalera
// =====================================================================================
const XFURN="BCDEGKLMOS";
{const _b=exBlocked;exBlocked=function(x,y){const c=exAt(x,y);if(XFURN.includes(c)||c==="U")return true;return _b.apply(this,arguments)}}
const xInk="#2b2440";
const xMapV=()=>{const m=String(EX.map||"");let h=0;for(const ch of m)h=(h*31+ch.charCodeAt(0))>>>0;return h%4};
function xFurn(ch,x,y){const v=(x*3+y)%4,nb=d=>{const[a,b]=d;return exAt(x+a,y+b)===ch},k="FU"+ch+v+(nb([-1,0])?1:0)+(nb([1,0])?1:0)+(nb([0,-1])?1:0)+(nb([0,1])?1:0);if(XG[k])return XG[k];
  const c=xc(32,48),g=c.getContext("2d"),R=(a,b,w,h,col)=>xr(g,a,b,w,h,col),sh=()=>xdisc(g,16,45,13,3,"rgba(0,0,0,.2)"),L=nb([-1,0]),Rt=nb([1,0]),Up=nb([0,-1]),Dn=nb([0,1]);
  if(ch==="B"){sh();const bl=["#e8414f","#3a8cff","#5ad1a0","#f0a020"][v];R(2,4,28,42,xInk);R(3,5,26,10,"#9a6634");R(3,5,26,3,"#c08850");R(3,15,26,30,"#f6f6fa");R(6,17,20,7,"#ffffff");R(6,23,20,1,"#d8dce6");R(3,26,26,19,bl);R(3,26,26,3,"#ffffff55");R(3,31,26,1,"rgba(0,0,0,.18)");R(3,43,26,2,"rgba(0,0,0,.25)")}
  else if(ch==="C"){sh();R(2,2,28,43,xInk);R(3,3,26,41,"#a8703c");R(3,3,26,4,"#c8905a");R(15,7,2,36,xInk);R(11,22,2,4,"#ffd34a");R(19,22,2,4,"#ffd34a");R(5,9,8,32,"#b47c46");R(19,9,8,32,"#b47c46")}
  else if(ch==="D"){if(!Dn)sh();const t0=Up?0:16;R(L?0:1,t0,32-(L?0:1)-(Rt?0:1),Dn?32+16-t0:22-(t0-16),xInk);R(L?0:2,t0+(Up?0:1),32-(L?0:2)-(Rt?0:2),Dn?48-t0:20-(t0-16),"#c08850");if(!Up)R(L?0:2,t0+1,32-(L?0:2)-(Rt?0:2),3,"#dcaa72");
    if(!Up&&(v%2===0)){xdisc(g,16,28,6,4,xInk);xdisc(g,16,28,5,3,"#ffffff");xdisc(g,16,28,2,1.5,"#f0a020")}if(!Dn){R(L?0:2,38,32-(L?0:2)-(Rt?0:2),2,"#8a5a2c");if(!L)R(3,40,3,6,xInk);if(!Rt)R(26,40,3,6,xInk)}}
  else if(ch==="E"){sh();R(3,6,26,40,xInk);R(4,7,24,14,"#cfe8ff");R(5,8,10,5,"#ffffff");R(4,21,24,24,"#b47c46");R(4,21,24,3,"#d29a60");[27,35].forEach(yy=>{R(6,yy,20,6,"#9a6634");R(14,yy+2,4,2,"#ffd34a")})}
  else if(ch==="G"){sh();R(0,14,32,32,xInk);R(1,15,30,30,"#e8eaf0");R(1,15,30,10,"#cfd4dc");[[8,19],[22,19]].forEach(([a,b])=>{xdisc(g,a,b,5,3,xInk);xdisc(g,a,b,3,2,"#e8414f")});R(5,28,22,13,xInk);R(6,29,20,11,"#3a3f58");R(8,31,16,3,"#5a6078")}
  else if(ch==="K"){sh();R(L?0:0,14,32,32,xInk);R(L?0:1,15,Rt?32-(L?0:1):31-(L?0:1),30,"#f2efe6");R(L?0:1,15,32-(L?0:1)-(Rt?0:1),6,"#9aa6b8");R(L?0:1,21,32-(L?0:1)-(Rt?0:1),2,"#7a8698");
    if(v%2===0){R(8,16,16,4,xInk);R(9,16,14,3,"#8ac8f0");R(15,12,2,5,"#9aa6b8")}R(4,26,11,16,"#d8d2c2");R(17,26,11,16,"#d8d2c2");R(12,32,2,4,xInk);R(18,32,2,4,xInk)}
  else if(ch==="L"){sh();R(4,0,24,46,xInk);R(5,1,22,44,"#f4f7fb");R(5,1,22,3,"#ffffff");R(5,17,22,2,"#b8c0cc");R(23,6,2,8,"#9aa6b8");R(23,22,2,14,"#9aa6b8");R(8,5,8,4,v%2?"#ff8a94":"#5ad1a0")}
  else if(ch==="M"){sh();R(9,18,14,6,xInk);R(10,19,12,4,"#b47c46");R(8,26,16,8,xInk);R(9,27,14,6,"#c8905a");R(10,34,2,11,xInk);R(20,34,2,11,xInk)}
  else if(ch==="O"){sh();R(1,22,30,24,xInk);R(2,23,28,22,"#b47c46");R(2,23,28,4,"#d29a60");R(4,31,10,12,"#9a6634");R(8,4,18,16,xInk);R(9,5,16,12,"#14304a");R(10,6,10,2,"#5ad1a0");R(10,10,13,2,"#3a8cff");R(15,17,4,6,xInk);R(19,26,9,3,"#e8eaf0")}
  else if(ch==="S"){sh();const cl=["#5a7ad8","#d85a6a","#4aa86a","#a86ad8"][xMapV()];R(L?0:1,10,32-(L?0:1)-(Rt?0:1),34,xInk);R(L?0:2,11,32-(L?0:2)-(Rt?0:2),32,cl);R(L?0:2,11,32-(L?0:2)-(Rt?0:2),4,"rgba(255,255,255,.3)");
    R(L?0:2,30,32-(L?0:2)-(Rt?0:2),2,"rgba(0,0,0,.22)");if(!L){R(1,16,7,28,xInk);R(2,17,5,26,cl);R(2,17,5,3,"rgba(255,255,255,.35)")}if(!Rt){R(24,16,7,28,xInk);R(25,17,5,26,cl);R(25,17,5,3,"rgba(255,255,255,.35)")}if(Rt&&L||(!L&&Rt)||(L&&!Rt))R(L?0:2,20,32-(L?0:2)-(Rt?0:2),1,"rgba(0,0,0,.15)")}
  return XG[k]=c}
// escalera que sube (2 casillas: «U» arriba y la de la escalera abajo) y escalera que baja (un hueco con barandilla)
function xStairsUp(part,open){const k="SU"+part+open;if(XG[k])return XG[k];const full=xc(32,64),g=full.getContext("2d"),R=(a,b,w,h,col)=>xr(g,a,b,w,h,col);
  R(0,0,32,64,"#3a2a1c");
  for(let i=0;i<8;i++){const y=i*8,dk=1-(7-i)*.06,tread=`rgb(${Math.round(210*dk)},${Math.round(160*dk)},${Math.round(100*dk)})`,riser=`rgb(${Math.round(150*dk)},${Math.round(104*dk)},${Math.round(60*dk)})`;
    R(5,y,22,5,tread);R(5,y,22,1,`rgba(255,255,255,${.25*dk})`);R(5,y+5,22,3,riser);R(5,y+7,22,1,"rgba(0,0,0,.35)")}
  // laterales (zanca) y barandilla en el lado que da a la habitación
  R(0,0,5,64,"#7a4a26");R(27,0,5,64,"#7a4a26");R(0,0,1,64,xInk);R(31,0,1,64,xInk);
  const rx=open==="l"?1:27;for(let y=4;y<64;y+=10){R(rx+1,y,2,8,"#e8d8b8");R(rx+1,y,2,1,"#fff")}R(rx,0,4,3,"#5a3a20");R(rx,0,4,64,"rgba(0,0,0,0)");R(rx+1,0,2,64,"rgba(90,58,32,.55)");
  // sombra arriba (sube hacia el piso de arriba)
  const gr=g.createLinearGradient(0,0,0,26);gr.addColorStop(0,"rgba(0,0,0,.55)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,32,26);
  const c=xc(32,32);c.getContext("2d").drawImage(full,0,part?32:0,32,32,0,0,32,32);return XG[k]=c}
function xStairsDown(open){const k="SD"+open;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d"),R=(a,b,w,h,col)=>xr(g,a,b,w,h,col);
  g.drawImage(xFloor("wood",0,0),0,0);R(3,0,26,32,xInk);
  for(let i=0;i<5;i++){const y=31-i*6-6,dk=.95-i*.15;R(4,y,24,4,`rgb(${Math.round(200*dk)},${Math.round(150*dk)},${Math.round(92*dk)})`);R(4,y+4,24,2,`rgb(${Math.round(120*dk)},${Math.round(80*dk)},${Math.round(44*dk)})`)}
  R(4,0,24,5,"#140c08");const rx=open==="l"?0:28;R(rx,0,4,32,"#7a4a26");R(rx+1,0,2,32,"#e8d8b8");R(rx+1,0,2,1,"#fff");[6,16,26].forEach(y=>R(rx,y,4,2,"#5a3a20"));return XG[k]=c}
const xStOpen=x=>x>7?"l":"r";
{const _g=xGround;xGround=function(x,y,fr){try{const c=exAt(x,y),M=EX.M,w=M&&M.w&&M.w[c];
  if(XFURN.includes(c))return xFloor(M.fl||"wood",x,y);
  if(c==="U")return xStairsUp(0,xStOpen(x));
  if(w&&w.look==="stairsup")return xStairsUp(1,xStOpen(x));
  if(w&&w.look==="stairsdown")return xStairsDown(xStOpen(x))}catch(e){}return _g.apply(this,arguments)}}
{const _o=xObj;xObj=function(c,x,y){if(XFURN.includes(c))return xFurn(c,x,y);return _o.apply(this,arguments)}}
// mirar los muebles
const XFURN_TXT={B:["Una cama mullidita. Da ganas de echarse una siesta."],C:["Un armario lleno de ropa. ¡Hay hasta una gorra de entrenador!"],D:["La mesa está puesta. Huele a comida casera."],E:["Una cómoda con un espejo. Te ves con cara de aventura."],
  G:["Los fogones. Hay una olla con sopa de bayas al fuego."],K:["La encimera de la cocina, limpia y ordenada."],L:["La nevera está llena de comida… y de comida para Pokémon."],M:["Una silla de madera."],O:["Un ordenador. En la pantalla hay un artículo sobre Pokémon legendarios."],
  S:["Un sofá muy cómodo. Desde aquí se ve bien la tele."],V:["En la tele están dando un programa sobre concursos Pokémon."],Z:["Libros sobre Pokémon: «Tipos y debilidades», «Guía de bayas», «Leyendas de la región»…"]};
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&EX.M&&/_h1$|_h2$|_h2b$/.test(EX.map)){const[dx,dy]=EXDIR[EX.f],c=exAt(EX.x+dx,EX.y+dy);
  if(XFURN_TXT[c]&&!EX.npcs.some(n=>n.px===EX.x+dx&&n.py===EX.y+dy)){snd("ui");exSay(XFURN_TXT[c]);return}}}catch(e){}return _i.apply(this,arguments)}}
// animación de subir o bajar la escalera
{const _a=exArrive;exArrive=function(){try{const c=exAt(EX.x,EX.y),w=EX.M&&EX.M.w&&EX.M.w[c];if(w&&/^stairs/.test(w.look)&&!EX.climb){EX.climb={t0:performance.now(),up:w.look==="stairsup",out:1};EX.keys={};EX.kst=[];snd("ui");
  const self=this,args=arguments;setTimeout(()=>{const cl=EX.climb;EX.climb=null;_a.apply(self,args);EX.climbIn={t0:performance.now()+500,up:cl.up}},420);return}}catch(e){}return _a.apply(this,arguments)}}
{const _u=exUpdate;exUpdate=function(dt,ts){if(EX.climb||(EX.climbIn&&performance.now()-EX.climbIn.t0<380))return;return _u.apply(this,arguments)}}
{const _t=exDrawTr;exDrawTr=function(g,code,face,x,y,fr,beat,me,ph){if(me&&(EX.climb||EX.climbIn)){const now=performance.now();let k=0,up=true;
  if(EX.climb){k=Math.min(1,(now-EX.climb.t0)/400);up=EX.climb.up}else{const t=(now-EX.climbIn.t0)/380;if(t>=1){EX.climbIn=null;return _t.apply(this,arguments)}k=1-Math.max(0,t);up=!EX.climbIn.up}
  g.save();g.globalAlpha=Math.max(0,1-k*.85);const dy=up?-k*16:k*14;const r=_t.call(this,g,code,face,x,y+dy,(Math.floor(now/120)%2)?1:3,beat,me,ph);g.restore();return r}
  return _t.apply(this,arguments)}}
