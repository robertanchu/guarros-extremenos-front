#!/usr/bin/env node
// scripts/clean-dist.cjs
try { require('fs').rmSync('dist', { recursive: true, force: true }); } catch {}