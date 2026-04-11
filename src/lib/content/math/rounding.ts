import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray } from "../helpers";

function genRounding(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 60; i++) {
    const roundTo = level === 1 ? 10 : 100;
    let num: number;
    if (roundTo === 10) {
      num = Math.floor(Math.random() * 90) + 5;
    } else {
      num = Math.floor(Math.random() * 900) + 50;
    }
    const rounded = Math.round(num / roundTo) * roundTo;
    const wrong1 = rounded + roundTo;
    const wrong2 = rounded - roundTo;
    const opts = shuffleArray([`${rounded}`, `${wrong1}`, `${wrong2 >= 0 ? wrong2 : rounded + 2 * roundTo}`]);
    tasks.push({
      question: `Zaokrouhli ${num} na ${roundTo === 10 ? "desítky" : "stovky"}:`,
      correctAnswer: `${rounded}`,
      options: [...new Set(opts)].slice(0, 3),
      solutionSteps: [
        `Podívej se na číslo ${num}.`,
        roundTo === 10
          ? `Podívej se na číslici jednotek (${num % 10}). Je ${num % 10 >= 5 ? "5 nebo víc → zaokrouhluj nahoru" : "méně než 5 → zaokrouhluj dolů"}.`
          : `Podívej se na číslici desítek (${Math.floor((num % 100) / 10)}). Je ${Math.floor((num % 100) / 10) >= 5 ? "5 nebo víc → zaokrouhluj nahoru" : "méně než 5 → zaokrouhluj dolů"}.`,
        `Výsledek: ${rounded}.`,
      ],
      hints: [roundTo === 10 ? `Podívej se na číslici jednotek čísla ${num} — je to ${num % 10}.` : `Podívej se na číslici desítek čísla ${num} — je to ${Math.floor((num % 100) / 10)}.`, `Je ta číslice 5 nebo víc? Zaokrouhli nahoru. Méně než 5? Dolů.`],
    });
  }
  return tasks;
}

const HELP_ROUNDING: HelpData = {
  hint: "Zaokrouhlování je jako najít nejbližší kulaté číslo. Podívej se na číslici vedle.",
  steps: [
    "Podívej se na číslici, podle které rozhoduješ (jednotky pro desítky, desítky pro stovky).",
    "Je ta číslice 5 nebo víc? → Zaokrouhli nahoru.",
    "Je ta číslice 4 nebo méně? → Zaokrouhli dolů.",
  ],
  commonMistake: "Pozor na číslici 5 — pětka zaokrouhluje NAHORU, ne dolů! Třeba 35 → na desítky → 40 (ne 30).",
  example: "Zaokrouhli 47 na desítky → podívej se na 7 (je víc než 5) → nahoru → 50.",
  visualExamples: [
    {
      label: "Zaokrouhlování na desítky",
      illustration: "       30 ─── 35 ─── 40 ─── 45 ─── 50\n                      ↑\n                     37\n\n37 je blíž ke 40 (číslice 7 ≥ 5) → zaokrouhlíme na 40",
    },
  ],
};

export const ROUNDING_TOPICS: TopicMetadata[] = [
  {
    id: "math-rounding",
    title: "Zaokrouhlování",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Zaokrouhlování",
    briefDescription: "Procvičíš si zaokrouhlování čísel na desítky a stovky.",
    keywords: ["zaokrouhlování", "zaokrouhli", "zaokrouhlení", "na desítky", "na stovky"],
    goals: ["Naučíš se zaokrouhlovat čísla na nejbližší desítku nebo stovku."],
    boundaries: ["Pouze kladná celá čísla", "Zaokrouhlování na desítky nebo stovky", "Žádná desetinná čísla"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 1,
    inputType: "select_one",
    generator: genRounding,
    helpTemplate: HELP_ROUNDING,
  },
];
