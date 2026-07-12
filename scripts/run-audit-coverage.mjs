#!/usr/bin/env node
/**
 * Cross-platform wrapper pro `npm run audit:coverage`.
 *
 * Vypíše level-coverage worklist (L1/L2/L3 pokrytí přes getTierTasks)
 * — kterým tématům chybí L2 nebo L3. Ne-blokující (vždy zelený test).
 *
 * Scope řízený přes env (předej před `npm run`):
 *   COVERAGE_GRADES=2,3,4                 (default: aktivní scope 2–4)
 *   COVERAGE_SUBJECTS=prvouka,přírodověda (default: všechny předměty)
 *
 * Stejný důvod existence jako run-audit-pedagogical.mjs: cross-env by
 * přidalo dev dependency; tenhle wrapper je bez nové dependence a funguje
 * i ve Windows CMD/PowerShell.
 */

import { spawn } from "node:child_process";

const env = { ...process.env, COVERAGE_REPORT: "1" };

const isWindows = process.platform === "win32";
const child = spawn(
  "npx",
  ["vitest", "run", "src/test/level-coverage-report.test.ts", "--reporter=basic"],
  { stdio: "inherit", env, shell: isWindows },
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
