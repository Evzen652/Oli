import { describe, it } from "vitest";

/**
 * Běží jen na vyžádání, ať nezatěžuje `npm test` (zapisuje 5.5 MB soubor).
 * Regenerace exportu:  EXPORT_REVIEW=1 npx vitest run src/test/review-export.test.ts
 */
const SHOULD_RUN = process.env.EXPORT_REVIEW === "1";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { getTierTasks } from "@/lib/levelCoverage";
import { GRADE_2_TOPICS } from "@/content/grade-2/index";
import { GRADE_3_TOPICS } from "@/content/grade-3/index";
import { GRADE_4_TOPICS } from "@/content/grade-4/index";
import { GRADE_5_TOPICS } from "@/content/grade-5/index";
import { GRADE_6_TOPICS } from "@/content/grade-6/index";

/**
 * Přehledový export VŠECH úloh z generátorů (2.–4. ročník, bez informatiky).
 * Neupravuje ani nefiltruje obsah — dumpuje přesně to, co generátory vrací
 * (úrovně I/II/III přes rozdílové pravidlo getTierTasks, jako v runtime/adminu).
 *
 * Spusť:  npx vitest run src/test/review-export.test.ts
 * Výstup: review-export.md v kořeni repa.
 */

const GRADES: { grade: number; topics: TopicMetadata[] }[] = [
  { grade: 2, topics: GRADE_2_TOPICS },
  { grade: 3, topics: GRADE_3_TOPICS },
  { grade: 4, topics: GRADE_4_TOPICS },
  { grade: 5, topics: GRADE_5_TOPICS },
  { grade: 6, topics: GRADE_6_TOPICS },
];

// Předměty seřazené pro výstup (raw hodnoty subject, s diakritikou)
const SUBJECT_ORDER = [
  "matematika",
  "čeština",
  "prvouka",
  "přírodověda",
  "vlastivěda",
  "dějepis",
  "fyzika",
  "chemie",
  "přírodopis",
  "zeměpis",
];

function subjectLabel(s: string): string {
  const map: Record<string, string> = {
    matematika: "Matematika",
    "čeština": "Čeština",
    prvouka: "Prvouka",
    "přírodověda": "Přírodověda",
    "vlastivěda": "Vlastivěda",
    "dějepis": "Dějepis",
    fyzika: "Fyzika",
    chemie: "Chemie",
    "přírodopis": "Přírodopis",
    "zeměpis": "Zeměpis",
  };
  return map[s] ?? s;
}

function esc(v: unknown): string {
  if (v === undefined || v === null) return "";
  return String(v).replace(/\r?\n/g, " ").trim();
}

/** Vyrenderuje jeden PracticeTask jako markdown blok. */
function renderTask(
  task: PracticeTask,
  topic: TopicMetadata,
  grade: number,
  level: 1 | 2 | 3,
  idx: number
): string {
  const lines: string[] = [];
  lines.push(`#### Úloha ${idx} — ${esc(topic.id)} · úroveň ${level}`);
  lines.push("");
  lines.push(`- **ID:** \`${esc(topic.id)}\``);
  lines.push(
    `- **Předmět / třída / téma / úroveň:** ${subjectLabel(topic.subject)} / ${grade}. třída / ${esc(
      topic.topic
    )} / **${level}**`
  );
  lines.push(`- **Typ odpovědi:** \`${esc(topic.inputType)}\``);
  if (task.emoji) lines.push(`- **Emoji:** ${task.emoji}`);
  lines.push(`- **Otázka:** ${esc(task.question)}`);

  // Možnosti (select_one / true_false)
  if (task.options && task.options.length) {
    lines.push(`- **Možnosti:**`);
    for (const opt of task.options) {
      const correct = opt === task.correctAnswer ? " ✅ **(správně)**" : "";
      lines.push(`    - ${esc(opt)}${correct}`);
    }
  }

  // multi_select
  if (task.correctAnswers && task.correctAnswers.length) {
    lines.push(`- **Správné odpovědi (multi):** ${task.correctAnswers.map(esc).join(" | ")}`);
  }

  // fill_blank
  if (task.blanks && task.blanks.length) {
    lines.push(`- **Doplňovačka (blanks):** ${task.blanks.map(esc).join(" | ")}`);
  }

  // match_pairs
  if (task.pairs && task.pairs.length) {
    lines.push(`- **Páry:**`);
    for (const p of task.pairs) lines.push(`    - ${esc(p.left)} ↔ ${esc(p.right)}`);
  }

  // categorize
  if (task.categories && task.categories.length) {
    lines.push(`- **Kategorie:**`);
    for (const c of task.categories) lines.push(`    - ${esc(c.name)}: ${c.items.map(esc).join(", ")}`);
  }

  // drag_order
  if (task.items && task.items.length) {
    lines.push(`- **Správné pořadí:** ${task.items.map(esc).join(" → ")}`);
  }

  // timeline / formula
  if (task.timelineEvents && task.timelineEvents.length) {
    lines.push(`- **Události (timeline):** ${task.timelineEvents.map((e) => esc(e.label)).join(" | ")}`);
  }
  if (task.formulaPool && task.formulaPool.length) {
    lines.push(`- **Díly vzorce:** ${task.formulaPool.map((f) => esc(f.token)).join(" | ")}`);
  }

  // Správná odpověď (hlavní)
  lines.push(`- **Správná odpověď:** ${esc(task.correctAnswer)}`);

  // short_answer — poznámka o akceptovaných variantách
  if (topic.inputType === "short_answer") {
    lines.push(
      `- **Akceptované varianty (short_answer):** řídí validátor při kontrole (normalizace: velikost písmen, mezery, desetinná čárka/tečka \`0,5\`≈\`0.5\`, diakritika). V datech úlohy uložena jen kanonická odpověď výše.`
    );
  }

  // Nápověda — z úlohy i z helpTemplate
  if (task.hints && task.hints.length) {
    lines.push(`- **Nápověda (úloha):** ${task.hints.map(esc).join(" · ")}`);
  }
  if (topic.helpTemplate?.hint) {
    lines.push(`- **Nápověda (šablona tématu):** ${esc(topic.helpTemplate.hint)}`);
  }

  // Feedback / self-check
  if (task.solutionSteps && task.solutionSteps.length) {
    lines.push(`- **Postup řešení:** ${task.solutionSteps.map(esc).join(" → ")}`);
  }
  if (task.explanation) {
    lines.push(`- **Vysvětlení:** ${esc(task.explanation)}`);
  }
  if (task.optionFeedback && Object.keys(task.optionFeedback).length) {
    lines.push(`- **Feedback k možnostem:**`);
    for (const [opt, fb] of Object.entries(task.optionFeedback)) {
      lines.push(`    - ${esc(opt)} → ${esc(fb)}`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

(SHOULD_RUN ? describe : describe.skip)("review-export", () => {
  it("vygeneruje review-export.md se všemi úlohami 2.–4. ročník (bez informatiky)", () => {
    const out: string[] = [];
    out.push("# Přehledový export úloh z generátorů");
    out.push("");
    out.push("Rozsah: **2.–6. ročník, bez informatiky.**");
    out.push(
      "Úrovně I/II/III jsou odvozené rozdílovým pravidlem (`getTierTasks`) — stejně jako v runtime a adminu."
    );
    out.push("Obsah je dumpnut 1:1 z generátorů, bez úprav.");
    out.push("");

    let totalTasks = 0;
    let totalTopics = 0;

    // Seskupení: předmět → třída → téma → úroveň
    // Nejprve posbírej všechny (subject) napříč ročníky
    const subjects = new Set<string>();
    for (const { topics } of GRADES) {
      for (const t of topics) {
        if (t.subject === "informatika") continue;
        subjects.add(t.subject);
      }
    }
    const orderedSubjects = [...subjects].sort(
      (a, b) => (SUBJECT_ORDER.indexOf(a) + 1 || 99) - (SUBJECT_ORDER.indexOf(b) + 1 || 99)
    );

    for (const subject of orderedSubjects) {
      out.push(`\n---\n\n## ${subjectLabel(subject)}\n`);

      for (const { grade, topics } of GRADES) {
        const subjTopics = topics.filter((t) => t.subject === subject);
        if (!subjTopics.length) continue;
        out.push(`\n### ${grade}. třída\n`);

        for (const topic of subjTopics) {
          totalTopics++;
          const tiers = getTierTasks(topic);
          const levelSets: { level: 1 | 2 | 3; tasks: PracticeTask[] }[] = [
            { level: 1, tasks: tiers.l1 },
            { level: 2, tasks: tiers.l2 },
            { level: 3, tasks: tiers.l3 },
          ];
          const topicTotal = tiers.l1.length + tiers.l2.length + tiers.l3.length;
          out.push(
            `\n#### 📘 ${esc(topic.title)} — \`${esc(topic.id)}\`  \n` +
              `*Zadání pro žáka: ${esc(topic.briefDescription)}* · celkem ${topicTotal} úloh ` +
              `(L1: ${tiers.l1.length}, L2: ${tiers.l2.length}, L3: ${tiers.l3.length})\n`
          );

          for (const { level, tasks } of levelSets) {
            if (!tasks.length) continue;
            out.push(`\n##### Úroveň ${level} (${tasks.length} úloh)\n`);
            tasks.forEach((task, i) => {
              totalTasks++;
              out.push(renderTask(task, topic, grade, level, i + 1));
            });
          }
        }
      }
    }

    const header = [
      `> Vygenerováno automaticky. Témat: ${totalTopics}, úloh celkem: ${totalTasks}.`,
      "",
    ];
    const final = [out[0], out[1], ...header, ...out.slice(2)].join("\n");

    const target = resolve(__dirname, "../../review-export.md");
    writeFileSync(target, final, "utf-8");
    // eslint-disable-next-line no-console
    console.log(`\n✅ review-export.md zapsán: ${totalTopics} témat, ${totalTasks} úloh → ${target}`);
  });
});
