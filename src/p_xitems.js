// =====================================================================================
// OBJETOS EN EL MUNDO DE EXPLORACIÓN
// · NPC que regalan un objeto al hablar con ellos (en pueblos y rutas, y el vecino de cada casa).
// · Muebles en los que hay algo: neveras, estanterías, armarios, cómodas, baúles, encimeras… y papeleras.
// · Con el Modo Random (opción «Objetos aleatorios» del PC) todos estos objetos, y los del suelo, son al azar.
// Cada objeto se recoge una sola vez por partida (se guarda en S.ex, así que va con cada ranura de guardado).
// =====================================================================================
RNDR.push(["i","🎁 Objetos aleatorios","Los objetos del suelo, de los muebles y los que te regalan son totalmente al azar (cualquier objeto del juego)."]);
const XIT_POOL=[
  ["pot","pot","pb","pb","eter","oran","cheri","pecha","rev"],
  ["spot","spot","sb","sb","rev","eter","elix","sitrus","hb_norm","hb_fire","hb_water","hb_grass","rb_fire","rb_water"],
  ["hpot","ub","ub","rev","elix","cand","sitrus","lum","fire-stone","water-stone","thunder-stone","leaf-stone","moon-stone","hb_elec","hb_fight","hb_psy","everst","xshare"],
  ["hpot","mpot","ub","mrev","cand","cand","melix","ppup","left","sash","qclaw","scope","shell","lucky","wherb","dusk-stone","shiny-stone","dawn-stone","ice-stone"],
  ["mpot","mrev","ub","cand","cand","ppup","ppmax","lorb","avest","cband","cspecs","cscarf","ebelt","rhelm","mint15","mint1","mint3","mint11"]];
// lo que regalan los NPC: algo más especial
const XIT_GIFT=[
  ["pb","pot","eter","oran","sitrus"],
  ["sb","rev","hb_fire","hb_water","hb_grass","hb_elec","amcoin","xshare"],
  ["ub","cand","fire-stone","water-stone","thunder-stone","leaf-stone","moon-stone","everst","lucky","sash"],
  ["ub","cand","left","lorb","qclaw","sitrus","wherb","shiny-stone","dusk-stone","linking-cord","kings-rock"],
  ["mrev","cand","ppmax","cband","cspecs","cscarf","avest","ebelt","mb"]];
const xItTier=()=>{let b=0;try{b=xbCount()}catch(e){}return Math.max(0,Math.min(4,Math.floor(b/2)))};
let XIT_ALL=null;
function xItRandom(){if(!XIT_ALL)XIT_ALL=ITEMS.map(i=>i[0]).filter(k=>k!=="crys");return XIT_ALL[Math.floor(Math.random()*XIT_ALL.length)]}
const xItRnd=()=>{try{return !!rnD().i}catch(e){return false}};
function xItPick(gift){if(xItRnd())return xItRandom();const L=(gift?XIT_GIFT:XIT_POOL)[xItTier()];return L[Math.floor(Math.random()*L.length)]}
const xItQty=id=>/^(pb|sb|pot|eter|oran|cheri|pecha)$/.test(id)&&!xItRnd()?1+Math.floor(Math.random()*2):1;
function xItGive(id,q){q=q||1;xgRun(()=>{S.bag[id]=(S.bag[id]||0)+q});save();snd("lvl");return (q>1?q+" × ":"")+IN2(id)}
// los objetos del suelo también pueden ser aleatorios
{const _l=exLoot;exLoot=function(){if(xItRnd())return xItRandom();return _l.apply(this,arguments)}}
const xGot=()=>{const st=exSt();st.got=st.got||{};return st.got};
// ---------- casillas especiales ----------
const XIT_ROOMS=/^(casa|casa_up|lab|centro.*|tienda_.*|.*_h\d|.*_h2b)$/;
const XIT_FURN="LZCEtKi%";
const XIT_NAME={L:"la nevera",Z:"la estantería",C:"el armario",E:"la cómoda",t:"el baúl de juguetes",K:"la encimera",i:"la mesita de noche","%":"la papelera"};
const XIT_EMPTY={"%":["Es una papelera. Solo hay papeles arrugados.","La papelera está vacía… ¡qué limpio todo!","En la papelera hay un envoltorio de Caramelo Raro. Vacío, claro."]};
// papelera: se busca un hueco junto a la pared que no corte el paso
function xBinSpot(m,M,G){if(!/(^casa$|_h\d|_h2b|^centro|^tienda_|^lab$)/.test(m))return null;const H=G.length,W=G[0].length,fl="F";
  const free=(x,y)=>{const c=G[y]&&G[y][x];return c!=null&&!EXBLK.includes(c)&&!XFURN.includes(c)&&c!=="U"&&!(M.w&&M.w[c])&&!"Pixyq%".includes(c)||c==="y"||c==="R"};
  const reach=(bx,by)=>{const seen=new Set();let st=null;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=G[y][x];if(M.w&&M.w[c]){st=[x,y];break}}if(!st)return -1;
    const q=[st];seen.add(st+"");while(q.length){const[x,y]=q.shift();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const nx=x+a,ny=y+b,k=nx+","+ny;if(seen.has(k)||(nx===bx&&ny===by))return;const c=G[ny]&&G[ny][nx];if(c==null)return;if(!(free(nx,ny)||(M.w&&M.w[c])))return;seen.add(k);q.push([nx,ny])})}return seen.size};
  const base=reach(-1,-1),r=rngS(pvHash("bin"+m)),C=[];
  for(let y=2;y<H-2;y++)for(let x=1;x<W-1;x++){if(G[y][x]!==fl)continue;const up=G[y-1][x];if(!(up==="W"||up==="x"||XFURN.includes(up)||"Zi".includes(up)))continue;if(Math.abs(x-7)<2&&y>6)continue;C.push([x,y])}
  for(let i=C.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[C[i],C[j]]=[C[j],C[i]]}
  for(const[x,y]of C){if(reach(x,y)===base-1)return[x,y]}return null}
{const _l=exLoad;exLoad=function(m,x,y,f){const r=_l.apply(this,arguments);try{const M=EXM[m];const b=xBinSpot(m,M,EX.grid);if(b&&!(b[0]===EX.x&&b[1]===EX.y))EX.grid[b[1]][b[0]]="%";EX.hid=xHidden(m)}catch(e){console.error(e)}return r}}
// en qué muebles de cada sala hay algo (siempre los mismos para cada sala)
function xHidden(m){if(!XIT_ROOMS.test(m))return {};const G=EX.grid,r=rngS(pvHash("hid"+m)),C=[];
  for(let y=0;y<G.length;y++)for(let x=0;x<G[y].length;x++)if(XIT_FURN.includes(G[y][x]))C.push([x,y]);
  // un mueble por mueble repetido (las neveras o estanterías de varias casillas cuentan una vez)
  const seenCh={},U=[];C.forEach(([x,y])=>{const c=G[y][x],k=c+(c==="Z"||c==="K"?y:"");if(seenCh[k])return;seenCh[k]=1;U.push([x,y])});
  for(let i=U.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[U[i],U[j]]=[U[j],U[i]]}
  const n=/_h\d|_h2b|^casa/.test(m)?2:1,o={};U.slice(0,n).forEach(([x,y])=>{o[x+","+y]=1});
  const bin=C.find(([x,y])=>G[y][x]==="%");if(bin&&r()<.6)o[bin[0]+","+bin[1]]=1;return o}
// dibujo y choque de la papelera
function xBin(x){const k="BIN"+(x%2);if(XG[k])return XG[k];const c=xc(32,48),g=c.getContext("2d"),R=(a,b,w,h,col)=>xr(g,a,b,w,h,col);xdisc(g,16,45,10,3,"rgba(0,0,0,.22)");
  R(8,22,16,23,xInk);R(9,23,14,21,x%2?"#7d8aa6":"#6f9a7a");R(9,23,14,3,"rgba(255,255,255,.35)");[12,16,20].forEach(a=>R(a,27,1,15,"rgba(0,0,0,.18)"));R(7,20,18,4,xInk);R(8,21,16,2,x%2?"#a8b4cc":"#94c2a0");R(13,18,6,3,xInk);R(14,19,4,1,"#ddd");
  R(11,16,3,4,"#f6f2e6");R(17,15,3,5,"#e8e2cc");return XG[k]=c}
{const _g=xGround;xGround=function(x,y,fr){try{if(exAt(x,y)==="%")return xFloor((EX.M&&EX.M.fl)||"wood",x,y)}catch(e){}return _g.apply(this,arguments)}}
{const _o=xObj;xObj=function(c,x,y){if(c==="%")return xBin(x);return _o.apply(this,arguments)}}
{const _b=exBlocked;exBlocked=function(x,y){if(exAt(x,y)==="%")return true;return _b.apply(this,arguments)}}
// ---------- NPC que regalan objetos ----------
const XGF_NPC=[["Excursionista","¡Hola! Llevo tanto tiempo caminando que me sobran cosas en la mochila.","Toma, a ti te hará más falta que a mí."],
  ["Señora amable","¡Qué alegría ver a alguien tan joven de aventura!","Llévate esto, por si tus Pokémon se cansan."],
  ["Abuelo","De joven yo también fui entrenador, ¿sabes? Ganaba poco, pero me lo pasaba en grande.","Este objeto me trajo suerte. Ahora es tuyo."],
  ["Niña","¡Mira lo que me he encontrado! Pero mi mamá dice que no lo necesito…","¡Te lo regalo! ¡Úsalo bien!"],
  ["Pescador","Hoy no pican… pero al menos encontré algo flotando en el agua.","¡Para ti! Yo prefiero mi caña."],
  ["Chico deportista","¡Uf, qué carrera! Corro por aquí todas las mañanas.","Me han dado esto en la meta, pero no tengo Pokémon. ¡Quédatelo!"],
  ["Botánica","Estudio las plantas de esta zona. ¡Hay bayas por todas partes!","Te doy una muestra de mi colección."],
  ["Coleccionista","Colecciono objetos raros… y tengo demasiados repetidos.","Uno de mis repetidos para tu colección."]];
const XGF_THX=["¡Cuida bien de tus Pokémon!","¿Te sirvió lo que te di? ¡Me alegro!","¡Suerte con los gimnasios!","Si vuelves por aquí, ¡salúdame!"];
function xGiftSpots(m,M,taken){const music=M.music;let n=0;if(music==="town"&&!/_h|casa/.test(m))n=2;else if(["route","forest","beach","cave"].includes(music))n=1;if(!n)return[];
  const G=M.g,H=G.length,W=G[0].length,blk=c=>EXBLK.includes(c)||XFURN.includes(c)||c==="U"||c==="T"||c==="%",ok=c=>c===M.base||c==="="||c===","||c==="P";
  // casillas alcanzables desde las entradas del mapa
  const seen=new Set(),q=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(M.w&&M.w[G[y][x]]){seen.add(x+","+y);q.push([x,y])}
  while(q.length){const[x,y]=q.shift();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const nx=x+a,ny=y+b,k=nx+","+ny;if(seen.has(k))return;const c=G[ny]&&G[ny][nx];if(c==null)return;if(EXBLK.includes(c)&&!(M.w&&M.w[c]))return;seen.add(k);q.push([nx,ny])})}
  const r=rngS(pvHash("gift"+m)),C=[];
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!ok(G[y][x])||!seen.has(x+","+y)||taken.has(x+","+y))continue;let good=true;
    for(let a=-1;a<=1&&good;a++)for(let b=-1;b<=1;b++){const c=G[y+b][x+a];if(blk(c)||(M.w&&M.w[c])||c==="H"||taken.has((x+a)+","+(y+b))){good=false;break}}if(good)C.push([x,y])}
  for(let i=C.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[C[i],C[j]]=[C[j],C[i]]}
  const out=[];for(const c of C){if(out.every(o=>Math.abs(o[0]-c[0])+Math.abs(o[1]-c[1])>8))out.push(c);if(out.length>=n)break}return out}
{const _n=stNPCs;stNPCs=function(m){const L=_n(m);try{const M=EXM[m];if(!M)return L;const taken=new Set();(M.npc||[]).forEach(n=>taken.add(n.x+","+n.y));L.forEach(n=>taken.add(n.x+","+n.y));
  xGiftSpots(m,M,taken).forEach(([x,y],i)=>{const id="gift:"+m+":"+i,k=Math.abs(pvHash(id))%XGF_NPC.length,D=XGF_NPC[k];
    L.push({sid:"gift"+i,x:x,y:y,f:"d",n:D[0],look:exNpcLook(id),t:[],sight:0,txt:"",id:id,story:1,still:1,beat:true,px:x,py:y,f0:"d",gift:{id:id,k:k}})})}catch(e){console.error(e)}return L}}
// ---------- hablar y mirar ----------
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&!EX.cut){const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy,c=exAt(x,y),G=xGot();
    const n=EX.npcs.find(q=>q.px===x&&q.py===y);
    if(n&&n.gift){n.f={u:"d",d:"u",l:"r",r:"l"}[EX.f];const D=XGF_NPC[n.gift.k],key=n.gift.id;snd("ui");
      if(G[key]){exSay([n.n+": «"+XGF_THX[Math.abs(pvHash(key))%XGF_THX.length]+"»"]);return}
      exSay([n.n+": «"+D[1]+"»","«"+D[2]+"»"],()=>{const id=xItPick(true),q=xItQty(id);G[key]=1;const t=xItGive(id,q);exSay(["¡"+n.n+" te ha dado "+t+"!","Lo guardas en la Mochila."])});return}
    // el vecino de cada casa también te da algo la primera vez que hablas con él
    if(n&&Array.isArray(n.chat)&&/_h1$/.test(EX.map)&&!G["chat:"+n.id]){n.f={u:"d",d:"u",l:"r",r:"l"}[EX.f];snd("ui");
      exSay(n.chat.map((l,k)=>k===0?n.n+": «"+l+"»":"«"+l+"»").concat(["«¡Ah! Y llévate esto, que a mí no me hace falta.»"]),()=>{G["chat:"+n.id]=1;const id=xItPick(true),t=xItGive(id,xItQty(id));exSay(["¡Has recibido "+t+"!","Lo guardas en la Mochila."])});return}
    if(!n&&XIT_ROOMS.test(EX.map)&&XIT_FURN.includes(c)){const key=EX.map+":"+x+","+y,hid=EX.hid||{};
      if(hid[x+","+y]&&!G[key]){G[key]=1;const id=xItPick(false),t=xItGive(id,xItQty(id));exSay(["Miras en "+XIT_NAME[c]+"…","¡Has encontrado "+t+"!","Lo guardas en la Mochila."]);return}
      if(c==="%"){snd("ui");const L=XIT_EMPTY["%"];exSay([L[(x+y)%L.length]]);return}}}}catch(e){console.error(e)}
  return _i.apply(this,arguments)}}
// =====================================================================================
// INFORMACIÓN DE LOS OBJETOS
// · Al conseguir un objeto en Exploración (suelo, muebles, regalos…), el diálogo explica qué hace.
// · En la Mochila: un recuadro muestra la descripción del objeto que tienes seleccionado (ratón, teclado o mando),
//   y al ir a usarlo o equiparlo también se ve arriba.
// =====================================================================================
const xItDesc=id=>{const it=ITEMS.find(i=>i[0]===id);return it?String(it[6]||""):""};
let XIT_BYNAME=null;
function xItByName(nm){if(!XIT_BYNAME){XIT_BYNAME={};ITEMS.forEach(i=>{XIT_BYNAME[String(i[1]).toLowerCase()]=i[0]})}return XIT_BYNAME[String(nm).trim().toLowerCase()]||null}
function xItInfoLine(id){const d=xItDesc(id),it=ITEMS.find(i=>i[0]===id)||[];if(!d)return null;
  const ic=it[7]==="mt"?"📀 ":it[7]==="hold"?"🎽 ":it[7]==="evo"?"🌟 ":it[7]==="crys"?"💎 ":it[7]==="mint"?"🌿 ":"ℹ️ ";return ic+IN2(id)+": "+d}
{const _s=exSay;exSay=function(lines,cb){try{if(Array.isArray(lines)&&EX.on){const out=[];let added=false;
    lines.forEach(l=>{out.push(l);if(added)return;const t=String(l).replace(/^§[^|]*\|/,"");
      const m=t.match(/(?:¡Has encontrado|te ha dado|¡Has recibido|¡Recibes)\s+(?:(\d+)\s*×\s*)?([^!¡]+?)!/);
      if(m){const id=xItByName(m[2]);if(id&&!/^(pb|pot)$/.test(id)){const info=xItInfoLine(id);if(info){out.push(info);added=true}}}});
    lines=out}}catch(e){}return _s.call(this,lines,cb)}}
// recuadro de información en la Mochila
{const _p=xgPanel;xgPanel=function(){const r=_p.apply(this,arguments);try{const box=$("exTeam");if(box)box.classList.remove("xucomp");const g=box&&box.querySelector(".xgb");if(g&&!box.querySelector(".xginfo")){
    g.insertAdjacentHTML("beforebegin",'<div class="xginfo">ℹ️ Pasa el ratón o mueve el mando sobre un objeto para ver qué hace.</div>');const inf=box.querySelector(".xginfo");
    const show=e=>{const c=e.target.closest&&e.target.closest(".xgit[data-xgi]");if(!c)return;const l=xItInfoLine(c.dataset.xgi);if(l&&inf.textContent!==l)inf.textContent=l};
    g.addEventListener("mouseover",show);g.addEventListener("focusin",show)}}catch(e){}return r}}
// también al ir a usar o equipar el objeto
{const _u=xuUI;xuUI=function(){const r=_u.apply(this,arguments);try{const box=$("exTeam");if(box)box.classList.add("xucomp");const h=box&&box.querySelector(".xgh");if(h&&XU.id&&!box.querySelector(".xuinfo")){const l=xItInfoLine(XU.id);if(l)h.insertAdjacentHTML("afterend",'<div class="xuinfo">'+esc(l)+'</div>')}}catch(e){}return r}}
