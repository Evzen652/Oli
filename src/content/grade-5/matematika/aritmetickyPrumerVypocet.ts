import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: průměr ze 3 čísel, jednoduchá čísla
const POOL_L1: PracticeTask[] = [
  { question: "Průměr čísel 2, 4, 6 = ?", correctAnswer: "4", options: ["4", "3", "5", "6"] },
  { question: "Průměr čísel 1, 3, 5 = ?", correctAnswer: "3", options: ["3", "2", "4", "5"] },
  { question: "Průměr čísel 4, 6, 8 = ?", correctAnswer: "6", options: ["6", "5", "7", "8"] },
  { question: "Průměr čísel 10, 20, 30 = ?", correctAnswer: "20", options: ["20", "15", "25", "30"] },
  { question: "Průměr čísel 3, 6, 9 = ?", correctAnswer: "6", options: ["6", "5", "7", "9"] },
  { question: "Průměr čísel 5, 5, 5 = ?", correctAnswer: "5", options: ["5", "3", "10", "15"] },
  { question: "Průměr čísel 0, 6, 12 = ?", correctAnswer: "6", options: ["6", "4", "8", "18"] },
  { question: "Průměr čísel 8, 10, 12 = ?", correctAnswer: "10", options: ["10", "9", "11", "12"] },
  { question: "Průměr čísel 15, 20, 25 = ?", correctAnswer: "20", options: ["20", "18", "22", "25"] },
  { question: "Jak počítáme průměr?", correctAnswer: "Součet čísel dělený jejich počtem", options: ["Součet čísel dělený jejich počtem", "Největší číslo plus nejmenší", "Součin čísel", "Prostřední číslo"] },
  { question: "Průměr čísel 7, 9, 11 = ?", correctAnswer: "9", options: ["9", "8", "10", "11"] },
  { question: "Průměr čísel 100, 200, 300 = ?", correctAnswer: "200", options: ["200", "150", "250", "300"] },
  { question: "Průměr čísel 12, 14, 16 = ?", correctAnswer: "14", options: ["14", "13", "15", "16"] },
  { question: "Průměr čísel 20, 30, 40 = ?", correctAnswer: "30", options: ["30", "25", "35", "40"] },
  { question: "Průměr čísel 50, 50, 50 = ?", correctAnswer: "50", options: ["50", "100", "25", "150"] },
  { question: "Průměr čísel 6, 8, 10 = ?", correctAnswer: "8", options: ["8", "7", "9", "10"] },
  { question: "Průměr čísel 0, 0, 9 = ?", correctAnswer: "3", options: ["3", "0", "9", "4,5"] },
  { question: "Průměr čísel 40, 50, 60 = ?", correctAnswer: "50", options: ["50", "45", "55", "60"] },
  { question: "Průměr čísel 1, 2, 3 = ?", correctAnswer: "2", options: ["2", "1", "3", "6"] },
  { question: "Průměr čísel 9, 12, 15 = ?", correctAnswer: "12", options: ["12", "10", "14", "13"] },
];

// Level 2: průměr ze 4–5 čísel
const POOL_L2: PracticeTask[] = [
  { question: "Průměr čísel 2, 4, 6, 8 = ?", correctAnswer: "5", options: ["5", "4", "6", "20"] },
  { question: "Průměr čísel 10, 20, 30, 40 = ?", correctAnswer: "25", options: ["25", "20", "30", "100"] },
  { question: "Průměr čísel 5, 10, 15, 20 = ?", correctAnswer: "12,5", options: ["12,5", "10", "15", "50"] },
  { question: "Průměr čísel 3, 5, 7, 9, 11 = ?", correctAnswer: "7", options: ["7", "6", "8", "35"] },
  { question: "Průměr čísel 12, 16, 20, 24 = ?", correctAnswer: "18", options: ["18", "16", "20", "72"] },
  { question: "Tři žáci dostali za test: 8, 6, 10. Jaký byl jejich průměr?", correctAnswer: "8", options: ["8", "6", "10", "7"] },
  { question: "Průměr čísel 1, 3, 5, 7, 9 = ?", correctAnswer: "5", options: ["5", "4", "6", "25"] },
  { question: "Čtyři dni teploty: 18, 20, 22, 24 °C. Průměrná teplota?", correctAnswer: "21 °C", options: ["21 °C", "20 °C", "22 °C", "84 °C"] },
  { question: "Průměr čísel 25, 35, 45, 55 = ?", correctAnswer: "40", options: ["40", "35", "45", "160"] },
  { question: "Průměr čísel 100, 80, 60, 40, 20 = ?", correctAnswer: "60", options: ["60", "50", "70", "300"] },
  { question: "Hanka naměřila výšky: 152, 158, 162, 168 cm. Průměrná výška?", correctAnswer: "160 cm", options: ["160 cm", "155 cm", "165 cm", "640 cm"] },
  { question: "Průměr čísel 14, 18, 22, 26 = ?", correctAnswer: "20", options: ["20", "18", "22", "80"] },
  { question: "Průměr čísel 7, 9, 11, 13, 15 = ?", correctAnswer: "11", options: ["11", "10", "12", "55"] },
  { question: "Jan zaběhl: 200, 250, 300, 350 m. Průměr?", correctAnswer: "275 m", options: ["275 m", "250 m", "300 m", "1100 m"] },
  { question: "Průměr čísel 4, 8, 12, 16, 20 = ?", correctAnswer: "12", options: ["12", "10", "14", "60"] },
  { question: "Průměr čísel 30, 40, 50, 60, 70 = ?", correctAnswer: "50", options: ["50", "40", "60", "250"] },
  { question: "Průměr čísel 6, 9, 12, 15 = ?", correctAnswer: "10,5", options: ["10,5", "10", "11", "42"] },
  { question: "Průměr čísel 100, 100, 200, 200 = ?", correctAnswer: "150", options: ["150", "100", "200", "600"] },
];

// Level 3: průměr v příkladech ze života, hledání chybějícího čísla
const POOL_L3: PracticeTask[] = [
  { question: "Průměr čísel 3, 7, ?, 11 je 8. Jaké je chybějící číslo?", correctAnswer: "11", options: ["11", "8", "9", "12"] },
  { question: "Průměr čísel 5, ?, 15 je 10. Jaké je chybějící číslo?", correctAnswer: "10", options: ["10", "8", "12", "15"] },
  { question: "Průměr 4 čísel je 12. Jejich součet je?", correctAnswer: "48", options: ["48", "16", "36", "3"] },
  { question: "Průměr 5 čísel je 20. Jejich součet je?", correctAnswer: "100", options: ["100", "25", "4", "15"] },
  { question: "Žák dostal za tři testy: 7, 9, ?. Průměr je 8. Jakou dostanete za třetí test?", correctAnswer: "8", options: ["8", "6", "10", "7"] },
  { question: "Teploty 5 dní: 18, 20, 22, ?, 26 °C. Průměr je 22 °C. Jaká byla čtvrtá teplota?", correctAnswer: "24 °C", options: ["24 °C", "22 °C", "20 °C", "26 °C"] },
  { question: "Průměr čísel 15, 25, 35 = ?", correctAnswer: "25", options: ["25", "20", "30", "75"] },
  { question: "Průměr čísel 11, 13, 15, 17, 19 = ?", correctAnswer: "15", options: ["15", "14", "16", "75"] },
  { question: "Tři skupiny: A = 24 bodů, B = 36 bodů, C = 30 bodů. Průměr bodů skupin?", correctAnswer: "30", options: ["30", "28", "32", "90"] },
  { question: "Průměr čísel 2, 4, 6, 8, 10, 12 = ?", correctAnswer: "7", options: ["7", "6", "8", "42"] },
  { question: "Průměr je 15. Jsou čtyři čísla. Tři jsou 10, 15, 20. Jaké je čtvrté?", correctAnswer: "15", options: ["15", "10", "20", "25"] },
  { question: "Průměr 3 čísel je 9. Dvě čísla jsou 6 a 12. Jaké je třetí?", correctAnswer: "9", options: ["9", "6", "12", "3"] },
  { question: "Průměrná výška 4 dětí je 155 cm. Součet výšek?", correctAnswer: "620 cm", options: ["620 cm", "600 cm", "640 cm", "155 cm"] },
  { question: "Průměr čísel 50, 70, 90, 110 = ?", correctAnswer: "80", options: ["80", "70", "90", "320"] },
  { question: "Škola má průměrně 28 žáků ve třídě. Je 6 tříd. Kolik je celkem žáků?", correctAnswer: "168", options: ["168", "28", "34", "180"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ARITMETICKYPRUMERVYPOCET: TopicMetadata[] = [
  {
    id: "g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-aritmeticky-prumer-vypocet",
    rvpNodeId: "g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-aritmeticky-prumer-vypocet",
    title: "Aritmetický průměr - výpočet",
    studentTitle: "Průměr čísel",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Spočítáš průměr ze skupiny čísel.",
    keywords: ["průměr", "průměrná hodnota", "součet", "dělení", "data"],
    goals: [
      "Vypočítat průměr ze 3–5 čísel",
      "Pochopit, co průměr znamená",
      "Použít průměr v praktických situacích",
      "Najít chybějící číslo, je-li znám průměr",
    ],
    boundaries: ["Bez váženého průměru", "Bez záporných čísel v průměru"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Průměr = součet všech čísel ÷ počet čísel. Příklad: průměr 4, 6, 8 = (4+6+8) ÷ 3 = 18 ÷ 3 = 6.",
      steps: [
        "Sečti všechna čísla dohromady.",
        "Zjisti, kolik čísel máš.",
        "Výsledek sčítání vydělej počtem čísel.",
        "To je průměr.",
      ],
      commonMistake: "Chyba: zapomenout vydělit počtem čísel, nebo spočítat špatně počet čísel.",
      example: "Průměr 3, 5, 7, 9: součet = 24, počet = 4, průměr = 24 ÷ 4 = 6.",
    },
  },
];
