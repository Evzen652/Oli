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
  level: number;
}

const POOL: PoolItem[] = [
  // L1: vyber největší ze tří čísel (možnosti = čísla z otázky)
  { question: "Které číslo je největší: 12, 34, 67?", correct: "67", distractors: ["12", "34"], hint: "Srovnej desítky — větší desítka, větší číslo.", solution: "67 je největší — má 6 desítek, ostatní méně.", level: 1 },
  { question: "Které číslo je největší: 45, 72, 28?", correct: "72", distractors: ["45", "28"], hint: "Srovnej desítky — větší desítka, větší číslo.", solution: "72 je největší — má 7 desítek, 45 jen 4, 28 jen 2.", level: 1 },
  { question: "Které číslo je největší: 90, 19, 55?", correct: "90", distractors: ["19", "55"], hint: "Srovnej desítky — větší desítka, větší číslo.", solution: "90 je největší — má 9 desítek, 55 jen 5, 19 jen 1.", level: 1 },
  { question: "Které číslo je největší: 31, 13, 73?", correct: "73", distractors: ["31", "13"], hint: "Srovnej desítky — větší desítka, větší číslo.", solution: "73 je největší — má 7 desítek, 31 jen 3, 13 jen 1.", level: 1 },
  { question: "Které číslo je největší: 66, 44, 88?", correct: "88", distractors: ["66", "44"], hint: "Srovnej desítky — větší desítka, větší číslo.", solution: "88 je největší — má 8 desítek, 66 jen 6, 44 jen 4.", level: 1 },
  { question: "Které číslo je největší: 50, 15, 51?", correct: "51", distractors: ["50", "15"], hint: "Obě 50 a 51 mají 5 desítek — srovnej jedničky.", solution: "51 je největší — 50 i 51 mají 5 desítek, ale 51 má ještě 1 jedničku navíc.", level: 1 },
  { question: "Které číslo je největší: 29, 92, 39?", correct: "92", distractors: ["29", "39"], hint: "Srovnej desítky — větší desítka, větší číslo.", solution: "92 je největší — má 9 desítek, 39 jen 3, 29 jen 2.", level: 1 },
  // L2: o 1 více nebo méně
  { question: "O 1 víc než 45 je ?", correct: "46", distractors: ["44", "47", "55"], hint: "Stačí přidat jednu jedničku.", solution: "45 + 1 = 46.", level: 2 },
  { question: "O 1 míň než 70 je ?", correct: "69", distractors: ["71", "68", "60"], hint: "Stačí ubrat jednu jedničku.", solution: "70 − 1 = 69.", level: 2 },
  { question: "O 1 víc než 29 je ?", correct: "30", distractors: ["28", "31", "39"], hint: "Stačí přidat jednu jedničku.", solution: "29 + 1 = 30. Přešli jsme do další desítky.", level: 2 },
  { question: "O 1 míň než 40 je ?", correct: "39", distractors: ["41", "38", "30"], hint: "Stačí ubrat jednu jedničku.", solution: "40 − 1 = 39. Přešli jsme do předchozí desítky.", level: 2 },
  { question: "O 1 víc než 99 je ?", correct: "100", distractors: ["98", "101", "90"], hint: "Stačí přidat jednu jedničku.", solution: "99 + 1 = 100. Dostali jsme se na sto!", level: 2 },
  { question: "O 1 míň než 81 je ?", correct: "80", distractors: ["82", "79", "71"], hint: "Stačí ubrat jednu jedničku.", solution: "81 − 1 = 80.", level: 2 },
  { question: "O 1 víc než 63 je ?", correct: "64", distractors: ["62", "65", "73"], hint: "Stačí přidat jednu jedničku.", solution: "63 + 1 = 64.", level: 2 },
  // L3: o 10 více nebo méně
  { question: "O 10 víc než 35 je ?", correct: "45", distractors: ["25", "36", "55"], hint: "Přidej jednu celou desítku.", solution: "35 + 10 = 45. Desítka vzrostla z 3 na 4.", level: 3 },
  { question: "O 10 míň než 80 je ?", correct: "70", distractors: ["90", "79", "60"], hint: "Uber jednu celou desítku.", solution: "80 − 10 = 70. Desítka klesla z 8 na 7.", level: 3 },
  { question: "O 10 víc než 47 je ?", correct: "57", distractors: ["37", "48", "67"], hint: "Přidej jednu celou desítku.", solution: "47 + 10 = 57. Desítka vzrostla z 4 na 5.", level: 3 },
  { question: "O 10 míň než 62 je ?", correct: "52", distractors: ["72", "61", "42"], hint: "Uber jednu celou desítku.", solution: "62 − 10 = 52. Desítka klesla z 6 na 5.", level: 3 },
  { question: "O 10 víc než 90 je ?", correct: "100", distractors: ["80", "91", "110"], hint: "Přidej jednu celou desítku.", solution: "90 + 10 = 100. Dostali jsme se na sto!", level: 3 },
  { question: "O 10 míň než 23 je ?", correct: "13", distractors: ["33", "22", "3"], hint: "Uber jednu celou desítku.", solution: "23 − 10 = 13. Desítka klesla z 2 na 1.", level: 3 },
  { question: "O 10 víc než 58 je ?", correct: "68", distractors: ["48", "59", "78"], hint: "Přidej jednu celou desítku.", solution: "58 + 10 = 68. Desítka vzrostla z 5 na 6.", level: 3 },
];

function gen(level: number): PracticeTask[] {
  const filtered = POOL.filter(item => item.level <= level);
  const shuffled = shuffle(filtered);
  return shuffled.slice(0, 20).map(item => ({
    question: item.question,
    correctAnswer: item.correct,
    options: shuffle([item.correct, ...item.distractors]),
    hints: [item.hint],
    solutionSteps: [item.solution],
  }));
}

export const CTENIZAPISPOROVNAVANICISELDO100: TopicMetadata[] = [
  {
    id: "g2-mat-cteni-zapis-100",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-ciselny-obor-0-100-cteni-zapis-a-porovnavani-cisel-do-100",
    title: "Čtení, zápis a porovnávání čísel do 100",
    studentTitle: "Čísla do 100",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–100",
    briefDescription: "Porovnáš čísla do 100 a najdeš větší nebo menší.",
    keywords: ["porovnávání", "větší", "menší", "čísla do 100", "čtení čísel"],
    goals: [
      "Přečíst a zapsat čísla do 100.",
      "Porovnat tři čísla a určit největší.",
      "Určit číslo o 1 nebo 10 větší/menší.",
    ],
    boundaries: ["Pouze čísla 0–100.", "Bez záporných čísel."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Srovnej nejdřív desítky — větší desítka = větší číslo.",
      steps: [
        "Podívej se na cifru desítek.",
        "Větší cifra desítek = větší číslo.",
        "Pokud jsou desítky stejné, srovnej jedničky.",
      ],
      commonMistake: "34 vs 43 — 43 je větší, protože má víc desítek (4 > 3).",
      example: "34 nebo 43? Desítky: 3 < 4 → 43 je větší.",
    },
  },
];
