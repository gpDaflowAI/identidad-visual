// Pruebas del motor de tema y del formato de moneda. Ejecutar: node scripts/test-theme.mjs
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { deriveTheme, ratio } = require('../theme/theme.js');
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
console.log('theme + format: todas las pruebas pasan');
