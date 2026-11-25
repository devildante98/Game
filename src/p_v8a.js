// =====================================================================================
// VERSIÓN 8.0 (1/4): utilidades comunes, Diario del entrenador, Pokémon del día, Aspectos para la Poké Ball y
// Especialidades de entrenador.
// =====================================================================================
// ---------- utilidades comunes de la 8.0 ----------
// fecha y hora de España (igual para todos los jugadores)
function v8Mad(t){const o={};new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",weekday:"short",hour12:false}).formatToParts(new Date(t==null?Date.now():t)).forEach(x=>o[x.type]=x.value);
  return{y:+o.year,m:+o.month,d:+o.day,h:(+o.hour)%24,mi:+o.minute,wd:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].indexOf(o.weekday),day:o.year+"-"+o.month+"-"+o.day}}
const v8Day=t=>v8Mad(t).day;
// número aleatorio a partir de un texto (el mismo para todos con el mismo texto)
function v8Rng(str){let h=2166136261;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}let a=h>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// grupo del menú principal (si no existe, se crea después de «after»)
function v8Group(k,n,ic,c,d,after){if(!HUB.some(g=>g.k===k)){const i=HUB.findIndex(g=>g.k===after);HUB.splice(i<0?HUB.length-1:i+1,0,{k,n,ic,c,d,tabs:[]})}return HUB.find(g=>g.k===k)}
function v8Tab(gk,id,label,title,intro,fn,pos){nxPanel(id,title,intro);const g=HUB.find(x=>x.k===gk);if(g&&!g.tabs.some(t=>t[0]===id)){if(pos!=null)g.tabs.splice(pos,0,[id,label]);else g.tabs.push([id,label])}HUBP[id]=gk;HUBR[id]=fn}
// premio en tickets que crece con tu pueblo: lo mayor entre un mínimo y unas horas de tu producción
const v8Tk=(h,min)=>Math.max(min||0,prodH(h));
const v8Nick=()=>{try{return pvClean(pvNick())}catch(e){return "Entrenador"}};
const v8Uid=()=>{try{return(window.FB&&window.FB.uid&&window.FB.uid())||""}catch(e){return ""}};
async function v8Copy(txt){try{await navigator.clipboard.writeText(txt);toast("📋 Copiado. ¡Pégalo en Discord o en el chat!");return true}catch(e){try{const t=document.createElement("textarea");t.value=txt;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();toast("📋 Copiado.");return true}catch(x){toast("No se ha podido copiar");return false}}}
// combates de las funciones nuevas: startBattle({..., v8:{done:async res=>{}}}) llama a done al terminar
let V8B=null;
{const _sb=startBattle;startBattle=function(cfg){V8B=cfg&&cfg.v8?cfg.v8:null;const r=_sb.apply(this,arguments);if(V8B&&!fcd)V8B=null;return r}}
{const _ab=afterBattle;afterBattle=async function(res){const v=V8B;V8B=null;const r=await _ab.apply(this,arguments);if(v&&v.done)try{await v.done(res)}catch(e){console.error(e)}return r}}
// contadores de sucesos (capturas, victorias, minijuegos…) para las especialidades y las investigaciones
const v8C=()=>S.v8c||(S.v8c={});
{const _q=qEv;qEv=function(ev,n){const r=_q.apply(this,arguments);try{if(typeof S!=="undefined"&&S&&typeof ev==="string"&&/^[a-z_]{1,12}$/.test(ev)){const c=v8C();c[ev]=(c[ev]||0)+Math.max(1,Math.min(1000,(n|0)||1))}}catch(e){}return r}}
const V8RAR={C:1,R:2,E:3,M:4,L:5},v8Stars=r=>"★".repeat(V8RAR[r]||1);
// solo especies «normales»: sin megas, gigamax ni formas (las formas llevan delante el nombre de la especie: «Darmanitan Modo Daruma»)
const v8Base=p=>{if(!p||p[2]==="M")return false;const n=p[0];if(/Mega-|Gigamax|Dinamax|Primigenio|Eternamax|\(/.test(n))return false;return !(n.includes(" ")&&PM[n.split(" ")[0]])};

// grupo nuevo «Retos» en el menú
v8Group("ret","Retos","🎯","#e2573b","Pokémon del día, retos semanales, rival e investigaciones","act");

// ================= DIARIO DEL ENTRENADOR =================
// Se apuntan solos los grandes momentos (comparando la partida cada pocos segundos, así no se escapa ninguno) y otras
// funciones añaden los suyos con diaryAdd(). Se guardan los 150 más recientes (para que la partida no crezca demasiado).
const DIA_MAX=150;
function diaryAdd(ic,txt,n,sh,k){S.dia=Array.isArray(S.dia)?S.dia:[];S.dia.push({t:Date.now(),ic:String(ic||"📔").slice(0,4),x:String(txt||"").slice(0,160),n:n&&PM[n]?n:undefined,sh:sh?1:undefined,k:k||"o"});
  if(S.dia.length>DIA_MAX)S.dia.splice(0,S.dia.length-DIA_MAX);try{save()}catch(e){}if(nxOpen("diaP"))diaUI()}
function diaSnap(){const sh=Object.keys(S.shiny||{}).filter(n=>S.shiny[n]>0),own=Object.keys(S.owned||{}).filter(n=>S.owned[n]>0&&PM[n]);
  return{sh,leg:own.filter(n=>PM[n][2]==="L"),mf:own.filter(n=>PM[n][2]==="M"),dex:own.length,med:medCount(),lg:Object.values(S.lgDone||{}).reduce((a,b)=>a+(b|0),0),prs:S.prs|0,tw:(S.tw||{}).best|0,cr:(S.trophies||[]).length,pvw:(S.pvp||{}).w|0}}
function diaTick(){if(typeof S==="undefined"||!S||!S.owned)return;const now=diaSnap(),B0=S.diaB;
  if(!B0){S.diaB=now;if(!Array.isArray(S.dia)||!S.dia.length)diaryAdd("📔","Empiezas tu diario de entrenador. ¡A partir de hoy se apuntarán aquí tus grandes momentos!",null,0,"o");return}
  let ch=false;const add=(a,b,c,d,e)=>{diaryAdd(a,b,c,d,e);ch=true};
  const newSh=now.sh.filter(n=>!B0.sh.includes(n));if(newSh.length&&!B0.sh.length)add("✨","¡Tu primer Pokémon variocolor: "+newSh[0]+"!",newSh[0],1,"pk");
  newSh.filter(n=>/[LM]/.test(PM[n][2])).slice(0,3).forEach(n=>add("🌟","¡"+n+" variocolor! Un "+(PM[n][2]==="L"?"legendario":"Pokémon de forma especial")+" brillante para tu colección.",n,1,"pk"));
  const newL=now.leg.filter(n=>!B0.leg.includes(n));if(newL.length&&!B0.leg.length)add("👑","¡Tu primer legendario: "+newL[0]+"!",newL[0],0,"pk");else newL.slice(0,3).forEach(n=>add("👑","Ha llegado un nuevo legendario a tu equipo: "+n+".",n,0,"pk"));
  const newM=now.mf.filter(n=>!B0.mf.includes(n));if(newM.length&&!B0.mf.length)add("💠","¡Tu primera forma especial: "+newM[0]+"!",newM[0],0,"pk");
  [50,100,150,250,400,600,800,1000,1200].forEach(m=>{if(B0.dex<m&&now.dex>=m)add("📚","¡"+m+" Pokémon distintos en tu Pokédex!",null,0,"lg")});
  if(now.med>B0.med)add("🏅","¡Has conseguido tu medalla número "+now.med+"!",null,0,"cb");
  if(now.lg>B0.lg)add("🏆",B0.lg?"¡Has vuelto a ganar la Liga Pokémon! ("+now.lg+" veces)":"¡Has ganado la Liga Pokémon por primera vez! Ya estás en el Salón de la Fama.",null,0,"cb");
  if(now.prs>B0.prs)add("🌟","Has subido a Prestigio "+now.prs+". ¡Una nueva aventura empieza!",null,0,"lg");
  [10,25,50,100].forEach(m=>{if(B0.tw<m&&now.tw>=m)add("🗼",m+" victorias seguidas en la Torre Batalla.",null,0,"cb")});
  if(now.cr>B0.cr)add("🏆","¡Has ganado un trofeo de torneo!",null,0,"cb");
  [1,10,50,100].forEach(m=>{if(B0.pvw<m&&now.pvw>=m)add("⚔️",m===1?"¡Tu primera victoria en PVP!":m+" victorias en PVP.",null,0,"cb")});
  S.diaB=now;if(ch)save()}
setInterval(()=>{try{diaTick()}catch(e){}},4000);
// mejor tirada: un legendario o un variocolor recién salido del gacha (lo dice el servidor al tirar)
const DIA_K=[["all","Todo"],["pk","Pokémon"],["cb","Combates"],["lg","Logros"],["o","Otros"]];
v8Tab("trn","diaP","Diario","📔 Diario del entrenador","Tus grandes momentos, apuntados solos: primeros variocolores y legendarios, medallas, la Liga, récords… Compártelos con tus amigos.",()=>diaUI());
function diaUI(){const b=$("diaPB");if(!b)return;const L=(Array.isArray(S.dia)?S.dia:[]).slice().reverse(),f=NX.diaf||"all",V=L.filter(e=>f==="all"||e.k===f);
  let h='<div class="diatop"><div class="diast"><b>'+L.length+'</b><small>momentos</small></div><div class="diast"><b>'+L.filter(e=>e.k==="pk").length+'</b><small>de Pokémon</small></div><div class="diast"><b>'+L.filter(e=>e.k==="cb").length+'</b><small>de combate</small></div><button class="alt" data-dias="all">📋 Compartir resumen</button></div>'+
    '<div class="diaf">'+DIA_K.map(k=>'<button class="'+(f===k[0]?"on":"")+'" data-diaf="'+k[0]+'">'+k[1]+'</button>').join("")+'</div>';
  if(!V.length)h+='<p class="mut">Todavía no hay nada aquí. ¡Sigue jugando!</p>';
  let mo="";h+='<div class="dial">';V.forEach((e,i)=>{const d=new Date(e.t),m=d.toLocaleDateString("es-ES",{month:"long",year:"numeric"});if(m!==mo){mo=m;h+='<div class="diam">'+esc(m.charAt(0).toUpperCase()+m.slice(1))+'</div>'}
    h+='<div class="diae"><span class="diai">'+esc(e.ic)+'</span><div class="diab"><small>'+d.toLocaleDateString("es-ES",{day:"numeric",month:"short"})+' · '+d.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})+'</small><p>'+esc(e.x)+'</p></div>'+(e.n&&PM[e.n]?'<span class="diapk">'+icoHD(PM[e.n],56,false,!!e.sh)+'</span>':'')+'<button class="alt diash" data-dias="'+(L.length-1-L.indexOf(e))+'" aria-label="Compartir este momento" title="Compartir">📋</button></div>'});
  b.innerHTML=h+'</div>'}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#diaPB [data-diaf],#diaPB [data-dias]");if(!t)return;
  if(t.dataset.diaf){NX.diaf=t.dataset.diaf;snd("ui");diaUI();return}
  const L=Array.isArray(S.dia)?S.dia:[];if(t.dataset.dias==="all"){const n=L.length,pk=L.filter(x=>x.k==="pk").slice(-3).map(x=>x.x).join("\n· ");v8Copy("📔 Diario de "+v8Nick()+" en Poke Gacha Online: "+n+" grandes momentos."+(pk?"\nÚltimos:\n· "+pk:"")+"\nhttps://pokegachaonline.es");return}
  const x=L[+t.dataset.dias];if(x)v8Copy("📔 "+v8Nick()+" — "+new Date(x.t).toLocaleDateString("es-ES")+": "+x.x+"\nhttps://pokegachaonline.es")});

// ================= POKÉMON DEL DÍA =================
// Una adivinanza al día (la misma para todos, hora de España): 6 intentos con pistas de tipo, generación, rareza y peso.
const PDD_N=6;
const pddPool=()=>P.filter(p=>v8Base(p)&&window._spr&&window._spr[p[0]]);
const pddNum=day=>Math.round((Date.UTC(+day.slice(0,4),+day.slice(5,7)-1,+day.slice(8,10))-Date.UTC(2026,10,25))/864e5)+1;
function pddAns(day){const L=pddPool();if(!L.length)return null;const r=v8Rng("pdd|"+day);r();return L[Math.floor(r()*L.length)]}
const pddKg=p=>{try{const id=window._spr[p[0]];const w=typeof WTH!=="undefined"?WTH[id]:null;return w?w/10:null}catch(e){return null}};
function pddSt(){const d=v8Day();S.pdd=S.pdd&&typeof S.pdd==="object"?S.pdd:{st:0,best:0,n:0,w:0};if(S.pdd.d!==d){S.pdd.d=d;S.pdd.g=[];S.pdd.ok=0;S.pdd.done=0}return S.pdd}
// racha: se rompe si ayer no lo resolviste
function pddStreakFix(s){const y=v8Day(Date.now()-864e5);if(s.last&&s.last!==y&&s.last!==s.d)s.st=0}
function pddClue(g,a){const tg=tys(g),ta=tys(a),c=[];
  [0,1].forEach(i=>{const x=tg[i]||null,y=ta[i]||null;c.push(!x&&!y?{v:"—",k:"ok"}:x===y?{v:x?EM[x]+" "+TIPO[x]:"—",k:"ok"}:x&&ta.includes(x)?{v:EM[x]+" "+TIPO[x],k:"mid"}:{v:x?EM[x]+" "+TIPO[x]:"—",k:"no"})});
  const gg=g[3]|0,ga=a[3]|0;c.push({v:"Gen "+gg,k:gg===ga?"ok":"no",ar:gg===ga?"":gg<ga?"⬆️":"⬇️"});
  const rg=V8RAR[g[2]]||1,ra=V8RAR[a[2]]||1;c.push({v:v8Stars(g[2]),k:rg===ra?"ok":"no",ar:rg===ra?"":rg<ra?"⬆️":"⬇️"});
  const wg=pddKg(g),wa=pddKg(a);c.push(wg==null||wa==null?{v:"?",k:"no"}:{v:(wg>=100?Math.round(wg):wg.toFixed(1).replace(".",","))+" kg",k:Math.abs(wg-wa)<=Math.max(1,wa*.1)?"ok":"no",ar:Math.abs(wg-wa)<=Math.max(1,wa*.1)?"":wg<wa?"⬆️":"⬇️"});
  return c}
v8Tab("ret","pddP","Pokémon del día","🔎 Pokémon del día","Adivina el Pokémon de hoy en 6 intentos. Cada intento te da pistas: tipos, generación, rareza y peso. Es el mismo para todos los entrenadores, ¡y cambia cada día a medianoche!",()=>pddUI(),0);
function pddUI(){const b=$("pddPB");if(!b)return;const s=pddSt(),a=pddAns(s.d);if(!a){b.innerHTML='<p class="mut">Cargando…</p>';return}pddStreakFix(s);
  const fin=s.ok||s.g.length>=PDD_N,num=pddNum(s.d);
  let h='<div class="pddtop"><span>🗓️ Reto n.º <b>'+num+'</b></span><span>🔥 Racha <b>'+(s.st|0)+'</b></span><span>🏆 Mejor <b>'+(s.best|0)+'</b></span><span>✅ Resueltos <b>'+(s.w|0)+'</b></span></div>'+
    (fin?'<div class="pddsil rev">'+icoHD(a,150,false,false)+'</div>':s.g.length>=4?'<div class="pddsil blur" title="Pista: su silueta">'+icoHD(a,150,false,false)+'</div>':'<div class="pddsil q"><span>❓</span><small class="mut">Su silueta aparecerá como pista en el 5.º intento</small></div>')+
    '<div class="pddgrid"><div class="pddh"><span>Pokémon</span><span>Tipo 1</span><span>Tipo 2</span><span>Generación</span><span>Rareza</span><span>Peso</span></div>';
  s.g.forEach(n=>{const g=PM[n];if(!g)return;const c=pddClue(g,a);h+='<div class="pddr"><span class="pddn">'+icoHD(g,34,false,false)+'<b>'+esc(n)+'</b></span>'+c.map(x=>'<span class="pddc '+x.k+'">'+esc(x.v)+(x.ar?' '+x.ar:'')+'</span>').join("")+'</div>'});
  for(let i=s.g.length;i<PDD_N;i++)h+='<div class="pddr empty"><span class="pddn">'+(i+1)+'</span><span></span><span></span><span></span><span></span><span></span></div>';
  h+='</div>';
  if(!fin)h+='<div class="pddin"><input id="pddQ" list="pddL" placeholder="Escribe un Pokémon…" autocomplete="off" aria-label="Escribe un Pokémon"><button class="red" id="pddGo">Probar</button></div><datalist id="pddL"></datalist><small class="mut">Intento '+(s.g.length+1)+' de '+PDD_N+'. ✅ = igual · 🟨 = es su otro tipo · ⬆️⬇️ = el de hoy es mayor o menor.</small>';
  else h+='<div class="pddres '+(s.ok?'ok':'no')+'"><b>'+(s.ok?'¡Era '+esc(a[0])+'! Lo has adivinado en '+s.g.length+(s.g.length===1?' intento':' intentos')+'.':'Era <b>'+esc(a[0])+'</b>. ¡Mañana más!')+'</b>'+(s.rw?'<small>Premio: '+rwTxt(s.rw)+'</small>':'')+'<div class="pddbtns"><button class="alt" id="pddSh">📋 Compartir (sin destripar)</button></div><small class="mut">Nuevo Pokémon del día en '+pddLeft()+'.</small></div>';
  b.innerHTML=h;const q=$("pddQ");if(q){const dl=$("pddL");q.oninput=()=>{const v=nrm(q.value);if(v.length<2){dl.innerHTML="";return}dl.innerHTML=pddPool().filter(p=>nrm(p[0]).startsWith(v)).slice(0,12).map(p=>'<option value="'+esc(p[0])+'">').join("")};
    q.onkeydown=e=>{if(e.key==="Enter")pddTry()};$("pddGo").onclick=pddTry}
  const sh=$("pddSh");if(sh)sh.onclick=()=>v8Copy(pddShare())}
const pddLeft=()=>{const m=v8Mad(),left=(24-m.h)*60-m.mi;return Math.floor(left/60)+" h "+(left%60)+" min"};
function pddTry(){const q=$("pddQ");if(!q)return;const s=pddSt(),a=pddAns(s.d),v=nrm(q.value.trim()),p=pddPool().find(x=>nrm(x[0])===v);
  if(!p){toast("No encuentro ese Pokémon. Elige uno de la lista.");return}if(s.g.includes(p[0])){toast("Ya lo has probado.");return}if(s.ok||s.g.length>=PDD_N)return;
  s.g.push(p[0]);snd("ui");
  if(p===a){s.ok=1;pddStreakFix(s);s.st=(s.st|0)+1;s.best=Math.max(s.best|0,s.st);s.w=(s.w|0)+1;s.last=s.d;
    const k=s.g.length,rw={t:v8Tk(k<=2?1:k<=4?.6:.35,k<=2?600000:300000),it:k===1?{cand:1,ub:3}:k<=3?{ub:2}:{sb:3}};if(s.st%7===0)rw.it.mb=(rw.it.mb||0)+1;
    s.rw=rw;grant(rw);snd("lvl");setTimeout(()=>snd("win"),300);try{cry(a[0])}catch(e){}toast("🔎 ¡Era "+a[0]+"! "+rwTxt(rw)+(s.st%7===0?" · ¡Racha de "+s.st+" días: Master Ball de regalo!":""));
    if(s.st===7||s.st===30)diaryAdd("🔎","¡Racha de "+s.st+" días acertando el Pokémon del día!",a[0],0,"lg")}
  else if(s.g.length>=PDD_N){s.st=0;snd("miss")}
  save();render();pddUI()}
function pddShare(){const s=pddSt(),a=pddAns(s.d);const em={ok:"🟩",mid:"🟨",no:"⬛"};const rows=s.g.map(n=>pddClue(PM[n],a).map(c=>em[c.k]).join("")).join("\n");
  return "🔎 Pokémon del día n.º "+pddNum(s.d)+" — "+(s.ok?s.g.length:"X")+"/"+PDD_N+(s.st>1?" · 🔥"+s.st:"")+"\n"+rows+"\nhttps://pokegachaonline.es"}
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{const s=pddSt();if(!s.ok&&s.g.length<PDD_N)o.ret=(o.ret|0)+1}catch(e){}return o}}

// ================= ASPECTOS PARA LA POKÉ BALL =================
// Cambian la Poké Ball grande del gacha (y sus destellos al tocarla). Se consiguen con logros, en eventos o comprándolos.
const SKINS=[
  {k:"",n:"Clásica",d:"La de siempre.",how:"Siempre disponible",ok:()=>true},
  {k:"great",n:"Super Ball",d:"Azul con franjas rojas.",how:"En la tienda",price:5e6},
  {k:"ultra",n:"Ultra Ball",d:"Negra y amarilla, para entrenadores serios.",how:"En la tienda",price:5e7},
  {k:"luxury",n:"Lujo Ball",d:"Negra con detalles dorados y rojos.",how:"En la tienda",price:5e8},
  {k:"ice",n:"Hielo",d:"Escarcha brillante que nunca se derrite.",how:"Evento: disponible gratis todo diciembre",ok:()=>v8Mad().m===12,event:1},
  {k:"gold",n:"Dorada",d:"Oro macizo con un brillo que deslumbra.",how:"Logro: consigue 25 legendarios distintos",ok:()=>Object.keys(S.owned||{}).filter(n=>S.owned[n]>0&&PM[n]&&PM[n][2]==="L").length>=25,prog:()=>[Object.keys(S.owned||{}).filter(n=>S.owned[n]>0&&PM[n]&&PM[n][2]==="L").length,25]},
  {k:"galaxy",n:"Galáctica",d:"Un trocito de universo con estrellas que giran.",how:"Logro: 600 Pokémon distintos en la Pokédex",ok:()=>Object.keys(S.owned||{}).filter(n=>S.owned[n]>0).length>=600,prog:()=>[Object.keys(S.owned||{}).filter(n=>S.owned[n]>0).length,600]},
  {k:"magma",n:"Magma",d:"Roca volcánica con grietas de lava.",how:"Logro: 25 victorias seguidas en la Torre Batalla",ok:()=>((S.tw||{}).best|0)>=25,prog:()=>[(S.tw||{}).best|0,25]},
  {k:"ghost",n:"Fantasma",d:"Translúcida y con niebla morada.",how:"Logro: 1.500 puntos en la Cueva oscura",ok:()=>((mgState().best||{}).cue|0)>=1500,prog:()=>[(mgState().best||{}).cue|0,1500]},
  {k:"leaf",n:"Hoja",d:"Hojas verdes que se mecen con el viento.",how:"Logro: gana 5 concursos Pokémon",ok:()=>((S.con||{}).w|0)>=5,prog:()=>[(S.con||{}).w|0,5]},
  {k:"thunder",n:"Trueno",d:"Electricidad pura recorriendo la superficie.",how:"Logro: racha de 14 días en el Pokémon del día",ok:()=>((S.pdd||{}).best|0)>=14,prog:()=>[(S.pdd||{}).best|0,14]},
  {k:"rainbow",n:"Arcoíris",d:"Todos los colores a la vez.",how:"Logro: título Beta-Tester o 50 variocolores",ok:()=>!!S.beta||Object.keys(S.shiny||{}).filter(n=>S.shiny[n]>0).length>=50,prog:()=>[Object.keys(S.shiny||{}).filter(n=>S.shiny[n]>0).length,50]},
];
// los de logro se quedan para siempre en cuanto se cumple; los de evento hay que recogerlos mientras dura
const skinHas=s=>{if(!s.k||(S.skins&&S.skins[s.k]))return true;if(!s.price&&!s.event&&s.ok&&s.ok()){S.skins=S.skins||{};S.skins[s.k]=1;return true}return false};
function skinApply(){const k=S.skin||"";const cur=SKINS.find(s=>s.k===k);const ok=cur&&skinHas(cur);document.querySelectorAll(".bigball").forEach(b=>{SKINS.forEach(s=>{if(s.k)b.classList.toggle("bs-"+s.k,ok&&s.k===k)})})}
setInterval(()=>{try{skinApply()}catch(e){}},1500);
v8Tab("trn","skinP","Aspectos de Poké Ball","🎨 Aspectos para la Poké Ball","Cambia el aspecto de la Poké Ball grande del gacha. Unos se compran, otros se ganan con logros y algunos solo están en eventos.",()=>skinUI());
function skinUI(){const b=$("skinPB");if(!b)return;const cur=S.skin||"";
  b.innerHTML='<div class="skgrid">'+SKINS.map(s=>{const has=skinHas(s),on=s.k===cur&&has,pr=s.prog?s.prog():null;
    return '<div class="skc'+(on?' on':'')+(has?'':s.price?' buy':' lock')+'"><div class="skball"><button type="button" class="bigball skprev'+(s.k?' bs-'+s.k:'')+'" tabindex="-1" aria-hidden="true"></button></div><b>'+esc(s.n)+'</b><small>'+esc(s.d)+'</small><small class="skhow">'+(s.event?'🎉 ':'')+esc(s.how)+'</small>'+
      (pr&&!has?'<div class="bar"><i style="width:'+Math.min(100,pr[0]/pr[1]*100)+'%"></i></div><small class="mut">'+fmt(Math.min(pr[0],pr[1]))+' / '+fmt(pr[1])+'</small>':'')+
      (on?'<span class="skon">✓ Puesta</span>':has?'<button class="red" data-sku="'+s.k+'">Ponérmela</button>':s.price?'<button data-skb="'+s.k+'"'+(S.t<s.price?' disabled':'')+'>Comprar · '+fmt(s.price)+' 🎟️</button>':s.event&&s.ok()?'<button class="red" data-skb="'+s.k+'">🎁 Conseguir gratis</button>':'<span class="mut">🔒 Bloqueada</span>')+'</div>'}).join("")+'</div>'}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#skinPB [data-sku],#skinPB [data-skb]");if(!t)return;
  if(t.dataset.sku!=null){S.skin=t.dataset.sku;save();skinApply();snd("ui");toast("🎨 ¡Aspecto cambiado!");skinUI();return}
  const s=SKINS.find(x=>x.k===t.dataset.skb);if(!s||skinHas(s))return;if(s.event){if(!s.ok())return}else{if(!s.price)return;if(S.t<s.price){toast("No tienes tickets suficientes.");return}S.t-=s.price}
  S.skins=S.skins||{};S.skins[s.k]=1;S.skin=s.k;save();render();skinApply();snd("lvl");toast("🎨 ¡Ya tienes el aspecto «"+s.n+"»!");diaryAdd("🎨","Nuevo aspecto para la Poké Ball: "+s.n+".",null,0,"o");skinUI()});

// ================= ESPECIALIDADES DE ENTRENADOR =================
// Criador (huevos), Coleccionista (variocolores) o Estratega (experiencia). Cada una sube de rango (1 a 3) con lo que
// haces en ella y da un título al llegar al rango 3. Se puede cambiar gratis una vez a la semana.
const SPECS={
  B:{n:"Criador",ic:"🥚",c:"#ff9a3c",d:"La Guardería encuentra huevos antes y los huevos necesitan menos combates para eclosionar. Además, más probabilidad de que salgan variocolores.",xp:"huevos eclosionados",need:[0,5,20,50],tit:"🥚 Gran Criador",
    fx:r=>["Huevos un "+r*10+" % antes en la Guardería","Los huevos necesitan "+r+" combate"+(r>1?"s":"")+" menos","Variocolor en huevos ×"+(1+r*.5).toString().replace(".",",")]},
  C:{n:"Coleccionista",ic:"📚",c:"#7a5cff",d:"Más probabilidad de encontrar Pokémon variocolor en combates y en la Exploración.",xp:"Pokémon capturados",need:[0,25,100,300],tit:"📚 Gran Coleccionista",
    fx:r=>["Variocolores salvajes ×"+(1+r*.25).toString().replace(".",","),"Al capturar, "+r*5+" % de probabilidad de una Poké Ball de vuelta"]},
  T:{n:"Estratega",ic:"🧠",c:"#2f8be0",d:"Tus Pokémon ganan más experiencia en los combates.",xp:"combates ganados",need:[0,25,100,300],tit:"🧠 Gran Estratega",
    fx:r=>["+"+r*10+" % de experiencia en combate"]}
};
const SPEC_UNLOCK=()=>medCount()>=1||Object.keys(S.owned||{}).filter(n=>S.owned[n]>0).length>=50;
function specSt(){S.spec=S.spec&&typeof S.spec==="object"?S.spec:{k:"",at:0,b:{}};S.spec.b=S.spec.b||{};return S.spec}
const specXp=k=>{const c=v8C(),b=specSt().b[k]||0;return Math.max(0,(k==="B"?((stt().hatch|0)):k==="C"?(c.cap|0):(c.win|0))-b)};
const specRank=k=>{const s=specSt();if(s.k!==k)return 0;const x=specXp(k),N=SPECS[k].need;return x>=N[3]?3:x>=N[2]?2:1};
Object.keys(SPECS).forEach(k=>TITLES.push(["sp"+k,SPECS[k].tit,()=>((S.spec||{}).best||{})[k]>=3]));
// efectos
{const _dt=dcTake;dcTake=function(){const n0=(S.eggs||[]).length;const r=_dt.apply(this,arguments);try{const rk=specRank("B");if(rk&&(S.eggs||[]).length>n0){const g=S.eggs[S.eggs.length-1];g.need=Math.max(1,g.need-rk);if(!g.sh&&Math.random()<(1/120)*rk*.5)g.sh=1;
  if(S.dc&&S.dc.t)S.dc.t-=DC_T*.1*rk;save()}}catch(e){}return r}}
{const _hh=hhTick;hhTick=function(){const r=_hh.apply(this,arguments);try{const rk=specRank("C");if(rk)SHINY_W*=1+rk*.25}catch(e){}return r}}
{const _gx=gainXp;gainXp=function(p,amt){const rk=specRank("T");return _gx.call(this,p,rk?Math.round(amt*(1+rk*.1)):amt)}}
{const _q2=qEv;qEv=function(ev,n){const r=_q2.apply(this,arguments);try{if(ev==="cap"){const rk=specRank("C");if(rk&&Math.random()<rk*.05){S.bag.pb=(S.bag.pb||0)+1;toast("📚 Coleccionista: ¡recuperas una Poké Ball!")}}
  const s=S.spec;if(s&&s.k){s.best=s.best||{};const rk=specRank(s.k);if(rk>(s.best[s.k]|0)){s.best[s.k]=rk;if(rk>1){toast(SPECS[s.k].ic+" ¡Has subido a "+SPECS[s.k].n+" de rango "+rk+"!");diaryAdd(SPECS[s.k].ic,"Rango "+rk+" de "+SPECS[s.k].n+(rk===3?": ¡título «"+SPECS[s.k].tit+"» desbloqueado!":"."),null,0,"lg")}}}}catch(e){}return r}}
v8Tab("trn","specP","Especialidad","🎓 Especialidades de entrenador","Elige tu camino: Criador, Coleccionista o Estratega. Cuanto más practiques tu especialidad, más sube de rango y mejores son sus ventajas.",()=>specUI());
function specUI(){const b=$("specPB");if(!b)return;const s=specSt(),un=SPEC_UNLOCK(),wk=7*864e5,can=!s.at||Date.now()-s.at>=wk;
  if(!un){b.innerHTML='<div class="spclock">🔒 <b>Se desbloquea al conseguir tu primera medalla o 50 Pokémon distintos.</b><small class="mut">¡Sigue jugando y vuelve pronto!</small></div>';return}
  b.innerHTML=(s.k?'':'<p class="rates">¡Ya puedes elegir tu especialidad! Piénsalo bien: luego solo se puede cambiar una vez a la semana.</p>')+'<div class="spcgrid">'+Object.keys(SPECS).map(k=>{const P2=SPECS[k],on=s.k===k,rk=on?specRank(k):0,x=specXp(k),N=P2.need,nx=rk&&rk<3?N[rk+1]:0;
    return '<div class="spcc'+(on?' on':'')+'" style="--sc:'+P2.c+'"><div class="spci">'+P2.ic+'</div><b>'+P2.n+'</b><small>'+P2.d+'</small>'+
      (on?'<div class="spcrk">'+[1,2,3].map(i=>'<span class="'+(i<=rk?"on":"")+'">★</span>').join("")+'<small>Rango '+rk+'</small></div><ul>'+P2.fx(rk).map(t=>'<li>'+t+'</li>').join("")+'</ul>'+(nx?'<div class="bar"><i style="width:'+Math.min(100,x/nx*100)+'%"></i></div><small class="mut">'+fmt(x)+' / '+fmt(nx)+' '+P2.xp+' para el rango '+(rk+1)+'</small>':'<small class="mut">¡Rango máximo! Título «'+P2.tit+'»</small>')
        :'<ul>'+P2.fx(1).map(t=>'<li>'+t+'</li>').join("")+'</ul><small class="mut">Sube de rango con '+P2.xp+'.</small><button class="red" data-spc="'+k+'"'+(s.k&&!can?' disabled':'')+'>'+(s.k?'Cambiar a '+P2.n:'Elegir '+P2.n)+'</button>')+'</div>'}).join("")+'</div>'+
    (s.k&&!can?'<small class="mut">Podrás cambiar de especialidad en '+Math.ceil((wk-(Date.now()-s.at))/864e5)+' día(s). Al cambiar, el rango vuelve a empezar (los títulos conseguidos no se pierden).</small>':s.k?'<small class="mut">Al cambiar, el rango vuelve a empezar (los títulos conseguidos no se pierden).</small>':'')}
document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("#specPB [data-spc]");if(!t)return;const k=t.dataset.spc,s=specSt();if(!SPECS[k]||!SPEC_UNLOCK())return;
  if(s.k&&s.at&&Date.now()-s.at<7*864e5)return;if(s.k&&!(await askOk("¿Cambiar a "+SPECS[k].n+"? Tu rango empezará de nuevo y no podrás volver a cambiar hasta dentro de 7 días.")))return;
  const c=v8C();s.k=k;s.at=Date.now();s.b={B:stt().hatch|0,C:c.cap|0,T:c.win|0};save();snd("lvl");toast(SPECS[k].ic+" ¡Ahora eres "+SPECS[k].n+"!");diaryAdd(SPECS[k].ic,"Has elegido la especialidad de "+SPECS[k].n+".",null,0,"o");try{hhTick()}catch(x){}specUI()});
