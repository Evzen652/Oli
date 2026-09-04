// pcd.mjs — patcher pro formát { question, correct, distractors } (typicky grade-2).
//
// Proč existuje: pv2/pv3/pv4 kotví na `correctAnswer:` nebo ` a: "` a na tomhle
// formátu skončí na „NEAPLIKOVANO - oprav kotvy" (past č. 10 v handoffu).
// Kotví se na TEXT OTÁZKY, protože klíč se v souboru vyskytuje jen jednou
// (na rozdíl od ostatních formátů se neopakuje i v poli možností).
//
// Volání: node scripts/wave-b/pcd.mjs <soubor> dry|apply <zadani.json>
// Formát zadání: [[text-otazky, novy-klic, [distraktor1, distraktor2, ...]], …]
import { readFileSync, writeFileSync } from "node:fs";

const [file, mode, zadaniPath] = process.argv.slice(2);
if (!file || !["dry", "apply"].includes(mode) || !zadaniPath) {
  console.error("pouziti: pcd.mjs <soubor> dry|apply <zadani.json>");
  process.exit(1);
}

let src = readFileSync(file, "utf8");
const zadani = JSON.parse(readFileSync(zadaniPath, "utf8"));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let ok = 0;
let fail = 0;

for (const [otazka, klic, distraktory] of zadani) {
  const re = new RegExp(
    `(\\{ question: "${esc(otazka)}", correct: ")([^"]*)(", distractors: \\[)([^\\]]*)(\\])`,
  );
  const shod = src.match(new RegExp(re.source, "g")) ?? [];
  if (shod.length !== 1) {
    console.log(`!! ${shod.length} shod: ${otazka.slice(0, 50)}`);
    fail++;
    continue;
  }
  const noveD = distraktory.map((d) => `"${d}"`).join(", ");
  src = src.replace(re, (_m, a, _stary, c, _stareD, e) => a + klic + c + noveD + e);
  console.log(`  ok <- ${otazka.slice(0, 45)}`);
  ok++;
}

if (fail > 0) {
  console.log(`${mode === "dry" ? "NASUCHO" : "APLIKOVANO"} ${ok} ok, ${fail} chyb`);
  throw new Error("NEAPLIKOVANO - oprav kotvy");
}
if (mode === "apply") writeFileSync(file, src);
console.log(`${mode === "dry" ? "NASUCHO" : "APLIKOVANO"} ${ok} ok, 0 chyb`);
