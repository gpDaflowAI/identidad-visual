---
name: ERP
description: ERP para servicio tecnico y venta al mayor y detal en Venezuela. Tema claro, un solo color de marca.
colors:
  primary: '#2563EB'
  primary-hover: '#1D4ED8'
  primary-subtle: '#EFF4FF'
  sidebar: '#1E3A8A'
  sidebar-text: '#FFFFFF'
  sidebar-text-muted: '#B4C5FF'
  background: '#F5F7FA'
  surface: '#FFFFFF'
  border: '#E5E7EB'
  border-input: '#8A919E'
  text-primary: '#111827'
  text-secondary: '#6B7280'
  text-secondary-strong: '#4B5563'
  success: '#16A34A'
  success-text: '#15803D'
  success-bg: '#DCFCE7'
  warning: '#F59E0B'
  warning-text: '#B45309'
  warning-bg: '#FEF3C7'
  error: '#DC2626'
  error-text: '#B91C1C'
  error-bg: '#FEE2E2'
  info: '#0EA5E9'
  info-text: '#0369A1'
  info-bg: '#E0F2FE'
  whatsapp: '#25D366'
  whatsapp-bg: '#E8FBEF'
  chart-1: '#2A78D6'
  chart-2: '#E87BA4'
  chart-3: '#4A3AA7'
  chart-other: '#6B7280'
typography:
  headline-sm: { fontFamily: Inter, fontSize: 1.25rem, fontWeight: '600', lineHeight: 1.75rem }
  body-md:     { fontFamily: Inter, fontSize: 0.875rem, fontWeight: '400', lineHeight: 1.25rem }
  table-num:   { fontFamily: Inter, fontSize: 0.875rem, fontWeight: '600', lineHeight: 1.25rem, letterSpacing: 0.01em }
  label-xs:    { fontFamily: Inter, fontSize: 0.75rem, fontWeight: '500', lineHeight: 1rem }
rounded:
  badge: 4px
  control: 6px
  card: 10px
  pill: 9999px
spacing:
  sidebar-width: 240px
  table-row-height: 40px
  container-max: 1440px
  gutter: 1rem
---

# Sistema visual - ERP

ERP para servicio tecnico y venta al mayor y detal en Venezuela.
Se usa ocho horas al dia: prioriza legibilidad, densidad controlada y colores con significado fijo.
Tema claro, un solo color de marca, sin ilustraciones ni decoracion.

> Fuente de verdad de los valores: `tokens/tokens.json`. Este documento los explica;
> `tokens/tokens.css` se genera con `node scripts/build-tokens.mjs`.
> Los tokens marcados "(propuesto)" en `tokens.json` no estaban en la spec original.

## Color

### Marca
| Token | Hex | Uso |
|---|---|---|
| primary | #2563EB | Acciones principales, enlaces, seleccion, foco |
| primary-hover | #1D4ED8 | Hover y pressed del boton principal |
| sidebar | #1E3A8A | Fondo de la barra lateral de navegacion (240 px) |

### Neutros
| Token | Hex | Uso |
|---|---|---|
| background | #F5F7FA | Fondo general de la aplicacion |
| surface | #FFFFFF | Tarjetas, tablas, paneles, modales |
| border | #E5E7EB | Separadores de tabla, divisores, contorno de tarjetas |
| border-input | #8A919E | Contorno de inputs, checkbox y radio (3:1 minimo) |
| text-primary | #111827 | Titulos, valores numericos, texto de tabla |
| text-secondary | #6B7280 | Etiquetas, encabezados de columna, metadatos, importes en Bs |

### Semanticos
Cada estado tiene tres valores: **color pleno** (relleno, icono, borde), **texto** y **fondo de insignia**.
Los colores plenos de success, warning e info NO alcanzan contraste AA como texto: usar la variante `-text`.

| Estado | Pleno | Texto | Fondo | Uso |
|---|---|---|---|---|
| success | #16A34A | #15803D | #DCFCE7 | Exito, pagos confirmados, variacion positiva |
| warning | #F59E0B | #B45309 | #FEF3C7 | Advertencia, pendientes, stock bajo |
| error | #DC2626 | #B91C1C | #FEE2E2 | Error, vencidos, sin stock, variacion negativa, accion destructiva |
| info | #0EA5E9 | #0369A1 | #E0F2FE | Informacion neutra |

### Canal
| Token | Hex | Uso |
|---|---|---|
| whatsapp | #25D366 | Reservado EXCLUSIVAMENTE a lo que ocurre por WhatsApp: conversaciones, mensajes enviados, icono y etiqueta del canal |

Regla estricta: #25D366 nunca se usa como color de accion, de exito ni en graficas.
El verde de estado positivo es siempre #16A34A.
#25D366 tiene 1,98:1 de contraste sobre blanco: nunca es el unico portador de significado;
siempre acompanado de la palabra "WhatsApp" en text-primary.

### Regla de color y significado
El color nunca va solo: todo estado lleva tambien texto o icono (aprox. 1 de cada 12 hombres tiene daltonismo).

## Tipografia

- Familia unica Inter para titulos, cuerpo y etiquetas. Fallback: system-ui.
- Numeros tabulares obligatorios (font-variant-numeric: tabular-nums) en tablas, precios,
  totales, KPIs, porcentajes, fechas y horas, para que las columnas alineen.
- Etiquetas y encabezados de columna en tamano reducido, medium, color #6B7280.

## Moneda dual

Todo monto se muestra en USD y, debajo, su equivalente en Bs a la tasa BCV del dia,
en gris secundario #6B7280 y tamano menor. La tasa BCV va visible en la cabecera.
Formato es-VE: punto para miles, coma para decimales ($1.248,00 / Bs 45.576,96).

## Cabecera

Indicador permanente de estado de conexion: en linea y sincronizado, sincronizando,
o sin conexion con contador de cambios pendientes.

## Forma, densidad y superficie

- Radio 6 px en botones, campos e inputs; 10 px en tarjetas y paneles; 4 px en insignias y pildoras.
- Tablas compactas de escritorio: filas de 40 px, cifras alineadas a la derecha.
- Elevacion minima: separar con borde #E5E7EB antes que con sombra.
- Escritorio 1440 px. Modo oscuro previsto en los tokens pero no se disena en esta ronda.

## Plantilla ERP y modulos

El ERP es una **plantilla**: un nucleo (Inicio, Ventas, Inventario, Servicio tecnico, WhatsApp) mas **modulos opcionales** que se activan en Configuracion (hoy POS y Delivery; vendran mas). La identidad visual por tanto incluye **todos los componentes aunque no esten en uso**; un modulo nuevo se arma con ellos y no introduce estilos propios.

- Cada modulo se declara en `modules/registry.json` (esquema: `modules/module.schema.json`): navegacion, permisos, secciones de configuracion y dependencias (p. ej. Delivery requiere la integracion Google Maps; si falta, el interruptor se bloquea y explica por que).
- Dos tipos de pantalla: **con `.main`** (listas, detalle, formularios, dashboard, configuracion) y **a pantalla completa** (`layout: full-bleed`: POS y mapas).
- Si un componente falta, se anade primero a `components/components.css` y al catalogo (`preview/componentes.html`), con todos sus estados; nunca dentro del modulo.

## Inventario de componentes (`components/components.css`)

| Familia | Componentes |
|---|---|
| Base | iconos (Lucide, 88), botones (4 variantes, 4 tamanos, estados, cargando, grupo), spinner, kbd |
| Formularios | campo (etiqueta/ayuda/error), input, select, textarea, grupo con addon, input con icono, checkbox, radio, interruptor, cantidad (normal y tactil), carga de archivos, selector de color, fieldset |
| Etiquetas | insignias (neutro, marca, 4 estados, WhatsApp), contador, chip, avatar |
| Contenedores | tarjeta (encabezado/pie/interactiva), KPI, lista de descripcion |
| Tablas | tabla densa (orden, seleccion, acciones, fila de 2 lineas), barra de herramientas, barra de seleccion multiple, pie con paginacion, cargando (skeleton), vacia |
| Navegacion | pestanas, migas de pan, enlace, progreso, linea de estados (pipeline), cronologia |
| Overlays | modal (sm/md/lg, destructivo), drawer, menu, tooltip, popover, toasts (4) |
| Feedback | alertas (4), estado vacio, skeleton |
| Layout | shell (sidebar normal y colapsado, cabecera), encabezado de pagina, barra de filtros, detalle + lateral, acciones fijas |
| Dominio ERP | moneda dual, tasa BCV (y "desactualizada"), estado de conexion (3), registro sin sincronizar, conversacion de WhatsApp |
| POS | tile de producto, carrito, totales, metodos de pago, teclado numerico, pantalla LCD, cantidad tactil |
| Delivery / mapa | split mapa+panel, marcadores de vehiculo (5 estados + seleccionado + antiguo), paradas, tarjeta de vehiculo, ETA, senal GPS, leyenda, controles, tarjeta flotante, circulo de precision |
| Graficas | barras y lineas (`components/charts.js`) con tooltip, leyenda, etiqueta directa y vista de tabla |
| Configuracion | secciones, filas de ajuste, filas de modulo, selector de color de marca, zona de logos |

## Configurabilidad (panel de configuracion)

| Configurable por el administrador | Derivado automaticamente | Bloqueado |
|---|---|---|
| Color de marca (`primary`), color del menu lateral, **nombre y logo (3 ranuras, opcionales)**, densidad (40 o 48 px) | hover, fondo tenue, texto del sidebar, anillo de foco, rutas del mapa | Semanticos (exito/advertencia/error/info), WhatsApp, tipografia, radios, series de graficas |

`theme/theme.js` (`ErpTheme.deriveTheme`) **valida y corrige** el color elegido: si el contraste con texto blanco o sobre `surface` es menor a 4,5:1 lo oscurece y lo avisa; si el color se parece al verde o rojo de los estados, avisa que puede confundirse. Esquema de lo que se guarda: `theme/theme.schema.json`. Probado en `scripts/test-theme.mjs`.

## Marca del cliente: nombre y logo (ranuras)

El producto es una plantilla: **el cliente pone su nombre y su logo** en Configuracion. Mientras no lo haga, las ranuras no muestran un nombre inventado sino un **skeleton** (silueta de marca + barra de nombre; estatico si esta sin configurar, con brillo mientras carga la configuracion).

| Ranura | Se usa en | Formato | Si falta |
|---|---|---|---|
| Nombre | Menu lateral, pestana del navegador, documentos | Hasta 40 caracteres | Skeleton |
| Logo fondo claro | Login, facturas y documentos impresos | SVG o PNG, alto max 44 px | Monograma + nombre |
| Logo menu lateral | Menu lateral expandido | Blanco o claro, SVG o PNG transparente, alto 28 px, ancho 160 px max | Monograma + nombre |
| Isotipo | Menu colapsado, favicon, avatar | Cuadrado 1:1, minimo 128 px | Monograma de 1-2 letras; favicon con el color de marca |

- Con logo se muestra **solo el logo**; el nombre queda como texto para lectores de pantalla (la imagen es decorativa).
- Archivos: SVG, PNG, JPG o WebP, hasta 512 KB. Los SVG se **rechazan** si traen scripts, eventos o enlaces externos y se muestran solo con `<img>`, nunca inline. Si el logo es raster y pequeno, se avisa.
- No hay forma de comprobar automaticamente que el logo "de menu lateral" se lea sobre el color elegido; la vista previa en vivo lo muestra y el panel avisa.
- **Guia para el cliente**: `preview/guia-cliente.html` (con ejemplos si/no, tabla de mensajes y resumen para su disenador). Las medidas se definen una sola vez en `BRAND_SPECS` (`theme/theme.js`).
- En el menu lateral caben ~17 letras (14 en MAYUSCULAS); el nombre completo se ve al pasar el cursor.
- Aplicar al arrancar con `ErpTheme.applyBranding(config)`; validar subidas con `ErpTheme.validateLogoFile(file, slot)`. Esquema: `theme/theme.schema.json`. Estados en `preview/componentes.html` (seccion "Marca del cliente").

## Densidad y objetivos tactiles

Escritorio compacto por defecto (fila 40 px, control 36 px); cómoda: 48/40 px. **Los modulos tactiles (POS) usan controles de 48 px** (`btn--touch`, `qty--touch`, tiles, teclado de 64 px) sin importar la densidad.

## Graficas

Reglas verificadas con la skill `dataviz` y su validador: **maximo 3 series** con color propio (azul `#2A78D6`, magenta `#E87BA4`, violeta `#4A3AA7`; validadas en todos los pares); desde la 4.a se agrupa en "Otros" (`chart-other`) o se divide en graficas pequenas. Los colores de estado y el de WhatsApp **no** se usan como series. Una sola serie usa `chart-1`. El magenta no llega a 3:1 sobre blanco: por eso toda grafica lleva etiqueta directa, leyenda y vista de tabla. Un solo eje; marcas finas; texto en tinta de texto, nunca en el color de la serie.

## Mapas y delivery

Ver `maps/README.md`. Resumen: Google Maps con estilo en la nube (Map ID) generado desde los tokens, marcadores propios (icono + color + texto de estado), ruta restante en `primary`, recorrida en gris, planificada discontinua; en la lista siempre esta el estado en texto y el panel de lista es la alternativa accesible al mapa.

## Decisiones tomadas al consolidar

La spec original traia dos juegos de valores que se contradecian. Se resolvio asi:

| Tema | YAML original | Cuerpo original | Decision |
|---|---|---|---|
| primary | #004AC6 | #2563EB | **#2563EB** (el cuerpo es explicito y la regla de "un solo color de marca" lo cita) |
| background | #F7F9FC | #F5F7FA | **#F5F7FA** |
| error | #BA1A1A | #DC2626 | **#DC2626** |
| Radios | 2/4/6/8/12 px | 4/6/10 px | **4/6/10 px** |
| Tokens M3 (on-*, container, fixed) | Si | No | **Eliminados**: no se usan en esta spec y confunden |

Anadidos para cumplir WCAG AA (verificados por `node scripts/check-contrast.mjs`):
variantes `-text` y `-bg` de estados, `border-input`, `primary-hover`, `primary-subtle`, colores de sidebar y `text-secondary-strong` (el gris secundario baja a 4,39:1 sobre filas tintadas; en esas superficies se usa la variante fuerte). Auditoria con axe-core sobre las 5 pantallas de `preview/`: 0 violaciones.
