// ================= Exploración: Tiendas Pokémon (comprar y vender) y usar objetos de la mochila =================
// Cada pueblo tiene su tienda con un surtido propio que mejora región a región, como en los juegos.
// Se paga con tickets; al vender te dan la mitad de su precio. Lo comprado va a la mochila de Exploración.
const XS_P={pb:500,sb:1500,ub:4000,pot:1500,spot:4000,hpot:9000,mpot:20000,rev:8000,mrev:30000,eter:6000,meter:15000,elix:25000,melix:60000};
const XS_TOWN={
  pueblo:{n:"Pueblo Brisa",it:["pb","pot","eter"],st:[],mt:[["normal",2]],hold:0},
  pe:{n:"Puerto Escarcha",it:["pb","sb","pot","spot","rev","eter"],st:["water-stone"],mt:[["water",3],["ice",2]],hold:0},
  pn:{n:"Pueblo Nevado",it:["pb","sb","spot","rev","elix"],st:["ice-stone","water-stone"],mt:[["ice",3],["normal",2]],hold:1},
  pb:{n:"Puerto Brasa",it:["sb","ub","spot","hpot","rev","elix"],st:["fire-stone"],mt:[["fire",3],["ground",2]],hold:2},
  vv:{n:"Villa Volcán",it:["ub","hpot","mpot","rev","meter","elix"],st:["fire-stone","leaf-stone"],mt:[["fire",2],["rock",2],["fighting",2]],hold:3},
  ct:{n:"Ciudad Trueno",it:["ub","hpot","mpot","mrev","melix","meter"],st:["thunder-stone","moon-stone","sun-stone"],mt:[["electric",3],["psychic",2],["dark",2]],hold:4}};
const xsIt=id=>ITEMS.find(i=>i[0]===id);
const xsMT=id=>/^mt/.test(id)&&MVD[id.slice(2)];
function xsPrice(id){if(XS_P[id])return XS_P[id];const it=xsIt(id);if(!it)return 0;
  if(it[7]==="evo")return 30000;if(it[7]==="hold")return 50000;if(it[7]==="mint")return 60000;
  const m=xsMT(id);if(m)return m.cl===0?20000:15000+400*(m.pw|0);return Math.max(500,Math.round((it[2]||0)*.2))}
const xsSell=id=>Math.floor(xsPrice(id)/2);
function xsStock(town){const T=XS_TOWN[town];if(!T)return [];const L=T.it.slice();
  T.st.forEach(s=>{if(xsIt(s))L.push(s)});
  // MT del tipo de la zona: las más útiles (potencia media-alta), siempre las mismas en cada tienda
  T.mt.forEach(([ty,n])=>{const mts=ITEMS.filter(i=>i[7]==="mt"&&xsMT(i[0])&&xsMT(i[0]).t===ty&&xsMT(i[0]).cl>0&&(xsMT(i[0]).pw|0)>=55&&(xsMT(i[0]).pw|0)<=110).sort((a,b)=>(xsMT(a[0]).pw|0)-(xsMT(b[0]).pw|0));
    const step=Math.max(1,Math.floor(mts.length/n));for(let k=0;k<n&&k*step<mts.length;k++)L.push(mts[k*step][0])});
  if(T.hold){const H=ITEMS.filter(i=>i[7]==="hold"&&!/^z/.test(i[0])&&i[0]!=="crys");const seed=pvHash("tienda"+town);for(let k=0;k<T.hold&&H.length;k++)L.push(H[(seed+k*7)%H.length][0])}
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
  if(it[7]==="evo")return "evo";if(xsMT(id))return "mt";return null};
function xuTargets(id){return xgRun(()=>{const k=xuKind(id),own=Object.keys(S.owned).filter(n=>S.owned[n]>0&&PM[n]);
  return own.map(n=>{const l=lvd(n).l,mx=stH(PM[n],l),hp=S.hp[n]===undefined?mx:Math.min(mx,S.hp[n]);let ok=false,why="";
    if(k==="heal"){ok=hp>0&&hp<mx;why=hp<=0?"Debilitado":hp>=mx?"PS al máximo":""}
    else if(k==="rev"){ok=hp<=0;why=ok?"":"No está debilitado"}
    else if(k==="pp"){ok=true}
    else if(k==="evo"){const e=EVO(n).filter(x=>x[1]==="I"+id);ok=e.length>0;why=ok?"":"No le hace efecto"}
    else if(k==="mt"){const mid=id.slice(2);ok=mtOk(n,mid)&&!moveIds(n).includes(mid);why=moveIds(n).includes(mid)?"Ya lo conoce":"No puede aprenderlo"}
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
    else return;
    S.bag[id]--;if(!S.bag[id])delete S.bag[id]});
  if(msg){save();snd(k==="evo"?"win":k==="mt"?"lvl":"heal");XU.msg=msg}
  if(!xgRun(()=>S.bag[id]>0)){XU.id=null;try{xgPanel()}catch(e){}const b=$("exTeam");if(b&&msg)b.insertAdjacentHTML("afterbegin",'<div class="xsmsg">'+esc(msg)+'</div>');XU.msg="";return}
  xuUI()}
// botón «Usar» en la mochila de Exploración
{const _p=xgPanel;xgPanel=function(){XU.id=null;XU.msg="";const r=_p.apply(this,arguments);try{const box=$("exTeam");if(box)box.querySelectorAll(".xgb span").forEach(sp=>{const nm=sp.textContent.replace(/×\d+\s*$/,"").trim();
    const id=xgRun(()=>Object.keys(S.bag||{}).find(k=>S.bag[k]>0&&IN(k)===nm));if(id&&xuKind(id))sp.insertAdjacentHTML("beforeend",' <button type="button" class="mini xuse" data-xuse="'+esc(id)+'">Usar</button>')})}catch(e){}return r}}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#exTeam [data-xuse],#exTeam [data-xun],#exTeam [data-xub]");if(!t)return;e.stopPropagation();const d=t.dataset;snd("ui");
  if(d.xuse){XU.id=d.xuse;XU.msg="";xuUI();return}if(d.xub){XU.id=null;xgPanel();return}if(d.xun)xuApply(d.xun,+d.xuk)});
// Esc: cierra la tienda
window.addEventListener("keydown",e=>{if(e.key==="Escape"&&XSH.open){e.preventDefault();e.stopPropagation();xsClose()}},true);
setInterval(()=>{if(XSH.open){EX.keys={};EX.kst=[]}},100);
