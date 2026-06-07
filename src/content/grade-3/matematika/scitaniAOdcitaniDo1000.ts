import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 40; i++) {
    const isAdd = i % 2 === 0;
    // level 1: bez přechodu přes stovku, level 2: s přechodem, level 3: smíšené velké
    const max = level === 1 ? 500 : level === 2 ? 800 : 1000;

    let a: number, b: number, correct: number;
    if (isAdd) {
      a = Math.floor(Math.random() * (max - 50)) + 10;
      b = Math.floor(Math.random() * Math.min(200, max - a)) + 1;
      correct = a + b;
    } else {
      a = Math.floor(Math.random() * (max - 10)) + 20;
      b = Math.floor(Math.random() * (a - 1)) + 1;
      correct = a - b;
    }

    const op = isAdd ? "+" : "−";
    const d1 = correct + (level === 1 ? 1 : 10);
    const d2 = correct - (level === 1 ? 1 : 10) > 0 ? correct - (level === 1 ? 1 : 10) : correct + 20;
    const d3 = correct + (level === 1 ? 10 : 100);

    tasks.push({
      question: `${a} ${op} ${b} = ?`,
      correctAnswer: String(correct),
      options: shuffle([String(correct), String(d1), String(d2), String(d3)].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
      hints: [
        level >= 2 ? "Dávej pozor na přechod přes desítky nebo stovky." : "Sčítej jednotky, pak desítky.",
        isAdd
          ? "Sčítej po složkách: nejdřív stovky, pak desítky, pak jednotky — každou část zvlášť."
          : "Odečítej od stovek: nejprve desítky, pak jednotky — s přechodem pokud je třeba.",
      ],
      solutionSteps: isAdd
        ? [`${a} + ${b}`, `= ${correct}`]
        : [`${a} − ${b}`, `= ${correct}`],
    });
  }
  return tasks;
}

export const SCITANIAODCITANIDO1000: TopicMetadata[] = [
  {
    id: "g3-mat-scitani-odcitani-1000",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-ciselny-obor-0-1000-scitani-a-odcitani-do-1000-pametne-i-pisemne",
    title: "Sčítání a odčítání do 1000 (pamětné i písemné)",
    studentTitle: "Počítám do 1000",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–1000",
    briefDescription: "Sečteš a odečteš čísla až do tisíce zpaměti i písemně.",
    keywords: ["sčítání", "odčítání", "do 1000", "pamětný počet", "písemný počet", "přechod přes stovku"],
    goals: [
      "Sčítat čísla do 1000 pamětně i písemně.",
      "Odčítat čísla do 1000 pamětně i písemně.",
      "Zvládnout přechod přes desítku a stovku.",
    ],
    boundaries: ["Čísla do 1000.", "Nezahrnuje násobení ani dělení."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Při sčítání začni od jednotek, pak desítky, pak stovky. Dávej pozor na přechod přes 10 nebo 100.",
      steps: [
        "Zapiš čísla pod sebe (jednotky pod jednotky, desítky pod desítky).",
        "Sčítej/odčítej jednotky.",
        "Sčítej/odčítej desítky (nezapomeň na přenos z jednotek).",
        "Sčítej/odčítej stovky.",
      ],
      commonMistake: "Zapomenutí na přenos: 358 + 64 = 412 (ne 3112).",
      example: "247 + 135: jednotky 7+5=12 (zapíšeme 2, přeneseme 1), desítky 4+3+1=8, stovky 2+1=3 → 382.",
    },
  },
];
