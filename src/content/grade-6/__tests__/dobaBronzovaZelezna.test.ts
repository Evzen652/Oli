import { describe, it, expect } from "vitest";
import { DOBA_BRONZOVA_ZELEZNA } from "../dejepis/dobaBronzovaZelezna";

/**
 * Doba bronzová a železná — categorize (kamenná / bronzová / železná).
 *
 * NEZÁVISLÝ SOLVER = klasifikátor klíčových slov napsaný tady, bez importu bank
 * ani klíčů z generátoru. Karta se zařadí podle kmenů v textu.
 *
 * Pravidlo kolize (zdokumentované): když karta obsahuje kmeny více dob, vyhrává
 * železná > bronzová > kamenná. Důvod: mladší doba věc NOVĚ přinesla, starší
 * materiál na kartě je jen kontext (např. „Kamenná licí forma" — kámen je tu
 * nástroj kovolitce, rozhoduje lití bronzu; „Tavení rudy v hliněné peci" —
 * rozhoduje ruda).
 *
 * Kmen „měd" je zúžený na „měď|mědi": holé „měd" chytalo „zemědělství" a
 * kamennou kartu o lovcích posílalo do doby bronzové.
 */
const topic = DOBA_BRONZOVA_ZELEZNA[0];
const K = "Doba kamenná";
const B = "Doba bronzová";
const Z = "Doba železná";

const KMENY: [string, RegExp][] = [
  [Z, /želez|kov[áa]rn|kování|kovan|kovadlin|rud[auy]|dýmač|zlevn|kelt|oppid|opevněné město|minc|ražb|peněz|hrnčířsk/iu],
  [B, /bronz|měď|mědi|cín|slitin|lití|licí|odlit|form|jantar|vzácnou surovinu|drah/iu],
  [K, /kámen|kamen|pazour|štíp|brouš|hornin|roztav|stády|kost|zrnotěr|poprvé pěstují|poprvé staví|první obdělávání|usazují|vypal/iu],
];

function solver(karta: string): string | null {
  for (const [kos, re] of KMENY) if (re.test(karta)) return kos;
  return null;
}

const karty = (level: number) =>
  topic.generator(level).flatMap((t) => t.categories!.flatMap((c) => c.items));

describe("Doba bronzová a železná — metadata", () => {
  it("dějepis g6, categorize, Pravěk, správné RVP", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("categorize");
    expect(topic.category).toBe("Pravěk");
    expect(topic.rvpNodeId).toBe("g6-dejepis-pravek-vyvoj-cloveka-doba-bronzova-a-zelezna-pocatky-civilizace");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Doba bronzová a železná — level %i", (level) => {
  const tasks = topic.generator(level);

  it("(h) všechny úlohy jsou categorize se třemi koši po dvou kartách", () => {
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("categorize");
      expect(t.options).toBeUndefined();
      expect(t.categories!.map((c) => c.name)).toEqual([K, B, Z]);
      for (const c of t.categories!) expect(c.items).toHaveLength(2);
      expect(new Set(t.categories!.flatMap((c) => c.items)).size).toBe(6);
      expect(t.explanation).toBeTruthy();
      expect(t.hints).toHaveLength(2);
    }
  });

  it("(a) SOLVER: každá karta padne do koše z klíče", () => {
    for (const t of tasks) {
      for (const c of t.categories!) {
        for (const item of c.items) {
          const s = solver(item);
          expect(s, `karta „${item}“ — solver nerozhodl`).not.toBeNull();
          expect(s, `karta „${item}“ je v „${c.name}“, solver říká „${s}“`).toBe(c.name);
        }
      }
    }
  });

  it("(c) aspoň 12 unikátních úloh (klíč = seřazená množina karet)", () => {
    const klice = new Set(tasks.map((t) => t.categories!.flatMap((c) => c.items).sort().join("|")));
    expect(klice.size).toBeGreaterThanOrEqual(12);
  });

  it("(e) nápovědy neobsahují text karty ani název koše a jsou pro úlohu unikátní", () => {
    const vsechnyKarty = karty(level);
    const h0 = new Set<string>();
    const h1 = new Set<string>();
    for (const t of tasks) {
      for (const h of t.hints!) {
        for (const k of vsechnyKarty) expect(h.includes(k), `nápověda obsahuje kartu „${k}“`).toBe(false);
        for (const n of [K, B, Z]) expect(h.toLowerCase().includes(n.toLowerCase()), `nápověda jmenuje koš ${n}`).toBe(false);
        expect(h.includes("categorize")).toBe(false);
      }
      h0.add(t.hints![0]);
      h1.add(t.hints![1]);
    }
    expect(h0.size).toBe(tasks.length);
    expect(h1.size).toBe(tasks.length);
  });

  it("(f) karty bez rodového lomítka a bez osamocené předložky", () => {
    for (const k of karty(level)) {
      expect(k.includes("/"), k).toBe(false);
      expect(/(^|\s)[zuvsk]\s*$/iu.test(k), k).toBe(false);
      expect(/\s[zuvsk]\s[zuvsk]\s/iu.test(k), k).toBe(false);
    }
  });

  it("(g) číslovky s podstatným jménem v explanation nejsou psané inline", () => {
    for (const t of tasks) {
      expect(/\b\d+\s+(kart|úloh|předmět|koš|činnost|situac)/iu.test(t.explanation!)).toBe(false);
    }
  });
});

describe("Doba bronzová a železná — gradace a disjunktnost", () => {
  it("(d) zadání L1/L2/L3 se liší a banky karet jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    for (const [x, y] of [[0, 1], [0, 2], [1, 2]]) {
      expect([...q[x]].filter((s) => q[y].has(s))).toHaveLength(0);
    }
    const b = [1, 2, 3].map((l) => new Set(karty(l)));
    for (const [x, y] of [[0, 1], [0, 2], [1, 2]]) {
      const spolecne = [...b[x]].filter((s) => b[y].has(s));
      expect(spolecne, `společné karty L${x + 1}∩L${y + 1}`).toHaveLength(0);
    }
  });

  it("L2 karty neobsahují název kovu bronz/železo, L3 jsou celé věty", () => {
    for (const k of karty(2)) expect(/bronz|želez/iu.test(k), k).toBe(false);
    for (const k of karty(3)) expect(/\.$/.test(k), k).toBe(true);
  });

  it("generátor je deterministický (nic se nelosuje)", () => {
    for (const l of [1, 2, 3]) {
      expect(JSON.stringify(topic.generator(l))).toBe(JSON.stringify(topic.generator(l)));
    }
  });
});
