import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Každý task = seřaď historické pravěké události ve správném pořadí
const VSECHNY_TASKY: PracticeTask[] = [
  {
    question: "Seřaď pravěké epochy od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná (paleolit) – lovci a sběrači",
      "Mladší doba kamenná (neolit) – zemědělci",
      "Doba bronzová – bronzové nástroje",
      "Doba železná – Keltové v Čechách",
    ],
    hints: ["Paleolit → neolit → bronz → železo."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lidé loví zvěř a sbírají plody",
      "Neolit – lidé začínají pěstovat obilí a chovat zvířata",
      "Doba bronzová – slitina mědi a cínu",
      "Keltové (Boiové) v Čechách – Bohemia",
    ],
    hints: ["Paleolit → neolit → bronz → Keltové."],
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – Věstonická venuše (29 000 let)",
      "Mladší doba kamenná – zemědělství a keramika",
      "Doba bronzová – únětická kultura",
      "Doba železná – Keltové, oppida",
    ],
    hints: ["Věstonická venuše → zemědělství → bronz → Keltové."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – neandrtálci a kromaňonci",
      "Neolit – zemědělská revoluce",
      "Keltové v Čechách – doba železná",
      "Slované přicházejí do Čech (6. stol. n. l.)",
    ],
    hints: ["Paleolit → neolit → Keltové → Slované."],
  },
  {
    question: "Seřaď pravěké a starověké epochy od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná (paleolit)",
      "Mladší doba kamenná (neolit) – zemědělci",
      "Doba bronzová",
      "Doba železná – Keltové",
    ],
    hints: ["Paleolit → neolit → bronz → železo."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Věstonická venuše – starší doba kamenná (29 000 let)",
      "Zemědělská revoluce – neolit",
      "Únětická kultura – doba bronzová",
      "Keltové (Boiové) – Bohemia",
    ],
    hints: ["29 000 let → neolit → únětická kultura → Keltové."],
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Paleolit – lidé žijí v jeskyních, loví",
      "Neolit – lidé stavějí vesnice a pěstují obilí",
      "Doba bronzová – kovové nástroje z bronzu",
      "Keltové – doba železná, oppida",
    ],
    hints: ["Jeskyně → vesnice → bronz → Keltové."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – nejstarší doba kamenná",
      "Neolit – zemědělci a pastevci",
      "Doba bronzová – únětická kultura",
      "Slované přicházejí (6. stol. n. l.)",
    ],
    hints: ["Paleolit → neolit → bronz → Slované."],
  },
  {
    question: "Seřaď pravěké mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Neandrtálci a kromaňonci v Čechách (paleolit)",
      "Neolit – zemědělská revoluce",
      "Keltové (Boiové) – pojmenování Bohemia",
      "Germáni v Čechách (po Keltech)",
    ],
    hints: ["Neandrtálci → neolit → Keltové → Germáni."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – lovci a sběrači",
      "Mladší doba kamenná – zemědělci",
      "Doba bronzová – bronzové meče a nástroje",
      "Keltové – oppida, obchod",
    ],
    hints: ["Lovci → zemědělci → bronz → Keltové."],
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Paleolit – Věstonická venuše (29 000 let)",
      "Neolit – keramika a zemědělství",
      "Doba bronzová – únětická kultura",
      "Keltové – doba železná, oppida",
    ],
    hints: ["Venuše → keramika → únětická kultura → Keltové."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Lovci a sběrači (paleolit)",
      "Zemědělci a pastevci (neolit)",
      "Keltové v Čechách (doba železná)",
      "Slované v Čechách (6. stol. n. l.)",
    ],
    hints: ["Lovci → zemědělci → Keltové → Slované."],
  },
  {
    question: "Seřaď pravěké mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – lidé loví mamuty",
      "Mladší doba kamenná – zemědělská revoluce",
      "Doba bronzová – bronz = měď + cín",
      "Doba železná – Keltové, Bohemia",
    ],
    hints: ["Mamuty → zemědělství → bronz → Keltové."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – neandrtálci, kromaňonci",
      "Neolit – zemědělství",
      "Doba bronzová – únětická kultura",
      "Germáni v Čechách (po Keltech)",
    ],
    hints: ["Paleolit → neolit → bronz → Germáni."],
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Lovci a sběrači – paleolit",
      "Neolit – zemědělci a první osady",
      "Keltové – Boiové, Bohemia",
      "Slované – 6. stol. n. l.",
    ],
    hints: ["Paleolit → neolit → Keltové → Slované."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Věstonická venuše – paleolitické umění (29 000 let)",
      "Neolit – zemědělství a keramika",
      "Keltové v Čechách (5. stol. př. n. l.)",
      "Germáni v Čechách – po Keltech",
    ],
    hints: ["29 000 let → neolit → Keltové → Germáni."],
  },
  {
    question: "Seřaď pravěké mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Paleolit – nejstarší lidé v Čechách",
      "Neolit – zemědělci",
      "Keltové – Boiové, Bohemia",
      "Slované – příchod do Čech",
    ],
    hints: ["Paleolit → neolit → Keltové → Slované."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – Věstonická venuše",
      "Mladší doba kamenná – první vesnice a zemědělství",
      "Únětická kultura – doba bronzová",
      "Keltové – oppida, obchod, Bohemia",
    ],
    hints: ["Venuše → vesnice → únětická kultura → oppida."],
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Paleolit – lovci a sběrači (kamenné nástroje)",
      "Neolit – zemědělci (keramika, obilí)",
      "Bronzová doba (bronz = měď + cín)",
      "Keltové v Čechách (5.–1. stol. př. n. l.)",
    ],
    hints: ["Paleolit → neolit → bronz → Keltové."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Lovci a sběrači – paleolit",
      "Zemědělci – neolit",
      "Keltové – Boiové, Bohemia",
      "Germáni vytlačují Kelty z Čech",
    ],
    hints: ["Paleolit → neolit → Keltové → Germáni."],
  },
  {
    question: "Seřaď pravěké mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Neandrtálec v Čechách (šipka u Štramberku)",
      "Věstonická venuše – kromaňonci (29 000 let)",
      "Neolit – zemědělství",
      "Keltové – Bohemia",
    ],
    hints: ["Neandrtálec → Venuše → neolit → Keltové."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – lovci a sběrači",
      "Neolit – zemědělci, keramika",
      "Keltové v Čechách (5.–1. stol. př. n. l.)",
      "Slované v Čechách (6. stol. n. l.)",
    ],
    hints: ["Lovci → zemědělci → Keltové → Slované."],
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Věstonická venuše – paleolit (29 000 let)",
      "Neolit – zemědělská revoluce",
      "Bronzová doba – únětická kultura",
      "Keltové – Boiové, oppida",
    ],
    hints: ["Venuše 29 000 let → neolit → únětická kultura → Keltové."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lidé loví mamuty",
      "Neolit – lidé pěstují obilí",
      "Keltové – Bohemia (5.–1. stol. př. n. l.)",
      "Germáni vytlačují Kelty (kolem 1. stol. př. n. l.)",
    ],
    hints: ["Mamuty → obilí → Keltové → Germáni."],
  },
  {
    question: "Seřaď pravěké mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – Věstonická venuše",
      "Neolit – osady a zemědělství",
      "Bronzová doba (bronz = měď + cín)",
      "Slované přicházejí do Čech (6. stol. n. l.)",
    ],
    hints: ["Venuše → osady → bronz → Slované."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lovci a sběrači",
      "Neolit – zemědělci",
      "Keltové – Boiové, Bohemia",
      "Germáni nahrazují Kelty v Čechách",
    ],
    hints: ["Paleolit → neolit → Keltové → Germáni."],
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Lovci a sběrači (paleolit)",
      "Zemědělská revoluce (neolit)",
      "Únětická kultura (bronz)",
      "Keltové – oppida v Čechách",
    ],
    hints: ["Lovci → zemědělci → únětická kultura → oppida."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Neandrtálci v Čechách (paleolit)",
      "Věstonická venuše – kromaňonci",
      "Neolit – keramika a zemědělství",
      "Keltové – Bohemia",
    ],
    hints: ["Neandrtálci → Venuše → neolit → Keltové."],
  },
  {
    question: "Seřaď pravěké mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – kamenné nástroje",
      "Neolit – zemědělci a osady",
      "Bronzová doba – bronzové meče",
      "Keltové (Boiové) – Bohemia",
    ],
    hints: ["Paleolit → neolit → bronz → Keltové."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – lovci a sběrači",
      "Mladší doba kamenná – zemědělci",
      "Keltové v Čechách – Boiové",
      "Slované v Čechách (6. stol. n. l.)",
    ],
    hints: ["Lovci → zemědělci → Keltové → Slované."],
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Paleolit – nejstarší lidé (lovci)",
      "Neolit – zemědělci",
      "Bronzová doba – únětická kultura",
      "Germáni vytlačují Kelty (1. stol. př. n. l.)",
    ],
    hints: ["Paleolit → neolit → únětická kultura → Germáni."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – Věstonická venuše (29 000 let)",
      "Neolit – zemědělství a keramika",
      "Keltové – Bohemia (5.–1. stol. př. n. l.)",
      "Slované – 6. stol. n. l.",
    ],
    hints: ["29 000 let → neolit → Keltové → Slované."],
  },
  {
    question: "Seřaď pravěké mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – lovci",
      "Neolit – zemědělci",
      "Keltové – oppida a Bohemia",
      "Germáni v Čechách",
    ],
    hints: ["Lovci → zemědělci → Keltové → Germáni."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Věstonická venuše – paleolit",
      "Neolit – první zemědělci v Čechách",
      "Keltové (Boiové) – Bohemia",
      "Slované přicházejí do Čech",
    ],
    hints: ["Venuše → neolit → Keltové → Slované."],
  },
  {
    question: "Seřaď pravěké epochy od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lidé loví a sbírají",
      "Neolit – zemědělská revoluce",
      "Bronzová doba",
      "Keltové v Čechách – Bohemia",
    ],
    hints: ["Paleolit → neolit → bronz → Keltové."],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(VSECHNY_TASKY).slice(0, 35);
}

export const PRAVEKAPRVNILIDENANASEMUZEMI: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-pravek-a-prvni-lide-na-nasem-uzemi",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-pravek-a-prvni-lide-na-nasem-uzemi",
    title: "Pravěk a první lidé na našem území",
    studentTitle: "Pravěk v Čechách",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš, jak žili první lidé na území ČR od lovců po zemědělce a Kelty.",
    keywords: ["pravěk", "paleolit", "neolit", "Keltové", "Slované", "Věstonická venuše", "bronz"],
    goals: [
      "Rozlišit hlavní pravěké epochy (paleolit, neolit, bronz, železo)",
      "Popsat způsob života lovců a zemědělců",
      "Znát Věstonickou venuši a Kelty",
      "Vysvětlit, kdy přišli Slované",
    ],
    boundaries: ["Přesné datování není povinné", "Detailní archeologie není cílem"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Pravěk: paleolit (lovci) → neolit (zemědělci) → bronz (bronz = měď+cín) → železo (Keltové). Věstonická venuše = 29 000 let, Dolní Věstonice.",
      steps: [
        "Vzpomeň si na posloupnost: kámen → bronz → železo",
        "Neolit = zemědělci, neolit přišel po paleolitu",
        "Keltové (Boiové) → Bohemia → Čechy",
        "Slované přišli v 6. stol. n. l.",
      ],
      commonMistake: "Žáci si pletou neolit (zemědělci) s neandrtálci — jsou to odlišné věci.",
      example: "Paleolit: Věstonická venuše 29 000 let. Neolit: zemědělci, keramika. Bronz: únětická kultura. Železo: Keltové.",
    },
  },
];
