const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('js/main.js', 'utf8');
try {
  new vm.Script(code, { filename: 'main.js' });
  console.log('OK');
} catch (e) {
  console.log('ERROR:', e.message);
  if (e.stack) console.log(e.stack.split('\n').slice(0, 5).join('\n'));
}
