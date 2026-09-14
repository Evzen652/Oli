import { describe, it, expect } from "vitest";
import { HOMINIZACE } from "../dejepis/hominizace";
import type { PracticeTask } from "@/lib/types";

/**
 * Hominizace — select_one, faktický vzor.
 * NEZÁVISLÝ SOLVER: vlastní rank-tabulka druhů a tabulka schopností, nic se
 * neimportuje z banky generátoru. Klíč se odvodí z textu otázky / možností.
 */
const topic = HOMINIZACE[0];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// ── vlastní tabulky solveru ──────────────────────────────────────────────
const RANK: Record<string, number> = {
  "Australopitek": 1,
  "Člověk zručný": 2,
  "Člověk vzpřímený": 3,
  "Neandrtálec": 4,
  "Člověk rozumný": 5,
};
const GENITIV: [RegExp, number][] = [
  [/australopitéka/, 1],
  [/člověka zručného/, 2],
  [/člověka vzpřímeného/, 3],
  [/neandrtálce/, 4],
];
/** Minimální rank schopnosti podle textu možnosti (L3a). */
function rankSchopnosti(o: string): number | null {
  if (/chůze po dvou|sběr plodů|sebraný|tlup|šelm/.test(o)) return 1;
  if (/otlučený/.test(o)) return 2;
  if (/oheň|pěstní klín|Afrik/.test(o)) return 3;
  if (/hrob/.test(o)) return 4;
  if (/malba|soška/.test(o)) return 5;
  return null;
}
/** Negace nejdřív (horní mez), pak se z textu vymažou, aby nespustily pozitivní znak. */
const NEGACE: [RegExp, number][] = [
  [/nástroje si ještě nevyráběl|kámen jen sebral|neopracoval|jen sebere|před prvními výrobci nástrojů/g, 1],
  [/malý mozek|malým mozkem|nejmenší mozek|než má šimpanz|neupravuje/g, 1],
  [/jen v Africe/g, 2],
  [/oheň (ještě )?nezn\S*|žádné stopy ohně|žádné pěstní klíny/g, 2],
  [/nepohřbív\S*|ani hroby/g, 3],
  [/nezdobil malbami|nemaluje|žádné kresby|před lovci mamutů|dřív než lovci mamutů/g, 4],
];
const ZNAKY: [RegExp, number, number?][] = [
  [/po dvou/, 1],
  [/vyráb|výrob|opracov|otluč|otlouk/, 2],
  [/oheň|ohn|pěstní klín|z Afriky|opustil Afriku/, 3],
  [/pohřb|hrob/, 4],
  [/Šipka|Kůlna|zavalit|potkali/, 4, 4],
  [/malov|malb|maluje|sošk|vyřezáv|Věstonic|Předmostí|dnešní lidé/, 5],
];

function solveDruh(t: PracticeTask): string {
  let text = t.question;
  let min = 1;
  let max = 5;
  for (const [re, m] of NEGACE) {
    if (re.test(text)) max = Math.min(max, m);
    text = text.replace(re, " ");
  }
  for (const [re, lo, hi] of ZNAKY) {
    if (re.test(text)) {
      min = Math.max(min, lo);
      if (hi) max = Math.min(max, hi);
    }
  }
  const sat = t.options!.filter((o) => RANK[o] !== undefined && RANK[o] >= min && RANK[o] <= max);
  if (/jako první|nejstarší/.test(t.question)) {
    return sat.sort((a, b) => RANK[a] - RANK[b])[0];
  }
  expect(sat, `víc/žádná vyhovující možnost: ${t.question} → ${sat.join(", ")}`).toHaveLength(1);
  return sat[0];
}

const PRICINY: [RegExp, RegExp][] = [
  [/vyrábět nástroje/, /volné ruce/],
  [/chladnějších krajích/, /u ohně/],
  [/bizon/, /představit/],
  [/o smrti/, /hrob/],
  [/setkal/, /stejné době/],
  [/krájet maso/, /otloukl/],
];

function solve(t: PracticeTask, level: number): string {
  if (level <= 2) return solveDruh(t);
  const g = GENITIV.find(([re]) => re.test(t.question));
  if (g && /NEMOHLA|chyba|NEPATŘÍ/.test(t.question)) {
    const r = g[1];
    const pozdni = t.options!.filter((o) => {
      const k = rankSchopnosti(o);
      expect(k, `neznámá schopnost: ${o}`).not.toBeNull();
      return k! > r;
    });
    expect(pozdni, `L3a: ${t.question}`).toHaveLength(1);
    return pozdni[0];
  }
  const p = PRICINY.find(([q]) => q.test(t.question));
  expect(p, `L3b nerozpoznáno: ${t.question}`).toBeTruthy();
  const hit = t.options!.filter((o) => p![1].test(o));
  expect(hit, `L3b: ${t.question}`).toHaveLength(1);
  return hit[0];
}

describe("Hominizace — metadata", () => {
  it("dějepis g6, select_one, Pravěk", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.rvpNodeId).toBe("g6-dejepis-pravek-vyvoj-cloveka-hominizace-od-australopiteka-po-homo-sapiens");
    expect(topic.category).toBe("Pravěk");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Hominizace — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních otázek, všechny s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) {
      expect(t.options, t.question).toBeTruthy();
    }
  });

  it("4 různé možnosti, klíč mezi nimi, feedback pro každý distraktor", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options).toContain(t.correctAnswer);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("NEZÁVISLÝ SOLVER souhlasí s klíčem", () => {
    for (const t of tasks) {
      expect(solve(t, level), t.question).toBe(t.correctAnswer);
    }
  });

  it("klíč není v otázce ani v nápovědách; L1/L2 nápověda nejmenuje klíčový druh", () => {
    for (const t of tasks) {
      const k = norm(t.correctAnswer);
      expect(norm(t.question).includes(k), `giveaway: ${t.question}`).toBe(false);
      for (const h of t.hints ?? []) {
        expect(norm(h).includes(k), `hint leak: ${h}`).toBe(false);
      }
    }
  });

  it("dvě různé nápovědy, unikátní napříč úlohami; vysvětlení říká proč", () => {
    const h0 = new Set<string>();
    const h1 = new Set<string>();
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(h0.has(t.hints![0]), `duplicitní hints[0]: ${t.hints![0]}`).toBe(false);
      expect(h1.has(t.hints![1]), `duplicitní hints[1]: ${t.hints![1]}`).toBe(false);
      h0.add(t.hints![0]);
      h1.add(t.hints![1]);
      expect(t.explanation, t.question).toMatch(/protože|proto/i);
    }
  });

  it("check:length — klíč není systematicky nejdelší", () => {
    const nejdelsi = tasks.filter((t) => {
      const others = t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length);
      return t.correctAnswer.length > Math.max(...others);
    }).length;
    expect(nejdelsi / tasks.length).toBeLessThanOrEqual(0.25 + 0.1);
  });

  it("check:options — klíč nevyčnívá prvním slovem", () => {
    const prvni = (s: string) => s.split(/\s/)[0].toLowerCase();
    for (const t of tasks) {
      const d = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(d).size === 1) expect(prvni(t.correctAnswer), t.question).toBe(d[0]);
    }
  });

  it("čeština: žádné holé jméno po předložce ani lomítkové tvary", () => {
    for (const t of tasks) {
      const all = [t.question, ...(t.hints ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})].join(" ");
      expect(all).not.toMatch(/\bu australopitek\b|\bu člověk\b|\bu neandrtálec\b|\/a\b|\/á\b/);
    }
  });
});

describe("Hominizace — gradace", () => {
  it("texty otázek L1, L2 a L3 jsou disjunktní", () => {
    const q = (l: number) => new Set(topic.generator(l).map((t) => t.question));
    const [l1, l2, l3] = [q(1), q(2), q(3)];
    expect([...l1].filter((x) => l3.has(x))).toHaveLength(0);
    expect([...l1].filter((x) => l2.has(x))).toHaveLength(0);
    expect([...l2].filter((x) => l3.has(x))).toHaveLength(0);
  });

  it("L1 a L2 se v otázce nezmiňují o českých jménech druhů", () => {
    for (const l of [1, 2]) {
      for (const t of topic.generator(l)) {
        for (const jmeno of Object.keys(RANK)) {
          expect(norm(t.question).includes(norm(jmeno)), t.question).toBe(false);
        }
      }
    }
  });

  it("L3 obsahuje obě podoby (anachronismus i příčinu)", () => {
    const l3 = topic.generator(3).map((t) => t.question);
    expect(l3.some((q) => /NEMOHLA|NEPATŘÍ|chyba/.test(q))).toBe(true);
    expect(l3.some((q) => /^Proč/.test(q))).toBe(true);
  });
});
