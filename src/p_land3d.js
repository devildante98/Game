// =====================================================================================
// PAISAJE 3D DE LA PANTALLA PRINCIPAL
// Detrás del pueblo y del entrenador: un valle con lago, colinas con bosques de pinos y árboles de copa redonda,
// montañas nevadas al fondo, nubes, pájaros, y la luz de la hora del día (amanecer, día, atardecer y noche con
// estrellas). Motor propio con WebGL (sin librerías). El relieve y los árboles se generan una vez y se guardan en la
// tarjeta gráfica; cada fotograma solo se rehacen el agua, el cielo, las nubes y los pájaros. Va a pocos fotogramas
// por segundo y se para cuando hay una ventana encima o la pestaña está oculta. Sin WebGL se ve el paisaje de antes.
// =====================================================================================
function LAND3(cv){let gl=null;try{gl=cv.getContext("webgl",{antialias:true,alpha:false,powerPreference:"low-power"})||cv.getContext("experimental-webgl")}catch(e){}if(!gl)return null;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
  let pr;try{pr=gl.createProgram();
    // luz del sol + cielo (hemisférica), y niebla que se mezcla con el color del horizonte según la distancia
    gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec3 p;attribute vec3 n;attribute vec3 c;uniform mat4 m;uniform vec3 L;uniform vec3 amb;uniform vec3 gnd;uniform vec3 sun;uniform vec2 fog;varying vec3 vc;varying float vf;void main(){vec4 q=m*vec4(p,1.);gl_Position=q;float u=step(.01,dot(n,n));vec3 nn=normalize(n+vec3(0.,.0001,0.));float d=max(dot(nn,L),0.);vec3 a=mix(gnd,amb,nn.y*.5+.5);vc=mix(c,c*(a+sun*d),u);vf=u*clamp((q.w-fog.x)/(fog.y-fog.x),0.,1.);vf=vf*vf*(3.-2.*vf);}"));
    gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec3 vc;varying float vf;uniform vec3 fogc;void main(){gl_FragColor=vec4(mix(vc,fogc,vf*.88),1.);}"));
    gl.bindAttribLocation(pr,0,"p");gl.bindAttribLocation(pr,1,"n");gl.bindAttribLocation(pr,2,"c");
    gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null}catch(e){return null}
  // segundo programa, para las nubes: colores con transparencia (bordes difuminados), sin luz
  let prC=null;try{prC=gl.createProgram();gl.attachShader(prC,sh(gl.VERTEX_SHADER,"attribute vec3 p;attribute vec4 c;uniform mat4 m;varying vec4 vc;void main(){gl_Position=m*vec4(p,1.);vc=c;}"));
    gl.attachShader(prC,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec4 vc;void main(){gl_FragColor=vc;}"));gl.bindAttribLocation(prC,0,"p");gl.bindAttribLocation(prC,1,"c");gl.linkProgram(prC);if(!gl.getProgramParameter(prC,gl.LINK_STATUS))prC=null}catch(e){prC=null}
  const uMC=prC&&gl.getUniformLocation(prC,"m"),CB={a:new Float32Array(150000*7),n:0,vbo:gl.createBuffer()};
  gl.useProgram(pr);const U=k=>gl.getUniformLocation(pr,k),uM=U("m"),uL=U("L"),uA=U("amb"),uG=U("gnd"),uS=U("sun"),uF=U("fog"),uFc=U("fogc"),aP=gl.getAttribLocation(pr,"p"),aN=gl.getAttribLocation(pr,"n"),aC=gl.getAttribLocation(pr,"c");
  gl.enableVertexAttribArray(aP);gl.enableVertexAttribArray(aN);gl.enableVertexAttribArray(aC);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  // dos búferes: lo fijo (relieve, árboles) y lo que se mueve (cielo, agua, nubes, pájaros)
  const mkB=n=>({a:new Float32Array(n*9),n:0,max:n,vbo:gl.createBuffer()});const ST=mkB(260000),DY=mkB(90000);let B=ST;
  const bind=b=>{gl.bindBuffer(gl.ARRAY_BUFFER,b.vbo);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,36,0);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,36,12);gl.vertexAttribPointer(aC,3,gl.FLOAT,false,36,24)};
  const V=(x,y,z,nx,ny,nz,c)=>{if(B.n>=B.max)return;const i=B.n*9,a=B.a;a[i]=x;a[i+1]=y;a[i+2]=z;a[i+3]=nx;a[i+4]=ny;a[i+5]=nz;a[i+6]=c[0];a[i+7]=c[1];a[i+8]=c[2];B.n++};
  // ---------- matrices ----------
  const mul=(a,b)=>{const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o};
  const persp=(fov,asp,n,f)=>{const t=1/Math.tan(fov/2),o=new Float32Array(16);o[0]=t/asp;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o};
  const look=(e,c)=>{let zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2],l=Math.hypot(zx,zy,zz);zx/=l;zy/=l;zz/=l;let xx=zz,xz=-zx;l=Math.hypot(xx,xz)||1;xx/=l;xz/=l;const yx=zy*xz,yy=zz*xx-zx*xz,yz=-zy*xx;
    return new Float32Array([xx,yx,zx,0,0,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1])};
  const mix=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
  const hex=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255];
  const tri=(a,b,c,ca,cb,cc,na,nb,nc)=>{V(a[0],a[1],a[2],na[0],na[1],na[2],ca);V(b[0],b[1],b[2],nb[0],nb[1],nb[2],cb||ca);V(c[0],c[1],c[2],nc[0],nc[1],nc[2],cc||ca)};
  const ut=(a,b,c,ca,cb,cc)=>{V(a[0],a[1],a[2],0,0,0,ca);V(b[0],b[1],b[2],0,0,0,cb||ca);V(c[0],c[1],c[2],0,0,0,cc||ca)};
  const fn=(a,b,c)=>{const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let x=uy*vz-uz*vy,y=uz*vx-ux*vz,z=ux*vy-uy*vx;const l=Math.hypot(x,y,z)||1;x/=l;y/=l;z/=l;if(y<0){x=-x;y=-y;z=-z}return[x,y,z]};
  // ---------- ruido para el relieve ----------
  const hsh=(i,j)=>{const x=Math.sin(i*127.1+j*311.7)*43758.5453;return x-Math.floor(x)};
  const vn=(x,z)=>{const i=Math.floor(x),j=Math.floor(z),fx=x-i,fz=z-j,u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz),a=hsh(i,j),b=hsh(i+1,j),c=hsh(i,j+1),d=hsh(i+1,j+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
  const fbm=(x,z,o)=>{let s=0,a=.5,f=1;for(let k=0;k<(o||5);k++){s+=a*vn(x*f,z*f);f*=2.03;a*=.5}return s};
  const ridge=(x,z)=>{let s=0,a=.55,f=1;for(let k=0;k<5;k++){const r=1-Math.abs(vn(x*f,z*f)*2-1);s+=a*r*r;f*=2.1;a*=.5}return s};
  // altura del terreno: prado delante, un lago en el centro del valle, colinas a los lados y montañas al fondo
  const H0=(x,z)=>{const valley=Math.exp(-Math.pow((x+6*Math.sin(z*.012))/(48+z*.18),2));
    let h=fbm(x*.018,z*.018)*16-3;
    h+=Math.pow(Math.min(1.9,Math.max(0,(z-200)/120)),1.4)*30*(.45+ridge(x*.011,z*.011));       // montañas del fondo
    h+=(1-valley)*(8+fbm(x*.03+7,z*.03)*16)*Math.min(1,Math.max(0,(z-20)/60)); // colinas de los lados
    const lake=Math.exp(-Math.pow(x/62,2)-Math.pow((z-92)/42,2));h-=lake*15;
    if(z<34)h=h*.4+1.2+fbm(x*.05,z*.05,3)*1.5;                              // prado de delante
    return h};

  // ---------- el pueblo: sitio, giro y explanada de cada edificio (en el mismo orden que las mejoras) ----------
  // yaw: hacia dónde mira la fachada (0 = hacia la cámara). Unos de frente, otros girados o de perfil, mirando al camino.
  const TOWN=[{x:33,z:28,yaw:-32,r:5.2},{x:22.5,z:31.5,yaw:72,r:5.6},{x:10.5,z:25,yaw:-10,r:5},{x:0,z:26,yaw:0,r:5},{x:-10.5,z:25,yaw:12,r:5.2},{x:-23,z:32,yaw:0,r:5.6},{x:-33.5,z:27,yaw:40,r:5.2}];// (la x positiva se ve a la izquierda)
  TOWN.forEach(b=>{b.y=H0(b.x,b.z);const a=b.yaw*Math.PI/180;b.ca=Math.cos(a);b.sa=Math.sin(a)});
  // camino de tierra: baja del pueblo hacia el lago y pasa por delante de cada edificio
  const ROAD=[[48,22],[33,21],[22.5,24],[10.5,18.5],[0,21],[-10.5,18.5],[-23,24.5],[-33.5,20.5],[-48,21]],ROAD2=[[0,21],[1.5,34],[-1,50]];
  const segD=(px,pz,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((px-a[0])*dx+(pz-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(px-a[0]-dx*t,pz-a[1]-dz*t)};
  const roadD=(x,z)=>{let d=99;for(const R of[ROAD,ROAD2])for(let i=0;i<R.length-1;i++)d=Math.min(d,segD(x,z,R[i],R[i+1]));
    // y un ramal corto hasta la puerta de cada edificio
    for(const b of TOWN){const fx=b.x-b.sa*(b.r+1.2),fz=b.z-b.ca*(b.r+1.2);let best=null,bd=99;for(const R of[ROAD])for(let i=0;i<R.length-1;i++){const q=segD(fx,fz,R[i],R[i+1]);if(q<bd){bd=q;best=1}}
      if(best)d=Math.min(d,segD(x,z,[b.x-b.sa*b.r*.6,b.z-b.ca*b.r*.6],[fx-b.sa*bd,fz-b.ca*bd]))}return d};
  const padW=(x,z)=>{let w=0,y=0;for(const b of TOWN){const d=Math.hypot(x-b.x,z-b.z),k=d<b.r?1:d<b.r+4?1-(d-b.r)/4:0;if(k>w){w=k;y=b.y}}return[w*w*(3-2*w),y]};
  const H=(x,z)=>{const h=H0(x,z);if(z>70||z<0||x<-60||x>60)return h;const[w,y]=padW(x,z),rd=roadD(x,z),hr=rd<2.4?(1-rd/2.4)*.25:0;return h+(y-h)*w-hr};
  const EYE=[0,15,-28];
  // ---------- paletas de la hora del día ----------
  const PAL={day:{top:"#3f86dc",hor:"#cfe6fb",low:"#f2f6ee",sun:[1,.97,.86],sunCol:"#fff6d8",amb:[.55,.6,.7],gnd:[.42,.4,.32],lit:[.62,.6,.52],sunDir:[-.35,.62,.7],water:"#3a7fbf",waterHi:"#a9d4f2",fog:[120,520],star:0,mtTint:[1,1,1]},
    dawn:{top:"#4d6fb8",hor:"#ffc8a0",low:"#ffe6cc",sun:[1,.8,.6],sunCol:"#ffd9a8",amb:[.5,.48,.58],gnd:[.42,.34,.32],lit:[.78,.58,.44],sunDir:[.75,.18,.62],water:"#5a6fa8",waterHi:"#ffc8a6",fog:[100,460],star:.15,mtTint:[1,.9,.9]},
    dusk:{top:"#3a3f8a",hor:"#ff9a6a",low:"#ffc89a",sun:[1,.6,.4],sunCol:"#ffb070",amb:[.5,.42,.52],gnd:[.42,.3,.3],lit:[.85,.52,.36],sunDir:[-.75,.14,.62],water:"#4a4f8a",waterHi:"#ffa070",fog:[90,440],star:.3,mtTint:[1,.86,.86]},
    night:{top:"#0c1438",hor:"#2c3a72",low:"#3a4a80",sun:[.75,.8,1],sunCol:"#f2f0dc",amb:[.26,.3,.48],gnd:[.16,.17,.24],lit:[.32,.36,.55],sunDir:[.42,.24,.85],water:"#1a2a58",waterHi:"#8aa0d8",fog:[70,380],star:1,mtTint:[.6,.65,.85]}};
  const lerpP=(a,b,k)=>{const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=typeof va==="string"?mix(hex(va),hex(vb),k):Array.isArray(va)?va.map((v,i)=>v+(vb[i]-v)*k):va+(vb-va)*k}return o};
  // ---------- lo fijo: relieve y árboles ----------
  const terrainCol=(x,y,z,ny)=>{const n=fbm(x*.08,z*.08,3),g1=[.36,.62,.27],g2=[.5,.7,.32],dry=[.66,.66,.38],rock=[.48,.46,.44],rock2=[.38,.37,.38],snow=[.96,.97,1],sand=[.84,.78,.58];
    let c=mix(g1,g2,n);if(z<34)c=mix(c,dry,fbm(x*.03,z*.03,3)*.5);if(y<1.4&&y>-1)c=mix(c,sand,Math.min(1,(1.4-y)/1.4));
    const steep=1-ny;if(steep>.25)c=mix(c,mix(rock,rock2,n),Math.min(1,(steep-.25)*3.5));
    if(z>0&&z<70&&Math.abs(x)<60){const rd=roadD(x,z),pw=padW(x,z)[0],dirt=mix([.66,.54,.38],[.74,.62,.44],fbm(x*.3,z*.3,2));if(rd<2.2)c=mix(c,dirt,Math.min(1,(2.2-rd)/1.2));else if(pw>.55)c=mix(c,mix(dirt,c,.45),(pw-.55)/.45)}
    const sl=58+fbm(x*.05,z*.05,3)*16;if(y>sl)c=mix(c,snow,Math.min(1,(y-sl)/6)*(steep>.55?.55:1));return c};
  const buildStatic=()=>{B=ST;B.n=0;
    // rejilla del terreno, más tupida cerca y más espaciada lejos
    const xs=[],zs=[];for(let x=-320;x<=320;x+=x*x<4000?3:x*x<25000?5:9)xs.push(x);xs.push(320);
    {let z=-6;while(z<520){zs.push(z);z+=z<60?2.5:z<160?4.5:8}}
    const P=zs.map(z=>xs.map(x=>{const y=H(x,z);return[x,y,z]}));
    const N=zs.map((z,j)=>xs.map((x,i)=>{const e=1.2,hx=(H(x+e,z)-H(x-e,z))/(2*e),hz=(H(x,z+e)-H(x,z-e))/(2*e),l=Math.hypot(hx,1,hz);return[-hx/l,1/l,-hz/l]}));
    const Cc=P.map((r,j)=>r.map((p,i)=>terrainCol(p[0],p[1],p[2],N[j][i][1])));
    for(let j=0;j<zs.length-1;j++)for(let i=0;i<xs.length-1;i++){const a=P[j][i],b=P[j][i+1],c=P[j+1][i+1],d=P[j+1][i];
      tri(a,b,c,Cc[j][i],Cc[j][i+1],Cc[j+1][i+1],N[j][i],N[j][i+1],N[j+1][i+1]);tri(a,c,d,Cc[j][i],Cc[j+1][i+1],Cc[j+1][i],N[j][i],N[j+1][i+1],N[j+1][i])}
    // árboles: pinos (conos en capas) y frondosos (copa redonda), por manchas de bosque
    const cone=(x,y,z,r,h,c,c2,seg)=>{seg=seg||7;const tp=[x,y+h,z];for(let k=0;k<seg;k++){const a0=k/seg*6.283,a1=(k+1)/seg*6.283,p0=[x+Math.cos(a0)*r,y,z+Math.sin(a0)*r],p1=[x+Math.cos(a1)*r,y,z+Math.sin(a1)*r],
        n0=[Math.cos(a0)*.8,.6,Math.sin(a0)*.8],n1=[Math.cos(a1)*.8,.6,Math.sin(a1)*.8],nt=[Math.cos((a0+a1)/2)*.5,.85,Math.sin((a0+a1)/2)*.5];tri(p0,p1,tp,c,c,c2,n0,n1,nt)}};
    const blob=(x,y,z,r,ry,col,c2)=>{const R=5,S=8,pt=(i,j)=>{const v=i/R*Math.PI,u=j/S*6.283,n=[Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)],w=1+.12*Math.sin(u*3+v*2+x);return{p:[x+n[0]*r*w,y+n[1]*ry*w,z+n[2]*r*w],n}};
      for(let i=0;i<R;i++)for(let j=0;j<S;j++){const a=pt(i,j),b=pt(i,j+1),q=pt(i+1,j+1),d=pt(i+1,j),ca=i<2?c2:col,cb=i+1<2?c2:col;tri(a.p,b.p,q.p,ca,ca,cb,a.n,b.n,q.n);tri(a.p,q.p,d.p,ca,cb,cb,a.n,q.n,d.n)}};
    const trunk=(x,y,z,r,h,c)=>{for(let k=0;k<5;k++){const a0=k/5*6.283,a1=(k+1)/5*6.283,p0=[x+Math.cos(a0)*r,y,z+Math.sin(a0)*r],p1=[x+Math.cos(a1)*r,y,z+Math.sin(a1)*r],q0=[p0[0],y+h,p0[2]],q1=[p1[0],y+h,p1[2]],n0=[Math.cos(a0),0,Math.sin(a0)],n1=[Math.cos(a1),0,Math.sin(a1)];tri(p0,p1,q1,c,c,c,n0,n1,n1);tri(p0,q1,q0,c,c,c,n0,n1,n0)}};
    let n=0;for(let k=0;k<6000&&n<1500;k++){const x=(hsh(k,3)-.5)*560,z=30+hsh(k,7)**1.1*300;const y=H(x,z);if(y<1.6||y>34)continue;if(z<90&&Math.abs(x)<70&&hsh(k,23)<.75)continue;
      const e=1.5,sl=Math.abs(H(x+e,z)-H(x-e,z))+Math.abs(H(x,z+e)-H(x,z-e));if(sl>3.4)continue;
      const dens=fbm(x*.022+3,z*.022+9,3);if(dens<.47&&hsh(k,11)>.1)continue;if(Math.abs(x)<10&&z<40)continue;if(z<62&&Math.abs(x)<62&&(TOWN.some(b=>Math.hypot(x-b.x,z-b.z)<b.r+3.5)||roadD(x,z)<3.2))continue;
      const s=(.8+hsh(k,13)*.7)*(1+z/260),pine=hsh(k,17)<.62||y>14,tone=hsh(k,19);n++;
      if(pine){const g=mix([.12,.36,.2],[.2,.46,.24],tone),g2=mix(g,[1,1,1],.1);trunk(x,y-.2,z,.22*s,1.2*s,[.36,.24,.16]);cone(x,y+.9*s,z,1.7*s,2.6*s,g,g2);cone(x,y+2.2*s,z,1.3*s,2.3*s,g,g2);cone(x,y+3.4*s,z,.9*s,2*s,g2,mix(g2,[1,1,1],.08))}
      else{const g=mix([.24,.5,.2],[.42,.62,.26],tone),g2=mix(g,[1,.95,.6],.18);trunk(x,y-.2,z,.25*s,1.8*s,[.4,.28,.18]);blob(x,y+2.8*s,z,1.9*s,1.6*s,g,g2)}}
    // rocas sueltas en el prado y en la orilla
    for(let k=0;k<70;k++){const x=(hsh(k,31)-.5)*200,z=4+hsh(k,37)*120,y=H(x,z);if(y<.2)continue;if(z<62&&Math.abs(x)<62&&(TOWN.some(b=>Math.hypot(x-b.x,z-b.z)<b.r+2)||roadD(x,z)<2.5))continue;const r=.5+hsh(k,41)*1.4,c=mix([.5,.5,.5],[.62,.6,.56],hsh(k,43));blob(x,y,z,r,r*.6,c,mix(c,[1,1,1],.1))}
    gl.bindBuffer(gl.ARRAY_BUFFER,ST.vbo);gl.bufferData(gl.ARRAY_BUFFER,ST.a.subarray(0,ST.n*9),gl.STATIC_DRAW)};
  // ---------- los edificios del pueblo (tamaño fijo; al subir de nivel solo ganan detalles) ----------
  const TW=mkB(120000),TB=[];let townKey="";
  const buildTown=(tiers,night)=>{B=TW;B.n=0;
    const starts=[];for(let i=0;i<TOWN.length;i++){starts.push(B.n);const b=TOWN[i],t=tiers[i]|0;
      // ---- coordenadas del edificio: x a la derecha de la fachada, y arriba, z hacia dentro (la fachada mira a -z) ----
      const SC=.88,P=(x,y,z)=>[b.x+(x*b.ca+z*b.sa)*SC,b.y+y*SC,b.z+(-x*b.sa+z*b.ca)*SC],N=v=>[v[0]*b.ca+v[2]*b.sa,v[1],-v[0]*b.sa+v[2]*b.ca];
      const dk=(c,k)=>mix(c,[0,0,0],k),lt=(c,k)=>mix(c,[1,1,1],k),vh=(i2,k)=>{const x=Math.sin((i*97+i2*13.7)*12.9898)*43758.5;return k*((x-Math.floor(x))-.5)};
      const add=(a,s,v)=>[a[0]+s*v[0],a[1]+s*v[1],a[2]+s*v[2]];
      // cuadrilátero con color por vértice (para el sombreado de la base de los muros)
      const q=(a,b2,c,d,ca,cb,cc,cd,n)=>{const A=P(...a),Bq=P(...b2),C=P(...c),D=P(...d),nn=N(n);tri(A,Bq,C,ca,cb,cc,nn,nn,nn);tri(A,C,D,ca,cc,cd,nn,nn,nn)};
      const q1=(a,b2,c,d,col,n)=>q(a,b2,c,d,col,col,col,col,n);
      const glw=(a,b2,c,d,col)=>{const A=P(...a),Bq=P(...b2),C=P(...c),D=P(...d);ut(A,Bq,C,col);ut(A,C,D,col)};
      // caja orientada: centro c, ejes U,Vv,D (unitarios), medias medidas; las caras laterales se oscurecen abajo
      const obox=(c,U,Vv,D,hu,hv,hd,col,top,ao)=>{const p=(su,sv,sd)=>add(add(add(c,su*hu,U),sv*hv,Vv),sd*hd,D),lo=dk(col,ao==null?.16:ao),side=dk(col,.07);
        const sf=(a,b2,c2,d2,n,cl)=>q(a,b2,c2,d2,cl===col?lo:dk(cl,.16),cl===col?lo:dk(cl,.16),cl,cl,n);
        sf(p(-1,-1,1),p(1,-1,1),p(1,1,1),p(-1,1,1),D,col);sf(p(1,-1,-1),p(-1,-1,-1),p(-1,1,-1),p(1,1,-1),D.map(v=>-v),side);
        sf(p(1,-1,1),p(1,-1,-1),p(1,1,-1),p(1,1,1),U,side);sf(p(-1,-1,-1),p(-1,-1,1),p(-1,1,1),p(-1,1,-1),U.map(v=>-v),side);
        q1(p(-1,1,1),p(1,1,1),p(1,1,-1),p(-1,1,-1),top||lt(col,.04),Vv)};
      const X=[1,0,0],Y=[0,1,0],Z=[0,0,1],Zm=[0,0,-1];
      const box=(x,y,z,hx,hy,hz,col,top,ao)=>obox([x,y+hy,z],X,Y,Zm,hx,hy,hz,col,top,ao);
      const cyl=(x,y,z,r,h,col,top,seg)=>{seg=seg||12;for(let k=0;k<seg;k++){const a0=k/seg*6.283,a1=(k+1)/seg*6.283,c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1),lo=dk(col,.15);
          q([x+c0*r,y,z+s0*r],[x+c1*r,y,z+s1*r],[x+c1*r,y+h,z+s1*r],[x+c0*r,y+h,z+s0*r],lo,lo,col,col,[(c0+c1)/2,0,(s0+s1)/2]);if(top){const A=P(x,y+h,z),Bq=P(x+c0*r,y+h,z+s0*r),C=P(x+c1*r,y+h,z+s1*r),nn=[0,1,0];tri(A,C,Bq,top,top,top,nn,nn,nn)}}};
      const ell=(x,y,z,rx,ry,rz,col,seg)=>{seg=seg||8;const R2=5,pt=(i2,j)=>{const v=i2/R2*Math.PI,u=j/seg*6.283;return[Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)]},w=v=>[x+v[0]*rx,y+v[1]*ry,z+v[2]*rz];
        for(let i2=0;i2<R2;i2++)for(let j=0;j<seg;j++){const a=pt(i2,j),bq=pt(i2,j+1),c=pt(i2+1,j+1),d=pt(i2+1,j);const A=P(...w(a)),Bq=P(...w(bq)),C=P(...w(c)),D=P(...w(d));tri(A,Bq,C,col,col,col,N(a),N(bq),N(c));tri(A,C,D,col,col,col,N(a),N(c),N(d))}};
      // ---- fachadas: plano del muro con su eje horizontal U y su normal hacia fuera D ----
      const FAC=(o,U,D)=>({o,U,D,pt:(u,v,d)=>add(add([o[0],v,o[2]],u,U),d,D),box(u,v,d,hu,hv,hd,col,top,ao){obox(this.pt(u,v,d),U,Y,D,hu,hv,hd,col,top,ao)},
        quad(u0,v0,u1,v1,d,col,glow,col2){const a=this.pt(u0,v0,d),b2=this.pt(u1,v0,d),c=this.pt(u1,v1,d),e=this.pt(u0,v1,d);if(glow)glw(a,b2,c,e,col);else q(a,b2,c,e,col2||col,col2||col,col,col,D)}});
      const front=(zf,x0)=>FAC([x0||0,0,zf],X,Zm),back=(zb)=>FAC([0,0,zb],[-1,0,0],Z),side=(xs)=>FAC([xs,0,0],xs>0?Z:Zm,xs>0?X:[-1,0,0]);
      const GL=night?[1,.83,.48]:[.5,.66,.8],GL2=night?[1,.9,.62]:[.72,.84,.93];
      // ventana: cristal, marco, cruceta, alféizar, dintel y, si se pide, contraventanas y jardinera
      const win=(F,u,v,w,h,o)=>{o=o||{};const fr=o.fr||[.97,.96,.92],tk=.06;
        F.quad(u-w,v-h,u+w,v+h,.015,night?GL:GL2,night,night?null:GL);
        F.box(u,v+h+tk*.5,.04,w+tk,tk*.5,.035,fr,null,0);F.box(u,v-h-tk*.5,.04,w+tk,tk*.5,.035,fr,null,0);F.box(u-w-tk*.5,v,.04,tk*.5,h,.035,fr,null,0);F.box(u+w+tk*.5,v,.04,tk*.5,h,.035,fr,null,0);
        if(o.cross!==false){F.box(u,v,.035,.025,h,.02,fr,null,0);if(h>.3)F.box(u,v+h*.1,.035,w,.025,.02,fr,null,0)}
        F.box(u,v-h-tk-.04,.09,w+.16,.045,.09,o.sill||[.86,.84,.8],null,0);if(o.lin)F.box(u,v+h+tk+.06,.05,w+.12,.06,.05,o.lin,null,0);
        if(o.sh){for(const s of[-1,1]){const cu=u+s*(w+tk+w*.32);F.box(cu,v,.03,w*.3,h+.02,.02,o.sh,null,.05);for(let k=-2;k<=2;k++)F.box(cu,v+k*h*.36,.055,w*.27,.012,.006,dk(o.sh,.25),null,0)}}
        if(o.fb){F.box(u,v-h-.3,.14,w+.08,.12,.12,[.52,.36,.24],null,.1);for(let k=0;k<5;k++){const pt=F.pt(u-w+k*(w*2/4),v-h-.14,.16);ell(pt[0],pt[1],pt[2],.1,.09,.1,k%2?o.fb:[1,.95,.55],6)}}};
      // puerta: marco, hoja con cuarterones, pomo, escalón y (si se pide) tejadillo con ménsulas
      const door=(F,u,w,h,col,o)=>{o=o||{};const fr=o.fr||[.95,.94,.9];F.quad(u-w,0,u+w,h,.01,col,false,dk(col,.15));
        F.box(u,h+.06,.05,w+.12,.06,.05,fr,null,0);F.box(u-w-.06,h/2,.05,.06,h/2,.05,fr,null,0);F.box(u+w+.06,h/2,.05,.06,h/2,.05,fr,null,0);
        if(!o.glass){F.box(u,h*.68,.03,w*.7,h*.17,.015,lt(col,.08),null,0);F.box(u,h*.28,.03,w*.7,h*.17,.015,lt(col,.08),null,0)}else F.quad(u-w*.82,h*.12,u+w*.82,h*.92,.02,night?GL:GL2,night,night?null:GL);
        F.box(u+w*.7,h*.47,.05,.04,.04,.03,[.85,.72,.3],null,0);F.box(u,.06,.25,w+.35,.06,.25,[.68,.66,.62],null,.05);
        if(o.can){const c=o.can;F.box(u,h+.38,.42,w+.55,.05,.42,c,dk(c,.08),0);for(const s of[-1,1])F.box(u+s*(w+.4),h+.18,.26,.04,.2,.04,dk(c,.3),null,0)}};
      // zócalo de piedra y esquinas remarcadas para un cuerpo de hx×hz y altura H
      const body=(x,z,hx,hz,H,wall,o)=>{o=o||{};box(x,0,z,hx,H/2,hz,wall,null,.18);box(x,0,z,hx+.07,.22,hz+.07,o.st||[.62,.6,.57],[.7,.68,.64],.12);
        if(o.tr!==false){const tr=o.tr||lt(wall,.35);for(const sx of[-1,1])for(const sz of[-1,1])box(x+sx*hx,0,z+sz*hz,.1,H/2,.1,tr,null,.12)}
        if(o.band)box(x,o.bandY==null?H*.5:o.bandY,z,hx+.03,o.bandH||.05,hz+.03,o.band,null,0)};
      // tejado a dos aguas de tejas en hileras; A = eje de la cumbrera, C = eje transversal
      const roof=(cx,y0,cz,A,C,ha,hc,h,col,o)=>{o=o||{};const ov=o.ov==null?.35:o.ov,rows=o.rows||6,ends=o.ends,trim=o.trim||[.94,.93,.9],L=(a,c,y)=>[cx+A[0]*a+C[0]*c,y,cz+A[2]*a+C[2]*c];
        const knee=o.knee;// tejado de establo: dos pendientes por lado
        const prof=knee?[[hc+ov,-.15],[hc*.62,h*.62],[0,h]]:[[hc+ov,-ov*h/hc],[0,h]];
        for(const s of[-1,1]){for(let seg=0;seg<prof.length-1;seg++){const[c0,y0b]=prof[seg],[c1,y1b]=prof[seg+1];
            const nr=[C[0]*s*(y1b-y0b),Math.abs(c0-c1),C[2]*s*(y1b-y0b)],nl=Math.hypot(...nr),nn=nr.map(v=>v/nl);
            for(let k=0;k<rows;k++){const t0=k/rows,t1=(k+1)/rows,cA=c0+(c1-c0)*t0,cB=c0+(c1-c0)*t1,yA=y0+y0b+(y1b-y0b)*t0,yB=y0+y0b+(y1b-y0b)*t1,lift=.05,shade=(k%2?.0:.06)+vh(k+seg*9+s*31,.05),cl=dk(col,shade);
              const a=L(-ha-ov,s*cA,yA),bq=L(ha+ov,s*cA,yA),c=L(ha+ov,s*cB,yB),d=L(-ha-ov,s*cB,yB),up=nn.map(v=>v*lift);
              q(add(a,1,up),add(bq,1,up),c,d,cl,cl,lt(cl,.03),lt(cl,.03),nn);q(a,bq,add(bq,1,up),add(a,1,up),dk(col,.35),dk(col,.35),dk(col,.25),dk(col,.25),[C[0]*s,0,C[2]*s])}}
          // tabica del alero
          const e0=prof[0];q(L(-ha-ov,s*e0[0],y0+e0[1]-.16),L(ha+ov,s*e0[0],y0+e0[1]-.16),L(ha+ov,s*e0[0],y0+e0[1]),L(-ha-ov,s*e0[0],y0+e0[1]),trim,trim,trim,trim,[C[0]*s,0,C[2]*s])}
        // cumbrera
        obox(L(0,0,y0+h+.06),A,Y,C,ha+ov+.05,.07,.12,dk(col,.3),dk(col,.2),0);
        // hastiales (rellenos con el color del muro) y tablas de remate
        for(const sa of[-1,1]){const ec=ends||col;
          for(let k=0;k<prof.length-1;k++){for(const s of[-1,1]){const p0=prof[k],p1=prof[k+1],A0=L(sa*ha,s*Math.min(p0[0],hc),y0+Math.max(0,p0[1])),A1=L(sa*ha,s*p1[0],y0+p1[1]),Bc=L(sa*ha,0,y0),Ac=L(sa*ha,s*hc,y0),nn=[A[0]*sa,0,A[2]*sa];
              q(Ac,Ac,A0,Bc,ec,ec,ec,ec,nn);q(A0,A1,L(sa*ha,0,y0+p1[1]),L(sa*ha,0,y0+Math.max(0,p0[1])),ec,ec,ec,ec,nn)}}
          for(const s of[-1,1])for(let k=0;k<prof.length-1;k++){const p0=prof[k],p1=prof[k+1],m=L(sa*(ha+ov+.02),s*(p0[0]+p1[0])/2,y0+(p0[1]+p1[1])/2+.05),dC=(p1[0]-p0[0])*s,dy=p1[1]-p0[1],l=Math.hypot(dC,dy);
            const Un=[C[0]*dC/l,dy/l,C[2]*dC/l];let Vn=[C[0]*-dy/l,dC/l,C[2]*-dy/l];if(Vn[1]<0)Vn=Vn.map(v=>-v);obox(m,Un,Vn,A.map(v=>v*sa),l/2,.09,.04,trim,null,0)}}};
      const lamp=(x,z)=>{cyl(x,0,z,.07,2.4,[.2,.22,.26],null,6);box(x,0,z,.14,.08,.14,[.2,.22,.26]);box(x,2.4,z,.06,.12,.06,[.2,.22,.26]);const lc=night?[1,.9,.6]:[.95,.95,.88];
        if(night){glw([x-.16,2.62,z-.17],[x+.16,2.62,z-.17],[x+.16,2.92,z-.17],[x-.16,2.92,z-.17],lc);glw([x-.17,2.62,z+.16],[x-.17,2.62,z-.16],[x-.17,2.92,z-.16],[x-.17,2.92,z+.16],lc)}box(x,2.62,z,.17,.15,.17,lc,[.2,.22,.26],0);box(x,2.92,z,.21,.04,.21,[.2,.22,.26],null,0)};
      const flowers=(x,z,c,w)=>{w=w||.9;box(x,0,z,w,.12,.32,[.48,.34,.24],[.36,.26,.18]);for(let k=0;k<Math.round(w*5);k++)ell(x-w+.15+k*(w*2-.3)/Math.max(1,Math.round(w*5)-1),.33,z+(k%2?.1:-.08),.12,.1,.12,k%3===1?[1,.95,.55]:c,6)};
      const flag=(x,z,c)=>{cyl(x,0,z,.05,3.4,[.85,.85,.88],null,6);ell(x,3.42,z,.08,.08,.08,[.9,.78,.3],6);q1([x,2.75,z],[x+1,2.85,z],[x+1,3.35,z],[x,3.3,z],c,[0,0,-1]);q1([x+1,2.85,z],[x,2.75,z],[x,3.3,z],[x+1,3.35,z],c,[0,0,1])};
      const fence=(x0,x1,z,c)=>{const n=Math.max(2,Math.round((x1-x0)/1.1));for(let k=0;k<=n;k++)box(x0+(x1-x0)*k/n,0,z,.07,.42,.07,c,lt(c,.1),.1);box((x0+x1)/2,.55,z,(x1-x0)/2,.045,.035,c,null,0);box((x0+x1)/2,.25,z,(x1-x0)/2,.045,.035,c,null,0)};
      const chimney=(x,y,z)=>{box(x,y,z,.3,.75,.3,[.62,.38,.3],null,.1);box(x,y+1.5,z,.36,.07,.36,[.5,.5,.52],null,0)};
      const gold=[.95,.78,.28],tr5=t>=5;
      // sombra suave en el suelo y explanada empedrada
      const sh=[.2,.28,.17];q1([-b.r*.95+.5,.03,-b.r*.75+.5],[b.r*.95+.5,.03,-b.r*.75+.5],[b.r*.95+.5,.03,b.r*.75+.5],[-b.r*.95+.5,.03,b.r*.75+.5],sh,[0,1,0]);
      box(0,-1.2,0,b.r*.8,.61,b.r*.62,[.6,.58,.54],[.68,.66,.62],.1);
      if(!t){// en obras: cimientos, andamio, tablones y saco
        const wd=[.62,.45,.28],wd2=[.5,.36,.22];box(0,0,0,3.2,.12,2.4,[.72,.7,.66]);for(const[x,z]of[[-3,-2.2],[3,-2.2],[-3,2.2],[3,2.2],[0,-2.2],[0,2.2]])box(x,0,z,.1,1.7,.1,wd);
        box(0,3.4,-2.2,3.1,.08,.08,wd2);box(0,3.4,2.2,3.1,.08,.08,wd2);box(-3,3.4,0,.08,.08,2.3,wd2);box(3,3.4,0,.08,.08,2.3,wd2);box(0,1.7,-2.2,3.1,.06,.06,wd2);box(0,1.7,2.2,3.1,.06,.06,wd2);
        for(let k=0;k<4;k++)box(-1.6+k*.12,.25+k*.13,-3.3,1.1,.06,.25,k%2?wd:wd2);box(2.4,0,-3.4,.5,.4,.5,[.75,.6,.4]);box(-2.6,0,-3.3,.4,.25,.35,[.8,.78,.72]);continue}
      if(i===0){// ---- Escuela de entrenadores: casa de dos plantas con porche, tejado azul y rótulo con Poké Ball ----
        const wall=[.95,.9,.78],rf=[.24,.44,.8],sh2=[.3,.48,.78];body(0,0,3.3,2.3,4.4,wall,{band:[.86,.8,.66]});
        roof(0,4.4,0,X,Z,3.3,2.3,2,rf,{ends:wall});chimney(1.9,5.1,.8);
        const F=front(-2.3);door(F,0,.55,1.9,[.32,.46,.78],{can:rf});win(F,-2.1,1.25,.5,.48,{sh:sh2,fb:t>=2?[1,.45,.55]:null});win(F,2.1,1.25,.5,.48,{sh:sh2,fb:t>=2?[.55,.6,1]:null});
        win(F,-1.6,3.25,.42,.4,{sh:sh2});win(F,1.6,3.25,.42,.4,{sh:sh2});win(F,0,3.3,.3,.32,{});
        for(const s of[-1,1]){const S=side(s*3.3);win(S,-.9,1.3,.4,.45,{});win(S,.9,1.3,.4,.45,{});win(S,0,3.3,.4,.4,{})}
        F.box(0,2.62,.06,.9,.26,.04,[.98,.98,1],null,0);const e=F.pt(0,2.62,.11);for(let k=0;k<12;k++){const a0=k/12*6.283,a1=(k+1)/12*6.283,nn=N([0,0,-1]),col=Math.sin((a0+a1)/2)>0?[.9,.2,.24]:[1,1,1];const A=P(...e),Bq=P(e[0]+Math.cos(a0)*.2,e[1]+Math.sin(a0)*.2,e[2]),C=P(e[0]+Math.cos(a1)*.2,e[1]+Math.sin(a1)*.2,e[2]);tri(A,Bq,C,col,col,col,nn,nn,nn)}
        if(t>=3){lamp(-3.9,-2.7);lamp(3.9,-2.7)}if(t>=4)flag(-3.7,1.9,[.95,.3,.3]);if(tr5)box(0,6.47,0,3.8,.05,.1,gold);
        if(t>=4)for(let k=0;k<3;k++)box(-2+k*2,0,-5.4,.06,.02,.7,[1,1,1])}
      else if(i===1){// ---- Granja Miltank: establo con tejado de doble pendiente, portón con cruces, pajar, silo y cercado ----
        const red=[.68,.17,.15],wt=[.96,.94,.9],rf=[.36,.18,.16];box(0,0,0,3.5,1.5,2.5,red,null,.2);box(0,0,0,3.57,.18,2.57,[.55,.53,.5]);
        for(let k=-3;k<=3;k++)box(k*1.0,0,-2.53,.025,1.5,.02,dk(red,.18),null,0);for(const sx of[-1,1])for(const sz of[-1,1])box(sx*3.5,0,sz*2.5,.1,1.5,.1,wt,null,.1);
        roof(0,3,0,Z,X,2.5,3.5,2.4,rf,{ends:red,knee:1,trim:wt,rows:4});
        const F=front(-2.5);F.quad(-1.15,0,1.15,2.3,.02,dk(red,.08));for(const s of[-1,1]){F.box(s*.575,1.15,.05,.575,1.15,.025,red,null,.15);F.box(s*.575,1.15,.08,.56,.05,.02,wt,null,0);
          for(const dg of[1,-1]){const c=F.pt(s*.575,1.15,.09),ang=Math.atan2(2.1,1.05)*dg;obox(c,[Math.cos(ang),Math.sin(ang),0].map((v,k2)=>k2===1?v:v*1),[ -Math.sin(ang),Math.cos(ang),0],Zm,1.17,.05,.02,wt,null,0)}}
        F.box(0,2.33,.05,1.25,.06,.05,wt,null,0);F.box(-1.21,1.15,.05,.06,1.15,.05,wt,null,0);F.box(1.21,1.15,.05,.06,1.15,.05,wt,null,0);
        F.quad(-.55,3.15,.55,4.1,.02,[.3,.12,.1]);F.box(0,3.1,.05,.62,.05,.05,wt,null,0);F.box(0,4.15,.05,.62,.05,.05,wt,null,0);F.box(0,4.6,.4,.06,.06,.45,[.4,.3,.22],null,0);
        for(const s of[-1,1]){const S=side(s*3.5);win(S,-1,1.7,.35,.35,{fr:wt});win(S,1,1.7,.35,.35,{fr:wt})}
        // silo con aros metálicos y cúpula
        cyl(4.8,0,1.1,1.05,5,[.8,.8,.82],null,16);for(let k=1;k<6;k++)cyl(4.8,k*.85,1.1,1.075,.06,[.6,.62,.66],null,16);ell(4.8,5,1.1,1.07,.8,1.07,[.55,.58,.62],12);box(4.8,0,1.1-1.1,.12,2.4,.04,[.55,.55,.58],null,0);
        // cercado, abrevadero y Miltank
        const fc=[.92,.88,.8];fence(-4.4,3.6,-4.6,fc);fence(-4.4,-4.4+.01,-4.6,fc);box(2.2,0,-3.9,.7,.22,.25,[.45,.35,.25],[.4,.6,.8]);
        const cows=Math.min(3,1+Math.floor(t/2));for(let k=0;k<cows;k++){const cx=-2.8+k*2,cz=-3.5-(k%2)*.35;ell(cx,.88,cz,.65,.42,.4,[.95,.66,.72]);ell(cx-.72,1.08,cz,.3,.27,.27,[.98,.86,.72]);ell(cx-.98,1.02,cz,.12,.1,.17,[1,.78,.82],6);ell(cx-.72,1.36,cz-.18,.09,.07,.04,[.25,.2,.2],5);ell(cx-.72,1.36,cz+.18,.09,.07,.04,[.25,.2,.2],5);ell(cx+.15,.52,cz,.32,.14,.27,[1,.82,.88]);for(const[lx,lz]of[[-.38,-.22],[.38,-.22],[-.38,.22],[.38,.22]])cyl(cx+lx,0,cz+lz,.08,.5,[.98,.9,.8],null,5)}
        if(t>=2){for(const[x,z]of[[-4.7,1.6],[-4.6,.3],[-4.7,1]]){cyl(x,0,z,.5,.85,[.9,.76,.34],[.95,.86,.48],10)}}if(t>=3)lamp(4.2,-3.4);if(t>=4)flag(-4.3,-1.9,[.95,.85,.3]);if(tr5)box(0,5.47,0,.1,.05,2.95,gold)}
      else if(i===2){// ---- Centro Pokémon: fachada acristalada, marquesina roja, tejado a cuatro aguas y emblema ----
        const wall=[.97,.95,.92],red=[.86,.18,.2];body(0,0,3.6,2.6,3.4,wall,{tr:[.9,.88,.86],band:red,bandY:.3,bandH:.16});
        // tejado a cuatro aguas con tejas
        {const y0=3.4,ov=.3,hx=3.6+ov,hz=2.6+ov,h=1.3,rows=5;for(let k=0;k<rows;k++){const t0=k/rows,t1=(k+1)/rows,cl=dk(red,(k%2?0:.06)+vh(k,.04)),yA=y0+h*t0,yB=y0+h*t1;
            const ix=t=>hx-(hx-1.4)*t,iz=t=>hz*(1-t)+.02;q1([-ix(t0),yA,-iz(t0)],[ix(t0),yA,-iz(t0)],[ix(t1),yB,-iz(t1)],[-ix(t1),yB,-iz(t1)],cl,[0,hz,-h]);q1([ix(t0),yA,iz(t0)],[-ix(t0),yA,iz(t0)],[-ix(t1),yB,iz(t1)],[ix(t1),yB,iz(t1)],dk(cl,.05),[0,hz,h]);
            for(const s of[-1,1])q1([s*ix(t0),yA,-s*iz(t0)],[s*ix(t0),yA,s*iz(t0)],[s*ix(t1),yB,s*iz(t1)],[s*ix(t1),yB,-s*iz(t1)],dk(cl,.04),[s*h,hx-1.4,0])}
          box(0,y0+h,0,1.45,.08,.08,dk(red,.3));box(0,y0-.16,0,hx,.08,hz,[.95,.95,.95],null,0)}
        const F=front(-2.6);// entrada de cristal con puerta automática y marquesina
        F.quad(-1.3,0,1.3,2.5,.02,night?GL:GL2,night,night?null:GL);for(let k=-2;k<=2;k++)F.box(k*.65,1.25,.05,.04,1.25,.04,[.75,.78,.82],null,0);F.box(0,2.55,.05,1.38,.06,.05,[.75,.78,.82],null,0);F.box(0,.03,.3,1.6,.03,.3,[.7,.7,.72]);
        F.box(0,2.78,.55,1.9,.07,.55,red,dk(red,.1),0);for(const s of[-1,1])F.box(s*1.75,1.4,.95,.06,1.4,.06,[.85,.85,.88],null,0);
        for(const s of[-1,1]){win(F,s*2.55,1.5,.5,.55,{cross:false});const S=side(s*3.6);win(S,-1.2,1.6,.5,.55,{});win(S,1.2,1.6,.5,.55,{})}
        // emblema Poké Ball sobre la entrada
        {const e=F.pt(0,3.85,.08),nn=N([0,0,-1]);for(let k=0;k<20;k++){const a0=k/20*6.283,a1=(k+1)/20*6.283,col=Math.sin((a0+a1)/2)>0?red:[1,1,1],A=P(...e),Bq=P(e[0]+Math.cos(a0)*.62,e[1]+Math.sin(a0)*.62,e[2]),C=P(e[0]+Math.cos(a1)*.62,e[1]+Math.sin(a1)*.62,e[2]);tri(A,Bq,C,col,col,col,nn,nn,nn)}
          F.box(0,3.85,.1,.62,.04,.02,[.15,.15,.18],null,0);F.box(0,3.85,.12,.17,.17,.02,[.15,.15,.18],null,0);F.box(0,3.85,.14,.1,.1,.02,[1,1,1],null,0)}
        if(t>=2){flowers(-2.6,-3.5,[1,.45,.6]);flowers(2.6,-3.5,[1,.8,.3])}if(t>=3){lamp(-4.2,-3);lamp(4.2,-3)}if(t>=4)flag(4,1.7,[.9,.2,.24]);if(tr5)box(0,4.78,0,1.5,.04,.12,gold)}
      else if(i===3){// ---- Guardería: casa de campo con contraventanas, jardineras, chimenea y jardín con huevos ----
        const wall=[.96,.88,.72],rf=[.27,.58,.32],shc=[.35,.55,.3];body(0,0,3,2.2,3.1,wall,{st:[.6,.55,.5]});roof(0,3.1,0,X,Z,3,2.2,1.9,rf,{ends:wall,rows:5});chimney(1.7,4,.6);
        const F=front(-2.2);door(F,-.7,.52,1.85,[.55,.36,.24],{can:rf});win(F,1.55,1.45,.55,.5,{sh:shc,fb:[1,.5,.7]});win(F,-2.25,1.6,.35,.35,{});win(F,0,3.45,.35,.32,{});
        for(const s of[-1,1]){const S=side(s*3);win(S,0,1.5,.45,.45,{sh:shc})}
        const fc=[.98,.98,.96];fence(-3.6,3.6,-4.4,fc);box(0,0,-3.4,.5,.03,.9,[.72,.64,.5]);
        const eggs=Math.min(4,1+Math.floor(t/1.5));for(let k=0;k<eggs;k++){const ex=-2.6+k*1.6+(k>1?.6:0);ell(ex,.43,-3.4,.32,.42,.32,[.98,.97,.92],10);ell(ex+.12,.58,-3.7,.1,.09,.04,[.5,.75,.4],6);ell(ex-.1,.32,-3.7,.08,.07,.04,[.5,.75,.4],6)}
        if(t>=2){flowers(2.4,-3.7,[1,.5,.7],.6)}if(t>=3)lamp(3.7,-2.6);if(t>=4)flag(-3.4,1.5,[.4,.8,.5]);if(tr5)box(0,5.07,0,3.4,.05,.1,gold)}
      else if(i===4){// ---- Liga Pokémon: escalinata, columnas con basa y capitel, entablamento, frontón y copa ----
        const st=[.93,.92,.9],blu=[.2,.36,.76];for(let k=0;k<3;k++)box(0,k*.16,-.05*k,3.6-k*.15,.08,3-k*.12,lt(st,-.02*k),null,.06);
        box(0,.48,.7,3,1.35,2,st,null,.15);const F0=front(-1.3);door(F0,0,.62,2,[.3,.4,.7],{fr:[.85,.78,.5]});win(F0,-2,1.5,.4,.6,{cross:false});win(F0,2,1.5,.4,.6,{cross:false});
        for(let k=0;k<5;k++){const x=-2.8+k*1.4;box(x,.48,-2.05,.33,.1,.33,st,null,.05);cyl(x,.68,-2.05,.24,2.1,[.97,.96,.94],null,12);for(let f=0;f<8;f++){const a=f/8*6.283;box(x+Math.cos(a)*.245,.7,-2.05+Math.sin(a)*.245,.015,1.04,.015,[.86,.85,.82],null,0)}box(x,2.78,-2.05,.33,.08,.33,st,null,0);box(x,2.94,-2.05,.29,.06,.29,lt(st,.2),null,0)}
        box(0,3.06,0,3.4,.18,2.7,st,null,.08);box(0,3.42,-2.71,3.4,.12,.03,blu,null,0);box(0,3.6,0,3.5,.06,2.8,lt(st,.2),null,0);
        roof(0,3.66,0,Z,X,2.8,3.5,1.25,blu,{ends:st,ov:.1,rows:4,trim:lt(st,.1)});
        cyl(0,4.91,-2.6,.12,.22,gold,null,8);ell(0,5.38,-2.6,.34,.3,.34,gold,10);ell(-.38,5.42,-2.6,.13,.1,.05,gold,6);ell(.38,5.42,-2.6,.13,.1,.05,gold,6);
        if(t>=2)for(const s of[-1,1]){q1([s*.7-.32,2.7,-2.07],[s*.7+.32,2.7,-2.07],[s*.7+.32,1.2,-2.07],[s*.7-.32,1.2,-2.07],s<0?[.85,.22,.25]:[.22,.4,.85],[0,0,-1])}
        if(t>=3){lamp(-4,-3.3);lamp(4,-3.3)}if(t>=4){flag(-3.1,2.5,[.3,.5,.95]);flag(3.1,2.5,[.95,.8,.3])}if(tr5)box(0,3.42,-2.75,3.4,.03,.02,gold)}
      else if(i===5){// ---- Estadio: dos niveles de gradas, muro exterior con arcos, campo marcado y focos ----
        const n=28,rx=4.9,rz=3.7,s1=[.86,.32,.3],s2=[.3,.48,.86],wall=[.88,.88,.9],wd=dk(wall,.12);
        const E=(a,k)=>[Math.cos(a)*rx*k,Math.sin(a)*rz*k];
        for(let k=0;k<n;k++){const a0=k/n*6.283,a1=(k+1)/n*6.283,am=(a0+a1)/2,nm=[Math.cos(am),0,Math.sin(am)*rx/rz];
          // gradas: tres escalones por nivel
          for(let st2=0;st2<6;st2++){const k0=.6+st2*.065,k1=k0+.065,y=.3+st2*.33,col=(k+(st2>2?1:0))%2?s1:s2,cc=dk(col,st2%2?.08:0),p0=E(a0,k0),p1=E(a1,k0),p2=E(a1,k1),p3=E(a0,k1);
            q1([p0[0],y,p0[1]],[p1[0],y,p1[1]],[p2[0],y,p2[1]],[p3[0],y,p3[1]],cc,[0,1,0]);q1([p0[0],y-.33,p0[1]],[p1[0],y-.33,p1[1]],[p1[0],y,p1[1]],[p0[0],y,p0[1]],dk(cc,.25),[-nm[0],0,-nm[2]])}
          // muro exterior con arcos
          const o0=E(a0,1),o1=E(a1,1);q([o1[0],0,o1[1]],[o0[0],0,o0[1]],[o0[0],2.35,o0[1]],[o1[0],2.35,o1[1]],wd,wd,wall,wall,nm);
          const om=E(am,1.004);if(k%2===0){const archc=night?[1,.85,.5]:[.32,.34,.4],w=Math.hypot(o1[0]-o0[0],o1[1]-o0[1])*.28,tg=[-Math.sin(am)*rx,0,Math.cos(am)*rz],tl=Math.hypot(...tg),T=tg.map(v=>v/tl);
            const pa=(u,v)=>[om[0]+T[0]*u,v,om[1]+T[2]*u];if(night)glw(pa(-w,.3),pa(w,.3),pa(w,1.35),pa(-w,1.35),archc);else q1(pa(w,.3),pa(-w,.3),pa(-w,1.35),pa(w,1.35),archc,nm)}
          q1([o0[0],2.35,o0[1]],[o1[0],2.35,o1[1]],[E(a1,.98)[0],2.35,E(a1,.98)[1]],[E(a0,.98)[0],2.35,E(a0,.98)[1]],tr5?gold:[.72,.74,.78],[0,1,0]);
          q1([E(a0,.98)[0],2.35,E(a0,.98)[1]],[E(a1,.98)[0],2.35,E(a1,.98)[1]],[E(a1,.98)[0],2.3,E(a1,.98)[1]],[E(a0,.98)[0],2.3,E(a0,.98)[1]],wd,[-nm[0],0,-nm[2]])}
        // campo con líneas
        for(let k=0;k<n;k++){const a0=k/n*6.283,a1=(k+1)/n*6.283,p0=E(a0,.6),p1=E(a1,.6),nn=N([0,1,0]),A=P(0,.3,0),Bq=P(p0[0],.3,p0[1]),C=P(p1[0],.3,p1[1]),g=k%2?[.36,.66,.3]:[.4,.7,.33];tri(A,C,Bq,g,g,g,nn,nn,nn)}
        box(0,.3,0,.03,.005,rz*.58,[1,1,1],null,0);for(let k=0;k<16;k++){const a=k/16*6.283;box(Math.cos(a)*.55,.3,Math.sin(a)*.55,.05,.005,.05,[1,1,1],null,0)}for(const s of[-1,1])box(s*rx*.5,.3,0,.03,.005,.7,[1,1,1],null,0);
        // entrada principal
        const F=front(-rz*1.0);F.box(0,1.4,.1,.9,1.4,.15,wall,null,.12);F.quad(-.6,0,.6,1.6,.27,night?GL:[.3,.32,.38],night);F.box(0,2.95,.15,1.05,.18,.2,s2,null,0);
        const lights=t>=3?4:2;for(let k=0;k<lights;k++){const a=(k+.5)/lights*6.283,x=Math.cos(a)*rx*1.1,z=Math.sin(a)*rz*1.1;cyl(x,0,z,.1,3.8,[.6,.62,.66],null,6);const lc=night?[1,.96,.8]:[.92,.94,.9];
          box(x,3.8,z,.6,.32,.12,[.35,.37,.42],null,0);for(let r2=0;r2<2;r2++)for(let c2=0;c2<3;c2++){const lx=x-.38+c2*.38,ly=3.92+r2*.3;if(night)glw([lx-.13,ly,z-.13],[lx+.13,ly,z-.13],[lx+.13,ly+.22,z-.13],[lx-.13,ly+.22,z-.13],lc);else box(lx,ly,z-.08,.12,.1,.05,lc,null,0)}}
        if(t>=4)flag(0,rz+.6,[.95,.3,.35])}
      else if(i===6){// ---- Laboratorio: cuerpo moderno con ventanales corridos, azotea con máquinas, parabólica y placas ----
        const wt=[.95,.96,.97],gr=[.7,.72,.76],blu=[.24,.46,.8];box(0,0,0,3.6,1.55,2.5,wt,[.82,.84,.88],.15);box(0,0,0,3.66,.16,2.56,[.55,.56,.6]);box(1.6,3.1,.4,1.8,.8,1.8,wt,[.82,.84,.88],.1);
        const F=front(-2.5);for(const v of[1,2.35]){F.quad(-3.4,v-.42,3.4,v+.42,.015,night?GL:[.42,.6,.78],night,night?null:[.34,.5,.7]);for(let k=0;k<=8;k++)F.box(-3.4+k*.85,v,.04,.035,.42,.03,gr,null,0);F.box(0,v-.46,.05,3.45,.04,.05,gr,null,0);F.box(0,v+.46,.05,3.45,.04,.05,gr,null,0)}
        F.box(0,2.92,.04,3.6,.1,.04,blu,null,0);F.quad(-.7,0,.7,1.3,.02,night?GL:GL2,night,night?null:GL);F.box(0,1.45,.55,1.1,.05,.6,gr,null,0);for(const s of[-1,1])F.box(s*1,.72,1.05,.04,.72,.04,gr,null,0);
        for(const s of[-1,1]){const S=side(s*3.6);for(const v of[1,2.35])S.quad(-2.3,v-.4,2.3,v+.4,.015,night?GL:[.42,.6,.78],night,night?null:[.34,.5,.7])}
        const S2=front(-1.4,1.6);S2.quad(-1.5,3.4,1.5,4.3,.015,night?GL:[.42,.6,.78],night,night?null:[.34,.5,.7]);
        box(-2.4,3.1,1.2,.5,.35,.45,[.78,.8,.84],null,.1);for(let k=0;k<3;k++)box(-2.4,3.82,1.2-.25+k*.25,.42,.02,.06,[.4,.42,.46],null,0);
        cyl(-2.3,3.1,-1.2,.08,1,[.7,.72,.76],null,6);ell(-2.3,4.25,-1.2,.62,.14,.62,[.92,.94,.97],12);cyl(-2.3,4.25,-1.2,.03,.45,[.6,.62,.66],null,5);
        cyl(2.6,4.7,1.4,.04,1.6,[.75,.77,.8],null,5);if(night)glw([2.52,6.25,1.32],[2.68,6.25,1.32],[2.68,6.38,1.32],[2.52,6.38,1.32],[1,.2,.2]);else ell(2.6,6.32,1.4,.07,.07,.07,[.9,.2,.2],6);
        if(t>=2)for(let k=0;k<4;k++){const c=[-2.9+k*.95,3.25,-1.4];obox(c,X,[0,.87,-.5],[0,.5,.87],.4,.02,.55,[.18,.26,.48],[.25,.36,.62],0)}
        if(tr5)box(1.6,4.72,.4,1.85,.04,1.85,gold);if(t>=3)lamp(-4.2,-2.4);if(t>=4)flag(4,-1.3,[.3,.6,.95])}
      // árbol junto a cada edificio, por detrás, para que no quede suelto en el prado
      {const g=mix([.24,.5,.2],[.38,.6,.26],(i*.37)%1),x=(i%2?-1:1)*b.r*.45,z=b.r*.95;if(i!==5){cyl(x,0,z,.22,1.6,[.4,.28,.18],null,6);ell(x,2.4,z,1.3,1.1,1.3,g,9);ell(x+.6,2.9,z+.3,.8,.7,.8,lt(g,.06),8)}}}
    starts.push(B.n);TB.length=0;R.TB=TB;
    for(let i=0;i<TOWN.length;i++){const o={r0:starts[i],r1:starts[i+1],x0:1e9,x1:-1e9,y0:1e9,y1:-1e9,z0:1e9,z1:-1e9},A=TW.a,tp={},bt={};
      for(let k=o.r0;k<o.r1;k++){const x=A[k*9],y=A[k*9+1],z=A[k*9+2];if(y<TOWN[i].y-.15)continue;if(x<o.x0)o.x0=x;if(x>o.x1)o.x1=x;if(y<o.y0)o.y0=y;if(y>o.y1)o.y1=y;if(z<o.z0)o.z0=z;if(z>o.z1)o.z1=z;const b=Math.round(z*4);if(!(tp[b]>=y))tp[b]=y;if(!(bt[b]<=y))bt[b]=y}
        o.top=Object.keys(tp).map(b=>[tp[b],b/4]);o.bot=Object.keys(bt).map(b=>[bt[b],b/4]);TB.push(o)}
    R.camKey="";gl.bindBuffer(gl.ARRAY_BUFFER,TW.vbo);gl.bufferData(gl.ARRAY_BUFFER,TW.a.subarray(0,TW.n*9),gl.STATIC_DRAW)};
  // ---------- lo que se mueve ----------
  const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
  // nubes: cada una es un cúmulo de bolas difuminadas, con la base plana y la copa abultada; unas cerca y otras lejos
  const CL=[];for(let i=0;i<22;i++){const z=260+hash(i+7)*300,s=(13+hash(i+9)*15)*(.75+z/650),n=9+Math.floor(hash(i+5)*9),P=[];
    for(let k=0;k<n;k++){const u=(k/(n-1)-.5)*2,mid=1-u*u;P.push({dx:u*s*1.25+(hash(i*31+k)-.5)*s*.25,dy:mid*s*.42*(.6+hash(i*17+k)*.7),r:s*(.28+mid*.32)*(.75+hash(i*13+k)*.5)})}
    for(let k=0;k<Math.floor(n/2);k++)P.push({dx:(hash(i*41+k)-.5)*s*1.2,dy:s*(.35+hash(i*43+k)*.35),r:s*(.22+hash(i*47+k)*.18)});
    CL.push({x:(i/22-.5)*1400+(hash(i)-.5)*40,y:88+hash(i+3)*70+z*.12,z,s,v:.9+hash(i+11)*1.4,P})}
  const cloudPass=(t,P,VP)=>{if(!prC)return;CB.n=0;const A=CB.a,top=P.top,hor=P.hor,night=P.star>.5;
    const lit=night?mix(top,[.75,.8,.95],.35):mix([1,1,1],P.sunCol,.25),shade=night?mix(top,[0,0,0],.25):mix(mix(hor,top,.35),[.55,.58,.68],.35),aMax=night?.7:1;
    const V4=(x,y,z,c,a)=>{if(CB.n>=150000)return;const i=CB.n*7;A[i]=x;A[i+1]=y;A[i+2]=z;A[i+3]=c[0];A[i+4]=c[1];A[i+5]=c[2];A[i+6]=a;CB.n++};
    for(const k of CL){const x0=((k.x+t*k.v+700)%1400)-700,far=Math.min(1,(k.z-230)/330),fogK=.15+far*.45;
      // de las bolas de abajo a las de arriba: abajo más oscuras, arriba con la luz del sol
      const order=k.P.slice().sort((a,b)=>a.dy-b.dy);
      for(const b of order){const cx=x0+b.dx,cy=k.y+b.dy,r=b.r,hgt=Math.min(1,Math.max(0,b.dy/(k.s*.7))),seg=18;
        const cc=mix(mix(shade,lit,.25+hgt*.75),hor,fogK*.7),ce=mix(cc,hor,.25),a0=aMax*(1-far*.35);
        for(let s2=0;s2<seg;s2++){const t0=s2/seg*6.283,t1=(s2+1)/seg*6.283,sy=Math.sin(t0)<0?.62:1,sy1=Math.sin(t1)<0?.62:1;
          // cada bola: centro opaco y borde transparente (con un anillo intermedio para que el difuminado sea suave)
          const p0=[cx+Math.cos(t0)*r*.82,cy+Math.sin(t0)*r*.82*sy,k.z],p1=[cx+Math.cos(t1)*r*.82,cy+Math.sin(t1)*r*.82*sy1,k.z],q0=[cx+Math.cos(t0)*r,cy+Math.sin(t0)*r*sy,k.z],q1=[cx+Math.cos(t1)*r,cy+Math.sin(t1)*r*sy1,k.z];
          V4(cx,cy,k.z,cc,a0);V4(p0[0],p0[1],p0[2],cc,a0*.95);V4(p1[0],p1[1],p1[2],cc,a0*.95);
          V4(p0[0],p0[1],p0[2],cc,a0*.95);V4(q0[0],q0[1],q0[2],ce,0);V4(q1[0],q1[1],q1[2],ce,0);V4(p0[0],p0[1],p0[2],cc,a0*.95);V4(q1[0],q1[1],q1[2],ce,0);V4(p1[0],p1[1],p1[2],cc,a0*.95)}}}
    gl.useProgram(prC);gl.uniformMatrix4fv(uMC,false,VP);gl.bindBuffer(gl.ARRAY_BUFFER,CB.vbo);gl.bufferData(gl.ARRAY_BUFFER,A.subarray(0,CB.n*7),gl.DYNAMIC_DRAW);
    gl.disableVertexAttribArray(2);gl.vertexAttribPointer(0,3,gl.FLOAT,false,28,0);gl.vertexAttribPointer(1,4,gl.FLOAT,false,28,12);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.drawArrays(gl.TRIANGLES,0,CB.n);gl.depthMask(true);gl.disable(gl.BLEND);
    gl.enableVertexAttribArray(2);gl.useProgram(pr)};
  const buildDyn=(t,P)=>{B=DY;B.n=0;const top=P.top,hor=P.hor,low=P.low,sun=P.sunDir;
    // cúpula del cielo: degradado de arriba al horizonte y un halo alrededor del sol
    const R=700,sd=[sun[0],sun[1],sun[2]];const skyC=(dx,dy,dz)=>{const h=Math.max(0,dy);let c=mix(hor,top,Math.min(1,Math.pow(h,.55)));if(dy<0)c=mix(hor,low,Math.min(1,-dy*4));const dd=dx*sd[0]+dy*sd[1]+dz*sd[2];if(dd>0)c=mix(c,P.sunCol,Math.pow(dd,18)*.6+Math.pow(dd,3)*.12);return c};
    const SV=10,SU=24;for(let i=0;i<SV;i++)for(let j=0;j<SU;j++){const v0=-.15+i/SV*1.72,v1=-.15+(i+1)/SV*1.72,u0=Math.PI+j/SU*Math.PI*2,u1=Math.PI+((j+1)%SU)/SU*Math.PI*2,p=(v,u)=>{const cv=Math.cos(Math.min(1.5707,v)),sv=Math.sin(Math.min(1.5707,v));return[EYE[0]+Math.sin(u)*cv*R,EYE[1]+sv*R*.55,EYE[2]+Math.cos(u)*cv*R]},
        d=(v,u)=>{const cv=Math.cos(Math.min(1.5707,v));return[Math.sin(u)*cv,Math.sin(Math.min(1.5707,v)),Math.cos(u)*cv]};const a=p(v0,u0),b=p(v0,u1),c=p(v1,u1),dq=p(v1,u0);const ca=skyC(...d(v0,u0)),cb=skyC(...d(v0,u1)),cc=skyC(...d(v1,u1)),cd=skyC(...d(v1,u0));ut(a,b,c,ca,cb,cc);ut(a,c,dq,ca,cc,cd)}
    // sol o luna
    {const c=[EYE[0]+sd[0]*600,EYE[1]+sd[1]*600*.55+20,EYE[2]+sd[2]*600],r=P.star>.5?14:20,col=P.sunCol;for(let k=0;k<16;k++){const a0=k/16*6.283,a1=(k+1)/16*6.283;ut(c,[c[0]+Math.cos(a0)*r,c[1]+Math.sin(a0)*r,c[2]],[c[0]+Math.cos(a1)*r,c[1]+Math.sin(a1)*r,c[2]],col)}}
    // estrellas
    if(P.star>.05)for(let i=0;i<260;i++){const u=hash(i)*6.283,v=.08+hash(i+7)*1.3,cv=Math.cos(v),x=EYE[0]+Math.sin(u)*cv*650,y=EYE[1]+Math.sin(v)*650*.55,z=EYE[2]+Math.cos(u)*cv*650,s=.9+hash(i+3)*1.4,c=mix(top,[1,1,1],P.star*(.55+.45*Math.sin(t*1.7+i)));ut([x-s,y,z],[x+s,y,z],[x,y+s*1.6,z],c);ut([x-s,y,z],[x,y-s*1.6,z],[x+s,y,z],c)}
    // lago: olas, color del cielo y brillo del sol
    const wl=-.2,wc=P.water,whi=P.waterHi;for(let j=0;j<26;j++){const z0=40+j*4.6,z1=z0+4.6;for(let i=0;i<30;i++){const x0=-75+i*5,x1=x0+5,w=(x,z)=>wl+.18*Math.sin(x*.25+t*1.1)+.12*Math.sin(z*.31-t*1.4+x*.1);
        const col=(x,z)=>{const vx=x-EYE[0],vz=z-EYE[2],l=Math.hypot(vx,EYE[1],vz),fres=Math.min(1,.25+Math.pow(1-EYE[1]/l,4)*1.1),gl2=Math.max(0,1-Math.abs(x-(sd[0]/Math.max(.05,sd[2]))*(z-EYE[2])*.9)/(8+z*.08))*(.6+.4*Math.sin(x*.9+t*3+z*.7));return mix(mix(wc,hor,fres*.55),whi,gl2*(P.star>.5?.4:.75))};
        const a=[x0,w(x0,z0),z0],b=[x1,w(x1,z0),z0],c=[x1,w(x1,z1),z1],d=[x0,w(x0,z1),z1];ut(a,b,c,col(x0,z0),col(x1,z0),col(x1,z1));ut(a,c,d,col(x0,z0),col(x1,z1),col(x0,z1))}}
    // pájaros
    if(P.star<.5)for(let i=0;i<7;i++){const ph=(t*.035+hash(i+40))%1,x=-260+ph*520,y=48+hash(i+41)*26+Math.sin(t+i)*2,z=150+hash(i+42)*90,f=Math.sin(t*7+i*2)*1.6,c=[.18,.18,.22];ut([x-3.2,y+f,z],[x,y,z],[x-.6,y-.5,z],c);ut([x+3.2,y+f,z],[x+.6,y-.5,z],[x,y,z],c)}
    gl.bindBuffer(gl.ARRAY_BUFFER,DY.vbo);gl.bufferData(gl.ARRAY_BUFFER,DY.a.subarray(0,DY.n*9),gl.DYNAMIC_DRAW)};
  let vw=1,vh=1,built=false,cur=null,curK="";
  const R={ok:true,
    resize(w,h,scale){vw=w;vh=h;cv.width=Math.max(1,Math.round(w*scale));cv.height=Math.max(1,Math.round(h*scale));gl.viewport(0,0,cv.width,cv.height)},
    draw(t,tod){if(!built){buildStatic();built=true}
      // la luz cambia poco a poco al pasar de una hora del día a otra
      const tgt=PAL[tod]||PAL.day;if(!cur){cur=JSON.parse(JSON.stringify(tgt));curK=tod}
      if(curK!==tod){R.from=R.from||{p:lerpP(PAL[curK]||PAL.day,PAL[curK]||PAL.day,0),t:t};const k=Math.min(1,(t-R.from.t)/4);cur=lerpP(R.from.p,tgt,k);if(k>=1){curK=tod;R.from=null}}
      const P=lerpP(PAL[curK]||PAL.day,PAL[curK]||PAL.day,0);if(R.from)Object.assign(P,cur);
      // cámara: un balanceo muy lento
      R.pan+=(R.panT-R.pan)*.18;const asp=vw/vh,cam=R.cam||{E:EYE[1],p:Math.atan2(1.5,168)},sw=0,ex=EYE[0]+R.pan+sw,eye=[ex,cam.E,EYE[2]],tg=[R.pan+sw*.5,cam.E+Math.tan(cam.p)*168,140],VP=mul(persp((R.fov||(asp<1?62:44))*Math.PI/180,asp,1,1400),look(eye,tg));
      buildDyn(t,P);
      gl.clearColor(P.hor[0],P.hor[1],P.hor[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uM,false,VP);
      const L=P.sunDir,l=Math.hypot(...L);gl.uniform3f(uL,L[0]/l,L[1]/l,L[2]/l);gl.uniform3fv(uA,P.amb);gl.uniform3fv(uG,P.gnd);gl.uniform3fv(uS,P.lit);gl.uniform2f(uF,P.fog[0],P.fog[1]);gl.uniform3fv(uFc,mix(P.hor,P.low,.3));
      bind(DY);gl.drawArrays(gl.TRIANGLES,0,DY.n);bind(ST);gl.drawArrays(gl.TRIANGLES,0,ST.n);
      const tk=(R.tiers||[]).join(",")+"|"+(tod==="night"?1:0);if(tk!==townKey&&R.tiers){townKey=tk;buildTown(R.tiers,tod==="night");B=ST}if(TW.n){const tl=tod==="night"?[.35,.7,-.6]:[.5,.72,-.48],l2=Math.hypot(...tl);gl.uniform3f(uL,tl[0]/l2,tl[1]/l2,tl[2]/l2);gl.uniform3fv(uS,P.lit.map(v=>v*1.05));bind(TW);gl.drawArrays(gl.TRIANGLES,0,TW.n)}
      cloudPass(t,P,VP);R.VP=VP;R.asp=asp;if(R.band&&TB.length){const k=R.band.join(",")+"|"+vw+"x"+vh;if(k!==R.camKey){R.camKey=k;R.fit()}}},
    // coloca la cámara para que todo el pueblo quepa en la franja libre de la pantalla (entre la base de la Poké Ball y la
    // barra de abajo): el cabeceo pone los cimientos más cercanos justo encima de los carteles, y si algún tejado sube
    // por encima de la base de la Poké Ball, la cámara se eleva un poco (vista algo más desde arriba)
    band:null,cam:null,camKey:"",fov:0,
    fit(){const[yBase,yTop]=R.band,Hh=vh,asp=vw/vh,f0=asp<1?62:44,nB=1-2*yBase/Hh,nT=1-2*yTop/Hh;let best=null;
      // si en pantallas muy anchas o altas el pueblo no cabe, se abre un poco el ángulo de visión (como alejar el zoom)
      const Es=[14,13,12,11,10];for(let E=15;E<=(asp<1?40:30);E++)Es.push(E);for(let fov=f0;fov<=f0+14;fov+=2){const tf=Math.tan(fov*Math.PI/360);for(const E of Es){let p=1e9;for(const o of TB)for(const[y,z]of o.bot){const e=Math.atan2(y-E,z-.12-EYE[2]);p=Math.min(p,e-Math.atan(nB*tf))}
        let v=-1e9;for(const o of TB)for(const[y,z]of o.top){const e=Math.atan2(y-E,z+(y>E?-.12:.12)-EYE[2]);v=Math.max(v,e-p-Math.atan(nT*tf))}
        if(v<=0){R.cam={E,p};R.fov=fov;return}if(!best||v<best.v)best={E,p,v,fov}}}R.cam={E:best.E,p:best.p};R.fov=best.fov},
    pan:0,panT:0,tiers:null,
    // rectángulo en pantalla (px de la ventana) de cada edificio, y cuánto se puede desplazar la vista a los lados
    rects(){const VP=R.VP;if(!VP||!TB.length)return null;const A=TW.a,out=[];for(const o of TB){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
        for(let k=o.r0;k<o.r1;k+=2){const px=A[k*9],py=A[k*9+1],pz=A[k*9+2];if(py<o.y0-.05)continue;const w=VP[3]*px+VP[7]*py+VP[11]*pz+VP[15];if(w<=0)continue;
          const sx=((VP[0]*px+VP[4]*py+VP[8]*pz+VP[12])/w*.5+.5)*vw,sy=(1-((VP[1]*px+VP[5]*py+VP[9]*pz+VP[13])/w*.5+.5))*vh;if(sx<x0)x0=sx;if(sx>x1)x1=sx;if(sy<y0)y0=sy;if(sy>y1)y1=sy}
        out.push({x:x0,y:y0,w:x1-x0,h:y1-y0})}return out},
    panMax(){const th=Math.tan((R.fov||(R.asp<1?62:44))*Math.PI/360)*(R.asp||1.7);let m=0;for(const b of TOWN){const half=th*(b.z-EYE[2])*.93;m=Math.max(m,Math.abs(b.x)+(b.r*.6)-half)}return Math.max(0,m)}};
  return R}
// ---------- conexión con la pantalla principal ----------
(function(){const tryAttach=()=>{const bg=document.getElementById("gBg");if(!bg)return false;if(document.getElementById("gLand3"))return true;
    const cv=document.createElement("canvas");cv.id="gLand3";cv.setAttribute("aria-hidden","true");let L=null;try{L=LAND3(cv)}catch(e){L=null}if(!L)return true;
    bg.appendChild(cv);document.body.classList.add("land3");window.pcPause=1;window.LAND3I=L;
    const fit=()=>{const lite=document.body.classList.contains("lite")||(window.S&&S.o&&S.o.lite);L.resize(innerWidth,innerHeight,Math.min(1,window.devicePixelRatio||1)*(lite?.6:.85))};fit();addEventListener("resize",fit);
    const t0=performance.now();let last=0;
    const loop=ts=>{requestAnimationFrame(loop);if(document.hidden||!document.body.classList.contains("gm"))return;
      // con una ventana o una sección abierta encima, el paisaje se queda quieto
      const cover=(document.getElementById("gScr")&&!document.getElementById("gScr").hidden)||(document.getElementById("hubM")&&!document.getElementById("hubM").hidden);
      const lite=document.body.classList.contains("lite")||(window.S&&S.o&&S.o.lite),gap=cover?1500:Math.abs(L.panT-L.pan)>.05?16:lite?125:50;if(ts-last<gap)return;last=ts;
      try{if(!L._bt||ts-L._bt>1000){L._bt=ts;const pd=document.getElementById("gPed"),nv=document.getElementById("gNav");if(pd&&nv&&pd.offsetParent){const a=pd.getBoundingClientRect(),gb=nv.querySelector(".gbig .gni")||nv.querySelector(".gbig"),b=nv.getBoundingClientRect(),bt=Math.min(b.top,gb?gb.getBoundingClientRect().top+2:b.top),lh=innerWidth<700?36:44;if(bt>a.bottom+40)L.band=[Math.round(bt-lh-4),Math.round(a.bottom+5)]}}
        L.tiers=((typeof S!=="undefined"&&S&&S.g)||[]).map(n=>typeof gbTier==="function"?gbTier(n):0);L.draw((ts-t0)/1000,document.body.dataset.tod||"day");if(typeof town3Frame==="function")town3Frame(L)}catch(e){console.error(e)}};
    requestAnimationFrame(loop);return true};
  if(!tryAttach()){const iv=setInterval(()=>{if(tryAttach())clearInterval(iv)},700)}})();
