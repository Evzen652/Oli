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
  hint: string;
  solution: string;
}

/**
 * PED-3 kalibrace L1<L2<L3.
 * Před: `gen(_level)` ignoroval úroveň → L1==L2==L3, audit `15/0/0`.
 * Teď disjunktní: L1 (základní znalost), L2 (převody půl/čtvrt hodiny),
 * L3 (sloučené výpočty a slovní úlohy).
 */

const POOL_L1: PoolItem[] = [
  { question: "Kolik minut má 1 hodina?", correct: "60", distractors: ["30", "100", "24"], hint: "Spočítej všechny malé dílky na ciferníku hodin dokola — kolik jich je celkem?", solution: "1 hodina má 60 minut — ručičky projdou všech 60 dílků." },
  { question: "Kolik hodin má 1 den?", correct: "24", distractors: ["12", "60", "48"], hint: "Den má část denní a část noční — kolik hodin dohromady uplyne, než se ciferník oběhne dvakrát?", solution: "1 den má 24 hodin — 12 hodin dne a 12 hodin noci." },
  { question: "Ve kolik hodin je poledne?", correct: "12", distractors: ["11", "24", "6"], hint: "Poledne je uprostřed dne — kdy je slunce nejvýš?", solution: "Poledne je v 12 hodin — přesně uprostřed dne." },
  { question: "Ve kolik hodin je půlnoc?", correct: "0", distractors: ["12", "24", "6"], hint: "Půlnoc je uprostřed noci — na hranici mezi dvěma dny.", solution: "Půlnoc je v 0 hodin — začíná nový den." },
  { question: "Kolik sekund má 1 minuta?", correct: "60", distractors: ["100", "30", "10"], hint: "Minuta má stejný počet sekund jako hodina má minut.", solution: "1 minuta má 60 sekund." },
  { question: "60 minut je kolik hodin?", correct: "1", distractors: ["2", "6", "10"], hint: "Zkus si vzpomenout, kolik minut má celá jedna hodina — pak porovnej se zadáním.", solution: "60 minut = 1 hodina — ručičky udělaly celé kolo." },
  { question: "Kolik dopoledních hodin je do poledne?", correct: "12", distractors: ["6", "24", "10"], hint: "Ciferník hodin má čísla napsaná kolem dokola od jedné do dvanácti — od půlnoci do poledne uplyne přesně jeden celý oběh malé ručičky.", solution: "Od půlnoci do poledne uběhne 12 hodin." },
  { question: "Co je delší: 1 minuta nebo 1 sekunda?", correct: "1 minuta", distractors: ["1 sekunda", "stejně dlouhé", "nelze porovnat"], hint: "Kolik sekund má 1 minuta?", solution: "1 minuta = 60 sekund, takže je delší než 1 sekunda." },
];

const POOL_L2: PoolItem[] = [
  { question: "Kolik minut je půl hodiny?", correct: "30", distractors: ["15", "60", "45"], hint: "Půl hodiny = polovina z 60 minut. Kolik je 60 ÷ 2?", solution: "Půl hodiny = 60 ÷ 2 = 30 minut." },
  { question: "Kolik minut je čtvrt hodiny?", correct: "15", distractors: ["30", "20", "10"], hint: "Čtvrt hodiny = čtvrtina z 60 minut. Kolik je 60 ÷ 4?", solution: "Čtvrt hodiny = 60 ÷ 4 = 15 minut." },
  { question: "Kolik minut je třičtvrtě hodiny?", correct: "45", distractors: ["30", "60", "40"], hint: "Třičtvrtě = 3 čtvrthodiny. Každá má 15 minut. Kolik je 3 × 15?", solution: "Třičtvrtě hodiny = 3 × 15 = 45 minut." },
  { question: "30 minut je...?", correct: "půl hodiny", distractors: ["čtvrt hodiny", "celá hodina", "třičtvrtě hodiny"], hint: "30 minut je polovina z 60 minut — jak se česky říká polovině tohoto času?", solution: "30 minut = půl hodiny — to je polovina z 60 minut." },
  { question: "45 minut je kolik čtvrtin hodiny?", correct: "3", distractors: ["4", "2", "45"], hint: "Každá čtvrthodina má 15 minut. Kolikrát se vejde 15 do 45?", solution: "45 minut = 3 čtvrthodiny, protože 3 × 15 = 45." },
  { question: "15 minut je kolik čtvrtin hodiny?", correct: "1", distractors: ["2", "4", "15"], hint: "Čtvrthodina má 15 minut. Zeptej se: kolikrát se čtvrthodina vejde do zadaného počtu minut?", solution: "15 minut = 1 čtvrthodina." },
  { question: "Kolik minut mají 2 hodiny?", correct: "120", distractors: ["60", "200", "100"], hint: "1 hodina = 60 minut. Kolik je 2 × 60?", solution: "2 hodiny = 2 × 60 = 120 minut." },
  { question: "Kolik minut mají 3 hodiny?", correct: "180", distractors: ["150", "200", "130"], hint: "1 hodina = 60 minut. Kolik je 3 × 60?", solution: "3 hodiny = 3 × 60 = 180 minut." },
  { question: "120 minut je kolik hodin?", correct: "2", distractors: ["1", "3", "12"], hint: "1 hodina = 60 minut. Kolikrát se vejde 60 do 120?", solution: "120 minut = 2 hodiny, protože 2 × 60 = 120." },
  { question: "Kolik sekund mají 2 minuty?", correct: "120", distractors: ["60", "200", "20"], hint: "1 minuta = 60 sekund. Kolik je 2 × 60?", solution: "2 minuty = 2 × 60 = 120 sekund." },
];

const POOL_L3: PoolItem[] = [
  { question: "Kolik minut je 1 hodina a 30 minut?", correct: "90", distractors: ["130", "60", "80"], hint: "1 hodina = 60 minut. Přidej ještě 30 minut.", solution: "1 hodina = 60 minut, + 30 minut = 90 minut celkem." },
  { question: "Kolik minut jsou 2 hodiny a 15 minut?", correct: "135", distractors: ["215", "120", "145"], hint: "2 hodiny = 120 minut. Přidej ještě 15 minut.", solution: "2 hodiny = 120 minut, + 15 minut = 135 minut celkem." },
  { question: "Kolik minut je 1 hodina a 45 minut?", correct: "105", distractors: ["145", "90", "115"], hint: "1 hodina = 60 minut. Přidej třičtvrtě hodiny (45 minut).", solution: "60 + 45 = 105 minut celkem." },
  { question: "Škola začíná v 8:00. Přestávka přijde za 45 minut. Ve kolik hodin je přestávka?", correct: "8:45", distractors: ["8:30", "9:00", "8:15"], hint: "8:00 + 45 minut — přidej 45 minut k osmé hodině.", solution: "8:00 + 45 minut = 8:45. Přestávka je třičtvrtě na devět." },
  { question: "Film začíná v 15:00 a trvá 2 hodiny. Kdy skončí?", correct: "17:00", distractors: ["16:00", "18:00", "15:30"], hint: "15:00 + 2 hodiny.", solution: "15:00 + 2 hodiny = 17:00." },
  { question: "Cesta autobusem trvá 90 minut. Kolik hodin a minut to je?", correct: "1 hodina 30 minut", distractors: ["2 hodiny", "1 hodina 15 minut", "45 minut"], hint: "90 = 60 + 30. Kolik je 60 minut?", solution: "90 minut = 1 hodina (60 minut) + 30 minut = 1 hodina 30 minut." },
  { question: "Přestávka trvá 20 minut. Vyučování 45 minut. Kolik minut je to dohromady?", correct: "65", distractors: ["55", "70", "60"], hint: "Sečti obě čísla: 20 + 45.", solution: "20 + 45 = 65 minut celkem." },
  { question: "Trénink začal ve 14:00 a trval 3 hodiny. Kdy skončil?", correct: "17:00", distractors: ["16:00", "18:00", "15:30"], hint: "14 + 3 = ?", solution: "14:00 + 3 hodiny = 17:00." },
  { question: "V 8:00 jsi u snídaně. V 8:20 vyrážíš do školy. Kolik minut trvala snídaně?", correct: "20", distractors: ["10", "30", "40"], hint: "Rozdíl 8:20 − 8:00 = ?", solution: "8:20 − 8:00 = 20 minut. Snídaně trvala 20 minut." },
  { question: "Kolik čtvrthodin má 1 hodina?", correct: "4", distractors: ["2", "3", "60"], hint: "1 čtvrthodina = 15 minut. Kolikrát se vejde 15 do 60?", solution: "60 ÷ 15 = 4 — hodina má 4 čtvrthodiny." },
];

function pick(pool: PoolItem[]): PracticeTask[] {
  return shuffle(pool).map((item) => {
    const opts = shuffle([item.correct, ...item.distractors].slice(0, 4));
    return {
      question: item.question,
      correctAnswer: item.correct,
      options: opts,
      hints: [item.hint],
      solutionSteps: [item.solution],
    };
  });
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
}

export const MERENICASU: TopicMetadata[] = [
  {
    id: "g2-mat-mereni-casu",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-mereni-a-jednotky-mereni-casu-hodina-minuta",
    title: "Měření času (hodina, minuta)",
    studentTitle: "Hodiny a minuty",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Měření a jednotky",
    briefDescription: "Poznáš, kolik minut má hodina a čtvrthodina.",
    keywords: ["čas", "hodina", "minuta", "půl hodiny", "čtvrthodina", "hodiny"],
    goals: [
      "Znát, že 1 hodina = 60 minut.",
      "Určit půl hodiny (30 min) a čtvrthodinu (15 min).",
      "Počítat s časovými údaji.",
    ],
    boundaries: ["Pouze hodiny a minuty.", "Bez sekund a složitých přepočtů."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "1 hodina = 60 minut. Půl hodiny = 30 minut. Čtvrt hodiny = 15 minut.",
      steps: [
        "1 hodina má 60 minut.",
        "Půl hodiny = 60 ÷ 2 = 30 minut.",
        "Čtvrt hodiny = 60 ÷ 4 = 15 minut.",
      ],
      commonMistake: "Záměna 30 a 15 — půl = 30, čtvrt = 15.",
      example: "2 hodiny = 2 × 60 = 120 minut.",
    },
  },
];
