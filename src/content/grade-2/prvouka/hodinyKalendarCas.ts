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
  { question: "Rok má kolik měsíců?", correct: "12", distractors: ["10", "7"], emoji: "📅" },
  { question: "Týden má kolik dní?", correct: "7", distractors: ["5", "10"], emoji: "📆" },
  { question: "Den má kolik hodin?", correct: "24", distractors: ["12", "60"], emoji: "⏰" },
  { question: "Hodina má kolik minut?", correct: "60", distractors: ["30", "100"], emoji: "🕐" },
  { question: "Kolik dní má rok?", correct: "365", distractors: ["300", "100"], emoji: "📅" },
  { question: "První den v týdnu?", correct: "Pondělí", distractors: ["Neděle", "Středa"], emoji: "📆" },
  { question: "Poslední den v týdnu?", correct: "Neděle", distractors: ["Sobota", "Pátek"], emoji: "📆" },
  { question: "Čím měříme čas?", correct: "Hodiny", distractors: ["Metr", "Váha"], emoji: "⏰" },
  { question: "Kdy je nejvíc tma?", correct: "Noc", distractors: ["Ráno", "Poledne"], emoji: "🌙" },
  { question: "Kdy vychází slunce?", correct: "Ráno", distractors: ["Večer", "Noc"], emoji: "🌅" },
  { question: "Kolik je ručiček na hodinách?", correct: "Dvě", distractors: ["Jedna", "Tři"], emoji: "🕐" },
  { question: "Co je delší než minuta?", correct: "Hodina", distractors: ["Vteřina", "Nic"], emoji: "⏳" },
  { question: "Který měsíc je první?", correct: "Leden", distractors: ["Prosinec", "Březen"], emoji: "❄️" },
  { question: "Který měsíc je poslední?", correct: "Prosinec", distractors: ["Leden", "Červen"], emoji: "🎄" },
  { question: "Co máme každý den jednou?", correct: "Ráno", distractors: ["Týden", "Rok"], emoji: "🌅" },
  { question: "Kolik je hodin v poledne?", correct: "12", distractors: ["6", "24"], emoji: "🕛" },
  { question: "Co přijde po pondělí?", correct: "Úterý", distractors: ["Neděle", "Pátek"], emoji: "📆" },
  { question: "Co přijde po létě?", correct: "Podzim", distractors: ["Jaro", "Zima"], emoji: "🍂" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: ["Vzpomeň si na hodiny a kalendář."],
      solutionSteps: [`Správně: ${item.correct}`],
    };
  });
}

export const HODINYKALENDARCAS: TopicMetadata[] = [
  {
    id: "g2-prv-hodiny-cas",
    rvpNodeId: "g2-prvouka-lide-a-cas-mereni-casu-a-tradice-hodiny-kalendar-cas",
    title: "Hodiny, kalendář a čas",
    studentTitle: "Hodiny a čas",
    subject: "prvouka",
    category: "Lidé a čas",
    topic: "Měření času a tradice",
    briefDescription: "Poznáš dny, měsíce a hodiny.",
    keywords: ["čas", "hodiny", "kalendář", "den", "týden", "měsíc", "rok"],
    goals: [
      "Vědět, kolik má rok měsíců a týden dní.",
      "Znát části dne a měření času.",
      "Orientovat se v kalendáři.",
    ],
    boundaries: ["Pouze základní jednotky času.", "Bez čtení přesného času na hodinách."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Rok má 12 měsíců, týden 7 dní, den 24 hodin.",
      steps: ["Přečti otázku.", "Vzpomeň si na kalendář a hodiny."],
      commonMistake: "Záměna týdne (7 dní) a roku (12 měsíců).",
      example: "Týden má 7 dní: pondělí až neděle.",
    },
  },
];
