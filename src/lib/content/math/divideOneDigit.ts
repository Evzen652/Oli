import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Písemné dělení jednomístným dělitelem — 5. ročník ZŠ
 * RVP M-5-1-04
 *
 * Rozšíření "dělení se zbytkem" ze 4. ročníku na LARGER dělence.
 * Generátor zaručí dělení BEZE ZBYTKU (pro přehlednost výuky).
 *
 * Úlohy: "528 ÷ 4 = ?" — výsledek je celé číslo.
 */

function fmtNum(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/\u00A0/g, " ");
}

function genDivideOneDigit(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 60; i++) {
    let divisor: number;
    let quotient: number;

    if (level === 1) {
      // Trojciferný dělenec / jednociferný dělitel, výsledek ≤ 200
      divisor = Math.floor(Math.random() * 4) + 2; // 2–5
      quotient = Math.floor(Math.random() * 150) + 30; // 30–179
    } else if (level === 2) {
      // Čtyřciferný dělenec
      divisor = Math.floor(Math.random() * 6) + 2; // 2–7
      quotient = Math.floor(Math.random() * 1500) + 100; // 100–1599
    } else {
      // Větší čtyřciferný/pětiniciferný
      divisor = Math.floor(Math.random() * 7) + 2; // 2–8
      quotient = Math.floor(Math.random() * 10000) + 500; // 500–10499
    }

    const dividend = divisor * quotient; // bezezbytku

    // Distraktory
    const distractors = new Set<number>();
    distractors.add(quotient + 1);
    distractors.add(quotient - 1);
    distractors.add(quotient * 10);
    distractors.add(Math.floor(quotient / 10));
    distractors.add(quotient + 10);
    distractors.delete(quotient);

    const filtered = [...distractors].filter((d) => d > 0).slice(0, 3).map(fmtNum);
    while (filtered.length < 3) filtered.push(fmtNum(quotient + (filtered.length + 1) * 7));

    const options = [fmtNum(quotient), ...filtered].sort(() => Math.random() - 0.5);

    // Solution steps — rozklad dělence
    const dividendStr = String(dividend);
    const stepsExplanation = buildDivisionSteps(dividend, divisor, quotient);

    tasks.push({
      question: `${fmtNum(dividend)} ÷ ${divisor} =`,
      correctAnswer: fmtNum(quotient),
      options,
      solutionSteps: stepsExplanation,
      hints: [
        `Deloženec ${fmtNum(dividend)}, dělitel ${divisor}. Dělíš postupně od nejvyšších řádů.`,
        `Zkus si dělenec rozložit (např. ${fmtNum(dividend)} = ${Math.floor(dividend / 100) * 100} + ${dividend % 100}).`,
      ],
    });
  }
  return tasks;
}

function buildDivisionSteps(dividend: number, divisor: number, quotient: number): string[] {
  // Jednoduchá explanace pro žáka — pokračovací kroky při dělení
  const stepsResult: string[] = [
    `Piš dělence a nad něj postupně počítej, kolikrát se dělitel ${divisor} vejde do každé části.`,
  ];

  // Rozděl dělenec na řády a ukaž postup po řádech
  const digits = String(dividend).split("").map(Number);
  let carry = 0;
  let partialQuotient = "";
  for (let i = 0; i < digits.length; i++) {
    const current = carry * 10 + digits[i];
    const q = Math.floor(current / divisor);
    const r = current % divisor;
    partialQuotient += q;
    carry = r;
  }

  stepsResult.push(`Dělitel ${divisor} × ${quotient} = ${dividend} ✓ (kontrola zpětným násobením).`);
  stepsResult.push(`Výsledek: ${quotient}.`);
  return stepsResult;
}

const HELP_DIVIDE_ONE_DIGIT: HelpData = {
  hint:
    "Písemné dělení jednomístným dělitelem — postupuj od nejvyššího řádu (zleva). Kolikrát se dělitel vejde do první číslice (nebo prvních dvou)?",
  steps: [
    "Piš dělence a dělitel. Dívej se na první číslici dělence zleva.",
    "Vejde se dělitel do té číslice? Pokud ne, vezmi si dvě číslice.",
    "Najdi největší násobek dělitele, který se vejde. Zapiš pod dělence výsledek.",
    "Odečti od části dělence. Zbytek „snes“ k další číslici.",
    "Pokračuj, dokud neprojdeš celý dělenec.",
    "Zkontroluj: dělitel × kvocient = dělenec.",
  ],
  commonMistake:
    "Zapomenutý řád! Když dělitel 6 dělí 624 a v desítkách si nevšimneš „0“ (6 × 0 = 0), pokračuješ špatně. Vždy napiš i nuly do výsledku.",
  example:
    "624 ÷ 4 = ?\n• 6 ÷ 4 = 1, zbytek 2 → píšu 1\n• 22 ÷ 4 = 5, zbytek 2 → píšu 5\n• 24 ÷ 4 = 6, zbytek 0 → píšu 6\n→ Výsledek: 156\nKontrola: 156 × 4 = 624 ✓",
  visualExamples: [
    {
      label: "Písemné dělení (krok za krokem)",
      illustration:
        "   624 : 4 = 156\n   ─────────\n   6 … 4 × 1 = 4, zbytek 2\n    22 … 4 × 5 = 20, zbytek 2\n     24 … 4 × 6 = 24, zbytek 0\n\n   Kontrola: 156 × 4 = 624 ✓",
      conclusion: "Postupuj od nejvyššího řádu. Po každém kroku snes další číslici.",
    },
    {
      label: "Rozdělení v běžném životě",
      illustration:
        "Máš 528 bonbónů, rozděl je do 4 sáčků rovnoměrně:\n\n  528 ÷ 4 = ?\n  500 ÷ 4 = 125 (jenom stovky)\n   28 ÷ 4 = 7\n  Dohromady: 132\n\n  Kontrola: 132 + 132 + 132 + 132 = 528 ✓",
      conclusion: "Dělení = spravedlivé rozdělení na stejné skupiny.",
    },
  ],
};

export const DIVIDE_ONE_DIGIT_TOPICS: TopicMetadata[] = [
  {
    id: "math-divide-one-digit-5",
    title: "Písemné dělení jednomístným dělitelem",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Písemné dělení",
    topicDescription:
      "Dělení velkých čísel jednomístným dělitelem (bez zbytku).",
    briefDescription:
      "Naučíš se písemně vydělit velké číslo malým (např. 528 ÷ 4). Postupuj po řádech zleva.",
    keywords: [
      "písemné dělení",
      "dělení jednomístným",
      "dělení pod sebou",
      "vyděl",
      "dělení",
    ],
    goals: [
      "Vyděl velké číslo jednomístným dělitelem písemně.",
      "Postupně pracuješ od nejvyššího řádu.",
      "Zkontroluješ výsledek zpětným násobením.",
    ],
    boundaries: [
      "Pouze jednomístný dělitel (2–9).",
      "Dělení beze zbytku (zbytkové dělení je 4. roč.).",
      "Dvojmístný dělitel je 6. roč.",
    ],
    gradeRange: [5, 6],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "number",
    generator: genDivideOneDigit,
    helpTemplate: HELP_DIVIDE_ONE_DIGIT,
    contentType: "algorithmic",
    prerequisites: ["math-divide", "math-divide-remainder-4", "math-mult-written-4"],
    rvpReference: "M-5-1-04",
  },
];
