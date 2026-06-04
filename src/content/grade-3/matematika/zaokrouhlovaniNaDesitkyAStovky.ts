import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function roundTo(n: number, to: number): number {
  return Math.round(n / to) * to;
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 40; i++) {
    const toDesitky = level <= 2 || i % 2 === 0;
    const to = toDesitky ? 10 : 100;
    const max = to === 10 ? 990 : 900;
    const n = Math.floor(Math.random() * (max - to)) + to;
    const correct = roundTo(n, to);
    const label = toDesitky ? "desítky" : "stovky";
    const d1 = correct + to;
    const d2 = correct - to > 0 ? correct - to : correct + to * 2;

    tasks.push({
      question: `Zaokrouhli číslo ${n} na ${label}.`,
      correctAnswer: String(correct),
      options: shuffle([String(correct), String(d1), String(d2), String(correct + to * 2)].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)),
      hints: [
        `Zaokrouhlujeme na ${label} — podívej se na číslici ${toDesitky ? "jednotek" : "desítek"}.`,
        `Je-li tato číslice 5 nebo víc → zaokrouhli nahoru. Je-li méně než 5 → zaokrouhli dolů.`,
      ],
      solutionSteps: [
        `Číslo ${n}, zaokrouhlujeme na ${label}.`,
        `Číslice ${toDesitky ? "jednotek" : "desítek"}: ${toDesitky ? n % 10 : Math.floor(n / 10) % 10}.`,
        (toDesitky ? n % 10 : Math.floor(n / 10) % 10) >= 5
          ? `≥ 5 → zaokrouhlujeme nahoru → ${correct}.`
          : `< 5 → zaokrouhlujeme dolů → ${correct}.`,
      ],
    });
  }
  return tasks;
}

export const ZAOKROUHLOVANINADESITKYASTOVKY: TopicMetadata[] = [
  {
    id: "g3-mat-zaokrouhlovani",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-ciselny-obor-0-1000-zaokrouhlovani-na-desitky-a-stovky",
    title: "Zaokrouhlování na desítky a stovky",
    studentTitle: "Zaokrouhlování",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–1000",
    briefDescription: "Naučíš se zaokrouhlovat čísla na desítky a stovky.",
    keywords: ["zaokrouhlování", "desítky", "stovky", "nahoru", "dolů", "odhad"],
    goals: [
      "Zaokrouhlit číslo na desítky.",
      "Zaokrouhlit číslo na stovky.",
      "Použít pravidlo: číslice ≥ 5 → nahoru, < 5 → dolů.",
    ],
    boundaries: ["Čísla do 1000.", "Nezahrnuje zaokrouhlování na tisíce."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Podívej se na číslici hned za tím řádem, na který zaokrouhlujeme. Je-li 5 nebo víc → přidáme 1. Je-li méně než 5 → necháme.",
      steps: [
        "Na desítky: dívej se na číslici jednotek.",
        "Na stovky: dívej se na číslici desítek.",
        "Číslice ≥ 5 → zaokrouhlujeme nahoru.",
        "Číslice < 5 → zaokrouhlujeme dolů (nižší číslice dáme nulu).",
      ],
      commonMistake: "Číslo 450 zaokrouhlené na stovky je 500 (číslice desítek = 5 ≥ 5 → nahoru), ne 400.",
      example: "376 na desítky: číslice jednotek = 6 ≥ 5 → 380. Na stovky: číslice desítek = 7 ≥ 5 → 400.",
    },
  },
];
