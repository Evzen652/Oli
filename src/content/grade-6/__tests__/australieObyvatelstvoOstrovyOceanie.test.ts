import { describe, it, expect } from "vitest";
import { AUSTRALIE_OBYVATELSTVO_OSTROVY_OCEANIE } from "../zemepis/australieObyvatelstvoOstrovyOceanie";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Austrálie a Oceánie — obyvatelstvo, hospodářství, ostrovy (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nezávislá na bankách generátoru):
 *  1. Tabulka faktů: pro každé znění otázky si test drží VLASTNÍ očekávaný klíč
 *     (pojem → atribut). Generátor ji nezná; solver ji hledá podle textu otázky.
 *  2. Klasifikátor klíčových slov pro popisné L3 úlohy: z TEXTU popisu určí typ
 *     ostrova (atol / sopečný / pevninský) nebo oblast Oceánie a porovná ji s
 *     klíčem. Zároveň ověří, že popisu nevyhovuje žádný jiný typ.
 *  3. Strukturální kontroly (4 možnosti, feedback, nápovědy bez klíče, délka
 *     klíče, tvar klíče, disjunktní znění L1 × L3, determinismus).
 */
const topic = AUSTRALIE_OBYVATELSTVO_OSTROVY_OCEANIE[0];

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
function withSeed<T>(seed: number, fn: () => T): T {
  const orig = Math.random;
  Math.random = seeded(seed);
  try {
    return fn();
  } finally {
    Math.random = orig;
  }
}

// ── 1. tabulka faktů: znění → očekávaný klíč ───────────────────────────────

const FAKTA: [RegExp, string | RegExp][] = [
  // L1
  [/^Co je Austrálie\?/, "stát i světadíl zároveň"],
  [/hlavním městem Austrálie/, "Canberra"],
  [/původní obyvatelé Austrálie/, "Aboriginci"],
  [/většinu dnešních obyvatel Austrálie/, /^potomci přistěhovalců, hlavně z Evropy/],
  [/v Austrálii nejběžnější/, "angličtina"],
  [/největší australská města/, /pobřeží/],
  [/z chovu ovcí/, "vlnu"],
  [/hovězímu masu/, "kráva"],
  [/se v Austrálii těží nejvíc/, "železná ruda a uhlí"],
  [/hlavní část Nového Zélandu/, "Severní a Jižní ostrov"],
  [/hlavním městem Nového Zélandu/, "Wellington"],
  [/původní obyvatelé Nového Zélandu/, "Maorové"],
  [/^Co je Oceánie\?/, /^tisíce ostrovů.*Tichém oceánu$/],
  [/Které tři oblasti tvoří Oceánii/, "Melanésie, Mikronésie a Polynésie"],
  [/vyrostl ze ztuhlé lávy z hlubin Země/, "sopečný ostrov"],
  [/^Co je korálový atol/, /^prstenec nízkých ostrůvků/],
  [/^Co je pevninský ostrov/, /^kus světadílu/],
  [/Kde leží ostrovy Oceánie/, "v Tichém oceánu"],
  // L2 — každé očekávání musí obsahovat věcné jádro příčiny
  [/^Proč žije většina Australanů při pobřeží/, /suché a pouštní.*vody a přístavů/],
  [/farmy s ovcemi ve vnitrozemí.*obrovské/, /chudá a suchá.*velkou plochu pastvy/],
  [/učí přes rádio.*lékař/, /tak daleko/],
  [/V nitru Austrálie je málo vody/, /málo lidí.*řídké/],
  [/úrodné na sopečných ostrovech|půdy na sopečných ostrovech/, /živiny.*hory zachytávají deště/],
  [/na korálovém atolu daří hlavně kokosovým/, /tenkou písčitou půdu.*sladké vody je málo/],
  [/Malý ostrov uprostřed oceánu si sám/, /dovážet lodí nebo letadlem/],
  [/nemá žádné nerostné suroviny/, /^Turismus a rybolov/],
  [/spíš ovce a skot/, /řídkou trávu.*pastvu, ne na pole/],
  [/Novém Zélandu daří chovu ovcí/, /Vlhké mírné podnebí drží trávu/],
  [/největším problémem pitná voda/, /nemá řeky ani prameny.*dešťovou vodu/],
  [/osady na vysokých sopečných ostrovech/, /strmé hory.*přístavy jsou jen u moře/],
  [/pěstují kokosové palmy/, /písčité půdě.*plody, mléko i dřevo/],
  [/teplé moře, bílé pláže/, /turisty/],
  [/Nový důl na železnou rudu/, /vozí vlakem či nákladními vozy.*přístavu/],
  // L3 — rozhodnutí
  [/nové velké přístavní město/, /pobřeží.*zátokou pro lodě/],
  [/velkou farmu s ovcemi/, /travnatá krajina/],
  [/nejvíc ohrožený zatopením/, "nízký korálový atol"],
  [/víc než Austrálii/, /kousek nad hladinou.*není kam ustoupit/],
  [/Austrálie a malý atolový stát/, /^Austrálie těží rudu.*atol žije z rybolovu/],
  [/dovážet větší část zboží/, /^Atolový stát/],
  [/Odkud tam lidé nejspíš berou pitnou vodu/, /^z dešťových nádrží/],
  [/na svazích nejspíš pěstovat/, /^banány, taro/],
  [/Co z popisu vyplývá o osídlení/, /^je řídké/],
  [/zakázat ničení korálového útesu/, /turisty.*rybám/],
  [/Plán obživy/, /^turismus a rybolov/],
  [/nejhustší osídlení světadílu/, "pobřežní pás u moře"],
];

// ── 2. klasifikátor popisů (typ ostrova, oblast, stát) ─────────────────────

const ZNAKY_TYP: Record<string, RegExp[]> = {
  "korálový atol": [/prstenec/i, /laguny/i, /sotva/i, /dešť/i, /bez hor|žádná hora/i, /vápenc/i],
  "sopečný ostrov": [/kráter/i, /lávy/i, /strmé/i],
  "pevninský ostrov": [/průliv/i, /na pevnině/i, /oddělil/i, /souvisel/i],
};
const ZNAKY_OBLAST: Record<string, RegExp[]> = {
  Melanésie: [/Nová Guinea/i, /severně a severovýchodně od Austrálie/i],
  Mikronésie: [/drobných ostrůvků/i, /východně od Filipín/i],
  Polynésie: [/trojúhelník/i, /Havaje/i],
};

function klasifikuj(text: string, tabulka: Record<string, RegExp[]>): string | null {
  const skore = Object.entries(tabulka).map(([k, rs]) => [k, rs.filter((r) => r.test(text)).length] as const);
  skore.sort((a, b) => b[1] - a[1]);
  if (skore[0][1] === 0 || skore[0][1] === skore[1][1]) return null;
  return skore[0][0];
}

type Vysledek = { kind: string; ok: boolean; detail?: string };

function solve(t: PracticeTask): Vysledek | null {
  const q = t.question;
  const key = t.correctAnswer;
  const dist = t.options!.filter((o) => o !== key);

  if (/^Popis místa:/.test(q)) {
    const r = klasifikuj(q, ZNAKY_TYP);
    if (!r) return { kind: "typ", ok: false, detail: "popis nemá jednoznačné znaky" };
    return { kind: "typ", ok: key === r && !dist.includes(r), detail: `popis → ${r}` };
  }
  if (/^Popis oblasti: .*(Oceánie)/.test(q) && /Do které oblasti Oceánie/.test(q)) {
    const r = klasifikuj(q, ZNAKY_OBLAST);
    if (!r) return { kind: "oblast", ok: false, detail: "popis nemá jednoznačné znaky" };
    return { kind: "oblast", ok: key === r && !dist.includes(r), detail: `popis → ${r}` };
  }
  if (/^Popis ostrova:/.test(q)) {
    const ok = /rovníku/.test(q) && /dva státy/.test(q) && key === "Nová Guinea";
    return { kind: "ostrov", ok, detail: "rovník + dva státy → Nová Guinea" };
  }
  if (/^Popis státu:/.test(q)) {
    const ok = /Maorov/.test(q) && /dva velké hornaté ostrovy/.test(q) && key === "Nový Zéland";
    return { kind: "stat", ok, detail: "Maorové + dva ostrovy → Nový Zéland" };
  }
  for (const [rq, exp] of FAKTA) {
    if (rq.test(q)) {
      const ok = typeof exp === "string" ? key === exp : exp.test(key);
      // žádný distraktor nesmí projít stejným očekáváním
      const druhy = dist.some((d) => (typeof exp === "string" ? d === exp : exp.test(d)));
      return { kind: "fakt", ok: ok && !druhy, detail: `pravidlo ${rq}; druhá správná: ${druhy}` };
    }
  }
  return null;
}

const levels = [1, 2, 3] as const;
const vzorky = Object.fromEntries(
  levels.map((l) => [l, [11, 22, 33, 44, 55].flatMap((s) => withSeed(s, () => topic.generator(l)))]),
) as Record<1 | 2 | 3, PracticeTask[]>;

describe("Austrálie a Oceánie — metadata", () => {
  it("zeměpis g6, select_one, RVP zápis znak po znaku", () => {
    expect(topic.id).toBe("g6-zem-australie-obyvatelstvo-ostrovy-oceanie-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Regiony světa");
    expect(topic.topic).toBe("Austrálie a Oceánie");
    expect(topic.rvpNodeId).toBe(
      "g6-zemepis-regiony-sveta-australie-a-oceanie-obyvatelstvo-a-hospodarstvi-ostrovy-oceanie",
    );
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(levels)("Austrálie a Oceánie — L%i", (level) => {
  const tasks = vzorky[level];

  it("nezávislý solver potvrdí každý klíč", () => {
    for (const t of tasks) {
      const r = solve(t);
      expect(r, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      expect(r!.ok, `${t.question} → ${t.correctAnswer} (${r!.detail ?? ""})`).toBe(true);
    }
  });

  it("4 různé možnosti, právě 1 správná, feedback ke každému distraktoru", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer).length).toBe(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
    }
  });

  it("klíč není ve znění ani v nápovědě, nápovědy se liší, vysvětlení existuje", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), t.question).toBe(false);
      expect(t.hints!.length).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(h.includes(t.correctAnswer), `hint leak: ${t.question}`).toBe(false);
      }
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("žádná mapa ani obrázek, žádná aktuální čísla", () => {
    for (const t of tasks) {
      const cely = [t.question, ...(t.options ?? []), t.explanation ?? ""].join(" ");
      expect(t.question).not.toMatch(/na mapě|na mapu|na obrázk|podívej se/i);
      expect(cely).not.toMatch(/\b(19|20)\d\d\b|milion|HDP/);
    }
  });

  it("klíč nevyčnívá délkou (průměr ≤ 1,15× průměr distraktorů)", () => {
    const klic = tasks.map((t) => t.correctAnswer.length);
    const dist = tasks.flatMap((t) => t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length));
    const prum = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
    expect(prum(klic) / prum(dist)).toBeLessThanOrEqual(1.15);
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsi = tasks.filter((t) => {
      const others = t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length);
      return t.correctAnswer.length > Math.max(...others);
    }).length;
    expect(nejdelsi / tasks.length).toBeLessThan(0.5);
  });

  it("klíč nevyčnívá úvodním slovem, když distraktory začínají stejně", () => {
    const prvni = (s: string) => s.split(/\s+/)[0].toLowerCase().replace(/[.,—]/g, "");
    for (const t of tasks) {
      const d = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(d).size === 1) {
        expect(prvni(t.correctAnswer), `klíč vyčnívá tvarem: ${t.question}`).toBe(d[0]);
      }
    }
  });

  it("≥ 12 různých úloh na jedno volání generátoru (a aspoň 14 v bance)", () => {
    const jedno = withSeed(7, () => topic.generator(level));
    expect(pocetUnikatnich(jedno)).toBeGreaterThanOrEqual(14);
  });

  it("jen options — žádné míchání typů", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toBeTruthy();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
    }
  });
});

describe("Austrálie a Oceánie — gradace a znění", () => {
  it("L1 se ptá na jeden fakt", () => {
    for (const t of vzorky[1]) {
      expect(t.question, t.question).toMatch(/^(Co|Které|Který|Jak|Kde|Kdo)/);
      expect(t.question.length, t.question).toBeLessThan(100);
    }
  });

  it("L2 hledá příčinu nebo důsledek", () => {
    for (const t of vzorky[2]) {
      expect(t.question, t.question).toMatch(/Proč|Které tvrzení|Co z toho plyne/);
    }
  });

  it("L3 je popis nebo rozhodnutí, nikoli recyklovaný fakt", () => {
    for (const t of vzorky[3]) {
      expect(t.question, t.question).toMatch(/^(Popis|Rozhodni|Hladina|Vysvětli|Srovnání|Ostrovní stát|Plán)/);
      expect(t.question.length, `L3 je krátký fakt: ${t.question}`).toBeGreaterThan(70);
    }
  });

  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const l1 = new Set(vzorky[1].map((t) => t.question));
    const l2 = new Set(vzorky[2].map((t) => t.question));
    expect(vzorky[3].filter((t) => l1.has(t.question) || l2.has(t.question))).toEqual([]);
    expect(vzorky[2].filter((t) => l1.has(t.question))).toEqual([]);
  });

  it("L3 obsahuje popis typu ostrova, oblasti i rozhodnutí", () => {
    const kinds = new Set(vzorky[3].map((t) => solve(t)?.kind));
    for (const k of ["typ", "oblast", "fakt"]) expect(kinds.has(k), `chybí ${k}`).toBe(true);
  });

  it("gen() je deterministický a bez stavu modulu", () => {
    const otisk = () =>
      JSON.stringify(levels.map((l) => topic.generator(l).map((t) => [t.question, t.correctAnswer])));
    const a = withSeed(123, otisk);
    Math.random();
    Math.random();
    const b = withSeed(123, otisk);
    expect(b).toBe(a);
  });
});
