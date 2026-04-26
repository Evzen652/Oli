import { describe, it, expect } from "vitest";
import { PERCENTAGE_TOPICS } from "../percentage";

/**
 * Deterministické testy pro percentage.ts generátor.
 * Ověřuje, že KAŽDÁ vygenerovaná úloha má matematicky správnou odpověď.
 */

const [topic] = PERCENTAGE_TOPICS;

/** Ze zadání úlohy "Kolik je X % z Y?" vypočti správnou hodnotu. */
function computePart(question: string): number | null {
  const m = question.match(/Kolik je (\d+) % z (\d+)/);
  if (!m) return null;
  const pct = parseInt(m[1], 10);
  const base = parseInt(m[2], 10);
  return (pct * base) / 100;
}

/** Ze zadání úlohy "Z je X % z jakého čísla?" vypočti základ. */
function computeBase(question: string): number | null {
  const m = question.match(/(\d+) je (\d+) % z jakého čísla/);
  if (!m) return null;
  const part = parseInt(m[1], 10);
  const pct = parseInt(m[2], 10);
  return (part * 100) / pct;
}

/** Ze zadání úlohy "Kolik procent je Z z Y?" vypočti procenta. */
function computePercent(question: string): number | null {
  const m = question.match(/Kolik procent je (\d+) z (\d+)/);
  if (!m) return null;
  const part = parseInt(m[1], 10);
  const base = parseInt(m[2], 10);
  return (part / base) * 100;
}

describe("percentage.ts — matematická správnost", () => {
  for (const level of [1, 2, 3]) {
    describe(`level ${level}`, () => {
      it(`vygeneruje 60 úloh, každá má správnou correctAnswer`, () => {
        const tasks = topic.generator(level);
        expect(tasks.length).toBeGreaterThanOrEqual(40);

        for (const task of tasks) {
          const answer = parseFloat(task.correctAnswer);
          let computed: number | null = null;

          if (task.question.includes("Kolik je")) computed = computePart(task.question);
          else if (task.question.includes("je") && task.question.includes("z jakého čísla")) computed = computeBase(task.question);
          else if (task.question.includes("Kolik procent")) computed = computePercent(task.question);

          expect(computed, `Unparseable: ${task.question}`).not.toBeNull();
          // Tolerance pro floating-point (např. 42/600 * 100 = 7.000000001)
          expect(
            Math.abs(answer - (computed as number)),
            `Task "${task.question}" has wrong answer. Expected ~${computed}, got ${task.correctAnswer}`
          ).toBeLessThan(0.01);
        }
      });

      it("všechny options obsahují correctAnswer", () => {
        const tasks = topic.generator(level);
        for (const t of tasks) {
          expect(t.options).toContain(t.correctAnswer);
        }
      });

      it("options má přesně 4 unikátní hodnoty", () => {
        const tasks = topic.generator(level);
        for (const t of tasks) {
          const uniq = new Set(t.options ?? []);
          expect(uniq.size, `Duplicates in options: ${JSON.stringify(t.options)}`).toBe(4);
        }
      });
    });
  }

  it("topic metadata odpovídá RVP 7.-9. ročníku", () => {
    expect(topic.id).toBe("math-procenta-7");
    expect(topic.gradeRange).toEqual([7, 9]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.keywords).toContain("procenta");
  });
});
