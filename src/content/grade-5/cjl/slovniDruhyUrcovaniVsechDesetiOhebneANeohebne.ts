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
    question: "Kolik slovních druhů je v češtině?",
    correctAnswer: "10",
    options: ["10", "6", "8", "12"],
    hints: ["Vzpomeň si na všechny skupiny: jména, slovesa, zájmena, číslovky, příslovce, neohebné — kolik to celkem dá?"],
  },
  {
    question: "Jaký slovní druh je slovo 'pes'?",
    correctAnswer: "podstatné jméno",
    options: ["přídavné jméno", "podstatné jméno", "sloveso", "příslovce"],
    hints: ["Podstatná jména označují věci, osoby, zvířata, jevy."],
  },
  {
    question: "Jaký slovní druh je slovo 'krásný'?",
    correctAnswer: "přídavné jméno",
    options: ["podstatné jméno", "sloveso", "přídavné jméno", "příslovce"],
    hints: ["Přídavná jména vyjadřují vlastnosti."],
  },
  {
    question: "Jaký slovní druh je slovo 'běžet'?",
    correctAnswer: "sloveso",
    options: ["podstatné jméno", "přídavné jméno", "příslovce", "sloveso"],
    hints: ["Slovesa vyjadřují činnost nebo stav."],
  },
  {
    question: "Jaký slovní druh je slovo 'rychle'?",
    correctAnswer: "příslovce",
    options: ["příslovce", "přídavné jméno", "sloveso", "předložka"],
    hints: ["Zeptej se: běžel jak? Rychle. Slovo, které odpovídá na 'jak', patří do které skupiny?"],
  },
  {
    question: "Jaký slovní druh je slovo 'já'?",
    correctAnswer: "zájmeno",
    options: ["podstatné jméno", "zájmeno", "přídavné jméno", "citoslovce"],
    hints: ["Zájmena zastupují podstatná nebo přídavná jména."],
  },
  {
    question: "Jaký slovní druh je slovo 'pět'?",
    correctAnswer: "číslovka",
    options: ["příslovce", "podstatné jméno", "číslovka", "přídavné jméno"],
    hints: ["Číslovky vyjadřují počet nebo pořadí."],
  },
  {
    question: "Jaký slovní druh je slovo 'na' (ve větě 'Jdu na hřiště.')?",
    correctAnswer: "předložka",
    options: ["příslovce", "spojka", "citoslovce", "předložka"],
    hints: ["Předložky se pojí s podstatnými jmény a určují vztahy."],
  },
  {
    question: "Jaký slovní druh je slovo 'a' (ve větě 'Petr a Pavel.')?",
    correctAnswer: "spojka",
    options: ["spojka", "citoslovce", "předložka", "příslovce"],
    hints: ["Spojky spojují slova nebo věty."],
  },
  {
    question: "Jaký slovní druh je slovo 'ano'?",
    correctAnswer: "částice",
    options: ["citoslovce", "částice", "spojka", "příslovce"],
    hints: ["'Ano' vyjadřuje postoj mluvčího a nic neoznačuje ani nezastupuje. Který slovní druh to je?"],
  },
  {
    question: "Jaký slovní druh je slovo 'au'?",
    correctAnswer: "citoslovce",
    options: ["příslovce", "částice", "citoslovce", "spojka"],
    hints: ["'Au' napodobuje zvuk bolesti a nezapojuje se do věty jako její člen. Který slovní druh to je?"],
  },
  {
    question: "Ohebné slovní druhy jsou ty, které:",
    correctAnswer: "se mění – skloňují nebo časují",
    options: ["se nikdy nemění", "jsou vždy krátká", "jsou jen podstatná jména", "se mění – skloňují nebo časují"],
    hints: ["Ohebné = mění se v pádech, osobách atd."],
  },
  {
    question: "Neohebné slovní druhy jsou:",
    correctAnswer: "příslovce, předložka, spojka, částice, citoslovce",
    options: ["příslovce, předložka, spojka, částice, citoslovce", "podstatná jména, přídavná jména, zájmena", "slovesa, číslovky, zájmena", "jen předložky a spojky"],
    hints: ["Neohebné = nemění se v pádech ani osobách. Patří sem příslovce a dále čtyři skupiny slov, která slouží jako 'spojovací' nebo 'doplňující' — dokážeš je vyjmenovat?"],
  },
  {
    question: "Ve větě 'Dívka tiše zpívala.' – jaký slovní druh je 'tiše'?",
    correctAnswer: "příslovce",
    options: ["přídavné jméno", "příslovce", "sloveso", "podstatné jméno"],
    hints: ["Zeptej se: jak zpívala? Slovo, které odpovídá na otázku 'jak/kde/kdy/proč' u slovesa, patří do které skupiny?"],
  },
  {
    question: "Ve větě 'Ahoj, jak se máš?' – jaký slovní druh je 'ahoj'?",
    correctAnswer: "citoslovce",
    options: ["příslovce", "spojka", "citoslovce", "podstatné jméno"],
    hints: ["'Ahoj' vyjadřuje citový nebo sociální postoj — nemění se, netvoří větné sklady. Který slovní druh vyjadřuje city a zvuky?"],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ve větě 'Ten velký pes rychle utekl.' – jaký slovní druh je 'ten'?",
    correctAnswer: "zájmeno – ukazovací",
    options: ["přídavné jméno", "číslovka", "podstatné jméno", "zájmeno – ukazovací"],
    hints: ["Ten = ukazovací zájmeno, zastupuje nebo upřesňuje jméno."],
  },
  {
    question: "Ve větě 'Tři ptáci odletěli.' – jaký slovní druh je 'tři'?",
    correctAnswer: "číslovka – základní",
    options: ["číslovka – základní", "přídavné jméno", "příslovce", "podstatné jméno"],
    hints: ["Kolik ptáků? Tři. Slovo, které odpovídá na 'kolik', patří do které skupiny?"],
  },
  {
    question: "Ve větě 'Byl jsem v lese.' – jaký slovní druh je 'v'?",
    correctAnswer: "předložka",
    options: ["spojka", "předložka", "příslovce", "částice"],
    hints: ["'V' se pojí s podstatným jménem a určuje vztah (kde?) — samo o sobě nic neznamená. Který slovní druh takhle funguje?"],
  },
  {
    question: "Ve větě 'Prý bude pršet.' – jaký slovní druh je 'prý'?",
    correctAnswer: "částice",
    options: ["příslovce", "spojka", "částice", "citoslovce"],
    hints: ["'Prý' naznačuje, že informace je od někoho jiného, a nezastupuje jméno ani neurčuje děj. Který slovní druh vyjadřuje postoj mluvčího?"],
  },
  {
    question: "Ve větě 'Byl jsem unavený, ale šel jsem.' – jaký slovní druh je 'ale'?",
    correctAnswer: "spojka – odporovací",
    options: ["citoslovce", "částice", "příslovce", "spojka – odporovací"],
    hints: ["'Ale' spojuje dvě věty a ukazuje, že si odporují — samo o sobě větným členem není. Který slovní druh spojuje věty?"],
  },
  {
    question: "Ve větě 'Ona je moje sestra.' – jaký slovní druh je 'ona'?",
    correctAnswer: "zájmeno – osobní",
    options: ["zájmeno – osobní", "podstatné jméno", "přídavné jméno", "citoslovce"],
    hints: ["Ona zastupuje jméno – osobní zájmeno."],
  },
  {
    question: "Ve větě 'Hups, to bylo rychlé!' – jaký slovní druh je 'hups'?",
    correctAnswer: "citoslovce",
    options: ["příslovce", "citoslovce", "částice", "zájmeno"],
    hints: ["'Hups' vyjadřuje překvapení, ale netvoří se s ním věta — stojí samo o sobě. Který slovní druh to je?"],
  },
  {
    question: "Ve větě 'Zítra přijdeme.' – jaký slovní druh je 'zítra'?",
    correctAnswer: "příslovce – časové",
    options: ["přídavné jméno", "podstatné jméno", "příslovce – časové", "předložka"],
    hints: ["Přijdeme kdy? Zítra. Slovo, které odpovídá na 'kdy', patří do které skupiny?"],
  },
  {
    question: "Ve větě 'Každý to ví.' – jaký slovní druh je 'každý'?",
    correctAnswer: "zájmeno – neurčité",
    options: ["přídavné jméno", "číslovka", "podstatné jméno", "zájmeno – neurčité"],
    hints: ["Každý zastupuje podstatné jméno – neurčité zájmeno."],
  },
  {
    question: "Ohebné slovní druhy jsou (5 z 10):",
    correctAnswer: "podstatná jména, přídavná jména, zájmena, číslovky, slovesa",
    options: ["podstatná jména, přídavná jména, zájmena, číslovky, slovesa", "příslovce, předložky, spojky, citoslovce, částice", "jen podstatná jména a slovesa", "jen zájmena a číslovky"],
    hints: ["Pět ohebných druhů = skloňují se nebo časují."],
  },
  {
    question: "Ve větě 'Bez práce nejsou koláče.' – jaký slovní druh je 'bez'?",
    correctAnswer: "předložka",
    options: ["spojka", "předložka", "příslovce", "částice"],
    hints: ["'Bez' se pojí s podstatným jménem ve 2. pádě a samo o sobě nic neznamená. Který slovní druh takhle funguje?"],
  },
  {
    question: "Ve větě 'Snad přijde.' – jaký slovní druh je 'snad'?",
    correctAnswer: "částice",
    options: ["příslovce", "citoslovce", "částice", "spojka"],
    hints: ["'Snad' vyjadřuje nejistotu mluvčího a nic neoznačuje ani neurčuje děj. Který slovní druh to je?"],
  },
  {
    question: "Ve větě 'Psal jsem celé odpoledne.' – jaký slovní druh je 'celé'?",
    correctAnswer: "přídavné jméno",
    options: ["příslovce", "zájmeno", "číslovka", "přídavné jméno"],
    hints: ["Odpoledne jaké? Celé. Slovo, které odpovídá na otázku 'jaký/jaká/jaké', patří do které skupiny?"],
  },
  {
    question: "Ve větě 'Zpívala jsem nahlas.' – jaký slovní druh je 'nahlas'?",
    correctAnswer: "příslovce – způsobu",
    options: ["příslovce – způsobu", "přídavné jméno", "podstatné jméno", "předložka"],
    hints: ["Zpívala jak? Nahlas. Slovo, které odpovídá na 'jak', patří do které skupiny?"],
  },
  {
    question: "Ve větě 'Oba chlapci přišli.' – jaký slovní druh je 'oba'?",
    correctAnswer: "číslovka – druhová/základní",
    options: ["přídavné jméno", "číslovka – druhová/základní", "zájmeno", "příslovce"],
    hints: ["Kolik chlapců? Oba. Slovo, které odpovídá na 'kolik', patří do které skupiny?"],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Ve větě 'Kráčel pomalu podél řeky.' – jaký slovní druh je 'podél'?",
    correctAnswer: "předložka",
    options: ["příslovce", "spojka", "předložka", "citoslovce"],
    hints: ["'Podél' se pojí s podstatným jménem ve 2. pádě a samo o sobě nic neznamená. Který slovní druh takhle funguje?"],
  },
  {
    question: "Ve větě 'Nevím, zda přijde.' – jaký slovní druh je 'zda'?",
    correctAnswer: "spojka – podřadící",
    options: ["příslovce způsobu", "částice vyjadřující postoj", "zájmeno zastupující jméno", "spojka – podřadící"],
    hints: ["Bez 'zda' by věta 'Nevím, zda přijde' nedávala smysl jako celek — napojuje vedlejší větu na hlavní. Který slovní druh spojuje věty?"],
  },
  {
    question: "Jaký slovní druh je slovo 'totiž' (ve větě 'Přišel pozdě, přišel totiž pěšky.')?",
    correctAnswer: "spojka – souřadící vysvětlovací",
    options: ["spojka – souřadící vysvětlovací", "příslovce vyjadřující míru", "citoslovce vyjadřující cit", "částice vyjadřující postoj"],
    hints: ["'Totiž' vysvětluje předchozí větu = spojka."],
  },
  {
    question: "Ve větě 'Bohu dík.' – jaký slovní druh je 'dík'?",
    correctAnswer: "citoslovce – vyjadřuje poděkování",
    options: ["podstatné jméno, protože pojmenovává věc", "citoslovce – vyjadřuje poděkování", "příslovce vyjadřující způsob", "sloveso vyjadřující děj"],
    hints: ["'Dík' jako vykřičník poděkování = citoslovce."],
  },
  {
    question: "Ve větě 'Není to vůbec pravda.' – jaký slovní druh je 'vůbec'?",
    correctAnswer: "příslovce – záporné zesílení",
    options: ["částice zdůrazňující výrok", "spojka spojující dvě věty", "příslovce – záporné zesílení", "citoslovce vyjadřující cit"],
    hints: ["'Vůbec' modifikuje záporný výrok = příslovce."],
  },
  {
    question: "Ve větě 'Alespoň se omluv.' – jaký slovní druh je 'alespoň'?",
    correctAnswer: "částice",
    options: ["příslovce", "spojka", "citoslovce", "částice"],
    hints: ["'Alespoň' vyjadřuje postoj mluvčího a nic neoznačuje ani neurčuje děj. Který slovní druh to je?"],
  },
  {
    question: "Ve větě 'Šel tam a zpět.' – jaký slovní druh je 'zpět'?",
    correctAnswer: "příslovce – místa",
    options: ["příslovce – místa", "předložka", "částice", "spojka"],
    hints: ["Šel kam? Zpět. Slovo, které odpovídá na 'kam/kde', patří do které skupiny?"],
  },
  {
    question: "Ve větě 'Řekni mi, co to je.' – jaký slovní druh je 'co'?",
    correctAnswer: "zájmeno – tázací / vztažné",
    options: ["spojka spojující dvě věty", "zájmeno – tázací / vztažné", "příslovce vyjadřující způsob", "citoslovce vyjadřující cit"],
    hints: ["'Co' může být tázací zájmeno nebo vztažné zájmeno."],
  },
  {
    question: "Ve větě 'Šel jsem spát, i když jsem nebyl unavený.' – jaký slovní druh je 'i'?",
    correctAnswer: "spojka – součást složené spojky 'i když'",
    options: ["číslovka, protože znamená přesně 1", "citoslovce vyjadřující cit", "spojka – součást složené spojky 'i když'", "příslovce vyjadřující míru"],
    hints: ["'I když' spojuje dvě věty dohromady jako jeden celek — samo 'i' tu číslo neznamená. Který slovní druh spojuje věty?"],
  },
  {
    question: "Ve větě 'Třetí závod dopadl nejlépe.' – jaký slovní druh je 'třetí'?",
    correctAnswer: "číslovka – řadová",
    options: ["přídavné jméno", "příslovce", "zájmeno", "číslovka – řadová"],
    hints: ["Kolikátý závod? Třetí. Slovo, které odpovídá na 'kolikátý', patří do které skupiny?"],
  },
  {
    question: "Ve větě 'Sedí tamhle.' – jaký slovní druh je 'tamhle'?",
    correctAnswer: "příslovce – místa",
    options: ["příslovce – místa", "zájmeno", "citoslovce", "předložka"],
    hints: ["Kde sedí? Tamhle. Slovo, které odpovídá na 'kde', patří do které skupiny?"],
  },
  {
    question: "Ve větě 'Rád pomáhám.' – jaký slovní druh je 'rád'?",
    correctAnswer: "příslovce – ve funkci příslovce způsobu k slovesu",
    options: [
      "přídavné jméno, protože popisuje osobu",
      "příslovce – ve funkci příslovce způsobu k slovesu",
      "sloveso, protože vyjadřuje děj",
      "zájmeno, protože zastupuje jméno",
    ],
    hints: ["'Rád' modifikuje sloveso pomáhám = příslovce."],
  },
  {
    question: "Ve větě 'Kéž by přišel!' – jaký slovní druh je 'kéž'?",
    correctAnswer: "částice – přací",
    options: ["spojka", "citoslovce", "částice – přací", "příslovce"],
    hints: ["'Kéž' vyjadřuje přání mluvčího a nic neoznačuje ani neurčuje děj. Který slovní druh to je?"],
  },
  {
    question: "Ve větě 'Nic neřekl.' – jaký slovní druh je 'nic'?",
    correctAnswer: "zájmeno – záporné",
    options: ["příslovce", "podstatné jméno", "citoslovce", "zájmeno – záporné"],
    hints: ["'Nic' stojí místo podstatného jména (neřekl žádnou věc) — samo věc nepojmenovává. Který slovní druh zastupuje jména?"],
  },
  {
    question: "Ve větě 'Přišel, čili se pozdravili.' – jaký slovní druh je 'čili'?",
    correctAnswer: "spojka – souřadící vysvětlovací nebo alternativní",
    options: ["spojka – souřadící vysvětlovací nebo alternativní", "příslovce vyjadřující způsob", "citoslovce vyjadřující cit", "částice vyjadřující postoj"],
    hints: ["'Čili' = nebo jinak řečeno; jinak = spojka."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SLOVNIDRUHYURCOVANIVSECHDESETIOHEBNEANEOHEBNE: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-slovni-druhy-urcovani-vsech-deseti-ohebne-a-neohebne",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-slovni-druhy-urcovani-vsech-deseti-ohebne-a-neohebne",
    title: "Slovní druhy – určování všech deseti, ohebné a neohebné",
    studentTitle: "Deset slovních druhů",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Určíš slovní druh každého slova ve větě.",
    keywords: ["slovní druhy", "ohebné", "neohebné", "podstatné jméno", "přídavné jméno", "sloveso", "příslovce", "zájmeno", "číslovka"],
    goals: [
      "Správně určit slovní druh slova ve větě",
      "Rozlišit ohebné a neohebné slovní druhy",
      "Uvést příklady všech 10 slovních druhů",
    ],
    boundaries: [
      "Bez pokročilé morfologické analýzy",
      "Neprobíráme přechodníky podrobně",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Deset slovních druhů: 1. podstatné jméno, 2. přídavné jméno, 3. zájmeno, 4. číslovka, 5. sloveso, 6. příslovce, 7. předložka, 8. spojka, 9. částice, 10. citoslovce.",
      steps: [
        "Přečti slovo v kontextu věty.",
        "Zeptej se: označuje věc/osobu? → podstatné jméno.",
        "Vyjadřuje vlastnost? → přídavné jméno.",
        "Je to děj? → sloveso. Upřesňuje děj? → příslovce.",
        "Zastupuje jméno? → zájmeno. Vyjadřuje počet? → číslovka.",
      ],
      commonMistake: "Žáci si pletou přídavná jména a příslovce. Přídavné jméno určuje podstatné jméno, příslovce určuje sloveso.",
      example: "'Šel rychle.' – rychle = příslovce (určuje sloveso šel). 'Byl rychlý.' – rychlý = přídavné jméno (určuje podstatné jméno).",
    },
  },
];
