# ===================== rareza especial: Mega / Gigamax / Primigenio = 4 estrellas (M), legendarios = 5 =====================
rep('REF={C:0,R:1,E:2,L:4}','REF={C:0,R:1,E:2,M:3,L:4}')
rep('STAR={C:"★",R:"★★",E:"★★★",L:"★★★★"}','STAR={C:"★",R:"★★",E:"★★★",M:"★★★★",L:"★★★★★"}')
rep('const WW={C:1,R:2,E:3,L:4},HPM={C:90,R:120,E:150,L:180},ATK={C:15,R:20,E:25,L:30};','const WW={C:1,R:2,E:3,M:3,L:4},HPM={C:90,R:120,E:150,M:165,L:180},ATK={C:15,R:20,E:25,M:27.5,L:30};')
rep('const BALLR={C:"pb",R:"sb",E:"ub",L:"mb"}','const BALLR={C:"pb",R:"sb",E:"ub",M:"ub",L:"mb"}')
rep('const RCT={C:.9,R:.6,E:.35,L:.18};','const RCT={C:.9,R:.6,E:.35,M:.26,L:.18};')
rep('const GLW={C:"#fff",R:"#4f9dff",E:"#b26cff",L:"#ffb62e"};','const GLW={C:"#fff",R:"#4f9dff",E:"#b26cff",M:"#ff5fb8",L:"#ffb62e"};')
rep('const RC={C:"#fff",R:"#7fb6ff",E:"#d3a2ff",L:"#ffd15c"};','const RC={C:"#fff",R:"#7fb6ff",E:"#d3a2ff",M:"#ff9ad8",L:"#ffd15c"};')
rep('const best=res.reduce((a,x)=>"CREL".indexOf(x[0][2])>"CREL".indexOf(a)?x[0][2]:a,"C")','const best=res.reduce((a,x)=>"CREML".indexOf(x[0][2])>"CREML".indexOf(a)?x[0][2]:a,"C")')
rep('const lvl="CREL".indexOf(best)','const lvl=({C:0,R:1,E:2,M:2,L:3})[best]')
rep('"CREL".indexOf(res[i][0][2])>="CREL".indexOf(k)','({C:0,R:1,E:2,M:2,L:3})[res[i][0][2]]>="CREL".indexOf(k)')
rep('else if("CREL".indexOf(x[0][2])>1)','else if("CREML".indexOf(x[0][2])>1)')
rep('best==="L"?"¡LEGENDARIO! ":','best==="L"?"¡LEGENDARIO! ":best==="M"?"¡FORMA ESPECIAL! ":')
# las formas especiales salen en las tiradas de rareza epica (mismas probabilidades que antes)
rep('const pool=P.filter(p=>p[2]===r);','const pool=P.filter(p=>p[2]===r||(r==="E"&&p[2]==="M"));')
rep('<option value="L">Legendario</option>','<option value="M">Forma especial</option><option value="L">Legendario</option>',2)
rep('["C","R","E","L"].map','["C","R","E","M","L"].map')
# colores
rep('--L:#f5a300;','--L:#f5a300;--M:#e0479e;')
rep('--L:#ffb62e}}','--L:#ffb62e;--M:#ff6fc0}}')
rep('--L:#ffb62e}','--L:#ffb62e;--M:#ff6fc0}',1)
rep('.card.L{--g:var(--L)}','.card.L{--g:var(--L)}.card.M{--g:var(--M)}')
rep('.card.R{border-color:var(--R)}.card.E{border-color:var(--E);box-shadow:0 0 14px var(--E)}','.card.R{border-color:var(--R)}.card.E{border-color:var(--E);box-shadow:0 0 14px var(--E)}.card.M{border-color:var(--M);box-shadow:0 0 18px var(--M);background:linear-gradient(160deg,var(--bg),rgba(224,71,158,.18))}')
rep('.tcard.L{border-color:var(--L);box-shadow:0 0 18px var(--L)}','.tcard.L{border-color:var(--L);box-shadow:0 0 18px var(--L)}.tcard.M{border-color:var(--M);box-shadow:0 0 15px var(--M)}')
rep('.tcell.L{border-color:var(--L)}','.tcell.L{border-color:var(--L)}.tcell.M{border-color:var(--M)}')
# ===================== Poké Balls del gacha, del entrenamiento y del historial con los sprites originales (como en la tienda) =====================
_I1="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/";_I2="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/"
exec(open(W+'ball_svg.py',encoding='utf-8').read())
_bg=lambda n:'background:'+ball({'poke-ball':'pb','great-ball':'sb','ultra-ball':'ub','master-ball':'mb','poke-ball-red':'pbr'}[n])+' center/contain no-repeat!important'
rep('img.pk.item{object-fit:contain;image-rendering:pixelated}','img.pk.item{object-fit:contain;image-rendering:pixelated}\n'
 '.ball,.bigball{'+_bg('poke-ball-red')+';border:none!important;border-radius:50%!important;box-shadow:none!important}\n'
 '.ball:before,.ball:after,.bigball:after{display:none!important}\n'
 '.ball.R{'+_bg('great-ball')+'}.ball.E{'+_bg('ultra-ball')+'}.ball.L{'+_bg('master-ball')+'}\n'
 '.bigball{'+_bg('poke-ball-red')+';filter:drop-shadow(0 8px 12px rgba(0,0,0,.35))}.bigball:hover{filter:drop-shadow(0 8px 12px rgba(0,0,0,.35)) brightness(1.12)}\n'
 '.ball{filter:drop-shadow(0 4px 6px rgba(0,0,0,.3))}.ball.L.shake{filter:drop-shadow(0 0 16px #ffd15c)}',1)
