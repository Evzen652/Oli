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

      // 2026-09-11: generátor má kromě „a/j ± b/j = ?“ i doplněk do celku
      // a slovní úlohy; výsledek se nekrátí (krácení patří až na 2. stupeň).
      it("correctAnswer je matematicky správný", () => {
        let overeno = 0;
        for (const t of tasks) {
          const q = t.question.replace(/\s/g, "");
          const [rn, rd] = t.correctAnswer.split("/").map(Number);
          const vyraz = q.match(/^(\d+)\/(\d+)([+−])(\d+)\/(\d+)=\?$/);
          const doplnek = q.match(/^(\d+)\/(\d+)\+\?=1\./);
          const zlomky = [...t.question.matchAll(/(\d+)\/(\d+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
          if (vyraz) {
            const [, n1, d, op, n2] = vyraz;
            expect(rd).toBe(Number(d));
            expect(rn).toBe(op === "+" ? Number(n1) + Number(n2) : Number(n1) - Number(n2));
          } else if (doplnek) {
            expect(rd).toBe(Number(doplnek[2]));
            expect(rn).toBe(Number(doplnek[2]) - Number(doplnek[1]));
          } else if (/zbyla\?$/.test(t.question)) {
            const [[a, j], [b]] = zlomky;
            expect(rd).toBe(j);
            expect(rn).toBe(j - a - b);
          } else if (/dohromady\?$/.test(t.question)) {
            const [[a, j], [b]] = zlomky;
            expect(rd).toBe(j);
            expect(rn).toBe(a + b);
          } else {
            continue;
          }
          overeno++;
        }
        expect(overeno).toBe(tasks.length);
      });
    });
  }
});
