import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: jednodušší dělení — výsledek je přesné celé číslo
const POOL_L1: PracticeTask[] = [
  { question: "312 ÷ 12 = ?", correctAnswer: "26", options: ["26", "24", "28", "27"] },
  { question: "504 ÷ 21 = ?", correctAnswer: "24", options: ["24", "22", "26", "23"] },
  { question: "840 ÷ 28 = ?", correctAnswer: "30", options: ["30", "28", "32", "29"] },
  { question: "396 ÷ 11 = ?", correctAnswer: "36", options: ["36", "34", "38", "37"] },
  { question: "480 ÷ 16 = ?", correctAnswer: "30", options: ["30", "28", "32", "24"] },
  { question: "675 ÷ 25 = ?", correctAnswer: "27", options: ["27", "25", "29", "26"] },
  { question: "520 ÷ 20 = ?", correctAnswer: "26", options: ["26", "24", "28", "25"] },
  { question: "756 ÷ 21 = ?", correctAnswer: "36", options: ["36", "34", "38", "37"] },
  { question: "330 ÷ 15 = ?", correctAnswer: "22", options: ["22", "20", "24", "21"] },
  { question: "540 ÷ 18 = ?", correctAnswer: "30", options: ["30", "28", "32", "29"] },
  { question: "728 ÷ 14 = ?", correctAnswer: "52", options: ["52", "50", "54", "48"] },
  { question: "864 ÷ 32 = ?", correctAnswer: "27", options: ["27", "25", "29", "26"] },
  { question: "420 ÷ 15 = ?", correctAnswer: "28", options: ["28", "26", "30", "27"] },
  { question: "990 ÷ 33 = ?", correctAnswer: "30", options: ["30", "28", "32", "29"] },
  { question: "616 ÷ 22 = ?", correctAnswer: "28", options: ["28", "26", "30", "27"] },
  { question: "630 ÷ 21 = ?", correctAnswer: "30", options: ["30", "28", "32", "29"] },
  { question: "572 ÷ 13 = ?", correctAnswer: "44", options: ["44", "42", "46", "43"] },
  { question: "480 ÷ 24 = ?", correctAnswer: "20", options: ["20", "18", "22", "21"] },
  { question: "714 ÷ 21 = ?", correctAnswer: "34", options: ["34", "32", "36", "33"] },
  { question: "552 ÷ 12 = ?", correctAnswer: "46", options: ["46", "44", "48", "45"] },
];

// Level 2: středně náročné dělení
const POOL_L2: PracticeTask[] = [
  { question: "682 ÷ 22 = ?", correctAnswer: "31", options: ["31", "29", "33", "32"] },
  { question: "775 ÷ 25 = ?", correctAnswer: "31", options: ["31", "29", "33", "30"] },
  { question: "936 ÷ 36 = ?", correctAnswer: "26", options: ["26", "24", "28", "25"] },
  { question: "812 ÷ 28 = ?", correctAnswer: "29", options: ["29", "27", "31", "28"] },
  { question: "957 ÷ 33 = ?", correctAnswer: "29", options: ["29", "27", "31", "30"] },
  { question: "1008 ÷ 36 = ?", correctAnswer: "28", options: ["28", "26", "30", "27"] },
  { question: "1122 ÷ 33 = ?", correctAnswer: "34", options: ["34", "32", "36", "33"] },
  { question: "845 ÷ 13 = ?", correctAnswer: "65", options: ["65", "63", "67", "64"] },
  { question: "756 ÷ 27 = ?", correctAnswer: "28", options: ["28", "26", "30", "27"] },
  { question: "1044 ÷ 36 = ?", correctAnswer: "29", options: ["29", "27", "31", "28"] },
  { question: "884 ÷ 26 = ?", correctAnswer: "34", options: ["34", "32", "36", "33"] },
  { question: "1105 ÷ 35 = ?", correctAnswer: "31 se zbytkem 20 — výsledek 31", options: ["31 se zbytkem 20 — výsledek 31", "32", "30", "31,5"] },
  { question: "672 ÷ 24 = ?", correctAnswer: "28", options: ["28", "26", "30", "27"] },
  { question: "858 ÷ 26 = ?", correctAnswer: "33", options: ["33", "31", "35", "32"] },
  { question: "988 ÷ 38 = ?", correctAnswer: "26", options: ["26", "24", "28", "25"] },
  { question: "1020 ÷ 34 = ?", correctAnswer: "30", options: ["30", "28", "32", "29"] },
  { question: "924 ÷ 33 = ?", correctAnswer: "28", options: ["28", "26", "30", "27"] },
  { question: "910 ÷ 35 = ?", correctAnswer: "26", options: ["26", "24", "28", "25"] },
  { question: "1218 ÷ 42 = ?", correctAnswer: "29", options: ["29", "27", "31", "28"] },
  { question: "975 ÷ 39 = ?", correctAnswer: "25", options: ["25", "23", "27", "24"] },
];

// Level 3: větší čísla, odhad, ověření
const POOL_L3: PracticeTask[] = [
  { question: "1428 ÷ 42 = ?", correctAnswer: "34", options: ["34", "32", "36", "33"] },
  { question: "1560 ÷ 52 = ?", correctAnswer: "30", options: ["30", "28", "32", "29"] },
  { question: "2016 ÷ 63 = ?", correctAnswer: "32", options: ["32", "30", "34", "31"] },
  { question: "2250 ÷ 75 = ?", correctAnswer: "30", options: ["30", "28", "32", "29"] },
  { question: "1716 ÷ 44 = ?", correctAnswer: "39", options: ["39", "37", "41", "38"] },
  { question: "2184 ÷ 56 = ?", correctAnswer: "39", options: ["39", "37", "41", "38"] },
  { question: "1932 ÷ 69 = ?", correctAnswer: "28", options: ["28", "26", "30", "27"] },
  { question: "2664 ÷ 72 = ?", correctAnswer: "37", options: ["37", "35", "39", "36"] },
  { question: "2295 ÷ 85 = ?", correctAnswer: "27", options: ["27", "25", "29", "26"] },
  { question: "1200 ÷ 48 = ?", correctAnswer: "25", options: ["25", "23", "27", "24"] },
  { question: "1998 ÷ 66 = ?", correctAnswer: "30 se zbytkem 18 — výsledek 30", options: ["30 se zbytkem 18 — výsledek 30", "31", "29", "30,27"] },
  { question: "2808 ÷ 78 = ?", correctAnswer: "36", options: ["36", "34", "38", "35"] },
  { question: "1702 ÷ 37 = ?", correctAnswer: "46", options: ["46", "44", "48", "45"] },
  { question: "Ověř: 26 × 12 = ?", correctAnswer: "312", options: ["312", "322", "302", "320"] },
  { question: "Ověř: 34 × 22 = ?", correctAnswer: "748", options: ["748", "738", "758", "740"] },
  { question: "Škola nakoupila 756 sešitů pro 27 tříd. Kolik sešitů dostane každá třída?", correctAnswer: "28", options: ["28", "26", "30", "27"] },
  { question: "Autobus ujel 840 km za 28 hodin. Kolik km ujel za 1 hodinu?", correctAnswer: "30", options: ["30", "28", "32", "29"] },
  { question: "V krabicích je 528 bonbonů, každá krabice má 24 bonbonů. Kolik je krabic?", correctAnswer: "22", options: ["22", "20", "24", "21"] },
  { question: "Odhad: 720 ÷ 24 je přibližně kolik?", correctAnswer: "30", options: ["30", "25", "35", "20"] },
  { question: "Odhad: 900 ÷ 31 je přibližně kolik?", correctAnswer: "29", options: ["29", "25", "35", "20"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const PISEMNEDELENIDVOUCIFERNYMDELITELEM: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-deleni-dvoucifernym-delitelem",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-deleni-dvoucifernym-delitelem",
    title: "Písemné dělení dvouciferným dělitelem",
    studentTitle: "Dělení pod sebou",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Zvládneš písemné dělení větším číslem.",
    keywords: ["dělení", "dvouciferný dělitel", "písemné dělení", "podíl", "zbytek"],
    goals: [
      "Provést písemné dělení trojciferného čísla dvouciferným dělitelem",
      "Odhadnout výsledek dělení",
      "Ověřit výsledek násobením",
    ],
    boundaries: ["Bez dělení desetinných čísel", "Bez dělení se zbytkem na úrovni 1"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Při dělení dvouciferným číslem odhadni nejprve, kolikrát se dělitel vejde do první části dělence. Pak vynásob a odečti. Opakuj pro zbytek.",
      steps: [
        "Vezmi první 2 (nebo 3) číslice dělence.",
        "Odhadni, kolikrát se do nich dělitel vejde.",
        "Výsledek napiš do podílu, vynásob a odečti.",
        "Přidej další číslici a opakuj.",
        "Ověř výsledek: podíl × dělitel = dělenec.",
      ],
      commonMistake: "Chyba: špatný odhad číslice podílu. Pomůže zaokrouhlení dělitele: 28 ≈ 30, 312 ÷ 30 ≈ 10.",
      example: "312 ÷ 12: 31 ÷ 12 ≈ 2 (2×12=24, 31-24=7). Přidám 2 → 72 ÷ 12 = 6. Výsledek: 26.",
    },
  },
];
