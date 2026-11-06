// =====================================================================================
// IDIOMA: traductor en tiempo real (se carga solo si el jugador ha elegido otro idioma)
// El juego está escrito en español; este motor cambia los textos de la pantalla según
// el diccionario (I18N.d) en cuanto aparecen, sin tocar la lógica del juego.
//  · texto exacto → diccionario
//  · textos con datos ({} = nombre, número…) → patrones
//  · frases sueltas dentro de textos más largos → trozos conocidos
// =====================================================================================
(function(){
  var W=window,I=W.PGC_I18N;if(!I||!I.d)return;
  var D=I.d,C=new Map(),OUT=new Set(),PB={},PA=[],FI={},SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,NOSCRIPT:1,CODE:1,PRE:1},NOID={newsList:1,newsMl:1,sugList:1};
  var RX=function(s){return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")};
  // ---- patrones con huecos {} / {0} {1} ----
  Object.keys(D).forEach(function(k){
    if(!/\{[nd]?\}/.test(k))return;
    var parts=k.split(/\{[nd]?\}/),kinds=k.match(/\{[nd]?\}/g),src="^"+RX(parts[0]);
    for(var q=0;q<kinds.length;q++)src+=(kinds[q]==="{n}"?"([^,·→+;:(]+?)":kinds[q]==="{d}"?"([\\d.,]+)":"([\\s\\S]+?)")+RX(parts[q+1]);
    var re=new RegExp(src+"$"),pre=parts[0],o={re:re,t:D[k].replace(/\{[nd]\}/g,"{}"),n:kinds.length,len:k.length};
    if(pre.length>=2){var b=pre.slice(0,2);(PB[b]=PB[b]||[]).push(o)}else PA.push(o)});
  var bylen=function(a,b){return b.len-a.len};Object.keys(PB).forEach(function(b){PB[b].sort(bylen)});PA.sort(bylen);
  // ---- trozos (frases de 2+ palabras) indexados por su primera palabra ----
  Object.keys(D).forEach(function(k){
    if(/\{[nd]?\}/.test(k)||k.length<5||!/\s/.test(k.trim()))return;
    var w=k.trim().split(/\s+/)[0];(FI[w]=FI[w]||[]).push(k)});
  Object.keys(FI).forEach(function(w){FI[w].sort(function(a,b){return b.length-a.length})});
  var SP=/[áéíóúñÁÉÍÓÚÑ¿¡]|\b(?:de|la|el|los|las|una?|que|y|en|con|por|para|del|al|tu|tus|su|sus|es|se|te|lo|más|ya|sin|hay|ha|has|puedes|este|esta|cada|todo|todos|aquí|ahora|hoy|vuelve|tienes|pulsa|toca)\b/;
  var spanish=function(s){return SP.test(s.replace(/Pok[ée](?:mon|dex|ball|balls)|Pok[ée] Balls?|Poké/gi,""))};
  function fill(t,g,depth){var i=0;return t.replace(/\{(\d?)\}/g,function(_,n){var v=g[n===""?i:+n];i++;return v==null?"":tr2(v,depth+1)})}
  function tr2(s,depth){if(depth>6)return s;var r=look(s,depth);return r==null?s:r}
  // texto completo: diccionario o patrón
  function full(k,depth){
    var v=D[k];if(v!=null)return v;
    if(k.length<2||!/[A-Za-zÀ-ÿ]/.test(k))return null;
    var L=(PB[k.slice(0,2)]||[]).concat(PA);
    for(var i=0;i<L.length;i++){var m=L[i].re.exec(k);if(m)return fill(L[i].t,m.slice(1),depth||0)}
    return null}
  // sin emojis/números delante o detrás («🐛 Bicho», «Color de ojos 3», «Campeón 🔒»)
  var LEAD=/^[^A-Za-zÀ-ÿ¡¿«(]+/,TRAIL=/[^A-Za-zÀ-ÿ!?»)]+$/;
  function core(k,depth){var a=LEAD.exec(k),b=TRAIL.exec(k),s=a?a[0].length:0,e=b?k.length-b[0].length:k.length;
    if((s===0&&e===k.length)||e<=s)return null;var v=full(k.slice(s,e),depth);return v==null?null:k.slice(0,s)+v+k.slice(e)}
  // por piezas («Bicho · Físico · Poder 80», «3 Poké Ball + 2 Poción», frases separadas por «. »)
  var SEPS=[/( · | \+ | → |; | \| | \/ )/,/(\. |: )/,/(, )/];
  function seg(k,depth,lv){for(var l=lv;l<SEPS.length;l++){var p=k.split(SEPS[l]);if(p.length<3)continue;var ch=false;
      for(var i=0;i<p.length;i+=2){var r=one(p[i],depth,l+1);if(r!=null){p[i]=r;ch=true}}if(ch)return p.join("")}return null}
  function one(k,depth,lv){if(!k||!/[A-Za-zÀ-ÿ]/.test(k))return null;var r=full(k,depth);if(r!=null)return r;r=core(k,depth);if(r!=null)return r;return depth>6?null:seg(k,depth+1,lv)}
  // trozos conocidos dentro de un texto más largo
  function frag(k){
    var out="",pos=0,changed=false,re=/[^\s]+/g,mt;
    while((mt=re.exec(k))){var w=mt[0],c=FI[w];if(!c)continue;
      for(var j=0;j<c.length;j++){var kk=c[j];if(k.substr(mt.index,kk.length)===kk){var nx=k.charAt(mt.index+kk.length);if(nx&&/[A-Za-zÀ-ÿ0-9]/.test(nx))continue;
        out+=k.slice(pos,mt.index)+D[kk];pos=mt.index+kk.length;re.lastIndex=pos;changed=true;break}}}
    return changed?out+k.slice(pos):null}
  function look(k,depth){
    var r=one(k,depth||0,0);
    if(r!=null&&!spanish(r))return r;
    var base=r!=null?r:k;if(!spanish(base))return r;
    if(W.I18N_MISS)W.I18N_MISS.add(k);
    var f=frag(base);return f!=null?f:r}
  function post(s){return s.replace(/[¡¿]/g,"").replace(/\bNv\.?(?=\s?\d)/g,"Lv").replace(/\bPS\b/g,"HP")}
  function T(s){
    if(!s||s.length<2)return s;var c=C.get(s);if(c!==undefined)return c;if(OUT.has(s))return s;
    var m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s),k=m[2],r=look(k,0),res=s;
    if(r!=null)res=m[1]+post(r)+m[3];else if(/[¡¿]|\bNv\.?\s?\d|\bPS\b/.test(k)&&spanish(k)===false)res=m[1]+post(k)+m[3];
    if(res===s&&W.I18N_SAME&&/[A-Za-zÀ-ÿ]{3}/.test(k))W.I18N_SAME.add(k);
    if(/\d[.,]\d/.test(res))res=res.replace(/\d{1,3}(?:\.\d{3})+(?![\d,.])/g,function(x){return x.replace(/\./g,",")}).replace(/(\d),(\d{1,2})(?!\d)/g,"$1.$2");
    if(C.size>40000)C.clear();C.set(s,res);OUT.add(res);if(OUT.size>40000)OUT.clear();return res}
  W.i18nT=T;
  // ---- recorrer el DOM ----
  var ATTR=["placeholder","title","aria-label","alt"];
  function skip(el){for(var e=el;e&&e.nodeType===1;e=e.parentNode){if(SKIP[e.tagName]||e.isContentEditable||e.getAttribute("translate")==="no"||(e.classList&&e.classList.contains("noi18n"))||NOID[e.id])return true}return false}
  function txt(n){var v=n.data;if(!v||v.length<2)return;var r=T(v);if(r!==v)n.data=r}
  function attrs(el){for(var i=0;i<ATTR.length;i++){var a=ATTR[i],v=el.getAttribute(a);if(v&&v.length>1){var r=T(v);if(r!==v)el.setAttribute(a,r)}}
    if(el.tagName==="INPUT"&&/^(button|submit|reset)$/i.test(el.type)&&el.value){var r2=T(el.value);if(r2!==el.value)el.value=r2}}
  function walk(root){
    if(root.nodeType===3){if(!skip(root.parentNode))txt(root);return}
    if(root.nodeType!==1||skip(root))return;
    attrs(root);
    var tw=document.createTreeWalker(root,5,{acceptNode:function(n){if(n.nodeType===1)return SKIP[n.tagName]||n.isContentEditable||n.getAttribute("translate")==="no"||n.classList.contains("noi18n")||NOID[n.id]?2:1;return 1}}),n;
    while((n=tw.nextNode())){if(n.nodeType===3)txt(n);else attrs(n)}}
  var mo=new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var m=ms[i];
    if(m.type==="childList"){for(var j=0;j<m.addedNodes.length;j++)walk(m.addedNodes[j])}
    else if(m.type==="characterData"){if(!skip(m.target.parentNode))txt(m.target)}
    else if(m.type==="attributes"){var el=m.target;if(!skip(el)){var a=m.attributeName,v=el.getAttribute(a);if(v){var r=T(v);if(r!==v)el.setAttribute(a,r)}}}}});
  mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTR});
  walk(document.documentElement);
  document.documentElement.lang=I.lang||"en";
  // ---- textos que no pasan por el DOM: ventanas del navegador y lienzos ----
  ["alert","confirm","prompt"].forEach(function(f){var o=W[f];if(o)W[f]=function(msg){var a=[].slice.call(arguments);if(typeof msg==="string")a[0]=T(msg);return o.apply(W,a)}});
  try{var P=CanvasRenderingContext2D.prototype;["fillText","strokeText","measureText"].forEach(function(f){var o=P[f];P[f]=function(t){var a=[].slice.call(arguments);if(typeof t==="string"&&t.length>1)a[0]=T(t);return o.apply(this,a)}})}catch(e){}
})();
