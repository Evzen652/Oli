import type { TopicMetadata, PracticeTask } from "@/lib/types";

// Magické čtverce 3×3 a číselné řady s různými vzory.

function genMagicSquare3x3(magicSum: number): number[][] | null {
  // Používáme standardní vzorec pro lichá n:
  // pro n=3, base=1: čtverec 1..9 se magickou sumou 15
  // Škálujeme: hodnoty = base + (1..9-1)*step
  // magicSum = 3 * center → center = magicSum/3
  if (magicSum % 3 !== 0) return null;
  const center = magicSum / 3;
  // Pro 3×3 magický čtverec: center musí být průměr → 5 při base=1
  // Generický vzorec: values = center - 4..+4 rozmístěné standardně
  const offsets = [
    [2, 7, 6],
    [9, 5, 1],
    [4, 3, 8],
  ]; // standardní magický čtverec, magická suma = 15, střed = 5
  const shift = center - 5;
  return offsets.map(row => row.map(v => v + shift));
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 40; i++) {
    const useMagic = i % 2 === 0 && level >= 1;

    if (useMagic) {
      // Magický čtverec — chybějící číslo
      const magicSums = [15, 18, 21, 24, 27];
      const ms = magicSums[i % magicSums.length];
      const sq = genMagicSquare3x3(ms);
      if (!sq) { tasks.push(tasks[0] ?? { question: "?", correctAnswer: "1", options: ["1"] }); continue; }

      // Skryjeme jedno políčko (ne střed)
      const positions: [number, number][] = [[0,0],[0,2],[1,0],[1,2],[2,0],[2,2]];
      const [r, c] = positions[i % positions.length];
      const missing = sq[r][c];

      const rows = sq.map((row, ri) =>
        row.map((v, ci) => (ri === r && ci === c ? "?" : String(v))).join(" | ")
      );

      tasks.push({
        question: `Magický čtverec — součet v každém řádku, sloupci i úhlopříčce je ${ms}.\n${rows.join("\n")}\nJaké číslo patří místo „?"?`,
        correctAnswer: String(missing),
        options: shuffle([String(missing), String(missing + 1), String(missing - 1), String(missing + ms / 3 - missing)]
          .filter((v, idx, arr) => arr.indexOf(v) === idx && parseInt(v) > 0).slice(0, 4)),
        hints: [
          `V každém řádku, sloupci i úhlopříčce musí být součet ${ms}.`,
          `Najdi řádek nebo sloupec s „?" a odečti od ${ms} součet ostatních čísel.`,
        ],
        solutionSteps: [
          `Magická suma = ${ms}.`,
          `Součet řádku/sloupce bez „?" = ${ms - missing}.`,
          `Chybějící číslo = ${ms} − ${ms - missing} = ${missing}.`,
        ],
      });
    } else {
      // Číselná řada — najdi další číslo nebo chybějící člen
      type SeriesDef = { name: string; seq: (n: number) => number };
      const seriesDefs: SeriesDef[] = [
        { name: "aritmetická (+3)", seq: n => 2 + n * 3 },
        { name: "aritmetická (+5)", seq: n => 5 + n * 5 },
        { name: "aritmetická (+7)", seq: n => 1 + n * 7 },
        { name: "geometrická (×2)", seq: n => Math.pow(2, n + 1) },
        { name: "čtverce", seq: n => (n + 1) * (n + 1) },
        { name: "trojúhelníková čísla", seq: n => (n + 1) * (n + 2) / 2 },
      ];
      const sd = seriesDefs[i % seriesDefs.length];
      const terms = Array.from({ length: 5 }, (_, k) => sd.seq(k));
      const next = sd.seq(5);

      if (level === 1) {
        // Najdi další člen
        tasks.push({
          question: `Číselná řada: ${terms.join(", ")}, ?\nJaké číslo následuje?`,
          correctAnswer: String(next),
          options: shuffle([String(next), String(next + terms[1] - terms[0]), String(next - 1), String(next + 2)]
            .filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
          hints: [`Najdi vzor — o kolik se každý člen zvětšuje?`],
          solutionSteps: [`Vzor: ${sd.name}. Následující člen = ${next}.`],
        });
      } else {
        // Chybějící člen uprostřed
        const missingIdx = 2;
        const shown = [...terms];
        shown[missingIdx] = -1;
        const missing = terms[missingIdx];
        tasks.push({
          question: `Číselná řada: ${shown.map((v, idx) => idx === missingIdx ? "?" : v).join(", ")}\nJaké číslo chybí?`,
          correctAnswer: String(missing),
          options: shuffle([String(missing), String(missing + 1), String(missing - 1), String(missing + 3)]
            .filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
          hints: [`Podívej se na čísla před i za „?".`],
          solutionSteps: [`Vzor: ${sd.name}. Chybí: ${missing}.`],
        });
      }
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
      "aritmetická řada", "posloupnost",
    ],
    goals: [
      "Doplnit chybějící číslo v magickém čtverci 3×3.",
      "Rozpoznat vzor číselné řady a určit chybějící nebo další člen.",
      "Procvičit logické myšlení a systematický postup.",
    ],
    boundaries: [
      "Pouze magické čtverce 3×3.",
      "Číselné řady s jednoduchým vzorem (aritmetické, geometrické, čtverce).",
      "Nezahrnuje sudoku ani jiné logické hry.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "mixed",
    recommendedNext: ["g4-mat-aritmeticky-prumer-4", "g4-mat-tabulky-diagramy-4"],
    generator: gen,
    helpTemplate: {
      hint: "Magický čtverec: každý řádek, sloupec i obě úhlopříčky mají stejný součet. Číselná řada: najdi, o kolik se každý člen mění.",
      steps: [
        "Magický čtverec: urči magickou sumu (zadána nebo odhadni ze známého řádku).",
        "Najdi radek/sloupec s '?' a odecti soucet ostatnich cisel od magicke sumy.",
        "Číselná řada: porovnej sousední členy — je rozdíl stejný? → aritmetická. Podíl stejný? → geometrická.",
      ],
      commonMistake: "U číselných řad: předpoklad, že vzor je vždy +1 nebo +2 — může jít i o čtverce čísel nebo trojúhelníková čísla.",
      example: "Magická suma 15, řádek: 2, 7, ? → 15 − 2 − 7 = 6. Číselná řada: 1, 4, 9, 16, ? → čtverce čísel → 25.",
    },
  },
];
