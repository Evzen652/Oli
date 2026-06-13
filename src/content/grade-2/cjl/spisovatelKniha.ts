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
  // Autor
  { question: "Kdo napsal nebo vymyslel příběh v knize?", correct: "Spisovatel / autor", distractors: ["Ilustrátor", "Knihovník"], emoji: "✍️", hint: "Někdo příběh vymyslel a napsal — kdo je zodpovědný za text v knize?", solution: "Příběh v knize napsal spisovatel (nebo autorka) — je to člověk, který text vymyslel a zapsal." },
  { question: "Jak nazýváme ženu, která píše knihy?", correct: "Autorka nebo spisovatelka", distractors: ["Ilustrátorka", "Čtenářka"], emoji: "✍️", hint: "Žena, která vymýšlí a píše příběhy do knih — jak se jí říká?", solution: "Žena, která píše knihy, je autorka nebo spisovatelka — ona příběh vymyslela a zapsala." },
  // Ilustrátor
  { question: "Kdo namaloval obrázky v knize?", correct: "Ilustrátor", distractors: ["Spisovatel", "Knihovník"], emoji: "🎨", hint: "V knize je text a obrázky — text píše spisovatel. Kdo maluje obrázky?", solution: "Obrázky v knize namaloval ilustrátor — je to výtvarník, který knihu doplnil kresbami." },
  { question: "Co dělá ilustrátor?", correct: "Kreslí nebo maluje obrázky ke knize", distractors: ["Píše text příběhu", "Půjčuje knihy"], emoji: "🖼️", hint: "Ilustrátor nepíše slova — co dělá k textu, aby byl vizuálně hezký?", solution: "Ilustrátor kreslí nebo maluje obrázky ke knize — doplňuje text vizuálními obrazy, aby se knížka lépe četla." },
  // Knihovna
  { question: "Kde si půjčíme knihy k přečtení?", correct: "V knihovně", distractors: ["V restauraci", "V nemocnici"], emoji: "📚", hint: "Existuje místo, kde jsou knihy seřazené a každý si může přijít zapůjčit — jak se jmenuje?", solution: "Knihy si půjčíme v knihovně — je to místo, kde jsou knihy seřazené a veřejně dostupné k půjčení." },
  { question: "Jak se nazývá člověk, který pracuje v knihovně?", correct: "Knihovník nebo knihovnice", distractors: ["Spisovatel", "Ilustrátor"], emoji: "🏛️", hint: "V knihovně nám pomáhá zaměstnanec — jak se mu říká?", solution: "Člověk, který pracuje v knihovně, je knihovník nebo knihovnice — pomáhá nám najít knihy a půjčit si je." },
  { question: "Proč je v knihovně ticho?", correct: "Aby nerušili ostatní čtenáře", distractors: ["Protože jsou tam spící lidé", "Protože nesmíme dýchat"], emoji: "🤫", hint: "Lidé v knihovně čtou nebo studují — co potřebují, aby se mohli soustředit?", solution: "V knihovně je ticho, aby nerušili ostatní čtenáře — lidé tam čtou nebo studují a potřebují klid." },
  // Části knihy
  { question: "Kde v knize najdeme název díla?", correct: "Na titulní straně (obálce)", distractors: ["Na poslední straně", "Uprostřed knihy"], emoji: "📖", hint: "Název díla vidíme jako první, ještě než otevřeme knihu — kde je?", solution: "Název díla najdeme na titulní straně nebo obálce — je to přední strana, kde je jméno knihy a autora." },
  { question: "Kde v knize najdeme jméno autora?", correct: "Na titulní straně (obálce)", distractors: ["Na záložce", "Na zadní straně"], emoji: "📖", hint: "Jméno autora je spolu s názvem díla na první straně, nebo na obálce.", solution: "Jméno autora najdeme na titulní straně nebo obálce — je tam spolu s názvem díla." },
  { question: "Co je obsah (rejstřík) v knize?", correct: "Seznam kapitol s čísly stran", distractors: ["Jméno autora", "Poslední stránka příběhu"], emoji: "📋", hint: "Obsah nám říká, kde v knize co najdeme — co obsahuje?", solution: "Obsah (nebo rejstřík) je seznam kapitol s čísly stran — říká nám, na které straně co najdeme." },
  { question: "Co je kapitola v knize?", correct: "Část příběhu nebo textu", distractors: ["Jméno autora", "Obrázek v knize"], emoji: "📑", hint: "Dlouhý příběh je rozdělený do menších celků — jak se jim říká?", solution: "Kapitola je část příběhu nebo textu — dlouhé knihy jsou rozděleny do kapitol, aby se lépe četly." },
  // Péče o knihy
  { question: "Proč knize nevytrháváme stránky?", correct: "Abychom ji nepoškodili pro další čtenáře", distractors: ["Protože jsou těžké", "Protože jsou mokré"], emoji: "📚", hint: "Knihy si půjčujeme — po nás si ji půjčí jiní. Co je proto správné?", solution: "Stránky nevytrháváme, abychom knihu nepoškodili — po nás si ji půjčí další čtenáři a potřebují ji celou." },
  { question: "Jak se správně zacházíme s půjčenou knihou?", correct: "Opatrně, vracíme ji celou a čistou", distractors: ["Psaní do ní tužkou", "Zbytečné ohýbání stran"], emoji: "📖", hint: "Půjčená kniha patří knihovně nebo kamarádovi — jak se o ni staráme?", solution: "S půjčenou knihou zacházíme opatrně a vracíme ji celou a čistou — patří jinému a musíme ji vrátit v dobrém stavu." },
  // Druhy knih
  { question: "Co je pohádková knížka?", correct: "Kniha s pohádkovými příběhy", distractors: ["Kniha s recepty", "Kniha s matematikou"], emoji: "🧚", hint: "Pohádková knížka obsahuje příběhy s čarodějnicemi, skřítky nebo kouzelníky — jaký druh knihy to je?", solution: "Pohádková knížka je kniha s pohádkovými příběhy — obsahuje příběhy s kouzelným světem a nadpřirozenými postavami." },
  { question: "Co je encyklopedie?", correct: "Kniha, která vysvětluje různá témata a fakta", distractors: ["Sbírka pohádek", "Sbírka básní"], emoji: "📕", hint: "Encyklopedie je tlustá kniha — hledáme v ní odpovědi na otázky o světě, přírodě nebo historii.", solution: "Encyklopedie je kniha, která vysvětluje různá témata a fakta — hledáme v ní informace o světě." },
  { question: "Kdo čte knihy?", correct: "Čtenář nebo čtenářka", distractors: ["Ilustrátor", "Tiskař"], emoji: "📖", hint: "Knihy existují pro lidi, kteří si je přečtou — jak se jim říká?", solution: "Knihy čte čtenář nebo čtenářka — jsou to lidé, kteří si knihu přečtou a poznají příběh nebo informace." },
  { question: "Kde koupíme novou knihu?", correct: "V knihkupectví", distractors: ["V knihovně", "V hračkárně"], emoji: "🏪", hint: "Knihy lze koupit nebo půjčit — v knihovně je půjčíme, jinde je...", solution: "Novou knihu koupíme v knihkupectví — je to obchod, kde se prodávají knihy. V knihovně si je jen půjčíme." },
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

export const SPISOVATELKNIHA: TopicMetadata[] = [
  {
    id: "g2-cjl-literarni-vychova-prace-s-knihou-spisovatel-ilustrator-knihovna",
    rvpNodeId: "g2-cjl-literarni-vychova-prace-s-knihou-spisovatel-ilustrator-knihovna",
    title: "Spisovatel, ilustrátor, knihovna",
    studentTitle: "Kdo tvoří knihu",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s knihou",
    briefDescription: "Naučíš se, kdo tvoří knihy a kde je najít.",
    keywords: ["spisovatel", "ilustrátor", "knihovna", "obálka", "obsah", "kapitola", "čtenář"],
    goals: [
      "Vědět, kdo je spisovatel a kdo je ilustrátor.",
      "Znát funkci knihovny a knihovníka.",
      "Orientovat se v knize (obálka, obsah, kapitola).",
    ],
    boundaries: ["Bez bibliografických detailů.", "Bez nakladatelství a ISBN."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Spisovatel píše text. Ilustrátor maluje obrázky. Knihovník v knihovně půjčuje knihy.",
      steps: ["Přečti otázku.", "Jde o text, obrázky nebo místo?", "Text → spisovatel. Obrázky → ilustrátor. Místo → knihovna."],
      commonMistake: "Záměna ilustrátora a spisovatele — ilustrátor maluje, spisovatel píše.",
      example: "Pohádky o Rumcajsovi → spisovatel Václav Čtvrtek. Obrázky → ilustrátor.",
    },
  },
];
