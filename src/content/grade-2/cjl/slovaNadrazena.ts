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

// L1: Přiřazení nadřazeného pojmu ke skupině slov + základní definice nadřazené/podřazené
const POOL_L1: PoolItem[] = [
  { question: "Jak se jmenuje obecnější (zastřešující) slovo?", correct: "Nadřazené slovo", distractors: ["Podřazené slovo", "Souřadné slovo"], emoji: "📖", hint: "Slovo 'zvíře' patří nad 'pes' a 'kočku' — je to slovo ...", solution: "Obecnější (zastřešující) slovo se jmenuje nadřazené — 'zvíře' je nadřazené ke slovům 'pes' a 'kočka'." },
  { question: "Jak se jmenuje konkrétnější slovo pod nadřazeným?", correct: "Podřazené slovo", distractors: ["Nadřazené slovo", "Souřadné slovo"], emoji: "📖", hint: "'Pes' patří pod 'zvíře' — je to slovo ...", solution: "Konkrétnější slovo pod nadřazeným se jmenuje podřazené — 'pes' je podřazené ke slovu 'zvíře'." },
  { question: "Jaké je nadřazené slovo pro 'pes', 'kočka', 'králík'?", correct: "Zvíře", distractors: ["Hračka", "Nábytek"], emoji: "🐾", hint: "Co mají pes, kočka a králík společného — pod jakou skupinu patří?", solution: "Nadřazené slovo pro 'pes', 'kočka' a 'králík' je 'zvíře' — všichni jsou zvířata." },
  { question: "Jaké je nadřazené slovo pro 'jablko', 'hruška', 'třešeň'?", correct: "Ovoce", distractors: ["Zelenina", "Květ"], emoji: "🍎", hint: "Co mají jablko, hruška a třešeň společného — pod jakou skupinu patří?", solution: "Nadřazené slovo pro 'jablko', 'hruška' a 'třešeň' je 'ovoce' — všechny jsou ovoce." },
  { question: "Jaké je nadřazené slovo pro 'červená', 'modrá', 'žlutá'?", correct: "Barva", distractors: ["Číslo", "Zvuk"], emoji: "🎨", hint: "Co mají červená, modrá a žlutá společného — pod jakou skupinu patří?", solution: "Nadřazené slovo pro 'červená', 'modrá' a 'žlutá' je 'barva' — všechny jsou barvy." },
  { question: "Jaké je nadřazené slovo pro 'stůl', 'židle', 'skříň'?", correct: "Nábytek", distractors: ["Hračka", "Oblečení"], emoji: "🪑", hint: "Co mají stůl, židle a skříň společného — pod jakou skupinu patří?", solution: "Nadřazené slovo pro 'stůl', 'židle' a 'skříň' je 'nábytek' — všechny jsou kusy nábytku." },
  { question: "Jaké je nadřazené slovo pro 'pondělí', 'pátek', 'neděle'?", correct: "Den v týdnu", distractors: ["Měsíc", "Hodina"], emoji: "📅", hint: "Co mají pondělí, pátek a neděle společného — pod jakou skupinu patří?", solution: "Nadřazené slovo pro 'pondělí', 'pátek' a 'neděle' je 'den v týdnu' — všechny jsou dny v týdnu." },
  { question: "Jaké je nadřazené slovo pro 'leden', 'únor', 'březen'?", correct: "Měsíc", distractors: ["Den v týdnu", "Roční období"], emoji: "📆", hint: "Co mají leden, únor a březen společného — pod jakou skupinu patří?", solution: "Nadřazené slovo pro 'leden', 'únor' a 'březen' je 'měsíc' — jsou to měsíce v roce." },
];

// L2: Výběr podřazeného slova (Co patří pod danou skupinu?)
const POOL_L2: PoolItem[] = [
  { question: "Co patří pod skupinu 'ovoce'?", correct: "jablko", distractors: ["mrkev", "fazole"], emoji: "🍎", hint: "Ovoce rostou na stromech nebo keřích a jsou sladká — co z možností je ovoce?", solution: "Pod skupinu 'ovoce' patří 'jablko' — jablko je ovoce. Mrkev a fazole jsou zelenina." },
  { question: "Co patří pod skupinu 'nábytek'?", correct: "stůl", distractors: ["hrnek", "hrnec"], emoji: "🪑", hint: "Nábytek je v bytě nebo škole a sedíme na něm nebo odkládáme věci — co z možností je nábytek?", solution: "Pod skupinu 'nábytek' patří 'stůl' — stůl je nábytek. Hrnek a hrnec jsou nádobí." },
  { question: "Co patří pod skupinu 'barva'?", correct: "modrá", distractors: ["tvrdý", "rychlý"], emoji: "🎨", hint: "Barvy vidíme okem a mají název — co z možností je barva?", solution: "Pod skupinu 'barva' patří 'modrá' — modrá je barva. 'Tvrdý' a 'rychlý' jsou vlastnosti." },
  { question: "Co patří pod skupinu 'zelenina'?", correct: "mrkev", distractors: ["jablko", "jahoda"], emoji: "🥕", hint: "Zelenina roste v zemi nebo na poli a není sladká — co z možností je zelenina?", solution: "Pod skupinu 'zelenina' patří 'mrkev' — mrkev je zelenina. Jablko a jahoda jsou ovoce." },
  { question: "Co patří pod skupinu 'dopravní prostředek'?", correct: "autobus", distractors: ["hrnek", "kabát"], emoji: "🚌", hint: "Dopravní prostředek nás přepraví z místa na místo — co z možností je dopravní prostředek?", solution: "Pod skupinu 'dopravní prostředek' patří 'autobus' — autobus nás přepraví. Hrnek a kabát to nejsou." },
  { question: "Co patří pod skupinu 'hudební nástroj'?", correct: "housle", distractors: ["zpěv", "melodie"], emoji: "🎻", hint: "Hudební nástroj je fyzická věc, na kterou hrajeme — co z možností je hudební nástroj?", solution: "Pod skupinu 'hudební nástroj' patří 'housle' — housle jsou hudební nástroj. 'Zpěv' a 'melodie' nejsou nástroje." },
  { question: "Co patří pod skupinu 'zvíře'?", correct: "slon", distractors: ["strom", "kámen"], emoji: "🐘", hint: "Zvíře je živý tvor, který se pohybuje — co z možností je zvíře?", solution: "Pod skupinu 'zvíře' patří 'slon' — slon je zvíře. Strom je rostlina a kámen je nerost." },
  { question: "Co patří pod skupinu 'rostlina'?", correct: "tulipán", distractors: ["pes", "voda"], emoji: "🌷", hint: "Rostlina roste ze země, má kořeny a listy — co z možností je rostlina?", solution: "Pod skupinu 'rostlina' patří 'tulipán' — tulipán je rostlina (květ). Pes je zvíře a voda je kapalina." },
];

// L3: Souřadná slova (co-hyponyma) + méně obvyklé kategorie + jemnější meta-otázky
const POOL_L3: PoolItem[] = [
  { question: "Která slova jsou na stejné úrovni (souřadná)?", correct: "pes a kočka", distractors: ["pes a zvíře", "zvíře a živý"], emoji: "🐾", hint: "Hledáme dvě slova, která patří pod stejnou skupinu — obě jsou zvířata, nebo jedno je zvíře a druhé je skupina?", solution: "'Pes' a 'kočka' jsou souřadná slova — obě patří pod 'zvíře'. 'Pes a zvíře' souřadná nejsou — zvíře je nadřazené ke psu." },
  { question: "Která slova jsou na stejné úrovni (souřadná)?", correct: "léto a zima", distractors: ["léto a roční období", "zima a studená"], emoji: "🌸", hint: "Hledáme dvě slova, která jsou obě roční období — nebo jedno je roční období a druhé je skupina?", solution: "'Léto' a 'zima' jsou souřadná slova — obě jsou roční období. 'Léto a roční období' souřadná nejsou." },
  { question: "Co je podřazené slovo ke slovu 'zvíře'?", correct: "pes", distractors: ["živočich", "příroda"], emoji: "🐕", hint: "Podřazené slovo je konkrétnější — je to konkrétní druh zvířete.", solution: "Podřazené slovo ke 'zvíře' je 'pes' — pes je konkrétní druh zvířete a patří pod skupinu 'zvíře'. 'Živočich' a 'příroda' jsou ještě obecnější pojmy." },
  { question: "Která slova jsou souřadná ke slovu 'jablko'?", correct: "hruška a třešeň", distractors: ["ovoce a jablko", "jablko a strom"], emoji: "🍐", hint: "Souřadná slova patří pod stejnou skupinu jako 'jablko' — hledáme jiné druhy ovoce.", solution: "'Hruška' a 'třešeň' jsou souřadná ke 'jablku' — všechny patří pod skupinu 'ovoce'. 'Ovoce' je nadřazené a 'strom' je jiná kategorie." },
  { question: "Jaké je nadřazené slovo pro 'léto', 'zima', 'jaro'?", correct: "Roční období", distractors: ["Měsíc", "Den"], emoji: "🌸", hint: "Léto, zima a jaro jsou části roku — pod jakou skupinu patří?", solution: "Nadřazené slovo pro 'léto', 'zima' a 'jaro' je 'roční období' — jsou to roční období." },
  { question: "Co patří pod skupinu 'nádoba'?", correct: "hrnek", distractors: ["stůl", "tužka"], emoji: "🫖", hint: "Nádoba slouží k uchovávání nebo přenášení tekutin či potravin — co z možností je nádoba?", solution: "Pod skupinu 'nádoba' patří 'hrnek' — hrnek je nádoba na pití. Stůl je nábytek a tužka je psací potřeba." },
  { question: "Která dvojice slov je souřadná?", correct: "mrkev a cibule", distractors: ["mrkev a zelenina", "cibule a jídlo"], emoji: "🥕", hint: "Souřadná slova jsou na stejné úrovni — obě patří pod stejnou skupinu, žádné není nadřazené tomu druhému.", solution: "'Mrkev' a 'cibule' jsou souřadná — obě jsou zelenina. 'Mrkev a zelenina' souřadná nejsou, protože 'zelenina' je nadřazené ke 'mrkvi'." },
  { question: "Co je nadřazené slovo ke slovům 'psaní', 'čtení', 'počítání'?", correct: "školní dovednost", distractors: ["hra", "sport"], emoji: "✏️", hint: "Psaní, čtení a počítání se učíme ve škole — pod jakou skupinu patří?", solution: "Nadřazené slovo ke 'psaní', 'čtení' a 'počítání' je 'školní dovednost' — všechny jsou dovednosti, které se učíme ve škole. Hra a sport to nejsou." },
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

export const SLOVANADRAZENA: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-slovni-zasoba-slova-nadrazena-a-podrazena",
    rvpNodeId: "g2-cjl-jazykova-vychova-slovni-zasoba-slova-nadrazena-a-podrazena",
    title: "Slova nadřazená a podřazená",
    studentTitle: "Skupiny slov",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Slovní zásoba",
    briefDescription: "Naučíš se třídit slova do skupin.",
    keywords: ["nadřazené", "podřazené", "souřadné", "zvíře", "ovoce", "barva", "skupina slov"],
    goals: [
      "Rozlišit nadřazené a podřazené slovo.",
      "Přiřadit slova do správné skupiny.",
      "Pochopit, co jsou souřadná slova.",
    ],
    boundaries: ["Pouze základní kategorie 2. třídy.", "Bez víceúrovňového hierarchie."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Nadřazené = zastřešující (zvíře). Podřazené = konkrétní (pes, kočka). Souřadné = na stejné úrovni (pes a kočka).",
      steps: ["Přečti slova.", "Které je obecnější (zastřešující)?", "To je nadřazené; konkrétnější je podřazené."],
      commonMistake: "Záměna nadřazeného a podřazeného — 'zvíře' je nadřazené, 'pes' je podřazené.",
      example: "Zvíře (nadřazené) → pes, kočka, králík (podřazená). Pes a kočka jsou souřadná.",
    },
  },
];
