// =====================================================================================
// AVATAR EN 3D (estilo de los juegos modernos de la saga: formas lisas, sombreado en dos tonos, ojos grandes)
// El modelo se construye al momento a partir del aspecto del entrenador: cuerpo, piel, cara, peinado, gorro, gafas,
// barba, ropa de arriba y de abajo, calzado, calcetines, mochila, cuello, guantes y cinturón.
// Motor propio con WebGL (sin librerías). Si el navegador no tiene WebGL se sigue usando el dibujo de siempre.
// =====================================================================================
const m4I=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
const m4Mul=(a,b)=>{const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o};
const m4T=(m,x,y,z)=>{const o=new Float32Array(m);o[12]=m[0]*x+m[4]*y+m[8]*z+m[12];o[13]=m[1]*x+m[5]*y+m[9]*z+m[13];o[14]=m[2]*x+m[6]*y+m[10]*z+m[14];return o};
const m4RX=(m,a)=>{const c=Math.cos(a),s=Math.sin(a);return m4Mul(m,new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]))};
const m4RY=(m,a)=>{const c=Math.cos(a),s=Math.sin(a);return m4Mul(m,new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]))};
const m4RZ=(m,a)=>{const c=Math.cos(a),s=Math.sin(a);return m4Mul(m,new Float32Array([c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]))};
const m4S=(m,k)=>{const o=new Float32Array(m);for(let i=0;i<12;i++)o[i]*=k;return o};
const m4Persp=(fov,asp,n,f)=>{const t=1/Math.tan(fov/2),o=new Float32Array(16);o[0]=t/asp;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o};
const m4Look=(e,c)=>{let zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2],l=Math.hypot(zx,zy,zz);zx/=l;zy/=l;zz/=l;let xx=zz,xy=0,xz=-zx;l=Math.hypot(xx,xz)||1;xx/=l;xz/=l;const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
  return new Float32Array([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1])};
const av3Hex=h=>{h=String(h||"#888888");return[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255]};
const av3Mix=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
function AV3(cv,keep){let gl=null;try{const o={antialias:true,alpha:true,premultipliedAlpha:false,preserveDrawingBuffer:!!keep};gl=cv.getContext("webgl",o)||cv.getContext("experimental-webgl",o)}catch(e){}if(!gl)return null;
  let pr;try{const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};pr=gl.createProgram();
    gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec3 p;attribute vec3 n;attribute vec3 c;uniform mat4 m;varying vec3 vn;varying vec3 vc;void main(){gl_Position=m*vec4(p,1.);vn=n;vc=c;}"));
    // sombreado en dos tonos (luz / sombra) con un borde suave, y un poco de luz de contorno
    gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec3 vn;varying vec3 vc;uniform vec3 L;void main(){float u=step(.01,dot(vn,vn));vec3 n=normalize(vn+vec3(0.,0.,.0001));float d=dot(n,L);float s=smoothstep(-.35,.55,d);float rim=pow(1.-max(n.z,0.),3.)*.1;vec3 lit=vc*(.66+.34*s)+vec3(rim)*s;gl_FragColor=vec4(mix(vc,lit,u),1.);}"));
    gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null}catch(e){return null}
  gl.useProgram(pr);const uM=gl.getUniformLocation(pr,"m"),uL=gl.getUniformLocation(pr,"L"),aP=gl.getAttribLocation(pr,"p"),aN=gl.getAttribLocation(pr,"n"),aC=gl.getAttribLocation(pr,"c");
  const MAXV=260000,buf=new Float32Array(MAXV*9),vbo=gl.createBuffer();let nv=0;gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,buf.byteLength,gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(aP);gl.enableVertexAttribArray(aN);gl.enableVertexAttribArray(aC);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,36,0);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,36,12);gl.vertexAttribPointer(aC,3,gl.FLOAT,false,36,24);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  let R0=m4I();// giro del modelo (las normales se dejan en el espacio de la cámara para que la luz no gire con él)
  let WP=false;const V=(x,y,z,nx,ny,nz,c)=>{if(nv>=MAXV)return;if(WP)y=y<.9?y*1.1:y<1.34?.99+(y-.9)*.79545:y;const i=nv*9,m=R0;buf[i]=m[0]*x+m[4]*y+m[8]*z+m[12];buf[i+1]=m[1]*x+m[5]*y+m[9]*z+m[13];buf[i+2]=m[2]*x+m[6]*y+m[10]*z+m[14];
    buf[i+3]=m[0]*nx+m[4]*ny+m[8]*nz;buf[i+4]=m[1]*nx+m[5]*ny+m[9]*nz;buf[i+5]=m[2]*nx+m[6]*ny+m[10]*nz;buf[i+6]=c[0];buf[i+7]=c[1];buf[i+8]=c[2];nv++};
  // esfera unidad en rejilla (dos resoluciones)
  const mkS=(S,Rg)=>{const P=[];for(let j=0;j<=Rg;j++){const v=j/Rg*Math.PI,row=[];for(let i=0;i<=S;i++){const u=i/S*Math.PI*2;row.push([Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)])}P.push(row)}return P},SH=mkS(26,15),SL=mkS(10,7);
  const E={
    // elipsoide; pred(x,y,z) sobre la esfera unidad decide qué trozos se dibujan (para cascos de pelo, gorras…)
    ell(M,rx,ry,rz,c,pred,lo){const P=lo?SL:SH,Rg=P.length-1,S=P[0].length-1;const vt=q=>{const x=q[0]*rx,y=q[1]*ry,z=q[2]*rz;let nx=q[0]/rx,ny=q[1]/ry,nz=q[2]/rz;const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
        V(M[0]*x+M[4]*y+M[8]*z+M[12],M[1]*x+M[5]*y+M[9]*z+M[13],M[2]*x+M[6]*y+M[10]*z+M[14],M[0]*nx+M[4]*ny+M[8]*nz,M[1]*nx+M[5]*ny+M[9]*nz,M[2]*nx+M[6]*ny+M[10]*nz,c)};
      for(let j=0;j<Rg;j++)for(let i=0;i<S;i++){const a=P[j][i],b=P[j][i+1],d=P[j+1][i],e=P[j+1][i+1];if(pred&&!pred((a[0]+e[0])/2,(a[1]+e[1])/2,(a[2]+e[2])/2))continue;vt(a);vt(b);vt(e);vt(a);vt(e);vt(d)}},
    // superficie de revolución: anillos [y, rx, rz, color]; a0..a1 = tramo de ángulos (π/2 es el frente)
    lathe(M,rings,segs,cap,a0,a1){segs=segs||16;a0=a0==null?0:a0;a1=a1==null?Math.PI*2:a1;const vt=(r,th)=>{const cs=Math.cos(th),sn=Math.sin(th),x=cs*r[1],z=sn*r[2];let nx=cs/Math.max(.001,r[1]),nz=sn/Math.max(.001,r[2]);const l=Math.hypot(nx,nz)||1;nx/=l;nz/=l;
        V(M[0]*x+M[4]*r[0]+M[8]*z+M[12],M[1]*x+M[5]*r[0]+M[9]*z+M[13],M[2]*x+M[6]*r[0]+M[10]*z+M[14],M[0]*nx+M[8]*nz,M[1]*nx+M[9]*nz,M[2]*nx+M[10]*nz,vt.c)};
      for(let k=0;k<rings.length-1;k++){const A=rings[k],B=rings[k+1];vt.c=A[3];for(let i=0;i<segs;i++){const t0=a0+(a1-a0)*i/segs,t1=a0+(a1-a0)*(i+1)/segs;vt(A,t0);vt(A,t1);vt(B,t1);vt(A,t0);vt(B,t1);vt(B,t0)}}
      if(cap){const r=rings[rings.length-1],ny=r[0]>rings[0][0]?1:-1,c=cap===true?r[3]:cap;for(let i=0;i<segs;i++){const t0=Math.PI*2*i/segs,t1=Math.PI*2*(i+1)/segs,P3=(x,z)=>V(M[0]*x+M[4]*r[0]+M[8]*z+M[12],M[1]*x+M[5]*r[0]+M[9]*z+M[13],M[2]*x+M[6]*r[0]+M[10]*z+M[14],M[4]*ny,M[5]*ny,M[6]*ny,c);P3(0,0);P3(Math.cos(t0)*r[1],Math.sin(t0)*r[2]);P3(Math.cos(t1)*r[1],Math.sin(t1)*r[2])}}},
    // malla modelada (posiciones, normales e índices de un .glb), con su matriz y un color liso
    mesh(M,P,N,I,c){for(let k=0;k<I.length;k++){const i=I[k]*3,x=P[i],y=P[i+1],z=P[i+2],a=N[i],b=N[i+1],d=N[i+2];V(M[0]*x+M[4]*y+M[8]*z+M[12],M[1]*x+M[5]*y+M[9]*z+M[13],M[2]*x+M[6]*y+M[10]*z+M[14],M[0]*a+M[4]*b+M[8]*d,M[1]*a+M[5]*b+M[9]*d,M[2]*a+M[6]*b+M[10]*d,c)}},
    box(M,hx,hy,hz,c){const F=[[0,0,1,[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[0,0,-1,[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],[1,0,0,[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],[-1,0,0,[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[0,1,0,[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],[0,-1,0,[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]];
      for(const f of F){const nx=M[0]*f[0]+M[4]*f[1]+M[8]*f[2],ny=M[1]*f[0]+M[5]*f[1]+M[9]*f[2],nz=M[2]*f[0]+M[6]*f[1]+M[10]*f[2],Q=[];for(let k=3;k<7;k++){const x=f[k][0]*hx,y=f[k][1]*hy,z=f[k][2]*hz;Q.push([M[0]*x+M[4]*y+M[8]*z+M[12],M[1]*x+M[5]*y+M[9]*z+M[13],M[2]*x+M[6]*y+M[10]*z+M[14]])}
        for(const k of[0,1,2,0,2,3])V(Q[k][0],Q[k][1],Q[k][2],nx,ny,nz,c)}},
    // disco plano sin sombreado (ojos, boca, emblemas), mirando hacia +z de su matriz
    disc(M,rx,ry,c,n){n=n||14;for(let i=0;i<n;i++){const t0=Math.PI*2*i/n,t1=Math.PI*2*(i+1)/n,P3=(x,y)=>V(M[0]*x+M[4]*y+M[12],M[1]*x+M[5]*y+M[13],M[2]*x+M[6]*y+M[14],0,0,0,c);P3(0,0);P3(Math.cos(t0)*rx,Math.sin(t0)*ry);P3(Math.cos(t1)*rx,Math.sin(t1)*ry)}}};
  return{ok:true,cv,
    draw(L,o){o=o||{};nv=0;const w=cv.width,h=cv.height;gl.viewport(0,0,w,h);const zoom=o.zoom||1,cy=o.cy==null?.97:o.cy,dist=(o.dist||5.15)/zoom;
      R0=m4RY(m4I(),o.yaw||0);WP=!o.chibi&&!av3Model.nowarp;av3Model(E,L,o);
      const VP=m4Mul(m4Persp((o.fov||24)*Math.PI/180,w/h,.3,30),m4Look([0,cy+(o.elev!=null?o.elev*dist:.25/zoom),dist],[0,cy,0]));
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uM,false,VP);const l=Math.hypot(.38,.5,.78);gl.uniform3f(uL,.38/l,.5/l,.78/l);
      gl.bufferSubData(gl.ARRAY_BUFFER,0,buf.subarray(0,nv*9));gl.drawArrays(gl.TRIANGLES,0,nv);return nv}}}
// ---------- peinados: cada uno con su forma (casco, flequillo, melena en mechones, puntas, coletas, trenzas, moños…) ----------
function av3Hair(E,L,C){const hs=L.hs;if(hs===22)return;
  const{HM,hrx,hry,hrz,hc,sk,hac,hatOn,zs}=C,dk=(c,k)=>av3Mix(c,[0,0,0],k),lt=(c,k)=>av3Mix(c,[1,1,1],k),hd=dk(hc,.2),hl=lt(hc,.16),h2=C.flat?hc:av3Mix(hc,hl,.5),PI=Math.PI,top=!hatOn;
  const lock=(x,y,z,rx,ry,rz,ax,az,c)=>E.ell(m4RZ(m4RX(m4T(HM,x,y,z),ax||0),az||0),rx,ry,rz,c||hc,null,1);
  const ball=(x,y,z,r,c)=>E.ell(m4T(HM,x,y,z),r,r,r,c||hc,null,1);
  // punto sobre el casco: a = ángulo alrededor (π/2 es el frente), e = elevación
  const on=(a,e,k)=>{const ce=Math.cos(e);return[Math.cos(a)*ce*hrx*k,Math.sin(e)*hry*k,Math.sin(a)*ce*hrz*k]};
  // punta: cono que sale de p en la dirección d
  const spike=(p,d,len,r,c)=>{const l=Math.hypot(d[0],d[1],d[2])||1,M=m4RX(m4RZ(m4T(HM,p[0],p[1],p[2]),Math.atan2(-d[0]/l,d[1]/l)),Math.asin(Math.max(-1,Math.min(1,d[2]/l))));E.lathe(M,[[-r*.6,r*.92,r*.92,c||hc],[len*.42,r*.7,r*.7,c||hc],[len,.003,.003,hl]],7)};
  // mechones que cuelgan pegados a la cabeza entre dos ángulos; cada uno baja de yT hasta yB (número o función)
  const strands=(a0,a1,n,yT,yB,kB,o)=>{o=o||{};for(let i=0;i<n;i++){const t0=a0+(a1-a0)*i/n,t1=a0+(a1-a0)*(i+1)/n,u0=(i+.5)/n,yb=typeof yB==="function"?yB(u0,(t0+t1)/2,i):yB-((i*5+hs)%3)*(o.jag==null?.012:o.jag),c=i%2?hc:h2,R=[],N=o.n||5;
      for(let k=0;k<=N;k++){const u=k/N,y=yT+(yb-yT)*u,f=1.17*Math.sqrt(Math.max(.08,1-(Math.max(y,0)/(hry*1.16))**2))+(kB-1.17)*u*u+(o.wave?Math.sin(u*o.wave*PI+i*1.3)*.035*Math.min(1,u*2):0);R.push([y,hrx*f,hrz*f,c])}
      const q=R[R.length-1],tp=o.tip==null?.84:o.tip;R.push([q[0]-.014,q[1]*tp,q[2]*tp,hd]);E.lathe(HM,R,o.seg||3,null,t0,t1)}};
  // coleta o trenza: bolitas encadenadas desde p en la dirección d, cayendo con «sag»
  const tail=(p,d,len,r,o)=>{o=o||{};len*=kl;const l=Math.hypot(d[0],d[1],d[2])||1,n=Math.ceil(len/(r*(o.braid?.62:.3)));let q=p;for(let k=0;k<n;k++){const t=(k+.5)/n;q=[p[0]+d[0]/l*len*t,p[1]+d[1]/l*len*t-(o.sag||0)*t*t,p[2]+d[2]/l*len*t];ball(q[0],q[1],q[2],o.braid?r*(1-.3*t):r*(1-.62*t*t),o.braid?(k%2?hd:hc):hc)}return q};
  const tie=(x,y,z,r)=>ball(x,y,z,r||.024,hac);
  // en la figura del mapa (cabeza grande, cuerpo corto) lo que cuelga por debajo de la barbilla se acorta para llegar al mismo sitio del cuerpo
  const cz=!!C.flat,ly=y=>cz&&y<-.105?-.0625+.4*y:y,kl=cz?.55:1;
  const thin=av3Mix(sk,hc,.6),line=(x,y,z)=>y>(z>0?-.36+z:-.36+z*.55);
  const shell=()=>E.ell(top?m4T(HM,0,.006,-.006):HM,hrx*1.13,hry*(top?1.17:1.12),hrz*(top?1.15:1.12),hc,line);
  const burns=()=>{for(const s of[-1,1])lock(s*hrx*1.0,-.035,.03,.022,.07,.045,0,s*.12)};
  const nape=n=>{for(let k=0;k<n;k++){const a=PI*1.5+(k/(n-1)-.5)*1.7;spike([Math.cos(a)*hrx*1.02,-.045,Math.sin(a)*hrz*1.02],[Math.cos(a)*.35,-1,Math.sin(a)*.45],.05,.034,k%2?h2:hc)}};
  // ----- casos que no llevan casco de pelo normal -----
  if(hs===5){E.ell(HM,hrx*1.03,hry*1.03,hrz*1.03,thin,line);return}
  if(hs===10){E.ell(HM,hrx*1.03,hry*1.03,hrz*1.03,thin,line);if(top)for(let k=0;k<8;k++){const t=k/7,f=-1.0+t*2.7;spike([0,Math.cos(f)*hry*.98,-Math.sin(f)*hrz*.98],[0,Math.cos(f)+.3,-Math.sin(f)-.1],.11-Math.abs(t-.4)*.06,.038,k%2?h2:hc)}
    else nape(4);return}
  if(hs===9){if(top){E.ell(m4T(HM,0,.035,-.012),hrx*1.5,hry*1.42,hrz*1.5,hc,(x,y,z)=>!(z>.52&&y<.3)&&y>-.62);
      for(let k=0;k<30;k++){const a=k*2.4,e=-.35+((k*7)%10)/10*1.8,ce=Math.cos(e);if(Math.sin(a)*ce>.45&&e<.55)continue;ball(Math.cos(a)*ce*hrx*1.45,.035+Math.sin(e)*hry*1.37,-.012+Math.sin(a)*ce*hrz*1.45,.042,k%2?h2:hc)}}
    else{shell();for(let k=0;k<9;k++){const a=PI-.2+k/8*(PI+.4);ball(Math.cos(a)*hrx*1.2,-.03-(k%2)*.035,Math.sin(a)*hrz*1.2,.052,k%2?h2:hc)}}return}
  if(hs===6){E.ell(HM,hrx*1.09,hry*1.09,hrz*1.09,hc,line);
    for(const[e,n]of[[1.25,3],[.8,7],[.35,10],[-.08,9],[-.42,6]]){if(!top&&e>.1)continue;for(let k=0;k<n;k++){const a=(e<0?PI-.25+k/(n-1)*(PI+.5):k/n*PI*2+e),p=on(a,e,1.13);if(e>=0&&e<.6&&Math.sin(a)>.5)continue;ball(p[0],p[1],p[2],.04,(k+n)%2?h2:hc)}}
    if(top)for(let k=0;k<5;k++){const u=(k/4-.5)*2,x=u*.082;ball(x,.078-Math.abs(u)*.012,zs(x,.07)+.018,.031,k%2?hc:h2)}return}
  // ----- casco -----
  if(hs===27){E.ell(HM,hrx*1.03,hry*1.03,hrz*1.03,thin,line);E.ell(m4T(HM,-.006,.012,-.004),hrx*1.1,hry*1.17,hrz*1.14,hc,(x,y,z)=>y>.3);if(top){lock(-.03,.118,.02,.085,.04,.1,-.1,.22);lock(-.05,.1,.085,.07,.034,.045,.35,.35,h2)}}
  else shell();
  // ----- melena: mechones alrededor (dejando la cara libre); las largas siguen por la espalda -----
  const LEN0={2:-.2,7:-.105,11:-.15,16:-.125,17:-.42,19:-.1,23:-.19,24:-.5,28:-.36,30:-.3,32:-.13,26:-.1}[hs],LEN=LEN0==null?null:ly(LEN0),LS=ly(-.2),wave=[17,30,32].includes(hs)?3:0,g=hs===16?.9:1.04;
  if(LEN!=null){const kB={16:1.3,11:1.22,2:1.22,23:1.42,24:1.15,32:1.3,7:1.2,19:1.2}[hs]||1.2;
    strands(PI/2+g,PI/2+PI*2-g,14,.03,(u,a)=>{const back=Math.abs(a-PI*1.5)<.95;return(LEN0<-.22?(back?LEN:LS):LEN)-((Math.round(u*14)*5+hs)%3)*(hs===23?.03:.012)},kB,{wave,tip:hs===16?.7:hs===23?.45:.84,n:LEN0<-.22?7:5});
    for(const s of[-1,1])lock(s*hrx*.97,-.02+Math.max(LEN,LS)*.45,.062,.024,Math.abs(Math.max(LEN,LS))*.52+.03,.03,0,s*.06,h2)}
  else if(![8,26].includes(hs))burns();
  // ----- flequillo (con gorro solo asoman los mechones de los lados) -----
  const B={0:"short",1:"spiky",2:"part",3:"side",4:"straight",7:"low",11:"side",12:"short",13:"straight",14:"spiky",15:"quiff",16:"straight",17:"part",19:"eye",20:"side",21:"part",23:"spiky",24:"straight",25:"part",27:"none",28:"side",29:"spiky",30:"straight",31:"side",32:"part"}[hs]||"none";
  if(top){const fr=(yB,o)=>strands(PI/2-.98,PI/2+.98,7,.1,yB,1.2,Object.assign({seg:2,n:4},o));
    if(B==="short")fr(.05);
    else if(B==="straight")fr(.036,{jag:.005});
    else if(B==="low")fr(.008,{jag:.006});
    else if(B==="side")fr(u=>.07-u*.065+(u>.85?.03:0),{});
    else if(B==="eye")fr(u=>u>.42?-.052+(1-u)*.035:.05,{});
    else if(B==="part")fr(u=>.1-Math.pow(Math.abs(u*2-1),.7)*.11,{});
    else if(B==="spiky")for(let k=0;k<5;k++){const u=(k/4-.5)*2,x=u*.078,y=.088-Math.abs(u)*.012;spike([x,y,zs(x,y)+.024],[u*.6+((hs+k)%2?.14:-.14),-1,.42],(hs===14?.07:.088)-Math.abs(u)*.014,.036,k%2?h2:hc)}
    else if(B==="quiff"){lock(0,.118,.082,.086,.062,.062,-.7,0);lock(0,.13,.02,.08,.045,.09,-.15,0);lock(0,.15,.1,.06,.022,.03,-.5,0,h2)}}
  else if(B!=="none"&&B!=="quiff"){for(const s of[-1,1])strands(PI/2+s*.55,PI/2+s*1.02,2,.04,hs===19&&s>0?-.05:-.012,1.2,{seg:2,n:3})}
  // ----- lo propio de cada peinado -----
  const tw=x=>Math.sign(x);
  if(hs===1||hs===29){const big=hs===29,len=big?.165:.115,r=big?.06:.05;
    if(top){for(const[e,n,off]of[[.22,big?7:8,.2],[.78,big?5:6,.5],[1.28,3,.3]])for(let k=0;k<n;k++){const a=k/n*PI*2+off,ce=Math.cos(e);if(e<.5&&Math.sin(a)>.5)continue;spike(on(a,e,1.0),[Math.cos(a)*ce,Math.sin(e)+.5,Math.sin(a)*ce-.3],len,r,k%2?h2:hc)}}
    for(let k=0;k<6;k++){const a=PI*1.5+(k/5-.5)*2.5;spike([Math.cos(a)*hrx*1.04,-.03,Math.sin(a)*hrz*1.04],[Math.cos(a)*.75,-.7,Math.sin(a)*.75-.15],big?.1:.07,.042,k%2?h2:hc)}}
  else if(hs===14){if(top)for(let k=0;k<17;k++){const a=k*2.4,e=.18+(k%5)*.27,ce=Math.cos(e);if(e<.6&&Math.sin(a)>.5)continue;spike(on(a,e,1.02),[Math.cos(a)*ce+Math.sin(k*1.7)*.55,Math.sin(e)+.15+Math.cos(k*2.3)*.35,Math.sin(a)*ce+Math.cos(k*1.3)*.55-.15],.07,.046,k%2?h2:hc)}nape(5)}
  else if(hs===23){for(const[y,k0,ln]of[[-.02,1.16,.12],[-.12,1.2,.14]])for(let k=0;k<8;k++){const a=PI-.25+k/7*(PI+.5);spike([Math.cos(a)*hrx*k0,y,Math.sin(a)*hrz*k0],[Math.cos(a),-.55,Math.sin(a)-.2],ln,.056,k%2?h2:hc)}
    if(top)for(let k=0;k<6;k++){const a=k/6*PI*2+.3;spike(on(a,.85,1.0),[Math.cos(a)*.6,.9,Math.sin(a)*.6-.5],.1,.05,k%2?h2:hc)}}
  else if(hs===0||hs===31||hs===15||hs===18)nape(hs===18?5:4);
  if(hs===31&&top)lock(.035,.118,.01,.085,.036,.1,-.05,-.2,h2);
  if(hs===18){E.ell(m4T(HM,0,.012,-.022),hrx*1.1,hry*1.12,hrz*1.14,hc,(x,y,z)=>z<.35&&y>-.3);if(top)lock(0,.105,.06,.07,.03,.05,-.5,0)}
  if(hs===3||hs===20){const hi=hs===20;if(hi&&!top){tie(0,-.01,-hrz*1.18);tail([0,-.02,-hrz*1.2],[0,-.8,-.6],.24,.05,{sag:.05})}else{const p=hi?[0,.085,-hrz*1.02]:[0,.0,-hrz*1.14];tie(p[0],p[1],p[2],.028);tail([p[0],p[1],p[2]-.02],hi?[0,.45,-1]:[0,-.55,-.8],hi?.3:.26,hi?.052:.05,{sag:hi?.24:.1})}}
  if(hs===4)for(const s of[-1,1]){const y=top?.055:-.03;tie(s*(hrx*1.08),y,-.03);tail([s*(hrx*1.12),y,-.035],[s*.5,-1,-.12],.27,.05,{sag:.04})}
  if(hs===25)for(const s of[-1,1]){tie(s*hrx*.92,-.1,-.06);tail([s*hrx*.95,-.12,-.06],[s*.22,-1,.12],.22,.042)}
  if(hs===21)for(const s of[-1,1]){const q=tail([s*hrx*1.0,-.07,-.035],[s*.16,-1,.3],.3,.032,{braid:1});tie(q[0],q[1]-.02,q[2],.02)}
  if(hs===12){const q=tail([0,-.05,-hrz*1.08],[0,-1,-.08],.36,.036,{braid:1});tie(q[0],q[1]-.02,q[2],.022)}
  if(hs===8){if(top){ball(0,.118,-.088,.064);ball(0,.118,-.088,.066,h2);E.lathe(m4RX(m4T(HM,0,.085,-.06),-.6),[[.02,.05,.05,hac],[.0,.052,.052,hac]],12)}else{ball(0,-.03,-hrz*1.2,.058);tie(0,-.0,-hrz*1.12,.02)}for(const s of[-1,1])lock(s*hrx*.96,-.03,.06,.012,.06,.014,0,s*.1)}
  if(hs===13)for(const s of[-1,1]){if(top){ball(s*.088,.128,-.015,.052);tie(s*.07,.1,-.012,.022)}else{ball(s*hrx*1.12,-.03,-.06,.05);tie(s*hrx*1.02,-.01,-.05,.02)}}
  if(hs===28){const p=top?[0,.1,-hrz*.98]:[0,-.0,-hrz*1.16];tie(p[0],p[1],p[2],.026);tail([p[0],p[1],p[2]-.025],[0,-1,-.45],.15,.04)}
  if(hs===26){for(let k=0;k<17;k++){const a=PI/2+1.0+k/16*(PI*2-2.0),ln=(.2+((k*5)%4)*.022)*(cz?.62:1),M=m4RZ(m4RX(m4T(HM,Math.cos(a)*hrx*1.08,.015,Math.sin(a)*hrz*1.08),-Math.sin(a)*.16),Math.cos(a)*.16),R=[];
      for(let j=0;j<=6;j++)R.push([-ln*j/6,.019,.019,j%2?hd:hc]);E.lathe(M,R,6,true);if(k%4===1)E.ell(m4T(M,0,-ln,0),.022,.016,.022,hac,null,1)}
    if(top)for(let k=0;k<7;k++){const u=(k/6-.5)*2;lock(u*.085,.125-Math.abs(u)*.03,-.01,.016,.016,.1,-.12,0,k%2?hd:hc)}}
  if(L.ha>0&&top)E.ell(m4T(HM,hrx*.86,.05,.085),.024,.017,.013,L.ha===3?[1,.85,.3]:hac,null,1)}
// ---------- el modelo ----------
// Proporciones de figura de la saga: cabeza grande (unas 5 cabezas de alto), cuerpo robusto, ropa holgada y manos y
// zapatillas grandes. o.pose: i quieto · t preparando el lanzamiento · m brazo arriba · u lanzando · f después de lanzar ·
// w victoria · l derrota.
function av3Model(E,L,o){const P=(k,i)=>av3Hex(TRP[k][i]!=null?TRP[k][i]:TRP[k][0]),W=[1,1,1],K=[.1,.09,.12],dk=(c,k)=>av3Mix(c,[0,0,0],k==null?.25:k),lt=(c,k)=>av3Mix(c,W,k==null?.25:k),chibi=!!o.chibi,wk=o.walk||0,I=chibi?new Float32Array([1.1,0,0,0,0,.6,0,0,0,0,1.1,0,0,0,0,1]):m4I(),T=(x,y,z)=>m4T(I,x,y,z);
  const sk=P("skin",L.sk),hc=P("hair",L.hc),ec=P("eye",L.ec),tc=P("cl",L.tc),ac=P("cl",L.ac),bc=P("cl",L.bc),shc=P("cl",L.sh),hac=P("cl",L.hac),bpc=P("cl",L.bpc),nkc=P("cl",L.nkc),glc=P("cl",L.glc),pcc=P("cl",L.pc),sckc=P("cl",L.sckc),wrc=P("cl",L.wrc);
  const girl=L.b===1,t=o.t||0,br=Math.sin(t*1.6)*.006,top=L.top,bot=L.bot,pose=o.pose||"i";
  const SH=girl?.172:.2,WA=girl?.122:.148,HIP=girl?.168:.164,TZ=girl?.105:.118;
  // ----- piernas, calcetines y calzado -----
  const dress=[4,23,26].includes(top),gown=top===26,skirtHem=dress?null:{2:.55,9:.56,13:.55,12:.66,4:.17}[bot],pantEnd=dress||skirtHem!=null?1:[1,15].includes(bot)?.6:bot===7?.5:bot===3?.27:.105,
    sockTop=L.sck===3?.8:L.sck===1?.44:L.sck===2?.36:.2,bootTop=[1,5,7,11].includes(L.shs)?.3:L.shs===4?.47:L.shs===6?.2:0,sandal=L.shs===2;
  // perfil de la pierna desnuda y de cada tipo de pantalón (radio a cada altura): los pantalones son holgados y caen rectos hasta el bajo
  const LY=[.88,.7,.5,.36,.22,.105,.08],LR=[.078,.076,.064,.062,.054,.048,.048],
    PR={5:[.082,.08,.068,.066,.058,.052,.052],6:[.1,.106,.112,.12,.13,.138,.138],10:[.102,.102,.094,.092,.086,.062,.058],11:[.096,.092,.082,.078,.074,.072,.072],14:[.104,.106,.1,.1,.102,.104,.104]}[bot]||[.1,.1,.092,.092,.096,.1,.1],
    lerpY=(A,y)=>{if(y>=LY[0])return A[0];for(let i=1;i<LY.length;i++)if(y>=LY[i]){const k=(LY[i-1]-y)/(LY[i-1]-LY[i]);return A[i-1]+(A[i]-A[i-1])*k}return A[A.length-1]},
    legR=y=>y<bootTop?lerpY(LR,y)*1.22:y>=pantEnd?lerpY(PR,y):lerpY(LR,y);
  for(const s of[-1,1]){const x=s*.096,legC=y=>y<bootTop?shc:y>=pantEnd?bc:(y<sockTop&&!sandal)?sckc:sk,R=[];
    const cuts=[pantEnd,sockTop,bootTop].filter(c=>c>.09&&c<.88),YS=LY.filter(y=>!cuts.some(c=>Math.abs(c-y)<.012)).concat(cuts).sort((a,b)=>b-a);
    for(const y of YS){if(cuts.includes(y)){const a=legR(y+.008),b=legR(y-.012);R.push([y+.001,a,a,legC(y+.008)],[y,b,b,legC(y-.012)])}else{const r=legR(y-.004);R.push([y,r,r,legC(y-.004)])}}
    const LM=wk?m4T(m4RX(T(x,.9+(s*wk>0?.06:0),0),-s*wk*.3),0,-.9,0):T(x,0,0);E.lathe(LM,R,18);
    // bajo del pantalón: vuelta más clara, como en los vaqueros remangados
    if(pantEnd>.09&&pantEnd<.8){const r=legR(pantEnd+.01)*1.07,h=pantEnd<.2?.06:.045;E.lathe(LM,[[pantEnd+h,r,r,lt(bc,.22)],[pantEnd,r,r,lt(bc,.22)],[pantEnd-.004,r*.8,r*.8,dk(bc,.3)]],14)}
    if(bot===14&&pantEnd<.8)E.box(m4T(LM,s*.098,.56,0),.012,.06,.05,dk(bc,.12));
    if(bot===8)for(const y of[.52,.66])E.box(m4T(LM,0,y,lerpY(PR,y)*.99),.035,.008,.004,sk);
    // pie grande, como en las figuras de la saga
    const sole=sandal?dk(shc,.2):L.shs===3||L.shs===10||L.shs===8?dk(shc,.45):[.97,.97,.99],FM=m4RY(LM,s*.14);
    E.ell(m4T(FM,0,.03,.06),.078,.032,.17,sole,null,1);
    if(!sandal){E.ell(m4T(FM,0,.078,.05),.07,.07,.152,shc,null,1);E.ell(m4T(FM,0,.055,.185),.056,.04,.045,[0,6,9].includes(L.shs)?[.97,.97,.99]:shc,null,1);
      if([0,6].includes(L.shs))for(let k=0;k<3;k++)E.box(m4T(FM,0,.136+k*.006,.12-k*.035),.036,.005,.009,W)}
    else{E.ell(m4T(FM,0,.06,.06),.055,.034,.12,sk,null,1);E.box(m4T(FM,0,.085,.085),.06,.009,.014,shc);E.box(m4T(FM,0,.08,0),.06,.009,.014,shc)}}
  // ----- cadera, falda y torso -----
  const stripes=top===14||L.pat===1,crop=top===10,open=[1,3,8,11,12,15,19,20,25,27].includes(top),hipC=dress?tc:bc,inner=open?(top===12||top===8?lt(ac,.1):ac):null;
  E.ell(T(0,.9,0),HIP*1.03,.135,TZ*1.02,hipC);
  if(skirtHem!=null||dress){const hem=dress?(gown?.14:.5):skirtHem,c=dress?tc:bc,w=hem<.3?.25:hem>.6?.23:.27;E.lathe(I,[[1.0,WA*1.03,TZ*.9,c],[.87,HIP*1.14,TZ*1.15,c],[hem+.04,w,w*.82,c],[hem,w*1.03,w*.85,dk(c,.12)]],20);
    if(bot===9||bot===13)for(let i=0;i<12;i++){const a=i/12*Math.PI*2;E.box(m4RY(T(Math.cos(a)*w*.99,hem+.12,Math.sin(a)*w*.82),-a+Math.PI/2),.006,.11,.004,dk(c,.14))}}
  const tr=(y,k)=>{const f=(y-.98)/.38,x=WA+(SH*.94-WA)*Math.min(1,f*1.25),z=TZ*.82+.022*Math.sin(Math.min(1,f)*Math.PI)+(girl&&y>1.14&&y<1.27?.014:0);return[y,x*(k||1)+(y>1.1?br:0),z*(k||1)+(y>1.1?br:0)]};
  const band=y=>{if(inner)return inner;if(crop&&y<1.13)return sk;if(stripes)return Math.floor((y-.98)/.062)%2?(top===14?ac:pcc):tc;return tc};
  {const R=[];for(let y=.97;y<1.335;y+=.031){const q=tr(y);R.push([q[0],q[1],q[2],band(y)])}const q=tr(1.34);R.push([1.34,q[1],q[2],band(1.34)]);R.push([1.39,SH*.6,.078,band(1.37)]);R.push([1.412,.07,.064,band(1.39)]);E.lathe(I,R,30)}
  // chaqueta, chaleco o abrigo abiertos: una capa por encima de la camiseta, con el frente sin cerrar y el cuello subido
  if(open){const g0=Math.PI/2+.42,g1=Math.PI/2+Math.PI*2-.42,hem=top===8||top===12?.58:.9,R=[];const longC=hem<.8;for(const y of longC?[hem,.8,.98,1.1,1.22,1.34]:[hem,.98,1.1,1.22,1.34]){const q=y<.7?[y,.262,.205]:y<.9?[y,.24,.185]:y<.99?(longC?[y,WA*1.3,TZ*1.22]:tr(y,1.09)):tr(y,1.09);R.push([y,q[1],q[2],y<hem+.03?dk(tc,.1):tc])}R.push([1.4,SH*.66,.086,tc]);E.lathe(I,R,30,null,g0,g1);
    for(const s of[-1,1]){E.box(m4RY(m4RZ(T(s*.062,1.4,.062),s*-.35),s*.5),.03,.05,.008,lt(tc,.55));E.box(m4RY(T(s*(tr(1.15,1.09)[1]*.47),1.15,tr(1.15,1.09)[2]*.93),s*.42),.006,.2,.006,dk(tc,.2))}
    if(top!==3&&top!==12)E.box(T(-SH*.55,1.12,TZ*1.03),.03,.006,.004,lt(tc,.6))}
  // hombros redondeados
  for(const s of[-1,1])E.ell(T(s*(SH-.004),1.325,0),.064,.056,.07,[6,10].includes(top)?sk:top===3?ac:tc,null,1);
  if(top===16){E.lathe(I,[[1.0,WA*1.24,TZ*1.16,tc],[.8,.235,.18,tc],[.56,.255,.2,tc],[.545,.25,.196,dk(tc,.15)]],20,null,Math.PI*.56,Math.PI*2.44);E.lathe(I,[[1.03,WA*1.13,TZ*.98,ac],[.97,WA*1.15,TZ*1.0,ac]],20)}
  if(top===2||top===19||top===20)E.ell(T(0,1.41,-.095),.13,.085,.07,dk(tc,.1));
  if(top===18||top===5||top===7||top===17){for(const s of[-1,1])E.box(m4RZ(T(s*.04,1.4,.07),s*-.6),.034,.014,.01,top===18?W:lt(tc,.3))}
  if(top===13){E.box(T(0,1.2,TZ+.004),.08,.1,.006,bc);for(const s of[-1,1])E.box(T(s*.07,1.34,TZ*.9),.014,.07,.006,bc)}
  if(L.pat>1&&!open){const q=tr(1.22);E.disc(T(0,1.22,q[2]+.012),.04,.04,pcc,L.pat===2?5:L.pat===4?3:10)}
  if(L.blt>0){E.lathe(I,[[1.005,WA*1.09,TZ*.92,dk(bc,.55)],[.975,WA*1.11,TZ*.94,dk(bc,.55)]],20);E.box(T(0,.99,TZ*.95),.02,.016,.004,[.9,.75,.25]);if(L.blt===2)for(const s of[-1,1]){const B=T(s*.075,.985,TZ*.9);E.ell(B,.022,.022,.022,[.9,.2,.25],(x,y)=>y>=0,1);E.ell(B,.022,.022,.022,[.97,.97,.99],(x,y)=>y<0,1)}}
  // prenda atada a la cintura: banda, nudo con las mangas por delante y la prenda cayendo por detrás
  if(L.wst>0){const wc=P("cl",L.wsc),w2=dk(wc,.14);E.lathe(I,[[1.0,WA*1.2,TZ*1.08,wc],[.93,HIP*1.12,TZ*1.16,wc]],20);E.lathe(I,[[.95,HIP*1.16,TZ*1.2,wc],[.74,.235,.19,wc],[.725,.225,.18,w2]],16,null,Math.PI+.25,Math.PI*2-.25);
    E.ell(T(0,.955,TZ*1.12),.04,.032,.026,w2,null,1);for(const s of[-1,1])E.lathe(m4RZ(T(s*.03,.94,TZ*1.14),s*.3),[[0,.03,.022,wc],[-.15,.034,.024,wc],[-.16,.028,.02,L.wst===2?w2:lt(wc,.4)]],10,true)}
  // ----- brazos: hombro, codo y mano; la postura depende de la pose -----
  const sleeve=[6,10].includes(top)?0:[1,2,5,8,9,11,12,15,16,17,18,19,20,25,27,28].includes(top)?2:1,arC=top===3?ac:tc;
  const AP={i:[.06,-.22,.16],t:[1.0,-2.0,.5],m:[-2.75,-.25,.25],u:[-1.55,-.12,.12],f:[-.75,-.35,.1],w:[-2.7,-.5,.3],l:[.05,-.08,.1]}[pose]||[.06,-.22,.16];
  for(const s of[-1,1]){const act=s<0&&pose!=="i"&&pose!=="l",a=act?AP:[.06+Math.sin(t*1.6+s)*.02+s*wk*.38,pose==="l"?-.08:-.22,pose==="w"?.55:.16],k=sleeve===2?1.16:1,ac2=y=>sleeve===2?arC:sleeve===1&&y>-.13?arC:sk;
    const M=m4RX(m4RZ(T(s*(SH+.016),1.33,0),s*a[2]),a[0]);
    E.ell(M,.064*k,.05,.064*k,ac2(0),(x,y)=>y>-.1,1);E.lathe(M,[[0,.064*k,.064*k,ac2(0)],[-.13,.058*(sleeve?1.16:1),.058*(sleeve?1.16:1),ac2(-.12)],[-.131,.058*(sleeve===1?1.02:k),.058*(sleeve===1?1.02:k),ac2(-.14)],[-.27,.05*k,.05*k,ac2(-.3)]],12);
    if(sleeve===1)E.lathe(M,[[-.1,.07,.07,lt(arC,.35)],[-.135,.07,.07,lt(arC,.35)]],12);
    E.ell(m4T(M,0,-.27,0),.05*k,.05*k,.05*k,ac2(-.3),null,1);
    const M2=m4RX(m4T(M,0,-.27,0),a[1]);E.lathe(M2,[[0,.05*k,.05*k,ac2(-.3)],[-.21,.04*k,.04*k,sleeve===2?arC:sk],[-.212,.04*(sleeve===2?1.22:1),.04*(sleeve===2?1.22:1),sleeve===2?dk(arC,.14):sk],[-.24,.037,.037,sk]],12);
    const gl=L.glv===1||L.glv===2||L.glv===4;E.ell(m4T(M2,0,-.3,.006),.044,.062,.05,gl?glc:sk,null,1);if(L.glv===1)E.ell(m4T(M2,0,-.345,.01),.03,.024,.034,sk,null,1);
    if(L.glv===3||L.glv===4)E.lathe(M2,[[-.14,.046,.046,glc],[-.24,.042,.042,glc]],10);
    if(L.wr>0&&s>0)E.lathe(M2,[[-.2,.046,.046,wrc],[-.235,.044,.044,wrc]],10);
    if(act&&(pose==="t"||pose==="m")){const B=m4T(M2,0,-.37,.03);E.ell(B,.045,.045,.045,[.93,.2,.25],(x,y)=>y>=0,1);E.ell(B,.045,.045,.045,[.97,.97,.99],(x,y)=>y<0,1);E.ell(B,.047,.008,.047,K,null,1)}}
  // ----- cuello y lo que se lleva al cuello -----
  E.lathe(I,[[1.38,.058,.058,sk],[1.5,.054,.054,sk]],12);
  if([1,3].includes(L.nk)){E.ell(T(0,1.425,.005),.1,.04,.09,nkc);E.box(T(.05,1.3,TZ*.95),.026,.1,.012,dk(nkc,.1))}
  else if(L.nk===4){E.box(T(0,1.27,TZ+.012),.018,.11,.005,nkc);E.box(T(0,1.395,.095),.024,.02,.01,nkc)}
  else if(L.nk===5||L.nk===11||L.nk===8){for(const s of[-1,1])E.ell(T(s*.034,1.395,.095),.034,.022,.012,nkc,null,1);E.ell(T(0,1.395,.1),.014,.014,.014,dk(nkc),null,1)}
  else if(L.nk>0)E.lathe(I,[[1.415,.07,.066,nkc],[1.398,.074,.07,nkc]],14);
  // ----- cabeza: cráneo redondo y mandíbula más estrecha -----
  const HS=1.56,JW=L.fs===2?.9:L.fs===1?.74:.8,hrx=L.fs===2?.118:L.fs===1?.108:.114,hry=L.fs===1?.134:.128,hrz=.118,hy=chibi?1.475*.6+hry*2.25*.86:1.475+hry*HS*.93,HM=m4S(m4RX(m4T(m4I(),0,hy,0),chibi?0:Math.sin(t*.9)*.015+(pose==="l"?.38:0)),chibi?2.25:HS);
  E.ell(HM,hrx,hry,hrz,sk);E.ell(m4T(HM,0,-.056,.007),hrx*JW,hry*.74,hrz*.88,sk);for(const s of[-1,1])E.ell(m4T(HM,s*hrx,-.02,-.005),.02,.034,.024,sk,null,1);
  const zs=(x,y)=>Math.max(hrz*Math.sqrt(Math.max(.02,1-(x/hrx)*(x/hrx)-(y/hry)*(y/hry))),.007+hrz*.88*Math.sqrt(Math.max(0,1-(x/(hrx*JW))**2-((y+.056)/(hry*.74))**2))),F=(x,y,dz,ry)=>m4RY(m4T(HM,x,y,zs(x,y)+(dz||.003)),ry||0);
  // ojos
  const blink=(t%3.7)>3.58||L.ey===5,es=(L.ey===1||L.ey===4?1.12:L.ey===2||L.ey===6?.88:1)*.9,lash=dk(hc,.6),EY=-.03;
  for(const s of[-1,1]){const ex=s*.046,ey=EY,ry=s*.36;if(chibi){E.disc(F(s*.05,ey-.014,.006,s*.7),.02,.03,[1,0,1]);continue}
    if(blink)E.box(F(ex,ey,.004,ry),.03*es,.005,.002,K);
    else{const ew=.0275*es,eh=.043*es,ix=ex-s*.0015;
      // el párpado es un óvalo oscuro detrás del blanco: solo asoma como una línea curva por arriba y por fuera (no es una ceja)
      E.disc(F(ex+s*.004,ey+.0055,.003,ry),ew*1.13,eh*1.0,K);E.disc(F(ex,ey,.0045,ry),ew,eh,[.99,.99,1]);
      E.disc(F(ix,ey-.003,.006,ry),ew*.86,eh*.9,dk(ec,.35));E.disc(F(ix,ey-.006,.007,ry),ew*.72,eh*.76,lt(ec,.08));E.disc(F(ix,ey-.02,.0075,ry),ew*.48,eh*.3,lt(ec,.4),10);E.disc(F(ix,ey-.001,.008,ry),ew*.34,eh*.42,[.08,.07,.1]);E.disc(F(ix+.009,ey+.015,.0095,ry),.008*es,.0095*es,W,8);
      if(L.ey===2||L.ey===6)E.box(m4RZ(F(ex,ey+eh*.82,.0105,ry),s*.24),ew*1.25,.0055,.002,K);
      if(L.ey===7)for(let k=0;k<3;k++)E.box(m4RZ(F(ex+s*(.022+k*.008),ey+eh*.95+k*.002,.006,ry),s*-.9),.008,.003,.002,K)}
    const bt={0:.07,1:.07,2:0,3:.35,4:-.3}[L.brw]||0;E.box(m4RZ(F(ex,ey+.072,.005,ry),s*bt),.024,L.brw===1?.0058:L.brw===2?.002:.0032,.002,av3Mix(dk(hc,.35),sk,.12));
    if(L.bl===1||[4,5].includes(L.mk))E.disc(F(s*.068,-.066,.004,s*.6),.02,.012,av3Mix(sk,[1,.5,.55],.45),10);
    if(L.bl===2)for(let k=0;k<3;k++)E.disc(F(s*(.052+k*.011),-.058-(k%2)*.008,.004,s*.5),.003,.003,dk(sk,.3),6)}
  if(L.bl===3)E.box(F(.06,-.066,.004,.5),.016,.007,.002,[.95,.85,.7]);if(L.bl===4)E.disc(F(.05,-.09,.004,.4),.004,.004,dk(sk,.6),6);
  // nariz y boca
  E.disc(F(0,-.058,.004),.006,.004,dk(sk,.22),8);
  {const mc=[1,4].includes(L.mk)?P("cl",L.mkc):dk(sk,.55),my=-.092;if(L.mo===2||L.mo===5)E.disc(F(0,my,.004),.014,L.mo===5?.012:.016,[.45,.12,.15],10);
    else{const sm=L.mo===1?0:L.mo===3?1.5:1;for(let k=-4;k<=4;k++){const x=k*.0048,u=x/.02,tl=L.mo===3?u*.5+.5:1;E.box(m4RZ(F(x,my+u*u*.0075*sm*tl-.002,.004),2*u*.0075*sm/.02*tl),.0034,.0026,.002,mc)}if(L.mo===4)E.disc(F(0,my-.008,.005),.007,.008,[.95,.45,.5],8);if(L.mo===6)E.box(F(.008,my-.006,.005),.003,.005,.002,W)}}
  // barba
  if(L.brd===1)E.ell(m4T(HM,0,-.05,.006),hrx*.86,hry*.76,hrz*.92,av3Mix(sk,hc,.28),(x,y,z)=>y<-.15&&z>-.1);
  if(L.brd===2||L.brd===6)E.ell(m4T(HM,0,-.122,zs(0,-.118)-.004),.022,.024,.014,hc,null,1);
  if(L.brd===3||L.brd===4||L.brd===6)for(const s of[-1,1])E.ell(F(s*.018,-.076,.002),.02,.008,.008,hc,null,1);
  if(L.brd===4||L.brd===6)E.ell(m4T(HM,0,-.05,.006),hrx*.9,hry*.8,hrz*.96,hc,(x,y,z)=>y<-.2&&z>-.3&&!(y>-.6&&Math.abs(x)<.32&&z>.5));
  if(L.brd===6)E.ell(m4T(HM,0,-.18,.055),.06,.07,.045,hc);
  if(L.brd===5)for(const s of[-1,1])E.ell(m4T(HM,s*hrx*.95,-.05,.03),.012,.05,.03,hc,null,1);
  // gafas
  const shades=L.gl===3||L.hat===7||L.hat===13;
  if(L.gl>0||shades){const gc=L.gl===6?[.9,.75,.25]:L.gl===7?[.9,.3,.5]:[.12,.12,.15],one=L.gl===5||L.gl===6;
    for(const s of[-1,1]){if(one&&s>0)continue;const M=F(s*.046,EY,.022,s*.3);
      if(L.gl===5){E.disc(M,.034,.03,K);E.box(m4RZ(F(0,EY+.04,.02),-.35),.1,.004,.002,K);continue}
      if(shades)E.disc(m4T(M,0,0,-.002),.036,.03,[.1,.1,.14],L.gl===2||L.gl===8?4:14);
      if(L.gl===2||L.gl===8){for(const[a,b,w,h]of[[0,.03,.038,.003],[0,-.03,.038,.003],[-.036,0,.003,.03],[.036,0,.003,.03]])E.box(m4T(M,a,b,0),w,h,.003,gc)}
      else for(let k=0;k<12;k++){const a=k/12*Math.PI*2;E.box(m4RZ(m4T(M,Math.cos(a)*.035,Math.sin(a)*.03,0),a+Math.PI/2),.0095,.003,.003,gc)}
      E.box(m4T(HM,s*hrx*.99,EY+.006,.045),.003,.004,.06,gc)}
    if(!one)E.box(F(0,EY+.004,.024),.014,.004,.003,gc)}
  // ----- pelo (cada peinado tiene su forma: ver av3Hair) -----
  const hk=typeof chHatKind==="function"?chHatKind(L.hat):"",hatOn=["cap","beanie","wide","top","hard"].includes(hk);
  av3Hair(E,L,{HM,hrx,hry,hrz,hc,sk,hac,hatOn,zs,flat:chibi});
  // ----- gorros -----
  if(hk){const rev=L.hat===2,HH=rev?m4RY(HM,Math.PI):HM,hc2=hac,hdk=dk(hac,.22);
    if(hk==="cap"){E.ell(HH,hrx*1.17,hry*1.17,hrz*1.17,hc2,(x,y,z)=>y>.18);E.ell(m4RX(m4T(HH,0,.04,hrz*1.2),.14),hrx*.98,.012,.1,hc2);E.ell(m4RX(m4T(HH,0,.032,hrz*1.2),.14),hrx*.96,.008,.098,hdk);E.ell(m4T(HH,0,hry*1.18,0),.014,.008,.014,hdk,null,1);
      if(L.hat===1||L.hat===24)E.ell(HH,hrx*1.175,hry*1.175,hrz*1.175,[.97,.97,.99],(x,y,z)=>y>.18&&y<.62&&z>.55&&Math.abs(x)<.5)}
    else if(hk==="beanie"){E.ell(HM,hrx*1.15,hry*1.2,hrz*1.15,hc2,(x,y,z)=>y>.12);E.lathe(HM,[[.065,hrx*1.18,hrz*1.18,lt(hc2,.3)],[.02,hrx*1.19,hrz*1.19,lt(hc2,.3)],[.005,hrx*1.15,hrz*1.15,lt(hc2,.3)]],20);if(L.hat===20||L.hat===3)E.ell(m4T(HM,0,hry*1.24,0),.03,.03,.03,L.hat===20?W:lt(hc2,.3),null,1)}
    else if(hk==="wide"||hk==="top"||hk==="hard"){const tall=hk==="top"?.2:hk==="hard"?.1:.12,br2=hk==="top"?.16:hk==="hard"?.16:L.hat===19?.25:.22,y0=.075;
      E.ell(m4T(HM,0,y0,0),br2,.012,br2,hk==="top"?hc2:hdk);
      if(hk==="hard")E.ell(m4T(HM,0,y0-.02,0),hrx*1.17,.115,hrz*1.17,hc2,(x,y,z)=>y>.05);
      else E.lathe(HM,[[y0,hrx*1.02,hrz*1.02,ac],[y0+.03,hrx*1.01,hrz*1.01,hc2],[y0+tall,hrx*(hk==="top"?.98:.85),hrz*(hk==="top"?.98:.85),hc2]],20,true)}
    else if(hk==="band"){E.lathe(HM,[[.09,hrx*1.14,hrz*1.14,hc2],[.06,hrx*1.15,hrz*1.15,hc2]],20);if(L.hat===12)for(let k=0;k<7;k++)E.ell(m4T(HM,Math.cos(k/6*Math.PI)*hrx*1.12,.09,Math.sin(k/6*Math.PI)*hrz*1.12),.018,.018,.018,k%2?[1,.6,.75]:[1,.9,.4],null,1)}
    else if(hk==="bow"){for(const s of[-1,1])E.ell(m4RZ(m4T(HM,s*.045,hry*1.14,0),s*.5),.05,.03,.02,hc2,null,1);E.ell(m4T(HM,0,hry*1.13,0),.018,.018,.018,hdk,null,1)}
    else if(hk==="ears")for(const s of[-1,1])E.lathe(m4RZ(m4T(HM,s*.07,hry*.95,0),s*-.25),[[0,.035,.025,hc],[.07,.003,.003,hc]],8)}
  // ----- mochila -----
  if([1,4,6].includes(L.bp)){E.ell(T(0,1.17,-TZ-.065),.135,.18,.085,bpc);E.ell(T(0,1.1,-TZ-.135),.095,.085,.034,dk(bpc,.12));for(const s of[-1,1]){E.box(T(s*.1,1.22,TZ*.93+(open?.012:0)+br),.016,.16,.005,dk(bpc,.25));E.box(m4RX(T(s*.1,1.395,.0),1.35),.016,.12,.005,dk(bpc,.25))}
    if(L.bp===6){const M=m4RY(T(0,1.21,-TZ-.152),Math.PI);E.disc(M,.04,.04,W);E.disc(m4T(M,0,.013,.001),.04,.026,[.9,.2,.25]);E.disc(m4T(M,0,0,.002),.04,.005,K);E.disc(m4T(M,0,0,.003),.011,.011,W,8)}}
  else if([2,5,7].includes(L.bp)){E.ell(T(-.24,.9,.01),.055,.095,.11,bpc);E.box(m4RZ(T(-.02,1.18,TZ+.01),.62),.009,.29,.004,dk(bpc,.2));E.box(m4RZ(T(-.02,1.18,-TZ-.01),.62),.009,.29,.004,dk(bpc,.2))}
  else if(L.bp===3)E.ell(T(.04,.975,TZ+.005),.08,.04,.04,bpc,null,1)}
// ---------- imágenes fijas (tarjeta, perfil…) y vistas vivas (editor y juego base) ----------
const AV3S={c:null,r:null,url:{},n:0};
function av3URL(L,w,h,o){if(!av3Attach.ready)return null;o=o||{};const k=trEnc(L)+"|"+w+"x"+h+"|"+(o.yaw||0)+"|"+(o.zoom||1)+"|"+(o.cy||"")+"|"+(o.pose||"");if(AV3S.url[k])return AV3S.url[k];
  if(AV3S.r===null){AV3S.c=document.createElement("canvas");AV3S.r=AV3(AV3S.c,true)||false}if(!AV3S.r)return null;
  if(AV3S.n>400){AV3S.url={};AV3S.n=0}AV3S.c.width=w;AV3S.c.height=h;AV3S.r.draw(L,Object.assign({t:1.2},o));AV3S.n++;try{document.body.classList.add("av3")}catch(e){}return AV3S.url[k]=AV3S.c.toDataURL("image/png")}
// vista viva en un contenedor (se puede girar arrastrando). Cada «clave» conserva su lienzo aunque el contenedor se
// vuelva a crear, para no gastar un contexto WebGL nuevo cada vez. Devuelve false si no hay WebGL.
const AV3V={};
function av3Attach(host,key,getLook,o){if(!av3Attach.ready)return false;o=o||{};if(!host)return false;let v=AV3V[key];
  if(!v){const cv=document.createElement("canvas");cv.className="av3cv";const r=AV3(cv);if(!r){AV3V[key]={bad:1};return false}v=AV3V[key]={cv,r,yaw:o.yaw==null?.35:o.yaw,drag:null,run:false,last:0};
    if(o.drag!==false){cv.style.touchAction="none";cv.style.cursor="grab";v.zoom=1;v.cy=.97;const PT=new Map();
      // arrastrar gira (y, con zoom, sube y baja la vista); rueda, pellizco o doble clic cambian el zoom
      cv.addEventListener("pointerdown",e=>{PT.set(e.pointerId,{x:e.clientX,y:e.clientY});try{cv.setPointerCapture(e.pointerId)}catch(x){}
        if(PT.size===1)v.drag={x:e.clientX,y:e.clientY,y0:v.yaw,c0:v.cy};else if(PT.size===2){const a=[...PT.values()];v.drag={pinch:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1,z0:v.zoom}}});
      cv.addEventListener("pointermove",e=>{if(!PT.has(e.pointerId)||!v.drag)return;PT.set(e.pointerId,{x:e.clientX,y:e.clientY});
        if(v.drag.pinch){const a=[...PT.values()];if(a.length>1)av3Zoom(v,v.drag.z0*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/v.drag.pinch/v.zoom,.4)}
        else{v.yaw=v.drag.y0+(e.clientX-v.drag.x)*.012;const h=cv.getBoundingClientRect().height||1;v.cy=v.drag.c0+(e.clientY-v.drag.y)/h*2*1.0947/v.zoom;av3Zoom(v,1)}});
      const up=e=>{PT.delete(e.pointerId);v.drag=PT.size===1?{x:[...PT.values()][0].x,y:[...PT.values()][0].y,y0:v.yaw,c0:v.cy}:null};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
      cv.addEventListener("wheel",e=>{e.preventDefault();const b=cv.getBoundingClientRect();av3Zoom(v,e.deltaY<0?1.15:1/1.15,(e.clientY-b.top)/(b.height||1))},{passive:false});
      cv.addEventListener("dblclick",()=>{av3Zoom(v,(v.zoom>1.05?1:2)/v.zoom)})}}
  if(v.big&&host.id!=="av3BigH")return true;
  if(v.bad)return false;v.get=getLook;v.o=o;if(v.cv.parentNode!==host){host.innerHTML="";host.appendChild(v.cv)}
  if(!v.run){v.run=true;v.last=0;const calm=()=>typeof hubCalm==="function"&&hubCalm(),gap=o.fps?1000/o.fps:33;
    const loop=ts=>{if(!v.cv.isConnected){v.run=false;return}requestAnimationFrame(loop);if(document.hidden||v.cv.offsetParent===null)return;if(calm()&&v.last&&!v.drag&&v.sig===v.sig2)return;if(ts-v.last<gap)return;v.last=ts;
      const b=v.cv.parentNode.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1),w=Math.max(40,Math.round(b.width*d)),h=Math.max(60,Math.round(b.height*d));if(v.cv.width!==w||v.cv.height!==h){v.cv.width=w;v.cv.height=h}
      try{const L=v.get();v.sig2=v.sig;v.sig=trEnc(L)+v.yaw+"|"+v.zoom+"|"+v.cy;v.r.draw(L,{t:calm()?1.2:ts/1000,yaw:v.yaw,zoom:(v.o.zoom||1)*(v.zoom||1),cy:v.zoom>1?v.cy:v.o.cy})}catch(e){}};requestAnimationFrame(loop)}
  return true}
// zoom de una vista viva: k multiplica el zoom actual (1 = solo recolocar) y f es la altura del puntero (0 arriba, 1 abajo),
// que se queda quieta al acercar. La vista nunca se sale del modelo.
function av3Zoom(v,k,f){if(typeof v==="string")v=AV3V[v];if(!v||v.bad||!v.cv)return;f=f==null?.19:f;const z0=v.zoom||1,z=Math.max(1,Math.min(4.5,z0*k)),h0=1.0947/z0,h1=1.0947/z;
  v.cy=(v.cy==null?.97:v.cy)+(.5-f)*2*(h0-h1);v.zoom=z;v.cy=Math.max(Math.min(.97,h1-.12),Math.min(Math.max(.97,1.97-h1),v.cy));if(z<=1.001)v.cy=.97}
// vista grande: el mismo lienzo pasa a una ventana a pantalla casi completa y vuelve a su sitio al cerrarla
function av3Big(key,getLook){const v=AV3V[key];if(!v||v.bad||!v.cv)return;let d=document.getElementById("av3Big");if(d)d.remove();
  d=document.createElement("div");d.id="av3Big";d.innerHTML='<div class="av3bx"><div class="av3bh" id="av3BigH"></div><div class="trvz"><button type="button" data-z="1.3" aria-label="Acercar">＋</button><button type="button" data-z="0.77" aria-label="Alejar">－</button></div><button type="button" class="av3bc" aria-label="Cerrar">✕</button><div class="av3bt">Arrastra para girar · rueda o pellizco para acercar</div></div>';
  document.body.appendChild(d);const get=getLook||v.get,o=v.o;
  const close=()=>{document.removeEventListener("keydown",key2);v.big=false;d.remove();av3Zoom(v,1/v.zoom);const h=document.getElementById("trV3");if(h)av3Attach(h,key,get,o)},key2=e=>{if(e.key==="Escape"){e.stopPropagation();close()}};
  d.addEventListener("click",e=>{const z=e.target.closest("[data-z]");if(z){av3Zoom(v,parseFloat(z.dataset.z));return}if(e.target===d||e.target.closest(".av3bc"))close()});document.addEventListener("keydown",key2);
  v.big=false;av3Attach(document.getElementById("av3BigH"),key,get,o);v.big=true}
// ---------- todas las imágenes del entrenador (frente, espaldas y poses de combate) salen del modelo 3D ----------
// La figura de píxel solo se sigue generando por dentro para sacar de ella el personaje del modo Exploración.
{const _tu=trURL;trURL=function(L,view,pose){if(trURL.want||!av3Attach.ready)return _tu.apply(this,arguments);let u=null;try{u=av3URL(L,288,432,{yaw:view==="b"?Math.PI-.42:.0,pose:pose||"i"})}catch(e){}return u||_tu.apply(this,arguments)}}
// (las funciones de arriba pueden llamarse mientras el juego aún se carga: hasta aquí responden «no disponible»)
av3Attach.ready=1;

// ---------- figuras del modo Exploración sacadas del modelo 3D ----------
// El mismo modelo, en versión «cabezona», se dibuja desde los cuatro lados y con los pasos de andar, y se reduce a la
// rejilla de píxeles del mapa (16×24) quedándose con el color que más abunda en cada casilla. Así el peinado, el gorro,
// la ropa y la mochila son los del entrenador desde cualquier lado. Sin WebGL se usan las figuras de antes.
const CH3={S:6,ok:null};
function ch3Grid(L,dir,fr){if(CH3.ok===false)return null;const S=CH3.S,W=16*S,H=24*S;
  if(!CH3.r){CH3.c=document.createElement("canvas");CH3.c.width=W;CH3.c.height=H;CH3.r=AV3(CH3.c,true);if(!CH3.r){CH3.ok=false;return null}CH3.x=document.createElement("canvas");CH3.x.width=W;CH3.x.height=H;CH3.g=CH3.x.getContext("2d",{willReadFrequently:true});CH3.ok=true}
  CH3.r.draw(L,{yaw:{d:0,l:-Math.PI/2,u:Math.PI,r:Math.PI/2}[dir]||0,chibi:1,walk:fr===1?1:fr===3?-1:0,t:1.2,fov:10,dist:10.1,cy:.82,elev:.09});
  CH3.g.clearRect(0,0,W,H);CH3.g.drawImage(CH3.c,0,0);const D=CH3.g.getImageData(0,0,W,H).data,G=[],MK=[];
  for(let cy=0;cy<24;cy++){const row=[];for(let cx=0;cx<16;cx++){const cnt={},sum={};let n=0;
      for(let y=cy*S;y<cy*S+S;y++)for(let x=cx*S;x<cx*S+S;x++){const i=(y*W+x)*4;if(D[i+3]<140)continue;n++;if(D[i]>190&&D[i+1]<100&&D[i+2]>190){MK.push(x,y);continue}if(D[i]>D[i+1]+60&&D[i+2]>D[i+1]+60&&Math.abs(D[i]-D[i+2])<50)continue;const k=(D[i]>>4)<<8|(D[i+1]>>4)<<4|(D[i+2]>>4);cnt[k]=(cnt[k]||0)+1;const q=sum[k]||(sum[k]=[0,0,0]);q[0]+=D[i];q[1]+=D[i+1];q[2]+=D[i+2]}
      if(n<S*S*.42){row.push(null);continue}let b=null,bn=0;for(const k in cnt)if(cnt[k]>bn){bn=cnt[k];b=k}if(b==null){row.push("eye");continue}const q=sum[b],h=v=>("0"+Math.round(v/bn).toString(16)).slice(-2);row.push("#"+h(q[0])+h(q[1])+h(q[2]))}G.push(row)}
  // ojos: el modelo los pinta de un color de marca; aquí se ponen siempre de una casilla de ancho y dos de alto
  {const eye=typeof chMix==="function"?chMix(TRP.eye[L.ec]||TRP.eye[0],"#101018",.62):"#22222c",put=(a)=>{if(a.length<S*S*.2)return;let sx=0,sy=0;for(let i=0;i<a.length;i+=2){sx+=a[i];sy+=a[i+1]}const n=a.length/2,cx=Math.floor(sx/n/S),r0=Math.round(sy/n/S)-1;for(const r of[r0,r0+1])if(G[r]&&cx>=0&&cx<16&&G[r][cx])G[r][cx]=eye};
    if(MK.length){let mn=1e9,mx=-1;for(let i=0;i<MK.length;i+=2){if(MK[i]<mn)mn=MK[i];if(MK[i]>mx)mx=MK[i]}if(mx-mn>2.2*S){const mid=(mn+mx)/2,A=[],B=[];for(let i=0;i<MK.length;i+=2)(MK[i]<mid?A:B).push(MK[i],MK[i+1]);put(A);put(B)}else put(MK)}
    for(let y=0;y<24;y++)for(let x=0;x<16;x++)if(G[y][x]==="eye")G[y][x]=G[y][x-1]&&G[y][x-1]!==eye?G[y][x-1]:(G[y-1]&&G[y-1][x])||eye}
  // contorno oscuro, como en las figuras de píxel
  const add=[];for(let y=0;y<24;y++)for(let x=0;x<16;x++){if(G[y][x])continue;if((x>0&&G[y][x-1])||(x<15&&G[y][x+1])||(y>0&&G[y-1][x])||(y<23&&G[y+1][x]))add.push([x,y])}
  add.forEach(([x,y])=>{G[y][x]=CH_K});return G}
{const _ov=ovSprite,OVS4={};ovSprite=function(code){if(OVS4[code])return OVS4[code];const old=()=>_ov.call(this,code);if(CH3.ok===false)return old();let L;try{L=trDec(code)}catch(e){return old()}
  const out={},mk=dir=>{let arr=null;Object.defineProperty(out,dir,{enumerable:true,get(){if(!arr){try{const G=[0,1,3].map(f=>{const g=ch3Grid(L,dir,f);if(!g)throw 0;return chCanvas(g,false,0)});arr=[G[0],G[1],G[0],G[2],G[0],G[1],G[0],G[2]]}catch(e){arr=old()[dir]}}return arr}})};
  ["d","l","u","r"].forEach(mk);return OVS4[code]=out}}
