import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Násobení a dělení desetinných čísel — 6. ročník ZŠ
 * RVP M-6-1
 *
 * Zaměření v 6. ročníku:
 *   • Násobení desetinného × 10, 100, 1000 (posun čárky)
 *   • Dělení desetinného : 10, 100, 1000 (posun čárky)
 *   • Násobení desetinného × celé číslo (jednociferné)
 */

function fmtDec(n: number): string {
  // Zobrazit jako české desetinné (s čárkou), odstranit trailing nuly pro přehlednost
  let s = n.toString();
  if (s.includes(".")) s = s.replace(/\.?0+$/, "");
  return s.replace(".", ",");
}

function genMulByPowerOfTen(_level: number): PracticeTask {
  const base = Math.round((Math.random() * 50 + 0.5) * 100) / 100; // 2 desetinná
  const powers = [10, 100, 1000];
  const power = powers[Math.floor(Math.random() * powers.length)];
  const result = base * power;

  const distractors = new Set<string>();
  distractors.add(fmtDec(base * (power / 10)));
  distractors.add(fmtDec(base * (power * 10)));
  distractors.add(fmtDec(base + power));
  distractors.delete(fmtDec(result));

  const filtered = [...distractors].slice(0, 3);
  while (filtered.length < 3) filtered.push(fmtDec(result + filtered.length + 10));
  const options = [fmtDec(result), ...filtered].sort(() => Math.random() - 0.5);

  const posunMist = power === 10 ? 1 : power === 100 ? 2 : 3;

  return {
    question: `${fmtDec(base)} × ${power} =`,
    correctAnswer: fmtDec(result),
    options,
    solutionSteps: [
      `Násobení 10, 100 nebo 1000 = POSUN čárky doprava.`,
      `Číslo ${power} má ${posunMist === 1 ? "jednu nulu" : posunMist === 2 ? "dvě nuly" : "tři nuly"} → posuň čárku o ${posunMist} ${posunMist === 1 ? "místo" : "místa"} doprava.`,
      `${fmtDec(base)} → ${fmtDec(result)}.`,
    ],
    hints: [
      `Kolik nul má ${power}? O tolik míst posuň čárku doprava.`,
      `Pozor: pokud číslo nemá tolik desetinných míst, DOPLŇ NULY vpravo.`,
    ],
  };
}

function genDivByPowerOfTen(_level: number): PracticeTask {
  const base = Math.round((Math.random() * 1000 + 10)); // celé číslo
  const powers = [10, 100, 1000];
  const power = powers[Math.floor(Math.random() * powers.length)];
  const result = base / power;

  const distractors = new Set<string>();
  distractors.add(fmtDec(base / (power / 10)));
  distractors.add(fmtDec(base * power));
  distractors.add(fmtDec(result + 1));
  distractors.delete(fmtDec(result));

  const filtered = [...distractors].slice(0, 3);
  while (filtered.length < 3) filtered.push(fmtDec(result + filtered.length + 0.5));
  const options = [fmtDec(result), ...filtered].sort(() => Math.random() - 0.5);

  const posunMist = power === 10 ? 1 : power === 100 ? 2 : 3;

  return {
    question: `${base} ÷ ${power} =`,
    correctAnswer: fmtDec(result),
    options,
    solutionSteps: [
      `Dělení 10, 100 nebo 1000 = POSUN čárky doleva.`,
      `Číslo ${power} má ${posunMist} ${posunMist === 1 ? "nulu" : posunMist < 5 ? "nuly" : "nul"} → posuň čárku o ${posunMist} ${posunMist === 1 ? "místo" : "místa"} doleva.`,
      `${base} = ${base},0 → posunem vznikne ${fmtDec(result)}.`,
    ],
    hints: [
      `Při dělení 10, 100… čárka se posouvá DOLEVA (zmenšuje se).`,
      `Kolik nul má dělitel, o tolik míst se čárka posune doleva.`,
    ],
  };
}

function genMulByInt(_level: number): PracticeTask {
  const dec = Math.round((Math.random() * 8 + 0.2) * 10) / 10; // 1 desetinné
  const int = Math.floor(Math.random() * 8) + 2; // 2–9
  const result = Math.round(dec * int * 10) / 10;

  const distractors = new Set<string>();
  distractors.add(fmtDec(dec + int));
  distractors.add(fmtDec(result * 10));
  distractors.add(fmtDec(result / 10));
  distractors.add(fmtDec(result + 1));
  distractors.delete(fmtDec(result));

  const filtered = [...distractors].slice(0, 3);
  while (filtered.length < 3) filtered.push(fmtDec(result + filtered.length + 0.5));
  const options = [fmtDec(result), ...filtered].sort(() => Math.random() - 0.5);

  return {
    question: `${fmtDec(dec)} × ${int} =`,
    correctAnswer: fmtDec(result),
    solutionSteps: [
      `Představ si násobení BEZ čárky: ${Math.round(dec * 10)} × ${int} = ${Math.round(dec * 10 * int)}.`,
      `Původní číslo mělo 1 desetinné místo → výsledek bude mít taky 1 desetinné místo.`,
      `${Math.round(dec * 10 * int)} → ${fmtDec(result)}.`,
    ],
    options,
    hints: [
      `Vynásob jako celá čísla (bez čárky), pak vrať čárku na stejnou pozici.`,
      `Pozor: počet desetinných míst ve výsledku = počet míst v desetinném čísle.`,
    ],
  };
}

function genDecimalMulDiv(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  // Mix: 40 % násobení mocninou 10, 30 % dělení mocninou 10, 30 % násobení celým
  for (let i = 0; i < 24; i++) tasks.push(genMulByPowerOfTen(level));
  for (let i = 0; i < 18; i++) tasks.push(genDivByPowerOfTen(level));
  for (let i = 0; i < 18; i++) tasks.push(genMulByInt(level));
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_DECIMAL_MUL_DIV: HelpData = {
  hint:
    "Násobení/dělení mocninou deseti = POSUN čárky. ×10 o 1 místo doprava. ÷10 o 1 místo doleva. ×100 o 2 místa. atd.",
  steps: [
    "Najdi čárku v desetinném čísle.",
    "Spočítej nuly v druhém čísle (10, 100, 1000).",
    "×: posuň čárku o tolik míst DOPRAVA. ÷: DOLEVA.",
    "Doplň nuly, pokud chybí pozice.",
    "U obecného násobení: vynásob celá čísla, pak zpátky vlož čárku.",
  ],
  commonMistake:
    "ŠPATNĚ: „3,5 × 100 = 3,500“. SPRÁVNĚ: 3,5 × 100 = 350 (posuneš čárku o 2 místa doprava, nuly DOPLNÍŠ).",
  example:
    "3,5 × 10 = 35 (čárka o 1 místo →)\n3,5 × 100 = 350 (o 2 místa → doplním nulu)\n3,5 × 1000 = 3 500 (o 3 místa)\n\n78 ÷ 10 = 7,8 (o 1 místo ←)\n78 ÷ 100 = 0,78 (o 2 místa, musím doplnit 0 vlevo)",
  visualExamples: [
    {
      label: "Posun čárky při násobení",
      illustration:
        "  3,5 × 10   = 35\n  3,5 × 100  = 350\n  3,5 × 1000 = 3 500\n\n        ↑ posun doprava\n   (jedna nula = jedno místo)",
      conclusion: "Kolik nul v druhém činiteli, o tolik míst čárka doprava.",
    },
    {
      label: "Posun při dělení",
      illustration:
        "  78  ÷ 10   = 7,8\n  78  ÷ 100  = 0,78\n  78  ÷ 1000 = 0,078\n\n        ↓ posun doleva\n   (doplň 0 vlevo, pokud chybí)",
      conclusion: "Dělení mocninou 10 = posun čárky doleva.",
    },
    {
      label: "Násobení celým číslem",
      illustration:
        "2,3 × 4 = ?\n\n  Bez čárky:  23 × 4 = 92\n  V 2,3 je 1 desetinné místo\n  → výsledek bude mít 1 místo\n  → 92 → 9,2\n\n  Takže 2,3 × 4 = 9,2 ✓",
      conclusion: "Vynásob bez čárky, pak čárku vrať podle počtu desetinných míst.",
    },
  ],
};

export const DECIMAL_MUL_DIV_TOPICS: TopicMetadata[] = [
  {
    id: "math-decimal-muldiv-6",
    title: "Desetinná čísla: násobení a dělení",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Desetinná čísla",
    topicDescription: "Násobení a dělení desetinných čísel včetně posunu čárky.",
    briefDescription:
      "Naučíš se násobit a dělit desetinná čísla. Hlavní trik: ×10/100/1000 = posun čárky.",
    keywords: [
      "násobení desetinných",
      "dělení desetinných",
      "posun čárky",
      "mocnina deseti",
    ],
    goals: [
      "Vynásobíš desetinné číslo 10, 100, 1000 (posun čárky).",
      "Vydělíš desetinné číslo 10, 100, 1000.",
      "Vynásobíš desetinné číslo celým jednociferným číslem.",
    ],
    boundaries: [
      "Pouze kladná desetinná čísla.",
      "Násobení desetinným × desetinným jen okrajově.",
      "Dělení desetinným dělitelem je pokročilejší téma (7. r.).",
    ],
    gradeRange: [6, 7],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "number",
    generator: genDecimalMulDiv,
    helpTemplate: HELP_DECIMAL_MUL_DIV,
    contentType: "algorithmic",
    prerequisites: ["math-decimal-ops-6", "math-multiply"],
    rvpReference: "M-6-1-03",
  },
];
