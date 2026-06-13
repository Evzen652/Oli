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
  { question: "Kamarádovi pomáháme. Je to pravda?", correct: true, emoji: "🤝", hint: "Pomoci kamarádovi je přátelský čin.", solution: "Kamarádům pomáháme — tak vypadá opravdové přátelství." },
  { question: "Souseda zdravíme. Je to pravda?", correct: true, emoji: "👋", hint: "Zdravit souseda je slušné chování.", solution: "Souseda zdravíme — je to základní zdvořilost." },
  { question: "Kamaráda posloucháme. Je to pravda?", correct: true, emoji: "👫", hint: "Naslouchat kamarádovi znamená, že nám na něm záleží.", solution: "Kamaráda posloucháme — tak mu dáváme najevo, že ho respektujeme." },
  { question: "Kamaráda ničíme. Je to pravda?", correct: false, emoji: "👫", hint: "Ničit kamaráda je ošklivé — co my chceme od přátel?", solution: "Kamaráda neničíme — to by přátelství nebylo." },
  { question: "Sousedovi ubližujeme. Je to pravda?", correct: false, emoji: "🏘️", hint: "Ubližovat sousedovi je špatné — jak bychom se cítili my?", solution: "Sousedovi neubližujeme — k sousedům se chováme hezky." },
  { question: "S kamarádem se dělíme. Je to pravda?", correct: true, emoji: "🤝", hint: "Dělit se je hezké — kamarád se pak rád dělí také.", solution: "S kamarádem se dělíme — to je projev přátelství." },
  { question: "Kamaráda přijímáme takového, jaký je. Je to pravda?", correct: true, emoji: "👫", hint: "Každý je jiný — přijmout kamaráda takového, jaký je, je důležité.", solution: "Kamaráda přijímáme takového, jaký je — každý je jiný a to je v pořádku." },
  { question: "Kamarádovi lžeme. Je to pravda?", correct: false, emoji: "👫", hint: "Lhaní kamarádovi poškodí přátelství — kamarád nám pak nemůže věřit.", solution: "Kamarádovi nelžeme — přátelství stojí na důvěře." },
  { question: "Souseda zdravíme Dobrý den. Je to pravda?", correct: true, emoji: "👋", hint: "Pozdravit souseda „Dobrý den“ je slušné a přátelské.", solution: "Souseda zdravíme Dobrý den — to je základní zdvořilost." },
  { question: "Kamarádovi pomůžeme, když pláče. Je to pravda?", correct: true, emoji: "🤝", hint: "Když kamarád pláče, potřebuje pomoc — co uděláme?", solution: "Kamarádovi pomůžeme, když pláče — to je znak přátelství." },
  { question: "Kamaráda strkáme. Je to pravda?", correct: false, emoji: "👫", hint: "Strkat kamaráda ho bolí — je to správné?", solution: "Kamaráda nestrkáme — fyzické ubližování není přátelské." },
  { question: "S kamarády si hrajeme. Je to pravda?", correct: true, emoji: "👫", hint: "Společná hra s kamarády je zábavná a přátelská.", solution: "S kamarády si hrajeme — to je jedna z nejlepší věcí na přátelství." },
  { question: "Sousedovi pomůžeme nést tašku. Je to pravda?", correct: true, emoji: "🛍️", hint: "Pomoci sousedovi s těžkou taškou je laskavé.", solution: "Sousedovi pomůžeme nést tašku — to je hezký sousedský čin." },
  { question: "Kamarádovi bereme hračky bez dovolení. Je to pravda?", correct: false, emoji: "🧸", hint: "Brát kamarádovi hračky bez dovolení je špatné — jak by se cítil?", solution: "Kamarádovi hračky bez dovolení nebereme — to by kamaráda mrzelo." },
  { question: "Kamarády máme rádi. Je to pravda?", correct: true, emoji: "❤️", hint: "Mít kamarády rád je základ přátelství.", solution: "Kamarády máme rádi — přátelství je o vzájemné náklonnosti." },
  { question: "Souseda zlobíme. Je to pravda?", correct: false, emoji: "🏘️", hint: "Zlobit souseda mu přidělává starosti — je to správné?", solution: "Souseda nezlobíme — sousedé by si měli pomáhat, ne zlobit." },
  { question: "Kamarádovi přejeme dobro. Je to pravda?", correct: true, emoji: "🤝", hint: "Přát kamarádovi dobro znamená, že mu fandíme.", solution: "Kamarádovi přejeme dobro — chceme, aby se mu dařilo." },
  { question: "S kamarádem se hádáme pořád. Je to pravda?", correct: false, emoji: "👫", hint: "Stálé hádky kamarádství ničí — přátelé se hádají málokdy.", solution: "S kamarádem se pořád nehádáme — hádky přátelství oslabují." },
  { question: "Sousedovi se usmíváme. Je to pravda?", correct: true, emoji: "😊", hint: "Úsměv na souseda je přátelský a příjemný.", solution: "Sousedovi se usmíváme — úsměv je nejjednodušší způsob, jak být přátelský." },
  { question: "Kamarádovi pomáháme s úkolem. Je to pravda?", correct: true, emoji: "📚", hint: "Pomoci kamarádovi s úkolem je hezké — on pomůže také.", solution: "Kamarádovi pomáháme s úkolem — přátelé si pomáhají." },
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

export const LIDEVOKOLIKAMARADSTVI: TopicMetadata[] = [
  {
    id: "g2-prv-sousedstvi",
    rvpNodeId: "g2-prvouka-lide-kolem-nas-souziti-lidi-lide-v-okoli-sousedstvi-kamaradstvi",
    title: "Lidé v okolí, sousedství, kamarádství",
    studentTitle: "Kamarádi a sousedé",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití lidí",
    briefDescription: "Jak se chováme ke kamarádům a sousedům.",
    keywords: ["kamarád", "soused", "kamarádství", "pomoc", "soužití"],
    goals: [
      "Vědět, jak se chovat ke kamarádům.",
      "Umět pomoci sousedovi.",
      "Rozlišit dobré a špatné chování.",
    ],
    boundaries: ["Pouze základy soužití.", "Bez složitých vztahů."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Ke kamarádům a sousedům jsme hodní a pomáháme jim.",
      steps: ["Přečti větu.", "Je to hezké chování, nebo ošklivé?"],
      commonMistake: "Ubližování a ničení není dobré chování.",
      example: "Kamarádovi pomůžeme, když potřebuje — to je pravda.",
    },
  },
];
