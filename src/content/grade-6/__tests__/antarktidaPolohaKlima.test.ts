import { describe, it, expect } from "vitest";
import { ANTARKTIDA_POLOHA_KLIMA } from "../zemepis/antarktidaPolohaKlima";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Antarktida — poloha, klima, výzkum, ochrana (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nezávislá na datové bance generátoru):
 *  1. Klasifikátor rozlišovacích znaků. Test si drží vlastní tabulku
 *     ANTARKTIDA × ARKTIDA (pevnina/zamrzlý oceán, tučňák/lední medvěd,
 *     prosinec–leden/červen–červenec, bez obyvatel/původní obyvatelé) a u
 *     úloh na rozpoznání oblasti z ní odvodí odpověď sám — z POPISU v zadání,
 *     ne z toho, jak úlohu složil generátor. Zároveň ověří, že popisu
 *     nevyhovuje žádný distraktor (tj. neexistuje druhá správná odpověď).
 *  2. Souřadnicová linka: solver vyparsuje šířku a její znaménko ze znění
 *     otázky (regex na „78° j. š.“) a sám spočítá znaménko → polokoule,
 *     |šířka| vs. 66,5° → polární oblast / mírný pás. Generátor naopak
 *     pracuje s předem vylosovanými příznaky. Kontroluje se i to, že
 *     `solutionSteps` obsahují mezikrok s hodnotou 66,5.
 *  3. Faktické úlohy: vlastní tabulka vlastností, které klíč musí splňovat.
 *  4. Strukturální kontroly (4 možnosti, délka klíče, feedback, nápovědy,
 *     disjunktní znění L1 × L3, determinismus).
 */
const topic = ANTARKTIDA_POLOHA_KLIMA[0];

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

// ── 1. tabulka rozlišovacích znaků (vlastní zdroj pravdy testu) ────────────

const ZNAKY_ANT: RegExp[] = [
  /rozlehlá souš/i,
  /led(ovec)? (leží|silný) na (souš|pevnin)/i,
  /pod kilometry ledu/i,
  /pohoří i? ?sopk/i,
  /tučňák/i,
  /nikdo tam nebydlí trvale/i,
  /pevninsk\w+ ledovc?e?/i,
];
const ZNAKY_ARK: RegExp[] = [
  /led plave na (hluboké vodě|moři)/i,
  /plave na oceánu/i,
  /praská na kry/i,
  /lední medvěd/i,
  /velká šelma loví u díry v ledu/i,
  /mrož/i,
  /loví už po staletí/i,
  /v červnu tam Slunce nezapadá/i,
];

/** Vrátí "ANT" / "ARK" podle převahy znaků; při remíze nebo nule null. */
function klasifikuj(text: string): "ANT" | "ARK" | null {
  const a = ZNAKY_ANT.filter((r) => r.test(text)).length;
  const b = ZNAKY_ARK.filter((r) => r.test(text)).length;
  if (a === b) return null;
  return a > b ? "ANT" : "ARK";
}

const NAZEV: Record<"ANT" | "ARK", string> = { ANT: "Antarktida", ARK: "Arktida" };

/** Živočichové: která polokoule. Klíč musí být z jedné skupiny, distraktory z druhé. */
const ZVIRE_ANT = /^(tučňák|tuleň|kosatka)/i;
const ZVIRE_ARK = /^(lední medvěd|mrož|polární liška|sob)/i;
/**
 * Dravec: distraktory jsou antarktičtí živočichové, kteří tuleně ani tučňáky
 * NEloví. Tuleň leopardí by byl druhá správná odpověď, proto je vyloučený.
 */
const NEDRAVCI_ANT = /^(tuleň Weddellův|albatros|krunýřovka)/i;
const DRUHA_SPRAVNA = /leopard/i;

// ── 2. souřadnice ──────────────────────────────────────────────────────────

const KRUH = 66.5;
const OBL = {
  ant: "v jižní polární oblasti",
  ark: "v severní polární oblasti",
  mirJ: "v mírném pásu jižní polokoule",
  mirS: "v mírném pásu severní polokoule",
};
const VSECHNY_OBLASTI = new Set(Object.values(OBL));

/** Z textu otázky vytáhne zeměpisnou šířku se znaménkem (jih záporně). */
function parseSirka(q: string): number | null {
  const m = q.match(/(\d+)°\s*([js])\.\s*š\./);
  if (!m) return null;
  return (m[2] === "j" ? -1 : 1) * Number(m[1]);
}

/** Nezávislý výpočet oblasti: znaménko → polokoule, |šířka| vs. 66,5°. */
function oblastZeSirky(lat: number): string {
  const jih = lat < 0;
  if (Math.abs(lat) >= KRUH) return jih ? OBL.ant : OBL.ark;
  return jih ? OBL.mirJ : OBL.mirS;
}

// ── 3. tabulka faktů: znění otázky → vlastnost, kterou klíč musí splnit ────

type Pravidlo = [RegExp, (key: string, t: PracticeTask) => boolean];

const vse = (...rs: RegExp[]) => (key: string) => rs.every((r) => r.test(key));

const FAKTA: Pravidlo[] = [
  // L1
  [/^Co je Antarktida\?/, vse(/světadíl/i, /pevnina/i)],
  [/^Kde leží Antarktida\?/, vse(/^kolem jižního pólu$/)],
  [/Který oceán obtéká Antarktidu/, vse(/^Jižní oceán$/)],
  [/Kdo na Antarktidě žije trvale/, vse(/^nikdo/i, /vědeck/i)],
  [/Co se skrývá pod antarktickým ledovcem/, vse(/pevnina/i)],
  [/Jak silný je pevninský ledovec/, vse(/tři kilometry/i)],
  [/Který světadíl je nejchladnější/, vse(/^Antarktida$/)],
  [/Který světadíl leží Antarktidě nejblíž/, vse(/^Jižní Amerika$/)],
  [/Který světadíl leží v průměru nejvýš/, vse(/^Antarktida$/)],
  [/Co v Antarktidě roste/, vse(/mechy a lišejníky/i)],
  [/Komu podle Antarktické smlouvy/, vse(/žádnému státu/i)],
  [/Co je antarktická vědecká stanice/, vse(/vědci bydlí a pracují/i)],
  [/Kolik sladké vody/, vse(/většina/i)],
  [/Jak se jmenuje led, který v Antarktidě leží na souši/, vse(/^pevninský ledovec$/)],
  // L2
  [/svítí Slunce celý leden/, vse(/jižní polokoule/i, /nakloněná ke Slunci/i, /nezapadá/i)],
  [/posádky antarktických stanic střídají/, vse(/jižní léto/i)],
  [/nejtepleji v lednu a nejchladněji v červenci/, vse(/jižní polokouli/i, /nakloněná/i)],
  [/nevyjde Slunce od května do srpna/, vse(/odkloněná/i, /nevychází/i)],
  [/Proč v Antarktidě nerostou stromy/, vse(/mráz/i, /led/i)],
  [/život drží u pobřeží a v moři/, vse(/potrav/i)],
  [/označuje jako ledová poušť/, vse(/srážek/i, /pouštích/i)],
  [/neroztaje led ani v létě/, vse(/pod bodem mrazu/i)],
  // L3
  [/tání antarktického pevninského ledovce zvedá hladinu/, vse(/ze souše do moře teprve přibude/i, /plovoucí/i)],
  [/vyvrtávají z antarktického ledovce hluboká jádra/, vse(/podnebí/i, /minulost/i)],
  [/odpad zpět do domovských zemí/, vse(/nerozloží/i)],
  [/otevřít důl na uhlí/, vse(/Těžba/i, /zakázan/i)],
  [/vojenskou základnu/, vse(/[Vv]ojensk/i, /zakázan/i)],
  [/budou krmit/, vse(/zakázan/i, /nedotčen/i)],
  [/uhynulého ledního medvěda/, vse(/severního pólu/i, /nevyskytuj/i)],
  [/mořského ledu, která v jižním létě ubývá/, vse(/[Pp]lave na moři/, /souši/i)],
  [/chladněji než v Arktidě/, vse(/pevnina/i, /oceán/i)],
  [/odlamují kry velké jako ostrov/, vse(/vahou/i)],
];

type Vysledek = { kind: "oblast" | "souradnice" | "zvire" | "fakt"; ok: boolean; detail?: string };

function solve(t: PracticeTask): Vysledek | null {
  const q = t.question;
  const key = t.correctAnswer;
  const distraktory = t.options!.filter((o) => o !== key);

  // (2) souřadnicová linka — solver si klíč spočítá sám z textu otázky
  if (t.options!.every((o) => VSECHNY_OBLASTI.has(o))) {
    const lat = parseSirka(q);
    if (lat === null) return { kind: "souradnice", ok: false, detail: "šířka se nedala vyparsovat" };
    const ocekavam = oblastZeSirky(lat);
    const kroky = (t.solutionSteps ?? []).join(" ");
    return {
      kind: "souradnice",
      ok: key === ocekavam && /66,5/.test(kroky),
      detail: `šířka ${lat} → čekám „${ocekavam}“, kroky s 66,5: ${/66,5/.test(kroky)}`,
    };
  }

  // (1) rozpoznání oblasti z popisu — klasifikátor nad popisem v zadání
  if (/^Popis oblasti:/.test(q)) {
    const popis = q.replace(/^Popis oblasti:\s*/, "").split("O kterou oblast")[0];
    const r = klasifikuj(popis);
    if (!r) return { kind: "oblast", ok: false, detail: "popis nemá jednoznačné rozlišovací znaky" };
    const jmeno = NAZEV[r];
    // klíč musí oblast pojmenovat a ŽÁDNÝ distraktor ji pojmenovat nesmí
    const keyOk = key.startsWith(`${jmeno} —`);
    const zadnyDalsi = distraktory.every((d) => !d.startsWith(`${jmeno} —`));
    return { kind: "oblast", ok: keyOk && zadnyDalsi, detail: `popis → ${jmeno}; druhá správná: ${!zadnyDalsi}` };
  }

  // živočichové na pobřeží: klíč z jižní skupiny, všechny distraktory ze severní
  if (/Který živočich žije ve volné přírodě na antarktickém pobřeží/.test(q)) {
    return {
      kind: "zvire",
      ok: ZVIRE_ANT.test(key) && distraktory.every((d) => ZVIRE_ARK.test(d)),
      detail: `klíč „${key}“, distraktory ${distraktory.join(" / ")}`,
    };
  }

  // dravec: klíč kosatka, distraktory antarktičtí živočichové bez velké kořisti
  if (/Který velký mořský dravec/.test(q)) {
    return {
      kind: "zvire",
      ok:
        /^kosatka$/i.test(key) &&
        distraktory.every((d) => NEDRAVCI_ANT.test(d) && !DRUHA_SPRAVNA.test(d)),
      detail: `klíč „${key}“, distraktory ${distraktory.join(" / ")}`,
    };
  }

  // (3) faktická tabulka
  for (const [rq, pred] of FAKTA) {
    if (rq.test(q)) return { kind: "fakt", ok: pred(key, t), detail: `pravidlo ${rq}` };
  }
  return null;
}

const levels = [1, 2, 3] as const;
const vzorky = Object.fromEntries(
  levels.map((l) => [l, [11, 22, 33, 44, 55].flatMap((s) => withSeed(s, () => topic.generator(l)))]),
) as Record<1 | 2 | 3, PracticeTask[]>;

describe("Antarktida — metadata", () => {
  it("zeměpis g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-zem-antarktida-poloha-klima-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Regiony světa");
    expect(topic.topic).toBe("Polární oblasti");
    expect(topic.rvpNodeId).toBe(
      "g6-zemepis-regiony-sveta-polarni-oblasti-antarktida-poloha-klima-vyzkum-ochrana",
    );
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(levels)("Antarktida — L%i", (level) => {
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

  it("klíč není ve znění ani v nápovědě, nápovědy se liší", () => {
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

  it("žádná mapa ani obrázek, žádný údaj závislý na aktuálním dění", () => {
    for (const t of tasks) {
      const cely = [t.question, ...(t.options ?? []), t.explanation ?? ""].join(" ");
      expect(t.question).not.toMatch(/na mapě|na mapu|na obrázk|podívej se/i);
      // rok podpisu smlouvy, počet stanic ani teplotní rekord v klíči nefigurují
      expect(cely).not.toMatch(/19\d\d|20\d\d/);
      expect(t.correctAnswer).not.toMatch(/−?\d+\s*°C/);
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

  it("≥ 12 různých úloh na jedno volání generátoru", () => {
    const jedno = withSeed(7, () => topic.generator(level));
    expect(pocetUnikatnich(jedno)).toBeGreaterThanOrEqual(12);
  });
});

describe("Antarktida — souřadnicová linka (L2)", () => {
  const souradnicove = vzorky[2].filter((t) => solve(t)?.kind === "souradnice");

  it("L2 obsahuje souřadnicovou i faktickou linku", () => {
    const jedno = withSeed(7, () => topic.generator(2));
    expect(jedno.filter((t) => solve(t)?.kind === "souradnice").length).toBeGreaterThanOrEqual(4);
    expect(jedno.filter((t) => solve(t)?.kind === "fakt").length).toBeGreaterThanOrEqual(4);
  });

  it("solutionSteps ukazují mezikrok s polárním kruhem 66,5°", () => {
    expect(souradnicove.length).toBeGreaterThan(0);
    for (const t of souradnicove) {
      expect(t.solutionSteps!.length, t.question).toBeGreaterThanOrEqual(3);
      expect(t.solutionSteps!.join(" "), t.question).toMatch(/66,5/);
    }
  });

  it("obě polokoule i oba pásy se v úlohách objeví", () => {
    const klice = new Set(souradnicove.map((t) => t.correctAnswer));
    for (const o of Object.values(OBL)) expect(klice, `chybí klíč ${o}`).toContain(o);
  });

  it("solutionSteps má jen souřadnicová linka", () => {
    for (const t of [...vzorky[1], ...vzorky[2], ...vzorky[3]]) {
      if (solve(t)?.kind !== "souradnice") expect(t.solutionSteps, t.question).toBeUndefined();
    }
  });
});

/**
 * Sezení = prvních `sessionTaskCount` úloh poolu (generateMockBatch pool jen
 * ořízne). Testy níž hlídají to, co zamíchání celého poolu neřeší: aby se
 * v jedné šestici nesešly dvě úlohy řešitelné týmž vyloučením.
 */
describe("Antarktida — skladba sezení", () => {
  const KOLIK = topic.sessionTaskCount!;
  const seedy = Array.from({ length: 40 }, (_, i) => i * 7 + 3);
  const sezeni = (level: 1 | 2 | 3, seed: number) =>
    withSeed(seed, () => topic.generator(level)).slice(0, KOLIK);
  const kolikrat = (tasks: PracticeTask[], r: RegExp) => tasks.filter((t) => r.test(t.question)).length;
  const celyText = (t: PracticeTask) =>
    [t.question, ...(t.options ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})].join(" ");

  it("L1: úlohy se stejným rozlišovacím pravidlem se nesejdou", () => {
    for (const s of seedy) {
      const t = sezeni(1, s);
      expect(kolikrat(t, /Který živočich žije ve volné přírodě|Který velký mořský dravec/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /Který světadíl je nejchladnější|Který světadíl leží v průměru nejvýš/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /^Co je Antarktida|Co se skrývá pod antarktickým ledovcem/), `seed ${s}`).toBeLessThanOrEqual(1);
    }
  });

  it("L2: právě jedna souřadnicová úloha a v ní převažuje jižní šířka", () => {
    let jizni = 0;
    for (const s of seedy) {
      const sour = sezeni(2, s).filter((t) => solve(t)?.kind === "souradnice");
      expect(sour.length, `seed ${s}`).toBe(1);
      if (/j\.\s*š\./.test(sour[0].question)) jizni++;
    }
    expect(jizni / seedy.length).toBeGreaterThanOrEqual(0.6);
  });

  it("L2: obě otázky o životě se nesejdou a otázky na sklon osy nejvýš dvě", () => {
    for (const s of seedy) {
      const t = sezeni(2, s);
      expect(kolikrat(t, /Proč v Antarktidě nerostou stromy|život drží u pobřeží a v moři/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /svítí Slunce celý leden|nevyjde Slunce od května do srpna|nejtepleji v lednu|posádky antarktických stanic střídají/), `seed ${s}`).toBeLessThanOrEqual(2);
    }
  });

  it("L3: lední medvěd se v jednom sezení objeví nejvýš v jedné úloze", () => {
    for (const s of seedy) {
      const medved = sezeni(3, s).filter((t) => /lední medvěd|ledního medvěda/i.test(celyText(t)));
      expect(medved.length, `seed ${s}: ${medved.map((t) => t.question).join(" | ")}`).toBeLessThanOrEqual(1);
    }
  });

  it("nepolární souřadnice nespadnou do subpolárního pásu (nad 58°)", () => {
    for (const t of vzorky[2].filter((x) => solve(x)?.kind === "souradnice")) {
      const lat = Math.abs(parseSirka(t.question)!);
      expect(lat < KRUH ? lat <= 58 : lat >= 68, t.question).toBe(true);
    }
  });
});

describe("Antarktida — rozsah platnosti tvrzení", () => {
  it("tvrzení „led neroztaje“ je omezené na vnitrozemí", () => {
    for (const t of [...vzorky[1], ...vzorky[2], ...vzorky[3]]) {
      const text = `${t.question} ${t.explanation ?? ""}`;
      if (/neroztaje led|neroztává led|led neroztaje/i.test(text)) {
        expect(text, t.question).toMatch(/vnitrozem/i);
      }
    }
  });
});

describe("Antarktida — gradace a determinismus", () => {
  it("L1 se ptá na jeden fakt; L1 a L3 mají disjunktní znění", () => {
    for (const t of vzorky[1]) {
      expect(t.question, t.question).toMatch(/^(Co|Kde|Kdo|Komu|Který|Kolik|Jak)/);
      expect(t.question.length, `L1 je příliš dlouhá: ${t.question}`).toBeLessThan(90);
    }
    const l1 = new Set(vzorky[1].map((t) => t.question));
    expect(vzorky[3].filter((t) => l1.has(t.question))).toEqual([]);
  });

  it("L3 je rozhodování o případu, ne jednoduchý fakt", () => {
    for (const t of vzorky[3]) {
      const ok = /^Popis oblasti:/.test(t.question) || /^Proč|^Stát |^Turistická|^Zpráva|^Kolem |^Ledovec /.test(t.question);
      expect(ok, t.question).toBe(true);
      expect(t.question, `L3 recykluje L1: ${t.question}`).not.toMatch(/^(Co je Antarktida|Komu)/);
    }
  });

  it("žádná úloha nemíchá typy — všechny mají options", () => {
    for (const t of [...vzorky[1], ...vzorky[2], ...vzorky[3]]) {
      expect(t.options, t.question).toBeTruthy();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
    }
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
