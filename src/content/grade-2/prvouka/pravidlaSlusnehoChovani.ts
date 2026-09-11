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
  /** Malá nápověda — jemně nasměruje. */
  hint: string;
  /** Velká nápověda — konkrétní situace k této větě, pořád bez odpovědi. */
  hint2: string;
  /** Zpětná vazba k chybné volbě (proč opačná odpověď neplatí). */
  wrong: string;
  solution: string;
}

function toTask(item: TrueFalseItem): PracticeTask {
  return {
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [item.hint, item.hint2],
    optionFeedback: { [item.correct ? NE : ANO]: item.wrong },
    explanation: item.solution,
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3) pro 2. ročník.
//   L1 = rozpoznání izolovaného pravidla slušného chování (pozdrav,
//        prosím/děkuji, čekání ve frontě...) — formát Ano/Ne (2 možnosti).
//   L2 = aplikace: rozpoznání správného chování v konkrétní jednoduché
//        situaci — výběr ze 4 možností.
//   L3 = transfer: kombinace dvou pravidel, střet dvou pravidel (kamarád
//        vs. fronta, upřímnost vs. zdvořilost), pravidla platí i bez
//        dozoru — výhradně 4 možnosti (Ano/Ne jen na L1).
// Každá úloha: dvě vlastní nápovědy, zpětná vazba u každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Říkáme prosím a děkuji. Je to pravda?",
    correct: true,
    emoji: "🙏",
    hint: "Prosím a děkuji jsou základní slova zdvořilosti.",
    hint2: "Když chceš u oběda podat chleba, jak o to slušně požádáš? A co řekneš, když ti ho někdo podá?",
    wrong: "Prosím a děkuji říkáme — jsou to kouzelná slovíčka slušného chování.",
    solution: "Říkáme prosím a děkuji — to jsou základní slova slušného chování.",
  },
  {
    question: "Skáčeme lidem do řeči. Je to pravda?",
    correct: false,
    emoji: "🗣️",
    hint: "Skákat do řeči znamená přerušit někoho, kdo mluví — je to slušné?",
    hint2: "Představ si, že vyprávíš něco důležitého a někdo tě uprostřed věty přeruší. Jak se cítíš? Slušný člověk počká, až druhý domluví.",
    wrong: "Do řeči neskáčeme — počkáme, až druhý domluví.",
    solution: "Do řeči neskáčeme — počkáme, až druhý domluví.",
  },
  {
    question: "Zdravíme dospělé, když je potkáme. Je to pravda?",
    correct: true,
    emoji: "👋",
    hint: "Pozdrav Dobrý den patří ke slušnému chování.",
    hint2: "Potkáš v obchodě paní učitelku nebo souseda. Co jim řekneš jako první, ještě než začneš mluvit o čemkoli jiném?",
    wrong: "Dospělé zdravíme — pozdrav patří ke slušnému chování.",
    solution: "Zdravíme dospělé — to patří ke slušnému chování.",
  },
  {
    question: "Ve škole při hodině křičíme. Je to pravda?",
    correct: false,
    emoji: "🏫",
    hint: "Ve třídě jsou i ostatní děti a učitel — křičení jim vadí.",
    hint2: "Když někdo ve třídě křičí, ostatní neslyší paní učitelku a nemohou se soustředit na úkol. Chceme to tak?",
    wrong: "Při hodině nekřičíme — rušili bychom učitele i spolužáky.",
    solution: "Ve škole při hodině nekřičíme — respektujeme ostatní a udržujeme klid.",
  },
  {
    question: "Uklízíme po sobě hračky. Je to pravda?",
    correct: true,
    emoji: "🧹",
    hint: "Po sobě uklízíme, aby bylo čisto pro všechny.",
    hint2: "Po hraní zůstanou kostky rozházené po koberci. Kdo by je měl dát zpátky do krabice — ty, nebo někdo jiný?",
    wrong: "Po sobě hračky uklízíme — každý se stará o svůj nepořádek.",
    solution: "Po sobě uklízíme — každý je zodpovědný za svůj nepořádek.",
  },
  {
    question: "Bereme cizí věci bez dovolení. Je to pravda?",
    correct: false,
    emoji: "🚫",
    hint: "Brát cizí věci bez dovolení je špatné — jak bychom se cítili my?",
    hint2: "Kdyby ti někdo vzal pastelky z penálu a nic neřekl, líbilo by se ti to? Cizí věc si můžeš vzít, jen když ti ji majitel dovolí.",
    wrong: "Cizí věci bez dovolení nebereme — nejdřív se zeptáme majitele.",
    solution: "Cizí věci bez dovolení nebereme — nejdřív se zeptáme.",
  },
  {
    question: "Umýváme si ruce před jídlem. Je to pravda?",
    correct: true,
    emoji: "🧼",
    hint: "Umývání rukou nás chrání před nemocemi.",
    hint2: "Na rukou nosíme neviditelné bacily z hraní venku i z kliky u dveří. Co s nimi uděláš, než sáhneš na svačinu?",
    wrong: "Ruce si před jídlem umýváme — jinak bychom snědli i bacily.",
    solution: "Umýváme si ruce před jídlem a po záchodě, abychom byli zdraví.",
  },
  {
    question: "U stolu mlaskáme. Je to pravda?",
    correct: false,
    emoji: "🍽️",
    hint: "Mlaskání u stolu ruší ostatní při jídle.",
    hint2: "Jíst se má se zavřenou pusou a potichu. Jak by se ti jedlo vedle někoho, kdo u každého sousta nahlas mlaská?",
    wrong: "U stolu nemlaskáme — jíme se zavřenou pusou, aby to ostatní nerušilo.",
    solution: "U stolu nemlaskáme — to patří ke slušnému stolování.",
  },
  {
    question: "Ve frontě čekáme, až na nás přijde řada. Je to pravda?",
    correct: true,
    emoji: "🚶",
    hint: "Předbíhání ve frontě je nefér ke všem, kdo čekají.",
    hint2: "U lékaře sedí v čekárně lidé, kteří přišli dřív než ty. Kdo by měl jít do ordinace jako první?",
    wrong: "Na řadu čekáme — kdo přišel dřív, jde dřív.",
    solution: "Ve frontě čekáme, až na nás přijde řada — nepředbíháme.",
  },
  {
    question: "Posmíváme se ostatním dětem. Je to pravda?",
    correct: false,
    emoji: "🚫",
    hint: "Posmívat se druhým je kruté — jak by se cítili oni?",
    hint2: "Vzpomeň si, jak je smutno, když se ti někdo směje, že se ti něco nepovedlo. Chceme, aby se tak cítili i ostatní?",
    wrong: "Ostatním se neposmíváme — posměch zraňuje.",
    solution: "Neposmíváme se ostatním — to by je zranilo.",
  },
  {
    question: "Mluvíme slušně, bez nadávek. Je to pravda?",
    correct: true,
    emoji: "😊",
    hint: "Slušná řeč neobsahuje nadávky ani hrubá slova.",
    hint2: "Když se na někoho zlobíš, můžeš mu to říct klidně a slušně. Hrubá slova by ho jen urazila a hádka by byla ještě horší.",
    wrong: "Mluvíme slušně — nadávky druhé urážejí.",
    solution: "Mluvíme slušně — bez nadávek a hrubých slov.",
  },
  {
    question: "Házíme odpadky na zem. Je to pravda?",
    correct: false,
    emoji: "🗑️",
    hint: "Odpadky patří do koše, ne na zem.",
    hint2: "Po svačině ti zůstane papírek od sušenky. Kdyby ho každý hodil na chodník, jak by to venku za chvíli vypadalo?",
    wrong: "Odpadky na zem neházíme — patří do koše.",
    solution: "Odpadky na zem neházíme — patří do koše, abychom udrželi čistotu.",
  },
  {
    question: "Když si chceme půjčit cizí věc, nejdřív se zeptáme. Je to pravda?",
    correct: true,
    emoji: "🙋",
    hint: "Zeptat se předem je slušnější než si věc jen tak vzít.",
    hint2: "Chceš si od spolužáka půjčit pravítko. Co mu nejdřív řekneš, než na pravítko sáhneš? Třeba: „Můžu si ho půjčit?“",
    wrong: "Než si cizí věc půjčíme, zeptáme se — tak je to slušné.",
    solution: "Nejdřív se zeptáme, teprve pak si věc půjčíme — to je slušné.",
  },
  {
    question: "Rodičům a učitelům lžeme. Je to pravda?",
    correct: false,
    emoji: "🚫",
    hint: "Lhaní ničí důvěru mezi lidmi.",
    hint2: "Když rodiče nebo učitel zjistí, že jsi jim lhal, přestanou ti věřit, i když příště budeš mluvit pravdu. Je to dobrý nápad?",
    wrong: "Rodičům ani učitelům nelžeme — upřímnost a důvěra jsou důležité.",
    solution: "Rodičům ani učitelům nelžeme — upřímnost a důvěra jsou důležité.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Přijdeš ráno do třídy a potkáš paní učitelku. Co uděláš?",
    correctAnswer: "Pozdravím ji",
    options: [
      "Pozdravím ji",
      "Projdu kolem beze slova",
      "Počkám, až pozdraví ona první",
      "Zamávám a nic neřeknu",
    ],
    emoji: "👋",
    hints: [
      "Slušnost platí vždy, když někoho potkáme.",
      "Paní učitelka stojí u dveří třídy. Nemusíš čekat, jestli promluví první ona — co jí sám řekneš, když vcházíš?",
    ],
    optionFeedback: {
      "Projdu kolem beze slova": "Projít beze slova je nezdvořilé — dospělého zdravíme.",
      "Počkám, až pozdraví ona první": "Děti zdraví dospělé jako první, nečekáme na ně.",
      "Zamávám a nic neřeknu": "Mávnutí nestačí, patří k tomu i slova „Dobrý den“.",
    },
    explanation:
      "Paní učitelku pozdravíme sami, nečekáme na ni. Mlčení nebo pouhé mávnutí bez pozdravu není dost zdvořilé.",
  },
  {
    question: "Kamarád ti něco půjčí. Co je slušné udělat?",
    correctAnswer: "Poděkovat mu",
    options: ["Nic neříct a odejít", "Poděkovat mu", "Vzít si to bez jediného slova", "Říct mu, že to mělo být samozřejmé"],
    emoji: "🙏",
    hints: [
      "Když ti někdo prokáže laskavost, jak slušně dáš najevo, že si toho vážíš?",
      "Kamarád ti ochotně podal svou věc, i když nemusel. Jaké kouzelné slovíčko mu řekneš? Používáme ho pokaždé, když od někoho něco dostaneme.",
    ],
    optionFeedback: {
      "Nic neříct a odejít": "Mlčky odejít je nezdvořilé, kamarád by si myslel, že si jeho ochoty nevážíš.",
      "Vzít si to bez jediného slova": "Vzít věc beze slova je neslušné — chybí poděkování.",
      "Říct mu, že to mělo být samozřejmé": "Půjčit něco není samozřejmost; taková věta by kamaráda urazila.",
    },
    explanation:
      "Za půjčení věci vždy poděkujeme. Mlčení nebo braní věci jako samozřejmosti by kamaráda mrzelo.",
  },
  {
    question: "Ve frontě u pokladny stojí před tebou několik lidí. Co uděláš?",
    correctAnswer: "Počkám, až na mě přijde řada",
    options: ["Protlačím se dopředu, protože spěchám", "Postavím se hned za pokladní", "Počkám, až na mě přijde řada", "Řeknu ostatním, ať mě pustí, protože jsem menší"],
    emoji: "🧾",
    hints: [
      "Ve frontě má přednost ten, kdo přišel dřív. Jak se podle toho zachováš?",
      "Lidé před tebou přišli dřív a čekají déle. Kdyby se každý tlačil dopředu, byl by u pokladny zmatek a hádka. Jak se tedy zachováš ty?",
    ],
    optionFeedback: {
      "Protlačím se dopředu, protože spěchám": "Spěchat mohou i ostatní — předbíhání je nefér.",
      "Postavím se hned za pokladní": "To je také předbíhání, i když nenápadné.",
      "Řeknu ostatním, ať mě pustí, protože jsem menší": "Věk není důvod k předbíhání, fronta platí pro všechny.",
    },
    explanation:
      "Ve frontě počkáme, až na nás přijde řada — to je fér ke všem ostatním. Předbíhání by rozzlobilo lidi, kteří už čekají.",
  },
  {
    question: "Spolužák ti něco vypráví o svém výletu. Co je slušné udělat?",
    correctAnswer: "Pozorně ho poslouchám a nepřerušuji ho",
    options: ["Skočím mu do řeči se svým vyprávěním", "Začnu si povídat s někým jiným", "Řeknu mu, ať už mlčí, protože mě to nezajímá", "Pozorně ho poslouchám a nepřerušuji ho"],
    emoji: "👂",
    hints: [
      "Nechat druhého domluvit je základ slušného rozhovoru.",
      "Spolužák se těší, že ti o výletu poví. Dívej se na něj, nech ho domluvit a teprve pak řekni, co ty. Která možnost tomu odpovídá?",
    ],
    optionFeedback: {
      "Skočím mu do řeči se svým vyprávěním": "Skákat do řeči je nezdvořilé, spolužák ještě nedomluvil.",
      "Začnu si povídat s někým jiným": "Tím dáš najevo, že tě spolužák nezajímá.",
      "Řeknu mu, ať už mlčí, protože mě to nezajímá": "Taková slova spolužáka zraní a jsou hrubá.",
    },
    explanation:
      "Spolužáka pozorně posloucháme a necháme ho domluvit. Skákání do řeči nebo odbytí by ho mrzelo.",
  },
  {
    question: "Chceš si ve třídě půjčit pastelky od spolužáka. Co uděláš?",
    correctAnswer: "Zeptám se ho, jestli mi je půjčí",
    options: [
      "Zeptám se ho, jestli mi je půjčí",
      "Prostě si je vezmu, on si toho nevšimne",
      "Počkám, až odejde, a vezmu si je",
      "Řeknu mu, že jsou teď moje",
    ],
    emoji: "✏️",
    hints: [
      "Cizí věci si bereme jen s dovolením majitele.",
      "Pastelky patří spolužákovi, takže on rozhoduje, jestli ti je půjčí. Jak se to dozvíš ještě dřív, než na ně sáhneš?",
    ],
    optionFeedback: {
      "Prostě si je vezmu, on si toho nevšimne": "Vzít si věc bez dovolení je neslušné, i když si toho nikdo nevšimne.",
      "Počkám, až odejde, a vezmu si je": "Tajně brát cizí věci je ještě horší — je to jako krádež.",
      "Řeknu mu, že jsou teď moje": "Pastelky nejsou tvoje, taková věta je nepravdivá a hrubá.",
    },
    explanation:
      "Před půjčením cizí věci se vždy zeptáme majitele. Vzít si věc bez dovolení by nebylo slušné, i kdyby si toho spolužák nevšiml.",
  },
  {
    question: "V jídelně dojídáš oběd a chceš vstát od stolu. Co je slušné udělat?",
    correctAnswer: "Utřu si pusu ubrouskem a uklidím po sobě talíř",
    options: ["Odejdu a nechám talíř na stole", "Utřu si pusu ubrouskem a uklidím po sobě talíř", "Otřu si pusu do rukávu", "Nechám drobky rozházené po stole"],
    emoji: "🍽️",
    hints: [
      "Po jídle patří k slušnému stolování čistá pusa i čistý stůl.",
      "Po jídle zůstane na puse omáčka a na stole prázdný talíř. Co s tím udělá slušný strávník? Zkus myslet na obojí — na sebe i na stůl.",
    ],
    optionFeedback: {
      "Odejdu a nechám talíř na stole": "Nechat po sobě nádobí je neslušné — uklízel by ho někdo jiný.",
      "Otřu si pusu do rukávu": "Rukáv není ubrousek — na to máme ubrousek.",
      "Nechám drobky rozházené po stole": "Drobky po sobě uklidíme, aby další strávník měl čisto.",
    },
    explanation:
      "Po jídle si utřeme pusu ubrouskem a uklidíme po sobě. Nechat nepořádek nebo si utírat pusu do rukávu není slušné stolování.",
  },
  {
    question: "Vidíš, že staršímu pánovi v autobuse není kde sednout. Co uděláš?",
    correctAnswer: "Uvolním mu své místo",
    options: ["Budu se tvářit, že spím", "Zůstanu sedět, protože jsem přišel dřív", "Uvolním mu své místo", "Řeknu mu, ať se zeptá někoho jiného"],
    emoji: "🚌",
    hints: [
      "Ke starším lidem se v dopravě chováme s úctou.",
      "Starší pán se v jedoucím autobuse těžko drží a mohl by upadnout. Ty jsi mladý a stání ti nevadí. Co mu nabídneš?",
    ],
    optionFeedback: {
      "Budu se tvářit, že spím": "Předstírat spánek je nepoctivé a neohleduplné.",
      "Zůstanu sedět, protože jsem přišel dřív": "Tady nejde o to, kdo přišel dřív — staršímu člověku místo uvolníme.",
      "Řeknu mu, ať se zeptá někoho jiného": "Místo můžeš uvolnit sám; posílat ho jinam je nezdvořilé.",
    },
    explanation:
      "Staršímu člověku v autobuse uvolníme místo — je to projev úcty. Předstírání spánku nebo odmítnutí by nebylo ohleduplné.",
  },
  {
    question: "Kýchneš nebo kašleš. Co je slušné udělat?",
    correctAnswer: "Zakryji si ústa rukou nebo loktem",
    options: ["Kýchnu přímo na spolužáka vedle sebe", "Nic nedělám, kýchnutí je normální", "Odvrátím se, ale nezakryji si ústa", "Zakryji si ústa rukou nebo loktem"],
    emoji: "🤧",
    hints: [
      "Při kýchání chráníme ostatní kolem nás.",
      "Při kýchnutí vylétnou z pusy drobné kapičky s bacily. Co můžeš dát před obličej, aby se nedostaly ke spolužákům?",
    ],
    optionFeedback: {
      "Kýchnu přímo na spolužáka vedle sebe": "Tím bys spolužáka mohl nakazit.",
      "Nic nedělám, kýchnutí je normální": "Kýchnutí je normální, ale zakrýt si ústa se sluší vždy.",
      "Odvrátím se, ale nezakryji si ústa": "Odvrácení nestačí, kapičky se rozletí do místnosti.",
    },
    explanation:
      "Při kýchání nebo kašli si zakryjeme ústa rukou nebo loktem, abychom nešířili nemoci. Kýchnutí bez zakrytí by mohlo nakazit ostatní.",
  },
  {
    question: "Kamarád ti ukazuje svůj nový výkres. Co je slušné udělat?",
    correctAnswer: "Podívám se na něj a řeknu mu na něj něco hezkého",
    options: [
      "Podívám se na něj a řeknu mu na něj něco hezkého",
      "Ani se nepodívám a odejdu",
      "Řeknu mu, že je to ošklivé",
      "Vezmu mu výkres z ruky bez dovolení",
    ],
    emoji: "🎨",
    hints: [
      "Když se s námi někdo chce o něco podělit, věnujeme mu pozornost.",
      "Kamarád na výkresu dlouho pracoval a je na něj pyšný. Co mu udělá radost — když si ho prohlédneš a pochválíš, co se mu povedlo, nebo něco jiného?",
    ],
    optionFeedback: {
      "Ani se nepodívám a odejdu": "Kamarád by byl smutný, že tě jeho práce nezajímá.",
      "Řeknu mu, že je to ošklivé": "Hrubá kritika kamaráda zraní.",
      "Vezmu mu výkres z ruky bez dovolení": "Bez dovolení věci z ruky nebereme.",
    },
    explanation:
      "Kamarádovu výkresu věnujeme pozornost a řekneme mu na něj něco hezkého. Ignorování nebo hrubá poznámka by ho zklamaly.",
  },
  {
    question: "Vstupuješ do dveří a za tebou jde ještě někdo. Co je slušné udělat?",
    correctAnswer: "Přidržím mu dveře",
    options: ["Pustím dveře, ať si poradí sám", "Přidržím mu dveře", "Zabouchnu dveře co nejrychleji", "Projdu a nevšímám si ho"],
    emoji: "🚪",
    hints: [
      "Všimni si, že za tebou někdo jde a mohl by dostat ránu.",
      "Vchod se za tebou sám zavírá. Když na chvilku podržíš ruku a počkáš, člověk za tebou projde v klidu a nic ho neuhodí. Co tedy uděláš?",
    ],
    optionFeedback: {
      "Pustím dveře, ať si poradí sám": "Puštěné dveře by mohly člověka za tebou uhodit.",
      "Zabouchnu dveře co nejrychleji": "Zabouchnout dveře před někým je neohleduplné.",
      "Projdu a nevšímám si ho": "Když si ho nevšímáš, dveře se mu zavřou před nosem.",
    },
    explanation:
      "Když za námi někdo jde, přidržíme mu dveře — je to drobná, ale milá pomoc. Zabouchnutí nebo puštění dveří by bylo neohleduplné.",
  },
  {
    question: "Omylem šlápneš spolužákovi na nohu. Co uděláš?",
    correctAnswer: "Hned se omluvím",
    options: ["Tvářím se, že se nic nestalo", "Řeknu mu, že si za to může sám", "Hned se omluvím", "Zasměju se a jdu dál"],
    emoji: "🦶",
    hints: [
      "I když jsme něco udělali omylem, patří se na to nějak zareagovat.",
      "Spolužáka to zabolelo, i když jsi to neudělal schválně. Jaké slovo mu řekneš, aby věděl, že tě to mrzí? Třeba „promiň“.",
    ],
    optionFeedback: {
      "Tvářím se, že se nic nestalo": "Spolužáka to bolí — předstírat, že nic, je neohleduplné.",
      "Řeknu mu, že si za to může sám": "Svalovat vinu na něj není fér, šlápl jsi mu na nohu ty.",
      "Zasměju se a jdu dál": "Smát se, když druhého něco bolí, je kruté.",
    },
    explanation:
      "I za neúmyslnou chybu se hned omluvíme. Předstírání, že se nic nestalo, nebo smích by spolužáka mrzely.",
  },
  {
    question: "Chceš se do rozhovoru dospělých na chvíli zapojit. Co je slušné udělat?",
    correctAnswer: "Počkám, až domluví, nebo slušně řeknu „promiňte“",
    options: ["Skočím jim rovnou do řeči", "Křičím, dokud si mě nevšimnou", "Tahám dospělého za rukáv a mluvím přes něj", "Počkám, až domluví, nebo slušně řeknu „promiňte“"],
    emoji: "🗨️",
    hints: [
      "Do řeči dospělým neskáčeme — počkáme na vhodnou chvíli.",
      "Dospělí právě mluví spolu. Máš dvě slušné možnosti: buď vyčkat na chvíli, kdy skončí, nebo použít zdvořilé slovíčko, kterým se omluvíš za vyrušení.",
    ],
    optionFeedback: {
      "Skočím jim rovnou do řeči": "Skákat do řeči je nezdvořilé.",
      "Křičím, dokud si mě nevšimnou": "Křik ruší a je neslušný.",
      "Tahám dospělého za rukáv a mluvím přes něj": "Tahat za rukáv a mluvit přes druhé je neslušné.",
    },
    explanation:
      "Počkáme, až dospělí domluví, nebo slušně řekneme „promiňte“. Skákání do řeči nebo křik nejsou zdvořilé.",
  },
  {
    question: "V jídelně sedíš vedle spolužáka, kterému bylo ráno špatně. Co je vhodné?",
    correctAnswer: "Zeptám se, jak se cítí, a v případě potřeby zavolám dospělého",
    options: [
      "Zeptám se, jak se cítí, a v případě potřeby zavolám dospělého",
      "Nevšímám si ho a jím dál",
      "Řeknu ostatním, ať se mu vysmívají",
      "Odejdu si sednout jinam",
    ],
    emoji: "🤒",
    hints: [
      "Zájem o to, jak se druhý cítí, je projev ohleduplnosti.",
      "Spolužákovi se může udělat znovu zle. Nejdřív se ho vlídně zeptej, jak mu je. Když uvidíš, že je to vážné, sám to neřešíš — přivoláš někoho velkého.",
    ],
    optionFeedback: {
      "Nevšímám si ho a jím dál": "Když si ho nikdo nevšímá, nikdo mu nepomůže, kdyby mu bylo zle.",
      "Řeknu ostatním, ať se mu vysmívají": "Posmívat se nemocnému je kruté.",
      "Odejdu si sednout jinam": "Odsednout si je neohleduplné, spolužák by se cítil odstrčený.",
    },
    explanation:
      "Zeptáme se spolužáka, jak se cítí, a v případě potřeby zavoláme dospělého. Ignorování nebo posměch by mu ublížily.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Kamarád tě prosí o pomoc s úkolem přesně ve chvíli, kdy chceš jít hrát ven. Co je nejlepší řešení?",
    correctAnswer: "Aspoň chvíli mu pomůžu a pak jdu ven",
    options: ["Řeknu mu, že nemám čas, a hned odejdu ven", "Aspoň chvíli mu pomůžu a pak jdu ven", "Budu předstírat, že jsem ho neslyšel", "Pomůžu mu, ale celou dobu mu budu nadávat, že mě zdržuje"],
    emoji: "⏰",
    hints: [
      "Spoj dvě věci: ochotu pomoci a to, že si i tak splníš svůj plán.",
      "Hra venku ti neuteče a kamarád potřebuje pomoc hned. Když mu chvíli pomůžeš, stihneš potom i hru. Která možnost spojuje obojí?",
    ],
    optionFeedback: {
      "Řeknu mu, že nemám čas, a hned odejdu ven": "Na chvilku čas najdeš — kamarád by zůstal bez pomoci.",
      "Budu předstírat, že jsem ho neslyšel": "Předstírání je nepoctivé a kamaráda by mrzelo.",
      "Pomůžu mu, ale celou dobu mu budu nadávat, že mě zdržuje": "Pomoc s nadávkami kamaráda raní víc, než mu pomůže.",
    },
    explanation:
      "Kamarádovi můžeme pomoct chvilku a pak si jít hrát — obojí jde skloubit. Odmítnutí, předstírání nebo nadávání by kamarádovi ublížily.",
  },
  {
    question: "Které chování NEODPOVÍDÁ pravidlům slušného stolování?",
    correctAnswer: "Mlaskat a mluvit s plnou pusou",
    options: ["Poprosit o podání soli", "Utřít si pusu ubrouskem", "Mlaskat a mluvit s plnou pusou", "Poděkovat za jídlo"],
    emoji: "🍽️",
    hints: [
      "Hledej chování, které ostatní u stolu ruší, ne to, které je zdvořilé.",
      "Projdi možnosti jednu po druhé a zeptej se: Je to zdvořilé, nebo to ostatní u stolu ruší? Pozor, hledáš tu jedinou, která ruší.",
    ],
    optionFeedback: {
      "Poprosit o podání soli": "Poprosit je zdvořilé — to k slušnému stolování patří.",
      "Utřít si pusu ubrouskem": "Ubrousek k slušnému stolování patří.",
      "Poděkovat za jídlo": "Poděkování za jídlo je slušné.",
    },
    explanation:
      "Mlaskání a mluvení s plnou pusou ruší ostatní u stolu a k slušnému stolování nepatří. Prosba, ubrousek i poděkování jsou naopak správné.",
  },
  {
    question: "Spolužák po hodině sám zvedá těžké židle na lavice. Co uděláš?",
    correctAnswer: "Nabídnu mu pomoc, i když to není moje povinnost",
    options: ["Řeknu mu, ať si poradí sám", "Budu se mu smát, že mu to trvá", "Odejdu, protože to není moje práce", "Nabídnu mu pomoc, i když to není moje povinnost"],
    emoji: "🪑",
    hints: [
      "Pomáhat můžeme i tehdy, když nám to nikdo nepřikázal.",
      "Židle jsou těžké a spolužák je na to sám. Nikdo ti to nenařídil, ale ve dvou to půjde rychleji. Co mu tedy můžeš říct?",
    ],
    optionFeedback: {
      "Řeknu mu, ať si poradí sám": "Odmítnout pomoc, když vidíš, že je potřeba, je neohleduplné.",
      "Budu se mu smát, že mu to trvá": "Posměch nepomůže a spolužáka raní.",
      "Odejdu, protože to není moje práce": "Pomáhat můžeme i tehdy, když to není naše povinnost.",
    },
    explanation:
      "I když nám úkol nikdo nepřikázal, můžeme nabídnout pomoc, když vidíme, že je potřeba. Odmítnutí nebo posměch by spolužákovi ublížily.",
  },
  {
    question: "Omylem jsi rozbil sklenici u kamaráda doma. Co je správné udělat?",
    correctAnswer: "Přiznat to a omluvit se",
    options: [
      "Přiznat to a omluvit se",
      "Schovat střepy a tvářit se, že o ničem nevím",
      "Svést to na kamarádova sourozence",
      "Rychle odejít, než si toho někdo všimne",
    ],
    emoji: "🥛",
    hints: [
      "Nehoda se může stát každému. Co je poctivé udělat potom?",
      "Rodina kamaráda si rozbité sklenice stejně všimne. Je lepší, když se to dozví od tebe i se slovem „promiňte“, nebo když najdou schované střepy a nikdo se nehlásí?",
    ],
    optionFeedback: {
      "Schovat střepy a tvářit se, že o ničem nevím": "Schované střepy se najdou, můžou někoho pořezat — a přestanou ti věřit.",
      "Svést to na kamarádova sourozence": "Svést vinu na někoho jiného je lež, která ublíží nevinnému.",
      "Rychle odejít, než si toho někdo všimne": "Útěk nic nevyřeší a je nepoctivý.",
    },
    explanation:
      "I nehodu je správné přiznat a omluvit se za ni. Skrývání, lhaní nebo útěk by důvěru mezi kamarády jen poškodily.",
  },
  {
    question:
      "Ve frontě na oběd stojíš už dlouho a tvůj kamarád tě prosí, ať ho pustíš dopředu. Co je správné?",
    correctAnswer: "Vysvětlím mu, že fronta platí pro všechny, a nepustím ho",
    options: ["Pustím ho, protože je to kamarád", "Vysvětlím mu, že fronta platí pro všechny, a nepustím ho", "Pustím ho, ale budu se zlobit na ostatní ve frontě", "Přestanu čekat a odejdu bez oběda"],
    emoji: "🍱",
    hints: [
      "Zamysli se, co by na to řekli ostatní, kdo ve frontě čekají stejně dlouho jako ty.",
      "Když pustíš kamaráda před sebe, předběhne všechny, kdo stojí za tebou — i ty, kteří čekají stejně dlouho jako ty. Je to k nim spravedlivé? Jak mu to slušně vysvětlíš?",
    ],
    optionFeedback: {
      "Pustím ho, protože je to kamarád": "I kamarád musí čekat — ostatní ve frontě by byli předběhnutí.",
      "Pustím ho, ale budu se zlobit na ostatní ve frontě": "Ostatní za nic nemohou a předbíhání je nefér.",
      "Přestanu čekat a odejdu bez oběda": "Odejít hladový nic nevyřeší, stačí kamarádovi vysvětlit pravidlo.",
    },
    explanation:
      "Pravidlo fronty platí pro všechny stejně — i pro kamarády. Předbíhání by bylo nespravedlivé vůči ostatním, kteří už čekají.",
  },
  {
    question: "Soused si stěžuje, že jste s kamarády na dvoře moc hlasitě křičeli. Co uděláš?",
    correctAnswer: "Omluvím se a budeme si hrát tišeji",
    options: ["Budu křičet ještě víc, dvůr je přece pro všechny", "Řeknu sousedovi, ať si toho nevšímá", "Omluvím se a budeme si hrát tišeji", "Přestaneme si hrát úplně a odejdeme naštvaní"],
    emoji: "🔉",
    hints: [
      "Hledej řešení, které bude v pořádku pro tebe i pro souseda zároveň.",
      "Soused má pravdu, že ho křik na dvoře ruší. Hrát si ale můžete dál — jen potichu. Co mu řekneš a jak změníte hru, aby byli spokojení všichni?",
    ],
    optionFeedback: {
      "Budu křičet ještě víc, dvůr je přece pro všechny": "Dvůr je pro všechny — i pro souseda, který chce klid.",
      "Řeknu sousedovi, ať si toho nevšímá": "Tím souseda odbydeš a problém zůstane.",
      "Přestaneme si hrát úplně a odejdeme naštvaní": "Hrát si můžete dál, stačí ztišit hlas.",
    },
    explanation:
      "Omluva a tišší hra respektují souseda, a přesto si můžete dál hrát. Ještě hlasitější křik nebo naštvané odejití problém neřeší.",
  },
  {
    question: "Smutný kamarád ti svěří tajemství a ty slíbíš mlčet. Co uděláš?",
    correctAnswer: "Vyslechnu ho, utěším ho a tajemství si nechám pro sebe",
    options: ["Vyslechnu ho, ale tajemství hned někomu prozradím", "Řeknu mu, že mě to nezajímá", "Vysmívám se mu, že je smutný", "Vyslechnu ho, utěším ho a tajemství si nechám pro sebe"],
    emoji: "🤫",
    hints: [
      "Spoj dvě pravidla najednou: naslouchání smutnému kamarádovi a dodržení slibu.",
      "Smutný kamarád potřebuje, abys ho vyslechl a řekl mu něco laskavého. A to, co ti svěřil, patří jen vám dvěma — slib se musí dodržet.",
    ],
    optionFeedback: {
      "Vyslechnu ho, ale tajemství hned někomu prozradím": "Vyslechnout je dobře, ale prozrazením porušíš slib a důvěru.",
      "Řeknu mu, že mě to nezajímá": "Smutného kamaráda by to ranilo ještě víc.",
      "Vysmívám se mu, že je smutný": "Posmívat se smutnému je kruté.",
    },
    explanation:
      "Smutného kamaráda vyslechneme a utěšíme, a přitom dodržíme slib mlčenlivosti. Prozrazení tajemství nebo ignorování kamaráda by přátelství poškodily.",
  },
  {
    question: "Ke komu se máme chovat slušně?",
    correctAnswer: "Ke všem lidem, známým i cizím",
    options: [
      "Jen ke kamarádům a rodině",
      "Jen k dospělým, děti nepočítáme",
      "Jen k lidem, kteří jsou slušní k nám",
      "Ke všem lidem, známým i cizím",
    ],
    emoji: "🌍",
    hints: [
      "Přemýšlej, jestli zdvořilost platí jen k někomu, nebo ke každému.",
      "Pozdravíš paní v obchodě, kterou neznáš? Poděkuješ řidiči autobusu? Slušnost nepotřebuje, abychom se s druhým znali nebo aby byl on první.",
    ],
    optionFeedback: {
      "Jen ke kamarádům a rodině": "Slušně se chováme i k lidem, které neznáme — třeba k prodavačce.",
      "Jen k dospělým, děti nepočítáme": "Slušnost platí i ke spolužákům a menším dětem.",
      "Jen k lidem, kteří jsou slušní k nám": "Slušně se chováme, i když se druhý chová hůř — nemusíme se mu podobat.",
    },
    explanation:
      "Slušně se chováme ke všem lidem — ke kamarádům, k rodině i k lidem, které vůbec neznáme. Zdvořilost nezávisí na tom, koho potkáme.",
  },
  {
    question: "Jsi ve třídě sám a spadne ti papírek od svačiny. Co uděláš?",
    correctAnswer: "Zvednu ho a hodím do koše, i když to nikdo nevidí",
    options: [
      "Nechám ho ležet, nikdo to nevidí",
      "Kopnu ho pod lavici spolužáka",
      "Zvednu ho, jen když přijde paní učitelka",
      "Zvednu ho a hodím do koše, i když to nikdo nevidí",
    ],
    emoji: "👀",
    hints: [
      "Platí pravidla, jen když se někdo dívá?",
      "Papírek na zemi tam zůstane, i když odejdeš — a uklízet ho bude někdo jiný. Slušný člověk se chová stejně, ať ho někdo pozoruje, nebo ne.",
    ],
    optionFeedback: {
      "Nechám ho ležet, nikdo to nevidí": "Pravidla platí, i když se nikdo nedívá — papírek by musel uklidit někdo jiný.",
      "Kopnu ho pod lavici spolužáka": "Tím bys nepořádek jen přesunul ke spolužákovi.",
      "Zvednu ho, jen když přijde paní učitelka": "Slušně se chováme vždycky, ne jen kvůli tomu, že nás někdo vidí.",
    },
    explanation:
      "Pravidla slušného chování platí vždy, ne jen tehdy, když se na nás někdo dívá. Papírek proto zvedneme a hodíme do koše.",
  },
  {
    question: "Spolužákovi spadla svačina a zvoní na hodinu. Co uděláš nejdřív?",
    correctAnswer: "Rychle mu pomůžu svačinu sebrat, do třídy stihneme dojít i tak",
    options: [
      "Rychle mu pomůžu svačinu sebrat, do třídy stihneme dojít i tak",
      "Nechám ho, ať si poradí sám, spěchám do třídy",
      "Zasměju se, že mu svačina spadla",
      "Řeknu mu, ať si pospíší, a jdu bez něj",
    ],
    emoji: "🥪",
    hints: [
      "Porovnej, co zabere jen chvilku a co může počkat pár vteřin.",
      "Sebrat svačinu ve dvou trvá pár vteřin a do třídy dojdete skoro stejně rychle. Spolužák by to sám zvládal hůř a zbytečně by se trápil. Co tedy uděláš nejdřív?",
    ],
    optionFeedback: {
      "Nechám ho, ať si poradí sám, spěchám do třídy": "Pár vteřin pomoci tvůj příchod nezpozdí a spolužákovi hodně pomůže.",
      "Zasměju se, že mu svačina spadla": "Smát se nehodě druhého je neohleduplné.",
      "Řeknu mu, ať si pospíší, a jdu bez něj": "Pobízet a odejít mu nepomůže, stačí mu podat ruku.",
    },
    explanation:
      "Pomoc se svačinou zabere jen chvilku a do třídy stihnete dojít oba. Nechat spolužáka bez pomoci nebo se mu smát by nebylo ohleduplné.",
  },
  {
    question: "Který popis nejlépe sedí na slušné chování ke všem lidem kolem nás?",
    correctAnswer: "Zdravíme, děkujeme a pomáháme, i když nás nikdo nechválí",
    options: ["Jsme zdvořilí jen tehdy, když se na nás někdo dívá", "Zdravíme, děkujeme a pomáháme, i když nás nikdo nechválí", "Pomáháme jen tomu, kdo nám dá za pomoc odměnu", "Zdravíme jen ty, které dobře známe"],
    emoji: "🤝",
    hints: [
      "Spoj dohromady víc pravidel slušného chování najednou — zdravení, poděkování i pomoc.",
      "Tři možnosti mají háček — slušnost jen na oko, jen za odměnu, nebo jen k někomu. Hledej tu, kde je slušnost opravdová: platí vždy a ke každému, bez ohledu na pochvalu.",
    ],
    optionFeedback: {
      "Jsme zdvořilí jen tehdy, když se na nás někdo dívá": "Slušnost jen na oko není opravdová.",
      "Pomáháme jen tomu, kdo nám dá za pomoc odměnu": "Pomoc za odměnu je obchod, ne slušnost.",
      "Zdravíme jen ty, které dobře známe": "Zdravíme i lidi, které neznáme.",
    },
    explanation:
      "Slušné chování platí vždy — zdravíme, děkujeme a pomáháme bez ohledu na to, jestli nás někdo chválí. Zdvořilost jen na oko nebo jen k některým lidem opravdová slušnost není.",
  },
  {
    question: "Paní učitelka mluví a kamarád ti chce něco říct. Co je nejlepší?",
    correctAnswer: "Počkáme, až paní učitelka domluví, a pak si to řekneme",
    options: ["Budeme si šuškat, i když paní učitelka mluví", "Kamarád na mě zakřičí přes celou třídu", "Počkáme, až paní učitelka domluví, a pak si to řekneme", "Skočíme paní učitelce do řeči, ať to máme rychle za sebou"],
    emoji: "🤐",
    hints: [
      "Spoj dvě pravidla najednou: neskákat do řeči a počkat na vhodnou chvíli.",
      "Když paní učitelka vykládá, poslouchá celá třída. Šuškání ruší ostatní a křik ještě víc. Kamarádova věc ale nezmizí — řeknete si ji o přestávce.",
    ],
    optionFeedback: {
      "Budeme si šuškat, i když paní učitelka mluví": "Šuškání ruší paní učitelku i spolužáky.",
      "Kamarád na mě zakřičí přes celou třídu": "Křik přes třídu naruší celou hodinu.",
      "Skočíme paní učitelce do řeči, ať to máme rychle za sebou": "Skákat do řeči je nezdvořilé.",
    },
    explanation:
      "Počkáme, až paní učitelka domluví — tak nerušíme ani ji, ani ostatní ve třídě. Šuškání, křik nebo skákání do řeči by hodinu narušily.",
  },
  {
    question: "Babička ti uvařila oběd, který ti moc nechutná. Co je nejslušnější?",
    correctAnswer: "Poděkuji a slušně řeknu, že si dám jen trochu",
    options: [
      "Řeknu, že je to hnusné",
      "Odstrčím talíř a nic neřeknu",
      "Poděkuji a slušně řeknu, že si dám jen trochu",
      "Sním to, ale celou dobu budu fňukat",
    ],
    emoji: "🍲",
    hints: [
      "Spoj dvě věci: vděčnost za babiččinu práci a vlídná slova.",
      "Babička se u plotny snažila, a to si zaslouží poděkování. Že ti jídlo nechutná, můžeš říct taky — ale tak, aby ji to neranilo. Která možnost umí obojí?",
    ],
    optionFeedback: {
      "Řeknu, že je to hnusné": "Hrubé slovo babičku raní, i když je pravda, že ti jídlo nechutná.",
      "Odstrčím talíř a nic neřeknu": "Beze slova odstrčit talíř je nezdvořilé a chybí poděkování.",
      "Sním to, ale celou dobu budu fňukat": "Fňukání u stolu je nepříjemné a babičku by zamrzelo.",
    },
    explanation:
      "Za jídlo poděkujeme, protože si babička dala práci. Upřímnost je v pořádku, když je řečená slušně — hrubost, mlčení nebo fňukání by ji ranily.",
  },
  {
    question: "V knihovně potkáš kamaráda a chceš mu říct novinku. Co uděláš?",
    correctAnswer: "Pozdravím ho potichu a novinku řeknu až venku",
    options: [
      "Zavolám na něj nahlas přes celou místnost",
      "Rozběhnu se k němu a začnu hned vyprávět",
      "Pozdravím ho potichu a novinku řeknu až venku",
      "Budu dělat, že ho nevidím",
    ],
    emoji: "📚",
    hints: [
      "Jaké pravidlo platí v knihovně pro všechny, kdo tam čtou?",
      "V knihovně lidé čtou a potřebují ticho. Kamaráda ale přehlížet nemusíš — stačí mu tiše kývnout a zprávu si nechat na chvíli, kdy budete za dveřmi.",
    ],
    optionFeedback: {
      "Zavolám na něj nahlas přes celou místnost": "Hlasité volání ruší lidi, kteří v knihovně čtou.",
      "Rozběhnu se k němu a začnu hned vyprávět": "Běhat a nahlas vyprávět se v knihovně nesluší.",
      "Budu dělat, že ho nevidím": "Kamaráda přehlížet není pěkné — stačí ho tiše pozdravit.",
    },
    explanation:
      "V knihovně platí dvě pravidla najednou: kamaráda pozdravíme, ale potichu, a delší povídání si necháme na venek, abychom nerušili ostatní.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1.map(toTask);
  return shuffle(pool);
}

export const PRAVIDLASLUSNEHOCHOVANI: TopicMetadata[] = [
  {
    id: "g2-prv-chovani",
    rvpNodeId: "g2-prvouka-lide-kolem-nas-souziti-lidi-pravidla-slusneho-chovani-a-souziti",
    title: "Pravidla slušného chování a soužití",
    studentTitle: "Kouzelná slovíčka",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití lidí",
    briefDescription: "Jak se chovat slušně k lidem.",
    keywords: ["chování", "slušnost", "prosím", "děkuji", "zdravení", "pravidla"],
    goals: [
      "Znát základní pravidla slušného chování.",
      "Umět zdravit a děkovat.",
      "Rozlišit slušné a neslušné chování v konkrétní situaci.",
    ],
    boundaries: [
      "Pouze základní zdvořilost a jednoduché situace přiměřené 2. ročníku.",
      "Kombinace dvou pravidel v L3 je mírná nadstavba, ne samostatné nové učivo.",
    ],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Slušné chování je být zdvořilý: prosím, děkuji, pozdrav.",
      steps: ["Přečti větu nebo situaci.", "Je to slušné, nebo neslušné chování?"],
      commonMistake: "Skákání do řeči, křik a předbíhání ve frontě nejsou slušné chování.",
      example: "Říkáme prosím a děkuji — to je slušné.",
    },
  },
];
