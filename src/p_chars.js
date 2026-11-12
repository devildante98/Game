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
    sleeveless:[6,10].includes(L.top),longSl:[1,2,5,8,9,11,12,15,16,17,18,19,20,25,27,28].includes(L.top),bagOn:L.bp>0&&L.bp!==3,kimono:L.top===16};
  if(t.coat&&L.top===12)t.top="#f4f2ff";return t}
// ---------- dibujo de un fotograma (basado en el diseño de la muestra: cabeza grande, gorra ancha, cuerpo con brazos) ----------
// letras: K contorno · R/r/W gorro (color, sombra, brillo) · H/h pelo (y brillo) · S/s piel · E ojos · B/b ropa de arriba · A detalle
//         Y/y mochila · P/p ropa de abajo · G calzado
const CHH={// cabezas (filas 0-12) por dirección y tipo de gorro
 d:{cap:["......KKKK......","....KKRRRRKK....","...KRRRRWWRRK...","..KRRRRRWWRRRK..","..KRRRRRRRRRRK..",".KrrrrrrrrrrrrK.",".KKKKKKKKKKKKKK.","..KHHSSSSSSHHK..","..KHSSSSSSSSHK..","..KSSESSSSESSK..","..KSSESSSSESSK..","...KSSSSSSSSK...","....KKssssKK...."],
    none:["................",".....KKKKKK.....","...KKHHhhHHHKK..","..KHHHhhHHHHHHK.","..KHHHHHHHHHHHK.",".KHHHHHHHHHHHHK.",".KHHHHHHHHHHHHK.","..KHHSSSSSSHHK..","..KHSSSSSSSSHK..","..KSSESSSSESSK..","..KSSESSSSESSK..","...KSSSSSSSSK...","....KKssssKK...."],
    beanie:["................",".....KKKKKK.....","...KKRRWWRRRKK..","..KRRRRWWRRRRRK.","..KRRRRRRRRRRRK.",".KWWWWWWWWWWWWK.",".KHHHHHHHHHHHHK.","..KHHSSSSSSHHK..","..KHSSSSSSSSHK..","..KSSESSSSESSK..","..KSSESSSSESSK..","...KSSSSSSSSK...","....KKssssKK...."],
    wide:["................","......KKKK......","....KKRRWRKK....","....KRRRRRRK....","....KrrrrrrK....","KKKKRRRRRRRRKKKK","KrrrrrrrrrrrrrrK",".KKHHSSSSSSHHKK.","..KHSSSSSSSSHK..","..KSSESSSSESSK..","..KSSESSSSESSK..","...KSSSSSSSSK...","....KKssssKK...."]},
 u:{cap:["......KKKK......","....KKRRRRKK....","...KRRRRRRRRK...","..KRRRRRRRRRRK..","..KRRRRRRRRRRK..",".KrrrrrrrrrrrrK.",".KKKKKKKKKKKKKK.","..KHHHHHHHHHHK..","..KHHHHHHHHHHK..","..KHHHHHHHHHHK..","..KSHHHHHHHHSK..","...KHHHHHHHHK...","....KKHHHHKK...."],
    none:["................",".....KKKKKK.....","...KKHHhhHHHKK..","..KHHHhhHHHHHHK.","..KHHHHHHHHHHHK.",".KHHHHHHHHHHHHK.",".KHHHHHHHHHHHHK.","..KHHHHHHHHHHK..","..KHHHHHHHHHHK..","..KHHHHHHHHHHK..","..KSHHHHHHHHSK..","...KHHHHHHHHK...","....KKHHHHKK...."],
    beanie:["................",".....KKKKKK.....","...KKRRRRRRRKK..","..KRRRRRRRRRRRK.","..KRRRRRRRRRRRK.",".KWWWWWWWWWWWWK.",".KHHHHHHHHHHHHK.","..KHHHHHHHHHHK..","..KHHHHHHHHHHK..","..KHHHHHHHHHHK..","..KSHHHHHHHHSK..","...KHHHHHHHHK...","....KKHHHHKK...."],
    wide:["................","......KKKK......","....KKRRRRKK....","....KRRRRRRK....","....KrrrrrrK....","KKKKRRRRRRRRKKKK","KrrrrrrrrrrrrrrK",".KKHHHHHHHHHHKK.","..KHHHHHHHHHHK..","..KHHHHHHHHHHK..","..KSHHHHHHHHSK..","...KHHHHHHHHK...","....KKHHHHKK...."]},
 l:{cap:["......KKKK......","....KKRRRRKK....","...KRRRRRRRRK...","..KRRWWRRRRRRK..","..KRRRRRRRRRRK..","..KrrrrrrrrrrK..",".KKKKKKKKKKKKK..","...KSSSHHHHHK...","..KSSSSSHHHHK...","..KSESSSSHHHK...","..KSESSSSSHHK...","...KSSSSSSHK....","....KKsssKK....."],
    none:["................",".....KKKKKK.....","...KKHHhhHHKK...","..KHHHhhHHHHHK..","..KHHHHHHHHHHK..","..KHHHHHHHHHHK..","..KHHHHHHHHHHK..","...KSSSHHHHHK...","..KSSSSSHHHHK...","..KSESSSSHHHK...","..KSESSSSSHHK...","...KSSSSSSHK....","....KKsssKK....."],
    beanie:["................",".....KKKKKK.....","...KKRWWRRRKK...","..KRRWWRRRRRRK..","..KRRRRRRRRRRK..","..KWWWWWWWWWWK..","..KHHHHHHHHHHK..","...KSSSHHHHHK...","..KSSSSSHHHHK...","..KSESSSSHHHK...","..KSESSSSSHHK...","...KSSSSSSHK....","....KKsssKK....."],
    wide:["................","......KKKK......","....KKRWRRKK....","....KRRRRRRK....","....KrrrrrrK....","KKKKRRRRRRRRKKKK","KrrrrrrrrrrrrrrK","...KSSSHHHHHK...","..KSSSSSHHHHK...","..KSESSSSHHHK...","..KSESSSSSHHK...","...KSSSSSSHK....","....KKsssKK....."]}};
const CHB={// cuerpos (filas 13-18)
 d:["...KBBKSSKBBK...","..KBBBBKKBBBBK..",".KSKBBBBBBBBKSK.",".KSKbBBYYBBbKSK.","..KKbBBYYBBbKK..","...KbbBBBBbbK..."],
 u:["...KBBKYYKBBK...","..KBBKYYYYKBBK..",".KSKBKYYYYKBKSK.",".KSKbKYYYYKbKSK.","..KKbKyyyyKbKK..","...KbbKKKKbbK..."],
 l:["....KBBBBBYK....","...KBBBBBBYYK...","...KBSKBBBYYK...","...KBSKbBBYYK...","....KKKbBByK....","....KbbbbbbK...."]};
const CHL={// piernas (filas 19-23): [quieto, paso 1, paso 2]
 d:[["...KPPPPPPPPK...","...KPPPKKPPPK...","...KpPK..KPpK...","...KGGK..KGGK...","....KK....KK...."],["...KPPPPPPPPK...","...KPPPKKPPPK...","...KpPK..KPPK...","...KGGK..KpPK...","....KK...KGGK..."],["...KPPPPPPPPK...","...KPPPKKPPPK...","...KPPK..KPpK...","...KpPK..KGGK...","...KGGK...KK...."]],
 l:[["....KPPPPPPK....","....KPPPPPPK....","....KpPKKPpK....","....KGGKKGGK....",".....KK..KK....."],["....KPPPPPPK....","...KPPKKKPPPK...","...KpPK.KPpK....","..KGGK...KGGK...","...KK.....KK...."],["....KPPPPPPK....","....KPPPPPPK....","....KpPKKPpK....","....KGGKKGGK....",".....KK..KK....."]]};
const CHSK={// faldas y pantalón corto (filas 19-23)
 d:[["..KPPPPPPPPPPK..",".KPPPPPPPPPPPPK.","..KKSSK..KSSKK..","...KGGK..KGGK...","....KK....KK...."],["..KPPPPPPPPPPK..",".KPPPPPPPPPPPPK.","..KKSSK..KSSKK..","...KGGK..KSSK...","....KK...KGGK..."],["..KPPPPPPPPPPK..",".KPPPPPPPPPPPPK.","..KKSSK..KSSKK..","...KSSK..KGGK...","...KGGK...KK...."]],
 l:[["...KPPPPPPPK....","..KPPPPPPPPPK...","....KSSKKSSK....","....KGGKKGGK....",".....KK..KK....."],["...KPPPPPPPK....","..KPPPPPPPPPK...","...KSSK.KSSK....","..KGGK...KGGK...","...KK.....KK...."],["...KPPPPPPPK....","..KPPPPPPPPPK...","....KSSKKSSK....","....KGGKKGGK....",".....KK..KK....."]]};
const CHSH={d:[["...KPPPPPPPPK...","...KPPPKKPPPK...","...KSSK..KSSK...","...KGGK..KGGK...","....KK....KK...."],["...KPPPPPPPPK...","...KPPPKKPPPK...","...KSSK..KSSK...","...KGGK..KSSK...","....KK...KGGK..."],["...KPPPPPPPPK...","...KPPPKKPPPK...","...KSSK..KSSK...","...KSSK..KGGK...","...KGGK...KK...."]],
 l:[["....KPPPPPPK....","....KSSSSSSK....","....KSSKKSSK....","....KGGKKGGK....",".....KK..KK....."],["....KPPPPPPK....","...KSSKKKSSSK...","...KSSK.KSSK....","..KGGK...KGGK...","...KK.....KK...."],["....KPPPPPPK....","....KSSSSSSK....","....KSSKKSSK....","....KGGKKGGK....",".....KK..KK....."]]};
function chFrame(t,dir,fr){const d=dir==="r"?"l":dir,side=d==="l",si=fr===1?1:fr===3?2:0;
  const hk=t.hat==="cap"||t.hat==="hard"?"cap":t.hat==="beanie"?"beanie":t.hat==="wide"||t.hat==="top"?"wide":"none";
  const head=CHH[d][hk].map(r=>r.split("")),body=CHB[d].map(r=>r.split(""));
  const legsSrc=(t.skirt||t.dress)?CHSK:t.shorts?CHSH:CHL;const legs=(legsSrc[side?"l":"d"][si]).map(r=>r.split(""));
  const G=head.concat(body,legs);
  // pelo: calvo → piel
  if(t.bald)for(let y=0;y<13;y++)for(let x=0;x<16;x++)if(G[y][x]==="H"||G[y][x]==="h")G[y][x]=d==="u"&&y>6?"s":"S";
  // pelo largo por los hombros
  if(t.long){if(d==="d"){for(let y=7;y<16;y++){G[y][2]="H";G[y][13]="H";G[y][1]=y<13?"K":G[y][1];G[y][14]=y<13?"K":G[y][14]}G[16][2]="K";G[16][13]="K"}
    else if(d==="u"){for(let y=10;y<17;y++)for(let x=4;x<12;x++)G[y][x]="H";for(let y=10;y<17;y++){G[y][3]="K";G[y][12]="K"}G[17][4]="K";for(let x=4;x<12;x++)G[17][x]="K"}
    else{for(let y=7;y<16;y++){G[y][10]="H";G[y][11]="H";G[y][12]="K"}}}
  // barba
  if(t.beard&&d!=="u"){if(d==="d"){for(let x=4;x<12;x++){G[11][x]="H"}for(let x=6;x<10;x++)G[12][x]="H";G[11][7]="s";G[11][8]="s"}else{G[11][4]="H";G[11][5]="H";G[11][6]="H";G[12][6]="H";G[12][7]="H"}}
  // gafas
  if(t.glasses&&d!=="u"){const g=t.shades?"Q":"q";if(d==="d"){[4,5,6,9,10,11].forEach(x=>G[9][x]=g);G[9][7]="q";G[9][8]="q"}else{G[9][3]=g;G[9][4]=g;G[9][5]="q"}}
  // chaqueta abierta / bata / kimono
  if(t.open&&d==="d"){for(let y=14;y<18;y++){G[y][7]="A";G[y][8]="A"}}
  if(t.kimono&&d==="d"){G[14][6]="A";G[15][7]="A";G[14][9]="A";G[15][8]="A";for(let x=4;x<12;x++)G[17][x]="A"}
  if(t.coat){const rows=d==="l"?[[19,4,11]]:[[19,3,12]];rows.forEach(([y,a,b])=>{for(let x=a+1;x<b;x++)G[y][x]="B";G[y][a]="K";G[y][b]="K"});if(d==="d"){G[19][7]="K";G[19][8]="K"}}
  // manga larga
  if(t.longSl){for(let y=15;y<18;y++){if(d==="d"||d==="u"){if(G[y][2]==="S")G[y][2]="b";if(G[y][13]==="S")G[y][13]="b"}else if(G[y][5]==="S"&&y<17)G[y][5]="b"}}
  if(t.sleeveless&&d!=="l"){G[14][3]="S";G[14][12]="S"}
  // sin mochila: la mochila pasa a ser ropa
  if(!t.bagOn)for(let y=13;y<19;y++)for(let x=0;x<16;x++){if(G[y][x]==="Y")G[y][x]=d==="u"&&y<17?"b":"B";else if(G[y][x]==="y")G[y][x]="b";else if(d==="u"&&G[y][x]==="K"&&x>4&&x<11&&y>12&&y<18)G[y][x]="b"}
  // gorro de copa / casco / cinta / lazo / orejas
  if(t.hat==="top"&&d!=="u"){for(let y=0;y<4;y++)for(let x=5;x<11;x++)G[y][x]="R";G[3][5]="A";G[3][10]="A";for(let x=5;x<11;x++)G[4][x]="A"}
  if(t.hat==="band"){const y=d==="u"?6:6;for(let x=2;x<14;x++)if(G[y][x]==="H"||G[y][x]==="h")G[y][x]="R"}
  if(t.hat==="bow"){G[2][10]="R";G[2][11]="R";G[2][12]="R";G[3][11]="r";G[1][10]="K";G[1][12]="K"}
  if(t.hat==="ears"){G[0][3]="K";G[1][3]="H";G[0][12]="K";G[1][12]="H"}
  const A=t.hatC,P={K:CH_K,R:A,r:chDk(A,.3),W:chLt(A,.55),H:t.hair,h:chLt(t.hair,.25),S:t.skin,s:chDk(t.skin,.18),E:t.eye,B:t.top,b:chDk(t.top,.25),A:t.acc,
    Y:t.bag,y:chDk(t.bag,.25),P:t.dress?t.top:t.bot,p:chDk(t.dress?t.top:t.bot,.25),G:t.shoe,q:"#30303c",Q:"#22222c"};
  return G.map(r=>r.map(c=>c==="."?null:(P[c]||null)))}
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
