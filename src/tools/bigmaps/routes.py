import random
from core import *
from feat import *
TXT=["¡Te he visto! ¡Combate!","¡Mis Pokémon y yo llevamos todo el día entrenando por esta senda!","¡Por aquí no se pasa sin luchar!","¿Vienes por el sendero nuevo? ¡Pues te toca combatir!","¡A ver qué tal lo haces!","¡Qué bien, alguien con quien combatir!"]
def new_area(c,x,y):return (x>=c.W or y>=c.H) and 1<=x<=c.W2-2 and c.tt<=y<=c.H2-c.tb-1
def pool(m):
    L=[]
    for n in m.get('npc',[]):
        for t in n.get('t',[]):
            if t not in L:L.append(t)
    return L
def add_trainers(c,names,rng,spots):
    P=pool(c.m);out=[]
    for nm in names:
        if not spots:break
        x,y,f=spots.pop(0);t=rng.sample(P,2) if len(P)>=2 else P[:]
        n={"x":x,"y":y,"f":f,"n":nm,"t":t,"sight":3,"txt":rng.choice(TXT)};c.m.setdefault('npc',[]).append(n);out.append(n)
    return out
def trainer_spots(c,rng,taken=()):
    g=c.g;cand=[]
    for y in range(c.tt+1,c.H2-c.tb-1):
        for x in range(2,c.W2-2):
            if not new_area(c,x,y) or g[y][x]!=c.base:continue
            for f,(a,b) in(('u',(0,-1)),('d',(0,1)),('l',(-1,0)),('r',(1,0))):
                if g[y+b][x+a]=='=' and g[y+2*b][x+2*a] in '=.,sTg' and sum(walk(g[y+q][x+p]) for p,q in((1,0),(-1,0),(0,1),(0,-1)))>=3:cand.append((x,y,f))
    rng.shuffle(cand);out=[]
    for x,y,f in cand:
        if all(abs(x-a)+abs(y-b)>=9 for a,b,_ in out) and all(abs(x-n['x'])+abs(y-n['y'])>=5 for n in c.m.get('npc',[])):out.append((x,y,f))
    return out
def route(M,k,cfg,seed=1):
    rng=random.Random(seed);c=extend(M,k,16,18);g=c.g;W,H,W2,H2=c.W,c.H,c.W2,c.H2;B=c.base
    ex=W+8;ty=H+9
    if c.road_x is not None:cx=c.road_x
    else:
        cx=open_bottom(c,cfg.get('cx',int(W*.45)))
        for y in range(H,ty+1):g[y][cx]='='
    if c.road_y is not None:ry=c.road_y
    else:
        ry=open_right(c,cfg.get('ry',H//2))
        for x in range(W,ex+1):g[ry][x]='='
    for x in range(min(cx,ex),max(cx,ex)+1):g[ty][x]='='
    for y in range(min(ry,ty),max(ry,ty)+1):g[y][ex]='='
    if cx>12:
        for x in range(5,cx):g[ty+4][x]='='
        for y in range(ty,ty+5):g[y][cx]='=' if g[y][cx] in(B,'=') else g[y][cx]
    free=lambda x,y:new_area(c,x,y) and g[y][x]==B
    def clear(x0,y0,x1,y1,m=1):
        return all(free(x,y) for y in range(y0-m,y1+m+1) for x in range(x0-m,x1+m+1))
    def place(w,h,fn,tries=300,m=1):
        for _ in range(tries):
            x0=rng.randint(2,W2-2-w);y0=rng.randint(c.tt+1,H2-c.tb-1-h)
            if clear(x0,y0,x0+w-1,y0+h-1,m):fn(x0,y0,x0+w-1,y0+h-1);return (x0,y0)
        return None
    tall=cfg.get('tall','T')
    def grass(x0,y0,x1,y1):
        for x,y in R(x0,y0,x1,y1):
            if (x,y) in((x0,y0),(x1,y0),(x0,y1),(x1,y1)) and rng.random()<.6:continue
            g[y][x]=tall
    def pond(x0,y0,x1,y1):ellipse(c,(x0+x1)/2,(y0+y1)/2,(x1-x0)/2+.2,(y1-y0)/2+.2,'~',B)
    def trees(x0,y0,x1,y1):
        for x,y in R(x0,y0,x1,y1):g[y][x]='#'
    def ledge(x0,y0,x1,y1):
        for x in range(x0,x1+1):g[y0+2][x]='-'
    def flowers(x0,y0,x1,y1):
        for x,y in R(x0,y0,x1,y1):g[y][x]=','
    def one(ch):
        def f(x0,y0,x1,y1):g[y0+1][x0+1]=ch
        return f
    def pocket(x0,y0,x1,y1):
        for x,y in R(x0,y0,x1,y1-1):g[y][x]='#'
        g[y0+1][x0+1]='I';g[y0+2][x0+1]='j'
    N=cfg.get('n',{})
    for _ in range(N.get('grass',6)):place(rng.randint(5,9),rng.randint(3,5),grass)
    for _ in range(N.get('pond',2)):place(rng.randint(6,8),rng.randint(4,5),pond)
    for _ in range(N.get('pocket',1)):place(3,4,pocket)
    for _ in range(N.get('ledge',3)):place(rng.randint(5,8),5,ledge,m=0)
    for _ in range(N.get('trees',7)):place(rng.randint(2,4),rng.randint(2,3),trees)
    for _ in range(N.get('flowers',5)):place(rng.randint(3,4),rng.randint(2,3),flowers,m=0)
    for _ in range(N.get('rocks',6)):place(3,3,one('o'),m=0)
    for _ in range(N.get('berry',2)):place(3,3,one(';'),m=0)
    for _ in range(N.get('item',3)):place(3,3,one('I'),m=0)
    tr=add_trainers(c,cfg.get('trainers',[]),rng,trainer_spots(c,rng))
    if cfg.get('sign'):
        for sx,sy in((cx+1,H+1),(cx-1,H+1),(ex+1,ty-1)):
            if free(sx,sy):g[sy][sx]='H';c.m['sg']['%d,%d'%(sx,sy)]=cfg['sign'];break
    ok=validate(c,tr);commit(c);return c,ok
def forest(M,k,cfg,seed=1):
    rng=random.Random(seed);c=extend(M,k,16,18);g=c.g;W,H,W2,H2=c.W,c.H,c.W2,c.H2
    inR=lambda x,y:(x>=W or y>=H) and 1<=x<=W2-2 and c.tt<=y<=H2-c.tb-1
    for y in range(H2):
        for x in range(W2):
            if inR(x,y):g[y][x]='#'
    cell=lambda x,y:inR(x,y) and x%2==1 and y%2==1
    ry=open_right(c,10,'.');bx=open_bottom(c,24,'.')
    carved=set()
    def carve(x,y):
        if inR(x,y) or (x==W-1) or (H-c.tb<=y<H):g[y][x]='.';carved.add((x,y))
    # entradas hasta la primera celda
    x=W
    while not cell(x,ry|1 if ry%2==0 else ry):carve(x,ry);x+=1
    sy=ry if ry%2==1 else ry+1
    carve(x,ry);carve(x,sy);start=(x,sy)
    y=H
    while y%2==0 or not inR(bx|1,y):carve(bx,y);y+=1
    carve(bx,y);bxc=bx if bx%2==1 else bx+1;carve(bxc,y);second=(bxc,y)
    seen={start};stack=[start]
    while stack:
        x,y=stack[-1];nb=[(x+dx,y+dy,x+dx//2,y+dy//2) for dx,dy in((2,0),(-2,0),(0,2),(0,-2)) if cell(x+dx,y+dy) and (x+dx,y+dy) not in seen]
        if not nb:stack.pop();continue
        nx,ny,wx,wy=rng.choice(nb);carve(wx,wy);carve(nx,ny);seen.add((nx,ny));stack.append((nx,ny))
    assert second in seen,second
    cells=sorted(seen)
    for _ in range(cfg.get('braid',16)):
        x,y=rng.choice(cells);dx,dy=rng.choice(((2,0),(0,2)))
        if (x+dx,y+dy) in seen:carve(x+dx//2,y+dy//2)
    rooms=[]
    for _ in range(cfg.get('rooms',6)):
        for _t in range(50):
            x,y=rng.choice(cells)
            if all(inR(x+a,y+b) for a in(-2,-1,0,1,2) for b in(-1,0,1)) and all(abs(x-p)+abs(y-q)>8 for p,q in rooms):
                for a in(-2,-1,0,1,2):
                    for b in(-1,0,1):carve(x+a,y+b)
                rooms.append((x,y));break
    ends=[p for p in cells if sum((p[0]+a,p[1]+b) in carved for a,b in((1,0),(-1,0),(0,1),(0,-1)))==1 and p not in(start,second)]
    rng.shuffle(ends)
    for x,y in carved:
        if not inR(x,y):continue
        r=rng.random();g[y][x]='d' if r<.42 else ',' if r<.47 else '.'
    for x,y in ends[:cfg.get('item',4)]:g[y][x]='I'
    for x,y in ends[4:4+cfg.get('berry',1)]:g[y][x]=';'
    tr=[];P=pool(c.m)
    for (x,y),nm in zip(rooms,cfg.get('trainers',[])):
        g[y][x]='.';g[y+1][x]='.';n={"x":x,"y":y-1,"f":"d","n":nm,"t":rng.sample(P,2),"sight":2,"txt":rng.choice(TXT)};g[y-1][x]='.';c.m['npc'].append(n);tr.append(n)
    for (x,y) in rooms[len(tr):]:g[y][x]='u' if g[y][x] in '.,d' else g[y][x]
    ok=validate(c,tr);commit(c);return c,ok
def beach(M,k,cfg,seed=1):
    rng=random.Random(seed);c=extend(M,k,16,18);g=c.g;W,H,W2,H2=c.W,c.H,c.W2,c.H2
    for y in range(H2):
        for x in range(W2):
            if x>=W or y>=H:g[y][x]='~'
    for y in range(1,H):g[y][W-1]='~' if g[y][W-1] in '#p' else g[y][W-1]
    isl=[(W+7,5,5,3),(W+8,14,4,2.4),(10,H+8,7,3.6),(27,H+5,4,2.4),(W+6,H+10,5.5,3.2),(22,H+13,3.5,2)]
    for i,(cx,cy,rx,ry) in enumerate(isl):
        ellipse(c,cx,cy,rx,ry,'s','~')
        g[int(cy)][int(cx)]='I'
        for a,b,ch in((-2,-1,'p'),(2,0,'o'),(int(rx)-1,1,'p')):
            x,y=int(cx)+a,int(cy)+b
            if g[y][x]=='s' and rng.random()<.8:g[y][x]=ch
        if rx>=5:
            for x,y in R(int(cx)-3,int(cy)+1,int(cx)-1,int(cy)+2):
                if g[y][x]=='s':g[y][x]='g'
    ok=validate(c,[],allow_unreach=lambda x,y,ch:True);commit(c);return c,ok
