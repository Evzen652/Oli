import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Každý task = seřaď historické události husitské doby ve správném pořadí
const VSECHNY_TASKY: PracticeTask[] = [
  {
    question: "Seřaď události husitské doby od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus začíná kázat v Betlémské kapli",
      "Jan Hus upálen na Kostnickém koncilu (6. 7. 1415)",
      "1. pražská defenestrace – vypuknutí husitských válek (1419)",
      "Basilejská kompaktáta – mír mezi husity a církví (1436)",
    ],
    hints: ["Kázání → upálení 1415 → defenestrace 1419 → kompaktáta 1436."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje prodej odpustků a korupci v církvi",
      "Kostnický koncil – Hus odsouzen jako kacíř",
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace – začátek husitských válek (1419)",
    ],
    hints: ["Kritika → koncil → upálení 1415 → defenestrace 1419."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli v Praze",
      "Jan Hus upálen v Kostnici (1415)",
      "Jan Žižka vede husitské vojsko – vozová hradba",
      "Bitva u Lipan – táborité poraženi kališníky (1434)",
    ],
    hints: ["Betlémská kaple → 1415 → Žižka → Lipany 1434."],
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Pět křižáckých výprav proti husitům – všechny odraženy",
      "Basilejská kompaktáta – konec husitských válek (1436)",
    ],
    hints: ["1415 → 1419 → křižácké výpravy → kompaktáta 1436."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – zlatý věk Čech",
      "Jan Hus kázal v Praze – kritika církve",
      "Jan Hus upálen (1415)",
      "Husitské války (1419–1436)",
    ],
    hints: ["Karel IV. → Hus kázal → upálení 1415 → války."],
  },
  {
    question: "Seřaď husitské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – narozen 1369",
      "Jan Hus začíná kázat v Betlémské kapli",
      "Kostnický koncil – Hus odsouzen a upálen (1415)",
      "Husitské války – 1419 až 1436",
    ],
    hints: ["1369 → kázání → 1415 → 1419–1436."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli česky",
      "Hus dostal od císaře glejt (slib bezpečnosti)",
      "Jan Hus upálen na Kostnickém koncilu",
      "1. pražská defenestrace – husitské války",
    ],
    hints: ["Betlémská kaple → glejt → upálení → defenestrace."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (6. 7. 1415)",
      "1. pražská defenestrace – husité vyhodili radní z okna (1419)",
      "Bitva u Lipan – táborité poraženi (1434)",
      "Basilejská kompaktáta – konec husitských válek (1436)",
    ],
    hints: ["1415 → 1419 → 1434 → 1436."],
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kritizuje odpustky a korupci",
      "Kostnický koncil (1414–1418) – Hus odsouzen",
      "Jan Žižka vede husity – 5 výprav poraženo",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Kritika → Kostnice → Žižka → 1436."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli – tisíce posluchačů",
      "Jan Hus upálen jako kacíř (1415)",
      "Husitské války – táborité a kališníci (1419–1436)",
      "Jiří z Poděbrad – husitský král (1458)",
    ],
    hints: ["Betlémská kaple → 1415 → války → Jiří z Poděbrad."],
  },
  {
    question: "Seřaď mezníky husitské doby od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. zemřel (1378) – začátek hospodářské a náboženské krize",
      "Jan Hus kázal v Praze",
      "Jan Hus upálen (1415)",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Karel IV. 1378 → Hus → 1415 → 1436."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli (přelom 14./15. stol.)",
      "Hus jede do Kostnice s glejtem",
      "Kostnický koncil – Hus odsouzen a upálen (1415)",
      "1. pražská defenestrace (1419)",
    ],
    hints: ["Kázání → glejt → Kostnice 1415 → defenestrace 1419."],
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "Husité odrazili 1. křižáckou výpravu (1420)",
      "Bitva u Lipan – vnitřní boj husitů (1434)",
      "Basilejská kompaktáta – mír (1436)",
    ],
    hints: ["1415 → 1420 → 1434 → 1436."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Kázání Jana Husa v Betlémské kapli",
      "Hus upálen – husitství se radikalizuje",
      "Žižka a husitské vojsko odráží křižáky (1420–1431)",
      "Bitva u Lipan – kališníci poráží táborité (1434)",
    ],
    hints: ["Betlémská kaple → upálení → Žižka → Lipany 1434."],
  },
  {
    question: "Seřaď husitské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje církev",
      "Kostnický koncil – Hus odsouzen a upálen (1415)",
      "1. pražská defenestrace (1419) – husitské války začínají",
      "Basilejská kompaktáta (1436) – konec válek",
    ],
    hints: ["Kritika → 1415 → 1419 → 1436."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kázání v češtině pro prostý lid",
      "Hus upálen (1415) – mučedník",
      "Husitské války – pět papežských výprav poraženo",
      "Kompaktáta 1436 – husité uznáni",
    ],
    hints: ["Kázání → 1415 → války → kompaktáta 1436."],
  },
  {
    question: "Seřaď mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – zlatý věk Čech (zemřel 1378)",
      "Jan Hus kázal v Praze",
      "1. pražská defenestrace – vypuknutí válek (1419)",
      "Basilejská kompaktáta – konec husitských válek (1436)",
    ],
    hints: ["Karel IV. → Hus kázal → 1419 → 1436."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – narozen 1369, kazatel v Praze",
      "Jan Hus upálen v Kostnici (1415)",
      "1. pražská defenestrace (1419)",
      "Bitva u Lipan (1434) – kališníci vs. táborité",
    ],
    hints: ["1369 → 1415 → 1419 → 1434."],
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli",
      "Kostnický koncil – Hus odsouzen",
      "Husitské války (1419–1436) – Jan Žižka velí",
      "Jiří z Poděbrad – husitský král (1458)",
    ],
    hints: ["Betlémská kaple → Kostnice → války → Jiří z Poděbrad."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kritika prodeje odpustků",
      "Jan Hus upálen (6. 7. 1415)",
      "Husité odrazili pět křižáckých výprav",
      "Basilejská kompaktáta – mír a uznání husitů (1436)",
    ],
    hints: ["Kritika → 1415 → pět výprav → kompaktáta 1436."],
  },
  {
    question: "Seřaď husitské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kázal česky v Betlémské kapli",
      "Hus upálen – stává se mučedníkem (1415)",
      "1. pražská defenestrace – husité vyhodili radní (1419)",
      "Bitva u Lipan – rozkol husitů (1434)",
    ],
    hints: ["Kázání → 1415 → 1419 → Lipany 1434."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje církev a korupci",
      "Hus odsouzen na Kostnickém koncilu",
      "Žižkova vozová hradba odráží rytíře",
      "Basilejská kompaktáta – konec husitských válek",
    ],
    hints: ["Kritika → Kostnice → Žižka → kompaktáta."],
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Hus upálen (1415) – mučednictví",
      "1. pražská defenestrace – start husitských válek (1419)",
      "Žižka vede husity k vítězstvím",
      "Basilejská kompaktáta – mír (1436)",
    ],
    hints: ["1415 → 1419 → Žižka → kompaktáta 1436."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kázal v Betlémské kapli (kolem 1402)",
      "Jan Hus upálen (1415)",
      "Husitské války začínají (1419)",
      "Basilejská kompaktáta – konec válek (1436)",
    ],
    hints: ["1402 → 1415 → 1419 → 1436."],
  },
  {
    question: "Seřaď mezníky husitství od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal česky pro prostý lid",
      "Kostnický koncil – Hus odsouzen jako kacíř (1415)",
      "Husitské války – táborité a kališníci bojují za reformu",
      "Jiří z Poděbrad – husitský král Čech (1458)",
    ],
    hints: ["Kázání → 1415 → války → Jiří z Poděbrad."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Václav IV. – slabý nástupce Karla IV. (vládl od 1378)",
      "Jan Hus kázal v Praze – náboženská krize",
      "Husitské války (1419–1436)",
      "Basilejská kompaktáta – husité uznáni (1436)",
    ],
    hints: ["Václav IV. → Hus → války 1419–1436 → kompaktáta."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kázal v češtině, ne latině",
      "Jan Hus upálen (6. 7. 1415)",
      "1. pražská defenestrace (1419)",
      "Bitva u Lipan (1434) – kališníci vítězí nad táborité",
    ],
    hints: ["Kázání → 1415 → 1419 → Lipany 1434."],
  },
  {
    question: "Seřaď husitské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje korupci v církvi",
      "Jan Hus upálen na Kostnickém koncilu (1415)",
      "Husité odrazili pět křižáckých výprav (1420–1431)",
      "Basilejská kompaktáta – konec husitských válek (1436)",
    ],
    hints: ["Kritika → 1415 → pět výprav → kompaktáta 1436."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – zlatý věk Čech (zemřel 1378)",
      "Václav IV. – náboženská krize",
      "Jan Hus upálen (1415)",
      "Basilejská kompaktáta (1436) – konec husitských válek",
    ],
    hints: ["Karel IV. 1378 → Václav IV. → 1415 → kompaktáta 1436."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli",
      "Hus upálen – kalich jako symbol husitů",
      "Žižka velí husitskému vojsku – odráží křižáky",
      "Kompaktáta 1436 – husité uznáni církví",
    ],
    hints: ["Betlémská kaple → upálení → Žižka → kompaktáta 1436."],
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kázal česky v Praze",
      "Hus upálen jako kacíř (1415)",
      "1. pražská defenestrace – start válek (1419)",
      "Bitva u Lipan – rozkol husitů (1434)",
    ],
    hints: ["Kázání → 1415 → 1419 → Lipany 1434."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Hus kázal v Betlémské kapli – tisíce posluchačů",
      "Jan Hus upálen (1415) – stává se mučedníkem",
      "Husitské války – Jan Žižka a pět vítězných výprav",
      "Basilejská kompaktáta – husité uznáni (1436)",
    ],
    hints: ["Betlémská kaple → 1415 → války → kompaktáta 1436."],
  },
  {
    question: "Seřaď mezníky husitské doby od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – narozen 1369, kazatel",
      "Kostnický koncil – Hus odsouzen a upálen",
      "Husitské války (1419–1436)",
      "Jiří z Poděbrad – husitský král (1458)",
    ],
    hints: ["1369 → Kostnice → 1419–1436 → Jiří z Poděbrad."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje korupci v církvi",
      "Hus upálen (1415) – zápalná jiskra husitství",
      "1. pražská defenestrace (1419) – start husitských válek",
      "Kompaktáta 1436 – konec válek, husité uznáni",
    ],
    hints: ["Kritika → 1415 → 1419 → kompaktáta 1436."],
  },
  {
    question: "Seřaď husitské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Karel IV. zemřel – náboženské a hospodářské nepokoje (1378)",
      "Jan Hus kázal v Betlémské kapli",
      "Jan Hus upálen (1415)",
      "Basilejská kompaktáta – mír (1436)",
    ],
    hints: ["1378 → kázání → 1415 → kompaktáta 1436."],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(VSECHNY_TASKY).slice(0, 35);
}

export const MISTRJANHUSHUSITSKEVALKY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-husitstvi-mistr-jan-hus-husitske-valky",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-husitstvi-mistr-jan-hus-husitske-valky",
    title: "Mistr Jan Hus, husitské války",
    studentTitle: "Jan Hus",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš kazatele Jana Husa, proč byl upálen a jak vznikly husitské války.",
    keywords: ["Jan Hus", "husitství", "Žižka", "Betlémská kaple", "kalich", "odpustky", "1415"],
    goals: [
      "Popsat Jana Husa a jeho přínos",
      "Vysvětlit příčiny husitských válek",
      "Znát rok 1415 a Kostnický koncil",
      "Popsat husitský symbol — kalich",
    ],
    boundaries: ["Detailní vojenská strategie není cílem", "Basilejský koncil do hloubky není vyžadován"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Jan Hus 1369–1415 = kazatel, Betlémská kaple, kritik odpustků. Upálen 6. 7. 1415 v Kostnici. Husitské války 1419–1436.",
      steps: [
        "Hus = kazatel, ne panovník",
        "1415 = upálen v Kostnici → husitské války",
        "Žižka = vojevůdce, vozová hradba",
        "Kalich = symbol přijímání pod obojím",
        "1436 = kompaktáta, konec válek",
      ],
      commonMistake: "Žáci si pletou Jana Husa a Jana Žižku — Hus byl kazatel, Žižka vojevůdce.",
      example: "Jan Hus: kazatel v Betlémské kapli → 1415 upálen v Kostnici → 1419 husitské války → 1434 Lipany → 1436 kompaktáta.",
    },
  },
];
