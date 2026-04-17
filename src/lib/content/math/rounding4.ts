import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Zaokrouhlování na desítky, stovky, tisíce — 4. ročník ZŠ
 * Rozšíření 3. ročníku (tam jen desítky) o stovky a tisíce.
 */

function fmtNum(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/\u00A0/g, " ");
}

function roundToNearest(n: number, base: number): number {
  return Math.round(n / base) * base;
}

function genRounding4(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 60; i++) {
    let num: number;
    let base: number;
    let baseLabel: string;

    if (level === 1) {
      // Zaokrouhlování na desítky (čísla 10–999)
      num = Math.floor(Math.random() * 990) + 10;
      base = 10;
      baseLabel = "desítky";
    } else if (level === 2) {
      // Zaokrouhlování na stovky (čísla 100–9999)
      num = Math.floor(Math.random() * 9900) + 100;
      base = 100;
      baseLabel = "stovky";
    } else {
      // Zaokrouhlování na tisíce (čísla 1000–99999)
      num = Math.floor(Math.random() * 99000) + 1000;
      base = 1000;
      baseLabel = "tisíce";
    }

    const rounded = roundToNearest(num, base);
    // Zbytek (klíčový koncept — pravidlo 5 a výš)
    const remainder = num % base;
    const halfBase = base / 2;
    const roundedUp = Math.ceil(num / base) * base;
    const roundedDown = Math.floor(num / base) * base;

    // Distraktory
    const distractors = new Set<number>();
    distractors.add(rounded + base);
    distractors.add(rounded - base);
    distractors.add(num); // původní číslo
    distractors.add(roundedUp === rounded ? roundedDown : roundedUp); // opačný směr
    distractors.delete(rounded);
    distractors.delete(num); // v options bychom původní číslo neměli

    const filtered = [...distractors].filter((d) => d > 0).slice(0, 3).map(fmtNum);
    // Přidat také původní pro kontrast, ale ne jako distraktor:
    while (filtered.length < 3) filtered.push(fmtNum(rounded + (filtered.length + 1) * base));

    const options = [fmtNum(rounded), ...filtered].sort(() => Math.random() - 0.5);

    const ruleExplanation =
      remainder < halfBase
        ? `Zbytek ${remainder} je menší než ${halfBase} — zaokrouhluje se DOLŮ.`
        : `Zbytek ${remainder} je ${remainder === halfBase ? "rovný" : "větší než"} ${halfBase} — zaokrouhluje se NAHORU.`;

    tasks.push({
      question: `Zaokrouhli ${fmtNum(num)} na ${baseLabel}.`,
      correctAnswer: fmtNum(rounded),
      options,
      solutionSteps: [
        `Najdi nejbližší celou ${baseLabel === "desítky" ? "desítku" : baseLabel === "stovky" ? "stovku" : "tisícovku"}.`,
        `Pod ${fmtNum(num)} je ${fmtNum(roundedDown)}, nad ní je ${fmtNum(roundedUp)}.`,
        ruleExplanation,
        `Výsledek: ${fmtNum(rounded)}.`,
      ],
      hints: [
        `Podívej se na ${baseLabel === "desítky" ? "jednotky" : baseLabel === "stovky" ? "desítky" : "stovky"} čísla ${fmtNum(num)}.`,
        `Pravidlo: méně než 5 → dolů, 5 a víc → nahoru.`,
      ],
    });
  }
  return tasks;
}

const HELP_ROUNDING_4: HelpData = {
  hint:
    "Zaokrouhlování = najít nejbližší celé číslo (desítku, stovku, tisícovku). Podívej se na další řád dolů: 0–4 → dolů, 5–9 → nahoru.",
  steps: [
    "Ujasni si, na jaký řád zaokrouhluješ (desítky? stovky? tisíce?).",
    "Najdi nejbližší celé číslo toho řádu POD i NAD tvým číslem.",
    "Podívej se na ŘÁD POD tím, na který zaokrouhluješ.",
    "Pokud je 0–4, jdi DOLŮ (menší). Pokud 5–9, jdi NAHORU (větší).",
    "Napiš výsledek.",
  ],
  commonMistake:
    "Neplete si řády! Když máš zaokrouhlit 347 na STOVKY, díváš se na DESÍTKY (tj. číslici 4). 4 < 5 → dolů → 300. NE na jednotky (7).",
  example:
    "Zaokrouhli 347 na stovky:\n• Pod 347 je 300, nad 347 je 400.\n• Desítka je 4 (protože 347 = 3 stovky, 4 desítky, 7 jednotek).\n• 4 < 5 → zaokrouhluješ DOLŮ na 300. ✓",
  visualExamples: [
    {
      label: "Pravidlo 5",
      illustration:
        "Zaokrouhluji na desítky. Číslo je 🔢:\n\n  🔢₀  🔢₁  🔢₂  🔢₃  🔢₄ │ 🔢₅  🔢₆  🔢₇  🔢₈  🔢₉\n     ←── DOLŮ ──           │       ←── NAHORU ──\n\n• 23 → 20 (3 je méně než 5, jdu dolů)\n• 27 → 30 (7 je 5 nebo víc, jdu nahoru)\n• 25 → 30 (5 se zaokrouhluje NAHORU)",
      conclusion: "Hranice je 5 — patří nahoru.",
    },
    {
      label: "Zaokrouhlování na stovky",
      illustration:
        "Zaokrouhli 1 647 na stovky:\n\n  1 6 4 7\n      ↑ ↑\n      stovky (6)  │ desítky (4)\n\nPodívám se na DESÍTKY = 4.\n4 < 5 → zaokrouhluji DOLŮ.\n\nNejbližší stovka dolů = 1 600.\n\n✓ 1 647 → 1 600",
      conclusion: "Na který řád zaokrouhluješ — na ten DALŠÍ se dívej.",
    },
    {
      label: "Zaokrouhlování na tisíce",
      illustration:
        "Zaokrouhli 5 289 na tisíce:\n\n  5 2 8 9\n  ↑ ↑\n  tisíce (5) │ stovky (2)\n\nPodívám se na STOVKY = 2.\n2 < 5 → DOLŮ.\n\nNejbližší tisícovka dolů = 5 000.\n\n✓ 5 289 → 5 000",
      conclusion: "Zaokrouhlování vždy otírá řády nižší než ten zaokrouhlovaný.",
    },
  ],
};

export const ROUNDING_4_TOPICS: TopicMetadata[] = [
  {
    id: "math-rounding-4",
    title: "Zaokrouhlování na desítky, stovky a tisíce",
    subject: "matematika",
    category: "čísla a operace",
    topic: "zaokrouhlování",
    topicDescription: "Zaokrouhlování přirozených čísel na různé řády.",
    briefDescription:
      "Naučíš se zaokrouhlit číslo na nejbližší desítku, stovku nebo tisícovku. Pravidlo: méně než 5 → dolů, 5 a víc → nahoru.",
    keywords: [
      "zaokrouhlování",
      "zaokrouhli",
      "na desítky",
      "na stovky",
      "na tisíce",
      "nejbližší",
    ],
    goals: [
      "Zaokrouhlíš číslo na desítky, stovky nebo tisíce.",
      "Použiješ pravidlo 5 — kdy nahoru, kdy dolů.",
      "Rozpoznáš, na který řád se při zaokrouhlování díváš.",
    ],
    boundaries: [
      "Pouze přirozená čísla (bez desetinných).",
      "Maximální hodnota 99 999.",
    ],
    gradeRange: [4, 5],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genRounding4,
    helpTemplate: HELP_ROUNDING_4,
    contentType: "algorithmic",
    prerequisites: ["math-rounding"],
    rvpReference: "M-5-1-03",
  },
];
