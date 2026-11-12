// =====================================================================================
// GIMNASIOS CON PUZLES (como en la saga). Cada gimnasio tiene su reto antes de llegar al Líder:
// Brezo: laberinto de plantas · Marina: corrientes de agua · Albo: suelo de hielo · Pedro: rocas de Fuerza
// Ígnea: preguntas que abren las barreras de fuego · Voltio: interruptores de las vallas eléctricas
// Sibila: baldosas de teletransporte · Drakón: rocas de Fuerza que tapan agujeros
// Los puzles se reinician al salir del gimnasio (si te atascas, sal y vuelve a entrar).
// =====================================================================================
const GYMP={gym_pueblo:"grass",gym_pe:"water",gym_pn:"ice",gym_pb:"fighting",gym_vv:"fire",gym_ct:"electric",gym_pc:"psychic",gym_cl:"dragon"};
const GYM_CUR={">":"r","<":"l","|":"u","_":"d"};
const GYM_TP={gym_pc:{"2,10":[1,6],"12,10":[13,7],"2,7":[6,10],"11,6":[7,6],"6,7":[8,10],"8,7":[7,4],"2,3":[7,10]}};
const GYM_Q={gym_vv:{"9,10":{g:9,q:"¿Qué tipo es muy eficaz contra el tipo Fuego?",o:["Agua","Planta","Bicho"],a:0},
  "5,8":{g:7,q:"Un ataque de tipo Fuego contra un Pokémon de tipo Agua es…",o:["Muy eficaz","Poco eficaz","Normal"],a:1},
  "9,5":{g:4,q:"¿En qué Pokémon evoluciona Charmander?",o:["Ponyta","Charizard","Charmeleon"],a:2}}};
const GYM_HI={gym_pueblo:["El gimnasio está lleno de plantas… ¡Es un laberinto!","Encuentra el camino hasta Brezo."],
  gym_pe:["El suelo está lleno de corrientes de agua que te arrastran.","Fíjate bien hacia dónde va cada corriente."],
  gym_pn:["¡El suelo está helado! Si pisas el hielo, resbalarás hasta chocar con algo."],
  gym_pb:["Hay rocas enormes cortando el paso. Con Fuerza podrás empujarlas.","(Si te atascas, sal del gimnasio y vuelve a entrar.)"],
  gym_vv:["Unas barreras de fuego cortan el paso.","Responde bien a las máquinas de preguntas para apagarlas."],
  gym_ct:["Vallas eléctricas… Los interruptores del suelo las encienden y las apagan todas a la vez."],
  gym_pc:["Las baldosas brillantes te teletransportan a otra sala.","Busca la que te lleve hasta Sibila."],
  gym_cl:["Hay agujeros en el suelo que cortan el paso.","Con Fuerza puedes empujar las rocas dentro de los agujeros para taparlos.","(Si te atascas, sal del gimnasio y vuelve a entrar.)"]};
const gymOn=()=>!!GYMP[EX.map];
const gymIdx=()=>{try{return XGYM.findIndex(g=>g.m===EX.map)}catch(e){return -1}};
// ---------- al entrar ----------
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{if(GYMP[m]){EX.gymMsg=0;const gi=gymIdx();
  // con la medalla ya ganada, las barreras de fuego y los agujeros se quedan abiertos
  if(gi>=0&&xbHas(gi)&&(m==="gym_vv"||m==="gym_cl"))EX.grid.forEach((row,y)=>row.forEach((c,x)=>{if(c==="e")row[x]="l";if(c==="^")row[x]="F"}));
  const f=stSt().f;if(!f["gp_"+m]&&!(gi>=0&&xbHas(gi))){let n=0;const tk=()=>{if(EX.map!==m)return;if(EX.title||EX.cut||EX.dlg||EX.trans){if(++n<60)setTimeout(tk,250);return}f["gp_"+m]=1;save();exSay(GYM_HI[m]||[])};setTimeout(tk,700)}}}catch(e){console.error(e)}return r}}
// ---------- bloqueos y rocas de Fuerza ----------
function gymPush(x,y){try{if(EX.strength!==EX.map||EX.mv||EX.cut||EX.dlg)return;const[dx,dy]=EXDIR[EX.f];if(x!==EX.x+dx||y!==EX.y+dy)return;const now=performance.now();if(now-(EX.pushT||0)<380)return;
  const nx=x+dx,ny=y+dy,c=exAt(nx,ny);if(!(c==="F"||c==="^")||EX.npcs.some(n=>n.px===nx&&n.py===ny))return;EX.pushT=now;EX.grid[y][x]="F";
  if(c==="^"){EX.grid[ny][nx]="F";snd("hit");EX.poof={x:nx,y:ny,t0:now};setTimeout(()=>{EX.poof=null},380);if(!EX.holeMsg){EX.holeMsg=1;setTimeout(()=>exSay(["¡La roca ha caído en el agujero y lo ha tapado!"]),250)}}
  else{EX.grid[ny][nx]="v";snd("ui")}}catch(e){}}
{const _b=exBlocked;exBlocked=function(x,y){if(gymOn()){const c=exAt(x,y);if(c==="v"){gymPush(x,y);return true}if(c==="e"||c==="?"||c==="^")return true;
  if(c==="z"||c==="l"||c==="a"||c==="@"||GYM_CUR[c]){if(EX.npcs.some(n=>n.px===x&&n.py===y))return true;return false}}return _b.apply(this,arguments)}}
// ---------- hielo, corrientes, interruptores y teletransporte ----------
function gymToggle(){EX.grid.forEach(row=>row.forEach((c,x)=>{if(c==="e")row[x]="l";else if(c==="l")row[x]="e"}));snd("ui");
  if(!EX.gymMsg){EX.gymMsg=1;setTimeout(()=>{if(!EX.dlg)exSay(["¡Clic! Las vallas eléctricas han cambiado: las encendidas se apagan y las apagadas se encienden."])},120)}}
function gymTeleport(t){snd("ui");EX.keys={};EX.kst=[];EX.trans={t:0,d:320,k:"fade",done:()=>{EX.x=t[0];EX.y=t[1];EX.px=t[0];EX.py=t[1];EX.trail=[{x:t[0],y:t[1]}];EX.mv=null;const st=exSt();st.x=t[0];st.y=t[1];try{exFollowerReset()}catch(e){}EX.trans={t:0,d:320,k:"fadein"}}}}
{const _a=exArrive;exArrive=function(){const r=_a.apply(this,arguments);try{if(!gymOn()||EX.cut||EX.trans||EX.dlg||EX.walkTo||EX.alert)return r;const c=exAt(EX.x,EX.y);
  if(c==="a")gymToggle();
  const tp=GYM_TP[EX.map]&&GYM_TP[EX.map][EX.x+","+EX.y];if(tp){gymTeleport(tp);return r}
  const d=c==="z"?EX.f:GYM_CUR[c]||null;
  if(d){const[dx,dy]=EXDIR[d],nx=EX.x+dx,ny=EX.y+dy;if(!exBlocked(nx,ny)){EX.trail.unshift({x:EX.x,y:EX.y});EX.trail.length=3;EX.mv={x0:EX.x,y0:EX.y,t:0,d:c==="z"?110:150};EX.x=nx;EX.y=ny;EX.slide=1;if(c==="z"&&!EX.iceS){EX.iceS=1;snd("ui");setTimeout(()=>{EX.iceS=0},400)}}else EX.slide=0}else EX.slide=0}catch(e){console.error(e)}return r}}
// mientras resbalas o te arrastra la corriente no puedes cambiar de dirección
{const _u=exUpdate;exUpdate=function(dt,ts){if(EX.slide&&!EX.mv&&gymOn()){EX.slide=0}return _u.apply(this,arguments)}}
// ---------- máquinas de preguntas (gimnasio de fuego) y rocas de Fuerza ----------
{const _i=exInteract;exInteract=function(){try{if(gymOn()&&!EX.dlg&&!EX.mv&&!EX.trans&&!EX.cut){const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy,c=exAt(x,y);
  if(c==="?"){const Q=GYM_Q[EX.map]&&GYM_Q[EX.map][x+","+y];if(!Q)return;
    if(!EX.grid[Q.g].includes("e")){exSay(["La máquina ya está apagada. ¡La barrera está abierta!"]);return}
    stRun(async()=>{snd("ui");await sSay(["Es una máquina de preguntas. Si aciertas, la barrera de fuego se apagará."]);const i=await sChoice(Q.q,Q.o.map(t=>({t:t})));
      if(i===Q.a){snd("lvl");await sSay(["¡Correcto! ¡La barrera de fuego se ha apagado!"])}
      else{await sSay(["¡Incorrecto! La respuesta era «"+Q.o[Q.a]+"».","Un ayudante del gimnasio sale a tu encuentro…"]);
        const r2=await sBattle(sTr(["Ponyta","Growlithe","Slugma"],1,"Ayudante Brasa",chClassLook("firebreather","q"+x+y)));if(r2!==true){if(r2===false)return;return}
        await sSay(["«¡Vale, vale! Has ganado: te abro la barrera.»"])}
      EX.grid[Q.g]=EX.grid[Q.g].map(ch=>ch==="e"?"l":ch)});return}
  if(c==="v"){if(EX.strength===EX.map){exSay(["Ya puedes mover las rocas grandes. ¡Empújalas andando hacia ellas!"]);return}
    stRun(async()=>{if(await hmAsk("str",["Es una roca enorme. Un Pokémon muy fuerte podría moverla."])){EX.strength=EX.map;await sSay(["¡Ahora puedes empujar las rocas grandes!"])}});return}}}catch(e){console.error(e)}
  return _i.apply(this,arguments)}}
// ---------- dibujo ----------
const gymFloor=(x,y)=>xFloor((EX.M&&EX.M.fl)||"clean",x,y);
function gymGround(c,x,y,fr){const th=GYMP[EX.map],v=(x+y)%2,k="GYG"+EX.map+c+v+(GYM_CUR[c]?fr:"");if(XG[k])return XG[k];const cv=xc(32,32),g=cv.getContext("2d"),R=(a,b,w,h,col)=>X2(g,a,b,w,h,col);
  if(c==="z"){R(0,0,16,16,"#c4e4f8");R(0,0,16,1,"#e8f6ff");R(0,0,1,16,"#e8f6ff");R(0,15,16,1,"#9ccbe8");R(15,0,1,16,"#9ccbe8");R(3+v*5,4,4,1,"#ffffff");R(4+v*5,5,2,1,"#ffffff");R(9-v*4,11,3,1,"#e8f6ff")}
  else if(GYM_CUR[c]){R(0,0,16,16,"#4a88e0");for(let i=0;i<16;i+=4)R(0,i,16,1,"#5a96ea");const d=GYM_CUR[c],o=fr?3:0,W="#d8f0ff";
    const chev=(cx,cy)=>{if(d==="r"){R(cx,cy,1,1,W);R(cx+1,cy+1,1,1,W);R(cx,cy+2,1,1,W)}else if(d==="l"){R(cx+1,cy,1,1,W);R(cx,cy+1,1,1,W);R(cx+1,cy+2,1,1,W)}else if(d==="u"){R(cx,cy+1,1,1,W);R(cx+1,cy,1,1,W);R(cx+2,cy+1,1,1,W)}else{R(cx,cy,1,1,W);R(cx+1,cy+1,1,1,W);R(cx+2,cy,1,1,W)}};
    const off=d==="r"||d==="d"?o:-o;if(d==="r"||d==="l"){chev((3+off+16)%14,3);chev((10+off+16)%14,10)}else{chev(3,(3+off+16)%13);chev(10,(10+off+16)%13)}}
  else if(c==="^"){g.drawImage(gymFloor(x,y),0,0);R(1,2,14,13,"#1c1c26");R(2,3,12,11,"#0a0a12");R(2,3,12,2,"#2a2a36");R(3,12,10,1,"#1a1a24")}
  else if(c==="@"){g.drawImage(gymFloor(x,y),0,0);R(2,3,12,10,"#4a2a7a");R(3,4,10,8,"#9a6ae0");R(4,5,8,6,"#d0b0ff");R(6,7,4,2,"#ffffff")}
  else if(c==="a"){g.drawImage(gymFloor(x,y),0,0);R(3,3,10,10,"#28202c");R(4,4,8,8,"#e8c030");R(5,5,6,3,"#fff0a0");R(4,10,8,1,"#a88010")}
  else if(c==="l"){g.drawImage(gymFloor(x,y),0,0);const col=th==="fire"?"#c86a48":th==="electric"?"#b0a050":"#9a8ac0";R(1,1,14,1,col);R(1,14,14,1,col);for(let i=2;i<14;i+=4)R(i,7,2,1,col)}
  else g.drawImage(gymFloor(x,y),0,0);
  return XG[k]=cv}
{const _g=xGround;xGround=function(x,y,fr){try{if(gymOn()){const c=exAt(x,y);if("zla@^e?vo".includes(c)||GYM_CUR[c])return gymGround(c,x,y,fr)}}catch(e){}return _g.apply(this,arguments)}}
function gymBar(th){const fr=th==="fire"?Math.floor(performance.now()/160)%2:0,k="GYB"+th+fr;if(XG[k])return XG[k];const cv=xc(32,48),g=cv.getContext("2d"),R=(a,b,w,h,col)=>X2(g,a,b,w,h,col),O="#28202c";
  if(th==="fire"){R(0,20,16,4,O);R(0,21,16,2,"#5a3a2a");for(let i=1;i<16;i+=5){const h=fr?9:7;R(i,22-h,3,h,O);R(i+1,22-h+1,1,h-1,"#ff8a2a");R(i+1,22-h+1,1,2,"#ffe27a")}R(0,12,16,1,"rgba(255,140,60,.25)")}
  else if(th==="electric"){R(1,8,2,16,O);R(13,8,2,16,O);R(1,8,1,16,"#9aa6b8");R(13,8,1,16,"#9aa6b8");[11,15,19].forEach(y=>{for(let x=3;x<13;x++)R(x,y+((x%2)?1:0),1,1,"#ffe040")});R(0,7,4,2,O);R(12,7,4,2,O);R(1,7,2,1,"#ffe040");R(13,7,2,1,"#ffe040")}
  else{R(1,6,14,18,O);R(2,7,12,16,"#7a4ab8");R(2,7,4,16,"#9a6ae0");R(10,7,4,16,"#5a2a90");R(3,9,2,4,"#d0b0ff");R(7,12,2,6,"#b890f0")}
  return XG[k]=cv}
function gymQuiz(){const k="GYQ";if(XG[k])return XG[k];const cv=xc(32,48),g=cv.getContext("2d"),R=(a,b,w,h,col)=>X2(g,a,b,w,h,col),O="#28202c";xdisc(g,16,45,11,3,"rgba(0,0,0,.22)");
  R(2,6,12,17,O);R(3,7,10,15,"#e05030");R(3,7,10,2,"#ff8060");R(4,9,8,5,"#1a2a40");R(5,10,1,3,"#5ad1a0");R(7,10,2,1,"#ffe27a");R(9,11,2,1,"#ffe27a");R(5,16,2,2,"#ffe040");R(9,16,2,2,"#40c0ff");R(6,19,4,1,"#a83020");return XG[k]=cv}
{const _o=xObj;xObj=function(c,x,y){try{if(gymOn()){if(c==="e")return gymBar(GYMP[EX.map]==="electric"?"electric":GYMP[EX.map]==="fire"?"fire":"psychic");if(c==="?")return gymQuiz();if(c==="v")return hmObjV();if("zla@^".includes(c)||GYM_CUR[c])return null}}catch(e){}return _o.apply(this,arguments)}}
