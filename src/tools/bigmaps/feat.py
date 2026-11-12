import random,math
def R(x0,y0,x1,y1):return [(x,y) for y in range(y0,y1+1) for x in range(x0,x1+1)]
def put(c,x,y,ch,only=None):
    g=c.g
    if 0<y<c.H2-1 and 0<x<c.W2-1 and (only is None or g[y][x] in only):g[y][x]=ch;return True
    return False
def ellipse(c,cx,cy,rx,ry,ch,only='.,s'):
    for y in range(int(cy-ry)-1,int(cy+ry)+2):
        for x in range(int(cx-rx)-1,int(cx+rx)+2):
            if ((x-cx)/rx)**2+((y-cy)/ry)**2<=1.0:put(c,x,y,ch,only)
def bld(c,kind,x,y,w,h,door=-1):
    for yy in range(y,y+h):
        for xx in range(x,x+w):c.g[yy][xx]='h'
    b={'k':kind,'x':x,'y':y,'w':w,'h':h,'door':door};c.m.setdefault('bld',[]).append(b);return b
# ---- elementos de pueblo (rectángulo inclusivo) ----
def f_park(c,x0,y0,x1,y1,rng):
    cx=(x0+x1)/2;cy=(y0+y1)/2;ellipse(c,cx,cy,(x1-x0)/2-2.2,(y1-y0)/2-1.4,'~')
    for x,y in((x0,y0),(x1,y0),(x0,y1),(x1,y1)):put(c,x,y,'#','.')
    for x,y in((x0+1,y0),(x1-1,y0),(x0+1,y1),(x1-1,y1),(x0,y0+1),(x1,y1-1)):put(c,x,y,',','.')
    put(c,int(cx)-1,y0,'&','.');put(c,int(cx)+2,y1,'&','.');put(c,x0+2,y1,'+','.');put(c,x1-2,y0,'+','.')
def f_plaza(c,x0,y0,x1,y1,rng,center='fountain'):
    for x,y in R(x0+1,y0+1,x1-1,y1-1):put(c,x,y,'=','.,')
    cx=(x0+x1)//2;cy=(y0+y1)//2
    if center=='fountain':bld(c,'fountain',cx-1,cy-1,3,2)
    else:bld(c,'statue',cx,cy-1,1,2)
    for x,y in((x0,y0),(x1,y0),(x0,y1),(x1,y1)):put(c,x,y,'+','.')
    for x in(x0+2,x1-2):put(c,x,y0,'&','.')
    for x in range(x0+1,x1,2):put(c,x,y1,',','.')
def f_orchard(c,x0,y0,x1,y1,rng):
    mid=(x0+x1)//2
    for x in range(x0,x1+1):
        put(c,x,y1,'N','.')
        if abs(x-mid)>1:put(c,x,y0,'N','.')
    for y in range(y0+1,y1):put(c,x0,y,'b','.');put(c,x1,y,'b','.')
    for y in range(y0+2,y1-1,2):
        for x in range(x0+2,x1-1,3):put(c,x,y,';','.')
    for x in range(x0+1,x1,2):put(c,x,y1-1,',','.')
    put(c,mid,y0,'=','.');put(c,mid,y0+1,'=','.')
def f_garden(c,x0,y0,x1,y1,rng):
    for y in range(y0,y1+1,2):
        for x in range(x0+1,x1):put(c,x,y,',','.')
    for x,y in((x0,y0),(x1,y0),(x0,y1),(x1,y1)):put(c,x,y,'b','.,')
    put(c,(x0+x1)//2,(y0+y1)//2|1,'&','.')
def f_grove(c,x0,y0,x1,y1,rng,item=True):
    for x,y in R(x0,y0,x1,y1):
        if (x-x0)%2==0 and (y-y0)%2==0 and rng.random()<.8:put(c,x,y,'#','.')
        elif rng.random()<.12:put(c,x,y,',','.')
    if item:
        x=(x0+x1)//2|1 if (x0%2==0) else ((x0+x1)//2)&~1|1;y=(y0+y1)//2
        if (x-x0)%2==0:x+=1
        put(c,x,y,'I','.,')
def f_stones(c,x0,y0,x1,y1,rng):
    cx=(x0+x1)/2;cy=(y0+y1)/2;rx=(x1-x0)/2-1;ry=(y1-y0)/2-.6
    for i in range(12):
        a=i/12*2*math.pi
        if i%3==1:continue
        put(c,int(round(cx+math.cos(a)*rx)),int(round(cy+math.sin(a)*ry)),'o','.')
    bld(c,'statue',int(cx),int(cy)-1,1,2)
    for x,y in((int(cx)-2,int(cy)+1),(int(cx)+2,int(cy)+1)):put(c,x,y,',','.')
def f_market(c,x0,y0,x1,y1,rng):
    for x,y in R(x0,y0+2,x1,y0+3):put(c,x,y,'=','.,')
    x=x0+1
    while x+2<=x1-1:bld(c,'stall',x,y0,3,2);x+=4
    for x in range(x0+1,x1,3):put(c,x,y1,',','.')
    put(c,x0,y1,'+','.');put(c,x1,y1,'+','.')
def f_lake(c,x0,y0,x1,y1,rng):
    ellipse(c,(x0+x1)/2,(y0+y1)/2,(x1-x0)/2-.8,(y1-y0)/2-.6,'~')
    for x,y in((x0,y0),(x1,y1)):put(c,x,y,'o','.')
    for x,y in((x1,y0),(x0,y1)):put(c,x,y,'#','.')
def f_springs(c,x0,y0,x1,y1,rng):
    w=(x1-x0+1)//2;cy=(y0+y1)/2
    ellipse(c,x0+w/2-.2,cy,w/2-1.3,(y1-y0)/2-1.2,'~');ellipse(c,x0+w+w/2-.2,cy,w/2-1.3,(y1-y0)/2-1.2,'~')
    for x,y in((x0,y0),(x1,y0),(x0,y1),(x1,y1),((x0+x1)//2,y0),((x0+x1)//2,y1)):put(c,x,y,'o','.')
    put(c,(x0+x1)//2,int(cy),'&','.')
def f_meadow(c,x0,y0,x1,y1,rng):
    for x,y in R(x0,y0,x1,y1):
        r=rng.random()
        if r<.3:put(c,x,y,',','.')
    for x,y in((x0,y0),(x1,y1)):put(c,x,y,'#','.,')
def f_faro(c,x0,y0,x1,y1,rng):
    cx=(x0+x1)//2;bld(c,'faro',cx,y0,2,4)
    for x in(cx-2,cx+3):put(c,x,y0+3,',','.')
    put(c,cx-1,y1,'&','.');put(c,cx+3,y1,'+','.')
FEAT={'park':f_park,'plaza':f_plaza,'statue':lambda c,*a:f_plaza(c,*a,center='statue'),'orchard':f_orchard,'garden':f_garden,'grove':f_grove,'stones':f_stones,'market':f_market,'lake':f_lake,'springs':f_springs,'meadow':f_meadow,'faro':f_faro}
