/*
 * Graficas del ERP en SVG puro (sin dependencias). Reglas (skill dataviz):
 *  - maximo 3 series con color propio (chart-1..3); el resto se agrupa en 'Otros' (chart-other) o se divide en graficas pequenas
 *  - un solo eje Y; marcas finas; rejilla discreta; texto en tinta de texto, nunca en color de serie
 *  - leyenda siempre con >=2 series, etiqueta directa del extremo; tooltip al pasar; vista de tabla como alternativa accesible
 *  - los colores de estado (success/warning/error/info) y WhatsApp NO se usan como series
 * Uso: ErpCharts.bar(el, { title, level (2 por defecto), labels, values, fmt }) ; ErpCharts.line(el, { title, labels, series:[{name, values}], fmt })
 */
(function (root) {
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const compact = (n) => (n >= 1000 ? (n / 1000).toFixed(n % 1000 ? 1 : 0).replace('.', ',') + ' mil' : String(n));
  const niceMax = (m) => { const p = Math.pow(10, Math.floor(Math.log10(m))); const r = m / p; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p; };

  function frame(host, o) {
    host.classList.add('chart'); host.innerHTML = '';
    host.insertAdjacentHTML('beforeend', `<div><h${o.level || 2} class="chart__title">${o.title}</h${o.level || 2}>${o.sub ? `<div class="chart__sub">${o.sub}</div>` : ''}</div>`);
    const tip = document.createElement('div'); tip.className = 'tooltip chart-tip'; tip.hidden = true; host.appendChild(tip);
    return tip;
  }
  function table(host, o, cols) {
    const d = document.createElement('details'); d.className = 'chart-table';
    const head = `<tr><th>${o.xLabel || ''}</th>${cols.map((c) => `<th class="num">${c.name}</th>`).join('')}</tr>`;
    const rows = o.labels.map((l, i) => `<tr><td>${l}</td>${cols.map((c) => `<td class="num">${o.fmt(c.values[i])}</td>`).join('')}</tr>`).join('');
    d.innerHTML = `<summary class="text-label">Ver como tabla</summary><div class="table-wrap"><table class="table"><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
    host.appendChild(d);
  }
  function showTip(host, tip, x, y, html) {
    const r = host.getBoundingClientRect(); tip.innerHTML = html; tip.hidden = false;
    tip.style.left = Math.min(x - r.left + 12, r.width - tip.offsetWidth - 8) + 'px'; tip.style.top = Math.max(8, y - r.top - tip.offsetHeight - 12) + 'px';
  }

  function grid(svg, W, H, m, max, fmtAxis) {
    const ph = H - m.t - m.b;
    for (let i = 0; i <= 4; i++) {
      const y = m.t + ph - (ph * i) / 4;
      el('line', { x1: m.l, x2: W - m.r, y1: y, y2: y, class: 'grid-line' }, svg);
      el('text', { x: m.l - 8, y: y + 4, 'text-anchor': 'end', class: 'axis-text' }, svg).textContent = fmtAxis((max * i) / 4);
    }
    return ph;
  }

  function bar(host, o) {
    const tip = frame(host, o); const W = 640, H = 240, m = { t: 16, r: 12, b: 28, l: 48 };
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `${o.title}. Ver tabla para los valores.` }, host);
    const max = niceMax(Math.max(...o.values)); const ph = grid(svg, W, H, m, max, compact);
    const band = (W - m.l - m.r) / o.values.length, bw = Math.min(32, band * 0.5), top = Math.max(...o.values);
    o.values.forEach((v, i) => {
      const x = m.l + band * i + (band - bw) / 2, h = Math.max(2, (v / max) * ph), y = m.t + ph - h, r = Math.min(4, bw / 2, h);
      const p = el('path', { d: `M${x},${m.t + ph} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${m.t + ph} Z`, class: 's1', 'stroke-width': 0 }, svg);
      el('text', { x: x + bw / 2, y: H - 8, 'text-anchor': 'middle', class: 'axis-text' }, svg).textContent = o.labels[i];
      if (v === top) el('text', { x: x + bw / 2, y: y - 6, 'text-anchor': 'middle', class: 'axis-text', style: 'fill:var(--color-text-primary);font-weight:600' }, svg).textContent = o.fmt(v);
      const hit = el('rect', { x: m.l + band * i, y: m.t, width: band, height: ph, fill: 'transparent' }, svg);
      hit.addEventListener('mousemove', (e) => { p.style.opacity = .8; showTip(host, tip, e.clientX, e.clientY, `${o.labels[i]}: <b>${o.fmt(v)}</b>`); });
      hit.addEventListener('mouseleave', () => { p.style.opacity = 1; tip.hidden = true; });
    });
    table(host, o, [{ name: o.name || 'Valor', values: o.values }]);
  }

  function line(host, o) {
    const tip = frame(host, o); const W = 640, H = 240, m = { t: 16, r: 96, b: 28, l: 48 };
    const S = o.series.slice(0, 3); const keep = ['s1', 's2', 's3'];
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `${o.title}. Ver tabla para los valores.` }, host);
    const max = niceMax(Math.max(...S.flatMap((s) => s.values))); const ph = grid(svg, W, H, m, max, compact);
    const n = o.labels.length, X = (i) => m.l + ((W - m.l - m.r) * i) / (n - 1), Y = (v) => m.t + ph - (v / max) * ph;
    o.labels.forEach((l, i) => { if (i % Math.ceil(n / 8) === 0) el('text', { x: X(i), y: H - 8, 'text-anchor': 'middle', class: 'axis-text' }, svg).textContent = l; });
    S.forEach((s, k) => {
      el('path', { d: s.values.map((v, i) => `${i ? 'L' : 'M'}${X(i)},${Y(v)}`).join(' '), class: `line ${keep[k]}` }, svg);
      const last = s.values.length - 1;
      el('circle', { cx: X(last), cy: Y(s.values[last]), r: 4, class: keep[k], stroke: 'var(--color-surface)', 'stroke-width': 2 }, svg);
      el('text', { x: X(last) + 10, y: Y(s.values[last]) + 4, class: 'axis-text', style: 'fill:var(--color-text-primary);font-weight:500' }, svg).textContent = s.name; // etiqueta directa
    });
    const cross = el('line', { y1: m.t, y2: m.t + ph, stroke: 'var(--color-border-input)', 'stroke-width': 1, visibility: 'hidden' }, svg);
    const dots = S.map((s, k) => el('circle', { r: 4, class: keep[k], stroke: 'var(--color-surface)', 'stroke-width': 2, visibility: 'hidden' }, svg));
    const hit = el('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: ph, fill: 'transparent' }, svg);
    hit.addEventListener('mousemove', (e) => {
      const b = svg.getBoundingClientRect(), px = ((e.clientX - b.left) / b.width) * W;
      const i = Math.max(0, Math.min(n - 1, Math.round(((px - m.l) / (W - m.l - m.r)) * (n - 1))));
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
      dots.forEach((d, k) => { d.setAttribute('cx', X(i)); d.setAttribute('cy', Y(S[k].values[i])); d.setAttribute('visibility', 'visible'); });
      showTip(host, tip, e.clientX, e.clientY, `<b>${o.labels[i]}</b><br>` + S.map((s) => `${s.name}: ${o.fmt(s.values[i])}`).join('<br>'));
    });
    hit.addEventListener('mouseleave', () => { cross.setAttribute('visibility', 'hidden'); dots.forEach((d) => d.setAttribute('visibility', 'hidden')); tip.hidden = true; });
    host.insertAdjacentHTML('beforeend', `<div class="legend">${S.map((s, k) => `<span><i style="background:var(--color-chart-${k + 1})"></i>${s.name}</span>`).join('')}</div>`);
    table(host, o, S);
  }
  root.ErpCharts = { bar, line };
})(typeof self !== 'undefined' ? self : this);
