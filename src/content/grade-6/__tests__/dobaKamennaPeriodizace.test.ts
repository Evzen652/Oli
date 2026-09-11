import { describe, it, expect } from "vitest";
import { DOBA_KAMENNA_PERIODIZACE } from "../dejepis/dobaKamennaPeriodizace";

/**
 * Doba kamenná / periodizace pravěku — FAKTICKÝ vzor typu drag_order.
 * Kontroluje: drag_order strukturu (items, correctAnswer "order"), gradaci přes
 * počet položek (3 → 4 → 5), disjunktní znění otázek L1≠L3 (difficulty_progression)
 * a CHRONOLOGICKOU SPRÁVNOST přes nezávislou rank-tabulku (druhá cesta).
 */
const topic = DOBA_KAMENNA_PERIODIZACE[0];

/**
 * Nezávislý chronologický „solver": přiřadí položce rank (stáří) podle klíčových
 * slov. Rank je definován MIMO pool úloh, takže ověřuje, že pořadí items je
 * skutečně od nejstaršího po nejnovější (přísně rostoucí rank).
 */
function rank(item: string): number {
  const s = item.toLowerCase();
  if (/slovan/.test(s)) return 7;
  if (/germán|markoman/.test(s)) return 6;
  if (/želez|kelt|boi|oppid|bohemia/.test(s)) return 5;
  if (/bronz|únětick/.test(s)) return 4;
  if (/neolit|zeměděl|broušen|mladší doba kamenná/.test(s)) return 3;
  if (/mezolit|střední doba kamenná/.test(s)) return 2;
  if (/paleolit|mamut|věstonick|štípan|starší doba kamenná|lovci a sběrači/.test(s)) return 1;
  if (/doba kamenná/.test(s)) return 1; // generická doba kamenná = nejstarší
  return -1; // nerozpoznáno
}

describe("Doba kamenná — metadata", () => {
  it("dějepis g6, drag_order, oblast Pravěk", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("drag_order");
    expect(topic.id).toBe("g6-dej-doba-kamenna-periodizace-6");
    expect(topic.category).toBe("Pravěk");
  });
});

describe.each([
  [1, 3],
  [2, 4],
  [3, 5],
])("Doba kamenná — level %i (%i položek)", (level, expectedItems) => {
  const tasks = topic.generator(level);

  it("neprázdný pool, drag_order struktura", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(3);
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("order");
      expect(t.items, t.question).toBeDefined();
      expect(t.explanation, t.question).toBeTruthy();
      expect((t.hints ?? []).length, t.question).toBeGreaterThanOrEqual(1);
    }
  });

  it(`každá úloha má právě ${expectedItems} položek`, () => {
    for (const t of tasks) {
      expect(t.items!.length, t.question).toBe(expectedItems);
    }
  });

  it("CHRONOLOGICKÝ SOLVER: items jsou přísně od nejstaršího po nejnovější", () => {
    for (const t of tasks) {
      const ranks = t.items!.map(rank);
      expect(ranks.every((r) => r > 0), `nerozpoznaná položka: ${t.items}`).toBe(true);
      for (let i = 1; i < ranks.length; i++) {
        expect(
          ranks[i] > ranks[i - 1],
          `pořadí není rostoucí: "${t.items![i - 1]}" (${ranks[i - 1]}) → "${t.items![i]}" (${ranks[i]})`,
        ).toBe(true);
      }
    }
  });

  it("nápověda neprozrazuje celé pořadí (jen kotva)", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        // hint smí jmenovat víc položek jen v jiném pořadí, než je správné —
        // dvě a víc položek ve správném sledu by prozradily řešení
        const mentioned = t.items!.filter((it) => h.includes(it));
        if (mentioned.length >= 2) {
          const podleHintu = [...mentioned].sort((a, b) => h.indexOf(a) - h.indexOf(b));
          expect(podleHintu.join("|"), `hint cituje položky ve správném pořadí: ${h}`).not.toBe(mentioned.join("|"));
        }
      }
    }
  });
});

describe("Doba kamenná — gradace L1 ≠ L3 (difficulty_progression)", () => {
  it("znění otázek L1 a L3 jsou disjunktní + roste počet položek", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const q3 = new Set(topic.generator(3).map((t) => t.question));
    const shared = [...q3].filter((q) => q1.has(q));
    expect(shared, `společné otázky L1∩L3: ${shared}`).toHaveLength(0);
    // počet položek roste
    const items1 = topic.generator(1)[0].items!.length;
    const items3 = topic.generator(3)[0].items!.length;
    expect(items3).toBeGreaterThan(items1);
  });
});
