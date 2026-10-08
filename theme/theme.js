/*
 * Motor de tema del ERP. Lo usa el panel de configuracion.
 * El administrador elige SOLO: color de marca (primary), color de sidebar, densidad, nombre y logo.
 * Todo lo demas se deriva o esta bloqueado (semanticos, WhatsApp, tipografia).
 * Si un color elegido no es accesible, se CORRIGE y se avisa; nunca se aplica tal cual.
 * Funciona en navegador (globalThis.ErpTheme) y en Node (require).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ErpTheme = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const SURFACE = '#FFFFFF';
  const BACKGROUND = '#F5F7FA';
  const SEMANTIC_HUES = { success: 142, error: 0, warning: 38, info: 199, whatsapp: 142 };

  const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const rgb2hex = (r) => '#' + r.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
  const lum = (h) => {
    const [r, g, b] = hex2rgb(h).map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

  function rgb2hsl([r, g, b]) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
    if (!d) return [0, 0, l];
    const s = d / (1 - Math.abs(2 * l - 1));
    const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [(h * 60 + 360) % 360, s, l];
  }
  function hsl2hex([h, s, l]) {
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
    const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return rgb2hex([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
  }
  const mix = (a, b, t) => { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map((v, i) => v + (B[i] - v) * t)); };
  const isHex = (v) => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);

  /** Oscurece (baja L) hasta que `fg` tenga >= min contra todos los fondos dados. */
  function ensureContrast(fg, backgrounds, min) {
    let [h, s, l] = rgb2hsl(hex2rgb(fg)), out = fg, changed = false;
    while (backgrounds.some((bg) => ratio(out, bg) < min) && l > 0.05) { l -= 0.01; out = hsl2hex([h, s, l]); changed = true; }
    return { hex: out, changed };
  }
  const hueDist = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

  /**
   * deriveTheme({ primary, sidebar?, density? }) -> { tokens, cssVars, notes, warnings, errors }
   * tokens: valores finales; cssVars: objeto listo para element.style.setProperty.
   */
  function deriveTheme(input) {
    const notes = [], warnings = [], errors = [];
    if (!isHex(input && input.primary)) return { errors: ['primary debe ser un hex de 6 digitos (#RRGGBB)'], notes, warnings };
    let primary = input.primary.toUpperCase();

    // primary: texto blanco sobre el boton y enlaces sobre surface/background (4.5:1)
    const p = ensureContrast(primary, [SURFACE, BACKGROUND], 4.5);
    if (p.changed) notes.push(`Color de marca oscurecido de ${primary} a ${p.hex} para cumplir contraste AA (4.5:1).`);
    primary = p.hex;
    const [ph, ps] = rgb2hsl(hex2rgb(primary));

    // un color de marca demasiado cercano a un color con significado fijo confunde estados
    if (ps > 0.25) {
      for (const [name, hue] of Object.entries(SEMANTIC_HUES)) {
        const d = hueDist(ph, hue);
        if (d < 20) warnings.push(`El color de marca esta muy cerca del tono de "${name}" (${Math.round(d)} grados): puede confundirse con estados.`);
      }
    }

    // sidebar: derivado del primary si no se indica; debe dar >= 4.5 con texto blanco
    let sidebar = isHex(input.sidebar) ? input.sidebar.toUpperCase() : hsl2hex([ph, Math.min(ps, 0.7), 0.33]);
    const sb = ensureContrast(sidebar, ['#FFFFFF'], 7); // margen para que el texto atenuado conserve jerarquia
    if (sb.changed) notes.push(`Sidebar oscurecido de ${sidebar} a ${sb.hex} para que el texto blanco y el atenuado sean legibles.`);
    sidebar = sb.hex;

    // texto atenuado del sidebar: mezcla de blanco con el sidebar, subiendo hasta 4.5:1
    let muted = '#FFFFFF';
    for (let i = 60; i <= 100; i += 2) { const c = mix(sidebar, '#FFFFFF', i / 100); if (ratio(c, sidebar) >= 4.5) { muted = c; break; } }

    const [, , pl] = rgb2hsl(hex2rgb(primary));
    const hover = hsl2hex([ph, ps, Math.max(0.1, pl - 0.07)]);
    const subtle = mix('#FFFFFF', primary, 0.07);
    if (ratio('#111827', subtle) < 4.5) errors.push('Fondo tenue derivado sin contraste suficiente.'); // salvaguarda

    const tokens = { primary, 'primary-hover': hover, 'primary-subtle': subtle, sidebar, 'sidebar-text': '#FFFFFF', 'sidebar-text-muted': muted };
    const cssVars = Object.fromEntries(Object.entries(tokens).map(([k, v]) => [`--color-${k}`, v]));
    const density = input.density === 'comfortable' ? 'comfortable' : 'compact';
    return { tokens, cssVars, density, notes, warnings, errors };
  }

  /** Aplica el tema a un elemento (por defecto <html>). Solo navegador. */
  function applyTheme(result, el) {
    el = el || document.documentElement;
    Object.entries(result.cssVars).forEach(([k, v]) => el.style.setProperty(k, v));
    el.setAttribute('data-density', result.density);
  }

  return { deriveTheme, applyTheme, ratio, ensureContrast };
});
