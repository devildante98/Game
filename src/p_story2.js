// =====================================================================================
// HISTORIA · ACTOS II, III y IV: «La saga de las tres aves»
// Regiones de Escarcha (nieve), Brasa (volcán) y Tormenta, el barco del marinero y el Equipo Tempestad.
// =====================================================================================
// ---------- colores de cada región (se repintan las casillas una sola vez y se guardan) ----------
const XPAL=new WeakMap();
function xPal(c,pal){if(!c||!pal)return c;let m=XPAL.get(c);if(!m){m={};XPAL.set(c,m)}if(m[pal])return m[pal];
  const o=document.createElement("canvas");o.width=c.width;o.height=c.height;const g=o.getContext("2d");g.drawImage(c,0,0);
  let d;try{d=g.getImageData(0,0,o.width,o.height)}catch(e){return m[pal]=c}const p=d.data,cl=v=>v<0?0:v>255?255:v;
  for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const r=p[i],gg=p[i+1],b=p[i+2],l=(r+gg+b)/3,t=l/255;
    const green=gg>r+8&&gg>=b-6,blue=b>r+25&&b>=gg-4,brown=r>b+18&&r>=gg-10&&!green;
    let R=r,G=gg,Bb=b;
    if(pal==="snow"){if(green){R=168+t*90;G=182+t*76;Bb=204+t*55}else if(blue){R=r*.5+120;G=gg*.5+130;Bb=b*.4+150}}
    else if(pal==="ice"){if(brown||!blue){R=l*.62+40;G=l*.78+52;Bb=l*.9+70}else{R=r*.6+90;G=gg*.6+110;Bb=b*.5+140}}
    else if(pal==="ash"){if(green){R=64+t*90;G=52+t*64;Bb=50+t*50}else if(blue){R=225+t*30;G=70+t*150;Bb=20+t*40}else if(brown||r>150){R=r*.72;G=gg*.62;Bb=b*.6}}
    else if(pal==="magma"){if(blue){R=235+t*20;G=80+t*140;Bb=20+t*30}else{R=l*.85+42;G=l*.48+10;Bb=l*.42+8}}
    else if(pal==="storm"){if(green){R=r*.5+10;G=gg*.66+14;Bb=b*.7+40}else if(blue){R=r*.55;G=gg*.6;Bb=b*.75}else{R=r*.8;G=gg*.8;Bb=b*.86}}
    p[i]=cl(R);p[i+1]=cl(G);p[i+2]=cl(Bb)}
  g.putImageData(d,0,0);return m[pal]=o}
{const _g=xGround;xGround=function(x,y,fr){const t=_g.apply(this,arguments);return EX.M&&EX.M.pal?xPal(t,EX.M.pal):t}}
{const _o=xObj;xObj=function(c,x,y){const t=_o.apply(this,arguments);return t&&EX.M&&EX.M.pal&&c!=="A"?xPal(t,EX.M.pal):t}}
// ---------- clima: nieve, ceniza y brasas, o lluvia (sin estado: sale de la hora) ----------
function stWeather(ents,g,ts){const pal=EX.M&&EX.M.pal;if(!pal||pal==="ice"||(typeof hubCalm==="function"&&hubCalm()))return;const W=g.canvas.width/EXS,H=g.canvas.height/EXS;
  ents.push({y:9998,d:()=>{const t=ts/1000;
    if(pal==="snow")for(let i=0;i<70;i++){const sp=12+(i%7)*4,x=((i*97.3+Math.sin(t*.8+i)*14+t*6)%(W+20)+W+20)%(W+20)-10,y=((i*53.7+t*sp)%(H+10))-5;g.fillStyle=i%3?"rgba(255,255,255,.9)":"rgba(230,240,255,.75)";const s=i%4?2:3;g.fillRect(Math.round(x),Math.round(y),s,s)}
    else if(pal==="ash"||pal==="magma")for(let i=0;i<46;i++){const up=i%3===0,x=((i*71.1+Math.sin(t+i)*10)%W+W)%W,y=up?H-((i*37+t*(18+i%5*5))%(H+10)):((i*41.3+t*(10+i%4*3))%(H+10))-5;g.fillStyle=up?"rgba(255,"+(120+i%4*30)+",40,.85)":"rgba(70,60,60,.55)";g.fillRect(Math.round(x),Math.round(y),2,2)}
    else if(pal==="storm"){g.strokeStyle="rgba(190,210,255,.45)";g.lineWidth=1;g.beginPath();for(let i=0;i<60;i++){const x=((i*83.7+t*60)%(W+30))-15,y=((i*47.1+t*(260+i%5*30))%(H+20))-10;g.moveTo(x,y);g.lineTo(x-4,y+11)}g.stroke();
      const f=(t%7);if(f<.12||(f>.3&&f<.36)){g.fillStyle="rgba(230,240,255,.35)";g.fillRect(0,0,W,H)}}}})}
{const _e=exExtraEnts;exExtraEnts=function(ents,g,cx,cy,ts){_e.apply(this,arguments);stWeather(ents,g,ts);stLegend(ents,g,cx,cy,ts)}}
// aves legendarias sobre el lago de cada cumbre (y Zapdos en lo alto de la torre)
function stLegend(ents,g,cx,cy,ts){const s=stSt().s,L={pico_e:[14,"Articuno",13,14],cumbre:[19,"Moltres",18,19],torre:[22,"Zapdos",22,23]}[EX.map];if(!L||s<L[2]||s>L[3])return;
  const im=stMonImg(L[1]);if(!im.complete||!im.naturalWidth)return;const tor=EX.map==="torre",X=(tor?9.5:14)*32-cx+16,bob=Math.sin(ts/450)*5,Y=(tor?2:5)*32-cy+2+bob;
  ents.push({y:tor?2.5:5.5,d:()=>{xdisc(g,X,(tor?2:5)*32-cy+28,14-bob/2,4,"rgba(0,0,0,.25)");g.drawImage(im,X-40,Y-48,80,80)}})}
// ---------- capítulos, objetivos y personajes ----------
STO_CH.push({c:"Acto II",t:"La región de Escarcha"},{c:"Capítulo 7",t:"Pueblo Nevado"},{c:"Capítulo 8",t:"La Caverna Glaciar"},{c:"Capítulo 9",t:"El ave de hielo"},
  {c:"Acto III",t:"La región de Brasa"},{c:"Capítulo 11",t:"Villa Volcán"},{c:"Capítulo 12",t:"El corazón del cráter"},{c:"Capítulo 13",t:"El ave de fuego"},
  {c:"Acto IV",t:"La región de Tormenta"},{c:"Capítulo 15",t:"La Torre Relámpago"},{c:"Final",t:"La saga de las tres aves"});
// 7 Acto II · 8 Pueblo Nevado · 9 Caverna · 10 Pico · 11 Acto III · 12 Villa · 13 Cráter · 14 Cumbre · 15 Acto IV · 16 Torre · 17 Final
Object.assign(STO_OBJ,{9:[6,"La Profesora Vega tiene noticias urgentes: visítala en su laboratorio"],
 10:[7,"Viaja a la región de Escarcha: habla con el marinero del muelle de la Playa Coral (4 medallas)"],
 11:[7,"Explora Puerto Escarcha"],12:[8,"Cruza la Ruta 2 Helada hasta Pueblo Nevado"],13:[9,"Entra en la Caverna Glaciar (norte de Pueblo Nevado)"],14:[10,"Sube al Pico Escarcha y protege al ave de hielo"],
 15:[11,"Viaja a la región de Brasa: habla con el marinero del muelle de Puerto Escarcha (6 medallas)"],16:[11,"Explora Puerto Brasa"],17:[12,"Cruza la Ruta 3 Ceniza hasta Villa Volcán"],
 18:[13,"Entra en el Cráter (norte de Villa Volcán)"],19:[14,"Sube a la Cumbre Ígnea y protege al ave de fuego"],
 20:[15,"Viaja a la región de Tormenta: habla con el marinero del muelle de Puerto Brasa (8 medallas)"],21:[15,"Explora Ciudad Trueno"],
 22:[16,"Llega a la Torre Relámpago por la Ruta 4 Tempestad y detén al Doctor Ícaro"],23:[17,"El ave del trueno te espera en lo alto de la torre"],
 24:[17,"¡Saga completada! Visita las regiones en barco y combate con Dani cada día en Pueblo Brisa"]});
Object.assign(STO_L,{marin:exNpcLook("marinero-muelle"),temp:exNpcLook("recluta-tempestad-7"),gelida:exNpcLook("admin-gelida-2"),ascua:exNpcLook("admin-ascua-5"),icaro:exNpcLook("doctor-icaro-1"),nivea:exNpcLook("anciana-nivea"),aldeano:exNpcLook("aldeano-volcan")});
const SAILOR={playa:[6,16],pe:[13,16],pb:[13,16],ct:[15,20]};
{const _n=stNPCs;stNPCs=function(m){const L=_n(m),s=stSt().s,f=stSt().f;const P=(id,x,y,fc,n,look,o)=>L.push(Object.assign({sid:id,x:x,y:y,f:fc,n:n,look:look,t:[],sight:0,txt:"",id:"sto:"+m+":"+id,story:1,still:1,beat:true,px:x,py:y,f0:fc},o||{}));
  if(/^centro_/.test(m))P("enf",7,2,"d","Enfermera",STO_L.enf);
  if(SAILOR[m]&&(m!=="playa"||s>=10))P("marin",SAILOR[m][0],SAILOR[m][1],"u","Marinero",STO_L.marin);
  if(m==="pe"){if(s===11){P("dani",14,8,"d","Dani",STO_L.dani);if(!f.e1)P("e1",17,10,"l","Recluta",STO_L.temp)}P("v4",8,12,"r","Pescador",STO_L.v3)}
  if(m==="pn"){P("nivea",10,7,"d","Anciana Nívea",STO_L.nivea);if(s===12)P("dani",8,9,"r","Dani",STO_L.dani)}
  if(m==="glaciar"&&s===13){if(!f.e2)P("e2",12,13,"r","Recluta",STO_L.temp,{sight:4});if(!f.e3)P("e3",17,9,"l","Recluta",STO_L.temp,{sight:4});P("gelida",14,6,"d","Gélida",STO_L.gelida,{sight:4})}
  if(m==="pico_e"&&s===14)P("gelida",14,9,"d","Gélida",STO_L.gelida,{sight:3});
  if(m==="pb"){if(s===16)P("bruma",14,8,"d","Bruma",STO_L.bruma);P("v5",16,13,"r","Bañista",STO_L.v1)}
  if(m==="vv"){P("ald",10,7,"d","Aldeano",STO_L.aldeano);if(s===17)P("dani",8,9,"r","Dani",STO_L.dani)}
  if(m==="crater"&&s===18){if(!f.f2)P("f2",12,13,"r","Recluta",STO_L.temp,{sight:4});if(!f.f3)P("f3",17,9,"l","Recluta",STO_L.temp,{sight:4});P("ascua",14,6,"d","Ascua",STO_L.ascua,{sight:4})}
  if(m==="cumbre"&&s===19)P("ascua",14,9,"d","Ascua",STO_L.ascua,{sight:3});
  if(m==="ct"){if(s===21)P("noctis",14,10,"d","Noctis",STO_L.noctis);P("v6",22,17,"l","Electricista",STO_L.v2)}
  if(m==="torre"&&s===22){if(!f.t1)P("t1",4,10,"r","Recluta",STO_L.temp,{sight:5});if(!f.t2)P("t2",15,10,"l","Recluta",STO_L.temp,{sight:5});if(!f.ga)P("gelida",8,7,"r","Gélida",STO_L.gelida,{sight:2});if(!f.as)P("ascua",11,8,"l","Ascua",STO_L.ascua,{sight:2});P("icaro",9,4,"d","Doctor Ícaro",STO_L.icaro,{sight:2})}
  return L}}
Object.assign(GRUNT_TXT,{e1:["¡Este puerto ya es del Equipo Tempestad! ¡Largo!"],e2:["¡El frío no nos detendrá! ¡Tú tampoco!"],e3:["¡La comandante Gélida está a punto de terminar su trabajo!"],f2:["¡Aquí dentro hace un calor horrible… y tú lo vas a pasar peor!"],f3:["¡El comandante Ascua no quiere visitas!"],t1:["¡La torre es propiedad del Doctor Ícaro!"],t2:["¡Cuando tengamos las tres aves, el clima será nuestro!"]});
Object.assign(GRUNT_TEAM,{e1:["Murkrow","Skuntank"],e2:["Sneasel","Croagunk"],e3:["Purrloin","Golbat","Stunky"],f2:["Houndour","Scraggy"],f3:["Koffing","Pawniard","Croagunk"],t1:["Magnemite","Purrloin","Scraggy"],t2:["Voltorb","Honchkrow","Croagunk"]});
Object.assign(GRUNT_B,{e1:4,e2:5,e3:5,f2:7,f3:7,t1:9,t2:9});
const TMP_NM="Recluta del Equipo Tempestad";
// los reclutas del Equipo Tempestad usan su propio nombre en el combate
{const _gr=STX.grunt;STX.grunt=id=>{if(!/^[eft]\d$/.test(id))return _gr(id);return stRun(async()=>{const g=stN(id);if(!g)return;await sApproach(g);await sSay(S_("Recluta",...GRUNT_TXT[id]));
  const r=await sBattle(sTr(GRUNT_TEAM[id],GRUNT_B[id],TMP_NM,STO_L.temp));if(!r){if(r===false)await sSay(S_("Recluta","¡Ja! ¡La tormenta es imparable!"));return}
  stSt().f[id]=1;await sSay(S_("Recluta","¡Uf! ¡Me retiro antes de que llegue el Doctor!"));await sSay(["¡Recibes "+sGive({t:9000})+"!"]);await sFlash(1);sDel(id);save()})}}
// ---------- el epílogo de Alba engancha con el Acto II ----------
STX.act2=()=>stRun(async()=>{
  await sSay(S_("Profesora Vega","¡Ah, menos mal que vienes! Acabo de hablar con un colega de la región de Escarcha.","Allí lleva días nevando sin parar… y en Brasa los volcanes rugen como nunca. En Tormenta, los rayos no paran.","Un grupo llamado Equipo Tempestad, dirigido por un tal Doctor Ícaro, quiere capturar a las tres aves legendarias para controlar el clima de todo el mundo.","Tu experiencia con el Equipo Ocaso es justo lo que necesitamos. ¿Nos ayudas?","El marinero del muelle de la Playa Coral te llevará a Escarcha. Allí necesitarás al menos 4 medallas de gimnasio."));
  await sSay(["¡Recibes "+sGive({t:60000,it:{ub:10,hpot:5}})+"!"]);sStep(10)});
{const _t=stTalk;stTalk=function(n){const s=stSt().s,id=n.sid,m=EX.map;
  if(id==="vega"&&s===9)return STX.act2();
  if(id==="marin")return STX.sailor();
  if(id==="enf")return STX.enf();
  if(m==="pe"&&(id==="dani"||id==="e1"))return STX.pe11();
  if(m==="pn"&&id==="nivea")return s===12?STX.pn12():STX.nivea();
  if(m==="pn"&&id==="dani")return STX.pn12();
  if(id==="gelida")return s===13?STX.gelida13():s===14?STX.gelida14():STX.gelida22();
  if(m==="pb"&&id==="bruma")return STX.pb16();
  if(m==="vv"&&id==="dani")return STX.vv17();
  if(id==="ascua")return s===18?STX.ascua18():s===19?STX.ascua19():STX.ascua22();
  if(m==="ct"&&id==="noctis")return STX.ct21();
  if(id==="icaro")return STX.icaro22();
  if(id==="v4")return stRun(()=>sSay(S_("Pescador",s<14?"Con esta nevada no pica ni un Magikarp…":"¡Por fin ha dejado de nevar tanto! Gracias a ti, ¿verdad?")));
  if(id==="v5")return stRun(()=>sSay(S_("Bañista","Las aguas termales de Villa Volcán son lo mejor para tus Pokémon… ¡y para ti!")));
  if(id==="v6")return stRun(()=>sSay(S_("Electricista",s<23?"La torre del norte lleva semanas atrayendo rayos. ¡Ahí pasa algo raro!":"Desde que se calmó la torre, la ciudad tiene luz como nunca.")));
  if(id==="ald")return stRun(()=>sSay(S_("Aldeano",s<19?"El volcán no paraba de rugir desde que llegaron esos de las capas grises…":"¡El volcán duerme tranquilo otra vez!")));
  if(id==="nivea")return STX.nivea();
  return _t(n)}}
{const _en=stEnter;stEnter=function(m){const s=stSt().s;if(EX.cut||EX.title)return;
  if(/^centro/.test(m)){stSt().lc=m;save()}
  if(m==="pe"&&s===11)return STX.pe11();
  if(m==="pn"&&s===12)return STX.pn12();
  if(m==="pb"&&s===16)return STX.pb16();
  if(m==="vv"&&s===17)return STX.vv17();
  if(m==="ct"&&s===21)return STX.ct21();
  const cs={glaciar:[13,9],pico_e:[14,10],crater:[18,13],cumbre:[19,14],torre:[22,16]}[m];if(cs&&s===cs[0]&&!stSt().f["c"+cs[1]]){stSt().f["c"+cs[1]]=1;save();return stRun(()=>sCard(cs[1]))}
  return _en(m)}}
// si te debilitas, vuelves al último Centro Pokémon que visitaste
exFaint=function(){const st=exSt(),c=stSt().lc&&EXM[stSt().lc]?stSt().lc:"centro";st.m=c;st.x=7;st.y=6;st.f="u";EX.map=null;EX.pend.push(["¡Tus Pokémon se han debilitado!","Vuelves corriendo al "+EXM[c].n+"… Habla con la enfermera para curarlos."])};
// ---------- el barco del marinero ----------
const REG=[{k:"alba",n:"Región de Alba · Playa Coral",m:"playa",x:6,y:14,need:0,from:0},{k:"esc",n:"Región de Escarcha · Puerto Escarcha",m:"pe",x:13,y:13,need:4,from:10},{k:"bra",n:"Región de Brasa · Puerto Brasa",m:"pb",x:13,y:13,need:6,from:15},{k:"tor",n:"Región de Tormenta · Ciudad Trueno",m:"ct",x:15,y:17,need:8,from:20}];
STX.sailor=()=>stRun(async()=>{const s=stSt().s,cur=EX.map,opts=REG.filter(r=>r.m!==cur&&s>=r.from);
  if(!opts.length){await sSay(S_("Marinero","¡Ahoy! Cuando tengas a dónde ir, aquí estaré."));return}
  await sSay(S_("Marinero","¡Ahoy! Mi barco va a cualquier región que conozcas. ¿A dónde vamos?"));
  const i=await sChoice("¿A dónde quieres viajar?",opts.map(r=>({t:r.n.split(" · ")[0],s:r.n.split(" · ")[1]+(r.need?" · "+r.need+" medallas":"")})).concat([{t:"Quedarme aquí"}]));
  const r=opts[i];if(!r){await sSay(S_("Marinero","¡Cuando quieras, grumete!"));return}
  if(medCount()<r.need){await sSay(S_("Marinero","Las aguas hacia allí son peligrosas. Necesitas al menos "+r.need+" medallas de gimnasio para que te lleve.","(Tienes "+medCount()+". ¡Vence más gimnasios en Aventura › Gimnasios!)"));return}
  await sSay(S_("Marinero","¡Leven anclas! ¡Rumbo a "+r.n.split(" · ")[0]+"!"));snd("ui");await sFade("fade",500);
  const card=$("exCard");if(card){card.innerHTML='<small>⚓ Viaje en barco</small><b>'+esc(r.n.split(" · ")[0])+'</b>';card.hidden=false;card.classList.remove("in");void card.offsetWidth;card.classList.add("in")}
  await sW(1600);if(card)card.hidden=true;exLoad(r.m,r.x,r.y,"u");EX.banner=null;exFollowerReset();await sFade("fadein",600);
  const nx={esc:[10,11,7],bra:[15,16,11],tor:[20,21,15]}[r.k];if(nx&&s===nx[0]){sStep(nx[1]);await sCard(nx[2]);setTimeout(()=>stEnter(r.m),60)}});
// ---------- ACTO II · Escarcha ----------
STX.pe11=()=>stRun(async()=>{const d=stN("dani"),e=stN("e1");if(!d)return;
  await sSay(S_("Dani","¡Eh! ¡Por aquí! La Profe me pidió que te acompañara.","Pero mira eso… ¡un recluta del Equipo Tempestad está asustando a los pescadores!"));
  if(e){await sApproach(e);await sSay(S_("Recluta",...GRUNT_TXT.e1));const r=await sBattle(sTr(GRUNT_TEAM.e1,GRUNT_B.e1,TMP_NM,STO_L.temp));if(!r){if(r===false)await sSay(S_("Recluta","¡Ja! ¡Vuelve a tu región!"));return}
    stSt().f.e1=1;await sSay(S_("Recluta","¡Grr! ¡La comandante Gélida se encargará de vosotros en la Caverna Glaciar!"));await sFlash(1);sDel("e1")}
  await sApproach(d);await sSay(S_("Dani","¿Has oído? ¡La Caverna Glaciar! Está al norte de Pueblo Nevado, al otro lado de la Ruta 2.","Dicen que allí arriba, en el Pico Escarcha, vive Articuno, el ave de hielo.","¡Vamos a Pueblo Nevado! Te espero allí."));
  await sSay(["¡Recibes "+sGive({t:20000,it:{sb:10}})+"!"]);await sFade("fade",300);sDel("dani");await sFade("fadein",300);sStep(12)});
STX.nivea=()=>stRun(async()=>{const s=stSt().s;await sSay(S_("Anciana Nívea",s<14?"Las leyendas dicen que Articuno aparece ante quienes se pierden en la nieve… para guiarles a casa.":"El ave de hielo vuela feliz otra vez. Pueblo Nevado nunca olvidará lo que hiciste."))});
STX.pn12=()=>stRun(async()=>{await sCard(8);const n=stN("nivea"),d=stN("dani");
  await sSay(S_("Anciana Nívea","Así que eres tú la persona de la que habla todo el mundo… Soy Nívea, la más anciana de Pueblo Nevado.","Una mujer de capa gris, Gélida, entró ayer en la Caverna Glaciar con una máquina enorme.","Si atrapan a Articuno, esta nevada no acabará jamás. Por favor, protégelo."));
  if(d){await sApproach(d);await sSay(S_("Dani","¡Antes de entrar en la cueva quiero comprobar que estás en forma! ¡Combate!"));
    const r=await sBattle(sTr(["Pidgeotto","Kadabra","Eevee",stSt().f.rv||"Charmander"],5,"Dani",STO_L.dani));
    await sSay(S_("Dani",...(r?["¡Uf! Sigues siendo increíble. ¡Ve tú delante!"]:["¡He ganado! Pero cura bien a tu equipo antes de entrar."]),"Yo me quedo a proteger el pueblo por si vuelve algún recluta."));await sFade("fade",300);sDel("dani");await sFade("fadein",300)}
  await sSay(["¡Recibes "+sGive({t:20000,it:{hpot:3,rev:2}})+"!"]);sStep(13)});
STX.gelida13=()=>stRun(async()=>{const g=stN("gelida");await sApproach(g);
  await sSay(S_("Gélida","¿Una criatura de Alba aquí, en mi cueva? Qué tierno.","Soy Gélida, comandante del Equipo Tempestad. Cuando el Doctor Ícaro controle a las tres aves, nadie volverá a pasar frío… ni calor… ni miedo a las tormentas.","¡Un mundo con el clima perfecto! ¿Quién podría oponerse a eso?"));
  const r=await sBattle(sTr(["Sneasel","Snorunt","Spheal","Delibird"],5,"Comandante Gélida",STO_L.gelida));if(!r){if(r===false)await sSay(S_("Gélida","Hielo y silencio. Así me gustan los combates."));return}
  await sSay(S_("Gélida","…Interesante. Pero llegas tarde: mi máquina ya está en el Pico Escarcha.","¡Articuno será nuestro antes del anochecer!"));await sFlash(2);sDel("gelida");
  await sSay(["Gélida huye por la escalera del fondo de la caverna…","¡Recibes "+sGive({t:40000,it:{cand:2}})+"!"]);sStep(14)});
STX.gelida14=()=>stRun(async()=>{const g=stN("gelida");await sApproach(g);
  await sSay(S_("Gélida","¿Otra vez? Mira el lago: Articuno ya no puede escapar.","Si quieres liberarlo, tendrás que derrotarme de verdad."));
  const r=await sBattle(sTr(["Weavile","Glalie","Lapras","Abomasnow","Froslass"],7,"Comandante Gélida",STO_L.gelida));if(!r){if(r===false)await sSay(S_("Gélida","El invierno siempre gana."));return}
  await sSay(S_("Gélida","¡No puede ser! ¡La máquina…!"));snd("wild");await sFlash(4);
  await sSay(["¡La máquina de Gélida estalla en mil copos de nieve!","Articuno se libera y desciende despacio frente a ti…"]);await sSay(S_("Gélida","El Doctor Ícaro no me lo perdonará… ¡Esto no ha terminado!"));sDel("gelida");
  await stBird("Articuno",8,15)});
// combate contra el ave legendaria (se puede capturar; si la vences, también se une a ti)
async function stBird(nm,b,next){await sSay(["¡"+nm+" te mira fijamente y se prepara para ponerte a prueba!"]);
  const m=mkEnemy(PM[nm],clampL(sLv(b)));m.mx=Math.round(m.mx*1.3);m.mh=m.mx;const r=await sBattle({eteam:[m],cap:nm},"wild");if(r===null)return;
  if(r===false){await sSay([nm+" vuelve a volar en círculos sobre ti… Cura a tu equipo y vuelve a acercarte."]);return}
  if(r!=="cap"){giveMon(nm,m.l);save()}stTeamAdd(nm);
  await sSay(["¡"+nm+" se ha unido a ti!","¡Recibes también "+sGive({t:next===15?80000:next===20?120000:160000,it:{mb:1}})+"!"]);sStep(next)}
// ---------- ACTO III · Brasa ----------
STX.pb16=()=>stRun(async()=>{const b=stN("bruma");if(!b)return;await sApproach(b);
  await sSay(S_("Bruma","¡Vaya! Mira quién ha venido hasta Brasa.","Desde que se disolvió el Equipo Ocaso, ayudo a vigilar los volcanes. Y el Equipo Tempestad está aquí también.","Su comandante, Ascua, ha entrado en el Cráter, al norte de Villa Volcán. Quiere atrapar a Moltres, el ave de fuego.","Toma esto. Considéralo una disculpa por todo lo de Alba."));
  await sSay(["¡Recibes "+sGive({t:40000,it:{rev:3,cand:3}})+"!"]);await sSay(S_("Bruma","Sigue la Ruta 3 Ceniza hacia el este. ¡Suerte!"));await sFade("fade",300);sDel("bruma");await sFade("fadein",300);sStep(17)});
STX.vv17=()=>stRun(async()=>{await sCard(12);const d=stN("dani");
  await sSay(S_("Aldeano","¡Cuidado! El volcán no para de rugir desde que esos de capa gris entraron en el Cráter."));
  if(d){await sApproach(d);await sSay(S_("Dani","¡He llegado en el barco de la tarde! No pensarías que te iba a dejar sin rival, ¿no?","¡Combate antes del cráter!"));
    const r=await sBattle(sTr(["Pidgeot","Alakazam","Dragonair","Eevee",stSt().f.rv||"Charmander"],7,"Dani",STO_L.dani));
    await sSay(S_("Dani",...(r?["¡Otra vez! Algún día te ganaré… ¡lo juro!"]:["¡Gané! Cura a tu equipo en el Centro antes de entrar."]),"¡Yo vigilaré la villa!"));await sFade("fade",300);sDel("dani");await sFade("fadein",300)}
  await sSay(["¡Recibes "+sGive({t:30000,it:{hpot:5}})+"!"]);sStep(18)});
STX.ascua18=()=>stRun(async()=>{const a=stN("ascua");await sApproach(a);
  await sSay(S_("Ascua","¡Ja! ¡Así que tú eres quien congeló los planes de Gélida!","Soy Ascua, comandante del Equipo Tempestad. ¡Aquí abajo, el que manda es el fuego!"));
  const r=await sBattle(sTr(["Houndour","Magby","Torkoal","Numel"],7,"Comandante Ascua",STO_L.ascua));if(!r){if(r===false)await sSay(S_("Ascua","¡Demasiado calor para ti!"));return}
  await sSay(S_("Ascua","¡Grr! Da igual, Moltres ya está atrapado en la Cumbre Ígnea. ¡Sube si te atreves!"));await sFlash(2);sDel("ascua");
  await sSay(["¡Recibes "+sGive({t:60000,it:{cand:3}})+"!"]);sStep(19)});
STX.ascua19=()=>stRun(async()=>{const a=stN("ascua");await sApproach(a);
  await sSay(S_("Ascua","¡Has subido! Bueno, así veré arder tu equipo en primera fila."));
  const r=await sBattle(sTr(["Houndoom","Magmortar","Camerupt","Arcanine","Salazzle"],9,"Comandante Ascua",STO_L.ascua));if(!r){if(r===false)await sSay(S_("Ascua","¡Las llamas nunca se apagan!"));return}
  await sSay(S_("Ascua","¿Cómo…? ¡La jaula de fuego se está rompiendo!"));snd("wild");await sFlash(4);
  await sSay(["¡Moltres despliega sus alas en llamas y rompe la jaula!","El ave de fuego se posa frente a ti…"]);await sSay(S_("Ascua","¡El Doctor Ícaro tiene la última ave en la Torre Relámpago! ¡No podrás con él!"));sDel("ascua");
  await stBird("Moltres",10,20)});
// ---------- ACTO IV · Tormenta ----------
STX.ct21=()=>stRun(async()=>{const n=stN("noctis");if(!n)return;await sApproach(n);
  await sSay(S_("Noctis","Volvemos a vernos. Tranquilidad: ya no soy tu enemigo.","Después de lo de Alba, decidí recorrer el mundo para entender lo que hice. Y aquí descubrí al Doctor Ícaro.","Era mi maestro. Él me enseñó a querer controlarlo todo… Por eso sé que no se detendrá.","Está en la Torre Relámpago, al norte de la Ruta 4. Usa la energía de Zapdos para alimentar sus máquinas.","Llévate esto. Y… gracias por enseñarme otro camino."));
  await sSay(["¡Recibes "+sGive({t:80000,it:{mb:1,hpot:5}})+"!"]);await sFade("fade",300);sDel("noctis");await sFade("fadein",300);sStep(22)});
STX.gelida22=()=>stRun(async()=>{const g=stN("gelida");await sApproach(g);await sSay(S_("Gélida","¡Esta vez el Doctor nos ha dado lo mejor de su laboratorio! ¡No pasarás!"));
  const r=await sBattle(sTr(["Weavile","Mamoswine","Froslass","Lapras","Abomasnow"],10,"Comandante Gélida",STO_L.gelida));if(!r){if(r===false)await sSay(S_("Gélida","¡Hielo eterno!"));return}
  stSt().f.ga=1;await sSay(S_("Gélida","…Tal vez el clima perfecto no exista. Ve. El Doctor está arriba."));await sSay(["¡Recibes "+sGive({t:50000})+"!"]);await sFlash(1);sDel("gelida")});
STX.ascua22=()=>stRun(async()=>{const a=stN("ascua");await sApproach(a);await sSay(S_("Ascua","¡Revancha! ¡Mi fuego arde más que nunca!"));
  const r=await sBattle(sTr(["Houndoom","Magmortar","Arcanine","Chandelure","Camerupt"],10,"Comandante Ascua",STO_L.ascua));if(!r){if(r===false)await sSay(S_("Ascua","¡Jajaja! ¡Toma ya!"));return}
  stSt().f.as=1;await sSay(S_("Ascua","¡Bah! Me has vuelto a quemar el orgullo… Sube. Que el Doctor se las apañe."));await sSay(["¡Recibes "+sGive({t:50000})+"!"]);await sFlash(1);sDel("ascua")});
STX.icaro22=()=>stRun(async()=>{const f=stSt().f;if(!f.ga||!f.as){await sSay(S_("Doctor Ícaro","Primero tendrás que superar a mis comandantes. Ellas guardan el paso."));return}
  const i=stN("icaro");await sApproach(i);
  await sSay(S_("Doctor Ícaro","Así que tú eres quien ha liberado a Articuno y a Moltres. Impresionante.","Soy el Doctor Ícaro. Durante años vi cómo las tormentas, las sequías y las heladas destruían pueblos enteros.","Con las tres aves bajo mi control, el clima obedecería a la ciencia. ¡Nadie volvería a sufrir!","Pero tú… tú eliges dejarlas libres. Demuéstrame que tienes razón."));
  const r=await sBattle(sTr(["Magnezone","Electivire","Ampharos","Rotom","Luxray","Porygon-Z"],12,"Doctor Ícaro",STO_L.icaro));if(!r){if(r===false)await sSay(S_("Doctor Ícaro","La razón está de mi lado. Vuelve cuando lo entiendas."));return}
  await sSay(S_("Doctor Ícaro","…Tus Pokémon luchan por ti sin que los controles. Confían en ti.","Quizá eso es lo que yo nunca entendí."));snd("wild");await sFlash(5);
  await sSay(["¡Las máquinas de la torre chisporrotean y se apagan una a una!","Zapdos, libre por fin, llena la sala de electricidad…"]);sDel("icaro");sStep(23);await sW(200);await STX.zap(true)});
STX.zap=inner=>{const go=async()=>{const s0=stSt().s;await stBird("Zapdos",12,24);if(stSt().s===24&&s0===23)await stFinale()};return inner?go():stRun(go)};
async function stFinale(){await sCard(17);
  const d=sAdd("dani",8,12,"u","Dani",STO_L.dani),n=sAdd("noctis",11,12,"u","Noctis",STO_L.noctis),b=sAdd("bruma",10,12,"u","Bruma",STO_L.bruma);
  await sSay(S_("Dani","¡Lo has conseguido! ¡Las tres aves son libres!"),...S_("Noctis","El Doctor Ícaro se ha entregado. Dice que quiere ayudar a predecir el clima… sin controlarlo."),...S_("Bruma","Gélida y Ascua también. Parece que todos hemos aprendido algo de ti."));
  await sSay(S_("Dani","Oye… ¿sabes qué? Ya no quiero ganarte solo para ganar. Quiero ser tan buen entrenador como tú.","¡Pero eso no quita que mañana te espere en Pueblo Brisa para nuestro combate diario!"));
  await sSay(["¡Recibes "+sGive({t:300000,it:{mb:2,cand:10}})+"!"]);
  await stCredits2();sDel("dani");sDel("noctis");sDel("bruma")}
async function stCredits2(){const box=$("exEnd");if(!box)return;snd("win");
  box.innerHTML='<div class="exroll" style="animation-duration:30s"><b class="exfin">LA SAGA DE LAS TRES AVES</b><p>Alba · Escarcha · Brasa · Tormenta</p><p><i>Protagonista</i><br>'+esc(S.nick||"Tú")+'</p><p><i>Guardianes</i><br>Latias · Articuno · Moltres · Zapdos</p><p><i>Rival y amistad</i><br>Dani</p><p><i>Equipo Tempestad</i><br>Doctor Ícaro · Gélida · Ascua</p><p><i>Segundas oportunidades</i><br>Noctis · Bruma</p><p><i>Con la ayuda de</i><br>Profesora Vega · Lía · Anciana Nívea · el marinero y todos los Centros Pokémon</p><b class="exfin">¡GRACIAS POR JUGAR!</b><p>Poke Gacha Online</p></div><button type="button" class="red" id="exEndX">Seguir explorando</button>';
  box.hidden=false;await new Promise(r=>{$("exEndX").onclick=()=>{box.hidden=true;snd("ui");r()}})}
// acercarse al ave cuando volviste después de perder
{const _a=exArrive;exArrive=function(){const s=stSt().s;
  if(!EX.cut){const B={pico_e:[14,14,8,"Articuno",8,15],cumbre:[19,14,8,"Moltres",10,20]}[EX.map];
    if(B&&s===B[0]&&EX.x===B[1]&&EX.y===B[2]){const st=exSt();st.x=EX.x;st.y=EX.y;st.f=EX.f;EX.f="u";return stRun(()=>stBird(B[3],B[4],B[5]))}
    if(EX.map==="torre"&&s===23&&EX.y<=4){const st=exSt();st.x=EX.x;st.y=EX.y;st.f=EX.f;return STX.zap()}}
  return _a.apply(this,arguments)}}
// el epílogo de Alba enlaza con la llamada de la Profesora
{const _l8=STX.lab8;STX.lab8=()=>_l8().then(()=>{if(stSt().s===9)setTimeout(()=>{if(!EX.cut)STX.act2()},400)})}
// lava en lugar de agua en Brasa
{const _i=exInteract;exInteract=function(){if(!EX.cut&&!EX.dlg&&!EX.mv&&!EX.trans&&EX.M&&EX.M.pal){const[dx,dy]=EXDIR[EX.f],c=exAt(EX.x+dx,EX.y+dy);
    if(c==="~"&&(EX.M.pal==="ash"||EX.M.pal==="magma")){exSay(["La lava burbujea… Mejor no acercarse demasiado."]);return}
    if(c==="~"&&EX.M.pal==="snow"){exSay(["El agua está helada. Bajo el hielo se mueven Pokémon."]);return}}
  return _i.apply(this,arguments)}}
