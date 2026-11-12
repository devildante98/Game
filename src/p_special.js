// =====================================================================================
// POKÉMON ESPECIALES EN EL MAPA (como en la saga)
// · Un Snorlax dormido tapa un rincón de la Ruta 4. Solo se despierta con la Poké Flauta (te la da el Abuelo de Pueblo Brisa).
// · Algunos objetos del suelo son en realidad Pokémon disfrazados (¡cuidado en las cuevas y en la Torre!).
// · Un Pokémon legendario recorre las rutas de la región: cambia de sitio cada vez que cambias de mapa.
// =====================================================================================
const SP_SNOR={m:"ruta4",x:3,y:18};
const spSnorGone=()=>{try{return !!stSt().f.snor}catch(e){return false}};
// el Snorlax: bloquea la casilla «0» mientras siga dormido
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{if(m===SP_SNOR.m&&spSnorGone()&&EX.grid[SP_SNOR.y])EX.grid[SP_SNOR.y][SP_SNOR.x]="."}catch(e){}return r}}
{const _b=exBlocked;exBlocked=function(x,y){if(exAt(x,y)==="0")return true;return _b.apply(this,arguments)}}
{const _g=xGround;xGround=function(x,y,fr){try{if(exAt(x,y)==="0"){const k="SPG"+((x+y)%4);if(XG[k])return XG[k];const c=xc(32,32);xGrassBase(c.getContext("2d"),(x+y)%4);return XG[k]=c}}catch(e){}return _g.apply(this,arguments)}}
{const _o=xObj;xObj=function(c,x,y){if(c==="0")return null;return _o.apply(this,arguments)}}
// se dibuja grande y respirando, con «Zzz» (ordenado por profundidad con el resto de personajes)
{const _x=exExtraEnts;exExtraEnts=function(ents,g,cx,cy,ts){const r=_x.apply(this,arguments);try{if(EX.map!==SP_SNOR.m||spSnorGone()||EX.title)return r;const im=stMonImg("Snorlax");if(!im.complete||!im.naturalWidth)return r;
  ents.push({y:SP_SNOR.y+.2,d:()=>{const X=SP_SNOR.x*EXTL-cx+16,Y=SP_SNOR.y*EXTL-cy+30,s=1+Math.sin(ts/700)*.03,sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;
    g.fillStyle="rgba(0,0,0,.25)";g.beginPath();g.ellipse(X,Y-2,24,6,0,0,7);g.fill();g.drawImage(im,Math.round(X-32*s),Math.round(Y-58*s),Math.round(64*s),Math.round(64*s));g.imageSmoothingEnabled=sm;
    g.fillStyle="#fff";g.strokeStyle="#28202c";g.lineWidth=3;g.font="bold 12px monospace";const z=Math.floor(ts/600)%3;for(let i=0;i<=z;i++){const tx=X+16+i*8,ty=Y-52-i*9;g.strokeText("z",tx,ty);g.fillText("z",tx,ty)}}})}catch(e){}return r}}
async function spFlute(){const N=[72,76,79,84,79,76,72];for(const n of N){try{if(typeof mnoteV==="function"&&typeof actx!=="undefined"&&actx){mnoteV("triangle",n,actx.currentTime,.22,.14)}else snd("ui")}catch(e){}await sW(190)}}
{const _i=exInteract;exInteract=function(){try{if(!EX.dlg&&!EX.mv&&!EX.trans&&!EX.cut){const[dx,dy]=EXDIR[EX.f],x=EX.x+dx,y=EX.y+dy,c=exAt(x,y);
  if(c==="0"){const f=stSt().f;stRun(async()=>{await sSay(["Un Pokémon enorme duerme plácidamente en mitad del camino…","¡Ronca tan fuerte que tiemblan las hojas!"]);
      if(!f.flute){await sSay(["Dicen que solo una melodía muy especial puede despertarlo.","(El Abuelo de Pueblo Brisa tiene una Poké Flauta.)"]);return}
      const ch=await sChoice("¿Quieres tocar la Poké Flauta?",[{t:"Sí"},{t:"No"}]);if(ch!==0)return;
      await sSay(["Tocas la Poké Flauta…"]);await spFlute();await sSay(["¡El Pokémon se ha despertado! ¡Y parece de muy mal humor!"]);
      const lv=clampL(Math.max(30,sLv(0)+2)),m=mkEnemy(PM.Snorlax,lv);m.mx=Math.round(m.mx*1.2);m.mh=m.mx;
      const r=await sBattle({eteam:[m],cap:"Snorlax"},"wild");if(r===null)return;f.snor=1;save();if(EX.map===SP_SNOR.m&&EX.grid[SP_SNOR.y])EX.grid[SP_SNOR.y][SP_SNOR.x]=".";
      if(r!=="cap")await sSay(["Snorlax se ha marchado bostezando hacia el bosque. ¡El camino está libre!"])});return}
  // objetos que en realidad son Pokémon
  if(c==="I"){const k=EX.map+":"+x+","+y,P=SP_FAKE[k];if(P&&!(exSt().d.it||{})[k]){stRun(async()=>{exSt().d.it[k]=1;EX.grid[y][x]=EX.M.base;save();
      await sSay(["Parece un objeto en el suelo…","¡¿Eh?! ¡Se ha movido! ¡Era un "+P+"!"]);const lv=clampL(sLv(0)+1),m=mkEnemy(stageFor(PM[P],lv)||PM[P],lv);await sBattle({eteam:[m],cap:P},"wild")});return}}}}catch(e){console.error(e)}
  return _i.apply(this,arguments)}}
const SP_FAKE={"cueva:24,9":"Voltorb","victoria:24,9":"Electrode","torre:10,9":"Electrode","bosque:24,10":"Foongus"};
// el Abuelo de Pueblo Brisa te da la Poké Flauta (cuando ya has llegado a la región de Tormenta)
{const _v=STX.v3;STX.v3=function(){const f=stSt().f;if(!f.flute&&xbCount()>=5)return stRun(async()=>{await sSay(S_("Abuelo","¡Ah, eres tú! Me han contado que un Pokémon gigante duerme en la Ruta 4 y no deja pasar a nadie.","Cuando yo era joven, lo despertábamos con esta flauta. Toma, a ti te hará más falta que a mí."));
  snd("lvl");f.flute=1;save();await sSay(["¡Has recibido la Poké Flauta!","Mira al Pokémon dormido y pulsa A para tocarla."])});return _v.apply(this,arguments)}}
// ---------- legendario errante ----------
const SP_ROAM="Suicune",SP_ROUTES=["ruta","ruta2","ruta3","ruta4","ruta5","bosque","cima","pico_e","cumbre"];
function spRoam(){const f=stSt().f;if(!f.roam||f.roam.done)return null;return f.roam}
function spRoamMove(){const f=stSt().f,R=spRoam();if(!R)return;const L=SP_ROUTES.filter(k=>EXM[k]&&(typeof wmOpenZone!=="function"||wmOpenZone(k)));if(!L.length)return;let m=R.m;for(let i=0;i<6&&m===R.m;i++)m=L[Math.floor(Math.random()*L.length)];R.m=m;save()}
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{if(spRoam()&&m!==spRoam().m)spRoamMove()}catch(e){}return r}}
setInterval(()=>{try{if(!EX.on||EX.title||EX.cut||EX.dlg||EX.battle||(typeof fcd!=="undefined"&&fcd))return;const f=stSt().f;if(f.roam||xbCount()<4||!PM[SP_ROAM])return;
  f.roam={m:"ruta",done:false};spRoamMove();save();stRun(async()=>{snd("lvl");await sSay(["📺 Avance informativo: varios entrenadores dicen haber visto a un Pokémon legendario corriendo por las rutas de la región.","«¡Es rapidísimo! Nunca se queda mucho tiempo en el mismo sitio», cuentan.","(Búscalo en la hierba alta de las rutas. El Mapa te dirá por dónde lo han visto.)"])})}catch(e){}},4000);
{const _e=exEncounter;exEncounter=function(){try{const R=spRoam();if(R&&EX.map===R.m&&exTeamOk()&&Math.random()<.3){stRun(async()=>{const own0=xgRun(()=>S.owned[SP_ROAM]|0),lv=clampL(Math.max(40,sLv(0)+4)),m=mkEnemy(PM[SP_ROAM],lv);
    await sSay(["¡Ha aparecido un Pokémon legendario!"]);const r=await sBattle({eteam:[m],cap:SP_ROAM},"wild");const f=stSt().f;
    if(r==="cap"||xgRun(()=>S.owned[SP_ROAM]|0)>own0){f.roam.done=true;save();return}if(r===null)return;await sSay(["¡"+SP_ROAM+" ha huido! Seguro que vuelve a aparecer en otra ruta…"]);spRoamMove()});return}}catch(e){console.error(e)}return _e.apply(this,arguments)}}
{const _wi=wmInfo;wmInfo=function(k){let h=_wi.apply(this,arguments);try{const R=spRoam();if(R&&R.m===k)h+='<small class="wmflyno">📡 Dicen que han visto a un Pokémon legendario por aquí…</small>'}catch(e){}return h}}
