# Mapas y delivery (Google Maps)

Archivos: `google-map-style.json` (generado desde tokens: `node scripts/build-map-style.mjs`), `markers.js` (marcadores, rutas, carga).
Componentes visuales: `components.css` seccion 13 (`.marker`, `.stop`, `.vehicle-card`, `.map-*`, `.eta`, `.signal`). Pantalla de referencia: `preview/delivery.html`.

> `markers.js` esta escrito contra la API documentada de Google pero **no se probo contra Google** (no hay API key en el entorno de diseno). Valida en el primer arranque con una clave real y un Map ID.

## Decisiones tecnicas que condicionan el diseno

1. **Estilo en la nube + Map ID, no estilos JSON en el codigo.** Los marcadores avanzados (`AdvancedMarkerElement`), que permiten usar nuestros marcadores HTML/CSS, requieren un Map ID, y Google no permite mezclar estilo en la nube con estilos JSON en la misma app. Por eso `google-map-style.json` es la **especificacion** para recrear el estilo en Google Cloud Console > Map Styles (o importarlo si tu consola lo ofrece) y asociarlo a un Map ID de tipo JavaScript. Vigente a la fecha de esta guia: confirma en la documentacion de Google antes de implementar.
2. **Rutas: Routes API, no Directions API.** Directions esta marcada como "Legacy" por Google; para trabajo nuevo, Routes API (POST con cuerpo y *field mask*). Calcula la ruta al planificar o replanificar, **no con cada ping GPS** (costo).
3. **Seguimiento en vivo propio.** Google ofrece una solucion de flota (Fleet Engine / journey sharing) como producto aparte. Para este ERP se asume ingesta GPS propia (app del conductor -> backend -> mapa) con `AdvancedMarkerElement` + `Polyline`. Evaluar Fleet Engine solo si el volumen lo justifica.

## Reglas visuales

| Elemento | Regla |
|---|---|
| Color de ruta restante | `primary` (sigue al tema). Recorrida: `text-secondary`. Planificada: `border-input`, **discontinua** (no depender solo del color) |
| Marcador de vehiculo | Siempre **icono + color**; el estado tambien en texto en la lista (`.badge`). Detenido usa icono oscuro (blanco sobre ambar no pasa contraste) |
| Posicion antigua | `> 60 s` sin senal: `marker--stale` + "hace X min" en texto (`ErpMaps.freshness`) |
| Paradas | Numeradas; estados `pending` / `next` / `done` (check) / `failed` (x) |
| WhatsApp | #25D366 **no** se usa en el mapa |
| Mapa base | Sobrio y desaturado (`google-map-style.json`) para que ruta y marcadores resalten; sin POI ni transito |
| Controles | Los del ERP (`.map-controls`), no los por defecto (`disableDefaultUI`) |
| Atribucion | **No ocultar** el logo ni los avisos de Google (condicion de uso) |

## Estados que la pantalla debe cubrir
Cargando mapa (skeleton) · sin clave / Map ID (alerta + enlace a Configuracion > Integraciones) · **sin conexion** (el mapa no existe offline: mostrar solo la lista con ultima posicion conocida y aviso) · vehiculo sin senal · sin vehiculos · error de cuota/facturacion.

## Datos GPS - recomendaciones
- Frecuencia: 5-10 s en movimiento, 60 s detenido; enviar por lotes si falla la red y reordenar por marca de tiempo.
- Suavizar el movimiento del marcador (interpolar entre puntos) y descartar saltos imposibles; mostrar el circulo de precision (`.accuracy`) solo al seleccionar.
- Muchos vehiculos: agrupar marcadores (MarkerClusterer de Google).
- **Privacidad**: informa a los conductores y obten su consentimiento; rastrea solo durante el turno; define cuanto tiempo se guardan los recorridos. Consulta con un abogado si aplica una normativa a tu caso.
- **Costos**: restringe la clave por dominio (referente HTTP) y por API (Maps JavaScript + Routes), activa presupuesto y alertas de cuota en Google Cloud.

## Accesibilidad
El mapa no es accesible por teclado de forma util: **el panel de lista es la alternativa equivalente** (mismos datos, navegable, con estado en texto). Cada marcador debe tener `title`.

## Esquema de uso
```js
await ErpMaps.loadGoogleMaps(KEY);                      // inyecta el script con loading=async
const map = await ErpMaps.createMap(el, { mapId: MAP_ID, center: { lat: 10.49, lng: -66.88 }, zoom: 12 });
const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
new AdvancedMarkerElement({ map, position, title: 'Luis Perez - AB123CD',
  content: ErpMaps.vehicleMarker({ status: 'moving', selected: true }) });
new google.maps.Polyline({ map, path, ...ErpMaps.routeStyle('active') });
```
