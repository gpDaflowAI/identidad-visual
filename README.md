# identidad-visual

Identidad visual del ERP (servicio tecnico y venta mayor/detal, Venezuela).

- `GUIA.md` - pasos y recomendaciones para completar la identidad.
- `DESIGN.md` - sistema visual (colores, tipografia, moneda dual, forma).
- `tokens/tokens.json` - fuente unica de valores; `tokens/tokens.css` se genera.
- `preview/index.html` - muestra de componentes (`preview/muestra.png` es la captura).
- `.claude/skills/identidad-visual/` - skill con las reglas para Claude y colaboradores.

## Comandos

```
node scripts/build-tokens.mjs     # regenera tokens/tokens.css
node scripts/check-contrast.mjs   # valida contraste WCAG de los pares declarados
```
