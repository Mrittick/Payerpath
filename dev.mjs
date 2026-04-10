/**
 * Dev server manager — wraps `ng serve` and restarts it when merces-ds
 * source files change. Angular's built-in HMR handles payerpath/src
 * changes as usual; this script only intervenes for cross-project changes.
 *
 * Port is locked to 4201 in angular.json — no flag needed here.
 *
 * Usage: node dev.mjs
 */

import { spawn }   from 'child_process';
import { watch }   from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname   = fileURLToPath(new URL('.', import.meta.url));
const mercesDsSrc = resolve(__dirname, '../merces-ds/angular/src');

let ngProcess = null;
let debounce  = null;

function spawnNgServe() {
  const proc = spawn('ng', ['serve'], { stdio: 'inherit', shell: true });
  ngProcess = proc;
  proc.on('exit', code => {
    // Only exit the wrapper if this is still the active process (not a deliberate restart).
    if (ngProcess === proc) process.exit(code ?? 0);
  });
}

function startNgServe() {
  if (ngProcess) {
    const dying = ngProcess;
    ngProcess = null;               // Null before kill so exit handler skips process.exit
    dying.once('exit', spawnNgServe); // Wait for full exit before spawning — prevents port conflict
    dying.kill('SIGTERM');
  } else {
    spawnNgServe();
  }
}

startNgServe();

watch(mercesDsSrc, { recursive: true }, (_, filename) => {
  if (!filename) return;
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    console.log(`\n[dev] merces-ds changed (${filename}) — restarting...\n`);
    startNgServe();
  }, 300);
});

process.on('SIGINT', () => {
  if (ngProcess) ngProcess.kill('SIGTERM');
  process.exit(0);
});
