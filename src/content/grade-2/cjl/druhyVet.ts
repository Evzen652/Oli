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

// L1: Rozpoznání druhu věty z věty samotné
const POOL_L1: PoolItem[] = [
  { question: "Jaký druh věty je 'Pes štěká.'?", correct: "Oznamovací", distractors: ["Tázací", "Rozkazovací"], emoji: "🐕", hint: "Věta sděluje informaci. Sdělování faktů = který druh?", solution: "'Pes štěká.' je oznamovací věta — říká, co pes dělá, a neklade otázku ani nevydává rozkaz. Končí tečkou." },
  { question: "Jaký druh věty je 'Sněží.'?", correct: "Oznamovací", distractors: ["Tázací", "Rozkazovací"], emoji: "❄️", hint: "Věta říká, jaké je počasí. Sdělení faktů = který druh?", solution: "'Sněží.' je oznamovací věta — sděluje, jaké je počasí, a končí tečkou." },
  { question: "Jaký druh věty je 'Ptáci letí na jih.'?", correct: "Oznamovací", distractors: ["Tázací", "Rozkazovací"], emoji: "🐦", hint: "Věta říká, kam ptáci letí. Sdělení informace = který druh?", solution: "'Ptáci letí na jih.' je oznamovací věta — sděluje informaci o ptácích a končí tečkou." },
  { question: "Jaký druh věty je 'Jak se jmenuješ?'?", correct: "Tázací", distractors: ["Oznamovací", "Rozkazovací"], emoji: "❓", hint: "Věta klade otázku a čeká na odpověď. Ptaní se = který druh?", solution: "'Jak se jmenuješ?' je tázací věta — ptáme se na jméno a čekáme na odpověď. Končí otazníkem." },
  { question: "Jaký druh věty je 'Půjdeš ven?'?", correct: "Tázací", distractors: ["Oznamovací", "Rozkazovací"], emoji: "🌳", hint: "Věta se ptá, zda někdo půjde ven. Ptaní se = který druh?", solution: "'Půjdeš ven?' je tázací věta — ptáme se a čekáme na odpověď. Končí otazníkem." },
  { question: "Jaký druh věty je 'Pojď hrát!'?", correct: "Rozkazovací", distractors: ["Oznamovací", "Tázací"], emoji: "❗", hint: "Věta vyzývá k akci. Výzva nebo rozkaz = který druh?", solution: "'Pojď hrát!' je rozkazovací věta — vyzývá k akci a končí vykřičníkem." },
  { question: "Jaký druh věty je 'Dej mi to!'?", correct: "Rozkazovací", distractors: ["Oznamovací", "Tázací"], emoji: "🤲", hint: "Věta přikazuje, co udělat. Rozkaz = který druh?", solution: "'Dej mi to!' je rozkazovací věta — vydává rozkaz a končí vykřičníkem." },
  { question: "Jaký druh věty je 'Sedni si!'?", correct: "Rozkazovací", distractors: ["Oznamovací", "Tázací"], emoji: "🪑", hint: "Věta přikazuje, co udělat. Rozkaz nebo výzva = který druh?", solution: "'Sedni si!' je rozkazovací věta — vydává rozkaz a končí vykřičníkem." },
];

// L2: Přiřazení druhu k popisu / práce se znaménkem + výběr z výčtu vět
const POOL_L2: PoolItem[] = [
  { question: "Čím končí oznamovací věta?", correct: "Tečkou (.)", distractors: ["Otazníkem (?)", "Vykřičníkem (!)"], emoji: "📝", hint: "Oznamovací věta něco sděluje a klidně se uzavírá — jakou značku má?", solution: "Oznamovací věta končí tečkou (.) — sděluje fakta a neklade otázky ani rozkazy." },
  { question: "Čím končí tázací věta?", correct: "Otazníkem (?)", distractors: ["Tečkou (.)", "Vykřičníkem (!)"], emoji: "❓", hint: "Tázací věta klade otázku — jakou značku má?", solution: "Tázací věta končí otazníkem (?) — ptáme se a očekáváme odpověď." },
  { question: "Čím končí rozkazovací věta?", correct: "Vykřičníkem (!)", distractors: ["Tečkou (.)", "Otazníkem (?)"], emoji: "❗", hint: "Rozkazovací věta dává příkaz nebo prosbu — jakou značku má?", solution: "Rozkazovací věta končí vykřičníkem (!) — vyjadřuje rozkaz nebo výzvu." },
  { question: "Která z vět je tázací: 'Máš hlad?' / 'Pojď sem!' / 'Sněží.'?", correct: "Máš hlad?", distractors: ["Pojď sem!", "Sněží."], emoji: "🍽️", hint: "Tázací věta se ptá a čeká na odpověď — která z nich to je?", solution: "'Máš hlad?' je tázací věta — ptáme se na pocit a čekáme na odpověď. Ostatní jsou rozkazovací a oznamovací." },
  { question: "Která z vět je rozkazovací: 'Vrať mi knihu!' / 'Kdy začíná škola?' / 'Zítra je pátek.'?", correct: "Vrať mi knihu!", distractors: ["Kdy začíná škola?", "Zítra je pátek."], emoji: "📚", hint: "Rozkazovací věta vydává rozkaz nebo výzvu — která z nich to je?", solution: "'Vrať mi knihu!' je rozkazovací věta — vydává rozkaz a končí vykřičníkem. Ostatní jsou tázací a oznamovací." },
  { question: "Která z vět je oznamovací: 'Mám ráda čokoládu.' / 'Dej mi ji!' / 'Máš ji?'?", correct: "Mám ráda čokoládu.", distractors: ["Dej mi ji!", "Máš ji?"], emoji: "🍫", hint: "Oznamovací věta sděluje informaci — která z nich to je?", solution: "'Mám ráda čokoládu.' je oznamovací věta — sděluje, co mám ráda, a končí tečkou. Ostatní jsou rozkazovací a tázací." },
  { question: "Která z vět je tázací: 'Otevři okno!' / 'Kdy přijdeš?' / 'Uklízím pokoj.'?", correct: "Kdy přijdeš?", distractors: ["Otevři okno!", "Uklízím pokoj."], emoji: "🏠", hint: "Tázací věta se ptá — která z nich to je?", solution: "'Kdy přijdeš?' je tázací věta — ptáme se na čas příchodu a čekáme na odpověď. Ostatní jsou rozkazovací a oznamovací." },
  { question: "Která z vět je rozkazovací: 'Venku prší.' / 'Prší dnes?' / 'Vezmi si deštník!'?", correct: "Vezmi si deštník!", distractors: ["Venku prší.", "Prší dnes?"], emoji: "☂️", hint: "Rozkazovací věta dává pokyn nebo výzvu — která z nich to je?", solution: "'Vezmi si deštník!' je rozkazovací věta — dává pokyn a končí vykřičníkem. Ostatní jsou oznamovací a tázací." },
];

// L3: Určení podle interpunkce/kontextu + doplnění správného znaménka
const POOL_L3: PoolItem[] = [
  { question: "Věta končí otazníkem. Jaký je to druh věty?", correct: "Tázací", distractors: ["Oznamovací", "Rozkazovací"], emoji: "❓", hint: "Podle znaménka na konci věty poznáš druh — otazník patří ke kterému druhu?", solution: "Věta končící otazníkem (?) je tázací — ptáme se a čekáme na odpověď." },
  { question: "Věta končí vykřičníkem. Jaký je to druh věty?", correct: "Rozkazovací", distractors: ["Oznamovací", "Tázací"], emoji: "❗", hint: "Vykřičník patří ke které větě — té, co přikazuje, nebo té, co sděluje?", solution: "Věta končící vykřičníkem (!) je rozkazovací — vyjadřuje rozkaz nebo výzvu." },
  { question: "Věta končí tečkou. Jaký je to druh věty?", correct: "Oznamovací", distractors: ["Tázací", "Rozkazovací"], emoji: "📝", hint: "Tečka patří ke které větě — té, co sděluje, nebo té, co se ptá?", solution: "Věta končící tečkou (.) je oznamovací — sděluje fakta a neklade otázky ani rozkazy." },
  { question: "Doplň správné znaménko na konec věty: 'Kolik je hodin___'", correct: "?", distractors: [".", "!"], emoji: "🕐", hint: "Věta se ptá na čas — jaké znaménko patří k otázkám?", solution: "'Kolik je hodin?' je tázací věta — ptáme se na čas, proto končí otazníkem (?)." },
  { question: "Doplň správné znaménko na konec věty: 'Sbal si aktovku___'", correct: "!", distractors: [".", "?"], emoji: "🎒", hint: "Věta dává pokyn — jaké znaménko patří k rozkazům?", solution: "'Sbal si aktovku!' je rozkazovací věta — dává pokyn, proto končí vykřičníkem (!)." },
  { question: "Doplň správné znaménko na konec věty: 'Venku svítí slunce___'", correct: ".", distractors: ["?", "!"], emoji: "☀️", hint: "Věta říká, jaké je počasí — jaké znaménko patří k oznamování?", solution: "'Venku svítí slunce.' je oznamovací věta — sděluje informaci, proto končí tečkou (.)." },
  { question: "Doplň správné znaménko na konec věty: 'Kde jsi byl celý den___'", correct: "?", distractors: [".", "!"], emoji: "🏡", hint: "Věta zjišťuje, kde někdo byl — jaké znaménko patří k otázkám?", solution: "'Kde jsi byl celý den?' je tázací věta — ptáme se na místo pobytu, proto končí otazníkem (?)." },
  { question: "Doplň správné znaménko na konec věty: 'Tiše čti___'", correct: "!", distractors: [".", "?"], emoji: "📖", hint: "Věta přikazuje, jak číst — jaké znaménko patří k rozkazům?", solution: "'Tiše čti!' je rozkazovací věta — vydává pokyn, proto končí vykřičníkem (!)." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).map(item => {
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
