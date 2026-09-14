import { describe, it, expect } from "vitest";
import { NEOLITICKA_REVOLUCE } from "../dejepis/neolitickaRevoluce";
import type { PracticeTask } from "@/lib/types";

/**
 * Neolitická revoluce — faktický select_one.
 * NEZÁVISLÝ SOLVER (druhá cesta, klíč se čte jen pro porovnání):
 *  (1) L1 — atributová tabulka pojmů {rank období, původ mimo Starý svět / mimo ohnisko};
 *  (2) L2 — klasifikátor klíčových slov: oblast ze scénáře ↔ oblast možnosti;
 *  (3) L3 — orientovaný graf příčin a důsledků;
 *  (4) struktura: ≥12 unikátních, L1∩L3 = ∅, 4 možnosti, feedback, hinty, délka, první slovo.
 */
const topic = NEOLITICKA_REVOLUCE[0];

// ── (1) atributová tabulka období ─────────────────────────────────────────
// rank: 1 paleolit, 2 mezolit, 3 neolit, 4 bronz/eneolit, 5 železo/starověk, 6 středověk/novověk
interface Attr { rank: number; mimo?: boolean }
const POJMY: [RegExp, Attr][] = [
  [/mladší dob|trvale na jednom místě|kozu|kočku/, { rank: 3 }],
  [/starší dob|stěhoval|(?<!\p{L})stany|(?<!\p{L})psa(?!\p{L})/u, { rank: 1 }],
  [/střední dob/, { rank: 2 }],
  [/sedáv/, { rank: 0 }],
  [/kukuř|brambor|rajčat|fazol|arašíd|podzemnic|krocan|(?<!\p{L})lam/u, { rank: 6, mimo: true }],
  [/cukrov|králík|průmysl/, { rank: 6 }],
  [/rýž|sój|bavln|hedváb/, { rank: 3, mimo: true }],
  [/Čech a Moravy/, { rank: 3, mimo: true }],
  [/koně|kůň|slepic|velbloud|bronz|želez|mincí|kvádr|pyramid|stěhování národů/, { rank: 5 }],
  [/mamut|(?<!\p{L})sob|jeskyn|kočov|pěstní|harpun|ledovc|hominizace/u, { rank: 1 }],
  [/Úrodném půlměsíci|pšenic|ječmen|hrách|čočk|lnu|ovci|koza|tura|prase|broušen|kůlů|zásob|pazourkov|neolitická revoluce/u, { rank: 3 }],
];
function datace(s: string): Attr | null {
  const m = s.match(/(\d[\d ]*)\s*(př\. n\. l\.|n\. l\.|lety)/);
  if (!m) return null;
  const n = +m[1].replace(/\s/g, "");
  const bc = m[2] === "lety" ? n - 2000 : m[2] === "n. l." ? -n : n;
  if (bc >= 13000) return { rank: 1 };
  if (bc >= 4000) return { rank: 3 };
  if (bc >= 0) return { rank: 5 };
  return { rank: 6 };
}
function attr(o: string): Attr | null {
  const d = datace(o);
  if (d) return d;
  for (const [re, a] of POJMY) if (re.test(o)) return a;
  return null;
}
function solveL1(t: PracticeTask): string {
  const at = (o: string) => {
    const a = attr(o);
    if (!a) throw new Error(`L1 nerozpoznaný pojem: "${o}"`);
    return a;
  };
  // „jako první" = nejstarší ochočení (nejnižší rank), jinak znak neolitu (rank 3, ze Starého světa)
  const nejmensi = Math.min(...t.options!.map((o) => at(o).rank));
  const kand = t.options!.filter((o) => {
    const a = at(o);
    return /jako první/.test(t.question) ? a.rank === nejmensi : a.rank === 3 && !a.mimo;
  });
  expect(kand, `L1 solver nenašel právě jednu: ${t.question} → ${kand}`).toHaveLength(1);
  return kand[0];
}

// ── (2) klasifikátor oblastí pro L2 ──────────────────────────────────────
const OBLAST_MOZNOSTI: [RegExp, string][] = [
  [/bronz|želez|kelt|kov|mincí|chrám|oppid|koní|slepic/i, "POZDE"],
  [/dlouhý dům|domě z kůlů/, "BYDLENI"],
  [/zeměděl|mladší dob|neolit/, "NEOLIT"],
  [/chov/, "CHOV"],
  [/kácel/, "KACENI"],
  [/tkaní|předení/, "TKANI"],
  [/hrnčíř/, "KERAMIKA"],
  [/zásob|usedl/u, "ZASOBY"],
  [/(?<!\p{L})lov|lovci|ulovil|mamut|(?<!\p{L})sob|harpun|kočov|jeskyn|štíp|(?<!\p{L})stan|starší dob|střední dob|paleolit|mezolit/u, "LOVCI"],
  [/pěstov|obilí/, "PESTOVANI"],
  [/podneb/, "PRIRODA"],
];
function oblastScenare(q: string): string[] {
  if (/období|Kým byl|Kdo tu žil/.test(q)) {
    return /kosti jelenů|harpun|sobů|žádné střepy/.test(q) ? ["LOVCI"] : ["NEOLIT"];
  }
  const pravidla: [RegExp, string[]][] = [
    [/sobů|stany z kůží/, ["LOVCI"]],
    [/ubylo stromů/, ["KACENI"]],
    [/kosti ovcí|kosti tura|ohrad/, ["CHOV"]],
    [/zrnotěrk/, ["PESTOVANI"]],
    [/přeslen|tkanin/, ["TKANI"]],
    [/vypaluje/, ["KERAMIKA"]],
    [/nádob/, ["ZASOBY"]],
    [/kůl/, ["BYDLENI"]],
    [/první zemědělci/, ["NEOLIT", "BYDLENI"]],
  ];
  for (const [re, o] of pravidla) if (re.test(q)) return o;
  throw new Error(`L2 nerozpoznaný scénář: ${q}`);
}
function oblastMoznosti(o: string): string {
  for (const [re, ob] of OBLAST_MOZNOSTI) if (re.test(o)) return ob;
  throw new Error(`L2 nerozpoznaná možnost: "${o}"`);
}
function solveL2(t: PracticeTask): string {
  const cil = oblastScenare(t.question);
  const kand = t.options!.filter((o) => cil.includes(oblastMoznosti(o)));
  expect(kand, `L2 solver: ${t.question} → ${kand}`).toHaveLength(1);
  return kand[0];
}

// ── (3) graf příčin a důsledků pro L3 ────────────────────────────────────
const HRANY: Record<string, string[]> = {
  VYCERPANI: ["NOVA_POLE"],
  ZEMEDELSTVI: ["USEDLOST", "KACENI", "ZASOBY", "ZMENA", "VLASTNICTVI"],
  USEDLOST: ["BYDLENI", "ZASOBY"],
  ZASOBY: ["KERAMIKA", "PREBYTKY", "RUST", "PREZITI"],
  PREBYTKY: ["DELBA", "MAJETEK"],
  MAJETEK: ["SPORY"],
  VLASTNICTVI: ["SPORY"],
  KACENI: ["SEKERA"],
  ZMENA: ["REVOLUCE"],
};
const UZEL_MOZNOSTI: [RegExp, string][] = [
  [/vládl/, "POLITIKA"],
  [/lehčí práce/, "LEHKOST"],
  [/zasít/, "SETI"],
  [/zalévání/, "VODA"],
  [/jíst maso/, "MASO"],
  [/oteplilo/, "OTEPLENI"],
  [/zdravější/, "ZDRAVI"],
  [/nemoci/, "NEMOCI"],
  [/volného času/, "VOLNO"],
  [/nádoby a sekery|sekery nešly/, "NASTROJE"],
  [/jednu zimu/, "DOMY_KRATKE"],
  [/přestat pracovat/, "NICNEDELANI"],
  [/přestat chovat/, "BEZCHOVU"],
  [/sklízet obilí/, "SKLIZEN"],
  [/odchod celé vesnice/, "STEHOVANI"],
  [/hradb/, "MESTA"],
  [/úroda/, "VYCERPANI"],
  [/jeden vynálezce/, "NAHLE"],
  [/svrhli/, "POLITIKA"],
  [/dnešních Čech/, "EVROPA"],
  [/změnil způsob života/u, "ZMENA"],
  [/nejdřív vynalezli nádoby|vyrobit nádoby, aby/, "NADOBY_PRED_POLEM"],
  [/nejdřív postavili domy/, "DOMY_PRED_POLEM"],
  [/rozrostl/, "LES_ROSTE"],
  [/měst|král|palác|bank|peněz/, "MESTA"],
  [/bronz|želez|měď|kov|minc|stříbr/, "POZDE"],
  [/ledov/, "LEDOVA"],
  [/(?<!\p{L})lov|lovci|mamut|(?<!\p{L})sob|(?<!\p{L})stan|jeskyn|kočov|pěstní|štíp|zvěř/u, "LOVCI"],
  [/ochočení|pěstování obilí/, "ZEMEDELSTVI"],
  [/usedlému životu/, "USEDLOST"],
  [/přebyt/, "PREBYTKY"],
  [/řemesl|směn|výměn/, "DELBA"],
  [/vlastnit|hromadit/, "VLASTNICTVI"],
  [/majet|bohatší/, "MAJETEK"],
  [/počtu lidí/, "RUST"],
  [/kácel|vykácet|kácení/, "KACENI"],
  [/stálých vesnic/, "USEDLOST"],
  [/domy|domů/, "BYDLENI"],
  [/nádob/, "KERAMIKA"],
  [/přežití zimy/, "PREZITI"],
  [/zásob|vydržet/u, "ZASOBY"],
  [/pole a stáda/, "ZEMEDELSTVI"],
];
function uzel(o: string): string {
  for (const [re, u] of UZEL_MOZNOSTI) if (re.test(o)) return u;
  throw new Error(`L3 nerozpoznaná možnost: "${o}"`);
}
function dosazitelne(z: string): Set<string> {
  const out = new Set<string>();
  const fronta = [...(HRANY[z] ?? [])];
  while (fronta.length) {
    const u = fronta.shift()!;
    if (out.has(u)) continue;
    out.add(u);
    fronta.push(...(HRANY[u] ?? []));
  }
  return out;
}
function rozborOtazky(q: string): { mode: "cause" | "effect" | "not"; node: string } {
  if (/NENÍ|NEVYPLÝVÁ/.test(q)) {
    const node = /usadili/.test(q) ? "USEDLOST" : /zásoby jídla/.test(q) ? "ZASOBY"
      : /přebytky/.test(q) ? "PREBYTKY" : /přechodu k zemědělství/.test(q) ? "ZEMEDELSTVI" : "";
    return { mode: "not", node };
  }
  if (/^Proč/.test(q)) {
    const pravidla: [RegExp, string][] = [
      [/revoluce/, "REVOLUCE"], [/nová pole/, "NOVA_POLE"], [/hliněné nádoby/, "KERAMIKA"], [/počet lidí/, "RUST"],
      [/spory o majetek/, "SPORY"], [/na jednom místě/, "USEDLOST"], [/řemeslu/, "DELBA"], [/sekery/, "SEKERA"],
    ];
    for (const [re, n] of pravidla) if (re.test(q)) return { mode: "cause", node: n };
  } else {
    const pravidla: [RegExp, string][] = [
      [/víc obilí, než/, "PREBYTKY"], [/pro krajinu/, "ZEMEDELSTVI"], [/usadili/, "USEDLOST"],
    ];
    for (const [re, n] of pravidla) if (re.test(q)) return { mode: "effect", node: n };
  }
  throw new Error(`L3 nerozpoznaná otázka: ${q}`);
}
function solveL3(t: PracticeTask): string {
  const { mode, node } = rozborOtazky(t.question);
  expect(node, t.question).toBeTruthy();
  const kand = t.options!.filter((o) => {
    const u = uzel(o);
    if (mode === "cause") return (HRANY[u] ?? []).includes(node);
    if (mode === "effect") return (HRANY[node] ?? []).includes(u);
    return !dosazitelne(node).has(u);
  });
  expect(kand, `L3 solver: ${t.question} → ${kand}`).toHaveLength(1);
  return kand[0];
}

const SOLVER: Record<number, (t: PracticeTask) => string> = { 1: solveL1, 2: solveL2, 3: solveL3 };
const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");

describe("Neolitická revoluce — metadata", () => {
  it("dějepis g6, select_one, Pravěk / Vývoj člověka", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Pravěk");
    expect(topic.topic).toBe("Vývoj člověka");
    expect(topic.rvpNodeId).toBe("g6-dejepis-pravek-vyvoj-cloveka-neoliticka-revoluce-zemedelstvi-chov-dobytka");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Neolitická revoluce — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních textů otázek", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, klíč mezi nimi, feedback ke všem distraktorům", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options).toContain(t.correctAnswer);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback "${d}"`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("klíč není v otázce ani v nápovědách; dvě různé nápovědy", () => {
    for (const t of tasks) {
      expect(t.question).not.toContain(t.correctAnswer);
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s druhou cestou", () => {
    for (const t of tasks) expect(SOLVER[level](t), t.question).toBe(t.correctAnswer);
  });

  it("klíč nevyčnívá tvarem: stejné první slovo distraktorů ⇒ i klíč", () => {
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(jine).size === 1 && jine[0].length >= 3) {
        expect(prvni(t.correctAnswer), t.question).toBe(jine[0]);
      }
    }
  });

  it("klíč není systematicky nejdelší", () => {
    const vycniva = tasks.filter((t) => {
      const max = Math.max(...t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length));
      return t.correctAnswer.length > max;
    });
    expect(vycniva.length, vycniva.map((t) => t.question).join("\n")).toBeLessThanOrEqual(tasks.length / 2);
  });

  it("velká nápověda je autorská, ne doplněná obecnou větou z _shared", () => {
    for (const t of tasks) {
      expect(t.hints![1], t.question).not.toMatch(/Vylučuj možnosti, které odporují|Nejdřív škrtni tu/);
    }
  });

  it("klíč není nejdelší ani na L3 (délka neprozrazuje)", () => {
    if (level !== 3) return;
    for (const t of tasks) {
      const max = Math.max(...t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length));
      expect(t.correctAnswer.length, t.question).toBeLessThanOrEqual(max);
    }
  });

  it("datace v klíči obsahují asi/kolem; žádné lomítkové rodové tvary", () => {
    for (const t of tasks) {
      if (/\d/.test(t.correctAnswer)) expect(t.correctAnswer).toMatch(/asi|kolem/);
      const vse = [t.question, ...t.options!, ...t.hints!, t.explanation].join(" ");
      expect(vse, t.question).not.toMatch(/\p{L}\/\p{L}/u);
    }
  });
});

describe("Neolitická revoluce — gradace", () => {
  it("L1 a L3 mají disjunktní znění; L3 má nejvýš 4 obrácené otázky; hinty unikátní v tématu", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3);
    expect(l3.filter((t) => q1.has(t.question))).toHaveLength(0);
    expect(l3.filter((t) => /NENÍ|NEVYPLÝVÁ/.test(t.question)).length).toBeLessThanOrEqual(4);
    const vsechny = [1, 2, 3].flatMap((l) => topic.generator(l)).flatMap((t) => t.hints!);
    expect(new Set(vsechny).size).toBe(vsechny.length);
  });
});
