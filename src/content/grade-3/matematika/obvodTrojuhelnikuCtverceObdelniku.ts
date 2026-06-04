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

  for (let i = 0; i < 40; i++) {
    const shape = i % 3;

    if (shape === 0) {
      // Čtverec: o = 4 × a
      const a = Math.floor(Math.random() * (level === 1 ? 8 : 15)) + 2;
      const o = 4 * a;
      tasks.push({
        question: `Čtverec má stranu ${a} cm. Jaký je jeho obvod?`,
        correctAnswer: `${o} cm`,
        options: shuffle([`${o} cm`, `${o + 4} cm`, `${o - 4} cm`, `${a * 2} cm`]),
        hints: ["Čtverec má 4 stejné strany.", `Obvod = 4 × strana = 4 × ${a}`],
        solutionSteps: [`Obvod čtverce = 4 × a = 4 × ${a} = ${o} cm`],
      });
    } else if (shape === 1) {
      // Obdélník: o = 2 × (a + b)
      const a = Math.floor(Math.random() * (level === 1 ? 8 : 15)) + 2;
      const b = Math.floor(Math.random() * (level === 1 ? 6 : 12)) + 1;
      const o = 2 * (a + b);
      tasks.push({
        question: `Obdélník má strany ${a} cm a ${b} cm. Jaký je jeho obvod?`,
        correctAnswer: `${o} cm`,
        options: shuffle([`${o} cm`, `${o + 2} cm`, `${a + b} cm`, `${2 * a + b} cm`]),
        hints: ["Obdélník má 2 stejné delší strany a 2 stejné kratší strany.", `Obvod = 2 × (${a} + ${b})`],
        solutionSteps: [`Obvod obdélníku = 2 × (a + b) = 2 × (${a} + ${b}) = 2 × ${a + b} = ${o} cm`],
      });
    } else {
      // Trojúhelník: o = a + b + c
      const a = Math.floor(Math.random() * (level === 1 ? 6 : 12)) + 2;
      const b = Math.floor(Math.random() * (level === 1 ? 6 : 12)) + 2;
      const c = Math.floor(Math.random() * (level === 1 ? 6 : 12)) + 2;
      const o = a + b + c;
      tasks.push({
        question: `Trojúhelník má strany ${a} cm, ${b} cm a ${c} cm. Jaký je jeho obvod?`,
        correctAnswer: `${o} cm`,
        options: shuffle([`${o} cm`, `${o + 1} cm`, `${o - 1} cm`, `${a + b} cm`]),
        hints: ["Obvod trojúhelníku = součet všech tří stran.", `${a} + ${b} + ${c} = ?`],
        solutionSteps: [`Obvod trojúhelníku = a + b + c = ${a} + ${b} + ${c} = ${o} cm`],
      });
    }
  }
  return tasks;
}

export const OBVODTROJUHELNIKUCTVERCEOBD: TopicMetadata[] = [
  {
    id: "g3-mat-obvod-trojuhelniku-ctverce-obdelniku",
    rvpNodeId: "g3-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-obvod-trojuhelniku-ctverce-obdelniku",
    title: "Obvod trojúhelníku, čtverce, obdélníku",
    studentTitle: "Obvod tvarů",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Spočítáš obvod trojúhelníku, čtverce a obdélníku.",
    keywords: ["obvod", "trojúhelník", "čtverec", "obdélník", "strany", "délka"],
    goals: [
      "Vypočítat obvod trojúhelníku jako součet tří stran.",
      "Vypočítat obvod čtverce: 4 × strana.",
      "Vypočítat obvod obdélníku: 2 × (délka + šířka).",
    ],
    boundaries: ["Celé délky stran v cm.", "Bez obsahu."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Obvod = délka ohraničující čáry. Sečti všechny strany dohromady.",
      steps: [
        "Trojúhelník: o = a + b + c",
        "Čtverec: o = 4 × a (4 stejné strany)",
        "Obdélník: o = 2 × (a + b) (2 páry stejných stran)",
      ],
      commonMistake: "U čtverce: o = a × a (obsah!) — ale obvod je 4 × a.",
      example: "Obdélník 5 cm × 3 cm: o = 2 × (5 + 3) = 2 × 8 = 16 cm.",
    },
  },
];
