// ================= eventos de temporada y Pokémon de la semana =================
const EVENTS=[{n:"🎃 Halloween",t:["ghost","dark"],a:[10,24],b:[11,2]},{n:"🎄 Navidad",t:["ice","fairy"],a:[12,20],b:[1,6]},{n:"💘 San Valentín",t:["fairy","psychic"],a:[2,10],b:[2,16]},{n:"🌸 Primavera",t:["grass","bug"],a:[3,20],b:[4,10]},{n:"☀️ Verano",t:["water","fire"],a:[7,15],b:[8,31]}];
const MESES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
function evNow(){const d=new Date(),v=(d.getMonth()+1)*100+d.getDate();return EVENTS.find(e=>{const a=e.a[0]*100+e.a[1],b=e.b[0]*100+e.b[1];return a<=b?v>=a&&v<=b:(v>=a||v<=b)})||null}
const weekKey=()=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
let _ft=null,_ftk="";
function featured(){const k=weekKey();if(_ftk===k)return _ft;_ftk=k;const r=rngS(pvHash("feat"+k)),pool=P.filter(p=>(p[2]==="E"||p[2]==="R")&&p[3]<10);_ft=pool[Math.floor(r()*pool.length)];return _ft}
function evBanUI(){
  const ev=evNow(),f=featured(),b=$("evBan");if(!b)return;const key=(ev?ev.n:"")+f[0];if(b._k===key)return;b._k=key;
  b.innerHTML=(ev?'<div class="evb ev"><b>'+ev.n+'</b> · Evento activo hasta el '+ev.b[1]+' '+MESES[ev.b[0]-1]+': más Pokémon de tipo '+ev.t.map(t=>EM[t]+" "+TIPO[t]).join(" y ")+' en tiradas y combates.'+(typeof TRSHOP!=="undefined"&&TRSHOP.some(x=>x[3]===ev.n)?' <a href="#" data-trshop class="evshop">🛍️ ¡Ropa de temporada en la Tienda de ropa!</a>':'')+'</div>':'')+
    '<div class="evb ft">'+ico(f,40)+'<span><b>⭐ Pokémon de la semana: '+esc(f[0])+'</b> '+STAR[f[2]]+'<br><small>Sale mucho más a menudo en las tiradas hasta el lunes.</small></span></div>';
}
// ================= zonas de exploración =================
const ZONES={pra:{n:"🌾 Pradera",t:["normal","grass","bug","flying"],env:"grass",m:0},bos:{n:"🌲 Bosque",t:["grass","bug","poison","fairy"],env:"grass",m:0},cue:{n:"🪨 Cueva",t:["rock","ground","fighting","steel","dark"],env:"canyon",m:1},mar:{n:"🌊 Mar",t:["water","ice"],env:"water",m:2},ciu:{n:"🏙️ Ciudad",t:["electric","normal","psychic","steel"],env:"grass",m:3},vol:{n:"🌋 Volcán",t:["fire","rock","dragon"],env:"canyon",m:4},tor:{n:"🏚️ Torre Fantasma",t:["ghost","psychic","dark"],env:"night",m:5},nie:{n:"🏔️ Montaña Nevada",t:["ice","flying","dragon"],env:"ice",m:6}};
const zoneCur=()=>S.zone&&ZONES[S.zone]&&medCount()>=ZONES[S.zone].m?S.zone:null;
function wildPick(r){
  let pool=P.filter(p=>p[2]===r);const z=zoneCur()?ZONES[zoneCur()]:null;
  if(z&&Math.random()<.85){const zp=pool.filter(p=>z.t.includes(p[1]));if(zp.length)pool=zp}
  const ev=evNow();if(ev&&Math.random()<.3){const ep=pool.filter(p=>ev.t.includes(p[1]));if(ep.length)pool=ep}
  return pool[Math.floor(Math.random()*pool.length)];
}
function zoneUI(){
  const s=$("zoneSel");if(!s)return;const mc=medCount(),key=mc+":"+S.zone;if(s._k===key)return;s._k=key;
  s.innerHTML='<option value="">🎲 Zona al azar</option>'+Object.keys(ZONES).map(k=>{const z=ZONES[k],lk=mc<z.m;return '<option value="'+k+'"'+(lk?' disabled':'')+'>'+z.n+(lk?' 🔒 '+z.m+' medalla'+(z.m>1?'s':''):' · '+z.t.map(t=>TIPO[t]).join(", "))+'</option>'}).join("");
  s.value=zoneCur()||"";
}
// ================= gimnasios y medallas =================
// [medalla, tipo, nivel, gimnasio, líder] (los 8 gimnasios de Kanto)
const GYMS=[["Roca","rock",12,"Ciudad Plateada","Brock"],["Cascada","water",18,"Ciudad Celeste","Misty"],["Trueno","electric",24,"Ciudad Carmín","Teniente Surge"],["Arcoíris","grass",30,"Ciudad Azulona","Erika"],["Alma","poison",36,"Ciudad Fucsia","Koga"],["Pantano","psychic",42,"Ciudad Azafrán","Sabrina"],["Volcán","fire",48,"Isla Canela","Blaine"],["Tierra","ground",54,"Ciudad Verde","Giovanni"]];
// ---- límite de nivel: nadie sube por encima del as del siguiente Líder hasta conseguir su medalla
const gymAce=i=>GYMS[i][2]+2*(3+Math.floor(i/3))-4;
const gymNext=()=>{for(let i=0;i<GYMS.length;i++)if(!(S.med&&S.med[i]))return i;return -1};
const lvCap=()=>{const i=gymNext();return i<0?100:gymAce(i)};
const capWhy=()=>{const i=gymNext();return i<0?"":"Derrota al Líder "+GYMS[i][4]+" (Gimnasio de "+GYMS[i][3]+") para subir el límite."};
const medCount=()=>Object.keys(S.med||{}).filter(k=>S.med[k]).length;
const lgUnlocked=()=>medCount()>=8||Object.keys(S.lgDone||{}).length>0||!!S.lg;
function gymTeam(i){
  const g=GYMS[i],rng=rngS(1000+i*77),n=3+Math.floor(i/3),pool=P.filter(p=>p[1]===g[1]&&p[3]<10&&p[2]!=="L"),out=[];
  for(let k=0;k<30&&out.length<n;k++){const p=pool[Math.floor(rng()*pool.length)];if(p&&!out.includes(p))out.push(p)}
  out.sort((a,b)=>WW[a[2]]-WW[b[2]]);
  const rm=S.med&&S.med[i]?Math.max(0,leadLevel()-g[2]):0;
  return out.map((p,k)=>mkEnemy(p,clampL(g[2]+k*2-2+rm)));
}
// medallas originales de los juegos (PokeAPI): Roca, Cascada, Trueno, Arcoíris, Alma, Pantano, Volcán y Tierra
const BADGE="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/badges/";
function badgeErr(el){if(!el.dataset.r){el.dataset.r=1;el.src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/"+el.dataset.b+".png";return}const g=GYMS[+el.dataset.g];el.replaceWith(document.createTextNode(EM[g[1]]))}
function gymMedal(i,on,s){const g=GYMS[i];return '<span class="medal'+(on?' on':'')+'" title="Medalla '+g[0]+(on?'':' (sin conseguir)')+'" style="--mc:'+TC[g[1]]+(s?';--ms:'+s+'px':'')+'"><img src="'+BADGE+(i+1)+'.png" alt="" loading="lazy" data-b="'+(i+1)+'" data-g="'+i+'" onerror="badgeErr(this)"></span>'}
async function gymWin(i){
  const g=GYMS[i];S.med=S.med||{};
  if(!S.med[i]){
    S.med[i]=1;const rw={t:500000*(i+1),it:i%2?{cand:1}:{ub:3}};grant(rw);snd("lvl");
    await say("¡Has derrotado al Líder del Gimnasio de "+g[3]+"!");await say("¡Has conseguido la Medalla "+g[0]+"! ("+medCount()+"/8)");await say("Premio: "+rwTxt(rw)+".");
    if(medCount()>=8)await say("¡Tienes las 8 medallas! Ya puedes desafiar a la Liga Pokémon.");
    await say(gymNext()<0?"¡Ya no hay límite de nivel! Tus Pokémon pueden llegar hasta el nivel 100.":"¡El límite de nivel sube al Nv"+lvCap()+"! Tus Pokémon ya pueden seguir entrenando hasta ese nivel.");
    const nz=Object.values(ZONES).filter(z=>z.m===medCount());if(nz.length)await say("Nueva zona desbloqueada: "+nz.map(z=>z.n).join(", ")+".");
  }else{const rw={t:150000*(i+1)};grant(rw);await say("Revancha ganada. Premio: "+rwTxt(rw)+".")}
  save();
}
let _gyk="";
function gymUI(){
  const box=$("gymBox");if(!box)return;const key=JSON.stringify([S.med,fcd]);if(key===_gyk)return;_gyk=key;
  box.innerHTML='<div class="medrow">'+GYMS.map((g,i)=>gymMedal(i,S.med&&S.med[i])).join("")+'<b>'+medCount()+' / 8 medallas</b></div>'+(gymNext()<0?'<div class="capbar ok">🔓 <span><b>Sin límite de nivel</b> · ¡Tienes las 8 medallas! Tus Pokémon pueden llegar al Nv100.</span></div>':'<div class="capbar">🔒 <span><b>Límite de nivel: Nv'+lvCap()+'</b> · Tus Pokémon no subirán de este nivel ni podrás capturar Pokémon salvajes más fuertes hasta que derrotes al Líder '+GYMS[gymNext()][4]+'.</span></div>')+'<div class="lggrid">'+GYMS.map((g,i)=>{const got=S.med&&S.med[i],open=i===0||(S.med&&S.med[i-1]);
    return '<div class="lgc">'+gymMedal(i,got,34)+'<b>Gimnasio de '+g[3]+'</b><small>Líder: '+g[4]+' · Medalla '+g[0]+'</small><small class="mut">'+EM[g[1]]+' Tipo '+TIPO[g[1]]+' · Nv'+(g[2]-2)+'–'+gymAce(i)+'</small>'+(got?'':'<small class="mut">'+(i===gymNext()?'🔒 Límite actual: Nv'+gymAce(i):'Límite al llegar aquí: Nv'+gymAce(i))+'</small>')+'<button data-gym="'+i+'"'+(!open||fcd?' disabled':'')+'>'+(got?"🔁 Revancha":open?"⚔️ Desafiar":"🔒 Bloqueado")+'</button></div>'}).join("")+'</div><small id="gymMsg" class="mut"></small>';
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#gymBox button[data-gym]");if(!b)return;const i=+b.dataset.gym,g=GYMS[i];
  if(!(S.team||[]).some(n=>n&&S.owned[n]&&S.hp[n]!==0)){$("gymMsg").textContent="Necesitas un equipo con al menos un Pokémon con PS.";return}
  startBattle({eteam:gymTeam(i),trainer:"Líder "+g[4],tsrc:{k:(LGSPR[g[1]]||LGSPR.normal)[i%2],n:"Líder "+g[4]},gym:i})});
// ================= temporadas PVP con rangos =================
const seasonKey=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")};
const ssnField=()=>"s"+seasonKey().replace("-","");
const TIERS=[[0,"🥉 Bronce"],[300,"🥈 Plata"],[600,"🥇 Oro"],[1000,"💠 Platino"],[1500,"💎 Diamante"],[2000,"👑 Maestro"]];
const tierIdx=p=>{let t=0;TIERS.forEach((x,i)=>{if(p>=x[0])t=i});return t};
const TIER_RW=[{t:200000},{t:500000,it:{ub:3}},{t:1000000,it:{cand:1,ub:5}},{t:2000000,it:{cand:2}},{t:4000000,it:{cand:3,mb:1}},{t:8000000,it:{cand:5,mb:2}}];
function seasonCheck(){
  const k=seasonKey();if(!S.ssn){S.ssn={k:k,p:0,w:0,l:0};return}
  if(S.ssn.k!==k){const o=S.ssn,ti=tierIdx(o.p);if(o.w+o.l>0){const rw=TIER_RW[ti];grant(rw);setTimeout(()=>toast("🏁 Fin de la temporada PVP: quedaste en "+TIERS[ti][1]+". Premio: "+rwTxt(rw)),1500)}S.ssnH=(S.ssnH||[]).concat({k:o.k,p:o.p}).slice(-12);S.ssn={k:k,p:0,w:0,l:0};save()}
}
function seasonRes(win){seasonCheck();const s=S.ssn;if(win){s.w++;s.p+=25}else{s.l++;s.p=Math.max(0,s.p-15)}s.best=Math.max(s.best||0,s.p);stt().ssnb=Math.max(stt().ssnb||0,s.p);save()}
let _ssk="";
function seasonUI(){
  const b=$("ssnBox");if(!b)return;seasonCheck();const s=S.ssn,ti=tierIdx(s.p),nx=TIERS[ti+1],d=new Date(),end=new Date(d.getFullYear(),d.getMonth()+1,1),left=Math.ceil((end-d)/864e5),key=JSON.stringify(s)+left;if(key===_ssk)return;_ssk=key;
  b.innerHTML='<div class="ssn"><span class="tier t'+ti+'">'+TIERS[ti][1]+'</span><div style="flex:1;min-width:180px"><b>Temporada PVP '+MESES[d.getMonth()]+' '+d.getFullYear()+'</b> · '+s.p+' puntos · '+s.w+' V / '+s.l+' D<div class="bar"><i style="width:'+(nx?Math.min(100,(s.p-TIERS[ti][0])/(nx[0]-TIERS[ti][0])*100):100)+'%"></i></div><small class="mut">'+(nx?"Te faltan "+(nx[0]-s.p)+" puntos para "+nx[1]+". ":"¡Rango máximo! ")+'Victoria +25 · derrota −15 · quedan '+left+' día'+(left===1?"":"s")+'. Al acabar el mes recibes el premio de tu rango: '+esc(rwTxt(TIER_RW[ti]))+'.</small></div></div>';
}
// ================= jefe de gremio y misiones de gremio (semanales) =================
const GB_HP=25000,GQ=[["cap","🔴 Capturar Pokémon",30],["win","⚔️ Ganar combates",60],["pull","🎰 Hacer tiradas",200]],GQ_RW={t:1000000,it:{cand:1}},GB_RW={t:25000000,it:{mb:3,cand:10,ppmax:2}};
function gAccAdd(k,n){if(!S.gid||!n)return;const w=weekKey();S.gacc=S.gacc&&S.gacc.w===w?S.gacc:{w:w};S.gacc[k]=(S.gacc[k]||0)+n}
window.gAccEv=(ev,n)=>{if(ev==="cap"||ev==="win"||ev==="pull")gAccAdd(ev,n||1)};
function gBossFor(gid,w){const r=rngS(pvHash("boss"+gid+w)),pool=P.filter(p=>p[2]==="L"&&p[3]<10);return pool[Math.floor(r()*pool.length)][0]}
async function gEnsureWeek(){
  const g=GS.doc,w=weekKey();if(!g||!S.gid||g.bw===w)return;
  const n=Math.max(1,Object.keys(g.members||{}).length);
  await window.FB.gEdit(S.gid,{bw:w,bp:gBossFor(S.gid,w),bm:GB_HP*n,bh:GB_HP*n,bd:{},gm:{}});
}
window.gFlushHook=async()=>{
  if(!S.gid||!S.gacc||!window.FB||!GS.doc)return;const w=weekKey(),a=S.gacc;if(a.w!==w){S.gacc={w:w};return}
  const d={dmg:a.dmg||0,cap:a.cap||0,win:a.win||0,pull:a.pull||0};if(!d.dmg&&!d.cap&&!d.win&&!d.pull)return;
  await gEnsureWeek();await window.FB.gContrib(S.gid,d);S.gacc={w:w};
};
function gBossHTML(g){
  const w=weekKey(),me=window.FB.uid(),cur=g.bw===w,n=Math.max(1,Object.keys(g.members||{}).length);
  const bp=cur?g.bp:gBossFor(S.gid,w),bm=cur?g.bm:GB_HP*n,bh=cur?Math.max(0,g.bh):bm,bd=cur?(g.bd||{}):{},gm=cur?(g.gm||{}):{},pend=S.gacc&&S.gacc.w===w?S.gacc:{};
  const dead=cur&&g.bh<=0,mine=bd[me]||0,top=Object.keys(bd).sort((a,b)=>bd[b]-bd[a]).slice(0,5);
  let h='<div class="gboss"><div class="gbimg">'+(PM[bp]?ico(PM[bp],96):"")+'</div><div style="flex:1;min-width:200px"><b>🐲 Jefe de la semana: '+esc(bp)+'</b><div class="hp gbhp"><i style="width:'+(bh/bm*100)+'%"></i></div><small>'+(dead?"¡DERROTADO! 🎉":fmt(bh)+" / "+fmt(bm)+" PS")+' · Tu daño: '+fmt(mine)+(pend.dmg?' (+'+fmt(pend.dmg)+' pendiente de subir)':'')+'</small>'+
    '<small class="mut">Todo el daño que hacéis los miembros en vuestros combates se le resta. Si cae antes del lunes, cada miembro que haya participado recibe <b>'+esc(rwTxt(GB_RW))+'</b> y ¡el propio <b>'+esc(bp)+'</b> para su colección (1 de cada 10 veces, variocolor)! Quien más daño haga se lleva el doble de tickets.</small>'+
    (top.length?'<small>'+top.map((u,i)=>(["🥇","🥈","🥉"][i]||"·")+" "+esc(pvClean((g.members[u]||{}).n||"?"))+" "+fmt(bd[u])).join("  ")+'</small>':'')+
    (dead&&mine>0?(S.gbc===w?'<small>✅ Premio reclamado</small>':'<button data-gbc="1">🎁 Reclamar premio del jefe</button>'):'')+'</div></div>';
  h+='<div class="qgrid">'+GQ.map(q=>{const tg=q[2]*n,v=gm[q[0]]||0,ok=v>=tg,cl=S.gqc&&S.gqc.w===w&&S.gqc[q[0]];return '<div class="qc'+(ok&&!cl?' ready':cl?' claimed':'')+'"><b>'+q[1]+' (gremio)</b><div class="bar"><i style="width:'+Math.min(100,v/tg*100)+'%"></i></div><small>'+fmt(Math.min(v,tg))+' / '+fmt(tg)+(pend[q[0]]?' · +'+pend[q[0]]+' tuyos pendientes':'')+'</small><small>🎁 '+rwTxt(GQ_RW)+'</small>'+(cl?'<small>✅ Reclamado</small>':'<div class="qbtn"><button data-gqc="'+q[0]+'"'+(ok?'':' disabled')+'>Reclamar</button></div>')+'</div>'}).join("")+'</div><small class="mut">Las aportaciones se suben al guardar la partida en la nube (cada 5 minutos o con 💾). El jefe y las misiones se renuevan cada lunes.</small>';
  return h;
}
document.addEventListener("click",e=>{
  const b=e.target.closest&&e.target.closest("#gdBox button[data-gbc],#gdBox button[data-gqc]");if(!b||!GS.doc)return;const w=weekKey(),g=GS.doc;
  if(b.dataset.gbc){const me=window.FB.uid(),bd=g.bd||{};if(S.gbc===w||!(g.bw===w&&g.bh<=0&&bd[me]>0))return;S.gbc=w;grant(GB_RW);
    const top=Object.keys(bd).sort((a,c)=>bd[c]-bd[a])[0]===me;if(top)S.t+=Math.round(GB_RW.t*RMUL());
    const sh=Math.random()<.1;if(PM[g.bp])pkGive({n:g.bp,l:50,s:sh?1:0},false);if(sh)qEv("shiny");
    qEv("gboss");save();snd("lvl");setTimeout(()=>snd("win"),900);
    toast("🐲 ¡Jefe derrotado! "+rwTxt(GB_RW)+(top?" (×2 tickets por ser quien más daño hizo)":"")+" y "+(sh?"✨ un "+g.bp+" VARIOCOLOR":"un "+g.bp)+" para tu colección");gUI(true);render();return}
  const k=b.dataset.gqc,q=GQ.find(x=>x[0]===k),n=Math.max(1,Object.keys(g.members||{}).length);if(!q||g.bw!==w||((g.gm||{})[k]||0)<q[2]*n)return;
  S.gqc=S.gqc&&S.gqc.w===w?S.gqc:{w:w};if(S.gqc[k])return;S.gqc[k]=1;grant(GQ_RW);save();snd("win");toast("🛡️ Misión de gremio completada: "+rwTxt(GQ_RW));gUI(true);
});
// ================= perfiles públicos =================
async function openProf(uid){
  if(!window.FB||!window.FB.rankGet){toast("Los perfiles solo se pueden ver con una cuenta iniciada.");return}
  $("profB").innerHTML='<p class="mut">Cargando perfil…</p>';$("prof").hidden=false;
  let d=null;try{d=await window.FB.rankGet(uid)}catch(e){}
  if(!d){$("profB").innerHTML='<p>Este jugador todavía no tiene perfil público (aparece cuando guarda su partida en la nube con el apodo registrado).</p><div class="jrow"><button class="alt" data-pcl="1">Cerrar</button></div>';return}
  const me=window.FB.uid(),sp=d[ssnField()]||0,on=pvOthers().find(p=>p.peer===uid);
  const st=[["📚","Pokédex",d.dex],["✨","Variocolor",d.sh],["🎯","Combates ganados",d.win],["⚔️","Victorias PVP",d.pw],["🌟","Prestigio",d.prs],["🏅","Medallas",(d.med|0)+"/8"],["🔥","Mejor racha",d.bs|0],["🏆","Logros",d.ach|0]];
  $("profB").innerHTML='<div class="profh"><div class="profav">'+trImg(trDec(d.tr),"f","i")+'</div><div><h2>'+esc(pvClean(d.n))+' '+(d.g?'<span class="gtag">'+esc(String(d.g).slice(0,4))+'</span>':'')+'</h2><span class="tier t'+tierIdx(sp)+'">'+TIERS[tierIdx(sp)][1]+'</span> <small class="mut">'+sp+' pts esta temporada · '+(on?"🟢 Conectado":"⚫ Desconectado")+'</small><div class="medrow">'+GYMS.map((g,i)=>gymMedal(i,i<(d.med|0),22)).join("")+'</div></div></div>'+
    '<div class="profst">'+st.map(x=>'<div><span>'+x[0]+'</span><b>'+(typeof x[2]==="number"?fmt(x[2]||0):x[2])+'</b><small>'+x[1]+'</small></div>').join("")+'</div>'+
    (Array.isArray(d.tm)&&d.tm.length?'<b>Equipo</b><div class="proftm">'+d.tm.filter(x=>x&&PM[x.n]).map(x=>'<div>'+ico(PM[x.n],56,false,!!x.s)+'<small>'+esc(x.n)+' Nv'+(x.l|0)+'</small></div>').join("")+'</div>':'')+
    '<div class="jrow">'+(uid!==me&&!isFriend(uid)?'<button data-pfr="'+esc(pvClean(d.n))+'">+👥 Añadir amigo</button>':'')+(on&&uid!==me&&PV.st==="idle"&&!fcd?'<button class="red" data-pch="'+esc(uid)+'">⚔️ Retar</button>':'')+'<button class="alt" data-pcl="1">Cerrar</button></div>';
}
document.addEventListener("click",e=>{
  const l=e.target.closest&&e.target.closest("[data-prof]");if(l&&l.dataset.prof){e.preventDefault();openProf(l.dataset.prof);return}
  const b=e.target.closest&&e.target.closest("#prof button");if(!b)return;
  if(b.dataset.pcl){$("prof").hidden=true;return}
  if(b.dataset.pfr){frSend(b.dataset.pfr);toast("📨 Solicitud de amistad enviada");$("prof").hidden=true;return}
  if(b.dataset.pch){$("prof").hidden=true;if(pvChallenge(b.dataset.pch)){toast("⚔️ Reto enviado");try{$("pvpP").scrollIntoView({behavior:"smooth"})}catch(x){}}}
});
$("prof").addEventListener("click",e=>{if(e.target.id==="prof")$("prof").hidden=true});
// ================= intercambios entre amigos =================
let TRD={inc:[],out:[]},TRC=null;
function pkTake(n){
  if(!(S.owned[n]>0))return null;const d=lvd(n),rec={n:n,l:d.l,s:S.shiny&&S.shiny[n]>0?1:0};
  S.owned[n]--;if(rec.s){S.shiny[n]--;if(!S.shiny[n])delete S.shiny[n]}
  [S.lv,S.mv,S.hp,S.pp||{},S.ppu||{},S.ml||{}].forEach(o=>{delete o[n]});
  if(S.owned[n]<=0){delete S.owned[n];S.reg=S.reg||{};S.reg[n]=1;S.team=(S.team||[]).map(x=>x===n?"":x);(S.sets||[]).forEach(st=>{st.team=st.team.map(x=>x===n?"":x)})}
  save();return rec;
}
async function pkGive(rec,tradeEvo){
  if(!rec||!PM[rec.n])return;const n=rec.n,isNew=!hasP(n);
  if(!S.owned[n]){(S.balls=S.balls||{})[n]=BALLR[PM[n][2]];(S.when=S.when||{})[n]=Date.now()}
  S.owned[n]=(S.owned[n]||0)+1;if(isNew)qEv("new");
  if(rec.s){S.shiny=S.shiny||{};S.shiny[n]=(S.shiny[n]||0)+1}
  const lv=Math.max(1,Math.min(100,rec.l|0));if(!S.lv[n]||S.lv[n].l<lv){S.lv[n]={l:lv,x:0};delete S.mv[n];S.ml=S.ml||{};S.ml[n]=lv}
  save();
  if(tradeEvo){const ev=EVO(n).filter(e=>e[1]==="Ilinking-cord"&&PM[e[0]]);if(ev.length&&!fcd)await evoPrompt(n,ev)}
}
const trOwnList=()=>P.filter(p=>S.owned[p[0]]>0);
const recTxt=r=>r?(r.s?"✨ ":"")+esc(r.n)+" Nv"+(r.l|0):"?";
// ---- ventana de intercambio al estilo de los juegos ----
let TM={st:null,t:null,sel:null,q:"",f:""};
function trCard(rec,lab,who){
  if(!rec||!PM[rec.n])return '<div class="tcard empty"><small>'+esc(lab)+'</small><div class="tqm">?</div><small class="mut">'+(who||"")+'</small></div>';
  const p=PM[rec.n];
  return '<div class="tcard '+p[2]+(rec.s?' shiny':'')+'"><small>'+esc(lab)+'</small><div class="tspr2">'+ico(p,96,false,!!rec.s)+'</div><b>'+(rec.s?"✨ ":"")+esc(rec.n)+'</b><small>Nv'+(rec.l|0)+' · '+EM[p[1]]+' '+TIPO[p[1]]+' · '+STAR[p[2]]+'</small>'+(EVO(rec.n).some(e=>e[1]==="Ilinking-cord")?'<small class="tevo">🧬 Evoluciona al intercambiarlo</small>':'')+'</div>';
}
const trRec=n=>n&&S.owned[n]>0?{n:n,l:lvd(n).l,s:S.shiny&&S.shiny[n]>0?1:0}:null;
function trGrid(){
  const q=nrm(TM.q),L=trOwnList().filter(p=>(!q||nrm(p[0]).includes(q))&&(!TM.f||p[2]===TM.f)).sort((a,b)=>lvd(b[0]).l-lvd(a[0]).l||WW[b[2]]-WW[a[2]]).slice(0,240);
  return '<div class="tfil"><input id="tq" placeholder="Buscar en tu equipo y colección..." value="'+esc(TM.q)+'"><select id="tf"><option value="">Todas</option>'+["C","R","E","L"].map(r=>'<option value="'+r+'"'+(TM.f===r?' selected':'')+'>'+STAR[r]+'</option>').join("")+'</select></div>'+
    '<div class="tgrid">'+(L.length?L.map(p=>{const sh=S.shiny&&S.shiny[p[0]]>0;return '<button class="tcell '+p[2]+(TM.sel===p[0]?' sel':'')+(sh?' shiny':'')+'" data-tp="'+esc(p[0])+'">'+ico(p,56,false,sh)+'<b>'+esc(p[0])+'</b><small>Nv'+lvd(p[0]).l+(S.owned[p[0]]>1?' · ×'+S.owned[p[0]]:'')+(S.team.includes(p[0])?' · ⭐':'')+'</small></button>'}).join(""):'<small class="mut">No hay Pokémon con ese filtro.</small>')+'</div>';
}
function trOpen(st,t){if(fcd&&st!=="anim"){toast("Termina el combate para intercambiar.");return}TM={st:st,t:t,sel:null,q:"",f:""};$("trdM").hidden=false;trRender()}
function trClose(){$("trdM").hidden=true;TM.st=null;trdUI()}
function trRender(){
  const b=$("trdB"),t=TM.t,st=TM.st;if(!st)return;let h="";
  const vs=(l,r)=>'<div class="tvs">'+l+'<div class="tarrow"><span>⇄</span></div>'+r+'</div>';
  if(st==="pick"||st==="pickb"){
    const partner=st==="pick"?t.n:pvClean(t.fn),mine=trRec(TM.sel);
    h='<h2>🔄 Intercambio con '+esc(partner)+'</h2>'+vs(trCard(mine,"Tú ofreces",mine?"":"Elige uno abajo"),st==="pickb"?trCard(t.o,esc(partner)+" ofrece"):trCard(null,esc(partner)+" ofrece","Lo elegirá después"))+
      '<small class="mut">'+(st==="pick"?"Elige el Pokémon que quieres ofrecer. "+esc(partner)+" verá tu oferta y elegirá qué te da a cambio.":"Elige qué Pokémon das a cambio de su "+esc(t.o.n)+".")+' Se envía con su nivel; si te quedan copias, esas vuelven al nivel 1.</small>'+trGrid()+
      '<div class="jrow"><button class="red" data-tgo="1"'+(mine?'':' disabled')+'>🔄 Ofrecer '+(mine?esc(mine.n):"")+'</button><button class="alt" data-tcl="1">'+(st==="pickb"?"Volver":"Cancelar")+'</button>'+(st==="pickb"?'<button class="alt" data-tno="1">Rechazar</button>':'')+'</div>';
  }else if(st==="inc"){
    h='<h2>📨 ¡Solicitud de intercambio!</h2><p><b>'+esc(pvClean(t.fn))+'</b> quiere intercambiar contigo y te ofrece:</p><div class="tsolo">'+trCard(t.o,"Te ofrece")+'</div><div class="jrow"><button class="red" data-tpb="1">👀 Elegir qué le doy a cambio</button><button class="alt" data-tno="1">Rechazar</button><button class="alt" data-tcl="1">Más tarde</button></div>';
  }else if(st==="wait"){
    const mine=t.from===window.FB.uid();
    h='<h2>⏳ Intercambio en curso</h2>'+vs(trCard(mine?t.o:t.b,"Tú ofreces"),trCard(mine?t.b:t.o,mine?esc(pvClean(t.tn))+" ofrece":esc(pvClean(t.fn))+" ofrece",mine?"Esperando su elección…":""))+'<p class="tpulse">Esperando a '+esc(mine?pvClean(t.tn):pvClean(t.fn))+'…</p><div class="jrow"><button class="alt" data-tcl="1">Cerrar</button>'+(mine&&t.st==="req"?'<button class="alt" data-tcx="1">Cancelar intercambio</button>':'')+'</div>';
  }else if(st==="review"){
    h='<h2>🔄 ¿Aceptas el intercambio?</h2>'+vs(trCard(t.o,"Tú das"),trCard(t.b,"Recibes de "+esc(pvClean(t.tn))))+'<div class="jrow"><button class="red" data-tacc="1">✅ Aceptar intercambio</button><button class="alt" data-trej="1">Rechazar</button><button class="alt" data-tcl="1">Pensarlo</button></div>';
  }else if(st==="anim"){h='<div class="tstage" id="tstage"><div class="tline"></div></div><p id="tmsg" class="tmsg"></p><div class="jrow" id="tbtn"></div>'}
  b.innerHTML=h;
  if($("tq"))$("tq").oninput=e=>{TM.q=e.target.value;const c=e.target.selectionStart;trRender();const n=$("tq");n.focus();n.setSelectionRange(c,c)};
  if($("tf"))$("tf").onchange=e=>{TM.f=e.target.value;trRender()};
}
const tw=(ms)=>new Promise(r=>setTimeout(r,O.fx?ms:Math.min(ms,120)));
// animacion del intercambio: tu Pokémon entra en su Poké Ball, viaja y llega el del otro jugador
async function trAnim(give,get,partner){
  TM.st="anim";$("trdM").hidden=false;trRender();
  const st=$("tstage"),msg=t=>{$("tmsg").textContent=t};
  const add=(html,cls,css)=>{const e=document.createElement("div");e.className=cls;e.innerHTML=html;if(css)e.style.cssText=css;st.appendChild(e);return e};
  const A=add(ico(PM[give.n],110,false,!!give.s),"tmon","left:50%;top:52%");
  msg("¡Adiós, "+give.n+"! Te vas con "+partner+".");cry(give.n);
  if(O.fx)A.animate([{transform:"translate(-50%,-50%) scale(.6)",opacity:0},{transform:"translate(-50%,-50%) scale(1)",opacity:1}],{duration:500,fill:"forwards",easing:"cubic-bezier(.2,1.5,.4,1)"});
  await tw(1400);
  snd("throw");
  const B1=add("","ball mini "+({sb:"R",ub:"E",mb:"L"}[ballOf(PM[give.n])]||""),"position:absolute;left:50%;top:52%;margin:-32px 0 0 -32px");
  if(O.fx){A.animate([{filter:"brightness(1)",transform:"translate(-50%,-50%) scale(1)"},{filter:"brightness(6)",transform:"translate(-50%,-50%) scale(.2)",opacity:0}],{duration:450,fill:"forwards"});
    B1.animate([{transform:"scale(.2)",opacity:0},{transform:"scale(1)",opacity:1}],{duration:300,fill:"forwards"})}else A.style.opacity=0;
  await tw(700);
  if(O.fx)await B1.animate([{transform:"translate(0,0) rotate(0)"},{transform:"translate(0,20px) rotate(-20deg)",offset:.2},{transform:"translate(0,-320px) rotate(540deg)",opacity:.9}],{duration:900,easing:"ease-in",fill:"forwards"}).finished;
  B1.remove();msg("Enviando…");snd("flash");
  const ln=st.querySelector(".tline");ln.classList.add("on");
  if(O.fx)for(let i=0;i<14;i++){const s=add("✨","tsp","left:"+(10+Math.random()*80)+"%;top:"+(10+Math.random()*80)+"%;animation-delay:"+(i*.07)+"s")}
  await tw(1300);ln.classList.remove("on");
  msg(partner+" te envía a "+get.n+"…");snd("throw");
  const B2=add("","ball mini "+({sb:"R",ub:"E",mb:"L"}[BALLR[PM[get.n][2]]]||""),"position:absolute;left:50%;top:52%;margin:-32px 0 0 -32px");
  if(O.fx)await B2.animate([{transform:"translate(0,-340px) rotate(-540deg)"},{transform:"translate(0,0) rotate(0)",offset:.75},{transform:"translate(0,-24px)",offset:.87},{transform:"translate(0,0)"}],{duration:1100,easing:"ease-in",fill:"forwards"}).finished;
  for(let i=0;i<3&&O.fx;i++){await B2.animate([{transform:"rotate(0)"},{transform:"rotate(-18deg)"},{transform:"rotate(16deg)"},{transform:"rotate(0)"}],{duration:380}).finished;await tw(150)}
  snd("open");const fl=add("","tflash");if(O.fx)fl.animate([{opacity:0},{opacity:1,offset:.2},{opacity:0}],{duration:700,fill:"forwards"});
  B2.remove();
  const C=add(ico(PM[get.n],110,false,!!get.s),"tmon","left:50%;top:52%");
  if(O.fx)C.animate([{transform:"translate(-50%,-50%) scale(.1)",filter:"brightness(6)"},{transform:"translate(-50%,-50%) scale(1.15)",filter:"brightness(2)",offset:.6},{transform:"translate(-50%,-50%) scale(1)",filter:"brightness(1)"}],{duration:700,fill:"forwards",easing:"ease-out"});
  cry(get.n);if(get.s){snd("lvl")}
  if(O.fx)for(let i=0;i<18;i++)add(get.s?["✨","⭐","💫"][i%3]:["✨","⭐"][i%2],"tsp","left:"+(30+Math.random()*40)+"%;top:"+(25+Math.random()*50)+"%;animation-delay:"+(i*.05)+"s");
  snd("capok");msg("¡Has recibido a "+(get.s?"✨ ":"")+get.n+" de "+partner+"! ¡Cuídalo mucho!");
  $("tbtn").innerHTML='<button class="red" id="tok">¡Genial!</button>';
  await new Promise(r=>{$("tok").onclick=r});
  $("trdM").hidden=true;TM.st=null;
}
// resumen en el panel de Amigos
function trdUI(){
  const box=$("trdBox");if(!box)return;if(!window.FB){box.innerHTML="";return}
  const L=TRD.inc.filter(t=>["req","resp"].includes(t.st)).map(t=>({t:t,txt:t.st==="req"?esc(pvClean(t.fn))+' te ofrece '+recTxt(t.o):'Esperando a que '+esc(pvClean(t.fn))+' acepte: '+recTxt(t.o)+' ⇄ '+recTxt(t.b),st:t.st==="req"?"inc":"wait",hot:t.st==="req"}))
    .concat(TRD.out.filter(t=>["req","resp"].includes(t.st)).map(t=>({t:t,txt:t.st==="resp"?esc(pvClean(t.tn))+' te da '+recTxt(t.b)+' por tu '+recTxt(t.o):'Has ofrecido '+recTxt(t.o)+' a '+esc(pvClean(t.tn)),st:t.st==="resp"?"review":"wait",hot:t.st==="resp"})));
  const h='<b>🔄 Intercambios</b>'+(L.length?L.map((x,i)=>'<div class="pvrow'+(x.hot?' thot':'')+'"><span class="pvav">'+ico(PM[(x.t.o||{}).n]||P[0],30,false,!!(x.t.o||{}).s)+'</span><small style="flex:1">'+x.txt+'</small><button data-topen="'+i+'">'+(x.hot?"¡Ver!":"Abrir")+'</button></div>').join(""):'<small class="mut">No tienes intercambios en curso. Pulsa 🔄 junto a un amigo para abrir la ventana de intercambio. Los Pokémon que evolucionan por intercambio (Kadabra, Machoke, Haunter...) evolucionan al recibirlos.</small>');
  box._L=L;if(box._h!==h){box._h=h;box.innerHTML=h}
}
// procesa los cambios de estado (cada intercambio se aplica una sola vez)
async function trProcess(){
  S.trp=S.trp||{};
  for(const t of TRD.out){const k=t.id+":"+t.st;if(S.trp[k])continue;
    if(t.st==="no"){S.trp[k]=1;await pkGive(t.o,false);toast("🔄 "+pvClean(t.tn)+" ha rechazado el intercambio. Recuperas a "+t.o.n+".");window.FB.trDel(t.id).catch(()=>{})}
    else if(t.st==="done"){S.trp[k]=1;window.FB.trDel(t.id).catch(()=>{})}}
  for(const t of TRD.inc){const k=t.id+":"+t.st;if(S.trp[k])continue;
    if(t.st==="acc"){if(fcd||TM.st==="anim")continue;S.trp[k]=1;stt().trade=(stt().trade||0)+1;save();await trAnim(t.b,t.o,pvClean(t.fn));await pkGive(t.o,true);window.FB.trUpd(t.id,{st:"done"}).catch(()=>{})}
    else if(t.st==="rej"){S.trp[k]=1;await pkGive(t.b,false);toast("🔄 "+pvClean(t.fn)+" no ha aceptado tu Pokémon. Lo recuperas.");window.FB.trDel(t.id).catch(()=>{})}
    else if(t.st==="cx"){S.trp[k]=1;if(t.b)await pkGive(t.b,false);if(TM.t&&TM.t.id===t.id)trClose();toast("🔄 "+pvClean(t.fn)+" ha cancelado el intercambio.");window.FB.trDel(t.id).catch(()=>{})}}
  // ventanas emergentes como en los juegos: solicitud nueva o respuesta a tu oferta
  S.trs=S.trs||{};
  if($("trdM").hidden&&!fcd){
    const ni=TRD.inc.find(t=>t.st==="req"&&!S.trs[t.id+"r"]);
    const nr=TRD.out.find(t=>t.st==="resp"&&!S.trs[t.id+"s"]);
    if(ni){S.trs[ni.id+"r"]=1;snd("lvl");trOpen("inc",ni)}else if(nr){S.trs[nr.id+"s"]=1;snd("lvl");trOpen("review",nr)}
  }
  if(TM.st&&TM.t&&TM.st!=="anim"){const cur=TRD.inc.concat(TRD.out).find(x=>TM.t.id?x.id===TM.t.id:(x.from===TM.t.from&&x.to===TM.t.to&&x.o&&TM.t.o&&x.o.n===TM.t.o.n));if(cur&&cur.st==="resp"&&cur.from===window.FB.uid())S.trs[cur.id+"s"]=1;if(cur){TM.t=cur;if(TM.st==="wait"&&cur.st==="resp"&&cur.from===window.FB.uid()){TM.st="review"}if(!TM.st.startsWith("pick"))trRender()}}
  const ks=Object.keys(S.trp);if(ks.length>200)ks.slice(0,ks.length-200).forEach(k=>delete S.trp[k]);
  save();setTimeout(()=>{try{render()}catch(e){}},0);
}
function trState(st){TRD=st;setTimeout(()=>{trdUI();trProcess()},0)}
document.addEventListener("click",async e=>{
  const b=e.target.closest&&e.target.closest("#trdM button,#trdBox button,#frBox button[data-frt]");if(!b||!window.FB)return;const d=b.dataset,t=TM.t;
  try{
    if(d.frt){trOpen("pick",{uid:d.frt,n:d.frtn});return}
    if(d.topen!=null){const x=($("trdBox")._L||[])[+d.topen];if(x)trOpen(x.st,x.t);return}
    if(d.tp){TM.sel=d.tp;snd("ui");const sc=$("trdB").querySelector(".tgrid").scrollTop;trRender();$("trdB").querySelector(".tgrid").scrollTop=sc;try{cry(d.tp)}catch(x){}return}
    if(d.tcl){trClose();return}
    if(d.tpb){TM.st="pickb";TM.sel=null;trRender();return}
    if(d.tgo){
      if(!TM.sel||fcd)return;b.disabled=true;const rec=pkTake(TM.sel);if(!rec)return;
      if(TM.st==="pick"){try{const ref=await window.FB.trSend(t.uid,t.n,pvClean(pvNick()),rec);if(window.cloudFlush)window.cloudFlush(true);snd("throw");TM.st="wait";TM.t={id:ref&&ref.id,from:window.FB.uid(),to:t.uid,tn:t.n,o:rec,st:"req"};trRender();toast("📨 Oferta enviada a "+t.n)}catch(x){await pkGive(rec,false);throw x}}
      else{try{await window.FB.trUpd(t.id,{st:"resp",b:rec});if(window.cloudFlush)window.cloudFlush(true);snd("throw");TM.st="wait";TM.t=Object.assign({},t,{b:rec,st:"resp"});trRender()}catch(x){await pkGive(rec,false);throw x}}
      render();return;
    }
    if(d.tno){await window.FB.trUpd(t.id,{st:"no"});trClose();toast("Has rechazado el intercambio.");return}
    if(d.tcx){const o=TRD.out.find(x=>x.o&&t&&x.st==="req"&&(x.id===t.id||(!t.id&&x.o.n===t.o.n)));if(!o)return;await window.FB.trUpd(o.id,{st:"cx"});S.trp=S.trp||{};S.trp[o.id+":cx"]=1;await pkGive(o.o,false);trClose();toast("Intercambio cancelado: recuperas a "+o.o.n+".");return}
    if(d.tacc){if(!t||t.st!=="resp")return;b.disabled=true;await window.FB.trUpd(t.id,{st:"acc"});S.trp=S.trp||{};S.trp[t.id+":acc"]=1;stt().trade=(stt().trade||0)+1;save();await trAnim(t.o,t.b,pvClean(t.tn));await pkGive(t.b,true);if(window.cloudFlush)window.cloudFlush(true);render();return}
    if(d.trej){await window.FB.trUpd(t.id,{st:"rej"});S.trp=S.trp||{};S.trp[t.id+":rej"]=1;await pkGive(t.o,false);trClose();toast("Intercambio rechazado: recuperas a "+t.o.n+".");return}
  }catch(x){toast("No se pudo completar el intercambio ("+((x&&x.code)||"error")+").")}
});
$("trdM").addEventListener("click",e=>{if(e.target.id==="trdM"&&TM.st!=="anim")trClose()});
// ================= gritos de los Pokémon (audio original de PokeAPI) =================
const CRY="https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/",CRY2="https://cdn.jsdelivr.net/gh/PokeAPI/cries@main/cries/pokemon/latest/";
function cry(n){
  if(!O.cry||!O.svol||!O.sfx)return;const p=PM[n];if(!p||!p[4]||p[4]>1025)return;
  try{const a=new Audio((SPRB?CRY2:CRY)+p[4]+".ogg");a.volume=Math.min(1,O.svol*.5);a.onerror=()=>{if(a.src.indexOf(CRY)===0){a.src=CRY2+p[4]+".ogg";a.play().catch(()=>{})}};a.play().catch(()=>{})}catch(e){}
}
$("dex").addEventListener("click",e=>{const c=e.target.closest(".card");if(!c)return;const im=c.querySelector("img[data-n]");if(im)cry(im.dataset.n)});
