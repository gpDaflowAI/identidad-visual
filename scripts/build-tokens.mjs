// Genera tokens/tokens.css desde tokens/tokens.json.
import { readFileSync, writeFileSync } from 'node:fs';

const src = new URL('../tokens/tokens.json', import.meta.url);
const out = new URL('../tokens/tokens.css', import.meta.url);
const t = JSON.parse(readFileSync(src));

const lines = ['/* GENERADO por scripts/build-tokens.mjs desde tokens.json. No editar a mano. */', ':root {'];
for (const [k, v] of Object.entries(t.color)) lines.push(`  --color-${k}: ${v.value};`);
lines.push(`  --font-family: ${t.font.family.value};`);
for (const [k, v] of Object.entries(t.font)) {
  if (k === 'family') continue;
  lines.push(`  --font-${k}-size: ${v.size};`, `  --font-${k}-weight: ${v.weight};`, `  --font-${k}-line: ${v.line};`);
  if (v.tracking) lines.push(`  --font-${k}-tracking: ${v.tracking};`);
}
for (const [k, v] of Object.entries(t.radius)) lines.push(`  --radius-${k}: ${v};`);
for (const [k, v] of Object.entries(t.space)) lines.push(`  --space-${k}: ${v};`);
for (const [k, v] of Object.entries(t.elevation)) lines.push(`  --elevation-${k}: ${v};`);
lines.push('}', '', '/* Numeros tabulares obligatorios en cifras, fechas, horas y porcentajes. */',
  '.num, table td.num, .kpi-value { font-variant-numeric: tabular-nums; }', '');
writeFileSync(out, lines.join('\n'));
console.log('tokens.css generado');
