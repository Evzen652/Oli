import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), match_pairs (4 páry/úloha).
//   L1 = rozpoznání: nejběžnější/prototypická zvířata, žádné záludnosti
//   L2 = aplikace:   méně běžná, ale standardní zvířata téže skupiny
//   L3 = transfer:   typické miskoncepce (netopýr, slepýš, tučňák, mlok, úhoř,
//                    velryba — zvířata, která vypadají/chovají se zavádějícím
//                    způsobem); zařazení podle znaků těla, ne podle pohybu
//
// Opraveno 2026-09-11 (inventura obsahu): úlohy neměly vysvětlení a nápovědy
// přímo prozrazovaly skupinu („… — je to savec"). Teď malá nápověda navede na
// konkrétní zvíře úlohy, velká vyjmenuje rozlišovací znaky všech čtyř zvířat
// (bez názvu skupiny) a vysvětlení u každého zvířete řekne PROČ.
// ─────────────────────────────────────────────────────────

type Skupina = "savec" | "pták" | "ryba" | "plaz" | "obojživelník" | "hmyz";

/** „patří mezi …" — 4. pád množného čísla. */
const MEZI: Record<Skupina, string> = {
  savec: "savce",
  pták: "ptáky",
  ryba: "ryby",
  plaz: "plazy",
  obojživelník: "obojživelníky",
  hmyz: "hmyz",
};

/** Rozlišovací znak zvířete (bez názvu skupiny) a volitelně past, která mate. */
interface Znak {
  z: string;
  past?: string;
}

const SAVEC = "má srst a mláďata kojí mlékem";
const PTAK = "má peří a zobák a klade vejce";
const RYBA = "žije ve vodě, dýchá žábrami a má ploutve";
const PLAZ = "má suchou kůži se šupinami";
const OBOJ = "má vlhkou kůži bez šupin a z vajíček ve vodě se jí líhnou pulci";
const HMYZ = "má šest nohou a tělo ze tří částí";

const ZNAKY: Record<string, Znak> = {
  // savci
  pes: { z: "má srst a štěňata kojí mlékem" },
  kráva: { z: "má srst a tele kojí mlékem" },
  liška: { z: SAVEC },
  kočka: { z: "má srst a koťata kojí mlékem" },
  kůň: { z: "má srst a hříbě kojí mlékem" },
  ovce: { z: "má vlnu (hustou srst) a jehňata kojí mlékem" },
  zajíc: { z: SAVEC },
  medvěd: { z: "má hustou srst a medvíďata kojí mlékem" },
  koza: { z: "má srst a kůzlata kojí mlékem" },
  vlk: { z: "má srst a vlčata kojí mlékem" },
  prase: { z: "má štětiny (hrubou srst) a selata kojí mlékem" },
  myš: { z: SAVEC },
  králík: { z: SAVEC },
  jezevec: { z: SAVEC },
  vydra: { z: "má hustou srst a mláďata kojí mlékem", past: "skvěle plave" },
  hroch: { z: "dýchá plícemi, má řídké chlupy a mládě kojí mlékem", past: "tráví celý den ve vodě" },
  ježek: { z: "má na břiše srst a mláďata kojí mlékem", past: "má na zádech bodliny" },
  rys: { z: SAVEC },
  kuna: { z: SAVEC },
  los: { z: SAVEC },
  srnec: { z: SAVEC },
  bobr: { z: "má hustou srst a mláďata kojí mlékem", past: "staví hráze a hodně plave" },
  veverka: { z: SAVEC },
  netopýr: { z: SAVEC, past: "létá" },
  velryba: { z: "dýchá plícemi a mládě kojí mlékem", past: "žije v moři" },
  // ptáci
  sýkora: { z: PTAK },
  čáp: { z: PTAK },
  holub: { z: PTAK },
  kachna: { z: PTAK, past: "plave po rybníce" },
  vrabec: { z: PTAK },
  husa: { z: PTAK },
  kos: { z: PTAK },
  slepice: { z: PTAK },
  orel: { z: PTAK },
  labuť: { z: PTAK, past: "plave po vodě" },
  rorýs: { z: PTAK },
  vlaštovka: { z: PTAK },
  sova: { z: PTAK },
  straka: { z: PTAK },
  datel: { z: PTAK },
  volavka: { z: PTAK },
  ledňáček: { z: PTAK, past: "loví ve vodě" },
  tučňák: { z: PTAK, past: "neumí létat a skvěle plave" },
  pštros: { z: PTAK, past: "neumí létat" },
  // ryby
  kapr: { z: RYBA },
  štika: { z: RYBA },
  pstruh: { z: RYBA },
  candát: { z: RYBA },
  losos: { z: RYBA },
  sumec: { z: RYBA },
  lín: { z: RYBA },
  plotice: { z: RYBA },
  okoun: { z: RYBA },
  úhoř: { z: RYBA, past: "má dlouhé tělo jako had" },
  // plazi
  ještěrka: { z: PLAZ },
  had: { z: PLAZ, past: "nemá nohy" },
  užovka: { z: PLAZ, past: "nemá nohy" },
  zmije: { z: PLAZ, past: "nemá nohy" },
  krajta: { z: PLAZ, past: "nemá nohy" },
  želva: { z: "má krunýř a suchou kůži se šupinami" },
  krokodýl: { z: "má suchou kůži s tvrdými šupinami", past: "tráví hodně času ve vodě" },
  gekon: { z: PLAZ, past: "leze po zdi" },
  chameleon: { z: PLAZ },
  varan: { z: PLAZ },
  slepýš: { z: "má suchou kůži se šupinami a mrká víčky jako ještěrka", past: "nemá nohy a vypadá jako had" },
  // obojživelníci
  žába: { z: OBOJ },
  ropucha: { z: "má bradavičnatou kůži bez šupin a z vajíček ve vodě se jí líhnou pulci" },
  rosnička: { z: OBOJ, past: "leze po listech" },
  blatnice: { z: OBOJ },
  kuňka: { z: OBOJ },
  skokan: { z: "má vlhkou kůži bez šupin a z vajíček ve vodě se mu líhnou pulci" },
  čolek: { z: "má vlhkou kůži bez šupin a jeho larvy dýchají ve vodě žábrami", past: "vypadá trochu jako ještěrka" },
  mlok: { z: "má vlhkou kůži bez šupin a jeho larvy vyrůstají ve vodě", past: "vypadá jako ještěrka" },
  // hmyz
  moucha: { z: "má šest nohou, dvě křídla a tělo ze tří částí" },
  mravenec: { z: HMYZ },
  motýl: { z: "má šest nohou, čtyři křídla a tělo ze tří částí" },
  včela: { z: HMYZ },
  beruška: { z: "má šest nohou a tvrdé krovky" },
  vosa: { z: HMYZ },
  brouk: { z: "má šest nohou a tvrdé krovky" },
  cvrček: { z: HMYZ },
  komár: { z: HMYZ },
  světluška: { z: HMYZ },
  vážka: { z: "má šest nohou, čtyři křídla a tělo ze tří částí" },
  kobylka: { z: HMYZ },
};

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

const ZADANI: Record<1 | 2 | 3, string> = {
  1: "Spoj každé zvíře se skupinou živočichů, do které patří.",
  2: "Spoj méně známá zvířata se skupinou živočichů, do které patří.",
  3: "Pozor, některá zvířata klamou vzhledem! Spoj každé se skupinou, do které opravdu patří.",
};

/** [malá nápověda (unikátní pro úlohu), čtyři dvojice zvíře → skupina] */
type Radek = [string, [string, Skupina][]];

function uloha(level: 1 | 2 | 3, [h0, dvojice]: Radek): PracticeTask {
  const popis = dvojice.map(([zvire]) => {
    const zn = ZNAKY[zvire];
    if (!zn) throw new Error(`Chybí znak zvířete „${zvire}“`);
    return zn.past ? `${zvire} – ${zn.past}, ale ${zn.z}` : `${zvire} – ${zn.z}`;
  });
  const proc = dvojice.map(([zvire, sk]) => {
    const zn = ZNAKY[zvire];
    return zn.past
      ? `${cap(zvire)} sice ${zn.past}, ale patří mezi ${MEZI[sk]}, protože ${zn.z}.`
      : `${cap(zvire)} patří mezi ${MEZI[sk]}, protože ${zn.z}.`;
  });
  return {
    question: ZADANI[level],
    correctAnswer: "match",
    pairs: dvojice.map(([left, right]) => ({ left, right })),
    hints: [
      h0,
      `Rozhoduj podle znaků těla, ne podle toho, jak se zvíře pohybuje. Zvíře po zvířeti: ${popis.join("; ")}. Ke každému znaku pak najdi skupinu.`,
    ],
    explanation: proc.join(" "),
  };
}

const POOL_L1: Radek[] = [
  ["U kapra a žáby se rozhodni podle toho, čím dýchají a jakou mají kůži.", [["pes", "savec"], ["kapr", "ryba"], ["sýkora", "pták"], ["žába", "obojživelník"]]],
  ["Ještěrka i štika mají šupiny — v čem se liší? Kde která žije?", [["kráva", "savec"], ["štika", "ryba"], ["čáp", "pták"], ["ještěrka", "plaz"]]],
  ["Spočítej nohy: kolik jich má moucha a kolik had?", [["liška", "savec"], ["moucha", "hmyz"], ["holub", "pták"], ["had", "plaz"]]],
  ["Kachna i ropucha žijí u rybníka — podívej se, čím mají pokryté tělo.", [["kočka", "savec"], ["mravenec", "hmyz"], ["kachna", "pták"], ["ropucha", "obojživelník"]]],
  ["Motýl i vrabec létají — má každý z nich peří, nebo šest nohou?", [["kůň", "savec"], ["motýl", "hmyz"], ["vrabec", "pták"], ["pstruh", "ryba"]]],
  ["Želva má krunýř — a jakou kůži má pod ním? Suchou, nebo vlhkou?", [["ovce", "savec"], ["včela", "hmyz"], ["husa", "pták"], ["želva", "plaz"]]],
  ["Vzpomeň si, jak vypadá malá žába — kde žije pulec?", [["zajíc", "savec"], ["beruška", "hmyz"], ["kos", "pták"], ["žába", "obojživelník"]]],
  ["Candát i had mají šupiny — kde který žije a čím dýchá?", [["medvěd", "savec"], ["candát", "ryba"], ["slepice", "pták"], ["had", "plaz"]]],
  ["Orel i moucha létají — podívej se, čím mají pokryté tělo a kolik mají nohou.", [["koza", "savec"], ["moucha", "hmyz"], ["orel", "pták"], ["ještěrka", "plaz"]]],
  ["Labuť, losos i ropucha žijí u vody nebo ve vodě — rozhodni podle kůže a dýchání.", [["vlk", "savec"], ["losos", "ryba"], ["labuť", "pták"], ["ropucha", "obojživelník"]]],
  ["Krokodýl žije u vody — ale jakou má kůži?", [["prase", "savec"], ["mravenec", "hmyz"], ["čáp", "pták"], ["krokodýl", "plaz"]]],
  ["Začni myší: čím krmí svá mláďata?", [["myš", "savec"], ["motýl", "hmyz"], ["kachna", "pták"], ["kapr", "ryba"]]],
  ["Vosa má křídla jako čáp — spočítej jí ale nohy.", [["králík", "savec"], ["vosa", "hmyz"], ["čáp", "pták"], ["štika", "ryba"]]],
];

const POOL_L2: Radek[] = [
  ["Čolek vypadá trochu jako ještěrka — je jeho kůže suchá, nebo vlhká?", [["jezevec", "savec"], ["sumec", "ryba"], ["rorýs", "pták"], ["čolek", "obojživelník"]]],
  ["Vydra umí skvěle plavat — čím má ale pokryté tělo?", [["vydra", "savec"], ["lín", "ryba"], ["vlaštovka", "pták"], ["gekon", "plaz"]]],
  ["Hroch tráví den ve vodě — čím ale krmí svá mláďata?", [["hroch", "savec"], ["plotice", "ryba"], ["sova", "pták"], ["rosnička", "obojživelník"]]],
  ["Ježek má bodliny — co má na břiše a čím krmí mláďata?", [["ježek", "savec"], ["okoun", "ryba"], ["straka", "pták"], ["chameleon", "plaz"]]],
  ["U brouka spočítej nohy, u varana se podívej na kůži.", [["rys", "savec"], ["brouk", "hmyz"], ["datel", "pták"], ["varan", "plaz"]]],
  ["Blatnici možná neznáš — napoví ti, jakou má kůži a kde vyrůstají její mláďata.", [["kuna", "savec"], ["cvrček", "hmyz"], ["volavka", "pták"], ["blatnice", "obojživelník"]]],
  ["Užovka nemá nohy — jakou má ale kůži?", [["los", "savec"], ["komár", "hmyz"], ["sova", "pták"], ["užovka", "plaz"]]],
  ["Světluška v noci svítí — kolik má ale nohou?", [["srnec", "savec"], ["světluška", "hmyz"], ["rorýs", "pták"], ["zmije", "plaz"]]],
  ["Vážka má velká křídla — spočítej jí nohy a části těla.", [["jezevec", "savec"], ["vážka", "hmyz"], ["straka", "pták"], ["krajta", "plaz"]]],
  ["Sumec i kuňka žijí ve vodě — dýchají ale oba celý život žábrami?", [["vydra", "savec"], ["sumec", "ryba"], ["vlaštovka", "pták"], ["kuňka", "obojživelník"]]],
  ["Gekon leze po zdi jako moucha — spočítej mu ale nohy a podívej se na kůži.", [["hroch", "savec"], ["brouk", "hmyz"], ["datel", "pták"], ["gekon", "plaz"]]],
  ["Rosnička je zelená a leze po listech — jak vypadají její mláďata?", [["ježek", "savec"], ["cvrček", "hmyz"], ["volavka", "pták"], ["rosnička", "obojživelník"]]],
  ["Bobr i skokan žijí u vody — rozhodni podle toho, čím mají pokryté tělo.", [["bobr", "savec"], ["kobylka", "hmyz"], ["ledňáček", "pták"], ["skokan", "obojživelník"]]],
];

const POOL_L3: Radek[] = [
  ["Netopýr létá a tučňák plave — nenech se zmást tím, jak se pohybují.", [["netopýr", "savec"], ["tučňák", "pták"], ["kapr", "ryba"], ["žába", "obojživelník"]]],
  ["Slepýš a mlok vypadají podobně — porovnej, jakou má každý z nich kůži.", [["slepýš", "plaz"], ["mlok", "obojživelník"], ["pes", "savec"], ["sýkora", "pták"]]],
  ["Úhoř a had mají podobně dlouhé tělo — kde žije úhoř a čím dýchá?", [["netopýr", "savec"], ["úhoř", "ryba"], ["had", "plaz"], ["moucha", "hmyz"]]],
  ["Tučňák neumí létat a slepýš nemá nohy — rozhoduje ale něco jiného než pohyb.", [["tučňák", "pták"], ["slepýš", "plaz"], ["kráva", "savec"], ["včela", "hmyz"]]],
  ["Mlok a ještěrka vypadají skoro stejně — rozhodne jejich kůže.", [["mlok", "obojživelník"], ["netopýr", "savec"], ["štika", "ryba"], ["ještěrka", "plaz"]]],
  ["Porovnej kůži slepýše a žáby — která je suchá a která vlhká?", [["slepýš", "plaz"], ["tučňák", "pták"], ["žába", "obojživelník"], ["liška", "savec"]]],
  ["Netopýr i kos létají — čím má ale každý z nich pokryté tělo?", [["netopýr", "savec"], ["mlok", "obojživelník"], ["kos", "pták"], ["mravenec", "hmyz"]]],
  ["Tři z těch zvířat klamou vzhledem — začni koněm, pak řeš úhoře, slepýše a tučňáka.", [["úhoř", "ryba"], ["slepýš", "plaz"], ["tučňák", "pták"], ["kůň", "savec"]]],
  ["Had a čolek — jeden má suchou šupinatou kůži, druhý vlhkou bez šupin.", [["netopýr", "savec"], ["tučňák", "pták"], ["čolek", "obojživelník"], ["had", "plaz"]]],
  ["Mlok ani slepýš nejsou tím, čím se na první pohled zdají — co mají na kůži?", [["mlok", "obojživelník"], ["slepýš", "plaz"], ["veverka", "savec"], ["vrabec", "pták"]]],
  ["Motýl i netopýr létají — spočítej jim nohy a podívej se na povrch těla.", [["netopýr", "savec"], ["úhoř", "ryba"], ["tučňák", "pták"], ["motýl", "hmyz"]]],
  ["Začni jistými zvířaty (moucha, holub) a pak porovnej slepýše s mlokem.", [["slepýš", "plaz"], ["mlok", "obojživelník"], ["moucha", "hmyz"], ["holub", "pták"]]],
  ["Velryba žije v moři — čím ale dýchá a čím krmí mládě?", [["velryba", "savec"], ["pštros", "pták"], ["úhoř", "ryba"], ["mlok", "obojživelník"]]],
];

function gen(level: number): PracticeTask[] {
  const lv: 1 | 2 | 3 = level >= 3 ? 3 : level === 2 ? 2 : 1;
  const pool = lv === 3 ? POOL_L3 : lv === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool).map((r) => uloha(lv, r));
}

export const SKUPINYZIVOCICHU: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-rostliny-a-zivocichove-skupiny-zivocichu-savci-ptaci-ryby-plazi-obojzivelnici-hmyz",
    title: "Skupiny živočichů",
    studentTitle: "Zvířata a jejich skupiny",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Rostliny a živočichové",
    briefDescription: "Roztřídíš zvířata do skupin podle jejich znaků.",
    keywords: [
      "skupiny živočichů",
      "třídění zvířat",
      "savec",
      "savci",
      "pták",
      "ptáci",
      "ryba",
      "ryby",
      "plaz",
      "plazi",
      "obojživelník",
      "obojživelníci",
      "hmyz",
      "srst",
      "peří",
      "šupiny",
      "žábry",
      "obratlovci",
    ],
    goals: [
      "Roztřídit zvířata do skupin: savci, ptáci, ryby, plazi, obojživelníci, hmyz.",
      "Poznat skupinu živočicha podle typických znaků (srst, peří, šupiny, žábry).",
      "Přiřadit konkrétní zvíře ke správné skupině.",
    ],
    boundaries: [
      "Šest základních skupin pro 3. třídu — bez podrobné systematiky.",
      "Bez latinských názvů a detailní anatomie.",
      "Hmyz jako zástupce bezobratlých, ostatní skupiny jsou obratlovci.",
    ],
    gradeRange: [3, 3],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Savci mají srst a kojí mláďata. Ptáci mají peří a zobák. Ryby mají šupiny a dýchají žábrami. Plazi mají šupiny a jsou studenokrevní. Obojživelníci žijí ve vodě i na souši. Hmyz má 6 noh a 3 části těla.",
      steps: [
        "Podívej se na tělo zvířete — má srst, peří, nebo šupiny?",
        "Srst + kojí mláďata = savec. Peří + zobák = pták.",
        "Šupiny + žábry + žije ve vodě = ryba. Šupiny + studenokrevný = plaz.",
        "Žije ve vodě i na souši = obojživelník. 6 noh a 3 části těla = hmyz.",
      ],
      commonMistake:
        "Netopýr létá, ale je to savec (má srst). Slepýš vypadá jako had, ale je to plaz. Čolek a mlok jsou obojživelníci, ne plazi.",
      example:
        "Pes = savec (srst), kapr = ryba (žábry), sova = pták (peří), had = plaz (šupiny), žába = obojživelník, motýl = hmyz.",
    },
  },
];
