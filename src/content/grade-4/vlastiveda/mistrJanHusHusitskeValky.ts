import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), drag_order chronologie.
//   L1 = rozpoznání: 3 velké mezníky (Hus kázal → Hus upálen 1415 → konec válek)
//   L2 = aplikace:   4 hlavní události s roky (1415 → 1419 → Žižka → 1434/1436)
//   L3 = transfer:   5 událostí; pozor na miskoncepci — Žižka zemřel 1424, tedy
//                    10 let PŘED bitvou u Lipan (1434), NEvedl ji
// Úlohy nepárují dvě stejnoleté události (Sudoměř 1420 vs Vítkov 1420).
// `items` jsou ve SPRÁVNÉM chronologickém pořadí (UI je zamíchá).
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Seřaď události Husova života od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Hus kázal v Betlémské kapli", "Jan Hus upálen v Kostnici (1415)", "Husitské války v Čechách"],
    hints: ["Nejdřív Hus kázal, teprve pak byl upálen.", "Války vypukly až po Husově smrti."],
    explanation: "Jan Hus kázal česky v Betlémské kapli a kritizoval církev. Roku 1415 byl v Kostnici upálen jako kacíř. Jeho smrt pobouřila Čechy a vedla k husitským válkám.",
  },
  {
    question: "Seřaď husitské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Hus upálen (1415)", "Jan Žižka vede husity", "Bitva u Lipan (1434)"],
    hints: ["Upálení Husa (1415) bylo na začátku.", "Bitva u Lipan (1434) ukončila válečné roky."],
    explanation: "Po upálení Jana Husa (1415) vypukly husitské války. Vojsko vedl Jan Žižka s vozovou hradbou. Války vyvrcholily bitvou u Lipan (1434).",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Hus kritizuje církev", "Jan Hus upálen (1415)", "Basilejská kompaktáta – mír (1436)"],
    hints: ["Kritika církve byla ještě před upálením.", "Kompaktáta (1436) uzavřela dobu válek."],
    explanation: "Jan Hus kritizoval prodej odpustků a bohatství církve. Roku 1415 byl upálen. Po letech válek přinesla mír Basilejská kompaktáta (1436).",
  },
  {
    question: "Seřaď husitské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Hus upálen (1415)", "1. pražská defenestrace (1419)", "Bitva u Lipan (1434)"],
    hints: ["Upálení (1415) přišlo před defenestrací (1419).", "Bitva u Lipan (1434) je nejpozdější."],
    explanation: "Jan Hus byl upálen roku 1415. Roku 1419 vypukly husitské války 1. pražskou defenestrací. Válečné roky ukončila bitva u Lipan (1434).",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Hus kázal v Betlémské kapli", "Jan Hus upálen (1415)", "Jan Žižka a vozová hradba"],
    hints: ["Hus kázal ještě před svou smrtí.", "Žižka vedl husity až po Husově upálení."],
    explanation: "Jan Hus kázal v Betlémské kapli. Po jeho upálení (1415) vypukly války, v nichž husity vedl Jan Žižka se svou vozovou hradbou.",
  },
  {
    question: "Seřaď husitské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Hus upálen (1415)", "Husitské války", "Basilejská kompaktáta (1436)"],
    hints: ["Upálení Husa (1415) rozpoutalo války.", "Kompaktáta (1436) války ukončila."],
    explanation: "Upálení Jana Husa (1415) vyvolalo husitské války. Po letech bojů přinesla mír Basilejská kompaktáta (1436) — dohoda mezi husity a církví.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Hus kázal česky", "1. pražská defenestrace (1419)", "Bitva u Lipan (1434)"],
    hints: ["Kázání bylo dávno před defenestrací.", "Bitva u Lipan (1434) je z těchto tří nejpozdější."],
    explanation: "Jan Hus kázal česky a kritizoval církev. Roku 1419 vypukly války defenestrací. Vyvrcholily bitvou u Lipan (1434), kde se husité utkali mezi sebou.",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: ["Jan Hus upálen (1415)", "Jan Žižka vede vojsko", "Bitva u Lipan (1434)"],
    hints: ["Upálení (1415) bylo na začátku.", "Žižka vedl husity dávno před bitvou u Lipan."],
    explanation: "Po upálení Jana Husa (1415) vedl husitské vojsko Jan Žižka. Války vyvrcholily bitvou u Lipan (1434).",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Hus kritizuje odpustky", "Kostnický koncil odsoudí Husa (1415)", "Husitské války"],
    hints: ["Kritika byla ještě před koncilem.", "Války vypukly až po Husově upálení."],
    explanation: "Jan Hus kritizoval prodej odpustků. Kostnický koncil ho roku 1415 odsoudil a nechal upálit. Jeho smrt vedla k husitským válkám.",
  },
  {
    question: "Seřaď husitské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["1. pražská defenestrace (1419)", "Bitva u Lipan (1434)", "Basilejská kompaktáta (1436)"],
    hints: ["Defenestrace (1419) rozpoutala války.", "Kompaktáta (1436) přišla těsně po bitvě u Lipan (1434)."],
    explanation: "Husitské války začaly defenestrací (1419). Bitva u Lipan (1434) rozhodla vnitřní spor husitů a o dva roky později přinesla mír Basilejská kompaktáta (1436).",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď události husitské doby od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus začíná kázat v Betlémské kapli",
      "Jan Hus upálen na Kostnickém koncilu (1415)",
      "1. pražská defenestrace – vypuknutí husitských válek (1419)",
      "Basilejská kompaktáta – mír mezi husity a církví (1436)",
    ],
    hints: ["Kázání bylo nejdříve, kompaktáta (1436) nejpozději.", "Hus byl upálen roku 1415, defenestrace až roku 1419."],
    explanation: "Jan Hus kázal v Betlémské kapli česky a přiváděl tisíce posluchačů. Po jeho upálení (1415) čekalo Čechy 17 let náboženských válek, které rozpoutala defenestrace (1419) a ukončila Basilejská kompaktáta (1436).",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje prodej odpustků a korupci v církvi",
      "Kostnický koncil – Hus odsouzen jako kacíř (1415)",
      "1. pražská defenestrace – začátek husitských válek (1419)",
      "Bitva u Lipan (1434)",
    ],
    hints: ["Kritika církve byla nejdříve.", "Defenestrace (1419) přišla před bitvou u Lipan (1434)."],
    explanation: "Hus kritizoval prodej odpustků. Kostnický koncil ho roku 1415 odsoudil jako kacíře, přestože měl císařův glejt. Porušení slibu vedlo roku 1419 k husitským válkám, které vyvrcholily u Lipan (1434).",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Bitva u Lipan – táborité poraženi kališníky (1434)",
      "Basilejská kompaktáta – konec válek (1436)",
    ],
    hints: ["Upálení (1415) → defenestrace (1419) → Lipany (1434).", "Kompaktáta (1436) přišla těsně po bitvě u Lipan."],
    explanation: "Upálení Husa (1415) vedlo k defenestraci (1419) a válkám. U Lipan (1434) porazili umírnění kališníci radikální táborité. O dva roky později přinesla mír Basilejská kompaktáta (1436).",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli",
      "Jan Hus upálen v Kostnici (1415)",
      "Jan Žižka vede husitské vojsko – vozová hradba",
      "Bitva u Lipan (1434)",
    ],
    hints: ["Kázání bylo nejdříve, Lipany (1434) nejpozději.", "Žižka vedl husity po upálení Husa, ale před Lipany."],
    explanation: "Jan Žižka byl vojenský génius — vozová hradba umožnila husitům porazit rytířské armády a odrazit papežské výpravy. Bitva u Lipan (1434) byla ale jejich vnitřní souboj.",
  },
  {
    question: "Seřaď husitské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Pět křižáckých výprav proti husitům – všechny odraženy",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Upálení (1415) → defenestrace (1419) → křižácké výpravy → kompaktáta.", "Kompaktáta (1436) jsou nejpozdější."],
    explanation: "Husité po defenestraci (1419) odrazili pět papežských křižáckých výprav — v tehdejší Evropě nevídané. Nakonec ne silou, ale diplomaticky: Basilejská kompaktáta (1436) jim povolila přijímat pod obojím.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje církev",
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Bitva u Lipan (1434)",
    ],
    hints: ["Kritika byla ještě za Husova života.", "Defenestrace (1419) přišla před bitvou u Lipan (1434)."],
    explanation: "Jan Hus kritizoval církev, roku 1415 byl upálen. Roku 1419 vypukly války defenestrací. Vyvrcholily bitvou u Lipan (1434), kde se husité utkali mezi sebou.",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal česky v Betlémské kapli",
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Kázání bylo nejdříve.", "Defenestrace (1419) je před kompaktáty (1436)."],
    explanation: "Jan Hus kázal česky v Betlémské kapli. Po jeho upálení (1415) vypukly roku 1419 husitské války. Mír uzavřela Basilejská kompaktáta (1436).",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Jan Žižka vede husity",
      "Bitva u Lipan (1434)",
    ],
    hints: ["Upálení (1415) → defenestrace (1419).", "Žižka vedl husity mezi defenestrací a Lipany."],
    explanation: "Po upálení Husa (1415) vypukly války defenestrací (1419). Husitské vojsko vedl Jan Žižka. Války vyvrcholily bitvou u Lipan (1434).",
  },
  {
    question: "Seřaď husitské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Kostnický koncil odsoudí Husa (1415)",
      "1. pražská defenestrace (1419)",
      "Bitva u Lipan (1434)",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Koncil (1415) → defenestrace (1419).", "Lipany (1434) přišly těsně před kompaktáty (1436)."],
    explanation: "Kostnický koncil nechal Husa upálit (1415). Roku 1419 vypukly války. U Lipan (1434) se husité utkali mezi sebou a o dva roky později přinesla mír kompaktáta (1436).",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Pět křižáckých výprav odraženo",
      "Bitva u Lipan (1434)",
    ],
    hints: ["Upálení (1415) → defenestrace (1419).", "Křižácké výpravy byly odraženy před bitvou u Lipan (1434)."],
    explanation: "Po upálení Husa (1415) a defenestraci (1419) odrazili husité pět papežských výprav. Nakonec je zlomil vnitřní spor — bitva u Lipan (1434).",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď husitské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Jan Žižka zemřel (1424)",
      "Bitva u Lipan (1434)",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Pozor: Žižka zemřel roku 1424 — deset let PŘED bitvou u Lipan.", "Žižka tedy bitvu u Lipan nevedl."],
    explanation: "Jan Hus upálen (1415), defenestrace (1419). Jan Žižka zemřel už roku 1424 — bitvu u Lipan (1434) tedy nevedl, to je častý omyl. Války ukončila kompaktáta (1436).",
  },
  {
    question: "Seřaď události husitské doby chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli",
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Jan Žižka zemřel (1424)",
      "Bitva u Lipan (1434)",
    ],
    hints: ["Kázání a upálení tvoří začátek.", "Žižka zemřel (1424) dávno před bitvou u Lipan (1434)."],
    explanation: "Jan Hus kázal, roku 1415 byl upálen. Roku 1419 defenestrace rozpoutala války. Jan Žižka zemřel 1424 — deset let před bitvou u Lipan (1434), kterou tedy nevedl.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Bitva na Vítkově – Žižka vítězí (1420)",
      "Jan Žižka zemřel (1424)",
      "Bitva u Lipan (1434)",
    ],
    hints: ["Vítkov (1420) je Žižkovo vítězství krátce po defenestraci.", "Žižka zemřel (1424) dřív, než přišla bitva u Lipan (1434)."],
    explanation: "Po upálení Husa (1415) a defenestraci (1419) zvítězil Žižka na Vítkově (1420). Zemřel roku 1424 — deset let před bitvou u Lipan (1434), kterou už nevedl.",
  },
  {
    question: "Seřaď husitské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Jan Žižka zemřel (1424)",
      "Bitva u Lipan (1434)",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Uprostřed pozor: Žižka zemřel (1424), ne u Lipan.", "Lipany (1434) a kompaktáta (1436) jsou blízko sebe."],
    explanation: "Upálení (1415), defenestrace (1419). Žižka zemřel 1424 — nevedl tedy Lipany (1434). Bitva u Lipan rozhodla vnitřní spor a o dva roky později přišla kompaktáta (1436).",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje církev",
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Bitva u Sudoměře – první vítězství Žižky (1420)",
      "Jan Žižka zemřel (1424)",
    ],
    hints: ["Sudoměř (1420) bylo Žižkovo první velké vítězství.", "Žižka zemřel roku 1424 — sleduj celou řadu."],
    explanation: "Hus kritizoval církev, roku 1415 byl upálen. Roku 1419 defenestrace, roku 1420 Žižkovo vítězství u Sudoměře. Jan Žižka zemřel roku 1424.",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli",
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Bitva u Lipan (1434)",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Kázání a upálení jsou začátek.", "Lipany (1434) přišly těsně před kompaktáty (1436)."],
    explanation: "Jan Hus kázal, roku 1415 byl upálen. Roku 1419 vypukly války defenestrací. U Lipan (1434) se husité utkali mezi sebou a roku 1436 uzavřela mír Basilejská kompaktáta.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Bitva na Vítkově (1420)",
      "Jan Žižka zemřel (1424)",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Vítkov (1420) je hned po defenestraci.", "Žižka zemřel (1424) dávno před koncem válek (1436)."],
    explanation: "Upálení (1415), defenestrace (1419), Žižkovo vítězství na Vítkově (1420). Žižka zemřel 1424. Války ukončila až kompaktáta (1436) — dvanáct let po jeho smrti.",
  },
  {
    question: "Seřaď husitské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal česky",
      "Kostnický koncil odsoudí Husa (1415)",
      "1. pražská defenestrace (1419)",
      "Jan Žižka zemřel (1424)",
      "Bitva u Lipan (1434)",
    ],
    hints: ["Kázání a koncil tvoří začátek.", "Žižka zemřel (1424) deset let před bitvou u Lipan (1434)."],
    explanation: "Jan Hus kázal česky, Kostnický koncil ho roku 1415 odsoudil. Roku 1419 defenestrace. Jan Žižka zemřel 1424 — bitvu u Lipan (1434) tedy nevedl.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Bitva u Sudoměře (1420)",
      "Bitva u Lipan (1434)",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Sudoměř (1420) je krátce po defenestraci (1419).", "Lipany (1434) a kompaktáta (1436) jsou téměř na konci."],
    explanation: "Upálení (1415), defenestrace (1419), vítězství u Sudoměře (1420). Po letech bojů rozhodla bitva u Lipan (1434) a mír uzavřela kompaktáta (1436).",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "Bitva na Vítkově (1420)",
      "Jan Žižka zemřel (1424)",
      "Bitva u Lipan (1434)",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Vítkov (1420) je Žižkovo vítězství, Žižka zemřel 1424.", "Pozor: Žižka zemřel deset let před bitvou u Lipan (1434)."],
    explanation: "Upálení Husa (1415), Žižkovo vítězství na Vítkově (1420), Žižkova smrt (1424). Bitva u Lipan (1434) přišla až deset let po Žižkově smrti a mír uzavřela kompaktáta (1436).",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const MISTRJANHUSHUSITSKEVALKY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-husitstvi-mistr-jan-hus-husitske-valky",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-husitstvi-mistr-jan-hus-husitske-valky",
    title: "Mistr Jan Hus a husitské války",
    studentTitle: "Jan Hus a husité",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš Jana Husa a husity — proč bojovali a jak dopadli.",
    keywords: ["Jan Hus", "Kostnice", "husité", "Jan Žižka", "defenestrace", "Lipany", "kompaktáta"],
    goals: [
      "Znát Jana Husa a důvod jeho upálení",
      "Vědět, kdy vypukly husitské války",
      "Znát Jana Žižku a vozovou hradbu",
      "Vědět, jak husitské války skončily",
    ],
    boundaries: ["Detailní vojenská taktika není cílem", "Teologické spory do hloubky nejsou vyžadovány"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Jan Hus upálen 1415 → defenestrace 1419 → Žižka (zemřel 1424) → bitva u Lipan 1434 → kompaktáta 1436.",
      steps: [
        "Jan Hus kázal česky, upálen v Kostnici 1415",
        "1. pražská defenestrace 1419 = začátek válek",
        "Jan Žižka = vozová hradba, zemřel 1424",
        "Bitva u Lipan 1434, kompaktáta 1436 = konec",
      ],
      commonMistake: "Žáci si myslí, že Žižka vedl bitvu u Lipan — Žižka ale zemřel už roku 1424, deset let předtím.",
      example: "Jan Hus 1415 → defenestrace 1419 → Žižka umírá 1424 → Lipany 1434 → kompaktáta 1436.",
    },
  },
];
