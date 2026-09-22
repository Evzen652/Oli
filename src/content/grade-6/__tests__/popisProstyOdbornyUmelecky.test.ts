import { describe, it, expect } from "vitest";
import { POPIS_PROSTY_ODBORNY_UMELECKY } from "../cjl/popisProstyOdbornyUmelecky";
import type { PracticeTask } from "@/lib/types";

/**
 * Popis: prostý, odborný, umělecký — čeština 6. ročník (select_one).
 *
 * NEZÁVISLÝ SOLVER: klasifikátor klíčových slov nad TEXTEM ukázky/vět ve
 * ZNĚNÍ OTÁZKY (resp. v `options`), ne nad interními daty generátoru.
 * Slovníky (termíny/jednotky pro odborný, obrazné/personifikační výrazy pro
 * umělecký, dějová slova pro vyprávění) jsou tu přepsané ručně a nezávisle
 * na `_shared.ts` ani na bankách v `popisProstyOdbornyUmelecky.ts`.
 */
const topic = POPIS_PROSTY_ODBORNY_UMELECKY[0];

// ── Nezávislý klasifikátor ───────────────────────────────────────────────────
const DEJOVE_MARK = ["pak", "najednou", "potom"];
const HOVOROVE_MARK = ["fakt", "viď?"];
const ODBORNE_ZNAKY = [
  "centimetr", "kilogram", "palc", "miliampérhodin", "pixel", "hektar", "gram",
  "přehazovačk", "úbor", "jazykovité", "trubkovité", "kohoutkové výšky", "podsad",
  "úhlopříčk", "kapacita baterie", "rozlišení", "kotoučové brzdy", "srdčitý tvar",
  "pilovitý okraj", "objem", "litr", "rozlohu", "hloubku",
];
const OBRAZNE_MARK = [
  "jako", "odpočívalo", "rozpínala", "šuměl", "usmívala", "choulila", "hleděl",
  "dýchala", "šeptal", "zářily", "mával", "náruč", "unavené",
];

type KlasDruh = "prosty" | "odborny" | "umelecky" | "vypraveni";

function klasifikuj(text: string): KlasDruh {
  const low = text.toLowerCase();
  if (DEJOVE_MARK.some((m) => low.includes(m))) return "vypraveni";
  if (ODBORNE_ZNAKY.some((k) => low.includes(k))) return "odborny";
  if (OBRAZNE_MARK.some((k) => low.includes(k))) return "umelecky";
  return "prosty";
}

/** L3(b): má věta znak, který do zadaného stylu NEPATŘÍ? */
function poruseStyl(target: "odborny" | "umelecky", sentence: string): boolean {
  const low = sentence.toLowerCase();
  if (target === "odborny") {
    return OBRAZNE_MARK.some((k) => low.includes(k)) || HOVOROVE_MARK.some((k) => low.includes(k));
  }
  return HOVOROVE_MARK.some((k) => low.includes(k)) || DEJOVE_MARK.some((k) => low.includes(k));
}

const LABEL_TO_DRUH: Record<string, KlasDruh> = {
  "popis prostý": "prosty",
  "popis odborný": "odborny",
  "popis umělecký": "umelecky",
  vyprávění: "vypraveni",
};

/** L3(a) — nezávisle přepsaná tabulka situace → očekávaný druh (viz spec). */
const SITUACE_DRUH: Record<string, KlasDruh> = {
  "heslo o kole do žákovské encyklopedie techniky": "odborny",
  "inzerát na ztraceného psa ve školním časopise": "prosty",
  "úryvek do povídky o staré lípě pro literární soutěž": "umelecky",
  "popis kopretiny do přírodopisného atlasu": "odborny",
  "inzerát na ztracený batoh ve školním časopise": "prosty",
  "úryvek do povídky o rybníku pro literární soutěž": "umelecky",
};

interface SolveResult {
  kind: string;
}

/** Nezávislý solver — vrací null, když otázku nerozpozná. */
function solve(t: PracticeTask): SolveResult | null {
  const q = t.question;
  let m: RegExpMatchArray | null;

  // L1
  if ((m = q.match(/^Jaký druh popisu je tato ukázka\? „(.+)“$/))) {
    const text = m[1];
    expect(LABEL_TO_DRUH[t.correctAnswer], `L1 klíč: ${t.correctAnswer}`).toBe(klasifikuj(text));
    return { kind: "L1" };
  }

  // L2(a) — slovní spojení prozrazující styl
  if ((m = q.match(/^Ukázka „(.+)“ je skoro celá napsaná obyčejně\. Které slovní spojení z ní by se nejlépe hodilo do (odborného|uměleckého) popisu\?$/))) {
    const [, text, targetWord] = m;
    const target = targetWord === "odborného" ? "odborny" : "umelecky";
    expect(text.includes(t.correctAnswer), `klíč není v ukázce: ${t.correctAnswer}`).toBe(true);
    const marker = target === "odborny" ? ODBORNE_ZNAKY : OBRAZNE_MARK;
    expect(
      marker.some((k) => t.correctAnswer.toLowerCase().includes(k)),
      `klíč „${t.correctAnswer}“ nemá znak ${target}`,
    ).toBe(true);
    for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
      expect(text.includes(d), `distraktor není v ukázce: ${d}`).toBe(true);
    }
    return { kind: "L2a" };
  }

  // L2(b) — která věta se hodí do odborného/uměleckého popisu
  if ((m = q.match(/^Která věta by se hodila do (odborného|uměleckého) popisu (.+)\?$/))) {
    const [, targetWord] = m;
    const target = targetWord === "odborného" ? "odborny" : "umelecky";
    const marker = target === "odborny" ? ODBORNE_ZNAKY : OBRAZNE_MARK;
    expect(
      marker.some((k) => t.correctAnswer.toLowerCase().includes(k)),
      `klíč „${t.correctAnswer}“ nemá znak ${target}`,
    ).toBe(true);
    return { kind: "L2b" };
  }

  // L2(c) — otázky na znaky druhů; nezávisle přepsaná tabulka otázka → klíč
  const L2C: Record<string, string> = {
    "Čím se odborný popis liší od prostého?": "Odborný má termíny a měřené údaje; prostý jen běžná slova.",
    "Čím se umělecký popis liší od prostého?": "Umělecký má obrazná pojmenování a cit; prostý jen věcně popisuje.",
    "Čím se umělecký popis liší od odborného?": "Umělecký je obrazný a citový; odborný věcný, přesný a neosobní.",
    "Který znak NEpatří k odbornému popisu?": "přirovnání a citově zabarvená slova",
    "Který znak NEpatří k uměleckému popisu?": "údaje změřené v centimetrech a kilogramech",
    "Co mají odborný a prostý popis společné?": "Oba jsou věcné a nepoužívají obrazná pojmenování.",
    "Do kterého textu se nejlíp hodí odborný popis?": "do hesla v učebnici přírodopisu",
  };
  if (q in L2C) {
    expect(t.correctAnswer, `L2c: ${q}`).toBe(L2C[q]);
    return { kind: "L2c" };
  }

  // L3(a) — komunikační situace → který úryvek se hodí
  if ((m = q.match(/^Vybíráš text pro tuhle situaci: (.+)\. Který ze čtyř úryvků se do ní nejlíp hodí\?$/))) {
    const situace = m[1];
    const expected = SITUACE_DRUH[situace];
    expect(expected, `neznámá situace v nezávislé tabulce: ${situace}`).toBeDefined();
    expect(klasifikuj(t.correctAnswer), `L3a situace „${situace}“`).toBe(expected);
    return { kind: "L3a" };
  }

  // L3(b) — vetřelec: která věta poruší jednotný styl
  if ((m = q.match(/^Tři z nabízených vět (o .+?) tvoří jednotný (odborný|umělecký) popis, jedna z vět styl poruší\. Která to je\?$/))) {
    const [, , targetLabel] = m;
    const target = targetLabel === "odborný" ? "odborny" : "umelecky";
    expect(poruseStyl(target, t.correctAnswer), `vetřelec neporušuje styl: ${t.correctAnswer}`).toBe(true);
    for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
      expect(poruseStyl(target, d), `distraktor by neměl porušovat styl: ${d}`).toBe(false);
    }
    return { kind: "L3b" };
  }

  // L3(c) — dva popisy vedle sebe: co platí o jejich rozdílu
  if ((m = q.match(/^Popis A: „(.+)“ Popis B: „(.+)“ Co platí o rozdílu mezi popisem A a popisem B\?$/))) {
    const [, aText, bText] = m;
    const ga = klasifikuj(aText);
    const gb = klasifikuj(bText);
    const ADJ: Record<string, string> = { prosty: "prostý", odborny: "odborný", umelecky: "umělecký" };
    expect(["prosty", "odborny", "umelecky"], `A není popis: ${aText}`).toContain(ga);
    expect(["prosty", "odborny", "umelecky"], `B není popis: ${bText}`).toContain(gb);
    expect(ga, "A a B musí být různé druhy").not.toBe(gb);
    expect(t.correctAnswer.startsWith(`A je ${ADJ[ga]} popis`), `klíč: ${t.correctAnswer}`).toBe(true);
    expect(t.correctAnswer.includes(`B je ${ADJ[gb]} popis`), `klíč: ${t.correctAnswer}`).toBe(true);
    return { kind: "L3c" };
  }

  return null;
}

describe("Popis prostý/odborný/umělecký — metadata", () => {
  it("čeština g6, select_one, Komunikační a slohová výchova / Slohová výchova", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-popis-prosty-odborny-umelecky-6");
    expect(topic.category).toBe("Komunikační a slohová výchova");
    expect(topic.topic).toBe("Slohová výchova");
    expect(topic.rvpNodeId).toBe("g6-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-prosty-odborny-umelecky");
  });
});

describe.each([1, 2, 3])("Popis prostý/odborný/umělecký — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const keys = new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}`));
    expect(keys.size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, správná je mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      for (const key of Object.keys(t.optionFeedback!)) {
        expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
        expect(key).not.toBe(t.correctAnswer);
      }
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
    }
  });

  it("nápověda: 2 unikátní, neprozrazují correctAnswer ani slova prostý/odborný/umělecký jako verdikt", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints ?? []) {
        expect(h, `hint leak (correctAnswer): ${t.question}`).not.toContain(t.correctAnswer);
        expect(/prost[ýáéí]|odborn[ýáéí]|uměleck[ýáéí]/i.test(h), `hint jmenuje druh jako verdikt: "${h}"`).toBe(false);
      }
    }
  });

  it("každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsiJeKlic = tasks.filter((t) => {
      const maxLen = Math.max(...t.options!.map((o) => o.length));
      return t.correctAnswer.length === maxLen;
    }).length;
    expect(nejdelsiJeKlic / tasks.length, "klíč = nejdelší možnost příliš často").toBeLessThan(0.8);
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s klasifikátorem klíčových slov", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
    }
  });
});

describe("Popis prostý/odborný/umělecký — gradace a rozsah podle úrovně", () => {
  it("L1 a L3 otázky jsou textově disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });

  it("L1: klíč je vždy jeden ze tří druhů popisu, nikdy 'vyprávění'", () => {
    for (const t of topic.generator(1)) {
      expect(["popis prostý", "popis odborný", "popis umělecký"]).toContain(t.correctAnswer);
    }
  });

  it("L1: 'vyprávění' se objevuje jako distraktor (látka na rozlišení popisu od vyprávění)", () => {
    const l1 = topic.generator(1);
    expect(l1.some((t) => t.options?.includes("vyprávění"))).toBe(true);
  });

  it("L1: obsahuje klíč všech tří druhů (rotace v pevné škále)", () => {
    const keys = new Set(topic.generator(1).map((t) => t.correctAnswer));
    expect(keys.has("popis prostý")).toBe(true);
    expect(keys.has("popis odborný")).toBe(true);
    expect(keys.has("popis umělecký")).toBe(true);
  });

  it("L3: obsahuje všechny tři šablony (situace, styl-vetřelec, srovnání A/B)", () => {
    const l3 = topic.generator(3);
    expect(l3.some((t) => t.question.startsWith("Vybíráš text pro tuhle situaci"))).toBe(true);
    expect(l3.some((t) => t.question.startsWith("Tři z nabízených vět"))).toBe(true);
    expect(l3.some((t) => t.question.startsWith("Popis A:"))).toBe(true);
  });

  it("L2: obsahuje všechny tři šablony (znak→druh, věta do popisu, srovnání znaků)", () => {
    const l2 = topic.generator(2);
    expect(l2.some((t) => t.question.includes("Které slovní spojení z ní"))).toBe(true);
    expect(l2.some((t) => t.question.startsWith("Která věta by se hodila"))).toBe(true);
    expect(l2.some((t) => /^(Čím se|Který znak NEpatří|Co mají|Do kterého textu)/.test(t.question))).toBe(true);
  });
});
