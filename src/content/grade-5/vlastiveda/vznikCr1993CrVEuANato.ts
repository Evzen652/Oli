import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1 – jednodušší sekvence (4 události)
const POOL_L1: PracticeTask[] = [
  {
    question: "Seřaď chronologicky: vznik ČR, vstup do NATO, Sametová revoluce, vstup do EU.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (17. 11. 1989)",
      "Vznik samostatné ČR (1. 1. 1993)",
      "Vstup ČR do NATO (1999)",
      "Vstup ČR do EU (1. 5. 2004)",
    ],
    hints: ["Sametová revoluce byla absolutně první."],
  },
  {
    question: "Seřaď od nejdřívějšího: vstup do Schengenu, vznik ČR, vstup do EU, vstup do NATO.",
    correctAnswer: "order",
    items: [
      "Vznik ČR (1. 1. 1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (1. 5. 2004)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["Vznik ČR byl 1. 1. 1993."],
  },
  {
    question: "Seřaď čtyři klíčové milníky ČR po roce 1989.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (1989)",
      "Sametový rozvod — vznik ČR a SR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
    ],
    hints: ["Sametová revoluce byla nejdříve."],
  },
  {
    question: "Seřaď: vstup do EU, vznik ČR, vstup do NATO, vstup do Schengenu.",
    correctAnswer: "order",
    items: [
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["Vznik ČR byl první."],
  },
  {
    question: "Seřaď: Havel prezidentem, Sametová revoluce, vznik ČR, vstup do NATO.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (17. 11. 1989)",
      "Havel zvolen prezidentem (29. 12. 1989)",
      "Vznik ČR (1. 1. 1993)",
      "Vstup do NATO (1999)",
    ],
    hints: ["Havel byl zvolen prezidentem krátce po Sametové revoluci."],
  },
  {
    question: "Seřaď: Klaus premiérem ČR, vznik ČR, vstup do EU, vstup do NATO.",
    correctAnswer: "order",
    items: [
      "Klaus jako premiér ČR (1993–1997)",
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
    ],
    hints: ["Klaus byl premiérem od vzniku ČR."],
  },
  {
    question: "Seřaď: vstup do Schengenu, vstup do EU, první svobodné volby po 1989, vstup do NATO.",
    correctAnswer: "order",
    items: [
      "První svobodné volby po pádu komunismu (červen 1990)",
      "Vstup ČR do NATO (1999)",
      "Vstup ČR do EU (1. 5. 2004)",
      "Vstup ČR do Schengenu (2007)",
    ],
    hints: ["První svobodné volby proběhly v červnu 1990."],
  },
  {
    question: "Seřaď: Václav Klaus prezidentem, vznik ČR, vstup do EU, vstup do NATO.",
    correctAnswer: "order",
    items: [
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Václav Klaus zvolen prezidentem (2003)",
      "Vstup do EU (2004)",
    ],
    hints: ["Klaus byl zvolen prezidentem v roce 2003."],
  },
  {
    question: "Seřaď čtyři klíčové milníky vztahu ČR k Evropě.",
    correctAnswer: "order",
    items: [
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["Vstup do NATO byl v roce 1999."],
  },
  {
    question: "Seřaď: ČR usiluje o vstup do NATO, Sametová revoluce, vznik ČR, vstup do EU.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (1989)",
      "ČR usiluje o vstup do NATO — přihlašuje se (1997)",
      "Vznik ČR (1993)",
      "Vstup do EU (2004)",
    ],
    hints: ["Sametová revoluce je nejdříve."],
  },
];

// Level 2 – středně těžké sekvence (5 událostí)
const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď chronologicky 5 klíčových milníků ČR od roku 1989.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (17. 11. 1989)",
      "Vznik samostatné ČR (1. 1. 1993)",
      "Vstup ČR do NATO (1999)",
      "Vstup ČR do EU (1. 5. 2004)",
      "Vstup ČR do Schengenu (2007)",
    ],
    hints: ["Sametová revoluce byla absolutně první."],
  },
  {
    question: "Seřaď: vstup do Schengenu, Havel prezidentem, vznik ČR, vstup do NATO, vstup do EU.",
    correctAnswer: "order",
    items: [
      "Havel zvolen prezidentem (29. 12. 1989)",
      "Vznik ČR (1. 1. 1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["Havel byl zvolen prezidentem v prosinci 1989."],
  },
  {
    question: "Seřaď 5 klíčových dat od pádu komunismu po vstup do Schengenu.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (1989)",
      "První svobodné volby (1990)",
      "Vznik ČR — Sametový rozvod (1993)",
      "Vstup do NATO (1999)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["Sametová revoluce je nejdříve."],
  },
  {
    question: "Seřaď: pád Berlínské zdi, vznik ČR, vstup do EU, Sametová revoluce, vstup do NATO.",
    correctAnswer: "order",
    items: [
      "Pád Berlínské zdi (9. 11. 1989)",
      "Sametová revoluce (17. 11. 1989)",
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
    ],
    hints: ["Berlínská zeď padla 8 dní před Sametovou revolucí."],
  },
  {
    question: "Seřaď 5 klíčových dat: od komunistického Února 1948 po vstup do EU.",
    correctAnswer: "order",
    items: [
      "Únorový převrat — komunisté u moci (1948)",
      "Sametová revoluce (1989)",
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
    ],
    hints: ["Únorový převrat je absolutně nejdříve."],
  },
  {
    question: "Seřaď: vstup do NATO, Havel prezidentem, Klaus premiérem, vznik ČR, vstup do EU.",
    correctAnswer: "order",
    items: [
      "Havel zvolen prezidentem (29. 12. 1989)",
      "Klaus — první premiér ČR (1993)",
      "Vznik ČR (1. 1. 1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
    ],
    hints: ["Havel byl zvolen v prosinci 1989."],
  },
  {
    question: "Seřaď 5 milníků od Sametové revoluce po vstup do Schengenu.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (1989)",
      "Sametový rozvod (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["Od 1989 po 2007."],
  },
  {
    question: "Seřaď: Zeman prezidentem, vstup do EU, vznik ČR, vstup do NATO, vstup do Schengenu.",
    correctAnswer: "order",
    items: [
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
      "Vstup do Schengenu (2007)",
      "Zeman zvolen prezidentem (2013)",
    ],
    hints: ["Zeman byl zvolen v roce 2013."],
  },
  {
    question: "Seřaď 5 klíčových dat: od přihlášení do NATO po přijetí Schengenu.",
    correctAnswer: "order",
    items: [
      "ČR se přihlašuje do NATO (1997)",
      "Vstup do NATO (1999)",
      "ČR přihlašuje do EU (2003 — referendum)",
      "Vstup do EU (2004)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["ČR se přihlásila do NATO v roce 1997."],
  },
  {
    question: "Seřaď 5 klíčových dat: od Sametové revoluce po vstup ČR do NATO.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (17. 11. 1989)",
      "Havel zvolen prezidentem (29. 12. 1989)",
      "První svobodné volby (červen 1990)",
      "Vznik ČR (1. 1. 1993)",
      "Vstup do NATO (1999)",
    ],
    hints: ["Sametová revoluce je absolutně první."],
  },
];

// Level 3 – pokročilé sekvence (5–6 událostí)
const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď 6 klíčových milníků ČR od Sametové revoluce po vstup do Schengenu.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (17. 11. 1989)",
      "Havel zvolen prezidentem (29. 12. 1989)",
      "Vznik ČR — Sametový rozvod (1. 1. 1993)",
      "Vstup ČR do NATO (1999)",
      "Vstup ČR do EU (1. 5. 2004)",
      "Vstup ČR do Schengenu (2007)",
    ],
    hints: ["Sametová revoluce je první, Schengen nejpozději."],
  },
  {
    question: "Seřaď 6 milníků: od pádu komunismu po přijetí ČR do Schengenu.",
    correctAnswer: "order",
    items: [
      "Pád Berlínské zdi (9. 11. 1989)",
      "Sametová revoluce (17. 11. 1989)",
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["Berlínská zeď padla 8 dní před Sametovou revolucí."],
  },
  {
    question: "Seřaď 5 klíčových dat: od komunistického převratu 1948 po vstup do Schengenu.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Sametová revoluce (1989)",
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["Únorový převrat je absolutně nejdříve."],
  },
  {
    question: "Seřaď 6 klíčových dat: od vzniku ČSR v 1918 po vstup do EU.",
    correctAnswer: "order",
    items: [
      "Vznik Československa (1918)",
      "Únorový převrat (1948)",
      "Sametová revoluce (1989)",
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
    ],
    hints: ["Vznik ČSR je absolutně nejdříve."],
  },
  {
    question: "Seřaď 6 milníků: od pádu komunismu v ČSR po přijetí Schengenu.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (1989)",
      "První svobodné volby (1990)",
      "Sametový rozvod — vznik ČR a SR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["Sametová revoluce je nejdříve."],
  },
  {
    question: "Seřaď 5 klíčových dat od vzniku ČR po vstup do Schengenu.",
    correctAnswer: "order",
    items: [
      "Vznik ČR (1. 1. 1993)",
      "ČR se přihlašuje do NATO (1997)",
      "Vstup do NATO (1999)",
      "Vstup do EU (1. 5. 2004)",
      "Vstup do Schengenu (2007)",
    ],
    hints: ["ČR se přihlásila do NATO v roce 1997."],
  },
  {
    question: "Seřaď 6 klíčových dat: od 1. světové války po vstup ČR do EU.",
    correctAnswer: "order",
    items: [
      "Vznik Czechoslovenska (1918)",
      "Komunistický převrat (1948)",
      "Sametová revoluce (1989)",
      "Vznik ČR (1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
    ],
    hints: ["Od roku 1918 po rok 2004."],
  },
  {
    question: "Seřaď 5 klíčových dat zahraniční politiky ČR po roce 1989.",
    correctAnswer: "order",
    items: [
      "Zrušení Varšavské smlouvy (1991)",
      "Vznik ČR (1993)",
      "Přihlášení ČR do NATO (1997)",
      "Vstup do NATO (1999)",
      "Vstup do EU (2004)",
    ],
    hints: ["Varšavská smlouva byla zrušena v roce 1991."],
  },
  {
    question: "Seřaď 6 milníků: od Sametové revoluce po přijetí ČR do Schengenu.",
    correctAnswer: "order",
    items: [
      "Sametová revoluce (17. 11. 1989)",
      "Sametový rozvod (1. 1. 1993)",
      "Přihlášení ČR do NATO (1997)",
      "Vstup ČR do NATO (1999)",
      "Vstup ČR do EU (1. 5. 2004)",
      "Vstup ČR do Schengenu (2007)",
    ],
    hints: ["Přihlášení do NATO přišlo v roce 1997."],
  },
  {
    question: "Seřaď 5 klíčových dat: od vzniku ČR po vstup Slovenska do eurozóny.",
    correctAnswer: "order",
    items: [
      "Vznik ČR a SR (1. 1. 1993)",
      "Vstup ČR do NATO (1999)",
      "Vstup ČR i SR do EU (2004)",
      "Vstup ČR do Schengenu (2007)",
      "Slovensko přijímá euro (2009)",
    ],
    hints: ["Slovensko přijalo euro v roce 2009."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const VZNIKCR1993CRVEUANATO: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-vznik-cr-1993-cr-v-eu-a-nato",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-vznik-cr-1993-cr-v-eu-a-nato",
    title: "Vznik ČR 1993, ČR v EU a NATO",
    studentTitle: "Vznik ČR a EU",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Pochopíš vznik ČR a její místo v Evropě.",
    keywords: ["vznik čr", "sametový rozvod", "eu", "nato", "schengen", "eurozóna", "česká koruna"],
    goals: [
      "Žák uvede datum vzniku ČR a podmínky rozdělení",
      "Žák zná členství ČR v NATO, EU a Schengenu a jejich roky",
      "Žák vysvětlí, proč ČR nemá euro",
    ],
    boundaries: ["Ekonomická kritéria eurozóny podrobně", "Vojenská struktura NATO"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Pamatuj: 1993 vznik ČR, 1999 NATO, 2004 EU, 2007 Schengen.",
      steps: [
        "1. 1. 1993: Sametový rozvod — vznik ČR a SR",
        "1999: ČR vstupuje do NATO",
        "1. 5. 2004: ČR vstupuje do EU",
        "2007: ČR vstupuje do Schengenu",
        "ČR nemá euro — používáme CZK",
      ],
      commonMistake: "Zaměňování roku vstupu do NATO (1999) a EU (2004).",
      example: "Sametový rozvod = pokojné rozdělení ČSR na dvě republiky — jako Sametová revoluce, ale jiné.",
    },
  },
];
