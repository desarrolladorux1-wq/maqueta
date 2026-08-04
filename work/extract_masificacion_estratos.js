const fs = require('fs');
const path = require('path');

const input = path.resolve('Archivos_GIS_Fise/Estratos_INEI.geojson');
const output = path.resolve('data/masificacion_estratos_inei.geojson');
const areas = [
  { key: 'arequipa', lat: -16.3989, lng: -71.5350, radius: 0.018 },
  { key: 'amazonas', lat: -5.6380, lng: -78.5310, radius: 0.025 },
  { key: 'lima', lat: -12.0464, lng: -77.0428, radius: 0.018 }
];

function visitCoordinates(value, callback) {
  if (!Array.isArray(value)) return;
  if (value.length >= 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
    callback(value[0], value[1]);
    return;
  }
  for (const child of value) visitCoordinates(child, callback);
}

function matchingArea(feature) {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  visitCoordinates(feature.geometry && feature.geometry.coordinates, (lng, lat) => {
    minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
  });
  return areas.find(area =>
    maxLng >= area.lng - area.radius && minLng <= area.lng + area.radius &&
    maxLat >= area.lat - area.radius && minLat <= area.lat + area.radius
  );
}

const selected = [];
const counts = Object.fromEntries(areas.map(area => [area.key, 0]));
let buffer = '';
let featureStart = -1;
let depth = 0;
let inString = false;
let escaped = false;
let featuresFound = false;
let scanIndex = 0;

function consume() {
  if (!featuresFound) {
    const marker = buffer.indexOf('"features"');
    if (marker < 0) {
      if (buffer.length > 100) buffer = buffer.slice(-100);
      return;
    }
    const arrayStart = buffer.indexOf('[', marker);
    if (arrayStart < 0) return;
    buffer = buffer.slice(arrayStart + 1);
    featuresFound = true;
    scanIndex = 0;
  }

  let consumed = 0;
  for (let i = scanIndex; i < buffer.length; i++) {
    const ch = buffer[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (featureStart < 0) {
      if (ch === '{') { featureStart = i; depth = 1; }
      else if (ch === ']') { consumed = i + 1; break; }
      continue;
    }
    if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') depth--;
    if (depth === 0) {
      const raw = buffer.slice(featureStart, i + 1);
      const feature = JSON.parse(raw);
      const area = matchingArea(feature);
      if (area) {
        feature.properties = Object.assign({}, feature.properties, { AREA_MAQUETA: area.key });
        selected.push(feature);
        counts[area.key]++;
      }
      consumed = i + 1;
      featureStart = -1;
    }
  }
  scanIndex = buffer.length;
  if (consumed > 0) {
    buffer = buffer.slice(consumed);
    scanIndex -= consumed;
    if (featureStart >= 0) featureStart -= consumed;
  }
}

const stream = fs.createReadStream(input, { encoding: 'utf8', highWaterMark: 1024 * 1024 });
stream.on('data', chunk => { buffer += chunk; consume(); });
stream.on('end', () => {
  consume();
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify({
    type: 'FeatureCollection',
    name: 'Estratos_INEI_Masificacion',
    source: 'Estratos_INEI.geojson',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
    features: selected
  }));
  process.stdout.write(JSON.stringify({ output, total: selected.length, counts, bytes: fs.statSync(output).size }, null, 2));
});
stream.on('error', error => { throw error; });
