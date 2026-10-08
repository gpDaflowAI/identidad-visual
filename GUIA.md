# Como crear la identidad visual del ERP - pasos y recomendaciones

Punto de partida: `DESIGN.md`. Estados: HECHO (en este repo y verificado) · TU DECISION (necesito un dato tuyo) · PENDIENTE.
Para ver el resultado: abre `preview/componentes.html` (catalogo) y las pantallas `index`, `pos`, `delivery`, `configuracion` (capturas en `preview/capturas/`).

## Skills usadas y recomendadas

| Skill | Para que | Estado |
|---|---|---|
| `identidad-visual` (nueva, `.claude/skills/`) | Reglas del ERP, mapa del repo, como crear modulos nuevos | HECHO |
| `design:design-system` | Marco para tokens/componentes/patrones y auditorias | Usada; repetir `audit` cuando haya 5+ pantallas nuevas |
| `dataviz` | Validar la paleta de graficas (script de la skill, todos los pares) | Usada: paleta de 3 series validada |
| `design:accessibility-review`, `design:design-critique` | Revision de pantallas reales de cada modulo | Usar al construir cada modulo |
| `design:design-handoff` | Especificaciones para desarrollo | PENDIENTE (cuando se elija el stack) |
| `design:ux-copy` | Textos de error/vacio/confirmacion en es-VE | PENDIENTE |
| Conectores Figma / Canva | Biblioteca visual y piezas de marca | Requieren autorizacion en claude.ai; no disponibles en esta sesion |

No encontre skills externas que instalar. `small-business:brand-style` no aplica (esta pensada para duenos de pymes, no para un ERP con spec propia).

## Que se construyo (HECHO)

| Paso | Entregable | Verificacion |
|---|---|---|
| 1. Spec consolidada | `DESIGN.md` (resuelve las contradicciones YAML/cuerpo; tabla de decisiones) | - |
| 2. Tokens | `tokens/tokens.json` (fuente unica) -> `tokens.css`; escalas, capas, movimiento, densidad, graficas, mapa | `npm test`: 30+ pares de contraste |
| 3. Fuente e iconos | Inter auto-alojada (OFL) en `fonts/`; 88 iconos Lucide (ISC) en `icons/sprite.svg` | sin dependencia de CDN (offline-first) |
| 4. Componentes | `components/components.css`: ~15 familias, todos con estados (ver inventario en `DESIGN.md`) | axe-core: 0 violaciones en 5 paginas |
| 5. Patrones ERP | Moneda dual (`lib/format.js`), tasa BCV, estado de conexion, registro sin sincronizar, linea de estados de orden de servicio, WhatsApp | Formato probado en `scripts/test-theme.mjs` |
| 6. Plantilla y modulos | `modules/registry.json` + `module.schema.json`; Configuracion > Modulos; dependencias entre modulos e integraciones | Pagina `configuracion.html` |
| 7. Tema y marca configurables | `theme/theme.js`: el admin cambia color, sidebar, densidad, **nombre y logo**; el motor corrige contraste, valida archivos y avisa | Pruebas con 10 colores; subida de logos validos e invalidos probada en navegador |
| 8. POS | Tiles, carrito, totales, metodos de pago, teclado, controles de 48 px | `pos.html` |
| 9. Delivery + Google Maps | Marcadores (5 estados), paradas, rutas, tarjeta de vehiculo, ETA, senal GPS; estilo de mapa generado desde tokens; `maps/markers.js` | `delivery.html` (maqueta). **Sin probar contra Google real** |
| 10. Graficas | `components/charts.js` (barras y lineas con tooltip, leyenda, etiqueta directa, tabla) | Paleta validada con `dataviz` |

Hallazgos de accesibilidad ya resueltos: success/warning/info planos no pasan AA como texto (variantes `-text`); el borde `#E5E7EB` no sirve como contorno de input (`border-input`); `text-secondary` baja a 4,39:1 sobre filas tintadas (`text-secondary-strong`); WhatsApp `#25D366` da 1,98:1 (siempre con texto).

## Lo que falta (PENDIENTE / TU DECISION)

### A. Marca del cliente: nombre, logo, favicon - HECHO (como ranuras)
Nombre y logo **los configura cada cliente** en Configuracion, no se fijan en el producto. Hay 3 ranuras de logo (fondo claro / menu lateral / isotipo) mas el nombre, todas opcionales; sin configurar se muestra un **skeleton**. Se valida el archivo (formato, 512 KB, SVG sin scripts), la pagina, el titulo del navegador y el favicon siguen a la marca. Especificacion en `DESIGN.md` y estados en `preview/componentes.html`.
- Pendiente de tu lado: la logica de **guardar** la configuracion (backend) y llamar a `ErpTheme.applyBranding(config)` al arrancar la app.
- Recomendacion para tus clientes: pedirles SVG (version blanca para el menu lateral) y un isotipo cuadrado; un logo que se vea bien sobre `sidebar` es lo mas importante.

### B. Validar Google Maps con claves reales - PENDIENTE
`maps/markers.js` sigue la API documentada pero no se ejecuto contra Google. Pasos: proyecto en Google Cloud con facturacion -> habilitar Maps JavaScript API y Routes API -> clave restringida por dominio -> crear estilo en la nube desde `maps/google-map-style.json` y un Map ID -> presupuesto y alertas de cuota. Detalle y decisiones (por que Map ID, Routes vs Directions) en `maps/README.md`.

### C. Implementacion en tu stack - PENDIENTE
El kit es CSS + HTML + JS sin framework, portable a cualquiera. Cuando elijas stack (React/Vue/etc.), envolver cada componente en el framework (con `design:design-handoff`) y mantener `tokens.json` como unica fuente (si usas Tailwind, mapearlo al `theme`). Recomendado Storybook para documentar y probar estados.

### D. Revisiones antes de produccion - PENDIENTE
- Probar a **1366x768** (resolucion comun): con sidebar de 240 px quedan ~1126 px de contenido; decidir si el sidebar se contrae por defecto (ya existe la variante colapsada de 64 px).
- Probar en monitor economico y brillo bajo, y navegar solo con teclado.
- Textos con `design:ux-copy` (es-VE, tu/usted elegido una vez).
- **Formatos impresos** (factura, nota de entrega, presupuesto, orden de servicio): mismos tokens, legibles en blanco y negro; los fiscales tienen requisitos legales: confirmalos con tu contador.
- Plantillas de WhatsApp: si usas la API oficial requieren aprobacion previa de Meta.
- Privacidad del rastreo GPS: consentimiento de conductores, solo durante el turno, politica de retencion (ver `maps/README.md`).

### E. Gobernanza - PENDIENTE
- Un responsable de aprobar cambios a `tokens.json`; changelog corto.
- CI: `npm test` (contraste + tema + formato) en cada cambio.
- **Modo oscuro**: fuera de alcance por ahora; los nombres semanticos de token ya lo permiten (habra que re-validar todos los pares y la paleta de graficas en superficie oscura).

## Como se agrega un modulo nuevo
1. Declarar en `modules/registry.json` (icono de `icons/icons.json`, dependencias, permisos).
2. Armar pantallas solo con `components.css`; si falta algo, anadirlo ahi + `preview/src/componentes.html` con todos sus estados.
3. `npm run build && npm test` y auditar con axe-core a 1366 y 1920 px.
