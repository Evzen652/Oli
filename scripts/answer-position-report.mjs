#!/usr/bin/env node
/**
 * Měří, jak předvídatelná je pozice správné odpovědi napříč korpusem.
 *
 * Použití:
 *   node scripts/answer-position-report.mjs             # celý src/content
 *   node scripts/answer-position-report.mjs --files     # + rozpis po souborech
 *   node scripts/answer-position-report.mjs --no-inf    # bez informatiky
 *
 * Proč to existuje: `gen()` míchá pořadí úloh, ale NE pořadí možností. Když
 * autor píše klíč vždy na stejnou pozici, dítě uhodne odpověď bez znalosti
 * látky. Měřeno 2026-09-01 před opravou: 64 % klíčů na 1. pozici.
 *
 * ⚠️ SLEPÉ MÍSTO PŮVODNÍ VERZE (opraveno 2026-09-01):
 * Skript hlídal výhradně zkosení na PRVNÍ pozici. Třináct témat `grade-5/cjl`
 * mělo klíč na DRUHÉ pozici u 88–100 % úloh — strategie „ber vždy druhý" tam
 * procházela se stoprocentní úspěšností a report je nikdy neukázal.
 * Nyní se hodnotí maximum přes všechny čtyři pozice.
 *
 * Souvisí: scripts/rebalance-answer-positions.mjs (oprava jednoho souboru).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const showFiles = process.argv.includes("--files");
const skipInf = process.argv.includes("--no-inf");

/** Práh, nad kterým je soubor hlášen jako zkosený. */
const THRESHOLD = 0.4;
/** Menší soubory nemají dost dat, aby byl podíl vypovídající. */
const MIN_TASKS = 10;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith(".ts") && e !== "index.ts") out.push(p);
  }
  return out;
}

const files = walk(join(ROOT, "src/content"));
const pos = [0, 0, 0, 0];
const perFile = [];
let total = 0;

for (const f of files) {
  const rel = relative(ROOT, f).split(String.fromCharCode(92)).join("/");
  if (skipInf && rel.includes("/informatika/")) continue;

  const src = readFileSync(f, "utf8");
  const re =
    /correctAnswer:\s*"((?:[^"\\]|\\.)*)"\s*,\s*options:\s*\[((?:[^\][]|\[[^\]]*\])*)\]/g;
  let m;
  let n = 0;
  const local = [0, 0, 0, 0];
  while ((m = re.exec(src))) {
    const opts = [...m[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]);
    if (opts.length !== 4) continue;
    const i = opts.indexOf(m[1]);
    if (i < 0) continue;
    n++;
    total++;
    pos[i]++;
    local[i]++;
  }
  if (n > 0) {
    const worst = Math.max(...local);
    perFile.push({
      rel,
      n,
      local,
      worstPos: local.indexOf(worst) + 1,
      worstShare: worst / n,
    });
  }
}

console.log(
  "Úloh se 4 možnostmi: " +
    total +
    "  (souborů: " +
    perFile.length +
    ")" +
    (skipInf ? "  [bez informatiky]" : "")
);
console.log("\nPozice správné odpovědi:");
for (const k of [0, 1, 2, 3]) {
  const pct = Math.round((pos[k] / total) * 100);
  console.log(
    "  " + (k + 1) + ". místo: " + String(pos[k]).padStart(5) + "  " + pct + " %"
  );
}
console.log("\nIdeál je 25 % na každé pozici. Náhoda u 4 možností = 25 % úspěšnost;");
console.log("čím víc se jedna pozice vymyká, tím lépe funguje strategie „ber vždy tu samou\".");

const skewed = perFile.filter(
  (x) => x.n >= MIN_TASKS && x.worstShare > THRESHOLD
);
console.log(
  "\nSouborů, kde jedna pozice drží >" +
    Math.round(THRESHOLD * 100) +
    " % klíčů (min. " +
    MIN_TASKS +
    " úloh): " +
    skewed.length
);
if (showFiles) {
  for (const x of skewed.sort((a, b) => b.worstShare - a.worstShare)) {
    const share = Math.round(x.worstShare * 100);
    const rozpis = x.local
      .map((v) => Math.round((v / x.n) * 100) + "%")
      .join("/");
    console.log(
      "  " +
        String(share).padStart(3) +
        " % na " +
        x.worstPos +
        ". pozici   " +
        rozpis.padEnd(20) +
        " n=" +
        String(x.n).padEnd(4) +
        x.rel
    );
  }
} else if (skewed.length) {
  console.log("  (rozpis přidá přepínač --files)");
}
