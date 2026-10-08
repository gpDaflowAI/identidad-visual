// Verifica los pares fg/bg declarados en tokens/tokens.json (WCAG 2.x).
import { readFileSync } from 'node:fs';

const t = JSON.parse(readFileSync(new URL('../tokens/tokens.json', import.meta.url)));
const hex = (n) => {
  const c = t.color[n];
  if (!c) throw new Error(`Token inexistente: ${n}`);
  return c.value;
};
const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let fail = 0;
for (const { fg, bg, min, note } of t.contrast) {
  const r = ratio(hex(fg), hex(bg));
  const ok = r >= min;
  if (!ok) fail++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${r.toFixed(2).padStart(5)} (min ${min})  ${fg} sobre ${bg}${note ? `  - ${note}` : ''}`);
}
if (fail) {
  console.error(`\n${fail} par(es) no cumplen.`);
  process.exit(1);
}
console.log('\nTodos los pares cumplen.');
