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
    question: "Jaký je podmět ve větě 'Petr čte knihu.'?",
    correctAnswer: "Petr",
    options: ["Petr", "čte", "knihu", "není tam podmět"],
    hints: ["Podmět odpovídá na otázku KDO? nebo CO? dělá to, co říká přísudek."],
  },
  {
    question: "Jaký je podmět ve větě 'Pes štěká.'?",
    correctAnswer: "pes",
    options: ["pes", "štěká", "věta nemá podmět", "hlasitě"],
    hints: ["Zeptej se: Kdo štěká?"],
  },
  {
    question: "Jaký je podmět ve větě 'Čtu.'?",
    correctAnswer: "já – nevyjádřený podmět",
    options: ["já – nevyjádřený podmět", "ty", "čtu", "věta nemá podmět"],
    hints: ["Z koncovky slovesa 'čtu' poznáš osobu. Kdo čte?"],
  },
  {
    question: "Ve větě 'Pojďme do kina.' jaký je podmět?",
    correctAnswer: "my – nevyjádřený",
    options: ["my – nevyjádřený", "pojďme", "kino", "žádný"],
    hints: ["Koho zahrnuje výzva 'pojďme'? Odvoď z tvaru slovesa."],
  },
  {
    question: "Ve větě 'Petr a Jana přišli.' je podmět:",
    correctAnswer: "několikanásobný: Petr a Jana",
    options: ["jen Petr", "jen Jana", "přišli", "několikanásobný: Petr a Jana"],
    hints: ["Kolik osob ve větě dělá to, co říká sloveso?"],
  },
  {
    question: "Podmět vyjádřený je:",
    correctAnswer: "přímo napsaný nebo řečený ve větě",
    options: [
      "skrytý v koncovce slovesa",
      "přímo napsaný nebo řečený ve větě",
      "vždy zájmeno",
      "vždy přídavné jméno",
    ],
    hints: ["Co znamená slovo 'vyjádřit'? Je takový podmět ve větě vidět?"],
  },
  {
    question: "Ve větě 'Hrajete si venku.' jaký je podmět?",
    correctAnswer: "vy – nevyjádřený",
    options: ["vy – nevyjádřený", "hrajete", "venku", "si"],
    hints: ["Z koncovky 'hrajete' poznáš osobu. Kdo si hraje?"],
  },
  {
    question: "Ve větě 'Slunce svítí.' jaký je podmět?",
    correctAnswer: "slunce",
    options: ["slunce", "svítí", "žádný", "světlo"],
    hints: ["Zeptej se: Co svítí?"],
  },
  {
    question: "Ve větě 'Zpívám a tancuji.' jaký je podmět?",
    correctAnswer: "já – nevyjádřený – jeden podmět pro obě slovesa",
    options: ["já a ty", "zpívám", "já – nevyjádřený – jeden podmět pro obě slovesa", "tancuji"],
    hints: ["Kdo zpívá a kdo tancuje? Je to stejná osoba?"],
  },
  {
    question: "Ve větě 'Babička a děda sedí na lavičce.' je podmět:",
    correctAnswer: "babička a děda – několikanásobný",
    options: ["jen babička", "jen děda", "babička a děda – několikanásobný", "lavička"],
    hints: ["Kolik osob sedí na lavičce?"],
  },
  {
    question: "Jak poznáš nevyjádřený podmět?",
    correctAnswer: "z tvaru slovesa – koncovky poznáš, kdo je podmět",
    options: [
      "nelze ho vůbec poznat",
      "z tvaru slovesa – koncovky poznáš, kdo je podmět",
      "vždy je to 'já'",
      "věta bez napsaného podmětu podmět nemá",
    ],
    hints: ["Zkus měnit koncovku: čtu/čteš/čte. Co ti prozradí o tom, kdo jedná?"],
  },
  {
    question: "Ve větě 'Ptáci odletěli na jih.' je podmět:",
    correctAnswer: "ptáci",
    options: ["ptáci", "odletěli", "jih", "věta podmět nemá"],
    hints: ["Zeptej se: Kdo odletěl na jih?"],
  },
  {
    question: "Ve větě 'Mlčte!' jaký je podmět?",
    correctAnswer: "vy – nevyjádřený – rozkazovací způsob",
    options: ["já", "vy – nevyjádřený – rozkazovací způsob", "mlčte", "věta nemá podmět"],
    hints: ["Komu je příkaz 'Mlčte!' určen?"],
  },
  {
    question: "Ve větě 'Lucie, Tomáš a Ondřej skočili do vody.' je podmět:",
    correctAnswer: "Lucie, Tomáš a Ondřej – několikanásobný",
    options: ["jen Lucie", "Lucie a Tomáš", "Lucie, Tomáš a Ondřej – několikanásobný", "voda"],
    hints: ["Kolik jmen dělá to, co říká sloveso?"],
  },
  {
    question: "Podmět ve větě odpovídá na otázku:",
    correctAnswer: "Kdo? nebo Co?",
    options: ["Koho? Čeho?", "Kdo? nebo Co?", "Kdy? Kde?", "Jak? Proč?"],
    hints: ["Podmět je v 1. pádu. Jakou otázkou se na 1. pád ptáš?"],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ve větě 'Prší.' jaký je podmět?",
    correctAnswer: "věta podmět nemá – bezpodmětová věta",
    options: ["déšť", "počasí", "věta podmět nemá – bezpodmětová věta", "ono"],
    hints: ["Zkus se zeptat: kdo nebo co prší? Jde to vůbec?"],
  },
  {
    question: "Ve větě 'Sněží a fouká.' jaký je podmět?",
    correctAnswer: "věta podmět nemá – bezpodmětová",
    options: ["vítr a sníh", "věta podmět nemá – bezpodmětová", "ono", "počasí"],
    hints: ["Dá se říct, kdo sněží a kdo fouká?"],
  },
  {
    question: "Jak se liší vyjádřený a nevyjádřený podmět?",
    correctAnswer: "vyjádřený je přímo ve větě, nevyjádřený je skryt v tvaru slovesa",
    options: [
      "vyjádřený je vždy na začátku věty",
      "nevyjádřený vůbec neexistuje",
      "vyjádřený je přímo ve větě, nevyjádřený je skryt v tvaru slovesa",
      "nevyjádřený se týká jen rozkazovacích vět",
    ],
    hints: ["U kterého z nich vidíš podmět přímo a u kterého ne?"],
  },
  {
    question: "Ve větě 'Přijdu a pomůžu.' jaký je podmět?",
    correctAnswer: "já – nevyjádřený – pro obě slovesa",
    options: ["já a ty", "já – nevyjádřený – pro obě slovesa", "přijdu", "pomůžu"],
    hints: ["Urči osobu sloves 'přijdu' a 'pomůžu'. Je stejná?"],
  },
  {
    question: "Ve větě 'Knihy a filmy jsou moje záliby.' jaký je podmět?",
    correctAnswer: "knihy a filmy – několikanásobný podmět",
    options: ["jen knihy", "jen filmy", "záliby", "knihy a filmy – několikanásobný podmět"],
    hints: ["Kolik věcí ve větě je tím, o čem se mluví?"],
  },
  {
    question: "Podmět a přísudek se shodují v:",
    correctAnswer: "osobě a čísle – u sloves , u příčestí i v rodě",
    options: [
      "délce slov",
      "osobě a čísle – u sloves , u příčestí i v rodě",
      "pořadí ve větě",
      "jen v čísle",
    ],
    hints: ["Já jdu, ty jdeš, on jde – podmět a přísudek se shodují."],
  },
  {
    question: "Ve větě 'Loni jsme jeli na výlet.' jaký je podmět?",
    correctAnswer: "my – nevyjádřený",
    options: ["já", "vy", "my – nevyjádřený", "loni"],
    hints: ["Urči osobu a číslo slovesa 'jsme jeli'. Kdo to je?"],
  },
  {
    question: "Ve větě 'Chtěla bych více spát.' jaký je podmět?",
    correctAnswer: "já – nevyjádřený – ženský rod",
    options: ["ona", "ty", "já – nevyjádřený – ženský rod", "chtěla"],
    hints: ["Z tvaru 'chtěla bych' poznáš osobu i rod. Kdo mluví?"],
  },
  {
    question: "Ve větě 'Maminka a tatínek přišli.' – proč je přísudek 'přišli' (ne 'přišly')?",
    correctAnswer: "podmět obsahuje mužský životný rod – tatínek , proto mužský rod přísudku",
    options: [
      "protože 'maminka' je hlavní podmět",
      "podmět obsahuje mužský životný rod – tatínek , proto mužský rod přísudku",
      "protože jsou dva podmět",
      "tatínek rozhoduje vždy",
    ],
    hints: ["Pravidlo: je-li mezi podměty alespoň jeden mužský životný, je přísudek v mužském rodě. Který z nich to je?"],
  },
  {
    question: "Ve větě 'Ryby a ptáci jsou obratlovci.' je přísudek 'jsou'. Proč?",
    correctAnswer: "podmět v množném čísle – ryby i ptáci = přísudek v množném čísle",
    options: [
      "protože obratlovci je množné číslo",
      "podmět v množném čísle – ryby i ptáci = přísudek v množném čísle",
      "protože jsou je vždy správně",
      "záleží na pořadí podmětů",
    ],
    hints: ["Kolik podmětů je ve větě? Jak to ovlivní číslo přísudku?"],
  },
  {
    question: "Ve větě 'Ráno se probudil a šel do školy.' je podmět:",
    correctAnswer: "on – nevyjádřený – mužský rod",
    options: ["ráno", "on – nevyjádřený – mužský rod", "já", "škola"],
    hints: ["Z tvaru 'probudil a šel' poznáš rod a osobu. Kdo to byl?"],
  },
  {
    question: "Co je bezpodmětová věta?",
    correctAnswer: "věta, která nemá žádný podmět ani vyjádřený ani nevyjádřený",
    options: [
      "věta s nevyjádřeným podmětem",
      "věta, která nemá žádný podmět ani vyjádřený ani nevyjádřený",
      "věta bez přísudku",
      "příkazová věta",
    ],
    hints: ["Prší, sněží, svítá – nikdo konkrétní to nedělá."],
  },
  {
    question: "Ve větě 'Čtu a píšu zároveň.' kolik podmětů je?",
    correctAnswer: "jeden: já – nevyjádřený – pro obě slovesa",
    options: ["žádný", "dva: čtu a píšu", "jeden: já – nevyjádřený – pro obě slovesa", "tři různé podmět"],
    hints: ["Urči osobu obou sloves. Patří jednomu, nebo dvěma lidem?"],
  },
  {
    question: "Ve větě 'Lenka, Pavel a Mirka zpívali.' je přísudek 'zpívali'. Proč?",
    correctAnswer: "Pavel je mužský životný rod → přísudek v mužském rodě",
    options: [
      "protože jsou tři podmety",
      "Pavel je mužský životný rod → přísudek v mužském rodě",
      "protože Lenka je první",
      "zpívali je vždy správný tvar",
    ],
    hints: ["Přítomnost mužského životného podmětu v skupině = mužský rod přísudku."],
  },
  {
    question: "Ve větě 'Učte se pilně!' jaký je podmět?",
    correctAnswer: "vy – nevyjádřený – rozkazovací způsob, množné číslo",
    options: ["já", "vy – nevyjádřený – rozkazovací způsob, množné číslo", "on", "věta podmět nemá vůbec"],
    hints: ["Komu je výzva 'Učte se!' určena?"],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Ve větě 'Ona i její sestra přišly pozdě.' jaký je podmět a jaký je rod přísudku?",
    correctAnswer: "podmět: ona a sestra (oba ženský rod) → přísudek: přišly – ženský rod",
    options: [
      "podmět: sestra → přišly",
      "podmět: ona a sestra (oba ženský rod) → přísudek: přišly – ženský rod",
      "podmět: ona → přišla",
      "podmět: oba → přišli",
    ],
    hints: ["Jakého rodu jsou 'ona' a 'sestra'? Co z toho plyne pro přísudek?"],
  },
  {
    question: "Ve větě 'Kdo to udělal?' jaký je podmět?",
    correctAnswer: "kdo – tázací zájmeno jako podmět",
    options: ["to", "udělal", "kdo – tázací zájmeno jako podmět", "věta nemá podmět"],
    hints: ["Které slovo je v 1. pádu a ptá se po původci děje?"],
  },
  {
    question: "Ve větě 'Nikdo nepřišel.' jaký je podmět?",
    correctAnswer: "nikdo – záporné zájmeno jako podmět",
    options: ["věta podmět nemá", "nikdo – záporné zájmeno jako podmět", "nevyjádřený já", "přišel"],
    hints: ["Kdo nepřišel? Které slovo to vyjadřuje?"],
  },
  {
    question: "Ve větě 'Zpívat je zdravé.' jaký je podmět?",
    correctAnswer: "zpívat – infinitiv jako podmět",
    options: ["zdravé", "je", "zpívat – infinitiv jako podmět", "věta nemá podmět"],
    hints: ["Co je zdravé? Které slovo to říká?"],
  },
  {
    question: "Ve větě 'Kočky, pes a křeček utekli.' proč je přísudek 'utekli'?",
    correctAnswer: "pes je mužský životný rod → pravidlo mužského životného v množině podmětů",
    options: [
      "protože je nejvíce zvířat",
      "pes je mužský životný rod → pravidlo mužského životného v množině podmětů",
      "utekli je jediný správný tvar",
      "protože křeček je první",
    ],
    hints: ["Přítomnost i jednoho mužského živého podmětu určuje rod přísudku."],
  },
  {
    question: "Ve větě 'Bylo veselo.' jaký je podmět?",
    correctAnswer: "věta podmět nemá – bezpodmětová věta popisující stav",
    options: ["ono – nevyjádřený", "veselo", "věta podmět nemá – bezpodmětová věta popisující stav", "bylo"],
    hints: ["Dá se říct, kdo nebo co je veselo?"],
  },
  {
    question: "Ve větě 'Hoši a dívky zpívaly sborově.' je přísudek 'zpívaly' správně?",
    correctAnswer: "ne – správně je 'zpívali', protože hoši jsou mužský životný rod",
    options: [
      "ano – protože jsou tam i dívky",
      "ne – správně je 'zpívali', protože hoši jsou mužský životný rod",
      "ano – záleží na pořadí slov",
      "oba tvary jsou přijatelné",
    ],
    hints: ["Jsou ve skupině 'hoši'? Jakého jsou rodu a co to udělá s přísudkem?"],
  },
  {
    question: "Může být podmětem celá vedlejší věta?",
    correctAnswer: "ano – např. 'Kdo chce, může jít.' – podmět je 'kdo chce'",
    options: [
      "ne – podmět je vždy jen jedno slovo",
      "ano – např. 'Kdo chce, může jít.' – podmět je 'kdo chce'",
      "jen v básních",
      "jen v rozkazovacích větách",
    ],
    hints: ["Najdi podmět ve větě 'Kdo chce, může jít.' Je to jen jedno slovo?"],
  },
  {
    question: "Ve větě 'Tři chlapci přišli.' slovo 'tři' je:",
    correctAnswer: "číslovka jako součást podmětu – podmět = tři chlapci",
    options: ["přísudek", "podmět samotný", "číslovka jako součást podmětu – podmět = tři chlapci", "příslovečné určení"],
    hints: ["Patří 'tři' k podmětu 'chlapci', nebo je to něco jiného?"],
  },
  {
    question: "Co musíš vždy zkontrolovat po nalezení podmětu?",
    correctAnswer: "shodu přísudku s podmětem v osobě, čísle a u příčestí i rodě",
    options: [
      "délku slova",
      "shodu přísudku s podmětem v osobě, čísle a u příčestí i rodě",
      "pořadí podmetu ve větě",
      "interpunkci za podmětem",
    ],
    hints: ["Když máš podmět, co dalšího musíš ověřit u přísudku?"],
  },
  {
    question: "Ve větě 'Co máš nového?' jaký je podmět?",
    correctAnswer: "ty – nevyjádřený – 2. osoba",
    options: ["co", "nového", "ty – nevyjádřený – 2. osoba", "věta podmět nemá"],
    hints: ["Z tvaru 'máš' poznáš osobu. Komu je otázka určena?"],
  },
  {
    question: "Ve větě 'Říká se, že...' slovo 'se' je:",
    correctAnswer: "zvratné zájmeno, věta je bezpodmětová / neosobní",
    options: ["podmět", "zvratné zájmeno, věta je bezpodmětová / neosobní", "přísudek", "příslovečné určení"],
    hints: ["Vyjadřuje 'se' nějakého konkrétního původce děje?"],
  },
  {
    question: "Ve větě 'Maminka a tatínek hráli karty.' je přísudek 'hráli'. Jsou oba podměty životné?",
    correctAnswer: "ano – maminka (ženský životný) a tatínek (mužský životný) → hráli – mužský rod z důvodu tatínka",
    options: [
      "ne – maminka je neživotná",
      "ano – maminka (ženský životný) a tatínek (mužský životný) → hráli – mužský rod z důvodu tatínka",
      "oba jsou neživotní",
      "záleží jen na tatínkovi",
    ],
    hints: ["Jsou maminka i tatínek životní? Který určí rod přísudku?"],
  },
  {
    question: "Jak se nazývá věta, kde podmět není vyjádřen ani v koncovce (jako 'prší')?",
    correctAnswer: "bezpodmětová věta",
    options: ["věta s nevyjádřeným podmětem", "bezpodmětová věta", "holá věta", "tázací věta"],
    hints: ["Předpona 'bez-' ti napoví. Věta bez čeho?"],
  },
  {
    question: "Ve větě 'Zima se blíží.' jaký je podmět?",
    correctAnswer: "zima",
    options: ["zima", "se", "blíží", "věta podmět nemá"],
    hints: ["Zeptej se: Co se blíží? Pozor, 'se' není podmět."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const PODMETVYJADRENYNEVYJADRENYNEKOLIKANASOBNY: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-skladba-podmet-vyjadreny-nevyjadreny-nekolikanasobny",
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-podmet-vyjadreny-nevyjadreny-nekolikanasobny",
    title: "Podmět vyjádřený, nevyjádřený, několikanásobný",
    studentTitle: "Podmět věty",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Najdeš podmět věty, i když není napsaný.",
    keywords: ["podmět", "vyjádřený podmět", "nevyjádřený podmět", "několikanásobný podmět", "skladba"],
    goals: [
      "Najít podmět ve větě",
      "Rozlišit vyjádřený, nevyjádřený a několikanásobný podmět",
      "Určit rod nevyjádřeného podmětu z tvaru slovesa",
    ],
    boundaries: [
      "Neprobíráme složité větné vzorce",
      "Bez pokročilé syntaktické analýzy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Najdi přísudek (sloveso) a zeptej se: KDO nebo CO to dělá? Odpověď je podmět. Pokud není napsáno, zkus si ho odvodit z koncovky slovesa.",
      steps: [
        "Najdi sloveso (přísudek) ve větě.",
        "Zeptej se: KDO nebo CO dělá to, co říká sloveso?",
        "Pokud odpověď není ve větě = nevyjádřený podmět (odvoď ho z koncovky).",
        "Pokud jsou odpovědi dvě nebo více = několikanásobný podmět.",
      ],
      commonMistake: "Žáci označí za podmět příslovečné určení nebo předmět. Podmět je vždy v 1. pádu (kdo? co?).",
      example: "'Čtu.' – podmět 'já' (nevyjádřený). 'Pavel a Lucie přišli.' – podmět 'Pavel a Lucie' (několikanásobný).",
    },
  },
];
