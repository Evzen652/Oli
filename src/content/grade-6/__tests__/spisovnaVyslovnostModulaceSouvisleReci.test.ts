import { describe, it, expect } from "vitest";
import { SPISOVNA_VYSLOVNOST_MODULACE_SOUVISLE_RECI } from "../cjl/spisovnaVyslovnostModulaceSouvisleReci";
import type { PracticeTask } from "@/lib/types";

/**
 * Spisovná výslovnost a modulace souvislé řeči (select_one).
 *
 * NEZÁVISLÝ SOLVER — data v tomto souboru jsou přepsaná ZNOVU, odděleně od
 * generátoru (žádný import z topic souboru kromě vlastního exportu tématu),
 * aby test odhalil i překlep, který by se generátoru i jemu samotnému
 * propašoval stejně (stejná logická chyba na obou místech).
 */
const topic = SPISOVNA_VYSLOVNOST_MODULACE_SOUVISLE_RECI[0];

// ── L1 — nezávislé tabulky ─────────────────────────────────────────────
const KONCOVE_NEZAVISLE: Record<string, string> = {
  had: "[hat]", led: "[let]", hrad: "[hrat]", oběd: "[objet]",
  dub: "[dup]", zub: "[zup]", holub: "[holup]", krab: "[krap]",
  lev: "[lef]", mrkev: "[mrkef]", rukáv: "[rukáf]", kov: "[kof]",
  nůž: "[nůš]", mráz: "[mrás]", vůz: "[vůs]", roh: "[roch]",
};
const BEZ_ZMENY_NEZAVISLE = new Set([
  "máma", "kolo", "les", "sůl", "pes", "stůl", "dům", "strom", "voda", "okno",
  "lampa", "pero", "hora", "ruka", "sova", "mapa", "lano", "tráva", "slon", "koza",
]);
// L1 šablona D — skryté měkčení (retypováno)
const MEKCENI_NEZAVISLE = new Set(["děti", "tělo", "díra", "ticho", "dědeček", "těsto", "nic", "tiše", "děkovat", "něha", "nitka", "dítě", "tisíc"]);
const BEZ_MEKCENI_NEZAVISLE = new Set(["dým", "nos", "kytara", "tráva", "noha", "lano", "sestra", "dýchat", "motýl", "tyč", "strom", "sova", "tabule", "dort", "nora"]);
const SPISOVNE_NEZAVISLE: Record<string, string> = {
  "[mléko]": "[mlíko]", "[okno]": "[vokno]", "[dobrí]": "[dobrej]", "[bichom]": "[bisme]", "[bít]": "[bejt]",
  "[sír]": "[sejr]", "[okurka]": "[vokurka]", "[malí]": "[malej]", "[létat]": "[lítat]",
};

// ── L2 — nezávislý přepis (retypováno zvlášť od generátoru) ────────────
const PREPIS_NEZAVISLE: Record<string, string> = {
  led: "[let]", hrad: "[hrat]", dub: "[dup]", mráz: "[mrás]", nůž: "[nůš]", lev: "[lef]",
  svatba: "[sfadba]", kdo: "[gdo]", vtip: "[ftip]", loďka: "[loťka]", kobka: "[kopka]", lehký: "[lechkí]",
  město: "[mňesto]", běh: "[bjech]", pěna: "[pjena]", věda: "[vjeda]", měkký: "[mňekí]",
  nic: "[ňic]", tisíc: "[ťisíc]", sníh: "[sňích]", dívka: "[ďífka]", těžký: "[ťeškí]",
};

// ── L3(a) — nezávislá tabulka pauzy (retypováno) ────────────────────────
interface PauzaNezavisle { w1: string; w2: string; w3: string; vyznamW1: string; vyznamW2: string }
const PAUZA_NEZAVISLE: PauzaNezavisle[] = [
  { w1: "Pomalu", w2: "ne", w3: "rychle", vyznamW1: "Dělej to pomalu, ne rychle.", vyznamW2: "Nedělej to pomalu — dělej to rychle." },
  { w1: "Trestat", w2: "ne", w3: "odpouštět", vyznamW1: "Potrestej ho, neodpouštěj mu.", vyznamW2: "Netrestej ho, odpusť mu." },
  { w1: "Chválit", w2: "ne", w3: "kritizovat", vyznamW1: "Pochval ho, nekritizuj ho.", vyznamW2: "Nechval ho, kritizuj ho." },
  { w1: "Pomoct", w2: "ne", w3: "škodit", vyznamW1: "Pomoz mu, neškoď mu.", vyznamW2: "Nepomáhej mu, škoď mu." },
  { w1: "Jít", w2: "ne", w3: "zůstat", vyznamW1: "Jdi, nezůstávej.", vyznamW2: "Nechoď, zůstaň." },
  { w1: "Věřit", w2: "ne", w3: "pochybovat", vyznamW1: "Věř, nepochybuj.", vyznamW2: "Nevěř, pochybuj." },
  { w1: "Mluvit", w2: "ne", w3: "mlčet", vyznamW1: "Mluv, nemlč.", vyznamW2: "Nemluv, mlč." },
  { w1: "Čekat", w2: "ne", w3: "utíkat", vyznamW1: "Čekej, neutíkej.", vyznamW2: "Nečekej, utíkej." },
  { w1: "Psát", w2: "ne", w3: "kreslit", vyznamW1: "Piš, nekresli.", vyznamW2: "Nepiš, kresli." },
];

// ── L3(b) — nezávislá tabulka důrazu (retypováno) ───────────────────────
interface DurazNezavisle { subjekt: string; sloveso: string; predmet: string; okolnost: string; okolnostOtazka: "Kde" | "Kdy" }
const VLASTNI_JMENA = new Set(["Petra", "Tomáš"]);
const uprostred = (s: string) => (VLASTNI_JMENA.has(s) ? s : s.toLowerCase());
const DURAZ_NEZAVISLE: DurazNezavisle[] = [
  { subjekt: "Petra", sloveso: "koupila", predmet: "dort", okolnost: "v pekárně", okolnostOtazka: "Kde" },
  { subjekt: "Tomáš", sloveso: "namaloval", predmet: "obrázek", okolnost: "ve škole", okolnostOtazka: "Kde" },
  { subjekt: "Babička", sloveso: "upekla", predmet: "koláč", okolnost: "včera", okolnostOtazka: "Kdy" },
  { subjekt: "Bratr", sloveso: "opravil", predmet: "kolo", okolnost: "v garáži", okolnostOtazka: "Kde" },
  { subjekt: "Sousedka", sloveso: "zalila", predmet: "květiny", okolnost: "ráno", okolnostOtazka: "Kdy" },
  { subjekt: "Trenér", sloveso: "pochválil", predmet: "tým", okolnost: "po zápase", okolnostOtazka: "Kdy" },
];

// ── L3(c) — nezávislá tabulka situací (retypováno, jen klíčová fráze) ──
const SITUACE_NEZAVISLE: Record<string, string> = {
  "čteš hlášení ve školním rozhlase pro celou školu": "Zřetelně a dost nahlas, v klidném tempu, s krátkou pauzou mezi informacemi.",
  "vypravuješ kamarádovi vtip": "Živě a s napětím v hlase, před pointou krátká pauza, pointu řekni zřetelně.",
  "předčítáš pohádku malému sourozenci": "Pomalu a výrazně, jiným hlasem pro každou postavu, napětí vytvoř ztišením.",
  "se omlouváš učitelce, že nemáš úkol": "Klidně a zřetelně, v mírném tempu, s klesajícím hlasem na konci věty.",
  "odpovídáš u tabule a poslouchá tě celá třída": "Nahlas a zřetelně, ve středním tempu, s krátkou pauzou mezi částmi odpovědi.",
};

// ── L3(d) — nezávislý přepis spojení předložka + slovo (retypováno) ────
const PREDLOZKA_NEZAVISLE: Record<string, string> = {
  "v kapse": "[f kapse]", "z pole": "[s pole]", "k domu": "[g domu]",
  "s bratrem": "[z bratrem]", "bez práce": "[bes práce]", "pod stromem": "[pot stromem]",
};

describe("Spisovná výslovnost a modulace souvislé řeči — metadata", () => {
  it("čeština g6, select_one, Jazyková výchova / Zvuková stránka jazyka", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-spisovna-vyslovnost-modulace-souvisle-reci-6");
    expect(topic.category).toBe("Jazyková výchova");
    expect(topic.topic).toBe("Zvuková stránka jazyka");
    expect(topic.rvpNodeId).toBe("g6-cjl-jazykova-vychova-zvukova-stranka-jazyka-spisovna-vyslovnost-modulace-souvisle-reci");
  });
});

describe.each([1, 2, 3])("Spisovná výslovnost — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const unikatni = new Set(tasks.map((t) => JSON.stringify([t.question, t.correctAnswer, [...(t.options ?? [])].sort()])));
    expect(unikatni.size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé options, správná odpověď je mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("chybový model: každý distraktor má feedback, správná odpověď ne", () => {
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

  it("nápověda neprozrazuje doslovně správnou odpověď", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        if (String(t.correctAnswer).length >= 3) {
          expect(h, `hint leak: ${t.question} → "${t.correctAnswer}"`).not.toContain(String(t.correctAnswer));
        }
      }
    }
  });

  it("každá úloha má hints[0] != hints[1] a explanation", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });
});

// ── NEZÁVISLÝ SOLVER ─────────────────────────────────────────────────────
function solveL1(t: PracticeTask): { expected: string } | null {
  let m: RegExpMatchArray | null;
  if ((m = t.question.match(/^Které slovo se VYSLOVUJE jinak, než se píše\? (.+)$/))) {
    const slova = m[1].split(", ").map((s) => s.trim());
    const menici = slova.filter((s) => s in KONCOVE_NEZAVISLE);
    for (const s of slova) expect(s in KONCOVE_NEZAVISLE || BEZ_ZMENY_NEZAVISLE.has(s), `neznámé slovo: ${s}`).toBe(true);
    expect(menici.length, `přesně 1 měnící se slovo mezi: ${slova.join(", ")}`).toBe(1);
    return { expected: menici[0] };
  }
  if ((m = t.question.match(/^Ve kterém slově na KONCI vyslovíme neznělou souhlásku místo znělé\? (.+)$/))) {
    const slova = m[1].split(", ").map((s) => s.trim());
    const menici = slova.filter((s) => s in KONCOVE_NEZAVISLE);
    for (const s of slova) expect(s in KONCOVE_NEZAVISLE || BEZ_ZMENY_NEZAVISLE.has(s), `neznámé slovo: ${s}`).toBe(true);
    expect(menici.length, `přesně 1 měnící se slovo mezi: ${slova.join(", ")}`).toBe(1);
    return { expected: menici[0] };
  }
  if ((m = t.question.match(/^Ve kterém slově vyslovíme měkké ď, ť nebo ň, i když se píše bez háčku\? (.+)$/))) {
    const slova = m[1].split(", ").map((s) => s.trim());
    const mekka = slova.filter((s) => MEKCENI_NEZAVISLE.has(s));
    expect(mekka.length, `přesně 1 slovo se skrytým měkčením: ${slova.join(", ")}`).toBe(1);
    for (const s of slova) expect(MEKCENI_NEZAVISLE.has(s) || BEZ_MEKCENI_NEZAVISLE.has(s), `neznámé slovo: ${s}`).toBe(true);
    return { expected: mekka[0] };
  }
  if (t.question === "Která výslovnost je SPISOVNÁ?") {
    // klíč musí být spisovná forma z nezávislé tabulky a NESMÍ to být žádná z nespisovných forem
    const spisovneFormy = new Set(Object.keys(SPISOVNE_NEZAVISLE));
    return { expected: spisovneFormy.has(String(t.correctAnswer)) ? String(t.correctAnswer) : "(neznámá spisovná forma)" };
  }
  return null;
}

function solveL2(t: PracticeTask): { expected: string } | null {
  const m = t.question.match(/^Jak spisovně vyslovíme slovo (\S+) ve větě „.+“\?$/);
  if (!m) return null;
  return { expected: PREPIS_NEZAVISLE[m[1]] ?? "(slovo neznámé nezávislé tabulce)" };
}

function solveL3(t: PracticeTask): { expected: string } | null {
  let m: RegExpMatchArray | null;
  // (a) pauza
  if ((m = t.question.match(/^Kam patří pauza ve větě „(\S+) (\S+) (\S+)\.“, aby znamenala: „(.+)“\?$/))) {
    const [, w1, w2, w3, vyznam] = m;
    const p = PAUZA_NEZAVISLE.find((x) => x.w1 === w1 && x.w2 === w2 && x.w3 === w3);
    expect(p, `neznámá trojice slov: ${w1} ${w2} ${w3}`).toBeTruthy();
    const cilW1 = p!.vyznamW1 === vyznam;
    const cilW2 = p!.vyznamW2 === vyznam;
    expect(cilW1 || cilW2, `neznámý cílový význam: "${vyznam}"`).toBe(true);
    const expected = cilW1 ? `${w1} | ${w2} ${w3}.` : `${w1} ${w2} | ${w3}.`;
    return { expected };
  }
  // (b) důraz
  if ((m = t.question.match(/^Která věta se zdůrazněným slovem \(napsaným VELKÝMI PÍSMENY\) odpovídá na otázku „(.+)“\?$/))) {
    const otazka = m[1];
    // najdi větu, která otázce odpovídá zkusmým sestavením všech 6×3 kombinací
    let nalezeno: { role: keyof DurazNezavisle; v: DurazNezavisle } | null = null;
    for (const v of DURAZ_NEZAVISLE) {
      // „Kdo…?“ se pojí s mužským rodem: koupila → koupil
      if (otazka === `Kdo ${v.sloveso.replace(/la$/, "l")} ${v.predmet} ${v.okolnost}?`) nalezeno = { role: "subjekt", v };
      if (otazka === `Co ${uprostred(v.subjekt)} ${v.sloveso} ${v.okolnost}?`) nalezeno = { role: "predmet", v };
      if (otazka === `${v.okolnostOtazka} ${uprostred(v.subjekt)} ${v.sloveso} ${v.predmet}?`) nalezeno = { role: "okolnost", v };
    }
    expect(nalezeno, `otázka nesedí na žádnou položku: ${otazka}`).toBeTruthy();
    const { role, v } = nalezeno!;
    const cilSlovo = String(v[role]).toUpperCase();
    // correctAnswer musí obsahovat cílové slovo velkými písmeny a NEsmí obsahovat ostatní 3 velkými
    const vsechnaSlova: Record<string, string> = { subjekt: v.subjekt, sloveso: v.sloveso, predmet: v.predmet, okolnost: v.okolnost };
    const ostatniVelka = Object.entries(vsechnaSlova).filter(([r]) => r !== role).some(([, w]) => String(t.correctAnswer).includes(w.toUpperCase()) && w.toUpperCase() !== w);
    expect(String(t.correctAnswer), `očekávané zdůrazněné slovo "${cilSlovo}" chybí`).toContain(cilSlovo);
    expect(ostatniVelka, `ve větě je zdůrazněné i jiné slovo než "${cilSlovo}": ${t.correctAnswer}`).toBe(false);
    return { expected: String(t.correctAnswer) };
  }
  // (c) situace
  if ((m = t.question.match(/^Jak je vhodné mluvit, když (.+)\?$/))) {
    const popis = m[1];
    const expected = SITUACE_NEZAVISLE[popis];
    expect(expected, `neznámá situace: ${popis}`).toBeTruthy();
    return { expected };
  }
  // (d) předložka + slovo
  if ((m = t.question.match(/^Jak spisovně vyslovíme spojení „(.+)“\?$/))) {
    const expected = PREDLOZKA_NEZAVISLE[m[1]];
    expect(expected, `neznámé spojení: ${m[1]}`).toBeTruthy();
    return { expected };
  }
  return null;
}

describe("Spisovná výslovnost — NEZÁVISLÝ SOLVER", () => {
  it("L1: klíč souhlasí s nezávislou tabulkou", () => {
    for (const t of topic.generator(1)) {
      const s = solveL1(t);
      expect(s, `solver nerozpoznal L1 otázku: ${t.question}`).not.toBeNull();
      expect(String(t.correctAnswer), t.question).toBe(s!.expected);
    }
  });

  it("L2: fonetický přepis souhlasí s nezávislou tabulkou", () => {
    for (const t of topic.generator(2)) {
      const s = solveL2(t);
      expect(s, `solver nerozpoznal L2 otázku: ${t.question}`).not.toBeNull();
      expect(String(t.correctAnswer), t.question).toBe(s!.expected);
    }
  });

  it("L3: pauza/důraz/situace/přepis souhlasí s nezávislými tabulkami", () => {
    for (const t of topic.generator(3)) {
      const s = solveL3(t);
      expect(s, `solver nerozpoznal L3 otázku: ${t.question}`).not.toBeNull();
      expect(String(t.correctAnswer), t.question).toBe(s!.expected);
    }
  });
});

describe("Spisovná výslovnost — gradace L1 ≠ L3", () => {
  it("L1 a L3 mají disjunktní texty otázek", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje z L1: ${q}`).toBe(false);
  });

  it("L1 začíná Které/Ve kterém/Která; L3 obsahuje pauza/zdůrazněné/přednést(mluvit)/spojení", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    const l3 = topic.generator(3).map((t) => t.question);
    expect(l1.every((q) => /^(Které|Ve kterém|Která)/.test(q)), l1.find((q) => !/^(Které|Ve kterém|Která)/.test(q))).toBe(true);
    expect(l3.some((q) => /pauza/.test(q))).toBe(true);
    expect(l3.some((q) => /zdůrazněným/.test(q))).toBe(true);
    expect(l3.some((q) => /mluvit/.test(q))).toBe(true);
    expect(l3.some((q) => /spojení/.test(q))).toBe(true);
  });
});

describe("Spisovná výslovnost — slova mimo rozsah (sporné jevy vyřazeny)", () => {
  it("v bance se nevyskytuje slovo 'shoda' ani 'vodka' (sporné/nevhodné příklady)", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        expect(t.question.toLowerCase()).not.toContain("shoda");
        expect(t.question.toLowerCase()).not.toMatch(/\bvodka\b/);
      }
    }
  });
});
