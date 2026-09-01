#!/usr/bin/env node
/**
 * Měří, jak předvídatelná je pozice správné odpovědi napříč korpusem.
 *
 * Použití:
 *   node scripts/answer-position-report.mjs            # celý src/content
 *   node scripts/answer-position-report.mjs --files    # + rozpis po souborech
 *
 * Proč to existuje: `gen()` míchá pořadí úloh, ale NE pořadí možností. Když
 * autor píše klíč vždy jako první možnost, dítě uhodne odpověď strategií
 * „ber první" bez znalosti látky. Měřeno 2026-09-01: 66 % klíčů na 1. pozici.
 *
 * Souvisí: scripts/rebalance-answer-positions.mjs (oprava jednoho souboru).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const showFiles = process.argv.includes("--files");

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith(".ts") && e !== "index.ts") out.push(p);
  }
  return out;
}

const files = walk(join(ROOT, "src/content"));
const pos = { 0: 0, 1: 0, 2: 0, 3: 0 };
const perFile = [];
let total = 0;

for (const f of files) {
  const src = readFileSync(f, "utf8");
  const re = /correctAnswer:\s*"((?:[^"\\]|\\.)*)"\s*,\s*options:\s*\[((?:[^\][]|\[[^\]]*\])*)\]/g;
  let m;
  let n = 0;
  let atZero = 0;
  while ((m = re.exec(src))) {
    const opts = [...m[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]);
    if (opts.length !== 4) continue;
    const i = opts.indexOf(m[1]);
    if (i < 0) continue;
    n++;
    total++;
    pos[i]++;
    if (i === 0) atZero++;
  }
  if (n > 0) {
    perFile.push({
      rel: relative(ROOT, f).split(String.fromCharCode(92)).join("/"),
      n,
      atZero,
    });
  }
}

console.log("Úloh se 4 možnostmi: " + total + "  (souborů: " + perFile.length + ")");
console.log("\nPozice správné odpovědi:");
for (const k of [0, 1, 2, 3]) {
  const pct = Math.round((pos[k] / total) * 100);
  console.log("  " + (k + 1) + ". místo: " + String(pos[k]).padStart(5) + "  " + pct + " %");
}
console.log("\nIdeál je 25 % na každé pozici. Náhoda u 4 možností = 25 % úspěšnost;");
console.log("čím vyšší podíl na 1. místě, tím lépe funguje strategie „ber vždy první\".");

const skewed = perFile.filter((x) => x.n >= 10 && x.atZero / x.n > 0.8);
console.log("\nSouborů s >80 % klíčů na 1. místě (min. 10 úloh): " + skewed.length);
if (showFiles) {
  for (const x of skewed.sort((a, b) => b.atZero / b.n - a.atZero / a.n)) {
    console.log("  " + Math.round((x.atZero / x.n) * 100) + " %  (" + x.atZero + "/" + x.n + ")  " + x.rel);
  }
} else if (skewed.length) {
  console.log("  (rozpis přidá přepínač --files)");
}
