#!/usr/bin/env node
/**
 * Vite build runner (CommonJS) que evita los shims de .bin.
 * Ejecuta directamente el CLI JS de Vite con Node.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const viteBin = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');

const args = ['build'];
const result = spawnSync(process.execPath, [viteBin, ...args], {
  stdio: 'inherit',
  env: process.env,
  cwd: process.cwd(),
});

process.exit(result.status == null ? 1 : result.status);