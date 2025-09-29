#!/usr/bin/env node
try { require('fs').rmSync('dist', { recursive: true, force: true }); } catch {}
