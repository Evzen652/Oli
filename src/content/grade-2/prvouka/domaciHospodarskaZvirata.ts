import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání izolovaného faktu: které zvíře dává mléko/vejce/
//        vlnu/med, jak se jmenuje mládě/samice/samec, jaký vydává zvuk.
//   L2 = aplikace: přiřazení užitku ke zvířeti a obráceně, poznání
//        zvířete podle popisu, kde zvíře bydlí (chlívek/kurník/úl/stáj).
//   L3 = transfer (2 kroky, přiměřeně věku 7-8 let): kombinace dvou
//        faktů zároveň (které zvíře dává X i Y), rozlišení blízkých /
//        zaměnitelných mláďat a samců, řetězec „z čeho se vyrábí“
//        (mléko→sýr, vlna→svetr, peří→peřina).
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Které zvíře nám dává mléko?",
    correctAnswer: "Kráva",
    options: ["Kráva", "Slepice", "Včela", "Kočka"],
    emoji: "🐄",
    hints: ["Mléko pijeme každý den — vzpomeň si, které velké zvíře na farmě zemědělec dojí."],
    solutionSteps: ["Mléko nám dává kráva — zemědělec ji každý den podojí."],
  },
  {
    question: "Které zvíře snáší vejce?",
    correctAnswer: "Slepice",
    options: ["Slepice", "Ovce", "Kráva", "Prase"],
    emoji: "🐔",
    hints: ["K snídani si někdy uvaříme vajíčko — které zvíře ho snese?"],
    solutionSteps: ["Vejce snáší slepice — snáší je téměř každý den."],
  },
  {
    question: "Které zvíře nám dává vlnu?",
    correctAnswer: "Ovce",
    options: ["Ovce", "Kráva", "Včela", "Kůň"],
    emoji: "🐑",
    hints: ["Z vlny se pletou teplé svetry — od kterého zvířete pochází?"],
    solutionSteps: ["Vlnu nám dává ovce — jednou za rok ji zemědělec ostříhá."],
  },
  {
    question: "Které zvíře nám dává med?",
    correctAnswer: "Včela",
    options: ["Včela", "Slepice", "Koza", "Husa"],
    emoji: "🐝",
    hints: ["Med je sladký a vzniká z květového pylu — které zvíře ho dělá?"],
    solutionSteps: ["Med nám dává včela — sbírá pyl z květů a v úlu z něj vyrábí med."],
  },
  {
    question: "Jak se jmenuje mládě krávy?",
    correctAnswer: "Tele",
    options: ["Tele", "Hříbě", "Jehně", "Sele"],
    emoji: "🐄",
    hints: ["Vzpomeň si, jak říkáme malému mláděti, které pije mléko od krávy."],
    solutionSteps: ["Mládě krávy je tele — kráva, býk a tele patří k sobě."],
  },
  {
    question: "Jak se jmenuje mládě ovce?",
    correctAnswer: "Jehně",
    options: ["Jehně", "Tele", "Kůzle", "Sele"],
    emoji: "🐑",
    hints: ["Malé bílé mládě ovce má své vlastní jméno — jaké?"],
    solutionSteps: ["Mládě ovce je jehně — ovce, beran a jehně patří k sobě."],
  },
  {
    question: "Jak se jmenuje mládě prasete?",
    correctAnswer: "Sele",
    options: ["Sele", "Jehně", "Kuře", "Tele"],
    emoji: "🐖",
    hints: ["Malé růžové mládě prasete má krátké jméno — jaké?"],
    solutionSteps: ["Mládě prasete je sele — prase, kanec a sele patří k sobě."],
  },
  {
    question: "Jak se jmenuje mládě slepice?",
    correctAnswer: "Kuře",
    options: ["Kuře", "House", "Káče", "Sele"],
    emoji: "🐤",
    hints: ["Ze slepičího vejce se vylíhne malé žluté mládě — jak se jmenuje?"],
    solutionSteps: ["Mládě slepice je kuře — slepice, kohout a kuře patří k sobě."],
  },
  {
    question: "Jak se jmenuje mládě koně?",
    correctAnswer: "Hříbě",
    options: ["Hříbě", "Tele", "Sele", "Kůzle"],
    emoji: "🐴",
    hints: ["Malé mládě koně má dlouhé nožky a své vlastní jméno — jaké?"],
    solutionSteps: ["Mládě koně je hříbě — klisna, hřebec a hříbě patří k sobě."],
  },
  {
    question: "Jak se jmenuje mládě kozy?",
    correctAnswer: "Kůzle",
    options: ["Kůzle", "Jehně", "Tele", "Hříbě"],
    emoji: "🐐",
    hints: ["Mládě kozy se snadno splete s mládětem ovce — pozor, má jiné jméno."],
    solutionSteps: ["Mládě kozy je kůzle — koza, kozel a kůzle patří k sobě."],
  },
  {
    question: "Jak se jmenuje samec krávy?",
    correctAnswer: "Býk",
    options: ["Býk", "Beran", "Kohout", "Kozel"],
    emoji: "🐂",
    hints: ["Kráva je samice — jak říkáme velkému samci s rohy u téhož druhu?"],
    solutionSteps: ["Samec krávy je býk — kráva, býk a tele patří k sobě."],
  },
  {
    question: "Jak se jmenuje samice kohouta?",
    correctAnswer: "Slepice",
    options: ["Slepice", "Kachna", "Husa", "Koza"],
    emoji: "🐔",
    hints: ["Kohout ráno kokrhá — jak se jmenuje samice, která snáší vejce?"],
    solutionSteps: ["Samice kohouta je slepice — kohout, slepice a kuře patří k sobě."],
  },
  {
    question: "Které zvíře bydlí v úlu?",
    correctAnswer: "Včela",
    options: ["Včela", "Slepice", "Koza", "Kráva"],
    emoji: "🐝",
    hints: ["Úl je domeček pro drobný pracovitý hmyz — pro který?"],
    solutionSteps: ["V úlu bydlí včela — celá včelí rodina žije pohromadě v jednom úlu."],
  },
  {
    question: "Které zvíře ráno kokrhá?",
    correctAnswer: "Kohout",
    options: ["Kohout", "Kráva", "Ovce", "Husa"],
    emoji: "🐓",
    hints: ["Brzy ráno je na farmě slyšet hlasité „kykyryký“ — kdo ho vydává?"],
    solutionSteps: ["Ráno kokrhá kohout — jeho volání oznamuje začátek dne."],
  },
  {
    question: "Které zvíře hlídá dům a štěká?",
    correctAnswer: "Pes",
    options: ["Pes", "Kočka", "Kůň", "Ovce"],
    emoji: "🐕",
    hints: ["Toto zvíře štěká na cizí lidi a hlídá domov — které to je?"],
    solutionSteps: ["Dům hlídá pes — štěká na cizí lidi a chrání domov."],
  },
  {
    question: "Které zvíře chytá myši?",
    correctAnswer: "Kočka",
    options: ["Kočka", "Pes", "Slepice", "Kráva"],
    emoji: "🐈",
    hints: ["Toto zvíře tiše loví hlodavce v domě i na dvoře — které to je?"],
    solutionSteps: ["Myši chytá kočka — je to šikovný lovec hlodavců."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co dostaneme, když ostříháme ovci?",
    correctAnswer: "Vlnu",
    options: ["Vlnu", "Med", "Vejce", "Peří"],
    emoji: "🐑",
    hints: ["Přemýšlej, k čemu chováme ovce — co jim jednou za rok ostříháme?"],
    solutionSteps: ["Když ostříháme ovci, dostaneme vlnu — z té se pletou teplé svetry."],
  },
  {
    question: "Co nám dává včela?",
    correctAnswer: "Med",
    options: ["Med", "Vlnu", "Vejce", "Mléko"],
    emoji: "🐝",
    hints: ["Přiřaď užitek ke správnému zvířeti — co sladkého vyrábí včela?"],
    solutionSteps: ["Včela nám dává med — vyrábí ho v úlu z květového pylu."],
  },
  {
    question: "Co nám dává slepice?",
    correctAnswer: "Vejce",
    options: ["Vejce", "Mléko", "Vlnu", "Med"],
    emoji: "🐔",
    hints: ["Přiřaď užitek ke slepici — co snáší téměř každý den?"],
    solutionSteps: ["Slepice nám dává vejce — snáší je do hnízda v kurníku."],
  },
  {
    question: "K čemu hlavně chováme krávu?",
    correctAnswer: "Kvůli mléku",
    options: ["Kvůli mléku", "Kvůli vlně", "Kvůli medu", "Kvůli peří"],
    emoji: "🐄",
    hints: ["Přemýšlej, co z krávy získáváme každý den, když ji podojíme."],
    solutionSteps: ["Krávu chováme hlavně kvůli mléku — dojí se každý den."],
  },
  {
    question: "Kde bydlí prase?",
    correctAnswer: "V chlívku",
    options: ["V chlívku", "V úlu", "V kurníku", "Ve stáji"],
    emoji: "🐖",
    hints: ["Přemýšlej, jak se jmenuje malý domek pro prase na dvoře."],
    solutionSteps: ["Prase bydlí v chlívku — je to jeho ohrazený domek na dvoře."],
  },
  {
    question: "Kde bydlí slepice?",
    correctAnswer: "V kurníku",
    options: ["V kurníku", "V úlu", "V chlívku", "Ve stáji"],
    emoji: "🐔",
    hints: ["Přemýšlej, jak se jmenuje domek pro slepice, kam večer zalezou spát."],
    solutionSteps: ["Slepice bydlí v kurníku — tam spí a snáší vejce do hnízd."],
  },
  {
    question: "Kde bydlí kůň?",
    correctAnswer: "Ve stáji",
    options: ["Ve stáji", "V úlu", "V kurníku", "V boudě"],
    emoji: "🐴",
    hints: ["Přemýšlej, kde na statku spí velký kůň — jak se to místo jmenuje?"],
    solutionSteps: ["Kůň bydlí ve stáji — má tam sucho, seno a klid."],
  },
  {
    question: "Které zvíře má rohy, bradku a dává mléko?",
    correctAnswer: "Koza",
    options: ["Koza", "Slepice", "Prase", "Husa"],
    emoji: "🐐",
    hints: ["Poznej zvíře podle popisu — má malé rohy, bradku a dojí se jako kráva."],
    solutionSteps: ["Podle popisu je to koza — má rohy, bradku a dává kozí mléko."],
  },
  {
    question: "Které zvíře je velký vodní pták a snáší velká vejce?",
    correctAnswer: "Husa",
    options: ["Husa", "Kráva", "Ovce", "Kůň"],
    emoji: "🦢",
    hints: ["Poznej zvíře podle popisu — je to bílý pták, který ráda plave a hlasitě kejhá."],
    solutionSteps: ["Podle popisu je to husa — velký vodní pták, který snáší velká vejce."],
  },
  {
    question: "Které zvíře nosí lidi na hřbetě a tahá vozy?",
    correctAnswer: "Kůň",
    options: ["Kůň", "Prase", "Slepice", "Včela"],
    emoji: "🐴",
    hints: ["Poznej zvíře podle popisu — lidé na něm jezdí a zapřahají ho do vozu."],
    solutionSteps: ["Podle popisu je to kůň — nosí jezdce na hřbetě a tahá vozy."],
  },
  {
    question: "Které zvíře se rádo válí v bahně a chová se hlavně pro maso?",
    correctAnswer: "Prase",
    options: ["Prase", "Ovce", "Kůň", "Kočka"],
    emoji: "🐖",
    hints: ["Poznej zvíře podle popisu — je růžové, chrochtá a rádo se válí v bahně."],
    solutionSteps: ["Podle popisu je to prase — chová se hlavně pro maso."],
  },
  {
    question: "Které zvíře plave na rybníku a kváká?",
    correctAnswer: "Kachna",
    options: ["Kachna", "Slepice", "Kohout", "Kůň"],
    emoji: "🦆",
    hints: ["Poznej zvíře podle popisu — je to menší vodní pták, který dělá „ka ka ka“."],
    solutionSteps: ["Podle popisu je to kachna — plave na rybníku a kváká."],
  },
  {
    question: "Ke kterému zvířeti patří kurník?",
    correctAnswer: "Ke slepici",
    options: ["Ke slepici", "Ke koni", "K praseti", "Ke včele"],
    emoji: "🐔",
    hints: ["Přemýšlej, jaké zvíře bydlí v kurníku, a přiřaď ho zpět k domku."],
    solutionSteps: ["Kurník patří ke slepici — bydlí v něm a snáší tam vejce."],
  },
  {
    question: "Ke kterému zvířeti patří úl?",
    correctAnswer: "Ke včele",
    options: ["Ke včele", "Ke krávě", "K praseti", "Ke koze"],
    emoji: "🐝",
    hints: ["Přemýšlej, jaké zvíře bydlí v úlu, a přiřaď ho zpět k domku."],
    solutionSteps: ["Úl patří ke včele — bydlí v něm celá včelí rodina a vyrábí med."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Které zvíře nám dává zároveň mléko i maso?",
    correctAnswer: "Kráva",
    options: ["Kráva", "Slepice", "Včela", "Kůň"],
    emoji: "🐄",
    hints: ["Hledej zvíře, které splňuje OBOJÍ najednou — mléko i maso."],
    solutionSteps: [
      "Kráva nám dává mléko i maso zároveň. Slepice dává vejce a maso, ale ne mléko, včela dává jen med.",
    ],
  },
  {
    question: "Které zvíře nám dává zároveň vlnu i mléko?",
    correctAnswer: "Ovce",
    options: ["Ovce", "Kráva", "Slepice", "Včela"],
    emoji: "🐑",
    hints: ["Hledej zvíře, které splňuje OBOJÍ najednou — vlnu i mléko."],
    solutionSteps: [
      "Ovce nám dává vlnu i mléko zároveň. Kráva dává mléko, ale ne vlnu, slepice dává vejce a včela med.",
    ],
  },
  {
    question: "Z čeho se vyrábí sýr?",
    correctAnswer: "Z mléka",
    options: ["Z mléka", "Z vlny", "Z medu", "Z vajec"],
    emoji: "🧀",
    hints: ["Přemýšlej po krocích — sýr vzniká z bílé tekutiny, kterou dává kráva."],
    solutionSteps: ["Sýr se vyrábí z mléka — a mléko nám dává kráva nebo koza."],
  },
  {
    question: "Z čeho se plete teplý svetr?",
    correctAnswer: "Z vlny",
    options: ["Z vlny", "Z mléka", "Z medu", "Z peří"],
    emoji: "🧶",
    hints: ["Přemýšlej po krocích — svetr se plete z materiálu, který ostříháme ovci."],
    solutionSteps: ["Teplý svetr se plete z vlny — a vlnu nám dává ovce."],
  },
  {
    question: "Sýr se vyrábí z mléka. Které zvíře nám tedy mléko na sýr dá?",
    correctAnswer: "Kráva",
    options: ["Kráva", "Slepice", "Včela", "Husa"],
    emoji: "🧀",
    hints: ["Nejdřív si vzpomeň, z čeho je sýr, a pak najdi zvíře, které to dává."],
    solutionSteps: [
      "Sýr je z mléka a mléko nám dává kráva. Slepice dává vejce, včela med, ti mléko na sýr nedají.",
    ],
  },
  {
    question: "Ke snídani máš vajíčko a lžičku medu. Která dvě zvířata ti to dala?",
    correctAnswer: "Slepice a včela",
    options: ["Slepice a včela", "Kráva a ovce", "Prase a kůň", "Koza a pes"],
    emoji: "🍯",
    hints: ["Rozděl si to na dvě části — kdo dává vejce a kdo dává med?"],
    solutionSteps: ["Vajíčko snesla slepice a med vyrobila včela — proto je to slepice a včela."],
  },
  {
    question: "Ovce má mládě jehně. Jak se jmenuje mládě kozy?",
    correctAnswer: "Kůzle",
    options: ["Kůzle", "Jehně", "Tele", "Sele"],
    emoji: "🐐",
    hints: ["Pozor na záměnu — koza a ovce jsou si podobné, ale mládě mají jinak pojmenované."],
    solutionSteps: [
      "Mládě kozy je kůzle. Jehně je mládě ovce, tele mládě krávy a sele mládě prasete.",
    ],
  },
  {
    question: "Kráva má mládě tele. Jak se jmenuje mládě koně?",
    correctAnswer: "Hříbě",
    options: ["Hříbě", "Tele", "Sele", "Kůzle"],
    emoji: "🐴",
    hints: ["Nezaměň mláďata — každý druh má své vlastní jméno pro mládě."],
    solutionSteps: [
      "Mládě koně je hříbě. Tele je mládě krávy, sele mládě prasete a kůzle mládě kozy.",
    ],
  },
  {
    question: "Jak se jmenuje samec ovce?",
    correctAnswer: "Beran",
    options: ["Beran", "Býk", "Kozel", "Kanec"],
    emoji: "🐑",
    hints: ["Pozor na záměnu samců — hledej samce právě u ovce, ne u krávy nebo kozy."],
    solutionSteps: [
      "Samec ovce je beran. Býk je samec krávy, kozel samec kozy a kanec samec prasete.",
    ],
  },
  {
    question: "Jak se jmenuje samec kozy?",
    correctAnswer: "Kozel",
    options: ["Kozel", "Beran", "Býk", "Kohout"],
    emoji: "🐐",
    hints: ["Pozor na záměnu samců — koza a ovce jsou podobné, ale jejich samci se jmenují jinak."],
    solutionSteps: [
      "Samec kozy je kozel. Beran je samec ovce, býk samec krávy a kohout samec slepice.",
    ],
  },
  {
    question: "Které z těchto zvířat NEDÁVÁ mléko?",
    correctAnswer: "Slepice",
    options: ["Slepice", "Kráva", "Koza", "Ovce"],
    emoji: "🐔",
    hints: ["Tři z těchto zvířat se dojí — najdi to jediné, které se nedojí."],
    solutionSteps: [
      "Mléko nedává slepice — ta snáší vejce. Kráva, koza i ovce se dojí, a mléko tedy dávají.",
    ],
  },
  {
    question: "Které zvíře bydlí v úlu a zároveň vyrábí med?",
    correctAnswer: "Včela",
    options: ["Včela", "Slepice", "Kráva", "Koza"],
    emoji: "🐝",
    hints: ["Hledej zvíře, které splňuje OBOJÍ — bydlí v úlu a k tomu dělá med."],
    solutionSteps: [
      "V úlu bydlí včela a v něm i vyrábí med. Slepice bydlí v kurníku, kráva a koza ve chlévě.",
    ],
  },
  {
    question: "Z čeho se plní péřová peřina, a které zvíře nám to peří dá?",
    correctAnswer: "Z peří husy",
    options: ["Z peří husy", "Z vlny ovce", "Z mléka krávy", "Z medu včely"],
    emoji: "🪶",
    hints: ["Peřina je z jemného peří — vzpomeň si, který velký pták nám peří dává."],
    solutionSteps: [
      "Peřina se plní jemným peřím a to nám dává husa. Ovce dává vlnu, kráva mléko, to se do peřiny nedává.",
    ],
  },
  {
    question: "Máslo i sýr se vyrábějí z mléka. Které zvíře nám mléko dává?",
    correctAnswer: "Kráva",
    options: ["Kráva", "Slepice", "Prase", "Včela"],
    emoji: "🥛",
    hints: ["Nejdřív si vzpomeň, z čeho je máslo a sýr, a pak najdi zvíře, které to dává."],
    solutionSteps: [
      "Máslo i sýr jsou z mléka a mléko nám dává kráva. Slepice dává vejce, prase maso, včela med.",
    ],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool).map((t) => ({ ...t, options: shuffle(t.options) }));
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
    boundaries: [
      "Pouze běžná domácí a hospodářská zvířata.",
      "Bez podrobností o chovu a péči.",
      "Řetězce „z čeho se vyrábí“ (mléko→sýr, vlna→svetr, peří→peřina) jsou rozšiřující — jen na L3.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Každé zvíře nám něco dává: mléko, vejce, vlnu nebo med. Mysli i na to, kde bydlí a jak se jmenuje jeho mládě.",
      steps: ["Přečti otázku.", "Které zvíře to dělá, nebo které k tomu patří?"],
      commonMistake: "Záměna užitku (kráva dává mléko, slepice vejce) nebo podobných mláďat (jehně × kůzle).",
      example: "Kráva dává mléko, včela med, ovce vlnu. Mládě krávy je tele, mládě ovce jehně.",
    },
  },
];
