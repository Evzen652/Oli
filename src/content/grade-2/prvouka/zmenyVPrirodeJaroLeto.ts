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
//   L1 = rozpoznání izolovaného faktu o jaru a létu (co se děje na
//        jaře, znaky léta) — formát Ano/Ne (2 možnosti).
//   L2 = aplikace: přiřazení jevu ke správnému ročnímu období,
//        rozpoznání období podle popisu — výběr ze 4 možností.
//   L3 = transfer: kombinace dvou znaků období, rozlišení blízkých
//        jevů (jaro vs. léto), „proč“ otázky spojující dvě informace
//        — většinou 4 možnosti, jen menšina Ano/Ne.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Na jaře kvetou květiny. Je to pravda?",
    correct: true,
    emoji: "🌷",
    hint: "Na jaře se příroda probouzí a otepluje — co dělají květiny?",
    solution: "Na jaře kvetou květiny — příroda se probouzí po zimě.",
  },
  {
    question: "V létě je teplo. Je to pravda?",
    correct: true,
    emoji: "☀️",
    hint: "Léto je nejteplejší roční období — chodíme v tričku nebo plavkách.",
    solution: "V létě je teplo — léto je nejteplejší roční období.",
  },
  {
    question: "Na jaře padá sníh a je velká zima. Je to pravda?",
    correct: false,
    emoji: "❄️",
    hint: "Na jaře se otepluje — co se děje se sněhem z předchozí zimy?",
    solution: "Na jaře už sníh většinou nepadá — otepluje se a zbylý sníh taje. Sněžení patří do zimy.",
  },
  {
    question: "V létě se chodíme koupat. Je to pravda?",
    correct: true,
    emoji: "🏊",
    hint: "Léto je teplé — chodíme k vodě nebo na koupaliště.",
    solution: "V létě se koupeme — je horko a voda nás příjemně ochladí.",
  },
  {
    question: "Na jaře raší stromům nové listy. Je to pravda?",
    correct: true,
    emoji: "🌱",
    hint: "Stromy jsou v zimě holé — co se stane, když se na jaře oteplí?",
    solution: "Na jaře raší listy — z pupenů na větvích se rozvíjejí nové zelené lístky.",
  },
  {
    question: "V létě nosíme čepici a rukavice. Je to pravda?",
    correct: false,
    emoji: "🧤",
    hint: "Čepici a rukavice nosíme, když je zima — je v létě zima?",
    solution: "V létě čepici a rukavice nenosíme — je teplo, oblékáme si lehké oblečení.",
  },
  {
    question: "Na jaře se vracejí ptáci z teplých krajů. Je to pravda?",
    correct: true,
    emoji: "🐦",
    hint: "Některé ptáky, třeba vlaštovky, přes zimu nevidíme — vrátí se na jaře?",
    solution: "Na jaře se vracejí ptáci — třeba vlaštovky, které zimu tráví v teplých krajích.",
  },
  {
    question: "V létě jsou dlouhé dny. Je to pravda?",
    correct: true,
    emoji: "☀️",
    hint: "V létě svítí slunce hodně dlouho — jsou dny kratší, nebo delší?",
    solution: "V létě jsou dlouhé dny — slunce vychází brzy a zapadá pozdě.",
  },
  {
    question: "Na jaře všechno v přírodě usychá. Je to pravda?",
    correct: false,
    emoji: "🌷",
    hint: "Na jaře se příroda probouzí a roste — usychá, nebo kvete?",
    solution: "Na jaře příroda neusychá — naopak se probouzí, kvete a zelená se.",
  },
  {
    question: "V létě dozrávají jahody. Je to pravda?",
    correct: true,
    emoji: "🍓",
    hint: "Jahody sklízíme, když je teplo — jsou sladké a červené.",
    solution: "V létě dozrávají jahody — jsou jedním z prvních letních plodů.",
  },
  {
    question: "Na jaře se rodí mláďata. Je to pravda?",
    correct: true,
    emoji: "🐣",
    hint: "Na jaře se příroda obnovuje — co se děje se zvířaty?",
    solution: "Na jaře se rodí mláďata — zvířata přivádějí na svět potomky.",
  },
  {
    question: "V létě zamrzá rybník a bruslí se na něm. Je to pravda?",
    correct: false,
    emoji: "⛸️",
    hint: "Rybník zamrzá, když je velká zima — je v létě zima?",
    solution: "V létě rybník nezamrzá — zamrzá v zimě, kdy jsou teploty pod nulou.",
  },
  {
    question: "Na jaře je tepleji než v zimě. Je to pravda?",
    correct: true,
    emoji: "🌡️",
    hint: "Srovnej jaro a zimu — kde je tepleji?",
    solution: "Na jaře je tepleji než v zimě — teploty stoupají a sníh taje.",
  },
  {
    question: "Na jaře kvetou ovocné stromy. Je to pravda?",
    correct: true,
    emoji: "🌸",
    hint: "Stromy se na jaře probouzejí a rozkvétají — třešně a jabloně.",
    solution: "Na jaře kvetou stromy — třešně, jabloně a švestky bývají celé bílé nebo růžové.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Kvetou stromy, rodí se mláďata a vracejí se ptáci z teplých krajů. Které je to roční období?",
    correctAnswer: "Jaro",
    options: ["Jaro", "Léto", "Podzim", "Zima"],
    emoji: "🌸",
    hints: [
      "Přemýšlej, kdy se příroda po zimě probouzí a všechno začíná znovu růst.",
      "Návrat ptáků a mláďata jsou typické pro období hned po zimě.",
    ],
    explanation:
      "Kvetení stromů, mláďata a návrat ptáků jsou znaky jara — příroda se po zimě probouzí. V létě už stromy kvetou jen výjimečně a na podzim ani v zimě ne.",
  },
  {
    question: "Je horko, děti mají prázdniny a chodí se koupat. Které je to roční období?",
    correctAnswer: "Léto",
    options: ["Jaro", "Léto", "Podzim", "Zima"],
    emoji: "🏖️",
    hints: [
      "Kdy je největší teplo a děti nechodí do školy?",
      "Koupání a horko patří k nejteplejšímu období roku.",
    ],
    explanation:
      "Horko, prázdniny a koupání jsou znaky léta — nejteplejšího období roku. Na jaře bývá tepleji než v zimě, ale prázdniny a horko patří k létu.",
  },
  {
    question: "Co z toho patří k létu?",
    correctAnswer: "Zrání jahod na zahradě",
    options: ["Pučení prvních listů na holých stromech", "Padání barevného listí ze stromů", "Zrání jahod na zahradě", "Zamrzání rybníka"],
    emoji: "🍓",
    hints: [
      "Hledej to, co se děje, když je největší teplo.",
      "Pučení listů patří k jaru, padání listí k podzimu, led k zimě.",
    ],
    explanation:
      "Zrání jahod patří k létu. Pučení prvních listů je jarní znak, padání listí podzimní a zamrzání rybníka zimní.",
  },
  {
    question: "Co dělají stromy na jaře?",
    correctAnswer: "Raší jim nové zelené listy",
    options: ["Opadává jim všechno listí", "Zůstávají úplně holé bez pupenů", "Jsou pokryté sněhem a ledem", "Raší jim nové zelené listy"],
    emoji: "🌳",
    hints: [
      "Co se stane s holými stromy, když se na jaře oteplí?",
      "Na jaře se z pupenů rozvíjí něco nového a zeleného.",
    ],
    explanation:
      "Na jaře stromům raší nové listy — z pupenů se rozvíjejí zelené lístky. Opadávání listí patří k podzimu, holé zasněžené stromy k zimě.",
  },
  {
    question: "Kdy se ptáci vracejí z teplých krajů zpátky k nám?",
    correctAnswer: "Na jaře",
    options: ["Na jaře", "V létě", "Na podzim", "V zimě"],
    emoji: "🐦",
    hints: [
      "Ptáci odlétají do tepla na zimu — kdy se asi vracejí?",
      "Vracejí se, když se u nás začne oteplovat a příroda probouzet.",
    ],
    explanation:
      "Ptáci se vracejí na jaře, když se u nás oteplí. Na podzim naopak odlétají do teplých krajů, aby unikli zimě.",
  },
  {
    question: "Který znak je typický pro letní den?",
    correctAnswer: "Je dlouhý, teplý a svítí slunce dlouho do večera",
    options: ["Je krátký a brzy se stmívá", "Je dlouhý, teplý a svítí slunce dlouho do večera", "Celý den mrzne a padá sníh", "Ráno bývá jinovatka a led na kalužích"],
    emoji: "☀️",
    hints: [
      "Porovnej léto se zimou — kdy je den delší a kdy bývá nejtepleji?",
      "Krátké dny a mráz patří k zimě, ne k létu.",
    ],
    explanation:
      "Letní den je dlouhý a teplý a slunce svítí až do večera. Krátké dny, mráz a led jsou znaky zimy.",
  },
  {
    question: "Sníh z minulé zimy taje a potůčky jsou plné vody. Které je to období?",
    correctAnswer: "Jaro",
    options: ["Léto", "Podzim", "Jaro", "Zima"],
    emoji: "💧",
    hints: [
      "Kdy se otepluje tak, že sníh taje a mizí?",
      "Tání sněhu je znakem toho, že končí zima a začíná teplejší období.",
    ],
    explanation:
      "Tání sněhu patří k jaru — otepluje se a sníh se mění na vodu. V zimě sníh naopak přibývá a v létě už žádný není.",
  },
  {
    question: "Ke kterému období patří dozrávání třešní a meruněk?",
    correctAnswer: "K létu",
    options: ["K zimě", "K podzimu", "K jaru", "K létu"],
    emoji: "🍒",
    hints: [
      "Ovoce dozrává, když je hodně tepla a slunce.",
      "Na jaře stromy teprve kvetou — plody z květů uzrají později.",
    ],
    explanation:
      "Třešně a meruňky dozrávají v létě, kdy je nejvíc tepla a slunce. Na jaře stromy teprve kvetou, plody uzrají až potom.",
  },
  {
    question: "Včely létají od květu ke květu a sbírají pyl. Kdy to začíná?",
    correctAnswer: "Na jaře, když rozkvétají první květiny",
    options: [
      "Na jaře, když rozkvétají první květiny",
      "V zimě, když je nejvíc sněhu",
      "Jen v noci, když je tma",
      "Nikdy, včely pyl nesbírají",
    ],
    emoji: "🐝",
    hints: [
      "Včely potřebují ke sběru pylu rozkvetlé květiny.",
      "Ve kterém období se po zimě příroda probouzí a všechno začíná růst a kvést?",
    ],
    explanation:
      "Včely začínají sbírat pyl na jaře, když rozkvétají první květiny. V zimě květiny nekvetou, takže včely zůstávají v úlu.",
  },
  {
    question: "Co si vezmeš na sebe za horkého letního dne?",
    correctAnswer: "Lehké tričko, kraťasy a čepici proti slunci",
    options: ["Zimní bundu, rukavice a šálu", "Lehké tričko, kraťasy a čepici proti slunci", "Silný kabát a zimní boty", "Pláštěnku a gumáky do sněhu"],
    emoji: "👕",
    hints: [
      "V horku nám je dobře v lehkém oblečení.",
      "Zimní bunda a rukavice by ti v horku byly příliš teplé.",
    ],
    explanation:
      "V létě si oblékáme lehké tričko a kraťasy a hlavu chráníme čepicí proti slunci. Zimní oblečení by nám v horku bylo nepříjemné.",
  },
  {
    question: "Na loukách kvetou pampelišky a sedmikrásky. Které období právě začalo?",
    correctAnswer: "Jaro",
    options: ["Zima", "Podzim", "Jaro", "Léto"],
    emoji: "🌼",
    hints: [
      "Kdy se louky poprvé po zimě zazelenají a rozkvetou?",
      "První kvítí na loukách patří k probouzející se přírodě.",
    ],
    explanation:
      "První kvítí na loukách, jako pampelišky a sedmikrásky, je znakem jara. V zimě jsou louky holé a zasněžené.",
  },
  {
    question: "Kdy jsou dny nejdelší a slunce svítí nejdéle?",
    correctAnswer: "V létě",
    options: ["V zimě", "Na podzim", "Vždy stejně dlouho", "V létě"],
    emoji: "🌅",
    hints: [
      "V kterém období je ještě večer dlouho světlo?",
      "Porovnej léto a zimu — kdy je den delší?",
    ],
    explanation:
      "Nejdelší dny jsou v létě — slunce vychází brzy a zapadá pozdě. V zimě jsou dny naopak nejkratší.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Na jaře i v létě je tepleji než v zimě. Co je typické spíš pro léto než pro jaro?",
    correctAnswer: "Velké horko a letní prázdniny",
    options: [
      "Velké horko a letní prázdniny",
      "Rašení prvních listů na holých stromech",
      "Rození mláďat a návrat ptáků z teplých krajů",
      "Tání posledního sněhu z minulé zimy",
    ],
    emoji: "🌞",
    hints: [
      "Obě období jsou teplá — hledej to, co je opravdu jen letní.",
      "Rašení, mláďata i tání sněhu patří k jaru, ne k létu.",
    ],
    explanation:
      "Velké horko a prázdniny patří k létu. Rašení listů, mláďata i tání sněhu jsou naopak znaky jara — proto se hodí spíš k jaru.",
  },
  {
    question: "Proč na jaře rozkvétají květiny a stromům raší listy?",
    correctAnswer: "Protože se otepluje a přibývá světla",
    options: ["Protože je čím dál větší zima a mráz", "Protože se otepluje a přibývá světla", "Protože dny jsou čím dál kratší", "Protože začíná padat sníh"],
    emoji: "🌱",
    hints: [
      "Přemýšlej, co se s počasím na jaře mění oproti zimě.",
      "Rostliny potřebují k růstu teplo a světlo.",
    ],
    explanation:
      "Rostliny rozkvétají a raší, protože se na jaře otepluje a přibývá slunečního světla. Zima, mráz a sníh růstu naopak brání.",
  },
  {
    question: "Která dvojice znaků patří dohromady k jaru?",
    correctAnswer: "Pučí listy a rodí se mláďata",
    options: ["Je horko a zrají jahody", "Padá listí a fouká studený vítr", "Pučí listy a rodí se mláďata", "Mrzne a zamrzá rybník"],
    emoji: "🐣",
    hints: [
      "Obě věci se musí dít ve stejném období.",
      "Horko a jahody patří k létu, padání listí k podzimu, led k zimě.",
    ],
    explanation:
      "Pučení listů i rození mláďat patří k jaru. Horko s jahodami je letní, padající listí podzimní a led zimní — proto ostatní dvojice nesedí.",
  },
  {
    question: "Proč se v létě chodíme koupat mnohem častěji než na jaře?",
    correctAnswer: "Protože v létě bývá větší horko a voda nás příjemně ochladí",
    options: ["Protože v létě je voda zamrzlá na led", "Protože v létě je zima a chceme se zahřát", "Protože v létě nikdy nesvítí slunce", "Protože v létě bývá větší horko a voda nás příjemně ochladí"],
    emoji: "🏊",
    hints: [
      "Porovnej počasí na jaře a v létě — kdy bývá nejvíc teplo?",
      "Do vody chodíme hlavně proto, abychom se v horku zchladili.",
    ],
    explanation:
      "V létě je větší horko než na jaře, a proto se chodíme chladit do vody častěji. Voda v létě nezamrzá a slunce svítí dlouho.",
  },
  {
    question: "Které tvrzení o jaru a létu je pravdivé?",
    correctAnswer: "Nejdřív přijde jaro a po něm následuje léto",
    options: [
      "Nejdřív přijde jaro a po něm následuje léto",
      "Nejdřív přijde léto a po něm jaro",
      "Jaro a léto jsou úplně to samé období",
      "Léto přichází hned po podzimu",
    ],
    emoji: "🔄",
    hints: [
      "Vzpomeň si, v jakém pořadí jdou roční období za sebou.",
      "Po zimě přichází jaro, teprve pak nejteplejší období.",
    ],
    explanation:
      "Po zimě přichází nejdřív jaro a teprve pak léto — v tomto pořadí jdou za sebou. Jaro a léto nejsou totéž: jaro je začátek oteplování, léto je největší teplo.",
  },
  {
    question: "Na začátku jara ještě může přijít chladno, ale kterým směrem se počasí celkově mění?",
    correctAnswer: "Postupně se otepluje a dní přibývá světla",
    options: ["Postupně se ochlazuje a dny se zkracují", "Postupně se otepluje a dní přibývá světla", "Počasí se vůbec nemění, zůstává jako v zimě", "Padá čím dál víc sněhu"],
    emoji: "🌤️",
    hints: [
      "Jaro je přechod mezi zimou a létem — kam počasí míří?",
      "Přemýšlej, jestli se dny na jaře prodlužují, nebo zkracují.",
    ],
    explanation:
      "Na jaře se počasí celkově otepluje a dny se prodlužují — směřuje k létu. Ochlazování a kratší dny patří naopak k podzimu.",
  },
  {
    question: "Kamarád tvrdí, že jahody dozrávají v zimě. Jak to opravíš?",
    correctAnswer: "Jahody dozrávají v létě, protože potřebují hodně tepla a slunce",
    options: ["Kamarád má pravdu, jahody dozrávají v zimě na sněhu", "Jahody dozrávají v zimě, protože je zima nejteplejší", "Jahody dozrávají v létě, protože potřebují hodně tepla a slunce", "Jahody vůbec nedozrávají, rostou stále stejné"],
    emoji: "🍓",
    hints: [
      "Kdy je nejvíc tepla a slunce, které ovoce potřebuje ke zrání?",
      "V zimě je mráz a sníh — mohlo by ovoce takhle uzrát?",
    ],
    explanation:
      "Jahody dozrávají v létě, kdy je nejvíc tepla a slunce. V zimě je mráz a sníh, takže ovoce tehdy zrát nemůže.",
  },
  {
    question: "Na jaře stromy kvetou. Proč na nich potom v létě najdeme ovoce?",
    correctAnswer: "Z jarních květů se během tepla vyvinou plody, které v létě dozrají",
    options: ["Ovoce spadne na strom z nebe hotové", "Ovoce na stromě bylo celou zimu a jen roztálo", "Květy a ovoce spolu vůbec nesouvisí", "Z jarních květů se během tepla vyvinou plody, které v létě dozrají"],
    emoji: "🍎",
    hints: [
      "Spoj dvě věci: nejdřív květ na jaře, potom plod v létě.",
      "Přemýšlej, co na místě květu na stromě zůstane a dál roste.",
    ],
    explanation:
      "Z jarních květů se postupně vyvinou plody, které během letního tepla dozrají. Kvetení a zrání ovoce tak spolu souvisejí — jedno navazuje na druhé.",
  },
  {
    question: "V zimě jsou dny kratší než v létě. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🌗",
    hints: [
      "Vzpomeň si, kdy je večer dlouho světlo a kdy se stmívá brzy.",
    ],
    explanation:
      "Ano, to je pravda — v zimě jsou dny nejkratší, kdežto v létě slunce svítí nejdéle a dny jsou nejdelší.",
  },
  {
    question: "Na jaře je většinou tepleji než v zimě, ale chladněji než v létě. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🌡️",
    hints: [
      "Srovnej všechna tři období podle tepla a seřaď je.",
    ],
    explanation:
      "Ano, to je pravda — jaro je přechod mezi zimou a létem, proto je teplejší než zima, ale ještě ne tak horké jako léto.",
  },
  {
    question: "Tání sněhu a rození mláďat se dějí ve stejném ročním období. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🐤",
    hints: [
      "Rozmysli si, kdy taje sníh, a kdy se rodí mláďata — patří to k témuž období?",
    ],
    explanation:
      "Ano, to je pravda — tání sněhu i rození mláďat patří k jaru, kdy se příroda po zimě probouzí.",
  },
  {
    question: "Padání barevného listí ze stromů je typický znak léta. Je to pravda?",
    correctAnswer: NE,
    options: [ANO, NE],
    emoji: "🍂",
    hints: [
      "Přemýšlej, kdy stromy shazují listí — v horku, nebo když se ochlazuje?",
    ],
    explanation:
      "Ne, to není pravda — padání listí je znak podzimu, ne léta. V létě jsou stromy naopak plné zeleného listí.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1.map(toTask);
  return shuffle(pool);
}

export const ZMENYVPRIRODEJAROLETO: TopicMetadata[] = [
  {
    id: "g2-prv-jaro-leto",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-jare-a-v-lete-zmeny-v-prirode-jaro-leto",
    title: "Změny v přírodě – jaro a léto",
    studentTitle: "Jaro a léto",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na jaře a v létě",
    briefDescription: "Co se děje v přírodě na jaře a v létě.",
    keywords: ["jaro", "léto", "květiny", "teplo", "příroda", "ptáci"],
    goals: [
      "Vědět, co se děje v přírodě na jaře.",
      "Znát znaky léta.",
      "Rozlišit jaro a léto od ostatních období.",
    ],
    boundaries: [
      "Těžiště je jaro a léto.",
      "Podzim a zima se objevují jen jako protiklad v možnostech, neprobírají se.",
    ],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na jaře vše kvete a roste, v létě je teplo a sluní.",
      steps: ["Přečti větu.", "Děje se to na jaře nebo v létě?"],
      commonMistake: "Sníh patří do zimy, ne na jaro.",
      example: "Na jaře kvetou květiny, v létě se koupeme.",
    },
  },
];
