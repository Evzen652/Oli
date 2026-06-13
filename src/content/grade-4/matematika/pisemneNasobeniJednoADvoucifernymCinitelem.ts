import type { TopicMetadata, PracticeTask } from "@/lib/types";

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // level 1: 3-ciferné × jednociferné (do 999 × 9)
  // level 2: 4-ciferné × jednociferné (do 9 999 × 9)
  // level 3: 3-ciferné × dvouciferné (do 999 × 99)

  for (let i = 0; i < 40; i++) {
    let a: number, b: number;

    if (level === 1) {
      a = Math.floor(Math.random() * 900) + 100;  // 100–999
      b = Math.floor(Math.random() * 8) + 2;      // 2–9
    } else if (level === 2) {
      a = Math.floor(Math.random() * 9000) + 1000; // 1 000–9 999
      b = Math.floor(Math.random() * 8) + 2;       // 2–9
    } else {
      a = Math.floor(Math.random() * 900) + 100;   // 100–999
      b = Math.floor(Math.random() * 89) + 11;     // 11–99 (aspoň dvouciferné)
    }

    const correct = a * b;

    const distractors = [
      correct + b,
      correct - b,
      correct + a,
      correct - a,
    ].filter(v => v > 0 && v !== correct);

    const opts = shuffle([correct, distractors[0], distractors[1], distractors[2]])
      .map(String);

    const steps: string[] = level === 3
      ? [
          `Násobíme ${fmt(a)} × ${b}:`,
          `  ${fmt(a)} × ${b % 10} = ${fmt(a * (b % 10))}  (jednotky)`,
          `  ${fmt(a)} × ${Math.floor(b / 10)} = ${fmt(a * Math.floor(b / 10))}  (desítky, posunout o 1 místo vlevo)`,
          `Sečteme mezisoučty: ${fmt(a * (b % 10))} + ${fmt(a * Math.floor(b / 10) * 10)} = ${fmt(correct)}`,
        ]
      : [
          `Násobíme ${fmt(a)} × ${b} číslici po číslici zprava.`,
          `Výsledek: ${fmt(correct)}`,
        ];

    tasks.push({
      question: `${fmt(a)} × ${b} = ?`,
      correctAnswer: String(correct),
      options: opts,
      hints: [
        `Začni od nejnižšího řádu (jednotky) a postupuj doleva.`,
        level === 3
          ? `Při dvojciferném činiteli vypočítej dva mezisoučty a sečti je (druhý posuň o 1 místo).`
          : `Přenos (desetiny výsledku) přidej k součtu dalšího sloupce.`,
      ],
      solutionSteps: steps,
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

export const PISEMNE_NASOBENI: TopicMetadata[] = [
  {
    id: "g4-mat-pisemne-nasobeni-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-nasobeni-jedno-a-dvoucifernym-cinitelem",
    displayName: "Písemné násobení",
    title: "Písemné násobení jedno- a dvouciferným činitelem",
    studentTitle: "Násobení pod sebou",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Naučíš se násobit větší čísla pod sebou.",
    keywords: [
      "násobení", "písemné násobení", "činitel", "součin",
      "přenos", "mezisoučet", "dvouciferný", "jednociferný",
    ],
    goals: [
      "Provést písemné násobení víceciferného čísla jednociferným činitelem.",
      "Provést písemné násobení víceciferného čísla dvouciferným činitelem (mezisoučty).",
      "Zkontrolovat výsledek odhadem.",
    ],
    boundaries: [
      "Dvojciferný činitel pouze do 99.",
      "Nezahrnuje násobení víceciferným × víceciferným (nad 2 cifry).",
      "Nezahrnuje desetinná čísla.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-pisemne-deleni-jednociferne-4"],
    generator: gen,
    helpTemplate: {
      hint: "Násobíme zprava. Výsledek každé číslice zapíšeme, přenos přičteme k dalšímu sloupci. Dvouciferný činitel = dva mezisoučty, druhý posunutý o místo.",
      steps: [
        "Zapiš čísla pod sebe (menší dole).",
        "Násobíme spodní číslici jednotek s každou číslicí horního čísla zprava, přenosi zapiš nad sloupec.",
        "Výsledek zapíšeme (první mezisoučet).",
        "Při dvouciferném spodním: násobíme desetinu, výsledek posuneme o 1 místo vlevo (druhý mezisoučet).",
        "Sečteme mezisoučty → konečný výsledek.",
      ],
      commonMistake: "Zapomenutí posunout druhý mezisoučet o jedno místo vlevo při násobení dvouciferným činitelem.",
      example: "234 × 12:\n  234 × 2 = 468\n  234 × 10 = 2 340\n  468 + 2 340 = 2 808",
    },
  },
];
