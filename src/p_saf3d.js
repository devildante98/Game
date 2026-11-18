// =====================================================================================
// ZONA SAFARI EN 3D
// Motor propio con WebGL (sin librerías), como la pesca y el paisaje del pueblo: sabana con hierba alta que se mueve
// con el viento, acacias, arbustos, rocas, una charca, una valla, montañas y el cielo según la hora (día, atardecer o
// noche, con estrellas y luciérnagas). El Pokémon salvaje está dentro de la escena (la hierba de delante le tapa los
// pies y tiene sombra), y la Safari Ball, el cebo y la roca se lanzan en 3D.
// Las reglas (probabilidades, huidas, capturas) son las de siempre (p_new.js): aquí solo se dibuja lo que pasa.
// Si el navegador no tiene WebGL, o la imagen del Pokémon no se puede usar en 3D, se ve la Zona Safari plana de antes.
// =====================================================================================
function SAF3D(cv){let gl=null;try{gl=cv.getContext("webgl",{antialias:true,alpha:false,powerPreference:"low-power"})||cv.getContext("experimental-webgl")}catch(e){}if(!gl)return null;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
  // programa 1: triángulos de colores (con luz si tienen normal; sin luz si la normal es 0)
  let pr,pt;try{pr=gl.createProgram();
    gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec3 p;attribute vec3 n;attribute vec3 c;uniform mat4 m;uniform vec3 L;uniform vec3 amb;uniform vec3 sun;uniform vec2 fog;varying vec3 vc;varying float vf;void main(){vec4 q=m*vec4(p,1.);gl_Position=q;float u=step(.01,dot(n,n));float d=max(dot(normalize(n+vec3(0.,0.,.0001)),L),0.);vc=mix(c,c*(amb+sun*d),u);vf=u*clamp((q.w-fog.x)/(fog.y-fog.x),0.,1.);}"));
    gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec3 vc;varying float vf;uniform vec3 fogc;void main(){gl_FragColor=vec4(mix(vc,fogc,vf),1.);}"));
    gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;
    // programa 2: la imagen del Pokémon (cartel de cara a la cámara)
    pt=gl.createProgram();
    gl.attachShader(pt,sh(gl.VERTEX_SHADER,"attribute vec3 p;attribute vec2 uv;uniform mat4 m;varying vec2 vu;void main(){gl_Position=m*vec4(p,1.);vu=uv;}"));
    gl.attachShader(pt,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec2 vu;uniform sampler2D tx;uniform vec4 tint;uniform vec3 lk;uniform float al;void main(){vec4 c=texture2D(tx,vu);if(c.a<.35)discard;gl_FragColor=vec4(mix(c.rgb*lk,tint.rgb,tint.a),c.a*al);}"));
    gl.linkProgram(pt);if(!gl.getProgramParameter(pt,gl.LINK_STATUS))return null}catch(e){return null}
  const U=k=>gl.getUniformLocation(pr,k),uM=U("m"),uL=U("L"),uA=U("amb"),uS=U("sun"),uF=U("fog"),uFc=U("fogc"),aP=gl.getAttribLocation(pr,"p"),aN=gl.getAttribLocation(pr,"n"),aC=gl.getAttribLocation(pr,"c");
  const tM=gl.getUniformLocation(pt,"m"),tT=gl.getUniformLocation(pt,"tint"),tK=gl.getUniformLocation(pt,"lk"),tA=gl.getUniformLocation(pt,"al"),tX=gl.getUniformLocation(pt,"tx"),tP=gl.getAttribLocation(pt,"p"),tU=gl.getAttribLocation(pt,"uv");
  const mkB=n=>({a:new Float32Array(n*9),n:0,max:n,vbo:gl.createBuffer()});const ST=mkB(70000),DY=mkB(60000);let B=ST;
  gl.bindBuffer(gl.ARRAY_BUFFER,DY.vbo);gl.bufferData(gl.ARRAY_BUFFER,DY.a.byteLength,gl.DYNAMIC_DRAW);
  const QB=gl.createBuffer(),QA=new Float32Array(30);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
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
  const V=(x,y,z,nx,ny,nz,c)=>{if(B.n>=B.max)return;const i=B.n*9,a=B.a;a[i]=x;a[i+1]=y;a[i+2]=z;a[i+3]=nx;a[i+4]=ny;a[i+5]=nz;a[i+6]=c[0];a[i+7]=c[1];a[i+8]=c[2];B.n++};
  const ut=(a,b,c2,col,cb,cc)=>{V(a[0],a[1],a[2],0,0,0,col);V(b[0],b[1],b[2],0,0,0,cb||col);V(c2[0],c2[1],c2[2],0,0,0,cc||col)};
  const fn=(a,b,c)=>{const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let x=uy*vz-uz*vy,y=uz*vx-ux*vz,z=ux*vy-uy*vx;const l=Math.hypot(x,y,z)||1;x/=l;y/=l;z/=l;if(y<0){x=-x;y=-y;z=-z}return[x,y,z]};
  const lt=(a,b,c2,col,n)=>{n=n||fn(a,b,c2);V(a[0],a[1],a[2],n[0],n[1],n[2],col);V(b[0],b[1],b[2],n[0],n[1],n[2],col);V(c2[0],c2[1],c2[2],n[0],n[1],n[2],col)};
  const FACES=[[0,0,1,[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[0,0,-1,[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],[1,0,0,[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],[-1,0,0,[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[0,1,0,[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],[0,-1,0,[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]];
  const box=(m,hx,hy,hz,c,top)=>{for(let f=0;f<6;f++){const F=FACES[f],nx=m[0]*F[0]+m[4]*F[1]+m[8]*F[2],ny=m[1]*F[0]+m[5]*F[1]+m[9]*F[2],nz=m[2]*F[0]+m[6]*F[1]+m[10]*F[2],cc=f===4&&top?top:c,P=[];
      for(let k=3;k<7;k++){const q=F[k],x=q[0]*hx,y=q[1]*hy,z=q[2]*hz;P.push(m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14])}
      V(P[0],P[1],P[2],nx,ny,nz,cc);V(P[3],P[4],P[5],nx,ny,nz,cc);V(P[6],P[7],P[8],nx,ny,nz,cc);V(P[0],P[1],P[2],nx,ny,nz,cc);V(P[6],P[7],P[8],nx,ny,nz,cc);V(P[9],P[10],P[11],nx,ny,nz,cc)}};
  const seg=(a,b,r,c)=>{const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],L=Math.hypot(dx,dy,dz)||1e-4;let m=T(I(),(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);
    m=RY(m,Math.atan2(dx,dz));m=RX(m,-Math.asin(Math.max(-1,Math.min(1,dy/L))));box(m,r,r,L/2,c)};
  // esfera de pocos lados (copas, arbustos, rocas); col(nx,ny,nz) da el color de cada cara
  const blob=(x,y,z,rx,ry,rz,col,jit,seed)=>{const R=5,S=9,pt=(i,j)=>{const v=i/R*Math.PI,u=j/S*6.283,k=1+(jit?(hsh(seed+i*7.1,j*3.3+seed)-.5)*jit:0),n=[Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)];return[x+n[0]*rx*k,y+n[1]*ry*k,z+n[2]*rz*k,n]};
    for(let i=0;i<R;i++)for(let j=0;j<S;j++){const a=pt(i,j),b=pt(i+1,j),c2=pt(i+1,j+1),d=pt(i,j+1),n=[(a[3][0]+c2[3][0])/2,(a[3][1]+c2[3][1])/2,(a[3][2]+c2[3][2])/2],cl=typeof col==="function"?col(n):col;
      if(i>0)lt(a,b,c2,cl,n);if(i<R-1)lt(a,c2,d,cl,n)}};
  // cilindro (copas planas de las acacias)
  const cyl=(x,y,z,r,h,n,col,top)=>{for(let k=0;k<n;k++){const a0=k/n*6.283,a1=(k+1)/n*6.283,p0=[x+Math.cos(a0)*r,y,z+Math.sin(a0)*r],p1=[x+Math.cos(a1)*r,y,z+Math.sin(a1)*r],q0=[p0[0],y+h,p0[2]],q1=[p1[0],y+h,p1[2]],am=(a0+a1)/2,nn=[Math.cos(am),0,Math.sin(am)];
    lt(p0,p1,q1,col,nn);lt(p0,q1,q0,col,nn);lt([x,y+h,z],q0,q1,top||col,[0,1,0]);lt([x,y,z],p1,p0,col,[0,-1,0])}};
  const hsh=(i,j)=>{const x=Math.sin(i*127.1+j*311.7)*43758.5453;return x-Math.floor(x)};
  const hash=n=>hsh(n,.5);
  const vn=(x,z)=>{const i=Math.floor(x),j=Math.floor(z),fx=x-i,fz=z-j,u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz),a=hsh(i,j),b=hsh(i+1,j),c=hsh(i,j+1),d=hsh(i+1,j+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
  const fbm=(x,z,o)=>{let s=0,a=.5,f=1;for(let k=0;k<(o||4);k++){s+=a*vn(x*f,z*f);f*=2.03;a*=.5}return s};
  // ---------- hora del día (la del jugador) ----------
  const hr=new Date().getHours(),TI=SAF3D.tod!=null?SAF3D.tod:(hr>=8&&hr<19?0:(hr>=19&&hr<21)||(hr>=6&&hr<8)?1:2);
  const TODS=[{top:"#4f9ae6",hor:"#d6ecff",sun:[1,.97,.84],sunY:30,sx:16,amb:[.62,.63,.66],lit:[.62,.58,.48],unl:[1,1,1],spr:[1,1,1],cl:"#ffffff"},
              {top:"#f08a64",hor:"#ffd49a",sun:[1,.78,.48],sunY:8,sx:-22,amb:[.6,.52,.5],lit:[.8,.56,.38],unl:[1,.86,.76],spr:[1,.9,.8],cl:"#ffd2b8"},
              {top:"#16204a",hor:"#3e4682",sun:[.95,.95,.85],sunY:30,sx:20,amb:[.34,.38,.58],lit:[.28,.32,.48],unl:[.42,.48,.7],spr:[.62,.66,.86],cl:"#5a6290",night:1}];
  const TOD=TODS[TI],night=!!TOD.night,top=C(TOD.top),hor=C(TOD.hor);
  const sd=(()=>{const v=[TOD.sx,TOD.sunY,120],l=Math.hypot(...v);return[v[0]/l,v[1]/l,v[2]/l]})();
  const shd=c=>[c[0]*TOD.unl[0],c[1]*TOD.unl[1],c[2]*TOD.unl[2]];// color sin luz según la hora
  const fogU=(c,z)=>mix(c,hor,Math.max(0,Math.min(1,(z-30)/110)));
  // ---------- terreno ----------
  const PX=0,PZ=6.2;// donde está el Pokémon
  const pond=(x,z)=>Math.exp(-Math.pow((x-8.5)/4.2,2)-Math.pow((z-15)/3,2));
  const clear=(x,z)=>Math.exp(-Math.pow((x-PX)/2.5,2)-Math.pow((z-PZ)/1.9,2));
  const pathD=(x,z)=>z>PZ?9:Math.abs(x-.35*Math.sin(z*.55));
  const gnd=(x,z)=>{let h=.18*Math.sin(x*.33+1)*Math.sin(z*.27)+fbm(x*.15,z*.15,3)*.35-.17;
    const far=Math.max(0,Math.min(1,(z-18)/40));h+=far*far*(2+fbm(x*.025+5,z*.025,4)*16)+Math.max(0,Math.abs(x)-24)*.18*far;
    h*=1-clear(x,z)*.9;h-=pond(x,z)*.9;return h};
  const gN=(x,z)=>{const e=.4,hx=(gnd(x+e,z)-gnd(x-e,z))/(2*e),hz=(gnd(x,z+e)-gnd(x,z-e))/(2*e),l=Math.hypot(hx,1,hz);return[-hx/l,1/l,-hz/l]};
  const G1=C("#86a845"),G2=C("#b9ad5a"),G3=C("#6f9a3c"),DIRT=C("#c7a46c"),DIRT2=C("#b08a55"),MUD=C("#7d6a48");
  const gCol=(x,y,z)=>{let c=mix(G1,G2,Math.min(1,fbm(x*.07,z*.07,3)*1.4-.2));c=mix(c,G3,Math.max(0,fbm(x*.2+9,z*.2,2)-.55)*1.5);
    c=mix(c,mix(DIRT,DIRT2,fbm(x*.6,z*.6,2)),Math.min(1,clear(x,z)*1.5));const pd=pathD(x,z);if(pd<1.1)c=mix(c,DIRT,(1-pd/1.1)*.75);
    const p=pond(x,z);if(p>.25)c=mix(c,MUD,Math.min(1,(p-.25)*2.2));return c};
  // ---------- hierba alta (se mueve cada fotograma) ----------
  const BL=[];const blade=(x,z,h,k)=>{BL.push({x,z,y:gnd(x,z),h,w:.035+hash(BL.length*3.1)*.04,yaw:hash(BL.length*1.7)*3.14,ph:hash(BL.length*5.3)*6.28,lean:(hash(BL.length*2.9)-.5)*.35,c:hash(BL.length*7.7),k:k||0})};
  // delante de la cámara (marco de la escena)
  for(let i=0;i<520;i++){const x=(hash(i+11)-.5)*7.2,z=2+hash(i+12)*1.6;if(Math.abs(x-.35*Math.sin(z*.55))<.6&&hash(i+13)<.9)continue;blade(x,z,(.32+hash(i+14)*.5)*(1+Math.min(1,Math.abs(x)/3)*.5))}
  // alrededor del claro y una mata baja delante del Pokémon que le tapa los pies
  for(let i=0;i<620;i++){const a=hash(i+21)*6.283,r=2.5+hash(i+22)*1.9,x=PX+Math.cos(a)*r*1.2,z=PZ+Math.sin(a)*r;if(z<PZ-.8&&Math.abs(x)<1.8)continue;blade(x,z,(z<PZ?.4:.6)+hash(i+23)*.6)}
  for(let i=0;i<70;i++){const x=PX+(hash(i+31)-.5)*2.6,z=PZ-.75+hash(i+32)*.35;blade(x,z,.18+hash(i+33)*.3,1)}
  // matas sueltas por la sabana
  for(let k=0;k<46;k++){const cx=(hash(k+41)-.5)*44,cz=9+hash(k+42)*34;if(pond(cx,cz)>.2||(Math.abs(cx)<4&&cz<11))continue;const n=14+Math.floor(hash(k+43)*14);for(let i=0;i<n;i++){const a=hash(k*31+i)*6.283,r=hash(k*17+i)*1.3;blade(cx+Math.cos(a)*r,cz+Math.sin(a)*r*.7,(.6+hash(k*13+i)*.8)*(1+cz/40))}}
  // juncos en la orilla de la charca
  for(let i=0;i<60;i++){const a=hash(i+51)*6.283,x=8.5+Math.cos(a)*4.4,z=15+Math.sin(a)*3.1;if(z<13.5&&x<7)continue;blade(x,z,.9+hash(i+52)*.7,2)}
  // ---------- elementos fijos ----------
  const TREES=[[-12,24,1.1],[11,31,1.25],[-27,40,1.4],[23,47,1.3],[-4,52,1.5],[33,29,1.1],[-38,27,1.2],[6,70,1.8],[-20,66,1.7],[40,64,1.6]];
  const BUSH=[[-6.5,12,.9],[5.2,9.5,.7],[-9,17,1.1],[14,22,.9],[-16,14,1],[3,24,.8],[-22,22,1.2],[18,16,.8]];
  const ROCK=[[4.3,8.4,.55],[-4.8,9.6,.75],[-3.6,10.2,.35],[12.5,12,.6],[-18,30,1.6],[26,36,2.2],[-30,52,2.6]];
  const buildStatic=()=>{B=ST;B.n=0;
    // cielo (cilindro alrededor de la cámara) con degradado
    const Rs=150,ys=[-12,4,14,28,48,80,130];for(let i=0;i<ys.length-1;i++)for(let k=0;k<24;k++){const a0=-1.6+k/24*3.2,a1=-1.6+(k+1)/24*3.2,P=(a,y)=>[Math.sin(a)*Rs,y,Math.cos(a)*Rs],cy=y=>mix(hor,top,Math.pow(Math.max(0,Math.min(1,y/120)),.6));
      ut(P(a0,ys[i]),P(a1,ys[i]),P(a1,ys[i+1]),cy(ys[i]),cy(ys[i]),cy(ys[i+1]));ut(P(a0,ys[i]),P(a1,ys[i+1]),P(a0,ys[i+1]),cy(ys[i]),cy(ys[i+1]),cy(ys[i+1]))}
    // sol o luna
    {const c=[sd[0]*140,sd[1]*140,sd[2]*140],r=night?4:6,col=night?[.95,.95,.88]:C("#fff3c4");for(let k=0;k<20;k++){const a0=k/20*6.283,a1=(k+1)/20*6.283;ut(c,[c[0]+Math.cos(a0)*r,c[1]+Math.sin(a0)*r,c[2]-.1],[c[0]+Math.cos(a1)*r,c[1]+Math.sin(a1)*r,c[2]-.1],col)}
      if(!night){const hl=mix(C("#fff3c4"),hor,.55);for(let k=0;k<20;k++){const a0=k/20*6.283,a1=(k+1)/20*6.283;ut([c[0]+Math.cos(a0)*r,c[1]+Math.sin(a0)*r,c[2]+.1],[c[0]+Math.cos(a0)*r*1.8,c[1]+Math.sin(a0)*r*1.8,c[2]+.1],[c[0]+Math.cos(a1)*r*1.8,c[1]+Math.sin(a1)*r*1.8,c[2]+.1],col,hl,hl);ut([c[0]+Math.cos(a0)*r,c[1]+Math.sin(a0)*r,c[2]+.1],[c[0]+Math.cos(a1)*r*1.8,c[1]+Math.sin(a1)*r*1.8,c[2]+.1],[c[0]+Math.cos(a1)*r,c[1]+Math.sin(a1)*r,c[2]+.1],col,hl,col)}}}
    // estrellas
    if(night)for(let i=0;i<220;i++){const a=(hash(i+300)-.5)*3,y=14+hash(i+301)*110,x=Math.sin(a)*145,z=Math.cos(a)*145,s=.25+hash(i+302)*.45,c=mix([.8,.85,1],[1,1,1],hash(i+303));ut([x-s,y,z],[x+s,y,z],[x,y+s*1.7,z],c);ut([x-s,y,z],[x,y-s*1.7,z],[x+s,y,z],c)}
    // montañas lejanas (con neblina)
    for(let layer=0;layer<2;layer++){const z=128-layer*14,base=-4,n=18;let prev=null;for(let i=0;i<=n;i++){const x=-170+i/n*340,h=(layer?14:24)+hash(i*3+layer*50)*(layer?12:22),p=[x,base+h,z];if(prev){const m=[(prev[0]+p[0])/2,base+Math.min(prev[1],p[1])-base-3-hash(i+layer*9)*4,z];
        const cB=mix(night?C("#20284e"):C(layer?"#7d93a8":"#93a6c0"),hor,layer?.35:.55),cT=mix(cB,[1,1,1],night?.05:.12);ut([prev[0],base,z],[p[0],base,z],p,cB,cB,cT);ut([prev[0],base,z],p,prev,cB,cT,cT);ut(prev,p,m,cT,cT,cT);
        if(!layer&&h>38){const sn=night?[.62,.66,.82]:[.96,.97,1];ut([p[0]-4,p[1]-6,z-.2],[p[0]+4,p[1]-6,z-.2],[p[0],p[1],z-.2],sn)}}prev=p}}
    // suelo
    const xs=[];for(let x=-70;x<=70;){xs.push(x);const ax=Math.abs(x);x+=ax<10?.7:ax<22?1.6:ax<40?3:6}xs.push(70);
    const zs=[];for(let z=.6;z<132;){zs.push(z);z+=z<14?.55:z<30?1.2:z<60?2.5:5}zs.push(132);
    const Pg=zs.map(z=>xs.map(x=>[x,gnd(x,z),z])),Ng=zs.map(z=>xs.map(x=>gN(x,z))),Cg=Pg.map(r=>r.map(p=>gCol(p[0],p[1],p[2])));
    for(let j=0;j<zs.length-1;j++)for(let i=0;i<xs.length-1;i++){const a=Pg[j][i],b=Pg[j][i+1],c2=Pg[j+1][i+1],d=Pg[j+1][i],na=Ng[j][i],nb=Ng[j][i+1],nc=Ng[j+1][i+1],nd=Ng[j+1][i];
      V(a[0],a[1],a[2],na[0],na[1],na[2],Cg[j][i]);V(b[0],b[1],b[2],nb[0],nb[1],nb[2],Cg[j][i+1]);V(c2[0],c2[1],c2[2],nc[0],nc[1],nc[2],Cg[j+1][i+1]);
      V(a[0],a[1],a[2],na[0],na[1],na[2],Cg[j][i]);V(c2[0],c2[1],c2[2],nc[0],nc[1],nc[2],Cg[j+1][i+1]);V(d[0],d[1],d[2],nd[0],nd[1],nd[2],Cg[j+1][i])}
    // acacias: tronco que se abre en dos y copa plana en capas
    for(const[x,z,s]of TREES){const y=gnd(x,z),tc=C("#6b4a2e"),lc=night?C("#2f4a2a"):C("#4f7a2c"),lc2=night?C("#3a5832"):C("#6d9a3a");
      seg([x,y-.2,z],[x+.2*s,y+1.9*s,z],.16*s,tc);seg([x+.2*s,y+1.9*s,z],[x-.9*s,y+3*s,z+.2*s],.11*s,tc);seg([x+.2*s,y+1.9*s,z],[x+1.2*s,y+3.1*s,z-.1*s],.11*s,tc);
      cyl(x+.1*s,y+3*s,z,2.6*s,.45*s,10,lc,lc2);cyl(x-.5*s,y+3.4*s,z+.3*s,1.6*s,.35*s,9,lc,lc2);cyl(x+.9*s,y+3.3*s,z-.2*s,1.5*s,.3*s,9,lc,lc2)}
    // arbustos (algunos con bayas)
    for(let i=0;i<BUSH.length;i++){const[x,z,s]=BUSH[i],y=gnd(x,z),bc=night?C("#2c4a2c"):C(i%2?"#4c8a34":"#5a9a3c");blob(x,y+.45*s,z,1.1*s,.75*s,1*s,n=>mix(bc,[0,0,0],Math.max(0,-n[1])*.3),.3,i*9);
      if(i%3===0)for(let k=0;k<6;k++){const a=hash(i*7+k)*6.283,bb=C("#e0405a");blob(x+Math.cos(a)*.95*s,y+(.4+hash(i+k)*.6)*s,z+Math.sin(a)*.85*s-.1,.09,.09,.09,bb)}}
    // rocas
    for(let i=0;i<ROCK.length;i++){const[x,z,s]=ROCK[i],y=gnd(x,z),rc=night?C("#5a5e70"):C("#9a958a");blob(x,y+.25*s,z,s,.62*s,.85*s,n=>mix(rc,[1,1,1],Math.max(0,n[1])*.12),.35,i*13+5)}
    // valla de madera a un lado
    {const wc=night?C("#5a4634"):C("#9a7046"),wc2=night?C("#4a3828"):C("#7e5a36");let prev=null;for(let i=0;i<10;i++){const x=-7.4-i*.15,z=4+i*2.6,y=gnd(x,z);box(T(I(),x,y+.55,z),.09,.6,.09,wc2,wc);
        if(prev){seg([prev[0],prev[1]+.75,prev[2]],[x,y+.75,z],.05,wc);seg([prev[0],prev[1]+.38,prev[2]],[x,y+.38,z],.05,wc)}prev=[x,y,z]}}
    // charca
    {const wy=-.32,W1=night?C("#1d3466"):C("#3f8fc4"),W2=night?C("#2c4a80"):C("#7cc0e6");for(let k=0;k<28;k++){const a0=k/28*6.283,a1=(k+1)/28*6.283,P=(a,r)=>[8.5+Math.cos(a)*4.2*r,wy,15+Math.sin(a)*3*r];
        ut([8.5,wy,15],P(a0,1),P(a1,1),W1,W2,W2)}
      // nenúfares
      for(let i=0;i<6;i++){const x=7+hash(i+80)*3,z=14+hash(i+81)*2.5,r=.28+hash(i+82)*.18,lc=night?C("#24502e"):C("#4fa458");for(let k=1;k<10;k++){const a0=k/10*6.283,a1=(k+1)/10*6.283;ut([x,wy+.01,z],[x+Math.cos(a0)*r,wy+.01,z+Math.sin(a0)*r],[x+Math.cos(a1)*r,wy+.01,z+Math.sin(a1)*r],lc)}}}
  };
  buildStatic();gl.bindBuffer(gl.ARRAY_BUFFER,ST.vbo);gl.bufferData(gl.ARRAY_BUFFER,ST.a.subarray(0,ST.n*9),gl.STATIC_DRAW);
  // ---------- estado ----------
  let vw=1,vh=1,VP=I(),run=false;const t0=performance.now(),now=()=>(performance.now()-t0)/1000;
  const M={key:"",url:"",tex:null,ok:false,fail:false,ld:null,w:2,h:2,nearest:false,at:-9,hop:-9,rock:-9,cap:-9,rel:-9,flee:-9,hide:false,eat:0,ang:0,sh:0};
  const BA={st:"",t0:0,p:[0,0,0],shk:-9,ok:false,from:null,k:"ball"};// la Safari Ball (o el cebo / la roca)
  const TH=[];// cosas lanzadas (cebo y roca)
  const PT=[];// partículas
  const RUS=[];// hierba que se agita
  const TEXC=new Map();
  const ease=k=>1-Math.pow(1-Math.max(0,Math.min(1,k)),3);
  const back=k=>{k=Math.max(0,Math.min(1,k));const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
  const puff=(x,y,z,n,col,sp,life,up)=>{for(let i=0;i<n;i++){const a=Math.random()*6.283,v=sp*(.4+Math.random()*.6);PT.push({x,y,z,vx:Math.cos(a)*v,vy:(up||0)+Math.random()*sp*.6,vz:Math.sin(a)*v*.4,t0:now(),life:life*(.7+Math.random()*.5),col,s:.06+Math.random()*.06,g:up?2.5:0})}};
  const sparkle=(x,y,z,n,col)=>{for(let i=0;i<n;i++){const a=i/n*6.283,v=1.2+Math.random()*.8;PT.push({x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:0,t0:now(),life:.7+Math.random()*.3,col,s:.1,g:0,star:1})}};
  // ---------- imagen del Pokémon ----------
  // se recorta a lo que ocupa el dibujo (sin el borde transparente) para que los pies queden en el suelo
  const loadTex=url=>new Promise(res=>{const c=TEXC.get(url);if(c)return res(c);const im=new Image();im.crossOrigin="anonymous";im.decoding="async";
    im.onload=()=>{try{const W=im.naturalWidth,H=im.naturalHeight,cvs=document.createElement("canvas");cvs.width=W;cvs.height=H;const g=cvs.getContext("2d");g.drawImage(im,0,0);const d=g.getImageData(0,0,W,H).data;
        let x0=W,y0=H,x1=-1,y1=-1;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
        if(x1<0)return res(null);const bw=x1-x0+1,bh=y1-y0+1,o=document.createElement("canvas");o.width=bw;o.height=bh;o.getContext("2d").drawImage(cvs,x0,y0,bw,bh,0,0,bw,bh);
        const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,o);
        const near=W<=160;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,near?gl.NEAREST:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,near?gl.NEAREST:gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        // tamaño: los sprites pequeños (96 px) conservan algo de su tamaño relativo; las imágenes grandes llenan su marco
        const fill=near?.62+.38*Math.min(1,Math.max(bw,bh)/(W*.72)):1,sc=Math.min(2.9/bh,3.7/bw)*fill,r={tex,w:bw*sc,h:bh*sc};
        TEXC.set(url,r);if(TEXC.size>14){const k=TEXC.keys().next().value,v=TEXC.get(k);TEXC.delete(k);if(v&&v.tex!==tex)gl.deleteTexture(v.tex)}res(r)}catch(e){res(null)}};
    im.onerror=()=>res(null);im.src=url});
  // ¿qué Pokémon hay ahora? (lo dice la partida; la imagen se toma de la que ya ha cargado la página)
  const sync=t=>{const s=typeof S!=="undefined"&&S.saf&&S.saf.s,e=s&&s.enc,key=e?e.n+"|"+(e.sh?1:0)+"|"+s.seen:"";M.eat=e?e.eat:0;M.ang=e?e.ang:0;
    if(key!==M.key){M.key=key;M.url="";M.ok=false;M.fail=false;M.hide=false;M.cap=M.rel=M.flee=M.hop=M.rock=-9;M.sh=e&&e.sh?1:0;BA.st="";TH.length=0;if(e){M.at=t+.45;RUS.push({x:PX,z:PZ,t0:t,d:.6,r:2.2})}}
    if(!key||M.url||M.fail)return;
    // imagen: el render en alta definición (parece un modelo 3D); si no hay, o el jugador prefiere los sprites clásicos, el sprite fijo
    const id=window._spr&&window._spr[e.n];if(!id){M.fail=true;return}const shp=M.sh?"shiny/":"",HS=[...new Set([typeof sprHost==="function"?sprHost():SPRU,SPRU,typeof SPRU2!=="undefined"?SPRU2:SPRU])],L=[];
    if(typeof O!=="undefined"&&O.spr!=="px"&&!window._noHD&&typeof HDH!=="undefined"&&HDH[id])for(const h of HS)L.push(h+"other/home/"+shp+id+".png");
    for(const h of HS)L.push(h+shp+id+".png");if(M.sh)L.push(HS[0]+id+".png");
    M.url=L[0];const k0=M.key;(async()=>{for(const u of L){if(M.key!==k0)return;const r=await loadTex(u);if(M.key!==k0)return;if(r){M.tex=r.tex;M.w=r.w;M.h=r.h;M.ok=true;if(M.at<now())M.at=now();if(M.sh)setTimeout(()=>sparkle(PX,M.h*.6,PZ-.3,10,[1,.92,.4]),450);return}}M.fail=true})()};
  // posición y aspecto del Pokémon en cada momento
  const monPose=t=>{let x=PX,y=gnd(PX,PZ),z=PZ,sx=1,sy=1,al=1,tint=[1,1,1,0],vis=!M.hide;
    const br=Math.sin(t*2.6);sy*=1+.028*br;sx*=1-.012*br;
    const ea=t-M.at;if(ea<.55){const k=ea/.55;if(k<0)vis=false;else{y-=M.h*.75*(1-back(k));al=Math.min(1,k*2.5)}}
    const eh=t-M.hop;if(eh>=0&&eh<1.1)y+=Math.abs(Math.sin(eh/1.1*Math.PI*2))*.32*(1-eh/1.4);
    if(M.eat&&eh>1.1){const nd=Math.max(0,Math.sin(t*5.5));sy*=1-.035*nd}
    const er=t-M.rock;if(er>=0&&er<.65){const k=1-er/.65;x+=Math.sin(er*46)*.14*k;tint=[1,.25,.2,.42*k]}
    else if(M.ang){const p=.5+.5*Math.sin(t*7);tint=[1,.3,.25,.12*p]}
    const ec=t-M.cap;if(ec>=0&&ec<.4){const k=ease(ec/.4);tint=[1,1,1,Math.min(1,ec/.12)];sx*=1-k;sy*=1-k;const bp=BA.p;x+=(bp[0]-x)*k;y+=(bp[1]-y-M.h*.5*(1-k))*k*.9;}else if(ec>=.4&&M.cap>M.rel)vis=false;
    const el=t-M.rel;if(el>=0&&el<.4&&M.rel>M.cap){const k=ease(el/.4);tint=[1,1,1,1-k];sx*=k;sy*=k;vis=!M.hide}
    const ef=t-M.flee;if(M.flee>=0&&ef>=0){if(ef<.5){x-=ease(ef/.5)*7;y+=Math.abs(Math.sin(ef*14))*.18;al*=1-ef/.5}else vis=false}
    return{x,y,z,sx,sy,al,tint,vis}};
  // ---------- dibujo ----------
  const sphere=(c,r,colF,rz,rx)=>{const R=7,S=12,cz=Math.cos(rz||0),sz=Math.sin(rz||0),cx=Math.cos(rx||0),sx=Math.sin(rx||0);
    const P=(i,j)=>{const v=i/R*Math.PI,u=j/S*6.283,p=[Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)];let x=p[0]*cz-p[1]*sz,y=p[0]*sz+p[1]*cz,z=p[2];const y2=y*cx-z*sx,z2=y*sx+z*cx;return{w:[c[0]+x*r,c[1]+y2*r,c[2]+z2*r],n:[x,y2,z2],l:p}};
    for(let i=0;i<R;i++)for(let j=0;j<S;j++){const a=P(i,j),b=P(i+1,j),c2=P(i+1,j+1),d=P(i,j+1),l=[(a.l[0]+c2.l[0])/2,(a.l[1]+c2.l[1])/2,(a.l[2]+c2.l[2])/2],col=colF(l,i,j);
      const n=[(a.n[0]+c2.n[0])/2,(a.n[1]+c2.n[1])/2,(a.n[2]+c2.n[2])/2];V(a.w[0],a.w[1],a.w[2],n[0],n[1],n[2],col);V(b.w[0],b.w[1],b.w[2],n[0],n[1],n[2],col);V(c2.w[0],c2.w[1],c2.w[2],n[0],n[1],n[2],col);
      V(a.w[0],a.w[1],a.w[2],n[0],n[1],n[2],col);V(c2.w[0],c2.w[1],c2.w[2],n[0],n[1],n[2],col);V(d.w[0],d.w[1],d.w[2],n[0],n[1],n[2],col)}};
  // Safari Ball: mitad de arriba verde con manchas, banda negra, mitad de abajo blanca y botón delante
  const SBG=C("#6f9e34"),SBG2=C("#4c7424"),SBW=C("#f2f0e4"),SBK=C("#1d1d22");
  const ballCol=glow=>(l,i,j)=>{if(l[2]<-.86)return glow?C("#ff5a5a"):C("#ffffff");if(l[2]<-.76)return SBK;if(Math.abs(l[1])<.1)return SBK;if(l[1]>0)return(i+j)%3===0&&i>0?SBG2:SBG;return SBW};
  const drawBall=(p,r,rz,rx,glow)=>sphere(p,r,ballCol(glow),rz,rx);
  const drawBerry=(p,r,rx)=>{sphere(p,r,(l)=>l[1]>.55?C("#5c2a3a"):C("#e8436a"),0,rx);box(T(I(),p[0],p[1]+r*1.05,p[2]),r*.35,r*.12,r*.18,C("#4f9a3a"))};
  const drawRock=(p,r,rx)=>sphere(p,r,(l)=>mix(C("#8e8a80"),C("#6c685f"),(l[0]+1)*.3+(l[2]>0?.2:0)),.3,rx);
  // diamante de cara a la cámara (partículas)
  const dia=(x,y,z,s,c)=>{ut([x-s,y,z],[x+s,y,z],[x,y+s,z],c);ut([x-s,y,z],[x,y-s,z],[x+s,y,z],c)};
  const star=(x,y,z,s,c)=>{dia(x,y,z,s,c);ut([x-s*.3,y+s*1.6,z],[x+s*.3,y+s*1.6,z],[x,y-s*1.6,z],c);ut([x-s*1.6,y+s*.3,z],[x+s*1.6,y,z],[x-s*1.6,y-s*.3,z],c)};
  const R={
    resize(w,h,dpr){vw=w;vh=h;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);gl.viewport(0,0,cv.width,cv.height)},
    draw(){const calm=typeof hubCalm==="function"&&hubCalm(),t=now(),tw=calm?0:t;sync(t);
      const asp=vw/vh,eye=[0,1.42,0],tg=[0,1.12,8];VP=mul(persp(Math.min(66,46+Math.max(0,1.7-asp)*26)*Math.PI/180,asp,.3,400),look(eye,tg));// (más campo de visión en pantallas estrechas)
      B=DY;B.n=0;
      // nubes que pasan despacio
      const clc=C(TOD.cl);for(let i=0;i<9;i++){const z=110+hash(i+90)*25,y=30+hash(i+91)*30,x=((hash(i+92)*300+tw*(.6+hash(i+93)*.6))%300)-150,s=6+hash(i+94)*7,c=mix(clc,hor,.15+hash(i+95)*.25);
        for(let k=0;k<5;k++){const ox=(k-2)*s*.55,oy=(k===2?.35:k%2?.15:0)*s,r=s*(k===2?.7:.5);for(let q=0;q<12;q++){const a0=q/12*6.283,a1=(q+1)/12*6.283;ut([x+ox,y+oy,z],[x+ox+Math.cos(a0)*r,y+oy+Math.max(-.2*r,Math.sin(a0)*r*.6),z],[x+ox+Math.cos(a1)*r,y+oy+Math.max(-.2*r,Math.sin(a1)*r*.6),z],c)}}}
      // hierba alta
      for(let i=RUS.length-1;i>=0;i--)if(t-RUS[i].t0>RUS[i].d)RUS.splice(i,1);
      const gb=night?C("#24402a"):C("#5b7f2e"),gt=night?C("#4a6a44"):C("#c9c06a"),gb2=night?C("#2a4a30"):C("#4e8a36"),gt2=night?C("#557a4a"):C("#9cc85a"),rb=night?C("#2a4030"):C("#557a3a"),rt=night?C("#4c6248"):C("#a8b870");
      for(const b of BL){let sw=Math.sin(tw*1.7+b.ph+b.x*.25)*.09+Math.sin(tw*3.1+b.ph*2)*.03;for(const r of RUS){const d=Math.hypot(b.x-r.x,(b.z-r.z)*1.2);if(d<r.r){const k=(1-d/r.r)*(1-(t-r.t0)/r.d);sw+=Math.sin(t*28+b.ph)*.35*k}}
        const h=b.h,cy=Math.cos(b.yaw)*b.w,sy=Math.sin(b.yaw)*b.w,tx=b.x+(b.lean+sw)*h,tz=b.z+b.lean*.3*h,cB=b.k===2?rb:mix(gb,gb2,b.c),cT=b.k===2?rt:mix(gt,gt2,b.c*.8);
        ut([b.x-cy,b.y-.05,b.z-sy],[b.x+cy,b.y-.05,b.z+sy],[tx,b.y+h,tz],fogU(cB,b.z),fogU(cB,b.z),fogU(cT,b.z))}
      // reflejos en la charca
      if(!calm)for(let i=0;i<8;i++){const x=6+hash(i+60)*5,z=13.5+hash(i+61)*3,w=.25+.2*Math.sin(t*2+i),c=night?[.45,.55,.85]:[.85,.95,1];ut([x-w,-.3,z],[x+w,-.3,z],[x,-.3,z+.08],c)}
      // mariposas (de día) o luciérnagas (de noche)
      for(let i=0;i<(night?14:5);i++){const ph=hash(i+70)*6.28,x=(hash(i+71)-.5)*12+Math.sin(tw*.4+ph)*2.5,z=5+hash(i+72)*12+Math.cos(tw*.3+ph)*1.5,y=gnd(x,z)+.9+Math.sin(tw*1.3+ph)*.4;
        if(night){const k=.5+.5*Math.sin(t*3+ph*3);if(k>.2)dia(x,y,z,.05+.03*k,mix([.4,.5,.2],[1,1,.55],k))}else{const f=Math.abs(Math.sin(tw*12+ph)),c=C(i%2?"#ffd84a":"#f4f4ff"),s=.13;ut([x,y,z],[x+s,y+s*f,z-s*.3],[x+s,y-s*.4,z+s*.2],c);ut([x,y,z],[x-s,y+s*f,z-s*.3],[x-s,y-s*.4,z+s*.2],c)}}
      // sombra del Pokémon
      const mp=monPose(t);if(M.ok&&mp.vis&&mp.al>.2){const gy=gnd(PX,PZ)+.02,rx=M.w*.36*mp.sx,rz=.42*mp.sx,c=shd(mix(DIRT2,[0,0,0],.42));for(let q=0;q<16;q++){const a0=q/16*6.283,a1=(q+1)/16*6.283;ut([mp.x,gy,PZ],[mp.x+Math.cos(a0)*rx,gy,PZ+Math.sin(a0)*rz],[mp.x+Math.cos(a1)*rx,gy,PZ+Math.sin(a1)*rz],c)}}
      // cebo y roca en vuelo
      for(let i=TH.length-1;i>=0;i--){const o=TH[i],e=t-o.t0,k=Math.min(1,e/o.d),p=[o.a[0]+(o.b[0]-o.a[0])*k,o.a[1]+(o.b[1]-o.a[1])*k+Math.sin(k*Math.PI)*o.arc,o.a[2]+(o.b[2]-o.a[2])*k];
        if(e<o.d){o.k==="bait"?drawBerry(p,.12,e*9):drawRock(p,.13,e*12)}else if(o.k==="bait"&&e<o.d+(M.eat?4:1.2))drawBerry([o.b[0],gnd(o.b[0],o.b[2])+.1*Math.max(.3,1-(e-o.d)/5),o.b[2]],.11,0);else if(e>o.d+4){TH.splice(i,1);continue}
        if(!o.hit&&e>=o.d){o.hit=1;if(o.k==="bait"){puff(o.b[0],gnd(o.b[0],o.b[2])+.1,o.b[2],8,shd(DIRT),.8,.5,1);M.hop=t+.1}else{puff(o.b[0],o.b[1],o.b[2],10,shd(C("#bdb6a6")),1.4,.45);M.rock=t}}}
      // Safari Ball
      if(BA.st){const e=t-BA.t0;let p=BA.p,rz=0,rx=0;const gy=gnd(PX,PZ-.35)+.19,tgt=[PX,gnd(PX,PZ)+Math.min(1.25,M.h*.55),PZ-.35];
        if(BA.st==="fly"){const k=Math.min(1,e/.52);p=[BA.from[0]+(tgt[0]-BA.from[0])*k,BA.from[1]+(tgt[1]-BA.from[1])*k+Math.sin(k*Math.PI)*1.1,BA.from[2]+(tgt[2]-BA.from[2])*k];rx=e*18;
          if(k>=1){BA.st="open";BA.t0=t;M.cap=t;puff(tgt[0],tgt[1],tgt[2],14,[1,1,1],1.6,.4)}}
        else if(BA.st==="open"){p=[tgt[0],tgt[1]+Math.min(.25,e*.8),tgt[2]];rx=-.6;if(e>.42){BA.st="fall";BA.t0=t}}
        else if(BA.st==="fall"){const k=Math.min(1,e/.28),y0=tgt[1]+.25;p=[tgt[0],y0+(gy-y0)*k*k,tgt[2]];if(k>=1){BA.st="rest";BA.t0=t;puff(p[0],gy-.1,p[2],8,shd(DIRT),.7,.4,1)}}
        else{p=[tgt[0],gy+(BA.st==="rest"&&e<.25?Math.abs(Math.sin(e/.25*Math.PI))*.12:0),tgt[2]]}
        const es=t-BA.shk;if(es>=0&&es<.42){const k=es/.42;rz=(k<.3?-k/.3*.4:k<.7?-.4+(k-.3)/.4*.72:.32*(1-(k-.7)/.3))}
        BA.p=p;if(BA.st!=="gone"){drawBall(p,.19,rz,rx,BA.ok&&BA.st==="rest");// rayo de luz que mete al Pokémon en la Ball
          if(BA.st==="open"&&e<.36){const c=[1,1,.92],mp2=monPose(t);for(let q=0;q<5;q++){const a=q/5*6.283+t*4,o=[Math.cos(a)*.35,Math.sin(a)*.35];ut([p[0],p[1],p[2]-.01],[mp2.x+o[0],mp2.y+M.h*.5+o[1],PZ],[mp2.x+o[0]*.6,mp2.y+M.h*.5+o[1]+.1,PZ],c)}}}}
      // partículas
      for(let i=PT.length-1;i>=0;i--){const q=PT[i],e=t-q.t0;if(e>q.life){PT.splice(i,1);continue}const k=1-e/q.life,x=q.x+q.vx*e,y=q.y+q.vy*e-q.g*e*e*.5,z=q.z+q.vz*e;q.star?star(x,y,z-.05,q.s*k,q.col):dia(x,y,z-.05,q.s*(.5+k*.5),q.col)}
      // enfadado: humo rojo sobre la cabeza de vez en cuando
      if(M.ok&&M.ang&&mp.vis&&!calm&&Math.random()<.04)puff(mp.x-M.w*.25,mp.y+M.h*.95,PZ-.2,3,[1,.35,.3],.5,.5);
      // ---------- a la GPU ----------
      gl.clearColor(hor[0],hor[1],hor[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.useProgram(pr);gl.uniformMatrix4fv(uM,false,VP);gl.uniform3f(uL,sd[0],sd[1],-sd[2]);gl.uniform3fv(uA,TOD.amb);gl.uniform3fv(uS,TOD.lit);gl.uniform2f(uF,25,135);gl.uniform3fv(uFc,hor);
      gl.enableVertexAttribArray(aP);gl.enableVertexAttribArray(aN);gl.enableVertexAttribArray(aC);
      const bind=b=>{gl.bindBuffer(gl.ARRAY_BUFFER,b.vbo);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,36,0);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,36,12);gl.vertexAttribPointer(aC,3,gl.FLOAT,false,36,24)};
      bind(ST);gl.drawArrays(gl.TRIANGLES,0,ST.n);bind(DY);gl.bufferSubData(gl.ARRAY_BUFFER,0,DY.a.subarray(0,DY.n*9));gl.drawArrays(gl.TRIANGLES,0,DY.n);
      gl.disableVertexAttribArray(aN);gl.disableVertexAttribArray(aC);
      // el Pokémon (después, con transparencia en los bordes; la hierba de delante ya está y le tapa los pies)
      if(M.ok&&mp.vis&&mp.al>0){const w=M.w*mp.sx,h=M.h*mp.sy,x=mp.x,y=mp.y,z=mp.z,L=x+w/2,Rr=x-w/2;// (la x positiva queda a la izquierda de la pantalla)
        QA.set([L,y,z,0,1, Rr,y,z,1,1, Rr,y+h,z,1,0, L,y,z,0,1, Rr,y+h,z,1,0, L,y+h,z,0,0]);
        gl.useProgram(pt);gl.bindBuffer(gl.ARRAY_BUFFER,QB);gl.bufferData(gl.ARRAY_BUFFER,QA,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(tP);gl.enableVertexAttribArray(tU);gl.vertexAttribPointer(tP,3,gl.FLOAT,false,20,0);gl.vertexAttribPointer(tU,2,gl.FLOAT,false,20,12);
        gl.uniformMatrix4fv(tM,false,VP);gl.uniform4fv(tT,mp.tint);gl.uniform3fv(tK,TOD.spr);gl.uniform1f(tA,mp.al);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,M.tex);gl.uniform1i(tX,0);
        gl.enable(gl.BLEND);gl.drawArrays(gl.TRIANGLES,0,6);gl.disable(gl.BLEND);gl.disableVertexAttribArray(tU);gl.disableVertexAttribArray(tP)}
      // el panel enseña la imagen plana si la 3D no está lista
      const par=cv.parentNode;if(par){const ok=!M.fail&&!!M.key;if(par._s3!==ok){par._s3=ok;par.classList.toggle("saf3t",ok)}}
    },
    // ---------- lo que pasa en la Zona Safari (p_new.js) ----------
    ready(){return M.ok&&!!M.key},
    ev(k){const t=now(),from=[-.7,.55,.9];
      if(k==="bait")TH.push({k,a:from,b:[PX+.5,gnd(PX+.5,PZ-.7)+.1,PZ-.7],t0:t,d:.5,arc:.9});
      else if(k==="rock")TH.push({k,a:from,b:[PX,gnd(PX,PZ)+M.h*.55,PZ-.15],t0:t,d:.42,arc:.6})},
    // lanza la Ball: acaba cuando el Pokémon ya está dentro y la Ball ha caído al suelo
    ball(){BA.st="fly";BA.t0=now();BA.from=[-.6,.5,.8];BA.ok=false;BA.shk=-9;return new Promise(r=>setTimeout(r,1300))},
    shake(){BA.shk=now();RUS.push({x:PX,z:PZ-.35,t0:now(),d:.4,r:.9});return new Promise(r=>setTimeout(r,420))},
    caught(){BA.ok=true;const p=BA.p;sparkle(p[0],p[1]+.15,p[2]-.05,8,[1,.9,.35])},
    escape(){const p=BA.p;BA.st="gone";M.rel=now();puff(p[0],p[1],p[2],16,[1,1,1],1.8,.45)},
    flee(){M.flee=now();RUS.push({x:PX,z:PZ,t0:now(),d:.8,r:3});return new Promise(r=>setTimeout(r,480))},
    // bucle propio: dibuja mientras el lienzo esté en la página
    start(){if(run)return;run=true;let last=0;const loop=ts=>{if(!cv.isConnected){run=false;return}requestAnimationFrame(loop);if(document.hidden)return;
      const calm=typeof hubCalm==="function"&&hubCalm();if(calm&&ts-last<250&&!BA.st)return;last=ts;
      const r=cv.getBoundingClientRect();if(r.width>0&&(Math.abs(r.width-vw)>1||Math.abs(r.height-vh)>1))R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));try{R.draw()}catch(e){}};requestAnimationFrame(loop)}};
  return R}

// coloca la escena 3D dentro del panel de la Zona Safari (el mismo lienzo se reutiliza cada vez que se redibuja el panel)
function saf3Mount(box){
  const mon=box&&box.querySelector(".safmon");if(!mon)return;
  if(NX.saf3===false)return;
  if(!NX.saf3){const cv=document.createElement("canvas");cv.className="saf3c";let r=null;try{r=typeof SAF3D==="function"?SAF3D(cv):null}catch(e){r=null}if(!r){NX.saf3=false;return}NX.saf3=r;NX.saf3cv=cv}
  const cv=NX.saf3cv;mon.insertBefore(cv,mon.firstChild);mon.classList.add("saf3on");
  // mientras carga la imagen se ve la hierba (la imagen plana solo aparece si la 3D no puede usarla)
  mon.classList.add("saf3t");mon._s3=true;NX.saf3.start();
}
// la escena 3D, si está en pantalla y con el Pokémon ya dibujado (si no, se usan las animaciones planas)
function saf3(){const r=NX.saf3;return r&&NX.saf3cv&&NX.saf3cv.isConnected&&r.ready()&&!(typeof hubCalm==="function"&&hubCalm())?r:null}
