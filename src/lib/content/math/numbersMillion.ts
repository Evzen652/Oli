import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Čísla do milionu — porovnávání — 5. ročník ZŠ
 * Input type: COMPARISON (žák vybírá <, =, >)
 *
 * Úlohy: "Porovnej: 125 890 ○ 125 980" — odpověď < / = / >
 */

function fmtNum(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/\u00A0/g, " ");
}

function genNumbersMillion(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 60; i++) {
    let a: number;
    let b: number;

    if (level === 1) {
      // Do 10 000 — jednodušší, často lišící se v řádu tisíců
      a = Math.floor(Math.random() * 9000) + 1000;
      b = Math.floor(Math.random() * 9000) + 1000;
    } else if (level === 2) {
      // Do 100 000 — často stejné tisíce, lišící se v nižších řádech
      const base = Math.floor(Math.random() * 90000) + 10000;
      const diff = Math.floor(Math.random() * 500) + 1;
      a = base;
      b = Math.random() > 0.5 ? base + diff : base - diff;
    } else {
      // Do 1 000 000 — velmi blízká čísla, nutnost pozorného porovnání po řádech
      const base = Math.floor(Math.random() * 900000) + 100000;
      const diff = Math.floor(Math.random() * 100) + 1;
      a = base;
      b = Math.random() > 0.5 ? base + diff : base - diff;
    }

    // 15 % úloh jsou rovnosti (pro variaci)
    if (Math.random() < 0.15) b = a;

    const correctAnswer = a < b ? "<" : a > b ? ">" : "=";

    tasks.push({
      question: `Porovnej: ${fmtNum(a)} ○ ${fmtNum(b)}`,
      correctAnswer,
      options: ["<", "=", ">"],
      solutionSteps: [
        a === b
          ? `Obě čísla jsou stejná: ${fmtNum(a)} = ${fmtNum(b)}.`
          : `Porovnej čísla po řádech od nejvyššího (zleva).`,
        a !== b
          ? `${fmtNum(a)} ${a < b ? "je menší než" : "je větší než"} ${fmtNum(b)}.`
          : `Zapsat rovnítko: =.`,
        `Odpověď: ${correctAnswer}`,
      ],
      hints: [
        `Nejprve porovnej počet číslic. Pokud jsou stejný, jdi po řádech zleva.`,
        `Najdi první řád, kde se čísla liší. Tam kdo je větší, je i celé číslo větší.`,
      ],
    });
  }
  return tasks;
}

const HELP_NUMBERS_MILLION: HelpData = {
  hint:
    "Porovnávání velkých čísel — porovnávej postupně po řádech od nejvyššího (zleva). Jakmile najdeš rozdíl, víš odpověď.",
  steps: [
    "Srovnej počet číslic — pokud se liší, větší číslo má VÍC číslic.",
    "Pokud mají stejně číslic, porovnej po řádech zleva (statisíce, desítky tisíc…).",
    "Najdi první řád, kde se liší — tam rozhoduje, které číslo je větší.",
    "Zapiš: < (menší), = (rovná se), > (větší).",
  ],
  commonMistake:
    "POZOR: „větší“ znamená, že ukazuje vpravo. 5 < 8 čti „5 je menší než 8“. Znaménko < otevírá směrem k většímu číslu.",
  example:
    "Porovnej 125 890 a 125 980.\n• Oba mají 6 číslic.\n• Statisíce: 1 = 1, desetitisíce: 2 = 2, tisíce: 5 = 5.\n• Stovky: 8 < 9 — první rozdíl.\n• Takže 125 890 < 125 980. ✓",
  visualExamples: [
    {
      label: "Porovnávání po řádech",
      illustration:
        " 1 2 5 8 9 0\n 1 2 5 9 8 0\n ─ ─ ─ ↑\n stejné │ rozdíl (8 < 9)\n\n→ První rozdíl zleva určuje celé porovnání.\n→ 125 890 < 125 980",
      conclusion: "Sleduj čísla zleva. Najdi první pozici, kde se liší.",
    },
    {
      label: "Znaménka < = >",
      illustration:
        "  < otevřené DOLEVA  →  pravá strana je VĚTŠÍ\n  > otevřené DOPRAVA  →  levá strana je VĚTŠÍ\n  =                   →  obě strany jsou STEJNÉ\n\nTrik: „Krokodýl“ požírá vždy větší číslo.\n  5 < 8   — krokodýl chce větší 8\n  8 > 5   — krokodýl chce větší 8",
      conclusion: "Znaménko se otevírá směrem k VĚTŠÍMU číslu.",
    },
  ],
};

export const NUMBERS_MILLION_TOPICS: TopicMetadata[] = [
  {
    id: "math-numbers-million-5",
    title: "Čísla do milionu — porovnávání",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Čísla do milionu",
    topicDescription: "Čtení, zápis a porovnávání čísel do milionu.",
    briefDescription:
      "Naučíš se porovnávat velká čísla (do milionu). Stačí jít po řádech zleva a najít první rozdíl.",
    keywords: ["porovnávání", "milion", "velká čísla", "porovnej", "<", ">", "="],
    goals: [
      "Přečteš a zapíšeš číslo do milionu.",
      "Porovnáš dvě čísla pomocí <, =, >.",
      "Najdeš první řád, kde se čísla liší.",
    ],
    boundaries: [
      "Pouze přirozená čísla do 1 000 000.",
      "Žádná desetinná čísla (to je jiné téma).",
      "Žádné záporné číslo.",
    ],
    gradeRange: [5, 6],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "comparison",
    generator: genNumbersMillion,
    helpTemplate: HELP_NUMBERS_MILLION,
    contentType: "algorithmic",
    prerequisites: ["math-compare-natural-numbers-100", "math-rounding-4"],
    rvpReference: "M-5-1-01",
  },
];
