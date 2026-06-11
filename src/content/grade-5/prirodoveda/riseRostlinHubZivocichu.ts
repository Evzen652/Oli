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
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Hlíva ústřičná", "Hřib smrkový"] },
      { name: "Rostlina", items: ["Dub letní"] },
      { name: "Živočich", items: ["Vlk obecný"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Rostlina", items: ["Pampeliška", "Borovice lesní"] },
      { name: "Houba", items: ["Muchomůrka červená"] },
      { name: "Živočich", items: ["Kapr obecný"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Lišák obecný"] },
      { name: "Rostlina", items: ["Kopretina bílá", "Smrk ztepilý"] },
      { name: "Živočich", items: ["Netopýr velký"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Živočich", items: ["Žížala obecná", "Motýl babočka"] },
      { name: "Houba", items: ["Lišák obecný"] },
      { name: "Rostlina", items: ["Jetel luční"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Křemenáč osikový", "Plíseň chlebová"] },
      { name: "Rostlina", items: ["Tráva psárka"] },
      { name: "Živočich", items: ["Ještěrka obecná"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Ryzec pravý"] },
      { name: "Rostlina", items: ["Kopřiva dvoudomá"] },
      { name: "Živočich", items: ["Sýkorka koňadra", "Liška obecná"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Pečárka polní"] },
      { name: "Rostlina", items: ["Akát bílý"] },
      { name: "Živočich", items: ["Žába rosnička", "Holub skalní"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    explanation: "Kvasinka je houba — nefotosyntetizuje a rozkládá organické látky.",
    categories: [
      { name: "Houba", items: ["Lanýž černý", "Kvasinka"] },
      { name: "Rostlina", items: ["Kukuřice setá"] },
      { name: "Živočich", items: ["Medvěd hnědý"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Sněhová plíseň", "Smrž jedlý"] },
      { name: "Rostlina", items: ["Jabloň domácí"] },
      { name: "Živočich", items: ["Vydra říční"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Muchomůrka zelená"] },
      { name: "Rostlina", items: ["Jedle bělokorá", "Modřín opadavý"] },
      { name: "Živočich", items: ["Srnec obecný"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Živočich", items: ["Lišaj pásovaný", "Rak říční"] },
      { name: "Houba", items: ["Bedla vysoká"] },
      { name: "Rostlina", items: ["Šeřík obecný"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Hlíva ústřičná"] },
      { name: "Rostlina", items: ["Ostružiník maliník", "Jasan ztepilý"] },
      { name: "Živočich", items: ["Ropucha obecná"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Čirůvka fialová"] },
      { name: "Rostlina", items: ["Lípa srdčitá"] },
      { name: "Živočich", items: ["Bobr evropský", "Holub"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Chorošek"] },
      { name: "Rostlina", items: ["Bříza bradavičnatá", "Třešeň ptačí"] },
      { name: "Živočich", items: ["Veverka obecná"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    explanation: "Penicilin (Penicillium) je houba — plíseň produkující antibiotikum. Řasa i mech jsou rostliny.",
    categories: [
      { name: "Houba", items: ["Penicilin (Penicillium)"] },
      { name: "Rostlina", items: ["Řasa zelená", "Mech lesní"] },
      { name: "Živočich", items: ["Hvězdice mořská"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Klouzek obecný"] },
      { name: "Rostlina", items: ["Konvalinka vonná", "Jinan dvoulaločný"] },
      { name: "Živočich", items: ["Plch velký"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Troudnatec kopytovitý"] },
      { name: "Rostlina", items: ["Jmelí bílé", "Olše lepkavá"] },
      { name: "Živočich", items: ["Krtek obecný"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Hřib satan"] },
      { name: "Rostlina", items: ["Šípkový keř", "Topol osika"] },
      { name: "Živočich", items: ["Liška obecná"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Kozák březový"] },
      { name: "Rostlina", items: ["Ostřice trsnatá", "Vrba bílá"] },
      { name: "Živočich", items: ["Čáp bílý"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Václavka obecná"] },
      { name: "Rostlina", items: ["Zvonečník klasnatý", "Habr obecný"] },
      { name: "Živočich", items: ["Ježek západní"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Rostlina", items: ["Šafránek jarní", "Dřín obecný"] },
      { name: "Houba", items: ["Ryzec kravský"] },
      { name: "Živočich", items: ["Tchoř lesní"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Rudoušek"] },
      { name: "Rostlina", items: ["Prvosenka jarní", "Bez černý"] },
      { name: "Živočich", items: ["Zajíc polní"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Pýchavka obrovská"] },
      { name: "Rostlina", items: ["Leknín bílý", "Orobinec úzkolistý"] },
      { name: "Živočich", items: ["Potápka chocholatá"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Chorošovec (Trametes)"] },
      { name: "Rostlina", items: ["Papratka samičí", "Kapradí orlí"] },
      { name: "Živočich", items: ["Mlok skvrnatý"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Hřib kovář"] },
      { name: "Rostlina", items: ["Rákos obecný", "Kosatec žlutý"] },
      { name: "Živočich", items: ["Čolek obecný"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Lišák obecný"] },
      { name: "Rostlina", items: ["Vrbovka úzkolistá", "Starček obecný"] },
      { name: "Živočich", items: ["Užovka obojková"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Hřib hnědý"] },
      { name: "Rostlina", items: ["Pomněnka lesní", "Hloh obecný"] },
      { name: "Živočich", items: ["Holub hřivnáč"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Korálovec"] },
      { name: "Rostlina", items: ["Šťavel kyselý", "Líska obecná"] },
      { name: "Živočich", items: ["Bažant obecný"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Muchovník (Amanita)"] },
      { name: "Rostlina", items: ["Jahodník obecný", "Malina obecná"] },
      { name: "Živočich", items: ["Labuť velká"] },
    ],
  },
  {
    question: "Zařaď každý organismus do správné říše.",
    correctAnswer: "categorize",
    categories: [
      { name: "Houba", items: ["Hřib bronzový"] },
      { name: "Rostlina", items: ["Vlaštovičník větší", "Ptačí zob obecný"] },
      { name: "Živočich", items: ["Strnad obecný"] },
    ],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 30);
}

export const RISEROSTLINHUBZIVOCICHU: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu",
    title: "Říše rostlin, hub, živočichů",
    studentTitle: "Živý svět",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Třídění organismů",
    briefDescription: "Poznáš rozdíly mezi říšemi rostlin, hub a živočichů.",
    keywords: ["říše", "rostliny", "houby", "živočichové", "třídění", "organismy", "fotosyntéza"],
    goals: ["Rozlišit základní říše živých organismů", "Popsat způsob výživy rostlin, hub a živočichů", "Zařadit konkrétní organismy do správné říše"],
    boundaries: ["Neprobírá buněčnou biologii do hloubky", "Neprobírá evoluci"],
    gradeRange: [5, 5],
    inputType: "categorize",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vzpomeň si: rostliny fotosyntézují, houby rozkládají, živočichové konzumují jiné organismy.",
      steps: ["1. Zjisti, jak se organismus živí.", "2. Má chlorofyl? → rostlina", "3. Rozkládá mrtvé věci? → houba", "4. Loví nebo spásá jiné organismy? → živočich"],
      commonMistake: "Houby nejsou rostliny – nemají chlorofyl a nefotosyntetizují.",
      example: "Hřib → houba (rozkladač). Dub → rostlina (producent). Zajíc → živočich (konzument).",
    },
  },
];
