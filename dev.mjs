/**
 * Dev server manager — wraps `ng serve` and restarts it when merces-ds
 * source files change. Angular's built-in HMR handles payerpath/src
 * changes as usual; this script only intervenes for cross-project changes.
 *
 * Port is locked to 4201 in angular.json (4200 is reserved for Merces DS).
 * On startup, any stale process already holding 4201 is evicted so ng serve
 * never hits the interactive "use a different port?" prompt.
 *
 * Usage: node dev.mjs
 */

import { spawn, execSync } from 'child_process';
import { watch }           from 'fs';
import { resolve }         from 'path';
import { fileURLToPath }   from 'url';

const __dirname   = fileURLToPath(new URL('.', import.meta.url));
const mercesDsSrc = resolve(__dirname, '../merces-ds/angular/src');
const DEV_PORT    = 4201;

let ngProcess = null;
let debounce  = null;

function evictPort(port) {
  try {
    execSync(`lsof -ti tcp:${port} | xargs kill -9`, { stdio: 'ignore' });
  } catch {
    // No process on that port — nothing to do.
  }
}

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
    evictPort(DEV_PORT);
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
