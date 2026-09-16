import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MEKKYSI_PLZI_MLZI_HLAVONOZCI } from "../prirodopis/mekkysiPlziMlziHlavonozci";
import type { PracticeTask } from "@/lib/types";

/**
 * Měkkýši — plži, mlži, hlavonožci (faktický select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, nesahá na data generátoru):
 *  (1) KLASIFIKÁTOR — ze ZNĚNÍ popisu vytáhne znaky a sám určí skupinu
 *      (dvě misky / filtruje / nemá hlavu → mlži; chapadla / přísavky /
 *      vystřikování / tmavý oblak → hlavonožci; ulita / jednodílná / závit /
 *      tykadla na hlavě / sliz / plazí se po → plži).
 *  (2) ZASTUPCI — vlastní tabulka zástupce → skupina (1. i 2. pád).
 *  (3) CLAIMS — zbylá znění → vzor jediné správné možnosti.
 * Ve všech případech musí vyhovět PRÁVĚ jedna možnost a ta = correctAnswer.
 */
const topic = MEKKYSI_PLZI_MLZI_HLAVONOZCI[0];

type G = "plži" | "mlži" | "hlavonožci";

// ── (1) KLASIFIKÁTOR ────────────────────────────────────────────────────────
const ZNAKY: Record<G, RegExp[]> = {
  "mlži": [/dvou misek/, /dvoudíl/, /filtruj/, /nemá hlavu/],
  "hlavonožci": [/chapad/, /přísav/, /vystřik/, /inkoust|tmavý oblak/],
  "plži": [/jednodíl/, /závit/, /\bulit/, /hlavě (má )?tykadl/, /slizov/, /plazí se po/],
};
const klasifikuj = (q: string): G => {
  const skore = (Object.keys(ZNAKY) as G[]).map((g) => ({ g, s: ZNAKY[g].filter((re) => re.test(q)).length }));
  skore.sort((a, b) => b.s - a.s);
  expect(skore[0].s, `klasifikátor bez znaku: ${q}`).toBeGreaterThan(0);
  expect(skore[0].s, `klasifikátor nerozhodl: ${q}`).toBeGreaterThan(skore[1].s);
  return skore[0].g;
};
const jePopis = (q: string) => /Do které skupiny patří\?$|Kam ho zařadíš\?$/.test(q);

// ── (2) ZASTUPCI ────────────────────────────────────────────────────────────
const ZASTUPCI: [string, string, G][] = [
  ["hlemýžď zahradní", "hlemýždě zahradního", "plži"],
  ["plzák", "plzáka", "plži"],
  ["páskovka", "páskovky", "plži"],
  ["plovatka bahenní", "plovatky bahenní", "plži"],
  ["okružák", "okružáka", "plži"],
  ["škeble rybničná", "škeble rybničné", "mlži"],
  ["velevrub", "velevruba", "mlži"],
  ["slávka jedlá", "slávky jedlé", "mlži"],
  ["ústřice", "ústřice", "mlži"],
  ["perlorodka říční", "perlorodky říční", "mlži"],
  ["sépie", "sépie", "hlavonožci"],
  ["chobotnice", "chobotnice", "hlavonožci"],
  ["oliheň", "olihně", "hlavonožci"],
];
const podleJmena = new Map(ZASTUPCI.map(([n, , g]) => [n, g]));
/** 2. pád, který musí stát v nápovědě „schránka …“. */
const genPodleJmena = new Map(ZASTUPCI.map(([n, gen]) => [n, gen]));
const AKUZATIV: Record<string, G> = { "plže": "plži", "mlže": "mlži", "hlavonožce": "hlavonožci" };
const SCHRANKA: Partial<Record<G, RegExp>> = { "plži": /^ulitu z jednoho kusu$/, "mlži": /^schránku ze dvou misek$/ };

// ── (3) CLAIMS ──────────────────────────────────────────────────────────────
const CLAIMS: [RegExp, (o: string) => boolean][] = [
  // L1 části těla
  [/po které se hlemýžď pomalu plazí/, (o) => o === "noha"],
  [/vytváří schránku\?$/, (o) => o === "plášť"],
  [/dýchá škeble rybničná pod vodou/, (o) => /^žábr/.test(o)],
  [/dýchá hlemýžď zahradní na souši/, (o) => /plicn/.test(o)],
  [/na chapadlech\?$/, (o) => /přísav/.test(o)],
  [/seškrabává potravu z rostlin/, (o) => /jazyk/.test(o)],
  [/má hlemýžď zahradní oči/, (o) => /tykadl/.test(o)],
  [/uzavře ulitu na zimu/, (o) => /víčk/.test(o)],
  // L2
  [/unikají nepříteli/, (o) => /inkoust/.test(o)],
  [/perleť\. Která část těla/, (o) => o === "plášť"],
  [/slizovou stopu\. Čím se pohybuje/, (o) => /noh/.test(o)],
  [/inkoustová žláza/, (o) => /útěk/.test(o)],
  [/přijímá potravu škeble/, (o) => /filtr/.test(o)],
  [/potravu hlemýžď zahradní/, (o) => /jazyk/.test(o)],
  [/potravu chobotnice/, (o) => /loví/.test(o)],
  [/plži, mlži i hlavonožci společný/, (o) => /nečlánkovan/.test(o)],
  [/plži a hlavonožci, ale mlži ne/, (o) => /hlav/.test(o)],
  [/^Kde žijí hlavonožci/, (o) => /^jen v moři/.test(o)],
  [/schránka plže od schránky mlže/, (o) => /^plž má ulitu, mlž dvě misky$/.test(o)],
  // L3
  [/slávka je plž/, (o) => /dvě misky/.test(o) && /mlž/.test(o)],
  [/chobotnice není měkkýš/, (o) => /nečlánkovan/.test(o)],
  [/plzák patří ke kroužkovcům/, (o) => /nečlánkovan/.test(o) && /nohu/.test(o)],
  [/sépie je obratlovec/, (o) => /vnitřní schránka/.test(o)],
  [/mlž nepotřebuje hlavu/, (o) => /filtruje/.test(o)],
  [/hlavonožci potřebují dobře vyvinuté oči/, (o) => /dravci/.test(o)],
  [/plž vylučuje sliz/, (o) => /vyschnutí/.test(o)],
  [/chovat sépii v akváriu s vodou z kohoutku/, (o) => /mořsk/.test(o)],
  [/mizí z potoků se znečištěnou/, (o) => /^filtrují/.test(o)],
  [/škeble v rybníce pomáhá/, (o) => /filtruje/.test(o)],
  [/prázdné schránky ze dvou misek/, (o) => /^mlži/.test(o) && /znečištěn/.test(o)],
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };
  const zacinaSkupinou = (g: G) => (o: string) => o.split(",")[0].trim() === g;

  if (jePopis(q)) return one("klasifikátor", opts.filter(zacinaSkupinou(klasifikuj(q))));

  const m1 = q.match(/^Do které skupiny živočichů patří (.+)\?$/);
  if (m1) {
    const g = podleJmena.get(m1[1]);
    expect(g, q).toBeDefined();
    return one("zástupce → skupina", opts.filter(zacinaSkupinou(g!)));
  }
  const m2 = q.match(/^Který živočich z nabídky patří mezi (\S+)\?$/);
  if (m2) {
    const g = AKUZATIV[m2[1]];
    expect(g, q).toBeDefined();
    return one("skupina → zástupce", opts.filter((o) => podleJmena.get(o) === g));
  }
  const m3 = q.match(/^Jakou schránku má (.+)\?$/);
  if (m3) {
    const g = podleJmena.get(m3[1]);
    expect(g, q).toBeDefined();
    expect(t.hints![0], q).toContain(`schránka ${genPodleJmena.get(m3[1])}:`);
    const re = SCHRANKA[g!];
    expect(re, q).toBeDefined();
    return one("typ schránky", opts.filter((o) => re!.test(o)));
  }
  const cl = CLAIMS.filter(([re]) => re.test(q));
  expect(cl.length, `CLAIMS pro "${q}"`).toBe(1);
  return one("tvrzení", opts.filter(cl[0][1]));
}

const STEM: Record<G, RegExp> = { "plži": /plž/i, "mlži": /mlž/i, "hlavonožci": /hlavonož/i };
const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");

function seeded(seed = 0x9e3779b9): () => number {
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
  const puvodni = Math.random;
  Math.random = seeded(seed);
  try {
    return f();
  } finally {
    Math.random = puvodni;
  }
}

function rvpLabels(id: string): { area: string; topic: string } {
  const data = JSON.parse(readFileSync(join(process.cwd(), "data", "rvp_data.json"), "utf8"));
  let found: { area: string; topic: string } | null = null;
  const walk = (n: unknown) => {
    if (found || !n || typeof n !== "object") return;
    const o = n as Record<string, unknown>;
    if (o.id === id && o.labels) found = o.labels as { area: string; topic: string };
    for (const v of Object.values(o)) walk(v);
  };
  walk(data);
  expect(found, `RVP uzel ${id}`).not.toBeNull();
  return found!;
}

describe("Měkkýši — metadata", () => {
  it("přírodopis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.id).toBe("g6-pri-mekkysi-plzi-mlzi-hlavonozci-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

const SEEDY = Array.from({ length: 30 }, (_, i) => 1000 + i * 7919);

describe.each([1, 2, 3])("Měkkýši — level %i", (level) => {
  const tasks = topic.generator(level);
  const vse: PracticeTask[] = SEEDY.flatMap((s) => sSeedem(s, () => topic.generator(level)));

  it("≥12 unikátních úloh, jen select_one se 4 různými možnostmi", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of vse) {
      expect(t.options, t.question).toBeDefined();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer), t.question).toHaveLength(1);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of vse) {
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
    }
  });

  it("NEZÁVISLÝ SOLVER (30 seedů): klíč souhlasí s druhou cestou, právě 1 správná", () => {
    for (const t of vse) {
      const v = solve(t);
      expect(t.correctAnswer, `${v.kind}: ${t.question}`).toBe(v.expected);
    }
  });

  it("popisné úlohy neobsahují název žádné skupiny", () => {
    for (const t of vse.filter((x) => jePopis(x.question))) {
      for (const re of Object.values(STEM)) expect(re.test(t.question), t.question).toBe(false);
    }
  });

  it("klíč není ve znění ani v nápovědách; nápovědy nejmenují klíčovou skupinu", () => {
    for (const t of vse) {
      const key = t.correctAnswer.toLowerCase();
      expect(t.question.toLowerCase().includes(key), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints!.length).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      const skupiny = (Object.keys(STEM) as G[]).filter((g) => STEM[g].test(key) && !STEM[g].test(t.question));
      for (const h of t.hints!) {
        expect(h.toLowerCase().includes(key), `hint leak: ${h}`).toBe(false);
        for (const g of skupiny) expect(STEM[g].test(h), `nápověda jmenuje skupinu ${g}: ${h}`).toBe(false);
      }
    }
  });

  it("nápovědy jsou pro úlohu unikátní (stejná nápověda jen u stejného zadání)", () => {
    const h0 = new Map<string, string>();
    const h1 = new Map<string, string>();
    for (const t of vse) {
      const k = `${t.question}|${t.correctAnswer}`;
      expect(h0.get(t.hints![0]) ?? k, `opakovaná malá nápověda: ${t.hints![0]}`).toBe(k);
      expect(h1.get(t.hints![1]) ?? k, `opakovaná velká nápověda: ${t.hints![1]}`).toBe(k);
      h0.set(t.hints![0], k);
      h1.set(t.hints![1], k);
    }
  });

  it("klíč nevyčnívá délkou ani prvním slovem", () => {
    let nejdelsi = 0;
    for (const t of tasks) {
      const podleDelky = [...t.options!].sort((a, b) => b.length - a.length);
      if (podleDelky[0] === t.correctAnswer && podleDelky[0].length >= 1.25 * podleDelky[1].length) nejdelsi++;
    }
    for (const t of vse) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      const vycniva = jine[0].length >= 3 && new Set(jine).size === 1 && jine[0] !== prvni(t.correctAnswer);
      expect(vycniva, `klíč vyčnívá prvním slovem: ${t.question}`).toBe(false);
    }
    expect(nejdelsi, "klíč je výrazně nejdelší příliš často").toBeLessThanOrEqual(2);
  });

  it("determinismus: dvě volání se stejným seedem dají totéž", () => {
    const otisk = () => JSON.stringify(topic.generator(level).map((t) => [t.question, t.correctAnswer, t.options]));
    const a = sSeedem(42, otisk);
    for (let i = 0; i < 5; i++) Math.random();
    const b = sSeedem(42, otisk);
    expect(b).toBe(a);
  });
});

describe("Měkkýši — gradace", () => {
  const otazky = (l: number) => new Set(SEEDY.flatMap((s) => sSeedem(s, () => topic.generator(l))).map((t) => t.question));

  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map(otazky);
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L1 střídá všechny čtyři šablony", () => {
    const tasks = sSeedem(7, () => topic.generator(1));
    const sablona = (q: string) =>
      /^Do které skupiny živočichů/.test(q) ? "a"
        : /^Který živočich z nabídky/.test(q) ? "b"
          : /^Jakou schránku má/.test(q) ? "d" : "c";
    const pocty = new Map<string, number>();
    for (const t of tasks) pocty.set(sablona(t.question), (pocty.get(sablona(t.question)) ?? 0) + 1);
    for (const s of ["a", "b", "c", "d"]) expect(pocty.get(s) ?? 0, `šablona ${s}`).toBeGreaterThanOrEqual(3);
  });

  it("L3 = klamavý popis, tvrzení spolužáka, proč, důsledek", () => {
    for (const q of otazky(3)) {
      expect(/Kam ho zařadíš\?$|tvrdí, že|^Proč|^V potoce|^Akvarista/.test(q), q).toBe(true);
    }
  });

  it("L1 = přímé otázky bez popisu a zdůvodňování", () => {
    for (const q of otazky(1)) {
      expect(jePopis(q) || /^Proč|tvrdí/.test(q), q).toBe(false);
    }
  });
});
