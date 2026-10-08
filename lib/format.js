/* Formato es-VE para el componente de moneda dual. Usar SIEMPRE estas funciones, nunca formatear a mano.
   Implementacion propia (no Intl) para que el resultado sea identico en cualquier navegador/ICU. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ErpFormat = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const group = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  /** 1248.5 -> "1.248,50". Redondeo half-up a `d` decimales. */
  function num(n, d) {
    d = d === undefined ? 2 : d;
    const f = Math.pow(10, d), v = Math.round(Math.abs(n) * f) / f;
    const [i, dec] = v.toFixed(d).split('.');
    return group(i) + (dec ? ',' + dec : '');
  }
  const sign = (n) => (n < 0 && Math.round(Math.abs(n) * 100) > 0 ? '-' : '');
  return {
    usd: (n) => sign(n) + '$' + num(n),
    bs: (n) => sign(n) + 'Bs ' + num(n),
    pct: (n) => (n > 0 ? '+' : sign(n)) + num(n, 1) + ' %',
    qty: (n) => num(n, 0),
    /** USD y su equivalente en Bs a la tasa BCV del dia. Bs redondeado a 2 decimales. */
    dual(usd, rate) { return { usd: this.usd(usd), bs: this.bs(usd * rate) }; }
  };
});
