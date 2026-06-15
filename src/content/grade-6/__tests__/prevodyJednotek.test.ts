import { describe, it, expect } from "vitest";
import type { TopicMetadata } from "@/lib/types";
import { MERENI_DELKY } from "../fyzika/mereniDelky";
import { MERENI_HMOTNOSTI } from "../fyzika/mereniHmotnosti";
import { MERENI_OBJEMU } from "../fyzika/mereniObjemu";

/**
 * Kvalita převodových témat fyziky g6 (délka, hmotnost, objem) — společné
 * kontroly: struktura select_one, chybový model (optionFeedback), žádný
 * hint_leak, reálná gradace L1 (přímý převod) → L3 (aplikační úloha).
 */
const TOPICS: { name: string; topic: TopicMetadata }[] = [
  { name: "Délka", topic: MERENI_DELKY[0] },
  { name: "Hmotnost", topic: MERENI_HMOTNOSTI[0] },
  { name: "Objem", topic: MERENI_OBJEMU[0] },
];

describe.each(TOPICS)("$name — metadata", ({ topic }) => {
  it("je fyzika 6. ročníku se select_one a RVP odkazem", () => {
    expect(topic.subject).toBe("fyzika");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toMatch(/^g6-fyz-/);
    expect(topic.rvpNodeId).toContain("g6-fyzika-mereni");
  });
});

describe.each(TOPICS)("$name — kvalita úloh", ({ topic }) => {
  for (const level of [1, 2, 3]) {
    describe(`level ${level}`, () => {
      const tasks = topic.generator(level);

      it("generuje neprázdný pool", () => {
        expect(tasks.length).toBeGreaterThanOrEqual(10);
      });

      it("≥3 unikátní možnosti, správná je mezi nimi", () => {
        for (const t of tasks) {
          expect(t.options, t.question).toBeDefined();
          expect(t.options!.length).toBeGreaterThanOrEqual(3);
          expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(t.options!.length);
          expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
        }
      });

      it("chybový model: každý distraktor má diagnostický feedback, správná ne", () => {
        for (const t of tasks) {
          expect(t.optionFeedback, t.question).toBeDefined();
          for (const key of Object.keys(t.optionFeedback!)) {
            expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
            expect(key, `feedback na správnou odpověď: ${key}`).not.toBe(t.correctAnswer);
          }
          for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
            expect(t.optionFeedback![d], `chybí feedback pro distraktor "${d}": ${t.question}`).toBeTruthy();
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

      it("má vysvětlení i postup", () => {
        for (const t of tasks) {
          expect(t.explanation, t.question).toBeTruthy();
          expect(t.solutionSteps?.length, t.question).toBeGreaterThanOrEqual(2);
        }
      });
    });
  }

  it("reálná gradace: L1 = přímý převod, L3 = aplikační úloha (bez recyklace)", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    const l3 = topic.generator(3).map((t) => t.question);
    // L1: přímý převod „Převeď X na Y."
    expect(l1.every((q) => q.startsWith("Převeď"))).toBe(true);
    // L3: slovní úloha (nikdy ne přímý převod)
    expect(l3.some((q) => q.startsWith("Převeď"))).toBe(false);
    // žádný překryv L1 ↔ L3
    expect(l1.filter((q) => l3.includes(q)).length).toBe(0);
  });
});
