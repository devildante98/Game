# Fuente «Gacha Pop» (estilo de Poke Gacha Online): letras gruesas y redondeadas hechas con trazos.
# Uso: pip install fonttools shapely && python3 gacha_pop.py  → GachaPop.ttf
import math
from shapely.geometry import LineString, Point, Polygon, MultiPolygon
from shapely.geometry.polygon import orient
from shapely.ops import unary_union
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

R=88          # medio grosor del trazo (unidades de 1000 por em)
H=524         # altura del esqueleto de las mayúsculas (con el grosor queda en ~700)
M=H/2
SB=46         # espacio a cada lado

def arc(cx,cy,rx,ry,a0,a1,n=None):
    n=n or max(8,int(abs(a1-a0)/6))
    return [(cx+rx*math.cos(math.radians(a0+(a1-a0)*i/n)),cy+ry*math.sin(math.radians(a0+(a1-a0)*i/n))) for i in range(n+1)]

def G(w,*strokes,dots=(),polys=()):
    return {"w":w,"s":[list(s) for s in strokes],"d":list(dots),"p":list(polys)}

def star(cx,cy,Ro,Ri):
    return [(cx+(Ro if i%2==0 else Ri)*math.cos(math.radians(90+i*36)),cy+(Ro if i%2==0 else Ri)*math.sin(math.radians(90+i*36))) for i in range(10)]

GL={}
GL['A']=G(430,[(0,0),(215,H),(430,0)],[(95,170),(335,170)])
GL['B']=G(350,[(0,0),(0,H)],[(0,H),(185,H)]+arc(185,H-128,128,128,90,-90)+[(0,H-256)],[(0,H-256),(205,H-256)]+arc(205,(H-256)/2,140,(H-256)/2,90,-90)+[(0,0)])
GL['C']=G(430,arc(215,M,215,M,42,318))
GL['D']=G(410,[(0,0),(0,H),(170,H)]+arc(170,M,240,M,90,-90)+[(0,0)])
GL['E']=G(330,[(330,H),(0,H),(0,0),(330,0)],[(0,M),(270,M)])
GL['F']=G(320,[(320,H),(0,H),(0,0)],[(0,M+6),(260,M+6)])
GL['G']=G(450,arc(225,M,225,M,40,360)+[(240,M)])
GL['H']=G(400,[(0,0),(0,H)],[(400,0),(400,H)],[(0,M),(400,M)])
GL['I']=G(0,[(0,0),(0,H)])
GL['J']=G(300,[(300,H),(300,150)]+arc(150,150,150,150,0,-175))
GL['K']=G(370,[(0,0),(0,H)],[(370,H),(10,215)],[(120,315),(370,0)])
GL['L']=G(300,[(0,H),(0,0),(300,0)])
GL['M']=G(520,[(0,0),(0,H),(260,150),(520,H),(520,0)])
GL['N']=G(410,[(0,0),(0,H),(410,0),(410,H)])
GL['O']=G(470,arc(235,M,235,M,0,360,72))
GL['P']=G(330,[(0,0),(0,H),(195,H)]+arc(195,H-135,135,135,90,-90)+[(0,H-270)])
GL['Q']=G(480,arc(235,M,235,M,0,360,72),[(300,120),(480,-40)])
GL['R']=G(360,[(0,0),(0,H),(190,H)]+arc(190,H-132,132,132,90,-90)+[(0,H-264)],[(170,H-264),(360,0)])
GL['S']=G(360,arc(180,397,170,127,25,270)+arc(180,135,180,135,90,-155))
GL['T']=G(410,[(0,H),(410,H)],[(205,H),(205,0)])
GL['U']=G(410,[(0,H),(0,190)]+arc(205,190,205,190,180,360)+[(410,H)])
GL['V']=G(440,[(0,H),(220,0),(440,H)])
GL['W']=G(640,[(0,H),(150,0),(320,H*.64),(490,0),(640,H)])
GL['X']=G(420,[(0,H),(420,0)],[(0,0),(420,H)])
GL['Y']=G(430,[(0,H),(215,M-10),(430,H)],[(215,M-10),(215,0)])
GL['Z']=G(380,[(0,H),(380,H),(0,0),(380,0)])
GL['0']=G(380,arc(190,M,190,M,0,360,72))
GL['1']=G(170,[(0,H-110),(130,H),(130,0)])
GL['2']=G(370,arc(185,392,180,132,165,-25)+[(0,0),(370,0)])
GL['3']=G(360,arc(180,400,170,124,150,-90)+arc(175,138,185,138,90,-150))
GL['4']=G(400,[(320,0),(320,H),(0,170),(400,170)])
GL['5']=G(370,[(355,H),(30,H),(15,300)]+arc(180,168,190,168,135,-150))
GL['6']=G(380,arc(190,268,190,256,75,200)+arc(190,168,190,168,180,540,72))
GL['7']=G(370,[(0,H),(370,H),(120,0)])
GL['8']=G(380,arc(190,405,160,119,-90,270,60),arc(190,143,190,143,90,450,60))
GL['9']=G(380,arc(190,356,190,168,0,360,72),arc(190,256,190,256,0,-105))
GL['!']=G(0,[(0,H),(0,200)],dots=[(0,0)])
GL['?']=G(340,arc(170,392,170,132,160,-60)+[(170,200)],dots=[(170,0)])
GL['¡']=G(0,[(0,0),(0,H-200)],dots=[(0,H)])
GL['.']=G(0,dots=[(0,0)])
GL[',']=G(30,[(30,0),(-20,-120)])
GL[':']=G(0,dots=[(0,0),(0,300)])
GL[';']=G(30,[(30,0),(-20,-120)],dots=[(30,300)])
GL['-']=G(230,[(0,M),(230,M)])
GL['+']=G(300,[(0,M),(300,M)],[(150,M-150),(150,M+150)])
GL['=']=G(300,[(0,M+90),(300,M+90)],[(0,M-90),(300,M-90)])
GL["'"]=G(0,[(0,H),(0,H-160)])
GL['"']=G(130,[(0,H),(0,H-160)],[(130,H),(130,H-160)])
GL['/']=G(300,[(0,-40),(300,H+40)])
GL['(']=G(130,arc(260,M,260,M+60,135,225))
GL[')']=G(130,arc(-130,M,260,M+60,45,-45))
GL['%']=G(440,[(0,0),(440,H)],dots=[(70,H-70),(370,70)])
GL['#']=G(400,[(110,0),(160,H)],[(260,0),(310,H)],[(20,M+90),(400,M+90)],[(0,M-90),(380,M-90)])
GL['★']=G(560,polys=[star(280,M,330,135)])
GL['♥']=G(520,polys=[[(260,-20)]+[(260+250*math.cos(math.radians(a)),M+80+200*math.sin(math.radians(a))) for a in []]])
del GL['♥']

# ¿ = ? girado
GL['¿']={"w":340,"s":[[(340-x,H-y) for x,y in st] for st in GL['?']["s"]],"d":[(340-x,H-y) for x,y in GL['?']["d"]],"p":[]}
# letras con tilde, Ñ y Ü
def acc(base,kind):
    g=GL[base];w=g["w"];cx=w/2;s=[list(x) for x in g["s"]];d=list(g["d"])
    top=H+R+90
    if kind=="acute": s.append([(cx-40,top),(cx+70,top+120)])
    if kind=="tilde": s.append([(cx-130,top+40)]+[(cx-130+260*i/20,top+40+45*math.sin(math.pi*2*i/20)) for i in range(21)])
    if kind=="diaer": d+= [(cx-95,top+45),(cx+95,top+45)]
    return {"w":w,"s":s,"d":d,"p":list(g["p"])}
for b,c in (('A','Á'),('E','É'),('I','Í'),('O','Ó'),('U','Ú')): GL[c]=acc(b,"acute")
GL['Ñ']=acc('N',"tilde");GL['Ü']=acc('U',"diaer")

def outline(g,sx=1.0,sy=1.0):
    parts=[]
    for s in g["s"]:
        pts=[(x*sx,y*sy) for x,y in s]
        if len(pts)==1: parts.append(Point(pts[0]).buffer(R,quad_segs=10))
        else: parts.append(LineString(pts).buffer(R,cap_style="round",join_style="round",quad_segs=10))
    for x,y in g["d"]: parts.append(Point(x*sx,y*sy).buffer(R*1.12,quad_segs=10))
    for p in g["p"]: parts.append(Polygon([(x*sx,y*sy) for x,y in p]).buffer(30,join_style="round",quad_segs=8))
    return unary_union(parts).simplify(1.5) if parts else None

def draw(geom,dx,dy):
    pen=TTGlyphPen(None)
    if geom is not None and not geom.is_empty:
        polys=[geom] if isinstance(geom,Polygon) else list(geom.geoms)
        for p in polys:
            p=orient(p,sign=-1.0)
            for ring in [p.exterior]+list(p.interiors):
                c=list(ring.coords)[:-1]
                pen.moveTo((round(c[0][0]+dx),round(c[0][1]+dy)))
                for x,y in c[1:]: pen.lineTo((round(x+dx),round(y+dy)))
                pen.closePath()
    return pen.glyph()

order=[".notdef","space"];cmap={32:"space"};glyphs={};metrics={}
glyphs[".notdef"]=draw(None,0,0);metrics[".notdef"]=(500,0)
glyphs["space"]=draw(None,0,0);metrics["space"]=(270,0)
def add(name,cp,g,sx=1.0,sy=1.0):
    geo=outline(g,sx,sy);w=g["w"]*sx
    minx=geo.bounds[0] if geo is not None and not geo.is_empty else 0
    dx=R+SB;dy=R
    glyphs[name]=draw(geo,dx,dy);adv=int(w+2*(R+SB));metrics[name]=(adv,int(minx+dx))
    order.append(name);cmap[cp]=name
for ch,g in GL.items():
    nm="g%04X"%ord(ch);add(nm,ord(ch),g)
    lo=ch.lower()
    if lo!=ch and len(lo)==1: add("g%04X"%ord(lo),ord(lo),g,.88,.78)   # minúsculas = versalitas

fb=FontBuilder(1000,isTTF=True)
fb.setupGlyphOrder(order);fb.setupCharacterMap(cmap);fb.setupGlyf(glyphs)
fb.setupHorizontalMetrics(metrics);fb.setupHorizontalHeader(ascent=980,descent=-260)
fb.setupNameTable({"familyName":"Gacha Pop","styleName":"Regular","uniqueFontIdentifier":"GachaPop-Regular-1.0","fullName":"Gacha Pop","psName":"GachaPop-Regular","version":"Version 1.000","copyright":"Poke Gacha Online","licenseDescription":"Fuente creada para Poke Gacha Online. Uso libre para el juego y su comunidad."})
fb.setupOS2(sTypoAscender=980,sTypoDescender=-260,usWinAscent=1100,usWinDescent=300,sxHeight=560,sCapHeight=700,achVendID="PGO ")
fb.setupPost();fb.save("GachaPop.ttf");print("glifos:",len(order))
