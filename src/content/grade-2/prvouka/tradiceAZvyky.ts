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
  { question: "Kdy zdobíme stromeček?", correct: "Vánoce", distractors: ["Velikonoce", "Léto"], emoji: "🎄" },
  { question: "Kdy malujeme vajíčka?", correct: "Velikonoce", distractors: ["Vánoce", "Zima"], emoji: "🥚" },
  { question: "Co patří k Vánocům?", correct: "Kapr", distractors: ["Pomlázka", "Vajíčko"], emoji: "🎄" },
  { question: "Co patří k Velikonocům?", correct: "Pomlázka", distractors: ["Stromeček", "Kapr"], emoji: "🐣" },
  { question: "Kdo nosí dárky o Vánocích?", correct: "Ježíšek", distractors: ["Čaroděj", "Zajíc"], emoji: "🎁" },
  { question: "Co dáváme pod stromeček?", correct: "Dárky", distractors: ["Vajíčka", "Sníh"], emoji: "🎁" },
  { question: "Co kvete na jaře u Velikonoc?", correct: "Bledule", distractors: ["Stromeček", "Cukroví"], emoji: "🌷" },
  { question: "Co pečeme o Vánocích?", correct: "Cukroví", distractors: ["Vajíčka", "Pomlázku"], emoji: "🍪" },
  { question: "Kdy je nový rok?", correct: "Leden", distractors: ["Duben", "Září"], emoji: "🎆" },
  { question: "Čím zdobíme vajíčka?", correct: "Barvy", distractors: ["Sníh", "Svíčky"], emoji: "🥚" },
  { question: "Co zpíváme o Vánocích?", correct: "Koledy", distractors: ["Básně", "Hádanky"], emoji: "🎶" },
  { question: "Jaké zvíře patří k Velikonocům?", correct: "Zajíc", distractors: ["Kapr", "Sob"], emoji: "🐰" },
  { question: "Co svítí na stromečku?", correct: "Svíčky", distractors: ["Vajíčka", "Pomlázky"], emoji: "🕯️" },
  { question: "Kdy dáváme přání k narozeninám?", correct: "Narozeniny", distractors: ["Vánoce", "Velikonoce"], emoji: "🎂" },
  { question: "Co plete chlapec na Velikonoce?", correct: "Pomlázku", distractors: ["Stromeček", "Cukroví"], emoji: "🐣" },
  { question: "Co najdeme v adventu?", correct: "Svíčky", distractors: ["Vajíčka", "Pomlázku"], emoji: "🕯️" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: ["Vzpomeň si na svátky a tradice."],
      solutionSteps: [`Správně: ${item.correct}`],
    };
  });
}

export const TRADICEAZVYKY: TopicMetadata[] = [
  {
    id: "g2-prv-tradice",
    rvpNodeId: "g2-prvouka-lide-a-cas-mereni-casu-a-tradice-tradice-a-zvyky-vanoce-velikonoce-regionalni-svatky",
    title: "Tradice a zvyky",
    studentTitle: "Svátky a tradice",
    subject: "prvouka",
    category: "Lidé a čas",
    topic: "Měření času a tradice",
    briefDescription: "Poznáš Vánoce, Velikonoce a zvyky.",
    keywords: ["tradice", "zvyky", "Vánoce", "Velikonoce", "svátky", "koledy"],
    goals: [
      "Poznat hlavní svátky v roce.",
      "Vědět, co patří k Vánocům a Velikonocům.",
      "Znát tradiční zvyky.",
    ],
    boundaries: ["Pouze známé svátky.", "Bez historie svátků."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Vánoce = stromeček a kapr. Velikonoce = vajíčka a pomlázka.",
      steps: ["Přečti otázku.", "Který svátek to je?"],
      commonMistake: "Záměna Vánoc a Velikonoc.",
      example: "O Vánocích zdobíme stromeček a jíme kapra.",
    },
  },
];
