import { describe, it, expect } from "vitest";
import { PISEMNE_NASOBENI } from "../matematika/pisemneNasobeniJednoADvoucifernymCinitelem";

const meta = PISEMNE_NASOBENI[0];

describe("pisemneNasobeni – metadata", () => {
  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.rvpNodeId).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    // Od 2026-09-30 se výsledek píše, nevybírá — viz src/test/zapis-cisla-matematika.test.ts
    expect(meta.inputType).toBe("number");
  });

  it("má helpTemplate vyplněný", () => {
    expect(meta.helpTemplate.hint.length).toBeGreaterThan(10);
    expect(meta.helpTemplate.steps.length).toBeGreaterThanOrEqual(3);
    expect(meta.helpTemplate.commonMistake.length).toBeGreaterThan(5);
  });
});

describe("pisemneNasobeni – generator", () => {
  for (const level of [1, 2, 3] as const) {
    describe(`level ${level}`, () => {
      const tasks = meta.generator(level);

      it("vrátí ≥ 30 úloh", () => {
        expect(tasks.length).toBeGreaterThanOrEqual(30);
      });

      it("každá úloha má question a correctAnswer, ale žádné options", () => {
        for (const t of tasks) {
          expect(t.question).toMatch(/×/);
          expect(t.correctAnswer).toBeTruthy();
          // Výsledek se píše. `options` musí CHYBĚT, ne být prázdné pole —
          // router dává přednost tvaru úlohy před `topic.inputType`.
          expect(t.options, t.question).toBeUndefined();
        }
      });

      it("typické chyby zůstaly popsané (diagnostika napsané odpovědi)", () => {
        for (const t of tasks) {
          expect(Object.keys(t.optionFeedback ?? {}).length, t.question).toBeGreaterThanOrEqual(3);
        }
      });

      it("correctAnswer je matematicky správný", () => {
        for (const t of tasks) {
          const raw = t.question.replace(/\s/g, "").replace("=?", "");
          const parts = raw.split("×");
          const a = parseInt(parts[0], 10);
          const b = parseInt(parts[1], 10);
          expect(parseInt(t.correctAnswer, 10)).toBe(a * b);
        }
      });

      it(`level ${level}: druhý činitel je ve správném rozsahu`, () => {
        for (const t of tasks) {
          const raw = t.question.replace(/\s/g, "").replace("=?", "");
          const b = parseInt(raw.split("×")[1], 10);
          if (level <= 2) {
            expect(b).toBeGreaterThanOrEqual(2);
            expect(b).toBeLessThanOrEqual(9);
          } else {
            expect(b).toBeGreaterThanOrEqual(11);
            expect(b).toBeLessThanOrEqual(99);
          }
        }
      });
    });
  }
});
