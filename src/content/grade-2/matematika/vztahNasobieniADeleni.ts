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
  const tables = level === 1 ? [2, 3] : level === 2 ? [4, 5] : [2, 3, 4, 5];

  for (let i = 0; i < 30; i++) {
    const t = tables[i % tables.length];
    const n = Math.floor(Math.random() * 9) + 2;
    const product = t * n;

    let question: string, correct: string;

    if (level <= 2) {
      // Dělení: product ÷ t = n
      question = `${product} ÷ ${t} = ?`;
      correct = String(n);
      const hint = `Ptej se: ${t} × kolik = ${product}?`;
      const d1 = String(n + 1);
      const d2 = String(n - 1 > 0 ? n - 1 : n + 2);
      const d3 = String(t); // common confusion: swap t and n

      const opts = shuffle(
        [correct, d1, d2, d3].filter((v, idx, arr) => arr.indexOf(v) === idx && Number(v) > 0).slice(0, 4)
      );
      tasks.push({
        question,
        correctAnswer: correct,
        options: opts,
        hints: [hint],
        solutionSteps: [`${t} × ${n} = ${product}, takže ${product} ÷ ${t} = ${n}`],
      });
    } else {
      // L3: chybějící faktor
      question = `${t} × ? = ${product}`;
      correct = String(n);
      const d1 = String(n + 1);
      const d2 = String(n - 1 > 0 ? n - 1 : n + 2);
      const d3 = String(t);
      const opts = shuffle(
        [correct, d1, d2, d3].filter((v, idx, arr) => arr.indexOf(v) === idx && Number(v) > 0).slice(0, 4)
      );
      tasks.push({
        question,
        correctAnswer: correct,
        options: opts,
        hints: [`${product} ÷ ${t} = ?`],
        solutionSteps: [`${t} × ${n} = ${product}`],
      });
    }
  }

  return tasks;
}

export const VZTAHNASOBENIADELENI: TopicMetadata[] = [
  {
    id: "g2-mat-vztah-nasobeni-deleni",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-nasobeni-a-deleni-vztah-nasobeni-a-deleni",
    title: "Vztah násobení a dělení",
    studentTitle: "Násobení a dělení",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobení a dělení",
    briefDescription: "Pochopíš, jak násobení a dělení spolu souvisí.",
    keywords: ["dělení", "násobení", "vztah", "dělení s násobilkou"],
    goals: [
      "Pochopit dělení jako opak násobení.",
      "Řešit příklady dělení pomocí násobilky 2–5.",
      "Najít chybějící faktor v násobení.",
    ],
    boundaries: ["Dělenci do 50.", "Pouze tabulky 2–5."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Dělení je opak násobení — použij násobilku.",
      steps: [
        "Přečti příklad: 12 ÷ 3 = ?",
        "Ptáš se: 3 × ? = 12",
        "Z násobilky: 3 × 4 = 12, takže odpověď je 4.",
      ],
      commonMistake: "Záměna dělence a dělitele — dávej pozor na pořadí.",
      example: "20 ÷ 5 = ? → 5 × 4 = 20 → odpověď je 4.",
    },
  },
];
