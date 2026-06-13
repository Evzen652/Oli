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
  correct: boolean;
  hint: string;
  solution: string;
}

const POOL: PoolItem[] = [
  // Délka — pravda
  { question: "1 m = 100 cm. Je to pravda?", correct: true, hint: "1 metr má 100 centimetrů.", solution: "1 metr = 100 centimetrů — je to pravda." },
  { question: "2 m = 200 cm. Je to pravda?", correct: true, hint: "1 metr má 100 centimetrů.", solution: "2 metry = 2 × 100 = 200 centimetrů — je to pravda." },
  { question: "5 m = 500 cm. Je to pravda?", correct: true, hint: "1 metr má 100 centimetrů.", solution: "5 metrů = 5 × 100 = 500 centimetrů — je to pravda." },
  { question: "100 cm = 1 m. Je to pravda?", correct: true, hint: "1 metr má 100 centimetrů.", solution: "100 centimetrů = 1 metr — je to pravda." },
  // Délka — nepravda
  { question: "1 m = 10 cm. Je to pravda?", correct: false, hint: "1 metr má 100 centimetrů.", solution: "1 metr = 100 centimetrů, ne 10. Takže to pravda není." },
  { question: "2 m = 20 cm. Je to pravda?", correct: false, hint: "1 metr má 100 centimetrů.", solution: "2 metry = 200 centimetrů, ne 20. Takže to pravda není." },
  { question: "50 cm = 1 m. Je to pravda?", correct: false, hint: "1 metr má 100 centimetrů.", solution: "1 metr = 100 centimetrů, ne 50. Takže to pravda není." },
  { question: "3 m = 30 cm. Je to pravda?", correct: false, hint: "1 metr má 100 centimetrů.", solution: "3 metry = 300 centimetrů, ne 30. Takže to pravda není." },
  // Hmotnost — pravda
  { question: "1 kg = 1000 g. Je to pravda?", correct: true, hint: "1 kilogram má 1000 gramů.", solution: "1 kilogram = 1000 gramů — je to pravda." },
  { question: "2 kg = 2000 g. Je to pravda?", correct: true, hint: "1 kilogram má 1000 gramů.", solution: "2 kilogramy = 2 × 1000 = 2000 gramů — je to pravda." },
  { question: "1000 g = 1 kg. Je to pravda?", correct: true, hint: "1 kilogram má 1000 gramů.", solution: "1000 gramů = 1 kilogram — je to pravda." },
  // Hmotnost — nepravda
  { question: "1 kg = 100 g. Je to pravda?", correct: false, hint: "1 kilogram má 1000 gramů.", solution: "1 kilogram = 1000 gramů, ne 100. Takže to pravda není." },
  { question: "500 g = 1 kg. Je to pravda?", correct: false, hint: "1 kilogram má 1000 gramů.", solution: "1 kilogram = 1000 gramů, ne 500. Takže to pravda není." },
  { question: "2 kg = 200 g. Je to pravda?", correct: false, hint: "1 kilogram má 1000 gramů.", solution: "2 kilogramy = 2000 gramů, ne 200. Takže to pravda není." },
  // Objem — pravda
  { question: "1 l = 10 dl. Je to pravda?", correct: true, hint: "1 litr má 10 decilitrů.", solution: "1 litr = 10 decilitrů — je to pravda." },
  { question: "2 l = 20 dl. Je to pravda?", correct: true, hint: "1 litr má 10 decilitrů.", solution: "2 litry = 2 × 10 = 20 decilitrů — je to pravda." },
  { question: "10 dl = 1 l. Je to pravda?", correct: true, hint: "1 litr má 10 decilitrů.", solution: "10 decilitrů = 1 litr — je to pravda." },
  // Objem — nepravda
  { question: "1 l = 100 dl. Je to pravda?", correct: false, hint: "1 litr má 10 decilitrů.", solution: "1 litr = 10 decilitrů, ne 100. Takže to pravda není." },
  { question: "1 l = 1 dl. Je to pravda?", correct: false, hint: "1 litr má 10 decilitrů.", solution: "1 litr = 10 decilitrů, ne 1. Takže to pravda není." },
  { question: "5 dl = 1 l. Je to pravda?", correct: false, hint: "1 litr má 10 decilitrů.", solution: "1 litr = 10 decilitrů, ne 5. Takže to pravda není." },
  { question: "2 l = 2 dl. Je to pravda?", correct: false, hint: "1 litr má 10 decilitrů.", solution: "2 litry = 20 decilitrů, ne 2. Takže to pravda není." },
];

const ANO = "Ano, to je pravda";
const NE = "Ne, to není pravda";

function gen(_level: number): PracticeTask[] {
  const shuffled = shuffle(POOL);
  return shuffled.slice(0, 20).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    hints: [item.hint],
    solutionSteps: [item.solution],
  }));
}

export const JEDNOTKYDLKYHMOTNOSTIOBJEMU: TopicMetadata[] = [
  {
    id: "g2-mat-jednotky",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-mereni-a-jednotky-jednotky-delky-cm-m-hmotnosti-kg-objemu-l",
    title: "Jednotky délky (cm, m), hmotnosti (kg) a objemu (l)",
    studentTitle: "Míry a váhy",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Měření a jednotky",
    briefDescription: "Poznáš vztahy mezi cm, m, kg a litry.",
    keywords: ["jednotky", "délka", "hmotnost", "objem", "cm", "metr", "kilogram", "litr"],
    goals: [
      "Znát vztah 1 m = 100 cm.",
      "Znát vztah 1 kg = 1000 g.",
      "Znát vztah 1 l = 10 dl.",
    ],
    boundaries: ["Pouze základní vztahy cm/m, kg/g, l/dl.", "Bez přepočtů složitějších hodnot."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Zapamatuj si: 1 m = 100 cm, 1 kg = 1000 g, 1 l = 10 dl.",
      steps: [
        "1 metr má 100 centimetrů.",
        "1 kilogram má 1000 gramů.",
        "1 litr má 10 decilitrů.",
      ],
      commonMistake: "Záměna 100 a 1000 — metr má 100 cm, ale kilogram má 1000 g.",
      example: "2 m = 200 cm (2 × 100). 3 kg = 3000 g (3 × 1000).",
    },
  },
];
