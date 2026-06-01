import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: číselné řady, jednoduché logické úlohy
const POOL_L1: PracticeTask[] = [
  { question: "Jaké číslo chybí v řadě: 2, 4, 8, ?, 32?", correctAnswer: "16", options: ["16", "12", "10", "20"] },
  { question: "Jaké číslo chybí v řadě: 1, 3, 5, 7, ?, 11?", correctAnswer: "9", options: ["9", "8", "10", "6"] },
  { question: "Jaké číslo chybí v řadě: 100, 90, 80, ?, 60?", correctAnswer: "70", options: ["70", "75", "65", "50"] },
  { question: "Jaké číslo chybí v řadě: 1, 4, 9, 16, ?, 36?", correctAnswer: "25", options: ["25", "20", "24", "30"] },
  { question: "Jaké číslo chybí v řadě: 5, 10, 15, ?, 25?", correctAnswer: "20", options: ["20", "18", "22", "30"] },
  { question: "Jaké číslo chybí v řadě: 2, 6, 18, ?, 162?", correctAnswer: "54", options: ["54", "36", "72", "48"] },
  { question: "Jaké číslo chybí v řadě: 1, 1, 2, 3, 5, ?, 13?", correctAnswer: "8", options: ["8", "7", "9", "6"] },
  { question: "Vzor: každý čtverec je černobílý jako šachovnice. Co je ve čtverci uprostřed na pozici [řada 2, sloupec 2] (začínáme bílou)?", correctAnswer: "Černá", options: ["Černá", "Bílá", "Šedá", "Záleží na velikosti"] },
  { question: "Jaké číslo chybí: 3, 6, 12, 24, ?, 96?", correctAnswer: "48", options: ["48", "36", "60", "72"] },
  { question: "Jaké číslo přijde za: 0, 1, 1, 2, 3, 5, 8?", correctAnswer: "13", options: ["13", "11", "10", "14"] },
  { question: "Řada: 10, 20, 30, 40... Jaká je 8. číslo?", correctAnswer: "80", options: ["80", "70", "90", "40"] },
  { question: "Jaké číslo chybí: 1, 2, 4, 8, 16, ?", correctAnswer: "32", options: ["32", "24", "20", "30"] },
  { question: "Řada: 64, 32, 16, ?, 4?", correctAnswer: "8", options: ["8", "12", "6", "10"] },
  { question: "Jaké číslo chybí: 7, 14, 21, ?, 35?", correctAnswer: "28", options: ["28", "24", "30", "32"] },
  { question: "Vzor: △, ○, □, △, ○, ?", correctAnswer: "□", options: ["□", "△", "○", "◇"] },
  { question: "Vzor: 1, 3, 2, 4, 3, 5, 4, ?", correctAnswer: "6", options: ["6", "5", "7", "4"] },
  { question: "Jaké číslo chybí: 1000, 500, 250, ?, 62,5?", correctAnswer: "125", options: ["125", "100", "150", "200"] },
  { question: "Řada: 2, 3, 5, 7, 11, ? (prvočísla)", correctAnswer: "13", options: ["13", "12", "14", "15"] },
  { question: "Jaké číslo chybí: 3, 9, 27, ?, 243?", correctAnswer: "81", options: ["81", "54", "72", "90"] },
  { question: "Vzor: A, C, E, G, ?", correctAnswer: "I", options: ["I", "H", "J", "F"] },
];

// Level 2: prostorová představivost, složitější logika
const POOL_L2: PracticeTask[] = [
  { question: "Pohled ze shora na L-tvar: oba ramena jsou 2 × 1. Jaký je celkový tvar?", correctAnswer: "L – 4 čtverečky", options: ["L – 4 čtverečky", "T – 4 čtverečky", "Kříž – 4 čtverečky", "Čtverec – 4 čtverečky"] },
  { question: "Kostka je složena z 27 malých kostek (3×3×3). Kolik malých kostek vidíme z jedné strany?", correctAnswer: "9", options: ["9", "27", "18", "6"] },
  { question: "Kostka 3×3×3 = 27 kostek. Kolik kostek je v prostředku (nevidíme je)?", correctAnswer: "1", options: ["1", "0", "8", "3"] },
  { question: "Čtverec rozstřihneme jedním řezem. Kolik částí dostaneme?", correctAnswer: "2", options: ["2", "1", "3", "4"] },
  { question: "Čtverec rozstřihneme dvěma řezy rovnoběžně. Kolik části dostaneme?", correctAnswer: "3", options: ["3", "2", "4", "6"] },
  { question: "Přeložíme čtverec napůl. Vznikne:", correctAnswer: "Obdélník – poloviční obsah", options: ["Obdélník – poloviční obsah", "Čtverec", "Trojúhelník", "Trapéz"] },
  { question: "Přeložíme čtverec přes úhlopříčku. Vznikne:", correctAnswer: "Rovnoramenný pravoúhlý trojúhelník", options: ["Rovnoramenný pravoúhlý trojúhelník", "Obdélník", "Rovnostranný trojúhelník", "Čtverec"] },
  { question: "Do čtverce 4×4 nakreslíme všechny úhlopříčky malých čtverečků. Jaký tvar vznikne uprostřed?", correctAnswer: "Čtverec – otočený o 45°", options: ["Čtverec – otočený o 45°", "Trojúhelník", "Šestiúhelník", "Kružnice"] },
  { question: "Celkový počet kostek 2×2×2 = ?", correctAnswer: "8", options: ["8", "6", "4", "12"] },
  { question: "Kostka 2×2×2 — kolik kostek je vidět z každého pohledu?", correctAnswer: "4", options: ["4", "2", "8", "6"] },
  { question: "Vzor: 1 trojúhelník = 3 strany. 2 trojúhelníky sdílejí 1 stranu = ? stran celkem?", correctAnswer: "5", options: ["5", "6", "4", "7"] },
  { question: "Řada trojúhelníků sdílejících strany: 1→3 strany, 2→5 stran, 3→7 stran, 10→?", correctAnswer: "21", options: ["21", "20", "22", "30"] },
  { question: "Tři přímky se protínají v různých bodech. Kolik průsečíků mohou vytvořit maximálně?", correctAnswer: "3", options: ["3", "2", "6", "1"] },
  { question: "4 přímky mohou mít maximálně kolik průsečíků?", correctAnswer: "6", options: ["6", "4", "8", "3"] },
  { question: "Sítě krychle: kolik čtverečků tvoří síť krychle?", correctAnswer: "6", options: ["6", "4", "8", "12"] },
  { question: "Válec z papíru: přeložíme obdélník do tvaru trubky. Co tvoří základny?", correctAnswer: "Kružnice", options: ["Kružnice", "Čtverce", "Trojúhelníky", "Obdélníky"] },
  { question: "Čtverec má stranu 4 cm. Překryjeme ho jiným čtvercem (stranu 2 cm) v rohu. Kolik cm² zbyde viditelných?", correctAnswer: "12 cm²", options: ["12 cm²", "16 cm²", "8 cm²", "20 cm²"] },
];

// Level 3: složitější kombinatorika a prostorová logika
const POOL_L3: PracticeTask[] = [
  { question: "Kolik různých cest vede z A do B v mřížce 3×3 (jen dolů a doprava)?", correctAnswer: "20", options: ["20", "12", "6", "15"] },
  { question: "Šachovnice 8×8. Kolik je na ní čtverečků 1×1?", correctAnswer: "64", options: ["64", "56", "32", "128"] },
  { question: "Šachovnice 8×8. Kolik je na ní čtverečků 2×2?", correctAnswer: "49", options: ["49", "64", "16", "32"] },
  { question: "Vzor čtverečků: 1. vrstva = 1, 2. vrstva = 4, 3. vrstva = 9. Jaká je 4. vrstva?", correctAnswer: "16", options: ["16", "12", "20", "25"] },
  { question: "Kostky 1×1×1 skládáme do pyramidy. Spodní patra: 9, 4, 1. Kolik kostek celkem?", correctAnswer: "14", options: ["14", "12", "16", "9"] },
  { question: "Číslo: součet číslic = 15, číslo je trojciferné, číslice jsou po řadě rostoucí. Jaké číslo to je?", correctAnswer: "456", options: ["456", "159", "258", "357"] },
  { question: "Ze čtyř čísel 1, 2, 3, 4 sestavíme čtyřciferné číslo. Kolik různých čísel lze sestavit?", correctAnswer: "24", options: ["24", "16", "12", "4"] },
  { question: "Hledáme číslo: je dělitelné 3, je větší než 20 a menší než 30, součet číslic je 6. Jaké číslo to je?", correctAnswer: "24", options: ["24", "21", "27", "22"] },
  { question: "Jaký je součet čísel od 1 do 10?", correctAnswer: "55", options: ["55", "50", "45", "100"] },
  { question: "Jaký je součet čísel od 1 do 100? (Gaussův trik)", correctAnswer: "5050", options: ["5050", "5000", "5100", "4950"] },
  { question: "V kolonce je 5 čísel. Průměr je 8. Jedno číslo je 4, druhé 12. Součet zbývajících tří?", correctAnswer: "24", options: ["24", "16", "20", "28"] },
  { question: "Číslo: je větší než 50 a menší než 100, je dělitelné 7 i 3. Jaké číslo to je?", correctAnswer: "63", options: ["63", "56", "84", "42"] },
  { question: "Kolik čtverce 2×2 se vejde do čtverce 6×6?", correctAnswer: "9", options: ["9", "6", "4", "12"] },
  { question: "Řada: 1, 8, 27, 64, ?  (třetí mocniny)", correctAnswer: "125", options: ["125", "100", "216", "81"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ULOHYNEZAVISLENABEZNYCHPOSTUPECHPROSTOROVAPREDSTAVIVOST: TopicMetadata[] = [
  {
    id: "g5-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-ulohy-nezavisle-na-beznych-postupech-prostorova-predstavivos",
    rvpNodeId: "g5-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-ulohy-nezavisle-na-beznych-postupech-prostorova-predstavivos",
    title: "Úlohy nezávislé na běžných postupech, prostorová představivost",
    studentTitle: "Logické úlohy",
    subject: "matematika",
    category: "Nestandardní aplikační úlohy a problémy",
    topic: "Logické úlohy",
    briefDescription: "Procvičíš logické myšlení a prostorovou představivost.",
    keywords: ["logika", "číselné řady", "vzor", "prostorová představivost", "kostky", "síť tělesa"],
    goals: [
      "Rozpoznat vzor v číselné řadě a doplnit chybějící číslo",
      "Řešit nestandardní úlohy bez obvyklého algoritmu",
      "Představit si tvar při pohledu ze shora nebo z boku",
      "Rozvíjet logické myšlení a kombinatorické uvažování",
    ],
    boundaries: ["Bez složité pravděpodobnosti", "Bez algebraických rovnic"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "mixed",
    generator: gen,
    helpTemplate: {
      hint: "Nejprve zkus rozeznat vzor (co se opakuje nebo jak roste). U prostorových úloh si tvar nakresli nebo představ krok po kroku.",
      steps: [
        "Přečti úlohu pečlivě a zjisti, co se ptá.",
        "Hledej vzor: o kolik se mění čísla? Násobí se? Opakují se symboly?",
        "Ověř svůj tip: přilož ho na začátek řady a zkontroluj.",
        "U prostorových úloh si nakresli tvar nebo pohled.",
      ],
      commonMistake: "Chyba: u číselných řad hledat jen součet (+n), když jde o násobení (×n). Vždy otestuj oba vzory.",
      example: "Řada 2, 4, 8, 16, ?: každé číslo je dvakrát větší → 32.",
    },
  },
];
