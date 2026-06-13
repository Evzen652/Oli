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
  { question: "Říkáme prosím a děkuji. Je to pravda?", correct: true, emoji: "🙏", hint: "Prosím a děkuji jsou základní slova zdvořilosti.", solution: "Říkáme prosím a děkuji — to jsou základní slova slušného chování." },
  { question: "Skáčeme do řeči. Je to pravda?", correct: false, emoji: "🗣️", hint: "Skákat do řeči znamená přerušit někoho — je to slušné?", solution: "Do řeči neskáčeme — čekáme, až druhý domluví." },
  { question: "Pomáháme starším lidem. Je to pravda?", correct: true, emoji: "🤝", hint: "Starší lidé někdy potřebují pomoc — pomoci jim je laskavé.", solution: "Pomáháme starším lidem — to je projev úcty a laskavosti." },
  { question: "Zdravíme dospělé. Je to pravda?", correct: true, emoji: "👋", hint: "Zdravit dospělé Dobrý den je slušné chování.", solution: "Zdravíme dospělé — to patří ke slušnému chování." },
  { question: "Ve škole křičíme. Je to pravda?", correct: false, emoji: "🏫", hint: "Ve škole jsou ostatní děti a učitelé — křičení jim vadí.", solution: "Ve škole nekřičíme — respektujeme ostatní a udržujeme klid." },
  { question: "Uklízíme po sobě. Je to pravda?", correct: true, emoji: "🧹", hint: "Po sobě uklízíme, aby bylo čisto pro všechny.", solution: "Po sobě uklízíme — každý je zodpovědný za svůj nepořádek." },
  { question: "Posloucháme učitele. Je to pravda?", correct: true, emoji: "👂", hint: "Učitel nás učí — poslouchat ho je důležité pro učení.", solution: "Posloucháme učitele — tím projevujeme respekt a lépe se učíme." },
  { question: "Bereme cizí věci bez dovolení. Je to pravda?", correct: false, emoji: "🚫", hint: "Brát cizí věci bez dovolení je špatné — jak bychom se cítili my?", solution: "Cizí věci bez dovolení nebereme — to by bylo krádežnictví." },
  { question: "Umýváme si ruce. Je to pravda?", correct: true, emoji: "🧼", hint: "Umývat si ruce chrání nás před nemocemi.", solution: "Umýváme si ruce — zejména před jídlem a po záchodě, abychom byli zdraví." },
  { question: "U stolu mlaskáme. Je to pravda?", correct: false, emoji: "🍽️", hint: "Mlaskat u stolu je nezdvořilé — ruší ostatní při jídle.", solution: "U stolu nemlaskáme — to patří ke slušnému stolování." },
  { question: "Pouštíme starší sednout. Je to pravda?", correct: true, emoji: "🚌", hint: "Pustit starší osobu sednout v autobusu je laskavé.", solution: "Pouštíme starší sednout — to je projev úcty ke starším." },
  { question: "Děkujeme za pomoc. Je to pravda?", correct: true, emoji: "🙏", hint: "Poděkovat za pomoc je slušné a druhého potěší.", solution: "Děkujeme za pomoc — tím dáváme najevo, že si pomoci vážíme." },
  { question: "Posmíváme se ostatním. Je to pravda?", correct: false, emoji: "🚫", hint: "Posmívat se druhým je kruté — jak by se cítili oni?", solution: "Neposmíváme se ostatním — to by je zranilo a je to ošklivé." },
  { question: "Mluvíme slušně. Je to pravda?", correct: true, emoji: "😊", hint: "Mluvit slušně znamená nenadávat a být zdvořilý.", solution: "Mluvíme slušně — bez nadávek a hrubých slov." },
  { question: "Po jídle si utíráme pusu. Je to pravda?", correct: true, emoji: "🍽️", hint: "Utřít si pusu po jídle je základní hygiena u stolu.", solution: "Po jídle si utíráme pusu — to patří ke slušnému stolování." },
  { question: "Házíme odpadky na zem. Je to pravda?", correct: false, emoji: "🗑️", hint: "Odpadky patří do koše, ne na zem — proč?", solution: "Odpadky na zem nehazujeme — patří do koše, abychom udrželi čistotu." },
  { question: "Říkáme dobrý den. Je to pravda?", correct: true, emoji: "👋", hint: "Pozdravit Dobrý den je první krok slušného chování.", solution: "Říkáme dobrý den — zdravení je základní zdvořilost." },
  { question: "Lžeme rodičům. Je to pravda?", correct: false, emoji: "🚫", hint: "Lhát rodičům ničí důvěru — rodiče se na nás nemohou spolehnout.", solution: "Rodičům nelžeme — upřímnost a důvěra jsou základ rodiny." },
  { question: "Půjčíme kamarádovi hračku. Je to pravda?", correct: true, emoji: "🧸", hint: "Půjčit hračku kamarádovi je štědré a přátelské.", solution: "Kamarádovi hračku půjčíme — to je hezký přátelský čin." },
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

export const PRAVIDLASLUSNEHOCHOVANI: TopicMetadata[] = [
  {
    id: "g2-prv-chovani",
    rvpNodeId: "g2-prvouka-lide-kolem-nas-souziti-lidi-pravidla-slusneho-chovani-a-souziti",
    title: "Pravidla slušného chování a soužití",
    studentTitle: "Slušné chování",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití lidí",
    briefDescription: "Jak se chovat slušně k lidem.",
    keywords: ["chování", "slušnost", "prosím", "děkuji", "zdravení", "pravidla"],
    goals: [
      "Znát základní pravidla slušného chování.",
      "Umět zdravit a děkovat.",
      "Rozlišit slušné a neslušné chování.",
    ],
    boundaries: ["Pouze základní zdvořilost.", "Bez složitých situací."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Slušné chování je být zdvořilý: prosím, děkuji, pozdrav.",
      steps: ["Přečti větu.", "Je to slušné, nebo neslušné?"],
      commonMistake: "Skákání do řeči a křik nejsou slušné chování.",
      example: "Říkáme prosím a děkuji — to je slušné.",
    },
  },
];
