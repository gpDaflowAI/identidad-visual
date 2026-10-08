// Genera maps/google-map-style.json desde tokens/tokens.json (mapa sobrio, para que rutas y marcadores resalten).
// Uso: en Google Cloud Console > Map Styles, recrear/importar este estilo y asociarlo a un Map ID de tipo JavaScript.
import { readFileSync, writeFileSync } from 'node:fs';
const t = JSON.parse(readFileSync(new URL('../tokens/tokens.json', import.meta.url)));
const c = (n) => t.color[n].value;
const style = [
  { elementType: 'geometry', stylers: [{ color: c('background') }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: c('text-secondary-strong') }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: c('surface') }, { weight: 3 }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: c('border-input') }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }, { color: c('border') }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: c('surface') }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: c('border') }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: c('surface') }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: c('border-input') }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: c('info-bg') }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: c('info-text') }] }
];
writeFileSync(new URL('../maps/google-map-style.json', import.meta.url), JSON.stringify(style, null, 2) + '\n');
console.log(`google-map-style.json: ${style.length} reglas`);
