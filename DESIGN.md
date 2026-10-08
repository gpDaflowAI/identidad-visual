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
variantes `-text` y `-bg` de estados, `border-input`, `primary-hover`, `primary-subtle`, colores de sidebar.
