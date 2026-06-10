import { describe, it, expect } from "vitest";
import { validateTaskForInputType } from "@/lib/taskValidator";
import { runOfflineAudit, runPedagogicalAudit } from "@/lib/contentAudit";
import type { TopicMetadata, PracticeTask } from "@/lib/types";

// ─── helpers ───────────────────────────────────────────────────────────────

function makeTopic(overrides: Partial<TopicMetadata> & { generator: TopicMetadata["generator"] }): TopicMetadata {
  return {
    id: "test-topic",
    title: "Test",
    subject: "matematika",
    category: "Test",
    topic: "Test",
    briefDescription: "Test",
    keywords: [],
    goals: [],
    boundaries: [],
    gradeRange: [3, 3],
    inputType: "select_one",
    helpTemplate: { hint: "", steps: [], commonMistake: "", example: "" },
    ...overrides,
  };
}

function task(q: string, ca: string, extra: Partial<PracticeTask> = {}): PracticeTask {
  return { question: q, correctAnswer: ca, ...extra };
}

// ─── validateTaskForInputType — select_one ─────────────────────────────────

describe("validateTaskForInputType — select_one nové checky", () => {
  it("max 6 options: 4 možnosti → valid", () => {
    expect(validateTaskForInputType(
      task("Co je hlavní město?", "Praha", { options: ["Praha", "Brno", "Plzeň", "Olomouc"] }),
      "select_one"
    )).toBe(true);
  });

  it("max 6 options: 7 možností → invalid", () => {
    expect(validateTaskForInputType(
      task("Co je hlavní město?", "Praha", { options: ["Praha", "Brno", "Plzeň", "Olomouc", "Liberec", "Pardubice", "Zlín"] }),
      "select_one"
    )).toBe(false);
  });

  it("phrase check: distractor je celá fráze uvnitř correctAnswer → invalid", () => {
    // "Praha" je na hranici slov uvnitř "stará Praha" → ambiguita
    expect(validateTaskForInputType(
      task("Hlavní město ČR?", "stará Praha", { options: ["stará Praha", "Praha", "Brno", "Plzeň"] }),
      "select_one"
    )).toBe(false);
  });

  it("phrase check: prefix uvnitř slova → valid (umělecký/neumělecký, přímá/nepřímá)", () => {
    // "umělecký" je substring "neumělecký", ale uvnitř slova → legitimní distraktor
    expect(validateTaskForInputType(
      task("Jaký je to text?", "umělecký", { options: ["umělecký", "neumělecký", "odborný", "publicistický"] }),
      "select_one"
    )).toBe(true);
    expect(validateTaskForInputType(
      task("Jaká je to řeč?", "přímá řeč", { options: ["přímá řeč", "nepřímá řeč", "monolog", "dialog"] }),
      "select_one"
    )).toBe(true);
  });

  it("phrase check: numerické/jednotkové odpovědi se nekontrolují (8 cm vs 8 cm²)", () => {
    expect(validateTaskForInputType(
      task("Jaký je obvod?", "8 cm", { options: ["8 cm", "8 cm²", "16 cm", "4 cm"] }),
      "select_one"
    )).toBe(true);
    expect(validateTaskForInputType(
      task("Jaká je teplota?", "5 °C", { options: ["5 °C", "−5 °C", "15 °C", "0 °C"] }),
      "select_one"
    )).toBe(true);
  });

  it("substring check: correctAnswer je substring distractoru → invalid", () => {
    // "Praha" je substring "Praha je krásná"
    expect(validateTaskForInputType(
      task("Hlavní město ČR?", "Praha", { options: ["Praha", "Praha je krásná", "Brno", "Plzeň"] }),
      "select_one"
    )).toBe(false);
  });

  it("substring check: slova > 3 znaky bez vztahu → valid", () => {
    expect(validateTaskForInputType(
      task("Hlavní město ČR?", "Praha", { options: ["Praha", "Brno", "Plzeň", "Liberec"] }),
      "select_one"
    )).toBe(true);
  });

  it("substring check: krátká slova (≤ 3 znaky) nejsou kontrolována", () => {
    // "ano" je substring "ano, tak" ale délka ≤ 3 → skip
    expect(validateTaskForInputType(
      task("Je to pravda?", "ano", { options: ["ano", "ne", "asi", "snad"] }),
      "select_one"
    )).toBe(true);
  });
});

// ─── validateTaskForInputType — match_pairs ────────────────────────────────

describe("validateTaskForInputType — match_pairs nové checky", () => {
  const pairs3 = [
    { left: "pes", right: "štěká" },
    { left: "kočka", right: "mňouká" },
    { left: "kráva", right: "bučí" },
  ];

  it("min 3 páry: 3 páry → valid", () => {
    expect(validateTaskForInputType(
      task("Spoj zvíře se zvukem", "x", { pairs: pairs3 }),
      "match_pairs"
    )).toBe(true);
  });

  it("min 3 páry: 2 páry → invalid", () => {
    expect(validateTaskForInputType(
      task("Spoj", "x", { pairs: pairs3.slice(0, 2) }),
      "match_pairs"
    )).toBe(false);
  });

  it("max 8 párů: 9 párů → invalid", () => {
    const bigPairs = Array.from({ length: 9 }, (_, i) => ({ left: `L${i}`, right: `R${i}` }));
    expect(validateTaskForInputType(
      task("Spoj", "x", { pairs: bigPairs }),
      "match_pairs"
    )).toBe(false);
  });

  it("max 8 párů: 8 párů → valid", () => {
    const bigPairs = Array.from({ length: 8 }, (_, i) => ({ left: `L${i}`, right: `R${i}` }));
    expect(validateTaskForInputType(
      task("Spoj", "x", { pairs: bigPairs }),
      "match_pairs"
    )).toBe(true);
  });

  it("duplicita v levém sloupci → invalid", () => {
    expect(validateTaskForInputType(
      task("Spoj", "x", { pairs: [
        { left: "pes", right: "štěká" },
        { left: "pes", right: "mňouká" },
        { left: "kráva", right: "bučí" },
      ]}),
      "match_pairs"
    )).toBe(false);
  });

  it("duplicita v pravém sloupci → invalid", () => {
    expect(validateTaskForInputType(
      task("Spoj", "x", { pairs: [
        { left: "pes", right: "štěká" },
        { left: "kočka", right: "štěká" },
        { left: "kráva", right: "bučí" },
      ]}),
      "match_pairs"
    )).toBe(false);
  });
});

// ─── runOfflineAudit — essay hints ────────────────────────────────────────

describe("runOfflineAudit — essay missing hints", () => {
  it("essay bez hints → format issue", () => {
    const topic = makeTopic({
      inputType: "essay",
      generator: () => [task("Napiš příběh o psovi.", "60")],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.some(i => i.category === "format" && i.detail.includes("hints"))).toBe(true);
  });

  it("essay s hints → žádný issue pro hints", () => {
    const topic = makeTopic({
      inputType: "essay",
      generator: () => [task("Napiš příběh o psovi.", "60", { hints: ["Piš o tom co psi dělají", "Zkus popsat psa a jeho den včetně toho co jí a kde spí"] })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.filter(i => i.category === "format" && i.detail.includes("hints"))).toHaveLength(0);
  });
});

// ─── runOfflineAudit — duplicitní options ──────────────────────────────────

describe("runOfflineAudit — duplicitní options", () => {
  it("options s duplicitou → format issue", () => {
    const topic = makeTopic({
      generator: () => [task("Doplň: b_k", "býk", { options: ["býk", "bik", "byk", "bik"] })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.some(i => i.category === "format" && i.detail.includes("Duplicitní"))).toBe(true);
  });

  it("unikátní options → žádný issue", () => {
    const topic = makeTopic({
      generator: () => [task("Doplň: b_k", "býk", { options: ["býk", "bík", "byk", "bik"] })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.filter(i => i.detail.includes("Duplicitní"))).toHaveLength(0);
  });
});

// ─── runOfflineAudit — giveaway option ─────────────────────────────────────

describe("runOfflineAudit — giveaway option", () => {
  it("správná možnost s meta-textem ('— X nepatří') → format issue", () => {
    const topic = makeTopic({
      generator: () => [task("Které slovo NEPATŘÍ k 'voda'?", "vodník, vodopád, vodit — VODIT nepatří", {
        options: ["vodník, vodopád, vodit — VODIT nepatří", "vodník", "vodopád", "vodní"],
      })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.some(i => i.category === "format" && i.detail.includes("meta-text"))).toBe(true);
  });

  it("správná možnost ≥ 2× delší než všechny distraktory → format issue", () => {
    const topic = makeTopic({
      generator: () => [task("Co je dialog?", "Rozhovor mezi dvěma nebo více lidmi, kteří si odpovídají", {
        options: ["Rozhovor mezi dvěma nebo více lidmi, kteří si odpovídají", "Dopis", "Báseň", "Monolog"],
      })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.some(i => i.category === "format" && i.detail.includes("delší"))).toBe(true);
  });

  it("vyvážené délky options → žádný giveaway issue", () => {
    const topic = makeTopic({
      generator: () => [task("Hlavní město ČR?", "Praha", { options: ["Praha", "Brno", "Plzeň", "Ostrava"] })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.filter(i => i.detail.includes("prozrazuje se") || i.detail.includes("meta-text"))).toHaveLength(0);
  });
});

// ─── runOfflineAudit — sémantický leak u porovnávání ───────────────────────

describe("runOfflineAudit — porovnávací hint leak", () => {
  it("hint '31 je menší než 60' u odpovědi '<' → hint_leak", () => {
    const topic = makeTopic({
      generator: () => [task("Porovnej: 31 vs 60", "<", {
        options: ["<", ">", "="],
        hints: ["31 je menší než 60.", "Porovnej stovky, pak desítky."],
      })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.some(i => i.category === "hint_leak" && i.detail.includes("porovnání"))).toBe(true);
  });

  it("metodický hint bez čísel ('kdo má více, je větší') → žádný leak", () => {
    const topic = makeTopic({
      generator: () => [task("Porovnej: 31 vs 60", "<", {
        options: ["<", ">", "="],
        hints: ["Kolik stovek má každé číslo?", "Porovnej stovky — kdo má více, je větší."],
      })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.filter(i => i.detail.includes("porovnání"))).toHaveLength(0);
  });
});

// ─── runOfflineAudit — step_based ─────────────────────────────────────────

describe("runOfflineAudit — step_based checky", () => {
  it("step_based s 1 krokem → format issue", () => {
    const topic = makeTopic({
      inputType: "number",
      practiceType: "step_based",
      generator: () => [task("Spočítej 3+4", "7", { solutionSteps: ["Sečti čísla"] })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.some(i => i.category === "format" && i.detail.includes("kroků"))).toBe(true);
  });

  it("step_based se 2 kroky → žádný format issue pro kroky", () => {
    const topic = makeTopic({
      inputType: "number",
      practiceType: "step_based",
      generator: () => [task("Spočítej 3+4", "7", {
        solutionSteps: ["Zapíšeme příklad 3+4", "Sečteme: 3+4 = výsledek"],
      })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.filter(i => i.category === "format" && i.detail.includes("kroků"))).toHaveLength(0);
  });

  it("step_based kde krok obsahuje correctAnswer → hint_leak", () => {
    const topic = makeTopic({
      inputType: "number",
      practiceType: "step_based",
      generator: () => [task("Spočítej 3+4", "7", {
        solutionSteps: ["Sečteme 3+4", "Výsledek je 7, tedy správná odpověď"],
      })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.some(i => i.category === "hint_leak" && i.detail.includes("solutionStep"))).toBe(true);
  });

  it("step_based kde kroky neobsahují correctAnswer → žádný hint_leak", () => {
    const topic = makeTopic({
      inputType: "number",
      practiceType: "step_based",
      generator: () => [task("Spočítej 3+4", "7", {
        solutionSteps: ["Zapíšeme příklad", "Sečteme obě čísla dohromady"],
      })],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.filter(i => i.category === "hint_leak" && i.detail.includes("solutionStep"))).toHaveLength(0);
  });
});

// ─── runOfflineAudit — text answer checks ────────────────────────────────

describe("runOfflineAudit — text odpovědi", () => {
  it("text + grade 3 + odpověď > 5 slov → format issue", () => {
    const topic = makeTopic({
      subject: "čeština",
      inputType: "text",
      gradeRange: [3, 3],
      generator: () => [task("Kdo je hrdina příběhu?", "Hlavní hrdina příběhu je malý chrabrý chlapec Honzík")],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.some(i => i.category === "format" && i.detail.includes("slov"))).toBe(true);
  });

  it("text + grade 3 + odpověď ≤ 5 slov → žádný issue", () => {
    const topic = makeTopic({
      subject: "čeština",
      inputType: "text",
      gradeRange: [3, 3],
      generator: () => [task("Kdo je hrdina příběhu?", "Malý chlapec Honzík")],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.filter(i => i.category === "format" && i.detail.includes("slov"))).toHaveLength(0);
  });

  it("matematika + short_answer + nečíselná odpověď → format issue", () => {
    const topic = makeTopic({
      subject: "matematika",
      inputType: "short_answer",
      generator: () => [task("Kolik je 3+4?", "sedm")],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.some(i => i.category === "format" && i.detail.includes("číslo"))).toBe(true);
  });

  it("matematika + short_answer + číselná odpověď → žádný issue", () => {
    const topic = makeTopic({
      subject: "matematika",
      inputType: "short_answer",
      generator: () => [task("Kolik je 3+4?", "7")],
    });
    const report = runOfflineAudit([topic]);
    expect(report.issues.filter(i => i.category === "format" && i.detail.includes("číslo"))).toHaveLength(0);
  });
});

// ─── runPedagogicalAudit — nové pedagogické checky ───────────────────────

function makeGenFromTasks(lvl1: PracticeTask[], lvl2?: PracticeTask[], lvl3?: PracticeTask[]) {
  return (level: number) => {
    if (level === 1) return lvl1;
    if (level === 2) return lvl2 ?? lvl1;
    return lvl3 ?? lvl1;
  };
}

describe("runPedagogicalAudit — czech_register", () => {
  it("otázka se slovem 'určete' → czech_register issue", () => {
    const topic = makeTopic({
      generator: makeGenFromTasks(
        [task("Určete výsledek příkladu 5 + 3.", "8", { hints: ["hint1 základní", "hint2 podrobnější nápověda"] })],
      ),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.some(i => i.category === "czech_register")).toBe(true);
  });

  it("otázka bez formálních slov → žádný czech_register issue", () => {
    const topic = makeTopic({
      generator: makeGenFromTasks(
        [task("Kolik je 5 + 3?", "8", { hints: ["hint1 základní", "hint2 podrobnější nápověda"] })],
      ),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.filter(i => i.category === "czech_register")).toHaveLength(0);
  });
});

describe("runPedagogicalAudit — sentence_complexity", () => {
  it("grade 3 + otázka s 20 slovy → sentence_complexity issue", () => {
    // 19 slov — nad limitem 18 pro grade 3–4
    const longQ = "Když se pozorně podíváš na tabulku a pečlivě sečteš všechna čísla v prvním sloupci tabulky, kolik bude výsledek celého tohoto součtu?";
    const topic = makeTopic({
      gradeRange: [3, 3],
      generator: makeGenFromTasks([task(longQ, "42")]),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.some(i => i.category === "sentence_complexity")).toBe(true);
  });

  it("grade 3 + otázka s 10 slovy → žádný issue", () => {
    const topic = makeTopic({
      gradeRange: [3, 3],
      generator: makeGenFromTasks([task("Kolik je tři plus čtyři dohromady celkem?", "7")]),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.filter(i => i.category === "sentence_complexity")).toHaveLength(0);
  });
});

describe("runPedagogicalAudit — answer_uniqueness", () => {
  it("5 tasků v level 1 se stejnou odpovědí → answer_uniqueness issue", () => {
    const lvl1 = Array.from({ length: 5 }, () => task("Kolik je 2+2?", "4"));
    const topic = makeTopic({
      inputType: "number",
      generator: makeGenFromTasks(lvl1),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.some(i => i.category === "answer_uniqueness")).toBe(true);
  });

  it("5 tasků v level 1 s různými odpověďmi → žádný issue", () => {
    const lvl1 = ["4", "6", "8", "10", "12"].map((ca, i) => task(`Kolik je ${i * 2}+2?`, ca));
    const topic = makeTopic({
      inputType: "number",
      generator: makeGenFromTasks(lvl1),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.filter(i => i.category === "answer_uniqueness")).toHaveLength(0);
  });

  it("true_false s 5 stejnými odpověďmi → žádný answer_uniqueness issue (legitimní)", () => {
    const lvl1 = Array.from({ length: 5 }, () => task("Je 2+2=4?", "pravda", { options: ["pravda", "nepravda"] }));
    const topic = makeTopic({
      inputType: "true_false",
      generator: makeGenFromTasks(lvl1),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.filter(i => i.category === "answer_uniqueness")).toHaveLength(0);
  });
});

describe("runPedagogicalAudit — difficulty_delta", () => {
  it("short_answer kde level 3 má kratší odpovědi než level 1 → difficulty_delta issue", () => {
    const lvl1 = Array.from({ length: 3 }, () =>
      task("Popiš rozdíl", "Velmi dlouhá podrobná odpověď pro úroveň jedna s mnoha slovy"));
    const lvl3 = Array.from({ length: 3 }, () =>
      task("Popiš rozdíl obtížněji", "Stručně"));
    const topic = makeTopic({
      inputType: "short_answer",
      generator: makeGenFromTasks(lvl1, lvl1, lvl3),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.some(i => i.category === "difficulty_delta")).toBe(true);
  });

  it("short_answer kde level 3 má delší odpovědi než level 1 → žádný issue", () => {
    const lvl1 = Array.from({ length: 3 }, () => task("Popiš", "Krátká odpověď"));
    const lvl3 = Array.from({ length: 3 }, () =>
      task("Popiš podrobně", "Velmi podrobná a dlouhá odpověď pro pokročilou obtížnost level tři"));
    const topic = makeTopic({
      inputType: "short_answer",
      generator: makeGenFromTasks(lvl1, lvl1, lvl3),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.filter(i => i.category === "difficulty_delta")).toHaveLength(0);
  });
});

describe("runPedagogicalAudit — hint_progression", () => {
  it("velká nápověda není o 20 % delší → hint_progression issue", () => {
    const topic = makeTopic({
      generator: makeGenFromTasks([
        task("Kolik je 5+3?", "8", { hints: ["Přičti ke 5 číslo 3", "Přičti 3"] }),
      ]),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.some(i => i.category === "hint_progression")).toBe(true);
  });

  it("velká nápověda je o ≥ 20 % delší → žádný issue", () => {
    const topic = makeTopic({
      generator: makeGenFromTasks([
        task("Kolik je 5+3?", "8", {
          hints: [
            "Přičti ke 5 číslo 3",
            "Vezmi číslo 5 a přidej k němu číslo 3, postupuj na číselné ose",
          ],
        }),
      ]),
    });
    const report = runPedagogicalAudit([topic]);
    expect(report.issues.filter(i => i.category === "hint_progression")).toHaveLength(0);
  });
});
