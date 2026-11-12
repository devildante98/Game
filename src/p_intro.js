// =====================================================================================
// INICIO DE LA HISTORIA COMO EN LA SAGA
// · Al salir de casa, la Profesora Vega viene a buscarte y te lleva andando a su laboratorio.
// · Allí te lo explica todo y puedes mirar las tres Poké Balls de la mesa una a una (ves el Pokémon que hay dentro).
// · Cuando eliges, llega su sobrino (tu rival) y te lo presenta; puedes cambiarle el nombre para toda la historia.
// =====================================================================================
const rvName=()=>{try{const n=stSt().f.rn;return n&&typeof n==="string"?n:"Dani"}catch(e){return "Dani"}};
const rvTx=s=>{if(typeof s!=="string")return s;const n=rvName();return n==="Dani"?s:s.replace(/\bDani\b/g,n)};
// el nombre del rival se cambia en todos los diálogos, en los combates y en el objetivo de la historia
{const _s=exSay;exSay=function(lines,cb){try{if(Array.isArray(lines))lines=lines.map(rvTx);else lines=rvTx(lines)}catch(e){}return _s.call(this,lines,cb)}}
{const _b=exBattle;exBattle=function(cfg,npc){try{const n=rvName();if(n!=="Dani"&&cfg&&typeof cfg.trainer==="string"&&/^Dani\b/.test(cfg.trainer)){cfg.tsrc=cfg.tsrc||{};
  cfg.trainer=cfg.trainer.replace(/^Dani/,n);cfg.tsrc.n=cfg.trainer}}catch(e){}return _b.apply(this,arguments)}}
{const _h=stHud;stHud=function(){const r=_h.apply(this,arguments);try{if(rvName()!=="Dani"){const o=$("exObj");if(o){const w=document.createTreeWalker(o,NodeFilter.SHOW_TEXT);let t;while((t=w.nextNode()))if(/\bDani\b/.test(t.nodeValue))t.nodeValue=rvTx(t.nodeValue)}}}catch(e){}return r}}
// ---------- la Profesora te busca en el pueblo ----------
STX.fetchVega=()=>stRun(async()=>{const f=stSt().f;f.vgF=1;save();
  const t=exDoor("5");let v;if(t&&Math.abs(t[0]-EX.x)+Math.abs(t[1]-EX.y)>2&&!EX.npcs.some(n=>n.px===t[0]&&n.py===t[1]))v=sAdd("vega_f",t[0],t[1],"d","Profesora Vega",STO_L.vega);else v=sAddNear("vega_f","Profesora Vega",STO_L.vega);
  await sW(200);await sAlert(v);await sApproach(v);
  await sSay(S_("Profesora Vega","¡Ah, por fin te encuentro! Iba ahora mismo a buscarte a casa.","Soy la Profesora Vega. ¡Te recuerdo de cuando apenas levantabas un palmo del suelo! Cómo pasa el tiempo…",
    "Escucha: nunca salgas del pueblo sin un Pokémon. En la hierba alta viven Pokémon salvajes y puede ser peligroso.","Precisamente por eso te he llamado. Tengo algo para ti en el laboratorio. ¡Venga, sígueme!"));
  await sGoDoor(v,"5");snd("ui");await sFade("fade",350);
  exLoad("lab",7,8,"u");EX.banner=null;sDel("vega");const v2=sAdd("vega",7,7,"u","Profesora Vega",STO_L.vega);
  await sFade("fadein",450);await sGuide(v2,7,3);v2.f="d";sFaceTo(v2);await sW(200);
  await labIntro()});
async function labIntro(){const f=stSt().f;rstRoll();rstSync();
  await sSay(S_("Profesora Vega","¡Te doy la bienvenida a mi laboratorio! Aquí estudio a los Pokémon… y la Piedra Aurora, una roca antiquísima de la región de Alba.",
    "Según las leyendas, si se le devuelven sus tres Escamas, el guardián de la región despierta junto al lago de la Cima Aurora.",
    "Hace unos días, un grupo que se hace llamar Equipo Ocaso empezó a buscar esas Escamas por todas partes…",
    "Necesito a alguien valiente que vigile las rutas y me cuente lo que vea. ¡Y he pensado en ti!",
    "Para el viaje quiero regalarte un compañero. En esa mesa hay tres Poké Balls, y en cada una vive un Pokémon distinto.",
    "Acércate y míralas una a una con calma. Cuando tengas claro cuál quieres, ¡elígelo!"));
  f.labI=1;save()}
// ---------- mirar una Poké Ball ----------
const ST_BLURB={Planta:"Los Pokémon de tipo Planta son tranquilos y resistentes. Aguantan muy bien los golpes y se curan con el sol.",
  Fuego:"Los Pokémon de tipo Fuego son enérgicos y pegan muy fuerte. Al principio cuesta un poco, ¡pero merece la pena!",
  Agua:"Los Pokémon de tipo Agua son equilibrados y fáciles de criar. ¡Una elección muy segura para empezar!"};
function stBallShow(n,tt){const sc=(EX.cv&&EX.cv.closest(".exscr"))||document.querySelector(".exwrap .exscr")||document.querySelector("#explPB .exscr");if(!sc)return null;const d=document.createElement("div");d.className="stball";
  let im="";try{im=(typeof icoHD==="function"?icoHD:ico)(PM[n],120)}catch(e){try{im=ico(PM[n],120)}catch(e2){}}
  im=String(im||"").replace(/\sloading="lazy"/,"");
  d.innerHTML='<div class="stbt">Poké Ball</div><div class="stbi">'+im+'</div><b>'+esc(n)+'</b><small>Tipo '+esc(tt||"")+'</small>';sc.appendChild(d);return d}
async function stBall(i){const f=stSt().f;rstSync();const S0=STARTERS[i];if(!S0)return;const[n,tt]=S0;
  // la imagen se carga mientras lees la primera frase, para que la ventana no salga vacía
  let pre=Promise.resolve();try{const h=(typeof icoHD==="function"?icoHD:ico)(PM[n],120),m=String(h).match(/src="([^"]+)"/);if(m){const q=new Image();q.src=m[1];pre=Promise.race([q.decode().catch(()=>{}),sW(2500)])}}catch(e){}
  snd("ui");await sSay(["Es una Poké Ball. ¡Dentro hay un Pokémon!"]);await pre;
  const box=stBallShow(n,tt);try{try{cry(n)}catch(e){}
    await sSay(S_("Profesora Vega","¡Ah, "+n+"! Es un Pokémon de tipo "+tt+".",ST_BLURB[tt]||("Es un Pokémon muy especial. ¡Seguro que os entendéis de maravilla!")));
    const c=await sChoice("¿Eliges a "+n+" como tu compañero?",[{t:"¡Sí, elijo a "+n+"!"},{t:"Ver las demás"}]);
    if(c!==0){await sSay(S_("Profesora Vega","¡Tómate tu tiempo! Es una decisión muy importante."));return}}finally{if(box)box.remove()}
  f.st=n;f.rv=RIVAL_OF[n];xgGive(n,5);save();snd("capok");
  await sSay(["¡Has recibido a "+n+" (Nv. 5)!",n+" se ha unido a tu equipo."]);
  await sSay(S_("Profesora Vega","¡Qué buena elección! Se nota que "+n+" ya te ha cogido cariño."));
  await labRival()}
// ---------- llega el sobrino de la Profesora: tu rival ----------
async function labRival(){const f=stSt().f;
  if(!f.rvI){const free=(x,y)=>!EXBLK.includes(exAt(x,y))&&!(EX.x===x&&EX.y===y)&&!EX.npcs.some(n=>n.px===x&&n.py===y);const p=[[7,8],[6,8],[8,8],[7,7]].find(q=>free(q[0],q[1]))||[7,8];
    snd("ui");await sFade("fade",200);const d=sAdd("dani",p[0],p[1],"u","Dani",STO_L.dani);await sFade("fadein",250);
    await sSay(S_("Dani","¡Tía Vega! ¡Perdón, perdón, me he dormido!"));await sApproach(d);
    const v=stN("vega");if(v){sFaceTo(v);v.f=dirTo(v.px,v.py,d.px,d.py)||"d"}
    await sSay(S_("Profesora Vega","¡Hombre, por fin apareces! Llegas tarde, como siempre.","Mira, te presento a mi sobrino. También empieza hoy su viaje como entrenador.","Se llama… eh… ¿cómo era? ¡Con tantos Pokémon en la cabeza, a veces se me olvida hasta su nombre!"));
    let nm="Dani";const c=await sChoice("¿Cómo se llama el sobrino de la Profesora Vega?",[{t:"Dani"},{t:"✏️ Escribir otro nombre"}]);
    if(c===1){const r=await uiDlg("Escribe el nombre del sobrino de la Profesora Vega (máximo 10 letras):",{inp:"",max:10,yes:"Aceptar",no:"Dejar «Dani»"});
      const k=r==null?"":String(r).replace(/[<>§|"\\]/g,"").trim().slice(0,10);if(k)nm=k}
    f.rn=nm;f.rvI=1;save();stHud();
    await sSay(S_("Profesora Vega","¡Eso, "+nm+"! ¿Cómo se me iba a olvidar?"));
    await sSay(S_("Dani","¡Tía, que siempre te pasa lo mismo!","Bueno… ¡así que tú también empiezas hoy! Entonces, a partir de ahora, ¡seremos rivales!"))}
  const d=stN("dani")||sAddNear("dani","Dani",STO_L.dani);
  if(!f.rvT){f.rvT=1;save();await sSay(S_("Dani","Pues yo me quedo con este: ¡"+f.rv+"! "+(f.rst?"¡A ver cuál de los dos es más fuerte!":"¡Le tengo ventaja al tuyo!")));
    snd("capok");await sSay(["¡Dani ha recibido a "+f.rv+"!"])}
  await sApproach(d);
  await sSay(S_("Dani","¡Vamos a probarlos ahora mismo! ¡Combate!"));
  stHeal();EX.noFaint=1;let r;try{r=await sBattle(sTr([f.rv],0,"Dani",STO_L.dani))}finally{EX.noFaint=0}
  if(r===null)r=false;stHeal();
  await sSay(S_("Dani",...(r?["¡¿Qué?! ¡He perdido! Bueno… ¡la próxima vez te ganaré seguro!"]:["¡Toma ya! ¡He ganado! No te preocupes, es tu primer combate."])));
  await sSay(S_("Profesora Vega","¡Qué combate más emocionante! Se nota que vais a ser grandes rivales.","Mi ayudante, Lía, ha salido hacia la Ruta 1. Sal del pueblo por el este y búscala, por favor.","¡Y toma esto para el camino!"));
  await sSay(["¡Recibes "+sGive({t:5000,it:{pb:10}})+"!"]);
  await sSay(S_("Dani","¡Yo me voy por mi cuenta! ¡Nos vemos, rival!"));await sFade("fade",350);sDel("dani");snd("ui");await sFade("fadein",350);sStep(2)}
// ---------- la escena del laboratorio según por dónde vaya la historia ----------
STX.lab1=()=>stRun(async()=>{const f=stSt().f;rstRoll();rstSync();
  if(!f.labI){const v=stN("vega");if(v){await sAlert(v);sFaceTo(v)}await labIntro();return}
  if(!f.st){await sSay(S_("Profesora Vega","Las tres Poké Balls están en la mesa. ¡Míralas una a una y elige a tu compañero!"));return}
  await labRival()});
// al salir de casa por primera vez (o al volver al pueblo sin Pokémon), la Profesora viene a buscarte
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{if(m==="pueblo"&&stSt().s===1&&!stSt().f.vgF&&!stSt().f.st){let n=0;const tk=()=>{if(EX.map!=="pueblo"||stSt().f.vgF)return;
  if(EX.title||EX.cut||EX.dlg||EX.trans||EX.choice||EX.mv){if(++n<80)setTimeout(tk,200);return}STX.fetchVega()};setTimeout(tk,500)}}catch(e){}return r}}
// mirar las Poké Balls de la mesa (una a una)
{const _i=exInteract;exInteract=function(){try{const t=stSt(),f=t.f;if(!EX.dlg&&!EX.mv&&!EX.trans&&!EX.cut&&EX.map==="lab"&&t.s===1&&!f.st){const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy;
  if(y===5&&x>=6&&x<=8){if(!f.labI){STX.lab1();return}stRun(()=>stBall(x-6));return}}}catch(e){console.error(e)}return _i.apply(this,arguments)}}
// no puedes irte del laboratorio sin tu Pokémon
{const _a=exArrive;exArrive=function(){try{const t=stSt();if(EX.map==="lab"&&t.s===1&&!EX.cut&&exAt(EX.x,EX.y)==="1"){const st=exSt();
  exSay([t.f.st?"§Profesora Vega|¡Eh, espera! Todavía no te vayas, que quiero presentarte a alguien.":"§Profesora Vega|¡Eh, espera! No te vayas sin tu Pokémon. Mira las Poké Balls que hay en la mesa."],()=>{exStepBack();st.x=EX.x;st.y=EX.y;st.f=EX.f;if(t.f.st)setTimeout(()=>STX.lab1(),200)});return}}catch(e){}return _a.apply(this,arguments)}}
// ---------- el rival y los villanos: en el mapa llevan los colores de su imagen de combate ----------
try{const L=trDec(STO_L.dani);Object.assign(L,{b:0,sk:1,hs:1,hc:7,ec:5,hat:0,gl:0,top:11,tc:16,ac:0,bot:0,bc:13,sh:0,brd:0,mk:0,bp:1,bpc:0,nk:0,ear:0});STO_L.dani=trEnc(L);STO_L.champ=STO_L.dani;
  const K={dani:"hugh",bruma:"jupiter",noctis:"cyrus",ocaso:"galacticgrunt",temp:"plasmagrunt",gelida:"mars",ascua:"saturn",icaro:"colress"};
  Object.keys(K).forEach(k=>{if(STO_L[k]){CH_CLSOF[STO_L[k]]=K[k];chSample(K[k])}})}catch(e){console.error(e)}
