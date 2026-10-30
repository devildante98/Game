# ===================== menú principal opción A: cuadrícula del botón flotante + ventanas emergentes =====================
_gi=H.index('<script type="text/plain" id="game">');_ge=H.index('</script>',_gi)
H=H[:_ge]+open(W+'p_hub.js',encoding='utf-8').read()+'\n'+H[_ge:]
rep('img.pk.item{object-fit:contain;image-rendering:pixelated}',r'''img.pk.item{object-fit:contain;image-rendering:pixelated}
/* ---- menú (opción A) ---- */
#hubG{position:fixed;inset:0;z-index:60;background:rgba(14,16,40,.6);transition:background .25s;display:flex;align-items:flex-end;justify-content:flex-end;padding:20px 20px calc(170px + env(safe-area-inset-bottom,0px));box-sizing:border-box}
#hubG[hidden]{display:none}
#hubG.blur{background:rgba(14,16,40,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.hubgl{display:grid;grid-template-columns:repeat(4,150px);gap:14px;max-width:100%}
.hubtile{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:140px;padding:14px 10px;border-radius:22px;border:none;background:var(--panel);color:var(--ink);box-shadow:0 12px 28px rgba(10,12,40,.3);text-align:center;cursor:pointer;transition:transform .12s}
.hubtile:hover{transform:translateY(-3px)}
.hubtile .hti{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:1.7rem;background:color-mix(in srgb,var(--hc) 16%,var(--panel))}
.hubtile b{font-size:1rem}.hubtile small{font-size:.72rem;color:var(--mute);line-height:1.2}
.hubtile i{position:absolute;top:10px;right:12px;min-width:24px;height:24px;border-radius:12px;background:var(--red);color:#fff;font-style:normal;font-weight:900;font-size:.78rem;display:grid;place-items:center;padding:0 6px;box-sizing:border-box}
.hubq{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
.hubq button{background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:99px;padding:8px 14px;font-weight:700}
#navb{width:92px!important;height:92px!important;right:20px!important;bottom:calc(38px + env(safe-area-inset-bottom,0px))!important;background:transparent!important;box-shadow:none!important;border:none!important;padding:0!important;font-size:0!important;overflow:visible;z-index:61!important}
#navb .nbball{position:absolute;inset:0;display:block;animation:nbbob 2.4s ease-in-out infinite;filter:drop-shadow(0 10px 14px rgba(0,0,0,.35));transition:transform .2s}
#navb .nbball svg{width:100%;height:100%;display:block}
#navb .nbring{position:absolute;inset:0;border-radius:50%;border:4px solid #ff6a6a;animation:nbring 2.2s ease-out infinite;pointer-events:none}
#navb .nblab{position:absolute;left:50%;bottom:-24px;transform:translateX(-50%);background:#1c1f3a;color:#fff;border-radius:99px;padding:3px 12px;font-size:13px;font-weight:900;line-height:1.2;letter-spacing:.5px;white-space:nowrap;box-shadow:0 3px 8px rgba(0,0,0,.25)}
#navb .nbadge{position:absolute!important;top:0!important;right:0!important;min-width:28px;height:28px;border-radius:14px!important;font-size:.9rem!important;font-weight:900!important;display:grid;place-items:center;padding:0 7px!important;box-sizing:border-box;box-shadow:0 2px 6px rgba(0,0,0,.25)}
#navb .nbadge[hidden]{display:none}
#navb:hover .nbball{transform:scale(1.06)}
#navb .nbball svg{overflow:visible}
#navb .nbtop,#navb .nbbot,#navb .nbbtn{transition:transform .38s cubic-bezier(.34,1.56,.64,1)}
#navb .nbin{opacity:0;transform-box:fill-box;transform-origin:center;transform:scaleY(.2);transition:opacity .25s,transform .38s cubic-bezier(.34,1.56,.64,1)}
#navb .nbdot{transition:fill .2s}
#navb.open .nbball{animation:none;transform:none}
#navb.open .nbtop{transform:translateY(-15px)}
#navb.open .nbbot,#navb.open .nbbtn{transform:translateY(5px)}
#navb.open .nbin{opacity:1;transform:scaleY(1)}
#navb.open .nbdot{fill:#ffe066}
#hubG.out{pointer-events:none}
.hubburst{position:fixed;z-index:62;width:340px;height:340px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,#ffffff 0,#fff8c8 22%,rgba(255,220,120,.55) 45%,rgba(255,180,80,0) 70%);will-change:transform,opacity}
.hubring{position:fixed;z-index:62;width:120px;height:120px;border-radius:50%;pointer-events:none;border:5px solid rgba(255,255,255,.9);box-shadow:0 0 18px #fff59a,inset 0 0 18px #fff59a}
.hubspark{position:fixed;z-index:62;pointer-events:none;text-shadow:0 0 8px currentColor;line-height:1;will-change:transform,opacity}
.hubring{will-change:transform,opacity}
/* con el menú o una ventana abiertos se pausan las animaciones de detrás (no se ven y así el desenfoque no se recalcula) */
body.menuon main *,body.hubon main *,body.modalon main *,body.menuon #bgw,body.menuon #bgw *,body.hubon #bgw,body.hubon #bgw *,body.modalon #bgw,body.modalon #bgw *,body.menuon #rain *,body.hubon #rain *,body.modalon #rain *{animation-play-state:paused!important}
/* la Pokédex solo dibuja las cartas visibles */
#collP .card{content-visibility:auto;contain-intrinsic-size:auto 150px}#navb.open .nbring{display:none}
@keyframes nbbob{50%{transform:translateY(-6px) rotate(-6deg)}}
@keyframes nbring{0%{transform:scale(.85);opacity:.75}70%,100%{transform:scale(1.5);opacity:0}}
@media (max-width:700px){#navb{width:74px!important;height:74px!important;right:14px!important;bottom:calc(32px + env(safe-area-inset-bottom,0px))!important}#navb .nblab{font-size:11px!important;padding:2px 10px;bottom:-20px}}
@media (prefers-reduced-motion:reduce){#navb .nbball{animation:none}#navb .nbring{display:none}}
@keyframes hubfade{from{opacity:0}}
@keyframes hubpop{from{opacity:0;transform:translateY(18px) scale(.9)}}
@media (max-width:700px){.hubgl{grid-template-columns:repeat(2,minmax(0,1fr));width:100%}.hubtile{min-height:0;flex-direction:row;justify-content:flex-start;text-align:left;padding:12px;gap:12px}.hubtile small{display:none}.hubtile .hti{width:42px;height:42px;font-size:1.35rem;flex:none}#hubG{padding:14px 14px calc(140px + env(safe-area-inset-bottom,0px))}}
#hubM{position:fixed;inset:0;z-index:58;background:rgba(12,14,36,.68);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box}
#hubM[hidden]{display:none}
#hubM.in .hubw{animation:hubwin .22s cubic-bezier(.2,.9,.3,1.1);will-change:transform,opacity}
@keyframes hubwin{from{opacity:0;transform:translateY(24px) scale(.97)}}
.hubw{width:min(1000px,100%);max-height:calc(100vh - 40px);display:flex;flex-direction:column;background:var(--bg);border-radius:24px;overflow:hidden;box-shadow:0 30px 70px rgba(10,12,40,.45)}
.hubh{display:flex;align-items:center;gap:14px;padding:18px 20px 12px;background:linear-gradient(135deg,var(--hc),color-mix(in srgb,var(--hc) 65%,#fff));color:#fff}
.hubi{width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,.22);display:grid;place-items:center;font-size:1.6rem;flex:none}
.hubtt{flex:1;display:flex;flex-direction:column}.hubtt b{font-size:1.45rem;line-height:1.1}.hubtt small{opacity:.92;font-weight:600}
#hubX{width:44px;height:44px;border-radius:14px;border:none;background:rgba(255,255,255,.25);color:#fff;font-size:1.2rem;padding:0;flex:none}
.hubtabs{display:flex;flex-wrap:wrap;gap:6px;padding:0 20px 14px;background:linear-gradient(135deg,var(--hc),color-mix(in srgb,var(--hc) 65%,#fff))}
.hubtabs[hidden]{display:none}
.hubtabs button{border:none;border-radius:12px;padding:9px 16px;font-weight:800;background:rgba(0,0,0,.16);color:#fff}
.hubtabs button.on{background:#fff;color:var(--hc)}
.hubtabs .hact{margin-left:auto;background:rgba(255,255,255,.22)}.hubtabs .hact+.hact{margin-left:0}
.hubb{overflow-y:auto;padding:16px 18px 20px;overscroll-behavior:contain}
#hubM .hubb>.panel{display:block!important;margin:0;border:none;box-shadow:none;background:transparent;padding:0;max-width:none}
#hubM .hubb>.panel>h2:first-child,#hubM .hubb>.panel>.hhead:first-child>h2{font-size:1.1rem}
@media (max-width:700px){#hubM{padding:0}.hubw{width:100%;height:100%;max-height:none;border-radius:0}.hubh{padding:14px 14px 10px}.hubtabs{padding:0 14px 12px}.hubb{padding:14px}}
body.hubon{overflow:hidden}
.tasum{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:6px 0 16px}
.tasum>div{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;text-align:center;display:flex;flex-direction:column}
.tasum b{font-size:1.5rem;color:var(--ink)}.tasum small{color:var(--mute);font-size:.75rem}
@media (max-width:600px){.tasum{grid-template-columns:repeat(2,minmax(0,1fr))}}
.tagrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.tacard{display:flex;gap:12px;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:12px 14px}
.tacard.done{border:2px solid #f5a300;background:linear-gradient(135deg,color-mix(in srgb,#ffd35c 18%,var(--panel)),var(--panel))}
.taic{width:52px;height:52px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:1.6rem;background:var(--bg);border:3px solid var(--line)}
.tacard.done .taic{border-color:#f5a300;box-shadow:0 0 12px rgba(245,163,0,.45)}
.tainf{display:flex;flex-direction:column;gap:3px;min-width:0}.tainf small{color:var(--mute);font-size:.78rem}
.tapip{display:flex;align-items:center;gap:4px;margin-top:2px}.tapip i{width:14px;height:6px;border-radius:3px;background:var(--line)}.tapip i.on{background:#f5a300}
.tapip span{margin-left:6px;font-size:.72rem;font-weight:800;color:var(--mute)}.tacard.done .tapip span{color:#b07400}
body.hubon #optb,body.hubon #optp{display:none}
#hud{display:flex;align-items:center;gap:8px;margin-left:auto}
#hud button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:999px;padding:6px 12px;font-weight:800;box-shadow:none}
#hud .hudav{width:44px;height:44px;padding:0;border-radius:14px;overflow:hidden;display:grid;place-items:start center;background:linear-gradient(#bfe6ff,#e8f6ff);border:2px solid var(--teal)}
#hud .hudav img{width:52px;margin-top:-2px;image-rendering:pixelated}
@media (max-width:600px){#hud{margin-left:0}}
label:has(input[data-o="pColl"]),label:has(input[data-o="pBag"]),label:has(input[data-o="pHeal"]),label:has(input[data-o="pPvp"]){display:none!important}''',1)
# ---- ajustes con secciones (estilo retro como el de la referencia) ----
H=H.replace('</head>','<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@500;700&display=swap" rel="stylesheet">\n</head>',1)
rep('body.hubon{overflow:hidden}',r'''body.hubon{overflow:hidden}
#optp{position:fixed!important;inset:0!important;top:0!important;right:0!important;width:auto!important;max-height:none!important;overflow:visible!important;background:rgba(6,10,36,.7)!important;border:none!important;border-radius:0!important;padding:16px!important;box-shadow:none!important;z-index:70!important;display:flex!important;align-items:center;justify-content:center;box-sizing:border-box}
#optp[hidden]{display:none!important}
.setw{--sa:#e63950;--son:#13a37f;width:min(820px,100%);height:min(640px,calc(100vh - 32px));display:grid;grid-template-columns:210px minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:24px;box-shadow:0 30px 70px rgba(0,0,0,.45);overflow:hidden}
#optp:not([hidden]) .setw{animation:setin .26s cubic-bezier(.2,.9,.3,1.15)}
@keyframes setin{from{opacity:0;transform:scale(.95) translateY(14px)}}
.seth{grid-column:1/-1;display:flex;align-items:center;gap:14px;padding:14px 18px 14px 20px;background:linear-gradient(120deg,#ff5a6e,#e63950 45%,#c42a5e);color:#fff;border-bottom:4px solid #2b2b34;position:relative}
.seth::before{content:"";flex:none;width:38px;height:38px;border-radius:50%;border:3px solid #2b2b34;box-sizing:border-box;background:radial-gradient(circle,#fff 0 4px,#2b2b34 4.5px 7.5px,transparent 8px),linear-gradient(180deg,#ff5a6e 0 44%,#2b2b34 44% 56%,#fff 56%);box-shadow:0 3px 8px rgba(0,0,0,.25);animation:setspin 8s linear infinite}
@keyframes setspin{to{transform:rotate(360deg)}}
.seth h2{flex:1;margin:0;font-size:1.45rem;font-weight:800;letter-spacing:.3px;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.18)}
.setx{background:rgba(255,255,255,.16)!important;color:#fff!important;border:1.5px solid rgba(255,255,255,.65)!important;border-radius:999px!important;padding:7px 18px!important;font-weight:700;font-size:.92rem!important;box-shadow:none!important;cursor:pointer}
.setx:hover{background:rgba(255,255,255,.3)!important}
.settabs{display:flex;flex-direction:column;gap:4px;padding:14px 10px;background:var(--bg);border-right:1px solid var(--line);overflow-y:auto}
.settabs button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:transparent;color:var(--ink);border:none;border-radius:14px;padding:11px 14px;font:inherit;font-weight:600;font-size:.95rem;box-shadow:none;cursor:pointer;transition:background .15s,color .15s}
.settabs button:hover{background:color-mix(in srgb,var(--ink) 7%,transparent)}
.settabs button.on{background:color-mix(in srgb,var(--sa) 13%,var(--panel));color:var(--sa);box-shadow:inset 4px 0 0 var(--sa)}
.setbody{overflow-y:auto;padding:4px 26px 26px}
.setpane h3{margin:18px 0 2px;font-size:1.35rem;font-weight:800;color:var(--ink)}
.setpane h4{margin:22px 0 8px;font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
.setpane label{display:flex!important;align-items:center;gap:14px;font-size:.93rem!important;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:11px 14px;margin:0 0 8px;line-height:1.35;transition:border-color .15s}
.setpane label:hover{border-color:color-mix(in srgb,var(--sa) 45%,var(--line))}
.setpane label.tog{flex-direction:row-reverse;justify-content:space-between;cursor:pointer}
.setpane label.slid>span{font-weight:700;min-width:120px}
.setpane input[type=range]{flex:1;-webkit-appearance:none;appearance:none;height:6px;background:linear-gradient(90deg,var(--sa),#ff9a6e);border:none;border-radius:6px;margin:0}
.setpane input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid var(--sa);box-shadow:0 2px 6px rgba(0,0,0,.25);cursor:pointer}
.setpane input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid var(--sa);cursor:pointer}
.setpane input[type=checkbox]{-webkit-appearance:none;appearance:none;width:46px;height:26px;flex:none;border-radius:13px;background:color-mix(in srgb,var(--ink) 22%,transparent);border:none;position:relative;cursor:pointer;transition:background .2s;margin:0}
.setpane input[type=checkbox]::before{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .2s}
.setpane input[type=checkbox]:checked{background:var(--son)}
.setpane input[type=checkbox]:checked::before{transform:translateX(20px)}
.setpane select,#optp #song{font:inherit;background:var(--panel)!important;color:var(--ink)!important;border:1px solid var(--line)!important;border-radius:10px!important;padding:8px 10px!important}
#optp #song{width:100%;margin-bottom:8px;display:block}
.setbtn,.setpane .mrow button{font:inherit;font-weight:700!important;background:var(--panel)!important;color:var(--ink)!important;border:1px solid var(--line)!important;border-radius:12px!important;padding:9px 15px!important;font-size:.92rem!important;box-shadow:0 2px 0 var(--line)!important;cursor:pointer}
.setbtn:hover,.setpane .mrow button:hover{border-color:var(--sa)!important;color:var(--sa)!important}
.setpane .mrow{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 8px}
.setpane small,.setnote{display:block;color:var(--mute)!important;font-size:.82rem;margin:4px 2px 10px;line-height:1.4}
.setpane .tkl{margin-bottom:8px}
.setabout{background:var(--bg);border:1px solid var(--line);border-radius:16px;padding:16px 18px;display:flex;flex-direction:column;gap:6px;border-left:5px solid var(--sa)}
.setabout b{font-size:1.25rem}
.setlinks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 0 6px}
#setMute{margin:4px 0 4px}
@media (max-width:600px){#optp{padding:0!important}.setw{width:100%;height:100%;max-height:none;border-radius:0;border:none;box-shadow:none;grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto minmax(0,1fr)}.seth h2{font-size:1.25rem}.settabs{flex-direction:row;overflow-x:auto;padding:8px 10px;border-right:none;border-bottom:1px solid var(--line);gap:4px}.settabs button{width:auto;flex:none;padding:8px 12px;font-size:.88rem}.settabs button.on{box-shadow:inset 0 -3px 0 var(--sa)}.setbody{padding:2px 16px 20px}.setlinks{grid-template-columns:minmax(0,1fr)}}
body.calm *,body.calm *::before,body.calm *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
body.hicon{--mute:color-mix(in srgb,var(--ink) 88%,transparent);--line:color-mix(in srgb,var(--ink) 50%,transparent)}
body.hicon .panel{border-width:2px}''')
# ---- tema oscuro manual completo ----
rep(':root[data-theme="dark"]{--bg:#12152b;',':root[data-theme="dark"]{--C:#8d93b5;--bg:#12152b;',1)
rep('body.hicon .panel{border-width:2px}','body.hicon .panel{border-width:2px}\n:root[data-theme="dark"]{color-scheme:dark}:root[data-theme="light"]{color-scheme:light}')
# ---- botón de pantalla completa ----
rep('body.hicon .panel{border-width:2px}','body.hicon .panel{border-width:2px}\n#fsb{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));right:58px;z-index:60;width:42px;height:42px;border-radius:50%;padding:0;display:grid;place-items:center;background:var(--panel);color:var(--ink);border:1px solid var(--line);box-shadow:0 2px 8px rgba(0,0,0,.18);cursor:pointer;transition:transform .15s}\n#fsb:hover{transform:scale(1.08)}#fsb.on{background:var(--teal);color:#0d2a24;border-color:var(--teal)}\nbody.hubon #fsb{display:none}')
# ---- cartas del gacha: clic para verlas en grande ----
rep('return `<div class="card ${p[2]} ${big?"big":""} ${sh?"shiny":""}">','return `<div class="card ${p[2]} ${big?"big":""} ${sh?"shiny":""}" data-pn="${String(p[0]).replace(/"/g,"&quot;")}" data-sh="${sh?1:0}" title="Toca para verlo en grande">')
rep('body.hicon .panel{border-width:2px}',r'''body.hicon .panel{border-width:2px}
#out .card[data-pn]{cursor:zoom-in;transition:transform .15s}#out .card[data-pn]:hover{transform:translateY(-3px) scale(1.04)}
#pkv{position:fixed;inset:0;z-index:72;background:rgba(8,10,34,.76);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}
#pkv[hidden]{display:none}
.pkvw{position:relative;width:min(380px,100%);background:radial-gradient(circle at 50% 30%,color-mix(in srgb,var(--tc) 30%,var(--panel)),var(--panel) 70%);border:4px solid var(--C);border-radius:26px;padding:22px 20px 20px;display:flex;flex-direction:column;align-items:center;gap:10px;box-shadow:0 26px 60px rgba(0,0,0,.5);color:var(--ink);text-align:center}
.pkvw.R{border-color:var(--R)}.pkvw.E{border-color:var(--E);box-shadow:0 0 30px var(--E),0 26px 60px rgba(0,0,0,.5)}.pkvw.M{border-color:var(--M);box-shadow:0 0 34px var(--M),0 26px 60px rgba(0,0,0,.5)}.pkvw.L{border-color:var(--L);box-shadow:0 0 40px var(--L),0 26px 60px rgba(0,0,0,.5)}
.pkvw.shiny{border-color:#ffd35c;box-shadow:0 0 40px #ffe58a,0 26px 60px rgba(0,0,0,.5)}
.pkvx{position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:12px;padding:0;background:var(--bg);color:var(--ink);border:1px solid var(--line);font-size:1.1rem}
.pkvdex{position:absolute;top:16px;left:18px;font-weight:800;color:var(--mute)}
.pkvspr{width:240px;height:240px;display:grid;place-items:center;margin-top:8px;filter:drop-shadow(0 12px 10px rgba(0,0,0,.25))}
.pkvspr img,.pkvspr svg{max-width:240px!important;max-height:240px!important;image-rendering:pixelated;object-fit:contain}
.pkvw h3{margin:0;font-size:1.6rem}
.pkvtags{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.pkvtags span{background:var(--bg);border:1px solid var(--line);border-radius:99px;padding:4px 12px;font-weight:700;font-size:.9rem}
.pkvty{border-color:var(--tc)!important}
.pkvinfo{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;color:var(--mute);font-size:.9rem}.pkvinfo b{color:var(--ink)}
.pkvcry{margin-top:4px}''')
# ---- conjuntos del entrenador ----
rep('body.hicon .panel{border-width:2px}',r'''body.hicon .panel{border-width:2px}
#trSets{margin-top:14px;background:var(--bg);border:1px solid var(--line);border-radius:16px;padding:12px}
.trsh{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}.trsh small{color:var(--mute);font-weight:700}
.trsg{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}
.trslot{position:relative;aspect-ratio:3/4;border-radius:12px;background:linear-gradient(#bfe6ff,#e8f6ff 62%,#a4de78 63%,#6aa63e);border:2px solid var(--line);overflow:hidden;cursor:pointer;display:grid;place-items:start center;transition:transform .12s}
.trslot:hover{transform:translateY(-2px)}
.trslot img{width:150%;margin-top:6%;image-rendering:pixelated;pointer-events:none}
.trslot.empty{background:var(--panel);border-style:dashed;place-items:center}
.trsplus{font-size:1.6rem;color:var(--mute);font-weight:700}
.trslot i{position:absolute;left:4px;bottom:3px;font-style:normal;font-size:.7rem;font-weight:900;background:rgba(28,31,58,.8);color:#fff;border-radius:6px;padding:0 5px}
.trslot em{position:absolute;right:4px;bottom:3px;font-style:normal;font-size:.7rem;font-weight:900;background:var(--teal);color:#0d2a24;border-radius:6px;padding:0 5px}
.trslot.sel{border-color:var(--teal);box-shadow:0 0 0 3px color-mix(in srgb,var(--teal) 35%,transparent)}
.trsdel{position:absolute;top:3px;right:3px;width:20px;height:20px;padding:0;border-radius:6px;border:none;background:rgba(28,31,58,.75);color:#fff;font-size:.65rem;line-height:1;opacity:0;transition:opacity .15s}
.trslot:hover .trsdel,.trslot:focus-within .trsdel{opacity:1}
@media (hover:none){.trsdel{opacity:.85}}
.trsave{width:100%;margin-top:10px}
.trsmsg{display:block;margin-top:6px;color:var(--mute);font-size:.75rem;line-height:1.3}''')
# ---- sprites en alta definición ----
rep('body.hicon .panel{border-width:2px}','body.hicon .panel{border-width:2px}\nimg.pk.hd{image-rendering:auto!important;object-fit:contain}\n.spr img.hd,.pkvspr img.hd,.tspr2 img.hd,.evost img.hd{animation:hdidle 3.2s ease-in-out infinite;transform-origin:50% 90%}\n@keyframes hdidle{50%{transform:scale(1.015,1.035) translateY(-1px)}}\nbody.calm img.hd{animation:none!important}')
# ---- alta definición solo en las cartas del gacha ----
