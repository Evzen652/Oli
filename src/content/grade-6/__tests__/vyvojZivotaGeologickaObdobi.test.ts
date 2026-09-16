import { describe, it, expect } from "vitest";
import { VYVOJ_ZIVOTA_GEOLOGICKA_OBDOBI } from "../prirodopis/vyvojZivotaGeologickaObdobi";
import { klicUlohy } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Vývoj života na Zemi — geologická období (categorize).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): klasifikátor klíčových slov psaný zvlášť,
 * NEimportuje banku generátoru. Každá položka musí padnout právě do jedné éry
 * a ta se musí shodovat s přihrádkou v klíči. Kolize „zub savce vedle
 * ještěra“ řeší regex: „rozvoj savců“ (třetihory) na samotné slovo „savec“
 * nereaguje, „ještěr“ ukazuje na druhohory.
 */
const topic = VYVOJ_ZIVOTA_GEOLOGICKA_OBDOBI[0];
const ERY = ["Prvohory", "Druhohory", "Třetihory", "Čtvrtohory"];

const KW: Record<string, RegExp> = {
  Prvohory: /trilobit|plavu[nň]|přeslič|černé(ho)? uhlí|první ryb|obojživeln|tři podélné|vážk|z vody na souš|pancéřovan/i,
  Druhohory: /dinosaur|tyranosaur|diplodok|ptakoještě[rř]|ichtyosaur|archeopteryx|obří(ch|ho)? ještěr|ještěr[ůa]|peřím, zuby|nahosemenn|cykas|jehličnan|mořského plaza|létající(ho)? plaz/i,
  Třetihory: /hněd(é|ého|ém) uhlí|hnědouheln|rozvoj savců|rozvoj ptáků|lidoop|kvetoucí(ch)? rostlin|palm/i,
  Čtvrtohory: /mamut|srstnat|jeskynní medvěd|člověk rozumný|dob[ay]? ledov|pazourk|chladu|zakroucen|hustou srstí|ohništ|ledovec|soba\b/i,
};
const classify = (item: string): string[] =>
  Object.entries(KW).filter(([, re]) => re.test(item)).map(([era]) => era);

/** Jména typických zástupců z L1 — v popisech L3 se nesmí objevit. */
const L1_JMENA = [
  "trilobit", "první ryby", "plavuně", "přesličky", "obojživeln", "tyranosaur", "diplodok",
  "ptakoještě", "ichtyosaur", "rozvoj savců", "rozvoj ptáků", "kvetoucích rostlin",
  "mamut", "nosorožec", "jeskynní medvěd", "člověk rozumný",
];
const NAZEV_ERY = /prvohor|druhohor|třetihor|čtvrtohor/i;

const polozky = (t: PracticeTask) => t.categories!.flatMap((c) => c.items);

describe("Geologická období — metadata", () => {
  it("přírodopis g6, categorize, category/topic znak po znaku", () => {
    expect(topic.id).toBe("g6-pri-vyvoj-zivota-geologicka-obdobi-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.inputType).toBe("categorize");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Obecná biologie");
    expect(topic.topic).toBe("Vznik a vývoj života");
    expect(topic.rvpNodeId).toBe(
      "g6-prirodopis-obecna-biologie-vznik-a-vyvoj-zivota-vyvoj-zivota-na-zemi-geologicka-obdobi",
    );
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Geologická období — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh a determinismus", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(12);
    const klice = tasks.map((t) =>
      JSON.stringify(t.categories!.map((c) => [c.name, [...c.items].sort()]).sort()),
    );
    expect(new Set(klice).size).toBeGreaterThanOrEqual(12);
    expect(topic.generator(level).map(klicUlohy)).toEqual(tasks.map(klicUlohy));
  });

  it("KLASIFIKÁTOR: každá položka padne právě do své přihrádky", () => {
    for (const t of tasks) {
      for (const cat of t.categories!) {
        for (const item of cat.items) {
          const m = classify(item);
          expect(m, `„${item}“ matchuje: ${m}`).toHaveLength(1);
          expect(m[0], `„${item}“ je v ${cat.name}`).toBe(cat.name);
        }
      }
    }
  });

  it("struktura: labely, počet přihrádek, bez duplicit", () => {
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("categorize");
      const names = t.categories!.map((c) => c.name);
      for (const n of names) expect(ERY).toContain(n);
      expect(new Set(names).size).toBe(names.length);
      const obsazene = t.categories!.filter((c) => c.items.length > 0).length;
      if (level === 1) expect(names).toHaveLength(2);
      else expect(obsazene).toBeGreaterThanOrEqual(3);
      const it = polozky(t);
      expect(new Set(it).size).toBe(it.length);
      if (level === 1) expect(it.length).toBeGreaterThanOrEqual(4);
      if (level === 1) expect(it.length).toBeLessThanOrEqual(6);
      if (level === 2) expect(it.length).toBeGreaterThanOrEqual(6);
      if (level === 2) expect(it.length).toBeLessThanOrEqual(8);
      if (level === 3) expect(it.length).toBeGreaterThanOrEqual(5);
      if (level === 3) expect(it.length).toBeLessThanOrEqual(6);
    }
  });

  it("žádný giveaway: položky ani zadání neobsahují název éry", () => {
    for (const t of tasks) {
      expect(t.question).not.toMatch(NAZEV_ERY);
      for (const i of polozky(t)) expect(i).not.toMatch(NAZEV_ERY);
    }
  });

  it("nápovědy: dvě, neprozrazují položky ani éry", () => {
    for (const t of tasks) {
      expect(t.hints).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(h).not.toMatch(NAZEV_ERY);
        for (const i of polozky(t)) expect(h.includes(i), `hint obsahuje „${i}“`).toBe(false);
      }
    }
  });

  it("vysvětlení zdůvodňuje každou položku (PROČ)", () => {
    for (const t of tasks) {
      for (const i of polozky(t)) {
        const kotva = `„${i.replace(/\.$/, "")}“`;
        const idx = t.explanation!.indexOf(kotva);
        expect(idx, `vysvětlení chybí u ${kotva}`).toBeGreaterThanOrEqual(0);
        expect(t.explanation!.slice(idx, idx + kotva.length + 40)).toMatch(/protože/);
      }
    }
  });
});

describe("Geologická období — gradace", () => {
  it("L2 má v každé úloze aspoň dvě rostliny nebo události mimo zástupce z L1", () => {
    for (const t of topic.generator(2)) {
      const nove = polozky(t).filter((i) => !L1_JMENA.some((j) => i.toLowerCase().startsWith(j)) && !/^(stromové|rozšíření|první obojživeln)/i.test(i));
      expect(nove.length, t.categories!.map((c) => c.items.join(", ")).join(" | ")).toBeGreaterThanOrEqual(2);
    }
  });

  it("L1 a L3: disjunktní zadání, L3 bez jmen zástupců", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3);
    expect(l3.filter((t) => q1.has(t.question))).toHaveLength(0);
    for (const i of l3.flatMap(polozky)) {
      for (const j of L1_JMENA) expect(i.toLowerCase().includes(j), `„${i}“ obsahuje „${j}“`).toBe(false);
    }
  });

  it("L3 používá všechny čtyři éry", () => {
    for (const t of topic.generator(3)) {
      expect(t.categories!.map((c) => c.name).sort()).toEqual([...ERY].sort());
    }
  });
});
