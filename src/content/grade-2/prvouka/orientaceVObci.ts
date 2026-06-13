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
  { question: "Kam jdeme pro chleba?", correct: "Obchod", distractors: ["Škola", "Hřiště"], emoji: "🏪", hint: "Chleba, mléko a jídlo koupíme v...", solution: "Pro chleba jdeme do obchodu — tam prodávají potraviny a další zboží." },
  { question: "Kde se učíme?", correct: "Škola", distractors: ["Obchod", "Pošta"], emoji: "🏫", hint: "Chodíme tam každý den a sedíme ve třídě.", solution: "Učíme se ve škole — tam nás učitelé naučí číst, psát a počítat." },
  { question: "Kam jdeme, když jsme nemocní?", correct: "Lékař", distractors: ["Hřiště", "Obchod"], emoji: "🏥", hint: "Když nás bolí hlava nebo máme teplotu, potřebujeme pomoc — ke komu jdeme?", solution: "Když jsme nemocní, jdeme k lékaři — vyšetří nás a předepíše lék." },
  { question: "Kde si hrajeme?", correct: "Hřiště", distractors: ["Pošta", "Lékař"], emoji: "🛝", hint: "Venku je místo s prolézačkami, houpačkami a pískovištěm — kde to je?", solution: "Hrajeme si na hřišti — tam jsou houpačky, prolézačky a pískoviště." },
  { question: "Kam jdeme poslat nebo vyzvednout zásilku?", correct: "Pošta", distractors: ["Škola", "Hřiště"], emoji: "📮", hint: "Dopisy a balíky si vyzvedneme nebo pošleme na...", solution: "Zásilky vyzvedneme nebo pošleme na poště — tam doručují dopisy a balíky." },
  { question: "Kde si půjčíme knihu?", correct: "Knihovna", distractors: ["Obchod", "Pošta"], emoji: "📚", hint: "Knihy si tam půjčujeme a vracíme — jak se to místo jmenuje?", solution: "Knihu si půjčíme v knihovně — zdarma si tam vybereme knížky na čtení." },
  { question: "Odkud odjíždí vlak?", correct: "Nádraží", distractors: ["Hřiště", "Lékař"], emoji: "🚉", hint: "Vlaky odjíždějí a přijíždějí na zvláštní místo — kde to je?", solution: "Vlak odjíždí z nádraží — tam se vlaky zastavují a nastupují cestující." },
  { question: "Kde se modlíme?", correct: "Kostel", distractors: ["Obchod", "Hřiště"], emoji: "⛪", hint: "Lidé chodí na mši nebo se modlit do budovy s věží — jak se jmenuje?", solution: "Modlíme se v kostele — je to místo pro bohoslužby a modlitbu." },
  { question: "Kam jdeme cvičit?", correct: "Tělocvična", distractors: ["Pošta", "Obchod"], emoji: "🤸", hint: "Sportovní haly nebo tělocvičny jsou místa pro...", solution: "Na cvičení jdeme do tělocvičny — tam sportujeme uvnitř budovy." },
  { question: "Kde mají hasiči svá auta?", correct: "Hasičárna", distractors: ["Škola", "Pošta"], emoji: "🚒", hint: "Hasiči musí mít hasičská auta někde zaparkovaná a připravená — kde?", solution: "Hasičská auta jsou v hasičárně — odtud hasiči vyjíždějí na zásah." },
  { question: "Kam jdeme pro léky?", correct: "Lékárna", distractors: ["Hřiště", "Škola"], emoji: "💊", hint: "Lék nám předepíše doktor, ale kde ho koupíme?", solution: "Pro léky jdeme do lékárny — tam nám vydají léky předepsané lékařem." },
  { question: "Kde plaveme?", correct: "Bazén", distractors: ["Obchod", "Pošta"], emoji: "🏊", hint: "Bazén je velká nádrž s vodou — kde ho najdeme?", solution: "Plaveme v bazénu — je to krytý nebo venkovní bazén s vodou." },
  { question: "Kde vyřizujeme obecní záležitosti?", correct: "Radnice", distractors: ["Hřiště", "Obchod"], emoji: "🏛️", hint: "Obecní záležitosti, průkazy a různé dokumenty vyřizujeme na...", solution: "Obecní záležitosti vyřizujeme na radnici — tam se rozhoduje o věcech v obci." },
  { question: "Kde koupíme rohlík?", correct: "Pekárna", distractors: ["Škola", "Pošta"], emoji: "🥐", hint: "Pečivo, jako jsou rohlíky a chleby, se peče a prodává v...", solution: "Rohlík koupíme v pekárně — tam pekař peče a prodává čerstvé pečivo." },
  { question: "Kam jdeme na film?", correct: "Kino", distractors: ["Obchod", "Lékař"], emoji: "🎬", hint: "Filmy se promítají na velké plátno — kam za nimi jdeme?", solution: "Na film jdeme do kina — filmy se tam promítají na velkém plátně." },
  { question: "Kde si dáme oběd v restauraci?", correct: "Restaurace", distractors: ["Škola", "Pošta"], emoji: "🍽️", hint: "Jídlo si objednáme a obsluha ho přinese — kde to je?", solution: "Oběd si dáme v restauraci — personál nám donese jídlo." },
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
      solutionSteps: [item.solution],
    };
  });
}

export const ORIENTACEVOBCI: TopicMetadata[] = [
  {
    id: "g2-prv-orientace-obec",
    rvpNodeId: "g2-prvouka-misto-kde-zijeme-obec-a-okoli-orientace-v-obci-vyznamna-mista-instituce",
    title: "Orientace v obci, významná místa, instituce",
    studentTitle: "Místa v obci",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Obec a okolí",
    briefDescription: "Poznáš důležitá místa v obci.",
    keywords: ["obec", "škola", "obchod", "pošta", "lékař", "knihovna"],
    goals: [
      "Poznat důležitá místa v obci.",
      "Vědět, kam jít pro co.",
      "Orientovat se v okolí.",
    ],
    boundaries: ["Pouze běžné instituce.", "Bez map."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Pro každou věc je v obci jiné místo.",
      steps: ["Přečti otázku.", "Kam za tím jdeme?"],
      commonMistake: "Záměna podobných míst (pošta vs. obchod).",
      example: "Pro chleba jdeme do obchodu, učíme se ve škole.",
    },
  },
];
