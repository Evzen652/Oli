import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ANO = "Ano, to je pravda";
const NE = "Ne, to není pravda";

interface TrueFalseItem {
  question: string;
  correct: boolean;
  emoji: string;
  hint: string;
  solution: string;
}

const POOL: TrueFalseItem[] = [
  { question: "Praha je město. Je to pravda?", correct: true, emoji: "🏙️", hint: "Praha je velká — víš, jestli je to vesnice nebo město?", solution: "Praha je město — je to dokonce hlavní město České republiky." },
  { question: "V obci bývá škola. Je to pravda?", correct: true, emoji: "🏫", hint: "Ve většině obcí najdeme školu, kde se děti učí.", solution: "V obci bývá škola — děti tam chodí se vzdělávat." },
  { question: "Naše adresa obsahuje název obce. Je to pravda?", correct: true, emoji: "📮", hint: "Adresa říká, kde bydlíme — napíšeme tam název ulice, číslo domu a také...", solution: "Naše adresa obsahuje název obce — díky tomu pošta i záchranáři vědí, kde nás najít." },
  { question: "Každá obec má jméno. Je to pravda?", correct: true, emoji: "🏘️", hint: "Stejně jako my máme jméno, má i každá obec své jméno.", solution: "Každá obec má jméno — podle něj ji poznáme na mapě a v adrese." },
  { question: "Vesnice je menší než město. Je to pravda?", correct: true, emoji: "🏡", hint: "Ve městě žije víc lidí a je tam více budov než na vesnici.", solution: "Vesnice je menší než město — v městě žije více lidí a je tam více budov." },
  { question: "V obci bydlí lidé. Je to pravda?", correct: true, emoji: "🏘️", hint: "Obec je místo, kde lidé bydlí, pracují a žijí.", solution: "V obci bydlí lidé — to je základní smysl obce jako místa k životu." },
  { question: "Praha je vesnice. Je to pravda?", correct: false, emoji: "🏙️", hint: "Praha má více než milion obyvatel — je to vesnice nebo město?", solution: "Praha není vesnice — je to velké město, hlavní město České republiky." },
  { question: "V obci jsou ulice. Je to pravda?", correct: true, emoji: "🛣️", hint: "Ulice jsou cesty mezi domy — v každé obci jsou.", solution: "V obci jsou ulice — po nich se pohybujeme mezi domy." },
  { question: "Obec nemá žádné domy. Je to pravda?", correct: false, emoji: "🏠", hint: "Obec je místo, kde stojí domy a bydlí lidé.", solution: "Obec má domy — bez domů by to nebyla obec, ale les nebo pole." },
  { question: "Ve většině obcí je obchod. Je to pravda?", correct: true, emoji: "🏪", hint: "V obchodě nakupujeme jídlo a věci — ve většině obcí je.", solution: "Ve většině obcí je obchod — tam nakupujeme jídlo a potřebné věci." },
  { question: "Město je větší než vesnice. Je to pravda?", correct: true, emoji: "🏙️", hint: "Město má víc lidí, domů a institucí než vesnice.", solution: "Město je větší než vesnice — žije v něm více lidí a je v něm více budov." },
  { question: "V obci nežijí žádní lidé. Je to pravda?", correct: false, emoji: "🏘️", hint: "Kde bydlíme? V obci — kde žijí i naši sousedé.", solution: "V obci žijí lidé — bez obyvatel by to nebyla obec." },
  { question: "Obec má svůj úřad. Je to pravda?", correct: true, emoji: "🏛️", hint: "Obecní úřad nebo radnice stará o věci v obci.", solution: "Obec má svůj úřad — tam se rozhoduje o věcech v obci." },
  { question: "Ve městě žije více lidí než na vesnici. Je to pravda?", correct: true, emoji: "🏙️", hint: "Srovnej vesnici a město — kde žije víc lidí?", solution: "Ve městě žije více lidí než na vesnici — proto je město větší." },
  { question: "Obec nemá ulice. Je to pravda?", correct: false, emoji: "🛣️", hint: "Ulice jsou cesty v obci — jak bychom se jinak dostali k sousedům?", solution: "Obec má ulice — bez ulic bychom se mezi domy nedostali." },
  { question: "V obci stojí domy. Je to pravda?", correct: true, emoji: "🏠", hint: "Domy jsou budovy, kde lidé bydlí — v obci je jich hodně.", solution: "V obci stojí domy — to jsou budovy, kde lidé bydlí." },
  { question: "Praha je hlavní město. Je to pravda?", correct: true, emoji: "🏰", hint: "Každý stát má hlavní město — víš, jaké je hlavní město Česka?", solution: "Praha je hlavní město České republiky — sídlí tam prezident a vláda." },
  { question: "Vesnice je větší než město. Je to pravda?", correct: false, emoji: "🏡", hint: "Srovnej počet obyvatel vesnice a města — kde jich je víc?", solution: "Vesnice není větší než město — město je větší, žije v něm více lidí." },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [item.hint],
    solutionSteps: [item.solution],
  }));
}

export const NASEOBECNAZEV: TopicMetadata[] = [
  {
    id: "g2-prv-nase-obec",
    rvpNodeId: "g2-prvouka-misto-kde-zijeme-obec-a-okoli-nase-obec-nazev-cast-obce-kde-ziji",
    title: "Naše obec, název, část obce kde žiji",
    studentTitle: "Naše obec",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Obec a okolí",
    briefDescription: "Poznáš svou obec a její jméno.",
    keywords: ["obec", "vesnice", "město", "název", "bydliště"],
    goals: [
      "Vědět, že obec má svůj název.",
      "Rozlišit město a vesnici.",
      "Znát, co v obci najdeme.",
    ],
    boundaries: ["Pouze základní pojmy.", "Bez map a plánů."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Obec je místo, kde bydlíme. Má jméno, domy a lidi.",
      steps: ["Přečti větu.", "Platí to o obci, nebo ne?"],
      commonMistake: "Vesnice je menší než město, ne naopak.",
      example: "Praha je velké město, Praha je hlavní město.",
    },
  },
];
