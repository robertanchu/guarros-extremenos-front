#!/usr/bin/env node
/**
 * Robust Vite build runner that avoids `node_modules/.bin` shims.
 * It runs Vite’s CLI JS directly with Node to dodge permission issues in Linux.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const viteBin = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');

const args = ['build']; // add more args if needed
const result = spawnSync(process.execPath, [viteBin, ...args], {
  stdio: 'inherit',
  env: process.env,
  cwd: process.cwd(),
});

process.exit(result.status == null ? 1 : result.status);
