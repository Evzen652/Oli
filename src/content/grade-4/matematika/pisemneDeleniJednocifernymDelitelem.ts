import type { TopicMetadata, PracticeTask } from "@/lib/types";

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // level 1: 2-ciferný dělenec (do 99), dělitel 2–5, beze zbytku
  // level 2: 3-ciferný dělenec (do 999), dělitel 2–9, beze zbytku
  // level 3: 4-ciferný dělenec (do 9 999), dělitel 2–9, se zbytkem i bez

  for (let i = 0; i < 40; i++) {
    let dividend: number, divisor: number, quotient: number, remainder: number;

    if (level === 1) {
      divisor = Math.floor(Math.random() * 4) + 2;  // 2–5
      quotient = Math.floor(Math.random() * 9) + 2;  // 2–10
      dividend = divisor * quotient;
      remainder = 0;
    } else if (level === 2) {
      divisor = Math.floor(Math.random() * 8) + 2;   // 2–9
      quotient = Math.floor(Math.random() * 90) + 10; // 10–99
      dividend = divisor * quotient;
      remainder = 0;
    } else {
      divisor = Math.floor(Math.random() * 8) + 2;      // 2–9
      quotient = Math.floor(Math.random() * 900) + 100;  // 100–999
      remainder = Math.floor(Math.random() * divisor);   // 0 až divisor-1
      dividend = divisor * quotient + remainder;
    }

    const correctStr = remainder > 0
      ? `${quotient} zb. ${remainder}`
      : String(quotient);

    const d1 = remainder > 0
      ? `${quotient + 1} zb. ${remainder}`
      : String(quotient + 1);
    const d2 = remainder > 0
      ? `${quotient - 1} zb. ${remainder}`
      : String(Math.max(1, quotient - 1));
    const d3 = remainder > 0
      ? `${quotient} zb. ${(remainder + 1) % divisor}`
      : String(quotient + divisor);

    tasks.push({
      question: `${fmt(dividend)} ÷ ${divisor} = ?`,
      correctAnswer: correctStr,
      options: shuffle([correctStr, d1, d2, d3]),
      hints: [
        `Kolikrát se vejde ${divisor} do prvních číslic čísla ${fmt(dividend)}?`,
        `Postupuj zleva — číslici po číslici, zbytek přines k další.`,
      ],
      solutionSteps: [
        `Dělíme ${fmt(dividend)} ÷ ${divisor} písemně (zleva).`,
        `${divisor} × ${quotient} = ${fmt(divisor * quotient)}`,
        remainder > 0
          ? `Zbytek: ${fmt(dividend)} − ${fmt(divisor * quotient)} = ${remainder} → výsledek: ${correctStr}`
          : `Výsledek: ${quotient}`,
      ],
    });
  }

  return tasks;
}

function fmt(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/ /g, " ");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const PISEMNE_DELENI: TopicMetadata[] = [
  {
    id: "g4-mat-pisemne-deleni-jednociferne-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-deleni-jednocifernym-delitelem",
    displayName: "Písemné dělení",
    title: "Písemné dělení jednociferným dělitelem",
    studentTitle: "Dělení pod sebou",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Naučíš se dělit větší čísla pod sebou.",
    keywords: [
      "dělení", "písemné dělení", "dělitel", "dělenec", "podíl",
      "zbytek", "jednociferný dělitel",
    ],
    goals: [
      "Provést písemné dělení víceciferného čísla jednociferným dělitelem.",
      "Správně zapsat podíl i zbytek po dělení.",
      "Ověřit výsledek: dělitel × podíl + zbytek = dělenec.",
    ],
    boundaries: [
      "Pouze jednociferný dělitel (2–9).",
      "Nezahrnuje dělení dvojciferným nebo víceciferným dělitelem.",
      "Nezahrnuje desetinná čísla.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-aritmeticky-prumer-4", "g4-mat-tabulky-diagramy-4"],
    generator: gen,
    helpTemplate: {
      hint: "Dělíme zleva: vezmi tolik číslic, aby byl úsek ≥ děliteli, a zjisti, kolikrát se dělitel vejde.",
      steps: [
        "Zapiš dělenec a dělitel (např. 4 536 ÷ 4).",
        "Vezmi první číslici (4). 4 ÷ 4 = 1, zbytek 0.",
        "Přines další číslici → 05. 5 ÷ 4 = 1, zbytek 1.",
        "Přines → 13. 13 ÷ 4 = 3, zbytek 1.",
        "Přines → 16. 16 ÷ 4 = 4, zbytek 0.",
        "Výsledek: 1 134.",
      ],
      commonMistake: "Zapomenutí přinést zbytek k další číslici, nebo chybné umístění číslice podílu.",
      example: "846 ÷ 3 = 282  (8÷3=2 zb.2 → 24÷3=8 zb.0 → 6÷3=2)",
    },
  },
];
