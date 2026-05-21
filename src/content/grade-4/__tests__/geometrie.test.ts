import { describe, it, expect } from "vitest";
import { OBVOD_OBSAH } from "../matematika/obvodAObsahObdelnikuACtverce";
import { ROVNOBEZKY_KOLMICE } from "../matematika/rovnobezkyAKolmice";
import { TROJUHELNIK_DRUHY } from "../matematika/trojuhelnikDruhyPodleStran";
import { OSOVA_SOUMERNOST } from "../matematika/osovaSoumernostOsaSoumerneUtvary";

function baseCheck(meta: ReturnType<typeof OBVOD_OBSAH>[0]) {
  expect(meta.id).toBeTruthy();
  expect(meta.subject).toBe("matematika");
  expect(meta.category).toBe("Geometrie v rovině a v prostoru");
  expect(meta.helpTemplate.hint.length).toBeGreaterThan(5);
}

// ── Obvod a obsah ────────────────────────────────────────────────────
describe("obvodObsah – metadata", () => {
  it("má povinná pole", () => baseCheck(OBVOD_OBSAH[0]));
});

describe("obvodObsah – generator", () => {
  const meta = OBVOD_OBSAH[0];
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

// ── Rovnoběžky a kolmice ─────────────────────────────────────────────
describe("rovnobezkyKolmice – metadata", () => {
  it("má povinná pole", () => baseCheck(ROVNOBEZKY_KOLMICE[0]));
});

describe("rovnobezkyKolmice – generator", () => {
  const meta = ROVNOBEZKY_KOLMICE[0];
  for (const level of [1, 2, 3] as const) {
    it(`level ${level}: ≥30 úloh, correctAnswer v options`, () => {
      const tasks = meta.generator(level);
      expect(tasks.length).toBeGreaterThanOrEqual(30);
      for (const t of tasks) {
        expect(t.options).toContain(t.correctAnswer);
      }
    });
  }
});

// ── Trojúhelník ──────────────────────────────────────────────────────
describe("trojuhelnikDruhy – metadata", () => {
  it("má povinná pole", () => baseCheck(TROJUHELNIK_DRUHY[0]));
});

describe("trojuhelnikDruhy – generator", () => {
  const meta = TROJUHELNIK_DRUHY[0];
  for (const level of [1, 2, 3] as const) {
    it(`level ${level}: ≥30 úloh, correctAnswer v options`, () => {
      const tasks = meta.generator(level);
      expect(tasks.length).toBeGreaterThanOrEqual(30);
      for (const t of tasks) {
        expect(t.options).toContain(t.correctAnswer);
      }
    });
  }
});

// ── Osová souměrnost ─────────────────────────────────────────────────
describe("osovaSoumernost – metadata", () => {
  it("má povinná pole", () => baseCheck(OSOVA_SOUMERNOST[0]));
});

describe("osovaSoumernost – generator", () => {
  const meta = OSOVA_SOUMERNOST[0];
  for (const level of [1, 2, 3] as const) {
    it(`level ${level}: ≥30 úloh, correctAnswer v options`, () => {
      const tasks = meta.generator(level);
      expect(tasks.length).toBeGreaterThanOrEqual(30);
      for (const t of tasks) {
        expect(t.options).toContain(t.correctAnswer);
      }
    });
  }
});
