import { describe, it, expect } from "vitest";
import { ARITMETICKY_PRUMER } from "../matematika/aritmetickyPrumerUvod";
import { TABULKY_DIAGRAMY } from "../matematika/tabulkyDiagramySloupcovyKruhovy";
import { MAGICKE_CTVERCE_RADY } from "../matematika/magickeCtverceCiselneRady";

// ── Aritmetický průměr ───────────────────────────────────────────────
describe("aritmetickyPrumer – metadata", () => {
  const meta = ARITMETICKY_PRUMER[0];
  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    expect(meta.helpTemplate.steps.length).toBeGreaterThanOrEqual(3);
  });
});

describe("aritmetickyPrumer – generator", () => {
  const meta = ARITMETICKY_PRUMER[0];
  for (const level of [1, 2] as const) {
    it(`level ${level}: výsledek je opravdu průměr zadaných čísel`, () => {
      const tasks = meta.generator(level);
      expect(tasks.length).toBeGreaterThanOrEqual(30);
      for (const t of tasks) {
        expect(t.options).toContain(t.correctAnswer);
        // Ověř matematiku: otázka obsahuje "průměr čísel: X, Y, Z"
        const match = t.question.match(/průměr čísel: (.+?)\?/);
        if (!match) continue;
        const nums = match[1].split(",").map(s => parseInt(s.trim(), 10));
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        expect(parseInt(t.correctAnswer, 10)).toBe(avg);
      }
    });
  }
});

// ── Tabulky a diagramy ───────────────────────────────────────────────
describe("tabulkyDiagramy – metadata", () => {
  const meta = TABULKY_DIAGRAMY[0];
  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.subject).toBe("matematika");
  });
});

describe("tabulkyDiagramy – generator", () => {
  const meta = TABULKY_DIAGRAMY[0];
  for (const level of [1, 2, 3] as const) {
    it(`level ${level}: ≥30 úloh, correctAnswer v options`, () => {
      const tasks = meta.generator(level);
      expect(tasks.length).toBeGreaterThanOrEqual(30);
      for (const t of tasks) {
        expect(t.correctAnswer).toBeTruthy();
        expect(t.options).toContain(t.correctAnswer);
      }
    });
  }
});

// ── Magické čtverce a číselné řady ──────────────────────────────────
describe("magickeCtverce – metadata", () => {
  const meta = MAGICKE_CTVERCE_RADY[0];
  it("má povinná pole", () => {
    expect(meta.id).toBeTruthy();
    expect(meta.subject).toBe("matematika");
    expect(meta.helpTemplate.hint.toLowerCase()).toContain("magický");
  });
});

describe("magickeCtverce – generator", () => {
  const meta = MAGICKE_CTVERCE_RADY[0];
  for (const level of [1, 2, 3] as const) {
    it(`level ${level}: ≥30 úloh, correctAnswer v options`, () => {
      const tasks = meta.generator(level);
      expect(tasks.length).toBeGreaterThanOrEqual(30);
      for (const t of tasks) {
        expect(t.correctAnswer).toBeTruthy();
        expect(t.options).toContain(t.correctAnswer);
      }
    });
  }
});
