import { describe, it, expect } from "vitest";
import { HISTORICKE_PRAMENY } from "../dejepis/historickePrameny";

/**
 * Historické prameny — FAKTICKÝ vzor typu categorize (práce se zdrojem).
 * Kontroluje: categorize strukturu (categories, correctAnswer "categorize"),
 * gradaci (3 → 6 → 6 položek + L3 trik), disjunktní znění L1≠L3 a SPRÁVNÉ
 * ZAŘAZENÍ přes nezávislý klasifikátor (druhá cesta) — každá položka musí dle
 * rozlišovacího pravidla (nese text / zobrazuje / předmět) padnout do své skupiny.
 */
const topic = HISTORICKE_PRAMENY[0];

const KW: Record<string, RegExp> = {
  "Písemný pramen": /kronika|listina|dopis|nápis|písmo|hieroglyf|zákoník|matri/i,
  "Obrazový pramen": /malba|freska|fotografie|mapa|rytina|portrét|kresba/i,
  "Hmotný pramen": /nástroj|nádoba|meč|spona|kostra|hradeb|hrot/i,
};

/** Vrátí skupiny, do kterých položka spadá podle klíčových slov (musí být právě 1). */
function classify(item: string): string[] {
  return Object.entries(KW).filter(([, re]) => re.test(item)).map(([name]) => name);
}

describe("Historické prameny — metadata", () => {
  it("dějepis g6, categorize, Úvod do dějepisu", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("categorize");
    expect(topic.id).toBe("g6-dej-historicke-prameny-6");
    expect(topic.category).toBe("Úvod do dějepisu");
  });
});

describe.each([1, 2, 3])("Historické prameny — level %i", (level) => {
  const tasks = topic.generator(level);

  it("categorize struktura: tři skupiny, marker, vysvětlení", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(3);
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("categorize");
      expect(t.categories, t.question).toBeDefined();
      expect(t.categories!.map((c) => c.name).sort()).toEqual(
        ["Hmotný pramen", "Obrazový pramen", "Písemný pramen"],
      );
      expect(t.explanation, t.question).toBeTruthy();
      expect((t.hints ?? []).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("KLASIFIKÁTOR: každá položka padne právě do své deklarované skupiny", () => {
    for (const t of tasks) {
      for (const cat of t.categories!) {
        for (const item of cat.items) {
          const matched = classify(item);
          expect(matched.length, `položka "${item}" matchuje skupiny: ${matched}`).toBe(1);
          expect(matched[0], `"${item}" je v "${cat.name}", ale patří do "${matched[0]}"`).toBe(cat.name);
        }
      }
    }
  });

  it("nápověda neprozrazuje konkrétní zařazení (učí pravidlo)", () => {
    for (const t of tasks) {
      // nápověda nesmí doslova obsahovat název cílové skupiny u konkrétní položky
      for (const h of t.hints ?? []) {
        expect(h.includes(": Hmotný pramen") || h.includes(": Písemný pramen") || h.includes(": Obrazový pramen")).toBe(false);
      }
    }
  });
});

describe("Historické prameny — gradace L1 ≠ L3", () => {
  it("znění otázek L1 a L3 jsou disjunktní + L3 obsahuje klamavé prameny", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const q3 = new Set(topic.generator(3).map((t) => t.question));
    const shared = [...q3].filter((q) => q1.has(q));
    expect(shared, `společné otázky L1∩L3: ${shared}`).toHaveLength(0);
    // L3 obsahuje aspoň jeden klamavý písemný pramen na neobvyklém materiálu
    const l3Items = topic.generator(3).flatMap((t) => t.categories!.flatMap((c) => c.items));
    expect(l3Items.some((i) => /klínové písmo|hieroglyf|vytesaný do kamene|náhrobní nápis/i.test(i))).toBe(true);
  });
});
