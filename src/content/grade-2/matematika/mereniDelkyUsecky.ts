import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * PED-3 kalibrace L1<L2<L3.
 *
 * Před: `gen(_level)` ignoroval úroveň → L1==L2==L3, `getTierTasks` (rozdíl
 * množin) L2 i L3 vyprazdňoval. Audit `20/0/0 max L1`.
 *
 * Teď disjunktní pooly:
 *  L1 — porovnávání „která je delší/kratší" (základ, malá čísla).
 *  L2 — součet a rozdíl 2 úseček + polovina (aplikace znalosti sčítání).
 *  L3 — převody cm↔mm, třetina, prodloužení, dvoukrokové slovní úlohy.
 */

interface PoolItem {
  question: string;
  correct: string;
  distractors: string[];
  hint: string;
  solution: string;
}

const POOL_L1: PoolItem[] = [
  { question: "Která úsečka je delší: 5 cm nebo 8 cm?", correct: "8 cm", distractors: ["5 cm", "3 cm", "10 cm"], hint: "Srovnej čísla: 5 a 8 — které je větší?", solution: "8 cm je delší — 8 je větší než 5." },
  { question: "Která úsečka je delší: 12 cm nebo 7 cm?", correct: "12 cm", distractors: ["7 cm", "10 cm", "15 cm"], hint: "Srovnej čísla: 12 a 7 — které je větší?", solution: "12 cm je delší — 12 je větší než 7." },
  { question: "Která úsečka je kratší: 4 cm nebo 9 cm?", correct: "4 cm", distractors: ["9 cm", "6 cm", "2 cm"], hint: "Srovnej čísla: 4 a 9 — které je menší?", solution: "4 cm je kratší — 4 je menší než 9." },
  { question: "Která úsečka je kratší: 15 cm nebo 6 cm?", correct: "6 cm", distractors: ["15 cm", "10 cm", "8 cm"], hint: "Srovnej čísla: 15 a 6 — které je menší?", solution: "6 cm je kratší — 6 je menší než 15." },
  { question: "Která úsečka je delší: 2 cm nebo 11 cm?", correct: "11 cm", distractors: ["2 cm", "5 cm", "9 cm"], hint: "Srovnej čísla: 2 a 11 — které je větší?", solution: "11 cm je delší — 11 je větší než 2." },
  { question: "Která úsečka je kratší: 13 cm nebo 3 cm?", correct: "3 cm", distractors: ["13 cm", "5 cm", "8 cm"], hint: "Srovnej čísla: 13 a 3 — které je menší?", solution: "3 cm je kratší — 3 je menší než 13." },
  { question: "Která úsečka je delší: 14 cm nebo 9 cm?", correct: "14 cm", distractors: ["9 cm", "10 cm", "12 cm"], hint: "Srovnej čísla: 14 a 9.", solution: "14 cm je delší — 14 je větší než 9." },
  { question: "Která úsečka je stejně dlouhá jako 6 cm?", correct: "6 cm", distractors: ["4 cm", "7 cm", "5 cm"], hint: "Hledej stejnou hodnotu.", solution: "Stejná délka je 6 cm — je to totéž číslo." },
];

const POOL_L2: PoolItem[] = [
  // Součet 2 úseček
  { question: "Úsečka AB = 4 cm a BC = 3 cm. Jak dlouhá je úsečka AC?", correct: "7 cm", distractors: ["6 cm", "8 cm", "5 cm"], hint: "AC = AB + BC. Kolik je 4 + 3?", solution: "AC = AB + BC = 4 cm + 3 cm = 7 cm." },
  { question: "Úsečka AB = 6 cm a BC = 5 cm. Jak dlouhá je úsečka AC?", correct: "11 cm", distractors: ["10 cm", "12 cm", "9 cm"], hint: "AC = AB + BC. Kolik je 6 + 5?", solution: "AC = AB + BC = 6 cm + 5 cm = 11 cm." },
  { question: "Úsečka AB = 8 cm a BC = 2 cm. Jak dlouhá je úsečka AC?", correct: "10 cm", distractors: ["6 cm", "12 cm", "9 cm"], hint: "AC = AB + BC. Kolik je 8 + 2?", solution: "AC = AB + BC = 8 cm + 2 cm = 10 cm." },
  { question: "Úsečka AB = 3 cm a BC = 7 cm. Jak dlouhá je úsečka AC?", correct: "10 cm", distractors: ["4 cm", "9 cm", "11 cm"], hint: "AC = AB + BC. Kolik je 3 + 7?", solution: "AC = AB + BC = 3 cm + 7 cm = 10 cm." },
  { question: "Úsečka AB = 5 cm a BC = 5 cm. Jak dlouhá je úsečka AC?", correct: "10 cm", distractors: ["5 cm", "8 cm", "12 cm"], hint: "AC = AB + BC. Kolik je 5 + 5?", solution: "AC = AB + BC = 5 cm + 5 cm = 10 cm." },
  // Polovina úsečky
  { question: "Úsečka je 10 cm dlouhá. Kolik cm je polovina?", correct: "5 cm", distractors: ["4 cm", "6 cm", "8 cm"], hint: "Polovina = rozděl na 2 stejné části. Kolik je 10 ÷ 2?", solution: "Polovina z 10 cm = 10 ÷ 2 = 5 cm." },
  { question: "Úsečka je 8 cm dlouhá. Kolik cm je polovina?", correct: "4 cm", distractors: ["3 cm", "5 cm", "6 cm"], hint: "Polovina = rozděl na 2 stejné části. Kolik je 8 ÷ 2?", solution: "Polovina z 8 cm = 8 ÷ 2 = 4 cm." },
  { question: "Úsečka je 6 cm dlouhá. Kolik cm je polovina?", correct: "3 cm", distractors: ["2 cm", "4 cm", "5 cm"], hint: "Polovina = rozděl na 2 stejné části. Kolik je 6 ÷ 2?", solution: "Polovina z 6 cm = 6 ÷ 2 = 3 cm." },
  { question: "Úsečka je 12 cm dlouhá. Kolik cm je polovina?", correct: "6 cm", distractors: ["5 cm", "7 cm", "4 cm"], hint: "Polovina = rozděl na 2 stejné části. Kolik je 12 ÷ 2?", solution: "Polovina z 12 cm = 12 ÷ 2 = 6 cm." },
  // Rozdíl 2 úseček
  { question: "Úsečka AB = 9 cm a úsečka CD = 4 cm. Jaký je jejich rozdíl?", correct: "5 cm", distractors: ["3 cm", "6 cm", "13 cm"], hint: "Rozdíl = větší minus menší. Kolik je 9 − 4?", solution: "9 cm − 4 cm = 5 cm — AB je o 5 cm delší než CD." },
  { question: "Úsečka AB = 15 cm a úsečka CD = 8 cm. Jaký je jejich rozdíl?", correct: "7 cm", distractors: ["6 cm", "8 cm", "23 cm"], hint: "Rozdíl = větší minus menší. Kolik je 15 − 8?", solution: "15 cm − 8 cm = 7 cm — AB je o 7 cm delší než CD." },
];

const POOL_L3: PoolItem[] = [
  // Převody cm ↔ mm
  { question: "Která úsečka je delší: 3 cm nebo 30 mm?", correct: "stejně dlouhé", distractors: ["3 cm", "30 mm", "20 mm"], hint: "Převeď na stejnou jednotku: 1 cm = 10 mm. Kolik mm je 3 cm?", solution: "3 cm = 30 mm — obě úsečky jsou stejně dlouhé." },
  { question: "Pravítko ukazuje 7 cm. Kolik je to milimetrů?", correct: "70 mm", distractors: ["7 mm", "700 mm", "17 mm"], hint: "1 cm = 10 mm. Kolik je 7 × 10?", solution: "7 cm = 7 × 10 = 70 mm." },
  { question: "Pravítko ukazuje 3 cm. Kolik je to milimetrů?", correct: "30 mm", distractors: ["3 mm", "300 mm", "13 mm"], hint: "1 cm = 10 mm. Kolik je 3 × 10?", solution: "3 cm = 3 × 10 = 30 mm." },
  { question: "Která úsečka je delší: 5 cm nebo 40 mm?", correct: "5 cm", distractors: ["40 mm", "stejně dlouhé", "45 mm"], hint: "Převeď: 5 cm = ? mm. Pak porovnej.", solution: "5 cm = 50 mm > 40 mm — 5 cm je delší." },
  { question: "Kolik mm má 6 cm?", correct: "60 mm", distractors: ["6 mm", "16 mm", "600 mm"], hint: "1 cm = 10 mm.", solution: "6 cm = 6 × 10 = 60 mm." },
  // Prodloužení + dvoukrok
  { question: "Úsečka AB = 5 cm. Prodloužíme ji o 3 cm. Jak dlouhá bude celkem?", correct: "8 cm", distractors: ["7 cm", "9 cm", "6 cm"], hint: "Prodloužení = přidat délku. Kolik je 5 + 3?", solution: "5 cm + 3 cm = 8 cm — úsečka bude celkem 8 cm dlouhá." },
  { question: "Úsečka je 9 cm. Zkrátíme ji o 4 cm. Kolik cm zbývá?", correct: "5 cm", distractors: ["4 cm", "6 cm", "13 cm"], hint: "Zkrátíme = odečteme. Kolik je 9 − 4?", solution: "9 cm − 4 cm = 5 cm — úsečka bude 5 cm dlouhá." },
  // Třetina
  { question: "Úsečka je 21 cm dlouhá. Kolik cm je třetina?", correct: "7 cm", distractors: ["5 cm", "6 cm", "9 cm"], hint: "Třetina = rozděl na 3 stejné části. Kolik je 21 ÷ 3?", solution: "Třetina z 21 cm = 21 ÷ 3 = 7 cm." },
  { question: "Úsečka je 15 cm dlouhá. Kolik cm je třetina?", correct: "5 cm", distractors: ["3 cm", "6 cm", "7 cm"], hint: "Třetina = rozděl na 3 stejné části. 15 ÷ 3 = ?", solution: "Třetina z 15 cm = 15 ÷ 3 = 5 cm." },
  // Slovní úlohy dvoukrokové
  { question: "Máme 3 úsečky za sebou, každá 4 cm. Jak dlouhá je celá?", correct: "12 cm", distractors: ["4 cm", "7 cm", "16 cm"], hint: "3 × 4 = ?", solution: "3 × 4 cm = 12 cm — celá úsečka má 12 cm." },
  { question: "Úsečka AB = 6 cm. Úsečka CD je dvakrát delší. Kolik cm má CD?", correct: "12 cm", distractors: ["3 cm", "8 cm", "16 cm"], hint: "Dvakrát delší = 2 × 6.", solution: "CD = 2 × 6 cm = 12 cm." },
  { question: "Součet dvou úseček je 20 cm. Jedna měří 8 cm. Kolik měří druhá?", correct: "12 cm", distractors: ["10 cm", "28 cm", "16 cm"], hint: "Druhá = celek − první. 20 − 8 = ?", solution: "20 cm − 8 cm = 12 cm — druhá úsečka měří 12 cm." },
];

function pick(pool: PoolItem[]): PracticeTask[] {
  return shuffle(pool).map((item) => {
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

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
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
      "Řešit jednoduché slovní úlohy s délkami.",
    ],
    boundaries: ["Délky do 30 cm.", "Pouze cm a mm."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Délky sečti jako čísla, jen přidej 'cm'. 1 cm = 10 mm.",
      steps: [
        "Přečti délky obou úseček.",
        "Sečti nebo odečti čísla (nebo převeď na stejnou jednotku).",
        "Přidej jednotku cm (nebo mm).",
      ],
      commonMistake: "Zapomenutí jednotky — výsledek musí mít 'cm' nebo 'mm'.",
      example: "AB = 4 cm, BC = 3 cm. AC = 4 + 3 = 7 cm.",
    },
  },
];
