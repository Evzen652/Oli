import { describe, it, expect } from "vitest";
import { MERENI_CASU } from "../fyzika/mereniCasu";

/**
 * Čas — jednotky se základem 60. Kontroluje: select_one strukturu, chybový model,
 * žádný hint_leak, gradaci L1 (přímý převod) → L3 (časová osa / převod na sekundy).
 */
const topic = MERENI_CASU[0];

describe("Čas — metadata", () => {
  it("fyzika g6, select_one, správné id", () => {
    expect(topic.subject).toBe("fyzika");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-fyz-mereni-casu-6");
  });
});

describe.each([1, 2, 3])("Čas — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("neprázdný pool", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(10);
  });

  it("≥3 unikátní možnosti, správná je mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBeGreaterThanOrEqual(3);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(t.options!.length);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      for (const key of Object.keys(t.optionFeedback!)) {
        expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
        expect(key).not.toBe(t.correctAnswer);
      }
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
    }
  });

  it("nápověda neprozrazuje výsledek", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      }
    }
  });

  it("má vysvětlení i postup", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps?.length, t.question).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Čas — gradace", () => {
  it("L1 přímý převod; L3 časová osa / převod na sekundy", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    const l3 = topic.generator(3).map((t) => t.question);
    // L1 je vždy jednoduchý převod
    expect(l1.every((q) => /Převeď/.test(q))).toBe(true);
    // L3 obsahuje aplikační typy (časová osa nebo sekundy)
    expect(l3.some((q) => /přijede|sekund/.test(q))).toBe(true);
    expect(l1.filter((q) => l3.includes(q)).length).toBe(0);
  });
});
