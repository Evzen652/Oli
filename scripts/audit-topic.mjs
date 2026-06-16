#!/usr/bin/env node
/**
 * BRÁNA 0 — deterministická kontrola jednoho tématu (author-batch pipeline).
 *
 * Použití:
 *   node scripts/audit-topic.mjs <topicId> [test.ts]               # téma z registru
 *   node scripts/audit-topic.mjs --file <cesta.ts> [--export NÁZEV] [test.ts]  # ze souboru
 *   (file režim = téma ještě nemusí být v index.ts — pro author-batch workflow)
 *
 * Co dělá:
 *   - spustí vitest na `src/test/topic-gate.test.ts` s GATE_TOPIC_ID=<topicId>
 *     (audity + strukturální invarianty + dump vzorku), a pokud je předán
 *     druhý argument, spustí i vlastní test tématu (s nezávislým solverem)
 *   - rozparsuje GATE_RESULT_JSON, vytiskne čitelný PASS/FAIL přehled
 *   - uloží vzorek instancí do `.audit-topic/<topicId>.json` (pro LLM kritiky)
 *   - exit 0 = čisté, exit 1 = vada (téma se NEMÁ posílat k LLM ověření)
 *
 * Žádné LLM volání — čistě deterministické, zdarma. Tohle je levný filtr,
 * který odchytí mechanické vady (Cause C, hint_leak, giveaway, gradace…) dřív,
 * než se utratí token na žáka/pedagoga.
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const argv = process.argv.slice(2);
const gateEnv = {};
let label;
let topicTestPath; // volitelné: vlastní test tématu (solver)

if (argv[0] === "--file") {
  const filePath = argv[1];
  if (!filePath) {
    console.error("Použití: node scripts/audit-topic.mjs --file <cesta.ts> [--export NÁZEV] [test.ts]");
    process.exit(2);
  }
  gateEnv.GATE_TOPIC_FILE = filePath;
  label = filePath;
  const ei = argv.indexOf("--export");
  if (ei !== -1 && argv[ei + 1]) gateEnv.GATE_TOPIC_EXPORT = argv[ei + 1];
  // poslední arg končící na .test.ts(x) = test tématu
  topicTestPath = argv.slice(2).find((a) => /\.test\.tsx?$/.test(a) && a !== argv[ei + 1]);
} else {
  const topicId = argv[0];
  if (!topicId) {
    console.error("Použití: node scripts/audit-topic.mjs <topicId> [test.ts]   |   --file <cesta.ts> [--export NÁZEV]");
    process.exit(2);
  }
  gateEnv.GATE_TOPIC_ID = topicId;
  label = topicId;
  topicTestPath = argv[1];
}

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";

const vitestArgs = ["vitest", "run", "src/test/topic-gate.test.ts"];
if (topicTestPath) vitestArgs.push(topicTestPath);
vitestArgs.push("--reporter=basic");

const child = spawn("npx", vitestArgs, {
  cwd: repoRoot,
  env: { ...process.env, ...gateEnv },
  shell: isWindows,
});

let out = "";
child.stdout.on("data", (d) => (out += d.toString()));
child.stderr.on("data", (d) => (out += d.toString()));

child.on("exit", (vitestCode) => {
  const m = out.match(/GATE_RESULT_JSON(.*?)GATE_RESULT_END/s);
  if (!m) {
    console.error(`\n✗ BRÁNA 0 — ${label}: gate nevrátil výsledek (vitest exit ${vitestCode}).`);
    // ukaž posledních pár řádků vitest výstupu pro diagnostiku
    console.error(out.split("\n").filter((l) => /FAIL|Error|✗|×/.test(l)).slice(0, 12).join("\n"));
    process.exit(1);
  }

  let r;
  try {
    r = JSON.parse(m[1]);
  } catch {
    console.error(`✗ BRÁNA 0 — ${label}: nečitelný GATE_RESULT_JSON.`);
    process.exit(1);
  }

  // ulož vzorek pro LLM kritiky (název dle skutečného id tématu)
  const outDir = join(repoRoot, ".audit-topic");
  mkdirSync(outDir, { recursive: true });
  const outName = (r.topicId ?? label).replace(/[^a-z0-9_-]/gi, "_");
  writeFileSync(join(outDir, `${outName}.json`), JSON.stringify(r, null, 2), "utf8");

  // čitelný přehled
  const line = "─".repeat(48);
  console.log(`\n${line}`);
  console.log(`  BRÁNA 0 — ${r.topicId} (${r.inputType})`);
  console.log(line);
  const report = (title, arr, fmt) => {
    console.log(`  ${title}: ${arr.length}`);
    arr.slice(0, 8).forEach((x) => console.log(`     • ${fmt(x)}`));
    if (arr.length > 8) console.log(`     … a dalších ${arr.length - 8}`);
  };
  // BLOKUJÍCÍ — strukturální invarianty (vždy reálné)
  report("⛔ BLOK · invarianty", r.invariantErrors ?? [], (x) => x);
  // K REVIZI — heuristika s falešnými poplachy, adjudikuje pedagog-kritik
  const auditFindings = [
    ...(r.contentIssues ?? []).map((x) => `[${x.category}] ${x.detail}`),
    ...(r.pedagogicalIssues ?? []).map((x) => `[${x.category}] ${x.detail}`),
  ];
  report("⚠️  REVIZE · audit (heuristika)", auditFindings, (x) => x);
  const nSamples = Object.values(r.samples ?? {}).reduce((a, b) => a + b.length, 0);
  console.log(`  Vzorek instancí: ${nSamples} → .audit-topic/${outName}.json`);

  // tvrdý fail = strukturální invariant NEBO pád vlastního testu tématu (solver)
  const ownTestFailed = topicTestPath && vitestCode !== 0 && r.pass;
  const pass = r.pass && !ownTestFailed;
  console.log(line);
  if (pass) {
    const note = auditFindings.length ? ` (${auditFindings.length} k revizi kritikem)` : " (čisté)";
    console.log(`  ✓ PASS — strukturálně OK, připraveno pro LLM kritiky${note}`);
  } else {
    console.log("  ✗ FAIL — strukturální vada, oprav před LLM ověřením");
  }
  if (ownTestFailed) console.log("  (vlastní test tématu / solver selhal — viz vitest výstup výše)");
  console.log(`${line}\n`);

  process.exit(pass ? 0 : 1);
});
