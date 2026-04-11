import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray } from "../helpers";

function genDivide(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const maxFactor = level === 1 ? 5 : level === 2 ? 8 : 10;
  for (let i = 0; i < 60; i++) {
    const b = Math.floor(Math.random() * maxFactor) + 1;
    const result = Math.floor(Math.random() * maxFactor) + 1;
    const a = b * result;
    const distractors = new Set<number>();
    distractors.add(result + 1);
    distractors.add(result - 1);
    distractors.add(b);
    distractors.add(result + 2);
    distractors.delete(result);
    const filtered = [...distractors].filter(d => d > 0);
    while (filtered.length < 3) filtered.push(result + filtered.length + 2);
    const picked = filtered.slice(0, 3);
    const options = [result, ...picked].sort(() => Math.random() - 0.5).map(String);
    tasks.push({
      question: `${a} ÷ ${b} =`,
      correctAnswer: `${result}`,
      options,
      solutionSteps: [
        `Rozděl ${a} na ${b} stejných skupin.`,
        `${b} × ? = ${a} → ${b} × ${result} = ${a}.`,
        `Výsledek: ${result}.`,
      ],
      hints: [`Kolikrát se ${b} vejde do ${a}?`, `Zkus si říct: ${b} × ? = ${a}.`],
    });
  }
  return tasks;
}

const HELP_DIVIDE: HelpData = {
  hint: "Dělení je spravedlivé rozdělování. 12 ÷ 3 znamená: rozděl 12 věcí do 3 stejných skupin.",
  steps: [
    "Přečti si příklad — kolik věcí dělíš a na kolik skupin?",
    "Vzpomeň si na násobilku pozpátku: kolikrát × dělitel = dělenec?",
    "To číslo je výsledek.",
  ],
  commonMistake: "Dělení je opak násobení! Když nevíš 12 ÷ 3, zeptej se: 3 × kolik = 12? Odpověď je 4.",
  example: "20 ÷ 4 = 5. Protože 4 × 5 = 20.",
  visualExamples: [
    {
      label: "12 ÷ 3 = rozděl do 3 skupin",
      illustration: "🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬  (12 bonbónů)\n\nRozděl do 3 skupin:\n[🍬🍬🍬🍬] [🍬🍬🍬🍬] [🍬🍬🍬🍬]\n\nV každé skupině jsou 4 → 12 ÷ 3 = 4",
    },
  ],
};

export const DIVIDE_TOPICS: TopicMetadata[] = [
  {
    id: "math-divide",
    title: "Dělení",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Násobení a dělení",
    topicDescription: "Procvičíš si malou násobilku a dělení beze zbytku.",
    briefDescription: "Procvičíš si dělení beze zbytku — je to násobilka pozpátku.",
    keywords: ["dělení", "dělit", "děleno", "dělení beze zbytku", "rozděl"],
    goals: ["Naučíš se dělit čísla beze zbytku pomocí násobilky."],
    boundaries: ["Pouze dělení beze zbytku", "Čísla z malé násobilky", "Žádné záporné čísla"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genDivide,
    helpTemplate: HELP_DIVIDE,
  },
];
