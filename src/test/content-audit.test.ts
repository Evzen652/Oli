import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import { runOfflineAudit, CATEGORY_LABELS } from "@/lib/contentAudit";

/**
 * AUTOMATICKÝ KONTROLNÍ BĚH OBSAHU (Audit)
 *
 * Spuštění:
 *   npm run audit:content              — všechny offline checky (default)
 *   AUDIT_AI=1 npm run audit:content   — navíc AI pedagogická kontrola
 *
 * Stejnou logiku používá admin UI (AdminContentAudit komponenta).
 */

const allTopics = getAllTopics();

describe("CONTENT AUDIT — offline (vždy běží)", () => {
  it("OFFLINE PŘEHLED: kolik cvičení je technicky OK", () => {
    const report = runOfflineAudit(allTopics);

    console.log("\n═══════════════════════════════════════════");
    console.log("    OFFLINE CONTENT AUDIT REPORT");
    console.log("═══════════════════════════════════════════");
    console.log(`  Topics zkontrolováno:   ${report.totalTopicsChecked} / ${allTopics.length}`);
    console.log(`  Tasků zkontrolováno:    ${report.totalTasksChecked}`);
    console.log(`  ✓ OK:                   ${report.okCount} (${report.passingPct}%)`);
    console.log(`  ✗ Problémů:             ${report.issues.length}`);
    if (report.issues.length > 0) {
      console.log("\n  Rozpis problémů:");
      for (const [cat, count] of Object.entries(report.byCategory)) {
        if (count > 0) {
          console.log(`    • ${CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS].padEnd(28)} ${count}`);
        }
      }
      console.log("\n  Top 10 příkladů:");
      report.issues.slice(0, 10).forEach((i, idx) => {
        console.log(`    ${idx + 1}. [${i.category}] ${i.topicId}`);
        console.log(`       "${i.taskQuestion}"`);
        console.log(`       → ${i.detail}`);
      });
      if (report.issues.length > 10) {
        console.log(`    … a dalších ${report.issues.length - 10}`);
      }
    }
    console.log("═══════════════════════════════════════════\n");

    // Hard fail jen pokud passingPct < 70 % — pod tím je curriculum vážně rozbité
    expect(
      report.passingPct,
      `Pouze ${report.passingPct}% cvičení je technicky OK (cíl ≥70%)`,
    ).toBeGreaterThanOrEqual(70);
  }, 60_000);
});

// ─────────────────────────────────────────────────────────
// AI AUDIT — opt-in (vyžaduje API key + AUDIT_AI=1)
// ─────────────────────────────────────────────────────────

const AI_KEY = process.env.LOVABLE_API_KEY ?? process.env.GROQ_API_KEY;
const AI_AUDIT_ENABLED = process.env.AUDIT_AI === "1" && !!AI_KEY;

describe.skipIf(!AI_AUDIT_ENABLED)("CONTENT AUDIT — AI pedagogická kontrola (opt-in)", () => {
  it("AI audit: dávkou projde sample tasks a reportuje pedagogické problémy", async () => {
    type AiResult = {
      topicId: string;
      taskQuestion: string;
      status: "OK" | "POTŘEBA_ÚPRAV";
      problems: string[];
    };

    const samples: { topicId: string; topicTitle: string; question: string; correctAnswer: string; hints: string[] }[] = [];
    for (const topic of allTopics) {
      const tasks = topic.generator(2);
      if (tasks[0]) {
        samples.push({
          topicId: topic.id,
          topicTitle: topic.title,
          question: tasks[0].question,
          correctAnswer: tasks[0].correctAnswer,
          hints: tasks[0].hints ?? [],
        });
      }
    }

    console.log(`\n[AI AUDIT] Spouštím kontrolu ${samples.length} sample tasks v dávkách po 5…`);

    const results: AiResult[] = [];
    const BATCH_SIZE = 5;
    const isLovable = !!process.env.LOVABLE_API_KEY;
    const apiUrl = isLovable
      ? "https://ai.gateway.lovable.dev/v1/chat/completions"
      : "https://api.groq.com/openai/v1/chat/completions";
    const model = isLovable ? "google/gemini-2.5-flash" : "llama-3.3-70b-versatile";

    for (let i = 0; i < samples.length; i += BATCH_SIZE) {
      const batch = samples.slice(i, i + BATCH_SIZE);
      const exerciseList = batch
        .map(
          (s, idx) => `--- Cvičení ${idx + 1} (topicId: ${s.topicId}) ---
Otázka: ${s.question}
Správná odpověď: ${s.correctAnswer}
Malá nápověda: ${s.hints[0] || "—"}
Velká nápověda: ${s.hints[1] || "—"}`,
        )
        .join("\n\n");

      try {
        const resp = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AI_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "Jsi pedagogický validátor pro českou ZŠ. Kontroluj kvalitu cvičení (logika, přiměřenost ročníku, kvalita nápověd). Vrátíš tool call audit_results.",
              },
              { role: "user", content: exerciseList },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "audit_results",
                  description: "Per-cvičení status + problémy.",
                  parameters: {
                    type: "object",
                    properties: {
                      results: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            exercise_index: { type: "number" },
                            status: { type: "string", enum: ["OK", "POTŘEBA_ÚPRAV"] },
                            problems: { type: "array", items: { type: "string" } },
                          },
                          required: ["exercise_index", "status", "problems"],
                        },
                      },
                    },
                    required: ["results"],
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "audit_results" } },
          }),
        });

        if (!resp.ok) {
          console.warn(`  [AI batch ${i / BATCH_SIZE + 1}] gateway error ${resp.status}, skipping batch`);
          continue;
        }
        const data = await resp.json();
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        if (!toolCall?.function?.arguments) continue;
        const parsed = JSON.parse(toolCall.function.arguments);
        for (const r of parsed.results ?? []) {
          const sample = batch[r.exercise_index - 1];
          if (!sample) continue;
          results.push({
            topicId: sample.topicId,
            taskQuestion: sample.question.slice(0, 60),
            status: r.status === "OK" ? "OK" : "POTŘEBA_ÚPRAV",
            problems: Array.isArray(r.problems) ? r.problems : [],
          });
        }
      } catch (e) {
        console.warn(`  [AI batch ${i / BATCH_SIZE + 1}] error:`, e instanceof Error ? e.message : e);
      }
    }

    const okCount = results.filter((r) => r.status === "OK").length;
    const needFix = results.filter((r) => r.status === "POTŘEBA_ÚPRAV");
    const passingPct = results.length > 0 ? Math.round((okCount / results.length) * 100) : 0;

    console.log("\n═══════════════════════════════════════════");
    console.log("    AI AUDIT REPORT");
    console.log("═══════════════════════════════════════════");
    console.log(`  Sample tasks zkontrolováno: ${results.length}`);
    console.log(`  ✓ OK:                       ${okCount} (${passingPct}%)`);
    console.log(`  ✗ POTŘEBA ÚPRAV:            ${needFix.length}`);
    if (needFix.length > 0) {
      console.log("\n  Příklady problémů (top 15):");
      needFix.slice(0, 15).forEach((r, idx) => {
        console.log(`    ${idx + 1}. ${r.topicId}`);
        console.log(`       "${r.taskQuestion}"`);
        r.problems.forEach((p) => console.log(`       → ${p}`));
      });
      if (needFix.length > 15) {
        console.log(`    … a dalších ${needFix.length - 15}`);
      }
    }
    console.log("═══════════════════════════════════════════\n");

    expect(results.length).toBeGreaterThan(0);
  }, 600_000);
});
