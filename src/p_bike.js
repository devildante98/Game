// =====================================================================================
// BICICLETA Y VUELO (como en la saga)
// · La Bici te la regala un ciclista de Pueblo Brisa cuando ganas tu primera medalla. Se monta desde el menú (BICI).
//   Va mucho más rápido que correr y tiene su propia música. No se puede usar dentro de los edificios.
// · Vuelo (MO02, la da Ígnea): desde el Mapa, viaja al instante a cualquier pueblo que ya hayas visitado.
// · Surf también tiene su propia música.
// =====================================================================================
const bkHas=()=>{try{return !!stSt().f.bike}catch(e){return false}};
const bkOk=()=>!!(EX.M&&EX.M.base!=="F"&&!EX.surf);
function bkSet(on){if(on&&!bkOk()){exSay([EX.surf?"No puedes montar en bici mientras navegas.":"¡Aquí dentro no se puede ir en bici!"]);return}EX.bike=!!on;snd("ui");try{toast(on?"🚲 ¡Montas en la Bici!":"🚶 Te bajas de la Bici")}catch(e){}}
// más rápida que correr
{const _u=exUpdate;exUpdate=function(dt,ts){const r=_u.apply(this,arguments);try{if(EX.bike&&EX.mv&&!EX.mv._bk&&!EX.slide&&!EX.cut){EX.mv.d=Math.min(EX.mv.d,82);EX.mv._bk=1}}catch(e){}return r}}
// te bajas al entrar en un edificio o al navegar
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{if(EX.bike&&!bkOk())EX.bike=false}catch(e){}return r}}
setInterval(()=>{try{if(EX.bike&&EX.surf)EX.bike=false}catch(e){}},500);
// dibujo: la bici debajo del personaje
function bkDraw(g,face,x,y,top){const X=Math.round(x),Y=Math.round(y),O="#1c1c26",F="#e8414f",Fd="#a82a3a",M="#b4bed0",T="#3a3f58",R=(a,b,w,h,c)=>{g.fillStyle=c;g.fillRect(X+a*2,Y+b*2,w*2,h*2)};
  // manillar por delante del personaje
  if(top){if(face==="d"){R(3,8,10,1,O);R(4,8,8,1,M);R(2,8,2,1,O);R(12,8,2,1,O);R(7,7,2,2,F)}else if(face==="l"||face==="r"){const fl=face==="l",B=(a,b,w,h,c)=>R(fl?16-a-w:a,b,w,h,c);B(11,8,1,3,O);B(10,7,3,1,O)}return}
  const sp=EX.mv?Math.floor((EX.dist||0)*6)%2:0;
  if(face==="l"||face==="r"){
    // rueda redonda: neumático, llanta y radios que giran
    const wh=cx=>{[[2,0,3],[1,1,5],[0,2,7],[0,3,7],[0,4,7],[1,5,5],[2,6,3]].forEach(([a,b,w])=>R(cx+a,11+b,w,1,O));
      [[2,1,3],[1,2,5],[1,3,5],[1,4,5],[2,5,3]].forEach(([a,b,w])=>R(cx+a,11+b,w,1,M));[[2,2,3],[2,3,3],[2,4,3]].forEach(([a,b,w])=>R(cx+a,11+b,w,1,"#e4eaf4"));
      if(sp){R(cx+3,12,1,5,T);R(cx+1,14,5,1,T)}else{R(cx+2,13,1,1,T);R(cx+4,13,1,1,T);R(cx+2,15,1,1,T);R(cx+4,15,1,1,T)}R(cx+3,14,1,1,O)};
    wh(0);wh(9);const fl=face==="l",fx=a=>fl?15-a:a,B=(a,b,w,h,c)=>R(fl?16-a-w:a,b,w,h,c);
    // cuadro: del eje trasero al sillín, barra, horquilla delantera y manillar
    B(3,13,1,1,F);B(4,12,1,1,F);B(5,11,1,1,F);B(5,10,7,1,F);B(5,11,6,1,Fd);B(6,12,1,1,F);B(7,13,1,1,F);B(4,14,4,1,Fd);B(11,10,1,2,F);B(12,12,1,2,F);
    B(11,8,1,2,O);B(10,7,3,1,O);B(4,9,3,1,O);B(5,10,1,1,O);B(7,13,2,1,O)}
  else{// de frente o de espaldas: rueda estrecha y redondeada, guardabarros y manillar
    R(7,10,2,1,O);R(6,11,4,6,O);R(7,17,2,1,O);R(7,11,2,6,T);R(7,12,1,4,M);R(6,10,4,1,F);R(7,9,2,1,F);
    R(3,8,10,1,O);R(4,8,8,1,M);R(2,8,2,1,O);R(12,8,2,1,O);if(face==="d"){R(7,7,2,2,F);R(7,8,2,1,"#ffe9a8")}else R(7,7,2,1,Fd)}}
{const _t=exDrawTr;exDrawTr=function(g,code,face,x,y,fr,beat,me,ph){if(me&&EX.bike&&!EX.surf){bkDraw(g,face,x,y+4);const r=_t.call(this,g,code,face,x,y-3,0,beat,me,ph);bkDraw(g,face,x,y+4,1);return r}return _t.apply(this,arguments)}}
// en bici, el compañero no te sigue (como en los juegos)
{const _f=exDrawFol;exDrawFol=function(){if(EX.bike)return;return _f.apply(this,arguments)}}
// opción BICI en el menú (solo si la tienes)
{const _m=exMenu;exMenu=function(){try{const i=EXM_IT.findIndex(x=>x[0]==="bike");if(bkHas()&&i<0)EXM_IT.splice(EXM_IT.findIndex(x=>x[0]==="save"),0,["bike","🚲","Bici"]);else if(!bkHas()&&i>=0)EXM_IT.splice(i,1)}catch(e){}return _m.apply(this,arguments)}}
{const _md=exMenuDo;exMenuDo=function(k){if(k==="bike"){try{exMenuClose(true)}catch(e){}bkSet(!EX.bike);return}return _md.apply(this,arguments)}}
// ---------- el ciclista de Pueblo Brisa ----------
{const _n=stNPCs;stNPCs=function(m){const L=_n.apply(this,arguments);try{if(m==="pueblo"&&stSt().s>=2){const x=34,y=10;
  L.push({sid:"bici",x:x,y:y,f:"l",n:"Ciclista",look:chClassLook("cyclist","bici"),t:[],sight:0,txt:"",id:"sto:pueblo:bici",story:1,still:1,beat:true,px:x,py:y,f0:"l"})}}catch(e){}return L}}
STX.bici=()=>stRun(async()=>{const f=stSt().f,n=stN("bici");if(n)sFaceTo(n);
  if(f.bike){await sSay(S_("Ciclista","¿Qué tal va mi vieja Bici? Recuerda: la sacas desde el menú, en «Bici».","¡Con ella llegarás a todas partes en un momento!"));return}
  if(!xbHas(0)){await sSay(S_("Ciclista","¡Hola! Me encantan las bicis… ¡y los combates de gimnasio!","Tengo una Bici que ya no uso. Te la regalo cuando ganes tu primera medalla en el Gimnasio de Pueblo Brisa."));return}
  await sSay(S_("Ciclista","¡Anda! ¡Esa es la Medalla Brote! ¡Has ganado a Brezo!","Te lo prometí: toma mi Bici. ¡Cuídala mucho!"));snd("lvl");f.bike=1;save();
  await sSay(["¡Has recibido la Bici!","Ábrela desde el menú, en «Bici». Va mucho más rápido que correr."])});
// ---------- música: un tema para la bici y otro para Surf ----------
try{const BK={k:"bike",n:"Exploración · Bici",bpm:160,duty:0.25,bass:"pump",drum:"k.hsk.h.k.hsk.hs",prog:"D G A D Bm G A D",cls:1,
  lead:"A5:2 D6:2 F#6:2 A6:2 G6:2 F#6:2 E6:4 D6:2 E6:2 F#6:2 D6:2 B5:4 A5:4 G5:2 B5:2 D6:2 G6:2 F#6:2 E6:2 D6:4 C#6:2 D6:2 E6:2 A5:2 C#6:4 E6:4 F#6:2 E6:2 D6:2 B5:2 D6:2 F#6:2 B6:4 A6:2 G6:2 F#6:2 E6:2 D6:4 B5:4 G5:2 A5:2 B5:2 D6:2 E6:2 F#6:2 G6:2 E6:2 F#6:4 E6:4 D6:8",
  harm:"F#5:8 A5:8 B5:8 G5:8 A5:8 E5:8 F#5:8 A5:8 D5:8 F#5:8 B5:8 G5:8 D5:8 A5:8 A5:8 F#5:8"};
  const SU={k:"surf",n:"Exploración · Surf",bpm:96,duty:0.5,bass:"walk",drum:"k.......h.......",prog:"F C Dm Bb F C Bb C",cls:1,
  lead:"A5:4 C6:4 F6:6 E6:2 D6:4 C6:4 G5:8 A5:2 Bb5:2 C6:4 D6:4 F6:4 E6:4 D6:4 C6:8 A5:4 C6:4 F6:4 A6:4 G6:4 F6:2 E6:2 C6:8 D6:4 F6:4 Bb6:4 A6:2 G6:2 G6:4 E6:4 C6:8",
  harm:"C5:8 A4:8 E5:8 C5:8 F5:8 D5:8 D5:8 Bb4:8 C5:8 A4:8 E5:8 G4:8 D5:8 F5:8 E5:8 G5:8"};
  [BK,SU].forEach(s=>{if(XMI[s.k]==null){XMI[s.k]=SG.length;SG.push(s)}});
  const _xm=xmusMap;xmusMap=function(){try{if(EX.surf)return XMI.surf;if(EX.bike)return XMI.bike}catch(e){}return _xm.apply(this,arguments)}}catch(e){console.error(e)}
// ---------- Vuelo: desde el Mapa, a los pueblos que ya has visitado ----------
const flyHas=()=>{try{return xbHas(HM.fly.g)}catch(e){return false}};
function flySpot(k){const M=EXM[k];if(!M)return null;for(let y=0;y<M.g.length;y++){const x=M.g[y].indexOf("6");if(x>=0&&M.w&&M.w["6"])return[x,y+1]}return null}
{const _wi=wmInfo;wmInfo=function(k){let h=_wi.apply(this,arguments);try{const n=wmNode(k);if(n&&n.t==="town"&&flyHas()&&(wmVis()[k]||wmHere()===k)&&wmOpenZone(k)&&wmHere()!==k&&flySpot(k))
  h+='<button type="button" class="wmfly" data-fly="'+k+'">🕊️ Volar a '+esc((EXM[k]&&EXM[k].n)||k)+'</button>';else if(n&&n.t==="town"&&!flyHas()&&wmVis()[k]&&wmHere()!==k)h+='<small class="wmflyno">🕊️ Con la MO02 Vuelo (la da Ígnea) podrás volar aquí.</small>'}catch(e){}return h}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-fly]");if(!b)return;e.preventDefault();e.stopPropagation();flyTo(b.dataset.fly)},true);
function flyTo(k){const t=flySpot(k);if(!t)return;try{wmHide()}catch(e){}
  if(EX.M&&EX.M.base==="F"){exSay(["Aquí dentro no puedes usar Vuelo. ¡Sal fuera primero!"]);return}
  stRun(async()=>{const u=hmUser("fly");snd("lvl");await sSay(["¡"+hmName(u)+" ha usado Vuelo!"]);await sFade("fade",450);EX.bike=false;EX.surf=0;exLoad(k,t[0],t[1],"d");EX.banner={t:EXM[k].n,t0:performance.now()};try{exFollowerReset()}catch(e){}await sFade("fadein",500)})}
// ---------- acceso directo a la Bici: tecla B o botón RB del mando (se pueden cambiar en Controles) ----------
EXKB0.bike=["b",""];EXKN.bike="Bici (subir / bajar)";EXPAD0.bike=5;EXPADN.bike="Bici (subir / bajar)";
function bkQuick(){try{if(!EX.on||EX.title||EX.dlg||EX.cut||EX.trans||EX.battle||EX.choice||EX.mv&&EX.slide||EX.bind||(typeof GP!=="undefined"&&GP.bind)||(typeof fcd!=="undefined"&&fcd)||exPaused())return false;
  if(!bkHas()){exSay(["Todavía no tienes Bici.","(Un ciclista de Pueblo Brisa te la regala cuando ganas tu primera medalla.)"]);return true}bkSet(!EX.bike);return true}catch(e){return false}}
window.addEventListener("keydown",e=>{try{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable))return;
  if(exAct(e.key)==="bike"&&bkQuick())e.preventDefault()}catch(_){}});
{const _gp=gpPoll;gpPoll=function(){let eb=false;try{const L=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[],gp=L[0];if(gp&&!GP.bind){const i=exPad().bike,p=i>=0&&!!(gp.buttons[i]&&gp.buttons[i].pressed);eb=p&&!GP.pBk;GP.pBk=p}}catch(e){}
  const r=_gp.apply(this,arguments);if(eb)bkQuick();return r}}
