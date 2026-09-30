import { describe, it, expect } from "vitest";
import { SLOVNI_ULOHY_PISEMNE_OPERACE } from "@/content/grade-4/matematika/slovniUlohyPisemneOperace";
import type { PracticeTask } from "@/lib/types";

/**
 * Slovní úlohy s písemnými operacemi (4. ročník).
 *
 * NEZÁVISLÝ SOLVER: čísla se čtou ze ZNĚNÍ úlohy v pořadí, v jakém stojí,
 * a výsledek se spočítá vlastním vzorcem podle typu příběhu. Nic se nebere
 * z generátoru kromě textu otázky.
 */
const topic = SLOVNI_ULOHY_PISEMNE_OPERACE[0];

const cisla = (q: string) => (q.match(/\d{1,3}(?:[  ]\d{3})*/g) ?? []).map((s) => Number(s.replace(/[  ]/g, "")));
const fmt = (n: number) => n.toLocaleString("cs-CZ").replace(/\s/g, " ");

const RESENI: [RegExp, (n: number[]) => number][] = [
  [/^Město mělo/, ([, a, b]) => a + b], // „před pěti lety" — pět je slovem, první číslo je a
  [/tachometr/, ([a, c]) => c - a],
  [/šetří na nové kolo/, ([cena, ma]) => cena - ma],
  [/fotbalovém zápase/, ([a, b]) => a + b],
  [/knihovna měla/, ([a, b]) => a - b],
  [/balík/, ([k, n]) => k * n],
  [/zoo/, ([c, k]) => c * k],
  [/Sadař/, ([n, d]) => n / d],
  [/Cyklista/, ([n, d]) => n * d],
  [/Kniha má/, ([n, d]) => n / d],
  [/školní výlet/, ([z, u, m]) => Math.ceil((z + u) / m)],
  [/Kinosál/, ([r, s, p]) => r * s - p],
  [/lamp/, ([k, c, platba]) => platba - k * c],
  [/brambor/, ([p, q, z]) => p + q + z],
  [/Jana má našetřeno/, ([a, b]) => a + (a + b)],
];

function res(t: PracticeTask): number {
  const r = RESENI.filter(([re]) => re.test(t.question));
  expect(r, `neznámý typ příběhu: ${t.question}`).toHaveLength(1);
  const n = cisla(t.question);
  // „před pěti lety" nemá číslici — u města je a první číslo
  return r[0][0].source === "^Město mělo" ? r[0][1]([0, ...n]) : r[0][1](n);
}

describe.each([1, 2, 3])("Slovní úlohy 4. r. — L%i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh; 4 různé možnosti, právě jedna správná; feedback u distraktorů", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) {
      expect(t.options).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      for (const o of t.options!) {
        if (o === t.correctAnswer) expect(t.optionFeedback?.[o]).toBeUndefined();
        else expect(t.optionFeedback?.[o], `${t.question} / ${o}`).toBeTruthy();
      }
      expect(t.explanation).toBeTruthy();
      expect(t.solutionSteps?.length).toBeGreaterThan(0);
    }
  });

  it("NEZÁVISLÝ SOLVER souhlasí s klíčem", () => {
    for (const t of tasks) {
      const x = res(t);
      expect(Number.isInteger(x) && x > 0, t.question).toBe(true);
      expect(t.correctAnswer, t.question).toBe(fmt(x));
    }
  });

  it("klíč nestojí v zadání ani v nápovědách jako samostatné číslo", () => {
    for (const t of tasks) {
      expect(cisla(t.question).map(fmt), t.question).not.toContain(t.correctAnswer);
      for (const h of t.hints ?? []) expect(cisla(h).map(fmt), h).not.toContain(t.correctAnswer);
      expect(t.hints).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
    }
  });

  it("všech pět typů příběhů je v bance", () => {
    const typy = new Set(tasks.map((t) => RESENI.findIndex(([re]) => re.test(t.question))));
    expect(typy.size).toBe(5);
  });
});

describe("Slovní úlohy 4. r. — gradace a čeština", () => {
  it("úrovně mají oddělené typy příběhů", () => {
    const typy = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => RESENI.findIndex(([re]) => re.test(t.question)))));
    for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) expect([...typy[a]].filter((x) => typy[b].has(x))).toEqual([]);
  });

  it("shoda čísla a podstatného jména (2–4 × 5+)", () => {
    for (const l of [1, 2, 3]) {
      for (let r = 0; r < 20; r++) {
        for (const t of topic.generator(l)) {
          expect(t.question, t.question).not.toMatch(/\b[234] stejných\b|\b[234] (lamp|dní|balíků|vstupenek)\b/u);
          expect(t.question).not.toMatch(/\b1 (lamp|beden|dní)\b/u);
        }
      }
    }
  });
});
