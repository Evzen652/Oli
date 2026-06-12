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
  { question: "Na jaře kvetou květiny. Pravda?", correct: true, emoji: "🌷" },
  { question: "V létě je teplo. Pravda?", correct: true, emoji: "☀️" },
  { question: "Na jaře padá sníh. Pravda?", correct: false, emoji: "🌷" },
  { question: "V létě se koupeme. Pravda?", correct: true, emoji: "🏊" },
  { question: "Na jaře raší listí. Pravda?", correct: true, emoji: "🌱" },
  { question: "V létě nosíme čepici a rukavice. Pravda?", correct: false, emoji: "🧤" },
  { question: "Na jaře se vrací ptáci. Pravda?", correct: true, emoji: "🐦" },
  { question: "V létě jsou dlouhé dny. Pravda?", correct: true, emoji: "☀️" },
  { question: "Na jaře všechno usychá. Pravda?", correct: false, emoji: "🌷" },
  { question: "V létě dozrávají jahody. Pravda?", correct: true, emoji: "🍓" },
  { question: "Na jaře se rodí mláďata. Pravda?", correct: true, emoji: "🐣" },
  { question: "V létě zamrzá rybník. Pravda?", correct: false, emoji: "🏊" },
  { question: "Na jaře je tepleji než v zimě. Pravda?", correct: true, emoji: "🌷" },
  { question: "V létě svítí slunce dlouho. Pravda?", correct: true, emoji: "☀️" },
  { question: "Na jaře kvetou stromy. Pravda?", correct: true, emoji: "🌸" },
  { question: "V létě padá listí ze stromů. Pravda?", correct: false, emoji: "🌳" },
  { question: "V létě nosíme krátké tričko. Pravda?", correct: true, emoji: "👕" },
  { question: "Na jaře včely sbírají pyl. Pravda?", correct: true, emoji: "🐝" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? "Pravda" : "Nepravda",
    options: ["Pravda", "Nepravda"],
    emoji: item.emoji,
    hints: ["Na jaře vše roste, v létě je teplo."],
    solutionSteps: [item.correct ? "Ano, je to pravda." : "Ne, není to pravda."],
  }));
}

export const ZMENYVPRIRODEJAROLETO: TopicMetadata[] = [
  {
    id: "g2-prv-jaro-leto",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-jare-a-v-lete-zmeny-v-prirode-jaro-leto",
    title: "Změny v přírodě – jaro a léto",
    studentTitle: "Jaro a léto",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na jaře a v létě",
    briefDescription: "Co se děje v přírodě na jaře a v létě.",
    keywords: ["jaro", "léto", "květiny", "teplo", "příroda", "ptáci"],
    goals: [
      "Vědět, co se děje v přírodě na jaře.",
      "Znát znaky léta.",
      "Rozlišit jaro a léto od ostatních období.",
    ],
    boundaries: ["Pouze jaro a léto.", "Bez podzimu a zimy."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na jaře vše kvete a roste, v létě je teplo a sluní.",
      steps: ["Přečti větu.", "Děje se to na jaře nebo v létě?"],
      commonMistake: "Sníh patří do zimy, ne na jaro.",
      example: "Na jaře kvetou květiny, v létě se koupeme.",
    },
  },
];
