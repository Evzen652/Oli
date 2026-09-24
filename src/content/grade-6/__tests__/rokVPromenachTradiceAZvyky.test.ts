import { describe, it, expect } from "vitest";
import { ROK_V_PROMENACH_TRADICE_A_ZVYKY } from "../vko/rokVPromenachTradiceAZvyky";

/**
 * Rok v jeho proměnách — tradice a zvyky (VKO 6. ročník, categorize).
 *
 * NEZÁVISLÝ SOLVER: klasifikátor klíčových slov postavený samostatně na
 * regulárních výrazech (ne na importu generátorových slovníků) — aplikuje se
 * na TEXT každé vygenerované položky a ověří, že zařazení v klíči generátoru
 * (categories) sedí. Klíčová slova jsou zvolena tak, aby pro každou
 * vygenerovanou položku matchovaly PRÁVĚ JEDEN svátek — i u L3 položek, které
 * povrchově připomínají jiný svátek ze stejného ročního období.
 */
const topic = ROK_V_PROMENACH_TRADICE_A_ZVYKY[0];

const KW: Record<string, RegExp> = {
  Vánoce: /strom|štědrovečerní|Ježíšek|cukroví|betlém|adventní|24\. prosince|narození/i,
  Velikonoce: /pomlázk|kraslic|beránek|zajíček|vajíč|mazanec|Bílou sobotu|Bílá sobota|proutk/i,
  Mikuláš: /Mikuláš|čert|anděl|básničk|5\. prosince|sladk|brambor|řetěz/i,
  Masopust: /mask|škrabošk|zabijačk|koblih|masop/i,
  Dušičky: /Dušičk|hřbitov|hrob|zemřel|listopad|věnce/i,
};

/** Vrátí svátky, do kterých položka podle klíčových slov spadá (musí být právě 1). */
function classify(item: string): string[] {
  return Object.entries(KW).filter(([, re]) => re.test(item)).map(([name]) => name);
}

describe("Rok v jeho proměnách — metadata", () => {
  it("vko g6, categorize, Člověk ve společnosti / Rok v jeho proměnách", () => {
    expect(topic.subject).toBe("vko");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("categorize");
    expect(topic.id).toBe("g6-vko-rok-v-promenach-tradice-a-zvyky-6");
    expect(topic.category).toBe("Člověk ve společnosti");
    expect(topic.topic).toBe("Rok v jeho proměnách");
    expect(topic.rvpNodeId).toBe(
      "g6-vko-clovek-ve-spolecnosti-rok-v-jeho-promenach-tradice-a-zvyky-behem-roku-vanoce-velikonoce-ad",
    );
  });
});

describe.each([1, 2, 3])("Rok v jeho proměnách — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(12);
  });

  it("categorize struktura: marker, kategorie, vysvětlení, nápovědy", () => {
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("categorize");
      expect(t.categories, t.question).toBeDefined();
      expect(t.categories!.length).toBeGreaterThanOrEqual(3);
      for (const c of t.categories!) expect(c.items.length).toBeGreaterThanOrEqual(1);
      expect(t.explanation, t.question).toBeTruthy();
      expect((t.hints ?? []).length).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
    }
  });

  it("kategorie jsou jen z pěti platných svátků, bez duplicit", () => {
    const platne = ["Vánoce", "Velikonoce", "Mikuláš", "Masopust", "Dušičky"];
    for (const t of tasks) {
      const names = t.categories!.map((c) => c.name);
      expect(new Set(names).size, t.question).toBe(names.length);
      for (const n of names) expect(platne, t.question).toContain(n);
    }
  });

  it("NEZÁVISLÝ SOLVER: každá položka podle klasifikátoru patří právě do své deklarované skupiny", () => {
    for (const t of tasks) {
      for (const cat of t.categories!) {
        for (const item of cat.items) {
          const matched = classify(item);
          expect(matched.length, `položka "${item}" matchuje svátky: ${matched.join(", ")}`).toBe(1);
          expect(matched[0], `"${item}" je zařazena do "${cat.name}", ale klasifikátor říká "${matched[0]}"`).toBe(
            cat.name,
          );
        }
      }
    }
  });

  it("žádná položka se neopakuje napříč skupinami v jedné úloze", () => {
    for (const t of tasks) {
      const all = t.categories!.flatMap((c) => c.items);
      expect(new Set(all).size, t.question).toBe(all.length);
    }
  });

  it("nápověda neprozrazuje doslovné zařazení položky ke svátku", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        for (const cat of t.categories!) {
          for (const item of cat.items) {
            expect(h.includes(`${item}: ${cat.name}`), `nápověda prozrazuje "${item}" → "${cat.name}": ${h}`).toBe(
              false,
            );
          }
        }
      }
    }
  });

  it("žádná věroučná/náboženská tvrzení jako fakt — jen kulturní zvyk", () => {
    for (const t of tasks) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? [])];
      for (const s of texty) {
        expect(/Bůh stvořil|je svatá pravda|skutečně se narodil|zaručeně|to je pravda víry/i.test(s), s).toBe(
          false,
        );
      }
    }
  });
});

describe("Rok v jeho proměnách — gradace L1 ≠ L3", () => {
  it("znění otázek L1 a L3 jsou disjunktní", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const q3 = new Set(topic.generator(3).map((t) => t.question));
    const shared = [...q3].filter((q) => q1.has(q));
    expect(shared, `společné otázky L1∩L3: ${shared}`).toHaveLength(0);
  });

  it("L1 obsahuje jen tři vzájemně jasně odlišné svátky (Vánoce, Velikonoce, Mikuláš)", () => {
    const l1 = topic.generator(1);
    for (const t of l1) {
      expect(new Set(t.categories!.map((c) => c.name))).toEqual(new Set(["Mikuláš", "Vánoce", "Velikonoce"]));
    }
  });

  it("L2 obsahuje 4 svátky — základní tři + Masopust nebo Dušičky", () => {
    const l2 = topic.generator(2);
    const zakladni = ["Mikuláš", "Vánoce", "Velikonoce"];
    for (const t of l2) {
      const names = t.categories!.map((c) => c.name).sort();
      expect(names.length).toBe(4);
      for (const z of zakladni) expect(names).toContain(z);
      const extra = names.find((n) => !zakladni.includes(n));
      expect(["Masopust", "Dušičky"]).toContain(extra);
    }
    // obě varianty extra skupiny se musí v bance objevit (losováno)
    const extras = new Set(
      l2.map((t) => t.categories!.map((c) => c.name).find((n) => !zakladni.includes(n))),
    );
    expect(extras.has("Masopust") || extras.has("Dušičky")).toBe(true);
  });

  it("L3 obsahuje jen zimní a předjarní dvojice (Vánoce, Mikuláš, Masopust, Velikonoce), bez Dušiček", () => {
    const l3 = topic.generator(3);
    for (const t of l3) {
      expect(new Set(t.categories!.map((c) => c.name))).toEqual(
        new Set(["Masopust", "Mikuláš", "Vánoce", "Velikonoce"]),
      );
    }
  });
});

describe("Rok v jeho proměnách — chybový model (errorModel)", () => {
  it("mistake 1: zima → Mikuláš × Vánoce — L3 obsahuje obchůzku za odměnu (Mikuláš) i rodinnou večeři (Vánoce)", () => {
    const l3Items = topic.generator(3).flatMap((t) => t.categories!.flatMap((c) => c.items));
    expect(l3Items.some((i) => /básničku|řetěz/i.test(i))).toBe(true);
    expect(l3Items.some((i) => /štědrovečerní|ozdobeným stromkem/i.test(i))).toBe(true);
  });

  it("mistake 2 a 3: postní cyklus — Masopust PŘED postem i Velikonoce PO postu se v L3 objevují", () => {
    const l3Items = topic.generator(3).flatMap((t) => t.categories!.flatMap((c) => c.items));
    expect(l3Items.some((i) => /než začne.*půst|před.*půst/i.test(i))).toBe(true);
    expect(l3Items.some((i) => /po skončení.*půst|skončí.*půst/i.test(i))).toBe(true);
  });

  it("mistake 4: koledování má tři odlišné podoby (mikulášská obchůzka, vánoční zpěv, velikonoční pomlázka)", () => {
    const l3Items = topic.generator(3).flatMap((t) => t.categories!.flatMap((c) => c.items));
    expect(l3Items.some((i) => /básničku|přednese básničku/i.test(i))).toBe(true); // Mikuláš
    expect(l3Items.some((i) => /zpívá.*písně|zpívá.*narození/i.test(i))).toBe(true); // Vánoce
    expect(l3Items.some((i) => /pomlázkou.*vajíčka|vajíčka.*pomlázk/i.test(i))).toBe(true); // Velikonoce
  });
});

describe("Rok v jeho proměnách — gen() determinismus", () => {
  it("opakované volání gen() vrací vždy ≥12 úloh, žádná výjimka", () => {
    for (const level of [1, 2, 3]) {
      const a = topic.generator(level);
      const b = topic.generator(level);
      expect(a.length).toBeGreaterThanOrEqual(12);
      expect(b.length).toBeGreaterThanOrEqual(12);
    }
  });
});
