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
  // level 1: 6 a 7, level 2: 8 a 9, level 3: celá násobilka 6-10
  const tables = level === 1 ? [6, 7] : level === 2 ? [8, 9, 10] : [6, 7, 8, 9, 10];

  for (let i = 0; i < 40; i++) {
    const t = tables[i % tables.length];
    const n = Math.floor(Math.random() * 10) + 1;
    const correct = t * n;
    const d1 = correct + t;
    const d2 = correct - t > 0 ? correct - t : correct + t * 2;
    const d3 = correct + 1;

    tasks.push({
      question: `${t} × ${n} = ?`,
      correctAnswer: String(correct),
      options: shuffle([String(correct), String(d1), String(d2), String(d3)].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
      hints: [
        `${t} × ${n} = ${n}× přičteš ${t}.`,
        `Nebo: ${t} × ${n} = ${t} + ${t} + … (${n}×)`,
      ],
      solutionSteps: [
        `${t} × ${n} = ${correct}`,
        `(${Array.from({ length: n }, (_, i) => t).join(" + ")} = ${correct})`,
      ],
    });
  }
  return tasks;
}

export const NASOBILKA6789A10: TopicMetadata[] = [
  {
    id: "g3-mat-nasobilka-6-10",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-nasobilka-nasobilka-6-7-8-9-10-cela-mala-nasobilka",
    title: "Násobilka 6, 7, 8, 9, 10 (celá malá násobilka)",
    studentTitle: "Násobilka 6–10",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobilka",
    briefDescription: "Procvičíš násobilku 6, 7, 8, 9 a 10 zpaměti.",
    keywords: ["násobilka", "násobení", "6", "7", "8", "9", "10", "malá násobilka"],
    goals: [
      "Zpaměti ovládat násobilku 6 až 10.",
      "Rychle odpovídat na příklady typu 7 × 8.",
      "Rozpoznat výsledek v obou pořadích (8 × 7 = 7 × 8).",
    ],
    boundaries: ["Pouze násobilka 6–10.", "Nezahrnuje dělení ani velkou násobilku."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Každý příklad v násobilce se dá spočítat opakovaným sčítáním: 6 × 4 = 6+6+6+6 = 24.",
      steps: [
        "Nauč se násobilku 6, pak 7, pak 8, 9, 10.",
        "Pomáhá rytmické odříkávání: 6, 12, 18, 24, 30…",
        "Záměnnost: 6 × 7 = 7 × 6 — vyber tu, co znáš lépe.",
      ],
      commonMistake: "Záměna výsledků 7×8=56 a 8×8=64 — jsou blízko u sebe.",
      example: "7 × 8: 7+7=14, 14+7=21, 21+7=28, 28+7=35, 35+7=42, 42+7=49, 49+7=56. Výsledek: 56.",
    },
  },
];
