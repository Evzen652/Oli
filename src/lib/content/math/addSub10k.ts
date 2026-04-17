import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { PLURALS } from "../czechPlural";

/**
 * Sčítání a odčítání do 10 000 — 4. ročník ZŠ
 * Deterministický generátor, matematická správnost zaručena konstrukcí.
 *
 * Tři úrovně obtížnosti:
 *   Level 1: stovky, bez přechodu (např. 300 + 400)
 *   Level 2: stovky+desítky s přechodem (např. 280 + 450)
 *   Level 3: čtyřmístná čísla (např. 3 450 + 2 780)
 */

function fmtNum(n: number): string {
  // Český zápis s mezerou mezi tisíci: "1 234" místo "1234"
  return n.toLocaleString("cs-CZ").replace(/\u00A0/g, " ");
}

function genAddSub10k(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 60; i++) {
    const isAdd = Math.random() > 0.5;
    let a: number;
    let b: number;

    if (level === 1) {
      // Celé stovky, bez přechodu přes tisíc
      a = (Math.floor(Math.random() * 8) + 1) * 100;
      b = (Math.floor(Math.random() * 8) + 1) * 100;
    } else if (level === 2) {
      // Trojmístná čísla se stovkami a desítkami
      a = Math.floor(Math.random() * 700) + 200; // 200–899
      b = Math.floor(Math.random() * 400) + 100; // 100–499
    } else {
      // Čtyřmístná čísla
      a = Math.floor(Math.random() * 7000) + 1500; // 1500–8499
      b = Math.floor(Math.random() * 3000) + 500;  // 500–3499
    }

    // Pro odčítání zajistíme a ≥ b (žádné záporné výsledky)
    if (!isAdd && a < b) [a, b] = [b, a];

    // Sčítání nesmí překročit 10 000
    if (isAdd && a + b > 10000) {
      a = Math.floor(a / 2);
      b = Math.floor(b / 2);
    }

    const result = isAdd ? a + b : a - b;
    const op = isAdd ? "+" : "−";

    // Distraktory — typické chyby
    const distractors = new Set<number>();
    distractors.add(isAdd ? a - b : a + b);      // opačná operace
    distractors.add(result + 10);                 // chyba v desítkách
    distractors.add(result - 10);                 // chyba v desítkách
    distractors.add(result + 100);                // chyba ve stovkách
    distractors.add(isAdd ? result - 100 : result + 100);
    distractors.delete(result);

    const filtered = [...distractors].filter((d) => d > 0 && d <= 10000).slice(0, 3);
    while (filtered.length < 3) filtered.push(result + (filtered.length + 1) * 7);

    const options = [result, ...filtered].sort(() => Math.random() - 0.5).map(fmtNum);

    // Postup řešení — rozklad na řády (tisíce, stovky, desítky, jednotky)
    const solutionSteps: string[] = [];
    if (level === 1) {
      // Jednoduchý rozklad stovek
      const stovkyA = a / 100;
      const stovkyB = b / 100;
      const stovkyVysl = result / 100;
      solutionSteps.push(
        `${fmtNum(a)} = ${stovkyA} ${PLURALS.stovek(stovkyA)}, ${fmtNum(b)} = ${stovkyB} ${PLURALS.stovek(stovkyB)}.`,
        isAdd
          ? `${stovkyA} + ${stovkyB} = ${stovkyVysl} ${PLURALS.stovek(stovkyVysl)}.`
          : `${stovkyA} − ${stovkyB} = ${stovkyVysl} ${PLURALS.stovek(stovkyVysl)}.`,
        `${stovkyVysl} ${PLURALS.stovek(stovkyVysl)} = ${fmtNum(result)}.`,
      );
    } else if (level === 2) {
      // Rozklad na stovky + desítky + jednotky
      const roundedA = Math.floor(a / 100) * 100;
      const restA = a - roundedA;
      solutionSteps.push(
        `Rozlož si ${fmtNum(a)} na ${fmtNum(roundedA)} + ${restA}.`,
        isAdd
          ? `${fmtNum(roundedA)} ${op} ${fmtNum(b)} = ${fmtNum(roundedA + b)}.`
          : `${fmtNum(roundedA)} ${op} ${fmtNum(b)} = ${fmtNum(roundedA - b)}.`,
        isAdd
          ? `A ještě přičti ${restA}: ${fmtNum(roundedA + b)} + ${restA} = ${fmtNum(result)}.`
          : `A přičti zpátky ${restA}: ${fmtNum(roundedA - b)} + ${restA} = ${fmtNum(result)}.`,
      );
    } else {
      // Čtyřmístná čísla — písemné sloupce
      solutionSteps.push(
        `Napiš čísla pod sebe tak, aby jednotky byly pod jednotkami, desítky pod desítkami…`,
        isAdd
          ? `Sčítej postupně od jednotek. Pokud přesáhneš 10, přenes 1 do vyššího řádu.`
          : `Odčítej postupně od jednotek. Pokud si musíš půjčit, uber z vyššího řádu.`,
        `Výsledek: ${fmtNum(result)}.`,
      );
    }

    tasks.push({
      question: `${fmtNum(a)} ${op} ${fmtNum(b)} =`,
      correctAnswer: fmtNum(result),
      options,
      solutionSteps,
      hints: [
        isAdd
          ? `Přičítáš k ${fmtNum(a)} číslo ${fmtNum(b)}.`
          : `Od čísla ${fmtNum(a)} odčítáš ${fmtNum(b)}.`,
        level === 1
          ? `Spočítej si nejdřív, kolik je ${a / 100} ${op} ${b / 100} (v ${PLURALS.stovek(Math.max(a / 100, b / 100))}).`
          : `Rozlož si čísla na tisíce, stovky, desítky a jednotky.`,
      ],
    });
  }
  return tasks;
}

const HELP_ADD_SUB_10K: HelpData = {
  hint:
    "Větší čísla si rozlož na tisíce, stovky, desítky a jednotky — a počítej řád po řádu. Je to jako stavebnice z kostek!",
  steps: [
    "Přečti si příklad — sčítáš (+) nebo odčítáš (−)?",
    "Rozlož obě čísla: kolik má tisíců, stovek, desítek, jednotek?",
    "Sečti (nebo odečti) stejné řády mezi sebou.",
    "Pokud ti v řádu vyjde víc než 9, přenes jedničku do vyššího řádu.",
    "Spočítej výsledek. Zkontroluj, že dává smysl — není moc velký nebo moc malý?",
  ],
  commonMistake:
    "Pozor na přenos! Když sčítáš 280 + 450: 8 + 5 = 13, to je víc než 10. Napíšeš 3 a 1 si přeneseš do řádu stovek.",
  example:
    "3 450 + 2 780 = ?\n3 000 + 2 000 = 5 000 (tisíce)\n400 + 700 = 1 100 (stovky)\n50 + 80 = 130 (desítky)\n5 000 + 1 100 + 130 = 6 230 ✓",
  visualExamples: [
    {
      label: "Sčítání po řádech",
      illustration:
        "  3 4 5 0\n+ 2 7 8 0\n─────────\n  6 2 3 0\n\nSčítej od jednotek:\n• 0 + 0 = 0\n• 5 + 8 = 13 → napíšeš 3, přeneseš 1\n• 4 + 7 + 1 = 12 → napíšeš 2, přeneseš 1\n• 3 + 2 + 1 = 6 → napíšeš 6",
      conclusion: "Přenos ze nižšího řádu do vyššího přičítáš k dalším číslicím.",
    },
    {
      label: "Odčítání s výpůjčkou",
      illustration:
        "  4 0 0 0\n− 1 2 7 0\n─────────\n  2 7 3 0\n\nKdyž nemáš od čeho odčítat, půjč si:\n• Jednotky: 0 − 0 = 0\n• Desítky: 0 − 7 → půjč ze stovek → 10 − 7 = 3\n• Stovky: (po výpůjčce) 9 − 2 = 7\n• Tisíce: 3 − 1 = 2\n\nVýsledek: 2 730",
      conclusion: "Výpůjčku si vezmeš z vyššího řádu, ten se zmenší o 1.",
    },
  ],
};

export const ADD_SUB_10K_TOPICS: TopicMetadata[] = [
  {
    id: "math-add-sub-10k-4",
    title: "Sčítání a odčítání do 10 000",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Sčítání a odčítání do 10 000",
    topicDescription: "Pamětné i písemné sčítání a odčítání čísel do 10 000.",
    briefDescription: "Naučíš se sčítat a odčítat velká čísla — do deseti tisíc.",
    keywords: ["sčítání", "odčítání", "do 10000", "do 10 000", "plus", "mínus", "velká čísla", "tisíce"],
    goals: [
      "Sečteš dvě čísla, jejichž součet je nejvýše 10 000.",
      "Odečteš od sebe dvě čísla (bez záporného výsledku).",
      "Rozložíš čísla na tisíce, stovky, desítky a jednotky.",
      "Použiješ přenos mezi řády a výpůjčku.",
    ],
    boundaries: [
      "Pouze kladná čísla 0–10 000.",
      "Žádné desetinné čárky.",
      "Žádné násobení ani dělení.",
    ],
    gradeRange: [4, 5],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genAddSub10k,
    helpTemplate: HELP_ADD_SUB_10K,
    contentType: "algorithmic",
    prerequisites: ["math-add-sub-100"],
    rvpReference: "M-5-1-02",
  },
];
