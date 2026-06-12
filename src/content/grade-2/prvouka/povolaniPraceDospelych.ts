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
  emoji: string;
}

const POOL: PoolItem[] = [
  { question: "Kdo hasí oheň?", correct: "Hasič", distractors: ["Pekař", "Učitel"], emoji: "👨‍🚒" },
  { question: "Kdo léčí lidi?", correct: "Lékař", distractors: ["Řidič", "Kuchař"], emoji: "👩‍⚕️" },
  { question: "Kdo učí děti?", correct: "Učitel", distractors: ["Hasič", "Pekař"], emoji: "👨‍🏫" },
  { question: "Kdo peče chleba?", correct: "Pekař", distractors: ["Lékař", "Policista"], emoji: "🍞" },
  { question: "Kdo vaří jídlo?", correct: "Kuchař", distractors: ["Učitel", "Hasič"], emoji: "👨‍🍳" },
  { question: "Kdo řídí autobus?", correct: "Řidič", distractors: ["Pekař", "Lékař"], emoji: "🚌" },
  { question: "Kdo chrání lidi?", correct: "Policista", distractors: ["Kuchař", "Pekař"], emoji: "👮" },
  { question: "Kdo roznáší dopisy?", correct: "Pošťák", distractors: ["Hasič", "Lékař"], emoji: "📬" },
  { question: "Kdo léčí zvířata?", correct: "Veterinář", distractors: ["Pekař", "Řidič"], emoji: "🐕" },
  { question: "Kdo stříhá vlasy?", correct: "Kadeřník", distractors: ["Kuchař", "Učitel"], emoji: "💇" },
  { question: "Kdo staví domy?", correct: "Zedník", distractors: ["Pekař", "Pošťák"], emoji: "🧱" },
  { question: "Kdo opravuje auta?", correct: "Mechanik", distractors: ["Lékař", "Učitel"], emoji: "🔧" },
  { question: "Kdo pěstuje obilí?", correct: "Zemědělec", distractors: ["Hasič", "Pekař"], emoji: "🚜" },
  { question: "Kdo prodává v obchodě?", correct: "Prodavač", distractors: ["Hasič", "Lékař"], emoji: "🏪" },
  { question: "Kdo hraje v divadle?", correct: "Herec", distractors: ["Pekař", "Řidič"], emoji: "🎭" },
  { question: "Kdo maluje obrazy?", correct: "Malíř", distractors: ["Kuchař", "Pošťák"], emoji: "🎨" },
  { question: "Kdo hasí požár?", correct: "Hasič", distractors: ["Učitel", "Kuchař"], emoji: "🚒" },
  { question: "Kdo opravuje zuby?", correct: "Zubař", distractors: ["Pekař", "Řidič"], emoji: "🦷" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: ["Mysli na to, co ten člověk dělá."],
      solutionSteps: [`Správně: ${item.correct}`],
    };
  });
}

export const POVOLANIPRACEDOSPELYCH: TopicMetadata[] = [
  {
    id: "g2-prv-povolani",
    rvpNodeId: "g2-prvouka-lide-kolem-nas-souziti-lidi-povolani-prace-dospelych",
    title: "Povolání a práce dospělých",
    studentTitle: "Povolání",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití lidí",
    briefDescription: "Poznáš různá povolání dospělých.",
    keywords: ["povolání", "práce", "hasič", "lékař", "učitel", "pekař"],
    goals: [
      "Poznat běžná povolání.",
      "Vědět, co kdo dělá.",
      "Vážit si práce dospělých.",
    ],
    boundaries: ["Pouze známá povolání.", "Bez detailů o práci."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Mysli na to, co ten člověk v práci dělá.",
      steps: ["Přečti otázku.", "Kdo tuhle práci dělá?"],
      commonMistake: "Záměna podobných povolání.",
      example: "Hasič hasí oheň, lékař léčí lidi.",
    },
  },
];
