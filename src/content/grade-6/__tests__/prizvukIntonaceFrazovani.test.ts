import { describe, it, expect } from "vitest";
import { PRIZVUK_INTONACE_FRAZOVANI } from "../cjl/prizvukIntonaceFrazovani";
import type { PracticeTask } from "@/lib/types";

/**
 * Přízvuk, intonace, frázování — čeština 6. ročník (select_one, bez zvuku).
 * Kontroluje strukturu, chybový model, gradaci L1→L3 a VĚCNOU SPRÁVNOST přes
 * nezávislý solver, který pracuje jen z textu otázky a vlastních tabulek/
 * mechanických pravidel (napsaných odděleně od generátoru, ne importem z něj).
 */
const topic = PRIZVUK_INTONACE_FRAZOVANI[0];

// ── Nezávislé tabulky a pravidla (napsané odděleně od generátoru) ───────────

// L1a / L2a — slabikování bank (stejná fakta jako v generátoru, ověřená ručně).
const SYLL_SLOV: Record<string, string[]> = {
  kamarádka: ["ka", "ma", "rád", "ka"],
  televize: ["te", "le", "vi", "ze"],
  počítače: ["po", "čí", "ta", "če"],
  nedaleko: ["ne", "da", "le", "ko"],
  kolotoče: ["ko", "lo", "to", "če"],
  čokoláda: ["čo", "ko", "lá", "da"],
  pomeranče: ["po", "me", "ran", "če"],
  kalkulačka: ["kal", "ku", "lač", "ka"],
  autobusy: ["au", "to", "bu", "sy"],
  zahradníci: ["za", "hrad", "ní", "ci"],
};

const SYLL_JMENA_S_PREDLOZKOU: Record<string, string[]> = {
  lesa: ["le", "sa"],
  stole: ["sto", "le"],
  mostem: ["mos", "tem"],
  školou: ["ško", "lou"],
  babičky: ["ba", "bič", "ky"],
  řeky: ["ře", "ky"],
  zvířatech: ["zví", "řa", "tech"],
  cestě: ["ces", "tě"],
  domem: ["do", "mem"],
  pole: ["po", "le"],
  rybníkem: ["ryb", "ní", "kem"],
  deštníku: ["dešt", "ní", "ku"],
};

function markFirst(syll: string[]): string {
  return syll.map((s, i) => (i === 0 ? s.toUpperCase() : s)).join("");
}

// L1c — pojmová otázka, fixní odpověď.
const L1C_OTAZKY = [
  "Na kterou slabiku padá v češtině hlavní slovní přízvuk?",
  "Kde je v českém slově vždy hlavní přízvuk, ať je slovo krátké, nebo dlouhé?",
  "Podle pravidla o českém přízvuku: na které slabice slova vždy leží?",
  "Čeština má pro přízvuk slova pevné pravidlo. Na které slabice přízvuk vždy je?",
];

// Melodie — mechanický klasifikátor podle interpunkce a prvního slova (nezávislý
// na generátoru; přesně podle solverCheck ve specifikaci).
const TAZACI_SLOVA = ["kdo", "co", "kde", "kdy", "kam", "proč", "jak", "jaký", "jaká", "jaké", "který", "která", "které", "čí", "kolik", "odkud"];
function klasifikujMelodii(veta: string): "klesava" | "stoupava" {
  const v = veta.trim();
  if (v.endsWith("?")) {
    const prvni = v.split(/\s+/)[0].replace(/[„"]/g, "").toLowerCase();
    return TAZACI_SLOVA.includes(prvni) ? "klesava" : "stoupava";
  }
  return "klesava"; // tečka nebo vykřičník
}
const MELODIE_KLESAVA = "klesavá – hlas na konci klesá";
const MELODIE_STOUPAVA = "stoupavá – hlas na konci stoupá";

// L3b/L3c — věty s důrazem (nezávislá kopie dat, potřebná protože bloky
// vícemluvných příslovečných určení nejdou mechanicky rozseknout jen mezerami).
const DURAZ_POLOZKY: { chunks: [string, string, string, string]; otazky: [string, string, string, string] }[] = [
  { chunks: ["Tomáš", "jede", "zítra", "do Brna"], otazky: ["Kdo jede zítra do Brna?", "Jede Tomáš zítra do Brna, nebo tam jde pěšky?", "Kdy Tomáš jede do Brna?", "Kam Tomáš zítra jede?"] },
  { chunks: ["Kamila", "zpívá", "každý večer", "v kuchyni"], otazky: ["Kdo zpívá každý večer v kuchyni?", "Co Kamila dělá každý večer v kuchyni?", "Kdy Kamila zpívá v kuchyni?", "Kde Kamila zpívá každý večer?"] },
  { chunks: ["Filip", "opravuje", "o víkendu", "kolo"], otazky: ["Kdo opravuje o víkendu kolo?", "Co Filip dělá o víkendu s kolem?", "Kdy Filip opravuje kolo?", "Co Filip o víkendu opravuje?"] },
  { chunks: ["Eliška", "kreslí", "ráno", "obrázek"], otazky: ["Kdo kreslí ráno obrázek?", "Co Eliška ráno dělá s obrázkem?", "Kdy Eliška kreslí obrázek?", "Co Eliška ráno kreslí?"] },
  { chunks: ["Jakub", "nese", "domů", "těžký batoh"], otazky: ["Kdo nese domů těžký batoh?", "Co Jakub dělá s těžkým batohem cestou domů?", "Kam Jakub nese těžký batoh?", "Co Jakub nese domů?"] },
  { chunks: ["Věra", "čte", "večer", "knihu"], otazky: ["Kdo čte večer knihu?", "Co Věra večer dělá s knihou?", "Kdy Věra čte knihu?", "Co Věra večer čte?"] },
];
function sentenceWithEmphasis(chunks: readonly string[], idx: number): string {
  return `${chunks.map((c, i) => (i === idx ? c.toUpperCase() : c)).join(" ")}.`;
}

// L3d (implicature) — nezávislá tabulka co věta naznačuje.
const NAZNACENI: Record<string, string> = {
  "Petr koupil MLÉKO.": "že Petr koupil mléko, ne něco jiného (třeba chleba)",
  "MARIE napsala dopis.": "že dopis napsala Marie, ne někdo jiný",
  "Táta OPRAVIL pračku.": "že táta pračku opravdu opravil (dokončil to), a ne jen chtěl opravit",
  "Bratr uklidil POKOJ.": "že bratr uklidil pokoj, ne něco jiného (třeba kuchyni)",
};

/** Nezávislý solver — vrací null, když otázku nerozpozná (jiný typ úlohy). */
function solve(t: PracticeTask): { kind: string; expected: string } | null {
  const q = t.question;
  let m: RegExpMatchArray | null;

  // L1a — přízvučná slabika víceslabičného slova
  if ((m = q.match(/^Ve kterém zápisu slova „(.+?)“ je VELKÝMI PÍSMENY/))) {
    const slovo = m[1];
    if (slovo in SYLL_SLOV) return { kind: "L1a", expected: markFirst(SYLL_SLOV[slovo]) };
    return null;
  }

  // L1c — pojmová otázka o přízvuku
  if (L1C_OTAZKY.includes(q)) return { kind: "L1c", expected: "na první slabice" };

  // L2a — jednoslabičná předložka + jméno (přízvuk je na předložce, jméno zůstává vypsané normálně)
  if ((m = q.match(/^Jak se přízvukuje spojení „(\S+) (\S+)“\? Vyber zápis/))) {
    const [, prep, noun] = m;
    if (noun in SYLL_JMENA_S_PREDLOZKOU && SYLL_JMENA_S_PREDLOZKOU[noun].join("") === noun) {
      return { kind: "L2a", expected: `${prep.toUpperCase()} ${noun}` };
    }
    return null;
  }

  // L2b — rozdělení věty na přízvukové takty (prototyp: předložka+jméno, sloveso, podmět)
  if ((m = q.match(/^Věta „(.+?)“ se dělí na přízvukové takty/))) {
    const words = m[1].replace(/\.$/, "").split(" ");
    if (words.length === 4) {
      const [prep, noun, verb, subject] = words;
      return { kind: "L2b", expected: `${prep} ${noun} / ${verb} / ${subject}` };
    }
    return null;
  }

  // L1b / L2c / L3d(melodie) — melodie věty/otázky: mechanický klasifikátor
  if ((m = q.match(/^Jakou melodii \(intonaci\) má věta: „(.+?)“$/)) || (m = q.match(/^Jakou melodii má tato otázka: „(.+?)“$/))) {
    const druh = klasifikujMelodii(m[1]);
    return { kind: "melodie", expected: druh === "klesava" ? MELODIE_KLESAVA : MELODIE_STOUPAVA };
  }

  // L3a — pauza mění smysl (dvě slovesa s „ne“)
  if ((m = q.match(/^Věta „([A-ZÁ-ŽĚŠČŘŽÝÍÉÚŮ][a-zá-žěščřžýíéúů]+) ne([a-zá-žěščřžýíéúů]+)\.“ \(bez čárky\)[\s\S]*aby věta znamenala: máš ([a-zá-žěščřžýíéúů]+), a ne ([a-zá-žěščřžýíéúů]+)\?$/))) {
    const [, v1, v2, chtej1] = m;
    const expected = chtej1 === v1.toLowerCase() ? `${v1} | ne${v2}.` : `${v1} ne | ${v2}.`;
    return { kind: "L3a", expected };
  }

  // L3a' — pauza u vsuvky: kdo mluví (mluvčí = první jméno → jedna pauza za „řekl“)
  if ((m = q.match(/^Věta „(\S+) (řekla?) (\S+) je (\S+)\.“ se bez čárek[\s\S]*znamenala: (\S+) říká, že (\S+) je \S+\?$/))) {
    const [, a, rekl, b, vl, mluvci] = m;
    const expected = mluvci === a ? `${a} ${rekl} | ${b} je ${vl}.` : `${a} | ${rekl} ${b} | je ${vl}.`;
    return { kind: "L3a-vsuvka", expected };
  }

  // L1d — najdi ŠPATNĚ vyznačený zápis (ten, kde velká není první slabika)
  if (/^Spolužák vyznačoval VELKÝMI PÍSMENY přízvučnou slabiku ve slovech /.test(q)) {
    const spatne = (t.options ?? []).filter((o) => {
      const plain = o.toLowerCase();
      return plain in SYLL_SLOV && o !== markFirst(SYLL_SLOV[plain]);
    });
    if (spatne.length !== 1) return null;
    return { kind: "L1d", expected: spatne[0] };
  }

  // L3b — větný důraz odpovídá na otázku
  if ((m = q.match(/^Věta zní: „(.+?)\.“ Na otázku „(.+?)“ odpovíš/))) {
    const sentence = m[1];
    const otazka = m[2];
    const item = DURAZ_POLOZKY.find((p) => p.chunks.join(" ") === sentence);
    if (!item) return null;
    const idx = item.otazky.indexOf(otazka);
    if (idx === -1) return null;
    return { kind: "L3b", expected: sentenceWithEmphasis(item.chunks, idx) };
  }

  // L3c — obrácený směr: podle zdůrazněného slova pozná otázku
  if ((m = q.match(/^Věta „(.+?)“ má zdůrazněnou \(větným přízvukem\) jednu část\. Na kterou otázku/))) {
    const sentence = m[1];
    for (const item of DURAZ_POLOZKY) {
      for (let idx = 0; idx < 4; idx++) {
        if (sentenceWithEmphasis(item.chunks, idx) === sentence) return { kind: "L3c", expected: item.otazky[idx] };
      }
    }
    return null;
  }

  // L3d — co mluvčí naznačuje důrazem
  if ((m = q.match(/^Věta „(.+?)“ má zdůrazněné \(VELKÝMI písmeny\) jedno slovo\. Co tím mluvčí naznačuje\?$/))) {
    const sentence = m[1];
    if (sentence in NAZNACENI) return { kind: "L3d", expected: NAZNACENI[sentence] };
    return null;
  }

  return null;
}

describe("Přízvuk, intonace, frázování — metadata", () => {
  it("čeština g6, select_one, Jazyková výchova / Zvuková stránka jazyka", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-prizvuk-intonace-frazovani-6");
    expect(topic.category).toBe("Jazyková výchova");
    expect(topic.topic).toBe("Zvuková stránka jazyka");
  });
});

describe.each([1, 2, 3])("Přízvuk/intonace/frázování — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const keys = new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}`));
    expect(keys.size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, správná je mezi nimi, klíč není ve znění otázky", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
      expect(t.question, `klíč "${t.correctAnswer}" je ve znění otázky`).not.toContain(t.correctAnswer);
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

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s vlastním výpočtem", () => {
    const nerozpoznano: string[] = [];
    for (const t of tasks) {
      const s = solve(t);
      if (!s) {
        nerozpoznano.push(t.question);
        continue;
      }
      expect(t.correctAnswer, `${s.kind}: ${t.question}`).toBe(s.expected);
    }
    expect(nerozpoznano, `solver nerozpoznal ${nerozpoznano.length} úloh`).toEqual([]);
  });
});

describe("Přízvuk/intonace/frázování — gradace L1 ≠ L2 ≠ L3", () => {
  it("věty/otázky L1 a L3 jsou textově disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });

  it("L1 obsahuje všechny tři formáty (slovo / věta-melodie / pojmová otázka)", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    expect(l1.some((q) => q.startsWith("Ve kterém zápisu slova"))).toBe(true);
    expect(l1.some((q) => q.startsWith("Jakou melodii (intonaci) má věta"))).toBe(true);
    expect(l1.some((q) => L1C_OTAZKY.includes(q))).toBe(true);
  });

  it("L1 neobsahuje doplňovací otázku (ta patří až do L2)", () => {
    const l1 = topic.generator(1);
    const melodieVety = l1.filter((t) => t.question.startsWith("Jakou melodii (intonaci) má věta"));
    for (const t of melodieVety) {
      const veta = t.question.match(/věta: „(.+?)“$/)![1];
      expect(veta.trim().endsWith("?") && TAZACI_SLOVA.includes(veta.split(/\s+/)[0].toLowerCase()), `L1 obsahuje doplňovací otázku: ${veta}`).toBe(false);
    }
  });

  it("L2 obsahuje všechny tři formáty (předložka+jméno / takty / melodie otázky)", () => {
    const l2 = topic.generator(2).map((t) => t.question);
    expect(l2.some((q) => q.startsWith("Jak se přízvukuje spojení"))).toBe(true);
    expect(l2.some((q) => q.includes("se dělí na přízvukové takty"))).toBe(true);
    expect(l2.some((q) => q.startsWith("Jakou melodii má tato otázka"))).toBe(true);
  });

  it("L2 melodie otázek obsahuje jak doplňovací, tak zjišťovací otázky", () => {
    const l2 = topic.generator(2).filter((t) => t.question.startsWith("Jakou melodii má tato otázka"));
    const druhy = new Set(l2.map((t) => t.correctAnswer));
    expect(druhy.has(MELODIE_KLESAVA), "chybí doplňovací (klesavá) otázka v L2").toBe(true);
    expect(druhy.has(MELODIE_STOUPAVA), "chybí zjišťovací (stoupavá) otázka v L2").toBe(true);
  });

  it("L3 obsahuje pauzu, důraz (oba směry) i transfer melodie", () => {
    const l3 = topic.generator(3).map((t) => t.question);
    expect(l3.some((q) => q.includes("bez čárky"))).toBe(true);
    expect(l3.some((q) => q.startsWith("Věta zní:"))).toBe(true);
    expect(l3.some((q) => q.includes("Na kterou otázku tahle věta odpovídá"))).toBe(true);
    expect(l3.some((q) => q.includes("Co tím mluvčí naznačuje"))).toBe(true);
  });

  it("L3 transfer melodie: otázky začínají zájmenem, které NENÍ tázací slovo, a přesto jsou stoupavé", () => {
    const l3 = topic.generator(3).filter((t) => t.question.startsWith("Jakou melodii má tato otázka"));
    expect(l3.length).toBeGreaterThan(0);
    for (const t of l3) {
      const veta = t.question.match(/otázka: „(.+?)“$/)![1];
      const prvni = veta.split(/\s+/)[0].toLowerCase();
      expect(TAZACI_SLOVA.includes(prvni), `${veta} začíná skutečným tázacím slovem, nepatří do L3 transferu`).toBe(false);
      expect(t.correctAnswer, veta).toBe(MELODIE_STOUPAVA);
    }
  });
});

describe("Přízvuk/intonace/frázování — L3a pauza: mechanická kontrola sousloví", () => {
  it("odstraněním „|“ a mezer vznikne stejná posloupnost písmen jako v původní (nerozdělené) větě", () => {
    const l3a = topic.generator(3).filter((t) => t.question.includes("bez čárky"));
    expect(l3a.length).toBeGreaterThan(0);
    for (const t of l3a) {
      const puvodni = t.question.match(/^Věta „(.+?)“ \(bez čárky\)/)![1];
      const bezPauzy = t.correctAnswer.replace(/\s*\|\s*/g, " ");
      const zbavtSpojkyMezer = (s: string) => s.replace(/\s+/g, "");
      expect(zbavtSpojkyMezer(bezPauzy), `${t.correctAnswer} po odstranění pauzy nesedí na "${puvodni}"`).toBe(zbavtSpojkyMezer(puvodni));
    }
  });
});
