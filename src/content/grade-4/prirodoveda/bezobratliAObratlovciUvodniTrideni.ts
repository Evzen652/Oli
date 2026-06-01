import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Včela medonosná", right: "Hmyz" },
      { left: "Pes domácí", right: "Savec" },
      { left: "Holub domácí", right: "Pták" },
      { left: "Ještěrka obecná", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Pavouk křižák", right: "Pavoukovci" },
      { left: "Kapr obecný", right: "Ryby" },
      { left: "Skokan zelený", right: "Obojživelníci" },
      { left: "Bažant obecný", right: "Pták" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Hlemýžď zahradní", right: "Měkkýši" },
      { left: "Klíště obecné", right: "Pavoukovci" },
      { left: "Kuna lesní", right: "Savec" },
      { left: "Kapr", right: "Ryby" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Motýl babočka", right: "Hmyz" },
      { left: "Žížala obecná", right: "Červi" },
      { left: "Had užovka", right: "Plaz" },
      { left: "Netopýr ušatý", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Čmelák zemní", right: "Hmyz" },
      { left: "Rak říční", right: "Korýši" },
      { left: "Sýkorka koňadra", right: "Pták" },
      { left: "Mlok skvrnitý", right: "Obojživelníci" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Štír", right: "Pavoukovci" },
      { left: "Slimák", right: "Měkkýši" },
      { left: "Losos atlantský", right: "Ryby" },
      { left: "Vlk obecný", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Mravenec lesní", right: "Hmyz" },
      { left: "Žába rosnička", right: "Obojživelníci" },
      { left: "Liška obecná", right: "Savec" },
      { left: "Pijavice lékařská", right: "Červi" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Vrápenec malý", right: "Savec" },
      { left: "Štika obecná", right: "Ryby" },
      { left: "Šnek vinný", right: "Měkkýši" },
      { left: "Čáp bílý", right: "Pták" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Koník stepní", right: "Hmyz" },
      { left: "Krab", right: "Korýši" },
      { left: "Zmije obecná", right: "Plaz" },
      { left: "Ježek západní", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Brouk zlatohlávek", right: "Hmyz" },
      { left: "Datel černý", right: "Pták" },
      { left: "Humr evropský", right: "Korýši" },
      { left: "Srnec obecný", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Komár", right: "Hmyz" },
      { left: "Krokodýl nilský", right: "Plaz" },
      { left: "Plch velký", right: "Savec" },
      { left: "Chobotnice", right: "Měkkýši" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Tuleň", right: "Savec" },
      { left: "Candát obecný", right: "Ryby" },
      { left: "Kobylka", right: "Hmyz" },
      { left: "Slepýš křehký", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Moucha domácí", right: "Hmyz" },
      { left: "Řekněte, kam patří tasemnice?", right: "Červi" },
      { left: "Čáp černý", right: "Pták" },
      { left: "Vydra říční", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Vosa obecná", right: "Hmyz" },
      { left: "Krevetka říční", right: "Korýši" },
      { left: "Jelen evropský", right: "Savec" },
      { left: "Rosnička zelená", right: "Obojživelníci" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Strnad obecný", right: "Pták" },
      { left: "Kuna skalní", right: "Savec" },
      { left: "Pijavka", right: "Červi" },
      { left: "Kameleon", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Veverka obecná", right: "Savec" },
      { left: "Cikáda", right: "Hmyz" },
      { left: "Čolník obecný", right: "Obojživelníci" },
      { left: "Mušle", right: "Měkkýši" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Moucha masná", right: "Hmyz" },
      { left: "Jeřáb popelavý", right: "Pták" },
      { left: "Bobr evropský", right: "Savec" },
      { left: "Platýz", right: "Ryby" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Čmelák skalní", right: "Hmyz" },
      { left: "Skokanka štíhlá", right: "Obojživelníci" },
      { left: "Bělozubka šedá", right: "Savec" },
      { left: "Krab říční", right: "Korýši" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Svišť horský", right: "Savec" },
      { left: "Tesařík obecný", right: "Hmyz" },
      { left: "Pelikán", right: "Pták" },
      { left: "Horský had (asp)", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Střevle potoční", right: "Ryby" },
      { left: "Kopřivka obecná", right: "Hmyz" },
      { left: "Tchoř stepní", right: "Savec" },
      { left: "Rosnička", right: "Obojživelníci" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Jepice obecná", right: "Hmyz" },
      { left: "Kachna divoká", right: "Pták" },
      { left: "Slimák plzák", right: "Měkkýši" },
      { left: "Želva bahenní", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Šváb obecný", right: "Hmyz" },
      { left: "Netopýr velký", right: "Savec" },
      { left: "Piskor pruhovaný", right: "Ryby" },
      { left: "Volavka šedá", right: "Pták" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Vlasatka (vlasovec)", right: "Červi" },
      { left: "Rys ostrovid", right: "Savec" },
      { left: "Čáp bílý", right: "Pták" },
      { left: "Krabice modrá", right: "Korýši" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Sýkora modřinka", right: "Pták" },
      { left: "Kuna lesní", right: "Savec" },
      { left: "Šídlo modré", right: "Hmyz" },
      { left: "Kapr stříbřitý", right: "Ryby" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Jelenec (wapiti)", right: "Savec" },
      { left: "Komár pisklavý", right: "Hmyz" },
      { left: "Geko domácí", right: "Plaz" },
      { left: "Olm jeskynní", right: "Obojživelníci" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Dravec jestřáb", right: "Pták" },
      { left: "Závornatka lesní", right: "Měkkýši" },
      { left: "Vydra říční", right: "Savec" },
      { left: "Vran obecný", right: "Pták" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Stonožka", right: "Hmyz (mnohonožkovci)" },
      { left: "Hvězdice mořská", right: "Ostnokožci" },
      { left: "Medvěd hnědý", right: "Savec" },
      { left: "Hatérie novozélandská", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Jezerní kapr", right: "Ryby" },
      { left: "Krkavec velký", right: "Pták" },
      { left: "Krtek obecný", right: "Savec" },
      { left: "Pulec skokana", right: "Obojživelníci" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Šváb lesní", right: "Hmyz" },
      { left: "Plch lískový", right: "Savec" },
      { left: "Anakonda zelená", right: "Plaz" },
      { left: "Mlok horský", right: "Obojživelníci" },
    ],
  },
  {
    question: "Spoj živočicha s jeho skupinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Zubr evropský", right: "Savec" },
      { left: "Vážka ploská", right: "Hmyz" },
      { left: "Káně lesní", right: "Pták" },
      { left: "Rak bahenní", right: "Korýši" },
    ],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 30);
}

export const BEZOBRATLIAOBRATLOVCIUVODNITRIDENI: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-bezobratli-a-obratlovci-uvodni-trideni",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-bezobratli-a-obratlovci-uvodni-trideni",
    title: "Bezobratlí a obratlovci (úvodní třídění)",
    studentTitle: "Třídění živočichů",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Naučíš se třídit živočichy a rozlišíš bezobratlé od obratlovců.",
    keywords: ["bezobratlí", "obratlovci", "hmyz", "pavoukovci", "měkkýši", "červi", "ryby", "obojživelníci", "plazi", "ptáci", "savci"],
    goals: [
      "Vysvětlit rozdíl mezi bezobratlými a obratlovci",
      "Zařadit typické živočichy do správné skupiny",
      "Popsat znaky každé skupiny obratlovců",
      "Popsat znaky hmyzu, pavoukovců a měkkýšů",
    ],
    boundaries: ["Podrobná taxonomie a latinské názvy nejsou náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Klíč: páteř? → obratlovci. Počet noh: 6=hmyz, 8=pavoukovci.",
      steps: [
        "1. Bezobratlí: bez páteře (hmyz, pavouci, šneci, žížaly).",
        "2. Hmyz: 6 noh, 3 části těla. Pavouk: 8 noh, 2 části.",
        "3. Obratlovci: ryby, obojživelníci, plazi, ptáci, savci.",
        "4. Savci = srst + kojení. Ptáci = peří + vejce. Plazi = šupiny + chladnokrevní.",
      ],
      commonMistake: "Pavouk není hmyz — má 8 noh, ne 6.",
      example: "Motýl: hmyz (6 noh). Klíště: pavoukovci (8 noh). Kapr: ryba (obratlovci). Žába: obojživelník.",
    },
  },
];
