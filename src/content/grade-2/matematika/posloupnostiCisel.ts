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

  for (let i = 0; i < 28; i++) {
    let step: number, start: number;

    if (level === 1) {
      step = Math.random() < 0.5 ? 10 : 5;
      start = Math.floor(Math.random() * 15) * (step === 10 ? 1 : 2);
    } else if (level === 2) {
      step = Math.random() < 0.5 ? 2 : -10;
      start = step > 0
        ? Math.floor(Math.random() * 45) * 2
        : Math.floor(Math.random() * 7) * 10 + 30;
    } else {
      const options = [-5, -2, 3, -3];
      step = options[Math.floor(Math.random() * options.length)];
      start = step < 0
        ? Math.floor(Math.random() * 10) * Math.abs(step) + Math.abs(step) * 5
        : Math.floor(Math.random() * 20);
    }

    const seq: number[] = [];
    for (let j = 0; j < 5; j++) {
      seq.push(start + step * j);
    }

    // Validate range
    if (seq.some(n => n < 0 || n > 100)) {
      i--;
      continue;
    }

    const missingPos = Math.floor(Math.random() * 3) + 1;
    const correct = seq[missingPos];
    const display = seq.map((n, idx) => idx === missingPos ? "___" : String(n));
    const question = `${display.join(", ")}`;

    const absStep = Math.abs(step);
    const d1 = correct + absStep;
    const d2 = correct - absStep >= 0 ? correct - absStep : correct + absStep * 2;
    const d3 = correct + (absStep === 1 ? 2 : 1);

    const opts = shuffle(
      [String(correct), String(d1), String(d2), String(d3)]
        .filter((v, idx, arr) => arr.indexOf(v) === idx && Number(v) >= 0 && Number(v) <= 100)
        .slice(0, 4)
    );

    tasks.push({
      question,
      correctAnswer: String(correct),
      options: opts,
      hints: [`Podívej se, o kolik se čísla mění každý krok.`],
      solutionSteps: [`Krok je ${step > 0 ? "+" : ""}${step}. Chybí ${correct}.`],
    });
  }

  return tasks;
}

export const POSLOUPNOSTICISEL: TopicMetadata[] = [
  {
    id: "g2-mat-posloupnosti",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-posloupnosti-cisel",
    title: "Posloupnosti čísel",
    studentTitle: "Řady čísel",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Najdeš chybějící číslo v řadě čísel.",
    keywords: ["posloupnost", "řada", "chybějící číslo", "vzor", "krok"],
    goals: [
      "Rozpoznat pravidlo číselné řady.",
      "Doplnit chybějící číslo do posloupnosti.",
      "Pracovat s kroky +2, +5, +10, -2, -5, -10.",
    ],
    boundaries: ["Čísla 0–100.", "Kroky ±2, ±3, ±5, ±10."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Najdi krok — o kolik se každé číslo mění.",
      steps: [
        "Odečti sousední čísla: 15 − 10 = 5 → krok je +5.",
        "Přidej krok k číslu před mezerou.",
        "Zkontroluj číslem za mezerou.",
      ],
      commonMistake: "Záměna rostoucí a klesající řady — dávej pozor na směr.",
      example: "5, 10, 15, ___, 25 → krok +5 → chybí 20.",
    },
  },
];
