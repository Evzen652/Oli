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
  /** [malá, velká] nápověda — obě vlastní pro tuto větu. */
  hints: [string, string];
  solution: string;
  /** Proč je chybná volba (opak klíče) špatně. */
  feedback: string;
}

function toTask(item: TrueFalseItem): PracticeTask {
  const wrong = item.correct ? NE : ANO;
  return {
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [...item.hints],
    explanation: item.solution,
    optionFeedback: { [wrong]: item.feedback },
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3) pro 2. ročník.
//   L1 = rozpoznání izolovaného faktu o podzimu a zimě (co se děje na
//        podzim, znaky zimy) — formát Ano/Ne (2 možnosti), jen zde.
//   L2 = aplikace: přiřazení jevu ke správnému ročnímu období,
//        rozpoznání období podle popisu — výběr ze 4 možností.
//   L3 = transfer: kombinace dvou znaků období, rozlišení blízkých
//        jevů (podzim vs. zima), „proč“ otázky, pořadí období, oprava
//        miskoncepce — vždy 4 možnosti, žádné Ano/Ne.
// Každá úloha: 2 vlastní nápovědy (malá → velká), vysvětlení PROČ
// a optionFeedback ke každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Na podzim padá listí ze stromů. Je to pravda?",
    correct: true,
    emoji: "🍂",
    hints: [
      "Listnaté stromy se na podzim připravují na zimu — co se děje s jejich listy?",
      "Vzpomeň si na chodník v říjnu: šustí pod nohama žluté a červené listy a stromy jsou čím dál holejší. Kam se listy poděly?",
    ],
    solution: "Na podzim padá listí — stromy se připravují na zimu a shazují listy.",
    feedback: "Padání listí je hlavní znak podzimu, věta tedy platí.",
  },
  {
    question: "V zimě padá sníh. Je to pravda?",
    correct: true,
    emoji: "❄️",
    hints: [
      "Sníh vzniká, když je velká zima — patří k zimě, nebo k létu?",
      "Když teplota klesne pod nulu, místo dešťových kapek padají z mraků bílé vločky. Kdy si z nich stavíš sněhuláka?",
    ],
    solution: "V zimě padá sníh — teploty klesnou pod nulu a místo deště padá sníh.",
    feedback: "Sněžení patří právě k zimě, věta platí.",
  },
  {
    question: "V zimě kvetou na stromech květy. Je to pravda?",
    correct: false,
    emoji: "🌳",
    hints: [
      "Stromy kvetou, když je teplo — je v zimě teplo?",
      "Představ si strom v lednu: je holý, na větvích leží sníh a jen pupeny čekají na teplo. Kdy se z pupenů rozvinou květy?",
    ],
    solution: "V zimě stromy nekvetou — kvetou na jaře, v zimě jsou holé bez listí i květů.",
    feedback: "Stromy kvetou na jaře. V zimě jsou holé, takže věta neplatí.",
  },
  {
    question: "Na podzim sklízíme na zahradě jablka. Je to pravda?",
    correct: true,
    emoji: "🍎",
    hints: [
      "Jablka na stromech dozrávají na konci léta a na podzim — kdy je tedy trháme?",
      "Na jaře jabloň kvete, v létě rostou malá zelená jablíčka a pak se zbarví do červena. Kdy je potom sklízíme do beden na zimu?",
    ],
    solution: "Na podzim sklízíme jablka — dozrávají na stromech v září a říjnu.",
    feedback: "Jablka se opravdu sklízejí na podzim, věta platí.",
  },
  {
    question: "V zimě bývá chladno a mrzne. Je to pravda?",
    correct: true,
    emoji: "🥶",
    hints: [
      "Zima je nejchladnější roční období — bývá mráz a sníh.",
      "Vzpomeň si, proč v zimě nosíme čepici a rukavice a proč je na kalužích led. Jaká asi bývá venku teplota?",
    ],
    solution: "V zimě bývá chladno a mrzne — teploty klesají pod nulu a může padat sníh.",
    feedback: "Zima je nejchladnější období a mrzne v ní, věta platí.",
  },
  {
    question: "Na podzim je horko jako uprostřed léta. Je to pravda?",
    correct: false,
    emoji: "🧥",
    hints: [
      "Na podzim se ochlazuje — proč si bereme kabát?",
      "Porovnej podzim s létem: v létě chodíme v kraťasech a koupeme se, na podzim si bereme bundu a fouká studený vítr.",
    ],
    solution: "Na podzim není horko jako v létě — ochlazuje se a bereme si kabát a bundu.",
    feedback: "Na podzim se ochlazuje, horko jako v létě už bývá jen výjimečně. Věta neplatí.",
  },
  {
    question: "V zimě může zamrznout rybník. Je to pravda?",
    correct: true,
    emoji: "⛸️",
    hints: [
      "Když jsou velké mrazy, voda tuhne v led — stane se to i s rybníkem?",
      "Vzpomeň si na bruslení venku. Aby se dalo bruslit na rybníce, musí být jeho hladina pevná. Kdy se to může stát?",
    ],
    solution: "V zimě zamrzá rybník — při velkém mrazu se hladina pokryje ledem.",
    feedback: "Při zimních mrazech rybník opravdu zamrzá, věta platí.",
  },
  {
    question: "Na podzim listí žloutne a červená. Je to pravda?",
    correct: true,
    emoji: "🍁",
    hints: [
      "Než listí opadá, změní barvu — ze zelené na jakou?",
      "Vzpomeň si na podzimní park nebo na obrázky, které malujete ve škole z listů. Jaké barvy tam převládají?",
    ],
    solution: "Na podzim listí žloutne a červená — než opadne, změní barvu.",
    feedback: "Listí se na podzim opravdu zbarvuje do žluta a červena, věta platí.",
  },
  {
    question: "V zimě nosíme čepici, rukavice a šálu. Je to pravda?",
    correct: true,
    emoji: "🧣",
    hints: [
      "Před čím nás v zimě chrání teplé oblečení?",
      "Když je venku mráz, zebou nás nejvíc uši, prsty a krk. Čím si je v zimě zakryjeme, když jdeme ven?",
    ],
    solution: "V zimě nosíme čepici, rukavice a šálu — chrání nás před zimou a mrazem.",
    feedback: "Teplé oblečení v zimě opravdu nosíme, věta platí.",
  },
  {
    question: "V zimě se chodíme koupat do rybníka. Je to pravda?",
    correct: false,
    emoji: "❄️",
    hints: [
      "Rybník je v zimě zamrzlý — dalo by se v něm plavat?",
      "Koupání venku patří k největšímu horku. V zimě je voda ledová a hladinu často pokrývá led. Šel bys tam plavat?",
    ],
    solution: "V zimě se v rybníku nekoupeme — voda je ledová a hladina bývá zamrzlá.",
    feedback: "V zimě je rybník ledový nebo zamrzlý. Koupeme se v létě, takže věta neplatí.",
  },
  {
    question: "Na podzim často fouká vítr. Je to pravda?",
    correct: true,
    emoji: "🌬️",
    hints: [
      "Co pomáhá shazovat listí ze stromů?",
      "Vzpomeň si, kdy děti pouštějí na strništi draky. K tomu je potřeba silný vítr. Ve kterém období to bývá?",
    ],
    solution: "Na podzim často fouká vítr — pomáhá shazovat listí ze stromů.",
    feedback: "Na podzim bývá větrno, proto se pouštějí draci. Věta platí.",
  },
  {
    question: "V zimě si ze sněhu stavíme sněhuláka. Je to pravda?",
    correct: true,
    emoji: "⛄",
    hints: [
      "Ze sněhových koulí skládáme postavičku — kdy máme dost sněhu?",
      "Na sněhuláka potřebuješ tři velké koule, mrkev a hrnec. Hlavně ale hodně sněhu. Ve kterém období ho napadne nejvíc?",
    ],
    solution: "V zimě stavíme sněhuláka — ze sněhových koulí složíme postavičku.",
    feedback: "Sněhuláka stavíme v zimě, když leží sníh. Věta platí.",
  },
  {
    question: "Na podzim rostou v lese houby. Je to pravda?",
    correct: true,
    emoji: "🍄",
    hints: [
      "Kdy se v lese chodí na hřiby a další houby?",
      "Houby mají rády vlhko po deštích, ale ještě ne mráz. Kdy chodí houbaři s košíkem do lesa nejčastěji?",
    ],
    solution: "Na podzim rostou v lese houby — chodíme na hřiby, křemenáče a další.",
    feedback: "Podzim je hlavní doba hub, věta platí.",
  },
  {
    question: "V zimě dozrávají na zahradě jahody. Je to pravda?",
    correct: false,
    emoji: "🍓",
    hints: [
      "Jahody potřebují teplo — dozrávají v zimě, nebo v teplém období?",
      "Jahody sbíráme v době, kdy je horko a svítí slunce. V zimě je záhon pod sněhem a rostliny odpočívají.",
    ],
    solution: "V zimě jahody nedozrávají — jsou to letní plody a zrají v teple.",
    feedback: "Jahody dozrávají v létě. V zimě je záhon pod sněhem, takže věta neplatí.",
  },
  {
    question: "Na podzim vykopáváme ze země brambory. Je to pravda?",
    correct: true,
    emoji: "🥔",
    hints: [
      "Brambory rostou pod zemí — kdy je sklízíme?",
      "Brambory se sázejí na jaře a přes léto rostou. Až jejich nať uschne, vykopou se a uloží do sklepa na zimu. Kdy to bývá?",
    ],
    solution: "Na podzim sklízíme brambory — vykopáváme je ze země v září a říjnu.",
    feedback: "Brambory se opravdu sklízejí na podzim, věta platí.",
  },
  {
    question: "V zimě jsou dny krátké a brzy se stmívá. Je to pravda?",
    correct: true,
    emoji: "🌙",
    hints: [
      "V zimě slunce vychází pozdě a zapadá brzy — jsou dny dlouhé, nebo krátké?",
      "Vzpomeň si, jestli je v zimě po návratu ze školy odpoledne ještě světlo, nebo už se musí rozsvítit lampy.",
    ],
    solution: "V zimě jsou dny krátké — slunce svítí málo hodin a brzy se setmí.",
    feedback: "V zimě jsou dny nejkratší a brzy se stmívá, věta platí.",
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
      "Všechny tři znaky patří ke stejnému období. Padání listí a sklizeň přicházejí hned po létě, když se začíná ochlazovat.",
    ],
    explanation:
      "Padání barevného listí, sklizeň jablek a houby jsou znaky podzimu. V zimě je sníh a mráz, na jaře příroda teprve raší.",
    optionFeedback: {
      Zima: "V zimě jsou stromy už holé a sklizeň je dávno hotová.",
      Jaro: "Na jaře listí raší, nepadá.",
      Léto: "V létě jsou listy zelené a jablka ještě nedozrála.",
    },
  },
  {
    question: "Padá sníh, mrzne a rybníky jsou zamrzlé. Které je to roční období?",
    correctAnswer: "Zima",
    options: ["Podzim", "Zima", "Jaro", "Léto"],
    emoji: "❄️",
    hints: [
      "Kdy je největší mráz a voda zamrzá v led?",
      "Sníh a led vydrží jen tehdy, když je dlouho pod nulou. Které období roku je nejchladnější?",
    ],
    explanation:
      "Sníh, mráz a zamrzlé rybníky jsou znaky zimy — nejchladnějšího období. Na podzim se teprve ochlazuje, ale sníh a led ještě většinou nejsou.",
    optionFeedback: {
      Podzim: "Na podzim se ochlazuje, ale rybníky ještě většinou nezamrzají.",
      Jaro: "Na jaře sníh taje a led mizí.",
      Léto: "V létě je horko, sníh a led nejsou.",
    },
  },
  {
    question: "Co z toho patří k zimě?",
    correctAnswer: "Stavění sněhuláka na zahradě",
    options: ["Sklízení brambor ze země", "Rašení nových zelených listů", "Stavění sněhuláka na zahradě", "Zrání jahod na záhonu"],
    emoji: "⛄",
    hints: [
      "Hledej to, co jde dělat jen tehdy, když napadne sníh.",
      "Přiřaď každou možnost k období: sklizeň brambor je podzimní, rašení listů jarní, jahody letní. Která věc zbude pro zimu?",
    ],
    explanation:
      "Stavění sněhuláka patří k zimě, kdy je sníh. Sklizeň brambor je podzimní, rašení listů jarní a zrání jahod letní.",
    optionFeedback: {
      "Sklízení brambor ze země": "Brambory se sklízejí na podzim, v zimě je zem zmrzlá.",
      "Rašení nových zelených listů": "Listy raší na jaře.",
      "Zrání jahod na záhonu": "Jahody zrají v létě.",
    },
  },
  {
    question: "Co dělají listnaté stromy na podzim?",
    correctAnswer: "Listí jim žloutne a opadává",
    options: ["Raší jim nové zelené listy", "Kvetou jim bílé a růžové květy", "Zrají na nich zralé jahody", "Listí jim žloutne a opadává"],
    emoji: "🍁",
    hints: [
      "Co se stane s listím, než přijde zima?",
      "Stromy se na podzim připravují na mráz. Jejich listy změní barvu a pak je vítr sfoukne na zem. Která možnost to popisuje?",
    ],
    explanation:
      "Na podzim listnatým stromům listí zežloutne a opadá — připravují se na zimu. Rašení a kvetení jsou naopak jarní znaky.",
    optionFeedback: {
      "Raší jim nové zelené listy": "Nové listy raší na jaře.",
      "Kvetou jim bílé a růžové květy": "Stromy kvetou na jaře.",
      "Zrají na nich zralé jahody": "Jahody nerostou na stromech, ale na nízkých rostlinách na záhonu.",
    },
  },
  {
    question: "Kdy ptáci jako vlaštovky odlétají do teplých krajů?",
    correctAnswer: "Na podzim",
    options: ["Na podzim", "V zimě", "Na jaře", "V létě"],
    emoji: "🐦",
    hints: [
      "Ptáci odlétají dřív, než přijdou mrazy a nedostatek potravy.",
      "Vlaštovky se na konci léta shromažďují na drátech a pak odletí. Musí to stihnout, než napadne sníh. Které období to je?",
    ],
    explanation:
      "Vlaštovky a další tažní ptáci odlétají na podzim, aby unikli zimě a nedostatku potravy. Zpět se vracejí až na jaře.",
    optionFeedback: {
      "V zimě": "V zimě už by bylo pozdě, vlaštovky jsou v té době dávno pryč.",
      "Na jaře": "Na jaře se vlaštovky naopak vracejí.",
      "V létě": "V létě vlaštovky u nás vyvádějí mláďata.",
    },
  },
  {
    question: "Který znak je typický pro zimní den?",
    correctAnswer: "Je krátký, mrzne a leží sníh",
    options: [
      "Je dlouhý, horký a svítí slunce dlouho do večera",
      "Je krátký, mrzne a leží sníh",
      "Stromy kvetou a vracejí se ptáci",
      "Zrají jahody a chodíme se koupat",
    ],
    emoji: "🌨️",
    hints: [
      "V zimě je den nejkratší a je největší chlad.",
      "Zkontroluj každou možnost: odpovídá délce dne, teplotě i tomu, co je venku vidět? Dlouhé horké dny a kvetení patří k jiným obdobím.",
    ],
    explanation:
      "Zimní den je krátký, mrzne a leží sníh. Dlouhé horké dny patří k létu, kvetení a návrat ptáků k jaru.",
    optionFeedback: {
      "Je dlouhý, horký a svítí slunce dlouho do večera": "Dlouhé horké dny jsou v létě.",
      "Stromy kvetou a vracejí se ptáci": "Kvetení a návrat ptáků jsou znaky jara.",
      "Zrají jahody a chodíme se koupat": "Jahody a koupání patří k létu.",
    },
  },
  {
    question: "Na stromech je barevné listí, které pomalu opadává, a fouká chladný vítr. Které je to období?",
    correctAnswer: "Podzim",
    options: ["Zima", "Jaro", "Podzim", "Léto"],
    emoji: "🌬️",
    hints: [
      "Kdy stromy shazují zežloutlé a zčervenalé listí?",
      "Barevné padající listí je hlavní znak jednoho období. Chladný vítr říká, že léto už skončilo, ale sníh ještě nepadá.",
    ],
    explanation:
      "Barevné padající listí a chladný vítr patří k podzimu. V zimě už jsou stromy holé, na jaře jim listy teprve raší.",
    optionFeedback: {
      Zima: "V zimě už jsou stromy holé, listí opadalo dřív.",
      Jaro: "Na jaře listy raší a jsou zelené.",
      Léto: "V létě jsou listy zelené a bývá teplo.",
    },
  },
  {
    question: "Ke kterému období patří sáňkování a bruslení na zamrzlém rybníku?",
    correctAnswer: "K zimě",
    options: ["K podzimu", "K jaru", "K létu", "K zimě"],
    emoji: "🛷",
    hints: [
      "K čemu potřebujeme sníh a led?",
      "Na saně potřebuješ zasněžený kopec a na brusle pevný led. Obojí vydrží jen při mrazu. Kdy mrzne nejvíc?",
    ],
    explanation:
      "Sáňkování a bruslení patří k zimě — potřebujeme k nim sníh a led. Ty jsou jen v nejchladnějším období roku.",
    optionFeedback: {
      "K podzimu": "Na podzim ještě většinou nesněží a rybníky nezamrzají.",
      "K jaru": "Na jaře sníh i led tají.",
      "K létu": "V létě je horko, sníh ani led nejsou.",
    },
  },
  {
    question: "Co si vezmeš na sebe, když jdeš ven za mrazivého zimního dne?",
    correctAnswer: "Teplou bundu, čepici, šálu a rukavice",
    options: [
      "Teplou bundu, čepici, šálu a rukavice",
      "Lehké tričko, kraťasy a sluneční brýle",
      "Plavky a ručník na koupání",
      "Tenkou košili a sandály",
    ],
    emoji: "🧤",
    hints: [
      "V mrazu se musíme dobře zahřát.",
      "Mysli na části těla, které v mrazu zebou nejvíc: hlava, krk, ruce. Která možnost chrání všechny najednou?",
    ],
    explanation:
      "Za mrazu si oblékáme teplou bundu, čepici, šálu a rukavice, abychom se nenachladili. Lehké letní oblečení je do zimy nevhodné.",
    optionFeedback: {
      "Lehké tričko, kraťasy a sluneční brýle": "To je letní oblečení, v mrazu by ti byla zima.",
      "Plavky a ručník na koupání": "Plavky patří k letnímu koupání, ne do mrazu.",
      "Tenkou košili a sandály": "Košile a sandály tě v mrazu nezahřejí.",
    },
  },
  {
    question: "Veverka si na podzim schovává oříšky a žaludy. Proč to dělá?",
    correctAnswer: "Dělá si zásoby jídla na zimu",
    options: ["Chce si s nimi jen hrát", "Dělá si zásoby jídla na zimu", "Rozdává je ostatním zvířatům", "Sází je, aby z nich vyrostly stromy"],
    emoji: "🐿️",
    hints: [
      "V zimě je venku málo potravy — co si zvíře musí připravit dopředu?",
      "Přemýšlej, čím se bude veverka živit, až napadne sníh a na stromech nic nebude. Kam si ty oříšky asi schovává a proč?",
    ],
    explanation:
      "Veverka si na podzim dělá zásoby na zimu, kdy je venku málo potravy. Schované oříšky a žaludy jí pomohou zimu přečkat.",
    optionFeedback: {
      "Chce si s nimi jen hrát": "Veverka oříšky schovává, aby je v zimě snědla.",
      "Rozdává je ostatním zvířatům": "Veverka si oříšky schovává pro sebe.",
      "Sází je, aby z nich vyrostly stromy": "Ze zapomenutého oříšku někdy strom vyroste, ale veverka si ho schovala k jídlu.",
    },
  },
  {
    question: "Ráno je na trávě jinovatka a v kalužích tenký led, ale sníh ještě neleží. Které období právě začíná?",
    correctAnswer: "Konec podzimu, blíží se zima",
    options: ["Začátek léta, blíží se prázdniny", "Vrcholné léto s velkým horkem", "Konec podzimu, blíží se zima", "Začátek jara, vše rozkvétá"],
    emoji: "🌫️",
    hints: [
      "První mrazíky a led přicházejí, když končí podzim.",
      "Spoj údaje ze zadání: už mrzne, ale sníh ještě neleží. Takové ráno je na hranici mezi dvěma chladnými obdobími.",
    ],
    explanation:
      "Jinovatka a tenký led ráno jsou znakem konce podzimu, kdy se ochlazuje a blíží zima. Horko i kvetení patří k úplně jiným obdobím.",
    optionFeedback: {
      "Začátek léta, blíží se prázdniny": "Na začátku léta je teplo, jinovatka ani led nejsou.",
      "Vrcholné léto s velkým horkem": "V horku voda v kalužích nezamrzne.",
      "Začátek jara, vše rozkvétá": "Když vše rozkvétá, mrazíky už končí. Tady teprve přicházejí.",
    },
  },
  {
    question: "Kdy jsou dny nejkratší a slunce svítí nejméně hodin?",
    correctAnswer: "V zimě",
    options: ["V létě", "Na jaře", "Vždy stejně dlouho", "V zimě"],
    emoji: "🌇",
    hints: [
      "Kdy se stmívá už odpoledne?",
      "Porovnej zimu a léto: kdy chodíš ráno do školy ještě za tmy a odpoledne se svítí lampy? A kdy je světlo až do večera?",
    ],
    explanation:
      "Nejkratší dny jsou v zimě — slunce vychází pozdě a zapadá brzy. V létě jsou dny naopak nejdelší.",
    optionFeedback: {
      "V létě": "V létě jsou dny nejdelší.",
      "Na jaře": "Na jaře se dny prodlužují.",
      "Vždy stejně dlouho": "Délka dne se během roku mění.",
    },
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
      "U každé možnosti se zeptej: děje se to, když se teprve ochlazuje, nebo až při největším chladu? Listí, sklizeň i houby přicházejí dřív.",
    ],
    explanation:
      "Sníh, mráz a led patří k zimě. Padání listí, sklizeň a houby jsou naopak znaky podzimu — proto se hodí spíš k podzimu.",
    optionFeedback: {
      "Padání barevného listí ze stromů": "Listí padá na podzim. V zimě jsou stromy už holé.",
      "Sklizeň jablek a brambor na zahradě": "Sklizeň patří k podzimu, v zimě je zahrada pod sněhem.",
      "Sběr hub v lese": "Houby rostou hlavně na podzim, v zimním mrazu skoro ne.",
    },
  },
  {
    question: "Proč stromy na podzim shazují listí, než přijde zima?",
    correctAnswer: "V zimě by přes listy ztrácely vodu, kterou nemohou z promrzlé půdy doplnit",
    options: [
      "Protože je listí v zimě obtěžuje při kvetení",
      "V zimě by přes listy ztrácely vodu, kterou nemohou z promrzlé půdy doplnit",
      "Protože jim listí na jaře už znovu nenaraší",
      "Protože se chtějí podobat jehličnatým stromům",
    ],
    emoji: "🍂",
    hints: [
      "Strom pije vodu kořeny ze země. Jaká je země v zimě?",
      "Listy stromu neustále vypařují vodu. Když půda zamrzne, kořeny žádnou novou vodu nenasají. Co by se stalo se stromem, kdyby listy nechal?",
    ],
    explanation:
      "Strom shodí listí, protože by přes ně v zimě ztrácel vodu, kterou z promrzlé půdy nedokáže nabrat. Bez listů zimu lépe přečká a na jaře mu narašou nové.",
    optionFeedback: {
      "Protože je listí v zimě obtěžuje při kvetení": "Stromy v zimě nekvetou, kvetou až na jaře.",
      "Protože jim listí na jaře už znovu nenaraší": "Listí na jaře naopak znovu naraší z pupenů.",
      "Protože se chtějí podobat jehličnatým stromům": "Jehličnany své jehličí přes zimu většinou nechávají, takže tohle nedává smysl.",
    },
  },
  {
    question: "Která dvojice znaků patří dohromady k podzimu?",
    correctAnswer: "Padá barevné listí a sklízí se ovoce",
    options: ["Leží sníh a zamrzají rybníky", "Raší listy a rodí se mláďata", "Padá barevné listí a sklízí se ovoce", "Je horko a chodíme se koupat"],
    emoji: "🍁",
    hints: [
      "Obě věci ve dvojici se musí dít ve stejném období.",
      "Zkontroluj každou dvojici po částech: nejdřív první znak, pak druhý. Hledáš dvojici, kde jsou oba znaky podzimní.",
    ],
    explanation:
      "Padání barevného listí i sklizeň ovoce patří k podzimu. Sníh s ledem je zimní, rašení jarní a horko letní — proto ostatní dvojice nesedí.",
    optionFeedback: {
      "Leží sníh a zamrzají rybníky": "Sníh a zamrzlé rybníky jsou znaky zimy.",
      "Raší listy a rodí se mláďata": "Rašení listů a mláďata patří k jaru.",
      "Je horko a chodíme se koupat": "Horko a koupání patří k létu.",
    },
  },
  {
    question: "Proč ptáci jako vlaštovky odlétají na podzim do teplých krajů?",
    correctAnswer: "V zimě by u nás nenašli dost hmyzu a potravy a byla by jim zima",
    options: [
      "Chtějí se v teplých krajích jen koupat v moři",
      "V teplých krajích je v zimě sníh a to mají rádi",
      "Odlétají náhodně, bez důvodu",
      "V zimě by u nás nenašli dost hmyzu a potravy a byla by jim zima",
    ],
    emoji: "🐦",
    hints: [
      "Čím se vlaštovky živí a bude toho v zimě dost?",
      "Spoj dvě věci: vlaštovky loví létající hmyz a v zimě u nás mrzne. Co by vlaštovkám chybělo, kdyby zůstaly?",
    ],
    explanation:
      "Vlaštovky se živí hmyzem, kterého v zimě není dost, a mráz by jim uškodil. Proto na podzim odlétají do tepla a vracejí se až na jaře.",
    optionFeedback: {
      "Chtějí se v teplých krajích jen koupat v moři": "Ptáci necestují kvůli zábavě, ale kvůli potravě a teplu.",
      "V teplých krajích je v zimě sníh a to mají rádi": "V teplých krajích sníh nebývá, proto se jim říká teplé.",
      "Odlétají náhodně, bez důvodu": "Odlétají každý rok ve stejnou dobu a z jasného důvodu.",
    },
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
      "Začni létem a postupuj dál: nejdřív se ochlazuje a padá listí, pak přijdou mrazy a sníh. Která dvě období jsi prošel?",
    ],
    explanation:
      "Po létě přichází nejdřív podzim a teprve pak zima — podzim je přechod mezi teplem a mrazem. Po zimě následuje jaro, ne zase léto.",
    optionFeedback: {
      "Po létě přichází rovnou zima a podzim se vynechá": "Podzim se nikdy nevynechá, je mezi létem a zimou.",
      "Po podzimu přichází zpátky léto": "Po podzimu přichází zima.",
      "Zima přichází hned po jaru": "Po jaru přichází léto, zima je až po podzimu.",
    },
  },
  {
    question: "Na podzim se počasí den ode dne mění. Kterým směrem?",
    correctAnswer: "Postupně se ochlazuje a dny se zkracují",
    options: [
      "Postupně se otepluje a dny se prodlužují",
      "Postupně se ochlazuje a dny se zkracují",
      "Počasí se vůbec nemění, zůstává jako v létě",
      "Je čím dál větší horko",
    ],
    emoji: "🌤️",
    hints: [
      "Podzim je přechod mezi létem a zimou — kam počasí míří?",
      "Porovnej začátek a konec podzimu: v září bývá ještě teplo a světlo dlouho do večera, v listopadu je chladno a brzy tma.",
    ],
    explanation:
      "Na podzim se počasí ochlazuje a dny se zkracují — směřuje k zimě. Oteplování a delší dny patří naopak k jaru.",
    optionFeedback: {
      "Postupně se otepluje a dny se prodlužují": "Oteplování a delší dny patří k jaru.",
      "Počasí se vůbec nemění, zůstává jako v létě": "Na podzim se počasí mění, ochlazuje se.",
      "Je čím dál větší horko": "Na podzim horka ubývá, blíží se zima.",
    },
  },
  {
    question: "Kamarád tvrdí, že houby v lese rostou nejvíc v zimě na sněhu. Jak to opravíš?",
    correctAnswer: "Houby rostou nejvíc na podzim, kdy je vlhko a ještě teplo; v zimě jim mráz nesvědčí",
    options: [
      "Kamarád má pravdu, houby rostou hlavně ve sněhu",
      "Houby rostou nejvíc v zimě, protože mají rády mráz",
      "Houby rostou nejvíc na podzim, kdy je vlhko a ještě teplo; v zimě jim mráz nesvědčí",
      "Houby rostou nejvíc v létě, když je největší sucho",
    ],
    emoji: "🍄",
    hints: [
      "Kdy je v lese vlhko po deštích a přitom ještě není mráz?",
      "Houby potřebují dvě věci zároveň: vlhkou půdu a teplotu nad nulou. Zamysli se, jestli by houba prorazila zmrzlou půdu a sníh.",
    ],
    explanation:
      "Houby rostou nejvíc na podzim, kdy je po deštích vlhko a ještě relativně teplo. V zimě jim mráz a sníh nesvědčí, takže tehdy skoro nerostou.",
    optionFeedback: {
      "Kamarád má pravdu, houby rostou hlavně ve sněhu": "Ve sněhu a zmrzlé půdě houby skoro nerostou. Kamarád se plete.",
      "Houby rostou nejvíc v zimě, protože mají rády mráz": "Mráz houbám škodí, nemají ho rády.",
      "Houby rostou nejvíc v létě, když je největší sucho": "V suchu houby nerostou, potřebují vlhko.",
    },
  },
  {
    question: "Medvěd i ježek se na podzim hodně nakrmí a pak přes zimu spí. Proč to dělají?",
    correctAnswer: "V zimě je málo potravy, a tak zimu prospí a šetří nastřádanou energii",
    options: [
      "V zimě je moc jídla, a tak nemusí nic dělat",
      "Spí, protože se v zimě nudí",
      "Spí proto, aby jim narostl nový kožich",
      "V zimě je málo potravy, a tak zimu prospí a šetří nastřádanou energii",
    ],
    emoji: "🐻",
    hints: [
      "Spoj dvě věci: v zimě není co jíst a spánek šetří sílu.",
      "Rozmysli nejdřív, proč se na podzim tolik najedí, a pak, z čeho jejich tělo žije, když celou zimu spí a nic nejí.",
    ],
    explanation:
      "V zimě je venku málo potravy, proto se medvěd i ježek na podzim vykrmí a zimu prospí. Během spánku tělo šetří nastřádanou energii, dokud zase nepřijde teplo.",
    optionFeedback: {
      "V zimě je moc jídla, a tak nemusí nic dělat": "V zimě je jídla naopak málo.",
      "Spí, protože se v zimě nudí": "Nuda to není. Spánek jim pomáhá přežít zimu bez potravy.",
      "Spí proto, aby jim narostl nový kožich": "Kožich spánkem neroste. Spí, protože v zimě nemají co jíst.",
    },
  },
  {
    question: "Na podzim se dny zkracují. Jaké jsou dny v zimě ve srovnání s podzimem?",
    correctAnswer: "Ještě kratší",
    options: ["Ještě kratší", "Delší než na podzim", "Úplně stejné jako na podzim", "Delší než v létě"],
    emoji: "🌗",
    hints: [
      "Zkracování dnů po podzimu pokračuje dál.",
      "Postupuj krok za krokem: v létě jsou dny nejdelší, na podzim se zkracují. Co se s nimi stane, když podzim skončí a přijde zima?",
    ],
    explanation:
      "Dny se od léta pořád zkracují a nejkratší jsou v zimě. Proto jsou zimní dny ještě kratší než podzimní.",
    optionFeedback: {
      "Delší než na podzim": "Dny se začínají prodlužovat až na jaře. V zimě jsou nejkratší.",
      "Úplně stejné jako na podzim": "Zkracování dnů pokračuje, zimní dny jsou kratší.",
      "Delší než v létě": "V létě jsou dny nejdelší ze všech období.",
    },
  },
  {
    question: "Seřaď léto, podzim a zimu od nejteplejšího po nejchladnější.",
    correctAnswer: "Léto, podzim, zima",
    options: ["Léto, podzim, zima", "Podzim, léto, zima", "Zima, podzim, léto", "Léto, zima, podzim"],
    emoji: "🌡️",
    hints: [
      "Začni obdobím největšího horka a skonči obdobím, kdy mrzne.",
      "Najdi nejdřív nejteplejší a nejchladnější období. Třetí období leží mezi nimi: už se ochlazuje, ale sníh ještě nebývá.",
    ],
    explanation:
      "Nejteplejší je léto, pak přijde podzim, kdy se ochlazuje, a nejchladnější je zima. Podzim je přechod mezi létem a zimou.",
    optionFeedback: {
      "Podzim, léto, zima": "Léto je teplejší než podzim, musí být první.",
      "Zima, podzim, léto": "Tohle je pořadí od nejchladnějšího po nejteplejší, tedy obráceně.",
      "Léto, zima, podzim": "Zima je chladnější než podzim, musí být až na konci.",
    },
  },
  {
    question: "Padá barevné listí a na poli se sklízejí brambory. Který další znak patří do stejného období?",
    correctAnswer: "V lese rostou houby",
    options: ["V lese rostou houby", "Kvetou sněženky", "Stavíme sněhuláka", "Dozrávají jahody"],
    emoji: "🥔",
    hints: [
      "Nejdřív urči, o které období jde, a teprve pak hledej další znak.",
      "Padání listí a sklizeň brambor patří k době po létě. U každé možnosti se zeptej, jestli se děje ve stejném období, nebo jindy.",
    ],
    explanation:
      "Padání listí i sklizeň brambor patří k podzimu. Na podzim také rostou v lese houby. Sněženky kvetou na jaře, sněhulák patří k zimě a jahody k létu.",
    optionFeedback: {
      "Kvetou sněženky": "Sněženky kvetou na konci zimy a na jaře.",
      "Stavíme sněhuláka": "Sněhuláka stavíme v zimě.",
      "Dozrávají jahody": "Jahody dozrávají v létě.",
    },
  },
  {
    question: "Kamarád tvrdí, že zamrzlý rybník na bruslení je typický znak podzimu. Jak ho opravíš?",
    correctAnswer: "Rybník zamrzá v zimě, na podzim ještě velké mrazy nebývají",
    options: [
      "Má pravdu, rybník zamrzá hned, jak spadne listí",
      "Rybník zamrzá v zimě, na podzim ještě velké mrazy nebývají",
      "Rybník zamrzá v létě v noci",
      "Rybník zamrzá na jaře, když taje sníh",
    ],
    emoji: "⛸️",
    hints: [
      "Přemýšlej, kdy je takový mráz, že voda zamrzne na pevný led.",
      "Na podzim bývá ráno nanejvýš tenký led v kalužích. Aby se dalo bruslit na rybníce, musí mrznout mnoho dní za sebou.",
    ],
    explanation:
      "Zamrzlý rybník je znak zimy, ne podzimu. Na podzim ještě tak velké a dlouhé mrazy většinou nejsou.",
    optionFeedback: {
      "Má pravdu, rybník zamrzá hned, jak spadne listí": "Když padá listí, bývá ještě nad nulou. Rybník zamrzá později.",
      "Rybník zamrzá v létě v noci": "V létě je i v noci teplo, voda nezamrzá.",
      "Rybník zamrzá na jaře, když taje sníh": "Na jaře led naopak taje.",
    },
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
