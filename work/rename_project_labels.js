const fs = require('fs');
const path = require('path');

const root = process.cwd();
const excluded = new Set(['node_modules', 'work', '.git', 'backups', 'backup', 'respaldos']);
const replacements = [
  [/\bPROYECTOS\b/g, 'AGRUPACIONES'],
  [/\bPROYECTO\b/g, 'AGRUPACIÓN'],
  [/\bProyectos\b/g, 'Agrupaciones'],
  [/\bProyecto\b/g, 'Agrupación'],
  [/\bproyectos\b/g, 'agrupaciones'],
  [/\bproyecto\b/g, 'agrupación']
];

function replaceWords(text) {
  return replacements.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text);
}

function replaceTemplateWords(text) {
  let out = '';
  let rawStart = 0;
  let i = 1;
  while (i < text.length - 1) {
    if (text[i] === '\\') { i += 2; continue; }
    if (text[i] === '$' && text[i + 1] === '{') {
      out += replaceWords(text.slice(rawStart, i));
      let j = i + 2;
      let depth = 1;
      let quote = '';
      while (j < text.length - 1 && depth > 0) {
        const ch = text[j];
        if (quote) {
          if (ch === '\\') { j += 2; continue; }
          if (ch === quote) quote = '';
        } else if (ch === '"' || ch === "'" || ch === '`') quote = ch;
        else if (ch === '{') depth += 1;
        else if (ch === '}') depth -= 1;
        j += 1;
      }
      out += text.slice(i, j);
      rawStart = j;
      i = j;
      continue;
    }
    i += 1;
  }
  out += replaceWords(text.slice(rawStart));
  return out;
}

function rewriteJavaScript(source) {
  return source.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/gs, token =>
    token.startsWith('`') ? replaceTemplateWords(token) : replaceWords(token)
  );
}

function rewriteHtml(source) {
  let out = '';
  let cursor = 0;
  const scriptPattern = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
  for (const match of source.matchAll(scriptPattern)) {
    const index = match.index;
    out += replaceWords(source.slice(cursor, index));
    const block = match[0];
    if (/^<script/i.test(block)) {
      const openEnd = block.indexOf('>') + 1;
      const closeStart = block.toLowerCase().lastIndexOf('</script>');
      out += block.slice(0, openEnd) + rewriteJavaScript(block.slice(openEnd, closeStart)) + block.slice(closeStart);
    } else {
      out += block;
    }
    cursor = index + block.length;
  }
  out += replaceWords(source.slice(cursor));
  return out;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!excluded.has(entry.name)) walk(path.join(dir, entry.name), files);
      continue;
    }
    if (/\.(html|js)$/i.test(entry.name)) files.push(path.join(dir, entry.name));
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  const before = fs.readFileSync(file, 'utf8');
  const after = /\.html$/i.test(file) ? rewriteHtml(before) : rewriteJavaScript(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed += 1;
    console.log(path.relative(root, file));
  }
}
console.log(`UPDATED ${changed} files`);
