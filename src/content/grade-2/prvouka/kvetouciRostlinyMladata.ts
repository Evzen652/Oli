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
  { question: "Mládě kočky je?", correct: "Kotě", distractors: ["Štěně", "Tele"], emoji: "🐱" },
  { question: "Mládě psa je?", correct: "Štěně", distractors: ["Kotě", "Hříbě"], emoji: "🐶" },
  { question: "Mládě krávy je?", correct: "Tele", distractors: ["Kotě", "Sele"], emoji: "🐄" },
  { question: "Mládě koně je?", correct: "Hříbě", distractors: ["Tele", "Štěně"], emoji: "🐴" },
  { question: "Mládě prasete je?", correct: "Sele", distractors: ["Kuře", "Tele"], emoji: "🐷" },
  { question: "Mládě slepice je?", correct: "Kuře", distractors: ["Sele", "Kotě"], emoji: "🐔" },
  { question: "Mládě ovce je?", correct: "Jehně", distractors: ["Kůzle", "Tele"], emoji: "🐑" },
  { question: "Mládě kozy je?", correct: "Kůzle", distractors: ["Jehně", "Sele"], emoji: "🐐" },
  { question: "Co kvete na jaře?", correct: "Tulipán", distractors: ["Sníh", "Listí"], emoji: "🌷" },
  { question: "Která květina kvete brzy?", correct: "Sněženka", distractors: ["Houba", "Mech"], emoji: "🌼" },
  { question: "Mládě kachny je?", correct: "Káčátko", distractors: ["Kuře", "Sele"], emoji: "🐤" },
  { question: "Co roste na louce?", correct: "Pampeliška", distractors: ["Kámen", "Sníh"], emoji: "🌼" },
  { question: "Mládě husy je?", correct: "House", distractors: ["Kuře", "Tele"], emoji: "🦢" },
  { question: "Žlutá jarní květina?", correct: "Petrklíč", distractors: ["Listí", "Mech"], emoji: "🌼" },
  { question: "Mládě králíka je?", correct: "Králíče", distractors: ["Kuře", "Sele"], emoji: "🐰" },
  { question: "Co kvete v zahradě na jaře?", correct: "Narcis", distractors: ["Sníh", "Houba"], emoji: "🌼" },
  { question: "Mládě zajíce je?", correct: "Zajíče", distractors: ["Kuře", "Tele"], emoji: "🐇" },
  { question: "Strom kvete na jaře čím?", correct: "Květy", distractors: ["Sníh", "Listí"], emoji: "🌸" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: ["Mládě má své jméno, na jaře kvetou květiny."],
      solutionSteps: [`Správně: ${item.correct}`],
    };
  });
}

export const KVETOUCIROSTLINYMLADATA: TopicMetadata[] = [
  {
    id: "g2-prv-jaro-rostliny-mladata",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-jare-a-v-lete-kvetouci-rostliny-mladata-zvirat",
    title: "Kvetoucí rostliny a mláďata zvířat",
    studentTitle: "Mláďata a květiny",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na jaře a v létě",
    briefDescription: "Poznáš mláďata zvířat a jarní květiny.",
    keywords: ["mládě", "kotě", "štěně", "tele", "květina", "jaro"],
    goals: [
      "Znát jména mláďat zvířat.",
      "Poznat jarní květiny.",
      "Spojit zvíře a jeho mládě.",
    ],
    boundaries: ["Pouze běžná mláďata a květiny.", "Bez růstu rostlin."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Každé zvíře má pro mládě své jméno. Na jaře kvetou květiny.",
      steps: ["Přečti otázku.", "Jak se mládě jmenuje?"],
      commonMistake: "Záměna jmen mláďat (kotě vs. štěně).",
      example: "Mládě kočky je kotě, mládě psa je štěně.",
    },
  },
];
