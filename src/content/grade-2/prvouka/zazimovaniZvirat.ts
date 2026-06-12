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
  { question: "Medvěd v zimě spí. Pravda?", correct: true, emoji: "🐻" },
  { question: "Ježek se ukládá k spánku. Pravda?", correct: true, emoji: "🦔" },
  { question: "Vlaštovka zůstává v zimě. Pravda?", correct: false, emoji: "🐦" },
  { question: "Vlaštovka odlétá do teplých krajů. Pravda?", correct: true, emoji: "🐦" },
  { question: "Veverka si dělá zásoby. Pravda?", correct: true, emoji: "🐿️" },
  { question: "Sýkorka přilétá ke krmítku. Pravda?", correct: true, emoji: "🐦" },
  { question: "Čáp v zimě létá u nás. Pravda?", correct: false, emoji: "🦢" },
  { question: "V zimě krmíme ptáky. Pravda?", correct: true, emoji: "🐦" },
  { question: "Žába v zimě spí. Pravda?", correct: true, emoji: "🐸" },
  { question: "Had je v zimě venku aktivní. Pravda?", correct: false, emoji: "🐍" },
  { question: "Zajíc má v zimě hustší srst. Pravda?", correct: true, emoji: "🐇" },
  { question: "Medvěd se v zimě koupe v řece. Pravda?", correct: false, emoji: "🐻" },
  { question: "Netopýr v zimě spí. Pravda?", correct: true, emoji: "🦇" },
  { question: "Ptáci u krmítka mají rádi semínka. Pravda?", correct: true, emoji: "🐦" },
  { question: "Liška si na zimu uloví méně. Pravda?", correct: true, emoji: "🦊" },
  { question: "Ježek si dělá pelíšek z listí. Pravda?", correct: true, emoji: "🦔" },
  { question: "Žába v zimě plave v rybníku. Pravda?", correct: false, emoji: "🐸" },
  { question: "Veverka přes zimu spí pořád. Pravda?", correct: false, emoji: "🐿️" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? "Pravda" : "Nepravda",
    options: ["Pravda", "Nepravda"],
    emoji: item.emoji,
    hints: ["Některá zvířata spí, jiná odlétají do tepla."],
    solutionSteps: [item.correct ? "Ano, je to pravda." : "Ne, není to pravda."],
  }));
}

export const ZAZIMOVANIZVIRAT: TopicMetadata[] = [
  {
    id: "g2-prv-zima-zvirata",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-podzim-a-v-zime-zazimovani-zvirat-ptaci-v-zime",
    title: "Zazimování zvířat, ptáci v zimě",
    studentTitle: "Zvířata v zimě",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na podzim a v zimě",
    briefDescription: "Jak zvířata přečkají zimu.",
    keywords: ["zima", "medvěd", "ježek", "spánek", "ptáci", "krmítko"],
    goals: [
      "Vědět, která zvířata v zimě spí.",
      "Znát, kteří ptáci odlétají.",
      "Vědět, že ptáky v zimě krmíme.",
    ],
    boundaries: ["Pouze běžná zvířata.", "Bez detailů o migraci."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Medvěd a ježek v zimě spí. Vlaštovka odlétá do tepla.",
      steps: ["Přečti větu.", "Co zvíře v zimě dělá?"],
      commonMistake: "Vlaštovka v zimě odlétá, nezůstává u nás.",
      example: "Ježek v zimě spí, vlaštovka odlétá do teplých krajů.",
    },
  },
];
