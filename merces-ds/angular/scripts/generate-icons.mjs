// generate-icons.mjs
// Reads every SVG file in src/assets/icon/svg/ and writes src/assets/icon/icon-map.ts.
// Run manually:  npm run generate-icons
// Runs automatically before every build via the "prebuild" npm script.

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SVG_DIR   = resolve(__dirname, '../src/assets/icon/svg');
const OUTPUT    = resolve(__dirname, '../src/assets/icon/icon-map.ts');

const entries = {};

for (const iconName of readdirSync(SVG_DIR).sort()) {
  const iconDir = join(SVG_DIR, iconName);
  if (!statSync(iconDir).isDirectory()) continue;

  for (const file of readdirSync(iconDir).sort()) {
    if (!file.endsWith('.svg')) continue;
    const type    = file.slice(0, -4); // strip .svg extension
    const content = readFileSync(join(iconDir, file), 'utf-8').trim();
    // Escape characters that would break a JS template literal
    const escaped = content
      .replace(/\\/g, '\\\\')
      .replace(/`/g,  '\\`')
      .replace(/\$\{/g, '\\${');
    entries[`${iconName}/${type}`] = escaped;
  }
}

const count = Object.keys(entries).length;

const lines = [
  '// AUTO-GENERATED — do not edit manually.',
  `// Source: src/assets/icon/svg/ (${count} icons)`,
  '// Regenerate: npm run generate-icons',
  '',
  'export const ICON_SVG_MAP: Record<string, string> = {',
];

for (const [key, escaped] of Object.entries(entries)) {
  lines.push(`  '${key}': \`${escaped}\`,`);
}

lines.push('};', '');

writeFileSync(OUTPUT, lines.join('\n'), 'utf-8');
console.log(`✓ icon-map.ts — ${count} icons written to ${OUTPUT}`);
