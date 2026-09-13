/**
 * Fyzika 6. ročník — Látka a těleso, vlastnosti látek.
 *
 * První téma okruhu „Látky a tělesa" a první **pojmové** téma fyziky šestky —
 * dosavadních šest je výpočetních (převody a vzorce). Vzor se tedy přebírá
 * v tom, co platí pro celý 2. stupeň (select_one, chybový model distraktorů,
 * dvě nápovědy, `optionFeedback`), ne v tom, co platilo pro převody.
 *
 * **Miskoncepce, na kterou téma cílí:** žák považuje látku a těleso za totéž
 * slovo z jiné strany („sklo = sklenice"). Rozdíl se ukáže až na tom, že z jedné
 * látky je mnoho těles a že některé vlastnosti patří látce (hustota, teplota
 * tání, barva), zatímco jiné konkrétnímu tělesu (hmotnost, objem, tvar).
 *
 * Gradace:
 *  • **L1 rozpoznání** — v nabídce je jedna látka mezi třemi tělesy.
 *  • **L2 aplikace** — které dvě ze čtyř těles sdílejí látku.
 *  • **L3 přenos** — dvě tělesa z jedné látky: která vlastnost je u obou stejná?
 *    Tady se miskoncepce láme, protože hmotnost i objem se liší, a přesto jde
 *    pořád o tutéž látku.
 *
 * ## Co při psaní spadlo a proč to stojí za zapamatování
 *
 * První verze skládala větu jako `z ${latka}` a vyráběla „bývá **z sklo**",
 * „**z dřevo**", „**z pálená hlína**". Vazba *z* žádá druhý pád, a ten se
 * z prvního odvodit nedá — proto má každá látka v bance **hotový tvar
 * s předložkou** (`zLatky`). Skloňování nepatří do šablony a žádná existující
 * kontrola tohle nechytí: `audit:agreement` hlídá shodu přísudku s číslovkou,
 * ne pádovou vazbu. Ustojí to jen data.
 *
 * Dvojice těles se řadí abecedně schválně: bez toho vznikaly zrcadlové úlohy
 * („Kelímek a pravítko" vs. „Pravítko a kelímek"), které jsou pro dítě tatáž
 * úloha, ale pro počítadlo dvě — a nafukovaly by počet „unikátních" zadání.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, shuffle, buildChoiceTask as task, ruzneUlohy } from "./_shared";

/**
 * Banka „těleso — látka". `zLatky` je hotová vazba ve druhém pádě.
 *
 * Z každé látky musí být v bance **aspoň dvě** tělesa, jinak by L2 a L3 neměly
 * z čeho stavět a téma by šlo vyřešit pamětí místo porozuměním.
 */
const DVOJICE = [
  { teleso: "sklenice", latka: "sklo", zLatky: "ze skla" },
  { teleso: "okenní tabule", latka: "sklo", zLatky: "ze skla" },
  { teleso: "láhev", latka: "sklo", zLatky: "ze skla" },
  { teleso: "hřebík", latka: "železo", zLatky: "ze železa" },
  { teleso: "podkova", latka: "železo", zLatky: "ze železa" },
  { teleso: "pravítko", latka: "plast", zLatky: "z plastu" },
  { teleso: "kelímek", latka: "plast", zLatky: "z plastu" },
  { teleso: "kbelík", latka: "plast", zLatky: "z plastu" },
  { teleso: "stůl", latka: "dřevo", zLatky: "ze dřeva" },
  { teleso: "tužka", latka: "dřevo", zLatky: "ze dřeva" },
  { teleso: "židle", latka: "dřevo", zLatky: "ze dřeva" },
  { teleso: "hrnec", latka: "hliník", zLatky: "z hliníku" },
  { teleso: "plechovka", latka: "hliník", zLatky: "z hliníku" },
  { teleso: "prsten", latka: "zlato", zLatky: "ze zlata" },
  { teleso: "řetízek", latka: "zlato", zLatky: "ze zlata" },
  { teleso: "socha", latka: "bronz", zLatky: "z bronzu" },
  { teleso: "zvon", latka: "bronz", zLatky: "z bronzu" },
  { teleso: "cihla", latka: "pálená hlína", zLatky: "z pálené hlíny" },
  { teleso: "květináč", latka: "pálená hlína", zLatky: "z pálené hlíny" },
  { teleso: "talíř", latka: "porcelán", zLatky: "z porcelánu" },
  { teleso: "hrnek", latka: "porcelán", zLatky: "z porcelánu" },
  { teleso: "gumička", latka: "guma", zLatky: "z gumy" },
  { teleso: "pneumatika", latka: "guma", zLatky: "z gumy" },
  { teleso: "sešit", latka: "papír", zLatky: "z papíru" },
  { teleso: "krabice", latka: "papír", zLatky: "z papíru" },
];

type Dvojice = (typeof DVOJICE)[number];

/** Látky, ze kterých je v bance víc než jedno těleso. */
const SPOLECNE_LATKY = [...new Set(DVOJICE.map((d) => d.latka))].filter(
  (l) => DVOJICE.filter((d) => d.latka === l).length >= 2,
);

/**
 * Vlastnosti látky vs. vlastnosti konkrétního tělesa — jádro L3.
 *
 * `proc` slouží zároveň jako diagnostický feedback k chybné volbě, takže je
 * psané jako samostatná věta bez pomlček: vkládá se doprostřed jiné věty
 * a druhá pomlčka by ji roztrhla.
 */
const VLASTNOSTI_LATKY = [
  { nazev: "hustota", proc: "hustota říká, kolik váží jeden krychlový centimetr té látky, a to platí u velkého i malého kusu" },
  { nazev: "teplota tání", proc: "látka taje při své teplotě bez ohledu na to, jak velký kus roztavíš" },
  { nazev: "barva", proc: "barvu má látka sama, ne až konkrétní výrobek z ní" },
];
const VLASTNOSTI_TELESA = [
  { nazev: "hmotnost", proc: "hmotnost závisí na tom, kolik látky v tělese je, takže větší kus váží víc" },
  { nazev: "objem", proc: "objem je, kolik místa těleso zabírá, a ten má každé těleso jiný" },
  { nazev: "tvar", proc: "tvar dělá výrobek, ne látka: z téhož kovu jde vyrobit drát i deska" },
];

/** Dvojice jmen v pevném pořadí — ať nevznikají zrcadlové varianty téže úlohy. */
function dvojiceJmen(a: Dvojice, b: Dvojice): string {
  const [x, y] = [a.teleso, b.teleso].sort((p, q) => p.localeCompare(q, "cs"));
  return `${x} a ${y}`;
}

const velke = (s: string) => `${s[0].toUpperCase()}${s.slice(1)}`;

// ── L1 — rozpoznání: jedna látka mezi třemi tělesy ─────────────────────────
function genL1(): PracticeTask {
  const spravna = pick(DVOJICE);
  const telesa = shuffle(DVOJICE.filter((d) => d.latka !== spravna.latka)).slice(0, 3);
  // Kotva je vždy jeden z distraktorů, nikdy klíč — rozebrat ji tedy nic
  // neprozradí a nápověda je přitom pro každou úlohu jiná.
  const kotva = telesa[0];

  return task(
    "Které z těchto slov označuje látku, ne těleso?",
    spravna.latka,
    telesa.map((t) => ({
      value: t.teleso,
      why: `„${t.teleso}" je těleso, tedy konkrétní věc. Odpovědí je látka, ze které se něco vyrábí — ${t.teleso} bývá ${t.zLatky}.`,
    })),
    {
      hints: [
        `Zkus to na jedné možnosti: ${kotva.teleso}. Je to konkrétní věc, kterou vezmeš do ruky?`,
        `${velke(kotva.teleso)} je těleso a bývá ${kotva.zLatky} — a právě takový materiál je látka. Projdi zbylé možnosti stejně a najdi tu, která žádnou konkrétní věc neoznačuje, jen materiál.`,
      ],
      solutionSteps: [
        "Těleso = konkrétní předmět, má tvar a rozměry.",
        "Látka = materiál, ze kterého je těleso vyrobené.",
      ],
      explanation: `Látka je materiál, těleso je konkrétní předmět z něj. Třeba ${spravna.teleso} je těleso a je ${spravna.zLatky} — a ${spravna.latka} je ta látka.`,
    },
  );
}

// ── L2 — aplikace: které dvě tělesa sdílejí látku ─────────────────────────
//
// Správná odpověď se musí lišit úlohu od úlohy. První verze měla u všech úloh
// tutéž větu („Dvě z nich jsou ze stejné látky") a dala se trefit podle znění,
// aniž by dítě vědělo, z čeho co je.
function genL2(): PracticeTask {
  const latka = pick(SPOLECNE_LATKY);
  const zLatky = shuffle(DVOJICE.filter((d) => d.latka === latka)).slice(0, 2);

  // Zbylá dvě tělesa musí být každé z JINÉ látky — a obě jiné než ta sdílená.
  // Bez toho mohla vyjít dvojice pravítko + kelímek (obojí plast) a úloha měla
  // dvě správné odpovědi: „právě jedna správná" je tvrdé pravidlo authoringu.
  const jina: Dvojice[] = [];
  for (const kandidat of shuffle(DVOJICE.filter((d) => d.latka !== latka))) {
    if (jina.length === 2) break;
    if (jina.some((x) => x.latka === kandidat.latka)) continue;
    jina.push(kandidat);
  }
  const vsechna = shuffle([...zLatky, ...jina]);

  return task(
    `Které dvě z těchto těles jsou ze stejné látky: ${vsechna.map((x) => x.teleso).join(", ")}?`,
    dvojiceJmen(zLatky[0], zLatky[1]),
    [
      [zLatky[0], jina[0]],
      [zLatky[1], jina[1]],
      [jina[0], jina[1]],
    ].map(([a, b]) => ({
      value: dvojiceJmen(a, b),
      why: `${velke(a.teleso)} bývá ${a.zLatky}, kdežto ${b.teleso} ${b.zLatky}. To není táž látka.`,
    })),
    {
      hints: [
        `Začni u jednoho tělesa: z čeho bývá ${jina[0].teleso}?`,
        `${velke(jina[0].teleso)} bývá ${jina[0].zLatky}, takže hledáš druhé těleso z téhož materiálu. Projdi tak všechna čtyři a porovnávej materiály, ne tvary — různý tvar ani velikost ještě neznamenají různou látku.`,
      ],
      solutionSteps: [
        "Urči látku u každého tělesa zvlášť.",
        "Porovnávej látky, ne tvary ani velikosti.",
      ],
      explanation: `Z jedné látky se dá vyrobit mnoho různých těles: ${zLatky[0].teleso} i ${zLatky[1].teleso} jsou ${zLatky[0].zLatky}, kdežto ${jina[0].teleso} je ${jina[0].zLatky} a ${jina[1].teleso} ${jina[1].zLatky}.`,
    },
  );
}

// ── L3 — přenos: která vlastnost patří látce, ne tělesu ────────────────────
function genL3(): PracticeTask {
  const latka = pick(SPOLECNE_LATKY);
  const [a, b] = shuffle(DVOJICE.filter((d) => d.latka === latka)).slice(0, 2);
  const [prvni, druhe] = [a.teleso, b.teleso].sort((p, q) => p.localeCompare(q, "cs"));
  const spravna = pick(VLASTNOSTI_LATKY);
  const chybne = shuffle(VLASTNOSTI_TELESA).slice(0, 3);

  return task(
    // Věta se schválně vyhýbá rodu i pádu jmen: tělesa se losují napříč rody
    // (stůl, sklenice, pravítko), takže „obojí"/„každé je jinak velké" by
    // u poloviny dvojic neseděly. Jména stojí v prvním pádě, zbytek je obecný.
    `${velke(prvni)} a ${druhe} jsou ze stejné látky (${latka}), ale liší se velikostí. Která vlastnost je u obou stejná?`,
    spravna.nazev,
    chybne.map((v) => ({
      value: v.nazev,
      why: `To se u nich liší, protože ${v.proc}. Hledej vlastnost, kterou určuje látka, ne velikost výrobku.`,
    })),
    {
      hints: [
        `Obě tělesa — ${prvni} a ${druhe} — si postav vedle sebe: co se u nich liší jen proto, že je jedno větší?`,
        `Co se s velikostí mění, patří tělesu. Co zůstane stejné i u většího kusu, patří látce samotné — a látka je tady u obou stejná (${latka}), takže tahle vlastnost se lišit nemůže.`,
      ],
      solutionSteps: [
        "Představ si z téže látky malý i velký kus.",
        "Co se mezi nimi liší, je vlastnost tělesa.",
        "Co zůstane stejné, je vlastnost látky.",
      ],
      explanation: `Některé vlastnosti patří látce a na velikosti nezávisí: ${spravna.proc}. Naproti tomu hmotnost, objem i tvar se u dvou těles z téže látky liší.`,
    },
  );
}

function gen(level: number): PracticeTask[] {
  return ruzneUlohy(() => (level === 1 ? genL1() : level === 2 ? genL2() : genL3()));
}

export const LATKA_A_TELESO: TopicMetadata[] = [
  {
    id: "g6-fyz-latka-a-teleso-6",
    rvpNodeId: "g6-fyzika-latky-a-telesa-vlastnosti-latek-latka-a-teleso-rozliseni-vlastnosti-latek",
    displayName: "Látka a těleso",
    title: "Látka a těleso – rozlišení, vlastnosti látek",
    studentTitle: "Látka a těleso",
    subject: "fyzika",
    category: "Látky a tělesa",
    topic: "Vlastnosti látek",
    briefDescription: "Rozlišíš těleso od látky a poznáš, které vlastnosti patří které.",
    keywords: [
      "látka", "těleso", "materiál", "vlastnosti látek", "hustota",
      "teplota tání", "z čeho je vyrobeno", "sklo", "dřevo", "kov",
    ],
    goals: [
      "Rozlišit těleso (konkrétní předmět) od látky (materiál).",
      "Poznat, že z jedné látky může být mnoho různých těles.",
      "Odlišit vlastnosti látky (hustota, teplota tání, barva) od vlastností tělesa (hmotnost, objem, tvar).",
    ],
    boundaries: [
      "Jen běžné látky z okolí žáka, žádné chemické složení.",
      "Bez výpočtů — hustota se tu jen jmenuje jako vlastnost látky, počítá se v tématu Hustota.",
      "Nezahrnuje částicovou stavbu (atomy a molekuly mají vlastní téma).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-hustota-6"],
    generator: gen,
    helpTemplate: {
      hint: "Těleso je konkrétní předmět (sklenice), látka je materiál, ze kterého je (sklo). Z jedné látky lze vyrobit mnoho těles.",
      steps: [
        "Zeptej se: je to jeden konkrétní předmět, nebo materiál?",
        "U vlastnosti se zeptej: změní se, když z té látky vyrobím větší kus?",
        "Co se s velikostí mění, patří tělesu; co zůstává, patří látce.",
      ],
      commonMistake: "Považovat látku a těleso za totéž („sklo = sklenice“) nebo přiřadit hmotnost látce místo tělesu.",
      example: "Sklenice i okenní tabule jsou ze skla: hustotu mají stejnou, hmotnost různou.",
    },
  },
];
