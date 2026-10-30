// ================= tu entrenador: pixel art propio al estilo de los juegos (sombreado a 3 tonos, contorno de color) =================
const TRP={
  skin:["#ffe2cc","#f6caa6","#e4ad83","#c98d5f","#9a643c","#6b4226","#fff1e6","#b77c4f","#4a2c1a","#ffd6b8"],
  hair:["#2b2118","#5b3a1e","#a2561f","#e0a33a","#f2d27a","#c43c3c","#e86aa8","#3b6fdb","#7b4bb7","#e8e8ee","#3aa36b","#18181f","#8d8d99","#c9a26b","#14727a","#ff8c2e","#6e1f2f","#b4e3ff","#c7b2ff","#5a4632"],
  eye:["#2b2118","#3b6fdb","#2fa36b","#8a5a22","#7b4bb7","#c43c3c","#7d8796","#d8961e","#e05aa0"],
  cl:["#e63950","#f57c20","#f5c400","#2fa36b","#0fa97d","#3f86f0","#233f94","#8a3fd0","#e86aa8","#f4f2ff","#9aa7b8","#2b2b34","#7a4a26","#c9b79c","#5fd0e6","#a8d84a",
      "#1d2b53","#7a2238","#5b6b2a","#ffb6c9","#b996ff","#ffe08a","#c2c6d0","#d4a017","#245e4a","#ff6a3d","#000000","#ffffff","#4a6b8a","#b5651d","#6ad1a0","#ff9ec7"]
};
// [clave, nombre, opciones o paleta, pestaña]  (las nuevas opciones siempre se añaden al final para no romper los entrenadores guardados)
const TRO=[
  ["b","Cuerpo",["Chico","Chica"],"c"],["sk","Piel","skin","c"],["fs","Forma de la cara",["Redonda","Ovalada","Cuadrada"],"c"],
  ["ey","Ojos",["Normales","Grandes","Serios","Alegres","Brillantes","Cerrados","Afilados","Con pestañas"],"c"],["ec","Color de ojos","eye","c"],
  ["mo","Boca",["Sonrisa","Seria","Abierta","Pícara","Lengua fuera","Sorprendida","Colmillo"],"c"],
  ["bl","Mejillas",["Normales","Sonrojadas","Pecas","Tirita","Lunar"],"c"],
  ["hs","Peinado",["Corto","Puntiagudo","Melena","Coleta","Dos coletas","Rapado","Rizado","Flequillo largo","Moño","Afro","Cresta","Media melena","Trenza","Dos moños","Despeinado","Tupé","Bob","Ondulado largo","Hacia atrás","Mechón en el ojo","Coleta alta","Dos trenzas","Calvo","Melena salvaje","Pelo largo liso","Coletas bajas","Rastas","Undercut","Media cola","Puntas largas"],"p"],
  ["hc","Color de pelo","hair","p"],
  ["hat","Gorro",["Ninguno","Gorra","Gorra al revés","Gorro de lana","Sombrero","Cinta","Lazo","Gafas de sol","Boina","Visera","Gorro de pescador","Sombrero de paja","Corona de flores","Gafas de aviador","Diadema","Pañuelo","Orejas de gato","Casco de explorador","Sombrero de copa","Sombrero vaquero","Gorro de Navidad","Auriculares","Bandana","Sombrero de bruja","Gorra de capitán","Gorra de Prestigio","Cinta de Prestigio","Corona de laurel","Sombrero de Campeón","Halo de Prestigio","Corona Suprema","Gorro de calabaza","Cuernos de reno","Diadema de corazones","Sombrero con flor","Gafas de buceo"],"a"],
  ["hac","Color del gorro y adornos","cl","a"],["gl","Gafas",["No","Redondas","Cuadradas","De sol","Media montura","Parche","Monóculo dorado","Gafas de corazón"],"a"],
  ["top","Parte de arriba",["Camiseta","Chaqueta","Sudadera","Chaleco","Vestido","Camisa","Camiseta de tirantes","Polo","Abrigo largo","Jersey","Top corto","Chaqueta deportiva","Bata","Peto","Camiseta de rayas","Cazadora","Kimono","Uniforme de marinero","Traje","Sudadera abierta","Chaqueta de plumas","Camiseta de fútbol"],"r"],
  ["tc","Color principal","cl","r"],["ac","Color secundario","cl","r"],
  ["bot","Parte de abajo",["Pantalón","Pantalón corto","Falda","Pantalón pirata","Falda larga","Mallas","Pantalón ancho","Bermudas cargo","Vaqueros rotos","Falda plisada","Pantalón de chándal","Pantalón de traje"],"r"],
  ["bc","Color de abajo","cl","r"],["sh","Color del calzado","cl","r"],
  ["bp","Mochila",["No","Mochila","Bandolera","Riñonera","Mochila de explorador","Bolso","Mochila Poké Ball"],"a"],["bpc","Color de la mochila","cl","a"],
  ["shs","Calzado",["Zapatillas","Botas","Sandalias","Zapatos","Botas altas","Botas de montaña","Zapatillas altas","Botas de agua"],"r"],
  ["pat","Estampado",["Liso","Rayas","Estrella","Rayo","Corazón","Hoja","Llama","Gota","Número 1"],"r"],["pc","Color del estampado","cl","r"],
  ["nk","Cuello",["Nada","Bufanda","Collar","Pañuelo","Corbata","Lazo","Medalla de Prestigio","Collar de estrellas","Pajarita de murciélago"],"a"],["nkc","Color del cuello","cl","a"],
  ["glv","Guantes",["No","Sin dedos","Completos","Muñequeras"],"a"],["glc","Color de los guantes","cl","a"],
  ["blt","Cinturón",["No","Cinturón","Con Pokéballs"],"a"],["ear","Pendientes",["No","Aros","Bolitas","Estrellas"],"a"],
  ["mch","Mechas",["No","Puntas","Mechón","Reflejos"],"p"],["mcc","Color de las mechas","hair","p"],
  ["brw","Cejas",["Normales","Gruesas","Finas","Enfadadas","Preocupadas"],"c"],
  ["brd","Barba",["No","De tres días","Perilla","Bigote","Barba completa","Patillas"],"c"],
  ["mk","Maquillaje",["No","Pintalabios","Sombra de ojos","Rímel","Completo"],"c"],["mkc","Color del maquillaje","cl","c"],
  ["ha","Adorno del pelo",["Nada","Horquilla","Flor","Estrella","Lazo pequeño","Cinta en la frente"],"p"],
  ["sck","Calcetines",["Normales","Altos","De rayas","Medias"],"r"],["sckc","Color de los calcetines","cl","r"],
  ["wst","Prenda en la cintura",["Nada","Chaqueta atada","Jersey atado"],"r"],["wsc","Color de la prenda atada","cl","r"],
  ["wr","Muñeca",["Nada","Reloj","Pulsera","Brazalete","Pokéreloj"],"a"],["wrc","Color de la pulsera","cl","a"]
];
// prendas exclusivas de prestigio: [clave][opción] = nivel de prestigio necesario
const TRLOCK={hat:{25:1,26:2,27:3,28:4,29:5,30:6},nk:{6:1,7:3}};
// prendas de la Tienda de Evento: [clave, opción, precio, evento en el que se vende (null = todo el año)]
const TRSHOP=[["hat",31,25e6,"🎃 Halloween"],["nk",8,25e6,"🎃 Halloween"],["hat",32,25e6,"🎄 Navidad"],["hat",33,25e6,"💘 San Valentín"],["hat",34,25e6,"🌸 Primavera"],["hat",35,25e6,"☀️ Verano"],
  ["wr",4,5e7,null],["gl",7,1e8,null],["gl",6,2.5e8,null],["bp",6,5e8,null]];
const trShopIt=(k,v)=>TRSHOP.find(x=>x[0]===k&&x[1]===v)||null,trOwn=(k,v)=>!!(S.trOwn&&S.trOwn[k+":"+v]);
const trLk=(k,v)=>(TRLOCK[k]&&TRLOCK[k][v])||0,trOk=(k,v)=>trLk(k,v)<=(S.prs||0)&&(!trShopIt(k,v)||trOwn(k,v));
const trPrsItems=l=>{const r=[];Object.keys(TRLOCK).forEach(k=>{const o=TRO.find(x=>x[0]===k);Object.keys(TRLOCK[k]).forEach(v=>{if(TRLOCK[k][v]===l)r.push(o[2][v])})});return r};
const TRTABS=[["c","🙂 Cara y cuerpo"],["p","💇 Pelo"],["r","👕 Ropa"],["a","🎒 Accesorios"]];
const TRDEF={b:0,sk:1,fs:0,ey:0,ec:0,mo:0,bl:0,hs:1,hc:1,hat:1,hac:4,gl:0,top:1,tc:1,ac:9,bot:0,bc:6,sh:11,bp:1,bpc:3,shs:0,pat:0,pc:9,nk:0,nkc:0,glv:0,glc:11,blt:0,ear:0,mch:0,mcc:4,brw:0,brd:0,mk:0,mkc:0,ha:0,sck:0,sckc:9,wst:0,wsc:5,wr:0,wrc:2};
const trN=o=>Array.isArray(o[2])?o[2].length:TRP[o[2]].length;
const myLook=()=>Object.assign({},TRDEF,S.tr||{});
const trEnc=L=>TRO.map(o=>(+L[o[0]]||0).toString(36)).join("");
function trDec(s){const L=Object.assign({},TRDEF);if(typeof s!=="string")return L;TRO.forEach((o,i)=>{if(i>=s.length)return;const v=parseInt(s[i],36);if(v>=0&&v<trN(o))L[o[0]]=v});return L}
function trRandom(){const L={};TRO.forEach(o=>{const n=trN(o),r=Math.random();
  L[o[0]]=["gl","nk","glv","blt","ear","mch","bl","brd","mk","ha","wst","wr"].includes(o[0])&&r<.6?0:o[0]==="hs"&&Math.random()<.9&&false?0:Math.floor(Math.random()*n)});
  if(L.top===4&&[2,4].includes(L.bot))L.bot=0;if(Math.random()<.8)L.brd=0;if(Math.random()<.75)L.mk=0;if(L.b===1)L.brd=0;if(L.hs===22&&Math.random()<.7)L.hs=0;if(Math.random()<.35)L.hat=0;TRO.forEach(o=>{if(!trOk(o[0],L[o[0]]))L[o[0]]=0});return L}
// ---- color: sombreado con desplazamiento de tono (como el pixel art de los juegos) ----
function trHex(c){c=c.replace("#","");return[parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)]}
function trHsl(c){let[r,g,b]=trHex(c).map(v=>v/255);const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s,l]}
function trRgb(h,s,l){const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,9-k(n),1));return"#"+[f(0),f(8),f(4)].map(v=>Math.round(Math.max(0,Math.min(1,v))*255).toString(16).padStart(2,"0")).join("")}
const _tone={};
// k: 0 brillo, 1 base, 2 sombra, 3 sombra profunda, 4 contorno
function tone(c,k){
  if(k===1)return c;const key=c+k;if(_tone[key])return _tone[key];
  let[h,s,l]=trHsl(c);const tw=(t,a)=>{const d=((t-h+540)%360)-180;h=(h+d*a+360)%360};
  if(s<.07){h=235;s=k===0?s:.1}
  if(k===0){l=l+(1-l)*.34;tw(52,.12)}
  else if(k===2){const w=h<50||h>330;l=l*(w?.8:.76);tw(w?8:255,w?.25:.12);s=Math.min(1,w?s*.92:s*1.04+.04)}
  else if(k===3){const w=h<50||h>330;l=l*(w?.62:.58);tw(w?0:258,w?.35:.18);s=Math.min(1,w?s*.85:s*1.08+.06)}
  else{l=Math.min(l*.34,.22);tw(262,.14);s=Math.min(1,s*.85+.12)}
  return _tone[key]=trRgb(h,s,l);
}
const _trc={};
const TW=64,TH=96,TCX=31.5;
// view: "f" frente, "b" espaldas · pose: "i" quieto, "t" preparando el lanzamiento, "m" brazo arriba, "u" lanzando, "w" victoria, "l" derrota
function trURL(L,view,pose){
  const key=trEnc(L)+view+pose;if(_trc[key])return _trc[key];
  const px=new Array(TW*TH).fill(null),tg=new Array(TW*TH).fill(null);
  const put=(x,y,c,t)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<TW&&y<TH&&c){px[y*TW+x]=c;if(t!==undefined)tg[y*TW+x]=t}};
  const get=(x,y)=>x>=0&&y>=0&&x<TW&&y<TH?px[y*TW+x]:null,gtag=(x,y)=>x>=0&&y>=0&&x<TW&&y<TH?tg[y*TW+x]:null;
  const P=(k,i)=>TRP[k][i]!=null?TRP[k][i]:TRP[k][0];
  const sk=P("skin",L.sk),hc=P("hair",L.hc),tc=P("cl",L.tc),ac=P("cl",L.ac),bc=P("cl",L.bc),shc=P("cl",L.sh),hac=P("cl",L.hac),bpc=P("cl",L.bpc),
        pcc=P("cl",L.pc),nkc=P("cl",L.nkc),glc=P("cl",L.glc),mcc=P("hair",L.mcc),ink="#1c1424",white="#fbfaff";
  const back=view==="b",girl=L.b===1,cx=TCX;
  // forma rellena con sombreado por filas/columnas y contorno de color
  function shp(test,x0,y0,x1,y1,c,o){
    o=o||{};if(o.g){const G=o.g;for(let y=Math.max(0,Math.floor(y0));y<=Math.min(TH-1,Math.ceil(y1));y++)for(let x=Math.max(0,Math.floor(x0));x<=Math.min(TW-1,Math.ceil(x1));x++)if(test(x,y))G[y*TW+x]=1;return}
    x0=Math.max(0,Math.floor(x0));y0=Math.max(0,Math.floor(y0));x1=Math.min(TW-1,Math.ceil(x1));y1=Math.min(TH-1,Math.ceil(y1));
    const w=x1-x0+1,h=y1-y0+1;if(w<=0||h<=0)return;const M=new Uint8Array(w*h);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(test(x+x0,y+y0)&&(!o.clip||o.clip(x+x0,y+y0)))M[y*w+x]=1;
    const m=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&M[y*w+x];
    const Lr=new Int16Array(w*h),Rr=new Int16Array(w*h),Tr=new Int16Array(w*h),Br=new Int16Array(w*h);
    for(let y=0;y<h;y++){let r=0;for(let x=0;x<w;x++){r=m(x,y)?r+1:0;Lr[y*w+x]=r}r=0;for(let x=w-1;x>=0;x--){r=m(x,y)?r+1:0;Rr[y*w+x]=r}}
    for(let x=0;x<w;x++){let r=0;for(let y=0;y<h;y++){r=m(x,y)?r+1:0;Tr[y*w+x]=r}r=0;for(let y=h-1;y>=0;y--){r=m(x,y)?r+1:0;Br[y*w+x]=r}}
    const lx=o.lx==null?.3:o.lx,sx=o.sx==null?.72:o.sx;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!m(x,y))continue;
      const i=y*w+x,fl=(Lr[i]-1)/Math.max(1,Lr[i]+Rr[i]-2),ft=(Tr[i]-1)/Math.max(1,Tr[i]+Br[i]-2),rw=Lr[i]+Rr[i]-1,ch=Tr[i]+Br[i]-1;
      const edge=!m(x-1,y)||!m(x+1,y)||!m(x,y-1)||!m(x,y+1);let col;
      if(edge&&o.ol!==false)col=o.olc||tone(c,4);
      else if(o.flat)col=c;
      else{let k=1;const l1=Lr[i]-1,r1=Rr[i]-1,t1=Tr[i]-1,b1=Br[i]-1;
        if((r1<Math.max(1,rw*(1-sx))&&rw>3)||(!o.nob&&b1<Math.max(1,ch*.08)&&ch>7))k=2;
        if(k===2&&r1<Math.max(1,rw*.08)&&rw>9)k=3;
        if(k===1&&rw>3&&((l1<Math.max(1,rw*lx*.6)&&ft<(o.ly||.55))||(t1<1&&fl<.55&&ch>4)))k=0;
        if(o.noHi&&k===0)k=1;col=tone(c,k)}
      put(x+x0,y+y0,col,o.tag===undefined?null:o.tag)}
  }
  const gNew=()=>new Uint8Array(TW*TH),gDraw=(G,c,o)=>{let a=TW,b=TH,d=-1,e=-1;for(let i=0;i<G.length;i++)if(G[i]){const x=i%TW,y=(i-x)/TW;a=Math.min(a,x);b=Math.min(b,y);d=Math.max(d,x);e=Math.max(e,y)}if(d>=0)shp((x,y)=>G[y*TW+x],a,b,d,e,c,o)};
  const rect=(x,y,w,h,c,o)=>shp(()=>1,x,y,x+w-1,y+h-1,c,o);
  const ell=(ex,ey,rx,ry,c,o)=>shp((x,y)=>((x-ex)/rx)**2+((y-ey)/ry)**2<=1,ex-rx-1,ey-ry-1,ex+rx+1,ey+ry+1,c,o);
  // trazo con grosor variable (brazos, mechones, colas...)
  const seg=(x0,y0,x1,y1,w0,w1,c,o)=>{const dx=x1-x0,dy=y1-y0,L2=dx*dx+dy*dy||1,m=Math.max(w0,w1)/2+1;
    shp((x,y)=>{let t=((x-x0)*dx+(y-y0)*dy)/L2;t=Math.max(0,Math.min(1,t));const qx=x0+dx*t,qy=y0+dy*t,r=(w0+(w1-w0)*t)/2;return (x-qx)**2+(y-qy)**2<=r*r},Math.min(x0,x1)-m,Math.min(y0,y1)-m,Math.max(x0,x1)+m,Math.max(y0,y1)+m,c,o)};
  const poly=(pts,w,c,o)=>{for(let i=0;i<pts.length-1;i++)seg(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],w,w,c,o)};
  const map=(x,y,rows,cs,t)=>rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(cs[ch])put(x+i,y+j,cs[ch],t)}));
  const mapM=(x,y,rows,cs,t)=>rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(cs[ch])put(x+r.length-1-i,y+j,cs[ch],t)}));
  // ---- proporciones ----
  const lose=pose==="l",hy=lose?2:0,HY=20+hy,shw=girl?10:12,wsw=girl?7.4:9.4,hpw=girl?9.6:9.6;
  const halfAt=y=>{if(y<34)return 0;if(y<38)return shw-(38-y)*.9;if(y<50)return shw+(wsw-shw)*(y-38)/12;return wsw+(hpw-wsw)*Math.min(1,(y-50)/8)};
  const torsoT=(x,y)=>y>=34&&y<=59&&Math.abs(x-cx)<=halfAt(y);
  const lA=[cx-shw+1.6,37],rA=[cx+shw-1.6,37];
  const aw=girl?5.5:6.4;
  const ARM={i:{l:[[cx-shw-1.5,47],[cx-shw-.6,57]],r:[[cx+shw+1.5,47],[cx+shw+.6,57]]}};
  // posiciones de brazos segun pose y vista (r = brazo de lanzar)
  let armL=ARM.i.l,armR=ARM.i.r,ballAt=null,akimbo=false;
  if(pose==="t"){armR=back?[[cx+shw+6,30],[cx+shw+4,18]]:[[cx+shw+5,29],[cx+shw+3,17]];ballAt=[armR[1][0],armR[1][1]-2.5]}
  else if(pose==="m"){armR=[[cx+shw+3,25],[cx+shw-1,13]];ballAt=[armR[1][0]+.5,armR[1][1]-2.5]}
  else if(pose==="u"){armR=back?[[cx+shw+7,33],[cx+shw+14,28]]:[[cx+shw+6,40],[cx+shw+11,47]]}
  else if(pose==="f"){armR=back?[[cx+shw+1.6,41],[cx+shw+.8,43.5]]:[[cx+shw-1,46],[cx-1,51]]}
  else if(pose==="w"){armR=[[cx+shw+2.5,27],[cx+shw+1,16]];if(!back){armL=[[cx-shw-5,45],[cx-shw+1.5,53]];akimbo=true}}
  // ---- capas: lo que queda detras del cuerpo ----
  const isLongHair=[2,7,11,16,17,19,23,24,28].includes(L.hs);
  const hood=L.top===2||L.top===19;
  const longCoat=L.top===8||L.top===12;
  if(!back){
    if(L.bp===4){rect(cx-shw-2,31,2*shw+5,22,bpc,{lx:.2});rect(cx-shw-1,27,2*shw+3,5,ac,{lx:.2})}
    if(L.bp===1)rect(cx-shw-1,35,2*shw+3,15,bpc);
  }
  if(hood&&!back)ell(cx,33,9,4,tone(tc,2),{flat:true});
  // pelo largo por detras (se ve desde delante)
  const HBG=gNew();
  function hairBack(){
    const c=hc,o={g:HBG};
    if(L.hs===2){shp((x,y)=>((x-cx)/12)**2+((y-HY+1)/11)**2<=1||(y>=HY&&y<=HY+20&&Math.abs(x-cx)<=11.5-(y>HY+16?(y-HY-16)*1.2:0)),cx-13,HY-12,cx+13,HY+21,c,o)}
    if(L.hs===7||L.hs===19){shp((x,y)=>((x-cx)/11.5)**2+((y-HY)/10.5)**2<=1||(y>=HY&&y<=HY+12&&Math.abs(x-cx)<=11),cx-12,HY-11,cx+12,HY+12,c,o)}
    if(L.hs===11){shp((x,y)=>((x-cx)/11.6)**2+((y-HY)/10.8)**2<=1||(y>=HY&&y<=HY+10&&Math.abs(x-cx)<=11.3),cx-12,HY-11,cx+12,HY+11,c,o)}
    if(L.hs===16){shp((x,y)=>((x-cx)/12)**2+((y-HY+.5)/11)**2<=1&&y<=HY+8,cx-13,HY-12,cx+13,HY+9,c,o)}
    if(L.hs===17){for(let i=0;i<4;i++){const s=i<2?-1:1,k=i%2;seg(cx+s*(8+k*2),HY-2,cx+s*(10.5+k*1.5),HY+24-k*3,7,5,c,o)}ell(cx,HY-1,12,11,c,o)}
    if(L.hs===24){shp((x,y)=>((x-cx)/12)**2+((y-HY+1)/11)**2<=1||(y>=HY&&y<=HY+31&&Math.abs(x-cx)<=11.6),cx-13,HY-12,cx+13,HY+32,c,o)}
    if(L.hs===28){shp((x,y)=>((x-cx)/11.6)**2+((y-HY)/10.8)**2<=1||(y>=HY&&y<=HY+15&&Math.abs(x-cx)<=11.3-(y>HY+12?(y-HY-12):0)),cx-12,HY-11,cx+12,HY+16,c,o)}
    if(L.hs===26){for(let i=0;i<9;i++){const x=cx-11+i*2.75;seg(x,HY-4,x+(x-cx)*.18,HY+17-Math.abs(i-4)*.6,3,2.4,c,o)}ell(cx,HY-1,11.5,10.8,c,o)}
    if(L.hs===23){for(let i=0;i<7;i++){const a=-.9+i*.3,X=cx+Math.sin(a)*13,Y=HY+8+Math.cos(a)*10;seg(cx+Math.sin(a)*5,HY,X,Y+6,8,1.5,c,o)}ell(cx,HY-1,12.5,11.5,c,o)}
    if(L.hs===6){for(let i=0;i<9;i++){const a=i/9*Math.PI*2;ell(cx+Math.cos(a)*9,HY-1+Math.sin(a)*9.5,4.6,4.6,c,o)}}
    if(L.hs===9){for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ell(cx+Math.cos(a)*12,HY-3+Math.sin(a)*11,5,5,c,o)}ell(cx,HY-3,13.5,13,c,o)}
    if(L.hs===3){if(back)seg(cx,HY+1,cx+1,HY+15,6,3,c,o);else seg(cx+9,HY-3,cx+13,HY+10,5.5,2.5,c,o)}
    if(L.hs===20){if(back){seg(cx,HY-7,cx+2,HY+12,6,2.5,c,o)}else seg(cx+5,HY-10,cx+14,HY+6,6,2.5,c,o)}
    if(L.hs===4){seg(cx-11,HY-4,cx-14,HY+13,6,3,c,o);seg(cx+11,HY-4,cx+14,HY+13,6,3,c,o)}
    if(L.hs===12){if(back){for(let i=0;i<5;i++)ell(cx,HY+3+i*3.6,2.8-i*.2,2.2,c,o)}else{for(let i=0;i<5;i++)ell(cx+10+i*.4,HY+1+i*3.5,2.7-i*.2,2.1,c,o)}}
    if(L.hs===21){for(const s of[-1,1])for(let i=0;i<5;i++)ell(cx+s*(10.5+i*.3),HY+1+i*3.6,2.6-i*.18,2.1,c,o)}
  }
  hairBack();gDraw(HBG,hc,{tag:"hair",sx:.7,lx:.3});
  // ---- piernas ----
  const legX=[cx-5,cx+5],legW=girl?3.4:3.9;
  const legT=(lx,y0,y1,w,fl)=>(x,y)=>y>=y0&&y<=y1&&Math.abs(x-lx)<=w+(fl||0)*(y-y0)/Math.max(1,y1-y0)+(y<62?(62-y)*.12:0)-(y>y1-6?(y-(y1-6))*.12:0)-(y>70&&y<74&&!fl?.4:0);
  const skinLegs=y0=>legX.forEach(lx=>shp(legT(lx,y0,88,legW-.4),lx-6,y0,lx+6,88,sk,{tag:"leg"}));
  const dress=L.top===4;
  const pants=(yEnd,w,fl,c)=>{const G=gNew();legX.forEach(lx=>shp(legT(lx,57,yEnd,w,fl),lx-8,57,lx+8,yEnd,c,{g:G}));shp((x,y)=>y>=56&&y<=61&&Math.abs(x-cx)<=hpw+.4,cx-hpw-1,56,cx+hpw+1,61,c,{g:G});gDraw(G,c,{tag:"bot",sx:.74})};
  let lateSk=null;
  if(dress)skinLegs(66);
  else{
    const bt=L.bot;
    if(bt===0)pants(88,legW+.3,0,bc);
    else if(bt===1){skinLegs(66);pants(68,legW+.8,.6,bc)}
    else if(bt===2){skinLegs(64);shp((x,y)=>{const k=(y-55)/13;return y>=55&&y<=68&&Math.abs(x-cx)<=hpw+.5+k*4.5},cx-16,55,cx+16,68,bc,{tag:"bot"});for(let x=Math.round(cx-12);x<=cx+12;x+=3)for(let y=60;y<=67;y++)if(get(x,y)&&gtag(x,y)==="bot")put(x,y,tone(bc,2))}
    else if(bt===3){skinLegs(76);pants(78,legW+.4,.4,bc);legX.forEach(lx=>{for(let x=lx-5;x<=lx+5;x++)if(gtag(x,77)==="bot")put(x,77,tone(bc,0))})}
    else if(bt===4){skinLegs(80);lateSk=()=>shp((x,y)=>{const k=(y-55)/27;return y>=55&&y<=82&&Math.abs(x-cx)<=hpw+.4+k*4},cx-15,55,cx+15,82,bc,{tag:"bot"})}
    else if(bt===5)pants(88,legW-.2,0,bc);
    else if(bt===6)pants(88,legW+.6,2.4,bc);
    else if(bt===7){skinLegs(68);pants(71,legW+1,.8,bc);legX.forEach(lx=>rect(lx+(lx<cx?-5:1),63,4,5,bc,{tag:"bot"}))}
    else if(bt===9){skinLegs(63);shp((x,y)=>{const k=(y-55)/11;return y>=55&&y<=66&&Math.abs(x-cx)<=hpw+.5+k*4},cx-15,55,cx+15,66,bc,{tag:"bot"});for(let x=Math.round(cx-14);x<=cx+14;x+=2)for(let y=58;y<=65;y++)if(get(x,y)&&gtag(x,y)==="bot")put(x,y,tone(bc,(x/2)%2?2:0))}
    else if(bt===10){pants(88,legW+.7,.9,bc);legX.forEach((lx,i)=>{const sx=Math.round(lx+(i?1:-1)*(legW-.3));for(let y=58;y<=86;y++)if(gtag(sx,y)==="bot")put(sx,y,ac)})}
    else if(bt===11){pants(88,legW+.5,.3,bc);legX.forEach(l0=>{const lx=Math.round(l0);for(let y=60;y<=86;y++)if(gtag(lx,y)==="bot")put(lx,y,tone(bc,0))})}
    else{pants(88,legW+.3,0,bc);legX.forEach((lx,i)=>{ell(lx+(i?1:-1),72,1.8,1.2,sk,{ol:false,flat:true});for(let x=lx-2;x<=lx+1;x++)put(x+(i?1:-1),71,white);ell(lx,63,.9,.6,tone(bc,0),{ol:false,flat:true})})}
    if([0,3,5,6,8,10,11].includes(bt)&&!back)for(let y=58;y<=64;y++)put(cx,y,tone(bc,3));
  }
  // ---- calzado ----
  // ---- calcetines (solo se ven donde hay pierna al aire) ----
  {const sc=P("cl",L.sckc),st2=L.sck;if(!(L.shs===2&&st2===0)){const y0=st2===0?84:st2===3?50:72,lg=(x,y)=>{const t=gtag(x,y);return t==="leg"||t==="sock"};
    legX.forEach(l0=>{const lx=Math.round(l0);for(let y=y0;y<=89;y++)for(let x=lx-6;x<=lx+6;x++){if(!lg(x,y))continue;
      const edge=!lg(x-1,y)||!lg(x+1,y);const c=st2===2&&((y>>1)%2)?ac:sc;
      put(x,y,edge?tone(c,4):x>lx+1?tone(c,2):x<lx-1?tone(c,0):c,"sock")}
      if(st2!==3)for(let x=lx-5;x<=lx+5;x++)if(gtag(x,y0)==="sock"&&lg(x-1,y0)&&lg(x+1,y0))put(x,y0,tone(sc,0),"sock")})}}
  const shoe=(lx,s)=>{
    const st=L.shs;
    if(st===6){shp((x,y)=>y>=79&&y<=89&&Math.abs(x-lx)<=legW+1,lx-6,79,lx+6,89,shc);ell(lx+s*.9,90,legW+2,2.6,shc);for(let x=lx-legW-1.5;x<=lx+legW+2.5;x++){put(x+s*.9,92.4,white);put(x+s*.9,91.6,white)}rect(Math.round(lx-legW-.5),79,Math.round(2*legW+2),2,white,{ol:false,flat:true});put(lx,83,white);put(lx,85,white);put(lx-1+s*1.5,90,white);put(lx+s*1.5,90,white)}
    else if(st===1||st===4||st===5||st===7){const y0={1:80,4:72,5:78,7:70}[st];shp((x,y)=>y>=y0&&y<=89&&Math.abs(x-lx)<=legW+.8+(st===7?.6:0),lx-6,y0,lx+6,89,shc);ell(lx+s*.8,90.4,legW+1.6,2.4,shc);rect(Math.round(lx-legW-1),y0,Math.round(2*legW+3),2,tone(shc,0),{ol:false,flat:true});for(let x=lx-legW-1;x<=lx+legW+2;x++)put(x+s*.8,92.5,tone(shc,3));
      if(st===5){for(let y=y0+3;y<=87;y+=2){put(lx-1,y,"#f2e6c8");put(lx+1,y,"#f2e6c8")}for(let x=lx-legW-1;x<=lx+legW+2;x++){put(x+s*.8,92.5,"#3a2618");put(x+s*.8,91.6,"#5a3a22")}}
      if(st===7){for(let y=y0+3;y<=88;y++)put(lx-legW+.6,y,tone(shc,0));put(lx-legW+.6,y0+4,"#ffffff");put(lx-legW+.6,y0+5,"#ffffff")}}
    else if(st===2){ell(lx+s*.6,90.6,legW+1.2,1.9,sk);for(let x=lx-legW;x<=lx+legW;x++){put(x+s*.6,92,tone(shc,2));put(x+s*.6,89,shc)}put(lx+s*.6,90,shc)}
    else if(st===3){ell(lx+s*.8,90.2,legW+1.4,2.3,shc,{lx:.5});put(lx-1+s,89,white)}
    else{ell(lx+s*.9,89.8,legW+1.9,2.8,shc);for(let x=lx-legW-1.5;x<=lx+legW+2.5;x++)put(x+s*.9,92.4,white);put(lx-1+s*.9,88,white);put(lx+s*.9,88,white);put(lx+1+s*.9,88,white)}
  };
  shoe(legX[0],back?.2:-1);shoe(legX[1],back?-.2:1);if(lateSk)lateSk();
  // ---- torso y ropa ----
  const sleeveLong=[1,2,5,8,9,11,12,15,16,17,18,19,20].includes(L.top),noSleeve=L.top===6;
  const topTag={tag:"top"};
  if(L.top===10){shp(torsoT,cx-14,34,cx+14,59,sk,{tag:"belly"});shp((x,y)=>torsoT(x,y)&&y<=47,cx-14,34,cx+14,48,tc,topTag)}
  else if(L.top===6){shp(torsoT,cx-14,34,cx+14,59,sk);shp((x,y)=>torsoT(x,y)&&Math.abs(x-cx)<=halfAt(y)-(y<40?3.2:0),cx-14,35,cx+14,59,tc,topTag);if(!back){for(let y=34;y<=36;y++){put(cx-6,y,tc);put(cx+5,y,tc)}}}
  else if(L.top===3||L.top===13){shp(torsoT,cx-14,34,cx+14,59,ac,topTag)}
  else{const G=gNew();shp(torsoT,cx-14,34,cx+14,59,tc,{g:G});
    if(dress)shp((x,y)=>{const k=(y-56)/12;return y>=55&&y<=68&&Math.abs(x-cx)<=hpw+k*5.5},cx-17,55,cx+17,68,tc,{g:G});
    if(longCoat)shp((x,y)=>{const k=(y-55)/20;return y>=55&&y<=76&&Math.abs(x-cx)<=hpw+1+k*3&&(back||Math.abs(x-cx)>=1+k*3.5)},cx-15,55,cx+15,76,tc,{g:G});
    gDraw(G,tc,{tag:"top",sx:.78})}
  if(dress)rect(cx-hpw,50,2*hpw+1,3,ac,{tag:"top"});
  // detalles de la ropa (frente)
  const T=L.top;
  if(!back){
    const nl=tone(tc,3);
    if(T===0||T===14||T===9){for(let x=cx-3;x<=cx+3;x++)put(x,34,nl);put(cx-3,35,nl);put(cx+3,35,nl);for(let x=cx-2;x<=cx+2;x++)put(x,35,sk)}
    if(T===17){shp((x,y)=>{const d=Math.abs(x-cx),e=(45-y)*.85;return y>=34&&y<=45&&d<=e+1.5&&d>=e-2.2},cx-11,34,cx+11,45,ac,{tag:"top"});for(let y=35;y<=44;y++){const e=(45-y)*.85;put(cx-e-.6,y,"#fbfaff");put(cx+e+.6,y,"#fbfaff")}map(Math.round(cx-3),43,["rr.rr","rrrrr",".r.r.","r...r"],{r:pcc})}
    if(T===18){shp((x,y)=>y>=34&&y<=47&&Math.abs(x-cx)<=(47-y)*.42+.6,cx-7,34,cx+7,47,"#f4f2ff",{tag:"top",nob:1});seg(cx,36,cx,49,2.2,3.2,ac);put(cx,36,tone(ac,3));for(let y=34;y<=47;y++){const e=(47-y)*.42+1.2;put(cx-e,y,tone(tc,4));put(cx+e,y,tone(tc,4))}put(cx-1,51,tone(tc,4));put(cx-1,55,tone(tc,4))}
    if(T===20){for(let y=38;y<=58;y+=4)for(let x=cx-15;x<=cx+15;x++)if(gtag(Math.round(x),y)==="top")put(x,y,tone(tc,2));for(let y=34;y<58;y++)put(cx,y,tone(tc,3));rect(cx-5,32,11,3,tc,{tag:"top"})}
    if(T===21){for(let x=cx-14;x<=cx+14;x+=4)for(let y=36;y<=59;y++)if(gtag(Math.round(x),y)==="top")put(x,y,ac,"top");map(Math.round(cx-3),34,["k.....k",".k...k.","..k.k..","...k..."],{k:ac});rect(cx+3,39,3,4,"#f2c84a",{ol:false,flat:true})}
    if(T===1||T===15||T===19){rect(cx-3,34,7,24,ac,{tag:"top"});for(let y=35;y<57;y++){put(cx-3.5,y,tone(tc,4));put(cx+3.5,y,tone(tc,4))}
      if(T===15){ell(cx-6,35,4,2.6,ac);ell(cx+6,35,4,2.6,ac)}else if(T===19){shp((x,y)=>((x-cx)/9)**2+((y-34)/3)**2<=1&&y>=33,cx-10,32,cx+10,37,tc,{tag:"hood"});for(let y=37;y<=44;y++){put(cx-2,y,"#fbfaff");put(cx+2,y,"#fbfaff")}}else{map(Math.round(cx-6),34,["kk..","k..."," k.."],{k:tone(tc,3)});mapM(Math.round(cx+3),34,["kk..","k..."," k.."],{k:tone(tc,3)})}
      if(L.pat)for(let y=34;y<60;y++)for(let x=cx-2;x<=cx+2;x++)if(gtag(Math.round(x),y)==="top")tg[y*TW+Math.round(x)]="topc"}
    if(T===2){shp((x,y)=>((x-cx)/8.5)**2+((y-34)/3.2)**2<=1&&y>=33,cx-9,32,cx+9,37,ac,{tag:"hood"});rect(cx-6,48,13,6,tone(tc,2),{lx:-1});put(cx-2,37,white);put(cx-2,38,white);put(cx-2,39,white);put(cx+2,37,white);put(cx+2,38,white);put(cx+2,39,white)}
    if(T===3){shp((x,y)=>torsoT(x,y)&&Math.abs(x-cx)>=2.2,cx-14,34,cx+14,59,tc,{tag:"top"});for(let y=40;y<56;y+=4)put(cx-3.6,y,tone(tc,0))}
    if(T===4){for(let x=cx-3;x<=cx+3;x++)put(x,34,tone(tc,3))}
    if(T===5||T===7){map(Math.round(cx-4),34,["aaa..","aaaa.",".aa.."],{a:ac});mapM(Math.round(cx),34,["aaa..","aaaa.",".aa.."],{a:ac});const by=T===5?[38,42,46,50,54]:[37,40];by.forEach(y=>put(cx,y,tone(tc,3)))}
    if(T===8||T===12){const lc=T===12?white:ac;rect(cx-2,34,5,22,T===12?ac:tone(tc,2),{tag:"top"});shp((x,y)=>y>=34&&y<=46&&Math.abs(x-cx)>=2&&Math.abs(x-cx)<=2+(46-y)*.35+1.5,cx-9,34,cx+9,46,T===12?tc:lc);if(T===12){rect(cx-9,50,4,4,tc);rect(cx+6,50,4,4,tc)}}
    if(T===9){for(let x=cx-wsw;x<=cx+wsw;x++)for(let y=55;y<=58;y++)if(gtag(Math.round(x),y)==="top"&&(Math.round(x)%2===0))put(x,y,tone(tc,2))}
    if(T===10){}
    if(T===11){for(let y=34;y<58;y++)put(cx,y,tone(tc,3));put(cx,35,white);rect(cx-4,33,9,2,ac)}
    if(T===13){shp((x,y)=>y>=44&&y<=59&&Math.abs(x-cx)<=Math.min(halfAt(y),6.5),cx-8,44,cx+8,59,tc,{tag:"top"});seg(cx-5,36,cx-5,45,2,2,tc);seg(cx+5,36,cx+5,45,2,2,tc);put(cx-5,45,ink);put(cx+5,45,ink);rect(cx-2,48,5,3,tone(tc,2),{ol:false,flat:true})}
    if(T===14){for(let y=37;y<=58;y+=3)for(let x=cx-14;x<=cx+14;x++)if(gtag(Math.round(x),y)==="top")put(x,y,ac,"top")}
    if(T===16){for(let i=0;i<14;i++){put(cx-5+i*.6,34+i,ac);put(cx-4+i*.6,34+i,ac);}rect(cx-wsw,49,2*wsw+1,4,ac);seg(cx+3,51,cx+5,57,2,1.5,ac)}
  }else{
    if(T===2||T===19)shp((x,y)=>((x-cx)/7.5)**2+((y-36)/4.8)**2<=1,cx-8,30,cx+8,41,T===19?tc:ac,{tag:"hood"});
    if(T===17){rect(cx-9,33,19,11,ac,{tag:"top"});for(let x=cx-8;x<=cx+8;x++)put(x,41,"#fbfaff");for(let y=34;y<=41;y++){put(cx-8,y,"#fbfaff");put(cx+8,y,"#fbfaff")}}
    if(T===18)for(let y=36;y<59;y++)put(cx,y,tone(tc,2));
    if(T===20){for(let y=38;y<=58;y+=4)for(let x=cx-15;x<=cx+15;x++)if(gtag(Math.round(x),y)==="top")put(x,y,tone(tc,2));rect(cx-5,32,11,3,tc,{tag:"top"})}
    if(T===21){for(let x=cx-14;x<=cx+14;x+=4)for(let y=36;y<=59;y++)if(gtag(Math.round(x),y)==="top")put(x,y,ac,"top");map(Math.round(cx-4),40,["ppp.ppp","..p.p.p","ppp.p.p","p...p.p","ppp.ppp"],{p:pcc===tc?"#fbfaff":pcc})}
    if(T===3){shp((x,y)=>torsoT(x,y),cx-14,34,cx+14,59,tc,{tag:"top"})}
    if(T===5||T===7||T===11)rect(cx-5,33,11,2,T===11?ac:ac);
    if(T===14){for(let y=37;y<=58;y+=3)for(let x=cx-14;x<=cx+14;x++)if(gtag(Math.round(x),y)==="top")put(x,y,ac,"top")}
    if(T===16)rect(cx-wsw,49,2*wsw+1,4,ac);
    if(T===13){seg(cx-5,35,cx+5,47,2,2,tc);seg(cx+5,35,cx-5,47,2,2,tc)}
    if(T===12||T===8){for(let y=58;y<76;y++)put(cx,y,tone(tc,3))}
  }
  // estampado en el pecho
  if(!back&&L.pat){
    const pt=L.pat,pcs={p:pcc,d:tone(pcc,3)},ok=(x,y)=>["top","topc"].includes(gtag(x,y));
    if(pt===1){for(let y=36;y<=58;y+=4)for(let x=cx-14;x<=cx+14;x++){const X=Math.round(x);if(gtag(X,y)==="top"){put(X,y,pcc,"top")}}}
    else{const I={2:["..p..",".ppp.","ppppp",".ppp.","p...p"],3:["...pp","..pp.",".ppp.","..pp.",".pp..","pp..."],4:[".p.p.","ppppp","ppppp",".ppp.","..p.."],5:["...pp","..ppp",".ppp.","ppp..","p...."],6:["..p..",".pp..",".ppp.","ppppp",".ppp."],7:["..p..",".ppp.","ppppp","ppppp",".ppp."],8:[".pp.","ppp.",".pp.",".pp.","pppp"]}[pt];
      if(I){const X0=Math.round(cx-2+(T===1||T===15?5:0)),Y0=40;I.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch==="p"&&ok(X0+i,Y0+j))put(X0+i,Y0+j,pcc)}))}}
  }
  // ---- cinturon y cuello ----
  if(L.blt&&!dress&&T!==10){for(let x=cx-hpw;x<=cx+hpw;x++){put(x,56,tone(shc===ink?"#3a2a20":"#4a3426",1));put(x,57,"#3a2618")}
    if(!back){rect(cx-1.5,55,4,4,"#f2d27a",{ol:"#8a6a22",olc:"#8a6a22"});}
    if(L.blt===2){const bx=back?[cx-6,cx-1,cx+4]:[cx-8,cx+5];bx.forEach(x=>map(Math.round(x),55,[".rr.","rrrr","kwwk",".ww."],{r:"#e63950",k:ink,w:white}))}}
  // ---- mochilas (correas por delante, mochila por detras) ----
  if(!back&&L.bp===6){seg(cx-6,35,cx-7,50,2.6,2.6,"#2b2b34",{tag:"strap"});seg(cx+6,35,cx+7,50,2.6,2.6,"#2b2b34",{tag:"strap"})}
  if(back&&L.bp===6){const y0=34,r=10;shp((x,y)=>((x-cx)/r)**2+((y-(y0+r))/r)**2<=1,cx-r-1,y0-1,cx+r+1,y0+2*r+1,"#ffffff",{lx:.3});shp((x,y)=>((x-cx)/r)**2+((y-(y0+r))/r)**2<=1&&y<y0+r-1,cx-r-1,y0-1,cx+r+1,y0+r,"#e63950",{lx:.3});
    for(let x=cx-r;x<=cx+r;x++){put(x,y0+r-1,"#2b2b34");put(x,y0+r,"#2b2b34")}ell(cx,y0+r,3,3,"#ffffff",{olc:"#2b2b34"})}
  if(!back&&(L.bp===1||L.bp===4)){seg(cx-6,35,cx-7,50,2.6,2.6,tone(bpc,2),{tag:"strap"});seg(cx+6,35,cx+7,50,2.6,2.6,tone(bpc,2),{tag:"strap"})}
  if(L.bp===2){seg(back?cx+9:cx-8,35,back?cx-8:cx+8,54,2.4,2.4,tone(bpc,2));rect(back?cx-12:cx+5,52,8,7,bpc);rect(back?cx-12:cx+5,52,8,2,tone(bpc,2),{ol:false,flat:true})}
  if(L.bp===3){rect(cx-6,54,13,5,bpc);put(cx,56,"#f2d27a")}
  if(back&&(L.bp===1||L.bp===4)){
    const big=L.bp===4,y0=big?33:36,h=big?24:18;
    shp((x,y)=>y>=y0&&y<=y0+h&&Math.abs(x-cx)<=(big?9:8)-((y===y0||y===y0+h)?1:0),cx-10,y0,cx+10,y0+h,bpc);
    rect(cx-6,y0+h-9,13,7,tone(bpc,2),{lx:.2});rect(cx-(big?9:8),y0,(big?19:17),4,tone(bpc,0),{ol:false,flat:true});
    put(cx,y0+h-6,"#f2d27a");if(big){seg(cx-10,y0-2,cx+10,y0-2,5,5,ac);for(let x=cx-9;x<=cx+9;x+=4)put(x,y0-2,tone(ac,3))}
  }
  // ---- prenda atada a la cintura ----
  if(L.wst&&!dress){const wc=P("cl",L.wsc);
    if(back){shp((x,y)=>y>=55&&y<=70&&Math.abs(x-cx)<=hpw+1.5+(y-55)*.25,cx-15,55,cx+15,70,wc,{tag:"wst"});for(let x=cx-hpw;x<=cx+hpw;x++){put(x,55,tone(wc,2));put(x,56,tone(wc,2))}if(L.wst===2)for(let x=cx-12;x<=cx+12;x+=2)put(x,69,tone(wc,0))}
    else{shp((x,y)=>y>=56&&y<=66&&Math.abs(x-cx)>=hpw-1&&Math.abs(x-cx)<=hpw+1.8+(y-56)*.2,cx-15,56,cx+15,66,tone(wc,2));for(let x=cx-hpw-1;x<=cx+hpw+1;x++){put(x,54,tone(wc,0));put(x,55,wc);put(x,56,tone(wc,2))}seg(cx-1,58,cx-4,68,3.4,2.8,wc);seg(cx+1,58,cx+3.5,67,3.4,2.8,tone(wc,2));ell(cx,57,2.8,2.3,wc)}}
  // ---- brazos ----
  const sleeveC=T===3?ac:T===13?ac:tc;
  function arm(sh,el,hd,side){
    const full=sleeveLong,bare=noSleeve;
    seg(sh[0],sh[1],el[0],el[1],aw,aw-.4,full?sleeveC:sk,{tag:"arm"});
    seg(el[0],el[1],hd[0],hd[1],aw-.4,aw-1,full?sleeveC:sk,{tag:"arm"});
    if(!full&&!bare){const k=.55;seg(sh[0],sh[1],sh[0]+(el[0]-sh[0])*k,sh[1]+(el[1]-sh[1])*k,aw+.9,aw+.6,sleeveC,{tag:"top"})}
    if(T===11&&full){const dx=hd[0]-sh[0],dy=hd[1]-sh[1];for(let i=0;i<=20;i++){put(sh[0]+dx*i/20+(side<0?-1:1)*.6,sh[1]+dy*i/20,ac)}}
    if(T===9&&full||T===2){seg(hd[0]-(hd[0]-el[0])*.18,hd[1]-(hd[1]-el[1])*.18,hd[0],hd[1],aw-.4,aw-.4,tone(sleeveC,2))}
    const hcx=hd[0]+(hd[0]-el[0])*.22,hcy=hd[1]+(hd[1]-el[1])*.22;
    const gc=L.glv===2?glc:sk;ell(hcx,hcy,2.9,3.1,gc,{tag:"hand"});
    if(L.glv===1){ell(hcx,hcy-.3,2.9,1.9,glc,{tag:"hand"})}
    if(L.glv===3){seg(hd[0]-(hd[0]-el[0])*.12,hd[1]-(hd[1]-el[1])*.12,hd[0],hd[1],aw,aw,glc)}
    if(L.wr&&side<0){const wx=hd[0]-(hd[0]-el[0])*.08,wy=hd[1]-(hd[1]-el[1])*.08,wc=P("cl",L.wrc);
      if(L.wr===1){rect(wx-2,wy-1.4,5,3,"#3a3a46",{ol:false,flat:true});if(!back){put(wx,wy,"#e8f6ff");put(wx+1,wy,"#bfe6ff");put(wx,wy-1,wc)}}
      else if(L.wr===2){for(let k=-2;k<=2;k++)put(wx+k,wy+(k%2?0:1),k%2?wc:tone(wc,0))}
      else if(L.wr===4){rect(wx-2.5,wy-2,6,4,"#e63950",{olc:"#7a1020"});if(!back){rect(wx-1.5,wy-1,4,2,"#bfffcf",{ol:false,flat:true});put(wx,wy,"#2a7a3a")}}
      else{rect(wx-2.5,wy-1.5,6,3,wc,{olc:tone(wc,4)});put(wx,wy,"#ffffff");put(wx+1,wy,"#7fe0ff")}}
    if(L.bp===5&&side<0&&!back){seg(hcx,hcy+1,hcx-1,hcy+5,1.2,1.2,tone(bpc,3));rect(hcx-4,hcy+4,7,6,bpc)}
  }
  const behind=back&&(pose==="u"||pose==="f");
  if(!behind)arm(lA,armL[0],armL[1],-1);
  if(akimbo){}
  arm(rA,armR[0],armR[1],1);
  if(behind)arm(lA,armL[0],armL[1],-1);
  if(L.nk===1){/* bufanda (se dibuja tras la cabeza) */}
  // ---- cabeza ----
  rect(cx-3,29+hy,7,7-hy,sk,{tag:"neck"});for(let x=cx-3;x<=cx+3;x++)put(x,30+hy,tone(sk,2));
  const RX=L.fs===1?8.9:9.6,RYt=L.fs===1?11:10.3,RYb=L.fs===1?11.4:10.9;
  const headT=(x,y)=>{const dx=x-cx,dy=y-HY;if(L.fs===2)return Math.pow(Math.abs(dx)/9.4,3.2)+Math.pow(Math.abs(dy)/(dy<0?10.3:10.6),3.2)<=1;
    const rx=dy>0?RX*(1-dy/(RYb*3.1)):RX,ry=dy<0?RYt:RYb;return (dx/rx)**2+(dy/ry)**2<=1};
  if(!back){ell(cx-RX-.4,HY+2,1.8,2.5,sk,{flat:true,olc:tone(sk,4)});ell(cx+RX+.4,HY+2,1.8,2.5,sk,{flat:true,olc:tone(sk,4)});put(cx-RX-.4,HY+2,tone(sk,2));put(cx+RX+.4,HY+2,tone(sk,2))}
  shp(headT,cx-11,HY-12,cx+11,HY+12,sk,{tag:"face",lx:.3,sx:.8,ly:.45,nob:1});
  // ---- cara ----
  if(!back){
    const ec=P("eye",L.ec),E={k:ink,i:ec,d:tone(ec,3),h:"#ffffff",w:"#ffffff",l:tone(sk,3)},EY=HY+1;
    const eyes=[["kkk","dhi","dii","kik"],["kkkk","dhhi","diii","diid",".kk."],["kkk","dik"],[".k.","k.k"],["kkk","hih","ddd","khk"],["...","kkk"],["kkkk",".dhk","..k."],["kkkk","kdhi",".dii",".kk."]][L.ey]||[];
    let lex=Math.round(cx-6.5),rex=Math.round(cx+3.5),ey=EY;if(L.ey===1){lex--;ey--}if(L.ey===2||L.ey===3)ey++;if(L.ey===5)ey+=1;
    if(lose){map(lex,ey+1,[".k.","k.k"].reverse(),E);map(rex,ey+1,[".k.","k.k"].reverse(),E)}
    else if(L.ey===6||L.ey===7){mapM(lex-(L.ey===6?1:1),ey,eyes,E);map(rex,ey,eyes,E)}
    else{map(lex,ey,eyes,E);map(rex,ey,eyes,E)}
    if(L.mk===2||L.mk===4){const mc=tone(P("cl",L.mkc),0);for(const x0 of[lex,rex])for(let k=-1;k<4;k++)if(gtag(x0+k,ey-1)==="face")put(x0+k,ey-1,mc)}
    if(L.mk===3||L.mk===4){put(lex-1,ey,ink);put(lex-1,ey-1,ink);put(rex+(eyes[0]||"kkk").length,ey,ink);put(rex+(eyes[0]||"kkk").length,ey-1,ink)}
    // cejas
    const bc2=tone(hc,3),bw=L.brw,by=EY-2-(L.ey===1?1:0);
    const brow=(x0,dir)=>{const pts=bw===3?[[0,0],[1,0],[2,1]]:bw===4?[[0,1],[1,0],[2,0]]:[[0,0],[1,0],[2,0]];pts.forEach(p=>{const X=dir>0?x0+p[0]:x0+2-p[0];put(X,by+p[1],bc2);if(bw===1)put(X,by+p[1]-1,bc2)});if(bw===0||bw===1)put(dir>0?x0+3:x0-1,by,bc2)};
    if(L.ey!==5&&!(L.hs===19)&&bw!==2)brow(lex,-1),brow(rex+ (L.ey===1?1:0),1);
    if(bw===2){put(lex+1,by,bc2);put(lex+2,by,bc2);put(rex,by,bc2);put(rex+1,by,bc2)}
    put(cx,HY+5,tone(sk,2));put(cx+1,HY+5,tone(sk,2));
    const mk=(L.mk===1||L.mk===4)?tone(P("cl",L.mkc),2):"#7a2834",pk="#ff7d93",my=HY+7;
    const MO=lose?[".kk.","k..k"]:[["k..k",".kk."],["kkk"],["kkkk","kppk",".kk."],["...k","kkk."],["kkkk",".pp."],[".k.","k.k",".k."],["kkkk",".w.."]][L.mo];
    map(Math.round(cx-1.5)-(MO[0].length>3?0:0),my,MO,{k:mk,p:pk,w:"#fff"});
    if(L.bl===1){[[cx-7,HY+5],[cx-6,HY+5],[cx+6,HY+5],[cx+7,HY+5]].forEach(q=>put(q[0],q[1],"#ff8fb0"))}
    if(L.bl===2){const f=tone(sk,3);[[cx-7,HY+4],[cx-6,HY+5],[cx-5,HY+4],[cx+5,HY+4],[cx+6,HY+5],[cx+7,HY+4]].forEach(q=>put(q[0],q[1],f))}
    if(L.bl===3){map(Math.round(cx+4),HY+4,["bbbb","bkkb"],{b:"#f5d7a8",k:"#d9b27a"})}
    if(L.bl===4)put(cx+3,HY+8,tone(sk,4));
    if(L.brd){const bd=tone(hc,1),bd2=tone(hc,2),fc=(x,y)=>gtag(x,y)==="face";
      if(L.brd===1){for(let y=HY+5;y<=HY+11;y++)for(let x=cx-10;x<=cx+10;x++){const X=Math.round(x);if(fc(X,y)&&(X+y)%2===0&&(y>HY+6||Math.abs(X-cx)>4)&&!(y>=my-1&&y<=my+2&&Math.abs(X-cx-.5)<3))put(X,y,tone(sk,3))}}
      if(L.brd===2)map(Math.round(cx-1.5),my+3,["bbbb",".bb."],{b:bd});
      if(L.brd===3)map(Math.round(cx-3),my-1,[".bbbbbb.","bb....bb"],{b:bd});
      if(L.brd===4){for(let y=HY+3;y<=HY+13;y++)for(let x=cx-11;x<=cx+11;x++){const X=Math.round(x);if(!fc(X,y))continue;if(y>=my-1&&y<=my+2&&Math.abs(X-cx-.5)<3.5)continue;if(y>=HY+6||Math.abs(X-cx)>=RX-2.5)put(X,y,y>HY+9?bd2:bd)}}
      if(L.brd===5){for(let y=HY-1;y<=HY+6;y++){put(cx-RX+1,y,bd);put(cx+RX-1,y,bd);put(cx-RX+2,y,bd);put(cx+RX-2,y,bd)}}}
    if(lose){put(cx+8,HY-3,"#9ad7ff");put(cx+8,HY-2,"#9ad7ff");put(cx+7,HY-1,"#9ad7ff")}
    // pendientes
    if(L.ear){const ey2=HY+5,c="#f2c84a";[[cx-RX-.5,ey2],[cx+RX+.5,ey2]].forEach(q=>{if(L.ear===1){put(q[0],q[1]+1,c);put(q[0]-.6,q[1]+2,c);put(q[0]+.6,q[1]+2,c);put(q[0],q[1]+3,c)}else if(L.ear===2){put(q[0],q[1]+1,c);put(q[0],q[1]+2,"#fff6c0")}else{put(q[0],q[1]+1,c);put(q[0]-1,q[1]+2,c);put(q[0]+1,q[1]+2,c);put(q[0],q[1]+2,c);put(q[0],q[1]+3,c)}})}
  }
  // ---- pelo ----
  const HFG=gNew(),ho={g:HFG},STK=[];
  const capd=[1,2,3,4,8,10,11,15,17,18,19,20,22,23,24,25,28,31,34].includes(L.hat);
  const H0=HY-10.6;
  function crown(lowSides,c){c=c||hc;shp((x,y)=>{const dx=(x-cx)/11,dy=(y-(HY-1.5))/10.6;if(dx*dx+dy*dy>1)return false;if(back)return y<=HY+8;const a=Math.abs(x-cx);return y<=HY-6+(a>6.5?(a-6.5)*lowSides:0)},cx-12,HY-13,cx+12,HY+10,c,ho)}
  function bangs(n,len,c){c=c||hc;for(let i=0;i<n;i++){const t=n===1?.5:i/(n-1),x=cx-8+t*16,ln=len*(1-.25*Math.abs(t-.5));seg(x,HY-9,x+(t<.5?-1:1)*1.2,HY-9+ln,5.4,1.2,c,ho);if(i)STK.push([x-2,HY-7,x-2+(t<.5?-.6:.6),HY-9+ln*.8])}}
  const sideLocks=(len,c)=>{c=c||hc;seg(cx-9.5,HY-5,cx-10.4,HY-5+len,4.8,2,c,ho);seg(cx+9.5,HY-5,cx+10.4,HY-5+len,4.8,2,c,ho)};
  const spikes=(n,len,c)=>{if(capd)return;c=c||hc;for(let i=0;i<n;i++){const a=-Math.PI*.95+i*(Math.PI*.9)/(n-1),x0=cx+Math.cos(a)*6,y0=HY-4+Math.sin(a)*6;seg(x0,y0,cx+Math.cos(a)*(10+len),HY-4+Math.sin(a)*(9+len),6.4,1.4,c,ho)}};
  const hs=L.hs;
  if(back){
    if(hs===22){}
    else if(hs===5)shp((x,y)=>headT(x,y)&&y<=HY+6,cx-11,HY-12,cx+11,HY+7,tone(hc,0),{tag:"hair",ol:false,flat:true});
    else if(hs===9){for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ell(cx+Math.cos(a)*11,HY-3+Math.sin(a)*10,5,5,hc,ho)}ell(cx,HY-3,12.5,12,hc,ho)}
    else{
      if(hs===10||hs===27)shp((x,y)=>headT(x,y)&&y<=HY+6,cx-11,HY-12,cx+11,HY+7,tone(hc,0),{tag:"hair",ol:false,flat:true});else crown(0);
      if(hs===27)ell(cx+1,HY-8,8.5,5.5,hc,ho);
      if(hs===26)for(let i=0;i<9;i++){const x=cx-11+i*2.75;seg(x,HY-2,x+(x-cx)*.15,HY+19-Math.abs(i-4)*.5,3,2.4,hc,ho)}
      if(hs!==10&&hs!==27&&hs!==26){const len={2:22,7:15,11:13,16:9,17:25,19:15,23:23,24:31,28:15,29:9}[hs]||7,wd=len>12?11.6:10.4;
        shp((x,y)=>{const dx=Math.abs(x-cx);if(y<HY-4||dx>wd-(y>HY+len-3?1:0))return false;return y<=HY+len-Math.abs(((x+40)%4)-1.5)*1.4},cx-12,HY-5,cx+12,HY+len+1,hc,ho);
        for(const d of[-7,-3,1,5])STK.push([cx+d,HY-3,cx+d+(d<0?-.6:.6),HY+len-3])}
      if(hs===1)spikes(7,4);
      if(!capd&&hs===10)for(let i=0;i<5;i++)seg(cx,HY-10+i*3,cx+(i%2?1:-1)*.5,HY-16+i*3,4.5,1.4,hc,ho);
      if(hs===6)for(let i=0;i<10;i++){const a=i/10*Math.PI*2;ell(cx+Math.cos(a)*8.5,HY-1+Math.sin(a)*8.5,4.4,4.4,hc,ho)}
      if(!capd&&hs===8)ell(cx,HY-11,4.6,3.8,hc,ho);
      if(!capd&&hs===13){ell(cx-8,HY-10,4,3.8,hc,ho);ell(cx+8,HY-10,4,3.8,hc,ho)}
      if(hs===14)spikes(6,2);
      if(hs===23)spikes(7,5);
      if(hs===29)spikes(9,8);
      if(!capd&&hs===28)ell(cx,HY-11,3.8,3.2,hc,ho);
      if(hs===3||hs===20||hs===12||hs===4||hs===21){const tc2=ac;if(hs===3||hs===12)rect(cx-1.5,HY+1,4,2,tc2,{ol:false,flat:true});if(hs===20)rect(cx-1.5,HY-8,4,2,tc2,{ol:false,flat:true})}
    }
    if(hs===3)seg(cx,HY+2,cx+.5,HY+17,6,3,hc,ho);
    if(hs===20)seg(cx,HY-7,cx+1.5,HY+14,6,2.5,hc,ho);
    if(hs===4){seg(cx-10,HY-3,cx-13,HY+14,6,3,hc,ho);seg(cx+10,HY-3,cx+13,HY+14,6,3,hc,ho)}
    if(hs===12)for(let i=0;i<5;i++)ell(cx,HY+3+i*3.6,2.8-i*.2,2.2,hc,ho);
    if(hs===21)for(const s of[-1,1])for(let i=0;i<5;i++)ell(cx+s*(9+i*.4),HY+2+i*3.6,2.6-i*.18,2.1,hc,ho);
    if(hs===25)for(const sd of[-1,1])seg(cx+sd*9,HY+4,cx+sd*12,HY+20,6,3.2,hc,ho);
  }else{
    if(hs===22){}
    else if(hs===5){shp((x,y)=>headT(x,y)&&y<=HY-5+(Math.abs(x-cx)>7?(Math.abs(x-cx)-7)*1.3:0),cx-11,HY-12,cx+11,HY,tone(hc,0),{tag:"hair",ol:false,flat:true})}
    else{
      if(hs!==10&&hs!==27)crown(hs===18?.55:.9);
      if(hs===0){bangs(5,5);sideLocks(7)}
      else if(hs===1){spikes(7,4);bangs(4,6);sideLocks(7)}
      else if(hs===2){bangs(5,6);sideLocks(17)}
      else if(hs===3||hs===20){bangs(4,5);sideLocks(8)}
      else if(hs===4){bangs(5,6);sideLocks(9)}
      else if(hs===6){for(let i=0;i<7;i++)ell(cx-9+i*3,HY-7+(i%2),2.8,2.8,hc,ho);sideLocks(6)}
      else if(hs===7){seg(cx-9,HY-9,cx+2,HY-1,7,2,hc,ho);seg(cx-3,HY-10,cx+7,HY-3,6,1.6,hc,ho);sideLocks(13)}
      else if(hs===8){bangs(4,4);sideLocks(7);if(!capd)ell(cx,HY-12,4.8,4,hc,ho)}
      else if(hs===9){for(let i=0;i<6;i++)ell(cx-8+i*3.2,HY-8+(i%2),2.8,2.6,hc,ho)}
      else if(hs===10){if(!capd)for(let i=0;i<5;i++)seg(cx,HY-8,cx+(i-2)*1.6,HY-18+Math.abs(i-2)*1.5,4.6,1.4,hc,ho);shp((x,y)=>headT(x,y)&&y<=HY-4&&Math.abs(x-cx)>4,cx-11,HY-12,cx+11,HY,tone(hc,0),{tag:"hair",ol:false,flat:true})}
      else if(hs===11){bangs(6,6);sideLocks(13)}
      else if(hs===12||hs===21){bangs(5,5);sideLocks(8)}
      else if(hs===13){bangs(5,5);sideLocks(7);if(!capd){ell(cx-8,HY-11,4,3.8,hc,ho);ell(cx+8,HY-11,4,3.8,hc,ho)}}
      else if(hs===14){spikes(6,2);for(let i=0;i<6;i++){const x=cx-8+i*3.2;seg(x,HY-10,x+(i%2?2:-2),HY-3,5,1.2,hc,ho)}sideLocks(8)}
      else if(hs===15){if(!capd){ell(cx+1,HY-12,8.5,4.8,hc,ho);seg(cx-6,HY-12,cx+7,HY-16,6,2,hc,ho)}else bangs(4,4);sideLocks(6)}
      else if(hs===16){shp((x,y)=>headT(x,y)&&y<=HY-3.5,cx-11,HY-12,cx+11,HY,hc,ho);sideLocks(11)}
      else if(hs===17){bangs(6,6);seg(cx-10,HY-5,cx-11,HY+16,5.5,3,hc,ho);seg(cx+10,HY-5,cx+11,HY+16,5.5,3,hc,ho)}
      else if(hs===18){for(let i=0;i<5;i++){const x=cx-7+i*3.5;seg(x,HY-7,x+.8,HY-13,4.2,3.6,hc,ho)}sideLocks(5)}
      else if(hs===19){seg(cx-8,HY-9,cx-1.5,HY+2,6.5,3,hc,ho);seg(cx-1,HY-10,cx+7,HY-6,6,1.8,hc,ho);sideLocks(13)}
      else if(hs===23){spikes(7,5);bangs(5,7);sideLocks(16)}
      else if(hs===24){bangs(7,6);sideLocks(22)}
      else if(hs===25){bangs(5,5);sideLocks(7);for(const sd of[-1,1]){seg(cx+sd*9.5,HY+4,cx+sd*12.5,HY+21,6,3.2,hc,ho)}}
      else if(hs===26){for(let i=0;i<5;i++){const x=cx-7+i*3.5;seg(x,HY-10,x+(i-2)*.4,HY-4,3,2.4,hc,ho)}for(const sd of[-1,1])for(let k=0;k<3;k++)seg(cx+sd*(8.5+k*1.2),HY-5,cx+sd*(10+k*1.6),HY+13-k*2,3,2.4,hc,ho)}
      else if(hs===27){seg(cx-8,HY-10,cx+10,HY-6,7,3,hc,ho);seg(cx-6,HY-13,cx+10,HY-9,6,2,hc,ho);shp((x,y)=>headT(x,y)&&y<=HY-1&&y>=HY-7&&Math.abs(x-cx)>7,cx-11,HY-8,cx+11,HY,tone(hc,0),{tag:"hair",ol:false,flat:true})}
      else if(hs===28){bangs(5,5);sideLocks(12);if(!capd)ell(cx,HY-12,3.6,3,hc,ho)}
      else if(hs===29){spikes(9,8);bangs(5,6);sideLocks(9)}
    }
  }
  if(L.hs!==22&&L.hs!==5){gDraw(HFG,hc,{tag:"hair",sx:.7,lx:.32,ly:.4});
    const ol=tone(hc,4),okh=(x,y)=>gtag(x,y)==="hair"&&px[y*TW+x]!==ol;
    STK.forEach(q=>{const n=Math.ceil(Math.hypot(q[2]-q[0],q[3]-q[1]));for(let i=0;i<=n;i++){const X=Math.round(q[0]+(q[2]-q[0])*i/n),Y=Math.round(q[1]+(q[3]-q[1])*i/n);if(okh(X,Y))put(X,Y,tone(hc,3))}});
    if(!back&&!capd)for(let x=Math.round(cx-6);x<=cx+3;x++){const Y=Math.round(HY-9+((x-cx+1.5)/5)**2*1.3);if(okh(x,Y))put(x,Y,tone(hc,0));if(Math.abs(x-cx+1.5)<3&&okh(x,Y+1))put(x,Y+1,tone(hc,0))}
    if(back)for(let x=Math.round(cx-7);x<=cx+5;x++){const Y=Math.round(HY-6+((x-cx+1)/6)**2*1.6);if(okh(x,Y))put(x,Y,tone(hc,0))}}
  // mechas
  if(L.mch&&L.hs!==22){
    const hp=[];for(let y=0;y<TH;y++)for(let x=0;x<TW;x++)if(tg[y*TW+x]==="hair")hp.push([x,y]);
    if(L.mch===1){const bot={};hp.forEach(([x,y])=>{if(bot[x]==null||y>bot[x])bot[x]=y});hp.forEach(([x,y])=>{if(y>bot[x]-3&&px[y*TW+x]!==tone(hc,4))put(x,y,y===bot[x]?tone(mcc,4):tone(mcc,y===bot[x]-2?0:1))})}
    else if(L.mch===2){hp.forEach(([x,y])=>{const d=x-cx+ (y-HY)*.3;if(d>=-6&&d<=-3.5&&px[y*TW+x]!==tone(hc,4))put(x,y,tone(mcc,d<-5?0:1))})}
    else hp.forEach(([x,y])=>{if((x*2+y)%7===0&&px[y*TW+x]!==tone(hc,4))put(x,y,tone(mcc,0))});
  }
  // ---- gorros ----
  const hat=L.hat,hk=tone(hac,4);
  const capDome=(c,yb)=>shp((x,y)=>((x-cx)/10.8)**2+((y-(HY-3))/9.4)**2<=1&&y<=(yb||HY-4),cx-12,HY-14,cx+12,HY-3,c,{tag:"hat",lx:.36});
  if(hat===1){capDome(hac);if(!back){shp((x,y)=>y>=HY-5&&y<=HY-3&&Math.abs(x-cx-1)<=12-(y-(HY-5))*1.5,cx-12,HY-5,cx+14,HY-3,tone(hac,2),{tag:"hat"});rect(cx-3,HY-12,7,4,ac,{tag:"hat"})}else{rect(cx-3,HY-6,7,2,tone(hac,2),{ol:false,flat:true});put(cx,HY-14,ac)}}
  if(hat===2){capDome(hac);if(back)shp((x,y)=>y>=HY-5&&y<=HY-3&&Math.abs(x-cx)<=12-(y-(HY-5))*1.5,cx-12,HY-5,cx+12,HY-3,tone(hac,2),{tag:"hat"});else{rect(cx-3,HY-8,7,3,ac,{ol:false,flat:true})}}
  if(hat===3){shp((x,y)=>((x-cx)/11)**2+((y-(HY-3))/10)**2<=1&&y<=HY-4,cx-12,HY-14,cx+12,HY-3,hac,{tag:"hat"});rect(cx-11,HY-7,23,3,ac,{tag:"hat"});ell(cx,HY-14,3,2.8,ac);for(let x=cx-10;x<=cx+10;x+=2)put(x,HY-6,tone(ac,2))}
  if(hat===4){ell(cx,HY-5,15,2.8,tone(hac,1),{tag:"hat"});shp((x,y)=>((x-cx)/8)**2+((y-(HY-9))/6)**2<=1&&y<=HY-5,cx-9,HY-16,cx+9,HY-5,hac,{tag:"hat"});rect(cx-8,HY-8,17,2,ac,{ol:false,flat:true})}
  if(hat===5){for(let x=cx-10.5;x<=cx+10.5;x++){put(x,HY-6,ac);put(x,HY-5,tone(ac,2))}if(back){seg(cx+3,HY-5,cx+6,HY+3,2,1.6,ac);seg(cx-3,HY-5,cx-5,HY+3,2,1.6,ac)}}
  if(hat===6){const X=back?cx-5:cx+3;map(Math.round(X),HY-15,["hh..hh","hhhkhh","hhhkhh","h..k.h"],{h:hac,k:tone(hac,3)});}
  if(hat===7){for(let x=cx-10;x<=cx+10;x++)put(x,HY-8,ink);if(!back){map(Math.round(cx-8),HY-11,["kkkkkk.kkkkkk","kgggk...kgggk","kgwgk...kgwgk",".kkk.....kkk."],{k:ink,g:"#3a4256",w:"#9ad7ff"})}}
  if(hat===8){shp((x,y)=>((x-cx-1.5)/12)**2+((y-(HY-8))/5)**2<=1&&y<=HY-5,cx-12,HY-14,cx+15,HY-4,hac,{tag:"hat"});put(cx+1,HY-14,tone(hac,3))}
  if(hat===9){rect(cx-10,HY-8,21,3,hac,{tag:"hat"});if(!back)shp((x,y)=>y>=HY-6&&y<=HY-4&&Math.abs(x-cx)<=11-(y-(HY-6))*2.2,cx-12,HY-6,cx+12,HY-4,tone(hac,2))}
  if(hat===10){shp((x,y)=>((x-cx)/9.6)**2+((y-(HY-6))/6.5)**2<=1&&y<=HY-5,cx-11,HY-13,cx+11,HY-5,hac,{tag:"hat"});shp((x,y)=>y>=HY-6&&y<=HY-2&&Math.abs(x-cx)<=10+(y-(HY-6))*.9,cx-15,HY-6,cx+15,HY-2,tone(hac,0),{tag:"hat"})}
  if(hat===11){ell(cx,HY-5,16,3,"#f3d27a",{tag:"hat"});shp((x,y)=>((x-cx)/8.4)**2+((y-(HY-9))/5.6)**2<=1&&y<=HY-5,cx-9,HY-15,cx+9,HY-5,"#f3d27a",{tag:"hat"});rect(cx-8,HY-8,17,2,hac,{ol:false,flat:true});for(let x=cx-14;x<=cx+14;x+=3)put(x,HY-5,tone("#f3d27a",2))}
  if(hat===12){for(let i=0;i<7;i++){const a=Math.PI*(1.05+i*.15),X=cx+Math.cos(a)*10.5,Y=HY-3+Math.sin(a)*8.5;ell(X,Y,2.2,2.2,[hac,ac,"#ffd35c"][i%3],{olc:tone(hac,4)});put(X,Y,"#fff6a0")}}
  if(hat===13){if(!back){map(Math.round(cx-9),HY-12,[".kkkkk.kkkkk.","kgggwk.kwgggk","kggggkkkggggk",".kkkk...kkkk."],{k:"#7a5a2a",g:tone(hac,0),w:"#fff"})}for(let x=cx-10;x<=cx+10;x++)put(x,HY-9,"#7a5a2a")}
  if(hat===14){for(let i=0;i<=20;i++){const a=Math.PI*(1.08+i*.042),X=cx+Math.cos(a)*10.8,Y=HY-2+Math.sin(a)*9.4;put(X,Y,hac);put(X,Y+1,tone(hac,2))}}
  if(hat===15){capDome(hac,HY-5);if(back)seg(cx,HY-5,cx+1,HY+1,4,1.5,hac);for(let x=cx-8;x<=cx+8;x+=4)put(x,HY-9,white)}
  if(hat===16){for(const s of[-1,1]){shp((x,y)=>{const t=(HY-6-y)/8;return t>=0&&t<=1&&Math.abs(x-(cx+s*7+s*t*1.2))<=3.6*(1-t)},cx+s*7-5,HY-15,cx+s*7+5,HY-6,hac,{tag:"hat"});if(!back)put(cx+s*7.4,HY-9,"#ffb3c7")}for(let i=0;i<=20;i++){const a=Math.PI*(1.08+i*.042);put(cx+Math.cos(a)*10.8,HY-2+Math.sin(a)*9.4,tone(hac,2))}}
  if(hat===17){capDome(hac,HY-4);ell(cx,HY-4,13.5,2.2,tone(hac,0),{tag:"hat"});rect(cx-10,HY-7,21,2,ac,{ol:false,flat:true})}
  if(hat===18){ell(cx,HY-5,13,2.4,hac,{tag:"hat"});rect(cx-7,HY-21,15,16,hac,{tag:"hat"});rect(cx-7,HY-9,15,3,ac,{ol:false,flat:true})}
  if(hat===19){shp((x,y)=>{const dx=Math.abs(x-cx);return y>=HY-7&&y<=HY-3&&dx<=16&&y>=HY-7+(16-dx)*.25-((dx>12)?(dx-12)*1.2:0)},cx-17,HY-11,cx+17,HY-3,tone(hac,0),{tag:"hat"});shp((x,y)=>((x-cx)/8.2)**2+((y-(HY-9))/6.2)**2<=1&&y<=HY-5&&!(y<HY-13&&Math.abs(x-cx)<1.5),cx-9,HY-16,cx+9,HY-5,hac,{tag:"hat"});rect(cx-8,HY-8,17,2,ac,{ol:false,flat:true})}
  if(hat===20){capDome(hac,HY-5);seg(cx+1,HY-12,cx+12,HY-5,8,3.4,hac,{tag:"hat"});ell(cx,HY-5,12.4,2.5,"#fbfaff",{tag:"hat"});ell(cx+12.5,HY-4,2.8,2.8,"#fbfaff")}
  if(hat===21){for(let i=0;i<=24;i++){const a=Math.PI*(1.04+i*.0383),X=cx+Math.cos(a)*11.4,Y=HY-1+Math.sin(a)*11;put(X,Y,tone(hac,3));put(X,Y+1,hac);put(X,Y+2,tone(hac,0))}
    for(const sd of[-1,1]){ell(cx+sd*11,HY+1,3.2,4.4,hac,{tag:"hat"});if(!back)put(cx+sd*11,HY,tone(hac,0))}}
  if(hat===22){capDome(hac,HY-6);for(let x=cx-9;x<=cx+9;x+=3)for(let y=HY-12;y<=HY-7;y+=3)if(gtag(Math.round(x),y)==="hat")put(x,y,"#fbfaff");
    if(back){seg(cx,HY-6,cx-3,HY+4,3.4,2,hac);seg(cx,HY-6,cx+3,HY+3,3.4,2,hac);ell(cx,HY-6,2.4,2,tone(hac,2))}else{ell(cx+11,HY-6,2.4,2,hac);seg(cx+11,HY-6,cx+14,HY+1,3,1.8,hac)}}
  if(hat===23){ell(cx,HY-5,16.5,2.9,hac,{tag:"hat"});shp((x,y)=>{const t=(HY-6-y)/(HY-7);return t>=0&&t<=1&&Math.abs(x-(cx+t*t*5))<=9.5*(1-t)+.6},cx-11,0,cx+11,HY-6,hac,{tag:"hat"});rect(cx-8,HY-9,17,3,ac,{ol:false,flat:true});if(!back)put(cx,HY-8,"#ffd35c")}
  if(hat===24){shp((x,y)=>((x-cx)/11.6)**2+((y-(HY-10))/5)**2<=1&&y<=HY-6,cx-13,HY-16,cx+13,HY-6,hac,{tag:"hat"});rect(cx-10,HY-8,21,3,"#26262e",{tag:"hat"});
    if(!back){shp((x,y)=>y>=HY-5&&y<=HY-3&&Math.abs(x-cx)<=10-(y-(HY-5))*1.6,cx-11,HY-5,cx+11,HY-3,"#1c1c22",{tag:"hat"});map(Math.round(cx-1),HY-12,[".g.","ggg",".g."],{g:"#f2c84a"})}}
  // gorros de prestigio
  const gd="#f2c84a",gl2="#fff2a8",gk="#9a6f1c",star=(x,y)=>map(Math.round(x-1),Math.round(y-1),[".y.","yyy",".y."],{y:gl2});
  if(hat===25){capDome(hac);if(!back){shp((x,y)=>y>=HY-5&&y<=HY-3&&Math.abs(x-cx-1)<=12-(y-(HY-5))*1.5,cx-12,HY-5,cx+14,HY-3,gd,{tag:"hat"});rect(cx-3,HY-13,7,5,gd,{tag:"hat"});star(cx,HY-11)}else{rect(cx-3,HY-6,7,2,gd,{ol:false,flat:true});put(cx,HY-14,gd)}}
  if(hat===26){for(let x=cx-10.5;x<=cx+10.5;x++){put(x,HY-7,hac);put(x,HY-6,gd);put(x,HY-5,tone(gd,2))}if(!back){star(cx-4,HY-6);star(cx+4,HY-6)}else{seg(cx+3,HY-6,cx+6,HY+4,2,1.6,hac);seg(cx-3,HY-6,cx-5,HY+4,2,1.6,hac)}}
  if(hat===27){for(let i=0;i<=12;i++){const a=Math.PI*(1.06+i*.0733),X=cx+Math.cos(a)*11,Y=HY-2+Math.sin(a)*9.6;if(back&&i>4&&i<8)continue;ell(X,Y,1.9,1.4,i%2?"#5fae3c":"#7fcf4a",{olc:"#2f6b22"});if(i%3===0)put(X,Y-1,gd)}
    if(!back){ell(cx,HY-11.6,1.6,1.6,gd,{olc:gk});put(cx,HY-12,gl2)}}
  if(hat===28){ell(cx,HY-5,15,2.8,tone(hac,1),{tag:"hat"});shp((x,y)=>((x-cx)/8.6)**2+((y-(HY-10))/7)**2<=1&&y<=HY-5,cx-9,HY-18,cx+9,HY-5,hac,{tag:"hat"});rect(cx-8,HY-9,17,3,gd,{tag:"hat",ol:false,flat:true});if(!back)star(cx,HY-13)}
  if(hat===29){const hy0=HY-15.5,ring=(x,y)=>{const d=((x-cx)/9.5)**2+((y-hy0)/3)**2;return d<=1&&d>=.3};shp(ring,cx-11,hy0-4,cx+11,hy0+4,gd,{tag:"hat"})}
  if(hat===30){map(Math.round(cx-8),HY-15,["y...y...y...y...y","yy..yy.yyy.yy..yy","yyy.yyyyyyyyy.yyy","yyyyyyyyyyyyyyyyy","yyyyyyyyyyyyyyyyy","kkkkkkkkkkkkkkkkk"],{y:gd,k:gk});
    if(!back){ell(cx,HY-11,1.6,1.6,hac,{olc:tone(hac,4)});ell(cx-5,HY-11,1.2,1.2,ac,{olc:tone(ac,4)});ell(cx+5,HY-11,1.2,1.2,ac,{olc:tone(ac,4)})}for(const x of[-8,-4,0,4,8])put(cx+x,HY-16,gl2)}
  // gorros de temporada (Tienda de Evento)
  if(hat===31){const o="#f08a24";shp((x,y)=>((x-cx)/11.4)**2+((y-(HY-7))/7.6)**2<=1&&y<=HY-3,cx-12,HY-15,cx+12,HY-3,o,{tag:"hat",lx:.3});for(const dx of[-6,0,6])for(let y=HY-13;y<=HY-4;y++)if(gtag(Math.round(cx+dx*(1-(HY-8-y)**2/100)),y)==="hat")put(cx+dx*(1-(HY-8-y)**2/100),y,tone(o,2));rect(cx-1,HY-17,3,4,"#4a7a2a",{tag:"hat"});seg(cx+1,HY-16,cx+5,HY-18,1.6,1.2,"#6aa83a");
    if(!back){map(Math.round(cx-6),HY-10,["k.....k","kk...kk"],{k:"#3a1a0a"});map(Math.round(cx-3),HY-7,["k.k.k.k"],{k:"#3a1a0a"})}}
  if(hat===32){for(let i=0;i<=20;i++){const a=Math.PI*(1.08+i*.042);put(cx+Math.cos(a)*10.8,HY-2+Math.sin(a)*9.4,"#7a4a26");put(cx+Math.cos(a)*10.8,HY-1+Math.sin(a)*9.4,tone("#7a4a26",2))}
    for(const sd of[-1,1]){const b="#e8c48a";seg(cx+sd*7,HY-9,cx+sd*11,HY-19,3,2.4,b,{tag:"hat"});seg(cx+sd*9.5,HY-15,cx+sd*15,HY-17,2.4,2,b,{tag:"hat"});seg(cx+sd*11,HY-19,cx+sd*15,HY-23,2.2,1.8,b,{tag:"hat"});seg(cx+sd*11,HY-19,cx+sd*9,HY-24,2,1.6,b,{tag:"hat"})}if(!back)ell(cx,HY-13,1.6,1.6,"#e63950",{olc:"#8a1020"})}
  if(hat===33){for(let i=0;i<=20;i++){const a=Math.PI*(1.08+i*.042);put(cx+Math.cos(a)*10.8,HY-2+Math.sin(a)*9.4,"#ff6fa8");put(cx+Math.cos(a)*10.8,HY-1+Math.sin(a)*9.4,tone("#ff6fa8",2))}
    for(const sd of[-1,1]){seg(cx+sd*5,HY-10,cx+sd*7,HY-15,1,1,"#c9c9d6");map(Math.round(cx+sd*7-2),HY-19,[".r.r.","rrrrr",".rrr.","..r.."],{r:"#ff3d6e"});put(cx+sd*7-1,HY-18,"#ffd0dc")}}
  if(hat===34){ell(cx,HY-5,16,3,"#f3d27a",{tag:"hat"});shp((x,y)=>((x-cx)/8.4)**2+((y-(HY-9))/5.6)**2<=1&&y<=HY-5,cx-9,HY-15,cx+9,HY-5,"#f3d27a",{tag:"hat"});rect(cx-8,HY-8,17,2,"#ff8fb8",{ol:false,flat:true});
    const fx=back?cx-6:cx+6;map(Math.round(fx-2),HY-11,[".p.p.","ppypp",".ppp.","..g.."],{p:"#ff6fa8",y:"#ffe25a",g:"#4a9a3a"})}
  if(hat===35){for(let x=cx-10.5;x<=cx+10.5;x++){put(x,HY-6,"#2b2b34");put(x,HY-5,"#3a3a46")}
    if(!back){for(const sd of[-1,1]){ell(cx+sd*4.6,HY-8,4,3,"#3fb0ff",{olc:"#14304a"});put(cx+sd*4.6-1,HY-9,"#d8f4ff");put(cx+sd*4.6,HY-9,"#a8e2ff")}rect(cx-1,HY-9,3,2,"#2b2b34",{ol:false,flat:true})}}
  // ---- adornos del pelo ----
  if(L.ha&&L.hs!==22){const hx=back?cx-7:cx+6,hy2=HY-8,a=hac;
    if(L.ha===1){for(let k=0;k<4;k++){put(hx-1+k,hy2+k*.3,a);put(hx-1+k,hy2+2+k*.3,tone(a,2))}}
    else if(L.ha===2){map(Math.round(hx-2),hy2-2,[".p.p.","ppypp",".ppp.","..p.."],{p:a,y:"#ffe25a"})}
    else if(L.ha===3){map(Math.round(hx-2),hy2-2,["..y..",".yyy.","yyyyy",".y.y."],{y:"#ffd35c"})}
    else if(L.ha===4){map(Math.round(hx-2),hy2-1,["rr.rr","rrkrr","r...r"],{r:a,k:tone(a,3)})}
    else if(L.ha===5){for(let x=cx-10.5;x<=cx+10.5;x++){put(x,HY-5,a);put(x,HY-4,tone(a,2))}}}
  // ---- gafas ----
  if(!back&&L.gl&&!lose){const g=ink,ly=HY+1,lx0=Math.round(cx-7.5),rx0=Math.round(cx+2.5);
    if(L.gl===1){[lx0,rx0].forEach(x0=>map(x0,ly-1,[".kkk.","k...k","k...k",".kkk."],{k:g}));put(cx,ly,g);put(cx+1,ly,g)}
    if(L.gl===2){[lx0,rx0].forEach(x0=>map(x0,ly-1,["kkkkk","k...k","k...k","kkkkk"],{k:g}));put(cx,ly,g);put(cx+1,ly,g)}
    if(L.gl===3){[lx0,rx0].forEach(x0=>map(x0,ly-1,["kkkkk","kssbk","ksssk",".kkk."],{k:g,s:"#2a2f45",b:"#9ad7ff"}));put(cx,ly,g);put(cx+1,ly,g)}
    if(L.gl===4){[lx0,rx0].forEach(x0=>map(x0,ly+1,["k...k",".kkk."],{k:g}));put(cx,ly+1,g);put(cx+1,ly+1,g)}
    if(L.gl===5){map(lx0,ly-1,[".kkk.","kkkkk","kkkkk",".kkk."],{k:"#20202a"});for(let i=0;i<12;i++)put(cx-9.5+i*1.7,HY-3+i*.15*(i<6?-1:1),"#20202a")}
    if(L.gl===6){map(rx0,ly-1,[".ggg.","g...g","g...g",".ggg."],{g:"#e0b23a"});put(rx0+1,ly,"#ffffff");for(let i=0;i<7;i++)put(rx0+4+i*.3,ly+2+i,"#e0b23a")}
    if(L.gl===7){[lx0,rx0].forEach(x0=>map(x0,ly-1,["rr.rr","rpppr",".rpr.","..r.."],{r:"#e63970",p:"#ff9ec7"}));put(cx,ly,"#e63970");put(cx+1,ly,"#e63970")}
  }
  // ---- cuello (bufanda, collar, pañuelo, corbata, lazo) ----
  if(L.nk){const n=L.nk,c=nkc;
    if(n===1){shp((x,y)=>y>=30+hy&&y<=35+hy&&Math.abs(x-cx)<=6.5-(y===30+hy?1:0),cx-8,29,cx+8,37,c,{tag:"nk"});if(!back){seg(cx+3.5,34,cx+5,46,4,3.6,c)}else{seg(cx-3,34,cx-6,47,4,3,c);seg(cx-1,34,cx-2,44,3.6,3,tone(c,2))}for(let x=cx-6;x<=cx+6;x+=3)put(x,32+hy,tone(c,2))}
    if(n===2&&!back){for(let i=0;i<=8;i++){const a=Math.PI*(.15+i*.0875);put(cx+Math.cos(a)*5,34+Math.sin(a)*3.4,"#f2c84a")}ell(cx,38.5,1.4,1.4,c,{olc:"#8a6a22"})}
    if(n===3){if(!back)shp((x,y)=>y>=34&&y<=41&&Math.abs(x-cx)<=(41-y)*.85,cx-7,34,cx+7,41,c);else shp((x,y)=>y>=34&&y<=42&&Math.abs(x-cx)<=(42-y)*.8,cx-7,34,cx+7,42,c)}
    if(n===4&&!back){map(Math.round(cx-1),34,[".kk.",".kk.","kkkk",".kk.",".kk.",".kk.",".kk.",".kk.",".kk.","kkkk",".kk."],{k:c});for(let y=36;y<45;y++)put(cx+1,y,tone(c,2))}
    if(n===5&&!back){map(Math.round(cx-3),33,["kk.kk","kkkkk","kk.kk"],{k:c});put(cx-1,34,tone(c,3))}
    if(n===6&&!back){for(let i=0;i<=5;i++){put(cx-4+i*.7,33+i,c);put(cx+4-i*.7,33+i,c);put(cx-3+i*.7,33+i,tone(c,2));put(cx+3-i*.7,33+i,tone(c,2))}ell(cx,40.5,2.4,2.4,"#f2c84a",{olc:"#9a6f1c"});map(Math.round(cx-1),40,[".y.","yyy",".y."].slice(0,2),{y:"#fff2a8"})}
    if(n===8&&!back){map(Math.round(cx-6),33,["kk.........kk","kpk..ppp..kpk","kppkpppppkppk","kpk..ppp..kpk","kk.........kk"],{k:"#1a0f24",p:"#7a3ac0"})}
    if(n===7&&!back){for(let i=0;i<=8;i++){const a=Math.PI*(.15+i*.0875),X=cx+Math.cos(a)*5.2,Y=34+Math.sin(a)*3.6;put(X,Y,"#f2c84a");if(i%2===0)map(Math.round(X-1),Math.round(Y+1),[".y.","yyy",".y."],{y:i===4?c:"#fff2a8"})}}
  }
  // ---- capucha por detras ----
  if(back&&hood){}
  // ---- pokeball en la mano ----
  if(ballAt){const[bx,by]=ballAt;map(Math.round(bx-1.5),Math.round(by-1.5),[".rr.","rrrr","kkwk",".ww."],{r:"#e83a50",k:ink,w:white})}
  // ---- contorno exterior (silueta) ----
  const out=px.slice(),dk={};
  const darker=c=>dk[c]||(dk[c]=(()=>{let[h,s2,l]=trHsl(c);return trRgb(h,Math.min(1,s2*.7+.1),Math.min(l*.45,.16))})());
  for(let y=0;y<TH;y++)for(let x=0;x<TW;x++)if(px[y*TW+x]){const n=[[1,0],[-1,0],[0,1],[0,-1]].some(d=>{const X=x+d[0],Y=y+d[1];return X<0||Y<0||X>=TW||Y>=TH||!px[Y*TW+X]});if(n)out[y*TW+x]=darker(px[y*TW+x])}
  const s=2,cv=document.createElement("canvas");cv.width=TW*s;cv.height=TH*s;const g2=cv.getContext("2d");
  out.forEach((c,i)=>{if(c){g2.fillStyle=c;g2.fillRect((i%TW)*s,Math.floor(i/TW)*s,s,s)}});
  return _trc[key]=cv.toDataURL();
}
function trImg(L,view,pose,cls){return '<img class="trimg'+(cls?" "+cls:"")+'" src="'+trURL(L,view,pose)+'" alt="" draggable="false">'}
// ---- panel de personalizacion ----
let TRTAB="c";
// cada prenda/rasgo se muestra junto a sus colores
const TRGRP={b:["sk"],ey:["ec"],mk:["mkc"],hs:["hc"],mch:["mcc"],hat:["hac"],top:["tc","ac"],bot:["bc"],shs:["sh"],pat:["pc"],sck:["sckc"],wst:["wsc"],bp:["bpc"],nk:["nkc"],glv:["glc"],wr:["wrc"]};
function trUI(){
  const L=myLook(),box=$("trOpts");if(!box)return;
  $("trPrev").innerHTML='<div class="trv"><span>De frente</span>'+trImg(L,"f","i","idle")+'</div><div class="trv"><span>En combate</span>'+trImg(L,"b","i","idle")+'</div>';
  const opts=TRO.filter(o=>o[3]===TRTAB),used=new Set();
  const sw=o=>{const v=L[o[0]];return '<div class="trcol"><small>'+o[1]+'</small><div class="trsw">'+TRP[o[2]].map((c,i)=>'<button style="background:'+c+'" class="'+(i===v?"on":"")+'" data-tr="'+o[0]+'" data-v="'+i+'" aria-label="'+o[1]+' '+(i+1)+'" title="'+o[1]+' '+(i+1)+'"></button>').join("")+'</div></div>'};
  const cards=[];
  opts.forEach(o=>{if(used.has(o[0]))return;used.add(o[0]);
    if(Array.isArray(o[2])){const v=L[o[0]],cols=(TRGRP[o[0]]||[]).map(k=>TRO.find(x=>x[0]===k)).filter(Boolean);cols.forEach(c=>used.add(c[0]));
      cards.push('<div class="tro"><div class="trh"><b>'+o[1]+'</b><span class="trn">'+(v+1)+' / '+o[2].length+'</span></div><div class="trsel"><button class="alt" data-tr="'+o[0]+'" data-d="-1" aria-label="Anterior">◀</button><b>'+o[2][v]+'</b><button class="alt" data-tr="'+o[0]+'" data-d="1" aria-label="Siguiente">▶</button></div>'+(trShopIt(o[0],v)?'<small class="trprs">🛍️ Prenda de la Tienda de Evento</small>':TRLOCK[o[0]]?'<small class="trprs">'+(trLk(o[0],v)?'🌟 Prenda de Prestigio '+trLk(o[0],v):'🌟 '+Object.values(TRLOCK[o[0]]).filter(l=>l<=(S.prs||0)).length+' / '+Object.keys(TRLOCK[o[0]]).length+' prendas de prestigio desbloqueadas')+'</small>':'')+cols.map(sw).join("")+'</div>')}
    else{const own=Object.keys(TRGRP).find(k=>TRGRP[k].includes(o[0])&&opts.some(x=>x[0]===k));if(own)return;cards.push('<div class="tro">'+sw(o)+'</div>')}});
  box.innerHTML='<div class="trtabs">'+TRTABS.map(t=>'<button class="'+(TRTAB===t[0]?"on":"")+'" data-trt="'+t[0]+'">'+t[1]+'</button>').join("")+'</div><div class="trgrid">'+cards.join("")+'</div>';
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#trOpts [data-trt]");if(!b)return;TRTAB=b.dataset.trt;snd("ui");trUI()});
function trSet(k,v){S.tr=Object.assign(myLook(),{[k]:v});save();trUI();if(typeof pvPub==="function")pvPub()}
async function trDemo(){
  const L=myLook(),imgs=$("trPrev").querySelectorAll("img"),b=imgs[1],f=imgs[0];if(!b)return;
  b.classList.remove("idle");
  for(const p of ["t","m","u"]){b.src=trURL(L,"b",p);if(p==="u")snd("throw");await new Promise(r=>setTimeout(r,p==="u"?520:200))}
  b.src=trURL(L,"b","i");b.classList.add("idle");
  if(f){f.classList.remove("idle");f.src=trURL(L,"f","w");await new Promise(r=>setTimeout(r,900));f.src=trURL(L,"f","i");f.classList.add("idle")}
}
