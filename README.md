# OpoAsturias · Tu temario en vídeos

Aplicación web para instalar desde Brave en Android y preparar **Administrativo C1 del Principado de Asturias, turno libre**. Incluye los 34 temas del ANEXO II oficial, 105 vídeos únicos (66 de Paco Barbié), favoritos, vídeos vistos y notas por tema.

Hay recursos para **31 de los 34 temas**. La cobertura es parcial: cada tema explica qué falta. I.4, II.4 y III.3 no tienen un vídeo específico localizado. Consulta [COBERTURA.md](./COBERTURA.md) para ver fuentes, huecos y criterios de selección.

## Publicar en GitHub: paso a paso

1. Entra en tu cuenta de GitHub y crea un repositorio **público**, por ejemplo `opoasturias-videos`. GitHub Pages puede utilizarse con repositorios públicos en el plan gratuito.
2. Descomprime el ZIP. Abre la carpeta que contiene `index.html`.
3. En el repositorio, elige **Add file → Upload files**. Arrastra los archivos y las carpetas descomprimidos. **Sube el contenido, no el ZIP**. `index.html` debe quedar en la raíz del repositorio, junto a `app.js`, `styles.css`, `manifest.webmanifest` y las carpetas `icons`, `data` y `tests`.
4. Incluye también `.nojekyll` y `.gitignore`. Si no los ves en el explorador, activa la visualización de archivos ocultos. Guarda los cambios con **Commit changes** en la rama `main`.
5. Abre **Settings → Pages**. En **Build and deployment**, selecciona **Deploy from a branch**, rama **main** y carpeta **/(root)**. Pulsa **Save**.
6. Espera a que GitHub termine la publicación. La dirección aparecerá en esa misma pantalla y tendrá la forma `https://TU-USUARIO.github.io/opoasturias-videos/`.
7. Abre **esa dirección HTTPS** en Brave para Android. No se instala desde la pantalla del repositorio ni abriendo el archivo HTML con doble clic.

No necesitas ejecutar comandos, contratar un servidor, instalar Node ni conseguir claves de YouTube para publicarla.

Documentación de referencia: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) y [crear un sitio](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Instalar en Android y abrir con Brave

1. Publica los archivos en GitHub Pages siguiendo los pasos anteriores.
2. Instala **Brave** en tu teléfono si todavía no lo tienes.
3. Abre en **Brave para Android** la dirección HTTPS de la app publicada. Si estás en otro navegador, en los ajustes de la app tienes «Abrir esta app en Brave» y «Copiar dirección de la app».
4. En el menú **⋮** de Brave elige **Añadir a la pantalla de inicio** y confirma. Según la versión, puede aparecer como «Instalar aplicación». Si se ofrece el botón de instalación de la propia web, también puedes utilizarlo.
5. Abre **OpoAsturias** desde ese icono. El acceso creado en Brave queda asociado a Brave. Si lo habías creado desde Chrome, crea el nuevo desde Brave.

Es una **aplicación web instalable / acceso PWA**, no un APK. Brave puede presentarla como un acceso a pantalla de inicio con comportamiento de aplicación; la integración exacta depende de su versión y de Android.

### Vídeos en Brave por defecto

En Android, las tarjetas y los capítulos utilizan enlaces explícitos al paquete de Brave (`com.brave.browser`) cuando pulsas **Ver en Brave**. No hay redirecciones automáticas. Si el navegador no puede resolver esa apertura, se vuelve a la ayuda de instalación. Cada tarjeta conserva un **Enlace normal** como alternativa.

Brave debe estar instalado; una web no puede instalarlo ni cambiar las preferencias del teléfono. Si Android pregunta qué aplicación debe abrir un enlace, elige Brave. También puedes elegirlo como navegador predeterminado en **Ajustes → Aplicaciones → Aplicaciones predeterminadas → Navegador**, según el fabricante. Los enlaces normales pueden seguir las asociaciones de Android, incluida la app de YouTube.

Las notas de Chrome y Brave son independientes: exporta una copia desde Chrome e impórtala en Brave si ya habías estudiado con el otro navegador.

Referencias: [ayuda oficial de Brave para Android](https://support.brave.app/hc/en-us/articles/36769337426445-How-do-I-set-Brave-as-my-default-browser-Android) y [enlaces Android Intent](https://developer.chrome.com/docs/android/intents).

## Estudiar con la app

- **Mi escritorio**: los cinco bloques, número de vídeos, progreso y último tema abierto.
- **Todos los vídeos**: búsqueda por tema, norma, título o canal. No hace falta escribir tildes. Los resultados mantienen el orden del programa.
- **Cada tema**: título breve, enunciado oficial completo, alcance pendiente, vídeos ordenados y notas.
- **Ver en Brave** (Android): solicita abrir el vídeo en Brave. En ordenador, **Ver en YouTube** abre otra pestaña. Algunos incluyen botones para ir directamente a capítulos comprobados.
- **Marcar visto**: lo decides tú. Abrir un enlace no lo marca automáticamente.
- **Favorito**: guarda un vídeo para localizarlo con el filtro de favoritos.
- **Mis notas**: guardado automático al escribir. Se permiten hasta 50.000 caracteres por tema.
- **Ajustes (⚙)**: exportar o importar una copia de los datos.

Una misma grabación puede aparecer en varios temas con diferentes capítulos. El marcado de visto y favorito corresponde al **vídeo completo** y se comparte entre esos temas. El porcentaje de vídeos vistos no equivale a cobertura del programa ni a progreso de aprendizaje.

## Copias de tus notas y progreso

Los datos se guardan en el almacenamiento local de este navegador y dirección. No se envían a GitHub ni a los autores de los vídeos. Otro dispositivo, perfil de Chrome o dirección web tendrá su propio progreso.

Pulsa **Exportar mis datos** para descargar un JSON. En el otro dispositivo, abre la app, pulsa **Importar copia** y selecciona ese archivo. La aplicación mostrará el contenido compatible y pedirá confirmación antes de **reemplazar** los datos existentes. Exporta primero si quieres conservar la situación anterior.

Las copias con formato incorrecto se rechazan. Las referencias a vídeos o temas que ya no existan en el catálogo se omiten. No hay sincronización automática. Borrar los datos del navegador puede borrar el progreso; cambiar el nombre del repositorio cambia la dirección y requiere importar una copia.

## Uso sin conexión

Después de la primera carga completa, el catálogo, la navegación y las notas funcionan sin conexión. Para reproducir vídeos necesitas internet. La aplicación no descarga vídeos ni sus audios. Si el almacenamiento está bloqueado o se llena, se mostrará un aviso para exportar los datos.

## Actualizar los vídeos o la aplicación

1. Edita `data/catalog.json`. El catálogo está separado de la interfaz.
2. Conserva los identificadores de los temas (`I.1`, etc.) y los identificadores de YouTube de los vídeos existentes. Así se conserva el progreso.
3. Cada vídeo nuevo debe tener título, canal, URL directa, fecha y método de comprobación. `preferred` solo es `true` para el canal principal de Paco Barbié. Verifica la correspondencia antes de añadirlo a `topics[].videos`.
4. En cada relación tema/vídeo indica `scope` (alcance) y `kind`: `explanation`, `audio` o `supplement`. Los capítulos opcionales contienen `label` y `seconds`, tomados de una fuente comprobada.
5. Actualiza `coverageNote`, la fecha del catálogo y `COBERTURA.md`. Mantén los temas sin vídeo y no declares una cobertura completa basándote en un título.
6. **Cambia la constante `VERSION` de `sw.js` en cada publicación**, también si solo cambias el catálogo. Por ejemplo, termina el nombre en `-r2`. Esto crea una caché nueva y evita mezclar versiones.
7. Sube los archivos modificados a `main`. GitHub los publicará. Los usuarios con una versión anterior verán **Actualizar ahora** al detectarse la nueva versión; actualizar no borra sus notas ni progreso.

El service worker conserva juntos los archivos de cada versión. Solo gestiona la caché de esta aplicación y su subcarpeta; no intercepta ni almacena YouTube. No hay búsqueda automática ni claves API expuestas.

## Archivos incluidos

| Archivo o carpeta | Uso |
| --- | --- |
| `index.html`, `styles.css`, `app.js`, `state.js`, `android.js` | Interfaz, navegación y progreso |
| `data/catalog.json` | Temario oficial y vídeos seleccionados |
| `manifest.webmanifest`, `sw.js`, `icons/` | Instalación y funcionamiento sin conexión |
| `.nojekyll` | Publicación estática directa |
| `COBERTURA.md` | Correspondencia, fuentes y huecos |
| `PRUEBAS.md`, `tests/`, `package.json` | Resultados y pruebas de datos |
| `preview.png` | Vista previa del diseño |

## Comprobaciones para quien mantenga el código

No hay dependencias de producción ni proceso de compilación. Opcionalmente, con Node 20 o posterior, ejecuta `npm test` para comprobar el orden de los temas, referencias, manifest y lógica de importación/filtros. No requiere `npm install`.

Para probar localmente, sirve la carpeta con un servidor HTTP, por ejemplo `python -m http.server 8000`, y abre `http://localhost:8000/`. No uses `file://`.

Comprueba en Chrome **Application → Manifest / Service Workers** la instalación y la caché. También revisa una actualización real, el modo sin conexión, notas, exportación/importación y las pantallas móvil y escritorio. El diseño usa rutas relativas y navegación por fragmentos para funcionar dentro de una subcarpeta de GitHub Pages.

## Alcance editorial

Fuente del temario: PDF oficial facilitado por el usuario, BOPA 2026-06678, ANEXO II, páginas 16–20. El enunciado se conserva; los títulos breves solo ayudan a navegar. Las denominaciones históricas y posibles discordancias del programa se explican en las notas de cobertura.

La revisión de fichas de YouTube comprueba existencia, atribución, disponibilidad indicada y correspondencia apoyada por descripciones o capítulos. **No supone haber visto íntegramente los vídeos ni haber auditado jurídicamente todas sus explicaciones.** Las fechas antiguas y las normas estatales de apoyo están señaladas. La aplicación es independiente y no está afiliada al Principado, a YouTube ni a los autores.

Los vídeos pertenecen a sus autores y se abren en YouTube. No se incluyen en el repositorio el manual personal, los archivos de trabajo ni los datos de estudio del usuario.


## Versión con enunciados oficiales completos

Los 34 temas aparecen íntegros en el índice, navegación y biblioteca, incluso sin vídeos o sin resultados de los filtros. Catálogo ampliado a 105 vídeos; consulta REVISION-VIDEOS.md para las incorporaciones y límites de cobertura.

## Preparación y repasos (versión 1.3)

- Plan diario configurable de 1 a 5 temas. Prioriza fechas vencidas, últimas prácticas con menos del 70 % de aciertos y temas en estudio. Ese umbral organiza el repaso y no representa una nota oficial.
- Seguimiento independiente de los vídeos: estado del tema, lectura, esquema, recuerdo y práctica.
- Repaso manual con intervalos orientativos de 1, 3, 7, 14 y 30 días; botón de refuerzo al día siguiente y fecha editable. Se muestra dentro de la app, sin notificaciones externas.
- Cuaderno de errores por tema y registro de las últimas 20 prácticas (total y aciertos). No calcula penalizaciones ni contiene un banco de preguntas oficial.
- Conserva notas, favoritos y vídeos vistos de versiones anteriores. Las copias JSON incluyen el nuevo seguimiento y aceptan las copias antiguas.
- Los títulos oficiales completos, el orden y los avisos de cobertura se mantienen. La preparación exige contrastar el material y practicar; el seguimiento es una valoración personal.

## Lectura por temas (versión 1.4)

Cada tarea del plan diario tiene dos accesos: «Leer tema escrito» y «Vídeos y preparación». La lectura también se abre desde cada tema mediante `#lectura/I.1` (sustituir el identificador). Incluye el desarrollo de los 34 temas del manual reorganizado del 8 de septiembre, 68 preguntas originales con soluciones desplegables y material complementario de cuadros y cinco supuestos. Conserva los avisos de revisión pendientes del manual: no se ha realizado una nueva actualización jurídica. Los contenidos escritos se incluyen en la caché sin conexión tras instalar esta versión. Las notas y el seguimiento permanecen en la pantalla de preparación.
