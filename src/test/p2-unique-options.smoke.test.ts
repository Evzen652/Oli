import { describe, it, expect } from "vitest";
import { GRADE_3_TOPICS } from "@/content/grade-3";
import { GRADE_4_TOPICS } from "@/content/grade-4";

/**
 * Sanity test pro P2 opravu (dedup možností + unikátní vstupy u řazení).
 * Rychlé opakované volání generátoru → ověří, že distraktory nikdy
 * nekolidují se správnou odpovědí ani mezi sebou.
 */
describe("P2 sanity — unikátní options a přítomnost correct", () => {
  const targets = [
    ...GRADE_3_TOPICS.filter((t) => t.id === "g3-mat-cisla-do-1000"),
    ...GRADE_4_TOPICS.filter((t) => t.id === "g4-mat-zlomek-cast-celku-4"),
  ];
  for (const topic of targets) {
    for (const level of [1, 2, 3] as const) {
      it(`${topic.id} L${level}: 4 unikátní možnosti napříč 20 běhy`, () => {
        for (let run = 0; run < 20; run++) {
          const tasks = topic.generator(level);
          for (const t of tasks) {
            if (!t.options) continue;
            const set = new Set(t.options);
            expect(
              set.size,
              `dupe v options: [${t.options.join(", ")}] pro "${t.question}"`,
            ).toBe(t.options.length);
            expect(
              t.options.includes(t.correctAnswer),
              `correct "${t.correctAnswer}" chybí v [${t.options.join(
                ", ",
              )}] u "${t.question}"`,
            ).toBe(true);
          }
        }
      });
    }
  }
});
