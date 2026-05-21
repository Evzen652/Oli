import { describe, it, expect } from "vitest";
import { PISEMNE_NASOBENI } from "../matematika/pisemneNasobeniJednoADvoucifernymCinitelem";

const meta = PISEMNE_NASOBENI[0];

describe("pisemneNasobeni – metadata", () => {
  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.rvpNodeId).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    expect(meta.inputType).toBe("select_one");
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

      it("každá úloha má question, correctAnswer a 4 options", () => {
        for (const t of tasks) {
          expect(t.question).toMatch(/×/);
          expect(t.correctAnswer).toBeTruthy();
          expect(t.options?.length).toBe(4);
        }
      });

      it("correctAnswer je vždy v options", () => {
        for (const t of tasks) {
          expect(t.options).toContain(t.correctAnswer);
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
