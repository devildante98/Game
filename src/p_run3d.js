// =====================================================================================
// CARRERA DE RAPIDASH EN 3D
// Motor propio con WebGL (sin librerías): todo se construye con cajas y pirámides de colores, con luz, niebla y sombras
// falsas. La cámara va detrás de Rapidash. La carrera (saltos, choques, puntos) es la misma de siempre: aquí solo se
// dibuja. Si el navegador no tiene WebGL, el juego sigue con el dibujo clásico en 2D.
// =====================================================================================
const RU3_S=32,RU3_FAR=46;// píxeles de la simulación por unidad 3D · distancia a la que aparecen los obstáculos
function RU3D(cv){let gl=null;try{gl=cv.getContext("webgl",{antialias:true,alpha:false,powerPreference:"low-power"})||cv.getContext("experimental-webgl")}catch(e){}if(!gl)return null;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
  let pr;try{pr=gl.createProgram();
    gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec3 p;attribute vec3 n;attribute vec3 c;uniform mat4 m;uniform vec3 L;uniform vec3 amb;uniform vec3 sun;uniform vec2 fog;varying vec3 vc;varying float vf;void main(){vec4 q=m*vec4(p,1.);gl_Position=q;float u=step(.01,dot(n,n));float d=max(dot(n,L),0.);vc=mix(c,c*(amb+sun*d),u);vf=u*clamp((q.w-fog.x)/(fog.y-fog.x),0.,1.);}"));
    gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec3 vc;varying float vf;uniform vec3 fogc;void main(){gl_FragColor=vec4(mix(vc,fogc,vf),1.);}"));
    gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null}catch(e){return null}
  gl.useProgram(pr);const U=k=>gl.getUniformLocation(pr,k),uM=U("m"),uL=U("L"),uA=U("amb"),uS=U("sun"),uF=U("fog"),uFc=U("fogc"),aP=gl.getAttribLocation(pr,"p"),aN=gl.getAttribLocation(pr,"n"),aC=gl.getAttribLocation(pr,"c");
  const MAXV=90000,buf=new Float32Array(MAXV*9),vbo=gl.createBuffer();let nv=0;gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,buf.byteLength,gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(aP);gl.enableVertexAttribArray(aN);gl.enableVertexAttribArray(aC);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,36,0);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,36,12);gl.vertexAttribPointer(aC,3,gl.FLOAT,false,36,24);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  // ---------- matrices (4×4 por columnas) ----------
  const I=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  const mul=(a,b)=>{const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o};
  const T=(m,x,y,z)=>{const o=new Float32Array(m);o[12]=m[0]*x+m[4]*y+m[8]*z+m[12];o[13]=m[1]*x+m[5]*y+m[9]*z+m[13];o[14]=m[2]*x+m[6]*y+m[10]*z+m[14];return o};
  const RX=(m,a)=>{const c=Math.cos(a),s=Math.sin(a);return mul(m,new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]))};
  const RY=(m,a)=>{const c=Math.cos(a),s=Math.sin(a);return mul(m,new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]))};
  const RZ=(m,a)=>{const c=Math.cos(a),s=Math.sin(a);return mul(m,new Float32Array([c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]))};
  const persp=(fov,asp,n,f)=>{const t=1/Math.tan(fov/2),o=new Float32Array(16);o[0]=t/asp;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o};
  const look=(e,c,up)=>{let zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2],l=Math.hypot(zx,zy,zz);zx/=l;zy/=l;zz/=l;let xx=up[1]*zz-up[2]*zy,xy=up[2]*zx-up[0]*zz,xz=up[0]*zy-up[1]*zx;l=Math.hypot(xx,xy,xz);xx/=l;xy/=l;xz/=l;
    const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;return new Float32Array([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1])};
  // ---------- primitivas ----------
  const hex=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255],HC={},C=h=>HC[h]||(HC[h]=hex(h));
  const mix=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
  let UNLIT=false;
  const V=(x,y,z,nx,ny,nz,c)=>{if(nv>=MAXV)return;if(UNLIT){nx=ny=nz=0}const i=nv*9;buf[i]=x;buf[i+1]=y;buf[i+2]=z;buf[i+3]=nx;buf[i+4]=ny;buf[i+5]=nz;buf[i+6]=c[0];buf[i+7]=c[1];buf[i+8]=c[2];nv++};
  const FACES=[[0,0,1,[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[0,0,-1,[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],[1,0,0,[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],[-1,0,0,[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[0,1,0,[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],[0,-1,0,[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]];
  // caja centrada en el origen de la matriz m, con medias medidas hx,hy,hz; top = color de la cara de arriba (opcional)
  const box=(m,hx,hy,hz,c,top)=>{for(let f=0;f<6;f++){const F=FACES[f],nx=m[0]*F[0]+m[4]*F[1]+m[8]*F[2],ny=m[1]*F[0]+m[5]*F[1]+m[9]*F[2],nz=m[2]*F[0]+m[6]*F[1]+m[10]*F[2],cc=f===4&&top?top:c,P=[];
      for(let k=3;k<7;k++){const q=F[k],x=q[0]*hx,y=q[1]*hy,z=q[2]*hz;P.push(m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14])}
      V(P[0],P[1],P[2],nx,ny,nz,cc);V(P[3],P[4],P[5],nx,ny,nz,cc);V(P[6],P[7],P[8],nx,ny,nz,cc);V(P[0],P[1],P[2],nx,ny,nz,cc);V(P[6],P[7],P[8],nx,ny,nz,cc);V(P[9],P[10],P[11],nx,ny,nz,cc)}};
  const M0=I(),bx=(x,y,z,hx,hy,hz,c,top)=>{M0[12]=x;M0[13]=y;M0[14]=z;box(M0,hx,hy,hz,c,top)};
  const tri=(a,b,c2,col)=>{const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c2[0]-a[0],vy=c2[1]-a[1],vz=c2[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;if(ny<0){nx=-nx;ny=-ny;nz=-nz}
    V(a[0],a[1],a[2],nx,ny,nz,col);V(b[0],b[1],b[2],nx,ny,nz,col);V(c2[0],c2[1],c2[2],nx,ny,nz,col)};
  const ut=(a,b,c2,col)=>{V(a[0],a[1],a[2],0,0,0,col);V(b[0],b[1],b[2],0,0,0,col);V(c2[0],c2[1],c2[2],0,0,0,col)};
  const pyr=(x,z,w,d,h,col,cap)=>{const a=[x-w,0,z-d],b=[x,0,z-d-w*.35],c2=[x+w,0,z-d],t=[x,h,z],lt=mix(col,[1,1,1],.1),dkc=mix(col,[0,0,0],.2);ut(a,b,t,lt);ut(b,c2,t,dkc);
    if(cap){const k=.7,L2=p=>[p[0]+(t[0]-p[0])*k,p[1]+(t[1]-p[1])*k,p[2]+(t[2]-p[2])*k-.1],A=L2(a),Bq=L2(b),Cq=L2(c2),tt=[t[0],t[1],t[2]-.1];ut(A,Bq,tt,cap);ut(Bq,Cq,tt,mix(cap,[0,0,0],.14))}};
  // cuadrado sin luz ni niebla, con un color por vértice (cielo, sol, estrellas)
  const flat=(p0,p1,p2,p3,c0,c1)=>{const W2=(p,c)=>V(p[0],p[1],p[2],0,0,0,c);W2(p0,c0);W2(p1,c0);W2(p2,c1);W2(p0,c0);W2(p2,c1);W2(p3,c1)};
  const PCc=c=>c.length===5||c.length===4?C("#"+c[1]+c[1]+c[2]+c[2]+c[3]+c[3]):C(c.slice(0,7));
  const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
  // ---------- paisajes: cambian cada 450 m ----------
  const BIO=[{g:"#63b85a",g2:"#56a84e",tr:"#c79a62",tr2:"#b58850",leaf:"#2f8a4a",leaf2:"#3fa458",trunk:"#7a4e2a",mt:"#7c8fc0",fl:"#ffd84a",snow:0},
             {g:"#b9a04e",g2:"#a88e40",tr:"#c9a070",tr2:"#b78c5c",leaf:"#d8702a",leaf2:"#e8a030",trunk:"#6a4226",mt:"#a08a9c",fl:"#ff7a5a",snow:0},
             {g:"#e8eef6",g2:"#d8e2ee",tr:"#c8cede",tr2:"#b6bed0",leaf:"#3a7a68",leaf2:"#f4f8ff",trunk:"#6a4a34",mt:"#a8b8d8",fl:"#bfe6ff",snow:1},
             {g:"#e8cf8a",g2:"#dcc078",tr:"#d8b070",tr2:"#c89c5c",leaf:"#4a9a4e",leaf2:"#62b45e",trunk:"#8a6a3a",mt:"#c89a6a",fl:"#ff9ad8",snow:0}];
  const bioAt=d=>{d=Math.max(0,d||0);const L=450,i=Math.floor(d/L),k=Math.max(0,(d-i*L-(L-70))/70),a=BIO[i%BIO.length],b=BIO[(i+1)%BIO.length],o={};for(const key in a)o[key]=key==="snow"?a.snow+(b.snow-a.snow)*k:mix(C(a[key]),C(b[key]),k);return o};
  let VP=I(),vw=1,vh=1;
  const R={
    resize(w,h,dpr){vw=w;vh=h;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);gl.viewport(0,0,cv.width,cv.height)},
    // posición de Rapidash en la pantalla (para los avisos «¡Justo!»)
    playerScreen(yUp){const x=0,y=(yUp||0)+2,z=0,w=VP[3]*x+VP[7]*y+VP[11]*z+VP[15];const r=cv.getBoundingClientRect();return[r.left+((VP[0]*x+VP[4]*y+VP[8]*z+VP[12])/w*.5+.5)*r.width,r.top+(1-((VP[1]*x+VP[5]*y+VP[9]*z+VP[13])/w*.5+.5))*r.height]},
    draw(S){nv=0;const t=S.t,camZ=S.cam/RU3_S,sp=S.spd/250,px0=S.PX+S.PW/2,ZS=x=>(x-px0)/RU3_S,night=S.sky.night,ph=S.sky.ph;
      const top=S.sky.c[0].map(v=>v/255),hor=S.sky.c[1].map(v=>v/255),dk=night?.5:ph>.55&&ph<.72?.82:1,B=bioAt(S.dist);
      // ---------- cámara ----------
      const yU=-S.y/RU3_S,shk=S.shake>0?S.shake*2:0,fov=(54+Math.min(10,(sp-1)*9))*Math.PI/180;
      const eye=[2.9+(Math.random()-.5)*shk,3.5+yU*.28+Math.sin(t*S.spd/22)*.03*(S.started&&!S.dead?1:0)+(Math.random()-.5)*shk,-5.6],tg=[-.25,1.25+yU*.35,6];
      VP=mul(persp(fov,vw/vh,.2,140),look(eye,tg,[0,1,0]));
      // ---------- cielo, sol, luna y estrellas ----------
      flat([-170,-12,96],[170,-12,96],[170,70,96],[-170,70,96],hor,top);
      if(night){for(let i=0;i<46;i++){const x=(hash(i)-.5)*220,y=10+hash(i+7)*52,s=.18+hash(i+3)*.25,c=mix(top,[1,1,1],.55+.45*Math.sin(t*2+i));flat([x-s,y-s,95],[x+s,y-s,95],[x+s,y+s,95],[x-s,y+s,95],c,c)}
        const mc=[.96,.95,.82],mx=-34,my=30;for(let k=0;k<8;k++){const a=k*Math.PI/4,b2=a+Math.PI/4;V(mx,my,94,0,0,0,mc);V(mx+Math.cos(a)*4.5,my+Math.sin(a)*4.5,94,0,0,0,mc);V(mx+Math.cos(b2)*4.5,my+Math.sin(b2)*4.5,94,0,0,0,mc)}const ms=mix(mc,top,.35);flat([mx-2,my-1,93.9],[mx-.4,my-1,93.9],[mx-.4,my+.6,93.9],[mx-2,my+.6,93.9],ms,ms);flat([mx+.8,my+1.2,93.9],[mx+2,my+1.2,93.9],[mx+2,my+2.4,93.9],[mx+.8,my+2.4,93.9],ms,ms)}
      else{const sy=30-Math.max(0,ph-.4)*95,sc=ph>.5?[1,.69,.44]:[1,.96,.69],gl2=mix(sc,hor,.6);const sx0=-34,oct=(r,z,c)=>{for(let k=0;k<8;k++){const a=k*Math.PI/4,b2=a+Math.PI/4;V(sx0,sy,z,0,0,0,c);V(sx0+Math.cos(a)*r,sy+Math.sin(a)*r,z,0,0,0,c);V(sx0+Math.cos(b2)*r,sy+Math.sin(b2)*r,z,0,0,0,c)}};oct(9,94.5,gl2);oct(5.5,94,sc)}
      // nubes
      const cc=night?mix(top,[1,1,1],.2):mix([1,1,1],hor,.12),cc2=mix(cc,top,.22);UNLIT=true;for(let i=0;i<9;i++){const x=(hash(i+20)-.5)*150,y=17+hash(i+30)*10,z=((hash(i+40)*150-camZ*.35)%150+150)%150-8;if(z>78)continue;bx(x,y,z,5+hash(i)*3,.7,2.2,cc2,cc);bx(x+2.5,y+.9,z+.6,3,.7,1.6,cc);bx(x-3,y+.6,z-.5,2.4,.6,1.4,cc)}UNLIT=false;
      // ---------- montañas del fondo ----------
      const mcol=mix(B.mt,hor,.35),mcap=mix([1,1,1],hor,.2);for(let i=0;i<13;i++){const x=(i-6)*17+((hash(i+2)-.5)*8)-(camZ*.02)%17,h=9+hash(i+11)*11;pyr(x,84+hash(i)*8,11+hash(i+5)*6,7,h,mix(mcol,[0,0,0],hash(i+9)*.12),h>13||B.snow>.5?mcap:null)}
      for(let i=0;i<16;i++){const x=(i-8)*12+((hash(i+50)-.5)*6)-(camZ*.05)%12,h=3.5+hash(i+61)*4;pyr(x,62+hash(i+70)*6,8,5,h,mix(mix(B.g2,B.mt,.45),hor,.25))}
      // ---------- suelo, pista y vallas del camino ----------
      bx(0,-.3,30,90,.3,60,B.g);
      const st=4;for(let i=Math.floor((camZ-12)/st);i<(camZ+70)/st;i++){const z=i*st-camZ;if(i%2===0)bx(0,-.29,z+st/2,90,.3,st/2,B.g2)}
      bx(0,-.27,30,2.1,.3,60,B.tr);for(let i=Math.floor((camZ-12)/2);i<(camZ+70)/2;i++){const z=i*2-camZ;bx((hash(i)-.5)*3,-.255,z,.28+hash(i+1)*.3,.3,.1,B.tr2);if(i%3===0)bx(0,-.26,z,2.1,.3,.5,B.tr2)}
      bx(-2.25,-.24,30,.14,.3,60,mix(B.g,[1,1,1],.25));bx(2.25,-.24,30,.14,.3,60,mix(B.g,[1,1,1],.25));
      const wood=C("#a9743c"),wood2=C("#8a5a2c");for(const sx of[-3.1,3.1]){bx(sx,.72,30,.05,.06,60,wood);bx(sx,.4,30,.05,.06,60,wood);for(let i=Math.floor((camZ-10)/2.5);i<(camZ+66)/2.5;i++)bx(sx,.42,i*2.5-camZ,.09,.5,.09,wood2,wood)}
      // ---------- árboles, arbustos, rocas y flores a los lados ----------
      const sn=B.snow,tree=(x,z,s,v)=>{bx(x,.7*s,z,.2*s,.7*s,.2*s,B.trunk);const l1=mix(B.leaf,[1,1,1],sn*.15),l2=mix(B.leaf2,[1,1,1],sn*.6);
          if(v<.72){bx(x,1.7*s,z,1.05*s,.45*s,1.05*s,l1,sn>.4?l2:null);bx(x,2.5*s,z,.78*s,.42*s,.78*s,mix(l1,l2,.4),sn>.4?l2:null);bx(x,3.25*s,z,.5*s,.4*s,.5*s,l2);bx(x,3.85*s,z,.22*s,.25*s,.22*s,l2)}
          else{bx(x,2.3*s,z,1.15*s,.95*s,1.15*s,l1,sn>.4?l2:null);bx(x+.5*s,3.1*s,z-.2*s,.7*s,.55*s,.7*s,l2);bx(x-.6*s,2.9*s,z+.3*s,.55*s,.45*s,.55*s,mix(l1,l2,.5))}};
      const sp2=3.2;for(let i=Math.floor((camZ-10)/sp2);i<(camZ+72)/sp2;i++){const z=i*sp2-camZ;for(const side of[-1,1]){const h=hash(i*2+(side>0?1:0)),h2=hash(i*7+side*3);
          if(h<.62)tree(side*(5.2+h2*9),z+h*1.5,.8+h2*.6,hash(i+side*13));
          if(h>.5)bx(side*(4+h2*2.2),.28,z+1.4,.5,.3,.45,mix(B.leaf2,[1,1,1],sn*.5),B.leaf2);
          if(h2>.72){const g1=C("#8f959e");bx(side*(3.9+h*3),.22,z-1,.42,.24,.36,g1,C("#b2b8c2"))}
          if(sn<.5&&h2<.3)for(let k=0;k<3;k++)bx(side*(3.6+hash(i+k)*3.4),.08,z+k*.7-.6,.07,.09,.07,k%2?B.fl:C("#ffffff"))}}
      // ---------- sombras falsas ----------
      const shc=mix(B.tr,[0,0,0],.38),shadow=(x,z,hx,hz)=>bx(x,.05,z,hx,.012,hz,shc);
      // ---------- obstáculos ----------
      const fence=(z,h,rails)=>{const hh=h/RU3_S;shadow(.25,z+.25,1.85,.22);for(const sx of[-1.75,1.75])bx(sx,hh/2,z,.11,hh/2+.04,.11,wood2,wood);for(let k=0;k<rails;k++)bx(0,hh*(.28+k*(.66/(rails-1||1))),z,1.86,.085,.07,wood,C("#c98f52"))};
      for(const o of S.obs){const z=ZS(o.x+o.w/2);
        if(o.k==="fence")fence(z,o.h,3);else if(o.k==="high")fence(z,o.h,4);else if(o.k==="fence2"){fence(ZS(o.x+o.w/2),o.h,3);fence(ZS(o.x+o.w+o.gap+o.w/2),o.h,3)}
        else if(o.k==="rock"){const h=o.h/RU3_S,g1=C("#8a9099"),g2=C("#a9afb9"),g3=C("#6e747e");shadow(.2,z+.2,1.8,.7);let m=RY(T(I(),-.75,h*.45,z),.3);box(m,.75,h*.45,.5,g1,g2);m=RY(T(I(),.55,h*.5,z+.05),-.4);box(m,.85,h*.5,.55,g3,g2);m=RY(T(I(),-.05,h*.72,z-.05),.8);box(m,.5,h*.3,.42,g2,C("#c4cad4"))}
        else if(o.k==="log"){const h=o.h/RU3_S,br=C("#7a4b25"),br2=C("#99633a"),end=C("#c99a62");shadow(.2,z+.2,1.95,1.15);for(const dz of[-.55,.55]){bx(0,h*.5,z+dz,1.85,h*.5,.48,br,br2);bx(-1.86,h*.5,z+dz,.03,h*.4,.38,end);bx(1.86,h*.5,z+dz,.03,h*.4,.38,end);for(let k=-3;k<=3;k+=2)bx(k*.45,h+.005,z+dz,.05,.005,.3,br)}}
        else if(o.k==="bat"){const y=(S.G-o.y-o.h/2)/RU3_S,fl=Math.sin(t*22)*.75,bl=C("#4f7fd0"),bl2=C("#3a64b0"),pu=C("#9a6ad8");shadow(0,z,.5,.3);
          for(const sx of[-.75,.75]){const m0=T(I(),sx,y+Math.sin(t*6+sx)*.05,z);box(m0,.26,.26,.24,bl,C("#6f9be0"));box(T(m0,-.13,.36,0),.06,.16,.05,bl2);box(T(m0,.13,.36,0),.06,.16,.05,bl2);box(T(m0,0,-.08,-.25),.12,.07,.02,C("#2a1a3a"));
            for(const w of[-1,1]){const mw=RZ(T(m0,w*.24,.05,0),w*fl);box(T(mw,w*.34,0,0),.34,.03,.2,pu);box(T(mw,w*.6,-.06,0),.14,.03,.26,bl2)}}}}
      // ---------- objetos ----------
      for(const it of S.items){const z=ZS(it.x),y=(S.G-it.y)/RU3_S+Math.sin(t*6+it.x*.05)*.08,m=RY(T(I(),0,y,z),t*3+it.x*.01);
        if(it.k==="tk"){box(m,.3,.2,.045,C("#ffcf3a"),C("#ffe98a"));box(T(m,0,0,.05),.2,.11,.01,C("#fff6c8"));box(T(m,0,0,-.05),.2,.11,.01,C("#fff6c8"))}
        else if(it.k==="fire"){const s=1+Math.sin(t*12)*.12;box(T(m,0,-.1,0),.28*s,.22,.28*s,C("#ff5a1e"));box(T(m,0,.2,0),.2*s,.2,.2*s,C("#ff9a2a"));box(T(m,0,.48,0),.11,.16,.11,C("#ffe04a"));box(RX(m,t*2),.5,.03,.5,C("#ffd35c"))}
        else{box(T(m,-.22,.05,0),.08,.24,.09,C("#e83a40"));box(T(m,.22,.05,0),.08,.24,.09,C("#e83a40"));box(T(m,0,-.22,0),.3,.08,.09,C("#e83a40"));box(T(m,-.22,.33,0),.08,.06,.09,C("#f4f4f8"));box(T(m,.22,.33,0),.08,.06,.09,C("#f4f4f8"));box(RX(m,t*2),.5,.03,.5,C("#9ad8ff"))}}
      // ---------- partículas (polvo, chispas y trozos) ----------
      for(const p of S.parts){if(p.lx==null)p.lx=(Math.random()-.5)*(p.fl?.5:1.6);const k=1-p.t/p.l,s=Math.max(.02,p.r/RU3_S*(p.fl?k:1)*.9);bx(p.lx+(p.fl?0:p.lx*p.t*1.2),Math.max(s,(S.G-p.y)/RU3_S),ZS(p.x),s,s,s,PCc(p.c))}
      // líneas de velocidad
      if(S.spd>430&&S.started&&!S.dead)for(let i=0;i<10;i++){const z=((hash(i)*50-t*60)%50+50)%50-6,x=(i%2?1:-1)*(2.6+hash(i+4)*4),y=.5+hash(i+8)*3;bx(x,y,z,.015,.015,1.6,[1,1,1])}
      // ---------- Rapidash ----------
      const air=S.y<-.5,duck=S.duck&&!air,run=S.started&&!S.dead,gp=t*S.spd/22,cream=C("#f6e6b4"),cream2=C("#fff5d6"),cream3=C("#e2cf98"),hoof=C("#4a4650"),f1=C("#ff4a1e"),f2=C("#ff8a2a"),f3=C("#ffd24a"),hot=S.shield>0;
      shadow(0,.1,.55*(1-Math.min(.6,yU*.12)),1.0*(1-Math.min(.6,yU*.12)));
      let m=T(I(),0,yU+(run&&!air?Math.abs(Math.sin(gp))*.09:0)+(duck?-.42:0),0);
      if(S.dead){const e=Math.min(1,(S.deadT||0)*1.6);m=RZ(RX(T(m,0,.5*Math.sin(e*3.1),-e*.8),e*1.5),e*.9)}else m=RX(m,Math.max(-.4,Math.min(.4,S.vy/1800))*(air?1:0)+(run&&!air?Math.sin(gp*1)*.035:0));
      box(T(m,0,1.18,0),.36,.34,.8,cream,cream2);box(T(m,0,.9,0),.3,.1,.7,cream3);
      // cuello, cabeza, cuerno y orejas
      const nk=RX(T(m,0,1.36,.62),duck?1.15:air?.28:.48+(run?Math.sin(gp*2)*.05:Math.sin(t*1.6)*.03));box(T(nk,0,.36,0),.2,.44,.23,cream,cream2);
      const hd=RX(T(nk,0,.8,.02),duck?.25:.82);box(T(hd,0,.1,.2),.18,.18,.34,cream,cream2);box(T(hd,0,.05,.56),.14,.13,.12,cream2);box(T(hd,.185,.16,.2),.012,.05,.06,C("#2a1a1a"));box(T(hd,-.185,.16,.2),.012,.05,.06,C("#2a1a1a"));
      box(T(hd,.11,.32,-.02),.045,.1,.05,cream3);box(T(hd,-.11,.32,-.02),.045,.1,.05,cream3);const hn=RX(T(hd,0,.28,.2),-.55);box(T(hn,0,.2,0),.045,.22,.045,C("#fff3c4"));box(T(hn,0,.44,0),.028,.08,.028,C("#ffffff"));
      // patas: galope, salto recogido o agachada
      const leg=(sx,hz,ph2,front)=>{let a,kn;if(air){a=front?-1.0:.75;kn=front?1.5:.35}else if(duck){a=front?-.95:.95;kn=front?2.1:-2.1}else if(run){a=Math.sin(gp+ph2)*.95;kn=Math.max(0,Math.sin(gp+ph2+1.9))*1.35}else{a=0;kn=0}
        const up=RX(T(m,sx,.92,hz),a);box(T(up,0,-.2,0),.095,.24,.1,cream,cream2);const lo=RX(T(up,0,-.42,0),kn);box(T(lo,0,-.2,0),.075,.22,.08,cream);box(T(lo,0,-.44,.015),.095,.065,.11,hoof);
        const s=.8+Math.sin(t*16+sx*5+hz)*.25;box(T(lo,0,-.3,-.1),.07*s,.1*s,.06,f2);box(T(lo,0,-.22,-.15),.04*s,.07*s,.04,f3)};
      leg(.25,.56,0,true);leg(-.25,.56,.55,true);leg(.25,-.6,Math.PI,false);leg(-.25,-.6,Math.PI+.55,false);
      // crin y cola de fuego
      const fs=hot?1.45:1,fl2=(mm,x,y,z,s,i)=>{const k=(1+Math.sin(t*15+i*1.7)*.22)*s*fs,sw=Math.sin(t*9+i)*.05;box(T(mm,x+sw,y,z),.13*k,.17*k,.12*k,i%3===0?f1:i%3===1?f2:f3)};
      for(let i=0;i<5;i++)fl2(nk,0,.05+i*.19,-.27-(run?.05*i*Math.min(1.6,sp):0),1.05-i*.07,i);fl2(hd,0,.34,.05,.8,7);fl2(hd,0,.44,-.08,.55,8);
      for(let i=0;i<4;i++)fl2(m,0,1.62+Math.sin(t*10+i)*.03,.42-i*.3,.95-i*.1,i+10);
      for(let i=0;i<6;i++){const w=run?Math.sin(t*9-i*.9)*.1*(1+i*.3):Math.sin(t*3-i)*.04;fl2(m,w,1.36+i*(run?.07:.02)-i*i*.012,-.86-i*(run?.26:.17),1.25-i*.14,i+20)}
      if(hot)for(let i=0;i<8;i++){const a=t*4+i*Math.PI/4;bx(Math.cos(a)*1.25,yU+1.2+Math.sin(t*7+i)*.35,Math.sin(a)*1.5,.11,.16,.11,i%2?f2:f3)}
      if(S.magnet>0)for(let i=0;i<4;i++){const a=-t*3+i*Math.PI/2;bx(Math.cos(a)*1.05,yU+2.45,Math.sin(a)*1.05,.08,.08,.08,i%2?C("#e83a40"):C("#9ad8ff"))}
      // ---------- a la GPU ----------
      const amb=night?[.36,.4,.62]:[.58*dk,.6*dk,.66*dk],sun=night?[.3,.34,.5]:ph>.5&&ph<.72?[.75,.52,.36]:[.62,.6,.52];
      gl.clearColor(hor[0],hor[1],hor[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uM,false,VP);gl.uniform3f(uL,.42,.8,-.42);gl.uniform3fv(uA,amb);gl.uniform3fv(uS,sun);gl.uniform2f(uF,26,74);gl.uniform3fv(uFc,hor);
      gl.bufferSubData(gl.ARRAY_BUFFER,0,buf.subarray(0,nv*9));gl.drawArrays(gl.TRIANGLES,0,nv)}};
  return R}
