import { describe, it, expect } from "vitest";
import { DOPIS_SOUKROMY_A_UREDNI } from "../cjl/dopisSoukromyAUredni";
import type { PracticeTask } from "@/lib/types";

/**
 * Dopis soukromý a úřední — čeština 6. ročník (select_one).
 *
 * Nezávislý solver: tabulky a klasifikátory jsou napsané odděleně od
 * generátoru (přepsané ručně, ne importované), jak požaduje spec:
 *  (1) rejstříková tabulka pro L1(b) oslovení/pozdrav a L2 situace,
 *  (2) klasifikátor řádku → část dopisu pro L1(a),
 *  (3) klíčovým detektorem hovorových/úředních prvků pro L3(a) — najde
 *      právě jeden porušující řádek v textu dopisu vytaženém z otázky,
 *  (4) klíčovým detektorem přítomnosti povinných údajů pro L3(b).
 */
const topic = DOPIS_SOUKROMY_A_UREDNI[0];

// ── (1) L1(a) — nezávislá tabulka řádek → část dopisu ───────────────────────

type Cast = "oslovení" | "úvod" | "jádro" | "závěr" | "pozdrav" | "podpis" | "věc" | "místo a datum" | "adresa adresáta";

const SOLVER_RADEK: Record<string, Cast> = {
  "Žádost o uvolnění z vyučování": "věc",
  "Vážená paní ředitelko,": "oslovení",
  "S pozdravem": "pozdrav",
  "Předem děkuji za kladné vyřízení mé žádosti.": "závěr",
  "Ahoj Ondro,": "oslovení",
  "Měj se hezky,": "pozdrav",
  "Jana Nováková": "podpis",
  "V Praze dne 12. dubna 2026": "místo a datum",
  "Městský úřad Horní Lhota, Náměstí 5, 273 51 Horní Lhota": "adresa adresáta",
  "Jak se máš? Dlouho jsem ti nepsal.": "úvod",
  "Dovoluji si Vás požádat o prodloužení výpůjční doby o dva týdny.": "jádro",
  "Byla jsem se o víkendu podívat na nové kotě, které si pořídili sousedi.": "jádro",
};

// ── (1) L1(b) — nezávislá tabulka adresát → oslovení/pozdrav ────────────────

const SOLVER_OSLOVENI: Record<string, string> = {
  "babičce": "Milá babičko,",
  "kamarádovi Ondrovi": "Ahoj Ondro,",
  "sestřenici Aničce": "Ahoj Aničko,",
  "dědečkovi": "Milý dědečku,",
  "paní ředitelce školy": "Vážená paní ředitelko,",
  "řediteli ZUŠ": "Vážený pane řediteli,",
  "městskému úřadu": "Vážení,",
  "knihovně": "Vážení,",
  "správě sportovní haly": "Vážení,",
};
const BLIZCI_ADRESATI = new Set(["babičce", "kamarádovi Ondrovi", "sestřenici Aničce", "dědečkovi"]);

const SOLVER_POZDRAV: Record<string, string> = {
  "paní ředitelce": "S pozdravem",
  "babičce": "Měj se hezky,",
};

// ── (1) L2 — nezávislá tabulka situace → formulace + rejstřík ───────────────

interface L2Row {
  spravna: string;
  ureni: boolean; // true = úřední adresát (vyká se), false = soukromý (tyká se)
}
const SOLVER_L2: Record<string, L2Row> = {
  "Tereza píše správě koupaliště, protože tam o víkendu zapomněla mikinu.": { spravna: "Obracím se na Vás s prosbou o pomoc se ztracenou věcí.", ureni: true },
  "Filip píše knihovně, protože chce prodloužit výpůjční dobu knihy o dva týdny.": { spravna: "Prosím Vás o prodloužení výpůjční doby o dva týdny.", ureni: true },
  "Klářina maminka píše řediteli školy žádost o uvolnění Kláry na sportovní závody.": { spravna: "Věc: Žádost o uvolnění z vyučování", ureni: true },
  "Matěj píše dopravnímu podniku, protože autobus nepřijel podle jízdního řádu.": { spravna: "Chtěl bych Vás upozornit na zpoždění autobusu linky 15 dne 3. května.", ureni: true },
  "Ema píše zoo se žádostí o slevu na vstupném pro školní výlet.": { spravna: "Prosím Vás o zvážení slevy na vstupném pro naši třídu.", ureni: true },
  "Vojta píše plaveckému klubu žádost o přijetí do kurzu.": { spravna: "Věc: Přihláška do plaveckého kurzu", ureni: true },
  "Bára píše správě sportovní haly žádost o rezervaci haly na turnaj.": { spravna: "Dovoluji si Vás požádat o rezervaci sportovní haly na turnaj.", ureni: true },
  "David píše obecnímu úřadu žádost o povolení konat sběr papíru ve škole.": { spravna: "Prosím Vás o vydání povolení k pořádání sběru papíru.", ureni: true },
  "Petra píše babičce poděkování za dárek k narozeninám.": { spravna: "Moc ti děkuju za krásný dárek, mám z něj radost.", ureni: false },
  "Honza píše kamarádovi z tábora, že se těší na příští léto.": { spravna: "Ahoj, jak se máš? Já se už teď těším na příští tábor!", ureni: false },
  "Anička píše sestřenici o tom, jaké to bylo na prázdninovém táboře.": { spravna: "Měj se moc hezky a piš mi, jak se máš!", ureni: false },
  "Kuba píše dědečkovi o tom, jak dopadl fotbalový zápas.": { spravna: "Ahoj dědo, chci ti povyprávět, jak dopadl náš zápas!", ureni: false },
  "Tereza píše bývalé spolužačce Elišce, která se přestěhovala, aby jí popsala nový rok ve třídě.": { spravna: "Napiš mi zase brzy, moc ráda si tvoje dopisy čtu!", ureni: false },
  "Ondra píše babičce, že jí posílá pozdrav z lyžařského výcviku.": { spravna: "Ahoj babi, píšu ti z lyžáku, je tu super sníh!", ureni: false },
};

// ── (3) L3(a) — klasifikátor hovorových/úředních prvků ──────────────────────

const HOVOROVE_MARKERS = [/\bhele\b/i, /\bjasný\b/i, /\bfakt\b/i, /:\)/, /^měj se/i, /,\s*ne\?/i];
const UREDNI_MARKERS = [/^S úctou/i, /^Věc:/i, /^Vážen(ý|á)/i, /^Vážení/i];

/** V úředním dopise hledá hovorový/nespisovný řádek, v soukromém úřední prvek. Očekává právě 1 shodu. */
function najdiCizorodyRadek(lines: string[], druh: "úředního" | "soukromého"): string | null {
  const markers = druh === "úředního" ? HOVOROVE_MARKERS : UREDNI_MARKERS;
  const shody = lines.filter((l) => markers.some((m) => m.test(l)));
  return shody.length === 1 ? shody[0] : null;
}

// ── (4) L3(b) — detektor přítomnosti povinných údajů ─────────────────────────

function pritomneUdaje(lines: string[]): Record<"věc" | "místo a datum" | "podpis" | "konkrétní požadavek", boolean> {
  const vec = lines.some((l) => /^Věc:/i.test(l));
  const datum = lines.some((l) => /^V .+ dne \d/i.test(l));
  const podpis = lines.length > 0 && !/^S pozdravem/i.test(lines[lines.length - 1]);
  const prosba = lines.some((l) => /pros[íi]m|žádám/i.test(l) && /(dne \d|o \d|kvůli|na sobotu|o dva týdny)/i.test(l));
  return { "věc": vec, "místo a datum": datum, "podpis": podpis, "konkrétní požadavek": prosba };
}

/** Vytáhne řádky dopisu z otázky (segmenty v uvozovkách „…“). */
function radkyZOtazky(question: string): string[] {
  return [...question.matchAll(/„([^„“]+)“/g)].map((m) => m[1]);
}

// ── Kontakty (nesmí se vyskytovat) ───────────────────────────────────────────
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_RE = /\b\d{3}[\s.-]?\d{3}[\s.-]?\d{3}\b/;

describe("Dopis soukromý a úřední — metadata", () => {
  it("čeština g6, select_one, Komunikační a slohová výchova / Slohová výchova", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-dopis-soukromy-a-uredni-6");
    expect(topic.category).toBe("Komunikační a slohová výchova");
    expect(topic.topic).toBe("Slohová výchova");
    expect(topic.rvpNodeId).toBe("g6-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-soukromy-a-uredni");
  });
});

function jeL1a(q: string): boolean {
  return /Řádek „[^„“]+“ je v (?:tomto )?dopise…$/.test(q);
}
function jeL3a(q: string): boolean {
  return /nepatří\?$/.test(q);
}
function jeL3b(q: string): boolean {
  return /Co v tomto úředním dopise chybí\?$/.test(q);
}
function jeL3c(q: string): boolean {
  return /Kterou opravou bude .+ v pořádku\?$/.test(q);
}

describe.each([1, 2, 3])("Dopis soukromý a úřední — úlohy level %i", (level) => {
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

  it("nápověda: 2 unikátní nápovědy, žádná neprozrazuje odpověď", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints ?? []) {
        if (t.correctAnswer.length >= 3) {
          expect(h, `hint leak: "${t.correctAnswer}" v nápovědě úlohy "${t.question}"`).not.toContain(t.correctAnswer);
        }
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

  it("správná odpověď se nevyskytuje ve znění otázky (kromě čtení řádku/dopisu, kde je text záměrně vidět)", () => {
    for (const t of tasks) {
      // L1(a) cituje přímo posuzovaný řádek dopisu (např. „S pozdravem“ pro
      // klíč "pozdrav") a L3(a) ukazuje celý dopis — klíč je v obou případech
      // záměrně vidět, protože úkolem je právě ROZPOZNAT ho v textu, ne
      // uhodnout skryté slovo.
      if (jeL1a(t.question) || jeL3a(t.question)) continue;
      expect(t.question.includes(t.correctAnswer), `correctAnswer v otázce: ${t.question}`).toBe(false);
    }
  });

  it("žádný text neobsahuje reálný kontakt (e-mail/telefon)", () => {
    for (const t of tasks) {
      const vse = [t.question, ...(t.options ?? []), t.explanation ?? "", ...(t.hints ?? [])].join(" ");
      expect(EMAIL_RE.test(vse), `e-mail v úloze: ${t.question}`).toBe(false);
      expect(PHONE_RE.test(vse), `telefon v úloze: ${t.question}`).toBe(false);
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč odpovídá nezávislému výpočtu", () => {
    for (const t of tasks) {
      // L1(a) — klasifikátor řádku
      if (jeL1a(t.question)) {
        const m = t.question.match(/Řádek „([^„“]+)“ je v (?:tomto )?dopise…$/);
        expect(m, t.question).not.toBeNull();
        const radek = m![1];
        expect(SOLVER_RADEK[radek], `neznámý řádek v tabulce: ${radek}`).toBeDefined();
        expect(t.correctAnswer, t.question).toBe(SOLVER_RADEK[radek]);
        continue;
      }
      // L1(b) oslovení
      if (t.question.startsWith("Jakým oslovením začneš dopis ")) {
        const m = t.question.match(/^Jakým oslovením začneš dopis (.+)\?$/);
        const adresat = m![1];
        expect(SOLVER_OSLOVENI[adresat], `neznámý adresát: ${adresat}`).toBeDefined();
        expect(t.correctAnswer).toBe(SOLVER_OSLOVENI[adresat]);
        // blízkost adresáta musí sedět s tím, jestli je klíč hovorové/rodinné oslovení
        const jeBlizky = BLIZCI_ADRESATI.has(adresat);
        expect(jeBlizky, `oslovení „${t.correctAnswer}“ pro adresáta ${adresat}`).toBe(
          ["Milá babičko,", "Ahoj Ondro,", "Ahoj Aničko,", "Milý dědečku,"].includes(t.correctAnswer),
        );
        continue;
      }
      // L1(b) pozdrav
      if (t.question.startsWith("Jaký pozdrav použiješ na konci dopisu ")) {
        const m = t.question.match(/^Jaký pozdrav použiješ na konci dopisu (.+)\?$/);
        const adresat = m![1].replace(/\.$/, "").trim();
        const key = adresat.includes("ředitelce") ? "paní ředitelce" : "babičce";
        expect(t.correctAnswer).toBe(SOLVER_POZDRAV[key]);
        continue;
      }
      // L2 — situace + formulace
      const l2key = Object.keys(SOLVER_L2).find((k) => t.question.startsWith(k));
      if (l2key) {
        const row = SOLVER_L2[l2key];
        expect(t.correctAnswer, t.question).toBe(row.spravna);
        continue;
      }
      // L3(a) — cizorodý řádek
      if (jeL3a(t.question)) {
        const druh = t.question.includes("úředního dopisu") ? "úředního" : "soukromého";
        const lines = radkyZOtazky(t.question);
        expect(lines.length, t.question).toBeGreaterThanOrEqual(4);
        expect(lines, `klíč není mezi řádky dopisu: ${t.question}`).toContain(t.correctAnswer);
        const bad = najdiCizorodyRadek(lines, druh);
        expect(bad, `klasifikátor nenašel právě 1 cizorodý řádek: ${t.question}`).not.toBeNull();
        expect(t.correctAnswer, t.question).toBe(bad);
        continue;
      }
      // L3(b) — co chybí
      if (jeL3b(t.question)) {
        const lines = radkyZOtazky(t.question);
        const stav = pritomneUdaje(lines);
        const chybejici = (Object.keys(stav) as (keyof typeof stav)[]).filter((k) => !stav[k]);
        expect(chybejici, `nezávislý detektor: ${t.question}`).toEqual([t.correctAnswer]);
        // distraktory musí být položky, které v dopise podle detektoru JSOU
        for (const opt of t.options!.filter((o) => o !== t.correctAnswer)) {
          expect(stav[opt as keyof typeof stav], `distraktor "${opt}" by podle detektoru neměl být přítomen: ${t.question}`).toBe(true);
        }
        continue;
      }
      // L3(c) — oprava: ověříme aspoň, že v dopise je přesně 1 rozpoznatelný cizorodý prvek
      // a že navržená oprava (klíč) není shodná s žádným původním řádkem dopisu.
      if (jeL3c(t.question)) {
        const lines = radkyZOtazky(t.question);
        expect(lines, `klíč (oprava) by neměl být shodný s originálním řádkem: ${t.question}`).not.toContain(t.correctAnswer);
        continue;
      }
      throw new Error(`solver nerozpoznal úlohu: ${t.question}`);
    }
  });
});

describe("Dopis soukromý a úřední — gradace a rozsah", () => {
  it("L1 a L3 otázky jsou textově disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });

  it("L1 a L2 otázky jsou textově disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l2 = topic.generator(2).map((t) => t.question);
    for (const q of l2) expect(l1.has(q), `L2 otázka se opakuje v L1: ${q}`).toBe(false);
  });

  it("L2 obsahuje aspoň 6 úředních a 4 soukromé situace", () => {
    const uredni = Object.values(SOLVER_L2).filter((r) => r.ureni).length;
    const soukrome = Object.values(SOLVER_L2).filter((r) => !r.ureni).length;
    expect(uredni).toBeGreaterThanOrEqual(6);
    expect(soukrome).toBeGreaterThanOrEqual(4);
  });

  it("L3 obsahuje všechny tři typy otázek (nepatří / chybí / oprava)", () => {
    const l3 = topic.generator(3);
    expect(l3.some((t) => jeL3a(t.question))).toBe(true);
    expect(l3.some((t) => jeL3b(t.question))).toBe(true);
    expect(l3.some((t) => jeL3c(t.question))).toBe(true);
  });

  it("banka L1 má aspoň 16 různých řádků/situací (12 řádků + 11 adresátů)", () => {
    expect(Object.keys(SOLVER_RADEK).length + Object.keys(SOLVER_OSLOVENI).length).toBeGreaterThanOrEqual(16);
  });

  it("banka L3 má aspoň 12 různých dopisů", () => {
    const l3 = topic.generator(3);
    const dopisy = new Set(l3.map((t) => radkyZOtazky(t.question).join("|")));
    expect(dopisy.size).toBeGreaterThanOrEqual(12);
  });
});
