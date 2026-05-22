import type { TopicMetadata, PracticeTask } from "@/lib/types";

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // level 1: průměr 3 čísel (do 20), celé výsledky
  // level 2: průměr 4–5 čísel (do 50), celé výsledky
  // level 3: mix + zpětná úloha (chybějící člen ze zadaného průměru)

  for (let i = 0; i < 40; i++) {
    if (level <= 2) {
      const count = level === 1 ? 3 : [4, 5][i % 2];
      const max = level === 1 ? 20 : 50;
      // Generujeme čísla tak, aby průměr byl celý
      let nums: number[];
      do {
        nums = Array.from({ length: count }, () => Math.floor(Math.random() * max) + 1);
      } while (nums.reduce((a, b) => a + b, 0) % count !== 0);
      const sum = nums.reduce((a, b) => a + b, 0);
      const avg = sum / count;

      tasks.push({
        question: `Jaký je průměr čísel: ${nums.join(", ")}?`,
        correctAnswer: String(avg),
        options: shuffle([String(avg), String(avg + 1), String(avg - 1), String(avg + 2)]
          .filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
        hints: [
          "Sečti všechna čísla.",
          "Vyděl součet počtem čísel.",
        ],
        solutionSteps: [
          `Součet: ${nums.join(" + ")} = ${sum}`,
          `Průměr = ${sum} ÷ ${count} = ${avg}`,
        ],
      });
    } else {
      // Zpětná úloha: průměr n čísel je X, chybí jedno
      const count = [3, 4][i % 2];
      const avg = Math.floor(Math.random() * 20) + 5; // průměr 5–24
      const knownNums = Array.from({ length: count - 1 }, () => Math.floor(Math.random() * (avg * 2)) + 1);
      const sumKnown = knownNums.reduce((a, b) => a + b, 0);
      const missing = avg * count - sumKnown;
      if (missing < 1 || missing > 99) { tasks.push(tasks[0] ?? { question: "", correctAnswer: "0", options: ["0"] }); continue; }

      tasks.push({
        question: `Průměr ${count} čísel je ${avg}. Znáš ${count - 1} z nich: ${knownNums.join(", ")}. Jaké je chybějící číslo?`,
        correctAnswer: String(missing),
        options: shuffle([String(missing), String(missing + 2), String(missing - 2), String(missing + avg)]
          .filter((v, idx, arr) => arr.indexOf(v) === idx && parseInt(v) > 0).slice(0, 4)),
        hints: [
          "Nejdřív spočítej celkový součet: průměr × počet čísel.",
          "Od celkového součtu odečti známá čísla — to je chybějící.",
        ],
        solutionSteps: [
          `Celkový součet = ${avg} × ${count} = ${avg * count}`,
          `${avg * count} − ${sumKnown} = ${missing}`,
        ],
      });
    }
  }
  return tasks;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ARITMETICKY_PRUMER: TopicMetadata[] = [
  {
    id: "g4-mat-aritmeticky-prumer-4",
    rvpNodeId: "g4-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-aritmeticky-prumer-uvod",
    title: "Aritmetický průměr",
    studentTitle: "Průměr",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Sečteš čísla, vydělíš jejich počtem a máš průměr.",
    keywords: [
      "průměr", "aritmetický průměr", "součet", "počet hodnot",
      "statistika", "data", "průměrná hodnota",
    ],
    goals: [
      "Vypočítat aritmetický průměr skupiny čísel.",
      "Porozumět průměru jako spravedlivemu rozdeleni.",
      "Určit chybějící člen skupiny ze zadaného průměru.",
    ],
    boundaries: [
      "Pouze celé výsledky průměru (bez desetinných čísel).",
      "Počet hodnot: 3–5.",
      "Nezahrnuje vážený průměr ani medián.",
    ],
    gradeRange: [4, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Průměr = (součet všech čísel) ÷ (počet čísel). Lze si to představit jako: kdybychom vše rozdělili rovnoměrně, kolik dostane každý?",
      steps: [
        "Sečti všechna čísla.",
        "Vyděl jejich počtem.",
        "Výsledek je průměr.",
      ],
      commonMistake: "Vydělení jen počtem čísel > 1 (žáci zapomenou zahrnout všechna čísla do součtu).",
      example: "Průměr čísel 4, 8, 6: součet = 18, počet = 3 → průměr = 18 ÷ 3 = 6.",
    },
  },
];
