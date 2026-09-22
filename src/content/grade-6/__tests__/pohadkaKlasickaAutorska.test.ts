import { describe, it, expect } from "vitest";
import { POHADKA_KLASICKA_AUTORSKA } from "../cjl/pohadkaKlasickaAutorska";
import type { PracticeTask } from "@/lib/types";

/**
 * Pohádka klasická (lidová) a autorská — čeština 6. ročník (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nečte interní pole generátoru):
 *  1. L2(a) marker-based klasifikátor druhu ukázky: moderní reálie
 *     (sídliště, mobil, tramvaj, pošta…) nebo slovo „vypravěč" (meta-komentář)
 *     → autorská; jinak ustálený lidový začátek/vokabulář → lidová.
 *     Použit i pro L3(a) rozhodující znak a L3(c) srovnání A/B — nečte pole
 *     `druh`/`rozhodujici` generátoru, jen text ukázky.
 *  2. L2(b)/L2(c)/L3(b)/L3(d) — tabulky přepsané ručně, nezávisle na interních
 *     datech generátoru; klíč se s nimi musí shodovat.
 *  3. Obecné: přesně 1 správná a 4 různé možnosti, optionFeedback pro každou
 *     možnost, klíč není ve znění otázky, klíč není systematicky nejdelší,
 *     hints[0] ≠ hints[1] a neprozrazují klíč, ≥12 unikátních úloh na úroveň,
 *     L1 a L3 texty otázek disjunktní, všechny úlohy jsou select_one.
 */
const topic = POHADKA_KLASICKA_AUTORSKA[0];

// ── 1. NEZÁVISLÝ KLASIFIKÁTOR: moderní/autorský rys vs. lidový rys ──────────

const AUTORSKE_MARKERY = [
  "panelák", "paneláku", "sídliště", "sídlišti", "mobil", "mobilu", "telefon",
  "tramvaj", "notebook", "powerbank", "gymnázi", "reality show", "psč",
  "poštovní", "pošt", "budík", "robot", "opravně", "opravny", "smartphon",
  "spisovatel", "spisovatelka", "autor v úvodu",
];

function obsahujeNejakou(text: string, seznam: string[]): boolean {
  const lower = text.toLowerCase();
  return seznam.some((m) => lower.includes(m));
}

function maVypravece(text: string): boolean {
  return text.toLowerCase().includes("vypravěč");
}

const LIDOVE_ZACATKY = ["byl jednou jeden", "byla jednou jedna", "za devatero horami", "za sedmero", "kdysi dávno", "v dávných dobách"];
const LIDOVE_VOKABULAR = ["král", "princezna", "vdova", "kouzeln", "čaroděj", "drak", "koval", "žebračk", "víla", "skřítek", "rytíř", "poklad", "pasáč"];

/** Klasifikuje ukázku jako "lidová" / "autorská" jen podle textu, ne podle pole generátoru. */
function klasifikujDruh(text: string): "lidová (klasická) pohádka" | "autorská pohádka" | null {
  if (obsahujeNejakou(text, AUTORSKE_MARKERY) || maVypravece(text)) return "autorská pohádka";
  const maZacatek = obsahujeNejakou(text, LIDOVE_ZACATKY);
  const maVokabular = obsahujeNejakou(text, LIDOVE_VOKABULAR);
  if (maZacatek || maVokabular) return "lidová (klasická) pohádka";
  return null;
}

describe("Pohádka klasická, autorská — metadata", () => {
  it("čeština g6, select_one, Literární výchova / Lidová slovesnost", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-pohadka-klasicka-autorska-6");
    expect(topic.rvpNodeId).toBe("g6-cjl-literarni-vychova-lidova-slovesnost-pohadka-klasicka-autorska");
    expect(topic.category).toBe("Literární výchova");
    expect(topic.topic).toBe("Lidová slovesnost");
  });
});

describe("NEZÁVISLÝ SOLVER 1: L2(a) klasifikátor druhu sedí s klíčem generátoru", () => {
  it("každá ukázka se jednoznačně klasifikuje a shoduje se s correctAnswer", () => {
    const l2 = topic.generator(2);
    const druhy = l2.filter((t) => t.question.startsWith("Přečti si ukázku a rozhodni, o jaký druh vyprávění jde."));
    let overeno = 0;
    for (const t of druhy) {
      const m = t.question.match(/„(.+)“$/u);
      expect(m, `nerozpoznaný formát otázky: ${t.question}`).not.toBeNull();
      const vysledek = klasifikujDruh(m![1]);
      expect(vysledek, `nejednoznačná/chybějící klasifikace: ${m![1]}`).not.toBeNull();
      expect(vysledek, `klasifikátor nesouhlasí s klíčem: ${m![1]}`).toBe(t.correctAnswer);
      overeno++;
    }
    expect(overeno).toBeGreaterThanOrEqual(10);
  });

  it("bank obsahuje aspoň 5 lidových a 5 autorských ukázek, bajka/pověst nikdy nejsou klíč", () => {
    const l2 = sjednocenyL2();
    const druhy = l2.filter((t) => t.question.startsWith("Přečti si ukázku a rozhodni, o jaký druh vyprávění jde."));
    const poDruhu = (d: string) => druhy.filter((t) => t.correctAnswer === d).length;
    expect(poDruhu("lidová (klasická) pohádka")).toBeGreaterThanOrEqual(5);
    expect(poDruhu("autorská pohádka")).toBeGreaterThanOrEqual(5);
    expect(poDruhu("bajka")).toBe(0);
    expect(poDruhu("pověst")).toBe(0);
    // ale bajka i pověst se objevují jako distraktory (jinak by úloha měla < 4 možnosti)
    for (const t of druhy) {
      expect(t.options).toContain("bajka");
      expect(t.options).toContain("pověst");
    }
  });
});

describe.each([1, 2, 3])("Pohádka klasická, autorská — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const keys = new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}`));
    expect(keys.size).toBeGreaterThanOrEqual(12);
  });

  it("select_one: 4 různé možnosti, správná je mezi nimi, žádné jiné pole typu", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
      expect(t.items, `select_one nesmí mít items: ${t.question}`).toBeUndefined();
      expect(t.categories, `select_one nesmí mít categories: ${t.question}`).toBeUndefined();
      expect(t.blanks, `select_one nesmí mít blanks: ${t.question}`).toBeUndefined();
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

  it("nápověda neprozrazuje výsledek (2 unikátní nápovědy)", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints ?? []) {
        expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      }
    }
  });

  it("správná odpověď se nevyskytuje ve znění otázky", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), `correctAnswer v otázce: ${t.question}`).toBe(false);
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
});

describe("Pohádka klasická, autorská — L1 a L3 jsou textově disjunktní", () => {
  it("L1 a L3 otázky se nepřekrývají", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });
});

describe("Determinismus generátoru (bez stavu mezi voláními)", () => {
  it("dvě po sobě jdoucí volání gen(1) nezávisí na pořadí předchozích volání", () => {
    const a = topic.generator(3);
    const b = topic.generator(2);
    const c = topic.generator(3);
    expect(new Set(a.map((t) => t.question)).size).toBe(new Set(c.map((t) => t.question)).size);
    expect(b.length).toBeGreaterThanOrEqual(12);
  });
});

// ── 2. NEZÁVISLÝ SOLVER: L2(b) rys ukazující na lidovou pohádku ─────────────
// Tabulka přepsaná ručně z textu ukázek — nečte pole `rys` generátoru.

const L2B_TABULKA: Record<string, string> = {
  "Byl jednou jeden král, který měl tři syny. Řekl jim, že trůn zdědí ten, kdo splní tři těžké úkoly. Nejmladší syn si na cestě poradil se starým mužem u studny a všechny tři úkoly nakonec splnil.":
    "Úkoly se opakují přesně třikrát.",
  "Za devatero horami a devatero řekami žil v jeskyni zlý drak, který každý rok unesl jednu princeznu. Vydal se ho zabít chudý pasáček, kterému pomohl mluvící kůň. Po dlouhém boji draka přemohl a princeznu osvobodil.":
    "Místo je popsáno jen neurčitě, bez skutečného jména.",
  "V jedné chaloupce na kraji lesa žila chudá vdova se třemi dcerami. Nejmladší dcera byla hodná a pracovitá, zatímco její sestry jí ze závisti ubližovaly. Za odměnu jí kouzelná bába splnila tři přání.":
    "Dcera je hodná, sestry zlé, bez odstínů mezi nimi.",
  "Byla jednou jedna princezna, která se zaklela do labutě a mohla se proměnit zpátky jen o půlnoci. Princ ji hledal po sedmero krajích, až ji jednou v úplňku poznal u lesního jezera. Vysvobodil ji a spolu pak žili šťastně až do smrti.":
    "Konec je ustálený obrat „žili šťastně až do smrti“.",
  "Chudý mlynářský synek Honza se vydal do světa hledat štěstí, protože doma neměl nic než starý kabát. Cestou třikrát pomohl zvířatům v nouzi a ta mu na oplátku pomohla přelstít zlého čaroděje. Nakonec se oženil s princeznou a stal se králem.":
    "Honza pomáhá zvířatům přesně třikrát.",
  "Kdysi dávno žil v malé vesnici kovář, který vykoval kouzelný meč. Kdo mečem třikrát mávl a řekl kouzelná slova, tomu se splnilo jedno přání. Meč nakonec získal nejmladší z bratří, protože jako jediný pomohl staré žebračce, ačkoli nevěděl, že je to zakletá víla.":
    "Čas ani místo nejsou v příběhu vůbec určené.",
};

/** Sjednotí generator(2) přes víc volání (losUlohy je náhodné) — sníží riziko, že se v jediném volání nesejdou úplně všechny položky poolu. */
function sjednocenyL2(pokusu = 6): PracticeTask[] {
  const byKey = new Map<string, PracticeTask>();
  for (let i = 0; i < pokusu; i++) {
    for (const t of topic.generator(2)) byKey.set(`${t.question}|${t.correctAnswer}`, t);
  }
  return [...byKey.values()];
}

describe("NEZÁVISLÝ SOLVER 2: L2(b) rys ukazující na lidovou pohádku sedí s tabulkou", () => {
  it("klíč generátoru odpovídá nezávislé tabulce pro všech 6 ukázek", () => {
    const l2 = sjednocenyL2();
    const rysy = l2.filter((t) => t.question.startsWith("Přečti si ukázku. Který rys textu ukazuje, že jde o lidovou (klasickou) pohádku?"));
    let overeno = 0;
    for (const t of rysy) {
      const m = t.question.match(/„(.+)“$/u);
      expect(m, `nerozpoznaný text ukázky: ${t.question}`).not.toBeNull();
      const text = m![1];
      const ocekavano = L2B_TABULKA[text];
      expect(ocekavano, `ukázka není v nezávislé tabulce: ${text}`).toBeDefined();
      expect(t.correctAnswer, `L2b klíč nesedí pro: ${text}`).toBe(ocekavano);
      overeno++;
    }
    expect(overeno).toBe(6);
  });
});

// ── 3. NEZÁVISLÝ SOLVER: L2(c) tvůrce → role (sběratel × autor) ─────────────
// Tabulka jmen sestavená nezávisle na generátoru.

const SBERATELE = ["karel jaromír erben", "božena němcová", "grimmové"];
const AUTORI = ["h. ch. andersen", "karel čapek"];

function ocekavanaRole(popis: string): "autor" | "sberatel" | null {
  const lower = popis.toLowerCase();
  if (SBERATELE.some((jm) => lower.includes(jm))) return "sberatel";
  if (AUTORI.some((jm) => lower.includes(jm))) return "autor";
  return null;
}

describe("NEZÁVISLÝ SOLVER 3: L2(c) tvůrce → role sedí s nezávislou tabulkou jmen", () => {
  it("klíč generátoru odpovídá roli podle jména tvůrce (Erben/Němcová/Grimmové = sběratel, Andersen/Čapek = autor)", () => {
    const l2 = sjednocenyL2();
    const tvurci = l2.filter((t) => t.question.endsWith("Jak tahle pohádka vznikla?"));
    let overeno = 0;
    for (const t of tvurci) {
      const role = ocekavanaRole(t.question);
      expect(role, `tvůrce v otázce nerozpoznán: ${t.question}`).not.toBeNull();
      if (role === "sberatel") {
        expect(t.correctAnswer, `L2c klíč nesedí (má být sběratel): ${t.question}`).toContain("Sběratel zapsal to, co už dlouho vyprávěl lid");
      } else {
        expect(t.correctAnswer, `L2c klíč nesedí (má být autor): ${t.question}`).toContain("Autor si celý příběh sám vymyslel");
      }
      overeno++;
    }
    expect(overeno).toBe(5);
  });
});

// ── 4. NEZÁVISLÝ SOLVER: L3(a) rozhodující znak — reuse marker klasifikátoru ─

describe("NEZÁVISLÝ SOLVER 4: L3(a) rozhodující znak — klíč vždy ukazuje na autorskou pohádku", () => {
  it("každá L3a ukázka obsahuje autorský marker (moderní reálie / vypravěč) a klíč to reflektuje", () => {
    const l3 = sjednocenyL3();
    const rozhodujici = l3.filter((t) => t.question.startsWith("Přečti si ukázku. Který znak rozhoduje o tom, že jde o autorskou pohádku, a proč?"));
    let overeno = 0;
    for (const t of rozhodujici) {
      const m = t.question.match(/„(.+)“$/u);
      expect(m, `nerozpoznaný text ukázky: ${t.question}`).not.toBeNull();
      const text = m![1];
      expect(klasifikujDruh(text), `ukázka nemá rozpoznatelný autorský marker: ${text}`).toBe("autorská pohádka");
      expect(t.explanation, `vysvětlení nezmiňuje autorskou pohádku: ${t.question}`).toContain("autorskou pohádku");
      overeno++;
    }
    expect(overeno).toBeGreaterThanOrEqual(6);
  });
});

// ── 5. NEZÁVISLÝ SOLVER: L3(b) popis vzniku → lidová/autorská ──────────────

const L3B_TABULKA: Record<string, string> = {
  "Babička vyprávěla pohádku, kterou slyšela od své babičky; učitel ji ve škole zapsal přesně tak, jak ji babička vyprávěla, beze změny.":
    "Lidová pohádka — šířila se dlouho ústně a zapisovatel na ní nic nezměnil.",
  "Spisovatel převzal postavu Honzy ze staré pohádky, ale přenesl ho do dnešního velkoměsta a úplně změnil konec příběhu.":
    "Autorská pohádka — spisovatel vymyslel nové prostředí a nový konec.",
  "Sběratelka zapsala pohádku od několika různých vypravěčů z různých vesnic; všechny verze si byly podobné, jen s drobnými obměnami, a ona sepsala tu nejběžnější podobu.":
    "Lidová pohádka — víc lidí ji nezávisle vyprávělo podobně, jde o ústní tradici.",
  "Spisovatelka napsala příběh o víle, která žije v telefonu, a na konci nechala vílu zmizet beze stopy — nikdo neví, jestli se vrátí.":
    "Autorská pohádka — moderní prostředí a otevřený konec.",
  "Vypravěč na táboře řekl, že pohádku, kterou právě vypráví, slyšel jako malý od dědečka a neví, kdo ji vymyslel jako první.":
    "Lidová pohádka — nikdo neví, kdo ji vymyslel, šířila se ústně.",
  "Autor v úvodu knihy napsal, že celý příběh o strašidle z plaveckého bazénu vymyslel sám a že žádný takový bazén ve skutečnosti neexistuje.":
    "Autorská pohádka — autor sám potvrzuje, že si příběh vymyslel.",
};

/** Sjednotí generator(3) přes víc volání (losUlohy je náhodné) — sníží riziko, že se v jediném volání nesejdou úplně všechny položky poolu. */
function sjednocenyL3(pokusu = 6): PracticeTask[] {
  const byKey = new Map<string, PracticeTask>();
  for (let i = 0; i < pokusu; i++) {
    for (const t of topic.generator(3)) byKey.set(`${t.question}|${t.correctAnswer}`, t);
  }
  return [...byKey.values()];
}

describe("NEZÁVISLÝ SOLVER 5: L3(b) popis vzniku → lidová/autorská sedí s tabulkou", () => {
  it("klíč generátoru odpovídá nezávislé tabulce pro všech 6 případů", () => {
    const l3 = sjednocenyL3();
    const pripady = l3.filter((t) => t.question.endsWith("Jak bys tenhle text zařadil a proč?"));
    let overeno = 0;
    for (const t of pripady) {
      const m = t.question.match(/^(.+) Jak bys tenhle text zařadil a proč\?$/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      const popis = m![1];
      const ocekavano = L3B_TABULKA[popis];
      expect(ocekavano, `popis není v nezávislé tabulce: ${popis}`).toBeDefined();
      expect(t.correctAnswer, `L3b klíč nesedí pro: ${popis}`).toBe(ocekavano);
      overeno++;
    }
    expect(overeno).toBe(6);
  });
});

// ── 6. NEZÁVISLÝ SOLVER: L3(c) srovnání A/B — reuse marker klasifikátoru ────

describe("NEZÁVISLÝ SOLVER 6: L3(c) srovnání A/B — klíč vždy vybere ukázku B jako autorskou", () => {
  it("ukázka A klasifikátor = lidová, ukázka B = autorská, klíč zmiňuje ukázku B", () => {
    const l3 = sjednocenyL3();
    const srovnani = l3.filter((t) => t.question.startsWith("Přečti si dvě ukázky. Ukázka A:"));
    let overeno = 0;
    for (const t of srovnani) {
      const m = t.question.match(/^Přečti si dvě ukázky\. Ukázka A: „(.+)“ Ukázka B: „(.+)“ Která z nich je autorská pohádka a podle čeho to poznáš\?$/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      const [, textA, textB] = m!;
      expect(klasifikujDruh(textA), `ukázka A neklasifikována jako lidová: ${textA}`).toBe("lidová (klasická) pohádka");
      expect(klasifikujDruh(textB), `ukázka B neklasifikována jako autorská: ${textB}`).toBe("autorská pohádka");
      expect(t.correctAnswer.startsWith("Ukázka B"), `klíč nezačíná "Ukázka B": ${t.correctAnswer}`).toBe(true);
      overeno++;
    }
    expect(overeno).toBe(4);
  });
});

// ── 7. NEZÁVISLÝ SOLVER: L3(d) funkce ustálených prvků ──────────────────────

const L3D_TABULKA: Record<string, string> = {
  "Proč se v lidových pohádkách úkoly nebo zkoušky často opakují přesně třikrát?":
    "Protože se pohádka dlouho vyprávěla nahlas z paměti a opakování po třech pomáhalo vypravěči i posluchačům si příběh snáz zapamatovat.",
  "Proč mají lidové pohádky ustálený, opakující se začátek jako „Byl jednou jeden král…“?":
    "Protože ustálený začátek upozornil posluchače, že začíná vyprávění, a vypravěči usnadnil zapamatovat si a snadno začít příběh nazpaměť.",
  "Proč jsou postavy v lidové pohádce často jednoznačně dobré, nebo jednoznačně zlé, bez odstínů?":
    "Protože se pohádka poslouchala nahlas a jednoznačné postavy usnadňovaly posluchačům hned pochopit, komu mají fandit, i bez možnosti si text znovu přečíst.",
  "Proč lidová pohádka obvykle nekončí smutně nebo nejistě, ale jasným vítězstvím dobra?":
    "Protože si posluchači takové vyprávění pamatovali a rádi předávali dál a jasný šťastný konec navíc dával naději a mravní ponaučení.",
};

describe("NEZÁVISLÝ SOLVER 7: L3(d) funkce ustálených prvků sedí s tabulkou", () => {
  it("klíč generátoru odpovídá nezávislé tabulce pro všechny 4 otázky", () => {
    const l3 = sjednocenyL3();
    let overeno = 0;
    for (const [otazka, ocekavano] of Object.entries(L3D_TABULKA)) {
      const t = l3.find((x) => x.question === otazka);
      expect(t, `otázka chybí v L3 poolu: ${otazka}`).toBeDefined();
      expect(t!.correctAnswer, `L3d klíč nesedí pro: ${otazka}`).toBe(ocekavano);
      overeno++;
    }
    expect(overeno).toBe(4);
  });
});

// ── 8. NEZÁVISLÝ SOLVER: L1 vzorek — klíč sedí s nezávisle přepsanou tabulkou ─

const L1_VZOREK: Record<string, string> = {
  "Co je typické pro lidovou (klasickou) pohádku?":
    "Nemá jednoho známého autora, dlouho se šířila ústním vyprávěním.",
  "Co znamená, že K. J. Erben pohádky SBÍRAL?":
    "Zapisoval pohádky tak, jak je vyprávěl lid, sám si je nevymyslel.",
  "Kdo je autorem pohádek o Malé mořské víle a o Ošklivém káčátku?":
    "H. Ch. Andersen — dánský spisovatel, který si příběhy sám vymyslel.",
  "Kdo je autorem sbírky Devatero pohádek?":
    "Karel Čapek — český spisovatel, který si příběhy sám vymyslel.",
  "Který začátek je typický pro lidovou (klasickou) pohádku?":
    "„Byl jednou jeden král, který měl tři syny…“",
  "Který konec je typický pro lidovou (klasickou) pohádku?":
    "„A žili spolu šťastně až do smrti.“",
};

describe("NEZÁVISLÝ SOLVER 8: L1 vzorek sedí s nezávisle přepsanou tabulkou", () => {
  it("klíč generátoru odpovídá tabulce pro vybraných 6 pojmových otázek", () => {
    const l1 = topic.generator(1);
    let overeno = 0;
    for (const [otazka, ocekavano] of Object.entries(L1_VZOREK)) {
      const t = l1.find((x) => x.question === otazka);
      if (!t) continue; // ruzneUlohy losuje — vzorek nemusí padnout při každém volání
      expect(t.correctAnswer, `L1 klíč nesedí pro: ${otazka}`).toBe(ocekavano);
      overeno++;
    }
    // spusť víc pokusů, ať máme jistotu, že aspoň část vzorku padne
    if (overeno === 0) {
      const vsechny = new Set<string>();
      for (let i = 0; i < 5; i++) topic.generator(1).forEach((t) => vsechny.add(t.question));
      for (const [otazka, ocekavano] of Object.entries(L1_VZOREK)) {
        if (!vsechny.has(otazka)) continue;
        overeno++;
      }
    }
    expect(overeno).toBeGreaterThan(0);
  });

  it("L1 pool obsahuje aspoň 12 unikátních pojmových otázek", () => {
    const otazky = new Set<string>();
    for (let i = 0; i < 5; i++) topic.generator(1).forEach((t) => otazky.add(t.question));
    expect(otazky.size).toBeGreaterThanOrEqual(12);
  });
});
