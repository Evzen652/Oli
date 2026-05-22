#!/usr/bin/env node
/**
 * Cross-platform wrapper pro `npm run audit:pedagogical`.
 *
 * Důvod existence:
 * - V Linux/macOS/Git Bash funguje `AUDIT_PEDAGOGICAL=1 vitest ...`,
 *   ale ne v Windows CMD/PowerShell.
 * - cross-env by přidalo dev dependency. Tenhle skript je 10 řádků
 *   bez nové dependence.
 *
 * Co dělá:
 * - Nastaví process.env.AUDIT_PEDAGOGICAL = "1"
 * - Spustí `vitest run src/test/content-audit.test.ts --reporter=verbose`
 * - Propaguje exit code
 */

import { spawn } from "node:child_process";

const env = { ...process.env, AUDIT_PEDAGOGICAL: "1" };

// Na Windows `npx` je `.cmd`, který vyžaduje shell: true při spawn().
const isWindows = process.platform === "win32";
const child = spawn(
  "npx",
  ["vitest", "run", "src/test/content-audit.test.ts", "--reporter=verbose"],
  { stdio: "inherit", env, shell: isWindows },
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
