import type { TopicMetadata, PracticeTask } from "@/lib/types";

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // level 1: 4-cifernná čísla (do 9 999), bez přechodu
  // level 2: 5-ciferná čísla (do 99 999), s přechodem
  // level 3: 6-ciferná čísla (do 999 999), s přechodem + odčítání s výpůjčkou

  const count = 40;

  for (let i = 0; i < count; i++) {
    const isAdd = Math.random() < 0.55;

    let a: number, b: number;

    if (level === 1) {
      a = Math.floor(Math.random() * 5000) + 1000;   // 1 000–5 999
      b = Math.floor(Math.random() * 3000) + 1000;   // 1 000–3 999
      if (!isAdd && b > a) [a, b] = [b, a];
    } else if (level === 2) {
      a = Math.floor(Math.random() * 50000) + 10000; // 10 000–59 999
      b = Math.floor(Math.random() * 30000) + 10000; // 10 000–39 999
      if (!isAdd && b > a) [a, b] = [b, a];
    } else {
      a = Math.floor(Math.random() * 500000) + 100000; // 100 000–599 999
      b = Math.floor(Math.random() * 300000) + 100000; // 100 000–399 999
      if (!isAdd && b > a) [a, b] = [b, a];
    }

    const correct = isAdd ? a + b : a - b;
    const op = isAdd ? "+" : "−";

    // Distraktory: blízké hodnoty (±1, ±10, ±100)
    const offsets = isAdd
      ? [1, -1, 10, -10, 100, -100]
      : [1, -1, 10, -10, 100, -100];
    const distractors = offsets
      .map(o => correct + o)
      .filter(v => v > 0 && v !== correct);
    const opts = shuffle([correct, distractors[0], distractors[2], distractors[4]])
      .map(String);

    tasks.push({
      question: `${fmt(a)} ${op} ${fmt(b)} = ?`,
      correctAnswer: String(correct),
      options: opts,
      hints: [
        isAdd
          ? `Zapiš čísla pod sebe tak, aby jednotky byly pod jednotkami.`
          : `Zapiš menšenec (${fmt(a)}) nad menšitel (${fmt(b)}).`,
        isAdd
          ? `Sčítej sloupec po sloupci zprava: jednotky, desítky, stovky…`
          : `Odčítej sloupec po sloupci zprava. Kde nestačí, půjč si z vyššího řádu.`,
      ],
      solutionSteps: isAdd
        ? [
            `Zapíšeme: ${fmt(a)} + ${fmt(b)}`,
            `Sčítáme zprava: ${a % 10} + ${b % 10} = ${(a + b) % 10}${(a + b) % 10 !== (a % 10 + b % 10) ? " (přenos 1)" : ""}`,
            `Výsledek: ${fmt(correct)}`,
          ]
        : [
            `Zapíšeme: ${fmt(a)} − ${fmt(b)}`,
            `Odčítáme zprava, výpůjčka kde je třeba.`,
            `Výsledek: ${fmt(correct)}`,
          ],
    });
  }

  return tasks;
}

function fmt(n: number): string {
  // Formátuje číslo s mezerou jako oddělovačem tisíců (české konvence)
  return n.toLocaleString("cs-CZ").replace(/ /g, " ");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const PISEMNE_SCITANI_ODCITANI: TopicMetadata[] = [
  {
    id: "g4-mat-pisemne-scitani-odcitani-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-scitani-a-odcitani-vicecifernych-cisel",
    displayName: "Písemné sčítání a odčítání",
    title: "Písemné sčítání a odčítání",
    studentTitle: "Sčítání pod sebou",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Naučíš se sčítat a odčítat velká čísla pod sebou.",
    keywords: [
      "sčítání", "odčítání", "písemné sčítání", "písemné odčítání",
      "víceciferná čísla", "přenos", "výpůjčka", "sloupec",
    ],
    goals: [
      "Zarovnat víceciferná čísla podle řádů a provést písemný součet.",
      "Provést písemný rozdíl s výpůjčkou z vyššího řádu.",
      "Zkontrolovat výsledek zpětným odčítáním / sčítáním.",
    ],
    boundaries: [
      "Nezahrnuje násobení ani dělení.",
      "Nezahrnuje desetinná čísla.",
      "Rozsah: čísla do 999 999 (level 3).",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-pisemne-nasobeni-4", "g4-mat-cisla-do-milionu-4"],
    generator: gen,
    helpTemplate: {
      hint: "Zapiš čísla pod sebe (jednotky pod jednotky, desítky pod desítky) a počítej sloupec po sloupci zprava.",
      steps: [
        "Zapiš čísla pod sebe — zarovnej řády.",
        "Začni od sloupce jednotek (nejpravější).",
        "Sčítáš-li: pokud součet ≥ 10, zapiš jednotky a přenes 1 do dalšího sloupce.",
        "Odčítáš-li: pokud nestačí, půjč si 1 z vyššího řádu (zvýší o 10, sousedu ubere 1).",
        "Postup opakuj pro desítky, stovky, tisíce…",
      ],
      commonMistake: "Děti zapomínají zarovnat řády (např. tisíce pod stovky) nebo zahodí přenos do dalšího sloupce.",
      example: "2 847 + 1 365:\n  2 847\n+ 1 365\n------\n  4 212  (7+5=12 → píšeme 2, neseme 1; 4+6+1=11 → píšeme 1, neseme 1; …)",
    },
  },
];
