// Pruebas del motor de tema y del formato de moneda. Ejecutar: node scripts/test-theme.mjs
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { deriveTheme, ratio, brandName, initials, svgIsSafe, faviconSvg, BRAND_SPECS } = require('../theme/theme.js');
import { readFileSync } from 'node:fs';
const F = require('../lib/format.js');

// 1. Los valores por defecto se mantienen
let r = deriveTheme({ primary: '#2563EB', sidebar: '#1E3A8A' });
assert.equal(r.tokens.primary, '#2563EB'); assert.equal(r.tokens.sidebar, '#1E3A8A'); assert.deepEqual(r.notes, []);

// 2. Un color claro se corrige hasta ser accesible
r = deriveTheme({ primary: '#7DD3FC' });
assert.ok(ratio(r.tokens.primary, '#FFFFFF') >= 4.5, 'primary corregido >= 4.5'); assert.ok(r.notes.length >= 1);

// 3. Todo resultado cumple los contrastes clave, para varios colores
for (const c of ['#F59E0B', '#FACC15', '#10B981', '#E11D48', '#7C3AED', '#0EA5E9', '#111111', '#FFFFFF', '#14B8A6', '#FB923C']) {
  r = deriveTheme({ primary: c });
  assert.deepEqual(r.errors, [], c);
  assert.ok(ratio(r.tokens.primary, '#FFFFFF') >= 4.5, `${c} primary/blanco`);
  assert.ok(ratio(r.tokens.primary, '#F5F7FA') >= 4.5, `${c} primary/background`);
  assert.ok(ratio(r.tokens['sidebar-text'], r.tokens.sidebar) >= 4.5, `${c} sidebar texto`);
  assert.ok(ratio(r.tokens['sidebar-text-muted'], r.tokens.sidebar) >= 4.5, `${c} sidebar atenuado`);
  assert.ok(ratio('#111827', r.tokens['primary-subtle']) >= 4.5, `${c} subtle`);
  assert.ok(ratio('#FFFFFF', r.tokens['primary-hover']) >= 4.5, `${c} hover`);
}

// 4. Avisa si la marca se parece a un color con significado fijo
assert.ok(deriveTheme({ primary: '#16A34A' }).warnings.length >= 1, 'verde de marca debe avisar');
assert.ok(deriveTheme({ primary: '#DC2626' }).warnings.length >= 1, 'rojo de marca debe avisar');
assert.equal(deriveTheme({ primary: '#2563EB' }).warnings.length, 0);

// 5. Entrada invalida
assert.ok(deriveTheme({ primary: 'azul' }).errors.length === 1);

// 6. Formato es-VE
assert.equal(F.usd(1248), '$1.248,00'); assert.equal(F.bs(45576.96), 'Bs 45.576,96');
assert.equal(F.usd(-96.5), '-$96,50'); assert.equal(F.usd(0), '$0,00'); assert.equal(F.usd(-0.001), '$0,00');
assert.equal(F.usd(1234567.891), '$1.234.567,89');
assert.deepEqual(F.dual(1248, 36.52), { usd: '$1.248,00', bs: 'Bs 45.576,96' });
assert.equal(F.pct(8.2), '+8,2 %'); assert.equal(F.pct(-2.1), '-2,1 %'); assert.equal(F.pct(0), '0,0 %');

// 7. Marca del cliente: nombre y monograma
assert.equal(brandName({}), ''); assert.equal(brandName({ brandName: '   ' }), ''); assert.equal(brandName(), '');
assert.equal(brandName({ brandName: '  Taller   Los  Andes ' }), 'Taller Los Andes'); assert.equal(brandName({ brandName: 'x'.repeat(60) }).length, 40);
assert.equal(initials('Taller Los Andes'), 'TL'); assert.equal(initials('Electro'), 'EL'); assert.equal(initials('ñandú'), 'ÑA');
assert.equal(initials('A'), 'A'); assert.equal(initials(''), ''); assert.equal(initials('😀 Tienda'), '😀T');

// 8. SVG de cliente: se rechaza lo peligroso, se acepta un logo normal
assert.ok(svgIsSafe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0h10v10H0z" fill="#fff"/></svg>'));
for (const bad of ['<svg><script>alert(1)</script></svg>', '<svg onload="x()"></svg>', '<svg><a href="javascript:alert(1)"/></svg>',
  '<svg><image href="https://evil.example/x.png"/></svg>', '<svg><foreignObject/></svg>', '<svg><image xlink:href="//evil.example/x"/></svg>']) assert.ok(!svgIsSafe(bad), bad);

// 9. Favicon por defecto: monograma sobre el color de marca; sin nombre, gris neutro y sin texto; no inyecta marcado
assert.ok(faviconSvg('TL', '#2563EB').includes('>TL<')); assert.ok(faviconSvg('', null).includes('#9CA3AF') && !faviconSvg('', null).includes('<text'));
assert.ok(!faviconSvg('<b>', '#000').includes('<b>'));

// 10. Las especificaciones publicadas al cliente (BRAND_SPECS) coinciden con lo que el CSS realmente permite
const css = readFileSync(new URL('../components/components.css', import.meta.url), 'utf8');
const rule = (sel) => { const m = css.match(new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\{([^}]*)\\}')); assert.ok(m, 'regla no encontrada: ' + sel); return m[1]; };
const px = (decl, prop) => Number((decl.match(new RegExp(prop + ': (\\d+)px')) || [])[1]);
assert.equal(px(rule('.brand__logo'), 'max-height'), BRAND_SPECS.slots.onDark.maxHeight, 'alto del logo del menu');
assert.equal(px(rule('.brand__logo'), 'max-width'), BRAND_SPECS.slots.onDark.maxWidth, 'ancho del logo del menu');
assert.equal(px(rule('.brand--lg .brand__logo'), 'max-height'), BRAND_SPECS.slots.light.maxHeight, 'alto del logo claro');
assert.equal(px(rule('.brand--lg .brand__logo'), 'max-width'), BRAND_SPECS.slots.light.maxWidth, 'ancho del logo claro');
assert.equal(BRAND_SPECS.nameMax, 40); assert.equal(brandName({ brandName: 'x'.repeat(99) }).length, BRAND_SPECS.nameMax);
console.log('theme + format + marca: todas las pruebas pasan');
