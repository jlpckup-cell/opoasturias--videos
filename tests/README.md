# OpoAsturias · Test

Aplicación web instalable para practicar el ANEXO II de **Administrativo C1, turno libre, del Principado de Asturias**, BOPA 2026-06678. Conserva los 34 títulos completos y su orden.

**527 preguntas interactivas:** 129 oficiales (71 de la primera prueba y 58 de la segunda prueba IAAP de 2025) y 398 originales de estudio. **73 recursos externos** y **47 documentos de exámenes y plantillas**. Son categorías distintas: no se suman las preguntas anunciadas por los proveedores al banco integrado.

## Abrir e instalar

[Abrir la aplicación](https://jlpckup-cell.github.io/opoasturias--videos/tests/).

En Android, abre esa dirección en Brave o Chrome, entra en el menú y elige **Instalar aplicación** o **Añadir a pantalla de inicio**. En iPhone, abre con Safari y utiliza Compartir → Añadir a pantalla de inicio. En ordenador, utiliza el icono de instalación del navegador cuando esté disponible. No es un APK.

La app tiene su propio nombre, icono, manifest y ámbito `/tests/`. El progreso se guarda separado del de la aplicación de vídeos. La integración concreta de instalación depende del navegador y sistema operativo.

## Uso

- Elige un tema y configura cantidad, origen, modo, tiempo y penalización.
- En **Examen** se corrige al terminar; en **Estudio** puedes comprobar cada respuesta y consultar su explicación.
- **Crear un test mixto** permite seleccionar temas. Las preguntas se eligen al azar sin repeticiones dentro del test; si no hay tantas como solicitas, se usan las disponibles.
- Al terminar, verás nota, aciertos, errores y blancas, y podrás consultar todas las respuestas o solo las pendientes.
- **Mis errores** incluye fallos y blancas de los test finalizados. Acertar una pregunta en otro test finalizado la elimina de la lista.
- El test en curso se conserva al salir o recargar. Si tiene límite de tiempo, el reloj sigue corriendo al cerrar la app y se corrige al volver si ha vencido.
- **Historial** conserva los últimos 200 test. En **Ajustes** puedes exportar o importar una copia JSON. Importar reemplaza el progreso después de mostrar confirmación.

La nota es orientativa: `máx(0, 10 × (aciertos − errores × penalización) / total)`. La opción predeterminada es **1/3 por error**, correspondiente al turno libre del programa. Se ofrecen también práctica sin penalización y 1/5, que corresponde a promoción interna. No se reproduce la transformación ni el corte de calificación del tribunal. El modo estudio no es equivalente a un examen sin consultar soluciones.

## Sin conexión y privacidad

Tras completar la primera carga, el banco, las explicaciones y el progreso funcionan sin conexión. Los enlaces externos necesitan internet y su corrección se realiza en cada proveedor. La app no tiene cuenta, analítica ni sincronización de progreso. Borrar el almacenamiento del navegador puede eliminar tus datos: exporta copias.

## Fuentes y límites

Consulta [COBERTURA.md](./COBERTURA.md). La búsqueda es amplia, pero no exhaustiva de todo internet. No se copian bancos privados, muestras editoriales ni preguntas de autores de Daypo. Se enlazan con atribución y condiciones orientativas. No se ha auditado cada pregunta de esos bancos.

Las preguntas originales son material de práctica, no preguntas encontradas en un examen. Las oficiales conservan su respuesta histórica y están identificadas. Las explicaciones son editoriales. La cobertura de todos los temas es parcial; hay apartados expresamente pendientes. La normativa debe ajustarse a la fecha exigida por la convocatoria.

## Publicar en otro repositorio

El ZIP incluye una aplicación estática completa. Sube su contenido, con `index.html` en la raíz elegida, a un repositorio público y habilita GitHub Pages desde la rama correspondiente. No requiere compilación ni dependencias de producción. Las rutas son relativas y funcionan tanto en raíz como en subcarpeta. Cambiar de dirección crea otro almacenamiento de progreso; utiliza la exportación e importación.

## Mantenimiento

El banco está en `data/bank.json`. Conserva los identificadores de preguntas para mantener el progreso. Antes de actualizar, verifica fuente, encaje en el programa, única respuesta correcta y explicación. Las preguntas anuladas se excluyen del banco puntuable. Cambia la versión de caché en `sw.js` y en el indicador de Ajustes de `app.js` en cada edición.

Ejecuta `npm test` con Node. Para previsualizar, sirve la carpeta con un servidor HTTP y abre su dirección local; no uses `file://`. El código puede alojarse bajo `/tests/` del repositorio de vídeos sin modificar sus archivos.
