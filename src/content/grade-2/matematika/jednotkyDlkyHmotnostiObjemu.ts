import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface TrueFalseItem {
  question: string;
  correct: boolean;
}

const POOL: TrueFalseItem[] = [
  // Délka — pravda
  { question: "1 m = 100 cm. Pravda?", correct: true },
  { question: "2 m = 200 cm. Pravda?", correct: true },
  { question: "5 m = 500 cm. Pravda?", correct: true },
  { question: "100 cm = 1 m. Pravda?", correct: true },
  // Délka — nepravda
  { question: "1 m = 10 cm. Pravda?", correct: false },
  { question: "2 m = 20 cm. Pravda?", correct: false },
  { question: "50 cm = 1 m. Pravda?", correct: false },
  { question: "3 m = 30 cm. Pravda?", correct: false },
  // Hmotnost — pravda
  { question: "1 kg = 1000 g. Pravda?", correct: true },
  { question: "2 kg = 2000 g. Pravda?", correct: true },
  { question: "1000 g = 1 kg. Pravda?", correct: true },
  // Hmotnost — nepravda
  { question: "1 kg = 100 g. Pravda?", correct: false },
  { question: "500 g = 1 kg. Pravda?", correct: false },
  { question: "2 kg = 200 g. Pravda?", correct: false },
  // Objem — pravda
  { question: "1 l = 10 dl. Pravda?", correct: true },
  { question: "2 l = 20 dl. Pravda?", correct: true },
  { question: "10 dl = 1 l. Pravda?", correct: true },
  // Objem — nepravda
  { question: "1 l = 100 dl. Pravda?", correct: false },
  { question: "1 l = 1 dl. Pravda?", correct: false },
  { question: "5 dl = 1 l. Pravda?", correct: false },
  { question: "2 l = 2 dl. Pravda?", correct: false },
];

function gen(_level: number): PracticeTask[] {
  const shuffled = shuffle(POOL);
  return shuffled.slice(0, 20).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? "Pravda" : "Nepravda",
    options: ["Pravda", "Nepravda"],
    hints: [`Vzpomeň si: 1 m = 100 cm, 1 kg = 1000 g, 1 l = 10 dl.`],
    solutionSteps: [item.correct ? "Ano, je to pravda." : "Ne, to není správně."],
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
