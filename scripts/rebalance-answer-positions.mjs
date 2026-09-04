#!/usr/bin/env node
/**
 * Rovnoměrně rozprostře pozici správné odpovědi mezi 4 možnosti.
 * Mění POUZE pořadí prvků v poli `options` — textů se nedotýká.
 *
 * Použití:
 *   node scripts/rebalance-answer-positions.mjs <soubor.ts> [--dry]
 *
 * ⚠️ Spouštěj jen na `select_one`. U typů, kde na pořadí ZÁLEŽÍ
 * (`drag_order`, `comparison`), by to obsah rozbilo — proto NENÍ plošný.
 * Úlohy s možnostmi typu „všechny výše uvedené" přeskakuje sám.
 *
 * ⚠️ Po spuštění se změní pořadí v souboru, takže doslovné náhrady
 * kotvené na starý tvar `options: [...]` přestanou sedět. Rebalance
 * pouštěj až jako poslední krok úprav souboru.
 *
 * Souvisí: scripts/answer-position-report.mjs (měření celého korpusu).
 */
import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
const dry = process.argv.includes("--dry");
let src = readFileSync(file, "utf8");

// úlohy, kde na pořadí možností ZÁLEŽÍ — nesaháme na ně
const ORDER_SENSITIVE = /výše uveden|všechny odpovědi|žádná z (uvedených|nich)|ani jedna z|obě možnosti|první možnost|poslední možnost/i;

const taskRe = /correctAnswer:\s*"((?:[^"\\]|\\.)*)"\s*,\s*options:\s*\[((?:[^\][]|\[[^\]]*\])*)\]/g;

let counter = 0;
let changed = 0;
let skipped = 0;
const before = { 0: 0, 1: 0, 2: 0, 3: 0 };
const after = { 0: 0, 1: 0, 2: 0, 3: 0 };

src = src.replace(taskRe, (whole, correct, optsRaw) => {
  const opts = [...optsRaw.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
  if (opts.length !== 4) return whole;

  const cur = opts.indexOf(correct);
  if (cur < 0) return whole;
  before[cur]++;

  if (opts.some((o) => ORDER_SENSITIVE.test(o))) {
    after[cur]++;
    skipped++;
    return whole;
  }

  const target = counter++ % 4;
  if (cur === target) {
    after[cur]++;
    return whole;
  }

  const rest = opts.filter((_, i) => i !== cur);
  const next = [...rest.slice(0, target), correct, ...rest.slice(target)];
  after[target]++;
  changed++;

  const rebuilt = next.map((o) => '"' + o + '"').join(", ");
  return whole.replace(/options:\s*\[[\s\S]*\]$/, "options: [" + rebuilt + "]");
});

console.log(file.split(/[/\\]/).pop());
console.log("  pred:  " + JSON.stringify(before));
console.log("  po:    " + JSON.stringify(after));
console.log("  prehozeno: " + changed + " | preskoceno (zavisi na poradi): " + skipped);

if (!dry) writeFileSync(file, src);
else console.log("  [dry-run, nezapsano]");
