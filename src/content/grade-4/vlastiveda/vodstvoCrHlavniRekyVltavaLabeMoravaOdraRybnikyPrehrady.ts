import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Páry: vodní prvek ↔ klíčová informace
const VSECHNY_PARY: { left: string; right: string }[] = [
  { left: "Vltava", right: "nejdelší česká řeka (430 km)" },
  { left: "Labe", right: "pramení v Krkonoších, odtéká do Severního moře" },
  { left: "Morava", right: "ústí do Dunaje, odtéká do Černého moře" },
  { left: "Odra", right: "odtéká do Baltského moře přes Polsko" },
  { left: "Rožmberk", right: "největší rybník ČR (Třeboňsko)" },
  { left: "Přehrada Lipno", right: "největší vodní plocha ČR (na Vltavě)" },
  { left: "Přehrada Orlík", right: "největší vodní elektrárna ČR (na Vltavě)" },
  { left: "Třeboňsko", right: "proslulá oblast rybníků v jižních Čechách" },
  { left: "Berounka", right: "hlavní levý přítok Vltavy" },
  { left: "Máchovo jezero", right: "největší přirozené jezero v Čechách" },
  { left: "Šumava", right: "místo pramene Vltavy" },
  { left: "Mělník", right: "místo, kde Vltava ústí do Labe" },
  { left: "Severní moře", right: "moře, kam odtéká Labe" },
  { left: "Černé moře", right: "moře, kam odtéká Morava (přes Dunaj)" },
  { left: "Baltské moře", right: "moře, kam odtéká Odra" },
  { left: "Krkonoše", right: "místo pramene Labe" },
];

// Sady 4 párů – různé kombinace
const SADY: [number, number, number, number][] = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],
  [1, 4, 11, 14],
  [2, 7, 8, 13],
  [3, 6, 9, 12],
  [0, 6, 11, 13],
  [1, 7, 10, 12],
  [2, 4, 9, 15],
  [3, 5, 8, 14],
  [0, 7, 9, 14],
  [1, 6, 8, 15],
  [2, 5, 11, 12],
  [3, 4, 10, 13],
  [0, 3, 6, 9],
  [1, 2, 7, 12],
  [4, 5, 14, 15],
  [8, 11, 10, 13],
  [0, 2, 4, 14],
  [1, 3, 5, 15],
  [6, 7, 12, 13],
  [8, 9, 10, 11],
  [0, 1, 12, 13],
  [2, 3, 14, 15],
  [4, 7, 9, 11],
  [5, 6, 8, 10],
  [0, 11, 5, 14],
  [1, 10, 4, 15],
  [2, 9, 7, 13],
];

function gen(_level: number): PracticeTask[] {
  const tasks: PracticeTask[] = SADY.slice(0, 35).map((idxs, i) => {
    const pairs = idxs.map(idx => ({
      left: VSECHNY_PARY[idx].left,
      right: VSECHNY_PARY[idx].right,
    }));
    return {
      question: `Spoj vodní prvky s jejich popisem. (sada ${i + 1})`,
      correctAnswer: "match",
      pairs,
      hints: ["Vzpomeň si na mapu ČR — kde řeka pramení a kam teče."],
    } as PracticeTask;
  });
  return shuffle(tasks).slice(0, 35);
}

export const VODSTVOCRHLAVNIREKYVLTAVALABEMORAVAODRARYBNIKYPREHRADY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-vodstvo-cr-hlavni-reky-vltava-labe-morava-odra-rybniky-prehr",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-vodstvo-cr-hlavni-reky-vltava-labe-morava-odra-rybniky-prehr",
    title: "Vodstvo ČR - hlavní řeky (Vltava, Labe, Morava, Odra), rybníky, přehrady",
    studentTitle: "Řeky a voda ČR",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš hlavní řeky ČR, největší rybníky a přehrady.",
    keywords: ["Vltava", "Labe", "Morava", "Odra", "Rožmberk", "Lipno", "Třeboňsko", "přehrada", "rybník"],
    goals: [
      "Vyjmenovat hlavní řeky ČR a jejich směr odtoku",
      "Určit, do kterých moří ČR vody odtékají",
      "Znát největší rybníky a přehrady ČR",
      "Vysvětlit roli vodstva v hospodářství",
    ],
    boundaries: ["Hydrologické výpočty nejsou cílem", "Podrobné přítoky nejsou vyžadovány"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Nejdelší řeka ČR = Vltava (430 km, Praha, ústí do Labe u Mělníku). Největší rybník = Rožmberk (Třeboňsko).",
      steps: [
        "Vltava: pramení Šumava → Praha → Mělník → Labe → Severní moře",
        "Morava: odtéká do Dunaje → Černé moře",
        "Odra: odtéká do Polska → Baltské moře",
      ],
      commonMistake: "Žáci si pletou Lipno (největší vodní plocha) s Rožmberkem (největší rybník) — Lipno je přehrada!",
      example: "Vltava 430 km → nejdelší česká řeka; Rožmberk → největší rybník; Lipno → největší vodní plocha (přehrada)",
    },
  },
];
