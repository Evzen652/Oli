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
  { question: "Kdo dává mléko?", correct: "Kráva", distractors: ["Slepice", "Včela"], emoji: "🐄", hint: "Mléko pijeme denně — z jakého zvířete pochází?", solution: "Mléko dává kráva — každý den ji zemědělec podojí." },
  { question: "Kdo snáší vejce?", correct: "Slepice", distractors: ["Ovce", "Kráva"], emoji: "🐔", hint: "Snídám vejce k snídani — které zvíře je snáší?", solution: "Vejce snáší slepice — snáší je každý den." },
  { question: "Kdo dává vlnu?", correct: "Ovce", distractors: ["Kráva", "Včela"], emoji: "🐑", hint: "Vlna je přírodní materiál na svetry a přikrývky — od kterého zvířete pochází?", solution: "Vlnu dává ovce — jednou ročně ji zemědělec ostříhá." },
  { question: "Kdo dává med?", correct: "Včela", distractors: ["Slepice", "Koza"], emoji: "🐝", hint: "Med je sladký a přírodní — které zvíře ho vyrábí z pylu?", solution: "Med dává včela — vyrábí ho z pylu v úlu." },
  { question: "Kdo hlídá dům?", correct: "Pes", distractors: ["Kočka", "Kráva"], emoji: "🐕", hint: "Které zvíře štěká na cizí lidi a chrání domov?", solution: "Dům hlídá pes — štěká na cizí lidi a chrání domov." },
  { question: "Kdo chytá myši?", correct: "Kočka", distractors: ["Pes", "Slepice"], emoji: "🐈", hint: "Myši mohou škodit v domě — které zvíře je chytá?", solution: "Myši chytá kočka — je to přirozený lovec hlodavců." },
  { question: "Kdo nosí lidi na hřbetě?", correct: "Kůň", distractors: ["Včela", "Slepice"], emoji: "🐴", hint: "Lidé jezdí na hřbetě zvířete — na hřbetu kterého?", solution: "Na hřbetě nosí kůň — lidé na něm jezdí nebo ho zapřahají do vozíků." },
  { question: "Kdo žije v chlívku?", correct: "Prase", distractors: ["Včela", "Kočka"], emoji: "🐖", hint: "Chlívek je malý domek pro hospodářské zvíře — pro které?", solution: "V chlívku žije prase — zemědělec ho chová pro maso." },
  { question: "Kdo dává kozí mléko?", correct: "Koza", distractors: ["Slepice", "Pes"], emoji: "🐐", hint: "Kozí mléko pochází od zvířete s rohy a bradkou — od jakého?", solution: "Kozí mléko dává koza — pije se jako alternativa kravského mléka." },
  { question: "Které zvíře ráno kokrhá?", correct: "Kohout", distractors: ["Kráva", "Ovce"], emoji: "🐓", hint: "Ráno na farmě je slyšet zvláštní volání — jaké zvíře ho vydává?", solution: "Ráno kokrhá kohout — jeho volání oznamuje začátek nového dne." },
  { question: "Kdo pluje na rybníku?", correct: "Kachna", distractors: ["Kůň", "Pes"], emoji: "🦆", hint: "Na rybníku vidíme ptáky, kteří kváčí a plavou — jací jsou to ptáci?", solution: "Na rybníku pluje kachna — je to vodní pták, který se chová na farmách." },
  { question: "Které zvíře vydává zvuk hý-há?", correct: "Osel", distractors: ["Kočka", "Včela"], emoji: "🫏", hint: "Osel je zvíře podobné koni, ale menší — jaký zvuk vydává?", solution: "Hý-há vydává osel — takové je jeho charakteristické volání." },
  { question: "Kdo dává hodně masa?", correct: "Prase", distractors: ["Včela", "Kočka"], emoji: "🐷", hint: "Z farmy pochází maso na různé pokrmy — ze kterého zvířete ho je nejvíce?", solution: "Hodně masa dává prase — chová se zejména pro výrobu šunky, salámu a dalších mas." },
  { question: "Kdo snáší velká husí vejce?", correct: "Husa", distractors: ["Pes", "Kočka"], emoji: "🦢", hint: "Velký bílý pták na farmě snáší velká vejce — který pták to je?", solution: "Husí vejce snáší husa — je to větší drůbež než slepice." },
  { question: "Kdo žije v úlu?", correct: "Včela", distractors: ["Slepice", "Koza"], emoji: "🐝", hint: "Úl je domeček pro společenský hmyz — pro koho?", solution: "V úlu žije včela — celá rodina včel bydlí v jednom úlu." },
  { question: "Jak se jmenuje samice kohouta?", correct: "Slepice", distractors: ["Kráva", "Ovce"], emoji: "🐔", hint: "Kohout je samec — jak se jmenuje samice téhož zvířete?", solution: "Samice kohouta je slepice — kohout, slepice a kuřata tvoří hejno." },
  { question: "Které zvíře říká bú?", correct: "Kráva", distractors: ["Pes", "Kočka"], emoji: "🐄", hint: "Bú je zvuk, který vydává velké zvíře na farmě — jaké?", solution: "Bú říká kráva — takové je její typické bučení." },
  { question: "Koho stříháme kvůli vlně?", correct: "Ovce", distractors: ["Pes", "Slepice"], emoji: "🐑", hint: "Vlna na svetry pochází od zvířete, které ostříháme — od jakého?", solution: "Kvůli vlně stříháme ovce — jednou ročně je zemědělec ostříhá." },
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

export const DOMACIHOSPODARSKAZVIRATA: TopicMetadata[] = [
  {
    id: "g2-prv-zvirata-uzitek",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-domaci-a-hospodarska-zvirata-domaci-mazlicci-hospodarska-zvirata-a-jejich-uzitek",
    title: "Domácí a hospodářská zvířata a jejich užitek",
    studentTitle: "Domácí zvířata",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Domácí a hospodářská zvířata",
    briefDescription: "Poznáš zvířata a jejich užitek.",
    keywords: ["zvířata", "kráva", "slepice", "ovce", "včela", "užitek"],
    goals: [
      "Poznat domácí a hospodářská zvířata.",
      "Vědět, co nám zvířata dávají.",
      "Spojit zvíře s jeho užitkem.",
    ],
    boundaries: ["Pouze běžná zvířata.", "Bez chovu a péče."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Každé zvíře nám něco dává: mléko, vejce, vlnu nebo med.",
      steps: ["Přečti otázku.", "Které zvíře to dělá?"],
      commonMistake: "Záměna užitku — kráva dává mléko, slepice vejce.",
      example: "Kráva dává mléko, včela med, ovce vlnu.",
    },
  },
];
