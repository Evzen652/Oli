import { describe, it, expect } from "vitest";
import { VERS_RYM_PRIROVNANI_METAFORA_UVOD } from "../cjl/versRymPrirovnaniMetaforaUvod";
import type { PracticeTask } from "@/lib/types";

/**
 * Verš, rým, přirovnání, metafora (úvod) — čeština 6. ročník (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nečte interní pole generátoru — jen text
 * vygenerovaných úloh):
 *  1. RÝM: z otázky vytáhne verše (rozdělené „ / “), vezme poslední slovo
 *     každého (bez interpunkce, malými písmeny) a porovná koncovky podle
 *     ručně sestavené tabulky rýmových tříd. Z toho odvodí schéma
 *     (AABB/ABAB/ABBA/bez rýmu) a ověří shodu s klíčem generátoru. Navíc
 *     ověří, že každé čtyřverší v bance má nejvýš jedno platné schéma.
 *  2. PROSTŘEDEK: klasifikátor nad textem věty — obsahuje-li „jako“/„jak“,
 *     jde o přirovnání; jinak obsahuje-li „je“/„jsou“, jde o metaforu.
 *  3. VÝZNAM METAFORY (L3): nezávislá tabulka obraz → očekávané klíčové
 *     slovo významu; ověří, že klíč slovo obsahuje a distraktory ne.
 *  4. PAST „JAKO“ (L3): strukturální klasifikátor rolí (tabulka povolání +
 *     věty začínající „Jako …“) a způsobu ([]„jak“ bez „jako“]) — ověří, že
 *     klíč je skutečné přirovnání a všechny tři distraktory jsou role/způsob.
 */
const topic = VERS_RYM_PRIROVNANI_METAFORA_UVOD[0];

// ── 0. Metadata ──────────────────────────────────────────────────────────

describe("Verš, rým, přirovnání, metafora — metadata", () => {
  it("čeština g6, select_one, Literární výchova / Základy literární teorie", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-vers-rym-prirovnani-metafora-uvod-6");
    expect(topic.rvpNodeId).toBe("g6-cjl-literarni-vychova-zaklady-literarni-teorie-vers-rym-prirovnani-metafora-uvod");
    expect(topic.category).toBe("Literární výchova");
    expect(topic.topic).toBe("Základy literární teorie");
  });
});

// ── 1. NEZÁVISLÝ SOLVER: RÝM ─────────────────────────────────────────────

function posledniSlovoTest(radek: string): string {
  const cista = radek.replace(/[,.!?„“–:;]+$/g, "").trim();
  const slova = cista.split(/\s+/);
  return slova[slova.length - 1].toLowerCase();
}

// Ručně sestavená tabulka rýmových tříd (nezávisle na zdrojovém souboru) —
// pokrývá všechna koncová slova použitá v bance L2a i L3 (rým + obraz).
const RYM_TRIDA: Record<string, string> = {
  les: "ES", ples: "ES",
  noc: "OC", pomoc: "OC",
  stromy: "OMY", domy: "OMY",
  máj: "AJ", ráj: "AJ",
  kočka: "OCKA", očka: "OCKA",
  louka: "OUKA", mouka: "OUKA",
  voda: "ODA", škoda: "ODA",
  hory: "ORY", dvory: "ORY",
  mráz: "AS", vás: "AS",
  den: "EN", sen: "EN",
  kvítí: "ITI", svítí: "ITI",
  moře: "ORE", dvoře: "ORE",
  hvězdy: "EZDY",
  náladu: "ALADU",
  lakem: "AKEM",
  kořeny: "ORENY",
  oheň: "OHEN",
  majoránky: "ANKY",
  noci: "OCI", pomoci: "OCI",
  tůně: "UNE", vůně: "UNE",
};
function tridaSlova(w: string): string {
  return RYM_TRIDA[w] ?? `UNIK_${w}`;
}

type SchemaTest = "sdružený (AABB)" | "střídavý (ABAB)" | "obkročný (ABBA)" | "bez rýmu" | "sdružený (AA)";

function urciSchema(verse: string[]): SchemaTest {
  const t = verse.map(posledniSlovoTest).map(tridaSlova);
  if (verse.length === 4) {
    const aabb = t[0] === t[1] && t[2] === t[3] && t[0] !== t[2];
    const abab = t[0] === t[2] && t[1] === t[3] && t[0] !== t[1];
    const abba = t[0] === t[3] && t[1] === t[2] && t[0] !== t[1];
    const pocetPlatnych = [aabb, abab, abba].filter(Boolean).length;
    expect(pocetPlatnych, `čtyřverší má víc než jedno platné schéma: ${verse.join(" / ")}`).toBeLessThanOrEqual(1);
    if (aabb) return "sdružený (AABB)";
    if (abab) return "střídavý (ABAB)";
    if (abba) return "obkročný (ABBA)";
    return "bez rýmu";
  }
  // Dvojverší: čtyřveršové schéma AABB se na dva verše použít nedá.
  return t[0] === t[1] ? "sdružený (AA)" : "bez rýmu";
}

function vytahniVerse(question: string, prefix: string, suffix: string): string[] {
  const re = new RegExp(`^${prefix}„(.+)“ ${suffix}$`, "u");
  const m = question.match(re);
  expect(m, `formát otázky nerozpoznán: ${question}`).not.toBeNull();
  return m![1].split(" / ");
}

describe("NEZÁVISLÝ SOLVER 1: rýmové schéma čtyřverší (L2a)", () => {
  it("schéma odvozené z koncových slov sedí s klíčem generátoru pro všech 12 čtyřverší v bance", () => {
    const l2 = topic.generator(2);
    const ukazky = l2.filter((t) => t.question.startsWith("Přečti si čtyřverší:"));
    const videna = new Set<string>();
    for (const t of ukazky) {
      const verse = vytahniVerse(t.question, "Přečti si čtyřverší: ", "Jaké má rýmové schéma\\?");
      expect(verse.length).toBe(4);
      videna.add(verse.join("|"));
      const schema = urciSchema(verse);
      expect(schema, `neshoda schématu pro: ${verse.join(" / ")}`).toBe(t.correctAnswer);
    }
    // banka má 16 čtyřverší (12 se schématem + 4 bez rýmu) — ruzneUlohy
    // (pool.length) by měl při dostatku pokusů posbírat všechna.
    expect(videna.size).toBeGreaterThanOrEqual(12);
  });
});

// ── 2. NEZÁVISLÝ SOLVER: PROSTŘEDEK (přirovnání × metafora) ─────────────

function obsahujeSlovo(text: string, slovo: string): boolean {
  return new RegExp(`(?<![\\p{L}\\p{N}_])${slovo}(?![\\p{L}\\p{N}_])`, "iu").test(text);
}
function klasifikujProstredek(sentence: string): "přirovnání" | "metafora" | null {
  if (obsahujeSlovo(sentence, "jako") || obsahujeSlovo(sentence, "jak")) return "přirovnání";
  if (obsahujeSlovo(sentence, "je") || obsahujeSlovo(sentence, "jsou")) return "metafora";
  return null;
}

describe("NEZÁVISLÝ SOLVER 2: přirovnání × metafora v jedné větě (L2b)", () => {
  it("klasifikátor (jako/jak → přirovnání, jinak je/jsou → metafora) sedí s klíčem pro všechny vygenerované úlohy", () => {
    const l2 = topic.generator(2);
    const ukazky = l2.filter((t) => t.question.startsWith("„") && t.question.endsWith("Jaký básnický prostředek je v téhle větě?"));
    expect(ukazky.length).toBeGreaterThan(0);
    for (const t of ukazky) {
      const m = t.question.match(/^„(.+)“ Jaký básnický prostředek je v téhle větě\?$/u);
      expect(m, `formát nerozpoznán: ${t.question}`).not.toBeNull();
      const vysledek = klasifikujProstredek(m![1]);
      expect(vysledek, `nejednoznačné: ${m![1]}`).not.toBeNull();
      expect(vysledek, `klasifikátor nesouhlasí s klíčem: ${m![1]}`).toBe(t.correctAnswer);
    }
  });
});

// ── 3. NEZÁVISLÝ SOLVER: rým + obraz zároveň (L3, šablona 4) ─────────────

describe("NEZÁVISLÝ SOLVER 3: kombinované tvrzení (rým i básnický prostředek) — L3", () => {
  it("rýmová i figurativní část klíčového tvrzení sedí s nezávislým rozborem básně", () => {
    const l3 = topic.generator(3);
    const ukazky = l3.filter((t) => t.question.startsWith("Přečti si báseň:"));
    expect(ukazky.length).toBeGreaterThan(0);
    for (const t of ukazky) {
      const verse = vytahniVerse(t.question, "Přečti si báseň: ", "Které tvrzení o ní platí\\?");
      expect([2, 4]).toContain(verse.length);
      const schema = urciSchema(verse);

      // Tvrzení má tvar "Rým je <schéma> a v <N>. verši je <typ>." nebo
      // "Rým tu není a v <N>. verši je <typ>."
      const m = t.correctAnswer.match(/^(Rým je (.+)|Rým tu není) a (?:v|ve) (\d)\. verši je (metafora|přirovnání)\.$/u);
      expect(m, `klíč nerozpoznán: ${t.correctAnswer}`).not.toBeNull();
      const klicSchema: SchemaTest = m![2] ? (m![2] as SchemaTest) : "bez rýmu";
      const klicVers = Number(m![3]);
      const klicTyp = m![4] as "metafora" | "přirovnání";

      expect(klicSchema, `rým v klíči nesedí s rozborem: ${t.correctAnswer}`).toBe(schema);
      expect(klicVers >= 1 && klicVers <= verse.length, `verš mimo rozsah: ${t.correctAnswer}`).toBe(true);
      const oznaceny = klasifikujProstredek(verse[klicVers - 1]);
      expect(oznaceny, `verš ${klicVers} nemá rozpoznatelný prostředek: ${verse[klicVers - 1]}`).not.toBeNull();
      expect(oznaceny, `typ prostředku v klíči nesedí s veršem ${klicVers}: ${verse[klicVers - 1]}`).toBe(klicTyp);

      // Ostatní verše prostředek neobsahují (jen jeden verš z básně ho má).
      verse.forEach((v, i) => {
        if (i === klicVers - 1) return;
        expect(klasifikujProstredek(v), `verš ${i + 1} by neměl mít rozpoznatelný prostředek: ${v}`).toBeNull();
      });
    }
  });
});

// ── 4. NEZÁVISLÝ SOLVER: význam metafory (L3, šablona 1) ─────────────────

const OBRAZ_KEYWORD: { match: string; expect: string }[] = [
  { match: "šíp", expect: "rychle" },
  { match: "zrcadl", expect: "klidná" },   // „zrcadlem“ (7. pád) i „zrcadlo“
  { match: "hlemýžď", expect: "pomalu" },
  { match: "mraveneček", expect: "pracovala" },
  { match: "liška", expect: "chytře" },
  { match: "skála", expect: "spolehlivý" },
  { match: "sopka", expect: "rozzlobil" },
  { match: "rozbouřené moře", expect: "nervózní" },
  { match: "anděl", expect: "starala" },
  { match: "lev", expect: "odvážně" },
  { match: "myš", expect: "tichá" },
  { match: "hvězda", expect: "vynikala" },
];

describe("NEZÁVISLÝ SOLVER 4: význam metafory — klíč sedí s ručně napsanou tabulkou obraz→vlastnost", () => {
  it("klíč obsahuje očekávané klíčové slovo, žádný distraktor ho neobsahuje", () => {
    const l3 = topic.generator(3);
    const ukazky = l3.filter((t) => t.question.endsWith("Co tím chtěl autor říct?"));
    expect(ukazky.length).toBeGreaterThan(0);
    for (const t of ukazky) {
      const entry = OBRAZ_KEYWORD.find((e) => t.question.includes(e.match));
      expect(entry, `obraz nerozpoznán v otázce: ${t.question}`).toBeDefined();
      expect(t.correctAnswer.includes(entry!.expect), `klíč neobsahuje očekávané slovo „${entry!.expect}“: ${t.correctAnswer}`).toBe(true);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(d.includes(entry!.expect), `distraktor by neměl obsahovat klíčové slovo „${entry!.expect}“: ${d}`).toBe(false);
      }
    }
  });
});

// ── 5. NEZÁVISLÝ SOLVER: past „jako“ bez přirovnání (L3, šablona 3) ──────

const POVOLANI = [
  "kuchař", "lékařka", "řidič", "prodavačka", "učitel", "zahradník",
  "hasič", "instruktorka", "číšník", "kovář", "animátorka", "pekař",
];
function jeRole(sentence: string): boolean {
  if (/^Jako\s/u.test(sentence)) return true;
  return POVOLANI.some((p) => sentence.includes(`jako ${p}`));
}
function jeZpusob(sentence: string): boolean {
  return / jak /u.test(sentence) && !/ jako /u.test(sentence);
}
function jeSkutecnePrirovnani(sentence: string): boolean {
  return / jako /u.test(sentence) && !jeRole(sentence);
}

describe("NEZÁVISLÝ SOLVER 5: past „jako“ — klíč je skutečné přirovnání, distraktory role/způsob", () => {
  it("klíč porovnává dvě věci, všechny tři distraktory jsou role, povolání nebo způsob", () => {
    const l3 = topic.generator(3);
    const ukazky = l3.filter((t) => t.question === "Ve které větě JE přirovnání (porovnání dvou různých věcí slovem jako nebo jak)?");
    expect(ukazky.length).toBeGreaterThan(0);
    for (const t of ukazky) {
      expect(jeSkutecnePrirovnani(t.correctAnswer), `klíč není rozpoznán jako skutečné přirovnání: ${t.correctAnswer}`).toBe(true);
      const distraktory = t.options!.filter((o) => o !== t.correctAnswer);
      expect(distraktory.length).toBe(3);
      for (const d of distraktory) {
        const role = jeRole(d);
        const zpusob = jeZpusob(d);
        expect(role || zpusob, `distraktor není ani role, ani způsob: ${d}`).toBe(true);
        expect(jeSkutecnePrirovnani(d), `distraktor by neměl vyjít jako skutečné přirovnání: ${d}`).toBe(false);
      }
    }
  });
});

// ── 6. Obecné kontroly (všechny úrovně) ──────────────────────────────────

describe.each([1, 2, 3])("Verš, rým, přirovnání, metafora — úlohy level %i", (level) => {
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

describe("Verš, rým, přirovnání, metafora — L1 a L3 jsou textově disjunktní", () => {
  it("L1 a L3 otázky se nepřekrývají", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });
});

describe("Verš, rým, přirovnání, metafora — L1 banka: ≥14 unikátních položek", () => {
  it("generator(1) pokryje aspoň 14 různých úloh při dostatku pokusů", () => {
    const keys = new Set(topic.generator(1).map((t) => `${t.question}|${t.correctAnswer}`));
    expect(keys.size).toBeGreaterThanOrEqual(14);
  });
});

describe("Verš, rým, přirovnání, metafora — determinismus generátoru", () => {
  it("gen() nemá stav mezi voláními — opakované volání dá znovu validní sadu", () => {
    for (let i = 0; i < 5; i++) {
      const t = topic.generator(2);
      expect(t.length).toBeGreaterThan(0);
    }
  });
});
