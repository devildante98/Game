const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const [f,sz,out] of [["icon.svg",512,"icon-512.png"],["icon.svg",192,"icon-192.png"],["icon_mask.svg",512,"icon-maskable-512.png"],["icon_sq.svg",180,"favicon_apple.png"]]){
 await p.setViewportSize({width:sz,height:sz});await p.setContent('<html><body style="margin:0;background:transparent">'+fs.readFileSync(f,'utf8').replace('<svg ','<svg width="'+sz+'" height="'+sz+'" ')+'</body></html>');
 await p.screenshot({path:out,omitBackground:true,clip:{x:0,y:0,width:sz,height:sz}})}
// vista previa de tamaños
await p.setViewportSize({width:900,height:300});const s=fs.readFileSync('icon.svg','utf8'),sm=fs.readFileSync('icon_small.svg','utf8');
const im=(x,w)=>'<img src="data:image/svg+xml;base64,'+Buffer.from(x).toString('base64')+'" width="'+w+'" height="'+w+'" style="margin:10px;vertical-align:middle">';
await p.setContent('<body style="margin:0;background:#2b2b33;padding:10px">'+im(s,256)+im(s,128)+im(sm,64)+im(sm,32)+im(sm,16)+'<div style="background:#dee1e6;display:inline-block;padding:6px 10px;border-radius:8px 8px 0 0;font:13px sans-serif;margin-left:10px">'+im(sm,16).replace('margin:10px','margin:0 6px 0 0')+'Poke Gacha Online</div></body>');
await p.screenshot({path:'preview.png'});await b.close()})();
