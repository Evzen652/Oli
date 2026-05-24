import type { TopicMetadata, PracticeTask } from "@/lib/types";

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // level 1: obvod i obsah čtverce (a do 20)
  // level 2: obvod i obsah obdélníku (a,b do 50)
  // level 3: mix — dáno obvod nebo obsah, najdi chybějící rozměr

  for (let i = 0; i < 40; i++) {
    if (level === 1) {
      const a = Math.floor(Math.random() * 18) + 2; // 2–19
      const obvod = 4 * a;
      const obsah = a * a;
      const isObvod = Math.random() < 0.5;
      const correct = isObvod ? String(obvod) : String(obsah);
      const d1 = isObvod ? String(obvod + a) : String(obsah + a);
      const d2 = isObvod ? String(2 * a) : String(2 * a * a);
      const d3 = isObvod ? String(obvod - a) : String(obsah - a);
      tasks.push({
        question: isObvod
          ? `Čtverec se stranou ${a} cm. Jaký je jeho obvod?`
          : `Čtverec se stranou ${a} cm. Jaký je jeho obsah?`,
        correctAnswer: correct,
        options: shuffle([correct, d1, d2, d3].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
        hints: [
          isObvod ? `Obvod čtverce = 4 × a.` : `Obsah čtverce = a × a.`,
        ],
        solutionSteps: isObvod
          ? [`O = 4 × ${a} = ${obvod} cm`]
          : [`S = ${a} × ${a} = ${obsah} cm²`],
      });
    } else if (level === 2) {
      const a = Math.floor(Math.random() * 40) + 5;  // 5–44
      const b = Math.floor(Math.random() * 30) + 3;  // 3–32
      const obvod = 2 * (a + b);
      const obsah = a * b;
      const isObvod = Math.random() < 0.5;
      const correct = isObvod ? String(obvod) : String(obsah);
      tasks.push({
        question: isObvod
          ? `Obdélník ${a} cm × ${b} cm. Jaký je jeho obvod?`
          : `Obdélník ${a} cm × ${b} cm. Jaký je jeho obsah?`,
        correctAnswer: correct,
        options: shuffle([correct, String(isObvod ? obvod + b : obsah + a),
          String(isObvod ? a + b : a + b), String(isObvod ? obvod - a : obsah - b)]
          .filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
        hints: [
          isObvod ? `Obvod obdélníku = 2 × (a + b).` : `Obsah obdélníku = a × b.`,
        ],
        solutionSteps: isObvod
          ? [`O = 2 × (${a} + ${b}) = 2 × ${a + b} = ${obvod} cm`]
          : [`S = ${a} × ${b} = ${obsah} cm²`],
      });
    } else {
      // Dáno obvod → najdi stranu
      const isSquare = Math.random() < 0.5;
      if (isSquare) {
        const a = Math.floor(Math.random() * 20) + 5;
        const obvod = 4 * a;
        tasks.push({
          question: `Čtverec má obvod ${obvod} cm. Jak dlouhá je jeho strana?`,
          correctAnswer: String(a),
          options: shuffle([String(a), String(a + 2), String(a - 2), String(a * 2)]
            .filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
          hints: [`Strana čtverce = obvod ÷ 4.`],
          solutionSteps: [`a = ${obvod} ÷ 4 = ${a} cm`],
        });
      } else {
        const b = Math.floor(Math.random() * 15) + 3;
        const a = Math.floor(Math.random() * 20) + 5;
        const obvod = 2 * (a + b);
        tasks.push({
          question: `Obdélník má obvod ${obvod} cm a jednu stranu ${b} cm. Jak dlouhá je druhá strana?`,
          correctAnswer: String(a),
          options: shuffle([String(a), String(a + 3), String(a - 3), String(obvod - b)]
            .filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
          hints: [`Součet stran = obvod ÷ 2. Druhá strana = (obvod ÷ 2) − ${b}.`],
          solutionSteps: [`(${obvod} ÷ 2) − ${b} = ${obvod / 2} − ${b} = ${a} cm`],
        });
      }
    }
  }
  return tasks;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const OBVOD_OBSAH: TopicMetadata[] = [
  {
    id: "g4-mat-obvod-obsah-obdelnik-ctverec-4",
    rvpNodeId: "g4-matematika-geometrie-v-rovine-a-v-prostoru-obvod-a-obsah-obvod-a-obsah-obdelniku-a-ctverce",
    displayName: "Obvod a obsah",
    title: "Obvod a obsah obdélníku a čtverce",
    studentTitle: "Obvod a obsah",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Obvod a obsah",
    briefDescription: "Spočítáš obvod a obsah čtverce i obdélníku.",
    keywords: [
      "obvod", "obsah", "obdélník", "čtverec", "strana",
      "cm", "cm²", "vzorec obvodu", "vzorec obsahu",
    ],
    goals: [
      "Vypočítat obvod čtverce (O = 4a) a obdélníku (O = 2(a+b)).",
      "Vypočítat obsah čtverce (S = a²) a obdélníku (S = a×b).",
      "Určit neznámý rozměr ze zadaného obvodu.",
    ],
    boundaries: [
      "Pouze čtverec a obdélník.",
      "Nezahrnuje trojúhelník, kruh ani jiné tvary.",
      "Rozměry jsou celá čísla.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-trojuhelnik-druhy-stran-4", "g4-mat-rovnobezky-kolmice-4"],
    generator: gen,
    helpTemplate: {
      hint: "Obvod = součet všech stran. Obsah = délka × šířka. Čtverec: O = 4a, S = a×a. Obdélník: O = 2×(a+b), S = a×b.",
      steps: [
        "Urči, zda počítáš obvod nebo obsah.",
        "Čtverec: O = 4 × strana; S = strana × strana.",
        "Obdélník: O = 2 × (délka + šířka); S = délka × šířka.",
        "Dosaď číslice a spočítej.",
      ],
      commonMistake: "Záměna obvodu a obsahu — obvod je délka (cm), obsah je plocha (cm²).",
      example: "Obdélník 6 cm × 4 cm: O = 2×(6+4) = 20 cm; S = 6×4 = 24 cm².",
    },
  },
];
