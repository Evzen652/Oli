import { describe, it, expect } from "vitest";
import { PISEMNE_SCITANI_ODCITANI } from "../matematika/pisemneScitaniAOdcitaniVicecifernychCisel";

const meta = PISEMNE_SCITANI_ODCITANI[0];

describe("pisemneScitaniAOdcitani – metadata", () => {
  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.rvpNodeId).toBeTruthy();
    expect(meta.title).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    expect(meta.gradeRange).toEqual([4, 4]);
    // Od 2026-09-30 se výsledek píše, nevybírá — viz src/test/zapis-cisla-matematika.test.ts
    expect(meta.inputType).toBe("number");
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

      it("každá úloha má question a correctAnswer, ale žádné options", () => {
        for (const t of tasks) {
          expect(t.question).toBeTruthy();
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
