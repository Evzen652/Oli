import { describe, it } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import { runOfflineAudit, runPedagogicalAudit, CATEGORY_LABELS, PEDAGOGICAL_CATEGORY_LABELS } from "@/lib/contentAudit";

const G3_MAT = getAllTopics().filter(
  t => t.gradeRange[0] === 3 && t.gradeRange[1] === 3 && t.subject === "matematika"
);

describe(`Audit grade-3 matematika (${G3_MAT.length} témat)`, () => {
  it("OFFLINE", () => {
    const r = runOfflineAudit(G3_MAT, { maxSamplesPerTopic: 10 });
    console.log(`\n${"═".repeat(50)}`);
    console.log("  OFFLINE — grade-3 matematika");
    console.log(`${"═".repeat(50)}`);
    console.log(`  Témata:  ${r.totalTopicsChecked}`);
    console.log(`  Tasků:   ${r.totalTasksChecked}`);
    console.log(`  ✓ OK:    ${r.okCount} (${r.passingPct}%)`);
    console.log(`  ✗ Chyb:  ${r.issues.length}`);
    if (r.issues.length) {
      for (const [cat, count] of Object.entries(r.byCategory)) {
        if (count > 0) console.log(`    • ${CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS].padEnd(30)} ${count}`);
      }
      console.log("\n  Všechny problémy:");
      r.issues.forEach((i, idx) => {
        console.log(`  ${idx + 1}. [${i.category}] ${i.topicId}`);
        console.log(`     "${i.taskQuestion.slice(0, 70)}"`);
        console.log(`     → ${i.detail}`);
      });
    }
    console.log(`${"═".repeat(50)}\n`);
  }, 60_000);

  it("PEDAGOGICKÝ", () => {
    const r = runPedagogicalAudit(G3_MAT);
    console.log(`\n${"═".repeat(50)}`);
    console.log("  PEDAGOGICKÝ — grade-3 matematika");
    console.log(`${"═".repeat(50)}`);
    console.log(`  Problémy: ${r.issues.length}`);
    if (r.issues.length) {
      for (const [cat, count] of Object.entries(r.byCategory)) {
        if (count > 0) console.log(`    • ${PEDAGOGICAL_CATEGORY_LABELS[cat as keyof typeof PEDAGOGICAL_CATEGORY_LABELS].padEnd(36)} ${count}`);
      }
      console.log("\n  Všechny problémy:");
      r.issues.forEach((i, idx) => {
        console.log(`  ${idx + 1}. [${i.category}] ${i.topicId}`);
        console.log(`     → ${i.detail}`);
      });
    } else {
      console.log("  ✓ Žádné problémy!");
    }
    console.log(`${"═".repeat(50)}\n`);
  }, 60_000);
});
