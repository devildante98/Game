# Poke Gacha Online — código fuente

El juego que se publica es un único archivo, `index.html`, que se **genera** a partir de los módulos de `src/`.
No edites el `index.html` publicado a mano: cambia los archivos de `src/` y vuelve a generarlo.

## Estructura del repositorio

```
/                         ← lo que publica GitHub Pages
├── index.html            ← juego final (generado)
├── sw.js                 ← service worker (app instalable)
├── manifest.webmanifest
├── icon-192.png, icon-512.png, icon-maskable-512.png
└── src/                  ← código fuente
    ├── assemble.py       ← script que genera index.html
    ├── orig.html         ← base HTML/CSS del juego
    ├── p_*.js            ← módulos de JavaScript (ver tabla)
    ├── add_*.py          ← parches que se aplican al montar (CSS, Firebase, retoques)
    ├── *.json            ← datos (habilidades, alturas, pesos, Pokémon)
    ├── pwa/              ← fuentes de la app instalable
    └── tests/            ← pruebas automáticas con Playwright
```

## Generar el juego

Requisitos: Python 3.

```bash
cd src
python3 assemble.py          # crea src/index.html
cp index.html ../index.html  # lo copia a la raíz para publicarlo
```

Cada vez que se genera, el juego recibe un número de versión nuevo: los jugadores
se actualizan solos al entrar (o ven el aviso «Hay una versión nueva»).

Si cambias algo de la app instalable, copia también `src/pwa/sw.js`,
`manifest.webmanifest` y los iconos a la raíz.

## Orden de montaje

`assemble.py` junta `orig.html` con los módulos en este orden:
`p_data, p_moves, p_items, p_fx, p_fx2, p_battle, p_bag, p_league, p_trainer, p_pvp, p_social`
y después ejecuta los parches `add_spr, add_feat, add_more, add_ui2, add_rar, add_hub, add_new`.

- `add_hub.py` inserta `p_hub.js` (menú, ventanas, ajustes).
- `add_new.py` inserta el resto de módulos nuevos en este orden:
  `p_new, p_chat, p_mini, p_mini2, p_extra, p_raid, p_market, p_supreme, p_upd, p_mgrank, p_abil, p_dbl, p_ext3, p_mod, p_pwa, p_tut`,
  añade las funciones de Firebase (`window.FB`), el CSS nuevo y la lista de **Novedades** está en `assemble.py` (constante `NEWS`).

Como todo acaba en un único `<script>`, los módulos posteriores amplían a los anteriores
sustituyendo funciones (`const _x = fn; fn = function(){ ... _x.apply(this, arguments) }`).
Por eso **el orden importa**.

## Qué hay en cada módulo

| Archivo | Contenido |
|---|---|
| `p_data.js`, `p_moves.js`, `p_items.js` | Datos de Pokémon, movimientos, objetos, objetos equipables y naturalezas |
| `p_battle.js` | Motor de combate (determinista, común a todos los modos) y combates normales |
| `p_fx.js`, `p_fx2.js` | Efectos visuales, Poké Balls, colocación de sprites |
| `p_bag.js`, `p_league.js`, `p_more.js` | Mochila, Liga, gimnasios y límite de nivel |
| `p_trainer.js` | Entrenador personalizable |
| `p_pvp.js`, `p_social.js` | PVP 1 vs 1 y 2 vs 2, amigos, gremios, intercambios |
| `p_hub.js` | Menú principal, ventanas, ajustes, alta definición |
| `p_new.js` | Ficha del Pokémon, guardería, Safari, Torre, expediciones, Salón de la Fama, regalos |
| `p_chat.js` | Chat, fotos temporales, invitaciones |
| `p_mini.js`, `p_mini2.js`, `p_mgrank.js` | Minijuegos, duelo de siluetas, torneo semanal y clasificaciones |
| `p_extra.js` | Mega/Gigamax/Dinamax, día y noche, horas felices, compañero, álbum, pase, invitaciones |
| `p_raid.js`, `p_market.js` | Incursiones y mercadillo |
| `p_supreme.js` | Formas supremas y Cristal Supremo |
| `p_upd.js` | Equipo visual, mejoras de tienda, sugerencias con fotos |
| `p_abil.js`, `p_dbl.js` | Habilidades y combate doble contra la máquina |
| `p_ext3.js` | Calendario, vitrina y estadísticas |
| `p_mod.js` | Moderación, reportes, sanciones y comprobaciones anti-trampas |
| `p_pwa.js`, `p_tut.js` | App instalable, notificaciones y tutorial |

## Pruebas

Requisitos: `pip install playwright` y `playwright install chromium`.
Las pruebas sirven los sprites desde una carpeta local (variable `SPRITES_DIR`,
copia de `sprites/` del repositorio PokeAPI/sprites); sin ella las imágenes no cargan,
pero las pruebas funcionan igual.

```bash
cd src && python3 assemble.py
cd tests
python3 t_ret.py "file://$(pwd)/../index.html"   # carga con partida guardada, sin errores
python3 t_auto2.py                                # 3 combates automáticos
```

## Datos de Pokémon

`build_data.py` regenera `gamedata.js` (que va dentro de `p_data.js`) a partir de los CSV de
PokeAPI (`POKEAPI_CSV=/ruta/a/pokeapi/data/v2/csv`). Solo hace falta si cambias rarezas o datos.

## Firebase

El juego usa Firebase Auth y Firestore (proyecto `pokegacha-fdef9`). Las reglas de Firestore
se gestionan desde la consola de Firebase; cada colección nueva necesita su regla
(chats, gifts, raids, market, tours, sdu, refs, reports, bans…).
