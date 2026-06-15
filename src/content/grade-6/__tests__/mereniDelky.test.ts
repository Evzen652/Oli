import { describe, it, expect } from "vitest";
import { MERENI_DELKY } from "../fyzika/mereniDelky";

/**
 * Zlatý vzor 2. stupně — kontroly kvality výpočetního tématu:
 * struktura select_one, chybový model (optionFeedback), žádný hint_leak,
 * reálná gradace L1→L3.
 */
const topic = MERENI_DELKY[0];

function allTasks(level: number) {
  return topic.generator(level);
}

describe("Měření délky — metadata", () => {
  it("je fyzika 6. ročníku se select_one", () => {
    expect(topic.subject).toBe("fyzika");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-fyz-mereni-delky-6");
    expect(topic.rvpNodeId).toContain("g6-fyzika-mereni");
  });
});

describe.each([1, 2, 3])("Měření délky — úlohy level %i", (level) => {
  const tasks = allTasks(level);

  it("generuje neprázdný pool", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(10);
  });

  it("každá úloha: ≥3 unikátní možnosti a správná je mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(t.options!.length).toBeGreaterThanOrEqual(3);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(t.options!.length);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("optionFeedback: klíče jsou distraktory z options, NE správná odpověď", () => {
    for (const t of tasks) {
      expect(t.optionFeedback, t.question).toBeDefined();
      for (const key of Object.keys(t.optionFeedback!)) {
        expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
        expect(key, `feedback na správnou odpověď: ${key}`).not.toBe(t.correctAnswer);
      }
      // každý distraktor má svůj diagnostický feedback
      const distractors = t.options!.filter((o) => o !== t.correctAnswer);
      for (const d of distractors) {
        expect(t.optionFeedback![d], `chybí feedback pro distraktor "${d}" v: ${t.question}`).toBeTruthy();
      }
    }
  });

  it("nápověda neprozrazuje výsledek (hint_leak guard)", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        expect(h, `hint obsahuje odpověď: ${t.question}`).not.toContain(t.correctAnswer);
      }
    }
  });

  it("má vysvětlení i postup (explanation + solutionSteps)", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps?.length, t.question).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Měření délky — reálná gradace L1→L3", () => {
  it("L1 jsou přímé převody, L3 jsou aplikační slovní úlohy", () => {
    const l1 = allTasks(1).map((t) => t.question);
    const l3 = allTasks(3).map((t) => t.question);
    // L1: přímý převod „Převeď X na Y."
    expect(l1.every((q) => q.startsWith("Převeď"))).toBe(true);
    // L3: slovní kontext (běžec/trasa) — aplikace, ne rozpoznání
    expect(l3.some((q) => /běžec|trasa|uběhl|ušel/i.test(q))).toBe(true);
    // L1 a L3 se nepřekrývají (žádná recyklace)
    const overlap = l1.filter((q) => l3.includes(q));
    expect(overlap.length).toBe(0);
  });
});
