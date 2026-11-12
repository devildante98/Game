// =====================================================================================
// OBJETOS DE CAMPO (como en la saga)
// · Objetos ocultos en el suelo de cada mapa: mira la casilla y pulsa A. El Zahorí (te lo da Lía) pita si hay alguno cerca.
// · Repelente (100 pasos) y Superrepelente (200 pasos): no salen Pokémon salvajes.
// · Cuerda Huida: sales al instante de una cueva.
// Se compran en las Tiendas de Exploración y se usan desde la Mochila («Objetos de campo»).
// =====================================================================================
const FD_IT={rep:{n:"Repelente",ic:"🧴",p:1200,d:"Durante 100 pasos no salen Pokémon salvajes."},srep:{n:"Superrepelente",ic:"🧪",p:2000,d:"Durante 200 pasos no salen Pokémon salvajes."},
  esc:{n:"Cuerda Huida",ic:"🪢",p:1500,d:"Te saca al instante de una cueva."}};
const fdF=()=>{const f=stSt().f;f.fi=f.fi&&typeof f.fi==="object"?f.fi:{};return f};
const fdN=k=>fdF().fi[k]|0;
const fdAdd=(k,n)=>{const f=fdF();f.fi[k]=Math.max(0,(f.fi[k]|0)+n);save()};
const fdRep=()=>{try{return (stSt().f.repN|0)>0}catch(e){return false}};
// ---------- Repelente ----------
{const _e=exEncounter;exEncounter=function(){if(fdRep())return;return _e.apply(this,arguments)}}
{const _a=exArrive;exArrive=function(){const r=_a.apply(this,arguments);try{const f=stSt().f;if((f.repN|0)>0&&!EX.cut){f.repN--;if(!f.repN){const k=fdN("srep")?"srep":fdN("rep")?"rep":null;
  setTimeout(()=>{if(EX.dlg||EX.cut)return;stRun(async()=>{await sSay(["El efecto del Repelente se ha terminado."]);if(k){const c=await sChoice("¿Quieres usar otro "+FD_IT[k].n+"?",[{t:"Sí"},{t:"No"}]);if(c===0)fdUse(k,true)}})},200)}}}catch(e){}return r}}
// ---------- usar ----------
const fdCave=()=>!!(EX.M&&(EX.M.base==="c"||EX.M.music==="cave"));
function fdUse(k,quiet){const f=fdF();
  if(k==="rep"||k==="srep"){if(!fdN(k))return;fdAdd(k,-1);f.repN=(f.repN|0)+(k==="srep"?200:100);save();snd("lvl");if(!quiet)exSay(["Has usado un "+FD_IT[k].n+".","Durante "+f.repN+" pasos no te molestarán los Pokémon salvajes."]);return}
  if(k==="esc"){if(!fdCave()){exSay(["La Cuerda Huida solo se puede usar dentro de una cueva."]);return}const w=EX.M.w&&EX.M.w["1"];if(!w){exSay(["Aquí no funciona."]);return}if(!fdN("esc"))return;fdAdd("esc",-1);
    stRun(async()=>{snd("ui");await sSay(["¡Usas la Cuerda Huida!"]);await sFade("fade",400);EX.surf=0;exLoad(w.to,w.x,w.y,w.f||"d");try{exFollowerReset()}catch(e){}await sFade("fadein",450)});return}
  if(k==="zah")fdScan();
  if(k==="bike"&&typeof bkSet==="function")bkSet(!EX.bike);
  if(k==="rod")exSay(["Mira hacia el agua y pulsa A para pescar."])}
// ---------- objetos ocultos (2 por mapa exterior, siempre en el mismo sitio) ----------
const FD_HID={};
function fdHidden(m){if(FD_HID[m])return FD_HID[m];const M=EXM[m];if(!M||M.base==="F")return FD_HID[m]=[];
  const r=rngS(pvHash("hid"+m)),L=[],ok=c=>c==="."||c===","||c==="c"||c==="s",g=M.g;let tries=0;
  while(L.length<2&&tries++<400){const x=1+Math.floor(r()*(g[0].length-2)),y=2+Math.floor(r()*(g.length-3));if(!ok(g[y][x])||L.some(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)<6))continue;
    if(M.w)for(const c in M.w){}L.push([x,y,r()])}return FD_HID[m]=L}
const fdKey=(m,x,y)=>m+":"+x+","+y;
const fdFound=(m,x,y)=>!!(fdF().hid||{})[fdKey(m,x,y)];
function fdLeft(){return fdHidden(EX.map).filter(p=>!fdFound(EX.map,p[0],p[1]))}
function fdPick(p){const f=fdF();f.hid=f.hid||{};f.hid[fdKey(EX.map,p[0],p[1])]=1;
  if(p[2]<.25){const k=p[2]<.1?"esc":p[2]<.18?"rep":"srep";fdAdd(k,1);snd("lvl");exSay(["¡Había algo escondido en el suelo!","¡Has encontrado: "+FD_IT[k].n+"!","Lo guardas en la Mochila (Objetos de campo)."]);return}
  let it="pot";try{it=typeof xItPick==="function"?xItPick(false):exLoot()}catch(e){it=exLoot()}
  xgRun(()=>{S.bag[it]=(S.bag[it]||0)+1});save();snd("lvl");exSay(["¡Había algo escondido en el suelo!","¡Has encontrado: "+IN2(it)+"!","Lo guardas en la Mochila."])}
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&!EX.cut&&EX.M&&EX.M.base!=="F"){const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy;
  const p=fdLeft().find(q=>(q[0]===x&&q[1]===y)||(q[0]===EX.x&&q[1]===EX.y));if(p&&!EX.npcs.some(n=>n.px===x&&n.py===y)){fdPick(p);return}}}catch(e){console.error(e)}return _i.apply(this,arguments)}}
// Zahorí: pita y te dice hacia dónde
function fdScan(){if(EX.M&&EX.M.base==="F"){exSay(["El Zahorí no reacciona aquí dentro."]);return}EX.zahT=performance.now();
  const L=fdLeft().map(p=>({p:p,d:Math.abs(p[0]-EX.x)+Math.abs(p[1]-EX.y)})).sort((a,b)=>a.d-b.d),n=L[0];
  if(!n||n.d>7){snd("ui");exSay(["… El Zahorí no reacciona.","No hay nada escondido por aquí cerca."]);return}
  snd("lvl");setTimeout(()=>snd("lvl"),180);if(n.d===0||n.d===1){exSay(["¡Bip, bip, bip! ¡El Zahorí pita muchísimo!","¡Hay algo escondido justo aquí al lado! Mira a tu alrededor y pulsa A."]);return}
  const dx=n.p[0]-EX.x,dy=n.p[1]-EX.y,dir=(Math.abs(dy)>=Math.abs(dx)?(dy<0?"norte":"sur"):(dx<0?"oeste":"este"))+(Math.abs(dx)&&Math.abs(dy)?(Math.abs(dy)>=Math.abs(dx)?(dx<0?" (un poco al oeste)":" (un poco al este)"):(dy<0?" (un poco al norte)":" (un poco al sur)")):"");
  exSay(["¡Bip… bip…! ¡El Zahorí reacciona!","Hay algo escondido hacia el "+dir+"."+(n.d<=3?" ¡Muy cerca!":"")])}
{const _d=exDraw;exDraw=function(ts){const r=_d.apply(this,arguments);try{if(!EX.zahT||!EX.cv)return r;const e=(performance.now()-EX.zahT)/700;if(e>1){EX.zahT=0;return r}const g=EX.cv.getContext("2d"),cam=EX.cam||[0,0];g.setTransform(EXS,0,0,EXS,0,0);
  const X=EX.px*EXTL-cam[0]+16,Y=EX.py*EXTL-cam[1]+16;g.strokeStyle="rgba(120,230,255,"+(1-e)+")";g.lineWidth=3;g.beginPath();g.arc(X,Y,10+e*90,0,7);g.stroke()}catch(x){}return r}}
// Lía te da el Zahorí
{const _l=STX.lia;STX.lia=function(){const f=stSt().f;if(EX.map==="lab"&&!f.zah)return stRun(async()=>{await sSay(S_("Lía","¡Hola! Ya sé que estás ayudando a la Profesora. ¡Toma, esto te vendrá muy bien!"));snd("lvl");f.zah=1;save();
  await sSay(["¡Has recibido el Zahorí!","Úsalo desde la Mochila (Objetos de campo): pita si hay objetos escondidos cerca."]);await sSay(S_("Lía","Hay objetos escondidos en el suelo de casi todas partes. Cuando el Zahorí pite, mira bien a tu alrededor y pulsa A."))});return _l.apply(this,arguments)}}
// si ya pasaste por el laboratorio con Lía allí, te lo da la próxima vez que hables con ella; si la historia está avanzada, te llega por correo
setInterval(()=>{try{if(!EX.on||EX.title||EX.cut||EX.dlg||EX.battle)return;const f=stSt().f;if(f.zah||(stSt().s|0)<4)return;f.zah=1;save();stRun(async()=>{snd("lvl");await sSay(["📦 Te llega un paquete de Lía, la ayudante de la Profesora.","¡Has recibido el Zahorí! Úsalo desde la Mochila (Objetos de campo): pita si hay objetos escondidos cerca."])})}catch(e){}},3000);
// ---------- en la Mochila: objetos de campo y objetos clave ----------
{const _p=xgPanel;xgPanel=function(){const r=_p.apply(this,arguments);try{const box=$("exTeam");if(!box||box.querySelector(".fdsec"))return r;const f=fdF(),tiles=[];
  Object.keys(FD_IT).forEach(k=>{if(fdN(k)>0)tiles.push([k,FD_IT[k].ic,FD_IT[k].n,"×"+fdN(k),FD_IT[k].d])});
  if(f.zah)tiles.push(["zah","📡","Zahorí","","Pita si hay objetos escondidos cerca."]);if(f.bike)tiles.push(["bike","🚲","Bici","",EX.bike?"Pulsa para bajarte.":"Pulsa para montar."]);
  if(f.rod)tiles.push(["rod","🎣",FISH_RN[f.rod|0]||"Caña","","Mira hacia el agua y pulsa A para pescar."]);
  if(f.repN>0)tiles.push(["","🛡️","Repelente activo",f.repN+" pasos","No salen Pokémon salvajes."]);
  if(!tiles.length)return r;
  const h='<div class="fdsec"><b class="xgs">🧭 Objetos de campo</b><div class="fdl">'+tiles.map(t=>'<div class="fdit"><span>'+t[1]+'</span><div><b>'+esc(t[2])+' <small>'+esc(t[3])+'</small></b><small>'+esc(t[4])+'</small></div>'+(t[0]?'<button type="button" class="mini" data-fdu="'+t[0]+'">Usar</button>':'')+'</div>').join("")+'</div></div>';
  const bag=box.querySelector(".xgs:last-of-type");box.insertAdjacentHTML("beforeend",h)}catch(e){console.error(e)}return r}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-fdu]");if(!b)return;e.preventDefault();e.stopPropagation();const k=b.dataset.fdu;snd("ui");
  try{const t=$("exTeam");if(t)t.hidden=true;if(typeof XFM!=="undefined")XFM=null}catch(x){}setTimeout(()=>fdUse(k),120)},true);
// ---------- en las Tiendas: se venden los objetos de campo ----------
{const _u=xsUI;xsUI=function(){const r=_u.apply(this,arguments);try{if(XSH.tab!=="buy")return r;const box=$("exShop"),l=box&&box.querySelector(".xsl");if(!l)return r;
  l.insertAdjacentHTML("afterbegin",Object.keys(FD_IT).map(k=>{const I=FD_IT[k];return '<div class="xsr"><span class="xsi fdico">'+I.ic+'</span><div class="xsn"><b>'+esc(I.n)+'</b><small>'+esc(I.d)+'</small></div><div class="xsp"><b>'+fmt(I.p)+' 🎟️</b><small>Tienes '+fdN(k)+'</small></div><div class="xsbt">'+[1,5].map(q=>'<button type="button" data-fdb="'+k+'" data-xsq="'+q+'"'+(xT()<I.p*q?' disabled':'')+'>×'+q+'</button>').join("")+'</div></div>'}).join(""))}catch(e){}return r}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#exShop [data-fdb]");if(!b)return;e.stopPropagation();const k=b.dataset.fdb,q=+b.dataset.xsq||1,pr=FD_IT[k].p*q;
  if(xT()<pr){XSH.msg="No tienes tickets de Exploración suficientes.";snd("ui");xsUI();return}xTadd(-pr);fdAdd(k,q);snd("capok");XSH.msg="✅ Has comprado "+q+" × "+FD_IT[k].n+" por "+fmt(pr)+" 🎟️.";xsUI()},true);
