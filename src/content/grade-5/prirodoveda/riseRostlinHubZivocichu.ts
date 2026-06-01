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
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Hlíva ústřičná", right: "Houba" },
      { left: "Dub letní", right: "Rostlina" },
      { left: "Vlk obecný", right: "Živočich" },
      { left: "Hřib smrkový", right: "Houba" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Pampeliška", right: "Rostlina" },
      { left: "Muchomůrka červená", right: "Houba" },
      { left: "Kapr obecný", right: "Živočich" },
      { left: "Borovice lesní", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Lišák obecný", right: "Houba" },
      { left: "Kopretina bílá", right: "Rostlina" },
      { left: "Netopýr velký", right: "Živočich" },
      { left: "Smrk ztepilý", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Žížala obecná", right: "Živočich" },
      { left: "Lišák obecný", right: "Houba" },
      { left: "Jetel luční", right: "Rostlina" },
      { left: "Motýl babočka", right: "Živočich" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Křemenáč osikový", right: "Houba" },
      { left: "Tráva psárka", right: "Rostlina" },
      { left: "Ještěrka obecná", right: "Živočich" },
      { left: "Plíseň chlebová", right: "Houba" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Ryzec pravý", right: "Houba" },
      { left: "Kopřiva dvoudomá", right: "Rostlina" },
      { left: "Sýkorka koňadra", right: "Živočich" },
      { left: "Liška obecná", right: "Živočich" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Pečárka polní", right: "Houba" },
      { left: "Akát bílý", right: "Rostlina" },
      { left: "Žába rosnička", right: "Živočich" },
      { left: "Holub skalní", right: "Živočich" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Lanýž černý", right: "Houba" },
      { left: "Kukuřice setá", right: "Rostlina" },
      { left: "Medvěd hnědý", right: "Živočich" },
      { left: "Kvasinka", right: "Houba" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Sněhová plíseň", right: "Houba" },
      { left: "Jabloň domácí", right: "Rostlina" },
      { left: "Vydra říční", right: "Živočich" },
      { left: "Smrž jedlý", right: "Houba" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Muchomůrka zelená", right: "Houba" },
      { left: "Jedle bělokorá", right: "Rostlina" },
      { left: "Srnec obecný", right: "Živočich" },
      { left: "Modřín opadavý", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Lišaj pásovaný", right: "Živočich" },
      { left: "Bedla vysoká", right: "Houba" },
      { left: "Šeřík obecný", right: "Rostlina" },
      { left: "Rak říční", right: "Živočich" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Hlíva ústřičná", right: "Houba" },
      { left: "Ostružiník maliník", right: "Rostlina" },
      { left: "Ropucha obecná", right: "Živočich" },
      { left: "Jasan ztepilý", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Čirůvka fialová", right: "Houba" },
      { left: "Lípa srdčitá", right: "Rostlina" },
      { left: "Bobr evropský", right: "Živočich" },
      { left: "Holub", right: "Živočich" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Chorošek", right: "Houba" },
      { left: "Bříza bradavičnatá", right: "Rostlina" },
      { left: "Veverka obecná", right: "Živočich" },
      { left: "Třešeň ptačí", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Penicilin (Penicillium)", right: "Houba" },
      { left: "Řasa zelená", right: "Rostlina" },
      { left: "Hvězdice mořská", right: "Živočich" },
      { left: "Mech lesní", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Klouzek obecný", right: "Houba" },
      { left: "Konvalinka vonná", right: "Rostlina" },
      { left: "Plch velký", right: "Živočich" },
      { left: "Jinan dvoulaločný", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Troudnatec kopytovitý", right: "Houba" },
      { left: "Jmelí bílé", right: "Rostlina" },
      { left: "Krtek obecný", right: "Živočich" },
      { left: "Jezerní rybník", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Hřib satan", right: "Houba" },
      { left: "Šípkový keř", right: "Rostlina" },
      { left: "Liška obecná", right: "Živočich" },
      { left: "Topol osika", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Kozák březový", right: "Houba" },
      { left: "Ostřice trsnatá", right: "Rostlina" },
      { left: "Čáp bílý", right: "Živočich" },
      { left: "Vrba bílá", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Václavka obecná", right: "Houba" },
      { left: "Zvonečník klasnatý", right: "Rostlina" },
      { left: "Ježek západní", right: "Živočich" },
      { left: "Habr obecný", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Šafránek jarní", right: "Rostlina" },
      { left: "Ryzec kravský", right: "Houba" },
      { left: "Tchoř lesní", right: "Živočich" },
      { left: "Dřín obecný", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Rudoušek (houba)", right: "Houba" },
      { left: "Prvosenka jarní", right: "Rostlina" },
      { left: "Zajíc polní", right: "Živočich" },
      { left: "Bez černý", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Pýchavka obrovská", right: "Houba" },
      { left: "Leknín bílý", right: "Rostlina" },
      { left: "Potápka chocholatá", right: "Živočich" },
      { left: "Orobinec úzkolistý", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Chorošovec (Trametes)", right: "Houba" },
      { left: "Papratka samičí", right: "Rostlina" },
      { left: "Mlok skvrnatý", right: "Živočich" },
      { left: "Kapradí orlí", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Hřib kovář", right: "Houba" },
      { left: "Rákos obecný", right: "Rostlina" },
      { left: "Čolník obecný", right: "Živočich" },
      { left: "Kosatec žlutý", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Liška obecná (houba lišák)", right: "Houba" },
      { left: "Vrbovka úzkolistá", right: "Rostlina" },
      { left: "Užovka obojková", right: "Živočich" },
      { left: "Starček obecný", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Hřib hnědý", right: "Houba" },
      { left: "Pomněnka lesní", right: "Rostlina" },
      { left: "Holub hřivnáč", right: "Živočich" },
      { left: "Hloh obecný", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Houba korálovec", right: "Houba" },
      { left: "Šťavel kyselý", right: "Rostlina" },
      { left: "Bažant obecný", right: "Živočich" },
      { left: "Líska obecná", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Muchovník (Amanita)", right: "Houba" },
      { left: "Jahodník obecný", right: "Rostlina" },
      { left: "Labuť velká", right: "Živočich" },
      { left: "Malina obecná", right: "Rostlina" },
    ],
  },
  {
    question: "Spoj organismus s říší, do které patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Hřib bronzový", right: "Houba" },
      { left: "Vlaštovičník větší", right: "Rostlina" },
      { left: "Strnad obecný", right: "Živočich" },
      { left: "Ptačí zob obecný", right: "Rostlina" },
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
    inputType: "match_pairs",
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
