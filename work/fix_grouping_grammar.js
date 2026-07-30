const fs = require('fs');
const path = require('path');
const root = process.cwd();
const excluded = new Set(['node_modules', 'work', '.git', 'backups', 'backup', 'respaldos']);
const rules = [
  [/\bdel agrupación\b/gi, m => /^[A-Z]/.test(m) ? 'De la agrupación' : 'de la agrupación'],
  [/\bal agrupación\b/gi, m => /^[A-Z]/.test(m) ? 'A la agrupación' : 'a la agrupación'],
  [/\beste agrupación\b/gi, m => /^[A-Z]/.test(m) ? 'Esta agrupación' : 'esta agrupación'],
  [/\bun agrupación\b/gi, m => /^[A-Z]/.test(m) ? 'Una agrupación' : 'una agrupación'],
  [/\bagrupación seleccionado\b/gi, m => /^[A-Z]/.test(m) ? 'Agrupación seleccionada' : 'agrupación seleccionada'],
  [/\bagrupación activo\b/gi, m => /^[A-Z]/.test(m) ? 'Agrupación activa' : 'agrupación activa'],
  [/\bagrupación guardado\b/gi, m => /^[A-Z]/.test(m) ? 'Agrupación guardada' : 'agrupación guardada'],
  [/\bagrupación eliminado\b/gi, m => /^[A-Z]/.test(m) ? 'Agrupación eliminada' : 'agrupación eliminada'],
  [/\bagrupación indicado\b/gi, m => /^[A-Z]/.test(m) ? 'Agrupación indicada' : 'agrupación indicada'],
  [/\bagrupación asociado\b/gi, m => /^[A-Z]/.test(m) ? 'Agrupación asociada' : 'agrupación asociada'],
  [/\bBeneficiarios agrupación\b/g, 'Beneficiarios de la agrupación'],
  [/\bStatus de la agrupación\b/g, 'Estado de la agrupación']
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
