import os
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'t_med.py')).read().split("with sync_playwright")[0])
import random,time
SP=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/';os.makedirs(SP,exist_ok=True)
errs=[];logs=[]
def drive(pg,lim=90):
    st=time.time()
    while time.time()-st<lim:
        pg.wait_for_timeout(300)
        pg.evaluate("()=>{const f=$('fmsg');if(f)f.click()}")
        r=pg.evaluate("()=>{if(!B)return 'end';if(B.busy)return 'busy';const bs=[...document.querySelectorAll('#menu button')].filter(x=>!x.disabled);if(!bs.length)return 'none';return bs.map(x=>x.dataset.k).join(',')}")
        if r=='end': return 'end'
        if r=='busy':
            lk=pg.evaluate("()=>{const x=[...document.querySelectorAll('#menu button')].filter(b=>!b.disabled&&b.dataset.k&&b.dataset.k.startsWith('l:'));return x.length?x[0].dataset.k:''}")
            if lk: pg.click('#menu button[data-k="%s"]'%lk)
            continue
        if r=='none': continue
        ks=r.split(',')
        if '9' in ks: pg.click('#menu button[data-k="9"]');return 'done'
        moves=[x for x in ks if x.startswith('m')];sw=[x for x in ks if x.startswith('s:')]
        c=sw[0] if sw and not moves else (random.choice(moves) if moves else ('main' if 'main' in ks else ks[0]))
        pg.click('#menu button[data-k="%s"]'%c)
    return 'HANG'
