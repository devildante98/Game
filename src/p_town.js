// =====================================================================================
// DETALLES DE LA SAGA EN PUEBLOS Y RUTAS (antes en p_saga.js por error: ese nombre es del módulo de tickets y objetos de Exploración)
// · Desniveles (-) en las rutas: se saltan hacia abajo, pero no se pueden subir (hay que rodearlos).
// · Pueblos: farolas (+) junto a las calles (se encienden de noche), buzón (!) al lado de la puerta de cada casa
//   y bancos (&) cerca del agua. Rutas: tocones (:) sueltos por la hierba.
// · Los caminos que cruzan el agua se ven como puentes de madera.
// Los adornos se colocan solos al cargar el mapa, siempre en casillas sueltas que no cortan el paso.
// =====================================================================================
const SG_DECO="+!&:";
// ---------- desniveles ----------
{const _b=exBlocked;exBlocked=function(x,y){const c=exAt(x,y);if(SG_DECO.includes(c))return true;
  if(c==="-")return !(EX.x===x&&EX.y===y-1&&!EX.surf&&!_b.call(this,x,y+1)&&exAt(x,y+1)!=="-");return _b.apply(this,arguments)}}
{const _a=exArrive;exArrive=function(){const r=_a.apply(this,arguments);try{if(exAt(EX.x,EX.y)==="-"&&!EX.mv){EX.trail.unshift({x:EX.x,y:EX.y});EX.trail.length=3;EX.mv={x0:EX.x,y0:EX.y,t:0,d:190,_bk:1};EX.y+=1;EX.f="d";EX.hop=performance.now();snd("ui")}}catch(e){console.error(e)}return r}}
{const _t=exDrawTr;exDrawTr=function(g,code,face,x,y,fr,beat,me,ph){if(me&&EX.hop){const p=(performance.now()-EX.hop)/190;if(p<1)y-=Math.sin(p*Math.PI)*10;else EX.hop=0}return _t.call(this,g,code,face,x,y,fr,beat,me,ph)}}
function sgLedge(m,v){const k="SGL"+m+"_"+v;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");xGrassBase(g,v);const L=m&8?0:2,R=m&2?16:14;
  X2(g,L,7,R-L,1,"#c4f4a8");X2(g,L,8,R-L,2,"#9ce080");X2(g,L,10,R-L,3,"#4c9840");for(let x=L+(v%2);x<R;x+=3)X2(g,x,10,1,2,"#3c8838");X2(g,L,13,R-L,1,"#2e6c2e");X2(g,L,14,R-L,1,"#68b450");
  if(!(m&8)){X2(g,1,8,1,5,"#4c9840");X2(g,2,7,1,1,"#9ce080")}if(!(m&2)){X2(g,14,8,1,5,"#3c8838");X2(g,13,7,1,1,"#9ce080")}return XG[k]=c}
// ---------- puente de madera ----------
function sgBridge(vert,v){const k="SGB"+(vert?1:0)+v;if(XG[k])return XG[k];const c=xc(32,32),g=c.getContext("2d");X2(g,0,0,16,16,"#4a90e8");const P="#c89858",Pd="#9a6c38",Pl="#e4bc80",O="#4a2c12";
  if(vert){X2(g,2,0,12,16,P);for(let y=0;y<16;y+=4){X2(g,2,y+3,12,1,Pd);X2(g,2,y,12,1,Pl)}X2(g,1,0,1,16,O);X2(g,14,0,1,16,O);X2(g,2,0,1,16,"#7a4e24");X2(g,13,0,1,16,"#7a4e24");[2,10].forEach(y=>{X2(g,1,y,2,3,O);X2(g,13,y,2,3,O);X2(g,1,y,2,1,Pl);X2(g,13,y,2,1,Pl)});X2(g,0,0,1,16,"#3a78d4");X2(g,15,0,1,16,"#3a78d4")}
  else{X2(g,0,2,16,12,P);for(let x=0;x<16;x+=4){X2(g,x+3,2,1,12,Pd);X2(g,x,2,1,12,Pl)}X2(g,0,1,16,1,O);X2(g,0,14,16,1,O);X2(g,0,2,16,1,"#7a4e24");X2(g,0,13,16,1,"#7a4e24");[2,10].forEach(x=>{X2(g,x,0,3,3,O);X2(g,x,13,3,2,O);X2(g,x,0,3,1,Pl);X2(g,x,13,3,1,Pl)});X2(g,0,15,16,1,"#3a78d4")}
  return XG[k]=c}
{const _g=xGround;xGround=function(x,y,fr){try{const c=exAt(x,y),M=EX.M,v=Math.floor(exRnd(x,y,7)*4),P=t=>M.pal?xPal(t,M.pal):t;
    if(c==="-")return P(sgLedge(xMask(x,y,q=>q==="-"),v));
    if(M.pal&&(c==="j"||c==="r"||c==="v"))return xPal(_g.apply(this,arguments),M.pal);
    if(SG_DECO.includes(c)){const k="SGG"+v;if(!XG[k]){const cv=xc(32,32);xGrassBase(cv.getContext("2d"),v);XG[k]=cv}return P(XG[k])}
    if(c==="h"&&M.bld){if(!M._pv){M._pv={};M.bld.forEach(b=>{if(/^(fountain|statue)$/.test(b.k)&&exAt(b.x,b.y-1)==="=")for(let yy=b.y;yy<b.y+b.h;yy++)for(let xx=b.x;xx<b.x+b.w;xx++)M._pv[xx+","+yy]=1})}
      if(M._pv[x+","+y])return P(xPath(255,v,M.base))}
    if(c==="="&&M.base!=="F"){const w=q=>q==="~";if(w(exAt(x-1,y))&&w(exAt(x+1,y)))return P(sgBridge(1,v));if(w(exAt(x,y-1))&&w(exAt(x,y+1)))return P(sgBridge(0,v))}}catch(e){}return _g.apply(this,arguments)}}
// ---------- adornos ----------
function sgObj(c,v,night){const k="SGO"+c+v+(night?1:0);if(XG[k])return XG[k];const cv=xc(32,48),g=cv.getContext("2d");
  if(c==="+"){xdisc(g,16,44,7,2,"rgba(0,0,0,.24)");const O="#20242e",Y=night?"#ffe890":"#eef2f8",Y2=night?"#ffc840":"#c4ccd8";
    X2(g,6,20,4,2,O);X2(g,7,7,2,14,O);X2(g,7,8,1,12,"#5a6478");X2(g,5,1,6,1,O);X2(g,4,2,8,5,O);X2(g,5,2,6,4,Y);X2(g,5,5,6,1,Y2);X2(g,7,2,2,4,night?"#fff8d0":"#ffffff");X2(g,6,7,4,1,O);
    if(night){g.fillStyle="rgba(255,232,144,.16)";g.fillRect(2,0,28,20);g.fillStyle="rgba(255,232,144,.12)";g.fillRect(6,20,20,8)}}
  else if(c==="!"){xdisc(g,16,44,6,2,"rgba(0,0,0,.24)");n6B(g,4,11,[".kkkkkk.","krrrrrrk","krwwwwrk","krrrrrrk","krrrdrrk",".kkkkkk.","...kp...","...kp...","...kp...","...kp...","..kkkk.."],{k:"#3a1418",r:v%2?"#4a8ae0":"#e04848",w:"#fff4e8",d:"#ffd040",p:"#9a6434"})}
  else if(c==="&"){xdisc(g,16,44,13,2.5,"rgba(0,0,0,.24)");n6B(g,1,11,["kkkkkkkkkkkkkk","kllllllllllllk","kbbbbbbbbbbbbk","kkkkkkkkkkkkkk",".kp........pk.","kkkkkkkkkkkkkk","kllllllllllllk","kbbbbbbbbbbbbk","kkkkkkkkkkkkkk",".kk........kk.",".kk........kk."],{k:"#3a2010",l:"#e8b878",b:"#c08848",p:"#8a5a2c"})}
  else{xdisc(g,16,44,10,2.5,"rgba(0,0,0,.24)");n6B(g,3,12,["..kkkkkk..",".kllllllk.","kllmmmmllk","klmllllmlk","klmlmmlmlk","kllmmmmllk","kbllllllbk","kbdbbdbbdk","kbdbbdbbdk","kkbbbbbbkk",".kk.kk.kk."],{k:"#3a2414",l:"#e8c890",m:"#c09858",b:"#9a6c3c",d:"#7a5028"},v%2===1)}
  return XG[k]=cv}
{const _o=xObj;xObj=function(c,x,y){if(SG_DECO.includes(c)){const t=sgObj(c,Math.floor(exRnd(x,y,7)*4),c==="+"&&typeof wxNight==="function"&&wxNight());return c!=="+"&&EX.M&&EX.M.pal?xPal(t,EX.M.pal):t}return _o.apply(this,arguments)}}
// colocación automática (siempre igual para cada mapa)
function sgPlace(){const M=EX.M,G=EX.grid;if(!M||!G||M.base==="F"||M.base==="c")return;const H=G.length,W=G[0].length,at=(x,y)=>G[y]?G[y][x]:null;
  const walk=(x,y)=>{const c=at(x,y);return c==="."||c===","||c==="="||c==="s"};
  const iso=(x,y)=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if((a||b)&&!walk(x+a,y+b))return false;return true};
  let hid=[];try{hid=typeof fdHidden==="function"?fdHidden(EX.map):[]}catch(e){}
  const busy=(x,y)=>EX.npcs.some(n=>Math.abs(n.px-x)<=1&&Math.abs(n.py-y)<=1)||(Math.abs(EX.x-x)<=1&&Math.abs(EX.y-y)<=1)||hid.some(h=>h[0]===x&&h[1]===y);
  const put=(x,y,c)=>{if(at(x,y)!=="."||busy(x,y))return false;G[y][x]=c;return true};
  if(M.music==="town"){
    (M.bld||[]).forEach(b=>{if(!/^house/.test(b.k))return;const dx=b.x+b.door,fy=b.y+b.h;for(const sx of[dx+1,dx-1])if(at(sx,fy)==="."&&walk(sx,fy+1)&&put(sx,fy,"!"))break});
    let n=0;for(let y=2;y<H-2&&n<22;y++)for(let x=2;x<W-2&&n<22;x++){if(at(x,y)!=="."||x%6!==(y%2?1:4)||!iso(x,y))continue;const s=at(x,y+1)==="="&&at(x-1,y+1)==="="&&at(x+1,y+1)==="=",t=at(x,y-1)==="="&&at(x-1,y-1)==="="&&at(x+1,y-1)==="=";if((s||t)&&put(x,y,"+"))n++}
    let b=0;for(let y=2;y<H-2&&b<2;y++)for(let x=2;x<W-2&&b<2;x++){if(at(x,y)!=="."||!iso(x,y))continue;if((at(x,y-2)==="~"||at(x,y+2)==="~")&&exRnd(x,y,93)<.5&&put(x,y,"&"))b++}}
  else if(M.base==="."){let n=0;for(let y=2;y<H-2&&n<9;y++)for(let x=2;x<W-2&&n<9;x++){if(at(x,y)==="."&&exRnd(x,y,91)<.035&&iso(x,y)&&put(x,y,":"))n++}}}
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{sgPlace()}catch(e){console.error(e)}return r}}
// si un personaje (o tú) acaba encima de un adorno, el adorno se retira
setInterval(()=>{try{if(!EX.on||!EX.grid)return;const cl=(x,y)=>{if(EX.grid[y]&&SG_DECO.includes(EX.grid[y][x]))EX.grid[y][x]="."};cl(EX.x,EX.y);(EX.npcs||[]).forEach(n=>cl(n.px,n.py))}catch(e){}},400);
// =====================================================================================
// MAPAS AMPLIADOS: construcciones nuevas (fuente, estatua, puesto de mercado y faro), aspecto de los vecinos
// según su oficio y casas nuevas de cada pueblo en el mapa de la región.
// =====================================================================================
{const _b=xBld;xBld=function(b){if(!b||!/^(fountain|statue|stall|faro)$/.test(b.k))return _b.apply(this,arguments);const k="SGBD"+b.k+(b.x%3);let c=XG[k];
  if(!c){const W=b.w*32,H=b.h*32+26,Wn=b.w*16,Hn=Math.ceil(H/2);c=xc(W,H);const g=c.getContext("2d"),R=(x,y,w,h,col)=>X2(g,x,y,w,h,col),O="#2a3040",S="#a8b0c2",Sl="#d4dae6",Sd="#7c8498";
    xdisc(g,W/2,H-4,W/2-3,5,"rgba(0,0,0,.22)");
    if(b.k==="fountain"){// pila de piedra con agua, columna central y chorros
      R(4,24,40,19,O);R(2,27,44,13,O);R(5,25,38,17,S);R(3,28,42,11,S);R(5,25,38,1,Sl);R(3,39,42,2,Sd);R(5,41,38,1,Sd);
      R(8,28,32,10,O);R(6,30,36,6,O);R(9,29,30,8,"#4a90e8");R(7,31,34,4,"#4a90e8");[[11,31,4],[30,30,5],[20,35,6],[34,34,3],[13,35,3]].forEach(([x,y,w])=>{R(x,y,w,1,"#9cd0fc")});
      R(21,10,6,24,O);R(22,11,4,22,S);R(22,11,1,22,Sl);R(15,8,18,5,O);R(16,9,16,3,Sl);R(16,11,16,1,Sd);
      R(23,2,2,7,"#c8e8ff");R(22,4,4,2,"#9cd0fc");[[17,13],[30,13]].forEach(([x,y])=>{R(x,y,1,12,"#c8e8ff");R(x-1,y+11,3,2,"#e0f4ff")});[[19,3],[28,3],[20,6],[27,6]].forEach(([x,y])=>R(x,y,1,1,"#e0f4ff"))}
    else if(b.k==="statue"){// columna de piedra con una esfera
      R(1,34,14,10,O);R(2,35,12,8,S);R(2,35,12,1,Sl);R(2,41,12,2,Sd);R(4,30,8,5,O);R(5,31,6,4,S);R(5,20,6,11,O);R(6,20,4,10,S);R(6,20,1,10,Sl);
      for(let dy=-7;dy<=7;dy++)for(let dx=-7;dx<=7;dx++){const d=dx*dx+dy*dy;if(d>52)continue;R(8+dx,13+dy,1,1,d>38?O:dy<-1?Sl:dy>1?Sd:O)}for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const d=dx*dx+dy*dy;if(d<=5)R(8+dx,13+dy,1,1,d>2?O:Sl)}R(5,8,2,1,"#ffffff")}
    else if(b.k==="stall"){// puesto de mercado con toldo de rayas
      const A=[["#e04848","#fff4e8"],["#3a8ae0","#fff4e8"],["#3aa860","#fff4e8"]][b.x%3];
      R(3,18,2,26,O);R(43,18,2,26,O);R(3,18,1,25,"#a06838");R(43,18,1,25,"#a06838");
      R(2,29,44,15,O);R(3,30,42,13,"#c08848");R(3,30,42,2,"#e8b878");for(let x=8;x<44;x+=7)R(x,32,1,11,"#9a6434");R(3,41,42,2,"#9a6434");
      [[6,"#f04858"],[11,"#ffd040"],[16,"#58b048"],[24,"#f08030"],[29,"#c080f0"],[35,"#f04858"],[40,"#ffd040"]].forEach(([x,col])=>{R(x-1,25,5,5,O);R(x,26,3,3,col);R(x,26,1,1,"#ffffff")});
      R(0,6,48,13,O);for(let x=1;x<47;x+=6){R(x,7,Math.min(6,47-x),11,A[(x/6|0)%2]);R(x,7,Math.min(6,47-x),1,(x/6|0)%2?"#ffffff":"#ff8c8c")}for(let x=1;x<47;x+=6){R(x+1,18,4,2,A[(x/6|0)%2]);R(x,18,1,2,O);R(x+5,18,1,2,O);R(x+1,20,4,1,O)}}
    else{// faro
      R(3,62,26,14,O);R(4,63,24,12,Sd);R(4,63,24,2,S);[[6,68],[14,70],[22,67]].forEach(([x,y])=>R(x,y,4,2,S));
      for(let y=20;y<64;y++){const t=(y-20)/44,hw=Math.round(7+t*4),stripe=Math.floor((y-20)/9)%2;R(16-hw-1,y,hw*2+2,1,O);R(16-hw,y,hw*2,1,stripe?"#e04848":"#f8f6f0");R(16-hw,y,2,1,stripe?"#ff8c8c":"#ffffff");R(16+hw-3,y,3,1,stripe?"#a82a3a":"#d4d0c8")}
      R(12,54,8,10,O);R(13,55,6,9,"#9a5a2c");R(13,55,6,1,"#c07a40");R(17,59,1,1,"#ffe060");R(13,34,6,6,O);R(14,35,4,4,"#78bcf6");R(14,35,2,1,"#d8f0ff");
      R(6,17,20,4,O);R(7,18,18,2,S);R(8,7,16,11,O);R(9,8,14,9,"#ffe890");R(9,8,14,3,"#fff8d0");R(15,8,2,9,O);R(9,12,14,1,O);R(7,4,18,4,O);R(8,5,16,2,"#e04848");R(12,1,8,4,O);R(13,2,6,2,"#ff8c8c");R(15,-1,2,3,O)}
    XG[k]=c}
  try{if(EX.M&&EX.M.pal==="snow"){if(!c._sn)c._sn=n6Snow(c);return c._sn}}catch(e){}return c}}
{const _l=exLoad;exLoad=function(m){const r=_l.apply(this,arguments);try{(EX.npcs||[]).forEach(n=>{if(n.cls&&!n.story)n.look=chClassLook(n.cls,n.id)})}catch(e){}return r}}
try{["pueblo","pe","pn","pb","vv","ct","pc","cl"].forEach(t=>{["_h3","_h4","_h5"].forEach(s=>{WM_IN[t+s]=t})})}catch(e){}
