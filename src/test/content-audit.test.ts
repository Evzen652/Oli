import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import { validateTaskForInputType } from "@/lib/taskValidator";
import { validateAnswer } from "@/lib/validators";
import { checkBoundaryViolation } from "@/lib/boundaryEnforcement";
import { checkHintLeakage } from "../../supabase/functions/_shared/hintLeakage";
import type { TopicMetadata, PracticeTask } from "@/lib/types";

/**
 * AUTOMATICKÝ KONTROLNÍ BĚH OBSAHU (Audit)
 *
 * Spuštění:
 *   npm run audit:content              — všechny offline checky (default)
 *   AUDIT_AI=1 npm run audit:content   — navíc AI pedagogická kontrola
 *
 * Testuje:
 *   1) Offline (vždy):
 *      a) Generator nezhavaruje pro level 1, 2, 3
 *      b) Každý task má neprázdné question + correctAnswer
 *      c) validateTaskForInputType projde
 *      d) Hint NEPROZRAZUJE odpověď (hintLeakage check)
 *      e) Pro topics s BOUNDARY_RULES: žádný task nepřekročí hranice
 *      f) Self-validation: task.correctAnswer projde svým validátorem
 *
 *   2) AI (opt-in):
 *      a) Sample tasks → pošle dávkou do AI gateway
 *      b) AI vrátí per-cvičení status (OK / POTŘEBA_ÚPRAV)
 *      c) Console report počty + příklady problémů
 */

interface AuditIssue {
  topicId: string;
  taskQuestion: string;
  category: string; // "format" | "self_validation" | "hint_leak" | "boundary"
  detail: string;
}

const allTopics = getAllTopics();

// ─────────────────────────────────────────────────────────
// OFFLINE AUDIT — vždy běží, deterministický
// ─────────────────────────────────────────────────────────

describe("CONTENT AUDIT — offline (vždy běží)", () => {
  it("OFFLINE PŘEHLED: kolik cvičení je technicky OK", () => {
    const issues: AuditIssue[] = [];
    let totalTasksChecked = 0;
    let totalTopicsChecked = 0;

    for (const topic of allTopics) {
      // a) Generator nezhavaruje — projdeme všechny 3 úrovně
      let allTasks: PracticeTask[] = [];
      try {
        for (const lvl of [1, 2, 3] as const) {
          const tasks = topic.generator(lvl);
          allTasks.push(...tasks);
        }
      } catch (e) {
        issues.push({
          topicId: topic.id,
          taskQuestion: "(generator crashed)",
          category: "format",
          detail: e instanceof Error ? e.message : "Unknown error",
        });
        continue;
      }
      totalTopicsChecked++;

      // Sample max 5 tasks per topic — víc by audit zpomalilo
      const sampled = allTasks.slice(0, 5);

      for (const task of sampled) {
        totalTasksChecked++;

        // b) Neprázdné question + correctAnswer
        if (!task.question?.trim()) {
          issues.push({
            topicId: topic.id,
            taskQuestion: task.question || "(empty)",
            category: "format",
            detail: "Prázdné question",
          });
          continue;
        }
        if (task.correctAnswer === undefined || task.correctAnswer === null) {
          issues.push({
            topicId: topic.id,
            taskQuestion: task.question.slice(0, 50),
            category: "format",
            detail: "Chybí correctAnswer",
          });
          continue;
        }

        // c) Format check pro inputType
        if (!validateTaskForInputType(task, topic.inputType)) {
          issues.push({
            topicId: topic.id,
            taskQuestion: task.question.slice(0, 50),
            category: "format",
            detail: `Nesedí formát pro inputType=${topic.inputType}`,
          });
        }

        // d) Hint leak check (skip pro essay — tam jiný typ "answer")
        if (topic.inputType !== "essay" && task.hints && task.hints.length > 0) {
          const leak = checkHintLeakage({
            question: task.question,
            correct_answer: task.correctAnswer,
            hints: task.hints,
          });
          if (!leak.ok) {
            issues.push({
              topicId: topic.id,
              taskQuestion: task.question.slice(0, 50),
              category: "hint_leak",
              detail: leak.reason ?? "Hint leak",
            });
          }
        }

        // e) Boundary check — pokud má topic boundary rules
        if (checkBoundaryViolation(task.correctAnswer, topic)) {
          issues.push({
            topicId: topic.id,
            taskQuestion: task.question.slice(0, 50),
            category: "boundary",
            detail: `correctAnswer "${task.correctAnswer}" porušuje topic boundary`,
          });
        }

        // f) Self-validation: task.correctAnswer projde svým validátorem
        // Pro essay: correctAnswer je threshold, score = same → musí projít
        // Pro ostatní: answer = expected → musí být correct
        if (topic.inputType !== "essay") {
          const result = validateAnswer(task.correctAnswer, task.correctAnswer, {
            inputType: topic.inputType,
          });
          if (!result.correct) {
            issues.push({
              topicId: topic.id,
              taskQuestion: task.question.slice(0, 50),
              category: "self_validation",
              detail: `correctAnswer "${task.correctAnswer}" neprojde svým validátorem (${result.errorType})`,
            });
          }
        }
      }
    }

    // ─── REPORT ───
    const okCount = totalTasksChecked - issues.length;
    const passingPct = totalTasksChecked > 0
      ? Math.round((okCount / totalTasksChecked) * 100)
      : 0;

    const groupedByCategory = issues.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("\n═══════════════════════════════════════════");
    console.log("    OFFLINE CONTENT AUDIT REPORT");
    console.log("═══════════════════════════════════════════");
    console.log(`  Topics zkontrolováno:   ${totalTopicsChecked} / ${allTopics.length}`);
    console.log(`  Tasků zkontrolováno:    ${totalTasksChecked}`);
    console.log(`  ✓ OK:                   ${okCount} (${passingPct}%)`);
    console.log(`  ✗ Problémů:             ${issues.length}`);
    if (issues.length > 0) {
      console.log("\n  Rozpis problémů:");
      for (const [cat, count] of Object.entries(groupedByCategory)) {
        console.log(`    • ${cat.padEnd(20)} ${count}`);
      }
      console.log("\n  Top 10 příkladů:");
      issues.slice(0, 10).forEach((i, idx) => {
        console.log(`    ${idx + 1}. [${i.category}] ${i.topicId}`);
        console.log(`       "${i.taskQuestion}"`);
        console.log(`       → ${i.detail}`);
      });
      if (issues.length > 10) {
        console.log(`    … a dalších ${issues.length - 10}`);
      }
    }
    console.log("═══════════════════════════════════════════\n");

    // Hard fail jen pokud passingPct < 70 % — pod tím je curriculum vážně rozbité
    expect(passingPct, `Pouze ${passingPct}% cvičení je technicky OK (cíl ≥70%)`).toBeGreaterThanOrEqual(70);
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

    const samples: { topic: TopicMetadata; task: PracticeTask }[] = [];
    for (const topic of allTopics) {
      // Max 1 sample per topic, abychom neutráceli kvótu
      const tasks = topic.generator(2);
      if (tasks[0]) samples.push({ topic, task: tasks[0] });
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
      const exerciseList = batch.map((s, idx) => {
        return `--- Cvičení ${idx + 1} (topicId: ${s.topic.id}) ---
Otázka: ${s.task.question}
Správná odpověď: ${s.task.correctAnswer}
Malá nápověda: ${s.task.hints?.[0] || "—"}
Velká nápověda: ${s.task.hints?.[1] || "—"}`;
      }).join("\n\n");

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
            tools: [{
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
            }],
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
            topicId: sample.topic.id,
            taskQuestion: sample.task.question.slice(0, 60),
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
    const passingPct = results.length > 0
      ? Math.round((okCount / results.length) * 100)
      : 0;

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

    // Soft-fail: jen warn, neshazujeme audit (AI může být nestabilní/flaky)
    // Pokud chceš hard fail, přidej: expect(passingPct).toBeGreaterThanOrEqual(70);
    expect(results.length).toBeGreaterThan(0);
  }, 600_000);
});
