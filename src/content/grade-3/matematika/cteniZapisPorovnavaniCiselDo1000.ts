import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";

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

  // level 1: čísla do 200, level 2: do 500, level 3: do 1000
  const max = level === 1 ? 200 : level === 2 ? 500 : 1000;

  for (let i = 0; i < 40; i++) {
    const type = i % 4;

    if (type === 0) {
      // Zápis číslem — slovně popsané číslo
      const stovky = Math.floor(Math.random() * Math.floor(max / 100));
      const desitky = Math.floor(Math.random() * 10);
      const jednotky = Math.floor(Math.random() * 10);
      const n = stovky * 100 + desitky * 10 + jednotky;
      const slovy = n === 0 ? "nula" :
        (stovky > 0 ? pad(stovky, "STOVKA") + " " : "") +
        (desitky > 0 ? pad(desitky, "DESÍTKA") + " " : "") +
        (jednotky > 0 ? pad(jednotky, "JEDNOTKA") : "");
      tasks.push({
        question: `Zapiš číslo: ${slovy.trim()}`,
        correctAnswer: String(n),
        options: shuffle([String(n), String(n + 10), String(n + 100), String(n - 1 > 0 ? n - 1 : n + 1)]),
        hints: ["Sečti všechny části dohromady.", "Stovky × 100 + desítky × 10 + jednotky = výsledné číslo."],
        solutionSteps: [`Stovky: ${stovky} × 100 = ${stovky * 100}`, `Desítky: ${desitky} × 10 = ${desitky * 10}`, `Jednotky: ${jednotky}`, `Celkem: ${n}`],
      });
    } else if (type === 1) {
      // Porovnávání — větší / menší
      const a = Math.floor(Math.random() * max) + 1;
      let b = Math.floor(Math.random() * max) + 1;
      while (b === a) b = Math.floor(Math.random() * max) + 1;
      const correct = a > b ? ">" : "<";
      tasks.push({
        question: `Porovnej: ${a} vs ${b}`,
        correctAnswer: correct,
        options: shuffle([">", "<", "="]),
        hints: [`Kolik stovek má ${a} a kolik ${b}? Začni porovnávat od stovek.`, "Porovnej stovky — kdo má více, je větší. Stejné stovky? Porovnej desítky, pak jednotky."],
        solutionSteps: [`Porovnáváme ${a} a ${b}.`, a > b ? `${a} > ${b} — první číslo je větší.` : `${a} < ${b} — první číslo je menší.`],
      });
    } else if (type === 2) {
      // Rozklad čísla na stovky, desítky, jednotky
      const n = Math.floor(Math.random() * (max - 1)) + 1;
      const s = Math.floor(n / 100);
      const d = Math.floor((n % 100) / 10);
      const j = n % 10;
      const correct = `${pad(s, "STOVKA")}, ${pad(d, "DESÍTKA")}, ${pad(j, "JEDNOTKA")}`;
      tasks.push({
        question: `Rozlož číslo ${n}: kolik má stovek, desítek a jednotek?`,
        correctAnswer: correct,
        options: shuffle([
          correct,
          `${pad(s + 1, "STOVKA")}, ${pad(d, "DESÍTKA")}, ${pad(j, "JEDNOTKA")}`,
          `${pad(s, "STOVKA")}, ${pad(d + 1, "DESÍTKA")}, ${pad(j, "JEDNOTKA")}`,
          `${pad(s, "STOVKA")}, ${pad(d, "DESÍTKA")}, ${pad(j + 1, "JEDNOTKA")}`,
        ]),
        hints: ["Stovky = první číslice, desítky = prostřední, jednotky = poslední.", "U tříciferného čísla (např. 347): stovky = 3, desítky = 4, jednotky = 7. Každá číslice stojí na svém místě!"],
        solutionSteps: [`${n}: číslice stovek = ${s}, číslice desítek = ${d}, číslice jednotek = ${j}.`],
      });
    } else {
      // Řazení čísel
      const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * max) + 1);
      const sorted = [...nums].sort((a, b) => a - b);
      tasks.push({
        question: `Seřaď čísla od nejmenšího: ${shuffle([...nums]).join(", ")}`,
        correctAnswer: sorted.join(", "),
        options: shuffle([
          sorted.join(", "),
          [...sorted].reverse().join(", "),
          [sorted[1], sorted[0], sorted[2], sorted[3]].join(", "),
          [sorted[0], sorted[2], sorted[1], sorted[3]].join(", "),
        ]),
        hints: ["Nejdřív porovnej stovky, pak desítky, pak jednotky.", "Číslo s nejméně stovkami jde první — pokud jsou stovky stejné, rozhodují desítky."],
        solutionSteps: [`Čísla: ${nums.join(", ")}`, `Seřazeno: ${sorted.join(", ")}`],
      });
    }
  }
  return tasks;
}

export const CTENIZAPISPOROVNAVANICISELDO1000: TopicMetadata[] = [
  {
    id: "g3-mat-cisla-do-1000",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-ciselny-obor-0-1000-cteni-zapis-a-porovnavani-cisel-do-1000",
    title: "Čtení, zápis a porovnávání čísel do 1000",
    studentTitle: "Čísla do 1000",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–1000",
    briefDescription: "Přečteš, zapíšeš a porovnáš čísla až do tisíce.",
    keywords: ["čísla do 1000", "stovky", "desítky", "jednotky", "porovnávání", "řazení", "rozklad"],
    goals: [
      "Přečíst a zapsat čísla do 1000.",
      "Rozložit číslo na stovky, desítky a jednotky.",
      "Porovnat a seřadit čísla do 1000.",
    ],
    boundaries: ["Pouze přirozená čísla 0–1000.", "Nezahrnuje záporná čísla ani desetinná čísla."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Každé číslo má tři části: stovky, desítky, jednotky. 357 = 3 stovky + 5 desítek + 7 jednotek.",
      steps: [
        "Podívej se na první číslici — to jsou stovky.",
        "Druhá číslice jsou desítky.",
        "Třetí číslice jsou jednotky.",
        "Pro porovnání: začni od stovek — větší stovky = větší číslo.",
      ],
      commonMistake: "Záměna desítek a jednotek: 352 ≠ 325.",
      example: "573: 5 stovek, 7 desítek, 3 jednotky. 573 > 357 (5 stovek > 3 stovky).",
    },
  },
];
