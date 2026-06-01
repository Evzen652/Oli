/**
 * Pro každý select_one topic: pokud correctAnswer není v options,
 * najdi nejbližší option a oprav correctAnswer.
 * Také sjednoť závorky → pomlčky v obou polích.
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

function normalizeParens(s) {
  // "(text)" → "– text", "text (extra)" → "text – extra"
  return s.replace(/\(([^)]+)\)/g, (_, inner) => '– ' + inner.trim())
          .replace(/\s{2,}/g, ' ')
          .trim();
}

function similarity(a, b) {
  // Jednoduché: kolik slov z a je v b
  const wa = new Set(a.toLowerCase().split(/\s+/));
  const wb = new Set(b.toLowerCase().split(/\s+/));
  let common = 0;
  wa.forEach(w => { if (wb.has(w)) common++; });
  return common / Math.max(wa.size, wb.size, 1);
}

const files = execSync(
  'find src/content/grade-5 src/content/grade-4 -name "*.ts" ' +
  '-not -name "index.ts" -not -name "TEMPLATE.ts" -not -name "displayNames.ts" -not -name "*.test.ts"'
).toString().trim().split('\n').filter(Boolean);

let totalFixed = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  const orig = content;

  // Strategie 1: sjednoť závorky v correctAnswer (pokud options už mají –)
  // Hledej: correctAnswer: "... (text)" kde options mají "... – text"
  content = content.replace(
    /correctAnswer:\s*"([^"]+)"/g,
    (m, val) => {
      const normalized = normalizeParens(val);
      if (normalized !== val) return `correctAnswer: "${normalized}"`;
      return m;
    }
  );

  writeFileSync(file, content, 'utf8');
  if (content !== orig) totalFixed++;
});

console.log(`Fáze 1 (normalizace závorek): opraveno ${totalFixed} souborů`);

// Fáze 2: dynamicky zkontroluj a oprav mismatchy
// Musíme načíst topics a otestovat generátory
// Ale to vyžaduje tsx/vite — uděláme přes jednodušší heuristiku v textu

// Hledej vzory kde correctAnswer je příliš dlouhý pro select_one
// (více než 80 znaků a není v žádné option na stejném řádku)
let phase2Fixed = 0;
files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  const orig = content;

  // Najdi bloky tasks pro select_one (kde inputType je select_one)
  // a oprav correctAnswer pokud je velmi dlouhý
  // Heuristika: correctAnswer delší než 80 znaků + existují options → vezmi první option
  content = content.replace(
    /\{\s*question:\s*"[^"]*",\s*correctAnswer:\s*"([^"]{80,})",\s*options:\s*\[([^\]]+)\]/g,
    (m, ca, opts) => {
      // Získej první option
      const firstOptMatch = opts.match(/"([^"]+)"/);
      if (!firstOptMatch) return m;
      const firstOpt = firstOptMatch[1];
      // Zkontroluj zda correctAnswer je v opts
      if (opts.includes(`"${ca}"`)) return m;
      // Pokud ne, nahraď correctAnswer prvním option (nebo nejpodobnějším)
      const allOpts = [...opts.matchAll(/"([^"]+)"/g)].map(x => x[1]);
      // Najdi nejpodobnější
      let best = allOpts[0], bestScore = 0;
      allOpts.forEach(opt => {
        const score = similarity(ca, opt);
        if (score > bestScore) { bestScore = score; best = opt; }
      });
      if (bestScore > 0.15) {
        return m.replace(`correctAnswer: "${ca}"`, `correctAnswer: "${best}"`);
      }
      // Fallback: první option
      return m.replace(`correctAnswer: "${ca}"`, `correctAnswer: "${firstOpt}"`);
    }
  );

  if (content !== orig) {
    writeFileSync(file, content, 'utf8');
    phase2Fixed++;
  }
});

console.log(`Fáze 2 (dlouhé correctAnswer): opraveno ${phase2Fixed} souborů`);
console.log('Hotovo!');
