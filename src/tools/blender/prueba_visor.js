// Arnés de prueba: carga el .glb y sustituye av3Model por el modelo de mallas (solo para las capturas de prueba)
window.protoLoad=function(b64,info){const bin0=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)).buffer,dv=new DataView(bin0);let off=12,json=null,bin=null;
  while(off<dv.byteLength){const len=dv.getUint32(off,true),type=dv.getUint32(off+4,true),ch=bin0.slice(off+8,off+8+len);if(type===0x4E4F534A)json=JSON.parse(new TextDecoder().decode(ch));else bin=ch;off+=8+len}
  const acc=i=>{const a=json.accessors[i],bv=json.bufferViews[a.bufferView],o=(bv.byteOffset||0)+(a.byteOffset||0),n=a.count*{SCALAR:1,VEC3:3}[a.type];if(bv.byteStride)throw new Error("stride");
    return a.componentType===5126?new Float32Array(bin.slice(o,o+n*4)):a.componentType===5125?new Uint32Array(bin.slice(o,o+n*4)):a.componentType===5123?new Uint16Array(bin.slice(o,o+n*2)):new Uint8Array(bin.slice(o,o+n))};
  const parts=[];json.nodes.forEach(nd=>{if(nd.mesh==null)return;if(nd.translation||nd.rotation||nd.scale)console.error("nodo con transformación",nd.name);const q=nd.name.split(".");json.meshes[nd.mesh].primitives.forEach(pr=>parts.push({seg:q[0],slot:q[1],name:q[2],grp:q[3]||"all",P:acc(pr.attributes.POSITION),N:acc(pr.attributes.NORMAL),I:acc(pr.indices)}))});
  window.PROTO={parts,info};
  const old=av3Model;window.av3Old=old;
  av3Model=function(E,L,o){if(o.old)return old(E,L,o);const P=(k,i)=>av3Hex(TRP[k][i]!=null?TRP[k][i]:TRP[k][0]),W=[1,1,1],K=[.1,.09,.12],dk=(c,k)=>av3Mix(c,[0,0,0],k==null?.25:k),lt=(c,k)=>av3Mix(c,W,k==null?.25:k),I=m4I();
    const sk=P("skin",L.sk),hc=P("hair",L.hc),ec=P("eye",L.ec),tc=P("cl",L.tc),ac=P("cl",L.ac),bc=P("cl",L.bc),shc=P("cl",L.sh),t=o.t||0;
    const COL={skin:sk,hair:hc,top:tc,topd:dk(tc,.2),topl:lt(tc,.78),inner:ac,bot:bc,botl:lt(bc,.22),belt:dk(bc,.6),shoe:shc,sole:[.96,.96,.98],white:[.97,.97,.99],sock:P("cl",L.sckc),gold:[.92,.76,.26]};
    const jk=L.top===1,sh=L.bot===1,SHOW={all:1,belt:jk,jacket:jk,tee:!jk,pants:!sh,shorts:sh,armskin:!jk,legskin:sh,torsoskin:0};
    // segmentos: giro alrededor de su articulación (coordenadas del juego: x, altura, frente)
    const pv=info.piv,J=k=>{const a=pv[k];return[a[0],a[2],-a[1]]},pose=o.pose||"i",AP={i:[0,0,0],t:[1.0,-1.6,.3],m:[-2.6,-.3,.2],u:[-1.5,-.15,.1],f:[-.7,-.4,.05],w:[-2.6,-.5,.25],l:[0,0,0]}[pose]||[0,0,0];
    const rot=(p,rx,rz)=>m4T(m4RX(m4RZ(m4T(I,p[0],p[1],p[2]),rz||0),rx||0),-p[0],-p[1],-p[2]),mir=p=>[-p[0],p[1],p[2]];
    const sway=Math.sin(t*1.6)*.02,MS={body:I,head:I,legL:I,legR:I};
    {const s=J("shL"),e=J("elL"),A1=rot(s,sway,0),A2=m4Mul(A1,rot(e,0,0));MS.armL1=A1;MS.armL2=A2}
    {const s=mir(J("shL")),e=mir(J("elL")),act=pose!=="i"&&pose!=="l",A1=rot(s,act?AP[0]:-sway,act?-AP[2]:0),A2=m4Mul(A1,rot(e,act?AP[1]:0,0));MS.armR1=A1;MS.armR2=A2}
    for(const p of parts)if(SHOW[p.grp])E.mesh(MS[p.seg]||I,p.P,p.N,p.I,COL[p.slot]||[1,0,1]);
    // cara: ojos, cejas, nariz y boca pegados al relieve de la malla
    const fg=info.face,zAt=(x,y)=>{const gx=(x-fg.x0)/fg.d,gy=(y-fg.y0)/fg.d,ix=Math.max(0,Math.min(fg.g[0].length-2,Math.floor(gx))),iy=Math.max(0,Math.min(fg.g.length-2,Math.floor(gy))),fx=gx-ix,fy=gy-iy,v=(a,b)=>fg.g[b][a]==null?.05:fg.g[b][a];
        return(v(ix,iy)*(1-fx)+v(ix+1,iy)*fx)*(1-fy)+(v(ix,iy+1)*(1-fx)+v(ix+1,iy+1)*fx)*fy};
    const F=(x,y,dz)=>{const e=.012,gx=(zAt(x+e,y)-zAt(x-e,y))/(2*e),gy=(zAt(x,y+e)-zAt(x,y-e))/(2*e);return m4RX(m4RY(m4T(I,x,y,zAt(x,y)+(dz||.003)),Math.atan(-gx)),Math.atan(gy)*.0)};
    const hr=pv.hr,hcz=pv.head[2],EY=hcz-.205*hr[2],blink=(t%3.7)>3.58||L.ey===5,es=(L.ey===1||L.ey===4?1.1:L.ey===2||L.ey===6?.9:1),U=hr[0]/.168;
    for(const s of[-1,1]){const ex=s*.4*hr[0],ew=.034*es*U,eh=.056*es*U,ix=ex-s*.004*U;
      if(blink)E.box(F(ex,EY,.006),ew,.005*U,.002,K);
      else{E.disc(F(ex+s*.003*U,EY+.013*U,.004),ew*1.04,eh*.94,K,20);E.disc(F(ex,EY,.006),ew,eh,[.99,.99,1],20);E.disc(F(ix,EY-.004*U,.008),ew*.68,eh*.86,dk(ec,.15),20);E.disc(F(ix,EY-.008*U,.0095),ew*.56,eh*.72,lt(ec,.28),20);E.disc(F(ix,EY-.028*U,.0105),ew*.4,eh*.28,lt(ec,.55),12);E.disc(F(ix,EY-.002*U,.0115),ew*.27,eh*.4,[.08,.07,.1],14);E.disc(F(ix+.011*U,EY+.02*U,.013),.0105*es*U,.0125*es*U,W,10);
        if(L.ey===2||L.ey===6)E.box(m4RZ(F(ex,EY+eh*.82,.015),s*.24),ew*1.25,.007*U,.002,K)}
      const bt={0:.07,1:.07,2:0,3:.35,4:-.3}[L.brw]||0;E.box(m4RZ(F(ex,EY+eh+.03*U,.007),s*bt),.032*U,(L.brw===1?.0075:L.brw===2?.003:.0042)*U,.002,av3Mix(dk(hc,.35),sk,.12))}
    E.disc(F(0,hcz-.475*hr[2],.004),.008*U,.005*U,dk(sk,.2),8);
    {const mc=dk(sk,.55),my=hcz-.72*hr[2];if(L.mo===2||L.mo===5)E.disc(F(0,my,.005),.02*U,.022*U,[.45,.12,.15],12);else{const sm=L.mo===1?0:1;for(let k=-4;k<=4;k++){const x=k*.007*U,u=x/(.03*U);E.box(m4RZ(F(x,my+u*u*.011*U*sm-.003,.005),2*u*.011*sm/.03),.005*U,.0038*U,.002,mc)}}}
    if(L.brd===2)E.ell(m4T(I,0,hcz-.93*hr[2],zAt(0,hcz-.9*hr[2])-.004),.03,.03,.018,hc,null,1)};
  av3Model.nowarp=1};
