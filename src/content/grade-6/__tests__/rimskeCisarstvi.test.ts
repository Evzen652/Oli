import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RIMSKE_CISARSTVI_TOPICS } from "../dejepis/rimskeCisarstvi";
import type { PracticeTask } from "@/lib/types";

/**
 * Římské císařství — Caesar, Augustus, Pax Romana (faktický select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, nezávislé na bankách generátoru):
 *  (1) FACTS — osoba/pojem → role, rok úmrtí, činy (tagy). Znění otázky se přes
 *      pravidla převede na podmínku a vyhovět jí smí právě jedna možnost.
 *  (2) EVENT_YEAR — rank-tabulka (př. n. l. záporně). „Nejdříve/nejpozději“ = min/max;
 *      „kolik let uplynulo“ = letopočty regexem ze znění, přepočet bez roku 0.
 *  (3) TRUTH — tvrzení → pravda/nepravda pro úlohy „najdi chybu“; CLAIMS pro
 *      zbylé analytické otázky (znění → vzor správného tvrzení).
 * Generátor vrací celou banku, takže test je deterministický výčet.
 */
const topic = RIMSKE_CISARSTVI_TOPICS[0];

// ── (1) FACTS ──────────────────────────────────────────────────────────────
interface Person { names: string[]; role: string; died: number; tags: string[]; month?: string }
const FACTS: Record<string, Person> = {
  caesar: { names: ["Caesar"], role: "diktátor", died: -44, month: "červenec", tags: ["galie", "rubikon", "kostky", "veni", "kalendar", "zavrazden"] },
  octavian: { names: ["Octavianus", "Augustus"], role: "císař", died: 14, month: "srpen", tags: ["prvni-cisar", "actium-vitez", "titul-27", "princeps", "navrat-moci", "adoptovan"] },
  antonius: { names: ["Antonius"], role: "vojevůdce", died: -30, tags: ["actium-porazen", "kleopatra-spojenec", "pomstil"] },
  brutus: { names: ["Brutus"], role: "senátor", died: -42, tags: ["spiklenec", "pritel-zradce"] },
  cassius: { names: ["Cassius"], role: "senátor", died: -42, tags: ["spiklenec"] },
  pompeius: { names: ["Pompeius"], role: "vojevůdce", died: -48, tags: ["strana-senatu"] },
  nero: { names: ["Nero"], role: "císař", died: 68, tags: [] },
};
const personOf = (o: string) => Object.values(FACTS).find((p) => p.names.includes(o));

/** Otázka na osobu → podmínka (tag) a případně požadovaný tvar jména. */
const PERSON_RULES: [RegExp, string, string?][] = [
  [/prvním římským císařem/, "prvni-cisar", "Augustus"],
  [/spiklencům, kteří zavraždili/, "spiklenec"],
  [/porazil Antonia a Kleopatru/, "actium-vitez", "Octavianus"],
  [/Kostky jsou vrženy/, "kostky"],
  [/„vrátil“ moc senátu/, "navrat-moci", "Augustus"],
  [/Přišel jsem, viděl jsem/, "veni"],
  [/adoptoval .* než dostal čestné jméno/, "adoptovan", "Octavianus"],
  [/Kleopatřin spojenec, kterého Octavianus porazil/, "actium-porazen"],
  [/považoval za přítele, a přesto/, "pritel-zradce"],
];

/** Neosobní fakta L1: znění → vzor jediné správné možnosti (nezávisle zapsaný fakt). */
const TERM_FACTS: [RegExp, (o: string) => boolean][] = [
  [/čestné jméno dostal Octavianus/, (o) => o === "Augustus"],
  [/měsíc nese jméno po Gaiu Iuliovi/, (o) => o === FACTS.caesar.month],
  [/měsíc je pojmenovaný po prvním/, (o) => o === FACTS.octavian.month],
  [/řeku překročil Caesar/, (o) => /^Rubikon$/.test(o)],
  [/roce byl Caesar zavražděn/, (o) => o === `${-FACTS.caesar.died} př. n. l.`],
  [/opevněná hranice/, (o) => o === "limes"],
  [/znamená Pax Romana/, (o) => o === "římský mír"],
  [/egyptská královna/, (o) => o === "Kleopatra"],
  [/kalendář, který zavedl Caesar/, (o) => /^julián/.test(o)],
  [/titul „první občan“/, (o) => o === "princeps"],
  // Pax Romana: od Augusta (−27) asi do konce 2. stol. n. l. (~180) → řádově 200 let
  [/Jak dlouho zhruba trval římský mír/, (o) => {
    const n = Number(o.replace(/\D+/g, ""));
    return Math.abs(n - (180 + 27 - 1)) <= 30;
  }],
  [/Kde byl Caesar zavražděn/, (o) => /senát/.test(o)],
  [/území dobyl Caesar v letech 58–51/, (o) => /^Gali/.test(o)],
  [/funkci měl Caesar, když byl zavražděn/, (o) => o.includes(FACTS.caesar.role)],
];

// ── (2) chronologie ────────────────────────────────────────────────────────
const EVENT_YEAR: [RegExp, number][] = [
  [/Rubikon/, -49],
  [/Caesarov[aoy] smrt/, -44],
  [/Actia/, -31],
  [/(jméno|jména|titul) Augustus/, -27],
  [/smrt Augusta/, 14],
  [/Galie/, -58],
  [/Malé Asii/, -47],
  [/Filipp/, -42],
  [/Teutoburském/, 9],
];
const yearOf = (s: string): number => {
  const hit = EVENT_YEAR.filter(([re]) => re.test(s));
  expect(hit, `událost v "${s}"`).toHaveLength(1);
  return hit[0][1];
};
/** "49 př. n. l." → −49; "14 n. l." → 14 */
const parseYear = (n: string, era: string) => (/př/.test(era) ? -Number(n) : Number(n));
/** Počet let mezi dvěma roky; přes přelom chybí rok 0. */
const yearsBetween = (a: number, b: number) => Math.abs(b - a) - (a < 0 && b > 0 ? 1 : 0);

// ── (3) tvrzení ────────────────────────────────────────────────────────────
const TRUTH: [RegExp, boolean][] = [
  [/^Augustus překročil .*Rubikon/, false],
  [/^Octavianus porazil .*Actia/, true],
  [/^Caesar dobyl Galii/, true],
  [/^Brutus patřil/, true],
  [/^Caesar vládl jako první císař/, false],
  [/^Augustus dostal od senátu čestné jméno roku 27/, true],
  [/^Za Pax Romana legie dál střežily hranice/, true],
  [/^Caesar byl zavražděn na zasedání senátu/, true],
];

const CLAIMS: [RegExp, RegExp][] = [
  [/nenechal nazývat králem/, /krále nenáviděli/],
  [/rozvinul obchod/, /klid.*bezpečné.*peníze/],
  [/rozdíl mezi Caesarem a Augustem/, /^Caesar byl doživotní diktátor, Augustus .*prvním císařem$/],
  [/Co z úryvku plyne o tom, jak chtěl působit/, /obnovitel republiky/],
  [/pro práci s tímto pramenem/, /psal sám vládce/],
  [/legie přestaly střežit limes/, /pronikly .*obchod/],
  [/říká principát/, /skutečnou moc měl princeps/],
  [/vražda republiku nezachránila/, /občanské války a vítěz/],
  [/překročení Rubikonu tak vážný/, /nesmělo vstoupit do Itálie/],
  [/Co měli Caesar a Augustus společné/, /soustředili moc/],
  [/neznamenala, že Řím vůbec nebojoval/, /na hranicích legie/],
  [/bitva u Actia pro vznik císařství/, /posledního soupeře/],
  [/přežilo ve slovech císař a kaiser/, /jako titul/],
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };

  // (2a) kolik let uplynulo — letopočty ze znění
  if (/^Kolik let uplynulo/.test(q)) {
    const m = [...q.matchAll(/\((\d+) (př\. n\. l\.|n\. l\.)\)/g)];
    expect(m, q).toHaveLength(2);
    const [a, b] = m.map((x) => parseYear(x[1], x[2]));
    // letopočty ve znění musí sedět s rank-tabulkou událostí
    const useky = q.split(/\(\d+ (?:př\. n\. l\.|n\. l\.)\)/);
    expect(yearOf(useky[0]), `první letopočet v "${q}"`).toBe(a);
    expect(yearOf(useky[1]), `druhý letopočet v "${q}"`).toBe(b);
    const diff = yearsBetween(a, b);
    return one("rozdíl let", opts.filter((o) => Number(o.split(" ")[0]) === diff));
  }
  // (2b) nejdříve / nejpozději
  if (/nejdříve|nejpozději|jako poslední/.test(q)) {
    for (const o of opts) {
      const m = o.match(/\((\d+) (př\. n\. l\.|n\. l\.)\)/)!;
      expect(parseYear(m[1], m[2]), `rok v možnosti "${o}"`).toBe(yearOf(o));
    }
    const ys = opts.map(yearOf);
    const target = /nejdříve/.test(q) ? Math.min(...ys) : Math.max(...ys);
    return one("pořadí", opts.filter((o) => yearOf(o) === target));
  }
  // (1a) osoby
  const pr = PERSON_RULES.filter(([re]) => re.test(q));
  if (pr.length) {
    expect(pr, q).toHaveLength(1);
    const [, tag, jmeno] = pr[0];
    return one("osoba", opts.filter((o) => {
      const p = personOf(o);
      return !!p && p.tags.includes(tag) && (!jmeno || o === jmeno);
    }));
  }
  // (1b) popis období → Pax Romana
  if (/bezpečně obchodovalo od Británie po Egypt/.test(q)) {
    return one("období", opts.filter((o) => o === "Pax Romana"));
  }
  // (1c) neosobní fakta L1
  const tf = TERM_FACTS.filter(([re]) => re.test(q));
  if (tf.length) {
    expect(tf, q).toHaveLength(1);
    return one("fakt", opts.filter(tf[0][1]));
  }
  // (3a) najdi chybu
  if (/obsahuje chybu|neplatí\?/.test(q)) {
    const truth = (o: string) => {
      const h = TRUTH.filter(([re]) => re.test(o));
      expect(h, `TRUTH pro "${o}"`).toHaveLength(1);
      return h[0][1];
    };
    return one("chyba", opts.filter((o) => !truth(o)));
  }
  // (3b) tvrzení
  const cl = CLAIMS.filter(([re]) => re.test(q));
  expect(cl.length, `CLAIMS pro "${q}"`).toBe(1);
  return one("tvrzení", opts.filter((o) => cl[0][1].test(o)));
}

/** Fakta z tabulky: klíč nesmí tvrdit, že Caesar byl císař. */
function factChecks(t: PracticeTask) {
  expect(FACTS.caesar.role).not.toBe("císař");
  const tvrdiCaesarCisar = /^Caesar (byl|vládl jako) prvn\S+ (římsk\S+ )?císař/.test(t.correctAnswer);
  expect(tvrdiCaesarCisar && !/neplatí|chybu/.test(t.question), t.question).toBe(false);
}

const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");

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

describe("Římské císařství — metadata", () => {
  it("dějepis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Antika - Řím");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Římské císařství — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh, jen select_one se 4 různými možnostmi", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, t.question).toContain(t.correctAnswer);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s druhou cestou (právě 1 správná)", () => {
    for (const t of tasks) {
      const v = solve(t);
      expect(t.correctAnswer, `${v.kind}: ${t.question}`).toBe(v.expected);
      factChecks(t);
    }
  });

  it("klíč není ve znění ani v nápovědách; nápovědy unikátní a různé", () => {
    const h0 = new Set<string>();
    const h1 = new Set<string>();
    for (const t of tasks) {
      const key = t.correctAnswer.toLowerCase();
      expect(t.question.toLowerCase().includes(key), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints!.length).toBe(2);
      for (const h of t.hints!) expect(h.toLowerCase().includes(key), `hint leak: ${h}`).toBe(false);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(h0.has(t.hints![0]), `opakovaná malá nápověda: ${t.hints![0]}`).toBe(false);
      expect(h1.has(t.hints![1]), `opakovaná velká nápověda: ${t.hints![1]}`).toBe(false);
      h0.add(t.hints![0]);
      h1.add(t.hints![1]);
    }
  });

  it("klíč nevyčnívá délkou ani prvním slovem", () => {
    let nejdelsi = 0;
    for (const t of tasks) {
      const podleDelky = [...t.options!].sort((a, b) => b.length - a.length);
      if (podleDelky[0] === t.correctAnswer && podleDelky[0].length >= 1.25 * podleDelky[1].length) nejdelsi++;
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      const vycniva = jine[0].length >= 3 && new Set(jine).size === 1 && jine[0] !== prvni(t.correctAnswer);
      expect(vycniva, `klíč vyčnívá prvním slovem: ${t.question}`).toBe(false);
    }
    expect(nejdelsi, "klíč je výrazně nejdelší příliš často").toBeLessThanOrEqual(2);
  });

  it("výpočty mají solutionSteps s mezivýsledkem", () => {
    for (const t of tasks.filter((x) => /^Kolik let/.test(x.question))) {
      expect(t.solutionSteps?.some((s) => /\d+ − \d+ = \d+/.test(s)), t.question).toBe(true);
    }
  });
});

describe("Římské císařství — gradace", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L3 = příčiny, důsledky, rozdíly, pramen, hledání chyby", () => {
    for (const t of topic.generator(3)) {
      expect(/^(Proč|Co by|Co měli|Které tvrzení|Který rozdíl|Augustus o sobě|Augustus v úryvku)/.test(t.question), t.question).toBe(true);
    }
  });

  it("L3: úlohy „republika navenek, vládne jeden“ se v jednom sezení (prvních 6) nepotkají", () => {
    const skupina = /nenechal nazývat králem|Co z úryvku plyne o tom, jak chtěl působit|říká principát/;
    for (let i = 0; i < 50; i++) {
      const idx = topic.generator(3).map((t, j) => (skupina.test(t.question) ? j : -1)).filter((j) => j >= 0);
      expect(idx).toHaveLength(3);
      const useky = idx.map((j) => Math.floor(j / (topic.sessionTaskCount ?? 6)));
      expect(new Set(useky).size, `pozice ${idx.join(",")}`).toBe(3);
    }
  });

  it("L2 obsahuje výpočet let i pořadí událostí", () => {
    const l2 = topic.generator(2).map((t) => t.question);
    expect(l2.filter((x) => /^Kolik let/.test(x)).length).toBeGreaterThanOrEqual(4);
    expect(l2.filter((x) => /nejdříve|nejpozději|jako poslední/.test(x)).length).toBeGreaterThanOrEqual(3);
  });
});
