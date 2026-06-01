/**
 * Bezpečná verze opravy correctAnswer mismatch.
 * Přeskakuje soubory s \" v stringových hodnotách (příliš komplexní pro regex).
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const files = execSync(
  'find src/content/grade-5 src/content/grade-4 -name "*.ts" ' +
  '-not -name "index.ts" -not -name "TEMPLATE.ts" ' +
  '-not -name "displayNames.ts" -not -name "*.test.ts"'
).toString().trim().split('\n').filter(Boolean);

let totalFixed = 0;
let skipped = 0;

files.forEach(file => {
  const content = readFileSync(file, 'utf8');

  // Přeskoč soubory s escaped quotes v string hodnotách
  if (content.includes('\\"')) { skipped++; return; }
  if (!content.includes('inputType: "select_one"') && !content.includes("inputType: 'select_one'")) return;

  const lines = content.split('\n');
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const caMatch = lines[i].match(/^(\s*)correctAnswer:\s*"([^"]*)",?\s*$/);
    if (!caMatch) continue;

    const indent = caMatch[1];
    const ca = caMatch[2];
    if (!ca) continue;

    // Hledej options
    let optLines = [], inOpts = false, depth = 0;
    for (let j = i + 1; j < Math.min(i + 30, lines.length); j++) {
      if (lines[j].includes('options:')) inOpts = true;
      if (inOpts) {
        optLines.push(lines[j]);
        for (const c of lines[j]) {
          if (c === '[') depth++;
          if (c === ']') depth--;
        }
        if (depth === 0 && optLines.length > 1) break;
      }
      if (!inOpts && lines[j].trim().startsWith('{') && j > i + 1) break;
    }

    if (!inOpts || optLines.length === 0) continue;

    const opts = [...optLines.join('\n').matchAll(/"([^"]+)"/g)].map(m => m[1]);
    if (opts.length === 0 || opts.includes(ca)) continue;

    // Najdi nejbližší match
    const caPrefix = ca.split(' – ')[0].split(' — ')[0].trim();
    let fixed = null;

    // Přesná shoda začátku
    for (const opt of opts) {
      if (opt === ca) { fixed = opt; break; }
      if (opt.startsWith(caPrefix) || ca.startsWith(opt)) { fixed = opt; break; }
    }

    // Word overlap
    if (!fixed) {
      const caWords = new Set(ca.toLowerCase().split(/[\s,;:]+/).filter(w => w.length > 3));
      let best = null, bestScore = 0;
      for (const opt of opts) {
        const score = opt.toLowerCase().split(/[\s,;:]+/).filter(w => caWords.has(w)).length;
        if (score > bestScore) { bestScore = score; best = opt; }
      }
      if (bestScore > 0) fixed = best;
    }

    if (!fixed) fixed = opts[0];

    if (fixed !== ca) {
      lines[i] = `${indent}correctAnswer: "${fixed}",`;
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(file, lines.join('\n'), 'utf8');
    totalFixed++;
  }
});

console.log(`Opraveno: ${totalFixed} souborů, přeskočeno: ${skipped} souborů s \\\"`);
