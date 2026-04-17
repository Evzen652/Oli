import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * NSD (Největší společný dělitel) a NSN (Nejmenší společný násobek) — 6. ročník
 * RVP M-6-1
 *
 * Input: number
 */

function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function divisorsOf(n: number): number[] {
  const result: number[] = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) result.push(i);
  return result;
}

function genNSD(level: number): PracticeTask {
  const maxNum = level === 1 ? 20 : level === 2 ? 40 : 80;
  const a = 2 + Math.floor(Math.random() * (maxNum - 2));
  const b = 2 + Math.floor(Math.random() * (maxNum - 2));
  const result = gcd(a, b);

  const divA = divisorsOf(a);
  const divB = divisorsOf(b);
  const common = divA.filter((d) => divB.includes(d));

  const distractors = new Set<number>();
  distractors.add(result + 1);
  distractors.add(Math.max(1, result - 1));
  distractors.add(a);
  distractors.add(b);
  distractors.add(a * b);
  distractors.delete(result);

  const filtered = [...distractors].filter((d) => d > 0).slice(0, 3).map(String);
  while (filtered.length < 3) filtered.push(String(result + filtered.length + 2));
  const options = [String(result), ...filtered].sort(() => Math.random() - 0.5);

  return {
    question: `Najdi NSD (největší společný dělitel) čísel ${a} a ${b}.`,
    correctAnswer: String(result),
    options,
    solutionSteps: [
      `Dělitelé ${a}: ${divA.join(", ")}.`,
      `Dělitelé ${b}: ${divB.join(", ")}.`,
      `Společní dělitelé: ${common.join(", ")}.`,
      `Největší z nich: ${result}.`,
    ],
    hints: [
      `Najdi dělitele obou čísel. Co mají společného?`,
      `NSD = největší číslo, které dělí OBA beze zbytku.`,
    ],
  };
}

function genNSN(level: number): PracticeTask {
  const maxNum = level === 1 ? 12 : level === 2 ? 20 : 30;
  const a = 2 + Math.floor(Math.random() * (maxNum - 2));
  const b = 2 + Math.floor(Math.random() * (maxNum - 2));
  const result = lcm(a, b);

  // Násobky pro vysvětlení
  const multA: number[] = [];
  for (let i = 1; multA.length < 5; i++) multA.push(a * i);
  const multB: number[] = [];
  for (let i = 1; multB.length < 5; i++) multB.push(b * i);

  const distractors = new Set<number>();
  distractors.add(a + b);
  distractors.add(a * b); // častá chyba: NSN = součin
  distractors.add(Math.max(a, b));
  distractors.add(result + a);
  distractors.delete(result);

  const filtered = [...distractors].filter((d) => d > 0).slice(0, 3).map(String);
  while (filtered.length < 3) filtered.push(String(result + filtered.length + 3));
  const options = [String(result), ...filtered].sort(() => Math.random() - 0.5);

  return {
    question: `Najdi NSN (nejmenší společný násobek) čísel ${a} a ${b}.`,
    correctAnswer: String(result),
    options,
    solutionSteps: [
      `Násobky ${a}: ${multA.join(", ")}, ...`,
      `Násobky ${b}: ${multB.join(", ")}, ...`,
      `První SPOLEČNÝ násobek: ${result}.`,
    ],
    hints: [
      `Vypiš si prvních pár násobků každého čísla.`,
      `NSN = nejmenší číslo, které je v obou seznamech násobků.`,
    ],
  };
}

function genNsdNsn(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 30; i++) tasks.push(genNSD(level));
  for (let i = 0; i < 30; i++) tasks.push(genNSN(level));
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_NSD_NSN: HelpData = {
  hint:
    "NSD = NEJVĚTŠÍ společný DĚLITEL. NSN = NEJMENŠÍ společný NÁSOBEK. Jsou to opačné koncepty.",
  steps: [
    "NSD: najdi dělitele obou čísel → zvol největší společný.",
    "NSN: vypiš násobky obou čísel → zvol nejmenší společný.",
    "POMŮCKA NSD: zkus nejmenší z čísel — je to dělitel i druhého?",
    "POMŮCKA NSN: začni větším z čísel — je to násobek i menšího?",
  ],
  commonMistake:
    "NEPLETÁ si NSD a NSN!\n• NSD pro 8 a 12 = 4 (nejvíc, co dělí oba)\n• NSN pro 8 a 12 = 24 (nejmíň, co obsahuje oba)\n\nNSD ≤ oba čísla.\nNSN ≥ oba čísla.",
  example:
    "Čísla 12 a 18:\n• Dělitelé 12: 1, 2, 3, 4, 6, 12\n• Dělitelé 18: 1, 2, 3, 6, 9, 18\n• Společní: 1, 2, 3, 6\n• NSD = 6\n\n• Násobky 12: 12, 24, 36, 48...\n• Násobky 18: 18, 36, 54...\n• První společný: 36\n• NSN = 36",
  visualExamples: [
    {
      label: "NSD — Vennův diagram",
      illustration:
        "Dělitelé 12 a 18:\n\n     ┌─ 12 ─┐       ┌─ 18 ─┐\n     │ 4   │       │  9   │\n     │ 12  │       │  18  │\n     │     └──┬────┘      │\n     │       SPOLEČNÍ     │\n     └──── 1, 2, 3, 6 ────┘\n\n  NSD(12, 18) = 6 (největší ze společných)",
      conclusion: "NSD je největší společný DĚLITEL.",
    },
    {
      label: "NSN — hledání prvního společného násobku",
      illustration:
        "Násobky 4:  4, 8, 12, 16, 20, 24, 28...\n                       ↓ první společný\nNásobky 6:  6, 12, 18, 24, 30, 36...\n\nNSN(4, 6) = 12",
      conclusion: "NSN je nejmenší společný NÁSOBEK.",
    },
    {
      label: "K čemu to použít",
      illustration:
        "NSD se použije pro KRÁCENÍ zlomků:\n  12/18 = ? (vyděl čitatele i jmenovatele NSD = 6)\n  12÷6 = 2,  18÷6 = 3\n  → 12/18 = 2/3\n\nNSN se použije pro SČÍTÁNÍ zlomků:\n  1/4 + 1/6 = ?\n  NSN(4,6) = 12 → společný jmenovatel\n  3/12 + 2/12 = 5/12",
      conclusion: "NSD a NSN jsou klíč ke zlomkům s různými jmenovateli.",
    },
  ],
};

export const NSD_NSN_TOPICS: TopicMetadata[] = [
  {
    id: "math-nsd-nsn-6",
    title: "NSD a NSN",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Dělitelnost",
    topicDescription: "Největší společný dělitel (NSD) a nejmenší společný násobek (NSN).",
    briefDescription:
      "Naučíš se najít NSD (největší společný dělitel) a NSN (nejmenší společný násobek) dvou čísel.",
    keywords: [
      "NSD",
      "NSN",
      "největší společný dělitel",
      "nejmenší společný násobek",
      "společný dělitel",
      "společný násobek",
    ],
    goals: [
      "Najdeš NSD dvou čísel do 100.",
      "Najdeš NSN dvou čísel do 50.",
      "Použiješ NSD pro krácení zlomků.",
      "Použiješ NSN pro sčítání zlomků s různými jmenovateli.",
    ],
    boundaries: [
      "Maximálně dvě čísla.",
      "Bez rozkladu na prvočísla (to je pokročilejší metoda).",
    ],
    gradeRange: [6, 7],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "number",
    generator: genNsdNsn,
    helpTemplate: HELP_NSD_NSN,
    contentType: "algorithmic",
    prerequisites: ["math-divisibility-6"],
    rvpReference: "M-6-1-05",
  },
];
