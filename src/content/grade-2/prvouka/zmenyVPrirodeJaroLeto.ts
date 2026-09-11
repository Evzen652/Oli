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
//   L1 = rozpoznání izolovaného faktu o jaru a létu (co se děje na
//        jaře, znaky léta) — formát Ano/Ne (2 možnosti), jen zde.
//   L2 = aplikace: přiřazení jevu ke správnému ročnímu období,
//        rozpoznání období podle popisu — výběr ze 4 možností.
//   L3 = transfer: kombinace dvou znaků období, rozlišení blízkých
//        jevů (jaro vs. léto), „proč“ otázky, pořadí období, oprava
//        miskoncepce — vždy 4 možnosti, žádné Ano/Ne.
// Každá úloha: 2 vlastní nápovědy (malá → velká), vysvětlení PROČ
// a optionFeedback ke každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Na jaře kvetou květiny. Je to pravda?",
    correct: true,
    emoji: "🌷",
    hints: [
      "Na jaře se příroda probouzí a otepluje — co dělají květiny?",
      "Vzpomeň si na sněženky, petrklíče a pampelišky. Kdy je v přírodě uvidíš poprvé po dlouhé zimě?",
    ],
    solution: "Na jaře kvetou květiny — příroda se po zimě probouzí, přibývá tepla a světla.",
    feedback: "Jaro je právě doba, kdy květiny začínají kvést. Věta tedy platí.",
  },
  {
    question: "V létě je teplo. Je to pravda?",
    correct: true,
    emoji: "☀️",
    hints: [
      "Léto je nejteplejší roční období — chodíme v tričku nebo plavkách.",
      "Představ si letní prázdniny: koupání, zmrzlina, kraťasy. Potřebuješ tehdy teplou bundu, nebo stačí lehké oblečení?",
    ],
    solution: "V létě je teplo — léto je nejteplejší roční období.",
    feedback: "Léto je nejteplejší období roku, takže věta platí.",
  },
  {
    question: "Na jaře padá sníh a je velká zima. Je to pravda?",
    correct: false,
    emoji: "❄️",
    hints: [
      "Na jaře se otepluje — co se děje se sněhem z předchozí zimy?",
      "Velký mráz a sněžení patří k jinému období. Na jaře sníh spíš mizí a potůčky jsou plné vody. Sedí to s větou?",
    ],
    solution: "Na jaře už sníh většinou nepadá — otepluje se a zbylý sníh taje. Sněžení a velká zima patří do zimy.",
    feedback: "Sněžení a velká zima jsou znaky zimy. Na jaře se naopak otepluje a sníh taje.",
  },
  {
    question: "V létě se chodíme koupat. Je to pravda?",
    correct: true,
    emoji: "🏊",
    hints: [
      "Léto je teplé — chodíme k vodě nebo na koupaliště.",
      "Kdy je voda v rybníce i na koupališti dost teplá, abychom do ní rádi skočili? Vzpomeň si na své prázdniny.",
    ],
    solution: "V létě se koupeme — je horko a voda nás příjemně ochladí.",
    feedback: "Koupání patří k létu, kdy je horko a voda je teplá. Věta platí.",
  },
  {
    question: "Na jaře raší stromům nové listy. Je to pravda?",
    correct: true,
    emoji: "🌱",
    hints: [
      "Stromy jsou v zimě holé — co se stane, když se na jaře oteplí?",
      "Podívej se v duchu na větvičku na jaře: z malých pupenů se rozvíjejí drobné světle zelené lístky. Kdy se to děje?",
    ],
    solution: "Na jaře raší listy — z pupenů na větvích se rozvíjejí nové zelené lístky.",
    feedback: "Na jaře stromům opravdu raší nové listy, proto věta platí.",
  },
  {
    question: "V létě nosíme čepici a rukavice. Je to pravda?",
    correct: false,
    emoji: "🧤",
    hints: [
      "Čepici a rukavice nosíme, když je zima — je v létě zima?",
      "Rukavice a zimní čepice chrání před mrazem. V létě je horko a chodíme v tričku a kraťasech. Hodí se k tomu rukavice?",
    ],
    solution: "V létě čepici a rukavice nenosíme — je teplo, oblékáme si lehké oblečení.",
    feedback: "V létě je horko, rukavice a zimní čepici nosíme v zimě. Věta proto neplatí.",
  },
  {
    question: "Na jaře se vracejí ptáci z teplých krajů. Je to pravda?",
    correct: true,
    emoji: "🐦",
    hints: [
      "Některé ptáky, třeba vlaštovky, přes zimu nevidíme — vrátí se na jaře?",
      "Tažní ptáci odletí na podzim do tepla a u nás přečkají jen teplé měsíce. Kdy se asi objeví zase nad našimi domy?",
    ],
    solution: "Na jaře se vracejí ptáci — třeba vlaštovky, které zimu tráví v teplých krajích.",
    feedback: "Tažní ptáci se k nám opravdu vracejí na jaře, když se oteplí. Věta platí.",
  },
  {
    question: "V létě jsou dlouhé dny. Je to pravda?",
    correct: true,
    emoji: "☀️",
    hints: [
      "V létě svítí slunce hodně dlouho — jsou dny kratší, nebo delší?",
      "Vzpomeň si, jestli je v létě večer, když jdeš spát, ještě světlo. A jak je to v zimě po návratu ze školy?",
    ],
    solution: "V létě jsou dlouhé dny — slunce vychází brzy a zapadá pozdě.",
    feedback: "V létě slunce svítí nejdéle ze všech období, dny jsou tedy dlouhé. Věta platí.",
  },
  {
    question: "Na jaře všechno v přírodě usychá. Je to pravda?",
    correct: false,
    emoji: "🌷",
    hints: [
      "Na jaře se příroda probouzí a roste — usychá, nebo kvete?",
      "Rostliny na jaře teprve vyrážejí, louky se zelenají a stromy kvetou. Usychání a vadnutí patří spíš ke konci roku.",
    ],
    solution: "Na jaře příroda neusychá — naopak se probouzí, kvete a zelená se.",
    feedback: "Na jaře příroda neusychá, ale roste a kvete. Věta proto neplatí.",
  },
  {
    question: "V létě dozrávají jahody. Je to pravda?",
    correct: true,
    emoji: "🍓",
    hints: [
      "Jahody sklízíme, když je teplo — jsou sladké a červené.",
      "Jahody potřebují ke zrání hodně slunce a tepla. Kdy je trháme na zahradě nebo kupujeme na trhu úplně čerstvé?",
    ],
    solution: "V létě dozrávají jahody — jsou jedním z prvních letních plodů.",
    feedback: "Jahody opravdu dozrávají v létě, v teple a na slunci. Věta platí.",
  },
  {
    question: "Na jaře se rodí mláďata. Je to pravda?",
    correct: true,
    emoji: "🐣",
    hints: [
      "Na jaře se příroda obnovuje — co se děje se zvířaty?",
      "Vzpomeň si na kuřátka, jehňátka a hříbata na statku. Kdy mají mláďata dost tepla a potravy, aby dobře rostla?",
    ],
    solution: "Na jaře se rodí mláďata — zvířata přivádějí na svět potomky, protože je teplo a dost potravy.",
    feedback: "Na jaře se rodí nejvíce mláďat, proto věta platí.",
  },
  {
    question: "V létě zamrzá rybník a bruslí se na něm. Je to pravda?",
    correct: false,
    emoji: "⛸️",
    hints: [
      "Rybník zamrzá, když je velká zima — je v létě zima?",
      "Led vzniká jen při mrazu. V létě se v rybníce koupeme, protože voda je teplá. Dá se na ní tedy bruslit?",
    ],
    solution: "V létě rybník nezamrzá — zamrzá v zimě, kdy jsou teploty pod nulou.",
    feedback: "Rybník zamrzá v zimě, v létě se v něm koupeme. Věta proto neplatí.",
  },
  {
    question: "Na jaře je tepleji než v zimě. Je to pravda?",
    correct: true,
    emoji: "🌡️",
    hints: [
      "Srovnej jaro a zimu — kde je tepleji?",
      "V zimě mrzne a leží sníh, na jaře sníh taje a kvetou květiny. Ve kterém z těch dvou období je tedy tepleji?",
    ],
    solution: "Na jaře je tepleji než v zimě — teploty stoupají a sníh taje.",
    feedback: "Na jaře se otepluje a sníh taje, takže je tepleji než v zimě. Věta platí.",
  },
  {
    question: "Na jaře kvetou ovocné stromy. Je to pravda?",
    correct: true,
    emoji: "🌸",
    hints: [
      "Stromy se na jaře probouzejí a rozkvétají — třešně a jabloně.",
      "Než na stromě vyroste jablko nebo třešeň, musí strom nejdřív vykvést. Kdy bývají zahrady celé bílé a růžové?",
    ],
    solution: "Na jaře kvetou stromy — třešně, jabloně a švestky bývají celé bílé nebo růžové.",
    feedback: "Ovocné stromy kvetou právě na jaře, proto věta platí.",
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
      "Všechny tři znaky patří k tomu samému období. Návrat ptáků a mláďata jsou typické pro dobu hned po zimě, kdy se otepluje.",
    ],
    explanation:
      "Kvetení stromů, mláďata a návrat ptáků jsou znaky jara — příroda se po zimě probouzí. V létě už stromy kvetou jen výjimečně a na podzim ani v zimě ne.",
    optionFeedback: {
      Léto: "V létě už stromy odkvetly a ptáci jsou dávno doma. Tyto znaky patří k dřívějšímu období.",
      Podzim: "Na podzim ptáci naopak odlétají a stromy nekvetou.",
      Zima: "V zimě je mráz, stromy jsou holé a ptáci se nevracejí.",
    },
  },
  {
    question: "Je horko, děti mají prázdniny a chodí se koupat. Které je to roční období?",
    correctAnswer: "Léto",
    options: ["Jaro", "Léto", "Podzim", "Zima"],
    emoji: "🏖️",
    hints: [
      "Kdy je největší teplo a děti nechodí do školy?",
      "Hlavní prázdniny jsou v červenci a srpnu. V tu dobu je voda tak teplá, že se v ní rádi koupeme. Jak se tohle období jmenuje?",
    ],
    explanation:
      "Horko, prázdniny a koupání jsou znaky léta — nejteplejšího období roku. Na jaře bývá tepleji než v zimě, ale prázdniny a horko patří k létu.",
    optionFeedback: {
      Jaro: "Na jaře ještě chodíme do školy a voda je na koupání studená.",
      Podzim: "Na podzim začíná škola a ochlazuje se.",
      Zima: "V zimě je mráz, koupání venku nepřichází v úvahu.",
    },
  },
  {
    question: "Co z toho patří k létu?",
    correctAnswer: "Zrání jahod na zahradě",
    options: [
      "Pučení prvních listů na holých stromech",
      "Padání barevného listí ze stromů",
      "Zrání jahod na zahradě",
      "Zamrzání rybníka",
    ],
    emoji: "🍓",
    hints: [
      "Hledej to, co se děje, když je největší teplo.",
      "Přiřaď každou možnost k období: první listy patří k jaru, barevné listí k podzimu, led k zimě. Která věc zbude pro léto?",
    ],
    explanation:
      "Zrání jahod patří k létu. Pučení prvních listů je jarní znak, padání listí podzimní a zamrzání rybníka zimní.",
    optionFeedback: {
      "Pučení prvních listů na holých stromech": "První listy raší na jaře, v létě už jsou stromy plné listí.",
      "Padání barevného listí ze stromů": "Barevné listí padá na podzim.",
      "Zamrzání rybníka": "Rybník zamrzá v zimě, v létě se v něm koupeme.",
    },
  },
  {
    question: "Co dělají stromy na jaře?",
    correctAnswer: "Raší jim nové zelené listy",
    options: [
      "Opadává jim všechno listí",
      "Zůstávají úplně holé bez pupenů",
      "Jsou pokryté sněhem a ledem",
      "Raší jim nové zelené listy",
    ],
    emoji: "🌳",
    hints: [
      "Co se stane s holými stromy, když se na jaře oteplí?",
      "Na větvích jsou od podzimu malé pupeny. Když přijde teplo a přibude světla, co se z těch pupenů začne rozvíjet?",
    ],
    explanation:
      "Na jaře stromům raší nové listy — z pupenů se rozvíjejí zelené lístky. Opadávání listí patří k podzimu, holé zasněžené stromy k zimě.",
    optionFeedback: {
      "Opadává jim všechno listí": "Listí opadává na podzim, na jaře naopak přibývá.",
      "Zůstávají úplně holé bez pupenů": "Pupeny mají stromy celou zimu a na jaře se z nich rozvíjejí listy.",
      "Jsou pokryté sněhem a ledem": "Sníh a led na stromech patří k zimě.",
    },
  },
  {
    question: "Kdy se ptáci vracejí z teplých krajů zpátky k nám?",
    correctAnswer: "Na jaře",
    options: ["Na jaře", "V létě", "Na podzim", "V zimě"],
    emoji: "🐦",
    hints: [
      "Ptáci odlétají do tepla na zimu — kdy se asi vracejí?",
      "Tažní ptáci se vracejí, jakmile u nás skončí mrazy a objeví se hmyz na krmení. Které období přichází hned po zimě?",
    ],
    explanation:
      "Ptáci se vracejí na jaře, když se u nás oteplí. Na podzim naopak odlétají do teplých krajů, aby unikli zimě.",
    optionFeedback: {
      "V létě": "V létě už jsou ptáci doma a vyvádějí mláďata. Vrátili se o období dřív.",
      "Na podzim": "Na podzim ptáci naopak odlétají.",
      "V zimě": "V zimě je u nás mráz a málo hmyzu, tehdy se tažní ptáci nevracejí.",
    },
  },
  {
    question: "Který znak je typický pro letní den?",
    correctAnswer: "Je dlouhý, teplý a svítí slunce dlouho do večera",
    options: [
      "Je krátký a brzy se stmívá",
      "Je dlouhý, teplý a svítí slunce dlouho do večera",
      "Celý den mrzne a padá sníh",
      "Ráno bývá jinovatka a led na kalužích",
    ],
    emoji: "☀️",
    hints: [
      "Porovnej léto se zimou — kdy je den delší a kdy bývá nejtepleji?",
      "Vzpomeň si na prázdninový večer: jsi venku a pořád je světlo. Krátké dny, mráz a jinovatka patří k opačnému období.",
    ],
    explanation:
      "Letní den je dlouhý a teplý a slunce svítí až do večera. Krátké dny, mráz a led jsou znaky zimy.",
    optionFeedback: {
      "Je krátký a brzy se stmívá": "Krátký den a brzké stmívání patří k zimě.",
      "Celý den mrzne a padá sníh": "Mráz a sníh jsou znaky zimy.",
      "Ráno bývá jinovatka a led na kalužích": "Jinovatka a led jsou na konci podzimu a v zimě.",
    },
  },
  {
    question: "Sníh z minulé zimy taje a potůčky jsou plné vody. Které je to období?",
    correctAnswer: "Jaro",
    options: ["Léto", "Podzim", "Jaro", "Zima"],
    emoji: "💧",
    hints: [
      "Kdy se otepluje tak, že sníh taje a mizí?",
      "Tání sněhu znamená, že zima končí a začíná teplejší období. Voda z roztátého sněhu pak teče do potoků.",
    ],
    explanation:
      "Tání sněhu patří k jaru — otepluje se a sníh se mění na vodu. V zimě sníh naopak přibývá a v létě už žádný není.",
    optionFeedback: {
      Léto: "V létě už žádný sníh neleží, všechen roztál dávno předtím.",
      Podzim: "Na podzim sníh ještě obvykle nenapadl, takže nemá co tát.",
      Zima: "V zimě sníh přibývá a drží se, taje až potom.",
    },
  },
  {
    question: "Ke kterému období patří dozrávání třešní a meruněk?",
    correctAnswer: "K létu",
    options: ["K zimě", "K podzimu", "K jaru", "K létu"],
    emoji: "🍒",
    hints: [
      "Ovoce dozrává, když je hodně tepla a slunce.",
      "Stromy nejdřív na jaře kvetou, pak z květů pomalu rostou plody. Ty dozrají až v nejteplejším období roku.",
    ],
    explanation:
      "Třešně a meruňky dozrávají v létě, kdy je nejvíc tepla a slunce. Na jaře stromy teprve kvetou, plody uzrají až potom.",
    optionFeedback: {
      "K zimě": "V zimě je mráz a na stromech žádné ovoce nezraje.",
      "K podzimu": "Na podzim dozrávají jablka a hrušky, ale třešně a meruňky jsou dávno sklizené.",
      "K jaru": "Na jaře stromy teprve kvetou. Plody z květů dozrají později.",
    },
  },
  {
    question: "Včely létají od květu ke květu a sbírají nektar. Kdy to začíná?",
    correctAnswer: "Na jaře, když rozkvétají první květiny",
    options: [
      "Na jaře, když rozkvétají první květiny",
      "V zimě, když je nejvíc sněhu",
      "Na podzim, když opadává listí",
      "Až v létě, když dozrávají jahody",
    ],
    emoji: "🐝",
    hints: [
      "Včely potřebují ke sběru rozkvetlé květiny.",
      "Včely vylétají z úlu, jakmile venku najdou první kvetoucí rostliny. Ve kterém období se po zimě příroda probouzí a začíná kvést?",
    ],
    explanation:
      "Včely začínají sbírat nektar na jaře, když rozkvétají první květiny. V zimě květiny nekvetou, takže včely zůstávají v úlu.",
    optionFeedback: {
      "V zimě, když je nejvíc sněhu": "V zimě nic nekvete a včely zůstávají v úlu.",
      "Na podzim, když opadává listí": "Na podzim květin ubývá a včely se chystají na zimu.",
      "Až v létě, když dozrávají jahody": "V létě včely létají také, ale začínají dřív, hned když rozkvetou první květiny.",
    },
  },
  {
    question: "Co si vezmeš na sebe za horkého letního dne?",
    correctAnswer: "Lehké tričko, kraťasy a čepici proti slunci",
    options: [
      "Zimní bundu, rukavice a šálu",
      "Lehké tričko, kraťasy a čepici proti slunci",
      "Silný kabát a zimní boty",
      "Teplý svetr a vlněné punčocháče",
    ],
    emoji: "👕",
    hints: [
      "V horku nám je dobře v lehkém oblečení.",
      "Mysli na dvě věci zároveň: aby ti nebylo horko a aby tě nespálilo slunce. Které oblečení splní obojí?",
    ],
    explanation:
      "V létě si oblékáme lehké tričko a kraťasy a hlavu chráníme čepicí proti slunci. Zimní oblečení by nám v horku bylo nepříjemné.",
    optionFeedback: {
      "Zimní bundu, rukavice a šálu": "Zimní bunda a rukavice jsou do mrazu, v horku by ti bylo špatně.",
      "Silný kabát a zimní boty": "Kabát a zimní boty patří do zimy, v létě by ses v nich zpotil.",
      "Teplý svetr a vlněné punčocháče": "Svetr a vlněné punčocháče hřejí, v letním horku jsou zbytečné.",
    },
  },
  {
    question: "Na loukách kvetou pampelišky a sedmikrásky. Které období právě začalo?",
    correctAnswer: "Jaro",
    options: ["Zima", "Podzim", "Jaro", "Léto"],
    emoji: "🌼",
    hints: [
      "Kdy se louky poprvé po zimě zazelenají a rozkvetou?",
      "Pampelišky a sedmikrásky patří k prvním květinám na louce. Objeví se, jakmile roztaje sníh a tráva začne růst.",
    ],
    explanation:
      "První kvítí na loukách, jako pampelišky a sedmikrásky, je znakem jara. V zimě jsou louky holé a zasněžené.",
    optionFeedback: {
      Zima: "V zimě jsou louky pod sněhem a nic nekvete.",
      Podzim: "Na podzim louky spíš vadnou a kvetení končí.",
      Léto: "V létě louky kvetou také, ale první kvítí se objevuje o období dřív.",
    },
  },
  {
    question: "Kdy jsou dny nejdelší a slunce svítí nejdéle?",
    correctAnswer: "V létě",
    options: ["V zimě", "Na podzim", "Vždy stejně dlouho", "V létě"],
    emoji: "🌅",
    hints: [
      "Ve kterém období je ještě večer dlouho světlo?",
      "Porovnej léto a zimu: kdy slunce vychází brzy ráno a zapadá až pozdě večer, a kdy se stmívá už odpoledne?",
    ],
    explanation:
      "Nejdelší dny jsou v létě — slunce vychází brzy a zapadá pozdě. V zimě jsou dny naopak nejkratší.",
    optionFeedback: {
      "V zimě": "V zimě jsou dny nejkratší, stmívá se už odpoledne.",
      "Na podzim": "Na podzim se dny zkracují, nejdelší už nejsou.",
      "Vždy stejně dlouho": "Délka dne se během roku mění. V zimě je den kratší než v létě.",
    },
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
      "U každé možnosti se zeptej: děje se to na začátku oteplování, nebo až v největším teple? Rašení, mláďata i tání sněhu patří k začátku.",
    ],
    explanation:
      "Velké horko a prázdniny patří k létu. Rašení listů, mláďata i tání sněhu jsou naopak znaky jara — proto se hodí spíš k jaru.",
    optionFeedback: {
      "Rašení prvních listů na holých stromech": "První listy raší na jaře. V létě už jsou stromy plné listí.",
      "Rození mláďat a návrat ptáků z teplých krajů": "Mláďata a návrat ptáků jsou typické pro jaro.",
      "Tání posledního sněhu z minulé zimy": "Poslední sníh taje na jaře, v létě už žádný není.",
    },
  },
  {
    question: "Proč na jaře rozkvétají květiny a stromům raší listy?",
    correctAnswer: "Protože se otepluje a přibývá světla",
    options: [
      "Protože je čím dál větší zima a mráz",
      "Protože se otepluje a přibývá světla",
      "Protože dny jsou čím dál kratší",
      "Protože začíná padat sníh",
    ],
    emoji: "🌱",
    hints: [
      "Přemýšlej, co se s počasím na jaře mění oproti zimě.",
      "Rostliny potřebují k růstu dvě věci od slunce. Zamysli se, co z toho je v zimě málo a na jaře ho den ode dne přibývá.",
    ],
    explanation:
      "Rostliny rozkvétají a raší, protože se na jaře otepluje a přibývá slunečního světla. Zima, mráz a sníh růstu naopak brání.",
    optionFeedback: {
      "Protože je čím dál větší zima a mráz": "Na jaře se naopak otepluje. Mráz rostlinám škodí.",
      "Protože dny jsou čím dál kratší": "Na jaře se dny prodlužují. Kratší dny jsou na podzim.",
      "Protože začíná padat sníh": "Sníh na jaře taje, nezačíná padat.",
    },
  },
  {
    question: "Která dvojice znaků patří dohromady k jaru?",
    correctAnswer: "Pučí listy a rodí se mláďata",
    options: [
      "Je horko a zrají jahody",
      "Padá listí a fouká studený vítr",
      "Pučí listy a rodí se mláďata",
      "Mrzne a zamrzá rybník",
    ],
    emoji: "🐣",
    hints: [
      "Obě věci ve dvojici se musí dít ve stejném období.",
      "Zkontroluj každou dvojici po jedné části: nejdřív první znak, pak druhý. Správná dvojice má oba znaky jarní.",
    ],
    explanation:
      "Pučení listů i rození mláďat patří k jaru. Horko s jahodami je letní, padající listí podzimní a led zimní — proto ostatní dvojice nesedí.",
    optionFeedback: {
      "Je horko a zrají jahody": "Horko a zrání jahod jsou znaky léta.",
      "Padá listí a fouká studený vítr": "Padání listí a studený vítr patří k podzimu.",
      "Mrzne a zamrzá rybník": "Mráz a zamrzlý rybník jsou znaky zimy.",
    },
  },
  {
    question: "Proč se v létě chodíme koupat mnohem častěji než na jaře?",
    correctAnswer: "Protože v létě bývá větší horko a voda nás příjemně ochladí",
    options: [
      "Protože v létě je voda zamrzlá na led",
      "Protože v létě je zima a chceme se zahřát",
      "Protože v létě nikdy nesvítí slunce",
      "Protože v létě bývá větší horko a voda nás příjemně ochladí",
    ],
    emoji: "🏊",
    hints: [
      "Porovnej počasí na jaře a v létě — kdy bývá nejvíc teplo?",
      "Spoj dvě věci: jaké je počasí v létě a k čemu nám v takovém počasí voda slouží. Na jaře bývá voda ještě studená.",
    ],
    explanation:
      "V létě je větší horko než na jaře, a proto se chodíme chladit do vody častěji. Voda v létě nezamrzá a slunce svítí dlouho.",
    optionFeedback: {
      "Protože v létě je voda zamrzlá na led": "Voda zamrzá v zimě. V létě je teplá.",
      "Protože v létě je zima a chceme se zahřát": "V létě je horko, ne zima. Do vody jdeme, abychom se ochladili.",
      "Protože v létě nikdy nesvítí slunce": "V létě slunce svítí nejdéle ze všech období.",
    },
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
      "Začni zimou a postupuj dál: po mrazech se začne oteplovat, pak přijde největší horko. Kterými obdobími jsi prošel?",
    ],
    explanation:
      "Po zimě přichází nejdřív jaro a teprve pak léto — v tomto pořadí jdou za sebou. Jaro a léto nejsou totéž: jaro je začátek oteplování, léto je největší teplo.",
    optionFeedback: {
      "Nejdřív přijde léto a po něm jaro": "Pořadí je obrácené. Po létě přichází podzim, ne jaro.",
      "Jaro a léto jsou úplně to samé období": "Jsou to dvě různá období. Jaro je chladnější a příroda se v něm probouzí.",
      "Léto přichází hned po podzimu": "Po podzimu přichází zima. Léto je až po jaru.",
    },
  },
  {
    question: "Na začátku jara ještě může přijít chladno, ale kterým směrem se počasí celkově mění?",
    correctAnswer: "Postupně se otepluje a dní přibývá světla",
    options: [
      "Postupně se ochlazuje a dny se zkracují",
      "Postupně se otepluje a dní přibývá světla",
      "Počasí se vůbec nemění, zůstává jako v zimě",
      "Padá čím dál víc sněhu",
    ],
    emoji: "🌤️",
    hints: [
      "Jaro je přechod mezi zimou a létem — kam počasí míří?",
      "Jaro leží mezi zimou a létem. Když se na konci jara blížíš k létu, přibývá tepla a světla, nebo ubývá?",
    ],
    explanation:
      "Na jaře se počasí celkově otepluje a dny se prodlužují — směřuje k létu. Ochlazování a kratší dny patří naopak k podzimu.",
    optionFeedback: {
      "Postupně se ochlazuje a dny se zkracují": "Ochlazování a zkracování dnů patří k podzimu, jaro míří opačně.",
      "Počasí se vůbec nemění, zůstává jako v zimě": "Na jaře se počasí mění, sníh taje a přibývá tepla.",
      "Padá čím dál víc sněhu": "Na jaře sněhu ubývá, taje.",
    },
  },
  {
    question: "Kamarád tvrdí, že jahody dozrávají v zimě. Jak to opravíš?",
    correctAnswer: "Jahody dozrávají v létě, protože potřebují hodně tepla a slunce",
    options: [
      "Kamarád má pravdu, jahody dozrávají v zimě na sněhu",
      "Jahody dozrávají v zimě, protože je zima nejteplejší",
      "Jahody dozrávají v létě, protože potřebují hodně tepla a slunce",
      "Jahody dozrávají na podzim, až opadá listí",
    ],
    emoji: "🍓",
    hints: [
      "Kdy je nejvíc tepla a slunce, které ovoce potřebuje ke zrání?",
      "Nejdřív si ujasni, co jahody ke zrání potřebují. Pak najdi období, kdy toho je nejvíc. V zimě je mráz a sníh.",
    ],
    explanation:
      "Jahody dozrávají v létě, kdy je nejvíc tepla a slunce. V zimě je mráz a sníh, takže ovoce tehdy zrát nemůže.",
    optionFeedback: {
      "Kamarád má pravdu, jahody dozrávají v zimě na sněhu": "Na sněhu a v mrazu jahody zrát nemohou. Kamarád se plete.",
      "Jahody dozrávají v zimě, protože je zima nejteplejší": "Zima je nejchladnější období, ne nejteplejší.",
      "Jahody dozrávají na podzim, až opadá listí": "Na podzim dozrávají jablka. Jahody jsou letní ovoce.",
    },
  },
  {
    question: "Na jaře stromy kvetou. Proč na nich potom v létě najdeme ovoce?",
    correctAnswer: "Z jarních květů se během tepla vyvinou plody, které v létě dozrají",
    options: [
      "Ovoce na strom přinesou včely hotové",
      "Ovoce na stromě bylo celou zimu a jen roztálo",
      "Květy a ovoce spolu vůbec nesouvisí",
      "Z jarních květů se během tepla vyvinou plody, které v létě dozrají",
    ],
    emoji: "🍎",
    hints: [
      "Spoj dvě věci: nejdřív květ na jaře, potom plod v létě.",
      "Podívej se v duchu na třešeň: na jaře bílý květ, lístky opadají a na jeho místě zůstane malá zelená kulička. Co se s ní děje dál?",
    ],
    explanation:
      "Z jarních květů se postupně vyvinou plody, které během letního tepla dozrají. Kvetení a zrání ovoce tak spolu souvisejí — jedno navazuje na druhé.",
    optionFeedback: {
      "Ovoce na strom přinesou včely hotové": "Včely květy opylují, ale ovoce nepřinášejí. Plod roste přímo z květu.",
      "Ovoce na stromě bylo celou zimu a jen roztálo": "V zimě jsou stromy holé, ovoce na nich není.",
      "Květy a ovoce spolu vůbec nesouvisí": "Souvisejí. Ovoce vyroste právě z květu.",
    },
  },
  {
    question: "V zimě chodíš ze školy už za šera, v létě je v tu dobu ještě dlouho světlo. Co z toho plyne?",
    correctAnswer: "V zimě jsou dny kratší než v létě",
    options: [
      "V zimě jsou dny kratší než v létě",
      "V zimě jsou dny delší než v létě",
      "Dny jsou v zimě i v létě stejně dlouhé",
      "V létě se stmívá dřív než v zimě",
    ],
    emoji: "🌗",
    hints: [
      "Když se stmívá brzy, trvá den krátce, nebo dlouho?",
      "Porovnej obě situace ze zadání: ve stejnou hodinu je v zimě šero a v létě světlo. Ve kterém období tedy slunce zapadá dřív?",
    ],
    explanation:
      "V zimě se stmívá dřív, a proto jsou dny kratší než v létě. V létě slunce svítí nejdéle, takže je ještě dlouho světlo.",
    optionFeedback: {
      "V zimě jsou dny delší než v létě": "Je to obráceně. Když se v zimě stmívá dřív, je den kratší.",
      "Dny jsou v zimě i v létě stejně dlouhé": "Kdyby byly stejně dlouhé, bylo by ve stejnou hodinu stejně světlo.",
      "V létě se stmívá dřív než v zimě": "V létě se stmívá později, proto je ještě dlouho světlo.",
    },
  },
  {
    question: "Seřaď zimu, jaro a léto od nejchladnějšího po nejteplejší.",
    correctAnswer: "Zima, jaro, léto",
    options: ["Zima, jaro, léto", "Jaro, zima, léto", "Léto, jaro, zima", "Zima, léto, jaro"],
    emoji: "🌡️",
    hints: [
      "Začni obdobím, kdy mrzne, a skonči obdobím největšího horka.",
      "Najdi nejdřív nejchladnější a nejteplejší období. Třetí období leží mezi nimi: už se otepluje, ale horko ještě nebývá.",
    ],
    explanation:
      "Nejchladnější je zima, pak přijde jaro, kdy se otepluje, a nejteplejší je léto. Jaro je přechod mezi zimou a létem.",
    optionFeedback: {
      "Jaro, zima, léto": "Jaro je teplejší než zima, nemůže být na začátku.",
      "Léto, jaro, zima": "Tohle je pořadí od nejteplejšího po nejchladnější, tedy obráceně.",
      "Zima, léto, jaro": "Léto je teplejší než jaro, musí být až na konci.",
    },
  },
  {
    question: "Sníh taje a na statku se rodí mláďata. Který další znak patří do stejného ročního období?",
    correctAnswer: "Vracejí se ptáci z teplých krajů",
    options: [
      "Vracejí se ptáci z teplých krajů",
      "Dozrávají jahody a třešně",
      "Padá barevné listí",
      "Děti mají letní prázdniny",
    ],
    emoji: "🐤",
    hints: [
      "Nejdřív urči, o které období jde, a teprve pak hledej další znak.",
      "Tání sněhu a mláďata patří k době hned po zimě. U každé možnosti se zeptej, jestli se děje ve stejném období, nebo později.",
    ],
    explanation:
      "Tání sněhu a rození mláďat patří k jaru. Na jaře se také vracejí ptáci z teplých krajů. Jahody a prázdniny jsou letní, padání listí podzimní.",
    optionFeedback: {
      "Dozrávají jahody a třešně": "Jahody a třešně dozrávají v létě, ne na jaře.",
      "Padá barevné listí": "Barevné listí padá na podzim.",
      "Děti mají letní prázdniny": "Letní prázdniny jsou v létě.",
    },
  },
  {
    question: "Kamarád tvrdí, že padání barevného listí je typický znak léta. Jak ho opravíš?",
    correctAnswer: "Listí padá na podzim, v létě jsou stromy plné zelených listů",
    options: [
      "Má pravdu, listí padá v létě, když je horko",
      "Listí padá na jaře, když raší nové",
      "Listí padá na podzim, v létě jsou stromy plné zelených listů",
      "Listí padá v zimě, až napadne sníh",
    ],
    emoji: "🍂",
    hints: [
      "Přemýšlej, kdy stromy shazují listí — v horku, nebo když se ochlazuje?",
      "Vzpomeň si, jakou barvu má listí v létě a kdy se zbarví do žluta a červena. Barevné listy opadávají, když se blíží zima.",
    ],
    explanation:
      "Padání barevného listí je znak podzimu, ne léta. V létě jsou stromy naopak plné zeleného listí a listí opadá, až se ochladí.",
    optionFeedback: {
      "Má pravdu, listí padá v létě, když je horko": "V létě jsou stromy zelené. Listí padá, když se ochlazuje.",
      "Listí padá na jaře, když raší nové": "Na jaře listí naopak raší, neopadává.",
      "Listí padá v zimě, až napadne sníh": "Když napadne sníh, stromy už jsou holé. Listí opadalo dřív.",
    },
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
