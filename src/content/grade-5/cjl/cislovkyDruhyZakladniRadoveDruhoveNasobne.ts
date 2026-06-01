import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Jaký druh číslovky je 'pět'?",
    correctAnswer: "základní – kolik?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – koliker?", "násobná – kolikrát?"],
    hints: ["Základní číslovky vyjadřují počet: jeden, dva, pět, sto."],
  },
  {
    question: "Jaký druh číslovky je 'třetí'?",
    correctAnswer: "řadová – kolikátý?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – koliker?", "násobná – kolikrát?"],
    hints: ["Řadové číslovky vyjadřují pořadí: první, druhý, třetí."],
  },
  {
    question: "Jaký druh číslovky je 'dvoje'?",
    correctAnswer: "druhová – koliker?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – koliker?", "násobná – kolikrát?"],
    hints: ["Druhové číslovky: jedny, dvoje, troje, čtvery."],
  },
  {
    question: "Jaký druh číslovky je 'třikrát'?",
    correctAnswer: "násobná – kolikrát?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – koliker?", "násobná – kolikrát?"],
    hints: ["Násobné číslovky: jednou, dvakrát, třikrát, stonásobně."],
  },
  {
    question: "Jaký druh číslovky je 'druhý'?",
    correctAnswer: "řadová – kolikátý?",
    options: ["základní", "řadová – kolikátý?", "druhová", "násobná"],
    hints: ["Druhý = kolikátý? → řadová číslovka."],
  },
  {
    question: "Jaký druh číslovky je 'jednou'?",
    correctAnswer: "násobná – kolikrát?",
    options: ["základní", "řadová", "druhová", "násobná – kolikrát?"],
    hints: ["Jednou = kolikrát? Jednou → násobná."],
  },
  {
    question: "Jaký druh číslovky je 'jedny' (například jedny dveře)?",
    correctAnswer: "druhová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Jedny, dvoje, troje = druhové číslovky."],
  },
  {
    question: "Jaký druh číslovky je 'sedm'?",
    correctAnswer: "základní",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Sedm = kolik? → základní číslovka."],
  },
  {
    question: "Jaký druh číslovky je 'sedmý'?",
    correctAnswer: "řadová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Sedmý = kolikátý? → řadová číslovka."],
  },
  {
    question: "Jaký druh číslovky je 'sedmkrát'?",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Sedmkrát = kolikrát? → násobná číslovka."],
  },
  {
    question: "Na jakou otázku odpovídají základní číslovky?",
    correctAnswer: "kolik?",
    options: ["kolikátý?", "kolik?", "kolikery?", "kolikrát?"],
    hints: ["Základní = počet: kolik? → pět, deset, sto."],
  },
  {
    question: "Na jakou otázku odpovídají řadové číslovky?",
    correctAnswer: "kolikátý?",
    options: ["kolik?", "kolikátý?", "kolikery?", "kolikrát?"],
    hints: ["Řadové = pořadí: kolikátý? → první, druhý, třetí."],
  },
  {
    question: "Na jakou otázku odpovídají druhové číslovky?",
    correctAnswer: "kolikery? nebo koliker?",
    options: ["kolik?", "kolikátý?", "kolikery? nebo koliker?", "kolikrát?"],
    hints: ["Druhové = druh nebo sada: dvoje, troje."],
  },
  {
    question: "Na jakou otázku odpovídají násobné číslovky?",
    correctAnswer: "kolikrát?",
    options: ["kolik?", "kolikátý?", "kolikery?", "kolikrát?"],
    hints: ["Násobné = kolikrát opakujeme: jednou, dvakrát, trojnásobně."],
  },
  {
    question: "Jaký druh číslovky je 'trojnásobný'?",
    correctAnswer: "násobná – přídavné jméno odvozené od číslovky",
    options: [
      "základní",
      "řadová",
      "druhová",
      "násobná – přídavné jméno odvozené od číslovky",
    ],
    hints: ["Trojnásobný = tolikrát větší → násobná."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ve větě 'Přišla jako první.' jaký druh číslovky je 'první'?",
    correctAnswer: "řadová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Kolikátá přišla? První → řadová."],
  },
  {
    question: "Ve větě 'Koupil dvoje boty.' jaký druh číslovky je 'dvoje'?",
    correctAnswer: "druhová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Dvoje boty = pár věcí → druhová."],
  },
  {
    question: "Ve větě 'Přečetl jsem to dvakrát.' jaký druh číslovky je 'dvakrát'?",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Kolikrát přečetl? Dvakrát → násobná."],
  },
  {
    question: "Ve větě 'Máme sto korun.' jaký druh číslovky je 'sto'?",
    correctAnswer: "základní",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Kolik korun? Sto → základní."],
  },
  {
    question: "Co je rozdíl mezi 'tři' a 'troje'?",
    correctAnswer: "tři = základní (počet), troje = druhová – druh nebo sada věcí",
    options: [
      "jsou totéž",
      "tři = základní (počet), troje = druhová – druh nebo sada věcí",
      "tři je přídavné jméno",
      "troje je příslovce",
    ],
    hints: ["Tři jablka (počet). Troje dveře (sada/druh věcí)."],
  },
  {
    question: "Jaký druh číslovky je 'stonásobně'?",
    correctAnswer: "násobná – příslovce odvozené od násobné číslovky",
    options: ["základní", "řadová", "druhová", "násobná – příslovce odvozené od násobné číslovky"],
    hints: ["Stonásobně = tolikrát více → násobná."],
  },
  {
    question: "Ve větě 'Setkal jsem se s ním potřetí.' jaký druh číslovky je 'potřetí'?",
    correctAnswer: "násobná – kolikrát? = potřetí = po třetí",
    options: ["základní", "řadová", "druhová", "násobná – kolikrát? = potřetí = po třetí"],
    hints: ["Potřetí = po třetí = kolikrát? → násobná."],
  },
  {
    question: "Ve větě 'Na třetím místě skončila.' jaký druh číslovky je 'třetím'?",
    correctAnswer: "řadová – kolikáté místo?",
    options: ["základní", "řadová – kolikáté místo?", "druhová", "násobná"],
    hints: ["Kolikátém místě? Třetím → řadová."],
  },
  {
    question: "Jaký druh číslovky je 'půldruhého'?",
    correctAnswer: "základní – zlomková číslovka – 1,5",
    options: ["řadová", "druhová", "násobná", "základní – zlomková číslovka – 1,5"],
    hints: ["Půldruhého = jeden a půl = 1,5 → základní."],
  },
  {
    question: "Jaký druh číslovky je 'čtvrtý'?",
    correctAnswer: "řadová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Čtvrtý = kolikátý? → řadová."],
  },
  {
    question: "Jaký druh číslovky je 'čtvery' (čtvery housle)?",
    correctAnswer: "druhová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Čtvery = čtyři různé nebo čtyři páry věcí → druhová."],
  },
  {
    question: "Jaký druh číslovky je 'čtyřikrát'?",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Kolikrát? Čtyřikrát → násobná."],
  },
  {
    question: "Jaký druh číslovky je 'čtyři'?",
    correctAnswer: "základní",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Kolik? Čtyři → základní."],
  },
  {
    question: "Použij správný druh číslovky: 'Přeložil to do ___ jazyků.' (počet = 5)",
    correctAnswer: "pěti – nebo pěti jazyků – základní číslovka",
    options: ["pátých", "pětkrát", "pěti – nebo pěti jazyků – základní číslovka", "patery"],
    hints: ["Do kolika jazyků? = počet = základní číslovka."],
  },
  {
    question: "Použij správný druh číslovky: 'Dostal se na ___ místo.' (pořadí = 5)",
    correctAnswer: "páté – řadová číslovka",
    options: ["pět", "páté – řadová číslovka", "pětkrát", "patery"],
    hints: ["Kolikáté místo? Páté → řadová."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jaký druh číslovky je 'jednorázově'?",
    correctAnswer: "násobná – odvozená příslovečná forma = jednou/jednou",
    options: ["základní", "řadová", "druhová", "násobná – odvozená příslovečná forma = jednou/jednou"],
    hints: ["Jednorázově = jen jednou → násobná."],
  },
  {
    question: "Ve větě 'Koupila troje rukavice.' proč 'troje' a ne 'tři'?",
    correctAnswer: "rukavice jsou ve dvojicích/sadách → druhová číslovka",
    options: [
      "tři je špatně",
      "rukavice jsou ve dvojicích/sadách → druhová číslovka",
      "záleží na nářečí",
      "oboje je správně",
    ],
    hints: ["Věci existující v sadách nebo párech se počítají druhovými číslovkami."],
  },
  {
    question: "Jaký druh číslovky je 'jednosměrně'?",
    correctAnswer: "není číslovka – je to příslovce",
    options: [
      "základní",
      "násobná",
      "řadová",
      "není číslovka – je to příslovce",
    ],
    hints: ["Jednosměrně = příslovce způsobu, ne číslovka."],
  },
  {
    question: "Jaký druh číslovky je 'oba / obě'?",
    correctAnswer: "základní – = dva, dvě – speciální tvar pro 2 ze skupiny",
    options: [
      "druhová",
      "základní – = dva, dvě – speciální tvar pro 2 ze skupiny",
      "řadová",
      "násobná",
    ],
    hints: ["Oba/obě = speciální základní číslovka pro označení dvou z celku."],
  },
  {
    question: "Ve větě 'Psal jsem to desetkrát.' – určete druh číslovky 'desetkrát'.",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Kolikrát psal? Desetkrát → násobná."],
  },
  {
    question: "Řadová číslovka 'první' se skloňuje jako:",
    correctAnswer: "přídavné jméno – vzor mladý / jarní",
    options: [
      "podstatné jméno",
      "přídavné jméno – vzor mladý / jarní",
      "zájmeno",
      "neskloňuje se",
    ],
    hints: ["Řadové číslovky se skloňují jako přídavná jména."],
  },
  {
    question: "Základní číslovky 1–4 se skloňují jako:",
    correctAnswer: "přídavná jména nebo zájmena – jeden – jedno, dva – dvě...",
    options: [
      "podstatná jména",
      "přídavná jména nebo zájmena – jeden – jedno, dva – dvě...",
      "neskloňují se",
      "slovesa",
    ],
    hints: ["Jeden, jedna, jedno – skloňuje se jako přídavné jméno."],
  },
  {
    question: "Základní číslovky 5+ (pět, šest...) se skloňují jako:",
    correctAnswer: "podstatná jména – vzor kost – v nepřímých pádech: pěti, sedmi...",
    options: [
      "přídavná jména",
      "podstatná jména – vzor kost – v nepřímých pádech: pěti, sedmi...",
      "neskloňují se",
      "zájmena",
    ],
    hints: ["Pět, šest... → v nepřímých pádech: pěti, šesti (vzor kost)."],
  },
  {
    question: "Ve větě 'Přišel poprvé.' jaký druh číslovky je 'poprvé'?",
    correctAnswer: "násobná – = jednou, po prvé",
    options: ["základní", "řadová", "druhová", "násobná – = jednou, po prvé"],
    hints: ["Poprvé = kolikrát? = první → násobná."],
  },
  {
    question: "Jaký druh číslovky je 'několikrát'?",
    correctAnswer: "násobná neurčitá",
    options: ["základní neurčitá", "řadová neurčitá", "druhová neurčitá", "násobná neurčitá"],
    hints: ["Několikrát = kolikrát? → násobná. Neurčitá = přesné číslo neznáme."],
  },
  {
    question: "Jaký druh číslovky je 'dvojí' (například dvojí názor)?",
    correctAnswer: "druhová – = dvou druhů/typů",
    options: ["základní", "řadová", "druhová – = dvou druhů/typů", "násobná"],
    hints: ["Dvojí = dvou druhů → druhová číslovka."],
  },
  {
    question: "Ve větě 'Skóre bylo pět ku třem.' jaký druh číslovky jsou 'pět' a 'třem'?",
    correctAnswer: "obě jsou základní číslovky",
    options: [
      "řadové",
      "obě jsou základní číslovky",
      "druhové",
      "násobné",
    ],
    hints: ["Pět (kolik?) + třem (komu/čemu? = 3 v 3. pádu) = základní."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const CISLOVKYDRUHYZAKLADNIRADOVEDRUHOVENASOBNE: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-cislovky-druhy-zakladni-radove-druhove-nasobne",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-cislovky-druhy-zakladni-radove-druhove-nasobne",
    title: "Číslovky – druhy: základní, řadové, druhové, násobné",
    studentTitle: "Druhy číslovek",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Poznáš čtyři druhy číslovek – základní, řadové, druhové a násobné.",
    keywords: ["číslovky", "základní", "řadové", "druhové", "násobné", "kolik", "kolikátý"],
    goals: [
      "Rozlišit čtyři druhy číslovek",
      "Použít správný druh číslovky v kontextu",
      "Odpovědět na otázky kolik?, kolikátý?, koliker?, kolikrát?",
    ],
    boundaries: [
      "Neprobíráme skloňování číslovek podrobně",
      "Bez složitého dělení neurčitých číslovek",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Čtyři druhy číslovek: Základní (kolik?) = pět. Řadové (kolikátý?) = pátý. Druhové (kolikery?) = patery. Násobné (kolikrát?) = pětkrát.",
      steps: [
        "Přečti číslovku a zeptej se otázkou.",
        "Kolik? → základní (pět, sto, tisíc).",
        "Kolikátý? → řadová (pátý, stý).",
        "Kolikery? → druhová (patery, dvoje).",
        "Kolikrát? → násobná (pětkrát, jednou, trojnásobně).",
      ],
      commonMistake: "Žáci si pletou základní a druhové číslovky. 'Tři' = základní (počet). 'Troje' = druhová (druh/sada).",
      example: "Tři jablka (základní). Třetí místo (řadová). Troje dveře (druhová). Třikrát denně (násobná).",
    },
  },
];
