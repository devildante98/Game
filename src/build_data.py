import csv, json, re, collections
import os
W = os.path.dirname(os.path.abspath(__file__)) + '/'
C = os.environ.get('POKEAPI_CSV', W + 'pokeapi_csv/')
def rd(n): return list(csv.DictReader(open(C + n + '.csv', encoding='utf-8')))
G = json.load(open(W+'pdata.json'))
P = G['P']; SPR = G['spr']; REN = G['ren']
INV_REN = {v: k for k, v in REN.items()}  # spanish form name -> english form name

TYPES = {1:'normal',2:'fighting',3:'flying',4:'poison',5:'ground',6:'rock',7:'bug',8:'ghost',9:'steel',10:'fire',11:'water',12:'grass',13:'electric',14:'psychic',15:'ice',16:'dragon',17:'dark',18:'fairy'}
TK = {'normal':'n','fire':'f','water':'w','grass':'g','electric':'e','psychic':'p','ghost':'h','dragon':'d','bug':'b','poison':'x','rock':'r','ground':'o','fighting':'t','fairy':'y','ice':'i','flying':'a','steel':'s','dark':'k'}

pokemon = {int(r['id']): r for r in rd('pokemon')}
species = {int(r['id']): r for r in rd('pokemon_species')}
spname_en = {}
for r in rd('pokemon_species_names'):
    if r['local_language_id'] == '9': spname_en[int(r['pokemon_species_id'])] = r['name']
spid_by_en = {v: k for k, v in spname_en.items()}

# ---------- stats ----------
bst = collections.Counter()
for r in rd('pokemon_stats'): bst[int(r['pokemon_id'])] += int(r['base_stat'])

# ---------- moves ----------
moves = {int(r['id']): r for r in rd('moves')}
meta = {int(r['move_id']): r for r in rd('move_meta')}
mstat = collections.defaultdict(list)
for r in rd('move_meta_stat_changes'): mstat[int(r['move_id'])].append((int(r['stat_id']), int(r['change'])))
mname = {}; mname_en = {}
for r in rd('move_names'):
    if r['local_language_id'] == '7': mname[int(r['move_id'])] = r['name']
    if r['local_language_id'] == '9': mname_en[int(r['move_id'])] = r['name']

STAT = {2:'atk',3:'def',4:'atk',5:'def',6:'spe',7:'acc',8:'eva'}
AIL = {1:'par',2:'slp',3:'frz',4:'brn',5:'psn',6:'cnf'}
PROTECT = {'protect','detect','kings-shield','spiky-shield','baneful-bunker','obstruct','silk-trap','burning-bulwark','max-guard'}
FIXED = {'sonic-boom':'F20','dragon-rage':'F40','seismic-toss':'L','night-shade':'L','psywave':'L','super-fang':'H','natures-madness':'H','ruination':'H'}
EXCL_DMG = {'counter','mirror-coat','metal-burst','bide','endeavor','final-gambit','comeuppance','present','fling','natural-gift','spit-up','beat-up','belch','last-resort','dream-eater','synchronoise','snore','sleep-talk','focus-punch','shell-trap','steel-beam'}
KAMI = {'self-destruct','explosion','misty-explosion','memento','healing-wish','lunar-dance'}
BEAM = re.compile(r'beam|pump|thrower|pulse|ray|cannon|blast|wave|breath|spray|gun|jet|stream|laser|hydro|bubble-beam|aurora')
CONTACT = re.compile(r'punch|kick|tackle|slam|bite|fang|claw|slash|cut|horn|peck|wing|tail|head|body|strike|smash|chop|jab|fist|blade|edge|crash|rush|charge|knuckle|hammer|lash|whip|scratch|pound|stomp|drill|rollout|thrash|take-down|double-edge|return|facade|quick|extreme|fury|bash|ram|bulldoze|fling|uppercut|hit|leaf-blade|x-scissor|night-slash')
SKY = re.compile(r'^thunder$|thunderbolt|^thunder-|bolt-strike|hurricane|blizzard|meteor|draco|hail|^fire-blast|sky|leaf-storm|spacial|fissure|rock-slide|stone-edge|avalanche|outrage')
AREA = re.compile(r'quake|surf|storm|eruption|heat-wave|magnitude|bulldoze|discharge|lava|boom|explosion|self-destruct|petal-dance|hyper-voice|boomburst|sludge-wave|muddy|snarl|icy-wind|razor-wind|gust|twister|whirlpool|sand-tomb|dazzling')
ORB = re.compile(r'ball|bomb|shot|orb|sphere|seed|sludge|shadow|moon|dark-pulse|aura|bullet|mist-ball|energy|focus|power-gem|ancient|zap|spore|powder')

def move_rec(mid):
    m = moves[mid]; me = meta.get(mid)
    ident = m['identifier']
    if int(m['type_id']) not in TYPES: return None
    cls = int(m['damage_class_id'])  # 1 status 2 phys 3 spec
    pw = int(m['power']) if m['power'] else None
    acc = int(m['accuracy']) if m['accuracy'] else 0  # 0 = never misses
    pp = int(m['pp']) if m['pp'] else 10
    prio = int(m['priority'])
    tgt = int(m['target_id'])
    cat = int(me['meta_category_id']) if me else -1
    ail = int(me['meta_ailment_id']) if me else 0
    E = []
    if ident in PROTECT: E.append('p')
    elif ident == 'rest': E.append('R')
    elif cls == 1:
        ok = False
        if me and int(me['healing'] or 0) > 0: E.append('h%d' % int(me['healing'])); ok = True
        if me and ail in AIL and tgt not in (7,):
            ch = int(me['ailment_chance'] or 0) or 100
            a = AIL[ail]
            if ident == 'toxic': a = 'tox'
            E.append('a%s%d' % (a, ch)); ok = True
        sc = mstat.get(mid)
        if sc:
            st = [(STAT[s], c) for s, c in sc if s in STAT]
            if st:
                self_t = tgt in (7, 13, 4, 5, 15, 3)
                E.append(('S' if self_t else 'T') + ','.join('%s%+d' % x for x in st) + ':%d' % ((int(me['stat_chance'] or 0) if me else 0) or 100)); ok = True
        if ident in KAMI: return None
        if not ok: return None
    else:
        if ident in EXCL_DMG: return None
        if cat == 9: return None  # OHKO
        if pw is None:
            if ident in FIXED: E.append(FIXED[ident]); pw = 1
            else: pw = 60
        if me:
            hmin = int(me['min_hits']) if me['min_hits'] else 0
            hmax = int(me['max_hits']) if me['max_hits'] else 0
            if hmax > 1: E.append('m%d-%d' % (hmin or hmax, hmax))
            dr = int(me['drain'] or 0)
            if dr > 0: E.append('d%d' % dr)
            elif dr < 0: E.append('r%d' % -dr)
            if int(me['healing'] or 0) > 0: E.append('h%d' % int(me['healing']))
            if ail in AIL and int(me['ailment_chance'] or 0) > 0:
                a = AIL[ail]
                if ident == 'poison-fang': a = 'tox'
                E.append('a%s%d' % (a, int(me['ailment_chance'])))
            fc = int(me['flinch_chance'] or 0)
            if fc: E.append('f%d' % fc)
            if int(me['crit_rate'] or 0) > 0: E.append('c')
            sc = mstat.get(mid)
            if sc:
                st = [(STAT[s], c) for s, c in sc if s in STAT]
                if st:
                    self_t = cat == 7
                    E.append(('S' if self_t else 'T') + ','.join('%s%+d' % x for x in st) + ':%d' % ((int(me['stat_chance'] or 0) if me else 0) or 100))
        if ident in KAMI: E.append('x')
        if ident in ('hyper-beam','giga-impact','blast-burn','hydro-cannon','frenzy-plant','rock-wrecker','roar-of-time','prismatic-laser','eternabeam','meteor-assault'): E.append('z')
    # fx style
    if cls == 1: fx = 's'
    elif SKY.search(ident): fx = 'k'
    elif AREA.search(ident): fx = 'w'
    elif BEAM.search(ident) and cls == 3: fx = 'b'
    elif re.search(r'claw|slash|cut|scissor|blade|razor|cross-chop|night-slash|leaf-blade|psycho-cut|fury-swipes|scratch|aerial-ace|air-slash', ident) and cls == 2: fx = 'l'
    elif re.search(r'punch|kick|fist|knuckle|hammer|chop|jab|uppercut|stomp|smash|hit', ident) and cls == 2: fx = 'u'
    elif re.search(r'bite|fang|crunch|jaw|chomp', ident): fx = 'i'
    elif CONTACT.search(ident) or (cls == 2 and not ORB.search(ident) and not BEAM.search(ident)): fx = 'c'
    elif BEAM.search(ident): fx = 'b'
    else: fx = 'o'
    name = mname.get(mid) or mname_en.get(mid) or ident
    return [mid, name, TK[TYPES[int(m['type_id'])]], pw or 0, acc, pp, prio, cls - 1, fx, ' '.join(E)]

# ---------- learnsets ----------
VG_PREF = [25, 27, 26, 20, 21, 22, 23, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 24, 19]
lv = collections.defaultdict(lambda: collections.defaultdict(list))  # pid -> vg -> [(lvl, mid)]
for r in rd('pokemon_moves'):
    if r['pokemon_move_method_id'] != '1': continue
    lv[int(r['pokemon_id'])][int(r['version_group_id'])].append((int(r['level'] or 0), int(r['move_id'])))

MREC = {}
def mr(mid):
    if mid not in MREC: MREC[mid] = move_rec(mid)
    return MREC[mid]

def learnset(pid):
    d = lv.get(pid)
    if not d: return None
    for vg in VG_PREF:
        if vg in d:
            seen = {}; out = []
            for l, mid in sorted(d[vg]):
                if mr(mid) is None: continue
                if mid in seen: continue
                seen[mid] = 1; out.append((max(1, l), mid))
            return out
    return None

FALLBACK = {'normal':'pound','fire':'ember','water':'water-gun','grass':'vine-whip','electric':'thunder-shock','psychic':'confusion','ghost':'shadow-sneak','dragon':'dragon-breath','bug':'bug-bite','poison':'poison-sting','rock':'rock-throw','ground':'mud-slap','fighting':'rock-smash','fairy':'fairy-wind','ice':'powder-snow','flying':'gust','steel':'metal-claw','dark':'bite'}
mid_by_ident = {m['identifier']: i for i, m in moves.items()}

def species_of_pid(pid): return int(pokemon[pid]['species_id'])
def default_pid(sid):
    for p in pokemon.values():
        if int(p['species_id']) == sid and p['is_default'] == '1': return int(p['id'])
    return sid

LS = {}
for p in P:
    name, ty = p[0], p[1]
    pid = SPR[name]
    ls = learnset(pid)
    if not ls:
        ls = learnset(default_pid(species_of_pid(pid))) if pid in pokemon else None
    ls = ls or []
    if len(ls) < 2:
        fb = [mid_by_ident['tackle'], mid_by_ident[FALLBACK[ty]]]
        have = {m for _, m in ls}
        for i, f in enumerate(fb):
            if f not in have and mr(f): ls.append((1 + i * 5, f))
        ls.sort()
    LS[name] = ls

used = sorted({m for ls in LS.values() for _, m in ls})
print('moves used', len(used), 'avg learnset', sum(len(v) for v in LS.values()) / len(LS))
MIDX = {m: i for i, m in enumerate(used)}
def b36(n, w):
    s = ''
    a = '0123456789abcdefghijklmnopqrstuvwxyz'
    while n: s = a[n % 36] + s; n //= 36
    return s.rjust(w, '0')

MOVE_OUT = [mr(m) for m in used]
LS_OUT = {}
dedupe = {}
for name, ls in LS.items():
    s = ''.join(b36(l, 2) + b36(MIDX[m], 2) for l, m in ls)
    LS_OUT[name] = s

# ---------- rarity + dex ----------
LEGSET = {p[0] for p in P if p[2] == 'L' and p[3] != 10}
EN_NAME = {}
for p in P:
    EN_NAME[p[0]] = INV_REN.get(p[0], p[0])
rar = {}
dexno = {}
evo_from = {}
for sid, s in species.items():
    if s['evolves_from_species_id']: evo_from[sid] = int(s['evolves_from_species_id'])

def rar_of_bst(b):
    return 'C' if b < 420 else 'R' if b < 500 else 'E'
ORDER = 'CREML'
# etapa evolutiva: 0 = basico, 1 = primera evolucion, 2 = segunda; fam = numero de etapas de su familia
kids = collections.defaultdict(list)
for c, par in evo_from.items(): kids[par].append(c)
def depth(sid):
    d = 0
    while sid in evo_from: sid = evo_from[sid]; d += 1
    return d
def root(sid):
    while sid in evo_from: sid = evo_from[sid]
    return sid
def height(sid):
    return 0 if not kids[sid] else 1 + max(height(k) for k in kids[sid])
def rar_stage(sid, b):
    d, n = depth(sid), height(root(sid)) + 1
    if n == 1: return rar_of_bst(b)                     # sin evoluciones: segun su poder
    if d == 0: return 'C'                               # basico: comun
    if n == 2: return 'R' if b < 500 else 'E'           # 2 etapas: rara o epica segun su poder
    if d == 1: return 'R'                               # 3 etapas: la intermedia es rara
    return 'E' if b >= 470 else 'R'                     # 3 etapas: la final es epica (salvo las muy debiles)
for p in P:
    pid = SPR[p[0]]
    sid = species_of_pid(pid) if pid in pokemon else spid_by_en.get(p[0])
    s = species[sid]
    is_form = p[3] == 10
    dexno[p[0]] = sid
    if s['is_legendary'] == '1' or s['is_mythical'] == '1' or p[0] in LEGSET:
        r = 'L'
    else:
        r = rar_stage(sid, bst[sid])
        en = EN_NAME[p[0]]
        if is_form and (en.startswith('Mega ') or en.startswith('Gigantamax ') or en.startswith('Primal ')): r = 'M'
    rar[p[0]] = r
name_by_sid = {}
for p in P:
    if p[3] != 10: name_by_sid[dexno[p[0]]] = p[0]
# las formas (regionales, etc.) tienen la misma rareza que su especie, salvo Mega/Gigamax/Primigenia
for p in P:
    if p[3] == 10 and rar[p[0]] not in ('M','L'):
        base = name_by_sid.get(dexno[p[0]])
        if base: rar[p[0]] = rar[base]
print(collections.Counter(rar.values()))
bad = [(name_by_sid[par], name_by_sid[sid]) for sid, par in evo_from.items() if par in name_by_sid and sid in name_by_sid and ORDER.index(rar[name_by_sid[sid]]) < ORDER.index(rar[name_by_sid[par]])]
print('bad', bad)
for n in ['Bulbasaur','Ivysaur','Venusaur','Caterpie','Metapod','Butterfree','Pidgey','Pidgeotto','Pidgeot','Rattata','Raticate','Pichu','Pikachu','Raichu','Eevee','Vaporeon','Magikarp','Gyarados','Ditto','Lapras','Tauros','Snorlax','Munchlax','Dratini','Dragonair','Dragonite','Abra','Kadabra','Alakazam','Carkol','Rolycoly','Coalossal']:
    print(n, rar.get(n), end='; ')
print()

# form order within species
form_ord = {}
cnt = collections.Counter()
for p in P:
    if p[3] == 10:
        cnt[dexno[p[0]]] += 1; form_ord[p[0]] = cnt[dexno[p[0]]]
RD = {p[0]: [dexno[p[0]], rar[p[0]], form_ord.get(p[0], 0)] for p in P}

# ---------- evolutions ----------
items = {int(r['id']): r['identifier'] for r in rd('items')}
iname = {}
for r in rd('item_names'):
    if r['local_language_id'] == '7': iname[int(r['item_id'])] = r['name']
evo = collections.defaultdict(list)
for r in rd('pokemon_evolution'):
    child = int(r['evolved_species_id'])
    if child not in evo_from: continue
    par = evo_from[child]
    a = name_by_sid.get(par); b = name_by_sid.get(child)
    if not a or not b: continue
    trig = int(r['evolution_trigger_id'])
    meth = None
    if trig == 1:
        if r['minimum_level']: meth = 'L' + r['minimum_level']
        elif r['held_item_id']: meth = 'I' + items[int(r['held_item_id'])]
        elif r['minimum_happiness'] or r['minimum_affection']: meth = 'Isoothe-bell'
        elif r['location_id'] and b in ('Magnezone', 'Probopass', 'Vikavolt'): meth = 'Ithunder-stone'
        elif r['location_id'] and b == 'Leafeon': meth = 'Ileaf-stone'
        elif r['location_id'] and b == 'Glaceon': meth = 'Iice-stone'
        else: meth = 'L32'
    elif trig == 2:
        meth = 'I' + items[int(r['held_item_id'])] if r['held_item_id'] else ('Ilinking-cord')
    elif trig == 3:
        meth = 'I' + items[int(r['trigger_item_id'])]
    elif trig == 4: meth = 'L20'
    else: meth = 'L36'
    if meth not in [m for t, m in evo[a] if t == b] and not any(t == b for t, m in evo[a]):
        evo[a].append((b, meth))
# manual: Eevee-like level with friendship but also time; already mapped. Regional forms:
FORM_EVO = [
 ('Rattata de Alola','Raticate de Alola','L20'),('Sandshrew de Alola','Sandslash de Alola','Iice-stone'),('Vulpix de Alola','Ninetales de Alola','Iice-stone'),
 ('Diglett de Alola','Dugtrio de Alola','L26'),('Meowth de Alola','Persian de Alola','Isoothe-bell'),('Geodude de Alola','Graveler de Alola','L25'),('Graveler de Alola','Golem de Alola','Ilinking-cord'),
 ('Grimer de Alola','Muk de Alola','L38'),('Pikachu','Raichu de Alola','Ithunder-stone'),('Exeggcute','Exeggutor de Alola','Ileaf-stone'),('Cubone','Marowak de Alola','L28'),
 ('Meowth de Galar','Perrserker','L28'),('Ponyta de Galar','Rapidash de Galar','L40'),('Slowpoke de Galar','Slowbro de Galar','Igalarica-cuff'),('Slowpoke de Galar','Slowking de Galar','Igalarica-wreath'),
 ("Farfetch'd de Galar","Sirfetch'd",'L30'),('Mr. Mime de Galar','Mr. Rime','L42'),('Corsola de Galar','Cursola','L38'),('Zigzagoon de Galar','Linoone de Galar','L20'),('Linoone de Galar','Obstagoon','L35'),
 ('Darumaka de Galar','Darmanitan de Galar','Iice-stone'),('Yamask de Galar','Runerigus','L34'),('Koffing','Weezing de Galar','L35'),('Mime Jr.','Mr. Mime de Galar','L32'),
 ('Growlithe de Hisui','Arcanine de Hisui','Ifire-stone'),('Voltorb de Hisui','Electrode de Hisui','Ileaf-stone'),('Qwilfish de Hisui','Overqwil','L32'),('Sneasel de Hisui','Sneasler','Irazor-claw'),
 ('Zorua de Hisui','Zoroark de Hisui','L30'),('Sliggoo de Hisui','Goodra de Hisui','L50'),('Goomy','Sliggoo de Hisui','L40'),('Bergmite','Avalugg de Hisui','L37'),('Quilava','Typhlosion de Hisui','L36'),
 ('Dewott','Samurott de Hisui','L36'),('Dartrix','Decidueye de Hisui','L36'),('Petilil','Lilligant de Hisui','Isun-stone'),('Rufflet','Braviary de Hisui','L54'),('Paldean Wooper' if False else 'Wooper de Paldea','Clodsire','L20'),
]
names = set(p[0] for p in P)
for a, b, m in FORM_EVO:
    if a in names and b in names:
        if not any(t == b for t, _ in evo[a]): evo[a].append((b, m))
    else: print('missing form evo', a, b)
# remove evolutions from base forms that target the regional-only species (e.g. base Meowth -> Perrserker)
REGIONAL_ONLY = {'Perrserker':'Meowth',"Sirfetch'd":"Farfetch'd",'Mr. Rime':'Mr. Mime','Cursola':'Corsola','Obstagoon':'Linoone','Runerigus':'Yamask','Overqwil':'Qwilfish','Sneasler':'Sneasel','Clodsire':'Wooper'}
for t, src in REGIONAL_ONLY.items():
    evo[src] = [x for x in evo[src] if x[0] != t]
# Mr. Mime base from Mime Jr kept. Linoone from Zigzagoon base kept.
EVO_OUT = {a: [[b, m] for b, m in v] for a, v in evo.items() if v}
itemset = sorted({m[1:] for v in EVO_OUT.values() for _, m in v if m[0] == 'I'})
ITEM_IDS = {v: k for k, v in items.items()}
IT_OUT = {}
for it in itemset:
    iid = ITEM_IDS.get(it)
    IT_OUT[it] = iname.get(iid, it.replace('-', ' ').title()) if iid else it
IT_OUT['linking-cord'] = IT_OUT.get('linking-cord') if ITEM_IDS.get('linking-cord') in iname else 'Cordón Unión'
print('evo items', len(itemset), IT_OUT)
print('evos', sum(len(v) for v in EVO_OUT.values()))

out = {'MV': MOVE_OUT, 'LS': LS_OUT, 'RD': RD, 'EV': EVO_OUT, 'EI': IT_OUT}
js = 'const GD=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';'
open(W+'gamedata.js', 'w').write(js)
print('size', len(js.encode()))
