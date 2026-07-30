const fs = require('fs');
const path = require('path');

const input = 'C:\\Users\\andre\\Downloads\\ITNENTTOOO\\Geoportal_Heatmap (4).html';
const output = path.join(process.cwd(), 'assets', 'geo', 'bonogas-manzanas-urbanas.geojson');
const html = fs.readFileSync(input, 'utf8');

const varToDistrict = new Map();
const assignRe = /capasManzanas\[['"]([^'"]+)['"]\]\s*=\s*(geo_json_[a-f0-9]+)/gi;
let match;
while ((match = assignRe.exec(html))) {
  varToDistrict.set(match[2], match[1]);
}

function extractBalancedObject(startIndex) {
  let i = startIndex;
  while (i < html.length && html[i] !== '{') i++;
  if (i >= html.length) return null;
  const start = i;
  let depth = 0;
  let inString = false;
  let quote = '';
  let escape = false;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === quote) {
        inString = false;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) return html.slice(start, i + 1);
    }
  }
  return null;
}

const out = {
  type: 'FeatureCollection',
  name: 'bonogas_manzanas_urbanas',
  metadata: {
    source: 'Geoportal_Heatmap (4).html',
    extractedAt: new Date().toISOString(),
    description: 'Manzanas urbanas reales embebidas desde maqueta Geoportal, incorporadas como capa interna del proyecto.'
  },
  features: []
};

for (const [varName, districtCode] of varToDistrict.entries()) {
  const marker = `${varName}_add(`;
  const idx = html.indexOf(marker);
  if (idx < 0) continue;
  const jsonText = extractBalancedObject(idx + marker.length);
  if (!jsonText) continue;
  try {
    const collection = JSON.parse(jsonText);
    (collection.features || []).forEach((feature, i) => {
      const p = feature.properties || {};
      feature.properties = Object.assign({}, p, {
        tipo_geoportal: 'manzana',
        fuente_geometria: 'Geoportal interno · geometría real',
        ID_DISTRICT: String(p.ID_DISTRICT || districtCode),
        Codigo_ubigeo: String(p.Codigo_ubigeo || districtCode),
        Departamento: String(p.Departamento || districtCode.slice(0, 2)),
        Provincia: String(p.Provincia || districtCode.slice(0, 4)),
        _source_layer: varName,
        _source_index: i
      });
      out.features.push(feature);
    });
  } catch (error) {
    console.warn('No se pudo parsear', varName, error.message);
  }
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(out));
console.log(JSON.stringify({
  output,
  layers: varToDistrict.size,
  features: out.features.length,
  districts: [...new Set(out.features.map(f => f.properties && f.properties.ID_DISTRICT))].sort()
}, null, 2));
