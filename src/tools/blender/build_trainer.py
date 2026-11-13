# Modelo de prueba del entrenador hecho en Blender por instrucciones (sin interfaz).
# Ejes de Blender: X = izquierda del personaje, -Y = frente, Z = arriba. Unidades = las del visor del juego.
# Cada objeto se llama  segmento.color.nombre  (segmento: body, head, armL1, armL2, armR1, armR2, legL, legR).
import bpy, bmesh, math, json, sys
from math import pi, cos, sin
from mathutils import Vector

OUT = sys.argv[sys.argv.index("--") + 1]
bpy.ops.wm.read_factory_settings(use_empty=True)
MATS = {}


def mat(n):
    if n not in MATS:
        MATS[n] = bpy.data.materials.new(n)
    return MATS[n]


def mk(name, V, F, slot, seg="body", ss=2, solid=0.0, soff=1.0, grp="all"):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in V], [], F)
    me.update()
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(f"{seg}.{slot}.{name}.{grp}", me)
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
    """Tubo que sigue 'path' con un radio (rx, ry) en cada punto."""
    R = []
    for i, c in enumerate(path):
        a = Vector(path[max(0, i - 1)])
        b = Vector(path[min(len(path) - 1, i + 1)])
        R.append(ring(c, b - a, side, radii[i][0], radii[i][1], n, p, fn=fn))
    return loft(R, True, cap0, cap1)


UP = (0, 0, 1)
X = (1, 0, 0)
# ---------------------------------------------------------------- medidas
HK = 1.16                               # tamaño de la cabeza
HR = (0.168 * HK, 0.18 * HK, 0.19 * HK)  # radios de la cabeza (ancho, fondo, alto)
HC = Vector((0, 0.0, 1.415 + HR[2]))    # centro de la cabeza (la barbilla queda a 1.415)
SH = Vector((0.2, 0.0, 1.295))          # hombro izquierdo
EL = Vector((0.258, 0.012, 1.045))      # codo
WR = Vector((0.288, -0.022, 0.815))     # muñeca
HIP = Vector((0.09, 0.0, 0.9))          # arranque de la pierna
PIV = {"shL": list(SH), "elL": list(EL), "wrL": list(WR), "hipL": list(HIP), "head": list(HC), "hr": list(HR)}


# ---------------------------------------------------------------- cabeza
def head_shape(x, y, z, k=1.0):
    """De la esfera unidad a la forma de la cabeza: cráneo redondo, mejillas llenas y barbilla fina."""
    if z < 0:
        t = -z
        x *= 1 - 0.46 * t ** 1.7
        y *= (1 - 0.2 * t ** 1.6) if y < 0 else (1 - 0.5 * t ** 1.3)
        if y < 0:
            x *= 1 + 0.07 * math.exp(-((z + 0.38) / 0.24) ** 2)   # mejillas
    if y < -0.2:
        y *= 1 - 0.07 * (1 - min(1, abs(x) * 1.6))               # cara un poco más plana
    return Vector((HC.x + x * HR[0] * k, HC.y + y * HR[1] * k, HC.z + z * HR[2] * k))


def sphere(us=32, vs=20):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=us, v_segments=vs, radius=1.0)
    V = [v.co.copy() for v in bm.verts]
    F = [tuple(v.index for v in f.verts) for f in bm.faces]
    bm.free()
    return V, F


V, F = sphere(36, 24)
headV = [head_shape(*v) for v in V]
headO = mk("head", headV, F, "skin", "head", ss=0)
for s in (1, -1):   # orejas
    V2, F2 = sphere(12, 8)
    mk("ear" + ("L" if s > 0 else "R"), [Vector((s * (HR[0] * 0.97) + v.x * 0.026, 0.025 + v.y * 0.034, HC.z - 0.03 + v.z * 0.052)) for v in V2], F2, "skin", "head", ss=0)
# cuello
V, F = tube([(0, 0.014, 1.31), (0, 0.014, 1.39), (0, 0.012, 1.47)], [(0.058, 0.056), (0.05, 0.05), (0.054, 0.054)], X, 12, cap0=False, cap1=False)
mk("neck", V, F, "skin", "body", ss=1)


# ---------------------------------------------------------------- pelo: casquete + mechones
def hairline(ux, uy, uz):
    if uy < 0:
        return -0.12 + 0.62 * min(1, -uy) ** 1.6
    return -0.12 - 0.45 * min(1, uy * 1.4)


V, F = sphere(36, 24)
capV = []
keep = []
for v in V:
    m = (v.z - hairline(*v)) / 0.22
    k = 1.012 + 0.068 * max(0.0, min(1.0, m))
    capV.append(head_shape(v.x, v.y, v.z, k))
    keep.append(m > -0.02)
capF = [f for f in F if all(keep[i] for i in f)]
mk("cap", capV, capF, "hair", "head", ss=0)


def lock(name, base, d, length, w, th, bend=(0, 0, 0), n=8, slot="hair", tipw=0.06):
    """Mechón: lámina gruesa que sale de 'base' hacia 'd', se curva con 'bend' y acaba en punta."""
    base = Vector(base)
    d = Vector(d).normalized()
    bend = Vector(bend)
    nrm = (base - HC).normalized()
    side = d.cross(nrm)
    if side.length < 0.2:
        side = d.cross(Vector((0, 0, 1)))
        if side.length < 0.2:
            side = d.cross(Vector((1, 0, 0)))
    length *= HK
    w *= HK
    th *= HK
    R = []
    S = [-0.12, 0.0, 0.22, 0.45, 0.68, 0.86, 1.0]
    for s in S:
        c = base + d * length * s + bend * length * s * s
        tg = d + bend * 2 * s
        k = 1.0 if s <= 0 else max(tipw, (1 - s ** 1.5))
        if s < 0:
            k = 0.8
        R.append(ring(c, tg, side, w * k, th * k, n, 2.2))
    Vv, Ff = loft(R, True, True, True)
    mk(name, Vv, Ff, slot, "head", ss=1)


def on_head(az, el, k=1.03):
    """Punto sobre el pelo: az = giro (0 = frente, 90 = izquierda, 180 = nuca), el = elevación."""
    a, e = math.radians(az), math.radians(el)
    return head_shape(sin(a) * cos(e), -cos(a) * cos(e), sin(e), k)


def out_dir(az, el):
    a, e = math.radians(az), math.radians(el)
    return Vector((sin(a) * cos(e), -cos(a) * cos(e), sin(e)))


# puntas de la coronilla y de los lados (peinado «Puntiagudo»)
i = 0
for el, azs, ln, up in ((16, (70, 112, 150, 180, 210, 248, 290), 0.2, 0.5), (48, (40, 95, 150, 205, 265, 320), 0.19, 0.75), (78, (20, 140, 260), 0.17, 1.0)):
    for az in azs:
        o = out_dir(az, el)
        d = o + Vector((0, 0.18, up))
        lock(f"spk{i}", on_head(az, el, 0.99), d, ln * (0.92 + 0.16 * ((i * 7) % 3) / 2), 0.085, 0.06, bend=Vector((0, 0.05, 0.16)) - o * 0.05, n=8)
        i += 1
# flequillo: mechones en punta que caen sobre la frente, peinados hacia un lado
for j, (az, ln, sw) in enumerate(((-52, 0.17, -0.5), (-27, 0.185, -0.25), (-3, 0.2, 0.3), (24, 0.18, 0.45), (50, 0.17, 0.55))):
    b = on_head(az, 40, 1.03)
    lock(f"bang{j}", b, Vector((sw * 0.5, -0.16, -1)), ln, 0.062, 0.03, bend=Vector((sw * 0.25, 0.14, 0.05)), n=8)
# patillas y nuca
for s in (1, -1):
    lock(f"side{s}", on_head(s * 84, 12, 1.03), Vector((s * 0.1, -0.22, -1)), 0.19, 0.05, 0.032, bend=(-s * 0.08, 0.02, 0), n=8)
for j, az in enumerate((120, 150, 180, 210, 240)):
    o = out_dir(az, -10)
    lock(f"nape{j}", on_head(az, -8, 1.0), o * 0.55 + Vector((0, 0, -1)), 0.13, 0.062, 0.04, bend=o * 0.22, n=8)

# ================================================================ CUERPO BASE (piel)
# torso (queda bajo la ropa; se exporta por si una prenda lo deja ver)
TZ_ = [0.86, 0.93, 1.0, 1.1, 1.2, 1.27, 1.31, 1.345]
TX_ = [0.135, 0.15, 0.134, 0.146, 0.162, 0.168, 0.14, 0.075]
TY_ = [0.09, 0.098, 0.086, 0.094, 0.1, 0.098, 0.086, 0.062]
V, F = loft([ring((0, 0.008, z), UP, X, rx, ry, 16, 2.4) for z, rx, ry in zip(TZ_, TX_, TY_)], True, True, False)
mk("torso", V, F, "skin", "body", ss=2, grp="torsoskin")
# brazo: hombro redondo, brazo, codo, antebrazo que se estrecha hacia la muñeca
V, F = tube([SH + Vector((-0.05, 0, 0.004)), SH + Vector((-0.004, 0, 0.004)), SH.lerp(EL, 0.35), SH.lerp(EL, 0.75), EL + Vector((0.003, 0, -0.015))],
            [(0.04, 0.046), (0.056, 0.058), (0.05, 0.053), (0.045, 0.047), (0.041, 0.043)], (0, 1, 0), 12, 2.0)
both("upperarm", V, F, "skin", "armL1", "armR1", ss=2, grp="armskin")
V, F = tube([EL + Vector((-0.003, 0, 0.022)), EL.lerp(WR, 0.25), EL.lerp(WR, 0.6), WR + Vector((0, 0, 0.02)), WR + Vector((0, 0, -0.004))],
            [(0.04, 0.042), (0.044, 0.046), (0.038, 0.041), (0.03, 0.034), (0.027, 0.032)], (0, 1, 0), 12, 2.0)
both("forearm", V, F, "skin", "armL2", "armR2", ss=2, grp="armskin")

# ---- mano con dedos: palma, cuatro dedos de tres falanges algo curvados y pulgar
hd = (WR - EL).normalized()                      # hacia dónde cuelga la mano
pn = Vector((-1, 0, 0))                          # hacia dónde mira la palma (hacia el cuerpo)
pn = (pn - hd * pn.dot(hd)).normalized()
wd = hd.cross(pn).normalized()                   # ancho de la mano
if wd.y > 0:
    wd = -wd                                     # el ancho positivo apunta al frente (-Y): ahí va el índice
PALM = 0.082
V, F = loft([ring(WR + hd * d, hd, wd, w, t, 12, 3.0) for d, w, t in ((-0.012, 0.03, 0.026), (0.012, 0.038, 0.024), (0.045, 0.047, 0.023), (0.07, 0.048, 0.021), (PALM, 0.044, 0.017))], True, True, True)
both("palm", V, F, "skin", "armL2", "armR2", ss=2)
for k, (off, ln, r) in enumerate(((0.034, 0.074, 0.0118), (0.0115, 0.084, 0.0122), (-0.0115, 0.078, 0.0118), (-0.033, 0.062, 0.0105))):
    b = WR + hd * (PALM - 0.008 - abs(off) * 0.12) + wd * off
    pts = [b - hd * 0.012]
    d = hd.copy()
    c = b.copy()
    for seg, bend in enumerate((0.16, 0.3, 0.26)):
        d = (d + pn * bend).normalized()
        c = c + d * ln * (0.42, 0.33, 0.25)[seg]
        pts.append(c.copy())
    V, F = tube([pts[0], b] + pts[1:], [(r, r), (r, r), (r * 0.96, r * 0.96), (r * 0.9, r * 0.9), (r * 0.72, r * 0.72)], wd, 8, 2.0)
    both(f"finger{k}", V, F, "skin", "armL2", "armR2", ss=1)
tb = WR + hd * 0.022 + wd * 0.034 + pn * 0.004
td = (hd * 0.72 + wd * 0.6 + pn * 0.28).normalized()
V, F = tube([tb - td * 0.016, tb + td * 0.004, tb + td * 0.036, tb + (td + pn * 0.25).normalized() * 0.066], [(0.016, 0.015), (0.0165, 0.0155), (0.0138, 0.013), (0.0105, 0.01)], wd, 8, 2.0)
both("thumb", V, F, "skin", "armL2", "armR2", ss=1)

# pierna: muslo, rodilla, gemelo, tobillo y pie
V, F = tube([(0.088, 0.004, 0.93), (0.09, 0.0, 0.84), (0.094, -0.006, 0.66), (0.098, -0.012, 0.5), (0.1, -0.004, 0.36), (0.104, 0.006, 0.2), (0.106, 0.012, 0.11), (0.106, 0.012, 0.05)],
            [(0.08, 0.086), (0.084, 0.09), (0.072, 0.078), (0.056, 0.06), (0.059, 0.064), (0.046, 0.05), (0.038, 0.042), (0.04, 0.046)], X, 12, 2.0, True, True)
both("legskin", V, F, "skin", "legL", "legR", ss=2, grp="legskin")
V, F = tube([(0.105, 0.01, 0.245), (0.106, 0.012, 0.13)], [(0.056, 0.06), (0.052, 0.056)], X, 12, 2.0, False, False)
both("sock", V, F, "sock", "legL", "legR", ss=1, solid=0.008, grp="legskin")

# ================================================================ ROPA
# ---- camiseta interior (bajo la chaqueta)
Z = [0.9, 1.0, 1.1, 1.2, 1.275, 1.32, 1.36, 1.4]
RX = [0.15, 0.142, 0.156, 0.172, 0.178, 0.15, 0.085, 0.064]
RY = [0.098, 0.092, 0.1, 0.106, 0.104, 0.092, 0.07, 0.06]
V, F = loft([ring((0, 0.008, z), UP, X, rx, ry, 16, 2.5) for z, rx, ry in zip(Z, RX, RY)], True, True, False)
mk("shirt", V, F, "inner", "body", ss=2, grp="jacket")

# ---- chaqueta abierta
G = [0.5, 0.45, 0.4, 0.38, 0.42, 0.56, 0.9]           # media abertura del frente a cada altura
JZ = [0.905, 1.0, 1.1, 1.2, 1.275, 1.325, 1.372]
JX = [0.2, 0.19, 0.192, 0.2, 0.204, 0.176, 0.105]
JY = [0.134, 0.126, 0.127, 0.13, 0.126, 0.112, 0.085]
R = [ring((0, 0.008, z), UP, X, rx, ry, 19, 2.5, a0=-pi / 2 + g, a1=1.5 * pi - g) for z, rx, ry, g in zip(JZ, JX, JY, G)]
V, F = loft(R, False)
mk("jacket", V, F, "top", "body", ss=2, solid=0.02, grp="jacket")
R = [ring((0, 0.008, z), UP, X, rx, ry, 19, 2.5, a0=-pi / 2 + 0.5, a1=1.5 * pi - 0.5) for z, rx, ry in ((0.885, 0.204, 0.138), (0.935, 0.206, 0.139))]
V, F = loft(R, False)
mk("hem", V, F, "topd", "body", ss=2, solid=0.022, grp="jacket")
R = [ring((0, 0.016, z), UP, X, rx, ry, 15, 2.2, a0=-pi / 2 + g, a1=1.5 * pi - g) for z, rx, ry, g in ((1.345, 0.098, 0.082, 0.75), (1.4, 0.106, 0.092, 0.6), (1.45, 0.122, 0.104, 0.5))]
V, F = loft(R, False)
mk("collar", V, F, "topl", "body", ss=2, solid=0.016, grp="jacket")
V, F = tube([SH + Vector((-0.045, 0, 0.012)), SH + Vector((0.004, 0, 0.006)), SH.lerp(EL, 0.5), EL + Vector((0.004, 0, -0.02))], [(0.05, 0.058), (0.076, 0.08), (0.072, 0.074), (0.066, 0.068)], (0, 1, 0), 12, 2.1)
both("sleeveA", V, F, "top", "armL1", "armR1", ss=2, grp="jacket")
V, F = tube([EL + Vector((-0.004, 0, 0.03)), EL.lerp(WR, 0.5), WR + Vector((-0.003, 0, 0.034)), WR + Vector((0, 0, 0.016))], [(0.062, 0.064), (0.064, 0.066), (0.062, 0.064), (0.05, 0.052)], (0, 1, 0), 12, 2.1)
both("sleeveB", V, F, "top", "armL2", "armR2", ss=2, grp="jacket")
V, F = tube([WR + Vector((-0.002, 0, 0.044)), WR + Vector((0, 0, 0.008))], [(0.054, 0.056), (0.052, 0.054)], (0, 1, 0), 12, 2.1, False, False)
both("cuff", V, F, "topd", "armL2", "armR2", ss=1, solid=0.012, grp="jacket")

# ---- camiseta de manga corta
Z = [0.9, 1.0, 1.1, 1.2, 1.29, 1.345, 1.372, 1.392]
RX = [0.184, 0.176, 0.172, 0.182, 0.194, 0.19, 0.125, 0.08]
RY = [0.124, 0.118, 0.114, 0.114, 0.11, 0.098, 0.08, 0.07]
V, F = loft([ring((0, 0.008, z), UP, X, rx, ry, 16, 2.5) for z, rx, ry in zip(Z, RX, RY)], True, False, False)
mk("tee", V, F, "top", "body", ss=2, solid=0.012, soff=-1, grp="tee")
V, F = tube([(0, 0.01, 1.378), (0, 0.01, 1.398)], [(0.08, 0.072), (0.076, 0.068)], X, 14, 2.2, False, False)
mk("teeneck", V, F, "topd", "body", ss=1, solid=0.012, grp="tee")
V, F = tube([SH + Vector((-0.05, 0, 0.004)), SH + Vector((-0.002, 0, 0.004)), SH.lerp(EL, 0.34), SH.lerp(EL, 0.58)], [(0.046, 0.054), (0.066, 0.068), (0.062, 0.064), (0.066, 0.068)], (0, 1, 0), 12, 2.1, True, False)
both("teesleeve", V, F, "top", "armL1", "armR1", ss=2, solid=0.01, soff=-1, grp="tee")

# ---- pantalón largo holgado
V, F = loft([ring((0, 0.008, z), UP, X, rx, ry, 16, 2.5) for z, rx, ry in ((1.01, 0.148, 0.097), (0.95, 0.166, 0.11), (0.88, 0.178, 0.116), (0.82, 0.15, 0.1))], True, True, True)
mk("hips", V, F, "bot", "body", ss=2)
LZ = [0.9, 0.78, 0.6, 0.46, 0.32, 0.2, 0.135]
LR = [(0.092, 0.104), (0.097, 0.108), (0.093, 0.103), (0.092, 0.102), (0.096, 0.104), (0.102, 0.108), (0.104, 0.11)]
LC = [(0.092, 0.006), (0.098, 0.0), (0.103, -0.008), (0.106, -0.012), (0.109, -0.004), (0.111, 0.004), (0.112, 0.006)]
V, F = tube([(c[0], c[1], z) for c, z in zip(LC, LZ)], LR, X, 14, 2.2, True, False)
both("leg", V, F, "bot", "legL", "legR", ss=2, grp="pants")
V, F = tube([(0.112, 0.006, 0.195), (0.112, 0.006, 0.125)], [(0.11, 0.116), (0.111, 0.117)], X, 14, 2.2, False, False)
both("turnup", V, F, "botl", "legL", "legR", ss=1, solid=0.012, grp="pants")
# ---- pantalón corto
V, F = tube([(c[0], c[1], z) for c, z in zip(LC[:3], (0.9, 0.78, 0.6))], [(0.092, 0.104), (0.1, 0.11), (0.104, 0.112)], X, 14, 2.2, True, False)
both("short", V, F, "bot", "legL", "legR", ss=2, solid=0.01, soff=-1, grp="shorts")
V, F = tube([(0.103, -0.008, 0.635), (0.103, -0.008, 0.595)], [(0.107, 0.115), (0.108, 0.116)], X, 14, 2.2, False, False)
both("shorthem", V, F, "botl", "legL", "legR", ss=1, solid=0.008, grp="shorts")
# ---- cinturón y hebilla
V, F = tube([(0, 0.008, 1.012), (0, 0.008, 0.978)], [(0.153, 0.101), (0.158, 0.105)], X, 16, 2.5, False, False)
mk("belt", V, F, "belt", "body", ss=1, solid=0.01, grp="belt")
V2, F2 = sphere(8, 6)
mk("buckle", [Vector((v.x * 0.024, -0.103 + v.y * 0.008, 0.995 + v.z * 0.018)) for v in V2], F2, "gold", "body", ss=0, grp="belt")


# ---------------------------------------------------------------- zapatillas grandes
def shoe_ring(y, w, h, z0, n=12):
    """Sección de la zapatilla en el plano XZ: arriba redonda, abajo plana."""
    pts = []
    for i in range(n):
        a = 2 * pi * i / n
        x = math.copysign(abs(cos(a)) ** 0.8, cos(a)) * w
        z = sin(a)
        z = z0 + (h * (0.5 + 0.5 * z) if z > 0 else h * 0.5 * (1 + z) ** 0.45)
        pts.append(Vector((x, y, z)))
    return pts


def turned(V, ang, cx, cy):
    out = []
    for v in V:
        x, y = v.x, v.y
        out.append(Vector((cx + x * cos(ang) - y * sin(ang), cy + x * sin(ang) + y * cos(ang), v.z)))
    return out


FA = math.radians(11)     # puntas de los pies un poco hacia fuera
SX, SY = 0.108, 0.02
ST = ((0.105, 0.035, 0.09), (0.09, 0.068, 0.13), (0.04, 0.078, 0.15), (-0.03, 0.082, 0.126), (-0.1, 0.086, 0.102), (-0.165, 0.084, 0.086), (-0.205, 0.066, 0.072), (-0.228, 0.036, 0.056))
V, F = loft([shoe_ring(y, w, h, 0.03) for y, w, h in ST], True, True, True)
both("shoe", turned(V, FA, SX, SY), F, "shoe", "legL", "legR", ss=2)
V, F = loft([shoe_ring(y * 1.03, w + 0.004, 0.044, 0.0) for y, w, h in ST], True, True, True)
both("sole", turned(V, FA, SX, SY), F, "sole", "legL", "legR", ss=2)
V, F = loft([shoe_ring(y, w + 0.009, h + 0.01, 0.028) for y, w, h in ((-0.15, 0.078, 0.082), (-0.168, 0.084, 0.086)) + ST[6:]], True, True, True)
both("toe", turned([v + Vector((0, -0.006, 0)) for v in V], FA, SX, SY), F, "white", "legL", "legR", ss=2)
for j, y in enumerate((-0.005, -0.04, -0.075)):     # cordones
    V, F = loft([shoe_ring(y + dy, 0.05 - j * 0.004, 0.02, 0.143 - j * 0.014 - (0.006 if dy else 0)) for dy in (0.012, 0.0, -0.012)], True, True, True)
    both(f"lace{j}", turned(V, FA, SX, SY), F, "white", "legL", "legR", ss=1)

# ---------------------------------------------------------------- exportar
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", export_apply=True, export_texcoords=False, export_materials="EXPORT")
# relieve de la cara (para que el juego coloque ojos, cejas y boca pegados a la malla)
dg = bpy.context.evaluated_depsgraph_get()
ho = headO.evaluated_get(dg)
grid = []
for iz in range(42):
    row = []
    for ix in range(41):
        x, z = -0.2 + ix * 0.01, 1.41 + iz * 0.01
        hit, loc, nrm, _ = ho.ray_cast(Vector((x, -1.0, z)), Vector((0, 1, 0)))
        row.append(round(-loc.y, 4) if hit else None)
    grid.append(row)
tris = 0
for o in bpy.context.scene.objects:
    e = o.evaluated_get(dg)
    me = e.to_mesh()
    me.calc_loop_triangles()
    tris += len(me.loop_triangles)
    e.to_mesh_clear()
json.dump({"piv": PIV, "face": {"x0": -0.2, "y0": 1.41, "d": 0.01, "g": grid}, "tris": tris}, open(OUT.replace(".glb", ".json"), "w"))
print("OK", len(bpy.context.scene.objects), "objetos,", tris, "triángulos")
