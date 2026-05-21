import { describe, it, expect } from "vitest";
import { CTENI_ZAPIS_POROVNAVANI } from "../matematika/cteniZapisAPorovnavaniCiselDoMilionu";
import { ZAOKROUHLOVANI } from "../matematika/zaokrouhlovaniNaDesitkyStovkyTisiceDesetitisice";

// ── Čtení, zápis, porovnávání ────────────────────────────────────────
describe("cteniZapisPorovnavani – metadata", () => {
  const meta = CTENI_ZAPIS_POROVNAVANI[0];
  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    expect(meta.topic).toBe("Číselný obor 0–1 000 000");
  });
  it("má helpTemplate", () => {
    expect(meta.helpTemplate.hint.length).toBeGreaterThan(10);
  });
});

describe("cteniZapisPorovnavani – generator", () => {
  const meta = CTENI_ZAPIS_POROVNAVANI[0];
  for (const level of [1, 2, 3] as const) {
    it(`level ${level}: vrátí ≥ 30 úloh s options`, () => {
      const tasks = meta.generator(level);
      expect(tasks.length).toBeGreaterThanOrEqual(30);
      for (const t of tasks) {
        expect(t.correctAnswer).toBeTruthy();
        expect(t.options?.length).toBeGreaterThanOrEqual(2);
        expect(t.options).toContain(t.correctAnswer);
      }
    });
  }
});

// ── Zaokrouhlování ───────────────────────────────────────────────────
describe("zaokrouhlovani – metadata", () => {
  const meta = ZAOKROUHLOVANI[0];
  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    expect(meta.topic).toBe("Číselný obor 0–1 000 000");
  });
  it("má helpTemplate s pravidlem ≥5", () => {
    expect(meta.helpTemplate.hint).toContain("≥ 5");
  });
});

describe("zaokrouhlovani – generator", () => {
  const meta = ZAOKROUHLOVANI[0];

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

      it("correctAnswer je správně zaokrouhlené číslo", () => {
        for (const t of tasks) {
          // Otázka: "Zaokrouhli číslo X na Y."
          const match = t.question.match(/Zaokrouhli číslo (.+?) na (.+?)\./);
          if (!match) continue;
          const n = parseInt(match[1].replace(/\s/g, "").replace(/ /g, ""), 10);
          const label = match[2];
          const toMap: Record<string, number> = {
            desítky: 10, stovky: 100, tisíce: 1000, desetitisíce: 10000,
          };
          const to = toMap[label];
          if (!to) continue;
          const expected = Math.round(n / to) * to;
          const actual = parseInt(t.correctAnswer.replace(/\s/g, "").replace(/ /g, ""), 10);
          expect(actual).toBe(expected);
        }
      });
    });
  }
});
