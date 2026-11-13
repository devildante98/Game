# Modelo del entrenador hecho en Blender (prueba)

`build_trainer.py` genera el modelo de prueba (cuerpo, cabeza, manos con dedos, peinado «Puntiagudo»,
chaqueta, camiseta, pantalón largo, pantalón corto y zapatillas) y lo exporta a `.glb`.

    pip install bpy
    python build_trainer.py -- salida/proto.glb

Crea también `proto.json` con las articulaciones y el relieve de la cara (el juego lo usa para colocar
ojos, cejas y boca sobre la malla).

Cada objeto se llama `segmento.color.nombre.grupo`:

- segmento: `body`, `head`, `armL1`, `armL2`, `armR1`, `armR2`, `legL`, `legR` (lo que gira con cada articulación)
- color: `skin`, `hair`, `top`, `topd`, `topl`, `inner`, `bot`, `botl`, `belt`, `shoe`, `sole`, `white`, `sock`, `gold`
- grupo: `all`, `jacket`, `tee`, `pants`, `shorts`, `armskin`, `legskin`, `torsoskin`, `belt` (qué prenda lo enseña)

`prueba_visor.js` es el arnés de pruebas: carga el `.glb` en el visor 3D del juego (`E.mesh`) para comparar
con el modelo actual. Todavía no forma parte del juego publicado.
