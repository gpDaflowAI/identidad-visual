# identidad-visual

Identidad visual y kit de componentes de la **plantilla ERP** (servicio tecnico y venta mayor/detal, Venezuela).
Pensado para configurarse desde un panel de configuracion y crecer con modulos (POS, delivery con Google Maps, ...).

| Que | Donde |
|---|---|
| Pasos y recomendaciones | `GUIA.md` |
| Sistema visual (reglas, inventario, decisiones) | `DESIGN.md` |
| Tokens (fuente unica) | `tokens/tokens.json` -> `tokens/tokens.css` |
| Componentes | `components/components.css`, `components/charts.js` |
| Iconos y fuente | `icons/` (Lucide, ISC), `fonts/` (Inter, OFL) |
| Tema y marca configurables | `theme/theme.js`, `theme/theme.schema.json` |
| Guia de marca para el cliente | `preview/guia-cliente.html` |
| Moneda dual es-VE | `lib/format.js` |
| Modulos | `modules/registry.json`, `modules/module.schema.json` |
| Google Maps | `maps/` |
| Catalogo y pantallas | `preview/*.html` (generadas desde `preview/src/`), capturas en `preview/capturas/` |
| Skill del proyecto | `.claude/skills/identidad-visual/` |

```
npm run build   # regenera tokens.css, sprite de iconos, estilo de mapa y paginas de preview
npm test        # contraste WCAG de todos los pares + pruebas del motor de tema y del formato de moneda
```

Abrir `preview/componentes.html` directamente en el navegador (no requiere servidor).
