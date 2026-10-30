// objetos evolutivos (piedras y demas objetos de los juegos originales). it[7]="evo"
const evoUsers=k=>{const o=[];Object.keys(GD.EV).forEach(n=>GD.EV[n].forEach(e=>{if(e[1]==="I"+k&&PM[n])o.push(n+" → "+e[0])}));return o.slice(0,4).join(", ")+(o.length>4?"…":"")};
const EVO_PRICE=k=>/stone/.test(k)?300000:k==="linking-cord"?450000:k==="soothe-bell"?350000:/apple|cup|pot|augurite|armor|peat|alloy|galarica|whipped|sachet/.test(k)?750000:600000;
Object.keys(GD.EI).sort((a,b)=>(/stone/.test(b)-/stone/.test(a))||GD.EI[a].localeCompare(GD.EI[b])).forEach(k=>ITEMS.push([k,GD.EI[k],EVO_PRICE(k),0,0,0,"Hace evolucionar a algunos Pokémon: "+evoUsers(k),"evo"]));

// ================= objetos equipables (cada Pokémon puede llevar uno). it[7]="hold" =================
const HOLD=[
 ["left","Restos",900000,"Recupera 1/16 de sus PS al final de cada turno"],
 ["lorb","Vidasfera",1500000,"Sus ataques hacen un 30% más de daño, pero pierde 1/10 de sus PS cada vez que golpea"],
 ["sash","Banda Focus",1200000,"Con los PS al máximo, aguanta con 1 PS un golpe que lo iba a debilitar (una vez por combate)"],
 ["sitrus","Baya Zidra",400000,"Recupera el 25% de sus PS cuando bajan de la mitad (una vez por combate)"],
 ["lum","Baya Ziuela",500000,"Se cura del primer problema de estado o de la confusión (una vez por combate)"],
 ["qclaw","Garra Rápida",700000,"A veces (20%) le permite atacar primero"],
 ["scope","Periscopio",700000,"Duplica la probabilidad de asestar golpes críticos"],
 ["shell","Campana Concha",800000,"Recupera 1/8 del daño que causa con sus ataques"],
 ["lucky","Huevo Suerte",1000000,"Gana un 50% más de experiencia en los combates"]];
const HIMG={left:"leftovers",lorb:"life-orb",sash:"focus-sash",sitrus:"sitrus-berry",lum:"lum-berry",qclaw:"quick-claw",scope:"scope-lens",shell:"shell-bell",lucky:"lucky-egg"};
const HOLDK={};HOLD.forEach(h=>{HOLDK[h[0]]=h;ITEMS.push([h[0],h[1],h[2],0,0,0,h[3]+". Se equipa desde la Mochila o desde la ficha del Pokémon","hold"])});
// ================= naturalezas: +10% en una estadística y -10% en otra (el Ataque y el Ataque Especial son la misma aquí, igual que la Defensa y la Defensa Especial) =================
const NAT=[["Fuerte"],["Huraña","atk","def"],["Audaz","atk","spe"],["Firme"],["Pícara","atk","def"],["Osada","def","atk"],["Dócil"],["Plácida","def","spe"],["Agitada","def","atk"],["Floja"],["Miedosa","spe","atk"],["Activa","spe","def"],["Seria"],["Alegre","spe","atk"],["Ingenua","spe","def"],["Modesta"],["Afable","atk","def"],["Mansa","atk","spe"],["Tímida"],["Alocada","atk","def"],["Serena","def","atk"],["Amable"],["Grosera","def","spe"],["Cauta","def","atk"],["Rara"]];
const NSTAT={atk:"Ataque",def:"Defensa",spe:"Velocidad"};
function natOf(n){S.nat=S.nat||{};if(S.nat[n]==null){if(!(S.owned&&S.owned[n]>0))return 0;S.nat[n]=Math.floor(Math.random()*NAT.length)}return S.nat[n]|0}
const natTxt=i=>{const N=NAT[i]||NAT[0];return N[1]?"+10% "+NSTAT[N[1]]+" · −10% "+NSTAT[N[2]]:"Neutra: no cambia ninguna estadística"};
const heldOf=n=>{const h=S.held&&S.held[n];return h&&HOLDK[h]?h:""};
function monX(m,nt,it){const N=NAT[nt]||NAT[0],f=k=>N[1]===k?1.1:N[2]===k?.9:1;m.nt=nt|0;m.ma*=f("atk");m.nd=f("def");m.ns=f("spe");m.it=it||"";return m}

// ================= MT: discos que enseñan un movimiento fuera de combate (un solo uso). it[7]="mt" =================
// compatibilidad oficial (aprendizaje por MT o por nivel en cualquier juego, PokeAPI): un bit por Pokémon, en el orden de P
const MTD=__MT__;
const MT_PIDX={};P.forEach((p,i)=>{MT_PIDX[p[0]]=i});
const MT_BITS={};Object.keys(MTD.c).forEach(k=>{MT_BITS[k]=atob(MTD.c[k])});
function mtOk(n,mid){const p=PM[n];if(!p)return false;mid=String(mid);const i=MT_PIDX[n],b=MT_BITS[mid];
  if(b!=null&&MTD.n===P.length&&i!=null)return !!(b.charCodeAt(i>>3)&(1<<(i&7)));const m=MVD[mid];return !!m&&(stabP(m.t,p)||m.t==="normal")}
const mtPrice=m=>m.cl===0?8e5:(m.pw||0)>=100?3e6:(m.pw||0)>=80?1.5e6:6e5;
const MT_LIST=Object.keys(MTD.c).map(k=>MVD[k]).filter(Boolean).sort((a,b)=>a.t.localeCompare(b.t)||(b.pw||0)-(a.pw||0));
MT_LIST.forEach(m=>ITEMS.push(["mt"+m.id,"MT "+m.n,mtPrice(m),0,0,0,"Enseña "+m.n+" a un Pokémon compatible (un solo uso). "+mvDesc(m),"mt"]));
