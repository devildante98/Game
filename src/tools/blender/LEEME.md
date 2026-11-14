# Piezas 3D del entrenador hechas en Blender

`build_trainer.py` genera todas las piezas del entrenador y las exporta a `models/*.glb`
(más `models/tr_meta.json` con las articulaciones, el relieve de la cara y qué tapa cada prenda):

    pip install bpy
    python src/tools/blender/build_trainer.py -- models

Piezas: `head0`, `head1`, `head2` (cabeza con nariz y relieve: cara redonda, ovalada y cuadrada), `base_m`, `base_f` (cuerpo con manos y dedos), `top0`…`top28`, `bot0`…`bot15`, `shoe0`…`shoe11`.
Los números son los mismos que los de las opciones del editor de aspecto.

Cada objeto se llama `segmento.color.nombre[.etiqueta]`:

- segmento: `body`, `head`, `armL1`, `armL2`, `armR1`, `armR2`, `legL`, `legR` (lo que gira con cada articulación)
- color: `skin`, `top`, `topd`, `topl`, `inner`, `bot`, `botd`, `botl`, `shoe`, `shoed`, `sole`, `white` (el juego pone el color real)
- etiqueta: parte del cuerpo que una prenda puede tapar (`torso`, `uarm`, `farm`, `thigh`, `shin`, `foot`, `palm`, `finger`)

El juego las carga con `src/p_av3m.js`. Cualquier `.glb` se puede abrir en Blender (Archivo → Importar → glTF 2.0),
retocar y volver a exportar con el mismo nombre de archivo y los mismos nombres de objeto. Al exportar no hace falta
incluir normales ni coordenadas de textura.

El pelo, los gorros y los complementos todavía se dibujan con las formas de siempre, acopladas a la cabeza nueva.
