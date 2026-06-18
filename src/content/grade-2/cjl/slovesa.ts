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

// L1: Definice slovesa + identifikace slovesa ze tří izolovaných slov
const POOL_L1: PoolItem[] = [
  { question: "Co označuje sloveso?", correct: "Děj nebo stav", distractors: ["Věc nebo osobu", "Vlastnost věci"], emoji: "📝", hint: "Sloveso říká, co někdo DĚLÁ nebo jak STOJÍ věci — dělá, spí, je, stojí.", solution: "Sloveso označuje děj nebo stav — říká, co osoba nebo věc dělá (běží, čte) nebo jak je (je nemocný, leží)." },
  { question: "Která slova jsou slovesa?", correct: "Slova označující činnost nebo stav", distractors: ["Slova označující věci", "Slova označující vlastnosti"], emoji: "📖", hint: "Sloveso říká, co se děje nebo co se dělá — ne co to je nebo jaké to je.", solution: "Slovesa označují činnost nebo stav — říkají, co osoby nebo věci dělají nebo jak jsou." },
  { question: "Které slovo je sloveso: 'pes', 'běhá', 'rychlý'?", correct: "běhá", distractors: ["pes", "rychlý"], emoji: "🐕", hint: "'Pes' je věc, 'rychlý' je vlastnost — co zbývá? Co dělá pes?", solution: "Sloveso je 'běhá' — říká, co pes dělá. 'Pes' je věc (podstatné jméno), 'rychlý' je vlastnost (přídavné jméno)." },
  { question: "Které slovo je sloveso: 'škola', 'učit', 'velký'?", correct: "učit", distractors: ["škola", "velký"], emoji: "🏫", hint: "'Škola' je věc, 'velký' je vlastnost — co zbývá? Co se v škole dělá?", solution: "Sloveso je 'učit' — říká, co se dělá. 'Škola' je věc, 'velký' je vlastnost." },
  { question: "Které slovo je sloveso: 'řeka', 'teče', 'modrá'?", correct: "teče", distractors: ["řeka", "modrá"], emoji: "🏞️", hint: "'Řeka' je věc, 'modrá' je vlastnost — co zbývá? Co řeka dělá?", solution: "Sloveso je 'teče' — říká, co řeka dělá. 'Řeka' je věc, 'modrá' je vlastnost." },
  { question: "Které slovo je sloveso: 'domeček', 'pěkný', 'hrát'?", correct: "hrát", distractors: ["domeček", "pěkný"], emoji: "🏠", hint: "'Domeček' je věc, 'pěkný' je vlastnost — co zbývá? Co děti dělají?", solution: "Sloveso je 'hrát' — říká, co děti dělají. 'Domeček' je věc, 'pěkný' je vlastnost." },
  { question: "Které slovo je sloveso: 'zpívat', 'píseň', 'hlasitý'?", correct: "zpívat", distractors: ["píseň", "hlasitý"], emoji: "🎵", hint: "'Píseň' je věc, 'hlasitý' je vlastnost — co zbývá? Co zpěvák dělá?", solution: "Sloveso je 'zpívat' — říká, co zpěvák dělá. 'Píseň' je věc, 'hlasitý' je vlastnost." },
  { question: "Které slovo je sloveso: 'okno', 'zavřít', 'nové'?", correct: "zavřít", distractors: ["okno", "nové"], emoji: "🪟", hint: "'Okno' je věc, 'nové' je vlastnost — co zbývá? Co s oknem můžeme dělat?", solution: "Sloveso je 'zavřít' — říká, co se dělá. 'Okno' je věc, 'nové' je vlastnost." },
];

// L2: Hledání slovesa v jednoduché větě
const POOL_L2: PoolItem[] = [
  { question: "Co dělá pes ve větě 'Pes skáče přes plot.'?", correct: "skáče", distractors: ["pes", "plot"], emoji: "🐕", hint: "Hledáme slovo, které říká, co pes DĚLÁ — ne co pes je.", solution: "Ve větě 'Pes skáče přes plot.' je sloveso 'skáče' — říká, co pes dělá." },
  { question: "Co dělá máma ve větě 'Máma vaří polévku.'?", correct: "vaří", distractors: ["máma", "polévku"], emoji: "🍲", hint: "Hledáme slovo, které říká, co máma DĚLÁ.", solution: "Ve větě 'Máma vaří polévku.' je sloveso 'vaří' — říká, co máma dělá." },
  { question: "Co dělá žák ve větě 'Žák čte knihu.'?", correct: "čte", distractors: ["žák", "knihu"], emoji: "📖", hint: "Hledáme slovo, které říká, co žák DĚLÁ.", solution: "Ve větě 'Žák čte knihu.' je sloveso 'čte' — říká, co žák dělá." },
  { question: "Co dělá vítr ve větě 'Vítr fouká.'?", correct: "fouká", distractors: ["vítr", "silně"], emoji: "💨", hint: "Hledáme slovo, které říká, co vítr DĚLÁ.", solution: "Ve větě 'Vítr fouká.' je sloveso 'fouká' — říká, co vítr dělá." },
  { question: "Co dělají ptáci ve větě 'Ptáci letí do teplých krajů.'?", correct: "letí", distractors: ["ptáci", "krajů"], emoji: "🐦", hint: "Hledáme slovo, které říká, co ptáci DĚLAJÍ.", solution: "Ve větě 'Ptáci letí do teplých krajů.' je sloveso 'letí' — říká, co ptáci dělají." },
  { question: "Co dělá kočka ve větě 'Kočka sedí na střeše.'?", correct: "sedí", distractors: ["kočka", "střeše"], emoji: "🐱", hint: "Hledáme slovo, které říká, co kočka DĚLÁ nebo jak se nachází.", solution: "Ve větě 'Kočka sedí na střeše.' je sloveso 'sedí' — říká, jak se kočka nachází." },
  { question: "Co dělá slunce ve větě 'Slunce svítí.'?", correct: "svítí", distractors: ["slunce", "jasně"], emoji: "☀️", hint: "Hledáme slovo, které říká, co slunce DĚLÁ.", solution: "Ve větě 'Slunce svítí.' je sloveso 'svítí' — říká, co slunce dělá." },
  { question: "Co dělá Tomáš ve větě 'Tomáš píše dopis.'?", correct: "píše", distractors: ["Tomáš", "dopis"], emoji: "✏️", hint: "Hledáme slovo, které říká, co Tomáš DĚLÁ.", solution: "Ve větě 'Tomáš píše dopis.' je sloveso 'píše' — říká, co Tomáš dělá." },
];

// L3: Delší / složitější věty + rozlišení slovesa od podobných slov (zpěv vs. zpívat)
const POOL_L3: PoolItem[] = [
  { question: "Co dělá dítě ve větě 'Dítě stojí u okna a dívá se ven.'?", correct: "stojí", distractors: ["dítě", "okna"], emoji: "🧒", hint: "Ve větě jsou dvě slovesa — vyber to první. Co dítě dělá u okna?", solution: "Ve větě je sloveso 'stojí' — říká, jak se dítě nachází. Druhé sloveso 'dívá se' by bylo také správně." },
  { question: "Co označuje slovo 'spát'?", correct: "Co osoba dělá (děj)", distractors: ["Věc nebo osobu", "Vlastnost"], emoji: "😴", hint: "Spát je to, co děláme v noci — popisuje DĚJ nebo STAV.", solution: "Slovo 'spát' je sloveso — označuje děj (stav spánku), který osoba nebo živočich prožívá." },
  { question: "Co dělá dítě ve větě 'Dítě smát se', nebo říká 'radost'? — Které slovo je sloveso: 'radost', 'smát se', 'veselý'?", correct: "smát se", distractors: ["radost", "veselý"], emoji: "😄", hint: "'Radost' je věc, 'veselý' je vlastnost — co zbývá? Co děláme, když jsme veselí?", solution: "Sloveso je 'smát se' — říká, co děláme. 'Radost' je věc, 'veselý' je vlastnost." },
  { question: "Které slovo je sloveso: 'zpěv', 'zpívat', 'zpěvný'?", correct: "zpívat", distractors: ["zpěv", "zpěvný"], emoji: "🎶", hint: "'Zpěv' je věc (co slyšíme), 'zpěvný' je vlastnost — co dělá zpěvák?", solution: "Sloveso je 'zpívat' — říká, co zpěvák dělá. 'Zpěv' je podstatné jméno (věc), 'zpěvný' je přídavné jméno (vlastnost)." },
  { question: "Které slovo je sloveso: 'běh', 'běhat', 'rychlý'?", correct: "běhat", distractors: ["běh", "rychlý"], emoji: "🏃", hint: "'Běh' je věc (název činnosti), 'rychlý' je vlastnost — co dělá závodník?", solution: "Sloveso je 'běhat' — říká, co závodník dělá. 'Běh' je podstatné jméno (věc), 'rychlý' je přídavné jméno (vlastnost)." },
  { question: "Které slovo je sloveso: 'skok', 'skočit', 'vysoký'?", correct: "skočit", distractors: ["skok", "vysoký"], emoji: "🤸", hint: "'Skok' je věc (výsledek), 'vysoký' je vlastnost — co sportovec udělá?", solution: "Sloveso je 'skočit' — říká, co sportovec udělá. 'Skok' je podstatné jméno, 'vysoký' je přídavné jméno." },
  { question: "Jaké sloveso najdeš ve větě 'Starý pes leží u dveří a spí.'?", correct: "leží", distractors: ["starý", "pes"], emoji: "🐶", hint: "Ve větě jsou dvě slovesa. Vyber to první — co pes dělá u dveří?", solution: "První sloveso je 'leží' — říká, jak se pes nachází. 'Starý' je vlastnost, 'pes' je věc." },
  { question: "Které slovo je sloveso: 'smích', 'smát se', 'smějící'?", correct: "smát se", distractors: ["smích", "smějící"], emoji: "😂", hint: "'Smích' je věc, 'smějící' je vlastnost (přídavné jméno) — co děláme, když nám je veselo?", solution: "Sloveso je 'smát se' — říká, co děláme. 'Smích' je podstatné jméno (věc), 'smějící' je přídavné jméno (vlastnost)." },
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

export const SLOVESA: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-tvaroslovi-slovesa-rozliseni-slovesneho-druhu",
    rvpNodeId: "g2-cjl-jazykova-vychova-tvaroslovi-slovesa-rozliseni-slovesneho-druhu",
    title: "Slovesa (rozlišení slovesného druhu)",
    studentTitle: "Slovesa",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Naučíš se poznat sloveso ve větě.",
    keywords: ["sloveso", "děj", "stav", "věta", "běžet", "sedět", "číst"],
    goals: [
      "Vědět, že sloveso označuje děj nebo stav.",
      "Poznat sloveso ve větě.",
      "Odlišit sloveso od podstatného a přídavného jména.",
    ],
    boundaries: ["Pouze rozlišení slovesa.", "Bez časování a tvarů."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Sloveso říká, co osoba nebo věc DĚLÁ nebo JAK SE NACHÁZÍ.",
      steps: ["Přečti větu nebo tři slova.", "Které slovo říká, co se dělá nebo děje?", "To je sloveso."],
      commonMistake: "Záměna slovesa s podstatným jménem — 'zpěv' je věc, 'zpívat' je sloveso.",
      example: "Pes (věc) / rychlý (vlastnost) / běhá (sloveso — co pes dělá?).",
    },
  },
];
