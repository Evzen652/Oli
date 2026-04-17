import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Lineární rovnice s jednou neznámou — 8. ročník ZŠ
 * Deterministický generátor. Konstrukce zaručuje, že řešení je vždy celé číslo.
 *
 * Typy úloh:
 *   Level 1: x + b = c          (jednokrokové)
 *   Level 2: ax + b = c         (dvoukrokové)
 *   Level 3: ax + b = cx + d    (rovnice s neznámou na obou stranách)
 */

function randSigned(maxAbs: number): number {
  const n = Math.floor(Math.random() * (maxAbs * 2 + 1)) - maxAbs;
  return n === 0 ? 1 : n;
}

function genSimple(_level: number): PracticeTask {
  const x = randSigned(10);
  const b = randSigned(10);
  const c = x + b;
  const bStr = b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`;

  const distractors = [x + 1, x - 1, c, -x, x + b]
    .filter((d) => d !== x)
    .slice(0, 3)
    .map(String);
  while (distractors.length < 3) distractors.push(String(x + distractors.length + 2));
  const options = [String(x), ...distractors].sort(() => Math.random() - 0.5);

  return {
    question: `Vyřeš rovnici: x ${bStr} = ${c}.  x = ?`,
    correctAnswer: String(x),
    options,
    solutionSteps: [
      `Chci mít na levé straně jen x.`,
      b >= 0
        ? `Odečti ${b} od obou stran: x = ${c} − ${b}.`
        : `Přičti ${Math.abs(b)} k oběma stranám: x = ${c} + ${Math.abs(b)}.`,
      `x = ${x}.`,
    ],
    hints: [
      `Ekvivalentní úprava: co uděláš vlevo, udělej i vpravo.`,
      `Osamotněte x — odečti nebo přičti, co tam navíc.`,
    ],
  };
}

function genTwoStep(_level: number): PracticeTask {
  const a = randSigned(6);
  const x = randSigned(8);
  const b = randSigned(10);
  const c = a * x + b;
  const bStr = b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`;
  const aStr = a === 1 ? "" : a === -1 ? "−" : `${a}`;

  const distractors = [x + 1, x - 1, x * 2, c / a, Math.floor((c - b) / (a + 1))]
    .filter((d) => d !== x && Number.isFinite(d))
    .slice(0, 3)
    .map(String);
  while (distractors.length < 3) distractors.push(String(x + distractors.length + 2));
  const options = [String(x), ...distractors].sort(() => Math.random() - 0.5);

  return {
    question: `Vyřeš rovnici: ${aStr}x ${bStr} = ${c}.  x = ?`,
    correctAnswer: String(x),
    options,
    solutionSteps: [
      b >= 0
        ? `Odečti ${b} od obou stran: ${aStr}x = ${c - b}.`
        : `Přičti ${Math.abs(b)} k oběma stranám: ${aStr}x = ${c - b}.`,
      a === 1 || a === -1
        ? a === -1
          ? `Vynásob obě strany −1: x = ${x}.`
          : `x = ${x}.`
        : `Vyděl obě strany ${a}: x = ${(c - b) / a} = ${x}.`,
    ],
    hints: [
      `Nejdřív se zbav konstanty ${b >= 0 ? `+${b}` : `−${Math.abs(b)}`}, pak koeficientu u x.`,
      `Postupuj opačně než sestavoval výraz.`,
    ],
  };
}

function genBothSides(_level: number): PracticeTask {
  // ax + b = cx + d,  x = (d - b) / (a - c); zajistíme, aby a ≠ c a x je celé
  let a = 0;
  let c = 0;
  while (a === c) {
    a = randSigned(5);
    c = randSigned(5);
  }
  const x = randSigned(8);
  const b = randSigned(10);
  const d = a * x + b - c * x; // tak aby rovnice vycházela

  const aStr = a === 1 ? "" : a === -1 ? "−" : `${a}`;
  const cStr = c === 1 ? "" : c === -1 ? "−" : `${c}`;
  const bStr = b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`;
  const dStr = d >= 0 ? `+ ${d}` : `− ${Math.abs(d)}`;

  const distractors = [x + 1, x - 1, x * 2, -x, (d - b)]
    .filter((v) => v !== x && Number.isFinite(v))
    .slice(0, 3)
    .map(String);
  while (distractors.length < 3) distractors.push(String(x + distractors.length + 2));
  const options = [String(x), ...distractors].sort(() => Math.random() - 0.5);

  return {
    question: `Vyřeš: ${aStr}x ${bStr} = ${cStr}x ${dStr}.  x = ?`,
    correctAnswer: String(x),
    options,
    solutionSteps: [
      `Převeď x na jednu stranu, konstanty na druhou.`,
      `Odečti ${cStr}x od obou stran: (${a - c})x ${bStr} = ${d}.`,
      b >= 0
        ? `Odečti ${b}: (${a - c})x = ${d - b}.`
        : `Přičti ${Math.abs(b)}: (${a - c})x = ${d - b}.`,
      `Vyděl ${a - c}: x = ${x}.`,
    ],
    hints: [
      `Nejprve dostaň všechna x na jednu stranu.`,
      `Pak konstanty na druhou a nakonec vyděl koeficientem u x.`,
    ],
  };
}

function genEquation(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  if (level === 1) {
    for (let i = 0; i < 45; i++) tasks.push(genSimple(level));
    for (let i = 0; i < 15; i++) tasks.push(genTwoStep(level));
  } else if (level === 2) {
    for (let i = 0; i < 20; i++) tasks.push(genSimple(level));
    for (let i = 0; i < 30; i++) tasks.push(genTwoStep(level));
    for (let i = 0; i < 10; i++) tasks.push(genBothSides(level));
  } else {
    for (let i = 0; i < 10; i++) tasks.push(genSimple(level));
    for (let i = 0; i < 20; i++) tasks.push(genTwoStep(level));
    for (let i = 0; i < 30; i++) tasks.push(genBothSides(level));
  }
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_EQUATION: HelpData = {
  hint:
    "Rovnice je rovnítko mezi dvěma výrazy. Cíl: najít číslo, které dosadíme za x, aby rovnice platila.",
  steps: [
    "Ujasni si, co je neznámá (většinou x).",
    "Použij ekvivalentní úpravy: co uděláš vlevo, udělej i vpravo.",
    "Osamotněte x — nejdřív se zbav konstant (přičti/odečti), pak koeficientu (vyděl).",
    "Zkontroluj dosazením výsledku do původní rovnice.",
  ],
  commonMistake:
    "Úprava jen na jedné straně rovnice. Správně: když odečteš 5 vlevo, odečti 5 i vpravo.",
  example:
    "2x + 6 = 14\n2x = 14 − 6 (odečteno 6 z obou stran)\n2x = 8\nx = 4 (vyděleno 2)\nKontrola: 2·4 + 6 = 14 ✓",
  visualExamples: [
    {
      label: "Rovnice jako váhy",
      illustration:
        "      2x + 6      =      14\n     ────────    ═══    ────────\n       levá            pravá\n\nCokoli odebereš z levé, musíš odebrat i z pravé,\naby váhy zůstaly v rovnováze.",
      conclusion: "Ekvivalentní úpravy = stejná operace na obou stranách.",
    },
  ],
};

export const EQUATION_TOPICS: TopicMetadata[] = [
  {
    id: "math-rovnice-8",
    title: "Lineární rovnice",
    subject: "matematika",
    category: "algebra",
    topic: "lineární rovnice",
    topicDescription: "Rovnice s jednou neznámou, ekvivalentní úpravy.",
    briefDescription: "Naučíš se řešit rovnice s jednou neznámou x.",
    keywords: ["rovnice", "lineární rovnice", "neznámá", "vyřeš", "x ="],
    goals: [
      "Vyřešíš rovnici tvaru x + b = c.",
      "Vyřešíš rovnici tvaru ax + b = c.",
      "Vyřešíš rovnici s neznámou na obou stranách.",
      "Použiješ ekvivalentní úpravy.",
    ],
    boundaries: [
      "Neprobíráme soustavy rovnic (9. ročník).",
      "Neprobíráme rovnice s neznámou ve jmenovateli (9. roč.).",
      "Neprobíráme kvadratické rovnice (SŠ).",
    ],
    gradeRange: [8, 9],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genEquation,
    helpTemplate: HELP_EQUATION,
  },
];
