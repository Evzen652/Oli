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
// Opraveno 2026-09-11: Orlík tu byl jako „největší vodní elektrárna ČR“.
// Největší vodní elektrárnou jsou Dlouhé stráně v Jeseníkách; Orlík je
// přehradní nádrž, která zadrží nejvíc vody.
const VSECHNY_PARY: { left: string; right: string }[] = [
  { left: "Vltava", right: "nejdelší česká řeka (430 km)" },                        // 0
  { left: "Labe", right: "pramení v Krkonoších, odtéká do Severního moře" },         // 1
  { left: "Morava", right: "ústí do Dunaje, odtéká do Černého moře" },               // 2
  { left: "Odra", right: "odtéká do Baltského moře přes Polsko" },                   // 3
  { left: "Rožmberk", right: "největší rybník ČR (Třeboňsko)" },                     // 4
  { left: "Přehrada Lipno", right: "největší vodní plocha ČR (na Vltavě)" },         // 5
  { left: "Přehrada Orlík", right: "nádrž, která zadrží nejvíc vody (na Vltavě)" },  // 6
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
  "Přehrada Orlík": "Orlík je přehrada na Vltavě, která zadrží nejvíc vody ze všech českých nádrží.",
  "Třeboňsko": "Třeboňsko je proslulá oblast rybníků — rybníkářství tu má tradici přes 500 let.",
  "Berounka": "Berounka je hlavní levý přítok Vltavy — vzniká soutokem Mže a Radbuzy u Plzně.",
  "Máchovo jezero": "Máchovo jezero leží u Doks v Libereckém kraji — je to vlastně rybník, proslavil ho básník K. H. Mácha.",
  "Šumava": "Šumava je místo pramene Vltavy — Vltava zde pramení na svazích Černé hory.",
  "Mělník": "U Mělníka se Vltava vlévá do Labe — odtud vody odtékají do Severního moře.",
  "Severní moře": "Do Severního moře doteče Labe i s vodou z Vltavy.",
  "Černé moře": "Do Černého moře doteče Morava přes Dunaj.",
  "Baltské moře": "Do Baltského moře doteče Odra přes Polsko.",
  "Krkonoše": "V Krkonoších pramení Labe, nedaleko Sněžky.",
};

/**
 * Vodítko k prvku — jde do velké nápovědy. Nesmí zopakovat pravou stranu
 * páru, jen k ní dovést.
 */
const VODITKO: Record<string, string> = {
  "Vltava": "Vltava protéká Prahou a je ze všech našich řek nejdelší.",
  "Labe": "Labe opouští Česko u Děčína a teče přes Německo na sever.",
  "Morava": "Morava teče na jih a vlévá se do veliké řeky, která teče přes Vídeň.",
  "Odra": "Odra teče z Moravy na sever přes Ostravu a Polsko.",
  "Rožmberk": "Rožmberk není přehrada, ale rybník, který kdysi vykopali lidé.",
  "Přehrada Lipno": "Lipno je přehrada na horní Vltavě, jejíž hladina je rozlehlá jako moře.",
  "Přehrada Orlík": "Orlík je hluboká přehrada na Vltavě mezi skalami, v jejímž údolí je nejvíc vody.",
  "Třeboňsko": "Třeboňsko není jedna vodní plocha, ale celá krajina plná rybníků.",
  "Berounka": "Berounka se vlévá do Vltavy kousek nad Prahou z levé strany.",
  "Máchovo jezero": "Máchovo jezero nese jméno básníka, který napsal Máj.",
  "Šumava": "Šumava je pohoří na jihozápadě, odkud vytéká nejdelší česká řeka.",
  "Mělník": "Mělník je město, kde se potkávají dvě velké řeky.",
  "Severní moře": "Do Severního moře ústí řeka, která pramení v Krkonoších.",
  "Černé moře": "Do Černého moře teče Dunaj a s ním i jedna moravská řeka.",
  "Baltské moře": "Baltské moře leží na sever od Polska. Doteče do něj řeka z Ostravy.",
  "Krkonoše": "Krkonoše jsou pohoří se Sněžkou, kde pramení druhá největší česká řeka.",
};

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), match_pairs.
//   L1 = rozpoznání: 3 páry, hlavní řeky a jejich základní fakt (0–3, +pramen/ústí Vltavy)
//   L2 = aplikace:   4 páry, řeky + nádrže/rybníky (Rožmberk, Lipno, Orlík, Berounka, Třeboňsko)
//   L3 = transfer:   5 párů, obrácený směr (moře → která řeka), místa pramenů, a past
//                    Rožmberk (rybník) vs Lipno (vodní plocha) vs Orlík (objem vody)
// Všechny pravé strany jsou navzájem odlišné (žádné duplicitní přiřazení).
// ─────────────────────────────────────────────────────────

const SADY_L1: number[][] = [
  [0, 1, 2], [1, 2, 3], [0, 2, 3], [0, 1, 3], [0, 10, 11],
  [1, 3, 4], [0, 4, 11], [2, 4, 1], [3, 0, 10], [1, 11, 2],
  [2, 3, 10], [3, 4, 11],
];

const SADY_L2: number[][] = [
  [0, 4, 5, 2], [1, 5, 6, 3], [2, 7, 8, 0], [3, 6, 4, 1], [0, 5, 8, 3],
  [4, 6, 7, 2], [1, 8, 5, 0], [2, 4, 6, 3], [7, 5, 0, 8], [3, 7, 4, 6],
  [1, 6, 7, 8], [2, 5, 6, 8],
];

const SADY_L3: number[][] = [
  [4, 5, 6, 12, 13], [12, 13, 14, 15, 10], [5, 6, 4, 14, 11], [10, 15, 8, 9, 12], [4, 5, 6, 10, 15],
  [12, 13, 14, 8, 9], [5, 6, 4, 11, 13], [13, 14, 15, 9, 10], [4, 5, 6, 12, 15], [10, 11, 9, 14, 13],
  [4, 6, 11, 14, 15], [5, 9, 12, 14, 15],
];

/**
 * Do 2026-09-11 zněla druhá nápověda „Tip: Vltava → nejdelší česká řeka“ —
 * rovnou prozradila jeden pár. Malá nápověda teď vyjmenuje prvky z úlohy,
 * velká dá vodítka ke dvěma posledním, aniž by zopakovala pravou stranu.
 */
function buildTasks(groups: number[][], question: string): PracticeTask[] {
  return groups.map((idxs) => {
    const pairs = idxs.map((idx) => ({ left: VSECHNY_PARY[idx].left, right: VSECHNY_PARY[idx].right }));
    const lefts = pairs.map((p) => p.left);
    const h0 = `V úloze jsou: ${lefts.join(", ")}. Začni tím, o kterém víš nejvíc, a zbytek dopáruj.`;
    let h1 = lefts.slice(-2).map((l) => VODITKO[l]).join(" ");
    if (h1.length < h0.length * 1.2) h1 += " Vzpomeň si na mapu: kde řeka pramení, kudy teče a do kterého moře doteče.";
    const fakta = lefts.map((l) => VODNI_FAKTA[l]).filter(Boolean).slice(0, 2).join(" ");
    return {
      question,
      correctAnswer: "match",
      pairs,
      hints: [h0, h1],
      explanation: `${pairs.map((p) => `${p.left} — ${p.right}`).join("; ")}. ${fakta}`,
    } as PracticeTask;
  });
}

// Zadání se liší podle úrovně (dřív všude stejné — audit úrovně nerozlišil).
const POOL_L1 = buildTasks(SADY_L1, "Spoj hlavní řeky a místa s tím, co o nich platí.");
const POOL_L2 = buildTasks(SADY_L2, "Spoj řeky, rybníky a přehrady s jejich popisem.");
const POOL_L3 = buildTasks(SADY_L3, "Spoj vodní prvky s popisem. Pozor na rozdíl mezi rybníkem a přehradou.");

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
      hint: "Nejdelší řeka ČR = Vltava (430 km, Praha, ústí do Labe u Mělníka). Největší rybník = Rožmberk (Třeboňsko).",
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
