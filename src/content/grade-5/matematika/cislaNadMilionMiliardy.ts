import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: miliony — čtení a zápis
const POOL_L1: PracticeTask[] = [
  { question: "Jak zapíšeme číslem: 'pět milionů'?", correctAnswer: "5 000 000", options: ["5 000 000", "500 000", "50 000 000", "5000"] },
  { question: "Jak zapíšeme číslem: 'jeden milion'?", correctAnswer: "1 000 000", options: ["1 000 000", "100 000", "10 000 000", "1000"] },
  { question: "Kolik nul má číslo milion?", correctAnswer: "6", options: ["6", "5", "7", "9"] },
  { question: "Jak čteme číslo 3 000 000?", correctAnswer: "tři miliony", options: ["tři miliony", "tři miliiony", "třicet set tisíc", "tři tisíce tisíc"] },
  { question: "Jak čteme číslo 2 500 000?", correctAnswer: "dva miliony pět set tisíc", options: ["dva miliony pět set tisíc", "dvacet pět set", "dva a půl milionu", "dva miliony padesát tisíc"] },
  { question: "Jak zapíšeme číslem: 'sedm milionů sto tisíc'?", correctAnswer: "7 100 000", options: ["7 100 000", "7 010 000", "7 001 000", "71 000 000"] },
  { question: "Co je větší: 5 000 000 nebo 4 900 000?", correctAnswer: "5 000 000", options: ["5 000 000", "4 900 000", "jsou stejná", "nelze určit"] },
  { question: "Jak čteme číslo 10 000 000?", correctAnswer: "deset milionů", options: ["deset milionů", "jeden milion tisíc", "sto tisíc tisíc", "tisíc tisíc"] },
  { question: "Jaký počet obyvatel má město s 1 200 000 obyvateli?", correctAnswer: "jeden milion dvě stě tisíc", options: ["jeden milion dvě stě tisíc", "dvanáct set tisíc", "jeden milion dvanáct", "jeden a dvě stě tisíc"] },
  { question: "Jak zapíšeme číslem: 'osm milionů padesát tisíc'?", correctAnswer: "8 050 000", options: ["8 050 000", "8 500 000", "8 005 000", "8 050"] },
  { question: "Co je 1 000 000 × 6?", correctAnswer: "6 000 000", options: ["6 000 000", "600 000", "60 000 000", "6 000"] },
  { question: "Jak čteme číslo 4 030 000?", correctAnswer: "čtyři miliony třicet tisíc", options: ["čtyři miliony třicet tisíc", "čtyři miliony tři tisíce", "čtyři tři tisíce", "čtyřicet tři tisíc"] },
  { question: "Seřaď od nejmenšího: 3 200 000; 2 900 000; 3 100 000", correctAnswer: "2 900 000 — 3 100 000 — 3 200 000", options: ["2 900 000 — 3 100 000 — 3 200 000", "3 100 000 — 2 900 000 — 3 200 000", "3 200 000 — 3 100 000 — 2 900 000", "2 900 000 — 3 200 000 — 3 100 000"] },
  { question: "Česká republika má asi 10 900 000 obyvatel. Jak to čteme?", correctAnswer: "deset milionů devět set tisíc", options: ["deset milionů devět set tisíc", "deset a devět set tisíc", "deset devět set tisíc", "sto devět tisíc"] },
  { question: "Jak zapíšeme číslem: 'šest milionů šest set šedesát tisíc'?", correctAnswer: "6 660 000", options: ["6 660 000", "6 606 000", "6 600 600", "6 060 000"] },
];

// Level 2: miliardy — čtení a zápis
const POOL_L2: PracticeTask[] = [
  { question: "Kolik nul má miliarda?", correctAnswer: "9", options: ["9", "6", "12", "7"] },
  { question: "Jak zapíšeme číslem: 'jedna miliarda'?", correctAnswer: "1 000 000 000", options: ["1 000 000 000", "1 000 000", "100 000 000", "10 000 000 000"] },
  { question: "Jak čteme číslo 2 000 000 000?", correctAnswer: "dvě miliardy", options: ["dvě miliardy", "dva miliarda", "dva miliony tisíc", "dvě miliony"] },
  { question: "Jak čteme číslo 2 350 000 000?", correctAnswer: "dvě miliardy tři sta padesát milionů", options: ["dvě miliardy tři sta padesát milionů", "dvacet tři pět nula milionů", "dvě a půl miliardy plus", "dvě miliarda třistapadesát"] },
  { question: "Jak zapíšeme číslem: 'pět miliard'?", correctAnswer: "5 000 000 000", options: ["5 000 000 000", "5 000 000", "500 000 000", "50 000 000 000"] },
  { question: "Vzdálenost Země od Slunce je asi 150 000 000 km. Jak to čteme?", correctAnswer: "sto padesát milionů kilometrů", options: ["sto padesát milionů kilometrů", "patnáct milionů", "sto pět milionů", "patnáct set tisíc"] },
  { question: "Na Zemi žije přibližně 8 000 000 000 lidí. Jak to čteme?", correctAnswer: "osm miliard", options: ["osm miliard", "osm milionů", "osm bilionů", "osm miliardů"] },
  { question: "Co je větší: 1 500 000 000 nebo 999 000 000?", correctAnswer: "1 500 000 000", options: ["1 500 000 000", "999 000 000", "jsou stejná", "nelze určit"] },
  { question: "Jak zapíšeme číslem: 'tři miliardy dvě stě milionů'?", correctAnswer: "3 200 000 000", options: ["3 200 000 000", "3 020 000 000", "3 002 000 000", "32 000 000 000"] },
  { question: "Kolik milionů je v miliardě?", correctAnswer: "1000", options: ["1000", "100", "10 000", "1"] },
  { question: "Jak čteme číslo 7 500 000 000?", correctAnswer: "sedm miliard pět set milionů", options: ["sedm miliard pět set milionů", "sedmdesát pět milionů", "sedm milionů pět set tisíc", "sedm a půl miliardy"] },
  { question: "Seřaď od největšího: 2 100 000 000; 1 900 000 000; 2 050 000 000", correctAnswer: "2 100 000 000 — 2 050 000 000 — 1 900 000 000", options: ["2 100 000 000 — 2 050 000 000 — 1 900 000 000", "1 900 000 000 — 2 050 000 000 — 2 100 000 000", "2 050 000 000 — 2 100 000 000 — 1 900 000 000", "2 100 000 000 — 1 900 000 000 — 2 050 000 000"] },
  { question: "Jak zapíšeme číslem: 'čtyři miliardy čtyřicet milionů'?", correctAnswer: "4 040 000 000", options: ["4 040 000 000", "4 400 000 000", "4 004 000 000", "4 000 040 000"] },
  { question: "Čína má asi 1 400 000 000 obyvatel. Jak to čteme?", correctAnswer: "jedna miliarda čtyři sta milionů", options: ["jedna miliarda čtyři sta milionů", "čtrnáct set milionů", "jedná čtyřicet milionů", "jedna a čtyři sta milionů"] },
  { question: "Platí: 1 000 000 000 > 999 999 999?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží na situaci"] },
];

// Level 3: porovnávání, počítání s velkými čísly, příklady ze života
const POOL_L3: PracticeTask[] = [
  { question: "Kolik milionů je v čísle 3 700 000 000?", correctAnswer: "3700", options: ["3700", "370", "37000", "3,7"] },
  { question: "O kolik je větší 2 000 000 000 než 1 500 000 000?", correctAnswer: "500 000 000", options: ["500 000 000", "5 000 000", "50 000 000", "5 000 000 000"] },
  { question: "Planeta Mars je vzdálena asi 225 000 000 km. Zapiš to slovy.", correctAnswer: "dvě stě dvacet pět milionů", options: ["dvě stě dvacet pět milionů", "dvacet dva pět milionů", "dvě stě padesát pět milionů", "dvě miliardy dvacet pět"] },
  { question: "Průměrná vzdálenost Pluta od Slunce je asi 5 900 000 000 km. Jak to čteme?", correctAnswer: "pět miliard devět set milionů", options: ["pět miliard devět set milionů", "pět milionů devět set tisíc", "padesát devět miliard", "pět miliarda devět set"] },
  { question: "Seřaď od nejmenšího: 850 000 000; 1 050 000 000; 950 000 000; 1 000 000 000", correctAnswer: "850 000 000 — 950 000 000 — 1 000 000 000 — 1 050 000 000", options: ["850 000 000 — 950 000 000 — 1 000 000 000 — 1 050 000 000", "850 000 000 — 1 000 000 000 — 950 000 000 — 1 050 000 000", "1 050 000 000 — 1 000 000 000 — 950 000 000 — 850 000 000", "950 000 000 — 850 000 000 — 1 000 000 000 — 1 050 000 000"] },
  { question: "Kolik je 1 miliarda ÷ 1000?", correctAnswer: "1 000 000", options: ["1 000 000", "100 000", "10 000 000", "1000"] },
  { question: "Kolik milionů je v čísle 12 000 000 000?", correctAnswer: "12 000", options: ["12 000", "1200", "120 000", "12"] },
  { question: "Platí: 6 miliard > 6000 milionů?", correctAnswer: "Jsou si rovny", options: ["Jsou si rovny", "Ano, 6 miliard je větší", "Ne, 6000 milionů je větší", "Nelze porovnat"] },
  { question: "Světový oceán má objem asi 1 335 000 000 km³. Jak zaokrouhlíme na miliardy?", correctAnswer: "přibližně 1 miliarda", options: ["přibližně 1 miliarda", "přibližně 13 miliard", "přibližně 133 milionů", "přibližně 2 miliardy"] },
  { question: "Zápis 4,5 × 10⁹ znamená kolik miliard?", correctAnswer: "4,5 miliardy", options: ["4,5 miliardy", "45 milionů", "450 milionů", "45 miliard"] },
  { question: "Která z odpovědí správně čte číslo 1 005 000 000?", correctAnswer: "jedna miliarda pět milionů", options: ["jedna miliarda pět milionů", "jedna miliarda padesát milionů", "jedna miliarda pět set milionů", "deset miliard pět milionů"] },
  { question: "Kolik tisíc milionů je deset miliard?", correctAnswer: "10 000", options: ["10 000", "1000", "100 000", "100"] },
  { question: "O kolik je 3 000 000 000 větší než 2 750 000 000?", correctAnswer: "250 000 000", options: ["250 000 000", "25 000 000", "2 500 000", "2 500 000 000"] },
  { question: "Platí: 999 milionů < 1 miliarda?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Jak zapíšeme číslicemi: 'sedm miliard sto dvacet milionů třicet tisíc'?", correctAnswer: "7 120 030 000", options: ["7 120 030 000", "7 012 030 000", "7 120 300 000", "7 120 003 000"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const CISLANADMILIONMILIARDY: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-cisla-nad-milion-miliardy",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-cisla-nad-milion-miliardy",
    title: "Čísla nad milion, miliardy",
    studentTitle: "Miliardy",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Velká čísla a desetinná čísla",
    briefDescription: "Poznáš velká čísla — milion, miliarda a ještě větší.",
    keywords: ["milion", "miliarda", "velká čísla", "zápis čísel", "čtení čísel", "porovnávání"],
    goals: [
      "Přečíst čísla v řádu milionů a miliard",
      "Zapsat čísla v řádu milionů a miliard číslicemi",
      "Porovnat čísla v řádu milionů a miliard",
      "Orientovat se v příkladech ze skutečného světa",
    ],
    boundaries: ["Bez bilionů a vyšších řádů", "Bez výpočtů s miliardami"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Milion má 6 nul (1 000 000), miliarda má 9 nul (1 000 000 000). Číslo čteme po skupinách tisíců zprava.",
      steps: [
        "Rozděl číslo zprava po třech číslicích: 2 350 000 000 → 2 | 350 | 000 | 000.",
        "Přiřaď názvy skupin: miliardy | miliony | tisíce | jednotky.",
        "Přečti každou skupinu a přidej název: 'dvě miliardy tři sta padesát milionů'.",
      ],
      commonMistake: "Chyba: záměna milionů a miliard — milion má 6 nul, miliarda 9 nul.",
      example: "2 350 000 000 = dvě miliardy tři sta padesát milionů (2 × miliarda + 350 × milion).",
    },
  },
];
