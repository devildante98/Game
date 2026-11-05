// ================= Exploración: Tiendas Pokémon (comprar y vender) y usar objetos de la mochila =================
// Cada pueblo tiene su tienda con un surtido propio que mejora región a región, como en los juegos.
// Se paga con tickets; al vender te dan la mitad de su precio. Lo comprado va a la mochila de Exploración.
const XS_P={pb:500,sb:1500,ub:4000,pot:1500,spot:4000,hpot:9000,mpot:20000,rev:8000,mrev:30000,eter:6000,meter:15000,elix:25000,melix:60000};
const XS_TOWN={
  pueblo:{n:"Pueblo Brisa",it:["pb","pot","spot","rev","eter"],st:["oval-stone"],mt:[["normal",2]],ms:["Protección","Doble Equipo"],hold:["sitrus"],mint:[]},
  pe:{n:"Puerto Escarcha",it:["pb","sb","pot","spot","rev","eter","elix"],st:["water-stone","ice-stone","kings-rock","deep-sea-tooth","deep-sea-scale"],mt:[["water",3],["ice",2],["flying",1]],ms:["Danza Espada","Descanso"],hold:["sitrus","lum"],mint:["mint3","mint15"]},
  pn:{n:"Pueblo Nevado",it:["pb","sb","ub","spot","hpot","rev","elix","meter"],st:["ice-stone","dawn-stone","moon-stone","razor-claw","razor-fang","reaper-cloth","soothe-bell"],mt:[["ice",3],["normal",2],["ghost",2]],ms:["Paz Mental","Respiro","Rizo Defensa"],hold:["left","wherb","sitrus"],mint:["mint3","mint15","mint13","mint10"]},
  pb:{n:"Puerto Brasa",it:["sb","ub","spot","hpot","mpot","rev","elix","meter"],st:["fire-stone","sun-stone","leaf-stone","magmarizer","protector","dragon-scale"],mt:[["fire",3],["ground",2],["poison",2],["bug",1]],ms:["Fuego Fatuo","Tóxico","Corpulencia"],hold:["sash","scope","shell","lum"],mint:["mint3","mint15","mint13","mint10","mint5","mint20"]},
  vv:{n:"Villa Volcán",it:["ub","hpot","mpot","rev","mrev","elix","meter","melix"],st:["fire-stone","dusk-stone","shiny-stone","leaf-stone","up-grade","dubious-disc","metal-coat","sachet","whipped-dream"],mt:[["fire",2],["rock",2],["fighting",2],["dragon",2]],ms:["Danza Dragón","Pulimento","Afilagarras"],hold:["lorb","qclaw","lucky","left","sash"],mint:["mint3","mint15","mint13","mint10","mint5","mint20","mint1","mint17"]},
  ct:{n:"Ciudad Trueno",it:["ub","hpot","mpot","mrev","elix","meter","melix"],st:["thunder-stone","moon-stone","sun-stone","dawn-stone","dusk-stone","shiny-stone","electirizer","linking-cord","metal-alloy"],mt:[["electric",3],["psychic",2],["dark",2],["steel",2],["fairy",2],["flying",2]],ms:["Maquinación","Onda Trueno","Agilidad","Amnesia","Defensa Férrea"],hold:["avest","lorb","left","eseed","pseed","gseed","mseed","lucky"],mint:["mint1","mint3","mint5","mint10","mint13","mint15","mint17","mint20","mint23"]}};
const xsIt=id=>ITEMS.find(i=>i[0]===id);
const xsMT=id=>/^mt/.test(id)&&MVD[id.slice(2)];
function xsPrice(id){if(XS_P[id])return XS_P[id];const it=xsIt(id);if(!it)return 0;
  if(it[7]==="evo")return /stone$/.test(id)?30000:45000;if(it[7]==="hold")return 50000;if(it[7]==="mint")return 60000;
  const m=xsMT(id);if(m)return m.cl===0?20000:15000+400*(m.pw|0);return Math.max(500,Math.round((it[2]||0)*.2))}
const xsSell=id=>Math.floor(xsPrice(id)/2);
function xsStock(town){const T=XS_TOWN[town];if(!T)return [];const L=T.it.slice();
  T.st.forEach(s=>L.push(s));
  // MT de ataque del tipo de la zona (las más útiles, potencia media-alta) y MT de estado elegidas
  T.mt.forEach(([ty,n])=>{const mts=ITEMS.filter(i=>i[7]==="mt"&&xsMT(i[0])&&xsMT(i[0]).t===ty&&xsMT(i[0]).cl>0&&(xsMT(i[0]).pw|0)>=55&&(xsMT(i[0]).pw|0)<=110).sort((a,b)=>(xsMT(a[0]).pw|0)-(xsMT(b[0]).pw|0));
    const step=Math.max(1,Math.floor(mts.length/n));for(let k=0;k<n&&k*step<mts.length;k++)L.push(mts[k*step][0])});
  (T.ms||[]).forEach(nm=>{const it=ITEMS.find(i=>i[7]==="mt"&&xsMT(i[0])&&xsMT(i[0]).n===nm);if(it)L.push(it[0])});
  (T.hold||[]).forEach(h=>L.push(h));(T.mint||[]).forEach(m=>L.push(m));
  return [...new Set(L)].filter(id=>xsIt(id))}
const XSH={open:false,town:"",tab:"buy",msg:"",res:null};
function xsUI(){const box=$("exShop");if(!box)return;const T=XS_TOWN[XSH.town]||{n:""};const bag=xgRun(()=>Object.assign({},S.bag||{}));
  const row=(id,mode)=>{const it=xsIt(id),pr=mode==="buy"?xsPrice(id):xsSell(id),have=bag[id]|0,m=xsMT(id);
    const ds=m?'MT · '+TIPO[m.t]+(m.pw?' · Potencia '+m.pw:''):it[6]||"";
    const btn=mode==="buy"?[1,5,10].map(q=>'<button type="button" data-xsb="'+esc(id)+'" data-xsq="'+q+'"'+(S.t<pr*q?' disabled':'')+'>×'+q+'</button>').join(""):
      [1,have].filter((q,i,a)=>q>0&&a.indexOf(q)===i).map(q=>'<button type="button" class="alt" data-xss="'+esc(id)+'" data-xsq="'+q+'">'+(q===have&&q>1?'Todo ('+q+')':'×'+q)+'</button>').join("");
    return '<div class="xsr"><span class="xsi">'+itemIco(id,30)+'</span><div class="xsn"><b>'+esc(IN(id))+'</b><small>'+esc(ds)+'</small></div><div class="xsp"><b>'+fmt(pr)+' 🎟️</b><small>Tienes '+have+'</small></div><div class="xsbt">'+btn+'</div></div>'};
  let list;
  if(XSH.tab==="buy")list=xsStock(XSH.town).map(id=>row(id,"buy")).join("");
  else{const ids=Object.keys(bag).filter(k=>bag[k]>0&&xsIt(k)&&xsSell(k)>0);list=ids.length?ids.map(id=>row(id,"sell")).join(""):'<p class="mut xsempty">Tu mochila de Exploración está vacía.</p>'}
  box.innerHTML='<div class="xsh"><b>🛒 Tienda Pokémon · '+esc(T.n)+'</b><span class="xst">🎟️ '+fmt(S.t)+'</span><button type="button" class="alt" data-xsx="1">Salir</button></div>'+
    '<div class="xstabs"><button type="button" class="'+(XSH.tab==="buy"?"on":"alt")+'" data-xstab="buy">Comprar</button><button type="button" class="'+(XSH.tab==="sell"?"on":"alt")+'" data-xstab="sell">Vender</button></div>'+
    (XSH.msg?'<div class="xsmsg">'+esc(XSH.msg)+'</div>':'')+'<div class="xsl">'+list+'</div>'+
    '<small class="mut">Lo que compras va a tu mochila 🎒 de Exploración. Al vender te dan la mitad de su precio.</small>'}
function xsOpen(town){return new Promise(res=>{const sc=EX.cv&&EX.cv.closest(".exscr");if(!sc){res();return}let b=$("exShop");if(!b){b=document.createElement("div");b.id="exShop";b.className="exshop";sc.appendChild(b)}else if(b.parentElement!==sc)sc.appendChild(b);
  Object.assign(XSH,{open:true,town:town,tab:"buy",msg:"",res:res});b.hidden=false;EX.keys={};EX.kst=[];xsUI()})}
function xsClose(){const b=$("exShop");if(b)b.hidden=true;XSH.open=false;const r=XSH.res;XSH.res=null;snd("ui");try{EX.cv.focus({preventScroll:true})}catch(e){}if(r)r()}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#exShop button");if(!t)return;const d=t.dataset;
  if(d.xsx){xsClose();return}
  if(d.xstab){XSH.tab=d.xstab;XSH.msg="";snd("ui");xsUI();return}
  const q=+d.xsq||1;
  if(d.xsb){const pr=xsPrice(d.xsb)*q;if(S.t<pr){XSH.msg="No tienes tickets suficientes.";snd("ui");xsUI();return}
    S.t-=pr;xgRun(()=>{S.bag[d.xsb]=(S.bag[d.xsb]||0)+q});save();snd("capok");XSH.msg="✅ Has comprado "+q+" × "+IN(d.xsb)+" por "+fmt(pr)+" 🎟️.";xsUI();try{render()}catch(x){}return}
  if(d.xss){let ok=0;xgRun(()=>{const h=S.bag[d.xss]|0,n=Math.min(h,q);if(n>0){S.bag[d.xss]=h-n;if(!S.bag[d.xss])delete S.bag[d.xss];ok=n}});
    if(ok){const g=xsSell(d.xss)*ok;S.t+=g;save();snd("lvl");XSH.msg="💰 Has vendido "+ok+" × "+IN(d.xss)+" por "+fmt(g)+" 🎟️."}xsUI();try{render()}catch(x){}}});
// el dependiente
{const _n=stNPCs;stNPCs=function(m){const L=_n(m);const mm=/^tienda_(.+)$/.exec(m||"");
  if(mm)L.push({sid:"dep",x:2,y:2,f:"d",n:"Dependiente",look:exNpcLook("dependiente-tienda-"+mm[1]),t:[],sight:0,txt:"",id:"sto:"+m+":dep",story:1,still:1,beat:true,px:2,py:2,f0:"d"});return L}}
STX.dep=()=>stRun(async()=>{const town=(EX.map||"").replace(/^tienda_/,"");
  await sSay(S_("Dependiente","¡Hola! Te damos la bienvenida a la Tienda Pokémon."));await xsOpen(town);await sSay(S_("Dependiente","¡Gracias! ¡Vuelve cuando quieras!"))});
// el edificio de la tienda: tejado azul, cartel «TIENDA» y puerta de cristal
{const _b=xBld;xBld=function(b){if(b.k!=="mart")return _b(b);const k="BDmart"+b.w+b.h+b.door;if(XG[k])return XG[k];
  const W=b.w*32,H=b.h*32+26,c=xc(W,H),g=c.getContext("2d"),ink="#2b2440",R=(x,y,w,h,col)=>xr(g,Math.round(x),Math.round(y),Math.round(w),Math.round(h),col),dk=(h,f)=>gbDk(h,f),base=H,dx=b.door*32,LITW=[];
  xdisc(g,W/2,H-3,W/2-2,5,"rgba(0,0,0,.22)");
  const roof=(y,h,col)=>{R(0,y,W,h,ink);for(let r=2;r<h-2;r++){const ph=Math.floor((r-2)/4)%2;R(2,y+r,W-4,1,r%4===0?dk(col,.78):ph?col:dk(col,1.1))}R(2,y+2,W-4,2,dk(col,1.3));R(2,y+h-4,W-4,2,dk(col,.62))};
  const wy=40;roof(8,36,"#3a78d8");R(0,wy,W,base-wy-4,ink);R(2,wy,W-4,base-wy-6,"#f7f8ff");R(2,wy,W-4,3,"#d9def0");R(2,base-18,W-4,4,"#3a78d8");R(2,base-10,W-4,4,"#cfd6ea");
  // cartel
  R(W/2-28,14,56,16,ink);R(W/2-26,16,52,12,"#fff");R(W/2-26,16,52,3,"#cfe0ff");g.fillStyle="#2a5fc0";g.font="bold 9px monospace";g.textAlign="center";g.fillText("TIENDA",W/2,26);
  // escaparate
  const win=(x,y,w,h)=>{R(x-2,y-2,w+4,h+4,ink);R(x,y,w,h,"#8fd0ff");R(x,y,w,4,"#d8f2ff");R(x+w/2-1,y,2,h,"#fff");R(x-3,y+h+2,w+6,3,"#c9b28a");LITW.push([x,y,w,h])};
  win(W-40,wy+10,30,16);
  const x=dx+2,y=base-36;R(x-2,y-2,32,34,ink);R(x,y,28,32,"#9fdcff");R(x+13,y,2,32,ink);R(x,y,28,4,"#e2f5ff");R(x-4,base-6,36,4,"#c9c0ae");LITW.push([x,y+4,28,26]);
  const n=xc(W,H),q=n.getContext("2d");q.drawImage(c,0,0);q.globalCompositeOperation="source-atop";q.fillStyle="rgba(20,24,60,.32)";q.fillRect(0,0,W,H);q.globalCompositeOperation="source-over";
  LITW.forEach(r=>{q.fillStyle="#ffcf5a";q.fillRect(r[0],r[1],r[2],r[3]);q.fillStyle="#fff1b0";q.fillRect(r[0],r[1],r[2],Math.max(2,r[3]/3))});c._n=n;
  return XG[k]=c}}
// estanterías de la tienda
{const _i=exInteract;exInteract=function(){if(!EX.cut&&!EX.dlg&&!EX.mv&&!EX.trans&&/^tienda_/.test(EX.map||"")){const[dx,dy]=EXDIR[EX.f];if(exAt(EX.x+dx,EX.y+dy)==="Z"){stRun(()=>sSay(["Estanterías llenas de Poké Balls, pociones y Máquinas Técnicas. Habla con el dependiente para comprar."]));return}}return _i.apply(this,arguments)}}

// ================= usar objetos de la mochila de Exploración (fuera de combate) =================
const XU={id:null};
const xuKind=id=>{const it=xsIt(id);if(!it)return null;if(["pot","spot","hpot","mpot"].includes(id))return "heal";if(id==="rev"||id==="mrev")return "rev";if(["eter","meter","elix","melix"].includes(id))return "pp";
  if(it[7]==="evo")return "evo";if(xsMT(id))return "mt";if(it[7]==="mint")return "mint";if(it[7]==="hold")return "hold";return null};
function xuTargets(id){return xgRun(()=>{const k=xuKind(id),own=Object.keys(S.owned).filter(n=>S.owned[n]>0&&PM[n]);
  return own.map(n=>{const l=lvd(n).l,mx=stH(PM[n],l),hp=S.hp[n]===undefined?mx:Math.min(mx,S.hp[n]);let ok=false,why="";
    if(k==="heal"){ok=hp>0&&hp<mx;why=hp<=0?"Debilitado":hp>=mx?"PS al máximo":""}
    else if(k==="rev"){ok=hp<=0;why=ok?"":"No está debilitado"}
    else if(k==="pp"){ok=true}
    else if(k==="evo"){const e=EVO(n).filter(x=>x[1]==="I"+id);ok=e.length>0;why=ok?"":"No le hace efecto"}
    else if(k==="mt"){const mid=id.slice(2);ok=mtOk(n,mid)&&!moveIds(n).includes(mid);why=moveIds(n).includes(mid)?"Ya lo conoce":"No puede aprenderlo"}
    else if(k==="mint"){const ni=+id.slice(4),cur=S.nat&&S.nat[n];ok=cur!==ni;why=ok?"":"Ya tiene esa naturaleza"}
    else if(k==="hold"){const h=S.held&&S.held[n];ok=h!==id;why=ok?(h?"Lleva "+IN(h)+" (se cambia)":""):"Ya lo lleva"}
    return {n,l,hp,mx,ok,why,mv:k==="mt"?moveIds(n).slice():null,inT:(S.team||[]).includes(n)}}).sort((a,b)=>(b.ok-a.ok)||(b.inT-a.inT)||(b.l-a.l))})}
function xuUI(){const box=$("exTeam");if(!box||!XU.id)return;const id=XU.id,k=xuKind(id),L=xuTargets(id);const have=xgRun(()=>S.bag[id]|0);
  box.innerHTML='<div class="xgh"><b>'+itemIco(id,26)+' Usar '+esc(IN(id))+' <small class="mut">(tienes '+have+')</small></b><button type="button" class="alt" data-xub="1">Volver</button></div>'+
    (XU.msg?'<div class="xsmsg">'+esc(XU.msg)+'</div>':'')+
    '<div class="xul">'+L.map(t=>'<div class="xur'+(t.ok?'':' off')+'"><span>'+ico(PM[t.n],40)+'</span><div><b>'+esc(typeof nk==="function"?nk(t.n):t.n)+'</b><small>Nv '+t.l+' · PS '+t.hp+'/'+t.mx+(t.ok?'':' · '+esc(t.why))+'</small></div>'+
      (t.ok?(k==="mt"&&t.mv.length>=4?'<div class="xumv"><small>Olvidar:</small>'+t.mv.map((m,i)=>'<button type="button" class="alt mini" data-xun="'+esc(t.n)+'" data-xuk="'+i+'">'+esc((MVD[m]||{n:"?"}).n)+'</button>').join("")+'</div>':'<button type="button" data-xun="'+esc(t.n)+'" data-xuk="-1">Usar</button>'):'')+'</div>').join("")+'</div>'}
async function xuApply(n,slot){const id=XU.id,k=xuKind(id);let msg="",evoTo=null;
  xgRun(()=>{if(!(S.bag[id]>0))return;const l=lvd(n).l,mx=stH(PM[n],l),hp=S.hp[n]===undefined?mx:Math.min(mx,S.hp[n]),it=xsIt(id);
    if(k==="heal"){const nh=Math.min(mx,hp+Math.ceil(mx*(it[4]||35)/100));if(nh>=mx)delete S.hp[n];else S.hp[n]=nh;msg=nk(n)+" recupera "+(nh-hp)+" PS."}
    else if(k==="rev"){const nh=Math.max(1,Math.round(mx*(it[5]||50)/100));if(nh>=mx)delete S.hp[n];else S.hp[n]=nh;msg="¡"+nk(n)+" se ha recuperado!"}
    else if(k==="pp"){if(S.pp)delete S.pp[n];msg="Los PP de "+nk(n)+" están al máximo."}
    else if(k==="evo"){const e=EVO(n).find(x=>x[1]==="I"+id);if(!e||!PM[e[0]])return;evoTo=e[0];evoApply(n,e[0]);msg="¡"+n+" ha evolucionado a "+e[0]+"!"}
    else if(k==="mt"){const mid=id.slice(2),ids=moveIds(n).slice();if(ids.includes(mid))return;const old=slot>=0?ids[slot]:null;if(slot>=0)ids[slot]=mid;else if(ids.length<4)ids.push(mid);else return;S.mv[n]=ids;if(old&&S.pp&&S.pp[n])delete S.pp[n][old];
      msg="¡"+nk(n)+" ha aprendido "+MVD[mid].n+"!"+(old&&MVD[old]?" (Ha olvidado "+MVD[old].n+")":"")}
    else if(k==="mint"){S.nat=S.nat||{};S.nat[n]=+id.slice(4);msg="La naturaleza de "+nk(n)+" ahora es "+IN(id).replace(/^Menta /,"")+"."}
    else if(k==="hold"){S.held=S.held||{};const old=S.held[n];S.held[n]=id;if(old&&old!==id)S.bag[old]=(S.bag[old]||0)+1;msg=nk(n)+" ahora lleva "+IN(id)+(old&&old!==id?" (y "+IN(old)+" vuelve a la mochila)":"")+"."}
    else return;
    S.bag[id]--;if(!S.bag[id])delete S.bag[id]});
  if(msg){save();snd(k==="evo"?"win":k==="mt"||k==="mint"||k==="hold"?"lvl":"heal");XU.msg=msg}
  if(!xgRun(()=>S.bag[id]>0)){XU.id=null;try{xgPanel()}catch(e){}const b=$("exTeam");if(b&&msg)b.insertAdjacentHTML("afterbegin",'<div class="xsmsg">'+esc(msg)+'</div>');XU.msg="";return}
  xuUI()}
// botón «Usar» en la mochila de Exploración
{const _p=xgPanel;xgPanel=function(){XU.id=null;XU.msg="";const r=_p.apply(this,arguments);try{const box=$("exTeam");if(box)box.querySelectorAll(".xgit").forEach(el=>{const id=el.dataset.xgi;
    if(id&&xuKind(id))el.insertAdjacentHTML("beforeend",'<button type="button" class="mini xuse" data-xuse="'+esc(id)+'">Usar</button>');else el.insertAdjacentHTML("beforeend",'<i class="xgin">'+(/^(pb|sb|ub|mb)$/.test(id)?"En combate":"—")+'</i>')})}catch(e){}return r}}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#exTeam [data-xuse],#exTeam [data-xun],#exTeam [data-xub]");if(!t)return;e.stopPropagation();const d=t.dataset;snd("ui");
  if(d.xuse){XU.id=d.xuse;XU.msg="";xuUI();return}if(d.xub){XU.id=null;xgPanel();return}if(d.xun)xuApply(d.xun,+d.xuk)});
// Esc: cierra la tienda
window.addEventListener("keydown",e=>{if(e.key==="Escape"&&XSH.open){e.preventDefault();e.stopPropagation();xsClose()}},true);
setInterval(()=>{if(XSH.open){EX.keys={};EX.kst=[]}},100);

// ================= ficha técnica de los Pokémon de Exploración =================
const XF={n:null,msg:""};
function xfOpen(n){const box=$("exTeam");if(!box)return;XF.n=n;XU.id=null;
  const h=xgRun(()=>{if(!(S.owned[n]>0)||!PM[n])return null;const p=PM[n],d=lvd(n),l=d.l,mx=stH(p,l),hp=S.hp[n]===undefined?mx:Math.max(0,Math.min(mx,S.hp[n])),f=hp/mx,
      nx=l<100?need(l):0,xf=nx?Math.min(1,(d.x||0)/nx):1,inT=(S.team||[]).includes(n),sh=!!(S.shiny&&S.shiny[n]>0),N=NAT[natOf(n)]||NAT[0],ab=abOf(n),held=heldOf(n),mote=(S.mote&&S.mote[n])||"";
    const mv=moveIds(n).map(id=>{const m=MVD[id];if(!m)return "";const CL=["💫 Estado","💥 Físico","🔮 Especial"][m.cl]||"";
      return '<div class="xfmv" style="--tc:'+(TC[m.t]||"#999")+'"><b>'+esc(m.n)+'</b><small>'+EM[m.t]+' '+TIPO[m.t]+' · '+CL+(m.pw?' · Pot. '+m.pw:'')+(m.ac?' · Prec. '+m.ac+'%':'')+'</small><i>PP '+ppCur(n,id)+'/'+ppMax(n,id)+'</i></div>'}).join("");
    return '<div class="xgh"><b>📋 Ficha de '+esc(nk(n))+'</b><button type="button" class="alt" data-xfb="1">Volver</button></div>'+(XF.msg?'<div class="xsmsg">'+esc(XF.msg)+'</div>':'')+
      '<div class="xfw"><div class="xfl"><div class="xfspr '+p[2]+'">'+icoHD(p,120,false,sh)+'</div>'+
        '<b class="xfn">'+(sh?"✨ ":"")+esc(nk(n))+'</b>'+(mote?'<small class="mut">'+esc(n)+'</small>':'')+'<span class="xfty">'+tyTxt(p)+'</span><span class="xflv">Nv '+l+'</span>'+
        '<div class="xfbar"><small>PS '+hp+' / '+mx+'</small><i><u style="width:'+Math.round(f*100)+'%;background:'+(f>.5?"#3ecf8e":f>.2?"#ffd35c":"#e63950")+'"></u></i></div>'+
        '<div class="xfbar"><small>'+(nx?'Exp. '+fmt(d.x||0)+' / '+fmt(nx):'Nivel máximo')+'</small><i><u style="width:'+Math.round(xf*100)+'%;background:#4aa3ff"></u></i></div>'+
        '<button type="button" class="'+(inT?'alt':'red')+' xfteam" data-xgt="'+esc(n)+'">'+(inT?'Sacar del equipo':'➕ Meter en el equipo')+'</button></div>'+
      '<div class="xfr"><div class="xfrow"><span>Mote</span><div class="xfin"><input id="xfMote" maxlength="12" placeholder="'+esc(n)+'" value="'+esc(mote)+'"><button type="button" data-xfm="1">Guardar</button></div></div>'+
        '<div class="xfrow"><span>Naturaleza</span><div><b>'+N[0]+'</b> <small class="mut">'+natTxt(natOf(n))+'</small></div></div>'+
        '<div class="xfrow"><span>Habilidad</span><div><b>'+esc(abName(ab))+'</b>'+(typeof ABDESC!=="undefined"&&ABDESC[ab]?' <small class="mut">'+esc(ABDESC[ab])+'</small>':'')+'</div></div>'+
        '<div class="xfrow"><span>Objeto</span><div>'+(held?itemIco(held,24)+' <b>'+esc(IN(held))+'</b> <button type="button" class="alt mini" data-xfh="1">Quitar</button>':'<small class="mut">No lleva ningún objeto. Equípalo desde la mochila.</small>')+'</div></div>'+
        '<div class="xfrow xfst xf1"><div>'+(typeof fstatHTML==="function"?fstatHTML(n):'')+'</div></div>'+
        '<div class="xfrow"><span>Movimientos</span><div class="xfmvs">'+mv+'</div></div></div></div>'});
  if(!h){XF.n=null;xgPanel();return}box.innerHTML=h;box.hidden=false;box.scrollTop=0}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#exTeam [data-xg],#exTeam [data-xfb],#exTeam [data-xfm],#exTeam [data-xfh]");if(!t)return;e.stopPropagation();const d=t.dataset;snd("ui");
  if(d.xg){XF.msg="";xfOpen(d.xg);return}
  if(d.xfb){XF.n=null;XF.msg="";xgPanel();return}
  const n=XF.n;if(!n)return;
  if(d.xfm){const v=String(($("xfMote")||{}).value||"").trim().slice(0,12);xgRun(()=>{S.mote=S.mote||{};if(v&&v!==n)S.mote[n]=v;else delete S.mote[n]});save();XF.msg=v&&v!==n?"Ahora se llama «"+v+"».":"Mote quitado.";xfOpen(n);return}
  if(d.xfh){xgRun(()=>{const h=S.held&&S.held[n];if(h){delete S.held[n];S.bag[h]=(S.bag[h]||0)+1;XF.msg=IN(h)+" vuelve a la mochila."}});save();xfOpen(n)}},true);
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target&&e.target.id==="xfMote"){e.preventDefault();e.stopPropagation();const b=document.querySelector('#exTeam [data-xfm]');b&&b.click()}},true);
{const _p=xgPanel;xgPanel=function(){XF.n=null;const r=_p.apply(this,arguments);try{const box=$("exTeam");if(box&&!box.querySelector(".xghint"))box.querySelector(".xgl")&&box.querySelector(".xgl").insertAdjacentHTML("beforebegin",'<small class="mut xghint">Toca un Pokémon para ver su ficha.</small>')}catch(e){}return r}}
