import { describe, it, expect } from "vitest";
import { PODSTATNA_JMENA_SKLONOVANI_MLUVNICKE_KATEGORIE } from "../cjl/podstatnaJmenaSklonovaniMluvnickeKategorie";
import type { PracticeTask } from "@/lib/types";

/**
 * Podstatná jména: pád, rod, číslo, vzor — select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, oddělená od generátoru): klíčová tabulka níž
 * je napsaná samostatně podle věty/tvaru v otázce, ne odvozená z generátorové
 * logiky. Pokrývá:
 *  - L1 pád/rod (mapa věta → pád nebo rod, ověřená ručně skloňováním),
 *  - L2a vzor (odvozeno pravidlem rod+zakončení+2. pád, ne kopií generátoru),
 *  - L2b úplné určení (mapa věta → tuple), L3a inverze, L3b homonymie,
 *    L3c pomnožná jména (klasifikátor přes množinu POMNOZNA).
 */
const topic = PODSTATNA_JMENA_SKLONOVANI_MLUVNICKE_KATEGORIE[0];

// ── Nezávislá klíčová tabulka — L1 pád ──────────────────────────────────
const KEY_PAD: Record<string, string> = {
  "Ema dala dárek BABIČCE.": "3. pád",
  "Táta opravil starý PLOT.": "4. pád",
  "Bez DEŠTĚ by úroda uschla.": "2. pád",
  "Mluvili jsme o novém FILMU.": "6. pád",
  "Jeli jsme na výlet VLAKEM.": "7. pád",
  "Na stole ležela otevřená KNIHA.": "1. pád",
  "Poděkovali jsme TRENÉROVI.": "3. pád",
  "Petr pozval na oslavu KAMARÁDA.": "4. pád",
};

// ── Nezávislá klíčová tabulka — L1 rod ──────────────────────────────────
const KEY_ROD: Record<string, string> = {
  "Na zahradě štěká PES.": "mužský rod životný",
  "Do třídy vešel přísný UČITEL.": "mužský rod životný",
  "Před domem roste starý STROM.": "mužský rod neživotný",
  "Na výstavě visel krásný OBRAZ.": "mužský rod neživotný",
  "Na gauči spala černá KOČKA.": "ženský rod",
  "Na poličce stála tlustá KNIHA.": "ženský rod",
  "Naše MĚSTO má nové náměstí.": "střední rod",
  "Táta koupil nové AUTO.": "střední rod",
};

// ── Nezávislá lemmatová tabulka pro L2a (odvození vzoru pravidlem) ──────
type Rod = "m-ziv" | "m-nez" | "z" | "s";
interface Lemma { rod: Rod; konec1: string; gen2: string }
const LEMMATA: Record<string, Lemma> = {
  hrdina: { rod: "m-ziv", konec1: "a", gen2: "hrdiny" },
  houslista: { rod: "m-ziv", konec1: "a", gen2: "houslisty" },
  sluha: { rod: "m-ziv", konec1: "a", gen2: "sluhy" },
  turista: { rod: "m-ziv", konec1: "a", gen2: "turisty" },
  průvodce: { rod: "m-ziv", konec1: "ce", gen2: "průvodce" },
  zachránce: { rod: "m-ziv", konec1: "ce", gen2: "zachránce" },
  paměť: { rod: "z", konec1: "souhláska", gen2: "paměti" },
  řeč: { rod: "z", konec1: "souhláska", gen2: "řeči" },
  báseň: { rod: "z", konec1: "souhláska", gen2: "básně" },
  dlaň: { rod: "z", konec1: "souhláska", gen2: "dlaně" },
  štěně: { rod: "s", konec1: "e", gen2: "štěněte" },
  pole: { rod: "s", konec1: "e", gen2: "pole" },
};

/** Nezávislé odvození vzoru: pravidlo rod → zakončení 1. pádu → 2. pád. */
function odvodVzor(l: Lemma): string {
  if (l.rod === "m-ziv" && l.konec1 === "a") return "předseda";
  if (l.rod === "m-ziv" && l.konec1 === "ce") return "soudce";
  if (l.rod === "z" && l.konec1 === "souhláska") return l.gen2.endsWith("i") ? "kost" : "píseň";
  if (l.rod === "s" && l.konec1 === "e") return /[eě]te$/.test(l.gen2) ? "kuře" : "moře";
  throw new Error(`odvodVzor: nepokryté lemma ${JSON.stringify(l)}`);
}

// ── Nezávislá klíčová tabulka — L2b úplné určení ────────────────────────
const KEY_TUPLE: Record<string, string> = {
  "Na koncertě jsme mluvili s HOUSLISTY.": "rod mužský životný, číslo množné, 7. pád, vzor předseda",
  "Setkali jsme se se SPRÁVCI hradu.": "rod mužský životný, číslo množné, 7. pád, vzor soudce",
  "Přijal pozvání s velkou RADOSTÍ.": "rod ženský, číslo jednotné, 7. pád, vzor kost",
  "Naslouchali jsme tiše jeho BÁSNI.": "rod ženský, číslo jednotné, 3. pád, vzor píseň",
  "Staral se o hladové KUŘE.": "rod střední, číslo jednotné, 4. pád, vzor kuře",
  "Dal si ke snídani jedno VEJCE naměkko.": "rod střední, číslo jednotné, 4. pád, vzor moře",
  "Přes řeku postavili nový MOST.": "rod mužský neživotný, číslo jednotné, 4. pád, vzor hrad",
  "Poslal pozdrav TETĚ.": "rod ženský, číslo jednotné, 3. pád, vzor žena",
};

// ── Nezávislá klíčová tabulka — L3a inverze ─────────────────────────────
const KEY_INVERZE: Record<string, string> = {
  "HRDINÁCH": "hrdina, vzor předseda",
  "PRŮVODCI": "průvodce, vzor soudce",
  "RADOSTECH": "radost, vzor kost",
  "KOŤAT": "kotě, vzor kuře",
  "BÁSNÍ": "báseň, vzor píseň",
  "VAJEC": "vejce, vzor moře",
};

// ── Nezávislá klíčová tabulka — L3b tvarová homonymie ───────────────────
const KEY_HOMONYM: Record<string, string> = {
  "Pes ohlodal všechny KOSTI.": "4. pád množného čísla",
  "Viděli jsme nové STROJE ve fabrice.": "4. pád množného čísla",
  "Navštívili jsme tři MĚSTA.": "4. pád množného čísla",
  "V kurníku poskakovala malá KUŘATA.": "1. pád množného čísla",
  "Kočka honila dvě MYŠI.": "4. pád množného čísla",
};

// ── Nezávislá tabulka — L1 číslo (věta v množném čísle, ověřeno ručně) ──
const KEY_MNOZNE = new Set([
  "V knihovně přibyly nové KNIHY.",
  "Všichni ŽÁCI dorazili včas.",
  "Na parkovišti stála tři AUTA.",
  "V patře byla otevřená OKNA.",
  "Do brány létaly MÍČE.",
  "Na zahradě štěkali dva PSI.",
  "V sadu rostly staré STROMY.",
  "Ve stojanu stála dvě KOLA.",
]);

// ── Klasifikátor L3c — pomnožná jména ───────────────────────────────────
const POMNOZNA = new Set(["KALHOTY", "NŮŽKY", "BRÝLE", "DVEŘE", "HOUSLE"]);

describe("Podstatná jména: pád, rod, vzor — metadata", () => {
  it("čeština g6, select_one, Jazyková výchova / Tvarosloví", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-podstatna-jmena-sklonovani-mluvnicke-kategorie-6");
    expect(topic.category).toBe("Jazyková výchova");
    expect(topic.topic).toBe("Tvarosloví");
  });
});

describe.each([1, 2, 3])("Podstatná jména — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(12);
  });

  it("select_one struktura: ≥2 možnosti, správná mezi nimi, žádné duplicity", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBeGreaterThanOrEqual(2);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(t.options!.length);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      for (const key of Object.keys(t.optionFeedback ?? {})) {
        expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
        expect(key).not.toBe(t.correctAnswer);
      }
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
    }
  });

  it("nápověda neprozrazuje výsledek, obě nápovědy existují", () => {
    for (const t of tasks) {
      expect(t.hints?.length ?? 0, t.question).toBeGreaterThanOrEqual(2);
      for (const h of t.hints ?? []) {
        expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      }
    }
  });

  it("správná odpověď není ve znění otázky, každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      if (t.correctAnswer.length >= 4) {
        expect(t.question.toLowerCase(), t.question).not.toContain(t.correctAnswer.toLowerCase());
      }
      expect(t.explanation, t.question).toBeTruthy();
    }
  });
});

describe("Podstatná jména — NEZÁVISLÝ SOLVER level 1 (pád, rod)", () => {
  it("pád: klíč souhlasí s ručně ověřenou tabulkou vazeb", () => {
    const tasks = topic.generator(1);
    let checked = 0;
    for (const t of tasks) {
      const m = t.question.match(/^Urči pád podstatného jména ve větě: „(.+)“$/);
      if (!m) continue;
      const veta = m[1];
      expect(KEY_PAD[veta], `neznámá věta v solveru: ${veta}`).toBeTruthy();
      expect(t.correctAnswer, veta).toBe(KEY_PAD[veta]);
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("rod: klíč souhlasí s ručně ověřenou tabulkou", () => {
    const tasks = topic.generator(1);
    let checked = 0;
    for (const t of tasks) {
      const m = t.question.match(/^Urči rod podstatného jména ve větě: „(.+)“$/);
      if (!m) continue;
      const veta = m[1];
      expect(KEY_ROD[veta], `neznámá věta v solveru: ${veta}`).toBeTruthy();
      expect(t.correctAnswer, veta).toBe(KEY_ROD[veta]);
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("číslo: klíč (věta v možnostech) je ta, která je ručně ověřená jako množné číslo", () => {
    const tasks = topic.generator(1);
    let checked = 0;
    for (const t of tasks) {
      if (!/^Urči, ve které z vět je podstatné jméno/.test(t.question)) continue;
      expect(KEY_MNOZNE.has(t.correctAnswer), `neznámý/nesprávný klíč: ${t.correctAnswer}`).toBe(true);
      // Žádná ze zbylých (distraktorových) možností nesmí být sama v množném čísle.
      for (const o of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(KEY_MNOZNE.has(o), `distraktor vypadá jako množné číslo: ${o}`).toBe(false);
      }
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });
});

describe("Podstatná jména — NEZÁVISLÝ SOLVER level 2 (vzor, úplné určení)", () => {
  it("L2a vzor: odvozen pravidlem (rod + zakončení + 2. pád), ne kopií generátoru", () => {
    const tasks = topic.generator(2);
    let checked = 0;
    for (const t of tasks) {
      const m = t.question.match(/^Podle kterého vzoru se skloňuje podstatné jméno ve větě: „(.+)“\?$/);
      if (!m) continue;
      const veta = m[1];
      const slovoMatch = veta.match(/[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]{2,}/);
      expect(slovoMatch, veta).not.toBeNull();
      const slovo = slovoMatch![0].toLowerCase();
      const lemma = LEMMATA[slovo];
      expect(lemma, `neznámé lemma v solveru: ${slovo}`).toBeTruthy();
      expect(t.correctAnswer, veta).toBe(odvodVzor(lemma));
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("L2b úplné určení: klíč souhlasí s ručně ověřenou tabulkou tuple", () => {
    const tasks = topic.generator(2);
    let checked = 0;
    for (const t of tasks) {
      const m = t.question.match(/^Urči u podstatného jména ve větě „(.+)“ rod, číslo, pád a vzor\.$/);
      if (!m) continue;
      const veta = m[1];
      expect(KEY_TUPLE[veta], `neznámá věta v solveru: ${veta}`).toBeTruthy();
      expect(t.correctAnswer, veta).toBe(KEY_TUPLE[veta]);
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("L2b distraktory se od klíče liší v právě jedné kategorii (rod/číslo/pád/vzor)", () => {
    const tasks = topic
      .generator(2)
      .filter((t) => /^Urči u podstatného jména ve větě/.test(t.question));
    expect(tasks.length).toBeGreaterThan(0);
    for (const t of tasks) {
      const spravnaPole = t.correctAnswer.split(", ");
      for (const opt of t.options!.filter((o) => o !== t.correctAnswer)) {
        const pole = opt.split(", ");
        expect(pole.length, opt).toBe(spravnaPole.length);
        const rozdily = pole.filter((p, i) => p !== spravnaPole[i]).length;
        expect(rozdily, `distraktor "${opt}" se liší v ${rozdily} kategoriích, ne v jedné`).toBe(1);
      }
    }
  });
});

describe("Podstatná jména — NEZÁVISLÝ SOLVER level 3 (inverze, homonymie, pomnožná)", () => {
  it("L3a inverze: klíč (lemma, vzor) souhlasí s ručně ověřenou tabulkou", () => {
    const tasks = topic.generator(3);
    let checked = 0;
    for (const t of tasks) {
      const m = t.question.match(/vznikl tvar „([^"„“]+)“/);
      if (!m) continue;
      const forma = m[1];
      expect(KEY_INVERZE[forma], `neznámý tvar v solveru: ${forma}`).toBeTruthy();
      expect(t.correctAnswer, forma).toBe(KEY_INVERZE[forma]);
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("L3b homonymie: klíč (pád a číslo) souhlasí s ručně ověřenou tabulkou", () => {
    const tasks = topic.generator(3);
    let checked = 0;
    for (const t of tasks) {
      const m = t.question.match(/^Ve větě „(.+)“ je tvar „.+“\. Urči jeho pád a číslo\.$/);
      if (!m) continue;
      const veta = m[1];
      expect(KEY_HOMONYM[veta], `neznámá věta v solveru: ${veta}`).toBeTruthy();
      expect(t.correctAnswer, veta).toBe(KEY_HOMONYM[veta]);
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("L3c pomnožná jména: klasifikátor rozpozná slovo a klíč je vždy množné číslo", () => {
    const tasks = topic.generator(3);
    let checked = 0;
    for (const t of tasks) {
      const m = t.question.match(/^Ve větě „.+“ je podstatné jméno „([^"„“]+)“\. Jaké má číslo\?$/);
      if (!m) continue;
      const slovo = m[1];
      expect(POMNOZNA.has(slovo), `slovo mimo klasifikátor pomnožných jmen: ${slovo}`).toBe(true);
      expect(t.correctAnswer, slovo).toContain("množné číslo");
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });
});

describe("Podstatná jména — gradace L1 ≠ L2 ≠ L3 (disjunktní znění)", () => {
  it("L1 testuje jednu kategorii, L2 vzor/úplné určení, L3 začíná jinak než L1", () => {
    const l1 = topic.generator(1).map((t: PracticeTask) => t.question);
    const l3 = topic.generator(3).map((t: PracticeTask) => t.question);
    expect(l1.every((q) => /^Urči (pád|rod) podstatného jména ve větě:|^Urči, ve které z vět/.test(q))).toBe(true);
    expect(l3.every((q) => !/^Urči (pád|rod) podstatného jména ve větě:/.test(q))).toBe(true);
    // L3 začíná jinak než L1, jak vyžaduje zadání (disjunktní úvodní fráze).
    expect(l3.every((q) => /^(Z jakého slova|Ve větě)/.test(q))).toBe(true);
  });

  it("nejtěžší L3 je náročnější než nejlehčí L1 (dvoukrokový přenos vs. jedna kategorie)", () => {
    // L1 = jedna kategorie z jedné věty; L3a/b/c vyžadují rekonstrukci lemmatu,
    // rozhodnutí podle kontextu (číslovka/sloveso), nebo výjimku z pravidla čísla —
    // to jsou aspoň dva myšlenkové kroky navíc oproti L1.
    const l3 = topic.generator(3);
    const maVicKroku = l3.every(
      (t) =>
        /vznikl tvar|1\. pádu/.test(t.question) || // L3a: inverze
        /Urči jeho pád a číslo/.test(t.question) || // L3b: homonymie
        /Jaké má číslo\?/.test(t.question), // L3c: pomnožné jméno
    );
    expect(maVicKroku).toBe(true);
  });
});
