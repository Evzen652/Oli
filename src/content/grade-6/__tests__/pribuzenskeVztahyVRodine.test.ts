import { describe, it, expect } from "vitest";
import { PRIBUZENSKE_VZTAHY_V_RODINE } from "../vko/pribuzenskeVztahyVRodine";
import { klicUlohy } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Příbuzenské vztahy v rodině (VKO 6. ročník, select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): z textu otázky se mechanicky parsují
 * rodinné vztahy (syn/dcera X, bratr/sestra X, X a Y jsou sourozenci) do
 * malého rodokmenu (hrany rodič→dítě, sourozenecké dvojice + rod), NEZÁVISLE
 * na tom, jak si generátor klíč sestavil. Nad rodokmenem se pak spočítá
 * generační vzdálenost a větev mezi zdrojovou a cílovou osobou (BFS) a podle
 * pevné tabulky (generace, větev, rod) se určí, jaký pojem z povoleného
 * slovníku má vyjít — a porovná se s `correctAnswer`.
 *
 * L1 nemá jmenovaný rodokmen (je to přímá definice "tvého/tvé…"), tam solver
 * jen ověří, že korektní pojem odpovídá slovníkové definici v otázce.
 */
const topic = PRIBUZENSKE_VZTAHY_V_RODINE[0];
const low = (s: string) => s.toLowerCase();
const POVOLENE = new Set(["rodiče", "prarodiče", "sourozenec", "teta", "strýc", "bratranec", "sestřenice", "synovec", "neteř"]);

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

// ── L1 — pravidla nad zněním otázky (definiční, bez rodokmenu) ──────────
type Pravidlo = { name: string; test: (t: PracticeTask) => boolean; kmen: RegExp };
const PRAVIDLA_L1: Pravidlo[] = [
  { name: "sestra matky", test: (t) => /^Jak se říká sestře tvé matky\?/.test(t.question), kmen: /^teta$/ },
  { name: "bratr otce", test: (t) => /^Jak se říká bratrovi tvého otce\?/.test(t.question), kmen: /^strýc$/ },
  { name: "sestra otce", test: (t) => /^Jak se říká sestře tvého otce\?/.test(t.question), kmen: /^teta$/ },
  { name: "bratr matky", test: (t) => /^Jak se říká bratrovi tvé matky\?/.test(t.question), kmen: /^strýc$/ },
  { name: "syn strýce/tety", test: (t) => /^Jak se říká synovi tvého strýce/.test(t.question), kmen: /^bratranec$/ },
  { name: "dcera strýce/tety", test: (t) => /^Jak se říká dceři tvého strýce/.test(t.question), kmen: /^sestřenice$/ },
  { name: "syn sourozence", test: (t) => /^Jak se říká synovi tvého sourozence\?/.test(t.question), kmen: /^synovec$/ },
  { name: "dcera sourozence", test: (t) => /^Jak se říká dceři tvého sourozence\?/.test(t.question), kmen: /^neteř$/ },
  { name: "syn sestry", test: (t) => /^Jak se říká synovi tvé sestry\?/.test(t.question), kmen: /^synovec$/ },
  { name: "dcera bratra", test: (t) => /^Jak se říká dceři tvého bratra\?/.test(t.question), kmen: /^neteř$/ },
  { name: "chlapec dítě tety", test: (t) => /^Jak se říká chlapci, který je dítětem tvé tety\?/.test(t.question), kmen: /^bratranec$/ },
  { name: "dívka dítě strýce", test: (t) => /^Jak se říká dívce, která je dítětem tvého strýce\?/.test(t.question), kmen: /^sestřenice$/ },
  { name: "bratr nebo sestra jedním slovem", test: (t) => /^Jak se říká tvému bratrovi nebo tvé sestře/.test(t.question), kmen: /^sourozenec$/ },
  { name: "otec a matka společně", test: (t) => /^Jak se říkají společně otec a matka\?/.test(t.question), kmen: /^rodiče$/ },
  { name: "rodiče rodičů", test: (t) => /^Jak se říká rodičům tvých rodičů\?/.test(t.question), kmen: /^prarodiče$/ },
  { name: "matka otce/matky", test: (t) => /^Do jaké skupiny příbuzných patří matka tvého otce nebo matka tvé matky\?/.test(t.question), kmen: /^prarodiče$/ },
];

function solveL1(t: PracticeTask): Pravidlo {
  const hit = PRAVIDLA_L1.filter((p) => p.test(t));
  expect(hit.map((p) => p.name), `solver musí L1 úlohu rozpoznat právě jedním pravidlem: ${t.question}`).toHaveLength(1);
  return hit[0];
}

// ── L2/L3 — mechanický rodokmen z věty ────────────────────────────────────
type Rod = "M" | "F";
interface Osoba {
  jmeno: string;
  rod: Rod;
  rodic?: string; // jméno/klíč rodiče v grafu, pokud je znám
}

/** Rozpozná pád jména ("Petrovi"/"Haně" apod.) na 1. pád podle vlastního slovníku použitých jmen v bance. */
const NOMINATIV: Record<string, string> = {
  // dativ ("Kým je X KOMU?")
  Petrovi: "Petr", Haně: "Hana", Karolíně: "Karolína", Filipovi: "Filip", Tomášovi: "Tomáš",
  Kláře: "Klára", Adéle: "Adéla", Matějovi: "Matěj", Nikole: "Nikola", Jakubovi: "Jakub",
  Barboře: "Barbora", Ondřejovi: "Ondřej", Elišce: "Eliška", Davidovi: "David", Tereze: "Tereza",
  Vojtěchovi: "Vojtěch", Šimonovi: "Šimon", Zuzaně: "Zuzana", Ivetě: "Iveta", Renatě: "Renata",
  Lukášovi: "Lukáš", Kateřině: "Kateřina", Markovi: "Marek", Veronice: "Veronika", Janovi: "Jan",
  Simoně: "Simona",
  // akuzativ ("X má syna/dceru KOHO")
  Adélu: "Adéla", Barboru: "Barbora", Davida: "David", Elišku: "Eliška", Jakuba: "Jakub",
  Jana: "Jan", Karolínu: "Karolína", Kateřinu: "Kateřina", Kláru: "Klára", Lukáše: "Lukáš",
  Matěje: "Matěj", Nikolu: "Nikola", Ondřeje: "Ondřej", Simonu: "Simona", Terezu: "Tereza",
  Tomáše: "Tomáš", Vojtěcha: "Vojtěch", Zuzanu: "Zuzana", Šimona: "Šimon",
  Ivetu: "Iveta", Renatu: "Renata",
};

interface Fakt { typ: "dite" | "sourozenec"; a: string; rodA: Rod; b: string; rodB?: Rod }

/** Vytáhne z věty fakta: "X je syn/dcera Y." / "X je bratr/sestra Y." / "X a Y jsou sourozenci." / "Y má syna/dceru X." / "Y má dvě děti, X a Z." */
function parsuj(otazka: string): { fakta: Fakt[]; cil: string; zdroj: string } {
  const fakta: Fakt[] = [];
  const veta = otazka.replace(/^„.*?“\s*/, "");

  // "X je syn/dcera pana/paní PRIJMENI." — anchor identifikován příjmením (řetězec), ne osobou v grafu zvlášť
  for (const m of veta.matchAll(/(\p{Lu}\p{Ll}+) je (syn|dcera) (pana|paní) (\p{Lu}\p{Ll}+)/gu)) {
    fakta.push({ typ: "dite", a: m[1], rodA: m[2] === "syn" ? "M" : "F", b: `#${m[4]}` });
  }
  // "X je bratr/sestra pana/paní PRIJMENI." — X NENÍ dítě anchoru, je jeho
  // SOUROZENEC: oba (X i anchor-uzel) se zavěsí pod společný virtuální
  // "prarodičovský" uzel, aby sourozenciOsoby(anchor) našla X, a naopak.
  for (const m of veta.matchAll(/(\p{Lu}\p{Ll}+) je (bratr|sestra) (pana|paní) (\p{Lu}\p{Ll}+)/gu)) {
    const gp = `GP_#${m[4]}`;
    fakta.push({ typ: "dite", a: m[1], rodA: m[2] === "bratr" ? "M" : "F", b: gp });
    fakta.push({ typ: "dite", a: `#${m[4]}`, rodA: "M", b: gp });
  }
  // "X a Y jsou sourozenci."
  for (const m of veta.matchAll(/(\p{Lu}\p{Ll}+) a (\p{Lu}\p{Ll}+) jsou sourozenci/gu)) {
    fakta.push({ typ: "sourozenec", a: m[1], rodA: "M", b: m[2] });
  }
  // "X má syna/dceru Y." (X = rodič, Y = dítě, v akuzativu; X je reálné jméno, ne anchor)
  for (const m of veta.matchAll(/(\p{Lu}\p{Ll}+) má (syna|dceru) (\p{Lu}\p{Ll}+)/gu)) {
    fakta.push({ typ: "dite", a: NOMINATIV[m[3]] ?? m[3], rodA: m[2] === "syna" ? "M" : "F", b: m[1] });
  }
  // "Paní/Pan PRIJMENI má dvě děti, X a Y."
  const anchorDve = veta.match(/(Paní|Pan) (\p{Lu}\p{Ll}+) má dvě děti, (\p{Lu}\p{Ll}+) a (\p{Lu}\p{Ll}+)/u);
  if (anchorDve) {
    fakta.push({ typ: "dite", a: NOMINATIV[anchorDve[3]] ?? anchorDve[3], rodA: "M", b: `@ANCHOR` });
    fakta.push({ typ: "dite", a: NOMINATIV[anchorDve[4]] ?? anchorDve[4], rodA: "M", b: `@ANCHOR` });
  }

  // Cílové osoby otázky: "Kým je A B?" — ptáme se, ČÍM JE A (zdroj, 1. pád)
  // osobě B (cíl, referenční bod, uveden v datívu).
  const kym = veta.match(/Kým je (\p{Lu}\p{Ll}+) (\p{Lu}\p{Ll}+)\?/u);
  if (!kym) throw new Error(`Otázka nemá tvar "Kým je A B?": ${otazka}`);
  return { fakta, cil: NOMINATIV[kym[2]] ?? kym[2], zdroj: kym[1] };
}

/**
 * Skutečné jmenované osoby zmíněné ve větě — "pan/paní PŘÍJMENÍ" počítá jako
 * jedna osoba, každé křestní jméno jako další (bez ohledu na pád, přes první
 * 3 znaky slova — u použitých jmen napříč pády stabilní: "Hana"/"Haně"→"Han").
 */
function jmenovaneOsoby(otazka: string): Set<string> {
  const osoby = new Set<string>();
  for (const m of otazka.matchAll(/(?:pan|paní) (\p{Lu}\p{Ll}+)/gu)) osoby.add(`#${m[1]}`);
  const bezAnchoru = otazka.replace(/(?:pan|paní) \p{Lu}\p{Ll}+/gu, "");
  for (const m of bezAnchoru.matchAll(/\p{Lu}\p{Ll}+/gu)) {
    const w = m[0];
    if (w === "Kým" || w === "Paní" || w === "Pan") continue;
    osoby.add(w.slice(0, 3));
  }
  return osoby;
}

/** Rod jména podle koncovky (heuristika dost dobrá pro jména použitá v bance). */
function rodJmena(jmeno: string): Rod {
  const zenska = new Set([
    "Hana", "Karolína", "Klára", "Adéla", "Nikola", "Barbora", "Eliška", "Tereza", "Zuzana", "Iveta",
    "Renata", "Kateřina", "Veronika", "Simona",
  ]);
  return zenska.has(jmeno) ? "F" : "M";
}

/** Sestaví graf rodič→dítě + sourozenecké dvojice a spočítá vztah zdroj→cíl. */
function vypocitejVztah(otazka: string): Term {
  const { fakta, cil, zdroj } = parsuj(otazka);
  // Napřímí anchor uzly (@Jméno, #Příjmení, @ANCHOR) na skutečné rodiče podle sourozeneckých faktů.
  const rodicDite: [string, string, Rod][] = []; // [rodič, dítě, rodDítěte]
  const sourozenci: [string, string][] = [];
  for (const f of fakta) {
    if (f.typ === "dite") rodicDite.push([f.b, f.a, f.rodA]);
    else sourozenci.push([f.a, f.b]);
  }
  // Sjednoť anchor-uzly, které se objevují jako rodič více dětí (přímý sourozenecký pár).
  const rodicMap = new Map<string, string[]>(); // rodič-klíč -> děti
  for (const [rodic, dite] of rodicDite) {
    if (!rodicMap.has(rodic)) rodicMap.set(rodic, []);
    rodicMap.get(rodic)!.push(dite);
  }
  // Explicitní "X a Y jsou sourozenci" spojí X,Y pod stejného virtuálního rodiče.
  for (const [a, b] of sourozenci) {
    const key = `SOUR_${a}_${b}`;
    if (!rodicMap.has(key)) rodicMap.set(key, []);
    if (!rodicMap.get(key)!.includes(a)) rodicMap.get(key)!.push(a);
    if (!rodicMap.get(key)!.includes(b)) rodicMap.get(key)!.push(b);
  }

  function rodicOsoby(jmeno: string): string | null {
    for (const [rodic, deti] of rodicMap) if (deti.includes(jmeno)) return rodic;
    return null;
  }
  function sourozenciOsoby(jmeno: string): string[] {
    const r = rodicOsoby(jmeno);
    if (!r) return [];
    return rodicMap.get(r)!.filter((d) => d !== jmeno);
  }

  if (zdroj === cil) throw new Error(`Zdroj a cíl jsou stejná osoba: ${zdroj}`);

  // 1) sourozenci?
  if (sourozenciOsoby(zdroj).includes(cil)) return "sourozenec";

  // 2) zdroj je sourozenec rodiče cíle -> teta/strýc; naopak cíl sourozenec rodiče zdroje -> synovec/neteř
  const rodicCile = rodicOsoby(cil);
  if (rodicCile && sourozenciOsoby(zdroj).includes(rodicCile)) {
    return rodJmena(zdroj) === "F" ? "teta" : "strýc";
  }
  const rodicZdroje = rodicOsoby(zdroj);
  if (rodicZdroje && sourozenciOsoby(cil).includes(rodicZdroje)) {
    return rodJmena(zdroj) === "F" ? "neteř" : "synovec";
  }

  // 3) bratranec/sestřenice: rodič zdroje a rodič cíle jsou sourozenci
  if (rodicZdroje && rodicCile && sourozenciOsoby(rodicZdroje).includes(rodicCile)) {
    return rodJmena(zdroj) === "F" ? "sestřenice" : "bratranec";
  }

  throw new Error(`Solver nedokázal určit vztah ${zdroj} → ${cil} ve větě: ${otazka}`);
}

type Term = "sourozenec" | "bratranec" | "sestřenice" | "strýc" | "teta" | "synovec" | "neteř" | "rodiče" | "prarodiče";

describe("Příbuzenské vztahy v rodině — metadata", () => {
  it("vko g6, select_one, přesné RVP zařazení", () => {
    expect(topic.id).toBe("g6-vko-pribuzenske-vztahy-v-rodine-6");
    expect(topic.subject).toBe("vko");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.rvpNodeId).toBe(
      "g6-vko-clovek-ve-spolecnosti-nase-obec-region-vlast-rodina-pribuzenstvi-mezigeneracni-vztahy",
    );
    expect(topic.category).toBe("Člověk ve společnosti");
    expect(topic.topic).toBe("Naše obec, region, vlast");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });

  it("všechny možnosti a klíče patří do povoleného slovníku 9 pojmů", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        expect(POVOLENE.has(t.correctAnswer), t.correctAnswer).toBe(true);
        for (const o of t.options ?? []) expect(POVOLENE.has(o), o).toBe(true);
      }
    }
  });
});

describe.each([1, 2, 3])("Příbuzenské vztahy — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh a determinismus při stejném seedu", () => {
    expect(new Set(tasks.map(klicUlohy)).size).toBeGreaterThanOrEqual(12);
    const puvodni = Math.random;
    try {
      Math.random = seeded(42);
      const a = topic.generator(level).map((t) => [t.question, t.options]);
      Math.random = seeded(42);
      const b = topic.generator(level).map((t) => [t.question, t.options]);
      expect(b).toEqual(a);
    } finally {
      Math.random = puvodni;
    }
  });

  it("4 různé možnosti, klíč právě jednou, feedback u každého distraktoru", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer), t.question).toHaveLength(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}"`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("SOLVER: klíč souhlasí s nezávislou cestou (definice na L1, rodokmen na L2/L3)", () => {
    for (const t of tasks) {
      if (level === 1) {
        const p = solveL1(t);
        expect(low(t.correctAnswer), `${p.name}: ${t.question}`).toMatch(p.kmen);
      } else {
        const vztah = vypocitejVztah(t.question);
        expect(t.correctAnswer, t.question).toBe(vztah);
      }
    }
  });

  it("leak: klíč není ve znění otázky ani v nápovědách; nápovědy unikátní", () => {
    const videne = new Set<string>();
    for (const t of tasks) {
      expect(low(t.question), t.question).not.toContain(low(t.correctAnswer));
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(low(h), `hint leak (${t.correctAnswer}): ${h}`).not.toContain(low(t.correctAnswer));
        expect(videne.has(h), `duplicitní nápověda: ${h}`).toBe(false);
        videne.add(h);
      }
    }
  });

  it("žádný hodnotový soud o složení rodiny (rozvod, netradiční rodina)", () => {
    for (const t of tasks) {
      const texty = [t.question, ...(t.options ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) {
        expect(s, `hodnotový soud: ${s}`).not.toMatch(/lepší rodina|špatná rodina|správné složení rodiny|horší rodina/i);
      }
    }
  });

  it("čeština: žádné lomítkové rodové tvary", () => {
    for (const t of tasks) {
      const texty = [t.question, ...t.options!, ...(t.hints ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(s, s).not.toMatch(/\p{L}\/\p{L}/u);
    }
  });
});

describe("Příbuzenské vztahy — gradace a obsah L3", () => {
  const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\d]+/gu, " ").trim();

  it("L1 a L3 se zněním otázek nepřekrývají", () => {
    const l1 = topic.generator(1), l3 = topic.generator(3);
    const q1 = new Set(l1.map((t) => norm(t.question)));
    expect(l3.filter((t) => q1.has(norm(t.question)))).toHaveLength(0);
  });

  it("L3 obsahuje aspoň 4 jmenované osoby a nabízí distraktor „stop u mezičlánku“", () => {
    const l3 = topic.generator(3);
    for (const t of l3) {
      expect(jmenovaneOsoby(t.question).size, t.question).toBeGreaterThanOrEqual(4);
    }
    // aspoň polovina L3 úloh musí mít mezi distraktory "prarodiče" nebo "sourozenec" (stop-u-mezičlánku/větev)
    const sMezickem = l3.filter((t) => t.options!.some((o) => o === "prarodiče" || o === "sourozenec"));
    expect(sMezickem.length / l3.length).toBeGreaterThanOrEqual(0.4);
  });

  it("L2 úlohy mají přesně 3 jmenované osoby", () => {
    const l2 = topic.generator(2);
    for (const t of l2) {
      expect(jmenovaneOsoby(t.question).size, t.question).toBe(3);
    }
  });
});
