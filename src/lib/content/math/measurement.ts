import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray } from "../helpers";

// ── HELPERS ──────────────────────────────────────────────────

function makeUnitDistractors(correct: number, factor: number): string[] {
  const set = new Set<number>();
  // Common mistakes: wrong factor (×10 vs ×100), off-by-one-zero, neighbor values
  set.add(correct * 10);
  set.add(Math.round(correct / 10) || 1);
  set.add(correct + factor);
  set.add(Math.max(1, correct - factor));
  set.add(correct + 1);
  set.add(Math.max(1, correct - 1));
  set.add(correct * 2);
  set.delete(correct);
  // Pick 3 unique distractors
  const distractors = [...set].filter(d => d > 0 && d !== correct).slice(0, 3);
  while (distractors.length < 3) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const d = Math.random() > 0.5 ? correct + offset : Math.max(1, correct - offset);
    if (d !== correct && !distractors.includes(d)) distractors.push(d);
  }
  return shuffleArray([...distractors.slice(0, 3).map(String), `${correct}`]);
}

// ── GENERATORS ──────────────────────────────────────────────

function genLengthConvertCombined(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const conversions: { from: string; to: string; factor: number; unit1: string; unit2: string }[] = [
    { from: "cm", to: "m a cm", factor: 100, unit1: "m", unit2: "cm" },
    { from: "mm", to: "cm a mm", factor: 10, unit1: "cm", unit2: "mm" },
  ];

  for (let i = 0; i < 60; i++) {
    const conv = conversions[i % conversions.length];
    const big = Math.floor(Math.random() * (level === 1 ? 3 : 8)) + 1;
    const small = Math.floor(Math.random() * (conv.factor - 1)) + 1;
    const total = big * conv.factor + small;

    if (i % 2 === 0) {
      // "120 cm = ? m ? cm" → ask for the total m part
      const question = `${total} ${conv.from} = ? ${conv.unit1} ${small} ${conv.unit2}. Kolik je ${conv.unit1}?`;
      tasks.push({
        question,
        correctAnswer: `${big}`,
        options: makeUnitDistractors(big, 1),
        solutionSteps: [
          `V 1 ${conv.unit1} je ${conv.factor} ${conv.from}.`,
          `${total} ÷ ${conv.factor} = ${big} zbytek ${small}.`,
          `Takže ${total} ${conv.from} = ${big} ${conv.unit1} ${small} ${conv.unit2}.`,
        ],
        hints: [
          `Kolik ${conv.from} má 1 ${conv.unit1}? Má ${conv.factor} ${conv.from}.`,
          `Rozděl ${total} na celé ${conv.unit1} a zbytek ${conv.unit2}.`,
        ],
      });
    } else {
      // "2 m 35 cm = ? cm"
      tasks.push({
        question: `${big} ${conv.unit1} ${small} ${conv.unit2} = ? ${conv.from}`,
        correctAnswer: `${total}`,
        options: makeUnitDistractors(total, conv.factor),
        solutionSteps: [
          `${big} ${conv.unit1} = ${big} × ${conv.factor} = ${big * conv.factor} ${conv.from}.`,
          `${big * conv.factor} + ${small} = ${total} ${conv.from}.`,
        ],
        hints: [
          `Nejdřív převeď ${conv.unit1} na ${conv.from}: 1 ${conv.unit1} = ${conv.factor} ${conv.from}.`,
          `Pak přičti zbylé ${conv.unit2}.`,
        ],
      });
    }
  }
  return shuffleArray(tasks);
}

function genLengthEstimateCompare(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const items: { name: string; lengthCm: number }[] = [
    { name: "tužka", lengthCm: 18 },
    { name: "pravítko", lengthCm: 30 },
    { name: "guma", lengthCm: 4 },
    { name: "sešit", lengthCm: 21 },
    { name: "pero", lengthCm: 14 },
    { name: "kniha", lengthCm: 25 },
    { name: "mobil", lengthCm: 15 },
    { name: "klíč", lengthCm: 7 },
    { name: "lžíce", lengthCm: 20 },
    { name: "vidlička", lengthCm: 19 },
    { name: "nůžky", lengthCm: 17 },
    { name: "pastelka", lengthCm: 12 },
  ];

  for (let i = 0; i < 60; i++) {
    const a = items[Math.floor(Math.random() * items.length)];
    let b = a;
    while (b.name === a.name) b = items[Math.floor(Math.random() * items.length)];

    const correct = a.lengthCm > b.lengthCm ? ">" : a.lengthCm < b.lengthCm ? "<" : "=";
    tasks.push({
      question: `${a.name} (${a.lengthCm} cm) ___ ${b.name} (${b.lengthCm} cm)`,
      correctAnswer: correct,
      options: shuffleArray([">", "<", "="]),
      solutionSteps: [
        `${a.name} má ${a.lengthCm} cm, ${b.name} má ${b.lengthCm} cm.`,
        `${a.lengthCm} ${correct} ${b.lengthCm}.`,
      ],
      hints: [
        `Porovnej čísla: ${a.lengthCm} a ${b.lengthCm}. Které je větší?`,
      ],
    });
  }
  return shuffleArray(tasks);
}

function genWeightUnitsBasic(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 60; i++) {
    if (i % 2 === 0) {
      const kg = Math.floor(Math.random() * (level === 1 ? 5 : 10)) + 1;
      const g = kg * 1000;
      tasks.push({
        question: `${kg} kg = ? g`,
        correctAnswer: `${g}`,
        options: makeUnitDistractors(g, 1000),
        solutionSteps: [
          `1 kg = 1 000 g.`,
          `${kg} kg = ${kg} × 1 000 = ${g} g.`,
        ],
        hints: [
          `V 1 kilogramu je 1 000 gramů.`,
          `Vynásob ${kg} × 1 000.`,
        ],
      });
    } else {
      const thousands = Math.floor(Math.random() * (level === 1 ? 5 : 10)) + 1;
      const g = thousands * 1000;
      tasks.push({
        question: `${g} g = ? kg`,
        correctAnswer: `${thousands}`,
        options: makeUnitDistractors(thousands, 1),
        solutionSteps: [
          `1 000 g = 1 kg.`,
          `${g} ÷ 1 000 = ${thousands} kg.`,
        ],
        hints: [
          `1 000 gramů je 1 kilogram.`,
          `Kolikrát se 1 000 vejde do ${g}?`,
        ],
      });
    }
  }
  return shuffleArray(tasks);
}

function genLengthWordProblems(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const templates = [
    (a: number, b: number) => ({
      q: `Šňůra má ${a} cm. Odřízneš ${b} cm. Kolik cm zbyde?`,
      ans: a - b,
      steps: [`${a} − ${b} = ${a - b} cm.`],
      hint: `Od celku odečti odříznutou část: ${a} − ${b}.`,
    }),
    (a: number, b: number) => ({
      q: `Máš dvě tyčky: ${a} cm a ${b} cm. Jak dlouhé budou dohromady?`,
      ans: a + b,
      steps: [`${a} + ${b} = ${a + b} cm.`],
      hint: `Sečti obě délky: ${a} + ${b}.`,
    }),
    (a: number, b: number) => ({
      q: `Cesta ze školy domů měří ${a} m. Zpět je to stejně daleko. Kolik m ujdeš celkem?`,
      ans: a * 2,
      steps: [`Tam i zpět: ${a} × 2 = ${a * 2} m.`],
      hint: `Jdeš tam a zpátky — vynásob vzdálenost dvěma.`,
    }),
    (a: number, b: number) => ({
      q: `Provaz má ${a} cm. Rozstříháš ho na ${b} stejných částí. Jak dlouhá bude jedna část?`,
      ans: a / b,
      steps: [`${a} ÷ ${b} = ${a / b} cm.`],
      hint: `Rozděl celkovou délku počtem částí: ${a} ÷ ${b}.`,
    }),
  ];

  for (let i = 0; i < 60; i++) {
    const tplIdx = i % templates.length;
    let a: number, b: number;
    if (tplIdx === 3) {
      // division — make it clean
      b = Math.floor(Math.random() * 4) + 2;
      a = b * (Math.floor(Math.random() * (level === 1 ? 8 : 15)) + 2);
    } else if (tplIdx === 0) {
      a = Math.floor(Math.random() * (level === 1 ? 80 : 150)) + 20;
      b = Math.floor(Math.random() * (a - 5)) + 1;
    } else if (tplIdx === 2) {
      a = Math.floor(Math.random() * (level === 1 ? 200 : 500)) + 50;
      b = 0; // unused
    } else {
      a = Math.floor(Math.random() * (level === 1 ? 50 : 100)) + 10;
      b = Math.floor(Math.random() * (level === 1 ? 50 : 100)) + 10;
    }
    const t = templates[tplIdx](a, b);
    const correct = t.ans;
    // Generate distractors
    const opts = new Set<number>([correct]);
    while (opts.size < 4) {
      const offset = Math.floor(Math.random() * 10) + 1;
      const d = Math.random() > 0.5 ? correct + offset : Math.max(1, correct - offset);
      opts.add(d);
    }
    tasks.push({
      question: t.q,
      correctAnswer: `${correct}`,
      options: shuffleArray([...opts].map(String)),
      solutionSteps: t.steps,
      hints: [t.hint],
    });
  }
  return shuffleArray(tasks);
}

function genVolumeUnitsBasic(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 60; i++) {
    if (i % 2 === 0) {
      const l = Math.floor(Math.random() * (level === 1 ? 5 : 10)) + 1;
      const ml = l * 1000;
      tasks.push({
        question: `${l} l = ? ml`,
        correctAnswer: `${ml}`,
        options: makeUnitDistractors(ml, 1000),
        solutionSteps: [
          `1 l = 1 000 ml.`,
          `${l} l = ${l} × 1 000 = ${ml} ml.`,
        ],
        hints: [
          `V 1 litru je 1 000 mililitrů.`,
          `Vynásob ${l} × 1 000.`,
        ],
      });
    } else {
      const thousands = Math.floor(Math.random() * (level === 1 ? 5 : 10)) + 1;
      const ml = thousands * 1000;
      tasks.push({
        question: `${ml} ml = ? l`,
        correctAnswer: `${thousands}`,
        options: makeUnitDistractors(thousands, 1),
        solutionSteps: [
          `1 000 ml = 1 l.`,
          `${ml} ÷ 1 000 = ${thousands} l.`,
        ],
        hints: [
          `1 000 mililitrů je 1 litr.`,
          `Kolikrát se 1 000 vejde do ${ml}?`,
        ],
      });
    }
  }
  return shuffleArray(tasks);
}

// ── HELP TEMPLATES ──────────────────────────────────────────

const HELP_LENGTH_CONVERT: HelpData = {
  hint: "Převody délek — zapamatuj si, kolik menších jednotek se vejde do větší.",
  steps: [
    "1 m = 100 cm, 1 cm = 10 mm.",
    "Pro převod do menší jednotky násobíš.",
    "Pro převod do větší jednotky dělíš.",
  ],
  commonMistake: "Pozor — nezaměňuj násobení a dělení! Když převádíš z metrů na centimetry, násobíš (×100), ne dělíš.",
  example: "2 m 35 cm = 235 cm (2 × 100 + 35 = 235).",
};

const HELP_LENGTH_ESTIMATE: HelpData = {
  hint: "Porovnáváš délky dvou věcí — podívej se na čísla a rozhodni, které je větší.",
  steps: [
    "Přečti si délku obou předmětů.",
    "Porovnej čísla: větší číslo = delší předmět.",
  ],
  commonMistake: "Pozor na jednotky — 1 m je víc než 50 cm!",
  example: "Tužka (18 cm) > guma (4 cm), protože 18 > 4.",
};

const HELP_WEIGHT: HelpData = {
  hint: "Kilogram a gram — 1 kg = 1 000 g. Převádíš násobením nebo dělením tisícem.",
  steps: [
    "1 kg = 1 000 g.",
    "kg → g: násobíš × 1 000.",
    "g → kg: dělíš ÷ 1 000.",
  ],
  commonMistake: "Pozor — 1 kg není 100 g, ale 1 000 g!",
  example: "3 kg = 3 000 g, 5 000 g = 5 kg.",
};

const HELP_WORD_PROBLEMS: HelpData = {
  hint: "Přečti si úlohu pozorně a rozhodni, jestli sčítáš, odčítáš, násobíš nebo dělíš.",
  steps: [
    "Najdi důležitá čísla v úloze.",
    "Rozhodni, jakou operaci použiješ (sčítání, odčítání…).",
    "Vypočítej a zkontroluj, jestli výsledek dává smysl.",
  ],
  commonMistake: "Pozor — čti pozorně! 'Kolik zbyde' = odčítání, 'Kolik celkem' = sčítání.",
  example: "Šňůra 100 cm, odřízneš 35 cm → zbyde 100 − 35 = 65 cm.",
};

const HELP_VOLUME: HelpData = {
  hint: "Litr a mililitr — 1 l = 1 000 ml. Převádíš stejně jako u kilogramů.",
  steps: [
    "1 l = 1 000 ml.",
    "l → ml: násobíš × 1 000.",
    "ml → l: dělíš ÷ 1 000.",
  ],
  commonMistake: "Pozor — 1 litr není 100 ml, ale 1 000 ml!",
  example: "2 l = 2 000 ml, 4 000 ml = 4 l.",
};

// ── TOPIC METADATA ──────────────────────────────────────────

export const MEASUREMENT_TOPICS: TopicMetadata[] = [
  {
    id: "math-length-convert-combined",
    title: "Převody mezi jednotkami",
    subject: "matematika",
    category: "Geometrie",
    topic: "Měření délky a odhad",
    briefDescription: "Převádíš centimetry na metry a milimetry na centimetry — a naopak.",
    keywords: ["převod", "cm na m", "mm na cm", "převody délek", "jednotky délky"],
    goals: ["Naučíš se převádět mezi jednotkami délky (cm ↔ m, mm ↔ cm)."],
    boundaries: ["Pouze cm↔m a mm↔cm", "Pouze celá čísla"],
    gradeRange: [3, 3],
    inputType: "select_one",
    generator: genLengthConvertCombined,
    helpTemplate: HELP_LENGTH_CONVERT,
  },
  {
    id: "math-length-estimate-compare",
    title: "Odhad a porovnávání délek",
    subject: "matematika",
    category: "Geometrie",
    topic: "Měření délky a odhad",
    briefDescription: "Porovnáváš délky běžných předmětů a rozhoduješ, který je delší.",
    keywords: ["odhad délky", "porovnání délek", "delší kratší", "odhad"],
    goals: ["Naučíš se porovnávat délky předmětů a odhadovat, co je delší."],
    boundaries: ["Pouze běžné předměty", "Pouze centimetry"],
    gradeRange: [3, 3],
    inputType: "select_one",
    generator: genLengthEstimateCompare,
    helpTemplate: HELP_LENGTH_ESTIMATE,
  },
  {
    id: "math-weight-units-basic",
    title: "Jednotky hmotnosti",
    subject: "matematika",
    category: "Geometrie",
    topic: "Měření délky a odhad",
    briefDescription: "Převádíš kilogramy na gramy a naopak.",
    keywords: ["hmotnost", "kg", "gram", "kilogram", "převod kg", "g na kg"],
    goals: ["Naučíš se převádět mezi kilogramy a gramy."],
    boundaries: ["Pouze kg ↔ g", "Pouze celé násobky 1 000"],
    gradeRange: [3, 3],
    inputType: "select_one",
    generator: genWeightUnitsBasic,
    helpTemplate: HELP_WEIGHT,
  },
  {
    id: "math-length-word-problems",
    title: "Slovní úlohy s délkami",
    subject: "matematika",
    category: "Geometrie",
    topic: "Měření délky a odhad",
    briefDescription: "Řešíš slovní úlohy, kde počítáš s délkami a vzdálenostmi.",
    keywords: ["slovní úloha", "délka", "vzdálenost", "kolik zbyde", "kolik celkem"],
    goals: ["Naučíš se řešit slovní úlohy s délkami a vzdálenostmi."],
    boundaries: ["Pouze celá čísla", "Pouze cm a m", "Základní operace"],
    gradeRange: [3, 3],
    inputType: "select_one",
    generator: genLengthWordProblems,
    helpTemplate: HELP_WORD_PROBLEMS,
  },
  {
    id: "math-volume-units-basic",
    title: "Objem — mililitr a litr",
    subject: "matematika",
    category: "Geometrie",
    topic: "Měření délky a odhad",
    briefDescription: "Převádíš litry na mililitry a naopak.",
    keywords: ["objem", "litr", "mililitr", "ml", "l na ml", "převod objemu"],
    goals: ["Naučíš se převádět mezi litry a mililitry."],
    boundaries: ["Pouze l ↔ ml", "Pouze celé násobky 1 000"],
    gradeRange: [3, 3],
    inputType: "select_one",
    generator: genVolumeUnitsBasic,
    helpTemplate: HELP_VOLUME,
  },
];
