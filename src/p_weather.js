// =====================================================================================
// TIEMPO REAL, NAVIDAD Y NOCHEVIEJA EN EL PUEBLO 3D
// · Clima real: el tiempo que hace ahora en la ciudad de tu zona horaria (Open-Meteo, sin datos personales: solo se
//   envían las coordenadas de esa ciudad). Sol, nubes, niebla, lluvia, tormenta con rayos o nieve. Se actualiza cada
//   30 minutos. En diciembre siempre nieva.
// · Navidad: en diciembre el pueblo está nevado (suelo, árboles, tejados) y, del 1 de diciembre al 6 de enero, hay un
//   gran árbol de Navidad y luces de colores en los pinos.
// · Nochevieja (hora de España): fuegos artificiales, cuenta atrás en el último minuto del año y, el 1 de enero, un
//   gran regalo de Año Nuevo. Aparece en el Calendario de eventos.
// p_land3d.js dibuja todo esto a partir de window.WXENV.
// =====================================================================================
const RW_OFF=()=>+(window._nyOff||0);// (solo para probar: desplaza la fecha)
const rwNow=()=>Date.now()+RW_OFF();
// ciudad de referencia de cada zona horaria (si no está, se usa la ciudad que da nombre a la zona o, si no, Madrid)
const RW_TZ={"Europe/Madrid":[40.42,-3.70,"Madrid"],"Atlantic/Canary":[28.12,-15.43,"Las Palmas"],"Africa/Ceuta":[35.89,-5.32,"Ceuta"],"Europe/Lisbon":[38.72,-9.14,"Lisboa"],"Europe/London":[51.51,-.13,"Londres"],"Europe/Paris":[48.86,2.35,"París"],"Europe/Berlin":[52.52,13.4,"Berlín"],"Europe/Rome":[41.9,12.5,"Roma"],"Europe/Brussels":[50.85,4.35,"Bruselas"],"Europe/Amsterdam":[52.37,4.9,"Ámsterdam"],"Europe/Zurich":[47.37,8.54,"Zúrich"],"Europe/Andorra":[42.51,1.52,"Andorra"],"Europe/Dublin":[53.35,-6.26,"Dublín"],"Europe/Warsaw":[52.23,21.01,"Varsovia"],"Europe/Moscow":[55.76,37.62,"Moscú"],
  "America/Mexico_City":[19.43,-99.13,"Ciudad de México"],"America/Monterrey":[25.69,-100.32,"Monterrey"],"America/Tijuana":[32.51,-117.04,"Tijuana"],"America/Cancun":[21.16,-86.85,"Cancún"],"America/Bogota":[4.71,-74.07,"Bogotá"],"America/Lima":[-12.05,-77.04,"Lima"],"America/Santiago":[-33.45,-70.67,"Santiago"],"America/Argentina/Buenos_Aires":[-34.6,-58.38,"Buenos Aires"],"America/Buenos_Aires":[-34.6,-58.38,"Buenos Aires"],
  "America/Caracas":[10.48,-66.9,"Caracas"],"America/Guayaquil":[-2.17,-79.92,"Guayaquil"],"America/La_Paz":[-16.5,-68.15,"La Paz"],"America/Asuncion":[-25.26,-57.58,"Asunción"],"America/Montevideo":[-34.9,-56.16,"Montevideo"],"America/Panama":[8.98,-79.52,"Panamá"],"America/Costa_Rica":[9.93,-84.08,"San José"],"America/Guatemala":[14.63,-90.51,"Guatemala"],"America/El_Salvador":[13.69,-89.22,"San Salvador"],"America/Tegucigalpa":[14.07,-87.19,"Tegucigalpa"],"America/Managua":[12.11,-86.24,"Managua"],"America/Havana":[23.11,-82.37,"La Habana"],"America/Santo_Domingo":[18.49,-69.93,"Santo Domingo"],"America/Puerto_Rico":[18.47,-66.11,"San Juan"],
  "America/New_York":[40.71,-74.01,"Nueva York"],"America/Chicago":[41.88,-87.63,"Chicago"],"America/Denver":[39.74,-104.99,"Denver"],"America/Los_Angeles":[34.05,-118.24,"Los Ángeles"],"America/Sao_Paulo":[-23.55,-46.63,"São Paulo"],"America/Toronto":[43.65,-79.38,"Toronto"],"Asia/Tokyo":[35.68,139.69,"Tokio"],"Australia/Sydney":[-33.87,151.21,"Sídney"]};
const RW={code:null,cloud:0,wind:0,city:"",t:0,busy:false};
const rwTz=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"Europe/Madrid"}catch(e){return "Europe/Madrid"}};
const rwOff=()=>{try{return !!(typeof O!=="undefined"&&O.nowx)}catch(e){return false}};
// tiempo real de tu zona, como mucho una vez cada 30 minutos (se recuerda entre visitas)
async function rwFetch(){if(RW.busy||rwOff())return;const tz=rwTz(),c=RW_TZ[tz]||RW_TZ["Europe/Madrid"];
  try{const o=JSON.parse(localStorage.getItem("pgc-wx")||"null");if(o&&o.tz===tz&&Date.now()-o.t<30*6e4){Object.assign(RW,o);return}}catch(e){}
  RW.busy=true;try{const r=await fetch("https://api.open-meteo.com/v1/forecast?latitude="+c[0]+"&longitude="+c[1]+"&current=weather_code,cloud_cover,wind_speed_10m&timezone=auto");if(!r.ok)throw 0;const j=await r.json(),cu=j&&j.current;if(!cu)throw 0;
    Object.assign(RW,{code:cu.weather_code|0,cloud:(+cu.cloud_cover||0)/100,wind:+cu.wind_speed_10m||0,city:c[2],t:Date.now(),tz});try{localStorage.setItem("pgc-wx",JSON.stringify({code:RW.code,cloud:RW.cloud,wind:RW.wind,city:RW.city,t:RW.t,tz}))}catch(e){}}
  catch(e){RW.t=Date.now()-25*6e4}finally{RW.busy=false}}
// código del tiempo (WMO) → cómo se ve en el pueblo
function rwKind(code,cloud){const c=code|0;
  if(c>=95)return{k:"storm",n:"⛈️ Tormenta",cloud:1,rain:1,storm:1};
  if(c>=85)return{k:"snow",n:"🌨️ Chubascos de nieve",cloud:.8,snow:c>=86?.9:.6};
  if(c>=80)return{k:"rain",n:"🌦️ Chubascos",cloud:.75,rain:c>=81?.75:.45};
  if(c>=71&&c<=77)return{k:"snow",n:"❄️ Nieve",cloud:.75,snow:c>=75?1:c>=73?.7:.45};
  if(c>=61&&c<=67)return{k:"rain",n:"🌧️ Lluvia",cloud:.85,rain:c>=65?1:c>=63?.7:.45};
  if(c>=51&&c<=57)return{k:"rain",n:"🌦️ Llovizna",cloud:.7,rain:.25};
  if(c===45||c===48)return{k:"fog",n:"🌫️ Niebla",cloud:.5,fog:1};
  if(c===3)return{k:"cloudy",n:"☁️ Nublado",cloud:.85};
  if(c===2)return{k:"cloudy",n:"⛅ Algo nublado",cloud:Math.max(.3,cloud*.6)};
  return{k:"clear",n:"☀️ Despejado",cloud:Math.min(.2,cloud*.3)}}
// fecha y hora de España (para Nochevieja, igual para todos)
function rwMadrid(t){const o={};new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).formatToParts(new Date(t)).forEach(x=>o[x.type]=+x.value||x.value);return{y:+o.year,m:+o.month,d:+o.day,h:+o.hour%24,mi:+o.minute,s:+o.second}}
// intensidad de los fuegos artificiales según la hora de España
function rwFw(){const M=rwMadrid(rwNow()),hm=M.h+M.mi/60;
  if(M.m===12&&M.d===31){if(hm>=23.5)return .45+(hm-23.5)*.9;if(hm>=21)return .22;return 0}
  if(M.m===1&&M.d===1){if(hm<.34)return 1;if(hm<2)return .55;if(hm>=20)return .25}
  return 0}
// el entorno que dibuja el pueblo
function rwEnv(){const d=new Date(rwNow()),mo=d.getMonth()+1,day=d.getDate(),dec=mo===12,xmas=dec||(mo===1&&day<=6);
  let w={cloud:0,rain:0,snow:0,fog:0,storm:0,wind:0},name="";
  if(!rwOff()){if(RW.code!=null){const k=rwKind(RW.code,RW.cloud);w=Object.assign(w,k);name=k.n;w.wind=Math.min(3,RW.wind/12)}
    // en diciembre, siempre nieva (si de verdad nieva, con la fuerza real; si no, una nevada tranquila)
    if(dec){w={cloud:Math.max(.45,Math.min(.8,w.cloud)),rain:0,snow:Math.max(.6,w.snow||0),fog:Math.min(.3,w.fog||0),storm:0,wind:Math.min(1.2,w.wind)};name="❄️ Nieve (¡es diciembre!)"}}
  return{wx:w,cover:dec||(!rwOff()&&w.snow>.55)?1:0,xmas,fw:rwFw(),name,city:RW.city}}
setInterval(()=>{if(!RW.t||Date.now()-RW.t>30*6e4)rwFetch();window.WXENV=rwEnv()},2000);setTimeout(()=>{rwFetch();window.WXENV=rwEnv()},800);

// ================= NOCHEVIEJA Y AÑO NUEVO =================
// cuenta atrás en el último minuto del año (hora de España) y, el 1 de enero, ventana con el gran regalo
// Regalo de Año Nuevo (el mismo para todos): tickets (30 horas de producción o 150 millones, lo que sea mayor), objetos…
// y, además, cada jugador elige 2 legendarios variocolor entre 5 que le tocan solo a él (cambian de un jugador a otro).
const NY_GIFT=y=>({t:Math.max(150000000+y%100*100000,Math.round((typeof tps==="function"?tps():0)*3600*30)),it:{mb:12,crys:6,cand:50,ppmax:10,tshard:20},hold:6,pick:2,of:5});
function nyTxt(g){return "✨ "+g.pick+" legendarios variocolor a elegir entre "+g.of+" (distintos para cada entrenador) + "+fmt(Math.round(g.t*RMUL()))+" 🎟️ + "+g.it.mb+" Master Ball + "+g.it.crys+" Cristales Supremos + "+g.it.cand+" Caramelos Raros + "+g.it.ppmax+" PP máximos + "+g.it.tshard+" Teralitos + "+g.hold+" objetos equipables"}
// los 5 legendarios de cada jugador: salen de su cuenta y del año, así son siempre los mismos aunque cambie de dispositivo
const NY_LEGS=()=>P.filter(p=>p[2]==="L"&&!/^Mega-|Primigenio|Forma |Gigamax|Dinamax/.test(p[0])&&!(typeof isSup==="function"&&isSup(p[0]))&&!(typeof isMegaF==="function"&&isMegaF(p[0]))).map(p=>p[0]);
function nyOpts(y){S.nyc=S.nyc||{};if(S.nyc.y===y&&Array.isArray(S.nyc.L)&&S.nyc.L.length===5)return S.nyc.L;
  let id="";try{id=(window.FB&&window.FB.uid&&window.FB.uid())||""}catch(e){}if(!id){S.nyid=S.nyid||Math.random().toString(36).slice(2);id=S.nyid}
  let h=2166136261;for(const ch of id+"|"+y){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}
  const rnd=()=>{h=(Math.imul(h,1103515245)+12345)>>>0;return h/4294967296},A=NY_LEGS(),L=[];
  while(L.length<5&&A.length){const i=Math.floor(rnd()*A.length);L.push(A.splice(i,1)[0])}
  S.nyc={y:y,L:L};try{save()}catch(e){}return L}
function nyClaim(y,picks){if(S.ny===y)return;const g=NY_GIFT(y),ok=nyOpts(y);picks=(picks||[]).filter(n=>ok.includes(n)).slice(0,g.pick);if(!picks.length)return;
  S.ny=y;const rw={t:g.t,it:Object.assign({},g.it)};for(let i=0;i<g.hold;i++){const k=HOLD[Math.floor(Math.random()*HOLD.length)][0];rw.it[k]=(rw.it[k]||0)+1}
  grant(rw);const lv=typeof clampL==="function"?clampL(Math.max(10,Math.min(typeof lvCap==="function"?lvCap():50,typeof leadLevel==="function"?leadLevel():10))):10;
  const nw=picks.map(n=>giveMon(n,lv,true));S.nyGot={y:y,L:picks};save();try{render()}catch(e){}if(window.cloudFlush)try{window.cloudFlush(true)}catch(e){}
  return{rw,nw,g,picks}}
function nyShow(y){
  const g=NY_GIFT(y),claimed=S.ny===y,L=nyOpts(y),got=S.nyGot&&S.nyGot.y===y?S.nyGot.L:[],M=document.createElement("div");let sel=claimed?got.slice():[];
  M.id="nyM";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");M.setAttribute("aria-label","Feliz Año Nuevo");
  M.innerHTML='<div class="nybox nybig"><div class="nyfw" aria-hidden="true"></div><small class="nyk">🎆 NOCHEVIEJA · AÑO NUEVO · SOLO UNA VEZ AL AÑO</small><h2>¡Feliz '+y+'!</h2>'+
    '<p>Gracias por jugar a Poke Gacha Online. Para empezar el año a lo grande, <b>elige '+g.pick+' de estos '+g.of+' legendarios variocolor</b>. ¡Son solo para ti: cada entrenador tiene los suyos!</p>'+
    '<div class="nylegs">'+L.map(n=>'<button type="button" class="nyleg" data-nyl="'+esc(n)+'"'+(claimed?' disabled':'')+'><span class="nyshine" aria-hidden="true"></span>'+'<span class="nyimg">'+(PM[n]?icoHD(PM[n],96,false,true):'')+'</span><b>✨ '+esc(n)+'</b><small>'+(PM[n]?tyTxt(PM[n]):'')+'</small><i class="nychk">✓</i></button>').join("")+'</div>'+
    '<p class="nygift"><b>Y además, para todos:</b><br>'+fmt(Math.round(g.t*RMUL()))+' 🎟️ · '+g.it.mb+' Master Ball · '+g.it.crys+' Cristales Supremos · '+g.it.cand+' Caramelos Raros · '+g.it.ppmax+' PP máximos · '+g.it.tshard+' Teralitos · '+g.hold+' objetos equipables</p>'+
    '<button type="button" class="red big" id="nyGo" disabled></button><button type="button" class="alt" id="nyX">'+(claimed?'Cerrar':'Más tarde')+'</button></div>';
  document.body.appendChild(M);try{snd("lvl")}catch(e){}
  const paint=()=>{M.querySelectorAll("[data-nyl]").forEach(b=>b.classList.toggle("on",sel.includes(b.dataset.nyl)));const go=M.querySelector("#nyGo");
    if(S.ny===y){go.disabled=true;go.textContent="✅ ¡Regalo recogido!";return}
    go.disabled=!sel.length;go.textContent=sel.length?"🎁 ¡Recoger mi regalo! ("+sel.length+"/"+g.pick+")":"Elige "+g.pick+" legendarios"};paint();
  // chispas de colores en la ventana
  const fw=M.querySelector(".nyfw");if(!(typeof hubCalm==="function"&&hubCalm()))for(let i=0;i<48;i++){const s=document.createElement("i");s.style.left=(4+Math.random()*92)+"%";s.style.top=(3+Math.random()*60)+"%";s.style.background=["#ff5a6a","#ffd23f","#5ab4ff","#7aff8a","#e07aff","#fff"][i%6];s.style.animationDelay=(Math.random()*2.4)+"s";fw.appendChild(s)}
  M.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-nyl]");if(!b||S.ny===y)return;const n=b.dataset.nyl;
    if(sel.includes(n))sel=sel.filter(x=>x!==n);else{if(sel.length>=g.pick)sel.shift();sel.push(n);try{if(PM[n])cry(n)}catch(x){}}snd("ui");paint()});
  M.querySelector("#nyX").onclick=()=>M.remove();
  M.querySelector("#nyGo").onclick=async()=>{if(S.ny===y||!sel.length)return;
    if(sel.length<g.pick&&!(await askOk("Solo has elegido "+sel.length+" de "+g.pick+" legendarios. Después no podrás cambiarlo. ¿Recoger el regalo así?")))return;
    const r=nyClaim(y,sel);if(!r)return;paint();M.querySelectorAll("[data-nyl]").forEach(b=>b.disabled=true);snd("capok");
    toast("🎆 ¡Feliz "+y+"! ✨ "+r.picks.join(" y ")+" se unen a ti. ¡Regalo recibido!")};
}
function nyCountdown(){const M=rwMadrid(rwNow());let el=$("nyCd");
  if(M.m===12&&M.d===31&&M.h===23&&M.mi===59){const left=60-M.s;if(!el){el=document.createElement("div");el.id="nyCd";document.body.appendChild(el)}
    const big=left<=10;el.className=big?"big":"";const html=big?'<b>'+left+'</b><small>¡'+(M.y+1)+' está a punto de llegar!</small>':'🎆 ¡'+(M.y+1)+' llega en '+left+' s!';if(el.innerHTML!==html){el.innerHTML=html;if(big)try{snd("click")}catch(e){}}}
  else if(el)el.remove()}
// ¿toca enseñar la ventana de Año Nuevo? (el 1 de enero, una vez; si aún no has recogido el regalo, vuelve a salir al entrar)
function nyCheck(){if(typeof S==="undefined"||!S||$("nyM"))return;const M=rwMadrid(rwNow());if(!(M.m===1&&M.d===1))return;
  if(S.ny===M.y)return;if(window._nyShown===M.y)return;if(typeof evpFree==="function"&&!evpFree())return;window._nyShown=M.y;nyShow(M.y)}
setInterval(()=>{try{nyCountdown();nyCheck()}catch(e){}},500);

// ================= EN EL CALENDARIO DE EVENTOS =================
{const _ce=calEvents;calEvents=function(){const L=_ce.apply(this,arguments),now=Date.now(),end=now+7*864e5,M=rwMadrid(rwNow()),y=M.m===12?M.y:M.m===1&&M.d<=1?M.y-1:M.y;
  // 31 de diciembre a medianoche de España (las 23:00 UTC)
  const mid=Date.UTC(y,11,31,23,0,0)-RW_OFF();
  if(mid+864e5>now&&mid-864e5*7<end){L.push({a:mid-2.5*36e5,b:mid+2*36e5,ic:"🎆",t:"¡Nochevieja! Fuegos artificiales en el pueblo",d:"Cuenta atrás en el último minuto del año y fuegos artificiales sobre el pueblo",c:"#ff4fa0"});
    L.push({a:mid,b:mid+864e5,ic:"🎁",t:"Gran regalo de Año Nuevo",d:nyTxt(NY_GIFT(y+1)),c:"#ffb02e"})}
  return L.sort((a,b)=>a.a-b.a)}}
// arriba del calendario, siempre a la vista en diciembre: la gran cita de Nochevieja
{const _cu=calUI;calUI=function(){_cu.apply(this,arguments);const box=$("calPB");if(!box)return;const M=rwMadrid(rwNow());if(M.m!==12)return;
  const y=M.y,mid=Date.UTC(y,11,31,23,0,0)-RW_OFF(),left=mid-Date.now();if(left<-864e5)return;
  const d=Math.floor(left/864e5),h=Math.floor(left%864e5/36e5);
  box.insertAdjacentHTML("afterbegin",'<div class="nycal"><span>🎆</span><div><b>Nochevieja · 31 de diciembre a medianoche</b><small>'+(left>0?'Faltan '+(d?d+' d ':'')+h+' h. ':'¡Ya es Año Nuevo! ')+'Fuegos artificiales en el pueblo y un gran regalo de Año Nuevo: '+esc(nyTxt(NY_GIFT(y+1)))+'</small></div></div>')}}

// ================= AJUSTES =================
// interruptor del clima real (en Ajustes → Gráficos) y el tiempo de ahora
setInterval(()=>{const p=document.querySelector('#optp .setpane[data-st="gfx"]');if(!p)return;let l=$("wxOpt");
  if(!l){l=document.createElement("label");l.id="wxOpt";l.className="tog";l.innerHTML='<input type="checkbox" id="wxChk"> <span>🌦️ Clima real en el pueblo (lluvia, nieve, niebla… según el tiempo de tu zona) <small id="rwNow" class="mut"></small></span>';p.appendChild(l);
    const c=$("wxChk");c.checked=!rwOff();c.onchange=()=>{O.nowx=!c.checked;saveO();window.WXENV=rwEnv();if(c.checked)rwFetch()}}
  const e=window.WXENV,t=rwOff()?"(desactivado)":e&&e.name?"Ahora: "+e.name+(e.city&&!/diciembre/.test(e.name)?" en "+e.city:""):"";const n=$("rwNow");if(n&&n.textContent!==t)n.textContent=t},2000);
