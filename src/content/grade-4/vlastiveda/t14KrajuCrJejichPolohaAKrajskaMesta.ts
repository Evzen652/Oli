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

/**
 * Zajímavost ke krajskému městu — jde do vysvětlení.
 * Opraveno 2026-09-11: dřív tu stálo „Jihočeský kraj je největší kraj v ČR“
 * (největší je Středočeský), „Plzeňský kraj je druhý největší“ (je třetí)
 * a „Karlovarský kraj je nejmenší“ (menší je Liberecký a nejmenší Praha).
 */
const KRAJ_FAKTA: Record<string, string> = {
  "Praha": "Praha je zároveň hlavní město i samostatný kraj.",
  "Středočeský kraj": "Středočeský kraj je rozlohou největší kraj Česka. Obklopuje Prahu a jeho krajský úřad sídlí také v Praze.",
  "Jihočeský kraj": "Jihočeský kraj je druhý největší a je v něm nejvíc rybníků v Česku.",
  "Plzeňský kraj": "Plzeň leží na soutoku čtyř řek a je proslulá pivovarem.",
  "Karlovarský kraj": "Karlovy Vary jsou lázeňské město s horkými prameny.",
  "Ústecký kraj": "Ústí nad Labem leží na Labi v severních Čechách.",
  "Liberecký kraj": "Nad Libercem stojí na hoře Ještěd známý vysílač.",
  "Královéhradecký kraj": "Hradec Králové leží na soutoku Labe a Orlice.",
  "Pardubický kraj": "Pardubice jsou známé perníkem a dostihem Velká pardubická.",
  "Kraj Vysočina": "Kraj Vysočina leží na pomezí Čech a Moravy.",
  "Jihomoravský kraj": "Brno je druhé největší město Česka.",
  "Olomoucký kraj": "Olomouc má na náměstí sloup Nejsvětější Trojice, který je památkou UNESCO.",
  "Zlínský kraj": "Zlín proslavil výrobce obuvi Tomáš Baťa.",
  "Moravskoslezský kraj": "Ostrava je třetí největší město Česka, známé doly a hutěmi.",
};

/**
 * Nápověda ke kraji, jehož krajské město se jmenuje jinak než kraj.
 * Nesmí město pojmenovat — jen k němu dovést.
 */
const MESTO_VODITKO: Record<number, string> = {
  1: "Středočeský kraj má krajský úřad mimo své území — ve městě, které obklopuje ze všech stran.",
  2: "Krajské město Jihočeského kraje leží na Vltavě a jeho jméno začíná slovem „České“.",
  5: "Krajské město Ústeckého kraje má v názvu řeku, na které leží.",
  7: "Krajské město Královéhradeckého kraje leží na soutoku Labe a Orlice a v jeho jménu je slovo „Králové“.",
  9: "Krajské město Kraje Vysočina se jmenuje stejně jako řeka, která jím protéká.",
  10: "Krajské město Jihomoravského kraje je druhé největší město Česka.",
  13: "Krajské město Moravskoslezského kraje je třetí největší město Česka, známé doly a hutěmi.",
};

/** Kraje, jejichž krajské město je schované v názvu kraje. */
const ODVODITELNE = new Set([0, 3, 4, 6, 8, 11, 12]);

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
  [3, 11, 12], [4, 6, 8],
];

const SKUPINY_L2: number[][] = [
  [3, 2, 7, 10], [4, 5, 13, 11], [6, 7, 2, 12], [8, 10, 5, 3], [11, 13, 2, 4],
  [12, 5, 7, 6], [2, 3, 10, 8], [7, 4, 13, 11], [5, 6, 10, 12], [13, 2, 7, 3],
  [10, 13, 4, 6], [2, 5, 8, 12],
];

const SKUPINY_L3: number[][] = [
  [9, 0, 2, 10, 13], [9, 1, 2, 7, 10], [9, 2, 5, 7, 13], [0, 9, 10, 5, 7], [1, 9, 13, 2, 5],
  [9, 7, 10, 13, 2], [0, 2, 9, 5, 10], [1, 2, 9, 7, 13], [9, 5, 7, 10, 13], [0, 9, 2, 7, 13],
  [9, 1, 5, 10, 13], [0, 9, 5, 7, 2],
];

/**
 * Do 2026-09-11 měly všechny úlohy stejnou první nápovědu a druhá zněla
 * „Tip: Plzeňský kraj → Plzeň“ — rovnou prozradila jeden pár odpovědi.
 * Teď malá nápověda jmenuje kraje z téhle úlohy, které se dají odvodit ze
 * jména, a velká dává vodítko k těm, které odvodit nejdou, aniž by město
 * vyslovila.
 */
function buildTasks(groups: number[][], question: string): PracticeTask[] {
  return groups.map((idxs) => {
    const pairs = idxs.map((idx) => ({ left: KRAJE[idx].kraj, right: KRAJE[idx].mesto }));
    const easy = idxs.filter((i) => ODVODITELNE.has(i)).map((i) => KRAJE[i].kraj);
    const hard = idxs.filter((i) => !ODVODITELNE.has(i));

    const h0 = hard.length === 0
      ? `Všechny kraje v této úloze prozradí své krajské město jménem: ${easy.join(", ")}.`
      : `${easy.length ? `Začni kraji ${easy.join(", ")} — jejich jméno prozradí město. ` : ""}U krajů ${hard.map((i) => KRAJE[i].kraj).join(", ")} se město jmenuje jinak než kraj.`;
    // Příklad bereme z krajů, které v úloze NEJSOU — jinak by nápověda
    // prozradila pár.
    const [e1, e2] = [...ODVODITELNE].filter((i) => i !== 0 && !idxs.includes(i));
    let h1 = hard.length === 0
      ? `Ze jména kraje udělej jméno města — tak jako ${KRAJE[e1].kraj} má ${KRAJE[e1].mesto} a ${KRAJE[e2].kraj} ${KRAJE[e2].mesto}. Stejně to funguje u všech krajů v této úloze.`
      : hard.map((i) => MESTO_VODITKO[i]).join(" ");
    if (h1.length < h0.length * 1.2) h1 += " Krajské město je vždy to, ve kterém sídlí krajský úřad.";

    const fakta = idxs.map((i) => KRAJ_FAKTA[KRAJE[i].kraj]).filter(Boolean).slice(0, 2).join(" ");
    return {
      question,
      correctAnswer: "match",
      pairs,
      hints: [h0, h1],
      explanation: `${pairs.map((p) => `${p.left} → ${p.right}`).join(", ")}. ${fakta}`,
    } as PracticeTask;
  });
}

// Zadání se liší podle úrovně: dřív bylo všude stejné a audit úrovně
// nerozlišil (difficulty_progression).
const POOL_L1 = buildTasks(SKUPINY_L1, "Spoj kraj s krajským městem. Jméno kraje ti napoví.");
const POOL_L2 = buildTasks(SKUPINY_L2, "Spoj každý kraj s jeho krajským městem.");
const POOL_L3 = buildTasks(SKUPINY_L3, "Spoj kraj s krajským městem. Pozor, některá města se jmenují úplně jinak než kraj.");

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
