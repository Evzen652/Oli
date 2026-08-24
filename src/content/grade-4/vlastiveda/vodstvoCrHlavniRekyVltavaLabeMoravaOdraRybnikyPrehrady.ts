import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Páry: vodní prvek ↔ klíčová informace
const VSECHNY_PARY: { left: string; right: string }[] = [
  { left: "Vltava", right: "nejdelší česká řeka (430 km)" },                        // 0
  { left: "Labe", right: "pramení v Krkonoších, odtéká do Severního moře" },         // 1
  { left: "Morava", right: "ústí do Dunaje, odtéká do Černého moře" },               // 2
  { left: "Odra", right: "odtéká do Baltského moře přes Polsko" },                   // 3
  { left: "Rožmberk", right: "největší rybník ČR (Třeboňsko)" },                     // 4
  { left: "Přehrada Lipno", right: "největší vodní plocha ČR (na Vltavě)" },         // 5
  { left: "Přehrada Orlík", right: "největší vodní elektrárna ČR (na Vltavě)" },     // 6
  { left: "Třeboňsko", right: "proslulá oblast rybníků v jižních Čechách" },         // 7
  { left: "Berounka", right: "hlavní levý přítok Vltavy" },                          // 8
  { left: "Máchovo jezero", right: "známé jezero u Doks, proslavené básníkem Máchou" }, // 9
  { left: "Šumava", right: "místo pramene Vltavy" },                                 // 10
  { left: "Mělník", right: "místo, kde Vltava ústí do Labe" },                       // 11
  { left: "Severní moře", right: "moře, kam odtéká Labe" },                          // 12
  { left: "Černé moře", right: "moře, kam odtéká Morava (přes Dunaj)" },             // 13
  { left: "Baltské moře", right: "moře, kam odtéká Odra" },                          // 14
  { left: "Krkonoše", right: "místo pramene Labe" },                                 // 15
];

const VODNI_FAKTA: Record<string, string> = {
  "Vltava": "Vltava (430 km) je nejdelší česká řeka — pramení na Šumavě a ústí do Labe u Mělníka.",
  "Labe": "Labe pramení v Krkonoších a odtéká přes Německo do Severního moře.",
  "Morava": "Morava teče na jih, ústí do Dunaje a voda odtéká do Černého moře.",
  "Odra": "Odra teče přes Polsko do Baltského moře — ČR tak odvádí vodu do tří různých moří.",
  "Rožmberk": "Rožmberk je největší rybník ČR — leží v Třeboňsku v jižních Čechách.",
  "Přehrada Lipno": "Lipno je největší vodní plocha ČR — přehradní nádrž na horní Vltavě.",
  "Přehrada Orlík": "Orlík je největší vodní elektrárna ČR — stojí na řece Vltavě.",
  "Třeboňsko": "Třeboňsko je proslulá oblast rybníků — rybníkářství tu má tradici přes 500 let.",
  "Berounka": "Berounka je hlavní levý přítok Vltavy — vzniká soutokem Mže a Radbuzy u Plzně.",
  "Máchovo jezero": "Máchovo jezero leží u Doks v Libereckém kraji — je to vlastně rybník, proslavil ho básník K. H. Mácha.",
  "Šumava": "Šumava je místo pramene Vltavy — Vltava zde pramení na svazích Černé hory.",
  "Mělník": "U Mělníka se Vltava vlévá do Labe — odtud vody odtékají do Severního moře.",
};

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), match_pairs.
//   L1 = rozpoznání: 3 páry, hlavní řeky a jejich základní fakt (0–3, +pramen/ústí Vltavy)
//   L2 = aplikace:   4 páry, řeky + nádrže/rybníky (Rožmberk, Lipno, Orlík, Berounka, Třeboňsko)
//   L3 = transfer:   5 párů, obrácený směr (moře → která řeka), místa pramenů, a past
//                    Rožmberk (rybník) vs Lipno (vodní plocha) vs Orlík (elektrárna)
// Všechny pravé strany jsou navzájem odlišné (žádné duplicitní přiřazení).
// ─────────────────────────────────────────────────────────

const SADY_L1: number[][] = [
  [0, 1, 2], [1, 2, 3], [0, 2, 3], [0, 1, 3], [0, 10, 11],
  [1, 3, 4], [0, 4, 11], [2, 4, 1], [3, 0, 10], [1, 11, 2],
];

const SADY_L2: number[][] = [
  [0, 4, 5, 2], [1, 5, 6, 3], [2, 7, 8, 0], [3, 6, 4, 1], [0, 5, 8, 3],
  [4, 6, 7, 2], [1, 8, 5, 0], [2, 4, 6, 3], [7, 5, 0, 8], [3, 7, 4, 6],
];

const SADY_L3: number[][] = [
  [4, 5, 6, 12, 13], [12, 13, 14, 15, 10], [5, 6, 4, 14, 11], [10, 15, 8, 9, 12], [4, 5, 6, 10, 15],
  [12, 13, 14, 8, 9], [5, 6, 4, 11, 13], [13, 14, 15, 9, 10], [4, 5, 6, 12, 15], [10, 11, 9, 14, 13],
];

function buildTasks(groups: number[][]): PracticeTask[] {
  return groups.map((idxs, i) => {
    const pairs = idxs.map((idx) => ({ left: VSECHNY_PARY[idx].left, right: VSECHNY_PARY[idx].right }));
    const prvni = VSECHNY_PARY[idxs[0]].left;
    const fakt = VODNI_FAKTA[prvni] ?? "Vody ČR odtékají do tří moří: Severního (Labe), Černého (Morava→Dunaj) a Baltského (Odra).";
    return {
      question: "Spoj vodní prvky s jejich popisem.",
      correctAnswer: "match",
      pairs,
      hints: [
        "Vzpomeň si na mapu ČR — kde řeka pramení a kam teče.",
        `Tip: ${VSECHNY_PARY[idxs[0]].left} → ${VSECHNY_PARY[idxs[0]].right}`,
      ],
      explanation: `Vody ČR odtékají do tří moří: Severního (Labe), Černého (Morava→Dunaj) a Baltského (Odra). ${fakt}`,
    } as PracticeTask;
  });
}

const POOL_L1 = buildTasks(SADY_L1);
const POOL_L2 = buildTasks(SADY_L2);
const POOL_L3 = buildTasks(SADY_L3);

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const VODSTVOCRHLAVNIREKYVLTAVALABEMORAVAODRARYBNIKYPREHRADY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-vodstvo-cr-hlavni-reky-vltava-labe-morava-odra-rybniky-prehr",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-vodstvo-cr-hlavni-reky-vltava-labe-morava-odra-rybniky-prehr",
    title: "Vodstvo ČR - hlavní řeky (Vltava, Labe, Morava, Odra), rybníky, přehrady",
    studentTitle: "Řeky a voda ČR",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš hlavní řeky ČR, největší rybníky a přehrady.",
    keywords: ["Vltava", "Labe", "Morava", "Odra", "Rožmberk", "Lipno", "Třeboňsko", "přehrada", "rybník"],
    goals: [
      "Vyjmenovat hlavní řeky ČR a jejich směr odtoku",
      "Určit, do kterých moří ČR vody odtékají",
      "Znát největší rybníky a přehrady ČR",
      "Vysvětlit roli vodstva v hospodářství",
    ],
    boundaries: ["Hydrologické výpočty nejsou cílem", "Podrobné přítoky nejsou vyžadovány"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Nejdelší řeka ČR = Vltava (430 km, Praha, ústí do Labe u Mělníku). Největší rybník = Rožmberk (Třeboňsko).",
      steps: [
        "Vltava: pramení Šumava → Praha → Mělník → Labe → Severní moře",
        "Morava: odtéká do Dunaje → Černé moře",
        "Odra: odtéká do Polska → Baltské moře",
      ],
      commonMistake: "Žáci si pletou Lipno (největší vodní plocha) s Rožmberkem (největší rybník) — Lipno je přehrada!",
      example: "Vltava 430 km → nejdelší česká řeka; Rožmberk → největší rybník; Lipno → největší vodní plocha (přehrada)",
    },
  },
];
