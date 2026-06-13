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
  solution: string;
  level: number;
}

const POOL: PoolItem[] = [
  // L1: krok +10 nebo +5 (rostoucí)
  { question: "10, 20, ___, 40, 50", correct: "30", distractors: ["25", "35", "20"], hint: "Srovnej 10→20: přibývá 10. Přidej 10 ke 20.", solution: "Krok je +10. 20 + 10 = 30.", level: 1 },
  { question: "5, 10, ___, 20, 25", correct: "15", distractors: ["12", "18", "10"], hint: "Srovnej 5→10: přibývá 5. Přidej 5 k 10.", solution: "Krok je +5. 10 + 5 = 15.", level: 1 },
  { question: "0, 10, 20, ___, 40", correct: "30", distractors: ["25", "35", "50"], hint: "Srovnej 0→10→20: přibývá 10. Přidej 10 ke 20.", solution: "Krok je +10. 20 + 10 = 30.", level: 1 },
  { question: "15, 20, ___, 30, 35", correct: "25", distractors: ["22", "28", "20"], hint: "Srovnej 15→20: přibývá 5. Přidej 5 ke 20.", solution: "Krok je +5. 20 + 5 = 25.", level: 1 },
  { question: "40, 50, ___, 70, 80", correct: "60", distractors: ["55", "65", "50"], hint: "Srovnej 40→50: přibývá 10. Přidej 10 k 50.", solution: "Krok je +10. 50 + 10 = 60.", level: 1 },
  { question: "30, 35, 40, ___, 50", correct: "45", distractors: ["42", "48", "40"], hint: "Srovnej 30→35→40: přibývá 5. Přidej 5 ke 40.", solution: "Krok je +5. 40 + 5 = 45.", level: 1 },
  { question: "20, 30, 40, 50, ___", correct: "60", distractors: ["55", "65", "70"], hint: "Srovnej 20→30: přibývá 10. Přidej 10 k 50.", solution: "Krok je +10. 50 + 10 = 60.", level: 1 },
  // L2: krok −10 nebo +2 (klesající nebo menší krok)
  { question: "80, 70, ___, 50, 40", correct: "60", distractors: ["55", "65", "70"], hint: "Srovnej 80→70: ubývá 10. Odečti 10 od 70.", solution: "Krok je −10. 70 − 10 = 60.", level: 2 },
  { question: "50, 40, ___, 20, 10", correct: "30", distractors: ["25", "35", "40"], hint: "Srovnej 50→40: ubývá 10. Odečti 10 od 40.", solution: "Krok je −10. 40 − 10 = 30.", level: 2 },
  { question: "4, 6, ___, 10, 12", correct: "8", distractors: ["7", "9", "6"], hint: "Srovnej 4→6: přibývá 2. Přidej 2 k 6.", solution: "Krok je +2. 6 + 2 = 8.", level: 2 },
  { question: "12, 14, ___, 18, 20", correct: "16", distractors: ["15", "17", "14"], hint: "Srovnej 12→14: přibývá 2. Přidej 2 ke 14.", solution: "Krok je +2. 14 + 2 = 16.", level: 2 },
  { question: "90, 80, 70, ___, 50", correct: "60", distractors: ["55", "65", "75"], hint: "Srovnej 90→80→70: ubývá 10. Odečti 10 od 70.", solution: "Krok je −10. 70 − 10 = 60.", level: 2 },
  { question: "6, ___, 10, 12, 14", correct: "8", distractors: ["7", "9", "5"], hint: "Srovnej 10→12→14: přibývá 2. Co bylo před 10? Odečti 2.", solution: "Krok je +2. 6 + 2 = 8.", level: 2 },
  { question: "22, 24, 26, ___, 30", correct: "28", distractors: ["27", "29", "25"], hint: "Srovnej 22→24→26: přibývá 2. Přidej 2 k 26.", solution: "Krok je +2. 26 + 2 = 28.", level: 2 },
  // L3: krok −2, −5, nebo +3
  { question: "20, 18, ___, 14, 12", correct: "16", distractors: ["15", "17", "18"], hint: "Srovnej 20→18: ubývá 2. Odečti 2 od 18.", solution: "Krok je −2. 18 − 2 = 16.", level: 3 },
  { question: "35, 30, ___, 20, 15", correct: "25", distractors: ["22", "28", "30"], hint: "Srovnej 35→30: ubývá 5. Odečti 5 od 30.", solution: "Krok je −5. 30 − 5 = 25.", level: 3 },
  { question: "3, 6, 9, ___, 15", correct: "12", distractors: ["11", "13", "10"], hint: "Srovnej 3→6→9: přibývá 3. Přidej 3 k 9.", solution: "Krok je +3. 9 + 3 = 12.", level: 3 },
  { question: "50, 45, ___, 35, 30", correct: "40", distractors: ["38", "42", "45"], hint: "Srovnej 50→45: ubývá 5. Odečti 5 od 45.", solution: "Krok je −5. 45 − 5 = 40.", level: 3 },
  { question: "9, 12, 15, ___, 21", correct: "18", distractors: ["16", "20", "17"], hint: "Srovnej 9→12→15: přibývá 3. Přidej 3 k 15.", solution: "Krok je +3. 15 + 3 = 18.", level: 3 },
  { question: "40, 38, ___, 34, 32", correct: "36", distractors: ["35", "37", "38"], hint: "Srovnej 40→38: ubývá 2. Odečti 2 od 38.", solution: "Krok je −2. 38 − 2 = 36.", level: 3 },
  { question: "6, 9, 12, ___, 18", correct: "15", distractors: ["13", "14", "16"], hint: "Srovnej 6→9→12: přibývá 3. Přidej 3 ke 12.", solution: "Krok je +3. 12 + 3 = 15.", level: 3 },
];

function gen(level: number): PracticeTask[] {
  const filtered = POOL.filter(item => item.level <= level);
  const shuffled = shuffle(filtered);
  return shuffled.slice(0, 20).map(item => ({
    question: item.question,
    correctAnswer: item.correct,
    options: shuffle([item.correct, ...item.distractors]),
    hints: [item.hint],
    solutionSteps: [item.solution],
  }));
}

export const POSLOUPNOSTICISEL: TopicMetadata[] = [
  {
    id: "g2-mat-posloupnosti",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-posloupnosti-cisel",
    title: "Posloupnosti čísel",
    studentTitle: "Řady čísel",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Najdeš chybějící číslo v řadě čísel.",
    keywords: ["posloupnost", "řada", "chybějící číslo", "vzor", "krok"],
    goals: [
      "Rozpoznat pravidlo číselné řady.",
      "Doplnit chybějící číslo do posloupnosti.",
      "Pracovat s kroky +2, +5, +10, -2, -5, -10.",
    ],
    boundaries: ["Čísla 0–100.", "Kroky ±2, ±3, ±5, ±10."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Najdi krok — o kolik se každé číslo mění.",
      steps: [
        "Odečti sousední čísla: 15 − 10 = 5 → krok je +5.",
        "Přidej krok k číslu před mezerou.",
        "Zkontroluj číslem za mezerou.",
      ],
      commonMistake: "Záměna rostoucí a klesající řady — dávej pozor na směr.",
      example: "5, 10, 15, ___, 25 → krok +5 → chybí 20.",
    },
  },
];
