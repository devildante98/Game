// =====================================================================================
// PERSONAJES DE EXPLORACIÓN AL ESTILO CLÁSICO
// Sprites de 16×24 píxeles (dibujados a 32×48) con contorno oscuro, sombreado y proporciones de la saga.
// · Tu personaje y los NPC salen de su propio aspecto (el mismo editor de avatar): peinado, gorro, ropa, mochila…
// · Los entrenadores de las rutas se visten según su clase (Joven, Montañero, Científico…), la misma que se ve en
//   su combate, y si el navegador lo permite se toman los colores de la propia imagen del combate.
// · Los personajes de la historia (Dani, la Profesora, líderes…) salen en combate con su mismo aspecto.
// =====================================================================================
const CH_K="#1c1c26";
const chHex=h=>{h=String(h||"#888").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");const n=parseInt(h,16)||0;return[(n>>16)&255,(n>>8)&255,n&255]};
const chRgb=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const chMix=(h,t,k)=>{const a=chHex(h),b=chHex(t);return chRgb(a.map((v,i)=>v+(b[i]-v)*k))};
const chDk=(h,k)=>chMix(h,"#000000",k==null?.28:k),chLt=(h,k)=>chMix(h,"#ffffff",k==null?.25:k);
// ---------- aspecto → rasgos ----------
const CH_LONG=[2,3,4,8,11,12,16,17,20,21,23,24,25,26,28,29,30],CH_SKIRT=[2,4,9,12,13],CH_SHORT=[1,7,15],CH_DRESS=[4,23,26],CH_OPEN=[1,8,11,15,19,20,25,27];
function chHatKind(h){if(!h)return"";if([1,2,9,24,25,26,27,28].includes(h))return"cap";if([3,8,20].includes(h))return"beanie";if([4,10,11,19].includes(h))return"wide";
  if([5,14,15,22,12].includes(h))return"band";if(h===6)return"bow";if(h===16)return"ears";if(h===17)return"hard";if([18,23].includes(h))return"top";if([7,13,21].includes(h))return"";return"cap"}
function chTraits(code){const L=trDec(code),P=(k,i)=>TRP[k][i]!=null?TRP[k][i]:TRP[k][0];
  const t={skin:P("skin",L.sk),hair:P("hair",L.hc),eye:P("eye",L.ec),hatC:P("cl",L.hac),top:P("cl",L.tc),acc:P("cl",L.ac),bot:P("cl",L.bc),shoe:P("cl",L.sh),bag:P("cl",L.bpc),
    girl:L.b===1,long:CH_LONG.includes(L.hs),bald:L.hs===22,hat:chHatKind(L.hat),beard:L.brd>0&&L.brd!==1,glasses:L.gl>0&&L.gl!==5,shades:L.gl===3||L.hat===7,
    coat:L.top===12||L.top===8,dress:CH_DRESS.includes(L.top),skirt:CH_SKIRT.includes(L.bot),shorts:CH_SHORT.includes(L.bot),open:CH_OPEN.includes(L.top),
    sleeveless:[6,10].includes(L.top),bagOn:L.bp>0&&L.bp!==3,kimono:L.top===16};
  if(t.coat&&L.top===12)t.top="#f4f2ff";return t}
// ---------- dibujo de un fotograma ----------
function chFrame(t,dir,fr){const W=16,H=24,G=[];for(let y=0;y<H;y++)G.push(new Array(W).fill(null));
  const set=(x,y,c)=>{if(x>=0&&x<W&&y>=0&&y<H&&c)G[y][x]=c},box=(x,y,w,h,c)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)set(x+i,y+j,c)};
  const side=dir==="l"||dir==="r",back=dir==="u",step=fr===1?1:fr===3?-1:0;
  const S=t.skin,sS=chDk(t.skin,.18),Hc=t.hair,T=t.top,Bc=t.dress?t.top:t.bot,Sh=t.shoe,A=t.hatC;
  // --- piernas y calzado ---
  if(!side){
    const lh=step===1?1:0,rh=step===-1?1:0;
    if(t.skirt||t.dress){box(4,18,8,2,Bc);box(3,20,10,1,Bc);box(5,21-lh,2,1,S);box(9,21-rh,2,1,S);box(5,22-lh,2,1,Sh);box(9,22-rh,2,1,Sh)}
    else if(t.shorts){box(5,19,6,2,Bc);box(5,21-lh,2,1,S);box(9,21-rh,2,1,S);box(5,22-lh,2,1,Sh);box(9,22-rh,2,1,Sh)}
    else{box(5,19,3,3-lh,Bc);box(8,19,3,3-rh,Bc);box(5,22-lh,3,1,Sh);box(8,22-rh,3,1,Sh);set(7,21,null);set(8,21,null);set(7,20,null);set(8,20,null)}
  }else{
    const legs=step?[[3,8],[9,4]]:[[6,4]];
    if(t.skirt||t.dress){box(5,18,7,2,Bc);box(4,20,8,1,Bc)}
    if(step){const fx=step===1?4:9,bx=step===1?9:4;const lc=(t.skirt||t.dress||t.shorts)?S:Bc;box(fx,19,3,3,lc);box(bx,19,3,2,chDk(lc,.15));box(fx-1,22,4,1,Sh);box(bx,21,3,1,chDk(Sh,.15));if(t.shorts){box(fx,19,3,1,Bc);box(bx,19,3,1,Bc)}}
    else{const lc=(t.skirt||t.dress||t.shorts)?S:Bc;box(6,19,4,3,lc);if(t.shorts)box(6,19,4,1,Bc);box(5,22,5,1,Sh)}}
  // --- cuerpo ---
  if(!side){box(4,13,8,6,T);set(4,13,null);set(11,13,null);
    if(t.open&&!back){box(7,14,2,5,t.acc)}
    if(t.kimono&&!back){set(6,13,t.acc);set(7,14,t.acc);set(9,13,t.acc);set(8,14,t.acc);box(4,17,8,1,t.acc)}
    if(t.coat){box(4,19,8,2,T);if(!back){set(7,19,null);set(8,19,null);set(7,20,null);set(8,20,null)}}
    const sl=t.sleeveless?S:T;box(3,14,1,3,sl);box(12,14,1,3,sl);set(3,17,S);set(12,17,S);box(4,15,1,3,chDk(T,.18));box(11,15,1,3,chDk(T,.18));
    if(t.bagOn){if(back){box(5,13,6,5,t.bag);box(5,13,6,1,chLt(t.bag));box(6,17,4,1,chDk(t.bag))}else{box(5,13,1,3,t.bag);box(10,13,1,3,t.bag)}}
  }else{box(5,13,6,6,T);if(t.coat)box(5,19,6,2,T);const sl=t.sleeveless?S:T;box(7,14,2,3,chDk(sl,.1));set(7,17,S);set(8,17,S);if(t.bagOn){box(10,13,2,5,t.bag);set(10,13,chLt(t.bag))}}
  // --- cabeza ---
  if(!side){box(5,7,6,1,S);box(4,8,8,4,S);box(5,12,6,1,S);
    if(back){box(4,7,8,5,Hc);box(5,12,6,1,sS)}
    else{set(6,9,t.eye);set(6,10,t.eye);set(9,9,t.eye);set(9,10,t.eye);set(7,11,sS);set(8,11,sS);set(4,10,chMix(S,"#ff8080",.25));set(11,10,chMix(S,"#ff8080",.25))}
    if(!t.bald){box(5,3,6,1,Hc);box(4,4,8,3,Hc);if(!back){box(4,7,8,1,Hc);set(4,8,Hc);set(11,8,Hc);set(6,7,S);set(9,7,S)}}
    else box(5,4,6,3,S);
    if(t.long){box(3,8,1,7,Hc);box(12,8,1,7,Hc);if(back)box(4,12,8,3,Hc)}
    if(t.beard&&!back){box(5,11,6,2,Hc);set(7,11,chDk(Hc,.3));set(8,11,chDk(Hc,.3))}
    if(t.glasses&&!back){const gc=t.shades?"#22222c":"#30303c";box(5,9,2,1,gc);box(9,9,2,1,gc);set(7,9,gc);set(8,9,gc);if(!t.shades){set(5,10,null);}}
  }else{box(4,7,6,5,S);set(3,9,S);set(3,10,S);box(5,12,4,1,S);
    set(4,9,t.eye);set(4,10,t.eye);set(4,11,sS);
    if(!t.bald){box(5,3,6,1,Hc);box(4,4,8,3,Hc);box(4,7,2,1,Hc);box(8,7,4,5,Hc);set(9,12,Hc)}else box(5,4,6,3,S);
    if(t.long)box(9,8,3,7,Hc);
    if(t.beard){box(3,11,5,2,Hc)}
    if(t.glasses){const gc=t.shades?"#22222c":"#30303c";box(3,9,3,1,gc)}}
  // --- gorros ---
  const hat=t.hat;
  if(hat==="cap"){if(!side){box(5,2,6,1,A);box(4,3,8,3,A);if(!back){box(3,6,10,1,chDk(A,.3));set(7,4,chLt(A,.6));set(8,4,chLt(A,.6))}else box(4,6,8,1,chDk(A,.2))}
    else{box(5,2,6,1,A);box(4,3,8,3,A);box(1,6,6,1,chDk(A,.3));set(6,4,chLt(A,.6))}}
  else if(hat==="beanie"){box(5,1,6,1,A);box(4,2,8,4,A);box(4,6,8,1,chLt(A,.35));if(side)box(4,6,8,1,chLt(A,.35))}
  else if(hat==="wide"){box(5,1,6,1,A);box(4,2,8,3,A);box(4,4,8,1,chDk(A,.25));box(1,5,14,1,chDk(A,.1));box(2,6,12,1,chDk(A,.3))}
  else if(hat==="top"){box(5,0,6,5,A);box(5,4,6,1,t.acc);box(3,5,10,1,chDk(A,.2))}
  else if(hat==="hard"){box(5,2,6,1,A);box(4,3,8,3,A);set(7,2,chLt(A,.5));set(8,2,chLt(A,.5));box(3,6,10,1,chDk(A,.2))}
  else if(hat==="band"){box(4,5,8,1,A);if(back||side){set(side?12:11,6,A);set(side?12:12,7,A)}}
  else if(hat==="bow"){box(10,2,3,2,A);set(11,4,chDk(A,.3))}
  else if(hat==="ears"){box(4,1,2,2,Hc);box(10,1,2,2,Hc);set(4,2,chMix(Hc,"#ff9ec7",.5));set(11,2,chMix(Hc,"#ff9ec7",.5))}
  // --- sombreado automático: borde derecho más oscuro y borde superior más claro ---
  const out=G.map(r=>r.slice());
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=G[y][x];if(!c)continue;
    const r=x+1<W?G[y][x+1]:null,up=y>0?G[y-1][x]:null,lf=x>0?G[y][x-1]:null;
    if(!r&&!side)out[y][x]=chDk(c,.22);else if(side&&!lf&&dir!=="r")out[y][x]=c;if(!up&&c!==t.eye)out[y][x]=chLt(out[y][x],.18)}
  // --- contorno ---
  const fin=out.map(r=>r.slice());
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(out[y][x])continue;const n=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const yy=y+b,xx=x+a;return yy>=0&&yy<H&&xx>=0&&xx<W&&out[yy][xx]});if(n)fin[y][x]=CH_K}
  return fin}
function chCanvas(grid,flip,bob){const c=xc(32,48),g=c.getContext("2d");for(let y=0;y<24;y++)for(let x=0;x<16;x++){const col=grid[y][flip?15-x:x];if(!col)continue;g.fillStyle=col;g.fillRect(x*2,y*2+(y<19?bob*2:0),2,2)}return c}
// ---------- sustituye al dibujo anterior ----------
const OVS2={};
ovSprite=function(code){if(OVS2[code])return OVS2[code];let t;try{t=chTraits(code);const cls=CH_CLSOF[code];if(cls&&CH_SAMPLED[cls])Object.assign(t,CH_SAMPLED[cls])}catch(e){t=chTraits("")}
  const out={};["d","l","u"].forEach(dir=>{out[dir]=[0,1,2,3,4,5,6,7].map(fr=>{const f=fr>=4?[0,1,0,3][fr-4]:[0,1,0,3][fr]===undefined?0:fr;const ff=fr>=4?[0,1,0,3][fr-4]:fr===2?0:fr;
      return chCanvas(chFrame(t,dir,ff),false,ff===1||ff===3?-1:0)})});
  out.r=[0,1,2,3,4,5,6,7].map(fr=>{const ff=fr>=4?[0,1,0,3][fr-4]:fr===2?0:fr;return chCanvas(chFrame(t,"l",ff),true,ff===1||ff===3?-1:0)});
  return OVS2[code]=out};
// ---------- entrenadores de ruta: vestidos según su clase (la misma de su combate) ----------
const CH_CLS=[
  [/^youngster/,{b:0,hs:0,hc:1,hat:1,hac:5,top:0,tc:21,bot:1,bc:6}],[/^lass/,{b:1,hs:2,hc:1,top:0,tc:8,bot:2,bc:6}],
  [/^bugcatcher/,{b:0,hs:0,hc:1,hat:11,hac:21,top:0,tc:15,bot:1,bc:12}],[/^pokemonranger/,{b:1,hs:3,hc:1,top:11,tc:0,ac:27,bot:0,bc:11}],
  [/^swimmerf/,{b:1,hs:24,hc:3,top:6,tc:14,bot:1,bc:14}],[/^swimmer/,{b:0,hs:0,hc:1,top:6,tc:5,bot:1,bc:5}],
  [/^fisherman/,{b:0,hs:0,hc:12,hat:10,hac:13,top:3,tc:18,ac:9,bot:0,bc:6}],[/^hiker/,{b:0,hs:0,hc:1,hat:17,hac:12,brd:4,top:0,tc:12,bot:0,bc:13,bp:4,bpc:29}],
  [/^blackbelt/,{b:0,hs:5,hc:0,hat:5,hac:26,top:16,tc:27,ac:26,bot:0,bc:27}],[/^battlegirl/,{b:1,hs:20,hc:0,hat:5,hac:0,top:16,tc:27,ac:0,bot:0,bc:11}],
  [/^skierf/,{b:1,hs:24,hc:1,hat:3,hac:0,top:20,tc:27,bot:0,bc:5}],[/^skier/,{b:0,hs:0,hc:1,hat:3,hac:5,top:20,tc:5,bot:0,bc:6}],
  [/^picnicker/,{b:1,hs:3,hc:2,hat:4,hac:21,top:0,tc:3,bot:1,bc:12}],[/^firebreather/,{b:0,hs:22,top:6,tc:0,bot:0,bc:11}],
  [/^worker/,{b:0,hs:0,hc:1,hat:17,hac:2,top:13,tc:5,ac:25,bot:0,bc:5}],[/^scientistf/,{b:1,hs:16,hc:1,top:12,gl:1,bot:2,bc:11}],[/^scientist/,{b:0,hs:0,hc:12,top:12,gl:1,bot:0,bc:11}],
  [/^biker/,{b:0,hs:10,hc:5,top:25,tc:11,bot:0,bc:11,gl:3}],[/^roughneck/,{b:0,hs:10,hc:11,top:25,tc:11,bot:0,bc:26}],
  [/^acetrainerf/,{b:1,hs:24,hc:0,top:1,tc:3,ac:27,bot:2,bc:11}],[/^acetrainer/,{b:0,hs:1,hc:0,top:1,tc:3,ac:27,bot:0,bc:11}],
  [/^veteran/,{b:0,hs:18,hc:12,brd:4,top:8,tc:12,bot:0,bc:11}],[/^sailor/,{b:0,hs:5,hc:0,hat:24,hac:27,top:17,tc:27,ac:6,bot:0,bc:6}],
  [/^(psychic|medium)/,{b:1,hs:24,hc:8,top:4,tc:7,bot:4,bc:7}],[/^(lady|madame|aromalady|parasollady)/,{b:1,hs:17,hc:3,hat:4,hac:19,top:4,tc:19,bot:4,bc:19}],
  [/^pokefan/,{b:1,hs:4,hc:1,top:0,tc:8,bot:2,bc:5}],[/^dragontamer/,{b:0,hs:1,hc:5,top:25,tc:17,bot:0,bc:11}],[/^guitarist/,{b:0,hs:23,hc:0,top:25,tc:11,bot:0,bc:6}],
  [/^cyclist/,{b:1,hs:20,hc:3,hat:17,hac:14,top:11,tc:14,bot:5,bc:11}],[/^backpacker/,{b:0,hs:0,hc:1,hat:1,hac:3,top:0,tc:3,bot:1,bc:13,bp:4,bpc:0}],
  [/^birdkeeper/,{b:0,hs:0,hc:1,hat:3,hac:5,top:0,tc:5,bot:0,bc:13}],[/^ninja/,{b:0,hs:0,hc:0,hat:22,hac:6,top:16,tc:6,ac:16,bot:0,bc:6}],
  [/^(bug|grass)$/,{tc:15,hac:3}],[/^(fire)$/,{tc:0,hac:1}],[/^(water|ice)$/,{tc:5,hac:14}],[/^(electric)$/,{tc:2,hac:2}],[/^(psychic|fairy)$/,{tc:8,hac:20}],
  [/^(rock|ground|steel)$/,{tc:12,hac:10}],[/^(dark|ghost|poison)$/,{tc:7,hac:11}],[/^(dragon|flying|fighting|normal)$/,{tc:5,hac:0}]];
const CH_CLSOF={},CH_SAMPLED={};
function chClassLook(key,seed){const r=rngS(pvHash("cls"+seed)),L=Object.assign({},TRDEF,{sk:Math.floor(r()*4),hs:0,hc:Math.floor(r()*3),hat:0,bp:0,brd:0,gl:0,ey:0});
  const m=CH_CLS.find(c=>c[0].test(key||""));if(m)Object.assign(L,m[1]);else{L.tc=Math.floor(r()*12);L.bc=[6,11,12,16][Math.floor(r()*4)];L.hat=r()<.4?1:0;L.hac=Math.floor(r()*12)}
  const code=trEnc(L);CH_CLSOF[code]=key;chSample(key);return code}
// colores de la imagen del combate (si el servidor de imágenes lo permite)
const CH_TRY={};
function chSample(key){if(!key||CH_TRY[key]||typeof TSPR==="undefined")return;CH_TRY[key]=1;const im=new Image();im.crossOrigin="anonymous";
  im.onload=()=>{try{const c=document.createElement("canvas");c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext("2d");g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;
    let x0=c.width,x1=0,y0=c.height,y1=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){if(d[(y*c.width+x)*4+3]>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}}
    const H=y1-y0+1;if(H<10)return;const dom=(a,b)=>{const cnt={};for(let y=Math.floor(y0+H*a);y<Math.floor(y0+H*b);y++)for(let x=x0;x<=x1;x++){const i=(y*c.width+x)*4;if(d[i+3]<128)continue;const R=d[i],G=d[i+1],B=d[i+2];const mx=Math.max(R,G,B),mn=Math.min(R,G,B);
        if(mx<45)continue;if(R>180&&G>120&&B>80&&R>G&&G>B&&R-B<110&&R-B>30)continue;const k=(R>>4)+","+(G>>4)+","+(B>>4);cnt[k]=(cnt[k]||0)+1}
      const best=Object.entries(cnt).sort((p,q)=>q[1]-p[1])[0];if(!best)return null;return chRgb(best[0].split(",").map(v=>(+v<<4)+8))};
    const top=dom(.36,.6),bot=dom(.66,.9),head=dom(.02,.16),o={};if(top)o.top=top;if(bot)o.bot=bot;if(head){o.hatC=head;o.hair=head}
    CH_SAMPLED[key]=o;Object.keys(CH_CLSOF).forEach(cd=>{if(CH_CLSOF[cd]===key)delete OVS2[cd]})}catch(e){}};
  im.onerror=()=>{};im.src=TSPR+key+".png"}
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{EX.npcs.forEach(n=>{if(n.t&&n.t.length&&!n.story&&n.n)n.look=chClassLook(exTrKey(n.n),n.id)})}catch(e){console.error(e)}return r}}
// ---------- personajes de la historia: en combate salen con su mismo aspecto ----------
{const _xb=exBattle;exBattle=function(cfg,npc){try{if(cfg&&cfg.trainer&&cfg.tsrc&&!cfg.tsrc.c){const n=(npc&&npc.story?npc:null)||EX.npcs.find(q=>q.story&&q.n===cfg.trainer&&q.look);
    if(n&&n.look&&!(n.t&&n.t.length&&!n.story))cfg.tsrc=Object.assign({},cfg.tsrc,{c:n.look})}}catch(e){}return _xb.apply(this,arguments)}}
