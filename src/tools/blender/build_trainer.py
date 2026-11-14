# Genera en Blender (sin interfaz) las piezas 3D del entrenador y las exporta a  models/*.glb
#   pip install bpy ;  python build_trainer.py -- ../../../models
# Ejes de Blender: X = izquierda del personaje, -Y = frente, Z = arriba. Unidades = las del visor del juego.
# Cada objeto se llama  segmento.color.nombre[.etiqueta]
#   segmento: body, head, armL1, armL2, armR1, armR2, legL, legR  (lo que gira con cada articulación)
#   color:    skin, top, topd, topl, inner, bot, botd, botl, shoe, shoed, sole, white …  (el juego pone el color)
#   etiqueta: parte del cuerpo que una prenda puede tapar (torso, uarm, farm, thigh, shin, foot)
import bpy, bmesh, math, json, sys, os
from math import pi, cos, sin
from mathutils import Vector

OUT = sys.argv[sys.argv.index("--") + 1]
os.makedirs(OUT, exist_ok=True)
META = {"pieces": {}}
MATS = {}


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    MATS.clear()


def mat(n):
    if n not in MATS:
        MATS[n] = bpy.data.materials.new(n)
    return MATS[n]


def mk(name, V, F, slot, seg="body", ss=1, solid=0.0, soff=1.0, tag=""):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in V], [], F)
    me.update()
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(f"{seg}.{slot}.{name}" + (f".{tag}" if tag else ""), me)
    bpy.context.scene.collection.objects.link(o)
    me.materials.append(mat(slot))
    if solid:
        m = o.modifiers.new("so", "SOLIDIFY")
        m.thickness = solid
        m.offset = soff
    if ss:
        m = o.modifiers.new("ss", "SUBSURF")
        m.levels = ss
        m.render_levels = ss
    for p in me.polygons:
        p.use_smooth = True
    return o


def both(name, V, F, slot, segL, segR, **kw):
    """La pieza y su reflejo (x → -x)."""
    mk(name + "L", V, F, slot, segL, **kw)
    mk(name + "R", [Vector((-v[0], v[1], v[2])) for v in V], [tuple(reversed(f)) for f in F], slot, segR, **kw)


def save(piece, **info):
    dg = bpy.context.evaluated_depsgraph_get()
    tris = 0
    for o in bpy.context.scene.objects:
        e = o.evaluated_get(dg)
        me = e.to_mesh()
        me.calc_loop_triangles()
        tris += len(me.loop_triangles)
        e.to_mesh_clear()
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, piece + ".glb"), export_format="GLB", export_apply=True, export_texcoords=False, export_normals=False, export_materials="EXPORT")
    info["tris"] = tris
    META["pieces"][piece] = info
    print(piece, tris)


def ring(c, t, side, rx, ry, n=12, p=2.0, rot=0.0, fn=None, a0=None, a1=None):
    """Anillo (superelipse) centrado en c, perpendicular a t; 'side' marca hacia dónde va el eje x del anillo."""
    t = Vector(t).normalized()
    s = Vector(side)
    u = (s - t * s.dot(t)).normalized()
    v = t.cross(u)
    out = []
    for i in range(n):
        a = 2 * pi * i / n + rot if a0 is None else a0 + (a1 - a0) * i / (n - 1)
        ca, sa = cos(a), sin(a)
        x = math.copysign(abs(ca) ** (2 / p), ca) * rx
        y = math.copysign(abs(sa) ** (2 / p), sa) * ry
        if fn:
            x, y = fn(a, x, y)
        out.append(Vector(c) + u * x + v * y)
    return out


def loft(rings, closed=True, cap0=False, cap1=False):
    n = len(rings[0])
    V = [p for r in rings for p in r]
    F = []
    for i in range(len(rings) - 1):
        for j in range(n if closed else n - 1):
            F.append((i * n + j, i * n + (j + 1) % n, (i + 1) * n + (j + 1) % n, (i + 1) * n + j))
    if cap0:
        V.append(sum(rings[0], Vector()) / n)
        k = len(V) - 1
        F += [(k, (j + 1) % n, j) for j in range(n)]
    if cap1:
        b = (len(rings) - 1) * n
        V.append(sum(rings[-1], Vector()) / n)
        k = len(V) - 1
        F += [(k, b + j, b + (j + 1) % n) for j in range(n)]
    return V, F


def tube(path, radii, side, n=12, p=2.0, cap0=True, cap1=True, fn=None):
    R = []
    for i, c in enumerate(path):
        a = Vector(path[max(0, i - 1)])
        b = Vector(path[min(len(path) - 1, i + 1)])
        R.append(ring(c, b - a, side, radii[i][0], radii[i][1], n, p, fn=fn))
    return loft(R, True, cap0, cap1)


def sphere(us=32, vs=20):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=us, v_segments=vs, radius=1.0)
    V = [v.co.copy() for v in bm.verts]
    F = [tuple(v.index for v in f.verts) for f in bm.faces]
    bm.free()
    return V, F


def blob(name, c, r, slot, seg="body", us=14, vs=9, **kw):
    V, F = sphere(us, vs)
    mk(name, [Vector((c[0] + v.x * r[0], c[1] + v.y * r[1], c[2] + v.z * r[2])) for v in V], F, slot, seg, ss=0, **kw)


def plate(name, pts, slot, seg="body", th=0.008, ss=1):
    """Lámina de cuatro esquinas con grosor (solapas, cuellos de camisa, bolsillos…)."""
    mk(name, [Vector(p) for p in pts], [(0, 1, 2, 3)], slot, seg, ss=ss, solid=th)


UP = (0, 0, 1)
X = (1, 0, 0)
BK = (0, 1, 0)
# ================================================================ medidas del esqueleto
HK = 1.16
HR = (0.168 * HK, 0.18 * HK, 0.19 * HK)
HC = Vector((0, 0.0, 1.415 + HR[2]))
SH = Vector((0.2, 0.0, 1.295))
EL = Vector((0.258, 0.012, 1.045))
WR = Vector((0.288, -0.022, 0.815))
HIP = Vector((0.09, 0.0, 0.9))
CY = 0.008                                   # el tronco va un pelín hacia atrás
META["piv"] = {"shL": list(SH), "elL": list(EL), "wrL": list(WR), "hipL": list(HIP), "head": list(HC), "hr": list(HR)}


def lerp_tab(T, z):
    if z <= T[0][0]:
        return T[0][1:]
    for a, b in zip(T, T[1:]):
        if z <= b[0]:
            k = (z - a[0]) / (b[0] - a[0])
            return tuple(a[i] + (b[i] - a[i]) * k for i in range(1, len(a)))
    return T[-1][1:]


# ================================================================ CUERPO BASE
# Formas de la cara (opción del editor): 0 redonda, 1 ovalada, 2 cuadrada.
#   wx ancho · taper/tp cuánto y cómo se estrecha hacia la barbilla · chin largo de la parte baja ·
#   cheek mejillas · jaw ángulo de la mandíbula · chinw ancho de la barbilla
FS = {0: dict(wx=1.0, taper=0.4, tp=1.9, chin=0.95, cheek=0.1, jaw=0.0, chinw=1.0),
      1: dict(wx=0.93, taper=0.52, tp=1.55, chin=1.06, cheek=0.03, jaw=0.0, chinw=0.8),
      2: dict(wx=1.03, taper=0.3, tp=2.7, chin=0.98, cheek=0.04, jaw=0.13, chinw=1.3)}


def head_shape(x, y, z, f):
    """De la esfera unidad a la cabeza: cráneo redondo, mandíbula según la forma elegida, barbilla adelantada
    y relieve en la cara (frente, arco de las cejas, cuencas de los ojos, pómulos, boca y barbilla)."""
    g = lambda a, s: math.exp(-(a / s) ** 2)
    fwd = 0.0
    if z < 0:
        t = -z
        x *= 1 - f["taper"] * t ** f["tp"]
        y *= (1 - 0.1 * t ** 1.8) if y < 0 else (1 - 0.5 * t ** 1.3)
        if y < 0.15:
            x *= 1 + f["cheek"] * g(z + 0.4, 0.26) + f["jaw"] * g(z + 0.7, 0.2)
        fwd = 0.34 * t ** 1.6          # la parte baja de la cabeza se adelanta: la barbilla queda bajo la cara
        z *= f["chin"]
    x *= f["wx"]
    p = Vector((HC.x + x * HR[0], HC.y + (y - fwd) * HR[1], HC.z + z * HR[2]))
    if y < 0:
        w = min(1.0, -y * 1.7) ** 1.5
        u, v = p.x / HR[0], (p.z - HC.z) / HR[2]
        au = abs(u)
        d = 0.007 * g(v - 0.36, 0.3) * g(u, 0.75)            # frente
        d += 0.0075 * g(v - 0.01, 0.075) * g(au - 0.36, 0.32)  # arco de las cejas
        d -= 0.0075 * g(v + 0.2, 0.13) * g(au - 0.42, 0.2)     # cuencas de los ojos
        d += 0.01 * g(v + 0.5, 0.2) * g(au - 0.5, 0.26)        # pómulos
        d += 0.009 * g(v + 0.71, 0.13) * g(u, 0.36)            # boca
        d += 0.012 * g(v + 0.95, 0.14) * g(u, 0.3 * f["chinw"])  # barbilla
        p.y -= d * w
    return p


def heads():
    META["faces"] = {}
    for fs, f in FS.items():
        reset()
        V, F = sphere(64, 40)
        ho = mk("head", [head_shape(v.x, v.y, v.z, f) for v in V], F, "skin", "head", ss=0)
        for s in (1, -1):
            V2, F2 = sphere(12, 8)
            mk("ear" + "LR"[s < 0], [Vector((s * (HR[0] * f["wx"] * 0.965) + v.x * 0.026, 0.03 + v.y * 0.034, HC.z - 0.03 + v.z * 0.052)) for v in V2], F2, "skin", "head", ss=0)
        dg = bpy.context.evaluated_depsgraph_get()
        he = ho.evaluated_get(dg)
        front = lambda x, z: he.ray_cast(Vector((x, -1.0, z)), Vector((0, 1, 0)))
        # nariz: cuña pequeña y afilada que nace entre los ojos y acaba en punta
        yf = lambda z: front(0, z)[1].y
        zb, zm, zt = HC.z - 0.1 * HR[2], HC.z - 0.3 * HR[2], HC.z - 0.47 * HR[2]
        V2, F2 = tube([(0, yf(zb) + 0.012, zb + 0.01), (0, yf(zb) + 0.002, zb), (0, yf(zm) - 0.01, zm), (0, yf(zt) - 0.026, zt), (0, yf(zt - 0.022) + 0.006, zt - 0.024)],
                      [(0.008, 0.004), (0.011, 0.006), (0.014, 0.011), (0.0165, 0.013), (0.012, 0.006)], X, 8, 2.0)
        mk("nose", V2, F2, "skin", "head", ss=2)
        grid = []
        for iz in range(46):
            row = []
            for ix in range(41):
                hit, loc, _, _ = front(-0.2 + ix * 0.01, 1.39 + iz * 0.01)
                row.append(round(-loc.y, 4) if hit else None)
            grid.append(row)
        META["faces"][str(fs)] = {"x0": -0.2, "y0": 1.39, "d": 0.01, "g": grid}
        save(f"head{fs}")


def base(girl):
    reset()
    ak = 0.86 if girl else 1.0      # grosor de brazos
    lk = 0.92 if girl else 1.0      # grosor de piernas
    nk = 0.9 if girl else 1.0
    V, F = tube([(0, 0.014, 1.31), (0, 0.014, 1.39), (0, 0.016, 1.47), (0, 0.02, 1.56)], [(0.058 * nk, 0.056 * nk), (0.05 * nk, 0.05 * nk), (0.052 * nk, 0.052 * nk), (0.056 * nk, 0.056 * nk)], X, 12, cap0=False, cap1=True)
    mk("neck", V, F, "skin", "body")
    # torso
    T = [(0.86, 0.135, 0.09), (0.93, 0.15, 0.098), (1.0, 0.134, 0.086), (1.1, 0.146, 0.094), (1.2, 0.162, 0.1), (1.27, 0.168, 0.098), (1.31, 0.14, 0.086), (1.345, 0.075, 0.062)]
    if girl:
        T = [(0.86, 0.135, 0.09), (0.93, 0.152, 0.1), (1.0, 0.118, 0.08), (1.1, 0.134, 0.09), (1.2, 0.152, 0.104), (1.27, 0.158, 0.096), (1.31, 0.132, 0.084), (1.345, 0.072, 0.06)]
    V, F = loft([ring((0, CY, z), UP, X, rx, ry, 16, 2.4) for z, rx, ry in T], True, True, False)
    mk("torso", V, F, "skin", "body", ss=1, tag="torso")
    # brazos
    V, F = tube([SH + Vector((-0.05, 0, 0.004)), SH + Vector((-0.004, 0, 0.004)), SH.lerp(EL, 0.35), SH.lerp(EL, 0.75), EL + Vector((0.003, 0, -0.015))],
                [(0.04 * ak, 0.046 * ak), (0.056 * ak, 0.058 * ak), (0.05 * ak, 0.053 * ak), (0.045 * ak, 0.047 * ak), (0.041 * ak, 0.043 * ak)], BK, 12)
    both("upperarm", V, F, "skin", "armL1", "armR1", tag="uarm")
    V, F = tube([EL + Vector((-0.003, 0, 0.022)), EL.lerp(WR, 0.25), EL.lerp(WR, 0.6), WR + Vector((0, 0, 0.02)), WR + Vector((0, 0, -0.004))],
                [(0.04 * ak, 0.042 * ak), (0.044 * ak, 0.046 * ak), (0.038 * ak, 0.041 * ak), (0.03 * ak, 0.034 * ak), (0.027 * ak, 0.032 * ak)], BK, 12)
    both("forearm", V, F, "skin", "armL2", "armR2", tag="farm")
    # manos con dedos
    hk = 0.9 if girl else 1.0
    hd = (WR - EL).normalized()
    pn = Vector((-1, 0, 0))
    pn = (pn - hd * pn.dot(hd)).normalized()
    wd = hd.cross(pn).normalized()
    if wd.y > 0:
        wd = -wd
    PALM = 0.082 * hk
    V, F = loft([ring(WR + hd * d * hk, hd, wd, w * hk, t * hk, 10, 3.0) for d, w, t in ((-0.012, 0.03, 0.026), (0.012, 0.038, 0.024), (0.045, 0.047, 0.023), (0.07, 0.048, 0.021), (0.082, 0.044, 0.017))], True, True, True)
    both("palm", V, F, "skin", "armL2", "armR2", tag="palm")
    for k, (off, ln, r) in enumerate(((0.034, 0.074, 0.0118), (0.0115, 0.084, 0.0122), (-0.0115, 0.078, 0.0118), (-0.033, 0.062, 0.0105))):
        off, ln, r = off * hk, ln * hk, r * hk
        b = WR + hd * (PALM - 0.008 - abs(off) * 0.12) + wd * off
        pts = [b - hd * 0.012, b.copy()]
        d = hd.copy()
        c = b.copy()
        for seg, bend in enumerate((0.16, 0.3, 0.26)):
            d = (d + pn * bend).normalized()
            c = c + d * ln * (0.42, 0.33, 0.25)[seg]
            pts.append(c.copy())
        V, F = tube(pts, [(r, r), (r, r), (r * 0.96, r * 0.96), (r * 0.9, r * 0.9), (r * 0.72, r * 0.72)], wd, 6)
        both(f"finger{k}", V, F, "skin", "armL2", "armR2", tag="finger")
    tb = WR + hd * 0.022 * hk + wd * 0.034 * hk + pn * 0.004
    td = (hd * 0.72 + wd * 0.6 + pn * 0.28).normalized()
    V, F = tube([tb - td * 0.016, tb + td * 0.004, tb + td * 0.036 * hk, tb + (td + pn * 0.25).normalized() * 0.066 * hk], [(0.016 * hk, 0.015 * hk), (0.0165 * hk, 0.0155 * hk), (0.0138 * hk, 0.013 * hk), (0.0105 * hk, 0.01 * hk)], wd, 6)
    both("thumb", V, F, "skin", "armL2", "armR2", tag="finger")
    # piernas: muslo, rodilla, gemelo, tobillo; y pie (solo se ve con sandalias o tacones)
    P = [(0.088, 0.004, 0.93), (0.09, 0.0, 0.84), (0.094, -0.006, 0.66), (0.098, -0.012, 0.5), (0.1, -0.004, 0.36), (0.104, 0.006, 0.2), (0.106, 0.012, 0.11), (0.106, 0.012, 0.05)]
    R = [(0.08, 0.086), (0.084, 0.09), (0.072, 0.078), (0.056, 0.06), (0.059, 0.064), (0.046, 0.05), (0.038, 0.042), (0.04, 0.046)]
    R = [(a * lk, b * lk) for a, b in R]
    V, F = tube(P[:4] + [(0.0985, -0.011, 0.47)], R[:4] + [(R[3][0] * 0.98, R[3][1] * 0.98)], X, 12, 2.0, True, True)
    both("thigh", V, F, "skin", "legL", "legR", tag="thigh")
    V, F = tube([(0.0975, -0.012, 0.53)] + P[3:], [(R[3][0] * 0.98, R[3][1] * 0.98)] + R[3:], X, 12, 2.0, True, True)
    both("shin", V, F, "skin", "legL", "legR", tag="shin")
    V, F = loft([shoe_ring(y, w, h, 0.03) for y, w, h in ((0.07, 0.03, 0.06), (0.05, 0.05, 0.085), (-0.02, 0.058, 0.08), (-0.1, 0.064, 0.058), (-0.16, 0.062, 0.044), (-0.2, 0.04, 0.036))], True, True, True)
    both("foot", turned(V, FA, SX, SY), F, "skin", "legL", "legR", tag="foot")
    piece = "base_f" if girl else "base_m"
    save(piece)
    if not girl:      # perfiles para lo que el juego dibuja encima
        META["torso"] = T
        META["leg"] = [[p[2], p[0], p[1], r[0], r[1]] for p, r in zip(P, R)]


# ---------------------------------------------------------------- calzado
def shoe_ring(y, w, h, z0, n=12):
    pts = []
    for i in range(n):
        a = 2 * pi * i / n
        x = math.copysign(abs(cos(a)) ** 0.8, cos(a)) * w
        z = sin(a)
        z = z0 + (h * (0.5 + 0.5 * z) if z > 0 else h * 0.5 * (1 + z) ** 0.45)
        pts.append(Vector((x, y, z)))
    return pts


def turned(V, ang, cx, cy):
    return [Vector((cx + v.x * cos(ang) - v.y * sin(ang), cy + v.x * sin(ang) + v.y * cos(ang), v.z)) for v in V]


FA = math.radians(11)
# pierna desnuda: altura → (centro x, centro y, radio x, radio y)
LEGT = [(0.05, 0.106, 0.012, 0.04, 0.046), (0.11, 0.106, 0.012, 0.038, 0.042), (0.2, 0.104, 0.006, 0.046, 0.05), (0.36, 0.1, -0.004, 0.059, 0.064), (0.5, 0.098, -0.012, 0.056, 0.06)]
SX, SY = 0.108, 0.02
ST = ((0.105, 0.035, 0.09), (0.09, 0.068, 0.13), (0.04, 0.078, 0.15), (-0.03, 0.082, 0.126), (-0.1, 0.086, 0.102), (-0.165, 0.084, 0.086), (-0.205, 0.066, 0.072), (-0.228, 0.036, 0.056))


def shoe(n, hk=1.0, sole=0.044, sole_slot="sole", toe=None, laces=None, shaft=0.0, shaft_r=1.0, heel=0.0, straps=False, cuff=None, low=False):
    """hk = altura del empeine; toe/laces = color de puntera y cordones; shaft = hasta dónde sube la caña."""
    reset()
    st = [(y, w, h * hk) for y, w, h in ST]
    if low:           # zapato escotado: deja ver el empeine
        st = [(y, w, h * (0.6 if -0.12 < y < 0.08 else 1)) for y, w, h in st]
    lift = [heel * max(0.0, (y + 0.02) / 0.125) for y, w, h in st]
    if not straps:
        V, F = loft([[p + Vector((0, 0, l)) for p in shoe_ring(y, w, h, 0.03)] for (y, w, h), l in zip(st, lift)], True, True, True)
        both("shoe", turned(V, FA, SX, SY), F, "shoe", "legL", "legR", ss=1)
    V, F = loft([[p + Vector((0, 0, l)) for p in shoe_ring(y * 1.03, w + 0.004, sole, 0.0)] for (y, w, h), l in zip(st, lift)], True, True, True)
    both("sole", turned(V, FA, SX, SY), F, sole_slot, "legL", "legR", ss=1)
    if heel:
        V, F = loft([shoe_ring(y, w, heel + 0.02, 0.0) for y, w in ((0.1, 0.03), (0.085, 0.045), (0.05, 0.045), (0.035, 0.03))], True, True, True)
        both("heel", turned(V, FA, SX, SY), F, sole_slot, "legL", "legR", ss=1)
    if toe:
        V, F = loft([shoe_ring(y, w + 0.009, h + 0.01, 0.028) for y, w, h in ((-0.15, 0.078, 0.082 * hk), (-0.168, 0.084, 0.086 * hk)) + tuple(st[6:])], True, True, True)
        both("toe", turned([v + Vector((0, -0.006, 0)) for v in V], FA, SX, SY), F, toe, "legL", "legR", ss=1)
    if laces:
        for j, y in enumerate((-0.005, -0.04, -0.075)):
            V, F = loft([shoe_ring(y + dy, 0.05 - j * 0.004, 0.02, (0.143 - j * 0.014) * hk - (0.006 if dy else 0)) for dy in (0.012, 0.0, -0.012)], True, True, True)
            both(f"lace{j}", turned(V, FA, SX, SY), F, laces, "legL", "legR", ss=1)
    if straps:
        for j, (y, w, h) in enumerate(((-0.13, 0.07, 0.07), (-0.02, 0.066, 0.105))):
            V, F = loft([shoe_ring(y + dy, w, h, 0.028) for dy in (0.014, -0.014)], True, False, False)
            both(f"strap{j}", turned(V, FA, SX, SY), F, "shoe", "legL", "legR", ss=1, solid=0.008)
    if shaft:
        zs = [0.1, 0.16] + [0.16 + (shaft - 0.16) * k / 3 for k in (1, 2, 3)] if shaft > 0.2 else [0.1, shaft]
        lg = [lerp_tab(LEGT, z) for z in zs]          # la caña sigue la forma de la pierna
        V, F = tube([(q[0], q[1], z) for q, z in zip(lg, zs)], [(max(0.056, q[2] + 0.014) * shaft_r, max(0.062, q[3] + 0.014) * shaft_r) for q in lg], X, 12, 2.0, False, False)
        both("shaft", V, F, "shoe", "legL", "legR", ss=1, solid=0.012)
        if cuff:
            V, F = tube([(0.106, 0.014, shaft - 0.03), (0.106, 0.014, shaft + 0.004)], [(0.06 * shaft_r, 0.066 * shaft_r)] * 2, X, 12, 2.0, False, False)
            both("shcuff", V, F, cuff, "legL", "legR", ss=1, solid=0.012)
    save(f"shoe{n}", foot=bool(straps or low))


# ================================================================ PARTE DE ARRIBA
GP = [(0.6, 0.2, 0.135), (0.9, 0.184, 0.124), (1.0, 0.176, 0.118), (1.1, 0.172, 0.114), (1.2, 0.182, 0.114), (1.29, 0.194, 0.11), (1.345, 0.19, 0.098), (1.372, 0.125, 0.08), (1.392, 0.08, 0.07)]


def gp(z, fit=1.0, flare=0.0):
    rx, ry = lerp_tab(GP, z)
    k = fit if z < 1.3 else 1 + (fit - 1) * 0.5
    f = flare * max(0.0, 0.98 - z)
    return rx * k + f, ry * k + f * 0.85


def zlist(z0, z1=1.29):
    n = max(2, round((z1 - z0) / 0.085))
    return [z0 + (z1 - z0) * i / n for i in range(n + 1)]


def torso(name, z0, slot="top", fit=1.0, flare=0.0, top=1.392, gap=None, solid=0.012, fn=None, n=18):
    """Cuerpo de la prenda: cerrado, o abierto por delante si 'gap' (función z → media abertura)."""
    zs = zlist(z0) + [z for z in (1.345, 1.372, 1.392) if z <= top + 1e-6]
    if top < 1.29:
        zs = zlist(z0, top)
    R = []
    for z in zs:
        rx, ry = gp(z, fit, flare)
        if gap:
            g = gap(z)
            R.append(ring((0, CY, z), UP, X, rx, ry, n + 1, 2.5, a0=-pi / 2 + g, a1=1.5 * pi - g, fn=fn))
        else:
            R.append(ring((0, CY, z), UP, X, rx, ry, n, 2.5, fn=fn))
    V, F = loft(R, not gap)
    mk(name, V, F, slot, "body", ss=1, solid=solid, soff=1 if gap else -1)


def band(name, z0, z1, slot, fit=1.0, flare=0.0, grow=0.004, gap=None, th=0.012, n=18):
    R = []
    for z in (z0, z1):
        rx, ry = gp(z, fit, flare)
        if gap:
            g = gap(z)
            R.append(ring((0, CY, z), UP, X, rx + grow, ry + grow, n + 1, 2.5, a0=-pi / 2 + g, a1=1.5 * pi - g))
        else:
            R.append(ring((0, CY, z), UP, X, rx + grow, ry + grow, n, 2.5))
    V, F = loft(R, not gap)
    mk(name, V, F, slot, "body", ss=1, solid=th)


def sleeves(kind, slot="top", k=1.0, cuff="topd"):
    if kind == "none":
        return
    if kind in ("short", "cap", "puff"):
        e = {"short": 0.58, "cap": 0.3, "puff": 0.5}[kind]
        r = 0.076 if kind == "puff" else 0.064 * k
        V, F = tube([SH + Vector((-0.05, 0, 0.004)), SH + Vector((-0.002, 0, 0.004)), SH.lerp(EL, e * 0.6), SH.lerp(EL, e)],
                    [(0.046, 0.054), (r + 0.002, r + 0.004), (r, r + 0.002), ((r + 0.002) * (0.8 if kind == "puff" else 1.03), (r + 0.004) * (0.8 if kind == "puff" else 1.03))], BK, 12, 2.1, True, False)
        both("sleeve", V, F, slot, "armL1", "armR1", solid=0.01, soff=-1)
        if kind == "puff" or cuff == "trim":
            V, F = tube([SH.lerp(EL, e - 0.08), SH.lerp(EL, e + 0.01)], [(0.062, 0.064), (0.062, 0.064)], BK, 12, 2.1, False, False)
            both("sleevehem", V, F, "topd" if kind == "puff" else "topl", "armL1", "armR1", solid=0.01)
        return
    w = 0.03 if kind == "wide" else 0.0
    V, F = tube([SH + Vector((-0.045, 0, 0.012)), SH + Vector((0.004, 0, 0.006)), SH.lerp(EL, 0.5), EL + Vector((0.004, 0, -0.02))],
                [(0.05, 0.058), (0.076 * k, 0.08 * k), (0.072 * k, 0.074 * k), ((0.066 + w * 0.4) * k, (0.068 + w * 0.4) * k)], BK, 12, 2.1)
    both("sleeveA", V, F, slot, "armL1", "armR1")
    V, F = tube([EL + Vector((-0.004, 0, 0.03)), EL.lerp(WR, 0.5), WR + Vector((-0.003, 0, 0.034)), WR + Vector((0, 0, 0.016 if not w else 0.0))],
                [((0.062 + w * 0.4) * k, (0.064 + w * 0.4) * k), ((0.064 + w * 0.8) * k, (0.066 + w * 0.8) * k), ((0.062 + w) * k, (0.064 + w) * k), ((0.05 + w) * k, (0.052 + w) * k)], BK, 12, 2.1, True, not w)
    both("sleeveB", V, F, slot, "armL2", "armR2", **({"solid": 0.01, "soff": -1} if w else {}))
    if cuff and not w:
        V, F = tube([WR + Vector((-0.002, 0, 0.044)), WR + Vector((0, 0, 0.008))], [(0.054 * k, 0.056 * k), (0.052 * k, 0.054 * k)], BK, 12, 2.1, False, False)
        both("cuff", V, F, cuff, "armL2", "armR2", solid=0.012)


def collar(kind, slot="topl"):
    if kind == "up":            # cuello levantado de chaqueta
        R = [ring((0, 0.016, z), UP, X, rx, ry, 15, 2.2, a0=-pi / 2 + g, a1=1.5 * pi - g) for z, rx, ry, g in ((1.345, 0.098, 0.082, 0.75), (1.4, 0.106, 0.092, 0.6), (1.45, 0.122, 0.104, 0.5))]
        V, F = loft(R, False)
        mk("collar", V, F, slot, "body", solid=0.016)
    elif kind == "band":        # ribete del cuello de camiseta
        V, F = tube([(0, 0.01, 1.378), (0, 0.01, 1.398)], [(0.08, 0.072), (0.076, 0.068)], X, 14, 2.2, False, False)
        mk("neckband", V, F, slot, "body", solid=0.012)
    elif kind == "turtle":      # cuello alto
        V, F = tube([(0, 0.012, 1.37), (0, 0.012, 1.41), (0, 0.012, 1.455)], [(0.086, 0.078), (0.072, 0.068), (0.07, 0.066)], X, 14, 2.2, False, False)
        mk("turtle", V, F, slot, "body", solid=0.014)
    elif kind == "shirt":       # cuello de camisa: dos solapas
        for s in (1, -1):
            plate("col" + "LR"[s < 0], [(s * 0.004, -0.078, 1.392), (s * 0.085, -0.02, 1.412), (s * 0.1, -0.05, 1.36), (s * 0.03, -0.098, 1.335)], slot, th=0.012)
        V, F = tube([(0, 0.014, 1.385), (0, 0.014, 1.425)], [(0.078, 0.07), (0.07, 0.064)], X, 14, 2.2, False, False)
        mk("colstand", V, F, slot, "body", solid=0.01)
    elif kind == "lapel":       # solapas de traje
        for s in (1, -1):
            plate("lap" + "LR"[s < 0], [(s * 0.012, -0.108, 1.2), (s * 0.075, -0.07, 1.385), (s * 0.115, -0.085, 1.33), (s * 0.07, -0.112, 1.22)], slot, th=0.012)
    elif kind == "hood":        # capucha caída a la espalda
        blob("hood", (0, 0.105, 1.345), (0.13, 0.062, 0.095), slot)
        V, F = tube([(0, 0.02, 1.36), (0, 0.022, 1.41)], [(0.1, 0.092), (0.108, 0.1)], X, 14, 2.2, False, False)
        mk("hoodrim", V, F, slot, "body", solid=0.016)
    elif kind == "sailor":      # cuello marinero: pico delante y capa cuadrada detrás
        plate("sailback", [(-0.13, 0.085, 1.37), (0.13, 0.085, 1.37), (0.135, 0.118, 1.22), (-0.135, 0.118, 1.22)], slot, th=0.012)
        for s in (1, -1):
            plate("sail" + "LR"[s < 0], [(s * 0.01, -0.108, 1.24), (s * 0.085, -0.04, 1.392), (s * 0.14, -0.03, 1.36), (s * 0.06, -0.112, 1.25)], slot, th=0.012)


def inner(short=False, slot="inner"):
    """Camiseta que se ve bajo una prenda abierta."""
    torso("shirt", 0.9, slot, 0.94, solid=0.0)
    if short:
        sleeves("short", slot)


OPEN = lambda z: 0.5 if z < 0.95 else 0.42 if z < 1.25 else 0.56 if z < 1.34 else 0.9
WRAP = lambda z: 0.04 if z < 1.1 else 0.04 + (z - 1.1) * 3.2


def skirt_fn(amp, lobes):
    return lambda a, x, y: (x * (1 + amp * cos(a * lobes)), y * (1 + amp * cos(a * lobes)))


def top(n):
    reset()
    hide, show = [], []
    T = lambda *a, **k: torso("body", *a, **k)
    if n == 0:      # camiseta
        T(0.9); collar("band", "topd"); sleeves("short")
    elif n == 1:    # chaqueta
        inner(); T(0.905, fit=1.06, gap=OPEN, solid=0.02); band("hem", 0.885, 0.935, "topd", 1.06, gap=OPEN, th=0.022); collar("up"); sleeves("long"); hide = ["uarm", "farm"]
    elif n == 2:    # sudadera
        T(0.89, fit=1.07); band("hem", 0.875, 0.93, "topd", 1.07, th=0.016); collar("hood", "topd"); sleeves("long", k=1.05); hide = ["uarm", "farm"]
        plate("pocket", [(-0.085, -0.142, 1.06), (0.085, -0.142, 1.06), (0.11, -0.142, 0.955), (-0.11, -0.142, 0.955)], "topd", th=0.01)
    elif n == 3:    # chaleco
        inner(True); T(0.905, fit=1.06, gap=OPEN, solid=0.02); collar("up")
        V, F = tube([SH + Vector((-0.045, 0, 0.012)), SH + Vector((0.006, 0, 0.004)), SH.lerp(EL, 0.14)], [(0.05, 0.058), (0.078, 0.082), (0.08, 0.084)], BK, 12, 2.1, True, False)
        both("armhole", V, F, "topl", "armL1", "armR1", solid=0.012, soff=-1)
    elif n in (4, 23, 26):   # vestidos
        hem = {4: 0.5, 23: 0.52, 26: 0.13}[n]
        T(hem, flare={4: 0.26, 23: 0.3, 26: 0.2}[n], fit=0.96)
        band("waist", 0.99, 1.03, "topd", 0.96, th=0.01)
        if n == 4:
            collar("band", "topd"); sleeves("short")
        elif n == 26:
            sleeves("cap"); band("hemband", hem, hem + 0.05, "topl", 0.96, 0.2, th=0.012)
        else:
            show = ["torso"]
            for s in (1, -1):
                V, F = tube([(s * 0.1, -0.075, 1.33), (s * 0.115, 0.01, 1.385), (s * 0.1, 0.085, 1.33)], [(0.02, 0.008)] * 3, X, 8, 3.0)
                mk("strap" + "LR"[s < 0], V, F, "top", "body")
    elif n == 5:    # camisa
        T(0.9, fit=1.02); collar("shirt"); sleeves("long", k=0.94, cuff="topl"); hide = ["uarm", "farm"]
        plate("placket", [(-0.014, -0.128, 1.36), (0.014, -0.128, 1.36), (0.014, -0.146, 0.91), (-0.014, -0.146, 0.91)], "topl", th=0.006)
    elif n == 6:    # camiseta de tirantes
        T(0.9, fit=0.95, top=1.29); show = ["torso"]
        for s in (1, -1):
            V, F = tube([(s * 0.105, -0.085, 1.285), (s * 0.12, 0.01, 1.372), (s * 0.105, 0.09, 1.285)], [(0.024, 0.008)] * 3, X, 8, 3.0)
            mk("strap" + "LR"[s < 0], V, F, "top", "body")
    elif n == 7:    # polo
        T(0.9); collar("shirt"); sleeves("short", cuff="trim")
        plate("placket", [(-0.014, -0.12, 1.36), (0.014, -0.12, 1.36), (0.014, -0.134, 1.22), (-0.014, -0.134, 1.22)], "topl", th=0.006)
    elif n in (8, 12):   # abrigo largo y bata
        inner(); T(0.52, fit=1.08, flare=0.1, gap=OPEN, solid=0.02); collar("up" if n == 8 else "lapel", "topl" if n == 12 else "topd"); sleeves("long"); hide = ["uarm", "farm"]
        if n == 8:
            band("belt", 0.99, 1.03, "topd", 1.08, gap=OPEN, th=0.022)
        for s in (1, -1):
            plate("pk" + "LR"[s < 0], [(s * 0.1, -0.16, 0.86), (s * 0.17, -0.13, 0.86), (s * 0.172, -0.135, 0.76), (s * 0.1, -0.165, 0.76)], "topd", th=0.008)
    elif n == 9:    # jersey
        T(0.89, fit=1.06); band("hem", 0.875, 0.93, "topd", 1.06, th=0.016); collar("turtle", "top"); sleeves("long", k=1.03); hide = ["uarm", "farm"]
    elif n == 10:   # top corto
        T(1.13, fit=0.95); collar("band", "topd"); sleeves("cap"); show = ["torso"]
    elif n == 11:   # chaqueta deportiva
        inner(); T(0.9, fit=1.06, gap=OPEN, solid=0.02); band("hem", 0.885, 0.93, "topl", 1.06, gap=OPEN, th=0.022); collar("up", "top"); sleeves("long", cuff="topl"); hide = ["uarm", "farm"]
        for s in (1, -1):
            V, F = tube([SH + Vector((0.07, 0, -0.02)), EL + Vector((0.064, 0, 0))], [(0.006, 0.02)] * 2, BK, 6, 3.0)
            mk("stripe" + "LR"[s < 0], [Vector((s * v.x, v.y, v.z)) for v in V], F if s > 0 else [tuple(reversed(f)) for f in F], "topl", "armL1" if s > 0 else "armR1")
    elif n == 13:   # peto
        T(0.9, fit=0.97); collar("band", "topd"); sleeves("short")
        plate("bib", [(-0.09, -0.118, 1.275), (0.09, -0.118, 1.275), (0.115, -0.128, 0.99), (-0.115, -0.128, 0.99)], "bot", th=0.02)
        for s in (1, -1):
            V, F = tube([(s * 0.075, -0.124, 1.25), (s * 0.105, -0.02, 1.384), (s * 0.09, 0.108, 1.3), (s * 0.075, 0.128, 1.0)], [(0.02, 0.01)] * 4, X, 8, 3.0)
            mk("strap" + "LR"[s < 0], V, F, "bot", "body")
    elif n in (14, 21, 24):   # camiseta de rayas, de fútbol y camisa hawaiana (el dibujo lo pone el juego)
        T(0.9, fit=1.0 if n != 24 else 1.04); collar("band" if n != 24 else "shirt", "topd" if n != 24 else "topl"); sleeves("short", cuff="trim" if n == 21 else "topd")
    elif n == 15:   # cazadora
        inner(); T(0.94, fit=1.1, gap=OPEN, solid=0.024); band("hem", 0.915, 0.97, "topd", 1.1, gap=OPEN, th=0.026); collar("up", "topd"); sleeves("long", k=1.08); hide = ["uarm", "farm"]
    elif n == 16:   # kimono
        T(0.56, fit=1.05, flare=0.08, gap=WRAP, solid=0.018); band("sash", 0.97, 1.05, "inner", 1.09, th=0.014); sleeves("wide"); hide = ["uarm", "farm"]
        for s in (1, -1):
            plate("kcol" + "LR"[s < 0], [(s * 0.0, -0.134, 1.1), (s * 0.085, -0.03, 1.4), (s * 0.115, -0.045, 1.38), (s * 0.03, -0.14, 1.1)], "topl", th=0.012)
    elif n == 17:   # uniforme de marinero
        T(0.9, fit=1.02); collar("sailor"); sleeves("long", cuff="topl"); hide = ["uarm", "farm"]
        blob("knot", (0, -0.13, 1.23), (0.03, 0.014, 0.022), "inner")
    elif n in (18, 27):   # traje y uniforme escolar
        inner(); T(0.88, fit=1.05, gap=lambda z: 0.1 if z < 1.12 else 0.1 + (z - 1.12) * 2.6, solid=0.018); collar("lapel", "topd" if n == 18 else "topl"); sleeves("long", k=0.96); hide = ["uarm", "farm"]
        for s in (1, -1):
            plate("icol" + "LR"[s < 0], [(s * 0.004, -0.075, 1.392), (s * 0.07, -0.02, 1.41), (s * 0.08, -0.05, 1.37), (s * 0.03, -0.09, 1.345)], "white", th=0.01)
        for z in (1.06, 0.98):
            blob(f"btn{z}", (0.012, -0.142, z), (0.012, 0.006, 0.012), "topd", us=8, vs=5)
    elif n == 19:   # sudadera abierta
        inner(); T(0.89, fit=1.08, gap=OPEN, solid=0.022); band("hem", 0.875, 0.93, "topd", 1.08, gap=OPEN, th=0.024); collar("hood", "topd"); sleeves("long", k=1.05); hide = ["uarm", "farm"]
    elif n == 20:   # chaqueta de plumas
        inner(); T(0.9, fit=1.12, gap=OPEN, solid=0.03, fn=None); collar("up", "top"); sleeves("long", k=1.14); hide = ["uarm", "farm"]
        for i, z in enumerate((0.99, 1.09, 1.19)):
            band(f"seam{i}", z - 0.006, z + 0.006, "topd", 1.12, grow=0.026, gap=OPEN, th=0.006)
    elif n == 22:   # blusa con volantes
        T(0.9, fit=0.98); sleeves("puff"); collar("band", "topl")
        T2 = [ring((0, CY - 0.012, z), UP, X, rx, ry, 18, 2.5, fn=skirt_fn(0.06, 9)) for z, rx, ry in ((1.36, 0.1, 0.085), (1.31, 0.15, 0.115))]
        V, F = loft(T2, True)
        mk("ruffle", V, F, "topl", "body", solid=0.01)
    elif n == 25:   # chaqueta de cuero
        inner(); T(0.92, fit=1.06, gap=OPEN, solid=0.02); collar("lapel", "topd"); sleeves("long", k=0.98, cuff=None); hide = ["uarm", "farm"]
        band("hem", 0.9, 0.94, "topd", 1.06, gap=OPEN, th=0.022)
    elif n == 28:   # chaqueta vaquera
        T(0.92, fit=1.07); band("hem", 0.9, 0.95, "topd", 1.07, th=0.016); collar("shirt"); sleeves("long", cuff="topd"); hide = ["uarm", "farm"]
        plate("placket", [(-0.014, -0.136, 1.36), (0.014, -0.136, 1.36), (0.014, -0.152, 0.93), (-0.014, -0.152, 0.93)], "topd", th=0.006)
        for s in (1, -1):
            plate("pk" + "LR"[s < 0], [(s * 0.05, -0.135, 1.25), (s * 0.12, -0.115, 1.25), (s * 0.12, -0.118, 1.17), (s * 0.05, -0.14, 1.17)], "topd", th=0.008)
    save(f"top{n}", hide=hide, show=show)


# ================================================================ PARTE DE ABAJO
LC = [(0.9, 0.092, 0.006), (0.78, 0.098, 0.0), (0.6, 0.103, -0.008), (0.46, 0.106, -0.012), (0.32, 0.109, -0.004), (0.2, 0.111, 0.004), (0.135, 0.112, 0.006)]


def hips(slot="bot", k=1.0):
    V, F = loft([ring((0, CY, z), UP, X, rx * k, ry * k, 16, 2.5) for z, rx, ry in ((1.01, 0.148, 0.097), (0.95, 0.166, 0.11), (0.88, 0.178, 0.116), (0.82, 0.15, 0.1))], True, True, True)
    mk("hips", V, F, slot, "body")


def legs(prof, zend, slot="bot", cuff=None, cuffh=0.07):
    """prof: radios (x, y) a las alturas de LC; zend: dónde acaba la pernera."""
    path, rad = [], []
    for (z, cx, cy), r in zip(LC, prof):
        if z < zend - 1e-6:
            a, b = LC[len(path) - 1], (z, cx, cy)
            k = (a[0] - zend) / (a[0] - b[0])
            path.append((a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, zend))
            pr = prof[len(rad) - 1]
            rad.append((pr[0] + (r[0] - pr[0]) * k, pr[1] + (r[1] - pr[1]) * k))
            break
        path.append((cx, cy, z))
        rad.append(r)
    V, F = tube(path, rad, X, 14, 2.2, True, False)
    both("leg", V, F, slot, "legL", "legR", solid=0.01, soff=-1)
    if cuff:
        c, r = path[-1], rad[-1]
        V, F = tube([(c[0], c[1], zend + cuffh), (c[0], c[1], zend - 0.006)], [(r[0] + 0.006, r[1] + 0.006), (r[0] + 0.007, r[1] + 0.007)], X, 14, 2.2, False, False)
        both("turnup", V, F, cuff, "legL", "legR", solid=0.012)


def skirt(hem, flare, slot="bot", fn=None, tiers=0):
    zs = [1.01, 0.95, 0.88] + [0.88 - (0.88 - hem) * k / 3 for k in (1, 2, 3)]
    R = []
    for z in zs:
        rx, ry = (0.15, 0.1) if z > 1.0 else (0.17, 0.114) if z > 0.9 else (0.185 + flare * (0.9 - z), 0.125 + flare * 0.85 * (0.9 - z))
        R.append(ring((0, CY, z), UP, X, rx, ry, 20, 2.4, fn=fn if z < 0.9 else None))
    V, F = loft(R, True, True, False)
    mk("skirt", V, F, slot, "body", solid=0.012, soff=-1)
    for i in range(tiers):
        z = 0.88 - (0.88 - hem) * (i + 1) / (tiers + 1)
        rx, ry = 0.185 + flare * (0.9 - z) + 0.012, 0.125 + flare * 0.85 * (0.9 - z) + 0.012
        V, F = loft([ring((0, CY, zz), UP, X, rx * kk, ry * kk, 20, 2.4, fn=skirt_fn(0.05, 10)) for zz, kk in ((z + 0.03, 0.97), (z - 0.03, 1.05))], True)
        mk(f"tier{i}", V, F, "botl", "body", solid=0.008)
    hipsk = blob("under", (0, CY, 0.9), (0.15, 0.1, 0.08), slot)


PANT = [(0.092, 0.104), (0.097, 0.108), (0.093, 0.103), (0.092, 0.102), (0.096, 0.104), (0.102, 0.108), (0.104, 0.11)]


def bottom(n):
    reset()
    hide = []
    sc = lambda P, k: [(a * k, b * k) for a, b in P]
    if n in (0, 8):       # pantalón y vaqueros rotos
        hips(); legs(PANT, 0.135, cuff="botl"); hide = ["thigh", "shin"]
        if n == 8:
            hide = ["thigh"]
            for s in (1, -1):
                for j, z in enumerate((0.52, 0.68)):
                    blob(f"rip{j}" + "LR"[s < 0], (s * (0.104 - j * 0.004), -0.108 + j * 0.004, z), (0.04, 0.012, 0.016), "skin", "legL" if s > 0 else "legR", us=8, vs=5)
    elif n in (1, 15):    # pantalón corto y shorts vaqueros
        hips(); legs(PANT[:2] + [(0.104, 0.112)], 0.6 if n == 1 else 0.66, cuff="botl", cuffh=0.04)
    elif n == 7:          # bermudas cargo
        hips(); legs(PANT[:3] + [(0.1, 0.108)], 0.5, cuff="botd", cuffh=0.03)
        for s in (1, -1):
            V, F = loft([ring((s * 0.2, -0.004, z), (s, 0, 0), UP, 0.05, 0.045, 8, 4.0) for z in (0.66,)] * 2, True)
            blob("cargo" + "LR"[s < 0], (s * 0.196, -0.004, 0.66), (0.018, 0.05, 0.055), "botd", "legL" if s > 0 else "legR", us=8, vs=6)
    elif n == 3:          # pantalón pirata
        hips(); legs(PANT[:4] + [(0.09, 0.098)], 0.3, cuff="botd", cuffh=0.03); hide = ["thigh"]
    elif n == 5:          # mallas
        hips(k=0.97); legs([(0.088, 0.094), (0.086, 0.092), (0.075, 0.081), (0.06, 0.064), (0.062, 0.067), (0.05, 0.054), (0.042, 0.046)], 0.135); hide = ["thigh", "shin"]
    elif n == 6:          # pantalón ancho
        hips(); legs([(0.094, 0.106), (0.102, 0.112), (0.108, 0.116), (0.116, 0.122), (0.126, 0.13), (0.134, 0.138), (0.138, 0.142)], 0.1); hide = ["thigh", "shin"]
    elif n == 10:         # pantalón de chándal
        hips(); legs(PANT[:5] + [(0.092, 0.098), (0.07, 0.076)], 0.14, cuff="botd", cuffh=0.05); hide = ["thigh", "shin"]
        for s in (1, -1):
            V, F = tube([(s * 0.196, 0.0, 0.88), (s * 0.204, -0.008, 0.5), (s * 0.2, 0.004, 0.22)], [(0.005, 0.018)] * 3, BK, 6, 3.0)
            mk("stripe" + "LR"[s < 0], V, F, "botl", "legL" if s > 0 else "legR")
    elif n == 11:         # pantalón de traje
        hips(); legs([(0.09, 0.1), (0.092, 0.102), (0.084, 0.092), (0.08, 0.088), (0.078, 0.086), (0.078, 0.084), (0.078, 0.084)], 0.12); hide = ["thigh", "shin"]
        for s in (1, -1):
            V, F = tube([(s * 0.1, -0.106, 0.86), (s * 0.106, -0.104, 0.5), (s * 0.112, -0.082, 0.15)], [(0.012, 0.004)] * 3, X, 6, 3.0)
            mk("crease" + "LR"[s < 0], V, F, "botd", "legL" if s > 0 else "legR")
    elif n == 14:         # pantalón cargo
        hips(); legs(sc(PANT, 1.05), 0.135, cuff="botd", cuffh=0.04); hide = ["thigh", "shin"]
        for s in (1, -1):
            blob("cargo" + "LR"[s < 0], (s * 0.204, -0.004, 0.6), (0.02, 0.055, 0.07), "botd", "legL" if s > 0 else "legR", us=8, vs=6)
    elif n == 2:
        skirt(0.55, 0.22)
    elif n == 4:
        skirt(0.17, 0.12)
    elif n == 9:
        skirt(0.56, 0.24, fn=skirt_fn(0.045, 12))
    elif n == 12:
        skirt(0.68, 0.2)
    elif n == 13:
        skirt(0.55, 0.22, tiers=2)
    save(f"bot{n}", hide=hide)


# ================================================================ generar todo
heads()
base(False)
base(True)
for n in range(29):
    top(n)
for n in range(16):
    bottom(n)
shoe(0, toe="white", laces="white")
shoe(1, hk=1.05, sole_slot="shoed", shaft=0.3, shaft_r=1.1)
shoe(2, sole=0.036, sole_slot="shoed", straps=True)
shoe(3, hk=0.92, sole=0.032, sole_slot="shoed")
shoe(4, hk=1.0, sole=0.04, sole_slot="shoed", shaft=0.47, shaft_r=1.0)
shoe(5, hk=1.1, sole=0.055, sole_slot="shoed", shaft=0.3, shaft_r=1.14, laces="shoed", cuff="shoed")
shoe(6, toe="white", laces="white", shaft=0.21, shaft_r=1.04)
shoe(7, hk=1.05, sole=0.04, sole_slot="shoed", shaft=0.3, shaft_r=1.18)
shoe(8, hk=0.8, sole=0.02, sole_slot="shoed", heel=0.06, low=True)
shoe(9, hk=0.72, sole=0.022, sole_slot="shoed", low=True)
shoe(10, hk=0.86, sole=0.03, sole_slot="shoed", laces="shoed")
shoe(11, hk=1.1, sole=0.055, sole_slot="shoed", shaft=0.3, shaft_r=1.12, toe="shoed", laces="shoed")
json.dump(META, open(os.path.join(OUT, "tr_meta.json"), "w"), separators=(",", ":"))
print("TOTAL", sum(p["tris"] for p in META["pieces"].values()), "triángulos en", len(META["pieces"]), "piezas")
