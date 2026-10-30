// ================= entrenadores y Ligas =================
// [nombre, equipo, nivel extra, sprite original de su clase de entrenador]
const TRAINERS=[
["Excursionista",["Geodude","Machop","Onix"],0,"hiker"],["Nadadora",["Staryu","Goldeen","Psyduck","Vaporeon"],0,"swimmerf"],["Cazabichos",["Caterpie","Weedle","Scyther","Pinsir"],0,"bugcatcher-gen4dp"],
["Karateka",["Hitmonlee","Hitmonchan","Machamp"],1,"blackbelt"],["Médium",["Abra","Gastly","Hypno","Alakazam"],1,"psychicf"],["Granjera",["Miltank","Tauros","Ponyta","Rapidash"],1,"pokefanf"],
["Criador de dragones",["Dratini","Dragonair","Gyarados"],2,"dragontamer"],["Científico",["Magnemite","Voltorb","Electabuzz","Magneton"],1,"scientist"],["Pescador",["Magikarp","Tentacool","Seaking","Gyarados"],1,"fisherman"],
["Domadora de aves",["Pidgey","Spearow","Doduo","Farfetch'd"],0,"birdkeeper-gen4dp"],["Montañero",["Rhyhorn","Sandslash","Golem","Onix"],1,"hiker-gen4"],["Cazafantasmas",["Gastly","Haunter","Misdreavus","Duskull"],1,"psychic"],
["Marinero",["Wingull","Pelipper","Carvanha","Sharpedo"],1,"sailor"],["Ninja",["Sneasel","Umbreon","Weavile"],2,"ninjaboy"],["Maestra de hielo",["Swinub","Piloswine","Glalie","Delibird"],1,"skierf"],
["Motero",["Voltorb","Electrode","Manectric","Luxray"],2,"biker"],["Jardinera",["Bellsprout","Roselia","Tropius","Leafeon"],1,"aromalady"],["Piromaníaco",["Growlithe","Vulpix","Magmar","Torkoal"],1,"firebreather"],
["Minero",["Geodude","Nosepass","Onix","Steelix"],2,"worker"],["Aventurero",["Eevee","Pikachu","Snorlax","Lapras"],2,"backpacker"],["Hada del bosque",["Togepi","Snubbull","Mawile","Sylveon"],2,"parasollady"],
["Experto en veneno",["Koffing","Ekans","Grimer","Skuntank"],1,"roughneck"],["Cantante",["Jigglypuff","Chatot","Loudred","Exploud"],1,"guitarist"],["Veterano",["Tyranitar","Salamence","Garchomp"],4,"veteran"],
["Gran campeón retirado",["Charizard","Blastoise","Venusaur","Dragonite"],4,"acetrainer"]];
const LEAGUES=[
{n:"Liga Kanto",e:[["Maestra de Hielo","ice"],["Maestro Luchador","fighting"],["Médium Espectral","ghost"],["Domador de Dragones","dragon"]],c:["Campeón de Kanto",["normal","water","fire","grass","electric","psychic"]]},
{n:"Liga Johto",e:[["Entomólogo","bug"],["Maestro Siniestro","dark"],["Sabia Psíquica","psychic"],["Piromante","fire"]],c:["Campeón de Johto",["dragon","flying","ground","water","fire","ghost"]]},
{n:"Liga Hoenn",e:[["Sombra Nocturna","dark"],["Médium Fantasma","ghost"],["Reina del Hielo","ice"],["Maestro de Acero","steel"]],c:["Campeón de Hoenn",["steel","dragon","rock","water","psychic","electric"]]},
{n:"Liga Sinnoh",e:[["Cazabichos Maestra","bug"],["Boxeador Maestro","fighting"],["Mineralogista","ground"],["Narradora Fantasma","ghost"]],c:["Campeona de Sinnoh",["dragon","ground","steel","ice","fire","water"]]},
{n:"Liga Teselia",e:[["Veneno Supremo","poison"],["Karateka Supremo","fighting"],["Mentalista","psychic"],["Gran Espectro","ghost"]],c:["Campeón de Teselia",["dragon","fire","grass","water","electric","dark"]]},
{n:"Liga Kalos",e:[["Hada Mayor","fairy"],["Médium de Kalos","ghost"],["Maestro Siniestro de Kalos","dark"],["Maestra de Hielo de Kalos","ice"]],c:["Campeona de Kalos",["fairy","fire","water","grass","fighting","dragon"]]},
{n:"Liga Alola",e:[["Karateka de Alola","fighting"],["Cantante de Alola","rock"],["Guardiana Espectral","ghost"],["Maestro Volador","flying"]],c:["Campeón de Alola",["normal","fire","water","electric","psychic","dragon"]]},
{n:"Liga Galar",e:[["Maestra de Planta","grass"],["Maestro de Agua","water"],["Maestro de Fuego","fire"],["Maestra de Lucha","fighting"]],c:["Campeón de Galar",["fire","dragon","flying","steel","psychic","fairy"]]},
{n:"Liga Paldea",e:[["Maestra de Tierra","ground"],["Maestro de Acero","steel"],["Maestra Voladora","flying"],["Maestro Dragón","dragon"]],c:["Campeona de Paldea",["dragon","ghost","fairy","fire","water","grass"]]}];
// sprite de clase segun el tipo del miembro de la Liga (m = chico, f = chica)
const LGSPR={ice:["acetrainersnow","acetrainersnowf"],fighting:["blackbelt","battlegirl"],ghost:["psychic","medium"],dragon:["dragontamer","acetrainerf"],bug:["pokemonranger","pokemonrangerf"],dark:["roughneck","madame"],psychic:["psychic","psychicf"],fire:["firebreather","acetrainerf-gen4"],steel:["worker","scientistf"],ground:["hiker","pokemonrangerf-gen4"],poison:["scientist","scientistf"],fairy:["gentleman","lady"],rock:["hiker-gen4","picnicker"],flying:["birdkeeper-gen4dp","skierf"],grass:["pokemonranger-gen4","aromalady"],water:["swimmer","swimmerf"],normal:["acetrainer","acetrainerf"],electric:["guitarist","cyclistf"]};
const isFem=t=>/^(Maestra|Reina|Sabia|Cazabichos Maestra|Narradora|Hada|Guardiana|Campeona|Nadadora|Granjera|Domadora|Jardinera|Médium Espectral)/.test(t);
const clampL=l=>Math.max(1,Math.min(100,Math.round(l)));
function mkEnemy(p,l){return beMon(p,l,null,defMoves(p[0],l))}
function leagueEnemies(li,k,lead){
  const L=LEAGUES[li],champ=k===4,types=champ?L.c[1]:[L.e[k][1]],n=champ?6:[3,4,4,5][k],rng=rngS(li*131+k*17+7),minR=champ?3:2,used={},out=[];
  for(let i=0;i<n;i++){
    const ty=types[i%types.length];
    let pool=P.filter(p=>p[1]===ty&&WW[p[2]]>=minR&&p[3]<10&&!used[p[0]]);
    if(!pool.length)pool=P.filter(p=>WW[p[2]]>=minR&&p[3]<10&&!used[p[0]]);
    const p=pool[Math.floor(rng()*pool.length)];used[p[0]]=1;out.push(p);
  }
  out.sort((a,b)=>WW[a[2]]-WW[b[2]]);
  const base=lead+2+k*2+li*2;
  return out.map((p,i)=>mkEnemy(p,clampL(base+i)));
}
function leagueSpr(li,k){const L=LEAGUES[li],nm=k===4?L.c[0]:L.e[k][0],ty=k===4?"normal":L.e[k][1],q=LGSPR[ty]||LGSPR.normal;return k===4?(isFem(nm)?"acetrainerf":"acetrainer"):q[isFem(nm)?1:0]}
const leadLevel=()=>{const n=(S.team||[]).find(x=>x&&S.owned[x]&&S.hp[x]!==0);return n?lvd(n).l:1};
function leagueTitle(li,k){const L=LEAGUES[li];return (k===4?L.c[0]:L.e[k][0])+" ("+L.n+")"}
async function leagueWin(){
  const lg=S.lg;if(!lg)return;
  lg.k++;
  if(lg.k>=5){
    const L=LEAGUES[lg.li],bonus=2000000+500000*lg.li;
    S.t+=bonus;S.bag.cand=(S.bag.cand||0)+1;S.lgDone=S.lgDone||{};S.lgDone[lg.li]=(S.lgDone[lg.li]||0)+1;S.lg=null;
    snd("lvl");await say("¡HAS GANADO LA "+L.n.toUpperCase()+"! ¡Eres el nuevo campeón!");
    snd("win");await say("Premio de la Liga: +"+fmt(bonus)+" 🎟️ y 1 Caramelo Raro.");
  }else await say("¡Ronda superada! Siguiente rival: "+leagueTitle(lg.li,lg.k)+".");
  save();
}
let _lk="";
function leagueUI(){
  const key=JSON.stringify([S.lg,S.lgDone,fcd]);if(key===_lk)return;_lk=key;
  let h="";
  if(S.lg){
    const L=LEAGUES[S.lg.li],k=S.lg.k;
    h+='<div class="lgnow"><b>🏟️ Torneo en curso: '+L.n+'</b><div>Ronda '+(k+1)+' de 5 · Rival: <b>'+(k===4?L.c[0]:L.e[k][0])+'</b></div><div class="lgdots">'+[0,1,2,3,4].map(i=>'<i class="'+(i<k?'ok':i===k?'cur':'')+'"></i>').join("")+'</div><div class="lgbtn"><button class="red" id="lgGo"'+(fcd?' disabled':'')+'>▶ Empezar combate</button><button class="alt" id="lgQuit"'+(fcd?' disabled':'')+'>Abandonar torneo</button></div><small class="mut">Los PS no se curan entre rondas: usa la Mochila o el Centro Pokémon antes de empezar.</small></div>';
  }
  if(!lgUnlocked())h+='<div class="lgnow"><b>🔒 Liga bloqueada</b><small class="mut">Consigue las 8 medallas en los Gimnasios para poder desafiar a la Liga. Llevas '+medCount()+' de 8.</small></div>';
  h+='<div class="lggrid">'+LEAGUES.map((L,i)=>'<div class="lgc"><b>🏆 '+L.n+'</b><small class="mut">'+((S.lgDone&&S.lgDone[i])?'Campeón ×'+S.lgDone[i]:'Sin completar')+'</small><button data-lg="'+i+'"'+((S.lg||fcd)?' disabled':'')+'>Desafiar</button></div>').join("")+'</div><small id="lgMsg" class="mut"></small>';
  $("lgBox").innerHTML=h;
}
$("lgBox").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.lg!==undefined){
    if(!(S.team||[]).some(n=>n&&S.owned[n]&&S.hp[n]!==0)){$("lgMsg").textContent="Necesitas un equipo con al menos un Pokémon con PS.";return}
    if(!lgUnlocked()){$("lgMsg").textContent="🔒 Necesitas las 8 medallas de los Gimnasios para entrar en la Liga Pokémon.";return}
    S.lg={li:+b.dataset.lg,k:0};save();_lk="";leagueUI();return;
  }
  if(b.id==="lgQuit"){S.lg=null;save();_lk="";leagueUI();return}
  if(b.id==="lgGo"&&S.lg){
    const li=S.lg.li,k=S.lg.k;
    startBattle({eteam:leagueEnemies(li,k,leadLevel()),trainer:leagueTitle(li,k),tsrc:{k:leagueSpr(li,k),n:leagueTitle(li,k)},league:{li:li,k:k}});
  }
});
// ================= bonus del premio gordo: subir un Pokemon al nivel 100 =================
function jlList(){
  const q=nrm($("jlq").value.trim()),arr=P.filter(p=>S.owned[p[0]]&&lvd(p[0]).l<100&&nrm(p[0]).includes(q)).sort((a,b)=>((S.team.includes(b[0])?1:0)-(S.team.includes(a[0])?1:0))||(lvd(b[0]).l-lvd(a[0]).l));
  $("jls").innerHTML=arr.slice(0,300).map(p=>'<option value="'+esc(p[0])+'">'+esc(p[0])+' · Nv'+lvd(p[0]).l+(S.team.includes(p[0])?' ⭐ equipo':'')+'</option>').join("");
  if(arr.length)$("jls").selectedIndex=0;
}
function pickJackpot(){
  return new Promise(res=>{
    $("jlq").value="";jlList();$("jlv").hidden=false;try{$("jlq").focus()}catch(e){}
    $("jlq").oninput=jlList;
    $("jlno").onclick=()=>{$("jlv").hidden=true;res(null)};
    $("jlok").onclick=()=>{const v=$("jls").value;if(!v)return;$("jlv").hidden=true;res(v)};
  });
}
async function jackpotLevel(){
  if(!P.some(p=>S.owned[p[0]]&&lvd(p[0]).l<100))return;
  await say("¡Como premio extra, puedes subir un Pokémon al nivel 100!");
  const n=await pickJackpot();
  if(!n){await say("Has decidido no usar el bonus del premio gordo.");return}
  const p=PM[n],d=lvd(n);d.l=100;d.x=0;
  B.E.sd[0].t.forEach(t=>{if(t.p===p){const mx=stH(p,100);t.mh=t.mh>0?Math.min(mx,t.mh+(mx-t.mx)):0;t.l=100;t.mx=mx;t.ma=stA(p,100)}});
  bePaint();saveHp();if(!B.E.sd[0].t.some(t=>t.p===p))delete S.hp[n];
  burst("⭐",pos("msp"),10,70,28);snd("lvl");
  await say("¡"+n+" ha subido directamente al nivel 100!");
  await offer(p);
  if(evoLvReady(n).length)await evoPrompt(n,evoLvReady(n));
  save();
}
// ================= inicio de combate (salvaje, entrenador o Liga) =================
async function startBattle(cfg){
  const names=(S.team||[]).filter(n=>n&&S.owned[n]);if(!names.length||fcd||D||R2&&R2.ph==="battle"||PV.st!=="idle")return;
  const ok=names.some(n=>S.hp[n]!==0);if(!ok){updTeam();return}
  fcd=true;$("fgo").disabled=true;
  try{$("batP").scrollIntoView({behavior:"smooth",block:"start"})}catch(e){}
  const team=names.map(n=>{const ids=moveIds(n),m=beMon(PM[n],lvd(n).l,S.hp[n],ids,ids.map(id=>ppCur(n,id)));m.sh=S.shiny&&S.shiny[n]>0?1:0;monX(m,natOf(n),heldOf(n));m.ab=abOf(n);if(S.buddy&&S.buddy.n===n&&(S.buddy.f|0)>=160)m.bud=1;return m});
  const cap=lvCap(),lead=Math.min(team.find(t=>t.mh>0).l,cap),wl=cap<100?Math.min(lead,cap-2):lead;
  let eteam,trainer=null,league=null,tsrc=null;
  if(cfg&&cfg.eteam){eteam=cfg.eteam;trainer=cfg.trainer;league=cfg.league||null;tsrc=cfg.tsrc}
  else if(Math.random()<.18){
    const tr=TRAINERS[Math.floor(Math.random()*TRAINERS.length)];trainer=tr[0];tsrc={k:tr[3],n:tr[0]};
    eteam=tr[1].filter(n=>PM[n]).map((n,i)=>mkEnemy(PM[n],clampL(lead+Math.floor(Math.random()*6)-3+tr[2]+i)));
  }else{
    const x=Math.random()*100,r=x<2?"L":x<8?"E":x<30?"R":"C",op=wildPick(r);
    eteam=[mkEnemy(op,clampL(wl+Math.floor(Math.random()*5)-2+WW[r]-1))];if(Math.random()<SHINY_W)eteam[0].sh=1;
  }
  const E=beNew([beSide(team),beSide(eteam)],[[0],[1]]);
  B={mode:"s",E:E,me:0,SL:[SL_ME,SL_OP],trainer:trainer,tsrc:tsrc,league:league,gym:cfg&&cfg.gym!=null?cfg.gym:null,zone:cfg&&cfg.eteam?null:zoneCur(),xpPool:0,busy:true,choose:null,item:null,showOpp:!!trainer,
    tower:cfg&&cfg.tower?1:0,
    who:(i,n)=>i===0?(typeof nk==="function"?nk(n):n):(trainer?n+" de "+trainer:n+" salvaje"),mine:i=>i===0,onSend:sSend};
  $("fsel").hidden=true;$("arena").hidden=false;arenaReset();
  $("hlpp").hidden=true;$("otn").textContent=trainer?"👤 "+trainer:"";
  if(O.bigmode&&!bigMode)bigSet(O.bigmode);
  const sn=beSnap(E);setSpr(0,sn);setSpr(1,sn);bePaint(sn);setScene($("bscene"),B.zone&&!trainer?ZONES[B.zone].env:envOf(beAct(E.sd[1]).p[1]));xpBar();$("menu").innerHTML="";$("fmsg").textContent="";
  $("osp").style.opacity=0;$("msp").style.opacity=0;$("oi").style.opacity=0;$("mi").style.opacity=0;
  await sIntro();
  for(const t of E.sd[0].t){await offer(t.p);const ids=moveIds(t.p[0]);t.m=ids.map(MVI);t.pp=ids.map(id=>ppCur(t.p[0],id))}
  B.busy=false;setMenu(true);
}
$("fgo").onclick=()=>startBattle(null);
