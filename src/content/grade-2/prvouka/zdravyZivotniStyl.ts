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
  { question: "Zuby si čistíme každý den. Je to pravda?", correct: true, emoji: "🦷", hint: "Čisté zuby chrání před kazy — čistíme je každý den?", solution: "Zuby si čistíme každý den — ráno a večer, abychom předešli kazům." },
  { question: "Spánek je důležitý. Je to pravda?", correct: true, emoji: "😴", hint: "Tělo se v noci opravuje a nabírá energii — je spánek důležitý?", solution: "Spánek je důležitý — tělo potřebuje odpočinout a doplnit energii." },
  { question: "Pijeme málo vody. Je to pravda?", correct: false, emoji: "💧", hint: "Tělo potřebuje hodně vody — pijeme málo nebo hodně?", solution: "Pijeme hodně vody, ne málo — voda je pro tělo nezbytná." },
  { question: "Ovoce je zdravé. Je to pravda?", correct: true, emoji: "🍎", hint: "Ovoce obsahuje vitamíny — jsou vitamíny pro tělo dobré?", solution: "Ovoce je zdravé — obsahuje vitamíny, které tělo potřebuje." },
  { question: "Pohyb je zdravý. Je to pravda?", correct: true, emoji: "🏃", hint: "Pohyb posiluje svaly a srdce — je sport dobrý pro zdraví?", solution: "Pohyb je zdravý — sportem posilujeme svaly, srdce a celé tělo." },
  { question: "Myjeme si ruce před jídlem. Je to pravda?", correct: true, emoji: "🧼", hint: "Na rukou jsou bakterie — před jídlem je omyjeme, aby nás neonemocněly.", solution: "Myjeme si ruce před jídlem — abychom nezanesli do úst bakterie." },
  { question: "Celý den jíme jen bonbony. Je to pravda?", correct: false, emoji: "🍬", hint: "Bonbony jsou sladké, ale není to výživa — co tělo potřebuje?", solution: "Celý den nejíme jen bonbony — tělo potřebuje ovoce, zeleninu, chléb a mléčné výrobky." },
  { question: "Zelenina je zdravá. Je to pravda?", correct: true, emoji: "🥦", hint: "Zelenina obsahuje vitamíny a vlákninu — co to dělá s naším zdravím?", solution: "Zelenina je zdravá — mrkev, brokolice i salát dodávají tělu vitamíny." },
  { question: "Spíme jen jednu hodinu. Je to pravda?", correct: false, emoji: "😴", hint: "Jedna hodina spánku nestačí — děti potřebují kolik hodin?", solution: "Nespíme jen jednu hodinu — děti potřebují 9–10 hodin spánku za noc." },
  { question: "Venku si hrajeme a běháme. Je to pravda?", correct: true, emoji: "⚽", hint: "Pohyb venku je zdravý — jak se cítíme po hraní na hřišti?", solution: "Venku si hrajeme a běháme — pohyb na čerstvém vzduchu je velmi zdravý." },
  { question: "Pijeme hodně vody. Je to pravda?", correct: true, emoji: "💧", hint: "Tělo potřebuje denně 1–1,5 litru vody — pijeme hodně nebo málo?", solution: "Pijeme hodně vody — děti by měly vypít každý den asi 1,5 litru vody." },
  { question: "Sedíme celý den u televize. Je to pravda?", correct: false, emoji: "📺", hint: "Celý den u televize sedět zdravé není — co bychom měli dělat?", solution: "Celý den u televize nesedíme — střídáme pohyb, čtení a odpočinek." },
  { question: "Po jídle si čistíme zuby. Je to pravda?", correct: true, emoji: "🦷", hint: "Po jídle zbyde na zubech cukr — co se stane, když ho nenecháme?", solution: "Po jídle si čistíme zuby — cukr z jídla by zubům škodil." },
  { question: "Ráno snídáme. Je to pravda?", correct: true, emoji: "🍞", hint: "Po noci je tělo bez energie — snídaně ji doplní.", solution: "Ráno snídáme — snídaně dodá tělu energii na celé dopoledne." },
  { question: "Odpočinek tělu škodí. Je to pravda?", correct: false, emoji: "😴", hint: "Odpočinek tělu škodí, nebo pomáhá? Co cítíme po dobrém spánku?", solution: "Odpočinek tělu neškodí — naopak ho potřebujeme, abychom měli energii." },
  { question: "Sport posiluje tělo. Je to pravda?", correct: true, emoji: "🏃", hint: "Při sportu pracují svaly — posilují se nebo slábnou?", solution: "Sport posiluje tělo — při pohybu pracují svaly a srdce, které jsou pak silnější." },
  { question: "Nikdy se nemyjeme. Je to pravda?", correct: false, emoji: "🚿", hint: "Hygiena je důležitá — co se stane, když se nemyjeme?", solution: "Myjeme se každý den — hygiena chrání zdraví a odstraňuje bakterie." },
  { question: "Mrkev je zdravá. Je to pravda?", correct: true, emoji: "🥕", hint: "Mrkev je zelenina plná vitamínu A — je zdravá, nebo škodlivá?", solution: "Mrkev je zdravá — obsahuje vitamín A, který pomáhá očím a imunitě." },
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

export const ZDRAVYZIVOTNISTYL: TopicMetadata[] = [
  {
    id: "g2-prv-zdravy-styl",
    rvpNodeId: "g2-prvouka-clovek-a-jeho-zdravi-zdravy-zivotni-styl-pohyb-odpocinek-spanek-pitny-rezim",
    title: "Zdravý životní styl – pohyb, odpočinek, spánek, pitný režim",
    studentTitle: "Zdravý život",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Zdravý životní styl",
    briefDescription: "Jak žít zdravě a pečovat o tělo.",
    keywords: ["zdraví", "pohyb", "spánek", "voda", "ovoce", "hygiena"],
    goals: [
      "Vědět, co je zdravé pro tělo.",
      "Znát význam spánku, pohybu a pití.",
      "Rozlišit zdravé a nezdravé návyky.",
    ],
    boundaries: ["Pouze základní návyky.", "Bez výživových tabulek."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Zdravě žijeme: jíme ovoce, hýbeme se, pijeme vodu a spíme.",
      steps: ["Přečti větu.", "Je to zdravé, nebo ne?"],
      commonMistake: "Málo vody a jen bonbony nejsou zdravé.",
      example: "Ovoce je zdravé, pohyb posiluje tělo, spánek je důležitý.",
    },
  },
];
