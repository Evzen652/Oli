import { describe, it, expect } from "vitest";
import { OPAKOVANI_SLOVNICH_DRUHU_OHEBNE_NEOHEBNE } from "../cjl/opakovaniSlovnichDruhuOhebneNeohebne";
import type { PracticeTask } from "@/lib/types";
import { klicUlohy } from "@/lib/taskIdentity";

/**
 * Opakování slovních druhů — ohebné, neohebné (6. ročník, select_one).
 *
 * Nezávislý solver (viz níže) má VLASTNÍ lexikon slovo → slovní druh, oddělený
 * od generátoru, a vlastní kontextové pravidlo pro předložku × příslovce
 * (kolem/vedle/blízko/okolo). Neimportuje žádnou klasifikaci z tématu.
 */
const topic = OPAKOVANI_SLOVNICH_DRUHU_OHEBNE_NEOHEBNE[0];

// ── Nezávislý lexikon (test), oddělený od generátoru ───────────────────────
type Pos =
  | "podstatné jméno" | "přídavné jméno" | "zájmeno" | "číslovka" | "sloveso"
  | "příslovce" | "předložka" | "spojka" | "částice" | "citoslovce";

/** Slovo → je ohebné? (stačí pro úlohy, kde nejde o přesný název druhu.) */
const OHEBNOST: Record<string, boolean> = {
  // L1 (a)
  rychle: false, pes: true, utekl: true, zahradu: true,
  dnes: false, babička: true, upekla: true, koláč: true,
  venku: false, kluci: true, hráli: true, fotbal: true,
  bez: false, maminka: true, uvařila: true, soli: true,
  a: false, anna: true, zpívala: true, tančila: true,
  protože: false, chlapec: true, doběhl: true, pršelo: true,
  haf: false, zaštěkal: true, pošťáka: true,
  kéž: false, vyhráli: true, ten: true, zápas: true,
  // L1 (b)
  na: false, kniha: true, hezký: true, ať: false, bum: false,
  spí: true, otcův: true, dvanáct: true, my: true, pět: true,
  // L2 (a)
  rychlý: true, vlak: true, lesa: true,
  hezky: false, hezká: true, dívka: true, písničku: true,
  silně: false, silný: true, muž: true, dveří: true, do: false,
  potichu: false, tichý: true, kamarádem: true,
  snadno: false, snadný: true, příklad: true, sestra: true,
  vesele: false, veselá: true, kapela: true, oslavě: true,
  krásně: false, krásná: true, zahrada: true, dešti: true,
  pomalu: false, pomalý: true, šnek: true, listu: true,
  // L2 (b)
  přišlo: true, nás: true, ale: false, hned: false, odešli: true, domů: false,
  bylo: true, ticho: true, jenom: false, ještě: false, nespali: true,
  sotva: false, dorazili: true, uviděli: true, sto: true, holubů: true, návsi: true,
  copak: false, už: false, zase: false, přišel: true, on: true,
  kdesi: false, vzadu: false, čekalo: true, trpělivě: false, sedm: true, dětí: true,
  kolem: false, tiše: false, ono: true,
  // L3 (c)
  babiččina: true, kočka: true, chytila: true, myš: true, usnuli: true,
  polštáři: true, sousedův: true, honil: true, kočku: true, nechytil: true, ji: true,
  naše: true, peče: true, výborné: true, koláče: true, bábovku: true, u: false,
  sporáku: true, sešit: true, leží: true, lavici: true, spadl: true, foukal: true,
  stromem: true, je: true, unavený: true, pod: false,
  kluků: true, ho: true, hledalo: true, šlo: true, hledali: true,
  dlouho: false, psa: true, v: false, lese: true,
  mu: true, dva: true, včera: false, oslavu: true, buchty: true,
  tři: true, malé: true, kočky: true, často: false, po: false, dvoře: true, nebo: false,
  noví: true, spolužáci: true, pomohli: true, s: false, úkolem: true, jemu: true,
  // L3 (b)
  starší: true, plavala: true, rychleji: false, nejmladší: true, hráč: true, skákal: true, nejvýš: false,
};

/** Přesný slovní druh — jen pro slova z úloh (a) L1: ohebné/neohebné + druh. */
const POS: Record<string, Pos> = {
  pes: "podstatné jméno", na: "předložka", protože: "spojka", haf: "citoslovce",
  pět: "číslovka", kniha: "podstatné jméno", hezký: "přídavné jméno",
  rychle: "příslovce", ať: "částice", bum: "citoslovce", spí: "sloveso",
  otcův: "přídavné jméno", dvanáct: "číslovka", my: "zájmeno",
};

const PREDLOZKY = new Set(["na", "u", "pod", "bez", "do", "za", "před", "kolem", "vedle", "blízko", "okolo", "z", "ze", "k", "ke", "s", "se", "v", "ve", "o", "po"]);
/** Slova, o kterých víme, že jsou v naší bance vždy podstatné jméno/zájmeno v pádu (pro pravidlo předložka × příslovce). */
const JMENA_V_PADU = new Set(["zahrady", "rybníka", "stromu", "kamarádky", "lesa", "garáže", "školy", "nádraží", "mostu", "domu"]);

const slova = (text: string): string[] => (text.match(/\p{L}+/gu) ?? []).map((w) => w.toLowerCase());

/** Nezávislý solver — z textu otázky odvodí očekávanou odpověď, aniž by se díval na klíč generátoru. */
function solve(t: PracticeTask): { kind: string; expected: string } | null {
  const q = t.question;
  let m: RegExpMatchArray | null;

  // L1 (a) — které slovo z věty se nedá ohýbat
  if ((m = q.match(/^Které slovo z věty „(.+)“ se nedá ohýbat \(nemění tvar\)\?$/))) {
    const kandidati = (t.options ?? []).filter((o) => OHEBNOST[o.toLowerCase()] === false);
    return { kind: "l1a", expected: kandidati[0] ?? "" };
  }

  // L1 (b) — ohebné/neohebné + druh
  if ((m = q.match(/^Slovo „(.+)“ ve větě „(.+)“ patří mezi ohebné, nebo neohebné slovní druhy — a který to je\?$/))) {
    const w = m[1].toLowerCase();
    const pos = POS[w];
    const ohebne = OHEBNOST[w];
    if (!pos || ohebne === undefined) return null;
    return { kind: "l1b", expected: `${ohebne ? "ohebné" : "neohebné"} – ${pos}` };
  }

  // L2 (a) — právě jedno příslovce
  if ((m = q.match(/^Ve větě „(.+)“ je právě jedno příslovce\. Které slovo to je\?$/))) {
    const kandidati = (t.options ?? []).filter((o) => OHEBNOST[o.toLowerCase()] === false);
    return { kind: "l2a", expected: kandidati[0] ?? "" };
  }

  // L2 (b) — které slovo se DÁ ohýbat
  if ((m = q.match(/^Které slovo z věty „(.+)“ se DÁ ohýbat\?$/))) {
    const kandidati = (t.options ?? []).filter((o) => OHEBNOST[o.toLowerCase()] === true);
    return { kind: "l2b", expected: kandidati[0] ?? "" };
  }

  // L2 (c) — kterým ohnutím dokážeš ohebnost (nezávislá tabulka tvarů)
  if ((m = q.match(/^Kterým ohnutím dokážeš, že slovo „(.+)“ je ohebné\?$/))) {
    const INFLECTIONS: Record<string, string> = {
      dům: "domu", žák: "žáka", kniha: "knihy", hrad: "hradu",
      rychlý: "rychlého", kočka: "kočky", silný: "silného",
    };
    const expected = INFLECTIONS[m[1]];
    return expected ? { kind: "l2c", expected } : null;
  }

  // L3 (a) — inverze: předložka × příslovce (kolem, vedle, blízko, okolo)
  if ((m = q.match(/^Ve které větě je slovo „(kolem|vedle|blízko|okolo)“ (předložkou|příslovcem)\?$/))) {
    const word = m[1];
    const chceme = m[2] === "předložkou" ? "předložka" : "příslovce";
    const klasifikuj = (veta: string): "předložka" | "příslovce" => {
      const tokens = slova(veta);
      const i = tokens.indexOf(word);
      const dalsi = i >= 0 ? tokens[i + 1] : undefined;
      return dalsi && JMENA_V_PADU.has(dalsi) ? "předložka" : "příslovce";
    };
    const shoda = (t.options ?? []).filter((o) => klasifikuj(o) === chceme);
    return { kind: "l3a", expected: shoda[0] ?? "" };
  }

  // L3 (d) — příslovce × podstatné jméno u TÉHOŽ tvaru (večer/ráno/odpoledne).
  // Nezávislé pravidlo: podstatné jméno = má před sebou přívlastek/předložku,
  // nebo po něm následuje shodné sloveso „byl/bylo“; jinak příslovce (kdy?).
  if ((m = q.match(/^Ve které větě je slovo „(večer|ráno|odpoledne)“ (příslovcem|podstatným jménem)\?$/))) {
    const word = m[1];
    const chceme = m[2] === "příslovcem" ? "příslovce" : "podstatné jméno";
    const PRED = new Set(["ten", "to", "celé", "celý", "páteční", "sobotní", "na"]);
    const PO = new Set(["byl", "bylo"]);
    const klasifikuj = (veta: string) => {
      const tokens = slova(veta);
      const i = tokens.indexOf(word);
      if (i < 0) return "chybí";
      return PRED.has(tokens[i - 1]) || PO.has(tokens[i + 1]) ? "podstatné jméno" : "příslovce";
    };
    const shoda = (t.options ?? []).filter((o) => klasifikuj(o) === chceme);
    return { kind: "l3d", expected: shoda.length === 1 ? shoda[0] : "" };
  }


  // L3 (b) — stupňování není ohýbání (nezávislá pravidla, ne pevný řetězec)
  if ((m = q.match(/^Které slovo z věty „(.+)“ je neohebné\? Vybírej z nabízených\.$/))) {
    const kandidati = (t.options ?? []).filter((o) => OHEBNOST[o.toLowerCase()] === false);
    return { kind: "l3b-najdi", expected: kandidati.length === 1 ? kandidati[0] : "" };
  }
  if ((m = q.match(/^Který tvar slova „(.+)“ dokazuje, že je to slovo ohebné\?$/))) {
    const PADY: Record<string, string[]> = { hezčí: ["hezčího", "hezčímu"], lepší: ["lepšího", "lepšímu"] };
    const shoda = (t.options ?? []).filter((o) => PADY[m![1]]?.includes(o));
    return { kind: "l3b-pad", expected: shoda.length === 1 ? shoda[0] : "" };
  }
  if ((m = q.match(/Proč je slovo „(.+)“ neohebné, i když se stupňuje\?$/))) {
    const shoda = (t.options ?? []).filter((o) => /neskloňuje se ani nečasuje/i.test(o));
    return { kind: "l3b-proc", expected: shoda.length === 1 ? shoda[0] : "" };
  }
  if ((m = q.match(/Jak vznikl tvar „(.+)“ a co z toho plyne\?$/))) {
    const shoda = (t.options ?? []).filter((o) => /^Stupňováním/.test(o) && /neohebné/.test(o));
    return { kind: "l3b-vznik", expected: shoda.length === 1 ? shoda[0] : "" };
  }
  if ((m = q.match(/Které tvrzení o slově „(.+)“ je pravdivé\?$/))) {
    const w = m[1];
    const stupen = w.startsWith("nej") ? 3 : 2;
    const ZAKLAD: Record<string, string> = { hezčeji: "hezky", lépe: "dobře", nejrychleji: "rychle", rychleji: "rychle" };
    const shoda = (t.options ?? []).filter((o) =>
      /příslovce/.test(o) && o.includes(`${stupen}. stup`) && !/přídavn/.test(o) && !/(^|\s)ohebné/.test(o)
      && (!/příslovce \p{L}+\.$/u.test(o) || o.endsWith(`${ZAKLAD[w]}.`)));
    return { kind: "l3b-tvrzeni", expected: shoda.length === 1 ? shoda[0] : "" };
  }


  // L3 (c) — celovětná analýza (klasifikace všech slov ve všech 4 větách)
  if (q === "Ve které větě jsou VŠECHNA slova ohebná?") {
    // Přísně: každé slovo musí být v lexikonu označené jako ohebné.
    const vseOhebne = (veta: string) => slova(veta).every((w) => OHEBNOST[w] === true);
    const shoda = (t.options ?? []).filter((o) => vseOhebne(o));
    return { kind: "l3c-vsechna", expected: shoda.length === 1 ? shoda[0] : "" };
  }
  if (q === "Ve které větě jsou všechna slova ohebná kromě jednoho předložkového?") {
    const jePredlozkova = (veta: string) => {
      const neohebna = slova(veta).filter((w) => OHEBNOST[w] === false);
      return neohebna.length === 1 && PREDLOZKY.has(neohebna[0]);
    };
    const shoda = (t.options ?? []).filter((o) => jePredlozkova(o));
    return { kind: "l3c-predlozka", expected: shoda[0] ?? "" };
  }

  return null;
}

describe("Opakování slovních druhů (ohebné/neohebné) — metadata", () => {
  it("čeština g6, select_one, Jazyková výchova / Tvarosloví", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-opakovani-slovnich-druhu-ohebne-neohebne-6");
    expect(topic.rvpNodeId).toBe("g6-cjl-jazykova-vychova-tvaroslovi-opakovani-slovnich-druhu-ohebne-neohebne");
    expect(topic.category).toBe("Jazyková výchova");
    expect(topic.topic).toBe("Tvarosloví");
  });
});

const SPORNA_SLOVA = ["pětka", "dvojka", "stovka", "jen", "i", "také", "to", "mnoho", "málo", "vrátný", "hajný"];

describe.each([1, 2, 3])("Opakování slovních druhů — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh (identita = zadání + klíč + možnosti, ne holý text otázky — L3c sdílí prompt pro víc vět)", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(12);
    expect(new Set(tasks.map(klicUlohy)).size).toBe(tasks.length);
  });

  it("select_one struktura: přesně 4 možnosti, klíč mezi nimi, žádné duplicity", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("chybový model: každý distraktor má feedback, správná odpověď ne", () => {
    for (const t of tasks) {
      for (const opt of t.options!) {
        if (opt === t.correctAnswer) {
          expect(t.optionFeedback?.[opt], `klíč nemá mít feedback: ${t.question}`).toBeUndefined();
        } else {
          expect(t.optionFeedback?.[opt], `chybí feedback pro „${opt}“: ${t.question}`).toBeTruthy();
        }
      }
    }
  });

  it("klíč se nevyskytuje ve znění otázky (mimo úlohy, kde se vybírá slovo přímo z citované věty)", () => {
    // U „Které slovo z věty ‚…‘ se (ne)dá ohýbat?“ a „je právě jedno příslovce“
    // je klíč nutně jedno ze čtyř slov citované věty — sentence proto klíč
    // vždy obsahuje, to není giveaway (možnosti samotné odpověď neprozradí).
    const vyberSlovaZVety = /^Které slovo z věty „|je právě jedno příslovce\./;
    for (const t of tasks) {
      if (vyberSlovaZVety.test(t.question)) continue;
      expect(t.question.includes(t.correctAnswer), `giveaway: ${t.question}`).toBe(false);
    }
  });

  it("klíč nikdy není sporné slovo (pětka/dvojka/stovka/jen/i/také/to/mnoho/málo/vrátný/hajný)", () => {
    for (const t of tasks) {
      expect(SPORNA_SLOVA, t.question).not.toContain(t.correctAnswer.toLowerCase());
    }
  });

  it("dvě různé nápovědy, žádná neprozrazuje klíč", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints ?? []) {
        if (t.correctAnswer.length < 3) continue; // krátká slova (a, i) by dala falešné poplachy
        expect(h.includes(t.correctAnswer), `hint leak: ${t.question}`).toBe(false);
      }
    }
  });

  it("každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const jeNejdelsi = tasks.filter((t) => {
      const maxLen = Math.max(...t.options!.map((o) => o.length));
      return t.correctAnswer.length === maxLen;
    }).length;
    expect(jeNejdelsi / tasks.length, "klíč vychází nejdelší příliš často").toBeLessThan(0.7);
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s nezávislým rozborem věty", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
      expect(s!.expected, `solver nenašel žádnou vyhovující možnost: ${t.question}`).not.toBe("");
      expect(t.correctAnswer, `${s!.kind}: ${t.question} → klíč „${t.correctAnswer}“, solver čeká „${s!.expected}“`).toBe(s!.expected);
    }
  });
});

describe("Opakování slovních druhů — determinismus", () => {
  it("gen(level) nemá stav mezi voláními (dva běhy dají validní, nezávisle ověřitelné sady)", () => {
    for (const level of [1, 2, 3]) {
      const a = topic.generator(level);
      const b = topic.generator(level);
      expect(a.length).toBeGreaterThanOrEqual(12);
      expect(b.length).toBeGreaterThanOrEqual(12);
      for (const t of [...a, ...b]) {
        expect(solve(t)?.expected).toBe(t.correctAnswer);
      }
    }
  });
});

describe("Opakování slovních druhů — gradace L1 ≠ L3", () => {
  it("texty otázek L1 a L3 jsou disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) {
      expect(l1.has(q), `L1 a L3 sdílí znění: ${q}`).toBe(false);
    }
  });

  it("L1 je rozpoznání (ohýbá/neohýbá, druh), L3 je analýza věty (inverze, stupňování, celá věta)", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    const l3 = topic.generator(3).map((t) => t.question);
    expect(l1.every((q) => /nedá ohýbat|patří mezi ohebné/.test(q))).toBe(true);
    expect(l3.some((q) => /předložkou|příslovcem\?$|podstatným jménem\?$/.test(q))).toBe(true);
    expect(l3.some((q) => /i když se stupňuje|tvrzení o slově|dokazuje, že je to slovo ohebné|Jak vznikl tvar/.test(q))).toBe(true);
    expect(l3.some((q) => /VŠECHNA slova ohebná|kromě jednoho předložkového/.test(q))).toBe(true);
  });
});
