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
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Pták", items: ["Kachna divoká"] },
      { name: "Savec", items: ["Vlk obecný"] },
      { name: "Ryba", items: ["Kapr obecný"] },
      { name: "Plaz", items: ["Ještěrka obecná"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Obojživelník", items: ["Skokan zelený"] },
      { name: "Savec", items: ["Netopýr ušatý"] },
      { name: "Pták", items: ["Čáp bílý"] },
      { name: "Ryba", items: ["Kapr"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Plaz", items: ["Užovka obojková"] },
      { name: "Obojživelník", items: ["Mlok skvrnitý"] },
      { name: "Pták", items: ["Sýkorka koňadra"] },
      { name: "Savec", items: ["Jelen evropský"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    explanation: "Velryba i delfín jsou savci — dýchají vzduch, kojí mládě mlékem. Nejsou to ryby.",
    categories: [
      { name: "Savec", items: ["Velryba modrá", "Delfín skákavý"] },
      { name: "Ryba", items: ["Tuňák obecný"] },
      { name: "Pták", items: ["Tučňák císařský"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Lev africký"] },
      { name: "Plaz", items: ["Krokodýl nilský", "Kaiman"] },
      { name: "Pták", items: ["Orel skalní"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Obojživelník", items: ["Žába rosnička"] },
      { name: "Savec", items: ["Srnec obecný"] },
      { name: "Pták", items: ["Datel černý"] },
      { name: "Ryba", items: ["Okounek pstruhový"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Liška obecná"] },
      { name: "Plaz", items: ["Slepýš křehký"] },
      { name: "Pták", items: ["Volavka šedá"] },
      { name: "Ryba", items: ["Štika obecná"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Obojživelník", items: ["Čolek obecný"] },
      { name: "Savec", items: ["Vydra říční"] },
      { name: "Pták", items: ["Kavka obecná"] },
      { name: "Ryba", items: ["Losos atlantský"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Medvěd hnědý"] },
      { name: "Obojživelník", items: ["Ropucha obecná"] },
      { name: "Pták", items: ["Sokol stěhovavý"] },
      { name: "Plaz", items: ["Ještěrka zelená"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    explanation: "Ptakopysk je savec — kojí mládě mlékem, přestože snáší vejce.",
    categories: [
      { name: "Savec", items: ["Ptakopysk"] },
      { name: "Pták", items: ["Kachna"] },
      { name: "Plaz", items: ["Iguana"] },
      { name: "Ryba", items: ["Žarloun"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Plch velký", "Rys ostrovid", "Ondatra pižmová"] },
      { name: "Obojživelník", items: ["Skokan hnědý"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Plaz", items: ["Hatérie novozélandská"] },
      { name: "Pták", items: ["Kivi hnědý"] },
      { name: "Savec", items: ["Vombat"] },
      { name: "Ryba", items: ["Barakuda"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    explanation: "Mrož i tuleň jsou savci — přestože žijí ve vodě, dýchají vzduch a kojí mládě.",
    categories: [
      { name: "Savec", items: ["Lední medvěd", "Mrož", "Tuleň"] },
      { name: "Pták", items: ["Tučňák"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Plaz", items: ["Zmije obecná"] },
      { name: "Obojživelník", items: ["Ropucha"] },
      { name: "Pták", items: ["Poštolka obecná"] },
      { name: "Savec", items: ["Zajíc polní"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    explanation: "Keporkak (velryba) je savec, ne ryba — dýchá plícemi, mládě kojí mlékem.",
    categories: [
      { name: "Ryba", items: ["Žralok bílý"] },
      { name: "Savec", items: ["Keporkak"] },
      { name: "Pták", items: ["Albatros"] },
      { name: "Plaz", items: ["Mořská želva"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Gorila horská", "Orangutan"] },
      { name: "Pták", items: ["Papoušek šedý"] },
      { name: "Plaz", items: ["Chameleon jemenský"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Ryba", items: ["Kapr stříbřitý"] },
      { name: "Obojživelník", items: ["Olm jeskynní"] },
      { name: "Pták", items: ["Sova pálená"] },
      { name: "Savec", items: ["Veverka popelavá"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Nosorožec tuponosý", "Hroch obojživelný"] },
      { name: "Pták", items: ["Plameňák"] },
      { name: "Plaz", items: ["Varán komodský"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Ryba", items: ["Střevle potoční"] },
      { name: "Obojživelník", items: ["Čolek dunajský"] },
      { name: "Pták", items: ["Strakapoud velký"] },
      { name: "Savec", items: ["Jelenec wapiti"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Slon africký", "Žirafa"] },
      { name: "Pták", items: ["Pštros africký"] },
      { name: "Plaz", items: ["Krokodýl"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Vlk šedý"] },
      { name: "Pták", items: ["Výr velký"] },
      { name: "Plaz", items: ["Zmije"] },
      { name: "Obojživelník", items: ["Ropucha zelená"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Ryba", items: ["Kapr", "Lín obecný"] },
      { name: "Savec", items: ["Netopýr"] },
      { name: "Pták", items: ["Holub"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Pes domácí", "Kočka domácí"] },
      { name: "Pták", items: ["Slepice domácí"] },
      { name: "Ryba", items: ["Zlatá rybka"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Kůň domácí"] },
      { name: "Pták", items: ["Andulka vlnkovaná"] },
      { name: "Plaz", items: ["Želva suchozemská", "Leguán zelený"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    explanation: "Manta i mořský koník jsou ryby — mají žábry a jsou studenokrevní. Orka a mořský lev jsou savci.",
    categories: [
      { name: "Ryba", items: ["Manta velká", "Mořský koník"] },
      { name: "Savec", items: ["Orka", "Mořský lev"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Bobr evropský"] },
      { name: "Pták", items: ["Volavka purpurová"] },
      { name: "Obojživelník", items: ["Čolek horský"] },
      { name: "Ryba", items: ["Piskor pruhovaný"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Vlk šedý"] },
      { name: "Pták", items: ["Holub skalní"] },
      { name: "Plaz", items: ["Slepýš"] },
      { name: "Ryba", items: ["Mník jednovousý"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Ryba", items: ["Losos obecný"] },
      { name: "Savec", items: ["Vydra mořská"] },
      { name: "Pták", items: ["Alka velká (vyhynulá)"] },
      { name: "Plaz", items: ["Iguana mořská"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Antilopa skákavá", "Gepard štíhlý"] },
      { name: "Pták", items: ["Marabu africký"] },
      { name: "Plaz", items: ["Kobra indická"] },
    ],
  },
  {
    question: "Zařaď každého živočicha do správné skupiny obratlovců.",
    correctAnswer: "categorize",
    categories: [
      { name: "Savec", items: ["Ježek západní"] },
      { name: "Obojživelník", items: ["Ropucha obecná"] },
      { name: "Pták", items: ["Strnad obecný"] },
      { name: "Ryba", items: ["Plotice obecná"] },
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
    inputType: "categorize",
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
