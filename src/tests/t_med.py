import os
from playwright.sync_api import sync_playwright
SP=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')+'/';os.makedirs(SP,exist_ok=True)
import os
HERE=os.path.dirname(os.path.abspath(__file__))
R=os.environ.get('SPRITES_DIR',os.path.join(HERE,'sprites'))+'/'
GAME='file://'+os.path.abspath(os.path.join(HERE,'..','index.html'))
def h(r):
    u=r.request.url
    if u.startswith(("file:","data:")): return r.continue_()
    for pre in ("/sprites@master/sprites/","/sprites/master/sprites/"):
        if pre in u:
            f=R+u.split(pre)[1]
            if os.path.exists(f): return r.fulfill(status=200,headers={"Access-Control-Allow-Origin":"*"},content_type="image/png" if f.endswith("png") else "image/gif",body=open(f,'rb').read())
            return r.fulfill(status=404,body=b"")
    return r.abort()
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1200,'height':900})
    pg.route("**/*",h);pg.on('pageerror',lambda e:print('ERR',e))
    pg.goto(GAME);pg.wait_for_timeout(400);pg.click('#alocal');pg.wait_for_timeout(1800)
    pg.wait_for_timeout(1500);pg.evaluate("()=>{$('welc').hidden=true;$('newsM').hidden=true;S.daily=today();$('strkM').hidden=true;S.med={0:1,1:1,2:1};_gyk='';render()}");pg.wait_for_timeout(1200)
    pg.locator('#gymP').screenshot(path=SP+'med.png')
    b.close()
