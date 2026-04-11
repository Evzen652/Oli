import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray } from "../helpers";

function makePerimeterDistractors(correct: number, parts: number[]): string[] {
  const set = new Set<number>();
  if (parts.length === 1) {
    set.add(parts[0]);
    set.add(2 * parts[0]);
    set.add(3 * parts[0]);
  } else {
    const [a, b] = parts;
    set.add(a + b);
    set.add(4 * a);
    set.add(4 * b);
    set.add(a * b);
  }
  set.delete(correct);
  while (set.size < 3) {
    const offset = Math.floor(Math.random() * 6) + 1;
    const d = Math.random() > 0.5 ? correct + offset : Math.max(1, correct - offset);
    if (d !== correct) set.add(d);
  }
  const distractors = [...set].slice(0, 3);
  return shuffleArray([...distractors.map(String), `${correct}`]);
}

function genPerimeter(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 60; i++) {
    const isSquare = Math.random() > 0.5;
    if (isSquare) {
      const side = Math.floor(Math.random() * (level === 1 ? 8 : 15)) + 2;
      const perimeter = 4 * side;
      tasks.push({
        question: `Čtverec má stranu ${side} cm. Jaký je jeho obvod?`,
        correctAnswer: `${perimeter}`,
        options: makePerimeterDistractors(perimeter, [side]),
        solutionSteps: [
          `Čtverec má 4 stejné strany.`,
          `Obvod = 4 × strana = 4 × ${side} = ${perimeter} cm.`,
          `Výsledek: ${perimeter}.`,
        ],
        hints: [
          `Čtverec má 4 stejné strany — každá je ${side} cm.`,
          `Obvod čtverce spočítáš jako 4 × délka strany. Kolik je 4 × ${side}?`,
        ],
      });
    } else {
      const a = Math.floor(Math.random() * (level === 1 ? 8 : 12)) + 2;
      const b = Math.floor(Math.random() * (level === 1 ? 8 : 12)) + 2;
      const perimeter = 2 * (a + b);
      tasks.push({
        question: `Obdélník má strany ${a} cm a ${b} cm. Jaký je jeho obvod?`,
        correctAnswer: `${perimeter}`,
        options: makePerimeterDistractors(perimeter, [a, b]),
        solutionSteps: [
          `Obdélník má dvě delší a dvě kratší strany.`,
          `Obvod = 2 × (${a} + ${b}) = 2 × ${a + b} = ${perimeter} cm.`,
          `Výsledek: ${perimeter}.`,
        ],
        hints: [
          `Obdélník má dvě strany ${a} cm a dvě strany ${b} cm.`,
          `Obvod obdélníku = 2 × (${a} + ${b}). Kolik je ${a} + ${b}?`,
        ],
      });
    }
  }
  return tasks;
}

const HELP_PERIMETER: HelpData = {
  hint: "Obvod je celková délka okolo tvaru — jako kdybys obešel celý plot kolem zahrady.",
  steps: [
    "U čtverce: obvod = 4 × strana (protože má 4 stejné strany).",
    "U obdélníku: obvod = 2 × (delší strana + kratší strana).",
    "Sečti všechny strany dohromady.",
  ],
  commonMistake: "Pozor — u obdélníku nesčítej jen dvě strany! Má 4 strany: 2 delší a 2 kratší. Musíš započítat všechny.",
  example: "Obdélník 5 cm a 3 cm → obvod = 2 × (5 + 3) = 2 × 8 = 16 cm.",
  visualExamples: [
    {
      label: "Obvod čtverce a obdélníku",
      illustration: "Čtverec (strana 4 cm):\n┌──4──┐\n│     │ 4\n└──4──┘\nObvod = 4 + 4 + 4 + 4 = 16 cm\n\nObdélník (5 cm a 3 cm):\n┌──5──┐\n│     │ 3\n└──5──┘\nObvod = 5 + 3 + 5 + 3 = 16 cm",
    },
  ],
};

export const PERIMETER_TOPICS: TopicMetadata[] = [
  {
    id: "math-perimeter",
    title: "Obvod",
    subject: "matematika",
    category: "Geometrie",
    topic: "Obvod",
    briefDescription: "Spočítáš obvod čtverce a obdélníku — je to součet všech stran.",
    keywords: ["obvod", "obvod čtverce", "obvod obdélníku", "obvod tvaru", "délka okolo"],
    goals: ["Naučíš se spočítat obvod čtverce a obdélníku."],
    boundaries: ["Pouze čtverec a obdélník", "Pouze celá čísla", "Žádný obsah"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 1,
    inputType: "select_one",
    generator: genPerimeter,
    helpTemplate: HELP_PERIMETER,
  },
];
