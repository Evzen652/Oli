import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PoolItem {
  question: string;
  correct: string;
  distractors: string[];
  emoji: string;
  hint: string;
  solution: string;
}

const POOL: PoolItem[] = [
  { question: "Kdo hasí oheň?", correct: "Hasič", distractors: ["Pekař", "Učitel"], emoji: "👨‍🚒", hint: "Hašení ohně je nebezpečná práce — speciálně trénovaní lidé na ni mají vybavení.", solution: "Oheň hasí hasič — má speciální oblek, helmu a hadice." },
  { question: "Kdo léčí lidi?", correct: "Lékař", distractors: ["Řidič", "Kuchař"], emoji: "👩‍⚕️", hint: "Když jsme nemocní, jdeme se nechat vyšetřit — ke komu?", solution: "Lidi léčí lékař — vyšetřuje pacienty a předepisuje léky." },
  { question: "Kdo učí děti?", correct: "Učitel", distractors: ["Hasič", "Pekař"], emoji: "👨‍🏫", hint: "Ve škole nás někdo učí číst, psát a počítat — kdo to je?", solution: "Děti učí učitel — ve škole nás naučí číst, psát, počítat a spoustu dalšího." },
  { question: "Kdo peče chleba?", correct: "Pekař", distractors: ["Lékař", "Policista"], emoji: "🍞", hint: "Chléb se peče v peci — kdo s tím pracuje?", solution: "Chléb peče pekař — vstává velmi brzy ráno, aby byl chléb čerstvý." },
  { question: "Kdo vaří jídlo?", correct: "Kuchař", distractors: ["Učitel", "Hasič"], emoji: "👨‍🍳", hint: "V jídelně nebo restauraci někdo připravuje jídlo — kdo to je?", solution: "Jídlo vaří kuchař — v restauraci nebo jídelně připravuje pokrmy." },
  { question: "Kdo řídí autobus?", correct: "Řidič", distractors: ["Pekař", "Lékař"], emoji: "🚌", hint: "Autobus potřebuje někoho za volantem — kdo ho řídí?", solution: "Autobus řídí řidič — stará se o bezpečnou přepravu cestujících." },
  { question: "Kdo chrání lidi a udržuje pořádek?", correct: "Policista", distractors: ["Kuchař", "Pekař"], emoji: "👮", hint: "Bezpečnost lidí a dodržování zákonů zajišťuje...", solution: "Lidi chrání policista — hlídá pořádek a bezpečnost." },
  { question: "Kdo roznáší dopisy?", correct: "Pošťák", distractors: ["Hasič", "Lékař"], emoji: "📬", hint: "Dopisy a balíky přicházejí do naší schránky — kdo je přinese?", solution: "Dopisy roznáší pošťák — chodí dům od domu a doručuje zásilky." },
  { question: "Kdo léčí zvířata?", correct: "Veterinář", distractors: ["Pekař", "Řidič"], emoji: "🐕", hint: "Zvířata nejdou k lékaři — kdo se o nemocná zvířata stará?", solution: "Zvířata léčí veterinář — je to „lékař pro zvířata"." },
  { question: "Kdo stříhá vlasy?", correct: "Kadeřník", distractors: ["Kuchař", "Učitel"], emoji: "💇", hint: "Vlasy nám rostou a potřebujeme je stříhat — kdo to dělá?", solution: "Vlasy stříhá kadeřník — v kadeřnictví nám ostříhá nebo upraví účes." },
  { question: "Kdo staví domy?", correct: "Zedník", distractors: ["Pekař", "Pošťák"], emoji: "🧱", hint: "Domy jsou postavené z cihel a betonu — kdo je staví?", solution: "Domy staví zedník — skládá cihly a lije beton." },
  { question: "Kdo opravuje auta?", correct: "Mechanik", distractors: ["Lékař", "Učitel"], emoji: "🔧", hint: "Když auto poruší a nejede, je potřeba ho opravit — kdo to umí?", solution: "Auta opravuje mechanik — v autoservisu zjistí závadu a opraví ji." },
  { question: "Kdo pěstuje obilí?", correct: "Zemědělec", distractors: ["Hasič", "Pekař"], emoji: "🚜", hint: "Pšenice a ječmen rostou na polích — kdo se o ně stará?", solution: "Obilí pěstuje zemědělec — obdělává pole a sklízí úrodu." },
  { question: "Kdo prodává v obchodě?", correct: "Prodavač", distractors: ["Hasič", "Lékař"], emoji: "🏪", hint: "V obchodě nám někdo pomáhá vybrat a zaplatit — kdo to je?", solution: "V obchodě prodává prodavač — pomáhá zákazníkům a inkasuje platby." },
  { question: "Kdo hraje v divadle?", correct: "Herec", distractors: ["Pekař", "Řidič"], emoji: "🎭", hint: "V divadle lidé hrají různé role v příbězích — jak se jim říká?", solution: "V divadle hraje herec — učí se role a vystupuje před publikem." },
  { question: "Kdo maluje obrazy?", correct: "Malíř", distractors: ["Kuchař", "Pošťák"], emoji: "🎨", hint: "Obrazy v galeriích někdo namaloval — jakým nástrojem a kdo?", solution: "Obrazy maluje malíř (výtvarník) — tvoří umělecká díla štětcem a barvami." },
  { question: "Kdo opravuje zuby?", correct: "Zubař", distractors: ["Pekař", "Řidič"], emoji: "🦷", hint: "Kazy v zubech potřebují ošetření — ke komu jdeme?", solution: "Zuby opravuje zubař — ošetřuje kazy a stará se o zdraví zubů." },
  { question: "Kdo pomáhá lidem při požáru a nehodách?", correct: "Hasič", distractors: ["Učitel", "Kuchař"], emoji: "🚒", hint: "Velký oheň, který se nekontrolovaně šíří, se nazývá požár — kdo ho hasí?", solution: "Při požárech a nehodách pomáhá hasič — přijíždí s hasičským autem a hadicemi." },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: [item.hint],
      solutionSteps: [item.solution],
    };
  });
}

export const POVOLANIPRACEDOSPELYCH: TopicMetadata[] = [
  {
    id: "g2-prv-povolani",
    rvpNodeId: "g2-prvouka-lide-kolem-nas-souziti-lidi-povolani-prace-dospelych",
    title: "Povolání a práce dospělých",
    studentTitle: "Povolání",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití lidí",
    briefDescription: "Poznáš různá povolání dospělých.",
    keywords: ["povolání", "práce", "hasič", "lékař", "učitel", "pekař"],
    goals: [
      "Poznat běžná povolání.",
      "Vědět, co kdo dělá.",
      "Vážit si práce dospělých.",
    ],
    boundaries: ["Pouze známá povolání.", "Bez detailů o práci."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Mysli na to, co ten člověk v práci dělá.",
      steps: ["Přečti otázku.", "Kdo tuhle práci dělá?"],
      commonMistake: "Záměna podobných povolání.",
      example: "Hasič hasí oheň, lékař léčí lidi.",
    },
  },
];
