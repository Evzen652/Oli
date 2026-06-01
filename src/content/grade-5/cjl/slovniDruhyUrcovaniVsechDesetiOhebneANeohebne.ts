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
    options: ["6", "8", "10", "12"],
    hints: ["V češtině je přesně 10 slovních druhů."],
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
    options: ["podstatné jméno", "přídavné jméno", "sloveso", "příslovce"],
    hints: ["Přídavná jména vyjadřují vlastnosti."],
  },
  {
    question: "Jaký slovní druh je slovo 'běžet'?",
    correctAnswer: "sloveso",
    options: ["podstatné jméno", "přídavné jméno", "sloveso", "příslovce"],
    hints: ["Slovesa vyjadřují činnost nebo stav."],
  },
  {
    question: "Jaký slovní druh je slovo 'rychle'?",
    correctAnswer: "příslovce",
    options: ["přídavné jméno", "sloveso", "příslovce", "předložka"],
    hints: ["Příslovce blíže určuje děj nebo vlastnost."],
  },
  {
    question: "Jaký slovní druh je slovo 'já'?",
    correctAnswer: "zájmeno",
    options: ["podstatné jméno", "přídavné jméno", "zájmeno", "citoslovce"],
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
    options: ["příslovce", "spojka", "předložka", "citoslovce"],
    hints: ["Předložky se pojí s podstatnými jmény a určují vztahy."],
  },
  {
    question: "Jaký slovní druh je slovo 'a' (ve větě 'Petr a Pavel.')?",
    correctAnswer: "spojka",
    options: ["citoslovce", "předložka", "příslovce", "spojka"],
    hints: ["Spojky spojují slova nebo věty."],
  },
  {
    question: "Jaký slovní druh je slovo 'ano'?",
    correctAnswer: "částice",
    options: ["citoslovce", "spojka", "příslovce", "částice"],
    hints: ["Částice vyjadřují postoj mluvčího (ano, ne, snad, prý)."],
  },
  {
    question: "Jaký slovní druh je slovo 'au'?",
    correctAnswer: "citoslovce",
    options: ["příslovce", "citoslovce", "částice", "spojka"],
    hints: ["Citoslovce vyjadřují city nebo zvuky."],
  },
  {
    question: "Ohebné slovní druhy jsou ty, které:",
    correctAnswer: "se mění – skloňují nebo časují",
    options: [
      "se nikdy nemění",
      "se mění (skloňují nebo časují)",
      "jsou vždy krátká",
      "jsou jen podstatná jména",
    ],
    hints: ["Ohebné = mění se v pádech, osobách atd."],
  },
  {
    question: "Neohebné slovní druhy jsou:",
    correctAnswer: "příslovce, předložka, spojka, částice, citoslovce",
    options: [
      "podstatná jména, přídavná jména, zájmena",
      "příslovce, předložka, spojka, částice, citoslovce",
      "slovesa, číslovky, zájmena",
      "jen předložky a spojky",
    ],
    hints: ["Neohebné = nemění se (příslovce, předložky, spojky, částice, citoslovce)."],
  },
  {
    question: "Ve větě 'Dívka tiše zpívala.' – jaký slovní druh je 'tiše'?",
    correctAnswer: "příslovce",
    options: ["přídavné jméno", "příslovce", "sloveso", "podstatné jméno"],
    hints: ["Tiše = jak zpívala? → příslovce způsobu."],
  },
  {
    question: "Ve větě 'Ahoj, jak se máš?' – jaký slovní druh je 'ahoj'?",
    correctAnswer: "citoslovce",
    options: ["příslovce", "spojka", "podstatné jméno", "citoslovce"],
    hints: ["Ahoj je pozdrav – vyjadřuje citový postoj = citoslovce."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ve větě 'Ten velký pes rychle utekl.' – jaký slovní druh je 'ten'?",
    correctAnswer: "zájmeno – ukazovací",
    options: ["přídavné jméno", "číslovka", "zájmeno (ukazovací)", "podstatné jméno"],
    hints: ["Ten = ukazovací zájmeno, zastupuje nebo upřesňuje jméno."],
  },
  {
    question: "Ve větě 'Tři ptáci odletěli.' – jaký slovní druh je 'tři'?",
    correctAnswer: "číslovka – základní",
    options: ["přídavné jméno", "příslovce", "číslovka (základní)", "podstatné jméno"],
    hints: ["Tři = počet → číslovka základní."],
  },
  {
    question: "Ve větě 'Byl jsem v lese.' – jaký slovní druh je 'v'?",
    correctAnswer: "předložka",
    options: ["spojka", "příslovce", "částice", "předložka"],
    hints: ["'V' + podstatné jméno → předložka."],
  },
  {
    question: "Ve větě 'Prý bude pršet.' – jaký slovní druh je 'prý'?",
    correctAnswer: "částice",
    options: ["příslovce", "spojka", "citoslovce", "částice"],
    hints: ["'Prý' vyjadřuje postoj (pochybnost, cizí informaci) = částice."],
  },
  {
    question: "Ve větě 'Byl jsem unavený, ale šel jsem.' – jaký slovní druh je 'ale'?",
    correctAnswer: "spojka – odporovací",
    options: ["citoslovce", "částice", "příslovce", "spojka (odporovací)"],
    hints: ["'Ale' spojuje věty s odporovacím vztahem = spojka."],
  },
  {
    question: "Ve větě 'Ona je moje sestra.' – jaký slovní druh je 'ona'?",
    correctAnswer: "zájmeno – osobní",
    options: ["podstatné jméno", "přídavné jméno", "zájmeno (osobní)", "citoslovce"],
    hints: ["Ona zastupuje jméno – osobní zájmeno."],
  },
  {
    question: "Ve větě 'Hups, to bylo rychlé!' – jaký slovní druh je 'hups'?",
    correctAnswer: "citoslovce",
    options: ["příslovce", "částice", "citoslovce", "zájmeno"],
    hints: ["Hups vyjadřuje překvapení nebo reakci = citoslovce."],
  },
  {
    question: "Ve větě 'Zítra přijdeme.' – jaký slovní druh je 'zítra'?",
    correctAnswer: "příslovce – časové",
    options: ["přídavné jméno", "podstatné jméno", "příslovce (časové)", "předložka"],
    hints: ["Zítra = kdy? → příslovce časové."],
  },
  {
    question: "Ve větě 'Každý to ví.' – jaký slovní druh je 'každý'?",
    correctAnswer: "zájmeno – neurčité",
    options: ["přídavné jméno", "číslovka", "zájmeno (neurčité)", "podstatné jméno"],
    hints: ["Každý zastupuje podstatné jméno – neurčité zájmeno."],
  },
  {
    question: "Ohebné slovní druhy jsou (5 z 10):",
    correctAnswer: "podstatná jména, přídavná jména, zájmena, číslovky, slovesa",
    options: [
      "příslovce, předložky, spojky, citoslovce, částice",
      "podstatná jména, přídavná jména, zájmena, číslovky, slovesa",
      "jen podstatná jména a slovesa",
      "jen zájmena a číslovky",
    ],
    hints: ["Pět ohebných druhů = skloňují se nebo časují."],
  },
  {
    question: "Ve větě 'Bez práce nejsou koláče.' – jaký slovní druh je 'bez'?",
    correctAnswer: "předložka",
    options: ["spojka", "příslovce", "předložka", "částice"],
    hints: ["'Bez' se pojí s 2. pádem – je to předložka."],
  },
  {
    question: "Ve větě 'Snad přijde.' – jaký slovní druh je 'snad'?",
    correctAnswer: "částice",
    options: ["příslovce", "citoslovce", "spojka", "částice"],
    hints: ["'Snad' vyjadřuje nejistotu nebo přání = částice."],
  },
  {
    question: "Ve větě 'Psal jsem celé odpoledne.' – jaký slovní druh je 'celé'?",
    correctAnswer: "přídavné jméno",
    options: ["příslovce", "přídavné jméno", "zájmeno", "číslovka"],
    hints: ["Celé odpoledne = jaké odpoledne? Celé = přídavné jméno."],
  },
  {
    question: "Ve větě 'Zpívala jsem nahlas.' – jaký slovní druh je 'nahlas'?",
    correctAnswer: "příslovce – způsobu",
    options: ["přídavné jméno", "příslovce (způsobu)", "podstatné jméno", "předložka"],
    hints: ["Zpívala jak? Nahlas. → příslovce způsobu."],
  },
  {
    question: "Ve větě 'Oba chlapci přišli.' – jaký slovní druh je 'oba'?",
    correctAnswer: "číslovka – druhová/základní",
    options: ["přídavné jméno", "zájmeno", "číslovka (druhová/základní)", "příslovce"],
    hints: ["Oba = vyjadřuje počet – číslovka."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Ve větě 'Kráčel pomalu podél řeky.' – jaký slovní druh je 'podél'?",
    correctAnswer: "předložka",
    options: ["příslovce", "spojka", "předložka", "citoslovce"],
    hints: ["Podél + podstatné jméno v 2. pádě = předložka."],
  },
  {
    question: "Ve větě 'Nevím, zda přijde.' – jaký slovní druh je 'zda'?",
    correctAnswer: "spojka – podřadící",
    options: ["příslovce", "částice", "zájmeno", "spojka (podřadící)"],
    hints: ["'Zda' uvádí vedlejší větu = podřadící spojka."],
  },
  {
    question: "Jaký slovní druh je slovo 'totiž' (ve větě 'Přišel pozdě, přišel totiž pěšky.')?",
    correctAnswer: "spojka – souřadící vysvětlovací",
    options: ["příslovce", "citoslovce", "spojka (souřadící vysvětlovací)", "částice"],
    hints: ["'Totiž' vysvětluje předchozí větu = spojka."],
  },
  {
    question: "Ve větě 'Bohu dík.' – jaký slovní druh je 'dík'?",
    correctAnswer: "citoslovce – vyjadřuje poděkování",
    options: ["podstatné jméno", "citoslovce (vyjadřuje poděkování)", "příslovce", "sloveso"],
    hints: ["'Dík' jako vykřičník poděkování = citoslovce."],
  },
  {
    question: "Ve větě 'Není to vůbec pravda.' – jaký slovní druh je 'vůbec'?",
    correctAnswer: "příslovce – záporné zesílení",
    options: ["částice", "příslovce (záporné zesílení)", "spojka", "citoslovce"],
    hints: ["'Vůbec' modifikuje záporný výrok = příslovce."],
  },
  {
    question: "Ve větě 'Alespoň se omluv.' – jaký slovní druh je 'alespoň'?",
    correctAnswer: "částice",
    options: ["příslovce", "spojka", "citoslovce", "částice"],
    hints: ["'Alespoň' vyjadřuje postoj mluvčího (minimální požadavek) = částice."],
  },
  {
    question: "Ve větě 'Šel tam a zpět.' – jaký slovní druh je 'zpět'?",
    correctAnswer: "příslovce – místa",
    options: ["předložka", "částice", "příslovce (místa)", "spojka"],
    hints: ["Šel kam? Zpět = příslovce."],
  },
  {
    question: "Ve větě 'Řekni mi, co to je.' – jaký slovní druh je 'co'?",
    correctAnswer: "zájmeno – tázací / vztažné",
    options: ["spojka", "příslovce", "citoslovce", "zájmeno (tázací / vztažné)"],
    hints: ["'Co' může být tázací zájmeno nebo vztažné zájmeno."],
  },
  {
    question: "Ve větě 'Šel jsem spát, i když jsem nebyl unavený.' – jaký slovní druh je 'i'?",
    correctAnswer: "spojka – součást složené spojky 'i když'",
    options: [
      "číslovka (= 1)",
      "citoslovce",
      "spojka (součást složené spojky 'i když')",
      "příslovce",
    ],
    hints: ["'I' zde není číslo – je to součást složené spojky 'i když'."],
  },
  {
    question: "Ve větě 'Třetí závod dopadl nejlépe.' – jaký slovní druh je 'třetí'?",
    correctAnswer: "číslovka – řadová",
    options: ["přídavné jméno", "příslovce", "číslovka (řadová)", "zájmeno"],
    hints: ["Třetí = pořadí (kolikátý?) = řadová číslovka."],
  },
  {
    question: "Ve větě 'Sedí tamhle.' – jaký slovní druh je 'tamhle'?",
    correctAnswer: "příslovce – místa",
    options: ["zájmeno", "citoslovce", "příslovce (místa)", "předložka"],
    hints: ["Kde sedí? Tamhle = příslovce místa."],
  },
  {
    question: "Ve větě 'Rád pomáhám.' – jaký slovní druh je 'rád'?",
    correctAnswer: "příslovce – ve funkci příslovce způsobu k slovesu",
    options: [
      "přídavné jméno",
      "příslovce (ve funkci příslovce způsobu k slovesu)",
      "sloveso",
      "zájmeno",
    ],
    hints: ["'Rád' modifikuje sloveso pomáhám = příslovce."],
  },
  {
    question: "Ve větě 'Kéž by přišel!' – jaký slovní druh je 'kéž'?",
    correctAnswer: "částice – přací",
    options: ["spojka", "citoslovce", "příslovce", "částice (přací)"],
    hints: ["'Kéž' vyjadřuje přání = přací částice."],
  },
  {
    question: "Ve větě 'Nic neřekl.' – jaký slovní druh je 'nic'?",
    correctAnswer: "zájmeno – záporné",
    options: ["příslovce", "podstatné jméno", "zájmeno (záporné)", "citoslovce"],
    hints: ["'Nic' zastupuje věc – záporné zájmeno."],
  },
  {
    question: "Ve větě 'Přišel, čili se pozdravili.' – jaký slovní druh je 'čili'?",
    correctAnswer: "spojka – souřadící vysvětlovací nebo alternativní",
    options: ["příslovce", "citoslovce", "částice", "spojka (souřadící vysvětlovací nebo alternativní)"],
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
