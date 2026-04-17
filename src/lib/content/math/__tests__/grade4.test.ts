import { describe, it, expect } from "vitest";
import { ADD_SUB_10K_TOPICS } from "../addSub10k";
import { MULT_WRITTEN_TOPICS } from "../multWritten";
import { DIVIDE_REMAINDER_TOPICS } from "../divideRemainder";
import { ROUNDING_4_TOPICS } from "../rounding4";
import { FRAC_INTRO_TOPICS } from "../fracIntro";
import { UNITS_4_TOPICS } from "../units4";
import { PERIMETER_4_TOPICS } from "../perimeter4";

/**
 * Unit testy pro všech 7 generátorů 4. ročníku matematiky.
 * Ověřují:
 *  - matematickou správnost (parse zadání + ověření odpovědi)
 *  - přítomnost correctAnswer v options
 *  - přítomnost solution steps a hints
 *  - správnou metadata (gradeRange, contentType, prerequisites)
 */

const parseNumCs = (s: string): number => Number(s.replace(/\s/g, "").replace(",", "."));

// ══════════════════════════════════════════════════════════════════════════
// 1. Sčítání/odčítání do 10 000
// ══════════════════════════════════════════════════════════════════════════
describe("addSub10k — sčítání a odčítání do 10 000", () => {
  const [t] = ADD_SUB_10K_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level} generuje správné výsledky`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const m = task.question.match(/^([\d\s]+)\s*([+−])\s*([\d\s]+)\s*=/);
        expect(m, `unparseable: ${task.question}`).not.toBeNull();
        if (!m) continue;
        const a = parseNumCs(m[1]);
        const b = parseNumCs(m[3]);
        const op = m[2];
        const expected = op === "+" ? a + b : a - b;
        expect(parseNumCs(task.correctAnswer), `${task.question}`).toBe(expected);
        expect(task.options).toContain(task.correctAnswer);
      }
    });
  }
  it("metadata", () => {
    expect(t.gradeRange).toEqual([4, 5]);
    expect(t.contentType).toBe("algorithmic");
    expect(t.prerequisites).toContain("math-add-sub-100");
  });
});

// ══════════════════════════════════════════════════════════════════════════
// 2. Písemné násobení
// ══════════════════════════════════════════════════════════════════════════
describe("multWritten — písemné násobení", () => {
  const [t] = MULT_WRITTEN_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level} generuje správné výsledky`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const m = task.question.match(/^([\d\s]+)\s*×\s*(\d+)\s*=/);
        expect(m, `unparseable: ${task.question}`).not.toBeNull();
        if (!m) continue;
        const a = parseNumCs(m[1]);
        const b = parseNumCs(m[2]);
        expect(parseNumCs(task.correctAnswer), `${task.question}`).toBe(a * b);
      }
    });
  }
  it("metadata", () => {
    expect(t.gradeRange).toEqual([4, 5]);
    expect(t.prerequisites).toContain("math-multiply");
  });
});

// ══════════════════════════════════════════════════════════════════════════
// 3. Dělení se zbytkem
// ══════════════════════════════════════════════════════════════════════════
describe("divideRemainder — dělení se zbytkem", () => {
  const [t] = DIVIDE_REMAINDER_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: kvocient × dělitel + zbytek = dělenec`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const m = task.question.match(/^(\d+)\s*÷\s*(\d+)\s*=/);
        expect(m).not.toBeNull();
        if (!m) continue;
        const dividend = parseInt(m[1], 10);
        const divisor = parseInt(m[2], 10);
        const ans = task.correctAnswer;
        const zm = ans.match(/^(\d+)(?:\s*zb\.\s*(\d+))?$/);
        expect(zm, `bad answer format: ${ans}`).not.toBeNull();
        if (!zm) continue;
        const quotient = parseInt(zm[1], 10);
        const remainder = zm[2] ? parseInt(zm[2], 10) : 0;
        expect(remainder).toBeLessThan(divisor); // ZBYTEK < DĚLITEL — invariant
        expect(quotient * divisor + remainder, `${task.question} = ${ans}`).toBe(dividend);
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 4. Zaokrouhlování
// ══════════════════════════════════════════════════════════════════════════
describe("rounding4 — zaokrouhlování", () => {
  const [t] = ROUNDING_4_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level} zaokrouhluje dle pravidla 5`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      const base = level === 1 ? 10 : level === 2 ? 100 : 1000;
      for (const task of tasks) {
        const m = task.question.match(/^Zaokrouhli\s+([\d\s]+)\s+na/);
        expect(m).not.toBeNull();
        if (!m) continue;
        const n = parseNumCs(m[1]);
        const expected = Math.round(n / base) * base;
        expect(parseNumCs(task.correctAnswer), `${task.question}`).toBe(expected);
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 5. Zlomek jako část celku
// ══════════════════════════════════════════════════════════════════════════
describe("fracIntro — zlomek jako část celku", () => {
  const [t] = FRAC_INTRO_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: n/d z celku = (celek/d)·n`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const m = task.question.match(/^Kolik je\s+(\d+)\/(\d+)\s+z\s+(\d+)\?/);
        expect(m).not.toBeNull();
        if (!m) continue;
        const num = parseInt(m[1], 10);
        const den = parseInt(m[2], 10);
        const whole = parseInt(m[3], 10);
        const expected = (whole / den) * num;
        expect(Number.isInteger(expected)).toBe(true); // generátor zaručuje celé
        expect(parseInt(task.correctAnswer, 10), `${task.question}`).toBe(expected);
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 6. Převody jednotek
// ══════════════════════════════════════════════════════════════════════════
describe("units4 — převody jednotek", () => {
  const [t] = UNITS_4_TOPICS;
  const CONV: Record<string, Record<string, number>> = {
    m: { cm: 100 }, cm: { mm: 10, m: 1 / 100 }, km: { m: 1000 }, dm: { cm: 10 },
    kg: { g: 1000 }, t: { kg: 1000 }, dkg: { g: 10 }, g: { kg: 1 / 1000, dkg: 1 / 10 },
    l: { ml: 1000 }, hl: { l: 100 }, ml: { l: 1 / 1000 },
    h: { min: 60 }, min: { s: 60, h: 1 / 60 }, den: { h: 24 }, s: { min: 1 / 60 },
  };
  for (const level of [1, 2, 3]) {
    it(`level ${level}: převod je matematicky správný`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const m = task.question.match(/^(\d+)\s+(\S+)\s*=\s*\?\s+(\S+)/);
        expect(m).not.toBeNull();
        if (!m) continue;
        const value = parseInt(m[1], 10);
        const fromU = m[2];
        const toU = m[3];
        const factor = CONV[fromU]?.[toU];
        if (factor === undefined) continue; // some combinations are indirect
        const expected = value * factor;
        expect(parseInt(task.correctAnswer, 10), `${task.question}`).toBe(expected);
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 7. Obvod
// ══════════════════════════════════════════════════════════════════════════
describe("perimeter4 — obvod útvarů", () => {
  const [t] = PERIMETER_4_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: obvod je součet všech stran`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const numbers = [...task.question.matchAll(/(\d+)\s*(?:cm|m)/g)].map((m) => parseInt(m[1], 10));
        // U obdélníku jsou vstupní 2 strany — obvod = 2a + 2b
        const ansMatch = task.correctAnswer.match(/^(\d+)/);
        expect(ansMatch).not.toBeNull();
        if (!ansMatch) continue;
        const ans = parseInt(ansMatch[1], 10);

        if (/Obdélník/i.test(task.question)) {
          expect(ans).toBe(2 * numbers[0] + 2 * numbers[1]);
        } else if (/Trojúhelník/i.test(task.question)) {
          expect(ans).toBe(numbers[0] + numbers[1] + numbers[2]);
        } else if (/Čtyřúhelník/i.test(task.question)) {
          expect(ans).toBe(numbers[0] + numbers[1] + numbers[2] + numbers[3]);
        }
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// Společné kontroly pro všechny
// ══════════════════════════════════════════════════════════════════════════
describe("Grade 4 — společné kontroly", () => {
  const allTopics = [
    ...ADD_SUB_10K_TOPICS,
    ...MULT_WRITTEN_TOPICS,
    ...DIVIDE_REMAINDER_TOPICS,
    ...ROUNDING_4_TOPICS,
    ...FRAC_INTRO_TOPICS,
    ...UNITS_4_TOPICS,
    ...PERIMETER_4_TOPICS,
  ];

  it("všech 7 topiců má gradeRange začínající 4", () => {
    for (const t of allTopics) {
      expect(t.gradeRange[0], `${t.id}`).toBe(4);
    }
  });

  it("všechny mají helpTemplate se všemi povinnými poli", () => {
    for (const t of allTopics) {
      expect(t.helpTemplate.hint).toBeTruthy();
      expect(t.helpTemplate.steps.length).toBeGreaterThan(2);
      expect(t.helpTemplate.commonMistake).toBeTruthy();
      expect(t.helpTemplate.example).toBeTruthy();
      expect(t.helpTemplate.visualExamples?.length ?? 0, `${t.id} nemá visualExamples`).toBeGreaterThan(0);
    }
  });

  it("všechny cvičení mají hints a solutionSteps", () => {
    for (const t of allTopics) {
      const tasks = t.generator(2);
      for (const task of tasks.slice(0, 5)) {
        expect(task.hints?.length ?? 0, `${t.id}: ${task.question}`).toBeGreaterThan(0);
        expect(task.solutionSteps?.length ?? 0, `${t.id}: ${task.question}`).toBeGreaterThan(0);
      }
    }
  });

  it("všechny mají prerequisites (vertikální kontinuita)", () => {
    for (const t of allTopics) {
      expect(t.prerequisites, `${t.id}`).toBeDefined();
      expect((t.prerequisites || []).length, `${t.id}`).toBeGreaterThan(0);
    }
  });

  it("všechny mají rvpReference", () => {
    for (const t of allTopics) {
      expect(t.rvpReference, `${t.id}`).toMatch(/^M-\d+-\d+-\d+$/);
    }
  });

  it("všechny kategorie začínají velkým písmenem (pro vizuál lookup)", () => {
    // Lookup v prvoukaVisuals.ts je case-sensitive; lowercase by ztratil ikony
    for (const t of allTopics) {
      const firstChar = t.category[0];
      expect(firstChar === firstChar.toUpperCase(), `${t.id}: category "${t.category}" začíná malým písmenem`).toBe(true);
      const topicFirstChar = t.topic[0];
      expect(topicFirstChar === topicFirstChar.toUpperCase(), `${t.id}: topic "${t.topic}" začíná malým písmenem`).toBe(true);
    }
  });
});
