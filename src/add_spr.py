# sprites: animados originales (Showdown, desde el repositorio de PokeAPI) con reservas
_a=H.index('const SPRU="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";')
_b=H.index('function icoSVG(p,s){')
H=H[:_a]+r"""const SPRU="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/",SPRU2="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/";
// Sprites originales ANIMADOS de la saga (estilo Pokémon Showdown / Negro y Blanco), de frente y de espaldas.
// Si alguno no existe o no carga, se usa el sprite fijo de 96x96 y, como ultimo recurso, el dibujo de reserva.
const SDNF=new Set([990, 991, 992, 993, 994, 995, 1006, 1008, 1010, 1017, 1022, 1023, 1024, 1025, 10257, 10273, 10274, 10275, 10276, 10277]),SDNB=new Set([990, 991, 992, 993, 994, 995, 1006, 1008, 1010, 1017, 1022, 1023, 1024, 1025, 10195, 10197, 10209, 10210, 10211, 10226, 10257, 10273, 10274, 10275, 10276, 10277]);
let SPRB=(()=>{try{return localStorage.getItem("gacha-spr")==="2"}catch(e){return false}})();
const sprHost=()=>SPRB?SPRU2:SPRU;
function ico(p,s,back,sh){
  const id=window._spr&&window._spr[p[0]];if(!id)return icoSVG(p,s);
  const dn='data-n="'+String(p[0]).replace(/"/g,"&quot;")+'" data-s="'+s+'" data-i="'+id+'"'+(back?' data-b="1"':'')+(sh?' data-sh="1"':''),shp=sh?"shiny/":"";
  if(!(back?SDNB:SDNF).has(id))return '<img class="pk gif'+(sh?' shy':'')+'" src="'+sprHost()+'other/showdown/'+(back?"back/":"")+shp+id+'.gif" style="width:'+s+'px;height:'+s+'px" alt="" loading="lazy" decoding="async" '+dn+' onload="icoLoad(this)" onerror="icoErr(this)">';
  const w=Math.round(s*1.4),mm=Math.round(s*.2);
  return '<img class="pk'+(sh?' shy':'')+'" src="'+sprHost()+(back?"back/":"")+shp+id+'.png" width="'+w+'" height="'+w+'" style="margin:-'+mm+'px" alt="" loading="lazy" decoding="async" '+dn+' onerror="icoErr(this)">';
}
// los animados vienen recortados: en tamaño grande se escalan segun su tamaño real (asi conservan la proporcion entre Pokémon)
function icoLoad(el){
  if(!el.classList.contains("gif"))return;const s=+el.dataset.s||48,nw=el.naturalWidth,nh=el.naturalHeight;if(!nw)return;
  if(s>=70){const k=Math.min(1.6*s/92,s*1.55/Math.max(nw,nh));el.style.width=Math.round(nw*k)+"px";el.style.height=Math.round(nh*k)+"px"}
}
function icoPng(el,host){const s=+el.dataset.s||48,w=Math.round(s*1.4),mm=Math.round(s*.2);el.classList.remove("gif");el.removeAttribute("onload");el.style.width=w+"px";el.style.height=w+"px";el.style.margin="-"+mm+"px";el.src=host+(el.dataset.b?"back/":"")+(el.dataset.sh?"shiny/":"")+el.dataset.i+".png"}
function icoErr(el){
  const src=el.src;
  if(src.indexOf("/other/showdown/")>=0){
    if(src.indexOf(SPRU)===0){SPRB=true;try{localStorage.setItem("gacha-spr","2")}catch(e){}el.src=SPRU2+src.slice(SPRU.length);return}
    icoPng(el,SPRU2);return;
  }
  if(src.indexOf(SPRU)===0){if(!SPRB){SPRB=true;try{localStorage.setItem("gacha-spr","2")}catch(e){}}el.src=SPRU2+src.slice(SPRU.length);return}
  if(src.indexOf("/shiny/")>=0){el.src=src.replace("shiny/","");return}
  if(src.indexOf("/back/")>=0){el.src=src.replace("/back/","/");return}
  el.onerror=null;const p=PM[el.dataset.n];if(p)el.src="data:image/svg+xml,"+encodeURIComponent(icoSVG(p,+el.dataset.s||48).replace("<svg ",'<svg xmlns="http://www.w3.org/2000/svg" '));
}
"""+H[_b:]
H=H.replace("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/","https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/")
H=H.replace(".spr{will-change:transform}",""".spr{will-change:transform}
img.pk.gif{image-rendering:pixelated;object-fit:contain;object-position:50% 100%;margin:0!important}
.spr img.pk.gif{display:block}
#arena .spr img.pk.gif,#arena #msp img.pk.gif,#arena #msp2 img.pk.gif,.bt.dbl .spr img.pk.gif,.bt.dbl #msp img.pk.gif,.bt.dbl #msp2 img.pk.gif{margin:0 auto!important}
.card .em img.pk.gif,.dex img.pk.gif,.slot6 img.pk.gif,.pvtm img.pk.gif,.hcard img.pk.gif{object-position:50% 50%}""")
