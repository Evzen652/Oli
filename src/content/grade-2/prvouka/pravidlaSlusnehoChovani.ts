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
  { question: "Říkáme prosím a děkuji. Pravda?", correct: true, emoji: "🙏" },
  { question: "Skáčeme do řeči. Pravda?", correct: false, emoji: "🗣️" },
  { question: "Pomáháme starým lidem. Pravda?", correct: true, emoji: "🤝" },
  { question: "Zdravíme dospělé. Pravda?", correct: true, emoji: "👋" },
  { question: "Ve škole křičíme. Pravda?", correct: false, emoji: "🏫" },
  { question: "Uklízíme po sobě. Pravda?", correct: true, emoji: "🧹" },
  { question: "Posloucháme učitele. Pravda?", correct: true, emoji: "👂" },
  { question: "Bereme cizí věci. Pravda?", correct: false, emoji: "🚫" },
  { question: "Umýváme si ruce. Pravda?", correct: true, emoji: "🧼" },
  { question: "U stolu mlaskáme. Pravda?", correct: false, emoji: "🍽️" },
  { question: "Pouštíme starší sednout. Pravda?", correct: true, emoji: "🚌" },
  { question: "Děkujeme za pomoc. Pravda?", correct: true, emoji: "🙏" },
  { question: "Posmíváme se ostatním. Pravda?", correct: false, emoji: "🚫" },
  { question: "Mluvíme slušně. Pravda?", correct: true, emoji: "😊" },
  { question: "Po jídle si utíráme pusu. Pravda?", correct: true, emoji: "🍽️" },
  { question: "Házíme odpadky na zem. Pravda?", correct: false, emoji: "🗑️" },
  { question: "Říkáme dobrý den. Pravda?", correct: true, emoji: "👋" },
  { question: "Lžeme rodičům. Pravda?", correct: false, emoji: "🚫" },
  { question: "Půjčíme kamarádovi hračku. Pravda?", correct: true, emoji: "🧸" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? "Pravda" : "Nepravda",
    options: ["Pravda", "Nepravda"],
    emoji: item.emoji,
    hints: ["Slušné chování znamená být hodný a zdvořilý."],
    solutionSteps: [item.correct ? "Ano, je to pravda." : "Ne, není to pravda."],
  }));
}

export const PRAVIDLASLUSNEHOCHOVANI: TopicMetadata[] = [
  {
    id: "g2-prv-chovani",
    rvpNodeId: "g2-prvouka-lide-kolem-nas-souziti-lidi-pravidla-slusneho-chovani-a-souziti",
    title: "Pravidla slušného chování a soužití",
    studentTitle: "Slušné chování",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití lidí",
    briefDescription: "Jak se chovat slušně k lidem.",
    keywords: ["chování", "slušnost", "prosím", "děkuji", "zdravení", "pravidla"],
    goals: [
      "Znát základní pravidla slušného chování.",
      "Umět zdravit a děkovat.",
      "Rozlišit slušné a neslušné chování.",
    ],
    boundaries: ["Pouze základní zdvořilost.", "Bez složitých situací."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Slušné chování je být zdvořilý: prosím, děkuji, pozdrav.",
      steps: ["Přečti větu.", "Je to slušné, nebo neslušné?"],
      commonMistake: "Skákání do řeči a křik nejsou slušné chování.",
      example: "Říkáme prosím a děkuji — to je slušné.",
    },
  },
];
