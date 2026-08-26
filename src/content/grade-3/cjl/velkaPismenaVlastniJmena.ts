import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * PED-3 kalibrace L1<L2<L3.
 * Před: L1 = POOL[0..10], L2 = L3 = celý POOL → getTierTasks L3 vyprazdňoval.
 * Teď disjunktní: L1 (jednoduchá vlastní jména), L2 (rozlišování vlastní vs
 * obecné), L3 (obtížné případy — ulice, měsíce, oslovení, obtížné oblasti).
 */

type Item = { q: string; a: string; opts: string[]; e: string; hints?: string[] };

const POOL_L1: Item[] = [
  // Základní vlastní jména — jak napsat konkrétní jméno
  { q: "Jak správně napíšeme hlavní město ČR?", a: "Praha", opts: ["Praha", "praha", "PRAHA", "Praga"], e: "Praha je vlastní jméno města — velké písmeno na začátku." },
  { q: "Jak správně napíšeme českou řeku?", a: "Vltava", opts: ["Vltava", "vltava", "VLTAVA", "vltáva"], e: "Vltava je vlastní jméno řeky — velké V." },
  { q: "Jak napíšeme: 'bydlím v _____' (město Brno)?", a: "Brně", opts: ["Brně", "brně", "BRNĚ", "brno"], e: "Brno je vlastní jméno města. Ve změněném tvaru (Brně) zůstává velké B." },
  { q: "Jak napíšeme: 'Nejvyšší hora v Česku se jmenuje _____.'", a: "Sněžka", opts: ["Sněžka", "sněžka", "SNĚŽKA", "Snežka"], e: "Sněžka je vlastní jméno hory — velké S." },
  { q: "Doplň název řeky: '_____ je česká řeka.' (řeka labe)", a: "Labe", opts: ["Labe", "labe", "LABE", "Labě"], e: "Labe je vlastní jméno řeky — velké L." },
  { q: "Název pohoří Šumava píšeme:", a: "Šumava", opts: ["Šumava", "šumava", "ŠUMAVA", "šUMAVA"], e: "Šumava je vlastní jméno pohoří — velké Š." },
  { q: "Jak napíšeme název státu, který sousedí s Českem na západě?", a: "Německo", opts: ["Německo", "německo", "NĚMECKO", "Nemecko"], e: "Německo je vlastní jméno státu — velké N." },
  { q: "Jméno 'martin' v dopise — jak ho opravíme?", a: "Martin", opts: ["Martin", "martin", "MARTIN", "maRtin"], e: "Martin je jméno člověka — velké M." },
  { q: "Jak napíšeme: 'Bydlíme v ___' (obec Třebíč).", a: "Třebíči", opts: ["Třebíči", "třebíči", "TŘEBÍČI", "tŘEBÍČI"], e: "Třebíč je vlastní jméno obce — velké T (i po skloňování)." },
];

const POOL_L2: Item[] = [
  // Rozlišování vlastní vs obecné jméno
  { q: "Které slovo se píše s velkým písmenem?", a: "Jiří (jméno člověka)", opts: ["Jiří (jméno člověka)", "jiřina (květ)", "jiný", "jihovýchod"], e: "Jiří = jméno konkrétního člověka → velké J. Jiřina (květ) je obecné jméno." },
  {
    q: "Které slovo se píše s malým písmenem?",
    a: "hora (obecně)",
    opts: ["hora (obecně)", "Krkonoše", "Vltava", "Karel"],
    e: "'Hora' obecně = každá hora → malé h. Krkonoše, Vltava, Karel jsou vlastní jména.",
    hints: [
      "Vlastní jméno = jméno konkrétní osoby, místa, řeky, hory → velké písmeno.",
      "Když mluvíme o kopci bez uvedení jeho konkrétního názvu, píšeme ho s malým písmenem.",
    ],
  },
  { q: "Věta: 'Jana a tomáš jdou do školy.' Které slovo je napsáno ŠPATNĚ?", a: "tomáš", opts: ["tomáš", "Jana", "školy", "jdou"], e: "Tomáš je jméno člověka → musí mít velké T. 'Školy' je obecné (malé s)." },
  { q: "Které slovo MUSÍ mít velké písmeno?", a: "Morava (řeka)", opts: ["Morava (řeka)", "modrý", "mokrý", "moudrý"], e: "Morava = vlastní jméno řeky. Ostatní jsou přídavná jména = malé písmeno." },
  {
    q: "Které z těchto slov se píše s MALÝM písmenem?",
    a: "pes (obecné jméno)",
    opts: ["pes (obecné jméno)", "Azor (jméno psa)", "Nora (jméno)", "Praha"],
    e: "Pes obecně = malé p. Azor = jméno konkrétního psa → velké A.",
    hints: [
      "Vlastní jméno = jméno konkrétní osoby, místa, řeky, hory → velké písmeno.",
      "Když mluvíme o zvířeti obecně, bez konkrétního jména, píšeme ho s malým písmenem.",
    ],
  },
  {
    q: "Co je vlastní jméno?",
    a: "Jméno konkrétní osoby, místa nebo věci (Praha, Vltava, Karel)",
    opts: [
      "Jméno konkrétní osoby, místa nebo věci (Praha, Vltava, Karel)",
      "Slovo, které patří vlastníkovi",
      "Jméno napsané malými písmeny",
      "Slovo z první věty odstavce",
    ],
    e: "Vlastní jméno = pojmenování konkrétní jedinečné osoby, místa, věci → vždy velké písmeno.",
    hints: [
      "Takové slovo patří jen jedné konkrétní bytosti, místu, nebo taky věci — a ne kterékoli jiné.",
      "Obecné jméno = každý pes, každá hora → malé písmeno.",
    ],
  },
  { q: "Co je obecné jméno?", a: "Slovo, které pojmenovává druh věcí obecně (kočka, škola, řeka)", opts: ["Slovo, které pojmenovává druh věcí obecně (kočka, škola, řeka)", "Jméno psané velkými písmeny", "Cizí jméno", "Jméno města v cizině"], e: "Obecné jméno = pojmenování druhu (každá kočka, každá škola, každá řeka) → malé písmeno." },
  {
    q: "Které slovo píšeme s velkým písmenem?",
    a: "Karel (jméno)",
    opts: ["Karel (jméno)", "karta", "kámen", "koupit"],
    e: "Karel = jméno konkrétního člověka → velké K. Ostatní jsou obecná / slovesa → malé.",
    hints: [
      "Toto slovo označuje jednu konkrétní osobu → píšeme ho s velkým písmenem.",
      "Slova, která platí obecně pro kohokoli nebo cokoli, píšeme s malým písmenem.",
    ],
  },
  { q: "Věta: 'V zoo jsme viděli lva Simbu.' Které slovo je vlastní jméno?", a: "Simbu (jméno lva)", opts: ["Simbu (jméno lva)", "lva", "zoo", "viděli"], e: "Simba je jméno konkrétního lva → vlastní jméno, velké S." },
];

const POOL_L3: Item[] = [
  // Obtížné případy — kontext, oblasti, měsíce, oslovení
  { q: "Jak napíšeme: 'Bydlím v ulici Na _____' (kopec)?", a: "Kopci", opts: ["Kopci", "kopci", "KOPCI", "kOpci"], e: "Součást názvu ulice 'Na Kopci' → velké K." },
  { q: "Jak napíšeme název měsíce ve větě '28. _____ máme svátek'?", a: "října", opts: ["října", "Října", "ŘÍJNA", "říJna"], e: "Názvy měsíců se v češtině píší MALÝM písmenem." },
  { q: "Jak správně: 'Učitelka se jmenuje ___ Nováková.'", a: "paní Nováková", opts: ["paní Nováková", "Paní Nováková", "paní nováková", "PANÍ NOVÁKOVÁ"], e: "'Paní' = obecné oslovení (malé p). 'Nováková' = příjmení (velké N)." },
  { q: "Které z těchto píšeme s velkým písmenem?", a: "Západ (část světa jako název oblasti)", opts: ["Západ (část světa jako název oblasti)", "západ slunce", "západiště", "zapádat"], e: "'Západ' jako název oblasti (Západ Evropy) → velké. 'Západ slunce' (obecný děj) → malé." },
  { q: "Věta: 'V pondělí jedeme do Prahy.' Kolik slov s velkým písmenem má být?", a: "Dvě (V + Prahy)", opts: ["Dvě (V + Prahy)", "Jedno (jen V)", "Tři (V + pondělí + Prahy)", "Jedno (Prahy)"], e: "'V' na začátku věty a 'Prahy' jako vlastní jméno města. 'Pondělí' (den v týdnu) → malé p." },
  { q: "Jak píšeme 'ulice Karlova' ve větě?", a: "ulice Karlova", opts: ["ulice Karlova", "Ulice Karlova", "ulice karlova", "ULICE KARLOVA"], e: "'Ulice' je obecné (malé u), 'Karlova' je vlastní jméno ulice (velké K)." },
  { q: "Jak napíšeme název svátku 'vánoce'?", a: "Vánoce", opts: ["Vánoce", "vánoce", "VÁNOCE", "vÁnoce"], e: "Vánoce jako název svátku píšeme s velkým V." },
  { q: "Která z těchto vět je napsána SPRÁVNĚ?", a: "V pondělí jsme jeli k babičce do Ostravy.", opts: ["V pondělí jsme jeli k babičce do Ostravy.", "V Pondělí jsme jeli k babičce do ostravy.", "v pondělí jsme jeli k Babičce do Ostravy.", "V pondělí Jsme jeli k babičce do Ostravy."], e: "'V' na začátku, 'pondělí' malé (den), 'babičce' malé (obecné), 'Ostravy' velké (město)." },
  { q: "Jak napíšeme 'na Moravě' v běžné větě?", a: "na Moravě", opts: ["na Moravě", "Na Moravě", "na moravě", "NA MORAVĚ"], e: "'Na' je předložka (malé n), 'Morava' je zeměpisný název (velké M)." },
  { q: "Jak správně: 'Karlův _____ v Praze' (most)?", a: "most", opts: ["most", "Most", "MOST", "moST"], e: "V názvu 'Karlův most' je Karlův s velkým K (přídavné jméno od Karla), ale 'most' je obecný typ stavby → malé m." },
];

function pick(pool: Item[]): PracticeTask[] {
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: hints ?? [
      "Vlastní jméno = jméno konkrétní osoby, místa, řeky, hory → velké písmeno.",
      "Obecné jméno = každý pes, každá hora → malé písmeno.",
    ],
    explanation: e,
  }));
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
}

export const VELKAPISMENA: TopicMetadata[] = [
  {
    id: "g3-cjl-velka-pismena",
    rvpNodeId: "g3-cjl-jazykova-vychova-pravopis-velka-pismena-ve-vlastnich-jmenech-osoby-mesta-reky-hory",
    title: "Velká písmena ve vlastních jménech (osoby, města, řeky, hory)",
    studentTitle: "Velká písmena",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Naučíš se psát velká písmena u jmen lidí, měst, řek a hor.",
    keywords: ["velké písmeno", "vlastní jméno", "osoby", "města", "řeky", "hory", "Praha", "Vltava"],
    goals: ["Rozlišit vlastní a obecné jméno.", "Psát správně velké písmeno u jmen osob, měst, řek a hor.", "Opravit chybně napsaná vlastní jména."],
    boundaries: ["Jména osob, měst, řek, hor, států.", "Bez názvů institucí a svátků."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Vlastní jméno = jméno KONKRÉTNÍ osoby nebo místa → velké písmeno. Obecné = každý/každá → malé.",
      steps: ["Ptám se: je to jméno konkrétní osoby nebo místa?", "Ano (Karel, Praha, Vltava, Krkonoše) → Velké.", "Ne (pes, hora, řeka obecně) → Malé."],
      commonMistake: "'pes' × 'Azor' — pes je obecné (malé), Azor je jméno konkrétního psa (velké).",
      example: "Vltava (konkrétní řeka) → velké V. / řeka (obecně) → malé ř.",
    },
  },
];
