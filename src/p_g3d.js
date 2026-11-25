// =====================================================================================
// MOTOR 3D LIGERO (WebGL, sin librerías) para los minijuegos 3D y la Base secreta
// · Mallas de colores con luz y niebla: cajas, esferas, cilindros, conos y toros (anillos), que se pueden juntar.
// · Imágenes planas que siempre miran a la cámara (los Pokémon), con transparencia.
// · Si el navegador no tiene WebGL, G3D() devuelve null y cada juego usa su dibujo en 2D.
// =====================================================================================
const G3M={
  id:()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
  mul(a,b){const o=new Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s}return o},
  persp(fov,asp,n,f){const t=1/Math.tan(fov/2),d=n-f;return[t/asp,0,0,0,0,t,0,0,0,0,(f+n)/d,-1,0,0,2*f*n/d,0]},
  look(e,c,u){let z=[e[0]-c[0],e[1]-c[1],e[2]-c[2]];const zl=Math.hypot(...z)||1;z=z.map(v=>v/zl);
    let x=[u[1]*z[2]-u[2]*z[1],u[2]*z[0]-u[0]*z[2],u[0]*z[1]-u[1]*z[0]];const xl=Math.hypot(...x)||1;x=x.map(v=>v/xl);
    const y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];
    return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*e[0]+x[1]*e[1]+x[2]*e[2]),-(y[0]*e[0]+y[1]*e[1]+y[2]*e[2]),-(z[0]*e[0]+z[1]*e[1]+z[2]*e[2]),1]},
  // matriz de modelo: posición, giro (Y, luego X, luego Z) y escala
  trs(p,r,s){r=r||[0,0,0];s=s==null?[1,1,1]:typeof s==="number"?[s,s,s]:s;
    const[cx,sx]=[Math.cos(r[0]),Math.sin(r[0])],[cy,sy]=[Math.cos(r[1]),Math.sin(r[1])],[cz,sz]=[Math.cos(r[2]),Math.sin(r[2])];
    // R = Ry * Rx * Rz
    const m00=cy*cz+sy*sx*sz,m01=-cy*sz+sy*sx*cz,m02=sy*cx,m10=cx*sz,m11=cx*cz,m12=-sx,m20=-sy*cz+cy*sx*sz,m21=sy*sz+cy*sx*cz,m22=cy*cx;
    return[m00*s[0],m10*s[0],m20*s[0],0,m01*s[1],m11*s[1],m21*s[1],0,m02*s[2],m12*s[2],m22*s[2],0,p[0],p[1],p[2],1]},
  ap(m,v){return[m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12],m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13],m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14]]}
};
// ---------- constructores de mallas: devuelven {p:[...],n:[...],c:[...]} (triángulos sueltos) ----------
const G3B={
  hex(h){h=String(h||"#fff").replace("#","");if(h.length===3)h=h.split("").map(x=>x+x).join("");const v=parseInt(h,16);return[(v>>16&255)/255,(v>>8&255)/255,(v&255)/255]},
  _tri(o,a,b,c,col){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const l=Math.hypot(...n)||1;n=n.map(x=>x/l);
    o.p.push(...a,...b,...c);o.n.push(...n,...n,...n);o.c.push(...col,...col,...col)},
  _smooth(o,a,b,c,na,nb,nc,col){o.p.push(...a,...b,...c);o.n.push(...na,...nb,...nc);o.c.push(...col,...col,...col)},
  box(w,h,d,col){const o={p:[],n:[],c:[]},C=Array.isArray(col)?col:G3B.hex(col),x=w/2,y=h/2,z=d/2;
    const v=[[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z],[-x,-y,-z],[x,-y,-z],[x,y,-z],[-x,y,-z]];
    [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]].forEach((f,i)=>{const cc=i===4?C.map(q=>Math.min(1,q*1.08)):C;G3B._tri(o,v[f[0]],v[f[1]],v[f[2]],cc);G3B._tri(o,v[f[0]],v[f[2]],v[f[3]],cc)});return o},
  // esfera; col puede ser una función (x,y,z normalizados) → color, para pintar por zonas
  sphere(r,seg,col){const o={p:[],n:[],c:[]},S=seg||12,R=Math.max(4,Math.round(S*.75));const P=(i,j)=>{const th=i/R*Math.PI,ph=j/S*Math.PI*2;return[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)]};
    const cf=typeof col==="function"?col:(()=>{const c=Array.isArray(col)?col:G3B.hex(col);return()=>c})();
    for(let i=0;i<R;i++)for(let j=0;j<S;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1),m=P(i+.5,j+.5),cc=cf(m[0],m[1],m[2]),s=v=>v.map(q=>q*r);
      if(i>0)G3B._smooth(o,s(a),s(c),s(b),a,c,b,cc);if(i<R-1)G3B._smooth(o,s(a),s(d),s(c),a,d,c,cc);else G3B._smooth(o,s(a),s(d),s(c),a,d,c,cc)}
    return o},
  cyl(rt,rb,h,seg,col,caps){const o={p:[],n:[],c:[]},S=seg||12,C=Array.isArray(col)?col:G3B.hex(col),y=h/2,sl=(rb-rt)/h;
    for(let j=0;j<S;j++){const a0=j/S*Math.PI*2,a1=(j+1)/S*Math.PI*2,c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1);
      const n0=[c0,sl,s0],n1=[c1,sl,s1];const A=[c0*rb,-y,s0*rb],B=[c1*rb,-y,s1*rb],Cc=[c1*rt,y,s1*rt],D=[c0*rt,y,s0*rt];
      G3B._smooth(o,A,Cc,B,n0,n1,n1,C);G3B._smooth(o,A,D,Cc,n0,n0,n1,C);
      if(caps!==false){if(rt>0)G3B._tri(o,[0,y,0],Cc,D,C);if(rb>0)G3B._tri(o,[0,-y,0],A,B,C)}}
    return o},
  torus(R,r,seg,sides,col){const o={p:[],n:[],c:[]},S=seg||24,T=sides||8,C=Array.isArray(col)?col:G3B.hex(col);
    const P=(i,j)=>{const u=i/S*Math.PI*2,v=j/T*Math.PI*2,cx=Math.cos(u),sx=Math.sin(u);return{p:[(R+r*Math.cos(v))*cx,(R+r*Math.cos(v))*sx,r*Math.sin(v)],n:[Math.cos(v)*cx,Math.cos(v)*sx,Math.sin(v)]}};
    for(let i=0;i<S;i++)for(let j=0;j<T;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);G3B._smooth(o,a.p,b.p,c.p,a.n,b.n,c.n,C);G3B._smooth(o,a.p,c.p,d.p,a.n,c.n,d.n,C)}
    return o},
  // junta varias mallas, cada una con su matriz (G3M.trs)
  merge(list){const o={p:[],n:[],c:[]};list.forEach(([g,m])=>{for(let i=0;i<g.p.length;i+=3){const v=m?G3M.ap(m,[g.p[i],g.p[i+1],g.p[i+2]]):[g.p[i],g.p[i+1],g.p[i+2]];
      let n=[g.n[i],g.n[i+1],g.n[i+2]];if(m){n=[m[0]*n[0]+m[4]*n[1]+m[8]*n[2],m[1]*n[0]+m[5]*n[1]+m[9]*n[2],m[2]*n[0]+m[6]*n[1]+m[10]*n[2]];const l=Math.hypot(...n)||1;n=n.map(x=>x/l)}
      o.p.push(...v);o.n.push(...n);o.c.push(g.c[i],g.c[i+1],g.c[i+2])}});return o}
};
function G3D(cv){let gl=null;try{gl=cv.getContext("webgl",{antialias:true,alpha:false,powerPreference:"low-power",preserveDrawingBuffer:false})||cv.getContext("experimental-webgl")}catch(e){}if(!gl)return null;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
  const prog=(vs,fs)=>{const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error("link");return p};
  let P1,P2;
  try{
    P1=prog("attribute vec3 p;attribute vec3 n;attribute vec3 c;uniform mat4 V;uniform mat4 M;uniform vec3 L;uniform vec3 amb;uniform vec3 sun;uniform vec4 T;uniform vec3 cam;varying vec3 vc;varying float vd;"+
      "void main(){vec4 w=M*vec4(p,1.);gl_Position=V*w;vec3 N=normalize(mat3(M)*n);float d=max(dot(N,L),0.);vec3 base=c*T.rgb;vc=mix(base*(amb+sun*d),base,T.a);vd=distance(w.xyz,cam);}",
      "precision mediump float;varying vec3 vc;varying float vd;uniform vec3 fogc;uniform vec2 fog;uniform float A;void main(){float f=clamp((vd-fog.x)/(fog.y-fog.x),0.,1.);gl_FragColor=vec4(mix(vc,fogc,f),A);}");
    P2=prog("attribute vec2 q;uniform mat4 V;uniform vec3 C;uniform vec2 Sz;uniform vec3 R;uniform vec3 U;uniform vec3 cam;varying vec2 uv;varying float vd;"+
      "void main(){vec3 w=C+R*(q.x*Sz.x)+U*((q.y+.5)*Sz.y);gl_Position=V*vec4(w,1.);uv=vec2(q.x+.5,.5-q.y);vd=distance(w,cam);}",
      "precision mediump float;varying vec2 uv;varying float vd;uniform sampler2D tx;uniform vec3 fogc;uniform vec2 fog;uniform vec4 K;void main(){vec4 t=texture2D(tx,uv);if(t.a<.45)discard;float f=clamp((vd-fog.x)/(fog.y-fog.x),0.,1.);gl_FragColor=vec4(mix(t.rgb*K.rgb,fogc,f),t.a*K.a);}");
  }catch(e){return null}
  const U1={},U2={};["V","M","L","amb","sun","T","cam","fogc","fog","A"].forEach(k=>U1[k]=gl.getUniformLocation(P1,k));["V","C","Sz","R","U","cam","tx","fogc","fog","K"].forEach(k=>U2[k]=gl.getUniformLocation(P2,k));
  const A1={p:gl.getAttribLocation(P1,"p"),n:gl.getAttribLocation(P1,"n"),c:gl.getAttribLocation(P1,"c")},A2=gl.getAttribLocation(P2,"q");
  const qb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,qb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-.5,-.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,-.5,.5]),gl.STATIC_DRAW);
  const bufs=[],texs=[];
  const E={gl,W:300,H:200,dpr:1,V:G3M.id(),cam:[0,0,5],R:[1,0,0],U:[0,1,0],sky:[.55,.75,1],fogR:[30,80],L:[.4,.8,.45],amb:[.55,.55,.62],sun:[.6,.58,.5],lost:false,
    resize(w,h,dpr){E.W=w;E.H=h;E.dpr=dpr||1;cv.width=Math.max(1,Math.round(w*E.dpr));cv.height=Math.max(1,Math.round(h*E.dpr));gl.viewport(0,0,cv.width,cv.height)},
    mesh(g){const mk=a=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(a),gl.STATIC_DRAW);bufs.push(b);return b};
      return{p:mk(g.p),n:mk(g.n),c:mk(g.c),k:g.p.length/3}},
    // imagen (con CORS) como textura; mientras carga, no se dibuja
    tex(url){const t={ok:false,g:gl.createTexture(),w:1,h:1};texs.push(t.g);const im=new Image();im.crossOrigin="anonymous";im.decoding="async";
      im.onload=()=>{try{gl.bindTexture(gl.TEXTURE_2D,t.g);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        t.w=im.naturalWidth;t.h=im.naturalHeight;t.ok=true}catch(e){t.ok=false}};im.onerror=()=>{t.bad=true};im.src=url;return t},
    // cámara: ojo, punto al que mira, campo de visión
    camera(eye,at,fov,up){const asp=E.W/Math.max(1,E.H),P=G3M.persp(fov||1,asp,.1,400),Vw=G3M.look(eye,at,up||[0,1,0]);E.V=G3M.mul(P,Vw);E.cam=eye.slice();E.R=[Vw[0],Vw[4],Vw[8]];E.U=[Vw[1],Vw[5],Vw[9]]},
    begin(){gl.clearColor(E.sky[0],E.sky[1],E.sky[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.disable(gl.BLEND);
      gl.useProgram(P1);gl.uniformMatrix4fv(U1.V,false,E.V);gl.uniform3fv(U1.L,E.L);gl.uniform3fv(U1.amb,E.amb);gl.uniform3fv(U1.sun,E.sun);gl.uniform3fv(U1.cam,E.cam);gl.uniform3fv(U1.fogc,E.sky);gl.uniform2fv(U1.fog,E.fogR);gl.uniform1f(U1.A,1)},
    // dibuja una malla: m = matriz (G3M.trs), tint = [r,g,b] multiplica el color, glow = 0..1 (1 = sin sombra, brilla)
    draw(ms,m,tint,glow,alpha){gl.useProgram(P1);gl.uniformMatrix4fv(U1.M,false,m||G3M.id());const t=tint||[1,1,1];gl.uniform4f(U1.T,t[0],t[1],t[2],glow||0);
      if(alpha!=null&&alpha<1){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.uniform1f(U1.A,alpha)}
      [["p",ms.p],["n",ms.n],["c",ms.c]].forEach(([k,b])=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(A1[k]);gl.vertexAttribPointer(A1[k],3,gl.FLOAT,false,0,0)});
      gl.drawArrays(gl.TRIANGLES,0,ms.k);
      if(alpha!=null&&alpha<1){gl.disable(gl.BLEND);gl.depthMask(true);gl.uniform1f(U1.A,1)}},
    // imagen que mira a la cámara: c = punto de los pies, h = alto (el ancho sale de la imagen); k = [r,g,b,a]
    sprite(t,c,h,k,flip){if(!t||!t.ok)return false;gl.useProgram(P2);gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.uniformMatrix4fv(U2.V,false,E.V);gl.uniform3fv(U2.C,c);gl.uniform2f(U2.Sz,h*t.w/t.h*(flip?-1:1),h);gl.uniform3fv(U2.R,E.R);gl.uniform3fv(U2.U,E.U);gl.uniform3fv(U2.cam,E.cam);gl.uniform3fv(U2.fogc,E.sky);gl.uniform2fv(U2.fog,E.fogR);
      const kk=k||[1,1,1,1];gl.uniform4f(U2.K,kk[0],kk[1],kk[2],kk[3]==null?1:kk[3]);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,t.g);gl.uniform1i(U2.tx,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,qb);gl.enableVertexAttribArray(A2);gl.vertexAttribPointer(A2,2,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,6);
      gl.disableVertexAttribArray(A2);gl.disable(gl.BLEND);gl.enable(gl.CULL_FACE);return true},
    // punto 3D → píxeles de la pantalla (para poner textos encima)
    toScreen(v){const m=E.V,x=m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12],y=m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13],w=m[3]*v[0]+m[7]*v[1]+m[11]*v[2]+m[15];if(w<=0)return null;return[(x/w*.5+.5)*E.W,(1-(y/w*.5+.5))*E.H]},
    free(){try{bufs.forEach(b=>gl.deleteBuffer(b));texs.forEach(t=>gl.deleteTexture(t));gl.deleteBuffer(qb);const x=gl.getExtension("WEBGL_lose_context");if(x)x.loseContext()}catch(e){}bufs.length=0;texs.length=0}
  };
  cv.addEventListener("webglcontextlost",e=>{e.preventDefault();E.lost=true},false);
  return E}
