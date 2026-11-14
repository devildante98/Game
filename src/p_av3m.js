// =====================================================================================
// ENTRENADOR 3D CON PIEZAS MODELADAS EN BLENDER
// El cuerpo (con manos y dedos), la ropa de arriba, la de abajo y el calzado son mallas hechas en Blender
// (models/*.glb, generadas por src/tools/blender/build_trainer.py). Cada pieza se descarga la primera vez que hace
// falta; hasta que llegan (o si no se pueden cargar) se dibuja el modelo de siempre. La cara —ojos, cejas, boca— se
// pinta pegada al relieve de la cabeza, y el pelo, los gorros y los complementos se acoplan encima.
// Las figuras pequeñas del mapa siguen saliendo del modelo de siempre: a ese tamaño no se nota y no descarga nada.
// =====================================================================================
const AV3M={meta:null,st:{},pc:{},q:[],busy:0,base:"models/",ver:"7",t:0};   // «ver» cambia cuando se regeneran las piezas, para que no se use una copia vieja
function av3mParse(buf){const dv=new DataView(buf);let off=12,json=null,bin=null;
  while(off<dv.byteLength){const len=dv.getUint32(off,true),type=dv.getUint32(off+4,true),ch=buf.slice(off+8,off+8+len);if(type===0x4E4F534A)json=JSON.parse(new TextDecoder().decode(ch));else bin=ch;off+=8+len}
  const acc=i=>{const a=json.accessors[i],bv=json.bufferViews[a.bufferView],o=(bv.byteOffset||0)+(a.byteOffset||0),n=a.count*{SCALAR:1,VEC3:3}[a.type];
    return a.componentType===5126?new Float32Array(bin.slice(o,o+n*4)):a.componentType===5125?new Uint32Array(bin.slice(o,o+n*4)):a.componentType===5123?new Uint16Array(bin.slice(o,o+n*2)):new Uint8Array(bin.slice(o,o+n))};
  const parts=[];let fz=-9,bz=9,fs=-9;
  json.nodes.forEach(nd=>{if(nd.mesh==null)return;const q=nd.name.split(".");json.meshes[nd.mesh].primitives.forEach(pr=>{const P=acc(pr.attributes.POSITION),I=acc(pr.indices),N=new Float32Array(P.length);
      // normales suaves: suma de las normales de las caras que tocan cada vértice
      for(let k=0;k<I.length;k+=3){const a=I[k]*3,b=I[k+1]*3,c=I[k+2]*3,ux=P[b]-P[a],uy=P[b+1]-P[a+1],uz=P[b+2]-P[a+2],vx=P[c]-P[a],vy=P[c+1]-P[a+1],vz=P[c+2]-P[a+2],nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;for(const j of[a,b,c]){N[j]+=nx;N[j+1]+=ny;N[j+2]+=nz}}
      for(let k=0;k<N.length;k+=3){const l=Math.hypot(N[k],N[k+1],N[k+2])||1;N[k]/=l;N[k+1]/=l;N[k+2]/=l}
      if(q[0]==="body")for(let k=0;k<P.length;k+=3)if(Math.abs(P[k])<.04&&P[k+1]>1.12&&P[k+1]<1.28){if(P[k+2]>fz)fz=P[k+2];if(P[k+2]<bz)bz=P[k+2]}
      if(q[0]==="body")for(let k=0;k<P.length;k+=3){const ax=Math.abs(P[k]);if(ax>.08&&ax<.13&&P[k+1]>1.1&&P[k+1]<1.3&&P[k+2]>fs)fs=P[k+2]}
      let ymin=9;for(let k=1;k<P.length;k+=3)if(P[k]<ymin)ymin=P[k];parts.push({seg:q[0],slot:q[1],name:q[2],tag:q[3]||"",P,N,I,ymin})})});
  parts.fz=fz>-9?fz:.11;parts.fs=fs>-9?fs:.1;parts.bz=bz<9?bz:-.125;return parts}
function av3mPump(){while(AV3M.busy<3&&AV3M.q.length){const n=AV3M.q.shift();AV3M.busy++;
    fetch(AV3M.base+n+(n==="tr_meta"?".json":".glb")+"?v="+AV3M.ver).then(r=>{if(!r.ok)throw 0;return n==="tr_meta"?r.json():r.arrayBuffer()}).then(d=>{if(n==="tr_meta")AV3M.meta=d;else AV3M.pc[n]=av3mParse(d);AV3M.st[n]=2;av3mFresh()})
      .catch(()=>{AV3M.st[n]=3}).then(()=>{AV3M.busy--;av3mPump()})}}
// cuando llega una pieza, lo que se dibujó con el modelo de siempre se vuelve a dibujar
function av3mFresh(){clearTimeout(AV3M.t);AV3M.t=setTimeout(()=>{try{AV3S.url={};AV3S.n=0;for(const k in AV3V)if(AV3V[k])AV3V[k].sig=null;if(typeof GM!=="undefined"&&GM){GM.look=null;GM.town="";dispatchEvent(new Event("resize"))}if(document.getElementById("trPrev")&&typeof trUI==="function"&&!document.getElementById("av3Big"))trUI()}catch(e){}},150)}
// ¿hay alguna pieza de este aspecto todavía descargándose?
function av3mWait(L){if(av3mReady(L))return false;return av3mNeed(L).every(n=>AV3M.st[n]===1||AV3M.st[n]===2)}
function av3mGet(n){const s=AV3M.st[n];if(s===2)return true;if(!s){AV3M.st[n]=1;AV3M.q.push(n);av3mPump()}return false}
// piezas que necesita un aspecto: datos, cabeza (según la forma de la cara), cuerpo, parte de arriba, calzado y parte de abajo
// peinados sin pieza: rapado y calvo (van pintados sobre la cabeza)
const AV3M_NOHAIR=[5,22];
// gorros con pieza (las gafas de sol y de aviador se dibujan como gafas)
const av3mHat=L=>L.hat>0&&L.hat!==7&&L.hat!==13;
function av3mNeed(L){return["tr_meta","head"+(L.fs===1||L.fs===2?L.fs:0)].concat(AV3M_NOHAIR.includes(L.hs)?[]:["hair"+L.hs]).concat(av3mHat(L)?["hat"+L.hat]:[]).concat([L.b===1?"base_f":"base_m","top"+L.top,"shoe"+L.shs]).concat([4,23,26].includes(L.top)?[]:["bot"+L.bot])}
function av3mReady(L){if(typeof fetch!=="function")return false;let ok=true;for(const n of av3mNeed(L))if(!av3mGet(n))ok=false;return ok}
// ---------- el modelo ----------
function av3mModel(E,L,o){const P=(k,i)=>av3Hex(TRP[k][i]!=null?TRP[k][i]:TRP[k][0]),W=[1,1,1],K=[.1,.09,.12],dk=(c,k)=>av3Mix(c,[0,0,0],k==null?.25:k),lt=(c,k)=>av3Mix(c,W,k==null?.25:k),I=m4I();
  const sk=P("skin",L.sk),hc=P("hair",L.hc),ec=P("eye",L.ec),tc=P("cl",L.tc),ac=P("cl",L.ac),bc=P("cl",L.bc),shc=P("cl",L.sh),hac=P("cl",L.hac),bpc=P("cl",L.bpc),nkc=P("cl",L.nkc),glc=P("cl",L.glc),pcc=P("cl",L.pc),sckc=P("cl",L.sckc),wrc=P("cl",L.wrc);
  const meta=AV3M.meta,t=o.t||0,pose=o.pose||"i",girl=L.b===1,top=L.top,dress=[4,23,26].includes(top),mt=meta.pieces["top"+top],mb=dress?{hide:[]}:meta.pieces["bot"+L.bot],ms=meta.pieces["shoe"+L.shs],TP=AV3M.pc["top"+top];
  const hide={};mt.hide.concat(mb.hide).forEach(k=>hide[k]=1);const showTorso=(mt.show||[]).includes("torso"),open=[1,3,8,11,12,15,19,20,25,27,18,16].includes(top);
  const COL={skin:sk,top:tc,topd:dk(tc,.2),topl:lt(tc,.86),inner:top===12||top===8?lt(ac,.1):ac,bot:bc,botd:dk(bc,.25),botl:lt(bc,.22),shoe:shc,shoed:dk(shc,.5),sole:[.96,.96,.98],white:[.97,.97,.99]};
  // ----- articulaciones: cada segmento gira alrededor de la suya -----
  const G=girl?new Float32Array([.93,0,0,0,0,1,0,0,0,0,.95,0,0,0,0,1]):I,pv=meta.piv,J=k=>{const a=pv[k];return[a[0],a[2],-a[1]]},mir=p=>[-p[0],p[1],p[2]];
  const rot=(B,p,rx,rz)=>m4T(m4RX(m4RZ(m4T(B,p[0],p[1],p[2]),rz||0),rx||0),-p[0],-p[1],-p[2]);
  const AP={t:[1.0,-1.6,.3],m:[-2.6,-.3,.2],u:[-1.5,-.15,.1],f:[-.7,-.4,.05],w:[-2.6,-.5,.25]}[pose],sway=Math.sin(t*1.6)*.02,MS={body:G,legL:G,legR:G};
  MS.armL1=rot(G,J("shL"),sway,pose==="w"?.35:0);MS.armL2=rot(MS.armL1,J("elL"),pose==="w"?-.5:0,0);
  MS.armR1=rot(G,mir(J("shL")),AP?AP[0]:-sway,AP?-AP[2]:0);MS.armR2=rot(MS.armR1,mir(J("elL")),AP?AP[1]:0,0);
  const hcy=pv.head[2],hr=pv.hr,MH=rot(I,[0,1.42,0],Math.sin(t*.9)*.012+(pose==="l"?.34:0),0);
  // ----- piezas -----
  const stripes=top===14||L.pat===1,sc2=top===14?ac:pcc,tights=L.sck===3?av3Mix(sk,sckc,.8):null;
  // pelo rapado y barba van pintados sobre la propia cabeza (siguen su forma exacta)
  const thinH=[5,10,27].includes(L.hs)?av3Mix(sk,hc,.6):null,beardC=L.brd===1?av3Mix(sk,hc,.3):L.brd===4||L.brd===6?hc:null;
  const headCf=thinH||beardC?(y,x,z)=>{const v=(y-hcy)/hr[2],u=Math.abs(x/hr[0]),w=z/hr[1];if(beardC&&v<-.44&&w>-.02&&!(u<.27&&v>-.8))return beardC;if(thinH&&v>(w>0?-.36+w:-.36+w*.55))return thinH;return sk}:null;
  const put=(parts,isBase)=>{for(const p of parts){let c=COL[p.slot]||[1,0,1],cf=null;if(p.name==="head"&&headCf)cf=headCf;
      if(isBase&&p.tag){if(p.tag==="torso"&&!showTorso)continue;if(hide[p.tag])continue;if(p.tag==="foot"&&!ms.foot)continue;
        if(p.tag==="palm"&&[1,2,4].includes(L.glv))c=glc;else if(p.tag==="finger"&&[2,4].includes(L.glv))c=glc;else if(p.tag==="farm"&&L.glv===4)c=glc;else if(tights&&(p.tag==="thigh"||p.tag==="shin"||p.tag==="foot"))c=tights}
      if(stripes&&p.slot==="top"&&(p.seg==="body"||p.name.indexOf("sleeve")===0))cf=y=>Math.floor((y-.9)/.055)%2?sc2:tc;
      E.mesh(p.seg==="head"?MH:MS[p.seg]||G,p.P,p.N,p.I,c,cf)}};
  const fsn=L.fs===1||L.fs===2?L.fs:0;put(AV3M.pc["head"+fsn]);put(AV3M.pc[girl?"base_f":"base_m"],true);put(TP);if(!dress)put(AV3M.pc["bot"+L.bot]);put(AV3M.pc["shoe"+L.shs]);
  // ----- cara -----
  const fg=meta.faces[fsn],zAt=(x,y)=>{const gx=(x-fg.x0)/fg.d,gy=(y-fg.y0)/fg.d,ix=Math.max(0,Math.min(fg.g[0].length-2,Math.floor(gx))),iy=Math.max(0,Math.min(fg.g.length-2,Math.floor(gy))),fx=Math.max(0,Math.min(1,gx-ix)),fy=Math.max(0,Math.min(1,gy-iy)),v=(a,b)=>fg.g[b][a]==null?.02:fg.g[b][a];
      return(v(ix,iy)*(1-fx)+v(ix+1,iy)*fx)*(1-fy)+(v(ix,iy+1)*(1-fx)+v(ix+1,iy+1)*fx)*fy};
  av3mFace(E,L,{MH,zAt,hcy,hr,sk,hc,ec,t,P,dk,lt,K,W});
  // ----- pelo y gorro (formas de siempre, acopladas a la cabeza nueva) -----
  const k0=hr[0]/.114,HM=m4S(m4T(MH,0,hcy,0),k0),hk=typeof chHatKind==="function"?chHatKind(L.hat):"",hatP=av3mHat(L)?AV3M.pc["hat"+L.hat]:null,hatOn=hatP?!!(meta.pieces["hat"+L.hat]||{}).cover:["cap","beanie","wide","top","hard"].includes(hk),hx=.114,hy=.128,hz=.118;
  // pelo modelado: con gorro se ocultan las partes de arriba («top») y salen las versiones bajas («hat»)
  const HP=AV3M_NOHAIR.includes(L.hs)?null:AV3M.pc["hair"+L.hs];
  const wxF=({1:.95,2:.99})[fsn]||1,MHh=m4T(m4Mul(m4T(MH,0,hcy,0),new Float32Array([wxF,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])),0,-hcy,0);
  if(HP){const mcc=P("hair",L.mcc),mch=L.mch|0;
    const HCOL={hair:hc,haird:dk(hc,.24),hairl:lt(hc,.16),tie:hac};
    for(const p of HP){if(p.tag==="top"&&hatOn)continue;if(p.tag==="hat"&&!hatOn)continue;let c=HCOL[p.slot]||hc,cf=null;
      if(mch===2&&p.tag==="streak")c=mcc;
      else if(mch===1&&p.slot!=="tie"){const base=c,y0=p.ymin;cf=(y,x,z)=>{const q=Math.hypot(x/hr[0],(y-hcy)/hr[2],z/hr[1]);return q>1.36||y<y0+.035?mcc:base}}
      else if(mch===3&&p.slot!=="tie"){const base=c,hl=av3Mix(hc,mcc,.62);cf=(y,x,z)=>Math.floor((Math.atan2(x,-z)+Math.PI)/Math.PI*7)%2?hl:base}
      E.mesh(MHh,p.P,p.N,p.I,c,cf)}}
  else if(!AV3M_NOHAIR.includes(L.hs))av3Hair(E,L,{HM,hrx:hx,hry:hy,hrz:hz,hc,sk,hac,hatOn,noThin:1,zs:(x,y)=>zAt(x*k0,hcy+y*k0)/k0});
  // adorno del pelo (horquilla, flor, estrella, lazos, cinta, pasadores), en el lado izquierdo sobre el pelo
  if(L.ha>0){const ha=L.ha,c=ha===3?[1,.85,.3]:hac,S=(x,y,z)=>m4T(MH,x,hcy+y,z),R=hr[0]*1.14;
    if(ha===1)E.box(m4RZ(S(R*.93,.07,.06),-.5),.012,.04,.008,c);
    else if(ha===2){for(let k=0;k<5;k++){const a=k/5*Math.PI*2;E.ell(S(R*.95,.08+Math.sin(a)*.024,.05+Math.cos(a)*.024),.012,.018,.018,c,null,1)}E.ell(S(R*.97,.08,.05),.011,.014,.014,[1,.85,.3],null,1)}
    else if(ha===3)E.disc(m4RY(S(R*.97,.08,.05),Math.PI/2),.03,.03,c,5);
    else if(ha===4||ha===6){const k=ha===6?1.9:1,B=ha===6?S(0,hr[2]*1.12,-.08):S(R*.92,.09,.04);for(const s of[-1,1])E.ell(m4RZ(m4T(B,s*.034*k,0,0),s*.5),.036*k,.022*k,.014*k,c,null,1);E.ell(B,.013*k,.013*k,.013*k,dk(c,.2),null,1)}
    else if(ha===5)E.lathe(m4RX(S(0,.035,-.004),-.18),[[.016,hr[0]*1.13,hr[1]*1.13,c],[-.016,hr[0]*1.13,hr[1]*1.13,c]],24);
    else if(ha===7)for(let k=0;k<3;k++)E.box(m4RZ(S(R*.93,.04+k*.035,.04+k*.012),-.3),.01,.024,.006,k%2?c:lt(c,.4))}
  // gorro modelado (si no ha llegado, el de siempre algo más grande para que asiente sobre el pelo)
  if(hatP){const HT={hat:hac,hatd:dk(hac,.25),hatl:lt(hac,.42),white:[.97,.97,.99],black:[.13,.13,.16],gold:[.93,.76,.26],red:[.86,.17,.2],pink:[.98,.62,.76],yellow:[1,.86,.3],orange:[.96,.55,.15],green:[.32,.64,.3],brown:[.46,.31,.19],lens:[.62,.86,.96]};
    for(const p of hatP)E.mesh(MHh,p.P,p.N,p.I,HT[p.slot]||hac)}
  else{const hk2=HP&&hatOn?1.13:HP?1.08:1,MHh2=m4S(m4T(MH,0,hcy+(HP&&hatOn?.012:0),0),k0*hk2);av3Hat(E,L,{HM:MHh2,hrx:hx,hry:hy,hrz:hz,hac,hc,ac,hk})}
  // barba
  if(L.brd===2||L.brd===6)E.ell(m4T(MH,0,hcy-.93*hr[2],zAt(0,hcy-.9*hr[2])-.004),.03,.03,.018,hc,null,1);
  if(L.brd===3||L.brd===4||L.brd===6)for(const s of[-1,1])E.ell(m4T(MH,s*.026,hcy-.6*hr[2],zAt(s*.026,hcy-.6*hr[2])+.002),.03,.011,.008,hc,null,1);
  if(L.brd===6)E.ell(m4T(MH,0,hcy-1.04*hr[2],zAt(0,hcy-.92*hr[2])-.035),.06,.075,.05,hc);
  if(L.brd===5)for(const s of[-1,1])E.ell(m4T(HM,s*hx*.96,-.05,.03),.012,.05,.03,hc,null,1);
  // gafas
  const shades=L.gl===3||L.hat===7||L.hat===13;
  if(L.gl>0||shades){const gc=L.gl===6?[.9,.75,.25]:L.gl===7?[.9,.3,.5]:[.12,.12,.15],one=L.gl===5||L.gl===6,EY=hcy-.2*hr[2],gz=zAt(.078,EY)+.03;
    for(const s of[-1,1]){if(one&&s>0)continue;const M=m4RY(m4T(MH,s*.08,EY,gz),s*.22);
      if(L.gl===5){E.disc(M,.056,.05,K,16);E.box(m4RZ(m4T(MH,0,EY+.07,gz),-.35),.17,.006,.003,K);continue}
      if(shades)E.disc(m4T(M,0,0,-.003),.06,.05,[.1,.1,.14],L.gl===2||L.gl===8?4:16);
      if(L.gl===2||L.gl===8){for(const[a,b,w,h]of[[0,.05,.064,.005],[0,-.05,.064,.005],[-.06,0,.005,.05],[.06,0,.005,.05]])E.box(m4T(M,a,b,0),w,h,.005,gc)}
      else for(let k=0;k<14;k++){const a=k/14*Math.PI*2;E.box(m4RZ(m4T(M,Math.cos(a)*.058,Math.sin(a)*.05,0),a+Math.PI/2),.0135,.005,.005,gc)}
      E.box(m4T(MH,s*hr[0]*.985,EY+.008,.07),.005,.006,.1,gc)}
    if(!one)E.box(m4T(MH,0,EY+.006,gz+.004),.024,.006,.005,gc)}
  // ----- complementos sobre el cuerpo -----
  const fz=TP.fz,bz=TP.bz,T=(x,y,z)=>m4T(G,x,y,z);
  if([1,4,6].includes(L.bp)){E.ell(T(0,1.15,bz-.062),.135,.17,.085,bpc);E.ell(T(0,1.08,bz-.132),.095,.082,.034,dk(bpc,.12));
    for(const s of[-1,1]){E.box(T(s*.105,1.2,TP.fs+.004),.016,.15,.005,dk(bpc,.25));E.box(m4RX(T(s*.105,1.365,.0),1.4),.016,.13,.005,dk(bpc,.25))}
    if(L.bp===6){const M=m4RY(T(0,1.19,bz-.149),Math.PI);E.disc(M,.042,.042,W,16);E.disc(m4T(M,0,.014,.001),.042,.028,[.9,.2,.25],16);E.disc(m4T(M,0,0,.002),.042,.005,K);E.disc(m4T(M,0,0,.003),.012,.012,W,10)}}
  else if([2,5,7].includes(L.bp)){E.ell(T(-.25,.93,.0),.055,.095,.11,bpc);E.box(m4RZ(T(-.03,1.17,fz+.008),.62),.009,.3,.004,dk(bpc,.2));E.box(m4RZ(T(-.03,1.17,bz-.008),.62),.009,.3,.004,dk(bpc,.2))}
  else if(L.bp===3)E.ell(T(.04,.985,.11),.08,.04,.04,bpc,null,1);
  if([1,3].includes(L.nk)){E.ell(T(0,1.392,.004),.124,.048,.114,nkc);E.box(T(.055,1.28,fz+.014),.028,.1,.012,dk(nkc,.1))}
  else if(L.nk===4){E.box(T(0,1.25,fz+.008),.02,.115,.005,nkc);E.box(T(0,1.372,fz-.012),.026,.02,.01,nkc)}
  else if(L.nk===5||L.nk===11||L.nk===8){for(const s of[-1,1])E.ell(T(s*.038,1.37,.088),.038,.024,.012,nkc,null,1);E.ell(T(0,1.37,.094),.015,.015,.015,dk(nkc),null,1)}
  else if(L.nk>0)E.lathe(T(0,0,-.008),[[1.395,.088,.088,nkc],[1.368,.094,.092,nkc]],16);
  if(L.blt>0){E.lathe(T(0,0,-.008),[[1.018,.157,.105,dk(bc,.55)],[.98,.163,.11,dk(bc,.55)]],22);E.box(T(0,.999,.104),.022,.017,.004,[.9,.75,.25]);
    if(L.blt===2)for(const s of[-1,1]){const B=T(s*.08,.995,.1);E.ell(B,.023,.023,.023,[.9,.2,.25],(x,y)=>y>=0,1);E.ell(B,.023,.023,.023,[.97,.97,.99],(x,y)=>y<0,1)}}
  // prenda atada a la cintura: banda, nudo con las mangas por delante y la prenda cayendo por detrás
  if(L.wst>0){const wc=P("cl",L.wsc),w2=dk(wc,.14),Q=T(0,0,-.008);E.lathe(Q,[[1.035,.2,.136,wc],[.95,.206,.142,wc]],24);E.lathe(Q,[[.97,.208,.144,wc],[.76,.245,.185,wc],[.745,.235,.178,w2]],18,null,Math.PI+.25,Math.PI*2-.25);
    E.ell(T(0,.99,.136),.044,.034,.026,w2,null,1);for(const s of[-1,1])E.lathe(m4RZ(T(s*.032,.975,.142),s*.3),[[0,.032,.022,wc],[-.15,.036,.024,wc],[-.16,.03,.02,L.wst===2?w2:lt(wc,.4)]],10,true)}
  if(L.pat>1&&!open)E.disc(T(0,1.2,fz+.006),.046,.046,pcc,L.pat===2?5:L.pat===4?3:12);
  const wl=J("wrL");if(L.wr>0)E.lathe(m4T(MS.armL2,wl[0],wl[1]+.03,wl[2]),[[.016,.04,.043,wrc],[-.014,.039,.042,wrc]],12);
  if(L.glv===3)for(const s of[-1,1])E.lathe(m4T(s>0?MS.armL2:MS.armR2,s*wl[0],wl[1]+.04,wl[2]),[[.03,.04,.044,glc],[-.03,.036,.04,glc]],12);
  // calcetines (si la pierna se ve por abajo y no se va con sandalias)
  if(!hide.shin&&!ms.foot&&L.sck!==3){const top2=L.sck===1?.44:L.sck===2?.36:.21,lg=meta.leg,at=y=>{for(let i=1;i<lg.length;i++)if(y>=lg[i][0]){const a=lg[i-1],b=lg[i],k=(a[0]-y)/(a[0]-b[0]);return a.map((v,j)=>v+(b[j]-v)*k)}return lg[lg.length-1]};
    for(const s of[-1,1]){const R=[];for(let y=top2;y>.1;y-=.04){const q=at(y),c=L.sck===2&&Math.floor(y/.04)%2?lt(sckc,.45):sckc;R.push([y,q[3]+.007,q[4]+.007,c])}const q=at(.1);R.push([.1,q[3]+.007,q[4]+.007,sckc]);const c=at((top2+.1)/2);E.lathe(m4T(s>0?MS.legL:MS.legR,s*c[1],0,-c[2]),R,14)}}
  // Poké Ball en la mano al lanzar
  if(AP&&(pose==="t"||pose==="m")){const w=mir(wl),B=m4T(MS.armR2,w[0]-.02,w[1]-.1,w[2]+.03);E.ell(B,.05,.05,.05,[.93,.2,.25],(x,y)=>y>=0,1);E.ell(B,.05,.05,.05,[.97,.97,.99],(x,y)=>y<0,1);E.ell(B,.052,.009,.052,K,null,1)}}
// ---------- cara: ojos grandes de varias capas con degradado, cejas, nariz, boca y mejillas ----------
function av3mFace(E,L,C){const{MH,zAt,hcy,hr,sk,hc,ec,t,P,dk,lt,K,W}=C,B0=.0036,DZ=.0011,PI=Math.PI,mix=av3Mix;
  const ey=L.ey,big=ey===1?1.12:ey===4?1.06:1,EY=hcy-.2*hr[2],ex=.4*hr[0],ew=.037*big,eh=(ey===6?.046:.058)*big,slant=ey===6?.24:ey===2?.02:.1,blink=(t%3.7)>3.58||ey===5;
  const lashK=[2,3,4,6].includes(L.mk)?1.45:1,mkc=P("cl",L.mkc);
  for(const s of[-1,1]){
    const pt=(u,v,l)=>{const x=s*(ex+u),y=EY+v;return[x,y,zAt(x,y)+B0+l*DZ]};
    // contorno del ojo: arriba más recto, abajo más redondo, y la esquina de fuera algo más alta
    const ol=(a,k,dv)=>{const c=Math.cos(a),sn=Math.sin(a),pw=sn>0?2.8:2.1,u=Math.sign(c)*Math.pow(Math.abs(c),2/pw)*ew*(k||1),v=Math.sign(sn)*Math.pow(Math.abs(sn),2/pw)*eh*(sn>0?1:.94)*(k||1);return[u,v+u*slant+(dv||0)]};
    const N=22,ring=(f,l)=>{const R=[];for(let i=0;i<N;i++)R.push(f(i/N*PI*2));return R.map(q=>pt(q[0],q[1],l))},ell=(cu,cv,ru,rv,l,n)=>{const R=[pt(cu,cv,l)];n=n||18;for(let i=0;i<n;i++){const a=i/n*PI*2;R.push(pt(cu+Math.cos(a)*ru,cv+Math.sin(a)*rv,l))}return R};
    const band=(a0,a1,fo,fi,l,c,n)=>{const A=[],Bq=[];n=n||14;for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n,p=fo(a),q=fi(a);A.push(pt(p[0],p[1],l));Bq.push(pt(q[0],q[1],l))}E.strip(MH,A,Bq,c)};
    const flick=(a0,a1,tu,tv,l)=>{const p=ol(a0,1.04),q=ol(a1,1.06,eh*.08);E.fan(MH,[pt(tu,tv,l),pt(p[0],p[1],l),pt(q[0],q[1],l)],K)};
    if(blink){band(PI*1.08,PI*1.92,a=>{const q=ol(a,1.02);return[q[0],q[1]*.42+.006]},a=>{const q=ol(a,1.02);return[q[0],q[1]*.42-.006]},2,K);flick(-.5,-.2,ew*1.34,-eh*.2+ew*slant,2)}
    else{
      // sombra de ojos (maquillaje), borde suave y blanco del ojo con la sombra del párpado arriba
      if(L.mk===2||L.mk===4)band(.25,PI-.25,a=>ol(a,1.2,eh*.34),a=>ol(a,1.04,eh*.06),0,mix(sk,mkc,.62));
      E.fan(MH,[pt(0,0,0)].concat(ring(a=>ol(a,1.07),0)),dk(sk,.42));
      {const R=ring(a=>ol(a),1),sh=[.8,.83,.9],Cc=[[.99,.99,1]];for(let i=0;i<N;i++){const v=Math.sin(i/N*PI*2);Cc.push(v>0?mix([.99,.99,1],sh,Math.min(1,v*1.15)):[.99,.99,1])}E.fan(MH,[pt(0,-eh*.1,1)].concat(R),Cc)}
      // iris: aro oscuro, degradado de oscuro (arriba) a claro (abajo), brillo inferior, pupila y dos reflejos
      const ui=-ew*.07,vi=-eh*.04+ui*slant,ru=ew*.78,rv=eh*.86,dark=dk(ec,.55),hi=lt(mix(ec,[.6,.8,1],.12),ey===4?.5:.34);
      E.fan(MH,ell(ui,vi,ru,rv,2,22),dk(ec,.62));
      {const R=ell(ui,vi-rv*.03,ru*.86,rv*.86,3,22),Cc=[mix(dark,hi,.42)];for(let i=0;i<22;i++){const v=Math.sin(i/22*PI*2);Cc.push(mix(dark,hi,Math.max(0,Math.min(1,.5-v*.62))))}E.fan(MH,R,Cc)}
      {const R=ell(ui,vi-rv*.5,ru*.56,rv*.24,4,14),top=mix(dark,hi,.8),Cc=[lt(hi,.25)];for(let i=0;i<14;i++)Cc.push(Math.sin(i/14*PI*2)>0?top:lt(hi,.3));E.fan(MH,R,Cc)}
      E.fan(MH,ell(ui,vi+rv*.1,ru*.4,rv*.44,5,16),mix([.05,.04,.08],ec,.12));
      const hx=s*-ru*.36;E.fan(MH,ell(ui+hx,vi+rv*.44,ru*.3,rv*.21,6,14),W);E.fan(MH,ell(ui-hx*.95,vi-rv*.36,ru*.13,rv*.09,6,10),W);
      if(ey===4){E.fan(MH,ell(ui-hx*.5,vi+rv*.5,ru*.1,rv*.07,6,8),W);E.fan(MH,ell(ui+hx*1.1,vi-rv*.1,ru*.08,rv*.06,6,8),W)}
      // párpados caídos (ojos serios) o risueños (ojos alegres): piel que tapa parte del ojo
      if(ey===2){const ch=u=>eh*.36-u*.2,A=[],Bq=[];for(let i=0;i<=10;i++){const u=-ew*1.12+ew*2.3*i/10;A.push(pt(u,eh*1.16+u*slant,7));Bq.push(pt(u,ch(u),7))}E.strip(MH,A,Bq,dk(sk,.04));
        const A2=[],B2=[];for(let i=0;i<=10;i++){const u=-ew*1.1+ew*2.28*i/10;A2.push(pt(u,ch(u)+.006,8));B2.push(pt(u,ch(u)-.0075*lashK,8))}E.strip(MH,A2,B2,K);flick(.05,.3,ew*1.4,ch(ew*1.4)+.012,8)}
      else{// línea gruesa del párpado de arriba (por encima del iris) y pico hacia fuera
        band(.1,PI-.1,a=>ol(a,1.1,eh*.105*lashK*Math.pow(Math.max(0,Math.sin(a)),.6)),a=>ol(a,.985,-eh*.075*Math.sin(a)),7,K,16);flick(.12,.62,ew*1.42,eh*.56+ew*slant*1.3,7);
        band(.6,PI-.6,a=>ol(a,.92,eh*.36),a=>ol(a,.92,eh*.36-.004),0,dk(sk,.2),8)}
      if(ey===3){const ed=u=>-eh*.6+eh*.34*(1-(u/ew)*(u/ew)),A=[],Bq=[],A2=[],B2=[];for(let i=0;i<=10;i++){const u=-ew*1.1+ew*2.2*i/10;A.push(pt(u,ed(u)+u*slant,7));Bq.push(pt(u,-eh*1.12+u*slant,7));A2.push(pt(u,ed(u)+u*slant+.004,8));B2.push(pt(u,ed(u)+u*slant-.002,8))}E.strip(MH,A,Bq,sk);E.strip(MH,A2,B2,dk(sk,.45))}
      if(ey===7||L.mk===3||L.mk===4)for(let k=0;k<3;k++)flick(.05+k*.24,.3+k*.24,ew*(1.36-k*.16),eh*(.34+k*.34)+ew*slant,7);
      else if(L.b===1)flick(.3,.75,ew*1.3,eh*.86+ew*slant,7)}
    // ceja: más gruesa por dentro y afilada hacia fuera
    {const bt={0:.1,1:.1,2:.04,3:.42,4:-.3}[L.brw]||0,th=L.brw===1?.0092:L.brw===2?.0032:.0058,bw=.04,by=eh+.03+(ey===2?-.006:0),A=[],Bq=[],bc2=mix(dk(hc,.35),sk,.1);
      for(let i=0;i<=8;i++){const f=i/8,u=-bw+f*bw*2.05,arch=(1-(f*2-1)*(f*2-1))*.008,v=by+arch+bt*u,h=th*(1.12-.82*f*f);A.push(pt(u,v+h,1));Bq.push(pt(u,v-h,1))}E.strip(MH,A,Bq,bc2)}
    // mejillas
    if(L.bl===1||[4,5].includes(L.mk)){const cx=ex*1.42,cy=-eh*1.3,R=[pt(cx-ex,cy,0)];for(let i=0;i<14;i++){const a=i/14*PI*2;R.push(pt(cx-ex+Math.cos(a)*.03,cy+Math.sin(a)*.015,0))}E.fan(MH,R,mix(sk,[1,.5,.55],.32))}
    if(L.bl===2)for(let k=0;k<4;k++)E.fan(MH,ell(ex*.3+k*.014,-eh*1.25-(k%2)*.012,.0042,.0042,0,8),dk(sk,.3))}
  const wp=(x,y,l)=>[x,y,zAt(x,y)+B0+l*DZ],wel=(cx,cy,rx,ry,l,n)=>{const R=[wp(cx,cy,l)];n=n||14;for(let i=0;i<n;i++){const a=i/n*PI*2;R.push(wp(cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,l))}return R};
  if(L.bl===3){const y=EY-.085;E.strip(MH,[wp(.075,y+.014,1),wp(.125,y+.004,1)],[wp(.077,y-.006,1),wp(.127,y-.016,1)],[.95,.85,.7])}
  if(L.bl===4)E.fan(MH,wel(.07,EY-.115,.0055,.0055,1,8),dk(sk,.62));
  // boca
  {const my=hcy-.7*hr[2],lip=[1,4].includes(L.mk),mc=lip?mkc:dk(sk,.52),mo=L.mo,th=lip?.0048:.0034,line=(w,f)=>{const A=[],Bq=[];for(let i=0;i<=12;i++){const u=-w+2*w*i/12,v=my+f(u/w);A.push(wp(u,v+th,1));Bq.push(wp(u,v-th,1))}E.strip(MH,A,Bq,mc)};
    if(mo===2||mo===4&&false){}
    if(mo===2){const R=[wp(0,my-.006,1)];for(let i=0;i<=12;i++){const a=PI+PI*i/12;R.push(wp(Math.cos(a)*.027,my+.006+Math.sin(a)*.03,1))}R.push(wp(.027,my+.008,1),wp(-.027,my+.008,1));E.fan(MH,R,[.4,.1,.14]);E.fan(MH,wel(0,my-.016,.015,.009,2,10),[.92,.45,.5]);line(.029,u=>.008)}
    else if(mo===5)E.fan(MH,wel(0,my-.002,.012,.016,1,12),[.4,.1,.14]);
    else if(mo===1)line(.02,u=>0);
    else if(mo===3)line(.03,u=>(u+.35)*(u+.35)*.0095-.004);
    else{line(.031,u=>u*u*.012-.004);if(mo===4)E.fan(MH,wel(.004,my-.014,.012,.012,2,10),[.94,.46,.52]);if(mo===6)E.fan(MH,[wp(.013,my-.014,2),wp(.007,my-.002,2),wp(.019,my+.001,2)],W)}}}
// ---------- enlace con el visor: si las piezas del aspecto están cargadas se usa el modelo de mallas ----------
{const _m=av3Model;av3Model=function(E,L,o){o=o||{};if(o.chibi||o.old||!av3mReady(L))return _m.call(this,E,L,o);try{av3mModel(E,L,o)}catch(e){console.error(e);AV3M.st["top"+L.top]=3;av3mFresh()}};
  av3Model.nowarp=(L,o)=>!(o&&(o.chibi||o.old))&&av3mReady(L)}
// las piezas de tu aspecto se piden nada más entrar
setTimeout(()=>{try{av3mReady(myLook())}catch(e){}},1200);
