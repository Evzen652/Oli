import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const KRAJE: { kraj: string; mesto: string }[] = [
  { kraj: "Praha", mesto: "Praha" },                                    // 0
  { kraj: "Středočeský kraj", mesto: "Praha" },                         // 1
  { kraj: "Jihočeský kraj", mesto: "České Budějovice" },                // 2
  { kraj: "Plzeňský kraj", mesto: "Plzeň" },                            // 3
  { kraj: "Karlovarský kraj", mesto: "Karlovy Vary" },                  // 4
  { kraj: "Ústecký kraj", mesto: "Ústí nad Labem" },                    // 5
  { kraj: "Liberecký kraj", mesto: "Liberec" },                         // 6
  { kraj: "Královéhradecký kraj", mesto: "Hradec Králové" },            // 7
  { kraj: "Pardubický kraj", mesto: "Pardubice" },                      // 8
  { kraj: "Kraj Vysočina", mesto: "Jihlava" },                          // 9
  { kraj: "Jihomoravský kraj", mesto: "Brno" },                         // 10
  { kraj: "Olomoucký kraj", mesto: "Olomouc" },                         // 11
  { kraj: "Zlínský kraj", mesto: "Zlín" },                              // 12
  { kraj: "Moravskoslezský kraj", mesto: "Ostrava" },                   // 13
];

const KRAJ_FAKTA: Record<string, string> = {
  "Praha": "Praha je výjimka — je zároveň krajem i svým vlastním krajským městem.",
  "Středočeský kraj": "Středočeský kraj obklopuje Prahu, ale krajský úřad sídlí také v Praze.",
  "Jihočeský kraj": "Jihočeský kraj je největší kraj v ČR.",
  "Plzeňský kraj": "Plzeňský kraj je druhý největší kraj v ČR.",
  "Karlovarský kraj": "Karlovarský kraj je nejmenší kraj v ČR, leží na severozápadě.",
  "Ústecký kraj": "Ústecký kraj leží na severu podél Labe.",
  "Liberecký kraj": "Liberecký kraj leží v Krkonoších a Jizerských horách.",
  "Královéhradecký kraj": "Královéhradecký kraj sousedí s Polskem a leží u Krkonoš.",
  "Pardubický kraj": "Pardubice jsou proslulé Velkou pardubickou — světoznámým dostihem.",
  "Kraj Vysočina": "Kraj Vysočina leží uprostřed ČR na hranici Čech a Moravy.",
  "Jihomoravský kraj": "Brno je druhé největší město v ČR.",
  "Olomoucký kraj": "Olomouc je historické město — sídlilo tam arcibiskupství.",
  "Zlínský kraj": "Zlínský kraj leží na jihovýchodě Moravy u hranic se Slovenskem.",
  "Moravskoslezský kraj": "Ostrava je třetí největší město ČR — centrum průmyslu a těžby.",
};

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), match_pairs.
//   L1 = rozpoznání: 3 páry, samo-odvoditelné kraje (název kraje = město)
//                    {3 Plzeňský, 4 Karlovarský, 6 Liberecký, 8 Pardubický, 11 Olomoucký, 12 Zlínský}
//   L2 = aplikace:   4 páry, vč. neodvoditelných ikonických měst (Brno, Ostrava, ČB, HK, Ústí)
//   L3 = transfer:   5 párů, vč. nejtěžších (9 Vysočina→Jihlava, Praha) + víc párů
// Past: kraj 0 (Praha→Praha) a 1 (Středočeský→Praha) mají STEJNÉ krajské město →
// nikdy nejsou v jedné úloze (duplicitní pravá strana = nejednoznačné přiřazení).
// ─────────────────────────────────────────────────────────

const SKUPINY_L1: number[][] = [
  [3, 4, 6], [8, 11, 12], [3, 8, 11], [4, 6, 12], [3, 6, 8],
  [4, 11, 12], [3, 4, 11], [6, 8, 12], [4, 8, 11], [3, 6, 12],
];

const SKUPINY_L2: number[][] = [
  [3, 2, 7, 10], [4, 5, 13, 11], [6, 7, 2, 12], [8, 10, 5, 3], [11, 13, 2, 4],
  [12, 5, 7, 6], [2, 3, 10, 8], [7, 4, 13, 11], [5, 6, 10, 12], [13, 2, 7, 3],
];

const SKUPINY_L3: number[][] = [
  [9, 0, 2, 10, 13], [9, 1, 2, 7, 10], [9, 2, 5, 7, 13], [0, 9, 10, 5, 7], [1, 9, 13, 2, 5],
  [9, 7, 10, 13, 2], [0, 2, 9, 5, 10], [1, 2, 9, 7, 13], [9, 5, 7, 10, 13], [0, 9, 2, 7, 13],
];

function buildTasks(groups: number[][]): PracticeTask[] {
  return groups.map((idxs, i) => {
    const pairs = idxs.map((idx) => ({ left: KRAJE[idx].kraj, right: KRAJE[idx].mesto }));
    const prvniKraj = KRAJE[idxs[0]].kraj;
    const fakt = KRAJ_FAKTA[prvniKraj] ?? "Krajské město je sídlo krajského úřadu.";
    return {
      question: "Spoj každý kraj s jeho krajským městem.",
      correctAnswer: "match",
      pairs,
      hints: [
        "Každý kraj má jedno krajské město — správní centrum kraje.",
        `Tip: ${KRAJE[idxs[0]].kraj} → ${KRAJE[idxs[0]].mesto}`,
      ],
      explanation: `ČR má 14 krajů — každý má krajské město, kde sídlí krajský úřad. ${fakt}`,
    } as PracticeTask;
  });
}

const POOL_L1 = buildTasks(SKUPINY_L1);
const POOL_L2 = buildTasks(SKUPINY_L2);
const POOL_L3 = buildTasks(SKUPINY_L3);

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const T14KRAJUCRJEJICHPOLOHAAKRAJSKAMESTA: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-kraje-cr-14-kraju-cr-jejich-poloha-a-krajska-mesta",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-kraje-cr-14-kraju-cr-jejich-poloha-a-krajska-mesta",
    title: "14 krajů ČR, jejich poloha a krajská města",
    studentTitle: "14 krajů ČR",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš všechna krajská města a rozmístění krajů na mapě ČR.",
    keywords: ["kraje", "krajská města", "česká republika", "mapa", "kraj"],
    goals: [
      "Vyjmenovat 14 krajů ČR",
      "Přiřadit ke každému kraji krajské město",
      "Popsat přibližnou polohu krajů na mapě",
    ],
    boundaries: ["Není nutné znát přesné hranice krajů", "Statistická data krajů nejsou požadována"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "ČR má 14 krajů. Každý kraj má krajské město, které je správním centrem.",
      steps: [
        "Vzpomeň si na mapu ČR",
        "Najdi kraj, na který se ptáme",
        "Vzpomeň si, které město je centrem (krajským městem) tohoto kraje",
      ],
      commonMistake: "Žáci si pletou Středočeský kraj a hlavní město Praha — Praha je krajské město obou, ale jsou to dva samostatné kraje.",
      example: "Jihočeský kraj → krajské město České Budějovice (leží na jihu Čech, u Šumavy)",
    },
  },
];
