import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Každý task = seřaď historické události Lucemburků ve správném pořadí
const VSECHNY_TASKY: PracticeTask[] = [
  {
    question: "Seřaď události z doby Lucemburků od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král v Čechách (1310)",
      "Karel IV. korunován českým králem (1347)",
      "Karel IV. korunován císařem Svaté říše římské (1355)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1310 → 1347 → 1355 → 1378."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král v Čechách (1310–1346)",
      "Karel IV. – korunován českým králem (1347)",
      "Karel IV. – Karlova univerzita v Praze (1348)",
      "Zlatá bula – zákon o volbě císaře (1356)",
    ],
    hints: ["Jan → Karel král 1347 → univerzita 1348 → bula 1356."],
  },
  {
    question: "Seřaď události z doby Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. korunován českým králem (1347)",
      "Karel IV. zakládá Karlovu univerzitu (1348)",
      "Karel IV. zakládá Nové Město pražské (1348)",
      "Zlatá bula Karla IV. – zákon o volbě císaře (1356)",
    ],
    hints: ["1347 → univerzita 1348 → Nové Město 1348 → bula 1356."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. korunován králem (1347)",
      "Karel IV. korunován císařem v Římě (1355)",
      "Karel IV. zemřel – Václav IV. nastupuje (1378)",
    ],
    hints: ["Kresčak 1346 → král 1347 → císař 1355 → smrt 1378."],
  },
  {
    question: "Seřaď lucemburské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král Čech (1310)",
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. – Karlova univerzita (1348)",
      "Karel IV. – Karlův most zahájen (1357)",
    ],
    hints: ["1310 → Kresčak 1346 → 1348 → 1357."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců (1306) – nástup Lucemburků",
      "Jan Lucemburský – první lucemburský král v Čechách",
      "Karel IV. – Otec vlasti, korunován 1347",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1306 → Jan Lucemburský → Karel IV. → 1378."],
  },
  {
    question: "Seřaď události z éry Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. korunován českým králem (1347)",
      "Karel IV. zakládá Karlovu univerzitu (1348)",
      "Zlatá bula – zákon o volbě císaře (1356)",
      "Karel IV. zahajuje stavbu Karlova mostu (1357)",
    ],
    hints: ["1347 → 1348 → 1356 → 1357."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – kralem od 1310",
      "Karel IV. narozen (1316)",
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. korunován králem (1347)",
    ],
    hints: ["1310 → Karel IV. 1316 → Kresčak 1346 → Karel IV. král 1347."],
  },
  {
    question: "Seřaď lucemburské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – korunován králem (1347)",
      "Karlova univerzita – první ve střední Evropě (1348)",
      "Zlatá bula (1356)",
      "Karel IV. zemřel – začíná náboženská krize (1378)",
    ],
    hints: ["1347 → 1348 → 1356 → 1378."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král v Čechách",
      "Karel IV. – korunován císařem v Římě (1355)",
      "Karel IV. – zlatá bula, zákon o volbě císaře (1356)",
      "Karel IV. zemřel (1378) – nástup Jana Husa",
    ],
    hints: ["Jan Lucemburský → 1355 → 1356 → 1378."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců (1306)",
      "Jan Lucemburský – král v Čechách",
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. – zakládá Karlovu univerzitu (1348)",
    ],
    hints: ["1306 → Jan Lucemburský → 1346 → Karel IV. 1348."],
  },
  {
    question: "Seřaď lucemburské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Karel IV. narozen (1316)",
      "Karel IV. korunován králem (1347)",
      "Karel IV. korunován císařem (1355)",
      "Karel IV. stavbu Karlův most (1357)",
    ],
    hints: ["1316 → 1347 → 1355 → 1357."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král (1310)",
      "Karel IV. – Karlova univerzita (1348)",
      "Zlatá bula – zákon o volbě císaře (1356)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1310 → 1348 → 1356 → 1378."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. korunován českým králem",
      "Karel IV. – Nové Město pražské a Karlova univerzita",
      "Karel IV. korunován císařem v Římě",
    ],
    hints: ["Kresčak 1346 → král → Nové Město a univ. → cisař."],
  },
  {
    question: "Seřaď lucemburské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – kralem Čech (1310)",
      "Karel IV. – Karlova univerzita (1348)",
      "Karel IV. – Zlatá bula (1356)",
      "Karel IV. zemřel – Václav IV. nastupuje (1378)",
    ],
    hints: ["1310 → 1348 → 1356 → 1378."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. narozen (1316)",
      "Karel IV. korunován král (1347) a zakládá univ. (1348)",
      "Zlatá bula (1356) – zákon o volbě císaře",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1316 → 1347/1348 → 1356 → 1378."],
  },
  {
    question: "Seřaď události z lucemburské éry od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král",
      "Karel IV. – korunován králem 1347",
      "Zlatá bula – zákon o volbě císaře (1356)",
      "Karel IV. zemřel (1378) – nástup Jana Husa",
    ],
    hints: ["Jan → Karel 1347 → bula 1356 → Karel zemřel 1378."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců (1306) – nástup Lucemburků",
      "Jan Lucemburský – první lucemburský krale",
      "Karel IV. – Karlova univerzita (1348)",
      "Karel IV. zemřel, Václav IV. nastupuje (1378)",
    ],
    hints: ["1306 → Jan → 1348 → 1378."],
  },
  {
    question: "Seřaď lucemburské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. – korunován císařem (1355)",
      "Zlatá bula (1356)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["Kresčak 1346 → císař 1355 → bula 1356 → smrt 1378."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – korunován král Čech (1347)",
      "Karel IV. zakládá Karlovu univerzitu (1348)",
      "Karel IV. – korunován císařem (1355)",
      "Zlatá bula (1356) – zákon o volbě císaře",
    ],
    hints: ["1347 → 1348 → 1355 → 1356."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král v Čechách (1310)",
      "Karel IV. – Karlova univerzita (1348)",
      "Karel IV. – Karlův most zahájen (1357)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1310 → 1348 → 1357 → 1378."],
  },
  {
    question: "Seřaď lucemburské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců (1306)",
      "Jan Lucemburský – kralem Čech",
      "Karel IV. – Nové Město pražské (1348)",
      "Karel IV. korunován císařem (1355)",
    ],
    hints: ["1306 → Jan → 1348 → 1355."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – korunován česky král (1347)",
      "Zlatá bula – zákon o volbě císaře (1356)",
      "Karlův most zahájen (1357)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1347 → 1356 → 1357 → 1378."],
  },
  {
    question: "Seřaď lucemburské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král v Čechách (1310)",
      "Karel IV. narozen (1316)",
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. korunován králem Čech (1347)",
    ],
    hints: ["1310 → 1316 → Kresčak 1346 → Karel IV. král 1347."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – Karlova univerzita v Praze (1348)",
      "Karel IV. korunován císařem (1355)",
      "Zlatá bula (1356)",
      "Karlův most zahájen (1357)",
    ],
    hints: ["1348 → 1355 → 1356 → 1357."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první Lucemburk v Čechách (1310)",
      "Karel IV. – Karlova univerzita (1348)",
      "Zlatá bula (1356)",
      "Karel IV. zemřel (1378) – začíná éra Jana Husa",
    ],
    hints: ["1310 → 1348 → 1356 → 1378."],
  },
  {
    question: "Seřaď lucemburské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský kralem (1310)",
      "Karel IV. korunován česky král (1347)",
      "Zlatá bula (1356)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1310 → 1347 → 1356 → 1378."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – narozen v Praze (1316)",
      "Karel IV. korunován králem Čech (1347)",
      "Karel IV. zakládá Nové Město pražské (1348)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1316 → 1347 → 1348 → 1378."],
  },
  {
    question: "Seřaď lucemburské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců – nástup Lucemburků (1306)",
      "Jan Lucemburský vládl Čechám",
      "Karel IV. – Otec vlasti, korunován 1347",
      "Karel IV. zemřel, Václav IV. nastupuje (1378)",
    ],
    hints: ["1306 → Jan → Karel 1347 → smrt 1378."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský kralem Čech (1310)",
      "Karel IV. – Karlova univerzita (1348)",
      "Karel IV. – Zlatá bula (1356)",
      "Václav IV. nastupuje – začíná krize vedoucí k husitství (1378)",
    ],
    hints: ["1310 → 1348 → 1356 → 1378."],
  },
  {
    question: "Seřaď lucemburské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – kralem Čech (1310)",
      "Karel IV. korunován králem (1347)",
      "Karel IV. – Karlův most zahájen (1357)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1310 → 1347 → 1357 → 1378."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců (1306)",
      "Jan Lucemburský – kralem",
      "Karel IV. – Karlova univerzita (1348)",
      "Karlův most zahájen (1357)",
    ],
    hints: ["1306 → Jan → 1348 → 1357."],
  },
  {
    question: "Seřaď lucemburské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Karel IV. narozen (1316)",
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. – Karlova univerzita (1348)",
      "Zlatá bula (1356)",
    ],
    hints: ["1316 → Kresčak 1346 → 1348 → 1356."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – narozen (1316)",
      "Karel IV. korunován řím. císařem (1355)",
      "Karel IV. – Zlatá bula (1356)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1316 → 1355 → 1356 → 1378."],
  },
  {
    question: "Seřaď lucemburské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první Lucemburk v Čechách",
      "Karel IV. – korunován česky král (1347)",
      "Karel IV. – Karlova univerzita a Nové Město (1348)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["Jan → Karel 1347 → 1348 → 1378."],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(VSECHNY_TASKY).slice(0, 35);
}

export const LUCEMBURKOVEKARELIVAJEHODOBA: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-lucemburkove-karel-iv-a-jeho-doba",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-lucemburkove-karel-iv-a-jeho-doba",
    title: "Lucemburkové - Karel IV. a jeho doba",
    studentTitle: "Karel IV.",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš Karla IV. — Otce vlasti, co postavil a proč je tak slavný.",
    keywords: ["Karel IV.", "Lucemburkové", "Otec vlasti", "Karlova univerzita", "Karlův most", "Karlštejn", "1348"],
    goals: [
      "Znát přezdívku a přínos Karla IV.",
      "Vyjmenovat stavby a díla Karla IV.",
      "Vědět, kdy a co Karel IV. budoval",
      "Pochopit roli Zlaté buly",
    ],
    boundaries: ["Detailní genealogie Lucemburků není vyžadována", "Politika Říma do hloubky není cílem"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Karel IV. = Otec vlasti. 1348: Karlova univerzita + Nové Město pražské. 1357: Karlův most. 1356: Zlatá bula.",
      steps: [
        "Karel IV. 1316–1378 = Otec vlasti",
        "1347 = král český, 1355 = císař Říše",
        "Díla: univerzita (1348), Nové Město (1348), Karlův most (1357), Karlštejn",
        "Otec = Jan Lucemburský (padl u Kresčaku 1346)",
      ],
      commonMistake: "Žáci si pletou rok 1348 (univerzita) s rokem 1357 (Karlův most) — pamatuj: 1348 = univerzita.",
      example: "Karel IV.: Otec vlasti, česky krále 1347, císař 1355, Karlova univ. 1348, Karlův most 1357.",
    },
  },
];
