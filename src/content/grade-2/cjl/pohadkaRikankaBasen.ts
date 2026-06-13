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
  // Definice žánrů
  { question: "Co je pohádka?", correct: "Příběh s kouzelnou nebo nadpřirozenou postavou", distractors: ["Báseň s rýmem", "Krátký hádankový text"], emoji: "🧚", hint: "V pohádce se děje magie — mohou mluvit zvířata, jsou tam čarodějnice nebo kouzelné předměty.", solution: "Pohádka je příběh s kouzelnou nebo nadpřirozenou postavou — například čarodějnicí, skřítkem nebo mluvícím zvířetem." },
  { question: "Co je říkanka?", correct: "Krátký text s rýmem, určený k recitaci nebo hře", distractors: ["Dlouhý příběh bez rýmu", "Záhadný text s otázkou na konci"], emoji: "🎵", hint: "Říkankám se říká pro zábavu nebo při hrách — jsou krátké a rýmují se.", solution: "Říkanka je krátký text s rýmem určený k recitaci nebo hrám — například 'Kolo, kolo mlýnské...'." },
  { question: "Co je báseň?", correct: "Text s rýmem a rytmem", distractors: ["Příběh s pohádkovou bytostí", "Otázka s nápovědou"], emoji: "📜", hint: "Báseň se rýmuje — konce řádků znějí podobně. Kdo píše básně?", solution: "Báseň je text s rýmem a rytmem — konce řádků se rýmují a text se hezky čte nahlas." },
  { question: "Co je hádanka?", correct: "Text, který popisuje věc tak, aby ji čtenář uhodl", distractors: ["Příběh se šťastným koncem", "Báseň bez rýmu"], emoji: "🔍", hint: "Na konci hádanky se ptáme — 'Co je to?' Hádanky hádáme, co popisují.", solution: "Hádanka je text, který popisuje věc tak, aby ji čtenář uhodl — na konci se ptá 'Co je to?'" },
  // Vlastnosti pohádky
  { question: "Co se v pohádce typicky stane na konci?", correct: "Dobro zvítězí nad zlem", distractors: ["Hlavní hrdina zemře", "Všechny postavy jsou zlé"], emoji: "🧚", hint: "V pohádkách bojují hodné a zlé postavy — kdo obvykle vyhraje?", solution: "V pohádce typicky na konci dobro zvítězí nad zlem — hodný hrdina vyhraje a zlo je potrestáno." },
  { question: "Jak pohádky obvykle začínají?", correct: "Byl jednou jeden... nebo Za devatero horami...", distractors: ["Bylo nebylo...", "Dnes se stalo..."], emoji: "📖", hint: "Pohádkový začátek uvádí nás do dávných dob nebo vzdálených zemí — jak zní?", solution: "Pohádky začínají frázemi jako 'Byl jednou jeden...' nebo 'Za devatero horami...' — uvádí nás do pohádkové doby." },
  { question: "Co je typické pro rýmovačku nebo říkanku?", correct: "Konce řádků se rýmují", distractors: ["Vždy popisuje zvíře", "Vždy klade otázku"], emoji: "🎵", hint: "Říkanka: 'Kolo, kolo mlýnské...' — všimni si, jak konce řádků znějí podobně.", solution: "V říkankách se konce řádků rýmují — to je jejich typický znak. Díky tomu se hezky říkají nahlas." },
  // Rozpoznání žánru
  { question: "Jak se jmenuje text, kde zvíře mluví a pomáhá hrdinovi?", correct: "Pohádka", distractors: ["Říkanka", "Hádanka"], emoji: "🧚", hint: "V běžném životě zvířata nemluví — ale v jednom žánru mluvit mohou.", solution: "Text, kde zvíře mluví, je pohádka — v pohádkách mohou zvířata mluvit, protože jsou kouzelná." },
  { question: "Jak se jmenuje krátký text: 'Červená, žlutá, zelená — stopka, propouštění, jedem'?", correct: "Říkanka", distractors: ["Pohádka", "Hádanka"], emoji: "🎵", hint: "Text je krátký, rýmuje se a opakuje se při hře nebo pohybu — jaký to je žánr?", solution: "Krátký rýmovaný text pro hru nebo pohyb je říkanka — říká se při hrách nebo jako básnička pro zábavu." },
  { question: "Jak se jmenuje text: 'Mám čtyři nohy a nenesu břemena, chodím po světě bez sedla i bez jhmena. Co jsem?'?", correct: "Hádanka", distractors: ["Pohádka", "Říkanka"], emoji: "🔍", hint: "Text popisuje věc záhadnými slovy a na konci se ptá 'Co jsem?' — jaký to je žánr?", solution: "Text s popisem a otázkou 'Co jsem?' je hádanka — hádáme, co záhadně popisuje." },
  { question: "Jak se jmenuje text s rýmem, který čteme a zažíváme jako obraz nebo pocit?", correct: "Báseň", distractors: ["Pohádka", "Hádanka"], emoji: "📜", hint: "Básně nám vyvolávají pocity nebo obrazy — jsou kratší než příběhy a rýmují se.", solution: "Text s rýmem, který vyvolává pocity nebo obrazy, je báseň — básníci ji píšou, my ji čteme nebo recitujeme." },
  { question: "Co má pohádka, říkanka, báseň i hádanka společného?", correct: "Jsou to literární žánry", distractors: ["Vždy se rýmují", "Vždy mají šťastný konec"], emoji: "📚", hint: "Všechny jsou různé typy textů, které čteme nebo posloucháme — jak je souhrnně nazýváme?", solution: "Pohádka, říkanka, báseň i hádanka jsou literární žánry — různé typy literárních textů." },
  // Kdo tvoří pohádky a básně
  { question: "Kdo píše básně?", correct: "Básník nebo básnířka", distractors: ["Fyzik", "Kuchař"], emoji: "✍️", hint: "Básně jsou umělecká díla — kdo je tvoří a jak mu říkáme?", solution: "Básně píše básník nebo básnířka — lidé, kteří umělecky tvoří rýmované texty." },
  { question: "Kde si půjčíme pohádkovou knížku?", correct: "V knihovně", distractors: ["V nemocnici", "Na poště"], emoji: "📚", hint: "Pohádkové knížky jsou v místě, kde se půjčují knihy — kde to je?", solution: "Pohádkovou knížku si půjčíme v knihovně — tam jsou knihy seřazené a lze si je půjčit." },
  { question: "Kdo jsou typické pohádkové postavy?", correct: "Princ, čarodějnice, trpaslík", distractors: ["Policista, kuchař, řidič", "Sůl, mouka, voda"], emoji: "🧙", hint: "Pohádkové postavy mají nadpřirozené vlastnosti nebo jsou z kouzelného světa — vzpomeň na pohádky.", solution: "Typické pohádkové postavy jsou princ, čarodějnice nebo trpaslík — jsou kouzelní nebo žijí v pohádkovém světě." },
  { question: "Jak pohádky obvykle končí?", correct: "Šťastným koncem", distractors: ["Hrozivě", "Bez konce"], emoji: "🌟", hint: "Na konci pohádky se vše spravedlivě vyřeší — dobro vyhraje a všichni jsou...", solution: "Pohádky obvykle končí šťastným koncem — dobro zvítězí a hrdinové žijí šťastně." },
  { question: "Proč se říkanka opakuje?", correct: "Aby se lépe zapamatovala a zpívala", distractors: ["Protože je moc krátká", "Protože je smutná"], emoji: "🔄", hint: "Říkanky a písničky pro děti se opakují — proč?", solution: "Říkanka se opakuje, aby se lépe zapamatovala a zpívala — opakování pomáhá zapamatovat si slova." },
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
      explanation: item.solution,
    };
  });
}

export const POHADKARIKANKABASEN: TopicMetadata[] = [
  {
    id: "g2-cjl-literarni-vychova-literarni-zanry-pohadka-rikanky-basen-hadanka",
    rvpNodeId: "g2-cjl-literarni-vychova-literarni-zanry-pohadka-rikanky-basen-hadanka",
    title: "Pohádka, říkanka, báseň, hádanka",
    studentTitle: "Pohádky a básně",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární žánry",
    briefDescription: "Poznáš pohádku, říkanku, báseň a hádanku.",
    keywords: ["pohádka", "říkanka", "báseň", "hádanka", "literární žánr", "rým"],
    goals: [
      "Rozlišit pohádku, říkanku, báseň a hádanku.",
      "Vědět, co je typické pro každý žánr.",
    ],
    boundaries: ["Pouze základní literární žánry pro 2. třídu.", "Bez složité literární teorie."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Pohádka = příběh s kouzlem. Říkanka = krátký rýmovaný text pro hru. Báseň = rým a pocit. Hádanka = co je to?",
      steps: ["Přečti popis nebo ukázku.", "Má příběh a kouzlo? → pohádka.", "Kratičký rýmek pro hru? → říkanka.", "Rýmovaný text s pocitem? → báseň.", "Popisuje a ptá se 'co je to'? → hádanka."],
      commonMistake: "Záměna říkanky a básně — říkanka je pro hry a opakuje se, báseň je umělecký text s hlubším obsahem.",
      example: "Byl jednou jeden... → pohádka. Kolo, kolo mlýnské → říkanka. Mám čtyři nohy, co jsem? → hádanka.",
    },
  },
];
