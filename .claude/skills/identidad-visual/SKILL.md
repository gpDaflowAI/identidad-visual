---
name: identidad-visual
description: Aplica y audita la identidad visual del ERP (servicio tecnico y venta mayor/detal, Venezuela). Usar al crear o revisar cualquier pantalla, componente, grafica, PDF o recurso de marca: colores, tipografia Inter, moneda dual USD/Bs, tablas, insignias, WhatsApp.
---

# Identidad visual ERP

Fuente de verdad: `DESIGN.md` (explicacion) y `tokens/tokens.json` (valores).
Nunca escribas un hex, radio o tamano a mano en codigo de UI: usa `var(--color-*)`, `var(--radius-*)`, etc. de `tokens/tokens.css`.

## Antes de entregar cualquier UI

1. `node scripts/check-contrast.mjs` debe terminar sin FAIL si tocaste `tokens.json`.
2. Si cambiaste `tokens.json`: `node scripts/build-tokens.mjs` (nunca editar `tokens.css` a mano).
3. Revisa la lista de reglas de abajo contra tu cambio.
4. Mira `preview/index.html` (captura: `preview/muestra.png`) y comprueba que tu componente convive con el resto.

## Reglas no negociables

- **Un solo color de marca**: `primary`. El sidebar usa `sidebar`. Nada de segundos acentos.
- **#25D366 solo para WhatsApp** (icono y etiqueta de canal). Nunca como accion, exito ni en graficas. El exito es `success` (#16A34A).
- **Colores de estado como texto**: usar `*-text`, nunca `success`/`warning`/`info` planos sobre blanco (no pasan AA). `error` plano si pasa (4,83:1).
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

Cargar tambien la skill `dataviz` y reemplazar su paleta por una derivada de `primary` y los semanticos.
No usar `whatsapp` en graficas. No codificar significado solo con rojo/verde.

## Si falta algo

Si un componente necesita un valor que no existe, anadelo primero a `tokens/tokens.json` (marcado "(propuesto)"),
agrega su par a `contrast`, regenera y verifica. No lo hardcodees.
