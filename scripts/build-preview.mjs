// Genera preview/*.html desde preview/src/*.html resolviendo macros:
//   {{sprite}}                      sprite de iconos inline
//   {{icon:nombre[:clases]}}        <svg class="icon ..."><use href="#i-nombre"/></svg>
//   {{money:USD[:tasa[:clases]]}}   moneda dual con lib/format.js (tasa por defecto: BCV de muestra)
//   {{modules}}                     filas de modulos desde modules/registry.json
//   {{spec:ruta}}                   valor de BRAND_SPECS (theme/theme.js), p. ej. slots.onDark.maxHeight
//   {{colorfix:#RRGGBB}}            como el motor de tema ajusta un color de marca (calculado, no escrito a mano)
//   {{include:parcial[:arg]}}       preview/src/_parcial.html ; arg marca el item activo / titulo
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const F = require('../lib/format.js');
const T = require('../theme/theme.js');
const RATE = 36.52;
const dir = new URL('../preview/src/', import.meta.url);
const sprite = readFileSync(new URL('../icons/sprite.svg', import.meta.url), 'utf8');
const icons = new Set(JSON.parse(readFileSync(new URL('../icons/icons.json', import.meta.url), 'utf8')));

const registry = JSON.parse(readFileSync(new URL('../modules/registry.json', import.meta.url), 'utf8'));
function modulesHtml() {
  return registry.modules.map((m) => {
    const missing = (m.requires || []).filter((r) => r.startsWith('integration:') && !registry.integrations[r.slice(12)].configured).map((r) => registry.integrations[r.slice(12)].name);
    const core = m.kind === 'core', on = m.enabled && !missing.length;
    if (!icons.has(m.icon)) throw new Error(`Icono inexistente en registry: ${m.icon}`);
    const state = core ? '<span class="badge">Siempre activo</span>' : missing.length ? `<span class="badge badge--warning">Requiere configurar ${missing.join(', ')}</span>` : '<span></span>';
    return `<div class="module-row${on ? '' : ' is-off'}"><span class="module-row__icon"><svg class="icon" aria-hidden="true"><use href="#i-${m.icon}"/></svg></span><div><div class="setting-row__title">${m.name}</div><div class="setting-row__desc">${m.description || ''}</div></div>${state}<label class="switch"><input type="checkbox" ${on ? 'checked' : ''} ${core || missing.length ? 'disabled' : ''} aria-label="Activar ${m.name}"></label></div>`;
  }).join('\n');
}

function colorfix(hex) {
  const r = T.deriveTheme({ primary: hex }), fixed = r.tokens.primary, changed = fixed !== hex.toUpperCase();
  const sw = (c) => `<span class="swatch" style="background:${c}"></span>`;
  const warn = r.warnings.length ? ' <span class="badge badge--warning">Se parece a un color de estado</span>' : '';
  return `${sw(hex)} <b>${hex.toUpperCase()}</b> &rarr; ${changed ? `${sw(fixed)} <b>${fixed}</b>` : '<span class="badge badge--success">Se usa tal cual</span>'}${warn}`;
}

function render(src, depth = 0) {
  if (depth > 3) throw new Error('include recursivo');
  return src
    .replace(/\{\{include:([\w-]+)(?::([^}]*))?\}\}/g, (_, n, arg = '') => {
      const html = readFileSync(new URL(`_${n}.html`, dir), 'utf8');
      return render(html.replaceAll('{{arg}}', arg).replace(new RegExp(`data-id="${arg}"`, 'g'), `data-id="${arg}" aria-current="page"`), depth + 1);
    })
    .replace(/\{\{icon:([\w-]+)(?::([^}]*))?\}\}/g, (_, n, cls = '') => {
      if (!icons.has(n)) throw new Error(`Icono inexistente: ${n}`);
      return `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
    })
    .replace(/\{\{money:(-?[\d.]+)(?::([\d.]+))?(?::([^}]*))?\}\}/g, (_, usd, rate, cls = '') => {
      const d = F.dual(Number(usd), rate ? Number(rate) : RATE);
      return `<span class="money ${cls}"><span class="money__usd">${d.usd}</span><span class="money__bs">${d.bs}</span></span>`;
    })
    .replace(/\{\{spec:([\w.]+)\}\}/g, (_, p) => { const v = p.split('.').reduce((o, k) => (o == null ? o : o[k]), T.BRAND_SPECS); if (v === undefined) throw new Error(`spec inexistente: ${p}`); return Array.isArray(v) ? v.join(', ') : String(v); })
    .replace(/\{\{colorfix:(#[0-9a-fA-F]{6})\}\}/g, (_, hex) => colorfix(hex))
    .replace('{{modules}}', () => modulesHtml())
    .replace('{{sprite}}', sprite);
}
let n = 0;
for (const f of readdirSync(dir)) {
  if (!f.endsWith('.html') || f.startsWith('_')) continue;
  writeFileSync(new URL(`../preview/${f}`, import.meta.url), render(readFileSync(new URL(f, dir), 'utf8')));
  n++;
}
console.log(`preview: ${n} paginas generadas`);
