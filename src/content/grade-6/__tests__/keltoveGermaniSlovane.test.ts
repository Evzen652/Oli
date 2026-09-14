import { describe, it, expect } from "vitest";
import { KELTOVE_GERMANI_SLOVANE } from "../dejepis/keltoveGermaniSlovane";
import { prirazeniVeVete, PRAH_KOTVY } from "@/lib/hintLeakStructured";

/**
 * Keltové, Germáni, Slované — categorize, FAKTICKÝ vzor.
 *
 * NEZÁVISLÉ SOLVERY (druhá cesta, neimportují banku):
 *  • L1/L2: klasifikátor klíčových slov z faktů učebnice — každá karta musí trefit
 *    právě jeden koš a ten musí být deklarovaný.
 *  • L3: časový solver — z textu karty vyčte letopočet, kotvu (Marek Aurelius,
 *    zánik Západořímské říše) nebo vztah k jinému národu a přes rank-tabulku
 *    příchodu určí národ. Všechny nalezené signály se musí shodnout.
 */
const topic = KELTOVE_GERMANI_SLOVANE[0];
const KOSE = ["Germáni", "Keltové", "Slované"];

// ── Solver 1: klíčová slova (L1, L2) ──────────────────────────────────────
const KW: Record<string, RegExp> = {
  Keltové: /Bój|oppid|druid|duhovk|Stradonic|mince|kněž|pojmenovali Čechy|na kruhu|vlastními penězi/i,
  Germáni: /Markoman|Kvád|Marobud|markomansk|doba římská|\bkrál|válčil s Římany|války s Římem|sousední velké říše|přivezené z Říma/i,
  Slované: /polozemnic|pražského typu|Perun|žďář|zapuštěné do země|z východu|vypalováním lesa|tvarované rukou|Poláků|předkem dnešní češtiny/i,
};
const classify = (item: string) => Object.entries(KW).filter(([, re]) => re.test(item)).map(([n]) => n);

// ── Solver 2: časová osa + rank (L3) ─────────────────────────────────────
const PRICHOD: Record<string, number> = { Keltové: -400, Germáni: 0, Slované: 550 };
const RANK: Record<string, number> = { Keltové: 1, Germáni: 2, Slované: 3 };
const PODLE_RANKU = ["", "Keltové", "Germáni", "Slované"];
const TVAR: Record<string, string> = {
  Keltech: "Keltové", Keltové: "Keltové",
  Germáni: "Germáni", Germánech: "Germáni", Germány: "Germáni", Germánů: "Germáni",
  Slované: "Slované", Slovany: "Slované", Slovanů: "Slované",
};
const KOTVY: [RegExp, number][] = [[/Marka Aurelia/, 170]];

function narodVRoce(y: number): string | null {
  // hraniční roky (±50 let od příchodu) jsou sporné → solver je odmítne
  if (Object.values(PRICHOD).some((p) => Math.abs(y - p) < 50)) return null;
  const pred = Object.entries(PRICHOD).filter(([, p]) => p <= y).sort((a, b) => b[1] - a[1]);
  return pred[0]?.[0] ?? null;
}

function solveL3(text: string): string[] {
  const out: string[] = [];
  const era = (s: string) => (s.startsWith("př") ? -1 : 1);
  let m = text.match(/kolem roku (\d+) (př\. n\. l\.|n\. l\.)/);
  if (m) out.push(narodVRoce(era(m[2]) * Number(m[1])) ?? "SPORNÉ");
  m = text.match(/(\d+)\. století (př\. n\. l\.|n\. l\.)/);
  if (m) out.push(narodVRoce(era(m[2]) * (Number(m[1]) * 100 - 50)) ?? "SPORNÉ");
  // dvoukrokové kotvy: „před těmi / po těch, proti nimž táhla vojska Marka Aurelia"
  const vztah = text.match(/(před těmi|po těch), proti nimž táhla vojska Marka Aurelia$/);
  for (const [re, rok] of KOTVY) {
    if (!re.test(text)) continue;
    const kotva = narodVRoce(rok);
    if (!kotva) out.push("SPORNÉ");
    else if (vztah) out.push(PODLE_RANKU[RANK[kotva] + (vztah[1] === "před těmi" ? -1 : 1)] || "SPORNÉ");
    else out.push(kotva);
  }
  m = text.match(/(\d+) let po zániku Západořímské říše/);
  if (m) out.push(narodVRoce(476 + Number(m[1])) ?? "SPORNÉ");
  if (/Nejstarší/.test(text)) out.push(PODLE_RANKU[1]);
  if (/jako poslední|nejpozději/.test(text)) out.push(PODLE_RANKU[3]);
  m = text.match(/dřív než (\S+) i (\S+)$/);
  if (m) out.push(PODLE_RANKU[Math.min(RANK[TVAR[m[1]]], RANK[TVAR[m[2]]]) - 1]);
  m = text.match(/po (\S+), ale před (\S+)$/);
  if (m && RANK[TVAR[m[2]]] - RANK[TVAR[m[1]]] === 2) out.push(PODLE_RANKU[RANK[TVAR[m[1]]] + 1]);
  m = text.match(/těsně před příchodem (\S+)$/);
  if (m) out.push(PODLE_RANKU[RANK[TVAR[m[1]]] - 1]);
  m = text.match(/až po (Keltech|Germánech)$/);
  if (m) out.push(PODLE_RANKU[RANK[TVAR[m[1]]] + 1]);
  return out;
}

/** Stonky termínů L1 (z učebnice, ne z banky) — nesmí se objevit v kartách L2/L3. */
const L1_TERMINY = [
  "Bój", "oppid", "druid", "duhovk", "Stradonic", "Markoman", "Kvád", "Marobud",
  "markomansk", "doba římská", "polozemnic", "pražského typu", "Perun", "žďář",
];

const karty = (t: ReturnType<typeof topic.generator>[number]) => t.categories!.flatMap((c) => c.items);
const POCET: Record<number, number> = { 1: 4, 2: 5, 3: 6 };

describe("Keltové, Germáni, Slované — metadata", () => {
  it("dějepis g6, categorize, Pravěk", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("categorize");
    expect(topic.category).toBe("Pravěk");
    expect(topic.topic).toBe("Pravěk na našem území");
    expect(topic.rvpNodeId).toBe("g6-dejepis-pravek-pravek-na-nasem-uzemi-keltove-germani-slovane-prichod");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Keltové, Germáni, Slované — level %i", (level) => {
  const tasks = topic.generator(level);

  it("struktura: tři neprázdné koše, správný počet karet, bez duplicit", () => {
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("categorize");
      expect(t.categories!.map((c) => c.name).sort()).toEqual(KOSE);
      for (const c of t.categories!) expect(c.items.length, `${c.name} prázdný`).toBeGreaterThan(0);
      const k = karty(t);
      expect(k).toHaveLength(POCET[level]);
      expect(new Set(k).size).toBe(k.length);
    }
  });

  it("≥12 různých úloh, deterministicky", () => {
    const klic = (t: (typeof tasks)[number]) => [...karty(t)].sort().join("|");
    expect(new Set(tasks.map(klic)).size).toBeGreaterThanOrEqual(12);
    expect(topic.generator(level).map(klic)).toEqual(tasks.map(klic));
  });

  it(level < 3 ? "SOLVER klíčová slova: každá karta trefí právě svůj koš" : "SOLVER časová osa + rank: každá karta vede k jednomu národu = klíč", () => {
    for (const t of tasks) {
      for (const c of t.categories!) {
        for (const item of c.items) {
          const hits = level < 3 ? classify(item) : [...new Set(solveL3(item))];
          expect(hits.length, `„${item}“ → ${hits}`).toBe(1);
          expect(hits[0], `„${item}“ je v ${c.name}, solver říká ${hits[0]}`).toBe(c.name);
        }
      }
    }
  });

  it("nápovědy: dvě různé, bez textu karet, bez přiřazení karta → národ", () => {
    for (const t of tasks) {
      const h = t.hints ?? [];
      expect(h.length).toBe(2);
      expect(h[0]).not.toBe(h[1]);
      for (const hint of h) {
        for (const item of karty(t)) expect(hint.includes(item), `nápověda cituje „${item}“`).toBe(false);
        expect(prirazeniVeVete(hint, t.categories!).length).toBeLessThanOrEqual(PRAH_KOTVY - 1);
      }
    }
    expect(new Set(tasks.map((t) => t.hints![0])).size).toBeGreaterThan(1);
  });

  it("vysvětlení pokrývá každou kartu a řekne, ke komu patří", () => {
    for (const t of tasks) {
      for (const c of t.categories!) {
        for (const item of c.items) expect(t.explanation).toContain(`„${item}“ patří`);
      }
      const texts = [t.question, t.explanation!, ...(t.hints ?? [])].join(" ");
      expect(texts, "rodové lomítko").not.toMatch(/\p{L}\/\p{L}/u);
    }
  });
});

describe("Keltové, Germáni, Slované — gradace", () => {
  const all = (l: number) => topic.generator(l);
  it("zadání L1, L2, L3 jsou různá", () => {
    const q = [1, 2, 3].map((l) => new Set(all(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
  });
  it("karty L2 a L3 neobsahují termín z L1 a L3 necituje L2", () => {
    const l2 = new Set(all(2).flatMap(karty));
    for (const lvl of [2, 3]) {
      for (const item of new Set(all(lvl).flatMap(karty))) {
        for (const term of L1_TERMINY) expect(item.includes(term), `L${lvl} „${item}“ obsahuje ${term}`).toBe(false);
        if (lvl === 3) expect(l2.has(item)).toBe(false);
      }
    }
    const l1 = new Set(all(1).flatMap(karty));
    for (const item of new Set(all(3).flatMap(karty))) expect(l1.has(item)).toBe(false);
  });
  it("L3 obsahuje obě pasti: stejné číslo století př. n. l. i n. l.", () => {
    const l3 = new Set(all(3).flatMap(karty));
    expect([...l3].some((x) => /3\. století př\. n\. l\./.test(x))).toBe(true);
    expect([...l3].some((x) => /3\. století n\. l\./.test(x))).toBe(true);
  });
});
