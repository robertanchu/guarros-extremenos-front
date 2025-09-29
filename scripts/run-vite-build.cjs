#!/usr/bin/env node
/**
 * Runner CJS para Vite: evita node_modules/.bin
 */
const { spawnSync } = require('child_process');
const path = require('path');

const viteBin = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
const result = spawnSync(process.execPath, [viteBin, 'build'], {
  stdio: 'inherit',
  env: process.env,
  cwd: process.cwd(),
});
process.exit(result.status == null ? 1 : result.status);