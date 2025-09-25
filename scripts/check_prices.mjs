#!/usr/bin/env node
/**
 * Prebuild check for Stripe price IDs and required env vars.
 * - Fails if any priceId placeholder remains in src/data/products.js
 * - Fails if any priceId doesn't look like "price_..."
 * - Warns if VITE_BACKEND_URL is not set in current environment (unless building locally knowingly)
 */
import { readFile } from 'fs/promises';
import path from 'path';
import process from 'process';

const root = process.cwd();
const productsPath = path.join(root, 'src', 'data', 'products.js');

const content = await readFile(productsPath, 'utf8');

const placeholders = [
  'price_ENT_UNIQUE_REPLACE',
  'price_LON_UNIQUE_REPLACE',
  'price_SUB_500_REPLACE',
  'price_SUB_1000_REPLACE',
];

let hasError = false;

// 1) No placeholders should remain
for (const ph of placeholders) {
  if (content.includes(ph)) {
    console.error(`❌ FALTA sustituir el placeholder: ${ph} en ${productsPath}`);
    hasError = true;
  }
}

// 2) Check all priceId values look valid (price_...)
const priceIdRegex = /priceId:\s*["'`]([^"'`]+)["'`]/g;
let m;
while ((m = priceIdRegex.exec(content)) !== null) {
  const val = m[1];
  if (!val.startsWith('price_')) {
    console.error(`❌ priceId inválido: "${val}". Debe empezar por "price_".`);
    hasError = true;
  }
}

if (hasError) {
  console.error("🚫 Build bloqueado. Corrige los errores anteriores.");
  process.exit(1);
}

// 3) Warn if missing VITE_BACKEND_URL at build time
if (!process.env.VITE_BACKEND_URL) {
  console.warn("⚠️  VITE_BACKEND_URL no está definido en el entorno. Asegúrate de exportarlo o tenerlo en tu .env para producción.");
}

console.log("✅ Prebuild check OK: priceId y entorno correctos.");
