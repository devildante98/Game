# 🔴 Cápsula Pokémon · Gacha

Juego de gacha de Pokémon hecho en un solo archivo (`index.html`): tiradas, combates por turnos, entrenadores, Ligas, equipo, tienda, mochila, Centro Pokémon, música y más. Todo el arte está dibujado con código.

## Cómo publicarlo en GitHub Pages

1. Sube `index.html` a la raíz de este repositorio (**Add file → Upload files**) y borra el archivo antiguo `PokeGacha`.
2. Ve a **Settings → Pages**.
3. En **Build and deployment → Source** elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y pulsa **Save**.
4. Espera 1-2 minutos. La web quedará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

> El repositorio debe ser público para usar GitHub Pages gratis.

## Cuentas y guardado en la nube (Firebase)

El juego usa Firebase (proyecto `pokegacha-fdef9`) para el inicio de sesión y para guardar el progreso. En la [consola de Firebase](https://console.firebase.google.com/):

1. **Authentication → Método de acceso:** activa **Correo electrónico/contraseña** y, si quieres, **Google**.
2. **Authentication → Configuración → Dominios autorizados:** añade `TU-USUARIO.github.io`.
3. **Firestore Database:** crea la base de datos y, en **Reglas**, pega esto para que cada usuario solo lea y escriba su propia partida:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Las claves de configuración de Firebase que van dentro de `index.html` son públicas por diseño; lo que protege los datos son las reglas de arriba.

Si Firebase no está configurado o no hay conexión, se puede entrar con **«Jugar sin cuenta»**: el progreso se guarda solo en ese navegador.

## Notas

- Cada cuenta guarda su progreso por separado, incluso en el mismo navegador.
- En ⚙️ puedes **exportar e importar** la partida como archivo `.json`.
- El PVP online no está disponible en esta versión.
