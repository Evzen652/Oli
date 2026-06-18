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

// L1: Co je slabika + počítání slabik v jednoduchých 1–2slabičných slovech
const POOL_L1: PoolItem[] = [
  { question: "Co je slabika?", correct: "Část slova s jednou samohláskou", distractors: ["Celé slovo", "Skupina souhlásek"], emoji: "📖", hint: "Slabiku poznáš tak, že při říkání slova jednou 'otevřeš' ústa — kolik samohlásek, tolik slabik.", solution: "Slabika je část slova s jednou samohláskou — kolik samohlásek slovo má, tolik slabik." },
  { question: "Kolik slabik má slovo 'pes'?", correct: "1", distractors: ["2", "3"], emoji: "🐕", hint: "Řekni 'pes' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'pes' má 1 slabiku — je tam jedna samohláska E, proto jen 1 slabika." },
  { question: "Kolik slabik má slovo 'les'?", correct: "1", distractors: ["2", "3"], emoji: "🌲", hint: "Řekni 'les' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'les' má 1 slabiku — je tam jen jedna samohláska E, proto 1 slabika." },
  { question: "Kolik slabik má slovo 'klíč'?", correct: "1", distractors: ["2", "3"], emoji: "🔑", hint: "Řekni 'klíč' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'klíč' má 1 slabiku — je tam jen jedna samohláska Í, proto 1 slabika." },
  { question: "Kolik slabik má slovo 'máma'?", correct: "2", distractors: ["1", "3"], emoji: "👩", hint: "Řekni 'máma' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'má-ma' má 2 slabiky — jsou tam dvě samohlásky Á a A, proto 2 slabiky." },
  { question: "Kolik slabik má slovo 'škola'?", correct: "2", distractors: ["1", "3"], emoji: "🏫", hint: "Řekni 'škola' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'ško-la' má 2 slabiky — jsou tam samohlásky O a A, proto 2 slabiky." },
  { question: "Kolik slabik má slovo 'kočka'?", correct: "2", distractors: ["1", "3"], emoji: "🐱", hint: "Řekni 'kočka' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'koč-ka' má 2 slabiky — jsou tam samohlásky O a A, proto 2 slabiky." },
  { question: "Kolik slabik má slovo 'ryba'?", correct: "2", distractors: ["1", "3"], emoji: "🐟", hint: "Řekni 'ryba' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'ry-ba' má 2 slabiky — jsou tam samohlásky Y a A, proto 2 slabiky." },
];

// L2: 3slabičná slova + slova s dvouhláskou au/ou
const POOL_L2: PoolItem[] = [
  { question: "Kolik slabik má slovo 'jahoda'?", correct: "3", distractors: ["2", "4"], emoji: "🍓", hint: "Řekni 'jahoda' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'ja-ho-da' má 3 slabiky — jsou tam samohlásky A, O, A, proto 3 slabiky." },
  { question: "Kolik slabik má slovo 'kamarád'?", correct: "3", distractors: ["2", "4"], emoji: "🤝", hint: "Řekni 'kamarád' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'ka-ma-rád' má 3 slabiky — jsou tam samohlásky A, A, Á, proto 3 slabiky." },
  { question: "Kolik slabik má slovo 'babička'?", correct: "3", distractors: ["2", "4"], emoji: "👵", hint: "Řekni 'babička' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'ba-bič-ka' má 3 slabiky — jsou tam samohlásky A, I, A, proto 3 slabiky." },
  { question: "Kolik slabik má slovo 'auto'?", correct: "2", distractors: ["1", "3"], emoji: "🚗", hint: "Řekni 'auto' pomalu a tleskni u každé části. Pozor — 'au' se vyslovuje dohromady jako jedna část.", solution: "Slovo 'au-to' má 2 slabiky — dvouhláska AU tvoří jednu slabiku, druhá slabika je TO." },
  { question: "Kolik slabik má slovo 'kniha'?", correct: "2", distractors: ["1", "3"], emoji: "📚", hint: "Řekni 'kniha' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'kni-ha' má 2 slabiky — jsou tam samohlásky I a A, proto 2 slabiky." },
  { question: "Kolik slabik má slovo 'louže'?", correct: "2", distractors: ["1", "3"], emoji: "💧", hint: "Řekni 'louže' pomalu. Pozor — 'ou' je dvouhláska, tvoří jednu slabiku.", solution: "Slovo 'lou-že' má 2 slabiky — dvouhláska OU tvoří jednu slabiku, druhá slabika je ŽE." },
  { question: "Kolik slabik má slovo 'housenka'?", correct: "3", distractors: ["2", "4"], emoji: "🐛", hint: "Řekni 'housenka' pomalu a tleskni u každé části. Pozor na dvouhlásku OU.", solution: "Slovo 'hou-sen-ka' má 3 slabiky — dvouhláska OU + E + A, proto 3 slabiky." },
  { question: "Kolik slabik má slovo 'počítač'?", correct: "3", distractors: ["2", "4"], emoji: "💻", hint: "Řekni 'počítač' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'po-čí-tač' má 3 slabiky — jsou tam samohlásky O, Í, A, proto 3 slabiky." },
];

// L3: 3–4slabičná slova + určení místa dělení (náročnější)
const POOL_L3: PoolItem[] = [
  { question: "Kolik slabik má slovo 'čokoláda'?", correct: "4", distractors: ["3", "5"], emoji: "🍫", hint: "Řekni 'čokoláda' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'čo-ko-lá-da' má 4 slabiky — jsou tam samohlásky O, O, Á, A, proto 4 slabiky." },
  { question: "Kolik slabik má slovo 'maminka'?", correct: "3", distractors: ["2", "4"], emoji: "👩‍👧", hint: "Řekni 'maminka' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'ma-min-ka' má 3 slabiky — jsou tam samohlásky A, I, A, proto 3 slabiky." },
  { question: "Kolik slabik má slovo 'tabulka'?", correct: "3", distractors: ["2", "4"], emoji: "📐", hint: "Řekni 'tabulka' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'ta-bul-ka' má 3 slabiky — jsou tam samohlásky A, U, A, proto 3 slabiky." },
  { question: "Kolik slabik má slovo 'číslo'?", correct: "2", distractors: ["1", "3"], emoji: "🔢", hint: "Řekni 'číslo' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik.", solution: "Slovo 'čís-lo' má 2 slabiky — jsou tam samohlásky Í a O, proto 2 slabiky." },
  { question: "Kde slovo 'okno' rozdělíme na slabiky?", correct: "ok-no", distractors: ["o-kno", "okn-o"], emoji: "🪟", hint: "Každá slabika musí mít samohlásku — O a O. Jak je rovnoměrně rozdělit?", solution: "Slovo 'okno' se dělí na 'ok-no' — každá část má jednu samohlásku: O a O." },
  { question: "Kde slovo 'máma' rozdělíme na slabiky?", correct: "má-ma", distractors: ["m-áma", "mám-a"], emoji: "👩", hint: "Samohlásky jsou Á a A — jak je rovnoměrně rozdělit?", solution: "Slovo 'máma' se dělí na 'má-ma' — každá část má jednu samohlásku: Á a A." },
  { question: "Kde slovo 'sluníčko' rozdělíme na slabiky?", correct: "slun-íč-ko", distractors: ["s-lu-níčko", "slu-níč-ko"], emoji: "☀️", hint: "Hledej samohlásky U, Í, O — kde udělat předěly?", solution: "Slovo 'sluníčko' se dělí na 'slun-íč-ko' — samohlásky U, Í, O tvoří tři slabiky." },
  { question: "Kolik slabik má slovo 'encyklopedie'?", correct: "6", distractors: ["4", "5"], emoji: "📕", hint: "Řekni 'encyklopedie' pomalu a spočítej samohlásky: e-y-o-e-i-e.", solution: "Slovo 'en-cyk-lo-pe-di-e' má 6 slabik — jsou tam samohlásky E, Y, O, E, I, E, proto 6 slabik." },
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

export const SLABIKY: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-slabika-rozdeleni-na-slabiky",
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-slabika-rozdeleni-na-slabiky",
    title: "Slabika, rozdělení na slabiky",
    studentTitle: "Slabiky",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Naučíš se, co je slabika a jak slova dělit.",
    keywords: ["slabika", "rozdělení", "samohláska", "máma", "škola", "slabikování"],
    goals: [
      "Vědět, že slabika je část slova s jednou samohláskou.",
      "Spočítat slabiky ve slově.",
      "Umět slovo správně rozdělit na slabiky.",
    ],
    boundaries: ["Běžná slova 2. třídy.", "Bez složitých souhláskových shluků."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Kolik samohlásek (a, e, i, o, u, á, é, í, ó, ú, ů, ý), tolik slabik.",
      steps: ["Přečti slovo.", "Podtrhni samohlásky.", "Kolik samohlásek = kolik slabik."],
      commonMistake: "Počítat slabiky podle délky slova místo počtu samohlásek.",
      example: "Máma: Á+A = 2 samohlásky = 2 slabiky. Pes: E = 1 samohláska = 1 slabika.",
    },
  },
];
