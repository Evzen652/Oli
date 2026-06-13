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
  { question: "Kolik měsíců má rok?", correct: "12", distractors: ["10", "7"], emoji: "📅", hint: "Vzpomeň si na kalendář — leden, únor, březen… kolik jich je celkem?", solution: "Rok má 12 měsíců — od ledna do prosince." },
  { question: "Kolik dní má týden?", correct: "7", distractors: ["5", "10"], emoji: "📆", hint: "Spočítej dny: pondělí, úterý, středa, čtvrtek, pátek, sobota, neděle — kolik jich je?", solution: "Týden má 7 dní — od pondělí do neděle." },
  { question: "Kolik hodin má den?", correct: "24", distractors: ["12", "60"], emoji: "⏰", hint: "Den má část denní a část noční — dohromady 24 hodin.", solution: "Den má 24 hodin — 12 hodin dne a 12 hodin noci." },
  { question: "Kolik minut má hodina?", correct: "60", distractors: ["30", "100"], emoji: "🕐", hint: "Na hodinách je 60 dílků — každý dílek je 1 minuta.", solution: "Hodina má 60 minut." },
  { question: "Kolik dní má rok?", correct: "365", distractors: ["300", "100"], emoji: "📅", hint: "Rok má přibližně 52 týdnů. Každý týden má 7 dní — kolik je to celkem?", solution: "Rok má 365 dní (přestupný rok má 366)." },
  { question: "Který den je první v týdnu?", correct: "Pondělí", distractors: ["Neděle", "Středa"], emoji: "📆", hint: "Týden začíná pracovním dnem — pondělí, úterý…", solution: "Pondělí je první den v týdnu — každý týden začíná pondělím." },
  { question: "Který den je poslední v týdnu?", correct: "Neděle", distractors: ["Sobota", "Pátek"], emoji: "📆", hint: "Týden končí víkendem — sobota nebo neděle. Který je poslední?", solution: "Neděle je poslední den v týdnu." },
  { question: "Čím měříme čas?", correct: "Hodiny", distractors: ["Metr", "Váha"], emoji: "⏰", hint: "Co visí na zdi a ukazuje, kolik je hodin?", solution: "Čas měříme hodinami." },
  { question: "Kdy je nejvíc tma?", correct: "Noc", distractors: ["Ráno", "Poledne"], emoji: "🌙", hint: "Slunce svítí přes den — kdy ho nevidíme?", solution: "Nejvíc tma je v noci — slunce pak nesvítí." },
  { question: "Kdy vychází slunce?", correct: "Ráno", distractors: ["Večer", "Noc"], emoji: "🌅", hint: "Slunce vychází na začátku dne — ráno, v poledne nebo večer?", solution: "Slunce vychází ráno — na začátku každého dne." },
  { question: "Kolik ručiček mají hodiny?", correct: "Dvě", distractors: ["Jedna", "Tři"], emoji: "🕐", hint: "Hodiny mají hodinovou ručičku (kratší) a minutovou ručičku (delší).", solution: "Hodiny mají dvě hlavní ručičky — hodinovou a minutovou." },
  { question: "Co je delší než minuta?", correct: "Hodina", distractors: ["Vteřina", "Nic"], emoji: "⏳", hint: "Srovnej: vteřina, minuta, hodina — která z nich trvá nejdéle?", solution: "Hodina je delší než minuta — 1 hodina = 60 minut." },
  { question: "Který měsíc je první v roce?", correct: "Leden", distractors: ["Prosinec", "Březen"], emoji: "❄️", hint: "Rok začíná zimním měsícem — leden, únor…", solution: "První měsíc v roce je leden — rok začíná v lednu." },
  { question: "Který měsíc je poslední v roce?", correct: "Prosinec", distractors: ["Leden", "Červen"], emoji: "🎄", hint: "Rok končí vánočním měsícem — kdy slavíme Vánoce?", solution: "Poslední měsíc v roce je prosinec — v prosinci slavíme Vánoce." },
  { question: "Které roční období přijde po podzimu?", correct: "Zima", distractors: ["Léto", "Jaro"], emoji: "❄️", hint: "Čtyři roční období jdou za sebou: jaro, léto, podzim, zima — co přijde po podzimu?", solution: "Po podzimu přijde zima — rok má čtyři roční období: jaro, léto, podzim, zima." },
  { question: "Kolik hodin ukazují hodiny v poledne?", correct: "12", distractors: ["6", "24"], emoji: "🕛", hint: "Poledne je uprostřed dne — ručičky jsou obě nahoře na 12.", solution: "V poledne je 12 hodin — ručičky jsou obě nahoře." },
  { question: "Který den přijde po pondělí?", correct: "Úterý", distractors: ["Neděle", "Pátek"], emoji: "📆", hint: "Dny v týdnu jdou za sebou: pondělí, úterý, středa… Co přijde hned po pondělí?", solution: "Po pondělí přijde úterý — je to druhý den v týdnu." },
  { question: "Které roční období přijde po létě?", correct: "Podzim", distractors: ["Jaro", "Zima"], emoji: "🍂", hint: "Čtyři roční období: jaro, léto, podzim, zima — co přijde po létě?", solution: "Po létě přijde podzim — listí začne padat a ochladí se." },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct,
    options: shuffle([item.correct, ...item.distractors]),
    emoji: item.emoji,
    hints: [item.hint],
    solutionSteps: [item.solution],
  }));
}

export const HODINYKALENDARCAS: TopicMetadata[] = [
  {
    id: "g2-prv-hodiny-cas",
    rvpNodeId: "g2-prvouka-lide-a-cas-mereni-casu-a-tradice-hodiny-kalendar-cas",
    title: "Hodiny, kalendář a čas",
    studentTitle: "Hodiny a čas",
    subject: "prvouka",
    category: "Lidé a čas",
    topic: "Měření času a tradice",
    briefDescription: "Poznáš dny, měsíce a hodiny.",
    keywords: ["čas", "hodiny", "kalendář", "den", "týden", "měsíc", "rok"],
    goals: [
      "Vědět, kolik má rok měsíců a týden dní.",
      "Znát části dne a měření času.",
      "Orientovat se v kalendáři.",
    ],
    boundaries: ["Pouze základní jednotky času.", "Bez čtení přesného času na hodinách."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Rok má 12 měsíců, týden 7 dní, den 24 hodin.",
      steps: ["Přečti otázku.", "Vzpomeň si na kalendář a hodiny."],
      commonMistake: "Záměna týdne (7 dní) a roku (12 měsíců).",
      example: "Týden má 7 dní: pondělí až neděle.",
    },
  },
];
