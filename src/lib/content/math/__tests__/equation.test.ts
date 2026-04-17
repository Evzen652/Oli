import { describe, it, expect } from "vitest";
import { EQUATION_TOPICS } from "../equation";

/**
 * Testy pro equation.ts — lineární rovnice 8. ročník.
 * Ověřuje, že dosazením vygenerované odpovědi do rovnice platí.
 */

const [topic] = EQUATION_TOPICS;

/** Extract rovnici ze zadání "Vyřeš rovnici: ... . x = ?" a vrať funkci f(x) = levá − pravá. */
function makeChecker(question: string): ((x: number) => number) | null {
  const m = question.match(/Vyřeš(?: rovnici)?:\s*(.+?)\.\s*x\s*=/);
  if (!m) return null;

  // Převést na JavaScript výraz vhodný pro eval
  // "−" (unicode minus) → "-"
  // "·" → "*"
  // "2x" → "2*x"
  let expr = m[1].replace(/−/g, "-").replace(/·/g, "*");

  // Rozděl na levou a pravou podle "="
  const [lhs, rhs] = expr.split("=").map((s) => s.trim());
  if (!lhs || !rhs) return null;

  const normalize = (s: string) =>
    s
      // vložit * mezi číslo a "x": "2x" → "2*x", "−x" → "-1*x"
      .replace(/(\d)\s*x/g, "$1*x")
      .replace(/(^|[+\-=*/()\s])-x/g, "$1-1*x")
      .replace(/(^|[+\-=*/()\s])x/g, "$1 x");

  const lh = normalize(lhs);
  const rh = normalize(rhs);

  return (x: number) => {
    // eslint-disable-next-line no-new-func
    const lv = new Function("x", `return ${lh}`)(x);
    const rv = new Function("x", `return ${rh}`)(x);
    return lv - rv;
  };
}

describe("equation.ts — matematická správnost", () => {
  for (const level of [1, 2, 3]) {
    describe(`level ${level}`, () => {
      it("každá úloha se správně řeší dosazením", () => {
        const tasks = topic.generator(level);
        expect(tasks.length).toBeGreaterThanOrEqual(30);

        let verified = 0;
        for (const task of tasks) {
          const check = makeChecker(task.question);
          if (!check) continue; // tolerate tasks we can't parse

          const x = parseInt(task.correctAnswer, 10);
          const diff = check(x);
          expect(
            diff,
            `Equation fails for x=${x}: "${task.question}" (diff=${diff})`
          ).toBe(0);
          verified++;
        }

        // Alespoň 80 % úloh musí projít parserem
        expect(verified / tasks.length).toBeGreaterThan(0.8);
      });

      it("options obsahují correctAnswer", () => {
        const tasks = topic.generator(level);
        for (const t of tasks) {
          expect(t.options).toContain(t.correctAnswer);
        }
      });
    });
  }

  it("topic metadata je pro 8.-9. ročník", () => {
    expect(topic.id).toBe("math-rovnice-8");
    expect(topic.gradeRange).toEqual([8, 9]);
    expect(topic.keywords).toContain("rovnice");
  });
});
