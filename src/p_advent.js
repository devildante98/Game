// =====================================================================================
// CALENDARIO DE ADVIENTO (1-24 de diciembre)
// Una casilla por día con un regalo. Solo se abre la casilla del día (hora de España); del 25 al 31 de diciembre se
// pueden abrir las que se quedaron sin abrir. El 24, un regalo especial. Se ve desde el 18 de noviembre (con la cuenta
// atrás) hasta el 31 de diciembre, en Actividades y con un aviso en Premios.
// Los tickets crecen con tu pueblo (horas de producción, con un mínimo), como los premios semanales.
// =====================================================================================
const ADV_OFF=()=>+(window._advOff||0);// (solo para probar: desplaza la fecha)
const advMadrid=()=>{const p=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(Date.now()+ADV_OFF())).split("-").map(Number);return{y:p[0],m:p[1],d:p[2]}};
// t: tickets mínimos · h: horas de producción · it: objetos · ev/hold: objetos evolutivos / equipables al azar · mon: [Pokémon, variocolor]
const ADV=[
  // semana 1: desde el primer día, Pokémon, Caramelos Raros y tickets
  {t:300000,h:1,mon:["Snorunt",0],it:{sb:5,cand:1}},
  {t:400000,h:1.5,it:{ub:3,pot:3,cand:1}},
  {t:500000,h:2,ev:1,it:{cand:2,ub:2}},
  {t:650000,h:2.5,mon:["Vanillite",0],it:{ub:3,cand:2}},
  {t:800000,h:3,hold:1,it:{cand:3}},
  {t:1000000,h:3.5,mon:["Frosmoth",0],it:{ub:5,cand:3}},
  {t:1200000,h:4,it:{mb:1,cand:3,ppmax:1}},
  // semana 2: Master Ball, objetos equipables y el primer legendario
  {t:1400000,h:4.5,hold:1,ev:1,it:{hpot:3,cand:3}},
  {t:1600000,h:5,mon:["Froslass",0],it:{cand:4,ppmax:2}},
  {t:1800000,h:5.5,mon:["Lapras",0],it:{ub:5,cand:4}},
  {t:2000000,h:6,hold:1,it:{mb:1,cand:4}},
  {t:2500000,h:7,mon:["Articuno",0],it:{cand:5,ub:5}},
  {t:2800000,h:7.5,it:{crys:1,cand:5,ub:5}},
  {t:3000000,h:8,hold:2,ev:2,it:{cand:5}},
  // semana 3: variocolores y más legendarios
  {t:3500000,h:9,mon:["Glaceon",0],it:{mb:2,cand:6}},
  {t:4000000,h:10,mon:["Cubchoo",1],it:{ppmax:3,cand:6}},
  {t:4500000,h:11,hold:1,it:{crys:1,cand:7}},
  {t:5000000,h:12,mon:["Regice",0],it:{mb:2,cand:7}},
  {t:6000000,h:13,hold:2,it:{cand:8,ub:10}},
  {t:7000000,h:14,mon:["Beartic",1],it:{mb:2,cand:8}},
  {t:8000000,h:16,it:{crys:2,cand:10,ppmax:3}},
  // la recta final
  {t:9000000,h:18,mon:["Kyurem",0],it:{mb:3,cand:10}},
  {t:10000000,h:20,hold:3,mon:["Avalugg",1],it:{cand:12,ppmax:3}},
  {t:15000000,h:24,mon:["Delibird",1],mon2:["Articuno",1],it:{mb:5,crys:2,cand:15}},
];
const advTk=r=>r.t||r.h?Math.max(r.t||0,Math.round((typeof tps==="function"?tps():0)*3600*(r.h||0))):0;
// orden de las casillas en el calendario (desordenadas, como los de verdad, pero siempre igual)
const ADV_ORD=(()=>{const a=[...Array(24)].map((_,i)=>i+1);let s=1225;const r=()=>{s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff};for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a})();
// estado: "pre" (antes del 1 de diciembre), "on" (1-24), "late" (25-31, se recuperan las que faltan), "off"
function advPhase(){const t=advMadrid();if(t.m===11&&t.d>=18)return "pre";if(t.m===12&&t.d<=24)return "on";if(t.m===12)return "late";return "off"}
function advData(){const y=advMadrid().y;if(!S.adv||S.adv.y!==y)S.adv={y:y,o:{}};S.adv.o=S.adv.o||{};return S.adv}
function advCan(d){const ph=advPhase(),t=advMadrid();if(advData().o[d])return false;if(ph==="on")return d===t.d;if(ph==="late")return d>=1&&d<=24;return false}
// texto del regalo (sin abrir, para la vista previa del 24 y el resumen)
function advTxt(r){const L=[];if(r.mon)L.push((r.mon[1]?"✨ ":"")+r.mon[0]);if(r.mon2)L.push((r.mon2[1]?"✨ ":"")+r.mon2[0]);const tk=advTk(r);if(tk)L.push(fmt(Math.round(tk*RMUL()))+" 🎟️");
  for(const k in r.it||{})L.push(r.it[k]+" "+IN2(k));if(r.ev)L.push(r.ev+(r.ev>1?" objetos evolutivos":" objeto evolutivo"));if(r.hold)L.push(r.hold+(r.hold>1?" objetos equipables":" objeto equipable"));return L.join(" + ")}
async function advOpen(d){
  if(!advCan(d)){snd("ui");return}if(typeof fcd!=="undefined"&&fcd){toast("Termina el combate primero.");return}
  const r=ADV[d-1],A=advData();A.o[d]=Date.now();
  const rw={t:advTk(r),it:Object.assign({},r.it||{})},got=[];
  for(let i=0;i<(r.ev|0);i++){const ev=ITEMS.filter(q=>q[7]==="evo");const k=ev[Math.floor(Math.random()*ev.length)][0];rw.it[k]=(rw.it[k]||0)+1}
  for(let i=0;i<(r.hold|0);i++){const k=HOLD[Math.floor(Math.random()*HOLD.length)][0];rw.it[k]=(rw.it[k]||0)+1}
  grant(rw);
  for(const m of[r.mon,r.mon2])if(m&&PM[m[0]]){const nw=giveMon(m[0],1,m[1]);got.push((m[1]?"✨ ":"")+m[0]+(nw?" (¡nuevo!)":""))}
  save();try{render()}catch(e){}if(window.cloudFlush)try{window.cloudFlush(true)}catch(e){}
  snd(d===24?"lvl":"pop");advUI(true);
  const mons=[r.mon,r.mon2].filter(m=>m&&PM[m[0]]);
  nxModal('<div class="advgot'+(d===24?' big':'')+'"><div class="advgn">'+(d===24?'🎄':'🎁')+' Día '+d+'</div>'+(mons.length?'<div class="advgm">'+mons.map(m=>ico(PM[m[0]],96,false,!!m[1])).join("")+'</div>':'')+
    '<h3>'+(d===24?'¡Feliz Nochebuena!':'¡Regalo del día '+d+'!')+'</h3><p>'+esc([got.join(" + "),rwTxt(rw)].filter(Boolean).join(" + "))+'</p><button class="red" onclick="nxModalClose()">¡Genial!</button></div>');
  try{if(!hubCalm()){const m=$("nxM");for(let i=0;i<30;i++){const s=document.createElement("i");s.className="advsnow";s.style.left=Math.random()*100+"%";s.style.animationDelay=(Math.random()*1.2)+"s";s.textContent=["❄","✦","❅"][i%3];m.appendChild(s);setTimeout(()=>s.remove(),3200)}}}catch(e){}
}
function advUI(force){
  const box=$("advPB");if(!box)return;const ph=advPhase(),t=advMadrid(),A=advData();
  let h='';
  if(ph==="pre"){const left=Math.max(0,Math.ceil((Date.UTC(t.y,11,1)-Date.UTC(t.y,t.m-1,t.d))/864e5));h+='<div class="advtop"><b>🎄 Empieza el 1 de diciembre</b><small>Faltan '+left+' día'+(left===1?'':'s')+'. Cada día una casilla, y cada regalo es mayor que el anterior. ¡El 24, la gran sorpresa!</small><small class="advnext">🔮 Día 1: '+esc(advTxt(ADV[0]))+'</small></div>'}
  else if(ph==="on"){const n=Object.keys(A.o).length;h+='<div class="advtop"><b>'+(A.o[t.d]?'✅ Ya has abierto la casilla de hoy':'🎁 ¡Tu casilla de hoy (día '+t.d+') te espera!')+'</b><small>Has abierto '+n+' de 24. '+(t.d<24?'Vuelve mañana para abrir la siguiente.':'¡Hoy es el gran día!')+'</small>'+(t.d<24?'<small class="advnext">🔮 Mañana (día '+(t.d+1)+'): '+esc(advTxt(ADV[t.d]))+'</small>':'')+'</div>'}
  else if(ph==="late"){const n=Object.keys(A.o).length;h+='<div class="advtop"><b>'+(n<24?'🎁 ¡Recupera las casillas que no abriste!':'🎉 ¡Has abierto todo el calendario!')+'</b><small>Hasta el 31 de diciembre puedes abrir las que te faltan ('+(24-n)+').</small></div>'}
  h+='<div class="advgrid">'+ADV_ORD.map(d=>{const R=ADV[d-1],op=!!A.o[d],can=advCan(d),past=ph==="late"||(ph==="on"&&d<t.d),miss=!op&&past&&!can,lost=!op&&past;
    return '<button class="advc'+(op?' op':'')+(can?' can':'')+(miss?' miss':'')+(lost?' lost':'')+(d===24?' d24':'')+'" data-adv="'+d+'"'+(can?'':' aria-disabled="true"')+' title="'+(op?esc(advTxt(R)):lost?esc((can?'Puedes recuperarla: ':'No la abriste a tiempo: ')+advTxt(R)):can?'¡Ábrela!':'Todavía no')+'">'+
      '<b>'+d+'</b>'+(op?'<span class="advi">'+(R.mon?ico(PM[R.mon[0]],44,false,!!R.mon[1]):'🎁')+'</span><small>Abierta</small>'
      // las que no se abrieron a tiempo enseñan lo que habrían dado (del 25 al 31 se pueden recuperar)
      :lost?'<span class="advi">'+(R.mon?ico(PM[R.mon[0]],40,false,!!R.mon[1]):'🎁')+'</span><small class="advlost">'+esc(advTxt(R))+'</small><small class="advlb">'+(can?'¡Recupérala!':'No la abriste')+'</small>'
      :can?'<span class="advi">🎁</span><small>¡Ábrela!</small>':'<span class="advi">🔒</span>')+'</button>'}).join("")+'</div>';
  h+='<small class="mut">El regalo del día 24: '+esc(advTxt(ADV[23]))+'. Las casillas se abren con la fecha de España.</small>';
  box.innerHTML=h;
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#advPB [data-adv]");if(!b)return;const d=+b.dataset.adv;if(advCan(d))advOpen(d);else{snd("ui");const ph=advPhase();toast(advData().o[d]?"🎁 "+advTxt(ADV[d-1]):ph==="pre"?"🎄 El calendario empieza el 1 de diciembre.":"🔒 Esa casilla "+(d>advMadrid().d||ph==="pre"?"todavía no se puede abrir.":"ya no se puede abrir."))}});
nxPanel("advP","🎄 Calendario de Adviento","Del 1 al 24 de diciembre, cada día se abre una casilla con un regalo, y cada uno es mayor que el anterior: tickets, Caramelos Raros, Master Ball, Cristal Supremo, objetos equipables y Pokémon de hielo, con legendarios y variocolores. ¡El 24 te espera la gran sorpresa!");
{const g=HUB.find(x=>x.k==="act");if(g&&!g.tabs.some(t=>t[0]==="advP"))g.tabs.unshift(["advP","🎄 Adviento"]);HUBP.advP="act";HUBR.advP=()=>advUI(true)}
// la pestaña solo existe mientras dura (del 18 de noviembre al 31 de diciembre) y en Premios sale un aviso
function advBan(){const ph=advPhase(),g=HUB.find(x=>x.k==="act");if(g){const has=g.tabs.some(t=>t[0]==="advP");if(ph==="off"&&has)g.tabs=g.tabs.filter(t=>t[0]!=="advP");else if(ph!=="off"&&!has)g.tabs.unshift(["advP","🎄 Adviento"])}
  const ep=$("earnP");if(!ep)return;let b=$("advBan");if(ph==="off"){if(b)b.remove();return}
  if(!b){b=document.createElement("button");b.id="advBan";b.type="button";b.onclick=()=>hubOpen("act","advP");const h=ep.querySelector("h2");if(h)h.after(b);else ep.prepend(b)}
  const t=advMadrid(),A=advData(),todo=advPhase()==="on"?!A.o[t.d]:advPhase()==="late"?Object.keys(A.o).length<24:false;
  const html='<span class="advbi">🎄</span><div><b>Calendario de Adviento</b><small>'+(ph==="pre"?"Empieza el 1 de diciembre":todo?(ph==="on"?"¡Abre la casilla de hoy!":"¡Recupera las casillas que te faltan!"):"Vuelve mañana para otra casilla")+'</small></div>'+(todo?'<i class="advdot">1</i>':'');
  if(b.innerHTML!==html)b.innerHTML=html;b.classList.toggle("todo",todo)}
setInterval(advBan,3000);setTimeout(advBan,500);
