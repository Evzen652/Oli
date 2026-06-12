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
    let step: number, start: number, missingPos: number, seq: number[];

    if (level === 1) {
      step = 10;
      start = Math.floor(Math.random() * 9) * 10; // 0,10,20,...,80
      seq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    } else if (level === 2) {
      step = 5;
      start = Math.floor(Math.random() * 18) * 5; // 0,5,10,...,85
      seq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    } else {
      // L3: krok 2 nebo zpětně
      if (Math.random() < 0.5) {
        step = 2;
        start = Math.floor(Math.random() * 46) * 2; // even numbers
        seq = [start, start + 2, start + 4, start + 6, start + 8];
      } else {
        step = -2;
        start = Math.floor(Math.random() * 40) * 2 + 10;
        seq = [start, start - 2, start - 4, start - 6, start - 8];
      }
    }

    // Filter out-of-range
    if (seq.some(n => n < 0 || n > 100)) {
      i--;
      continue;
    }

    missingPos = Math.floor(Math.random() * 3) + 1; // positions 1,2,3 (not first/last)
    const correct = seq[missingPos];
    const display = seq.map((n, idx) => idx === missingPos ? "___" : String(n));
    const question = `Co chybí? ${display.join(", ")}`;

    const absStep = Math.abs(step);
    const d1 = correct + absStep;
    const d2 = correct - absStep >= 0 ? correct - absStep : correct + absStep * 2;
    const d3 = correct + 1;

    const opts = shuffle(
      [String(correct), String(d1), String(d2), String(d3)]
        .filter((v, idx, arr) => arr.indexOf(v) === idx && Number(v) >= 0 && Number(v) <= 100)
        .slice(0, 4)
    );

    tasks.push({
      question,
      correctAnswer: String(correct),
      options: opts,
      hints: [`Podívej se, o kolik se čísla mění.`],
      solutionSteps: [`Krok je ${step > 0 ? "+" : ""}${step}. Chybí ${correct}.`],
    });
  }

  return tasks;
}

export const CISELNAOSADO100: TopicMetadata[] = [
  {
    id: "g2-mat-ciselna-osa-100",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-ciselny-obor-0-100-ciselna-osa-do-100",
    title: "Číselná osa do 100",
    studentTitle: "Číselná osa",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–100",
    briefDescription: "Najdeš chybějící číslo na číselné ose.",
    keywords: ["číselná osa", "posloupnost", "chybějící číslo", "řada čísel"],
    goals: [
      "Orientovat se na číselné ose do 100.",
      "Určit chybějící číslo v řadě s krokem 2, 5 nebo 10.",
      "Poznat směr číselné osy (rostoucí i klesající).",
    ],
    boundaries: ["Pouze čísla 0–100.", "Kroky 2, 5 nebo 10."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Podívej se, o kolik se čísla mění — pak přičti nebo odečti.",
      steps: [
        "Najdi, o kolik se čísla mění (krok).",
        "Přičti nebo odečti krok k sousednímu číslu.",
        "Zkontroluj, zda sedí i druhý soused.",
      ],
      commonMistake: "Záměna směru — dávej pozor, zda čísla rostou nebo klesají.",
      example: "10, 20, ___, 40 → krok je +10 → chybí 30.",
    },
  },
];
