import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Obvod geometrických útvarů — 4. ročník ZŠ
 * Rozšíření 3. ročníku (tam jen čtverec) o:
 *   • obdélník (2a + 2b)
 *   • trojúhelník (a + b + c)
 *   • nepravidelný čtyřúhelník
 *
 * Jednotky: cm, m (jednoduché, žádné převody).
 */

function genPerimeter4(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 60; i++) {
    const kind = Math.floor(Math.random() * 3); // 0=obdélník, 1=trojúhelník, 2=čtyřúhelník

    const maxSide = level === 1 ? 15 : level === 2 ? 30 : 50;
    const unit = Math.random() > 0.5 ? "cm" : "m";

    let question: string;
    let correctNum: number;
    let stepsPrefix: string[];
    let hints: string[];

    if (kind === 0) {
      // Obdélník
      const a = Math.floor(Math.random() * (maxSide - 3)) + 3;
      const b = Math.floor(Math.random() * (maxSide - 3)) + 3;
      if (a === b) continue; // vyloučím čtverec (to je 3. ročník)
      correctNum = 2 * a + 2 * b;
      question = `Obdélník má strany ${a} ${unit} a ${b} ${unit}. Jaký má obvod?`;
      stepsPrefix = [
        `Obdélník má 4 strany — dvě delší a dvě kratší.`,
        `Obvod = 2 × ${a} + 2 × ${b} = ${2 * a} + ${2 * b} = ${correctNum} ${unit}.`,
      ];
      hints = [
        `Obdélník má dvě dvojice stejných stran.`,
        `Obvod = 2 × a + 2 × b, nebo taky (a + b) × 2.`,
      ];
    } else if (kind === 1) {
      // Trojúhelník
      const a = Math.floor(Math.random() * (maxSide - 3)) + 3;
      const b = Math.floor(Math.random() * (maxSide - 3)) + 3;
      const c = Math.floor(Math.random() * (maxSide - 3)) + 3;
      correctNum = a + b + c;
      question = `Trojúhelník má strany ${a} ${unit}, ${b} ${unit} a ${c} ${unit}. Jaký má obvod?`;
      stepsPrefix = [
        `Trojúhelník má 3 strany.`,
        `Obvod = ${a} + ${b} + ${c} = ${correctNum} ${unit}.`,
      ];
      hints = [
        `Trojúhelník má 3 strany — sečti je všechny.`,
        `Obvod trojúhelníku = a + b + c.`,
      ];
    } else {
      // Obecný čtyřúhelník
      const a = Math.floor(Math.random() * (maxSide - 3)) + 3;
      const b = Math.floor(Math.random() * (maxSide - 3)) + 3;
      const c = Math.floor(Math.random() * (maxSide - 3)) + 3;
      const d = Math.floor(Math.random() * (maxSide - 3)) + 3;
      correctNum = a + b + c + d;
      question = `Čtyřúhelník má strany ${a}, ${b}, ${c} a ${d} ${unit}. Jaký má obvod?`;
      stepsPrefix = [
        `Čtyřúhelník má 4 strany.`,
        `Obvod = ${a} + ${b} + ${c} + ${d} = ${correctNum} ${unit}.`,
      ];
      hints = [
        `Sečti délky všech čtyř stran.`,
        `Obvod = a + b + c + d.`,
      ];
    }

    const distractors = new Set<number>();
    distractors.add(correctNum + 2);
    distractors.add(correctNum - 2);
    distractors.add(Math.floor(correctNum / 2));
    distractors.add(correctNum * 2);
    distractors.add(correctNum + 10);
    distractors.delete(correctNum);

    const filtered = [...distractors].filter((d) => d > 0).slice(0, 3).map((d) => `${d} ${unit}`);
    while (filtered.length < 3) filtered.push(`${correctNum + filtered.length + 3} ${unit}`);

    const options = [`${correctNum} ${unit}`, ...filtered].sort(() => Math.random() - 0.5);

    tasks.push({
      question,
      correctAnswer: `${correctNum} ${unit}`,
      options,
      solutionSteps: stepsPrefix,
      hints,
    });
  }
  return tasks;
}

const HELP_PERIMETER_4: HelpData = {
  hint:
    "Obvod je délka okolo útvaru — jako kdybys ho obešel. Sečti délky všech stran. Nic víc.",
  steps: [
    "Najdi všechny strany útvaru — jsou všechny uvedené?",
    "Napiš si je postupně (nebo rovnou sčítej).",
    "Sečti všechny strany dohromady.",
    "Nezapomeň uvést jednotku (cm, m) ve výsledku.",
  ],
  commonMistake:
    "POZOR na obdélník! Má dvě delší a dvě kratší strany. Obvod NENÍ jen a + b, ale 2 × a + 2 × b. Některé děti sečtou jen dvě strany.",
  example:
    "Obdélník 5 cm × 8 cm.\nObvod = 2 × 5 + 2 × 8 = 10 + 16 = 26 cm ✓\n\nTrojúhelník se stranami 4, 5, 7 cm.\nObvod = 4 + 5 + 7 = 16 cm ✓",
  visualExamples: [
    {
      label: "Obvod obdélníku",
      illustration:
        "     ┌─────────┐\n     │    8 cm │\n  5 cm│         │5 cm\n     │    8 cm │\n     └─────────┘\n\nObvod = 5 + 8 + 5 + 8 = 26 cm\n   nebo  = 2 × 5 + 2 × 8 = 26 cm",
      conclusion: "Obdélník: dvě dvojice stejných stran — použij vzorec 2a + 2b.",
    },
    {
      label: "Obvod trojúhelníku",
      illustration:
        "       △\n      / \\\n  5cm/   \\4cm\n    /     \\\n   /_______\\\n      6 cm\n\nObvod = 4 + 5 + 6 = 15 cm",
      conclusion: "Trojúhelník má 3 strany — sečti je všechny.",
    },
    {
      label: "Obvod vs obsah",
      illustration:
        "OBVOD = délka okolo (✏️→ čára)\nOBSAH = kolik místa uvnitř (🎨 výplň)\n\n┌───────┐\n│       │   ← obsah (ještě nedělám v 4. ročníku)\n│       │\n└───────┘\n ↑ okraj — to sčítám jako obvod",
      conclusion: "V 4. ročníku ještě počítáš POUZE obvod. Obsah přijde v 5. ročníku.",
    },
  ],
};

export const PERIMETER_4_TOPICS: TopicMetadata[] = [
  {
    id: "math-perimeter-4",
    title: "Obvod vícehranu",
    subject: "matematika",
    category: "Geometrie",
    topic: "Obvod vícehranu",
    topicDescription:
      "Výpočet obvodu obdélníku, trojúhelníku a obecného čtyřúhelníku.",
    briefDescription:
      "Naučíš se spočítat obvod — obdélníku (2a + 2b), trojúhelníku (a + b + c) a dalších útvarů.",
    keywords: [
      "obvod",
      "obdélník",
      "trojúhelník",
      "čtyřúhelník",
      "obvod obdélníku",
      "obvod trojúhelníku",
    ],
    goals: [
      "Spočítáš obvod obdélníku pomocí vzorce 2a + 2b.",
      "Spočítáš obvod trojúhelníku sečtením všech stran.",
      "Spočítáš obvod obecného čtyřúhelníku.",
      "Rozlišíš obvod od obsahu.",
    ],
    boundaries: [
      "Pouze celá čísla pro délky stran.",
      "Žádný obsah (to bude 5. ročník).",
      "Žádné kruhové útvary (π).",
    ],
    gradeRange: [4, 5],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genPerimeter4,
    helpTemplate: HELP_PERIMETER_4,
    contentType: "algorithmic",
    prerequisites: ["math-perimeter", "math-add-sub-100"],
    rvpReference: "M-5-3-02",
  },
];
