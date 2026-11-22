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
 await p.setViewportSize({width:1200,height:630});
 await p.setContent(page(1200,630,`<img src="${BALL}" style="position:absolute;left:28px;top:70px;width:470px">
  <div style="position:absolute;left:500px;right:40px;top:78px;display:flex;flex-direction:column;align-items:flex-start;gap:14px">
   <div class="gold" style="font-size:112px;line-height:.92;--sw:8px;--sh:9px">POKE<br>GACHA</div>
   <div class="white" style="font-size:66px;letter-spacing:9px;line-height:1">ONLINE</div>
   <div style="font:700 25px/1.35 system-ui,'Segoe UI',Roboto,sans-serif;color:#f1eaff;max-width:620px;text-shadow:0 2px 0 #12051f;margin-top:6px">Colecciona más de 1.200 Pokémon, tira del gacha y juega con entrenadores de todo el mundo.</div>
   <div style="display:flex;gap:8px;flex-wrap:nowrap;font-size:19px;margin-top:6px">${["🎰 GACHA","⚔️ COMBATES","🛡️ GREMIOS","🏆 TORNEOS"].map(t=>'<span style="background:rgba(20,6,43,.75);border:3px solid #ffcc33;color:#fff6c8;border-radius:999px;padding:6px 11px 2px">'+t+'</span>').join("")}</div>
  </div>
  <div style="position:absolute;left:52px;bottom:34px;font-size:24px"><span class="pill">¡GRATIS EN EL NAVEGADOR!</span></div>
  <div style="position:absolute;right:26px;bottom:16px;font:600 15px system-ui,sans-serif;color:rgba(255,255,255,.65)">Fangame no oficial · sin ánimo de lucro</div>
  ${sparks([[1130,40,30],[470,90,22],[40,250,20],[1150,330,18]])}`,'22%'));
 await p.waitForTimeout(500);await p.screenshot({path:'og_new.png'});await b.close()})();
