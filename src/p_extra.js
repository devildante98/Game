// =====================================================================================
// EXTRA: Megaevolución/Dinamax en combate, día y noche, horas felices, compañero,
// álbum de pegatinas, pase de temporada e invitar amigos
// =====================================================================================

// ================= MEGAEVOLUCIÓN, GIGAMAX Y DINAMAX =================
const FORMS={};// base -> [[nombre de la forma, "mega"|"gmax"]]
P.forEach(p=>{if(p[2]!=="M")return;let b=null,k="";const n=p[0];
  if(/^Mega-/.test(n)){b=n.replace(/^Mega-/,"").replace(/ [XY]$/,"");k="mega"}else if(/ Gigamax$/.test(n)){b=n.replace(/ Gigamax$/,"");k="gmax"}
  if(b&&PM[b])(FORMS[b]=FORMS[b]||[]).push([n,k])});
const formsOwned=(base,k)=>(FORMS[base]||[]).filter(f=>f[1]===k&&S.owned[f[0]]>0);
function formBtns(){
  if(!B||B.mode!=="s"||B.formUsed)return "";const m=beAct(B.E.sd[0]);if(!m||m.mh<=0)return "";const base=(m.p0||m.p)[0];
  const mg=formsOwned(base,"mega"),gm=formsOwned(base,"gmax");let h="";
  mg.forEach(f=>{h+='<button class="frmb mega" data-k="mega:'+esc(f[0])+'">🧬 Megaevolucionar'+(mg.length>1?' ('+esc(f[0].slice(-1))+')':'')+'</button>'});
  if(gm.length)h+='<button class="frmb gmax" data-k="gmax:'+esc(gm[0][0])+'">🔴 Gigamax</button>';
  else h+='<button class="frmb dmax" data-k="dmax">🔴 Dinamax</button>';
  return h;
}
function formApply(m,np,hpMul,atkMul){
  if(!m.p0)m.p0=m.p,m.mx0=m.mx,m.ma0=m.ma;
  const r=m.mx>0?m.mh/m.mx:1,nt=NAT[m.nt|0]||NAT[0],f=nt[1]==="atk"?1.1:nt[2]==="atk"?.9:1;
  m.p=np;m.mx=Math.round(stH(np,m.l)*hpMul);m.mh=Math.max(1,Math.round(r*m.mx));m.ma=stA(np,m.l)*f*atkMul;
}
function formRevert(m){if(!m||!m.p0)return;const r=m.mx>0?m.mh/m.mx:1;m.p=m.p0;m.mx=m.mx0;m.ma=m.ma0;m.mh=m.mh>0?Math.max(1,Math.round(r*m.mx)):0;delete m.p0;delete m.mx0;delete m.ma0;m.dmx=0}
async function formDo(k){
  if(!B||B.mode!=="s"||B.busy||B.formUsed)return;const sd=B.E.sd[0],m=beAct(sd);if(!m||m.mh<=0)return;
  const [kind,fname]=k.split(":");const base=m.p[0];B.busy=true;setMenu(false);B.formUsed=1;
  const sp=$("msp");
  if(kind==="mega"){const np=PM[fname];if(!np||!(S.owned[fname]>0)){B.busy=false;setMenu(true);return}
    await say("¡"+nk(base)+" está reaccionando a la Piedra Activadora!");snd("flash");
    if(!hubCalm()){const g=document.createElement("div");g.className="megafx";$("arena").querySelector(".bt").appendChild(g);await g.animate([{opacity:0,transform:"scale(.2)"},{opacity:1,transform:"scale(1)",offset:.5},{opacity:0,transform:"scale(1.6)"}],{duration:1200,easing:"ease-out"}).finished;g.remove()}
    formApply(m,np,1,1.12);setSpr(0);bePaint();snd("lvl");await say("¡"+nk(base)+" ha megaevolucionado en "+fname+"!");
  }else{
    const np=kind==="gmax"?PM[fname]:m.p;
    await say("¡"+nk(base)+" está "+(kind==="gmax"?"gigamaxizándose":"dinamaxizándose")+"!");snd("flash");
    formApply(m,np,2,1.35);m.dmx=1;B.dmx=3;setSpr(0);bePaint();if(sp)sp.classList.add("dmax");snd("lvl");
    await say("¡"+(kind==="gmax"?fname:nk(base)+" Dinamax")+"! Durante 3 turnos tiene el doble de PS y ataca con más fuerza.");
  }
  B.busy=false;setMenu(true);
}
{const _sm=setMenu;setMenu=function(v){
  if(v===true&&B&&B.mode==="s"&&B.dmx<=0){const m=B.E.sd[0].t.find(t=>t.dmx);if(m){formRevert(m);const sp=$("msp");if(sp)sp.classList.remove("dmax");setSpr(0);bePaint();$("fmsg").textContent="¡La energía Dinamax se ha agotado!"}}
  _sm(v);if(v===true&&B&&B.mode==="s"){const h=formBtns();if(h){const mn=$("menu");if(mn)mn.insertAdjacentHTML("beforeend",h)}}}}
{const _t=turn;turn=async function(k){if(typeof k==="string"&&/^(mega:|gmax:|dmax)/.test(k))return formDo(k);return _t.apply(this,arguments)}}
{const _bt=beTurn;beTurn=function(E,acts,rng){const ev=_bt(E,acts,rng);if(B&&B.mode==="s"&&B.E===E&&B.dmx>0)B.dmx--;return ev}}
{const _ss=setSpr;setSpr=function(i,sn){_ss(i,sn);try{if(B&&B.mode==="s"&&i===0){const m=snapMon(sn||beSnap(B.E),0),e=$("msp");if(e)e.classList.toggle("dmax",!!m.dmx)}}catch(e){}}}
{const _f=finish;finish=async function(res){try{B.E.sd[0].t.forEach(formRevert);B.dmx=0;const e=$("msp");if(e)e.classList.remove("dmax")}catch(e){}return _f.apply(this,arguments)}}

// ================= DÍA Y NOCHE =================
function dayPhase(){const h=new Date().getHours();return h>=21||h<6?"night":h<8?"dawn":h<19?"day":"dusk"}
const PHASE={night:["🌙","Noche","Salen más Pokémon de tipo Fantasma, Siniestro y Psíquico"],dawn:["🌅","Amanecer","Salen más Pokémon de tipo Volador, Planta y Hada"],day:["☀️","Día","Salen más Pokémon de tipo Normal, Bicho y Fuego"],dusk:["🌇","Atardecer","Salen más Pokémon de tipo Roca, Tierra y Lucha"]};
const PHASE_T={night:["ghost","dark","psychic"],dawn:["flying","grass","fairy"],day:["normal","bug","fire"],dusk:["rock","ground","fighting"]};
const NIGHT_ONLY=["Gastly","Haunter","Murkrow","Hoothoot","Noctowl","Umbreon","Misdreavus","Sableye","Duskull","Zubat","Oddish","Houndour","Sneasel","Poochyena","Spiritomb","Drifloon","Litwick","Zorua","Morelull","Impidimp"];
{const _wp=wildPick;wildPick=function(r){const ph=dayPhase();
  if(Math.random()<.35){const pool=P.filter(p=>p[2]===r&&(PHASE_T[ph].includes(p[1])||(ph==="night"&&NIGHT_ONLY.includes(p[0]))));if(pool.length)return pool[Math.floor(Math.random()*pool.length)]}
  const p=_wp(r);if(ph!=="night"&&NIGHT_ONLY.includes(p[0])){const q=_wp(r);if(!NIGHT_ONLY.includes(q[0]))return q}return p}}
function dayApply(){const ph=dayPhase();document.body.dataset.phase=ph;const b=$("dayB");if(b){b.textContent=PHASE[ph][0];b.title=PHASE[ph][1]+": "+PHASE[ph][2]}}
{const _sc=setScene;setScene=function(el,env){_sc(el,env);try{if(el){el.dataset.phase=dayPhase()}}catch(e){}}}
(function(){const b=document.createElement("button");b.id="dayB";b.type="button";b.onclick=()=>toast(PHASE[dayPhase()][0]+" "+PHASE[dayPhase()][1]+": "+PHASE[dayPhase()][2]+".");document.body.appendChild(b);dayApply();setInterval(dayApply,60e3)})();

// ================= HORAS FELICES Y DÍA DE LA COMUNIDAD =================
// Mismas horas para todos (hora de España): 13:00-14:00 y 20:00-21:00. Los sábados de 16:00 a 19:00, Día de la Comunidad.
const HH_KINDS=[["shiny","✨ Variocolores ×3","Los variocolores salen 3 veces más en tiradas y combates"],["tk","🎟️ Tickets ×2","Ganas el doble de tickets por toque"],["xp","⭐ Experiencia ×2","Tus Pokémon ganan el doble de experiencia"],["leg","🌟 Lluvia de legendarios","Más probabilidad de legendarios en las tiradas"],["mg","🎮 Minijuegos ×2","Los premios de los minijuegos se duplican"]];
function madridParts(t){const f=new Intl.DateTimeFormat("es-ES",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",weekday:"short",hour12:false}).formatToParts(new Date(t));const o={};f.forEach(x=>o[x.type]=x.value);return o}
function hhSlots(dayOffset){// devuelve las franjas de un día (en ms) a partir del día de hoy en Madrid
  const now=Date.now(),out=[];for(let d=-1;d<=1+(dayOffset|0);d++){const t=now+d*864e5,o=madridParts(t),key=o.year+o.month+o.day;
    const base=t-((+o.hour)*36e5+(+o.minute)*6e4)-(new Date(t).getSeconds()*1e3+new Date(t).getMilliseconds());let h=0;for(const ch of key)h=(h*31+ch.charCodeAt(0))|0;h=Math.abs(h);
    out.push({a:base+13*36e5,b:base+14*36e5,k:HH_KINDS[h%HH_KINDS.length][0]},{a:base+20*36e5,b:base+21*36e5,k:HH_KINDS[(h>>3)%HH_KINDS.length][0]});
    if(/^s[aá]b/i.test(o.weekday||"")){out.push({a:base+16*36e5,b:base+19*36e5,k:"cd",mon:cdMon(key)})}}
  return out.sort((x,y)=>x.a-y.a)}
function cdMon(key){let h=0;for(const ch of "cd"+key)h=(h*31+ch.charCodeAt(0))|0;const pool=P.filter(p=>p[2]==="R"||p[2]==="E");return pool[Math.abs(h)%pool.length]}
function hhNow(){const t=Date.now();return hhSlots().filter(s=>t>=s.a&&t<s.b)}
function hhNext(){const t=Date.now();return hhSlots(1).find(s=>s.a>t)}
function hhMul(k){let L;try{L=hhNow()}catch(e){return 1}if(k==="shiny")return L.some(s=>s.k==="shiny")?3:L.some(s=>s.k==="cd")?2:1;if(k==="tk")return L.some(s=>s.k==="tk")?2:1;if(k==="xp")return L.some(s=>s.k==="xp")?2:1;if(k==="mg")return L.some(s=>s.k==="mg")?2:1;return 1}
const hhInfo=s=>s.k==="cd"?["🎉 Día de la Comunidad","¡"+s.mon[0]+" aparece muchísimo en tiradas y combates, con variocolores ×5 para él!"]:(HH_KINDS.find(x=>x[0]===s.k)||["","",""]).slice(1);
const SH0={g:SHINY_G,s:SHINY_S,w:SHINY_W};let _hhk="";
function hhTick(){const L=hhNow(),m=hhMul("shiny");SHINY_G=SH0.g*m;SHINY_S=SH0.s*m;SHINY_W=SH0.w*m;
  const k=L.map(s=>s.k+s.a).join("|");if(k!==_hhk){if(_hhk!==""&&L.length){const i=hhInfo(L[0]);toast("🎉 ¡Empieza "+i[0]+"! "+i[1]);snd("lvl")}_hhk=k}hhBan()}
setInterval(hhTick,15e3);
{const _gx=gainXp;gainXp=function(p,amt){return _gx.call(this,p,Math.round(amt*hhMul("xp")))}}
{const _r=roll;roll=function(){if(hhNow().some(s=>s.k==="leg")&&Math.random()<.02){const p=pickR("L");S.pity=0;return p}return _r.apply(this,arguments)}}
{const _pr=pickR;pickR=function(r){const cd=hhNow().find(s=>s.k==="cd");if(cd&&Math.random()<.3&&"CREML".indexOf(cd.mon[2])<="CREML".indexOf(r)+1)return cd.mon;return _pr(r)}}
{const _wp2=wildPick;wildPick=function(r){const cd=hhNow().find(s=>s.k==="cd");if(cd&&Math.random()<.4)return cd.mon;return _wp2(r)}}
// variocolores ×5 para el protagonista del Día de la Comunidad: segunda oportunidad al capturarlo o al salir en tiradas
const hhFmt=ms=>{const m=Math.max(0,Math.round(ms/6e4));return m>=60?Math.floor(m/60)+" h "+(m%60)+" min":m+" min"};
function hhBan(){
  let b=$("hhBan");const ep=$("earnP");if(!ep)return;if(!b){b=document.createElement("button");b.id="hhBan";b.type="button";b.onclick=()=>hubOpen("act","hhP");const h=ep.querySelector("h2");if(h)h.after(b);else ep.prepend(b)}
  const L=hhNow(),n=hhNext();
  if(L.length){const s=L[0],i=hhInfo(s);b.className="on";b.innerHTML='<span class="hhi">'+(s.k==="cd"?ico(s.mon,40):"🎉")+'</span><span class="mgbt"><b>¡AHORA! '+i[0]+'</b><small>'+esc(i[1])+' · quedan '+hhFmt(s.b-Date.now())+'</small></span>'}
  else if(n){const i=hhInfo(n);b.className="";b.innerHTML='<span class="hhi">⏰</span><span class="mgbt"><b>Próxima hora feliz: '+i[0]+'</b><small>Empieza en '+hhFmt(n.a-Date.now())+' · '+esc(i[1])+'</small></span>'}
}
nxPanel("hhP","🎉 Horas felices","Todos los días a las 13:00 y a las 20:00 (hora de España) hay una hora feliz con un bonus distinto. Los sábados de 16:00 a 19:00 se celebra el Día de la Comunidad.");
{const g=HUB.find(x=>x.k==="act");if(g&&!g.tabs.some(t=>t[0]==="hhP"))g.tabs.push(["hhP","Horas felices"]);HUBP.hhP="act";HUBR.hhP=()=>hhUI()}
function hhUI(){const box=$("hhPB");if(!box)return;const t=Date.now(),L=hhSlots(1).filter(s=>s.b>t).slice(0,6);
  box.innerHTML='<div class="hhl">'+L.map(s=>{const i=hhInfo(s),on=t>=s.a,d=new Date(s.a);return '<div class="hhc'+(on?' on':'')+(s.k==="cd"?' cd':'')+'"><span class="hhi">'+(s.k==="cd"?ico(s.mon,48):i[0].split(" ")[0])+'</span><div><b>'+i[0]+'</b><small>'+esc(i[1])+'</small></div><span class="hht">'+(on?'¡AHORA!<small>quedan '+hhFmt(s.b-t)+'</small>':d.toLocaleDateString("es",{weekday:"short"})+' '+d.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})+'<small>en '+hhFmt(s.a-t)+'</small>')+'</span></div>'}).join("")+'</div>'}
setTimeout(hhTick,500);

// ================= POKÉMON COMPAÑERO =================
const FR_LV=[[0,"Conocido"],[50,"Buen amigo"],[100,"Gran amigo"],[160,"Muy buen amigo"],[220,"Mejor amigo"]];
const budLv=f=>FR_LV.filter(x=>f>=x[0]).length-1;
function budSet(n){if(!(S.owned[n]>0))return;S.buddy={n:n,f:(S.bf&&S.bf[n])|0,last:0,feed:0,gift:Date.now()};save();budDraw();toast("🤝 "+nk(n)+" es ahora tu compañero.");snd("lvl")}
function budF(d){const b=S.buddy;if(!b)return;const o=budLv(b.f);b.f=Math.min(255,(b.f|0)+d);S.bf=S.bf||{};S.bf[b.n]=b.f;save();if(budLv(b.f)>o){toast("💞 ¡"+nk(b.n)+" y tú sois ahora "+FR_LV[budLv(b.f)][1].toLowerCase()+"s!");snd("lvl")}}
function budDraw(){
  const host=$("budCH");{const old=document.querySelector("body>main #budC,#earnP~#budC");if(old&&!host)old.remove()}if(!host)return;let c=$("budC");if(c&&c.parentNode!==host){c.remove();c=null}const b=S.buddy,has=b&&S.owned[b.n]>0;
  if(!c){c=document.createElement("div");c.id="budC";host.appendChild(c);
    c.addEventListener("click",e=>{const t=e.target.closest("[data-bc]");if(!t)return;const k=t.dataset.bc;if(k==="pet")budPet(e);else if(k==="feed"){const b=S.buddy;if(!b||Date.now()-(b.feed||0)<30*6e4){hubOpen("act","budP");return}b.feed=Date.now();budF(12);snd("heal");toast("🍓 ¡A "+nk(b.n)+" le ha encantado la baya!");budDraw()}else if(k==="more"){NX.budPick=1;budUI()}})}
  if(!has){c.remove();return}
  const sh=!!(S.shiny&&S.shiny[b.n]>0),f=b.f|0,lv=budLv(f),nx=FR_LV[lv+1],gift=Date.now()-(b.gift||0)>=10*6e4,feedOk=Date.now()-(b.feed||0)>=30*6e4,gl=Math.max(0,10*6e4-(Date.now()-(b.gift||0)));
  const key=[b.n,sh,f,gift,feedOk,Math.ceil(gl/6e4)].join("|");if(c.dataset.k===key)return;
  const fresh=!c.querySelector(".bcspr")||c.dataset.n!==b.n+sh;c.dataset.k=key;
  if(fresh){c.dataset.n=b.n+sh;c.innerHTML='<div class="bcfield"><div class="bcwalk" data-bc="pet" title="Tócalo para hacerle mimos"><div class="bcspr">'+ico(PM[b.n],84,false,sh)+'</div><div class="bcshadow"></div></div></div><div class="bcinfo"></div>'}
  c.querySelector(".bcinfo").innerHTML='<div class="bchead"><small>🤝 TU COMPAÑERO</small><b>'+(sh?"✨ ":"")+esc(nk(b.n))+'</b><span class="bclv">💞 '+FR_LV[lv][1]+'</span></div><div class="nxbar"><i style="width:'+Math.round(f/255*100)+'%"></i></div><small class="mut">Amistad '+f+'/255'+(nx?' · '+(nx[0]-f)+' para «'+nx[1]+'»':'')+'</small>'+
    '<div class="bcbtns"><button class="'+(gift?'red bcgift':'alt')+'" data-bc="pet">'+(gift?'🎁 ¡Ha encontrado un regalo!':'💗 Mimos · regalo en '+Math.ceil(gl/6e4)+' min')+'</button><button class="alt" data-bc="feed"'+(feedOk?'':' title="Podrás darle otra baya en '+Math.ceil((30*6e4-(Date.now()-(b.feed||0)))/6e4)+' min"')+'>🍓 '+(feedOk?'Dar baya':Math.ceil((30*6e4-(Date.now()-(b.feed||0)))/6e4)+' min')+'</button><button class="alt" data-bc="more">🔄 Cambiar</button></div>';
}
function budPet(e){
  const b=S.buddy;if(!b)return;const w=document.querySelector("#budC .bcwalk");
  if(Date.now()-(b.gift||0)>=10*6e4){const lv=budLv(b.f|0),t=Math.round((20000+lv*30000)*RMUL());b.gift=Date.now();S.t+=t;const it=Math.random()<.15+lv*.05?["pb","sb","pot","ub","cand"][Math.min(4,Math.floor(Math.random()*(2+lv)))]:null;if(it)S.bag[it]=(S.bag[it]||0)+1;save();render();snd("pop");toast("🎁 "+nk(b.n)+" ha encontrado "+fmt(t)+" 🎟️"+(it?" y "+IN2(it):"")+".");budDraw();return}
  if(Date.now()-(b.last||0)>60e3){b.last=Date.now();budF(2)}
  snd("click");for(let i=0;i<4;i++){const h=document.createElement("span");h.className="budh";h.textContent="💗";w.appendChild(h);h.animate([{transform:"translate(0,0) scale(.6)",opacity:1},{transform:"translate("+(Math.random()*60-30)+"px,-70px) scale(1.2)",opacity:0}],{duration:900,delay:i*90}).onfinish=()=>h.remove()}
  const s=w&&w.querySelector(".bcspr");if(s&&!hubCalm())s.animate([{transform:"translateY(0)"},{transform:"translateY(-14px)"},{transform:"translateY(0)"}],{duration:380})}
setInterval(()=>{try{if(nxOpen("budP"))budDraw()}catch(e){}},5000);
nxPanel("budP","🤝 Tu compañero","Elige un Pokémon que te acompañe. Tócalo para hacerle mimos y dale bayas para que os hagáis amigos. Cuanto mayor sea vuestra amistad, más regalos encuentra y mejor lucha a tu lado.");
{const g=HUB.find(x=>x.k==="act");if(g&&!g.tabs.some(t=>t[0]==="budP"))g.tabs.unshift(["budP","Compañero"]);g.d="Compañero, Guardería, Safari, Torre y más";HUBP.budP="act";HUBR.budP=()=>budUI()}
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{const b=S.buddy;if(b&&S.owned[b.n]>0&&Date.now()-(b.gift||0)>=10*6e4)o.act=(typeof o.act==="number"?o.act:0)+1}catch(e){}return o}}
function budEvos(n){return EVO(n).filter(e=>e[1]==="Isoothe-bell"&&PM[e[0]])}
function budUI(){
  const box=$("budPB");if(!box)return;const b=S.buddy;let h="";
  if(b&&S.owned[b.n]>0){const f=b.f|0,lv=budLv(f),nx=FR_LV[lv+1],fd=Date.now()-(b.feed||0),ev=budEvos(b.n);
    h+='<div id="budCH"></div>'+
      '<div class="budperk"><b>Ventajas por amistad</b>'+[[0,"🎁 Cada 10 minutos encuentra un regalo (tócalo aquí)"],[50,"🎟️ Sus regalos tienen más tickets y a veces objetos"],[100,"⭐ Encuentra objetos más valiosos"],[160,"🛡️ En combate, a veces aguanta un golpe con 1 PS por ti"],[220,"🧬 Puede evolucionar por amistad sin Cascabel Alivio"]].map(x=>'<div class="'+(f>=x[0]?'on':'')+'">'+(f>=x[0]?'✅ ':'🔒 ')+x[1]+'</div>').join("")+'</div>'+
      (ev.length&&f>=220?'<div class="budev"><b>🧬 ¡'+esc(nk(b.n))+' te quiere tanto que puede evolucionar!</b><button class="red" data-bud="evo">Evolucionar por amistad</button></div>':'');
  }
  if(!b||!(S.owned[b.n]>0)||NX.budPick){const q=nrm(NX.budq||""),L=P.filter(p=>S.owned[p[0]]>0&&(!q||nrm(p[0]).includes(q)||nrm(nk(p[0])).includes(q))).sort((a,c)=>(((S.bf||{})[c[0]]|0)-((S.bf||{})[a[0]]|0))||lvd(c[0]).l-lvd(a[0]).l).slice(0,80);
    h+='<h3 class="shh">Elige a tu compañero</h3><div class="sets-row"><input id="budQ" placeholder="Buscar Pokémon..." value="'+esc(NX.budq||"")+'" aria-label="Buscar Pokémon"></div><div class="nxgrid">'+L.map(p=>'<button class="nxcell" data-budn="'+esc(p[0])+'">'+ico(p,48)+'<b>'+esc(nk(p[0]))+'</b><small>'+(((S.bf||{})[p[0]]|0)?'💞 '+((S.bf||{})[p[0]]|0):'Nv'+lvd(p[0]).l)+'</small></button>').join("")+'</div>'}
  box.innerHTML=h;try{const c=$("budC");if(c)c.remove();budDraw()}catch(e){}const q=$("budQ");if(q)q.oninput=()=>{NX.budq=q.value;const pos=q.selectionStart;budUI();const q2=$("budQ");q2.focus();try{q2.setSelectionRange(pos,pos)}catch(e){}};
}
document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("#budPB button");if(!t)return;const d=t.dataset;
  if(d.budn){NX.budPick=0;budSet(d.budn);budUI()}else if(d.bud==="pick"){NX.budPick=1;budUI()}
  else if(d.bud==="feed"){const b=S.buddy;if(!b||Date.now()-(b.feed||0)<30*6e4)return;b.feed=Date.now();budF(12);snd("heal");toast("🍓 ¡A "+nk(b.n)+" le ha encantado la baya!");budUI()}
  else if(d.bud==="evo"){const b=S.buddy;if(!b||fcd)return;const ev=budEvos(b.n);if(!ev.length)return;hubClose();const ok=await evoPrompt(b.n,ev);if(ok){const nn=ev.find(x=>S.owned[x[0]]>0);if(nn){S.buddy.n=nn[0];save()}}budDraw()}});
// en combate: el compañero con mucha amistad a veces aguanta un golpe
{const p0=ITMSG;ITMSG.bud=["",w=>"¡"+w+" ha aguantado el golpe para no preocuparte!"]}
// los combates ganados con el compañero en el equipo suben la amistad
{const _ab=afterBattle;afterBattle=async function(res){await _ab(res);try{const b=S.buddy;if(b&&res==="win"&&(S.team||[]).includes(b.n))budF(3)}catch(e){}}}

// ================= ÁLBUM DE PEGATINAS =================
const ALB_PG=24;
const albPages=()=>{const L=P.slice().sort((a,b)=>(a[4]||0)-(b[4]||0)),o=[];for(let i=0;i<L.length;i+=ALB_PG)o.push(L.slice(i,i+ALB_PG));return o};
let _albP=null;const ALB=()=>_albP||(_albP=albPages());
const stk=n=>{const c=S.owned[n]|0,sh=S.shiny&&S.shiny[n]>0;return{n:c>0||hasP(n),b:c>=5,h:!!sh}};
const ALB_RW={n:{t:250000,lab:"Página normal"},b:{t:1500000,it:{ub:3},lab:"Página brillante"},h:{t:5000000,it:{mb:1},lab:"Página holográfica"}};
nxPanel("albP","📔 Álbum de pegatinas","Cada Pokémon tiene tres pegatinas: normal (al conseguirlo), brillante (con 5 copias) y holográfica (si es variocolor). ¡Completa páginas para ganar premios!");
{const g=HUB.find(x=>x.k==="dex");if(g&&!g.tabs.some(t=>t[0]==="albP"))g.tabs.push(["albP","Álbum de pegatinas"]);HUBP.albP="dex";HUBR.albP=()=>albUI()}
function albUI(){
  const box=$("albPB");if(!box)return;const pages=ALB(),pi=Math.max(0,Math.min(pages.length-1,NX.albp|0)),pg=pages[pi],cl=(S.alb||{})[pi]||{};
  const cnt=k=>pg.filter(p=>stk(p[0])[k]).length,tot=k=>P.filter(p=>stk(p[0])[k]).length;
  const ready=pages.map((L,i)=>["n","b","h"].some(k=>L.every(p=>stk(p[0])[k])&&!((S.alb||{})[i]||{})[k])),nr=ready.filter(x=>x).length;
  let h='<div class="albtop"><span>📔 Normales <b>'+tot("n")+'</b>/'+P.length+'</span><span>✨ Brillantes <b>'+tot("b")+'</b></span><span>🌈 Holográficas <b>'+tot("h")+'</b></span>'+(nr?'<span class="albrdy">🎁 '+nr+' página'+(nr>1?'s':'')+' con premio</span>':'')+'</div>';
  h+='<div class="albnav"><button class="alt" data-albp="'+(pi-1)+'"'+(pi?'':' disabled')+'>◀</button><select id="albS" aria-label="Página">'+pages.map((L,i)=>'<option value="'+i+'"'+(i===pi?' selected':'')+'>Página '+(i+1)+' · #'+(L[0][4]||0)+'–#'+(L[L.length-1][4]||0)+(ready[i]?' 🎁':'')+'</option>').join("")+'</select><button class="alt" data-albp="'+(pi+1)+'"'+(pi<pages.length-1?'':' disabled')+'>▶</button></div>';
  h+='<div class="albpage">'+pg.map(p=>{const s=stk(p[0]);return '<div class="albs'+(s.n?' got':'')+(s.b?' shine':'')+(s.h?' holo':'')+'" title="'+(s.n?esc(p[0]):'???')+'">'+(s.n?ico(p,52,false,s.h):'<span class="albq">#'+(p[4]||"?")+'</span>')+'<small>'+(s.n?esc(p[0]):'???')+'</small>'+(s.h?'<i>🌈</i>':s.b?'<i>✨</i>':'')+'</div>'}).join("")+'</div>';
  h+='<div class="albrw">'+["n","b","h"].map(k=>{const done=cnt(k)===pg.length,got=!!cl[k],R=ALB_RW[k];return '<div class="albr'+(done?' done':'')+(got?' got':'')+'"><b>'+(k==="n"?"📔":k==="b"?"✨":"🌈")+' '+R.lab+'</b><small>'+cnt(k)+'/'+pg.length+' · Premio: '+rwTxt(R)+'</small>'+(got?'<span>✅ Cobrado</span>':done?'<button class="red mini" data-albc="'+k+'">Cobrar</button>':'<div class="nxbar"><i style="width:'+Math.round(cnt(k)/pg.length*100)+'%"></i></div>')+'</div>'}).join("")+'</div>';
  box.innerHTML=h;$("albS").onchange=e=>{NX.albp=+e.target.value;albUI()};
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#albPB button");if(!b)return;
  if(b.dataset.albp!=null){NX.albp=+b.dataset.albp;albUI();snd("ui")}
  else if(b.dataset.albc){const k=b.dataset.albc,pi=NX.albp|0,pg=ALB()[pi];if(!pg.every(p=>stk(p[0])[k]))return;S.alb=S.alb||{};const c=S.alb[pi]=S.alb[pi]||{};if(c[k])return;c[k]=1;const R=ALB_RW[k];grant(R);save();render();snd("win");toast("📔 ¡Página completada! "+rwTxt(R));albUI()}});

// ================= PASE DE TEMPORADA =================
const PASS_N=30;
// cada nivel pide más que el anterior: 150 XP el 1, +50 por nivel (1.600 el 30; 26.250 en total)
const passNeed=L=>150+50*(L-1),passCum=L=>150*L+25*L*(L-1);
const PASS_PULLCAP=200;// XP máxima al día por tiradas
const passMonth=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")};
function passMon(m){let h=0;for(const ch of "pass"+m)h=(h*31+ch.charCodeAt(0))|0;const L=P.filter(p=>p[2]==="L"),E=P.filter(p=>p[2]==="E");return{leg:L[Math.abs(h)%L.length],shy:E[Math.abs(h>>4)%E.length]}}
function passRw(i){// i = 1..30
  if(i===30)return{t:5000000,it:{mb:1},mon:"leg",lab:"¡Legendario de la temporada!"};
  if(i===25)return{t:2000000,mon:"shy",sh:1,lab:"Pokémon variocolor"};
  if(i===20)return{t:1500000,hold:2};if(i===15)return{t:1000000,it:{mb:1}};if(i===10)return{t:800000,it:{cand:3}};if(i===5)return{t:500000,it:{ub:5}};
  const c=[{it:{pb:10}},{it:{pot:5}},{it:{sb:5}},{it:{eter:3}},{it:{ub:2}},{it:{rev:2}},{it:{cand:1}},{evo:1}][i%8];return Object.assign({t:100000+i*40000},c);
}
function passSt(){const m=passMonth();if(!S.pass||S.pass.m!==m)S.pass={m:m,xp:0,cl:{},v:2};const s=S.pass;
  // pases empezados con la curva antigua (200 XP fijos por nivel): se conserva el nivel y el progreso
  if(s.v!==2){const ol=Math.min(PASS_N,Math.floor(s.xp/200)),fr=ol>=PASS_N?0:(s.xp%200)/200;s.xp=passCum(ol)+(ol<PASS_N?Math.floor(fr*passNeed(ol+1)):0);s.v=2}
  return s}
const passLv=()=>{const x=passSt().xp;let l=0;while(l<PASS_N&&passCum(l+1)<=x)l++;return l};
const passProg=()=>{const s=passSt(),l=passLv();return l>=PASS_N?[1,1]:[s.xp-passCum(l),passNeed(l+1)]};
const PASS_EV={win:12,cap:10,pull:2,spull:3,mg:15,pvp:15,pvpwin:10,new:6,evo:20,daily:30,tr:6,gboss:20,dm:8,shiny:25};
{const _q=qEv;qEv=function(ev,n){_q(ev,n);try{const p=PASS_EV[ev];if(p){const s=passSt(),o=passLv();let g=p*(n||1);
  if(ev==="pull"||ev==="spull"){const d=today();if(!s.pd||s.pd.d!==d)s.pd={d:d,x:0};g=Math.max(0,Math.min(g,PASS_PULLCAP-s.pd.x));s.pd.x+=g}
  s.xp+=g;const nl=passLv();if(nl>o){toast("🎫 ¡Pase de temporada: has subido al nivel "+nl+"! Reclama tu premio en Progreso.");snd("lvl")}passMini()}}catch(e){}}}
nxPanel("passP","🎫 Pase de temporada","Cada mes hay un pase nuevo con 30 niveles. Subes de nivel haciendo de todo: combates, tiradas, minijuegos, PVP… ¡y en el nivel 30 te espera un legendario!");
{const g=HUB.find(x=>x.k==="prg");if(g&&!g.tabs.some(t=>t[0]==="passP"))g.tabs.unshift(["passP","Pase de temporada"]);HUBP.passP="prg";HUBR.passP=()=>passUI()}
function passRwTxt(r,m){const M=passMon(m);return [r.mon?(r.sh?"✨ ":"")+M[r.mon][0]:"",r.t?fmt(Math.round(r.t*RMUL()))+" 🎟️":"",...Object.keys(r.it||{}).map(k=>r.it[k]+" "+IN2(k)),r.hold?r.hold+" objetos equipables":"",r.evo?"Piedra evolutiva":""].filter(x=>x).join(" + ")}
function passUI(){
  const box=$("passPB");if(!box)return;const s=passSt(),lv=passLv(),M=passMon(s.m),d=new Date(),end=new Date(d.getFullYear(),d.getMonth()+1,1),left=Math.ceil((end-d)/864e5);
  const ready=[];for(let i=1;i<=lv;i++)if(!s.cl[i])ready.push(i);
  let h='<div class="passtop"><div class="passmon">'+icoHD(M.leg,110,false,false)+'</div><div><small>TEMPORADA DE '+d.toLocaleDateString("es",{month:"long"}).toUpperCase()+' · termina en '+left+' día'+(left===1?'':'s')+'</small><b>Nivel '+lv+' / '+PASS_N+'</b><div class="nxbar pbig"><i style="width:'+(lv>=PASS_N?100:Math.round(passProg()[0]/passProg()[1]*100))+'%"></i></div><small>'+(lv>=PASS_N?'¡Has completado el pase!':fmt(passProg()[0])+'/'+fmt(passProg()[1])+' XP para el nivel '+(lv+1))+' · Premio final: <b>'+esc(M.leg[0])+'</b></small>'+(ready.length?'<button class="red" data-pass="all">🎁 Reclamar '+ready.length+' premio'+(ready.length>1?'s':'')+'</button>':'')+'</div></div>';
  h+='<div class="passtrk">'+Array.from({length:PASS_N},(_,k)=>{const i=k+1,r=passRw(i),got=!!s.cl[i],ok=i<=lv,big=!!r.mon||i%5===0;
    return '<div class="passn'+(got?' got':ok?' ok':'')+(big?' big':'')+'"><span class="passl">'+i+'</span><div class="passi">'+(r.mon?icoHD(M[r.mon],56,false,!!r.sh):r.it?itemIco(Object.keys(r.it)[0],34):r.hold?itemIco("left",34):r.evo?'💎':'🎟️')+'</div><small>'+esc(passRwTxt(r,s.m))+'</small>'+(got?'<span class="passok">✅</span>':ok?'<button class="mini red" data-pass="'+i+'">Reclamar</button>':'<span class="passlk">🔒</span>')+'</div>'}).join("")+'</div>';
  h+='<div class="passhow"><b>¿Cómo se gana experiencia?</b><small>Cada nivel pide 50 XP más que el anterior (del 150 del nivel 1 a los 1.600 del nivel 30).</small><small>Combate ganado +12 · Captura +10 · Tirada +2 (súper +3; máx. '+PASS_PULLCAP+' XP al día'+(s.pd&&s.pd.d===today()?', hoy llevas '+s.pd.x:'')+') · Minijuego +15 · Combate PVP +15 (victoria +10 extra) · Pokémon nuevo +6 · Evolución +20 · Regalo diario +30 · Variocolor +25 · Misión diaria +8</small></div>';
  box.innerHTML=h;const t=box.querySelector(".passn.ok:not(.got)")||box.querySelector(".passn:not(.got)");if(t)t.scrollIntoView({block:"nearest",inline:"center"});
}
function passClaim(i){const s=passSt();if(s.cl[i]||i>passLv())return null;const r=passRw(i),M=passMon(s.m),rw={t:r.t||0,it:Object.assign({},r.it||{})};
  if(r.hold)for(let k=0;k<r.hold;k++){const x=HOLD[Math.floor(Math.random()*HOLD.length)][0];rw.it[x]=(rw.it[x]||0)+1}
  if(r.evo){const ev=ITEMS.filter(q=>q[7]==="evo"),x=ev[Math.floor(Math.random()*ev.length)][0];rw.it[x]=(rw.it[x]||0)+1}
  grant(rw);s.cl[i]=1;let mon=null;if(r.mon){mon=M[r.mon];giveMon(mon[0],clampL(Math.max(10,Math.min(lvCap(),leadLevel()))),!!r.sh)}return{rw:rw,mon:mon,r:r}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#passPB [data-pass]");if(!b)return;const v=b.dataset.pass,L=v==="all"?Array.from({length:passLv()},(_,k)=>k+1):[+v];let got=[],mons=[];
  L.forEach(i=>{const r=passClaim(i);if(r){got.push(rwTxt(r.rw));if(r.mon)mons.push(r)}});if(!got.length)return;save();render();snd("win");
  if(mons.length){const m=mons[0];nxModal('<div class="tourwin big"><div class="tourrays"></div><div class="hofb">🎫</div></div><h3>¡Premio del pase de temporada!</h3><div class="tourmonw">'+icoHD(m.mon,150,false,!!m.r.sh)+'<b>'+(m.r.sh?"✨ ":"")+esc(m.mon[0])+'</b><small>¡Se une a tu equipo!</small></div><button id="psOk">¡Genial!</button>');$("psOk").onclick=nxModalClose}
  else toast("🎫 Has reclamado: "+got.join(" · "));passUI();passMini()});
function passMini(){const ep=$("earnP");if(!ep)return;let c=$("passMini");if(!c){c=document.createElement("button");c.id="passMini";c.type="button";c.onclick=()=>hubOpen("prg","passP");const m=$("mgBan");if(m)m.after(c);else ep.appendChild(c)}
  const s=passSt(),lv=passLv(),r=[];for(let i=1;i<=lv;i++)if(!s.cl[i])r.push(i);
  c.innerHTML='<span>🎫</span><b>Pase de temporada · Nv '+lv+'/'+PASS_N+'</b><span class="pmbar"><i style="width:'+(lv>=PASS_N?100:Math.round(passProg()[0]/passProg()[1]*100))+'%"></i></span>'+(r.length?'<em>🎁 '+r.length+'</em>':'')}
setTimeout(passMini,800);
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{const s=passSt();let r=0;for(let i=1;i<=passLv();i++)if(!s.cl[i])r++;if(r)o.prg=(typeof o.prg==="number"?o.prg:0)+r}catch(e){}return o}}

// ================= INVITAR AMIGOS =================
function refCode(){const u=window.FB&&window.FB.uid?window.FB.uid():"";if(!u)return "";let h=0;for(const ch of u)h=(h*131+ch.charCodeAt(0))>>>0;let s="",x=h;const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";for(let i=0;i<6;i++){s+=A[x%A.length];x=Math.floor(x/A.length)+(i*7919)}return s}
const REF_MS=[["join","Se une con tu código",{t:300000,it:{ub:2}}],["m2","Consigue 2 medallas",{t:1000000,it:{cand:2}}],["m4","Consigue 4 medallas",{t:2500000,it:{mb:1}}]];
nxPanel("refP","📨 Invitar amigos","Comparte tu código. Cuando alguien nuevo empieza a jugar con él, los dos ganáis premios, y tú sigues recibiendo más cuando tu invitado avanza en la aventura.");
{const g=HUB.find(x=>x.k==="mas");if(g&&!g.tabs.some(t=>t[0]==="refP"))g.tabs.splice(1,0,["refP","Invitar amigos"]);HUBP.refP="mas";HUBR.refP=()=>refUI(true)}
let RFX={list:null,at:0};
async function refUI(force){
  const box=$("refPB");if(!box)return;if(!window.FB||!window.FB.refSet){box.innerHTML='<p class="mut">Inicia sesión con tu cuenta para invitar amigos.</p>';return}
  const code=refCode();if(!S.refOwn){window.FB.refSet(code,{u:window.FB.uid(),n:pvClean(pvNick()).slice(0,30)}).then(()=>{S.refOwn=code;save()}).catch(()=>{})}
  const link=location.origin+location.pathname+"?ref="+code,canUse=!S.refBy&&(S.pulls|0)<400;
  let h='<div class="refbox"><small>Tu código de invitación</small><div class="refcode">'+code+'</div><div class="mgbtns"><button class="red" data-ref="copy">📋 Copiar enlace</button>'+(navigator.share?'<button data-ref="share">📤 Compartir</button>':'')+'</div><small class="mut">'+esc(link)+'</small></div>';
  h+='<div class="refms"><b>Premios para ti por cada amigo invitado</b>'+REF_MS.map(m=>'<div><span>'+m[1]+'</span><b>'+rwTxt(m[2])+'</b></div>').join("")+'<small class="mut">Tu amigo recibe 500.000 🎟️ + 10 Poké Ball al entrar, y 1.000.000 🎟️ cuando consiga 4 medallas.</small></div>';
  if(canUse)h+='<div class="refuse"><b>¿Te ha invitado alguien?</b><div class="sets-row"><input id="refIn" maxlength="6" placeholder="Código de 6 letras" value="'+esc(NX.refq||"")+'" style="text-transform:uppercase"><button class="red" data-ref="use">Usar código</button></div><small class="mut">Solo se puede usar una vez y al empezar a jugar.</small></div>';
  else if(S.refBy)h+='<small class="mut">Te invitó un amigo con el código <b>'+esc(S.refBy)+'</b>.</small>';
  h+='<h3 class="shh">Tus invitados</h3><div id="refL">'+(RFX.list?refListHTML():'<small class="mut">Cargando…</small>')+'</div>';
  box.innerHTML=h;
  if(force||!RFX.list||Date.now()-RFX.at>60e3){try{RFX.list=await window.FB.refInv(code);RFX.at=Date.now()}catch(e){RFX.list=RFX.list||[]}const l=$("refL");if(l)l.innerHTML=refListHTML()}
}
const refDone=(x,m)=>m==="join"||(m==="m2"&&(x.med|0)>=2)||(m==="m4"&&(x.med|0)>=4);
function refListHTML(){const L=RFX.list||[];if(!L.length)return '<small class="mut">Todavía no has invitado a nadie. ¡Comparte tu código!</small>';S.refCl=S.refCl||{};
  return L.map(x=>'<div class="refr"><b>'+esc(pvClean(x.n||"Entrenador"))+'</b><small class="mut">🏅 '+(x.med|0)+' medallas</small><span style="flex:1"></span>'+REF_MS.map(m=>{const k=x.id+":"+m[0];return S.refCl[k]?'<span class="refk">✅</span>':refDone(x,m[0])?'<button class="mini red" data-refc="'+esc(x.id)+'" data-refm="'+m[0]+'" title="'+esc(m[1])+'">🎁</button>':'<span class="refk" title="'+esc(m[1])+'">🔒</span>'}).join("")+'</div>').join("")}
async function refUse(){
  const c=String(($("refIn")||{}).value||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(c.length!==6){toast("El código tiene 6 letras o números.");return}
  if(c===refCode()){toast("¡No puedes usar tu propio código!");return}
  let d=null;try{d=await window.FB.refGet(c)}catch(e){}if(!d){toast("Ese código no existe.");return}
  try{await window.FB.refJoin(c,{n:pvClean(pvNick()).slice(0,30),med:medCount(),at:Date.now()})}catch(e){toast("No se ha podido usar el código. Inténtalo más tarde.");return}
  S.refBy=c;const rw={t:500000,it:{pb:10}};grant(rw);save();render();snd("win");
  nxModal('<div class="hofb">📨</div><h3>¡Bienvenido de parte de '+esc(pvClean(d.n||"tu amigo"))+'!</h3><p>Premio de bienvenida: <b>'+rwTxt(rw)+'</b></p><small class="mut">Cuando consigas 4 medallas recibirás 1.000.000 🎟️ más.</small><button id="rfOk">¡Gracias!</button>');$("rfOk").onclick=nxModalClose;refUI(true);
}
// el invitado mantiene al día sus medallas para que su padrino cobre los premios
setInterval(()=>{try{if(!S.refBy||!window.FB||!window.FB.refUpd)return;const m=medCount();if(m!==(S.refMed|0)){S.refMed=m;window.FB.refUpd(S.refBy,{med:m}).catch(()=>{});save()}
  if(m>=4&&!S.refM4){S.refM4=1;const rw={t:1000000};grant(rw);save();render();toast("📨 ¡4 medallas! Premio por venir invitado: "+rwTxt(rw))}}catch(e){}},20e3);
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("#refPB button");if(!b)return;const d=b.dataset;
  if(d.ref==="copy"){const link=location.origin+location.pathname+"?ref="+refCode();try{await navigator.clipboard.writeText(link);toast("📋 Enlace copiado")}catch(x){toast(link)}}
  else if(d.ref==="share"){try{await navigator.share({title:"Poke Gacha Online",text:"¡Juega conmigo a Poke Gacha Online! Usa mi código "+refCode()+" y recibe 500.000 tickets.",url:location.origin+location.pathname+"?ref="+refCode()})}catch(x){}}
  else if(d.ref==="use")refUse();
  else if(d.refc){const k=d.refc+":"+d.refm,x=(RFX.list||[]).find(q=>q.id===d.refc),m=REF_MS.find(q=>q[0]===d.refm);S.refCl=S.refCl||{};if(!x||!m||S.refCl[k]||!refDone(x,m[0]))return;S.refCl[k]=1;grant(m[2]);save();render();snd("win");toast("📨 ¡Premio por invitar! "+rwTxt(m[2]));const l=$("refL");if(l)l.innerHTML=refListHTML()}});
document.addEventListener("input",e=>{if(e.target&&e.target.id==="refIn")NX.refq=e.target.value});
// enlace con ?ref=CÓDIGO: se rellena solo
(function(){try{const c=new URLSearchParams(location.search).get("ref");if(c&&!S.refBy){NX.refq=c.toUpperCase().slice(0,6);setTimeout(()=>{if(!S.refBy&&(S.pulls|0)<400){toast("📨 ¡Te han invitado! Ve a ⚙️ Más → Invitar amigos para recibir tu regalo.")}},4000)}}catch(e){}})();
// ---- seguridad: ninguna animación puede dejar el combate bloqueado ----
{const _pd=pxDraw;pxDraw=function(dur,fn,o){const p=_pd(dur,fn,o);return Promise.race([p,new Promise(r=>setTimeout(r,(dur||600)*3+1500))])}}
{const _pm=pbMaterialize;pbMaterialize=function(sid,sh){return Promise.race([_pm(sid,sh).catch(()=>{}),new Promise(r=>setTimeout(()=>{const e=$(sid);if(e){e.style.opacity=1;e.getAnimations().forEach(a=>{try{a.finish()}catch(x){}})}r()},4000))])}}
