import json,random,subprocess,collections
REPO='/home/user/Game';SRC=REPO+'/src/p_explore.js'
def load():
    raw=subprocess.check_output(['git','-C',REPO,'show','HEAD:src/p_explore.js']).decode()
    L=raw.split('\n');s=L[1];a,b=s.index('{'),s.rindex('}')+1
    return L,a,b,json.loads(s[a:b])
def save(L,a,b,M):
    s=L[1];L[1]=s[:a]+json.dumps(M,ensure_ascii=False,separators=(',',':'))+s[b:];open(SRC,'w').write('\n'.join(L))
BLK=set("#mXpo~bkwuHfIhWYZVQJAN")|set("jrv0;-+!&:")
def walk(c):return c is not None and c not in BLK
class Ctx:pass
def majority(cs,ex=''):
    cs=[c for c in cs if c not in ex];return collections.Counter(cs).most_common(1)[0][0]
def comp(g,start,extra_block=()):
    H=len(g);W=len(g[0]);seen={start};q=[start]
    while q:
        x,y=q.pop()
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            nx,ny=x+dx,y+dy
            if 0<=nx<W and 0<=ny<H and (nx,ny) not in seen and walk(g[ny][nx]) and (nx,ny) not in extra_block:seen.add((nx,ny));q.append((nx,ny))
    return seen
def extend(M,k,dw=16,dh=18,port=False):
    m=M[k];og=[list(r) for r in m['g']];W=len(og[0]);H=len(og);wk=set((m.get('w')or{}).keys())
    solid=lambda r:all((not walk(c)) or c in wk for c in r)
    tt=0
    while solid(og[tt]):tt+=1
    tb=0
    while solid(og[H-1-tb]):tb+=1
    c=Ctx();c.k=k;c.m=m;c.W=W;c.H=H;c.W2=W+dw;c.H2=H+dh;c.tt=tt;c.tb=tb;c.port=port
    c.base='s' if m['base']=='s' else '.'
    rightc=majority([og[y][W-1] for y in range(tt,H-tb)],wk);leftc=majority([og[y][0] for y in range(tt,H-tb)],wk);botc=majority(og[H-1],wk)
    c.rightc,c.leftc,c.botc=rightc,leftc,botc
    g=[[c.base]*c.W2 for _ in range(c.H2)]
    for y in range(H):
        for x in range(W):g[y][x]=og[y][x]
    for y in range(tt):
        t=og[y][W-1] if og[y][W-1] not in wk else rightc
        for x in range(W,c.W2):g[y][x]=t
    for y in range(tt,c.H2):g[y][c.W2-1]=rightc
    for y in range(H,c.H2):g[y][0]=leftc
    for j in range(tb):
        for x in range(c.W2):g[c.H2-1-j][x]=botc
    c.g=g;c.og=og
    # componente principal del mapa viejo
    start=None
    for k2,m2 in M.items():
        for w2 in (m2.get('w')or{}).values():
            if w2.get('to')==k and walk(og[w2['y']][w2['x']]):start=(w2['x'],w2['y']);break
        if start:break
    if not start:start=next((x,y) for y in range(H) for x in range(W) if walk(og[y][x]))
    c.start=start;c.oldmain=comp(og,start)
    # salidas del borde derecho e inferior: se llevan al borde nuevo
    c.road_y=None;c.road_x=None
    for ch,w in list((m.get('w')or{}).items()):
        pos=[(x,y) for y in range(H) for x in range(W) if og[y][x]==ch]
        if not pos:continue
        x,y=pos[0]
        if x==W-1 and w.get('look')=='path':
            for xx in range(W-1,c.W2-1):g[y][xx]='='
            g[y][c.W2-1]=ch;c.road_y=y
            for m2 in M.values():
                for w2 in (m2.get('w')or{}).values():
                    if w2.get('to')==k and w2['x']==W-2 and w2['y']==y:w2['x']=c.W2-2
        elif y==H-1 and w.get('look')=='path':
            for yy in range(H-tb,c.H2-1):g[yy][x]='='
            g[c.H2-1][x]=ch;c.road_x=x
            for m2 in M.values():
                for w2 in (m2.get('w')or{}).values():
                    if w2.get('to')==k and w2['y']==H-tb-1 and w2['x']==x:w2['y']=c.H2-2
    return c
def open_bottom(c,pref,ch='='):
    g=c.g;y0=c.H-c.tb-1
    cand=[x for x in range(2,c.W-2) if (x,y0) in c.oldmain and g[y0][x] in '.,=sTdg' and all(g[yy][x] in '#m' or g[yy][x]==c.botc for yy in range(c.H-c.tb,c.H))]
    cand=[x for x in cand if all(not(g[y0][x+d] in 'I') for d in(-1,1))]
    x=min(cand,key=lambda x:(abs(x-pref)-(3 if g[y0][x]=='=' else 0)))
    for yy in range(c.H-c.tb,c.H):g[yy][x]=ch
    # enlaza hacia arriba con un camino si lo hay cerca
    yy=y0;path=[]
    while yy>0 and g[yy][x] in '.,' and len(path)<9:path.append(yy);yy-=1
    if g[yy][x]=='=' and ch=='=':
        for q in path:g[q][x]='='
    return x
def open_right(c,pref,ch='='):
    g=c.g;tr=0
    while all((not walk(g[y][c.W-1-tr])) for y in range(c.tt,c.H-c.tb)):tr+=1
    x0=c.W-1-tr
    cand=[y for y in range(c.tt+1,c.H-c.tb-1) if (x0,y) in c.oldmain and g[y][x0] in '.,=sTdg' and all(g[y][xx] in '#mp' for xx in range(x0+1,c.W)) and g[y-1][x0]!='I' and g[y+1][x0]!='I']
    y=min(cand,key=lambda y:(abs(y-pref)-(3 if g[y][x0]=='=' else 0)))
    for xx in range(x0+1,c.W):g[y][xx]=ch
    xx=x0;path=[]
    while xx>0 and g[y][xx] in '.,' and len(path)<9:path.append(xx);xx-=1
    if g[y][xx]=='=' and ch=='=':
        for q in path:g[y][q]='='
    return y
def validate(c,npcs=(),allow_unreach=lambda x,y,ch:False):
    g=c.g;blockn={(n['x'],n['y']) for n in npcs}
    main=comp(g,c.start,blockn)
    oldpart={p for p in main if p[0]<c.W and p[1]<c.H}
    extra=oldpart-c.oldmain;missing=c.oldmain-oldpart-blockn
    # las casillas del borde viejo que se han abierto no cuentan
    extra={p for p in extra if walk(c.og[p[1]][p[0]])}
    bad=[]
    for y in range(c.H2):
        for x in range(c.W2):
            if (x>=c.W or y>=c.H) and walk(g[y][x]) and (x,y) not in main and (x,y) not in blockn and not allow_unreach(x,y,g[y][x]):bad.append((x,y,g[y][x]))
    # nadie encima de algo que bloquea
    for n in npcs:
        assert walk(g[n['y']][n['x']]),('npc en casilla bloqueada',c.k,n['n'],n['x'],n['y'],g[n['y']][n['x']])
    ok=not extra and not missing and not bad
    print(('OK ' if ok else 'ERR'),c.k,'%dx%d'%(c.W2,c.H2),'extra',sorted(extra)[:6],'missing',sorted(missing)[:6],'unreach',bad[:8])
    return ok
def commit(c):
    c.m['g']=[''.join(r) for r in c.g]
