// Genera icons/sprite.svg y icons/icons.json desde icons/svg/*.svg (Lucide, ISC).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const dir = new URL('../icons/svg/', import.meta.url);
const names = readdirSync(dir).filter((f) => f.endsWith('.svg')).map((f) => f.slice(0, -4)).sort();
const symbols = names.map((n) => {
  const inner = readFileSync(new URL(`${n}.svg`, dir), 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/<svg[^>]*>/, '').replace('</svg>', '').trim();
  return `<symbol id="i-${n}" viewBox="0 0 24 24">${inner}</symbol>`;
});
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n${symbols.join('\n')}\n</svg>\n`;
writeFileSync(new URL('../icons/sprite.svg', import.meta.url), sprite);
writeFileSync(new URL('../icons/icons.json', import.meta.url), JSON.stringify(names, null, 2));
writeFileSync(new URL('../icons/LICENSE-lucide.txt', import.meta.url), 'Iconos de Lucide (https://lucide.dev), licencia ISC. Copyright (c) Lucide Icons and Contributors.\nSe usan con stroke="currentColor", 24px, trazo 2 (1.75 en la hoja de estilos).\n');
console.log(`sprite.svg: ${names.length} iconos`);
