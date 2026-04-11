import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray } from "../helpers";

function genMultiply(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const maxFactor = level === 1 ? 5 : level === 2 ? 8 : 10;
  for (let i = 0; i < 60; i++) {
    const a = Math.floor(Math.random() * maxFactor) + 1;
    const b = Math.floor(Math.random() * maxFactor) + 1;
    const correct = a * b;
    const distractors = new Set<number>();
    distractors.add(a * b + b);
    distractors.add(a * b - b);
    distractors.add(a + b);
    distractors.add(a * b + a);
    distractors.delete(correct);
    const filtered = [...distractors].filter(d => d > 0);
    while (filtered.length < 3) filtered.push(correct + filtered.length + 2);
    const picked = filtered.slice(0, 3);
    const options = [correct, ...picked].sort(() => Math.random() - 0.5).map(String);
    tasks.push({
      question: `${a} × ${b} =`,
      correctAnswer: `${correct}`,
      options,
      solutionSteps: [
        `Spočítej ${a} × ${b}.`,
        `To je jako ${a} skupinek po ${b}: ${Array(a).fill(b).join(" + ")} = ${correct}.`,
        `Výsledek: ${correct}.`,
      ],
      hints: [`Kolik je ${a} × ${b}? Představ si ${a} skupinek po ${b}.`, `Spočítej: ${Array(a).fill(b).join(" + ")} = ?`],
    });
  }
  return tasks;
}

const HELP_MULTIPLY: HelpData = {
  hint: "Násobení je opakované sčítání. 3 × 4 znamená: vezmi si 3 skupinky po 4.",
  steps: [
    "Přečti si příklad — kolik skupinek a kolik v každé?",
    "Spočítej to jako opakované sčítání, nebo si vzpomeň z násobilky.",
    "Zkontroluj výsledek.",
  ],
  commonMistake: "Pozor — 3 × 4 a 4 × 3 dá stejný výsledek (12), ale představ si to jinak: 3 skupinky po 4 vs. 4 skupinky po 3.",
  example: "6 × 7 = 42. To je jako 7 + 7 + 7 + 7 + 7 + 7 = 42.",
  visualExamples: [
    {
      label: "3 × 4 = tři skupinky po čtyřech",
      illustration: "🍎🍎🍎🍎  (první skupinka)\n🍎🍎🍎🍎  (druhá skupinka)\n🍎🍎🍎🍎  (třetí skupinka)\n\n3 × 4 = 4 + 4 + 4 = 12",
    },
  ],
};

export const MULTIPLY_TOPICS: TopicMetadata[] = [
  {
    id: "math-multiply",
    title: "Násobení",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Násobení a dělení",
    topicDescription: "Procvičíš si malou násobilku a dělení beze zbytku.",
    briefDescription: "Procvičíš si malou násobilku — násobení čísel 1 až 10.",
    keywords: ["násobilka", "násobení", "krát", "násobek", "malá násobilka", "násob"],
    goals: ["Naučíš se rychle násobit čísla z malé násobilky."],
    boundaries: ["Pouze čísla 1–10", "Žádné dělení", "Žádné záporné čísla"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genMultiply,
    helpTemplate: HELP_MULTIPLY,
  },
];
