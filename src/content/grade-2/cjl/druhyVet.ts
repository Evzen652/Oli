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
  // Definice znamének
  { question: "Čím končí oznamovací věta?", correct: "Tečkou (.)", distractors: ["Otazníkem (?)", "Vykřičníkem (!)"], emoji: "📝", hint: "Oznamovací věta něco sděluje a klidně se uzavírá — jakou značku má?", solution: "Oznamovací věta končí tečkou (.) — sděluje fakta a neklade otázky ani rozkazy." },
  { question: "Čím končí tázací věta?", correct: "Otazníkem (?)", distractors: ["Tečkou (.)", "Vykřičníkem (!)"], emoji: "❓", hint: "Tázací věta klade otázku — jakou značku má?", solution: "Tázací věta končí otazníkem (?) — ptáme se a očekáváme odpověď." },
  { question: "Čím končí rozkazovací věta?", correct: "Vykřičníkem (!)", distractors: ["Tečkou (.)", "Otazníkem (?)"], emoji: "❗", hint: "Rozkazovací věta dává příkaz nebo prosbu — jakou značku má?", solution: "Rozkazovací věta končí vykřičníkem (!) — vyjadřuje rozkaz nebo výzvu." },
  // Klasifikace — oznamovací
  { question: "Jaký druh věty je 'Pes štěká.'?", correct: "Oznamovací", distractors: ["Tázací", "Rozkazovací"], emoji: "🐕", hint: "Věta o psovi sděluje informaci. Oznamovací věty sdělují fakta — tázací se ptají, rozkazovací přikazují.", solution: "'Pes štěká.' je oznamovací věta — říká, co pes dělá, a neklade otázku ani nevydává rozkaz. Končí tečkou." },
  { question: "Jaký druh věty je 'Mám ráda čokoládu.'?", correct: "Oznamovací", distractors: ["Tázací", "Rozkazovací"], emoji: "🍫", hint: "Věta sděluje, co někdo rád má. Sdělování faktů = který druh?", solution: "'Mám ráda čokoládu.' je oznamovací věta — říká, co mám ráda, a neklade otázku ani nevydává rozkaz." },
  { question: "Jaký druh věty je 'Zítra je pátek.'?", correct: "Oznamovací", distractors: ["Tázací", "Rozkazovací"], emoji: "📅", hint: "Věta říká, který den bude zítra. Sdělení informace = který druh?", solution: "'Zítra je pátek.' je oznamovací věta — sděluje informaci o dni a končí tečkou." },
  { question: "Jaký druh věty je 'Sněží.'?", correct: "Oznamovací", distractors: ["Tázací", "Rozkazovací"], emoji: "❄️", hint: "Věta říká, jaké je počasí. Sdělení faktů = který druh?", solution: "'Sněží.' je oznamovací věta — sděluje, jaké je počasí, a končí tečkou." },
  { question: "Jaký druh věty je 'Ptáci letí na jih.'?", correct: "Oznamovací", distractors: ["Tázací", "Rozkazovací"], emoji: "🐦", hint: "Věta říká, kam ptáci letí. Sdělení informace = který druh?", solution: "'Ptáci letí na jih.' je oznamovací věta — sděluje informaci o ptácích a končí tečkou." },
  // Klasifikace — tázací
  { question: "Jaký druh věty je 'Jak se jmenuješ?'?", correct: "Tázací", distractors: ["Oznamovací", "Rozkazovací"], emoji: "❓", hint: "Věta klade otázku a čeká na odpověď. Ptaní se = který druh?", solution: "'Jak se jmenuješ?' je tázací věta — ptáme se na jméno a čekáme na odpověď. Končí otazníkem." },
  { question: "Jaký druh věty je 'Máš hlad?'?", correct: "Tázací", distractors: ["Oznamovací", "Rozkazovací"], emoji: "🍽️", hint: "Věta se ptá na pocit. Ptaní se = který druh?", solution: "'Máš hlad?' je tázací věta — ptáme se a čekáme na odpověď. Končí otazníkem." },
  { question: "Jaký druh věty je 'Kdy začíná škola?'?", correct: "Tázací", distractors: ["Oznamovací", "Rozkazovací"], emoji: "🏫", hint: "Věta se ptá, kdy něco začne. Ptaní se = který druh?", solution: "'Kdy začíná škola?' je tázací věta — ptáme se na čas a čekáme na odpověď. Končí otazníkem." },
  { question: "Jaký druh věty je 'Půjdeš ven?'?", correct: "Tázací", distractors: ["Oznamovací", "Rozkazovací"], emoji: "🌳", hint: "Věta se ptá, zda někdo půjde ven. Ptaní se = který druh?", solution: "'Půjdeš ven?' je tázací věta — ptáme se a čekáme na odpověď. Končí otazníkem." },
  // Klasifikace — rozkazovací
  { question: "Jaký druh věty je 'Pojď hrát!'?", correct: "Rozkazovací", distractors: ["Oznamovací", "Tázací"], emoji: "❗", hint: "Věta vyzývá k akci. Výzva nebo rozkaz = který druh?", solution: "'Pojď hrát!' je rozkazovací věta — vyzývá k akci a končí vykřičníkem." },
  { question: "Jaký druh věty je 'Dej mi to!'?", correct: "Rozkazovací", distractors: ["Oznamovací", "Tázací"], emoji: "🤲", hint: "Věta přikazuje, co udělat. Rozkaz = který druh?", solution: "'Dej mi to!' je rozkazovací věta — vydává rozkaz a končí vykřičníkem." },
  { question: "Jaký druh věty je 'Vrať mi knihu!'?", correct: "Rozkazovací", distractors: ["Oznamovací", "Tázací"], emoji: "📚", hint: "Věta přikazuje, co mám vrátit. Rozkaz = který druh?", solution: "'Vrať mi knihu!' je rozkazovací věta — vydává rozkaz a končí vykřičníkem." },
  { question: "Jaký druh věty je 'Uklid si pokoj!'?", correct: "Rozkazovací", distractors: ["Oznamovací", "Tázací"], emoji: "🧹", hint: "Věta přikazuje úklid. Rozkaz = který druh?", solution: "'Uklid si pokoj!' je rozkazovací věta — vydává rozkaz a končí vykřičníkem." },
  { question: "Jaký druh věty je 'Sedni si!'?", correct: "Rozkazovací", distractors: ["Oznamovací", "Tázací"], emoji: "🪑", hint: "Věta přikazuje, co udělat. Rozkaz nebo výzva = který druh?", solution: "'Sedni si!' je rozkazovací věta — vydává rozkaz a končí vykřičníkem." },
  { question: "Jaký druh věty je 'Otevři okno!'?", correct: "Rozkazovací", distractors: ["Oznamovací", "Tázací"], emoji: "🪟", hint: "Věta přikazuje otevřít okno. Rozkaz = který druh?", solution: "'Otevři okno!' je rozkazovací věta — vydává rozkaz a končí vykřičníkem." },
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
      explanation: item.solution,
    };
  });
}

export const DRUHYVET: TopicMetadata[] = [
  {
    id: "g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-druhy-vet-oznamovaci-tazaci-rozkazovaci",
    rvpNodeId: "g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-druhy-vet-oznamovaci-tazaci-rozkazovaci",
    title: "Druhy vět (oznamovací, tázací, rozkazovací)",
    studentTitle: "Druhy vět",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Práce s textem",
    briefDescription: "Rozlišíš oznamovací, tázací a rozkazovací věty.",
    keywords: ["druhy vět", "oznamovací", "tázací", "rozkazovací", "tečka", "otazník", "vykřičník"],
    goals: [
      "Rozlišit oznamovací, tázací a rozkazovací větu.",
      "Vědět, čím každý druh věty končí (. ? !).",
    ],
    boundaries: ["Pouze 3 druhy vět.", "Bez přacích a zvolacích vět."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Oznamovací (.) sděluje, tázací (?) se ptá, rozkazovací (!) přikazuje.",
      steps: ["Přečti větu.", "Sděluje, ptá se nebo přikazuje?", "Sděluje → oznamovací, ptá → tázací, přikazuje → rozkazovací."],
      commonMistake: "Záměna tázací a rozkazovací věty — tázací čeká na odpověď, rozkazovací ne.",
      example: "Pes štěká. → oznamovací. Kde je pes? → tázací. Pojď sem! → rozkazovací.",
    },
  },
];
