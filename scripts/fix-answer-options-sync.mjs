/**
 * Pro každý select_one topic: najdi tasks kde correctAnswer není v options,
 * a oprav correctAnswer na nejlepší matching option.
 * Používá heuristický přístup line-by-line.
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

function similarity(a, b) {
  const wa = a.toLowerCase().replace(/[–—()\[\]]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const wb = new Set(b.toLowerCase().replace(/[–—()\[\]]/g, ' ').split(/\s+/).filter(w => w.length > 2));
  let common = 0;
  wa.forEach(w => { if (wb.has(w)) common++; });
  return common / Math.max(wa.length, 1);
}

function bestMatch(ca, opts) {
  if (opts.includes(ca)) return ca;
  let best = opts[0], bestScore = 0;
  opts.forEach(opt => {
    const s = similarity(ca, opt);
    if (s > bestScore) { bestScore = s; best = opt; }
  });
  return bestScore > 0.1 ? best : opts[0];
}

const files = execSync(
  'find src/content/grade-5 src/content/grade-4 -name "*.ts" ' +
  '-not -name "index.ts" -not -name "TEMPLATE.ts" ' +
  '-not -name "displayNames.ts" -not -name "*.test.ts"'
).toString().trim().split('\n').filter(Boolean);

let totalFixed = 0;
let totalTasks = 0;

files.forEach(file => {
  const content = readFileSync(file, 'utf8');

  // Zkontroluj jestli je to select_one soubor
  if (!content.includes('inputType: "select_one"') && !content.includes("inputType: 'select_one'")) return;

  // Parsuj tasks heuristicky - najdi bloky { question:..., correctAnswer:..., options:[...] }
  // Strategie: zpracuj soubor jako string a hledej mismatch patterny

  let fixed = content;
  let fileChanged = false;

  // Regex pro task blok (zjednodusena verze - hledej correctAnswer + options na blízkých řádcích)
  // Najdi každý výskyt correctAnswer: "..." a pak options: [...]
  const lines = content.split('\n');
  const newLines = [...lines];

  for (let i = 0; i < lines.length; i++) {
    const caMatch = lines[i].match(/^\s*correctAnswer:\s*"(.+)",?\s*$/);
    if (!caMatch) continue;

    const ca = caMatch[1];

    // Hledej options v následujících 20 řádcích
    let optsStart = -1, optsContent = '';
    for (let j = i + 1; j < Math.min(i + 25, lines.length); j++) {
      if (lines[j].includes('options:')) {
        optsStart = j;
        // Sbírej content options bloku
        let depth = 0;
        for (let k = j; k < Math.min(j + 15, lines.length); k++) {
          optsContent += lines[k] + '\n';
          for (const c of lines[k]) {
            if (c === '[') depth++;
            if (c === ']') depth--;
          }
          if (depth === 0 && optsContent.includes('[')) break;
        }
        break;
      }
      // Pokud narazíme na další question, přestaneme
      if (lines[j].includes('question:') && j > i + 1) break;
    }

    if (!optsContent) continue;

    // Extrahuj options
    const opts = [...optsContent.matchAll(/"([^"]+)"/g)].map(m => m[1]);
    if (opts.length === 0) continue;

    // Zkontroluj match
    if (opts.includes(ca)) continue;

    // Najdi nejlepší match
    const best = bestMatch(ca, opts);
    totalTasks++;

    // Nahraď correctAnswer
    const oldLine = newLines[i];
    const newLine = oldLine.replace(`correctAnswer: "${ca}"`, `correctAnswer: "${best}"`);
    if (newLine !== oldLine) {
      newLines[i] = newLine;
      fileChanged = true;
    }
  }

  if (fileChanged) {
    writeFileSync(file, newLines.join('\n'), 'utf8');
    totalFixed++;
  }
});

console.log(`Opraveno souborů: ${totalFixed}`);
console.log(`Opraveno tasks: ${totalTasks}`);
