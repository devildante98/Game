import sys
from core import *
from towns import town
from routes import route,forest,beach
from data import T,RT,FO
L,a,b,M=load()
ok=True;show=sys.argv[1:]
SEED={}
def P(c):
    if c.k in show:print('\n'.join(''.join(r) for r in c.g))
for k in T:
    c,o=town(M,k,T[k]);ok&=o;P(c)
for k in RT:
    c,o=route(M,k,RT[k],SEED.get(k,3));ok&=o;P(c)
c,o=forest(M,'bosque',FO,5);ok&=o;P(c)
c,o=beach(M,'playa',{},2);ok&=o;P(c)
save(L,a,b,M)
print('ALL OK' if ok else 'ERRORS')
