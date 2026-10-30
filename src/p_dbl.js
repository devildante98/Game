// =====================================================================================
// COMBATE DOBLE CONTRA LA MÁQUINA: tú y un compañero contra dos entrenadores
// (usa el mismo motor y la misma arena que las salas 2 vs 2 del PVP)
// =====================================================================================
const DB_DAY=10;
function xpGive(n,amt){const d=lvd(n),cap=lvCap(),l0=d.l;if(d.l>=cap)return 0;d.x+=amt;while(d.l<cap&&d.x>=need(d.l)){d.x-=need(d.l);d.l++;qEv("lvl")}if(d.l>=cap)d.x=0;return d.l-l0}
function dbTeam(lv,n){const out=[];const w={C:3,R:4,E:2};while(out.length<n){let t=9,x=Math.random()*t,r="C";for(const q in w){x-=w[q];if(x<=0){r=q;break}}const pl=P.filter(p=>p[2]===r&&!isSup(p[0]));const p=pl[Math.floor(Math.random()*pl.length)];if(p&&!out.includes(p))out.push(p)}
  return out.map((p,i)=>monX(mkEnemy(p,clampL(lv+(i===n-1?1:0))),Math.floor(Math.random()*NAT.length),""))}
function dbStart(){
  if(fcd||D||R2||PV.st!=="idle"){toast("Termina lo que estás haciendo primero.");return}
  const td=pvTeamData();if(!td.length){toast("Necesitas un equipo para combatir.");return}
  const L=td.map(x=>x.l),avg=Math.round(L.reduce((a,b)=>a+b,0)/L.length),lv=clampL(Math.max(3,avg-1));
  const pick=()=>TRAINERS[Math.floor(Math.random()*TRAINERS.length)];let t1=pick(),t2=pick(),t3=pick();for(let g=0;g<20&&t2===t1;g++)t2=pick();
  const allyNames=["Compañera Lyra","Compañero Brendan","Compañera Dawn","Compañero Hilbert","Compañera Serena","Compañero Elio"],an=allyNames[Math.floor(Math.random()*allyNames.length)];
  const mine=pvMk(td),ally=dbTeam(lv,3),f1=dbTeam(lv+1,3),f2=dbTeam(lv+1,3);
  R2={offline:true,code:"",host:true,room:{peers:()=>[],presence:()=>{}},seat:0,hist:{},ph:"battle",me:0,start:null,sub:"",
    seats:[{u:"me",n:pvClean(pvNick()),tr:trEnc(myLook())},{u:"ai1",n:an,tr:""},{u:"ai2",n:t1[0],tr:"",spr:t1[3]},{u:"ai3",n:t2[0],tr:"",spr:t2[3]}]};
  R2.E=beNew([beSide(mine),beSide(ally),beSide(f1),beSide(f2)],[[0,1],[2,3]],Math.floor(Math.random()*2147483647));R2.SL=dvSlots();
  R2.playing=true;R2.ready=false;R2.lastAct=Date.now();fcd=true;updTeam();hubClose();
  const a=$("arena");$("batP").appendChild(a);a.hidden=false;arenaReset();$("fsel").hidden=true;
  BTE().classList.add("dbl");DVX.forEach(id=>{$(id).hidden=false});
  B={mode:"dv",E:R2.E,me:0,SL:R2.SL,trainer:t1[0],tsrc:{k:t1[3],n:t1[0]},showOpp:true,busy:true,offline:true,
    who:dvWho,mine:i=>i<2,onSend:dvSend,onFf:async e=>{await say(e.s===0?"Has abandonado el combate.":R2.seats[e.s].n+" se ha rendido.")},
    onOut:async e=>{await say(e.s===0?"¡Te has quedado sin Pokémon!":"¡"+R2.seats[e.s].n+" se ha quedado sin Pokémon!")}};
  const sn=beSnap(R2.E);[0,1,2,3].forEach(i=>setSpr(i,sn));bePaint(sn);xpBar();
  [1,2,3].forEach(i=>{const t=R2.SL[i].tn;if(t)$(t).textContent="👤 "+R2.seats[i].n});
  $("hlpp").hidden=true;setScene($("bscene"),envOf(snapMon(sn,2).p[1]));$("menu").innerHTML="";
  ["osp","msp","oi","mi"].concat(DVX).forEach(id=>{$(id).style.opacity=0});
  if(O.bigmode&&!bigMode)bigSet(O.bigmode);
  try{Element.prototype._siv?Element.prototype._siv.call($("batP"),{behavior:"smooth",block:"start"}):$("batP").scrollIntoView({behavior:"smooth",block:"start"})}catch(e){}
  const r=R2;
  (async()=>{try{await introFlash();playerIn();await trainerEnter("i");snd("wild");
      await say("¡"+r.seats[2].n+" y "+r.seats[3].n+" os desafían a un combate doble!");
      await dvFoeOut(2,true);await dvFoeOut(3,false);await playerThrow(beAct(r.E.sd[0]),"msp","mi");await dvAllyOut(1)}catch(e){}
    if(R2!==r)return;r.playing=false;r.ready=true;dvTick()})();
}
{const _p=r2Pub;r2Pub=function(){if(R2&&R2.offline)return;return _p.apply(this,arguments)}}
{const _t=dvTick;dvTick=function(){
  if(!R2||!R2.offline)return _t.apply(this,arguments);
  if(R2.ph!=="battle"||R2.playing||!R2.ready||R2.E.over!=null)return;
  const E=R2.E,key=dvKey(),req=dvReq(),acts=[null,null,null,null];
  req.forEach(i=>{if(i===0)acts[i]=R2.hist[key];else acts[i]=E.sd[i].need?"s9":aiPick(E,i)});
  if(acts[0]!=null||!req.includes(0))dvPlayTurn(acts);else dvMenu(req,acts)}}
{const _e=dvEnd;dvEnd=function(w){
  const r=R2;if(!r||!r.offline)return _e.apply(this,arguments);if(r.done)return;r.done=true;
  let txt;const st=mgState();st.n.dbl=st.n.dbl|0;
  if(w===0){const prize=st.n.dbl<DB_DAY;let rw=null,ups=[];
    if(prize){st.n.dbl++;rw={t:Math.round((60000+Math.random()*90000)*RMUL()),it:{}};if(Math.random()<.3)rw.it.sb=2;if(Math.random()<.1)rw.it.cand=1;grant(rw)}
    const amt=Math.round((20+r.E.sd[2].t.concat(r.E.sd[3].t).reduce((a,t)=>a+t.l,0)*2.2));
    r.E.sd[0].t.forEach(t=>{if(t.played){const n=(t.p0||t.p)[0];if(S.owned[n]&&xpGive(n,amt))ups.push(nk(n))}});
    qEv("win");qEv("tr");snd("win");
    txt="¡Habéis ganado el combate doble!"+(rw?" Premio: "+rwTxt(rw)+".":" (Hoy ya has cobrado los "+DB_DAY+" premios de combates dobles.)")+" Tus Pokémon ganan "+amt+" de experiencia."+(ups.length?" ¡Suben de nivel: "+ups.join(", ")+"!":"");
  }else if(w==="D")txt="¡Empate! Los dos equipos se han quedado sin Pokémon a la vez.";
  else{snd("lose");txt="Habéis perdido el combate doble. ¡Inténtalo otra vez!"}
  save();render();$("fmsg").textContent=txt;r._m="";$("menu").innerHTML='<button data-dv="exit">Volver</button>';
}}
{const _x=dvExit;dvExit=function(){
  if(!R2||!R2.offline)return _x.apply(this,arguments);
  if(bigMode)bigSet("");arenaReset();const a=$("arena");a.hidden=true;$("batP").appendChild(a);
  B=null;fcd=false;R2=null;$("fsel").hidden=false;updTeam();render()}}
// botón junto a «¡Combatir!»
(function(){const g=$("fgo");if(!g||$("dbGo"))return;const b=document.createElement("button");b.id="dbGo";b.className="dbgo";b.type="button";b.innerHTML="⚔️⚔️ Combate doble";b.title="Tú y un compañero contra dos entrenadores";b.onclick=()=>{snd("ui");dbStart()};g.after(b)})();
// ---- vigilante: si un combate terminado se queda atascado, se cierra solo ----
{const _f=finish;finish=async function(res){if(B)B._fin=1;return _f.apply(this,arguments)}}
{let last="",since=0;setInterval(()=>{try{if(!B||B.mode!=="s"||B.E.over==null||B._fin||!B.busy){since=0;return}const k=$("fmsg").textContent+"|"+$("menu").innerHTML;if(k!==last){last=k;since=Date.now();return}
  if(Date.now()-since>12000){since=0;finish(B.E.over===0?"win":"lose")}}catch(e){}},2000)}
