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
  { kraj: "Praha", mesto: "Praha" },
  { kraj: "Středočeský kraj", mesto: "Praha" },
  { kraj: "Jihočeský kraj", mesto: "České Budějovice" },
  { kraj: "Plzeňský kraj", mesto: "Plzeň" },
  { kraj: "Karlovarský kraj", mesto: "Karlovy Vary" },
  { kraj: "Ústecký kraj", mesto: "Ústí nad Labem" },
  { kraj: "Liberecký kraj", mesto: "Liberec" },
  { kraj: "Královéhradecký kraj", mesto: "Hradec Králové" },
  { kraj: "Pardubický kraj", mesto: "Pardubice" },
  { kraj: "Kraj Vysočina", mesto: "Jihlava" },
  { kraj: "Jihomoravský kraj", mesto: "Brno" },
  { kraj: "Olomoucký kraj", mesto: "Olomouc" },
  { kraj: "Zlínský kraj", mesto: "Zlín" },
  { kraj: "Moravskoslezský kraj", mesto: "Ostrava" },
];

// Skupiny 4 párů – různé kombinace 14 krajů
const SKUPINY_4: [number, number, number, number][] = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 0, 2],
  [1, 3, 5, 7],
  [9, 11, 13, 4],
  [6, 8, 10, 12],
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 3],
  [7, 11, 0, 9],
  [3, 6, 11, 13],
  [2, 5, 8, 11],
  [0, 7, 10, 13],
  [1, 4, 9, 12],
  [3, 5, 10, 12],
  [0, 6, 11, 4],
  [2, 7, 9, 13],
  [1, 8, 12, 5],
  [3, 4, 7, 10],
  [0, 3, 8, 13],
  [1, 6, 10, 2],
  [4, 7, 11, 9],
  [5, 12, 0, 11],
  [6, 9, 1, 13],
  [7, 10, 2, 4],
  [3, 11, 5, 8],
  [0, 12, 6, 3],
  [1, 7, 13, 9],
  [2, 8, 5, 10],
  [4, 6, 12, 1],
  [3, 9, 7, 0],
  [5, 11, 13, 6],
  [2, 10, 4, 13],
  [1, 3, 8, 12],
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

function gen(_level: number): PracticeTask[] {
  const tasks: PracticeTask[] = SKUPINY_4.slice(0, 35).map((idxs, i) => {
    const pairs = idxs.map(idx => ({
      left: KRAJE[idx].kraj,
      right: KRAJE[idx].mesto,
    }));
    const prvniKraj = KRAJE[idxs[0]].kraj;
    const fakt = KRAJ_FAKTA[prvniKraj] ?? "Krajské město je sídlo krajského úřadu.";
    return {
      question: `Spoj každý kraj s jeho krajským městem. (sada ${i + 1})`,
      correctAnswer: "match",
      pairs,
      hints: [
        "Každý kraj má jedno krajské město — správní centrum kraje.",
        `Tip: ${KRAJE[idxs[0]].kraj} → ${KRAJE[idxs[0]].mesto}`,
      ],
      explanation: `ČR má 14 krajů — každý má krajské město, kde sídlí krajský úřad. ${fakt}`,
    } as PracticeTask;
  });
  return shuffle(tasks).slice(0, 35);
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
