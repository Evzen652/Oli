/**
 * Opraví inline (single-line) task objekty kde correctAnswer != option.
 * Pro každý inline task: pokud correctAnswer není v options, vezme nejbližší option.
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const BACKSLASH = '\x5C';
const QUOTE = '\x22';

function hasRealEscapedQuotes(content) {
  for (let i = 0; i < content.length - 1; i++) {
    if (content[i] === BACKSLASH && content[i+1] === QUOTE) return true;
  }
  return false;
}

function parseOptionsFromLine(line) {
  // Hledej options: [...] v řádku
  const optsMatch = line.match(/options:\s*\[([^\]]+)\]/);
  if (!optsMatch) return [];
  const optsStr = optsMatch[1];
  // Extrahuj stringy (bez escaped quotes)
  const opts = [];
  let i = 0;
  while (i < optsStr.length) {
    if (optsStr[i] === QUOTE) {
      let j = i + 1;
      while (j < optsStr.length && optsStr[j] !== QUOTE) j++;
      if (j < optsStr.length) {
        opts.push(optsStr.substring(i + 1, j));
        i = j + 1;
        continue;
      }
    }
    i++;
  }
  return opts;
}

function findBestOption(ca, opts) {
  if (opts.includes(ca)) return ca;
  // Prefix match
  const caBase = ca.split(' – ')[0].split(' — ')[0].trim().substring(0, 30);
  for (const opt of opts) {
    if (opt.startsWith(caBase) || caBase.startsWith(opt.substring(0, 25))) return opt;
  }
  // Word overlap
  const caWords = new Set(ca.toLowerCase().split(/[\s,;:]+/).filter(w => w.length > 3));
  let best = opts[0], bestScore = 0;
  for (const opt of opts) {
    const score = opt.toLowerCase().split(/[\s,;:]+/).filter(w => caWords.has(w)).length;
    if (score > bestScore) { bestScore = score; best = opt; }
  }
  return best;
}

const files = execSync(
  'find src/content/grade-5 src/content/grade-4 -name "*.ts" ' +
  '-not -name "index.ts" -not -name "TEMPLATE.ts" ' +
  '-not -name "displayNames.ts" -not -name "*.test.ts"'
).toString().trim().split('\n').filter(Boolean);

let totalFixed = 0;

files.forEach(file => {
  const content = readFileSync(file, 'utf8');

  // Přeskoč soubory s escaped quotes (primaANeprimaRec apod.)
  if (hasRealEscapedQuotes(content)) return;
  if (!content.includes('inputType: "select_one"')) return;

  const lines = content.split('\n');
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Hledej inline task: { ... correctAnswer: "..." ... options: [...] ... }
    const caMatch = line.match(/correctAnswer:\s*"([^"]+)"/);
    if (!caMatch) continue;

    const ca = caMatch[1];
    const opts = parseOptionsFromLine(line);

    if (opts.length === 0 || opts.includes(ca)) continue;

    const best = findBestOption(ca, opts);
    if (best !== ca) {
      lines[i] = line.replace(
        `correctAnswer: "${ca}"`,
        `correctAnswer: "${best}"`
      );
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(file, lines.join('\n'), 'utf8');
    totalFixed++;
  }
});

console.log(`Opraveno souborů: ${totalFixed}`);
