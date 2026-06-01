import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: počítání čtverečků, základní obsah
const POOL_L1: PracticeTask[] = [
  { question: "Obdélník ve čtvercové síti je 4 čtverečky široký a 3 čtverečky vysoký. Kolik čtverečků pokrývá?", correctAnswer: "12", options: ["12", "14", "10", "7"] },
  { question: "Čtverec ve čtvercové síti má stranu 3 čtverečky. Kolik čtverečků pokrývá?", correctAnswer: "9", options: ["9", "12", "6", "3"] },
  { question: "Obrazec ve čtvercové síti pokrývá 8 čtverečků. Jaký je jeho obsah, pokud 1 čtvereček = 1 cm²?", correctAnswer: "8 cm²", options: ["8 cm²", "8 cm", "4 cm²", "16 cm²"] },
  { question: "Obdélník 5 × 2 čtverečků. Kolik čtverečků pokrývá?", correctAnswer: "10", options: ["10", "14", "7", "25"] },
  { question: "Čtverec se stranou 4 čtverečky. Kolik čtverečků pokrývá?", correctAnswer: "16", options: ["16", "8", "12", "4"] },
  { question: "Obdélník 6 × 3 čtverečků. Kolik čtverečků pokrývá?", correctAnswer: "18", options: ["18", "9", "15", "36"] },
  { question: "Obdélník ve čtvercové síti má obsah 20 čtverečků. Pokud je 5 čtverečků wide, jak je vysoký?", correctAnswer: "4 čtverečky", options: ["4 čtverečky", "5 čtverečků", "15 čtverečků", "25 čtverečků"] },
  { question: "Jaká je jednotka obsahu?", correctAnswer: "cm², m², km²", options: ["cm², m², km²", "cm, m, km", "cm³, m³", "g, kg"] },
  { question: "Obsah obdélníku 3 cm × 5 cm = ?", correctAnswer: "15 cm²", options: ["15 cm²", "16 cm", "8 cm", "15 cm"] },
  { question: "Obsah čtverce se stranou 6 cm = ?", correctAnswer: "36 cm²", options: ["36 cm²", "24 cm", "12 cm²", "36 cm"] },
  { question: "Obrazec pokrývá 15 čtverečků (každý 1 m²). Jaký je jeho obsah?", correctAnswer: "15 m²", options: ["15 m²", "15 m", "15 km²", "15 cm²"] },
  { question: "Obdélník 7 × 4 čtverečků. Kolik čtverečků pokrývá?", correctAnswer: "28", options: ["28", "22", "11", "14"] },
  { question: "Co je obsah obrazce?", correctAnswer: "Plocha, kterou obrazec pokrývá", options: ["Plocha, kterou obrazec pokrývá", "Délka obvodu", "Výška obrazce", "Počet vrcholů"] },
  { question: "Obsah obdélníku 10 cm × 4 cm = ?", correctAnswer: "40 cm²", options: ["40 cm²", "28 cm", "14 cm²", "40 cm"] },
  { question: "Čtverec ve čtvercové síti má stranu 5 čtverečků. Kolik čtverečků pokrývá?", correctAnswer: "25", options: ["25", "20", "10", "5"] },
  { question: "Obdélník 8 × 2 čtverečků. Kolik čtverečků pokrývá?", correctAnswer: "16", options: ["16", "20", "10", "6"] },
  { question: "Obsah čtverce se stranou 9 cm = ?", correctAnswer: "81 cm²", options: ["81 cm²", "36 cm", "18 cm²", "81 cm"] },
  { question: "Obdélník ve čtvercové síti: šířka 4, výška 6. Obsah?", correctAnswer: "24 čtverečků", options: ["24 čtverečků", "20 čtverečků", "10 čtverečků", "48 čtverečků"] },
  { question: "Obsah obdélníku 2 cm × 9 cm = ?", correctAnswer: "18 cm²", options: ["18 cm²", "22 cm", "11 cm²", "18 cm"] },
  { question: "Co je čtvercová síť?", correctAnswer: "Mřížka z čtverců stejné velikosti", options: ["Mřížka z čtverců stejné velikosti", "Síť z trojúhelníků", "Souřadnicová soustava", "Pravítko"] },
];

// Level 2: převody jednotek obsahu
const POOL_L2: PracticeTask[] = [
  { question: "1 m² = ? cm²", correctAnswer: "10 000 cm²", options: ["10 000 cm²", "100 cm²", "1 000 cm²", "1 000 000 cm²"] },
  { question: "1 km² = ? m²", correctAnswer: "1 000 000 m²", options: ["1 000 000 m²", "100 000 m²", "10 000 m²", "1000 m²"] },
  { question: "3 m² = ? cm²", correctAnswer: "30 000 cm²", options: ["30 000 cm²", "3 000 cm²", "300 cm²", "300 000 cm²"] },
  { question: "50 000 cm² = ? m²", correctAnswer: "5 m²", options: ["5 m²", "0,5 m²", "50 m²", "500 m²"] },
  { question: "2 km² = ? m²", correctAnswer: "2 000 000 m²", options: ["2 000 000 m²", "200 000 m²", "20 000 m²", "2000 m²"] },
  { question: "20 000 cm² = ? m²", correctAnswer: "2 m²", options: ["2 m²", "0,2 m²", "20 m²", "200 m²"] },
  { question: "Pokoj má obsah 20 m². Kolik cm² to je?", correctAnswer: "200 000 cm²", options: ["200 000 cm²", "2 000 cm²", "20 000 cm²", "2 000 000 cm²"] },
  { question: "Fotbalové hřiště má obsah 7 140 m². Kolik km² to je (přibližně)?", correctAnswer: "asi 0,007 km²", options: ["asi 0,007 km²", "asi 7 km²", "asi 0,7 km²", "asi 0,07 km²"] },
  { question: "1 ha (hektar) = 10 000 m². Kolik hektarů je 50 000 m²?", correctAnswer: "5 ha", options: ["5 ha", "50 ha", "0,5 ha", "500 ha"] },
  { question: "Školní pozemek má 1,5 m² záhonků. Kolik cm² to je?", correctAnswer: "15 000 cm²", options: ["15 000 cm²", "1 500 cm²", "150 000 cm²", "150 cm²"] },
  { question: "Která jednotka obsahu je největší: cm², m², km²?", correctAnswer: "km²", options: ["km²", "m²", "cm²", "jsou stejné"] },
  { question: "Která jednotka obsahu je nejmenší: cm², m², km²?", correctAnswer: "cm²", options: ["cm²", "m²", "km²", "jsou stejné"] },
  { question: "0,5 m² = ? cm²", correctAnswer: "5 000 cm²", options: ["5 000 cm²", "500 cm²", "50 000 cm²", "50 cm²"] },
  { question: "100 000 m² = ? km²", correctAnswer: "0,1 km²", options: ["0,1 km²", "1 km²", "10 km²", "0,01 km²"] },
  { question: "Stůl má plochu 7 500 cm². Kolik m² to je?", correctAnswer: "0,75 m²", options: ["0,75 m²", "7,5 m²", "75 m²", "0,075 m²"] },
];

// Level 3: kombinace — obsah a převody, slovní úlohy
const POOL_L3: PracticeTask[] = [
  { question: "Zahrádka je 12 m dlouhá a 8 m wide. Jaký má obsah?", correctAnswer: "96 m²", options: ["96 m²", "40 m", "80 m²", "48 m²"] },
  { question: "Místnost 5 m × 4 m. Kolik cm² dlaždic potřebujeme?", correctAnswer: "200 000 cm²", options: ["200 000 cm²", "20 000 cm²", "2 000 000 cm²", "2 000 cm²"] },
  { question: "Na záhon (2 m × 3 m) sázíme rostliny každých 25 cm. Kolik řad?", correctAnswer: "Záhon má 6 m² — záleží na uspořádání", options: ["Záhon má 6 m² — záleží na uspořádání", "24 rostlin", "12 rostlin", "6 rostlin"] },
  { question: "Čtverec má obsah 49 cm². Jak dlouhá je jeho strana?", correctAnswer: "7 cm", options: ["7 cm", "12,25 cm", "24,5 cm", "49 cm"] },
  { question: "Čtverec má obsah 64 cm². Jak dlouhá je jeho strana?", correctAnswer: "8 cm", options: ["8 cm", "16 cm", "32 cm", "64 cm"] },
  { question: "Obdélník má obsah 72 cm² a výšku 8 cm. Jak je wide?", correctAnswer: "9 cm", options: ["9 cm", "8 cm", "10 cm", "64 cm"] },
  { question: "Obdélník 15 cm × 6 cm. Obsah?", correctAnswer: "90 cm²", options: ["90 cm²", "42 cm", "21 cm²", "900 cm²"] },
  { question: "Čtverec se stranou 12 cm. Obsah?", correctAnswer: "144 cm²", options: ["144 cm²", "48 cm", "24 cm²", "1 440 cm²"] },
  { question: "Porovnej obsah: čtverec se stranou 5 cm vs. obdélník 6 cm × 4 cm. Který je větší?", correctAnswer: "Čtverec (25 cm²) je větší než obdélník (24 cm²)", options: ["Čtverec (25 cm²) je větší než obdélník (24 cm²)", "Obdélník (24 cm²) je větší", "jsou stejné", "nelze porovnat"] },
  { question: "Stěna 3 m × 2,5 m. Obsah v cm²?", correctAnswer: "750 000 cm²", options: ["750 000 cm²", "75 000 cm²", "7 500 cm²", "7 500 000 cm²"] },
  { question: "Zahrada 30 m × 25 m. Obsah v m²? A v km²?", correctAnswer: "750 m² = 0,00075 km²", options: ["750 m² = 0,00075 km²", "55 m = 0,0055 km²", "750 m² = 0,075 km²", "7 500 m² = 0,0075 km²"] },
  { question: "Obrazec se skládá z obdélníku 4×3 a přilepeného čtverce se stranou 2. Celkový obsah?", correctAnswer: "16 cm²", options: ["16 cm²", "20 cm²", "12 cm²", "24 cm²"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const OBSAHOBRAZCEVECTVERCOVESITIJEDNOTKYOBSAHU: TopicMetadata[] = [
  {
    id: "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu",
    rvpNodeId: "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu",
    title: "Obsah obrazce ve čtvercové síti, jednotky obsahu",
    studentTitle: "Obsah tvaru",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Konstrukce a obsah",
    briefDescription: "Zjistíš obsah obrazce ve čtvercové síti a jednotky obsahu.",
    keywords: ["obsah", "čtvercová síť", "plocha", "cm²", "m²", "km²", "převody jednotek"],
    goals: [
      "Zjistit obsah obrazce ve čtvercové síti počítáním čtverečků",
      "Vypočítat obsah obdélníku a čtverce",
      "Znát jednotky obsahu: cm², m², km²",
      "Převádět mezi jednotkami obsahu",
    ],
    boundaries: ["Bez obsahu trojúhelníku vzorcem", "Bez obsahu kruhu"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Obsah = počet čtverečků ve čtvercové síti. Pro obdélník: obsah = délka × šířka. Jednotky: 1 m² = 10 000 cm², 1 km² = 1 000 000 m².",
      steps: [
        "Spočítej, kolik čtverečků obrazec pokrývá.",
        "Každý čtvereček má obsah = 1 jednotka² (cm², m², ...).",
        "Pro obdélník: obsah = délka × šířka.",
        "Nezapomeň na správnou jednotku (cm², m², km²).",
      ],
      commonMistake: "Chyba: záměna obvodu (délka okraje) a obsahu (plocha uvnitř). Obsah je v čtvercových jednotkách (cm²).",
      example: "Obdélník 4 × 3 čtverečky: obsah = 4 × 3 = 12 čtverečků = 12 cm² (pokud je 1 čtvereček = 1 cm²).",
    },
  },
];
