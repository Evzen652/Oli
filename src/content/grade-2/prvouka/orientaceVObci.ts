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
  { question: "Kam jdeme pro chleba?", correct: "Obchod", distractors: ["Škola", "Hřiště"], emoji: "🏪" },
  { question: "Kde se učíme?", correct: "Škola", distractors: ["Obchod", "Pošta"], emoji: "🏫" },
  { question: "Kam jdeme, když jsme nemocní?", correct: "Lékař", distractors: ["Hřiště", "Obchod"], emoji: "🏥" },
  { question: "Kde si hrajeme?", correct: "Hřiště", distractors: ["Pošta", "Lékař"], emoji: "🛝" },
  { question: "Kam jdeme pro dopis?", correct: "Pošta", distractors: ["Škola", "Hřiště"], emoji: "📮" },
  { question: "Kde si půjčíme knihu?", correct: "Knihovna", distractors: ["Obchod", "Pošta"], emoji: "📚" },
  { question: "Kam jezdíme vlakem?", correct: "Nádraží", distractors: ["Hřiště", "Lékař"], emoji: "🚉" },
  { question: "Kde se modlíme?", correct: "Kostel", distractors: ["Obchod", "Hřiště"], emoji: "⛪" },
  { question: "Kam jdeme cvičit?", correct: "Tělocvična", distractors: ["Pošta", "Obchod"], emoji: "🤸" },
  { question: "Kde hasiči mají auta?", correct: "Hasičárna", distractors: ["Škola", "Pošta"], emoji: "🚒" },
  { question: "Kam jdeme pro léky?", correct: "Lékárna", distractors: ["Hřiště", "Škola"], emoji: "💊" },
  { question: "Kde plaveme?", correct: "Bazén", distractors: ["Obchod", "Pošta"], emoji: "🏊" },
  { question: "Kam jdeme na úřad?", correct: "Radnice", distractors: ["Hřiště", "Obchod"], emoji: "🏛️" },
  { question: "Kde koupíme rohlík?", correct: "Pekárna", distractors: ["Škola", "Pošta"], emoji: "🥐" },
  { question: "Kam jdeme do kina?", correct: "Kino", distractors: ["Obchod", "Lékař"], emoji: "🎬" },
  { question: "Kde si dáme oběd venku?", correct: "Restaurace", distractors: ["Škola", "Pošta"], emoji: "🍽️" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: ["Mysli, kam v obci za tím jdeme."],
      solutionSteps: [`Správně: ${item.correct}`],
    };
  });
}

export const ORIENTACEVOBCI: TopicMetadata[] = [
  {
    id: "g2-prv-orientace-obec",
    rvpNodeId: "g2-prvouka-misto-kde-zijeme-obec-a-okoli-orientace-v-obci-vyznamna-mista-instituce",
    title: "Orientace v obci, významná místa, instituce",
    studentTitle: "Místa v obci",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Obec a okolí",
    briefDescription: "Poznáš důležitá místa v obci.",
    keywords: ["obec", "škola", "obchod", "pošta", "lékař", "knihovna"],
    goals: [
      "Poznat důležitá místa v obci.",
      "Vědět, kam jít pro co.",
      "Orientovat se v okolí.",
    ],
    boundaries: ["Pouze běžné instituce.", "Bez map."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Pro každou věc je v obci jiné místo.",
      steps: ["Přečti otázku.", "Kam za tím jdeme?"],
      commonMistake: "Záměna podobných míst (pošta vs. obchod).",
      example: "Pro chleba jdeme do obchodu, učíme se ve škole.",
    },
  },
];
