// =====================================================================================
// NUEVOS GRÁFICOS DE EXPLORACIÓN · FASE 2: EXTERIORES (estilo de la muestra, píxeles de 2×2)
// Hierba con matas, pinos en capas, calles de baldosa con bordillo en los pueblos, caminos de tierra en las rutas
// y flores. Todo dibujado de cero a 16×16 y ampliado al doble.
// =====================================================================================
const X2=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x*2,y*2,w*2,h*2)};
const X2R=(v,i,s)=>{let h=(v*374761393+i*668265263+(s||0)*1442695041)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296};
const X2town=()=>!!(EX.M&&EX.M.music==="town");
// ---------- hierba ----------
xGrassBase=function(g,v,pal){pal=pal||GRP;X2(g,0,0,16,16,pal.b);
  for(let i=0;i<9;i++){const a=Math.floor(X2R(v,i,1)*16),b=Math.floor(X2R(v,i,2)*16);X2(g,a,b,1,1,i%3?pal.d:pal.l)}
  const tufts=v%2?[[3,4],[10,11]]:[[9,3],[3,11]];tufts.forEach(([a,b],i)=>{if((v+i)%4===3)return;X2(g,a,b+1,1,2,pal.d);X2(g,a+2,b+1,1,2,pal.d);X2(g,a+1,b,1,3,pal.k||pal.d);X2(g,a+1,b,1,1,pal.l)})};
// la caché de hierba (y lo que se dibuja encima) se rehace con el nuevo estilo
Object.keys(XG).forEach(k=>delete XG[k]);
// ---------- pino (1 casilla de ancho, 1,5 de alto) ----------
xTree=function(v){const k="N2TR"+v;if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");
  xdisc(g,16,44,12,3,"rgba(10,40,20,.28)");
  const ol="#103a24",b="#2e8848",l="#46a85a",d="#226c38",hl="#7ad070";
  // tronco
  X2(g,6,18,4,5,ol);X2(g,7,18,2,5,"#7a4824");X2(g,7,18,1,5,"#9a6034");X2(g,6,23,4,1,ol);
  // tres pisos de ramas
  const tiers=[[1,7,4],[5,12,6],[10,18,7]];
  tiers.forEach(([y0,y1,hw],ti)=>{for(let y=y0;y<=y1;y++){const t=(y-y0)/Math.max(1,y1-y0),half=Math.max(1,Math.round(1+t*(hw-1)));const cx=8;
      X2(g,cx-half-1,y,1,1,ol);X2(g,cx+half,y,1,1,ol);X2(g,cx-half,y,half*2,1,b);X2(g,cx-half,y,Math.max(1,Math.round(half*.6)),1,l);X2(g,cx+Math.round(half*.3),y,Math.round(half*.7),1,d)}
    const hb=Math.max(1,hw);X2(g,8-hb-1,y1+1,hb*2+2,1,ol);for(let x=8-hb+1;x<8+hb-1;x+=3)X2(g,x,y1,1,1,"#1a5a2e");
    X2(g,7,y0-1,2,1,ol);if(ti===0)X2(g,7,y0,1,1,hl);
    for(let q=0;q<2;q++)X2(g,4+Math.floor(X2R(v,ti*5+q,3)*7),y0+2+Math.floor(X2R(v,ti*5+q,4)*Math.max(1,y1-y0-3)),1,1,hl)});
  return XG[k]=c};
// ---------- caminos ----------
// en los pueblos: calle de baldosas claras con bordillo donde termina; en las rutas: tierra con borde de hierba
xPath=function(m,v,bs){const town=X2town(),k="N2P"+(town?"t":"r")+m+"_"+v+(bs||"");if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  const N=m&1,E=m&2,S=m&4,W=m&8;
  if(town){
    X2(g,0,0,16,16,"#d6d6de");// baldosas
    for(let y=0;y<16;y+=8){X2(g,0,y+7,16,1,"#bcbcc8");const off=(y/8+v)%2?4:0;for(let x=off;x<16;x+=8)X2(g,x,y,1,7,"#bcbcc8");X2(g,0,y,16,1,"#e8e8f0")}
    for(let i=0;i<3;i++)X2(g,Math.floor(X2R(v,i,5)*16),Math.floor(X2R(v,i,6)*16),1,1,"#c8c8d2");
    // bordillo en los lados que dan a la hierba
    const curb=(x,y,w,h,horiz,outer)=>{X2(g,x,y,w,h,"#ececf2");if(horiz){X2(g,x,outer?y:y+h-1,w,1,"#a0a0ae");X2(g,x,outer?y+h-1:y,w,1,"#ffffff");for(let i=x+((v)%2?2:6);i<x+w;i+=8)X2(g,i,y,1,h,"#c0c0cc")}
      else{X2(g,outer?x:x+w-1,y,1,h,"#a0a0ae");X2(g,outer?x+w-1:x,y,1,h,"#ffffff");for(let i=y+((v)%2?2:6);i<y+h;i+=8)X2(g,x,i,w,1,"#c0c0cc")}};
    if(!N)curb(0,0,16,3,true,true);if(!S)curb(0,13,16,3,true,false);if(!W)curb(0,0,3,16,false,true);if(!E)curb(13,0,3,16,false,false);
    // esquinas interiores (cuando la calle sigue por los dos lados pero no en diagonal)
    if(N&&W&&!(m&128))X2(g,0,0,3,3,"#ececf2");if(N&&E&&!(m&16))X2(g,13,0,3,3,"#ececf2");if(S&&W&&!(m&64))X2(g,0,13,3,3,"#ececf2");if(S&&E&&!(m&32))X2(g,13,13,3,3,"#ececf2");
  }else{
    if(bs==="s")g.drawImage(xSand(0,v),0,0);else xGrassBase(g,v);
    const D="#d8b078",Dd="#b88a52",Dl="#ecd0a0",E2="#8c6a3c";
    X2(g,3,3,10,10,D);if(N)X2(g,3,0,10,3,D);if(S)X2(g,3,13,10,3,D);if(W)X2(g,0,3,3,10,D);if(E)X2(g,13,3,3,10,D);
    if(N&&W&&(m&128))X2(g,0,0,3,3,D);if(N&&E&&(m&16))X2(g,13,0,3,3,D);if(S&&W&&(m&64))X2(g,0,13,3,3,D);if(S&&E&&(m&32))X2(g,13,13,3,3,D);
    // borde irregular de hierba sobre la tierra
    if(!N)for(let x=3;x<13;x++)X2(g,x,2+((x+v)%3===0?1:0),1,1,E2);if(!S)for(let x=3;x<13;x++)X2(g,x,13-((x+v)%3===1?1:0),1,1,Dd);
    if(!W)for(let y=3;y<13;y++)X2(g,2+((y+v)%3===0?1:0),y,1,1,E2);if(!E)for(let y=3;y<13;y++)X2(g,13-((y+v)%3===2?1:0),y,1,1,Dd);
    for(let i=0;i<5;i++){const a=3+Math.floor(X2R(v,i,7)*10),b=3+Math.floor(X2R(v,i,8)*10);X2(g,a,b,1,1,i%2?Dd:Dl)}
    if(v%3===0){X2(g,8,8,2,1,"#a89070");X2(g,8,7,2,1,"#d8c8a8")}}
  return XG[k]=c};
// ---------- flores ----------
xFlowers=function(v,fr){const k="N2F"+v+fr;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");xGrassBase(g,v);
  const cols=["#f070b0","#c080f0","#ffffff","#ffd040"];
  for(let i=0;i<4;i++){const a=2+Math.floor(X2R(v,i,9)*11),b=2+Math.floor(X2R(v,i,10)*10)+(fr&&i%2?0:0),col=cols[(v+i)%4];
    X2(g,a,b+2,1,2,"#3e8828");X2(g,a-1,b,3,1,col);X2(g,a,b-1,1,3,col);X2(g,a,b,1,1,col==="#ffd040"?"#ff8020":"#ffe060")}
  return XG[k]=c};
// =====================================================================================
// FASE 3: EDIFICIOS POR FUERA (Centro Pokémon, tienda, casas, gimnasio y laboratorio)
// Mismo tamaño y puerta en la misma casilla que antes; tejados con volumen, ventanas con reflejo y versión nocturna.
// =====================================================================================
const _xBld0=xBld;
xBld=function(b){const k="N3BD"+b.k+b.w+b.h+b.door+(b.x%3);if(XG[k])return XG[k];
  const W=b.w*32,H=b.h*32+26,Wn=b.w*16,Hn=Math.ceil(H/2),c=xc(W,H),g=c.getContext("2d"),R=(x,y,w,h,col)=>X2(g,x,y,w,h,col),LIT=[];
  const ol="#24202e",dx=b.door*16;xdisc(g,W/2,H-3,W/2-2,5,"rgba(0,0,0,.22)");
  // tejado de tejas o pizarra con filas, brillo arriba y sombra en el alero
  const roof=(y0,y1,col,slate,inset)=>{const dk=chDk(col,.25),lt=chLt(col,.22);R(inset,y0,Wn-inset*2,y1-y0,ol);R(inset+1,y0+1,Wn-inset*2-2,y1-y0-2,col);
    for(let y=y0+3;y<y1-1;y+=3){R(inset+1,y,Wn-inset*2-2,1,dk);R(inset+1,y+1,Wn-inset*2-2,1,lt);if(slate)for(let x=inset+2+((y/3|0)%2)*3;x<Wn-inset-1;x+=6)R(x,y-2,1,2,dk)}
    R(inset+1,y0+1,Wn-inset*2-2,1,chLt(col,.4));R(0,y1-1,Wn,2,chDk(col,.5))};
  const wall=(y0,col,trim)=>{R(0,y0,Wn,Hn-y0,ol);R(1,y0,Wn-2,Hn-y0-1,col);R(1,Hn-5,Wn-2,4,chDk(col,.1));if(trim)R(1,y0,Wn-2,1,chDk(col,.25))};
  const win=(x,y,w,h)=>{R(x,y,w,h,"#2c3444");R(x+1,y+1,w-2,h-2,"#4e9ce8");R(x+1,y+1,w-2,Math.max(1,Math.floor((h-2)/2)),"#78bcf6");R(x+2,y+2,2,1,"#d8f0ff");R(x+Math.floor(w/2),y+1,1,h-2,"#2c3444");LIT.push([x+1,y+1,w-2,h-2])};
  const glassDoor=(x,y,w,h)=>{R(x,y,w,h,"#2c3444");R(x+1,y+1,w-2,h-1,"#88c8f8");R(x+1,y+1,w-2,3,"#b8e2ff");R(x+Math.floor(w/2),y+1,1,h-1,"#2c3444");R(x+2,y+5,1,4,"#e0f4ff");R(x+Math.floor(w/2)+2,y+5,1,4,"#e0f4ff");LIT.push([x+1,y+1,w-2,h-1])};
  const woodDoor=(x,y,w,h)=>{R(x,y,w,h,"#2c2018");R(x+1,y+1,w-2,h-1,"#9a5a2c");R(x+1,y+1,w-2,1,"#c07a40");R(x+w-3,y+Math.floor(h/2),1,1,"#ffe060");R(x-1,Hn-1,w+2,1,"#b8b0a0")};
  if(b.k==="center"){const wy=Math.round(Hn*.44);roof(3,wy,"#d8343c",false,1);R(4,1,Wn-8,3,ol);R(5,2,Wn-10,2,"#b82830");
    const cx=Wn/2,cy=Math.round(wy*.52);for(let dy=-7;dy<=7;dy++)for(let dx2=-7;dx2<=7;dx2++){const d=dx2*dx2+dy*dy;if(d>56)continue;g.fillStyle=d>42?ol:dy<-1?"#ff5a62":dy>1?"#ffffff":ol;g.fillRect((cx+dx2)*2,(cy+dy)*2,2,2)}
    for(let dy=-2;dy<=2;dy++)for(let dx2=-2;dx2<=2;dx2++){const d=dx2*dx2+dy*dy;if(d>5)continue;g.fillStyle=d>2?ol:"#fff";g.fillRect((cx+dx2)*2,(cy+dy)*2,2,2)}
    wall(wy,"#f4f0e6",true);[0,Wn-4].forEach(x=>{R(x,wy,4,Hn-wy,ol);R(x+1,wy,2,Hn-wy-1,"#4a5468")});R(dx-1,wy,2,Hn-wy,"#4a5468");R(dx+15,wy,2,Hn-wy,"#4a5468");
    for(let x=6;x<Wn-10;x+=13){if(x+10>dx-2&&x<dx+18)continue;win(x,wy+4,10,Math.min(10,Hn-wy-12))}
    R(dx+2,wy+1,12,3,ol);R(dx+3,wy+2,10,1,"#ff5a62");glassDoor(dx+2,wy+5,12,Hn-wy-6);
    R(1,Hn-6,dx-2,3,"#cc3038");R(dx+17,Hn-6,Wn-dx-18,3,"#cc3038");R(1,Hn-6,dx-2,1,"#ee5860");R(dx+17,Hn-6,Wn-dx-18,1,"#ee5860")}
  else if(b.k==="mart"){const wy=Math.round(Hn*.42);roof(2,wy,"#3a74d8",false,1);R(3,0,Wn-6,3,ol);R(4,1,Wn-8,2,"#2c5cb8");
    wall(wy,"#f4f0e6",true);R(Math.round(Wn/2)-9,wy-8,18,7,ol);R(Math.round(Wn/2)-8,wy-7,16,5,"#2c5cb8");R(Math.round(Wn/2)-8,wy-7,16,1,"#6aa0ff");
    g.fillStyle="#fff";g.font="bold 9px monospace";g.textAlign="center";g.fillText("TIENDA",Wn,(wy-3)*2);g.textAlign="left";
    for(let x=4;x<Wn-8;x+=12){if(x+9>dx-2&&x<dx+18)continue;win(x,wy+4,9,Math.min(9,Hn-wy-12))}
    glassDoor(dx+2,wy+4,12,Hn-wy-5);R(1,Hn-6,dx-0,3,"#3a74d8");R(dx+16,Hn-6,Wn-dx-17,3,"#3a74d8")}
  else if(b.k==="house"||b.k==="house2"){const slate=b.k==="house2",col=slate?["#4a5a7c","#5a6a3c","#6a4a6c"][b.x%3]:["#c8443c","#b86a2c","#a8423c"][b.x%3],wy=Math.round(Hn*.5);
    if(!slate){R(Wn-10,2,4,8,ol);R(Wn-9,3,2,7,"#a49a90");R(Wn-9,3,2,1,"#c8c0b8")}
    roof(4,wy,col,slate,0);
    if(slate){const mx=Math.round(Wn/2)-4;R(mx,6,9,9,ol);for(let i=0;i<5;i++)R(mx+4-i,6+i,i*2+1,1,chLt(col,.15));R(mx+1,11,7,4,"#eae4d6");R(mx+2,12,5,3,"#4e9ce8");R(mx+2,12,2,1,"#d8f0ff");LIT.push([mx+2,12,5,3])}
    wall(wy,slate?"#ece6d8":"#f4e8d0",true);for(let y=wy+3;y<Hn-2;y+=3)R(1,y,Wn-2,1,slate?"#dcd4c4":"#e6d6b8");
    for(let x=3;x<Wn-8;x+=Math.max(10,Math.floor((Wn-6)/3))){if(x+8>dx-1&&x<dx+17)continue;win(x,wy+3,8,7);R(x-1,wy+10,10,1,"#a06838");[1,3,6].forEach((q,i)=>R(x+q,wy+9,1,1,["#f070b0","#ffe060","#c080f0"][i]))}
    if(b.door>=0)woodDoor(dx+4,wy+4,8,Hn-wy-4)}
  else if(b.k==="gym"){const wy=Math.round(Hn*.38);roof(2,wy,"#6a7488",false,0);R(0,0,Wn,3,ol);R(1,1,Wn-2,1,"#8a94a8");
    wall(wy,"#d8d4e2",true);for(let x=1;x<Wn-1;x+=8)R(x,wy+1,2,Hn-wy-2,"#b8b4c8");
    R(4,wy-7,Wn-8,6,ol);R(5,wy-6,Wn-10,4,"#e8c040");g.fillStyle="#2c2018";g.font="bold 9px monospace";g.textAlign="center";g.fillText("GIMNASIO",Wn,(wy-2.5)*2);g.textAlign="left";
    for(let x=3;x<Wn-8;x+=12){if(x+9>dx-2&&x<dx+18)continue;win(x,wy+4,8,6)}
    R(dx+1,wy+3,14,Hn-wy-3,ol);R(dx+2,wy+4,12,Hn-wy-4,"#8a2c34");R(dx+8,wy+4,1,Hn-wy-4,ol);R(dx+2,wy+4,12,1,"#b84650");R(dx+6,wy+10,1,1,"#ffe060");R(dx+10,wy+10,1,1,"#ffe060");
    [dx-2,dx+16].forEach(x=>{R(x,wy,2,Hn-wy,ol);R(x,wy,1,Hn-wy-1,"#f4f2fa")})}
  else if(b.k==="lab"){const wy=Math.round(Hn*.4);roof(3,wy,"#8a96ac",false,0);R(6,0,2,4,ol);R(4,0,6,1,ol);R(5,-1,4,1,"#dfe4ee");
    R(Wn-16,1,10,3,ol);R(Wn-15,2,8,1,"#c9d4e4");
    wall(wy,"#fbfcff",true);R(1,Hn-6,Wn-2,2,"#3a8cff");
    R(Math.round(Wn/2)-16,wy+1,32,5,ol);R(Math.round(Wn/2)-15,wy+2,30,3,"#3a8cff");g.fillStyle="#fff";g.font="bold 7px monospace";g.textAlign="center";g.fillText("LABORATORIO",Wn,(wy+4.5)*2);g.textAlign="left";
    for(let x=4;x<Wn-10;x+=14){if(x+11>dx-2&&x<dx+18)continue;win(x,wy+8,11,Math.min(8,Hn-wy-14))}
    glassDoor(dx+2,wy+7,12,Hn-wy-8)}
  else return _xBld0(b);
  // versión nocturna con las ventanas encendidas
  const n=xc(W,H),q=n.getContext("2d");q.drawImage(c,0,0);q.globalCompositeOperation="source-atop";q.fillStyle="rgba(20,24,60,.32)";q.fillRect(0,0,W,H);q.globalCompositeOperation="source-over";
  LIT.forEach(r=>{q.fillStyle="#ffcf5a";q.fillRect(r[0]*2,r[1]*2,r[2]*2,r[3]*2);q.fillStyle="#fff1b0";q.fillRect(r[0]*2,r[1]*2,r[2]*2,Math.max(2,r[3]))});c._n=n;
  return XG[k]=c};
