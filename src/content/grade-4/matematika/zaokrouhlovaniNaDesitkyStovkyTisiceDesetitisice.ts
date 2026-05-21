import type { TopicMetadata, PracticeTask } from "@/lib/types";

type Round = 10 | 100 | 1000 | 10000;

function roundTo(n: number, to: Round): number {
  return Math.round(n / to) * to;
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // level 1: zaokrouhlení na desítky a stovky (čísla do 9 999)
  // level 2: zaokrouhlení na tisíce (čísla do 99 999)
  // level 3: zaokrouhlení na desetitisíce (čísla do 999 999)

  const configs: { to: Round; max: number }[] = level === 1
    ? [{ to: 10, max: 9999 }, { to: 100, max: 9999 }]
    : level === 2
      ? [{ to: 100, max: 99999 }, { to: 1000, max: 99999 }]
      : [{ to: 1000, max: 999999 }, { to: 10000, max: 999999 }];

  const labels: Record<Round, string> = {
    10: "desítky",
    100: "stovky",
    1000: "tisíce",
    10000: "desetitisíce",
  };

  for (let i = 0; i < 40; i++) {
    const cfg = configs[i % configs.length];
    const n = Math.floor(Math.random() * (cfg.max - cfg.to)) + cfg.to;
    const correct = roundTo(n, cfg.to);
    const label = labels[cfg.to];

    const d1 = correct + cfg.to;
    const d2 = correct - cfg.to;
    const d3 = correct + cfg.to * 2;

    tasks.push({
      question: `Zaokrouhli číslo ${fmt(n)} na ${label}.`,
      correctAnswer: fmt(correct),
      options: shuffle([fmt(correct), fmt(d1), fmt(d2 > 0 ? d2 : d1 * 2)].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)
        .concat(fmt(d3)).slice(0, 4)),
      hints: [
        `Podívej se na číslici řádu těsně pod ${label} (tj. ${labelBelow(cfg.to)}).`,
        `Je-li tato číslice ≥ 5, zaokrouhli nahoru; je-li < 5, zaokrouhli dolů (nul zbytek).`,
      ],
      solutionSteps: [
        `${fmt(n)} → zaokrouhlujeme na ${label}.`,
        `Číslice ${labelBelow(cfg.to)}: ${digitAt(n, cfg.to / 10 || 1)}.`,
        digitAt(n, cfg.to / 10 || 1) >= 5
          ? `≥ 5 → zaokrouhlujeme nahoru → ${fmt(correct)}.`
          : `< 5 → zaokrouhlujeme dolů → ${fmt(correct)}.`,
      ],
    });
  }

  return tasks;
}

function digitAt(n: number, place: number): number {
  return Math.floor(n / place) % 10;
}

function labelBelow(to: Round): string {
  const map: Record<Round, string> = {
    10: "jednotek",
    100: "desítek",
    1000: "stovek",
    10000: "tisíců",
  };
  return map[to];
}

function fmt(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/ /g, " ");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ZAOKROUHLOVANI: TopicMetadata[] = [
  {
    id: "g4-mat-zaokrouhlovani-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-ciselny-obor-0-1-000-000-zaokrouhlovani-na-desitky-stovky-tisice-desetitisice",
    title: "Zaokrouhlování čísel",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–1 000 000",
    briefDescription: "Žák zaokrouhluje přirozená čísla na desítky, stovky, tisíce a desetitisíce — správně aplikuje pravidlo ≥ 5 nahoru, < 5 dolů.",
    keywords: [
      "zaokrouhlování", "zaokrouhlit na desítky", "zaokrouhlit na stovky",
      "zaokrouhlit na tisíce", "odhad", "přibližná hodnota",
    ],
    goals: [
      "Zaokrouhlit číslo na desítky, stovky, tisíce nebo desetitisíce.",
      "Vysvětlit pravidlo zaokrouhlování (číslice ≥ 5 / < 5).",
      "Využít zaokrouhlování pro odhad výsledku výpočtu.",
    ],
    boundaries: [
      "Pouze přirozená čísla do 999 999.",
      "Nezahrnuje zaokrouhlování desetinných čísel.",
      "Nezahrnuje zaokrouhlování na setiny nebo jiné malé řády.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Podívej se na číslici řádu těsně pod tím, na který zaokrouhlujeme. Je-li ≥ 5, přičti 1 k vyšší číslici; je-li < 5, nech ji. Všechny nižší číslice nahraď nulami.",
      steps: [
        "Urči, na jaký řád zaokrouhlujeme (desítky, stovky…).",
        "Podívej se na číslici o jeden řád níže.",
        "Je-li tato číslice ≥ 5 → zaokrouhlujeme nahoru (přičteme 1 k danému řádu).",
        "Je-li tato číslice < 5 → zaokrouhlujeme dolů (nechme řád beze změny).",
        "Všechny číslice nižšího řádu nahradíme nulami.",
      ],
      commonMistake: "Zaokrouhlení čísla 4 500 na tisíce: děti napíší 4 000 místo 5 000 (číslice stovek je 5 → nahoru).",
      example: "3 762 zaokrouhlíme na stovky: číslice desítek = 6 ≥ 5 → 3 800.",
    },
  },
];
