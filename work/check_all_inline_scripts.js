const fs = require('fs');
const path = require('path');
const vm = require('vm');
const roots = ['index.html', 'modulos'];
const files = [];
function walk(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) { if (/\.html$/i.test(target)) files.push(target); return; }
  for (const name of fs.readdirSync(target)) walk(path.join(target, name));
}
roots.forEach(walk);
let count = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(Boolean);
  scripts.forEach((script, index) => {
    new vm.Script(script, { filename: `${file}#script-${index + 1}` });
    count += 1;
  });
}
console.log(`OK ${count} inline scripts in ${files.length} HTML files`);
