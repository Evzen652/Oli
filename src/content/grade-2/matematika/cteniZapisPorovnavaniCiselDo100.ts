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

  for (let i = 0; i < 30; i++) {
    let question: string, correct: string, opts: string[], hint: string;

    if (level === 1) {
      // Porovnání dvou čísel
      let a = Math.floor(Math.random() * 99) + 1;
      let b = Math.floor(Math.random() * 99) + 1;
      while (a === b) b = Math.floor(Math.random() * 99) + 1;
      question = `Které je větší: ${a} nebo ${b}?`;
      correct = String(Math.max(a, b));
      opts = shuffle([String(a), String(b)]);
      hint = "Srovnej desítky — větší desítka, větší číslo.";
    } else if (level === 2) {
      // O 1 více / méně
      const base = Math.floor(Math.random() * 97) + 2;
      if (Math.random() < 0.5) {
        question = `O 1 víc než ${base} je ?`;
        correct = String(base + 1);
        const d1 = String(base - 1);
        const d2 = String(base + 2);
        const d3 = String(base + 10);
        opts = shuffle([correct, d1, d2, d3].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4));
      } else {
        question = `O 1 míň než ${base} je ?`;
        correct = String(base - 1);
        const d1 = String(base + 1);
        const d2 = String(base - 2);
        const d3 = String(base - 10);
        opts = shuffle([correct, d1, d2, d3].filter((v, i, a) => a.indexOf(v) === i && Number(v) >= 0).slice(0, 4));
      }
      hint = "Stačí přidat nebo ubrat jednu jedničku.";
    } else {
      // L3: O 10 více / méně
      const base = Math.floor(Math.random() * 80) + 10;
      if (Math.random() < 0.5) {
        question = `O 10 víc než ${base} je ?`;
        correct = String(base + 10);
        const d1 = String(base - 10);
        const d2 = String(base + 1);
        const d3 = String(base + 20);
        opts = shuffle([correct, d1, d2, d3].filter((v, i, a) => a.indexOf(v) === i && Number(v) <= 100).slice(0, 4));
      } else {
        question = `O 10 míň než ${base} je ?`;
        correct = String(base - 10);
        const d1 = String(base + 10);
        const d2 = String(base - 1);
        const d3 = String(base - 20);
        opts = shuffle([correct, d1, d2, d3].filter((v, i, a) => a.indexOf(v) === i && Number(v) >= 0).slice(0, 4));
      }
      hint = "Přidej nebo uber jednu celou desítku.";
    }

    tasks.push({
      question,
      correctAnswer: correct,
      options: opts,
      hints: [hint],
      solutionSteps: [`Odpověď: ${correct}`],
    });
  }

  return tasks;
}

export const CTENIZAPISPOROVNAVANICISELDO100: TopicMetadata[] = [
  {
    id: "g2-mat-cteni-zapis-100",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-ciselny-obor-0-100-cteni-zapis-a-porovnavani-cisel-do-100",
    title: "Čtení, zápis a porovnávání čísel do 100",
    studentTitle: "Čísla do 100",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–100",
    briefDescription: "Porovnáš čísla do 100 a najdeš větší nebo menší.",
    keywords: ["porovnávání", "větší", "menší", "čísla do 100", "čtení čísel"],
    goals: [
      "Přečíst a zapsat čísla do 100.",
      "Porovnat dvě čísla a určit větší nebo menší.",
      "Určit číslo o 1 nebo 10 větší/menší.",
    ],
    boundaries: ["Pouze čísla 0–100.", "Bez záporných čísel."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Srovnej nejdřív desítky — větší desítka = větší číslo.",
      steps: [
        "Podívej se na cifru desítek.",
        "Větší cifra desítek = větší číslo.",
        "Pokud jsou desítky stejné, srovnej jedničky.",
      ],
      commonMistake: "34 vs 43 — 43 je větší, protože má víc desítek (4 > 3).",
      example: "34 nebo 43? Desítky: 3 < 4 → 43 je větší.",
    },
  },
];
