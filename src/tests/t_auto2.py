import os
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'t_med.py')).read().split("with sync_playwright")[0])
import random,time
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1100,'height':900})
    pg.route("**/*",h);pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('C:'+m.text[:300]) if m.type in ('error','warning') and 'Failed to load' not in m.text and 'ERR_' not in m.text else None)
    pg.add_init_script("(()=>{const o=CanvasGradient.prototype.addColorStop;CanvasGradient.prototype.addColorStop=function(a,c){if(c===undefined||c===null||c==='undefined'){console.error('BADCOLOR '+new Error().stack.split('\\n').slice(1,5).join(' | '))}return o.call(this,a,c||'#000')}})()");pg.on('console',lambda m:print(m.text[:600]) if 'BADCOLOR' in m.text else None)
    pg.goto(GAME);pg.wait_for_timeout(400);pg.click('#alocal');pg.wait_for_timeout(2500)
    pg.evaluate("()=>{$('welc').hidden=true;$('newsM').hidden=true;S.daily=today();$('strkM').hidden=true;S.med={0:1,1:1,2:1,3:1,4:1,5:1,6:1,7:1};['Charizard','Blastoise','Gengar','Pikachu'].forEach(n=>{S.owned[n]=1;S.lv[n]={l:50,x:0};S.hp[n]=stH(PM[n],50)});S.team=['Charizard','Blastoise','Gengar','Pikachu','',''];S.bag.ub=20;S.bag.pb=20;BS=3;save();updTeam();render()}")
    done=0;t0=time.time()
    for k in range(3):
        pg.evaluate("()=>{Object.keys(S.hp).forEach(n=>{if(PM[n])S.hp[n]=stH(PM[n],lvd(n).l)});fcd=false;B=null;startBattle()}")
        st=time.time()
        last=''
        while time.time()-st<60:
            pg.wait_for_timeout(400)
            # pulsa para avanzar dialogos
            pg.evaluate("()=>{const f=$('fmsg');if(f)f.click()}")
            r=pg.evaluate("()=>{if(!B)return 'end';if(B.busy)return 'busy';const bs=[...document.querySelectorAll('#menu button')].filter(x=>!x.disabled);if(!bs.length)return 'none';return bs.map(x=>x.dataset.k).join(',')}")
            last=r
            if r=='end': break
            if r=='busy':
                lk=pg.evaluate("()=>{const x=[...document.querySelectorAll('#menu button')].filter(b=>!b.disabled&&b.dataset.k&&b.dataset.k.startsWith('l:'));return x.length?x[0].dataset.k:''}")
                if lk: pg.click('#menu button[data-k="%s"]'%lk)
                continue
            if r in('busy','none'):
                if r=='none' and pg.evaluate("()=>$('arena').hidden"): break
                continue
            ks=r.split(',')
            if '9' in ks: pg.click('#menu button[data-k="9"]');continue
            choice=None
            moves=[x for x in ks if x.startswith('m')]
            sw=[x for x in ks if x.startswith('s:')]
            roll=random.random()
            if sw and not moves: choice=sw[0]
            elif roll<.12 and 'e' in ks: choice='e'
            elif roll<.22 and 'b' in ks: choice='b'
            elif moves: choice=random.choice(moves)
            elif 'main' in ks: choice='main'
            else: choice=ks[0]
            if choice=='b':
                pg.click('#menu button[data-k="b"]');pg.wait_for_timeout(200)
                it=pg.evaluate("()=>[...document.querySelectorAll('#menu button')].map(x=>x.dataset.k).find(k=>k&&(k==='i:ub'||k==='i:pb'))")
                pg.click('#menu button[data-k="%s"]'%(it or 'main'))
            elif choice=='e':
                pg.click('#menu button[data-k="e"]');pg.wait_for_timeout(200)
                s2=pg.evaluate("()=>{const x=[...document.querySelectorAll('#menu button')].filter(b=>!b.disabled&&b.dataset.k&&b.dataset.k.startsWith('s:'));return x.length?x[0].dataset.k:'main'}")
                pg.click('#menu button[data-k="%s"]'%s2)
            else:
                pg.click('#menu button[data-k="%s"]'%choice)
        if time.time()-st>=60: print('HANG',last,pg.evaluate("()=>[B&&B.busy,B&&B.E&&B.E.over,$('fmsg').innerText,$('menu').innerHTML.slice(0,300),[...document.querySelectorAll('#arena .spr')].map(e=>e.id+':'+e.style.opacity+':'+e.className)]"));pg.locator('#arena').screenshot(path=os.path.join(os.path.dirname(os.path.abspath(__file__)),'hang.png'));break
        done+=1
        print('battle',k,'ok',round(time.time()-st,1),'s', pg.evaluate("()=>[!!B,$('arena').hidden]"))
    b.close()
print('errors',errs[:5])
