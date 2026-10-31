const sleep=ms=>new Promise(r=>setTimeout(r,ms/(B&&!$("arena").hidden?BS:1)));
const eff=(a,d)=>adv(a,d)?2:adv(d,a)?.5:1;
let sk=null;
const waitSkip=ms=>new Promise(r=>{const id=setTimeout(done,ms);function done(){clearTimeout(id);sk=null;r()}sk=done});
async function say(t){
  const b=$("fmsg");b.textContent="";let fast=false;
  sk=()=>{fast=true};
  for(const c of t){if(fast)break;b.textContent+=c;await sleep(14)}
  b.textContent=t;
  await waitSkip(600/BS);
}
$("arena").addEventListener("pointerdown",e=>{if(sk&&!(e.target.closest&&e.target.closest("button,#hlpp")))sk()});
document.addEventListener("keyup",e=>{if(window._sp&&(e.key===" "||e.code==="Space")){e.preventDefault();window._sp=0}});
// ======================================================================
// MOTOR DE COMBATE COMUN (salvajes, entrenadores, Liga, PVP 1 vs 1 y 2 vs 2)
// Determinista: con la misma semilla todos los jugadores calculan exactamente lo mismo.
// ======================================================================
const STG=s=>s>=0?(2+s)/2:2/(2-s),STG3=s=>s>=0?(3+s)/3:3/(3-s);
const STS={par:["PAR","#d4a800"],slp:["DOR","#7d7da0"],psn:["ENV","#a040c0"],tox:["ENV+","#6e1590"],brn:["QUE","#e05020"],frz:["CON","#2ea0d0"]};
function beMon(p,l,mh,ids,pps){const mx=stH(p,l),m=ids.map(MVI).filter(x=>x);return{p:p,l:l,mx:mx,mh:mh==null?mx:Math.max(0,Math.min(mh,mx)),ma:stA(p,l),m:m,pp:pps&&pps.length===m.length?pps.slice():m.map(x=>x.pp),sts:"",slp:0,tox:0}}
const beVol=()=>({st:{atk:0,def:0,spe:0,acc:0,eva:0},cnf:0,prot:0,pc:0,fl:0,g:0,rech:0});
function beSide(t){const ai=Math.max(0,t.findIndex(x=>x.mh>0));if(t[ai])t[ai].played=1;return{t:t,ai:ai,v:beVol(),out:t.every(x=>x.mh<=0)?1:0,need:0}}
const beNew=(sides,teams,seed)=>({sd:sides,tm:teams,turn:1,seed:seed||1,over:null});
const beAct=sd=>sd.t[sd.ai];
const beTeamOf=(E,i)=>E.tm.findIndex(t=>t.includes(i));
const beFoes=(E,i)=>{const ti=beTeamOf(E,i);return E.tm.filter((t,k)=>k!==ti).reduce((a,b)=>a.concat(b),[])};
const beSnap=E=>({ai:E.sd.map(s=>s.ai),hp:E.sd.map(s=>s.t.map(x=>Math.max(0,x.mh))),st:E.sd.map(s=>s.t.map(x=>x.sts))});
const beSpd=(s,rng,E)=>{const m=beAct(s);return (m.l+WW[m.p[2]]*4)*STG(s.v.st.spe)*(m.sts==="par"?.5:1)*(m.ns||1)*(E?axSpdK(s,E):1)+rng()*3};
// habilidades: multiplicadores de daño e Intimidación
function abAtk(me,mv,ty){const a=me.ab;let k=1;if(!a)return 1;
  if(me.mh<=me.mx/3&&((a===65&&ty==="grass")||(a===66&&ty==="fire")||(a===67&&ty==="water")||(a===68&&ty==="bug")))k*=1.5;
  if((a===37||a===74)&&mv.cl===1)k*=1.5;if(a===62&&me.sts)k*=1.5;if(a===101&&(mv.pw||0)<=60)k*=1.5;if(me.ffire&&ty==="fire")k*=1.5;return k}
function abDef(tm,ty,me){const a=axMB(me)?0:tm.ab;if(!a)return 1;let k=1;if(a===47&&(ty==="fire"||ty==="ice"))k*=.5;if(a===136&&tm.mh>=tm.mx)k*=.5;return k}
function beIntim(E,i,push){const m=beAct(E.sd[i]);if(!m||m.mh<=0||m.ab!==22)return;push({k:"abil",s:i,n:m.p[0],ab:22});beFoes(E,i).forEach(j=>{const sd=E.sd[j];if(!sd.out&&beAct(sd).mh>0)beStat(E,j,[["atk",-1]],push,i,"int")})}
// objetos equipados: bayas que se activan solas
function beBerry(E,j,push){const m=beAct(E.sd[j]);if(m&&m.it==="sitrus"&&!m.ius&&m.mh>0&&m.mh<=m.mx/2&&!axNoBerry(E,j)){m.ius=1;if(m.ab===291)m.ru=E.turn+1;m.mh=Math.min(m.mx,m.mh+Math.max(1,Math.round(m.mx*axBerryK(m))));push({k:"item",s:j,n:m.p[0],it:"sitrus"})}}
function beOver(E,push){if(E.over!=null)return;const dead=E.tm.map(t=>t.every(i=>E.sd[i].out));if(dead.some(x=>x)){const al=dead.map((d,k)=>d?-1:k).filter(k=>k>=0);E.over=al.length===1?al[0]:"D";push({k:"win",s:E.over})}}
function beAil(E,j,a,push,rng,status,src){if(axAilBlock(E,j,a,push,status,src))return false;
  const sd=E.sd[j],m=beAct(sd),ty=m.p[1];
  if(a==="cnf"){if(sd.v.cnf){if(status)push({k:"ailfail",s:j,n:m.p[0]});return false}sd.v.cnf=2+Math.floor(rng()*4);push({k:"ail",s:j,n:m.p[0],a:a});if(m.it==="lum"&&!m.ius){m.ius=1;sd.v.cnf=0;push({k:"item",s:j,n:m.p[0],it:"lum"})}return true}
  if(!m.sts&&((a==="slp"&&(m.ab===15||m.ab===72))||((a==="psn"||a==="tox")&&m.ab===17)||(a==="par"&&m.ab===7))){if(status)push({k:"abil",s:j,n:m.p[0],ab:m.ab,blk:1});return false}
  if(m.sts||(a==="par"&&ty==="electric")||((a==="psn"||a==="tox")&&(ty==="poison"||ty==="steel")&&!axCorr(E,src,a))||(a==="brn"&&ty==="fire")||(a==="frz"&&ty==="ice")){if(status)push({k:"ailfail",s:j,n:m.p[0]});return false}
  m.sts=a;if(a==="slp")m.slp=1+Math.floor(rng()*3);if(a==="tox")m.tox=0;
  push({k:"ail",s:j,n:m.p[0],a:a});
  if(m.it==="lum"&&!m.ius){m.ius=1;m.sts="";m.slp=0;m.tox=0;push({k:"item",s:j,n:m.p[0],it:"lum"})}
  axAilPost(E,j,a,push,rng,src);
  return true;
}
function beStat(E,j,ch,push,src,tag){
  const sd=E.sd[j],m=beAct(sd);let any=false;ch=axStatPre(E,j,ch,push,src,tag);if(!ch.length)return false;
  ch.forEach(q=>{const s=q[0],o=sd.v.st[s],nv=Math.max(-6,Math.min(6,o+q[1]));if(nv===o)push({k:"statmax",s:j,n:m.p[0],st:s,up:q[1]>0});else{sd.v.st[s]=nv;any=true;push({k:"stat",s:j,n:m.p[0],st:s,c:nv-o})}});
  if(any)axStatPost(E,j,ch,push,src,tag);
  return any;
}
function beUse(E,i,a,rng,push,acted,faint){
  const sd=E.sd[i],me=beAct(sd),v=sd.v;
  if(v.rech){v.rech=0;push({k:"rech",s:i,n:me.p[0]});return}
  if(me.ab===54){if(v.tru){v.tru=0;axSay(push,i,me,"¡{w} está holgazaneando!");return}v.tru=1}
  if(me.sts==="slp"){if(me.slp>0){me.slp-=me.ab===48?2:1;push({k:"slp",s:i,n:me.p[0]});return}me.sts="";push({k:"wake",s:i,n:me.p[0]})}
  if(me.sts==="frz"){if(rng()<.2){me.sts="";push({k:"thaw",s:i,n:me.p[0]})}else{push({k:"frz",s:i,n:me.p[0]});return}}
  if(v.fl){v.fl=0;push({k:"flinch",s:i,n:me.p[0]});if(me.ab===80)beStat(E,i,[["spe",1]],push);return}
  if(v.cnf>0){v.cnf--;if(!v.cnf)push({k:"cnfend",s:i,n:me.p[0]});else{push({k:"cnf",s:i,n:me.p[0]});if(rng()<1/3){const d=Math.max(1,Math.round(me.ma*40/45*STG(v.st.atk)*(.85+rng()*.15)));me.mh=Math.max(0,me.mh-d);push({k:"cnfhit",s:i,n:me.p[0],d:d});faint(i);return}}}
  if(me.sts==="par"&&rng()<.25){push({k:"par",s:i,n:me.p[0]});return}
  const q=String(a).match(/^(?:m(\d)|st)(?:t(\d))?$/);if(!q)return;
  let mv,k=-1;const allOut=me.pp.every(x=>x<=0);
  if(q[1]==null){if(!allOut)return;mv=STRUG}
  else{k=+q[1];mv=me.m[k];if(!mv)return;if(me.pp[k]<=0){if(!allOut)return;mv=STRUG;k=-1}}
  if(k>=0){me.pp[k]--;if(me.pp[k]>0&&axFoesL(E,i).some(o=>o.m.ab===46))me.pp[k]--}
  if(!mv.prot)v.pc=0;
  push({k:"use",s:i,n:me.p[0],mv:mv.id});
  let tg=i;
  if(!mv.tself){const fo=beFoes(E,i).filter(j=>!E.sd[j].out&&beAct(E.sd[j]).mh>0);tg=q[2]!=null&&fo.includes(+q[2])?+q[2]:fo[0];if(tg==null){push({k:"none",s:i});return}}
  const ts=E.sd[tg],tm=beAct(ts);
  if(tg!==i&&ts.v.prot&&!(me.ab===260&&mv.cl===1)){push({k:"blocked",s:tg,n:tm.p[0]});return}
  const hitOk=()=>{const g=axHitK(E,i,tg,me,tm,mv);if(g===true)return true;return !mv.ac||rng()*100<mv.ac*STG3(v.st.acc)/STG3(axEva(me,ts))*g};
  if(mv.cl===0){
    if(mv.prot){if(v.pc&&rng()>=1/Math.pow(3,v.pc)){v.pc=0;push({k:"fail",s:i});return}v.prot=1;v.pc++;push({k:"prot",s:i,n:me.p[0]});return}
    if(mv.rest){if(me.mh>=me.mx||me.sts==="slp"){push({k:"fail",s:i});return}me.mh=me.mx;me.sts="slp";me.slp=2;push({k:"rest",s:i,n:me.p[0]});return}
    if(tg!==i&&axStatusImm(E,i,tg,me,tm,mv,push,rng))return;
    if(tg!==i&&!hitOk()){push({k:"miss",s:i,tg:tg});return}
    let did=false;
    if(mv.heal){const b=me.mh;me.mh=Math.min(me.mx,me.mh+Math.round(me.mx*mv.heal/100));push({k:"heal",s:i,n:me.p[0],h:me.mh-b});did=true}
    if(mv.ail)did=beAil(E,tg,mv.ail,push,rng,true,i)||did;
    if(mv.ch.length&&rng()*100<mv.sc)did=beStat(E,mv.self?i:tg,mv.ch,push,mv.self?undefined:i)||did;
    if(!did&&!mv.heal)push({k:"noeff",s:i});
    return;
  }
  if(!hitOk()){push({k:"miss",s:i,tg:tg});return}
  {const ty0=mv.typeless?"normal":axTy(me,mv),ta=axMB(me)?0:tm.ab;if(tg!==i&&!mv.fixed&&!mv.flv&&((ty0==="ground"&&ta===26)||(ty0==="water"&&ta===11)||(ty0==="electric"&&ta===10)||(ty0==="fire"&&ta===18))){let hl=0;if(ta!==26&&ta!==18&&tm.mh<tm.mx){const b=tm.mh;tm.mh=Math.min(tm.mx,tm.mh+Math.max(1,Math.round(tm.mx/4)));hl=tm.mh-b}if(ta===18)tm.ffire=1;push({k:"abil",s:tg,n:tm.p[0],ab:ta,imm:1,h:hl});return}}
  if(tg!==i&&axImm(E,i,tg,me,tm,mv,push,rng))return;
  let hits=1;if(mv.hits){const x=mv.hits[0],y=mv.hits[1];if(x===y)hits=x;else if(y===5){const r=rng();hits=r<.35?2:r<.7?3:r<.85?4:5}else hits=x+Math.floor(rng()*(y-x+1))}if(mv.hits&&me.ab===92)hits=mv.hits[1];
  const ty=mv.typeless?"normal":axTy(me,mv),special=mv.fixed||mv.flv||mv.half,e=mv.typeless||special?1:axEff(E,me,tm,ty,effP(ty,tm.p)),stab=!mv.typeless&&(stabP(ty,me.p)||[168,236,121,225].includes(me.ab))?(me.ab===91?2:1.5):1,pb=me.ab===185&&hits===1&&!mv.hits&&!special,h0=tm.mh;if(pb)hits=2;
  let tot=0,nh=0,crit=0;
  for(let h=0;h<hits&&tm.mh>0;h++){
    let d;const cr=!special&&!axNoCrit(me,tm)&&rng()<(mv.crit?1/8:1/24)*(me.it==="scope"?2:1)*(me.ab===105?2:1)*axCritK(me,tm);
    if(mv.fixed)d=mv.fixed;else if(mv.flv)d=me.l;else if(mv.half)d=Math.max(1,Math.floor(tm.mh/2));
    else{let am=tm.ab===109&&!axMB(me)?1:STG(v.st.atk),dm=me.ab===109?1:STG(ts.v.st.def);if(cr){am=Math.max(1,am);dm=Math.min(1,dm)}
      d=Math.max(1,Math.round(me.ma*mv.pw/45*e*stab*(.85+rng()*.15)*(cr?(me.ab===97?2.25:1.5):1)*am/dm*(ts.v.g&&me.ab!==151&&me.ab!==242?.5:1)*(me.it==="lorb"?1.3:1)/(tm.nd||1)*(me.sts==="brn"&&mv.cl===1&&me.ab!==62?.5:1)*abAtk(me,mv,ty)*abDef(tm,ty,me)*axDmg(E,i,tg,me,tm,mv,ty,e,acted)*(pb&&h===1?.25:1)))}
    if(cr)crit++;
    if(d>0&&axZero(E,tg,tm,mv,me,push))d=0;
    let sash=0;if(tm.it==="sash"&&!tm.ius&&tm.mh>=tm.mx&&tm.mh>1&&d>=tm.mh){d=tm.mh-1;tm.ius=1;sash=1}
    else if(tm.ab===5&&!axMB(me)&&tm.mh>=tm.mx&&tm.mh>1&&d>=tm.mh){d=tm.mh-1;sash=3}
    else if(tm.bud&&!tm.bud2&&tm.mh>1&&d>=tm.mh&&rng()<.25){d=tm.mh-1;tm.bud2=1;sash=2}
    tm.mh=Math.max(0,tm.mh-d);tot+=d;nh++;
    push({k:"hit",s:i,tg:tg,e:e,d:d,cr:cr?1:0});if(sash===3)push({k:"abil",s:tg,n:tm.p[0],ab:5});else if(sash)push({k:"item",s:tg,n:tm.p[0],it:sash===2?"bud":"sash"});
  }
  push({k:"after",s:i,tg:tg,e:e,crit:crit,nh:nh});
  if(mv.drain&&tot&&me.mh>0){if(tm.ab===64&&!axMB(me)){me.mh=Math.max(0,me.mh-Math.max(1,Math.round(tot*mv.drain/100)));axSay(push,tg,tm,"¡{o} ha absorbido el lodo de {w} y pierde PS!",{i:i,m:me},{});faint(i)}else{const b=me.mh;me.mh=Math.min(me.mx,me.mh+Math.max(1,Math.round(tot*mv.drain/100)));push({k:"drain",s:i,tg:tg,n:tm.p[0],h:me.mh-b})}}
  if(mv.rec&&tot&&!((me.ab===69||me.ab===98)&&mv.id!=="forc")){const d=Math.max(1,Math.round((mv.id==="forc"?me.mx:tot)*mv.rec/100));me.mh=Math.max(0,me.mh-d);push({k:"recoil",s:i,n:me.p[0]})}
  if(tot&&mv.cl===1&&tg!==i&&me.mh>0&&me.ab!==203){const ta=tm.ab;if((ta===24||ta===160)&&me.ab!==98){me.mh=Math.max(0,me.mh-Math.max(1,Math.floor(me.mx/8)));push({k:"abil",s:tg,n:tm.p[0],ab:ta,o:i,on:me.p[0]})}
    else if((ta===9||ta===38||ta===49||ta===27)&&!me.sts&&rng()<.3){const a2=ta===9?"par":ta===38?"psn":ta===49?"brn":["psn","par","slp"][Math.floor(rng()*3)];push({k:"abil",s:tg,n:tm.p[0],ab:ta});beAil(E,i,a2,push,rng,false,tg)}}
  if(me.it==="shell"&&tot&&me.mh>0&&me.mh<me.mx){me.mh=Math.min(me.mx,me.mh+Math.max(1,Math.round(tot/8)));push({k:"item",s:i,n:me.p[0],it:"shell"})}
  if(me.it==="lorb"&&tot&&me.mh>0&&me.ab!==98){me.mh=Math.max(0,me.mh-Math.max(1,Math.floor(me.mx/10)));push({k:"item",s:i,n:me.p[0],it:"lorb"})}
  faint(tg);if(tg!==i)beBerry(E,tg,push);beBerry(E,i,push);axAfterHit(E,i,tg,me,tm,mv,ty,tot,e,crit,h0,k,push,rng,acted,faint);
  if(tm.mh>0&&!axNoSec(me,tm)){
    if(mv.ail&&rng()*100<mv.ailc*axSec(me))beAil(E,tg,mv.ail,push,rng,false,i);
    if(mv.fl&&!acted[tg]&&tm.ab!==39&&rng()*100<mv.fl*axSec(me))ts.v.fl=1;
    if(mv.ch.length&&!mv.self&&rng()*100<mv.sc*axSec(me))beStat(E,tg,mv.ch,push,i);
  }
  if(mv.ch.length&&mv.self&&me.mh>0&&rng()*100<mv.sc)beStat(E,i,mv.ch,push);
  if(mv.kami)me.mh=0;
  if(mv.rech&&me.mh>0)v.rech=1;
  faint(i);
}
function beTurn(E,acts,rng){
  const ev=[],push=o=>{o.snap=beSnap(E);ev.push(o)},N=E.sd.length,acted={};
  const pri=i=>{const a=acts[i]||"x";if(a==="ff")return 9;if(/^s\d$/.test(a))return 8;if(a==="x")return 7;if(a==="d")return 6;const k=String(a).match(/^m(\d)/),sd=E.sd[i];const mv=k?beAct(sd).m[+k[1]]:null;return mv?mv.pr:0};
  if(!E.abi){E.abi=1;E.fcl=E.sd.reduce((a,s)=>a+s.t.filter(x=>x.mh<=0).length,0);E.sd.forEach((s,i)=>{if(!s.out)beEnter(E,i,push)})}
  const sp=E.sd.map(s=>s.out?0:beSpd(s,rng,E)),qc=[];
  E.sd.forEach((s,i)=>{if(s.out)return;const m=beAct(s);if(m&&m.it==="qclaw"&&m.mh>0&&/^m\d|^st/.test(String(acts[i]||""))&&rng()<.2){sp[i]+=1e4;qc.push(i)}});
  qc.forEach(i=>push({k:"item",s:i,n:beAct(E.sd[i]).p[0],it:"qclaw"}));
  const PR=E.sd.map((s,i)=>s.out?0:pri(i)+axPri(E,i,acts[i],rng,push)),order=E.sd.map((s,i)=>i).filter(i=>!E.sd[i].out).sort((a,b)=>PR[b]-PR[a]||sp[b]-sp[a]||a-b);
  const faint=i=>{const m=beAct(E.sd[i]);if(m.mh<=0&&!m.fd){m.mh=0;m.fd=1;push({k:"faint",s:i,n:m.p[0]})}};
  for(const i of order){
    const sd=E.sd[i],a=acts[i]||"x";if(sd.out)continue;
    if(a==="ff"){sd.t.forEach(x=>{x.mh=0;x.fd=1});sd.out=1;sd.need=0;push({k:"ff",s:i});acted[i]=1;continue}
    if(/^s\d$/.test(a)){const k=+a[1];if(sd.t[k]&&sd.t[k].mh>0&&k!==sd.ai&&beAct(sd).mh>0){const old=beAct(sd);if(old.sts==="tox")old.tox=0;if(old.ab===144&&old.mh>0)old.mh=Math.min(old.mx,old.mh+Math.round(old.mx/3));if(old.ab===30)old.sts="";axLeave(E,i,old);sd.ai=k;sd.v=beVol();sd.v.nw=1;sd.t[k].played=1;push({k:"send",s:i,n:sd.t[k].p[0],old:old.p[0]});beEnter(E,i,push)}acted[i]=1;continue}
    if(a==="x"||beAct(sd).mh<=0){acted[i]=1;continue}
    if(a==="d"){sd.v.g=1;push({k:"guard",s:i,n:beAct(sd).p[0]});acted[i]=1;continue}
    beUse(E,i,a,rng,push,acted,faint);acted[i]=1;
  }
  for(let i=0;i<N;i++){const sd=E.sd[i];if(sd.out)continue;const m=beAct(sd);sd.v.prot=0;sd.v.g=0;sd.v.fl=0;if(m.mh<=0)continue;
    let d=0;if(m.sts==="psn")d=m.mx/8;else if(m.sts==="tox"){m.tox=Math.min(15,(m.tox||0)+1);d=m.mx*m.tox/16}else if(m.sts==="brn")d=m.mx/16;
    if(d&&m.ab===90&&(m.sts==="psn"||m.sts==="tox")){if(m.mh<m.mx){axHeal(m,1/8);axSay(push,i,m,"¡{w} se cura con el veneno gracias a {a}!",null,{hl:1})}}else if(d&&m.ab!==98){if(m.ab===85&&m.sts==="brn")d/=2;m.mh=Math.max(0,m.mh-Math.max(1,Math.floor(d)));push({k:"res",s:i,n:m.p[0],a:m.sts});faint(i)}
    if(m.mh>0&&m.ab===3&&sd.v.st.spe<6){sd.v.st.spe++;push({k:"abil",s:i,n:m.p[0],ab:3})}
    if(m.mh>0&&m.it==="left"&&m.mh<m.mx){m.mh=Math.min(m.mx,m.mh+Math.max(1,Math.floor(m.mx/16)));push({k:"item",s:i,n:m.p[0],it:"left"})}
    axEnd(E,i,push,rng,faint);beBerry(E,i,push)}
  axField(E,push);
  for(let i=0;i<N;i++){const sd=E.sd[i];if(sd.out||sd.need)continue;if(beAct(sd).mh<=0){faint(i);if(sd.t.some(x=>x.mh>0))sd.need=1;else{sd.out=1;push({k:"out",s:i})}}}
  beOver(E,push);E.turn++;return ev;
}
function beSwap(E,acts){
  const ev=[],push=o=>{o.snap=beSnap(E);ev.push(o)};
  E.sd.forEach((sd,i)=>{if(!sd.need)return;const a=acts[i]||"";
    if(a==="ff"){sd.t.forEach(x=>{x.mh=0;x.fd=1});sd.out=1;sd.need=0;push({k:"ff",s:i});return}
    let k=/^s\d$/.test(a)?+a[1]:-1;if(!(sd.t[k]&&sd.t[k].mh>0))k=sd.t.findIndex(x=>x.mh>0);
    const om=beAct(sd),old=om.p[0];axLeave(E,i,om);sd.ai=k;sd.v=beVol();sd.need=0;sd.t[k].played=1;push({k:"send",s:i,n:sd.t[k].p[0],old:old,forced:1});beEnter(E,i,push);axRecv(E,i,om,push)});
  beOver(E,push);return ev;
}
// IA de los rivales: prefiere los movimientos mas utiles, con algo de azar
function aiPick(E,i){
  const sd=E.sd[i],m=beAct(sd);if(!m||m.mh<=0)return "x";
  const fo=beFoes(E,i).filter(j=>!E.sd[j].out&&beAct(E.sd[j]).mh>0);if(!fo.length)return "x";
  const tsd=E.sd[fo[0]],t=beAct(tsd),ok=m.m.map((mv,k)=>({mv:mv,k:k})).filter(o=>m.pp[o.k]>0);
  if(!ok.length)return "st";
  const sc=ok.map(o=>{const mv=o.mv;
    if(mv.cl===0){if(mv.heal||mv.rest)return m.mh<m.mx*.4?140:3;if(mv.prot)return 14;if(mv.ail)return t.sts||(mv.ail==="cnf"&&tsd.v.cnf)?2:40;if(mv.ch.length){const s=mv.self?sd.v.st[mv.ch[0][0]]:tsd.v.st[mv.ch[0][0]];return Math.abs(s)>=2?3:22}return 4}
    return (mv.fixed||mv.flv||mv.half?55:mv.pw*(mv.hits?(mv.hits[0]+mv.hits[1])/2:1))*effP(mv.t,t.p)*(stabP(mv.t,m.p)?1.5:1)*(mv.ac?mv.ac/100:1)+8});
  const tot=sc.reduce((a,b)=>a+b*b,0);let r=Math.random()*tot;
  for(let z=0;z<ok.length;z++){r-=sc[z]*sc[z];if(r<=0)return "m"+ok[z].k}
  return "m"+ok[0].k;
}
// ======================================================================
// REPRODUCCION DE LOS EVENTOS EN LA ARENA (comun a todos los modos)
// ======================================================================
const SL_ME={sp:"msp",n:"mn",l:"ml",h:"mh",hp:"mhp",st:"mst",i:"mi",pt:"pty",back:1};
const SL_OP={sp:"osp",n:"on",l:"ol",h:"oh",hp:"ohp",st:"ost",i:"oi",pt:"oparty",tn:"otn"};
const ART={atk:"El Ataque",def:"La Defensa",spe:"La Velocidad",acc:"La Precisión",eva:"La Evasión"};
const AILM={par:w=>"¡"+w+" está paralizado! Quizás no pueda moverse.",slp:w=>"¡"+w+" se ha dormido!",psn:w=>"¡"+w+" ha sido envenenado!",tox:w=>"¡"+w+" ha sido gravemente envenenado!",brn:w=>"¡"+w+" se ha quemado!",frz:w=>"¡"+w+" se ha congelado!",cnf:w=>"¡"+w+" se encuentra confuso!"};
const beWho=(i,n)=>B&&B.who?B.who(i,n):n;
const snapMon=(sn,i)=>B.E.sd[i].t[sn.ai[i]];
const ITMSG={left:["h",w=>"¡"+w+" ha recuperado algunos PS gracias a sus Restos!"],lorb:["d",w=>"¡"+w+" ha perdido PS por culpa de la Vidasfera!"],sash:["",w=>"¡"+w+" ha aguantado el golpe gracias a su Banda Focus!"],sitrus:["h",w=>"¡"+w+" se ha comido su Baya Zidra y ha recuperado PS!"],lum:["h",w=>"¡"+w+" se ha comido su Baya Ziuela y se ha curado!"],shell:["h",w=>"¡"+w+" ha recuperado PS gracias a su Campana Concha!"],qclaw:["",w=>"¡La Garra Rápida de "+w+" le permite actuar primero!"]};
function setSpr(i,sn){
  const sl=B.SL[i];if(!sl)return;const m=snapMon(sn||beSnap(B.E),i),e=$(sl.sp);
  e.innerHTML=ico(m.p,92,sl.back,m.sh);e.className="spr";e.style.transform="";e.style.filter="drop-shadow(0 0 12px "+GLW[m.p[2]]+")";
}
function bePaint(sn){
  if(!B||!B.SL)return;sn=sn||beSnap(B.E);B.snap=sn;
  B.SL.forEach((sl,i)=>{if(!sl)return;const sd=B.E.sd[i],a=sn.ai[i],m=sd.t[a];if(!m)return;
    $(sl.n).textContent=B.mode==="s"&&i===0&&typeof nk==="function"?nk(m.p[0]):m.p[0];$(sl.l).textContent=STAR[m.p[2]]+" "+tyNm(m.p)+" Nv"+m.l;
    const hp=Math.max(0,sn.hp[i][a]),pc=hp/m.mx,bar=$(sl.h);bar.style.width=pc*100+"%";bar.style.background=pc>.5?"#3ecf5a":pc>.2?"#f5c400":"#e63950";
    const st=sn.st[i][a];
    if(sl.st){const e=$(sl.st);e.textContent=st?STS[st][0]:"";e.style.background=st?STS[st][1]:"";e.hidden=!st}
    const balls=sn.hp[i].map((h,j)=>'<i class="mb'+(h>0?"":" ko")+(j===a?" cur":"")+'" title="'+esc(sd.t[j].p[0])+'"></i>').join("");
    if(sl.pt){if(sl.pt==="oparty"&&!B.showOpp)$(sl.pt).innerHTML="";else $(sl.pt).innerHTML=balls+(sl.pt==="oparty"?'<small> '+sn.hp[i].filter(h=>h>0).length+'/'+sd.t.length+' restantes</small>':"")}
    $(sl.hp).innerHTML="PS "+hp+" / "+m.mx+(sl.pt?"":' <span class="party" style="display:inline-flex">'+balls+'</span>');
  });
}
async function bePlay(ev){
  const b0=B;
  for(let x=0;x<ev.length;x++){
    if(B!==b0||b0.dead)return;
    const e=ev[x],i=e.s,sl=B.SL[i]||{},mine=B.mine?B.mine(i):i===0,who=e.n!=null?beWho(i,e.n):"";
    switch(e.k){
      case "use":{bePaint(e.snap);const mv=MVI(e.mv);await say("¡"+who+" usa "+mv.n+"!");
        const nx=ev[x+1]||{};
        if(mv.cl>0&&nx.k==="hit"){snd("atk",{ty:mv.typeless?"normal":mv.t,big:mv.pw>=100});await fxMove(mv,sl.sp,B.SL[nx.tg].sp,mine)}
        else if(mv.cl===0&&!["miss","blocked","fail","none"].includes(nx.k)){snd("buff");await fxStatusMove(mv,sl.sp)}
        break}
      case "hit":{bePaint(e.snap);hitFx($(B.SL[e.tg].sp),e.e);snd("hit",e.e);if((ev[x+1]||{}).k==="hit")await sleep(260);break}
      case "after":await sleep(420);if(e.crit)await say(e.crit>1?"¡Golpes críticos!":"¡Un golpe crítico!");if(e.e>1)await say("¡Es súper eficaz!");else if(e.e<1)await say("No es muy eficaz...");if(e.nh>1)await say("¡Golpeó "+e.nh+" veces!");break;
      case "miss":snd("miss");await say("¡Pero ha fallado!");break;
      case "none":await say("¡Pero no hay ningún objetivo!");break;
      case "blocked":await fxProt(sl.sp);await say("¡"+who+" se ha protegido!");break;
      case "fail":await say("¡Pero ha fallado!");break;
      case "noeff":await say("¡No ha tenido ningún efecto!");break;
      case "prot":snd("guard");await fxProt(sl.sp);await say("¡"+who+" se está protegiendo!");break;
      case "guard":snd("guard");await fxProt(sl.sp,"#ffd35c");await say("¡"+who+" se pone en guardia!");break;
      case "rest":snd("heal");await fxHeal(sl.sp);bePaint(e.snap);fxZ(sl.sp);await say("¡"+who+" se ha dormido y ha recuperado toda su salud!");break;
      case "heal":snd("heal");await fxHeal(sl.sp);bePaint(e.snap);await say(e.h>0?"¡"+who+" ha recuperado PS!":"¡Los PS de "+who+" ya están al máximo!");break;
      case "ail":bePaint(e.snap);await fxAil(sl.sp,e.a);await say(AILM[e.a](who));break;
      case "ailfail":await say("¡No afecta a "+who+"!");break;
      case "stat":snd(e.c>0?"buff":"miss");await fxStat(sl.sp,e.st,e.c>0);await say("¡"+ART[e.st]+" de "+who+" ha "+(e.c>0?"subido":"bajado")+(Math.abs(e.c)>2?" muchísimo":Math.abs(e.c)>1?" mucho":"")+"!");break;
      case "statmax":await say("¡"+ART[e.st]+" de "+who+" no puede "+(e.up?"subir":"bajar")+" más!");break;
      case "drain":bePaint(e.snap);fxHeal(sl.sp);await say("¡"+beWho(e.tg,e.n)+" ha perdido energía!");break;
      case "recoil":bePaint(e.snap);hitFx($(sl.sp),1);await say("¡"+who+" ha sufrido daño de retroceso!");break;
      case "item":{bePaint(e.snap);const q=ITMSG[e.it];if(!q)break;if(q[0]==="h"){snd("heal");fxHeal(sl.sp)}else if(q[0]==="d")hitFx($(sl.sp),1);else snd("buff");await say(q[1](who));break}
      case "abil":{bePaint(e.snap);const an=abName(e.ab);snd(e.imm?"guard":e.dm?"hit":"buff");
        if(e.t){if(e.hl){snd("heal");fxHeal(sl.sp)}if(e.dm)hitFx($(sl.sp),1);await say(axFmt(e,who,an))}
        else if(e.imm)await say(e.h?"¡"+who+" absorbe el ataque con "+an+" y recupera PS!":e.ab===18?"¡"+an+" de "+who+" absorbe el fuego y potencia sus ataques!":"¡"+who+" no se ve afectado gracias a "+an+"!");
        else if(e.blk)await say("¡"+an+" de "+who+" le protege!");
        else if(e.ab===5)await say("¡"+who+" ha aguantado el golpe gracias a "+an+"!");
        else if(e.ab===24||e.ab===160){hitFx($(B.SL[e.o].sp),1);await say("¡"+beWho(e.o,e.on)+" se ha hecho daño con "+an+" de "+who+"!")}
        else if(e.ab===22)await say("¡"+an+" de "+who+" asusta a sus rivales!");
        else if(e.ab===3)await say("¡"+an+" de "+who+" sube su Velocidad!");
        else await say("¡"+an+" de "+who+" se ha activado!");
        break}
      case "msg":bePaint(e.snap);await say(e.t);break;
      case "rech":await say("¡"+who+" necesita recuperarse!");break;
      case "slp":fxZ(sl.sp);await say(who+" está dormido como un tronco.");break;
      case "wake":bePaint(e.snap);await say("¡"+who+" se ha despertado!");break;
      case "frz":await fxAil(sl.sp,"frz");await say("¡"+who+" está congelado!");break;
      case "thaw":bePaint(e.snap);await say("¡"+who+" ya no está congelado!");break;
      case "flinch":await say("¡"+who+" ha retrocedido!");break;
      case "cnf":await fxAil(sl.sp,"cnf");await say("¡"+who+" está confuso!");break;
      case "cnfhit":bePaint(e.snap);hitFx($(sl.sp),1);snd("hit",1);await say("¡Está tan confuso que se ha herido a sí mismo!");break;
      case "cnfend":await say("¡"+who+" ya no está confuso!");break;
      case "par":await fxAil(sl.sp,"par");await say("¡"+who+" está paralizado! ¡No se puede mover!");break;
      case "res":bePaint(e.snap);await fxAil(sl.sp,e.a);await say(e.a==="brn"?"¡"+who+" se resiente de las quemaduras!":"¡El veneno resta PS a "+who+"!");break;
      case "faint":bePaint(e.snap);snd("faint");await fxFaint(sl.sp);$(sl.sp).classList.add("faint");await say("¡"+who+" se debilitó!");break;
      case "send":await B.onSend(e);break;
      case "ff":bePaint(e.snap);if(sl.sp)$(sl.sp).classList.add("faint");snd("flee");if(B.onFf)await B.onFf(e);break;
      case "out":if(B.onOut)await B.onOut(e);break;
    }
  }
}
// ======================================================================
// COMBATE NORMAL (salvaje, entrenador o Liga)
// ======================================================================
function saveHp(){if(!B||B.mode!=="s")return;B.E.sd[0].t.forEach(t=>{S.hp[(t.p0||t.p)[0]]=Math.max(0,Math.min(t.mh,t.mx))});save()}
function syncPP(){if(!B||B.mode!=="s")return;B.E.sd[0].t.forEach(t=>t.m.forEach((mv,k)=>{if(mv.id!=="forc")ppSet((t.p0||t.p)[0],mv.id,t.pp[k])}))}
const myAct=()=>beAct(B.E.sd[B.me||0]);
function xpBar(){
  if(!B||B.mode!=="s"){$("xb").style.width="0%";$("xt").textContent="";return}
  const n=B.snap?snapMon(B.snap,0).p[0]:myAct().p[0],d=lvd(n),nd=need(d.l);
  $("xb").style.width=(d.l>=100?100:Math.min(100,d.x/nd*100))+"%";
  $("xt").textContent="Exp "+(d.l>=100?"máx.":Math.min(d.x,nd)+"/"+nd);
}
function effTag(mv,foe){if(!foe||mv.cl===0||mv.typeless||mv.fixed||mv.flv||mv.half)return"";const e=effP(mv.t,foe.p);return e>=4?' · <b class="ef2">×4</b>':e>1?' · <b class="ef2">×2</b>':e<=.25?' · <b class="ef5">×¼</b>':e<1?' · <b class="ef5">×½</b>':""}
function mvBtn(mv,pp,mx,attr,foe){return '<button class="mvb" '+attr+(pp<=0?' disabled':'')+' style="--tc:'+(TC[mv.t]||"#999")+'" title="'+esc(mvDesc(mv))+'"><span>'+esc(mv.n)+'</span><small>'+EM[mv.t]+' '+TIPO[mv.t]+' · PP '+pp+'/'+mx+effTag(mv,foe)+'</small></button>'}
// tarjeta de Pokémon para elegir a quién sacar (igual que en el selector de equipo: sprite animado, tipo, nivel y PS)
function swCard(t,attr,dis,tag){const p=t.p,n=p[0],sh=!!(S.shiny&&S.shiny[n]>0),hp=Math.max(0,t.mh),k=t.mx?hp/t.mx:0,col=k>.5?"#3ecf8e":k>.2?"#ffd35c":"#e63950";
  return '<button class="swc '+p[2]+(hp<=0?' ko':'')+(tag?' tg':'')+'" '+attr+(dis?' disabled':'')+'><span class="swspr">'+ico(p,64,false,sh)+'</span><span class="swt"><b>'+(sh?"✨ ":"")+esc(typeof nk==="function"?nk(n):n)+'</b><small>Nv'+t.l+' · '+(STAR[p[2]]||"")+'</small><small>'+tyTxt(p)+'</small><span class="swhp"><i style="width:'+(k*100).toFixed(1)+'%;background:'+col+'"></i></span><small>PS '+hp+'/'+t.mx+(t.sts&&STS[t.sts]?' · '+STS[t.sts][0]:'')+'</small></span>'+(tag?'<i class="swtag">'+tag+'</i>':'')+'</button>'}
const swGrid=h=>'<div class="swgrid">'+h+'</div>';
function setMenu(v){
  if(!B||B.mode!=="s")return;
  let h="";const sd=B.E.sd[0],m=beAct(sd),foe=beAct(B.E.sd[1]);
  if(v===true)h=(m.pp.every(x=>x<=0)?'<button class="mvb" data-k="st" style="--tc:#999">Forcejeo<small>¡Sin PP! Ataque desesperado</small></button>':m.m.map((mv,k)=>mvBtn(mv,m.pp[k],ppMax(m.p[0],mv.id),'data-k="m'+k+'"',foe)).join(""))+'<button data-k="d">🛡️ Defensa</button><button data-k="b">🎒 Bolsa</button><button data-k="e">🔁 Equipo</button><button data-k="f">'+(B.trainer?'🏳️ Rendirse':'🏃 Huir')+'</button>';
  else if(v==="bag")h=ITEMS.filter(it=>S.bag[it[0]]>0&&!it[7]&&!["cand","ppup","ppmax"].includes(it[0])).map(it=>'<button data-k="i:'+it[0]+'">'+it[1]+' ×'+S.bag[it[0]]+'</button>').join("")+'<button data-k="main">Atrás</button>';
  else if(v==="team")h=swGrid(sd.t.map((t,i)=>swCard(t,'data-k="s:'+i+'"',i===sd.ai||t.mh<=0,i===sd.ai?"En combate":t.mh<=0?"Debilitado":"")).join(""))+'<button data-k="main">Atrás</button>';
  else if(v==="tgt"){
    const it=ITEMS.find(i=>i[0]===B.item),pp=PPI[it[0]],L=sd.t.map((t,i)=>({t:t,i:i})).filter(x=>pp?x.t.pp.some((p,k)=>p<PPB(x.t.m[k].id)*(1+.2*ppUps(x.t.p[0],x.t.m[k].id))):it[5]?x.t.mh<=0:(x.t.mh>0&&x.t.mh<x.t.mx));
    h=(L.length?L.map(x=>'<button data-k="u:'+x.i+'">'+x.t.p[0]+(pp?' · '+x.t.m.map((mm,k)=>x.t.pp[k]+'/'+ppMax(x.t.p[0],mm.id)).join(" "):' · PS '+Math.max(0,x.t.mh)+'/'+x.t.mx)+'</button>').join(""):'<button disabled>Ninguno lo necesita</button>')+'<button data-k="b">Atrás</button>';
  }
  else if(v==="ppm"){const t=sd.t[B.ppt];h=t.m.map((mm,j)=>{const c=t.pp[j],x=ppMax(t.p[0],mm.id);return '<button data-k="v:'+j+'"'+(c>=x?' disabled':'')+'>'+esc(mm.n)+'<small>PP '+c+'/'+x+'</small></button>'}).join("")+'<button data-k="b">Atrás</button>'}
  $("menu").innerHTML=h;
}
// ---- entrenadores rivales: sprites originales de cada clase de entrenador (Pokémon Showdown) con animacion ----
const TSPR="https://play.pokemonshowdown.com/sprites/trainers/";
function tHTML(src,pose){
  if(!src)return "";
  if(src.c)return trImg(trDec(src.c),"f",pose==="t"?"t":pose==="w"?"w":"i","tsprc");
  return '<img class="tspr" src="'+TSPR+src.k+'.png" alt="" draggable="false" data-n="'+esc(src.n||"")+'" onerror="tImgErr(this)">';
}
function tImgErr(el){el.onerror=null;const d=document.createElement("div");d.innerHTML=trainerSVG(trainerLook(el.dataset.n||"x"),"idle");el.replaceWith(d.firstChild)}
// dibujo de reserva por si no carga la imagen original
const TSK=["#f6d3b3","#e9b98f","#c98d5f","#8d5a3b"],THC=["#2b2118","#5b3a1e","#a2561f","#d9a441","#c43c3c","#3b5bdb","#7b4bb7","#e8e8ee"];
const tHash=t=>{let h=2166136261;for(const c of t){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
function trainerLook(name){const h=tHash(name);return{skin:TSK[h%4],hair:THC[(h>>3)%8],top:["#e63950","#3f86f0","#2fa36b","#f5a300","#8a3fd0","#2b2b34"][(h>>6)%6],pants:["#3b4260","#5a3b22","#2b2b34","#6b7bd8"][(h>>9)%4]}}
function trainerSVG(L){return '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="50" cy="143" rx="30" ry="6" fill="#000" opacity=".25"/><rect x="34" y="94" width="14" height="42" rx="5" fill="'+L.pants+'"/><rect x="52" y="94" width="14" height="42" rx="5" fill="'+L.pants+'"/><rect x="30" y="52" width="40" height="46" rx="12" fill="'+L.top+'"/><circle cx="50" cy="34" r="17" fill="'+L.skin+'"/><path d="M32 33Q33 13 50 13Q67 13 68 33Q60 24 50 25Q40 24 32 33Z" fill="'+L.hair+'"/><circle cx="43" cy="36" r="2.4" fill="#2b2118"/><circle cx="57" cy="36" r="2.4" fill="#2b2118"/></svg>'}
const TQ_WIN=["¡No puede ser! ¡He perdido!","Has sido mejor que yo... ¡Enhorabuena!","¡Increíble! ¡Eres muy fuerte!","Tendré que entrenar mucho más...","¡Vaya! No me lo esperaba..."];
const TQ_CHAMP=["Mi reinado ha terminado... ¡Eres un gran entrenador!","¡Qué combate tan increíble! Has demostrado tu valor.","He dado todo lo que tenía... y aun así has ganado."];
function tPose(p){const t=$("tsp");t.classList.remove("t-throw","t-win","t-lose");if(p&&p!=="i")t.classList.add("t-"+({t:"throw",w:"win",l:"lose"}[p]||p));if(B&&B.tsrc&&B.tsrc.c){t.innerHTML=tHTML(B.tsrc,p);tPlace()}}
// coloca al entrenador rival centrado sobre su base, con los pies en el centro de la plataforma
function tPlace(){const t=$("tsp"),pl=document.querySelector(".plat.opp");if(!t||!pl||!t.offsetParent)return;
  const h=t.offsetHeight,w=t.offsetWidth;if(!h||!w)return;t.style.right="auto";t.style.left=Math.round(pl.offsetLeft+pl.offsetWidth/2-w/2)+"px";t.style.top=Math.round(pl.offsetTop+pl.offsetHeight*.55-h)+"px"}
addEventListener("resize",()=>{try{tPlace()}catch(e){}});
try{new ResizeObserver(()=>{try{tPlace()}catch(e){}}).observe($("tsp"))}catch(e){}
// el Pokémon rival se retira (si sigue en la base) antes de que aparezca el entrenador: nunca se ven a la vez
async function oppHide(){for(const id of ["osp","osp2"]){const e=$(id);if(!e||e.hidden||+getComputedStyle(e).opacity<.05)continue;
  if(O.intro)await e.animate([{opacity:1,transform:"none"},{opacity:0,transform:"scale(.4) translateY(30px)"}],{duration:380,easing:"ease-in"}).finished;e.style.opacity=0}}
async function trainerEnter(pose){
  await oppHide();
  const t=$("tsp");t.style.opacity=0;t.innerHTML=tHTML(B.tsrc,pose);
  {const im=t.querySelector("img");if(im&&!im.complete)await Promise.race([new Promise(r=>{im.addEventListener("load",r);im.addEventListener("error",()=>setTimeout(r,0))}),new Promise(r=>setTimeout(r,500))])}
  tPose(pose);tPlace();t.style.opacity=1;
  if(O.intro)await t.animate([{translate:"280px 0",opacity:0},{translate:"0 0",opacity:1}],{duration:700,easing:"ease-out"}).finished;
}
async function trainerLeave(){const t=$("tsp");if(O.intro)await t.animate([{translate:"0 0",opacity:1},{translate:"300px 0",opacity:0}],{duration:600,easing:"ease-in"}).finished;t.style.opacity=0}
function ballEl(id,x,y){const e=document.createElement("div");e.className="ball mini "+({sb:"R",ub:"E",mb:"L"}[id]||"");e.style.cssText="position:absolute;left:"+x+"px;top:"+y+"px;margin:-32px 0 0 -32px;z-index:6";BTE().appendChild(e);return e}
async function ballArc(first,tid,bid,fromId){
  if(!O.intro)return;
  const tg=pos(tid||"osp"),tt=first?pos(fromId||"tsp"):null,f=first?{x:tt.x-tt.w*.32,y:tt.y-tt.h*.18}:{x:tg.x+240,y:tg.y-130};
  if(!O.fx){const e=ballEl(bid||"pb",f.x,f.y);e.style.width="32px";e.style.height="32px";e.style.margin="-16px 0 0 -16px";
    await e.animate([{transform:"translate(0,0) rotate(0deg)"},{transform:"translate("+(tg.x-f.x)/2+"px,-90px) rotate(360deg)"},{transform:"translate("+(tg.x-f.x)+"px,"+(tg.y-f.y)+"px) rotate(720deg)"}],{duration:650,easing:"ease-in-out"}).finished;e.remove();return}
  await pbThrow(bid||"pb",f,{x:tg.x,y:tg.y-tg.h*.08},{d:620,arc:-95,open:true,r:pbR()*.8,spin:-14});
}
async function popIn(sid,iid,fromRight){
  const s=$(sid);if(!O.fx)snd("open");
  {const im=s.querySelector("img[data-n]");if(im)cry(im.dataset.n)}
  if(iid){const i=$(iid);i.style.opacity=1;if(O.intro)i.animate([{translate:(fromRight?"260px":"-260px")+" 0"},{translate:"0 0"}],{duration:600,easing:"ease-out"})}
  const shy=!!s.querySelector(".shy");
  if(O.fx||O.intro)await pbMaterialize(sid,shy);else{s.style.opacity=1;if(shy){snd("lvl");burst("✨",pos(sid),10,70,26)}}
}
async function trainerSendOut(first,sid,iid,name,bid){
  sid=sid||"osp";iid=iid||"oi";
  const m=name||snapMon(B.snap||beSnap(B.E),1).p[0];
  const sp=say((B.trainerName||B.trainer)+" envía a "+m+"!");
  if(first)tPose("t");
  snd("throw");await ballArc(first,sid,bid||BALLR[PM[m]?PM[m][2]:"C"]);
  if(first)await trainerLeave();
  await popIn(sid,iid,false);
  await sp;
}
async function trainerDefeat(){
  $("osp").style.opacity=0;
  await trainerEnter("l");
  await say("¡Has derrotado a "+B.trainer+"!");
  const q=/campe|veterano/i.test(B.trainer)?TQ_CHAMP:TQ_WIN;
  await say("«"+q[Math.floor(Math.random()*q.length)]+"»");
}
// ---- tu entrenador de espaldas en el combate (como en los juegos) ----
async function playerIn(){
  const p=$("psp");p.innerHTML=trImg(myLook(),"b","i","pidle");p.style.opacity=1;
  if(O.intro)await p.animate([{translate:"-260px 0"},{translate:"0 0"}],{duration:650,easing:"ease-out"}).finished;
}
async function playerThrow(m,sid,iid){
  const p=$("psp"),L=myLook(),img=p.querySelector("img");
  const sp=say("¡Adelante, "+m.p[0]+"!");
  if(img&&O.intro&&O.fx){img.classList.remove("pidle");const s=pxSpd();
    img.src=trURL(L,"b","t");p.animate([{translate:"0 0"},{translate:"-6px 2px"}],{duration:180/s,fill:"forwards"});await sleep(170);
    img.src=trURL(L,"b","m");await sleep(100);img.src=trURL(L,"b","u");snd("throw");
    p.animate([{translate:"-6px 2px"},{translate:"10px -2px"}],{duration:160/s,fill:"forwards"});
    const r=img.getBoundingClientRect(),b=BTE().getBoundingClientRect(),hand={x:r.left-b.left+r.width*.9,y:r.top-b.top+r.height*.28},t=pos(sid);
    const th=pbThrow(ballOf(m.p),hand,{x:t.x,y:t.y-t.h*.05},{d:640,arc:-110,open:true,r:pbR()*1.1});
    await sleep(150);img.src=trURL(L,"b","f");await sleep(160);
    p.animate([{translate:"10px -2px",opacity:1},{translate:"-300px 0",opacity:0}],{duration:650,easing:"ease-in",fill:"forwards"}).finished.then(()=>{p.style.opacity=0;p.getAnimations().forEach(a=>a.cancel());img.src=trURL(L,"b","i");img.classList.add("pidle")});
    await th;await popIn(sid,iid,true);await sp;return}
  if(img&&O.intro){img.classList.remove("pidle");img.src=trURL(L,"b","t");await sleep(260);img.src=trURL(L,"b","u");snd("throw")}
  if(O.intro){const f=pos("psp"),t=pos(sid),e=ballEl(ballOf(m.p),f.x+40,f.y-60);e.style.width="32px";e.style.height="32px";e.style.margin="-16px 0 0 -16px";
    await e.animate([{transform:"translate(0,0) rotate(0)"},{transform:"translate("+(t.x-f.x-40)/2+"px,-70px) rotate(360deg)"},{transform:"translate("+(t.x-f.x-40)+"px,"+(t.y-f.y+60)+"px) rotate(720deg)"}],{duration:600,easing:"ease-in-out"}).finished;e.remove()}
  if(O.intro)p.animate([{translate:"0 0",opacity:1},{translate:"-260px 0",opacity:0}],{duration:600,easing:"ease-in",fill:"forwards"}).finished.then(()=>{p.style.opacity=0;p.getAnimations().forEach(a=>a.cancel())});else p.style.opacity=0;
  await popIn(sid,iid,true);
  await sp;
}
async function sendOut(p,sid,bid){
  sid=sid||"msp";const t=pos(sid);
  if(!O.intro){$(sid).style.opacity=1;snd("pop");return}
  if(O.fx){snd("throw");await pbThrow(bid||ballOf(p),{x:-30,y:t.y+10},{x:t.x,y:t.y-t.h*.05},{d:700,arc:-120,open:true,r:pbR()*1.1});await popIn(sid,null);return}
  snd("throw");const f={x:-30,y:t.y+10},e=ballEl(bid||ballOf(p),f.x,f.y);
  await e.animate([{transform:"translate(0,0) rotate(0deg)"},{transform:"translate("+(t.x-f.x)/2+"px,-110px) rotate(360deg)"},{transform:"translate("+(t.x-f.x)+"px,"+(t.y-f.y)+"px) rotate(720deg)"}],{duration:700,easing:"ease-in-out"}).finished;
  e.remove();await popIn(sid,null);
}
async function introFlash(){
  if(O.intro){
    const ov=document.createElement("div");ov.style.cssText="position:absolute;inset:0;z-index:20;background:#fff;opacity:0";snd("flash");BTE().appendChild(ov);
    await ov.animate([{opacity:0},{opacity:1},{opacity:0},{opacity:1},{opacity:0},{opacity:1}],{duration:1000}).finished;
    ov.style.opacity=1;ov.style.background="#000";await sleep(250);
    await ov.animate([{clipPath:"inset(0 0 0 0)"},{clipPath:"inset(50% 0 50% 0)"}],{duration:650,easing:"ease-in",fill:"forwards"}).finished;ov.remove();
  }
}
async function sIntro(){
  await introFlash();
  playerIn();
  const op=beAct(B.E.sd[1]).p,me=beAct(B.E.sd[0]);
  if(B.trainer){await trainerEnter("i");snd("wild");await say("¡"+B.trainer+" te desafía!");await trainerSendOut(true)}
  else{
    const os=$("osp"),oi=$("oi");os.style.opacity=1;oi.style.opacity=1;snd("wild");cry(op[0]);
    if(O.intro){os.animate([{translate:"260px 0",filter:"brightness(0)"},{translate:"0 0",filter:"brightness(0)",offset:.8},{translate:"0 0",filter:"brightness(1)"}],{duration:900,easing:"ease-out"});oi.animate([{translate:"-260px 0"},{translate:"0 0"}],{duration:800,easing:"ease-out"})}
    await say("¡Un "+op[0]+" salvaje apareció!");
    if(beAct(B.E.sd[1]).sh){snd("lvl");burst("✨",pos("osp"),12,80,28);await say("✨ ¡Es un Pokémon VARIOCOLOR! ¡No lo dejes escapar!")}
  }
  await playerThrow(me,"msp","mi");
}
// ---- aprender movimientos al subir de nivel (como en los juegos) ----
async function offer(p){
  const n=p[0];moveIds(n);const l=lvd(n).l;let from=S.ml[n];if(from==null)from=l;
  const ls=learn(n).filter(x=>x[0]>from&&x[0]<=l);
  S.ml[n]=l;save();
  for(let z=0;z<ls.length;z++){
    const id=ls[z][1],ids=moveIds(n).slice(),mv=MVD[id];if(!mv||ids.includes(id))continue;
    if(ids.length<4){ids.push(id);S.mv[n]=ids;save();snd("lvl");await say("¡"+n+" ha aprendido "+mv.n+"!");continue}
    await say(n+" quiere aprender "+mv.n+" ("+TIPO[mv.t]+(mv.cl?", poder "+(mv.pw||"—"):", estado")+"). Pero ya conoce 4 movimientos. ¿Olvida alguno?");
    $("menu").innerHTML=ids.map((m,i)=>{const o=MVD[m];return '<button data-k="l:x'+i+'" class="mvb" style="--tc:'+TC[o.t]+'" title="'+esc(mvDesc(o))+'">Olvidar '+esc(o.n)+'<small>'+EM[o.t]+' '+TIPO[o.t]+(o.cl?' · Poder '+(o.pw||"—"):' · Estado')+'</small></button>'}).join("")+'<button data-k="l:no" class="mvb" style="--tc:'+TC[mv.t]+'" title="'+esc(mvDesc(mv))+'">No aprender '+esc(mv.n)+'<small>'+esc(mvDesc(mv))+'</small></button>'+(ls.length-z>1?'<button data-k="l:all">No aprender ninguno más ahora</button>':'');
    const r=await new Promise(r=>{B.choose=r});
    if(r==="all")break;
    if(r==="no"){await say(n+" no ha aprendido "+mv.n+".");continue}
    const k=+r.slice(1),old=MVD[ids[k]];ids[k]=id;S.mv[n]=ids;if(S.pp&&S.pp[n])delete S.pp[n][old.id];save();snd("lvl");
    await say("1, 2 y... ¡Puf! "+n+" ha olvidado "+old.n+"... ¡y ha aprendido "+mv.n+"!");
  }
  $("menu").innerHTML="";
}
async function gainXp(p,amt){
  const d=lvd(p[0]),act=B&&B.mode==="s"&&B.snap&&snapMon(B.snap,0).p===p,cap=lvCap();
  if(cap<100&&d.l>=cap){d.x=0;await say(p[0]+" está en el límite de nivel (Nv"+cap+") y no gana experiencia. "+capWhy());return false}
  d.x+=amt;
  snd("xp");await say(p[0]+" gana "+fmt(amt)+" puntos de experiencia.");
  if(act){xpBar();await sleep(700)}
  let up=false;
  while(d.l<cap&&d.x>=need(d.l)){
    d.x-=need(d.l);d.l++;up=true;snd("lvl");qEv("lvl");
    if(act){const xb=$("xb");xb.style.transition="none";xb.style.width="0%";void xb.offsetWidth;xb.style.transition="";burst("⭐",pos("msp"),8,60,26);$("ml").textContent=STAR[p[2]]+" "+tyNm(p)+" Nv"+d.l}
    await say("¡"+p[0]+" sube al nivel "+d.l+"!");
    if(act){xpBar();await sleep(500)}
  }
  if(cap<100&&d.l>=cap){d.x=0;await say(p[0]+" ha alcanzado el límite de nivel (Nv"+cap+"). "+capWhy())}
  if(up)await offer(p);
  return up;
}
async function jackpot(rw){
  S.jp=(S.jp||0)+1;save();
  $("jamt").textContent="+"+fmt(rw)+" 🎟️";
  $("jcount").textContent=S.jp>1?"Es el premio gordo nº "+S.jp+" que consigues.":"";
  const c=$("jconf");c.innerHTML="";
  if(O.fx)for(let i=0;i<70;i++){const e=document.createElement("span");e.textContent=["🎉","🎊","✨","🎟️","⭐","💖"][i%6];e.style.left=Math.random()*100+"%";e.style.animationDuration=(2.5+Math.random()*3)+"s";e.style.animationDelay=(Math.random()*2)+"s";e.style.fontSize=(16+Math.random()*22)+"px";c.appendChild(e)}
  $("jack").hidden=false;snd("lvl");setTimeout(()=>snd("win"),1200);
  try{$("jok").focus()}catch(e){}
  await new Promise(r=>{$("jok").onclick=()=>{$("jack").hidden=true;r()}});
}
async function finish(res){
  const E=B.E,om=beAct(E.sd[1]),o=om.p;syncPP();saveHp();
  E.sd[0].t.forEach(t=>{t.sts=""});
  if(res==="flee")await say("¡"+o[0]+" salvaje huyó!");
  else if(res==="lose"){if(B.trainer){await trainerEnter("w");await say("¡"+B.trainer+" ha ganado el combate!")}snd("lose");await say(B.ff?"Has perdido el combate.":"¡Todo tu equipo se debilitó! Has perdido...");if(B.league){S.lg=null;await say("Has sido eliminado de la "+LEAGUES[B.league.li].n+". Puedes volver a intentarlo cuando quieras.")}}
  else{
    if(res==="win"){qEv("win");if(B.trainer){qEv("tr");await trainerDefeat()}}
    const rw=Math.random()<1e-7?33550336:Math.round((100+Math.floor(Math.random()*99901))*RMUL());S.t+=rw;
    snd("win");await say("¡Recompensa: +"+fmt(rw)+" 🎟️!"+(rw===33550336?" ¡¡PREMIO GORDO!!":""));
    if(rw===33550336)await jackpot(rw);
    if(res==="win"){
      const got=[],b=WW[o[2]]>=3?2:1,dr=(id,ch,q)=>{if(Math.random()<ch){S.bag[id]=(S.bag[id]||0)+q;got.push(q+" "+ITEMS.find(i=>i[0]===id)[1])}};
      dr("pb",.55,1+(Math.random()<.4?1:0));dr("sb",.2*b,1);dr("ub",.06*b,1);dr("mb",.004*b,1);dr("pot",.4,1);dr("spot",.15*b,1);dr("hpot",.06*b,1);dr("rev",.1,1);dr("eter",.12,1);dr("elix",.04*b,1);
      if(Math.random()<.05*b){const ev=ITEMS.filter(i=>i[7]==="evo");dr(ev[Math.floor(Math.random()*ev.length)][0],1,1)}
      if(got.length)await say("Botín: "+got.join(", ")+".");
    }
    if(rw===33550336)await jackpotLevel();
    const amt=B.trainer?Math.round((B.xpPool||0)*1.2):Math.round((15+om.l*6)*WW[o[2]]*.6*(res==="cap"?.5:1));
    const ups=[];
    for(const t of E.sd[0].t)if(t.played&&t.mh>0){if(await gainXp(t.p,t.it==="lucky"?Math.round(amt*1.5):amt))ups.push(t.p[0])}
    for(const n of ups){if(S.owned[n]&&evoLvReady(n).length)await evoPrompt(n,evoLvReady(n))}
    if(B.league&&res==="win")await leagueWin();
    if(B.gym!=null&&res==="win")await gymWin(B.gym);
    if(res==="win"||res==="cap"){const dm=E.sd[1].t.reduce((a,t)=>a+Math.max(0,t.mx-Math.max(0,t.mh)),0);gAccAdd("dmg",dm)}
  }
  if(typeof afterBattle==="function")try{await afterBattle(res)}catch(e){console.error(e)}
  save();render();updTeam();
  $("menu").innerHTML='<button data-k="9">Volver</button>';B.busy=false;
}
async function askSwitch(i){
  const sd=B.E.sd[i],rest=sd.t.map((t,k)=>k).filter(k=>sd.t[k].mh>0&&k!==sd.ai);
  await say("Elige tu siguiente Pokémon:");
  $("menu").innerHTML=swGrid(rest.map(k=>swCard(sd.t[k],'data-k="l:'+k+'"',false,"")).join(""));
  const id=await new Promise(r=>{B.choose=r});
  $("menu").innerHTML="";return "s"+id;
}
async function sSend(e){
  if(e.s===0){
    if(!e.forced){await say("¡Vuelve "+e.old+"!");await pbRecall("msp")}
    $("msp").style.opacity=0;setSpr(0,e.snap);bePaint(e.snap);xpBar();$("msp").style.opacity=0;
    if(!$("hlpp").hidden)$("hlpp").innerHTML=helpHTML();
    const sp=say("¡Adelante, "+e.n+"!");await sendOut(PM[e.n]);await sp;
  }else{
    $("osp").style.opacity=0;setSpr(1,e.snap);bePaint(e.snap);$("osp").style.opacity=0;
    await trainerSendOut(false,null,null,e.n);
  }
}
async function sTurn(act){
  const b=B;B.busy=true;setMenu(false);
  const ev=beTurn(B.E,[act,aiPick(B.E,1)],Math.random);
  await bePlay(ev);if(B!==b)return;
  await sAfter();
}
async function sAfter(){
  const E=B.E;syncPP();
  E.sd[1].t.forEach(t=>{if(t.mh<=0&&!t.xg){t.xg=1;B.xpPool=(B.xpPool||0)+Math.round((15+t.l*6)*WW[t.p[2]]*.6)}});
  if(E.over!=null)return finish(E.over===0?"win":"lose");
  const acts=["",""];
  if(E.sd[1].need)acts[1]="s"+E.sd[1].t.findIndex(x=>x.mh>0);
  if(E.sd[0].need)acts[0]=await askSwitch(0);
  if(acts[0]||acts[1]){await bePlay(beSwap(E,acts));if(E.over!=null)return finish(E.over===0?"win":"lose")}
  B.busy=false;setMenu(true);
}
async function useItem(idx,mi){
  const it=ITEMS.find(i=>i[0]===B.item),t=B.E.sd[0].t[idx],active=idx===B.E.sd[0].ai;
  if(!(S.bag[it[0]]>0)||!t)return;
  S.bag[it[0]]--;save();updBag();snd("heal");
  const pp=PPI[it[0]];
  if(pp){
    const L=pp.one?[mi]:t.m.map((m,k)=>k);let tot=0;
    L.forEach(k=>{const m=t.m[k];if(!m)return;const c=t.pp[k],nv=Math.min(ppMax(t.p[0],m.id),c+pp.amt);tot+=nv-c;t.pp[k]=nv;ppSet(t.p[0],m.id,nv)});save();
    if(active)await fxHeal("msp");
    await say("Usas "+it[1]+": "+t.p[0]+" recupera "+tot+" PP.");return;
  }
  if(it[5]){t.mh=Math.round(t.mx*it[5]/100);t.fd=0;await say("¡"+t.p[0]+" revive con "+t.mh+" PS!")}
  else{const h=Math.round(t.mx*it[4]/100),b4=t.mh;t.mh=Math.min(t.mx,t.mh+h);if(active)await fxHeal("msp");await say("Usas "+it[1]+": "+t.p[0]+" recupera "+(t.mh-b4)+" PS.")}
  bePaint();
}
async function ball(id,it){
  B.busy=true;setMenu(false);const m=beAct(B.E.sd[1]),o=m.p;
  S.bag[id]--;save();updBag();
  const sp=$("osp");
  const sb=m.sts==="slp"||m.sts==="frz"?2:m.sts?1.5:1;
  const ch=it[3]>=99?1:Math.min(.97,it[3]*RCT[o[2]]*(1.15-.9*m.mh/m.mx)*sb),ok=Math.random()<ch,nsh=ok?3:Math.floor(Math.random()*3+Math.min(.99,ch*1.5));
  const sm=say("¡Lanzas una "+it[1]+"!");await catchFx(id,nsh,ok);await sm;
  if(ok){
    const isNew=!hasP(o[0]);
    if(!S.owned[o[0]]){(S.balls=S.balls||{})[o[0]]=id;(S.when=S.when||{})[o[0]]=Date.now()}
    S.owned[o[0]]=(S.owned[o[0]]||0)+1;qEv("cap");if(isNew)qEv("new");
    if(m.sh){S.shiny=S.shiny||{};S.shiny[o[0]]=(S.shiny[o[0]]||0)+1;qEv("shiny")}
    snd("capok");await say("¡Has capturado a "+(m.sh?"un "+o[0]+" ✨ variocolor":o[0])+"!"+(isNew?" ¡Nuevo en tu Pokédex!":""));
    return finish("cap");
  }
  sp.style.transform="";sp.style.filter="drop-shadow(0 0 12px "+GLW[o[2]]+")";sp.style.opacity=1;snd("capfail");await say(["¡Oh, no! ¡"+o[0]+" se ha escapado!","¡Vaya! ¡Parecía que lo habías atrapado!","¡Argh! ¡Casi lo consigues!"][Math.min(2,nsh)]);
  if(Math.random()<.25){sp.classList.add("faint");snd("flee");return finish("flee")}
  return sTurn("x");
}
async function turn(k){
  if(!B||B.mode!=="s"||B.busy)return;
  if(k==="b"){setMenu("bag");return}
  if(k==="e"){setMenu("team");return}
  if(k==="main"){setMenu(true);return}
  if(k.slice(0,2)==="u:"&&PPI[B.item]&&PPI[B.item].one){B.ppt=+k.slice(2);setMenu("ppm");return}
  if(k.slice(0,2)==="i:"){
    const id=k.slice(2),it=ITEMS.find(i=>i[0]===id);
    if(!(S.bag[id]>0))return;
    if(!it[3]){B.item=id;setMenu("tgt");return}
    if(B.trainer){B.busy=true;setMenu(false);await say("¡No puedes capturar a los Pokémon de otro entrenador!");B.busy=false;setMenu(true);return}
    {const wm=beAct(B.E.sd[1]),cap=lvCap();if(wm.l>cap){B.busy=true;setMenu(false);await say("¡"+wm.p[0]+" (Nv"+wm.l+") es demasiado fuerte! Solo puedes capturar Pokémon hasta el Nv"+cap+". "+capWhy());B.busy=false;setMenu(true);return}}
    return ball(id,it);
  }
  if(k==="f"){
    B.busy=true;setMenu(false);
    // contra entrenadores no se puede huir, pero sí rendirse (cuenta como derrota)
    if(B.trainer){const why=B.league?" Quedarás eliminado de la "+LEAGUES[B.league.li].n+".":B.tower?" Se acabará tu racha en la Torre Batalla.":"";
      if(!confirm("¿Seguro que quieres rendirte? El combate contará como derrota."+why)){B.busy=false;setMenu(true);return}
      B.ff=true;snd("flee");await say("¡Te has rendido!");return finish("lose")}
    {const tp=axTrapped();if(tp){await say(tp);B.busy=false;setMenu(true);return}}
    syncPP();saveHp();snd("flee");await say("¡Has huido sin problemas!");B.busy=false;$("menu").innerHTML='<button data-k="9">Volver</button>';return;
  }
  const m=beAct(B.E.sd[0]);
  if(k[0]==="m"&&m.pp[+k.slice(1)]<=0)return;
  if(k.slice(0,2)==="u:"){B.busy=true;setMenu(false);await useItem(+k.slice(2));return sTurn("x")}
  if(k.slice(0,2)==="v:"){B.busy=true;setMenu(false);await useItem(B.ppt,+k.slice(2));return sTurn("x")}
  if(k.slice(0,2)==="s:")return sTurn("s"+k.slice(2));
  if(k==="d"||k==="st"||/^m\d$/.test(k))return sTurn(k);
}
$("menu").onclick=e=>{
  const bt=e.target.closest("button");if(!bt)return;const v=bt.dataset.k;if(v===undefined)return;snd("ui");
  if(v.slice(0,2)==="l:"){if(B&&B.choose){const f=B.choose;B.choose=null;f(v.slice(2))}return}
  if(v==="9"){arenaReset();bigSet("");$("arena").hidden=true;$("fsel").hidden=false;fcd=false;B=null;updTeam()}else turn(v);
};
function arenaReset(){
  const bt=BTE();bt.classList.remove("dbl");["osp2","msp2","oi2","mi2"].forEach(id=>{$(id).hidden=true});
  ["osp","msp","osp2","msp2"].forEach(id=>{const e=$(id);e.className="spr";e.style.opacity=0;e.style.transform="";e.getAnimations().forEach(a=>a.cancel())});
  const l=bt.querySelector(".fxl");if(l)l.innerHTML="";$("psp").style.opacity=0;$("tsp").style.opacity=0;$("tsp").className="trs";
}
// ================= evoluciones (animacion como en los juegos) =================
function evoAnim(a,b){
  return new Promise(res=>{
    const pa=PM[a],pb=PM[b];let stop=false,done=false;
    $("evoT").textContent="¿Eh? ¡"+a+" está evolucionando!";
    $("evoA").innerHTML=ico(pa,120);$("evoB").innerHTML=ico(pb,120);$("evoB").style.opacity=0;$("evoA").style.opacity=1;
    $("evoBtns").innerHTML='<button class="alt" id="evoStop">✋ Detener</button>';
    $("evo").hidden=false;$("evo").classList.remove("done");snd("flash");
    $("evoStop").onclick=()=>{stop=true};
    const A=$("evoA"),Bb=$("evoB"),st=$("evo").querySelector(".evost");
    const fin=ok=>{if(done)return;done=true;
      A.style.filter=Bb.style.filter="";
      if(ok){A.style.opacity=0;Bb.style.opacity=1;$("evo").classList.add("done");snd("lvl");setTimeout(()=>snd("win"),700);$("evoT").textContent="¡Enhorabuena! ¡Tu "+a+" ha evolucionado en "+b+"!";if(O.fx)for(let i=0;i<24;i++){const s=document.createElement("span");s.className="hsp";s.textContent=["✨","⭐","💫"][i%3];s.style.left=(10+Math.random()*80)+"%";s.style.top=(20+Math.random()*60)+"%";s.style.animationDelay=(i*.05)+"s";st.appendChild(s);setTimeout(()=>s.remove(),2400)}}
      else{A.style.opacity=1;Bb.style.opacity=0;$("evoT").textContent="¿Eh? ¡"+a+" ha dejado de evolucionar!";snd("miss")}
      $("evoBtns").innerHTML='<button class="red" id="evoOk">Continuar</button>';$("evoOk").focus();$("evoOk").onclick=()=>{$("evo").hidden=true;res(ok)}};
    let k=0;const sil="brightness(0) invert(1) drop-shadow(0 0 14px #fff)";
    A.style.filter=sil;Bb.style.filter=sil;
    const step=()=>{if(stop)return fin(false);if(k>=22)return fin(true);const on=k%2===0;A.style.opacity=on?1:0;Bb.style.opacity=on?0:1;k++;setTimeout(step,Math.max(70,560-k*24))};
    setTimeout(step,1300);
  });
}
function evoApply(a,b){
  const la=Object.assign({},lvd(a)),lb=S.lv[b];
  S.reg=S.reg||{};S.reg[a]=1;S.owned[a]=(S.owned[a]||1)-1;
  const isNew=!hasP(b);
  if(!S.owned[b]){(S.balls=S.balls||{})[b]=(S.balls&&S.balls[a])||BALLR[PM[b][2]];(S.when=S.when||{})[b]=Date.now()}
  S.owned[b]=(S.owned[b]||0)+1;if(isNew)qEv("new");
  if(S.shiny&&S.shiny[a]>0){S.shiny[a]--;if(!S.shiny[a])delete S.shiny[a];S.shiny[b]=(S.shiny[b]||0)+1}
  if(!lb||lb.l<=la.l){
    S.lv[b]={l:la.l,x:la.x};S.mv[b]=(S.mv[a]||[]).slice();S.ml=S.ml||{};S.ml[b]=la.l-1;
    if(S.pp&&S.pp[a])S.pp[b]=Object.assign({},S.pp[a]);else if(S.pp)delete S.pp[b];
    if(S.ppu&&S.ppu[a])S.ppu[b]=Object.assign({},S.ppu[a]);
    if(S.hp[a]!=null){const r=S.hp[a]/stH(PM[a],la.l);S.hp[b]=Math.round(r*stH(PM[b],la.l))}else delete S.hp[b];
  }
  [S.lv,S.mv,S.hp,S.pp||{},S.ppu||{},S.ml||{}].forEach(o=>{delete o[a]});
  if(S.owned[a]<=0)delete S.owned[a];
  const rp=t=>{const out=t.map(n=>n===a?(t.includes(b)?"":b):n);return out};
  S.team=rp(S.team||[]);(S.sets||[]).forEach(st=>{st.team=rp(st.team)});
  qEv("evo");save();
}
// lista: [[destino, metodo], ...]
async function evoPrompt(n,list){
  if(!list||!list.length)return false;
  let to=list[0][0];
  if(list.length>1){
    to=await new Promise(res=>{$("evoT").textContent=n+" puede evolucionar. ¿En cuál?";$("evoA").innerHTML=ico(PM[n],120);$("evoA").style.opacity=1;$("evoA").style.filter="";$("evoB").innerHTML="";
      $("evoBtns").innerHTML=list.map(e=>'<button data-to="'+esc(e[0])+'">'+ico(PM[e[0]],30)+' '+esc(e[0])+'</button>').join("")+'<button class="alt" data-to="">No evolucionar</button>';
      $("evo").hidden=false;$("evo").classList.remove("done");$("evoBtns").onclick=e=>{const b=e.target.closest("button");if(!b)return;$("evoBtns").onclick=null;res(b.dataset.to)}});
    if(!to){$("evo").hidden=true;return false}
  }
  const ok=await evoAnim(n,to);
  if(ok){evoApply(n,to);toast("🧬 ¡"+n+" ha evolucionado en "+to+"!");render();updTeam();setsUI&&setsUI()}
  return ok;
}
