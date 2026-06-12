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
  { question: "Zuby si čistíme. Pravda?", correct: true, emoji: "🦷" },
  { question: "Spánek je důležitý. Pravda?", correct: true, emoji: "😴" },
  { question: "Pijeme málo vody. Pravda?", correct: false, emoji: "💧" },
  { question: "Ovoce je zdravé. Pravda?", correct: true, emoji: "🍎" },
  { question: "Pohyb je zdravý. Pravda?", correct: true, emoji: "🏃" },
  { question: "Myjeme si ruce před jídlem. Pravda?", correct: true, emoji: "🧼" },
  { question: "Celý den jíme jen bonbony. Pravda?", correct: false, emoji: "🍬" },
  { question: "Zelenina je zdravá. Pravda?", correct: true, emoji: "🥦" },
  { question: "Spíme jen jednu hodinu. Pravda?", correct: false, emoji: "😴" },
  { question: "Venku si hrajeme a běháme. Pravda?", correct: true, emoji: "⚽" },
  { question: "Pijeme hodně vody. Pravda?", correct: true, emoji: "💧" },
  { question: "Sedíme celý den u televize. Pravda?", correct: false, emoji: "📺" },
  { question: "Po jídle si čistíme zuby. Pravda?", correct: true, emoji: "🦷" },
  { question: "Ráno snídáme. Pravda?", correct: true, emoji: "🍞" },
  { question: "Odpočinek tělu škodí. Pravda?", correct: false, emoji: "😴" },
  { question: "Sport posiluje tělo. Pravda?", correct: true, emoji: "🏃" },
  { question: "Nikdy se nemyjeme. Pravda?", correct: false, emoji: "🚿" },
  { question: "Mrkev je zdravá. Pravda?", correct: true, emoji: "🥕" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? "Pravda" : "Nepravda",
    options: ["Pravda", "Nepravda"],
    emoji: item.emoji,
    hints: ["Zdravě žijeme: jíme ovoce, hýbeme se, spíme."],
    solutionSteps: [item.correct ? "Ano, je to pravda." : "Ne, není to pravda."],
  }));
}

export const ZDRAVYZIVOTNISTYL: TopicMetadata[] = [
  {
    id: "g2-prv-zdravy-styl",
    rvpNodeId: "g2-prvouka-clovek-a-jeho-zdravi-zdravy-zivotni-styl-pohyb-odpocinek-spanek-pitny-rezim",
    title: "Zdravý životní styl – pohyb, odpočinek, spánek, pitný režim",
    studentTitle: "Zdravý život",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Zdravý životní styl",
    briefDescription: "Jak žít zdravě a pečovat o tělo.",
    keywords: ["zdraví", "pohyb", "spánek", "voda", "ovoce", "hygiena"],
    goals: [
      "Vědět, co je zdravé pro tělo.",
      "Znát význam spánku, pohybu a pití.",
      "Rozlišit zdravé a nezdravé návyky.",
    ],
    boundaries: ["Pouze základní návyky.", "Bez výživových tabulek."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Zdravě žijeme: jíme ovoce, hýbeme se, pijeme vodu a spíme.",
      steps: ["Přečti větu.", "Je to zdravé, nebo ne?"],
      commonMistake: "Málo vody a jen bonbony nejsou zdravé.",
      example: "Ovoce je zdravé, pohyb posiluje tělo, spánek je důležitý.",
    },
  },
];
