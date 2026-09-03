import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * PED-3 kalibrace L1<L2<L3.
 *
 * Před: `gen(_level)` ignoroval úroveň → L1==L2==L3, audit `20/0/0 max L1`.
 *
 * Teď disjunktní pooly:
 *   L1 — základní vztah 1× (1 m = 100 cm, 1 kg = 1000 g, 1 l = 10 dl).
 *   L2 — násobky (2 m = 200 cm, 3 kg = 3000 g, 2 l = 20 dl).
 *   L3 — poloviny/čtvrtiny (50 cm = půl metru) a porovnání dvou jednotek
 *        (1 m je delší než 90 cm).
 */

interface PoolItem {
  question: string;
  correct: boolean;
  hint: string;
  solution: string;
}

const POOL_L1: PoolItem[] = [
  // Délka — základní vztah
  { question: "1 m = 100 cm. Je to pravda?", correct: true, hint: "1 metr má 100 centimetrů.", solution: "1 metr = 100 centimetrů — je to pravda." },
  { question: "100 cm = 1 m. Je to pravda?", correct: true, hint: "1 metr má 100 centimetrů.", solution: "100 centimetrů = 1 metr — je to pravda." },
  { question: "1 m = 10 cm. Je to pravda?", correct: false, hint: "1 metr má 100 centimetrů.", solution: "1 metr = 100 centimetrů, ne 10. Takže to pravda není." },
  { question: "50 cm = 1 m. Je to pravda?", correct: false, hint: "1 metr má 100 centimetrů.", solution: "1 metr = 100 centimetrů, ne 50. Takže to pravda není." },
  // Hmotnost — základní vztah
  { question: "1 kg = 1000 g. Je to pravda?", correct: true, hint: "1 kilogram má 1000 gramů.", solution: "1 kilogram = 1000 gramů — je to pravda." },
  { question: "1000 g = 1 kg. Je to pravda?", correct: true, hint: "1 kilogram má 1000 gramů.", solution: "1000 gramů = 1 kilogram — je to pravda." },
  { question: "1 kg = 100 g. Je to pravda?", correct: false, hint: "1 kilogram má 1000 gramů.", solution: "1 kilogram = 1000 gramů, ne 100. Takže to pravda není." },
  // Objem — základní vztah
  { question: "1 l = 10 dl. Je to pravda?", correct: true, hint: "1 litr má 10 decilitrů.", solution: "1 litr = 10 decilitrů — je to pravda." },
  { question: "10 dl = 1 l. Je to pravda?", correct: true, hint: "1 litr má 10 decilitrů.", solution: "10 decilitrů = 1 litr — je to pravda." },
  { question: "1 l = 1 dl. Je to pravda?", correct: false, hint: "1 litr má 10 decilitrů.", solution: "1 litr = 10 decilitrů, ne 1. Takže to pravda není." },
];

const POOL_L2: PoolItem[] = [
  // Délka — násobky
  { question: "2 m = 200 cm. Je to pravda?", correct: true, hint: "1 metr má 100 centimetrů, tak 2 metry mají 2 × 100 cm.", solution: "2 metry = 2 × 100 = 200 centimetrů — je to pravda." },
  { question: "5 m = 500 cm. Je to pravda?", correct: true, hint: "1 metr má 100 centimetrů.", solution: "5 metrů = 5 × 100 = 500 centimetrů — je to pravda." },
  { question: "3 m = 30 cm. Je to pravda?", correct: false, hint: "1 metr má 100 centimetrů.", solution: "3 metry = 300 centimetrů, ne 30. Takže to pravda není." },
  { question: "2 m = 20 cm. Je to pravda?", correct: false, hint: "1 metr má 100 centimetrů.", solution: "2 metry = 200 centimetrů, ne 20. Takže to pravda není." },
  // Hmotnost — násobky
  { question: "2 kg = 2000 g. Je to pravda?", correct: true, hint: "1 kilogram má 1000 gramů.", solution: "2 kilogramy = 2 × 1000 = 2000 gramů — je to pravda." },
  { question: "3 kg = 3000 g. Je to pravda?", correct: true, hint: "1 kilogram má 1000 gramů.", solution: "3 kilogramy = 3 × 1000 = 3000 gramů — je to pravda." },
  { question: "2 kg = 200 g. Je to pravda?", correct: false, hint: "1 kilogram má 1000 gramů.", solution: "2 kilogramy = 2000 gramů, ne 200. Takže to pravda není." },
  // Objem — násobky
  { question: "2 l = 20 dl. Je to pravda?", correct: true, hint: "1 litr má 10 decilitrů.", solution: "2 litry = 2 × 10 = 20 decilitrů — je to pravda." },
  { question: "5 l = 50 dl. Je to pravda?", correct: true, hint: "1 litr má 10 decilitrů.", solution: "5 litrů = 5 × 10 = 50 decilitrů — je to pravda." },
  { question: "2 l = 2 dl. Je to pravda?", correct: false, hint: "1 litr má 10 decilitrů.", solution: "2 litry = 20 decilitrů, ne 2. Takže to pravda není." },
];

const POOL_L3: PoolItem[] = [
  // Poloviny a čtvrtiny
  { question: "50 cm je polovina metru. Je to pravda?", correct: true, hint: "1 metr = 100 cm. Polovina ze 100 je 50.", solution: "1 m = 100 cm; polovina = 50 cm. Je to pravda." },
  { question: "500 g je polovina kilogramu. Je to pravda?", correct: true, hint: "1 kg = 1000 g. Polovina z 1000 je 500.", solution: "1 kg = 1000 g; polovina = 500 g. Je to pravda." },
  { question: "5 dl je polovina litru. Je to pravda?", correct: true, hint: "1 l = 10 dl. Polovina z 10 je 5.", solution: "1 l = 10 dl; polovina = 5 dl. Je to pravda." },
  { question: "25 cm je čtvrtina metru. Je to pravda?", correct: true, hint: "1 metr = 100 cm. Čtvrtina ze 100 je 25.", solution: "1 m = 100 cm; čtvrtina = 100 ÷ 4 = 25 cm. Je to pravda." },
  { question: "250 g je čtvrtina kilogramu. Je to pravda?", correct: true, hint: "1 kg = 1000 g. Čtvrtina je 1000 ÷ 4.", solution: "1 kg = 1000 g; čtvrtina = 1000 ÷ 4 = 250 g. Je to pravda." },
  { question: "50 cm je čtvrtina metru. Je to pravda?", correct: false, hint: "Čtvrtina ze 100 cm je 25, ne 50.", solution: "50 cm je POLOVINA metru, ne čtvrtina. Čtvrtina je 25 cm. Není to pravda." },
  { question: "250 g je polovina kilogramu. Je to pravda?", correct: false, hint: "Polovina z 1000 g je 500, ne 250.", solution: "250 g je ČTVRTINA kilogramu, ne polovina. Polovina je 500 g. Není to pravda." },
  // Porovnání dvou jednotek
  { question: "1 m je delší než 90 cm. Je to pravda?", correct: true, hint: "Kolik je 1 m v cm? Pak porovnej se 90.", solution: "1 m = 100 cm > 90 cm — 1 m je delší. Je to pravda." },
  { question: "1 kg je těžší než 500 g. Je to pravda?", correct: true, hint: "Kolik je 1 kg v gramech? Pak porovnej.", solution: "1 kg = 1000 g > 500 g — 1 kg je těžší. Je to pravda." },
  { question: "1 l je větší objem než 8 dl. Je to pravda?", correct: true, hint: "Kolik je 1 l v decilitrech? Pak porovnej.", solution: "1 l = 10 dl > 8 dl — 1 l je větší. Je to pravda." },
  { question: "1 m je kratší než 50 cm. Je to pravda?", correct: false, hint: "Kolik je 1 m v cm? Pak porovnej.", solution: "1 m = 100 cm > 50 cm — 1 m je DELŠÍ, ne kratší. Není to pravda." },
  { question: "500 g je stejně jako 1 kg. Je to pravda?", correct: false, hint: "Kolik je 1 kg v gramech?", solution: "1 kg = 1000 g, ale 500 g je jen polovina. Není to pravda." },
];

const ANO = "Ano, to je pravda";
const NE = "Ne, to není pravda";

function pick(pool: PoolItem[]): PracticeTask[] {
  return shuffle(pool).map((item) => ({
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    hints: [item.hint],
    solutionSteps: [item.solution],
  }));
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
}

export const JEDNOTKYDLKYHMOTNOSTIOBJEMU: TopicMetadata[] = [
  {
    id: "g2-mat-jednotky",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-mereni-a-jednotky-jednotky-delky-cm-m-hmotnosti-kg-objemu-l",
    title: "Jednotky délky (cm, m), hmotnosti (kg) a objemu (l)",
    studentTitle: "Metry, kila, litry",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Měření a jednotky",
    briefDescription: "Poznáš vztahy mezi cm, m, kg a litry.",
    keywords: ["jednotky", "délka", "hmotnost", "objem", "cm", "metr", "kilogram", "litr"],
    goals: [
      "Znát vztah 1 m = 100 cm.",
      "Znát vztah 1 kg = 1000 g.",
      "Znát vztah 1 l = 10 dl.",
      "Rozpoznat poloviny a čtvrtiny základních jednotek.",
    ],
    boundaries: ["Pouze základní vztahy cm/m, kg/g, l/dl.", "Bez přepočtů složitějších hodnot."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Zapamatuj si: 1 m = 100 cm, 1 kg = 1000 g, 1 l = 10 dl. Polovina = ÷ 2, čtvrtina = ÷ 4.",
      steps: [
        "1 metr má 100 centimetrů.",
        "1 kilogram má 1000 gramů.",
        "1 litr má 10 decilitrů.",
        "Polovina/čtvrtina: vezmi základní vztah a vyděl 2 nebo 4.",
      ],
      commonMistake: "Záměna 100 a 1000 — metr má 100 cm, ale kilogram má 1000 g.",
      example: "2 m = 200 cm (2 × 100). 3 kg = 3000 g (3 × 1000). Půl kg = 500 g.",
    },
  },
];
