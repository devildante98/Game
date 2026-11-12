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
// =====================================================================================
// FASE 4: INTERIORES (casas, Centros Pokémon, tiendas, gimnasios, laboratorio, Liga y torre)
// Suelos, paredes, alfombras y muebles redibujados de cero a 16×16 y ampliados al doble, con contorno oscuro.
// Cada tipo de edificio tiene su propia paleta; los gimnasios usan el color de su tipo.
// =====================================================================================
const N4OL="#28202c";
const N4T={grass:"#58b048",water:"#4a88e0",ice:"#70c4e0",fire:"#e86a30",electric:"#e8c030",rock:"#b09858",ground:"#c8a060",psychic:"#e868a8",fighting:"#c04838",poison:"#9858b8",dragon:"#6858d8",dark:"#5a4a48",ghost:"#6a58a0",steel:"#9aa8b8",fairy:"#f090c0",flying:"#88a0e8",bug:"#98b830",normal:"#a8a090"};
const n4Th=()=>{const m=String(EX.map||"");if(/^centro/.test(m))return"cen";if(/^tienda/.test(m))return"mart";if(/^gym_/.test(m))return"gym";if(m==="lab")return"lab";if(m==="liga")return"liga";if(m==="torre")return"tow";return"house"};
const n4Gym=()=>{try{const q=XGYM.find(o=>o.m===EX.map);return N4T[q&&q.ty]||"#8a94a8"}catch(e){return"#8a94a8"}};
const n4Key=()=>{const t=n4Th();return t+(t==="house"?xMapV():t==="gym"?n4Gym():"")};
const N4P={
  house:[{wp:"#f2e2bc",st:"#e6d2a4",wn:"#a86c38",top:"#6a4428"},{wp:"#dcecd4",st:"#cadfc0",wn:"#7a5a3a",top:"#4a5a3a"},{wp:"#dce6f4",st:"#c8d6ea",wn:"#6a5a8a",top:"#3a4a6a"},{wp:"#f4dee0",st:"#e8cace",wn:"#9a5a4a",top:"#6a3a40"}],
  cen:{wp:"#fbeef0",st:"#f4d8de",wn:"#e05060",top:"#b8404c",fa:"#f8f4f4",fb:"#f0d8dc"},
  mart:{wp:"#eef4fb",st:"#dbe6f4",wn:"#4a78c8",top:"#34589c",fa:"#f6f8fb",fb:"#dce6f2"},
  gym:{wp:"#e0dee6",st:"#cfccd8",wn:"#7a7888",top:"#4a4858"},
  lab:{wp:"#f6f8fc",st:"#e2e8f0",wn:"#8a9ab0",top:"#5a6a84",fa:"#f4f6fa",fb:"#e2e8f0"},
  liga:{wp:"#5a4a7c",st:"#4e4070",wn:"#d8b040",top:"#2a2040",fa:"#5c5680",fb:"#4a446e"},
  tow:{wp:"#e4e8ee",st:"#d4dae4",wn:"#8a94a8",top:"#4a5468",fa:"#e8ecf2",fb:"#d4dae4"}};
const n4Pal=()=>{const t=n4Th();if(t==="house")return N4P.house[xMapV()];if(t==="gym"){const a=n4Gym();return Object.assign({},N4P.gym,{wn:chDk(a,.3),acc:a,fa:chMix(a,"#ecece8",.84),fb:chMix(a,"#d4d4d0",.7)})}return N4P[t]};
// caja con contorno, brillo arriba y sombra abajo
const n4Box=(g,x,y,w,h,c,o)=>{X2(g,x,y,w,h,o||N4OL);X2(g,x+1,y+1,w-2,h-2,c);X2(g,x+1,y+1,w-2,1,chLt(c,.35));X2(g,x+1,y+h-2,w-2,1,chDk(c,.2))};
const n4Sh=(g,w)=>xdisc(g,16,45,w||13,3,"rgba(0,0,0,.2)");
// ---------- suelos ----------
xFloor=function(fl,x,y){
  if(fl==="wood"){const k="N4FW"+(x%6)+(y%6);if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
    X2(g,0,0,16,16,"#d49a5a");
    for(let r=0;r<4;r++){const yy=r*4,row=y*4+r,o=((row*7+x*5)%4)*4+1;X2(g,0,yy,16,1,"#dea86a");X2(g,0,yy+3,16,1,"#a86e38");
      if((x+row*2)%3===0){X2(g,o,yy,1,3,"#a86e38");X2(g,o+1,yy,1,3,"#dea86a")}
      X2(g,(o+6+(row%3)*2)%14,yy+1+(row%2),3,1,"#c88e50")}
    return XG[k]=c}
  const P=n4Pal(),th=n4Th(),k="N4F"+n4Key()+((x+y)%2)+(x%3)+(y%3);if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  const fa=P.fa||"#f2f4f8",fb=P.fb||"#dce2ea";
  for(let j=0;j<2;j++)for(let i=0;i<2;i++){const b=(i+j)%2?fb:fa,X=i*8,Y=j*8;
    X2(g,X,Y,8,8,b);X2(g,X,Y,8,1,chLt(b,.5));X2(g,X,Y,1,8,chLt(b,.35));X2(g,X,Y+7,8,1,chDk(b,.12));X2(g,X+7,Y,1,8,chDk(b,.1));
    if(th==="gym"||th==="liga")X2(g,X+2+((x*2+i)%3),Y+2+((y*3+j)%4),1,1,chDk(b,.1));
    else X2(g,X+2,Y+2,2,1,chLt(b,.6))}
  return XG[k]=c};
// ---------- paredes (fila 0: remate oscuro; fila 1: papel pintado, zócalo y ventanas) ----------
xWall=function(fl,x,y){const P=n4Pal(),th=n4Th(),win=y===1&&x%5===2,k="N4W"+n4Key()+(y===0?0:1)+(win?"w":"")+(x%2);if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  if(y===0){X2(g,0,0,16,16,P.top);X2(g,0,0,16,1,chLt(P.top,.18));for(let i=(x%2)*4;i<16;i+=8)X2(g,i,2,1,9,chDk(P.top,.2));X2(g,0,11,16,1,chLt(P.top,.3));X2(g,0,12,16,4,N4OL);return XG[k]=c}
  X2(g,0,0,16,16,P.wp);
  if(th==="gym"){for(let r=0;r<3;r++){X2(g,0,r*4+3,16,1,P.st);for(let i=((r+x)%2)*4;i<16;i+=8)X2(g,i,r*4,1,3,P.st)}X2(g,0,0,16,1,P.acc)}
  else if(th==="lab"||th==="tow"){X2(g,0,5,16,1,P.st);X2(g,(x%2)*8,0,1,11,P.st);X2(g,(x%2)*8+3,2,2,1,"#ffffff")}
  else if(th==="liga"){for(let i=(x%2)*4;i<16;i+=8)X2(g,i,0,2,11,P.st);X2(g,0,1,16,1,P.wn);X2(g,0,2,16,1,chDk(P.wn,.3))}
  else{for(let i=(x%2)*4;i<16;i+=8)X2(g,i,0,2,11,P.st);if(th==="house")for(let i=(x%2)*4+5;i<16;i+=8){X2(g,i,3,1,1,chDk(P.st,.12));X2(g,i,8,1,1,chDk(P.st,.12))}}
  X2(g,0,11,16,5,P.wn);X2(g,0,11,16,1,chLt(P.wn,.3));X2(g,0,15,16,1,chDk(P.wn,.35));for(let i=(x%2)*4+2;i<16;i+=8)X2(g,i,12,1,3,chDk(P.wn,.18));
  if(win){n4Box(g,2,1,12,9,"#5aa8f0");X2(g,3,2,10,3,"#9ad2ff");X2(g,4,2,2,1,"#e0f4ff");X2(g,8,2,1,7,N4OL);X2(g,3,5,10,1,N4OL);X2(g,1,9,14,2,N4OL);X2(g,2,9,12,1,"#e8dcc0")}
  return XG[k]=c};
// ---------- alfombras y felpudo de salida ----------
xRug=function(x,y,mat){
  if(mat){const fl=(EX.M&&EX.M.fl)||"wood",k="N4MAT"+n4Key()+fl+(x%3)+(y%3);if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");g.drawImage(xFloor(fl,x,y),0,0);
    n4Box(g,1,3,14,11,"#6a9a4a");for(let r=6;r<12;r+=2)X2(g,2,r,12,1,"#4e7c36");X2(g,2,4,12,1,"#8ec06a");return XG[k]=c}
  const m=xMask(x,y,q=>q==="R"),th=n4Th(),base=th==="house"?["#c83c48","#3c68c0","#3c9a58","#8a48b8"][xMapV()]:th==="gym"?chDk(n4Gym(),.18):th==="liga"?"#b02838":th==="mart"?"#3c68c0":"#d03a48",bd=th==="liga"?"#e8c040":"#f0c858",k="N4R"+m+base;if(XG[k])return XG[k];
  const c=xc(32,32),g=c.getContext("2d"),dk=chDk(base,.3);X2(g,0,0,16,16,base);
  for(let j=0;j<16;j+=4)for(let i=((j/4)%2)*2;i<16;i+=4){X2(g,i+1,j+1,1,1,chLt(base,.3));X2(g,i+1,j+2,1,1,chDk(base,.18))}
  const N=m&1,E=m&2,S=m&4,W=m&8;
  if(!N){X2(g,0,0,16,1,N4OL);X2(g,0,1,16,2,bd);X2(g,0,3,16,1,dk)}
  if(!S){X2(g,0,15,16,1,N4OL);X2(g,0,13,16,2,bd);X2(g,0,12,16,1,dk)}
  if(!W){X2(g,0,0,1,16,N4OL);X2(g,1,N?0:1,2,16-(N?0:1)-(S?0:1),bd);X2(g,3,N?0:3,1,16-(N?0:3)-(S?0:4),dk)}
  if(!E){X2(g,15,0,1,16,N4OL);X2(g,13,N?0:1,2,16-(N?0:1)-(S?0:1),bd);X2(g,12,N?0:3,1,16-(N?0:3)-(S?0:4),dk)}
  return XG[k]=c};
// ---------- cuadros (x) y alfombrita ovalada (y) ----------
{const _g=xGround;xGround=function(x,y,fr){try{const c=exAt(x,y),M=EX.M;if(M&&M.base==="F"){const fl=M.fl||"wood";
  if(c==="x"){const v=(x*7+String(EX.map||"").length)%5,k="N4PT"+n4Key()+v+(x%2);if(XG[k])return XG[k];const cv=xc(32,32),g=cv.getContext("2d");g.drawImage(xWall(fl,x,1),0,0);
    n4Box(g,3,1,10,9,"#c08850");const R=(a,b,w,h,col)=>X2(g,a,b,w,h,col);
    if(n4Th()==="cen"){R(4,2,8,7,"#fff");R(6,3,4,4,N4OL);R(7,3,2,2,"#ff5a62");R(7,5,2,1,"#fff")}
    else if(n4Th()==="mart"){R(4,2,8,7,"#fff4c0");R(5,3,6,2,"#e04848");R(5,6,6,1,"#4a78c8");R(5,7,4,1,"#4a78c8")}
    else if(v===0){R(4,2,8,4,"#8fd0ff");R(4,6,8,3,"#5ab04a");R(9,3,1,1,"#fff4b0");R(5,5,3,1,"#3a7a36")}
    else if(v===1){R(4,2,8,7,"#3a4a7a");R(6,3,4,4,N4OL);R(7,3,2,2,"#ff5a62");R(7,5,2,1,"#fff")}
    else if(v===2){R(4,2,8,7,"#f6e2c8");R(7,3,2,2,"#c8905a");R(6,5,4,4,"#e04858")}
    else if(v===3){R(4,2,8,7,"#ffe7a0");[[5,4,"#e04858"],[8,3,"#4a88e0"],[10,5,"#5ad1a0"]].forEach(([a,b,col])=>{R(a,b,1,1,col);R(a,b+1,1,3,"#3a7a36")})}
    else{R(4,2,8,7,"#1d2a5a");R(10,3,1,1,"#fff4b0");R(5,4,1,1,"#fff");R(7,6,1,1,"#fff");R(9,7,1,1,"#fff")}
    return XG[k]=cv}
  if(c==="y"){const v=xMapV(),k="N4OV"+v+fl+(x%3)+(y%3);if(XG[k])return XG[k];const cv=xc(32,32),g=cv.getContext("2d");g.drawImage(xFloor(fl,x,y),0,0);const col=["#5a8ad8","#d85a8a","#5ab07a","#d8a03a"][v];
    for(let j=0;j<16;j++)for(let i=0;i<16;i++){const d=((i-7.5)/7.5)**2+((j-7.5)/5.5)**2;if(d>1)continue;X2(g,i,j,1,1,d>.75?N4OL:d>.45?col:d>.3?chLt(col,.35):col)}
    return XG[k]=cv}}}catch(e){}return _g.apply(this,arguments)}}
// ---------- muebles y objetos ----------
function n4Obj(ch,x,y){if(!"BCDEGKLMOSYZVQJPifnt%".includes(ch))return null;
  const th=n4Th(),fl=EX.M.fl||"wood",nb=(a,b)=>exAt(x+a,y+b)===ch,L=nb(-1,0),Rt=nb(1,0),Up=nb(0,-1),Dn=nb(0,1),v=(x*3+y)%4,fr=ch==="f"?Math.floor(performance.now()/160)%3:0;
  const k="N4O"+ch+n4Key()+fl+v+(L?1:0)+(Rt?1:0)+(Up?1:0)+(Dn?1:0)+fr;if(XG[k])return XG[k];
  const c=xc(32,48),g=c.getContext("2d"),B=(a,b,w,h,col)=>n4Box(g,a,b,w,h,col),R=(a,b,w,h,col)=>X2(g,a,b,w,h,col),O=N4OL,a0=L?0:1,b0=Rt?16:15,wd=b0-a0;
  const wood="#b07440",woodL="#c88c52",gold="#ffe060";
  if(ch==="B"){n4Sh(g);const bl=["#e04858","#4a7ad8","#48b070","#e8a030"][(x+xMapV())%4];
    B(1,2,14,8,"#a8683a");R(2,3,12,1,"#c88a50");B(1,8,14,15,"#f4f4f8");B(3,9,10,4,"#ffffff");R(4,10,8,1,"#e4e6ee");
    B(1,13,14,10,bl);R(2,14,12,1,"#ffffff");R(2,15,12,1,chLt(bl,.25));for(let i=3;i<14;i+=4)R(i,18,2,2,chDk(bl,.2));R(1,22,14,2,O)}
  else if(ch==="C"){n4Sh(g);B(1,0,14,23,wood);R(2,1,12,2,"#8a5430");R(8,3,1,19,O);[3,9].forEach(q=>{R(q,4,4,7,woodL);R(q,13,4,8,woodL);R(q,4,4,1,"#dca46a");R(q,13,4,1,"#dca46a")});R(6,11,1,2,gold);R(9,11,1,2,gold);R(2,23,2,1,O);R(12,23,2,1,O)}
  else if(ch==="D"||(ch==="Y"&&fl==="wood")){const top=Up?8:6;if(!Dn)n4Sh(g);const tc=th==="house"?woodL:"#e8eaf0";
    R(0,top,16,(Dn?24:17)-top,O);R(a0,top+(Up?0:1),wd,(Dn?24:16)-top-(Up?0:1),tc);if(!Up)R(a0,top+1,wd,1,chLt(tc,.3));
    if(!Dn){R(0,17,16,3,O);R(a0,17,wd,2,chDk(tc,.25));if(!L)R(1,20,2,4,O);if(!Rt)R(13,20,2,4,O)}
    if(!Up&&v%2===0&&ch==="D"){R(5,9,6,4,O);R(6,9,4,3,"#ffffff");R(7,10,2,1,"#f0a030")}
    if(!L)R(0,top,1,(Dn?24:20)-top,O);if(!Rt)R(15,top,1,(Dn?24:20)-top,O)}
  else if(ch==="E"){n4Sh(g);B(4,0,8,9,wood);R(5,1,6,7,"#bfe4ff");R(6,2,2,3,"#ffffff");B(1,8,14,15,wood);R(2,9,12,1,"#d09a60");B(3,11,10,5,woodL);B(3,16,10,5,woodL);R(7,13,2,1,gold);R(7,18,2,1,gold)}
  else if(ch==="G"){n4Sh(g);B(0,6,16,17,"#e8eaf0");R(1,7,14,5,"#cfd4dc");[[3,8],[9,8]].forEach(([p,q])=>{R(p,q,4,3,O);R(p+1,q+1,2,1,"#e04848")});B(3,13,10,8,"#4a4f68");R(4,14,8,2,"#7a8098");R(5,12,6,1,O)}
  else if(ch==="K"){n4Sh(g);R(0,6,16,18,O);R(a0,7,wd,5,"#ece8e0");R(a0,7,wd,1,"#ffffff");R(a0,11,wd,1,"#b8b0a0");R(a0,12,wd,10,woodL);R(a0,12,wd,1,"#e0aa6c");R(8,13,1,9,chDk(woodL,.3));R(6,16,1,2,gold);R(9,16,1,2,gold);
    if(v%2===0){R(4,8,8,3,O);R(5,8,6,2,"#9ad2f0");R(7,5,2,3,"#9aa6b8");R(7,5,3,1,"#9aa6b8")}}
  else if(ch==="L"){n4Sh(g);B(2,0,12,23,"#eef2f8");R(3,9,10,1,"#b8c0cc");R(11,3,1,4,"#9aa6b8");R(11,11,1,7,"#9aa6b8");R(5,3,2,2,v%2?"#ff8a94":"#5ad1a0");R(3,1,10,1,"#ffffff")}
  else if(ch==="M"){n4Sh(g,8);B(4,7,8,8,wood);R(5,9,6,1,"#8a5430");R(5,11,6,1,"#8a5430");B(3,14,10,4,woodL);R(4,18,1,5,O);R(11,18,1,5,O)}
  else if(ch==="O"){n4Sh(g);B(0,12,16,11,wood);R(1,13,14,1,"#d09a60");B(2,15,6,7,woodL);R(4,18,2,1,gold);B(3,2,10,9,"#d8dce6");R(4,3,8,6,"#1a3050");R(5,4,4,1,"#5ad1a0");R(5,6,6,1,"#4a9cff");R(7,11,2,2,O);R(9,13,5,1,"#e8eaf0")}
  else if(ch==="S"){n4Sh(g);const col=["#5a7ad8","#d85a6a","#4aa86a","#a86ad8"][xMapV()];R(0,6,16,16,O);R(a0,7,wd,7,col);R(a0,7,wd,1,chLt(col,.35));R(a0,14,wd,7,chLt(col,.12));R(a0,14,wd,1,chDk(col,.3));
    if(Rt)R(15,15,1,5,chDk(col,.25));if(!L){R(1,10,4,12,O);R(2,11,2,10,col);R(2,11,2,1,chLt(col,.35))}if(!Rt){R(11,10,4,12,O);R(12,11,2,10,col);R(12,11,2,1,chLt(col,.35))}R(a0,21,wd,1,chDk(col,.4))}
  else if(ch==="Y"){n4Sh(g);const front=th==="cen"?"#e05060":th==="mart"?"#4a78c8":th==="liga"?"#d8b040":th==="gym"?n4Gym():"#a8b4c8",topc="#f6f6fa";
    R(0,8,16,15,O);R(a0,9,wd,5,topc);R(a0,9,wd,1,"#ffffff");R(a0,13,wd,1,chDk(topc,.15));R(a0,14,wd,8,front);R(a0,14,wd,1,chLt(front,.3));R(a0,20,wd,1,chDk(front,.25));R(8,15,1,5,chDk(front,.18))}
  else if(ch==="Z"&&th==="mart"){n4Sh(g);R(0,4,16,19,O);R(a0,5,wd,17,"#d8dde6");R(a0,5,wd,1,"#f4f6fa");if(!L)R(1,5,1,17,"#eef1f6");if(!Rt)R(14,5,1,17,"#b8c0cc");
    [6,11,16].forEach((r,ri)=>{R(a0,r+4,wd,1,"#8a96ac");for(let i=0;i<3;i++){const t=(i+ri*2+x)%4,q=2+i*4+(L?0:0);
      if(t===0){R(q,r+1,3,1,"#ff5a62");R(q,r+2,3,1,O);R(q,r+3,3,1,"#ffffff");R(q+1,r+2,1,1,"#ffffff")}
      else if(t===1){R(q+1,r,1,1,"#ffffff");R(q,r+1,3,3,"#9a6ad8");R(q,r+1,1,3,"#c8a8ff")}
      else if(t===2){R(q,r+1,3,3,"#ffd23f");R(q,r+1,3,1,"#ffe890");R(q,r+3,3,1,"#d8a020")}
      else{R(q,r,3,4,"#4a88e0");R(q,r,3,1,"#bfe0ff");R(q,r+2,3,1,"#ffffff")}}})}
  else if(ch==="Z"){n4Sh(g);const fr2=th==="lab"||th==="tow"?"#8a96ac":"#9a6232";B(1,0,14,23,fr2);
    [2,9,16].forEach((r,ri)=>{R(2,r,12,6,chDk(fr2,.45));let q=2;const C=["#e04858","#4a88e0","#ffd23f","#5ad1a0","#b58aff","#ff8a1e","#f4f4f4"];for(let i=0;q<14;i++){const w=1+((i+ri+x)%2),h=4+((i*3+ri+x)%3)%2+(i%3===0?1:0);R(q,r+6-h,w,h,C[(i*2+ri+x)%7]);if(w>1)R(q,r+6-h,1,h,chLt(C[(i*2+ri+x)%7],.2));q+=w}R(2,r+6,12,1,chLt(fr2,.3))})}
  else if(ch==="V"&&th==="cen"){n4Sh(g);B(1,3,14,19,"#e8eaf0");R(2,4,12,1,"#ffffff");B(3,5,10,5,"#1a3050");R(4,6,4,1,"#5ad1a0");R(4,8,6,1,"#ff8a94");
    for(let j=0;j<2;j++)for(let i=0;i<3;i++){const sx=3+i*4,sy=11+j*4;R(sx,sy,3,3,O);R(sx,sy,3,1,"#ff5a62");R(sx,sy+2,3,1,"#ffffff")}R(1,20,14,3,"#e05060");R(1,20,14,1,"#ff8a94")}
  else if(ch==="V"&&(th==="gym"||th==="liga")){n4Sh(g,10);const acc=th==="gym"?n4Gym():"#e8c040",st="#9a9aac";
    B(2,15,12,8,"#b0b0c0");R(3,16,10,1,"#d0d0dc");R(6,18,4,3,O);R(7,19,2,1,acc);
    B(4,6,8,10,st);B(5,2,6,6,chLt(st,.1));R(5,1,1,2,O);R(10,1,1,2,O);R(6,4,1,1,O);R(9,4,1,1,O);R(5,10,6,1,chDk(st,.15));R(3,9,2,4,O);R(11,9,2,4,O);R(4,10,1,2,st);R(11,10,1,2,st)}
  else if(ch==="V"&&(th==="lab"||th==="tow"||fl!=="wood")){n4Sh(g);B(1,2,14,21,"#c9d4e4");B(3,4,10,7,"#14304a");R(4,5,4,1,"#5ad1a0");R(4,7,7,1,"#4a9cff");R(4,9,3,1,"#ffd23f");
    R(3,13,2,2,"#ffd23f");R(7,13,2,2,"#ff5a6a");R(11,13,2,2,"#5ad1a0");R(3,17,10,1,"#9aa6b8");R(3,19,10,1,"#9aa6b8")}
  else if(ch==="V"){n4Sh(g);B(2,15,12,8,"#8a5430");R(3,16,10,1,"#b07440");R(7,18,2,1,gold);B(2,5,12,11,"#3a3f58");R(3,6,10,8,"#5aa8e8");R(3,6,10,2,"#9fd4ff");R(4,8,3,1,"#ffffff");R(5,2,1,3,O);R(10,2,1,3,O);R(6,4,4,1,O)}
  else if(ch==="Q"){n4Sh(g);R(0,8,16,14,O);R(a0,9,wd,5,"#4a72c8");R(a0,9,wd,1,"#8ab0ff");R(a0,14,wd,1,O);R(a0,15,wd,5,"#5a8ae8");R(a0,15,wd,1,"#9ac0ff");R(a0,19,wd,1,"#3a5aa8");
    if(Rt)R(15,10,1,9,"#3a5aa8");if(!L)R(2,22,1,2,O);if(!Rt)R(13,22,1,2,O)}
  else if(ch==="J"){n4Sh(g,8);const W2=[1,2,3,4,5,5,6,6,6,5,6,5,4];for(let i=0;i<W2.length;i++){const w=W2[i],r=3+i;R(8-w-1,r,w*2+2,1,O)}
    for(let i=0;i<W2.length;i++){const w=W2[i],r=3+i;if(i===0)continue;R(8-w,r,w*2,1,"#3f9a42");R(8-w,r,Math.max(1,Math.round(w*.6)),1,"#5ac05a");R(8+Math.round(w*.4),r,Math.round(w*.6),1,"#2f7a34")}
    R(5,6,1,1,"#8ee070");R(9,9,1,1,"#8ee070");R(4,11,1,1,"#8ee070");R(10,5,1,1,"#2f7a34");
    B(4,15,8,8,"#c86a3a");R(3,15,10,2,O);R(4,15,8,1,"#e89060");R(5,18,6,1,chDk("#c86a3a",.2))}
  else if(ch==="P"){n4Sh(g,6);R(5,22,6,1,O);R(7,8,2,14,O);R(7,8,1,14,"#9aa6b8");B(4,2,8,7,"#ffe9a8");R(5,3,6,1,"#fff6d0");R(5,7,6,1,"#e8c060")}
  else if(ch==="i"){n4Sh(g,10);B(2,12,12,11,wood);R(3,13,10,1,"#d09a60");B(4,15,8,5,woodL);R(7,17,2,1,gold);R(7,8,2,4,O);R(7,8,1,4,"#c8ccd2");B(5,4,6,5,"#ffcf8a");R(6,5,4,1,"#fff0c8")}
  else if(ch==="f"){const x0=L?0:1,x1=Rt?16:15;R(x0,2,x1-x0,21,O);
    for(let r=5;r<22;r+=3)for(let q=x0+1-((r/3+x)%2)*3;q<x1-1;q+=5){const qa=Math.max(x0+1,q),qb=Math.min(x1-1,q+4);if(qb>qa){R(qa,r,qb-qa,2,(q+r+x)%3?"#a8a0a0":"#8e8888");R(qa,r,qb-qa,1,"#c8c2c2")}}
    R(x0,2,x1-x0,3,"#8a5430");R(x0,2,x1-x0,1,"#b07440");
    const ox=L?0:6,ow=10;R(ox,11,ow,12,O);R(ox+(L?0:1),12,ow-1,10,"#1a1210");
    const cols=["#ff7a2a","#ffb03c","#ffe27a"];for(let i=0;i<3;i++){const h=3+((fr+i)%3),fx=(L?1:7)+i*3;R(fx,21-h,2,h,cols[0]);R(fx,22-Math.max(1,h-1),1,Math.max(1,h-1),cols[1]);R(fx,20,1,1,cols[2])}R(L?0:7,21,9,1,"#5a3418")}
  else if(ch==="n"){n4Sh(g,8);const body=["#ffd23f","#ff8ad8","#8ac8ff"][x%3],ear=["#2b2440","#ff5aa8","#3a6ae0"][x%3];B(4,15,8,8,body);B(3,8,10,8,body);R(3,5,2,4,O);R(4,6,1,2,ear);R(11,5,2,4,O);R(11,6,1,2,ear);R(5,11,1,2,O);R(10,11,1,2,O);R(4,13,1,1,"#ff7a8a");R(11,13,1,1,"#ff7a8a");R(7,13,2,1,O)}
  else if(ch==="t"){n4Sh(g);R(3,9,3,3,O);R(4,9,1,1,"#e04858");R(9,7,3,5,O);R(10,8,1,3,"#4a88e0");B(2,11,12,12,"#c86a3a");R(3,12,10,2,"#e08050");R(3,16,10,1,"#8a3a20");R(7,15,2,3,"#ffd34a")}
  else if(ch==="%"){n4Sh(g,8);B(4,12,8,11,"#9aa6b8");R(3,11,10,2,O);R(4,11,8,1,"#c8d0dc");R(6,14,1,7,"#7a8698");R(9,14,1,7,"#7a8698")}
  else return null;
  return XG[k]=c}
{const _o=xObj;xObj=function(c,x,y){try{if(EX.M&&EX.M.base==="F"&&EX.grid[y]&&EX.grid[y][x]!=null){const r=n4Obj(c,x,y);if(r)return r}}catch(e){}return _o.apply(this,arguments)}}
