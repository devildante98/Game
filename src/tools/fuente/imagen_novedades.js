// Portada «NOVEDADES» para los avisos de versiones nuevas en Discord (discord/novedades.png, 1000x250), con el mismo estilo
// que las de sorteos y torneos (imagenes_discord_extras.js). Se ejecuta desde esta carpeta: node imagen_novedades.js
const {chromium}=require('playwright');const fs=require('fs');
const src=fs.readFileSync('imagenes_discord_extras.js','utf8');
// la Poké Ball con estrellas sale de la portada de sorteos (discord/evento_sorteo.png), recortada con un borde suave
const F=fs.readFileSync('GachaPop.ttf').toString('base64'),EV='data:image/png;base64,'+fs.readFileSync('../../../discord/evento_sorteo.png').toString('base64');
const CSS=src.slice(src.indexOf('const CSS=`')+11,src.indexOf('`;',src.indexOf('const CSS=`'))).replace('${F}',F);
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.setViewportSize({width:1000,height:250});
  await p.setContent(`<html><head><style>${CSS}</style></head><body style="width:1000px;height:250px;position:relative;overflow:hidden"><div class="bg" style="--cx:17%"><div class="rays"></div><div class="dots"></div></div>
  <div style="position:absolute;left:40px;top:-2px;width:230px;height:254px;background:url(${EV}) no-repeat;background-size:767px 307px;background-position:-17px -17px;-webkit-mask:radial-gradient(ellipse 50% 52% at 50% 52%,#000 0,#000 78%,transparent 100%)"></div>
  <div style="position:absolute;left:270px;right:20px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px"><div class="gold" style="font-size:96px;--sw:7px;letter-spacing:4px;line-height:1">NOVEDADES</div>
  <div class="white" style="font-size:20px;--sw:4px;--sh:4px">🆕 ¡HAY UNA VERSIÓN NUEVA DEL JUEGO!</div></div>
  <div class="sp" style="left:960px;top:18px;font-size:22px">✦</div><div class="sp" style="left:300px;top:205px;font-size:16px">✦</div><div class="sp" style="left:930px;top:200px;font-size:14px">✦</div></body></html>`);
  await p.waitForTimeout(400);await p.screenshot({path:'../../../discord/novedades.png'});await b.close()})();
