# genera /i18n/en.js (diccionario + motor) a partir de src/i18n/*.json y src/p_i18n.js
import json,os
B=os.path.dirname(os.path.abspath(__file__))
d={}
for f in ['en_names.json','en_ui.json','en_extra.json']:
    d.update(json.load(open(os.path.join(B,'i18n',f),encoding='utf-8')))
d={k:v for k,v in d.items() if k!=v}
os.makedirs(os.path.join(B,'..','i18n'),exist_ok=True)
js='window.PGC_I18N={lang:"en",d:'+json.dumps(d,ensure_ascii=False,separators=(',',':'))+'};\n'+open(os.path.join(B,'p_i18n.js'),encoding='utf-8').read()
open(os.path.join(B,'..','i18n','en.js'),'w',encoding='utf-8').write(js)
print('i18n en:',len(d),'textos,',len(js.encode())//1024,'KB')
