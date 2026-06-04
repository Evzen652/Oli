import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const tables = level === 1 ? [2, 3, 4, 5] : level === 2 ? [2, 3, 4, 5, 6, 7] : [2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (let i = 0; i < 40; i++) {
    const t = tables[i % tables.length];
    const n = Math.floor(Math.random() * 10) + 1;
    const product = t * n;
    const isDiv = i % 3 === 2; // každý třetí příklad je dělení

    if (isDiv) {
      const d1 = n + 1 <= 10 ? n + 1 : n - 1;
      const d2 = n - 1 >= 1 ? n - 1 : n + 2;
      tasks.push({
        question: `${product} ÷ ${t} = ?`,
        correctAnswer: String(n),
        options: shuffle([String(n), String(d1), String(d2), String(n + 2 <= 10 ? n + 2 : 1)].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
        hints: [`Ptáme se: ${t} × ? = ${product}.`, `Vzpomeň si na násobilku ${t}.`],
        solutionSteps: [`${product} ÷ ${t} = ?`, `${t} × ${n} = ${product}`, `Výsledek: ${n}`],
      });
    } else {
      const d1 = product + t;
      const d2 = product - t > 0 ? product - t : product + t * 2;
      tasks.push({
        question: `${t} × ${n} = ?`,
        correctAnswer: String(product),
        options: shuffle([String(product), String(d1), String(d2), String(product + 1)].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
        hints: [`${t} × ${n} = opakované sčítání ${t}`, `Výsledek je v násobilce ${t}.`],
        solutionSteps: [`${t} × ${n} = ${product}`],
      });
    }
  }
  return tasks;
}

export const NASOBENIADELENIMALANASOBILKA: TopicMetadata[] = [
  {
    id: "g3-mat-nasobeni-deleni-mala-nasobilka",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-nasobilka-nasobeni-a-deleni-v-oboru-male-nasobilky",
    title: "Násobení a dělení v oboru malé násobilky",
    studentTitle: "Násobení a dělení",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobilka",
    briefDescription: "Procvičíš násobení a dělení v malé násobilce (do 10 × 10).",
    keywords: ["násobení", "dělení", "násobilka", "malá násobilka", "součin", "podíl"],
    goals: [
      "Zvládnout násobení v oboru malé násobilky.",
      "Zvládnout dělení jako opačnou operaci k násobení.",
      "Propojit násobení a dělení: 3 × 4 = 12 → 12 ÷ 3 = 4.",
    ],
    boundaries: ["Pouze malá násobilka (1–10).", "Bez zbytku."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Násobení a dělení jsou opačné operace: 4 × 3 = 12 → 12 ÷ 4 = 3 a 12 ÷ 3 = 4.",
      steps: [
        "Pro násobení: vybav si příslušnou násobilku.",
        "Pro dělení: přemysli, čím se dělí — hledáš chybějící číslo v násobilce.",
        "Zkouška: výsledek × dělitel musí dát dělenec.",
      ],
      commonMistake: "Záměna pořadí při dělení: 12 ÷ 4 ≠ 4 ÷ 12.",
      example: "24 ÷ 6 = ?: hledám 6 × ? = 24. Násobilka 6: 6×4=24. Výsledek: 4.",
    },
  },
];
