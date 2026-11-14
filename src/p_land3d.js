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
  const H=(x,z)=>{const valley=Math.exp(-Math.pow((x+6*Math.sin(z*.012))/(48+z*.18),2));
    let h=fbm(x*.018,z*.018)*16-3;
    h+=Math.pow(Math.min(1.9,Math.max(0,(z-200)/120)),1.4)*30*(.45+ridge(x*.011,z*.011));       // montañas del fondo
    h+=(1-valley)*(8+fbm(x*.03+7,z*.03)*16)*Math.min(1,Math.max(0,(z-20)/60)); // colinas de los lados
    const lake=Math.exp(-Math.pow(x/62,2)-Math.pow((z-92)/42,2));h-=lake*15;
    if(z<34)h=h*.4+1.2+fbm(x*.05,z*.05,3)*1.5;                              // prado de delante
    return h};
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
      const dens=fbm(x*.022+3,z*.022+9,3);if(dens<.47&&hsh(k,11)>.1)continue;if(Math.abs(x)<10&&z<40)continue;
      const s=(.8+hsh(k,13)*.7)*(1+z/260),pine=hsh(k,17)<.62||y>14,tone=hsh(k,19);n++;
      if(pine){const g=mix([.12,.36,.2],[.2,.46,.24],tone),g2=mix(g,[1,1,1],.1);trunk(x,y-.2,z,.22*s,1.2*s,[.36,.24,.16]);cone(x,y+.9*s,z,1.7*s,2.6*s,g,g2);cone(x,y+2.2*s,z,1.3*s,2.3*s,g,g2);cone(x,y+3.4*s,z,.9*s,2*s,g2,mix(g2,[1,1,1],.08))}
      else{const g=mix([.24,.5,.2],[.42,.62,.26],tone),g2=mix(g,[1,.95,.6],.18);trunk(x,y-.2,z,.25*s,1.8*s,[.4,.28,.18]);blob(x,y+2.8*s,z,1.9*s,1.6*s,g,g2)}}
    // rocas sueltas en el prado y en la orilla
    for(let k=0;k<70;k++){const x=(hsh(k,31)-.5)*200,z=4+hsh(k,37)*120,y=H(x,z);if(y<.2)continue;const r=.5+hsh(k,41)*1.4,c=mix([.5,.5,.5],[.62,.6,.56],hsh(k,43));blob(x,y,z,r,r*.6,c,mix(c,[1,1,1],.1))}
    gl.bindBuffer(gl.ARRAY_BUFFER,ST.vbo);gl.bufferData(gl.ARRAY_BUFFER,ST.a.subarray(0,ST.n*9),gl.STATIC_DRAW)};
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
      const asp=vw/vh,ex=EYE[0]+Math.sin(t*.05)*3,eye=[ex,EYE[1]+Math.sin(t*.07)*.6,EYE[2]],tg=[ex*.5,EYE[1]+1.5,140],VP=mul(persp((asp<1?62:44)*Math.PI/180,asp,1,1400),look(eye,tg));
      buildDyn(t,P);
      gl.clearColor(P.hor[0],P.hor[1],P.hor[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uM,false,VP);
      const L=P.sunDir,l=Math.hypot(...L);gl.uniform3f(uL,L[0]/l,L[1]/l,L[2]/l);gl.uniform3fv(uA,P.amb);gl.uniform3fv(uG,P.gnd);gl.uniform3fv(uS,P.lit);gl.uniform2f(uF,P.fog[0],P.fog[1]);gl.uniform3fv(uFc,mix(P.hor,P.low,.3));
      bind(DY);gl.drawArrays(gl.TRIANGLES,0,DY.n);bind(ST);gl.drawArrays(gl.TRIANGLES,0,ST.n);cloudPass(t,P,VP)}};
  return R}
// ---------- conexión con la pantalla principal ----------
(function(){const tryAttach=()=>{const bg=document.getElementById("gBg");if(!bg)return false;if(document.getElementById("gLand3"))return true;
    const cv=document.createElement("canvas");cv.id="gLand3";cv.setAttribute("aria-hidden","true");let L=null;try{L=LAND3(cv)}catch(e){L=null}if(!L)return true;
    bg.appendChild(cv);document.body.classList.add("land3");window.pcPause=1;
    const fit=()=>{const lite=document.body.classList.contains("lite")||(window.S&&S.o&&S.o.lite);L.resize(innerWidth,innerHeight,Math.min(1,window.devicePixelRatio||1)*(lite?.6:.85))};fit();addEventListener("resize",fit);
    const t0=performance.now();let last=0;
    const loop=ts=>{requestAnimationFrame(loop);if(document.hidden||!document.body.classList.contains("gm"))return;
      // con una ventana o una sección abierta encima, el paisaje se queda quieto
      const cover=(document.getElementById("gScr")&&!document.getElementById("gScr").hidden)||(document.getElementById("hubM")&&!document.getElementById("hubM").hidden);
      const lite=document.body.classList.contains("lite")||(window.S&&S.o&&S.o.lite),gap=cover?1500:lite?125:50;if(ts-last<gap)return;last=ts;
      try{L.draw((ts-t0)/1000,document.body.dataset.tod||"day")}catch(e){console.error(e)}};
    requestAnimationFrame(loop);return true};
  if(!tryAttach()){const iv=setInterval(()=>{if(tryAttach())clearInterval(iv)},700)}})();
