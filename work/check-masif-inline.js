const fs=require('fs');
const vm=require('vm');
const file='modulos/masificacion/masificacion_satcontrol.html';
const html=fs.readFileSync(file,'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i],{filename:file+'#script-'+(i+1)});
console.log('OK '+scripts.length+' inline scripts');
