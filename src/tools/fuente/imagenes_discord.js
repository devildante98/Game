const {chromium}=require('playwright');const fs=require('fs');
const F=fs.readFileSync('/home/user/Game/src/tools/fuente/GachaPop.ttf').toString('base64');
const BALL='data:image/svg+xml;base64,'+fs.readFileSync('ball.svg').toString('base64');
const CSS=`@font-face{font-family:GP;src:url(data:font/ttf;base64,${F})}*{box-sizing:border-box}body{margin:0;font-family:GP}
.bg{position:absolute;inset:0;background:radial-gradient(circle at var(--cx,50%) 55%,#8a2be2 0,#4a128f 45%,#1a0838 100%);overflow:hidden}
.rays{position:absolute;left:var(--cx,50%);top:55%;width:3000px;height:3000px;margin:-1500px 0 0 -1500px;background:repeating-conic-gradient(from 0deg,rgba(255,215,110,.28) 0 7deg,rgba(255,215,110,0) 7deg 20deg);-webkit-mask:radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.55) 1.5px,transparent 2px);background-size:46px 46px;opacity:.25}
.gold{background:linear-gradient(#fff6b8,#ffd23f 50%,#f09000);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:var(--sw,6px) #2a0c4a;paint-order:stroke fill;filter:drop-shadow(0 var(--sh,8px) 0 #12051f) drop-shadow(0 0 24px rgba(255,190,60,.45))}
.white{color:#fff;-webkit-text-stroke:var(--sw,5px) #2a0c4a;paint-order:stroke fill;filter:drop-shadow(0 var(--sh,6px) 0 #12051f)}
.pill{display:inline-block;background:linear-gradient(#ff5d73,#c4183c);border:4px solid #2a0c4a;border-radius:999px;box-shadow:0 6px 0 #12051f;color:#fff;padding:.18em .9em .1em}
.sp{position:absolute;color:#fff;text-shadow:0 0 12px #fff}`;
const page=(w,h,body,cx)=>`<html><head><style>${CSS}</style></head><body style="width:${w}px;height:${h}px;position:relative;overflow:hidden"><div class="bg" style="--cx:${cx||'50%'}"><div class="rays"></div><div class="dots"></div></div>${body}</body></html>`;
const sparks=(L)=>L.map(([x,y,s])=>`<div class="sp" style="left:${x}px;top:${y}px;font-size:${s}px">✦</div>`).join("");
(async()=>{const b=await chromium.launch();const p=await b.newPage();
 const shot=async(name,w,h,html,transparent)=>{await p.setViewportSize({width:w,height:h});await p.setContent(html);await p.waitForTimeout(400);await p.screenshot({path:'out/'+name,omitBackground:!!transparent});};
 fs.mkdirSync('out',{recursive:true});
 // 1) banner del servidor 960x540
 await shot('banner_servidor_960x540.png',960,540,page(960,540,`<img src="${BALL}" style="position:absolute;left:30px;top:70px;width:400px">
   <div style="position:absolute;left:420px;top:120px;width:520px;text-align:center"><div class="gold" style="font-size:104px;line-height:.95;--sw:7px">POKE<br>GACHA</div>
   <div class="white" style="font-size:62px;margin-top:6px;letter-spacing:6px">ONLINE</div><div style="margin-top:22px;font-size:26px"><span class="pill">¡ÚNETE A LA AVENTURA!</span></div></div>${sparks([[880,40,30],[440,450,24],[60,40,20],[900,470,18]])}`,'24%'));
 // 2) fondo de la invitación 1920x1080
 await shot('fondo_invitacion_1920x1080.png',1920,1080,page(1920,1080,`<img src="${BALL}" style="position:absolute;left:660px;top:110px;width:600px">
   <div style="position:absolute;left:0;right:0;top:700px;text-align:center"><div class="gold" style="font-size:150px;--sw:9px;--sh:10px">POKE GACHA ONLINE</div>
   <div class="white" style="font-size:52px;margin-top:10px">COLECCIONA · COMBATE · TIRA DEL GACHA</div></div>${sparks([[300,200,50],[1600,260,60],[200,820,34],[1700,860,40],[1450,120,26]])}`));
 // 3) logo con el nombre (fondo transparente)
 await p.setViewportSize({width:1800,height:520});await p.setContent(`<html><head><style>${CSS}</style></head><body style="background:transparent;width:1800px;height:520px;display:flex;align-items:center;gap:30px;padding:0 40px">
   <img src="${BALL}" style="width:460px;flex:none"><div><div class="gold" style="font-size:150px;line-height:.95;--sw:9px;--sh:10px">POKE GACHA</div><div class="white" style="font-size:96px;letter-spacing:12px;margin-top:8px">ONLINE</div></div></body></html>`);
 await p.waitForTimeout(400);await p.screenshot({path:'out/logo_nombre_transparente.png',omitBackground:true});
 // 4) cabeceras de canales 1200x300
 const HD=[["BIENVENIDA","👋","#ff5d73"],["NORMAS","📜","#ffb43a"],["NOVEDADES","📢","#5ab4ff"],["SORTEOS","🎉","#b06cf0"],["CÓDIGOS","🎁","#3bd16f"],["CHAT GENERAL","💬","#ff7ad9"],["SUGERENCIAS","💡","#ffe14a"],["INTERCAMBIOS","🔄","#4fd0ff"]];
 for(const [t,e,c] of HD){await shot('cabecera_'+t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ /g,'_')+'.png',1200,300,page(1200,300,`<div style="position:absolute;inset:0;border-bottom:10px solid ${c}"></div>
   <img src="${BALL}" style="position:absolute;left:30px;top:-10px;width:300px">
   <div style="position:absolute;left:330px;right:30px;top:0;bottom:0;display:flex;align-items:center;justify-content:center"><div class="gold" style="font-size:${t.length>10?92:110}px;--sw:7px">${t}</div></div>`,'14%'))}
 await b.close()})();
