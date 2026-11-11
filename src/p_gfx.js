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
