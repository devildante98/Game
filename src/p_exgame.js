// =====================================================================================
// EXPLORACIÓN COMO MODO APARTE: su propio equipo, sus Pokémon, sus niveles y su mochila.
// Durante los combates de Exploración el juego trabaja con estos datos; al terminar vuelve a los tuyos.
// Al guardar siempre se guardan las dos partidas por separado.
// =====================================================================================
const XGK=["owned","lv","hp","pp","ppu","mv","ml","nat","natAlt","held","abil","bld","shiny","when","balls","mote","fav","reg","team","sets","bag","med"];
function xgData(){if(!S.xg||typeof S.xg!=="object")S.xg={};const X=S.xg;
  XGK.forEach(k=>{if(X[k]==null)X[k]=k==="team"?["","","","","",""]:k==="sets"?[]:k==="med"?{0:1,1:1,2:1,3:1,4:1,5:1,6:1,7:1}:{}});return X}
var XGSW=null;
function xgIn(){if(XGSW)return;const X=xgData();XGSW={};XGK.forEach(k=>{XGSW[k]=S[k];S[k]=X[k]})}
function xgOut(){if(!XGSW)return;const X=S.xg;XGK.forEach(k=>{X[k]=S[k];S[k]=XGSW[k]});XGSW=null}
function xgRun(fn){const was=!!XGSW;xgIn();try{return fn()}finally{if(!was)xgOut()}}
// al guardar (en el navegador o en la nube) siempre se guarda tu partida normal, con la de Exploración dentro de S.xg
{const _js=JSON.stringify;JSON.stringify=function(v){if(v===S&&XGSW){xgOut();try{return _js.apply(this,arguments)}finally{xgIn()}}return _js.apply(this,arguments)}}
// la clasificación y los datos públicos nunca usan los Pokémon de Exploración
{const _rd=window.rankData;if(_rd)window.rankData=function(){if(XGSW){xgOut();try{return _rd.apply(this,arguments)}finally{xgIn()}}return _rd.apply(this,arguments)}}
// el combate de Exploración usa los datos de Exploración y los devuelve al terminar
{const _b=exBattle;exBattle=function(){xgIn();return _b.apply(this,arguments)}}
setInterval(()=>{if(XGSW&&!fcd){xgOut();try{render();updTeam()}catch(e){}}},250);
{const _t=exTeamOk;exTeamOk=function(){return xgRun(()=>_t.apply(this,arguments))}}
{const _h=stHeal;stHeal=function(){return xgRun(()=>_h.apply(this,arguments))}}
{const _ta=stTeamAdd;stTeamAdd=function(n){return xgRun(()=>_ta(n))}}
function xgGive(n,lv){xgRun(()=>{giveMon(n,lv);stTeamAdd(n);save()})}
const xgTeam=()=>xgRun(()=>(S.team||[]).filter(n=>n&&S.owned[n]));
// premios de la historia: los tickets son de tu partida normal; los objetos van a la mochila de Exploración
sGive=function(r){if(r.t)grant({t:r.t});if(r.it&&Object.keys(r.it).length)xgRun(()=>{grant({it:r.it})});save();try{render()}catch(e){}snd("lvl");return rwTxt(r)};
// objetos del suelo → mochila de Exploración
{const _i=exInteract;exInteract=function(){if(!EX.cut&&!EX.dlg&&!EX.mv&&!EX.trans){const[dx,dy]=EXDIR[EX.f];if(exAt(EX.x+dx,EX.y+dy)==="I")return xgRun(()=>_i.apply(this,arguments))}return _i.apply(this,arguments)}}
// el compañero que te sigue es el primero de tu equipo de Exploración
exFollower=async function(){const b=xgTeam()[0];if(!b){EX.fol=null;return}if(EX.fol&&EX.fol.n===b)return;EX.fol={n:b,d:null};
  const sh=xgRun(()=>!!(S.shiny&&S.shiny[b]>0)),d=typeof pmdLoad==="function"?await pmdLoad(b,sh):null;
  if(EX.fol&&EX.fol.n===b){EX.fol.d=d;if(d){const img=new Image();img.src=d.Walk.url;EX.fol.img=img}else{const i=new Image();i.src=SPRU+(window._spr&&window._spr[b])+".png";EX.fol.st=i}}};
setInterval(()=>{if(EX.on&&!EX.title){const b=xgTeam()[0];if((EX.fol&&EX.fol.n)!==b)exFollower()}},2000);
// ---------- niveles fijos, como en los juegos ----------
// nivel base de los rivales de la historia según el punto de la historia
const STLV={1:5,2:6,3:8,4:13,5:18,6:24,7:30,8:31,9:40,10:33,11:34,12:36,13:38,14:42,15:43,16:44,17:46,18:48,19:52,20:53,21:54,22:56,23:62,24:66};
const stLvBase=()=>STLV[stSt().s]||Math.max(5,(stSt().s|0)*3);
const ROLE=nm=>/^Recluta/.test(nm)?0:/^Dani/.test(nm)?(stSt().s<=1?0:2):/^Comandante/.test(nm)?3:/^(Líder|Doctor)/.test(nm)?5:1;
sLv=function(b){return stLvBase()+(b|0)};
// nivel de las zonas: entrenadores de ruta y Pokémon salvajes
const XGZ={ruta:[2,5,4],bosque:[4,8,7],cueva:[11,15,13],playa:[15,19,18],cima:[24,28,26],ruta2:[32,36,35],glaciar:[36,40,39],pico_e:[40,43,42],ruta3:[44,48,46],crater:[48,52,50],cumbre:[51,54,53],ruta4:[54,58,56],torre:[56,58,58]};
exTrainerBattle=function(n){if(!exTeamOk()){exSay(["Tus Pokémon están debilitados. ¡Cúralos en un Centro Pokémon!"]);return}
  const z=XGZ[EX.map]||[5,8,6],lv=z[2];
  const team=n.t.filter(x=>PM[x]).map((x,i)=>mkEnemy(stageFor(PM[x],clampL(lv+i))||PM[x],clampL(lv+i)));
  EX.trans={t:0,d:1300,k:"trainer",done:()=>exBattle({eteam:team,trainer:n.n,tsrc:{k:exTrKey(n.n),n:n.n}},n)}};
exEncounter=function(){if(!exTeamOk()){exSay(["¡Algo se mueve en la hierba!","…pero tus Pokémon están demasiado cansados para luchar. Cúralos en un Centro Pokémon."]);return}
  const z=XGZ[EX.map]||[3,6],x=Math.random()*100,r=x<1.5?"E":x<22?"R":"C",z0=S.zone;S.zone=EX.M.z||z0;let op;xgRun(()=>{op=wildPick(r)});S.zone=z0;
  const lv=clampL(z[0]+Math.floor(Math.random()*(z[1]-z[0]+1))),m=mkEnemy(stageFor(op,lv)||op,lv);if(Math.random()<SHINY_W)m.sh=1;
  EX.keys={};EX.kst=[];snd("wild");EX.trans={t:0,d:1300,k:"wild",done:()=>exBattle({eteam:[m],wild:1})}};
// ---------- ya no hacen falta medallas del juego base: avanzas con la historia ----------
for(const k in EXM){const M=EXM[k];for(const c in (M.w||{}))delete M.w[c].med}
REG.forEach(r=>r.need=0);
if(EXM.ruta&&EXM.ruta.sg)EXM.ruta.sg["15,3"]="CUEVA ROCA\nCuevas profundas con Pokémon de roca. ¡Cuidado, son fuertes!";
if(EXM.pueblo&&EXM.pueblo.sg)EXM.pueblo.sg["11,8"]="↑ CIMA AURORA\nSolo los entrenadores más valientes suben a la cima.";
Object.assign(STO_OBJ,{4:[3,"Persigue al Equipo Ocaso hasta la Cueva Roca (Ruta 1 → norte)"],5:[4,"Detén a Noctis en la Playa Coral (Ruta 1 → sur)"],6:[5,"Sube a la Cima Aurora (Pueblo Brisa → norte)"],
  10:[7,"Viaja a la región de Escarcha: habla con el marinero del muelle de la Playa Coral"],15:[11,"Viaja a la región de Brasa: habla con el marinero del muelle de Puerto Escarcha"],20:[15,"Viaja a la región de Tormenta: habla con el marinero del muelle de Puerto Brasa"]});
// ---------- partidas que ya habían empezado la historia: reciben su compañero y sus legendarios ----------
function xgMigrate(){const X=xgData(),t=stSt();if(X.mig)return;X.mig=1;const s=t.s|0;if(s<2)return;
  const lv=STLV[s]||10,st=t.f&&t.f.st||"Charmander";xgGive(st,lv);
  [["Latias",8,35],["Articuno",15,48],["Moltres",20,58],["Zapdos",24,68]].forEach(L=>{if(s>=L[1])xgGive(L[0],L[2])});
  xgRun(()=>{S.bag.pb=(S.bag.pb||0)+10;S.bag.pot=(S.bag.pot||0)+5});save()}
{const _g=exGo;exGo=function(){try{xgMigrate()}catch(e){console.error(e)}return _g.apply(this,arguments)}}
// ---------- Centros Pokémon de Exploración: curan gratis y tienen tienda ----------
const XGSHOP=[["pb",5,2500,"Poké Ball ×5"],["sb",5,7500,"Super Ball ×5"],["ub",5,20000,"Ultra Ball ×5"],["pot",3,4500,"Poción ×3"],["spot",3,12000,"Superpoción ×3"],["rev",1,8000,"Revivir ×1"]];
STX.enf=()=>stRun(async()=>{await sSay(S_("Enfermera","¡Hola! Te damos la bienvenida al "+(EX.M&&EX.M.n&&EX.M.n!=="Centro Pokémon"?EX.M.n:"Centro Pokémon de Pueblo Brisa")+"."));
  for(;;){const i=await sChoice("¿En qué podemos ayudarte?",[{t:"Curar a mis Pokémon",s:"Gratis"},{t:"Comprar objetos",s:"Con tickets"},{t:"Nada, gracias"}]);
    if(i===0){await sSay(S_("Enfermera","¡Muy bien! Deja tus Poké Balls aquí un momento…"));snd("heal");try{healJingle()}catch(e){}await sFade("fade",350);stHeal();await sW(900);await sFade("fadein",450);
      await sSay(S_("Enfermera","¡Tus Pokémon están totalmente recuperados!"));continue}
    if(i===1){const j=await sChoice("Tienes "+fmt(S.t)+" 🎟️. ¿Qué quieres comprar?",XGSHOP.map(o=>({t:o[3],s:fmt(o[2])+" 🎟️"})).concat([{t:"Volver"}]));const o=XGSHOP[j];if(!o)continue;
      if(S.t<o[2]){await sSay(S_("Enfermera","Lo siento, no tienes tickets suficientes."));continue}
      S.t-=o[2];xgRun(()=>{S.bag[o[0]]=(S.bag[o[0]]||0)+o[1]});save();snd("capok");await sSay(["¡Has comprado "+o[3]+"! Lo guardas en la mochila de Exploración."]);continue}
    await sSay(S_("Enfermera","¡Esperamos verte pronto!"));return}});
// mamá cura gratis siempre
STX.mama=()=>stRun(async()=>{const s=stSt().s;
  const ln=s<2?["La Profesora Vega te espera en su laboratorio. ¡No la hagas esperar!"]:s<6?["¿Qué tal el viaje? Dicen que hay gente muy rara con capas moradas por las rutas… ¡Ten cuidado!"]:s<9?["¿Has visto esas luces sobre la Cima Aurora? Toda la región habla de ello…"]:["¡Estoy muy orgullosa de ti! Has salvado a toda la región."];
  await sSay(S_("Mamá",...ln));if(!xgTeam().length)return;
  await sSay(S_("Mamá","¡Tienes cara de cansancio! Descansa un poco."));await sFade("fade",400);stHeal();await sW(500);await sFade("fadein",500);await sSay(["¡Tus Pokémon se han recuperado por completo!"])});
// ---------- botón «Equipo» dentro de Exploración ----------
function xgPanel(){const box=$("exTeam");if(!box)return;const d=xgRun(()=>{const own=Object.keys(S.owned).filter(n=>S.owned[n]>0&&PM[n]),tm=(S.team||[]).filter(n=>n&&S.owned[n]);
    const card=(n,inT)=>{const l=lvd(n).l,mx=stH(PM[n],l),hp=S.hp[n]===undefined?mx:Math.min(mx,S.hp[n]),f=hp/mx;return '<button type="button" class="xgc'+(inT?" on":"")+'" data-xg="'+esc(n)+'">'+ico(PM[n],48,false,!!(S.shiny&&S.shiny[n]>0))+'<b>'+esc(typeof nk==="function"?nk(n):n)+'</b><small>Nv '+l+'</small><i><u style="width:'+Math.round(f*100)+'%;background:'+(f>.5?"#3ecf8e":f>.2?"#ffd35c":"#e63950")+'"></u></i></button>'};
    const bag=Object.keys(S.bag||{}).filter(k=>S.bag[k]>0);
    return '<div class="xgh"><b>🎒 Tu equipo de Exploración</b><button type="button" class="alt" id="xgX">Cerrar</button></div>'+
      (tm.length?'<div class="xgl">'+tm.map(n=>card(n,1)).join("")+'</div>':'<p class="mut">Todavía no tienes Pokémon de Exploración. ¡La Profesora Vega te dará uno en su laboratorio!</p>')+
      (own.length>tm.length?'<b class="xgs">📦 Caja ('+(own.length-tm.length)+')</b><small class="mut">Toca un Pokémon para meterlo o sacarlo del equipo (máximo 6).</small><div class="xgl">'+own.filter(n=>!tm.includes(n)).map(n=>card(n,0)).join("")+'</div>':'')+
      '<b class="xgs">🎒 Mochila</b><div class="xgb">'+(bag.length?bag.map(k=>'<span>'+(typeof itemIco==="function"?itemIco(k,22):"")+esc(IN(k))+' <b>×'+S.bag[k]+'</b></span>').join(""):'<small class="mut">Vacía. Compra objetos en los Centros Pokémon o búscalos por las rutas.</small>')+'</div>'+
      '<small class="mut">Los Pokémon, la mochila y los niveles de Exploración son independientes de tu colección del juego. Lo que captures aquí se queda aquí.</small>'});
  box.innerHTML=d;box.hidden=false;$("xgX").onclick=()=>{box.hidden=true;snd("ui");try{EX.cv.focus({preventScroll:true})}catch(e){}}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-xg]");if(!b)return;const n=b.dataset.xg;
  xgRun(()=>{S.team=(S.team||[]).map(x=>x&&S.owned[x]?x:"");while(S.team.length<6)S.team.push("");const i=S.team.indexOf(n),cnt=S.team.filter(x=>x).length;
    if(i>=0){if(cnt<=1){toast("Necesitas al menos un Pokémon en el equipo.");return}S.team.splice(i,1);S.team.push("")}else{const j=S.team.indexOf("");if(j<0){toast("Tu equipo ya tiene 6 Pokémon.");return}S.team[j]=n}
    S.team=S.team.filter(x=>x).concat(["","","","","",""]).slice(0,6);save()});snd("ui");xgPanel()});
{const _x=exUI;exUI=function(){const r=_x.apply(this,arguments);const sc=document.querySelector("#explPB .exscr");
  if(sc&&!$("exTeam")){sc.insertAdjacentHTML("beforeend",'<div id="exTeam" class="exteam" hidden></div><button type="button" class="exfsb exteamb" id="exTeamB" title="Tu equipo de Exploración" aria-label="Equipo">🎒</button>');$("exTeamB").onclick=()=>{snd("ui");xgPanel()}}
  return r}}

// la barra clásica de medallas no se actualiza mientras dura un combate de Exploración
{const _h=hudUI;hudUI=function(){if(XGSW)return;return _h.apply(this,arguments)}}
// ---------- las zonas se abren al avanzar la historia (como en los juegos: siempre hay Pokémon de tu nivel) ----------
const XGGATE={ruta:[2,"La Profesora Vega te está esperando en su laboratorio. ¡Ve a verla antes de salir del pueblo!"],
  bosque:[3,"Un vecino te detiene: «Dicen que en el bosque hay gente rara… Ayuda primero a Lía en la Ruta 1.»"],
  cueva:[4,"Un montañero te detiene: «La Cueva Roca es muy peligrosa para tu nivel. Entrena primero en el Bosque Verde.»"],
  playa:[5,"Un socorrista te detiene: «La Playa Coral está cerrada por ahora. Dicen que el Equipo Ocaso anda por la Cueva Roca…»"],
  cima:[6,"Un guarda te detiene: «Solo se puede subir a la Cima Aurora cuando la Profesora Vega lo autorice.»"],
  glaciar:[13,"La entrada está cubierta de nieve. Habla primero con la gente de Pueblo Nevado."],pico_e:[14,"Una pared de hielo bloquea la subida. Explora primero la Caverna Glaciar."],
  crater:[18,"Hace demasiado calor para entrar. Habla primero con la gente de Villa Volcán."],cumbre:[19,"Las rocas ardientes bloquean el paso. Explora primero el Cráter."],
  torre:[22,"La puerta de la torre está cerrada con un candado eléctrico. Habla con quien te espera en Ciudad Trueno."]};
const xgOpen=m=>{const g=XGGATE[m];return !g||(stSt().s|0)>=g[0]};
{const _a=exArrive;exArrive=function(){if(!EX.cut&&EX.M&&EX.M.w){const w=EX.M.w[exAt(EX.x,EX.y)];
    if(w&&!xgOpen(w.to)){const st=exSt();snd("ui");exSay([XGGATE[w.to][1]],()=>{exStepBack();st.x=EX.x;st.y=EX.y;st.f=EX.f});return}}
  return _a.apply(this,arguments)}}
// si tu partida de Exploración está en una zona que todavía no te toca, vuelves a Pueblo Brisa
{const _g=exGo;exGo=function(){const r=_g.apply(this,arguments);try{if(!xgOpen(exSt().m)&&(stSt().s|0)>0){exLoad("centro",7,6,"u");setTimeout(()=>{if(!EX.cut&&!EX.dlg)exSay(["Vuelves al Centro Pokémon de Pueblo Brisa para seguir tu aventura desde aquí."])},700)}}catch(e){console.error(e)}return r}}
// ---------- el primer combate contra Dani no te manda al Centro si pierdes ----------
{const _f=exFaint;exFaint=function(){if(EX.noFaint){EX.noFaint=0;return}return _f.apply(this,arguments)}}
// ---------- en Exploración los rivales usan exactamente el nivel de la historia (sin el refuerzo de los combates normales) ----------
{const _sb=startBattle;startBattle=function(cfg){if(XGSW&&cfg&&cfg.eteam&&cfg.trainer){cfg.eteam.forEach(m=>{m.mx=Math.max(1,Math.round(m.mx/1.2));m.mh=m.mx;m.ma/=1.15})}
  const pr=_sb.apply(this,arguments);try{if(XGSW&&B&&B.E&&(stSt().s|0)<=3)B.E.ai=""}catch(e){}return pr}}
// ---------- nunca dos veces el mismo Pokémon en el equipo ----------
{const _ta=stTeamAdd;stTeamAdd=function(n){return xgRun(()=>{if((S.team||[]).includes(n))return;return _ta(n)})}}
// ---------- arreglo de partidas afectadas: al principio de la historia solo te quedas con tu inicial ----------
function xgFix1(){const X=xgData();if(X.fix1)return;X.fix1=1;const t=stSt(),s=t.s|0,st=t.f&&t.f.st;if(!st||s>2)return;
  xgRun(()=>{const best=Math.max(5,...Object.keys(S.lv).filter(n=>S.owned[n]>0).map(n=>lvd(n).l));const keepLv=S.lv[st]||{l:best,x:0};
    Object.keys(S.owned).forEach(n=>{if(n!==st)delete S.owned[n]});S.owned[st]=1;S.lv={};S.lv[st]=keepLv.l>=5?keepLv:{l:5,x:0};S.hp={};S.pp={};S.team=[st,"","","","",""]});save()}
{const _g=exGo;exGo=function(){try{xgFix1()}catch(e){console.error(e)}return _g.apply(this,arguments)}}
