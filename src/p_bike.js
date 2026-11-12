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
function bkDraw(g,face,x,y){const X=Math.round(x),Y=Math.round(y),O="#1c1c26",F="#e8414f",M="#9aa6b8",R=(a,b,w,h,c)=>{g.fillStyle=c;g.fillRect(X+a,Y+b,w,h)};
  if(face==="l"||face==="r"){const wh=(cx)=>{R(cx-5,24,10,10,O);R(cx-4,25,8,8,"#3a3f58");R(cx-1,28,2,2,M)};wh(6);wh(26);R(6,27,20,2,F);R(14,22,2,7,F);R(face==="r"?22:8,19,2,8,F);R(face==="r"?20:6,18,6,2,O);R(12,21,6,2,O)}
  else{R(13,22,6,13,O);R(14,23,4,11,"#3a3f58");R(15,26,2,5,M);R(8,20,16,2,O);R(9,20,14,1,M);R(14,19,4,3,F)}}
{const _t=exDrawTr;exDrawTr=function(g,code,face,x,y,fr,beat,me,ph){if(me&&EX.bike&&!EX.surf){bkDraw(g,face,x,y+6);return _t.call(this,g,code,face,x,y-3,0,beat,me,ph)}return _t.apply(this,arguments)}}
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
