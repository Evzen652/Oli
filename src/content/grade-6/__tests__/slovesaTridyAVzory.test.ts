import { describe, it, expect } from "vitest";
import { SLOVESA_TRIDY_A_VZORY } from "../cjl/slovesaTridyAVzory";
import type { PracticeTask } from "@/lib/types";

/**
 * Slovesa — třídy a vzory (select_one, jazyková výchova, 6. ročník).
 *
 * NEZÁVISLÝ SOLVER: tabulka infinitiv→3. osoba je napsaná znovu tady (jiný
 * zdroj než generátor) a klasifikace třídy/vzoru se počítá z pravidel
 * (koncovka 3. osoby + podtypy podle infinitivu), ne přečtením klíče
 * generátoru. Pokrývá L1(b) třídu, L2 a L3(a) třídu+vzor, L1(a) osobu
 * a číslo přes rozpoznání podmětu, L3(b) inverzi přes týž klasifikátor
 * aplikovaný na všechny 4 nabídnuté infinitivy a L3(c) čas/vid přes
 * pevně danou (a nezávisle vypsanou) množinu dokonavých tvarů.
 */
const topic = SLOVESA_TRIDY_A_VZORY[0];

const label = (trida: number, vzor: string) => `${trida}. třída, vzor ${vzor}`;

// ── nezávislá tabulka: infinitiv → 3. osoba j. č. (přepsáno ručně podle Pravidel) ──
const TVAR3: Record<string, string> = {
  vést: "vede", krást: "krade", nést: "nese", mést: "mete",
  brát: "bere", prát: "pere",
  psát: "píše", mazat: "maže", česat: "češe", řezat: "řeže", lízat: "líže",
  péct: "peče", moci: "může", téct: "teče", vléct: "vleče",
  zavřít: "zavře", třít: "tře", prostřít: "prostře",
  tisknout: "tiskne", zamknout: "zamkne", sednout: "sedne", říznout: "řízne",
  minout: "mine", plynout: "plyne", hynout: "hyne", kynout: "kyne",
  začít: "začne",
  krýt: "kryje", pít: "pije", hrát: "hraje", zout: "zuje", šít: "šije", mýt: "myje",
  bít: "bije", přát: "přeje", hřát: "hřeje",
  kupovat: "kupuje", pracovat: "pracuje", malovat: "maluje", cestovat: "cestuje", tancovat: "tancuje",
  prosit: "prosí", nosit: "nosí", vozit: "vozí", chodit: "chodí", vařit: "vaří",
  trpět: "trpí", mlčet: "mlčí", sedět: "sedí", ležet: "leží", letět: "letí", vidět: "vidí",
  sázet: "sází", házet: "hází", pouštět: "pouští", střílet: "střílí", vracet: "vrací", rozumět: "rozumí",
  dělat: "dělá", znát: "zná", mít: "má", volat: "volá", hledat: "hledá", čekat: "čeká",
};
// 3. osoba množného čísla — jen tam, kde rozhoduje mezi trpí a sází (4. třída, -et/-ět).
const MN3: Record<string, string> = {
  sázet: "sázejí", házet: "házejí", pouštět: "pouštějí", střílet: "střílejí", vracet: "vracejí", rozumět: "rozumějí",
  trpět: "trpí", mlčet: "mlčí", sedět: "sedí", ležet: "leží", letět: "letí", vidět: "vidí",
};
const BERE = new Set(["brát", "prát"]);
const MAZE = new Set(["psát", "mazat", "česat", "řezat", "lízat"]);

/** Klasifikátor: koncovka 3. osoby → třída, podtypy → konkrétní vzor. */
function klasifikuj(infinitiv: string, tvar3: string): { trida: number; vzor: string } {
  if (/ne$/.test(tvar3)) {
    if (/ít$/.test(infinitiv)) return { trida: 2, vzor: "začne" };
    const kmen = infinitiv.replace(/nout$/, "");
    const posledni = kmen[kmen.length - 1];
    const samohlaska = /[aeiouyáéíóúůý]/i.test(posledni);
    return { trida: 2, vzor: samohlaska ? "mine" : "tiskne" };
  }
  if (/je$/.test(tvar3)) return { trida: 3, vzor: /ovat$/.test(infinitiv) ? "kupuje" : "kryje" };
  if (/í$/.test(tvar3)) {
    if (/it$/.test(infinitiv)) return { trida: 4, vzor: "prosí" };
    const mn = MN3[infinitiv];
    return { trida: 4, vzor: mn && /[eě]jí$/.test(mn) ? "sází" : "trpí" };
  }
  if (/á$/.test(tvar3)) return { trida: 5, vzor: "dělá" };
  // zbývá -e (1. třída), rozhodni podtyp
  if (/(ct|ci)$/.test(infinitiv)) return { trida: 1, vzor: "peče" };
  if (/řít$/.test(infinitiv)) return { trida: 1, vzor: "umře" };
  if (BERE.has(infinitiv)) return { trida: 1, vzor: "bere" };
  if (MAZE.has(infinitiv)) return { trida: 1, vzor: "maže" };
  return { trida: 1, vzor: "nese" };
}

describe("Slovesa — třídy a vzory: metadata", () => {
  it("čeština g6, select_one, Jazyková výchova / Tvarosloví", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-slovesa-tridy-a-vzory-6");
    expect(topic.category).toBe("Jazyková výchova");
    expect(topic.topic).toBe("Tvarosloví");
  });
});

describe.each([1, 2, 3])("Slovesa — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, správná je mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("chybový model: každý distraktor má optionFeedback, správná ne", () => {
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

  it("nápověda neprozrazuje výsledek a je unikátní v rámci úlohy", () => {
    for (const t of tasks) {
      expect((t.hints ?? []).length).toBeGreaterThanOrEqual(2);
      for (const h of t.hints ?? []) {
        expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      }
      expect(t.hints![0]).not.toBe(t.hints![1]);
    }
  });

  it("odpověď se nevyskytuje v zadání a každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.question, `giveaway: ${t.question}`).not.toContain(t.correctAnswer);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });
});

// ── NEZÁVISLÝ SOLVER ────────────────────────────────────────────────────────
describe("Slovesa — nezávislý solver: L2 (vzor podle 3. osoby ve větě)", () => {
  const tasks = topic.generator(2);
  it("klíč souhlasí s klasifikátorem", () => {
    expect(tasks.length).toBeGreaterThan(0);
    for (const t of tasks) {
      const m = t.question.match(/^Podle kterého vzoru se časuje sloveso ve větě „.*‚(\S+)‘.*“\?$/);
      expect(m, `solver nerozpoznal větu: ${t.question}`).not.toBeNull();
      const forma = m![1];
      const inf = Object.keys(TVAR3).find((i) => TVAR3[i] === forma || pastForms(i).includes(forma));
      expect(inf, `solver nenašel infinitiv pro tvar „${forma}“`).toBeTruthy();
      const { trida, vzor } = klasifikuj(inf!, TVAR3[inf!]);
      expect(t.correctAnswer, t.question).toBe(label(trida, vzor));
    }
  });
});

// Minulé/infinitivní tvary použité ve větách L2 — nezávisle přiřazené k infinitivu
// (jiná cesta než generátor: generátor tvar odvozuje z vlastní banky vět).
function pastForms(inf: string): string[] {
  const MAP: Record<string, string[]> = {
    vést: ["vedl"], krást: ["kradl"], mést: ["metl"],
    prát: ["prala"],
    psát: ["psala"], česat: ["česala"], řezat: ["řezal"], lízat: ["lízala"],
    moci: ["mohl"], téct: ["tekla"], vléct: ["vlekl"],
    zavřít: ["zavřel"], třít: ["třela"],
    zamknout: ["zamknout"], sednout: ["sedl"], říznout: ["řízl"], // infinitiv v zadání "Musím zamknout kolo."
    plynout: ["plynul"], hynout: ["hynuly"], kynout: ["kynulo"],
    pít: ["pil"], hrát: ["hrál"], zout: ["zul"], šít: ["šila"], mýt: ["myl"],
    pracovat: ["pracoval"], malovat: ["maloval"], cestovat: ["cestovala"], tancovat: ["tancovaly"],
    nosit: ["nosil"], vozit: ["vozil"], chodit: ["chodil"], vařit: ["vařila"],
    mlčet: ["mlčel"], sedět: ["seděl"], ležet: ["ležela"], letět: ["letělo"],
    házet: ["házel"], pouštět: ["pouštěl"], střílet: ["střílel"], vracet: ["vracel"],
    znát: ["znal"], mít: ["měl"], volat: ["volala"], hledat: ["hledal"],
  };
  return MAP[inf] ?? [];
}

describe("Slovesa — nezávislý solver: L1(b) třída podle koncovky", () => {
  const tasks = topic.generator(1).filter((t) => /^Sloveso .+ má ve 3\. osobě tvar/.test(t.question));
  it("klíč (jen třída) souhlasí s koncovkou 3. osoby", () => {
    expect(tasks.length).toBeGreaterThan(0);
    for (const t of tasks) {
      const m = t.question.match(/^Sloveso (\S+) má ve 3\. osobě tvar (\S+)\. Do které třídy patří\?$/);
      expect(m, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      const [, infinitiv, tvar3] = m!;
      const { trida } = klasifikuj(infinitiv, tvar3.replace(/\.$/, ""));
      expect(t.correctAnswer, t.question).toBe(`${trida}. třída`);
    }
  });
});

describe("Slovesa — nezávislý solver: L1(a) osoba a číslo", () => {
  const tasks = topic.generator(1).filter((t) => t.question.startsWith("Urči osobu a číslo"));
  function osobaSolve(veta: string): string {
    if (/^Já /.test(veta)) return "1. osoba, jednotné číslo";
    if (/^Ty /.test(veta)) return "2. osoba, jednotné číslo";
    if (/^My /.test(veta)) return "1. osoba, množné číslo";
    if (/^Vy /.test(veta)) return "2. osoba, množné číslo";
    const mnozne = ["Sourozenci", "Kamarádi"];
    return mnozne.some((m) => veta.startsWith(m)) ? "3. osoba, množné číslo" : "3. osoba, jednotné číslo";
  }
  it("klíč souhlasí s podmětem věty", () => {
    expect(tasks.length).toBeGreaterThan(0);
    for (const t of tasks) {
      const m = t.question.match(/ve větě „(.+)“\.$/);
      expect(m, `solver nerozpoznal větu: ${t.question}`).not.toBeNull();
      expect(t.correctAnswer, t.question).toBe(osobaSolve(m![1]));
    }
  });
});

describe("Slovesa — nezávislý solver: L3(a) past infinitivu", () => {
  const tasks = topic.generator(3).filter((t) => t.question.startsWith("Podle kterého vzoru"));
  it("klíč podle 3. osoby, ne podle infinitivu", () => {
    expect(tasks.length).toBeGreaterThan(0);
    for (const t of tasks) {
      const m = t.question.match(/^Podle kterého vzoru se časuje sloveso „(\S+)“\?$/);
      expect(m, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      const inf = m![1];
      expect(TVAR3[inf], `chybí tvar3 pro ${inf}`).toBeTruthy();
      const { trida, vzor } = klasifikuj(inf, TVAR3[inf]);
      expect(t.correctAnswer, t.question).toBe(label(trida, vzor));
    }
  });
});

describe("Slovesa — nezávislý solver: L3(b) inverze (odlišné sloveso)", () => {
  const tasks = topic.generator(3).filter((t) => t.question.includes("NEčasuje podle stejného vzoru"));
  it("klíč = jediný infinitiv se skutečně jiným vzorem", () => {
    expect(tasks.length).toBeGreaterThan(0);
    for (const t of tasks) {
      const infy = t.options!.map((o) => o.match(/„(.+)“/)![1]);
      const vzory = infy.map((inf) => {
        expect(TVAR3[inf], `chybí tvar3 pro ${inf}`).toBeTruthy();
        return klasifikuj(inf, TVAR3[inf]).vzor;
      });
      const counts = new Map<string, number>();
      vzory.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
      const odlisnyVzor = [...counts.entries()].find(([, n]) => n === 1)?.[0];
      expect(odlisnyVzor, `žádný jasně odlišný vzor v ${t.question}`).toBeTruthy();
      const idx = vzory.indexOf(odlisnyVzor!);
      expect(t.correctAnswer, t.question).toBe(t.options![idx]);
    }
  });
});

describe("Slovesa — nezávislý solver: L3(c) čas a vid", () => {
  const tasks = topic.generator(3).filter((t) => t.question.startsWith("Jaký čas a vid"));
  const DOKONAVE = new Set(["dopíšu", "přinese", "udělám", "koupí", "napíšu"]);
  function solve(forma: string): string {
    if (/^budu /.test(forma)) return "čas budoucí, vid nedokonavý";
    if (DOKONAVE.has(forma)) return "čas budoucí, vid dokonavý";
    return "čas přítomný, vid nedokonavý";
  }
  it("klíč souhlasí s nezávislou klasifikací tvaru", () => {
    expect(tasks.length).toBeGreaterThan(0);
    for (const t of tasks) {
      const m = t.question.match(/^Jaký čas a vid má sloveso „(.+?)“ ve větě/);
      expect(m, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      expect(t.correctAnswer, t.question).toBe(solve(m![1]));
    }
  });
});

describe("Slovesa — gradace L1 ≠ L3 (disjunktní znění)", () => {
  it("L1 začíná „Urči…“ nebo „Sloveso … má ve 3. osobě…“; L3 nikdy", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    expect(l1.every((q) => /^Urči /.test(q) || /^Sloveso .+ má ve 3\. osobě/.test(q))).toBe(true);
  });
  it("L3 začíná „Podle kterého…“, „Které sloveso…“ nebo „Jaký čas a vid…“; L1 nikdy", () => {
    const l3 = topic.generator(3).map((t) => t.question);
    expect(l3.every((q) => /^Podle kterého vzoru se časuje sloveso „|^Které sloveso|^Jaký čas a vid/.test(q))).toBe(true);
  });
  it("množiny otázek L1 a L3 jsou disjunktní", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const q3 = new Set(topic.generator(3).map((t) => t.question));
    const shared = [...q3].filter((q) => q1.has(q));
    expect(shared, `společné otázky L1∩L3: ${shared}`).toHaveLength(0);
  });
});

describe("Slovesa — L2 neobsahuje samotná vzorová slovesa (prozrazení shodou slov)", () => {
  it("zvýrazněný tvar ve větě není minulý tvar ani infinitiv vzorového slovesa", () => {
    const VZOROVE = ["nést", "brát", "mazat", "péct", "umřít", "tisknout", "minout", "začít", "krýt", "kupovat", "prosit", "trpět", "sázet", "dělat"];
    const zakazane = new Set(VZOROVE.flatMap((v) => [v, ...pastForms(v)]));
    for (const t of topic.generator(2)) {
      const forma = t.question.match(/‚(\S+)‘/)![1];
      const inf = Object.keys(TVAR3).find((i) => pastForms(i).includes(forma));
      expect(inf && VZOROVE.includes(inf), t.question).toBeFalsy();
      expect(zakazane.has(forma), t.question).toBe(false);
    }
  });
});
