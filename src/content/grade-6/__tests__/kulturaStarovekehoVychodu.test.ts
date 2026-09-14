import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { KULTURA_STAROVEKEHO_VYCHODU } from "../dejepis/kulturaStarovekehoVychodu";

/**
 * Náboženství, vědy a kultura starověkého Východu — categorize.
 *
 * NEZÁVISLÝ SOLVER: klasifikátor klíčových slov napsaný odděleně od banky.
 * Každá položka musí trefit právě jednu civilizaci a ta se musí shodovat
 * s košem v klíči. 0 nebo 2 zásahy = nejednoznačná položka.
 */
const topic = KULTURA_STAROVEKEHO_VYCHODU[0];
const M = "Mezopotámie";
const E = "Egypt";
const F = "Fénicie a Palestina";

const STOPY: Record<string, RegExp[]> = {
  [M]: [/klín/i, /hlině/i, /cihe?l/i, /zikkurat/i, /gilgameš/i, /chammurapi/i, /šedesát/i, /60 minut/i, /360/, /zvěrokruh/i, /marduk/i, /ištar/i, /eufrat/i, /tigri/i, /pečet/i],
  [E]: [/nil/i, /papyr/i, /hieroglyf/i, /pyramid/i, /mumi/i, /balzam/i, /kniha mrtvých/i, /usir/i, /(^|[^A-Za-zÁ-ž])Re([^A-Za-zÁ-ž]|$)/, /isis/i, /sírius/i, /365/, /vyměřov/i, /faraon/i, /pírk/i, /špičk/i, /služebník/i],
  [F]: [/hlásk/i, /abeced/i, /22 znak/i, /jediného boha/i, /hebrej/i, /star(ý|ého) zákon/i, /mojžíš/i, /purpur/i, /přikázání/i, /sedmý den/i, /zobrazovat/i, /Žid/, /otroctví/i, /žalm/i],
};

function classify(item: string): string[] {
  return Object.entries(STOPY)
    .filter(([, res]) => res.some((re) => re.test(item)))
    .map(([civ]) => civ);
}

const dedupKey = (t: { categories?: { name: string; items: string[] }[] }) =>
  t.categories!.map((c) => `${c.name}:${[...c.items].sort().join("+")}`).join("|");

describe("Kultura starověkého Východu — metadata", () => {
  it("topic a category znak po znaku podle rvp_data.json", () => {
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const text = JSON.stringify(rvp);
    expect(text.includes(topic.rvpNodeId!)).toBe(true);
    expect(topic.topic).toBe("Nejstarší státy - Mezopotámie a Egypt");
    expect(topic.topic.includes("-")).toBe(true);
    expect(topic.topic.includes("–")).toBe(false);
    expect(topic.category).toBe("Starověk");
    expect(text.includes(`"topic": "${topic.topic}"`) || text.includes(`"topic":"${topic.topic}"`)).toBe(true);
    expect(topic.inputType).toBe("categorize");
    expect(topic.subject).toBe("dejepis");
  });
});

describe.each([1, 2, 3])("Kultura starověkého Východu — level %i", (level) => {
  const tasks = topic.generator(level);

  it("categorize struktura a počty košů/položek", () => {
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("categorize");
      expect(t.options).toBeUndefined();
      const names = t.categories!.map((c) => c.name).sort();
      expect(names).toEqual(level === 1 ? [E, M].sort() : [E, F, M].sort());
      for (const c of t.categories!) expect(c.items).toHaveLength(2);
    }
  });

  it("SOLVER: každá položka trefí právě jednu civilizaci = koš v klíči", () => {
    for (const t of tasks) {
      for (const c of t.categories!) {
        for (const item of c.items) {
          const hit = classify(item);
          expect(hit, `„${item}“ → ${hit}`).toHaveLength(1);
          expect(hit[0], `„${item}“`).toBe(c.name);
        }
      }
    }
  });

  it("≥12 unikátních úloh", () => {
    expect(new Set(tasks.map(dedupKey)).size).toBeGreaterThanOrEqual(12);
  });

  it("nápovědy neobsahují položky ani názvy košů a liší se", () => {
    for (const t of tasks) {
      const [h0, h1] = t.hints!;
      expect(h0).not.toBe(h1);
      const items = t.categories!.flatMap((c) => c.items);
      for (const h of t.hints!) {
        for (const it of items) expect(h.includes(it), `hint obsahuje „${it}“`).toBe(false);
        for (const c of t.categories!) expect(h.includes(c.name), `hint obsahuje koš ${c.name}`).toBe(false);
      }
    }
  });

  it("zadání neobsahuje položku; explanation uvádí stopu u každé položky", () => {
    for (const t of tasks) {
      for (const c of t.categories!) {
        for (const it of c.items) {
          expect(t.question.includes(it)).toBe(false);
          const core = it.replace(/\.$/, "");
          const idx = t.explanation!.indexOf(core);
          expect(idx).toBeGreaterThanOrEqual(0);
          const seg = t.explanation!.slice(idx).split("“ patří do skupiny ")[1] ?? "";
          const proc = seg.slice(c.name.length + 2).split(".")[0];
          expect(seg.startsWith(c.name)).toBe(true);
          expect(proc.trim().length, `explanation bez stopy u „${it}“`).toBeGreaterThan(10);
        }
      }
    }
  });
});

describe("Kultura starověkého Východu — gradace", () => {
  it("položky L1 disjunktní s L3, zadání L1 ≠ L3", () => {
    const l1 = topic.generator(1);
    const l3 = topic.generator(3);
    const i1 = new Set(l1.flatMap((t) => t.categories!.flatMap((c) => c.items)));
    const i3 = l3.flatMap((t) => t.categories!.flatMap((c) => c.items));
    expect(i3.filter((i) => i1.has(i))).toHaveLength(0);
    const q1 = new Set(l1.map((t) => t.question));
    expect(l3.filter((t) => q1.has(t.question))).toHaveLength(0);
  });

  it("L3: každá úloha má klamavou stupňovitou stavbu a písmo na kameni", () => {
    for (const t of topic.generator(3)) {
      const items = t.categories!.flatMap((c) => c.items);
      expect(items.some((i) => /cihe?l/i.test(i) && /chrám|svatyn/i.test(i))).toBe(true);
      expect(items.some((i) => /kamen|kameni/i.test(i) && /písm|nápis/i.test(i))).toBe(true);
    }
  });
});
