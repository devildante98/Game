# ---- objetos: sprites originales tambien para curacion, Pokeballs y PP ----
_a=H.index('function itemIco(id,s){\n  if(GD.EI[id])return')
_b=H.index('\n',H.index('if(GD.EI[id])return',_a))
H=H[:_a]+r"""const ITEM_IMG={pot:"potion",spot:"super-potion",hpot:"hyper-potion",mpot:"max-potion",rev:"revive",mrev:"max-revive",pb:"poke-ball",sb:"great-ball",ub:"ultra-ball",mb:"master-ball",cand:"rare-candy",eter:"ether",meter:"max-ether",elix:"elixir",melix:"max-elixir",ppup:"pp-up",ppmax:"pp-max"};
// si la imagen original no carga se usa el dibujo propio (o 💎 para los objetos evolutivos)
function itemErr(el){const id=el.dataset.id,s=+el.dataset.s;if(el.src.indexOf("raw.githubusercontent")<0&&!el.dataset.r){el.dataset.r=1;el.src=el.src.replace("https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/","https://raw.githubusercontent.com/PokeAPI/sprites/master/");return}const d=document.createElement("span");d.innerHTML=GD.EI[id]?'<span style="font-size:'+Math.round(s*.6)+'px">💎</span>':itemIco(id,s,1);el.replaceWith(d.firstChild)}
function itemIco(id,s,noImg){
  const k=GD.EI[id]?id:ITEM_IMG[id];
  if(k&&!noImg)return '<img class="pk item" src="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/'+k+'.png" width="'+s+'" height="'+s+'" alt="" loading="lazy" data-id="'+id+'" data-s="'+s+'" onerror="itemErr(this)">';"""+H[_b:]
H=H.replace(".dexn{position:absolute;","img.pk.item{object-fit:contain;image-rendering:pixelated}\n.dexn{position:absolute;",1)
# ---- racha diaria: ventana emergente tipo pase de batalla ----
H=H.replace('<button id="daily">Reclamar +5.000 🎟️</button><div id="strk"></div></div>','<button id="daily">Reclamar +5.000 🎟️</button><button id="strkB" class="strkb">🔥 Racha</button></div>',1)
H=H.replace('<div id="prof" hidden role="dialog"','<div id="strkM" hidden role="dialog" aria-modal="true" aria-label="Racha diaria"><div class="jbox"><div id="strk"></div></div></div>\n<div id="prof" hidden role="dialog"',1)
_a=H.index('let _sk="";\nfunction strkUI(){')
_b=H.index('$("daily").onclick=()=>{',_a)
H=H[:_a]+r"""let _sk="";
function strkUI(){
  const n=strkNow(),claimed=S.daily===today();$("strkB").textContent="🔥 Racha: "+n+" día"+(n===1?"":"s");
  if($("strkM").hidden)return;
  const cyc=Math.floor(Math.max(0,(claimed?n:n)-1)/30),start=cyc*30+1,key=n+":"+claimed+":"+(S.sk&&S.sk.best)+":"+start;if(key===_sk)return;_sk=key;
  const nx=claimed?n+1:n+1;
  const cell=d=>{const r=strkRw(d),c=((d-1)%30)+1,big=c%7===0||c===30,got=d<=n&&(d<n||claimed),cur=d===nx&&!claimed;
    return '<div class="bpd'+(got?' got':'')+(cur?' now':'')+(big?' bpk':'')+(c===30?' fin':'')+'"><small>Día '+d+'</small><span>'+Object.keys(r).map(k=>itemIco(k==="evo"?"fire-stone":k,c===30?30:24)+(r[k]>1?'<b>×'+r[k]+'</b>':'')).join("")+'</span>'+(got?'<i>✔</i>':cur?'<em>¡HOY!</em>':'')+'</div>'};
  $("strk").innerHTML='<div class="bph"><h2>🔥 Pase diario</h2><div class="bpn"><b>'+n+'</b><small>día'+(n===1?"":"s")+' seguidos</small></div></div>'+
    '<div class="bar bpbar"><i style="width:'+Math.min(100,((n-cyc*30)-(claimed?0:0))/30*100)+'%"></i></div>'+
    '<small class="mut">Reclama el regalo cada día sin fallar para avanzar. Cada 7 días cae un Caramelo Raro y el día 30 una Master Ball; después el pase vuelve a empezar. Si te saltas un día, la racha vuelve a 1.'+(S.sk&&S.sk.best?' Tu mejor racha: '+S.sk.best+' días.':'')+'</small>'+
    '<div class="bpgrid">'+Array.from({length:30},(_,i)=>cell(start+i)).join("")+'</div>'+
    '<div class="jrow">'+(claimed?'<button class="alt" data-bpc="1">✔ Ya has reclamado hoy · vuelve mañana</button>':'<button class="red" data-bpg="1">🎁 Reclamar día '+nx+' (+'+fmt(gift())+' 🎟️)</button>')+'<button class="alt" data-bpc="1">Cerrar</button></div>';
}
function strkOpen(){$("strkM").hidden=false;_sk="";strkUI()}
$("strkB").onclick=strkOpen;
$("strkM").addEventListener("click",e=>{if(e.target.id==="strkM"){$("strkM").hidden=true;return}const b=e.target.closest("button");if(!b)return;if(b.dataset.bpc){$("strkM").hidden=true;return}if(b.dataset.bpg){$("daily").click();_sk="";strkUI();if(O.fx){const g=$("strkM").querySelector(".bpd.got:last-of-type")}}});
// al entrar, si toca reclamar, se abre sola (despues de la bienvenida y las novedades)
setTimeout(()=>{if(S.daily!==today()&&$("welc").hidden&&$("newsM").hidden)strkOpen();else if(S.daily!==today()){const iv=setInterval(()=>{if($("welc").hidden&&$("newsM").hidden){clearInterval(iv);if(S.daily!==today())strkOpen()}},800)}},1200);
"""+H[_b:]
H=H.replace(".dly{display:flex;flex-direction:column;gap:6px}",""".dly{display:flex;flex-direction:column;gap:6px}
.strkb{background:linear-gradient(90deg,#ff7a3c,#e63950);color:#fff}
#strkM{position:fixed;inset:0;z-index:104;background:rgba(10,12,30,.72);display:flex;align-items:center;justify-content:center;padding:16px}
#strkM .jbox{max-width:720px;max-height:calc(100vh - 32px);overflow:auto;text-align:left;padding:20px}
.bph{display:flex;align-items:center;justify-content:space-between;gap:10px}.bph h2{margin:0;text-align:left}
.bpn{display:flex;flex-direction:column;align-items:center;background:linear-gradient(135deg,#ff7a3c,#e63950);color:#fff;border-radius:14px;padding:4px 14px}.bpn b{font-size:1.6rem;line-height:1.1}.bpn small{font-size:.7rem}
.bpbar{height:10px;margin:10px 0 6px}.bpbar i{background:linear-gradient(90deg,#ff7a3c,#ffd35c)}
.bpgrid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin:12px 0}
@media (max-width:520px){.bpgrid{grid-template-columns:repeat(4,minmax(0,1fr))}}
.bpd{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:5px 2px;min-height:70px}
.bpd small{font-size:.65rem;color:var(--mute)}.bpd span{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:1px}.bpd span b{font-size:.62rem}
.bpd.bpk{border-color:var(--yel);background:color-mix(in srgb,var(--yel) 14%,var(--bg))}
.bpd.fin{border:2px solid #c57bff;background:color-mix(in srgb,#c57bff 18%,var(--bg))}
.bpd.got{opacity:.55}.bpd.got i{position:absolute;inset:0;display:grid;place-items:center;font-style:normal;font-size:1.6rem;color:var(--teal);text-shadow:0 0 4px var(--panel)}
.bpd.now{border:2px solid var(--teal);box-shadow:0 0 14px color-mix(in srgb,var(--teal) 60%,transparent);animation:bpglow 1.2s ease-in-out infinite alternate}
.bpd.now em{font-style:normal;font-size:.6rem;font-weight:800;color:var(--teal)}
@keyframes bpglow{to{box-shadow:0 0 22px color-mix(in srgb,var(--teal) 90%,transparent)}}""",1)
H=H.replace('<li>⚔️ <b>Combate</b>:','<li>🔥 <b>Pase diario</b>: reclama el regalo cada día seguido para avanzar en tu racha (botón 🔥 junto al regalo diario).</li>\n    <li>⚔️ <b>Combate</b>:',1)

# ---- ventana de intercambio ----
H=H.replace('<div id="prof" hidden role="dialog"','<div id="trdM" hidden role="dialog" aria-modal="true" aria-label="Intercambio"><div class="jbox tbox"><div id="trdB"></div></div></div>\n<div id="prof" hidden role="dialog"',1)
H=H.replace(".dexn{position:absolute;",""".dexn{position:absolute;""".replace(".dexn",".dexn"),1)
H=H.replace("img.pk.item{",r"""#trdM{position:fixed;inset:0;z-index:106;background:rgba(8,10,28,.8);display:flex;align-items:center;justify-content:center;padding:12px}
.tbox{max-width:760px;width:100%;max-height:calc(100vh - 24px);overflow:auto;text-align:left;padding:18px;background:linear-gradient(180deg,var(--panel),var(--bg));border-color:#4fc0ee;box-shadow:0 0 40px 6px rgba(79,192,238,.45)}
.tbox h2{margin:0 0 10px;text-align:center;color:var(--ink)}
.tvs{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:stretch;margin-bottom:8px}
.tarrow{display:grid;place-items:center}.tarrow span{font-size:2rem;color:#4fc0ee;animation:tarr 1.2s ease-in-out infinite;display:block}
@keyframes tarr{50%{transform:scale(1.25) rotate(180deg)}}
.tcard{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;background:linear-gradient(160deg,color-mix(in srgb,#4fc0ee 18%,var(--bg)),var(--bg));border:3px solid var(--C);border-radius:16px;padding:8px;min-height:190px;text-align:center}
.tcard.R{border-color:var(--R)}.tcard.E{border-color:var(--E);box-shadow:0 0 12px var(--E)}.tcard.L{border-color:var(--L);box-shadow:0 0 18px var(--L)}
.tcard.shiny{border-color:#ffd35c;box-shadow:0 0 22px #ffe58a}
.tcard.empty{border:3px dashed var(--line);justify-content:center}
.tcard .tqm{font-size:3rem;font-weight:800;color:var(--mute);animation:tqp 1.4s ease-in-out infinite}@keyframes tqp{50%{opacity:.35;transform:scale(.9)}}
.tspr2 img.pk{max-height:108px!important;max-width:150px!important;object-fit:contain}
.tspr2{height:110px;overflow:hidden;display:grid;place-items:center;animation:tbob 1.6s ease-in-out infinite}@keyframes tbob{50%{transform:translateY(-5px)}}
.tcard small{color:var(--mute);font-size:.75rem}.tevo{color:var(--teal)!important;font-weight:700}
.tsolo{max-width:280px;margin:8px auto}
.tfil{display:flex;gap:6px;margin:10px 0 6px}.tfil input,.tfil select{font:inherit;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink)}.tfil input{flex:1;min-width:0}
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:6px;max-height:300px;overflow:auto;padding:4px;background:var(--bg);border-radius:12px;border:1px solid var(--line)}
.tcell{display:flex;flex-direction:column;align-items:center;gap:1px;background:var(--panel);color:var(--ink);border:2px solid var(--C);border-radius:12px;padding:4px 2px;font-weight:600}
.tcell.R{border-color:var(--R)}.tcell.E{border-color:var(--E)}.tcell.L{border-color:var(--L)}.tcell.shiny{background:color-mix(in srgb,#ffd35c 20%,var(--panel))}
.tcell b{font-size:.72rem;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tcell small{font-size:.62rem;color:var(--mute);font-weight:400}
.tcell.sel{outline:3px solid #4fc0ee;transform:scale(1.04);box-shadow:0 0 14px #4fc0ee}
.tpulse{text-align:center;animation:tqp 1.4s ease-in-out infinite}
.thot{border-color:#4fc0ee!important;box-shadow:0 0 10px rgba(79,192,238,.5)}
.tstage{position:relative;height:300px;border-radius:16px;overflow:hidden;background:radial-gradient(circle at 50% 55%,#2a5d9a,#0d1b3a 70%);border:3px solid #4fc0ee}
.tstage .tmon{position:absolute;transform:translate(-50%,-50%)}
.tline{position:absolute;left:50%;top:0;bottom:0;width:6px;margin-left:-3px;background:linear-gradient(transparent,#bff2ff,#fff,#bff2ff,transparent);opacity:0;box-shadow:0 0 24px #4fc0ee}
.tline.on{animation:tline 1.3s ease-in-out}@keyframes tline{0%{opacity:0;transform:scaleX(.5)}30%,70%{opacity:1;transform:scaleX(3)}100%{opacity:0}}
.tsp{position:absolute;font-size:1.3rem;opacity:0;animation:hsparkle 1.2s ease-out forwards;pointer-events:none}
.tflash{position:absolute;inset:0;background:radial-gradient(circle,#fff,transparent 70%);opacity:0;pointer-events:none}
.tmsg{text-align:center;font-weight:700;min-height:1.5em}
img.pk.item{""",1)
# ---- titulo claro para la lista de jugadores conectados ----
rep('<div id="pvList" class="pvlist"></div>','<div class="pvhead"><span class="pvdot"></span><b>Jugadores conectados ahora</b><span class="pvcnt" id="pvCnt"></span></div><div id="pvList" class="pvlist"></div>')
rep('img.pk.item{','.pvhead{display:flex;align-items:center;gap:8px;margin:14px 0 4px;padding:8px 12px;border-radius:12px;background:color-mix(in srgb,#2fbf5a 12%,var(--bg));border:1px solid color-mix(in srgb,#2fbf5a 40%,var(--line))}\n.pvhead b{font-size:1.05rem}.pvcnt{margin-left:auto;font-size:.8rem;font-weight:700;color:#1f9a45;background:color-mix(in srgb,#2fbf5a 18%,transparent);border-radius:99px;padding:2px 10px}\n.pvcnt:empty{display:none}\n.pvdot{width:10px;height:10px;border-radius:50%;background:#2fbf5a;box-shadow:0 0 0 3px color-mix(in srgb,#2fbf5a 30%,transparent);flex:none}\nimg.pk.item{',1)
