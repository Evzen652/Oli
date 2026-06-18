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

// L1: Základní časté protiklady + definice pojmů antonymum/synonymum
const POOL_L1: PoolItem[] = [
  { question: "Jak se nazývají slova opačného významu?", correct: "Protikladná (antonyma)", distractors: ["Souznačná (synonyma)", "Příbuzná"], emoji: "🔁", hint: "Slova jako 'velký × malý' nebo 'den × noc' jsou si navzájem ...", solution: "Slova opačného významu se nazývají protikladná (nebo antonyma) — 'velký × malý', 'den × noc'." },
  { question: "Jak se nazývají slova podobného nebo stejného významu?", correct: "Souznačná (synonyma)", distractors: ["Protikladná (antonyma)", "Cizí"], emoji: "🔄", hint: "Slova jako 'chlapec = kluk' nebo 'pěkný = hezký' jsou si navzájem ...", solution: "Slova podobného nebo stejného významu se nazývají souznačná (nebo synonyma) — 'chlapec = kluk', 'pěkný = hezký'." },
  { question: "Jaký je opak slova 'velký'?", correct: "malý", distractors: ["hezký", "tmavý"], emoji: "🔁", hint: "Pokud je slon 'velký', jak bychom nazvali mravence?", solution: "Opak slova 'velký' je 'malý' — velký a malý jsou protikladná slova (antonyma)." },
  { question: "Jaký je opak slova 'rychlý'?", correct: "pomalý", distractors: ["tichý", "smutný"], emoji: "🐌", hint: "Závodní auto jede rychle — jak jede šnek?", solution: "Opak slova 'rychlý' je 'pomalý' — rychlý a pomalý jsou protikladná slova." },
  { question: "Jaký je opak slova 'den'?", correct: "noc", distractors: ["večer", "ráno"], emoji: "🌙", hint: "Ráno svítí slunce a je den. Když slunce sejde a rozsvítí se hvězdy, je...", solution: "Opak slova 'den' je 'noc' — den a noc jsou protikladná slova." },
  { question: "Jaký je opak slova 'nahoru'?", correct: "dolů", distractors: ["doprava", "dozadu"], emoji: "⬆️", hint: "Výtah jede nahoru — a pak jede...", solution: "Opak slova 'nahoru' je 'dolů' — nahoru a dolů jsou protikladná slova." },
  { question: "Jaký je opak slova 'veselý'?", correct: "smutný", distractors: ["tichý", "pomalý"], emoji: "😢", hint: "Dítě u dárku je veselé. Dítě, které ztratilo hračku, je...", solution: "Opak slova 'veselý' je 'smutný' — veselý a smutný jsou protikladná slova." },
  { question: "Jaký je opak slova 'nový'?", correct: "starý", distractors: ["velký", "tmavý"], emoji: "🕰️", hint: "Koupili jsme nové auto. Za dvacet let to bude...", solution: "Opak slova 'nový' je 'starý' — nový a starý jsou protikladná slova." },
];

// L2: Méně frekventované protiklady + základní synonyma (chlapec=kluk, pěkný=hezký)
const POOL_L2: PoolItem[] = [
  { question: "Jaký je opak slova 'teplý'?", correct: "studený", distractors: ["mokrý", "tmavý"], emoji: "🧊", hint: "Čaj z termosky je teplý. Jakou teplotu má led?", solution: "Opak slova 'teplý' je 'studený' — teplý a studený jsou protikladná slova." },
  { question: "Jaký je opak slova 'světlý'?", correct: "tmavý", distractors: ["barevný", "šedý"], emoji: "🌑", hint: "Žlutá barva je světlá. Černá barva je...", solution: "Opak slova 'světlý' je 'tmavý' — světlý a tmavý jsou protikladná slova." },
  { question: "Jaký je opak slova 'otevřít'?", correct: "zavřít", distractors: ["otočit", "přinést"], emoji: "🚪", hint: "Ráno otevřeme okno a večer ho...", solution: "Opak slova 'otevřít' je 'zavřít' — otevřít a zavřít jsou protikladná slova." },
  { question: "Jaký je opak slova 'začátek'?", correct: "konec", distractors: ["střed", "přestávka"], emoji: "🏁", hint: "Film má začátek a...", solution: "Opak slova 'začátek' je 'konec' — začátek a konec jsou protikladná slova." },
  { question: "Které slovo znamená podobně jako 'chlapec'?", correct: "kluk", distractors: ["dívka", "člověk"], emoji: "👦", hint: "Chlapce ve třídě nazýváme dvěma slovy — jedno formální (jako v knize), druhé hovorové (jako na hřišti).", solution: "'Chlapec' a 'kluk' jsou souznačná slova (synonyma) — znamenají totéž, jen jedno je formálnější." },
  { question: "Které slovo znamená podobně jako 'dívka'?", correct: "holka", distractors: ["chlapec", "žena"], emoji: "👧", hint: "Dívku ve třídě nazýváme dvěma slovy — jedno formální, druhé hovorové.", solution: "'Dívka' a 'holka' jsou souznačná slova (synonyma) — znamenají totéž, jen jedno je formálnější." },
  { question: "Které slovo znamená podobně jako 'pěkný'?", correct: "hezký", distractors: ["ošklivý", "velký"], emoji: "😊", hint: "Pěkný domeček je také...", solution: "'Pěkný' a 'hezký' jsou souznačná slova (synonyma) — mají podobný nebo stejný význam." },
  { question: "Jaký je opak slova 'přijít'?", correct: "odejít", distractors: ["sedět", "stát"], emoji: "🚶", hint: "Tatínek přišel domů z práce. Ráno z domova...", solution: "Opak slova 'přijít' je 'odejít' — přijít a odejít jsou protikladná slova." },
];

// L3: Synonyma méně zřejmá + jemnější rozlišení protiklad vs. synonymum
const POOL_L3: PoolItem[] = [
  { question: "Které slovo znamená podobně jako 'auto'?", correct: "vůz", distractors: ["vlak", "kolo"], emoji: "🚗", hint: "Auto máme v garáži — jiné, trochu starší slovo pro auto je...", solution: "'Auto' a 'vůz' jsou souznačná slova (synonyma) — označují stejný dopravní prostředek." },
  { question: "Které slovo znamená podobně jako 'dívat se'?", correct: "koukat", distractors: ["slyšet", "jíst"], emoji: "👀", hint: "Dívám se na televizi — jinak řečeno...", solution: "'Dívat se' a 'koukat' jsou souznačná slova (synonyma) — mají stejný nebo velmi podobný význam." },
  { question: "Které slovo znamená podobně jako 'malý'?", correct: "drobný", distractors: ["velký", "starý"], emoji: "🐭", hint: "Myš je malá. Říkáme také, že myš je...", solution: "'Malý' a 'drobný' jsou souznačná slova (synonyma) — mají podobný nebo stejný význam." },
  { question: "Které slovo znamená podobně jako 'říkat'?", correct: "mluvit", distractors: ["psát", "kreslit"], emoji: "🗣️", hint: "Říkám básničku — jinak řečeno...", solution: "'Říkat' a 'mluvit' jsou souznačná slova (synonyma) — mají podobný nebo stejný význam." },
  { question: "Které slovo znamená podobně jako 'velice'?", correct: "moc", distractors: ["trochu", "pomalu"], emoji: "💪", hint: "Velice mě to baví — jinak řečeno, baví mě to...", solution: "'Velice' a 'moc' jsou souznačná slova (synonyma) — obojí vyjadřuje vysokou míru." },
  { question: "Slova 'rychlý' a 'pomalý' jsou...", correct: "protikladná (antonyma)", distractors: ["souznačná (synonyma)", "příbuzná"], emoji: "🔁", hint: "Rychlý a pomalý mají opačný, nebo podobný význam?", solution: "'Rychlý' a 'pomalý' mají opačný význam — jsou to protikladná slova (antonyma)." },
  { question: "Slova 'chlapec' a 'kluk' jsou...", correct: "souznačná (synonyma)", distractors: ["protikladná (antonyma)", "příbuzná"], emoji: "🔄", hint: "Chlapec a kluk — mají opačný, nebo podobný/stejný význam?", solution: "'Chlapec' a 'kluk' znamenají totéž — jsou to souznačná slova (synonyma)." },
  { question: "Které slovo znamená podobně jako 'spěchat'?", correct: "pospíchat", distractors: ["odpočívat", "sedět"], emoji: "🏃", hint: "Spěchám do školy — jinak řečeno...", solution: "'Spěchat' a 'pospíchat' jsou souznačná slova (synonyma) — obojí vyjadřuje rychlý pohyb s nutností dorazit včas." },
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

export const SLOVAPROTIKLADNA: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-slovni-zasoba-slova-protikladna-a-souznacna",
    rvpNodeId: "g2-cjl-jazykova-vychova-slovni-zasoba-slova-protikladna-a-souznacna",
    title: "Slova protikladná a souznačná",
    studentTitle: "Protiklady a synonyma",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Slovní zásoba",
    briefDescription: "Naučíš se slova opačného a podobného významu.",
    keywords: ["protikladná", "souznačná", "antonyma", "synonyma", "velký malý", "chlapec kluk"],
    goals: [
      "Vědět, co jsou protikladná slova (antonyma).",
      "Vědět, co jsou souznačná slova (synonyma).",
      "Najít opak nebo synonymum k zadanému slovu.",
    ],
    boundaries: ["Pouze základní slova 2. třídy.", "Bez kontextových synonym."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Protikladná = opačný význam (velký × malý). Souznačná = podobný/stejný význam (chlapec = kluk).",
      steps: ["Přečti otázku.", "Hledáš opak nebo synonymum?", "Vyber slovo, které opačně nebo stejně znamená."],
      commonMistake: "Záměna protikladu a synonyma — 'velký × malý' je protiklad, 'velký = obrovský' je synonymum.",
      example: "Opak 'rychlý' → 'pomalý'. Synonymum 'chlapec' → 'kluk'.",
    },
  },
];
