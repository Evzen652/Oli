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
    question: "Seřaď chronologicky: Sametová revoluce, únorový převrat, Pražské jaro, srpnová invaze.",
    correctAnswer: "order",
    items: [
      "Únorový převrat — komunisté přebírají moc (1948)",
      "Pražské jaro — Dubčekovy reformy (1968)",
      "Srpnová invaze vojsk Varšavské smlouvy (1968)",
      "Sametová revoluce (17. 11. 1989)",
    ],
    hints: ["Únorový převrat byl absolutně první v roce 1948."],
  },
  {
    question: "Seřaď od nejdřívějšího: Václav Havel prezidentem, Sametová revoluce, Gottwald první komunistický prezident, Pražské jaro.",
    correctAnswer: "order",
    items: [
      "Gottwald — první komunistický prezident (1948)",
      "Pražské jaro (1968)",
      "Sametová revoluce (17. 11. 1989)",
      "Václav Havel zvolen prezidentem (29. 12. 1989)",
    ],
    hints: ["Gottwald byl první, Havel přišel po Sametové revoluci."],
  },
  {
    question: "Seřaď: normalizace, Pražské jaro, únorový převrat, Sametová revoluce.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Pražské jaro (1968)",
      "Normalizace — Husákova éra (1969–1989)",
      "Sametová revoluce (1989)",
    ],
    hints: ["Normalizace přišla po invazi 1968."],
  },
  {
    question: "Seřaď čtyři klíčové události komunistické éry v ČSR.",
    correctAnswer: "order",
    items: [
      "Únorový převrat — komunisté u moci (1948)",
      "Kolektivizace — vznik JZD (1949–1960)",
      "Pražské jaro a srpnová invaze (1968)",
      "Sametová revoluce (17. 11. 1989)",
    ],
    hints: ["Kolektivizace začala hned po převratu."],
  },
  {
    question: "Seřaď: Gorbačovovy reformy inspirují svět, Sametová revoluce, Pražské jaro, únorový převrat.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Pražské jaro (1968)",
      "Gorbačovovy reformy — perestrojka (1985)",
      "Sametová revoluce (1989)",
    ],
    hints: ["Gorbačov začal reformy v roce 1985."],
  },
  {
    question: "Seřaď: Charta 77, invaze SSSR, únorový převrat, Sametová revoluce.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Invaze SSSR — konec Pražského jara (21. 8. 1968)",
      "Charta 77 — petice disidentů (1977)",
      "Sametová revoluce (1989)",
    ],
    hints: ["Charta 77 přišla po invazi."],
  },
  {
    question: "Seřaď čtyři klíčové momenty spojené s Alexandrem Dubčekem.",
    correctAnswer: "order",
    items: [
      "Dubček se stává 1. tajemníkem KSČ (leden 1968)",
      "Pražské jaro — reformy (jaro 1968)",
      "Srpnová invaze a konec reforem (21. 8. 1968)",
      "Dubček sesazen a degradován na lesního dělníka (1969)",
    ],
    hints: ["Dubček nastoupil v lednu 1968."],
  },
  {
    question: "Seřaď: Václav Havel disidentem, únorový převrat, Sametová revoluce, Havel prezidentem.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Václav Havel aktivní jako disident a autor Charty 77 (1977)",
      "Sametová revoluce (17. 11. 1989)",
      "Havel zvolen prezidentem (29. 12. 1989)",
    ],
    hints: ["Charta 77 přišla v roce 1977."],
  },
  {
    question: "Seřaď: pád Berlínské zdi, Pražské jaro, únorový převrat, Sametová revoluce.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Pražské jaro (1968)",
      "Pád Berlínské zdi (9. 11. 1989)",
      "Sametová revoluce (17. 11. 1989)",
    ],
    hints: ["Berlínská zeď padla 9. 11. — osm dní před Sametovou revolucí."],
  },
  {
    question: "Seřaď: Jan Palach se upálil, Pražské jaro, únorový převrat, normalizace začíná.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Pražské jaro (1968)",
      "Jan Palach se upálil na protest (16. 1. 1969)",
      "Normalizace začíná — Husák nahrazuje Dubčeka (1969)",
    ],
    hints: ["Jan Palach se upálil v lednu 1969."],
  },
];

// Level 2 – středně těžké sekvence (5 událostí)
const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď chronologicky 5 klíčových událostí komunistické éry v ČSR.",
    correctAnswer: "order",
    items: [
      "Únorový převrat — komunisté přebírají moc (1948)",
      "Pražské jaro — Dubčekovy reformy (1968)",
      "Srpnová invaze vojsk Varšavské smlouvy (21. 8. 1968)",
      "Normalizace — Husákova éra (1969–1989)",
      "Sametová revoluce (17. 11. 1989)",
    ],
    hints: ["Začni rokem 1948."],
  },
  {
    question: "Seřaď: Sametová revoluce, Charta 77, Pražské jaro, únorový převrat, srpnová invaze.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Pražské jaro (1968)",
      "Srpnová invaze (21. 8. 1968)",
      "Charta 77 (1977)",
      "Sametová revoluce (1989)",
    ],
    hints: ["Charta 77 je mezi invazí a Sametovou revolucí."],
  },
  {
    question: "Seřaď 5 klíčových momentů komunistické represe v ČSR.",
    correctAnswer: "order",
    items: [
      "Politické procesy — show-trials (1949–1954)",
      "Pražské jaro potlačeno (1968)",
      "Jan Palach se upálil (1969)",
      "Normalizační čistky — Dubček degradován (1969)",
      "Havel uvězněn za Chartu 77 (1979)",
    ],
    hints: ["Politické procesy byly v 50. letech."],
  },
  {
    question: "Seřaď: Havel prezidentem, únorový převrat, Pražské jaro, Sametová revoluce, Charta 77.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Pražské jaro (1968)",
      "Charta 77 (1977)",
      "Sametová revoluce (17. 11. 1989)",
      "Havel zvolen prezidentem (29. 12. 1989)",
    ],
    hints: ["Pražské jaro je první ze čtyř."],
  },
  {
    question: "Seřaď 5 klíčových dat od únorového převratu po volby 1990.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Srpnová invaze (21. 8. 1968)",
      "Charta 77 (1977)",
      "Sametová revoluce (17. 11. 1989)",
      "První svobodné volby po pádu komunismu (červen 1990)",
    ],
    hints: ["Svobodné volby přišly v červnu 1990."],
  },
  {
    question: "Seřaď chronologicky: pád Berlínské zdi, Pražské jaro, únorový převrat, Sametová revoluce, normalizace.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Pražské jaro (1968)",
      "Normalizace — Husákova éra (1969)",
      "Pád Berlínské zdi (9. 11. 1989)",
      "Sametová revoluce (17. 11. 1989)",
    ],
    hints: ["Berlínská zeď padla 8 dní před Sametovou revolucí."],
  },
  {
    question: "Seřaď: únorový převrat, kolektivizace, Pražské jaro, Charta 77, Sametová revoluce.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Kolektivizace — vznik JZD (1949–1960)",
      "Pražské jaro (1968)",
      "Charta 77 (1977)",
      "Sametová revoluce (1989)",
    ],
    hints: ["Kolektivizace probíhala po únoru 1948."],
  },
  {
    question: "Seřaď 5 milníků od srpnové invaze k Sametové revoluci.",
    correctAnswer: "order",
    items: [
      "Srpnová invaze Varšavské smlouvy (21. 8. 1968)",
      "Jan Palach se upálil (16. 1. 1969)",
      "Husák nahrazuje Dubčeka (1969)",
      "Charta 77 (1977)",
      "Sametová revoluce (17. 11. 1989)",
    ],
    hints: ["Jan Palach se upálil v lednu 1969."],
  },
  {
    question: "Seřaď: únorový převrat, Gorbačovovy reformy, Pražské jaro, invaze, Sametová revoluce.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Pražské jaro (1968)",
      "Srpnová invaze (1968)",
      "Gorbačovovy reformy — perestrojka (1985)",
      "Sametová revoluce (1989)",
    ],
    hints: ["Gorbačovovy reformy začaly v roce 1985."],
  },
  {
    question: "Seřaď 5 klíčových dat spojených s Václavem Havlem.",
    correctAnswer: "order",
    items: [
      "Havel píše první hry — Zahradní slavnost (1963)",
      "Havel podepisuje Chartu 77 (1977)",
      "Havel uvězněn (1979–1983)",
      "Sametová revoluce — Havel vůdcem (1989)",
      "Havel zvolen prezidentem (29. 12. 1989)",
    ],
    hints: ["Havel psal hry od 60. let."],
  },
];

// Level 3 – pokročilé sekvence (5–6 událostí)
const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď 6 klíčových událostí komunistické éry v ČSR od nejdřívějšího.",
    correctAnswer: "order",
    items: [
      "Únorový převrat — komunisté přebírají moc (1948)",
      "Pražské jaro — Dubčekovy reformy (1968)",
      "Srpnová invaze vojsk Varšavské smlouvy (21. 8. 1968)",
      "Normalizace — Husákova éra (1969–1989)",
      "Sametová revoluce (17. 11. 1989)",
      "Václav Havel zvolen prezidentem (29. 12. 1989)",
    ],
    hints: ["Začni rokem 1948, skonči 29. 12. 1989."],
  },
  {
    question: "Seřaď 6 milníků od únorového převratu po první svobodné volby.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Politické procesy — show-trials (1950–1954)",
      "Pražské jaro (1968)",
      "Srpnová invaze (1968)",
      "Sametová revoluce (1989)",
      "První svobodné volby (červen 1990)",
    ],
    hints: ["Politické procesy probíhaly v 50. letech."],
  },
  {
    question: "Seřaď 6 klíčových dat v komunistické ČSR — od kolektivizace po pád režimu.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Kolektivizace — zemědělci přicházejí o půdu (1949–1960)",
      "Pražské jaro — Dubčekovy reformy (1968)",
      "Srpnová invaze (21. 8. 1968)",
      "Charta 77 (1977)",
      "Sametová revoluce (17. 11. 1989)",
    ],
    hints: ["Kolektivizace probíhala od 1949."],
  },
  {
    question: "Seřaď 6 milníků od konce 2. světové války po Sametovou revoluci.",
    correctAnswer: "order",
    items: [
      "Osvobozeni ČSR (1945)",
      "Únorový převrat (1948)",
      "Pražské jaro (1968)",
      "Srpnová invaze (1968)",
      "Charta 77 (1977)",
      "Sametová revoluce (1989)",
    ],
    hints: ["Osvobozeni bylo v roce 1945, Sametová revoluce v 1989."],
  },
  {
    question: "Seřaď 6 klíčových dat: únorový převrat, Havel uvězněn, Pražské jaro, invaze, Charta 77, Sametová revoluce.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Pražské jaro (1968)",
      "Srpnová invaze (21. 8. 1968)",
      "Charta 77 (1977)",
      "Havel uvězněn za Chartu 77 (1979)",
      "Sametová revoluce (17. 11. 1989)",
    ],
    hints: ["Havel byl uvězněn v roce 1979."],
  },
  {
    question: "Seřaď 6 milníků celoevropského pádu komunismu roku 1989.",
    correctAnswer: "order",
    items: [
      "Polsko — první nekomunistická vláda (srpen 1989)",
      "Maďarsko otvírá hranici Rakousků (září 1989)",
      "NDR — masové demonstrace (říjen 1989)",
      "Pád Berlínské zdi (9. 11. 1989)",
      "Sametová revoluce v ČSR (17. 11. 1989)",
      "Rumunsko — pád Ceaușesca (prosinec 1989)",
    ],
    hints: ["Polsko bylo první, Rumunsko poslední."],
  },
  {
    question: "Seřaď 5 klíčových momentů Pražského jara 1968.",
    correctAnswer: "order",
    items: [
      "Dubček se stává 1. tajemníkem KSČ (leden 1968)",
      "Zrušení cenzury tisku (únor 1968)",
      "2000 slov — manifest za reformy (červen 1968)",
      "Srpnová invaze Varšavské smlouvy (21. 8. 1968)",
      "Moskvský protokol — kapitulace (srpen 1968)",
    ],
    hints: ["Dubček nastoupil v lednu 1968."],
  },
  {
    question: "Seřaď 6 klíčových momentů Sametové revoluce 1989.",
    correctAnswer: "order",
    items: [
      "Studentská demonstrace na Národní třídě (17. 11. 1989)",
      "Policie napadá studenty (17. 11. 1989)",
      "Vznik Občanského fóra (19. 11. 1989)",
      "Generální stávka (27. 11. 1989)",
      "Komunisté vzdávají vedoucí roli (29. 11. 1989)",
      "Havel zvolen prezidentem (29. 12. 1989)",
    ],
    hints: ["Studentská demonstrace spustila vše."],
  },
  {
    question: "Seřaď 5 klíčových dat spojených s normalizací.",
    correctAnswer: "order",
    items: [
      "Srpnová invaze (21. 8. 1968)",
      "Husák nahrazuje Dubčeka (1969)",
      "Normalizační čistky — stovky tisíc vyloučeno z KSČ (1970)",
      "Charta 77 (1977)",
      "Havel propuštěn z vězení (1983)",
    ],
    hints: ["Srpnová invaze zahájila normalizaci."],
  },
  {
    question: "Seřaď 6 milníků od únorového převratu po přijetí nové Ústavy ČR.",
    correctAnswer: "order",
    items: [
      "Únorový převrat (1948)",
      "Pražské jaro a invaze (1968)",
      "Sametová revoluce (1989)",
      "Havel zvolen prezidentem (29. 12. 1989)",
      "Sametový rozvod — vznik ČR (1. 1. 1993)",
      "Přijetí Ústavy ČR (16. 12. 1992)",
    ],
    hints: ["Ústava ČR byla přijata ještě před vznikem ČR."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const KOMUNISTICKYREZIMSAMETOVAREVOLUCE1989: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-komunisticky-rezim-sametova-revoluce-1989",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-komunisticky-rezim-sametova-revoluce-1989",
    title: "Komunistický režim, sametová revoluce 1989",
    studentTitle: "Komunismus a revoluce",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Poznáš, jak fungoval komunismus a jak padl v roce 1989.",
    keywords: ["komunismus", "gottwald", "pražské jaro", "dubček", "normalizace", "sametová revoluce", "havel"],
    goals: [
      "Žák vysvětlí, co byl komunistický režim v ČSR",
      "Žák popíše Pražské jaro a srpnovou invazi",
      "Žák zná datum a průběh Sametové revoluce",
    ],
    boundaries: ["Marxistická ekonomická teorie", "Detailní geopolitika studené války"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová data: 1948 (převrat), 1968 (Pražské jaro + invaze), 1989 (Sametová revoluce).",
      steps: [
        "Únor 1948: komunistický převrat — Gottwald",
        "1968: Pražské jaro (Dubček) → invaze SSSR",
        "1969–1989: normalizace — Husák",
        "17. 11. 1989: Sametová revoluce",
        "1989: Václav Havel — prezident",
      ],
      commonMistake: "Zaměňování Dubčeka (Pražské jaro) a Husáka (normalizace).",
      example: "Sametová revoluce se nazývá sametová, protože proběhla bez násilí.",
    },
  },
];
