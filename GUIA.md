# Como crear la identidad visual del ERP - pasos y recomendaciones

Punto de partida: `DESIGN.md`. Estado de cada paso: HECHO (ya en este repo), TU DECISION (necesito un dato tuyo), PENDIENTE.

## Skills usadas y recomendadas

| Skill | Para que | Estado |
|---|---|---|
| `identidad-visual` (nueva, `.claude/skills/`) | Reglas del ERP; la aplican Claude y cualquier colaborador | HECHO |
| `design:design-system` | Auditar tokens, documentar y extender componentes | Usar en pasos 4-5 |
| `design:accessibility-review` | Revision WCAG de pantallas reales | Usar en paso 7 |
| `design:design-critique` | Critica de pantallas antes de aprobarlas | Usar en paso 7 |
| `design:design-handoff` | Especificaciones para desarrollo | Usar en paso 8 |
| `design:ux-copy` | Mensajes de error, vacios, confirmaciones en espanol (es-VE) | Usar en paso 6 |
| `dataviz` | Graficas coherentes (con la paleta del ERP) | Usar en paso 6 |
| Conector Figma / Canva | Biblioteca de componentes y piezas de marca | Requieren autorizacion en tus conectores de claude.ai; hoy no estan disponibles para esta sesion |

No encontre skills adicionales que instalar: las anteriores cubren el flujo. `small-business:brand-style` no aplica (esta pensada para dueños de pymes y guarda datos en otro contexto).

## Pasos

### 1. Auditar y consolidar la spec - HECHO
- El DESIGN.md original tenia YAML y cuerpo contradictorios (primary #004AC6 vs #2563EB, radios, fondo, error). Se resolvio a favor del cuerpo y se dejo la tabla de decisiones en `DESIGN.md`.
- **Recomendacion**: toda herramienta (Stitch, Figma, Tailwind) debe leer de `tokens/tokens.json`, nunca de copias.

### 2. Accesibilidad de la paleta - HECHO
- `node scripts/check-contrast.mjs` valida 23 pares. Hallazgos: success/warning/info planos no pasan AA como texto (3,30 / 2,15 / 2,77:1), el borde #E5E7EB da 1,24:1 como contorno de input, #25D366 da 1,98:1.
- Solucion: variantes `-text`/`-bg` y `border-input` (#8A919E, 3,17:1). Siguen dentro de "un solo color de marca".
- **Recomendacion**: correr el script en CI para que nadie rompa un contraste sin darse cuenta.

### 3. Marca: nombre, logo, favicon - TU DECISION
La spec solo dice "ERP"; no hay nombre comercial. Necesito:
1. Nombre del producto (o de la empresa que lo usa).
2. Si ya existe un logo o si quieres un wordmark.

Recomendaciones para un acabado profesional:
- Un **wordmark en Inter SemiBold** + un isotipo simple (letra o forma geometrica de 1 color) es suficiente y coherente con "sin decoracion".
- Entregar 4 versiones: color sobre fondo claro, **blanco sobre `sidebar`** (la que mas se vera), monocromo, e isotipo solo (favicon 16/32/180 px y avatar).
- Definir zona de respeto (alto de la letra "E" alrededor) y tamano minimo (24 px de alto en pantalla).
- Verificar el nombre antes de invertir: busqueda en el SAPI (registro de marcas de Venezuela) y dominio. Consulta a un abogado de propiedad intelectual.
- SVG optimizado como formato maestro; PNG solo para WhatsApp/email.

### 4. Componentes base - PENDIENTE (siguiente iteracion)
Construir y documentar con `design:design-system document`, cada uno con estados default / hover / active / focus / disabled / loading / error:
Boton (primary, secondary, danger, ghost), input y select, checkbox/radio, tabla densa (ordenable, fila seleccionada, vacia, cargando), insignia de estado, tarjeta KPI, sidebar (item activo/inactivo), cabecera (BCV + conexion), modal de confirmacion destructiva, toast, paginacion, selector de fecha.
- Hay una muestra de varios en `preview/index.html`.
- **Recomendacion**: construirlos en codigo (Storybook o similar) antes de dibujarlos todos en Figma; en un ERP el codigo es la fuente de verdad.

### 5. Patrones propios de este ERP - PENDIENTE
Son los que diferencian un ERP profesional de uno generico:
- **Moneda dual**: componente unico `<Monto usd=... tasa=...>` para que nadie formatee a mano. Mostrar tambien la fecha/hora de la tasa y que hacer si no hay tasa del dia. Mostrar como se redondea Bs.
- **Offline-first**: tres estados de conexion en cabecera, cola de pendientes visible, y como se ve un registro "no sincronizado" en tablas.
- **Punto de venta / mostrador** (venta al detal): objetivos tactiles de 44 px minimo y atajos de teclado, aunque el resto sea denso.
- **Servicio tecnico**: linea de estados de la orden de servicio (recibido, diagnostico, presupuesto, reparacion, listo, entregado) con insignias y orden fijo.
- **Conversaciones WhatsApp**: unica pantalla donde aparece #25D366.

### 6. Contenido, graficas y textos - PENDIENTE
- `design:ux-copy`: voz en español neutro, "tu/usted" a elegir una vez; mensajes que dicen que paso y que hacer. Formato es-VE.
- `dataviz`: paleta de series derivada de `primary` + neutros; los semanticos solo para significado; nunca `whatsapp`.

### 7. Revision con pantallas reales - PENDIENTE
- `design:accessibility-review` y `design:design-critique` sobre las primeras 3 pantallas (inicio, venta, orden de servicio).
- Probar a **1366x768** (resolucion comun en equipos de oficina y taller): tu spec es 1440, pero con sidebar de 240 px quedan solo ~1126 px de contenido. Decidir si la sidebar se contrae.
- Probar en un monitor economico y con brillo bajo: los grises `text-secondary` sobre `background` quedan justo en 4,5:1.
- Navegar solo con teclado y confirmar el anillo de foco.

### 8. Entrega a desarrollo - PENDIENTE
- `design:design-handoff` + `tokens.css` como unica fuente; si usan Tailwind, mapear `tokens.json` al theme.
- **Auto-alojar Inter** (archivos woff2 en el proyecto). Con conectividad inestable y un sistema offline-first, no depender de Google Fonts.
- Prohibir hex literales en el codigo de UI (regla de lint o revision).

### 9. Documentos y canales externos - PENDIENTE
- Factura, nota de entrega, presupuesto y orden de servicio impresos: mismos tokens, en blanco y negro legibles (muchos talleres imprimen en monocromo). Los formatos fiscales tienen requisitos legales: confirmalos con tu contador antes de disenar.
- Plantillas de mensajes de WhatsApp: texto claro; si usas la API oficial, las plantillas requieren aprobacion previa de Meta.

### 10. Gobernanza - PENDIENTE
- Un responsable de aprobar cambios a `tokens.json`.
- Versionar (changelog corto) y hacer una auditoria con `design:design-system audit` cada vez que haya 5+ pantallas nuevas.
- Modo oscuro: dejarlo para una ronda posterior; ya hay nombres semanticos de token que lo permiten.

## Orden sugerido
3 (marca, requiere tu respuesta) en paralelo con 4-5 (componentes) → 6 → 7 → 8 → 9. El paso 7 antes de la entrega evita retrabajo.
