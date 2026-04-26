import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Celá čísla (záporná + kladná) — 7. ročník ZŠ
 * Deterministický generátor — sčítání, odčítání, násobení, dělení celých čísel.
 */

function fmtSigned(n: number): string {
  return n < 0 ? `(${n})` : `${n}`;
}

function genAdd(level: number): PracticeTask {
  const range = level === 1 ? 10 : level === 2 ? 20 : 50;
  const a = Math.floor(Math.random() * range * 2) - range;
  const b = Math.floor(Math.random() * range * 2) - range;
  const result = a + b;

  const candidatePool = new Set<number>();
  candidatePool.add(a - b);                              // zaměněné + a -
  candidatePool.add(result + Math.max(1, Math.floor(range / 2)));
  candidatePool.add(result - Math.max(1, Math.floor(range / 2)));
  candidatePool.add(-result);
  candidatePool.add(result + 1);
  candidatePool.add(result - 1);
  candidatePool.add(result + 2);
  candidatePool.delete(result);
  const distractors = [...candidatePool].slice(0, 3).map(String);
  let pad = result + 3;
  while (distractors.length < 3) {
    const s = String(pad);
    if (!distractors.includes(s) && pad !== result) distractors.push(s);
    pad++;
  }

  const options = [String(result), ...distractors].sort(() => Math.random() - 0.5);

  return {
    question: `${fmtSigned(a)} + ${fmtSigned(b)} =`,
    correctAnswer: String(result),
    options,
    solutionSteps:
      a >= 0 && b >= 0
        ? [`${a} + ${b} = ${result}. Obě kladná → sečti normálně.`]
        : a < 0 && b < 0
        ? [`Obě záporná → sečti absolutní hodnoty: ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(result)}.`, `Výsledek má znaménko −: ${result}.`]
        : [`Různá znaménka → odečti menší absolutní hodnotu od větší: |${Math.abs(a)} − ${Math.abs(b)}| = ${Math.abs(result)}.`, `Znaménko podle většího: ${result}.`],
    hints: [
      `Sečti čísla podle pravidel znamének.`,
      `Stejná znaménka → sečti absolutní hodnoty, ponech znaménko. Různá → odečti, znaménko většího.`,
    ],
  };
}

function genMul(level: number): PracticeTask {
  const range = level === 1 ? 5 : level === 2 ? 10 : 15;
  const a = Math.floor(Math.random() * range * 2) - range;
  const b = Math.floor(Math.random() * range * 2) - range;
  if (a === 0 || b === 0) return genMul(level); // Avoid trivial zero
  const result = a * b;

  // Generuj 4 unikátní distraktory (deduplicate)
  const candidatePool = new Set<number>();
  candidatePool.add(-result);
  candidatePool.add(result + Math.abs(b));
  candidatePool.add(result - Math.abs(a));
  candidatePool.add(a + b);
  candidatePool.add(result + 1);
  candidatePool.add(result - 1);
  candidatePool.add(result + 2);
  candidatePool.delete(result);
  const distractors = [...candidatePool].slice(0, 3).map(String);
  let pad = result + 3;
  while (distractors.length < 3) {
    const s = String(pad);
    if (!distractors.includes(s) && pad !== result) distractors.push(s);
    pad++;
  }

  const options = [String(result), ...distractors].sort(() => Math.random() - 0.5);

  const signRule =
    (a < 0) === (b < 0)
      ? `Stejná znaménka (${a < 0 ? "−·−" : "+·+"}) → výsledek je kladný.`
      : `Různá znaménka (+·− nebo −·+) → výsledek je záporný.`;

  return {
    question: `${fmtSigned(a)} · ${fmtSigned(b)} =`,
    correctAnswer: String(result),
    options,
    solutionSteps: [
      signRule,
      `Vynásob absolutní hodnoty: ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(result)}.`,
      `Výsledek: ${result}.`,
    ],
    hints: [
      `Nejprve urči znaménko, pak vynásob absolutní hodnoty.`,
      `Mínus × mínus = plus. Mínus × plus = mínus.`,
    ],
  };
}

function genAbs(level: number): PracticeTask {
  const range = level === 1 ? 15 : level === 2 ? 50 : 100;
  const n = Math.floor(Math.random() * range * 2) - range;
  if (n === 0) return genAbs(level);
  const result = Math.abs(n);

  const distractors = [-result, result + 1, result - 1, n].filter((d) => d !== result && d !== undefined)
   .slice(0, 3)
   .map(String);
  while (distractors.length < 3) distractors.push(String(result + distractors.length + 5));
  const options = [String(result), ...distractors].sort(() => Math.random() - 0.5);

  return {
    question: `|${n}| =`,
    correctAnswer: String(result),
    options,
    solutionSteps: [
      `Absolutní hodnota = vzdálenost od nuly na číselné ose.`,
      `|${n}| = ${result} (vždy kladné číslo nebo 0).`,
    ],
    hints: [
      `Absolutní hodnota záporného čísla = opačné číslo.`,
      `|−5| = 5. |5| = 5. Vždy ≥ 0.`,
    ],
  };
}

function genInteger(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  // Mix: 50 % + , 35 % × , 15 % | |
  for (let i = 0; i < 30; i++) tasks.push(genAdd(level));
  for (let i = 0; i < 21; i++) tasks.push(genMul(level));
  for (let i = 0; i < 9; i++) tasks.push(genAbs(level));
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_INTEGER: HelpData = {
  hint:
    "Celá čísla zahrnují kladná, záporná a nulu. Představ si číselnou osu: vlevo záporná, vpravo kladná.",
  steps: [
    "Sčítání stejných znamének: sečti absolutní hodnoty, ponech znaménko.",
    "Sčítání různých znamének: odečti menší absolutní hodnotu od větší. Znaménko podle většího čísla.",
    "Odčítání: a − b = a + (−b).",
    "Násobení/dělení: stejná znaménka → kladný výsledek, různá → záporný.",
    "Absolutní hodnota: vzdálenost od 0, vždy ≥ 0.",
  ],
  commonMistake:
    "Chybně: (−3) + (−5) = 2. Správně: obě záporná → −(3+5) = −8. Nebo: (−4) · (−2) = −8. Správně: minus × minus = plus, tedy 8.",
  example:
    "(−3) + 5 = 2 (5 − 3, znaménko +)\n(−4) · (−2) = 8 (minus · minus = plus)\n|−7| = 7",
  visualExamples: [
    {
      label: "Číselná osa",
      illustration:
        "… −5 −4 −3 −2 −1  0  1  2  3  4  5 …\n         ←  záporná | kladná  →\n\nSčítání = posun po ose:\n (−3) + 5 = pozice 2 (posuneš se o 5 doprava)",
    },
    {
      label: "Znaménková pravidla při násobení",
      illustration: "(+) · (+) = (+)\n(−) · (−) = (+)\n(+) · (−) = (−)\n(−) · (+) = (−)",
      conclusion: "Stejná znaménka → plus, různá → minus.",
    },
  ],
};

export const INTEGER_TOPICS: TopicMetadata[] = [
  {
    id: "math-cela-cisla-7",
    title: "Celá čísla",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Celá čísla",
    topicDescription: "Záporná čísla, absolutní hodnota, operace s celými čísly.",
    briefDescription: "Naučíš se počítat se zápornými čísly — sčítání, odčítání, násobení a absolutní hodnota.",
    keywords: ["celá čísla", "záporná čísla", "minus", "znaménko", "absolutní hodnota", "záporné"],
    goals: [
      "Sečteš a odečteš čísla se znaménky.",
      "Vynásobíš a vydělíš záporná čísla.",
      "Určíš absolutní hodnotu čísla.",
    ],
    boundaries: [
      "Neprobíráme záporné zlomky (později).",
      "Neprobíráme komplexní čísla (SŠ).",
    ],
    gradeRange: [7, 8],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genInteger,
    helpTemplate: HELP_INTEGER,
  },
];
