import type { TopicMetadata, PracticeTask } from "@/lib/types";

const SOUMERNE: string[] = [
  "čtverec", "obdélník", "rovnostranný trojúhelník", "rovnoramenný trojúhelník",
  "kruh", "pravidelný šestiúhelník", "písmeno A", "písmeno M",
  "srdce", "hvězda", "motýl", "list stromu",
];

const NESOUMERNE: string[] = [
  "různostranný trojúhelník", "šikmý rovnoběžník (kosodélník)",
  "písmeno F", "písmeno G", "nepravidelný pětiúhelník",
  "klíč", "šroubovák",
];

const OSY_POCTY: { tvar: string; pocet: number }[] = [
  { tvar: "čtverec", pocet: 4 },
  { tvar: "obdélník", pocet: 2 },
  { tvar: "rovnostranný trojúhelník", pocet: 3 },
  { tvar: "rovnoramenný trojúhelník", pocet: 1 },
  { tvar: "kruh", pocet: -1 }, // nekonečně mnoho
  { tvar: "různostranný trojúhelník", pocet: 0 },
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 40; i++) {
    if (level === 1) {
      // Je útvar osově souměrný?
      const isSym = i % 2 === 0;
      const name = isSym
        ? SOUMERNE[i % SOUMERNE.length]
        : NESOUMERNE[i % NESOUMERNE.length];
      tasks.push({
        question: `Je útvar „${name}" osově souměrný?`,
        correctAnswer: isSym ? "Ano" : "Ne",
        options: ["Ano", "Ne"],
        hints: ["Osově souměrný útvar — lze ho přeložit tak, aby se obě půlky překryly."],
        solutionSteps: [
          isSym
            ? `„${name}" lze přeložit podél osy − obě poloviny se překryjí → Ano.`
            : `„${name}" nelze přeložit tak, aby se obě poloviny překryly → Ne.`,
        ],
      });
    } else if (level === 2) {
      // Kolik os souměrnosti?
      const entry = OSY_POCTY[i % OSY_POCTY.length];
      const correctStr = entry.pocet === -1 ? "Nekonečně mnoho" : String(entry.pocet);
      const d = [0, 1, 2, 3, 4].map(String).filter(v => v !== correctStr);
      tasks.push({
        question: `Kolik os souměrnosti má ${entry.tvar}?`,
        correctAnswer: correctStr,
        options: shuffle([correctStr, d[0], d[1], entry.pocet === -1 ? "1" : "Nekonečně mnoho"]
          .filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
        hints: [
          "Osa souměrnosti = přímka, podél které útvar přeložíme a obě části se překryjí.",
        ],
        solutionSteps: [`${entry.tvar} → ${correctStr} osa/os souměrnosti.`],
      });
    } else {
      // Složitější — souměrný obraz bodu
      const coords = [
        { A: [2, 3], osa: "svislá osa (x=0)", B: [-2, 3] },
        { A: [4, 1], osa: "vodorovná osa (y=0)", B: [4, -1] },
        { A: [3, 5], osa: "svislá osa (x=0)", B: [-3, 5] },
        { A: [1, 4], osa: "vodorovná osa (y=0)", B: [1, -4] },
      ][i % 4];
      const correct = `[${coords.B[0]}, ${coords.B[1]}]`;
      tasks.push({
        question: `Bod A ${JSON.stringify(coords.A)} odraz přes ${coords.osa}. Kde leží souměrný obraz?`,
        correctAnswer: correct,
        options: shuffle([
          correct,
          `[${-coords.B[0]}, ${coords.B[1]}]`,
          `[${coords.B[0]}, ${-coords.B[1]}]`,
          `[${-coords.B[0]}, ${-coords.B[1]}]`,
        ].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
        hints: [
          "Při odrazu přes svislou osu se mění znaménko souřadnice x.",
          "Při odrazu přes vodorovnou osu se mění znaménko souřadnice y.",
        ],
        solutionSteps: [`Odraz A ${JSON.stringify(coords.A)} přes ${coords.osa} = ${correct}.`],
      });
    }
  }
  return tasks;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const OSOVA_SOUMERNOST: TopicMetadata[] = [
  {
    id: "g4-mat-osova-soumernost-4",
    rvpNodeId: "g4-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-osa-soumerne-utvary",
    title: "Osová souměrnost",
    studentTitle: "Osová souměrnost",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Souměrnost",
    briefDescription: "Poznáš souměrné tvary a najdeš jejich osu.",
    keywords: [
      "osová souměrnost", "osa souměrnosti", "souměrný útvar",
      "zrcadlení", "překládání", "symetrie",
    ],
    goals: [
      "Rozpoznat, zda je útvar osově souměrný.",
      "Nakreslit osu souměrnosti daného útvaru.",
      "Určit počet os souměrnosti základních útvarů.",
    ],
    boundaries: [
      "Pouze osová (zrcadlová) souměrnost.",
      "Nezahrnuje středovou souměrnost.",
      "Nezahrnuje rotační symetrii.",
    ],
    gradeRange: [4, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Útvar je osově souměrný, pokud ho lze přeložit podél osy souměrnosti tak, aby se obě poloviny dokonale překryly (jako motýlí křídla).",
      steps: [
        "Zkus mentálně přeložit útvar podél svislé osy.",
        "Překrývají se obě půlky? → osa souměrnosti existuje.",
        "Zkus i vodorovnou a šikmou osu.",
        "Kolikrát to funguje = počet os souměrnosti.",
      ],
      commonMistake: "Obdélník má 2 osy souměrnosti (ne 4 jako čtverec) — úhlopříčky obdélníku NEJSOU osy souměrnosti.",
      example: "Čtverec: 4 osy (2 přes středy stran, 2 úhlopříčky). Obdélník: 2 osy (přes středy stran).",
    },
  },
];
