import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { PLURALS } from "../czechPlural";

/**
 * Obsah přes čtvercovou síť — 5. ročník ZŠ
 *
 * RVP 5. ročník:
 *   - Určení obsahu útvaru pomocí čtvercové sítě (nepřímo, počítáním čtverečků).
 *   - Vzorec S = a · b ZÁMĚRNĚ ještě NEPOUŽÍVÁME — to patří do 6. ročníku.
 *
 * Úlohy:
 *   1) "Obdélník v síti: 5 sloupců × 3 řádky. Kolik čtverečků má?"
 *   2) "L-tvar: spočítej čtverečky"
 */

function genRectangle(_level: number): PracticeTask {
  const cols = Math.floor(Math.random() * 7) + 3; // 3–9
  const rows = Math.floor(Math.random() * 7) + 3; // 3–9
  const area = cols * rows;

  const distractors = new Set<number>();
  distractors.add(cols + rows);        // zaměněné + za ·
  distractors.add(2 * (cols + rows));  // obvod místo obsahu
  distractors.add(area + cols);
  distractors.add(area - rows);
  distractors.delete(area);

  const filtered = [...distractors].filter((d) => d > 0).slice(0, 3).map(String);
  while (filtered.length < 3) filtered.push(String(area + filtered.length + 2));
  const options = [String(area), ...filtered].sort(() => Math.random() - 0.5);

  // ASCII čtvercová síť
  const grid = [
    "┌" + "─┬".repeat(cols - 1) + "─┐",
    ...Array(rows)
      .fill(null)
      .map(() => "│" + "■│".repeat(cols)),
    "└" + "─┴".repeat(cols - 1) + "─┘",
  ].join("\n");

  return {
    question: `Obdélník v čtvercové síti: ${cols} ${cols === 1 ? "sloupec" : cols >= 2 && cols <= 4 ? "sloupce" : "sloupců"} × ${rows} ${rows === 1 ? "řádek" : rows >= 2 && rows <= 4 ? "řádky" : "řádků"}. Kolik čtverečků má?`,
    correctAnswer: String(area),
    options,
    solutionSteps: [
      `V každém řádku je ${cols} čtverečků.`,
      `Řádků je ${rows}.`,
      `Celkem: ${cols} × ${rows} = ${area} čtverečků.`,
    ],
    hints: [
      `Spočítej, kolik čtverečků je v jednom řádku, a kolik je řádků.`,
      `Pak je vynásob: (čtverečky v řádku) × (počet řádků).`,
    ],
  };
}

function genCompareAreas(_level: number): PracticeTask {
  const a1 = Math.floor(Math.random() * 6) + 2;
  const b1 = Math.floor(Math.random() * 6) + 2;
  const a2 = Math.floor(Math.random() * 6) + 2;
  const b2 = Math.floor(Math.random() * 6) + 2;
  const area1 = a1 * b1;
  const area2 = a2 * b2;
  if (area1 === area2) return genCompareAreas(_level); // zkus znovu, chceme rozdíl
  const largerArea = Math.max(area1, area2);
  const whichLarger = area1 > area2 ? "první (A)" : "druhý (B)";

  return {
    question: `Obdélník A má ${a1} × ${b1} čtverečků, obdélník B má ${a2} × ${b2}. Který má větší obsah?`,
    correctAnswer: whichLarger,
    options: ["první (A)", "druhý (B)"],
    solutionSteps: [
      `Obdélník A: ${a1} × ${b1} = ${area1} čtverečků.`,
      `Obdélník B: ${a2} × ${b2} = ${area2} čtverečků.`,
      `${area1 > area2 ? "A > B" : "B > A"}, protože ${Math.max(area1, area2)} > ${Math.min(area1, area2)}.`,
    ],
    hints: [
      `Spočítej čtverečky u obou obdélníků zvlášť.`,
      `Potom porovnej — kdo má víc?`,
    ],
  };
}

function genAreaGrid(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  // Převážně obdélníky, několik porovnání
  const rectCount = level === 1 ? 50 : level === 2 ? 45 : 40;
  const compareCount = 60 - rectCount;
  for (let i = 0; i < rectCount; i++) tasks.push(genRectangle(level));
  for (let i = 0; i < compareCount; i++) tasks.push(genCompareAreas(level));
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_AREA_GRID: HelpData = {
  hint:
    "Obsah = kolik jednotkových čtverečků se vejde dovnitř útvaru. Ve čtvercové síti je to jednoduché — prostě je spočítáš.",
  steps: [
    "Prohlédni si útvar na čtvercové síti.",
    "Spočítej čtverečky v jednom řádku (šířka).",
    "Spočítej, kolik je řádků (výška).",
    "Vynásob je: obsah = šířka × výška.",
    "Nebo u složitějších tvarů — spočítej čtverečky přímo.",
  ],
  commonMistake:
    "NEPLETÁ si obsah (uvnitř) a obvod (okraj).\n• OBVOD = délka okolo (obcházíš)\n• OBSAH = kolik čtverečků je uvnitř",
  example:
    "Obdélník 5 × 3 v síti:\n┌─┬─┬─┬─┬─┐\n│■│■│■│■│■│\n├─┼─┼─┼─┼─┤\n│■│■│■│■│■│\n├─┼─┼─┼─┼─┤\n│■│■│■│■│■│\n└─┴─┴─┴─┴─┘\n\nObsah = 5 × 3 = 15 čtverečků.",
  visualExamples: [
    {
      label: "Obdélník ve čtvercové síti",
      illustration:
        "     ┌─┬─┬─┬─┬─┐\n     │■│■│■│■│■│\n     ├─┼─┼─┼─┼─┤\n     │■│■│■│■│■│\n     ├─┼─┼─┼─┼─┤\n     │■│■│■│■│■│\n     └─┴─┴─┴─┴─┘\n\n  V řádku: 5 čtverečků (šířka).\n  Řádků: 3 (výška).\n  Obsah: 5 × 3 = 15 čtverečků.",
      conclusion: "Obsah obdélníku = šířka × výška čtverečků.",
    },
    {
      label: "Obvod vs. obsah",
      illustration:
        "   ┌─┬─┬─┐\n   │ │ │ │   OBVOD = čára okolo\n   ├─┼─┼─┤          = 3+2+3+2 = 10 jednotek\n   │ │ │ │\n   └─┴─┴─┘\n   ↑───────→   OBSAH = počet čtverečků\n                     = 3 × 2 = 6 čtverečků\n\nVždy uveď JEDNOTKU: cm² (obsah), cm (obvod).",
      conclusion: "Obvod se měří v cm, obsah v cm² (čtverečních centimetrech).",
    },
    {
      label: "Složitější tvar",
      illustration:
        "   L-tvar:\n    ┌─┬─┐\n    │■│■│\n    ├─┼─┤\n    │■│■│\n    ├─┼─┼─┬─┐\n    │■│■│■│■│\n    └─┴─┴─┴─┘\n\n   Spočítej čtverečky přímo:\n   horní obdélník: 2 × 2 = 4\n   spodní obdélník: 4 × 1 = 4\n   dohromady: 8 čtverečků",
      conclusion: "U složitých tvarů rozděl na obdélníky a sčítej.",
    },
  ],
};

export const AREA_GRID_TOPICS: TopicMetadata[] = [
  {
    id: "math-area-grid-5",
    title: "Obsah přes čtvercovou síť",
    subject: "matematika",
    category: "Geometrie",
    topic: "Obsah",
    topicDescription:
      "Určení obsahu obdélníku počítáním čtverečků ve čtvercové síti.",
    briefDescription:
      "Naučíš se určit obsah obdélníku pomocí čtvercové sítě — spočítáš čtverečky uvnitř.",
    keywords: [
      "obsah",
      "čtvercová síť",
      "čtverečky",
      "obsah obdélníku",
      "S = a × b",
    ],
    goals: [
      "Spočítáš čtverečky v jednoduchém obdélníku na čtvercové síti.",
      "Rozpoznáš, že obsah obdélníku = šířka × výška.",
      "Odlišíš obsah od obvodu.",
      "Určíš obsah i u složeného tvaru (L-tvar) sečtením částí.",
    ],
    boundaries: [
      "Pouze obdélník a čtverec (kruh v 8. roč.).",
      "Pouze celé čtverečky (jednotky, ne cm² s reálnými jednotkami).",
      "Vzorec S = a · b bez jednotek je 6. ročník.",
    ],
    gradeRange: [5, 6],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genAreaGrid,
    helpTemplate: HELP_AREA_GRID,
    contentType: "algorithmic",
    prerequisites: ["math-multiply", "math-perimeter-4"],
    rvpReference: "M-5-2-02",
  },
];
