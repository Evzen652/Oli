import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PoolItem {
  question: string;
  correct: string;
  distractors: string[];
  hint: string;
  level: 1 | 2;
}

// Celá malá násobilka 2–5 (×2 až ×10, přeskakuje ×1).
// level 1 = násobilka 2 a 3, level 2 = násobilka 4 a 5.
// gen(3) používá všechny položky.
const POOL: PoolItem[] = [
  // Násobilka 2
  { question: "2 × 2 = ?", correct: "4", distractors: ["2", "6", "8"], hint: "Vynásobit 2 = přičti číslo k sobě: 2 + 2 = ?", level: 1 },
  { question: "2 × 3 = ?", correct: "6", distractors: ["4", "8", "5"], hint: "Vynásobit 2 = přičti číslo k sobě: 3 + 3 = ?", level: 1 },
  { question: "2 × 4 = ?", correct: "8", distractors: ["6", "10", "7"], hint: "Vynásobit 2 = přičti číslo k sobě: 4 + 4 = ?", level: 1 },
  { question: "2 × 5 = ?", correct: "10", distractors: ["8", "12", "9"], hint: "Vynásobit 2 = přičti číslo k sobě: 5 + 5 = ?", level: 1 },
  { question: "2 × 6 = ?", correct: "12", distractors: ["10", "14", "11"], hint: "Vynásobit 2 = přičti číslo k sobě: 6 + 6 = ?", level: 1 },
  { question: "2 × 7 = ?", correct: "14", distractors: ["12", "16", "13"], hint: "Vynásobit 2 = přičti číslo k sobě: 7 + 7 = ?", level: 1 },
  { question: "2 × 8 = ?", correct: "16", distractors: ["14", "18", "15"], hint: "Vynásobit 2 = přičti číslo k sobě: 8 + 8 = ?", level: 1 },
  { question: "2 × 9 = ?", correct: "18", distractors: ["16", "20", "17"], hint: "Vynásobit 2 = přičti číslo k sobě: 9 + 9 = ?", level: 1 },
  { question: "2 × 10 = ?", correct: "20", distractors: ["18", "22", "12"], hint: "Vynásobit 2 = přičti číslo k sobě: 10 + 10 = ?", level: 1 },
  // Násobilka 3
  { question: "3 × 2 = ?", correct: "6", distractors: ["3", "9", "5"], hint: "3 + 3 = ?", level: 1 },
  { question: "3 × 3 = ?", correct: "9", distractors: ["6", "12", "8"], hint: "3 + 3 + 3 = ?", level: 1 },
  { question: "3 × 4 = ?", correct: "12", distractors: ["9", "15", "11"], hint: "3 + 3 + 3 + 3 = ?", level: 1 },
  { question: "3 × 5 = ?", correct: "15", distractors: ["12", "18", "14"], hint: "3 + 3 + 3 + 3 + 3 = ?", level: 1 },
  { question: "3 × 6 = ?", correct: "18", distractors: ["15", "21", "16"], hint: "Počítej po 3: 3, 6, 9, 12, 15 — a přidej ještě jednu trojku.", level: 1 },
  { question: "3 × 7 = ?", correct: "21", distractors: ["18", "24", "20"], hint: "Počítej po 3: 3, 6, 9, 12, 15, 18 — a přidej ještě jednu trojku.", level: 1 },
  { question: "3 × 8 = ?", correct: "24", distractors: ["21", "27", "22"], hint: "Počítej po 3: 3, 6, 9, 12, 15, 18, 21 — a přidej ještě jednu trojku.", level: 1 },
  { question: "3 × 9 = ?", correct: "27", distractors: ["24", "30", "25"], hint: "Počítej po 3: 3, 6, 9, 12, 15, 18, 21, 24 — a přidej ještě jednu trojku.", level: 1 },
  { question: "3 × 10 = ?", correct: "30", distractors: ["27", "33", "20"], hint: "Násobení deseti: připiš k číslu jednu nulu.", level: 1 },
  // Násobilka 4
  { question: "4 × 2 = ?", correct: "8", distractors: ["4", "12", "6"], hint: "4 + 4 = ?", level: 2 },
  { question: "4 × 3 = ?", correct: "12", distractors: ["8", "16", "11"], hint: "4 + 4 + 4 = ?", level: 2 },
  { question: "4 × 4 = ?", correct: "16", distractors: ["12", "20", "15"], hint: "4 + 4 + 4 + 4 = ?", level: 2 },
  { question: "4 × 5 = ?", correct: "20", distractors: ["16", "24", "18"], hint: "4 + 4 + 4 + 4 + 4 = ?", level: 2 },
  { question: "4 × 6 = ?", correct: "24", distractors: ["20", "28", "22"], hint: "Počítej po 4: 4, 8, 12, 16, 20 — a přidej ještě jednu čtyřku.", level: 2 },
  { question: "4 × 7 = ?", correct: "28", distractors: ["24", "32", "27"], hint: "Počítej po 4: 4, 8, 12, 16, 20, 24 — a přidej ještě jednu čtyřku.", level: 2 },
  { question: "4 × 8 = ?", correct: "32", distractors: ["28", "36", "30"], hint: "Počítej po 4: 4, 8, 12, 16, 20, 24, 28 — a přidej ještě jednu čtyřku.", level: 2 },
  { question: "4 × 9 = ?", correct: "36", distractors: ["32", "40", "35"], hint: "Počítej po 4: 4, 8, 12, 16, 20, 24, 28, 32 — a přidej ještě jednu čtyřku.", level: 2 },
  { question: "4 × 10 = ?", correct: "40", distractors: ["36", "44", "30"], hint: "Násobení deseti: připiš k číslu jednu nulu.", level: 2 },
  // Násobilka 5
  { question: "5 × 2 = ?", correct: "10", distractors: ["5", "15", "8"], hint: "5 + 5 = ?", level: 2 },
  { question: "5 × 3 = ?", correct: "15", distractors: ["10", "20", "14"], hint: "5 + 5 + 5 = ?", level: 2 },
  { question: "5 × 4 = ?", correct: "20", distractors: ["15", "25", "18"], hint: "5 + 5 + 5 + 5 = ?", level: 2 },
  { question: "5 × 5 = ?", correct: "25", distractors: ["20", "30", "24"], hint: "5 + 5 + 5 + 5 + 5 = ?", level: 2 },
  { question: "5 × 6 = ?", correct: "30", distractors: ["25", "35", "28"], hint: "Počítej po 5: 5, 10, 15, 20, 25 — a přidej ještě jednu pětku.", level: 2 },
  { question: "5 × 7 = ?", correct: "35", distractors: ["30", "40", "34"], hint: "Počítej po 5: 5, 10, 15, 20, 25, 30 — a přidej ještě jednu pětku.", level: 2 },
  { question: "5 × 8 = ?", correct: "40", distractors: ["35", "45", "38"], hint: "Počítej po 5: 5, 10, 15, 20, 25, 30, 35 — a přidej ještě jednu pětku.", level: 2 },
  { question: "5 × 9 = ?", correct: "45", distractors: ["40", "50", "44"], hint: "Počítej po 5: 5, 10, 15, 20, 25, 30, 35, 40 — a přidej ještě jednu pětku.", level: 2 },
  { question: "5 × 10 = ?", correct: "50", distractors: ["45", "55", "40"], hint: "Násobení deseti: připiš k číslu jednu nulu.", level: 2 },
];

/**
 * PED-3 kalibrace L1<L2<L3.
 *
 * Před: L3 = celý POOL (L1+L2 union) → `getTierTasks` (rozdíl množin) L3
 * vyprazdňoval, audit `9/9/0 max L2`. Nová L3 dovednost = INVERZE
 * (najdi chybějící činitel: `? × t = c`), stejný pattern jako u
 * `g3-mat-nasobilka-6-10`.
 */

function makeInverseTask(t: number, n: number): PracticeTask {
  const c = t * n;
  const distractors = Array.from(
    new Set([
      String(n + 1),
      String(Math.max(1, n - 1)),
      String(n + 2),
      String(Math.max(1, n - 2)),
    ]),
  ).slice(0, 3);
  return {
    question: `? × ${t} = ${c}`,
    correctAnswer: String(n),
    options: shuffle([String(n), ...distractors]),
    hints: [
      `Zeptej se: kolikrát vezmu ${t}, abych dostal ${c}?`,
      `Nebo obráceně: ${c} ÷ ${t} = ?`,
    ],
    solutionSteps: [
      `Hledám číslo x tak, že x × ${t} = ${c}.`,
      `x = ${c} ÷ ${t} = ${n}.`,
    ],
  };
}

function gen(level: number): PracticeTask[] {
  if (level === 3) {
    // L3 — inverze: `? × t = c` pro t ∈ [2, 3, 4, 5], n ∈ [2..10]
    const combos: { t: number; n: number }[] = [];
    for (const t of [2, 3, 4, 5]) for (let n = 2; n <= 10; n++) combos.push({ t, n });
    return shuffle(combos).slice(0, 20).map(({ t, n }) => makeInverseTask(t, n));
  }
  const filtered = POOL.filter((item) => item.level === (level as 1 | 2));
  const shuffled = shuffle(filtered);
  return shuffled.slice(0, 20).map((item) => ({
    question: item.question,
    correctAnswer: item.correct,
    options: shuffle([item.correct, ...item.distractors]),
    hints: [item.hint],
    solutionSteps: [`${item.question.replace("?", item.correct)}`],
  }));
}

export const NASOBILKA2345: TopicMetadata[] = [
  {
    id: "g2-mat-nasobilka-2345",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-nasobeni-a-deleni-nasobeni-a-deleni-2-3-4-5-mala-nasobilka-uvod",
    title: "Násobilka 2, 3, 4, 5 (malá násobilka — úvod)",
    studentTitle: "Násobilka 2–5",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobení a dělení",
    briefDescription: "Procvičíš násobilku 2, 3, 4 a 5 zpaměti.",
    keywords: ["násobilka", "násobení", "2", "3", "4", "5", "krát"],
    goals: [
      "Zpaměti ovládat násobilku 2 a 3.",
      "Zpaměti ovládat násobilku 4 a 5.",
      "Rychle odpovídat na příklady z násobilky 2–5.",
      "Najít chybějící činitel v příkladu (? × 4 = 20).",
    ],
    boundaries: ["Pouze násobilka 2–5.", "Nezahrnuje dělení ani násobilku 6–10."],
    gradeRange: [2, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Každý příklad jde spočítat opakovaným sčítáním: 3 × 4 = 3+3+3+3 = 12.",
      steps: [
        "Nauč se násobilku 2, pak 3, pak 4, pak 5.",
        "Pomáhá rytmické odříkávání: 2, 4, 6, 8, 10…",
        "Záměnnost: 3 × 4 = 4 × 3 — vyber tu, co znáš lépe.",
      ],
      commonMistake: "Záměna výsledků sousedních příkladů — dávej pozor na pořadí.",
      example: "5 × 4: 5+5=10, 10+5=15, 15+5=20. Výsledek: 20.",
    },
  },
];
