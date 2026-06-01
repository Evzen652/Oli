import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: čtení jednoduchých sloupcových grafů
const POOL_L1: PracticeTask[] = [
  {
    question: "Sloupcový graf ukazuje oblíbené sporty: fotbal 12 žáků, plavání 8, kolo 5, tenis 10. Kolik žáků má rádo fotbal?",
    correctAnswer: "12",
    options: ["12", "8", "10", "5"],
  },
  {
    question: "Sloupcový graf oblíbených sportů: fotbal 12, plavání 8, kolo 5, tenis 10. Který sport má nejméně příznivců?",
    correctAnswer: "kolo",
    options: ["kolo", "plavání", "tenis", "fotbal"],
  },
  {
    question: "Sloupcový graf oblíbených sportů: fotbal 12, plavání 8, kolo 5, tenis 10. Kolik žáků dohromady má rádo plavání a tenis?",
    correctAnswer: "18",
    options: ["18", "15", "13", "20"],
  },
  {
    question: "Sloupcový graf: v pondělí přišlo 20 žáků, v úterý 18, ve středu 22. Kolik žáků přišlo v nejlepší den?",
    correctAnswer: "22",
    options: ["22", "20", "18", "60"],
  },
  {
    question: "Teplotní graf: leden −3 °C, únor −1 °C, březen 5 °C, duben 10 °C. Který měsíc byl nejtepleji?",
    correctAnswer: "duben",
    options: ["duben", "březen", "únor", "leden"],
  },
  {
    question: "Teplotní graf: leden −3 °C, únor −1 °C, březen 5 °C. Jaká je průměrná teplota těchto tří měsíců?",
    correctAnswer: "0,3 °C",
    options: ["0,3 °C", "1 °C", "−1 °C", "3 °C"],
  },
  {
    question: "Sloupcový graf: třída A – 25 žáků, třída B – 28 žáků, třída C – 22 žáků. Která třída je největší?",
    correctAnswer: "třída B",
    options: ["třída B", "třída A", "třída C", "jsou stejně velké"],
  },
  {
    question: "Sloupcový graf prodeje zmrzliny: pondělí 30, úterý 25, středa 40. Celkový prodej?",
    correctAnswer: "95",
    options: ["95", "90", "100", "105"],
  },
  {
    question: "Graf čtení knih: Jana 4 knihy, Tomáš 7, Eva 3. Kdo přečetl nejvíce knih?",
    correctAnswer: "Tomáš",
    options: ["Tomáš", "Jana", "Eva", "přečetli stejně"],
  },
  {
    question: "Graf čtení knih: Jana 4, Tomáš 7, Eva 3. Jaký je průměr přečtených knih?",
    correctAnswer: "4,7",
    options: ["4,7", "4", "5", "7"],
  },
  {
    question: "Koláčový graf ukazuje oblíbené předměty: matematika 30%, čeština 20%, přírodověda 25%, tělesná výchova 25%. Který předmět je nejoblíbenější?",
    correctAnswer: "matematika",
    options: ["matematika", "čeština", "přírodověda", "tělesná výchova"],
  },
  {
    question: "Koláčový graf: matematika 30%, čeština 20%, přírodověda 25%, tělesná výchova 25%. Kolik % žáků nemá rádo matematiku?",
    correctAnswer: "70%",
    options: ["70%", "30%", "20%", "50%"],
  },
  {
    question: "Sloupcový graf srážek: leden 40 mm, únor 30 mm, březen 50 mm, duben 45 mm. Který měsíc měl nejméně srážek?",
    correctAnswer: "únor",
    options: ["únor", "leden", "březen", "duben"],
  },
  {
    question: "Sloupcový graf srážek: leden 40, únor 30, březen 50, duben 45 mm. Celkové srážky?",
    correctAnswer: "165 mm",
    options: ["165 mm", "155 mm", "175 mm", "160 mm"],
  },
  {
    question: "Řádkový graf teploty v průběhu dne: 6:00 h = 8 °C, 12:00 h = 18 °C, 18:00 h = 14 °C. Kdy bylo nejtepleji?",
    correctAnswer: "v poledne – 12:00",
    options: ["v poledne (12:00)", "ráno (6:00)", "večer (18:00)", "všude stejně"],
  },
];

// Level 2: sestavování tabulek, výpočty z grafů
const POOL_L2: PracticeTask[] = [
  {
    question: "Tabulka: třída 5A má 28 žáků, 5B má 26, 5C má 30. Kolik žáků je celkem?",
    correctAnswer: "84",
    options: ["84", "80", "88", "78"],
  },
  {
    question: "Tabulka průměrné teploty: jaro 12 °C, léto 24 °C, podzim 10 °C, zima −2 °C. Průměr za celý rok?",
    correctAnswer: "11 °C",
    options: ["11 °C", "12 °C", "10 °C", "44 °C"],
  },
  {
    question: "Graf prodeje: pondělí 150 Kč, úterý 200 Kč, středa 250 Kč. Průměrný denní prodej?",
    correctAnswer: "200 Kč",
    options: ["200 Kč", "150 Kč", "250 Kč", "600 Kč"],
  },
  {
    question: "Tabulka počtu žáků na výletě: 1. ročník 45, 2. ročník 52, 3. ročník 48. Celkem?",
    correctAnswer: "145",
    options: ["145", "140", "150", "155"],
  },
  {
    question: "Koláčový graf: chlapci 60%, dívky 40%. Ve třídě je 30 žáků. Kolik je chlapců?",
    correctAnswer: "18",
    options: ["18", "12", "15", "20"],
  },
  {
    question: "Koláčový graf: chlapci 60%, dívky 40%. Ve třídě je 30 žáků. Kolik je dívek?",
    correctAnswer: "12",
    options: ["12", "18", "15", "10"],
  },
  {
    question: "Sloupcový graf: v 5A dostalo jedničku 8, dvojku 10, trojku 7, čtyřku 3, pětku 2. Kolik žáků je v 5A?",
    correctAnswer: "30",
    options: ["30", "28", "32", "25"],
  },
  {
    question: "Sloupcový graf: jedničky 8, dvojky 10, trojky 7, čtyřky 3, pětky 2. Kolik žáků dostalo jedničku nebo dvojku?",
    correctAnswer: "18",
    options: ["18", "15", "20", "17"],
  },
  {
    question: "Graf výdajů rodiny: jídlo 40%, bydlení 35%, zábava 15%, ostatní 10%. Celkový příjem 20 000 Kč. Kolik se utratí za jídlo?",
    correctAnswer: "8 000 Kč",
    options: ["8 000 Kč", "7 000 Kč", "6 000 Kč", "4 000 Kč"],
  },
  {
    question: "Tabulka srážek: leden 45, únor 32, březen 55, duben 60, květen 70 mm. Průměrné srážky za měsíc?",
    correctAnswer: "52,4 mm",
    options: ["52,4 mm", "50 mm", "55 mm", "262 mm"],
  },
  {
    question: "Sloupcový graf výšek: Petr 152, Jana 160, Tomáš 158, Eva 155 cm. Průměrná výška?",
    correctAnswer: "156,25 cm",
    options: ["156,25 cm", "155 cm", "158 cm", "160 cm"],
  },
  {
    question: "V tabulce prodejů chybí údaj za únor. Leden 120, únor ?, březen 150. Průměr je 130. Kolik se prodalo v únoru?",
    correctAnswer: "120",
    options: ["120", "130", "140", "110"],
  },
  {
    question: "Koláčový graf: A 25%, B 35%, C 40%. Celkově je 200 kusů. Kolik je v části C?",
    correctAnswer: "80",
    options: ["80", "70", "50", "40"],
  },
  {
    question: "Sloupcový graf hodin sportu za týden: Po 2h, Út 1h, St 3h, Čt 0h, Pá 2h. Průměr za den?",
    correctAnswer: "1,6 h",
    options: ["1,6 h", "2 h", "1,5 h", "8 h"],
  },
  {
    question: "Tabulka sběru papíru: třída A 85 kg, B 90 kg, C 75 kg, D 100 kg. Průměr na třídu?",
    correctAnswer: "87,5 kg",
    options: ["87,5 kg", "85 kg", "90 kg", "350 kg"],
  },
];

// Level 3: složitější čtení dat, kombinace grafů a tabulek
const POOL_L3: PracticeTask[] = [
  {
    question: "Graf znázorňuje počty žáků v 5 třídách: 28, 30, 26, 32, 24. Která třída by měla dostat dalšího žáka, aby byly třídy co nejrovnoměrnější?",
    correctAnswer: "třída s 24 žáky",
    options: ["třída s 24 žáky", "třída s 32 žáky", "třída s 28 žáky", "jakákoliv třída"],
  },
  {
    question: "Řádkový graf teploty: leden −5, únor −3, březen 2, duben 8, květen 14 °C. O kolik stupňů vzrostla teplota od ledna do května?",
    correctAnswer: "19 °C",
    options: ["19 °C", "9 °C", "14 °C", "5 °C"],
  },
  {
    question: "Koláčový graf volného času: sport 40%, četba 20%, počítač 30%, jiné 10%. Z 5 hodin volna kolik trávíme sportem?",
    correctAnswer: "2 hodiny",
    options: ["2 hodiny", "1 hodinu", "2,5 hodiny", "3 hodiny"],
  },
  {
    question: "Tabulka výsledků: 5A průměr 2,3; 5B průměr 2,5; 5C průměr 2,1. Která třída má nejlepší průměr?",
    correctAnswer: "5C – průměr 2,1",
    options: ["5C (průměr 2,1)", "5A (průměr 2,3)", "5B (průměr 2,5)", "všechny stejně"],
  },
  {
    question: "Sloupcový graf vývoje počtu obyvatel: 2000 = 10 000, 2010 = 10 500, 2020 = 9 800. Kdy byl největší počet obyvatel?",
    correctAnswer: "v roce 2010",
    options: ["v roce 2010", "v roce 2000", "v roce 2020", "ve všech letech stejně"],
  },
  {
    question: "Z tabulky: výdaje v lednu 4 500 Kč, únoru 5 200 Kč, březnu 4 800 Kč. Průměrné měsíční výdaje?",
    correctAnswer: "4 833 Kč",
    options: ["4 833 Kč", "4 800 Kč", "5 000 Kč", "14 500 Kč"],
  },
  {
    question: "Kombinovaný graf: škola má 280 žáků, z toho 45% navštěvuje kroužky. Kolik žáků chodí na kroužky?",
    correctAnswer: "126",
    options: ["126", "140", "112", "126,5"],
  },
  {
    question: "Sloupcový graf příjmů: jaro 1 200, léto 2 400, podzim 1 800, zima 600 Kč. Průměrný příjem za čtvrtletí?",
    correctAnswer: "1 500 Kč",
    options: ["1 500 Kč", "1 200 Kč", "1 800 Kč", "6 000 Kč"],
  },
  {
    question: "Tabulka srážek 2 let. Rok 1: leden 40, únor 30, průměr 35. Rok 2: leden 50, únor ?. Průměr roku 2 je 45. Kolik mm bylo v únoru roku 2?",
    correctAnswer: "40 mm",
    options: ["40 mm", "45 mm", "50 mm", "35 mm"],
  },
  {
    question: "Graf: v létě se v bazénu koupalo: červen 1 500, červenec 3 200, srpen 2 800 návštěvníků. Průměrně za léto?",
    correctAnswer: "2 500",
    options: ["2 500", "3 200", "2 800", "7 500"],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const DIAGRAMYGRAFYCTENIASESTAVOVANITABULEK: TopicMetadata[] = [
  {
    id: "g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-diagramy-grafy-cteni-a-sestavovani-tabulek",
    rvpNodeId: "g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-diagramy-grafy-cteni-a-sestavovani-tabulek",
    title: "Diagramy, grafy, čtení a sestavování tabulek",
    studentTitle: "Grafy a tabulky",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Přečteš data z grafu a sestavíš tabulku.",
    keywords: ["graf", "sloupcový graf", "koláčový graf", "tabulka", "data", "průměr", "diagramy"],
    goals: [
      "Přečíst data ze sloupcového, řádkového a koláčového grafu",
      "Zodpovědět otázky o datech z grafu",
      "Sestavit jednoduchou tabulku z dat",
      "Vypočítat průměr z tabulkových dat",
    ],
    boundaries: ["Bez tvorby grafů jako takových — jen čtení a interpretace", "Bez statistických pojmů jako medián, modus"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Při čtení grafu vždy nejprve přečti popisky os a legendu. Pak hledej hodnotu, na kterou se ptáme.",
      steps: [
        "Přečti nadpis grafu — o čem je.",
        "Přečti popis osy (co je na svislé a vodorovné ose).",
        "Najdi sloupec nebo bod, na který se ptáme.",
        "Přečti hodnotu a odpověz.",
      ],
      commonMistake: "Chyba: splést vodorovnou a svislou osu. Svislá osa obvykle ukazuje hodnoty (čísla), vodorovná kategorie.",
      example: "Ze sloupcového grafu oblíbených sportů: fotbal = 12, plavání = 8. Kdo má více příznivců? Fotbal (12 > 8).",
    },
  },
];
