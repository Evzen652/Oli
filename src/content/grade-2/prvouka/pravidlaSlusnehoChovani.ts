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
//   L1 = rozpoznání izolovaného pravidla slušného chování (pozdrav,
//        prosím/děkuji, čekání ve frontě...) — formát Ano/Ne (2 možnosti).
//   L2 = aplikace: rozpoznání správného/nesprávného chování v konkrétní
//        situaci — výběr ze 4 možností.
//   L3 = transfer (kombinace dvou pravidel, rozlišení blízkých situací,
//        jednoduché „co bys udělal, kdyby...“ scénáře s více možnými
//        reakcemi) — většinou 4 možnosti, jen menšina Ano/Ne.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Říkáme prosím a děkuji. Je to pravda?",
    correct: true,
    emoji: "🙏",
    hint: "Prosím a děkuji jsou základní slova zdvořilosti.",
    solution: "Říkáme prosím a děkuji — to jsou základní slova slušného chování.",
  },
  {
    question: "Skáčeme lidem do řeči. Je to pravda?",
    correct: false,
    emoji: "🗣️",
    hint: "Skákat do řeči znamená přerušit někoho, kdo mluví — je to slušné?",
    solution: "Do řeči neskáčeme — počkáme, až druhý domluví.",
  },
  {
    question: "Zdravíme dospělé, když je potkáme. Je to pravda?",
    correct: true,
    emoji: "👋",
    hint: "Pozdrav Dobrý den patří ke slušnému chování.",
    solution: "Zdravíme dospělé — to patří ke slušnému chování.",
  },
  {
    question: "Ve škole při hodině křičíme. Je to pravda?",
    correct: false,
    emoji: "🏫",
    hint: "Ve třídě jsou i ostatní děti a učitel — křičení jim vadí.",
    solution: "Ve škole při hodině nekřičíme — respektujeme ostatní a udržujeme klid.",
  },
  {
    question: "Uklízíme po sobě hračky. Je to pravda?",
    correct: true,
    emoji: "🧹",
    hint: "Po sobě uklízíme, aby bylo čisto pro všechny.",
    solution: "Po sobě uklízíme — každý je zodpovědný za svůj nepořádek.",
  },
  {
    question: "Bereme cizí věci bez dovolení. Je to pravda?",
    correct: false,
    emoji: "🚫",
    hint: "Brát cizí věci bez dovolení je špatné — jak bychom se cítili my?",
    solution: "Cizí věci bez dovolení nebereme — nejdřív se zeptáme.",
  },
  {
    question: "Umýváme si ruce před jídlem. Je to pravda?",
    correct: true,
    emoji: "🧼",
    hint: "Umývání rukou nás chrání před nemocemi.",
    solution: "Umýváme si ruce před jídlem a po záchodě, abychom byli zdraví.",
  },
  {
    question: "U stolu mlaskáme. Je to pravda?",
    correct: false,
    emoji: "🍽️",
    hint: "Mlaskání u stolu ruší ostatní při jídle.",
    solution: "U stolu nemlaskáme — to patří ke slušnému stolování.",
  },
  {
    question: "V čekárně nebo v obchodě čekáme, až na nás přijde řada. Je to pravda?",
    correct: true,
    emoji: "🚶",
    hint: "Předbíhání ve frontě je nefér ke všem, kdo čekají.",
    solution: "Ve frontě čekáme, až na nás přijde řada — nepředbíháme.",
  },
  {
    question: "Posmíváme se ostatním dětem. Je to pravda?",
    correct: false,
    emoji: "🚫",
    hint: "Posmívat se druhým je kruté — jak by se cítili oni?",
    solution: "Neposmíváme se ostatním — to by je zranilo.",
  },
  {
    question: "Mluvíme slušně, bez nadávek. Je to pravda?",
    correct: true,
    emoji: "😊",
    hint: "Slušná řeč neobsahuje nadávky ani hrubá slova.",
    solution: "Mluvíme slušně — bez nadávek a hrubých slov.",
  },
  {
    question: "Házíme odpadky na zem. Je to pravda?",
    correct: false,
    emoji: "🗑️",
    hint: "Odpadky patří do koše, ne na zem.",
    solution: "Odpadky na zem neházíme — patří do koše, abychom udrželi čistotu.",
  },
  {
    question: "Když si chceme půjčit cizí věc, nejdřív se zeptáme. Je to pravda?",
    correct: true,
    emoji: "🙋",
    hint: "Zeptat se předem je slušnější než si věc jen tak vzít.",
    solution: "Nejdřív se zeptáme, teprve pak si věc půjčíme — to je slušné.",
  },
  {
    question: "Rodičům a učitelům lžeme. Je to pravda?",
    correct: false,
    emoji: "🚫",
    hint: "Lhaní ničí důvěru mezi lidmi.",
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
      "Pozdrav patří ke slušnému chování vždy, když někoho potkáme.",
      "Nečekáme, kdo pozdraví první — pozdravit můžeme sami.",
    ],
    explanation:
      "Paní učitelku pozdravíme sami, nečekáme na ni. Mlčení nebo pouhé mávnutí bez pozdravu není dost zdvořilé.",
  },
  {
    question: "Kamarád ti něco půjčí. Co je slušné udělat?",
    correctAnswer: "Poděkovat mu",
    options: [
      "Poděkovat mu",
      "Nic neříct a odejít",
      "Vzít si to bez jediného slova",
      "Říct mu, že to mělo být samozřejmé",
    ],
    emoji: "🙏",
    hints: [
      "Za každou laskavost, i malou, se sluší poděkovat.",
      "Poděkování ukáže kamarádovi, že si jeho pomoci vážíme.",
    ],
    explanation:
      "Za půjčení věci vždy poděkujeme. Mlčení nebo bereme věc jako samozřejmost by kamaráda mrzelo.",
  },
  {
    question: "Ve frontě u pokladny stojí před tebou několik lidí. Co uděláš?",
    correctAnswer: "Počkám, až na mě přijde řada",
    options: [
      "Počkám, až na mě přijde řada",
      "Protlačím se dopředu, protože spěchám",
      "Postavím se hned za pokladní",
      "Řeknu ostatním, ať mě pustí, protože jsem menší",
    ],
    emoji: "🧾",
    hints: [
      "Ve frontě má každý stejné právo počkat, až na něj přijde řada.",
      "Předbíhání je nefér ke všem, kdo už čekají déle.",
    ],
    explanation:
      "Ve frontě počkáme, až na nás přijde řada — to je fér ke všem ostatním. Předbíhání by rozzlobilo lidi, kteří už čekají.",
  },
  {
    question: "Spolužák ti něco vypráví o svém výletu. Co je slušné udělat?",
    correctAnswer: "Pozorně ho poslouchám a nepřerušuji ho",
    options: [
      "Pozorně ho poslouchám a nepřerušuji ho",
      "Skočím mu do řeči se svým vyprávěním",
      "Začnu si povídat s někým jiným",
      "Řeknu mu, ať už mlčí, protože mě to nezajímá",
    ],
    emoji: "👂",
    hints: [
      "Poslouchat druhého bez přerušování je základ slušného rozhovoru.",
      "Skákání do řeči ukazuje, že nás nezajímá, co druhý říká.",
    ],
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
      "Zeptat se předem je vždy správnější než si věc jen tak vzít.",
    ],
    explanation:
      "Před půjčením cizí věci se vždy zeptáme majitele. Vzít si věc bez dovolení by nebylo slušné, i kdyby si toho spolužák nevšiml.",
  },
  {
    question: "V jídelně dojídáš oběd a chceš vstát od stolu. Co je slušné udělat?",
    correctAnswer: "Utřu si pusu ubrouskem a uklidím po sobě talíř",
    options: [
      "Utřu si pusu ubrouskem a uklidím po sobě talíř",
      "Odejdu a nechám talíř na stole",
      "Otřu si pusu do rukávu",
      "Nechám drobky rozházené po stole",
    ],
    emoji: "🍽️",
    hints: [
      "Po jídle patří k slušnému stolování úklid po sobě a čistá pusa.",
      "Rukáv není ubrousek — na to máme papírový ubrousek.",
    ],
    explanation:
      "Po jídle si utřeme pusu ubrouskem a uklidíme po sobě. Nechat nepořádek nebo si utírat pusu do rukávu není slušné stolování.",
  },
  {
    question: "Vidíš, že staršímu pánovi v autobuse není kde sednout. Co uděláš?",
    correctAnswer: "Uvolním mu své místo",
    options: [
      "Uvolním mu své místo",
      "Budu se tvářit, že spím",
      "Zůstanu sedět, protože jsem přišel dřív",
      "Řeknu mu, ať se zeptá někoho jiného",
    ],
    emoji: "🚌",
    hints: [
      "Starším lidem v dopravě uvolňujeme místo z úcty k nim.",
      "Předstírání spánku, aby si nikdo nic nevšiml, není slušné.",
    ],
    explanation:
      "Staršímu člověku v autobuse uvolníme místo — je to projev úcty. Předstírání spánku nebo odmítnutí by nebylo ohleduplné.",
  },
  {
    question: "Kýchneš nebo kašleš. Co je slušné udělat?",
    correctAnswer: "Zakryji si ústa rukou nebo loktem",
    options: [
      "Zakryji si ústa rukou nebo loktem",
      "Kýchnu přímo na spolužáka vedle sebe",
      "Nic nedělám, kýchnutí je normální",
      "Odvrátím se, ale nezakryji si ústa",
    ],
    emoji: "🤧",
    hints: [
      "Zakrytí úst při kýchání chrání ostatní kolem nás.",
      "I když je kýchnutí normální, sluší se ho zakrýt.",
    ],
    explanation:
      "Při kýchání nebo kašli si zakryjeme ústa rukou nebo loktem, abychom nešířili nemoci. Kýchnutí bez zakrytí by mohlo nakazit ostatní.",
  },
  {
    question: "Kamarád ti ukazuje svůj nový výkres. Co je slušné udělat?",
    correctAnswer: "Podívám se na něj a řeknu mu na něm něco hezkého",
    options: [
      "Podívám se na něj a řeknu mu na něj něco hezkého",
      "Ani se nepodívám a odejdu",
      "Řeknu mu, že je to ošklivé",
      "Vezmu mu výkres z ruky bez dovolení",
    ],
    emoji: "🎨",
    hints: [
      "Když se s námi někdo chce o něco podělit, věnujeme mu pozornost.",
      "I malá pochvala kamarádovi udělá radost.",
    ],
    explanation:
      "Kamarádovu výkresu věnujeme pozornost a řekneme mu na něm něco hezkého. Ignorování nebo hrubá poznámka by ho zklamaly.",
  },
  {
    question: "Vstupuješ do dveří a za tebou jde ještě někdo. Co je slušné udělat?",
    correctAnswer: "Přidržím mu dveře",
    options: [
      "Přidržím mu dveře",
      "Pustím dveře, ať si poradí sám",
      "Zabouchnu dveře co nejrychleji",
      "Počkám, až projde, a pak teprve vejdu já",
    ],
    emoji: "🚪",
    hints: [
      "Přidržení dveří je malá, ale hezká pomoc druhému člověku.",
      "Nemusíme čekat na požádání, stačí si všimnout, že za námi někdo jde.",
    ],
    explanation:
      "Když za námi někdo jde, přidržíme mu dveře — je to drobná, ale milá pomoc. Zabouchnutí dveří by bylo neohleduplné.",
  },
  {
    question: "Omylem šlápneš spolužákovi na nohu. Co uděláš?",
    correctAnswer: "Hned se omluvím",
    options: [
      "Hned se omluvím",
      "Tvářím se, že se nic nestalo",
      "Řeknu mu, že si za to může sám",
      "Zasměju se a jdu dál",
    ],
    emoji: "🦶",
    hints: [
      "I když jsme něco udělali omylem, patří se za to omluvit.",
      "Rychlá omluva ukazuje, že nám na druhém záleží.",
    ],
    explanation:
      "I za neúmyslnou chybu se hned omluvíme. Předstírání, že se nic nestalo, nebo smích by spolužáka mrzely.",
  },
  {
    question: "Chceš se do rozhovoru dospělých na chvíli zapojit. Co je slušné udělat?",
    correctAnswer: "Počkám, až domluví, nebo slušně řeknu „promiňte“",
    options: [
      "Počkám, až domluví, nebo slušně řeknu „promiňte“",
      "Skočím jim rovnou do řeči",
      "Křičím, dokud si mě nevšimnou",
      "Taham dospělého za rukáv a mluvím přes něj",
    ],
    emoji: "🗨️",
    hints: [
      "Do řeči dospělým neskáčeme — počkáme na vhodnou chvíli.",
      "Slovo „promiňte“ je zdvořilý způsob, jak na sebe upozornit.",
    ],
    explanation:
      "Počkáme, až dospělí domluví, nebo slušně řekneme „promiňte“. Skákání do řeči nebo křik nejsou zdvořilé.",
  },
  {
    question: "Ve školní jídelně sedíš vedle spolužáka, kterému bylo nedávno špatně. Co je vhodné udělat?",
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
      "Když si nejsme jistí, přivedeme na pomoc dospělého.",
    ],
    explanation:
      "Zeptáme se spolužáka, jak se cítí, a v případě potřeby zavoláme dospělého. Ignorování nebo posměch by mu ublížily.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Kamarád tě prosí o pomoc s úkolem přesně ve chvíli, kdy chceš jít hrát ven. Co je nejlepší řešení?",
    correctAnswer: "Aspoň chvíli mu pomůžu a pak jdu ven",
    options: [
      "Aspoň chvíli mu pomůžu a pak jdu ven",
      "Řeknu mu, že nemám čas, a hned odejdu ven",
      "Budu předstírat, že jsem ho neslyšel",
      "Pomůžu mu, ale celou dobu mu budu nadávat, že mě zdržuje",
    ],
    emoji: "⏰",
    hints: [
      "Spoj dvě věci: ochotu pomoci a to, že si i tak splníš svůj plán.",
      "Pomoc nemusí trvat dlouho — stačí chvilka, aby kamarádovi nebylo líto.",
    ],
    explanation:
      "Kamarádovi můžeme pomoct chvilku a pak si jít hrát — obojí jde skloubit. Odmítnutí, předstírání nebo nadávání by kamarádovi ublížily.",
  },
  {
    question: "Které chování NEODPOVÍDÁ pravidlům slušného stolování?",
    correctAnswer: "Mlaskat a mluvit s plnou pusou",
    options: [
      "Mlaskat a mluvit s plnou pusou",
      "Poprosit o podání soli",
      "Utřít si pusu ubrouskem",
      "Poděkovat za jídlo",
    ],
    emoji: "🍽️",
    hints: [
      "Hledej chování, které ostatní u stolu ruší, ne to, které je zdvořilé.",
      "Tři možnosti jsou příklady slušného stolování, jedna jim odporuje.",
    ],
    explanation:
      "Mlaskání a mluvení s plnou pusou ruší ostatní u stolu a k slušnému stolování nepatří. Prosba, ubrousek i poděkování jsou naopak správné.",
  },
  {
    question: "Ve třídě vidíš, jak se spolužák snaží zasunout těžké židle po hodině. Co uděláš?",
    correctAnswer: "Nabídnu mu pomoc, i když to není moje povinnost",
    options: [
      "Nabídnu mu pomoc, i když to není moje povinnost",
      "Řeknu mu, ať si poradí sám",
      "Budu se mu smát, že mu to trvá",
      "Odejdu, protože to není moje práce",
    ],
    emoji: "🪑",
    hints: [
      "Pomoc nemusíme nabízet jen tehdy, když je to naše povinnost.",
      "Ochota pomoci i bez povinnosti je znak slušného chování.",
    ],
    explanation:
      "I když nám úkol nikdo nepřikázal, můžeme nabídnout pomoc, když vidíme, že je potřeba. Odmítnutí nebo posměch by spolužákovi neušlo na dobrotě.",
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
      "Spoj dvě věci: přiznání toho, co se stalo, a omluvu.",
      "Skrývání pravdy by kamaráda i jeho rodinu mrzelo víc než rozbitá sklenice.",
    ],
    explanation:
      "I nehodu je správné přiznat a omluvit se za ni. Skrývání, lhaní nebo útěk by důvěru mezi kamarády jen poškodily.",
  },
  {
    question:
      "Ve frontě na oběd stojíš už dlouho a tvůj kamarád tě prosí, ať ho pustíš dopředu. Co je správné?",
    correctAnswer: "Vysvětlím mu, že fronta platí pro všechny, a nepustím ho",
    options: [
      "Vysvětlím mu, že fronta platí pro všechny, a nepustím ho",
      "Pustím ho, protože je to kamarád",
      "Pustím ho, ale budu se zlobit na ostatní ve frontě",
      "Přestanu čekat a odejdu bez oběda",
    ],
    emoji: "🍱",
    hints: [
      "Pravidlo fronty platí pro všechny stejně, i pro kamarády.",
      "Zvýhodnění kamaráda by bylo nefér k ostatním, kteří už čekají.",
    ],
    explanation:
      "Pravidlo fronty platí pro všechny stejně — i pro kamarády. Předbíhání by bylo nespravedlivé vůči ostatním, kteří už čekají.",
  },
  {
    question: "Soused si stěžuje, že jste s kamarády na dvoře moc hlasitě křičeli. Co uděláš?",
    correctAnswer: "Omluvím se a budeme si hrát tišeji",
    options: [
      "Omluvím se a budeme si hrát tišeji",
      "Budu křičet ještě víc, dvůr je přece pro všechny",
      "Řeknu sousedovi, ať si nevšímá",
      "Přestaneme si hrát úplně a odejdeme naštvaní",
    ],
    emoji: "🔉",
    hints: [
      "Hledej řešení, které bude v pořádku pro tebe i pro souseda zároveň.",
      "Omluva a tišší hra ti dovolí hrát si dál a souseda přitom neruší.",
    ],
    explanation:
      "Omluva a tišší hra respektují souseda, a přesto si můžete dál hrát. Ještě hlasitější křik nebo naštvané odejití problém neřeší.",
  },
  {
    question:
      "Kamarád ti řekne něco, co ho mrzí, a zároveň ti prozradí tajemství, které jsi slíbil nikomu neříct. Co uděláš?",
    correctAnswer: "Vyslechnu ho, utěším ho a tajemství si nechám pro sebe",
    options: [
      "Vyslechnu ho, utěším ho a tajemství si nechám pro sebe",
      "Vyslechnu ho, ale tajemství hned někomu prozradím",
      "Řeknu mu, že mě to nezajímá",
      "Vysmívám se mu, že je smutný",
    ],
    emoji: "🤫",
    hints: [
      "Spoj dvě pravidla najednou: naslouchání smutnému kamarádovi a dodržení slibu.",
      "Vyzrazení tajemství by porušilo důvěru, i kdybys kamaráda předtím pěkně utěšil.",
    ],
    explanation:
      "Smutného kamaráda vyslechneme a utěšíme, a přitom dodržíme slib mlčenlivosti. Prozrazení tajemství nebo ignorování kamaráda by přátelství poškodily.",
  },
  {
    question: "Slušné chování znamená být zdvořilý jen k lidem, které dobře známe. Je to pravda?",
    correctAnswer: NE,
    options: [ANO, NE],
    emoji: "🌍",
    hints: [
      "Přemýšlej, jestli zdvořilost platí jen ke kamarádům a rodině, nebo ke všem lidem.",
    ],
    explanation:
      "Ne, to není pravda — slušně se chováme ke všem lidem, i k těm, které dobře neznáme.",
  },
  {
    question: "I když nás nikdo nevidí, pravidla slušného chování stále platí. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "👀",
    hints: [
      "Přemýšlej, jestli se slušně chováme jen proto, aby nás někdo pochválil.",
    ],
    explanation:
      "Ano, to je pravda — slušně se chováme vždy, ne jen tehdy, když se na nás někdo dívá.",
  },
  {
    question:
      "Vidíš spolužáka, jak upustil svačinu na podlahu, a zároveň zvoní na hodinu. Co uděláš nejdřív?",
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
      "Krátká pomoc nezpůsobí velké zpoždění, ale spolužákovi hodně pomůže.",
    ],
    explanation:
      "Pomoc se svačinou zabere jen chvilku a do třídy stihnete dojít oba. Nechat spolužáka bez pomoci nebo se mu smát by nebylo ohleduplné.",
  },
  {
    question: "Který popis nejlépe sedí na slušné chování ke všem lidem kolem nás?",
    correctAnswer: "Zdravíme, děkujeme a pomáháme, i když nás nikdo nechválí",
    options: [
      "Zdravíme, děkujeme a pomáháme, i když nás nikdo nechválí",
      "Jsme zdvořilí jen tehdy, když se na nás někdo dívá",
      "Pomáháme jen tomu, kdo nám dá za pomoc odměnu",
      "Zdravíme jen ty, které dobře známe",
    ],
    emoji: "🤝",
    hints: [
      "Spoj dohromady víc pravidel slušného chování najednou — zdravení, poděkování i pomoc.",
      "Opravdová slušnost neplatí jen tehdy, když si toho někdo všimne.",
    ],
    explanation:
      "Slušné chování platí vždy — zdravíme, děkujeme a pomáháme bez ohledu na to, jestli nás někdo chválí. Zdvořilost jen na oko nebo jen k některým lidem opravdová slušnost není.",
  },
  {
    question:
      "Kamarád ti chce ve třídě něco poprosit, ale zrovna mluví paní učitelka. Co je nejlepší udělat?",
    correctAnswer: "Počkáme, až paní učitelka domluví, a pak si to řekneme",
    options: [
      "Počkáme, až paní učitelka domluví, a pak si to řekneme",
      "Budeme si šuškat, i když paní učitelka mluví",
      "Kamarád na mě zakřičí přes celou třídu",
      "Skočíme paní učitelce do řeči, ať to máme rychle za sebou",
    ],
    emoji: "🤐",
    hints: [
      "Spoj dvě pravidla najednou: neskákat do řeči a počkat na vhodnou chvíli.",
      "To, co může počkat, počkejme, i když nás to láká říct hned.",
    ],
    explanation:
      "Počkáme, až paní učitelka domluví — tak neruší ani ji, ani ostatní ve třídě. Šuškání, křik nebo skákání do řeči by hodinu narušily.",
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
    studentTitle: "Slušné chování",
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
