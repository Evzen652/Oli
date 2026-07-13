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

function toTask(item: TrueFalseItem): PracticeTask {
  return {
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [item.hint],
    explanation: item.solution,
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3) pro 2. ročník.
//   L1 = rozpoznání izolovaného faktu o podzimu a zimě (co se děje na
//        podzim, znaky zimy) — formát Ano/Ne (2 možnosti).
//   L2 = aplikace: přiřazení jevu ke správnému ročnímu období,
//        rozpoznání období podle popisu — výběr ze 4 možností.
//   L3 = transfer: kombinace dvou znaků období, rozlišení blízkých
//        jevů (podzim vs. zima), „proč“ otázky spojující dvě informace
//        — většinou 4 možnosti, jen menšina Ano/Ne.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Na podzim padá listí ze stromů. Je to pravda?",
    correct: true,
    emoji: "🍂",
    hint: "Listnaté stromy se na podzim zbavují listí — kam listí padá?",
    solution: "Na podzim padá listí — stromy se připravují na zimu a shazují listy.",
  },
  {
    question: "V zimě padá sníh. Je to pravda?",
    correct: true,
    emoji: "❄️",
    hint: "Sníh vzniká, když je velká zima — patří k zimě, nebo k létu?",
    solution: "V zimě padá sníh — teploty klesnou pod nulu a místo deště padá sníh.",
  },
  {
    question: "V zimě kvetou na stromech květy. Je to pravda?",
    correct: false,
    emoji: "🌳",
    hint: "Stromy kvetou, když je teplo — je v zimě teplo?",
    solution: "V zimě stromy nekvetou — kvetou na jaře, v zimě jsou holé bez listí i květů.",
  },
  {
    question: "Na podzim sklízíme na zahradě jablka. Je to pravda?",
    correct: true,
    emoji: "🍎",
    hint: "Jablka na stromech dozrávají na podzim — kdy je tedy trháme?",
    solution: "Na podzim sklízíme jablka — dozrávají na stromech v září a říjnu.",
  },
  {
    question: "V zimě bývá chladno a mrzne. Je to pravda?",
    correct: true,
    emoji: "🥶",
    hint: "Zima je nejchladnější roční období — bývá mráz a sníh.",
    solution: "V zimě bývá chladno a mrzne — teploty klesají pod nulu a může padat sníh.",
  },
  {
    question: "Na podzim je horko jako uprostřed léta. Je to pravda?",
    correct: false,
    emoji: "🧥",
    hint: "Na podzim se ochlazuje — proč si bereme kabát?",
    solution: "Na podzim není horko jako v létě — ochlazuje se a bereme si kabát a bundu.",
  },
  {
    question: "V zimě může zamrznout rybník. Je to pravda?",
    correct: true,
    emoji: "⛸️",
    hint: "Když jsou velké mrazy, voda tuhne v led — stane se to i s rybníkem?",
    solution: "V zimě zamrzá rybník — při velkém mrazu se hladina pokryje ledem.",
  },
  {
    question: "Na podzim listí žloutne a červená. Je to pravda?",
    correct: true,
    emoji: "🍁",
    hint: "Než listí opadá, změní barvu — ze zelené na jakou?",
    solution: "Na podzim listí žloutne a červená — než opadne, změní barvu.",
  },
  {
    question: "V zimě nosíme čepici, rukavice a šálu. Je to pravda?",
    correct: true,
    emoji: "🧣",
    hint: "Před čím nás v zimě chrání teplé oblečení?",
    solution: "V zimě nosíme čepici, rukavice a šálu — chrání nás před zimou a mrazem.",
  },
  {
    question: "V zimě se chodíme koupat do rybníka. Je to pravda?",
    correct: false,
    emoji: "❄️",
    hint: "Rybník je v zimě zamrzlý — dala by se v něm plavat?",
    solution: "V zimě se v rybníku nekoupeme — voda je ledová a hladina bývá zamrzlá.",
  },
  {
    question: "Na podzim často fouká vítr. Je to pravda?",
    correct: true,
    emoji: "🌬️",
    hint: "Co pomáhá shazovat listí ze stromů?",
    solution: "Na podzim často fouká vítr — pomáhá shazovat listí ze stromů.",
  },
  {
    question: "V zimě si ze sněhu stavíme sněhuláka. Je to pravda?",
    correct: true,
    emoji: "⛄",
    hint: "Ze sněhových koulí skládáme postavičku — kdy máme dost sněhu?",
    solution: "V zimě stavíme sněhuláka — ze sněhových koulí složíme postavičku.",
  },
  {
    question: "Na podzim rostou v lese houby. Je to pravda?",
    correct: true,
    emoji: "🍄",
    hint: "Kdy se v lese chodí na hřiby a další houby?",
    solution: "Na podzim rostou v lese houby — chodíme na hřiby, křemenáče a další.",
  },
  {
    question: "V zimě dozrávají na zahradě jahody. Je to pravda?",
    correct: false,
    emoji: "🍓",
    hint: "Jahody potřebují teplo — dozrávají v zimě, nebo v teplém období?",
    solution: "V zimě jahody nedozrávají — jsou to letní plody a zrají v teple.",
  },
  {
    question: "Na podzim vykopáváme ze země brambory. Je to pravda?",
    correct: true,
    emoji: "🥔",
    hint: "Brambory rostou pod zemí — kdy je sklízíme?",
    solution: "Na podzim sklízíme brambory — vykopáváme je ze země v září a říjnu.",
  },
  {
    question: "V zimě jsou dny krátké a brzy se stmívá. Je to pravda?",
    correct: true,
    emoji: "🌙",
    hint: "V zimě slunce vychází pozdě a zapadá brzy — jsou dny dlouhé, nebo krátké?",
    solution: "V zimě jsou dny krátké — slunce svítí málo hodin a brzy se setmí.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Listí žloutne a padá, sklízíme jablka a rostou houby. Které je to roční období?",
    correctAnswer: "Podzim",
    options: ["Podzim", "Zima", "Jaro", "Léto"],
    emoji: "🍂",
    hints: [
      "Kdy stromy shazují barevné listí a na zahradě dozrává ovoce?",
      "Padání listí a sklizeň patří k období hned po létě.",
    ],
    explanation:
      "Padání barevného listí, sklizeň jablek a houby jsou znaky podzimu. V zimě je sníh a mráz, na jaře příroda teprve raší.",
  },
  {
    question: "Padá sníh, mrzne a rybníky jsou zamrzlé. Které je to roční období?",
    correctAnswer: "Zima",
    options: ["Zima", "Podzim", "Jaro", "Léto"],
    emoji: "❄️",
    hints: [
      "Kdy je největší mráz a voda zamrzá v led?",
      "Sníh a led patří k nejchladnějšímu období roku.",
    ],
    explanation:
      "Sníh, mráz a zamrzlé rybníky jsou znaky zimy — nejchladnějšího období. Na podzim se teprve ochlazuje, ale sníh a led ještě většinou nejsou.",
  },
  {
    question: "Co z toho patří k zimě?",
    correctAnswer: "Stavění sněhuláka na zahradě",
    options: [
      "Stavění sněhuláka na zahradě",
      "Sklízení brambor ze země",
      "Rašení nových zelených listů",
      "Zrání jahod na záhonu",
    ],
    emoji: "⛄",
    hints: [
      "Hledej to, co jde dělat jen když napadne sníh.",
      "Sklizeň patří k podzimu, rašení k jaru, jahody k létu.",
    ],
    explanation:
      "Stavění sněhuláka patří k zimě, kdy je sníh. Sklizeň brambor je podzimní, rašení listů jarní a zrání jahod letní.",
  },
  {
    question: "Co dělají listnaté stromy na podzim?",
    correctAnswer: "Listí jim žloutne a opadává",
    options: [
      "Listí jim žloutne a opadává",
      "Raší jim nové zelené listy",
      "Kvetou jim bílé a růžové květy",
      "Zrají na nich zralé jahody",
    ],
    emoji: "🍁",
    hints: [
      "Co se stane s listím, než přijde zima?",
      "Rašení a kvetení patří k jaru, ne k podzimu.",
    ],
    explanation:
      "Na podzim listnatým stromům listí zežloutne a opadá — připravují se na zimu. Rašení a kvetení jsou naopak jarní znaky.",
  },
  {
    question: "Kdy ptáci jako vlaštovky odlétají do teplých krajů?",
    correctAnswer: "Na podzim",
    options: ["Na podzim", "V zimě", "Na jaře", "V létě"],
    emoji: "🐦",
    hints: [
      "Ptáci odlétají dřív, než přijdou mrazy a nedostatek potravy.",
      "Odlétají na konci teplého období, když se začíná ochlazovat.",
    ],
    explanation:
      "Vlaštovky a další tažní ptáci odlétají na podzim, aby unikli zimě a nedostatku potravy. Zpět se vracejí až na jaře.",
  },
  {
    question: "Který znak je typický pro zimní den?",
    correctAnswer: "Je krátký, mrzne a leží sníh",
    options: [
      "Je krátký, mrzne a leží sníh",
      "Je dlouhý, horký a svítí slunce dlouho do večera",
      "Stromy kvetou a vracejí se ptáci",
      "Zrají jahody a chodíme se koupat",
    ],
    emoji: "🌨️",
    hints: [
      "V zimě je den nejkratší a je největší zima.",
      "Dlouhé horké dny a kvetení patří k jiným obdobím.",
    ],
    explanation:
      "Zimní den je krátký, mrzne a leží sníh. Dlouhé horké dny patří k létu, kvetení a návrat ptáků k jaru.",
  },
  {
    question: "Na stromech je barevné listí, které pomalu opadává, a fouká chladný vítr. Které je to období?",
    correctAnswer: "Podzim",
    options: ["Podzim", "Zima", "Jaro", "Léto"],
    emoji: "🌬️",
    hints: [
      "Kdy stromy shazují zežloutlé a zčervenalé listí?",
      "Barevné padající listí je hlavní znak jednoho období.",
    ],
    explanation:
      "Barevné padající listí a chladný vítr patří k podzimu. V zimě už jsou stromy holé, na jaře jim listy teprve raší.",
  },
  {
    question: "Ke kterému období patří sáňkování a bruslení na zamrzlém rybníku?",
    correctAnswer: "K zimě",
    options: ["K zimě", "K podzimu", "K jaru", "K létu"],
    emoji: "🛷",
    hints: [
      "K čemu potřebujeme sníh a led?",
      "Rybník zamrzne jen v nejchladnějším období.",
    ],
    explanation:
      "Sáňkování a bruslení patří k zimě — potřebujeme k nim sníh a led. Ty jsou jen v nejchladnějším období roku.",
  },
  {
    question: "Co si vezmeš na sebe, když jdeš ven za mrazivého zimního dne?",
    correctAnswer: "Teplou bundu, čepici, šálu a rukavice",
    options: [
      "Teplou bundu, čepici, šálu a rukavice",
      "Lehké tričko, kraťasy a sluneční brýle",
      "Plavky a ručník na koupání",
      "Jen tenkou košili naboso v sandálech",
    ],
    emoji: "🧤",
    hints: [
      "V mrazu se musíme dobře zahřát.",
      "Lehké letní oblečení by tě v zimě nezahřálo.",
    ],
    explanation:
      "Za mrazu si oblékáme teplou bundu, čepici, šálu a rukavice, abychom se nenachladili. Lehké letní oblečení je do zimy nevhodné.",
  },
  {
    question: "Veverka si na podzim schovává oříšky a žaludy. Proč to dělá?",
    correctAnswer: "Dělá si zásoby jídla na zimu",
    options: [
      "Dělá si zásoby jídla na zimu",
      "Chce si s nimi jen hrát",
      "Rozdává je ostatním zvířatům",
      "Sází je, aby z nich vyrostly stromy",
    ],
    emoji: "🐿️",
    hints: [
      "V zimě je venku málo potravy — co si zvíře musí připravit dopředu?",
      "Přemýšlej, čím se bude veverka živit, až napadne sníh.",
    ],
    explanation:
      "Veverka si na podzim dělá zásoby na zimu, kdy je venku málo potravy. Schované oříšky a žaludy jí pomohou zimu přečkat.",
  },
  {
    question: "Ráno je na trávě jinovatka a v kalužích tenký led, ale sníh ještě neleží. Které období právě začíná?",
    correctAnswer: "Konec podzimu, blíží se zima",
    options: [
      "Konec podzimu, blíží se zima",
      "Začátek léta, blíží se prázdniny",
      "Vrcholné léto s velkým horkem",
      "Začátek jara, vše rozkvétá",
    ],
    emoji: "🌫️",
    hints: [
      "První mrazíky a led přicházejí, když končí podzim.",
      "Horko a kvetení k tomuhle chladnému ránu nepatří.",
    ],
    explanation:
      "Jinovatka a tenký led ráno jsou znakem konce podzimu, kdy se ochlazuje a blíží zima. Horko i kvetení patří k úplně jiným obdobím.",
  },
  {
    question: "Kdy jsou dny nejkratší a slunce svítí nejméně hodin?",
    correctAnswer: "V zimě",
    options: ["V zimě", "V létě", "Na jaře", "Vždy stejně dlouho"],
    emoji: "🌇",
    hints: [
      "Kdy se stmívá už odpoledne?",
      "Porovnej zimu a léto — kdy je den kratší?",
    ],
    explanation:
      "Nejkratší dny jsou v zimě — slunce vychází pozdě a zapadá brzy. V létě jsou dny naopak nejdelší.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Na podzim i v zimě je chladněji než v létě. Co je typické spíš pro zimu než pro podzim?",
    correctAnswer: "Sníh, mráz a zamrzlé rybníky",
    options: [
      "Sníh, mráz a zamrzlé rybníky",
      "Padání barevného listí ze stromů",
      "Sklizeň jablek a brambor na zahradě",
      "Sběr hub v lese",
    ],
    emoji: "🥶",
    hints: [
      "Obě období jsou chladná — hledej to, co je opravdu jen zimní.",
      "Padání listí, sklizeň i houby patří k podzimu, ne k zimě.",
    ],
    explanation:
      "Sníh, mráz a led patří k zimě. Padání listí, sklizeň a houby jsou naopak znaky podzimu — proto se hodí spíš k podzimu.",
  },
  {
    question: "Proč stromy na podzim shazují listí, než přijde zima?",
    correctAnswer: "V zimě by přes listy ztrácely vodu, kterou nemohou z promrzlé půdy doplnit",
    options: [
      "V zimě by přes listy ztrácely vodu, kterou nemohou z promrzlé půdy doplnit",
      "Protože je listí v zimě obtěžuje při kvetení",
      "Protože jim listí na jaře už znovu nenaraší",
      "Protože se chtějí podobat jehličnatým stromům",
    ],
    emoji: "🍂",
    hints: [
      "V zimě je půda zmrzlá, takže strom nedokáže doplňovat vodu — k čemu by mu pak byly holé větve?",
      "Bez zeleného olistění strom v zimě šetří a nevysychá.",
    ],
    explanation:
      "Strom shodí listí, protože by přes ně v zimě ztrácel vodu, kterou z promrzlé půdy nedokáže nabrat. Bez listů zimu lépe přečká a na jaře mu narašou nové.",
  },
  {
    question: "Která dvojice znaků patří dohromady k podzimu?",
    correctAnswer: "Padá barevné listí a sklízí se ovoce",
    options: [
      "Padá barevné listí a sklízí se ovoce",
      "Leží sníh a zamrzají rybníky",
      "Raší listy a rodí se mláďata",
      "Je horko a chodíme se koupat",
    ],
    emoji: "🍁",
    hints: [
      "Obě věci se musí dít ve stejném období.",
      "Sníh a led patří k zimě, rašení k jaru, horko k létu.",
    ],
    explanation:
      "Padání barevného listí i sklizeň ovoce patří k podzimu. Sníh s ledem je zimní, rašení jarní a horko letní — proto ostatní dvojice nesedí.",
  },
  {
    question: "Proč ptáci jako vlaštovky odlétají na podzim do teplých krajů?",
    correctAnswer: "V zimě by u nás nenašli dost hmyzu a potravy a byla by jim zima",
    options: [
      "V zimě by u nás nenašli dost hmyzu a potravy a byla by jim zima",
      "Chtějí se v teplých krajích jen koupat v moři",
      "V teplých krajích je v zimě sníh a to mají rádi",
      "Odlétají náhodně, bez důvodu",
    ],
    emoji: "🐦",
    hints: [
      "Čím se vlaštovky živí a bude toho v zimě dost?",
      "Přemýšlej, proč pro ně u nás zima není vhodná.",
    ],
    explanation:
      "Vlaštovky se živí hmyzem, kterého v zimě není dost, a mráz by jim uškodil. Proto na podzim odlétají do tepla a vracejí se až na jaře.",
  },
  {
    question: "Které tvrzení o pořadí ročních období je pravdivé?",
    correctAnswer: "Po létě přichází podzim a po podzimu zima",
    options: [
      "Po létě přichází podzim a po podzimu zima",
      "Po létě přichází rovnou zima a podzim se vynechá",
      "Po podzimu přichází zpátky léto",
      "Zima přichází hned po jaru",
    ],
    emoji: "🔄",
    hints: [
      "Vzpomeň si, v jakém pořadí jdou roční období za sebou.",
      "Podzim je přechod mezi teplým létem a mrazivou zimou.",
    ],
    explanation:
      "Po létě přichází nejdřív podzim a teprve pak zima — podzim je přechod mezi teplem a mrazem. Po zimě následuje jaro, ne zase léto.",
  },
  {
    question: "Na podzim se počasí den ode dne mění. Kterým směrem?",
    correctAnswer: "Postupně se ochlazuje a dny se zkracují",
    options: [
      "Postupně se ochlazuje a dny se zkracují",
      "Postupně se otepluje a dny se prodlužují",
      "Počasí se vůbec nemění, zůstává jako v létě",
      "Je čím dál větší horko",
    ],
    emoji: "🌤️",
    hints: [
      "Podzim je přechod mezi létem a zimou — kam počasí míří?",
      "Přemýšlej, jestli se dny na podzim prodlužují, nebo zkracují.",
    ],
    explanation:
      "Na podzim se počasí ochlazuje a dny se zkracují — směřuje k zimě. Oteplování a delší dny patří naopak k jaru.",
  },
  {
    question: "Kamarád tvrdí, že houby v lese rostou nejvíc v zimě na sněhu. Jak to opravíš?",
    correctAnswer: "Houby rostou nejvíc na podzim, kdy je vlhko a ještě teplo; v zimě mráz jim nesvědčí",
    options: [
      "Houby rostou nejvíc na podzim, kdy je vlhko a ještě teplo; v zimě mráz jim nesvědčí",
      "Kamarád má pravdu, houby rostou hlavně ve sněhu",
      "Houby rostou nejvíc v zimě, protože mají rády mráz",
      "Houby v lese nerostou vůbec nikdy",
    ],
    emoji: "🍄",
    hints: [
      "Kdy je v lese vlhko po deštích a přitom ještě není mráz?",
      "Zamysli se, jestli by houba prorazila zmrzlou půdu a sníh.",
    ],
    explanation:
      "Houby rostou nejvíc na podzim, kdy je po deštích vlhko a ještě relativně teplo. V zimě jim mráz a sníh nesvědčí, takže tehdy skoro nerostou.",
  },
  {
    question: "Medvěd i ježek se na podzim hodně nakrmí a pak přes zimu spí. Proč to dělají?",
    correctAnswer: "V zimě je málo potravy, a tak zimu prospí a šetří nastřádanou energii",
    options: [
      "V zimě je málo potravy, a tak zimu prospí a šetří nastřádanou energii",
      "V zimě je moc jídla, a tak nemusí nic dělat",
      "Spí, protože se v zimě nudí",
      "Spí proto, aby jim narostl nový kožich",
    ],
    emoji: "🐻",
    hints: [
      "Spoj dvě věci: v zimě není co jíst a spánek šetří sílu.",
      "Proč se nejdřív na podzim tolik nakrmí?",
    ],
    explanation:
      "V zimě je venku málo potravy, proto se medvěd i ježek na podzim vykrmí a zimu prospí. Během spánku tělo šetří nastřádanou energii, dokud zase nepřijde teplo.",
  },
  {
    question: "V zimě jsou dny kratší než na podzim. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🌗",
    hints: [
      "Dny se od léta ke dnu zimy stále zkracují — kdy jsou nejkratší?",
    ],
    explanation:
      "Ano, to je pravda — dny se od léta zkracují a nejkratší jsou v zimě, takže jsou kratší než na podzim.",
  },
  {
    question: "Na podzim je většinou tepleji než v zimě, ale chladněji než v létě. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🌡️",
    hints: [
      "Srovnej podzim, zimu a léto podle tepla a seřaď je.",
    ],
    explanation:
      "Ano, to je pravda — podzim je přechod mezi létem a zimou, proto je chladnější než léto, ale ještě ne tak mrazivý jako zima.",
  },
  {
    question: "Padání barevného listí a sklizeň brambor se dějí ve stejném ročním období. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🥔",
    hints: [
      "Rozmysli si, kdy listí opadává a kdy vykopáváme brambory — patří to k témuž období?",
    ],
    explanation:
      "Ano, to je pravda — padání listí i sklizeň brambor patří k podzimu, kdy se příroda připravuje na zimu.",
  },
  {
    question: "Zamrzlý rybník, na kterém se dá bruslit, je typický znak podzimu. Je to pravda?",
    correctAnswer: NE,
    options: [ANO, NE],
    emoji: "⛸️",
    hints: [
      "Přemýšlej, kdy je takový mráz, že voda zamrzne na pevný led.",
    ],
    explanation:
      "Ne, to není pravda — zamrzlý rybník je znak zimy, ne podzimu. Na podzim ještě takové mrazy většinou nejsou.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1.map(toTask);
  return shuffle(pool);
}

export const ZMENYVPRIRODEPODZIMZIMA: TopicMetadata[] = [
  {
    id: "g2-prv-podzim-zima",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-podzim-a-v-zime-zmeny-v-prirode-podzim-zima",
    title: "Změny v přírodě – podzim a zima",
    studentTitle: "Podzim a zima",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na podzim a v zimě",
    briefDescription: "Co se děje v přírodě na podzim a v zimě.",
    keywords: ["podzim", "zima", "listí", "sníh", "příroda", "sklizeň"],
    goals: [
      "Vědět, co se děje v přírodě na podzim.",
      "Znát znaky zimy.",
      "Rozlišit podzim a zimu od jara a léta.",
    ],
    boundaries: [
      "Těžiště je podzim a zima.",
      "Jaro a léto se objevují jen jako protiklad v možnostech, neprobírají se.",
    ],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na podzim padá listí a sklízíme. V zimě padá sníh a je zima.",
      steps: ["Přečti větu.", "Děje se to na podzim nebo v zimě?"],
      commonMistake: "Stromy kvetou na jaře, ne v zimě.",
      example: "Na podzim padá listí, v zimě padá sníh.",
    },
  },
];
