import urllib.parse
def ball(kind):
    T={'pb':('#ffb24a','#ff943a','#de5a3a','#9c4a3a','#ffd63a'),
       'sb':('#5ab4ff','#3a94ff','#3152d6','#314294','#3ad6ff'),
       'ub':('#8a9aaa','#738494','#52636b','#3a464c','#a5b5c5'),
       'mb':('#d27aff','#b53af7','#7331ce','#5a24a8','#ffc5ff'),
       # Poké Ball grande de los clics: rojo intenso y brillo suave para que se vea el color
       'pbr':('#ff6b5e','#e8313a','#b81d2c','#6e1019','#ffd0c8')}[kind]
    hi,base,sh,dk,glint=T
    top_clip='M6 54 A44 44 0 0 1 94 54 Q50 64 6 54Z'
    deco=''
    if kind=='sb':
        deco=('<path d="M12 30 Q22 16 34 12 L40 22 Q28 26 20 38Z" fill="#e2403a"/><path d="M12 30 Q22 16 34 12 L36 16 Q26 20 17 33Z" fill="#f76a5a"/>'
              '<path d="M88 30 Q78 16 66 12 L60 22 Q72 26 80 38Z" fill="#bd3131"/>')
    if kind=='ub':
        deco=('<path d="M30 9 L30 56 L44 59 L44 30 L58 30 L58 59 L70 57 L70 11 Q60 7 58 8 L58 20 L44 20 L44 7 Q36 7 30 9Z" fill="#ffd63a"/>'
              '<path d="M30 9 L30 56 L34 57 L34 10Z M44 20 L58 20 L58 23 L44 23Z" fill="#fff75a"/><path d="M66 10 L70 11 L70 57 L66 58Z" fill="#d6ad10"/>')
    if kind=='mb':
        deco=('<circle cx="24" cy="32" r="9" fill="#e621c5"/><circle cx="76" cy="32" r="9" fill="#e621c5"/><circle cx="22" cy="29" r="3.2" fill="#ffc5ff"/><circle cx="74" cy="29" r="3.2" fill="#ffc5ff"/>'
              '<path d="M36 44 L39 22 L50 34 L61 22 L64 44 L58 44 L56.5 33 L50 41 L43.5 33 L42 44Z" fill="#fff" stroke="#decef7" stroke-width="1"/>')
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><radialGradient id="t" cx="34%" cy="26%" r="78%"><stop offset="0" stop-color="{hi}"/><stop offset=".45" stop-color="{base}"/><stop offset=".8" stop-color="{sh}"/><stop offset="1" stop-color="{dk}"/></radialGradient>
<linearGradient id="b" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#ece4fb"/><stop offset=".8" stop-color="#c4bede"/><stop offset="1" stop-color="#9d9abb"/></linearGradient>
<clipPath id="c"><path d="{top_clip}"/></clipPath></defs>
<circle cx="50" cy="50" r="44" fill="url(#b)"/>
<g clip-path="url(#c)"><circle cx="50" cy="50" r="44" fill="url(#t)"/>{deco}</g>
<path d="M6 54 Q50 64 94 54 L94 60 Q50 71 6 60Z" fill="#3c4444"/>
<path d="M8 57 Q50 67 92 57" fill="none" stroke="#5a6464" stroke-width="1.5"/>
<ellipse cx="33" cy="22" rx="9" ry="6" fill="{glint}" opacity="{".45" if kind=="pbr" else ".9"}" transform="rotate(-30 33 22)"/>
<ellipse cx="29" cy="19" rx="4" ry="2.6" fill="#ffffff" opacity="{".7" if kind=="pbr" else "1"}" transform="rotate(-30 29 19)"/>
<circle cx="40" cy="61" r="12.5" fill="#313131"/><circle cx="40" cy="61" r="8.5" fill="#decef7"/><circle cx="39" cy="60" r="5.5" fill="#ffffff"/><circle cx="37.5" cy="58.5" r="1.8" fill="#ffffff" opacity=".9"/>
<ellipse cx="66" cy="80" rx="14" ry="5" fill="#ffffff" opacity=".35" transform="rotate(-18 66 80)"/>
<circle cx="50" cy="50" r="44" fill="none" stroke="#313131" stroke-width="5"/>
</svg>'''
    return "url('data:image/svg+xml,"+urllib.parse.quote(' '.join(svg.split()),safe=':/=;, ')+"')"
