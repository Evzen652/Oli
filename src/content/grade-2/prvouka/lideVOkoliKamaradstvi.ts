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
  { question: "Kamarádovi pomáháme. Pravda?", correct: true, emoji: "🤝" },
  { question: "Souseda zdravíme. Pravda?", correct: true, emoji: "👋" },
  { question: "Kamaráda posloucháme. Pravda?", correct: true, emoji: "👫" },
  { question: "Kamaráda ničíme. Pravda?", correct: false, emoji: "👫" },
  { question: "Sousedovi ubližujeme. Pravda?", correct: false, emoji: "🏘️" },
  { question: "S kamarádem se dělíme. Pravda?", correct: true, emoji: "🤝" },
  { question: "Kamaráda bereme za to, co je. Pravda?", correct: true, emoji: "👫" },
  { question: "Kamarádovi lžeme. Pravda?", correct: false, emoji: "👫" },
  { question: "Souseda zdravíme dobrý den. Pravda?", correct: true, emoji: "👋" },
  { question: "Kamarádovi pomůžeme, když pláče. Pravda?", correct: true, emoji: "🤝" },
  { question: "Kamaráda strkáme. Pravda?", correct: false, emoji: "👫" },
  { question: "S kamarády si hrajeme. Pravda?", correct: true, emoji: "👫" },
  { question: "Sousedovi pomůžeme nést tašku. Pravda?", correct: true, emoji: "🛍️" },
  { question: "Kamarádovi bereme hračky. Pravda?", correct: false, emoji: "🧸" },
  { question: "Kamarády máme rádi. Pravda?", correct: true, emoji: "❤️" },
  { question: "Souseda zlobíme. Pravda?", correct: false, emoji: "🏘️" },
  { question: "Kamarádovi přejeme dobře. Pravda?", correct: true, emoji: "🤝" },
  { question: "S kamarádem se hádáme stále. Pravda?", correct: false, emoji: "👫" },
  { question: "Sousedovi se usmíváme. Pravda?", correct: true, emoji: "😊" },
  { question: "Kamarádovi pomáháme s úkolem. Pravda?", correct: true, emoji: "📚" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? "Pravda" : "Nepravda",
    options: ["Pravda", "Nepravda"],
    emoji: item.emoji,
    hints: ["Ke kamarádům a sousedům jsme hodní."],
    solutionSteps: [item.correct ? "Ano, je to pravda." : "Ne, není to pravda."],
  }));
}

export const LIDEVOKOLIKAMARADSTVI: TopicMetadata[] = [
  {
    id: "g2-prv-sousedstvi",
    rvpNodeId: "g2-prvouka-lide-kolem-nas-souziti-lidi-lide-v-okoli-sousedstvi-kamaradstvi",
    title: "Lidé v okolí, sousedství, kamarádství",
    studentTitle: "Kamarádi a sousedé",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití lidí",
    briefDescription: "Jak se chováme ke kamarádům a sousedům.",
    keywords: ["kamarád", "soused", "kamarádství", "pomoc", "soužití"],
    goals: [
      "Vědět, jak se chovat ke kamarádům.",
      "Umět pomoci sousedovi.",
      "Rozlišit dobré a špatné chování.",
    ],
    boundaries: ["Pouze základy soužití.", "Bez složitých vztahů."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Ke kamarádům a sousedům jsme hodní a pomáháme jim.",
      steps: ["Přečti větu.", "Je to hezké chování, nebo ošklivé?"],
      commonMistake: "Ubližování a ničení není dobré chování.",
      example: "Kamarádovi pomůžeme, když potřebuje — to je pravda.",
    },
  },
];
