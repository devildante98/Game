import os
W = os.path.dirname(os.path.abspath(__file__)) + '/'
import json
m=json.load(open(W+'sd_missing.json'))
code=open(W+'spr_tpl.txt',encoding='utf-8').read().replace('@@F@@',json.dumps(m['f'])).replace('@@B@@',json.dumps(m['b']))
open(W+'add_spr.py','w',encoding='utf-8').write(code)
