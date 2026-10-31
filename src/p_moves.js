const BT={};"fire:grass,ice,bug,steel;water:fire,ground,rock;grass:water,ground,rock;electric:water,flying;ground:electric,fire,rock,poison,steel;psychic:fighting,poison;ghost:psychic,ghost;dark:psychic,ghost;fighting:normal,rock,dark,ice,steel;ice:grass,dragon,flying,ground;dragon:dragon;fairy:dragon,fighting,dark;bug:grass,psychic,dark;rock:fire,ice,flying,bug;steel:ice,rock,fairy;poison:grass,fairy;flying:grass,fighting,bug".split(";").forEach(s=>{const q=s.split(":");BT[q[0]]=q[1].split(",")});
const adv=(a,d)=>(BT[a]||[]).includes(d);
// segundo tipo de cada Pokémon (datos oficiales de PokeAPI); T1 corrige el tipo principal de algunas formas
const TT=__T2__;Object.keys(TT.T1).forEach(n=>{const p=P.find(x=>x[0]===n);if(p)p[1]=TT.T1[n]});const T2=TT.T2;
const ty2=p=>(p&&T2[p[0]])||null,tys=p=>ty2(p)?[p[1],ty2(p)]:[p[1]];
const effP=(a,p)=>tys(p).reduce((m,t)=>m*eff(a,t),1),stabP=(t,p)=>tys(p).includes(t);
const tyNm=p=>tys(p).map(t=>TIPO[t]).join(" / "),tyTxt=p=>tys(p).map(t=>EM[t]+" "+TIPO[t]).join(" · ");
const WW={C:1,R:2,E:3,L:4},HPM={C:90,R:120,E:150,L:180},ATK={C:15,R:20,E:25,L:30};
const lvd=n=>S.lv[n]||(S.lv[n]={l:1,x:0});
const stH=(p,l)=>HPM[p[2]]+(l-1)*8,stA=(p,l)=>ATK[p[2]]+(l-1)*1.5,need=l=>25*l;
// ================= movimientos originales de la saga (datos de PokeAPI) =================
// cada movimiento: tipo, potencia, precision, PP, prioridad, clase (0 estado, 1 fisico, 2 especial) y efectos
const TL={n:"normal",f:"fire",w:"water",g:"grass",e:"electric",p:"psychic",h:"ghost",d:"dragon",b:"bug",x:"poison",r:"rock",o:"ground",t:"fighting",y:"fairy",i:"ice",a:"flying",s:"steel",k:"dark"};
const MVD={},MVX=[];
function mvParse(r){
  const m={id:String(r[0]),n:r[1],t:TL[r[2]],pw:r[3],ac:r[4],pp:r[5],pr:r[6],cl:r[7],fx:r[8],ch:[]};
  (r[9]||"").split(" ").filter(x=>x).forEach(tk=>{
    const c=tk[0],v=tk.slice(1);
    if(c==="p")m.prot=1;else if(c==="R")m.rest=1;else if(c==="h")m.heal=+v;else if(c==="d")m.drain=+v;else if(c==="r")m.rec=+v;
    else if(c==="m"){const q=v.split("-");m.hits=[+q[0],+q[1]]}
    else if(c==="a"){const q=v.match(/^([a-z]+)(\d+)$/);m.ail=q[1];m.ailc=+q[2]}
    else if(c==="S"||c==="T"){const q=v.split(":");m.sc=+q[1];m.self=c==="S";m.ch=q[0].split(",").map(x=>{const z=x.match(/^([a-z]+)([+-]\d)$/);return [z[1],+z[2]]})}
    else if(c==="f")m.fl=+v;else if(c==="c")m.crit=1;else if(c==="x")m.kami=1;else if(c==="z")m.rech=1;
    else if(c==="F")m.fixed=+v;else if(c==="L")m.flv=1;else if(c==="H")m.half=1;
  });
  m.tself=m.cl===0&&!m.ail&&(m.prot||m.rest||m.heal||m.self);
  return m;
}
GD.MV.forEach(r=>{const m=mvParse(r);MVD[m.id]=m;MVX.push(m)});
const STRUG={id:"forc",n:"Forcejeo",t:"normal",pw:50,ac:0,pp:1,pr:0,cl:1,fx:"c",ch:[],rec:25,typeless:1};
const MVI=id=>id==="forc"?STRUG:MVD[id];
// aprendizaje por nivel (como en los juegos): [[nivel, id], ...]
const _ls={};
function learnRaw(n){
  const s=GD.LS[n]||"",o=[];
  for(let i=0;i+3<s.length;i+=4){const m=MVX[parseInt(s.slice(i+2,i+4),36)];if(m)o.push([parseInt(s.slice(i,i+2),36),m.id])}
  return o;
}
// Muchos Pokémon (sobre todo los evolucionados y legendarios) tienen un montón de movimientos "de nivel 1".
// Para que vayan aprendiendo a medida que suben de nivel, como en los juegos: empiezan con 2 de ellos
// (el ataque más flojo y uno de estado o el siguiente más flojo) y el resto se aprende cada 4 niveles, de menos a más fuerte.
function learn(n){
  if(_ls[n])return _ls[n];
  const raw=learnRaw(n),later=new Set(raw.filter(x=>x[0]>1).map(x=>x[1])),pile=[];
  raw.forEach(x=>{if(x[0]<=1&&!later.has(x[1])&&!pile.includes(x[1]))pile.push(x[1])});
  const pw=id=>{const m=MVD[id];return m&&m.cl?(m.pw||40):0};
  const dmg=pile.filter(id=>MVD[id]&&MVD[id].cl).sort((a,b)=>pw(a)-pw(b)),st=pile.filter(id=>!(MVD[id]&&MVD[id].cl));
  const start=[];if(dmg.length)start.push(dmg[0]);const sec=st[0]||dmg[1];if(sec)start.push(sec);if(!start.length&&pile.length)start.push(pile[0]);
  // el resto alterna ataques (de menos a más fuerte) y movimientos de estado, para no quedarse sin ataques
  const rd=dmg.filter(id=>!start.includes(id)),rs=st.filter(id=>!start.includes(id)),rest=[];
  while(rd.length||rs.length){if(rd.length)rest.push(rd.shift());if(rs.length)rest.push(rs.shift())}
  const o=start.map(id=>[1,id]).concat(rest.map((id,i)=>[4*(i+1),id]),raw.filter(x=>x[0]>1));
  o.sort((a,b)=>a[0]-b[0]);
  return _ls[n]=o;
}
function defMoves(n,l){
  const ls=learn(n);let a=ls.filter(x=>x[0]<=l).map(x=>x[1]);
  if(!a.length)a=ls.slice(0,2).map(x=>x[1]);
  const u=[];for(let i=a.length-1;i>=0&&u.length<4;i--)if(!u.includes(a[i]))u.unshift(a[i]);
  // que tenga al menos un ataque que haga daño
  const hit=id=>MVD[id]&&MVD[id].cl;if(u.length&&!u.some(hit)){const h=a.slice().reverse().find(hit)||ls.map(x=>x[1]).find(hit);if(h){if(u.length<4)u.push(h);else u[0]=h}}
  return u.length?u:["33"];
}
function moveIds(n){
  let m=S.mv[n];S.ml=S.ml||{};
  if(!Array.isArray(m)||!m.length||m.some(id=>!MVD[id])){m=defMoves(n,lvd(n).l);S.mv[n]=m;S.ml[n]=lvd(n).l}
  if(S.ml[n]==null)S.ml[n]=lvd(n).l;
  return m;
}
const moves=p=>moveIds(p[0]).map(MVI);
const PPB=id=>(MVD[id]&&MVD[id].pp)||10;
const ppUps=(n,id)=>(S.ppu&&S.ppu[n]&&S.ppu[n][id])||0;
const ppMax=(n,id)=>Math.round(PPB(id)*(1+.2*ppUps(n,id)));
const ppCur=(n,id)=>{const v=S.pp&&S.pp[n]&&S.pp[n][id];return v==null?ppMax(n,id):Math.max(0,Math.min(v,ppMax(n,id)))};
function ppSet(n,id,v){S.pp=S.pp||{};const o=S.pp[n]||(S.pp[n]={});if(v>=ppMax(n,id))delete o[id];else o[id]=Math.max(0,v);if(!Object.keys(o).length)delete S.pp[n]}
const ppLow=n=>moves(PM[n]).some(m=>ppCur(n,m.id)<ppMax(n,m.id));
// objetos de PP: one = un solo movimiento, amt = PP que recupera
const PPI={eter:{one:1,amt:10},meter:{one:1,amt:999},elix:{amt:10},melix:{amt:999}};
const mname=mv=>mv.n;
const STN={atk:"Ataque",def:"Defensa",spe:"Velocidad",acc:"Precisión",eva:"Evasión"};
const AILN={par:"paralizar",slp:"dormir",frz:"congelar",brn:"quemar",psn:"envenenar",tox:"envenenar gravemente",cnf:"confundir"};
const CLN=["Estado","Físico","Especial"];
function mvEff(m){
  const o=[];
  if(m.prot)o.push("Te protege de los ataques este turno");
  if(m.rest)o.push("Recupera todos los PS pero se duerme 2 turnos");
  if(m.heal)o.push("Recupera el "+m.heal+"% de los PS");
  if(m.drain)o.push("Absorbe el "+m.drain+"% del daño causado");
  if(m.rec)o.push("Retroceso del "+m.rec+"%");
  if(m.hits)o.push("Golpea "+(m.hits[0]===m.hits[1]?m.hits[0]:m.hits[0]+"-"+m.hits[1])+" veces");
  if(m.ail)o.push((m.ailc<100?m.ailc+"% de ":"")+(m.ailc<100?"":"Puede ")+AILN[m.ail]);
  if(m.ch.length)o.push((m.sc<100?m.sc+"%: ":"")+m.ch.map(x=>(x[1]>0?"sube ":"baja ")+STN[x[0]]+(Math.abs(x[1])>1?" mucho":"")).join(", ")+(m.self?" (propio)":" (rival)"));
  if(m.fl)o.push(m.fl+"% de hacer retroceder");
  if(m.crit)o.push("Crítico fácil");
  if(m.kami)o.push("El usuario se debilita");
  if(m.rech)o.push("Debe descansar después");
  if(m.pr>0)o.push("Ataca primero");
  if(m.fixed)o.push("Quita "+m.fixed+" PS fijos");
  if(m.flv)o.push("Quita tantos PS como su nivel");
  if(m.half)o.push("Quita la mitad de los PS del rival");
  return o.join(" · ");
}
const mvDesc=m=>EM[m.t]+" "+TIPO[m.t]+" · "+CLN[m.cl]+(m.cl?" · Poder "+(m.fixed||m.flv||m.half?"—":m.pw):"")+" · Prec. "+(m.ac||"—")+" · PP "+m.pp+(mvEff(m)?" · "+mvEff(m):"");
// ================= evoluciones =================
const EVO=n=>GD.EV[n]||[];
const hasP=n=>(S.owned[n]||0)>0||!!(S.reg&&S.reg[n]);
const evoLvReady=n=>EVO(n).filter(e=>e[1][0]==="L"&&lvd(n).l>=+e[1].slice(1)&&PM[e[0]]);
const evoByItem=(n,it)=>EVO(n).filter(e=>e[1]==="I"+it&&PM[e[0]]);
const evoMeth=e=>e[1][0]==="L"?"nivel "+e[1].slice(1):(ITEMS.find(i=>i[0]===e[1].slice(1))||[0,e[1].slice(1)])[1];
// limpieza de datos de versiones anteriores (movimientos antiguos)
(function(){
  [S.pp,S.ppu].forEach(o=>{if(!o)return;for(const n in o){for(const k in o[n])if(!MVD[k])delete o[n][k];if(!Object.keys(o[n]).length)delete o[n]}});
  if(S.mv)for(const n in S.mv)if(!Array.isArray(S.mv[n])||S.mv[n].some(id=>!MVD[id]))delete S.mv[n];
  delete S.ab;delete S.ofd;
})();
