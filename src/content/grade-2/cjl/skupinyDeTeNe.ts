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
  { question: "Doplň správně: 'd_ti'", correct: "děti", distractors: ["deti", "diti"], emoji: "👧", hint: "D následované měkkým E píšeme jako skupinu s háčkem — dě, tě, ně, bě, pě, vě, mě.", solution: "Správně je 'děti' — skupina 'dě' (ne 'de' ani 'di') — píšeme ě, aby bylo slovo správně." },
  { question: "Doplň správně: 't_lo'", correct: "tělo", distractors: ["telo", "tilo"], emoji: "🫀", hint: "T následované měkkým E píšeme jako skupinu — tě, dě, ně... Zkus doplnit.", solution: "Správně je 'tělo' — skupina 'tě' (ne 'te') — háček na ě říká, jak slovo vyslovíme." },
  { question: "Doplň správně: 'n_co'", correct: "něco", distractors: ["neco", "nico"], emoji: "❓", hint: "N následované měkkým E píšeme jako skupinu — ně, dě, tě... Zkus doplnit.", solution: "Správně je 'něco' — skupina 'ně' (ne 'ne') — háček na ě je součástí pravopisu slova." },
  { question: "Doplň správně: 'b_hat'", correct: "běhat", distractors: ["behat", "bihat"], emoji: "🏃", hint: "B následované měkkým E píšeme jako skupinu — bě, pě, vě... Zkus doplnit.", solution: "Správně je 'běhat' — skupina 'bě' (ne 'be') — háček na ě patří k pravopisu tohoto slovesa." },
  { question: "Doplň správně: 'p_t'", correct: "pět", distractors: ["pet", "pit"], emoji: "🖐️", hint: "P následované měkkým E píšeme jako skupinu — pě, bě, vě... Zkus doplnit.", solution: "Správně je 'pět' — skupina 'pě' (ne 'pe') — číslice pět se píše s háčkem na ě." },
  { question: "Doplň správně: 'v_c'", correct: "věc", distractors: ["vec", "vic"], emoji: "📦", hint: "V následované měkkým E píšeme jako skupinu — vě, bě, pě... Zkus doplnit.", solution: "Správně je 'věc' — skupina 'vě' (ne 've') — háček na ě je součástí pravopisu." },
  { question: "Doplň správně: 'm_sto'", correct: "město", distractors: ["mesto", "misto"], emoji: "🏙️", hint: "M následované měkkým E píšeme jako skupinu — mě, vě, bě... Zkus doplnit.", solution: "Správně je 'město' — skupina 'mě' (ne 'me') — háček na ě je součástí pravopisu." },
  { question: "Doplň správně: 'm_síc'", correct: "měsíc", distractors: ["mesíc", "misíc"], emoji: "🌙", hint: "Slovo pro těleso na noční obloze i pro část roku — píšeme ho s mě nebo me?", solution: "Správně je 'měsíc' — skupina 'mě' (ne 'me') — háček na ě patří k pravopisu slova." },
  { question: "Doplň správně: 't_žký'", correct: "těžký", distractors: ["težký", "tižký"], emoji: "🏋️", hint: "T následované měkkým E píšeme jako skupinu — tě, dě, ně... Zkus doplnit.", solution: "Správně je 'těžký' — skupina 'tě' (ne 'te') — háček na ě je součástí pravopisu." },
  { question: "Doplň správně: 'n_kdo'", correct: "někdo", distractors: ["nekdo", "nikdo"], emoji: "🤷", hint: "N následované měkkým E píšeme jako skupinu — ně, dě, tě... Zkus doplnit.", solution: "Správně je 'někdo' — skupina 'ně' (ne 'ne' ani 'ni') — háček na ě je součástí pravopisu." },
  { question: "Doplň správně: 'p_kný'", correct: "pěkný", distractors: ["pekný", "pikný"], emoji: "😊", hint: "P následované měkkým E píšeme jako skupinu — pě, bě, vě... Zkus doplnit.", solution: "Správně je 'pěkný' — skupina 'pě' (ne 'pe') — háček na ě je součástí pravopisu." },
  { question: "Doplň správně: 'd_lat'", correct: "dělat", distractors: ["delat", "dilat"], emoji: "🔧", hint: "D následované měkkým E píšeme jako skupinu — dě, tě, ně... Zkus doplnit.", solution: "Správně je 'dělat' — skupina 'dě' (ne 'de') — háček na ě je součástí pravopisu tohoto slovesa." },
  { question: "Doplň správně: 'v_ta'", correct: "věta", distractors: ["veta", "vita"], emoji: "📝", hint: "V následované měkkým E píšeme jako skupinu — vě, bě, pě... Zkus doplnit.", solution: "Správně je 'věta' — skupina 'vě' (ne 've') — háček na ě patří k pravopisu slova 'věta'." },
  { question: "Doplň správně: 'd_deček'", correct: "dědeček", distractors: ["dededeček", "dideček"], emoji: "👴", hint: "Začátek slova pro tatínkova tátu — píšeme ho s dě nebo de?", solution: "Správně je 'dědeček' — skupina 'dě' na začátku i uprostřed — háček na ě je součástí pravopisu." },
  { question: "Doplň správně: 'n_jaký'", correct: "nějaký", distractors: ["nejaký", "nijaký"], emoji: "🔍", hint: "N následované měkkým E píšeme jako skupinu — ně, dě, tě... Zkus doplnit.", solution: "Správně je 'nějaký' — skupina 'ně' (ne 'ne') — háček na ě patří k pravopisu." },
  { question: "Doplň správně: 't_šit se'", correct: "těšit se", distractors: ["tešit se", "tišit se"], emoji: "😁", hint: "T následované měkkým E píšeme jako skupinu — tě, dě, ně... Zkus doplnit.", solution: "Správně je 'těšit se' — skupina 'tě' (ne 'te') — háček na ě je součástí pravopisu." },
  { question: "Které skupiny píšeme s háčkem (ě)?", correct: "dě, tě, ně, bě, pě, vě, mě", distractors: ["da, ta, na, ba, pa, va, ma", "dy, ty, ny, by, py, vy, my"], emoji: "📖", hint: "Tyto skupiny vznikají, když měkká hláska je za d, t, n, b, p, v, m — zkus vyjmenovat.", solution: "Skupiny s háčkem jsou: dě, tě, ně, bě, pě, vě, mě — ve všech se za souhláskou píše ě, ne e ani i." },
  { question: "Ve kterém slově je skupina 'mě'?", correct: "město", distractors: ["metro", "mince"], emoji: "🏙️", hint: "Hledej slovo, kde za M je ě (s háčkem) — ne e ani i.", solution: "Slovo 'město' obsahuje skupinu 'mě' — proto se píše 'město', ne 'mesto'." },
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

export const SKUPINYDЕТЕНЕ: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-skupiny-de-te-ne-be-pe-ve-me",
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-skupiny-de-te-ne-be-pe-ve-me",
    title: "Skupiny dě-tě-ně-bě-pě-vě-mě",
    studentTitle: "Skupiny s háčkem",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Naučíš se psát skupiny dě, tě, ně, bě, pě, vě, mě.",
    keywords: ["skupiny", "dě", "tě", "ně", "bě", "pě", "vě", "mě", "háček", "ě"],
    goals: [
      "Rozpoznat a správně napsat skupiny dě, tě, ně, bě, pě, vě, mě.",
      "Vědět, že za písmeny d, t, n, b, p, v, m se píše ě (ne e ani i).",
    ],
    boundaries: ["Pouze základní slova z 2. třídy.", "Bez výjimek a složených slov."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Skupiny: dě, tě, ně, bě, pě, vě, mě — vždy s háčkem na ě.",
      steps: ["Přečti slovo s mezerou.", "Je za souhláskou e nebo ě?", "Vyber tvar s háčkem ě."],
      commonMistake: "Zapomenout na háček — 'deti' místo 'děti', 'mesto' místo 'město'.",
      example: "Děti, tělo, něco, běhat, pět, věc, město — vše s háčkem ě.",
    },
  },
];
