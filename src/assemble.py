import re, datetime
import os
W = os.path.dirname(os.path.abspath(__file__)) + '/'
L = open(W + 'orig.html', encoding='utf-8').read().split('\n')
rd = lambda f: open(W + f, encoding='utf-8').read().rstrip('\n')
seg = lambda a, b: L[a - 1:b]  # inclusive, 1-based

parts = []
parts += seg(1, 695)
parts += [rd('p_data.js')]
parts += seg(696, 903)
parts += [rd('p_moves.js').replace('__T2__', open(W + 'p_t2.json', encoding='utf-8').read()).replace('__STCH__', open(W + 'p_stch.json', encoding='utf-8').read()).replace('__BSTATS__', open(W + 'p_bstat.json', encoding='utf-8').read())]
parts += seg(933, 940)
parts += [rd('p_items.js').replace('__MT__', open(W + 'p_mt.json', encoding='utf-8').read())]
parts += seg(941, 1076)
parts += [rd('p_fx.js'), rd('p_fx2.js'), rd('p_battle.js')]
parts += seg(1487, 1513)
parts += [rd('p_bag.js'), rd('p_league.js')]
parts += seg(1740, 1854)
parts += [rd('p_trainer.js'), rd('p_pvp.js'), rd('p_social.js')]
parts += seg(2506, len(L))
H = '\n'.join(parts)

def rep(old, new, cnt=1):
    global H
    n = H.count(old)
    if n != cnt:
        raise SystemExit('REPLACE COUNT %d (want %d) for: %s' % (n, cnt, old[:120]))
    H = H.replace(old, new)

# ---------------------------------------------------------------- CSS
CSS_ADD = r'''
/* ---- barras de desplazamiento discretas ---- */
*{scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--mute) 35%,transparent) transparent}
::-webkit-scrollbar{width:8px;height:8px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--mute) 30%,transparent);border-radius:8px;border:2px solid transparent;background-clip:padding-box}
::-webkit-scrollbar-thumb:hover{background-color:color-mix(in srgb,var(--mute) 55%,transparent)}
#acct .sv{display:inline-flex;align-items:center;gap:5px;padding:6px 14px;font-size:.88rem;font-weight:800;letter-spacing:.2px;background:linear-gradient(135deg,#22c896,#13a37f);color:#fff;border:2px solid #fff;border-radius:999px;box-shadow:0 2px 0 #0b6e55,0 0 0 3px rgba(19,163,127,.25);cursor:pointer}
#acct .sv:hover:not(:disabled){filter:brightness(1.08)}#acct #aout{background:var(--line);color:var(--ink);box-shadow:none}#acct .sv:disabled{opacity:.75;cursor:default}
#acct.dirty .sv{animation:svp 1.6s ease-in-out infinite}@keyframes svp{50%{box-shadow:0 2px 0 #0b6e55,0 0 0 7px rgba(19,163,127,.38)}}
@media (prefers-reduced-motion:reduce){#acct.dirty .sv{animation:none}}
@media (min-width:601px){body:has(#acct:not([hidden])) header{padding-top:40px}}
/* ---- parte superior en móvil: barra fija con fondo, botones sin solaparse y fila del entrenador alineada ---- */
@media (max-width:600px){
body::before{content:"";position:fixed;left:0;right:0;top:0;height:calc(58px + env(safe-area-inset-top,0px));z-index:49;background:color-mix(in srgb,var(--bg) 82%,transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);pointer-events:none}
body.hubon::before{display:none}
#optb,#fsb,#chb{width:38px!important;height:38px!important;top:calc(10px + env(safe-area-inset-top,0px))!important}
#optb{right:8px!important}#fsb{right:52px!important}#chb{right:96px!important}
#acct{top:calc(9px + env(safe-area-inset-top,0px));padding:3px 4px 3px 4px;gap:6px;max-width:calc(100vw - 150px);box-sizing:border-box}
#acct #aname{display:none}
#acct .sv{padding:5px 11px;font-size:.82rem}
#acct #sync{font-size:.7rem;max-width:58px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#acct #aout{font-size:0;width:30px;height:30px;padding:0;border-radius:50%;display:grid;place-items:center;flex:none}
#acct #aout::before{content:"🚪";font-size:.95rem}
main>header{padding-top:52px}
body:has(#acct:not([hidden])) main>header h1{display:none}
main>header h1{padding-right:0!important}
main>header{gap:8px;justify-content:flex-start}
main>header #clSt:empty{display:none}
#hud{flex:none;gap:6px}
#hud .hudav{width:40px;height:40px}
#hud button{padding:5px 10px}
main>header .tk{flex:1 0 auto;display:flex;align-items:center;justify-content:center;gap:4px;font-size:1.05rem;padding:6px 14px}
}
@media (max-width:374px){#acct #sync{display:none}#hud button{padding:4px 8px;font-size:.85rem}}
/* ---- gacha: botones fijos ---- */
.stage{justify-content:flex-start}
.gbtn{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;width:100%}
.gbtn button{min-height:58px;padding:8px 6px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gbtn button small{display:block;font-weight:500;font-size:.8rem;opacity:.9}
@media (max-width:620px){.gbtn{grid-template-columns:repeat(2,minmax(0,1fr))}}
.gmeta{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:38px}
.gmeta .msg{margin:0}
.gmeta #skip{padding:6px 14px}
.gview{display:flex;flex-direction:column;align-items:center;gap:14px;min-height:130px;width:100%}
/* ---- combate: estados, movimientos, entrenadores y efectos ---- */
.stc{display:inline-block;margin-left:4px;padding:0 5px;border-radius:5px;color:#fff;font-size:.68em;font-weight:800;letter-spacing:.5px;vertical-align:middle}
.mvb{text-align:left;border-left:6px solid var(--tc,#999);background:linear-gradient(90deg,color-mix(in srgb,var(--tc,#999) 30%,var(--panel)),var(--panel));color:var(--ink);display:flex;flex-direction:column;gap:2px}
.mvb span{font-weight:700}.mvb small{font-weight:400;opacity:.85}
.mvb:disabled{opacity:.4}
.ef2{color:#2fbf5a}.ef5{color:#e05050}
.trs .tspr,.trs .trimg{display:block;width:calc(104px*var(--z,1));height:auto;image-rendering:pixelated;transform-origin:50% 100%;animation:tbreath 1.8s ease-in-out infinite;filter:drop-shadow(0 4px 4px rgba(0,0,0,.3))}
.trs .trimg{width:calc(80px*var(--z,1))}
.trs{right:calc(10% - 6px*var(--z,1));top:calc(10% - 40px*var(--z,1))}
@keyframes tbreath{50%{transform:scaleY(1.03) translateY(-1px)}}
.trs.t-throw .tspr,.trs.t-throw .trimg{animation:tthrow .7s ease-in-out}
@keyframes tthrow{0%{transform:none}35%{transform:rotate(-9deg) translateX(10px)}65%{transform:rotate(7deg) translateX(-12px) scale(1.04)}100%{transform:none}}
.trs.t-lose .tspr,.trs.t-lose .trimg{animation:tlose .9s ease-in-out;filter:grayscale(.35) drop-shadow(0 4px 4px rgba(0,0,0,.3))}
@keyframes tlose{15%,45%,75%{transform:translateX(-4px) rotate(-2deg)}30%,60%,90%{transform:translateX(4px) rotate(2deg)}100%{transform:translateY(4px)}}
.trs.t-win .tspr,.trs.t-win .trimg{animation:twin .45s ease-in-out 3}
@keyframes twin{50%{transform:translateY(-14px) scaleY(1.04)}}
.psp{position:absolute;left:calc(6% - 10px);bottom:-4px;z-index:4;opacity:0;pointer-events:none}
.psp .trimg{display:block;width:calc(172px*var(--z,1));image-rendering:pixelated;filter:drop-shadow(0 6px 6px rgba(0,0,0,.35))}
.psp{bottom:calc(-96px*var(--z,1))!important;left:calc(4% - 14px*var(--z,1))!important}
canvas.fxc{position:absolute;left:0;top:0;width:100%;height:100%;z-index:6;pointer-events:none}
canvas.ambc{position:absolute;left:0;top:0;width:100%;height:100%;z-index:1;pointer-events:none}
.fxmask{position:absolute;z-index:6;pointer-events:none;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
.spr[data-fit]:after{bottom:calc(var(--fb,0px) - 5px)}
.fxghost{position:absolute;pointer-events:none;z-index:5;image-rendering:pixelated;filter:brightness(1.4) saturate(.6)}
.pidle{animation:tbreath 1.8s ease-in-out infinite;transform-origin:50% 100%}
.fxl{position:absolute;inset:0;z-index:7;pointer-events:none;overflow:hidden}
.fxp{position:absolute;left:0;top:0;pointer-events:none;line-height:0;will-change:transform,opacity}
.fxp svg{display:block;overflow:visible}
.fxabs{transform:none!important}
.fxflash{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen}
.fxbeam{position:absolute;transform-origin:0 50%;border-radius:999px;pointer-events:none}
.fxwave{position:absolute;left:0;bottom:0;pointer-events:none;opacity:.92}
.spr{will-change:transform}
.spr.faint{opacity:0!important;translate:0 50px;transition:opacity .6s,translate .6s}
/* ---- evolucion ---- */
#evo{position:fixed;inset:0;z-index:110;background:rgba(5,6,18,.86);display:flex;align-items:center;justify-content:center;padding:16px}
#evo .jbox{text-align:center;background:radial-gradient(circle at 50% 40%,#2a2f6a,#0d1030);color:#fff;border-color:#9ad7ff;box-shadow:0 0 50px 10px rgba(120,190,255,.4)}
.evost{position:relative;height:200px;display:grid;place-items:center}
.evost>div{position:absolute;inset:0;display:grid;place-items:center;transition:opacity .08s}
.evost img,.evost svg{width:170px!important;height:170px!important;margin:0!important;image-rendering:pixelated}
#evo.done .evost{animation:evglow 1.2s ease-out}
@keyframes evglow{0%{filter:brightness(4)}100%{filter:none}}
#evoBtns{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
#evoBtns button{display:inline-flex;align-items:center;gap:6px}
/* ---- entrenador, amigos, gremios, apoyar ---- */
.trwrap{display:grid;grid-template-columns:minmax(220px,300px) minmax(0,1fr);gap:22px;margin-top:14px;align-items:start}
@media (max-width:760px){.trwrap{grid-template-columns:minmax(0,1fr)}}
#trPrev{display:flex;gap:10px;justify-content:center;align-items:flex-end;background:linear-gradient(#8fd0ff,#dff3ff 60%,#9ad260 61%,#6aa63e);border-radius:16px;border:1px solid var(--line);padding:14px 8px 8px;min-height:220px}
.trv{display:flex;flex-direction:column;align-items:center;gap:4px}
.trv span{font-size:.7rem;color:#1c1f3a;background:rgba(255,255,255,.7);border-radius:99px;padding:0 8px}
.trv img{width:140px;image-rendering:pixelated}
@media (min-width:761px){.trwrap>div:first-child{position:sticky;top:64px;align-self:start}}
#trOpts{display:block}
.trtabs{display:flex;flex-wrap:wrap;gap:6px;padding:6px;margin-bottom:16px;background:var(--bg);border:1px solid var(--line);border-radius:16px}
.trtabs button{flex:1 1 130px;padding:10px 14px;border-radius:12px;background:transparent;color:var(--ink);font-weight:700;box-shadow:none;border:none}
.trtabs button:hover{background:color-mix(in srgb,var(--teal) 14%,transparent)}
.trtabs button.on{background:var(--teal);color:#0d2a24;box-shadow:0 2px 8px color-mix(in srgb,var(--teal) 40%,transparent)}
.trgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;align-items:start}
.tro{background:var(--bg);border:1px solid var(--line);border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:12px}
.trh{display:flex;align-items:baseline;justify-content:space-between;gap:8px}.trh b{font-size:.95rem}
.trn{font-size:.75rem;color:var(--mute);background:var(--panel);border:1px solid var(--line);border-radius:99px;padding:1px 9px}
.trsel{display:flex;align-items:center;gap:10px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:6px}
.trsel b{flex:1;text-align:center;font-size:.92rem;font-weight:600}
.trsel button{width:38px;height:38px;padding:0;border-radius:10px;flex:none}
.trprs{display:block;margin-top:4px;color:#c99a1e;font-weight:600;font-size:.78rem}
.trcol{display:flex;flex-direction:column;gap:8px}.trcol small{color:var(--mute);font-size:.78rem;font-weight:600}
.trsw{display:flex;flex-wrap:wrap;gap:7px}
.trsw button{width:26px;height:26px;padding:0;border-radius:8px;border:2px solid color-mix(in srgb,var(--ink) 15%,transparent);box-shadow:none;transition:transform .1s}
.trsw button:hover{transform:scale(1.12)}
.trsw button.on{outline:3px solid var(--teal);outline-offset:2px;transform:scale(1.08)}
.trimg{image-rendering:pixelated}
.pvav{width:34px;height:34px;flex:none;display:grid;place-items:center;overflow:hidden;background:var(--panel);border-radius:8px;border:1px solid var(--line)}
.pvav{place-items:start center!important}.pvav img{width:44px;height:auto;margin-top:0}
.pvav.off{opacity:.5}
.frl{display:flex;flex-direction:column;gap:0;margin-top:8px}
.frinv{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
button.mini{padding:0 6px;font-size:.7rem}
.gtag{display:inline-block;font-size:.72rem;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:0 5px;font-weight:700;color:var(--ink);vertical-align:middle}
.gflag{flex:none;display:block}
.ghead{display:flex;gap:14px;align-items:center;background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:12px}
.ghead>div{display:flex;flex-direction:column;gap:2px}.gname{font-size:1.2rem}
.gedit{display:grid;grid-template-columns:minmax(180px,240px) minmax(0,1fr);gap:16px;background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:12px;margin-top:10px}
@media (max-width:700px){.gedit{grid-template-columns:minmax(0,1fr)}}
.gprev{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.gopts{display:flex;flex-direction:column;gap:8px}
.gopts label{display:flex;flex-direction:column;gap:3px;font-size:.85rem}
.gopts input:not([type=checkbox]),.gopts select{font:inherit;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink)}
.gopts label:has(input[type=checkbox]){flex-direction:row;align-items:center}
.gico{display:flex;flex-wrap:wrap;gap:4px}.gico button{padding:4px 6px;background:var(--panel);border:1px solid var(--line);font-size:1.1rem}.gico button.on{border-color:var(--teal);outline:2px solid var(--teal)}
.supb{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:700;background:var(--yel);color:#2a2200;border-radius:12px;padding:10px 18px;margin:4px 6px 4px 0}
.supnote{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:10px 0}
.dexn{position:absolute;top:2px;left:6px;font-size:.62rem;color:var(--mute)}
.shh{font-size:.95rem;margin:14px 0 4px}
.news small.ago{color:var(--mute);font-weight:400}
'''
rep('</style>\n<style>\n#auth', CSS_ADD + '</style>\n<style>\n#auth')
rep('#acct{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));left:8px;z-index:50;', '#acct{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));left:8px;z-index:50;white-space:nowrap;')

# ---------------------------------------------------------------- HTML
rep('<div id="acct" hidden><span id="aname"></span><span id="sync">☁️</span><button id="aout">Salir</button></div>',
    '<div id="acct" hidden><span id="aname"></span><button id="asave" class="sv" title="Guardar ahora en la nube">💾 Guardar</button><small id="sync">☁️</small><button id="aout" title="Cerrar sesión" aria-label="Salir">Salir</button></div>')
rep('<div id="updB" hidden role="status">', '<div id="evo" hidden role="dialog" aria-modal="true" aria-label="Evolución"><div class="jbox"><h2>🧬 Evolución</h2><div class="evost"><div id="evoA"></div><div id="evoB"></div></div><p id="evoT"></p><div id="evoBtns"></div></div></div>\n<div id="updB" hidden role="status">')
rep('<label><input type="checkbox" data-o="bgprod"> Seguir generando tickets con la pestaña oculta (con la ventana cerrada o fuera del enlace nunca se generan)</label>',
    '<label><input type="checkbox" data-o="bgprod"> Seguir generando tickets con la pestaña oculta (activado por defecto; con la ventana cerrada o fuera del enlace nunca se generan)</label>')
rep('<small id="clMsg" style="color:var(--mute)"></small>', '<button id="clCloud" hidden>💾 Guardar ahora en la nube</button><small id="clMsg" style="color:var(--mute)"></small>')
# gacha
rep('''  <div class="flash" id="flash"></div>
  <div class="ball" id="ball"></div>
  <div id="out" class="results"></div>
  <div class="actions">
    <button class="red" id="p1">Tirar ×1 (1 🎟️)</button>
    <button class="red" id="p10">Tirar ×10 (10 🎟️)</button>
    <button id="ps" style="background:linear-gradient(135deg,#f5a300,#e867c4);color:#1c1f3a">✨ Súper ×1 (100 🎟️)</button>
    <button id="ps10" style="background:linear-gradient(135deg,#f5a300,#e867c4);color:#1c1f3a">✨ Súper ×10 (1000 🎟️)</button>
  </div>
  <button id="skip" hidden style="background:var(--line);color:var(--ink)">Saltar animación ⏭</button>
  <p class="msg" id="msg"></p>''', '''  <div class="flash" id="flash"></div>
  <div class="gbtn">
    <button class="red" id="p1">Tirar ×1<small>1 🎟️</small></button>
    <button class="red" id="p10">Tirar ×10<small>10 🎟️</small></button>
    <button id="ps" style="background:linear-gradient(135deg,#f5a300,#e867c4);color:#1c1f3a">✨ Súper ×1<small>100 🎟️</small></button>
    <button id="ps10" style="background:linear-gradient(135deg,#f5a300,#e867c4);color:#1c1f3a">✨ Súper ×10<small>1000 🎟️</small></button>
  </div>
  <div class="gmeta"><button id="skip" hidden style="background:var(--line);color:var(--ink)">Saltar animación ⏭</button><p class="msg" id="msg"></p></div>
  <div class="gview"><div class="ball" id="ball"></div>
  <div id="out" class="results"></div></div>''')
# arena: estados y entrenador propio
rep('<div class="trs" id="tsp"></div>', '<div class="trs" id="tsp"></div><div class="psp" id="psp"></div>')
rep('<b id="on"></b> <small id="ol"></small><div class="hp">', '<b id="on"></b> <small id="ol"></small><span class="stc" id="ost" hidden></span><div class="hp">')
rep('<b id="on2"></b> <small id="ol2"></small><div class="hp">', '<b id="on2"></b> <small id="ol2"></small><span class="stc" id="ost2" hidden></span><div class="hp">')
rep('<b id="mn2"></b> <small id="ml2"></small><div class="hp">', '<b id="mn2"></b> <small id="ml2"></small><span class="stc" id="mst2" hidden></span><div class="hp">')
rep('<b id="mn"></b> <small id="ml"></small><div class="hp">', '<b id="mn"></b> <small id="ml"></small><span class="stc" id="mst" hidden></span><div class="hp">')
rep('<p class="rates">Forma un equipo de hasta 6 Pokémon y lucha por turnos contra uno salvaje. Puedes cambiar de Pokémon en tu turno. Cada victoria o captura da una recompensa de 100 a 100.000 🎟️ (y, con muchísima suerte, 33.550.336), experiencia y, a veces, objetos.</p>',
    '<p class="rates">Forma un equipo de hasta 6 Pokémon y lucha por turnos. Cada Pokémon usa los <b>movimientos originales</b> de la saga, que aprende al subir de nivel (con estados como parálisis, sueño, veneno o quemaduras y cambios de características). Al llegar a su nivel de evolución, ¡evolucionará! Cada victoria o captura da una recompensa de 100 a 100.000 🎟️ (y, con muchísima suerte, 33.550.336), experiencia y, a veces, objetos.</p>')
rep('<div class="bgrid" id="bgrid"></div>', '<div id="evoReady"></div><div class="bgrid" id="bgrid"></div>')
rep('Aquí ves los objetos que tienes. Pociones, revivir, objetos de PP y Caramelos Raros se pueden usar fuera de combate; las Pokéballs, durante el combate.',
    'Aquí ves los objetos que tienes. Pociones, revivir, objetos de PP, Caramelos Raros y objetos evolutivos (piedras, etc.) se usan fuera de combate; las Pokéballs, durante el combate.')
rep('Los objetos también caen al ganar combates. Aquí puedes comprarlos con tickets', 'Los objetos (también las piedras evolutivas y demás objetos de evolución) caen a veces al ganar combates. Aquí puedes comprarlos con tickets')
NEW_PANELS = '''<section class="panel" aria-label="Amigos" id="frP">
  <div class="hhead"><h2>👥 Amigos</h2><span class="hcost" id="frCnt">Amigos</span></div>
  <p class="rates">Envía solicitudes de amistad con el apodo de otro jugador. Verás cuándo están conectados y podrás retarles a un duelo o invitarles a tu sala 2 vs 2.</p>
  <div class="sets-row"><input id="frNick" maxlength="16" placeholder="Apodo de tu amigo" aria-label="Apodo de tu amigo" style="flex:1;min-width:180px;font:inherit;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--ink)"><button id="frGo">📨 Enviar solicitud</button></div>
  <small id="frMsg" class="mut"></small>
  <div id="frBox"></div>
</section>
<section class="panel" aria-label="Gremios" id="gdP">
  <div class="hhead"><h2>🛡️ Gremios</h2><span class="hcost">Fundar: 50.000.000 🎟️</span></div>
  <p class="rates">Únete a un gremio o funda el tuyo con su propio nombre, siglas, icono y bandera personalizada. Las siglas de tu gremio aparecen junto a tu apodo en el PVP. Máximo 30 miembros por gremio.</p>
  <div id="gdBox"></div>
</section>
<section class="panel" aria-label="Tu entrenador" id="trP">
  <div class="hhead"><h2>🧑 Tu entrenador</h2><button class="alt" id="trDemo" style="background:var(--line);color:var(--ink)">▶ Ver lanzamiento</button></div>
  <p class="rates">Personaliza a tu entrenador: aparece de espaldas en tus combates lanzando la Pokéball, y los demás jugadores lo ven de frente en el PVP.</p>
  <div class="trwrap"><div><div id="trPrev"></div><div class="sets-row" style="margin-top:8px;justify-content:center"><button id="trRnd">🎲 Aleatorio</button><button class="alt" id="trRst" style="background:var(--line);color:var(--ink)">Restablecer</button></div><div id="trSets"></div></div><div id="trOpts"></div></div>
</section>
<section class="panel" aria-label="Centro Pokémon" id="healP">'''
rep('<section class="panel" aria-label="Centro Pokémon" id="healP">', NEW_PANELS)
rep('''<section class="panel" aria-label="Sugerencias" id="sugP">''', '''<section class="panel" aria-label="Apoyar" id="supP">
  <h2>💝 Apoyar el juego</h2>
  <p class="rates">PokeGacha es gratis y lo seguirá siendo. Si te gusta y quieres, puedes hacer una donación voluntaria.</p>
  <div class="supnote">⚠️ <b>Donar no da ninguna ventaja dentro del juego</b>: ni tickets, ni Pokémon, ni objetos. Tu ayuda se destina solo a pagar los servidores (base de datos, cuentas y PVP online) y el dominio, para que todo el mundo pueda seguir jugando.</div>
  <p class="rates" style="margin:6px 0 0">🧒 Si eres menor de edad, pide permiso a tu padre, madre o tutor antes de donar.</p>
  <div id="supBox"></div>
  <p class="rates" style="margin-top:8px">¡Muchas gracias por jugar y por tu apoyo! 💖</p>
</section>
<section class="panel" aria-label="Sugerencias" id="sugP">''')
# bienvenida
rep('''    <li>🧭 Usa el botón de <b>accesos directos</b> (abajo a la derecha) para ir a cualquier parte sin hacer scroll, y ⚙️ (arriba a la derecha) para la música y las opciones.</li>''',
    '''    <li>🧬 <b>Evoluciones</b>: tus Pokémon evolucionan al llegar a su nivel o con objetos como la Piedra Fuego, la Piedra Lunar o el Cordón Unión (en la tienda y como botín).</li>
    <li>👥 <b>Amigos</b> y 🛡️ <b>Gremios</b>: añade amigos para retarles e invitarles a tus salas, o únete a un gremio.</li>
    <li>🧑 <b>Tu entrenador</b>: personaliza su cara, pelo, ropa y mochila. ¡Aparece en tus combates!</li>
    <li>🧭 Usa el botón de <b>accesos directos</b> (abajo a la derecha) para ir a cualquier parte sin hacer scroll, y ⚙️ (arriba a la derecha) para la música y las opciones.</li>''')
rep('<li>Si has iniciado sesión, tu progreso se guarda solo en la nube.', '<li>Si has iniciado sesión, tu progreso se guarda solo en la nube.') if False else None
rep('<p>Si has iniciado sesión, tu progreso se guarda solo en la nube. ¡Mucha suerte, entrenador!</p>', '<p>Si has iniciado sesión, tu progreso se guarda solo en la nube cada pocos minutos (y al pulsar «💾 Guardar» arriba). ¡Mucha suerte, entrenador!</p>')

# ---------------------------------------------------------------- JS: ajustes y gacha
rep('const OD={skip:1,bg:1,rain:1,flt:1,fists:1,intro:1,fx:1,pColl:1,pBat:1,pBag:1,pShop:1,pHeal:1,pPvp:1,bgprod:0,', 'const OD={skip:1,bg:1,rain:1,flt:1,fists:1,intro:1,fx:1,pColl:1,pBat:1,pBag:1,pShop:1,pHeal:1,pPvp:1,bgprod:1,')
rep('let O=Object.assign({},OD);try{Object.assign(O,JSON.parse(localStorage.getItem("gacha-opts")||"{}"))}catch(e){}',
    'let O=Object.assign({},OD);try{Object.assign(O,JSON.parse(localStorage.getItem("gacha-opts")||"{}"))}catch(e){}\nif(!O.m2){O.bgprod=1;O.m2=1;try{localStorage.setItem("gacha-opts",JSON.stringify(O))}catch(e){}}')
rep('$("p1").textContent="Tirar ×1 ("+fmt(cost(1))+" 🎟️)";$("p10").textContent="Tirar ×10 ("+fmt(cost(10))+" 🎟️)";$("ps").textContent="✨ Súper ×1 ("+fmt(cost(1,true))+" 🎟️)";$("ps10").textContent="✨ Súper ×10 ("+fmt(cost(10,true))+" 🎟️)";',
    'gBtn("p1","Tirar ×1",cost(1));gBtn("p10","Tirar ×10",cost(10));gBtn("ps","✨ Súper ×1",cost(1,true));gBtn("ps10","✨ Súper ×10",cost(10,true));')
rep('function render(){', 'function gBtn(id,t,c){const h=t+"<small>"+fmt(c)+" 🎟️</small>",e=$(id);if(e._h!==h){e._h=h;e.innerHTML=h}}\nfunction render(){')
rep('const got=P.filter(p=>S.owned[p[0]]).length;', 'const got=P.filter(p=>hasP(p[0])).length;')
rep('const dk=JSON.stringify(S.owned)+$("fr").value', 'const dk=JSON.stringify(S.owned)+JSON.stringify(S.reg||{})+$("fr").value')
rep('''$("dex").innerHTML=sortDex(P.filter(fok)).map(p=>{const c=S.owned[p[0]]||0;
    return `<div class="card ${p[2]} ${c?"":"lock"}" title="${c?p[0]+" · ×"+c+(S.when&&S.when[p[0]]?" · "+new Date(S.when[p[0]]).toLocaleDateString("es"):""):"Sin conseguir"}"><span class="cnt">${c?"×"+c:""}</span><div class="em">${c?ico(p,36):"❔"}</div><b>${c?p[0]:"???"}</b><small>${STAR[p[2]]}</small></div>`}).join("")''',
    '''$("dex").innerHTML=sortDex(P.filter(fok)).map(p=>{const c=S.owned[p[0]]||0,r=c||hasP(p[0]);
    return `<div class="card ${p[2]} ${r?"":"lock"}" title="${r?p[0]+" · ×"+c+(c?"":" (registrado: lo evolucionaste)")+(S.when&&S.when[p[0]]?" · "+new Date(S.when[p[0]]).toLocaleDateString("es"):""):"Sin conseguir"}"><span class="dexn">#${String(p[4]).padStart(4,"0")}</span><span class="cnt">${r?"×"+c:""}</span><div class="em">${r?ico(p,36):"❔"}</div><b>${r?p[0]:"???"}</b><small>${STAR[p[2]]}</small></div>`}).join("")''')
rep('const p=sup?rollS():roll(),isNew=!S.owned[p[0]];\n    if(isNew){S.balls[p[0]]=BALLR[p[2]];(S.when=S.when||{})[p[0]]=Date.now()}',
    'const p=sup?rollS():roll(),isNew=!hasP(p[0]);\n    if(!S.owned[p[0]]){S.balls[p[0]]=BALLR[p[2]];(S.when=S.when||{})[p[0]]=Date.now()}')
rep('return(!$("fg").value||p[3]===+$("fg").value)&&(!r||p[2]===r)&&(!t||p[1]===t)&&(s===""||(s==="1"?c>0:s==="0"?c===0:c>1))}',
    'return(!$("fg").value||p[3]===+$("fg").value)&&(!r||p[2]===r)&&(!t||tys(p).includes(t))&&(s===""||(s==="1"?hasP(p[0]):s==="0"?!hasP(p[0]):c>1))}')
rep('const keep={nick:S.nick,prs:prs,prsSeed:seed,welc:S.welc,newsV:S.newsV,pvd:S.pvd,pvp:S.pvp};', 'const keep={nick:S.nick,prs:prs,prsSeed:seed,welc:S.welc,newsV:S.newsV,pvd:S.pvd,pvp:S.pvp,tr:S.tr,gid:S.gid,sugSeen:S.sugSeen,trOwn:S.trOwn,card:S.card};')
# ayuda de tipos con el motor nuevo
rep('''if(typeof B!=="undefined"&&B&&B.op&&B.me)h+='<h5>Este combate</h5>'+row("Rival:",B.op[1])+row("Tu "+B.me[0]+":",B.me[1]);''',
    '''if(typeof B!=="undefined"&&B&&B.E){const sn=B.snap||beSnap(B.E),mi=B.me||0,mp=snapMon(sn,mi).p;h+='<h5>Este combate</h5>'+beFoes(B.E,mi).map(j=>row("Rival:",snapMon(sn,j).p[1])).join("")+row("Tu "+mp[0]+":",mp[1])}''')
# tienda de objetos con cabeceras
rep('''$("bag").innerHTML=ITEMS.map((it,i)=>'<div class="row">''', '''$("bag").innerHTML=ITEMS.map((it,i)=>(i===0?'<h3 class="shh">💊 Curación, Pokéballs y PP</h3>':it[7]==="evo"&&ITEMS[i-1][7]!=="evo"?'<h3 class="shh">🧬 Objetos evolutivos</h3>':'')+'<div class="row'+(it[7]==="mt"?' mtrow':'')+'">''')
# iconos de objetos evolutivos (sprites originales de PokeAPI)
rep('function itemIco(id,s){', 'function itemIco(id,s){\n  if(GD.EI[id])return \'<img class="pk" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/\'+id+\'.png" width="\'+s+\'" height="\'+s+\'" alt="" loading="lazy" onerror="this.outerHTML=\\\'<span style=&quot;font-size:\'+Math.round(s*.6)+\'px&quot;>💎</span>\\\'">\';')
# logros: registrados en la Pokedex cuentan; evoluciones
for a in ['P.filter(p=>S.owned[p[0]]).length', 'P.filter(p=>p[2]==="L"&&S.owned[p[0]]).length', 'P.filter(p=>p[2]==="E"&&S.owned[p[0]]).length', 'P.filter(p=>p[3]===g&&S.owned[p[0]]).length', 'P.filter(p=>p[1]===t&&S.owned[p[0]]).length']:
    n = H.count(a)
    if n == 0: raise SystemExit('missing ' + a)
    H = H.replace(a, a.replace('S.owned[p[0]]', 'hasP(p[0])'))
rep('["jp","🎉","¡Qué suerte!","Consigue el premio gordo ({g} vez)",()=>S.jp||0,[[1,5]],"x"]];',
    '["evo","🧬","Evolucionista","Evoluciona {g} Pokémon",()=>stt().evo||0,[[1,0],[10,1],[50,2],[200,3]]],\n["jp","🎉","¡Qué suerte!","Consigue el premio gordo ({g} vez)",()=>S.jp||0,[[1,5]],"x"]];')
rep('["new","🆕","Descubridor","Consigue {g} Pokémon nuevos",()=>stt().new||0,[20,80,250,500,800]],', '["new","🆕","Descubridor","Consigue {g} Pokémon nuevos",()=>stt().new||0,[20,80,250,500,800]],\n["evo","🧬","Evolucionista","Evoluciona {g} Pokémon",()=>stt().evo||0,[1,5,20,60,150]],')
rep("(a[6]===\"x\"?' <small>(extra)</small>':'')", "(a[6]===\"x\"?' <small title=\"No hace falta para el prestigio\">(extra · no cuenta para el prestigio)</small>':'')", 2)
rep('["m_daily","daily",1,"Reclama el regalo diario",{t:50000}]];', '["m_daily","daily",1,"Reclama el regalo diario",{t:50000}],\n["m_evo","evo",1,"Haz evolucionar a 1 Pokémon",{t:250000,it:{cand:1}}]];')
rep('<p class="rates">Cuando consigas <b>todos los logros</b>, podrás reiniciar', '<p class="rates">Cuando consigas <b>todos los logros</b> (los marcados como «extra», como ¡Qué suerte! o Rey del PVP, no hacen falta), podrás reiniciar')

# ---------------------------------------------------------------- novedades (desaparecen a la semana y muestran la hora)
s = H.index('// ================= novedades =================')
e = H.index('// si el juego se actualiza mientras lo tienes abierto')
now = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=1)))
NEWS = '''// ================= novedades =================
// Para publicar novedades: añade una entrada nueva AL PRINCIPIO de esta lista con un "v" distinto y la fecha y hora (at, hora de España).
// La hora es FIJA: solo se pone una nueva cuando se publica una actualización grande (no cambia con cada retoque).
// Cada jugador la verá en pantalla la próxima vez que entre. Las novedades desaparecen solas cuando pasa una semana.
// ===== VERSIÓN DEL JUEGO =====
// X.0 → actualización enorme (un modo o una experiencia nueva) · X.Y → novedades normales · X.Y.Z → arreglos pequeños (no se anuncian)
// Al publicar novedades, pon "ver" en la entrada y actualiza GAME_VER.
const GAME_VER="6.15.1";
const NEWS=[
{v:"2026-11-06d",ver:"6.15",at:"2026-11-06T12:54",t:"🧩 Dos minijuegos nuevos: Puzle de sprites y Más o menos",l:["🧩 Puzle de sprites: recompón la imagen de un Pokémon intercambiando piezas. Elige 9, 16, 25, 36, 49, 64 o 100 piezas: cuantas más, más puntos","Toca dos piezas o arrastra una encima de otra; las bien colocadas se quedan fijas en verde. Mantén pulsado «Ver la imagen» para mirar el Pokémon","📊 Más o menos: ¿el siguiente Pokémon tiene más o menos Ataque, Velocidad, PS…? Racha hasta el primer fallo (también con las flechas ↑ ↓)","Los dos dan premio, récord, pase de temporada y clasificación semanal, y entran en el Torneo semanal desde la semana que viene"]},
{v:"2026-11-06c",ver:"6.14",at:"2026-11-06T11:15",t:"🔴 Incursiones renovadas: combate en directo y más difícil",l:["Toca la pantalla (o Espacio) para el ataque rápido: cada golpe carga energía","Con la energía llena, lanza ataques cargados mucho más fuertes (botones o teclas 1 y 2)","El jefe brilla en amarillo antes de atacar: desliza o usa ⬅️ ➡️ / A y D para esquivar y recibir mucho menos daño","Sus ataques cargados pueden debilitar a tu Pokémon de un golpe. Si cae todo tu equipo, puedes volver a entrar, pero pierdes 10 segundos","Los PS del jefe dependen de la fuerza real de los equipos: siempre es un reto. En grupo es más fácil","Premios mejores: 650.000 🎟️ (+250.000 a quien más daño haga) y 3 Ultra Ball"]},
{v:"2026-11-06b",ver:"6.13",at:"2026-11-06T10:00",t:"🎯 Zona de entrenamiento y MT más claras",l:["Nueva Zona de entrenamiento (Actividades, o el botón junto a «¡Combatir!»): prueba a cualquiera de tus Pokémon contra el rival, el nivel y la habilidad que quieras","Modo Diana: no ataca, recupera sus PS cada turno y te dice el daño exacto de cada golpe. O un combate de práctica de verdad","No se gastan PS, PP ni objetos, y no da premios ni experiencia","Tienda de MT: botón «👀 ¿Quién puede aprenderla?» con tus Pokémon que la aprenden y los de su tipo que NO, antes de comprarla","Tienda de MT: elige uno de tus Pokémon para ver solo las MT que puede aprender"]},
{v:"2026-11-06a",ver:"6.12",at:"2026-11-06T09:01",t:"🌐 ¡El juego ya está en inglés! · Now in English!",l:["Nuevo ajuste de idioma: ⚙️ Ajustes → Accesibilidad → 🌐 Idioma (Español / English)","Los jugadores nuevos eligen su idioma nada más entrar, y en la pantalla de inicio hay un botón 🌐 para cambiarlo","En inglés se traducen menús, combates, objetos, movimientos y habilidades (con sus nombres oficiales), la historia de Exploración, los minijuegos y los mensajes","New language setting: ⚙️ Settings → Accessibility → 🌐 Language. Menus, battles, items, moves, abilities and the Exploration story are translated"]},
{v:"2026-11-05n",ver:"6.11",at:"2026-11-05T20:23",t:"📋 Ficha técnica en Exploración",l:["En el panel 🎒 de Exploración, toca cualquier Pokémon para ver su ficha completa","Verás su nivel, PS, experiencia, tipos, naturaleza, habilidad, objeto equipado, estadísticas con sus valores base y movimientos con potencia, precisión y PP","Desde la ficha puedes ponerle un mote, quitarle el objeto y meterlo o sacarlo del equipo","La mochila de Exploración también se ve ahora con tarjetas grandes y ordenada por tipo"]},
{v:"2026-11-05m",ver:"6.10",at:"2026-11-05T16:43",t:"🛍️ Tiendas de Exploración con mucho más surtido",l:["Las tiendas tienen ahora entre 11 y 51 productos: más balls, pociones, Revivir máximo, Éter y Elixires","Todas las piedras evolutivas y objetos de evolución: Escama Dragón, Revestimiento Metálico, Roca del Rey, Protector, Electrizador, Cordón Unión…","Más MT de ataque de muchos tipos y MT de estado como Protección, Danza Espada, Danza Dragón, Maquinación o Fuego Fatuo","Objetos equipables (Restos, Vidasfera, Banda Focus, Chaleco Asalto, Huevo Suerte, Bayas, Semillas…) y Mentas para cambiar la naturaleza","En la mochila 🎒 de Exploración ya puedes usar Mentas y equipar objetos a tus Pokémon","Cuanto más avanzas por las regiones, mejor surtido tienen las tiendas"]},
{v:"2026-11-05l",ver:"6.9",at:"2026-11-05T16:35",t:"🛒 Tiendas Pokémon en Exploración",l:["Cada pueblo tiene ahora su Tienda Pokémon (el edificio de tejado azul). Habla con el dependiente para comprar y vender","Cada tienda tiene su propio surtido, que mejora región a región: Poké Balls, pociones, Revivir, Éter y Elixires, piedras evolutivas, MT del tipo de la zona y objetos equipables","Al vender te dan la mitad de su precio. Se paga con tickets y lo comprado va a tu mochila de Exploración","Nuevo: en la mochila 🎒 de Exploración puedes usar pociones, Revivir, Éter, piedras evolutivas y MT fuera de los combates","La tecla Esc ya no te saca de la pantalla completa: ahora cierra la tienda, la mochila y los menús como el del Centro Pokémon"]},
{v:"2026-11-05k",ver:"6.8",at:"2026-11-05T16:11",t:"⭐ Experiencia como en los juegos",l:["La experiencia que gana cada Pokémon ahora depende de la diferencia de nivel con el rival, con la fórmula de los juegos","Un Pokémon de nivel bajo que derrota a uno más fuerte gana mucha más experiencia: un Nv 1 que vence a un Nv 5 gana casi el doble que un Nv 5","Si tu Pokémon es muy superior al rival, apenas gana experiencia","En los combates contra entrenadores se calcula con el nivel de cada Pokémon rival derrotado"]},
{v:"2026-11-05j",ver:"6.7",at:"2026-11-05T15:25",t:"🦊 La habilidad Ilusión ya funciona",l:["Zorua y Zoroark entran al combate disfrazados del último Pokémon sano de su equipo: se ven con su nombre, su aspecto y sus tipos, y hasta la eficacia de tus ataques te engaña","Por dentro siguen siendo ellos: usan sus propios movimientos, estadísticas y tipos","La ilusión se rompe en cuanto reciben daño directo de un ataque. El veneno, las quemaduras, Drenadoras o el clima no la rompen","Si se retiran y vuelven a salir, se disfrazan de nuevo"]},
{v:"2026-11-05i",ver:"6.6.2",at:"2026-11-05T14:26",t:"📢 ¡Estrenamos dirección: pokegachaonline.es!",l:["Poke Gacha Online ya tiene su propia dirección: pokegachaonline.es. ¡Guárdala en favoritos!","🔐 Si juegas con cuenta, entra e inicia sesión: tu progreso te espera","💾 Si jugabas sin cuenta, abre devildante98.github.io/rescate en el mismo navegador donde jugabas para llevarte tu partida","La dirección antigua te trae aquí automáticamente"]},
{v:"2026-11-05h",ver:"6.6",at:"2026-11-05T13:45",t:"🔥 Pase diario renovado",l:["Los premios del Pase diario mejoran cada semana: más Poké Balls, Super y Ultra Balls, Caramelos Raros, tickets extra, piedras evolutivas, Mentas, objetos equipables, Más PP y Revivir máximo","Los días 7, 14, 21 y 28 son especiales, y el día 28 ya trae una Master Ball","El día 30 hay un gran premio: Master Ball, 6 Caramelos Raros, un objeto equipable y un montón de tickets","Al completar los 30 días empieza una temporada nueva con premios más grandes, hasta la temporada 5. ¡No pierdas la racha!"]},
{v:"2026-11-05g",ver:"6.5",at:"2026-11-05T13:18",t:"📨 Avisos de solicitudes al momento",l:["Cuando alguien te reta a un duelo PVP, te invita a una sala 2 vs 2, te envía una solicitud de amistad o te invita por mensaje privado (duelo de siluetas, incursión o gremio), aparece una ventana para aceptar o rechazar al instante","Si eres líder o sublíder de un gremio, también te avisa cuando alguien pide unirse","Si estás en mitad de un combate, la ventana espera a que termine. Si la solicitud caduca o la cancelan, se cierra sola","«Más tarde» la deja pendiente en Social o en el chat para responder cuando quieras"]},
{v:"2026-11-05f",ver:"6.4",at:"2026-11-05T11:19",t:"🗺️ Minimapa y mapa de la región",l:["Exploración tiene minimapa: la zona en pequeño con tu posición, los entrenadores que te quedan por vencer, las salidas y lo que ves en pantalla. Tócalo para ampliarlo o ocúltalo con el botón 🧭 (tecla M)","Nuevo botón 🗺️ (tecla N): el mapa de las cuatro regiones con todos sus pueblos, rutas, cuevas y cimas, unidos por caminos y por las rutas en barco","Toca cualquier lugar del mapa para ver el nivel de sus Pokémon salvajes, cuántos entrenadores has vencido hoy y si tiene Centro Pokémon","Los lugares a los que aún no puedes ir aparecen como ??? hasta que avances en la historia"]},
{v:"2026-11-05e",ver:"6.3",at:"2026-11-05T10:30",t:"💬 Entrenadores con mucho más que decir",l:["Los entrenadores de Exploración tienen ahora casi 200 frases nuevas, distintas según su clase: jóvenes, cazabichos, nadadores, montañeros, karatekas, esquiadores, científicos, moteros…","Cada vez que entras en una zona, el entrenador te reta con una frase diferente","Al acabar el combate te dicen algo según hayan ganado o perdido","Si les vuelves a hablar después de vencerles, te cuentan curiosidades y consejos"]},
{v:"2026-11-05d",ver:"6.2",at:"2026-11-05T09:31",t:"🗺️ Exploración ahora es un modo aparte",l:["Exploración tiene su propia partida: su equipo, sus Pokémon, sus niveles y su mochila. Tu colección del juego no se toca","Empiezas con el Pokémon que eliges en el laboratorio de la Profesora Vega y formas tu equipo capturando Pokémon por las rutas","Los entrenadores de la historia usan sus equipos con niveles fijos, como en los juegos, y cada zona tiene sus niveles de Pokémon salvajes","Nuevo botón 🎒 en Exploración para ver tu equipo, tu caja y tu mochila","Los Centros Pokémon de Exploración curan gratis y venden Poké Balls y Pociones (con tickets). Mamá también cura gratis","Ya no hacen falta medallas del juego para avanzar: se avanza con la historia","Si ya ibas avanzado en la historia, recibes tu inicial y los legendarios que conseguiste al nivel de ese punto"]},
{v:"2026-11-05c",ver:"6.1",at:"2026-11-05T07:23",t:"🗺️ ¡Tres regiones nuevas en Exploración!",l:["La historia continúa: «La saga de las tres aves», con los Actos II, III y IV y un nuevo final con créditos","❄️ Región de Escarcha: Puerto Escarcha, Ruta 2 Helada, Pueblo Nevado, Caverna Glaciar y Pico Escarcha… ¡con Articuno!","🌋 Región de Brasa: Puerto Brasa, Ruta 3 Ceniza, Villa Volcán, el Cráter y la Cumbre Ígnea… ¡con Moltres!","⚡ Región de Tormenta: Ciudad Trueno, Ruta 4 Tempestad y la Torre Relámpago… ¡con Zapdos!","Un nuevo enemigo, el Equipo Tempestad del Doctor Ícaro, con las comandantes Gélida y Ascua. Dani, Bruma y Noctis vuelven a aparecer","Viaja entre regiones en el barco del marinero (muelle de la Playa Coral y de cada puerto)","Cada región tiene su clima (nevadas, ceniza y brasas, tormentas con rayos), Centro Pokémon en cada pueblo y nuevos entrenadores en las rutas","Si ya terminaste la historia de Alba, habla con la Profesora Vega para empezar el Acto II"]},
{v:"2026-11-05b",ver:"6.0",at:"2026-11-05T02:20",t:"📜 ¡Nueva historia en Exploración!",l:["«La leyenda de la Piedra Aurora»: una aventura completa por la región de Alba, con prólogo, cinco capítulos y epílogo con créditos","Empieza en tu casa de Pueblo Brisa: visita a la Profesora Vega, elige a Bulbasaur, Charmander o Squirtle y enfréntate a Dani, tu rival","Plántale cara al Equipo Ocaso y a sus jefes, Bruma y Noctis, por la Ruta 1, el Bosque Verde, la Cueva Roca y la Playa Coral","Nuevo mapa: la Cima Aurora (3 medallas), donde te espera el Pokémon legendario Latias… ¡que se unirá a ti!","Pueblo Brisa tiene tu casa, el laboratorio y un Centro Pokémon: mamá o la enfermera curan gratis a tu equipo una vez al día","Premios en cada capítulo (tickets, Caramelos Raros, Master Balls…) y, al terminar, Dani te reta a un combate cada día","Pulsa ▶ Iniciar en Aventura › Exploración para empezar"]},
{v:"2026-11-05a",ver:"5.1",at:"2026-11-05T01:49",t:"📊 ¡Estadísticas oficiales de cada Pokémon!",l:["Cada especie tiene ahora sus estadísticas base oficiales: PS, Ataque, Defensa, Ataque Especial, Defensa Especial y Velocidad","Snorlax y Blissey aguantan muchísimo, Shuckle tiene una defensa enorme, Jolteon y Alakazam son rapidísimos, Machamp pega fortísimo…","La Defensa y la Defensa Especial ya cuentan en el daño: los ataques físicos usan Ataque contra Defensa, y los especiales, Ataque Especial contra Defensa Especial","La Velocidad oficial decide quién ataca primero","Mira las seis estadísticas y su valor base en la ficha de cada Pokémon","Un Pokémon medio de cada rareza sigue rindiendo como antes, así que gimnasios, Liga e incursiones mantienen su dificultad"]},
{v:"2026-11-04x",ver:"5.0",at:"2026-11-04T21:45",t:"🎮 ¡Nuevo modo juego!",l:["La página ahora es una pantalla de juego: barra de recursos arriba, la Poké Ball en su pedestal en el centro y una barra de secciones abajo (Pokémon, Combate, Explorar, Gacha, Tienda, Social y Menú)","🏘️ Tu pueblo: cada mejora de la tienda es un edificio que crece con el nivel (campo de entrenadores, granja con Miltank, Centro Pokémon, Guardería, Liga, Estadio y Laboratorio), con Pokémon paseando y tickets saliendo de cada edificio","🌙 El paisaje cambia según la hora: amanecer, día, atardecer y noche con estrellas, ventanas y farolas encendidas","🥊 Los guantes de entrenador giran alrededor de la Poké Ball y, si tocas rápido, aparece tu combo","🎰 Gacha rediseñado: máquina más grande, tiradas normales y súper separadas y barra de Épico garantizado","⚔️ Combate rediseñado: tu equipo y el botón ¡Combatir! siempre a mano, y ataques con el color de su tipo","❓ Los textos largos se esconden tras el botón (?) de cada ventana","Si prefieres la página de antes, actívala en ⚙️ Ajustes › «Diseño clásico»"]},
{v:"2026-11-04w",ver:"4.3",at:"2026-11-04T18:19",t:"🌄 ¡Nueva portada!",l:["La pantalla de inicio estrena paisaje: montañas nevadas, bosque, lago y una pradera con nubes, pájaros y mariposas","Pokémon animados pasean por el camino (¡y a veces aparece alguno variocolor!)","Nuevo botón «▶ JUGAR»: las opciones para entrar se despliegan al pulsarlo, con Google primero","Si ya has jugado en ese navegador, la portada te saluda por tu apodo"]},
{v:"2026-11-04v",ver:"4.2.2",at:"2026-11-04T18:05",t:"🔧 Arreglos/Mejoras",l:["Nuevos objetos equipables: Hierba Blanca, Chaleco Asalto, Semilla Electro, Semilla Hierba, Semilla Bruma y Semilla Psique","Rayquaza megaevoluciona sin necesidad de tener a Mega-Rayquaza si conoce Ascenso Draco, como en los juegos","Las megaevoluciones de legendarios (Mewtwo X/Y, Latias, Latios, Rayquaza y Diancie) ya se pueden usar en combate","Exploración: si mantienes una dirección y pulsas otra, sigues en la primera hasta soltarla","Exploración: arreglado el bloqueo al pasar corriendo junto a un entrenador"]},
{v:"2026-11-04u",ver:"4.2.1",at:"2026-11-04T15:26",t:"⌨️ Controles de Exploración",l:["Nuevo botón «⌨️ Controles» en la portada de Exploración (y junto a pantalla completa) para cambiar las teclas: moverse, correr y hablar, con dos teclas por acción","Por defecto: flechas o WASD para moverte, Mayús o X para correr y Espacio o Intro para hablar, leer y recoger","Debajo del mapa se muestran siempre tus teclas","En ordenador ya no aparecen la cruceta ni los botones A/B; en el móvil siguen","Al caminar contra una Poké Ball la recoges y al caminar contra un cartel lo lees; aparece un aviso «A» cuando hay algo con lo que interactuar"]},
{v:"2026-11-04t",ver:"4.2",at:"2026-11-04T14:47",t:"🚶 Exploración mejorada",l:["Nueva portada de Exploración: pulsa «▶ Iniciar» para entrar","Botón de pantalla completa: el mapa ocupa toda la pantalla, con los controles por encima en el móvil","Tu entrenador ahora mira hacia donde camina (de frente, de espaldas y de perfil) con un sprite nuevo hecho con tu ropa, peinado y gorro","Animación de paso completa: piernas y brazos que se mueven, rebote al andar y pasos más rápidos al correr","Los entrenadores del mapa miran a su alrededor, respiran y dan algún paso por su zona; si se giran hacia ti, ¡te retarán!","El mapa cobra vida: árboles que se mecen, la hierba se agita al pisarla, polvo al correr, mariposas, hojas que caen, destellos en el mar y gotas en la cueva","Cámara más suave y signo ❗ con rebote al verte"]},
{v:"2026-11-04s",ver:"4.1",at:"2026-11-04T14:35",t:"🎨 Mapas con nuevo aspecto",l:["Los mapas de Exploración tienen un pixel art nuevo y mucho más detallado, al estilo de los juegos clásicos","Caminos con bordes de hierba, espuma en la orilla del mar, arena mojada, acantilados y paredes de cueva con relieve","Árboles frondosos que se solapan y te tapan al pasar por detrás, hierba alta clásica, flores, rocas, arbustos y estalagmitas","La luz cambia con la hora real: atardecer y noche, y las cuevas están en penumbra"]},
{v:"2026-11-04r",ver:"4.0",at:"2026-11-04T14:28",t:"🗺️ ¡Exploración por rutas!",l:["Nuevo en Aventura → Exploración: recorre las rutas con tu entrenador, como en los juegos de Pokémon","Cuatro zonas conectadas: Ruta 1 (Pradera), Bosque Verde, Playa Coral (2 medallas) y Cueva Roca (1 medalla)","En la hierba alta aparecen Pokémon salvajes del tipo de cada zona; en la cueva pueden salir en cualquier sitio","Los entrenadores te retan si te ven: aparece la ❗, se acercan y empieza el combate (se pueden volver a retar cada día)","Tu compañero (o el primero de tu equipo) te sigue por el mapa con sus animaciones","Carteles para leer y Poké Balls escondidas con objetos que se renuevan cada día","Muévete con las flechas o WASD (Mayús para correr) y usa Espacio para hablar; en el móvil hay cruceta y botones A/B"]},
{v:"2026-11-04q",ver:"3.17",at:"2026-11-04T14:18",t:"🔄 Intercambios en directo",l:["Si tu amigo está conectado, pulsa «🔄 Intercambiar» y le saltará una invitación al momento, esté donde esté del juego","Al aceptar, entráis los dos a una sala de intercambio: cada uno elige su Pokémon y ves en directo lo que te ofrece el otro","Cuando los dos confirmáis se hace el intercambio con su animación; si el otro cambia de Pokémon, hay que volver a confirmar","Si tu amigo está desconectado, puedes seguir dejándole una oferta como antes"]},
{v:"2026-11-04p",ver:"3.16",at:"2026-11-04T14:14",t:"🌦️ Clima en los combates",l:["El clima ahora se ve en el combate: lluvia, sol radiante, tormenta de arena, nieve y viento","Los campos también: chispas en el campo eléctrico, hojas en el de hierba, niebla rosa en el de niebla y ondas en el psíquico","Aparece justo cuando se anuncia (por un movimiento o una habilidad como Llovizna o Sequía) y desaparece cuando se acaba"]},
{v:"2026-11-04o",ver:"3.15",at:"2026-11-04T14:12",t:"🎰 ¡Nueva máquina de gacha!",l:["Las tiradas salen ahora de una máquina de gacha: se baja la palanca, las Poké Balls se mueven dentro de la cúpula y van cayendo una a una","Cada Poké Ball sale según la rareza del Pokémon: Poké Ball (común), Superball (raro), Ultraball (épico o forma especial) y Master Ball (legendario)","Las mejores tiemblan antes de abrirse, y un legendario hace que la pantalla tiemble con rayos dorados","Nuevas tiradas ×100, tanto normales como súper, con un resumen de lo que te ha tocado","La máquina se vuelve dorada en las tiradas súper"]},
{v:"2026-11-04n",ver:"3.14",at:"2026-11-04T13:42",t:"⚔️ Dos modos de PVP",l:["El PVP online tiene ahora dos modos: ⚔️ Clásico (sin megas, Dinamax ni movimientos Z) y 🧬 Libre (con todo)","Elige tu modo arriba en PVP online; solo puedes retar a jugadores que estén en tu mismo modo, y en la lista se ve el modo de cada uno","En el modo Libre puedes megaevolucionar, dinamaxizar o gigamaxizar a un Pokémon una vez por combate (si tienes esa forma en tu colección) y usar un movimiento Z por combate si lleva su cristal","Pulsa Megaevolucionar o Dinamax y después elige el ataque: se transforma justo antes de atacar"]},
{v:"2026-11-04k",ver:"3.13.2",at:"2026-11-04T13:25",t:"🔧 Arreglos/Mejoras",l:["La ficha de los Pokémon es ahora más ancha: en pantallas grandes la imagen queda a la izquierda y toda la información a la derecha, así no hay que desplazarse tanto","Las preguntas y avisos del juego (comprar en la Tienda de Evento, rendirse, borrar, renombrar un set, gremios…) ahora salen en ventanas propias del juego en lugar de las del navegador"]},
{v:"2026-11-04j",ver:"3.13.1",at:"2026-11-04T13:15",t:"🚶 Tu compañero camina de verdad",l:["Tu compañero ahora usa animaciones reales fotograma a fotograma: mueve las patas al caminar, respira cuando está quieto, duerme acurrucado y salta","Gira y mira en la dirección en la que camina, y de lado a lado cuando mira a su alrededor","Disponible para casi todos los Pokémon, incluidas muchas megaevoluciones y formas regionales; si alguno no tiene animación, se usa su imagen de siempre","Animaciones de la comunidad PMDCollab (SpriteCollab)"]},
{v:"2026-11-04i",ver:"3.13",at:"2026-11-04T13:08",t:"🤝 Compañero más vivo",l:["Tu compañero ya no camina hacia atrás: siempre mira hacia donde va","Ahora pasea a su aire: anda a sitios al azar, se para, mira a los lados, da saltitos y a veces se echa una siesta 💤","Al andar se balancea con cada paso, respira cuando está quieto y su sombra se encoge cuando salta","Si lo tocas, da un par de saltos de alegría (y se despierta si estaba dormido)","El prado tiene nubes que se mueven, hierba y flores"]},
{v:"2026-11-04g",ver:"3.12",at:"2026-11-04T13:02",t:"🔁 Sets de Pokémon",l:["Cada Pokémon puede tener hasta 4 sets: cada uno guarda su naturaleza, objeto, habilidad y movimientos","Se gestionan desde la ficha del Pokémon: crea un set nuevo, cámbialo con «Usar», ponle nombre o elimínalo","Un set nuevo empieza con los movimientos básicos de su nivel; los demás tendrás que enseñárselos con MT o el recordador","Al guardar un equipo, se recuerda qué set lleva cada Pokémon y al cargarlo se ponen solos","Al evolucionar un Pokémon que ya tenías, ahora también puedes quedarte con los dos: el recién evolucionado se guarda como un set nuevo","Los sets pasan a la evolución cuando evolucionas un Pokémon"]},
{v:"2026-11-04f",ver:"3.11",at:"2026-11-04T12:47",t:"👕 ¡Nueva ropa para tu entrenador!",l:["43 prendas y cosméticos nuevos en la personalización del entrenador","Gorros: Pamela, Diadema con lazo, Tiara, Gorra plana, Gorra Poké Ball, Orejas de conejo, Sombrero fedora, Gorro de chef y Orejas de oso","Ropa: Blusa con volantes, Vestido de verano, Camisa hawaiana, Chaqueta de cuero, Vestido de gala, Uniforme escolar, Chaqueta vaquera, Minifalda, Falda de volantes, Pantalón cargo y Shorts vaqueros","Calzado: Tacones, Bailarinas, Mocasines y Botas militares","Peinados: Ondulado con flequillo, Raya al lado y Melena ondulada corta","Accesorios: gafas de pasta y de estrella, gargantilla, collar de perlas, pajarita, medallón, guantes largos, pendientes de perlas, aro en una oreja, maletín, pulsera de perlas, lazo grande, pasadores, barba larga, colorete y delineado","Cada prenda indica si es ♂ de chico, ♀ de chica o ⚥ unisex, y puedes filtrar el panel para ver solo las de chico o las de chica","El botón Aleatorio ahora elige prendas acordes al cuerpo del entrenador"]},
{v:"2026-11-04e",ver:"3.10.5",at:"2026-11-04T11:54",t:"🔧 Arreglos/Mejoras",l:["La ayuda de tipos (❓) del combate ahora tiene en cuenta los dos tipos de cada Pokémon: muestra ×4, ×2, ×½, ×¼ y las inmunidades (×0)","Antes solo miraba el primer tipo, por eso podía decir «Débil a Tierra» a un Pokémon Fuego/Volador al que la Tierra no le afecta","Los botones de ataque muestran «No afecta» cuando el rival es inmune, incluidas habilidades como Levitación, Absorbe Agua o Absorbe Fuego, y tienen en cuenta las habilidades que cambian el tipo de tus ataques"]},
{v:"2026-11-04c",ver:"3.10.4",at:"2026-11-04T10:50",t:"🔧 Arreglos/Mejoras",l:["Ataque Especial y Defensa Especial ahora son características separadas del Ataque y la Defensa, como en la saga","Los movimientos especiales usan el Ataque Especial del atacante y la Defensa Especial del rival; los físicos, el Ataque y la Defensa","Movimientos como Paz Mental, Maquinación, Psíquico o Bola Sombra suben o bajan ahora la característica especial correcta","Naturalezas oficiales: Modesta, Firme, Serena, Cauta, etc. afectan ahora al Ataque Especial o a la Defensa Especial","Hay nuevas Mentas para las naturalezas especiales y la ficha del Pokémon muestra las 5 características","Habilidades como Tenacidad, Relincho Negro o Medicina Extraña también tienen en cuenta las características especiales"]},
{v:"2026-11-04b",ver:"3.10.3",at:"2026-11-04T10:18",t:"🔧 Arreglos/Mejoras",l:[
"💎 Movimientos Z exclusivos: Hiperplancha Oscura de Incineroar (con Lariat Oscuro), Pikavoltio Letal de Pikachu, Somanta Amistosa de Mimikyu, Estruendo Implacable de Kommo-o y muchos más. Consigue su cristal en Aventura → Dominantes.",
"🌿 Nuevas Mentas en la tienda: cambian la naturaleza de un Pokémon, como en los juegos.",
"🔧 Corregido el nivel de los Guantes de entrenador de las partidas afectadas por un fallo."]},
{v:"2026-11-04a",ver:"3.10.2",at:"2026-11-04T08:13",t:"🔧 Arreglos/Mejoras",l:[
"🛒 Tienda de mejoras: compra ×1, ×10, ×50 o el máximo que puedas pagar. Los Guantes de entrenador tienen nivel máximo 30.",
"💬 Chat: responde a un mensaje (↩️) y menciona a otros jugadores con @apodo, también en los privados. Te avisaremos cuando te mencionen.",
"✨ Gigamax: cada forma Gigamax tiene su ataque G-Max con un efecto especial (Gigallamarada, Gigatronada…). Eternatus Dinamax Infinito tiene su propia habilidad.",
"⚔️ Movimientos como en los juegos: Ida y Vuelta, Voltiocambio, Viraje y Última Palabra cambian de Pokémon; Sorpresa solo funciona en el primer turno; Golpe Bajo falla si el rival no ataca; Falso Tortazo nunca debilita.",
"🔢 Tabla de tipos oficial con inmunidades (Normal/Lucha no afectan a Fantasma, Tierra no afecta a Volador, Eléctrico no afecta a Tierra…).",
"🏆 Clasificación: los empates comparten puesto y «Tu posición» coincide con la lista.",
"🧬 Evoluciones: si ya tenías esa especie, eliges con cuál te quedas. La naturaleza, el objeto y el mote pasan a la evolución.",
"💿 Tienda de MT con todas las MT de la saga (240), como Falso Tortazo.",
"🧠 Recordador de movimientos y movimientos huevo, desde la ficha de cada Pokémon.",
"🏅 Gimnasios: los Líderes cambian de región con cada prestigio (Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos) y sus Pokémon tienen la evolución que corresponde a su nivel.",
"💪 Combates contra entrenadores más difíciles, como en los juegos: eligen mejor sus ataques, usan Hiperpociones y sus Pokémon están mejor entrenados.",
"💎 Nuevo: movimientos Z con cristales Z y Pokémon dominantes con aura (Aventura → Dominantes). ¡De regalo, un Normastal Z!",
"🏛️ El Salón de la Fama, las evoluciones y los premios ya se ven al terminar un combate en modo ventana o pantalla completa.",
"🦴 Excavación y Cazafósiles: la cuadrícula ya no se agranda ni deja tesoros fuera de la pantalla.",
"🎯 Minijuegos: las misiones y el pase de temporada solo cuentan partidas jugadas de verdad.",
"💡 Sugerencias: el estado de cada sugerencia se actualiza al momento."]},
{v:"2026-10-31e",ver:"3.10.1",at:"2026-10-31T15:16",t:"⚖️ Ajustes de equilibrio y mejoras",l:[
"⚖️ Las recompensas de los logros son más bajas para que el progreso tenga más mérito.",
"📈 Los Caramelos Raros enseñan al momento los movimientos nuevos (si ya conoce 4, eliges cuál olvidar).",
"❤️ Las casillas del equipo muestran la barra de vida de cada Pokémon.",
"🎒 Al usar un objeto de la Mochila, eliges el Pokémon en una ventana."]},
{v:"2026-10-31d",ver:"3.10",at:"2026-10-31T09:17",t:"✨ Todas las habilidades funcionan",l:[
"✨ Las 306 habilidades de los Pokémon tienen ya efecto en combate: Llovizna, Sequía, Chorro Arena, Nevada, Nado Rápido, Clorofila, Pararrayos, Disfraz, Gas Reactivo, Rompemoldes, Bromista, Ausente… Míralas en la ficha de cada Pokémon.",
"🌦️ Nuevo tiempo atmosférico en combate: lluvia, sol, tormenta de arena y nieve, que potencian o debilitan ataques y pueden dañar cada turno.",
"🌱 Nuevos campos: eléctrico, psíquico, de niebla y de hierba.",
"🏃 Algunos Pokémon salvajes (Sombra Trampa, Trampa Arena, Imán) no te dejarán huir. Con Fuga siempre podrás escapar.",
"🎁 Recogida, Recogemiel y Recogebolas pueden encontrar objetos al ganar combates.",
"🔎 Barra de búsqueda en la Mochila."]},
{v:"2026-10-31c",ver:"3.9",at:"2026-10-31T03:10",t:"🏳️ Rendirse, partidas con firma y elegir apodo",l:[
"🏳️ Ya puedes rendirte en los combates contra entrenadores (cuenta como derrota).",
"💾 Las partidas exportadas ahora llevan firma: los archivos exportados antes de hoy ya no se pueden importar, así que exporta tu partida de nuevo si quieres una copia.",
"✏️ Los jugadores nuevos eligen su apodo nada más empezar (se puede cambiar cuando quieras en Online → PVP)."]},
{v:"2026-10-31b",ver:"3.8",at:"2026-10-31T02:00",t:"📈 Movimientos al subir de nivel",l:[
"📈 Los Pokémon nuevos empiezan con 2 movimientos y aprenden más al subir de nivel, como en los juegos: al llegar a 4, te preguntan cuál olvidar.",
"🗒️ La ficha de cada Pokémon muestra qué movimiento aprenderá a continuación y a qué nivel.",
"⚔️ Los Pokémon que ya tenías conservan sus movimientos."]},
{v:"2026-10-31a",ver:"3.7",at:"2026-10-31T01:20",t:"⚔️ Movimientos en la ficha",l:[
"⚔️ La ficha de cada Pokémon (tócalo en la Pokédex) muestra ahora sus 4 movimientos: tipo, clase, poder, precisión, PP que le quedan y efectos.",
"🔒 Nueva Política de privacidad en Ajustes → Acerca de y al pie del juego."]},
{v:"2026-10-30h",ver:"3.6",at:"2026-10-30T21:05",t:"💿 Tienda de MT",l:[
"💿 Nueva Tienda de MT (Mochila): 79 MT para enseñar movimientos como Terremoto, Rayo Hielo, Bola Sombra o Danza Dragón.",
"🎒 Se usan fuera de combate desde la Mochila: eliges el Pokémon y qué movimiento olvida.",
"✅ Cada Pokémon solo aprende las MT que aprende en los juegos originales."]},
{v:"2026-10-30g",ver:"3.5.1",at:"2026-10-30T20:50",t:"🏷️ Títulos en la Tienda de Evento",l:[
"🏷️ 30 títulos nuevos para tu vitrina y tu perfil en la Tienda de Evento: 12 de catálogo todo el año y otros propios de cada temporada.",
"🎃 Títulos de Halloween solo hasta el 2 de noviembre: Rey de las calabazas, Alma en pena, Señor de la noche y Tejedor de sustos."]},
{v:"2026-10-30f",ver:"3.5",at:"2026-10-30T20:25",t:"⚔️ Pokémon de doble tipo",l:[
"🔥🌪️ Los Pokémon ahora tienen sus dos tipos, como en los juegos: Charizard es Fuego / Volador, Gyarados Agua / Volador, Garchomp Dragón / Tierra…",
"💥 La eficacia se multiplica por los dos tipos: hay ataques ×4 y ×¼. ¡Monta un equipo más equilibrado!",
"✨ Los ataques del mismo tipo que cualquiera de los dos tipos de tu Pokémon hacen más daño (STAB).",
"🔎 Los filtros por tipo de la Pokédex y del equipo encuentran también por el segundo tipo."]},
{v:"2026-10-30e",ver:"3.4",at:"2026-10-30T19:15",t:"🛍️ Tienda de Evento: ropa, fondos y marcos de Halloween",l:[
"🛍️ Nueva Tienda de Evento (Tu entrenador): gasta tus tickets en ropa para tu entrenador y en fondos y marcos animados para tu tarjeta de perfil.",
"🖼️ Personaliza tu tarjeta de entrenador: los demás jugadores la ven al abrir tu perfil.",
"🎃 Ropa de Halloween solo hasta el 2 de noviembre: Gorro de calabaza y Pajarita de murciélago. Cada evento de temporada traerá su propia prenda.",
"⌚ Catálogo todo el año: Pokéreloj, Gafas de corazón, Monóculo dorado y Mochila Poké Ball.",
"🔊 Cada Pokémon del gacha suena al salir de la Poké Ball, ¡y los legendarios tienen fanfarria!"]},
{v:"2026-10-30d",ver:"3.3",at:"2026-10-30T17:00",t:"Cazafósiles, ropa de prestigio y sugerencias con respuesta",l:[
"🦴 Nuevo minijuego Cazafósiles: desentierra fósiles y revívelos en el 🧪 Laboratorio de fósiles (Minijuegos). ¡Omanyte, Kabuto, Aerodactyl, Tyrunt, Dracozolt y muchos más!",
"⛏️ La Excavación subterránea ahora es de 12×12, y sus fósiles también se pueden revivir.",
"🌟 Ropa exclusiva de prestigio para tu entrenador: gorros, coronas, halo y medallas que se desbloquean al subir de prestigio.",
"📨 Nueva pestaña «Mis sugerencias» (Más): mira el estado de tus sugerencias, lee las respuestas del desarrollador y cancela las que aún no estén completadas.",
"⚙️ Los Ajustes tienen un diseño nuevo."]},
{v:"2026-10-30c",ver:"3.2",at:"2026-10-30T13:45",t:"Combates dobles, habilidades, calendario y app instalable",l:[
"⚔️⚔️ Combate doble contra la máquina: tú y un compañero contra dos entrenadores (botón junto a «¡Combatir!»).",
"✨ Habilidades: Intimidación, Levitación, Absorbe Agua, Mar Llamas, Robustez y muchas más funcionan en combate. Elige la de cada Pokémon en su ficha.",
"📅 Calendario de eventos (Actividades → Calendario): horas felices, jefes de incursión, torneo y más de los próximos 7 días.",
"🖼️ Vitrina y estadísticas (Tu entrenador): elige 3 Pokémon y un título para tu perfil y mira todas tus estadísticas.",
"📲 Instala el juego como app y activa las notificaciones (⚙️ Ajustes → Cuenta).",
"🚩 Reporta mensajes del chat que no sean respetuosos.",
"🧭 Tutorial guiado para los nuevos entrenadores."]},
{v:"2026-10-30b",ver:"3.1",at:"2026-10-30T09:45",t:"Formas supremas y Cristales Supremos",l:[
"💠 Los Pokémon más poderosos (Mega-Rayquaza, Mega-Mewtwo X/Y, Ultra-Necrozma, Kyogre y Groudon Primigenios, Eternatus Dinamax Infinito, Zacian y Zamazenta supremos, Kyurem Negro/Blanco, Calyrex jinete y más) ahora funcionan como en los juegos: llevas a su forma base al combate y lo transformas gastando un Cristal Supremo.",
"🎁 Si ya tenías alguna forma suprema, la conservas y has recibido 3 Cristales Supremos por cada una (y su forma base si no la tenías).",
"📊 Clasificación semanal de cada minijuego (Minijuegos → Clasificación): los 10 mejores de cada uno reciben premio cada lunes.",
"🧩 Elige tu equipo con casillas visuales, añade Pokémon al equipo desde su ficha y ordena la Pokédex alfabéticamente.",
"🏟️ Dos mejoras nuevas en la tienda: Estadio Pokémon y Laboratorio del Profesor.",
"💎 Consigue Cristales Supremos en la Torre Batalla, las incursiones, el Torneo semanal, el pase de temporada o la tienda. Las formas supremas ya no salen en las tiradas: se ganan en incursiones, el torneo y el pase."]},
{v:"2026-10-30a",ver:"3.0",at:"2026-10-30T01:30",t:"Gran actualización: Megaevolución, incursiones, pase de temporada y mucho más",l:[
"🧬 Megaevolución, Gigamax y Dinamax en combate: si tienes la forma Mega o Gigamax de tu Pokémon, puedes transformarlo una vez por combate.",
"🔴 Incursiones en directo: hasta 4 entrenadores contra un jefe gigante con PS compartidos. ¡Si lo derrotáis, podéis capturarlo! (Online → Incursiones)",
"🎫 Pase de temporada: 30 niveles cada mes con premios en cada nivel y un legendario en el último. (Progreso → Pase de temporada)",
"🌙 Día y noche reales: el juego cambia con la hora y algunos Pokémon solo salen de noche.",
"🎉 Horas felices todos los días a las 13:00 y 20:00, y Día de la Comunidad los sábados de 16:00 a 19:00.",
"🤝 Pokémon compañero: te acompaña en la pantalla principal, encuentra regalos, lucha a tu lado y puede evolucionar por amistad.",
"📔 Álbum de pegatinas: normales, brillantes y holográficas. ¡Completa páginas para ganar premios!",
"🛒 Mercadillo: compra y vende Pokémon y objetos con otros jugadores.",
"📨 Invita a tus amigos con tu código y ganad premios los dos."]},
{v:"2026-10-29c",ver:"2.1",at:"2026-10-29T22:50",t:"Gran actualización: actividades, naturalezas, objetos y regalos",l:[
"🎪 Nuevo menú «Actividades» con cuatro novedades: Guardería, Zona Safari, Torre Batalla y Expediciones.",
"🥚 Guardería: deja dos Pokémon compatibles y consigue huevos. Eclosionan tras unos combates y tienen más probabilidad de ser variocolor.",
"🌾 Zona Safari: una salida gratis al día con 20 Safari Balls para atrapar Pokémon raros usando cebo y rocas.",
"🗼 Torre Batalla: combates seguidos cada vez más difíciles, récord personal y una tienda con Puntos Torre.",
"🧭 Expediciones: manda a los Pokémon que no usas a explorar y vuelven con tickets, objetos y experiencia.",
"🌿 Naturalezas: cada Pokémon tiene una que sube una estadística y baja otra. Tus repetidos traen naturalezas nuevas que puedes elegir.",
"🎒 Objetos para equipar: Restos, Vidasfera, Banda Focus, Baya Zidra, Garra Rápida, Huevo Suerte y más.",
"📋 Toca un Pokémon de tu Pokédex para ver su ficha: ponle un mote, márcalo como favorito y elige su naturaleza y su objeto.",
"🏛️ Salón de la Fama: tu equipo campeón queda registrado al ganar una Liga y se ve en tu perfil.",
"🎁 Regalos entre amigos: envía un regalo diario a cada amigo desde la lista de amigos.",
"💬 Chat dentro del juego: global, de gremio y privado con tus amigos (botón 💬 arriba o en Social → Chat).",
"🎮 Minijuegos: ¿Quién es ese Pokémon?, Memoria, ¡Golpea al Diglett!, Pesca y Lanzamiento perfecto. ¡Ganas premios en tus 3 primeras partidas de cada uno al día!",
"🔥 Más minijuegos: Carrera de Rapidash, Excavación subterránea y ¿Quién pesa más?",
"⚔️ Duelo de siluetas en directo: reta a un amigo y gana quien adivine antes.",
"🏆 Torneo semanal de récords: cada semana un minijuego distinto. ¡El 1º gana un Pokémon LEGENDARIO, el 2º una forma especial y el 3º un variocolor, además de millones de tickets, Master Balls y un título en el chat! Premios también para el top 10 y por participar."]},
{v:"2026-10-29b",ver:"2.0",at:"2026-10-29T20:25",t:"Gran actualización: evoluciones, movimientos originales, amigos y gremios",l:[
"🧬 Sistema de evoluciones como en los juegos: por nivel o con objetos (Piedra Fuego, Agua, Trueno, Hoja, Lunar, Solar, Alba, Noche, Día, Hielo, Cordón Unión, Cascabel Alivio...). Los objetos están en la tienda y caen en combates.",
"🎞️ Los Pokémon ahora tienen sprites originales ANIMADOS de la saga, de frente y de espaldas en combate (con reserva automática si alguno no carga).",
"⚔️ Todos los Pokémon usan sus movimientos originales y los aprenden al subir de nivel. Hay estados (parálisis, sueño, veneno, quemaduras, congelación, confusión), cambios de características, golpes críticos y prioridad.",
"✨ Efectos de los ataques mucho mejores, distintos para cada tipo y movimiento.",
"🧑 Entrenadores rivales con sus sprites originales y animados. ¡Y personaliza a tu propio entrenador en «Tu entrenador»!",
"👥 Amigos: envía solicitudes, mira quién está conectado, rétales o invítales a tus salas 2 vs 2.",
"🛡️ Gremios con nombre, siglas, icono y bandera personalizados.",
"📚 La Pokédex está ordenada por número y se han corregido las rarezas: una preevolución ya nunca es más rara que su evolución.",
"🎰 Los botones de tirada ya no se mueven: puedes tirar muchas veces seguidas sin mover el ratón.",
"🧭 Barras de desplazamiento más discretas y nuevo apartado 💝 Apoyar (también en los accesos directos).",
"☁️ El guardado en la nube es más eficiente: se guarda solo cada pocos minutos, al cerrar y con el botón 💾.",
"🏅 El logro «¡Qué suerte!» y «Rey del PVP» son extra: no hacen falta para el prestigio.",
"🎟️ La generación de tickets con la pestaña oculta viene activada por defecto."]},
{v:"2026-10-29a",ver:"1.1",at:"2026-10-29T10:00",t:"Nueva banda sonora",l:[
"🎵 10 canciones nuevas compuestas para el juego al estilo de la Game Boy. Elígelas en ⚙️ → Música."]},
{v:"2026-10-28b",ver:"1.0",at:"2026-10-28T20:00",t:"Actualización: 2vs2, prestigio y PP",l:[
"👥 Salas PVP con código para combates 2 vs 2.","🌟 Nuevo sistema de Prestigio.","🔋 Los movimientos tienen PP, con Éter, Elixir, Más PP y PP máximos en la tienda."]}];
const NEWS_TTL=7*864e5,newsAt=n=>new Date(n.at).getTime()||0,newsLive=()=>NEWS.filter(n=>Date.now()-newsAt(n)<NEWS_TTL);
const newsWhen=n=>{const d=new Date(newsAt(n));return d.toLocaleDateString("es",{day:"2-digit",month:"2-digit",year:"numeric"})+" · "+d.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})};
const newsHTML=L=>L.length?L.map(n=>'<div class="news"><b>'+(n.ver?'<i class="nver">Versión '+esc(n.ver)+'</i> ':'')+esc(newsWhen(n))+' · '+esc(n.t)+'</b><ul>'+n.l.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>').join(""):'<p class="rates">No hay novedades de los últimos 7 días.</p>';
const GAME_V=NEWS[0].v;
function newsShow(all){
  const live=newsLive(),i=all?live.length:live.findIndex(n=>n.v===S.newsV),L=all?live:live.slice(0,i<0?live.length:i);
  if(!L.length&&!all){S.newsV=GAME_V;save();return}
  $("newsMl").innerHTML=newsHTML(L);
  $("newsM").hidden=false;$("newsM").querySelector(".jbox").scrollTop=0;try{$("newsOk").focus({preventScroll:true})}catch(e){}
}
$("newsOk").onclick=()=>{$("newsM").hidden=true;S.newsV=GAME_V;save()};
function newsInit(){if(S.newsV!==GAME_V&&$("welc").hidden)newsShow(false);else if($("welc").hidden===false){S.newsV=GAME_V;save()}}
'''
H = H[:s] + NEWS + H[e:]
rep('''function newsUI(){$("newsList").innerHTML=NEWS.map(n=>'<div class="news"><b>'+esc(n.d)+' · '+esc(n.t)+'</b><ul>'+n.l.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>').join("")}''',
    '''function newsUI(){$("newsList").innerHTML=newsHTML(newsLive())}\nsetInterval(newsUI,600000);''')
rep('''const m=h.match(new RegExp('\\\\{v:"([^"]+)"'))''', '''const m=h.match(new RegExp('\\\\{v:"([^"]+)"'))''')

# ---------------------------------------------------------------- accesos directos (boton original, con los apartados nuevos)
rep('["🌐","PVP online","pvpP"],["🏥","Centro Pokémon","healP"]', '["🌐","PVP online","pvpP"],["👥","Amigos","frP"],["🛡️","Gremios","gdP"],["🧑","Tu entrenador","trP"],["🏥","Centro Pokémon","healP"]')
rep('["💡","Sugerencias","sugP"],["❓","Cómo se juega","#welc"]', '["💝","Apoyar","supP"],["💡","Sugerencias","sugP"],["❓","Cómo se juega","#welc"]')
rep('const dm=dmEnsure(),rq=dm.l.filter(m=>!m.c&&m.p>=MISM[m.id][2]).length,ra=ACHS().filter(achReady).length;\n  $("navg")', 'const dm=dmEnsure(),rq=dm.l.filter(m=>!m.c&&m.p>=MISM[m.id][2]).length,ra=ACHS().filter(achReady).length,cnt={qP:rq,achP:ra,frP:FR.inc.length,bagU:evoReadyList().length};\n  $("navg")')
rep('c=n[2]==="qP"?rq:n[2]==="achP"?ra:0;', 'c=cnt[n[2]]||0;')
rep('const nb=rq+ra.length;$("navn").hidden=!nb;', 'const nb=rq+ra.length+FR.inc.length+evoReadyList().length;$("navn").hidden=!nb;')
s0 = H.index('// ================= sugerencias (solo las lee el creador del juego) =================')
H = H[:s0] + """// ---- tu entrenador ----
$("trOpts").addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!b.dataset.tr)return;const o=TRO.find(x=>x[0]===b.dataset.tr),L=myLook();snd("ui");
  if(b.dataset.v!=null)trSet(o[0],+b.dataset.v);else{const n=trN(o);let v=L[o[0]],g=0;do{v=(v+(+b.dataset.d)+n)%n;g++}while((!trOk(o[0],v)||!trSexOk(o[0],v))&&g<=n);trSet(o[0],v)}});
$("trRnd").onclick=()=>{S.tr=trRandom();save();trUI();trPubSoon();snd("ui")};
$("trRst").onclick=()=>{S.tr=Object.assign({},TRDEF);save();trUI();trPubSoon()};
$("trDemo").onclick=trDemo;
""" + H[s0:]
rep('updShop();updBag();rows();fists();healUI();bagUI();leagueUI();qUI();', 'updShop();updBag();rows();fists();healUI();bagUI();leagueUI();qUI();gUI();')
rep('pvInit0();buildBag();buildTeam();setsUI();buildShop();buildOpts();clBind();clInit();newsUI();welcInit();newsInit();$("navb").hidden=false;sugLoad();',
    'pvInit0();buildBag();buildTeam();setsUI();buildShop();buildOpts();clBind();clInit();newsUI();welcInit();newsInit();trUI();supUI();frUI();gUI(true);$("navb").hidden=false;sugLoad();')
# arranque de amigos y gremios
rep('async function pvInit0(){\n  $("pvNick").value=pvNick();', 'async function pvInit0(){\n  $("pvNick").value=pvNick();\n  if(window.FB){try{window.FB.frInit(frState)}catch(e){}if(S.gid)gWatch(S.gid);else{gFindMine();if(S.greq)gReqWatch(S.greq)}gRefresh()}')
rep("PR.onPeers(()=>pvRender(),()=>{PR=null;pvRender()});", "PR.onPeers(()=>{pvRender();gUI()},()=>{PR=null;pvRender()});")
# guardado en la nube: textos
rep('local:"Si has iniciado sesión, tu progreso se guarda también en tu cuenta (nube). Si juegas sin cuenta, solo se guarda en este navegador.",',
    'local:window.FB?"Tu progreso se guarda siempre en este navegador y se sube a tu cuenta en la nube automáticamente cada 5 minutos, al cerrar o cambiar de pestaña y cuando pulses «💾 Guardar» (arriba).":"Juegas sin cuenta: tu progreso solo se guarda en este navegador. Usa Exportar para hacer una copia.",')
rep('function clBind(){', 'function clBind(){\n  if(window.FB){$("clCloud").hidden=false;$("clCloud").onclick=()=>$("asave").click()}')

# ---------------------------------------------------------------- Firebase: menos escrituras + amigos y gremios
rep('''  async function flush(){
    if(!uid||pending===null)return;
    const d=pending;pending=null;
    try{await S.setDoc(S.doc(db,"users",uid),{data:d,updated:S.serverTimestamp()});g("sync").textContent="☁️ Guardado"}
    catch(e){pending=d;g("sync").textContent="⚠️ Sin guardar"}
  }
  window.cloudFlush=flush;
  window.cloudSave=j=>{pending=j;g("sync").textContent="☁️ Guardando…";if(!timer)timer=setTimeout(()=>{timer=0;flush()},4000)};
  addEventListener("beforeunload",flush);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)flush()});''',
'''  // Guardado en la nube con pocas escrituras: el juego guarda en el navegador continuamente, pero a Firestore
  // solo se sube cada 5 minutos (si hay cambios), al ocultar/cerrar la pestaña y al pulsar el boton 💾.
  const AUTO=5*60000;let lastW=0,lastSaved="",busy=false;
  const hhmm=t=>new Date(t).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"});
  const syncTxt=()=>{const e=g("sync");if(!e)return;const dirty=pending!==null&&pending!==lastSaved;{const a=g("acct");if(a)a.classList.toggle("dirty",dirty)}e.textContent=dirty?"● Sin subir":"☁️ "+(lastW?hhmm(lastW):"OK");e.title=(dirty?"Hay cambios que se subirán a la nube en breve. ":"")+(lastW?"Último guardado en la nube: "+hhmm(lastW)+". ":"")+"Se guarda solo cada 5 minutos, al cerrar o cambiar de pestaña y al pulsar 💾."};
  async function flush(force){
    if(!uid||pending===null||busy)return;
    if(pending===lastSaved){pending=null;syncTxt();return}
    if(force!==true&&Date.now()-lastW<(typeof force==="number"?force:0))return;
    busy=true;const d=pending;pending=null;g("sync").textContent="☁️ Guardando…";
    try{await S.setDoc(S.doc(db,"users",uid),{data:d,updated:S.serverTimestamp()});lastSaved=d;lastW=Date.now()}
    catch(e){if(pending===null)pending=d;g("sync").textContent="⚠️ Sin guardar";busy=false;return}
    busy=false;syncTxt();
  }
  window.cloudFlush=f=>flush(f===true?true:0);
  window.cloudSave=j=>{pending=j;if(!lastSaved&&!lastW)lastSaved=j;syncTxt()};
  setInterval(()=>flush(0),AUTO);
  addEventListener("pagehide",()=>{flush(true);try{if(lobby)lobby.leave()}catch(e){}});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)flush(20000)});
  g("asave").onclick=async()=>{const b=g("asave");if(b.disabled)return;b.disabled=true;try{if(typeof save==="function")save()}catch(e){}if(pending===null||pending===lastSaved){g("sync").textContent="☁️ Ya estaba guardado";setTimeout(syncTxt,1500)}else await flush(true);setTimeout(()=>{b.disabled=false},5000)};''')
rep('''      this.hb=setInterval(()=>{if(!this.closed&&Object.keys(this.mine).length)this._w(true).catch(()=>{})},20000);''',
    '''      const lob=path[0]==="lobby";this.unsub=this._sub();
      // latido: en el vestibulo cada 4 min (y solo con la pestaña visible); en los duelos cada 20 s
      this.hb=setInterval(()=>{if(!this.closed&&Object.keys(this.mine).length&&!(lob&&document.hidden))this._w(true).catch(()=>{})},lob?240000:20000);
      // vestibulo con la pestaña oculta más de 1 min: deja de escuchar (cada latido ajeno es una lectura) y vuelve al mostrarla
      if(lob)document.addEventListener("visibilitychange",()=>{if(this.closed)return;clearTimeout(this._ht);
        if(document.hidden)this._ht=setTimeout(()=>{if(document.hidden&&this.unsub){try{this.unsub()}catch(e){}this.unsub=null}},60000);
        else{if(!this.unsub)this.unsub=this._sub();if(Object.keys(this.mine).length&&Date.now()-this.lastW>60000)this._w(true).catch(()=>{})}});''')
rep('if(this.path[0]==="lobby"&&now-e.seen>60000)continue;', 'if(this.path[0]==="lobby"&&now-e.seen>600000)continue;')
# vestibulo: al suscribirse solo se leen los jugadores vistos en los últimos 10 min (no todos los que han pasado alguna vez)
rep('      this.unsub=S.onSnapshot(S.collection(db,...path),snap=>{', '      this._sub=()=>S.onSnapshot(path[0]==="lobby"?S.query(S.collection(db,...path),S.where("seen",">",Date.now()-600000)):S.collection(db,...path),snap=>{')
rep('if(!force&&j===this.lastJ&&Date.now()-this.lastW<20000)return;', 'if(!force&&j===this.lastJ)return;')
FB_API = '''
  // ---- amigos y gremios (Firestore: friends, freq, guilds) ----
  const FB={
    uid:()=>uid,
    frInit(cb){
      const st={l:{},inc:[],out:[]},fref=S.doc(db,"friends",uid),emit=()=>cb({l:Object.assign({},st.l),inc:st.inc.slice(),out:st.out.slice()});
      S.onSnapshot(fref,sn=>{st.l=(sn.exists()&&sn.data().l)||{};emit()},()=>{});
      S.onSnapshot(S.query(S.collection(db,"freq"),S.where("to","==",uid)),sn=>{st.inc=[];sn.forEach(d=>{const v=d.data();if(v.k==="req")st.inc.push(v);else if(v.k==="rm"){S.setDoc(fref,{l:{[v.from]:S.deleteField()}},{merge:true}).then(()=>S.deleteDoc(d.ref)).catch(()=>{})}});emit()},()=>{});
      S.onSnapshot(S.query(S.collection(db,"freq"),S.where("from","==",uid)),sn=>{st.out=[];sn.forEach(d=>{const v=d.data();if(v.k==="req")st.out.push(v);else if(v.k==="ok"){S.setDoc(fref,{l:{[v.to]:{n:v.tn||"",at:Date.now()}}},{merge:true}).then(()=>S.deleteDoc(d.ref)).catch(()=>{})}});emit()},()=>{});
    },
    async frSend(nick,me){
      const s=await S.getDoc(S.doc(db,"nicks",nkey(nick)));if(!s.exists())throw {code:"nf"};
      const to=s.data().uid;if(to===uid)throw {code:"self"};
      const f=await S.getDoc(S.doc(db,"friends",uid));if(f.exists()&&f.data().l&&f.data().l[to])return "already";
      const rv=await S.getDoc(S.doc(db,"freq",to+"_"+uid));if(rv.exists()&&rv.data().k==="req"){await FB.frAccept(to,rv.data().fn,me);return "accepted"}
      await S.setDoc(S.doc(db,"freq",uid+"_"+to),{from:uid,to:to,fn:String(me),tn:String(s.data().nick||nick),k:"req",at:Date.now()});return "sent";
    },
    async frAccept(from,fn,me){await S.setDoc(S.doc(db,"friends",uid),{l:{[from]:{n:String(fn||""),at:Date.now()}}},{merge:true});await S.updateDoc(S.doc(db,"freq",from+"_"+uid),{k:"ok",tn:String(me)})},
    frDecline:from=>S.deleteDoc(S.doc(db,"freq",from+"_"+uid)),
    frCancel:to=>S.deleteDoc(S.doc(db,"freq",uid+"_"+to)),
    frRename:(f,n)=>S.setDoc(S.doc(db,"friends",uid),{l:{[f]:{n:String(n||"").slice(0,30)}}},{merge:true}),
    gRename:(gid,n)=>S.updateDoc(S.doc(db,"guilds",gid),{["members."+uid+".n"]:String(n||"").slice(0,30)}),
    async frRemove(f,me){await S.setDoc(S.doc(db,"friends",uid),{l:{[f]:S.deleteField()}},{merge:true});await S.setDoc(S.doc(db,"freq",uid+"_"+f),{from:uid,to:f,fn:String(me),tn:"",k:"rm",at:Date.now()})},
    gid:n=>"g_"+encodeURIComponent(String(n).trim().replace(/\\s+/g," ").toLowerCase()).replace(/\\./g,"%2E"),
    async gList(){const sn=await S.getDocs(S.query(S.collection(db,"guilds"),S.orderBy("n","desc"),S.limit(50)));return sn.docs.map(d=>Object.assign({id:d.id},d.data()))},
    async gMine(){const sn=await S.getDocs(S.query(S.collection(db,"guilds"),S.where("members."+uid+".at",">",0),S.limit(1)));return sn.empty?null:sn.docs[0].id},
    gWatch:(gid,cb)=>S.onSnapshot(S.doc(db,"guilds",gid),sn=>cb(sn.exists()?sn.data():null),()=>{}),
    async gCreate(d,nick){const id=FB.gid(d.name),ref=S.doc(db,"guilds",id);await S.runTransaction(db,async tx=>{const s=await tx.get(ref);if(s.exists())throw {code:"exists"};tx.set(ref,Object.assign({},d,{owner:uid,members:{[uid]:{n:String(nick),at:Date.now()}},req:{},n:1,at:Date.now()}))});return id},
    gJoin:(gid,nick)=>S.updateDoc(S.doc(db,"guilds",gid),{["members."+uid]:{n:String(nick),at:Date.now()},["req."+uid]:S.deleteField(),n:S.increment(1)}),
    gRequest:(gid,nick)=>S.updateDoc(S.doc(db,"guilds",gid),{["req."+uid]:{n:String(nick),at:Date.now()}}),
    gLeave:(gid,wasSub)=>S.updateDoc(S.doc(db,"guilds",gid),Object.assign({["members."+uid]:S.deleteField(),n:S.increment(-1)},wasSub?{sub:""}:{})),
    gAccept:(gid,u,n)=>S.updateDoc(S.doc(db,"guilds",gid),{["members."+u]:{n:String(n||""),at:Date.now()},["req."+u]:S.deleteField(),n:S.increment(1)}),
    gReject:(gid,u)=>S.updateDoc(S.doc(db,"guilds",gid),{["req."+u]:S.deleteField()}),
    gKick:(gid,u,wasSub)=>S.updateDoc(S.doc(db,"guilds",gid),Object.assign({["members."+u]:S.deleteField(),n:S.increment(-1)},wasSub?{sub:""}:{})),
    gSetSub:(gid,u)=>S.updateDoc(S.doc(db,"guilds",gid),{sub:String(u||"")}),
    gEdit:(gid,f)=>S.updateDoc(S.doc(db,"guilds",gid),f),
    gTransfer:(gid,u,wasSub)=>S.updateDoc(S.doc(db,"guilds",gid),Object.assign({owner:u},wasSub?{sub:""}:{})),
    gDisband:gid=>S.deleteDoc(S.doc(db,"guilds",gid))
  };
'''
rep('  // sugerencias: cualquiera con cuenta puede enviar;', FB_API + '  // sugerencias: cualquiera con cuenta puede enviar;')
rep('lobby=new FsRoom(db,uid,["lobby"]);window.claude={use:async n=>n==="room"?lobby:null};', 'lobby=new FsRoom(db,uid,["lobby"]);window.claude={use:async n=>n==="room"?lobby:null};window.FB=FB;')
rep('g("aout").onclick=async()=>{await flush();', 'g("aout").onclick=async()=>{try{if(typeof save==="function")save()}catch(e){}await flush(true);')

exec(open(W+'add_spr.py',encoding='utf-8').read())
exec(open(W+'add_feat.py',encoding='utf-8').read())
exec(open(W+'add_more.py',encoding='utf-8').read())
exec(open(W+'add_ui2.py',encoding='utf-8').read())
exec(open(W+'add_rar.py',encoding='utf-8').read())
exec(open(W+'add_hub.py',encoding='utf-8').read())
exec(open(W+'add_new.py',encoding='utf-8').read())
H=H.replace('<meta charset="utf-8">','<meta charset="utf-8">\n'+open(W+'p_lang.html',encoding='utf-8').read(),1)
H=H.replace('__GAMEVER__',re.search(r'const GAME_VER="([^"]+)"',H).group(1))
open(W + 'index.html', 'w', encoding='utf-8').write(H)
print('OK', len(H.encode()))
exec(open(W+'build_i18n.py',encoding='utf-8').read())
