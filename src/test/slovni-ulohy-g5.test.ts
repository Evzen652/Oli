import { describe, it, expect } from "vitest";
import { SLOVNI_ULOHY_VELKA_A_DESETINNA_CISLA } from "@/content/grade-5/matematika/slovniUlohyVelkaADesetinnaCisla";
import type { PracticeTask } from "@/lib/types";

/**
 * Slovní úlohy 5. ročníku.
 *
 * NEZÁVISLÝ SOLVER: čísla se čtou ze ZNĚNÍ úlohy v pořadí, v jakém stojí,
 * a výsledek se spočítá vlastním vzorcem podle typu příběhu. Z generátoru se
 * nebere nic kromě textu otázky. Peníze s čárkou se počítají v haléřích.
 */
const topic = SLOVNI_ULOHY_VELKA_A_DESETINNA_CISLA[0];

const RE = /\d{1,3}(?:[  ]\d{3})*(?:,\d+)?/g;
/** Čísla ze zadání; desetinná (koruny) v haléřích, celá beze změny. */
const cisla = (q: string) =>
  (q.match(RE) ?? []).map((s) => {
    const t = s.replace(/[  ]/g, "");
    return t.includes(",") ? Math.round(Number(t.replace(",", ".")) * 100) : Number(t);
  });
// 5. ročník (grade-5/_mat.ts) odděluje tisíce obyčejnou mezerou
const fmt = (n: number) => n.toLocaleString("cs-CZ").replace(/\s/g, " ");
const fkc = (h: number) => (h / 100).toLocaleString("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, " ");

type Res = [RegExp, (n: number[]) => number, boolean?];
const RESENI: Res[] = [
  // L1
  [/^Hrad navštívilo v červenci/, ([a, b]) => a + b],
  [/každý den .* Kolik .* to bude za/, ([n, d]) => n * d],
  [/přepravkách/, ([n, d]) => n / d],
  [/Letadlo/, ([a, b]) => a - b],
  [/^Maminka koupila/, ([a, b]) => a + b, true],
  // L2
  [/Na výlet jede/, ([z, c, bus]) => z * c - bus],
  [/Balení/, ([c, k, cena]) => c * k - cena],
  [/Cesta vlakem/, ([D, v, h]) => D - v * h],
  [/^Tomáš koupil/, ([a, b, platba]) => platba * 100 - a - b, true],
  [/průměrně za jeden den/, ([a, b, c]) => (a + b + c) / 3],
  // L3
  [/mají dohromady/, ([S, D]) => (S + D) / 2],
  [/Myslím si číslo/, ([m, p, R]) => (R - p) / m],
  [/takových/, ([n1, C, n2]) => (C / n1) * n2],
  [/sportovních potřeb/, ([B, a, p, b, q]) => B - a * p - b * q],
  [/v neděli, aby průměr/, ([a, b, c, p]) => 4 * p - a - b - c],
];

function typ(t: PracticeTask): number {
  const r = RESENI.map((x, i) => (x[0].test(t.question) ? i : -1)).filter((i) => i >= 0);
  expect(r, `neznámý nebo nejednoznačný typ: ${t.question}`).toHaveLength(1);
  return r[0];
}

function res(t: PracticeTask): string {
  const [, f, penize] = RESENI[typ(t)];
  const x = f(cisla(t.question));
  expect(Number.isInteger(x) && x > 0, `${t.question} → ${x}`).toBe(true);
  return penize ? fkc(x) : fmt(x);
}

describe.each([1, 2, 3])("Slovní úlohy 5. r. — L%i", (level) => {
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

  it("NEZÁVISLÝ SOLVER souhlasí s klíčem (20 běhů)", () => {
    for (let r = 0; r < 20; r++) {
      for (const t of topic.generator(level)) expect(t.correctAnswer, t.question).toBe(res(t));
    }
  });

  it("klíč nestojí v zadání ani v nápovědách jako samostatné číslo", () => {
    for (const t of tasks) {
      const vText = [t.question, ...(t.hints ?? [])].flatMap((s) => s.match(RE) ?? []);
      expect(vText, t.question).not.toContain(t.correctAnswer);
      expect(t.hints).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
    }
  });

  it("všech pět typů příběhů je v bance", () => {
    expect(new Set(tasks.map(typ)).size).toBe(5);
  });
});

describe("Slovní úlohy 5. r. — gradace a čeština", () => {
  it("úrovně mají oddělené typy příběhů", () => {
    const typy = [1, 2, 3].map((l) => new Set(topic.generator(l).map(typ)));
    for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) expect([...typy[a]].filter((x) => typy[b].has(x))).toEqual([]);
  });

  it("shoda čísla a podstatného jména; žádný rozbitý tvar", () => {
    for (const l of [1, 2, 3]) {
      for (let r = 0; r < 30; r++) {
        for (const t of topic.generator(l)) {
          const vse = [t.question, ...(t.hints ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})].join(" ");
          // \b v JS nezná česká písmena, proto hranice slova přes lookaround
          expect(vse, vse).not.toMatch(/(?<![\p{L}\d])(?<!\d[  ])[234] (hodin|stejných|míčů|švihadel|lahví)(?![\p{L}])/u);
          expect(vse, vse).not.toMatch(/(?<![\p{L}\d])(?<!\d[  ])1 (hodin|hodiny|míčů|míče)(?![\p{L}])/u);
          expect(vse, vse).not.toMatch(/(Eva|Klára|Lucie|Tereza) (neměl|měl)(?![\p{L}])|(Eva|Klára|Lucie|Tereza) navíc, měli/u);
          expect(vse, vse).not.toMatch(/undefined|NaN|\$\{/);
        }
      }
    }
  });
});
