import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: jednoduchá čísla s 1 desetinným místem
const POOL_L1: PracticeTask[] = [
  { question: "1,5 + 2,3 = ?", correctAnswer: "3,8", options: ["3,8", "3,9", "3,7", "4,8"] },
  { question: "3,7 + 1,2 = ?", correctAnswer: "4,9", options: ["4,9", "5,0", "4,8", "4,7"] },
  { question: "2,6 + 1,4 = ?", correctAnswer: "4,0", options: ["4,0", "4,1", "3,9", "3,0"] },
  { question: "5,3 + 2,4 = ?", correctAnswer: "7,7", options: ["7,7", "7,6", "7,8", "6,7"] },
  { question: "4,8 + 1,1 = ?", correctAnswer: "5,9", options: ["5,9", "6,0", "5,8", "4,9"] },
  { question: "6,2 + 2,5 = ?", correctAnswer: "8,7", options: ["8,7", "8,8", "8,6", "9,7"] },
  { question: "3,9 + 0,6 = ?", correctAnswer: "4,5", options: ["4,5", "4,4", "4,6", "3,5"] },
  { question: "7,1 + 1,8 = ?", correctAnswer: "8,9", options: ["8,9", "9,0", "8,8", "7,9"] },
  { question: "0,5 + 0,3 = ?", correctAnswer: "0,8", options: ["0,8", "0,9", "0,7", "1,8"] },
  { question: "1,7 + 1,3 = ?", correctAnswer: "3,0", options: ["3,0", "2,0", "3,1", "2,9"] },
  { question: "5,4 − 2,1 = ?", correctAnswer: "3,3", options: ["3,3", "3,2", "3,4", "2,3"] },
  { question: "7,8 − 3,5 = ?", correctAnswer: "4,3", options: ["4,3", "4,2", "4,4", "5,3"] },
  { question: "4,6 − 1,4 = ?", correctAnswer: "3,2", options: ["3,2", "3,1", "3,3", "2,2"] },
  { question: "9,5 − 4,3 = ?", correctAnswer: "5,2", options: ["5,2", "5,1", "5,3", "4,2"] },
  { question: "6,0 − 2,7 = ?", correctAnswer: "3,3", options: ["3,3", "3,2", "3,4", "4,3"] },
  { question: "8,4 − 5,1 = ?", correctAnswer: "3,3", options: ["3,3", "3,2", "3,4", "2,3"] },
  { question: "3,5 − 1,9 = ?", correctAnswer: "1,6", options: ["1,6", "1,5", "1,7", "2,6"] },
  { question: "5,0 − 2,5 = ?", correctAnswer: "2,5", options: ["2,5", "2,4", "2,6", "3,5"] },
  { question: "2,8 − 0,6 = ?", correctAnswer: "2,2", options: ["2,2", "2,1", "2,3", "1,2"] },
  { question: "10,0 − 4,3 = ?", correctAnswer: "5,7", options: ["5,7", "5,6", "5,8", "6,7"] },
  { question: "1,5 + 3,5 = ?", correctAnswer: "5,0", options: ["5,0", "4,0", "5,1", "4,9"] },
  { question: "0,9 + 0,1 = ?", correctAnswer: "1,0", options: ["1,0", "0,10", "1,1", "0,9"] },
  { question: "4,3 + 2,7 = ?", correctAnswer: "7,0", options: ["7,0", "6,0", "7,1", "6,9"] },
  { question: "8,6 − 6,4 = ?", correctAnswer: "2,2", options: ["2,2", "2,1", "2,3", "3,2"] },
  { question: "3,0 − 1,5 = ?", correctAnswer: "1,5", options: ["1,5", "1,4", "1,6", "2,5"] },
  { question: "6,7 + 2,3 = ?", correctAnswer: "9,0", options: ["9,0", "8,0", "9,1", "8,9"] },
  { question: "7,5 − 3,5 = ?", correctAnswer: "4,0", options: ["4,0", "3,0", "4,1", "3,9"] },
  { question: "0,8 + 0,4 = ?", correctAnswer: "1,2", options: ["1,2", "1,3", "0,12", "1,1"] },
  { question: "5,6 − 2,8 = ?", correctAnswer: "2,8", options: ["2,8", "2,7", "2,9", "3,8"] },
  { question: "9,2 − 4,7 = ?", correctAnswer: "4,5", options: ["4,5", "4,4", "4,6", "5,5"] },
];

// Level 2: čísla s 2 desetinnými místy
const POOL_L2: PracticeTask[] = [
  { question: "1,25 + 2,50 = ?", correctAnswer: "3,75", options: ["3,75", "3,85", "3,65", "4,75"] },
  { question: "3,14 + 1,36 = ?", correctAnswer: "4,50", options: ["4,50", "4,40", "4,60", "3,50"] },
  { question: "5,60 + 2,35 = ?", correctAnswer: "7,95", options: ["7,95", "7,85", "8,05", "6,95"] },
  { question: "4,08 + 3,12 = ?", correctAnswer: "7,20", options: ["7,20", "7,10", "7,30", "6,20"] },
  { question: "2,75 + 1,25 = ?", correctAnswer: "4,00", options: ["4,00", "3,00", "4,10", "3,90"] },
  { question: "6,50 + 1,75 = ?", correctAnswer: "8,25", options: ["8,25", "8,15", "8,35", "7,25"] },
  { question: "0,75 + 0,50 = ?", correctAnswer: "1,25", options: ["1,25", "1,15", "1,35", "0,125"] },
  { question: "3,99 + 0,01 = ?", correctAnswer: "4,00", options: ["4,00", "3,99", "4,01", "3,00"] },
  { question: "7,35 − 2,15 = ?", correctAnswer: "5,20", options: ["5,20", "5,10", "5,30", "4,20"] },
  { question: "9,80 − 4,55 = ?", correctAnswer: "5,25", options: ["5,25", "5,15", "5,35", "4,25"] },
  { question: "6,00 − 2,75 = ?", correctAnswer: "3,25", options: ["3,25", "3,15", "3,35", "4,25"] },
  { question: "5,50 − 1,25 = ?", correctAnswer: "4,25", options: ["4,25", "4,15", "4,35", "3,25"] },
  { question: "8,20 − 3,45 = ?", correctAnswer: "4,75", options: ["4,75", "4,65", "4,85", "5,75"] },
  { question: "10,00 − 3,75 = ?", correctAnswer: "6,25", options: ["6,25", "6,15", "6,35", "7,25"] },
  { question: "4,50 − 2,50 = ?", correctAnswer: "2,00", options: ["2,00", "1,00", "2,10", "1,90"] },
  { question: "1,05 + 2,95 = ?", correctAnswer: "4,00", options: ["4,00", "3,00", "4,01", "3,99"] },
  { question: "3,72 + 1,28 = ?", correctAnswer: "5,00", options: ["5,00", "4,00", "5,10", "4,90"] },
  { question: "7,00 − 2,50 = ?", correctAnswer: "4,50", options: ["4,50", "4,40", "4,60", "5,50"] },
  { question: "2,34 + 3,66 = ?", correctAnswer: "6,00", options: ["6,00", "5,00", "6,10", "5,90"] },
  { question: "8,15 − 4,05 = ?", correctAnswer: "4,10", options: ["4,10", "4,00", "4,20", "3,10"] },
  { question: "1,50 + 2,75 = ?", correctAnswer: "4,25", options: ["4,25", "4,15", "4,35", "3,25"] },
  { question: "6,25 − 3,50 = ?", correctAnswer: "2,75", options: ["2,75", "2,65", "2,85", "3,75"] },
  { question: "0,25 + 0,75 = ?", correctAnswer: "1,00", options: ["1,00", "0,10", "1,10", "0,90"] },
  { question: "5,00 − 1,35 = ?", correctAnswer: "3,65", options: ["3,65", "3,55", "3,75", "4,65"] },
  { question: "9,00 − 5,25 = ?", correctAnswer: "3,75", options: ["3,75", "3,65", "3,85", "4,75"] },
];

// Level 3: kombinované příklady, přechod přes celé číslo
const POOL_L3: PracticeTask[] = [
  { question: "3,75 + 2,50 − 1,25 = ?", correctAnswer: "5,00", options: ["5,00", "4,00", "5,10", "4,90"] },
  { question: "10,00 − 3,45 − 2,55 = ?", correctAnswer: "4,00", options: ["4,00", "3,00", "4,01", "3,99"] },
  { question: "1,99 + 3,01 = ?", correctAnswer: "5,00", options: ["5,00", "4,00", "5,10", "4,90"] },
  { question: "8,05 − 4,95 = ?", correctAnswer: "3,10", options: ["3,10", "3,00", "3,20", "4,10"] },
  { question: "0,99 + 0,01 = ?", correctAnswer: "1,00", options: ["1,00", "0,10", "1,01", "0,99"] },
  { question: "5,25 + 2,75 + 1,00 = ?", correctAnswer: "9,00", options: ["9,00", "8,00", "9,10", "8,90"] },
  { question: "7,00 − 1,35 − 2,65 = ?", correctAnswer: "3,00", options: ["3,00", "2,00", "3,10", "2,90"] },
  { question: "2,50 + 2,50 + 2,50 = ?", correctAnswer: "7,50", options: ["7,50", "6,50", "7,60", "8,50"] },
  { question: "6,30 − 2,85 = ?", correctAnswer: "3,45", options: ["3,45", "3,35", "3,55", "4,45"] },
  { question: "4,00 − 1,75 − 0,25 = ?", correctAnswer: "2,00", options: ["2,00", "1,00", "2,10", "1,90"] },
  { question: "9,99 + 0,01 = ?", correctAnswer: "10,00", options: ["10,00", "9,00", "10,01", "9,99"] },
  { question: "3,33 + 3,33 + 3,34 = ?", correctAnswer: "10,00", options: ["10,00", "9,00", "10,01", "9,99"] },
  { question: "12,50 − 7,75 = ?", correctAnswer: "4,75", options: ["4,75", "4,65", "4,85", "5,75"] },
  { question: "0,50 + 1,50 + 2,50 = ?", correctAnswer: "4,50", options: ["4,50", "3,50", "4,60", "5,50"] },
  { question: "6,00 + 1,75 − 3,25 = ?", correctAnswer: "4,50", options: ["4,50", "3,50", "4,60", "5,50"] },
  { question: "8,08 − 4,04 = ?", correctAnswer: "4,04", options: ["4,04", "3,04", "4,14", "5,04"] },
  { question: "1,11 + 2,22 + 3,33 = ?", correctAnswer: "6,66", options: ["6,66", "5,66", "6,76", "7,66"] },
  { question: "5,75 + 4,25 = ?", correctAnswer: "10,00", options: ["10,00", "9,00", "10,10", "9,90"] },
  { question: "15,00 − 8,50 − 1,25 = ?", correctAnswer: "5,25", options: ["5,25", "4,25", "5,35", "6,25"] },
  { question: "3,60 + 2,40 + 1,50 = ?", correctAnswer: "7,50", options: ["7,50", "6,50", "7,60", "8,50"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SCITANIAODCITANIDESETINNYCHCISEL: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-scitani-a-odcitani-desetinnych-cisel",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-scitani-a-odcitani-desetinnych-cisel",
    title: "Sčítání a odčítání desetinných čísel",
    studentTitle: "Sčítání desetinných",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Velká čísla a desetinná čísla",
    briefDescription: "Sečteš a odečteš desetinná čísla pod sebou.",
    keywords: ["sčítání", "odčítání", "desetinná čísla", "desetinná čárka", "zarovnání"],
    goals: [
      "Sečíst dvě desetinná čísla s 1 nebo 2 desetinnými místy",
      "Odečíst dvě desetinná čísla s 1 nebo 2 desetinnými místy",
      "Zarovnat desetinné čárky při písemném výpočtu",
    ],
    boundaries: ["Bez záporných výsledků", "Bez násobení a dělení desetinných čísel"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Při sčítání a odčítání desetinných čísel nejprve zarovnej desetinné čárky pod sebe. Pak počítej jako s celými čísly.",
      steps: [
        "Zapiš čísla pod sebe tak, aby desetinné čárky byly v jedné svislé linii.",
        "Doplň nuly tam, kde chybí číslice (3,5 = 3,50).",
        "Sčítej nebo odčítej od zprava doleva.",
        "Přenes desetinnou čárku dolů do výsledku.",
      ],
      commonMistake: "Chyba: 3,5 + 1,25 = 4,75 ale žáci píší 4,30. Správně: 3,50 + 1,25 = 4,75.",
      example: "3,7 + 1,25: zapiš jako 3,70 + 1,25 = 4,95.",
    },
  },
];
