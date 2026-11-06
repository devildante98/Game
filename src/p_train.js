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
const tzAbDesc=id=>(typeof ABDESC!=="undefined"&&ABDESC[id])||"";
const tzTypes=p=>'<span class="tztys">'+tys(p).map(t=>'<i style="--tc:'+(TC[t]||"#999")+'">'+EM[t]+' '+TIPO[t]+'</i>').join("")+'</span>';
function tzUI(){const box=$("tzPB");if(!box)return;const own=tzOwned();
  if(!own.length){box.innerHTML='<p class="mut">Todavía no tienes Pokémon. ¡Haz una tirada para conseguir el primero!</p>';return}
  if(!TZ.me||!own.includes(TZ.me))TZ.me=((S.team||[]).find(n=>n&&own.includes(n)))||own[0];
  if(!PM[TZ.op])TZ.op="Snorlax";
  const me=TZ.me,ml=lvd(me).l,lv=TZ.lv||ml,abs=abList(PM[TZ.op]),ab=TZ.ab!=null&&abs.includes(TZ.ab)?TZ.ab:abDefault(PM[TZ.op]),mab=abOf(me);
  const held=heldOf(me),hit=held?ITEMS.find(i=>i[0]===held):null,sh=S.shiny&&S.shiny[me]>0;
  box.innerHTML='<div class="tzw">'+
   '<div class="tzcol"><h3>🧑 Tu Pokémon</h3>'+
    '<button type="button" class="tzpick '+PM[me][2]+'" data-tzpk="me"><span class="tzspr">'+ico(PM[me],96,false,sh)+'</span><span class="tzinfo"><b>'+(sh?"✨ ":"")+esc(nk(me))+'</b>'+(nk(me)!==me?'<small>'+esc(me)+'</small>':'')+'<small>Nv'+ml+' · '+STAR[PM[me][2]]+'</small>'+tzTypes(PM[me])+'</span><span class="tzchg">🔄 Cambiar</span></button>'+
    '<div class="tzab one"><b>✨ '+esc(tzAbName(mab))+'</b><small>'+esc(tzAbDesc(mab)||"—")+'</small></div>'+
    '<div class="tzab one"><b>🎒 '+esc(hit?hit[1]:"Sin objeto")+'</b>'+(hit&&hit[6]?'<small>'+esc(String(hit[6]).replace(/\. Se equipa desde.*$/,""))+'</small>':'')+'</div>'+
    '<small class="mut">Usa la habilidad, el objeto, la naturaleza y los movimientos que tenga ahora. Cámbialos en su ficha.</small></div>'+
   '<div class="tzvs">VS</div>'+
   '<div class="tzcol"><h3>🎯 Rival</h3>'+
    '<button type="button" class="tzpick '+PM[TZ.op][2]+'" data-tzpk="op"><span class="tzspr">'+ico(PM[TZ.op],96)+'</span><span class="tzinfo"><b>'+esc(TZ.op)+'</b><small>'+STAR[PM[TZ.op][2]]+'</small>'+tzTypes(PM[TZ.op])+'</span><span class="tzchg">🔄 Cambiar</span></button>'+
    '<label class="tzl tzlv">Nivel<input id="tzLv" type="number" min="1" max="100" value="'+lv+'"><span class="tzlvb"><button type="button" data-tzlv="'+ml+'">Como el tuyo</button><button type="button" data-tzlv="50">50</button><button type="button" data-tzlv="100">100</button></span></label>'+
    '<div class="tzl">Habilidad del rival<div class="tzabs">'+(abs.length?abs:[ab]).map(a=>'<button type="button" class="tzab'+(a===ab?' on':'')+'" data-tzab="'+a+'"><b>'+(a===ab?'✅ ':'')+esc(tzAbName(a))+'</b><small>'+esc(tzAbDesc(a)||"—")+'</small></button>').join("")+'</div></div></div>'+
  '</div>'+
  '<div class="tzmodes"><label class="tzmode'+(TZ.mode==="dummy"?' on':'')+'"><input type="radio" name="tzM" value="dummy"'+(TZ.mode==="dummy"?' checked':'')+'><b>🎯 Diana</b><small>No ataca y recupera todos sus PS cada turno. Verás el daño exacto de cada golpe.</small></label>'+
   '<label class="tzmode'+(TZ.mode==="fight"?' on':'')+'"><input type="radio" name="tzM" value="fight"'+(TZ.mode==="fight"?' checked':'')+'><b>⚔️ Combate de práctica</b><small>El rival lucha de verdad, con sus movimientos y su habilidad.</small></label></div>'+
  '<button class="red tzgo" id="tzGo">▶ Empezar entrenamiento</button>';
  $("tzLv").onchange=e=>{TZ.lv=Math.max(1,Math.min(100,+e.target.value|0||1));e.target.value=TZ.lv};
  box.querySelectorAll('[name="tzM"]').forEach(r=>r.onchange=()=>{TZ.mode=r.value;snd("ui");tzUI()});
  $("tzGo").onclick=()=>{snd("ui");tzStart({me:TZ.me,op:TZ.op,lv:TZ.lv||lvd(TZ.me).l,ab:TZ.ab!=null&&abList(PM[TZ.op]).includes(TZ.ab)?TZ.ab:abDefault(PM[TZ.op]),mode:TZ.mode})};
}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest||!t.closest("#tzPB"))return;
  const a=t.closest("[data-tzab]");if(a){TZ.ab=+a.dataset.tzab;snd("ui");tzUI();return}
  const l=t.closest("[data-tzlv]");if(l){e.preventDefault();TZ.lv=+l.dataset.tzlv;snd("ui");tzUI();return}
  const k=t.closest("[data-tzpk]");if(k){snd("ui");tzPkOpen(k.dataset.tzpk)}});
// ---------- elegir Pokémon con tarjetas (como al formar el equipo) ----------
const TZK={w:"me",q:"",t:"",o:"az"};
function tzPkOpen(w){TZK.w=w;TZK.q="";TZK.t="";let m=$("tzPkM");if(!m){m=document.createElement("div");m.id="tzPkM";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");document.body.appendChild(m);
    m.addEventListener("click",e=>{if(e.target===m||e.target.closest(".tpx")){m.hidden=true;return}const c=e.target.closest("[data-tzn]");if(c){const n=c.dataset.tzn;if(TZK.w==="me"){TZ.me=n;TZ.lv=0}else{TZ.op=n;TZ.ab=null}m.hidden=true;snd("ui");tzUI();return}
      const ty=e.target.closest("[data-tzt]");if(ty){TZK.t=ty.dataset.tzt;tzPkRender();return}});
    m.addEventListener("input",e=>{if(e.target.id==="tzPkQ"){TZK.q=e.target.value;tzPkList()}});m.addEventListener("change",e=>{if(e.target.id==="tzPkO"){TZK.o=e.target.value;tzPkList()}});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!m.hidden){m.hidden=true;e.stopPropagation()}},true)}
  m.hidden=false;tzPkRender();setTimeout(()=>{const q=$("tzPkQ");if(q&&matchMedia("(pointer:fine)").matches)q.focus()},50)}
function tzPkRender(){const m=$("tzPkM"),types=Object.keys(TIPO);
  m.innerHTML='<div class="tpw"><div class="tph"><b>'+(TZK.w==="me"?'Elige tu Pokémon':'Elige el Pokémon rival')+'</b><button class="tpx" aria-label="Cerrar">✕</button></div>'+
    '<div class="tpf"><input id="tzPkQ" placeholder="'+(TZK.w==="me"?'Buscar por nombre o mote...':'Buscar Pokémon...')+'" value="'+esc(TZK.q)+'"><select id="tzPkO" aria-label="Ordenar">'+[["az","Alfabético (A-Z)"],["dex","Número de Pokédex"],["rar","Rareza"]].concat(TZK.w==="me"?[["lv","Nivel (mayor primero)"]]:[]).map(o=>'<option value="'+o[0]+'"'+(TZK.o===o[0]?' selected':'')+'>'+o[1]+'</option>').join("")+'</select></div>'+
    '<div class="tzpkt"><button class="'+(!TZK.t?'on':'')+'" data-tzt="">Todos</button>'+types.map(t=>'<button class="'+(TZK.t===t?'on':'')+'" data-tzt="'+t+'" style="--tc:'+(TC[t]||"#999")+'">'+EM[t]+' '+TIPO[t]+'</button>').join("")+'</div>'+
    '<div class="tpl" id="tzPkL"></div></div>';
  tzPkList()}
function tzPkList(){const L=$("tzPkL");if(!L)return;const q=nrm(TZK.q||""),me=TZK.w==="me",cur=me?TZ.me:TZ.op;
  let a=(me?tzOwned():tzSpecies()).map(n=>PM[n]).filter(p=>p&&(!TZK.t||tys(p).includes(TZK.t))&&(!q||nrm(p[0]).includes(q)||(me&&nrm(nk(p[0])).includes(q))));
  const so={az:(x,y)=>(me?nk(x[0]):x[0]).localeCompare(me?nk(y[0]):y[0],"es"),dex:(x,y)=>(x[4]||0)-(y[4]||0)||x[0].localeCompare(y[0]),rar:(x,y)=>"CREML".indexOf(y[2])-"CREML".indexOf(x[2])||x[0].localeCompare(y[0]),lv:(x,y)=>lvd(y[0]).l-lvd(x[0]).l}[TZK.o]||((x,y)=>0);
  a.sort(so);const tot=a.length;a=a.slice(0,300);
  L.innerHTML=a.length?a.map(p=>{const n=p[0],sh=me&&S.shiny&&S.shiny[n]>0;
    return '<button class="tpc '+p[2]+(n===cur?' cur':'')+'" data-tzn="'+esc(n)+'"><span class="tpspr">'+ico(p,56,false,sh)+'</span><b>'+(sh?"✨ ":"")+esc(me?nk(n):n)+'</b><small>'+(me?'Nv'+lvd(n).l+' · ':'')+STAR[p[2]]+'</small><small>'+tyTxt(p)+'</small>'+(n===cur?'<i class="tpin">Elegido</i>':'')+'</button>'}).join("")+(tot>300?'<small class="mut tzpkmore">Hay '+tot+': usa el buscador o los tipos para encontrar el que quieres.</small>':''):'<small class="mut">Ningún Pokémon coincide con la búsqueda.</small>'}
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
