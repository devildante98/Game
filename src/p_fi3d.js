// =====================================================================================
// PESCA EN 3D
// Motor propio con WebGL (sin librerías): lago con olas y brillos del sol, embarcadero, orilla con árboles, montañas,
// juncos y nenúfares, y la caña con su sedal y el flotador. El juego (cuándo pica, los puntos, los Pokémon) es el de
// siempre: aquí solo se dibuja lo que pasa. Si el navegador no tiene WebGL se usa el dibujo plano de antes.
// =====================================================================================
function FI3D(cv){let gl=null;try{gl=cv.getContext("webgl",{antialias:true,alpha:false,powerPreference:"low-power"})||cv.getContext("experimental-webgl")}catch(e){}if(!gl)return null;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
  let pr;try{pr=gl.createProgram();
    gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec3 p;attribute vec3 n;attribute vec3 c;uniform mat4 m;uniform vec3 L;uniform vec3 amb;uniform vec3 sun;uniform vec2 fog;varying vec3 vc;varying float vf;void main(){vec4 q=m*vec4(p,1.);gl_Position=q;float u=step(.01,dot(n,n));float d=max(dot(normalize(n+vec3(0.,0.,.0001)),L),0.);vc=mix(c,c*(amb+sun*d),u);vf=u*clamp((q.w-fog.x)/(fog.y-fog.x),0.,1.);}"));
    gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec3 vc;varying float vf;uniform vec3 fogc;void main(){gl_FragColor=vec4(mix(vc,fogc,vf),1.);}"));
    gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null}catch(e){return null}
  gl.useProgram(pr);const U=k=>gl.getUniformLocation(pr,k),uM=U("m"),uL=U("L"),uA=U("amb"),uS=U("sun"),uF=U("fog"),uFc=U("fogc"),aP=gl.getAttribLocation(pr,"p"),aN=gl.getAttribLocation(pr,"n"),aC=gl.getAttribLocation(pr,"c");
  const MAXV=120000,buf=new Float32Array(MAXV*9),vbo=gl.createBuffer();let nv=0;gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,buf.byteLength,gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(aP);gl.enableVertexAttribArray(aN);gl.enableVertexAttribArray(aC);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,36,0);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,36,12);gl.vertexAttribPointer(aC,3,gl.FLOAT,false,36,24);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  // ---------- matrices ----------
  const I=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  const mul=(a,b)=>{const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o};
  const T=(m,x,y,z)=>{const o=new Float32Array(m);o[12]=m[0]*x+m[4]*y+m[8]*z+m[12];o[13]=m[1]*x+m[5]*y+m[9]*z+m[13];o[14]=m[2]*x+m[6]*y+m[10]*z+m[14];return o};
  const RX=(m,a)=>{const c=Math.cos(a),s=Math.sin(a);return mul(m,new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]))};
  const RY=(m,a)=>{const c=Math.cos(a),s=Math.sin(a);return mul(m,new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]))};
  const persp=(fov,asp,n,f)=>{const t=1/Math.tan(fov/2),o=new Float32Array(16);o[0]=t/asp;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o};
  const look=(e,c)=>{let zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2],l=Math.hypot(zx,zy,zz);zx/=l;zy/=l;zz/=l;let xx=zz,xy=0,xz=-zx;l=Math.hypot(xx,xz)||1;xx/=l;xz/=l;const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
    return new Float32Array([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1])};
  // ---------- primitivas ----------
  const hex=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255],HC={},C=h=>HC[h]||(HC[h]=hex(h));
  const mix=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
  const V=(x,y,z,nx,ny,nz,c)=>{if(nv>=MAXV)return;const i=nv*9;buf[i]=x;buf[i+1]=y;buf[i+2]=z;buf[i+3]=nx;buf[i+4]=ny;buf[i+5]=nz;buf[i+6]=c[0];buf[i+7]=c[1];buf[i+8]=c[2];nv++};
  const FACES=[[0,0,1,[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[0,0,-1,[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],[1,0,0,[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],[-1,0,0,[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[0,1,0,[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],[0,-1,0,[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]];
  const box=(m,hx,hy,hz,c,top)=>{for(let f=0;f<6;f++){const F=FACES[f],nx=m[0]*F[0]+m[4]*F[1]+m[8]*F[2],ny=m[1]*F[0]+m[5]*F[1]+m[9]*F[2],nz=m[2]*F[0]+m[6]*F[1]+m[10]*F[2],cc=f===4&&top?top:c,P=[];
      for(let k=3;k<7;k++){const q=F[k],x=q[0]*hx,y=q[1]*hy,z=q[2]*hz;P.push(m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14])}
      V(P[0],P[1],P[2],nx,ny,nz,cc);V(P[3],P[4],P[5],nx,ny,nz,cc);V(P[6],P[7],P[8],nx,ny,nz,cc);V(P[0],P[1],P[2],nx,ny,nz,cc);V(P[6],P[7],P[8],nx,ny,nz,cc);V(P[9],P[10],P[11],nx,ny,nz,cc)}};
  const M0=I(),bx=(x,y,z,hx,hy,hz,c,top)=>{M0[12]=x;M0[13]=y;M0[14]=z;box(M0,hx,hy,hz,c,top)};
  const ut=(a,b,c2,col,c2b,c3b)=>{V(a[0],a[1],a[2],0,0,0,col);V(b[0],b[1],b[2],0,0,0,c2b||col);V(c2[0],c2[1],c2[2],0,0,0,c3b||col)};
  const flat=(p0,p1,p2,p3,c0,c1)=>{ut(p0,p1,p2,c0,c0,c1);ut(p0,p2,p3,c0,c1,c1)};
  const pyr=(x,z,w,d,h,col,cap)=>{const a=[x-w,0,z-d],b=[x,0,z-d-w*.35],c2=[x+w,0,z-d],t=[x,h,z],lt=mix(col,[1,1,1],.1),dkc=mix(col,[0,0,0],.2);ut(a,b,t,lt);ut(b,c2,t,dkc);
    if(cap){const k=.7,L2=p=>[p[0]+(t[0]-p[0])*k,p[1]+(t[1]-p[1])*k,p[2]+(t[2]-p[2])*k-.1],A=L2(a),Bq=L2(b),Cq=L2(c2),tt=[t[0],t[1],t[2]-.1];ut(A,Bq,tt,cap);ut(Bq,Cq,tt,mix(cap,[0,0,0],.14))}};
  // segmento grueso entre dos puntos (caña, sedal, juncos)
  const seg=(a,b,r,c)=>{const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],L=Math.hypot(dx,dy,dz)||1e-4;let m=T(I(),(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);
    m=RY(m,Math.atan2(dx,dz));m=RX(m,-Math.asin(Math.max(-1,Math.min(1,dy/L))));box(m,r,r,L/2,c)};
  // anillo plano sobre el agua (ondas)
  const ringW=(x,z,y,r,w,c,n)=>{n=n||22;for(let i=0;i<n;i++){const a0=i/n*Math.PI*2,a1=(i+1)/n*Math.PI*2,P=(a,rr)=>[x+Math.cos(a)*rr,y,z+Math.sin(a)*rr];const A=P(a0,r-w),B=P(a1,r-w),C2=P(a1,r+w),D=P(a0,r+w);ut(A,B,C2,c);ut(A,C2,D,c)}};
  const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
  // ---------- hora del día (al azar en cada partida) ----------
  const TODS=[{top:"#5fa8ec",hor:"#cfe8ff",sun:[1,.97,.82],sunY:26,amb:[.62,.64,.7],lit:[.6,.58,.5],w1:"#2f7fc4",w2:"#57a9e0",sx:-18},
              {top:"#ff9a6a",hor:"#ffd9a0",sun:[1,.8,.5],sunY:9,amb:[.6,.52,.5],lit:[.78,.55,.38],w1:"#2c5590",w2:"#7a9ad0",sx:8},
              {top:"#1b2350",hor:"#4a4f8a",sun:[.95,.94,.82],sunY:24,amb:[.38,.42,.62],lit:[.3,.34,.5],w1:"#142a52",w2:"#2e4a86",sx:-14,night:1}];
  const TOD=TODS[FI3D.tod!=null?FI3D.tod:Math.random()<.5?0:Math.random()<.65?1:2];
  const top=C(TOD.top),hor=C(TOD.hor),W1=C(TOD.w1),W2=C(TOD.w2);
  // ---------- estado de la pesca ----------
  const S={st:"idle",t0:0,nib:-9,tx:1.2,tz:15,splash:[],fish:{a:0,r:6},ex:null,catch:null,shake:0};
  let vw=1,vh=1,VP=I(),run=false,t0=performance.now();
  const now=()=>(performance.now()-t0)/1000;
  // olas: suma de senos (alto y pendiente)
  const wave=(x,z,t)=>.07*Math.sin(x*.55+t*1.3)+.05*Math.sin(z*.7-t*1.7+x*.2)+.03*Math.sin((x+z)*1.3+t*2.4);
  const waveN=(x,z,t)=>{const e=.05,hx=(wave(x+e,z,t)-wave(x-e,z,t))/(2*e),hz=(wave(x,z+e,t)-wave(x,z-e,t))/(2*e),l=Math.hypot(hx,1,hz);return[-hx/l,1/l,-hz/l]};
  // posición del flotador según el estado
  // la cámara está en el origen mirando hacia +z; la x negativa queda a la derecha de la pantalla
  const rodPose=t=>{const st=S.st,dt=t-S.t0;let pitch=0,bend=0;// pitch: >0 = caña hacia atrás
    if(st==="cast"&&dt<.25)pitch=dt/.25*.9;else if(st==="cast"&&dt<.5)pitch=.9-(dt-.25)/.25*1.25;else if(st==="cast"||st==="wait")pitch=-.35;
    else if(st==="bite"){pitch=-.15+Math.sin(t*24)*.05;bend=.55+Math.sin(t*19)*.12}else if(st==="got"){pitch=Math.min(.7,dt*2.2)-.15;bend=Math.max(0,.6-dt*.8)}else if(st==="miss")pitch=-.35+Math.min(.5,dt*1.5);
    return{pitch,bend}};
  const rodPts=(t)=>{const{pitch,bend}=rodPose(t),base=[-1.25,1.05,1.6],L=2.7,P=[];for(let i=0;i<=8;i++){const u=i/8,a=.95-pitch-bend*u*u*1.4;P.push([base[0]+u*.25,base[1]+Math.sin(a)*L*u*.92,base[2]+Math.cos(a)*L*u*.9])}return P};
  const bobPos=(t,tip)=>{const st=S.st,dt=t-S.t0,wy=wave(S.tx,S.tz,t);
    if(st==="idle")return[tip[0],tip[1]-.7+Math.sin(t*2)*.03,tip[2],0];
    if(st==="cast"){const k=Math.min(1,Math.max(0,(dt-.35)/.55));if(dt<.35)return[tip[0],tip[1]-.7,tip[2],0];const e=k,x=tip[0]+(S.tx-tip[0])*e,z=tip[2]+(S.tz-tip[2])*e,y=tip[1]-.7+(wy+.08-(tip[1]-.7))*e+Math.sin(e*Math.PI)*2.4;if(k>=1&&!S.landed){S.landed=1;S.splash.push({x:S.tx,z:S.tz,t,k:1})}return[x,y,z,0]}
    if(st==="wait"){const nb=t-S.nib<.3?-.12*Math.sin((t-S.nib)/.3*Math.PI):0;return[S.tx,wy+.08+Math.sin(t*3)*.015+nb,S.tz,0]}
    if(st==="bite")return[S.tx+Math.sin(t*31)*.05,wy-.18-.12*Math.abs(Math.sin(t*14)),S.tz,1];
    if(st==="got"||st==="miss"){const k=Math.min(1,dt/.75),x=S.tx+(tip[0]-S.tx)*k,z=S.tz+(tip[2]-S.tz)*k,y=wy+.08+(tip[1]-.7-wy)*k+Math.sin(k*Math.PI)*1.2;return[x,y,z,0]}
    return[S.tx,wy+.08,S.tz,0]};
  const R={ok:true,
    resize(w,h,dpr){vw=w;vh=h;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);gl.viewport(0,0,cv.width,cv.height)},
    // avisos del juego: cast, nib, bite, got, miss, idle
    ev(k){const t=now();if(k==="nib"){S.nib=t;S.splash.push({x:S.tx,z:S.tz,t,k:.35});return}
      if(k==="cast"){S.tx=-2.6+Math.random()*5.2;S.tz=11+Math.random()*7;S.landed=0;S.fish={a:Math.random()*6.28,r:5+Math.random()*2}}
      if(k==="bite"){S.splash.push({x:S.tx,z:S.tz,t,k:.8});S.shake=.25}if(k==="got"){S.splash.push({x:S.tx,z:S.tz,t,k:1.6});S.shake=.35}if(k==="miss"&&S.st==="bite")S.splash.push({x:S.tx,z:S.tz,t,k:.5});
      S.st=k;S.t0=t},
    // posición en pantalla (0-1) del flotador, para colocar el «¡!» y el Pokémon que sale del agua
    bob:[.6,.5],
    draw(){nv=0;const t=now(),night=!!TOD.night;
      // ---------- cámara: de pie en el embarcadero ----------
      const shk=S.shake>0?S.shake:0;S.shake=Math.max(0,S.shake-.016);
      const eye=[0+(Math.random()-.5)*shk*.2,2.45+(Math.random()-.5)*shk*.2,-.6],tg=[.1,-.1,14];VP=mul(persp(52*Math.PI/180,vw/vh,.1,200),look(eye,tg));
      // ---------- cielo ----------
      flat([-200,-5,150],[200,-5,150],[200,90,150],[-200,90,150],hor,top);
      if(night){for(let i=0;i<70;i++){const x=(hash(i)-.5)*260,y=12+hash(i+7)*70,s=.2+hash(i+3)*.3,c=mix(top,[1,1,1],.5+.5*Math.sin(t*2+i));flat([x-s,y-s,149],[x+s,y-s,149],[x+s,y+s,149],[x-s,y+s,149],c,c)}}
      {const sx=TOD.sx,sy=TOD.sunY,sc=TOD.sun,g2=mix(sc,hor,.6),oct=(r,z,c)=>{for(let k=0;k<12;k++){const a=k*Math.PI/6,b2=a+Math.PI/6;ut([sx,sy,z],[sx+Math.cos(a)*r,sy+Math.sin(a)*r,z],[sx+Math.cos(b2)*r,sy+Math.sin(b2)*r,z],c)}};oct(13,148.5,g2);oct(7,148,sc)}
      // nubes
      const cc=night?mix(top,[1,1,1],.15):mix([1,1,1],hor,.15);for(let i=0;i<8;i++){const x=((hash(i+20)-.5)*220+t*.6)%240-120,y=22+hash(i+30)*24,z=120+hash(i)*20;bx(x,y,z,7+hash(i)*5,1,2,mix(cc,top,.2),cc);bx(x+4,y+1.2,z-1,4.5,1,1.5,cc)}
      // ---------- montañas y orilla del fondo ----------
      const mt=night?C("#2a3360"):TOD.sunY<12?C("#9a7a8c"):C("#7c90bc"),mcol=mix(mt,hor,.3);for(let i=0;i<12;i++){const x=(i-6)*22+(hash(i+2)-.5)*10,h=14+hash(i+11)*16;pyr(x,118+hash(i)*10,15+hash(i+5)*8,9,h,mix(mcol,[0,0,0],hash(i+9)*.12),h>22?mix([1,1,1],hor,.25):null)}
      const shore=night?C("#1d3a2a"):C("#4f8f4a"),sand=night?C("#5a5560"):C("#d8c79a");bx(0,.05,96,140,.35,14,shore,shore);bx(0,.02,82.5,140,.25,1.5,sand,sand);
      for(let i=0;i<46;i++){const x=(i-23)*5.6+(hash(i)-.5)*3,z=88+hash(i+4)*14,s=1.3+hash(i+9)*1.6,lf=night?C("#173a2a"):mix(C("#2f7a42"),C("#5aa860"),hash(i+3));bx(x,1.2*s,z,.22*s,1.2*s,.22*s,C("#6a4630"));bx(x,2.6*s,z,1.2*s,.8*s,1.2*s,lf,mix(lf,[1,1,1],.15));bx(x,3.6*s,z,.8*s,.6*s,.8*s,mix(lf,[1,1,1],.08))}
      // ---------- agua ----------
      const L=[.35,.62,.7],ll=Math.hypot(...L),Ln=[L[0]/ll,L[1]/ll,L[2]/ll],sunDir=[TOD.sx/150,TOD.sunY/150,1],sl=Math.hypot(...sunDir);
      const zs=[];{let z=1.2;while(z<84){zs.push(z);z+=.55+z*.06}zs.push(84)}const xs=[];for(let x=-44;x<=44;x+=2.2)xs.push(x);
      const wv=(x,z)=>{const y=wave(x,z,t)*(z<40?1:.6),n=waveN(x,z,t),depth=Math.min(1,z/60);let c=mix(W2,W1,Math.min(1,.25+depth*.9));
        // brillo del sol sobre las olas: más fuerte hacia donde está el sol
        const vx=-x,vy=2.6-y,vz=-z,vl=Math.hypot(vx,vy,vz),hx=sunDir[0]/sl+vx/vl,hy=sunDir[1]/sl+vy/vl,hz=sunDir[2]/sl+vz/vl,hl=Math.hypot(hx,hy,hz),sp=Math.pow(Math.max(0,(n[0]*hx+n[1]*hy+n[2]*hz)/hl),night?60:28);
        c=mix(c,TOD.sun,Math.min(1,sp*(night?.7:1.1)));return[x,y,z,c]};
      for(let j=0;j<zs.length-1;j++){const r0=xs.map(x=>wv(x,zs[j])),r1=xs.map(x=>wv(x,zs[j+1]));for(let i=0;i<xs.length-1;i++){const a=r0[i],b=r0[i+1],c2=r1[i+1],d=r1[i];ut(a,b,c2,a[3],b[3],c2[3]);ut(a,c2,d,a[3],c2[3],d[3])}}
      // reflejo del sol
      for(let i=0;i<14;i++){const z=24+i*4.5,w=(.4+i*.12)*(1+.3*Math.sin(t*2+i)),x=TOD.sx*z/150+Math.sin(t*1.3+i)*.4,c=mix(TOD.sun,W1,.15+i*.04);flat([x-w,wave(x,z,t)+.02,z-.5],[x+w,wave(x,z,t)+.02,z-.5],[x+w,wave(x,z,t)+.02,z+.5],[x-w,wave(x,z,t)+.02,z+.5],c,c)}
      // nenúfares y juncos
      for(let i=0;i<12;i++){const x=(hash(i+50)-.5)*16,z=6+hash(i+60)*20,y=wave(x,z,t)+.03,r=.35+hash(i+70)*.3,lc=night?C("#1e4a34"):C("#3f9a52");for(let k=0;k<10;k++){const a0=k/10*6.28+.4,a1=(k+1)/10*6.28+.4;if(k===0)continue;ut([x,y,z],[x+Math.cos(a0)*r,y,z+Math.sin(a0)*r],[x+Math.cos(a1)*r,y,z+Math.sin(a1)*r],lc)}
        if(i%4===0){const pc=C("#ffb6d6");bx(x,y+.08,z,.1,.07,.1,pc,C("#fff0f6"))}}
      for(const side of[-1,1])for(let i=0;i<16;i++){const x=side*(5.5+hash(i+side*9)*5),z=2+hash(i+side*3)*10,h=.8+hash(i)*1.2,sw=Math.sin(t*1.5+i)*.08,rc=night?C("#2a4a2a"):C("#5a8a3a");seg([x,-.2,z],[x+sw,h,z],.03,rc);if(i%3===0)seg([x+sw,h,z],[x+sw*1.2,h+.3,z],.07,C("#7a4a2a"))}
      // pez que se acerca (sombra bajo el agua) mientras esperas
      if(S.st==="wait"||S.st==="bite"){const dt=t-S.t0,k=S.st==="bite"?1:Math.min(1,dt/3),r=S.fish.r*(1-k)+.5,a=S.fish.a+t*.6,fx=S.tx+Math.cos(a)*r,fz=S.tz+Math.sin(a)*r*.6,y=-.12,fc=mix(W1,[0,0,0],.45),dir=a+Math.PI/2;
        const m=RY(T(I(),fx,y,fz),-dir);for(let k2=0;k2<8;k2++){const a0=k2/8*6.28,a1=(k2+1)/8*6.28,P=aa=>{const q=[Math.cos(aa)*.25,Math.sin(aa)*.7];return[m[12]+m[0]*q[0]+m[8]*q[1],y,m[14]+m[2]*q[0]+m[10]*q[1]]};ut([m[12],y,m[14]],P(a0),P(a1),fc)}}
      // ondas y salpicaduras
      S.splash=S.splash.filter(s=>t-s.t<1.6);for(const s of S.splash){const e=t-s.t;for(let k=0;k<3;k++){const ee=e-k*.22;if(ee<0)continue;const r=.2+ee*1.6*s.k,a=Math.max(0,1-ee/1.2);ringW(s.x,s.z,wave(s.x,s.z,t)+.03,r,.035+.02*s.k,mix(W2,[1,1,1],.75*a))}
        if(e<.6){const n=Math.round(8*s.k);for(let k=0;k<n;k++){const a=k/n*6.28+s.t,v=1.4*s.k,px=s.x+Math.cos(a)*v*e*.8,pz=s.z+Math.sin(a)*v*e*.5,py=wave(s.x,s.z,t)+v*e*1.6-4.9*e*e;if(py<-.1)continue;bx(px,py,pz,.06,.06,.06,mix(W2,[1,1,1],.8))}}}
      // ---------- embarcadero ----------
      const wd=night?C("#5a4232"):C("#9a6a3e"),wd2=night?C("#47331f"):C("#7c5230"),wd3=night?C("#6a503a"):C("#b8844e");
      for(let i=0;i<6;i++){const z=-1+i*.62;bx(0,.35,z,2.1,.06,.28,i%2?wd:wd2,i%2?wd3:wd)}for(const sx of[-2,2])for(const z of[-.6,1.9]){bx(sx,-.4,z,.12,.8,.12,wd2,wd)}
      bx(1.4,.62,1.6,.32,.22,.25,C("#3a72b8"),C("#4f8ad0"));bx(1.4,.86,1.6,.34,.04,.27,C("#e8eef6"));// caja de aparejos
      // ---------- caña, sedal y flotador ----------
      const RP=rodPts(t),tip=RP[RP.length-1];for(let i=0;i<RP.length-1;i++)seg(RP[i],RP[i+1],.032-.024*i/8,i<2?C("#2a2a30"):i<3?C("#c9a24a"):C("#3a6ab8"));
      {const reel=RP[1];bx(reel[0]+.1,reel[1]-.05,reel[2],.08,.1,.1,C("#c8ccd4"),C("#e8ecf2"))}
      const bp=bobPos(t,tip);{// sedal con algo de caída
        const n=10,lc=night?[.85,.88,.95]:[.97,.97,.99];let prev=tip;for(let i=1;i<=n;i++){const u=i/n,sag=(S.st==="wait"||S.st==="bite")?Math.sin(u*Math.PI)*.35:0,q=[tip[0]+(bp[0]-tip[0])*u,tip[1]+(bp[1]-tip[1])*u-sag,tip[2]+(bp[2]-tip[2])*u];seg(prev,q,.012,lc);prev=q}}
      {const m=T(I(),bp[0],bp[1],bp[2]),k=Math.min(1.9,.38+bp[2]*.085);box(T(m,0,.07*k,0),.11*k,.07*k,.11*k,C("#e63950"),C("#ff6a78"));box(T(m,0,-.04*k,0),.11*k,.05*k,.11*k,C("#f4f4f8"));box(T(m,0,.17*k,0),.025*k,.06*k,.025*k,C("#222228"))}
      // posición del flotador en pantalla
      {const x=bp[0],y=bp[1]+.4,z=bp[2],w=VP[3]*x+VP[7]*y+VP[11]*z+VP[15];if(w>0)R.bob=[(VP[0]*x+VP[4]*y+VP[8]*z+VP[12])/w*.5+.5,1-((VP[1]*x+VP[5]*y+VP[9]*z+VP[13])/w*.5+.5)]}
      // ---------- a la GPU ----------
      gl.clearColor(hor[0],hor[1],hor[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uM,false,VP);gl.uniform3f(uL,Ln[0],Ln[1],-Ln[2]);gl.uniform3fv(uA,TOD.amb);gl.uniform3fv(uS,TOD.lit);gl.uniform2f(uF,40,140);gl.uniform3fv(uFc,hor);
      gl.bufferSubData(gl.ARRAY_BUFFER,0,buf.subarray(0,nv*9));gl.drawArrays(gl.TRIANGLES,0,nv)},
    // bucle propio: dibuja mientras el lienzo esté en la página
    start(onFrame){if(run)return;run=true;const loop=()=>{if(!cv.isConnected){run=false;return}requestAnimationFrame(loop);if(document.hidden)return;try{R.draw();if(onFrame)onFrame(R.bob)}catch(e){}};requestAnimationFrame(loop)}};
  return R}
