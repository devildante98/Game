// =====================================================================================
// PERSONAJES DE EXPLORACIÓN SACADOS DEL AVATAR REAL
// La cabeza (peinado, gorro, gafas, barba, cara) y el torso (ropa, mangas, mochila, bufanda, pelo largo) de cada
// figura del mapa se obtienen reduciendo el dibujo de verdad del entrenador (el del editor), de frente y de espaldas,
// así que la figura se parece a su entrenador. De perfil, la cabeza se compone con media cara y media nuca.
// Las piernas siguen usando las plantillas animadas, con los colores del avatar a cada altura (pantalón corto,
// calcetines, botas…). Vale igual para tu personaje, los demás jugadores y todos los NPC.
// =====================================================================================
const CH2_W=64,CH2_H=96;
function ch2Edge(px){const e=new Uint8Array(CH2_W*CH2_H);for(let y=0;y<CH2_H;y++)for(let x=0;x<CH2_W;x++){const i=y*CH2_W+x;if(!px[i])continue;
    if(x===0||y===0||x===CH2_W-1||y===CH2_H-1||!px[i-1]||!px[i+1]||!px[i-CH2_W]||!px[i+CH2_W])e[i]=1}return e}
// color dominante de un rectángulo del avatar (los píxeles del contorno cuentan menos); null si está casi vacío
function ch2Dom(px,e,x0,y0,x1,y1,min){const cnt={};let n=0,tot=0;for(let y=Math.floor(y0);y<Math.ceil(y1);y++)for(let x=Math.floor(x0);x<Math.ceil(x1);x++){tot++;if(x<0||y<0||x>=CH2_W||y>=CH2_H)continue;const i=y*CH2_W+x,c=px[i];if(!c)continue;n++;cnt[c]=(cnt[c]||0)+(e[i]?.3:1)}
  if(n<tot*(min==null?.45:min))return null;let b=null,bw=-1;for(const c in cnt)if(cnt[c]>bw){bw=cnt[c];b=c}return b}
// cabeza 16×13 (filas 0-12) a mitad de tamaño y torso 12×6 (filas 13-18) comprimido
function ch2Parts(px){const e=ch2Edge(px),head=[],torso=[];
  for(let j=0;j<13;j++){const r=[];for(let i=0;i<16;i++)r.push(ch2Dom(px,e,16+i*2,4+j*2,18+i*2,6+j*2,.5));head.push(r)}
  for(let j=0;j<6;j++){const r=new Array(16).fill(null);for(let i=0;i<12;i++)r[2+i]=ch2Dom(px,e,15.5+i*2.667,34+j*4.17,15.5+(i+1)*2.667,34+(j+1)*4.17,.42);torso.push(r)}
  // colores de las piernas a cada altura (izquierda y derecha) y del calzado
  const leg=(cx,a,b)=>ch2Dom(px,e,cx-3,a,cx+3,b,.2),legs=[26.5,36.5].map(cx=>[leg(cx,60,67),leg(cx,67,74),leg(cx,74,81),leg(cx,81,88),leg(cx,88,92)]);
  return{head,torso,legs,skirt:ch2Dom(px,e,23,58,40,66,.2)}}
const CH2_DARK=c=>{const a=chHex(c);return a[0]+a[1]+a[2]<200};
function ch2Frame(t,P,dir,fr){const d=dir==="r"?"l":dir,G=chFrame(t,d,fr),F=P.f,B=P.b;
  // piernas: mismos dibujos, con el color real del avatar a cada altura
  const src=d==="u"?B:F;
  for(let y=19;y<24;y++)for(let x=0;x<16;x++){const c=G[y][x];if(!c||c===CH_K)continue;const L=src.legs[d==="l"?0:x<8?0:1],wide=(t.skirt||t.dress)&&y<21;let col=wide?(src.skirt||L[0]):y===23?(L[4]||L[3]):L[Math.min(3,y-19)]||L[0];
      if(!col)continue;const shoe=c===t.shoe,dk=c!==t.bot&&c!==t.top&&c!==t.shoe&&c!==t.skin;if(shoe&&L[4])col=L[4];G[y][x]=dk&&!shoe?chDk(col,.22):col}
  if(d==="l"){// de perfil: media cara (la mitad izquierda del frente) y media nuca (la mitad derecha de la espalda)
    for(let y=0;y<13;y++)for(let x=0;x<16;x++)G[y][x]=x<8?F.head[y][x]:B.head[y][x];
    // el color del pecho, del avatar
    const cnt={};for(let y=0;y<4;y++)for(let x=5;x<11;x++){const c=F.torso[y][x];if(c)cnt[c]=(cnt[c]||0)+1}const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
    if(top)for(let y=13;y<19;y++)for(let x=0;x<16;x++){if(G[y][x]===t.top)G[y][x]=top;else if(G[y][x]===chDk(t.top,.25))G[y][x]=chDk(top,.25)}}
  else{const S=d==="u"?B:F;for(let y=0;y<13;y++)for(let x=0;x<16;x++)G[y][x]=S.head[y][x];for(let y=13;y<19;y++)for(let x=0;x<16;x++)G[y][x]=S.torso[y-13][x];
    // al andar, los brazos se mueven un píxel
    if(fr===1||fr===3){const sh=(x0,x1,dy)=>{for(let x=x0;x<=x1;x++){if(dy>0){for(let y=18;y>14;y--)G[y][x]=G[y-1][x]}else{for(let y=14;y<18;y++)G[y][x]=G[y+1][x]}}};if(fr===1){sh(2,3,1);sh(12,13,-1)}else{sh(2,3,-1);sh(12,13,1)}}}
  // ojos: si al reducir se han perdido, se vuelven a marcar
  if(d==="d"){let n=0;for(let y=8;y<=10;y++)for(const x of[4,5,9,10,11])if(G[y][x]&&CH2_DARK(G[y][x]))n++;if(n<2){G[9][5]=CH_K;G[9][10]=CH_K}}
  else if(d==="l"){let n=0;for(let y=8;y<=10;y++)for(const x of[3,4,5])if(G[y][x]&&CH2_DARK(G[y][x]))n++;if(!n&&G[9][4])G[9][4]=CH_K}
  // contorno oscuro alrededor de lo que viene del avatar
  const top=d==="l"?13:19,add=[];for(let y=0;y<top;y++)for(let x=0;x<16;x++){if(G[y][x])continue;
      if((x>0&&G[y][x-1]&&G[y][x-1]!==CH_K)||(x<15&&G[y][x+1]&&G[y][x+1]!==CH_K)||(y>0&&G[y-1][x]&&G[y-1][x]!==CH_K)||(y<top-1&&G[y+1][x]&&G[y+1][x]!==CH_K)||(y===top-1&&d!=="l"&&false))add.push([x,y])}
  add.forEach(([x,y])=>{G[y][x]=CH_K});
  return G}
const OVS3={};
{const _ov=ovSprite;ovSprite=function(code){if(OVS3[code])return OVS3[code];let P=null,t=null;
  try{const L=trDec(code);t=chTraits(code);P={f:ch2Parts(trPix(L,"f")),b:ch2Parts(trPix(L,"b"))}}catch(e){console.error(e);return _ov.apply(this,arguments)}
  const out={},mk=(dir,flip)=>{let arr=null;Object.defineProperty(out,dir,{enumerable:true,get(){if(!arr)arr=[0,1,2,3,4,5,6,7].map(fr=>{const ff=fr>=4?[0,1,0,3][fr-4]:fr===2?0:fr;return chCanvas(ch2Frame(t,P,flip?"l":dir,ff),flip,ff===1||ff===3?-1:0)});return arr}})};
  mk("d");mk("l");mk("u");mk("r",true);return OVS3[code]=out}}
