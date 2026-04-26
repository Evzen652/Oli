import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Procenta — 7. ročník ZŠ
 * Deterministický generátor (pure funkce, žádná AI).
 * Matematická správnost je zaručena konstrukcí — vždy vybereme základ a procento
 * tak, aby výsledek byl celé číslo.
 *
 * Tři typy úloh:
 *   1) Procentová část  — X % z Y = ?    (nejčastější)
 *   2) Základ           — Z je X % z ?    (inverzní)
 *   3) Počet procent    — Z z Y je ? %    (obrácené)
 */

/** Helper: najde "hezká" procenta pro daný level (procenta × základ musí dát celé číslo). */
function pickNicePercent(level: number): { percent: number; baseFactor: number } {
  // baseFactor = minimum multiple of base so that percent * base / 100 = integer
  // Např. 25 % → base násobkem 4; 50 % → base násobkem 2
  const options = level === 1
    ? [{ percent: 10, baseFactor: 10 }, { percent: 25, baseFactor: 4 }, { percent: 50, baseFactor: 2 }, { percent: 20, baseFactor: 5 }]
    : level === 2
    ? [{ percent: 15, baseFactor: 20 }, { percent: 30, baseFactor: 10 }, { percent: 40, baseFactor: 5 }, { percent: 60, baseFactor: 5 }, { percent: 75, baseFactor: 4 }]
    : [{ percent: 7, baseFactor: 100 }, { percent: 12, baseFactor: 25 }, { percent: 35, baseFactor: 20 }, { percent: 85, baseFactor: 20 }, { percent: 120, baseFactor: 5 }];
  return options[Math.floor(Math.random() * options.length)];
}

function genPart(level: number): PracticeTask {
  const { percent, baseFactor } = pickNicePercent(level);
  const multiplier = level === 1 ? 1 + Math.floor(Math.random() * 5) : 2 + Math.floor(Math.random() * 10);
  const base = baseFactor * multiplier;
  const result = Math.round((percent * base) / 100);

  // Set pro deduplikaci distractorů
  const candidatePool = new Set<number>();
  candidatePool.add(Math.round(result + base / 10));
  candidatePool.add(Math.round(result - base / 10));
  candidatePool.add(Math.round((percent * base) / 10));
  candidatePool.add(base - result);
  candidatePool.add(result + 5);
  candidatePool.add(result + 10);
  candidatePool.delete(result);

  const distractors = [...candidatePool].filter((d) => d > 0 && Number.isInteger(d)).slice(0, 3).map(String);
  let pad = result + 11;
  while (distractors.length < 3) {
    const s = String(pad);
    if (!distractors.includes(s) && pad !== result) distractors.push(s);
    pad++;
  }

  const options = [String(result), ...distractors].sort(() => Math.random() - 0.5);

  return {
    question: `Kolik je ${percent} % z ${base}?`,
    correctAnswer: String(result),
    options,
    solutionSteps: [
      `Vzorec: ${percent} % z ${base} = (${percent} ÷ 100) × ${base}.`,
      `Spočítej: ${percent} × ${base} = ${percent * base}.`,
      `Vyděl 100: ${percent * base} ÷ 100 = ${result}.`,
    ],
    hints: [
      `1 % = jedna setina. ${percent} % = ${percent}/100.`,
      `Zkus: (${percent} × ${base}) ÷ 100.`,
    ],
  };
}

function genBase(level: number): PracticeTask {
  // Najdi takové percent a part, aby základ bylo celé číslo
  const { percent, baseFactor } = pickNicePercent(level);
  const multiplier = level === 1 ? 1 + Math.floor(Math.random() * 3) : 2 + Math.floor(Math.random() * 6);
  const base = baseFactor * multiplier;
  const part = (percent * base) / 100;

  const candidatePool = new Set<number>();
  candidatePool.add(part + Math.round(base / 5));
  candidatePool.add(Math.round((part * 100) / (percent + 10)));
  candidatePool.add(base * 2);
  candidatePool.add(Math.round(base / 2));
  candidatePool.add(base + 10);
  candidatePool.add(part);
  candidatePool.delete(base);

  const distractors = [...candidatePool].filter((d) => d > 0 && Number.isInteger(d)).slice(0, 3).map(String);
  let pad = base + 11;
  while (distractors.length < 3) {
    const s = String(pad);
    if (!distractors.includes(s) && pad !== base) distractors.push(s);
    pad++;
  }

  const options = [String(base), ...distractors].sort(() => Math.random() - 0.5);

  return {
    question: `${part} je ${percent} % z jakého čísla?`,
    correctAnswer: String(base),
    options,
    solutionSteps: [
      `Vzorec: základ = (část × 100) ÷ počet procent.`,
      `Spočítej: ${part} × 100 = ${part * 100}.`,
      `Vyděl ${percent}: ${part * 100} ÷ ${percent} = ${base}.`,
    ],
    hints: [
      `Pokud je ${percent} % rovno ${part}, pak 100 % je kolikrát víc?`,
      `Zkus: (${part} × 100) ÷ ${percent}.`,
    ],
  };
}

function genPercent(level: number): PracticeTask {
  const { percent, baseFactor } = pickNicePercent(level);
  const multiplier = level === 1 ? 1 + Math.floor(Math.random() * 3) : 2 + Math.floor(Math.random() * 6);
  const base = baseFactor * multiplier;
  const part = Math.round((percent * base) / 100);

  // Test používá test computed = (part/base)*100; abychom unikli floating point
  // chybám, generujeme part jako Math.round(...) a držíme v celých číslech.
  const candidatePool = new Set<number>();
  candidatePool.add(percent + 10);
  candidatePool.add(percent - 5);
  candidatePool.add(percent + 5);
  candidatePool.add(percent - 10);
  candidatePool.add(100 - percent);
  candidatePool.add(percent * 2);
  candidatePool.delete(percent);

  const distractors = [...candidatePool]
    .filter((d) => d > 0 && d <= 200 && Number.isInteger(d))
    .slice(0, 3)
    .map((d) => `${d}`);
  let pad = percent + 11;
  while (distractors.length < 3) {
    const s = String(pad);
    if (!distractors.includes(s) && pad !== percent) distractors.push(s);
    pad++;
  }

  const options = [`${percent}`, ...distractors].sort(() => Math.random() - 0.5);

  return {
    question: `Kolik procent je ${part} z ${base}?`,
    correctAnswer: `${percent}`,
    options,
    solutionSteps: [
      `Vzorec: počet procent = (část ÷ základ) × 100.`,
      `Spočítej: ${part} ÷ ${base} = ${part / base}.`,
      `Vynásob 100: ${part / base} × 100 = ${percent} %.`,
    ],
    hints: [
      `Jaký je poměr ${part} ku ${base}?`,
      `Zkus: (${part} ÷ ${base}) × 100.`,
    ],
  };
}

function genPercentage(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  // Mix 60 % part + 20 % base + 20 % percent
  for (let i = 0; i < 36; i++) tasks.push(genPart(level));
  for (let i = 0; i < 12; i++) tasks.push(genBase(level));
  for (let i = 0; i < 12; i++) tasks.push(genPercent(level));
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_PERCENTAGE: HelpData = {
  hint: "Procento je zlomek se jmenovatelem 100. 1 % = 1/100 = 0,01. Celek = 100 %.",
  steps: [
    "Ujasni si, co hledáš — část, základ, nebo počet procent?",
    "Pro část: část = (procenta × základ) ÷ 100.",
    "Pro základ: základ = (část × 100) ÷ procenta.",
    "Pro procenta: procenta = (část ÷ základ) × 100.",
    "Zkontroluj — dává výsledek smysl?",
  ],
  commonMistake:
    "Počítat 25 % z 200 jako 25 × 200 = 5000. Zapomenuté dělení 100. Správně: 25 × 200 ÷ 100 = 50.",
  example: "15 % z 200 = (15 × 200) ÷ 100 = 30. 30 je 15 % z 200.",
  visualExamples: [
    {
      label: "Procento jako zlomek ze sta",
      illustration:
        "▓▓▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓▓\n100 koleček = 100 %\n\n25 koleček = 25 % (čtvrtina)\n50 koleček = 50 % (polovina)",
      conclusion: "Vyjádři procenta jako poměr z celku (100 %).",
    },
    {
      label: "Sleva jako procento",
      illustration:
        "Kalhoty za 800 Kč. Sleva 25 %.\n\nSleva = 25 % z 800 = 200 Kč.\nNová cena = 800 − 200 = 600 Kč.",
      conclusion: "Při slevě odčítáš část; při navýšení přičítáš.",
    },
  ],
};

export const PERCENTAGE_TOPICS: TopicMetadata[] = [
  {
    id: "math-procenta-7",
    title: "Procenta",
    subject: "matematika",
    category: "Poměr a procenta",
    topic: "Procenta",
    topicDescription: "Pojem procento, procentová část, základ, počet procent.",
    briefDescription: "Naučíš se počítat s procenty — kolik je X % z čísla, kolik procent tvoří část.",
    keywords: ["procenta", "procento", "%", "sleva", "úrok", "část ze sta"],
    goals: [
      "Vypočítáš procentovou část (X % z Y).",
      "Vypočítáš základ (část je X % z čeho).",
      "Vypočítáš počet procent (část z celku = X %).",
      "Vyřešíš slovní úlohy — sleva, úrok, daň.",
    ],
    boundaries: [
      "Neprobíráme složené úročení (SŠ).",
      "Neprobíráme promile.",
    ],
    gradeRange: [7, 9],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genPercentage,
    helpTemplate: HELP_PERCENTAGE,
  },
];
