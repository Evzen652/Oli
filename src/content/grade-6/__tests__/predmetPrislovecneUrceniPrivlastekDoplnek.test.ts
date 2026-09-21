import { describe, it, expect } from "vitest";
import { PREDMET_PRISLOVECNE_URCENI_PRIVLASTEK_DOPLNEK } from "../cjl/predmetPrislovecneUrceniPrivlastekDoplnek";
import type { PracticeTask } from "@/lib/types";

/**
 * Předmět, příslovečné určení, přívlastek, doplněk — čeština 6. ročník (select_one).
 *
 * Nezávislý solver: tabulky věta → vyznačený člen (a druh, kde je) jsou
 * napsané ručně, ne importované z generátoru. Pro každou vygenerovanou úlohu
 * (L1–L3) test najde větu v tabulce a ověří, že correctAnswer sedí, a že
 * vyznačené slovo/sousloví ve větě opravdu je.
 */
const topic = PREDMET_PRISLOVECNE_URCENI_PRIVLASTEK_DOPLNEK[0];

// ── Nezávislé tabulky (napsané odděleně od generátoru) ──────────────────────

// Formát "Jakým větným členem je ve větě „X“ vyznačená část „Y“?"
// — L1 formát A + L3 (c) obrácený slovosled.
const SOLVER_CLEN_P1: Record<string, { marked: string; clen: string }> = {
  "BABIČKA upletla teplou čepici.": { marked: "BABIČKA", clen: "podmět" },
  "Na zahradě si hrají DĚTI.": { marked: "DĚTI", clen: "podmět" },
  "Naši SOUSEDÉ staví nový plot.": { marked: "SOUSEDÉ", clen: "podmět" },
  "Malá HOLČIČKA nakreslila obrázek.": { marked: "HOLČIČKA", clen: "podmět" },
  "Táta čte KNIHU.": { marked: "KNIHU", clen: "předmět" },
  "Babička upekla VNOUČATŮM buchty.": { marked: "VNOUČATŮM", clen: "předmět" },
  "Věnuji se KRESLENÍ.": { marked: "KRESLENÍ", clen: "předmět" },
  "Kamarádka se těší NA VÝLET.": { marked: "NA VÝLET", clen: "předmět" },
  "Hráli jsme fotbal NA HŘIŠTI.": { marked: "NA HŘIŠTI", clen: "příslovečné určení" },
  "VČERA jsme odjeli na hory.": { marked: "VČERA", clen: "příslovečné určení" },
  "Zpívala POTICHU.": { marked: "POTICHU", clen: "příslovečné určení" },
  "Sešli jsme se PŘED ŠKOLOU.": { marked: "PŘED ŠKOLOU", clen: "příslovečné určení" },
  "Klára čte NAPÍNAVOU knihu.": { marked: "NAPÍNAVOU", clen: "přívlastek" },
  "Petr má ZELENÝ batoh.": { marked: "ZELENÝ", clen: "přívlastek" },
  "STARÝ hrad stojí na kopci.": { marked: "STARÝ", clen: "přívlastek" },
  "Viděli jsme RYCHLÉ auto.": { marked: "RYCHLÉ", clen: "přívlastek" },
  // L3 (c) — obrácený slovosled, podmět × předmět ve 4. pádě
  "MÍČ kopl Tomáš.": { marked: "MÍČ", clen: "předmět" },
  "Míč kopl TOMÁŠ.": { marked: "TOMÁŠ", clen: "podmět" },
  "HOUSKU snědla Klára.": { marked: "HOUSKU", clen: "předmět" },
  "Housku snědla KLÁRA.": { marked: "KLÁRA", clen: "podmět" },
  "DOPIS napsala babička.": { marked: "DOPIS", clen: "předmět" },
  "Dopis napsala BABIČKA.": { marked: "BABIČKA", clen: "podmět" },
};

// Formát "Jakým větným členem je ve větě „X“ vyznačené „Y“?" (bez "slovo (nebo slova)")
// — L2 (c) vazby, L3 (a) doplněk, L3 (b) minimální dvojice.
const SOLVER_CLEN_P2: Record<string, { marked: string; clen: string }> = {
  "Přemýšlela O ZKOUŠCE.": { marked: "O ZKOUŠCE", clen: "předmět" },
  "Staral se O ZAHRADU.": { marked: "O ZAHRADU", clen: "předmět" },
  "Vyprávěl O DOVOLENÉ.": { marked: "O DOVOLENÉ", clen: "předmět" },
  "Mluvili jsme O VÝLETĚ.": { marked: "O VÝLETĚ", clen: "předmět" },
  "Šli jsme DO LESA.": { marked: "DO LESA", clen: "příslovečné určení místa" },
  "Rodina bydlela NA VENKOVĚ.": { marked: "NA VENKOVĚ", clen: "příslovečné určení místa" },
  "Vlak dojel DO STANICE.": { marked: "DO STANICE", clen: "příslovečné určení místa" },
  "Schovali se ZA STODOLOU.": { marked: "ZA STODOLOU", clen: "příslovečné určení místa" },
  "Vrátil se z tábora UNAVENÝ.": { marked: "UNAVENÝ", clen: "doplněk" },
  "Zvolili Janu PŘEDSEDKYNÍ třídy.": { marked: "PŘEDSEDKYNÍ", clen: "doplněk" },
  "Viděl bratra UTÍKAT k autobusu.": { marked: "UTÍKAT", clen: "doplněk" },
  "Ema přišla domů celá PROMOKLÁ.": { marked: "PROMOKLÁ", clen: "doplněk" },
  "Chlapci odešli ze třídy SMUTNÍ.": { marked: "SMUTNÍ", clen: "doplněk" },
  "Kamarádi ho zvolili KAPITÁNEM týmu.": { marked: "KAPITÁNEM", clen: "doplněk" },
  "UNAVENÝ turista došel k chatě.": { marked: "UNAVENÝ", clen: "přívlastek" },
  "Turista došel k chatě UNAVENÝ.": { marked: "UNAVENÝ", clen: "doplněk" },
  "NEMOCNÁ dívka zůstala doma.": { marked: "NEMOCNÁ", clen: "přívlastek" },
  "Dívka zůstala doma NEMOCNÁ.": { marked: "NEMOCNÁ", clen: "doplněk" },
};

// Formát "Jaký druh příslovečného určení je ve větě „X“ vyznačené „Y“?" — L2 (a) + L3 (d).
const SOLVER_DRUH: Record<string, { marked: string; label: string }> = {
  "Sešli jsme se PŘED KINEM.": { marked: "PŘED KINEM", label: "příslovečné určení místa" },
  "Knihu našel POD POSTELÍ.": { marked: "POD POSTELÍ", label: "příslovečné určení místa" },
  "Auto zaparkoval NA NÁMĚSTÍ.": { marked: "NA NÁMĚSTÍ", label: "příslovečné určení místa" },
  "Sraz máme V SEDM HODIN.": { marked: "V SEDM HODIN", label: "příslovečné určení času" },
  "Vrátíme se PŘÍŠTÍ TÝDEN.": { marked: "PŘÍŠTÍ TÝDEN", label: "příslovečné určení času" },
  "Dárky rozbalujeme O VÁNOCÍCH.": { marked: "O VÁNOCÍCH", label: "příslovečné určení času" },
  "Odpověděl TICHÝM HLASEM.": { marked: "TICHÝM HLASEM", label: "příslovečné určení způsobu" },
  "Napsal úkol PEČLIVĚ.": { marked: "PEČLIVĚ", label: "příslovečné určení způsobu" },
  "Šel domů RYCHLÝM KROKEM.": { marked: "RYCHLÝM KROKEM", label: "příslovečné určení způsobu" },
  "Zápas se odložil KVŮLI DEŠTI.": { marked: "KVŮLI DEŠTI", label: "příslovečné určení příčiny" },
  "Škola byla zavřená KVŮLI CHŘIPCE.": { marked: "KVŮLI CHŘIPCE", label: "příslovečné určení příčiny" },
  "Neslyšel zvonek KVŮLI HLUKU.": { marked: "KVŮLI HLUKU", label: "příslovečné určení příčiny" },
  "Šel do obchodu PRO CHLEBA.": { marked: "PRO CHLEBA", label: "příslovečné určení účelu" },
  "Poslali ho PRO LÉKAŘE.": { marked: "PRO LÉKAŘE", label: "příslovečné určení účelu" },
  "Zaplatil DVAKRÁT VÍC.": { marked: "DVAKRÁT VÍC", label: "příslovečné určení míry" },
  "Zboží zdražilo O PĚT KORUN.": { marked: "O PĚT KORUN", label: "příslovečné určení míry" },
};

// Formát "Jakým větným členem je ve větě „X“ vyznačené „Y“? U přívlastku urči i druh." — L2 (b).
const SOLVER_SHODA: Record<string, { marked: string; label: string }> = {
  "VYSOKÁ bříza rostla u cesty.": { marked: "VYSOKÁ", label: "přívlastek shodný" },
  "Přišla NAŠE sousedka.": { marked: "NAŠE", label: "přívlastek shodný" },
  "Koupili DRUHÝ dům.": { marked: "DRUHÝ", label: "přívlastek shodný" },
  "Měl NOVÉ boty.": { marked: "NOVÉ", label: "přívlastek shodný" },
  "Kolo BRATRA stálo u plotu.": { marked: "BRATRA", label: "přívlastek neshodný" },
  "Chuť ČOKOLÁDY byla výborná.": { marked: "ČOKOLÁDY", label: "přívlastek neshodný" },
  "Dům Z CIHEL byl starý.": { marked: "Z CIHEL", label: "přívlastek neshodný" },
  "Hrnek S UCHEM se rozbil.": { marked: "S UCHEM", label: "přívlastek neshodný" },
};

// Formát "Kterou pádovou otázkou se ptáme na vyznačený předmět „Y“ ve větě „X“?" — L2 (d).
const SOLVER_PAD: Record<string, { marked: string; otazka: string }> = {
  "Bojíme se PAVOUKŮ.": { marked: "PAVOUKŮ", otazka: "koho? čeho?" },
  "Věnovala se MALOVÁNÍ.": { marked: "MALOVÁNÍ", otazka: "komu? čemu?" },
  "Potkal jsem KAMARÁDA.": { marked: "KAMARÁDA", otazka: "koho? co?" },
  "Přemýšleli O ZÁVODĚ.": { marked: "O ZÁVODĚ", otazka: "o kom? o čem?" },
  "Rozdělili se S KAMARÁDY.": { marked: "S KAMARÁDY", otazka: "s kým? s čím?" },
  "Bál se TMY.": { marked: "TMY", otazka: "koho? čeho?" },
  "Poděkoval UČITELCE.": { marked: "UČITELCE", otazka: "komu? čemu?" },
  "Navštívili MUZEUM.": { marked: "MUZEUM", otazka: "koho? co?" },
};

// Formát "Na který větný člen se ptáme otázkou „X“?" — L1 formát B.
const SOLVER_FORMAT_B: Record<string, string> = {
  "KDY?": "příslovečné určení",
  "KDE?": "příslovečné určení",
  "JAK?": "příslovečné určení",
  "KDO? nebo CO? (1. pád)": "podmět",
  "KOHO? nebo CO? (4. pád)": "předmět",
  "KOMU? nebo ČEMU? (3. pád)": "předmět",
  "JAKÝ? KTERÝ? nebo ČÍ?": "přívlastek",
  "ČÍ?": "přívlastek",
};

// Formát "Ve které z vět se slovem „L“ je vyznačený člen doplňkem?" — L3 (e).
const SOLVER_L3E: Record<string, string> = {
  vítěz: "Diváci ho vyhlásili VÍTĚZEM závodu.",
  kapitánka: "Zvolili Janu KAPITÁNKOU týmu.",
  básník: "Kritici ho nazvali BÁSNÍKEM generace.",
};

interface SolveResult {
  kind: string;
  expected: string;
  marked?: string;
  sentence?: string;
}

/** Nezávislý solver — vrací null, když otázku nerozpozná. */
function solve(t: PracticeTask): SolveResult | null {
  const q = t.question;
  let m: RegExpMatchArray | null;

  if ((m = q.match(/^Jakým větným členem je ve větě „(.+?)“ vyznačená část „(.+?)“\?$/))) {
    const [, sentence, marked] = m;
    const row = SOLVER_CLEN_P1[sentence];
    if (!row) return null;
    return { kind: "P1", expected: row.clen, marked, sentence };
  }
  if ((m = q.match(/^Jakým větným členem je ve větě „(.+?)“ vyznačené „(.+?)“\?$/))) {
    const [, sentence, marked] = m;
    const row = SOLVER_CLEN_P2[sentence];
    if (!row) return null;
    return { kind: "P2", expected: row.clen, marked, sentence };
  }
  if ((m = q.match(/^Jaký druh příslovečného určení je ve větě „(.+?)“ vyznačené „(.+?)“\?$/))) {
    const [, sentence, marked] = m;
    const row = SOLVER_DRUH[sentence];
    if (!row) return null;
    return { kind: "DRUH", expected: row.label, marked, sentence };
  }
  if ((m = q.match(/^Jakým větným členem je ve větě „(.+?)“ vyznačené „(.+?)“\? U přívlastku urči i druh\.$/))) {
    const [, sentence, marked] = m;
    const row = SOLVER_SHODA[sentence];
    if (!row) return null;
    return { kind: "SHODA", expected: row.label, marked, sentence };
  }
  if ((m = q.match(/^Kterou pádovou otázkou se ptáme na vyznačený předmět „(.+?)“ ve větě „(.+?)“\?$/))) {
    const [, marked, sentence] = m;
    const row = SOLVER_PAD[sentence];
    if (!row) return null;
    return { kind: "PAD", expected: row.otazka, marked, sentence };
  }
  if ((m = q.match(/^Na který větný člen se ptáme otázkou „(.+?)“\?$/))) {
    const otazka = m[1];
    if (!(otazka in SOLVER_FORMAT_B)) return null;
    return { kind: "FORMAT_B", expected: SOLVER_FORMAT_B[otazka] };
  }
  if ((m = q.match(/^Ve které z vět se slovem „(.+?)“ je vyznačený člen doplňkem\?$/))) {
    const lemma = m[1];
    if (!(lemma in SOLVER_L3E)) return null;
    return { kind: "L3E", expected: SOLVER_L3E[lemma] };
  }
  return null;
}

describe("Předmět, PU, přívlastek, doplněk — metadata", () => {
  it("čeština g6, select_one, Jazyková výchova / Skladba", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-predmet-prislovecne-urceni-privlastek-doplnek-6");
    expect(topic.category).toBe("Jazyková výchova");
    expect(topic.topic).toBe("Skladba");
  });
});

describe.each([1, 2, 3])("Předmět/PU/přívlastek/doplněk — úlohy level %i", (level) => {
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

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s vlastním výpočtem a vyznačené slovo je ve větě", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
      expect(t.correctAnswer, `${s!.kind}: ${t.question}`).toBe(s!.expected);
      if (s!.marked && s!.sentence) {
        expect(s!.sentence.includes(s!.marked), `vyznačené „${s!.marked}“ není ve větě „${s!.sentence}“`).toBe(true);
      }
    }
  });
});

describe("Předmět/PU/přívlastek/doplněk — gradace a rozsah pojmů podle úrovně", () => {
  it("L1 a L3 otázky jsou textově disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });

  it("L1: doplněk se nikdy nevyskytuje (ani jako klíč, ani jako možnost)", () => {
    for (const t of topic.generator(1)) {
      expect(t.correctAnswer).not.toBe("doplněk");
      expect(t.options).not.toContain("doplněk");
    }
  });

  it("L1: klíčem je jen jeden ze čtyř hlavních pojmů (podmět/předmět/PU/přívlastek), žádný druh", () => {
    const povolene = new Set(["podmět", "předmět", "příslovečné určení", "přívlastek"]);
    for (const t of topic.generator(1)) {
      expect(povolene.has(t.correctAnswer), `L1 klíč mimo 4 hlavní pojmy: ${t.correctAnswer} (${t.question})`).toBe(true);
    }
  });

  it("L2: doplněk se objevuje jen jako distraktor, nikdy jako klíč", () => {
    const l2 = topic.generator(2);
    expect(l2.some((t) => t.correctAnswer === "doplněk")).toBe(false);
    expect(l2.some((t) => t.options?.includes("doplněk"))).toBe(true);
  });

  it("L2: příslovečné určení míry a účelu se nevyskytuje (ani jako klíč)", () => {
    for (const t of topic.generator(2)) {
      expect(t.correctAnswer).not.toBe("příslovečné určení míry");
      expect(t.correctAnswer).not.toBe("příslovečné určení účelu");
    }
  });

  it("L3: obsahuje doplněk jako klíč", () => {
    expect(topic.generator(3).some((t) => t.correctAnswer === "doplněk")).toBe(true);
  });

  it("L3: obsahuje příslovečné určení míry i účelu jako klíč", () => {
    const l3 = topic.generator(3);
    expect(l3.some((t) => t.correctAnswer === "příslovečné určení míry")).toBe(true);
    expect(l3.some((t) => t.correctAnswer === "příslovečné určení účelu")).toBe(true);
  });

  it("L2 obsahuje všechny čtyři druhy příslovečného určení (místa/času/způsobu/příčiny)", () => {
    const l2 = topic.generator(2).map((t) => t.correctAnswer);
    for (const label of ["příslovečné určení místa", "příslovečné určení času", "příslovečné určení způsobu", "příslovečné určení příčiny"]) {
      expect(l2, `chybí ${label} v L2`).toContain(label);
    }
  });

  it("L2 obsahuje oba druhy přívlastku (shodný i neshodný)", () => {
    const l2 = topic.generator(2).map((t) => t.correctAnswer);
    expect(l2).toContain("přívlastek shodný");
    expect(l2).toContain("přívlastek neshodný");
  });
});
