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
  { question: "Kdo dává mléko?", correct: "Kráva", distractors: ["Slepice", "Včela"], emoji: "🐄" },
  { question: "Kdo dává vejce?", correct: "Slepice", distractors: ["Ovce", "Kráva"], emoji: "🐔" },
  { question: "Kdo dává vlnu?", correct: "Ovce", distractors: ["Kráva", "Včela"], emoji: "🐑" },
  { question: "Kdo dává med?", correct: "Včela", distractors: ["Slepice", "Koza"], emoji: "🐝" },
  { question: "Kdo hlídá dům?", correct: "Pes", distractors: ["Kočka", "Kráva"], emoji: "🐕" },
  { question: "Kdo chytá myši?", correct: "Kočka", distractors: ["Pes", "Slepice"], emoji: "🐈" },
  { question: "Kdo nosí na zádech?", correct: "Kůň", distractors: ["Včela", "Slepice"], emoji: "🐴" },
  { question: "Kdo žije v chlívku?", correct: "Prase", distractors: ["Včela", "Kočka"], emoji: "🐖" },
  { question: "Kdo dává kozí mléko?", correct: "Koza", distractors: ["Slepice", "Pes"], emoji: "🐐" },
  { question: "Kdo dělá kokrhá ráno?", correct: "Kohout", distractors: ["Kráva", "Ovce"], emoji: "🐓" },
  { question: "Kdo pluje na rybníku?", correct: "Kachna", distractors: ["Kůň", "Pes"], emoji: "🦆" },
  { question: "Kdo dělá hý-ha?", correct: "Osel", distractors: ["Kočka", "Včela"], emoji: "🫏" },
  { question: "Kdo dává hodně masa?", correct: "Prase", distractors: ["Včela", "Kočka"], emoji: "🐷" },
  { question: "Kdo snáší husí vejce?", correct: "Husa", distractors: ["Pes", "Kočka"], emoji: "🦢" },
  { question: "Kdo žije v úlu?", correct: "Včela", distractors: ["Slepice", "Koza"], emoji: "🐝" },
  { question: "Kdo má kohouta a kuřata?", correct: "Slepice", distractors: ["Kráva", "Ovce"], emoji: "🐔" },
  { question: "Kdo dělá bú?", correct: "Kráva", distractors: ["Pes", "Kočka"], emoji: "🐄" },
  { question: "Koho stříháme kvůli vlně?", correct: "Ovce", distractors: ["Pes", "Slepice"], emoji: "🐑" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: ["Mysli, co nám zvíře dává nebo dělá."],
      solutionSteps: [`Správně: ${item.correct}`],
    };
  });
}

export const DOMACIHOSPODARSKAZVIRATA: TopicMetadata[] = [
  {
    id: "g2-prv-zvirata-uzitek",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-domaci-a-hospodarska-zvirata-domaci-mazlicci-hospodarska-zvirata-a-jejich-uzitek",
    title: "Domácí a hospodářská zvířata a jejich užitek",
    studentTitle: "Domácí zvířata",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Domácí a hospodářská zvířata",
    briefDescription: "Poznáš zvířata a jejich užitek.",
    keywords: ["zvířata", "kráva", "slepice", "ovce", "včela", "užitek"],
    goals: [
      "Poznat domácí a hospodářská zvířata.",
      "Vědět, co nám zvířata dávají.",
      "Spojit zvíře s jeho užitkem.",
    ],
    boundaries: ["Pouze běžná zvířata.", "Bez chovu a péče."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Každé zvíře nám něco dává: mléko, vejce, vlnu nebo med.",
      steps: ["Přečti otázku.", "Které zvíře to dělá?"],
      commonMistake: "Záměna užitku — kráva dává mléko, slepice vejce.",
      example: "Kráva dává mléko, včela med, ovce vlnu.",
    },
  },
];
