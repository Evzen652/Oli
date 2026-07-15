#!/usr/bin/env node
/**
 * Typecheck s BASELINE guardem.
 *
 * Kontext: root `tsconfig.json` (`files: []` + `references`) nekontroluje NIC,
 * takže `tsc --noEmit` je bezcenný. Reálný typecheck běží proti `tsconfig.app.json`.
 * Codebase má historický dluh type-chyb (esbuild je při buildu ignoruje), proto
 * baseline: skript selže jen když chyb PŘIBUDE (nová type-chyba v commitu/PR).
 * Když chyby ubudou, připomene snížení baseline.
 *
 * Cíl: postupně dotáhnout BASELINE na 0, pak je z guardu tvrdý gate.
 * Lokálně: `npm run typecheck` (surový výpis). CI/guard: `npm run typecheck:ci`.
 */
import { execSync } from "node:child_process";

const BASELINE = 34; // reálný `tsc -p tsconfig.app.json` k 2026-07-15 (start auditu byl 94)

let output = "";
try {
  execSync("npx tsc -p tsconfig.app.json --noEmit", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (e) {
  output = `${e.stdout ?? ""}${e.stderr ?? ""}`;
}

const errors = output.split(/\r?\n/).filter((l) => /error TS\d+/.test(l));
const count = errors.length;

if (count > BASELINE) {
  console.error(`❌ Typecheck: ${count} chyb > baseline ${BASELINE} — přibyly NOVÉ type-chyby:`);
  console.error(errors.join("\n"));
  console.error(`\nOprav je, nebo (jsou-li legitimní) uprav BASELINE v scripts/typecheck.mjs.`);
  process.exit(1);
}

if (count < BASELINE) {
  console.log(`✅ Typecheck: ${count} chyb < baseline ${BASELINE}. Ubyly chyby — sniž BASELINE na ${count} v scripts/typecheck.mjs.`);
  process.exit(0);
}

console.log(`✅ Typecheck: ${count} chyb = baseline ${BASELINE}. Žádné nové. (Cíl: postupně na 0.)`);
process.exit(0);
