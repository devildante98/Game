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
    gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec3 vn;varying vec3 vc;uniform vec3 L;void main(){float u=step(.01,dot(vn,vn));vec3 n=normalize(vn+vec3(0.,0.,.0001));float d=dot(n,L);float s=smoothstep(-.02,.1,d);float rim=pow(1.-max(n.z,0.),3.)*.1;vec3 lit=vc*(.7+.3*s)+vec3(rim)*s;gl_FragColor=vec4(mix(vc,lit,u),1.);}"));
    gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null}catch(e){return null}
  gl.useProgram(pr);const uM=gl.getUniformLocation(pr,"m"),uL=gl.getUniformLocation(pr,"L"),aP=gl.getAttribLocation(pr,"p"),aN=gl.getAttribLocation(pr,"n"),aC=gl.getAttribLocation(pr,"c");
  const MAXV=140000,buf=new Float32Array(MAXV*9),vbo=gl.createBuffer();let nv=0;gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,buf.byteLength,gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(aP);gl.enableVertexAttribArray(aN);gl.enableVertexAttribArray(aC);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,36,0);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,36,12);gl.vertexAttribPointer(aC,3,gl.FLOAT,false,36,24);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  let R0=m4I();// giro del modelo (las normales se dejan en el espacio de la cámara para que la luz no gire con él)
  const V=(x,y,z,nx,ny,nz,c)=>{if(nv>=MAXV)return;const i=nv*9,m=R0;buf[i]=m[0]*x+m[4]*y+m[8]*z+m[12];buf[i+1]=m[1]*x+m[5]*y+m[9]*z+m[13];buf[i+2]=m[2]*x+m[6]*y+m[10]*z+m[14];
    buf[i+3]=m[0]*nx+m[4]*ny+m[8]*nz;buf[i+4]=m[1]*nx+m[5]*ny+m[9]*nz;buf[i+5]=m[2]*nx+m[6]*ny+m[10]*nz;buf[i+6]=c[0];buf[i+7]=c[1];buf[i+8]=c[2];nv++};
  // esfera unidad en rejilla (dos resoluciones)
  const mkS=(S,Rg)=>{const P=[];for(let j=0;j<=Rg;j++){const v=j/Rg*Math.PI,row=[];for(let i=0;i<=S;i++){const u=i/S*Math.PI*2;row.push([Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)])}P.push(row)}return P},SH=mkS(20,12),SL=mkS(10,7);
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
    box(M,hx,hy,hz,c){const F=[[0,0,1,[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[0,0,-1,[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],[1,0,0,[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],[-1,0,0,[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[0,1,0,[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],[0,-1,0,[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]];
      for(const f of F){const nx=M[0]*f[0]+M[4]*f[1]+M[8]*f[2],ny=M[1]*f[0]+M[5]*f[1]+M[9]*f[2],nz=M[2]*f[0]+M[6]*f[1]+M[10]*f[2],Q=[];for(let k=3;k<7;k++){const x=f[k][0]*hx,y=f[k][1]*hy,z=f[k][2]*hz;Q.push([M[0]*x+M[4]*y+M[8]*z+M[12],M[1]*x+M[5]*y+M[9]*z+M[13],M[2]*x+M[6]*y+M[10]*z+M[14]])}
        for(const k of[0,1,2,0,2,3])V(Q[k][0],Q[k][1],Q[k][2],nx,ny,nz,c)}},
    // disco plano sin sombreado (ojos, boca, emblemas), mirando hacia +z de su matriz
    disc(M,rx,ry,c,n){n=n||14;for(let i=0;i<n;i++){const t0=Math.PI*2*i/n,t1=Math.PI*2*(i+1)/n,P3=(x,y)=>V(M[0]*x+M[4]*y+M[12],M[1]*x+M[5]*y+M[13],M[2]*x+M[6]*y+M[14],0,0,0,c);P3(0,0);P3(Math.cos(t0)*rx,Math.sin(t0)*ry);P3(Math.cos(t1)*rx,Math.sin(t1)*ry)}}};
  return{ok:true,cv,
    draw(L,o){o=o||{};nv=0;const w=cv.width,h=cv.height;gl.viewport(0,0,w,h);const zoom=o.zoom||1,cy=o.cy==null?.95:o.cy,dist=(o.dist||5.0)/zoom;
      R0=m4RY(m4I(),o.yaw||0);av3Model(E,L,o);
      const VP=m4Mul(m4Persp(24*Math.PI/180,w/h,.3,30),m4Look([0,cy+.25/zoom,dist],[0,cy,0]));
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uM,false,VP);const l=Math.hypot(.38,.5,.78);gl.uniform3f(uL,.38/l,.5/l,.78/l);
      gl.bufferSubData(gl.ARRAY_BUFFER,0,buf.subarray(0,nv*9));gl.drawArrays(gl.TRIANGLES,0,nv)}}}
// ---------- el modelo ----------
function av3Model(E,L,o){const P=(k,i)=>av3Hex(TRP[k][i]!=null?TRP[k][i]:TRP[k][0]),W=[1,1,1],K=[.1,.09,.12],dk=(c,k)=>av3Mix(c,[0,0,0],k==null?.25:k),lt=(c,k)=>av3Mix(c,W,k==null?.25:k),I=m4I(),T=(x,y,z)=>m4T(I,x,y,z);
  const sk=P("skin",L.sk),hc=P("hair",L.hc),ec=P("eye",L.ec),tc=P("cl",L.tc),ac=P("cl",L.ac),bc=P("cl",L.bc),shc=P("cl",L.sh),hac=P("cl",L.hac),bpc=P("cl",L.bpc),nkc=P("cl",L.nkc),glc=P("cl",L.glc),pcc=P("cl",L.pc),sckc=P("cl",L.sckc),wrc=P("cl",L.wrc);
  const girl=L.b===1,t=o.t||0,br=Math.sin(t*1.6)*.006,top=L.top,bot=L.bot;
  const SH=girl?.158:.18,WA=girl?.108:.128,HIP=girl?.152:.146;
  // ----- piernas, calcetines y calzado -----
  const skirtHem={2:.55,9:.56,13:.55,12:.66,4:.17}[bot],dress=[4,23,26].includes(top),gown=top===26,pantEnd=[1,15].includes(bot)?.6:bot===7?.5:bot===3?.27:skirtHem!=null?1:.1,wide=bot===6?1.28:bot===14?1.12:bot===5?.94:1,
    sockTop=L.sck===3?.8:L.sck===1?.44:L.sck===2?.36:.2,bootTop=[1,5,7,11].includes(L.shs)?.3:L.shs===4?.47:L.shs===6?.2:0,sandal=L.shs===2;
  for(const s of[-1,1]){const x=s*.084,legC=y=>y<bootTop?shc:y>=pantEnd?bc:(y<sockTop&&!sandal)?sckc:sk,rr=(y,r)=>[y,r*(y>=pantEnd?wide*1.05:1),r*(y>=pantEnd?wide*1.05:1),legC(y-.02)];
    const ys=[.87,.7,.5,.36,.22,.1,.075],rs=[.071,.07,.06,.058,.05,.044,.044],R=[];for(let i=0;i<ys.length;i++)R.push(rr(ys[i],rs[i]));
    // cortes de color exactos (bajo del pantalón, calcetín, bota)
    [pantEnd,sockTop,bootTop].forEach(c=>{if(c>.08&&c<.86&&!ys.includes(c)){let i=R.findIndex(q=>q[0]<c);const a=R[i-1],b=R[i],k=(a[0]-c)/(a[0]-b[0]),r=a[1]+(b[1]-a[1])*k;R.splice(i,0,[c,r,r,legC(c-.02)])}});
    R.forEach(q=>{q[3]=legC(q[0]-.02)});E.lathe(T(x,0,0),R,12);
    if(pantEnd>.09&&pantEnd<.8&&skirtHem==null)E.lathe(T(x,0,0),[[pantEnd+.025,.001,.001,lt(bc,.18)],[pantEnd+.025,1,1,lt(bc,.18)]].map((q,i)=>{const b=R.find(z=>z[0]<=pantEnd+.03)||R[0];return[pantEnd+(i?0:.03),b[1]*1.1,b[2]*1.1,lt(bc,.18)]}),12);
    // pie
    const sole=sandal?dk(shc,.2):L.shs===3||L.shs===10||L.shs===8?dk(shc,.45):[.96,.96,.98];
    E.ell(T(x,.028,.05),.064,.028,.142,sole,null,1);if(!sandal){E.ell(T(x,.068,.045),.058,.058,.13,shc,null,1);E.ell(T(x,.05,.16),.044,.03,.034,[0,6,9].includes(L.shs)?[.96,.96,.98]:shc,null,1);
      if([0,6].includes(L.shs))for(let k=0;k<3;k++)E.box(T(x,.112+k*.004,.1-k*.03),.03,.004,.008,W)}
    else{E.ell(T(x,.055,.05),.045,.03,.1,sk,null,1);E.box(T(x,.075,.07),.05,.008,.012,shc);E.box(T(x,.07,0),.05,.008,.012,shc)}}
  // ----- cadera, falda y torso -----
  const stripes=top===14||L.pat===1,crop=top===10,open=[1,8,11,12,15,19,20,25,27].includes(top),hipC=dress?tc:bc;
  E.ell(T(0,.895,0),HIP*1.02,.13,.1,hipC);
  if(skirtHem!=null||dress){const hem=dress?(gown?.14:.5):skirtHem,c=dress?tc:bc,w=hem<.3?.21:hem>.6?.19:.225;E.lathe(I,[[.99,WA*1.02,.088,c],[.86,HIP*1.12,.115,c],[hem+.04,w,w*.82,c],[hem,w*1.03,w*.85,dk(c,.12)]],18);
    if(bot===9||bot===13)for(let i=0;i<12;i++){const a=i/12*Math.PI*2;E.box(m4RY(T(Math.cos(a)*w*.99,hem+.12,Math.sin(a)*w*.82),-a+Math.PI/2),.006,.11,.004,dk(c,.14))}}
  const tr=(y,k)=>{const f=(y-.98)/.38,x=WA+(SH*.93-WA)*Math.min(1,f*1.25),z=.086+.02*Math.sin(Math.min(1,f)*Math.PI)+(girl&&y>1.14&&y<1.27?.012:0);return[y,x*(k||1)+(y>1.1?br:0),z*(k||1)+(y>1.1?br:0)]};
  const band=y=>{if(crop&&y<1.13)return sk;if(stripes)return Math.floor((y-.98)/.062)%2?(top===14?ac:pcc):tc;return tc};
  {const R=[];for(let y=.97;y<1.335;y+=.031){const q=tr(y);R.push([q[0],q[1],q[2],band(y)])}const q=tr(1.34);R.push([1.34,q[1],q[2],band(1.34)]);R.push([1.385,SH*.62,.07,band(1.37)]);R.push([1.405,.062,.056,band(1.39)]);E.lathe(I,R,20)}
  // hombros redondeados
  for(const s of[-1,1])E.ell(T(s*(SH-.005),1.325,0),.05,.045,.058,[6,10].includes(top)?sk:top===3?ac:tc,null,1);
  // chaqueta abierta: se ve la camiseta de dentro; abrigos y batas: faldón
  if(open){const q=tr(1.16,1.04);E.ell(T(0,1.17,q[2]*.55),.05,.19,q[2]*.52,top===12||top===8?lt(ac,.1):ac);E.box(m4RZ(T(-.045,1.33,.075),.5),.012,.05,.012,dk(tc,.15));E.box(m4RZ(T(.045,1.33,.075),-.5),.012,.05,.012,dk(tc,.15))}
  if(top===8||top===12||top===16)E.lathe(I,[[.99,WA*1.1,.1,tc],[.6,HIP*1.25,.13,tc],[.56,HIP*1.27,.132,dk(tc,.12)]],18,null,Math.PI*.62,Math.PI*2.38);
  if(top===2||top===19||top===20)E.ell(T(0,1.4,-.085),.11,.075,.06,dk(tc,.1));
  if(top===18||top===5||top===7||top===17){E.box(m4RZ(T(-.035,1.385,.06),.6),.03,.012,.01,top===18?W:lt(tc,.3));E.box(m4RZ(T(.035,1.385,.06),-.6),.03,.012,.01,top===18?W:lt(tc,.3))}
  if(top===13){E.box(T(0,1.2,.105),.07,.09,.006,bc);for(const s of[-1,1])E.box(T(s*.06,1.33,.09),.012,.07,.006,bc)}
  if(L.pat>1){const q=tr(1.22);E.disc(T(0,1.22,q[2]+.012),.035,.035,pcc,L.pat===2?5:L.pat===4?3:10)}
  if(L.blt>0){E.lathe(I,[[1.0,WA*1.08,.094,dk(bc,.5)],[.975,WA*1.1,.096,dk(bc,.5)]],18);E.box(T(0,.987,.098),.016,.014,.004,[.9,.75,.25]);if(L.blt===2)for(const s of[-1,1]){E.ell(T(s*.085,.975,.07),.02,.02,.02,[.9,.2,.25],null,1)}}
  // ----- brazos -----
  const sleeve=[6,10].includes(top)?0:[1,2,5,8,9,11,12,15,16,17,18,19,20,25,27,28].includes(top)?2:1,arC=top===3?ac:tc;
  for(const s of[-1,1]){const M=m4RX(m4RZ(T(s*(SH+.012),1.325,0),s*.13),Math.sin(t*1.6+s)*.02),ac2=y=>sleeve===2?arC:sleeve===1&&y>-.13?arC:sk,k=sleeve===2?1.12:1;
    E.lathe(M,[[0,.052*k,.052*k,ac2(0)],[-.13,.047*(sleeve?1.12:1),.047*(sleeve?1.12:1),ac2(-.14)],[-.27,.041*k,.041*k,ac2(-.3)],[-.5,.034*k,.034*k,sleeve===2?dk(arC,.12):sk],[-.52,.031,.031,sk]],12);
    E.ell(m4T(M,0,-.57,.005),.034,.056,.04,L.glv===1||L.glv===2||L.glv===4?glc:sk,null,1);
    if(L.glv===3||L.glv===4)E.lathe(M,[[-.4,.036,.036,glc],[-.5,.032,.032,glc]],10);
    if(L.wr>0&&s<0)E.lathe(M,[[-.47,.036,.036,wrc],[-.5,.035,.035,wrc]],10)}
  // ----- cuello y lo que se lleva al cuello -----
  E.lathe(I,[[1.38,.05,.05,sk],[1.49,.046,.046,sk]],12);
  if([1,3].includes(L.nk)){E.ell(T(0,1.41,.005),.085,.035,.075,nkc);E.box(T(.04,1.3,.09),.022,.09,.01,dk(nkc,.1))}
  else if(L.nk===4){E.box(T(0,1.27,.11),.016,.1,.005,nkc);E.box(T(0,1.385,.085),.022,.018,.01,nkc)}
  else if(L.nk===5||L.nk===11||L.nk===8){for(const s of[-1,1])E.ell(T(s*.03,1.385,.085),.03,.02,.012,nkc,null,1);E.ell(T(0,1.385,.09),.012,.012,.012,dk(nkc),null,1)}
  else if(L.nk>0)E.lathe(I,[[1.4,.06,.058,nkc],[1.385,.064,.062,nkc]],14);
  // ----- cabeza -----
  const HS=1.46,hy=1.445+(L.fs===1?.134:.128)*HS*.93,hrx=L.fs===2?.118:L.fs===1?.108:.114,hry=L.fs===1?.134:.128,hrz=.118,HM=m4S(m4RX(T(0,hy,0),Math.sin(t*.9)*.015),HS);
  E.ell(HM,hrx,hry,hrz,sk);for(const s of[-1,1])E.ell(m4T(HM,s*hrx,-.012,-.005),.02,.034,.024,sk,null,1);
  const zs=(x,y)=>hrz*Math.sqrt(Math.max(.02,1-(x/hrx)*(x/hrx)-(y/hry)*(y/hry))),F=(x,y,dz,ry)=>m4RY(m4T(HM,x,y,zs(x,y)+(dz||.003)),ry||0);
  // ojos grandes de anime
  const blink=(t%3.7)>3.58||L.ey===5,es=L.ey===1||L.ey===4?1.14:L.ey===2||L.ey===6?.9:1,lash=dk(hc,.6);
  for(const s of[-1,1]){const ex=s*.047,ey=-.012,ry=s*.36;
    if(blink)E.box(F(ex,ey,.004,ry),.03*es,.005,.002,K);
    else{E.disc(F(ex,ey,.003,ry),.031*es,.04*es,[.99,.99,1]);E.disc(F(ex+s*-.003,ey-.004,.005,ry),.023*es,.032*es,dk(ec,.25));E.disc(F(ex+s*-.003,ey-.006,.006,ry),.019*es,.027*es,lt(ec,.12));E.disc(F(ex+s*-.003,ey-.016,.0065,ry),.013*es,.013*es,lt(ec,.4),10);E.disc(F(ex+s*-.003,ey-.004,.007,ry),.009*es,.015*es,[.08,.07,.1]);E.disc(F(ex+s*-.003+.008,ey+.012,.009,ry),.007*es,.008*es,W,8);
      E.box(m4RZ(F(ex,ey+.038*es,.006,ry),s*(L.ey===2||L.ey===6?-.22:-.08)),.034*es,.007,.002,K);if(L.ey===7)for(let k=0;k<3;k++)E.box(m4RZ(F(ex+s*(.02+k*.008),ey+.04*es+k*.002,.006,ry),s*-.9),.008,.003,.002,K)}
    // cejas
    const bt={0:-.1,1:-.1,2:-.05,3:.35,4:-.35}[L.brw]||0;E.box(m4RZ(F(ex,ey+.066,.005,ry),s*bt),.027,L.brw===1?.006:L.brw===2?.0022:.0036,.002,av3Mix(lash,sk,.15));
    if(L.bl===1||[4,5].includes(L.mk))E.disc(F(s*.07,-.05,.004,s*.6),.02,.012,av3Mix(sk,[1,.5,.55],.45),10);
    if(L.bl===2)for(let k=0;k<3;k++)E.disc(F(s*(.055+k*.011),-.04-(k%2)*.008,.004,s*.5),.003,.003,dk(sk,.3),6)}
  if(L.bl===3)E.box(F(.06,-.05,.004,.5),.016,.007,.002,[.95,.85,.7]);if(L.bl===4)E.disc(F(.05,-.075,.004,.4),.004,.004,dk(sk,.6),6);
  // nariz y boca
  E.disc(F(0,-.04,.004),.006,.004,dk(sk,.22),8);
  {const mc=[1,4].includes(L.mk)?P("cl",L.mkc):dk(sk,.55),my=-.078;if(L.mo===2||L.mo===5)E.disc(F(0,my,.004),.014,L.mo===5?.012:.016,[.45,.12,.15],10);
    else{E.box(F(0,my,.004),.018,.003,.002,mc);if(L.mo===0||L.mo===3||L.mo===4||L.mo===6)for(const s of[-1,1])E.box(m4RZ(F(s*.021,my+.004,.004),s*.6),.006,.003,.002,mc);if(L.mo===4)E.disc(F(0,my-.008,.005),.007,.008,[.95,.45,.5],8);if(L.mo===6)E.box(F(.008,my-.006,.005),.003,.005,.002,W)}}
  // barba
  if(L.brd===1)E.ell(HM,hrx*1.012,hry*1.012,hrz*1.012,av3Mix(sk,hc,.28),(x,y,z)=>y<-.38&&z>-.1);
  if(L.brd===2||L.brd===6)E.ell(m4T(HM,0,-.115,.075),.03,.03,.03,hc,null,1);
  if(L.brd===3||L.brd===4||L.brd===6)for(const s of[-1,1])E.ell(F(s*.018,-.062,.002),.02,.008,.008,hc,null,1);
  if(L.brd===4||L.brd===6)E.ell(HM,hrx*1.04,hry*1.05,hrz*1.05,hc,(x,y,z)=>y<-.42&&z>-.25&&!(y>-.72&&Math.abs(x)<.3&&z>.5));
  if(L.brd===6)E.ell(m4T(HM,0,-.17,.06),.06,.07,.045,hc);
  if(L.brd===5)for(const s of[-1,1])E.ell(m4T(HM,s*hrx*.97,-.04,.03),.012,.05,.03,hc,null,1);
  // gafas
  const shades=L.gl===3||L.hat===7||L.hat===13;
  if(L.gl>0||shades){const gc=L.gl===6?[.9,.75,.25]:L.gl===7?[.9,.3,.5]:[.12,.12,.15],one=L.gl===5||L.gl===6;
    for(const s of[-1,1]){if(one&&s>0)continue;const M=F(s*.047,-.012,.022,s*.3);
      if(L.gl===5){E.disc(M,.034,.03,K);E.box(m4RZ(F(0,.03,.02),-.35),.1,.004,.002,K);continue}
      if(shades)E.disc(m4T(M,0,0,-.002),.036,.03,[.1,.1,.14],L.gl===2||L.gl===8?4:14);
      if(L.gl===2||L.gl===8){for(const[a,b,w,h]of[[0,.031,.039,.003],[0,-.031,.039,.003],[-.037,0,.003,.031],[.037,0,.003,.031]])E.box(m4T(M,a,b,0),w,h,.003,gc)}
      else for(let k=0;k<12;k++){const a=k/12*Math.PI*2;E.box(m4RZ(m4T(M,Math.cos(a)*.035,Math.sin(a)*.03,0),a+Math.PI/2),.0095,.0035,.003,gc)}
      E.box(m4T(HM,s*hrx*.99,-.005,.045),.003,.004,.06,gc)}
    if(!one)E.box(F(0,-.008,.024),.014,.004,.003,gc)}
  // ----- pelo -----
  const fam=typeof ovHair==="function"?ovHair(L.hs):"short",mohawk=L.hs===10,hk=typeof chHatKind==="function"?chHatKind(L.hat):"",hatOn=["cap","beanie","wide","top","hard"].includes(hk),hd=dk(hc,.18),hl=lt(hc,.12);
  const cap=(k,c,pred)=>E.ell(HM,hrx*k,hry*k,hrz*k,c,pred);
  if(fam!=="bald"&&!mohawk){const shaved=fam==="shaved";if(fam==="afro"&&!hatOn)E.ell(m4T(HM,0,.035,-.012),hrx*1.5,hry*1.42,hrz*1.5,hc,(x,y,z)=>!(z>.52&&y<.3)&&y>-.62);
    else cap(shaved?1.025:1.085,shaved?av3Mix(sk,hc,.6):hc,(x,y,z)=>y>(z>0?-.38+z*1.02:-.38-(fam==="short"||fam==="spiky"||shaved?0:.12)));
    if(!shaved&&!hatOn&&fam!=="afro"){// flequillo
      for(let k=-2;k<=2;k++)E.ell(m4RZ(m4T(HM,k*.036,.078-Math.abs(k)*.006,zs(k*.036,.078)*1.0+.004),k*-.22+(L.hs%3-1)*.12),.026,.036,.014,k%2?hl:hc,null,1)}
    if(fam==="spiky"&&!hatOn)for(let k=0;k<9;k++){const a=k/9*Math.PI*2,r=k%2?.07:.045;E.lathe(m4RZ(m4RX(m4T(HM,Math.cos(a)*r,.1,Math.sin(a)*r-.01),Math.sin(a)*.55),-Math.cos(a)*.55),[[0,.035,.035,hc],[.09,.004,.004,hl]],8)}
    if(fam==="long"){E.ell(m4T(HM,0,-.17,-.05),hrx*1.1,.24,.075,hd);for(const s of[-1,1])E.ell(m4T(HM,s*hrx*.98,-.13,.012),.03,.16,.05,hc,null,1)}
    if(L.hs===16||L.hs===11)for(const s of[-1,1])E.ell(m4T(HM,s*hrx*.98,-.06,.02),.032,.1,.06,hc,null,1);
    if(fam==="pony"){E.ell(m4RX(m4T(HM,0,L.hs===20?.06:-.02,-.135),L.hs===20?-.5:-.25),.04,.15,.045,hc);E.ell(m4T(HM,0,L.hs===20?.1:.03,-.115),.03,.03,.03,hac,null,1)}
    if(fam==="twin")for(const s of[-1,1]){E.ell(m4RZ(m4T(HM,s*(hrx+.035),-.1,-.02),s*.18),.042,.16,.045,hc);E.ell(m4T(HM,s*(hrx+.005),.02,-.02),.025,.025,.025,hac,null,1)}
    if(fam==="bun"){if(L.hs===13)for(const s of[-1,1])E.ell(m4T(HM,s*.085,.125,-.02),.05,.05,.05,hc);else E.ell(m4T(HM,0,.12,-.075),.06,.06,.06,hc)}
    if(fam==="braid")for(let k=0;k<6;k++)E.ell(m4T(HM,0,-.1-k*.055,-.12+k*.004),.034-k*.003,.034,.034-k*.003,k%2?hd:hc,null,1)}
  else if(mohawk){cap(1.02,av3Mix(sk,hc,.45),(x,y,z)=>y>(z>0?-.3+z:-.35));for(let k=0;k<6;k++)E.ell(m4T(HM,0,.135+Math.sin(k/5*Math.PI)*.035,.085-k*.04),.022,.065,.034,k%2?hl:hc,null,1)}
  if(L.ha>0&&!hatOn)E.ell(m4T(HM,hrx*.75,.07,.07),.022,.016,.012,L.ha===3?[1,.85,.3]:hac,null,1);
  // ----- gorros -----
  if(hk){const rev=L.hat===2,HH=rev?m4RY(HM,Math.PI):HM,hc2=hac,hdk=dk(hac,.22);
    if(hk==="cap"){E.ell(HH,hrx*1.13,hry*1.13,hrz*1.13,hc2,(x,y,z)=>y>.2);E.ell(m4RX(m4T(HH,0,.035,hrz*1.12),.16),hrx*.9,.012,.085,hdk);E.ell(m4T(HH,0,hry*1.14,0),.014,.008,.014,hdk,null,1);
      if(L.hat===1||L.hat===24)E.disc(m4T(HH,0,.085,hrz*1.085),.022,.022,W,10)}
    else if(hk==="beanie"){E.ell(HM,hrx*1.12,hry*1.16,hrz*1.12,hc2,(x,y,z)=>y>.12);E.lathe(HM,[[.06,hrx*1.15,hrz*1.15,lt(hc2,.3)],[.02,hrx*1.16,hrz*1.16,lt(hc2,.3)],[.005,hrx*1.12,hrz*1.12,lt(hc2,.3)]],18);if(L.hat===20||L.hat===3)E.ell(m4T(HM,0,hry*1.2,0),.03,.03,.03,L.hat===20?W:lt(hc2,.3),null,1)}
    else if(hk==="wide"||hk==="top"||hk==="hard"){const tall=hk==="top"?.2:hk==="hard"?.1:.12,br2=hk==="top"?.15:hk==="hard"?.15:L.hat===19?.24:.21,y0=.07;
      E.ell(m4T(HM,0,y0,0),br2,.012,br2,hk==="top"?hc2:hdk);
      if(hk==="hard")E.ell(m4T(HM,0,y0-.02,0),hrx*1.14,.11,hrz*1.14,hc2,(x,y,z)=>y>.05);
      else E.lathe(HM,[[y0,hrx*.98,hrz*.98,ac],[y0+.03,hrx*.97,hrz*.97,hc2],[y0+tall,hrx*(hk==="top"?.95:.82),hrz*(hk==="top"?.95:.82),hc2]],18,true)}
    else if(hk==="band"){E.lathe(HM,[[.085,hrx*1.1,hrz*1.1,hc2],[.055,hrx*1.11,hrz*1.11,hc2]],18);if(L.hat===12)for(let k=0;k<7;k++)E.ell(m4T(HM,Math.cos(k/6*Math.PI)*hrx*1.08,.085,Math.sin(k/6*Math.PI)*hrz*1.08),.018,.018,.018,k%2?[1,.6,.75]:[1,.9,.4],null,1)}
    else if(hk==="bow"){for(const s of[-1,1])E.ell(m4RZ(m4T(HM,s*.045,hry*1.08,0),s*.5),.05,.03,.02,hc2,null,1);E.ell(m4T(HM,0,hry*1.07,0),.018,.018,.018,hdk,null,1)}
    else if(hk==="ears")for(const s of[-1,1])E.lathe(m4RZ(m4T(HM,s*.07,hry*.9,0),s*-.25),[[0,.035,.025,hc],[.07,.003,.003,hc]],8)}
  // ----- mochila -----
  if([1,4,6].includes(L.bp)){E.ell(T(0,1.16,-.15),.118,.165,.075,bpc);E.ell(T(0,1.1,-.215),.085,.075,.03,dk(bpc,.12));for(const s of[-1,1]){E.box(T(s*.085,1.22,.085+br),.014,.15,.005,dk(bpc,.25));E.box(m4RX(T(s*.085,1.38,.0),1.35),.014,.1,.005,dk(bpc,.25))}
    if(L.bp===6){const M=m4RY(T(0,1.2,-.228),Math.PI);E.disc(M,.036,.036,W);E.disc(m4T(M,0,.012,.001),.036,.024,[.9,.2,.25]);E.disc(m4T(M,0,0,.002),.036,.005,K);E.disc(m4T(M,0,0,.003),.01,.01,W,8)}}
  else if([2,5,7].includes(L.bp)){E.ell(T(-.2,.9,.01),.05,.085,.1,bpc);E.box(m4RZ(T(-.02,1.18,.1),.62),.008,.27,.004,dk(bpc,.2));E.box(m4RZ(T(-.02,1.18,-.1),.62),.008,.27,.004,dk(bpc,.2))}
  else if(L.bp===3)E.ell(T(.03,.97,.1),.07,.035,.035,bpc,null,1)}
// ---------- imágenes fijas (tarjeta, perfil…) y vistas vivas (editor y juego base) ----------
const AV3S={c:null,r:null,url:{},n:0};
function av3URL(L,w,h,o){if(!av3Attach.ready)return null;o=o||{};const k=trEnc(L)+"|"+w+"x"+h+"|"+(o.yaw||0)+"|"+(o.zoom||1)+"|"+(o.cy||"");if(AV3S.url[k])return AV3S.url[k];
  if(AV3S.r===null){AV3S.c=document.createElement("canvas");AV3S.r=AV3(AV3S.c,true)||false}if(!AV3S.r)return null;
  if(AV3S.n>120){AV3S.url={};AV3S.n=0}AV3S.c.width=w;AV3S.c.height=h;AV3S.r.draw(L,Object.assign({t:1.2},o));AV3S.n++;return AV3S.url[k]=AV3S.c.toDataURL("image/png")}
// vista viva en un contenedor (se puede girar arrastrando). Cada «clave» conserva su lienzo aunque el contenedor se
// vuelva a crear, para no gastar un contexto WebGL nuevo cada vez. Devuelve false si no hay WebGL.
const AV3V={};
function av3Attach(host,key,getLook,o){if(!av3Attach.ready)return false;o=o||{};if(!host)return false;let v=AV3V[key];
  if(!v){const cv=document.createElement("canvas");cv.className="av3cv";const r=AV3(cv);if(!r){AV3V[key]={bad:1};return false}v=AV3V[key]={cv,r,yaw:o.yaw==null?.35:o.yaw,drag:null,run:false,last:0};
    if(o.drag!==false){cv.style.touchAction="none";cv.style.cursor="grab";cv.addEventListener("pointerdown",e=>{v.drag={x:e.clientX,y0:v.yaw};try{cv.setPointerCapture(e.pointerId)}catch(x){}});
      cv.addEventListener("pointermove",e=>{if(v.drag)v.yaw=v.drag.y0+(e.clientX-v.drag.x)*.012});const up=()=>{v.drag=null};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up)}}
  if(v.bad)return false;v.get=getLook;v.o=o;if(v.cv.parentNode!==host){host.innerHTML="";host.appendChild(v.cv)}
  if(!v.run){v.run=true;v.last=0;const calm=()=>typeof hubCalm==="function"&&hubCalm(),gap=o.fps?1000/o.fps:33;
    const loop=ts=>{if(!v.cv.isConnected){v.run=false;return}requestAnimationFrame(loop);if(document.hidden||v.cv.offsetParent===null)return;if(calm()&&v.last&&!v.drag&&v.sig===v.sig2)return;if(ts-v.last<gap)return;v.last=ts;
      const b=v.cv.parentNode.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1),w=Math.max(40,Math.round(b.width*d)),h=Math.max(60,Math.round(b.height*d));if(v.cv.width!==w||v.cv.height!==h){v.cv.width=w;v.cv.height=h}
      try{const L=v.get();v.sig2=v.sig;v.sig=trEnc(L)+v.yaw;v.r.draw(L,{t:calm()?1.2:ts/1000,yaw:v.yaw,zoom:v.o.zoom,cy:v.o.cy})}catch(e){}};requestAnimationFrame(loop)}
  return true}
// (las funciones de arriba pueden llamarse mientras el juego aún se carga: hasta aquí responden «no disponible»)
av3Attach.ready=1;
