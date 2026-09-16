import { describe, it, expect } from "vitest";
import { HMYZ_STAVBA_TELA_DRUHY_VYVOJ } from "../prirodopis/hmyzStavbaTelaDruhyVyvoj";
import type { PracticeTask } from "@/lib/types";

/**
 * Hmyz — stavba těla, druhy, vývoj (categorize).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta), bez importu banky generátoru:
 * - L1/L2: ručně sestavená tabulka jméno → skupina a jméno → proměna.
 * - L3: parser popisu přes regex znaků (nohy, části těla, kukla / svlékání).
 * Výsledek se porovná s košem v klíči.
 */
const topic = HMYZ_STAVBA_TELA_DRUHY_VYVOJ[0];

type Skupina = "hmyz" | "pavoukovec" | "stonozkovec" | "korys" | "jine";
const SKUPINA: Record<string, Skupina> = {
  "včela medonosná": "hmyz", mravenec: "hmyz", chroust: "hmyz", "slunéčko sedmitečné": "hmyz",
  "moucha domácí": "hmyz", komár: "hmyz", kobylka: "hmyz", vážka: "hmyz", čmelák: "hmyz",
  "babočka paví oko": "hmyz", šváb: "hmyz", blecha: "hmyz", veš: "hmyz",
  "pavouk křižák": "pavoukovec", klíště: "pavoukovec", sekáč: "pavoukovec", štír: "pavoukovec",
  stonožka: "stonozkovec", mnohonožka: "stonozkovec",
  "rak říční": "korys", stínka: "korys",
  žížala: "jine", hlemýžď: "jine",
};
type Promena = "dok" | "ned";
const PROMENA: Record<string, Promena> = {
  "babočka paví oko": "dok", "bělásek zelný": "dok", "včela medonosná": "dok", čmelák: "dok",
  mravenec: "dok", "moucha domácí": "dok", komár: "dok", chroust: "dok",
  "slunéčko sedmitečné": "dok", blecha: "dok", "mandelinka bramborová": "dok",
  "kobylka zelená": "ned", saranče: "ned", "cvrček polní": "ned", šváb: "ned", vážka: "ned",
  "šídlo modré": "ned", "veš dětská": "ned", mšice: "ned", "kněžice (ploštice)": "ned",
  "škvor obecný": "ned", jepice: "ned",
};

/** L3 A: je popsaný tvor hmyz? */
function parseTelo(s: string): "hmyz" | "neni" | null {
  const neni = /čtyři páry|hlavohru|bez tykadel|mnoho párů|na každém článku|dva páry nohou|pět párů|sedm párů/i.test(s);
  const hmyz = /tři páry|šest nohou|hlavy, hrudi a zadečku/i.test(s);
  if (neni === hmyz) return null;
  return hmyz ? "hmyz" : "neni";
}
/**
 * L3 B: dokonalá, nebo nedokonalá proměna? Klidové stadium (jedinec nežere,
 * je v obalu, přestavuje tělo) má přednost — svlékání se vyskytuje u obou typů.
 */
function parseVyvoj(s: string): Promena | null {
  if (/kukl|kukel|nehybn|zámot|přestan\p{L}* žrát|nežere|obal|přestav|ztuhne|ztvrdne|hedvábn/iu.test(s)) return "dok";
  if (/podobn|svlék|svlékn|jako (malý|zmenšen)|stejného tvaru/i.test(s)) return "ned";
  return null;
}

const KOS: Record<string, "hmyz" | "neni" | Promena> = {
  Hmyz: "hmyz",
  "Není hmyz": "neni",
  "Proměna dokonalá (s kuklou)": "dok",
  "Proměna nedokonalá (bez kukly)": "ned",
  "Proměna dokonalá": "dok",
  "Proměna nedokonalá": "ned",
};

const polozky = (t: PracticeTask) => t.categories!.flatMap((c) => c.items);
const serial = (t: PracticeTask) =>
  JSON.stringify(t.categories!.map((c) => [c.name, [...c.items].sort()]).sort());

function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function sSeedem<T>(seed: number, f: () => T): T {
  const puv = Math.random;
  Math.random = seeded(seed);
  try {
    return f();
  } finally {
    Math.random = puv;
  }
}

describe("Hmyz — metadata", () => {
  it("id, předmět, category/topic znak po znaku", () => {
    expect(topic.id).toBe("g6-pri-hmyz-stavba-tela-druhy-vyvoj-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.inputType).toBe("categorize");
    expect(topic.category).toBe("Biologie živočichů");
    expect(topic.topic).toBe("Bezobratlí - členovci (úvod)");
    expect(topic.title).toBe("Hmyz - stavba těla, druhy, vývoj");
    expect(topic.rvpNodeId).toBe(
      "g6-prirodopis-biologie-zivocichu-bezobratli-clenovci-uvod-hmyz-stavba-tela-druhy-vyvoj",
    );
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Hmyz — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 různých úloh", () => {
    expect(new Set(tasks.map(serial)).size).toBeGreaterThanOrEqual(12);
  });

  it("determinismus: stejný seed → stejné úlohy i po posunu globálního stavu", () => {
    const a = sSeedem(42, () => topic.generator(level).map(serial));
    for (let i = 0; i < 5; i++) topic.generator(level);
    const b = sSeedem(42, () => topic.generator(level).map(serial));
    expect(b).toEqual(a);
  });

  it("struktura: dva neprázdné koše, 6 unikátních položek", () => {
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("categorize");
      expect(t.categories).toHaveLength(2);
      for (const c of t.categories!) {
        expect(KOS[c.name]).toBeDefined();
        expect(c.items.length).toBeGreaterThan(0);
      }
      const it = polozky(t);
      expect(it).toHaveLength(6);
      expect(new Set(it).size).toBe(6);
    }
  });

  it("SOLVER: každá položka leží ve správném koši", () => {
    for (const t of tasks) {
      for (const c of t.categories!) {
        const cil = KOS[c.name];
        for (const item of c.items) {
          let vysl: string | null | undefined;
          if (level === 1) {
            const s = SKUPINA[item];
            vysl = s === undefined ? undefined : s === "hmyz" ? "hmyz" : "neni";
          } else if (level === 2) {
            vysl = PROMENA[item];
          } else if (cil === "hmyz" || cil === "neni") {
            vysl = parseTelo(item);
          } else {
            vysl = parseVyvoj(item);
          }
          expect(vysl, `„${item}“ v koši ${c.name}`).toBe(cil);
        }
      }
    }
  });

  it("nápovědy: dvě různé, bez položek a názvů košů", () => {
    for (const t of tasks) {
      expect(t.hints).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        for (const i of polozky(t)) expect(h.toLowerCase().includes(i.toLowerCase()), `hint obsahuje „${i}“`).toBe(false);
        for (const c of t.categories!) expect(h.toLowerCase().includes(c.name.toLowerCase()), `hint obsahuje „${c.name}“`).toBe(false);
      }
    }
  });

  it("vysvětlení zdůvodňuje každou položku (protože)", () => {
    for (const t of tasks) {
      for (const i of polozky(t)) {
        const kotva = `„${i.replace(/\.$/, "")}“`;
        const idx = t.explanation!.indexOf(kotva);
        expect(idx, `vysvětlení chybí u ${kotva}`).toBeGreaterThanOrEqual(0);
        expect(t.explanation!.slice(idx + kotva.length, idx + kotva.length + 70)).toMatch(/protože/);
      }
    }
  });
});

describe("Hmyz — pasti a gradace", () => {
  it("L1: v každé úloze aspoň jeden pavoukovec v koši „Není hmyz“", () => {
    for (const t of topic.generator(1)) {
      const neni = t.categories!.find((c) => c.name === "Není hmyz")!;
      expect(neni.items.some((i) => SKUPINA[i] === "pavoukovec")).toBe(true);
    }
  });

  it("L2: vážka, šídlo nebo jepice v koši nedokonalé proměny", () => {
    const tasks = topic.generator(2);
    const s = tasks.filter((t) =>
      t.categories!.find((c) => c.name === "Proměna nedokonalá (bez kukly)")!.items.some((i) => /vážka|šídlo|jepice/.test(i)),
    );
    expect(s.length).toBeGreaterThan(0);
  });

  it("L3 B: popisy proměny dokonalé neprozrazují kuklu slovem, nedokonalé neříkají „přímo“", () => {
    for (const t of topic.generator(3)) {
      for (const c of t.categories!) {
        if (c.name === "Proměna dokonalá") for (const i of c.items) expect(i).not.toMatch(/kukl|kukel/i);
        if (c.name === "Proměna nedokonalá") {
          for (const i of c.items) expect(i).not.toMatch(/přímo/i);
          expect(c.items.filter((i) => /vod|potok/i.test(i)).length).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it("L3: obě varianty, v jedné úloze se nemíchají", () => {
    const tasks = topic.generator(3);
    const varianty = new Set(tasks.map((t) => t.categories!.map((c) => c.name).sort().join("|")));
    expect(varianty).toEqual(new Set(["Hmyz|Není hmyz", "Proměna dokonalá|Proměna nedokonalá"]));
  });

  it("L3 popisy neobsahují jména živočichů z L1 ani L2", () => {
    const jmena = [...Object.keys(SKUPINA), ...Object.keys(PROMENA)].map((j) => j.split(" ")[0].toLowerCase());
    for (const i of topic.generator(3).flatMap(polozky)) {
      const slova = i.toLowerCase().split(/[^\p{L}]+/u);
      for (const j of jmena) expect(slova.includes(j), `„${i}“ obsahuje „${j}“`).toBe(false);
    }
  });

  it("zadání L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    for (const x of q[2]) {
      expect(q[0].has(x)).toBe(false);
      expect(q[1].has(x)).toBe(false);
    }
    for (const x of q[1]) expect(q[0].has(x)).toBe(false);
  });
});
