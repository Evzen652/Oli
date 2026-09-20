import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PEDOSFERA_BIOSFERA, POOL_L1, POOL_L2, POOL_L3, type Polozka } from "../zemepis/pedosferaBiosfera";
import type { PracticeTask } from "@/lib/types";

/**
 * Pedosféra a biosféra — půdy a životní prostředí (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta). Nesahá na datové banky generátoru: všechny
 * tabulky jsou ručně zapsané tady a vstupem je jen ZNĚNÍ OTÁZKY a nabídka.
 *  (1) KLASIFIKÁTOR ZÓNY — vlastní tabulka rozlišovacích znaků
 *      (zeměpisná šířka, roční srážky, teplotní a porostní klíčová slova) pro
 *      tundru, tajgu, step, savanu, tropický deštný les, poušť a listnatý les
 *      mírného pásu. Ze znění otázky vytáhne čísla a znaky, určí zónu a pak
 *      vybere možnost, která té zóně odpovídá jménem I popisem půdy
 *      (u deštného lesa tím padne „nejúrodnější půda světa“).
 *  (2) TABULKA PŘÍČIN — pro L3 a pro obrácený směr L2 (krajina → vlastnost
 *      půdy) ručně zapsané dvojice zásah/jev → důsledek; klíč musí odpovídat.
 *  (3) STRUKTURÁLNÍ KONTROLY — 4 různé možnosti, právě 1 klíč, optionFeedback
 *      u všech distraktorů, klíč není systematicky nejdelší (≥ 100 vzorků),
 *      klíč ani jeho rozlišovací slovo není ve znění otázky ani v nápovědě,
 *      ≥ 12 úloh na úroveň, L1 ∩ L3 = ∅, determinismus, žádné „na mapě“.
 */
const topic = PEDOSFERA_BIOSFERA[0];
const ns = (s: string) => s.replace(/\s+/gu, " ").trim();
const norm = (s: string) => ns(s).normalize("NFD").replace(/[̀-ͯ]/gu, "").toLowerCase();

// ── (1) vlastní tabulka krajinných zón ─────────────────────────────────────
type Zona = "tundra" | "tajga" | "step" | "savana" | "prales" | "poust" | "les";

interface Znaky {
  /** jméno zóny v nabídce */
  jmeno: RegExp;
  /** popis půdy v nabídce (u víc možností téže zóny rozhodne tenhle znak) */
  puda: RegExp;
  /** rozlišovací znaky ze znění otázky */
  sedi: (f: Rysy) => boolean;
}

interface Rysy {
  sirka: number | null;
  srazky: number | null;
  t: string;
}

const ZONY: Record<Zona, Znaky> = {
  tundra: {
    jmeno: /^Tundra\b/u,
    puda: /tenká půda/u,
    sedi: (f) => /zmrzlé/u.test(f.t) && (/mechy/u.test(f.t) || (f.sirka ?? 0) >= 60),
  },
  tajga: {
    jmeno: /^Tajga\b/u,
    puda: /kyselé půdě/u,
    sedi: (f) =>
      /jehličnatých lesů táhnoucí/u.test(f.t) ||
      ((f.sirka ?? 0) >= 55 && (f.srazky ?? 0) >= 400 && (f.srazky ?? 0) <= 600 && /mrazivá/u.test(f.t)),
  },
  step: {
    jmeno: /^Step\b/u,
    puda: /černozemi/u,
    sedi: (f) =>
      /souvislá travnatá pláň mírného pásu/u.test(f.t) ||
      ((f.sirka ?? 0) >= 40 && (f.sirka ?? 0) <= 55 && (f.srazky ?? 0) >= 300 && (f.srazky ?? 0) <= 500 && /horké a suché/u.test(f.t)),
  },
  savana: {
    jmeno: /^Savana\b/u,
    puda: /suché půdě/u,
    sedi: (f) =>
      /vysokých travin s ojedinělými stromy/u.test(f.t) ||
      ((f.sirka ?? 99) <= 25 && (f.srazky ?? 0) >= 700 && (f.srazky ?? 0) <= 1500 && /období dešťů/u.test(f.t)),
  },
  prales: {
    jmeno: /^Tropický deštný les\b/u,
    puda: /chudé na živiny/u,
    sedi: (f) => /stromy tvoří několik pater/u.test(f.t) || (f.srazky ?? 0) >= 2000,
  },
  poust: {
    jmeno: /^Poušť(?=\s|$)/u,
    puda: /téměř bez humusu/u,
    sedi: (f) => (f.srazky ?? 9999) < 250,
  },
  les: {
    jmeno: /^Listnatý les mírného pásu\b/u,
    puda: /hnědá lesní půda/u,
    sedi: (f) =>
      (f.sirka ?? 0) >= 45 && (f.sirka ?? 0) <= 55 && (f.srazky ?? 0) >= 600 && (f.srazky ?? 0) <= 900 && /čtyři roční doby/u.test(f.t),
  },
};

/** Vytáhne ze znění otázky čísla (šířka, roční srážky) — parsuje text, ne parametry. */
function rysy(q: string): Rysy {
  const s = q.match(/kolem (\d+)° (s|j)\. š\./u);
  const p = q.match(/(?:asi|přes|sotva) ([\d  ]+) mm/u);
  return {
    sirka: s ? Number(s[1]) : null,
    srazky: p ? Number(p[1].replace(/[  ]/gu, "")) : null,
    t: q,
  };
}

/** Otázka na zónu? Pozná se podle toho, že aspoň jedno pravidlo sedí. */
function zona(q: string): Zona | null {
  const f = rysy(q);
  const sedici = (Object.keys(ZONY) as Zona[]).filter((z) => ZONY[z].sedi(f));
  if (sedici.length === 0) return null;
  expect(sedici, `klasifikátor zón je nejednoznačný: ${q}`).toHaveLength(1);
  return sedici[0];
}

// ── (2) vlastní tabulka příčin a vlastností půdy ───────────────────────────
interface Pravidlo {
  popis: string;
  otazka: RegExp;
  klic: RegExp;
}

/** L1 — pojmy pedosféry a biosféry (jiná cesta ke klíči: definice napsaná ručně). */
const POJMY: Pravidlo[] = [
  { popis: "vznik půdy", otazka: /^Z čeho vzniká půda\?$/u, klic: /^Ze zvětralé horniny a z rozložených zbytků organismů$/u },
  { popis: "humus", otazka: /^Co je humus\?$/u, klic: /^Tmavá hmota z rozložených zbytků organismů/u },
  { popis: "kde je humus", otazka: /^Kde je v půdě humusu nejvíc\?$/u, klic: /nejvyšší vrstvě/u },
  { popis: "matečná hornina", otazka: /matečnou horninu\?$/u, klic: /^Podklad pod půdou/u },
  { popis: "pedosféra", otazka: /pojem pedosféra\?$/u, klic: /^Půdní obal Země$/u },
  { popis: "biosféra", otazka: /pojem biosféra\?$/u, klic: /^Obal Země, který tvoří všechny/u },
  { popis: "nejúrodnější u nás", otazka: /patří u nás k nejúrodnějším\?$/u, klic: /^Černozem/u },
  { popis: "eroze", otazka: /podléhá erozi\?$/u, klic: /odnášena vodou nebo větrem/u },
  { popis: "rozkladači", otazka: /^Kdo v půdě rozkládá/u, klic: /bakterie, houby a drobní živočichové/u },
  { popis: "zvětrávání", otazka: /^Co je zvětrávání\?$/u, klic: /^Rozpad horniny na úlomky a přeměna/u },
];

/** L2 obrácený směr — krajina → vlastnost půdy (ručně zapsaný důvod). */
const PUDY: Pravidlo[] = [
  { popis: "tundra: tenká půda", otazka: /^Proč je v tundře vrstva půdy tenká/u, klic: /chladu vzniká půda velmi pomalu/u },
  { popis: "step: mocný humus", otazka: /^Proč je ve stepi mocná vrstva/u, klic: /Traviny každý rok odumírají/u },
  { popis: "deštný les: chudá půda", otazka: /^Proč má tropický deštný les půdu chudou na živiny/u, klic: /Živiny jsou uložené v rostlinách/u },
  { popis: "tajga: kyselá půda", otazka: /^Proč je půda pod severským jehličnatým lesem/u, klic: /Opad se v chladu rozkládá pomalu/u },
  { popis: "poušť: bez humusu", otazka: /^Proč je v pouštní půdě humusu/u, klic: /Roste tam málo rostlin/u },
  { popis: "listnatý vs. jehličnatý les", otazka: /^Proč má listnatý les mírného pásu úrodnější půdu/u, klic: /rozloží rychleji a dodá víc humusu/u },
  { popis: "travnatý porost → černozem", otazka: /^Jaká půda vznikne pod hustým travnatým porostem/u, klic: /^Černozem s mocnou tmavou vrstvou/u },
];

/** L3 — dvojice zásah/jev → důsledek, ručně zapsané. */
const PRICINY: Pravidlo[] = [
  { popis: "holý svah → eroze", otazka: /vykácel majitel les\. Po prvním vydatném dešti/u, klic: /nechráněnou půdu a splavil ji po svahu/u },
  { popis: "vypálený prales → živiny v biomase", otazka: /^Pole vypálené uprostřed tropického deštného lesa/u, klic: /Živiny byly uložené v rostlinách/u },
  { popis: "zavlažování v suchu → zasolení", otazka: /desítky let zavlažovalo/u, klic: /rozpuštěné soli po ní zůstaly/u },
  { popis: "stejná šířka, jiná vegetace → nadmořská výška", otazka: /^Dvě místa leží na stejné zeměpisné šířce/u, klic: /vysoko nad mořem/u },
  { popis: "ochrana svahu → vrstevnice a meze", otazka: /^Zemědělec hospodaří na svažitém poli/u, klic: /po vrstevnici/u },
  { popis: "velké lány → větrolamy", otazka: /^Po scelení pozemků do velkých lánů/u, klic: /pásy stromů a keřů/u },
  { popis: "nadměrná pastva → dezertifikace", otazka: /pase tolik dobytka/u, klic: /spasou porost a holou půdu/u },
  { popis: "rychlost rozkladu → teplo a vlhko", otazka: /leží opad na zemi celé roky/u, klic: /teple a vlhku pracují rozkladači/u },
  { popis: "svah → tenká půda", otazka: /^Na horském hřbetu je vrstva půdy tenká/u, klic: /splavuje dolů rychleji, než stačí vznikat/u },
  { popis: "nekrytý záhon → nános dole", otazka: /svažitý záhon bez porostu/u, klic: /Tající sníh a déšť odnesly/u },
  { popis: "zimní porost → ochrana", otazka: /nechat přes zimu porost/u, klic: /tlumí listy náraz kapek/u },
  { popis: "odvoz celých stromů → ochuzení", otazka: /odvážejí pokácené stromy i s větvemi/u, klic: /nevrací odumřelá hmota/u },
  { popis: "odlesněný svah → bahno v obci", otazka: /zaplavuje po přívalových deštích bahno/u, klic: /bez lesa nevsakuje/u },
  { popis: "dlouhý svah → pásy porostu", otazka: /zmenší ztrátu ornice na dlouhém mírném svahu/u, klic: /pásy trvalého travnatého porostu/u },
];

const TABULKY = [...POJMY, ...PUDY, ...PRICINY];

/** Druhá cesta ke klíči: klasifikátor zón, jinak ručně zapsaná tabulka. */
function vyres(t: PracticeTask): string {
  const q = ns(t.question);
  const opts = t.options!;

  const z = zona(q);
  if (z) {
    const { jmeno, puda } = ZONY[z];
    let kandidati = opts.filter((o) => jmeno.test(ns(o)));
    expect(kandidati.length, `zóna ${z} nemá v nabídce zastoupení: ${q}`).toBeGreaterThanOrEqual(1);
    if (kandidati.length > 1) kandidati = kandidati.filter((o) => puda.test(ns(o)));
    expect(kandidati, `zóna ${z}: nabídka nedává právě jednu možnost: ${q}`).toHaveLength(1);
    return kandidati[0];
  }

  const sedici = TABULKY.filter((p) => p.otazka.test(q));
  expect(sedici.map((p) => p.popis), `solver nemá pro otázku právě jedno pravidlo: ${q}`).toHaveLength(1);
  const ok = opts.filter((o) => sedici[0].klic.test(ns(o)));
  expect(ok, `pravidlo „${sedici[0].popis}“ nepřipouští právě 1 možnost: ${q}`).toHaveLength(1);
  return ok[0];
}

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

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator!(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);
/** ≥ 100 vzorků pro statistiku délek — generátor se volá opakovaně. */
const vzorky = [...all, ...LEVELS.flatMap((l) => topic.generator!(l)), ...LEVELS.flatMap((l) => topic.generator!(l))];
const POOLS: Record<number, Polozka[]> = { 1: POOL_L1, 2: POOL_L2, 3: POOL_L3 };
const dleOtazky = new Map<string, Polozka>([...POOL_L1, ...POOL_L2, ...POOL_L3].map((p) => [ns(p.q), p]));

function najdiUzel(n: unknown, id: string): { labels?: { area: string; topic: string } } | undefined {
  if (Array.isArray(n)) {
    for (const x of n) {
      const r = najdiUzel(x, id);
      if (r) return r;
    }
  } else if (n && typeof n === "object") {
    const o = n as Record<string, unknown>;
    if (o.id === id && o.labels) return o as { labels: { area: string; topic: string } };
    for (const v of Object.values(o)) {
      const r = najdiUzel(v, id);
      if (r) return r;
    }
  }
  return undefined;
}

describe("Pedosféra a biosféra — metadata", () => {
  it("zeměpis g6, select_one, category/topic podle RVP", () => {
    expect(topic.id).toBe("g6-zem-pedosfera-biosfera-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Přírodní obraz Země");
    expect(topic.topic).toBe("Krajinné sféry");
    expect(topic.title).toBe("Pedosféra a biosféra - půdy, životní prostředí");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/u).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Pedosféra a biosféra — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) expect(Array.isArray(t.options), t.question).toBe(true);
  });

  it("deterministický při stejném seedu", () => {
    const puvodni = Math.random;
    try {
      Math.random = seeded(7);
      const a = topic.generator!(level).map((t) => [t.question, t.correctAnswer, [...t.options!].sort()]);
      Math.random = seeded(7);
      const b = topic.generator!(level).map((t) => [t.question, t.correctAnswer, [...t.options!].sort()]);
      expect(b).toEqual(a);
    } finally {
      Math.random = puvodni;
    }
  });

  it("4 unikátní možnosti, klíč právě jednou, feedback pro každý distraktor", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("nezávislý solver dojde ke stejnému klíči", () => {
    for (const t of tasks) expect(t.correctAnswer, t.question).toBe(vyres(t));
  });

  it("klíč ani jeho rozlišovací slovo není v otázce ani v nápovědách", () => {
    for (const t of tasks) {
      const p = dleOtazky.get(ns(t.question));
      expect(p, `úloha není z banky: ${t.question}`).toBeTruthy();
      const zakazane = [norm(t.correctAnswer), norm(p!.klic)];
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const z of zakazane) {
        expect(norm(t.question).includes(z), `giveaway v zadání („${z}“): ${t.question}`).toBe(false);
        for (const h of t.hints!) expect(norm(h).includes(z), `nápověda prozrazuje („${z}“): ${h}`).toBe(false);
      }
    }
  });

  it("klíč nevyčnívá prvním slovem", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/u)[0].toLowerCase();
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(jine).size === 1) expect(prvni(t.correctAnswer), `klíč vyčnívá: ${t.question}`).toBe(jine[0]);
    }
  });

  it("žádná položka banky nezůstane nevygenerovaná", () => {
    const qs = new Set(tasks.map((t) => ns(t.question)));
    expect(POOLS[level].filter((p) => !qs.has(ns(p.q))).map((p) => p.q), `banka L${level}`).toEqual([]);
  });
});

describe("Pedosféra a biosféra — napříč tématem", () => {
  it("L1 ∩ L3 = ∅ (znění otázek)", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    expect(tasksBy[3].map((t) => t.question).filter((q) => q1.has(q))).toHaveLength(0);
  });

  it("klíč není systematicky nejdelší (≥ 100 vzorků)", () => {
    expect(vzorky.length).toBeGreaterThanOrEqual(100);
    let klic = 0;
    let distr = 0;
    let nejdelsi = 0;
    for (const t of vzorky) {
      klic += t.correctAnswer.length;
      const d = t.options!.filter((o) => o !== t.correctAnswer);
      distr += d.reduce((a, o) => a + o.length, 0) / d.length;
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0] === t.correctAnswer && s[0].length > s[1].length) nejdelsi++;
    }
    expect(klic / distr, "průměrná délka klíče vůči distraktorům").toBeLessThanOrEqual(1.15);
    expect(nejdelsi / vzorky.length, `klíč nejdelší v ${nejdelsi}/${vzorky.length}`).toBeLessThanOrEqual(0.4);
  });

  it("L2 obsahuje oba směry: podnebí → krajina i krajina → půda", () => {
    const l2 = tasksBy[2].map((t) => ns(t.question));
    expect(l2.filter((q) => /Jaká krajina a jaká půda tam vzniknou\?$/u.test(q)).length).toBeGreaterThanOrEqual(6);
    expect(l2.filter((q) => /^Proč |^Jaká půda vznikne/u.test(q)).length).toBeGreaterThanOrEqual(6);
  });

  it("L3 se ptá na příčinu nebo rozhodnutí, ne na pojmenování", () => {
    for (const t of tasksBy[3]) {
      expect(/Proč|příčinou|Čím to|pomůže|zabrání|souvisí|Co se stalo|zmenší/u.test(ns(t.question)), t.question).toBe(true);
    }
  });

  it("bez map a obrázků, bez rodových lomítkových tvarů", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) {
        expect(/na mapě|na obrázku|podívej se na map/iu.test(s), `odkaz na obrázek: ${s}`).toBe(false);
        expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
      }
    }
  });

  it("zkratka souřadnice se nezdvojí s tečkou na konci věty", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!];
      for (const s of texty) expect(/(š|d)\.\./u.test(s), `dvojtečka za zkratkou: ${s}`).toBe(false);
    }
  });
});
