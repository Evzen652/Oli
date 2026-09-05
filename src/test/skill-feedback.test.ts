import { describe, it, expect } from "vitest";
import {
  getRecommendations,
  getIntroSentence,
  FEEDBACK_LABELS,
  type SessionSummary,
} from "@/lib/skillFeedback";

/**
 * Chyba, kterou tyhle testy hlídají: modál s výsledky se otevírá rodiči
 * i dítěti, ale texty byly napsané jen pro rodiče. Dítě o sobě četlo ve třetí
 * osobě a dostávalo věty adresované někomu jinému („zkuste se zeptat",
 * „proberte s učitelem"). Není to překlep — je to špatné publikum, a to
 * typecheck ani render test nechytí.
 */

function session(pct: number, total = 10, helpUsed = 0, daysAgo = 0): SessionSummary {
  const correctAll = Math.round((pct / 100) * total);
  const d = new Date("2026-09-04T10:00:00Z");
  d.setDate(d.getDate() - daysAgo);
  return {
    sessionId: `s${daysAgo}-${pct}`,
    date: d.toISOString(),
    correct: Math.max(0, correctAll - helpUsed),
    helpUsed,
    wrong: total - correctAll,
    total,
    pct,
  };
}

/** Obraty, které patří jen rodičovskému textu — dítě je nesmí vidět nikdy. */
const RODICOVSKE_OBRATY = [
  "dítě",
  "dítěti",
  "dítěte",
  "zkuste",
  "doporučujeme",
  "motivujte",
  "učitel",
  "procvičujte",
  "sledujte",
  "proberte",
  "společně",
  "rodiče",
];

/** Sady vstupů napříč všemi větvemi — od jednoho cvičení po dlouhou historii. */
const SCENARE: { nazev: string; sessions: SessionSummary[] }[] = [
  { nazev: "jedno perfektní", sessions: [session(100, 6)] },
  { nazev: "jedno propadlé", sessions: [session(0, 6)] },
  { nazev: "jedno krátké průměrné", sessions: [session(60, 5)] },
  { nazev: "skok nahoru", sessions: [session(90), session(40, 10, 0, 1)] },
  { nazev: "propad dolů", sessions: [session(30), session(90, 10, 0, 1)] },
  { nazev: "hodně nápovědy", sessions: [session(80, 10, 6)] },
  { nazev: "bez nápovědy a výborně", sessions: [session(100, 12)] },
  { nazev: "tři slabé", sessions: [session(30), session(35, 10, 0, 1), session(25, 10, 0, 2)] },
  { nazev: "tři výborné", sessions: [session(95), session(90, 10, 0, 1), session(100, 10, 0, 2)] },
  {
    nazev: "dlouhá kolísavá historie",
    sessions: [session(100), session(20, 10, 0, 1), session(80, 10, 2, 2), session(45, 10, 1, 3), session(95, 10, 0, 4)],
  },
  { nazev: "velký objem slabě", sessions: Array.from({ length: 6 }, (_, i) => session(30, 12, 2, i)) },
];

describe("skillFeedback — oddělení publik", () => {
  it("dětská doporučení nikdy nepoužijí rodičovské obraty", () => {
    for (const { nazev, sessions } of SCENARE) {
      for (const grade of [1, 2, 3, 4, 5]) {
        const tips = getRecommendations(sessions, sessions[0].pct, grade, "child");
        const spojeno = tips.join(" ").toLowerCase();
        for (const obrat of RODICOVSKE_OBRATY) {
          expect(spojeno, `${nazev} / známka ${grade} → „${obrat}" v dětském textu`).not.toContain(obrat);
        }
      }
    }
  });

  // Kontrola samotného detektoru: kdyby se seznam obratů rozešel s texty,
  // předchozí test by procházel prázdnem a nulový nález by vypadal jako úspěch.
  // (Tohle už se v projektu jednou stalo u pravidla `name-in-word`.)
  it("rodičovské texty ty obraty naopak obsahují — jinak test nic nehlídá", () => {
    const vsechny = SCENARE
      .flatMap(({ sessions }) => [1, 2, 3, 4, 5].map(g => getRecommendations(sessions, sessions[0].pct, g, "parent")))
      .flat()
      .join(" ")
      .toLowerCase();
    const nalezene = RODICOVSKE_OBRATY.filter(o => vsechny.includes(o));
    expect(nalezene.length).toBeGreaterThanOrEqual(5);
  });

  it("dětská doporučení nemluví o dítěti ve třetí osobě", () => {
    for (const { sessions } of SCENARE) {
      for (const grade of [1, 2, 3, 4, 5]) {
        const spojeno = getRecommendations(sessions, sessions[0].pct, grade, "child").join(" ");
        // Druhá osoba: buď „jsi", nebo tvar na -š, nebo rozkazovací způsob.
        const rozkaz = /\b(zkus|projdi|mrkni|drž|podívej|začni|řekni|napiš)\b/i;
        expect(/\b(jsi|ti|tě|tvo)\b|š\b/i.test(spojeno) || rozkaz.test(spojeno)).toBe(true);
      }
    }
  });

  // Dítě dostane PRÁVĚ jednu větu, ne „nanejvýš". Dřív byly dvě a první
  // shrnovala výsledek, který stojí o dva bloky výš ve známce i v úvodní větě —
  // tentýž údaj byl na první obrazovce počtvrté.
  it("každé publikum dostane právě jednu radu", () => {
    for (const { nazev, sessions } of SCENARE) {
      for (const grade of [1, 2, 3, 4, 5]) {
        expect(getRecommendations(sessions, sessions[0].pct, grade, "child").length, nazev).toBe(1);
        expect(getRecommendations(sessions, sessions[0].pct, grade, "parent").length, nazev).toBe(1);
      }
    }
  });

  // Rada je pokyn, ne shrnutí. Procenta ani počty patří do známky nad ní.
  it("dětská rada neopakuje výsledek čísly", () => {
    for (const { nazev, sessions } of SCENARE) {
      for (const grade of [1, 2, 3, 4, 5]) {
        const veta = getRecommendations(sessions, sessions[0].pct, grade, "child")[0];
        expect(veta, `${nazev} / ${grade}`).not.toMatch(/\d+\s*%/);
      }
    }
  });

  it("obě publika vždy něco dostanou (žádná díra v pokrytí)", () => {
    for (const { nazev, sessions } of SCENARE) {
      for (const grade of [1, 2, 3, 4, 5]) {
        expect(getRecommendations(sessions, sessions[0].pct, grade, "child").length, `dítě / ${nazev} / ${grade}`).toBeGreaterThan(0);
        expect(getRecommendations(sessions, sessions[0].pct, grade, "parent").length, `rodič / ${nazev} / ${grade}`).toBeGreaterThan(0);
      }
    }
  });

  it("prázdná historie nevrací nic ani jednomu publiku", () => {
    expect(getRecommendations([], 0, 3, "child")).toEqual([]);
    expect(getRecommendations([], 0, 3, "parent")).toEqual([]);
  });
});

describe("skillFeedback — úvodní věta", () => {
  const last = session(100, 6);

  it("rodič vidí jméno dítěte a třetí osobu", () => {
    const veta = getIntroSentence("parent", last, 1, "Tonda");
    expect(veta).toContain("Tonda");
    expect(veta).toContain("procvičoval/a uvedené téma");
  });

  it("rodič bez jména dostane neosobní tvar, ne prázdné místo", () => {
    const veta = getIntroSentence("parent", last, 1);
    expect(veta).toContain("Procvičování ze dne");
    expect(veta).not.toContain("undefined");
  });

  it("dítě je oslovené ve druhé osobě a bez svého jména", () => {
    const veta = getIntroSentence("child", last, 1, "Tonda");
    expect(veta).not.toContain("Tonda");
    expect(veta).toContain("jsi");
  });

  it("dítě dostane u slabého výsledku rovnou informaci, ne diagnózu", () => {
    const veta = getIntroSentence("child", session(20, 10), 5, "Tonda");
    expect(veta.toLowerCase()).not.toContain("dítě");
    expect(veta).toContain("20 %");
  });

  it("počet otázek se skloňuje (1 otázka / 3 otázky / 6 otázek)", () => {
    expect(getIntroSentence("child", session(100, 1), 1)).toContain("1 otázka");
    expect(getIntroSentence("child", session(100, 3), 1)).toContain("3 otázky");
    expect(getIntroSentence("child", session(100, 6), 1)).toContain("6 otázek");
  });
});

describe("skillFeedback — popisky sekcí", () => {
  it("dítěti se neříká, co udělalo dítě", () => {
    expect(FEEDBACK_LABELS.child.answeredPrefix.toLowerCase()).not.toContain("dítě");
    expect(FEEDBACK_LABELS.parent.answeredPrefix).toContain("Dítě");
  });

  it("obě sady mají vyplněné všechny klíče", () => {
    for (const audience of ["parent", "child"] as const) {
      for (const [key, value] of Object.entries(FEEDBACK_LABELS[audience])) {
        expect(value, `${audience}.${key}`).toBeTruthy();
      }
    }
  });
});
