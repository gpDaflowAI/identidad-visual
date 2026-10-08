// Genera tokens/tokens.css desde tokens/tokens.json.
import { readFileSync, writeFileSync } from 'node:fs';

const src = new URL('../tokens/tokens.json', import.meta.url);
const out = new URL('../tokens/tokens.css', import.meta.url);
const t = JSON.parse(readFileSync(src));

const L = ['/* GENERADO por scripts/build-tokens.mjs desde tokens.json. No editar a mano. */', ':root {'];
for (const [k, v] of Object.entries(t.color)) L.push(`  --color-${k}: ${v.value};`);
for (const [k, v] of Object.entries(t.alias)) L.push(`  --color-${k}: var(--color-${v});`);
L.push(`  --font-family: ${t.font.family.value};`);
for (const [k, v] of Object.entries(t.font)) {
  if (k === 'family') continue;
  L.push(`  --font-${k}-size: ${v.size};`, `  --font-${k}-weight: ${v.weight};`, `  --font-${k}-line: ${v.line};`);
  if (v.tracking) L.push(`  --font-${k}-tracking: ${v.tracking};`);
}
for (const [k, v] of Object.entries(t.radius)) L.push(`  --radius-${k}: ${v};`);
for (const [k, v] of Object.entries(t.space)) L.push(`  --space-${k}: ${v};`);
for (const [k, v] of Object.entries(t['space-scale'])) L.push(`  --sp-${k}: ${v};`);
for (const [k, v] of Object.entries(t.size)) L.push(`  --size-${k}: ${v};`);
for (const [k, v] of Object.entries(t.z)) L.push(`  --z-${k}: ${v};`);
for (const [k, v] of Object.entries(t.motion)) L.push(`  --motion-${k}: ${v};`);
for (const [k, v] of Object.entries(t.elevation)) L.push(`  --elevation-${k}: ${v};`);
L.push(`  --density-row: ${t.density.compact.row};`, `  --density-control: ${t.density.compact.control};`, '}', '');
L.push(`[data-density="comfortable"] {`, `  --density-row: ${t.density.comfortable.row};`, `  --density-control: ${t.density.comfortable.control};`, '}', '');
L.push('@media (prefers-reduced-motion: reduce) {', '  :root { --motion-fast: 0ms; --motion-base: 0ms; --motion-slow: 0ms; }', '}', '');
L.push('/* Numeros tabulares obligatorios en cifras, fechas, horas y porcentajes. */',
  '.num, td.num, th.num, .kpi-value { font-variant-numeric: tabular-nums; }', '');
writeFileSync(out, L.join('\n'));
console.log('tokens.css generado');
