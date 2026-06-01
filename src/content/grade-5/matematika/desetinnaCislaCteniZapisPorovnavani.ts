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
  { question: "Jak čteme číslo 1,5?", correctAnswer: "jedna celá pět", options: ["jedna celá pět", "jedna pět", "patnáct desetin", "jedna a půl číslo"] },
  { question: "Jak čteme číslo 2,3?", correctAnswer: "dvě celé tři", options: ["dvě celé tři", "dvacet tři", "dvě tři", "dvě a tři"] },
  { question: "Jak čteme číslo 0,8?", correctAnswer: "nula celých osm", options: ["nula celých osm", "osm", "nula osm", "osm desetin"] },
  { question: "Jak čteme číslo 3,7?", correctAnswer: "tři celé sedm", options: ["tři celé sedm", "třicet sedm", "tři sedm", "tři a sedm"] },
  { question: "Jak čteme číslo 5,1?", correctAnswer: "pět celých jedna", options: ["pět celých jedna", "padesát jedna", "pět jedna", "pět celých deset"] },
  { question: "Jak čteme číslo 4,6?", correctAnswer: "čtyři celé šest", options: ["čtyři celé šest", "čtyřicet šest", "čtyři šest", "čtyři a šest"] },
  { question: "Jak čteme číslo 7,2?", correctAnswer: "sedm celých dva", options: ["sedm celých dva", "sedmdesát dva", "sedm dva", "sedm a dvě"] },
  { question: "Jak čteme číslo 9,0?", correctAnswer: "devět celých nula", options: ["devět celých nula", "devět nula", "devadesát", "devět a nic"] },
  { question: "Které číslo je větší: 3,5 nebo 3,2?", correctAnswer: "3,5", options: ["3,5", "3,2", "jsou stejná", "nelze určit"] },
  { question: "Které číslo je větší: 1,8 nebo 2,1?", correctAnswer: "2,1", options: ["2,1", "1,8", "jsou stejná", "nelze určit"] },
  { question: "Které číslo je menší: 4,3 nebo 4,7?", correctAnswer: "4,3", options: ["4,3", "4,7", "jsou stejná", "nelze určit"] },
  { question: "Které číslo je menší: 0,5 nebo 0,9?", correctAnswer: "0,5", options: ["0,5", "0,9", "jsou stejná", "nelze určit"] },
  { question: "Platí: 2,5 > 2,3?", correctAnswer: "Ano", options: ["Ano", "Ne", "Nevím", "Záleží na situaci"] },
  { question: "Platí: 1,4 < 1,7?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží na situaci"] },
  { question: "Platí: 5,0 = 5?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jen přibližně", "Záleží na zápisu"] },
  { question: "Jaký je správný zápis čísla 'tři celé pět'?", correctAnswer: "3,5", options: ["3,5", "35", "3.5", "3/5"] },
  { question: "Jaký je správný zápis čísla 'sedm celých dvě'?", correctAnswer: "7,2", options: ["7,2", "72", "7.2", "7/2"] },
  { question: "Seřaď od nejmenšího: 1,5; 1,2; 1,8", correctAnswer: "1,2 — 1,5 — 1,8", options: ["1,2 — 1,5 — 1,8", "1,5 — 1,2 — 1,8", "1,8 — 1,5 — 1,2", "1,2 — 1,8 — 1,5"] },
  { question: "Seřaď od největšího: 3,1; 3,9; 3,4", correctAnswer: "3,9 — 3,4 — 3,1", options: ["3,9 — 3,4 — 3,1", "3,1 — 3,4 — 3,9", "3,4 — 3,9 — 3,1", "3,9 — 3,1 — 3,4"] },
  { question: "Které číslo leží na číselné ose mezi 2,0 a 3,0?", correctAnswer: "2,5", options: ["2,5", "3,5", "1,5", "2,0"] },
  { question: "Co je větší: 0,9 nebo 1,0?", correctAnswer: "1,0", options: ["1,0", "0,9", "jsou stejná", "nelze porovnat"] },
  { question: "Jak zapíšeme číslem: 'šest celých jedna'?", correctAnswer: "6,1", options: ["6,1", "61", "6,10", "6.1"] },
  { question: "Jak zapíšeme číslem: 'nula celých sedm'?", correctAnswer: "0,7", options: ["0,7", "7", "0.7", "0,07"] },
  { question: "Platí: 8,3 < 8,5?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Nevím"] },
  { question: "Platí: 5,6 > 5,9?", correctAnswer: "Ne", options: ["Ne", "Ano", "Jsou si rovny", "Záleží"] },
];

// Level 2: čísla s 2 desetinnými místy
const POOL_L2: PracticeTask[] = [
  { question: "Jak čteme číslo 3,14?", correctAnswer: "tři celé čtrnáct", options: ["tři celé čtrnáct", "tři jedna čtyři", "tři celé sto čtrnáct", "třináct čtrnáct"] },
  { question: "Jak čteme číslo 2,50?", correctAnswer: "dvě celé padesát", options: ["dvě celé padesát", "dvě celé pět nula", "dvacet pět", "dvě a půl"] },
  { question: "Jak čteme číslo 0,75?", correctAnswer: "nula celých sedmdesát pět", options: ["nula celých sedmdesát pět", "sedmdesát pět", "nula sedm pět", "nula celých sedm pět"] },
  { question: "Jak čteme číslo 1,08?", correctAnswer: "jedna celá osm", options: ["jedna celá osm", "jedna nula osm", "jedna celá nula osm", "deset osm"] },
  { question: "Které číslo je větší: 3,14 nebo 3,5?", correctAnswer: "3,5", options: ["3,5", "3,14", "jsou stejná", "nelze určit"] },
  { question: "Které číslo je větší: 2,09 nebo 2,9?", correctAnswer: "2,9", options: ["2,9", "2,09", "jsou stejná", "nelze určit"] },
  { question: "Platí: 1,25 > 1,20?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Platí: 4,30 = 4,3?", correctAnswer: "Ano", options: ["Ano", "Ne", "Přibližně", "Záleží na zaokrouhlení"] },
  { question: "Seřaď od nejmenšího: 1,25; 1,2; 1,52", correctAnswer: "1,2 — 1,25 — 1,52", options: ["1,2 — 1,25 — 1,52", "1,25 — 1,2 — 1,52", "1,52 — 1,25 — 1,2", "1,2 — 1,52 — 1,25"] },
  { question: "Které číslo je menší: 0,08 nebo 0,8?", correctAnswer: "0,08", options: ["0,08", "0,8", "jsou stejná", "nelze říct"] },
  { question: "Jak zapíšeme číslem: 'pět celých sedmdesát dva'?", correctAnswer: "5,72", options: ["5,72", "572", "5,7 2", "5.72"] },
  { question: "Jak zapíšeme číslem: 'nula celých třináct'?", correctAnswer: "0,13", options: ["0,13", "013", "0,1 3", "1,3"] },
  { question: "Platí: 2,05 < 2,50?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Které číslo leží na číselné ose mezi 1,10 a 1,20?", correctAnswer: "1,15", options: ["1,15", "1,25", "1,05", "1,10"] },
  { question: "Platí: 3,99 < 4,00?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží na situaci"] },
  { question: "Které číslo je největší: 2,3; 2,03; 2,33?", correctAnswer: "2,33", options: ["2,33", "2,3", "2,03", "všechna jsou stejná"] },
  { question: "Platí: 7,07 > 7,70?", correctAnswer: "Ne", options: ["Ne", "Ano", "Jsou si rovny", "Záleží"] },
  { question: "Jak čteme číslo 10,05?", correctAnswer: "deset celých pět", options: ["deset celých pět", "deset nula pět", "stošestý", "deset a pět"] },
];

// Level 3: porovnávání více čísel, složitější úlohy
const POOL_L3: PracticeTask[] = [
  { question: "Seřaď od nejmenšího: 3,5; 3,05; 3,50; 3,15", correctAnswer: "3,05 — 3,15 — 3,5 — 3,50", options: ["3,05 — 3,15 — 3,5 — 3,50", "3,5 — 3,50 — 3,15 — 3,05", "3,05 — 3,5 — 3,15 — 3,50", "3,15 — 3,05 — 3,5 — 3,50"] },
  { question: "Seřaď od největšího: 2,1; 2,10; 2,01; 2,11", correctAnswer: "2,11 — 2,1 — 2,10 — 2,01", options: ["2,11 — 2,1 — 2,10 — 2,01", "2,1 — 2,11 — 2,10 — 2,01", "2,11 — 2,10 — 2,1 — 2,01", "2,01 — 2,1 — 2,10 — 2,11"] },
  { question: "Které ze čísel 1,5; 1,50; 1,500 je největší?", correctAnswer: "Jsou si rovna", options: ["Jsou si rovna", "1,500", "1,50", "1,5"] },
  { question: "Platí: 0,1 > 0,09?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Na teploměru je −2,5 °C a −2,8 °C. Která teplota je vyšší?", correctAnswer: "−2,5 °C", options: ["−2,5 °C", "−2,8 °C", "jsou stejné", "nelze určit"] },
  { question: "Délka hada A je 1,35 m, hada B 1,5 m. Který had je delší?", correctAnswer: "Had B – 1,5 m", options: ["Had B (1,5 m)", "Had A (1,35 m)", "jsou stejně dlouhí", "nelze určit"] },
  { question: "Jaké číslo je přesně uprostřed mezi 1,2 a 1,4?", correctAnswer: "1,3", options: ["1,3", "1,24", "1,32", "1,20"] },
  { question: "Jaké číslo je přesně uprostřed mezi 2,0 a 3,0?", correctAnswer: "2,5", options: ["2,5", "2,0", "3,0", "2,1"] },
  { question: "Platí: 9,99 < 10,0?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Cena jablek je 12,50 Kč a hrušek 12,05 Kč. Co je dražší?", correctAnswer: "Jablka – 12,50 Kč", options: ["Jablka (12,50 Kč)", "Hrušky (12,05 Kč)", "mají stejnou cenu", "nelze určit"] },
  { question: "Seřaď od nejmenšího: 0,5; 0,05; 0,55; 0,505", correctAnswer: "0,05 — 0,5 — 0,505 — 0,55", options: ["0,05 — 0,5 — 0,505 — 0,55", "0,5 — 0,05 — 0,55 — 0,505", "0,05 — 0,505 — 0,5 — 0,55", "0,55 — 0,505 — 0,5 — 0,05"] },
  { question: "Platí: 3,40 = 3,4?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jen přibližně", "Záleží na situaci"] },
  { question: "Platí: 0,100 = 0,1?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jen přibližně", "Záleží"] },
  { question: "Které z čísel 4,6; 4,60; 4,06 je nejmenší?", correctAnswer: "4,06", options: ["4,06", "4,6", "4,60", "jsou si rovna"] },
  { question: "Platí: 1,01 < 1,10?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Seřaď od největšího: 5,5; 5,55; 5,05; 5,50", correctAnswer: "5,55 — 5,5 — 5,50 — 5,05", options: ["5,55 — 5,5 — 5,50 — 5,05", "5,5 — 5,55 — 5,50 — 5,05", "5,05 — 5,5 — 5,50 — 5,55", "5,55 — 5,50 — 5,5 — 5,05"] },
  { question: "Platí: 2,7 > 2,70?", correctAnswer: "Ne – jsou si rovna", options: ["Ne (jsou si rovna)", "Ano", "Záleží", "Nelze určit"] },
  { question: "Které číslo je přesně mezi 3,5 a 3,7?", correctAnswer: "3,6", options: ["3,6", "3,55", "3,65", "3,50"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const DESETINNACISLACTENIZAPISPOROVNAVANI: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-desetinna-cisla-cteni-zapis-porovnavani",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-desetinna-cisla-cteni-zapis-porovnavani",
    title: "Desetinná čísla - čtení, zápis, porovnávání",
    studentTitle: "Desetinná čísla",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Velká čísla a desetinná čísla",
    briefDescription: "Naučíš se číst, zapisovat a porovnávat desetinná čísla.",
    keywords: ["desetinná čísla", "desetinná čárka", "porovnávání", "čtení čísel", "zápis čísel"],
    goals: [
      "Přečíst desetinné číslo správně česky",
      "Zapsat desetinné číslo podle slovního popisu",
      "Porovnat dvě desetinná čísla a určit větší/menší",
      "Seřadit desetinná čísla od nejmenšího po největší",
    ],
    boundaries: ["Nepočítat s desetinnými čísly, jen číst a porovnávat", "Bez vědeckého zápisu"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Číslo 3,14 čteme po celku a zlomku: 'tři celé čtrnáct'. Při porovnávání se nejprve díváme na celou část, pak na desetiny, pak na setiny.",
      steps: [
        "Podívej se na celou část (před čárkou).",
        "Porovnej celé části — větší celá část znamená větší číslo.",
        "Pokud jsou celé části stejné, porovnej desetiny (první číslice za čárkou).",
        "Pokud jsou desetiny stejné, porovnej setiny.",
      ],
      commonMistake: "Chyba: 3,14 > 3,5, protože 14 > 5. Správně: 3,5 > 3,14, protože 5 desetin > 1 desetina.",
      example: "Porovnej 2,3 a 2,15: celé části jsou stejné (2). Desetiny: 3 > 1, takže 2,3 > 2,15.",
    },
  },
];
