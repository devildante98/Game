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
  const TOWN=[{x:33,z:28,yaw:-32,r:5.2},{x:22.5,z:31.5,yaw:72,r:5.6},{x:10.5,z:25,yaw:-10,r:5},{x:0,z:27.5,yaw:0,r:5},{x:-10.5,z:25,yaw:12,r:5.2},{x:-23,z:32,yaw:0,r:5.6},{x:-33.5,z:27,yaw:40,r:5.2}];// (la x positiva se ve a la izquierda)
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
      // de coordenadas del edificio (x a la derecha de la fachada, y arriba, z hacia dentro) al mundo
      const SC=.88,P=(x,y,z)=>[b.x+(x*b.ca+z*b.sa)*SC,b.y+y*SC,b.z+(-x*b.sa+z*b.ca)*SC],N=(x,y,z)=>[x*b.ca+z*b.sa,y,-x*b.sa+z*b.ca];
      const q4=(a,bq,c,d,col,n)=>{const A=P(...a),Bq=P(...bq),Cq=P(...c),D=P(...d),nn=n?N(...n):fn(A,Bq,Cq);tri(A,Bq,Cq,col,col,col,nn,nn,nn);tri(A,Cq,D,col,col,col,nn,nn,nn)};
      const glow=(a,bq,c,d,col)=>{const A=P(...a),Bq=P(...bq),Cq=P(...c),D=P(...d);ut(A,Bq,Cq,col);ut(A,Cq,D,col)};
      const box=(x,y,z,hx,hy,hz,col,top)=>{const X0=x-hx,X1=x+hx,Y0=y,Y1=y+hy*2,Z0=z-hz,Z1=z+hz,sd=mix(col,[0,0,0],.08);
        q4([X0,Y0,Z0],[X1,Y0,Z0],[X1,Y1,Z0],[X0,Y1,Z0],col,[0,0,-1]);q4([X1,Y0,Z1],[X0,Y0,Z1],[X0,Y1,Z1],[X1,Y1,Z1],sd,[0,0,1]);
        q4([X0,Y0,Z1],[X0,Y0,Z0],[X0,Y1,Z0],[X0,Y1,Z1],sd,[-1,0,0]);q4([X1,Y0,Z0],[X1,Y0,Z1],[X1,Y1,Z1],[X1,Y1,Z0],sd,[1,0,0]);q4([X0,Y1,Z0],[X1,Y1,Z0],[X1,Y1,Z1],[X0,Y1,Z1],top||col,[0,1,0])};
      // tejado a dos aguas a lo largo de x; ends = color de los hastiales
      const gable=(x,y,z,hx,hz,h,col,ends,ov)=>{ov=ov||.35;const X0=x-hx-ov,X1=x+hx+ov,Z0=z-hz-ov,Z1=z+hz+ov,Y=y+h,sd=mix(col,[0,0,0],.12);
        q4([X0,y,Z0],[X1,y,Z0],[X1,Y,z],[X0,Y,z],col,[0,hz,-h]);q4([X1,y,Z1],[X0,y,Z1],[X0,Y,z],[X1,Y,z],sd,[0,hz,h]);
        const e=ends||col;for(const[xx,nx]of[[x-hx,-1],[x+hx,1]]){const A=P(xx,y,z-hz),Bq=P(xx,y,z+hz),Cq=P(xx,Y-.05,z),nn=N(nx,0,0);tri(A,Bq,Cq,e,e,e,nn,nn,nn)}
        q4([X0,y-.12,Z0],[X1,y-.12,Z0],[X1,y,Z0],[X0,y,Z0],mix(col,[0,0,0],.3),[0,0,-1])};
      const cyl=(x,y,z,r,h,col,top,seg)=>{seg=seg||12;for(let k=0;k<seg;k++){const a0=k/seg*6.283,a1=(k+1)/seg*6.283,c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1);
          q4([x+c0*r,y,z+s0*r],[x+c1*r,y,z+s1*r],[x+c1*r,y+h,z+s1*r],[x+c0*r,y+h,z+s0*r],col,[(c0+c1)/2,0,(s0+s1)/2]);if(top){const A=P(x,y+h,z),Bq=P(x+c0*r,y+h,z+s0*r),Cq=P(x+c1*r,y+h,z+s1*r),nn=[0,1,0];tri(A,Cq,Bq,top,top,top,nn,nn,nn)}}};
      const cone=(x,y,z,r,h,col,seg)=>{seg=seg||10;const T=P(x,y+h,z);for(let k=0;k<seg;k++){const a0=k/seg*6.283,a1=(k+1)/seg*6.283,A=P(x+Math.cos(a0)*r,y,z+Math.sin(a0)*r),Bq=P(x+Math.cos(a1)*r,y,z+Math.sin(a1)*r),nn=N(Math.cos((a0+a1)/2),.6,Math.sin((a0+a1)/2));tri(A,Bq,T,col,col,col,nn,nn,nn)}};
      const ell=(x,y,z,rx,ry,rz,col,seg)=>{seg=seg||8;const R2=5,pt=(i2,j)=>{const v=i2/R2*Math.PI,u=j/seg*6.283;return[Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)]};
        for(let i2=0;i2<R2;i2++)for(let j=0;j<seg;j++){const a=pt(i2,j),bq=pt(i2,j+1),c=pt(i2+1,j+1),d=pt(i2+1,j),w=q=>[x+q[0]*rx,y+q[1]*ry,z+q[2]*rz];const A=P(...w(a)),Bq=P(...w(bq)),Cq=P(...w(c)),D=P(...w(d));tri(A,Bq,Cq,col,col,col,N(...a),N(...bq),N(...c));tri(A,Cq,D,col,col,col,N(...a),N(...c),N(...d))}};
      // círculo en la fachada (emblemas), mirando hacia -z
      const disc=(x,y,z,r,col,seg)=>{seg=seg||16;for(let k=0;k<seg;k++){const a0=k/seg*6.283,a1=(k+1)/seg*6.283,nn=N(0,0,-1),A=P(x,y,z),Bq=P(x+Math.cos(a0)*r,y+Math.sin(a0)*r,z),Cq=P(x+Math.cos(a1)*r,y+Math.sin(a1)*r,z);tri(A,Bq,Cq,col,col,col,nn,nn,nn)}};
      // ventana en la fachada delantera (z = zf), o en un lateral; de noche se enciende
      const WIN=night?[1,.82,.45]:[.55,.72,.86],FR=[.96,.95,.9];
      const win=(x,y,zf,w,h,side)=>{if(side){const xs=side;q4([xs,y-h-.06,zf-w-.06],[xs,y-h-.06,zf+w+.06],[xs,y+h+.06,zf+w+.06],[xs,y+h+.06,zf-w-.06],FR,[Math.sign(xs),0,0]);const o=Math.sign(xs)*.03;if(night)glow([xs+o,y-h,zf-w],[xs+o,y-h,zf+w],[xs+o,y+h,zf+w],[xs+o,y+h,zf-w],WIN);else q4([xs+o,y-h,zf-w],[xs+o,y-h,zf+w],[xs+o,y+h,zf+w],[xs+o,y+h,zf-w],WIN,[Math.sign(xs),0,0]);return}
        q4([x-w-.06,y-h-.06,zf-.02],[x+w+.06,y-h-.06,zf-.02],[x+w+.06,y+h+.06,zf-.02],[x-w-.06,y+h+.06,zf-.02],FR,[0,0,-1]);if(night)glow([x-w,y-h,zf-.05],[x+w,y-h,zf-.05],[x+w,y+h,zf-.05],[x-w,y+h,zf-.05],WIN);else q4([x-w,y-h,zf-.05],[x+w,y-h,zf-.05],[x+w,y+h,zf-.05],[x-w,y+h,zf-.05],WIN,[0,0,-1])};
      const door=(x,zf,w,h,col)=>{q4([x-w,0,zf-.04],[x+w,0,zf-.04],[x+w,h,zf-.04],[x-w,h,zf-.04],col,[0,0,-1]);box(x+w*.6,h*.45,zf-.08,.05,.05,.03,[.85,.75,.3])};
      // sombra en el suelo y explanada de piedra
      const sh=mix([.22,.3,.18],[0,0,0],.35);q4([-b.r*.9+.6,.02,-b.r*.7+.6],[b.r*.9+.6,.02,-b.r*.7+.6],[b.r*.9+.6,.02,b.r*.7+.6],[-b.r*.9+.6,.02,b.r*.7+.6],sh,[0,1,0]);
      box(0,-1.2,0,b.r*.78,.62,b.r*.6,[.58,.56,.52],[.66,.64,.6]);
      const lamp=(x,z)=>{cyl(x,0,z,.07,2.6,[.2,.22,.26],null,6);const lc=night?[1,.9,.6]:[.9,.92,.85];if(night)glow([x-.18,2.5,z-.18],[x+.18,2.5,z-.18],[x+.18,2.85,z-.18],[x-.18,2.85,z-.18],lc);box(x,2.5,z,.2,.18,.2,lc,[.2,.22,.26])};
      const flower=(x,z,c)=>{box(x,0,z,.45,.14,.3,[.45,.32,.22]);for(let k=0;k<4;k++)ell(x-.3+k*.2,.36,z,.11,.09,.11,k%2?c:[1,.95,.5],6)};
      const flag=(x,z,c)=>{cyl(x,0,z,.05,3.4,[.85,.85,.88],null,6);q4([x,2.75,z],[x+1,2.85,z],[x+1,3.35,z],[x,3.3,z],c,[0,0,-1]);q4([x+1,2.85,z],[x,2.75,z],[x,3.3,z],[x+1,3.35,z],c,[0,0,1])};
      const gold=[.95,.78,.28];
      if(!t){// en obras: cimientos, andamio de madera y tablones
        const wd=[.62,.45,.28],wd2=[.5,.36,.22];box(0,0,0,3.2,.12,2.4,[.7,.68,.64]);for(const[x,z]of[[-3,-2.2],[3,-2.2],[-3,2.2],[3,2.2],[0,-2.2],[0,2.2]])box(x,0,z,.1,1.7,.1,wd);
        box(0,3.4,-2.2,3.1,.08,.08,wd2);box(0,3.4,2.2,3.1,.08,.08,wd2);box(-3,3.4,0,.08,.08,2.3,wd2);box(3,3.4,0,.08,.08,2.3,wd2);box(0,1.7,-2.2,3.1,.06,.06,wd2);
        for(let k=0;k<4;k++)box(-1.6+k*.12,.25+k*.13,-3.3,1.1,.06,.25,k%2?wd:wd2);box(2.4,0,-3.4,.5,.4,.5,[.75,.6,.4]);continue}
      const tr=t>=5?gold:null;
      if(i===0){// escuela de entrenadores
        const wall=[.95,.9,.78],roof=[.24,.46,.82];box(0,0,0,3.4,1.7,2.4,wall);gable(0,3.4,0,3.4,2.4,1.9,roof,wall);if(tr)box(0,5.28,0,3.8,.06,.08,tr);
        door(0,-2.4,.6,1.9,[.36,.5,.82]);win(-2.1,2.2,-2.4,.55,.45);win(2.1,2.2,-2.4,.55,.45);win(0,2.3,0,.5,.4,3.4);win(0,2.3,0,.5,.4,-3.4);
        box(0,2.55,-2.5,.95,.32,.04,[.98,.98,1]);disc(0,2.87,-2.56,.24,[.9,.2,.24]);disc(0,2.87,-2.57,.09,[1,1,1],10);
        if(t>=2){flower(-2.2,-3.1,[1,.4,.5]);flower(2.2,-3.1,[.5,.6,1])}if(t>=3){lamp(-3.9,-2.6);lamp(3.9,-2.6)}if(t>=4)flag(-3.6,1.8,[.95,.3,.3]);
        if(t>=4){for(let k=0;k<3;k++)box(-2+k*2,0,-5.6,.06,.02,.6,[1,1,1])}}
      else if(i===1){// granja: establo rojo, silo y cercado con Miltank
        const red=[.72,.18,.16],wt=[.96,.94,.9],dk2=[.32,.14,.12];box(0,0,0,3.6,1.6,2.5,red);gable(0,3.2,0,3.6,2.5,2,dk2,red);
        q4([-1.1,0,-2.52],[1.1,0,-2.52],[1.1,2.2,-2.52],[-1.1,2.2,-2.52],wt,[0,0,-1]);q4([-.95,.1,-2.55],[.95,.1,-2.55],[.95,2.05,-2.55],[-.95,2.05,-2.55],red,[0,0,-1]);
        for(const sgn of[-1,1]){const A=[-.95*sgn,.1,-2.58],Bq=[-.8*sgn,.1,-2.58],C2=[.95*sgn,2.05,-2.58],D=[.8*sgn,2.05,-2.58];q4(A,Bq,C2,D,wt,[0,0,-1])}
        win(0,2.9,-2.5,.45,.3);cyl(4.6,0,1,1.05,4.6,[.86,.86,.88]);ell(4.6,4.6,1,1.07,.75,1.07,[.55,.58,.62]);if(tr)cyl(4.6,4.5,1,1.09,.12,tr);
        // cercado y Miltank
        const fc=[.92,.88,.8];for(let k=0;k<6;k++){box(-4.4+k*1.6,0,-4.6,.07,.5,.07,fc)}box(-.4,.55,-4.6,4,.05,.04,fc);box(-.4,.9,-4.6,4,.05,.04,fc);
        const cows=Math.min(3,1+Math.floor(t/2));for(let k=0;k<cows;k++){const cx=-2.6+k*2.2,cz=-3.4-(k%2)*.4;ell(cx,.85,cz,.62,.42,.38,[.95,.68,.74]);ell(cx-.7,1.05,cz,.3,.26,.26,[.98,.85,.7]);ell(cx+.1,.55,cz,.32,.14,.28,[1,.82,.88]);for(const[lx,lz]of[[-.35,-.2],[.35,-.2],[-.35,.2],[.35,.2]])cyl(cx+lx,0,cz+lz,.08,.5,[.98,.9,.8],null,5)}
        if(t>=2){cyl(-4.6,0,1.6,.55,.9,[.9,.78,.35],[.95,.85,.45]);cyl(-4.5,0,.4,.55,.9,[.88,.75,.32],[.95,.85,.45])}if(t>=3)lamp(4,-3.4);if(t>=4)flag(-4.2,-1.8,[.95,.85,.3])}
      else if(i===2){// Centro Pokémon
        const wall=[.97,.95,.92],red=[.88,.2,.22];box(0,0,0,3.6,1.6,2.6,wall);box(0,3.2,0,3.75,.22,2.75,red,[.92,.3,.3]);box(0,3.64,0,2.2,.4,1.6,red,[.95,.36,.36]);
        q4([-3.62,1.1,-2.62],[3.62,1.1,-2.62],[3.62,1.4,-2.62],[-3.62,1.4,-2.62],red,[0,0,-1]);
        q4([-1.1,0,-2.64],[1.1,0,-2.64],[1.1,2.3,-2.64],[-1.1,2.3,-2.64],night?[1,.9,.65]:[.62,.84,.95],[0,0,-1]);box(0,0,-2.66,.03,1.15,.03,[.8,.85,.9]);
        win(-2.5,2.3,-2.6,.55,.42);win(2.5,2.3,-2.6,.55,.42);win(0,2.2,-.8,.5,.4,3.6);win(0,2.2,.8,.5,.4,3.6);
        disc(0,2.85,-2.68,.55,[1,1,1]);for(let k=0;k<12;k++){const a0=k/12*Math.PI,a1=(k+1)/12*Math.PI,nn=N(0,0,-1),A=P(0,2.85,-2.7),Bq=P(Math.cos(a0)*.55,2.85+Math.sin(a0)*.55,-2.7),C2=P(Math.cos(a1)*.55,2.85+Math.sin(a1)*.55,-2.7);tri(A,Bq,C2,red,red,red,nn,nn,nn)}
        q4([-.55,2.81,-2.71],[.55,2.81,-2.71],[.55,2.89,-2.71],[-.55,2.89,-2.71],[.15,.15,.18],[0,0,-1]);disc(0,2.85,-2.72,.16,[.15,.15,.18],10);disc(0,2.85,-2.73,.1,[1,1,1],10);
        if(tr)box(0,3.62,0,3.8,.04,2.8,tr);if(t>=2){flower(-2.6,-3.3,[1,.45,.6]);flower(2.6,-3.3,[1,.8,.3])}if(t>=3){lamp(-4.1,-2.9);lamp(4.1,-2.9)}if(t>=4)flag(3.9,1.6,[.9,.2,.24])}
      else if(i===3){// guardería: casita con tejado verde, chimenea y huevos en el jardín
        const wall=[.96,.88,.72],roof=[.26,.62,.34];box(0,0,0,3,1.5,2.3,wall);gable(0,3,0,3,2.3,1.8,roof,wall);box(1.6,4.1,.6,.32,.6,.32,[.62,.42,.34]);
        door(-.6,-2.3,.55,1.85,[.55,.38,.26]);win(1.6,2,-2.3,.55,.45);win(-2.1,2.2,-2.3,.4,.35);win(0,2.1,0,.5,.4,-3);
        const fc=[.98,.98,.96];for(let k=0;k<7;k++)box(-3.6+k*1.2,0,-4.3,.06,.42,.06,fc);box(0,.6,-4.3,3.6,.05,.04,fc);
        const eggs=Math.min(4,1+Math.floor(t/1.5));for(let k=0;k<eggs;k++){const ex=-2.5+k*1.5;ell(ex,.42,-3.3,.32,.42,.32,[.98,.97,.92],10);ell(ex+.1,.55,-3.6,.09,.08,.04,[.5,.75,.4],6)}
        if(tr)box(0,4.82,0,3.4,.05,.08,tr);if(t>=3)lamp(3.7,-2.6);if(t>=4)flag(-3.4,1.5,[.4,.8,.5]);if(t>=2)flower(2.4,-3.2,[1,.5,.7])}
      else if(i===4){// Liga Pokémon: columnas, frontón azul y copa dorada
        const st=[.92,.92,.95],blu=[.2,.36,.78];box(0,0,0,3.4,.2,2.8,[.8,.8,.84]);box(0,.4,.6,3,1.5,2,st);for(let k=0;k<5;k++)cyl(-2.8+k*1.4,.4,-1.9,.24,2.8,[.97,.97,.99],null,10);
        box(0,3.2,0,3.4,.22,2.8,st);gable(0,3.64,0,3.4,2.8,1.2,blu,blu,.1);for(let k=0;k<3;k++)box(0,.13*k,-2.9-k*.35,2.6,.07,.2,[.86,.86,.9]);
        door(0,-1.42,.7,2.1,[.3,.4,.7]);cyl(0,4.84,0,.12,.25,[.9,.75,.25]);ell(0,5.32,0,.34,.3,.34,gold,10);ell(-.38,5.36,0,.13,.1,.05,gold,6);ell(.38,5.36,0,.13,.1,.05,gold,6);
        if(tr)box(0,3.62,-2.82,3.4,.05,.05,tr);if(t>=3){lamp(-3.9,-3);lamp(3.9,-3)}if(t>=4){flag(-3,2.4,[.3,.5,.95]);flag(3,2.4,[.95,.8,.3])}if(t>=2)flower(-2.4,-4.2,[.6,.6,1])}
      else if(i===5){// estadio: gradas ovaladas alrededor del campo, y focos
        const n=24,rx=4.9,rz=3.7,seat=[.86,.36,.3],seat2=[.32,.5,.86],wall=[.9,.9,.92];
        for(let k=0;k<n;k++){const a0=k/n*6.283,a1=(k+1)/n*6.283,c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1),col=k%2?seat:seat2;
          q4([c0*rx*.62,.3,s0*rz*.62],[c1*rx*.62,.3,s1*rz*.62],[c1*rx,2.2,s1*rz],[c0*rx,2.2,s0*rz],col,[-(c0+c1)/2,1.4,-(s0+s1)/2]);
          q4([c1*rx,0,s1*rz],[c0*rx,0,s0*rz],[c0*rx,2.3,s0*rz],[c1*rx,2.3,s1*rz],wall,[(c0+c1)/2,0,(s0+s1)/2]);q4([c0*rx,2.2,s0*rz],[c1*rx,2.2,s1*rz],[c1*rx,2.3,s1*rz],[c0*rx,2.3,s0*rz],tr||[.7,.72,.76],[0,1,0]);
          if(night&&k%3===0)glow([c0*rx*1.002,1.2,s0*rz*1.002],[c1*rx*1.002,1.2,s1*rz*1.002],[c1*rx*1.002,1.5,s1*rz*1.002],[c0*rx*1.002,1.5,s0*rz*1.002],[1,.85,.5])}
        for(let k=0;k<n;k++){const a0=k/n*6.283,a1=(k+1)/n*6.283;const nn=N(0,1,0),A=P(0,.3,0),Bq=P(Math.cos(a0)*rx*.62,.3,Math.sin(a0)*rz*.62),C2=P(Math.cos(a1)*rx*.62,.3,Math.sin(a1)*rz*.62);tri(A,C2,Bq,[.36,.68,.32],[.36,.68,.32],[.36,.68,.32],nn,nn,nn)}
        box(0,.31,0,.04,.005,rz*.6,[1,1,1]);
        const lights=t>=3?4:2;for(let k=0;k<lights;k++){const a=(k+.5)/lights*6.283,x=Math.cos(a)*rx*1.08,z=Math.sin(a)*rz*1.08;cyl(x,0,z,.1,3.8,[.6,.62,.66],null,6);const lc=night?[1,.96,.8]:[.92,.94,.9];if(night)glow([x-.5,3.8,z],[x+.5,3.8,z],[x+.5,4.4,z],[x-.5,4.4,z],lc);box(x,3.8,z,.55,.3,.18,lc,[.4,.42,.46])}
        if(t>=4)flag(0,rz+.4,[.95,.3,.35])}
      else if(i===6){// laboratorio: edificio blanco moderno, franja azul, antena y placas solares
        const wt=[.96,.97,.98],blu=[.26,.5,.82];box(0,0,0,3.6,1.5,2.5,wt,[.86,.88,.9]);box(1.6,3,.4,1.8,.8,1.8,wt,[.86,.88,.9]);q4([-3.62,2.2,-2.52],[3.62,2.2,-2.52],[3.62,2.5,-2.52],[-3.62,2.5,-2.52],blu,[0,0,-1]);
        for(let k=0;k<4;k++)win(-2.6+k*1.5,1.5,-2.5,.5,.35);q4([-1.4,0,-2.54],[.2,0,-2.54],[.2,1.15,-2.54],[-1.4,1.15,-2.54],night?[1,.9,.65]:[.62,.84,.95],[0,0,-1]);
        win(0,1.7,0,1.4,.4,3.6);win(0,1.7,0,1.4,.4,-3.6);cyl(-2.2,3,1,.08,1.2,[.7,.72,.76],null,6);ell(-2.2,4.25,1,.55,.12,.55,[.9,.92,.95],10);
        if(t>=2)for(let k=0;k<3;k++){const m=box;m(-2.6+k*1.1,3.05,-1.4,.45,.04,.6,[.18,.24,.42],[.22,.3,.55])}if(tr)box(1.6,4.62,.4,1.85,.04,1.85,tr);if(t>=3)lamp(-4.1,-2.4);if(t>=4)flag(3.9,-1.2,[.3,.6,.95])}
      // árbol o arbusto junto a cada edificio, para que no quede suelto en el prado
      {const g=mix([.24,.5,.2],[.38,.6,.26],(i*.37)%1),x=(i%2?-1:1)*b.r*.45,z=b.r*.95;if(i!==5){cyl(x,0,z,.22,1.6,[.4,.28,.18],null,6);ell(x,2.4,z,1.3,1.1,1.3,g,9)}}}
    starts.push(B.n);TB.length=0;R.TB=TB;
    for(let i=0;i<TOWN.length;i++){const o={r0:starts[i],r1:starts[i+1],x0:1e9,x1:-1e9,y0:1e9,y1:-1e9,z0:1e9,z1:-1e9},A=TW.a;
      for(let k=o.r0;k<o.r1;k++){const x=A[k*9],y=A[k*9+1],z=A[k*9+2];if(y<TOWN[i].y-.15)continue;if(x<o.x0)o.x0=x;if(x>o.x1)o.x1=x;if(y<o.y0)o.y0=y;if(y>o.y1)o.y1=y;if(z<o.z0)o.z0=z;if(z>o.z1)o.z1=z}TB.push(o)}
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
      R.pan+=(R.panT-R.pan)*.18;const asp=vw/vh,cam=R.cam||{E:EYE[1],p:Math.atan2(1.5,168)},sw=Math.sin(t*.05)*3,ex=EYE[0]+R.pan+sw,eye=[ex,cam.E,EYE[2]],tg=[R.pan+sw*.5,cam.E+Math.tan(cam.p)*168,140],VP=mul(persp((asp<1?62:44)*Math.PI/180,asp,1,1400),look(eye,tg));
      buildDyn(t,P);
      gl.clearColor(P.hor[0],P.hor[1],P.hor[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uM,false,VP);
      const L=P.sunDir,l=Math.hypot(...L);gl.uniform3f(uL,L[0]/l,L[1]/l,L[2]/l);gl.uniform3fv(uA,P.amb);gl.uniform3fv(uG,P.gnd);gl.uniform3fv(uS,P.lit);gl.uniform2f(uF,P.fog[0],P.fog[1]);gl.uniform3fv(uFc,mix(P.hor,P.low,.3));
      bind(DY);gl.drawArrays(gl.TRIANGLES,0,DY.n);bind(ST);gl.drawArrays(gl.TRIANGLES,0,ST.n);
      const tk=(R.tiers||[]).join(",")+"|"+(tod==="night"?1:0);if(tk!==townKey&&R.tiers){townKey=tk;buildTown(R.tiers,tod==="night");B=ST}if(TW.n){const tl=tod==="night"?[.35,.7,-.6]:[.5,.72,-.48],l2=Math.hypot(...tl);gl.uniform3f(uL,tl[0]/l2,tl[1]/l2,tl[2]/l2);gl.uniform3fv(uS,P.lit.map(v=>v*1.05));bind(TW);gl.drawArrays(gl.TRIANGLES,0,TW.n)}
      cloudPass(t,P,VP);R.VP=VP;R.asp=asp;if(R.band&&TB.length){const k=R.band.join(",")+"|"+vw+"x"+vh;if(k!==R.camKey){R.camKey=k;R.fit()}}},
    // coloca la cámara para que todo el pueblo quepa en la franja libre de la pantalla (entre la base de la Poké Ball y la
    // barra de abajo): el cabeceo pone los cimientos más cercanos justo encima de los carteles, y si algún tejado sube
    // por encima de la base de la Poké Ball, la cámara se eleva un poco (vista algo más desde arriba)
    band:null,cam:null,camKey:"",
    fit(){const[yBase,yTop]=R.band,Hh=vh,asp=vw/vh,tf=Math.tan((asp<1?62:44)*Math.PI/360),nB=1-2*yBase/Hh,nT=1-2*yTop/Hh;let best=null;
      for(let E=14;E<=(asp<1?40:30);E+=1){let p=1e9;for(const o of TB){const e=Math.atan2(o.y0-E,o.z0-EYE[2]);p=Math.min(p,e-Math.atan(nB*tf))}
        let v=-1e9;for(const o of TB){const e=Math.atan2(o.y1-E,o.z1-EYE[2]);v=Math.max(v,e-p-Math.atan(nT*tf))}
        if(v<=0){R.cam={E,p};return}if(!best||v<best.v)best={E,p,v}}R.cam={E:best.E,p:best.p}},
    pan:0,panT:0,tiers:null,
    // rectángulo en pantalla (px de la ventana) de cada edificio, y cuánto se puede desplazar la vista a los lados
    rects(){const VP=R.VP;if(!VP||!TB.length)return null;const A=TW.a,out=[];for(const o of TB){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
        for(let k=o.r0;k<o.r1;k+=2){const px=A[k*9],py=A[k*9+1],pz=A[k*9+2];if(py<o.y0-.05)continue;const w=VP[3]*px+VP[7]*py+VP[11]*pz+VP[15];if(w<=0)continue;
          const sx=((VP[0]*px+VP[4]*py+VP[8]*pz+VP[12])/w*.5+.5)*vw,sy=(1-((VP[1]*px+VP[5]*py+VP[9]*pz+VP[13])/w*.5+.5))*vh;if(sx<x0)x0=sx;if(sx>x1)x1=sx;if(sy<y0)y0=sy;if(sy>y1)y1=sy}
        out.push({x:x0,y:y0,w:x1-x0,h:y1-y0})}return out},
    panMax(){const th=Math.tan((R.asp<1?62:44)*Math.PI/360)*(R.asp||1.7);let m=0;for(const b of TOWN){const half=th*(b.z-EYE[2])*.93;m=Math.max(m,Math.abs(b.x)+(b.r*.6)-half)}return Math.max(0,m)}};
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
      try{if(!L._bt||ts-L._bt>1000){L._bt=ts;const pd=document.getElementById("gPed"),nv=document.getElementById("gNav");if(pd&&nv&&pd.offsetParent){const a=pd.getBoundingClientRect(),gb=nv.querySelector(".gbig .gni")||nv.querySelector(".gbig"),b=nv.getBoundingClientRect(),bt=Math.min(b.top,gb?gb.getBoundingClientRect().top+2:b.top),lh=innerWidth<700?36:44;if(bt>a.bottom+40)L.band=[Math.round(bt-lh-4),Math.round(a.bottom+14)]}}
        L.tiers=((typeof S!=="undefined"&&S&&S.g)||[]).map(n=>typeof gbTier==="function"?gbTier(n):0);L.draw((ts-t0)/1000,document.body.dataset.tod||"day");if(typeof town3Frame==="function")town3Frame(L)}catch(e){console.error(e)}};
    requestAnimationFrame(loop);return true};
  if(!tryAttach()){const iv=setInterval(()=>{if(tryAttach())clearInterval(iv)},700)}})();
