import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import { runLevelCoverageReport } from "@/lib/contentAudit";

/**
 * Level-coverage worklist — informační audit pokrytí obtížnosti (L1/L2/L3)
 * přes `getTierTasks` (jediný zdroj pravdy). Vypíše, kterým tématům chybí
 * L2 nebo L3 → přímý worklist pro doplnění obtížnosti.
 *
 * Ne-blokující (vždy zelený). Spuštění: `npm run audit:coverage`
 * nebo `COVERAGE_REPORT=1 npx vitest run src/test/level-coverage-report.test.ts`.
 *
 * Scope řízený přes env:
 *   COVERAGE_GRADES=2,3,4   (default: aktivní scope 2–4; viz ACTIVE_GRADES)
 *   COVERAGE_SUBJECTS=prvouka,přírodověda   (default: všechny předměty)
 */

const RUN = process.env.COVERAGE_REPORT === "1";

function parseList(v: string | undefined): string[] | undefined {
  if (!v) return undefined;
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

(RUN ? describe : describe.skip)("Level-coverage worklist", () => {
  it("dump", () => {
    const gradesEnv = parseList(process.env.COVERAGE_GRADES);
    const grades = gradesEnv ? gradesEnv.map(Number) : [2, 3, 4];
    const subjects = parseList(process.env.COVERAGE_SUBJECTS);

    const report = runLevelCoverageReport(getAllTopics(), { grades, subjects });

    console.log("\n=== LEVEL-COVERAGE WORKLIST ===");
    console.log(`Scope: ročníky [${grades.join(", ")}]${subjects ? ` · předměty [${subjects.join(", ")}]` : " · všechny předměty"}`);
    console.log(`Témat: ${report.entries.length} | chybí L2: ${report.missingL2.length} | chybí L3: ${report.missingL3.length}\n`);

    for (const e of report.entries) {
      const flag = e.l2 === 0 || e.l3 === 0 ? "  <== CHYBÍ" : "";
      console.log(
        `  ${e.subject.padEnd(12)} g${e.grade} | ${String(e.l1).padStart(2)}/${String(e.l2).padStart(2)}/${String(e.l3).padStart(2)} | maxL${e.maxLevel}${flag}  ${e.topicId}`,
      );
    }

    expect(report.entries.length).toBeGreaterThanOrEqual(0);
  }, 60_000);
});
