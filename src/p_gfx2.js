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
