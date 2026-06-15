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
    hints: ["Zeptej se: kolik? Pokud otázka dává smysl, jde o jeden z druhů číslovek, který vyjadřuje samotný počet."],
  },
  {
    question: "Jaký druh číslovky je 'třetí'?",
    correctAnswer: "řadová – kolikátý?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – koliker?", "násobná – kolikrát?"],
    hints: ["Zeptej se: kolikátý? Pokud otázka sedí, jde o druh číslovky vyjadřující pořadí."],
  },
  {
    question: "Jaký druh číslovky je 'dvoje'?",
    correctAnswer: "druhová – koliker?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – koliker?", "násobná – kolikrát?"],
    hints: ["Zeptej se: koliker? nebo kolikery? Tato číslovka označuje druh nebo sadu věcí, ne pouhý počet."],
  },
  {
    question: "Jaký druh číslovky je 'třikrát'?",
    correctAnswer: "násobná – kolikrát?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – koliker?", "násobná – kolikrát?"],
    hints: ["Zeptej se: kolikrát? Pokud otázka sedí, jde o druh číslovky vyjadřující opakování děje."],
  },
  {
    question: "Jaký druh číslovky je 'druhý'?",
    correctAnswer: "řadová – kolikátý?",
    options: ["základní", "řadová – kolikátý?", "druhová", "násobná"],
    hints: ["Zkus se zeptat na toto číslo otázkou. Která z otázek (kolik? / kolikátý? / koliker? / kolikrát?) sem pasuje?"],
  },
  {
    question: "Jaký druh číslovky je 'jednou'?",
    correctAnswer: "násobná – kolikrát?",
    options: ["základní", "řadová", "druhová", "násobná – kolikrát?"],
    hints: ["Zkus se zeptat: kolikrát? Pokud otázka sedí, víš, o jaký druh jde."],
  },
  {
    question: "Jaký druh číslovky je 'jedny' (například jedny dveře)?",
    correctAnswer: "druhová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Tato číslovka označuje sadu nebo druh věcí (například věci, které přirozeně tvoří pár). Která otázka se jí ptá?"],
  },
  {
    question: "Jaký druh číslovky je 'sedm'?",
    correctAnswer: "základní",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Zkus se zeptat na toto číslo otázkou: kolik? kolikátý? kolikrát? Která otázka sem sedí nejlépe?"],
  },
  {
    question: "Jaký druh číslovky je 'sedmý'?",
    correctAnswer: "řadová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Zkus se zeptat na toto číslo otázkou: kolik? kolikátý? kolikrát? Která otázka sem sedí nejlépe?"],
  },
  {
    question: "Jaký druh číslovky je 'sedmkrát'?",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Zkus se zeptat na toto číslo otázkou: kolik? kolikátý? kolikrát? Která otázka sem sedí nejlépe?"],
  },
  {
    question: "Na jakou otázku odpovídají základní číslovky?",
    correctAnswer: "kolik?",
    options: ["kolikátý?", "kolik?", "kolikery?", "kolikrát?"],
    hints: ["Základní číslovky říkají, jak velký je počet (pět, deset, sto). Jakou otázku bys položil, kdybys chtěl zjistit počet?"],
  },
  {
    question: "Na jakou otázku odpovídají řadové číslovky?",
    correctAnswer: "kolikátý?",
    options: ["kolik?", "kolikátý?", "kolikery?", "kolikrát?"],
    hints: ["Řadové číslovky vyjadřují pořadí (první, druhý, třetí). Jakou otázku bys položil, kdybys chtěl zjistit pořadí?"],
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
    hints: ["Násobné číslovky vyjadřují, kolikrát se děj opakuje (jednou, dvakrát, trojnásobně). Jakou otázkou se na ně ptáme?"],
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
    hints: ["Přípona -násobný říká, kolikrát je něco větší. Zkus se zeptat: kolikrát? Patří to k druhu, který tuto otázku zodpovídá."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ve větě 'Přišla jako první.' jaký druh číslovky je 'první'?",
    correctAnswer: "řadová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Zkus se zeptat: kolikátá přišla? Podle toho, která otázka sedí, poznat druh číslovky."],
  },
  {
    question: "Ve větě 'Koupil dvoje boty.' jaký druh číslovky je 'dvoje'?",
    correctAnswer: "druhová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Boty existují přirozeně v párech. Číslovka vyjadřuje sadu nebo druh — která otázka se na ni ptá?"],
  },
  {
    question: "Ve větě 'Přečetl jsem to dvakrát.' jaký druh číslovky je 'dvakrát'?",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Zeptej se na tuto číslovku: kolikrát přečetl? Podle odpovědi poznat, který druh číslovky vyjadřuje opakování děje."],
  },
  {
    question: "Ve větě 'Máme sto korun.' jaký druh číslovky je 'sto'?",
    correctAnswer: "základní",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Zeptej se: kolik korun máme? Která otázka (kolik? / kolikátý? / kolikrát?) sem sedí?"],
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
    hints: ["Přípona -násobně říká, kolikrát je něco větší nebo více. Zkus se zeptat otázkou, která odpovídá opakování."],
  },
  {
    question: "Ve větě 'Setkal jsem se s ním potřetí.' jaký druh číslovky je 'potřetí'?",
    correctAnswer: "násobná – kolikrát? = potřetí = po třetí",
    options: ["základní", "řadová", "druhová", "násobná – kolikrát? = potřetí = po třetí"],
    hints: ["'Potřetí' znamená 'po třetí'. Zkus se zeptat: kolikrát jsem se s ním setkal? Podle odpovědi urči druh číslovky."],
  },
  {
    question: "Ve větě 'Na třetím místě skončila.' jaký druh číslovky je 'třetím'?",
    correctAnswer: "řadová – kolikáté místo?",
    options: ["základní", "řadová – kolikáté místo?", "druhová", "násobná"],
    hints: ["Zeptej se: na kolikátém místě skončila? Která otázka ti pomůže určit druh číslovky vyjadřující pořadí?"],
  },
  {
    question: "Jaký druh číslovky je 'půldruhého'?",
    correctAnswer: "základní – zlomková číslovka – 1,5",
    options: ["řadová", "druhová", "násobná", "základní – zlomková číslovka – 1,5"],
    hints: ["'Půldruhého' vyjadřuje zlomkový počet. Zeptej se: kolik? — odpovídá na tuto otázku, nebo jinak?"],
  },
  {
    question: "Jaký druh číslovky je 'čtvrtý'?",
    correctAnswer: "řadová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Zkus se zeptat: kolikátý? Pokud otázka sedí, víš, o jaký druh jde."],
  },
  {
    question: "Jaký druh číslovky je 'čtvery' (čtvery housle)?",
    correctAnswer: "druhová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Housle existují jako celý nástroj, ale ve skupině jich může být víc druhů nebo sad. Která otázka se ptá na druh nebo sadu?"],
  },
  {
    question: "Jaký druh číslovky je 'čtyřikrát'?",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Zkus se zeptat: kolikrát? Pokud otázka sedí, jde o druh číslovky vyjadřující opakování."],
  },
  {
    question: "Jaký druh číslovky je 'čtyři'?",
    correctAnswer: "základní",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Zkus se zeptat: kolik? Pokud otázka sedí, jde o druh číslovky vyjadřující samotný počet."],
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
    hints: ["Přípona -rázově říká, kolikrát se děj odehrává. Zkus se zeptat otázkou, která odpovídá opakování."],
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
    hints: ["Obsahuje toto slovo číslo nebo číselný základ? Zkus odpovědět na otázku: lze se 'jednosměrně' zeptat otázkou kolik? kolikátý? kolikrát?"],
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
    hints: ["'Oba/obě' označuje vždy právě dva ze skupiny. Zkus se zeptat: kolik? Odpovídá tato číslovka na tuto otázku?"],
  },
  {
    question: "Ve větě 'Psal jsem to desetkrát.' – určete druh číslovky 'desetkrát'.",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Zeptej se: kolikrát psal? Která otázka (kolik? / kolikátý? / kolikrát?) sem nejlépe pasuje?"],
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
    hints: ["Zamysli se: mění 'první' svůj tvar podobně jako slova jako 'mladý' nebo 'jarní'? Ke kterému slovnímu druhu to přibližuje?"],
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
    hints: ["Zkus skloňovat 'jeden, jednoho, jednomu...' — připomíná to skloňování podstatného jména, přídavného jména, nebo zájmena?"],
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
    hints: ["Zkus skloňovat 'pět, pěti, pěti...' — tvary v nepřímých pádech jsou shodné. Ke vzoru jakého slovního druhu to připomíná?"],
  },
  {
    question: "Ve větě 'Přišel poprvé.' jaký druh číslovky je 'poprvé'?",
    correctAnswer: "násobná – = jednou, po prvé",
    options: ["základní", "řadová", "druhová", "násobná – = jednou, po prvé"],
    hints: ["'Poprvé' říká, kolikátý pokus to byl. Zkus se zeptat: kolikrát? Která otázka sem lépe sedí?"],
  },
  {
    question: "Jaký druh číslovky je 'několikrát'?",
    correctAnswer: "násobná neurčitá",
    options: ["základní neurčitá", "řadová neurčitá", "druhová neurčitá", "násobná neurčitá"],
    hints: ["'Několikrát' neudává přesné číslo. Zkus se zeptat: kolikrát? Podle otázky urči druh — a zamysli se, zda víme přesnou hodnotu."],
  },
  {
    question: "Jaký druh číslovky je 'dvojí' (například dvojí názor)?",
    correctAnswer: "druhová – = dvou druhů/typů",
    options: ["základní", "řadová", "druhová – = dvou druhů/typů", "násobná"],
    hints: ["'Dvojí' říká, že existují dva druhy nebo typy. Která otázka se ptá na druh nebo sadu věcí?"],
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
    hints: ["'Pět' říká počet. 'Třem' je skloňovaný tvar téhož druhu číslovky. Zkus se zeptat na obě: kolik?"],
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
