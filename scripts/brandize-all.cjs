#!/usr/bin/env node
// CJS version (works even if "type":"module" is set in package.json)
const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry');
const CFG = JSON.parse(fs.readFileSync(path.join(process.cwd(),'scripts','brandize.config.json'),'utf8'));

const exts = new Set(CFG.extensions || ['.js','.jsx','.ts','.tsx','.css','.scss','.sass','.html']);
const roots = CFG.directories || ['src'];
const hexMap = CFG.hexToBrand || {};

const UTIL = '(?:bg|text|border|ring|from|via|to)';
const VARIANTS = '(?:[a-zA-Z0-9-]+:)*';

const RE_RED = new RegExp(`(?<prefix>${VARIANTS})(?<util>${UTIL})-red-(?<shade>50|100|200|300|400|500|600|700|800|900)(?<opacity>/[0-9]{1,3})?\\b`, 'g');

const HEX_LIST = Object.keys(hexMap).sort((a,b)=>b.length-a.length).map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const HEX_ALT = HEX_LIST.length ? `(?:${HEX_LIST.join('|')})` : '#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})';
const RE_HEX = new RegExp(`(?<prefix>${VARIANTS})(?<util>${UTIL})-\\[(?<hex>${HEX_ALT})\\](?<opacity>/[0-9]{1,3})?\\b`, 'g');

const RE_INLINE = new RegExp(`:\\s*(${HEX_ALT})\\b`, 'gi');

function walk(dir, out=[]){
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (exts.has(path.extname(e.name))) out.push(full);
  }
  return out;
}

function replaceAll(src){
  let changed = false, warnings = [];

  src = src.replace(RE_RED, (m, ...rest) => {
    const g = rest.pop();
    const { prefix, util, shade, opacity } = g;
    changed = true;
    return `${prefix||''}${util}-brand-${shade}${opacity||''}`.replace('-brand-600','-brand');
  });

  src = src.replace(RE_HEX, (m, ...rest) => {
    const g = rest.pop();
    const { prefix, util, hex, opacity } = g;
    const mapped = hexMap[hex] || hexMap[hex.toUpperCase()] || hexMap[hex.toLowerCase()];
    if (!mapped) return m;
    changed = true;
    return `${prefix||''}${util}-${mapped}${opacity||''}`.replace('-brand-600','-brand');
  });

  let match;
  while ((match = RE_INLINE.exec(src))) {
    warnings.push(`  ⚠ Inline style con color ${match[1]} (revísalo manualmente).`);
  }

  return { out: src, changed, warnings };
}

function main(){
  let files = [];
  for (const r of roots) if (fs.existsSync(r)) files.push(...walk(r));
  if (!files.length){ console.log('No se encontraron archivos.'); return; }
  console.log(`Escaneando ${files.length} archivos...`);

  let touched = 0;
  for (const f of files){
    const src = fs.readFileSync(f, 'utf8');
    const { out, changed, warnings } = replaceAll(src);
    if (changed){
      touched++;
      if (DRY){
        console.log('~', f);
        warnings.forEach(w => console.log(w));
      } else {
        fs.writeFileSync(f + '.brand3.bak', src, 'utf8');
        fs.writeFileSync(f, out, 'utf8');
        console.log('✔', f);
        warnings.forEach(w => console.log(w));
      }
    }
  }
  console.log(DRY ? `Dry-run: ${touched} archivos con cambios.` : `Aplicado: ${touched} archivos (backups .brand3.bak creados).`);
}

main();
