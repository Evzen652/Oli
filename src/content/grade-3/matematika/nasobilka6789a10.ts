import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildUniqueOptions, shuffleOptions } from "@/lib/content/uniqueOptions";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * PED-2 kalibrace L1 < L2 < L3.
 *
 * Před: L1 = tables [6,7], L2 = [8,9,10], L3 = celá [6..10] → L3 pool zahrnoval
 * L1+L2, `getTierTasks` (rozdíl množin) často vyřadil většinu L3, gradace šla
 * do háje.
 *
 * Teď: **disjunktní otázky**.
 *   L1  — násobek **6 a 7**, prvně učené řady (množina otázek t × n, t∈{6,7}).
 *   L2  — násobek **8 a 9**, těžší řady (množina otázek t × n, t∈{8,9}).
 *   L3  — násobek **10** (technicky snadné, ale nová řada) + **INVERZE**
 *         "? × t = c" pro t ∈ [6..10] — vyžaduje dělení / spojení dvou operací.
 * Otázky se formou (`?` na začátku vs uprostřed) nikdy nepřekrývají mezi
 * úrovněmi → rozdíl množin drží gradaci deterministicky.
 */

interface MulTask {
  t: number;
  n: number;
}

/** `t × n = ?` — standardní tvar. */
function makeForward(t: number, n: number): PracticeTask {
  const correct = t * n;
  const distractors = [
    String(correct + t),
    String(Math.max(0, correct - t)),
    String(correct + 1),
  ];
  const fallbacks = [
    String(correct - 1),
    String(correct + t + 1),
    String(correct + 2),
    String(t * (n + 1)),
    String(t * Math.max(1, n - 1)),
  ];
  const { options } = buildUniqueOptions(String(correct), distractors, fallbacks, 4);
  return {
    question: `${t} × ${n} = ?`,
    correctAnswer: String(correct),
    options: shuffleOptions(options),
    hints: [
      `${t} × ${n} = ${n}× přičteš ${t}.`,
      n === 1
        ? "Násobení jedničkou nic nemění — číslo zůstane úplně stejné."
        : `Nebo: ${t} × ${n} = ${t} + ${t} + … (${n}×)`,
    ],
    solutionSteps: [
      `${t} × ${n} = ${correct}`,
      `(${Array.from({ length: n }, () => t).join(" + ")} = ${correct})`,
    ],
  };
}

/** `? × t = c` — inverzní tvar, nutí dítě dělit. */
function makeInverse(t: number, n: number): PracticeTask {
  const c = t * n;
  const distractors = [
    String(n + 1),
    String(Math.max(1, n - 1)),
    String(n + 2),
  ];
  const fallbacks = [
    String(Math.max(1, n - 2)),
    String(n + 3),
    String(n + t),
  ];
  const { options } = buildUniqueOptions(String(n), distractors, fallbacks, 4);
  return {
    question: `? × ${t} = ${c}`,
    correctAnswer: String(n),
    options: shuffleOptions(options),
    hints: [
      `Zeptej se: kolikrát vezmu ${t}, abych dostal ${c}?`,
      `To je totéž jako ${c} ÷ ${t}.`,
    ],
    solutionSteps: [
      `Hledám číslo x tak, že x × ${t} = ${c}.`,
      `x = ${c} ÷ ${t} = ${n}.`,
    ],
  };
}

function gen(level: number): PracticeTask[] {
  const combos: MulTask[] = [];
  if (level === 1) {
    // L1 — řady 6 a 7 (prvně naučené, kotva)
    for (const t of [6, 7]) for (let n = 1; n <= 10; n++) combos.push({ t, n });
    return shuffle(combos).slice(0, 20).map(({ t, n }) => makeForward(t, n));
  }
  if (level === 2) {
    // L2 — řady 8 a 9 (těžší, méně vídané)
    for (const t of [8, 9]) for (let n = 1; n <= 10; n++) combos.push({ t, n });
    return shuffle(combos).slice(0, 20).map(({ t, n }) => makeForward(t, n));
  }
  // L3 — desítková řada (technicky snadná, ale nová) + INVERZE napříč 6-10
  const tenSeries: MulTask[] = [];
  for (let n = 1; n <= 10; n++) tenSeries.push({ t: 10, n });
  const inverse: MulTask[] = [];
  for (const t of [6, 7, 8, 9, 10]) for (let n = 2; n <= 10; n++) inverse.push({ t, n });
  const out: PracticeTask[] = [];
  for (const { t, n } of shuffle(tenSeries).slice(0, 6)) out.push(makeForward(t, n));
  for (const { t, n } of shuffle(inverse).slice(0, 14)) out.push(makeInverse(t, n));
  return shuffle(out);
}

export const NASOBILKA6789A10: TopicMetadata[] = [
  {
    id: "g3-mat-nasobilka-6-10",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-nasobilka-nasobilka-6-7-8-9-10-cela-mala-nasobilka",
    title: "Násobilka 6, 7, 8, 9, 10 (celá malá násobilka)",
    studentTitle: "Násobilka 6–10",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobilka",
    briefDescription: "Procvičíš násobilku 6, 7, 8, 9 a 10 zpaměti.",
    keywords: ["násobilka", "násobení", "6", "7", "8", "9", "10", "malá násobilka"],
    goals: [
      "Zpaměti ovládat násobilku 6 až 10.",
      "Rychle odpovídat na příklady typu 7 × 8.",
      "Rozpoznat výsledek v obou pořadích (8 × 7 = 7 × 8).",
      "Najít chybějící činitel v příkladu (? × 7 = 56).",
    ],
    boundaries: ["Pouze násobilka 6–10.", "Nezahrnuje písemné násobení ani velkou násobilku."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Každý příklad v násobilce se dá spočítat opakovaným sčítáním: 6 × 4 = 6+6+6+6 = 24. U inverzních úloh (? × 7 = 56) se ptej: kolikrát vezmu 7, abych dostal 56?",
      steps: [
        "Nauč se násobilku 6, pak 7, pak 8, 9, 10.",
        "Pomáhá rytmické odříkávání: 6, 12, 18, 24, 30…",
        "Záměnnost: 6 × 7 = 7 × 6 — vyber tu, co znáš lépe.",
        "Inverze: ? × 7 = 56 → hledám ekvivalent 56 ÷ 7.",
      ],
      commonMistake: "Záměna výsledků 7×8=56 a 8×8=64 — jsou blízko u sebe.",
      example: "7 × 8: 7+7=14, 14+7=21, 21+7=28, 28+7=35, 35+7=42, 42+7=49, 49+7=56. Výsledek: 56.",
    },
  },
];
