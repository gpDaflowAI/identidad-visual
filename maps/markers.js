/*
 * Capa de integracion Google Maps <-> identidad visual del ERP.
 * NOTA: escrito contra la API documentada (importLibrary, AdvancedMarkerElement, Polyline) pero NO probado contra Google
 * en esta sesion (no hay API key). Validar en el primer arranque con una clave real y un Map ID.
 * Requisitos: Map ID (estilo en la nube) -> obligatorio para AdvancedMarkerElement. Cargar tambien tokens.css y components.css
 * en la pagina, y el sprite de iconos inline (los marcadores usan <use href="#i-...">).
 */
(function (root) {
  const STATUS = {
    moving:    { cls: 'marker--moving',    icon: 'truck',          label: 'En ruta' },
    stopped:   { cls: 'marker--stopped',   icon: 'pause',          label: 'Detenido' },
    offline:   { cls: 'marker--offline',   icon: 'wifi-off',       label: 'Sin senal' },
    delivered: { cls: 'marker--delivered', icon: 'package-check',  label: 'Entregado' },
    incident:  { cls: 'marker--incident',  icon: 'triangle-alert', label: 'Incidencia' }
  };
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(); // sigue al tema configurado
  const svgIcon = (n) => `<svg class="icon icon--sm" aria-hidden="true"><use href="#i-${n}"/></svg>`;

  /** Contenido DOM para AdvancedMarkerElement. opts: { status, selected, stale } */
  function vehicleMarker(opts) {
    const s = STATUS[opts.status] || STATUS.moving, el = document.createElement('div');
    el.className = `marker ${s.cls}${opts.selected ? ' marker--selected' : ''}${opts.stale ? ' marker--stale' : ''}`;
    el.innerHTML = svgIcon(s.icon);
    return el;
  }
  /** Parada numerada. state: 'pending' | 'next' | 'done' | 'failed' */
  function stopMarker(n, state) {
    const el = document.createElement('div');
    el.className = `stop${state && state !== 'pending' ? ' stop--' + state : ''}`;
    el.innerHTML = state === 'done' ? svgIcon('check') : state === 'failed' ? svgIcon('x') : String(n);
    return el;
  }
  /** Opciones de google.maps.Polyline segun el tipo de tramo. Lee los tokens en el momento de crear la linea. */
  function routeStyle(kind) {
    if (kind === 'planned') {
      return { strokeOpacity: 0, strokeWeight: 3, icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, strokeColor: css('--color-map-route-planned'), scale: 3 }, offset: '0', repeat: '12px' }] };
    }
    return { strokeColor: css(kind === 'done' ? '--color-map-route-done' : '--color-map-route-active'), strokeOpacity: 1, strokeWeight: 5 };
  }
  /** Antiguedad de la ultima posicion -> estado visual. > staleAfterS segundos = marcador atenuado + texto "hace X". */
  function freshness(lastSeenMs, staleAfterS) {
    const age = Math.max(0, (Date.now() - lastSeenMs) / 1000), stale = age > (staleAfterS || 60);
    const text = age < 60 ? `hace ${Math.round(age)} s` : age < 3600 ? `hace ${Math.round(age / 60)} min` : `hace ${Math.round(age / 3600)} h`;
    return { stale, text };
  }
  /** Carga la API por <script> con loading=async. Devuelve una promesa; usar luego google.maps.importLibrary('maps' | 'marker'). */
  function loadGoogleMaps(apiKey) {
    if (root.google && root.google.maps && root.google.maps.importLibrary) return Promise.resolve();
    return new Promise((resolve, reject) => {
      root.__erpMapsReady = resolve;
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async&callback=__erpMapsReady`;
      s.async = true; s.onerror = () => reject(new Error('No se pudo cargar Google Maps (sin conexion o clave invalida)'));
      document.head.appendChild(s);
    });
  }
  /** Mapa base con la configuracion del ERP. mapId es obligatorio (estilo en la nube + marcadores avanzados). */
  async function createMap(el, { mapId, center, zoom }) {
    if (!mapId) throw new Error('mapId es obligatorio');
    const { Map } = await google.maps.importLibrary('maps');
    return new Map(el, { mapId, center, zoom: zoom || 12, disableDefaultUI: true, clickableIcons: false, gestureHandling: 'greedy' });
  }
  root.ErpMaps = { STATUS, vehicleMarker, stopMarker, routeStyle, freshness, loadGoogleMaps, createMap };
})(typeof self !== 'undefined' ? self : this);
