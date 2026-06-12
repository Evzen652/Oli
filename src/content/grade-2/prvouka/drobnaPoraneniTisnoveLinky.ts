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
  { question: "Číslo na záchranku?", correct: "155", distractors: ["150", "158"], emoji: "🚑" },
  { question: "Číslo na hasiče?", correct: "150", distractors: ["155", "158"], emoji: "🚒" },
  { question: "Číslo na policii?", correct: "158", distractors: ["150", "155"], emoji: "👮" },
  { question: "Tísňové číslo do celé Evropy?", correct: "112", distractors: ["155", "150"], emoji: "📞" },
  { question: "Co dáme na ránu?", correct: "Náplast", distractors: ["Bonbon", "Hračka"], emoji: "🩹" },
  { question: "Koho voláme, když hoří?", correct: "Hasiče", distractors: ["Pekaře", "Učitele"], emoji: "🚒" },
  { question: "Koho voláme při úrazu?", correct: "Záchranku", distractors: ["Pošťáka", "Kuchaře"], emoji: "🚑" },
  { question: "Čím umyjeme ranku?", correct: "Voda", distractors: ["Bláto", "Písek"], emoji: "💧" },
  { question: "Koho zavoláme dospělého při úrazu?", correct: "Rodiče", distractors: ["Souseda kočku", "Nikoho"], emoji: "👪" },
  { question: "Co uděláme s krvácející ránou?", correct: "Zatlačíme", distractors: ["Necháme", "Špiníme"], emoji: "🩹" },
  { question: "Koho voláme při krádeži?", correct: "Policii", distractors: ["Pekaře", "Hasiče"], emoji: "👮" },
  { question: "Co řekneme do telefonu jako první?", correct: "Co se stalo", distractors: ["Vtip", "Píseň"], emoji: "📞" },
  { question: "Co dáme na bouli?", correct: "Led", distractors: ["Horkou vodu", "Bonbon"], emoji: "🧊" },
  { question: "Komu řekneme, že nás něco bolí?", correct: "Dospělému", distractors: ["Nikomu", "Hračce"], emoji: "🧑" },
  { question: "Kde nám ošetří velkou ránu?", correct: "Nemocnice", distractors: ["Obchod", "Hřiště"], emoji: "🏥" },
  { question: "Co potřebujeme na odřené koleno?", correct: "Náplast", distractors: ["Sníh", "Kámen"], emoji: "🩹" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: ["Při úrazu zavoláme pomoc a řekneme dospělému."],
      solutionSteps: [`Správně: ${item.correct}`],
    };
  });
}

export const DROBNAPORANENITISNOVELINKY: TopicMetadata[] = [
  {
    id: "g2-prv-prvni-pomoc",
    rvpNodeId: "g2-prvouka-clovek-a-jeho-zdravi-prevence-a-prvni-pomoc-drobna-poraneni-privolani-pomoci-tisnove-linky",
    title: "Drobná poranění, přivolání pomoci, tísňové linky",
    studentTitle: "První pomoc",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Prevence a první pomoc",
    briefDescription: "Co dělat při úrazu a kam volat.",
    keywords: ["první pomoc", "úraz", "záchranka", "hasiči", "policie", "tísňová linka"],
    goals: [
      "Znát tísňová čísla: 155, 150, 158, 112.",
      "Vědět, co dělat při drobném úrazu.",
      "Umět přivolat pomoc dospělého.",
    ],
    boundaries: ["Pouze základy.", "Bez složitého ošetřování."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Záchranka 155, hasiči 150, policie 158, tísňové 112.",
      steps: ["Přečti otázku.", "Vzpomeň si na správné číslo nebo pomoc."],
      commonMistake: "Záměna tísňových čísel — záchranka je 155.",
      example: "Když se někdo zraní, voláme záchranku na číslo 155.",
    },
  },
];
