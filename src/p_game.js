// ================= MODO JUEGO: pantalla fija (barra de recursos, escenario con la Poké Ball, tu pueblo y barra de navegación) =================
if(O.classic===undefined)O.classic=0;if(O.secMus===undefined)O.secMus=1;if(O.vib===undefined)O.vib=1;
var GM={init:0,scr:null,ph:{},auto:0,song:null,disp:null,look:"",bud:null,tw:[],tier:[],pop:0,last:0,help:0,town:""};
const gmOn=()=>!O.classic;
const GMSCR={stage:{n:"Gacha",d:"Tiradas y máquina de Poké Balls",i:"gacha",c:"#e8414f",mus:null,nav:"gacha"},batP:{n:"Combate",d:"Combates contra Pokémon salvajes",i:"vs",c:"#2f6fd8",mus:3,nav:"bat"},shopP:{n:"Tienda de mejoras",d:"Mejora tu pueblo para ganar más tickets",i:"shop",c:"#0e9f6e",mus:4,nav:"shop"},earnP:{n:"Premios",d:"Regalo diario, racha y tickets gratis",i:"gift",c:"#e07a00",mus:null,nav:""}};
// ---------- iconos dibujados (sin emojis) ----------
const GMK='stroke="#1b2340" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const GMI={
  ball:'<circle cx="24" cy="24" r="19" fill="#fff" '+GMK+'/><path d="M5 24a19 19 0 0 1 38 0z" fill="#ee3b4b" '+GMK+'/><path d="M5 24h38" '+GMK+'/><circle cx="24" cy="24" r="6" fill="#fff" '+GMK+'/><path d="M12 15a12 12 0 0 1 6-5" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".8"/>',
  gacha:'<path d="M11 26h26l3 17H8z" fill="#ee3b4b" '+GMK+'/><circle cx="24" cy="18" r="14" fill="#cfeeff" '+GMK+'/><circle cx="18" cy="20" r="4" fill="#ffd23f" '+GMK.replace('3"','2"')+'/><circle cx="27" cy="13" r="4" fill="#ff7aa8" '+GMK.replace('3"','2"')+'/><circle cx="29" cy="22" r="4" fill="#5ad1a0" '+GMK.replace('3"','2"')+'/><rect x="20" y="33" width="8" height="5" rx="1.5" fill="#1b2340"/><path d="M14 9a12 12 0 0 1 5-3" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none"/>',
  vs:'<g transform="rotate(45 24 24)"><path d="M21 3h6v27h-6z" fill="#e7eef8" '+GMK+'/><path d="M14 30h20v5H14z" fill="#ffc83a" '+GMK+'/><path d="M21.5 35h5v9h-5z" fill="#9a5f2e" '+GMK+'/></g><g transform="rotate(-45 24 24)"><path d="M21 3h6v27h-6z" fill="#e7eef8" '+GMK+'/><path d="M14 30h20v5H14z" fill="#ffc83a" '+GMK+'/><path d="M21.5 35h5v9h-5z" fill="#9a5f2e" '+GMK+'/></g>',
  map:'<path d="M5 11l12-5 14 5 12-5v31l-12 5-14-5-12 5z" fill="#f6e7b8" '+GMK+'/><path d="M17 6v31M31 11v31" stroke="#1b2340" stroke-width="2" opacity=".35"/><path d="M9 33c5-2 6-9 12-9s7 6 13-1" stroke="#e8414f" stroke-width="2.6" stroke-dasharray="3 3" fill="none" stroke-linecap="round"/><path d="M35 9c-3.3 0-5.5 2.4-5.5 5.4 0 4 5.5 9.6 5.5 9.6s5.5-5.6 5.5-9.6C40.5 11.4 38.3 9 35 9z" fill="#e8414f" '+GMK.replace('3"','2.4"')+'/><circle cx="35" cy="14.4" r="2" fill="#fff"/>',
  dex:'<rect x="8" y="4" width="32" height="40" rx="6" fill="#e8414f" '+GMK+'/><circle cx="17" cy="13" r="5.5" fill="#6cc8ff" '+GMK.replace('3"','2.4"')+'/><circle cx="15.6" cy="11.6" r="1.6" fill="#fff"/><circle cx="27" cy="11" r="2" fill="#ffd23f"/><circle cx="33" cy="11" r="2" fill="#5ad1a0"/><rect x="13" y="22" width="22" height="14" rx="2.5" fill="#dff6ff" '+GMK.replace('3"','2.4"')+'/><path d="M17 31l4-4 3 3 5-6" stroke="#2f6fd8" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  shop:'<path d="M8 20h32v22H8z" fill="#fff6e6" '+GMK+'/><path d="M5 10h38l-2 10H7z" fill="#fff" '+GMK+'/><path d="M11 10l-2 10M19 10l-1 10M29 10l1 10M37 10l2 10" stroke="#e8414f" stroke-width="5"/><path d="M5 10h38l-2 10H7z" fill="none" '+GMK+'/><rect x="13" y="27" width="9" height="15" rx="1.5" fill="#4aa3ff" '+GMK.replace('3"','2.4"')+'/><rect x="27" y="26" width="9" height="7" rx="1.5" fill="#bfe6ff" '+GMK.replace('3"','2.4"')+'/>',
  soc:'<circle cx="17" cy="15" r="7" fill="#ffd9b0" '+GMK+'/><path d="M5 40c0-8 5-13 12-13s12 5 12 13z" fill="#4aa3ff" '+GMK+'/><circle cx="32" cy="18" r="6" fill="#ffd9b0" '+GMK+'/><path d="M23 41c0-7 4-11 9-11s10 4 10 11z" fill="#ff7aa8" '+GMK+'/>',
  menu:'<rect x="6" y="6" width="15" height="15" rx="4" fill="#ffd23f" '+GMK+'/><rect x="27" y="6" width="15" height="15" rx="4" fill="#5ad1a0" '+GMK+'/><rect x="6" y="27" width="15" height="15" rx="4" fill="#6cc8ff" '+GMK+'/><rect x="27" y="27" width="15" height="15" rx="4" fill="#ff7aa8" '+GMK+'/>',
  gift:'<rect x="7" y="19" width="34" height="23" rx="3" fill="#ff5a6a" '+GMK+'/><rect x="5" y="13" width="38" height="9" rx="3" fill="#ff7a88" '+GMK+'/><path d="M24 13v29" stroke="#ffd23f" stroke-width="6"/><path d="M24 13v29" stroke="#1b2340" stroke-width="1" opacity=".3"/><path d="M24 13c-4-8-13-8-11-2 1 3 7 2 11 2zm0 0c4-8 13-8 11-2-1 3-7 2-11 2z" fill="#ffd23f" '+GMK.replace('3"','2.4"')+'/>',
  pass:'<path d="M6 12h36v8a4 4 0 0 0 0 8v8H6v-8a4 4 0 0 0 0-8z" fill="#7a5cff" '+GMK+'/><path d="M24 15l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill="#ffd23f" '+GMK.replace('3"','2"')+'/>',
  game:'<path d="M12 15h24c5 0 8 4 8 10l-1 9c-1 5-6 6-9 2l-3-4H17l-3 4c-3 4-8 3-9-2l-1-9c0-6 3-10 8-10z" fill="#7a5cff" '+GMK+'/><path d="M14 21v8M10 25h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="22" r="2.4" fill="#ffd23f"/><circle cx="37" cy="27" r="2.4" fill="#5ad1a0"/>',
  quest:'<rect x="9" y="7" width="30" height="36" rx="4" fill="#fff6e0" '+GMK+'/><rect x="17" y="4" width="14" height="7" rx="2" fill="#c8a06a" '+GMK.replace('3"','2.4"')+'/><path d="M15 21l3 3 5-6M15 32l3 3 5-6" stroke="#0e9f6e" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 22h6M27 33h6" stroke="#1b2340" stroke-width="2.6" stroke-linecap="round"/>',
  bag:'<path d="M12 18c0-7 5-12 12-12s12 5 12 12" fill="none" '+GMK+'/><rect x="7" y="16" width="34" height="27" rx="8" fill="#f08a24" '+GMK+'/><rect x="15" y="25" width="18" height="10" rx="3" fill="#ffd23f" '+GMK.replace('3"','2.4"')+'/><path d="M24 25v4" '+GMK.replace('3"','2.4"')+'/>',
  party:'<path d="M8 42l8-26 18 18z" fill="#ffd23f" '+GMK+'/><path d="M12 30l4 4M14 23l9 9" stroke="#e8414f" stroke-width="2.6"/><circle cx="34" cy="10" r="2.5" fill="#ff7aa8"/><circle cx="40" cy="20" r="2.5" fill="#6cc8ff"/><circle cx="26" cy="7" r="2" fill="#5ad1a0"/><path d="M30 16c2-3 6-3 7-6" stroke="#7a5cff" stroke-width="2.6" fill="none" stroke-linecap="round"/>',
  ticket:'<path d="M4 14h40v7a3.5 3.5 0 0 0 0 7v7H4v-7a3.5 3.5 0 0 0 0-7z" fill="#ff5a6a" '+GMK+'/><path d="M31 15v19" stroke="#fff" stroke-width="2.4" stroke-dasharray="3 3"/><path d="M11 21h14M11 27h10" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
  medal:'<path d="M14 4h8l4 14h-8zM34 4h-8l-4 14h8z" fill="#4aa3ff" '+GMK.replace('3"','2.4"')+'/><circle cx="24" cy="30" r="13" fill="#ffc83a" '+GMK+'/><circle cx="24" cy="30" r="8" fill="#ffe27a" stroke="#c98a00" stroke-width="2"/><path d="M24 25l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#c98a00"/>',
  flame:'<path d="M24 4c3 8 13 12 13 25a13 13 0 0 1-26 0c0-7 4-10 6-14 1 4 3 6 5 6-2-6 0-12 2-17z" fill="#ff8a1e" '+GMK+'/><path d="M24 24c2 4 7 6 7 12a7 7 0 0 1-14 0c0-4 3-6 4-9 1 2 2 3 3 3z" fill="#ffd23f"/>',
  back:'<path d="M28 9L13 24l15 15" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  help:'<circle cx="24" cy="24" r="19" fill="none" stroke="#fff" stroke-width="4"/><path d="M18 19a6 6 0 1 1 9 5c-2 1-3 2-3 5" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/><circle cx="24" cy="35" r="2.8" fill="#fff"/>',
  home:'<path d="M6 23L24 7l18 16" fill="none" '+GMK+'/><path d="M11 20v22h26V20" fill="#ffe7a8" '+GMK+'/><rect x="20" y="29" width="8" height="13" fill="#e8414f" '+GMK.replace('3"','2.4"')+'/>'
};
const gI=(k,s)=>'<svg viewBox="0 0 48 48" width="'+(s||28)+'" height="'+(s||28)+'" aria-hidden="true">'+(GMI[k]||"")+'</svg>';
// ---------- música según la sección (solo si la música ya está sonando) ----------
function gmSongI(){if(!GM)return O.song;return GM.song!=null&&O.secMus&&SG[GM.song]?GM.song:O.song}
function gmMusic(i){if(i===undefined)i=null;if(GM.song===i)return;const a=gmSongI();GM.song=i;try{if(gmSongI()!==a&&typeof mtimer!=="undefined"&&mtimer&&mplaying)mstart()}catch(e){}}
const GMMUS={explP:1,healP:4,bagP:4,gymP:6,lgP:7,hofP:7};
// ---------- pequeños efectos: vibración y chispas ----------
function gmVib(ms){try{if(O.vib&&gmOn()&&navigator.vibrate)navigator.vibrate(ms||8)}catch(e){}}
function gmSparks(host,x,y,n,big){if(hubCalm())return;const cols=["#fff","#fff59a","#ffd35c","#ff8a8a","#9ad7ff","#b7ffcf"];
  for(let i=0;i<(n||7);i++){const s=document.createElement("span");s.className="gspk";s.textContent=i%3?"✦":"★";s.style.left=x+"px";s.style.top=y+"px";s.style.color=cols[i%cols.length];s.style.fontSize=(big?14:9)+Math.random()*(big?14:8)+"px";host.appendChild(s);
    const a=Math.random()*Math.PI*2,d=(big?60:30)+Math.random()*(big?90:45);
    s.animate([{transform:"translate(-50%,-50%) scale(.4)",opacity:1},{transform:"translate(calc(-50% + "+(Math.cos(a)*d).toFixed(0)+"px),calc(-50% + "+(Math.sin(a)*d-12).toFixed(0)+"px)) scale(1) rotate("+(Math.random()*300|0)+"deg)",opacity:0}],{duration:450+Math.random()*300,easing:"cubic-bezier(.1,.7,.3,1)"}).onfinish=()=>s.remove()}}
// ---------- edificios del pueblo en pixel art ----------
const GBN=["Casa del entrenador","Granja de Miltank","Centro Pokémon","Guardería","Liga Pokémon","Estadio Pokémon","Laboratorio del Profesor"];
const gbTier=n=>n<=0?0:n<10?1:n<25?2:n<50?3:n<100?4:5;
function gbDk(h,f){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;r=Math.round(r*f);g=Math.round(g*f);b=Math.round(b*f);const c=v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,"0");return"#"+c(r)+c(g)+c(b)}
function gbCanvas(k,t){
  const ink="#2b2440",dk=gbDk,LIT=[],meta={};let W=t?[0,48,54,60,66,74][t]:42,H=t?Math.round(W*.86):38;
  if(t&&k===5)W+=16;if(t&&k===1&&t>=3)W+=12;if(t&&k===4)H+=6;if(t&&k===6&&t>=4)W+=12;
  const c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
  const R=(x,y,w,h,col)=>{if(w<=0||h<=0)return;g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
  const B=(x,y,w,h,col)=>{R(x,y,w,h,ink);R(x+1,y+1,w-2,h-2,col)};
  const C=(cx,cy,r,col,half)=>{for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+r*.8&&(!half||(half<0?y<0:y>=0)))R(cx+x,cy+y,1,1,col)};
  const wall=(x,y,w,h,col)=>{B(x,y,w,h,col);R(x+1,y+1,1,h-2,dk(col,1.08));R(x+w-3,y+1,2,h-2,dk(col,.86));R(x+1,y+h-4,w-2,3,dk(col,.8));R(x+1,y+h-4,w-2,1,dk(col,.92));
    for(let i=0;i<w*h/40;i++){const px=x+2+((i*37)%(w-5)),py=y+2+((i*53)%(h-7));R(px,py,1,1,dk(col,.94))}};
  const roof=(x,y,w,h,col)=>{R(x,y,w,h,ink);const hl=dk(col,1.22),sh=dk(col,.76),sd=dk(col,.62);
    for(let r=1;r<h-1;r++){const cr=Math.floor((r-1)/3),ph=(r-1)%3;R(x+1,y+r,w-2,1,ph===0?hl:ph===1?col:sh);if(ph===1)for(let q=x+1+(cr%2?2:4);q<x+w-1;q+=5)R(q,y+r,1,2,sh)}
    R(x+1,y+1,w-2,1,dk(col,1.35));R(x+1,y+h-3,w-2,2,sd);R(x+1,y+h-1,w-2,1,ink);R(x+3,y+h,w-6,2,"rgba(0,0,0,.22)")};
  const win=(x,y,w,h)=>{B(x,y,w,h,"#fffaf0");R(x+1,y+1,w-2,h-2,"#6fb8ec");R(x+1,y+1,w-2,1,"#bfe6ff");R(x+1,y+2,1,h-3,"#a8dcff");R(x+w-2,y+h-2,1,1,"#4a90cc");
    if(w>=7)R(x+Math.floor(w/2),y+1,1,h-2,"#fffaf0");if(h>=7)R(x+1,y+Math.floor(h/2),w-2,1,"#fffaf0");R(x-1,y+h,w+2,1,"#a8987a");R(x-1,y+h+1,w+2,1,"rgba(0,0,0,.15)");LIT.push([x+1,y+1,w-2,h-2])};
  const door=(x,y,w,h,col)=>{col=col||"#8a5a34";B(x-1,y-1,w+2,h+1,dk(col,.7));B(x,y,w,h,col);R(x+2,y+2,w-4,Math.floor(h/2)-2,dk(col,1.14));R(x+2,y+Math.floor(h/2)+1,w-4,Math.floor(h/2)-3,dk(col,1.14));R(x+w-3,y+Math.floor(h/2),1,1,"#ffd34a");R(x-2,y+h,w+4,2,"#c9c0ae");R(x-2,y+h+1,w+4,1,"#9a907e")};
  const glass=(x,y,w,h)=>{B(x,y,w,h,"#9fdcff");R(x+1,y+1,w-2,2,"#e2f5ff");for(let i=0;i<h-3;i++)if(i<w-2)R(x+2+i,y+h-2-i,1,1,"#d4f0ff");R(x+Math.floor(w/2),y+1,1,h-1,ink);LIT.push([x+1,y+3,w-2,h-4])};
  const flag=(x,y,col)=>{R(x,y,1,10,ink);R(x+1,y,6,4,col);R(x+1,y+3,6,1,dk(col,.7));R(x+1,y,6,1,dk(col,1.25))};
  const pot=(x,y)=>{R(x,y,4,2,"#c8643a");R(x,y-2,1,2,"#3f9a42");R(x+2,y-3,1,3,"#3f9a42");R(x,y-3,1,1,"#ff6fa0");R(x+2,y-4,1,1,"#ffd23f");R(x+3,y-2,1,1,"#ff6fa0")};
  R(2,H-2,W-4,2,"rgba(20,40,20,.28)");
  if(!t){// solar en venta
    R(4,H-10,W-8,7,"#a87e50");R(5,H-11,W-10,1,"#c49a68");for(let i=0;i<18;i++)R(6+((i*7)%(W-13)),H-9+((i*3)%5),2,1,i%2?"#86603a":"#d0a874");
    [4,W-6].forEach(x=>{R(x,H-15,2,8,"#8a5a2a");R(x,H-15,2,1,"#c99a62")});R(4,H-13,W-8,1,"#e8e0d0");R(4,H-11,W-8,1,"#e8e0d0");
    R(W/2-1,H-26,2,16,"#7a5230");B(W/2-11,H-33,22,11,"#e8b878");R(W/2-10,H-32,20,1,"#f6d49c");R(W/2-10,H-24,20,1,"#b8884a");
    R(W/2-1,H-31,3,1,ink);R(W/2+1,H-30,1,2,ink);R(W/2,H-28,1,1,ink);R(W/2,H-26,1,1,ink);
    R(7,H-6,3,3,"#ff8a1e");R(8,H-8,1,2,"#ff8a1e");R(7,H-5,3,1,"#fff");c._lit=null;return c}
  const m=3,base=H-3;
  if(k===0){// casa del entrenador
    const rh=Math.round(H*.44),wy=3+rh-3;if(t>=3){B(W-m-12,0,7,9,"#a49a90");R(W-m-11,1,5,1,"#c8beb4");R(W-m-12,0,7,2,"#7a706a");meta.smk=[W-m-8.5,0]}
    wall(m+1,wy,W-2*m-2,base-wy,"#f6ecd2");roof(m-2,3,W-2*m+4,rh,"#e0533f");
    door(Math.round(W*.28),base-12,8,12);const fl=t>=4?2:1;
    for(let f=0;f<fl;f++){const y=base-12-f*10;win(Math.round(W*.56),y,10,7);if(W>56)win(Math.round(W*.80)-4,y,7,7);if(f)win(Math.round(W*.25),y,9,7)}
    if(t>=2)pot(m+3,base-1);if(t>=5){pot(Math.round(W*.56)+1,base-14+12);R(W-m-6,base-8,3,6,"#3a6ad8");R(W-m-6,base-8,3,1,"#6a9af0")}
  }else if(k===1){// granja
    const bw=t>=3?W-12:W,rh=Math.round(H*.38),wy=3+rh-3;
    if(t>=3){const sx=bw-1;B(sx,9,12,base-9,"#d4d9e2");R(sx+1,10,2,base-11,"#eef2f8");R(sx+9,10,2,base-11,"#aab1be");for(let y=13;y<base;y+=4)R(sx+1,y,10,1,"#b8bfcc");C(sx+6,9,6,ink,-1);C(sx+6,9,5,"#9aa4b8",-1);R(sx+3,5,3,1,"#e8eef8")}
    wall(m,wy,bw-2*m,base-wy,"#c8412f");R(m+1,wy+1,bw-2*m-2,1,"#fff");R(m+1,wy+1,1,base-wy-2,"#fff");R(bw-m-2,wy+1,1,base-wy-2,"#fff");
    roof(m-2,3,bw-2*m+4,rh,"#7a4a32");
    const dx=Math.round(bw/2-7);B(dx,base-14,14,14,"#9c2f22");R(dx+1,base-13,12,1,"#fff");R(dx+1,base-13,1,12,"#fff");R(dx+12,base-13,1,12,"#fff");for(let i=0;i<12;i++){R(dx+1+i,base-13+i,1,1,"#fff");R(dx+12-i,base-13+i,1,1,"#fff")}
    B(Math.round(bw/2-4),wy+3,8,6,"#fff");R(Math.round(bw/2-3),wy+4,6,4,"#3a2a20");LIT.push([Math.round(bw/2-3),wy+4,6,4]);
    if(t>=2){B(1,base-7,9,7,"#e8c34a");R(2,base-5,7,1,"#c9a030");R(2,base-3,7,1,"#c9a030");R(2,base-6,7,1,"#f6dc7a")}
    if(t>=4)for(let x=1;x<W-1;x+=4){R(x,base-6,1,6,"#f4f0e6");R(x,base-5,4,1,"#f4f0e6");R(x,base-2,4,1,"#f4f0e6")}
    if(t>=5){C(Math.round(bw/2),6,3,"#ff9ac2");R(Math.round(bw/2)-1,5,1,1,"#fff")}
  }else if(k===2){// centro pokémon
    const rh=Math.round(H*.38),wy=3+rh-3;
    if(t>=4){wall(m-1,wy+3,9,base-wy-3,"#fbf6ee");wall(W-m-8,wy+3,9,base-wy-3,"#fbf6ee");win(m+1,wy+7,5,5);win(W-m-6,wy+7,5,5)}
    wall(m+3,wy,W-2*m-6,base-wy,"#fbf6ee");R(m+4,base-7,W-2*m-8,3,"#e8414f");R(m+4,base-7,W-2*m-8,1,"#ff7a84");
    roof(m+1,3,W-2*m-2,rh,"#ee5a4f");
    const dw=t>=3?16:12,dx=Math.round(W/2-dw/2);glass(dx,base-13,dw,13);R(dx-2,base-14,dw+4,1,"#e8414f");R(dx-2,base,dw+4,2,"#c9c0ae");
    win(m+6,wy+4,8,6);win(W-m-14,wy+4,8,6);
    const bx=Math.round(W/2),by=3+Math.round(rh/2);C(bx,by,6,ink);C(bx,by,5,"#ee3b4b",-1);C(bx,by,5,"#fff",1);R(bx-5,by,11,1,ink);C(bx,by,2,ink);C(bx,by,1,"#fff");R(bx-3,by-3,2,1,"#ff9aa4");
    if(t>=5){flag(2,wy-10,"#ffd23f");flag(W-9,wy-10,"#ffd23f")}
  }else if(k===3){// guardería
    const rh=Math.round(H*.44),wy=3+rh-3;
    wall(m+1,wy,W-2*m-2,base-wy,"#f5dfc4");roof(m-2,3,W-2*m+4,rh,"#56b04f");
    door(Math.round(W*.42),base-12,8,12,"#6a8f3a");win(Math.round(W*.16),base-11,8,7);win(Math.round(W*.68),base-11,9,7);
    const ex=Math.round(W*.42)+4,ey=wy-1;R(ex-6,ey-5,13,9,ink);R(ex-5,ey-4,11,7,"#fff4dc");C(ex,ey-1,3,"#fffaf0");R(ex-1,ey-2,2,1,"#5ad1a0");R(ex+1,ey,1,1,"#5ad1a0");R(ex-2,ey+1,1,1,"#5ad1a0");
    if(t>=3)for(let x=1;x<W-1;x+=3){R(x,base-5,1,5,"#fff");R(x,base-4,3,1,"#fff")}
    if(t>=4){C(5,base-14,5,ink);C(5,base-14,4,"#3f9a42");R(3,base-16,2,1,"#6cc85a");R(4,base-9,2,7,"#7a5230")}
    if(t>=5){pot(W-9,base-1);pot(W-15,base-1)}
  }else if(k===4){// liga pokémon
    const rh=Math.round(H*.3),wy=9+rh-3;
    wall(m,wy,W-2*m,base-wy,"#e8e6f2");for(let x=m+5;x<W-m-4;x+=7){R(x,wy+3,3,base-wy-8,"#fbfaff");R(x+2,wy+3,1,base-wy-8,"#b9b4cc")}R(m+1,base-5,W-2*m-2,4,"#b9b4cc");R(m+1,base-5,W-2*m-2,1,"#d8d4e8");
    roof(m-2,9,W-2*m+4,rh,"#4a78e0");
    const px=Math.round(W/2);for(let r=0;r<8;r++){R(px-11+r,2+7-r,23-2*r,1,r===0?ink:"#3a66cc");R(px-11+r,2+7-r,1,1,ink);R(px+11-r,2+7-r,1,1,ink)}R(px-11,10,23,1,ink);
    R(px-3,wy-2,7,4,"#ffc83a");R(px-2,wy-2,2,2,"#fff2a8");R(px-1,wy+2,3,2,"#c98a00");R(px-2,wy+4,5,1,"#c98a00");R(px-5,wy-1,2,2,"#ffc83a");R(px+4,wy-1,2,2,"#ffc83a");
    const dx=Math.round(W/2-6);B(dx,base-15,12,15,"#5a3a8a");C(dx+6,base-15,6,ink,-1);C(dx+6,base-15,5,"#7a5ab0",-1);R(dx+5,base-14,2,14,"#3a2a60");R(dx-2,base,16,2,"#d8d4e8");
    if(t>=4){flag(m,0,"#e8414f");flag(W-m-7,0,"#e8414f")}if(t>=5)R(m+1,wy+1,W-2*m-2,1,"#ffc83a")
  }else if(k===5){// estadio
    const top=Math.round(H*.26);
    if(t>=3){[2,W-4].forEach(x=>{R(x,top-12,2,base-top+12,"#6a7080");R(x,top-12,1,base-top+12,"#9aa0b0");B(x-3,top-17,8,6,"#fff6c0");R(x-2,top-16,6,1,"#fff");LIT.push([x-2,top-16,6,4])})}
    B(5,top,W-10,base-top,"#c4c9d6");R(6,top+1,W-12,3,"#9aa3b6");R(6,top+1,W-12,1,"#d8dce8");
    const CR=["#ff5a6a","#ffd23f","#6cc8ff","#5ad1a0","#fff","#ff9ac2","#b58aff","#ff9a3a"];for(let y=top+5;y<base-9;y+=3){R(6,y+2,W-12,1,"#a8afc0");for(let x=7;x<W-8;x+=2){R(x,y,1,1,"#f0c8a0");R(x,y+1,1,1,CR[(x*7+y*13)%CR.length])}}
    R(6,base-9,W-12,8,"#aab1c2");for(let x=8;x<W-8;x+=6)R(x,base-8,3,6,"#8e96aa");const dx=Math.round(W/2-7);B(dx,base-11,14,11,"#2a2f48");R(dx+2,base-9,10,2,"#5ad1a0");R(dx+2,base-9,10,1,"#9af0c8");
    R(4,top-2,W-8,3,ink);R(5,top-1,W-10,1,"#e8414f");
    if(t>=4){flag(10,top-11,"#2f6fd8");flag(W-17,top-11,"#e8414f")}if(t>=5)flag(Math.round(W/2)-3,top-11,"#ffd23f")
  }else{// laboratorio
    const lw=t>=4?W-12:W,rh=Math.round(H*.2),wy=11+rh-3;
    if(t>=4){wall(lw-3,wy+6,15,base-wy-6,"#f4f6fb");win(lw+1,wy+10,8,6)}
    wall(m,wy,lw-2*m,base-wy,"#fdfdff");R(m+1,base-5,lw-2*m-2,4,"#c9d2e2");R(m+1,base-5,lw-2*m-2,1,"#e2e8f2");
    roof(m-2,11,lw-2*m+4,rh,"#a8b2c4");
    for(let x=m+4;x<lw-m-9;x+=10)win(x,wy+3,8,6);
    glass(Math.round(lw/2)-6,base-12,12,12);R(Math.round(lw/2)-8,base,16,2,"#c9c0ae");
    if(t>=2){R(m+6,1,1,11,ink);R(m+5,1,3,1,"#e8414f");LIT.push([m+5,1,3,1])}
    if(t>=3){const sx=lw-m-14;C(sx+5,7,5,ink,-1);C(sx+5,7,4,"#e8edf6",-1);R(sx+2,5,2,1,"#fff");R(sx,7,11,1,ink);R(sx+5,7,1,5,ink);R(sx+5,1,1,1,"#e8414f")}
    if(t>=5){C(lw-7,base-12,5,ink);C(lw-7,base-12,4,"#3f9a42");R(lw-8,base-7,2,5,"#7a5230")}
  }
  // versión de noche con las ventanas encendidas
  if(LIT.length){const n=document.createElement("canvas");n.width=W;n.height=H;const q=n.getContext("2d");q.drawImage(c,0,0);q.fillStyle="rgba(20,24,60,.35)";q.fillRect(0,0,W,H);
    LIT.forEach(r=>{q.fillStyle="#ffcf5a";q.fillRect(r[0],r[1],r[2],r[3]);q.fillStyle="#fff1b0";q.fillRect(r[0],r[1],r[2],Math.max(1,Math.floor(r[3]/2)))});c._lit=n}
  c._meta=meta;return c}
// decoración entre los edificios
function gdCanvas(kind){const ink="#2b2440",dk=gbDk;let W=24,H=30;
  if(kind==="lamp"){W=10;H=36}else if(kind==="bush"){W=20;H=14}else if(kind==="flow"){W=22;H=10}else if(kind==="pine"){W=22;H=38}else if(kind==="tree2"){W=30;H=40}
  const c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
  const R=(x,y,w,h,col)=>{if(w<=0||h<=0)return;g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
  const C=(cx,cy,r,col)=>{for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+r*.8)R(cx+x,cy+y,1,1,col)};
  const blob=(pts,col)=>{pts.forEach(p=>C(p[0],p[1],p[2]+1,ink));pts.forEach(p=>C(p[0],p[1],p[2],col));pts.forEach(p=>C(p[0]-Math.round(p[2]*.3),p[1]-Math.round(p[2]*.35),Math.max(1,Math.round(p[2]*.45)),dk(col,1.25)))};
  if(kind==="tree"||kind==="tree2"){const s=kind==="tree2"?1.25:1,cx=W/2;R(cx-2,H-11*s,4,11*s-1,ink);R(cx-1,H-11*s,2,11*s-2,"#8a5a34");R(cx,H-11*s,1,11*s-2,"#6a4024");R(cx-4,H-2,8,2,"rgba(0,0,0,.22)");
    blob([[cx,H-20*s,8*s],[cx-6*s,H-15*s,6*s],[cx+6*s,H-15*s,6*s],[cx,H-26*s,6*s]].map(p=>p.map(Math.round)),"#3f9a42");for(let i=0;i<6;i++)R(cx-6+((i*5)%12),H-24*s+((i*7)%10),1,1,"#7ad06a")}
  else if(kind==="pine"){const cx=11;R(cx-1,H-7,3,6,"#7a5230");R(cx-4,H-2,9,2,"rgba(0,0,0,.22)");[[H-30,5],[H-23,8],[H-15,10]].forEach((t,i)=>{for(let r=0;r<10;r++){const w=Math.round(t[1]*r/9)*2+1;R(cx-Math.floor(w/2)-1,t[0]+r,w+2,1,ink);R(cx-Math.floor(w/2),t[0]+r,w,1,r%3===0?"#3a8a46":"#2e7038");R(cx-Math.floor(w/2),t[0]+r,Math.ceil(w/3),1,"#4aa858")}})}
  else if(kind==="lamp"){R(4,9,2,H-11,"#3a3f58");R(4,9,1,H-11,"#6a7090");R(2,H-3,6,2,"#3a3f58");R(1,H-2,8,2,"rgba(0,0,0,.2)");R(0,1,10,2,ink);R(1,3,8,6,ink);R(2,4,6,4,"#ffe9a0");R(2,4,6,1,"#fffbe0");R(4,0,2,1,ink)}
  else if(kind==="bush"){blob([[6,8,5],[13,7,6],[10,5,4]],"#4aa848");R(4,10,1,1,"#ff6fa0");R(14,6,1,1,"#ffd23f");R(9,9,1,1,"#fff")}
  else if(kind==="flow"){R(1,6,20,3,"#3f8a2e");R(1,6,20,1,"#5aa83c");const FC=["#ff6fa0","#ffd23f","#fff","#b58aff","#ff5a5a"];for(let i=0;i<9;i++){const x=2+i*2+(i%2),y=3+(i%3);R(x,y+1,1,3,"#3f8a2e");R(x-1,y,3,1,FC[i%5]);R(x,y-1,1,3,FC[i%5]);R(x,y,1,1,"#ffe9a0")}}
  return c}
function gbPathURL(){if(GM.pathU)return GM.pathU;const W=48,H=20,c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
  const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};R(0,0,W,H,"#b8a07a");
  R(0,0,W,3,"#4f9a36");for(let x=0;x<W;x+=3)R(x,3,2,1+(x%2),"#3f8a2e");for(let x=1;x<W;x+=4)R(x,0,1,1,"#7ad06a");
  const SC=["#d9c9a6","#cdbb94","#e2d4b4","#c6b38c"];let y=4;[5,5,5].forEach((h,row)=>{let x=row%2?-6:0;let i=row*3;while(x<W){const w=8+((i*5)%5);R(x,y,w,h,"#8a7656");R(x+1,y,w-2,h-1,SC[i%4]);R(x+1,y,w-2,1,"#efe4c8");R(x+w-2,y+1,1,h-2,"#b09c76");x+=w;i++}y+=h});
  R(0,H-1,W,1,"#8a7656");GM.pathU=c.toDataURL();return GM.pathU}
// ---------- construcción de la interfaz ----------
function gmEl(tag,id,cls,html,parent){const e=document.createElement(tag);if(id)e.id=id;e.className="gmo"+(cls?" "+cls:"");if(html)e.innerHTML=html;(parent||document.body).appendChild(e);return e}
function gmInit(){
  if(GM.init)return;GM.init=1;
  Object.keys(GMSCR).forEach(id=>{const P=$(id);if(P&&!GM.ph[id]){const m=document.createComment("gm-"+id);P.parentNode.insertBefore(m,P);GM.ph[id]=m}});
  // fondo: el paisaje de la portada sigue vivo detrás del juego, con la luz según la hora
  const bg=gmEl("div","gBg");const pcb=document.querySelector("#auth .pcbg");if(pcb){bg.appendChild(pcb);window.pcLive=1}
  gmEl("div","gTod","","",bg);gmEl("div","gStars","","",bg);
  // barra superior
  gmEl("div","gTop","",'<button class="gpl" data-hg="trn" title="Tu entrenador"><span class="gav" id="gAv"></span><span class="gpn"><b id="gNick">Entrenador</b><small id="gMed" data-hg="adv">'+gI("medal",16)+'<u id="gMedN">0/8</u> medallas</small></span></button>'+
    '<button class="gres gtk" id="gTk" title="Tus tickets"><span class="gic">'+gI("ticket",30)+'</span><span class="gnum"><b id="gTkN">0</b><small id="gTps"></small></span><i class="gplus" aria-hidden="true">+</i></button>'+
    '<button class="gres" id="gStk" title="Racha diaria"><span class="gic">'+gI("flame",26)+'</span><b id="gStkN">0</b></button>'+
    '<button class="gres gpass" id="gPass" title="Pase de temporada"><span class="gic">'+gI("pass",26)+'</span><span class="gpb"><b id="gPassN">Nv 0</b><i><u id="gPassB"></u></i></span></button>');
  // barra de navegación inferior
  const NAV=[["dex","dex","Pokémon"],["bat","vs","Combate"],["exp","map","Explorar"],["gacha","ball","Gacha"],["shop","shop","Tienda"],["soc","soc","Social"],["menu","menu","Menú"]];
  gmEl("nav","gNav","",NAV.map(n=>'<button data-gn="'+n[0]+'"'+(n[0]==="menu"?' id="gnavb"':'')+' class="'+(n[0]==="gacha"?"gbig":"")+'"><span class="gni">'+gI(n[1],n[0]==="gacha"?44:30)+'</span><b>'+n[2]+'</b><i class="gbd" hidden></i></button>').join(""));
  // pantallas de sección (mismo aspecto que las ventanas del menú)
  const sc=gmEl("div","gScr","",'<div class="hubw"><div class="hubh"><button class="gback" id="gBack" aria-label="Volver">'+gI("back",26)+'</button><span class="hubi" id="gScrI"></span><div class="hubtt"><b id="gScrT"></b><small id="gScrD"></small></div><button class="ghq" id="gHelp" aria-label="Ayuda">'+gI("help",24)+'</button></div><div class="hubb" id="gScrB"></div></div>');sc.hidden=true;sc.setAttribute("role","dialog");
  // escenario: botones laterales, entrenador y compañero, y el pueblo
  const farm=$("farm");
  const SL=[["gift","Premios","earnP","#ff8a1e"],["game","Minijuegos","mg","#8a5cff"],["pass","Pase","pass","#3a8cff"],["party","Evento","hh","#ff4f8a"]],SR=[["quest","Misiones","qP","#14b886"],["bag","Mochila","bagU","#f0a020"]];
  gmEl("div","gSideL","gside",SL.map(s=>'<button data-gs="'+s[2]+'" style="--c:'+s[3]+'"><span class="gsi">'+gI(s[0],36)+'</span><b>'+s[1]+'</b><i class="gbd" hidden></i></button>').join(""),farm);
  gmEl("div","gSideR","gside",SR.map(s=>'<button data-gs="'+s[2]+'" style="--c:'+s[3]+'"><span class="gsi">'+gI(s[0],36)+'</span><b>'+s[1]+'</b><i class="gbd" hidden></i></button>').join(""),farm);
  const orb=farm.querySelector(".orb");if(orb){gmEl("div","gRays","",'',orb);gmEl("div","gPed","",'<i></i>',orb);gmEl("div","gTr","",'',orb);gmEl("div","gBud","",'',orb);gmEl("i","gGround","",'',orb)}
  gmEl("div","gCombo","",'<b id="gCmb">0</b><small>clics/s</small>',farm);
  gmEl("div","gTown","",'<div class="gtrack" id="gTrack"><div class="gpath"></div><div class="gbs" id="gBs"></div><div class="gwks" id="gWks"></div></div>',farm);
  // ayuda (?) también en las ventanas del menú
  const hx=$("hubX");if(hx&&!$("hubQ")){const q=document.createElement("button");q.id="hubQ";q.className="gmo ghq";q.setAttribute("aria-label","Ayuda");q.innerHTML=gI("help",24);hx.parentNode.insertBefore(q,hx);q.onclick=()=>gmHelpT()}
  // opciones nuevas en Ajustes
  const op=$("optp"),ref=op&&op.querySelector('[data-o="bg"]');if(ref&&!op.querySelector('[data-o="classic"]')){const lab=ref.closest("label");
    lab.insertAdjacentHTML("beforebegin",'<label><input type="checkbox" data-o="classic"> Diseño clásico (página con scroll en lugar del modo juego)</label><label><input type="checkbox" data-o="secMus"> Música distinta en cada sección</label><label><input type="checkbox" data-o="vib"> Vibración al tocar (móvil)</label>');applyO()}
  // eventos
  document.addEventListener("click",gmClick,true);
  $("gBack").onclick=()=>{snd("ui");gmClose()};$("gHelp").onclick=()=>gmHelpT();
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&GM.scr&&gmOn()&&!document.querySelector("#gacM:not([hidden]),#uiDlg:not([hidden]),#pkv:not([hidden])")){gmClose()}});
  $("train").addEventListener("click",e=>{if(!gmOn())return;gmVib(6);const f=$("fx"),r=f.getBoundingClientRect(),b=$("train").getBoundingClientRect();
    gmSparks(f,(e.clientX||b.left+b.width/2)-r.left,(e.clientY||b.top+b.height/2)-r.top,6);const tr=$("gTr");if(tr){tr.classList.remove("gjump");void tr.offsetWidth;tr.classList.add("gjump")}});
  // el combate se abre solo cuando empieza una batalla
  const ar=$("arena");if(ar)new MutationObserver(()=>{if(!gmOn()||ar.hidden)return;const p=ar.closest("#batP,#pvpP");if(p&&(p.id==="batP"||($("pvpP")&&$("pvpP").dataset.duel))&&GM.scr!=="batP")gmOpen("batP",1)}).observe(ar,{attributes:true,attributeFilter:["hidden"]});
  const pd=$("pvDuel");if(pd)new MutationObserver(()=>{if(!gmOn())return;const p=$("pvpP");if(p&&p.dataset.duel&&pd.querySelector("#arena")){gmOpen("batP",1);$("batP").after(p);setTimeout(()=>{try{p._siv({block:"start"})}catch(e){}},60)}}).observe(pd,{childList:true});
  gmApply();gmLoad();
  let lt=0;const loop=t=>{requestAnimationFrame(loop);if(document.hidden||!gmOn())return;gmTown(t);if(t-lt>120){lt=t;gmTop()}};requestAnimationFrame(loop);
  setInterval(()=>{if(!gmOn()||document.hidden)return;gmBadges();gmTod();gmHero();if(GM.scr)gmHelpMark($("gScrB"));if(!$("hubM").hidden)gmHelpMark($("hubB"))},1000);
  gmTod();gmHero();gmBadges();
}
function gmApply(){
  const on=gmOn()&&GM.init;document.body.classList.toggle("gm",!!on);window.pcLive=on?1:0;
  if(!on){gmClose(1);GM.song=null}
  else{GM.town="";try{dispatchEvent(new Event("resize"))}catch(e){}}
}
{const _a=applyO;applyO=function(){const r=_a.apply(this,arguments);try{if(GM.init&&document.body.classList.contains("gm")!==(gmOn()))gmApply()}catch(e){}return r}}
// pantalla de carga: una Poké Ball que se abre
function gmLoad(){if(!gmOn()||hubCalm())return;const L=gmEl("div","gLoad","",'<i class="glr"></i><div class="glogo"><span>POKE GACHA</span><b>ONLINE</b></div><div class="glb"><i class="glt"></i><i class="glbt"></i><i class="glbtn"></i></div><b class="glm">¡Vamos allá!</b>');
  setTimeout(()=>L.classList.add("op"),900);setTimeout(()=>{L.classList.add("out");try{snd("open")}catch(e){}},1150);setTimeout(()=>L.remove(),1700)}
// ---------- abrir y cerrar secciones ----------
function gmOpen(id,auto){
  if(!gmOn()||!GM.init)return;const P=$(id),D=GMSCR[id];if(!P||!D)return;
  try{hubMenu(false)}catch(e){}try{if(!$("hubM").hidden)hubClose()}catch(e){}
  if(GM.scr===id){gmNav();return}
  if(GM.scr)gmPark();
  GM.scr=id;GM.auto=!!auto;const M=$("gScr");M.style.setProperty("--hc",D.c);$("gScrI").innerHTML=gI(D.i,30);$("gScrT").textContent=D.n;$("gScrD").textContent=D.d;
  const B=$("gScrB");B.appendChild(P);if(id==="batP"&&$("pvpP")&&$("pvpP").dataset.duel)P.after($("pvpP"));
  gmHelpMark(B);B.scrollTop=0;const was=M.hidden;M.hidden=false;if(was&&!hubCalm()){M.classList.remove("in");void M.offsetWidth;M.classList.add("in")}
  try{if(id==="shopP"||id==="stage")render()}catch(e){}
  gmMusic(D.mus);gmNav()}
function gmPark(){const id=GM.scr;if(!id)return;const P=$(id),m=GM.ph[id];if(P&&m&&m.parentNode)m.parentNode.insertBefore(P,m.nextSibling);
  const pv=$("pvpP");if(pv&&pv.parentNode===$("gScrB")){if(pv.dataset.duel)$("batP").after(pv);else try{hubPark("pvpP")}catch(e){}}}
function gmClose(silent){if(!GM.scr){if(!silent)gmNav();return}gmPark();GM.scr=null;GM.auto=0;$("gScr").hidden=true;if(!silent)gmMusic(null);gmNav()}
{const _ho=hubOpen;hubOpen=function(k,tab){if(gmOn()&&GM.scr)gmClose(1);const r=_ho.apply(this,arguments);try{if(gmOn()&&GM.init){gmHelpMark($("hubB"));gmMusic(GMMUS[HB.t]!=null?GMMUS[HB.t]:null);gmNav()}}catch(e){}return r}}
{const _hc=hubClose;hubClose=function(){const r=_hc.apply(this,arguments);try{if(gmOn()&&GM.init){if(!GM.scr)gmMusic(null);gmNav()}}catch(e){}return r}}
{const _s=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(o){
  try{if(gmOn()&&GM.init&&this.closest){const pan=this.closest("#stage,#batP,#shopP,#earnP");
    if(pan&&!this.closest("#gScr")){gmOpen(pan.id);if(this!==pan){const el=this;setTimeout(()=>{try{el._siv({block:"center",behavior:"smooth"})}catch(e){}},80)}return}
    if(pan&&this===pan){$("gScrB").scrollTop=0;return}}}catch(e){}
  return _s.call(this,o)}}
function gmNav(){const n=$("gNav");if(!n)return;let a="";
  if(GM.scr)a=GMSCR[GM.scr].nav;else if(!$("hubM").hidden){a=HB.t==="explP"?"exp":HB.g==="dex"?"dex":HB.g==="soc"?"soc":"menu"}else if($("hubG")&&!$("hubG").hidden)a="menu";
  n.querySelectorAll("[data-gn]").forEach(b=>b.classList.toggle("on",b.dataset.gn===a));document.body.classList.toggle("gmhome",!a&&!GM.scr)}
function gmClick(e){const t=e.target;if(!t.closest||!gmOn())return;
  const nb=t.closest("[data-gn]");if(nb){e.stopPropagation();const k=nb.dataset.gn;snd("ui");gmVib(10);nb.animate([{transform:"scale(.86)"},{transform:"scale(1.08)"},{transform:"none"}],{duration:260});
    if(nb.classList.contains("on")){if(k==="menu")hubMenu(false);else if(GM.scr)gmClose();else hubClose();setTimeout(gmNav,40);return}
    if(k==="gacha")gmOpen("stage");else if(k==="bat")gmOpen("batP");else if(k==="shop")gmOpen("shopP");
    else if(k==="dex")hubOpen("dex");else if(k==="soc")hubOpen("soc");else if(k==="exp")hubOpen("adv","explP");
    else if(k==="menu"){if(GM.scr)gmClose(1);hubClose();hubMenu(true)}
    setTimeout(gmNav,40);return}
  const sb=t.closest("[data-gs]");if(sb){e.stopPropagation();const k=sb.dataset.gs;snd("ui");gmVib(10);
    if(k==="earnP")gmOpen("earnP");else if(k==="mg")$("mgBan")&&$("mgBan").click();else if(k==="pass")$("passMini")&&$("passMini").click();else if(k==="hh")$("hhBan")&&$("hhBan").click();
    else if(k==="qP")hubOpen("prg","qP");else if(k==="bagU")hubOpen("bag","bagU");return}
  const bd=t.closest("[data-gb]");if(bd){e.stopPropagation();const i=+bd.dataset.gb;snd("ui");gmVib(8);gmOpen("shopP");
    setTimeout(()=>{const tl=$("bg"+i);if(!tl)return;try{tl._siv({block:"center",behavior:"smooth"})}catch(x){}tl.classList.remove("gflash");void tl.offsetWidth;tl.classList.add("gflash")},90);return}
  if(t.closest("#gMed")){e.stopPropagation();e.preventDefault();snd("ui");hubOpen("adv","gymP");return}
  if(t.closest("#gTk")){snd("ui");gmOpen("earnP");return}
  if(t.closest("#gStk")){const h=$("hudStk");if(h)h.click();return}
  if(t.closest("#gPass")){const p=$("passMini");if(p)p.click();return}
}
// ---------- ayuda: los textos largos se esconden tras el botón (?) ----------
function gmHelpMark(root){if(!root)return;root.querySelectorAll("p.rates,p.nxi,p.mut,small,.panel>p").forEach(e=>{if(e.dataset.gh)return;e.dataset.gh=1;const t=(e.textContent||"").trim();
  if(t.length>70&&!e.id&&!e.querySelector("[id],button,input,select,a,progress"))e.classList.add("ghelp")})}
function gmHelpT(){GM.help=!GM.help;document.body.classList.toggle("ghelpon",GM.help);snd("ui")}
// ---------- barra superior ----------
function gmTop(){
  const v=S.t||0;if(GM.disp==null)GM.disp=v;const d=v-GM.disp;
  if(Math.abs(d)<.05||hubCalm())GM.disp=v;else GM.disp+=d*.35;
  const el=$("gTkN"),txt=fmt(Math.abs(v-GM.disp)<.05?v:GM.disp);if(el.textContent!==txt)el.textContent=txt;
  if(d>Math.max(50,v*.05)&&!GM.bump){GM.bump=1;const p=$("gTk");p.classList.remove("gup");void p.offsetWidth;p.classList.add("gup");setTimeout(()=>GM.bump=0,600)}
  let tp=0;try{tp=tps()}catch(e){}const ts=tp>0?"+"+fmt(tp)+"/s":"";if($("gTps").textContent!==ts)$("gTps").textContent=ts;
  try{const m=medCount()+"/8";if($("gMedN").textContent!==m)$("gMedN").textContent=m}catch(e){}
  try{const s=String(strkNow());if($("gStkN").textContent!==s)$("gStkN").textContent=s}catch(e){}
  try{const pm=$("passMini"),q=pm&&pm.textContent.match(/Nv\s*(\d+)\s*\/\s*(\d+)/);if(q){const s="Nv "+q[1];if($("gPassN").textContent!==s)$("gPassN").textContent=s;const bi=pm.querySelector(".pmbar i");$("gPassB").style.width=bi?bi.style.width||"0%":(q[1]/q[2]*100)+"%"}}catch(e){}
  try{const nk=S.nick?String(S.nick).slice(0,18):"Entrenador";if($("gNick").textContent!==nk)$("gNick").textContent=nk}catch(e){}
  try{const cv=parseFloat(($("cpsv")||{}).textContent)||0,cb=$("gCombo");if(cv>=1){$("gCmb").textContent=cv.toFixed(1);if(!cb.classList.contains("on"))cb.classList.add("on");cb.classList.toggle("hot",cv>=6)}else cb.classList.remove("on","hot")}catch(e){}
  try{const k=trEnc(myLook());if(k!==GM.look){GM.look=k;$("gAv").innerHTML=trImg(myLook(),"f","i");const tr=$("gTr");if(tr)tr.innerHTML=trImg(myLook(),"f","i")}}catch(e){}
}
function gmBadges(){let bd={};try{bd=hubBadges()}catch(e){}
  const set=(el,v)=>{if(!el)return;const i=el.querySelector(".gbd");if(!i)return;i.hidden=!v;if(v)i.textContent=v===true?"!":v};
  set(document.querySelector('[data-gn="soc"]'),bd.soc);set(document.querySelector('[data-gn="menu"]'),(+bd.prg||0)+(+bd.bag||0)||0);set(document.querySelector('[data-gn="exp"]'),bd.adv);
  let dl=false;try{dl=S.daily!==today()}catch(e){}set(document.querySelector('[data-gs="earnP"]'),dl);
  set(document.querySelector('[data-gs="qP"]'),bd.prg);set(document.querySelector('[data-gs="bagU"]'),bd.bag);
  const hh=$("hhBan"),ev=document.querySelector('[data-gs="hh"]');if(ev)ev.hidden=!(hh&&hh.classList.contains("on")&&hh.offsetParent!==null||hh&&hh.classList.contains("on"));
  const sh=document.querySelector('[data-gn="shop"]');if(sh){let can=0;try{can=G.some((g,i)=>S.t>=gc(i))?1:0}catch(e){}set(sh,can?"↑":0)}}
// ---------- hora del día ----------
function gmTod(){const h=new Date().getHours()+new Date().getMinutes()/60;let k=GM.todF||"day";if(!GM.todF)
  if(h>=21||h<6)k="night";else if(h<8.5)k="dawn";else if(h>=18.5)k="dusk";if(document.body.dataset.tod!==k)document.body.dataset.tod=k}
// ---------- entrenador y compañero junto a la Poké Ball ----------
function gmHero(){const b=$("gBud");if(!b)return;let n=null;try{n=S.buddy&&S.owned[S.buddy.n]>0?S.buddy.n:(S.team||[]).find(x=>x&&S.owned[x])}catch(e){}
  if(!n){b.innerHTML="";GM.bud=null;return}const sh=!!(S.shiny&&S.shiny[n]>0);if(GM.bud&&GM.bud.n===n&&GM.bud.sh===sh)return;
  GM.bud={n:n,sh:sh,pm:null,at:0,el:null};const me=GM.bud;b.innerHTML='<div class="gbst">'+ico(PM[n]||[n],72,false,sh)+'</div>';
  if(typeof pmdLoad==="function")pmdLoad(n,sh).then(d=>{if(!d||GM.bud!==me)return;me.pm=d;b.innerHTML='<div class="gbpm"></div>';me.el=b.firstChild}).catch(()=>{})}
function gmBudTick(dt){const B=GM.bud;if(!B||!B.pm||!B.el)return;const P=B.pm,a=P.Idle||P.Walk;if(!a)return;
  if(B.an!==a){B.an=a;const sc=P.sc*1.15;B.el.style.cssText="width:"+(a.fw*sc).toFixed(0)+"px;height:"+(a.fh*sc).toFixed(0)+"px;margin-bottom:"+(-(a.fh-1-a.bot)*sc).toFixed(0)+"px;background-image:url("+a.url+");background-size:"+(a.W*sc).toFixed(0)+"px "+(a.H*sc).toFixed(0)+"px";B.sc=sc}
  B.at+=hubCalm()?0:dt;const fr=pmdFrame(B.at,a);B.el.style.backgroundPosition=(-fr*a.fw*B.sc).toFixed(0)+"px 0px"}
// ---------- el pueblo: edificios que crecen, Pokémon paseando y tickets saliendo ----------
const GDEC=[["tree","lamp"],["bush","flow"],["tree2"],["lamp","flow"],["pine","bush"],["tree","lamp"],["flow","pine"],["tree2","lamp"]];
function gmTownBuild(){const box=$("gBs");if(!box)return;const sc=innerWidth>=900&&innerHeight>=700?3:innerWidth<700?1.5:2,k=(S.g||[]).map(gbTier).join(",")+"|"+(S.g||[]).join(",")+"|"+sc+"|"+Math.round(innerWidth/40);if(k===GM.town)return;const ps=sc>=3?2:sc;
  const old=GM.tier.slice();GM.town=k;const pv=document.querySelector("#gTrack .gpath");if(pv){pv.style.backgroundImage="url("+gbPathURL()+")";pv.style.backgroundSize=(48*ps)+"px "+(20*ps)+"px";pv.style.height=(20*ps)+"px";$("gTown").style.setProperty("--gpb",(20*ps-8)+"px")}
  const dec=i=>'<span class="gdecs">'+GDEC[i%GDEC.length].map(d=>'<span class="gdec" data-d="'+d+'"></span>').join("")+'</span>';
  box.innerHTML=dec(7)+G.map((g,i)=>{const n=S.g[i]||0,t=gbTier(n);return '<button class="gbld'+(t?"":" glock")+'" data-gb="'+i+'" title="'+esc(GBN[i]||g[0])+'"><span class="gbc"></span><span class="gbl">'+(t?'<i>'+"★".repeat(t)+'</i>Nv '+fmt(n):'🔒 '+fmt(gc(i)))+'</span></button>'+dec(i)}).join("");
  box.querySelectorAll(".gdec").forEach(el=>{const c=gdCanvas(el.dataset.d);c.style.width=c.width*sc+"px";c.style.height=c.height*sc+"px";el.appendChild(c);if(el.dataset.d==="lamp")el.classList.add("glamp")});
  box.querySelectorAll(".gbld").forEach((el,i)=>{const t=gbTier(S.g[i]||0),c=gbCanvas(i,t),bc=el.querySelector(".gbc");c.style.width=c.width*sc+"px";c.style.height=c.height*sc+"px";bc.appendChild(c);
    if(c._lit){const n=c._lit;n.className="gnt";n.style.width=c.style.width;n.style.height=c.style.height;bc.appendChild(n)}
    if(c._meta&&c._meta.smk){const sm=document.createElement("i");sm.className="gsmk";sm.style.left=(c._meta.smk[0]*sc)+"px";sm.style.top=(c._meta.smk[1]*sc)+"px";sm.innerHTML="<b></b><b></b><b></b>";bc.appendChild(sm)}
    if(old.length&&t>(old[i]||0)){el.classList.add("gnew");setTimeout(()=>{const r=el.getBoundingClientRect(),f=$("gTown").getBoundingClientRect();gmSparks($("gTown"),r.left-f.left+$("gTown").scrollLeft+r.width/2,r.top-f.top+r.height/2,14,1);try{snd("lvl")}catch(e){}},50)}});
  GM.tier=(S.g||[]).map(gbTier);GM.tw=[];gmWalkers();
  // si el pueblo no cabe, quita decoración poco a poco
  const fit=()=>$("gTrack").scrollWidth<=$("gTown").clientWidth+2;
  if(!fit())box.querySelectorAll(".gdecs .gdec:nth-child(2)").forEach(e=>e.remove());
  if(!fit())box.querySelectorAll(".gdecs:nth-of-type(2n)").forEach(e=>e.remove());
  if(!fit())box.querySelectorAll(".gdecs").forEach((e,i)=>{if(i)e.remove()})}
function gmWalkers(){const w=$("gWks");if(!w)return;let pool=[];try{pool=(S.team||[]).filter(n=>n&&S.owned[n]>0&&PM[n]);const all=Object.keys(S.owned).filter(n=>S.owned[n]>0&&PM[n]);for(let i=0;i<8&&all.length;i++)pool.push(all[Math.floor(Math.random()*all.length)])}catch(e){}
  const own=(S.g||[]).reduce((a,n)=>a+(n>0?1:0),0),N=Math.min(pool.length,own?2+own:1);if(GM.tw.length===N)return;
  w.innerHTML="";GM.tw=[];const tw=$("gTrack").scrollWidth||innerWidth;
  for(let i=0;i<N;i++){const n=pool[i%pool.length],e=document.createElement("div");e.className="gwk";e.innerHTML='<div class="gwki">'+ico(PM[n],40)+'</div>';w.appendChild(e);
    GM.tw.push({e:e,x:Math.random()*(tw-60),v:(Math.random()<.5?-1:1)*(18+Math.random()*16),wait:Math.random()*2000,y:Math.random()*10})}}
function gmTown(t){const dt=Math.min(60,t-(GM.last||t));GM.last=t;if(GM.scr||!$("hubM").hidden)return;
  gmTownBuild();gmBudTick(dt);
  const tw=$("gTrack").scrollWidth||innerWidth,calm=hubCalm();
  GM.tw.forEach(o=>{if(calm){o.e.style.transform="translate("+o.x.toFixed(0)+"px,"+(-o.y).toFixed(0)+"px)";return}
    if(o.wait>0){o.wait-=dt;o.e.classList.remove("go")}else{o.x+=o.v*dt/1000;o.e.classList.add("go");if(o.x<0||o.x>tw-50){o.v=-o.v;o.x=Math.max(0,Math.min(tw-50,o.x))}if(Math.random()<dt/5000){o.wait=800+Math.random()*2500;if(Math.random()<.4)o.v=-o.v}}
    o.e.style.transform="translate("+o.x.toFixed(1)+"px,"+(-o.y).toFixed(0)+"px)";o.e.firstChild.style.transform=o.v>0?"scaleX(-1)":"";o.e.style.zIndex=String(20-Math.round(o.y))});
  if(t-GM.pop>1400&&!calm){GM.pop=t;let tot=0;const ws=G.map((g,i)=>{const p=g[2]*(S.g[i]||0);tot+=p;return p});if(tot<=0)return;
    let r=Math.random()*tot,i=0;while(i<ws.length-1&&r>ws[i]){r-=ws[i];i++}
    const b=document.querySelector('.gbld[data-gb="'+i+'"]');if(!b)return;const amt=ws[i]*PMUL()*1.4,s=document.createElement("span");s.className="gpop";s.innerHTML="+"+fmt(amt)+" "+gI("ticket",16);
    s.style.left=(b.offsetLeft+b.offsetWidth/2)+"px";s.style.top=(b.offsetTop+8)+"px";$("gBs").appendChild(s);setTimeout(()=>s.remove(),1500)}}
// arranca cuando la partida está cargada
{const iv=setInterval(()=>{try{if(!GM.init&&$("auth")&&$("auth").hidden&&$("hubM")&&typeof S!=="undefined"&&S&&S.owned&&$("farm")){clearInterval(iv);gmInit()}}catch(e){}},250)}
// ---------- el tutorial de los jugadores nuevos abre la sección de cada paso ----------
{const _ts=tutStep;tutStep=function(){const r=_ts.apply(this,arguments);try{if(gmOn()&&GM.init&&TS.i>=0&&TS.i<TUT.length){const s=TUT[TS.i];if(s.el==="#navb")s.el="#gnavb";
  const el=document.querySelector(s.el),pan=el&&el.closest&&el.closest("#stage,#batP,#shopP,#earnP");
  if(pan&&GM.scr!==pan.id)gmOpen(pan.id);else if(!pan&&GM.scr&&(s.el==="#train"||s.el==="#gnavb"))gmClose();
  if(el&&pan)setTimeout(()=>{try{el._siv({block:"center"})}catch(e){}},80)}}catch(e){}return r}}
window.GM=GM;window.gmOpen=gmOpen;window.gmClose=gmClose;
