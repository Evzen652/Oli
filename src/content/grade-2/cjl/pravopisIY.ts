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
  hint: string;
  solution: string;
}

const POOL: PoolItem[] = [
  // Pravidla — identifikace souhlásky
  { question: "Jaká souhláska je 'r'?", correct: "Tvrdá", distractors: ["Měkká", "Obojetná"], emoji: "📝", hint: "Tvrdé souhlásky jsou: h, ch, k, r. Je R v tomto seznamu?", solution: "R je tvrdá souhláska — patří do skupiny h, ch, k, r. Po tvrdé souhlásce vždy píšeme Y, proto 'ryba', ne 'riba'." },
  { question: "Jaká souhláska je 'k'?", correct: "Tvrdá", distractors: ["Měkká", "Obojetná"], emoji: "📝", hint: "Tvrdé souhlásky jsou: h, ch, k, r. Je K v tomto seznamu?", solution: "K je tvrdá souhláska — patří do skupiny h, ch, k, r. Po K vždy píšeme Y, proto 'kytara', ne 'kitara'." },
  { question: "Jaká souhláska je 'č'?", correct: "Měkká", distractors: ["Tvrdá", "Obojetná"], emoji: "📝", hint: "Měkké souhlásky jsou: ž, š, č, ř, c, j. Je Č v tomto seznamu?", solution: "Č je měkká souhláska — patří do skupiny ž, š, č, ř, c, j. Po Č vždy píšeme I nebo Í, proto 'číst', ne 'čyst'." },
  { question: "Jaká souhláska je 'š'?", correct: "Měkká", distractors: ["Tvrdá", "Obojetná"], emoji: "📝", hint: "Měkké souhlásky jsou: ž, š, č, ř, c, j. Je Š v tomto seznamu?", solution: "Š je měkká souhláska — po Š vždy píšeme I nebo Í, proto 'šípek', ne 'šypek'." },
  { question: "Co píšeme po tvrdé souhlásce?", correct: "Vždy Y", distractors: ["Vždy I", "Záleží na slově"], emoji: "📝", hint: "Tvrdé souhlásky (h, ch, k, r) si vždy vyžádají jedno písmeno — Y nebo I?", solution: "Po tvrdé souhlásce vždy píšeme Y — proto 'ryba', 'kytara', 'chyba'. Tvrdá souhláska si vždy 'chce' Y." },
  { question: "Co píšeme po měkké souhlásce?", correct: "Vždy I nebo Í", distractors: ["Vždy Y nebo Ý", "Záleží na délce"], emoji: "📝", hint: "Měkké souhlásky (ž, š, č, ř, c, j) si vždy vyžádají jedno písmeno — Y nebo I?", solution: "Po měkké souhlásce vždy píšeme I nebo Í — proto 'žízeň', 'šípek', 'číst'. Měkká souhláska si vždy 'chce' I." },
  // Aplikace — tvrdé souhlásky
  { question: "Doplň správně: 'r_ba'", correct: "ryba", distractors: ["riba", "rýba"], emoji: "🐟", hint: "R je tvrdá souhláska. Co vždy píšeme po tvrdé souhlásce?", solution: "Správně je 'ryba' — R je tvrdá souhláska, proto po ní píšeme Y, ne I." },
  { question: "Doplň správně: 'k_tara'", correct: "kytara", distractors: ["kitara", "kítara"], emoji: "🎸", hint: "K je tvrdá souhláska. Co vždy píšeme po K?", solution: "Správně je 'kytara' — K je tvrdá souhláska, proto po ní píšeme Y, ne I." },
  { question: "Doplň správně: 'ch_ba'", correct: "chyba", distractors: ["chiba", "chíba"], emoji: "❌", hint: "CH je tvrdá souhláska. Co vždy píšeme po CH?", solution: "Správně je 'chyba' — CH je tvrdá souhláska, proto po ní píšeme Y, ne I." },
  { question: "Doplň správně: 'k_blík'", correct: "kyblík", distractors: ["kiblík", "kíblík"], emoji: "🪣", hint: "K je tvrdá souhláska. Co vždy píšeme po K?", solution: "Správně je 'kyblík' — K je tvrdá souhláska, proto po ní píšeme Y, ne I." },
  { question: "Doplň správně: 'ch_trý'", correct: "chytrý", distractors: ["chitrý", "chítrý"], emoji: "🦊", hint: "CH je tvrdá souhláska. Co vždy píšeme po CH?", solution: "Správně je 'chytrý' — CH je tvrdá souhláska, proto po ní píšeme Y, ne I." },
  { question: "Doplň správně: 'r_že'", correct: "rýže", distractors: ["riže", "říže"], emoji: "🍚", hint: "R je tvrdá souhláska. Co vždy píšeme po R?", solution: "Správně je 'rýže' — R je tvrdá souhláska, proto po ní píšeme Y (zde dlouhé Ý)." },
  // Aplikace — měkké souhlásky
  { question: "Doplň správně: 'ž_zeň'", correct: "žízeň", distractors: ["žyzeň", "žizeň"], emoji: "💧", hint: "Ž je měkká souhláska. Co vždy píšeme po měkké souhlásce?", solution: "Správně je 'žízeň' — Ž je měkká souhláska, proto po ní píšeme Í, ne Y." },
  { question: "Doplň správně: 'š_pek'", correct: "šípek", distractors: ["šypek", "šipek"], emoji: "🌹", hint: "Š je měkká souhláska. Co vždy píšeme po Š?", solution: "Správně je 'šípek' — Š je měkká souhláska, proto po ní píšeme Í, ne Y." },
  { question: "Doplň správně: 'č_slo'", correct: "číslo", distractors: ["čyslo", "čislo"], emoji: "🔢", hint: "Č je měkká souhláska. Co vždy píšeme po Č?", solution: "Správně je 'číslo' — Č je měkká souhláska, proto po ní píšeme Í, ne Y." },
  { question: "Doplň správně: 'j_st'", correct: "jíst", distractors: ["jyst", "jist"], emoji: "🍽️", hint: "J je měkká souhláska. Co vždy píšeme po J?", solution: "Správně je 'jíst' — J je měkká souhláska, proto po ní píšeme Í, ne Y." },
  { question: "Doplň správně: 'c_l'", correct: "cíl", distractors: ["cyl", "cil"], emoji: "🎯", hint: "C je měkká souhláska. Co vždy píšeme po C?", solution: "Správně je 'cíl' — C je měkká souhláska, proto po ní píšeme Í, ne Y." },
  { question: "Doplň správně: 'ř_ká'", correct: "říká", distractors: ["řyká", "říka"], emoji: "🗣️", hint: "Ř je měkká souhláska. Co vždy píšeme po Ř?", solution: "Správně je 'říká' — Ř je měkká souhláska, proto po ní píšeme Í, ne Y." },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: [item.hint],
      explanation: item.solution,
    };
  });
}

export const PRAVOPISIY: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-pravopis-tvrdych-a-mekkych-souhlasek-i-y-po-souhlaskach",
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-pravopis-tvrdych-a-mekkych-souhlasek-i-y-po-souhlaskach",
    title: "Pravopis tvrdých a měkkých souhlásek (i/y po souhláskách)",
    studentTitle: "Y nebo I?",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Naučíš se, kdy psát Y a kdy I.",
    keywords: ["pravopis", "tvrdé souhlásky", "měkké souhlásky", "y", "i", "ryba", "číst"],
    goals: [
      "Rozlišit tvrdé a měkké souhlásky.",
      "Vědět, že po tvrdé souhlásce píšeme Y.",
      "Vědět, že po měkké souhlásce píšeme I nebo Í.",
    ],
    boundaries: ["Pouze tvrdé a měkké souhlásky.", "Bez obojetných souhlásek."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Tvrdé (h, ch, k, r) → Y. Měkké (ž, š, č, ř, c, j) → I nebo Í.",
      steps: ["Najdi souhlásku před prázdným místem.", "Je tvrdá nebo měkká?", "Tvrdá → Y, měkká → I."],
      commonMistake: "Záměna tvrdé a měkké souhlásky — CH je tvrdá (chyba), Č je měkká (číst).",
      example: "Ryba: R je tvrdá → Y. Číst: Č je měkká → Í.",
    },
  },
];
