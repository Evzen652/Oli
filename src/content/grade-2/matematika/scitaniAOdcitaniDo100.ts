import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Adaptivní nápověda podle konkrétního příkladu.
 * Parsuje operandy z otázky ("X + Y = ?" / "X − Y = ?") a rozliší,
 * zda dochází k přechodu přes desítku — rada se tomu přizpůsobí.
 * U příkladů bez přechodu se desítky nemění, takže neradíme "počítat po desítkách".
 */
function hintFor(question: string): string {
  const m = question.match(/(\d+)\s*([+−])\s*(\d+)/);
  if (!m) return "Počítej nejdřív desítky, pak jednotky.";
  const x = Number(m[1]);
  const y = Number(m[3]);
  const op = m[2];
  const xu = x % 10;
  const yu = y % 10;
  if (op === "+") {
    return xu + yu >= 10
      ? "Nejdřív dopočítej do desítky, pak přidej zbytek."
      : "Desítky zůstanou — stačí sečíst jednotky.";
  }
  return xu < yu
    ? "Půjč si jednu desítku, pak odečti jednotky."
    : "Desítky zůstanou — stačí odečíst jednotky.";
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 30; i++) {
    let a: number, b: number, correct: number, question: string;

    if (level === 1) {
      // Bez přechodu přes desítku
      const tens = Math.floor(Math.random() * 8) * 10 + 10;
      const units = Math.floor(Math.random() * (10 - (tens % 10 || 10)));
      a = tens - Math.floor(Math.random() * 5) * 10 + Math.floor(Math.random() * 5);
      // Jednodušší: přímé příklady bez přechodu
      const base = Math.floor(Math.random() * 8) * 10;
      const add = Math.floor(Math.random() * (9 - (base % 100 === 0 ? 0 : 0)));
      a = base + Math.floor(Math.random() * 5) + 1;
      b = Math.floor(Math.random() * (10 - (a % 10))) ;
      if (b === 0) b = 1;
      const op = Math.random() < 0.5 ? "+" : "-";
      if (op === "+") {
        correct = a + b;
        question = `${a} + ${b} = ?`;
      } else {
        if (a < b) [a, b] = [b, a];
        // ensure no underflow of tens digit
        const aUnits = a % 10;
        const bAdj = Math.min(b, aUnits);
        b = bAdj === 0 ? 1 : bAdj;
        correct = a - b;
        question = `${a} − ${b} = ?`;
      }
    } else if (level === 2) {
      // S přechodem přes desítku
      const tens = (Math.floor(Math.random() * 8) + 1) * 10;
      const rem = Math.floor(Math.random() * 9) + 1;
      a = tens - rem; // e.g. 27
      b = rem + Math.floor(Math.random() * 5) + 1; // překročí desítku
      if (Math.random() < 0.5) {
        correct = a + b;
        question = `${a} + ${b} = ?`;
      } else {
        const sum = tens + Math.floor(Math.random() * 9) + 1;
        a = sum;
        b = rem + Math.floor(Math.random() * 5) + 1;
        if (b >= a) b = Math.floor(a / 2);
        correct = a - b;
        question = `${a} − ${b} = ?`;
      }
    } else {
      // L3: větší čísla s přechodem
      a = Math.floor(Math.random() * 40) + 30;
      b = Math.floor(Math.random() * 25) + 10;
      if (Math.random() < 0.5 && a + b <= 100) {
        correct = a + b;
        question = `${a} + ${b} = ?`;
      } else {
        if (a < b) [a, b] = [b, a];
        correct = a - b;
        question = `${a} − ${b} = ?`;
      }
    }

    const d1 = correct + 1;
    const d2 = correct - 1 >= 0 ? correct - 1 : correct + 2;
    const d3 = correct + 10 <= 100 ? correct + 10 : correct - 10;

    const opts = shuffle(
      [String(correct), String(d1), String(d2), String(d3)]
        .filter((v, idx, arr) => arr.indexOf(v) === idx && Number(v) >= 0)
        .slice(0, 4)
    );

    tasks.push({
      question,
      correctAnswer: String(correct),
      options: opts,
      hints: [hintFor(question)],
      solutionSteps: [`${question.replace("?", String(correct))}`],
    });
  }

  return tasks;
}

export const SCITANIAODCITANIDO100: TopicMetadata[] = [
  {
    id: "g2-mat-scitani-odcitani-100",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-ciselny-obor-0-100-scitani-a-odcitani-do-100-bez-i-s-prechodem-desitky",
    title: "Sčítání a odčítání do 100 (bez i s přechodem desítky)",
    studentTitle: "Počítám do 100",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–100",
    briefDescription: "Sčítáš a odčítáš čísla do 100.",
    keywords: ["sčítání", "odčítání", "do 100", "plus", "mínus", "počítání"],
    goals: [
      "Sčítat a odčítat čísla do 100 bez přechodu přes desítku.",
      "Sčítat a odčítat čísla do 100 s přechodem přes desítku.",
      "Rychle počítat v oboru do 100.",
    ],
    boundaries: [
      "Pouze čísla do 100.",
      "Nezahrnuje násobení ani dělení.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Počítej po desítkách, pak doplň jedničky.",
      steps: [
        "Rozlož číslo na desítky a jedničky (např. 27 = 20 + 7).",
        "Přičítej nebo odečítej desítky jako první.",
        "Pak přičítej nebo odečítej jedničky.",
      ],
      commonMistake: "Zapomenutí přechodu přes desítku — zkontroluj výsledek.",
      example: "27 + 6: 27 + 3 = 30, pak 30 + 3 = 33.",
    },
  },
];
