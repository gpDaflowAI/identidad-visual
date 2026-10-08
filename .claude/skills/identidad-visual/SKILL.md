---
name: identidad-visual
description: Aplica y audita la identidad visual del ERP (servicio tecnico y venta mayor/detal, Venezuela). Usar al crear o revisar cualquier pantalla, componente, grafica, PDF o recurso de marca: colores, tipografia Inter, moneda dual USD/Bs, tablas, insignias, WhatsApp.
---

# Identidad visual ERP

Fuente de verdad: `DESIGN.md` (explicacion) y `tokens/tokens.json` (valores).
Nunca escribas un hex, radio o tamano a mano en codigo de UI: usa `var(--color-*)`, `var(--radius-*)`, etc. de `tokens/tokens.css`.

## Mapa del repo

`tokens/tokens.json` (fuente) -> `tokens.css` · `components/components.css` + `charts.js` · `icons/` (Lucide) · `fonts/` (Inter) ·
`theme/theme.js` (tema del panel) · `lib/format.js` (moneda es-VE) · `maps/` (Google Maps) · `modules/registry.json` · `preview/` (catalogo y pantallas).
Todo se regenera con `npm run build`; todo se verifica con `npm test`.

## Modulos nuevos (POS, delivery, los que vengan)

1. Declarar el modulo en `modules/registry.json` (valida contra `module.schema.json`; el icono debe existir en `icons/icons.json`).
2. Armar las pantallas **solo** con componentes de `components.css`. Si falta uno, anadirlo ahi y en `preview/src/componentes.html` con todos sus estados.
3. Plantillas de pagina: lista, detalle, formulario, dashboard, configuracion (con `.main`) o pantalla completa (POS, mapa).
4. Probar con `node` + axe-core antes de aceptar (0 violaciones) y a 1366 y 1920 px.

## Antes de entregar cualquier UI

1. `node scripts/check-contrast.mjs` debe terminar sin FAIL si tocaste `tokens.json`.
2. Si cambiaste `tokens.json`: `npm run build` (nunca editar `tokens.css`, `sprite.svg`, `google-map-style.json` ni `preview/*.html` a mano; las paginas se editan en `preview/src/`).
3. Revisa la lista de reglas de abajo contra tu cambio.
4. Abre `preview/componentes.html` (capturas en `preview/capturas/`) y comprueba que tu componente convive con el resto.

## Reglas no negociables

- **Un solo color de marca**: `primary`. El sidebar usa `sidebar`. Nada de segundos acentos.
- **#25D366 solo para WhatsApp** (icono y etiqueta de canal). Nunca como accion, exito ni en graficas. El exito es `success` (#16A34A).
- **Colores de estado como texto**: usar `*-text`, nunca `success`/`warning`/`info` planos sobre blanco (no pasan AA). `error` plano si pasa (4,83:1).
- **Texto secundario sobre fondo tintado** (fila seleccionada/hover, `primary-subtle`, burbuja WhatsApp): `text-secondary-strong` (la hoja de estilos ya lo aplica en esos componentes).
- **El color nunca va solo**: cada estado lleva palabra o icono ademas del color.
- **Moneda dual**: USD arriba, Bs debajo en `text-secondary` y mas pequeno; tasa BCV visible en la cabecera. Formato es-VE (`$1.248,00`, `Bs 45.576,96`). La tasa y la fecha de la tasa deben ser trazables.
- **Numeros**: `tabular-nums` en tablas, precios, totales, KPIs, porcentajes, fechas, horas; alineados a la derecha en tablas.
- **Tipografia**: solo Inter (tokens `headline-sm`, `body-md`, `table-num`, `label-xs`). Encabezados de columna en `label-xs` + `text-secondary`.
- **Forma**: radio 6 px controles, 10 px tarjetas/paneles, 4 px insignias. Filas de tabla 40 px.
- **Elevacion**: borde `border` antes que sombra. Solo overlays (modal, menu) llevan sombra.
- **Inputs**: contorno `border-input` (no `border`, que no llega a 3:1). Foco visible: anillo de 2 px `primary`.
- **Sin ilustraciones ni decoracion**. Tema claro; el oscuro esta previsto en tokens pero fuera de alcance.
- **Layout**: el sidebar va pegado al borde izquierdo, a toda la altura (sticky, 100vh) y con `var(--color-sidebar)`. El limite `container-max` (1440 px) aplica solo al contenido, nunca al contenedor que incluye el sidebar. Verificar a 1366, 1920 y 2560 px.
- **Cabecera**: indicador permanente de conexion (en linea / sincronizando / sin conexion + contador de pendientes).

## Graficas

Usar `components/charts.js`. Maximo 3 series (`chart-1..3`); la 4.a y siguientes -> "Otros" (`chart-other`) o graficas pequenas. Un solo eje Y, leyenda con >=2 series, etiqueta directa, vista de tabla. Nunca `whatsapp` ni colores de estado como series. Si cambias la paleta de series, validala con la skill `dataviz` (`validate_palette.js --pairs all`).

## Mapas (Google Maps)

Ver `maps/README.md`. Marcadores con `ErpMaps.vehicleMarker`; estado siempre en texto en las listas; ruta restante = `primary`, recorrida = gris, planificada = discontinua. Requiere Map ID (estilo en la nube). No ocultar la atribucion de Google. La lista es la alternativa accesible al mapa.

## Tema configurable

El panel de configuracion solo cambia `primary`, `sidebar`, logo, nombre y densidad, siempre a traves de `ErpTheme.deriveTheme` (corrige contraste y avisa). Nunca aplicar un color de marca directamente.

## Marca del cliente (nombre y logo)

Nombre y logo son **ranuras que configura el cliente**: nunca escribas un nombre ni un logo fijo en una pantalla. Usa el marcado `[data-brand]` del sidebar (`preview/src/_sidebar.html`) y `ErpTheme.applyBranding`. Sin configurar = **skeleton**, no texto de relleno. Subidas: `ErpTheme.validateLogoFile` (formatos, 512 KB, SVG sin scripts); un SVG de cliente solo va en `<img>`, jamas inline. Las medidas viven en `ErpTheme.BRAND_SPECS`; si las cambias, actualiza el CSS (lo vigila `npm test`) y la guia `preview/src/guia-cliente.html` se regenera sola.

## Si falta algo

Si un componente necesita un valor que no existe, anadelo primero a `tokens/tokens.json` (marcado "(propuesto)"),
agrega su par a `contrast`, regenera y verifica. No lo hardcodees.
