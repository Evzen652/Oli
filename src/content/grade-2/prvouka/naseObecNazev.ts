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
  { question: "Praha je město. Pravda?", correct: true, emoji: "🏙️" },
  { question: "V obci je škola. Pravda?", correct: true, emoji: "🏫" },
  { question: "Obec nemá název. Pravda?", correct: false, emoji: "🏘️" },
  { question: "Každá obec má jméno. Pravda?", correct: true, emoji: "🏘️" },
  { question: "Vesnice je menší než město. Pravda?", correct: true, emoji: "🏡" },
  { question: "V obci bydlí lidé. Pravda?", correct: true, emoji: "🏘️" },
  { question: "Praha je vesnice. Pravda?", correct: false, emoji: "🏙️" },
  { question: "V obci jsou ulice. Pravda?", correct: true, emoji: "🛣️" },
  { question: "Obec nemá žádné domy. Pravda?", correct: false, emoji: "🏠" },
  { question: "V naší obci je obchod. Pravda?", correct: true, emoji: "🏪" },
  { question: "Město je větší než vesnice. Pravda?", correct: true, emoji: "🏙️" },
  { question: "V obci nejsou žádní lidé. Pravda?", correct: false, emoji: "🏘️" },
  { question: "Obec má svůj úřad. Pravda?", correct: true, emoji: "🏛️" },
  { question: "Ve městě je více lidí. Pravda?", correct: true, emoji: "🏙️" },
  { question: "Obec nemá ulice. Pravda?", correct: false, emoji: "🛣️" },
  { question: "V obci stojí domy. Pravda?", correct: true, emoji: "🏠" },
  { question: "Praha je hlavní město. Pravda?", correct: true, emoji: "🏰" },
  { question: "Vesnice je větší než město. Pravda?", correct: false, emoji: "🏡" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? "Pravda" : "Nepravda",
    options: ["Pravda", "Nepravda"],
    emoji: item.emoji,
    hints: ["Obec je místo, kde bydlíme — má jméno a domy."],
    solutionSteps: [item.correct ? "Ano, je to pravda." : "Ne, není to pravda."],
  }));
}

export const NASEOBECNAZEV: TopicMetadata[] = [
  {
    id: "g2-prv-nase-obec",
    rvpNodeId: "g2-prvouka-misto-kde-zijeme-obec-a-okoli-nase-obec-nazev-cast-obce-kde-ziji",
    title: "Naše obec, název, část obce kde žiji",
    studentTitle: "Naše obec",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Obec a okolí",
    briefDescription: "Poznáš svou obec a její jméno.",
    keywords: ["obec", "vesnice", "město", "název", "bydliště"],
    goals: [
      "Vědět, že obec má svůj název.",
      "Rozlišit město a vesnici.",
      "Znát, co v obci najdeme.",
    ],
    boundaries: ["Pouze základní pojmy.", "Bez map a plánů."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Obec je místo, kde bydlíme. Má jméno, domy a lidi.",
      steps: ["Přečti větu.", "Platí to o obci, nebo ne?"],
      commonMistake: "Vesnice je menší než město, ne naopak.",
      example: "Praha je velké město, Praha je hlavní město.",
    },
  },
];
