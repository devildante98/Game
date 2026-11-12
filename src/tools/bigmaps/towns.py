import random
from core import *
from feat import *
DOORCH="()[]"
INT_A=["WWWWWWWWWWWWWWW","WWWWWWWWWxWWWxW","LKGKFffVFFFFiBF","FFyFFFFFFFFFFFF","FMDDMFSSSPFFFFF","FFDDFFFFFFFFFCF","FFFFFFRRRFFFFFF","FFFFFFRRRFFFFFF","JFFFFFFFFFFFFZJ","FFFFFFF1FFFFFFF"]
INT_C=["WWWWWWWWWWWWWWW","WWWWWWWWWWxWWWW","LKGKFFffFZVZFBF","FFyFFFFFFFFFFFF","FMDDMFFFFSSSPFF","FFDDFFFFFFFFFFF","FFFFFFFFFRRRFFF","FFFFFFFFFRRRFFF","JFFFFFFFFFFFFFJ","FFFFFFF1FFFFFFF"]
mir=lambda g:[r[::-1] for r in g]
INTS=[(INT_A,[(5,5),(10,6)]),(mir(INT_C),[(9,5),(3,6)]),(INT_C,[(5,5),(7,6)]),(mir(INT_A),[(9,5),(4,6)])]
def scatter(c,x0,y0,x1,y1,rng,pt=.07,pf=.07):
    g=c.g
    for y in range(y0,y1+1):
        for x in range(x0,x1+1):
            if g[y][x]!='.':continue
            if any(g[y+b][x+a] not in '.,' for a in(-1,0,1) for b in(-1,0,1) if (a or b) and 0<=y+b<c.H2 and 0<=x+a<c.W2):continue
            r=rng.random()
            if r<pt:g[y][x]='#'
            elif r<pt+pf:g[y][x]=','
def add_house(c,M,idx,hx,hy,H):
    name,npcs=H;k=c.k;kind='house' if idx%2==0 else 'house2';door=1+idx%2
    bld(c,kind,hx,hy,4,3,door);dx=hx+door;dy=hy+2;ch=DOORCH[idx];c.g[dy][dx]=ch;c.g[dy+1][dx]='='
    key='%s_h%d'%(k,idx+3);c.m['w'][ch]={"to":key,"x":7,"y":8,"f":"u","look":"door"}
    grid,spots=INTS[(idx+len(k))%len(INTS)]
    M[key]={"n":name,"z":"","base":"F","fl":"wood","g":list(grid),"w":{"1":{"to":k,"x":dx,"y":dy+1,"f":"d","look":"mat"}},
      "npc":[{"x":spots[i][0],"y":spots[i][1],"f":"d","n":n,"t":[],"sight":0,"txt":"","chat":lines,"cls":cls} for i,(n,cls,lines) in enumerate(npcs)],"sg":{},"music":"town"}
    for n in M[key]['npc']:assert grid[n['y']][n['x']]=='F',(key,n['x'],n['y'],grid[n['y']][n['x']])
    return dx,dy+1
def place_npc(c,rect,npc,taken):
    x0,y0,x1,y1=rect;g=c.g;main=comp(g,c.start,taken)
    cand=[(x,y) for y in range(y0-1,y1+2) for x in range(x0-1,x1+2) if 0<y<c.H2-1 and 0<x<c.W2-1 and g[y][x]=='.' and (x,y) in main and (x,y) not in taken
          and all(g[y+b][x+a] in '.,=~&+o#Nb;' and (x+a,y+b) not in taken for a,b in((1,0),(-1,0),(0,1),(0,-1))) and sum(walk(g[y+b][x+a]) for a,b in((1,0),(-1,0),(0,1),(0,-1)))>=3]
    cx=(x0+x1)/2
    x,y=min(cand,key=lambda p:abs(p[0]-cx)+abs(p[1]-(y1+1))*1.5)
    taken.add((x,y));n,cls,lines=npc
    c.m.setdefault('npc',[]).append({"x":x,"y":y,"f":"d","n":n,"t":[],"sight":0,"txt":"","chat":lines,"cls":cls})
def town(M,k,cfg,seed=1):
    rng=random.Random(seed);port=cfg.get('port',False)
    c=extend(M,k,16,20 if port else 18,port);g=c.g;W,H,W2,H2=c.W,c.H,c.W2,c.H2
    road=c.road_y
    if road is None:
        road=open_right(c,9)
        for x in range(W,W2-3):g[road][x]='='
    ax=W+8;slots={};taken=set()
    if not port:
        sy=H+6
        for x in range(2,W2-2):g[sy][x]='='
        for y in range(road,sy+1):g[y][ax]='='
        cols=[open_bottom(c,int(W*.12)),open_bottom(c,int(W*.72))]
        for x in cols:
            for y in range(H,sy):g[y][x]='='
        # casas: una al este (norte de la calle) y dos al sur
        add_house(c,M,0,W+2,road-4,cfg['houses'][0])
        hx=[x for x in(6,12,18,24,30,36,42) if all(abs(x+d-q)>1 for d in range(4) for q in cols+[ax]) and x+4<W2-2]
        pick=[hx[1],hx[-2]] if len(hx)>=4 else hx[:2]
        for i,x in enumerate(pick):add_house(c,M,i+1,x,H+2,cfg['houses'][i+1])
        # zonas grandes al sur de la calle
        y0,y1=sy+2,H2-3;xs=[(2,15),(18,33),(36,W2-3)]
        for (x0,x1),f in zip(xs,cfg['south']):
            FEAT[f](c,x0,y0,x1,y1,rng);slots[f]=(x0,y0,x1,y1)
            mx=(x0+x1)//2
            if g[sy+1][mx]=='.':g[sy+1][mx]='='
        # este, al sur de la calle
        e0,e1=road+2,H-2
        for (x0,x1),f in zip([(W+1,ax-2),(ax+2,W2-2)],cfg['east']):
            FEAT[f](c,x0,e0,x1,e1,rng);slots[f+'E']=(x0,e0,x1,e1)
        FEAT[cfg.get('ne','meadow')](c,W+9,c.tt+1,W2-3,road-2,rng)
        scatter(c,1,H,W2-2,H+4,rng);scatter(c,W,c.tt,W2-2,road-2,rng,.05,.05)
        sx=cols[0]+1
        if g[sy-1][sx]=='.':g[sy-1][sx]='H';c.m['sg']['%d,%d'%(sx,sy-1)]=cfg['sign']
    else:
        sea0=next(y for y in range(H) if g[y][1]=='~')
        # el mar sigue hacia el este y hacia el sur; la arboleda del borde viejo pasa a ser agua
        for y in range(sea0,H2):
            for x in range(0,W2):
                if y<H and x<W-1 and y<H-c.tb:continue
                g[y][x]='~'
        for y in range(sea0,H):g[y][W-1]='~';g[y][0]='~' if y>=H-c.tb else g[y][0]
        for x in range(1,W-1):
            for j in range(c.tb):
                if g[H-1-j][x]!='=':g[H-1-j][x]='~'
        # el muelle viejo se queda donde está (la última casilla sigue siendo camino)
        iy0,iy1=H+3,H2-3;ix0,ix1=3,W2-4
        for y in range(iy0,iy1+1):
            d0=(1 if y in(iy0,iy1) else 0)+(rng.random()<.3);d1=(1 if y in(iy0,iy1) else 0)+(rng.random()<.3)
            for x in range(ix0+int(d0),ix1-int(d1)+1):g[y][x]='.'
        st=H+10
        for x in range(ix0+2,ix1-1):g[st][x]='='
        for y in range(road,st+1):g[y][ax]='='
        add_house(c,M,0,W+2,road-4,cfg['houses'][0])
        for i,x in enumerate((10,W2-22)):add_house(c,M,i+1,x,st-4,cfg['houses'][i+1])
        y0,y1=st+2,iy1-1;xs=[(ix0+2,ix0+15),(ix0+18,ix0+31),(ix0+34,ix1-2)]
        for (x0,x1),f in zip(xs,cfg['south']):
            FEAT[f](c,x0,y0,x1,y1,rng);slots[f]=(x0,y0,x1,y1)
            mx=(x0+x1)//2
            if g[st+1][mx]=='.':g[st+1][mx]='='
        FEAT[cfg.get('ne','meadow')](c,W+9,c.tt+1,W2-3,road-2,rng)
        for x,y in((W+2,road+2),(W+5,road+2),(W+11,road+2),(W+13,road+3)):
            if y<sea0-1 and g[y][x]=='.':g[y][x]=','
        scatter(c,ix0+1,iy0+1,ix1-1,st-5,rng,.06,.08);scatter(c,W,c.tt,W2-2,road-2,rng,.05,.05)
        sx=ax+1
        if g[iy0+1][sx]=='.':g[iy0+1][sx]='H';c.m['sg']['%d,%d'%(sx,iy0+1)]=cfg['sign']
    for anchor,npc in cfg['npcs']:place_npc(c,slots[anchor],npc,taken)
    ok=validate(c,c.m.get('npc',[]))
    commit(c);return c,ok
