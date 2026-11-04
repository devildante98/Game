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
 ["lucky","Huevo Suerte",1000000,"Gana un 50% más de experiencia en los combates"],
 ["z_normal","Normastal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Normal (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_fire","Pirostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Fuego (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_water","Hidrostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Agua (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_electric","Electrostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Eléctrico (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_grass","Fitostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Planta (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_ice","Glaciastal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Hielo (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_fighting","Luchastal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Lucha (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_poison","Toxistal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Veneno (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_ground","Geostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Tierra (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_flying","Aerostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Volador (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_psychic","Psicostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Psíquico (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_bug","Insectostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Bicho (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_rock","Litostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Roca (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_ghost","Espectrostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Fantasma (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_dragon","Dracostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Dragón (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_dark","Nictostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Siniestro (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_steel","Metalostal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Acero (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["z_fairy","Feeristal Z",0,"Permite usar una vez por combate el movimiento Z de tipo Hada (si conoce un ataque de ese tipo). Se consigue venciendo a Pokémon dominantes"],
 ["zx_incin","Incinostal Z",0,"Cristal Z exclusivo de Incineroar: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_decid","Decidustal Z",0,"Cristal Z exclusivo de Decidueye: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_prima","Primastal Z",0,"Cristal Z exclusivo de Primarina: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_pika","Pikastal Z",0,"Cristal Z exclusivo de Pikachu: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_raichu","Raichustal Z",0,"Cristal Z exclusivo de Raichu de Alola: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_snor","Snorlastal Z",0,"Cristal Z exclusivo de Snorlax: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_mimi","Mimikyustal Z",0,"Cristal Z exclusivo de Mimikyu: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_lycan","Lycanrostal Z",0,"Cristal Z exclusivo de Lycanroc: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_kommo","Kommostal Z",0,"Cristal Z exclusivo de Kommo-o: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_solga","Solgalestal Z",0,"Cristal Z exclusivo de Solgaleo: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_luna","Lunalastal Z",0,"Cristal Z exclusivo de Lunala: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_marsha","Marshastal Z",0,"Cristal Z exclusivo de Marshadow: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_tapu","Tapustal Z",0,"Cristal Z exclusivo de los Tapus: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_mew","Mewstal Z",0,"Cristal Z exclusivo de Mew: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"],
 ["zx_unec","Ultranecrostal Z",0,"Cristal Z exclusivo de Ultra-Necrozma: le permite usar su movimiento Z propio una vez por combate (si conoce su movimiento característico)"]];
const HIMG={left:"leftovers",lorb:"life-orb",sash:"focus-sash",sitrus:"sitrus-berry",lum:"lum-berry",qclaw:"quick-claw",scope:"scope-lens",shell:"shell-bell",lucky:"lucky-egg"};
const HOLDK={};HOLD.forEach(h=>{HOLDK[h[0]]=h;ITEMS.push([h[0],h[1],h[2],0,0,0,h[3]+". Se equipa desde la Mochila o desde la ficha del Pokémon","hold"])});
// ================= naturalezas: +10% en una estadística y -10% en otra (el Ataque y el Ataque Especial son la misma aquí, igual que la Defensa y la Defensa Especial) =================
const NAT=[["Fuerte"],["Huraña","atk","def"],["Audaz","atk","spe"],["Firme","atk","spa"],["Pícara","atk","spd"],["Osada","def","atk"],["Dócil"],["Plácida","def","spe"],["Agitada","def","spa"],["Floja","def","spd"],["Miedosa","spe","atk"],["Activa","spe","def"],["Seria"],["Alegre","spe","spa"],["Ingenua","spe","spd"],["Modesta","spa","atk"],["Afable","spa","def"],["Mansa","spa","spe"],["Tímida"],["Alocada","spa","spd"],["Serena","spd","atk"],["Amable","spd","def"],["Grosera","spd","spe"],["Cauta","spd","spa"],["Rara"]];
const NSTAT={atk:"Ataque",def:"Defensa",spa:"Ataque Especial",spd:"Defensa Especial",spe:"Velocidad"};
function natOf(n){S.nat=S.nat||{};if(S.nat[n]==null){if(!(S.owned&&S.owned[n]>0))return 0;S.nat[n]=Math.floor(Math.random()*NAT.length)}return S.nat[n]|0}
const natTxt=i=>{const N=NAT[i]||NAT[0];return N[1]?"+10% "+NSTAT[N[1]]+" · −10% "+NSTAT[N[2]]:"Neutra: no cambia ninguna estadística"};
// Mentas (como en Espada y Escudo): cambian la naturaleza de un Pokémon
const MINTS=NAT.map((N,i)=>[N,i]).filter(x=>x[0][1]||x[0][0]==="Seria");
MINTS.forEach(([N,i])=>ITEMS.push(["mint"+i,"Menta "+N[0],400000,0,0,0,"Cambia la naturaleza de un Pokémon a "+N[0]+" ("+natTxt(i)+")","mint"]));
const heldOf=n=>{const h=S.held&&S.held[n];return h&&HOLDK[h]?h:""};
function monX(m,nt,it){const N=NAT[nt]||NAT[0],f=k=>N[1]===k?1.1:N[2]===k?.9:1;m.nt=nt|0;m.na=f("atk");m.nsa=f("spa");m.nd=f("def");m.nsd=f("spd");m.ns=f("spe");m.it=it||"";return m}

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
