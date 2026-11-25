# Genera src/p_skins.css: los aspectos de la Poké Ball grande del gacha (Aspectos para la Poké Ball, versión 8.0).
# Cada aspecto es un dibujo SVG con la misma forma que la Poké Ball normal (ball_svg.py), más un efecto animado en CSS.
# Uso:  python3 src/tools/aspectos/aspectos_bola.py
import os, urllib.parse
AQUI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(AQUI, '..', '..', 'p_skins.css')

def svg(top, bot=None, band='#3c4444', ring='#313131', btn=('#313131', '#decef7', '#ffffff'), deco='', deco_bot='', glint='#ffffff', gop='.6'):
    hi, base, sh, dk = top
    b = bot or ('#ffffff', '#ece4fb', '#c4bede', '#9d9abb')
    top_clip = 'M6 54 A44 44 0 0 1 94 54 Q50 64 6 54Z'
    s = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><radialGradient id="t" cx="34%" cy="26%" r="78%"><stop offset="0" stop-color="{hi}"/><stop offset=".45" stop-color="{base}"/><stop offset=".8" stop-color="{sh}"/><stop offset="1" stop-color="{dk}"/></radialGradient>
<linearGradient id="b" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="{b[0]}"/><stop offset=".45" stop-color="{b[1]}"/><stop offset=".8" stop-color="{b[2]}"/><stop offset="1" stop-color="{b[3]}"/></linearGradient>
<clipPath id="c"><path d="{top_clip}"/></clipPath><clipPath id="d"><path d="M6 54 Q50 64 94 54 A44 44 0 0 1 6 54Z"/></clipPath></defs>
<circle cx="50" cy="50" r="44" fill="url(#b)"/>
<g clip-path="url(#d)">{deco_bot}</g>
<g clip-path="url(#c)"><circle cx="50" cy="50" r="44" fill="url(#t)"/>{deco}</g>
<path d="M6 54 Q50 64 94 54 L94 60 Q50 71 6 60Z" fill="{band}"/>
<ellipse cx="33" cy="22" rx="9" ry="6" fill="{glint}" opacity="{gop}" transform="rotate(-30 33 22)"/>
<ellipse cx="29" cy="19" rx="4" ry="2.6" fill="#ffffff" opacity=".85" transform="rotate(-30 29 19)"/>
<circle cx="40" cy="61" r="12.5" fill="{btn[0]}"/><circle cx="40" cy="61" r="8.5" fill="{btn[1]}"/><circle cx="39" cy="60" r="5.5" fill="{btn[2]}"/><circle cx="37.5" cy="58.5" r="1.8" fill="#ffffff" opacity=".9"/>
<ellipse cx="66" cy="80" rx="14" ry="5" fill="#ffffff" opacity=".3" transform="rotate(-18 66 80)"/>
<circle cx="50" cy="50" r="44" fill="none" stroke="{ring}" stroke-width="5"/>
</svg>'''
    return "url('data:image/svg+xml," + urllib.parse.quote(' '.join(s.split()), safe=':/=;, ') + "')"

stars = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" opacity="{o}"/>' for x, y, r, o in
                [(20, 40, 1.2, .9), (30, 18, .9, .8), (45, 28, 1.5, 1), (60, 14, .8, .7), (72, 30, 1.1, .9), (84, 42, .9, .8), (55, 44, .7, .6), (38, 46, 1, .8), (66, 46, 1.3, .9)])
SK = {
    'great': svg(('#6fc0ff', '#3a8cf0', '#2a5fc8', '#1c3d8a'), deco='<path d="M12 30 Q22 16 34 12 L40 22 Q28 26 20 38Z" fill="#e2403a"/><path d="M88 30 Q78 16 66 12 L60 22 Q72 26 80 38Z" fill="#c33434"/>'),
    'ultra': svg(('#5a6470', '#3a434c', '#262d34', '#14191e'), deco='<path d="M30 9 L30 56 L44 59 L44 30 L58 30 L58 59 L70 57 L70 11 Q60 7 58 8 L58 20 L44 20 L44 7 Q36 7 30 9Z" fill="#ffd63a"/><path d="M30 9 L30 56 L34 57 L34 10Z" fill="#fff36a"/>'),
    'luxury': svg(('#4a4a52', '#2a2a30', '#18181c', '#0a0a0c'), bot=('#3a3a40', '#26262a', '#1a1a1e', '#0e0e10'), band='#d8a530', btn=('#d8a530', '#f0e0a0', '#ffffff'),
                  deco='<path d="M6 40 Q50 52 94 40 L94 44 Q50 57 6 44Z" fill="#e8b33a"/><path d="M6 46 Q50 59 94 46 L94 49 Q50 62 6 49Z" fill="#d23a3a"/>', glint='#fff2c0'),
    'ice': svg(('#e8fbff', '#9fe3ff', '#5fb8e8', '#3a7fb8'), bot=('#ffffff', '#e8f8ff', '#bfe6f6', '#8fc8e0'), band='#4a8ab0', ring='#2f5f80', btn=('#2f5f80', '#d8f4ff', '#ffffff'),
               deco='<path d="M50 14 L50 50 M32 22 L68 46 M68 22 L32 46" stroke="#ffffff" stroke-width="2" opacity=".75"/><path d="M50 14 L46 20 M50 14 L54 20 M50 50 L46 44 M50 50 L54 44" stroke="#fff" stroke-width="1.6" opacity=".8"/>',
               deco_bot='<path d="M20 66 L26 74 L22 82 M78 66 L72 74 L76 82" stroke="#bfe6f6" stroke-width="2" fill="none"/>', glint='#ffffff', gop='.9'),
    'gold': svg(('#fff4b0', '#f2c230', '#c88a10', '#7a5206'), bot=('#fff8d0', '#f6dc80', '#d8b040', '#a07818'), band='#7a5206', ring='#6a4604', btn=('#6a4604', '#fff0a0', '#fffbe0'), glint='#ffffff', gop='.95'),
    'galaxy': svg(('#8a5cff', '#4a2ab8', '#22106a', '#0c0630'), bot=('#4a3a9a', '#2a1f6a', '#181040', '#0a0620'), band='#1a1040', ring='#120a30', btn=('#120a30', '#b8a0ff', '#ffffff'),
                  deco=stars + '<ellipse cx="50" cy="34" rx="30" ry="6" fill="#ff8af0" opacity=".25" transform="rotate(-12 50 34)"/>', deco_bot=stars.replace('cy="', 'cy="4'), glint='#d8c8ff'),
    'magma': svg(('#ff9a4a', '#d84a1a', '#8a2a10', '#401008'), bot=('#5a4a44', '#3a302c', '#2a2220', '#18120f'), band='#ff7a1a', ring='#2a1208', btn=('#2a1208', '#ffb060', '#fff0c0'),
                 deco='<path d="M14 40 L24 30 L30 36 L40 24 L46 32" stroke="#ffd060" stroke-width="2" fill="none"/><path d="M58 20 L64 30 L72 26 L80 38" stroke="#ffd060" stroke-width="2" fill="none"/>',
                 deco_bot='<path d="M18 70 L28 76 L34 70 L44 82 M60 86 L68 76 L78 80" stroke="#ff8a2a" stroke-width="2.2" fill="none"/>', glint='#ffe0a0'),
    'ghost': svg(('#c8a0ff', '#8a5cd8', '#5a3aa0', '#2a1a5a'), bot=('#e8e0ff', '#c8bcf0', '#9a8cd0', '#6a5ca8'), band='#3a2a6a', ring='#2a1a4a', btn=('#2a1a4a', '#e0d0ff', '#ffffff'),
                 deco='<circle cx="38" cy="32" r="5" fill="#2a1a4a"/><circle cx="62" cy="32" r="5" fill="#2a1a4a"/><path d="M40 44 Q50 50 60 44" stroke="#2a1a4a" stroke-width="2.4" fill="none"/>', glint='#f0e0ff'),
    'leaf': svg(('#a8f07a', '#4cbc3a', '#2a8a2a', '#165416'), bot=('#f8f0d0', '#ece0b0', '#d0c088', '#a89460'), band='#6a4a2a', ring='#2a3a18', btn=('#2a3a18', '#d8f0b0', '#ffffff'),
                deco='<path d="M24 40 Q30 20 48 18 Q42 34 24 40Z" fill="#7ad85a"/><path d="M24 40 Q36 28 48 18" stroke="#2a7a2a" stroke-width="1.4" fill="none"/><path d="M76 42 Q70 24 54 22 Q60 36 76 42Z" fill="#6ac84a"/>'),
    'thunder': svg(('#fff36a', '#ffd21a', '#d8a010', '#8a6406'), bot=('#4a4a5a', '#30303a', '#22222a', '#141418'), band='#1a1a22', ring='#1a1a22', btn=('#1a1a22', '#fff36a', '#ffffff'),
                   deco='<path d="M44 12 L34 36 L46 36 L38 56 L64 28 L50 28 L58 12Z" fill="#1a1a22" opacity=".85"/>', glint='#ffffff'),
    'rainbow': svg(('#ff7ad0', '#ff5a5a', '#ffb02a', '#5ac8ff'), deco='<path d="M6 30 Q50 6 94 30 L94 36 Q50 12 6 36Z" fill="#ffe23a"/><path d="M6 36 Q50 12 94 36 L94 42 Q50 18 6 42Z" fill="#5ae07a"/><path d="M6 42 Q50 18 94 42 L94 48 Q50 24 6 48Z" fill="#4aa8ff"/><path d="M6 48 Q50 24 94 48 L94 54 Q50 30 6 54Z" fill="#a46aff"/>'),
}
css = ['/* aspectos de la Poké Ball (generado por src/tools/aspectos/aspectos_bola.py; no editar a mano) */']
for k, url in SK.items():
    css.append(f'.bigball.bs-{k}{{background:{url} center/100% 100% no-repeat!important}}')
# efectos animados
css.append('.bigball[class*="bs-"]{overflow:visible}')
css.append('.bigball.bs-gold{filter:drop-shadow(0 0 14px rgba(255,200,60,.65))}')
css.append('.bigball.bs-galaxy{animation:bsGal 12s linear infinite}@keyframes bsGal{to{filter:hue-rotate(40deg) drop-shadow(0 0 16px rgba(140,90,255,.6))}}')
css.append('.bigball.bs-ghost{animation:bsGho 3s ease-in-out infinite}@keyframes bsGho{50%{opacity:.75;filter:drop-shadow(0 0 18px rgba(160,110,255,.8))}}')
css.append('.bigball.bs-thunder{animation:bsThu 2.4s steps(1) infinite}@keyframes bsThu{0%,86%,100%{filter:none}88%,92%{filter:brightness(1.45) drop-shadow(0 0 16px #fff36a)}}')
css.append('.bigball.bs-rainbow{animation:bsRai 6s linear infinite}@keyframes bsRai{to{filter:hue-rotate(360deg)}}')
css.append('.bigball.bs-magma{animation:bsMag 2s ease-in-out infinite alternate}@keyframes bsMag{to{filter:drop-shadow(0 0 16px rgba(255,110,30,.75))}}')
css.append('.bigball.bs-ice{filter:drop-shadow(0 0 12px rgba(160,230,255,.75))}')
css.append('@media (prefers-reduced-motion:reduce){.bigball[class*="bs-"]{animation:none!important}}')
open(OUT, 'w').write('\n'.join(css) + '\n')
print('p_skins.css:', len(SK), 'aspectos')
