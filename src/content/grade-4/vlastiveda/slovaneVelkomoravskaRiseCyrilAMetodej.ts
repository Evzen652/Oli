import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Každý task = seřaď historické události Slovanů a VM Říše ve správném pořadí
const VSECHNY_TASKY: PracticeTask[] = [
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol. n. l.)",
      "Sámova říše – první slovanský stát (623–658)",
      "Cyril a Metoděj přišli na Moravu (863)",
      "Zánik Velkomoravské říše (906)",
    ],
    hints: ["6. stol. → Sámova říše 623 → Cyril 863 → zánik 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Vznik Velkomoravské říše (přibližně 830)",
      "Cyril a Metoděj – hlaholice (863)",
      "Zánik Velkomoravské říše – Maďaři (906)",
    ],
    hints: ["623 → 830 → 863 → 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623)",
      "Kníže Rastislav zve Cyrila a Metoděje na Moravu",
      "Zánik Velkomoravské říše (906)",
    ],
    hints: ["6. stol. → 623 → Rastislav a Cyril → zánik 906."],
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Germáni odcházejí na západ – Slované obsazují střední Evropu",
      "Sámova říše – 7. stol.",
      "Cyril a Metoděj přinášejí hlaholici (863)",
      "Zánik Velkomoravské říše (906)",
    ],
    hints: ["Stěhování národů → Sám 7. stol. → 863 → 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Cyril a Metoděj – hlaholice a staroslověnština (863)",
      "Zánik Velkomoravské říše (906)",
      "Přemyslovci sjednocují Čechy",
    ],
    hints: ["6. stol. → 863 → zánik 906 → Přemyslovci."],
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658) – porážka Avarů",
      "Vznik Velkomoravské říše (9. stol.)",
      "Cyril a Metoděj přišli na Moravu (863)",
      "Zánik Velkomoravské říše – nájezdy Maďarů (906)",
    ],
    hints: ["623 → VM Říše → 863 → 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy",
      "Rastislav zve Cyrila a Metoděje z Byzance (863)",
      "Cyril vytváří hlaholici pro slovanský jazyk",
      "Zánik Velkomoravské říše (906)",
    ],
    hints: ["Slované → Rastislav 863 → hlaholice → zánik 906."],
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše – první slovanský stát (623)",
      "Vznik VM Říše – Morava a Slovensko (9. stol.)",
      "Cyril a Metoděj – přeložili bibli do staroslověnštiny",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["623 → VM Říše → Cyril překlad → zánik 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – stěhování národů (5. stol.)",
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Cyril a Metoděj na Moravě (863)",
    ],
    hints: ["5. stol. → 6. stol. → 623 → 863."],
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623)",
      "Rastislav – kníže VM Říše, zve Cyrila a Metoděje",
      "Cyril a Metoděj – hlaholice a staroslověnština (863)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["623 → Rastislav → 863 → zánik 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované – příchod do střední Evropy (6. stol.)",
      "Sámova říše – 7. stol.",
      "Svätopluk – největší panovník VM Říše",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["6. stol. → 7. stol. → Svätopluk → zánik 906."],
  },
  {
    question: "Seřaď slovanské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Sámova říše – Sámo porází Avary (623)",
      "Vznik Velkomoravské říše (9. stol.)",
      "Rastislav zve Cyrila a Metoděje (863)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["623 → VM Říše → 863 → 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Cyril vytváří hlaholici pro slovanský jazyk (863)",
      "Cyril a Metoděj přeložili bibli do staroslověnštiny",
      "Metodějovi žáci vyhnáni z Moravy",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["Hlaholice 863 → překlad → vyhnání žáků → zánik 906."],
  },
  {
    question: "Seřaď slovanské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Rastislav – kníže VM Říše, zve Cyrila a Metoděje",
      "Přemyslovci sjednocují Čechy (po 906)",
    ],
    hints: ["6. stol. → 623 → Rastislav → Přemyslovci."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Germáni odcházejí – Slované přicházejí (6. stol.)",
      "Sámova říše (623–658)",
      "Cyril a Metoděj – hlaholice a křesťanství na Moravě (863)",
      "Zánik VM Říše – Přemyslovci sjednocují Čechy",
    ],
    hints: ["6. stol. → 623 → 863 → zánik VM a nástup Přemyslovců."],
  },
  {
    question: "Seřaď slovanské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Sámova říše (7. stol.) – první slovanský stát v naší oblasti",
      "Vznik VM Říše – Morava a Slovensko",
      "Cyril a Metoděj na Moravě (863)",
      "Zánik VM Říše – Maďarové (906)",
    ],
    hints: ["7. stol. → VM Říše → 863 → 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Cyril a Metoděj – hlaholice (863)",
      "Zánik VM Říše (906)",
      "Bořivoj – první pokřtěný přemyslovský kníže",
    ],
    hints: ["6. stol. → 863 → zánik 906 → Bořivoj."],
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Rastislav – kníže VM Říše (9. stol.)",
      "Cyril a Metoděj přišli na Moravu (863)",
      "Bořivoj přijal křesťanství z VM Říše",
    ],
    hints: ["623 → Rastislav → Cyril 863 → Bořivoj."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – Germáni migrují (5. stol.)",
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (7. stol.)",
      "Cyril a Metoděj – hlaholice (863)",
    ],
    hints: ["5. stol. → 6. stol. → 7. stol. → 863."],
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámo porází Avary – vznik Sámovy říše (623)",
      "Rastislav zve Cyrila a Metoděje z Byzance",
      "Cyril a Metoděj přeloží bibli do staroslověnštiny",
      "Zánik Velkomoravské říše – Maďaři (906)",
    ],
    hints: ["623 → Rastislav → překlad → zánik 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Vznik Velkomoravské říše (přibližně 830)",
      "Zánik VM Říše – nájezdy Maďarů (906)",
      "Přemyslovci sjednocují Čechy",
    ],
    hints: ["623 → 830 → zánik 906 → Přemyslovci."],
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše – první slovanský stát (623)",
      "Cyril a Metoděj – hlaholice (863)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["6. stol. → 623 → 863 → 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Vznik VM Říše (9. stol.)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["6. stol. → 623 → 9. stol. → zánik 906."],
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované – příchod do střední Evropy",
      "Sámo – první slovanský stát (623)",
      "Rastislav zve Cyrila a Metoděje (863)",
      "Zánik VM Říše (906)",
    ],
    hints: ["Příchod → 623 → 863 → zánik 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Cyril a Metoděj – hlaholice a staroslověnština (863)",
      "Zánik VM Říše – Maďarové (906)",
      "Přemyslovci sjednocují Čechy",
    ],
    hints: ["623 → 863 → zánik 906 → Přemyslovci."],
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Slované – příchod do střední Evropy (6. stol.)",
      "Rastislav pozval Cyrila a Metoděje z Byzance",
      "Cyril a Metoděj – hlaholice a křesťanství",
      "Zánik VM Říše (906)",
    ],
    hints: ["6. stol. → Rastislav → Cyril a Metoděj → zánik 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (7. stol.) – porážka Avarů",
      "Vznik VM Říše (9. stol.)",
      "Cyril a Metoděj na Moravě (863)",
      "Zánik VM Říše (906)",
    ],
    hints: ["7. stol. → VM Říše 9. stol. → 863 → 906."],
  },
  {
    question: "Seřaď slovanské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše – Sámo poráží Avary (623)",
      "Rastislav zve Cyrila a Metoděje (863)",
      "Bořivoj pokřtěn – přenos křesťanství do Čech",
    ],
    hints: ["6. stol. → 623 → 863 → Bořivoj."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658) – první slovanský stát",
      "Vznik VM Říše (9. stol.)",
      "Cyril a Metoděj – hlaholice a staroslověnština",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["623 → VM Říše → Cyril → zánik 906."],
  },
  {
    question: "Seřaď slovanské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Cyril a Metoděj – staroslověnština (863)",
      "Bořivoj – první pokřtěný přemyslovský kníže",
    ],
    hints: ["6. stol. → 623 → 863 → Bořivoj."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Vznik VM Říše – Rastislav, Svätopluk (9. stol.)",
      "Cyril a Metoděj – hlaholice (863)",
      "Zánik VM Říše – Přemyslovci sjednocují Čechy (906+)",
    ],
    hints: ["623 → VM Říše → 863 → zánik a nástup Přemyslovců."],
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Germáni odcházejí – Slované přicházejí (5.–6. stol.)",
      "Sámova říše (623)",
      "Rastislav zve Cyrila a Metoděje (863)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["5.–6. stol. → 623 → 863 → zánik 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše – první slovanský stát (623)",
      "VM Říše – kníže Svätopluk (9. stol.)",
      "Zánik VM Říše (906)",
    ],
    hints: ["6. stol. → 623 → Svätopluk → zánik 906."],
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Vznik VM Říše (9. stol.)",
      "Cyril a Metoděj – hlaholice a křesťanství (863)",
      "Zánik VM Říše (906) – nástup Přemyslovců",
    ],
    hints: ["623 → VM Říše → 863 → zánik 906."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – stěhování národů",
      "Slované přicházejí do střední Evropy",
      "Sámova říše (623–658)",
      "Cyril a Metoděj – hlaholice (863)",
    ],
    hints: ["Zánik Říma → Slované → 623 → 863."],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(VSECHNY_TASKY).slice(0, 35);
}

export const SLOVANEVELKOMORAVSKARISECYRILAMETODEJ: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-slovane-velkomoravska-rise-cyril-a-metodej",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-slovane-velkomoravska-rise-cyril-a-metodej",
    title: "Slované, Velkomoravská říše, Cyril a Metoděj",
    studentTitle: "Slované a Morava",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš, jak Slované přišli do Čech a kdo přinesl první slovanské písmo.",
    keywords: ["Slované", "Velkomoravská říše", "Cyril", "Metoděj", "hlaholice", "Rastislav", "Sámova říše"],
    goals: [
      "Popsat příchod Slovanů a způsob jejich života",
      "Vysvětlit vznik a zánik Velkomoravské říše",
      "Znát rok 863 a přínos Cyrila a Metoděje",
      "Vysvětlit hlaholici a staroslověnštinu",
    ],
    boundaries: ["Detailní genealogie panovníků není vyžadována", "Byzantská politika není cílem"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Slované přišli v 6. stol. Cyril a Metoděj = 863, hlaholice, staroslověnština. VM Říše zanikla 906.",
      steps: [
        "Sámova říše 623–658 = první slovanský stát",
        "VM Říše 9. stol. = Rastislav, Svätopluk",
        "863: Cyril a Metoděj → hlaholice",
        "906: zánik VM Říše → Přemyslovci sjednotí Čechy",
      ],
      commonMistake: "Žáci si pletou Rastislava a Svätopluka — Rastislav pozval Cyrila a Metoděje, Svätopluk byl jeho nástupce.",
      example: "Rastislav (860–870) pozval Cyrila a Metoděje z Byzance roku 863 → přinesli hlaholici.",
    },
  },
];
