import { describe, it, expect } from "vitest";
import { ZLOMEK_CAST_CELKU } from "../matematika/zlomekJakoCastCelkuZnazorneniZlomku";
import { SCITANI_ODCITANI_ZLOMKU } from "../matematika/scitaniAOdcitaniZlomkuSeStejnymJmenovatelem";

// ── Zlomek jako část celku ──────────────────────────────────────────
describe("zlomekCastCelku – metadata", () => {
  const meta = ZLOMEK_CAST_CELKU[0];

  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    expect(meta.topic).toBe("Zlomky");
    expect(meta.inputType).toBe("select_one");
  });

  it("má helpTemplate", () => {
    expect(meta.helpTemplate.hint.length).toBeGreaterThan(10);
    expect(meta.helpTemplate.steps.length).toBeGreaterThanOrEqual(3);
  });
});

describe("zlomekCastCelku – generator", () => {
  const meta = ZLOMEK_CAST_CELKU[0];

  for (const level of [1, 2, 3] as const) {
    it(`level ${level}: vrátí ≥ 30 úloh s options`, () => {
      const tasks = meta.generator(level);
      expect(tasks.length).toBeGreaterThanOrEqual(30);
      for (const t of tasks) {
        expect(t.correctAnswer).toBeTruthy();
        expect(t.options?.length).toBeGreaterThanOrEqual(3);
        expect(t.options).toContain(t.correctAnswer);
      }
    });
  }
});

// ── Sčítání a odčítání zlomků ───────────────────────────────────────
describe("scitaniOdcitaniZlomku – metadata", () => {
  const meta = SCITANI_ODCITANI_ZLOMKU[0];

  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    expect(meta.topic).toBe("Zlomky");
  });

  it("má helpTemplate", () => {
    expect(meta.helpTemplate.commonMistake).toContain("jmenovatel");
  });
});

describe("scitaniOdcitaniZlomku – generator", () => {
  const meta = SCITANI_ODCITANI_ZLOMKU[0];

  for (const level of [1, 2, 3] as const) {
    describe(`level ${level}`, () => {
      const tasks = meta.generator(level);

      it("vrátí ≥ 30 úloh", () => {
        expect(tasks.length).toBeGreaterThanOrEqual(30);
      });

      it("correctAnswer je vždy v options", () => {
        for (const t of tasks) {
          expect(t.options).toContain(t.correctAnswer);
        }
      });

      it("correctAnswer je matematicky správný", () => {
        for (const t of tasks) {
          // "num1/den OP num2/den = ?"
          const q = t.question.replace(/\s/g, "");
          const isAdd = q.includes("+");
          const parts = q.replace("=?", "").split(isAdd ? "+" : "−");
          const [n1, d1] = parts[0].split("/").map(Number);
          const [n2] = parts[1].split("/").map(Number);
          const resultNum = isAdd ? n1 + n2 : n1 - n2;

          const answer = t.correctAnswer;
          if (answer === "1") {
            expect(resultNum).toBe(d1);
          } else if (answer === "0") {
            expect(resultNum).toBe(0);
          } else {
            const [rn, rd] = answer.split("/").map(Number);
            // Výsledek může být zjednodušený — ověříme křížovým součinem
            expect(rn * d1).toBe(resultNum * rd);
          }
        }
      });
    });
  }
});
