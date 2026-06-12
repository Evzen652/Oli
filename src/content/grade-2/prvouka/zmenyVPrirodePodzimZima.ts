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
  emoji: string;
}

const POOL: TrueFalseItem[] = [
  { question: "Na podzim padá listí. Pravda?", correct: true, emoji: "🍂" },
  { question: "V zimě padá sníh. Pravda?", correct: true, emoji: "❄️" },
  { question: "V zimě kvetou stromy. Pravda?", correct: false, emoji: "🌳" },
  { question: "Na podzim sklízíme jablka. Pravda?", correct: true, emoji: "🍎" },
  { question: "V zimě je zima. Pravda?", correct: true, emoji: "❄️" },
  { question: "Na podzim je horko jako v létě. Pravda?", correct: false, emoji: "🍂" },
  { question: "V zimě zamrzá rybník. Pravda?", correct: true, emoji: "⛸️" },
  { question: "Na podzim listí žloutne. Pravda?", correct: true, emoji: "🍁" },
  { question: "V zimě nosíme čepici. Pravda?", correct: true, emoji: "🧢" },
  { question: "V zimě se koupeme v rybníku. Pravda?", correct: false, emoji: "❄️" },
  { question: "Na podzim fouká vítr. Pravda?", correct: true, emoji: "🍂" },
  { question: "V zimě stavíme sněhuláka. Pravda?", correct: true, emoji: "⛄" },
  { question: "Na podzim sbíráme houby. Pravda?", correct: true, emoji: "🍄" },
  { question: "V zimě dozrávají jahody. Pravda?", correct: false, emoji: "❄️" },
  { question: "Na podzim sklízíme brambory. Pravda?", correct: true, emoji: "🥔" },
  { question: "V zimě jezdíme na saních. Pravda?", correct: true, emoji: "🛷" },
  { question: "Na podzim raší nové listí. Pravda?", correct: false, emoji: "🍂" },
  { question: "V zimě bývají krátké dny. Pravda?", correct: true, emoji: "🌙" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? "Pravda" : "Nepravda",
    options: ["Pravda", "Nepravda"],
    emoji: item.emoji,
    hints: ["Na podzim padá listí, v zimě padá sníh."],
    solutionSteps: [item.correct ? "Ano, je to pravda." : "Ne, není to pravda."],
  }));
}

export const ZMENYVPRIRODEPODZIMZIMA: TopicMetadata[] = [
  {
    id: "g2-prv-podzim-zima",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-podzim-a-v-zime-zmeny-v-prirode-podzim-zima",
    title: "Změny v přírodě – podzim a zima",
    studentTitle: "Podzim a zima",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na podzim a v zimě",
    briefDescription: "Co se děje v přírodě na podzim a v zimě.",
    keywords: ["podzim", "zima", "listí", "sníh", "příroda", "sklizeň"],
    goals: [
      "Vědět, co se děje v přírodě na podzim.",
      "Znát znaky zimy.",
      "Rozlišit podzim a zimu od jara a léta.",
    ],
    boundaries: ["Pouze podzim a zima.", "Bez jara a léta."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na podzim padá listí a sklízíme. V zimě padá sníh a je zima.",
      steps: ["Přečti větu.", "Děje se to na podzim nebo v zimě?"],
      commonMistake: "Stromy kvetou na jaře, ne v zimě.",
      example: "Na podzim padá listí, v zimě padá sníh.",
    },
  },
];
