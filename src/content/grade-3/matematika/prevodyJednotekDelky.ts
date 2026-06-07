import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Převodní tabulka délky
const PREVODY: { z: string; na: string; nasobek: number }[] = [
  { z: "cm", na: "mm", nasobek: 10 },
  { z: "dm", na: "cm", nasobek: 10 },
  { z: "m", na: "cm", nasobek: 100 },
  { z: "m", na: "dm", nasobek: 10 },
  { z: "km", na: "m", nasobek: 1000 },
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const prevody = level === 1
    ? PREVODY.slice(0, 3)
    : level === 2
      ? PREVODY.slice(0, 4)
      : PREVODY;

  for (let i = 0; i < 40; i++) {
    const prev = prevody[i % prevody.length];
    const isUp = i % 2 === 0; // nahoru (× nasobek) nebo dolů (÷ nasobek)

    if (isUp) {
      const n = Math.floor(Math.random() * 9) + 1;
      const correct = n * prev.nasobek;
      tasks.push({
        question: `${n} ${prev.z} = ? ${prev.na}`,
        correctAnswer: `${correct} ${prev.na}`,
        options: shuffle([
          `${correct} ${prev.na}`,
          `${correct + prev.nasobek} ${prev.na}`,
          `${correct - prev.nasobek > 0 ? correct - prev.nasobek : correct + 2 * prev.nasobek} ${prev.na}`,
          `${n} ${prev.na}`,
        ]),
        hints: [
          `Zapamatuj si: kolik ${prev.na} je v jednom ${prev.z}.`,
          "Na menší jednotku: vynásob počet koeficientem přepočtu.",
        ],
        solutionSteps: [
          `1 ${prev.z} = ${prev.nasobek} ${prev.na}`,
          `${n} × ${prev.nasobek} = ${correct}`,
          `${n} ${prev.z} = ${correct} ${prev.na}`,
        ],
      });
    } else {
      const n = (Math.floor(Math.random() * 9) + 1) * prev.nasobek;
      const correct = n / prev.nasobek;
      tasks.push({
        question: `${n} ${prev.na} = ? ${prev.z}`,
        correctAnswer: `${correct} ${prev.z}`,
        options: shuffle([
          `${correct} ${prev.z}`,
          `${correct + 1} ${prev.z}`,
          `${correct - 1 > 0 ? correct - 1 : correct + 2} ${prev.z}`,
          `${n} ${prev.z}`,
        ]),
        hints: [
          `Zapamatuj si: kolik ${prev.na} tvoří jeden ${prev.z}.`,
          "Na větší jednotku: vyděl počet malých jednotek přepočítávacím koeficientem.",
        ],
        solutionSteps: [
          `${prev.nasobek} ${prev.na} = 1 ${prev.z}`,
          `${n} ÷ ${prev.nasobek} = ${correct}`,
          `${n} ${prev.na} = ${correct} ${prev.z}`,
        ],
      });
    }
  }
  return tasks;
}

export const PREVODYJEDNOTEKDELKY: TopicMetadata[] = [
  {
    id: "g3-mat-prevody-delky",
    rvpNodeId: "g3-matematika-zavislosti-vztahy-a-prace-s-daty-mereni-a-jednotky-prevody-jednotek-delky-mm-cm-dm-m-km",
    title: "Převody jednotek délky (mm, cm, dm, m, km)",
    studentTitle: "Převody délky",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Měření a jednotky",
    briefDescription: "Převedeš milimetry, centimetry, decimetry, metry a kilometry.",
    keywords: ["mm", "cm", "dm", "m", "km", "převody", "délka", "jednotky délky"],
    goals: [
      "Znát vztahy: 1 cm = 10 mm, 1 dm = 10 cm, 1 m = 100 cm, 1 km = 1000 m.",
      "Převádět jednotky délky na větší i menší.",
      "Použít převody v praktických úlohách.",
    ],
    boundaries: ["Celá čísla, bez desetinných.", "Nezahrnuje sčítání různých jednotek."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Tabulka: 1 cm = 10 mm | 1 dm = 10 cm | 1 m = 100 cm = 10 dm | 1 km = 1000 m.",
      steps: [
        "Zapamatuj si: × 10 pro každý menší řád délky.",
        "Na větší jednotku → dělíme.",
        "Na menší jednotku → násobíme.",
      ],
      commonMistake: "1 m ≠ 10 cm — 1 m = 100 cm (ne 10, to je dm).",
      example: "3 m = ? cm: 1 m = 100 cm → 3 × 100 = 300 cm.",
    },
  },
];
