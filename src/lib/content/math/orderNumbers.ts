import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

function genOrderNumbers(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const count = level === 1 ? 4 : 5;
  const max = level === 1 ? 50 : 100;
  for (let i = 0; i < 60; i++) {
    const ascending = Math.random() > 0.5;
    const nums = new Set<number>();
    while (nums.size < count) nums.add(Math.floor(Math.random() * max) + 1);
    const sorted = [...nums].sort((a, b) => ascending ? a - b : b - a);
    tasks.push({
      question: ascending ? "Seřaď čísla od nejmenšího po největší:" : "Seřaď čísla od největšího po nejmenší:",
      correctAnswer: sorted.join(","),
      items: [...nums].map(String),
      solutionSteps: [
        ascending ? "Najdi nejmenší číslo a dej ho na první místo." : "Najdi největší číslo a dej ho na první místo.",
        `Správné pořadí: ${sorted.join(", ")}.`,
      ],
      hints: [ascending ? `Najdi nejmenší z čísel ${[...nums].join(", ")} a dej ho na začátek.` : `Najdi největší z čísel ${[...nums].join(", ")} a dej ho na začátek.`, `Pak pokračuj s dalšími čísly stejným způsobem.`],
    });
  }
  return tasks;
}

const HELP_ORDER_NUMBERS: HelpData = {
  hint: "Čísla seřadíš tak, že najdeš nejmenší (nebo největší) a dáš ho na první místo. Pak hledáš další.",
  steps: [
    "Podívej se na všechna čísla.",
    "Najdi nejmenší (nebo největší, podle zadání).",
    "Dej ho na první místo a opakuj s ostatními.",
  ],
  commonMistake: "Pozor — čti zadání! Někdy řadíš od nejmenšího, jindy od největšího. To je velký rozdíl!",
  example: "Seřaď od nejmenšího: 42, 15, 88, 3 → 3, 15, 42, 88.",
  visualExamples: [
    {
      label: "Řazení od nejmenšího po největší",
      illustration: "Čísla: 42  15  88  3\n\n1. Nejmenší je 3 → [3]\n2. Pak 15 → [3, 15]\n3. Pak 42 → [3, 15, 42]\n4. Pak 88 → [3, 15, 42, 88] ✅",
    },
  ],
};

export const ORDER_NUMBERS_TOPICS: TopicMetadata[] = [
  {
    id: "math-order-numbers",
    title: "Řazení čísel",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Řazení čísel",
    briefDescription: "Seřadíš čísla od nejmenšího po největší (nebo naopak) přetažením.",
    keywords: ["řazení čísel", "seřaď", "od nejmenšího", "od největšího", "pořadí čísel"],
    goals: ["Naučíš se seřadit čísla podle velikosti — od nejmenšího nebo od největšího."],
    boundaries: ["Pouze kladná celá čísla do 100", "Žádné počítání"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 1,
    inputType: "drag_order",
    generator: genOrderNumbers,
    helpTemplate: HELP_ORDER_NUMBERS,
  },
];
