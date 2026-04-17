import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Úhly — 6. ročník ZŠ
 * RVP M-6-3
 *
 * Typy úloh:
 *   1) Druhy úhlů (select_one): pravý/ostrý/tupý/přímý podle velikosti
 *   2) Vrcholové úhly (number): rovné velikosti
 *   3) Vedlejší úhly (number): součet = 180°
 *   4) Součet úhlů v trojúhelníku (number): 180°
 */

function genTypeOfAngle(_level: number): PracticeTask {
  const size = Math.floor(Math.random() * 179) + 1; // 1°–179°
  let correct: string;
  if (size === 90) correct = "pravý";
  else if (size === 180) correct = "přímý";
  else if (size < 90) correct = "ostrý";
  else correct = "tupý";

  return {
    question: `Úhel má velikost ${size}°. Jakého druhu je?`,
    correctAnswer: correct,
    options: ["ostrý", "pravý", "tupý", "přímý"],
    solutionSteps: [
      `Pravý úhel = přesně 90°.`,
      `Ostrý úhel < 90°.`,
      `Tupý úhel > 90° a < 180°.`,
      `Přímý úhel = přesně 180°.`,
      `${size}° → ${correct}.`,
    ],
    hints: [
      `Porovnej s 90° (pravý úhel).`,
      `Menší než 90° = ostrý. Větší než 90° a menší než 180° = tupý.`,
    ],
  };
}

function genVrcholove(_level: number): PracticeTask {
  const a = 20 + Math.floor(Math.random() * 140); // 20°–159°
  return {
    question: `Úhel má velikost ${a}°. Jaká je velikost jeho VRCHOLOVÉHO úhlu?`,
    correctAnswer: String(a),
    options: [String(a), String(180 - a), String(90 - a), String(a + 10)].filter((o) => Number(o) > 0).slice(0, 4),
    solutionSteps: [
      `Vrcholové úhly jsou úhly „proti sobě“ při průsečíku dvou přímek.`,
      `Vrcholové úhly jsou VŽDY ROVNÉ.`,
      `Takže vrcholový úhel k ${a}° je také ${a}°.`,
    ],
    hints: [
      `Vrcholové úhly = ty, co se „dívají proti sobě“ přes průsečík.`,
      `Pravidlo: vrcholové úhly jsou ROVNÉ.`,
    ],
  };
}

function genVedlejsi(_level: number): PracticeTask {
  const a = 20 + Math.floor(Math.random() * 140);
  const result = 180 - a;
  return {
    question: `Úhel má velikost ${a}°. Jaká je velikost jeho VEDLEJŠÍHO úhlu?`,
    correctAnswer: String(result),
    options: [String(result), String(a), String(90 - a), String(360 - a)].filter((o) => Number(o) > 0).slice(0, 4),
    solutionSteps: [
      `Vedlejší úhly leží na JEDNÉ přímce.`,
      `Jejich součet je vždy 180° (přímý úhel).`,
      `Vedlejší úhel = 180° − ${a}° = ${result}°.`,
    ],
    hints: [
      `Vedlejší úhly dohromady tvoří přímku = 180°.`,
      `Odečti ${a} od 180.`,
    ],
  };
}

function genTriangleAngle(_level: number): PracticeTask {
  const a = 20 + Math.floor(Math.random() * 100);
  const b = 20 + Math.floor(Math.random() * (160 - a));
  const c = 180 - a - b;
  return {
    question: `Trojúhelník má dva úhly ${a}° a ${b}°. Jaký je třetí úhel?`,
    correctAnswer: String(c),
    options: [String(c), String(a + b), String(180 - a), String(90 - a)].filter((o) => Number(o) > 0 && Number(o) < 180).slice(0, 4),
    solutionSteps: [
      `Součet všech úhlů v trojúhelníku = 180°.`,
      `Třetí úhel = 180° − ${a}° − ${b}° = ${c}°.`,
    ],
    hints: [
      `Pravidlo: součet úhlů v trojúhelníku je VŽDY 180°.`,
      `Od 180 odečti oba zadané úhly.`,
    ],
  };
}

function genAngles6(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 18; i++) tasks.push(genTypeOfAngle(level));
  for (let i = 0; i < 12; i++) tasks.push(genVrcholove(level));
  for (let i = 0; i < 15; i++) tasks.push(genVedlejsi(level));
  for (let i = 0; i < 15; i++) tasks.push(genTriangleAngle(level));
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_ANGLES_6: HelpData = {
  hint:
    "Úhel je rozevření dvou polopřímek ze společného vrcholu. Měříme ho ve STUPNÍCH (°). Plný kruh = 360°, přímka = 180°, pravý úhel = 90°.",
  steps: [
    "Rozpoznej druh úhlu podle velikosti (ostrý <90°, pravý =90°, tupý >90°).",
    "Vrcholové úhly (proti sobě při průsečíku) jsou VŽDY rovné.",
    "Vedlejší úhly (na přímce) dají dohromady 180°.",
    "Součet úhlů v trojúhelníku je 180°.",
  ],
  commonMistake:
    "POZOR u vedlejších a vrcholových úhlů.\n• VEDLEJŠÍ — leží na jedné přímce, součet 180°.\n• VRCHOLOVÉ — proti sobě, jsou ROVNÉ.",
  example:
    "Úhel 60°:\n• Vedlejší = 180° − 60° = 120°\n• Vrcholový = 60° (stejný)\n\nTrojúhelník s úhly 40° a 70°:\n• Třetí úhel = 180° − 40° − 70° = 70°",
  visualExamples: [
    {
      label: "Druhy úhlů",
      illustration:
        "   ostrý (<90°)       pravý (=90°)       tupý (>90°)       přímý (180°)\n       │                  │                  │\n       ├─                 ├─                 ╲\n        ╲                  └─                   ╲\n         ╲                                        ╲─────────\n          ╲\n\n   30°                 90°                  130°              180°",
      conclusion: "Pravý úhel = čtvrtina plného kruhu. Pamatuj si jako roh místnosti.",
    },
    {
      label: "Vrcholové a vedlejší úhly",
      illustration:
        "Když se dvě přímky protnou:\n\n        β       │\n             α  │  α     ← vrcholové: α a α ROVNÉ\n  ─────────────┼─────────        β a β ROVNÉ\n             α  │  α\n        β       │       ← vedlejší: α + β = 180°\n\n  α + β = 180°\n  β = 180° − α",
      conclusion: "Vrcholové = rovné. Vedlejší = součet 180°.",
    },
    {
      label: "Součet úhlů v trojúhelníku",
      illustration:
        "       α\n      /\\\n     /  \\\n    /    \\\n   / β  γ \\\n  ───────────\n\n  α + β + γ = 180°  (VŽDY)\n\nPříklad: α=50°, β=70°, γ = ?\n  γ = 180 − 50 − 70 = 60°",
      conclusion: "Pravidlo pro jakýkoli trojúhelník — součet úhlů je 180°.",
    },
  ],
};

export const ANGLES_6_TOPICS: TopicMetadata[] = [
  {
    id: "math-angles-6",
    title: "Úhly",
    subject: "matematika",
    category: "Geometrie",
    topic: "Úhly",
    topicDescription:
      "Druhy úhlů, vrcholové a vedlejší úhly, součet úhlů v trojúhelníku.",
    briefDescription:
      "Naučíš se rozpoznat ostrý, pravý, tupý a přímý úhel. Spočítáš vrcholové a vedlejší úhly.",
    keywords: [
      "úhel",
      "úhly",
      "stupně",
      "pravý úhel",
      "ostrý úhel",
      "tupý úhel",
      "vrcholové",
      "vedlejší",
    ],
    goals: [
      "Rozpoznáš druh úhlu (ostrý, pravý, tupý, přímý).",
      "Vypočítáš vrcholový a vedlejší úhel.",
      "Aplikuješ součet úhlů v trojúhelníku = 180°.",
    ],
    boundaries: [
      "Pouze rovinná geometrie.",
      "Bez konstrukce (rýsování úhloměrem).",
      "Bez goniometrie (to je 9. ročník / SŠ).",
    ],
    gradeRange: [6, 7],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genAngles6,
    helpTemplate: HELP_ANGLES_6,
    contentType: "algorithmic",
    prerequisites: ["math-perimeter-4"],
    rvpReference: "M-6-3-01",
  },
];
