import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pool of tasks for all levels
const POOL: Array<{ question: string; correct: string; hint: string; level: number }> = [
  // L1: kolikrát se číslo opakuje
  { question: "2 + 2 + 2 = 2 × ?", correct: "3", hint: "Kolikrát přičítáš 2?", level: 1 },
  { question: "3 + 3 + 3 + 3 = 3 × ?", correct: "4", hint: "Kolikrát přičítáš 3?", level: 1 },
  { question: "5 + 5 = 5 × ?", correct: "2", hint: "Kolikrát přičítáš 5?", level: 1 },
  { question: "4 + 4 + 4 = 4 × ?", correct: "3", hint: "Kolikrát přičítáš 4?", level: 1 },
  { question: "6 + 6 + 6 + 6 = 6 × ?", correct: "4", hint: "Kolikrát přičítáš 6?", level: 1 },
  { question: "10 + 10 = 10 × ?", correct: "2", hint: "Kolikrát přičítáš 10?", level: 1 },
  { question: "7 + 7 + 7 = 7 × ?", correct: "3", hint: "Kolikrát přičítáš 7?", level: 1 },
  { question: "2 + 2 + 2 + 2 + 2 = 2 × ?", correct: "5", hint: "Kolikrát přičítáš 2?", level: 1 },
  { question: "8 + 8 = 8 × ?", correct: "2", hint: "Kolikrát přičítáš 8?", level: 1 },
  { question: "3 + 3 = 3 × ?", correct: "2", hint: "Kolikrát přičítáš 3?", level: 1 },
  // L2: výsledek násobení (s nápovědou sčítání)
  { question: "4 × 3 = ?", correct: "12", hint: "4 + 4 + 4 = ?", level: 2 },
  { question: "2 × 5 = ?", correct: "10", hint: "2 + 2 + 2 + 2 + 2 = ?", level: 2 },
  { question: "3 × 4 = ?", correct: "12", hint: "3 + 3 + 3 + 3 = ?", level: 2 },
  { question: "5 × 3 = ?", correct: "15", hint: "5 + 5 + 5 = ?", level: 2 },
  { question: "6 × 2 = ?", correct: "12", hint: "6 + 6 = ?", level: 2 },
  { question: "2 × 4 = ?", correct: "8", hint: "2 + 2 + 2 + 2 = ?", level: 2 },
  { question: "7 × 2 = ?", correct: "14", hint: "7 + 7 = ?", level: 2 },
  { question: "3 × 3 = ?", correct: "9", hint: "3 + 3 + 3 = ?", level: 2 },
  { question: "4 × 2 = ?", correct: "8", hint: "4 + 4 = ?", level: 2 },
  { question: "5 × 4 = ?", correct: "20", hint: "5 + 5 + 5 + 5 = ?", level: 2 },
  // L3: kombinace
  { question: "Kolik je 5 × 4?", correct: "20", hint: "5 + 5 + 5 + 5 = 20", level: 3 },
  { question: "Kolik je 3 × 6?", correct: "18", hint: "3 + 3 + 3 + 3 + 3 + 3 = 18", level: 3 },
  { question: "Kolik je 4 × 4?", correct: "16", hint: "4 + 4 + 4 + 4 = 16", level: 3 },
  { question: "Kolik je 2 × 9?", correct: "18", hint: "2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 = 18", level: 3 },
  { question: "Kolik je 6 × 3?", correct: "18", hint: "6 + 6 + 6 = 18", level: 3 },
  { question: "Kolik je 5 × 5?", correct: "25", hint: "5 + 5 + 5 + 5 + 5 = 25", level: 3 },
  { question: "Kolik je 7 × 3?", correct: "21", hint: "7 + 7 + 7 = 21", level: 3 },
  { question: "Kolik je 4 × 5?", correct: "20", hint: "4 + 4 + 4 + 4 + 4 = 20", level: 3 },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 3
    ? POOL
    : POOL.filter(t => t.level <= level);

  const shuffled = shuffle(pool);
  return shuffled.slice(0, 25).map(t => {
    const correct = Number(t.correct);
    const d1 = String(correct + 1);
    const d2 = String(correct - 1 > 0 ? correct - 1 : correct + 2);
    const d3 = String(correct + (level <= 2 ? t.level : 2));
    const opts = shuffle(
      [t.correct, d1, d2, d3].filter((v, i, a) => a.indexOf(v) === i && Number(v) > 0).slice(0, 4)
    );
    return {
      question: t.question,
      correctAnswer: t.correct,
      options: opts,
      hints: [t.hint],
      solutionSteps: [`${t.question.replace("?", t.correct)}`],
    };
  });
}

export const NASOBENIJAKO_OPAKOVANE_SCITANI: TopicMetadata[] = [
  {
    id: "g2-mat-nasobeni-opakovane",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-nasobeni-a-deleni-nasobeni-jako-opakovane-scitani",
    title: "Násobení jako opakované sčítání",
    studentTitle: "Násobení = sčítání",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobení a dělení",
    briefDescription: "Pochopíš, že násobení je opakované sčítání.",
    keywords: ["násobení", "opakované sčítání", "krát", "součin"],
    goals: [
      "Vysvětlit násobení jako opakované sčítání.",
      "Převést sčítání na zápis násobení.",
      "Spočítat jednoduchý součin přes sčítání.",
    ],
    boundaries: ["Násobitele do 10.", "Bez násobilky zpaměti — stačí sčítání."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Násobení = počítáš, kolikrát přičítáš stejné číslo.",
      steps: [
        "3 × 4 znamená: přičti 3 celkem 4krát.",
        "3 + 3 + 3 + 3 = 12",
        "Takže 3 × 4 = 12.",
      ],
      commonMistake: "Záměna pořadí: 3 × 4 a 4 × 3 dají stejný výsledek.",
      example: "2 + 2 + 2 = 2 × 3 = 6.",
    },
  },
];
