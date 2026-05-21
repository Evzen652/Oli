import { describe, it, expect } from "vitest";
import { PISEMNE_SCITANI_ODCITANI } from "../matematika/pisemneScitaniAOdcitaniVicecifernychCisel";

const meta = PISEMNE_SCITANI_ODCITANI[0];

describe("pisemneScitaniAOdcitani – metadata", () => {
  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.rvpNodeId).toBeTruthy();
    expect(meta.title).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    expect(meta.gradeRange).toEqual([4, 5]);
    expect(meta.inputType).toBe("select_one");
  });

  it("má helpTemplate vyplněný", () => {
    expect(meta.helpTemplate.hint.length).toBeGreaterThan(10);
    expect(meta.helpTemplate.steps.length).toBeGreaterThanOrEqual(3);
    expect(meta.helpTemplate.commonMistake.length).toBeGreaterThan(5);
    expect(meta.helpTemplate.example.length).toBeGreaterThan(5);
  });
});

describe("pisemneScitaniAOdcitani – generator", () => {
  for (const level of [1, 2, 3] as const) {
    describe(`level ${level}`, () => {
      const tasks = meta.generator(level);

      it("vrátí ≥ 30 úloh", () => {
        expect(tasks.length).toBeGreaterThanOrEqual(30);
      });

      it("každá úloha má question, correctAnswer a 4 options", () => {
        for (const t of tasks) {
          expect(t.question).toBeTruthy();
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
          // otázka: "1 234 + 567 = ?" nebo "1 234 − 567 = ?"
          const raw = t.question.replace(/\s/g, "").replace("=?", "");
          const isAdd = raw.includes("+");
          const parts = raw.split(isAdd ? "+" : "−");
          const a = parseInt(parts[0].replace(/ /g, ""), 10);
          const b = parseInt(parts[1].replace(/ /g, ""), 10);
          const expected = isAdd ? a + b : a - b;
          expect(parseInt(t.correctAnswer, 10)).toBe(expected);
        }
      });

      it(`čísla jsou v rozsahu pro level ${level}`, () => {
        const maxResult = level === 1 ? 9999 : level === 2 ? 99999 : 999999;
        for (const t of tasks) {
          expect(parseInt(t.correctAnswer, 10)).toBeGreaterThan(0);
          expect(parseInt(t.correctAnswer, 10)).toBeLessThanOrEqual(maxResult);
        }
      });
    });
  }
});
