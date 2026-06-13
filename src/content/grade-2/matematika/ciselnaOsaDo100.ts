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
  level: number;
}

const POOL: PoolItem[] = [
  // L1: krok +10
  { question: "Co chybí? 10, 20, ___, 40, 50", correct: "30", distractors: ["20", "40", "25"], level: 1 },
  { question: "Co chybí? 0, 10, ___, 30, 40", correct: "20", distractors: ["10", "30", "25"], level: 1 },
  { question: "Co chybí? 20, ___, 40, 50, 60", correct: "30", distractors: ["35", "25", "40"], level: 1 },
  { question: "Co chybí? 30, 40, 50, ___, 70", correct: "60", distractors: ["55", "70", "50"], level: 1 },
  { question: "Co chybí? 50, 60, ___, 80, 90", correct: "70", distractors: ["65", "75", "80"], level: 1 },
  { question: "Co chybí? 10, ___, 30, 40, 50", correct: "20", distractors: ["15", "25", "30"], level: 1 },
  { question: "Co chybí? 60, 70, ___, 90, 100", correct: "80", distractors: ["75", "85", "70"], level: 1 },
  // L2: krok +5
  { question: "Co chybí? 5, 10, ___, 20, 25", correct: "15", distractors: ["12", "18", "10"], level: 2 },
  { question: "Co chybí? 25, 30, ___, 40, 45", correct: "35", distractors: ["30", "38", "40"], level: 2 },
  { question: "Co chybí? 50, 55, ___, 65, 70", correct: "60", distractors: ["55", "58", "62"], level: 2 },
  { question: "Co chybí? 10, ___, 20, 25, 30", correct: "15", distractors: ["12", "18", "20"], level: 2 },
  { question: "Co chybí? 35, 40, 45, ___, 55", correct: "50", distractors: ["48", "52", "45"], level: 2 },
  { question: "Co chybí? 65, 70, ___, 80, 85", correct: "75", distractors: ["72", "78", "70"], level: 2 },
  { question: "Co chybí? 45, ___, 55, 60, 65", correct: "50", distractors: ["48", "52", "55"], level: 2 },
  // L3: krok +2
  { question: "Co chybí? 2, 4, ___, 8, 10", correct: "6", distractors: ["5", "7", "4"], level: 3 },
  { question: "Co chybí? 10, 12, ___, 16, 18", correct: "14", distractors: ["13", "15", "12"], level: 3 },
  { question: "Co chybí? 20, ___, 24, 26, 28", correct: "22", distractors: ["21", "23", "24"], level: 3 },
  { question: "Co chybí? 30, 32, ___, 36, 38", correct: "34", distractors: ["33", "35", "32"], level: 3 },
  { question: "Co chybí? 42, 44, 46, ___, 50", correct: "48", distractors: ["47", "49", "46"], level: 3 },
  { question: "Co chybí? 56, ___, 60, 62, 64", correct: "58", distractors: ["57", "59", "60"], level: 3 },
  { question: "Co chybí? 74, 76, ___, 80, 82", correct: "78", distractors: ["77", "79", "76"], level: 3 },
];

function gen(level: number): PracticeTask[] {
  const filtered = POOL.filter(item => item.level <= level);
  const shuffled = shuffle(filtered);
  return shuffled.slice(0, 20).map(item => ({
    question: item.question,
    correctAnswer: item.correct,
    options: shuffle([item.correct, ...item.distractors]),
    hints: ["Podívej se, o kolik se čísla mění."],
    solutionSteps: [`Chybí číslo ${item.correct}.`],
  }));
}

export const CISELNAOSADO100: TopicMetadata[] = [
  {
    id: "g2-mat-ciselna-osa-100",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-ciselny-obor-0-100-ciselna-osa-do-100",
    title: "Číselná osa do 100",
    studentTitle: "Číselná osa",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–100",
    briefDescription: "Najdeš chybějící číslo na číselné ose.",
    keywords: ["číselná osa", "posloupnost", "chybějící číslo", "řada čísel"],
    goals: [
      "Orientovat se na číselné ose do 100.",
      "Určit chybějící číslo v řadě s krokem 2, 5 nebo 10.",
      "Poznat směr číselné osy (rostoucí).",
    ],
    boundaries: ["Pouze čísla 0–100.", "Kroky 2, 5 nebo 10."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Podívej se, o kolik se čísla mění — pak přičti nebo odečti.",
      steps: [
        "Najdi, o kolik se čísla mění (krok).",
        "Přičti nebo odečti krok k sousednímu číslu.",
        "Zkontroluj, zda sedí i druhý soused.",
      ],
      commonMistake: "Záměna kroku — nejdřív zjisti, o kolik se čísla mění.",
      example: "10, 20, ___, 40 → krok je +10 → chybí 30.",
    },
  },
];
