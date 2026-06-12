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
}

const POOL: PoolItem[] = [
  // Která je delší
  { question: "Která je delší: 5 cm nebo 8 cm?", correct: "8 cm", distractors: ["5 cm", "3 cm", "10 cm"] },
  { question: "Která je delší: 12 cm nebo 7 cm?", correct: "12 cm", distractors: ["7 cm", "10 cm", "15 cm"] },
  { question: "Která je kratší: 4 cm nebo 9 cm?", correct: "4 cm", distractors: ["9 cm", "6 cm", "2 cm"] },
  { question: "Která je kratší: 15 cm nebo 6 cm?", correct: "6 cm", distractors: ["15 cm", "10 cm", "8 cm"] },
  { question: "Která je delší: 3 cm nebo 30 mm?", correct: "stejně dlouhé", distractors: ["3 cm", "30 mm", "20 mm"] },
  // Součet úseček
  { question: "AB = 4 cm, BC = 3 cm. AC = ?", correct: "7 cm", distractors: ["6 cm", "8 cm", "5 cm"] },
  { question: "AB = 6 cm, BC = 5 cm. AC = ?", correct: "11 cm", distractors: ["10 cm", "12 cm", "9 cm"] },
  { question: "AB = 8 cm, BC = 2 cm. AC = ?", correct: "10 cm", distractors: ["6 cm", "12 cm", "9 cm"] },
  { question: "AB = 3 cm, BC = 7 cm. AC = ?", correct: "10 cm", distractors: ["4 cm", "9 cm", "11 cm"] },
  { question: "AB = 5 cm, BC = 5 cm. AC = ?", correct: "10 cm", distractors: ["5 cm", "8 cm", "12 cm"] },
  // Polovina
  { question: "Úsečka je 10 cm. Polovina:", correct: "5 cm", distractors: ["4 cm", "6 cm", "8 cm"] },
  { question: "Úsečka je 8 cm. Polovina:", correct: "4 cm", distractors: ["3 cm", "5 cm", "6 cm"] },
  { question: "Úsečka je 6 cm. Polovina:", correct: "3 cm", distractors: ["2 cm", "4 cm", "5 cm"] },
  { question: "Úsečka je 12 cm. Polovina:", correct: "6 cm", distractors: ["5 cm", "7 cm", "4 cm"] },
  // Délka ze zadání
  { question: "Pravítko ukazuje 7 cm. Je to ? mm?", correct: "70 mm", distractors: ["7 mm", "700 mm", "17 mm"] },
  { question: "Pravítko ukazuje 3 cm. Je to ? mm?", correct: "30 mm", distractors: ["3 mm", "300 mm", "13 mm"] },
  { question: "Úsečka AB = 9 cm. Úsečka CD = 4 cm. Rozdíl:", correct: "5 cm", distractors: ["3 cm", "6 cm", "13 cm"] },
  { question: "Úsečka AB = 15 cm. Úsečka CD = 8 cm. Rozdíl:", correct: "7 cm", distractors: ["6 cm", "8 cm", "23 cm"] },
  { question: "Narýsuj: AB = 5 cm, pak +3 cm. Celkem:", correct: "8 cm", distractors: ["7 cm", "9 cm", "6 cm"] },
  { question: "Úsečka je 20 cm. Třetina:", correct: "asi 7 cm", distractors: ["5 cm", "10 cm", "4 cm"] },
];

function gen(_level: number): PracticeTask[] {
  const shuffled = shuffle(POOL);
  return shuffled.slice(0, 20).map(item => {
    const opts = shuffle([item.correct, ...item.distractors].slice(0, 4));
    return {
      question: item.question,
      correctAnswer: item.correct,
      options: opts,
      hints: [`Sečti nebo odečti délky. 1 cm = 10 mm.`],
      solutionSteps: [`Odpověď: ${item.correct}`],
    };
  });
}

export const MERIENIDELIVKYUSECKY: TopicMetadata[] = [
  {
    id: "g2-mat-mereni-delky",
    rvpNodeId:
      "g2-matematika-geometrie-v-rovine-a-v-prostoru-body-primky-usecky-mereni-delky-usecky",
    title: "Měření délky úsečky",
    studentTitle: "Délka úsečky",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Body, přímky, úsečky",
    briefDescription: "Porovnáš délky úseček a spočítáš celkovou délku.",
    keywords: ["délka", "úsečka", "cm", "mm", "měření", "pravítko"],
    goals: [
      "Porovnat délky dvou úseček.",
      "Spočítat celkovou délku navazujících úseček.",
      "Znát vztah 1 cm = 10 mm.",
    ],
    boundaries: ["Délky do 20 cm.", "Pouze cm a mm."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Délky sečti jako čísla, jen přidej 'cm'.",
      steps: [
        "Přečti délky obou úseček.",
        "Sečti nebo odečti čísla.",
        "Přidej jednotku cm.",
      ],
      commonMistake: "Zapomenutí jednotky — výsledek musí mít 'cm' nebo 'mm'.",
      example: "AB = 4 cm, BC = 3 cm. AC = 4 + 3 = 7 cm.",
    },
  },
];
