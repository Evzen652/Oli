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
  hints: string[];
}

const POOL_L1: PoolItem[] = [
  { question: "6 ÷ 2 = ?", correct: "3", distractors: ["2", "4", "5"], hints: ["Rozděl 6 na 2 stejné části: 6 = ? + ?"] },
  { question: "8 ÷ 2 = ?", correct: "4", distractors: ["3", "5", "6"], hints: ["Rozděl 8 na 2 stejné části: 8 = ? + ?"] },
  { question: "10 ÷ 2 = ?", correct: "5", distractors: ["4", "6", "3"], hints: ["Rozděl 10 na 2 stejné části: 10 = ? + ?"] },
  { question: "14 ÷ 2 = ?", correct: "7", distractors: ["6", "8", "5"], hints: ["Rozděl 14 na 2 stejné části: 14 = ? + ?"] },
  { question: "18 ÷ 2 = ?", correct: "9", distractors: ["8", "10", "7"], hints: ["Rozděl 18 na 2 stejné části: 18 = ? + ?"] },
  { question: "9 ÷ 3 = ?", correct: "3", distractors: ["2", "4", "6"], hints: ["Rozděl 9 na 3 stejné části: 9 = ? + ? + ?"] },
  { question: "12 ÷ 3 = ?", correct: "4", distractors: ["3", "5", "6"], hints: ["Rozděl 12 na 3 stejné části: 12 = ? + ? + ?"] },
  { question: "15 ÷ 3 = ?", correct: "5", distractors: ["4", "6", "3"], hints: ["Rozděl 15 na 3 stejné části: 15 = ? + ? + ?"] },
  { question: "21 ÷ 3 = ?", correct: "7", distractors: ["6", "8", "9"], hints: ["Rozděl 21 na 3 stejné části: 21 = ? + ? + ?"] },
];

const POOL_L2: PoolItem[] = [
  { question: "12 ÷ 4 = ?", correct: "3", distractors: ["2", "4", "5"], hints: ["Rozděl 12 na 4 stejné části: 12 = ? + ? + ? + ?"] },
  { question: "16 ÷ 4 = ?", correct: "4", distractors: ["3", "5", "8"], hints: ["Rozděl 16 na 4 stejné části: 16 = ? + ? + ? + ?"] },
  { question: "20 ÷ 4 = ?", correct: "5", distractors: ["4", "6", "8"], hints: ["Rozděl 20 na 4 stejné části: 20 = ? + ? + ? + ?"] },
  { question: "28 ÷ 4 = ?", correct: "7", distractors: ["6", "8", "5"], hints: ["Rozděl 28 na 4 stejné části: 28 = ? + ? + ? + ?"] },
  { question: "36 ÷ 4 = ?", correct: "9", distractors: ["8", "10", "7"], hints: ["Rozděl 36 na 4 stejné části: 36 = ? + ? + ? + ?"] },
  { question: "20 ÷ 5 = ?", correct: "4", distractors: ["3", "5", "6"], hints: ["Rozděl 20 na 5 stejných částí: 20 = ? + ? + ? + ? + ?"] },
  { question: "30 ÷ 5 = ?", correct: "6", distractors: ["5", "7", "4"], hints: ["Rozděl 30 na 5 stejných částí: 30 = ? + ? + ? + ? + ?"] },
  { question: "40 ÷ 5 = ?", correct: "8", distractors: ["7", "9", "6"], hints: ["Rozděl 40 na 5 stejných částí: 40 = ? + ? + ? + ? + ?"] },
  { question: "45 ÷ 5 = ?", correct: "9", distractors: ["8", "10", "7"], hints: ["Rozděl 45 na 5 stejných částí: 45 = ? + ? + ? + ? + ?"] },
];

const POOL_L3: PoolItem[] = [
  { question: "2 × ? = 16", correct: "8", distractors: ["7", "9", "6"], hints: ["Vzpomeň si na násobilku dvojek.", "Počítej po 2, dokud nedosáhneš 16."] },
  { question: "3 × ? = 21", correct: "7", distractors: ["6", "8", "9"], hints: ["Vzpomeň si na násobilku trojek.", "Počítej po 3, dokud nedosáhneš 21."] },
  { question: "4 × ? = 32", correct: "8", distractors: ["7", "9", "6"], hints: ["Vzpomeň si na násobilku čtyřek.", "Počítej po 4, dokud nedosáhneš 32."] },
  { question: "5 × ? = 35", correct: "7", distractors: ["6", "8", "9"], hints: ["Vzpomeň si na násobilku pětek.", "Počítej po 5, dokud nedosáhneš 35."] },
  { question: "3 × ? = 27", correct: "9", distractors: ["8", "10", "7"], hints: ["Vzpomeň si na násobilku trojek.", "Počítej po 3, dokud nedosáhneš 27."] },
  { question: "4 × ? = 24", correct: "6", distractors: ["5", "7", "8"], hints: ["Vzpomeň si na násobilku čtyřek.", "Počítej po 4, dokud nedosáhneš 24."] },
  { question: "5 × ? = 45", correct: "9", distractors: ["8", "10", "7"], hints: ["Vzpomeň si na násobilku pětek.", "Počítej po 5, dokud nedosáhneš 45."] },
  { question: "2 × ? = 18", correct: "9", distractors: ["8", "10", "7"], hints: ["Vzpomeň si na násobilku dvojek.", "Počítej po 2, dokud nedosáhneš 18."] },
  { question: "4 × ? = 36", correct: "9", distractors: ["8", "10", "7"], hints: ["Vzpomeň si na násobilku čtyřek.", "Počítej po 4, dokud nedosáhneš 36."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).map(item => ({
    question: item.question,
    correctAnswer: item.correct,
    options: shuffle([item.correct, ...item.distractors]),
    hints: item.hints,
    solutionSteps: [`${item.question.replace("?", item.correct)}`],
  }));
}

export const VZTAHNASOBENIADELENI: TopicMetadata[] = [
  {
    id: "g2-mat-vztah-nasobeni-deleni",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-nasobeni-a-deleni-vztah-nasobeni-a-deleni",
    title: "Vztah násobení a dělení",
    studentTitle: "Násobení a dělení",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobení a dělení",
    briefDescription: "Pochopíš, jak násobení a dělení spolu souvisí.",
    keywords: ["dělení", "násobení", "vztah", "dělení s násobilkou"],
    goals: [
      "Pochopit dělení jako opak násobení.",
      "Řešit příklady dělení pomocí násobilky 2–5.",
      "Najít chybějící faktor v násobení.",
    ],
    boundaries: ["Dělenci do 50.", "Pouze tabulky 2–5."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Dělení je opak násobení — použij násobilku.",
      steps: [
        "Přečti příklad: 12 ÷ 3 = ?",
        "Ptáš se: 3 × ? = 12",
        "Z násobilky: 3 × 4 = 12, takže odpověď je 4.",
      ],
      commonMistake: "Záměna dělence a dělitele — dávej pozor na pořadí.",
      example: "20 ÷ 5 = ? → 5 × 4 = 20 → odpověď je 4.",
    },
  },
];
