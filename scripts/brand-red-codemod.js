#!/usr/bin/env node
/**
 * Guarros Extremeños — Codemod de rojos → Tailwind brand
 * Reemplaza bg-[#E53935], hover:bg-[#d23431], text-[#E53935], etc. por bg-red-600, hover:bg-red-700, etc.
 * Respeta variantes (hover:, md:, focus:, ...).
 * No usa dependencias externas.
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const CONFIG_PATH = path.join(process.cwd(), 'scripts', 'brand-red.config.json');

if (!fs.existsSync(CONFIG_PATH)) {
  console.error('No se encontró scripts/brand-red.config.json');
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const HEX_MAP = config.hexMap || {};
const EXTENSIONS = new Set(config.extensions || ['.js','.jsx','.ts','.tsx','.css']);
const ROOT_DIRS = config.directories || ['src'];

const ALL_HEX = Object.keys(HEX_MAP);
// Sort by length desc so that long tokens win (e.g., #E53935 before #E53)
ALL_HEX.sort((a,b)=>b.length-a.length);

// Build regex to catch arbitrary color classes like bg-[#E53935], hover:bg-[#d23431]
// We capture optional variant prefixes (e.g., hover:, md:hover:), utility (bg|text|border|ring|from|via|to), and the hex inside brackets.
const hexPattern = ALL_HEX.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
const regArbitrary = new RegExp(`(?<prefix>(?:[a-zA-Z0-9-]+:)*)(?<util>bg|text|border|ring|from|via|to)-\\[(?<hex>${hexPattern})\\]`, 'g');

// Also warn for inline styles with those HEX
const regInline = new RegExp(`:\\s*(${hexPattern})\\b`, 'gi');

function walk(dir, files=[]){
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries){
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()){
      walk(full, files);
    } else {
      if (EXTENSIONS.has(path.extname(e.name))) files.push(full);
    }
  }
  return files;
}

function replaceContent(source, file){
  let changed = false;
  let warnings = [];

  // Replace arbitrary color classes
  const out = source.replace(regArbitrary, (m, ...rest) => {
    const groups = rest.pop(); // last arg is the groups object
    const { prefix, util, hex } = groups;
    const tw = HEX_MAP[hex] || HEX_MAP[hex.toUpperCase()] || HEX_MAP[hex.toLowerCase()];
    if (!tw) return m; // not mapped
    changed = true;
    return `${prefix || ''}${util}-${tw}`;
  });

  // Warn about inline styles
  let match;
  while ((match = regInline.exec(out))){
    const found = match[1];
    const at = match.index;
    warnings.push(`  ⚠ Inline style con color ${found} en pos ${at}. Revísalo manualmente.`);
  }

  return { out, changed, warnings };
}

function processFile(file){
  const src = fs.readFileSync(file, 'utf8');
  const { out, changed, warnings } = replaceContent(src, file);

  if (changed){
    if (DRY){
      console.log(`~ ${file}`);
      warnings.forEach(w => console.log(w));
    } else {
      // backup
      fs.writeFileSync(file + '.brand.bak', src, 'utf8');
      fs.writeFileSync(file, out, 'utf8');
      console.log(`✔ ${file}`);
      warnings.forEach(w => console.log(w));
    }
  }
}

function main(){
  let files = [];
  for (const dir of ROOT_DIRS){
    if (fs.existsSync(dir)) files = files.concat(walk(dir));
  }
  if (!files.length){
    console.log('No se encontraron archivos a revisar.');
    return;
  }
  console.log(`Analizando ${files.length} archivos...`);
  for (const f of files){
    try{ processFile(f); } catch(e){ console.error(`Error en ${f}:`, e.message); }
  }
  console.log(DRY ? 'Dry-run finalizado.' : 'Reemplazos aplicados. Backups *.brand.bak creados.');
}

main();
