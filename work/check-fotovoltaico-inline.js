const fs = require('fs');
const vm = require('vm');
const file = 'modulos/fotovoltaico/fotovoltaico.html';
const html = fs.readFileSync(file, 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(Boolean);
scripts.forEach((script, index) => new vm.Script(script, { filename: `${file}#script-${index + 1}` }));
console.log(`OK ${scripts.length} inline scripts`);
