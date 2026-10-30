// =====================================================================================
// FORMAS SUPREMAS: los Pokémon más poderosos ya no salen en tiradas ni van en el equipo.
// Se lleva la forma base y, si tienes la forma suprema, se transforma en combate gastando un Cristal Supremo.
// =====================================================================================
var SUP={"Mega-Mewtwo X":"Mewtwo","Mega-Mewtwo Y":"Mewtwo","Mega-Rayquaza":"Rayquaza","Kyogre Primigenio":"Kyogre","Groudon Primigenio":"Groudon",
 "Dialga Forma Origen":"Dialga","Palkia Forma Origen":"Palkia","Giratina Forma Origen":"Giratina","Kyurem Negro":"Kyurem","Kyurem Blanco":"Kyurem",
 "Zygarde Forma Completa":"Zygarde","Hoopa Desatado":"Hoopa","Necrozma Melena Crepuscular":"Necrozma","Necrozma Alas del Alba":"Necrozma","Ultra-Necrozma":"Necrozma",
 "Zacian Espada Suprema":"Zacian","Zamazenta Escudo Supremo":"Zamazenta","Eternatus Dinamax Infinito":"Eternatus","Calyrex Jinete Glacial":"Calyrex","Calyrex Jinete Espectral":"Calyrex","Terapagos Forma Astral":"Terapagos"};
Object.keys(SUP).forEach(k=>{if(!PM[k]||!PM[SUP[k]])delete SUP[k]});
function isSup(n){return !!(SUP&&SUP[n])}
function supOf(base){return SUP?Object.keys(SUP).filter(k=>SUP[k]===base):[]}
// ---- Cristal Supremo ----
ITEMS.push(["crys","Cristal Supremo",5000000,0,0,0,"Transforma en combate a un Pokémon en su forma suprema (Mega-Rayquaza, Ultra-Necrozma, Kyogre Primigenio…) si la tienes en tu colección. Se gasta al usarlo","crys"]);
if(S.bag.crys==null)S.bag.crys=0;
{const _ub=updBag;updBag=function(){if(!$("bq"+(ITEMS.length-1))){try{buildBag()}catch(e){}}return _ub.apply(this,arguments)}}
{const _ii=itemIco;itemIco=function(id,s,noImg){if(id!=="crys")return _ii(id,s,noImg);return '<svg viewBox="0 0 64 64" width="'+s+'" height="'+s+'" aria-hidden="true"><defs><linearGradient id="cg'+s+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#8fe9ff"/><stop offset=".7" stop-color="#7a4ae0"/><stop offset="1" stop-color="#e0447a"/></linearGradient></defs><path d="M32 3 50 22 32 61 14 22Z" fill="url(#cg'+s+')" stroke="#2b1d5a" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 22H50M32 3 26 22 32 61 38 22Z" fill="none" stroke="#2b1d5a" stroke-width="1.6" stroke-linejoin="round" opacity=".7"/><path d="M22 14 26 22 20 22Z" fill="#fff" opacity=".8"/></svg>'}}
// ---- fuera de las tiradas, la Zona Safari y los combates salvajes ----
{const _pr=pickR;pickR=function(r){let p=_pr(r);for(let i=0;i<20&&p&&isSup(p[0]);i++)p=_pr(r);return p}}
{const _wp=wildPick;wildPick=function(r){let p=_wp(r);for(let i=0;i<20&&p&&isSup(p[0]);i++)p=_wp(r);return p}}
{const _sp=safPick;safPick=function(){let p=_sp();for(let i=0;i<20&&p&&isSup(p[0]);i++)p=_sp();return p}}
// ---- no pueden ir en el equipo: se quitan de equipos y conjuntos guardados ----
function supClean(){let ch=false;const f=t=>(t||[]).map(n=>{if(n&&isSup(n)){ch=true;return ""}return n});S.team=f(S.team);(S.sets||[]).forEach(st=>{st.team=f(st.team)});if(ch){save();try{updTeam()}catch(e){}}}
setInterval(supClean,4000);
// ---- botón en combate ----
{const _fb=formBtns;formBtns=function(){let h=_fb();try{if(!B||B.mode!=="s"||B.formUsed)return h;const m=beAct(B.E.sd[0]);if(!m||m.mh<=0)return h;const base=(m.p0||m.p)[0];
  supOf(base).filter(f=>S.owned[f]>0).forEach(f=>{h='<button class="frmb sup" data-k="sup:'+esc(f)+'">💠 '+esc(f)+' <small>('+(S.bag.crys|0)+' 💎)</small></button>'+h})}catch(e){}return h}}
async function supDo(fname){
  if(!B||B.mode!=="s"||B.busy||B.formUsed)return;const sd=B.E.sd[0],m=beAct(sd);if(!m||m.mh<=0)return;const np=PM[fname],base=(m.p0||m.p)[0];
  if(!np||!(S.owned[fname]>0)||SUP[fname]!==base)return;
  if(!((S.bag.crys|0)>0)){B.busy=true;setMenu(false);await say("¡Necesitas un Cristal Supremo para transformar a "+nk(base)+"! Consíguelos en la Torre Batalla, las incursiones, el torneo, el pase de temporada o la tienda.");B.busy=false;setMenu(true);return}
  B.busy=true;setMenu(false);B.formUsed=1;S.bag.crys--;save();
  await say("¡"+nk(base)+" reacciona al Cristal Supremo!");snd("flash");
  if(!hubCalm()){const bt=$("arena").querySelector(".bt"),g=document.createElement("div");g.className="supfx";bt.appendChild(g);
    await g.animate([{opacity:0,transform:"scale(.1) rotate(0deg)"},{opacity:1,transform:"scale(1.1) rotate(180deg)",offset:.55},{opacity:0,transform:"scale(1.8) rotate(360deg)"}],{duration:1500,easing:"ease-out"}).finished;g.remove()}
  formApply(m,np,1.25,1.3);m.sup=1;setSpr(0);bePaint();snd("lvl");await say("¡"+nk(base)+" se ha transformado en "+fname+"! Su poder es abrumador.");
  B.busy=false;setMenu(true);
}
{const _t=turn;turn=async function(k){if(typeof k==="string"&&k.slice(0,4)==="sup:")return supDo(k.slice(4));return _t.apply(this,arguments)}}
// ---- ficha: aviso de forma suprema ----
{const _pv=pkView;pkView=function(n,sh){_pv(n,sh);try{if(!isSup(n))return;const w=document.querySelector("#pkv .pkvw");if(!w)return;const d=document.createElement("div");d.className="supnote";
  d.innerHTML='💠 <b>Forma suprema</b>. No se puede poner en el equipo: lleva a <b>'+esc(SUP[n])+'</b> a un combate y transfórmalo con un <b>Cristal Supremo</b> (tienes '+(S.bag.crys|0)+').'+(S.owned[SUP[n]]>0?'':' <b>Todavía no tienes a '+esc(SUP[n])+'.</b>');
  const t=w.querySelector(".pkvtags");if(t)t.after(d);else w.appendChild(d)}catch(e){}}}
// ---- cómo conseguir cristales ----
TW_SHOP.unshift(["crys",45]);
{const _w=rdWin;rdWin=async function(){const r=await _w.apply(this,arguments);try{if(Math.random()<.3){S.bag.crys=(S.bag.crys|0)+1;save();toast("💎 ¡Has encontrado un Cristal Supremo entre los restos de la incursión!")}}catch(e){}return r}}
{const _pr2=passRw;passRw=function(i){const r=_pr2(i);if(i===20||i===28){const o=Object.assign({},r);o.it=Object.assign({},r.it||{},{crys:1});return o}return r}}
TOUR_TIERS[0].it.crys=3;TOUR_TIERS[1].it.crys=2;TOUR_TIERS[2].it.crys=1;
// ---- compensación para quien ya tenía formas supremas ----
function supComp(){
  if(S.supComp)return;const L=Object.keys(SUP).filter(n=>S.owned[n]>0);S.supComp=1;supClean();if(!L.length){save();return}
  let cr=0;const gave=[];L.forEach(n=>{cr+=3;const b=SUP[n];if(!(S.owned[b]>0)&&!gave.includes(b)){giveMon(b,(S.lv[n]&&S.lv[n].l)||50,!!(S.shiny&&S.shiny[n]));gave.push(b)}else if(S.lv[n]&&(!S.lv[b]||S.lv[b].l<S.lv[n].l)){S.lv[b]={l:S.lv[n].l,x:0}}});
  S.bag.crys=(S.bag.crys|0)+cr;save();render();
  setTimeout(()=>{nxModal('<div class="hofb">💠</div><h3>Las formas supremas han cambiado</h3><p>Los Pokémon más poderosos ('+L.map(esc).join(", ")+') siguen en tu colección, pero ahora se usan como en los juegos: llevas a su forma base al combate y lo transformas con un <b>Cristal Supremo</b>.</p><p>Como compensación has recibido <b>'+cr+' Cristales Supremos</b>'+(gave.length?' y '+gave.map(esc).join(", ")+' para poder usarlos ya':'')+'. ¡Gracias por jugar!</p><button id="supOk">¡Entendido!</button>');$("supOk").onclick=nxModalClose},2500);
}
setTimeout(()=>{try{supComp()}catch(e){console.error(e)}},1800);
