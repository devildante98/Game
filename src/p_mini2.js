// =====================================================================================
// MÁS MINIJUEGOS: Carrera de Rapidash, Excavación subterránea, ¿Quién pesa más?,
// Duelo de siluetas en directo (contra amigos) y Torneo semanal de récords
// =====================================================================================
const WTH=__WEIGHTS__;// peso en hectogramos por número de sprite
const pkId=p=>window._spr&&window._spr[p[0]];
const pkW=p=>WTH[pkId(p)]||0,pkH=p=>(typeof HDH!=="undefined"&&HDH[pkId(p)])||0;
const kgTxt=hg=>(hg/10).toLocaleString("es",{maximumFractionDigits:1})+" kg",mTxt=dm=>(dm/10).toLocaleString("es",{maximumFractionDigits:1})+" m";

// ---------------- CARRERA DE RAPIDASH ----------------
const G_RUN={id:"run",n:"Carrera de Rapidash",ic:"🔥",c:"#f07a2a",d:"Toca la pantalla (o pulsa espacio) para saltar vallas y rocas. Cada vez corre más rápido. ¡Recoge los tickets!",
  rw:s=>s*180,
  start(B,end){
    const R=PM.Rapidash||PM.Ponyta||P[0];
    B.innerHTML='<div class="whohd"><span>📏 <b id="ruD">0</b> m</span><span id="ruT"></span></div><div class="ruw" id="ruW"><div class="rusky"></div><div class="rumt"></div><div class="rugr" id="ruG"></div><div class="rupk" id="ruP">'+ico(R,96)+'</div><div class="rumsg" id="ruM">Toca o pulsa espacio para empezar</div></div>';
    const W=$("ruW"),pk=$("ruP"),gr=$("ruG"),msg=$("ruM");let w=W.clientWidth,h=W.clientHeight;
    const G=h-46,PX=70,PW=54,PH=58;let y=0,vy=0,on=true,started=false,dead=false,spd=0,dist=0,bonus=0,obs=[],coins=[],nextO=0,last=0,off=0;
    const jump=()=>{if(dead)return;if(!started){started=true;msg.textContent="";last=performance.now();loop(last);return}if(y>=-1){vy=-640;snd("pop")}};
    MG.runJump=jump;W.addEventListener("pointerdown",e=>{e.preventDefault();jump()});
    const spawn=()=>{const k=Math.random(),el=document.createElement("div");let o;
      if(k<.55)o={w:26,h:38,c:"rufence"};else if(k<.85)o={w:40,h:28,c:"rurock"};else o={w:30,h:56,c:"rufence big"};
      o.x=w+20;o.el=el;el.className="ruob "+o.c;el.style.width=o.w+"px";el.style.height=o.h+"px";W.appendChild(el);obs.push(o);
      if(Math.random()<.45){const c=document.createElement("div");c.className="rucoin";c.innerHTML="<span>🎟️</span>";const cx=w+20+o.w/2+Math.random()*60,cy=G-o.h-60-Math.random()*40;c.style.transform="translate("+cx+"px,"+cy+"px)";W.appendChild(c);coins.push({x:cx,y:cy,el:c})}};
    const loop=t=>{
      if(!on)return;const dt=Math.min(.05,(t-last)/1000);last=t;
      spd=260+dist*.55;dist+=spd*dt/20;
      vy+=1900*dt;y=Math.min(0,y+vy*dt);if(y===0)vy=0;
      pk.style.transform="translate(0,"+y.toFixed(1)+"px) scaleX(-1)";off=(off+spd*dt)%60;gr.style.backgroundPosition=(-off)+"px 0";
      nextO-=spd*dt;if(nextO<=0){spawn();nextO=Math.max(230,520-dist*.25)+Math.random()*260}
      const py=G+y-PH;
      for(const o of obs){o.x-=spd*dt;o.el.style.transform="translate("+o.x.toFixed(1)+"px,"+(G-o.h)+"px)";
        if(!o.hit&&o.x<PX+PW-12&&o.x+o.w>PX+12&&py+PH-6>G-o.h){o.hit=1;crash();return}}
      obs=obs.filter(o=>{if(o.x<-60){o.el.remove();return false}return true});
      for(const c of coins){if(c.got)continue;c.x-=spd*dt;c.el.style.transform="translate("+c.x.toFixed(1)+"px,"+c.y+"px)";
        if(c.x<PX+PW&&c.x+24>PX&&c.y+24>py&&c.y<py+PH){c.got=1;bonus+=15;snd("click");const r=c.el.getBoundingClientRect();mgPop(r.left,r.top,"+15","#ffd35c");c.el.remove()}}
      coins=coins.filter(c=>{if(c.got)return false;if(c.x<-40){c.el.remove();return false}return true});
      mgSet(Math.floor(dist)+bonus);$("ruD").textContent=Math.floor(dist);$("ruT").textContent=spd>520?"🔥 ¡Velocidad máxima!":spd>400?"💨 ¡Más rápido!":"";
      MG.raf=requestAnimationFrame(loop)};
    const crash=()=>{dead=true;on=false;snd("hit",1);pk.classList.add("rucrash");msg.textContent="¡Has chocado! "+Math.floor(dist)+" m";MG.runJump=null;mgT(()=>end(MG.score),1300)};
    mgSet(0);
  }};
document.addEventListener("keydown",e=>{if(MG.runJump&&(e.code==="Space"||e.key==="ArrowUp"||e.key===" ")){const m=$("mgM");if(m&&!m.hidden){e.preventDefault();e.stopPropagation();MG.runJump()}}},true);

// ---------------- EXCAVACIÓN SUBTERRÁNEA ----------------
const EXT=[// [id, nombre, ancho, alto, valor, tipo de premio]
 ["red","Esfera Roja",1,1,40,{t:30000}],["blu","Esfera Azul",1,1,40,{t:30000}],["prl","Perla",1,1,60,{t:60000}],["big","Esfera Grande",2,2,120,{t:150000}],
 ["nug","Pepita",1,1,90,{t:120000}],["star","Trozo Estrella",2,2,160,{t:220000}],["bone","Hueso Raro",3,1,140,{t:180000}],
 ["evo","Piedra evolutiva",2,2,200,{evo:1}],["hold","Objeto escondido",2,1,220,{hold:1}],["cand","Caramelo Raro",1,1,260,{it:{cand:1}}],
 ["helix","Fósil Hélix",3,3,300,{fos:"helix"}],["dome","Fósil Domo",3,3,300,{fos:"dome"}]];
const G_EXC={id:"exc",n:"Excavación subterránea",ic:"⛏️",c:"#8a5a2b",d:"Pica la pared para desenterrar tesoros: esferas, piedras evolutivas, objetos y fósiles. ¡Si golpeas demasiado, la pared se derrumba!",
  rw:s=>s*150,
  start(B,end){excRun(B,end,{pool:EXT,weights:[12,12,9,5,8,4,4,6,5,2,1,1],want:2+Math.floor(Math.random()*3)})},
  after(score,prize){return excAfter(score,prize,"⛏️ Tesoros")}};
// pared de excavación común (12x12: múltiplo de 3 para el martillo 3x3 y el pico en cruz)
// o: {pool, weights, want, must (tesoros que salen siempre), art}
function excRun(B,end,o){
    const CW=12,CH=12,cells=[],items=[],EXP=o.pool,weights=o.weights,want=o.want,art=o.art||exArt;let stab=100,tool="pick",over=false;
    for(let i=0;i<CW*CH;i++)cells.push({h:1+Math.floor(Math.random()*3)+(Math.random()<.25?2:0),it:-1});
    const must=(o.must||[]).slice();
    for(let tries=0;items.length<want&&tries<300;tries++){let e;if(must.length)e=must[0];else{let t=weights.reduce((a,b)=>a+b,0),x=Math.random()*t,k=0;for(;k<EXP.length;k++){x-=weights[k];if(x<=0)break}e=EXP[Math.min(k,EXP.length-1)]}
      const cx=Math.floor(Math.random()*(CW-e[2]+1)),cy=Math.floor(Math.random()*(CH-e[3]+1));let free=true;for(let a=0;a<e[2];a++)for(let b=0;b<e[3];b++)if(cells[(cy+b)*CW+cx+a].it>=0)free=false;if(!free)continue;
      if(must.length&&must[0]===e)must.shift();
      const id=items.length;items.push({e:e,x:cx,y:cy,got:false});for(let a=0;a<e[2];a++)for(let b=0;b<e[3];b++)cells[(cy+b)*CW+cx+a].it=id}
    B.innerHTML='<div class="whohd"><span>💎 Tesoros: <b id="exF">0</b>/'+items.length+'</span><div class="exstab"><i id="exS"></i></div></div><div class="exwall" id="exW" style="--cw:'+CW+';--ch:'+CH+'">'+items.map((it,i)=>'<div class="exitm ex-'+it.e[0]+'" data-ei="'+i+'" style="grid-column:'+(it.x+1)+' / span '+it.e[2]+';grid-row:'+(it.y+1)+' / span '+it.e[3]+'">'+art(it.e)+'</div>').join("")+cells.map((c,i)=>'<button class="excell h'+Math.min(5,c.h)+'" data-ec="'+i+'" style="grid-column:'+(i%CW+1)+';grid-row:'+(Math.floor(i/CW)+1)+'" aria-label="Roca"></button>').join("")+'</div>'+
      '<div class="extools"><button class="on" data-et="pick">⛏️ Pico<small>Rompe poco, daña poco la pared</small></button><button data-et="ham">🔨 Martillo<small>Rompe mucho, daña más la pared</small></button><button class="alt" data-et="stop">✋ Terminar</button></div>';
    mgSet(0);const W=$("exW");
    const updStab=()=>{const s=$("exS");s.style.width=Math.max(0,stab)+"%";s.style.background=stab>50?"#3ecf8e":stab>25?"#ffd35c":"#e63950"};updStab();
    const hit=(i,d)=>{const c=cells[i];if(!c||c.h<=0)return;c.h=Math.max(0,c.h-d);const el=W.querySelector('[data-ec="'+i+'"]');el.className="excell h"+Math.min(5,c.h)+(c.h<=0?" gone":"")};
    const check=()=>{let f=0;items.forEach((it,k)=>{if(it.got)return;let all=true;for(let a=0;a<it.e[2];a++)for(let b=0;b<it.e[3];b++)if(cells[(it.y+b)*CW+it.x+a].h>0)all=false;
      if(all){it.got=true;snd("lvl");const el=W.querySelector('[data-ei="'+k+'"]');el.classList.add("found");const r=el.getBoundingClientRect();mgPop(r.left+r.width/2,r.top,"¡"+it.e[1]+"!","#ffd35c");mgSet(MG.score+it.e[4])}});
      f=items.filter(x=>x.got).length;$("exF").textContent=f;if(f===items.length&&!over){over=true;mgT(()=>finish(true),900)}};
    const finish=ok=>{over=true;MG.exc=items.filter(x=>x.got).map(x=>x.e);if(!ok){snd("hit",1);W.classList.add("collapse")}mgT(()=>end(MG.score),ok?300:1200)};
    W.addEventListener("click",e=>{const b=e.target.closest("[data-ec]");if(!b||over)return;const i=+b.dataset.ec,x=i%CW,y=Math.floor(i/CW);
      if(tool==="pick"){hit(i,2);[[1,0],[-1,0],[0,1],[0,-1]].forEach(q=>{const X=x+q[0],Y=y+q[1];if(X>=0&&X<CW&&Y>=0&&Y<CH)hit(Y*CW+X,1)});stab-=2.2;snd("click")}
      else{for(let a=-1;a<=1;a++)for(let c=-1;c<=1;c++){const X=x+a,Y=y+c;if(X>=0&&X<CW&&Y>=0&&Y<CH)hit(Y*CW+X,a===0&&c===0?3:2)}stab-=4.4;snd("hit",1);if(!hubCalm())W.animate([{transform:"translate(-3px,2px)"},{transform:"translate(3px,-2px)"},{transform:"none"}],{duration:160})}
      updStab();check();if(stab<=0&&!over){$("exF").parentNode.innerHTML='💥 ¡La pared se ha derrumbado!';finish(false)}});
    B.querySelector(".extools").addEventListener("click",e=>{const b=e.target.closest("[data-et]");if(!b||over)return;if(b.dataset.et==="stop"){finish(true);return}tool=b.dataset.et;B.querySelectorAll(".extools [data-et]").forEach(x=>x.classList.toggle("on",x===b))});
}
function excAfter(score,prize,lab){
    const L=MG.exc||[];MG.exc=null;if(!L.length)return "";
    if(!prize)return '<p class="mut">Has desenterrado: '+L.map(e=>e[1]).join(", ")+'. (Hoy ya no quedan premios: los tesoros vuelven a la tierra.)</p>';
    const rw={t:0,it:{}},fos=[];L.forEach(e=>{const q=e[5];if(q.t)rw.t+=q.t;if(q.it)Object.keys(q.it).forEach(k=>rw.it[k]=(rw.it[k]||0)+q.it[k]);if(q.fos&&typeof fosAdd==="function"){fosAdd(q.fos,1);fos.push(e[1])}
      if(q.evo){const ev=ITEMS.filter(i=>i[7]==="evo");const k=ev[Math.floor(Math.random()*ev.length)][0];rw.it[k]=(rw.it[k]||0)+1}
      if(q.hold){const k=HOLD[Math.floor(Math.random()*HOLD.length)][0];rw.it[k]=(rw.it[k]||0)+1}});
    if(rw.t||Object.keys(rw.it).length)grant(rw);save();render();
    return '<div class="mgget"><span>'+lab+': <b>'+[rw.t||Object.keys(rw.it).length?rwTxt(rw):"",...fos.map(f=>"🦴 "+f)].filter(Boolean).join(", ")+'</b></span></div>'+(fos.length?'<p class="mut">Los fósiles se guardan en el <a href="#" data-fosgo>🧪 Laboratorio de fósiles</a>, donde puedes revivirlos.</p>':'');
}
function exArt(e){
  const k=e[0];
  if(k==="red"||k==="blu"||k==="prl"||k==="big"){const c=k==="red"?"#ff4d5e":k==="blu"?"#4da3ff":k==="prl"?"#f4f0ff":"#b06cff";return '<span class="exorb" style="--oc:'+c+'"></span>'}
  if(k==="nug")return '<span class="exorb" style="--oc:#ffcc33"></span>';
  if(k==="star")return '<span class="exstar">★</span>';
  if(k==="bone")return '<span class="exbone"></span>';
  if(k==="evo")return '<span class="exorb ev"></span>';
  if(k==="hold")return '<span class="exbox">🎁</span>';
  if(k==="cand")return itemIco("cand",30);
  if(k==="helix")return '<span class="exfos">🐚</span>';
  if(k==="dome")return '<span class="exfos">🦀</span>';
  return "";
}

// ---------------- ¿QUIÉN PESA MÁS? (o es más alto) ----------------
const G_WGT={id:"wgt",n:"¿Quién pesa más?",ic:"⚖️",c:"#13a37f",d:"Dos Pokémon: ¿cuál pesa más o menos?, ¿cuál es más alto o más bajo? Acierta seguidas todas las que puedas. Un fallo y se acaba.",
  rw:s=>s*110,
  start(B,end){
    const pool=P.filter(p=>p[2]!=="M"&&pkW(p)>0&&pkH(p)>0);let a=pool[Math.floor(Math.random()*pool.length)],streak=0,busy=false;
    const round=()=>{
      const mode=Math.random()<.6?"w":"h",inv=Math.random()<.5,val=p=>mode==="w"?pkW(p):pkH(p),oth=p=>mode==="w"?pkH(p):pkW(p),va=val(a),hard=Math.min(.9,.55+streak*.04),trick=Math.random()<.35;
      // cuanto más larga la racha, más parecidos los datos; a veces "trampa": el que parece más grande pesa menos (o al revés)
      const fits=b=>{if(b===a)return false;const vb=val(b);if(vb===va)return false;const r=Math.max(va,vb)/Math.max(1,Math.min(va,vb));if(Math.random()<hard){if(r>1.3)return false}if(trick){const big=va>vb?a:b,sm=va>vb?b:a;return oth(sm)>oth(big)}return true};
      let b=null;for(let g=0;g<400&&!b;g++){const c=pool[Math.floor(Math.random()*pool.length)];if(fits(c))b=c}
      if(!b)for(let g=0;g<200&&!b;g++){const c=pool[Math.floor(Math.random()*pool.length)];if(c!==a&&val(c)!==va)b=c}
      const T=Math.max(5000,10000-streak*350),t0=performance.now();busy=false;
      B.innerHTML='<div class="whohd"><span>🔥 Racha: <b>'+streak+'</b></span><span>⏱️ '+Math.round(T/1000)+' s</span></div><div class="wgq '+mode+(inv?' inv':'')+'"><span>'+(mode==="w"?"⚖️":"📏")+'</span>'+(mode==="w"?(inv?'¿Cuál <b>PESA MENOS</b>?':'¿Cuál <b>PESA MÁS</b>?'):(inv?'¿Cuál es <b>MÁS BAJO</b>?':'¿Cuál es <b>MÁS ALTO</b>?'))+'</div><div class="mgtime"><i id="wgT"></i></div><div class="wgvs">'+[a,b].map((p,i)=>'<button class="wgc '+p[2]+'" data-wg="'+i+'"><div class="wgs">'+icoHD(p,150,false,false)+'</div><b>'+esc(p[0])+'</b><span class="wgv" data-v="'+val(p)+'">?</span></button>').join('<span class="wgor">VS</span>')+'</div>';
      const tick=()=>{if(busy)return;const k=1-(performance.now()-t0)/T,bar=$("wgT");if(bar)bar.style.width=Math.max(0,k*100)+"%";if(k<=0){pick(-1);return}MG.raf=requestAnimationFrame(tick)};MG.raf=requestAnimationFrame(tick);
      const pick=i=>{if(busy)return;busy=true;cancelAnimationFrame(MG.raf);const va=val(a),vb=val(b),win=(inv?va<vb:va>vb)?0:1,ok=i===win,left=Math.max(0,1-(performance.now()-t0)/T);
        B.querySelectorAll(".wgc").forEach((c,j)=>{c.disabled=true;c.classList.add(j===win?"ok":"bad");const v=c.querySelector(".wgv"),tv=+v.dataset.v;let s0=performance.now();const an=()=>{const k=Math.min(1,(performance.now()-s0)/600);v.textContent=mode==="w"?kgTxt(tv*k):mTxt(tv*k);if(k<1)requestAnimationFrame(an)};an()});
        if(ok){streak++;const pts=100+Math.round(left*60)+streak*10;mgSet(MG.score+pts);snd("lvl");const c=B.querySelectorAll(".wgc")[i].getBoundingClientRect();mgPop(c.left+c.width/2,c.top+20,"+"+pts,"#ffd35c");a=[a,b][win];mgT(round,1500)}
        else{snd("miss");mgT(()=>end(MG.score),1800)}};
      B.querySelectorAll("[data-wg]").forEach(c=>c.onclick=()=>pick(+c.dataset.wg));
    };
    mgSet(0);round();
  }};

MGS.push(G_RUN,G_EXC,G_WGT);

// ================= TORNEO SEMANAL DE RÉCORDS =================
function isoWeek(d){d=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const n=d.getUTCDay()||7;d.setUTCDate(d.getUTCDate()+4-n);const y=new Date(Date.UTC(d.getUTCFullYear(),0,1));return d.getUTCFullYear()+"-W"+String(Math.ceil(((d-y)/864e5+1)/7)).padStart(2,"0")}
const tourWeek=()=>isoWeek(new Date());
const tourPrevWeek=()=>isoWeek(new Date(Date.now()-7*864e5));
function tourGameOf(w){const n=parseInt(String(w).split("-W")[1],10)+parseInt(w,10)*53;const L=MGS.filter(g=>!g.noTour);return L[n%L.length]}
const tourEndsIn=()=>{const d=new Date(),k=(8-(d.getDay()||7))%7||7,e=new Date(d.getFullYear(),d.getMonth(),d.getDate()+k);return e-d};
// premios del torneo: cada semana tiene su propio legendario, su forma especial y su variocolor de premio
function tourMons(w){let h=0;for(const ch of String(w))h=(h*31+ch.charCodeAt(0))|0;const r=rngSeed(h),pk=a=>a[Math.floor(r()*a.length)];
  return{leg:pk(P.filter(p=>p[2]==="L")),mega:pk(P.filter(p=>p[2]==="M")),shy:pk(P.filter(p=>p[2]==="E"))}}
const TOUR_TIERS=[
 {k:1,ic:"🥇",n:"Campeón",t:10000000,it:{mb:2,cand:3},mon:"leg",sh:0,tit:"👑 Campeón semanal"},
 {k:2,ic:"🥈",n:"Subcampeón",t:5000000,it:{mb:1,cand:2},mon:"mega",sh:0,tit:"🥈 Subcampeón semanal"},
 {k:3,ic:"🥉",n:"Tercer puesto",t:2500000,it:{ub:5,cand:1},mon:"shy",sh:1,tit:"🥉 Podio semanal"},
 {k:10,ic:"🎖️",n:"Top 10",t:1000000,it:{ub:3},hold:1},
 {k:0,ic:"🎟️",n:"Participación",t:150000,it:{sb:5}}];
const tierOf=pos=>pos<0?TOUR_TIERS[4]:pos<3?TOUR_TIERS[pos]:pos<10?TOUR_TIERS[3]:TOUR_TIERS[4];
function tourGive(pos,w){
  const T=tierOf(pos),rw={t:T.t,it:Object.assign({},T.it)},M=tourMons(w);let mon=null,isNew=false;
  if(T.hold){const k=HOLD[Math.floor(Math.random()*HOLD.length)][0];rw.it[k]=(rw.it[k]||0)+1}
  grant(rw);
  if(T.mon){mon=M[T.mon];const lv=clampL(Math.max(10,Math.min(lvCap(),leadLevel())));isNew=giveMon(mon[0],lv,T.sh||Math.random()<.05)}
  if(pos>=0&&pos<10){S.trophies=S.trophies||[];S.trophies.push({w:w,p:pos+1,g:tourGameOf(w).id});if(pos<3)S.crown={w:tourWeek(),p:pos+1}}
  save();render();return{rw:rw,mon:mon,isNew:isNew,T:T};
}
let TR_={w:"",top:null,at:0};
function tourSubmit(id,score){
  const w=tourWeek(),g=tourGameOf(w);if(!g||g.id!==id||score<=0)return "";
  S.tour=S.tour&&S.tour.w===w?S.tour:{w:w,b:0};if(score<=S.tour.b)return '<p class="tourm">🏆 Torneo semanal: tu mejor marca sigue siendo <b>'+fmt(S.tour.b)+'</b>.</p>';
  S.tour.b=score;save();
  if(window.FB&&window.FB.tourSet&&window.FB.uid&&window.FB.uid())window.FB.tourSet(w,{sc:score,cr:myCrown(),n:pvClean(pvNick()).slice(0,30),tr:trEnc(myLook()),g:GS.doc&&GS.doc.tag?String(GS.doc.tag).slice(0,4):"",at:Date.now()}).then(()=>{TR_.at=0}).catch(()=>{});
  return '<p class="tourm">🏆 ¡Nueva mejor marca en el Torneo semanal: <b>'+fmt(score)+'</b>!'+(window.FB?'':' (Inicia sesión para aparecer en la clasificación.)')+'</p>';
}
async function tourLoad(force){
  const w=tourWeek();if(!window.FB||!window.FB.tourTop)return null;if(!force&&TR_.w===w&&TR_.top&&Date.now()-TR_.at<60e3)return TR_.top;
  try{TR_.top=await window.FB.tourTop(w,10);TR_.w=w;TR_.at=Date.now()}catch(e){TR_.top=TR_.top||[]}return TR_.top;
}
async function tourClaim(){
  const pw=tourPrevWeek();if(!window.FB||!window.FB.tourTop||!S.tour||S.tour.w!==pw||!(S.tour.b>0)||S.tourDone===pw)return;
  let top=null;try{top=await window.FB.tourTop(pw,10)}catch(e){return}S.tourDone=pw;const me=window.FB.uid(),i=(top||[]).findIndex(x=>x.id===me);
  const g=tourGiveShow(i,pw);
}
function tourGiveShow(i,pw){
  const r=tourGive(i,pw),T=r.T,big=i>=0&&i<3;snd(big?"lvl":"win");setTimeout(()=>snd("win"),big?500:0);
  const m=nxModal('<div class="tourwin'+(big?' big':'')+'"><div class="tourrays"></div><div class="hofb">'+T.ic+'</div></div><h3>'+(i>=0&&i<10?'¡Has quedado '+(i+1)+'º en el Torneo semanal!':'¡Gracias por participar en el Torneo semanal!')+'</h3><p class="mut">'+esc(tourGameOf(pw).n)+' · semana '+pw.split("-W")[1]+'</p>'+
    (r.mon?'<div class="tourmonw">'+icoHD(r.mon,150,false,!!(S.shiny&&S.shiny[r.mon[0]]&&T.sh))+'<b>'+(T.sh?"✨ ":"")+esc(r.mon[0])+(r.isNew?' <span class="mgnew">¡NUEVO!</span>':'')+'</b><small>¡Se une a tu equipo!</small></div>':'')+
    '<p>Premio: <b>'+rwTxt(r.rw)+'</b></p>'+(T.tit?'<p class="tourtit">Esta semana luces el título <b>'+T.tit+'</b> en el chat y en tu perfil.</p>':'')+'<button id="tourOk">¡Increíble!</button>');
  if(big&&!hubCalm()){const w=m.querySelector(".nxmw");for(let k=0;k<50;k++){const s=document.createElement("span");s.className="mgconf";s.textContent=["🎉","✨","⭐","🏆","🎊"][k%5];s.style.left=Math.random()*100+"%";w.appendChild(s);s.animate([{transform:"translateY(-20px)",opacity:1},{transform:"translateY("+(300+Math.random()*200)+"px) rotate("+(Math.random()*720-360)+"deg)",opacity:0}],{duration:1600+Math.random()*1000,delay:Math.random()*500,easing:"ease-in"}).onfinish=()=>s.remove()}}
  $("tourOk").onclick=nxModalClose;return r;
}
function myCrown(){try{return S.crown&&S.crown.w===tourWeek()?S.crown.p:0}catch(e){return 0}}
setTimeout(()=>{try{tourClaim()}catch(e){}},6000);
function tourHTML(){
  const w=tourWeek(),g=tourGameOf(w),ms=tourEndsIn(),d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),my=S.tour&&S.tour.w===w?S.tour.b:0,me=window.FB&&window.FB.uid?window.FB.uid():null;
  const L=TR_.w===w&&TR_.top?TR_.top:null,M=tourMons(w),myPos=L?L.findIndex(x=>x.id===me):-1;
  const pod=(T,p,cls)=>'<div class="tpod '+cls+'"><div class="tpm">'+icoHD(p,cls==="p1"?120:92,false,!!T.sh)+(T.sh?'<span class="tpsh">✨</span>':'')+'</div><span class="tpic">'+T.ic+'</span><b>'+(T.sh?"✨ ":"")+esc(p[0])+'</b><small>'+fmt(T.t)+' 🎟️ + '+Object.keys(T.it).map(k=>T.it[k]+" "+IN2(k)).join(" + ")+'</small><div class="tpbar"></div></div>';
  const tro=(S.trophies||[]),cnt=k=>tro.filter(x=>k===4?x.p>3:x.p===k).length;
  return '<div class="tourb" style="--mc:'+g.c+'"><div class="tourh"><span class="tourc">🏆</span><div><small>TORNEO SEMANAL · termina en '+(d?d+" d ":"")+h+' h</small><b>'+g.ic+' '+g.n+'</b><small>¡Consigue la mejor puntuación de la semana y gana Pokémon exclusivos!</small></div><button class="tourgo" data-mgo="'+g.id+'">▶ Jugar</button></div>'+
    '<div class="tpods">'+pod(TOUR_TIERS[1],M.mega,"p2")+pod(TOUR_TIERS[0],M.leg,"p1")+pod(TOUR_TIERS[2],M.shy,"p3")+'</div>'+
    '<div class="tourx"><span>🎖️ <b>Top 10:</b> 1.000.000 🎟️ + 3 Ultra Ball + objeto equipable</span><span>🎟️ <b>Por participar:</b> 150.000 🎟️ + 5 Super Ball</span><span>👑 Los 3 primeros lucen un <b>título</b> en el chat y en su perfil toda la semana siguiente</span></div>'+
    '<div class="tourl">'+(!window.FB?'<small>Inicia sesión para competir en la clasificación.</small>':!L?'<small>Cargando clasificación…</small>':L.length?L.map((x,i)=>'<div class="tourr'+(x.id===me?' me':'')+(i<3?' top':'')+'"><span class="tourp">'+(["🥇","🥈","🥉"][i]||(i+1)+"º")+'</span><span class="chav">'+chAv(x.tr)+'</span><b class="plink" data-prof="'+esc(x.id)+'">'+(x.cr?["👑","🥈","🥉"][x.cr-1]+" ":"")+esc(pvClean(x.n||"Entrenador"))+'</b>'+(x.g?' <span class="gtag">'+esc(String(x.g).slice(0,4))+'</span>':'')+'<span class="tours">'+fmt(x.sc|0)+'</span></div>').join(""):'<small>Nadie ha jugado todavía esta semana. ¡Sé el primero y llévate el legendario!</small>')+
    '<div class="tourmy">Tu mejor marca esta semana: <b>'+fmt(my)+'</b>'+(myPos>=0?' · vas <b>'+(myPos+1)+'º</b>'+(myPos<3?' 🔥':''):my?' · fuera del top 10, ¡sigue intentándolo!':'')+(tro.length?'<span class="tourvit">Tu vitrina: 🥇×'+cnt(1)+' 🥈×'+cnt(2)+' 🥉×'+cnt(3)+' 🎖️×'+cnt(4)+'</span>':'')+'</div></div></div>';
}
// ================= DUELO DE SILUETAS EN DIRECTO =================
const DU_R=8,DU_T=7000,DU_GAP=2600,DU_STEP=DU_T+DU_GAP;
var DU={inv:[],cur:null,unsub:null,seen:{}};
function rngSeed(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function duRounds(seed){const r=rngSeed(seed),pool=P.filter(p=>p[2]!=="M"),out=[];for(let i=0;i<DU_R;i++){const ans=pool[Math.floor(r()*pool.length)],o=[ans];while(o.length<4){const x=pool[Math.floor(r()*pool.length)];if(!o.includes(x))o.push(x)}for(let k=o.length-1;k>0;k--){const j=Math.floor(r()*(k+1));[o[k],o[j]]=[o[j],o[k]]}out.push({a:ans[0],o:o.map(x=>x[0])})}return out}
function duInit(){if(DU.on||!window.FB||!window.FB.duInbox||!window.FB.uid||!window.FB.uid())return;DU.on=1;
  try{window.FB.duInbox(l=>{const now=Date.now();DU.inv=l.filter(d=>d.st==="inv"&&now-(d.at||0)<120e3);DU.inv.forEach(d=>{if(!DU.seen[d.id]){DU.seen[d.id]=1;duAsk(d)}});try{if(nxOpen("mgP"))mgUI()}catch(e){}})}catch(e){DU.on=0}}
setInterval(duInit,3000);
function duAsk(d){if(DU.cur){return}snd("open");const m=nxModal('<div class="hofb">⚔️</div><h3>¡'+esc(pvClean(d.an||"Un amigo"))+' te reta a un Duelo de siluetas!</h3><p class="mut">'+DU_R+' rondas de «¿Quién es ese Pokémon?» en directo. Gana quien acierte antes.</p><div class="mgbtns"><button class="red" id="duY">⚔️ Aceptar</button><button class="alt" id="duN">Ahora no</button></div>');
  $("duY").onclick=()=>{nxModalClose();duAccept(d)};$("duN").onclick=()=>{nxModalClose();window.FB.duUpd(d.id,{st:"no"}).catch(()=>{})}}
async function duChallenge(u,name){
  if(!window.FB||!window.FB.duCreate)return;if(DU.cur){toast("Ya estás en un duelo.");return}const me=window.FB.uid(),id=me+"_"+u+"_"+Date.now();
  const d={a:me,b:u,an:pvClean(pvNick()).slice(0,30),bn:String(name||"").slice(0,30),st:"inv",seed:Math.floor(Math.random()*2e9),at:Date.now(),ans:{}};
  try{await window.FB.duCreate(id,d)}catch(e){toast("No se ha podido enviar el reto.");return}
  toast("⚔️ Reto enviado a "+(name||"tu amigo")+". Esperando a que acepte…");duWatch(id,true);
}
async function duAccept(d){if(DU.cur)return;try{await window.FB.duUpd(d.id,{st:"go",go:Date.now()+5000})}catch(e){toast("No se ha podido aceptar el reto.");return}duWatch(d.id,false)}
function duWatch(id,mine){
  if(DU.unsub)try{DU.unsub()}catch(e){}DU.cur={id:id,mine:mine,d:null,started:false};
  const exp=setTimeout(()=>{if(DU.cur&&DU.cur.id===id&&!DU.cur.started){toast("⌛ Tu amigo no ha aceptado el reto a tiempo.");if(mine)window.FB.duDel(id).catch(()=>{});duQuit()}},90e3);
  DU.unsub=window.FB.duWatch(id,d=>{if(!DU.cur||DU.cur.id!==id||!d)return;DU.cur.d=d;
    if(d.st==="no"){toast("Tu amigo ha rechazado el duelo.");clearTimeout(exp);if(mine)window.FB.duDel(id).catch(()=>{});duQuit();return}
    if(d.st==="go"&&!DU.cur.started){DU.cur.started=true;clearTimeout(exp);duStart()}else if(DU.cur.started)duPaint()});
}
function duQuit(){if(DU.unsub)try{DU.unsub()}catch(e){}DU.unsub=null;DU.cur=null}
function duStart(){
  const c=DU.cur,d=c.d,me=window.FB.uid(),rounds=duRounds(d.seed),opp=me===d.a?d.bn:d.an;c.rounds=rounds;c.me=me;c.opp=me===d.a?d.b:d.a;
  mgStop();MG.g={id:"duel",n:"Duelo de siluetas",ic:"⚔️",c:"#c42a5e"};hubClose();
  let m=$("mgM");if(!m){m=document.createElement("div");m.id="mgM";m.setAttribute("role","dialog");document.body.appendChild(m)}m.style.setProperty("--mc","#c42a5e");
  m.innerHTML='<div class="mgw"><div class="mgh"><span class="mgic">⚔️</span><b>Duelo de siluetas</b><span class="mgsc" id="duSc">0 – 0</span><button class="mgx" aria-label="Abandonar">✕</button></div><div class="mgb" id="mgB"></div></div>';m.hidden=false;
  m.querySelector(".mgx").onclick=()=>{duQuit();mgClose()};
  c.names=[pvClean(pvNick()),pvClean(opp||"Rival")];c.r=-1;c.picked={};
  const loop=()=>{if(!DU.cur||DU.cur!==c)return;const t=Date.now()-d.go;
    if(t<0){$("mgB").innerHTML='<div class="mgintro"><div class="mgbig">⚔️</div><h3>'+esc(c.names[0])+' vs '+esc(c.names[1])+'</h3><div class="mgfinal">'+Math.ceil(-t/1000)+'<small>¡Preparados!</small></div></div>';MG.raf=requestAnimationFrame(loop);return}
    const r=Math.floor(t/DU_STEP);if(r>=DU_R){duEnd();return}
    if(r!==c.r){c.r=r;duRound()}
    const k=t-r*DU_STEP,bar=$("duT");if(bar)bar.style.width=Math.max(0,(1-k/DU_T)*100)+"%";
    if(k>=DU_T&&!c.rev){c.rev=1;duPaint()}
    MG.raf=requestAnimationFrame(loop)};
  MG.raf=requestAnimationFrame(loop);
}
function duRound(){const c=DU.cur,q=c.rounds[c.r],ans=PM[q.a];c.rev=0;
  $("mgB").innerHTML='<div class="whohd"><span>Ronda <b>'+(c.r+1)+'</b>/'+DU_R+'</span><span id="duSt"></span></div><div class="whobg"><div class="whosil">'+icoHD(ans,190,false,false)+'</div><div class="whoq">¿Quién es ese Pokémon?</div></div><div class="mgtime"><i id="duT"></i></div><div class="whoopt">'+q.o.map(o=>'<button data-du="'+esc(o)+'">'+esc(o)+'</button>').join("")+'</div>';
  $("mgB").querySelectorAll("[data-du]").forEach(b=>b.onclick=()=>{if(c.picked[c.r]!=null||c.rev)return;const t=Date.now()-c.d.go-c.r*DU_STEP;c.picked[c.r]=b.dataset.du;b.classList.add("sel");$("mgB").querySelectorAll("[data-du]").forEach(x=>x.disabled=true);snd("click");
    window.FB.duUpd(c.id,{["ans.r"+c.r+"_"+c.me]:{c:b.dataset.du,t:Math.round(t)}}).catch(()=>{})});
  duPaint()}
function duScore(){const c=DU.cur,A=(c.d&&c.d.ans)||{},s=[0,0],now=Date.now()-c.d.go;
  for(let r=0;r<DU_R;r++){if(r>c.r||(r===c.r&&now-r*DU_STEP<DU_T))break;const q=c.rounds[r],x=A["r"+r+"_"+c.me],y=A["r"+r+"_"+c.opp],xo=x&&x.c===q.a,yo=y&&y.c===q.a;if(xo&&(!yo||x.t<=y.t))s[0]++;else if(yo)s[1]++}return s}
function duPaint(){const c=DU.cur;if(!c||!c.rounds)return;const s=duScore(),sc=$("duSc");if(sc)sc.textContent=s[0]+" – "+s[1];
  const A=c.d.ans||{},y=A["r"+c.r+"_"+c.opp],st=$("duSt");if(st)st.textContent=y?"⚡ "+c.names[1]+" ya ha contestado":"";
  if(c.rev){const q=c.rounds[c.r],x=A["r"+c.r+"_"+c.me];$("mgB").querySelectorAll("[data-du]").forEach(b=>{b.disabled=true;if(b.dataset.du===q.a)b.classList.add("ok");else if(x&&b.dataset.du===x.c)b.classList.add("bad")});
    const sil=$("mgB").querySelector(".whosil");if(sil&&!sil.classList.contains("rev")){sil.classList.add("rev");const xo=x&&x.c===q.a,yo=y&&y.c===q.a,won=xo&&(!yo||x.t<=y.t);$("mgB").querySelector(".whoq").innerHTML=(won?"🟢 ¡Punto para ti! ":yo?"🔴 Punto para "+esc(c.names[1])+" · ":"Nadie acierta · ")+"Era <b>"+esc(q.a)+"</b>";snd(won?"lvl":"miss")}}}
function duEnd(){const c=DU.cur;if(!c)return;const s=duScore(),win=s[0]>s[1],tie=s[0]===s[1];cancelAnimationFrame(MG.raf);
  const st=mgState();st.n.duel=st.n.duel|0;let rw=null;if(st.n.duel<5){st.n.duel++;rw={t:win?250000:tie?100000:40000,it:win?{ub:1}:{}};grant(rw)}
  S.duW=(S.duW|0)+(win?1:0);qEv("mg");save();render();if(win){snd("win");mgConfetti()}else snd(tie?"ui":"lose");
  $("mgB").innerHTML='<div class="mgintro"><div class="mgbig">'+(win?"🏆":tie?"🤝":"😤")+'</div><h3>'+(win?"¡Has ganado el duelo!":tie?"¡Empate!":"Ha ganado "+esc(c.names[1]))+'</h3><div class="mgfinal">'+s[0]+' – '+s[1]+'<small>'+esc(c.names[0])+' vs '+esc(c.names[1])+'</small></div>'+(rw?'<p>Premio: <b>'+rwTxt(rw)+'</b></p>':'<p class="mut">Hoy ya has cobrado los 5 premios de duelos.</p>')+'<div class="mgbtns"><button class="red" id="duAg">⚔️ Revancha</button><button class="alt" id="duBk">Cerrar</button></div></div>';
  const opp=c.opp,on=c.names[1],did=c.id,mine=c.mine;duQuit();if(mine)setTimeout(()=>window.FB.duDel(did).catch(()=>{}),15000);$("duAg").onclick=()=>{mgClose();duChallenge(opp,on)};$("duBk").onclick=mgClose}
function duelHTML(){
  const ids=Object.keys(FR.l||{}),on={};try{pvOthers().forEach(p=>{on[p.peer]=1})}catch(e){}
  if(!window.FB)return '<div class="duelb"><b>⚔️ Duelo de siluetas en directo</b><small class="mut">Inicia sesión para retar a tus amigos.</small></div>';
  return '<div class="duelb"><div class="duelh"><span>⚔️</span><div><b>Duelo de siluetas en directo</b><small>Reta a un amigo: '+DU_R+' rondas de «¿Quién es ese Pokémon?» a la vez. ¡Gana quien acierte antes! (5 premios al día)</small></div></div>'+
    (DU.inv.length?'<div class="duinv">'+DU.inv.map(d=>'<div class="pvrow"><b>📨 '+esc(pvClean(d.an||"Amigo"))+' te ha retado</b><span style="flex:1"></span><button class="red mini" data-duy="'+esc(d.id)+'">Aceptar</button></div>').join("")+'</div>':'')+
    (ids.length?'<div class="dufl">'+ids.sort((a,b)=>(on[b]?1:0)-(on[a]?1:0)).map(u=>'<div class="pvrow"><span>'+(on[u]?'🟢':'⚫')+'</span><b>'+esc(pvClean(FR.l[u].n||"Amigo"))+'</b><span style="flex:1"></span><button class="mini" data-duc="'+esc(u)+'" data-dun="'+esc(pvClean(FR.l[u].n||""))+'"'+(on[u]?'':' title="No está conectado: verá el reto si entra en menos de 2 minutos"')+'>⚔️ Retar</button></div>').join("")+'</div>':'<small class="mut">Añade amigos en Social → Amigos para poder retarles.</small>')+'</div>';
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-duc],[data-duy]");if(!b)return;
  if(b.dataset.duc)duChallenge(b.dataset.duc,b.dataset.dun);else{const d=DU.inv.find(x=>x.id===b.dataset.duy);if(d)duAccept(d)}});

// ---- panel de minijuegos con torneo y duelos ----
{const _u=mgUI;mgUI=function(){_u();const box=$("mgPB");if(!box)return;box.insertAdjacentHTML("afterbegin",tourHTML());box.insertAdjacentHTML("beforeend",duelHTML());
  if(window.FB&&(!TR_.top||TR_.w!==tourWeek()||Date.now()-TR_.at>60e3))tourLoad().then(()=>{if(nxOpen("mgP")){const t=box.querySelector(".tourb");if(t)t.outerHTML=tourHTML()}})}}

// ---- título del podio en el chat y en el perfil ----
{const _rd=window.rankData;if(_rd)window.rankData=function(){const d=_rd();if(!d)return d;const c=myCrown();if(c)d.cr=c;else delete d.cr;const t=S.trophies||[];if(t.length)d.tro=[1,2,3].map(k=>t.filter(x=>x.p===k).length).concat([t.filter(x=>x.p>3).length]);return d}}
