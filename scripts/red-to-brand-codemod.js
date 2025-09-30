#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry');
const exts = new Set(['.js','.jsx','.ts','.tsx','.css','.scss','.sass','.html']);
const roots = ['src'];

const UTIL = '(?:bg|text|border|ring|from|via|to)';
const VARIANTS = '(?:[a-zA-Z0-9-]+:)*';
const RE = new RegExp(`(?<prefix>${VARIANTS})(?<util>${UTIL})-red-(?<shade>50|100|200|300|400|500|600|700|800|900)(?<opacity>/[0-9]{1,3})?\\b`, 'g');

function walk(dir, out=[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function replace(source){
  let changed = false;
  const out = source.replace(RE, (m, ...rest) => {
    const groups = rest.pop();
    const { prefix, util, shade, opacity } = groups;
    changed = true;
    return `${prefix || ''}${util}-brand-${shade}${opacity || ''}`.replace('-brand-600', '-brand');
  });
  return { out, changed };
}

function main(){
  let files = [];
  roots.forEach(r => { if (fs.existsSync(r)) files.push(...walk(r)); });
  if (!files.length){ console.log('No files to scan.'); return; }
  console.log(`Escaneando ${files.length} archivos...`);
  let count = 0;
  for (const f of files){
    const src = fs.readFileSync(f, 'utf8');
    const { out, changed } = replace(src);
    if (changed){
      count++;
      if (DRY) console.log('~', f);
      else {
        fs.writeFileSync(f + '.brand2.bak', src, 'utf8');
        fs.writeFileSync(f, out, 'utf8');
        console.log('✔', f);
      }
    }
  }
  console.log(DRY ? `Dry-run: ${count} archivos con cambios.` : `Aplicado: ${count} archivos actualizados (backups .brand2.bak).`);
}

main();
