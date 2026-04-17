import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Písemné násobení jednociferným činitelem — 4. ročník ZŠ
 * Např.: 123 × 4 = ?
 *
 * Generátor zaručí, že výsledek je do 10 000 (RVP 4. ročník).
 */

function fmtNum(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/\u00A0/g, " ");
}

function genMultWritten(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 60; i++) {
    let a: number;
    let b: number;

    if (level === 1) {
      // Dvojciferné × jednociferné, bez přechodu
      a = Math.floor(Math.random() * 40) + 11; // 11–50
      b = Math.floor(Math.random() * 4) + 2;   // 2–5
    } else if (level === 2) {
      // Trojciferné × jednociferné
      a = Math.floor(Math.random() * 300) + 100; // 100–399
      b = Math.floor(Math.random() * 6) + 2;     // 2–7
    } else {
      // Vyšší trojciferné × jednociferné, s přechodem
      a = Math.floor(Math.random() * 600) + 300; // 300–899
      b = Math.floor(Math.random() * 6) + 4;     // 4–9
    }

    const result = a * b;
    if (result > 10000) continue; // Nechceme přesáhnout RVP strop

    // Distraktory — typické chyby
    const distractors = new Set<number>();
    distractors.add(a * b + a);         // o jedno navíc
    distractors.add(a * b - a);
    distractors.add(a * (b + 1));       // o jednu skupinku víc
    distractors.add(a * (b - 1));
    distractors.add(a + b);             // zaměněno + za ×
    distractors.delete(result);

    const filtered = [...distractors].filter((d) => d > 0 && d <= 10000).slice(0, 3);
    while (filtered.length < 3) filtered.push(result + (filtered.length + 1) * 17);

    const options = [result, ...filtered].sort(() => Math.random() - 0.5).map(fmtNum);

    // Solution steps — postupné násobení po řádech
    const digits = String(a).split("").map(Number);
    const tisice = Math.floor(a / 1000);
    const stovky = Math.floor((a % 1000) / 100);
    const desitky = Math.floor((a % 100) / 10);
    const jednotky = a % 10;

    const solutionSteps: string[] = [
      `Rozlož si ${fmtNum(a)} na řády${tisice > 0 ? ` (${tisice} tisíce,` : " ("}${stovky} stovky, ${desitky} desítky, ${jednotky} jednotky).`,
    ];

    const parts: string[] = [];
    if (tisice > 0) parts.push(`${tisice * 1000} × ${b} = ${fmtNum(tisice * 1000 * b)}`);
    if (stovky > 0) parts.push(`${stovky * 100} × ${b} = ${fmtNum(stovky * 100 * b)}`);
    if (desitky > 0) parts.push(`${desitky * 10} × ${b} = ${desitky * 10 * b}`);
    if (jednotky > 0) parts.push(`${jednotky} × ${b} = ${jednotky * b}`);
    solutionSteps.push(`Vynásob každý řád zvlášť: ${parts.join(", ")}.`);
    solutionSteps.push(`Sečti všechno: ${fmtNum(result)}.`);

    tasks.push({
      question: `${fmtNum(a)} × ${b} =`,
      correctAnswer: fmtNum(result),
      options,
      solutionSteps,
      hints: [
        `Násobíš ${fmtNum(a)} číslem ${b}. Rozlož si ${fmtNum(a)} na řády.`,
        `Vynásob každý řád zvlášť a potom je sečti.`,
      ],
    });
  }
  return tasks;
}

const HELP_MULT_WRITTEN: HelpData = {
  hint:
    "Když násobíš velké číslo malým, rozlož ho na řády (tisíce, stovky, desítky, jednotky) a každý řád vynásob zvlášť. Pak je sečti.",
  steps: [
    "Přečti si příklad — co je první (velké) číslo a co násobitel?",
    "Rozlož velké číslo na řády.",
    "Vynásob každý řád zvlášť.",
    "Sečti všechny součiny.",
    "Nebo zkus písemně pod sebou — je to rychlejší.",
  ],
  commonMistake:
    "Při písemném násobení pozor na přenos! Když vyjde 7 × 8 = 56, napíšeš 6 a 5 přeneseš do dalšího řádu.",
  example:
    "234 × 3 = ?\n200 × 3 = 600\n30 × 3 = 90\n4 × 3 = 12\n600 + 90 + 12 = 702 ✓",
  visualExamples: [
    {
      label: "Rozklad na řády",
      illustration:
        "347 × 4 = ?\n\n  300 × 4 = 1 200\n   40 × 4 =   160\n    7 × 4 =    28\n               ─────\n             = 1 388",
      conclusion: "Rozklad na řády = naše hlavní zbraň na velká čísla.",
    },
    {
      label: "Písemně pod sebou",
      illustration:
        "    3 4 7\n  ×     4\n  ───────\n  1 3 8 8\n\n• 7 × 4 = 28 → napíšeš 8, přeneseš 2\n• 4 × 4 + 2 = 18 → napíšeš 8, přeneseš 1\n• 3 × 4 + 1 = 13 → napíšeš 13",
      conclusion: "Přenos z nižšího řádu přičti k dalšímu součinu.",
    },
    {
      label: "Kontrola rozumností",
      illustration:
        "Jak zkontrolovat 234 × 3 ≈ 702?\n\n• 234 ≈ 230 (zaokrouhleno)\n• 230 × 3 = 690\n• 690 je blízko 702 ✓\n\nKdyž ti vyjde třeba 7 020, víš, že je to chyba.",
      conclusion: "Odhadem zkontroluješ, jestli výsledek není špatně o jeden řád.",
    },
  ],
};

export const MULT_WRITTEN_TOPICS: TopicMetadata[] = [
  {
    id: "math-mult-written-4",
    title: "Písemné násobení",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Písemné násobení",
    topicDescription: "Násobení dvoj- a trojciferných čísel jednociferným činitelem.",
    briefDescription:
      "Naučíš se vynásobit velké číslo malým — třeba 347 × 4. Rozlož na řády nebo počítej pod sebou.",
    keywords: [
      "písemné násobení",
      "násobení velkých čísel",
      "násobení pod sebou",
      "násobení trojciferných",
      "násob pod sebou",
    ],
    goals: [
      "Vynásobíš dvoj- nebo trojciferné číslo jednociferným.",
      "Rozložíš si číslo na řády a vynásobíš každý zvlášť.",
      "Použiješ písemné násobení pod sebou s přenosem.",
      "Zkontroluješ výsledek odhadem.",
    ],
    boundaries: [
      "Násobitel je jednociferný (2–9).",
      "Výsledek nepřesáhne 10 000.",
      "Žádná desetinná čísla.",
    ],
    gradeRange: [4, 5],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genMultWritten,
    helpTemplate: HELP_MULT_WRITTEN,
    contentType: "algorithmic",
    prerequisites: ["math-multiply", "math-add-sub-10k-4"],
    rvpReference: "M-5-1-04",
  },
];
