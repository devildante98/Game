// =====================================================================================
// TICKETS DE EXPLORACIÓN: una cartera aparte de la del juego normal.
// En Exploración solo se gastan los tickets ganados en Exploración (combates, historia, ventas en la tienda).
// Los tickets del juego normal no se pueden usar aquí, ni al revés.
// =====================================================================================
const XT0=30000;   // tickets para empezar
function xT(){const X=xgData();if(typeof X.t!=="number"||!isFinite(X.t)||X.t<0){let b=0;try{b=typeof xbCount==="function"?xbCount():0}catch(e){}X.t=XT0+b*20000}return X.t}
function xTadd(n){xT();S.xg.t=Math.max(0,Math.round(S.xg.t+(+n||0)))}
const xTtxt=n=>fmt(Math.round(n))+" 🎟️";
// premios de la historia: los tickets van a la cartera de Exploración y los objetos a la mochila de Exploración
sGive=function(r){const t=Math.round(r.t||0);if(t)xTadd(t);if(r.it&&Object.keys(r.it).length)xgRun(()=>{grant({it:r.it})});save();try{render()}catch(e){}snd("lvl");
  return [t?xTtxt(t):""].concat(Object.keys(r.it||{}).map(k=>r.it[k]+" "+IN(k))).filter(x=>x).join(" + ")};
// premio por ganar combates en Exploración, como el dinero de los juegos
{const _eb=exBattle;exBattle=function(cfg,npc){const pr=_eb.apply(this,arguments);try{if(EX.battle){let rw;
    if(cfg&&cfg.eteam&&cfg.eteam.length){const sl=cfg.eteam.reduce((a,m)=>a+(m.l|0),0);rw=Math.round(sl*(cfg.trainer?60:30))}
    else{const L=(S.team||[]).filter(n=>n&&S.owned[n]).map(n=>lvd(n).l);rw=Math.round((L.length?Math.max(...L):5)*25)}
    EX.battle.rw=Math.max(50,rw)}}catch(e){}return pr}}
// Centro Pokémon de Exploración: gratis, como en los juegos
STX.enf=()=>stRun(async()=>{
  await sSay(S_("Enfermera","¡Hola! Te damos la bienvenida al "+(EX.M&&EX.M.n&&EX.M.n!=="Centro Pokémon"?EX.M.n:"Centro Pokémon de Pueblo Brisa")+"."));
  const i=await sChoice("¿Curar a tus Pokémon?",[{t:"Sí, por favor"},{t:"No, gracias"}]);
  if(i!==0){await sSay(S_("Enfermera","¡Esperamos verte pronto!"));return}
  try{qEv("heal")}catch(e){}
  await sSay(S_("Enfermera","¡Muy bien! Deja tus Poké Balls aquí un momento…"));snd("heal");try{healJingle()}catch(e){}await sFade("fade",350);stHeal();await sW(900);await sFade("fadein",450);
  await sSay(S_("Enfermera","¡Tus Pokémon están totalmente recuperados! ¡Esperamos verte pronto!"))});
// marcador de tickets de Exploración en la pantalla del mapa
setInterval(()=>{const sc=document.querySelector("#explPB .exscr");if(!sc)return;let e=$("exMoney");
  if(!e){e=document.createElement("div");e.id="exMoney";e.className="exmoney";e.title="Tickets de Exploración (aparte de los del juego normal)";sc.appendChild(e)}
  const t="🎟️ "+fmt(xT());if(e.textContent!==t)e.textContent=t},500);

// =====================================================================================
// MÁS OBJETOS EQUIPABLES DE LA SAGA (juego normal y Exploración)
// =====================================================================================
const TYN={normal:"Normal",fire:"Fuego",water:"Agua",electric:"Eléctrico",grass:"Planta",ice:"Hielo",fighting:"Lucha",poison:"Veneno",ground:"Tierra",flying:"Volador",psychic:"Psíquico",bug:"Bicho",rock:"Roca",ghost:"Fantasma",dragon:"Dragón",dark:"Siniestro",steel:"Acero",fairy:"Hada"};
// objetos que potencian un tipo un 20 %
const HB_TYPE=[["hb_fire","Carbón","fire","charcoal"],["hb_water","Agua Mística","water","mystic-water"],["hb_elec","Imán","electric","magnet"],["hb_grass","Semilla Milagro","grass","miracle-seed"],
 ["hb_ice","Antiderretir","ice","never-melt-ice"],["hb_fight","Cinturón Negro","fighting","black-belt"],["hb_pois","Flecha Venenosa","poison","poison-barb"],["hb_grnd","Arena Fina","ground","soft-sand"],
 ["hb_fly","Pico Afilado","flying","sharp-beak"],["hb_psy","Cuchara Torcida","psychic","twisted-spoon"],["hb_bug","Polvo Plata","bug","silver-powder"],["hb_rock","Piedra Dura","rock","hard-stone"],
 ["hb_ghost","Hechizo","ghost","spell-tag"],["hb_drag","Colmillo Dragón","dragon","dragon-fang"],["hb_dark","Gafas de Sol","dark","black-glasses"],["hb_steel","Tabla Acero","steel","iron-plate"],
 ["hb_norm","Pañuelo Seda","normal","silk-scarf"],["hb_fairy","Tabla Duende","fairy","pixie-plate"]];
// bayas que reducen a la mitad un ataque supereficaz de su tipo (la Baya Chilan, cualquier ataque Normal)
const HB_RES=[["rb_fire","Baya Caoca","fire","occa-berry"],["rb_water","Baya Pasio","water","passho-berry"],["rb_elec","Baya Gualot","electric","wacan-berry"],["rb_grass","Baya Tamar","grass","rindo-berry"],
 ["rb_ice","Baya Rimoya","ice","yache-berry"],["rb_fight","Baya Pomaro","fighting","chople-berry"],["rb_pois","Baya Kebia","poison","kebia-berry"],["rb_grnd","Baya Acardo","ground","shuca-berry"],
 ["rb_fly","Baya Kouba","flying","coba-berry"],["rb_psy","Baya Payapa","psychic","payapa-berry"],["rb_bug","Baya Yecana","bug","tanga-berry"],["rb_rock","Baya Alcho","rock","charti-berry"],
 ["rb_ghost","Baya Drasi","ghost","kasib-berry"],["rb_drag","Baya Anjiro","dragon","haban-berry"],["rb_dark","Baya Dillo","dark","colbur-berry"],["rb_steel","Baya Baribá","steel","babiri-berry"],
 ["rb_norm","Baya Chilan","normal","chilan-berry"],["rb_fairy","Baya Hibis","fairy","roseli-berry"]];
const HB_TY={},HB_RT={};HB_TYPE.forEach(h=>{HB_TY[h[0]]=h[2]});HB_RES.forEach(h=>{HB_RT[h[0]]=h[2]});
const HB_MORE=[
 ["xshare","Repartir Experiencia",1500000,"Gana la mitad de la experiencia de los combates aunque no haya luchado","exp-share"],
 ["amcoin","Moneda Amuleto",2000000,"Si lo lleva un Pokémon de tu equipo, los combates dan el doble de tickets","amulet-coin"],
 ["everst","Piedra Eterna",200000,"Impide que evolucione al subir de nivel","everstone"],
 ["cleanse","Amuleto",400000,"En Exploración, si lo lleva el primero del equipo, aparecen menos Pokémon salvajes","cleanse-tag"],
 ["fband","Cinta Aguante",700000,"A veces (10 %) aguanta con 1 PS un golpe que lo iba a debilitar","focus-band"],
 ["wpol","Seguro Debilidad",900000,"Si recibe un ataque supereficaz, su Ataque y su Ataque Especial suben mucho (una vez por combate)","weakness-policy"],
 ["abulb","Tubérculo",500000,"Si recibe un ataque de tipo Agua, sube su Ataque Especial (una vez por combate)","absorb-bulb"],
 ["cbatt","Pila",500000,"Si recibe un ataque de tipo Eléctrico, sube su Ataque (una vez por combate)","cell-battery"],
 ["snowb","Bola de Nieve",500000,"Si recibe un ataque de tipo Hielo, sube su Ataque (una vez por combate)","snowball"],
 ["lmoss","Musgo Brillante",500000,"Si recibe un ataque de tipo Agua, sube su Defensa Especial (una vez por combate)","luminous-moss"],
 ["ppads","Paracontacto",600000,"No sufre daño ni efectos al golpear con ataques físicos (Casco Dentado, Piel Tosca…)","protective-pads"],
 ["bpol","Seguro Fallo",500000,"Si falla un ataque, su Velocidad sube mucho (una vez por combate)","blunder-policy"],
 ["zlens","Telescopio",600000,"Si ataca después del rival, sus ataques tienen un 20 % más de precisión","zoom-lens"],
 ["broot","Raíz Grande",500000,"Los ataques que absorben PS le curan un 30 % más","big-root"],
 ["camulet","Amuleto Puro",900000,"El rival no puede bajarle las características","clear-amulet"],
 ["ccloak","Capa Furtiva",900000,"Los efectos secundarios de los ataques del rival no le afectan","covert-cloak"],
 ["ldice","Dado Trucado",700000,"Sus ataques de 2 a 5 golpes dan casi siempre 4 o 5","loaded-dice"],
 ["tclub","Hueso Grueso",600000,"Si lo lleva Cubone o Marowak, duplica su Ataque","thick-club"],
 ["leek","Puerro",500000,"Si lo lleva Farfetch'd o Sirfetch'd, da golpes críticos mucho más a menudo","leek"],
 ["lpunch","Puño Suerte",500000,"Si lo lleva Chansey, da golpes críticos mucho más a menudo","lucky-punch"],
 ["sdew","Rocío Bondad",1500000,"Si lo lleva Latias o Latios, sus ataques de tipo Psíquico y Dragón hacen un 20 % más de daño","soul-dew"],
 ["adorb","Diamansfera",1500000,"Si lo lleva Dialga, sus ataques de tipo Acero y Dragón hacen un 20 % más de daño","adamant-orb"],
 ["lsorb","Lustresfera",1500000,"Si lo lleva Palkia, sus ataques de tipo Agua y Dragón hacen un 20 % más de daño","lustrous-orb"],
 ["grorb","Griseosfera",1500000,"Si lo lleva Giratina, sus ataques de tipo Fantasma y Dragón hacen un 20 % más de daño","griseous-orb"],
 ["qpow","Polvo Veloz",400000,"Si lo lleva Ditto, duplica su Velocidad","quick-powder"],
 ["mpow","Polvo Metálico",400000,"Si lo lleva Ditto, los ataques físicos le hacen la mitad de daño","metal-powder"],
 ["oran","Baya Aranja",150000,"Recupera 10 PS cuando bajan de la mitad (una vez por combate)","oran-berry"],
 ["figy","Baya Higog",450000,"Recupera un tercio de sus PS cuando bajan de un cuarto (una vez por combate)","figy-berry"],
 ["liechi","Baya Lichi",600000,"Sube su Ataque cuando sus PS bajan de un cuarto (una vez por combate)","liechi-berry"],
 ["ganlon","Baya Gonlan",600000,"Sube su Defensa cuando sus PS bajan de un cuarto (una vez por combate)","ganlon-berry"],
 ["salac","Baya Aslac",600000,"Sube su Velocidad cuando sus PS bajan de un cuarto (una vez por combate)","salac-berry"],
 ["petaya","Baya Yapati",600000,"Sube su Ataque Especial cuando sus PS bajan de un cuarto (una vez por combate)","petaya-berry"],
 ["apicot","Baya Aricoc",600000,"Sube su Defensa Especial cuando sus PS bajan de un cuarto (una vez por combate)","apicot-berry"],
 ["cheri","Baya Zreza",200000,"Cura la parálisis (una vez por combate)","cheri-berry"],
 ["chesto","Baya Atania",200000,"Le despierta si se duerme (una vez por combate)","chesto-berry"],
 ["pecha","Baya Meloc",200000,"Cura el envenenamiento (una vez por combate)","pecha-berry"],
 ["rawst","Baya Safre",200000,"Cura las quemaduras (una vez por combate)","rawst-berry"],
 ["aspear","Baya Perasi",200000,"Le descongela (una vez por combate)","aspear-berry"]];
{const add=(id,n,pr,d,img)=>{if(HOLDK[id])return;const h=[id,n,pr,d];HOLD.push(h);HOLDK[id]=h;ITEMS.push([id,n,pr,0,0,0,d+". Se equipa desde la Mochila o desde la ficha del Pokémon","hold"]);if(img)HIMG[id]=img};
  HB_TYPE.forEach(h=>add(h[0],h[1],900000,"Sus ataques de tipo "+TYN[h[2]]+" hacen un 20 % más de daño",h[3]));
  HB_RES.forEach(h=>add(h[0],h[1],400000,h[2]==="normal"?"Recibe la mitad de daño de un ataque de tipo Normal (una vez por combate)":"Recibe la mitad de daño de un ataque supereficaz de tipo "+TYN[h[2]]+" (una vez por combate)",h[3]));
  HB_MORE.forEach(h=>add(h[0],h[1],h[2],h[3],h[4]))}
const hbIs=(m,re)=>!!(m&&m.p&&re.test(m.p[0]));
// daño: tipo, objetos de especie, bayas de resistencia, Polvo Metálico y los objetos que reaccionan al recibir un golpe
{const _d=itDmg;itDmg=function(me,tm,mv,phy,e){let k=_d.apply(this,arguments);try{const a=me&&me.it,d=tm&&tm.it,ty=typeof axTy==="function"?axTy(me,mv):mv.t;
  if(a&&HB_TY[a]===ty)k*=1.2;
  if(a==="tclub"&&phy&&hbIs(me,/^(Cubone|Marowak)/))k*=2;
  if((a==="sdew"&&hbIs(me,/^(Latias|Latios)/)&&(ty==="psychic"||ty==="dragon"))||(a==="adorb"&&hbIs(me,/^Dialga/)&&(ty==="steel"||ty==="dragon"))||(a==="lsorb"&&hbIs(me,/^Palkia/)&&(ty==="water"||ty==="dragon"))||(a==="grorb"&&hbIs(me,/^Giratina/)&&(ty==="ghost"||ty==="dragon")))k*=1.2;
  if(d==="mpow"&&phy&&hbIs(tm,/^Ditto/))k*=.5;
  if(d&&HB_RT[d]&&!tm.ius&&HB_RT[d]===ty&&(e>1||ty==="normal")){k*=.5;tm.ius=1;tm._im=d}
  if(!tm.ius&&((d==="wpol"&&e>1)||(d==="abulb"&&ty==="water")||(d==="cbatt"&&ty==="electric")||(d==="snowb"&&ty==="ice")||(d==="lmoss"&&ty==="water"))){tm.ius=1;tm._ib=d}
 }catch(x){}return k}}
// bayas y objetos que se activan después de un golpe o al final del turno
const HB_ST={liechi:"atk",ganlon:"def",salac:"spe",petaya:"spa",apicot:"spd"},HB_CURE={cheri:["par"],chesto:["slp"],pecha:["psn","tox"],rawst:["brn"],aspear:["frz"]};
{const _b=beBerry;beBerry=function(E,j,push){_b.apply(this,arguments);try{const m=beAct(E.sd[j]);if(!m||m.mh<=0)return;const it=m.it;
  if(m._im){push({k:"item",s:j,n:m.p[0],it:"rbX",nm:m._im});m._im=null}
  if(m._ib){const b=m._ib;m._ib=null;push({k:"item",s:j,n:m.p[0],it:b});beStat(E,j,b==="wpol"?[["atk",2],["spa",2]]:b==="abulb"?[["spa",1]]:b==="lmoss"?[["spd",1]]:[["atk",1]],push,j)}
  if(m.ius||typeof axNoBerry==="function"&&axNoBerry(E,j))return;
  if(it==="oran"&&m.mh<=m.mx/2){m.ius=1;m.mh=Math.min(m.mx,m.mh+10);push({k:"item",s:j,n:m.p[0],it:"oran"})}
  else if(it==="figy"&&m.mh<=m.mx/4){m.ius=1;m.mh=Math.min(m.mx,m.mh+Math.max(1,Math.round(m.mx/3)));push({k:"item",s:j,n:m.p[0],it:"figy"})}
  else if(HB_ST[it]&&m.mh<=m.mx/4){m.ius=1;push({k:"item",s:j,n:m.p[0],it:"pinch",nm:it});beStat(E,j,[[HB_ST[it],1]],push,j)}
  else if(HB_CURE[it]&&HB_CURE[it].includes(m.sts)){m.ius=1;m.sts="";m.slp=0;m.tox=0;push({k:"item",s:j,n:m.p[0],it:"cure",nm:it})}
 }catch(x){}}}
// Amuleto Puro: el rival no puede bajarle las características
{const _p=axStatPre;axStatPre=function(E,j,ch,push,src,tag){let r=_p.apply(this,arguments);try{const m=beAct(E.sd[j]);if(m&&m.it==="camulet"&&src!=null&&src!==j&&Array.isArray(r)&&r.some(q=>q[1]<0)){r=r.filter(q=>q[1]>0);push({k:"item",s:j,n:m.p[0],it:"camulet"})}}catch(x){}return r}}
Object.assign(ITMSG,{
  rbX:["",(w,e)=>"¡La "+IN(e&&e.nm)+" de "+w+" ha debilitado el ataque!"],
  wpol:["",w=>"¡El Seguro Debilidad de "+w+" se ha activado!"],abulb:["",w=>"¡El Tubérculo de "+w+" se ha activado!"],cbatt:["",w=>"¡La Pila de "+w+" se ha activado!"],snowb:["",w=>"¡La Bola de Nieve de "+w+" se ha activado!"],lmoss:["",w=>"¡El Musgo Brillante de "+w+" se ha activado!"],
  oran:["h",w=>"¡"+w+" ha recuperado PS con la Baya Aranja!"],figy:["h",w=>"¡"+w+" ha recuperado PS con la Baya Higog!"],
  pinch:["",(w,e)=>"¡"+w+" se ha comido la "+IN(e&&e.nm)+"!"],cure:["h",(w,e)=>"¡La "+IN(e&&e.nm)+" ha curado a "+w+"!"],
  camulet:["",w=>"¡El Amuleto Puro de "+w+" impide que le bajen las características!"],fband:["",w=>"¡"+w+" ha aguantado el golpe gracias a la Cinta Aguante!"],
  bpol:["",w=>"¡El Seguro Fallo de "+w+" se ha activado!"]});
// tiendas de Exploración: cada pueblo vende los objetos nuevos que encajan con su zona, y mejoran región a región
{const ORD=["pueblo","pe","pn","pb","vv","ct","pc","cl"],TIER=[["oran","cheri","pecha","everst","xshare"],["chesto","rawst","aspear","cleanse","amcoin","broot"],["figy","fband","zlens","bpol","abulb","lmoss"],
  ["liechi","petaya","salac","cbatt","snowb","ppads"],["ganlon","apicot","wpol","ldice","camulet"],["ccloak","tclub","leek","lpunch","qpow","mpow"],["sdew","adorb","lsorb","grorb"],[]];
 const tyH=t=>(HB_TYPE.find(h=>h[2]===t)||[])[0],tyR=t=>(HB_RES.find(h=>h[2]===t)||[])[0];
 ORD.forEach((k,i)=>{const T=typeof XS_TOWN!=="undefined"&&XS_TOWN[k];if(!T)return;T.hold=T.hold||[];
  TIER[i].forEach(id=>{if(!T.hold.includes(id))T.hold.push(id)});
  (T.mt||[]).forEach(([ty])=>{[tyH(ty),tyR(ty)].forEach(id=>{if(id&&!T.hold.includes(id))T.hold.push(id)})});
  if(i===ORD.length-1)HB_TYPE.concat(HB_RES).forEach(h=>{if(!T.hold.includes(h[0]))T.hold.push(h[0])})})}
