import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "pes", right: "savec" },
      { left: "kapr", right: "ryba" },
      { left: "sýkora", right: "pták" },
      { left: "žába", right: "obojživelník" },
    ],
    hints: [
      "Savci mají srst a kojí mláďata.",
      "Ryby žijí ve vodě a dýchají žábrami.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "kráva", right: "savec" },
      { left: "štika", right: "ryba" },
      { left: "čáp", right: "pták" },
      { left: "ještěrka", right: "plaz" },
    ],
    hints: [
      "Ptáci mají peří a zobák.",
      "Plazi mají šupiny a jsou studenokrevní.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "netopýr", right: "savec" },
      { left: "lín", right: "ryba" },
      { left: "sova", right: "pták" },
      { left: "had", right: "plaz" },
    ],
    hints: [
      "Netopýr létá, ale je to savec — má srst a kojí mláďata.",
      "Had nemá nohy, ale patří mezi plazy.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "mravenec", right: "hmyz" },
      { left: "čolek", right: "obojživelník" },
      { left: "želva", right: "plaz" },
      { left: "motýl", right: "hmyz" },
    ],
    hints: [
      "Hmyz poznáš podle 6 noh a 3 částí těla.",
      "Obojživelníci žijí mládí ve vodě, dospělí i na souši.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "brouk", right: "hmyz" },
      { left: "mlok", right: "obojživelník" },
      { left: "pstruh", right: "ryba" },
      { left: "jezevec", right: "savec" },
    ],
    hints: [
      "Brouk má 6 noh — je to hmyz.",
      "Mlok žije jako mladý ve vodě, dospělý i na souši.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "vlaštovka", right: "pták" },
      { left: "liška", right: "savec" },
      { left: "rosnička", right: "obojživelník" },
      { left: "krajta", right: "plaz" },
    ],
    hints: [
      "Vlaštovka má peří a zobák — je to pták.",
      "Liška má srst a kojí mláďata — je to savec.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "včela", right: "hmyz" },
      { left: "sumec", right: "ryba" },
      { left: "slepýš", right: "plaz" },
      { left: "vrabec", right: "pták" },
    ],
    hints: [
      "Včela má 6 noh a 3 části těla — je to hmyz.",
      "Slepýš vypadá jako had, ale je to plaz s nepatrnými nohami.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "jelen", right: "savec" },
      { left: "komár", right: "hmyz" },
      { left: "čolka velký", right: "obojživelník" },
      { left: "losos", right: "ryba" },
    ],
    hints: [
      "Jelen má srst — patří mezi savce.",
      "Komár má 6 noh — patří mezi hmyz.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "rorýs", right: "pták" },
      { left: "chameleón", right: "plaz" },
      { left: "vydra", right: "savec" },
      { left: "světluška", right: "hmyz" },
    ],
    hints: [
      "Rorýs má peří a zobák — je to pták.",
      "Chameleón má šupiny a je studenokrevní — je to plaz.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "hroch", right: "savec" },
      { left: "tučňák", right: "pták" },
      { left: "blatnice", right: "obojživelník" },
      { left: "gekončík", right: "plaz" },
    ],
    hints: [
      "Tučňák neumí létat, ale má peří a zobák — je to pták.",
      "Blatnice žije na souši i ve vodě — je to obojživelník.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "cvrček", right: "hmyz" },
      { left: "plotice", right: "ryba" },
      { left: "kos", right: "pták" },
      { left: "veverka", right: "savec" },
    ],
    hints: [
      "Cvrček má 6 noh a 3 části těla — je to hmyz.",
      "Kos má peří a zobák — je to pták.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "drak komodský", right: "plaz" },
      { left: "žába skokavá", right: "obojživelník" },
      { left: "moucha", right: "hmyz" },
      { left: "okoun", right: "ryba" },
    ],
    hints: [
      "Drak komodský je velký ještěr — plaz.",
      "Moucha má 6 noh — je to hmyz.",
    ],
  },
  {
    type: "select_one",
    question: "Který znak patří SAVCŮM?",
    correctAnswer: "Kojí mláďata mlékem",
    options: [
      "Kojí mláďata mlékem",
      "Mají šupiny na těle",
      "Mají 6 noh a 3 části těla",
      "Snášejí vejce na souši",
    ],
    hints: [
      "Savci se starají o mláďata a živí je mlékem.",
      "Savci mají srst nebo chlupy.",
    ],
    explanation:
      "Savci kojí svá mláďata mlékem — to je jejich hlavní znak. Mají také srst nebo chlupy.",
  },
  {
    type: "select_one",
    question: "Jak dýchají RYBY?",
    correctAnswer: "Žábrami",
    options: ["Žábrami", "Plícemi", "Kůží", "Zobákem"],
    hints: [
      "Ryby celý život žijí ve vodě.",
      "Podívej se na strany hlavy ryby — tam jsou žábry.",
    ],
    explanation:
      "Ryby dýchají žábrami, které filtrují kyslík rozpuštěný ve vodě. Proto mohou žít celý život pod vodou.",
  },
  {
    type: "select_one",
    question: "Kolik noh má HMYZ?",
    correctAnswer: "6 noh",
    options: ["6 noh", "4 nohy", "8 noh", "2 nohy"],
    hints: [
      "Hmyz má tělo rozděleno na 3 části.",
      "Spočítej nohy motýla nebo mravence.",
    ],
    explanation:
      "Hmyz má vždy přesně 6 noh a tělo rozdělené na tři části: hlavu, hruď a zadeček. Podle toho ho poznáš.",
  },
  {
    type: "select_one",
    question: "Kde kladou OBOJŽIVELNÍCI vajíčka?",
    correctAnswer: "Do vody",
    options: ["Do vody", "Na suché místo v lese", "Do hnízda na stromě", "Do písku"],
    hints: [
      "Mláďata obojživelníků potřebují vodu.",
      "Malé pulce žab vídáme v rybnících a potocích.",
    ],
    explanation:
      "Obojživelníci kladou vajíčka do vody. Mláďata (např. pulci) žijí nejprve ve vodě a teprve dospělí vylézají na souš.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const SKUPINYZIVOCICHU: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-rostliny-a-zivocichove-skupiny-zivocichu-savci-ptaci-ryby-plazi-obojzivelnici-hmyz",
    title: "Skupiny živočichů",
    studentTitle: "Zvířata a jejich skupiny",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Rostliny a živočichové",
    briefDescription: "Roztřídíš zvířata do skupin podle jejich znaků.",
    keywords: [
      "skupiny živočichů",
      "třídění zvířat",
      "savec",
      "savci",
      "pták",
      "ptáci",
      "ryba",
      "ryby",
      "plaz",
      "plazi",
      "obojživelník",
      "obojživelníci",
      "hmyz",
      "srst",
      "peří",
      "šupiny",
      "žábry",
      "obratlovci",
    ],
    goals: [
      "Roztřídit zvířata do skupin: savci, ptáci, ryby, plazi, obojživelníci, hmyz.",
      "Poznat skupinu živočicha podle typických znaků (srst, peří, šupiny, žábry).",
      "Přiřadit konkrétní zvíře ke správné skupině.",
    ],
    boundaries: [
      "Šest základních skupin pro 3. třídu — bez podrobné systematiky.",
      "Bez latinských názvů a detailní anatomie.",
      "Hmyz jako zástupce bezobratlých, ostatní skupiny jsou obratlovci.",
    ],
    gradeRange: [3, 3],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Savci mají srst a kojí mláďata. Ptáci mají peří a zobák. Ryby mají šupiny a dýchají žábrami. Plazi mají šupiny a jsou studenokrevní. Obojživelníci žijí ve vodě i na souši. Hmyz má 6 noh a 3 části těla.",
      steps: [
        "Podívej se na tělo zvířete — má srst, peří, nebo šupiny?",
        "Srst + kojí mláďata = savec. Peří + zobák = pták.",
        "Šupiny + žábry + žije ve vodě = ryba. Šupiny + studenokrevný = plaz.",
        "Žije ve vodě i na souši = obojživelník. 6 noh a 3 části těla = hmyz.",
      ],
      commonMistake:
        "Netopýr létá, ale je to savec (má srst). Slepýš vypadá jako had, ale je to plaz. Čolek a mlok jsou obojživelníci, ne plazi.",
      example:
        "Pes = savec (srst), kapr = ryba (žábry), sova = pták (peří), had = plaz (šupiny), žába = obojživelník, motýl = hmyz.",
    },
  },
];
