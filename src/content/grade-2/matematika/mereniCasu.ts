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
  { question: "Kolik minut má 1 hodina?", correct: "60", distractors: ["30", "100", "24"], hint: "Na hodinách je 60 dílků — každý dílek je 1 minuta.", solution: "1 hodina má 60 minut — ručičky projdou všech 60 dílků." },
  { question: "Kolik minut mají 2 hodiny?", correct: "120", distractors: ["60", "200", "100"], hint: "1 hodina = 60 minut. Kolik je 2 × 60?", solution: "2 hodiny = 2 × 60 = 120 minut." },
  { question: "Kolik minut mají 3 hodiny?", correct: "180", distractors: ["150", "200", "130"], hint: "1 hodina = 60 minut. Kolik je 3 × 60?", solution: "3 hodiny = 3 × 60 = 180 minut." },
  { question: "Kolik minut je půl hodiny?", correct: "30", distractors: ["15", "60", "45"], hint: "Půl hodiny = polovina z 60 minut. Kolik je 60 ÷ 2?", solution: "Půl hodiny = 60 ÷ 2 = 30 minut." },
  { question: "Kolik minut je čtvrt hodiny?", correct: "15", distractors: ["30", "20", "10"], hint: "Čtvrt hodiny = čtvrtina z 60 minut. Kolik je 60 ÷ 4?", solution: "Čtvrt hodiny = 60 ÷ 4 = 15 minut." },
  { question: "60 minut je kolik hodin?", correct: "1", distractors: ["2", "6", "10"], hint: "1 hodina = 60 minut. Takže 60 minut = právě 1 hodina.", solution: "60 minut = 1 hodina — ručičky udělaly celé kolo." },
  { question: "120 minut je kolik hodin?", correct: "2", distractors: ["1", "3", "12"], hint: "1 hodina = 60 minut. Kolikrát se vejde 60 do 120?", solution: "120 minut = 2 hodiny, protože 2 × 60 = 120." },
  { question: "30 minut je...?", correct: "půl hodiny", distractors: ["čtvrt hodiny", "celá hodina", "třičtvrtě hodiny"], hint: "30 minut = polovina z 60 minut. Jak se říká polovině hodiny?", solution: "30 minut = půl hodiny — to je polovina z 60 minut." },
  { question: "45 minut je kolik čtvrtin hodiny?", correct: "3", distractors: ["4", "2", "45"], hint: "Každá čtvrthodina má 15 minut. Kolikrát se vejde 15 do 45?", solution: "45 minut = 3 čtvrthodiny, protože 3 × 15 = 45." },
  { question: "15 minut je kolik čtvrtin hodiny?", correct: "1", distractors: ["2", "4", "15"], hint: "1 čtvrthodina = 15 minut. Kolik čtvrtin je 15 minut?", solution: "15 minut = 1 čtvrthodina." },
  { question: "Kolik minut je třičtvrtě hodiny?", correct: "45", distractors: ["30", "60", "40"], hint: "Třičtvrtě = 3 čtvrthodiny. Každá má 15 minut. Kolik je 3 × 15?", solution: "Třičtvrtě hodiny = 3 × 15 = 45 minut." },
  { question: "Kolik hodin má 1 den?", correct: "24", distractors: ["12", "60", "48"], hint: "Den má část denní a část noční — dohromady 24 hodin.", solution: "1 den má 24 hodin — 12 hodin dne a 12 hodin noci." },
  { question: "Ve kolik hodin je poledne?", correct: "12", distractors: ["11", "24", "6"], hint: "Poledne je uprostřed dne — kdy je slunce nejvýš?", solution: "Poledne je v 12 hodin — přesně uprostřed dne." },
  { question: "Ve kolik hodin je půlnoc?", correct: "0", distractors: ["12", "24", "6"], hint: "Půlnoc je uprostřed noci — na hranici mezi dvěma dny.", solution: "Půlnoc je v 0 hodin — začíná nový den." },
  { question: "Kolik sekund má 1 minuta?", correct: "60", distractors: ["100", "30", "10"], hint: "Minuta má stejný počet sekund jako hodina má minut.", solution: "1 minuta má 60 sekund." },
  { question: "Kolik sekund mají 2 minuty?", correct: "120", distractors: ["60", "200", "20"], hint: "1 minuta = 60 sekund. Kolik je 2 × 60?", solution: "2 minuty = 2 × 60 = 120 sekund." },
  { question: "Kolik minut je 1 hodina a 30 minut?", correct: "90", distractors: ["130", "60", "80"], hint: "1 hodina = 60 minut. Přidej ještě 30 minut. Kolik je 60 + 30?", solution: "1 hodina = 60 minut, + 30 minut = 90 minut celkem." },
  { question: "Kolik minut jsou 2 hodiny a 15 minut?", correct: "135", distractors: ["215", "120", "145"], hint: "2 hodiny = 120 minut. Přidej ještě 15 minut. Kolik je 120 + 15?", solution: "2 hodiny = 120 minut, + 15 minut = 135 minut celkem." },
  { question: "Škola začíná v 8:00. Přestávka přijde za 45 minut. Ve kolik hodin je přestávka?", correct: "8:45", distractors: ["8:30", "9:00", "8:15"], hint: "8:00 + 45 minut — přidej 45 minut k osmé hodině.", solution: "8:00 + 45 minut = 8:45. Přestávka je ve čtvrt na devět." },
];

function gen(_level: number): PracticeTask[] {
  const shuffled = shuffle(POOL);
  return shuffled.slice(0, 15).map(item => {
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
