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
    const type = i % 3;

    if (type === 0) {
      // Násobení × 10
      const n = Math.floor(Math.random() * 9) + 1;
      const correct = n * 10;
      tasks.push({
        question: `${n} × 10 = ?`,
        correctAnswer: String(correct),
        options: shuffle([String(correct), String(correct + 10), String(correct - 10 > 0 ? correct - 10 : correct + 20), String(n + 10)]),
        hints: ["Přidej za číslo jednu nulu na konci.", "Násobení deseti posune každou číslici o jedno místo doleva — jednotky se stanou desítkami."],
        solutionSteps: [`${n} × 10 = ${correct} (přidáme nulu: ${n}0)`],
      });
    } else if (type === 1) {
      // Násobení × 100 (level 2+)
      const n = level >= 2 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 9) + 1;
      const mult = level >= 2 ? 100 : 10;
      const correct = n * mult;
      tasks.push({
        question: `${n} × ${mult} = ?`,
        correctAnswer: String(correct),
        options: shuffle([String(correct), String(correct + mult), String(correct + 10), String(n + mult)].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
        hints: [`Násobení ${mult} = přidáme ${mult === 10 ? "jednu nulu" : "dvě nuly"} za číslo.`],
        solutionSteps: [`${n} × ${mult} = ${correct}`],
      });
    } else {
      // Dělení se zbytkem (level 2+)
      if (level >= 2) {
        const delitel = Math.floor(Math.random() * 4) + 2; // 2–5
        const podil = Math.floor(Math.random() * 8) + 1;
        const zbytek = Math.floor(Math.random() * (delitel - 1));
        const delenec = delitel * podil + zbytek;
        const correct = `${podil} zbytek ${zbytek}`;
        tasks.push({
          question: `${delenec} ÷ ${delitel} = ? (může být zbytek)`,
          correctAnswer: correct,
          options: shuffle([
            correct,
            `${podil + 1} zbytek ${zbytek}`,
            `${podil} zbytek ${(zbytek + 1) % delitel}`,
            `${podil - 1 >= 0 ? podil - 1 : podil + 2} zbytek ${zbytek}`,
          ]),
          hints: [
            `Hledej největší násobek ${delitel}, který se vejde do ${delenec}.`,
            `Spočítej kolik celých násobků ${delitel} se vejde, pak odečti od ${delenec} — co zbyde je zbytek.`,
          ],
          solutionSteps: [
            `${delenec} ÷ ${delitel}`,
            `${delitel} × ${podil} = ${delitel * podil} (vejde se do ${delenec})`,
            `Zbytek: ${delenec} − ${delitel * podil} = ${zbytek}`,
            `Výsledek: ${podil} zbytek ${zbytek}`,
          ],
        });
      } else {
        // level 1: jen násobení 10
        const n = Math.floor(Math.random() * 9) + 1;
        const correct = n * 10;
        tasks.push({
          question: `Kolik je ${n} × 10?`,
          correctAnswer: String(correct),
          options: shuffle([String(correct), String(correct + 10), String(correct + 1), String(correct - 10 > 0 ? correct - 10 : correct + 20)]),
          hints: ["Násobení 10 — přidáme nulu."],
          solutionSteps: [`${n} × 10 = ${correct}`],
        });
      }
    }
  }
  return tasks;
}

export const NASOBENI10A100DELENISEZBYTKEM: TopicMetadata[] = [
  {
    id: "g3-mat-nasobeni-10-100-zbytkem",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-nasobilka-nasobeni-10-100-deleni-se-zbytkem-uvod",
    title: "Násobení 10, 100; dělení se zbytkem (úvod)",
    studentTitle: "×10, ×100 a zbytek",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobilka",
    briefDescription: "Naučíš se násobit 10 a 100 a dělit se zbytkem.",
    keywords: ["násobení 10", "násobení 100", "dělení se zbytkem", "zbytek", "podíl"],
    goals: [
      "Násobit číslo 10 a 100.",
      "Porozumět dělení se zbytkem.",
      "Ověřit výsledek: dělitel × podíl + zbytek = dělenec.",
    ],
    boundaries: ["Malá čísla (do 100 × 10).", "Úvod dělení se zbytkem — delitele 2–5."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Násobení 10: přidej nulu (3 × 10 = 30). Dělení se zbytkem: najdi největší násobek, který se vejde.",
      steps: [
        "× 10: číslo + nula na konci (7 × 10 = 70).",
        "× 100: číslo + dvě nuly (7 × 100 = 700).",
        "Dělení se zbytkem: najdi, kolikrát se dělitel vejde do dělenec.",
        "Zbytek = dělenec − (dělitel × podíl).",
        "Zkouška: dělitel × podíl + zbytek = dělenec.",
      ],
      commonMistake: "17 ÷ 5: 5×3=15, zbytek 17−15=2 → výsledek 3 zbytek 2 (ne 3 zbytek 7).",
      example: "23 ÷ 4: 4×5=20, zbytek 23−20=3 → výsledek 5 zbytek 3.",
    },
  },
];
