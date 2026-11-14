// =====================================================================================
// PUEBLO EN 3D Y VENTANA DE MEJORAS
// Los edificios de las mejoras se dibujan dentro del paisaje 3D (p_land3d.js). Aquí van sus carteles (nombre, nivel o
// precio), que se pueden tocar, los tickets que sueltan, el desplazamiento a los lados en pantallas estrechas y la
// ventana «Mejoras», con todas las mejoras a mano. Sin WebGL sigue el pueblo de siempre.
// =====================================================================================
const T3={layer:null,last:"",drag:null,moved:false,tiers:[]};
function town3Layer(){if(T3.layer&&T3.layer.isConnected)return T3.layer;const f=document.getElementById("farm");if(!f)return null;
  const L=document.createElement("div");L.id="gTown3";L.className="gmo";
  L.innerHTML='<div class="g3band"></div>'+G.map((g,i)=>'<button class="gb3" data-gb="'+i+'" type="button"><span class="gb3l"><b></b><em></em></span></button>').join("");
  f.appendChild(L);T3.layer=L;
  // arrastrar a los lados mueve la vista del pueblo (pantallas estrechas)
  const band=L.querySelector(".g3band");
  const down=e=>{if(!window.LAND3I||!LAND3I.panMax())return;T3.drag={x:e.clientX,p:LAND3I.panT};T3.moved=false};
  const move=e=>{if(!T3.drag)return;const dx=e.clientX-T3.drag.x;if(Math.abs(dx)>8)T3.moved=true;if(T3.moved){const m=LAND3I.panMax(),k=58/(innerWidth*.5)*(LAND3I.asp<1?.6:1.4);LAND3I.panT=Math.max(-m,Math.min(m,T3.drag.p+dx*k))}};
  const up=()=>{T3.drag=null;setTimeout(()=>{T3.moved=false},0)};
  [band,L].forEach(el=>el.addEventListener("pointerdown",down));addEventListener("pointermove",move);addEventListener("pointerup",up);addEventListener("pointercancel",up);
  L.addEventListener("click",e=>{if(T3.moved){e.stopPropagation();e.preventDefault()}},true);
  // flechas: mueven la vista un edificio
  const step=d=>{if(!window.LAND3I)return;const m=LAND3I.panMax();LAND3I.panT=Math.max(-m,Math.min(m,LAND3I.panT-d*11.5));snd("ui")};
  const tl=document.getElementById("gTL"),tr=document.getElementById("gTR");if(tl)tl.onclick=()=>step(-1);if(tr)tr.onclick=()=>step(1);
  return L}
// cada fotograma del paisaje: coloca los carteles sobre los edificios
function town3Frame(L3){const L=town3Layer();if(!L)return;const R=L3.rects();if(!R)return;const fr=document.getElementById("farm").getBoundingClientRect();
  L.querySelectorAll(".gb3").forEach((b,i)=>{const r=R[i];if(!r)return;const n=S.g[i]||0,t=typeof gbTier==="function"?gbTier(n):0;
    const st="left:"+Math.round(r.x-fr.left)+"px;top:"+Math.round(r.y-fr.top)+"px;width:"+Math.round(r.w)+"px;height:"+Math.round(r.h)+"px";if(b._st!==st){b.style.cssText=st;b._st=st}
    const nm=GBS[i]||G[i][0],sub=t?'<i>'+"★".repeat(t)+'</i> Nv '+fmt(n):'🔒 '+gmK(gc(i)),key=nm+sub;if(b._k!==key){b._k=key;b.querySelector("b").textContent=nm;b.querySelector("em").innerHTML=sub;b.classList.toggle("lock",!t);b.title=nm}
    if(T3.tiers.length&&t>(T3.tiers[i]||0)){b.classList.remove("g3new");void b.offsetWidth;b.classList.add("g3new")}T3.tiers[i]=t});
  // flechas solo si el pueblo no cabe entero
  const m=L3.panMax(),f=document.getElementById("farm");f.classList.toggle("g3l",m>0&&L3.panT<m-.5);f.classList.toggle("g3r",m>0&&L3.panT>-m+.5);
  if(L3.panT>m)L3.panT=m;if(L3.panT<-m)L3.panT=-m}
// ---------- ventana «Mejoras» ----------
function upgOpen(focus){let M=document.getElementById("upgM");if(M)M.remove();M=document.createElement("div");M.id="upgM";M.className="gmo";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");
  M.innerHTML='<div class="upgw"><div class="upgh"><span class="upgi">'+gI("build",30)+'</span><div class="upgt"><b>Mejoras</b><small>Edificios que producen tickets solos y guantes para tus toques</small></div><button class="upgx" aria-label="Cerrar">✕</button></div>'+
    '<div class="upgq"><small>Comprar:</small>'+["1","10","50","max"].map(v=>'<button type="button" data-uq="'+v+'">'+(v==="max"?"Máx":"×"+v)+'</button>').join("")+'<span class="upgtot"></span></div><div class="upgl"></div></div>';
  document.body.appendChild(M);snd("ui");
  const close=()=>{clearInterval(M._iv);M.remove();document.removeEventListener("keydown",esc2,true)},esc2=e=>{if(e.key==="Escape"){e.stopPropagation();close()}};document.addEventListener("keydown",esc2,true);
  M.addEventListener("click",e=>{if(e.target===M||e.target.closest(".upgx")){close();return}
    const q=e.target.closest("[data-uq]");if(q){SHQ=q.dataset.uq;try{localStorage.setItem("pg_shq",SHQ)}catch(x){}snd("ui");upgDraw();return}
    const b=e.target.closest("[data-ub]");if(b&&!b.disabled){const i=+b.dataset.ub,before=i<0?(S.cl|0):(S.g[i]|0);shopBuy(i);const after=i<0?(S.cl|0):(S.g[i]|0);if(after>before){snd("capok");const c=b.closest(".upgc");c.classList.remove("upgok");void c.offsetWidth;c.classList.add("upgok")}else snd("miss");upgDraw();try{updShop()}catch(x){}}});
  upgDraw();M._iv=setInterval(()=>{if(!M.isConnected){clearInterval(M._iv);return}upgDraw()},500);
  M.querySelector(".upgw").animate([{transform:"scale(.9)",opacity:0},{transform:"none",opacity:1}],{duration:220,easing:"cubic-bezier(.2,.9,.3,1.2)"});
  if(focus!=null)setTimeout(()=>{const c=M.querySelector('[data-uc="'+focus+'"]');if(c){c.scrollIntoView({block:"center",behavior:"smooth"});c.classList.add("upgf")}},60)}
function upgDraw(){const M=document.getElementById("upgM");if(!M)return;const box=M.querySelector(".upgl");
  M.querySelectorAll("[data-uq]").forEach(b=>b.classList.toggle("on",b.dataset.uq===SHQ));
  let tot=0;G.forEach((g,i)=>{tot+=g[2]*(S.g[i]||0)});M.querySelector(".upgtot").innerHTML="Producción: <b>"+gmK(tot*PMUL())+"</b> "+gI("ticket",16)+"/s";
  const card=(i,ic,name,desc,lv,stars,prod,full)=>{const[n,c]=shopN(i),can=!full&&n>0&&S.t>=c;
    return '<div class="upgc'+(lv?'':' lock')+'" data-uc="'+i+'"><span class="upgic">'+ic+'</span><div class="upgm"><b>'+esc(name)+'</b><small>'+desc+'</small><span class="upgs">'+(stars?'<i>'+"★".repeat(stars)+'</i>':'')+'Nv <b>'+fmt(lv)+'</b>'+(prod?' · '+prod:'')+'</span></div>'+
      '<button type="button" class="upgb" data-ub="'+i+'"'+(can?'':' disabled')+'>'+(full?'Nivel máximo':'<span>Mejorar'+(n>1?' ×'+fmt(n):'')+'</span><small>'+gI("ticket",14)+' '+gmK(c)+'</small>')+'</button></div>'};
  const gl=S.cl|0;let h=card(-1,"🥊","Guantes de entrenador","Cada nivel duplica los tickets por toque",gl,0,"",gl>=GLMAX);
  G.forEach((g,i)=>{const n=S.g[i]||0,t=gbTier(n);h+=card(i,GI[i]||"🏠",GBS[i]||g[0],"+"+gmK(g[2]*PMUL())+" 🎟️/s por nivel",n,t,n?"+"+gmK(g[2]*n*PMUL())+" 🎟️/s":"")});
  // solo se rehace si algo cambia (así no parpadea ni pierde el foco)
  if(box._h!==h){const y=box.scrollTop;box.innerHTML=h;box._h=h;box.scrollTop=y}}
