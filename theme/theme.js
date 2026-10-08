/*
 * Motor de tema del ERP. Lo usa el panel de configuracion.
 * El administrador elige SOLO: color de marca (primary), color de sidebar, densidad, nombre y logo.
 * Todo lo demas se deriva o esta bloqueado (semanticos, WhatsApp, tipografia).
 * Nombre y logo son ranuras del cliente: vacias (skeleton) hasta que las configure; ver applyBranding / validateLogoFile.
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
    if (!isHex(input && input.primary)) return { errors: ['El color de marca debe tener 6 dígitos hexadecimales (#RRGGBB)'], notes, warnings };
    let primary = input.primary.toUpperCase();

    // primary: texto blanco sobre el boton y enlaces sobre surface/background (4.5:1)
    const p = ensureContrast(primary, [SURFACE, BACKGROUND], 4.5);
    if (p.changed) notes.push(`Color de marca oscurecido de ${primary} a ${p.hex} para cumplir contraste AA (4,5:1).`);
    primary = p.hex;
    const [ph, ps] = rgb2hsl(hex2rgb(primary));

    // un color de marca demasiado cercano a un color con significado fijo confunde estados
    if (ps > 0.25) {
      for (const [name, hue] of Object.entries(SEMANTIC_HUES)) {
        const d = hueDist(ph, hue);
        if (d < 20) warnings.push(`El color de marca está muy cerca del tono de "${name}" (${Math.round(d)} grados): puede confundirse con estados.`);
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


  /* ---------------- Marca del cliente: nombre y logo (ranuras vacias hasta que el cliente las configure) ---------------- */
  /* Especificaciones de marca: UNICA fuente para la validacion, la guia del cliente (preview/src/guia-cliente.html)
     y la prueba que comprueba que components.css las respeta (scripts/test-theme.mjs). */
  const BRAND_SPECS = {
    maxKB: 512, nameMax: 40, nameVisibleChars: 17, nameVisibleCharsCaps: 14,
    formats: ['SVG', 'PNG', 'JPG', 'WebP'],
    slots: {
      light:  { maxHeight: 44, maxWidth: 240 },
      onDark: { maxHeight: 28, maxWidth: 160, minRasterHeight: 56 },
      mark:   { minSide: 128 }
    }
  };
  const LOGO_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
  const LOGO_MAX_BYTES = BRAND_SPECS.maxKB * 1024;

  /** Nombre normalizado (espacios colapsados, max 40). Cadena vacia = sin configurar (la UI muestra skeleton). */
  function brandName(cfg) { return String((cfg && cfg.brandName) || '').trim().replace(/\s+/g, ' ').slice(0, BRAND_SPECS.nameMax); }
  /** Monograma de 1-2 letras: iniciales de las dos primeras palabras, o las dos primeras letras de una sola. */
  function initials(name) {
    const w = String(name || '').trim().split(/\s+/).filter(Boolean).map((x) => Array.from(x));
    if (!w.length) return '';
    return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2).join('')).toLocaleUpperCase('es');
  }
  /** Un SVG subido por un cliente solo se usa mediante <img> (nunca inline). Aun asi se rechazan scripts y referencias externas. */
  function svgIsSafe(text) {
    return !/<\s*(script|foreignObject|iframe|object|embed)\b/i.test(text) && !/\son[a-z]+\s*=/i.test(text) &&
      !/javascript:/i.test(text) && !/(?:xlink:)?href\s*=\s*["']\s*(?:https?:)?\/\//i.test(text);
  }
  /** Favicon por defecto: monograma sobre el color de marca (o gris neutro si no hay nombre). */
  function faviconSvg(letters, color) {
    const t = letters ? `<text x="16" y="21.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="600" fill="#fff">${letters.replace(/[<>&"']/g, '')}</text>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${color || '#9CA3AF'}"/>${t}</svg>`;
  }

  /**
   * Valida un archivo de logo elegido por el cliente. Solo navegador (FileReader, Image).
   * slot: 'light' (login/impresos) | 'onDark' (menu lateral) | 'mark' (isotipo cuadrado).
   * -> Promise<{ ok, dataUrl?, errors[], warnings[] }>
   */
  function validateLogoFile(file, slot) {
    const errors = [], warnings = [];
    if (!file) return Promise.resolve({ ok: false, errors: ['No se eligió ningún archivo.'], warnings });
    if (!LOGO_TYPES.includes(file.type)) errors.push('Formato no admitido. Usa SVG, PNG, JPG o WebP.');
    if (file.size > LOGO_MAX_BYTES) errors.push(`El archivo pesa ${Math.round(file.size / 1024)} KB; el máximo es ${LOGO_MAX_BYTES / 1024} KB.`);
    if (errors.length) return Promise.resolve({ ok: false, errors, warnings });
    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.onerror = () => resolve({ ok: false, errors: ['No se pudo leer el archivo.'], warnings });
      fr.onload = () => {
        const dataUrl = fr.result;
        if (file.type === 'image/svg+xml') {
          let text = ''; try { text = atob(dataUrl.split(',')[1]); } catch (e) { text = ''; }
          if (!svgIsSafe(text)) return resolve({ ok: false, errors: ['El SVG contiene elementos no permitidos (scripts, eventos o enlaces externos). Expórtalo de nuevo como SVG simple.'], warnings });
        }
        const img = new Image();
        img.onerror = () => resolve({ ok: false, errors: ['La imagen está dañada o no se puede mostrar.'], warnings });
        img.onload = () => {
          const w = img.naturalWidth, h = img.naturalHeight, raster = file.type !== 'image/svg+xml';
          if (slot === 'mark' && h && (w / h < 0.8 || w / h > 1.25)) warnings.push('El isotipo debería ser cuadrado (1:1); se recortará o se verá deformado.');
          if (raster && slot === 'mark' && Math.min(w, h) < BRAND_SPECS.slots.mark.minSide) warnings.push('El isotipo es pequeño (menos de 128 px): se verá borroso en pantallas de alta densidad.');
          if (raster && slot !== 'mark' && h < BRAND_SPECS.slots.onDark.minRasterHeight) warnings.push('El logo mide menos de 56 px de alto: se verá borroso en pantallas de alta densidad. Mejor SVG.');
          if (slot === 'onDark') warnings.push('Comprueba en la vista previa que el logo se lea sobre el color del menú lateral (debe ser blanco o claro).');
          resolve({ ok: true, dataUrl, errors, warnings });
        };
        img.src = dataUrl;
      };
      fr.readAsDataURL(file);
    });
  }

  /**
   * Aplica nombre y logos a las ranuras del documento. cfg = { brandName?, logo?: { light?, onDark?, mark? } } (URL o data URL).
   * Marcado esperado: [data-brand] con [data-brand-logo="onDark"|"light"], [data-brand-mark-img], [data-brand-initials], [data-brand-name].
   * Sin nombre ni logos -> la ranura queda en estado vacio (skeleton). Llamar al arrancar con la configuracion guardada.
   */
  function applyBranding(cfg, doc) {
    doc = doc || document; cfg = cfg || {};
    const name = brandName(cfg), logo = cfg.logo || {}, letters = initials(name);
    doc.querySelectorAll('[data-brand]').forEach((box) => {
      const variant = box.getAttribute('data-brand-variant') || 'onDark';
      const main = logo[variant], mark = logo.mark;
      const mainImg = box.querySelector('[data-brand-logo]'), markImg = box.querySelector('[data-brand-mark-img]');
      if (mainImg) { mainImg.hidden = !main; if (main) mainImg.src = main; mainImg.alt = ''; } // decorativa: el nombre ya esta en texto
      if (markImg) { markImg.hidden = !mark; if (mark) markImg.src = mark; markImg.alt = ''; }
      const ini = box.querySelector('[data-brand-initials]'); if (ini) { ini.textContent = letters; ini.hidden = !!mark; }
      const nm = box.querySelector('[data-brand-name]'); if (nm) { nm.textContent = name; nm.title = name; } // el nombre completo se ve al pasar el cursor si se corta
      box.classList.toggle('has-logo', !!main);
      box.classList.toggle('is-empty', !name && !main && !mark);
      box.classList.remove('is-loading');
    });
    const page = doc.documentElement.getAttribute('data-page-title');
    doc.title = [page, name].filter(Boolean).join(' · ') || doc.title;
    let link = doc.querySelector('link[rel~="icon"]');
    if (!link) { link = doc.createElement('link'); link.rel = 'icon'; doc.head.appendChild(link); }
    const primary = (getComputedStyle(doc.documentElement).getPropertyValue('--color-primary') || '').trim() || '#2563EB';
    link.href = logo.mark || logo.light || 'data:image/svg+xml,' + encodeURIComponent(faviconSvg(letters, name ? primary : null));
  }

  return { deriveTheme, applyTheme, ratio, ensureContrast, brandName, initials, svgIsSafe, faviconSvg, validateLogoFile, applyBranding, BRAND_SPECS, LOGO_TYPES, LOGO_MAX_BYTES };
});
