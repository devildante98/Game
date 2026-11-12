// =====================================================================================
// NUEVOS GRÁFICOS DE EXPLORACIÓN · FASE 6: TODO LO QUE QUEDABA CON EL ESTILO ANTIGUO
// Agua con orilla y espuma, arena, cuevas (suelo, paredes, charcas, estalagmitas), hierba alta, rocas, arbustos,
// palmeras, setas, carteles y objetos: redibujados de cero a 16×16 y ampliados al doble, con contorno oscuro.
// Además: pinos nevados y árboles quemados según la región, nieve en los tejados, huellas en la arena y en la nieve,
// hojas al pisar la hierba alta, flores que se mecen y luces de cueva y lluvia hechas con píxeles.
// =====================================================================================
const n6B=(g,x0,y0,rows,pal,flip)=>rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const c=pal[r[x]];if(c)X2(g,flip?x0+r.length-1-x:x0+x,y0+y,1,1,c)}});
const n6P=t=>EX.M&&EX.M.pal?xPal(t,EX.M.pal):t;
const n6Sh=(g,w)=>xdisc(g,16,44,w||12,3,"rgba(0,0,0,.24)");
// ---------- arena ----------
xSand=function(m,v,base){const k="N6S"+m+"_"+v;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");X2(g,0,0,16,16,"#f0dca0");
  for(let i=0;i<10;i++){const a=Math.floor(X2R(v,i,41)*16),b=Math.floor(X2R(v,i,42)*16);X2(g,a,b,1,1,i%3?"#dcc484":"#fff2cc")}
  for(let i=0;i<2;i++){const a=1+Math.floor(X2R(v,i,43)*11),b=2+Math.floor(X2R(v,i,44)*12);X2(g,a,b,3,1,"#d8bc78");X2(g,a+1,b-1,2,1,"#fff2cc")}
  if(v===2){X2(g,10,5,2,1,"#f8b8c0");X2(g,10,6,2,1,"#d88898")}
  const wet="#dcc488",wd="#ccb070";if(m&4){X2(g,0,13,16,3,wet);for(let x=v%3;x<16;x+=3)X2(g,x,13,1,1,wd)}if(m&1){X2(g,0,0,16,3,wet);for(let x=v%3;x<16;x+=3)X2(g,x,2,1,1,wd)}
  if(m&2){X2(g,13,0,3,16,wet);for(let y=v%3;y<16;y+=3)X2(g,13,y,1,1,wd)}if(m&8){X2(g,0,0,3,16,wet);for(let y=v%3;y<16;y+=3)X2(g,2,y,1,1,wd)}
  return XG[k]=c};
// ---------- suelo de cueva ----------
xCave=function(v){const k="N6CF"+v;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");X2(g,0,0,16,16,"#b8a084");
  for(let i=0;i<8;i++){const a=Math.floor(X2R(v,i,71)*16),b=Math.floor(X2R(v,i,72)*16);X2(g,a,b,1,1,i%2?"#a48c70":"#ccb89c")}
  for(let i=0;i<2;i++){const a=1+Math.floor(X2R(v,i,73)*12),b=2+Math.floor(X2R(v,i,74)*12);X2(g,a,b,2,1,"#ccb89c");X2(g,a,b+1,2,1,"#96806a")}
  if(v%2){let a=3+Math.floor(X2R(v,1,75)*8),b=3+Math.floor(X2R(v,2,75)*6);for(let s=0;s<4;s++){X2(g,a,b,1,1,"#907a62");a+=X2R(v,s,76)<.5?1:0;b++}}
  return XG[k]=c};
// ---------- paredes de roca: por arriba (techo) y de frente ----------
xCliff=function(face,m,v,cave){const k="N6C"+(face?1:0)+m+"_"+v+(cave?"c":"");if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  const P=cave?{t:"#3a2c28",t2:"#463630",t3:"#2e221e",rim:"#5e4a3e",o:"#1e1614",f:"#7c6452",fd:"#5e4838",fl:"#9c826c",lip:"#b09880",sh:"#463428"}
             :{t:"#a8845c",t2:"#b8946a",t3:"#96744e",rim:"#d0ac80",o:"#5a3e26",f:"#c09464",fd:"#9a6e44",fl:"#dcb484",lip:"#ecc898",sh:"#7c5634"};
  const N=m&1,E=m&2,W=m&8;
  if(face){X2(g,0,0,16,16,P.f);
    // vetas horizontales rotas y grietas
    [5,9,12].forEach((y,i)=>{const o=Math.floor(X2R(v,i,61)*5);for(let x=0;x<16;x++)if((x+o+i*3)%7>1){X2(g,x,y,1,1,P.fd);if((x+o)%7===3)X2(g,x,y-1,1,1,P.fl)}});
    for(let i=0;i<3;i++){const x=1+Math.floor(X2R(v,i,62)*14),y=3+Math.floor(X2R(v,i,63)*8);X2(g,x,y,1,2+i%2,P.fd)}
    for(let i=0;i<4;i++)X2(g,Math.floor(X2R(v,i,64)*16),3+Math.floor(X2R(v,i,65)*9),1,1,P.fl);
    X2(g,0,0,16,1,P.lip);X2(g,0,1,16,1,P.fl);for(let x=(v%3);x<16;x+=3)X2(g,x,2,2,1,P.fd);X2(g,0,14,16,2,P.sh);for(let x=v%2;x<16;x+=2)X2(g,x,13,1,1,P.sh);
    if(!W){X2(g,0,0,1,16,P.o);X2(g,1,2,1,12,P.fd)}if(!E){X2(g,15,0,1,16,P.o);X2(g,14,2,1,12,P.fd)}}
  else{X2(g,0,0,16,16,P.t);
    for(let i=0;i<5;i++){const a=Math.floor(X2R(v,i,66)*14),b=Math.floor(X2R(v,i,67)*14);X2(g,a,b,2,1,P.t2);X2(g,a,b+1,2,1,P.t3)}
    for(let i=0;i<3;i++)X2(g,Math.floor(X2R(v,i,68)*16),Math.floor(X2R(v,i,69)*16),1,1,P.t2);
    if(!cave)for(let i=0;i<2;i++){const a=1+Math.floor(X2R(v,i,60)*12),b=1+Math.floor(X2R(v,i,59)*12);X2(g,a,b+1,1,1,"#68a050");X2(g,a+2,b+1,1,1,"#68a050");X2(g,a+1,b,1,2,"#88c070")}
    if(!N){X2(g,0,0,16,1,P.o);X2(g,0,1,16,1,P.rim)}if(!W){X2(g,0,0,1,16,P.o);X2(g,1,N?0:1,1,16,P.rim)}if(!E){X2(g,15,0,1,16,P.o);X2(g,14,N?0:1,1,16,P.t3)}}
  return XG[k]=c};
// ---------- agua con orilla (también lava, hielo y charcas de cueva: el color lo pone la región) ----------
function n6Mask(x,y,f){let m=0;const G=EX.grid;[[0,-1,1],[1,0,2],[0,1,4],[-1,0,8],[1,-1,16],[1,1,32],[-1,1,64],[-1,-1,128]].forEach(([dx,dy,b])=>{const r=G[y+dy],c=r?r[x+dx]:null;if(c==null||f(c))m|=b});return m}
const N6WO={".":"#3c8838",s:"#b89858",c:"#5a4636",F:"#7c84a0"};
function n6Water(m,v,fr,base){const k="N6W"+base+m+"_"+v+"_"+fr;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  if(base==="s")g.drawImage(xSand(0,v),0,0);else if(base==="c")g.drawImage(xCave(v),0,0);else if(base==="F"){X2(g,0,0,16,16,"#c8ccd8");X2(g,0,0,16,1,"#e4e8f0")}else xGrassBase(g,v);
  const A=new Uint8Array(256).fill(1),cut=(x,y)=>{A[y*16+x]=0},N=m&1,E=m&2,S=m&4,W=m&8;
  if(!N)for(let x=0;x<16;x++){cut(x,0);cut(x,1)}if(!S)for(let x=0;x<16;x++)cut(x,15);if(!W)for(let y=0;y<16;y++)cut(0,y);if(!E)for(let y=0;y<16;y++)cut(15,y);
  if(!N&&!W){cut(1,2);cut(2,2);cut(1,3)}if(!N&&!E){cut(14,2);cut(13,2);cut(14,3)}if(!S&&!W){cut(1,14);cut(2,14);cut(1,13)}if(!S&&!E){cut(14,14);cut(13,14);cut(14,13)}
  if(N&&W&&!(m&128)){cut(0,0);cut(0,1);cut(1,0)}if(N&&E&&!(m&16)){cut(15,0);cut(15,1);cut(14,0)}if(S&&W&&!(m&64))cut(0,15);if(S&&E&&!(m&32))cut(15,15);
  const at=(x,y)=>x<0||y<0||x>15||y>15?1:A[y*16+x],MID="#4a90e8",LT="#86c0fa",DK="#3a78d4",edge=new Uint8Array(256);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){if(!A[y*16+x]){if(at(x,y-1)&&y>0&&A[(y-1)*16+x]||y<15&&A[(y+1)*16+x]||x>0&&A[y*16+x-1]||x<15&&A[y*16+x+1])X2(g,x,y,1,1,N6WO[base]||N6WO["."]);continue}
    let col=MID;if(!at(x,y-1)){col="#2c62bc";edge[y*16+x]=1}else if(!at(x,y-2)){col=DK;edge[y*16+x]=1}
    else if(!at(x-1,y)||!at(x+1,y)||!at(x,y+1)){col=(x+y+fr)%4<2?"#e0f4ff":"#9cd0fc";edge[y*16+x]=1}
    X2(g,x,y,1,1,col)}
  const free=(x,y)=>x>=0&&x<16&&y>=0&&y<16&&A[y*16+x]&&!edge[y*16+x];
  for(let i=0;i<4;i++){const y=2+i*4+Math.floor(X2R(v,i,51)*2),x=Math.floor(X2R(v,i,52)*11),len=[2,3,4,3][(fr+i)%4];
    for(let d=0;d<len;d++)if(free(x+d,y))X2(g,x+d,y,1,1,LT);for(let d=1;d<len;d++)if(free(x+d,y+1))X2(g,x+d,y+1,1,1,DK)}
  if((v+fr)%4===0){const x=3+Math.floor(X2R(v,7,53)*10),y=3+Math.floor(X2R(v,8,53)*10);if(free(x,y))X2(g,x,y,1,1,"#d8f0ff")}
  return XG[k]=c}
xWater=function(m,v,fr){return n6Water(m,v,fr&3,".")};
xCavePuddle=function(v,fr){return n6P(n6Water(0,v,fr&3,"c"))};
// ---------- hierba alta (T), de bosque (d) y de playa (g) ----------
const N6TUFT=["...k....",".k.lk.k.",".lkmk.lk","klkmkklk","kmlmlmmk","kmmmmmdk",".kdmmdk.","..kkkk.."];
xTall=function(kind,v,fr,base){const k="N6T"+kind+v+fr+base;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");
  if(base==="s")g.drawImage(xSand(0,v),0,0);else xGrassBase(g,v,kind==="d"?{b:"#4f9a48",d:"#3a7a36",l:"#6cb860",k:"#2a5a28"}:GRP);
  const P=kind==="d"?{k:"#14381a",d:"#1f5426",m:"#2c7434",l:"#4c9c4c"}:kind==="g"?{k:"#7a6424",d:"#a89238",m:"#ccb850",l:"#f0e088"}:{k:"#1e5c26",d:"#35883a",m:"#4eac48",l:"#8cdc6c"};
  [[0,0],[8,0],[0,8],[8,8]].forEach(([x,y],i)=>{const sw=fr&&(i===1||i===2)?1:0;n6B(g,x,y+3,N6TUFT.slice(3),P,i%2===1);n6B(g,x+sw,y,N6TUFT.slice(0,3),P,i%2===1)});
  return XG[k]=c};
// ---------- flores que se mecen ----------
xFlowers=function(v,fr){const k="N6F"+v+fr;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");xGrassBase(g,v);
  const cols=["#f070b0","#c080f0","#ffffff","#ffd040"];
  for(let i=0;i<4;i++){const a=2+Math.floor(X2R(v,i,9)*11),b=2+Math.floor(X2R(v,i,10)*10),col=cols[(v+i)%4],s=fr&&i%2?1:0;
    X2(g,a,b+2,1,2,"#3e8828");X2(g,a+1,b+3,1,1,"#58b048");X2(g,a-1+s,b,3,1,col);X2(g,a+s,b-1,1,3,col);X2(g,a+s,b,1,1,col==="#ffd040"?"#ff8020":"#ffe060")}
  return XG[k]=c};
// ---------- objetos con altura ----------
xRock=function(v,cave){const k="N6RK"+v+cave;if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");n6Sh(g,13);
  const P=cave?{k:"#2e2420",l:"#b8a08a",m:"#8e7866",d:"#665446"}:{k:"#30303c",l:"#d8d8e4",m:"#a4a4b4",d:"#787888"};
  n6B(g,1,13,["....kkkkkk....","..kkllllllkk..",".klllllmmmmmk.","kllllmmmmmmddk","kllmmmmkmmdddk","klmmmmmkkmdddk","kmmmdmmmmmdddk","kmmddmmmdddddk",".kdddddddddddk","..kkkkkkkkkkk."],P,v%2===1);return XG[k]=c};
xBush=function(v){const k="N6BU"+v;if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");n6Sh(g,13);
  n6B(g,1,12,["....kkkkkk....","..kkllllmmkk..",".klllllmmmmmk.","kllllmmmmmmmdk","kllmmmrmmmmddk","klmmmmmmmdmddk","kmmrmmmmmddrdk","kmmmmmdmmddddk","kdmmdddddddddk",".kkdddddddddk.","...kkkkkkkkk.."],{k:"#143a1c",l:"#6cc058",m:"#3c9440",d:"#266c30",r:"#f04858"},v%2===1);return XG[k]=c};
xShroom=function(v){const k="N6MU"+v;if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");n6Sh(g,8);
  n6B(g,3,13,["...kkkk...",".kkrrrrkk.","krrwwrrrrk","krrwwrrwrk","krrrrrrrrk","kwrrrwwrrk",".kkkkkkkk.","...kssd...","...kssdk..","...kkkkk.."],{k:"#4a1418",r:"#e84848",w:"#fff4f0",s:"#f8ecd8",d:"#d4c4a8"},v%2===1);return XG[k]=c};
xSign=function(){const k="N6SG";if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");n6Sh(g,10);
  n6B(g,1,10,["kkkkkkkkkkkkkk","kllllllllllllk","kbbbbbbbbbbbbk","kbddddddddbbbk","kbbbbbbbbbbbbk","kbdddddddddbbk","kbbbbbbbbbbbbk","kbddddddbbbbbk","kssssssssssssk","kkkkkkkkkkkkkk","..kpk....kpk..","..kpk....kpk..","..kkk....kkk.."],{k:"#3a2010",l:"#f0c080",b:"#d09858",d:"#7a4a22",s:"#a06c38",p:"#9a6434"});return XG[k]=c};
xBall=function(){const k="N6IB";if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");xdisc(g,16,41,8,2,"rgba(0,0,0,.24)");
  n6B(g,4,12,["..kkkk..",".krrrrk.","krhrrrrk","krrrrrrk","kkkwwkkk","kwwkkwwk",".kwwwwk.","..kkkk.."],{k:"#202028",r:"#e83a40",h:"#ff9c9c",w:"#f4f4f8"});return XG[k]=c};
xPalm=function(v){const k="N6PA"+v;if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");xdisc(g,16,44,10,3,"rgba(60,40,0,.22)");
  for(let i=0;i<7;i++){const y=20-i*2,x=7+(i>3?1:0)+(v%2&&i>5?1:0);X2(g,x-1,y,4,2,"#4a2c12");X2(g,x,y,2,2,i%2?"#a87840":"#c09050");X2(g,x+1,y,1,2,"#7c5428")}
  const lf=(dx,dy,n)=>{const pts=[];for(let t=0;t<n;t++)pts.push([8+Math.round(dx*t),6+Math.round(dy*t+t*t*.09)]);
    pts.forEach(([x,y])=>X2(g,x-1,y-1,3,3,"#16461e"));pts.forEach(([x,y],t)=>{X2(g,x,y,1,1,t<n/2?"#5cb84c":"#3c9038");X2(g,x,y-1,1,1,t<n/2?"#8cdc6c":"#5cb84c")})};
  lf(-1,-.25,7);lf(1,-.25,7);lf(-.8,.35,6);lf(.8,.35,6);lf(-.3,-.8,4);lf(.3,-.8,4);X2(g,7,6,3,2,"#6a4a1a");X2(g,8,7,1,1,"#a87840");return XG[k]=c};
xPillar=function(v){const k="N6PL"+v;if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");n6Sh(g,11);
  for(let y=3;y<=21;y++){const h=Math.min(5,1+Math.floor((y-3)/3.4)),x0=8-h+(v%2&&y<9?1:0);X2(g,x0-1,y,h*2+2,1,"#2a201a");X2(g,x0,y,h*2,1,"#7c6452");X2(g,x0,y,Math.max(1,Math.round(h*.7)),1,"#a08670");X2(g,x0+h*2-Math.max(1,Math.round(h*.5)),y,Math.max(1,Math.round(h*.5)),1,"#5a4638")}
  X2(g,7,2,2,1,"#2a201a");X2(g,2,22,12,1,"#2a201a");X2(g,8,11,1,4,"#5a4638");X2(g,6,17,1,3,"#5a4638");X2(g,9,7,1,1,"#c4ac94");return XG[k]=c};
xLadder=function(){const k="N6LD";if(!XG[k]){const c=xc(32,32),g=c.getContext("2d");g.drawImage(xCave(1),0,0);X2(g,2,1,12,14,"#2a201a");X2(g,3,2,10,13,"#120c0a");
  X2(g,4,1,2,15,"#7a5026");X2(g,4,1,1,15,"#c8955a");X2(g,10,1,2,15,"#7a5026");X2(g,10,1,1,15,"#c8955a");for(let y=3;y<15;y+=3){X2(g,4,y,8,1,"#e0b070");X2(g,4,y+1,8,1,"#7a5026")}XG[k]=c}return n6P(XG[k])};
xCaveMouth=function(){const k="N6CM";if(!XG[k]){const c=xc(32,32),g=c.getContext("2d");g.drawImage(xCliff(true,10,1,false),0,0);
  n6B(g,1,1,["....kkkkkk....","..kkddddddkk..",".kddnnnnnnddk.",".kdnnnnnnnndk.","kdnnnnnnnnnndk","kdnnnnnnnnnndk","kdnnnnnnnnnndk","kdnnnnnnnnnndk","kdnnnnnnnnnndk","kdnnnnnnnnnndk","kdnnnnnnnnnndk","kdnnnnnnnnnndk","kdnnnnnnnnnndk","kdnnnnnnnnnndk","kdnnnnnnnnnndk"],{k:"#5a3e26",d:"#3a2616",n:"#120a06"});XG[k]=c}return n6P(XG[k])};
// ---------- pinos nevados (regiones de nieve) y árboles quemados (regiones de ceniza) ----------
function n6SnowTree(v){const k="N6ST"+v;if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");xdisc(g,16,44,12,3,"rgba(40,60,90,.22)");
  const ol="#24465a",b="#3a8070",d="#2c6458",sn="#f8fbff",sd="#c8dcf0";
  X2(g,6,18,4,5,ol);X2(g,7,18,2,5,"#6a4a34");X2(g,7,18,1,5,"#8a6448");X2(g,6,23,4,1,ol);
  [[1,7,4],[5,12,6],[10,18,7]].forEach(([y0,y1,hw],ti)=>{for(let y=y0;y<=y1;y++){const t=(y-y0)/Math.max(1,y1-y0),half=Math.max(1,Math.round(1+t*(hw-1))),top=t<.62;
      X2(g,8-half-1,y,1,1,ol);X2(g,8+half,y,1,1,ol);X2(g,8-half,y,half*2,1,top?sn:b);if(top)X2(g,8+Math.round(half*.4),y,Math.max(1,Math.round(half*.6)),1,sd);else X2(g,8+Math.round(half*.3),y,Math.round(half*.7),1,d);
      if(!top&&t<.8)for(let x=8-half+((y+ti)%2);x<8+half;x+=3)X2(g,x,y,1,1,sn)}
    X2(g,8-hw-1,y1+1,hw*2+2,1,ol);X2(g,7,y0-1,2,1,ol)});
  return XG[k]=c}
function n6AshTree(v){const k="N6AT"+v;if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d");xdisc(g,16,44,9,2.5,"rgba(20,10,10,.3)");
  n6B(g,0,9,[".......k........","...k...kk...k...","...kk..kb..kk...",".k..kk.kb.kk..k.",".kk..kkbbkk..kk.","..kk..kbbk..kk..","...kkkkblkkkk...",".....kkblkk.....","......kblk......","......kblk......","......kblbk.....",".....kbblbk.....",".....kbbbbk.....",".....kkkkkk....."],{k:"#241a1a",b:"#54423c",l:"#74605a"},v%2===1);
  if(v%2===0){X2(g,3,11,1,1,"#e8742c");X2(g,12,12,1,1,"#f0a040")}return XG[k]=c}
{const _o=xObj;xObj=function(c,x,y){try{const p=c==="#"&&EX.M&&EX.M.pal;if(p==="snow")return n6SnowTree(Math.floor(exRnd(x,y,7)*4));if(p==="ash"||p==="magma")return n6AshTree(Math.floor(exRnd(x,y,7)*4))}catch(e){}return _o.apply(this,arguments)}}
// ---------- nieve en los tejados ----------
function n6Snow(im){const w=im.width,h=im.height,c=xc(w,h),g=c.getContext("2d");g.drawImage(im,0,0);let d;try{d=g.getImageData(0,0,w,h).data}catch(e){return im}
  for(let x=0;x<w;x+=2){let y=0;while(y<h&&d[(y*w+x)*4+3]<128)y++;if(y>h*.55)continue;y-=y%2;const i=x/2,t=(5+(i*7%5<2?1:0)+(i%9===4?2:0))*2;
    g.fillStyle="#f8fbff";g.fillRect(x,y,2,t);g.fillStyle="#c8dcf0";g.fillRect(x,y+t-2,2,2);g.fillStyle="#24465a";g.fillRect(x,y-2,2,2)}
  return c}
{const _b=xBld;xBld=function(b){const im=_b.apply(this,arguments);try{if(EX.M&&EX.M.pal==="snow"&&im){if(!im._sn){im._sn=n6Snow(im);if(im._n)im._sn._n=n6Snow(im._n)}return im._sn}}catch(e){}return im}}
// ---------- casillas: agua y charcas con orilla; objeto del suelo dentro de un edificio ----------
{const _g=xGround;xGround=function(x,y,fr){try{const c=exAt(x,y),M=EX.M;
    if(c==="~"||c==="w"){const b=c==="w"?"c":(M.base==="s"||M.base==="c"||M.base==="F")?M.base:".",t=n6Water(n6Mask(x,y,q=>q===c),Math.floor(exRnd(x,y,7)*4),(fr|0)&3,b);return M.pal?xPal(t,M.pal):t}
    if(c==="I"&&M.base==="F"&&typeof xFloor==="function")return xFloor(M.fl||"wood",x,y);
    if(M.pal&&(c==="0"||c===";"))return xPal(_g.apply(this,arguments),M.pal)}catch(e){}return _g.apply(this,arguments)}}
// ---------- luz de cueva y oscuridad total, hechas con píxeles (tramado, sin degradados suaves) ----------
const N6BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function n6Vig(W,H,r0,r1,rgb,amax,lv){const k=W+"_"+H+"_"+r0+"_"+r1+rgb;if(n6Vig.k===k)return n6Vig.c;const w=Math.ceil(W/2),h=Math.ceil(H/2),c=n6Vig.c&&n6Vig.c.width===w&&n6Vig.c.height===h?n6Vig.c:xc(w,h),g=c.getContext("2d"),im=g.createImageData(w,h),p=im.data;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dd=Math.hypot((x-w/2)*4,(y-h/2)*4),t=Math.max(0,Math.min(1,(dd-r0)/(r1-r0))),q=Math.min(lv,Math.floor(t*lv+N6BAY[(x&3)+(y&3)*4]/16*.45)),i=(y*w+x)*4;p[i]=rgb[0];p[i+1]=rgb[1];p[i+2]=rgb[2];p[i+3]=Math.round(q/lv*amax*255)}
  g.putImageData(im,0,0);n6Vig.k=k;n6Vig.c=c;return c}
function n6Dark(g,W,H,px,py,r0,r1,rgb,amax,lv){const c=n6Vig(W,H,Math.round(r0),Math.round(r1),rgb,amax,lv||5),X=Math.round(px/4)*4,Y=Math.round(py/4)*4;g.imageSmoothingEnabled=false;g.drawImage(c,X-W,Y-H,W*2,H*2)}
{const _l=xLight;xLight=function(g,W,H,cx,cy){try{if(EX.M.base==="c"){n6DarkA(g,W,H,EX.px*EXTL-cx+16,EX.py*EXTL-cy+8);return}}catch(e){}return _l.apply(this,arguments)}}
const n6VA={};function n6DarkA(g,W,H,px,py){const k=W+"_"+H;if(!n6VA[k]){const s=n6Vig.k,sc=n6Vig.c;n6Vig.k=null;n6Vig.c=null;n6VA[k]=n6Vig(W,H,48,Math.round(Math.max(W,H)*.7),[10,6,20],.62,6);n6Vig.k=null;n6Vig.c=null}
  const X=Math.round(px/4)*4,Y=Math.round(py/4)*4;g.drawImage(n6VA[k],X-W,Y-H,W*2,H*2)}
// ---------- gota de lluvia y cartel con el nombre de la zona ----------
function n6Drop(g,x,y){x=Math.round(x);y=Math.round(y);g.fillRect(x,y,1,4);g.fillRect(x-1,y+4,1,4);g.fillRect(x-2,y+8,1,3)}
function n6Sign(g,x,y,w,h){const R=(a,b,c,d,col)=>{g.fillStyle=col;g.fillRect(a,b,c,d)};R(x+2,y+h,w,2,"rgba(0,0,0,.25)");R(x,y,w,h,"#3a2010");R(x+2,y+2,w-4,h-4,"#b87c44");R(x+2,y+2,w-4,2,"#e0a868");R(x+2,y+h-4,w-4,2,"#8a5a2c");
  R(x+6,y+6,w-12,h-12,"#f8e8c0");R(x+6,y+6,w-12,2,"#fff8e0");R(x+6,y+h-8,w-12,2,"#dcc898");[[x+3,y+3],[x+w-5,y+3],[x+3,y+h-5],[x+w-5,y+h-5]].forEach(([a,b])=>R(a,b,2,2,"#f8e8c0"))}
// ---------- huellas en la arena y en la nieve, y hojas al pisar la hierba alta ----------
{const _x=exExtraEnts;exExtraEnts=function(ents,g,cx,cy,ts){const r=_x.apply(this,arguments);try{if(EX.title)return r;const M=EX.M,S=EX.n6s||(EX.n6s={l:[],x:EX.x,y:EX.y,m:EX.map});
    if(S.m!==EX.map){S.l=[];S.m=EX.map;S.x=EX.x;S.y=EX.y}
    if(S.x!==EX.x||S.y!==EX.y){const c=exAt(S.x,S.y),snow=M.pal==="snow"&&(c==="."||c===",");
      if(!EX.surf&&(c==="s"||snow))S.l.push({x:S.x,y:S.y,f:EX.f,t:ts,sn:snow,bk:!!EX.bike});if(S.l.length>30)S.l.shift();
      const n=exAt(EX.x,EX.y);if((n==="T"||n==="d"||n==="g")&&!(typeof hubCalm==="function"&&hubCalm())){EX.pt=EX.pt||[];const col=n==="g"?["#ccb850","#f0e088"]:n==="d"?["#2c7434","#4c9c4c"]:["#4eac48","#8cdc6c"];
        for(let i=0;i<4;i++)EX.pt.push({x:EX.x*EXTL+6+Math.random()*20,y:EX.y*EXTL+18,vx:(Math.random()-.5)*70,vy:-55-Math.random()*40,g:260,t:0,l:.42,c:col[i%2],s:2})}
      S.x=EX.x;S.y=EX.y}
    S.l=S.l.filter(p=>ts-p.t<4000);
    if(S.l.length)ents.push({y:-9,d:()=>S.l.forEach(p=>{const a=1-(ts-p.t)/4000,X=Math.round(p.x*EXTL-cx),Y=Math.round(p.y*EXTL-cy);g.fillStyle=p.sn?"rgba(110,134,176,"+(a>.5?.6:a>.2?.38:.2)+")":"rgba(150,108,52,"+(a>.5?.8:a>.2?.5:.25)+")";
      if(p.bk){if(p.f==="u"||p.f==="d")g.fillRect(X+14,Y+4,4,26);else g.fillRect(X+2,Y+22,28,4)}
      else if(p.f==="u"||p.f==="d"){g.fillRect(X+10,Y+12,4,6);g.fillRect(X+18,Y+20,4,6)}else{g.fillRect(X+8,Y+18,6,4);g.fillRect(X+18,Y+24,6,4)}})})}catch(e){}return r}}
// las casillas ya dibujadas con el estilo antiguo se rehacen
Object.keys(XG).forEach(k=>{if(!/^N\d/.test(k))delete XG[k]});
