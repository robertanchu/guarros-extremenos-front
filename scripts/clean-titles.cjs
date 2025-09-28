/**
 * Codemod: Clean page titles so the tab ALWAYS shows only "Guarros Extremeños".
 * - Removes imports/usages of react-helmet / react-helmet-async
 * - Removes <Helmet>...</Helmet> blocks
 * - Strips any `document.title = ...` assignments
 * - (Optional) Forces index.html <title> to the brand
 *
 * USAGE (from project root):
 *   node scripts/clean-titles.cjs
 *
 * After running:
 *   - Verify changes: git status && git diff
 *   - Optionally uninstall helmet libs: npm remove react-helmet react-helmet-async
 *   - Build / deploy again
 */
const fs = require('fs');
const path = require('path');

const BRAND = 'Guarros Extremeños';
const SRC_DIR = path.resolve(process.cwd(), 'src');
const INDEX_HTML = path.resolve(process.cwd(), 'index.html');

const exts = new Set(['.js', '.jsx', '.ts', '.tsx']);

function listFiles(dir) {
  const out = [];
  (function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else {
        const ext = path.extname(p).toLowerCase();
        if (exts.has(ext)) out.push(p);
      }
    }
  })(dir);
  return out;
}

function cleanFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let orig = src;

  // 1) Remove Helmet imports
  src = src.replace(/^\s*import\s+{?\s*Helmet\s*}?\s+from\s+['"]react-helmet(-async)?['"];?\s*$/gmi, '');

  // 2) Remove <Helmet> ... </Helmet> blocks (multi-line, non-greedy)
  //    Covers both <Helmet>... and <Helmet {...props}>...</Helmet>
  src = src.replace(/<Helmet\b[^>]*>[\s\S]*?<\/Helmet>/gmi, '');

  // 3) Remove any document.title assignments
  src = src.replace(/document\.title\s*=\s*[^;]+;?\s*$/gmi, '');

  // 4) Optional: remove bare <title>... inside JSX (rare, but just in case)
  src = src.replace(/<title>[\s\S]*?<\/title>/gmi, '');

  if (src !== orig) {
    fs.writeFileSync(filePath, src, 'utf8');
    return true;
  }
  return false;
}

function cleanIndexHtml(filePath) {
  if (!fs.existsSync(filePath)) return false;
  let html = fs.readFileSync(filePath, 'utf8');
  let orig = html;

  // Replace or insert <title>
  if (/<title>[\s\S]*?<\/title>/.test(html)) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${BRAND}</title>`);
  } else {
    html = html.replace(/<head>/i, `<head>\n    <title>${BRAND}</title>`);
  }

  if (html !== orig) {
    fs.writeFileSync(filePath, html, 'utf8');
    return true;
  }
  return false;
}

(function run(){
  let changed = 0;
  if (fs.existsSync(SRC_DIR)) {
    const files = listFiles(SRC_DIR);
    for (const f of files) {
      try {
        if (cleanFile(f)) {
          console.log('✔ cleaned', path.relative(process.cwd(), f));
          changed++;
        }
      } catch (e) {
        console.warn('⚠ error cleaning', f, e.message);
      }
    }
  } else {
    console.log('No src/ directory found. Skipping JS/TS cleanup.');
  }

  if (cleanIndexHtml(INDEX_HTML)) {
    console.log('✔ updated index.html <title>');
    changed++;
  }

  if (changed === 0) {
    console.log('No changes were necessary.');
  } else {
    console.log(`Done. Modified ${changed} file(s).`);
    console.log('Tip: remove dependencies if unused -> npm remove react-helmet react-helmet-async');
  }
})();
