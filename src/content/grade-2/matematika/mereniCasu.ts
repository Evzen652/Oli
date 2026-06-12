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
  { question: "1 hodina = ? minut", correct: "60", distractors: ["30", "100", "24"] },
  { question: "2 hodiny = ? minut", correct: "120", distractors: ["60", "200", "100"] },
  { question: "3 hodiny = ? minut", correct: "180", distractors: ["150", "200", "130"] },
  { question: "Půl hodiny = ? minut", correct: "30", distractors: ["15", "60", "45"] },
  { question: "Čtvrt hodiny = ? minut", correct: "15", distractors: ["30", "20", "10"] },
  { question: "60 minut = ? hodina", correct: "1", distractors: ["2", "6", "10"] },
  { question: "120 minut = ? hodiny", correct: "2", distractors: ["1", "3", "12"] },
  { question: "30 minut = ? hodiny", correct: "0,5", distractors: ["1", "3", "30"] },
  { question: "45 minut = ? čtvrthodiny", correct: "3", distractors: ["4", "2", "45"] },
  { question: "15 minut = ? čtvrthodina", correct: "1", distractors: ["2", "4", "15"] },
  { question: "Třičtvrtě hodiny = ? minut", correct: "45", distractors: ["30", "60", "40"] },
  { question: "1 den = ? hodin", correct: "24", distractors: ["12", "60", "48"] },
  { question: "Poledne je v ? hodin", correct: "12", distractors: ["11", "24", "6"] },
  { question: "Půlnoc je v ? hodin", correct: "0", distractors: ["12", "24", "6"] },
  { question: "1 minuta = ? sekund", correct: "60", distractors: ["100", "30", "10"] },
  { question: "2 minuty = ? sekund", correct: "120", distractors: ["60", "200", "20"] },
  { question: "1 hodina a 30 min = ? minut", correct: "90", distractors: ["130", "60", "80"] },
  { question: "2 hodiny a 15 min = ? minut", correct: "135", distractors: ["215", "120", "145"] },
  { question: "Škola začíná v 8:00. Přestávka za 45 min — v ? hod.", correct: "8:45", distractors: ["8:30", "9:00", "8:15"] },
];

function gen(_level: number): PracticeTask[] {
  const shuffled = shuffle(POOL);
  return shuffled.slice(0, 15).map(item => {
    const opts = shuffle([item.correct, ...item.distractors].slice(0, 4));
    return {
      question: item.question,
      correctAnswer: item.correct,
      options: opts,
      hints: [`Vzpomeň si na převody času: hodina, minuta, sekunda.`],
      solutionSteps: [`Odpověď: ${item.correct}`],
    };
  });
}

export const MERENICASU: TopicMetadata[] = [
  {
    id: "g2-mat-mereni-casu",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-mereni-a-jednotky-mereni-casu-hodina-minuta",
    title: "Měření času (hodina, minuta)",
    studentTitle: "Hodiny a minuty",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Měření a jednotky",
    briefDescription: "Poznáš, kolik minut má hodina a čtvrthodina.",
    keywords: ["čas", "hodina", "minuta", "půl hodiny", "čtvrthodina", "hodiny"],
    goals: [
      "Znát, že 1 hodina = 60 minut.",
      "Určit půl hodiny (30 min) a čtvrthodinu (15 min).",
      "Počítat s časovými údaji.",
    ],
    boundaries: ["Pouze hodiny a minuty.", "Bez sekund a složitých přepočtů."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "1 hodina = 60 minut. Půl hodiny = 30 minut. Čtvrt hodiny = 15 minut.",
      steps: [
        "1 hodina má 60 minut.",
        "Půl hodiny = 60 ÷ 2 = 30 minut.",
        "Čtvrt hodiny = 60 ÷ 4 = 15 minut.",
      ],
      commonMistake: "Záměna 30 a 15 — půl = 30, čtvrt = 15.",
      example: "2 hodiny = 2 × 60 = 120 minut.",
    },
  },
];
