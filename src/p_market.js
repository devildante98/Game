// =====================================================================================
// MERCADILLO ENTRE JUGADORES: vende Pokémon y objetos a cambio de tickets
// Firestore: market/{id}. El vendedor cobra solo (menos un 5% de comisión) cuando alguien compra.
// =====================================================================================
const MK_MAX=5,MK_FEE=.05,MK_MIN=1000,MK_TOP=2e9;
var MK={tab:"buy",list:null,at:0,mine:[],on:false,q:"",f:"",o:"new",sel:null,paying:{}};
function mkInit(){if(MK.on||!window.FB||!window.FB.mkMine||!window.FB.uid||!window.FB.uid())return;MK.on=true;
  try{window.FB.mkMine(l=>{MK.mine=l;l.forEach(d=>{if(d.st==="sold"&&!MK.paying[d.id])mkCollect(d)});if(nxOpen("mktP"))mktUI()})}catch(e){MK.on=false}}
setInterval(mkInit,3000);
async function mkCollect(d){
  MK.paying[d.id]=1;S.mkPaid=S.mkPaid||{};if(S.mkPaid[d.id]){window.FB.mkDel(d.id).catch(()=>{});return}
  const got=Math.floor((d.pr|0)*(1-MK_FEE));S.mkPaid[d.id]=1;S.t+=got;save();render();snd("win");
  toast("💰 ¡"+pvClean(d.bn||"Alguien")+" ha comprado tu "+(d.k==="pk"?d.pk.n:IN2(d.it.id)+" ×"+d.it.q)+"! +"+fmt(got)+" 🎟️");
  try{await window.FB.mkDel(d.id);delete S.mkPaid[d.id];save()}catch(e){}
}
const mkWhat=d=>d.k==="pk"?(d.pk.s?"✨ ":"")+d.pk.n+" Nv"+(d.pk.l|0):IN2(d.it.id)+" ×"+(d.it.q|0);
const mkIco=(d,s)=>d.k==="pk"&&PM[d.pk.n]?ico(PM[d.pk.n],s,false,!!d.pk.s):d.k==="it"?itemIco(d.it.id,Math.round(s*.7)):"";
nxPanel("mktP","🛒 Mercadillo","Compra y vende Pokémon y objetos con otros jugadores a cambio de tickets. Cuando vendes algo, cobras automáticamente (con un 5% de comisión).");
{const g=HUB.find(x=>x.k==="soc");if(g&&!g.tabs.some(t=>t[0]==="mktP"))g.tabs.push(["mktP","Mercadillo"]);HUBP.mktP="soc";HUBR.mktP=()=>{mkLoad(true);mktUI()}}
async function mkLoad(force){if(!window.FB||!window.FB.mkList)return;if(!force&&MK.list&&Date.now()-MK.at<20e3)return;try{MK.list=await window.FB.mkList();MK.at=Date.now()}catch(e){MK.list=MK.list||[]}if(nxOpen("mktP"))mktUI()}
function mktUI(){
  const box=$("mktPB");if(!box)return;if(!window.FB||!window.FB.mkList){box.innerHTML='<p class="mut">Inicia sesión con tu cuenta para usar el mercadillo.</p>';return}
  const me=window.FB.uid(),open=MK.mine.filter(d=>d.st==="open");
  let h='<div class="mktabs">'+[["buy","🛍️ Comprar"],["sell","🏷️ Vender"],["mine","📦 Mis ventas"+(open.length?" ("+open.length+")":"")]].map(t=>'<button class="'+(MK.tab===t[0]?'on':'')+'" data-mkt="'+t[0]+'">'+t[1]+'</button>').join("")+'</div>';
  if(MK.tab==="buy"){
    const q=nrm(MK.q||"");let L=(MK.list||[]).filter(d=>d.st==="open"&&d.s!==me&&(!MK.f||d.k===MK.f)&&(!q||nrm(mkWhat(d)).includes(q)||nrm(String(d.sn||"")).includes(q)));
    L.sort((a,b)=>MK.o==="cheap"?a.pr-b.pr:MK.o==="exp"?b.pr-a.pr:(b.at||0)-(a.at||0));
    h+='<div class="tfil"><input id="mkQ" placeholder="Buscar Pokémon, objeto o vendedor..." value="'+esc(MK.q||"")+'"><select id="mkF"><option value="">Todo</option><option value="pk"'+(MK.f==="pk"?' selected':'')+'>Pokémon</option><option value="it"'+(MK.f==="it"?' selected':'')+'>Objetos</option></select><select id="mkO"><option value="new">Más recientes</option><option value="cheap"'+(MK.o==="cheap"?' selected':'')+'>Más baratos</option><option value="exp"'+(MK.o==="exp"?' selected':'')+'>Más caros</option></select><button class="alt" data-mkr="1">🔄</button></div>';
    h+=!MK.list?'<small class="mut">Cargando…</small>':L.length?'<div class="mkgrid">'+L.slice(0,80).map(d=>{const can=S.t>=d.pr,p=d.k==="pk"?PM[d.pk.n]:null;return '<div class="mkc '+(p?p[2]:'')+(d.k==="pk"&&d.pk.s?' shiny':'')+'"><div class="mki">'+mkIco(d,64)+'</div><b>'+esc(mkWhat(d))+'</b>'+(p?'<small>'+STAR[p[2]]+' · '+tyTxt(p)+(!hasP(d.pk.n)?' · <b class="mgnew">¡No lo tienes!</b>':'')+'</small>':'<small class="mut">'+esc((ITEMS.find(i=>i[0]===d.it.id)||[])[6]||"").slice(0,60)+'</small>')+'<small class="mut">Vende <span class="plink" data-prof="'+esc(d.s)+'">'+esc(pvClean(d.sn||""))+'</span></small><button class="'+(can?'red':'alt')+'" data-mkb="'+esc(d.id)+'"'+(can?'':' disabled')+'>🎟️ '+fmt(d.pr)+'</button></div>'}).join("")+'</div>':'<small class="mut">No hay nada a la venta'+(q||MK.f?' con ese filtro':'')+'. ¡Sé el primero en vender algo!</small>';
  }else if(MK.tab==="sell"){
    if(open.length>=MK_MAX)h+='<p class="mut">Ya tienes '+MK_MAX+' cosas a la venta. Espera a que se vendan o retira alguna.</p>';
    else{const k=MK.sk||"pk";h+='<div class="exdur"><button class="'+(k==="pk"?'on':'')+'" data-mks="pk">Pokémon</button><button class="'+(k==="it"?'on':'')+'" data-mks="it">Objetos</button></div>';
      if(k==="pk"){const q=nrm(MK.sq||""),L=trOwnList().filter(p=>!q||nrm(p[0]).includes(q)||nrm(nk(p[0])).includes(q)).sort((a,b)=>"CREML".indexOf(b[2])-"CREML".indexOf(a[2])||lvd(b[0]).l-lvd(a[0]).l).slice(0,80);
        h+='<div class="sets-row"><input id="mkSQ" placeholder="Buscar en tu colección..." value="'+esc(MK.sq||"")+'"></div><small class="mut">No salen tus favoritos únicos ni los que están en la Guardería o de expedición. Si vendes tu última copia, desaparece de tu colección.</small><div class="nxgrid">'+L.map(p=>{const sh=S.shiny&&S.shiny[p[0]]>0;return '<button class="nxcell'+(MK.sel===p[0]?' sel':'')+'" data-mkp="'+esc(p[0])+'">'+ico(p,48,false,sh)+'<b>'+esc(nk(p[0]))+'</b><small>Nv'+lvd(p[0]).l+' · ×'+S.owned[p[0]]+'</small></button>'}).join("")+'</div>'}
      else{const L=ITEMS.filter(it=>(S.bag[it[0]]|0)>0);h+='<div class="nxgrid">'+(L.length?L.map(it=>'<button class="nxcell'+(MK.sel===it[0]?' sel':'')+'" data-mki="'+it[0]+'"><span class="iico">'+itemIco(it[0],36)+'</span><b>'+it[1]+'</b><small>Tienes ×'+S.bag[it[0]]+'</small></button>').join(""):'<small class="mut">Tu mochila está vacía.</small>')+'</div>'}
      if(MK.sel){h+='<div class="mksell"><b>Vender '+(k==="pk"?esc(nk(MK.sel)):IN2(MK.sel))+'</b>'+(k==="it"?'<label>Cantidad <input id="mkN" type="number" min="1" max="'+(S.bag[MK.sel]|0)+'" value="1"></label>':'')+'<label>Precio 🎟️ <input id="mkP" type="number" min="'+MK_MIN+'" step="1000" value="'+(MK.pr||"")+'" placeholder="Ej. 500000"></label><small class="mut">Recibirás el 95% del precio.</small><button class="red" data-mkgo="1">🏷️ Poner a la venta</button></div>'}}
  }else{
    h+=MK.mine.length?'<div class="mkgrid">'+MK.mine.map(d=>'<div class="mkc"><div class="mki">'+mkIco(d,56)+'</div><b>'+esc(mkWhat(d))+'</b><small>🎟️ '+fmt(d.pr)+'</small>'+(d.st==="open"?'<button class="alt" data-mkx="'+esc(d.id)+'">Retirar</button>':'<small>✅ Vendido a '+esc(pvClean(d.bn||""))+'</small>')+'</div>').join("")+'</div>':'<small class="mut">No tienes nada a la venta.</small>';
  }
  box.innerHTML=h;
  const bind=(id,fn)=>{const e=$(id);if(e)e.oninput=e.onchange=()=>{fn(e.value);const pos=e.selectionStart;mktUI();const e2=$(id);if(e2&&e2.tagName==="INPUT"){e2.focus();try{e2.setSelectionRange(pos,pos)}catch(x){}}}};
  bind("mkQ",v=>MK.q=v);bind("mkF",v=>MK.f=v);bind("mkO",v=>MK.o=v);bind("mkSQ",v=>MK.sq=v);
  const pr=$("mkP");if(pr)pr.oninput=()=>{MK.pr=pr.value};
}
async function mkSell(){
  const k=MK.sk||"pk",n=MK.sel,pr=Math.floor(+($("mkP")||{}).value||0);if(!n)return;
  if(!(pr>=MK_MIN&&pr<=MK_TOP)){toast("El precio debe estar entre "+fmt(MK_MIN)+" y "+fmt(MK_TOP)+" 🎟️.");return}
  if(fcd){toast("Termina el combate primero.");return}if(MK.mine.filter(d=>d.st==="open").length>=MK_MAX)return;
  const d={s:window.FB.uid(),sn:pvClean(pvNick()).slice(0,30),k:k,pr:pr,st:"open",at:Date.now()};
  if(k==="pk"){if(!trOwnList().some(p=>p[0]===n)){toast("No puedes vender ese Pokémon.");return}const rec=pkTake(n);if(!rec)return;d.pk=rec}
  else{const q=Math.max(1,Math.min(S.bag[n]|0,Math.floor(+($("mkN")||{}).value||1)));if(!(S.bag[n]>0))return;S.bag[n]-=q;d.it={id:n,q:q};save()}
  try{await window.FB.mkAdd(d)}catch(e){if(k==="pk")await pkGive(d.pk);else S.bag[n]+=d.it.q;save();toast("No se ha podido poner a la venta.");return}
  MK.sel=null;MK.pr="";MK.tab="mine";render();snd("pop");toast("🏷️ ¡"+mkWhat(d)+" está a la venta por "+fmt(pr)+" 🎟️!");mktUI();
}
async function mkBuy(id){
  const d=(MK.list||[]).find(x=>x.id===id);if(!d||S.t<d.pr)return;if(fcd){toast("Termina el combate primero.");return}
  try{await window.FB.mkBuy(id,pvClean(pvNick()).slice(0,30))}catch(e){toast("¡Vaya! Alguien lo ha comprado antes que tú.");mkLoad(true);return}
  S.t-=d.pr;if(d.k==="pk")await pkGive(d.pk);else S.bag[d.it.id]=(S.bag[d.it.id]|0)+(d.it.q|0);save();render();snd("capok");
  toast("🛍️ ¡Has comprado "+mkWhat(d)+"!");MK.list=MK.list.filter(x=>x.id!==id);mktUI();
}
async function mkCancel(id){
  const d=MK.mine.find(x=>x.id===id);if(!d||d.st!=="open")return;
  try{await window.FB.mkCancel(id)}catch(e){toast("No se ha podido retirar (puede que ya se haya vendido).");return}
  if(d.k==="pk")await pkGive(d.pk);else S.bag[d.it.id]=(S.bag[d.it.id]|0)+(d.it.q|0);save();render();toast("📦 Has retirado "+mkWhat(d)+" del mercadillo.");
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#mktPB button");if(!b)return;const d=b.dataset;
  if(d.mkt){MK.tab=d.mkt;MK.sel=null;if(d.mkt==="buy")mkLoad(false);mktUI()}else if(d.mkr)mkLoad(true);else if(d.mks){MK.sk=d.mks;MK.sel=null;mktUI()}
  else if(d.mkp||d.mki){MK.sel=d.mkp||d.mki;mktUI();const p=$("mkP");if(p)p.focus()}else if(d.mkgo)mkSell();else if(d.mkb)mkBuy(d.mkb);else if(d.mkx)mkCancel(d.mkx)});
