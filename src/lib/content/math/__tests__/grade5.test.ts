import { describe, it, expect } from "vitest";
import { NUMBERS_MILLION_TOPICS } from "../numbersMillion";
import { DECIMAL_READ_TOPICS } from "../decimalRead";
import { FRAC_SAME_DEN_TOPICS } from "../fracSameDen";
import { DIVIDE_ONE_DIGIT_TOPICS } from "../divideOneDigit";
import { AREA_GRID_TOPICS } from "../areaGrid";
import { NEGATIVE_INTRO_TOPICS } from "../negativeIntro";
import { WORD_PROBLEMS_5_TOPICS } from "../wordProblems5";

/**
 * Unit testy pro všech 7 generátorů 5. ročníku matematiky.
 * Ověřují matematickou správnost a metadata.
 */

const parseNumCs = (s: string): number => Number(s.replace(/\s/g, "").replace(",", "."));

// ══════════════════════════════════════════════════════════════════════════
// 1. Čísla do milionu — porovnávání
// ══════════════════════════════════════════════════════════════════════════
describe("numbersMillion — porovnávání do 1M", () => {
  const [t] = NUMBERS_MILLION_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: správné znaménko porovnání`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const m = task.question.match(/Porovnej:\s*([\d\s]+)\s*○\s*([\d\s]+)/);
        expect(m, `unparseable: ${task.question}`).not.toBeNull();
        if (!m) continue;
        const a = parseNumCs(m[1]);
        const b = parseNumCs(m[2]);
        const expected = a < b ? "<" : a > b ? ">" : "=";
        expect(task.correctAnswer, `${task.question}`).toBe(expected);
        expect(task.options).toEqual(["<", "=", ">"]);
      }
    });
  }
  it("metadata", () => {
    expect(t.gradeRange).toEqual([5, 6]);
    expect(t.inputType).toBe("comparison");
    expect(t.rvpReference).toBe("M-5-1-01");
  });
});

// ══════════════════════════════════════════════════════════════════════════
// 2. Desetinná čísla — čtení
// ══════════════════════════════════════════════════════════════════════════
describe("decimalRead — čtení desetinných", () => {
  const [t] = DECIMAL_READ_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: options obsahují correctAnswer, je to desetinné s čárkou`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        expect(task.options).toContain(task.correctAnswer);
        // Pro úlohy word→digits by correctAnswer měl být desetinné s "," nebo celé
        if (task.question.includes("Jak zapíšeš")) {
          expect(task.correctAnswer).toMatch(/^\d+(,\d+)?$/);
        }
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 3. Zlomky se stejným jmenovatelem
// ══════════════════════════════════════════════════════════════════════════
describe("fracSameDen — +/−/porovnávání zlomků", () => {
  const [t] = FRAC_SAME_DEN_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: správné výsledky +, −, porovnání`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        // Sčítání: "3/8 + 2/8 ="
        const add = task.question.match(/^(\d+)\/(\d+)\s+\+\s+(\d+)\/(\d+)\s*=/);
        if (add) {
          const n1 = +add[1], d = +add[2], n2 = +add[3], d2 = +add[4];
          expect(d).toBe(d2); // SAME denominator INVARIANT
          expect(task.correctAnswer).toBe(`${n1 + n2}/${d}`);
          continue;
        }
        const sub = task.question.match(/^(\d+)\/(\d+)\s+−\s+(\d+)\/(\d+)\s*=/);
        if (sub) {
          const n1 = +sub[1], d = +sub[2], n2 = +sub[3], d2 = +sub[4];
          expect(d).toBe(d2);
          expect(task.correctAnswer).toBe(`${n1 - n2}/${d}`);
          continue;
        }
        const cmp = task.question.match(/Porovnej:\s*(\d+)\/(\d+)\s*○\s*(\d+)\/(\d+)/);
        if (cmp) {
          const n1 = +cmp[1], d = +cmp[2], n2 = +cmp[3], d2 = +cmp[4];
          expect(d).toBe(d2);
          const expected = n1 < n2 ? "<" : n1 > n2 ? ">" : "=";
          expect(task.correctAnswer).toBe(expected);
          continue;
        }
        throw new Error(`Unparseable: ${task.question}`);
      }
    });
  }
  it("metadata — prerekvizit math-frac-intro-4", () => {
    expect(t.prerequisites).toContain("math-frac-intro-4");
    expect(t.inputType).toBe("fraction");
  });
});

// ══════════════════════════════════════════════════════════════════════════
// 4. Písemné dělení jednomístným dělitelem
// ══════════════════════════════════════════════════════════════════════════
describe("divideOneDigit — písemné dělení", () => {
  const [t] = DIVIDE_ONE_DIGIT_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: kvocient × dělitel = dělenec (bez zbytku)`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const m = task.question.match(/^([\d\s]+)\s*÷\s*(\d+)\s*=/);
        expect(m).not.toBeNull();
        if (!m) continue;
        const dividend = parseNumCs(m[1]);
        const divisor = parseInt(m[2], 10);
        const quotient = parseNumCs(task.correctAnswer);
        // INVARIANT: bez zbytku
        expect(divisor * quotient, `${task.question}`).toBe(dividend);
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 5. Obsah přes čtvercovou síť
// ══════════════════════════════════════════════════════════════════════════
describe("areaGrid — obsah čtvercovou sítí", () => {
  const [t] = AREA_GRID_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: obsah obdélníku = cols × rows`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        // Úloha o jednom obdélníku
        const m = task.question.match(/:\s*(\d+)\s+\S+\s+×\s+(\d+)/);
        if (m) {
          const c = +m[1], r = +m[2];
          expect(parseInt(task.correctAnswer, 10)).toBe(c * r);
        }
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 6. Záporná čísla — porovnávání
// ══════════════════════════════════════════════════════════════════════════
describe("negativeIntro — záporná čísla, porovnání", () => {
  const [t] = NEGATIVE_INTRO_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: správné porovnání se znaménky`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const m = task.question.match(/Porovnej:\s*(-?\d+|\(-\d+\))\s*○\s*(-?\d+|\(-\d+\))/);
        expect(m).not.toBeNull();
        if (!m) continue;
        const parseSigned = (s: string) => parseInt(s.replace(/[()]/g, ""), 10);
        const a = parseSigned(m[1]);
        const b = parseSigned(m[2]);
        const expected = a < b ? "<" : a > b ? ">" : "=";
        expect(task.correctAnswer, `${task.question}`).toBe(expected);
      }
    });
  }
  it("obsahuje záporná čísla", () => {
    const tasks = t.generator(2);
    const hasNegative = tasks.some((task) => task.question.includes("(-"));
    expect(hasNegative).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// 7. Slovní úlohy
// ══════════════════════════════════════════════════════════════════════════
describe("wordProblems5 — slovní úlohy", () => {
  const [t] = WORD_PROBLEMS_5_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: odpověď je celé kladné číslo + options`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const answer = parseInt(task.correctAnswer, 10);
        expect(Number.isInteger(answer)).toBe(true);
        expect(answer).toBeGreaterThan(0);
        expect(task.options).toContain(task.correctAnswer);
        expect(task.solutionSteps?.length ?? 0).toBeGreaterThan(1);
      }
    });
  }
  it("pokrývá 3 kategorie (cena, čas, množství)", () => {
    // Generujeme velkou várku a ověříme, že se objevují různé typy
    const tasks = t.generator(3);
    const hasPrice = tasks.some((task) => /Kč|stoj|zaplatil|sleva/i.test(task.question));
    const hasTime = tasks.some((task) => /hodin|minut|km\/h|rychlost/i.test(task.question));
    const hasQty = tasks.some((task) => /rozdělit|skupin|dětí|korálk/i.test(task.question));
    expect(hasPrice, "chybí úlohy o ceně").toBe(true);
    expect(hasTime, "chybí úlohy o čase").toBe(true);
    expect(hasQty, "chybí úlohy o množství").toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Společné kontroly
// ══════════════════════════════════════════════════════════════════════════
describe("Grade 5 — společné", () => {
  const allTopics = [
    ...NUMBERS_MILLION_TOPICS,
    ...DECIMAL_READ_TOPICS,
    ...FRAC_SAME_DEN_TOPICS,
    ...DIVIDE_ONE_DIGIT_TOPICS,
    ...AREA_GRID_TOPICS,
    ...NEGATIVE_INTRO_TOPICS,
    ...WORD_PROBLEMS_5_TOPICS,
  ];
  it("všech 7 topiců má gradeRange začínající 5", () => {
    for (const t of allTopics) {
      expect(t.gradeRange[0], `${t.id}`).toBe(5);
    }
  });
  it("všechny mají prerekvizity + RVP + helpTemplate + visualExamples", () => {
    for (const t of allTopics) {
      expect(t.prerequisites?.length ?? 0, `${t.id}`).toBeGreaterThan(0);
      expect(t.rvpReference, `${t.id}`).toMatch(/^M-5-/);
      expect(t.helpTemplate.visualExamples?.length ?? 0, `${t.id}`).toBeGreaterThan(0);
    }
  });
  it("alespoň 3 různé input typy (rozmanitost)", () => {
    const types = new Set(allTopics.map((t) => t.inputType));
    expect(types.size).toBeGreaterThanOrEqual(3);
  });
  it("kategorie začínají velkým písmenem", () => {
    for (const t of allTopics) {
      expect(t.category[0]).toBe(t.category[0].toUpperCase());
      expect(t.topic[0]).toBe(t.topic[0].toUpperCase());
    }
  });
});
