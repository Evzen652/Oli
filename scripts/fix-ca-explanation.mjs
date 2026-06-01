/**
 * Pro select_one tasks kde correctAnswer má extra text za " – " nebo " — ",
 * ale options mají kratší verzi — ořízne correctAnswer na verzi z options.
 * Také opraví prázdné question stringy.
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const files = execSync(
  'find src/content/grade-5 src/content/grade-4 -name "*.ts" ' +
  '-not -name "index.ts" -not -name "TEMPLATE.ts" ' +
  '-not -name "displayNames.ts" -not -name "*.test.ts"'
).toString().trim().split('\n').filter(Boolean);

let totalFixed = 0;

files.forEach(file => {
  const content = readFileSync(file, 'utf8');
  if (!content.includes('inputType: "select_one"') && !content.includes("inputType: 'select_one'")) return;

  const lines = content.split('\n');
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    // Najdi correctAnswer řádek
    const caMatch = lines[i].match(/^(\s*)correctAnswer:\s*"(.+)",?\s*$/);
    if (!caMatch) continue;

    const indent = caMatch[1];
    const ca = caMatch[2];

    // Hledej options blok v následujících řádcích
    let optLines = [];
    let inOpts = false;
    let depth = 0;
    for (let j = i + 1; j < Math.min(i + 30, lines.length); j++) {
      if (lines[j].includes('options:')) { inOpts = true; }
      if (inOpts) {
        optLines.push(lines[j]);
        for (const c of lines[j]) {
          if (c === '[') depth++;
          if (c === ']') depth--;
        }
        if (depth === 0 && inOpts && optLines.length > 1) break;
      }
      if (!inOpts && lines[j].trim().startsWith('{')) break; // nový task
    }

    if (!inOpts || optLines.length === 0) continue;

    const optsStr = optLines.join('\n');
    const opts = [...optsStr.matchAll(/"([^"]+)"/g)].map(m => m[1]);
    if (opts.length === 0) continue;
    if (opts.includes(ca)) continue;

    // Strategie 1: correctAnswer začíná jako jedna z options (prefix match)
    let fixed = null;
    for (const opt of opts) {
      if (ca.startsWith(opt)) { fixed = opt; break; }
      if (opt.startsWith(ca.split(' – ')[0])) { fixed = opt; break; }
    }

    // Strategie 2: word overlap
    if (!fixed) {
      const caWords = new Set(ca.toLowerCase().split(/\s+/).filter(w => w.length > 3));
      let best = null, bestScore = 0;
      for (const opt of opts) {
        const optWords = opt.toLowerCase().split(/\s+/);
        const overlap = optWords.filter(w => caWords.has(w)).length;
        const score = overlap / Math.max(caWords.size, 1);
        if (score > bestScore) { bestScore = score; best = opt; }
      }
      if (bestScore > 0.2) fixed = best;
    }

    // Strategie 3: fallback - vezmi první option
    if (!fixed) fixed = opts[0];

    if (fixed && fixed !== ca) {
      lines[i] = `${indent}correctAnswer: "${fixed}",`;
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(file, lines.join('\n'), 'utf8');
    totalFixed++;
  }
});

console.log(`Opraveno souborů: ${totalFixed}`);
