const fs = require('fs');
const path = require('path');
const root = process.cwd();
const excluded = new Set(['node_modules', 'work', '.git', 'backups', 'backup', 'respaldos']);
const rules = [
  [/\bPROYECTOS\b/g, 'AGRUPACIONES'], [/\bPROYECTO\b/g, 'AGRUPACIÓN'],
  [/\bProyectos\b/g, 'Agrupaciones'], [/\bProyecto\b/g, 'Agrupación'],
  [/\bproyectos\b/g, 'agrupaciones'], [/\bproyecto\b/g, 'agrupación']
];
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) { if (!excluded.has(entry.name)) walk(path.join(dir, entry.name), files); }
    else if (/\.(html|js|css)$/i.test(entry.name)) files.push(path.join(dir, entry.name));
  }
  return files;
}
let changed = 0;
for (const file of walk(root)) {
  const before = fs.readFileSync(file, 'utf8');
  const after = rules.reduce((text, [pattern, value]) => text.replace(pattern, value), before);
  if (after !== before) { fs.writeFileSync(file, after, 'utf8'); changed += 1; console.log(path.relative(root, file)); }
}
console.log(`UPDATED ${changed} files`);
