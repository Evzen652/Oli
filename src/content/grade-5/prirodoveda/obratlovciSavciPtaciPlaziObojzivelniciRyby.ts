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
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Kachna divoká", right: "Pták" },
      { left: "Vlk obecný", right: "Savec" },
      { left: "Kapr obecný", right: "Ryba" },
      { left: "Ještěrka obecná", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Skokan zelený", right: "Obojživelník" },
      { left: "Netopýr ušatý", right: "Savec" },
      { left: "Čáp bílý", right: "Pták" },
      { left: "Kapr", right: "Ryba" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Užovka obojková", right: "Plaz" },
      { left: "Mlok skvrnitý", right: "Obojživelník" },
      { left: "Sýkorka koňadra", right: "Pták" },
      { left: "Jelen evropský", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Velryba modrá", right: "Savec" },
      { left: "Delfín skákavý", right: "Savec" },
      { left: "Tuňák obecný", right: "Ryba" },
      { left: "Tučňák císařský", right: "Pták" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Lev africký", right: "Savec" },
      { left: "Krokodýl nilský", right: "Plaz" },
      { left: "Orel skalní", right: "Pták" },
      { left: "Kaiman", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Žába rosnička", right: "Obojživelník" },
      { left: "Srnec obecný", right: "Savec" },
      { left: "Datel černý", right: "Pták" },
      { left: "Okounek pstruhový", right: "Ryba" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Liška obecná", right: "Savec" },
      { left: "Slepýš křehký", right: "Plaz" },
      { left: "Volavka šedá", right: "Pták" },
      { left: "Štika obecná", right: "Ryba" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do která patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Čolník obecný", right: "Obojživelník" },
      { left: "Vydra říční", right: "Savec" },
      { left: "Kavka obecná", right: "Pták" },
      { left: "Losos atlantský", right: "Ryba" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Medvěd hnědý", right: "Savec" },
      { left: "Ropucha obecná", right: "Obojživelník" },
      { left: "Sokol stěhovavý", right: "Pták" },
      { left: "Ještěrka zelená", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Ptakopysk", right: "Savec" },
      { left: "Kachna", right: "Pták" },
      { left: "Iguana", right: "Plaz" },
      { left: "Žarloun (ryba)", right: "Ryba" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Plch velký", right: "Savec" },
      { left: "Rys ostrovid", right: "Savec" },
      { left: "Ondatra pižmová", right: "Savec" },
      { left: "Žába skokan hnědý", right: "Obojživelník" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Hatérie novozélandská", right: "Plaz" },
      { left: "Kivi hnědý", right: "Pták" },
      { left: "Vombat", right: "Savec" },
      { left: "Barakuda", right: "Ryba" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Bílý medvěd", right: "Savec" },
      { left: "Tučňák", right: "Pták" },
      { left: "Mrož", right: "Savec" },
      { left: "Tuleň", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Zmije obecná", right: "Plaz" },
      { left: "Ropucha", right: "Obojživelník" },
      { left: "Poštolka obecná", right: "Pták" },
      { left: "Zajíc polní", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Žralok bílý", right: "Ryba" },
      { left: "Keporkak (velryba)", right: "Savec" },
      { left: "Albatros", right: "Pták" },
      { left: "Mořská želva", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Gorila horská", right: "Savec" },
      { left: "Orangutan", right: "Savec" },
      { left: "Papoušek šedý", right: "Pták" },
      { left: "Chameleon jemenský", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Kapr stříbřitý", right: "Ryba" },
      { left: "Olm jeskynní", right: "Obojživelník" },
      { left: "Sova pálená", right: "Pták" },
      { left: "Veverka popelavá", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Nosorožec tuponosý", right: "Savec" },
      { left: "Hroch obojživelný", right: "Savec" },
      { left: "Plameňák", right: "Pták" },
      { left: "Varán komodský", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Střevle potoční", right: "Ryba" },
      { left: "Čolník dunajský", right: "Obojživelník" },
      { left: "Strakapoud velký", right: "Pták" },
      { left: "Jelenec wapiti", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Slon africký", right: "Savec" },
      { left: "Žirafa", right: "Savec" },
      { left: "Pštros africký", right: "Pták" },
      { left: "Krokodýl", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Vlk šedý", right: "Savec" },
      { left: "Sova výr velký", right: "Pták" },
      { left: "Zmije", right: "Plaz" },
      { left: "Žába ropucha", right: "Obojživelník" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Rak řeky", right: "Ryba (žije ve vodě, ale není ryba – viz hinting)" },
      { left: "Kapr", right: "Ryba" },
      { left: "Netopýr", right: "Savec" },
      { left: "Holub", right: "Pták" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Pes domácí", right: "Savec" },
      { left: "Kočka domácí", right: "Savec" },
      { left: "Slepice domácí", right: "Pták" },
      { left: "Zlatá rybka", right: "Ryba" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Kůň domácí", right: "Savec" },
      { left: "Andulka vlnkovaná", right: "Pták" },
      { left: "Želva suchozemská", right: "Plaz" },
      { left: "Leguán zelený", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Manta velká (rejnok)", right: "Ryba" },
      { left: "Orka (kosatka)", right: "Savec" },
      { left: "Mořský koník", right: "Ryba" },
      { left: "Mořský lev", right: "Savec" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Bobr evropský", right: "Savec" },
      { left: "Volavka purpurová", right: "Pták" },
      { left: "Čolník horský", right: "Obojživelník" },
      { left: "Piskor pruhovaný", right: "Ryba" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Vlk šedý", right: "Savec" },
      { left: "Holub skalní", right: "Pták" },
      { left: "Slepýš", right: "Plaz" },
      { left: "Mník jednovousý", right: "Ryba" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Losos obecný", right: "Ryba" },
      { left: "Vydra mořská", right: "Savec" },
      { left: "Alka velká (vyhynulá)", right: "Pták" },
      { left: "Iguana mořská", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Antilopa skákavá", right: "Savec" },
      { left: "Gepard štíhlý", right: "Savec" },
      { left: "Marabu africký", right: "Pták" },
      { left: "Kobra indická", right: "Plaz" },
    ],
  },
  {
    question: "Spoj živočicha se skupinou obratlovců, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Ježek západní", right: "Savec" },
      { left: "Ropucha obecná", right: "Obojživelník" },
      { left: "Strnad obecný", right: "Pták" },
      { left: "Plotice obecná", right: "Ryba" },
    ],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 30);
}

export const OBRATLOVCISAVCIPTACIPLAZIOBOJZIVELNICIRYBY: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby",
    title: "Obratlovci - savci, ptáci, plazi, obojživelníci, ryby",
    studentTitle: "Skupiny obratlovců",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Třídění organismů",
    briefDescription: "Poznáš 5 skupin obratlovců a jejich hlavní znaky.",
    keywords: ["obratlovci", "savci", "ptáci", "plazi", "obojživelníci", "ryby", "teplokrevní", "studenokrevní"],
    goals: ["Vyjmenovat 5 skupin obratlovců", "Popsat hlavní znaky každé skupiny", "Zařadit konkrétní živočichy do správné skupiny"],
    boundaries: ["Neprobírá fylogenetiku obratlovců", "Neprobírá anatomii do hloubky"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "5 skupin: ryby (žábry), obojživelníci (voda+souš), plazi (šupiny, studenokrevní), ptáci (peří), savci (srst, mléko).",
      steps: [
        "1. Ryby: žábry, ploutve, šupiny, voda.",
        "2. Obojživelníci: larvy ve vodě, dospělci i na souši.",
        "3. Plazi: šupiny, studenokrevní, suchá kůže.",
        "4. Ptáci: peří, teplokrevní, vejce.",
        "5. Savci: srst, teplokrevní, kojení mlékem.",
      ],
      commonMistake: "Velryba je SAVEC (kojí mlékem), ne ryba. Delfín také.",
      example: "Žába = obojživelník. Had = plaz. Holub = pták. Pes = savec.",
    },
  },
];
