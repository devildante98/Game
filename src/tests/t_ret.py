import os
import sys
URL=sys.argv[1]
exec(open('t_lib.py').read())
with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':780,'height':900});pg=ctx.new_page();pg.route("**/*",h)
    errs2=[];pg.on('pageerror',lambda e:errs2.append(str(e)[:200]))
    pg.goto(URL);pg.wait_for_timeout(1500);pg.click('#alocal');pg.wait_for_timeout(3000)
    pg.evaluate("()=>{$('welc').hidden=true;S.welc=1;S.owned.Pikachu=3;S.owned['Mega-Rayquaza']=1;S.team=['Pikachu','','','','',''];save()}")
    for k in range(2):
        pg.reload();pg.wait_for_timeout(1500)
        if pg.locator('#alocal').count() and pg.locator('#alocal').is_visible(): pg.click('#alocal')
        pg.wait_for_timeout(3500)
        print('reload',k,errs2[:5],pg.evaluate("()=>[!!$('navb')&&!$('navb').hidden,$('optp')?$('optp').hidden:null]"))
    pg.screenshot(path=SP+'ret.png')
    b.close()
