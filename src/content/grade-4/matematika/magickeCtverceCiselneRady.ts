import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildUniqueOptions, shuffleOptions } from "@/lib/content/uniqueOptions";

/**
 * Magické čtverce 3×3 a číselné řady.
 *
 * PED-3 kalibrace L1<L2<L3.
 * Před: L2 a L3 vracely stejný typ úloh (chybějící člen uprostřed řady + magic
 * čtverec), gradace se opírala jen o volbu vzoru řady. L3 pool se z velké
 * části překrýval s L2 → `getTierTasks` (rozdíl množin) L3 dost. Distraktor
 * u magic čtverce byl bug (vždycky centrální hodnota, tedy `magicSum/3`).
 *
 * Teď disjunktní obtížnost:
 *   L1 — malé magické sumy (15, 18); aritmetické řady s krokem +2/+3, hledá se
 *        DALŠÍ člen.
 *   L2 — střední sumy (21, 24); aritmetické +5/+7, hledá se CHYBĚJÍCÍ člen
 *        uprostřed (2 pohledy: před i za).
 *   L3 — velké sumy (27, 30); nelineární vzory (čtverce n², trojúhelníková
 *        čísla, geometrická ×2), hledá se VZDÁLENÝ 7. člen (extrapolace).
 */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Standardní 3×3 magický čtverec s magickou sumou = 3×center. */
function makeSquare(magicSum: number): number[][] | null {
  if (magicSum % 3 !== 0) return null;
  const center = magicSum / 3;
  const base = [
    [2, 7, 6],
    [9, 5, 1],
    [4, 3, 8],
  ];
  const shift = center - 5;
  return base.map((row) => row.map((v) => v + shift));
}

function magicTask(magicSum: number, seed: number): PracticeTask {
  const sq = makeSquare(magicSum);
  if (!sq) throw new Error(`makeSquare selhal pro magicSum=${magicSum}`);
  const positions: [number, number][] = [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]];
  const [r, c] = positions[seed % positions.length];
  const missing = sq[r][c];

  const rows = sq.map((row, ri) =>
    row.map((v, ci) => (ri === r && ci === c ? "?" : String(v))).join(" | "),
  );

  // Distraktory: sousední hodnoty a časté omyly (záměna řádku/sloupce).
  const distractors = [
    String(missing + 1),
    String(Math.max(1, missing - 1)),
    String(missing + 2),
  ];
  const fallbacks = [
    String(Math.max(1, missing - 2)),
    String(missing + 3),
    String(magicSum - missing), // "doplněk" k magicSum
  ];
  const { options } = buildUniqueOptions(String(missing), distractors, fallbacks, 4);

  return {
    question: `Magický čtverec — součet v každém řádku, sloupci i úhlopříčce je ${magicSum}.\n${rows.join("\n")}\nJaké číslo patří místo „?"?`,
    correctAnswer: String(missing),
    options: shuffleOptions(options),
    hints: [
      `V každém řádku, sloupci i úhlopříčce musí být součet ${magicSum}.`,
      `Najdi řádek nebo sloupec s „?" a odečti od ${magicSum} součet ostatních čísel.`,
    ],
    solutionSteps: [
      `Magická suma = ${magicSum}.`,
      `Součet řádku/sloupce bez „?" = ${magicSum - missing}.`,
      `Chybějící číslo = ${magicSum} − ${magicSum - missing} = ${missing}.`,
    ],
  };
}

interface Series {
  name: string;
  seq: (n: number) => number;
}

const ARITHMETIC_SMALL: Series[] = [
  { name: "aritmetická (+2)", seq: (n) => 3 + n * 2 },
  { name: "aritmetická (+3)", seq: (n) => 2 + n * 3 },
];

const ARITHMETIC_MID: Series[] = [
  { name: "aritmetická (+5)", seq: (n) => 5 + n * 5 },
  { name: "aritmetická (+7)", seq: (n) => 1 + n * 7 },
];

// A6 (kolo 2): L3 nelineární posloupnosti (n², trojúhelníková čísla,
// geometrická ×2) jsou nad běžné RVP 4. ročníku — jde o zamýšlené
// enrichment (rozšiřující obsah), ne standardní curriculum.
// Fond rozšířen o Fibonacci, geometrickou ×3 a kvadratické rozdíly,
// aby se řady v pouhých 10 L3 úlohách neopakovaly.
const NONLINEAR: Series[] = [
  { name: "čtverce n²", seq: (n) => (n + 1) * (n + 1) },
  { name: "trojúhelníková čísla", seq: (n) => ((n + 1) * (n + 2)) / 2 },
  { name: "geometrická (×2)", seq: (n) => Math.pow(2, n + 1) },
  // Rozšíření fondu — A6 doporučení
  { name: "geometrická (×3)", seq: (n) => Math.pow(3, n) * 2 },
  { name: "Fibonacci (posloupnost)", seq: (n) => {
      const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
      return fib[n] ?? fib[fib.length - 1];
    } },
  { name: "kubická čísla n³", seq: (n) => (n + 1) * (n + 1) * (n + 1) },
];

function nextTermTask(sd: Series, seed: number): PracticeTask {
  const terms = Array.from({ length: 5 }, (_, k) => sd.seq(k));
  const next = sd.seq(5);
  const step = terms[1] - terms[0];
  const distractors = [
    String(next + step),
    String(Math.max(1, next - 1)),
    String(next + 2),
  ];
  const fallbacks = [String(next + 1), String(Math.max(1, next - 2)), String(next + step + 1)];
  const { options } = buildUniqueOptions(String(next), distractors, fallbacks, 4);
  // seed unused pro deterministickou výslednou úlohu (kotva: teď je pořadí
  // rozhodnuto pořadím ve vnějším cyklu)
  void seed;
  return {
    question: `Číselná řada: ${terms.join(", ")}, ?\nJaké číslo následuje?`,
    correctAnswer: String(next),
    options: shuffleOptions(options),
    hints: [`Najdi vzor — o kolik se každý člen zvětšuje?`],
    solutionSteps: [`Vzor: ${sd.name}. Následující člen = ${next}.`],
  };
}

function missingMiddleTask(sd: Series, seed: number): PracticeTask {
  const terms = Array.from({ length: 5 }, (_, k) => sd.seq(k));
  const missingIdx = 2;
  const missing = terms[missingIdx];
  const shown = terms.map((v, idx) => (idx === missingIdx ? "?" : String(v))).join(", ");
  const distractors = [
    String(missing + 1),
    String(Math.max(1, missing - 1)),
    String(missing + 2),
  ];
  const fallbacks = [String(Math.max(1, missing - 2)), String(missing + 3)];
  const { options } = buildUniqueOptions(String(missing), distractors, fallbacks, 4);
  void seed;
  return {
    question: `Číselná řada: ${shown}\nJaké číslo chybí uprostřed?`,
    correctAnswer: String(missing),
    options: shuffleOptions(options),
    hints: [`Podívej se na čísla před i za „?".`, `Ověř, že rozdíl (nebo podíl) mezi sousedy je konstantní.`],
    solutionSteps: [`Vzor: ${sd.name}. Chybí: ${missing}.`],
  };
}

function farTermTask(sd: Series, seed: number): PracticeTask {
  const shown = Array.from({ length: 4 }, (_, k) => sd.seq(k));
  const targetIdx = 6; // 7. člen (extrapolace)
  const target = sd.seq(targetIdx);
  const distractors = [
    String(sd.seq(targetIdx - 1)),
    String(sd.seq(targetIdx + 1)),
    String(target + 1),
  ];
  const fallbacks = [String(Math.max(1, target - 1)), String(target + 10)];
  const { options } = buildUniqueOptions(String(target), distractors, fallbacks, 4);
  void seed;
  return {
    question: `Číselná řada: ${shown.join(", ")}, …\nJaký je 7. člen řady (bereme 1. člen = ${shown[0]})?`,
    correctAnswer: String(target),
    options: shuffleOptions(options),
    hints: [
      `Najdi vzor — ${sd.name}.`,
      `Pak podle vzoru dopočítej členy až po 7. pozici.`,
    ],
    solutionSteps: [
      `Vzor: ${sd.name}.`,
      `Členy: ${Array.from({ length: 7 }, (_, k) => sd.seq(k)).join(", ")}.`,
      `7. člen = ${target}.`,
    ],
  };
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  if (level === 1) {
    const sums = [15, 18];
    for (let i = 0; i < 12; i++) tasks.push(magicTask(sums[i % sums.length], i));
    for (let i = 0; i < 8; i++) tasks.push(nextTermTask(ARITHMETIC_SMALL[i % ARITHMETIC_SMALL.length], i));
  } else if (level === 2) {
    const sums = [21, 24];
    for (let i = 0; i < 12; i++) tasks.push(magicTask(sums[i % sums.length], i));
    for (let i = 0; i < 8; i++) tasks.push(missingMiddleTask(ARITHMETIC_MID[i % ARITHMETIC_MID.length], i));
  } else {
    const sums = [27, 30];
    for (let i = 0; i < 10; i++) tasks.push(magicTask(sums[i % sums.length], i));
    for (let i = 0; i < 10; i++) tasks.push(farTermTask(NONLINEAR[i % NONLINEAR.length], i));
  }
  return shuffle(tasks);
}

export const MAGICKE_CTVERCE_RADY: TopicMetadata[] = [
  {
    id: "g4-mat-magicke-ctverce-ciselne-rady-4",
    rvpNodeId: "g4-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-magicke-ctverce-ciselne-rady",
    displayName: "Magické čtverce a řady",
    title: "Magické čtverce a číselné řady",
    studentTitle: "Magické čtverce",
    subject: "matematika",
    category: "Nestandardní aplikační úlohy a problémy",
    topic: "Logické úlohy",
    briefDescription: "Najdeš chybějící čísla a odhalíš tajemství číselné řady.",
    keywords: [
      "magický čtverec", "číselná řada", "vzor", "logická úloha",
      "aritmetická řada", "posloupnost", "extrapolace",
    ],
    goals: [
      "Doplnit chybějící číslo v magickém čtverci 3×3.",
      "Rozpoznat vzor číselné řady a určit chybějící nebo další člen.",
      "Extrapolovat řadu na vzdálený člen (7. člen).",
      "Procvičit logické myšlení a systematický postup.",
    ],
    boundaries: [
      "Pouze magické čtverce 3×3.",
      "Číselné řady: aritmetické, geometrické, čtverce, trojúhelníková čísla.",
      "Nezahrnuje sudoku ani jiné logické hry.",
      "L3 obsahuje enrichment (čtverce n², trojúhelníková čísla, Fibonacci) nad rámec běžného RVP 4. ročníku.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "mixed",
    recommendedNext: ["g4-mat-aritmeticky-prumer-4", "g4-mat-tabulky-diagramy-4"],
    generator: gen,
    helpTemplate: {
      hint: "Magický čtverec: každý řádek, sloupec i obě úhlopříčky mají stejný součet. Číselná řada: najdi, o kolik se každý člen mění (nebo jaký vzor tvoří).",
      steps: [
        "Magický čtverec: urči magickou sumu (zadána nebo odhadni ze známého řádku).",
        'Najdi řádek/sloupec s „?" a odečti součet ostatních čísel od magické sumy.',
        "Číselná řada: porovnej sousední členy — je rozdíl stejný? → aritmetická. Podíl stejný? → geometrická.",
        "Vzdálený člen: použij vzor a systematicky dopočítej krok za krokem.",
      ],
      commonMistake: "U číselných řad: předpoklad, že vzor je vždy +1 nebo +2 — může jít i o čtverce čísel, trojúhelníková čísla nebo geometrickou řadu.",
      example: "Magická suma 15, řádek: 2, 7, ? → 15 − 2 − 7 = 6. Číselná řada: 1, 4, 9, 16, ? → čtverce čísel → 25.",
    },
  },
];
