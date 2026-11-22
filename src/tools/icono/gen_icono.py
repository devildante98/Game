# Genera el icono del juego (Poké Ball con temática de gacha) en SVG: icon.svg, icon_sq.svg (iPhone), icon_mask.svg (Android) e icon_small.svg (pestaña).
# Uso: python3 gen_icono.py && node render_png.js  (crea los PNG; después se copian a la raíz y a src/)
import math,sys
def star(cx,cy,R,r,n=5,rot=-90):
    pts=[]
    for i in range(n*2):
        a=math.radians(rot+i*180/n);rr=R if i%2==0 else r
        pts.append(f"{cx+rr*math.cos(a):.1f},{cy+rr*math.sin(a):.1f}")
    return " ".join(pts)
def spark(cx,cy,s):  # destello de 4 puntas
    return f"M{cx},{cy-s} C{cx+s*.18},{cy-s*.18} {cx+s*.18},{cy-s*.18} {cx+s},{cy} C{cx+s*.18},{cy+s*.18} {cx+s*.18},{cy+s*.18} {cx},{cy+s} C{cx-s*.18},{cy+s*.18} {cx-s*.18},{cy+s*.18} {cx-s},{cy} C{cx-s*.18},{cy-s*.18} {cx-s*.18},{cy-s*.18} {cx},{cy-s}Z"
def svg(rounded=True,scale=1.0,small=False):
    C=256;cy=284 if not small else 256
    rays=[]
    n=18
    for i in range(n):
        a0=math.radians(i*360/n-4.5);a1=math.radians(i*360/n+4.5);L=420
        rays.append(f"M{C},{cy} L{C+L*math.cos(a0):.1f},{cy+L*math.sin(a0):.1f} L{C+L*math.cos(a1):.1f},{cy+L*math.sin(a1):.1f}Z")
    rx=' rx="112"' if rounded else ''
    g=[]
    g.append(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<defs>
<radialGradient id="bg" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#8a2be2"/><stop offset=".45" stop-color="#4a128f"/><stop offset="1" stop-color="#1a0838"/></radialGradient>
<radialGradient id="ray" cx=".5" cy=".555" r=".6"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".95"/><stop offset=".55" stop-color="#ffb43a" stop-opacity=".35"/><stop offset="1" stop-color="#ff7ad9" stop-opacity="0"/></radialGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6c8" stop-opacity=".95"/><stop offset=".5" stop-color="#ffc94a" stop-opacity=".55"/><stop offset="1" stop-color="#ff9a1a" stop-opacity="0"/></radialGradient>
<linearGradient id="red" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#ff6b78"/><stop offset=".45" stop-color="#ec1c3a"/><stop offset="1" stop-color="#9e0022"/></linearGradient>
<linearGradient id="wht" x1=".3" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e6e9f7"/><stop offset="1" stop-color="#b9bfdc"/></linearGradient>
<radialGradient id="btn" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#fff4c4"/><stop offset="1" stop-color="#ffc23a"/></radialGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a6"/><stop offset=".5" stop-color="#ffcc33"/><stop offset="1" stop-color="#e08a00"/></linearGradient>
<linearGradient id="seam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffb52e"/><stop offset=".5" stop-color="#fffbe0"/><stop offset="1" stop-color="#ffb52e"/></linearGradient>
<clipPath id="frame"><rect width="512" height="512"{rx}/></clipPath>
<clipPath id="ball"><circle cx="{C}" cy="{cy}" r="148"/></clipPath>
</defs>
<rect width="512" height="512"{rx} fill="url(#bg)"/>
<g clip-path="url(#frame)"><g transform="translate({C} {cy}) scale({scale}) translate({-C} {-cy})">
{'' if small else '<path d="'+' '.join(rays)+'" fill="url(#ray)" opacity=".8"/>'}
<circle cx="{C}" cy="{cy}" r="215" fill="url(#glow)"/>''')
    # bola inclinada
    g.append(f'<g transform="rotate(-16 {C} {cy})">')
    g.append(f'<circle cx="{C+6}" cy="{cy+12}" r="152" fill="#12051f" opacity=".35"/>')
    g.append(f'<g clip-path="url(#ball)"><rect x="{C-160}" y="{cy-160}" width="320" height="160" fill="url(#red)"/><rect x="{C-160}" y="{cy}" width="320" height="160" fill="url(#wht)"/>'
             f'<ellipse cx="{C}" cy="{cy+150}" rx="170" ry="60" fill="#8f97c4" opacity=".35"/>'
             f'<ellipse cx="{C-20}" cy="{cy-150}" rx="160" ry="55" fill="#ffffff" opacity=".12"/></g>')
    # banda con luz que se escapa
    g.append(f'<rect x="{C-152}" y="{cy-15}" width="304" height="30" rx="6" fill="#1b0f2e"/>')
    g.append(f'<rect x="{C-146}" y="{cy-4}" width="292" height="8" rx="4" fill="url(#seam)"/>')
    if not small:
        for dx,h in ((-110,60),(-62,90),(62,90),(110,60)):
            g.append(f'<path d="M{C+dx-6},{cy-4} L{C+dx},{cy-4-h} L{C+dx+6},{cy-4}Z" fill="#fff3b0" opacity=".55"/>')
    g.append(f'<circle cx="{C}" cy="{cy}" r="148" fill="none" stroke="#1b0f2e" stroke-width="13"/>')
    # brillo superior
    g.append(f'<path d="M{C-112},{cy-62} A126,126 0 0 1 {C-30},{cy-128}" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".75"/>')
    if not small: g.append(f'<circle cx="{C-122}" cy="{cy-30}" r="8" fill="#fff" opacity=".7"/>')
    # botón
    g.append(f'<circle cx="{C}" cy="{cy}" r="54" fill="#1b0f2e"/><circle cx="{C}" cy="{cy}" r="44" fill="url(#gold)"/><circle cx="{C}" cy="{cy}" r="32" fill="url(#btn)" stroke="#c97a00" stroke-width="3"/>')
    g.append(f'<polygon points="{star(C,cy,20,8.5)}" fill="#ffb800" stroke="#b86200" stroke-width="2.5" stroke-linejoin="round"/>')
    g.append('</g>')
    # estrellas de rareza
    for i,(sx,sy,R) in enumerate(() if small else ((156,104,34),(256,74,44),(356,104,34))):
        g.append(f'<polygon points="{star(sx,sy,R,R*.45)}" fill="url(#gold)" stroke="#5a2400" stroke-width="{6 if R>40 else 5}" stroke-linejoin="round"/>')
        g.append(f'<polygon points="{star(sx-R*.12,sy-R*.15,R*.38,R*.17)}" fill="#fffbe0" opacity=".85"/>')
    if not small:
        for (x,y,s,c) in ((74,250,22,"#fff"),(440,214,26,"#fff4b0"),(424,420,18,"#fff"),(92,418,16,"#ffe27a"),(468,330,12,"#ffd0f5"),(52,336,10,"#fff")):
            g.append(f'<path d="{spark(x,y,s)}" fill="{c}"/>')
        for (x,y,r,c) in ((120,180,5,"#ff7ad9"),(402,160,6,"#7ae7ff"),(388,458,5,"#ffe27a"),(140,470,4,"#7ae7ff"),(470,120,4,"#ffe27a")):
            g.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>')
    g.append('</g></g></svg>')
    return "\n".join(g)
open('icon.svg','w').write(svg(True,1.0))
open('icon_sq.svg','w').write(svg(False,1.0))
open('icon_mask.svg','w').write(svg(False,.78))
open('icon_small.svg','w').write(svg(True,1.22,small=True).replace('cy=".55" r=".75"','cy=".5" r=".8"'))
