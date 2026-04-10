const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourcePath = path.resolve(__dirname, '../../Vibecode/Claude/Applications/merces-ds/angular/src');
const destinationPath = path.resolve(__dirname, './merces-ds/src');

console.log('🔄 Synchronizing Merces Design System...');

if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Source path not found: ${sourcePath}`);
  console.error('If you moved your Applications folder, please update the sync-ds.js script.');
  process.exit(1);
}

try {
  // Use rsync to mirror the directory perfectly
  execSync(`rsync -av --delete --exclude='node_modules' --exclude='.git' "${sourcePath}/" "${destinationPath}/"`, { stdio: 'inherit' });
  console.log('✅ Design System successfully baked into Payerpath!');
} catch (error) {
  console.error('❌ Failed to synchronize Design System:', error.message);
  process.exit(1);
}
