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
  { question: "Co je na plánu obce?", correct: "Ulice", distractors: ["Mraky", "Hvězdy"], emoji: "🗺️" },
  { question: "Čím jezdíme do školy?", correct: "Autobus", distractors: ["Loď", "Letadlo"], emoji: "🚌" },
  { question: "Co svítí na přechodu?", correct: "Semafor", distractors: ["Lampa", "Svíčka"], emoji: "🚦" },
  { question: "Po čem chodíme u silnice?", correct: "Chodník", distractors: ["Tráva", "Voda"], emoji: "🚶" },
  { question: "Kde přejdeme silnici?", correct: "Přechod", distractors: ["Strom", "Plot"], emoji: "🚸" },
  { question: "Po čem jezdí auta?", correct: "Silnice", distractors: ["Chodník", "Tráva"], emoji: "🛣️" },
  { question: "Co ukazuje cestu?", correct: "Cedule", distractors: ["Mrak", "Strom"], emoji: "🪧" },
  { question: "Co je nad řekou?", correct: "Most", distractors: ["Plot", "Lavička"], emoji: "🌉" },
  { question: "Kde si sedneme v parku?", correct: "Lavička", distractors: ["Semafor", "Cedule"], emoji: "🪑" },
  { question: "Co je v parku?", correct: "Stromy", distractors: ["Auta", "Semafory"], emoji: "🌳" },
  { question: "Čím ještě jezdíme ve městě?", correct: "Tramvaj", distractors: ["Loď", "Letadlo"], emoji: "🚊" },
  { question: "Kde čekáme na autobus?", correct: "Zastávka", distractors: ["Most", "Park"], emoji: "🚏" },
  { question: "Co stojí u domu?", correct: "Plot", distractors: ["Řeka", "Mrak"], emoji: "🏡" },
  { question: "Kde parkují auta?", correct: "Parkoviště", distractors: ["Řeka", "Park"], emoji: "🅿️" },
  { question: "Co teče obcí?", correct: "Řeka", distractors: ["Silnice", "Plot"], emoji: "🏞️" },
  { question: "Kde si hrají děti?", correct: "Hřiště", distractors: ["Silnice", "Most"], emoji: "🛝" },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: ["Mysli na to, co vidíš venku v obci."],
      solutionSteps: [`Správně: ${item.correct}`],
    };
  });
}

export const PLANOBCEOKOLISKOLY: TopicMetadata[] = [
  {
    id: "g2-prv-plan-obce",
    rvpNodeId: "g2-prvouka-misto-kde-zijeme-obec-a-okoli-plan-obce-okoli-skoly",
    title: "Plán obce a okolí školy",
    studentTitle: "Plán obce",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Obec a okolí",
    briefDescription: "Poznáš, co je na plánu obce.",
    keywords: ["plán", "obec", "ulice", "silnice", "autobus", "semafor"],
    goals: [
      "Poznat, co je na plánu obce.",
      "Vědět, jak se dostat do školy.",
      "Znát dopravní prvky v obci.",
    ],
    boundaries: ["Pouze základní orientace.", "Bez čtení mapy."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na plánu obce jsou ulice, silnice a domy.",
      steps: ["Přečti otázku.", "Co venku v obci vidíš?"],
      commonMistake: "Záměna chodníku (pro lidi) a silnice (pro auta).",
      example: "Po silnici jezdí auta, po chodníku chodí lidé.",
    },
  },
];
