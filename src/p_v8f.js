// =====================================================================================
// 8.3 · TALLER DE REPETIDOS, META DE LA COMUNIDAD Y BINGO POKÉMON
// =====================================================================================

// ================= TALLER DE REPETIDOS =================
// Los repetidos normales se convierten en polvo de estrellas ✨ y con el polvo se fabrican los Pokémon que te faltan.
// Nunca se toca la copia principal ni los repetidos variocolores. La pegatina brillante del Álbum (5 copias) se queda
// para siempre aunque conviertas las copias (S.stkB).
const TLR_DUST={C:1,R:3,E:10,M:25,L:40},TLR_COST={C:20,R:60,E:200,L:800},TLR_DAY=10;
// megaevoluciones (8.4): 1.200 ✨ (2.500 las legendarias), una por semana y solo si tienes su Pokémon base (para poder usarla)
const TLR_MEGA={M:1200,E:1200,L:2500};
const tlrIsMega=p=>!!p&&/^Mega-/.test(p[0])&&!(typeof isSup==="function"&&isSup(p[0]))&&!!PM[megaBase(p[0])];
const tlrCost=p=>tlrIsMega(p)?TLR_MEGA[p[2]]||1200:TLR_COST[p[2]];
const TLR_SHOP=[["cand",40,1,"Caramelo Raro"],["ub",15,5,"Ultra Ball ×5"],["ppmax",60,1,"PP máximos"],["tshard",80,1,"Teralito"]];
const TLR={q:"",f:"",nw:true,open:false};
function tlrSt(){const d=v8Day(),w=cmuWeek();S.tlr=S.tlr&&typeof S.tlr==="object"?S.tlr:{};const t=S.tlr;if(t.d!==d){t.d=d;t.n=0}if(t.w!==w){t.w=w;t.l=0;t.m=0}
  if(t.keep==null)t.keep=0;if(t.fav==null)t.fav=1;if(!t.r)t.r={C:1,R:1,E:1,M:0,L:0};return t}
const tlrDust=()=>Math.max(0,Math.floor(S.dust||0));
// copias que se pueden convertir de cada especie (solo repetidos normales, guardando los que elijas)
function tlrCan(n){const t=tlrSt();if(!PM[n]||!(S.owned[n]>1)||busyMon(n))return 0;if(t.fav&&isFav(n))return 0;const c=(trCopies(n).find(x=>x.k==="d")||{}).c|0;return Math.max(0,c-(t.keep|0))}
const tlrList=()=>Object.keys(S.owned||{}).filter(n=>tlrCan(n)>0).map(n=>({n,p:PM[n],c:tlrCan(n)}));
function tlrConvert(L){let k=0,d=0;S.stkB=S.stkB&&typeof S.stkB==="object"?S.stkB:{};
  L.forEach(x=>{const c=Math.min(x.c,tlrCan(x.n));if(c<=0)return;if((S.owned[x.n]|0)>=5)S.stkB[x.n]=1;S.owned[x.n]-=c;k+=c;d+=c*(TLR_DUST[x.p[2]]||1)});
  if(!k)return;S.dust=tlrDust()+d;S.tlrN=(S.tlrN|0)+k;save();snd("lvl");toast("✨ "+k+" repetido"+(k>1?"s":"")+" convertido"+(k>1?"s":"")+" en "+fmt(d)+" de polvo de estrellas.");render();tlrUI()}
// Pokémon que se pueden fabricar: los que no tienes ahora (sin megas, formas ni singulares)
const tlrCraftable=()=>P.filter(p=>!(S.owned[p[0]]>0)&&(tlrIsMega(p)||(v8Base(p)&&TLR_COST[p[2]]&&window._spr&&window._spr[p[0]])));
// por qué no se puede fabricar ahora (o "" si se puede)
function tlrWhy(p){const t=tlrSt(),c=tlrCost(p);if(tlrIsMega(p)){const b=megaBase(p[0]);if(!(S.owned[b]>0))return "Necesitas a "+b;if((t.m|0)>=1)return "Ya fabricaste una mega esta semana"}
  else if(p[2]==="L"&&t.l>=1)return "Ya fabricaste un legendario esta semana";if(t.n>=TLR_DAY)return "Hoy ya has fabricado "+TLR_DAY;if(tlrDust()<c)return "Te falta polvo";return ""}
async function tlrCraft(n){const p=PM[n],t=tlrSt();if(!p||S.owned[n]>0||!tlrCost(p))return;const c=tlrCost(p),mg=tlrIsMega(p);
  if(mg){const why=tlrWhy(p);if(why){toast(why+".");return}}
  if(tlrDust()<c){toast("Te falta polvo de estrellas.");return}if(t.n>=TLR_DAY){toast("Hoy ya has fabricado "+TLR_DAY+" Pokémon. ¡Vuelve mañana!");return}
  if(!mg&&p[2]==="L"&&t.l>=1){toast("Solo se puede fabricar un legendario por semana.");return}
  if(!await askOk("¿Fabricar a "+n+" por "+fmt(c)+" ✨ de polvo de estrellas?"))return;if(tlrDust()<c||S.owned[n]>0)return;
  S.dust=tlrDust()-c;t.n++;if(mg)t.m=(t.m|0)+1;else if(p[2]==="L")t.l++;const sh=Math.random()<.01;
  const lv=typeof clampL==="function"?clampL(Math.max(5,Math.min(typeof lvCap==="function"?lvCap():50,typeof leadLevel==="function"?leadLevel():5))):5;
  const isNew=giveMon(n,lv,sh);save();snd("win");toast("🔨 ¡Has fabricado a "+(sh?"✨ ":"")+n+"!"+(isNew?" ¡Nuevo en tu Pokédex!":"")+(sh?" ¡Y ha salido variocolor!":""));
  if(p[2]==="L"||mg||sh)diaryAdd("🔨","Fabricado en el Taller de repetidos: "+(sh?"✨ ":"")+n,n,sh?1:0,"pk");
  if(mg)setTimeout(()=>toast("🧬 Lleva a "+megaBase(n)+" en tu equipo y pulsa «"+(/Gigamax/.test(n)?"🔴 Gigamax":"🧬 Megaevolucionar")+"» en combate."),2500);render();tlrUI()}
function tlrBuy(i){const it=TLR_SHOP[i];if(!it||tlrDust()<it[1])return;S.dust=tlrDust()-it[1];S.bag=S.bag||{};S.bag[it[0]]=(S.bag[it[0]]||0)+it[2];save();snd("lvl");toast("🛒 "+it[3]+" por "+it[1]+" ✨");tlrUI()}
function tlrUI(){const b=$("tlrPB");if(!b)return;const t=tlrSt(),L=tlrList(),R=["C","R","E","M","L"],by={};R.forEach(r=>by[r]={c:0,d:0});
  L.forEach(x=>{const r=by[x.p[2]];if(r){r.c+=x.c;r.d+=x.c*(TLR_DUST[x.p[2]]||1)}});
  const sel=R.filter(r=>t.r[r]),selC=sel.reduce((a,r)=>a+by[r].c,0),selD=sel.reduce((a,r)=>a+by[r].d,0);
  const q=nrm(TLR.q||""),C=tlrCraftable().filter(p=>(TLR.f==="MG"?tlrIsMega(p):!TLR.f?true:p[2]===TLR.f&&!tlrIsMega(p))&&(!TLR.nw||!hasP(p[0]))&&(!q||nrm(p[0]).includes(q))).map(p=>[p,tlrWhy(p)?1:0]).sort((a,c)=>(a[1]-c[1])||(tlrIsMega(c[0])-tlrIsMega(a[0]))||(tlrIsMega(a[0])&&tlrIsMega(c[0])?((S.owned[megaBase(c[0][0])]>0)-(S.owned[megaBase(a[0][0])]>0)):0)||(hasP(a[0][0])-hasP(c[0][0]))||(tlrCost(a[0])-tlrCost(c[0]))).map(x=>x[0]).slice(0,!TLR.f?200:120);
  const D=tlrDust();
  b.innerHTML='<div class="tlrtop"><div class="tlrdust"><span>✨</span><b>'+fmt(D)+'</b><small>polvo de estrellas</small></div><div class="tlrrate">'+R.map(r=>'<span>'+STAR[r]+' → <b>'+TLR_DUST[r]+'</b> ✨</span>').join("")+'</div></div>'+
    '<div class="tlrsec"><h3>♻️ Convertir repetidos</h3><small class="mut">Tu copia principal y tus repetidos variocolores no se tocan nunca. La pegatina brillante del Álbum (5 copias) se queda aunque conviertas.</small>'+
    '<div class="tlropts"><label>Guardar <select id="tlrKeep">'+[0,1,2,4].map(k=>'<option value="'+k+'"'+(t.keep==k?' selected':'')+'>'+(k?k+" repetido"+(k>1?"s":""):"ningún repetido")+'</option>').join("")+'</select> de cada uno</label><label><input type="checkbox" id="tlrFav"'+(t.fav?' checked':'')+'> No tocar mis favoritos ⭐</label></div>'+
    '<div class="tlrrar">'+R.map(r=>'<label class="tlrchip'+(t.r[r]?' on':'')+(by[r].c?'':' off')+'"><input type="checkbox" data-tlrr="'+r+'"'+(t.r[r]?' checked':'')+'><b>'+STAR[r]+'</b><small>'+by[r].c+' copia'+(by[r].c===1?'':'s')+'</small><small>+'+fmt(by[r].d)+' ✨</small></label>').join("")+'</div>'+
    '<button class="red" id="tlrGo"'+(selC?'':' disabled')+'>♻️ Convertir '+selC+' repetido'+(selC===1?'':'s')+' → +'+fmt(selD)+' ✨</button>'+
    (L.length?'<details class="tlrdet"'+(TLR.open?' open':'')+'><summary>Ver uno a uno ('+L.length+' especies)</summary><div class="tlrgrid">'+L.sort((a,c)=>c.c-a.c||(TLR_DUST[c.p[2]]-TLR_DUST[a.p[2]])).slice(0,120).map(x=>'<div class="tlrc '+x.p[2]+'">'+ico(x.p,40)+'<b>'+esc(nk(x.n))+'</b><small>×'+x.c+' · '+TLR_DUST[x.p[2]]+' ✨ c/u</small><div><button class="alt mini" data-tlr1="'+esc(x.n)+'">−1</button><button class="alt mini" data-tlra="'+esc(x.n)+'">Todos</button></div></div>').join("")+'</div></details>':'<p class="mut">No tienes repetidos que convertir con estas opciones.</p>')+'</div>'+
    '<div class="tlrsec"><h3>🔨 Fabricar Pokémon</h3><small class="mut">Fabrica los Pokémon que no tienes. Hoy: <b>'+t.n+'/'+TLR_DAY+'</b> · Legendarios esta semana: <b>'+t.l+'/1</b> · Megas esta semana: <b>'+(t.m|0)+'/1</b> · ¡Cada uno tiene un 1 % de salir variocolor!</small>'+
    '<div class="tlropts"><input id="tlrQ" placeholder="Buscar Pokémon…" value="'+esc(TLR.q||"")+'"><select id="tlrF"><option value="">Todas</option>'+["C","R","E","L"].map(r=>'<option value="'+r+'"'+(TLR.f===r?' selected':'')+'>'+STAR[r]+' · '+TLR_COST[r]+' ✨</option>').join("")+'<option value="MG"'+(TLR.f==="MG"?' selected':'')+'>🧬 Megas · '+fmt(TLR_MEGA.M)+' ✨ (legendarias '+fmt(TLR_MEGA.L)+')</option></select><label><input type="checkbox" id="tlrNw"'+(TLR.nw?' checked':'')+'> Solo los que nunca he tenido</label></div>'+
    '<div class="tlrgrid">'+(C.length?C.map(p=>{const c=tlrCost(p),why=tlrWhy(p),ok=!why,mg=tlrIsMega(p);return '<div class="tlrc '+p[2]+(ok?'':' no')+(mg?' mg':'')+'"'+(why?' title="'+esc(why)+'"':'')+'>'+ico(p,40)+'<b>'+esc(p[0])+'</b><small>'+STAR[p[2]]+(mg?' · 🧬':'')+(hasP(p[0])?'':' · 🆕')+'</small>'+(mg&&!(S.owned[megaBase(p[0])]>0)?'<small class="tlrneed">Necesitas a '+esc(megaBase(p[0]))+'</small>':'')+'<button class="'+(ok?'red':'alt')+' mini" data-tlrc="'+esc(p[0])+'"'+(ok?'':' disabled')+'>🔨 '+fmt(c)+' ✨</button></div>'}).join(""):'<small class="mut">No hay Pokémon con ese filtro. ¡Quizá ya los tienes todos!</small>')+'</div></div>'+
    '<div class="tlrsec"><h3>🛒 Tienda del taller</h3><div class="tlrshop">'+TLR_SHOP.map((it,i)=>'<button class="alt" data-tlrs="'+i+'"'+(D>=it[1]?'':' disabled')+'><b>'+it[3]+'</b><small>'+it[1]+' ✨</small></button>').join("")+'</div></div>';
  const det=b.querySelector(".tlrdet");if(det)det.addEventListener("toggle",()=>{TLR.open=det.open});
  const qi=$("tlrQ");if(qi&&TLR._f){qi.focus();try{qi.setSelectionRange(qi.value.length,qi.value.length)}catch(e){}TLR._f=0}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#tlrPB button");if(!b||b.disabled)return;const t=tlrSt();
  if(b.id==="tlrGo"){const L=tlrList().filter(x=>t.r[x.p[2]]);const k=L.reduce((a,x)=>a+x.c,0);if(!k)return;
    askOk("¿Convertir "+k+" repetido"+(k>1?"s":"")+" en polvo de estrellas? No se puede deshacer.").then(ok=>{if(ok)tlrConvert(L)});return}
  if(b.dataset.tlr1){const n=b.dataset.tlr1;tlrConvert([{n,p:PM[n],c:1}]);return}
  if(b.dataset.tlra){const n=b.dataset.tlra;tlrConvert([{n,p:PM[n],c:tlrCan(n)}]);return}
  if(b.dataset.tlrc){tlrCraft(b.dataset.tlrc);return}
  if(b.dataset.tlrs){tlrBuy(+b.dataset.tlrs)}});
document.addEventListener("change",e=>{const el=e.target;if(!el.closest||!el.closest("#tlrPB"))return;const t=tlrSt();
  if(el.id==="tlrKeep")t.keep=+el.value||0;else if(el.id==="tlrFav")t.fav=el.checked?1:0;else if(el.dataset.tlrr)t.r[el.dataset.tlrr]=el.checked?1:0;
  else if(el.id==="tlrF")TLR.f=el.value;else if(el.id==="tlrNw")TLR.nw=el.checked;else return;save();tlrUI()});
document.addEventListener("input",e=>{if(e.target.id!=="tlrQ")return;TLR.q=e.target.value;clearTimeout(TLR._t);TLR._t=setTimeout(()=>{TLR._f=1;tlrUI()},250)});
v8Tab("dex","tlrP","Taller de repetidos","♻️ Taller de repetidos","Convierte tus Pokémon repetidos en polvo de estrellas ✨ y úsalo para fabricar los Pokémon que te faltan en la Pokédex.",()=>tlrUI());

// ================= META DE LA COMUNIDAD =================
// Todas las tiradas del gacha de todos los jugadores suman en una meta semanal (las cuenta el servidor al tirar:
// comunidad/{semana}). La meta de cada semana es un 10 % más que lo que se tiró la anterior (como mínimo 20 000).
// Al llegar al 25, 50, 75, 100 y 150 %, todos los que hayan tirado al menos 10 veces esa semana cobran su premio.
// Los premios de la semana pasada se pueden cobrar durante la semana siguiente.
const CMU_MIN=20000,CMU_ME=10;
const CMU_MS=[[25,{h:.5,it:{ub:3}}],[50,{h:1,it:{cand:2}}],[75,{h:2,it:{cand:3,ppmax:1}}],[100,{h:3,it:{mb:1}}],[150,{h:4,it:{mb:1,crys:1}}]];
const cmuNow=()=>typeof window.srvNow==="function"?window.srvNow():Date.now();
// semana ISO de la fecha de Madrid (la misma que usa el servidor)
function cmuWeek(t){const m=v8Mad(t==null?cmuNow():t),d=new Date(Date.UTC(m.y,m.m-1,m.d)),n=d.getUTCDay()||7;d.setUTCDate(d.getUTCDate()+4-n);const y=new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return d.getUTCFullYear()+"-W"+String(Math.ceil(((d-y)/864e5+1)/7)).padStart(2,"0")}
const cmuPrevW=()=>cmuWeek(cmuNow()-7*864e5);
const cmuNice=x=>{if(x<=0)return 0;const e=Math.pow(10,Math.max(0,Math.floor(Math.log10(x))-1));return Math.ceil(x/e)*e};
const cmuGoal=prev=>Math.max(CMU_MIN,cmuNice((prev||0)*1.1));
const CMU={w:"",n:null,me:null,top:[],pw:"",pn:null,ppn:null,pme:null,unsub:null,at:0,busy:false};
function cmuGot(w){S.cmu=S.cmu&&typeof S.cmu==="object"?S.cmu:{};if(!Array.isArray(S.cmu[w]))S.cmu[w]=[];return S.cmu[w]}
function cmuPrune(){if(!S.cmu)return;const k=Object.keys(S.cmu).sort();while(k.length>3)delete S.cmu[k.shift()]}
// datos de la semana: total, meta (según la semana anterior), tu aportación
async function cmuLoad(force){const F=window.FB;if(!F||!F.cmGet||!v8Uid())return;if(!force&&Date.now()-CMU.at<60000)return;CMU.at=Date.now();
  const w=cmuWeek(),pw=cmuPrevW(),ppw=cmuWeek(cmuNow()-14*864e5);
  if(CMU.w!==w){CMU.w=w;CMU.n=null;CMU.me=null;CMU.top=[];if(CMU.unsub){try{CMU.unsub()}catch(e){}CMU.unsub=null}}
  try{const tasks=[F.cmMe(w).then(v=>CMU.me=v)];if(!CMU.unsub)tasks.push(F.cmGet(w).then(v=>CMU.n=v));
    if(CMU.pw!==pw){CMU.pw=pw;tasks.push(F.cmGet(pw).then(v=>CMU.pn=v),F.cmGet(ppw).then(v=>CMU.ppn=v),F.cmMe(pw).then(v=>CMU.pme=v))}
    if(nxOpen("cmuP"))tasks.push(F.cmTop(w).then(v=>CMU.top=v).catch(()=>{}));
    await Promise.all(tasks)}catch(e){}
  if(nxOpen("cmuP"))cmuUI()}
const cmuInfo=(n,goalPrev)=>{const g=cmuGoal(goalPrev);return{g,n:n||0,pct:g?(n||0)/g*100:0}};
const cmuCan=(w,info,me)=>me>=CMU_ME?CMU_MS.filter(m=>info.pct>=m[0]&&!cmuGot(w).includes(m[0])):[];
function cmuClaim(w,pct){if(CMU.busy)return;const prev=w===CMU.w,info=prev?cmuInfo(CMU.n,CMU.pn):cmuInfo(CMU.pn,CMU.ppn),me=prev?CMU.me:CMU.pme;
  const m=CMU_MS.find(x=>x[0]===pct);if(!m||me<CMU_ME||info.pct<pct||cmuGot(w).includes(pct))return;
  cmuGot(w).push(pct);cmuPrune();const rw={t:v8Tk(m[1].h,300000),it:Object.assign({},m[1].it)};grant(rw);if(pct>=100)S.cmuHero=(S.cmuHero|0)+1;save();render();snd("win");
  toast("🌍 ¡Premio de la meta de la comunidad ("+pct+" %)! "+rwTxt(rw));if(pct>=100)diaryAdd("🌍","¡Entre todos hemos superado la meta de la comunidad de la semana!",null,0,"o");cmuUI()}
TITLES.push(["cmu","🌍 Héroe de la comunidad",()=>(S.cmuHero|0)>=1]);
const cmuLeft=()=>{const m=v8Mad(cmuNow()),min=((6-m.wd)*24+(23-m.h))*60+(60-m.mi);const d=Math.floor(min/1440),h=Math.floor(min%1440/60);return d?d+" d "+h+" h":h+" h "+(min%60)+" min"};
function cmuBar(info){const W=150,mk=CMU_MS.map(m=>'<i style="left:'+(m[0]/W*100)+'%" class="'+(info.pct>=m[0]?'on':'')+'"><b>'+m[0]+'%</b></i>').join("");
  return '<div class="cmubar"><div class="cmufill" style="width:'+Math.min(100,info.pct/W*100)+'%"></div>'+mk+'</div>'}
function cmuUI(){const b=$("cmuPB");if(!b)return;if(!v8Uid()){b.innerHTML='<p class="mut">Inicia sesión con tu cuenta para participar en la meta de la comunidad.</p>';return}
  if(CMU.n==null){b.innerHTML='<p class="mut">⏳ Cargando la meta de la semana…</p>';cmuLoad(true);return}
  const w=CMU.w,info=cmuInfo(CMU.n,CMU.pn),me=CMU.me|0,got=cmuGot(w);
  const row=(W,inf,mine)=>CMU_MS.map(m=>{const rw={t:v8Tk(m[1].h,300000),it:m[1].it},ok=inf.pct>=m[0],has=cmuGot(W).includes(m[0]);
    return '<div class="cmums'+(has?' got':ok?' ok':'')+'"><b>'+m[0]+' %</b><span>'+rwTxt(rw)+'</span>'+(has?'<em>✅ Cobrado</em>':ok?(mine>=CMU_ME?'<button class="red mini" data-cmuc="'+W+'|'+m[0]+'">🎁 Cobrar</button>':'<em>Tira '+(CMU_ME-mine)+(CMU_ME-mine===1?' vez':' veces')+' más</em>'):'<em>🔒 Faltan '+fmt(Math.max(0,Math.ceil(inf.g*m[0]/100-inf.n)))+'</em>')+'</div>'}).join("");
  const pInfo=CMU.pn!=null?cmuInfo(CMU.pn,CMU.ppn):null,pCan=pInfo?cmuCan(CMU.pw,pInfo,CMU.pme|0):[];
  b.innerHTML='<div class="cmuhd"><div class="cmuglobe">🌍</div><div><b>¡'+fmt(info.g)+' tiradas entre todos esta semana!</b><small class="mut">Cada tirada del gacha de cualquier entrenador suma. Termina en <b>'+cmuLeft()+'</b>.</small></div></div>'+
    '<div class="cmunum"><b>'+fmt(info.n)+'</b> / '+fmt(info.g)+' <span>('+Math.floor(info.pct)+' %)</span>'+(CMU.unsub?'<small class="cmulive">● EN DIRECTO</small>':'')+'</div>'+cmuBar(info)+
    '<p class="cmume">🙋 Tu aportación esta semana: <b>'+fmt(me)+'</b> tirada'+(me===1?'':'s')+(me<CMU_ME?' · <span class="mut">Tira al menos '+CMU_ME+' veces para cobrar los premios.</span>':' · ✅ ¡Ya puedes cobrar los premios!')+'</p>'+
    '<div class="cmulist">'+row(w,info,me)+'</div>'+
    (pCan.length?'<div class="lgnow cmuprev"><b>🗓️ La semana pasada llegamos al '+Math.floor(pInfo.pct)+' %</b><small class="mut">Aún puedes cobrar lo que te falta:</small><div class="cmulist">'+row(CMU.pw,pInfo,CMU.pme|0)+'</div></div>':'')+
    (CMU.top&&CMU.top.length?'<h3>🏅 Quién más está ayudando</h3><ol class="cmutop">'+CMU.top.map(x=>'<li'+(x.u===v8Uid()?' class="me"':'')+'><b class="plink" data-prof="'+esc(x.u)+'">'+esc(String(x.nk||"Entrenador").slice(0,20))+'</b><span>'+fmt(+x.n||0)+'</span></li>').join("")+'</ol>':'')+
    '<small class="mut">La meta de cada semana es un 10 % más de lo que se tiró la anterior. Los premios crecen con tu pueblo.</small>'}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-cmuc]");if(!b)return;const[w,p]=b.dataset.cmuc.split("|");cmuClaim(w,+p)});
v8Tab("ret","cmuP","Meta de la comunidad","🌍 Meta de la comunidad","Una meta semanal para todos los entrenadores a la vez: cada tirada del gacha suma. ¡Al llegar a cada marca, todos los que hayan participado se llevan un premio!",()=>{cmuUI();cmuLoad(true)},0);
// en directo solo mientras el panel está abierto (cada tirada de cualquiera es una lectura)
setInterval(()=>{try{const F=window.FB;if(!F||!F.cmWatch||!v8Uid())return;const op=nxOpen("cmuP");
  if(op&&!CMU.unsub&&CMU.w){CMU.unsub=F.cmWatch(CMU.w,n=>{if(n==null)return;const old=CMU.n;CMU.n=n;if(old!=null&&old!==n&&nxOpen("cmuP"))cmuUI()})}
  else if(!op&&CMU.unsub){CMU.unsub();CMU.unsub=null}
  if(op&&Date.now()-CMU.at>60000)cmuLoad(true)}catch(e){}},2000);
setTimeout(()=>{try{cmuLoad(true)}catch(e){}},15000);setInterval(()=>{try{cmuLoad(false)}catch(e){}},600000);
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{if(CMU.n!=null){let n=cmuCan(CMU.w,cmuInfo(CMU.n,CMU.pn),CMU.me|0).length;if(CMU.pn!=null)n+=cmuCan(CMU.pw,cmuInfo(CMU.pn,CMU.ppn),CMU.pme|0).length;if(n)o.ret=(o.ret|0)+n}}catch(e){}return o}}

// ================= BINGO POKÉMON =================
// Las mismas cuentas que _server/bingo.js (si se cambia algo aquí, hay que cambiarlo allí también).
const BNG={PER:360000,LOB:90000,CALL:3500,POOL:60,MAXC:4,DIA:40,GR:3};
const BNG_S={
  b:{n:"Sala Bosque",ic:"🌳",p:10000,l:{pb:5},b:{sb:5},b3:{cand:1},pk:{C:.6,R:.35,E:.05},sh:.02},
  c:{n:"Sala Ciudad",ic:"🏙️",p:1000000,l:{sb:5},b:{ub:5},b3:{cand:3,ppmax:1},pk:{C:.3,R:.5,E:.2},sh:.04},
  l:{n:"Sala Liga",ic:"🏆",p:100000000,l:{ub:5},b:{cand:3,tshard:2},b3:{mb:1,crys:1},pk:{C:0,R:.4,E:.6},sh:.08}};
// Pokémon sorpresa del bingo (lo sortea el servidor al cobrar): probabilidades de cada rareza y de variocolor
const bngPkTxt=s=>{const S2=BNG_S[s];return["C","R","E"].filter(r=>S2.pk[r]).map(r=>STAR[r]+" "+Math.round(S2.pk[r]*100)+" %").join(" · ")+" · ✨ "+Math.round(S2.sh*100)+" %"};
const BNG_HOST="Bea";
const BNG_TXT={"bingo-cerrado":"La venta de cartones de esa partida ya se ha cerrado.","bingo-max":"Como mucho "+BNG.MAXC+" cartones por partida.","bingo-dia":"Ya has comprado "+BNG.DIA+" cartones hoy. ¡Vuelve mañana!",
  "bingo-falso":"Aún no tienes eso completo.","bingo-tarde":"¡Demasiado tarde! Hay que cantar en cuanto se completa.","bingo-ya":"Otro jugador lo completó antes que tú.","bingo-nada":"No hay premio que cobrar.",
  "bingo-pronto":"La partida aún no ha empezado.","bingo-sin-carton":"No tienes cartones en esa partida.","bingo-sala":"Esa sala no existe.","bingo-n":"Elige cuántos cartones quieres.","saldo":"No tienes tickets suficientes."};
function bngBolas(s,r,x){const R=v8Rng("bingo|"+s+"|"+r+"|"+((x||0)>>>0)),L=[];for(let i=0;i<BNG.POOL;i++)L.push(i);for(let i=BNG.POOL-1;i>0;i--){const j=Math.floor(R()*(i+1));[L[i],L[j]]=[L[j],L[i]]}return L}
const bngBT=(r,now)=>Math.floor((now-(r*BNG.PER+BNG.LOB))/BNG.CALL)+1;
const bngCant=(r,now)=>{const t=now-(r*BNG.PER+BNG.LOB);return t<0?0:Math.min(BNG.POOL,Math.floor(t/BNG.CALL)+1)};
const bngLeer=c=>{const o=[];for(let i=0;i<30;i+=2)o.push(parseInt(String(c).slice(i,i+2),36));return o};
function bngComp(c,pos){const v=bngLeer(c),f=k=>Math.max(...v.slice(k*5,k*5+5).map(x=>pos[x]));return{l:Math.min(f(0),f(1),f(2)),b:Math.max(...v.map(x=>pos[x]))}}
function bngBote(s,d){const S2=BNG_S[s],n=Math.max(0,(d&&d.n)|0),np=Math.max(0,(d&&d.np)|0),t=Math.max(Math.floor(.9*n*S2.p),np>=2?3*S2.p:0);
  const ib=Object.assign({},S2.b);if(np>=3)for(const k in S2.b3)ib[k]=(ib[k]|0)+S2.b3[k];return{l:Math.floor(t*.3),b:t-Math.floor(t*.3),il:S2.l,ib,np,n}}
const bngItTxt=it=>Object.keys(it||{}).map(k=>it[k]+" "+IN2(k)).join(" + ");
const bngNow=()=>cmuNow();
const bngId=(s,r)=>s+"_"+r;
// Pokémon del bombo de cada partida: 60 especies distintas, las mismas para todos
const BNG_PC={};
function bngPool(s,r){const k=bngId(s,r);if(BNG_PC[k])return BNG_PC[k];const L=pddPool().map(p=>p[0]).sort();const R=v8Rng("bingopool|"+k);
  for(let i=L.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[L[i],L[j]]=[L[j],L[i]]}const out=L.slice(0,BNG.POOL);if(out.length===BNG.POOL){const ks=Object.keys(BNG_PC);if(ks.length>12)delete BNG_PC[ks[0]];BNG_PC[k]=out}return out}
const BNG_PH=["Y el siguiente es… ¡{n}!","¡Sale {n}! ¿Quién lo tiene?","Del bombo sale… ¡{n}!","¡Atención, atención! ¡{n}!","¡{n}! ¡Márcalo si lo tienes!","¡Uy, qué bonito! ¡{n}!","¡Número {k}! ¡{n}!","¡Ojo, que viene {n}!","¡{n}! ¿Alguien cerca de la línea?","Ahora toca… ¡{n}!"];
// estado: partidas que se escuchan en directo, tus cartones, marcas y lo ya cantado/cobrado
const BG={sel:"",d:{},mine:{},un:{},mk:{},sang:{},pay:{},seen:{},busy:false,last:"",ann:{},sig:""};
function bngSt(){S.bgo=S.bgo&&typeof S.bgo==="object"?S.bgo:{};const o=S.bgo;if(!Array.isArray(o.my))o.my=[];if(o.auto==null)o.auto=1;if(o.voz==null)o.voz=1;if(!o.paid||typeof o.paid!=="object")o.paid={};
  const d=v8Day();if(!o.day||o.day.d!==d)o.day={d,n:0};if(!o.s||!BNG_S[o.s])o.s="b";return o}
const bngMyIds=()=>bngSt().my.map(x=>x.id);
function bngAddMy(s,r){const o=bngSt(),id=bngId(s,r);if(!o.my.some(x=>x.id===id))o.my.push({id,s,r});const R=Math.floor(bngNow()/BNG.PER);o.my=o.my.filter(x=>x.r>=R-30).slice(-20);
  Object.keys(o.paid).forEach(k=>{if(!o.my.some(x=>x.id===k))delete o.paid[k]})}
// fase de una partida: venta, juego (con la bola actual) o terminada
function bngPhase(s,r,now){const t=now-r*BNG.PER,d=BG.d[bngId(s,r)]||null;if(t<0)return{k:"pre",d};if(t<BNG.LOB)return{k:"lob",d,left:BNG.LOB-t};
  const cur=bngCant(r,now),bt=bngBT(r,now),closed=x=>x&&(bt>x.c+BNG.GR||now>=(r+1)*BNG.PER);
  if(!d||!(d.n>0))return{k:"vacia",d,cur};const over=closed(d.bn)||now>=(r+1)*BNG.PER;return{k:over?"fin":"juego",d,cur,bt,lnC:closed(d.ln),bnC:closed(d.bn)}}
// escuchar en directo las partidas que hacen falta (la de la sala que miras, la siguiente y las tuyas en juego)
function bngWatch(){const F=window.FB;if(!F||!F.bingoWatch||!v8Uid())return;const now=bngNow(),R=Math.floor(now/BNG.PER),o=bngSt(),need=new Set();
  if(nxOpen("bngP")){need.add(bngId(o.s,R));need.add(bngId(o.s,R+1))}
  o.my.forEach(x=>{if(x.r===R||x.r===R+1)need.add(x.id)});
  need.forEach(id=>{if(BG.un[id])return;BG.un[id]=F.bingoWatch(id,d=>{if(d===undefined)return;BG.d[id]=d;bngTick(true)});
    if(bngMyIds().includes(id)&&!BG.mine[id])F.bingoMine(id).then(p=>{if(p&&Array.isArray(p.c)){BG.mine[id]=p.c.slice();if(p.pl||p.pb){const v=(p.pl?1:0)|(p.pb?2:0);o.paid[id]=(o.paid[id]|0)|v}bngTick(true)}}).catch(()=>{})});
  Object.keys(BG.un).forEach(id=>{if(!need.has(id)){try{BG.un[id]()}catch(e){}delete BG.un[id]}})}
// acciones en el servidor
async function bngAct(ac,apply){if(typeof window.srvAccion!=="function"||!v8Uid()){toast("Inicia sesión con tu cuenta para jugar al Bingo.");return null}
  try{const r=await window.srvAccion(Object.assign({k:"bingo"},ac),srvJ,x=>{if(x&&x.bingo)apply(x.bingo)});if(!r||!r.ok){const m=(r&&BNG_TXT[r.why])||(r&&typeof srvErr==="function"&&srvErr(r))||"No se ha podido. Inténtalo en un momento.";if(m&&ac.op!=="cobrar")toast("⚠️ "+m)}return r}
  catch(e){toast("⚠️ No hay conexión con el servidor. Inténtalo en un momento.");return null}}
async function bngBuy(s,r,n){if(BG.busy)return;const o=bngSt(),S2=BNG_S[s],id=bngId(s,r),ya=(BG.mine[id]||[]).length;
  if(ya+n>BNG.MAXC){toast(BNG_TXT["bingo-max"]);return}if(o.day.n+n>BNG.DIA){toast(BNG_TXT["bingo-dia"]);return}if((S.t||0)<S2.p*n){toast("No tienes tickets suficientes: cada cartón cuesta "+fmt(S2.p)+" 🎟️.");return}
  BG.busy=true;bngUI(true);
  await bngAct({op:"comprar",s,r,n},x=>{S.t=(S.t||0)-(x.coste||0);bngAddMy(s,r);o.day.n+=n;BG.mine[id]=(BG.mine[id]||[]).concat(x.c||[]);save();render();snd("pop");
    toast("🎱 ¡"+n+" cartón"+(n>1?"es":"")+" para la partida #"+(r%1000)+" de la "+S2.n+"! Suerte.")});
  BG.busy=false;bngWatch();bngUI(true)}
async function bngSing(id,t){const x=bngSt().my.find(y=>y.id===id);if(!x)return;const k=id+t;if(BG.sang[k])return;BG.sang[k]=1;
  const r=await bngAct({op:"cantar",s:x.s,r:x.r,t},y=>{snd("win");toast(t==="l"?"🙋 ¡Has cantado LÍNEA! Esperando a que se cierre la jugada…":"🎉 ¡Has cantado BINGO! Esperando a que se cierre la jugada…")});
  if(!r||!r.ok){if(r&&(r.why==="bingo-falso"||r.why==="bingo-pronto"))delete BG.sang[k]}bngUI(true)}
async function bngPay(id){const o=bngSt(),x=o.my.find(y=>y.id===id);if(!x||BG.pay[id])return;BG.pay[id]=1;
  const r=await bngAct({op:"cobrar",s:x.s,r:x.r},y=>{o.paid[id]=(o.paid[id]|0)|(y.l?1:0)|(y.b?2:0);S.t=(S.t||0)+(y.t||0);S.bag=S.bag||{};Object.keys(y.it||{}).forEach(k=>{S.bag[k]=(S.bag[k]||0)+y.it[k]});
    if(y.mon&&PM[y.mon]){const lv=typeof clampL==="function"?clampL(Math.max(5,Math.min(typeof lvCap==="function"?lvCap():50,typeof leadLevel==="function"?leadLevel():5))):5;giveMon(y.mon,lv,!!y.sh)}
    save();render();snd("lvl");
    const tx=[y.t?fmt(y.t)+" 🎟️":"",bngItTxt(y.it),y.mon?(y.sh?"✨ ":"")+y.mon+(y.sh?" variocolor":""):""].filter(Boolean).join(" + ");toast("🏆 ¡Premio del Bingo"+(y.b?" (¡BINGO!)":" (línea)")+": "+tx+"!");
    if(y.b)diaryAdd("🎱","¡Bingo en la "+BNG_S[x.s].n+"! Premio: "+tx,y.mon||null,y.sh?1:0,"o");
    if(y.mon&&PM[y.mon])setTimeout(()=>bngMonShow(y.mon,!!y.sh),600);try{burst("🎉",{x:innerWidth/2,y:innerHeight/2},18,160,26)}catch(e){}});
  if(r&&!r.ok&&r.why==="bingo-nada"){const d=BG.d[id];if(d&&d.bn&&(d.bn.c+BNG.GR<bngBT(x.r,bngNow())))o.paid[id]=(o.paid[id]|0)|4}
  setTimeout(()=>{delete BG.pay[id]},8000);bngUI(true)}
// marcas de cada cartón: con «marcar solo», todo lo que ha salido; si no, lo que hayas tocado tú
function bngMarks(id,ci,called){const o=bngSt();if(o.auto)return called;BG.mk[id]=BG.mk[id]||{};const m=BG.mk[id][ci]||(BG.mk[id][ci]=new Set());return m}
function bngCardState(c,marked){const v=bngLeer(c),rows=[0,1,2].map(k=>v.slice(k*5,k*5+5).every(x=>marked.has(x)));return{v,rows,line:rows.some(x=>x),full:rows.every(x=>x)}}
// bucle: bolas nuevas, voz de la presentadora, cantar y cobrar solos, y repintar
function bngTick(force){if(typeof S==="undefined"||!S)return;const now=bngNow(),o=bngSt(),uid=v8Uid();
  o.my.forEach(x=>{const id=x.id,ph=bngPhase(x.s,x.r,now),d=ph.d;if(!d||!BG.mine[id]||!BG.mine[id].length)return;
    if(ph.k==="juego"||ph.k==="fin"){const ord=bngBolas(x.s,x.r,d.x),cur=ph.cur,called=new Set(ord.slice(0,cur)),pos={};ord.forEach((v,i)=>pos[v]=i+1);
      // cantar solo (o avisar) en cuanto se completa
      if(ph.k==="juego"&&o.auto){let bl=99,bb=99;BG.mine[id].forEach(c=>{const m=bngComp(c,pos);if(m.l<=cur)bl=Math.min(bl,m.l);if(m.b<=cur)bb=Math.min(bb,m.b)});
        if(bl<99&&ph.bt<=bl+BNG.GR&&!(d.ln&&d.ln.c<bl)&&!(d.ln&&(d.ln.w||[]).includes(uid))&&!ph.lnC)bngSing(id,"l");
        if(bb<99&&ph.bt<=bb+BNG.GR&&!(d.bn&&d.bn.c<bb)&&!(d.bn&&(d.bn.w||[]).includes(uid))&&!ph.bnC)bngSing(id,"b")}
      // cobrar cuando la jugada ya está cerrada
      const pd=o.paid[id]|0,wl=d.ln&&(d.ln.w||[]).includes(uid),wb=d.bn&&(d.bn.w||[]).includes(uid);
      if(!(pd&4)&&((ph.lnC&&wl&&!(pd&1))||(ph.bnC&&wb&&!(pd&2))))bngPay(id);
      // partida cerrada y nada más que cobrar: ya no hace falta mirarla al volver a entrar
      else if(!(pd&4)&&ph.k==="fin"&&ph.bnC&&!(wl&&!(pd&1))&&!(wb&&!(pd&2)))o.paid[id]=pd|4}});
  // anuncios de la partida que estás mirando
  const op=nxOpen("bngP");if(op){const R=Math.floor(now/BNG.PER),ph=bngPhase(o.s,R,now),id=bngId(o.s,R);
    if(ph.k==="juego"&&ph.cur){const k=id+"|"+ph.cur;if(BG.last!==k){const first=!BG.last||!BG.last.startsWith(id+"|");BG.last=k;if(!first)bngAnnounce(o.s,R,ph)}}
    if(ph.d&&ph.d.ln&&ph.lnC&&!BG.ann[id+"l"]){BG.ann[id+"l"]=1;bngSay("¡Tenemos LÍNEA! ¡Enhorabuena, "+(ph.d.ln.wn||[]).slice(0,3).join(", ")+"!")}
    if(ph.d&&ph.d.bn&&ph.bnC&&!BG.ann[id+"b"]){BG.ann[id+"b"]=1;bngSay("¡¡BINGO!! ¡"+(ph.d.bn.wn||[]).slice(0,3).join(", ")+" se lleva el gran premio!");snd("win")}}
  if(op)bngUI(force)}
function bngSay(t){const o=bngSt();BG.say=t;if(!o.voz||document.hidden||!O.sfx||!O.svol)return;try{const sy=window.speechSynthesis;if(!sy)return;sy.cancel();const u=new SpeechSynthesisUtterance(t.replace(/[¡!¿?…]/g," "));u.lang="es-ES";u.rate=1.05;u.volume=Math.min(1,O.svol*1.5);sy.speak(u)}catch(e){}}
function bngAnnounce(s,r,ph){const ord=bngBolas(s,r,ph.d.x),v=ord[ph.cur-1],pool=bngPool(s,r),n=pool[v]||"?",f=BNG_PH[Math.floor(v8Rng("bph|"+s+r+"|"+ph.cur)()*BNG_PH.length)];
  snd("pop");bngSay(f.replace("{n}",n).replace("{k}",v+1));BG.pop=Date.now()}
// ventana con el Pokémon sorpresa que te ha tocado
function bngMonShow(n,sh){const p=PM[n];if(!p)return;const old=$("bngMonM");if(old)old.remove();const m=document.createElement("div");m.id="bngMonM";m.className="bngmon";m.setAttribute("role","dialog");
  m.innerHTML='<div class="bngmonw'+(sh?' sh':'')+'"><small>🎱 Pokémon sorpresa del Bingo</small><div class="bngmonp">'+ico(p,110,false,sh)+'</div><b>'+(sh?'✨ ':'')+esc(n)+'</b><small>'+STAR[p[2]]+(sh?' · ¡VARIOCOLOR!':'')+'</small><button class="red">¡Genial!</button></div>';
  document.body.appendChild(m);m.querySelector("button").onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove()};if(sh)snd("capok")}
// (la animación del sello y de la última bola solo la primera vez que se pinta cada casilla; después, fija)
const BNG_ANI=new Set();function bngOnce(k){if(BNG_ANI.has(k))return false;BNG_ANI.add(k);if(BNG_ANI.size>3000)BNG_ANI.clear();return true}
const bngMS=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
function bngPrizeBox(s,d,title){const B=bngBote(s,d),S2=BNG_S[s];
  return '<div class="bngprize"><b>'+title+'</b><div class="bngpz"><div><span>🙋 Línea</span><b>'+fmt(B.l)+' 🎟️</b><small>+ '+bngItTxt(B.il)+'</small></div><div class="bngbig"><span>🎉 Bingo</span><b>'+fmt(B.b)+' 🎟️</b><small>+ '+bngItTxt(B.ib)+'</small><small class="bngpk">+ 🎁 Pokémon sorpresa (hasta ★★★ Épico, ¡puede ser variocolor!)</small></div></div>'+
    '<small class="bngpkp">🎁 Pokémon sorpresa: '+bngPkTxt(s)+'</small>'+
    '<small class="mut">🎟️ '+B.n+' cartón'+(B.n===1?'':'es')+' vendido'+(B.n===1?'':'s')+' · 👥 '+B.np+' jugador'+(B.np===1?'':'es')+' · El bote es el 90 % de lo vendido'+(B.np>=2?'':' (con 2 jugadores o más, mínimo '+fmt(3*S2.p)+' 🎟️)')+(B.np>=3?' · ¡Premio extra por ser 3 o más!':' · Con 3 jugadores o más: + '+bngItTxt(S2.b3))+'</small></div>'}
function bngBuyBox(s,r,now,lab){const o=bngSt(),S2=BNG_S[s],id=bngId(s,r),ya=(BG.mine[id]||[]).length,left=r*BNG.PER+BNG.LOB-now,maxN=Math.min(BNG.MAXC-ya,BNG.DIA-o.day.n);
  const btn=n=>{const ok=!BG.busy&&n<=maxN&&(S.t||0)>=S2.p*n;return '<button class="'+(ok?'red':'alt')+'" data-bngb="'+s+'|'+r+'|'+n+'"'+(ok?'':' disabled')+'>'+n+' cartón'+(n>1?'es':'')+'<small>'+fmt(S2.p*n)+' 🎟️</small></button>'};
  return '<div class="bngbuy"><b>'+lab+'</b><small class="mut">Se cierra la venta en <b class="bngcd" data-cd="'+(r*BNG.PER+BNG.LOB)+'">'+bngMS(left)+'</b> · Tienes '+ya+'/'+BNG.MAXC+' cartones · Hoy: '+o.day.n+'/'+BNG.DIA+'</small>'+
    (maxN>0?'<div class="bngbtns">'+[1,2,4].filter(n=>n<=BNG.MAXC).map(btn).join("")+'</div>':'<small>'+(ya>=BNG.MAXC?'✅ Ya tienes todos los cartones de esta partida.':'Has llegado al máximo de cartones de hoy.')+'</small>')+'</div>'}
function bngCards(id,s,r,ph){const L=BG.mine[id]||[];if(!L.length)return "";const pool=bngPool(s,r),d=ph.d||{},uid=v8Uid();
  const ord=d.x!=null&&(ph.k==="juego"||ph.k==="fin")?bngBolas(s,r,d.x):[],called=new Set(ord.slice(0,ph.cur||0)),last=ph.cur?ord[ph.cur-1]:-1;
  let anyL=false,anyB=false;
  const html=L.map((c,ci)=>{const mk=bngMarks(id,ci,called),st=bngCardState(c,new Set([...mk].filter(x=>called.has(x))));if(st.line)anyL=true;if(st.full)anyB=true;
    return '<div class="bngcard'+(st.full?' full':'')+'"><small>Cartón '+(ci+1)+'</small><div class="bngcg">'+st.v.map((v,i)=>{const on=mk.has(v)&&called.has(v),hint=!on&&called.has(v),row=st.rows[Math.floor(i/5)];const p=PM[pool[v]];
      return '<button class="bngcl'+(on?' on':'')+(hint?' hint':'')+(row?' row':'')+(v===last&&bngOnce("l|"+id+"|"+ci+"|"+v)?' last':'')+'" data-bngm="'+id+'|'+ci+'|'+v+'" title="'+esc(pool[v]||"")+'">'+(p?ico(p,30):'')+'<i>'+(v+1)+'</i>'+(on?'<em'+(bngOnce("s|"+id+"|"+ci+"|"+v)?' class="nw"':'')+'></em>':'')+'</button>'}).join("")+'</div></div>'}).join("");
  const o=bngSt(),lnW=d.ln&&(d.ln.w||[]).includes(uid),bnW=d.bn&&(d.bn.w||[]).includes(uid);
  const sing=ph.k==="juego"?'<div class="bngsing"><button class="'+(anyL&&!ph.lnC&&!lnW?'red pulse':'alt')+'" data-bngs="'+id+'|l"'+(anyL&&!ph.lnC&&!lnW&&!BG.sang[id+"l"]?'':' disabled')+'>🙋 ¡LÍNEA!</button><button class="'+(anyB&&!ph.bnC&&!bnW?'red pulse':'alt')+'" data-bngs="'+id+'|b"'+(anyB&&!ph.bnC&&!bnW&&!BG.sang[id+"b"]?'':' disabled')+'>🎉 ¡BINGO!</button>'+(o.auto?'<small class="mut">🤖 Marcas y cantas solo</small>':'<small class="mut">Toca los Pokémon que salgan y canta en cuanto completes (¡tienes '+BNG.GR+' bolas de margen!)</small>')+'</div>':'';
  return '<h3>🎫 Tus cartones</h3>'+sing+'<div class="bngcards">'+html+'</div>'}
function bngBoard(s,r,ph){const pool=bngPool(s,r),d=ph.d||{},ord=d.x!=null?bngBolas(s,r,d.x):[],called=new Set(ord.slice(0,ph.cur||0));
  return '<details class="bngbd"'+(BG.bd?' open':'')+'><summary>📋 Tablero ('+(ph.cur||0)+'/'+BNG.POOL+' bolas)</summary><div class="bngboard">'+pool.map((n,i)=>'<span class="'+(called.has(i)?'on':'')+'" title="'+esc(n)+'">'+(i+1)+'</span>').join("")+'</div></details>'}
function bngUI(force){const b=$("bngPB");if(!b)return;if(!v8Uid()){b.innerHTML='<p class="mut">Inicia sesión con tu cuenta para jugar al Bingo online con otros entrenadores.</p>';return}
  const o=bngSt(),s=o.s,now=bngNow(),R=Math.floor(now/BNG.PER),id=bngId(s,R),ph=bngPhase(s,R,now),d=ph.d||{},pool=bngPool(s,R),S2=BNG_S[s];
  if(pool.length<BNG.POOL){b.innerHTML='<p class="mut">⏳ Cargando…</p>';return}
  // solo se repinta entero cuando cambia algo; la cuenta atrás se actualiza aparte
  const sig=[s,R,ph.k,ph.cur|0,d.n|0,d.np|0,d.x|0,JSON.stringify(d.ln||0),JSON.stringify(d.bn||0),(BG.mine[id]||[]).length,(BG.mine[bngId(s,R+1)]||[]).length,BG.busy,o.auto,o.voz,o.day.n,!!BG.d[bngId(s,R+1)],JSON.stringify([...Object.keys(BG.sang)]),Object.keys(BG.mk[id]||{}).map(k=>BG.mk[id][k].size).join(),o.paid[id]|0,Math.floor((S.t||0)/S2.p)].join("~");
  if(!force&&sig===BG.sig){b.querySelectorAll(".bngcd").forEach(e=>{e.textContent=bngMS(+e.dataset.cd-now)});return}
  BG.sig=sig;
  const ord=d.x!=null&&ph.cur?bngBolas(s,R,d.x):[],cur=ph.cur|0,lastV=cur?ord[cur-1]:-1,lastN=lastV>=0?pool[lastV]:"",prevL=ord.slice(Math.max(0,cur-6),Math.max(0,cur-1)).reverse();
  const tabs='<div class="bngtabs">'+Object.keys(BNG_S).map(k=>'<button class="'+(k===s?'on':'')+'" data-bngsala="'+k+'"><b>'+BNG_S[k].ic+' '+BNG_S[k].n+'</b><small>'+fmt(BNG_S[k].p)+' 🎟️/cartón</small></button>').join("")+'</div>';
  let stage,say;
  if(ph.k==="lob"){say="¡Bienvenidos a la "+S2.n+"! Comprad vuestros cartones: la partida empieza enseguida.";stage='<div class="bngball wait">🎱</div><div class="bngst"><b>La partida empieza en <span class="bngcd" data-cd="'+(R*BNG.PER+BNG.LOB)+'">'+bngMS(ph.left)+'</span></b><small>'+((d.np|0)?(d.np+' jugador'+(d.np===1?'':'es')+' en la sala'):'Aún no ha entrado nadie. ¡Sé el primero!')+'</small></div>'}
  else if(ph.k==="vacia"){say="Esta partida no tiene jugadores… ¡Comprad cartones para la siguiente!";stage='<div class="bngball wait">💤</div><div class="bngst"><b>Partida sin jugadores</b><small>La siguiente empieza en <span class="bngcd" data-cd="'+((R+1)*BNG.PER+BNG.LOB)+'">'+bngMS((R+1)*BNG.PER+BNG.LOB-now)+'</span></small></div>'}
  else{const p=PM[lastN];say=ph.k==="fin"?(d.bn?"¡Se acabó! El bingo ha sido para "+(d.bn.wn||[]).slice(0,3).join(", ")+". ¡Hasta la próxima!":"¡Se acabó la partida!"):(BG.say||"¡Vamos allá!");
    stage='<div class="bngball'+(Date.now()-(BG.pop||0)<900?' bnew':'')+'">'+(p?ico(p,72):'🎱')+'<i>'+(lastV+1)+'</i></div><div class="bngst"><b>'+(ph.k==="fin"?'🏁 Partida terminada':esc(lastN))+'</b><small>Bola '+cur+' de '+BNG.POOL+'</small><div class="bngprev">'+prevL.map(v=>{const q=PM[pool[v]];return '<span title="'+esc(pool[v])+'">'+(q?ico(q,24):'')+'<i>'+(v+1)+'</i></span>'}).join("")+'</div></div>'}
  const host='<div class="bnghost"><div class="bngav">👩‍🎤</div><div class="bngsay"><b>'+BNG_HOST+', la presentadora</b><p>'+esc(say)+'</p></div></div>';
  const res=(x,lab)=>x?'<div class="bngwin"><b>'+lab+'</b> '+(x.wn||[]).slice(0,6).map(n=>esc(n)).join(", ")+((x.w||[]).length>6?' y '+((x.w||[]).length-6)+' más':'')+' <small class="mut">(bola '+x.c+')</small>'+((x.w||[]).includes(v8Uid())?' <b class="me">¡Eres tú!</b>':'')+'</div>':'';
  const results=(ph.k==="juego"||ph.k==="fin")?res(d.ln,ph.lnC?"🙋 Línea:":"🙋 Cantan línea:")+res(d.bn,ph.bnC?"🎉 Bingo:":"🎉 Cantan bingo:"):"";
  const nextBox=ph.k==="lob"?bngBuyBox(s,R,now,"🎫 Compra tus cartones para esta partida"):bngBuyBox(s,R+1,now,"🎫 Compra cartones para la próxima partida (empieza en "+bngMS((R+1)*BNG.PER+BNG.LOB-now)+")");
  const nextPz=ph.k==="lob"?bngPrizeBox(s,d,"🏆 Premios de esta partida"):bngPrizeBox(s,BG.d[bngId(s,R+1)],"🏆 Premios de la próxima partida")+(ph.k!=="vacia"?bngPrizeBox(s,d,"🎱 En juego ahora"):"");
  const players=(d.nk||[]).length?'<div class="bngpl"><b>👥 En la sala:</b> '+(d.nk||[]).slice(-30).map(n=>'<span>'+esc(n)+'</span>').join("")+'</div>':'';
  const nextMine=ph.k!=="lob"&&(BG.mine[bngId(s,R+1)]||[]).length?'<small class="mut">✅ Tienes '+BG.mine[bngId(s,R+1)].length+' cartón'+(BG.mine[bngId(s,R+1)].length>1?'es':'')+' para la próxima partida.</small>':'';
  b.innerHTML=tabs+'<div class="bngstage">'+host+'<div class="bngnow">'+stage+'</div>'+results+'</div>'+
    ((ph.k==="lob"||ph.k==="juego"||ph.k==="fin")?bngCards(id,s,R,ph):'')+
    '<div class="bngside">'+nextPz+nextBox+nextMine+'</div>'+players+((ph.k==="juego"||ph.k==="fin")?bngBoard(s,R,ph):'')+
    '<div class="bngopts"><label><input type="checkbox" id="bngAuto"'+(o.auto?' checked':'')+'> 🤖 Marcar y cantar solo</label><label><input type="checkbox" id="bngVoz"'+(o.voz?' checked':'')+'> 🔊 Voz de la presentadora</label></div>'+
    '<details class="bnghow"'+(BG.how?' open':'')+'><summary>❓ Cómo se juega</summary><p>Cada 6 minutos empieza una partida en cada sala. Durante el minuto y medio antes de empezar puedes comprar hasta '+BNG.MAXC+' cartones (y hasta '+BNG.DIA+' al día). Después, '+BNG_HOST+' va sacando Pokémon del bombo, uno cada pocos segundos.</p><p>Cada cartón tiene 15 Pokémon en 3 filas. Si completas una fila, canta <b>¡LÍNEA!</b>; si completas el cartón entero, canta <b>¡BINGO!</b>. ¡Hay que cantar a tiempo! Si varios lo completáis con la misma bola, os repartís el premio.</p><p>El bote es el 90 % de lo que se vende: un 30 % para la línea y un 70 % para el bingo, y crece con cada cartón. ¡Además hay objetos de premio, y quien canta bingo se lleva un Pokémon sorpresa al azar (hasta Épico) que puede salir variocolor!</p></details>'}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#bngPB button");if(!b||b.disabled)return;const o=bngSt();
  if(b.dataset.bngsala){o.s=b.dataset.bngsala;BG.sig="";BG.say="";save();snd("ui");bngWatch();bngUI(true);return}
  if(b.dataset.bngb){const[s,r,n]=b.dataset.bngb.split("|");bngBuy(s,+r,+n);return}
  if(b.dataset.bngs){const[id,t]=b.dataset.bngs.split("|");bngSing(id,t);return}
  if(b.dataset.bngm){if(o.auto){toast("🤖 Tienes activado «Marcar y cantar solo».");return}const[id,ci,v]=b.dataset.bngm.split("|"),x=o.my.find(y=>y.id===id);if(!x)return;const now=bngNow(),ph=bngPhase(x.s,x.r,now);
    const ord=ph.d&&ph.cur?bngBolas(x.s,x.r,ph.d.x).slice(0,ph.cur):[];if(!ord.includes(+v)){toast("Ese Pokémon aún no ha salido.");return}
    const m=bngMarks(id,+ci,null);if(m.has(+v))m.delete(+v);else{m.add(+v);snd("click")}bngUI(true)}});
document.addEventListener("toggle",e=>{const el=e.target;if(!el.classList)return;if(el.classList.contains("bngbd"))BG.bd=el.open;else if(el.classList.contains("bnghow"))BG.how=el.open},true);
document.addEventListener("change",e=>{const el=e.target;if(el.id!=="bngAuto"&&el.id!=="bngVoz")return;const o=bngSt();if(el.id==="bngAuto")o.auto=el.checked?1:0;else{o.voz=el.checked?1:0;if(!o.voz)try{speechSynthesis.cancel()}catch(x){}}save();bngUI(true)});
v8Tab("onl","bngP","🎱 Bingo","🎱 Bingo Pokémon online","Compra cartones con tickets y juega con otros entrenadores en directo: la presentadora va sacando Pokémon y tú los marcas. ¡Canta línea o bingo para llevarte el bote!",()=>{BG.sig="";bngWatch();bngUI(true)},0);
// el reloj del bingo (también con el panel cerrado si tienes cartones en juego)
setInterval(()=>{try{if(!v8Uid())return;bngWatch();bngTick(false)}catch(e){}},500);
// al volver a entrar: cobrar premios de partidas que se quedaron a medias
setTimeout(async()=>{try{const F=window.FB;if(!F||!F.bingoGet||!v8Uid())return;const o=bngSt(),R=Math.floor(bngNow()/BNG.PER),uid=v8Uid();
  for(const x of o.my.filter(y=>y.r<R&&!((o.paid[y.id]|0)&4))){const d=await F.bingoGet(x.id).catch(()=>null);if(!d)continue;const pd=o.paid[x.id]|0;
    if((d.ln&&(d.ln.w||[]).includes(uid)&&!(pd&1))||(d.bn&&(d.bn.w||[]).includes(uid)&&!(pd&2))){BG.d[x.id]=d;await bngPay(x.id)}else o.paid[x.id]=pd|4}}catch(e){}},20000);
// aviso al empezar una partida en la que tienes cartones, y globo en el menú
{let bngLastStart="";setInterval(()=>{try{const o=bngSt(),now=bngNow(),R=Math.floor(now/BNG.PER),t=now-R*BNG.PER;const x=o.my.find(y=>y.r===R);
  if(x&&t>=BNG.LOB&&t<BNG.LOB+8000&&bngLastStart!==x.id&&!nxOpen("bngP")){bngLastStart=x.id;toast("🎱 ¡Empieza tu partida de Bingo en la "+BNG_S[x.s].n+"! Ve a Online › 🎱 Bingo.")}}catch(e){}},2000)}
{const _hb=hubBadges;hubBadges=function(){const o=_hb();try{const b=bngSt(),R=Math.floor(bngNow()/BNG.PER);if(b.my.some(y=>y.r===R&&(BG.mine[y.id]||[]).length))o.onl=(o.onl|0)+1}catch(e){}return o}}

// ================= ESTACIONES DEL AÑO (8.3) =================
// El pueblo cambia con la estación (p_land3d.js: hierba, árboles, flores, hojas que caen, luciérnagas…) y cada estación
// hace más fáciles de encontrar algunos tipos de Pokémon en la Exploración.
const SEA_I={pri:{n:"Primavera",ic:"🌸",ty:["grass","fairy","bug"],txt:"¡Ha llegado la primavera! Flores en el prado y pétalos de cerezo por el aire."},
  ver:{n:"Verano",ic:"☀️",ty:["water","fire","electric"],txt:"¡Ha llegado el verano! Sol fuerte de día y luciérnagas por la noche."},
  oto:{n:"Otoño",ic:"🍂",ty:["ghost","dark","ground"],txt:"¡Ha llegado el otoño! Árboles de colores y hojas secas volando."},
  inv:{n:"Invierno",ic:"❄️",ty:["ice","steel","psychic"],txt:"¡Ha llegado el invierno! Escarcha en el prado (y en diciembre, nieve)."}};
const seaNow=()=>{try{return(window.WXENV&&window.WXENV.sea)||rwSeason()}catch(e){return "pri"}};
const SEA_TYN={grass:"Planta",fairy:"Hada",bug:"Bicho",water:"Agua",fire:"Fuego",electric:"Eléctrico",ghost:"Fantasma",dark:"Siniestro",ground:"Tierra",ice:"Hielo",steel:"Acero",psychic:"Psíquico"};
const seaTyTxt=k=>SEA_I[k].ty.map(t=>SEA_TYN[t]||t).join(", ");
// Exploración: con un 30 % de probabilidad, el Pokémon salvaje es de un tipo de la estación (misma rareza)
{const _w=wildPick;wildPick=function(r){const p=_w.apply(this,arguments);try{if(!(typeof XGSW!=="undefined"&&XGSW)||!EX.M||EX.M.base==="c")return p;const si=SEA_I[seaNow()];
  if(si&&p&&!si.ty.includes(p[1])&&Math.random()<.3){const pool=P.filter(q=>q&&q[2]===r&&si.ty.includes(q[1])&&v8Base(q));if(pool.length)return pool[Math.floor(Math.random()*pool.length)]}}catch(e){}return p}}
// aviso al empezar cada estación (una vez), y la estación en el diario
setInterval(()=>{try{if(typeof S==="undefined"||!S||!S.owned)return;const k=seaNow(),y=v8Mad().y,id=k+(k==="inv"&&v8Mad().m<=2?y-1:y);if(S.seaSeen===id)return;const first=!S.seaSeen;S.seaSeen=id;save();
  const si=SEA_I[k];toast(si.ic+" "+si.txt+" En la Exploración salen más Pokémon de tipo "+seaTyTxt(k)+".");if(!first)diaryAdd(si.ic,"Empieza "+(k==="pri"?"la ":"el ")+si.n.toLowerCase()+" en el pueblo",null,0,"o")}catch(e){}},5000);
// la estación junto al clima en Ajustes
setInterval(()=>{try{const l=$("wxOpt");if(!l)return;let e=$("seaTxt");const k=seaNow(),si=SEA_I[k],h=si.ic+" Estación: <b>"+si.n+"</b> · en la Exploración salen más Pokémon de tipo "+seaTyTxt(k);
  if(!e){e=document.createElement("small");e.id="seaTxt";e.className="mut";e.style.display="block";l.after(e)}if(e._h!==h){e._h=h;e.innerHTML=h}}catch(e){}},3000);

// ================= POKÉDEX: CÓMO CONSEGUIR LOS QUE FALTAN (8.3) =================
// Las casillas de los que te faltan muestran su silueta y su nombre; al pasar el ratón, una pista de dónde conseguirlo.
let DEXPRE=null;
function dexHow(p){try{const n=p[0],r=p[2];
  if(/^Mega-|Gigamax/.test(n))return "sale en el gacha, en las tiradas "+(r==="L"?"de legendario (★★★★★":"épicas (★★★")+"; las súper tiradas dan más). "+(/^Mega-/.test(n)&&tlrIsMega(p)?"También puedes fabricarla en el Taller de repetidos (si tienes a "+megaBase(n)+"). ":"")+"Después, pon a "+megaBase(n)+" en tu equipo y "+(/Gigamax/.test(n)?"pulsa «🔴 Gigamax»":"pulsa «🧬 Megaevolucionar»")+" en combate";
  if(r==="M")return "Pokémon singular: búscalo en eventos y en el gacha";
  if(!DEXPRE){DEXPRE={};try{P.forEach(q=>EVO(q[0]).forEach(e=>{if(e&&e[0]&&!DEXPRE[e[0]])DEXPRE[e[0]]=q[0]}))}catch(e){}}
  const pre=DEXPRE[n],ev=pre?" · o haz evolucionar a "+pre:"";const tl=typeof TLR_COST!=="undefined"&&TLR_COST[r]&&v8Base(p)?" · o fabrícalo en el Taller de repetidos":"";
  return (r==="L"?"legendario: sale en el gacha":"sale en el gacha y en la Exploración")+ev+tl}catch(e){return ""}}
