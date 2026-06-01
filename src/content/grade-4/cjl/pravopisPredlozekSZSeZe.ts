import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: jednoduche vety
const POOL_L1: { sentence: string; blank: string }[] = [
  { sentence: "Odešel ___ školy.", blank: "ze" },
  { sentence: "Přišel ___ kamarádem.", blank: "s" },
  { sentence: "Vyšel ___ lesa.", blank: "z" },
  { sentence: "Sjel ___ kopce.", blank: "z" },
  { sentence: "Šel ___ bratrem.", blank: "s" },
  { sentence: "Vzal knihu ___ skříně.", blank: "ze" },
  { sentence: "Přišel ___ sestrou.", blank: "s" },
  { sentence: "Vyběhl ___ domu.", blank: "z" },
  { sentence: "Sedí ___ psem.", blank: "se" },
  { sentence: "Vylezl ___ stromu.", blank: "ze" },
  { sentence: "Jde ___ tátou.", blank: "s" },
  { sentence: "Vypadl ___ kapsy.", blank: "z" },
  { sentence: "Šla ___ mámou.", blank: "s" },
  { sentence: "Vyndal peněženku ___ tašky.", blank: "z" },
  { sentence: "Hraje ___ přáteli.", blank: "s" },
  { sentence: "Vypadlo ___ stolu.", blank: "ze" },
  { sentence: "Jede ___ dědou.", blank: "s" },
  { sentence: "Vylezl ___ díry.", blank: "z" },
];

// Level 2: delsi vety
const POOL_L2: { sentence: string; blank: string }[] = [
  { sentence: "Vrátil se ___ hory velmi unavený.", blank: "z" },
  { sentence: "Šel do obchodu ___ maminou.", blank: "s" },
  { sentence: "Voda vytekla ___ vědra na zem.", blank: "ze" },
  { sentence: "Pracoval ___ soustředěním celý den.", blank: "s" },
  { sentence: "Vyskočil ___ auta a utíkal.", blank: "z" },
  { sentence: "Cestoval ___ celou rodinou.", blank: "s" },
  { sentence: "Vylezl ___ sklepa plný prachu.", blank: "ze" },
  { sentence: "Přišel domů ___ zpěvem.", blank: "se" },
  { sentence: "Vylovil rybu ___ rybníka.", blank: "z" },
  { sentence: "Hrál fotbal ___ spolužáky.", blank: "se" },
  { sentence: "Vypadl ___ okna hračkový míč.", blank: "z" },
  { sentence: "Přivítal hosty ___ srdečným úsměvem.", blank: "se" },
  { sentence: "Přinesl košík ___ zahrady.", blank: "ze" },
  { sentence: "Psal úkol ___ velkou pečlivostí.", blank: "s" },
  { sentence: "Odskočil ___ cesty, aby ho auto nesrazilo.", blank: "ze" },
  { sentence: "Nakupoval ___ starší sestrou.", blank: "se" },
];

// Level 3: souvetí
const POOL_L3: { sentence: string; blank: string }[] = [
  { sentence: "Když přišel ___ školy, rovnou si sedl k úkolům.", blank: "ze" },
  { sentence: "Jel ___ celou třídou na výlet, který byl skvělý.", blank: "s" },
  { sentence: "Vylezl ___ podkroví a přinesl staré fotografie.", blank: "z" },
  { sentence: "Pomáhal ___ nadšením, takže práce šla rychle.", blank: "se" },
  { sentence: "Vzal si kabát ___ věšáku a vyběhl ven.", blank: "ze" },
  { sentence: "Hrají ___ sousedy, protože venku je krásně.", blank: "se" },
  { sentence: "Vytáhl zápisník ___ batohu a začal psát.", blank: "z" },
  { sentence: "Diskutoval ___ učitelkou o přečtené knize.", blank: "s" },
  { sentence: "Přijel ___ Prahy a hned šel spát.", blank: "z" },
  { sentence: "Pracuje ___ zápalem, který ostatní obdivují.", blank: "se" },
  { sentence: "Snesl krabici ___ police, ale skoro ji upustil.", blank: "ze" },
  { sentence: "Vrátil se domů ___ starším bratrem po setmění.", blank: "se" },
  { sentence: "Vzal čaj ___ šálku a pomalu ho pil.", blank: "ze" },
  { sentence: "Jela autobusem ___ babičkou na druhý konec města.", blank: "s" },
  { sentence: "Vykoukl ___ okna a zamával kamarádům.", blank: "z" },
  { sentence: "Přemýšlel ___ velkou pozorností nad každou větou.", blank: "s" },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ sentence, blank }) => ({
    question: `Doplň správnou předložku: "${sentence}"`,
    correctAnswer: blank,
    options: ["s", "z", "se", "ze"],
    blanks: [blank],
    hints: [
      "s/se = pohyb z povrchu nebo dohromady s někým",
      "z/ze = pohyb z vnitřku (ze školy = z vnitřku budovy)",
    ],
    solutionSteps: [
      "Ptám se: odkud přišel? → z vnitřku → z/ze",
      "Ptám se: s kým? nebo odkud z povrchu? → s/se",
    ],
  }));
}

export const PRAVOPISPREDLOZEKSZSEZE: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predlozek-s-z-se-ze",
    rvpNodeId: "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predlozek-s-z-se-ze",
    title: "Pravopis předložek (s, z, se, ze)",
    studentTitle: "Předložky s/z",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Pochopíš, kdy psát s/se a kdy z/ze podle směru pohybu.",
    keywords: ["předložka", "s", "z", "se", "ze", "pravopis", "předložky"],
    goals: [
      "Rozlišit předložky s/se (z povrchu, dohromady) a z/ze (z vnitřku)",
      "Správně doplnit předložku ve větě",
    ],
    boundaries: ["Nezabývat se předponami s-/z-", "Bez předložkových pádů"],
    gradeRange: [4, 4],
    inputType: "fill_blank",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "z/ze = pohyb z vnitřku (ze školy, z lesa); s/se = pohyb z povrchu nebo dohromady (s kamarádem, sjel ze střechy)",
      steps: [
        "Zkus dosadit: 'z vnitřku' nebo 'dohromady s někým'?",
        "Z vnitřku → z/ze",
        "Dohromady nebo z povrchu → s/se",
      ],
      commonMistake: "Záměna 'ze školy' (z vnitřku) a 'se střechy' (z povrchu)",
      example: "Vyšel ze školy. (z vnitřku) × Sjel se střechy. (z povrchu)",
    },
  },
];
