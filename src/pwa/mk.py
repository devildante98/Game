from playwright.sync_api import sync_playwright
import base64
svg=open('/home/claude/w/favicon.svg').read()
# icono "maskable": fondo completo sin esquinas redondeadas y con margen de seguridad
svgm=svg.replace('<rect width="64" height="64" rx="15" fill="url(#bg)"/>','<rect width="64" height="64" fill="url(#bg)"/><g transform="translate(6.4 6.4) scale(.8)">',1).replace('</svg>','</g></svg>')
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page()
    for name,s,src in [('icon-192.png',192,svg),('icon-512.png',512,svg),('icon-maskable-512.png',512,svgm)]:
        pg.set_viewport_size({'width':s,'height':s})
        pg.set_content('<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,'+base64.b64encode(src.encode()).decode()+'" width=%d height=%d></body></html>'%(s,s))
        pg.screenshot(path=name,omit_background=True)
    b.close()
