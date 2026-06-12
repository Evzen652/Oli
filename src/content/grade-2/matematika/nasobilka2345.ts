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

  for (let i = 0; i < 35; i++) {
    const t = tables[i % tables.length];
    const n = Math.floor(Math.random() * 10) + 1;
    const correct = t * n;
    const d1 = correct + t;
    const d2 = correct - t > 0 ? correct - t : correct + t * 2;
    const d3 = correct + 1;

    const opts = shuffle(
      [String(correct), String(d1), String(d2), String(d3)]
        .filter((v, idx, arr) => arr.indexOf(v) === idx && Number(v) > 0)
        .slice(0, 4)
    );

    tasks.push({
      question: `${t} × ${n} = ?`,
      correctAnswer: String(correct),
      options: opts,
      hints: [`${t} × ${n} = ${Array.from({ length: n }, () => t).join(" + ")}`],
      solutionSteps: [
        `${t} × ${n} = ${correct}`,
      ],
    });
  }

  return tasks;
}

export const NASOBILKA2345: TopicMetadata[] = [
  {
    id: "g2-mat-nasobilka-2345",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-nasobeni-a-deleni-nasobeni-a-deleni-2-3-4-5-mala-nasobilka-uvod",
    title: "Násobilka 2, 3, 4, 5 (malá násobilka — úvod)",
    studentTitle: "Násobilka 2–5",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobení a dělení",
    briefDescription: "Procvičíš násobilku 2, 3, 4 a 5 zpaměti.",
    keywords: ["násobilka", "násobení", "2", "3", "4", "5", "krát"],
    goals: [
      "Zpaměti ovládat násobilku 2 a 3.",
      "Zpaměti ovládat násobilku 4 a 5.",
      "Rychle odpovídat na příklady z násobilky 2–5.",
    ],
    boundaries: ["Pouze násobilka 2–5.", "Nezahrnuje dělení ani násobilku 6–10."],
    gradeRange: [2, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Každý příklad jde spočítat opakovaným sčítáním: 3 × 4 = 3+3+3+3 = 12.",
      steps: [
        "Nauč se násobilku 2, pak 3, pak 4, pak 5.",
        "Pomáhá rytmické odříkávání: 2, 4, 6, 8, 10…",
        "Záměnnost: 3 × 4 = 4 × 3 — vyber tu, co znáš lépe.",
      ],
      commonMistake: "Záměna výsledků 4×3=12 a 3×4=12 — výsledek je stejný.",
      example: "5 × 4: 5+5=10, 10+5=15, 15+5=20. Výsledek: 20.",
    },
  },
];
