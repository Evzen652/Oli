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
  level: number;
}

// Používá U+2212 (−) pro minus, stejně jako zbytek grade-2 matematiky.
const POOL: PoolItem[] = [
  // L1: sčítání bez přechodu přes desítku
  { question: "23 + 5 = ?", correct: "28", distractors: ["27", "29", "38"], hint: "23 má 2 desítky. Přidej 5 k trojce: 3 + 5 = ?", level: 1 },
  { question: "41 + 7 = ?", correct: "48", distractors: ["47", "49", "51"], hint: "41 má 4 desítky. Přidej 7 k jedničce: 1 + 7 = ?", level: 1 },
  { question: "35 + 4 = ?", correct: "39", distractors: ["38", "40", "45"], hint: "35 má 3 desítky. Přidej 4 k pětce: 5 + 4 = ?", level: 1 },
  { question: "62 + 6 = ?", correct: "68", distractors: ["67", "69", "72"], hint: "62 má 6 desítek. Přidej 6 k dvojce: 2 + 6 = ?", level: 1 },
  { question: "54 + 3 = ?", correct: "57", distractors: ["56", "58", "64"], hint: "54 má 5 desítek. Přidej 3 ke čtyřce: 4 + 3 = ?", level: 1 },
  // L1: odčítání bez přechodu
  { question: "48 − 5 = ?", correct: "43", distractors: ["42", "44", "53"], hint: "48 má 4 desítky. Odečti 5 od osmičky: 8 − 5 = ?", level: 1 },
  { question: "67 − 4 = ?", correct: "63", distractors: ["62", "64", "71"], hint: "67 má 6 desítek. Odečti 4 od sedmičky: 7 − 4 = ?", level: 1 },
  { question: "85 − 3 = ?", correct: "82", distractors: ["81", "83", "88"], hint: "85 má 8 desítek. Odečti 3 od pětky: 5 − 3 = ?", level: 1 },
  { question: "76 − 6 = ?", correct: "70", distractors: ["69", "71", "80"], hint: "76 má 7 desítek. Odečti 6 od šestky: 6 − 6 = ?", level: 1 },
  // L2: sčítání s přechodem přes desítku
  { question: "27 + 8 = ?", correct: "35", distractors: ["34", "36", "45"], hint: "27 + 3 = 30. Zbývá přidat ještě 5.", level: 2 },
  { question: "39 + 4 = ?", correct: "43", distractors: ["42", "44", "53"], hint: "39 + 1 = 40. Zbývá přidat ještě 3.", level: 2 },
  { question: "56 + 7 = ?", correct: "63", distractors: ["62", "64", "73"], hint: "56 + 4 = 60. Zbývá přidat ještě 3.", level: 2 },
  { question: "45 + 6 = ?", correct: "51", distractors: ["50", "52", "61"], hint: "45 + 5 = 50. Zbývá přidat ještě 1.", level: 2 },
  { question: "38 + 5 = ?", correct: "43", distractors: ["42", "44", "33"], hint: "38 + 2 = 40. Zbývá přidat ještě 3.", level: 2 },
  // L2: odčítání s přechodem
  { question: "42 − 5 = ?", correct: "37", distractors: ["36", "38", "47"], hint: "42 − 2 = 40. Ještě odečti 3 od 40.", level: 2 },
  { question: "53 − 7 = ?", correct: "46", distractors: ["45", "47", "56"], hint: "53 − 3 = 50. Ještě odečti 4 od 50.", level: 2 },
  { question: "61 − 4 = ?", correct: "57", distractors: ["56", "58", "65"], hint: "61 − 1 = 60. Ještě odečti 3 od 60.", level: 2 },
  { question: "74 − 8 = ?", correct: "66", distractors: ["65", "67", "76"], hint: "74 − 4 = 70. Ještě odečti 4 od 70.", level: 2 },
  { question: "31 − 6 = ?", correct: "25", distractors: ["24", "26", "35"], hint: "31 − 1 = 30. Ještě odečti 5 od 30.", level: 2 },
  // L3: větší čísla
  { question: "45 + 38 = ?", correct: "83", distractors: ["81", "85", "73"], hint: "45 + 5 = 50, pak 50 + 33 = ?", level: 3 },
  { question: "63 + 29 = ?", correct: "92", distractors: ["90", "94", "82"], hint: "63 + 7 = 70, pak 70 + 22 = ?", level: 3 },
  { question: "57 + 26 = ?", correct: "83", distractors: ["80", "86", "73"], hint: "57 + 3 = 60, pak 60 + 23 = ?", level: 3 },
  { question: "71 − 34 = ?", correct: "37", distractors: ["35", "39", "47"], hint: "71 − 1 = 70, pak 70 − 33 = ?", level: 3 },
  { question: "86 − 48 = ?", correct: "38", distractors: ["36", "40", "48"], hint: "86 − 6 = 80, pak 80 − 42 = ?", level: 3 },
  { question: "92 − 35 = ?", correct: "57", distractors: ["55", "59", "67"], hint: "92 − 2 = 90, pak 90 − 33 = ?", level: 3 },
  { question: "64 + 27 = ?", correct: "91", distractors: ["89", "93", "81"], hint: "64 + 6 = 70, pak 70 + 21 = ?", level: 3 },
];

function gen(level: number): PracticeTask[] {
  const filtered = POOL.filter(item => item.level <= level);
  const shuffled = shuffle(filtered);
  return shuffled.slice(0, 20).map(item => ({
    question: item.question,
    correctAnswer: item.correct,
    options: shuffle([item.correct, ...item.distractors]),
    hints: [item.hint],
    solutionSteps: [`${item.question.replace("?", item.correct)}`],
  }));
}

export const SCITANIAODCITANIDO100: TopicMetadata[] = [
  {
    id: "g2-mat-scitani-odcitani-100",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-ciselny-obor-0-100-scitani-a-odcitani-do-100-bez-i-s-prechodem-desitky",
    title: "Sčítání a odčítání do 100 (bez i s přechodem desítky)",
    studentTitle: "Počítám do 100",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–100",
    briefDescription: "Sčítáš a odčítáš čísla do 100.",
    keywords: ["sčítání", "odčítání", "do 100", "plus", "mínus", "počítání"],
    goals: [
      "Sčítat a odčítat čísla do 100 bez přechodu přes desítku.",
      "Sčítat a odčítat čísla do 100 s přechodem přes desítku.",
      "Rychle počítat v oboru do 100.",
    ],
    boundaries: ["Pouze čísla do 100.", "Nezahrnuje násobení ani dělení."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Počítej po desítkách, pak doplň jedničky.",
      steps: [
        "Rozlož číslo na desítky a jedničky (např. 27 = 20 + 7).",
        "Přičítej nebo odečítej desítky jako první.",
        "Pak přičítej nebo odečítej jedničky.",
      ],
      commonMistake: "Zapomenutí přechodu přes desítku — zkontroluj výsledek.",
      example: "27 + 6: 27 + 3 = 30, pak 30 + 3 = 33.",
    },
  },
];
