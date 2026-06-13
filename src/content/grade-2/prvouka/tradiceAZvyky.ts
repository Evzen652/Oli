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
  { question: "Kdy zdobíme stromeček?", correct: "Vánoce", distractors: ["Velikonoce", "Léto"], emoji: "🎄", hint: "Stromeček zdobíme v zimě — na jaký zimní svátek?", solution: "Stromeček zdobíme o Vánocích — v prosinci." },
  { question: "Kdy malujeme vajíčka?", correct: "Velikonoce", distractors: ["Vánoce", "Zima"], emoji: "🥚", hint: "Vajíčka malujeme na jarní svátek — Vánoce nebo Velikonoce?", solution: "Vajíčka malujeme o Velikonocích — na jaře." },
  { question: "Co patří k Vánocům?", correct: "Kapr", distractors: ["Pomlázka", "Vajíčko"], emoji: "🎄", hint: "O Vánocích jíme tradiční jídlo — jakou rybu?", solution: "K Vánocům patří kapr — je to tradiční vánoční jídlo." },
  { question: "Co patří k Velikonocům?", correct: "Pomlázka", distractors: ["Stromeček", "Kapr"], emoji: "🐣", hint: "Chlapci chodí o Velikonocích po domech s upletenými proutky — jak se jim říká?", solution: "K Velikonocům patří pomlázka — chlapci chodí s ní po domech." },
  { question: "Kdo nosí dárky o Vánocích?", correct: "Ježíšek", distractors: ["Čaroděj", "Zajíc"], emoji: "🎁", hint: "Dárky se ukládají pod stromeček — kdo je tam podle tradice přinese?", solution: "O Vánocích nosí dárky Ježíšek — dárky najdeme pod stromečkem." },
  { question: "Co dáváme pod stromeček?", correct: "Dárky", distractors: ["Vajíčka", "Sníh"], emoji: "🎁", hint: "Pod stromeček dáváme balíčky pro rodinu — co v nich je?", solution: "Pod stromeček dáváme dárky — balíčky pro radost." },
  { question: "Co kvete na jaře u Velikonoc?", correct: "Bledule", distractors: ["Stromeček", "Cukroví"], emoji: "🌷", hint: "Na jaře vykukují první jarní květiny — bílé zvonečky v trávě.", solution: "U Velikonoc kvetou bledule — jsou jedny z prvních jarních květin." },
  { question: "Co pečeme o Vánocích?", correct: "Cukroví", distractors: ["Vajíčka", "Pomlázku"], emoji: "🍪", hint: "O Vánocích voní celý dům pečením — sladkostí různých tvarů.", solution: "O Vánocích pečeme cukroví — perníčky, vanilkové rohlíčky a další sladkosti." },
  { question: "Kdy je nový rok?", correct: "Leden", distractors: ["Duben", "Září"], emoji: "🎆", hint: "Nový rok slavíme vždy první den roku — v lednu, dubnu nebo září?", solution: "Nový rok je v lednu — slavíme ho 1. ledna." },
  { question: "Čím zdobíme vajíčka?", correct: "Barvy", distractors: ["Sníh", "Svíčky"], emoji: "🥚", hint: "Vajíčka o Velikonocích barvíme — čím je obarvíme?", solution: "Vajíčka zdobíme barvami — malujeme vzory a barvíme je." },
  { question: "Co zpíváme o Vánocích?", correct: "Koledy", distractors: ["Básně", "Hádanky"], emoji: "🎶", hint: "O Vánocích zpíváme písničky o Ježíšku a hvězdách — jak se jim říká?", solution: "O Vánocích zpíváme koledy — jako Narodil se Kristus Pán." },
  { question: "Jaké zvíře patří k Velikonocům?", correct: "Zajíc", distractors: ["Kapr", "Sob"], emoji: "🐰", hint: "Velikonoční zvíře skáče a má dlouhé uši — jaké je to?", solution: "K Velikonocům patří zajíc — podle tradice nosí vajíčka." },
  { question: "Co svítí na stromečku?", correct: "Svíčky", distractors: ["Vajíčka", "Pomlázky"], emoji: "🕯️", hint: "Na vánočním stromečku svítí ozdoby — plamenem nebo elektřinou.", solution: "Na stromečku svítí svíčky (nebo elektrické světýlka)." },
  { question: "Co slavíme v den, kdy jsme se narodili?", correct: "Narozeniny", distractors: ["Vánoce", "Velikonoce"], emoji: "🎂", hint: "Každý z nás má svůj vlastní svátek — den, kdy se narodil.", solution: "V den, kdy jsme se narodili, slavíme narozeniny." },
  { question: "Co plete chlapec na Velikonoce?", correct: "Pomlázku", distractors: ["Stromeček", "Cukroví"], emoji: "🐣", hint: "Chlapci pletou z vrbových proutků — čím chodí po domech?", solution: "Chlapci pletou pomlázku z vrbových proutků — chodí s ní o Velikonocích." },
  { question: "Co zapalujeme v adventu každý týden?", correct: "Svíčky", distractors: ["Vajíčka", "Pomlázku"], emoji: "🕯️", hint: "Advent jsou čtyři týdny před Vánocemi — každý týden zapalujeme jednu…", solution: "V adventu zapalujeme svíčky na adventním věnci — každý týden jednu." },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct,
    options: shuffle([item.correct, ...item.distractors]),
    emoji: item.emoji,
    hints: [item.hint],
    solutionSteps: [item.solution],
  }));
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
