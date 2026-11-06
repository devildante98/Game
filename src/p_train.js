// =====================================================================================
// ZONA DE ENTRENAMIENTO: combates de práctica para probar habilidades, movimientos y objetos
// No gasta PS, PP ni objetos, no da premios ni experiencia y no cuenta para misiones ni logros.
// =====================================================================================
nxPanel("tzP","🎯 Zona de entrenamiento","Prueba a cualquiera de tus Pokémon contra el rival que quieras para ver cómo funcionan sus habilidades, movimientos y objetos. Aquí no se gastan PS, PP ni objetos, y tampoco hay premios ni experiencia.");
{const g=HUB.find(x=>x.k==="act");if(g&&!g.tabs.some(t=>t[0]==="tzP")){const i=g.tabs.findIndex(t=>t[0]==="budP");g.tabs.splice(i+1,0,["tzP","Zona de entrenamiento"])}HUBP.tzP="act";HUBR.tzP=()=>tzUI()}
const TZ={me:"",op:"Snorlax",lv:0,ab:null,mode:"dummy",last:null};
const tzOwned=()=>P.filter(p=>S.owned[p[0]]>0&&!(typeof isSup==="function"&&isSup(p[0]))&&!(typeof isMegaF==="function"&&isMegaF(p[0]))).map(p=>p[0]);
const tzSpecies=()=>Object.keys(PM).filter(n=>!(typeof isSup==="function"&&isSup(n))&&!(typeof isMegaF==="function"&&isMegaF(n)));
const tzAbName=id=>(ABD.n&&ABD.n[id])||"—";
function tzUI(){const box=$("tzPB");if(!box)return;const own=tzOwned();
  if(!own.length){box.innerHTML='<p class="mut">Todavía no tienes Pokémon. ¡Haz una tirada para conseguir el primero!</p>';return}
  if(!TZ.me||!own.includes(TZ.me))TZ.me=((S.team||[]).find(n=>n&&own.includes(n)))||own[0];
  if(!PM[TZ.op])TZ.op="Snorlax";
  const me=TZ.me,ml=lvd(me).l,lv=TZ.lv||ml,abs=abList(PM[TZ.op]),ab=TZ.ab!=null&&abs.includes(TZ.ab)?TZ.ab:abDefault(PM[TZ.op]);
  const held=heldOf(me),hn=held?(ITEMS.find(i=>i[0]===held)||[0,held])[1]:"—";
  const ownSorted=own.slice().sort((a,b)=>nk(a).localeCompare(nk(b)));
  box.innerHTML='<div class="tzw">'+
   '<div class="tzcol"><h3>🧑 Tu Pokémon</h3><div class="tzmon">'+ico(PM[me],72)+'<div><b>'+esc(nk(me))+'</b><small>Nv'+ml+' · '+tys(PM[me]).map(t=>EM[t]+' '+TIPO[t]).join(" / ")+'</small><small>✨ '+esc(tzAbName(abOf(me)))+'</small><small>🎒 '+esc(hn)+'</small></div></div>'+
    '<label class="tzl">Elegir<select id="tzMe">'+ownSorted.map(n=>'<option value="'+esc(n)+'"'+(n===me?' selected':'')+'>'+esc(nk(n)!==n?nk(n)+" ("+n+")":n)+' · Nv'+lvd(n).l+'</option>').join("")+'</select></label>'+
    '<small class="mut">Usa la habilidad, el objeto, la naturaleza y los movimientos que tenga ahora. Cámbialos en su ficha.</small></div>'+
   '<div class="tzvs">VS</div>'+
   '<div class="tzcol"><h3>🎯 Rival</h3><div class="tzmon">'+ico(PM[TZ.op],72)+'<div><b>'+esc(TZ.op)+'</b><small>'+tys(PM[TZ.op]).map(t=>EM[t]+' '+TIPO[t]).join(" / ")+'</small></div></div>'+
    '<label class="tzl">Pokémon<input id="tzOp" list="tzOpL" value="'+esc(TZ.op)+'" autocomplete="off" placeholder="Buscar Pokémon..."></label><datalist id="tzOpL">'+tzSpecies().map(n=>'<option value="'+esc(n)+'">').join("")+'</datalist>'+
    '<label class="tzl">Nivel<input id="tzLv" type="number" min="1" max="100" value="'+lv+'"></label>'+
    '<label class="tzl">Habilidad<select id="tzAb">'+(abs.length?abs:[ab]).map(a=>'<option value="'+a+'"'+(a===ab?' selected':'')+'>'+esc(tzAbName(a))+'</option>').join("")+'</select></label></div>'+
  '</div>'+
  '<div class="tzmodes"><label class="tzmode'+(TZ.mode==="dummy"?' on':'')+'"><input type="radio" name="tzM" value="dummy"'+(TZ.mode==="dummy"?' checked':'')+'><b>🎯 Diana</b><small>No ataca y recupera todos sus PS cada turno. Verás el daño exacto de cada golpe.</small></label>'+
   '<label class="tzmode'+(TZ.mode==="fight"?' on':'')+'"><input type="radio" name="tzM" value="fight"'+(TZ.mode==="fight"?' checked':'')+'><b>⚔️ Combate de práctica</b><small>El rival lucha de verdad, con sus movimientos y su habilidad.</small></label></div>'+
  '<button class="red tzgo" id="tzGo">▶ Empezar entrenamiento</button>';
  $("tzMe").onchange=e=>{TZ.me=e.target.value;TZ.lv=0;snd("ui");tzUI()};
  $("tzOp").onchange=e=>{const v=e.target.value.trim(),k=Object.keys(PM).find(n=>n.toLowerCase()===v.toLowerCase());if(k){TZ.op=k;TZ.ab=null;snd("ui")}else toast("No hay ningún Pokémon con ese nombre.");tzUI()};
  $("tzLv").onchange=e=>{TZ.lv=Math.max(1,Math.min(100,+e.target.value|0||1));e.target.value=TZ.lv};
  $("tzAb").onchange=e=>{TZ.ab=+e.target.value};
  box.querySelectorAll('[name="tzM"]').forEach(r=>r.onchange=()=>{TZ.mode=r.value;snd("ui");tzUI()});
  $("tzGo").onclick=()=>{snd("ui");tzStart({me:TZ.me,op:TZ.op,lv:TZ.lv||lvd(TZ.me).l,ab:TZ.ab!=null&&abList(PM[TZ.op]).includes(TZ.ab)?TZ.ab:abDefault(PM[TZ.op]),mode:TZ.mode})};
}
function tzStart(c){
  if(fcd||(typeof D!=="undefined"&&D)||(typeof PV!=="undefined"&&PV.st!=="idle")){toast("Termina antes tu combate actual.");return}
  if(!S.owned[c.me]||!PM[c.op])return;
  TZ.last=c;
  // copia de seguridad: nada de lo que pase aquí se guarda
  TZ.bak={bag:JSON.stringify(S.bag||{}),held:JSON.stringify(S.held||{})};
  const team0=S.team,hp0=S.hp;S.team=[c.me];S.hp={};
  const en=mkEnemy(PM[c.op],Math.max(1,Math.min(100,c.lv|0)));en.ab=c.ab;
  let p;try{try{hubClose()}catch(e){}p=startBattle({eteam:[en],tzone:1})}finally{S.team=team0;S.hp=hp0}
  if(!B||!fcd)return;
  B.practice=1;B.tzDummy=c.mode==="dummy";
  B.who=(i,n)=>i===0?nk(n):(B.tzDummy?"La diana ("+n+")":n+" rival");
  // PP al máximo
  try{B.E.sd[0].t.forEach(t=>{t.pp=t.m.map(mv=>ppMax((t.p0||t.p)[0],mv.id))})}catch(e){}
  return p}
// fin del combate de práctica
function tzRestore(){if(!TZ.bak)return;try{S.bag=JSON.parse(TZ.bak.bag);S.held=JSON.parse(TZ.bak.held)}catch(e){}TZ.bak=null;save();try{render()}catch(e){}}
{const _f=finish;finish=async function(res){if(!(B&&B.practice))return _f.apply(this,arguments);
  B.E.sd[0].t.forEach(t=>{t.sts=""});
  await say(res==="win"?(B.tzDummy?"¡La diana no ha aguantado el golpe! Entrenamiento completado.":"¡Has ganado el combate de práctica!"):res==="lose"?"Tu Pokémon se ha debilitado. ¡Sigue practicando!":"Fin del entrenamiento.");
  tzRestore();$("menu").innerHTML='<button data-k="tzr">🔁 Repetir</button><button data-k="9">Volver</button>';B.busy=false}}
// nada se guarda durante la práctica
{const _s=saveHp;saveHp=function(){if(B&&B.practice)return;return _s.apply(this,arguments)}}
{const _p=syncPP;syncPP=function(){if(B&&B.practice)return;return _p.apply(this,arguments)}}
// la diana no ataca
{const _a=aiAct;aiAct=function(E,i){if(B&&B.practice&&B.tzDummy&&i===1)return "x";return _a.apply(this,arguments)}}
// la diana recupera sus PS cada turno y se muestra el daño de cada golpe
{const _t=sTurn;sTurn=async function(act){if(!(B&&B.practice))return _t.apply(this,arguments);
  const b=B,om=beAct(B.E.sd[1]);if(B.tzDummy&&om&&om.mh>0){om.mh=om.mx;try{bePaint(beSnap(B.E))}catch(e){}}
  const h0=om?om.mh:0;await _t.apply(this,arguments);
  if(b.tzDummy&&om){const d=Math.max(0,h0-Math.max(0,om.mh));if(d>0)toast("🎯 Daño: "+fmt(d)+" PS ("+Math.round(d/om.mx*100)+"% de sus PS)");else if(/^m\d$/.test(act))toast("🎯 Sin daño en este turno")}}}
// sin objetos ni capturas; «Repetir» vuelve a empezar con lo mismo
{const _tu=turn;turn=async function(k){if(B&&B.practice){
    if(k==="tzr"){const c=TZ.last;arenaReset();bigSet("");$("arena").hidden=true;$("fsel").hidden=false;fcd=false;B=null;updTeam();if(c)setTimeout(()=>tzStart(c),60);return}
    if(k==="b"||/^[iuv]:/.test(k)){if(!B.busy)toast("🎯 En la Zona de entrenamiento no se usan objetos de la Mochila.");return}
    if(k==="f"&&!B.busy){B.busy=true;setMenu(false);await say("Has terminado el entrenamiento.");tzRestore();B.busy=false;$("menu").innerHTML='<button data-k="tzr">🔁 Repetir</button><button data-k="9">Volver</button>';return}}
  return _tu.apply(this,arguments)}}
// al volver, otra vez a la Zona de entrenamiento
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest('#menu [data-k="9"]');if(b&&B&&B.practice){tzRestore();setTimeout(()=>{try{hubOpen("act","tzP")}catch(x){}},80)}},true);
// acceso directo junto a «¡Combatir!»
{const g=$("fgo");if(g&&!$("tzOpen")){const b=document.createElement("button");b.className="alt";b.id="tzOpen";b.type="button";b.textContent="🎯 Zona de entrenamiento";b.onclick=()=>{snd("ui");hubOpen("act","tzP")};g.after(b)}}
