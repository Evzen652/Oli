import { describe, it, expect } from "vitest";
import { PERIODIZACE_LETOPOCET } from "../dejepis/periodizaceLetopocet";
import type { PracticeTask } from "@/lib/types";

/**
 * Periodizace / letopočet — zlatý FAKTICKÝ vzor 2. stupně.
 * Kontroluje: select_one strukturu, chybový model (každý distraktor má feedback),
 * žádný hint_leak, gradaci L1 (století) → L3 (přelom letopočtu / řazení napříč érami)
 * a NUMERICKOU SPRÁVNOST přes nezávislý deterministický solver (druhá cesta).
 */
const topic = PERIODIZACE_LETOPOCET[0];

/** Nezávislý solver — z textu otázky odvodí očekávanou odpověď bez pohledu na klíč. */
function solve(q: PracticeTask): { kind: string; expected: number | string } | null {
  const text = q.question;
  let m: RegExpMatchArray | null;
  if ((m = text.match(/patří rok (\d+) n\. l\.\?/))) {
    return { kind: "stoleti", expected: `${Math.ceil(+m[1] / 100)}. století` };
  }
  if ((m = text.match(/roku (\d+) př\. n\. l\. a zanikla roku (\d+) n\. l\./))) {
    return { kind: "prelom", expected: +m[1] + +m[2] - 1 };
  }
  if ((m = text.match(/roku (\d+) př\. n\. l\., druhá roku (\d+) př\. n\. l\./))) {
    return { kind: "rozdil", expected: +m[1] - +m[2] };
  }
  if (/nejstarší/.test(text)) {
    const bc = q.options!.filter((o) => /př\. n\. l\./.test(o)).map((o) => +o.match(/(\d+)/)![1]);
    if (bc.length) return { kind: "razeni", expected: `${Math.max(...bc)} př. n. l.` };
  }
  return null;
}

describe("Periodizace — metadata", () => {
  it("dějepis g6, select_one, Úvod do dějepisu", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-dej-periodizace-letopocet-6");
    expect(topic.category).toBe("Úvod do dějepisu");
  });
});

describe.each([1, 2, 3])("Periodizace — úlohy level %i", (level) => {
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

  it("každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("DETERMINISTICKÝ SOLVER: klíč souhlasí s nezávislým výpočtem", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
      if (typeof s!.expected === "number") {
        const num = parseInt(t.correctAnswer, 10);
        expect(num, `${s!.kind}: ${t.question} → klíč ${t.correctAnswer}`).toBe(s!.expected);
      } else {
        expect(t.correctAnswer, `${s!.kind}: ${t.question}`).toBe(s!.expected);
      }
    }
  });
});

describe("Periodizace — gradace L1 ≠ L3", () => {
  it("L1 = určení století (n. l.); L3 = přelom letopočtu / řazení napříč érami", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    const l3 = topic.generator(3).map((t) => t.question);
    // L1 je vždy o století v n. l., nikdy o přelomu
    expect(l1.every((q) => /století patří rok \d+ n\. l\./.test(q))).toBe(true);
    expect(l1.some((q) => /přelom|rok 0|zanikla/.test(q))).toBe(false);
    // L3 obsahuje přelom letopočtu i řazení, nikdy prosté určení století
    expect(l3.some((q) => /rok 0 neexistuje/.test(q))).toBe(true);
    expect(l3.some((q) => /nejstarší/.test(q))).toBe(true);
    expect(l3.every((q) => !/patří rok \d+ n\. l\./.test(q))).toBe(true);
  });
});
