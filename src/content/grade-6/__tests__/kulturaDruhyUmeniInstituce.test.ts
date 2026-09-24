import { describe, it, expect } from "vitest";
import { KULTURA_DRUHY_UMENI_INSTITUCE } from "../vko/kulturaDruhyUmeniInstituce";
import type { PracticeTask } from "@/lib/types";

/**
 * Kultura — druhy umění, kulturní instituce, masová kultura (VKO 6. ročník, select_one).
 *
 * NEZÁVISLÝ SOLVER (postavený samostatně na klíčových slovech/tabulkách, ne na
 * importu generátorových slovníků):
 *  • L1 — regex klasifikátor druhu umění (ČÍM vzniká) a instituce (K ČEMU slouží).
 *  • L2 — pět pevných šablon rozpoznaných podle charakteristické fráze → fixní klíč.
 *  • L3(a) masová kultura — binární pravidlo „šíří se hromadně médiem k velkému,
 *    neurčitému publiku najednou" nad KORREKTNÍ i DISTRAKTORNÍ možností zároveň.
 *  • L3(b) dvoukrokové — nezávisle přepsaná tabulka klíčová fráze → instituce.
 */
const topic = KULTURA_DRUHY_UMENI_INSTITUCE[0];

// ── (1) L1 nezávislé klasifikátory ──────────────────────────────────────

function classifyUmeni(text: string): string | null {
  if (/namaloval|vytesal|barvami|obrazy a sochy/i.test(text)) return "výtvarné umění";
  if (/melodii|zazpívala|nástroje|poslouchají/i.test(text)) return "hudební umění";
  if (/na jevišti|naživo|hraje naživo/i.test(text)) return "dramatické umění";
  if (/natočil|kamerou|nahraný film|na plátně v kině/i.test(text)) return "filmové umění";
  if (/napsal|spisovatel|báseň|psaný text/i.test(text)) return "literární umění";
  if (/tanečníci|pohybem těla|tancem|baletka/i.test(text)) return "taneční umění";
  return null;
}

function classifyInstituce(text: string): string | null {
  if (/originální obraz|obrazy a sochy|originální výtvarná díla/i.test(text)) return "galerie";
  if (/doklady o minulosti|přírodnin|historické předměty|staré předměty/i.test(text)) return "muzeum";
  if (/živ[íá] herci|živá představení|na jevišti|naživo/i.test(text)) return "divadlo";
  if (/na plátně|nahrané filmy|nový film/i.test(text)) return "kino";
  if (/půjčuje.*knih|vypůjčit.*knih|knihy a časopisy/i.test(text)) return "knihovna";
  return null;
}

// ── (2) L2 pevné šablony → fixní klíč (rozpoznané dle charakteristické fráze) ──

const L2_SIGNATURES: { frag: string; correct: string }[] = [
  { frag: "chtějí vidět originální obrazy a sochy slavných umělců", correct: "galerie" },
  { frag: "vidět nový film na velkém plátně se zvukem z reproduktorů", correct: "kino" },
  { frag: "vypůjčit dobrodružný román domů", correct: "knihovna" },
  { frag: "vidět staré nástroje, mince a kosti pravěkých zvířat", correct: "muzeum" },
  { frag: "sledovat herce, kteří hrají příběh naživo", correct: "divadlo" },
];

// ── (3) L3(a) masová kultura — binární pravidlo ŠÍŘENÍ MÉDIEM ─────────────

const MASA_SIGNAL = /televizní stanice|rozhlasová stanice|přes internet|na internetu|po celé zemi|po celém světě|po celé republice|statisíce|miliony|velkým nákladem/i;
const LOKALNI_SIGNAL = /jen doma|jen svým kamarád|jen rodičům|jen mezi sebou|jen parta|celá parta|celá třída|o přestávkách|na hřišti za školou|jen svým kamarádkám/i;

function isMasova(text: string): boolean | null {
  const masa = MASA_SIGNAL.test(text);
  const lokalni = LOKALNI_SIGNAL.test(text);
  if (masa === lokalni) return null; // nejednoznačné — solver to musí umět rozhodnout jednoznačně
  return masa;
}

// ── (4) L3(b) dvoukrokové — nezávisle přepsaná tabulka fráze → instituce ──

const L3B_SIGNATURES: { frag: string; instituce: string }[] = [
  { frag: "obrazy vytvořené barvami", instituce: "galerie" },
  { frag: "vytesané sochy z kamene", instituce: "galerie" },
  { frag: "originální obrazy a sochy, které vytvořili slavní umělci", instituce: "galerie" },
  { frag: "živí herci předvedou přímo na jevišti", instituce: "divadlo" },
  { frag: "naživo, bez natáčení, hrají divadelní hru", instituce: "divadlo" },
  { frag: "nahraný příběh promítaný na velkém plátně", instituce: "kino" },
  { frag: "natočil filmový štáb kamerou", instituce: "kino" },
  { frag: "psané příběhy s ději a postavami", instituce: "knihovna" },
  { frag: "čte psané texty stránku po stránce", instituce: "knihovna" },
];

interface SolveResult {
  kind: string;
}

function solve(t: PracticeTask): SolveResult | null {
  const q = t.question;

  // L1 — druh umění
  if (q.endsWith("O jaký druh umění jde?") || q.endsWith("Který druh umění to je?")) {
    const expected = classifyUmeni(q);
    expect(expected, `L1 umění: nerozpoznaná věta: ${q}`).not.toBeNull();
    expect(t.correctAnswer, `L1 umění klíč: ${q}`).toBe(expected);
    return { kind: "L1-umeni" };
  }

  // L1 — instituce
  if (q.endsWith("Do jaké instituce to patří?") || q.endsWith("Jak se taková instituce jmenuje?")) {
    const expected = classifyInstituce(q);
    expect(expected, `L1 instituce: nerozpoznaná věta: ${q}`).not.toBeNull();
    expect(t.correctAnswer, `L1 instituce klíč: ${q}`).toBe(expected);
    return { kind: "L1-instituce" };
  }

  // L2 — pět pevných dilemat
  const l2 = L2_SIGNATURES.find((s) => q.includes(s.frag));
  if (l2) {
    expect(t.correctAnswer, `L2 klíč: ${q}`).toBe(l2.correct);
    return { kind: "L2" };
  }

  // L3(a) — masová kultura
  if (q.includes("MASOVÉ KULTURY") || q.includes("MASOVOU KULTURU")) {
    const correctMasa = isMasova(t.correctAnswer);
    expect(correctMasa, `L3a: klíč nejednoznačný podle solveru: "${t.correctAnswer}"`).not.toBeNull();
    expect(correctMasa, `L3a: klíč NENÍ podle solveru masová kultura: "${t.correctAnswer}"`).toBe(true);
    for (const opt of t.options!.filter((o) => o !== t.correctAnswer)) {
      const r = isMasova(opt);
      expect(r, `L3a: distraktor nejednoznačný podle solveru: "${opt}"`).not.toBeNull();
      expect(r, `L3a: distraktor JE podle solveru masová kultura: "${opt}"`).toBe(false);
    }
    return { kind: "L3a" };
  }

  // L3(b) — dvoukrokové (druh umění → instituce)
  if (q.includes("Do jaké instituce je potřeba jít, aby se to dalo zažít?")) {
    const l3b = L3B_SIGNATURES.find((s) => q.includes(s.frag));
    expect(l3b, `L3b: neznámá věta: ${q}`).toBeTruthy();
    expect(t.correctAnswer, `L3b klíč: ${q}`).toBe(l3b!.instituce);
    return { kind: "L3b" };
  }

  return null;
}

describe("Kultura, druhy umění a instituce — metadata", () => {
  it("vko g6, select_one, Člověk ve společnosti / Lidská setkávání a kultura", () => {
    expect(topic.subject).toBe("vko");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-vko-kultura-druhy-umeni-instituce-6");
    expect(topic.category).toBe("Člověk ve společnosti");
    expect(topic.topic).toBe("Lidská setkávání a kultura");
    expect(topic.rvpNodeId).toBe(
      "g6-vko-clovek-ve-spolecnosti-lidska-setkavani-a-kultura-kultura-druhy-umeni-kulturni-instituce-masova-kultura",
    );
  });
});

describe.each([1, 2, 3])("Kultura, druhy umění a instituce — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const keys = new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}|${[...(t.options ?? [])].sort().join(",")}`));
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
      for (const key of Object.keys(t.optionFeedback ?? {})) {
        expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
        expect(key).not.toBe(t.correctAnswer);
      }
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
    }
  });

  it("nápověda: 2 unikátní, neprozrazují correctAnswer", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints ?? []) {
        if (t.correctAnswer.length >= 3) {
          expect(h, `hint leak (correctAnswer): ${t.question} :: "${h}"`).not.toContain(t.correctAnswer);
        }
      }
    }
  });

  it("každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("správná odpověď se nevyskytuje doslovně ve znění otázky", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), `klíč „${t.correctAnswer}“ je ve znění otázky: ${t.question}`).toBe(false);
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsiJeKlic = tasks.filter((t) => {
      const maxLen = Math.max(...t.options!.map((o) => o.length));
      return t.correctAnswer.length === maxLen;
    }).length;
    expect(nejdelsiJeKlic / tasks.length, "klíč = nejdelší možnost příliš často").toBeLessThan(0.8);
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s klasifikátorem/tabulkou", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
    }
  });
});

describe("Kultura, druhy umění a instituce — gradace a chybový model", () => {
  it("L1 a L3 otázky jsou textově disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });

  it("chybový model 1–3: muzeum↔galerie a knihovna↔muzeum se v distraktorech opravdu objevují", () => {
    const vseL1L2 = [...topic.generator(1), ...topic.generator(2)];
    const muzejniOtazky = vseL1L2.filter((t) => t.correctAnswer === "muzeum");
    expect(muzejniOtazky.some((t) => t.options!.includes("galerie")), "muzeum nikdy nemá galerii jako distraktor").toBe(true);
    const galerijniOtazky = vseL1L2.filter((t) => t.correctAnswer === "galerie");
    expect(galerijniOtazky.some((t) => t.options!.includes("muzeum")), "galerie nikdy nemá muzeum jako distraktor").toBe(true);
    const knihovniOtazky = vseL1L2.filter((t) => t.correctAnswer === "knihovna");
    expect(knihovniOtazky.some((t) => t.options!.includes("muzeum")), "knihovna nikdy nemá muzeum jako distraktor").toBe(true);
  });

  it("chybový model 2: dramatické↔filmové umění se v L1 distraktorech objevuje", () => {
    const l1 = topic.generator(1);
    const dram = l1.filter((t) => t.correctAnswer === "dramatické umění");
    if (dram.length > 0) {
      expect(dram.some((t) => t.options!.includes("filmové umění"))).toBe(true);
    }
    const film = l1.filter((t) => t.correctAnswer === "filmové umění");
    if (film.length > 0) {
      expect(film.some((t) => t.options!.includes("dramatické umění"))).toBe(true);
    }
  });

  it("L3: obsahuje masovou kulturu i dvoukrokové rozhodnutí", () => {
    const l3 = topic.generator(3);
    expect(l3.some((t) => t.question.includes("MASOVÉ KULTURY") || t.question.includes("MASOVOU KULTURU")), "chybí L3(a) masová kultura").toBe(true);
    expect(l3.some((t) => t.question.includes("Do jaké instituce je potřeba jít, aby se to dalo zažít?")), "chybí L3(b) dvoukrokové").toBe(true);
  });

  it("žádný hodnotový soud: nikde se nepíše, že nějaká kultura/instituce je lepší nebo horší", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {})];
        for (const s of texty) {
          expect(/lepší|horší|kvalitnější|hodnotnější/i.test(s), `hodnotový soud v: ${s}`).toBe(false);
        }
      }
    }
  });

  it("gen() je deterministický co do tvaru (žádná výjimka, vždy ≥12 úloh) při opakovaném volání", () => {
    for (const level of [1, 2, 3]) {
      const a = topic.generator(level);
      const b = topic.generator(level);
      expect(a.length).toBeGreaterThanOrEqual(12);
      expect(b.length).toBeGreaterThanOrEqual(12);
    }
  });
});
