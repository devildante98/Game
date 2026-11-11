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
  const self=this,args=arguments;setTimeout(()=>{EX.climbHold=EX.climb;EX.climb=null;_a.apply(self,args);setTimeout(()=>{EX.climbHold=null},600)},360);return}}catch(e){}return _a.apply(this,arguments)}}
{const _u=exUpdate;exUpdate=function(dt,ts){if(EX.climb)return;return _u.apply(this,arguments)}}
// al pisar la escalera: el personaje da un paso subiendo (o bajando) los peldaños, sin transparencias; luego la pantalla funde a negro
{const _t=exDrawTr;exDrawTr=function(g,code,face,x,y,fr,beat,me,ph){const cl=me&&(EX.climb||EX.climbHold);if(cl){const k=Math.min(1,(performance.now()-cl.t0)/360);
  const dy=cl.up?-k*10:-k*6,step=(Math.floor(performance.now()/110)%2)?1:3;return _t.call(this,g,code,face,x,y+dy,EX.climb?step:0,beat,me,ph)}
  return _t.apply(this,arguments)}}

// =====================================================================================
// ÁRBOLES, CAMINOS Y FACHADAS (estilo clásico, dibujos propios)
// =====================================================================================
// árbol: copa redonda en capas con hojas en «escamas», brillo arriba a la izquierda y tronco con raíces
xTree=function(v){const k="TR2"+v;if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");
  xdisc(g,16,44,13,3.5,"rgba(20,40,20,.3)");
  // tronco
  xr(g,12,31,8,12,"#2b1a10");xr(g,13,31,6,12,"#7a4a26");xr(g,13,31,2,12,"#9a6236");xr(g,17,31,1,12,"#5a3418");xr(g,10,41,12,3,"#2b1a10");xr(g,11,41,10,2,"#6a3e20");
  const sh=v%2?1:0,O="#14381a",B1="#25622a",B2="#367e34",B3="#4e9e40",B4="#86cc5e";
  const lobes=[[16,18,15,12],[8,22,8,7],[24,22,8,7],[16,8,11,8],[9-sh,13,7,6],[23+sh,13,7,6]];
  lobes.forEach(b=>xdisc(g,b[0],b[1],b[2]+1,b[3]+1,O));lobes.forEach(b=>xdisc(g,b[0],b[1],b[2],b[3],B1));
  // hojas en escamas (filas de arcos)
  for(let y=6;y<30;y+=4)for(let x=4+(y/4%2)*3;x<29;x+=6){const d=g.getImageData(x,y,1,1).data;if(d[3]<200||(d[0]===0x14&&d[1]===0x38))continue;xr(g,x,y,4,1,B2);xr(g,x-1,y-1,1,1,B2);xr(g,x+4,y-1,1,1,B2)}
  [[12,12,8,6],[18,7,5,4],[8,17,4,3]].forEach(b=>xdisc(g,b[0],b[1],b[2],b[3],B3));
  [[10,10],[13,9],[17,5],[7,15],[11,13]].forEach(([x,y])=>xr(g,x,y,2,1,B4));
  // sombra de la copa en la parte de abajo
  for(let x=4;x<29;x++){for(let y=28;y>14;y--){const d=g.getImageData(x,y,1,1).data;if(d[3]>200&&!(d[0]===0x14&&d[1]===0x38)){xr(g,x,y,1,1,"#1d5222");break}}}
  return XG[k]=c};
// caminos: tierra más cálida, borde marcado y piedrecitas
{const _p=xPath;xPath=function(m,v,bs){const k="P2"+m+"_"+v+(bs||"");if(XG[k])return XG[k];const src=_p.apply(this,arguments),c=xc(32,32),g=c.getContext("2d");g.drawImage(src,0,0);
  const im=g.getImageData(0,0,32,32),d=im.data,MAP={"236,214,162":[232,198,138],"200,168,112":[160,112,64],"212,184,128":[204,162,102],"248,236,204":[248,226,176]};
  for(let i=0;i<d.length;i+=4){const n=MAP[d[i]+","+d[i+1]+","+d[i+2]];if(n){d[i]=n[0];d[i+1]=n[1];d[i+2]=n[2]}}g.putImageData(im,0,0);
  // piedrecitas
  [[6,8],[20,5],[13,19],[25,24],[8,26]].forEach(([x,y],i)=>{if((v+i)%3)return;const q=g.getImageData(x,y,1,1).data;if(!(q[0]===232&&q[1]===198))return;xr(g,x,y,3,2,"#b89868");xr(g,x,y,2,1,"#e8d6b0");xr(g,x+1,y+2,2,1,"#9a7a4e")});
  return XG[k]=c}}
// fachadas de las casas: tejado de tejas en filas, chimenea, paredes de tablas, ventanas con cortinas y jardinera, puerta con marco y escalón
{const _b=xBld;xBld=function(b){if(b.k!=="house"&&b.k!=="house2")return _b.apply(this,arguments);const k="BD2"+b.k+b.w+b.h+b.door+(b.x%3);if(XG[k])return XG[k];
  const W=b.w*32,H=b.h*32+26,c=xc(W,H),g=c.getContext("2d"),ink="#2b2440",R=(x,y,w,h,col)=>xr(g,Math.round(x),Math.round(y),Math.round(w),Math.round(h),col),LITW=[];
  const roofC=b.k==="house"?["#c8402f","#e05a40","#a8301f","#f08a6a"]:["#2f62c0","#4a80dc","#22489a","#7aa8f0"],wallC=b.k==="house"?["#f4e6c4","#e2d0a8","#fff6dc"]:["#eef0e6","#d8dcd0","#ffffff"];
  const wy=Math.round(H*.5),base=H;
  xdisc(g,W/2,H-3,W/2-2,5,"rgba(0,0,0,.22)");
  // chimenea
  R(W-34,2,12,22,ink);R(W-32,4,8,20,"#9a8a80");R(W-32,4,8,3,"#b8aaa0");R(W-34,2,12,3,"#6a5a50");
  // tejado (con alero)
  R(0,10,W,wy-6,ink);for(let r=0;r<(wy-10)/6;r++){const y=12+r*6,h=Math.min(6,wy-4-y);if(h<=0)break;R(2,y,W-4,h,r%2?roofC[0]:roofC[1]);R(2,y+h-1,W-4,1,roofC[2]);for(let x=2+(r%2)*6;x<W-4;x+=12)R(x,y,1,h-1,roofC[2])}
  R(2,12,W-4,2,roofC[3]);R(0,wy-4,W,4,ink);R(2,wy-3,W-4,2,roofC[2]);
  // pared de tablas
  R(0,wy,W,base-wy-4,ink);R(2,wy,W-4,base-wy-6,wallC[0]);for(let y=wy+5;y<base-8;y+=5)R(2,y,W-4,1,wallC[1]);R(2,wy,W-4,2,"rgba(0,0,0,.18)");R(2,base-10,W-4,4,wallC[1]);
  // ventanas con cortinas y jardinera
  const win=(x,y)=>{R(x-2,y-2,22,18,ink);R(x,y,18,14,"#8fd0ff");R(x,y,18,4,"#d8f2ff");R(x+8,y,2,14,"#fff");R(x,y+6,18,2,"#fff");R(x,y,4,14,"#f6d8e0");R(x+14,y,4,14,"#f6d8e0");
    R(x-3,y+15,24,4,ink);R(x-2,y+16,22,2,"#9a6236");[[1,"#ff6b8a"],[6,"#ffd23f"],[11,"#ff6b8a"],[16,"#b58aff"]].forEach(([dx,col])=>{R(x+dx-1,y+13,3,3,col);R(x+dx,y+12,1,1,"#4aa04a")});LITW.push([x,y,18,14])};
  const dx=b.door*32,doorX=dx+6;
  [[8],[W-26]].forEach(([x])=>{if(b.door<0||Math.abs(x-doorX)>24)win(x,wy+10)});if(b.door<0)win(W/2-9,wy+10);
  // puerta
  if(b.door>=0){const y=base-36;R(doorX-3,y-3,26,35,ink);R(doorX-1,y-1,22,33,"#e8d8b8");R(doorX,y,20,31,"#8a5a34");R(doorX+2,y+2,7,12,"#a8703c");R(doorX+11,y+2,7,12,"#a8703c");R(doorX+2,y+16,16,12,"#7a4a26");R(doorX+15,y+17,2,3,"#ffd34a");
    R(doorX-5,base-6,30,4,"#b8b0a0");R(doorX-5,base-6,30,1,"#d8d0c0")}
  // buzón
  if(b.x%3===0){R(W-12,base-22,8,8,ink);R(W-11,base-21,6,5,"#e8414f");R(W-9,base-14,2,10,ink)}
  const n=xc(W,H),q=n.getContext("2d");q.drawImage(c,0,0);q.globalCompositeOperation="source-atop";q.fillStyle="rgba(20,24,60,.32)";q.fillRect(0,0,W,H);q.globalCompositeOperation="source-over";
  LITW.forEach(r=>{q.fillStyle="#ffcf5a";q.fillRect(r[0],r[1],r[2],r[3]);q.fillStyle="#fff1b0";q.fillRect(r[0],r[1],r[2],Math.max(2,r[3]/3))});c._n=n;
  return XG[k]=c}}
// escalera de bajada (pisos de arriba): hueco de 2 casillas con peldaños que bajan y se oscurecen, barandillas con balaustres y postes
function xStairWell(part,open){const k="SW"+part+open;if(XG[k])return XG[k];const F=xc(32,64),g=F.getContext("2d"),R=(a,b,w,h,col)=>xr(g,a,b,w,h,col);
  // suelo de madera debajo (para los bordes)
  g.drawImage(xFloor("wood",0,0),0,0);g.drawImage(xFloor("wood",0,1),0,32);
  // hueco
  R(4,0,24,46,xInk);
  for(let i=0;i<8;i++){const y=44-i*6,dk=Math.max(.12,1-i*.12),w=24-Math.min(4,i),x0=4+(24-w)/2;
    R(x0,y-4,w,4,`rgb(${Math.round(214*dk)},${Math.round(164*dk)},${Math.round(104*dk)})`);R(x0,y-4,w,1,`rgba(255,240,210,${.5*dk})`);R(x0,y,w,2,`rgb(${Math.round(120*dk)},${Math.round(80*dk)},${Math.round(44*dk)})`)}
  const gr=g.createLinearGradient(0,0,0,30);gr.addColorStop(0,"rgba(0,0,0,.85)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(4,0,24,30);
  // borde del primer peldaño (por donde se entra)
  R(4,44,24,3,"#e8c890");R(4,47,24,1,xInk);
  // barandillas a los dos lados, con balaustres y pasamanos; postes en la entrada
  [[0,"l"],[28,"r"]].forEach(([x])=>{R(x,0,4,58,xInk);R(x+1,0,2,58,"#9a6236");for(let y=4;y<54;y+=7){R(x+1,y,2,4,"#e8d8b8")}R(x,0,4,2,"#c8905a")});
  [[0],[27]].forEach(([x])=>{R(x-1,50,6,12,xInk);R(x,51,4,10,"#7a4a26");R(x,51,4,2,"#c8905a");R(x-1,48,6,3,"#5a3418")});
  // sombra suave en el suelo junto a la entrada
  R(4,48,24,2,"rgba(0,0,0,.18)");
  const c=xc(32,32);c.getContext("2d").drawImage(F,0,part?32:0,32,32,0,0,32,32);return XG[k]=c}
{const _g=xGround;xGround=function(x,y,fr){try{const c=exAt(x,y),M=EX.M,w=M&&M.w&&M.w[c];
  if(w&&w.look==="stairsdown")return xStairWell(0,xStOpen(x));
  if(c==="q")return xStairWell(1,xStOpen(x))}catch(e){}return _g.apply(this,arguments)}}

// en los interiores, lo que queda fuera de la casa es negro (no árboles)
{const _g=xGround;xGround=function(x,y,fr){if(EX.M&&EX.M.base==="F"&&!(EX.grid[y]&&EX.grid[y][x]!=null)){const k="VOID";return XG[k]||(XG[k]=(()=>{const c=xc(32,32);xr(c.getContext("2d"),0,0,32,32,"#0c0a14");return c})())}return _g.apply(this,arguments)}}
{const _o=xObj;xObj=function(c,x,y){if(EX.M&&EX.M.base==="F"&&!(EX.grid[y]&&EX.grid[y][x]!=null))return null;return _o.apply(this,arguments)}}

// =====================================================================================
// DECORACIÓN: cuadros (x, en la pared), chimenea (f), lámpara de pie (P), mesita con lámpara (i), alfombrita ovalada (y)
// y alfombras de un color distinto en cada casa
// =====================================================================================
const XDECO_BLK="Pix";
{const _b=exBlocked;exBlocked=function(x,y){const c=exAt(x,y);if(XDECO_BLK.includes(c))return true;return _b.apply(this,arguments)}}
function xPainting(x,y){const fl=(EX.M&&EX.M.fl)||"wood",v=(x*7+String(EX.map||"").length)%5,k="PT"+fl+v+(x%2);if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");g.drawImage(xWall(fl,x,1),0,0);
  const R=(a,b,w,h,col)=>xr(g,a,b,w,h,col);R(5,3,22,19,xInk);R(6,4,20,17,"#c8905a");R(8,6,16,13,"#fff");
  if(v===0){R(8,6,16,7,"#8fd0ff");R(8,13,16,6,"#5ab04a");xdisc(g,19,9,2,2,"#fff4b0");R(10,11,4,3,"#3a7a36");R(15,10,5,4,"#3a7a36")}            // paisaje
  else if(v===1){R(8,6,16,13,"#3a4a7a");xdisc(g,16,12,5,5,xInk);xdisc(g,16,12,4,4,"#fff");g.save();g.beginPath();g.arc(16,12,4,0,7);g.clip();R(11,7,10,5,"#e8414f");g.restore();R(12,12,8,1,xInk)} // Poké Ball
  else if(v===2){R(8,6,16,13,"#f6e2c8");xdisc(g,16,11,3,3,"#c8905a");R(12,14,8,5,"#e8414f");R(14,10,1,1,xInk);R(17,10,1,1,xInk)}               // retrato
  else if(v===3){R(8,6,16,13,"#ffe7a0");[[11,10,"#e8414f"],[16,9,"#3a8cff"],[20,12,"#5ad1a0"]].forEach(([a,b,col])=>{xdisc(g,a,b,2,2,col);R(a,b+2,1,4,"#3a7a36")})}  // flores
  else{R(8,6,16,13,"#1d2a5a");xdisc(g,20,9,2,2,"#fff4b0");[[10,8],[13,12],[18,15],[22,13],[11,16]].forEach(([a,b])=>R(a,b,1,1,"#fff"))}  // noche
  R(6,4,20,1,"#e0b07a");return XG[k]=c}
function xDeco(ch,x,y){const now=performance.now(),fr=ch==="f"?Math.floor(now/140)%3:0,L=exAt(x-1,y)===ch,Rt=exAt(x+1,y)===ch,k="DC"+ch+fr+(L?1:0)+(Rt?1:0);if(XG[k])return XG[k];
  const c=xc(32,48),g=c.getContext("2d"),R=(a,b,w,h,col)=>xr(g,a,b,w,h,col),sh=()=>xdisc(g,16,45,12,3,"rgba(0,0,0,.2)");
  if(ch==="P"){sh();R(13,42,6,3,xInk);R(15,14,2,29,xInk);R(15,14,1,29,"#9aa6b8");R(8,4,16,12,xInk);R(9,5,14,10,"#ffe9a8");R(9,5,14,3,"#fff6d0");R(9,13,14,2,"#e8c060");
    g.fillStyle="rgba(255,226,140,.18)";g.beginPath();g.arc(16,16,15,0,7);g.fill()}
  else if(ch==="i"){sh();R(5,24,22,20,xInk);R(6,25,20,18,"#b47c46");R(6,25,20,3,"#d29a60");R(8,33,16,6,"#9a6634");R(15,35,2,2,"#ffd34a");R(14,14,4,11,xInk);R(15,14,2,10,"#c8ccd2");R(9,6,14,9,xInk);R(10,7,12,7,"#ffcf8a");R(10,7,12,2,"#fff0c8")}
  else if(ch==="f"){// chimenea de piedra de 2 casillas (izquierda / derecha)
    const W0=L?0:2,W1=Rt?32:30;R(W0,4,W1-W0,42,xInk);
    for(let yy=6;yy<44;yy+=6)for(let xx=W0+1+((yy/6)%2)*5;xx<W1-1;xx+=10){R(xx,yy,9,5,(xx+yy)%3?"#a8a0a0":"#8a8484");R(xx,yy,9,1,"#c8c2c2")}
    R(W0,4,W1-W0,5,"#7a4a26");R(W0,4,W1-W0,2,"#a8703c");// repisa
    const ox=L?0:12,ow=(L?20:20);R(L?0:12,22,L?20:20,22,"#1a1210");
    if(!L){R(12,22,20,2,xInk)}else{R(0,22,20,2,xInk)}
    // fuego animado
    const fx=L?2:14,cols=["#ff7a2a","#ffb03c","#ffe27a"];for(let i=0;i<3;i++){const h=8+((fr+i)%3)*3;R(fx+i*5,44-h-2,4,h,cols[0]);R(fx+i*5+1,44-h,2,h-3,cols[1]);R(fx+i*5+1,44-4,2,2,cols[2])}
    R(fx,42,16,2,"#5a3418");g.fillStyle="rgba(255,150,60,.15)";g.fillRect(L?0:10,18,22,28)}
  return XG[k]=c}
{const _g=xGround;xGround=function(x,y,fr){try{const c=exAt(x,y),M=EX.M;
  if(c==="x")return xPainting(x,y);
  if(c==="P"||c==="i"||c==="f"&&M&&M.base==="F")return xFloor(M.fl||"wood",x,y);
  if(c==="y"){const v=xMapV(),k="OV"+v+(x+y)%2;if(XG[k])return XG[k];const cv=xc(32,32),g=cv.getContext("2d");g.drawImage(xFloor(M.fl||"wood",x,y),0,0);const col=["#5a8ad8","#d85a8a","#5ab07a","#d8a03a"][v];
    xdisc(g,16,16,15,11,xInk);xdisc(g,16,16,14,10,col);xdisc(g,16,16,10,7,"rgba(255,255,255,.25)");xdisc(g,16,16,6,4,col);return XG[k]=cv}}catch(e){}return _g.apply(this,arguments)}}
{const _o=xObj;xObj=function(c,x,y){if((c==="P"||c==="i"||(c==="f"&&EX.M&&EX.M.base==="F")))return xDeco(c,x,y);return _o.apply(this,arguments)}}
// alfombras: un color distinto en cada casa
{const _r=xRug;xRug=function(x,y,mat){const src=_r.apply(this,arguments);if(mat||!EX.map||!/_h|casa/.test(EX.map))return src;const v=xMapV();if(v===0)return src;
  const k="RGC"+v+xMask(x,y,q=>q==="R");if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");g.drawImage(src,0,0);const im=g.getImageData(0,0,32,32),d=im.data,T=[null,[60,110,200],[70,150,90],[150,80,190]][v];
  for(let i=0;i<d.length;i+=4){const r=d[i],gg=d[i+1],b=d[i+2];if(r>gg+60&&r>b+40&&!(r>230&&gg>180)){const l=r/200;d[i]=Math.min(255,T[0]*l);d[i+1]=Math.min(255,T[1]*l);d[i+2]=Math.min(255,T[2]*l)}}g.putImageData(im,0,0);return XG[k]=c}}
Object.assign(XFURN_TXT,{P:["Una lámpara de pie. Da una luz muy acogedora."],i:["Una mesita de noche con una lamparita."],f:["La chimenea crepita. ¡Qué calentito se está aquí!"],x:["Un cuadro muy bonito. Lo pintó alguien de la familia."]});
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&(EX.map==="casa"||EX.map==="casa_up")){const[dx,dy]=EXDIR[EX.f],c=exAt(EX.x+dx,EX.y+dy);if(XFURN_TXT[c]&&"Pifx".includes(c)){snd("ui");exSay(XFURN_TXT[c]);return}}}catch(e){}return _i.apply(this,arguments)}}

// =====================================================================================
// CENTROS POKÉMON Y TIENDAS: estanterías de tienda con productos y cosas que mirar
// =====================================================================================
function xShopShelf(x){const k="SS"+(x%3);if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d"),R=(a,b,w,h,col)=>xr(g,a,b,w,h,col);xdisc(g,16,45,13,3,"rgba(0,0,0,.2)");
  R(1,4,30,41,xInk);R(2,5,28,39,"#d8dde6");R(2,5,28,3,"#f2f4f8");
  [8,20,32].forEach((yy,r)=>{R(3,yy+9,26,2,"#9aa6b8");let xx=4;for(let i=0;i<5;i++){const t=(i+r+x)%4;
    if(t===0){R(xx,yy+2,4,7,xInk);R(xx+1,yy+3,2,5,"#e8414f");R(xx+1,yy+2,2,1,"#fff")}                       // Poké Ball en caja
    else if(t===1){R(xx,yy+1,4,8,xInk);R(xx+1,yy+2,2,6,"#8a5ad8");R(xx+1,yy+2,2,2,"#d8c8ff")}               // poción
    else if(t===2){R(xx,yy+3,5,6,xInk);R(xx+1,yy+4,3,4,"#ffd23f")}                                          // caja amarilla
    else{R(xx,yy+2,4,7,xInk);R(xx+1,yy+3,2,5,"#3a8cff");R(xx+1,yy+3,2,1,"#fff")}                            // refresco
    xx+=5}});
  return XG[k]=c}
{const _o=xObj;xObj=function(c,x,y){if(c==="Z"&&/^tienda_/.test(EX.map||""))return xShopShelf(x);return _o.apply(this,arguments)}}
const XCEN_TXT={O:["El PC del Centro Pokémon. Aquí los entrenadores guardan sus cosas… y consultan su correo."],Q:["Un banco para esperar mientras curan a tus Pokémon."],D:["Una mesa con revistas: «Entrenador del mes», «Bayas de temporada»…"],M:["Una silla."],V:["La máquina curativa. Sus luces parpadean suavemente."],J:["Una planta muy bien cuidada."],x:["Un cartel: «¡Cuida de tus Pokémon! Los Centros Pokémon curan gratis a todos los entrenadores»."]};
const XTIE_TXT={L:["Una nevera llena de refrescos y zumos de bayas."],J:["Una planta decorativa."],x:["Un cartel de ofertas: «¡Esta semana, las Poké Balls brillan más que nunca!»."]};
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&!EX.cut){const m=EX.map||"",[dx,dy]=EXDIR[EX.f],c=exAt(EX.x+dx,EX.y+dy),T=/^centro/.test(m)?XCEN_TXT:/^tienda_/.test(m)?XTIE_TXT:null;
  if(T&&T[c]&&!EX.npcs.some(n=>n.px===EX.x+dx&&n.py===EX.y+dy)){snd("ui");exSay(T[c]);return}}}catch(e){}return _i.apply(this,arguments)}}
