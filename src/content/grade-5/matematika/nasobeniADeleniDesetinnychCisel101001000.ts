import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: násobení ×10
const POOL_L1: PracticeTask[] = [
  { question: "3,14 × 10 = ?", correctAnswer: "31,4", options: ["31,4", "314", "3,14", "3140"] },
  { question: "2,5 × 10 = ?", correctAnswer: "25", options: ["25", "250", "2,5", "2500"] },
  { question: "0,7 × 10 = ?", correctAnswer: "7", options: ["7", "70", "0,7", "0,07"] },
  { question: "1,35 × 10 = ?", correctAnswer: "13,5", options: ["13,5", "135", "1,35", "1350"] },
  { question: "4,8 × 10 = ?", correctAnswer: "48", options: ["48", "480", "4,8", "4800"] },
  { question: "0,06 × 10 = ?", correctAnswer: "0,6", options: ["0,6", "6", "0,06", "60"] },
  { question: "5,0 × 10 = ?", correctAnswer: "50", options: ["50", "500", "5,0", "5000"] },
  { question: "7,25 × 10 = ?", correctAnswer: "72,5", options: ["72,5", "725", "7,25", "7250"] },
  { question: "0,1 × 10 = ?", correctAnswer: "1", options: ["1", "10", "0,1", "100"] },
  { question: "9,9 × 10 = ?", correctAnswer: "99", options: ["99", "990", "9,9", "9900"] },
  { question: "36 ÷ 10 = ?", correctAnswer: "3,6", options: ["3,6", "0,36", "360", "36"] },
  { question: "45 ÷ 10 = ?", correctAnswer: "4,5", options: ["4,5", "0,45", "450", "45"] },
  { question: "120 ÷ 10 = ?", correctAnswer: "12", options: ["12", "1,2", "1200", "120"] },
  { question: "7 ÷ 10 = ?", correctAnswer: "0,7", options: ["0,7", "7", "0,07", "70"] },
  { question: "250 ÷ 10 = ?", correctAnswer: "25", options: ["25", "2,5", "2500", "250"] },
  { question: "0,5 × 10 = ?", correctAnswer: "5", options: ["5", "50", "0,5", "500"] },
  { question: "3,0 × 10 = ?", correctAnswer: "30", options: ["30", "300", "3,0", "3000"] },
  { question: "83 ÷ 10 = ?", correctAnswer: "8,3", options: ["8,3", "0,83", "830", "83"] },
  { question: "6,7 × 10 = ?", correctAnswer: "67", options: ["67", "670", "6,7", "6700"] },
  { question: "500 ÷ 10 = ?", correctAnswer: "50", options: ["50", "5", "5000", "500"] },
  { question: "0,25 × 10 = ?", correctAnswer: "2,5", options: ["2,5", "25", "0,25", "250"] },
  { question: "18 ÷ 10 = ?", correctAnswer: "1,8", options: ["1,8", "0,18", "180", "18"] },
  { question: "4,05 × 10 = ?", correctAnswer: "40,5", options: ["40,5", "405", "4,05", "4050"] },
  { question: "90 ÷ 10 = ?", correctAnswer: "9", options: ["9", "0,9", "900", "90"] },
  { question: "0,03 × 10 = ?", correctAnswer: "0,3", options: ["0,3", "3", "0,03", "30"] },
];

// Level 2: násobení ×100
const POOL_L2: PracticeTask[] = [
  { question: "3,14 × 100 = ?", correctAnswer: "314", options: ["314", "31,4", "3140", "3,14"] },
  { question: "2,5 × 100 = ?", correctAnswer: "250", options: ["250", "25", "2500", "2,5"] },
  { question: "0,07 × 100 = ?", correctAnswer: "7", options: ["7", "0,7", "70", "700"] },
  { question: "1,35 × 100 = ?", correctAnswer: "135", options: ["135", "13,5", "1350", "1,35"] },
  { question: "4,08 × 100 = ?", correctAnswer: "408", options: ["408", "40,8", "4080", "4,08"] },
  { question: "700 ÷ 100 = ?", correctAnswer: "7", options: ["7", "70", "0,7", "700"] },
  { question: "345 ÷ 100 = ?", correctAnswer: "3,45", options: ["3,45", "34,5", "0,345", "345"] },
  { question: "60 ÷ 100 = ?", correctAnswer: "0,6", options: ["0,6", "6", "0,06", "60"] },
  { question: "1200 ÷ 100 = ?", correctAnswer: "12", options: ["12", "1,2", "120", "1200"] },
  { question: "9 ÷ 100 = ?", correctAnswer: "0,09", options: ["0,09", "0,9", "9", "90"] },
  { question: "0,5 × 100 = ?", correctAnswer: "50", options: ["50", "5", "500", "0,5"] },
  { question: "0,03 × 100 = ?", correctAnswer: "3", options: ["3", "0,3", "30", "300"] },
  { question: "7,25 × 100 = ?", correctAnswer: "725", options: ["725", "72,5", "7250", "7,25"] },
  { question: "500 ÷ 100 = ?", correctAnswer: "5", options: ["5", "0,5", "50", "500"] },
  { question: "840 ÷ 100 = ?", correctAnswer: "8,4", options: ["8,4", "84", "0,84", "840"] },
  { question: "0,15 × 100 = ?", correctAnswer: "15", options: ["15", "1,5", "150", "0,15"] },
  { question: "6,8 × 100 = ?", correctAnswer: "680", options: ["680", "68", "6800", "6,8"] },
  { question: "250 ÷ 100 = ?", correctAnswer: "2,5", options: ["2,5", "25", "0,25", "2500"] },
  { question: "0,01 × 100 = ?", correctAnswer: "1", options: ["1", "0,1", "10", "100"] },
  { question: "3600 ÷ 100 = ?", correctAnswer: "36", options: ["36", "3,6", "360", "3600"] },
  { question: "1,5 × 100 = ?", correctAnswer: "150", options: ["150", "15", "1500", "1,5"] },
  { question: "75 ÷ 100 = ?", correctAnswer: "0,75", options: ["0,75", "7,5", "0,075", "75"] },
  { question: "2,02 × 100 = ?", correctAnswer: "202", options: ["202", "20,2", "2020", "2,02"] },
  { question: "400 ÷ 100 = ?", correctAnswer: "4", options: ["4", "0,4", "40", "400"] },
  { question: "0,08 × 100 = ?", correctAnswer: "8", options: ["8", "0,8", "80", "800"] },
];

// Level 3: násobení ×1000 a kombinace
const POOL_L3: PracticeTask[] = [
  { question: "3,14 × 1000 = ?", correctAnswer: "3140", options: ["3140", "314", "31400", "31,4"] },
  { question: "2,5 × 1000 = ?", correctAnswer: "2500", options: ["2500", "250", "25000", "2,5"] },
  { question: "0,007 × 1000 = ?", correctAnswer: "7", options: ["7", "0,7", "70", "700"] },
  { question: "4500 ÷ 1000 = ?", correctAnswer: "4,5", options: ["4,5", "45", "0,45", "4500"] },
  { question: "7000 ÷ 1000 = ?", correctAnswer: "7", options: ["7", "70", "0,7", "7000"] },
  { question: "1,25 × 1000 = ?", correctAnswer: "1250", options: ["1250", "125", "12500", "1,25"] },
  { question: "3500 ÷ 1000 = ?", correctAnswer: "3,5", options: ["3,5", "35", "0,35", "3500"] },
  { question: "0,001 × 1000 = ?", correctAnswer: "1", options: ["1", "0,1", "10", "100"] },
  { question: "Co se stane s desetinnou čárkou při násobení ×10?", correctAnswer: "Posune se o 1 místo doprava", options: ["Posune se o 1 místo doprava", "Posune se o 1 místo doleva", "Zůstane stejně", "Zmizí"] },
  { question: "Co se stane s desetinnou čárkou při dělení ÷100?", correctAnswer: "Posune se o 2 místa doleva", options: ["Posune se o 2 místa doleva", "Posune se o 2 místa doprava", "Zůstane stejně", "Zmizí"] },
  { question: "1,5 × 1000 = ?", correctAnswer: "1500", options: ["1500", "150", "15000", "1,5"] },
  { question: "8000 ÷ 1000 = ?", correctAnswer: "8", options: ["8", "80", "0,8", "8000"] },
  { question: "0,25 × 1000 = ?", correctAnswer: "250", options: ["250", "25", "2500", "0,25"] },
  { question: "6750 ÷ 1000 = ?", correctAnswer: "6,75", options: ["6,75", "67,5", "0,675", "6750"] },
  { question: "5 ÷ 1000 = ?", correctAnswer: "0,005", options: ["0,005", "0,05", "0,5", "5"] },
  { question: "2,5 × 10 × 10 = ?", correctAnswer: "250", options: ["250", "25", "2500", "2,5"] },
  { question: "3600 ÷ 100 ÷ 10 = ?", correctAnswer: "3,6", options: ["3,6", "36", "0,36", "360"] },
  { question: "0,1 × 1000 = ?", correctAnswer: "100", options: ["100", "10", "1000", "0,1"] },
  { question: "999 ÷ 1000 = ?", correctAnswer: "0,999", options: ["0,999", "9,99", "99,9", "999"] },
  { question: "4,5 × 100 = ? (výsledek porovnej s 4,5 × 10)", correctAnswer: "450 – desetkrát více než 45", options: ["450 (desetkrát více než 45)", "45 (stejné jako ×10)", "4500 (stokrát více)", "450 (stejné jako ×10)"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const NASOBENIADELENIDESETINNYCHCISEL101001000: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-nasobeni-a-deleni-desetinnych-cisel-10-100-1000",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-nasobeni-a-deleni-desetinnych-cisel-10-100-1000",
    title: "Násobení a dělení desetinných čísel 10, 100, 1000",
    studentTitle: "×10, ×100, ×1000",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Naučíš se násobit a dělit desetinná čísla desetkami a stovkami.",
    keywords: ["násobení desetinných čísel", "dělení desetinných čísel", "desetinná čárka", "10", "100", "1000"],
    goals: [
      "Násobit desetinné číslo deseti, stem nebo tisícem posunem desetinné čárky",
      "Dělit desetinné číslo deseti, stem nebo tisícem posunem desetinné čárky",
      "Vysvětlit pravidlo posunu desetinné čárky",
    ],
    boundaries: ["Bez obecného násobení dvou desetinných čísel", "Bez záporných čísel"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Při násobení ×10 posuň desetinnou čárku o 1 místo doprava. Při násobení ×100 o 2 místa, ×1000 o 3 místa. Při dělení naopak — doleva.",
      steps: [
        "Zjisti, čím násobíš nebo děláš: ×10, ×100, nebo ×1000.",
        "Spočítej počet nul: ×10 = 1 nula, ×100 = 2 nuly, ×1000 = 3 nuly.",
        "Posuň desetinnou čárku o tolik míst doprava (násobení) nebo doleva (dělení).",
        "Pokud chybí číslice, doplň nuly.",
      ],
      commonMistake: "Chyba: 3,14 × 100 = 31,4. Správně: 3,14 × 100 = 314 (čárka se posune o 2 místa).",
      example: "2,5 × 100: posunu čárku o 2 místa doprava → 250. Nebo: 350 ÷ 10 = 35,0 = 35.",
    },
  },
];
