import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Conv = { z: string; na: string; nasobek: number; oblast: string };
const PREVODY: Conv[] = [
  // Hmotnost
  { z: "kg", na: "g", nasobek: 1000, oblast: "hmotnost" },
  // Objem
  { z: "l", na: "dl", nasobek: 10, oblast: "objem" },
  { z: "l", na: "cl", nasobek: 100, oblast: "objem" },
  // Čas
  { z: "min", na: "s", nasobek: 60, oblast: "čas" },
  { z: "h", na: "min", nasobek: 60, oblast: "čas" },
  { z: "den", na: "h", nasobek: 24, oblast: "čas" },
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const prevody = level === 1
    ? PREVODY.filter(p => p.oblast !== "čas" || p.z !== "den")
    : PREVODY;

  for (let i = 0; i < 40; i++) {
    const prev = prevody[i % prevody.length];
    const n = Math.floor(Math.random() * 9) + 1;
    const isUp = i % 2 === 0;

    if (isUp) {
      const correct = n * prev.nasobek;
      tasks.push({
        question: `${n} ${prev.z} = ? ${prev.na}`,
        correctAnswer: `${correct} ${prev.na}`,
        options: shuffle([
          `${correct} ${prev.na}`,
          `${correct + prev.nasobek} ${prev.na}`,
          `${correct - prev.nasobek > 0 ? correct - prev.nasobek : correct + prev.nasobek * 2} ${prev.na}`,
          `${n} ${prev.na}`,
        ]),
        hints: [`1 ${prev.z} = ${prev.nasobek} ${prev.na}`, `${n} × ${prev.nasobek} = ${correct}`],
        solutionSteps: [`1 ${prev.z} = ${prev.nasobek} ${prev.na}`, `${n} × ${prev.nasobek} = ${correct}`, `Výsledek: ${correct} ${prev.na}`],
      });
    } else {
      const nNa = n * prev.nasobek;
      tasks.push({
        question: `${nNa} ${prev.na} = ? ${prev.z}`,
        correctAnswer: `${n} ${prev.z}`,
        options: shuffle([
          `${n} ${prev.z}`,
          `${n + 1} ${prev.z}`,
          `${n - 1 > 0 ? n - 1 : n + 2} ${prev.z}`,
          `${nNa} ${prev.z}`,
        ]),
        hints: [`${prev.nasobek} ${prev.na} = 1 ${prev.z}`, `${nNa} ÷ ${prev.nasobek} = ${n}`],
        solutionSteps: [`${prev.nasobek} ${prev.na} = 1 ${prev.z}`, `${nNa} ÷ ${prev.nasobek} = ${n}`, `Výsledek: ${n} ${prev.z}`],
      });
    }
  }
  return tasks;
}

export const PREVODYJEDNOTEKHMOTNOSTIOBJEMCAS: TopicMetadata[] = [
  {
    id: "g3-mat-prevody-hmotnost-objem-cas",
    rvpNodeId: "g3-matematika-zavislosti-vztahy-a-prace-s-daty-mereni-a-jednotky-prevody-jednotek-hmotnosti-objemu-casu",
    title: "Převody jednotek hmotnosti, objemu, času",
    studentTitle: "Převody vah a času",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Měření a jednotky",
    briefDescription: "Převedeš kilogramy, litry a hodiny na menší jednotky.",
    keywords: ["kg", "g", "litr", "dl", "hodina", "minuta", "převody", "hmotnost", "objem", "čas"],
    goals: [
      "Znát: 1 kg = 1000 g, 1 l = 10 dl, 1 h = 60 min, 1 min = 60 s.",
      "Převádět jednotky hmotnosti, objemu a času.",
      "Použít převody v praktických situacích.",
    ],
    boundaries: ["Celá čísla, bez desetinných.", "Nezahrnuje složené časové výrazy (h + min)."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Tabulka: 1 kg = 1000 g | 1 l = 10 dl = 100 cl | 1 h = 60 min | 1 min = 60 s | 1 den = 24 h.",
      steps: [
        "Na menší jednotku → násobíme.",
        "Na větší jednotku → dělíme.",
        "Čas: hodiny × 60 = minuty, minuty × 60 = sekundy.",
      ],
      commonMistake: "1 l = 10 dl (ne 100 dl) — pozor na záměnu s centilitry (1 l = 100 cl).",
      example: "3 kg = ? g: 1 kg = 1000 g → 3 × 1000 = 3000 g.",
    },
  },
];
