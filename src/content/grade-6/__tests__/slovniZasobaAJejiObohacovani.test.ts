import { describe, it, expect } from "vitest";
import { SLOVNI_ZASOBA_A_JEJI_OBOHACOVANI } from "../cjl/slovniZasobaAJejiObohacovani";
import type { PracticeTask } from "@/lib/types";

/**
 * Slovní zásoba a její obohacování — způsoby tvoření slov (select_one).
 * Kontroluje: strukturu, chybový model, gradaci L1≠L3 a KLASIFIKACI KLÍČE
 * přes NEZÁVISLÝ klasifikátor (druhá cesta — vlastní slovníky kořenů, přípon,
 * předpon a přejatých slov, oddělené od dat generátoru).
 */
const topic = SLOVNI_ZASOBA_A_JEJI_OBOHACOVANI[0];

const ODVOZ = "odvozováním";
const SKLAD = "skládáním";
const ZKRAC = "zkracováním";
const PREJEM = "přejímáním z cizího jazyka";
const SOUSLOVI = "vytvořením sousloví";
const ZMENA = "změnou významu";
const ZKRATKA = "zkratka (čte se po písmenech)";
const ZKRATKOVE = "zkratkové slovo (čte se jako celé slovo)";

// ── Nezávislý klasifikátor — vlastní slovníky, jiná cesta než generátor ───
const PREFIXOVA_SLOVA: Record<string, string> = { přepsat: "pře", nadzemní: "nad" };
const PRIPONOVA_SLOVA = new Set([
  "zahradník", "lesník", "učitel", "hráč", "kočička",
  "hasič", "zpěvák", "plavec", "řidič", "prodavač", "malíř",
  "vodník", "zahrádkář", "hřiště", "rohlík", "koláč", "kovář", "pekař",
  "rybář", "houbař",
  "vodička", "vodní", "vlakový", "vláček", "rychlík",
  "černavý", "bělavý", "černidlo", "městský", "velikán", "městečko",
]);
const SLOZENA_SLOVA = new Set([
  "vodopád", "zeměpis", "rychlovlak", "velkoměsto", "černobílý", "hromosvod",
  "velryba", "zeměkoule", "dalekohled", "listonoš",
  "listopad", "světlomet", "kolotoč", "vodovod", "sněhobílý", "samoobsluha",
  "dějepis", "časopis",
]);
const ZKRATKY = new Set(["ZŠ", "ČR", "ČT", "atd.", "apod.", "tj."]);
const ZKRATKOVA_SLOVA = new Set(["Čedok", "Jawa", "Sazka"]);
const PREJATA_SLOVA = new Set([
  "fotbal", "hokej", "víkend", "džus", "jogurt", "pizza",
  "tablet", "sendvič", "šampon", "špagety", "banán", "čokoláda", "hamburger", "kečup",
]);
const SOUSLOVI_SEZNAM = new Set([
  "mateřská škola", "hlavní město", "lesní roh", "železná dráha", "zubní kartáček", "lední medvěd",
]);
const ZMENA_VYZNAMU_SLOVA = new Set(["myš", "okno", "noha", "zub", "hlava", "oko"]);

/** Klasifikuje jedno slovo nezávisle na generátoru. Vrací kanonický způsob. */
function klasifikuj(word: string): string | null {
  if (SOUSLOVI_SEZNAM.has(word)) return SOUSLOVI;
  if (/^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]{2,}$/.test(word) || /\.$/.test(word)) {
    if (ZKRATKY.has(word)) return ZKRATKA;
  }
  if (ZKRATKOVA_SLOVA.has(word)) return ZKRATKOVE;
  if (PREJATA_SLOVA.has(word)) return PREJEM;
  if (word in PREFIXOVA_SLOVA) return ODVOZ;
  if (SLOZENA_SLOVA.has(word)) return SKLAD;
  if (PRIPONOVA_SLOVA.has(word)) return ODVOZ;
  return null;
}

/** Klasifikace L1(c) — bez rozlišení zkratka/zkratkové slovo (obecné "zkracováním"). */
function klasifikujObecne(word: string): string | null {
  const k = klasifikuj(word);
  if (k === ZKRATKA || k === ZKRATKOVE) return ZKRAC;
  return k;
}

interface Solved { kind: string; expected: string }

const NEZNAME = "(klasifikátor slovo nezná)";

/** Nezávislý solver — z textu otázky odvodí očekávaný klíč bez pohledu na correctAnswer. */
function solve(t: PracticeTask): Solved | null {
  const q = t.question;
  let m: RegExpMatchArray | null;

  // L1(a) odvozování
  if ((m = q.match(/^Slovo (\S+) vzniklo ze slova (\S+)\. Jakým způsobem\?$/))) {
    return { kind: "L1-odvoz", expected: klasifikuj(m[1]) ?? NEZNAME };
  }
  // L1(b) skládání
  if ((m = q.match(/^Slovo (\S+) vzniklo spojením slov (\S+) a (\S+)\. Jakým způsobem\?$/))) {
    return { kind: "L1-sklad", expected: klasifikuj(m[1]) ?? NEZNAME };
  }
  // L1(c) zkracování (obecně)
  if ((m = q.match(/^Označení (\S+) vzniklo ze slov (.+)\. Jakým způsobem\?$/))) {
    return { kind: "L1-zkrac", expected: klasifikujObecne(m[1]) ?? NEZNAME };
  }
  // L1(d) přejímání
  if ((m = q.match(/^Slovo (\S+) se do češtiny dostalo z (\S+)\. Jakým způsobem obohatilo slovní zásobu\?$/))) {
    return { kind: "L1-prejem", expected: klasifikuj(m[1]) ?? NEZNAME };
  }
  // L2(a) / L3(a,b) — "... Jakým způsobem vzniklo slovo X?"
  if ((m = q.match(/Jakým způsobem vzniklo slovo (\S+?)\?$/))) {
    const word = m[1].replace(/[.,]$/, "");
    return { kind: "veta-slovo", expected: klasifikuj(word) ?? NEZNAME };
  }
  // L2(b) — rodina: který ze 4 vznikl skládáním
  if ((m = q.match(/^Které z těchto čtyř slov vzniklo skládáním \(spojením dvou slovních základů\)\? (.+)$/))) {
    const slova = m[1].split(", ").map((s) => s.trim());
    const kompozita = slova.filter((s) => SLOZENA_SLOVA.has(s));
    expect(kompozita.length, `přesně 1 složené slovo mezi: ${slova.join(", ")}`).toBe(1);
    return { kind: "L2-rodina", expected: kompozita[0] };
  }
  // L2(c) — zkratka vs zkratkové slovo
  if ((m = q.match(/^Slovo (\S+) vzniklo zkrácením spojení (.+)\. Čím \S+ je\?$/))) {
    return { kind: "L2-zkratka", expected: klasifikuj(m[1]) ?? NEZNAME };
  }
  // L3(c) — změna významu: cílové slovo musí být v nezávislém seznamu
  if ((m = q.match(/Jakým způsobem vzniklo pojmenování „(.+)“ pro .+\?$/))) {
    return { kind: "L3-zmena", expected: ZMENA_VYZNAMU_SLOVA.has(m[1]) ? ZMENA : NEZNAME };
  }
  // L2(d) — sousloví
  if ((m = q.match(/Jakým způsobem vzniklo pojmenování „(.+)“\?$/))) {
    return { kind: "L2-sousloví", expected: klasifikuj(m[1]) ?? NEZNAME };
  }
  // L3(d) — inverze
  if ((m = q.match(/^Které z těchto čtyř slov NEvzniklo skládáním\? (.+)$/))) {
    const slova = m[1].split(", ").map((s) => s.trim());
    const neslozena = slova.filter((s) => !SLOZENA_SLOVA.has(s));
    expect(neslozena.length, `přesně 1 nesložené slovo mezi: ${slova.join(", ")}`).toBe(1);
    return { kind: "L3-inverze-sklad", expected: neslozena[0] };
  }
  if ((m = q.match(/^Které z těchto čtyř slov NENÍ přejaté z cizího jazyka\? (.+)$/))) {
    const slova = m[1].split(", ").map((s) => s.trim());
    const neprejata = slova.filter((s) => !PREJATA_SLOVA.has(s));
    expect(neprejata.length, `přesně 1 nepřejaté slovo mezi: ${slova.join(", ")}`).toBe(1);
    return { kind: "L3-inverze-prejem", expected: neprejata[0] };
  }
  // L3(e) — dvoukrokové: obě jmenovaná slova klasifikuj zvlášť, způsob musí být shodný
  if ((m = q.match(/Které tvrzení platí pro (?:slova|pojmenování) (.+) a (.+)\?$/))) {
    const ka = klasifikuj(m[1]);
    const kb = klasifikuj(m[2]);
    expect(ka, `obě slova stejným způsobem: ${m[1]} × ${m[2]}`).toBe(kb);
    const zacatek: Record<string, string> = {
      [ODVOZ]: "Obě vznikla odvozováním",
      [SKLAD]: "Obě vznikla skládáním",
      [PREJEM]: "Obě jsou přejatá",
      [SOUSLOVI]: "Obě jsou sousloví",
    };
    const prefix = ka ? zacatek[ka] : undefined;
    const ok = !!prefix && String(t.correctAnswer).startsWith(prefix);
    return { kind: "L3-dvoukrokove", expected: ok ? String(t.correctAnswer) : `tvrzení začínající „${prefix}“` };
  }
  return null;
}

describe("Slovní zásoba a její obohacování — metadata", () => {
  it("čeština g6, select_one, Jazyková výchova / Nauka o slovní zásobě", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-slovni-zasoba-a-jeji-obohacovani-6");
    expect(topic.category).toBe("Jazyková výchova");
    expect(topic.topic).toBe("Nauka o slovní zásobě");
  });

  it("slovo 'robot' ani univerbizace (minerálka) se v bance nevyskytují", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        expect(t.question.toLowerCase()).not.toContain("robot");
        expect(t.question.toLowerCase()).not.toContain("minerálka");
        expect(String(t.correctAnswer).toLowerCase()).not.toContain("robot");
      }
    }
  });
});

describe.each([1, 2, 3])("Slovní zásoba — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const unikatni = new Set(tasks.map((t) => t.question));
    expect(unikatni.size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé options, správná je mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("klíč „odvozováním“ má nanejvýš třetina úloh úrovně", () => {
    const odvoz = tasks.filter((t) => t.correctAnswer === ODVOZ).length;
    expect(odvoz / tasks.length).toBeLessThanOrEqual(1 / 3 + 1e-9);
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

  it("nápověda neprozrazuje výsledek (klíčový termín ani cílové slovo)", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      }
    }
  });

  it("otázka neprozrazuje klíčový termín (u úloh s klíčem = způsob tvoření)", () => {
    const zpusoby = new Set([ODVOZ, SKLAD, ZKRAC, PREJEM, SOUSLOVI, ZMENA]);
    for (const t of tasks.filter((x) => zpusoby.has(String(x.correctAnswer)))) {
      const kmen = String(t.correctAnswer).slice(0, 6).toLowerCase();
      expect(t.question.toLowerCase(), `klíč v otázce: ${t.question}`).not.toContain(kmen);
    }
  });

  it("hints[0] a hints[1] jsou unikátní napříč úlohami úrovně", () => {
    const prvni = new Set<string>();
    const druhe = new Set<string>();
    for (const t of tasks) {
      const [h0, h1] = t.hints ?? [];
      if (h0) { expect(prvni.has(h0), `duplicitní hints[0]: ${h0}`).toBe(false); prvni.add(h0); }
      if (h1) { expect(druhe.has(h1), `duplicitní hints[1]: ${h1}`).toBe(false); druhe.add(h1); }
    }
  });

  it("každá úloha má vysvětlení; žádné zdvojené „se … se“ ani „z spojení“", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.explanation!).not.toMatch(/tak, že se přidala se/);
      expect(t.explanation!).not.toMatch(/\bz spojení/);
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s klasifikátorem u každé úlohy", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      expect(t.correctAnswer, `${s!.kind}: ${t.question} → klíč "${t.correctAnswer}"`).toBe(s!.expected);
    }
  });
});

describe("Slovní zásoba — gradace L1 ≠ L3", () => {
  it("L1 a L3 mají disjunktní texty otázek", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje z L1: ${q}`).toBe(false);
  });

  it("L1 je jen rozpoznání s výchozím slovem v zadání; L3 obsahuje pasti, inverzi a dvoukrokové úlohy", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    const l3 = topic.generator(3).map((t) => t.question);
    expect(l1.every((q) => /vzniklo|vznikla|dostalo/.test(q))).toBe(true);
    expect(l3.some((q) => /NEvzniklo|NENÍ přejaté/.test(q))).toBe(true);
    expect(l3.some((q) => /Které tvrzení platí pro/.test(q))).toBe(true);
  });
});

describe("Slovní zásoba — dvoukrokové úlohy (L3e) jmenují obě posuzovaná slova", () => {
  it("správné tvrzení je vždy mezi options a distraktory jsou jiná tvrzení", () => {
    const l3 = topic.generator(3);
    const dvoukrokove = l3.filter((t) => /Které tvrzení platí pro (slova|pojmenování) .+ a .+\?$/.test(t.question));
    expect(dvoukrokove.length).toBeGreaterThanOrEqual(4);
    for (const t of dvoukrokove) {
      expect(t.options).toContain(t.correctAnswer);
      expect(new Set(t.options).size).toBe(4);
    }
  });
});
