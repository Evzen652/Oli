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
}

const POOL: PoolItem[] = [
  // Která je delší / kratší
  { question: "Která úsečka je delší: 5 cm nebo 8 cm?", correct: "8 cm", distractors: ["5 cm", "3 cm", "10 cm"], hint: "Srovnej čísla: 5 a 8 — které je větší?", solution: "8 cm je delší — 8 je větší než 5." },
  { question: "Která úsečka je delší: 12 cm nebo 7 cm?", correct: "12 cm", distractors: ["7 cm", "10 cm", "15 cm"], hint: "Srovnej čísla: 12 a 7 — které je větší?", solution: "12 cm je delší — 12 je větší než 7." },
  { question: "Která úsečka je kratší: 4 cm nebo 9 cm?", correct: "4 cm", distractors: ["9 cm", "6 cm", "2 cm"], hint: "Srovnej čísla: 4 a 9 — které je menší?", solution: "4 cm je kratší — 4 je menší než 9." },
  { question: "Která úsečka je kratší: 15 cm nebo 6 cm?", correct: "6 cm", distractors: ["15 cm", "10 cm", "8 cm"], hint: "Srovnej čísla: 15 a 6 — které je menší?", solution: "6 cm je kratší — 6 je menší než 15." },
  { question: "Která úsečka je delší: 3 cm nebo 30 mm?", correct: "stejně dlouhé", distractors: ["3 cm", "30 mm", "20 mm"], hint: "Převeď na stejnou jednotku: 1 cm = 10 mm. Kolik mm je 3 cm?", solution: "3 cm = 30 mm — obě úsečky jsou stejně dlouhé." },
  // Součet úseček
  { question: "Úsečka AB = 4 cm a BC = 3 cm. Jak dlouhá je úsečka AC?", correct: "7 cm", distractors: ["6 cm", "8 cm", "5 cm"], hint: "AC = AB + BC. Kolik je 4 + 3?", solution: "AC = AB + BC = 4 cm + 3 cm = 7 cm." },
  { question: "Úsečka AB = 6 cm a BC = 5 cm. Jak dlouhá je úsečka AC?", correct: "11 cm", distractors: ["10 cm", "12 cm", "9 cm"], hint: "AC = AB + BC. Kolik je 6 + 5?", solution: "AC = AB + BC = 6 cm + 5 cm = 11 cm." },
  { question: "Úsečka AB = 8 cm a BC = 2 cm. Jak dlouhá je úsečka AC?", correct: "10 cm", distractors: ["6 cm", "12 cm", "9 cm"], hint: "AC = AB + BC. Kolik je 8 + 2?", solution: "AC = AB + BC = 8 cm + 2 cm = 10 cm." },
  { question: "Úsečka AB = 3 cm a BC = 7 cm. Jak dlouhá je úsečka AC?", correct: "10 cm", distractors: ["4 cm", "9 cm", "11 cm"], hint: "AC = AB + BC. Kolik je 3 + 7?", solution: "AC = AB + BC = 3 cm + 7 cm = 10 cm." },
  { question: "Úsečka AB = 5 cm a BC = 5 cm. Jak dlouhá je úsečka AC?", correct: "10 cm", distractors: ["5 cm", "8 cm", "12 cm"], hint: "AC = AB + BC. Kolik je 5 + 5?", solution: "AC = AB + BC = 5 cm + 5 cm = 10 cm." },
  // Polovina
  { question: "Úsečka je 10 cm dlouhá. Kolik cm je polovina?", correct: "5 cm", distractors: ["4 cm", "6 cm", "8 cm"], hint: "Polovina = rozděl na 2 stejné části. Kolik je 10 ÷ 2?", solution: "Polovina z 10 cm = 10 ÷ 2 = 5 cm." },
  { question: "Úsečka je 8 cm dlouhá. Kolik cm je polovina?", correct: "4 cm", distractors: ["3 cm", "5 cm", "6 cm"], hint: "Polovina = rozděl na 2 stejné části. Kolik je 8 ÷ 2?", solution: "Polovina z 8 cm = 8 ÷ 2 = 4 cm." },
  { question: "Úsečka je 6 cm dlouhá. Kolik cm je polovina?", correct: "3 cm", distractors: ["2 cm", "4 cm", "5 cm"], hint: "Polovina = rozděl na 2 stejné části. Kolik je 6 ÷ 2?", solution: "Polovina z 6 cm = 6 ÷ 2 = 3 cm." },
  { question: "Úsečka je 12 cm dlouhá. Kolik cm je polovina?", correct: "6 cm", distractors: ["5 cm", "7 cm", "4 cm"], hint: "Polovina = rozděl na 2 stejné části. Kolik je 12 ÷ 2?", solution: "Polovina z 12 cm = 12 ÷ 2 = 6 cm." },
  // cm na mm
  { question: "Pravítko ukazuje 7 cm. Kolik je to milimetrů?", correct: "70 mm", distractors: ["7 mm", "700 mm", "17 mm"], hint: "1 cm = 10 mm. Kolik je 7 × 10?", solution: "7 cm = 7 × 10 = 70 mm." },
  { question: "Pravítko ukazuje 3 cm. Kolik je to milimetrů?", correct: "30 mm", distractors: ["3 mm", "300 mm", "13 mm"], hint: "1 cm = 10 mm. Kolik je 3 × 10?", solution: "3 cm = 3 × 10 = 30 mm." },
  // Rozdíl
  { question: "Úsečka AB = 9 cm a úsečka CD = 4 cm. Jaký je jejich rozdíl?", correct: "5 cm", distractors: ["3 cm", "6 cm", "13 cm"], hint: "Rozdíl = větší minus menší. Kolik je 9 − 4?", solution: "9 cm − 4 cm = 5 cm — AB je o 5 cm delší než CD." },
  { question: "Úsečka AB = 15 cm a úsečka CD = 8 cm. Jaký je jejich rozdíl?", correct: "7 cm", distractors: ["6 cm", "8 cm", "23 cm"], hint: "Rozdíl = větší minus menší. Kolik je 15 − 8?", solution: "15 cm − 8 cm = 7 cm — AB je o 7 cm delší než CD." },
  // Prodloužení a třetina
  { question: "Úsečka AB = 5 cm. Prodloužíme ji o 3 cm. Jak dlouhá bude celkem?", correct: "8 cm", distractors: ["7 cm", "9 cm", "6 cm"], hint: "Prodloužení = přidat délku. Kolik je 5 + 3?", solution: "5 cm + 3 cm = 8 cm — úsečka bude celkem 8 cm dlouhá." },
  { question: "Úsečka je 21 cm dlouhá. Kolik cm je třetina?", correct: "7 cm", distractors: ["5 cm", "6 cm", "9 cm"], hint: "Třetina = rozděl na 3 stejné části. Kolik je 21 ÷ 3?", solution: "Třetina z 21 cm = 21 ÷ 3 = 7 cm." },
];

function gen(_level: number): PracticeTask[] {
  const shuffled = shuffle(POOL);
  return shuffled.slice(0, 20).map(item => {
    const opts = shuffle([item.correct, ...item.distractors].slice(0, 4));
    return {
      question: item.question,
      correctAnswer: item.correct,
      options: opts,
      hints: [item.hint],
      solutionSteps: [item.solution],
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
