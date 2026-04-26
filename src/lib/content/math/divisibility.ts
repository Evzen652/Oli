import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Dělitelnost — 6. ročník ZŠ
 * RVP M-6-1
 *
 * Tři typy úloh:
 *   1) Dělitele čísla — multi_select (vyber VŠECHNY dělitele)
 *   2) Prvočísla — multi_select (vyber všechna prvočísla)
 *   3) Znaky dělitelnosti — select_one ("je 1 248 dělitelné 6?")
 */

function divisorsOf(n: number): number[] {
  const result: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) result.push(i);
  }
  return result;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/** Úloha: vyber všechny dělitele čísla. */
function genDivisors(level: number): PracticeTask {
  const n = level === 1 ? 4 + Math.floor(Math.random() * 8) : level === 2 ? 10 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 40);
  const divs = divisorsOf(n);
  // Vyber 5–7 možností: všechny dělitele + některé "falešné"
  const distractors: number[] = [];
  for (let i = 2; distractors.length < 3; i++) {
    if (!divs.includes(i) && n % i !== 0) distractors.push(i);
  }
  const allOptions = [...divs, ...distractors].sort((a, b) => a - b);

  return {
    question: `Vyber VŠECHNA čísla, kterými je ${n} dělitelné (dělitele čísla ${n}):`,
    correctAnswer: divs.join(","),
    correctAnswers: divs.map(String), // multi_select pole
    options: allOptions.map(String),
    solutionSteps: [
      `Dělitel čísla ${n} = číslo, kterým lze ${n} dělit BEZE ZBYTKU.`,
      `Procházej čísla 1, 2, 3, ... a testuj: zbývá zbytek? Pokud NE, je to dělitel.`,
      `Dělitelé ${n}: ${divs.join(", ")}.`,
    ],
    hints: [
      `Které z čísel v možnostech dělí ${n} beze zbytku? (${n} ÷ číslo = celé)`,
      `Nezapomeň: 1 a samotné ${n} jsou VŽDY dělitelé.`,
    ],
  };
}

/** Úloha: znaky dělitelnosti (je číslo dělitelné X?) */
function genDivisibilityMark(_level: number): PracticeTask {
  const divisors = [2, 3, 5, 9, 10];
  const divisor = divisors[Math.floor(Math.random() * divisors.length)];
  // Vyber číslo — občas dělitelné, občas ne
  const isDiv = Math.random() > 0.4;
  let n: number;
  if (isDiv) {
    n = divisor * (2 + Math.floor(Math.random() * 80));
  } else {
    do {
      n = 100 + Math.floor(Math.random() * 900);
    } while (n % divisor === 0);
  }

  const correct = isDiv ? "ANO" : "NE";

  const ruleExplanation: Record<number, string> = {
    2: "Dělitelné 2 = KONČÍ sudou číslicí (0, 2, 4, 6, 8).",
    3: "Dělitelné 3 = ciferný součet je dělitelný 3.",
    5: "Dělitelné 5 = KONČÍ 0 nebo 5.",
    9: "Dělitelné 9 = ciferný součet je dělitelný 9.",
    10: "Dělitelné 10 = KONČÍ 0.",
  };

  let stepExplanation = "";
  if (divisor === 3 || divisor === 9) {
    const digitSum = String(n).split("").reduce((s, d) => s + parseInt(d, 10), 0);
    stepExplanation = `Ciferný součet ${n}: ${String(n).split("").join(" + ")} = ${digitSum}. ${digitSum} ${digitSum % divisor === 0 ? "JE" : "NENÍ"} dělitelné ${divisor}.`;
  } else {
    stepExplanation = `Poslední číslice: ${String(n).slice(-1)}. ${correct === "ANO" ? "Vyhovuje" : "Nevyhovuje"} pravidlu.`;
  }

  return {
    question: `Je ${n} dělitelné ${divisor}?`,
    correctAnswer: correct,
    options: ["ANO", "NE"],
    solutionSteps: [
      ruleExplanation[divisor],
      stepExplanation,
      `Odpověď: ${correct}.`,
    ],
    hints: [
      `Vzpomeň si na ZNAK DĚLITELNOSTI ${divisor}.`,
      divisor === 3 || divisor === 9
        ? `Sečti všechny číslice čísla. Je výsledek dělitelný ${divisor}?`
        : `Podívej se na POSLEDNÍ číslici čísla.`,
    ],
  };
}

/** Úloha: vyber prvočísla z množiny */
function genPrimes(_level: number): PracticeTask {
  // Náhodný výběr ze sady 2–30
  const pool: number[] = [];
  while (pool.length < 6) {
    const n = 2 + Math.floor(Math.random() * 29);
    if (!pool.includes(n)) pool.push(n);
  }
  pool.sort((a, b) => a - b);
  let primes = pool.filter(isPrime);

  // INVARIANT: vždy aspoň 1 prvočíslo v pool (jinak by correctAnswer byl prázdný)
  if (primes.length === 0) {
    const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    const addPrime = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    if (!pool.includes(addPrime)) {
      pool.pop(); // odstraň poslední aby zachoval velikost 6
      pool.push(addPrime);
      pool.sort((a, b) => a - b);
    }
    primes = pool.filter(isPrime);
  }

  return {
    question: `Vyber VŠECHNA prvočísla z nabídky:`,
    correctAnswer: primes.join(","),
    correctAnswers: primes.map(String),
    options: pool.map(String),
    solutionSteps: [
      `Prvočíslo = má PŘESNĚ 2 dělitele: 1 a sebe.`,
      `Procházej nabízená čísla a testuj, zda mají jen 2 dělitele.`,
      `Prvočísla: ${primes.join(", ")}.`,
      `Složená čísla: ${pool.filter((n) => !isPrime(n)).join(", ")}.`,
    ],
    hints: [
      `Prvočíslo = dělitelné pouze 1 a samo sebou.`,
      `Pozor: 1 NENÍ prvočíslo! Prvočísla začínají 2, 3, 5, 7, 11, 13, …`,
    ],
  };
}

function genDivisibility(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  // Mix: 40 % dělitele, 40 % znaky dělitelnosti, 20 % prvočísla
  for (let i = 0; i < 24; i++) tasks.push(genDivisors(level));
  for (let i = 0; i < 24; i++) tasks.push(genDivisibilityMark(level));
  for (let i = 0; i < 12; i++) tasks.push(genPrimes(level));
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_DIVISIBILITY: HelpData = {
  hint:
    "Dělitelnost = zda lze číslo dělit beze zbytku. Dělitel čísla 12 = 1, 2, 3, 4, 6, 12. Prvočíslo má jen 2 dělitele (1 a sebe).",
  steps: [
    "Dělitel = číslo, kterým lze dělit beze zbytku.",
    "Pro malá čísla postupně zkoušej: 2, 3, 4, 5 …",
    "Pro velká čísla použij ZNAKY DĚLITELNOSTI (viz níže).",
    "Prvočíslo = přesně 2 dělitele (1 a samo sebe). 2, 3, 5, 7, 11, 13…",
  ],
  commonMistake:
    "Časté chyby:\n• 1 NENÍ prvočíslo (má jen 1 dělitele).\n• 2 JE prvočíslo (jediné SUDÉ prvočíslo).\n• Zapomenout, že 1 a číslo samo jsou také dělitele.",
  example:
    "Dělitelé čísla 12: 1, 2, 3, 4, 6, 12. (6 dělitelů → 12 NENÍ prvočíslo)\nDělitelé čísla 7: 1, 7. (jen 2 → 7 JE prvočíslo)\n\n48 dělitelné 3? 4+8=12, 12 dělitelné 3 → ANO.",
  visualExamples: [
    {
      label: "Znaky dělitelnosti (nejdůležitější)",
      illustration:
        "DĚLITELNÉ:\n• 2   → končí 0, 2, 4, 6, 8          (sudé)\n• 3   → ciferný součet dělitelný 3    (3, 6, 9, 12 …)\n• 5   → končí 0 nebo 5\n• 9   → ciferný součet dělitelný 9\n• 10  → končí 0\n\nPříklad: 1 248\n• 2? poslední 8 → ANO\n• 3? 1+2+4+8=15 → ANO (15÷3)\n• 5? poslední 8 → NE\n• 9? 15÷9 → NE",
      conclusion: "Znaky dělitelnosti ti dají odpověď za pár vteřin.",
    },
    {
      label: "Prvočísla do 30",
      illustration:
        "Prvočísla do 30:\n  2  3  5  7  11  13  17  19  23  29\n\nSložená čísla (NE prvočísla):\n  4=2·2   6=2·3   8=2·4   9=3·3   10=2·5\n  12=3·4  15=3·5  16=4·4  18=2·9  20=4·5\n\nPozor:\n  1  není prvočíslo (má jen 1 dělitele)\n  2  je JEDINÉ sudé prvočíslo",
      conclusion: "Prvočísla jsou „stavební kostky“ všech přirozených čísel.",
    },
    {
      label: "Dělitelé čísla 18",
      illustration:
        "Hledám všechna čísla, která dělí 18 beze zbytku:\n\n  1  ✓  18 ÷ 1 = 18\n  2  ✓  18 ÷ 2 = 9\n  3  ✓  18 ÷ 3 = 6\n  4  ✗  18 ÷ 4 = 4 zb.2\n  5  ✗  18 ÷ 5 = 3 zb.3\n  6  ✓  18 ÷ 6 = 3\n  7  ✗\n  8  ✗\n  9  ✓  18 ÷ 9 = 2\n  18 ✓\n\nDělitelé: 1, 2, 3, 6, 9, 18. (6 dělitelů)",
      conclusion: "Procházej od 1 postupně. Nezapomeň na 1 a číslo samo.",
    },
  ],
};

export const DIVISIBILITY_TOPICS: TopicMetadata[] = [
  {
    id: "math-divisibility-6",
    title: "Dělitelnost",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Dělitelnost",
    topicDescription:
      "Dělitele, násobky, prvočísla a znaky dělitelnosti (2, 3, 5, 9, 10).",
    briefDescription:
      "Naučíš se najít všechny dělitele čísla, rozpoznat prvočísla a používat znaky dělitelnosti.",
    keywords: [
      "dělitelnost",
      "dělitel",
      "násobek",
      "prvočíslo",
      "složené číslo",
      "znaky dělitelnosti",
    ],
    goals: [
      "Najdeš všechny dělitele čísla do 50.",
      "Rozpoznáš prvočísla (do 30).",
      "Použiješ znaky dělitelnosti 2, 3, 5, 9, 10.",
      "Rozlišíš prvočíslo od složeného čísla.",
    ],
    boundaries: [
      "Pouze přirozená čísla do 100.",
      "Žádné NSD/NSN (další dovednost).",
      "Znaky dělitelnosti 4, 6, 8 pokročilejší — minimálně.",
    ],
    gradeRange: [6, 7],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "multi_select",
    generator: genDivisibility,
    helpTemplate: HELP_DIVISIBILITY,
    contentType: "algorithmic",
    prerequisites: ["math-divide-remainder-4", "math-divide-one-digit-5"],
    rvpReference: "M-6-1-04",
  },
];
