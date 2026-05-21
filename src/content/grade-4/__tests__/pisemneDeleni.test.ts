import { describe, it, expect } from "vitest";
import { PISEMNE_DELENI } from "../matematika/pisemneDeleniJednocifernymDelitelem";

const meta = PISEMNE_DELENI[0];

describe("pisemneDeleni – metadata", () => {
  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.rvpNodeId).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    expect(meta.gradeRange).toEqual([4, 4]);
    expect(meta.inputType).toBe("select_one");
  });

  it("má helpTemplate vyplněný", () => {
    expect(meta.helpTemplate.hint.length).toBeGreaterThan(10);
    expect(meta.helpTemplate.steps.length).toBeGreaterThanOrEqual(4);
    expect(meta.helpTemplate.commonMistake.length).toBeGreaterThan(5);
  });
});

describe("pisemneDeleni – generator", () => {
  for (const level of [1, 2, 3] as const) {
    describe(`level ${level}`, () => {
      const tasks = meta.generator(level);

      it("vrátí ≥ 30 úloh", () => {
        expect(tasks.length).toBeGreaterThanOrEqual(30);
      });

      it("každá úloha má question, correctAnswer a 4 options", () => {
        for (const t of tasks) {
          expect(t.question).toMatch(/÷/);
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
          const [dividendStr, divisorStr] = raw.split("÷");
          const dividend = parseInt(dividendStr, 10);
          const divisor = parseInt(divisorStr, 10);

          const answer = t.correctAnswer;
          if (answer.includes("zb.")) {
            const [qStr, rStr] = answer.split("zb.").map(s => parseInt(s.trim(), 10));
            expect(divisor * qStr + rStr).toBe(dividend);
            expect(rStr).toBeGreaterThanOrEqual(0);
            expect(rStr).toBeLessThan(divisor);
          } else {
            expect(parseInt(answer, 10) * divisor).toBe(dividend);
          }
        }
      });

      it("dělitel je v rozsahu 2–9", () => {
        for (const t of tasks) {
          const raw = t.question.replace(/\s/g, "");
          const divisor = parseInt(raw.split("÷")[1].replace("=?", ""), 10);
          expect(divisor).toBeGreaterThanOrEqual(2);
          expect(divisor).toBeLessThanOrEqual(9);
        }
      });
    });
  }
});
