import { describe, it, expect } from "vitest";
import { INTEGER_TOPICS } from "../integer";

/**
 * Deterministické testy pro integer.ts — celá čísla 7. ročník.
 */

const [topic] = INTEGER_TOPICS;

/** "a + b =" nebo "(a) + (b) =" → parse a, b */
function parseAddition(question: string): [number, number] | null {
  // Formát: "5 + 3 =" nebo "(-5) + 3 =" nebo "(-5) + (-3) ="
  const m = question.match(/^(-?\d+|\(-\d+\))\s*\+\s*(-?\d+|\(-\d+\))\s*=/);
  if (!m) return null;
  const parse = (s: string) => parseInt(s.replace(/[()]/g, ""), 10);
  return [parse(m[1]), parse(m[2])];
}

function parseMul(question: string): [number, number] | null {
  const m = question.match(/^(-?\d+|\(-\d+\))\s*·\s*(-?\d+|\(-\d+\))\s*=/);
  if (!m) return null;
  const parse = (s: string) => parseInt(s.replace(/[()]/g, ""), 10);
  return [parse(m[1]), parse(m[2])];
}

function parseAbs(question: string): number | null {
  const m = question.match(/^\|(-?\d+)\|\s*=/);
  return m ? parseInt(m[1], 10) : null;
}

describe("integer.ts — matematická správnost", () => {
  for (const level of [1, 2, 3]) {
    describe(`level ${level}`, () => {
      it("každá úloha má správný výsledek", () => {
        const tasks = topic.generator(level);
        expect(tasks.length).toBeGreaterThanOrEqual(30);

        for (const task of tasks) {
          const answer = parseInt(task.correctAnswer, 10);

          const add = parseAddition(task.question);
          if (add) {
            expect(answer, `Wrong sum for ${task.question}`).toBe(add[0] + add[1]);
            continue;
          }

          const mul = parseMul(task.question);
          if (mul) {
            expect(answer, `Wrong product for ${task.question}`).toBe(mul[0] * mul[1]);
            continue;
          }

          const abs = parseAbs(task.question);
          if (abs !== null) {
            expect(answer, `Wrong abs for ${task.question}`).toBe(Math.abs(abs));
            continue;
          }

          throw new Error(`Unparseable question: ${task.question}`);
        }
      });

      it("options vždy obsahují correctAnswer", () => {
        const tasks = topic.generator(level);
        for (const t of tasks) {
          expect(t.options).toContain(t.correctAnswer);
        }
      });

      it("options má 4 unikátní hodnoty", () => {
        const tasks = topic.generator(level);
        for (const t of tasks) {
          expect(new Set(t.options ?? []).size).toBe(4);
        }
      });
    });
  }

  it("topic metadata je pro 7.-8. ročník", () => {
    expect(topic.id).toBe("math-cela-cisla-7");
    expect(topic.gradeRange).toEqual([7, 8]);
    expect(topic.keywords).toContain("celá čísla");
  });
});
