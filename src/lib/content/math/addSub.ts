import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray } from "../helpers";

function genAddSub100(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 60; i++) {
    const isAdd = Math.random() > 0.5;
    let a: number, b: number, result: number;
    if (level === 1) {
      a = Math.floor(Math.random() * 40) + 10;
      b = Math.floor(Math.random() * 9) + 1;
      if (!isAdd && a < b) [a] = [a + b];
    } else {
      a = Math.floor(Math.random() * 80) + 10;
      b = Math.floor(Math.random() * 40) + 5;
    }
    if (isAdd) {
      result = a + b;
      if (result > 100) { result = a - b; }
    } else {
      if (a < b) [a, b] = [b, a];
      result = a - b;
    }
    const actualOp = a + b === result ? "+" : "-";
    const question = `${a} ${actualOp} ${b} =`;
    const solutionSteps = actualOp === "+"
      ? [`Sečti čísla: ${a} + ${b}.`, `Výsledek: ${result}.`]
      : [`Odečti: ${a} - ${b}.`, `Výsledek: ${result}.`];
    const distractors = new Set<number>();
    distractors.add(result + 10);
    distractors.add(result - 10);
    distractors.add(actualOp === "+" ? a - b : a + b);
    distractors.add(result + 1);
    distractors.add(result - 1);
    distractors.delete(result);
    const filtered = [...distractors].filter(d => d >= 0 && d <= 100);
    while (filtered.length < 3) filtered.push(result + filtered.length + 2);
    const picked = filtered.slice(0, 3);
    const options = [result, ...picked].sort(() => Math.random() - 0.5).map(String);
    tasks.push({ question, correctAnswer: `${result}`, options, solutionSteps, hints: [`Podívej se na znaménko — ${actualOp === "+" ? "sčítáš" : "odčítáš"}: ${a} ${actualOp} ${b}.`, `Zkus si rozložit ${a} na desítky a jednotky.`] });
  }
  return tasks;
}

const HELP_ADD_SUB_100: HelpData = {
  hint: "Sčítání je spojování čísel dohromady. Odčítání je ubírání. Představ si to třeba s bonbóny!",
  steps: [
    "Přečti si příklad — sčítáš (+) nebo odčítáš (−)?",
    "U sčítání: spoj obě čísla dohromady.",
    "U odčítání: od většího čísla uber menší.",
    "Zkontroluj výsledek — dává smysl?",
  ],
  commonMistake: "Pozor na přechod přes desítku! Třeba 28 + 5: nejdřív přidej 2 (na 30), pak ještě 3 → výsledek je 33.",
  example: "47 + 36 → 47 + 30 = 77, 77 + 6 = 83.",
  visualExamples: [
    {
      label: "Sčítání s přechodem přes desítku",
      illustration: "28 + 5 = ?\n\n28 + 2 = 30  (doplníš na celou desítku)\n30 + 3 = 33  (přidáš zbytek)\n\n🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬 🍬🍬🍬🍬🍬🍬🍬🍬 + 🍬🍬🍬🍬🍬\n= 33 bonbónů",
    },
  ],
};

export const ADD_SUB_TOPICS: TopicMetadata[] = [
  {
    id: "math-add-sub-100",
    title: "Sčítání a odčítání do 100",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Sčítání a odčítání do 100",
    briefDescription: "Procvičíš si sčítání a odčítání čísel do 100 — i s přechodem přes desítku.",
    keywords: ["sčítání", "odčítání", "plus", "mínus", "sčítání do 100", "odčítání do 100", "sečti", "odečti"],
    goals: ["Naučíš se rychle sčítat a odčítat čísla do 100."],
    boundaries: ["Pouze čísla 0–100", "Žádné násobení ani dělení", "Žádné záporné výsledky"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genAddSub100,
    helpTemplate: HELP_ADD_SUB_100,
  },
];
