// =====================================================================================
// TERACRISTALIZACIÓN (como en la 9ª generación)
// · Cada Pokémon tiene un teratipo (al principio, su primer tipo; se cambia en su ficha con Teralitos).
// · Con el Teraorbe, una vez por combate, uno de tus Pokémon se teracristaliza: pasa a ser solo de su teratipo (para
//   recibir daño), conserva el bonus (STAB) de sus tipos de siempre, gana el bonus del teratipo, y si el teratipo era
//   uno de sus tipos el bonus sube a ×2. Los ataques del teratipo con menos de 60 de potencia suben a 60 (salvo los de
//   varios golpes y los de prioridad). El cambio dura hasta el final del combate.
// · Después de usarlo, el Teraorbe se recarga en el Centro Pokémon.
// · Los líderes de gimnasio, la Liga Pokémon y los Ases de la Torre Batalla teracristalizan a su último Pokémon.
// (Las reglas del daño están en p_battle.js; el tipo único, en p_moves.js → ty2.)
// =====================================================================================
const TERA_COST=10;
const TERA_T=["normal","fire","water","grass","electric","ice","fighting","poison","ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"];
ITEMS.push(["tshard","Teralito",300000,0,0,0,"Fragmento de cristal brillante. Con "+TERA_COST+" Teralitos puedes cambiar el teratipo de un Pokémon desde su ficha. Se consiguen en las incursiones y en la Torre Batalla, o aquí en la tienda","tera"]);
TW_SHOP.unshift(["tshard",6]);
// icono del Teralito: un cristal facetado
{const _ii=itemIco;itemIco=function(id,s){if(id!=="tshard")return _ii.apply(this,arguments);s=s||32;
  return '<svg viewBox="0 0 64 64" width="'+s+'" height="'+s+'" aria-hidden="true"><defs><linearGradient id="tsg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bff6ff"/><stop offset=".5" stop-color="#7ad0ff"/><stop offset="1" stop-color="#b48cff"/></linearGradient></defs><path d="M32 4L50 22L44 56L20 56L14 22Z" fill="url(#tsg)" stroke="#3a3f8a" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 4L32 56M14 22L50 22M20 56L32 22L44 56" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6"/></svg>'}}
const teraOf=n=>{const t=S.tera&&S.tera[n];if(t&&TERA_T.includes(t))return t;const p=PM[n];return p?p[1]:"normal"};
const teraOrb=()=>{if(!S.torb)S.torb={c:1};return S.torb};// c: 1 = cargado

// ---- poner a un Pokémon en combate su teratipo ----
function teraApply(m,type){if(!m||m.tera)return;m.p0=m.p;const tp=m.p.slice();tp[1]=type;tp.tera=1;m.p=tp;m.tera=type}
async function teraShow(i,m){
  const sl=B&&B.SL&&B.SL[i],sp=sl&&$(sl.sp),c=TC[m.tera]||"#9cf";snd("lvl");
  if(sp&&!(typeof hubCalm==="function"&&hubCalm())){const fx=document.createElement("div");fx.className="terafx";fx.style.setProperty("--tc",c);
    fx.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><b>'+(EM[m.tera]||"💎")+'</b>';sp.appendChild(fx);setTimeout(()=>fx.remove(),1600)}
  bePaint();await sleep(hubCalm()?0:700);
  await say("¡"+beWho(i,m.p[0])+" se ha teracristalizado! ¡Ahora es de tipo "+TIPO[m.tera]+"!")}

// ---- botón «Teracristalizar» en el menú de ataques (se activa y luego eliges el ataque) ----
const teraCan=()=>{try{if(!B||B.mode!=="s"||!B.E||B.teraUsed||B.noTera)return false;if(!teraOrb().c)return false;const m=beAct(B.E.sd[0]);return !!(m&&m.mh>0&&!m.tera)}catch(e){return false}};
{const _sm=setMenu;setMenu=function(v){_sm.apply(this,arguments);try{if(v!==true||!B||B.mode!=="s")return;const mn=$("menu");if(!mn)return;
    const m=beAct(B.E.sd[0]);if(teraCan()){const t=teraOf(m.p[0]);if(!mn.querySelector('[data-k="tera"]'))mn.insertAdjacentHTML("afterbegin",'<button data-k="tera" class="terabtn'+(B.teraArm?' on':'')+'" style="--tc:'+(TC[t]||"#9cf")+'">💎 '+(B.teraArm?'¡Teracristalizará! (elige ataque)':'Teracristalizar · '+EM[t]+' '+TIPO[t])+'</button>')}
    else if(B.teraArm)B.teraArm=0}catch(e){}}}
{const _t=turn;turn=async function(k){if(k==="tera"){if(!teraCan())return;B.teraArm=B.teraArm?0:1;snd("ui");setMenu(true);return}return _t.apply(this,arguments)}}
// al elegir un ataque con el botón activado (o cuando le toca al rival), primero se teracristaliza y después empieza el turno
{const _st=sTurn;sTurn=async function(act){try{
    if(B&&B.mode==="s"&&B.teraArm&&/^(m\d|z\d|x\d|st)/.test(String(act))&&teraCan()){const m=beAct(B.E.sd[0]);B.teraArm=0;B.teraUsed=1;teraOrb().c=0;save();setMenu(false);teraApply(m,teraOf(m.p[0]));await teraShow(0,m)}
    // los líderes, la Liga y el As de la Torre teracristalizan a su último Pokémon
    if(B&&B.mode==="s"&&B.trainer&&!B.eTera&&(B.gym!=null||B.league||B.tower)){const sd=B.E.sd[1],e=beAct(sd),left=sd.t.filter(x=>x.mh>0).length;
      if(e&&e.mh>0&&left===1&&!e.tera){B.eTera=1;setMenu(false);await say("¡"+(B.trainer||"El rival")+" va a teracristalizar a su último Pokémon!");teraApply(e,(B.gymType&&TERA_T.includes(B.gymType))?B.gymType:e.p[1]);await teraShow(1,e)}}
  }catch(e){console.error(e)}return _st.apply(this,arguments)}}
// la corona de cristal con el teratipo sobre el Pokémon teracristalizado
{const _bp=bePaint;bePaint=function(){const r=_bp.apply(this,arguments);try{if(B&&B.SL)B.SL.forEach((sl,i)=>{if(!sl||!sl.sp)return;const e=$(sl.sp);if(!e)return;const m=beAct(B.E.sd[i]),on=!!(m&&m.tera);e.classList.toggle("tera",on);
    let cr=e.querySelector(".tcrown");if(on){e.style.setProperty("--tc",TC[m.tera]||"#9cf");if(!cr){cr=document.createElement("span");cr.className="tcrown";e.appendChild(cr)}const h=EM[m.tera]||"💎";if(cr.textContent!==h)cr.textContent=h;cr.title="Teracristalizado · "+TIPO[m.tera]}else if(cr)cr.remove()})}catch(e){}return r}}
// al terminar el combate, nada queda teracristalizado (los Pokémon del combate se crean de nuevo cada vez)

// ---- el Teraorbe se recarga en el Centro Pokémon ----
{const _h=healTeam;healTeam=async function(){const r=await _h.apply(this,arguments);try{const o=teraOrb();if(!o.c){o.c=1;save();toast("💎 El Teraorbe se ha recargado.")}}catch(e){}return r}}
try{const hb=$("hbtn");if(hb)hb.onclick=healTeam}catch(e){}
// ...y al curar sin coste (después de la Liga, la Torre, etc.) también
{const _sh=typeof stHeal==="function"?stHeal:null;if(_sh)stHeal=function(){const r=_sh.apply(this,arguments);try{teraOrb().c=1}catch(e){}return r}}
// en el Centro Pokémon se ve si está cargado
setInterval(()=>{const p=$("healP");if(!p)return;let b=$("torbS");if(!b){b=document.createElement("div");b.id="torbS";b.className="torbs";const h=p.querySelector("h2");if(h)h.after(b);else p.prepend(b)}
  const c=teraOrb().c,html='<span class="torbi'+(c?' on':'')+'">💎</span><div><b>Teraorbe '+(c?'cargado':'sin carga')+'</b><small class="mut">'+(c?'Puedes teracristalizar a un Pokémon en tu próximo combate.':'Cura a tu equipo aquí para recargarlo.')+'</small></div>';if(b.innerHTML!==html)b.innerHTML=html},1500);

// ---- en la ficha del Pokémon: su teratipo y cambiarlo con Teralitos ----
function teraFicha(n){const w=document.querySelector("#pkv .pkvw");if(!w||!(S.owned[n]>0))return;let b=w.querySelector(".pkvtera");if(!b){b=document.createElement("div");b.className="pkvtera";const ref=w.querySelector(".pkvcry");if(ref)w.insertBefore(b,ref);else w.appendChild(b)}
  const t=teraOf(n),have=S.bag.tshard|0,open=b.dataset.open==="1";
  b.innerHTML='<div class="tftop"><span class="tfchip" style="--tc:'+(TC[t]||"#9cf")+'">💎 Teratipo: '+EM[t]+' '+TIPO[t]+'</span><button type="button" class="alt mini" data-tfo="1">'+(open?'Cerrar':'Cambiar ('+TERA_COST+' Teralitos)')+'</button></div>'+
    (open?'<small class="mut">Tienes '+have+' Teralito'+(have===1?'':'s')+'. Elige el nuevo teratipo:</small><div class="tfgrid">'+TERA_T.map(x=>'<button type="button" data-tft="'+x+'" style="--tc:'+(TC[x]||"#999")+'"'+(x===t||have<TERA_COST?' disabled':'')+'>'+EM[x]+' '+TIPO[x]+'</button>').join("")+'</div>':'');
  b.dataset.n=n}
{const _pv=pkView;pkView=function(n,sh){const r=_pv.apply(this,arguments);try{teraFicha(n)}catch(e){}return r}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".pkvtera [data-tfo],.pkvtera [data-tft]");if(!b)return;e.stopPropagation();const box=b.closest(".pkvtera"),n=box.dataset.n;
  if(b.dataset.tfo){box.dataset.open=box.dataset.open==="1"?"0":"1";snd("ui");teraFicha(n);return}
  const t=b.dataset.tft;if(!TERA_T.includes(t)||(S.bag.tshard|0)<TERA_COST)return;if(typeof fcd!=="undefined"&&fcd){toast("Termina el combate primero.");return}
  S.bag.tshard-=TERA_COST;S.tera=S.tera||{};S.tera[n]=t;save();snd("lvl");box.dataset.open="0";teraFicha(n);toast("💎 ¡El teratipo de "+nk(n)+" ahora es "+TIPO[t]+"!")});

// ---- Teralitos de premio en las incursiones ----
{const _g=grant;grant=function(r){try{if(r&&r.it&&r.it.ub===3&&typeof RD!=="undefined"&&RD&&RD.phase==="catch"&&!r._ts){r._ts=1;r.it.tshard=(r.it.tshard||0)+3+Math.floor(Math.random()*4)}}catch(e){}return _g.apply(this,arguments)}}

// ================= TERACRISTALIZACIÓN EN EL PVP (modo «🧬 Libre») =================
// La acción viaja como «T<teratipo>|m0»: así el rival sabe a qué tipo cambia y los dos juegos calculan lo mismo.
// En el PVP el Teraorbe siempre está cargado (como en los combates en línea de los juegos): una vez por combate y jugador.
{const _bt=beTurn;beTurn=function(E,acts,rng){if(!E||!E.pvp)return _bt.apply(this,arguments);const tev=[];
  acts=(acts||[]).map((a,i)=>{const s=String(a==null?"":a),q=s.match(/^T([a-z]+)\|(.+)$/);if(!q)return a;const sd=E.sd[i];
    if(E.free&&sd&&!sd.out&&!sd.tu&&TERA_T.includes(q[1])){const m=beAct(sd);if(m&&m.mh>0&&!m.tera&&!m.dmx){sd.tu=1;teraApply(m,q[1]);tev.push({k:"tera",s:i,n:m.p[0],ty:q[1],snap:beSnap(E)})}}
    return q[2]});
  const ev=_bt.call(this,E,acts,rng);return tev.concat(ev)}}
// al reproducir el turno: la animación del cristal antes de los ataques
{const _bp=bePlay;bePlay=async function(ev){if(!ev||!ev.some(e=>e&&e.k==="tera"))return _bp.apply(this,arguments);let chunk=[];
  for(const e of ev){if(e&&e.k==="tera"){if(chunk.length){await _bp.call(this,chunk);chunk=[]}try{const E=B&&B.E,m=E&&E.sd[e.s]?E.sd[e.s].t.find(t=>t.tera===e.ty&&t.p[0]===e.n)||beAct(E.sd[e.s]):null;if(m)await teraShow(e.s,m)}catch(x){console.error(x)}}else chunk.push(e)}
  if(chunk.length)await _bp.call(this,chunk)}}
// botón en el menú del PVP (junto a Megaevolucionar / Dinamax / Movimiento Z)
{const _fb=pvFreeBtns;pvFreeBtns=function(side,pm){let h=_fb.apply(this,arguments);try{if(!D||!D.E||!D.E.free||!pm||pm.mh<=0)return h;
    if(D.pre&&D.pre[0]==="T")h=h.replace(/<small class="pvpre">[\s\S]*?<\/small>/,'');
    if(!side.tu&&!pm.tera&&!pm.dmx&&!pm.p0){const t=teraOf(pm.p[0]),on=D.pre==="T"+t;h+='<button class="terabtn'+(on?' on':'')+'" data-pv="fT" style="--tc:'+(TC[t]||"#9cf")+'">💎 '+(on?'¡Teracristalizará!':'Teracristalizar · '+EM[t]+' '+TIPO[t])+'</button>'}
    if(D.pre&&D.pre[0]==="T")h='<small class="pvpre">💎 Se teracristalizará en tipo '+TIPO[D.pre.slice(1)]+' antes de atacar: elige un ataque.</small>'+h}catch(e){console.error(e)}return h}}
$("menu").addEventListener("click",e=>{const b=e.target.closest&&e.target.closest('[data-pv="fT"]');if(!b||!D||!D.E||!D.E.free)return;e.stopImmediatePropagation();
  const pm=beAct(D.E.sd[pvMy()]);if(!pm)return;const v="T"+teraOf(pm.p[0]);snd("ui");D.pre=D.pre===v?"":v;D.zm=0;pvMenu()},true);
