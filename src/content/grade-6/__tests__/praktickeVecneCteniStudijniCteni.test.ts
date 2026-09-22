import { describe, it, expect } from "vitest";
import { PRAKTICKE_VECNE_CTENI_STUDIJNI_CTENI } from "../cjl/praktickeVecneCteniStudijniCteni";
import type { PracticeTask } from "@/lib/types";

/**
 * Praktické a věcné čtení, studijní čtení — select_one, čtenářská gramotnost.
 * Kontroluje: strukturu, chybový model, absenci hint leaku, gradaci L1→L3
 * a NEZÁVISLÝM SOLVEREM (druhou cestou) numerickou/logickou správnost:
 *  • L1 — regulárním výrazem vyparsuje údaje ze samotné ukázky (den→čas nebo
 *    skupina→cena) a ověří, že klíč odpovídá dotazované položce.
 *  • L2 — klasifikátor: klíč (hlavní myšlenka / klíčová slova) musí mít
 *    slovní oporu (stem-shodu) v textu; aspoň jeden distraktor ji nemá.
 *  • L3 (jízdní řád) — parsuje čas víkendového spoje a dobu jízdy, sám
 *    spočítá příjezd a porovná s limitem — musí sedět s klíčem.
 *  • L3 (pravidlo) — u číselných hranic (věk, výška) přepočítá, jestli
 *    osoba podmínku splňuje.
 *  • L3 (fakt × názor) — klíč nesmí obsahovat hodnoticí výraz, všechny tři
 *    distraktory musí.
 *  • L3 (porovnání cen) — vyparsuje obě ceny a počet, sám spočítá úsporu
 *    a ověří, že klíč jmenuje levnější možnost a správný rozdíl.
 */
const topic = PRAKTICKE_VECNE_CTENI_STUDIJNI_CTENI[0];

// ── obecné invarianty ───────────────────────────────────────────────────

describe("Praktické a věcné čtení — metadata", () => {
  it("čeština g6, select_one, Komunikační a slohová výchova", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-prakticke-a-vecne-cteni-studijni-cteni-6");
    expect(topic.category).toBe("Komunikační a slohová výchova");
    expect(topic.topic).toBe("Čtení a naslouchání");
  });
});

describe.each([1, 2, 3])("Praktické a věcné čtení — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const uniq = new Set(tasks.map((t) => t.question));
    expect(uniq.size).toBeGreaterThanOrEqual(12);
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

  it("nápověda neprozrazuje výsledek", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        if (t.correctAnswer.length >= 3) {
          expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
        }
      }
    }
  });

  it("každá úloha má vysvětlení, otázka začíná citací textu", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.question.startsWith("Text: „")).toBe(true);
    }
  });
});

describe("Praktické a věcné čtení — gradace L1 ≠ L2 ≠ L3", () => {
  it("otázky L1/L2/L3 jsou zněním navzájem disjunktní", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    const l2 = topic.generator(2).map((t) => t.question);
    const l3 = topic.generator(3).map((t) => t.question);
    // L1: přímý dotaz "Kdy má … otevřeno" / "Kolik zaplatí"
    expect(l1.every((q) => /Kdy má .+ otevřeno|Kolik zaplatí/.test(q))).toBe(true);
    expect(l2.some((q) => /Kdy má .+ otevřeno|Kolik zaplatí/.test(q))).toBe(false);
    expect(l3.some((q) => /Kdy má .+ otevřeno|Kolik zaplatí/.test(q))).toBe(false);
    // L2: tři rotující šablony studijního čtení
    expect(l2.every((q) => /hlavní myšlenku|klíčových slov|Který nadpis/.test(q))).toBe(true);
    expect(l1.some((q) => /hlavní myšlenku|klíčových slov|Který nadpis/.test(q))).toBe(false);
    // L3: analytické otázky, nikdy shodné se vzorem L1
    expect(l3.every((q) => /Jak to dopadne\?|Smí .+\?|Zaplatí .+\?|ověřitelný fakt|NELZE vyvodit|další krok\?|výhodnější\?/.test(q))).toBe(true);
    expect(l1.every((q) => !/Jak to dopadne\?|NELZE vyvodit/.test(q))).toBe(true);
  });
});

// ── L1 — nezávislý solver: regex nad samotnou ukázkou ───────────────────

function parseComprehension(q: string): { text: string; otazka: string } {
  const m = q.match(/^Text: „(.+)“ (.+)$/s);
  if (!m) throw new Error(`nejde rozparsovat: ${q}`);
  return { text: m[1], otazka: m[2] };
}

const NOM_TO_ACC: Record<string, string> = {
  "děti do 6 let": "děti do 6 let",
  "žáci": "žáky",
  "dospělí": "dospělé",
  "senioři": "seniory",
};

/** Den z otázky („v úterý a ve čtvrtek“) → řádek rozpisu („Úterý a čtvrtek“). */
const DEN_TO_RADEK: Record<string, string> = {
  "v pondělí": "pondělí", "v úterý": "úterý", "ve středu": "středa", "ve čtvrtek": "čtvrtek",
  "v pátek": "pátek", "v sobotu": "sobota", "o víkendu": "sobota a neděle",
};
function radekProDen(den: string): string | null {
  const casti = den.split(" a ").map((c) => DEN_TO_RADEK[c]);
  if (casti.some((c) => !c)) return null;
  const r = casti.join(" a ");
  return r[0].toUpperCase() + r.slice(1);
}

function solveL1(t: PracticeTask): string | null {
  const { text, otazka } = parseComprehension(t.question);
  let m = otazka.match(/^Kdy má .+? otevřeno (.+)\?$/);
  if (m) {
    const radek = radekProDen(m[1]);
    if (!radek) return null;
    const re = /(?:^|\. )([^.:]+): od (\d{1,2}) do (\d{1,2}) hodin/g;
    let mm: RegExpExecArray | null;
    while ((mm = re.exec(text))) {
      if (mm[1] === radek) return `od ${mm[2]} do ${mm[3]} hodin`;
    }
    return null;
  }
  m = otazka.match(/^Kolik zaplatí (.+?) za vstup\?$/);
  if (m) {
    const nom = m[1];
    const acc = NOM_TO_ACC[nom];
    if (!acc) return null;
    const re = new RegExp(`pro ${acc} (\\d+) Kč`);
    const mm = text.match(re);
    return mm ? `${mm[1]} Kč` : null;
  }
  return null;
}

describe("L1 — DETERMINISTICKÝ SOLVER (parsuje ukázku, ne generátor)", () => {
  const tasks = topic.generator(1);
  it("klíč souhlasí s údajem vyparsovaným z textu", () => {
    for (const t of tasks) {
      const expected = solveL1(t);
      expect(expected, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
      expect(t.correctAnswer, t.question).toBe(expected);
    }
  });
  it("každý distraktor je reálná hodnota ze stejné ukázky, jen u jiné položky", () => {
    for (const t of tasks) {
      const { text } = parseComprehension(t.question);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        // hodnota (čas nebo cena) se musí v textu doslova vyskytovat
        expect(text.includes(d), `distraktor "${d}" není v textu: ${t.question}`).toBe(true);
      }
    }
  });
});

// ── L2 — klasifikátor: klíč musí mít oporu v textu, distraktor ne vždy ──

function contentWords(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[„“.,!?;:]/g, "")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
}
const stem = (w: string) => w.slice(0, Math.min(4, w.length));
function overlapCount(text: string, s: string): number {
  const low = text.toLowerCase();
  return contentWords(s).filter((w) => low.includes(stem(w))).length;
}

describe("L2 — KLASIFIKÁTOR (stem-shoda s textem, ne se zdrojovým kódem)", () => {
  const tasks = topic.generator(2);

  it("hlavní myšlenka: klíč má ≥2 slova s oporou v textu; aspoň 1 distraktor 0 slov", () => {
    for (const t of tasks.filter((t) => /hlavní myšlenku/.test(t.question))) {
      const { text } = parseComprehension(t.question);
      expect(overlapCount(text, t.correctAnswer), t.question).toBeGreaterThanOrEqual(2);
      const distractors = t.options!.filter((o) => o !== t.correctAnswer);
      expect(distractors.some((d) => overlapCount(text, d) === 0), t.question).toBe(true);
    }
  });

  it("klíčová slova: všechna 3 slova klíče mají oporu v textu; aspoň 1 distraktor ne", () => {
    for (const t of tasks.filter((t) => /klíčových slov/.test(t.question))) {
      const { text } = parseComprehension(t.question);
      const low = text.toLowerCase();
      const slova = t.correctAnswer.split(", ");
      expect(slova.length, t.question).toBe(3);
      for (const s of slova) {
        expect(low.includes(stem(s.toLowerCase())), `"${s}" chybí v textu: ${t.question}`).toBe(true);
      }
      const distractors = t.options!.filter((o) => o !== t.correctAnswer);
      // Distraktory jsou blízké chyby (podrobnosti, neúplná trojice), takže
      // oporu v textu mít smějí; aspoň jeden (příliš obecný) ji ale nemá celý.
      const bezOpory = distractors.some((d) =>
        d.split(", ").some((s) => !low.includes(stem(s.toLowerCase()))),
      );
      expect(bezOpory, t.question).toBe(true);
    }
  });

  it("nadpis: klíč má aspoň 1 slovo s oporou v textu", () => {
    for (const t of tasks.filter((t) => /Který nadpis/.test(t.question))) {
      const { text } = parseComprehension(t.question);
      expect(overlapCount(text, t.correctAnswer), t.question).toBeGreaterThanOrEqual(1);
    }
  });
});

// ── L3(a) jízdní řád — nezávislý solver: přepočítá čas příjezdu ─────────

function toMin(h: string, m: string): number {
  return +h * 60 + +m;
}
function fmt(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

function solveJizdniRad(t: PracticeTask): string | null {
  const { text, otazka } = parseComprehension(t.question);
  const dep = text.match(/o víkendu jede jen spoj v (\d{1,2}):(\d{2})/);
  const doba = text.match(/trvá (\d+) minut/);
  const limit = otazka.match(/v (\d{1,2}):(\d{2})\.\s*Jak to dopadne\?$/);
  if (!dep || !doba || !limit) return null;
  const prijezd = toMin(dep[1], dep[2]) + +doba[1];
  const limitMin = toMin(limit[1], limit[2]);
  const cas = fmt(prijezd);
  return prijezd <= limitMin ? `Stihne to, přijede v ${cas}.` : `Nestihne to, přijede až v ${cas}.`;
}

describe("L3(a) jízdní řád — DETERMINISTICKÝ SOLVER (sečte čas, porovná s limitem)", () => {
  const tasks = topic.generator(3).filter((t) => /Jak to dopadne\?/.test(t.question));
  it("neprázdná množina úloh (jízdní řád je v L3 bance)", () => {
    expect(tasks.length).toBeGreaterThan(0);
  });
  it("klíč souhlasí s nezávisle spočítaným příjezdem", () => {
    for (const t of tasks) {
      const expected = solveJizdniRad(t);
      expect(expected, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
      expect(t.correctAnswer, t.question).toBe(expected);
    }
  });
});

// ── L3(b) pravidlo s podmínkou — číselné hranice přepočítány ────────────

describe("L3(b) pravidlo s podmínkou — DETERMINISTICKÝ SOLVER (číselné hranice)", () => {
  const tasks = topic.generator(3).filter((t) => /(Smí|Zaplatí) .+\?$/.test(parseComprehension(t.question).otazka));
  it("neprázdná množina úloh (pravidlo je v L3 bance)", () => {
    expect(tasks.length).toBeGreaterThan(0);
  });
  it("věková/výšková hranice odpovídá klíči (Ano = splňuje, Ne = nesplňuje)", () => {
    for (const t of tasks) {
      const { text } = parseComprehension(t.question);
      let m = text.match(/mladší (\d+) let/);
      if (m) {
        const limit = +m[1];
        const osoba = t.question.match(/je (\d+) let/);
        if (osoba) {
          const smi = +osoba[1] >= limit;
          expect(t.correctAnswer.startsWith(smi ? "Ano" : "Ne"), t.question).toBe(true);
        }
        continue;
      }
      m = text.match(/menší než (\d+) centimetrů/);
      if (m) {
        const limit = +m[1];
        const osoba = t.question.match(/měří (\d+) centimetrů/);
        if (osoba) {
          const smi = +osoba[1] >= limit;
          expect(t.correctAnswer.startsWith(smi ? "Ano" : "Ne"), t.question).toBe(true);
        }
      }
    }
  });
});

// ── L3(c) fakt × název — klasifikátor hodnoticích výrazů ────────────────

const EVAL_MARKERS = [
  "myslím", "myslí", "podle mě", "podle žáků", "nejkrásnější", "nejhezčí", "nejlepší",
  "úžasný", "dokonalá", "zbytečně", "otřesné", "prý", "považují", "příjemnější",
  "chytrý", "stěžovali", "líného", "líný",
];
const hasMarker = (s: string) => EVAL_MARKERS.some((m) => s.includes(m));

describe("L3(c) fakt × názor — DETERMINISTICKÝ KLASIFIKÁTOR", () => {
  const tasks = topic.generator(3).filter((t) => /ověřitelný fakt/.test(t.question));
  it("neprázdná množina úloh (fakt × názor je v L3 bance)", () => {
    expect(tasks.length).toBeGreaterThan(0);
  });
  it("klíč neobsahuje hodnoticí výraz, všechny distraktory ano", () => {
    for (const t of tasks) {
      expect(hasMarker(t.correctAnswer), `klíč obsahuje hodnoticí výraz: ${t.correctAnswer}`).toBe(false);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(hasMarker(d), `distraktor bez hodnoticího výrazu: "${d}" v ${t.question}`).toBe(true);
      }
    }
  });
});

// ── L3(d) co NELZE vyvodit — smoke test (obsahová banka, ne výpočet) ────

describe("L3(d) co z textu NELZE vyvodit", () => {
  const tasks = topic.generator(3).filter((t) => /NELZE vyvodit/.test(t.question));
  it("neprázdná množina úloh (co-nelze-vyvodit je v L3 bance)", () => {
    expect(tasks.length).toBeGreaterThan(0);
  });
  it("klíč se v textu doslova nevyskytuje (na rozdíl od distraktorů)", () => {
    for (const t of tasks) {
      const { text } = parseComprehension(t.question);
      expect(text.includes(t.correctAnswer), `klíč je doslova v textu: ${t.question}`).toBe(false);
    }
  });
});

// ── L3(f) porovnání cen — nezávislý solver: přepočet na stejný počet ────

describe("L3(f) porovnání cen — DETERMINISTICKÝ SOLVER", () => {
  const tasks = topic.generator(3).filter((t) => /výhodnější\?$/.test(t.question));
  const BALIK = /^(Permanentka|Balení|Týdenní|Akce)/;
  it("neprázdná množina úloh (porovnání cen je v L3 bance)", () => {
    expect(tasks.length).toBeGreaterThan(0);
  });
  it("klíč jmenuje levnější možnost a správnou úsporu", () => {
    for (const t of tasks) {
      const { text, otazka } = parseComprehension(t.question);
      const ceny = [...text.matchAll(/(\d+) Kč/g)].map((m) => +m[1]);
      expect(ceny.length, t.question).toBe(2);
      const balik = Math.max(...ceny);
      const kus = Math.min(...ceny);
      const nm = otazka.match(/(\d+)krát|potřebuje (\d+)|^(Dva) /);
      expect(nm, t.question).not.toBeNull();
      const n = nm![3] ? 2 : +(nm![1] ?? nm![2]);
      const jednotlive = n * kus;
      const uspora = Math.abs(jednotlive - balik);
      expect(t.correctAnswer, t.question).toContain(`ušetří ${uspora} Kč`);
      expect(BALIK.test(t.correctAnswer), t.question).toBe(balik < jednotlive);
    }
  });
});
