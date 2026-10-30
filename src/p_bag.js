// ================= mochila fuera de combate =================
let _bk="",useId=null,evoBusy=false;
const mxOf=n=>stH(PM[n],lvd(n).l);
const evoReadyList=()=>Object.keys(S.owned).filter(n=>S.owned[n]>0&&PM[n]&&S.lv[n]&&evoLvReady(n).length);
function bagUI(){
  const have=ITEMS.filter(it=>(S.bag[it[0]]||0)>0),er=evoReadyList(),key=have.map(it=>it[0]+":"+S.bag[it[0]]).join("|")+"|"+useId+"|"+er.join(",");
  if(key===_bk)return;_bk=key;
  $("evoReady").innerHTML=er.length?'<div class="lgnow"><b>🧬 ¡Pueden evolucionar!</b><small class="mut">Han alcanzado el nivel necesario. Puedes evolucionarlos ahora o esperar.</small><div class="frl">'+er.map(n=>'<div class="pvrow"><span class="pvav">'+ico(PM[n],34)+'</span><b>'+esc(n)+' <small>Nv'+lvd(n).l+'</small></b><span style="flex:1;color:var(--mute);font-size:.85rem">→ '+evoLvReady(n).map(e=>esc(e[0])).join(" / ")+'</span><button data-evo="'+esc(n)+'">🧬 Evolucionar</button></div>').join("")+'</div></div>':"";
  $("bgrid").innerHTML=have.length?have.map(it=>'<div class="btile'+(useId===it[0]?' sel':'')+'"><span class="iico big">'+itemIco(it[0],52)+'</span><div class="bti"><b>'+it[1]+' <span class="bcnt">×'+S.bag[it[0]]+'</span></b><small class="mut">'+it[6]+'</small>'+(it[3]===0&&it[7]!=="crys"?'<button data-use="'+it[0]+'">'+(it[7]==="hold"?"Equipar":"Usar")+'</button>':'<small class="mut">Se usa en combate</small>')+'</div></div>').join(""):'<small class="mut">Tu mochila está vacía. Consigue objetos ganando combates o cómpralos en la tienda.</small>';
}
function candList(){
  const q=nrm($("bcQ").value.trim()),cap=lvCap(),own=P.filter(p=>S.owned[p[0]]&&lvd(p[0]).l<cap&&nrm(p[0]).includes(q)).sort((a,b)=>((S.team.includes(b[0])?1:0)-(S.team.includes(a[0])?1:0))||(lvd(b[0]).l-lvd(a[0]).l));
  $("bcS").innerHTML=own.slice(0,300).map(p=>'<option value="'+esc(p[0])+'">'+esc(p[0])+' · Nv'+lvd(p[0]).l+(S.team.includes(p[0])?' ⭐':'')+'</option>').join("");
  if(own.length)$("bcS").selectedIndex=0;
}
function useUI(msg){
  $("bagMsg").textContent=msg||"";
  const q=$("buse"),it=ITEMS.find(i=>i[0]===useId);
  if(!it||!(S.bag[useId]>0)){q.hidden=true;useId=null;_bk="";bagUI();return}
  q.hidden=false;
  let h='<div class="buse-h"><span class="iico">'+itemIco(it[0],40)+'</span><b>'+it[1]+' ×'+S.bag[useId]+'</b><button class="alt" id="buClose">✕ Cerrar</button></div>';
  if(it[7]==="hold"){h+=holdPickHTML(useId)}
  else if(it[7]==="evo"){
    const L=P.filter(p=>S.owned[p[0]]&&evoByItem(p[0],useId).length);
    h+=L.length?'<div class="bul">'+L.map(p=>'<button class="bunit" data-bev="'+esc(p[0])+'">'+ico(p,30)+'<span><b>'+esc(p[0])+'</b> <small>Nv'+lvd(p[0]).l+' → '+evoByItem(p[0],useId).map(e=>esc(e[0])).join(" / ")+'</small></span></button>').join("")+'</div>':'<small class="mut">Ninguno de tus Pokémon evoluciona con este objeto. Lo usan: '+esc(evoUsers(useId))+'.</small>';
  }
  else if(useId==="cand"){
    h+='<div class="sets-row"><input id="bcQ" placeholder="Buscar Pokémon..." aria-label="Buscar Pokémon"><select id="bcS" size="6" aria-label="Pokémon que recibirá el caramelo" style="width:100%"></select></div><div class="sets-row"><label>Cantidad <input id="bcN" type="number" min="1" value="1" style="width:80px"></label><button class="red" id="bcGo">Usar Caramelo Raro</button></div>'+(lvCap()<100?'<small class="mut">🔒 Límite de nivel actual: Nv'+lvCap()+'. '+esc(capWhy())+'</small>':'');
  }else if(PPI[useId]||useId==="ppup"||useId==="ppmax"){
    const one=useId==="ppup"||useId==="ppmax"||PPI[useId].one;
    h+='<div class="sets-row"><input id="bpQ" placeholder="Buscar Pokémon..." aria-label="Buscar Pokémon"><select id="bpS" size="6" aria-label="Pokémon" style="width:100%"></select></div>'+(one?'<div class="sets-row"><select id="bpM" aria-label="Movimiento" style="width:100%"></select></div>':'')+'<div class="sets-row"><button class="red" id="bpGo">Usar '+it[1]+'</button></div>';
  }else{
    const el=Object.keys(S.hp).filter(n=>S.owned[n]&&PM[n]&&(it[5]?S.hp[n]<=0:(S.hp[n]>0&&S.hp[n]<mxOf(n))));
    h+=el.length?'<div class="bul">'+el.map(n=>'<button class="bunit" data-bu="'+esc(n)+'">'+ico(PM[n],30)+'<span><b>'+esc(n)+'</b> <small>Nv'+lvd(n).l+' · PS '+S.hp[n]+'/'+mxOf(n)+'</small></span></button>').join("")+'</div>':'<small class="mut">Ningún Pokémon necesita este objeto ahora mismo.</small>';
  }
  h+='<small id="buMsg" class="mut">'+(msg||"")+'</small>';
  q.innerHTML=h;
  if(useId==="cand"){candList();$("bcQ").oninput=candList}
  if(it[7]==="hold"&&$("bhQ")){$("bhQ").oninput=()=>holdList(useId)}
  if($("bpS")){ppList();$("bpQ").oninput=ppList;$("bpS").onchange=ppMoves}
  _bk="";bagUI();
}
function ppList(){
  const q=nrm($("bpQ").value.trim()),up=useId==="ppup"||useId==="ppmax",own=P.filter(p=>S.owned[p[0]]&&nrm(p[0]).includes(q)&&(up||ppLow(p[0]))).sort((a,b)=>((S.team.includes(b[0])?1:0)-(S.team.includes(a[0])?1:0))||(lvd(b[0]).l-lvd(a[0]).l));
  $("bpS").innerHTML=own.slice(0,300).map(p=>'<option value="'+esc(p[0])+'">'+esc(p[0])+' · Nv'+lvd(p[0]).l+(S.team.includes(p[0])?' ⭐':'')+'</option>').join("");
  if(own.length)$("bpS").selectedIndex=0;ppMoves();
}
function ppMoves(){
  const m=$("bpM"),n=$("bpS").value;if(!m)return;
  m.innerHTML=n?moves(PM[n]).map((mv,j)=>'<option value="'+j+'">'+esc(mv.n)+' · PP '+ppCur(n,mv.id)+'/'+ppMax(n,mv.id)+(useId==="ppup"||useId==="ppmax"?' (mejoras '+ppUps(n,mv.id)+'/3)':'')+'</option>').join(""):"";
}
async function evoFromBag(n,list,item){
  if(evoBusy||fcd)return;evoBusy=true;
  try{const ok=await evoPrompt(n,list);if(ok&&item){S.bag[item]=Math.max(0,(S.bag[item]||0)-1);save()}}finally{evoBusy=false}
  _bk="";useUI(useId?"":"");render();
}
$("evoReady").addEventListener("click",e=>{const b=e.target.closest("button");if(b&&b.dataset.evo){if(fcd){$("bagMsg").textContent="Termina el combate antes de evolucionar.";return}evoFromBag(b.dataset.evo,evoLvReady(b.dataset.evo),null)}});
$("bgrid").addEventListener("click",e=>{const b=e.target.closest("button");if(b&&b.dataset.use){useId=b.dataset.use;useUI("");snd("ui")}});
$("buse").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.id==="buClose"){useId=null;useUI();return}
  const it=ITEMS.find(i=>i[0]===useId);if(!it)return;
  if(b.dataset.bev){if(fcd){useUI("Termina el combate antes de evolucionar.");return}evoFromBag(b.dataset.bev,evoByItem(b.dataset.bev,useId),useId);return}
  if(b.dataset.beq){const r=holdEquip(b.dataset.beq,useId);useUI(r);return}
  if(b.dataset.bu){
    const n=b.dataset.bu,mx=mxOf(n);let hp=S.hp[n]===undefined?mx:S.hp[n];
    if(it[5]){if(hp>0)return;hp=Math.round(mx*it[5]/100)}else{if(hp<=0||hp>=mx)return;hp=Math.min(mx,hp+Math.round(mx*it[4]/100))}
    if(hp>=mx)delete S.hp[n];else S.hp[n]=hp;
    S.bag[useId]--;save();snd("heal");render();useUI(n+" "+(it[5]?"ha revivido":"recupera PS")+" ("+Math.min(hp,mx)+"/"+mx+").");return;
  }
  if(b.id==="bpGo"){
    const n=$("bpS").value;if(!n){useUI("Elige un Pokémon de la lista.");return}
    const ms=moves(PM[n]),j=$("bpM")?+$("bpM").value:-1,pp=PPI[useId];
    if(useId==="ppup"||useId==="ppmax"){
      const mv=ms[j];if(!mv)return;const u=ppUps(n,mv.id);if(u>=3){useUI("Ese movimiento ya tiene los PP al máximo.");return}
      const c=ppCur(n,mv.id),x0=ppMax(n,mv.id);S.ppu=S.ppu||{};(S.ppu[n]=S.ppu[n]||{})[mv.id]=useId==="ppmax"?3:u+1;ppSet(n,mv.id,c+ppMax(n,mv.id)-x0);
      S.bag[useId]--;save();snd("lvl");render();useUI("Los PP máximos de "+mv.n+" de "+n+" suben a "+ppMax(n,mv.id)+".");return;
    }
    const L=pp.one?[ms[j]]:ms;let tot=0;
    L.forEach(m=>{if(!m)return;const c=ppCur(n,m.id),nv=Math.min(ppMax(n,m.id),c+pp.amt);tot+=nv-c;ppSet(n,m.id,nv)});
    if(!tot){useUI("No hace falta: esos PP ya están al máximo.");return}
    S.bag[useId]--;save();snd("heal");render();useUI(n+" recupera "+tot+" PP.");return;
  }
  if(b.id==="bcGo"){
    const n=$("bcS").value;if(!n){useUI("Elige un Pokémon de la lista.");return}
    const d=lvd(n);moveIds(n);
    const room=lvCap()-d.l;if(room<=0){useUI(n+" ya está en el límite de nivel (Nv"+lvCap()+"). "+capWhy());return}
    const q=Math.max(1,Math.min(Math.floor(+$("bcN").value)||1,S.bag.cand,room)),l0=d.l;
    d.l+=q;d.x=0;S.bag.cand-=q;qEv("lvl",q);
    if(S.hp[n]!==undefined)S.hp[n]=Math.min(mxOf(n),S.hp[n]+8*q);
    save();snd("lvl");render();
    const pend=learn(n).filter(x=>x[0]>(S.ml[n]==null?l0:S.ml[n])&&x[0]<=d.l&&!moveIds(n).includes(x[1])).length;
    useUI(n+" sube de Nv"+l0+" a Nv"+d.l+"."+(pend>0?" Puede aprender "+pend+" movimiento(s) nuevo(s): se le ofrecerán al llevarlo a combate.":"")+(evoLvReady(n).length?" ¡Ya puede evolucionar! Míralo arriba en «Pueden evolucionar».":""));
  }
});
