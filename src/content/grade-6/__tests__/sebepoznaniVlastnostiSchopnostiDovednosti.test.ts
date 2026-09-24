import { describe, it, expect } from "vitest";
import { SEBEPOZNANI_VLASTNOSTI_SCHOPNOSTI_DOVEDNOSTI } from "../vko/sebepoznaniVlastnostiSchopnostiDovednosti";

/**
 * VKO g6 — Sebepoznání: vlastnost, schopnost, dovednost (categorize).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, ne logika generátoru): klasifikuje každou
 * položku podle slovních signálů v jejím textu, dle spec.solverCheck:
 * - "od narození" / "od malička" / "od přírody" / "nadání" / "vlohy" / "talent"
 *   → Schopnost (vrozený předpoklad).
 * - "naučil(a)" / "trén…" (trénoval, tréninku) / "zvlád…" (zvládl, zvládne)
 *   → Dovednost (výsledek cvičení). Kontroluje se PŘED schopností, protože
 *   L3 dvojice mluví o téže osobě a nesmí se s ní splést.
 * - adjektiva stálého charakteru (upřímný, pečlivý, trpělivý, tvrdohlavý,
 *   veselý, laskavý, spolehlivý, štědrý, zodpovědný, skromný, zdvořilý,
 *   vznětlivý, vytrvalý, klidný) → Vlastnost.
 * - Pro holé L1 fráze bez signálu: prefix "Umí " → Dovednost, "Má " →
 *   Schopnost, "Je " → Vlastnost (bare dictionary klíč).
 */
const topic = SEBEPOZNANI_VLASTNOSTI_SCHOPNOSTI_DOVEDNOSTI[0];

const DOVEDNOST_RE = /učil|trén|zvlád/i;
const SCHOPNOST_RE = /od narození|od malička|od přírody|nadání|vlohy|talent/i;
const VLASTNOST_RE =
  /upřímn|pečliv|trpěliv|tvrdohlav|vesel|laskav|spolehliv|štědr|zodpovědn|skromn|zdvořil|vznětliv|vytrval|klidn|chová se/i;

function classify(item: string): string {
  if (DOVEDNOST_RE.test(item)) return "Dovednost";
  if (SCHOPNOST_RE.test(item)) return "Schopnost";
  if (VLASTNOST_RE.test(item)) return "Vlastnost";
  if (/^Umí /.test(item)) return "Dovednost";
  if (/^Má /.test(item)) return "Schopnost";
  if (/^Je /.test(item)) return "Vlastnost";
  return "NEZNÁMÉ";
}

describe("Sebepoznání — metadata", () => {
  it("vko g6, categorize, Člověk jako jedinec / Osobní rozvoj", () => {
    expect(topic.subject).toBe("vko");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("categorize");
    expect(topic.id).toBe("g6-vko-sebepoznani-vlastnosti-schopnosti-dovednosti-6");
    expect(topic.category).toBe("Člověk jako jedinec");
    expect(topic.topic).toBe("Osobní rozvoj");
    expect(topic.rvpNodeId).toBe(
      "g6-vko-clovek-jako-jedinec-osobni-rozvoj-sebepoznani-osobni-vlastnosti-schopnosti-dovednosti",
    );
  });
});

describe.each([1, 2, 3])("Sebepoznání — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(12);
  });

  it("categorize struktura: tři kategorie, 6 položek, vysvětlení, 2 nápovědy", () => {
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("categorize");
      expect(t.categories, t.question).toBeDefined();
      expect(t.categories!.map((c) => c.name).sort()).toEqual(["Dovednost", "Schopnost", "Vlastnost"]);
      const total = t.categories!.reduce((n, c) => n + c.items.length, 0);
      expect(total, t.question).toBeGreaterThanOrEqual(6);
      expect(total, t.question).toBeLessThanOrEqual(8);
      expect(t.explanation, t.question).toBeTruthy();
      expect((t.hints ?? []).length).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
    }
  });

  it("KLASIFIKÁTOR: každá položka padne právě do své deklarované kategorie", () => {
    for (const t of tasks) {
      for (const cat of t.categories!) {
        for (const item of cat.items) {
          const got = classify(item);
          expect(got, `"${item}" klasifikováno jako "${got}", ale je v "${cat.name}"`).toBe(cat.name);
        }
      }
    }
  });

  it("žádná položka nenese signál dvou kategorií zároveň (není 'smíšená')", () => {
    for (const t of tasks) {
      for (const cat of t.categories!) {
        for (const item of cat.items) {
          const signals = [DOVEDNOST_RE.test(item), SCHOPNOST_RE.test(item), VLASTNOST_RE.test(item)].filter(
            Boolean,
          ).length;
          expect(signals, `"${item}" nese ${signals} signály najednou`).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it("nápověda neprozrazuje konkrétní zařazení položky do kategorie", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        expect(h).not.toMatch(/: Vlastnost|: Schopnost|: Dovednost/);
      }
    }
  });
});

describe("Sebepoznání — gradace L1 ≠ L3 a L3 dvojice", () => {
  it("znění otázek L1 a L3 jsou disjunktní", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const q3 = new Set(topic.generator(3).map((t) => t.question));
    const shared = [...q3].filter((q) => q1.has(q));
    expect(shared, `společné otázky L1∩L3: ${shared}`).toHaveLength(0);
  });

  it("L3: u položek s vrozeným základem existuje SAMOSTATNÁ položka s výsledkem tréninku (ne jedna smíšená věta)", () => {
    const tasks = topic.generator(3);
    for (const t of tasks) {
      const schopnost = t.categories!.find((c) => c.name === "Schopnost")!.items;
      const dovednost = t.categories!.find((c) => c.name === "Dovednost")!.items;
      // Generátor u L3 vždy skládá dvojice ze stejné banky (PARY) — ověř, že
      // počet schopnostních a dovednostních položek sedí (žádná věta obojí
      // nespojuje do jedné).
      expect(schopnost.length).toBeGreaterThanOrEqual(1);
      expect(dovednost.length).toBeGreaterThanOrEqual(1);
      expect(schopnost.length).toBe(dovednost.length);
      // žádná položka není delší "smíšená" věta obsahující signály obou kategorií
      for (const item of [...schopnost, ...dovednost]) {
        expect(DOVEDNOST_RE.test(item) && SCHOPNOST_RE.test(item)).toBe(false);
      }
    }
  });

  it("L1 jsou izolované fráze (bez tečkovaného kontextu), L3 jsou celé věty se situací", () => {
    const l1 = topic.generator(1).flatMap((t) => t.categories!.flatMap((c) => c.items));
    const l3 = topic.generator(3).flatMap((t) => t.categories!.flatMap((c) => c.items));
    expect(l1.every((i) => i.length <= 40)).toBe(true);
    expect(l3.some((i) => i.length > 40)).toBe(true);
  });
});
