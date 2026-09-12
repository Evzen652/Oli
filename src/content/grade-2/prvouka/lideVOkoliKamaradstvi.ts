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
//   L1 = rozpoznání izolovaného faktu/pravidla: co je soused, co je
//        kamarádství, základní pravidla chování — formát Ano/Ne
//        (2 možnosti).
//   L2 = aplikace: rozpoznání správného chování v konkrétní jednoduché
//        situaci — výběr ze 4 možností.
//   L3 = transfer: kombinace dvou pravidel, rozlišení blízkých situací
//        „opravdový vs. falešný kamarád“, priorita mezi dvěma potřebami,
//        „co bys udělal, kdyby...“ — výhradně 4 možnosti (Ano/Ne jen na L1).
// Každá úloha: dvě vlastní nápovědy, zpětná vazba u každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Soused je člověk, který bydlí blízko nás. Je to pravda?",
    correct: true,
    emoji: "🏘️",
    hint: "Sousedé bydlí v okolí našeho domu nebo bytu.",
    hint2: "Vzpomeň si, kdo bydlí ve vedlejším bytě nebo v domě hned vedle vás. Jak těm lidem říkáme a jak daleko od nás bydlí?",
    wrong: "Soused opravdu bydlí blízko nás — ve stejném domě, ve vedlejším domě nebo ve stejné ulici.",
    solution: "Soused je člověk, který bydlí blízko nás — třeba ve stejném domě nebo ulici.",
  },
  {
    question: "Kamarád je ten, s kým si rádi hrajeme. Je to pravda?",
    correct: true,
    emoji: "👫",
    hint: "Přemýšlej, jak trávíš čas se svým kamarádem.",
    hint2: "Vzpomeň si na svého nejlepšího kamaráda: co spolu děláte o přestávce nebo odpoledne venku? Je vám spolu dobře?",
    wrong: "Kamarád je právě ten, s kým si rádi hrajeme a trávíme čas.",
    solution: "Kamarád je ten, s kým si rádi hrajeme a je nám s ním dobře.",
  },
  {
    question: "Kamarádovi pomáháme, když to potřebuje. Je to pravda?",
    correct: true,
    emoji: "🤝",
    hint: "Pomoc je základ přátelství.",
    hint2: "Představ si, že kamarádovi spadnou pastelky na zem. Co udělá dobrý kamarád, který stojí hned vedle něj?",
    wrong: "Kamarádovi pomáháme, když to potřebuje — tak vypadá opravdové přátelství.",
    solution: "Kamarádovi pomáháme — tak vypadá opravdové přátelství.",
  },
  {
    question: "Souseda zdravíme, když ho potkáme. Je to pravda?",
    correct: true,
    emoji: "👋",
    hint: "Pozdrav je základní slušnost.",
    hint2: "Když ráno na chodbě potkáš paní odvedle, co jí řekneš? Pozdrav ukazuje, že se k sousedům chováme přátelsky.",
    wrong: "Souseda zdravíme — je to slušné a přátelské chování.",
    solution: "Souseda zdravíme — je to slušné a přátelské chování.",
  },
  {
    question: "Kamarádovi lžeme, když se nás na něco zeptá. Je to pravda?",
    correct: false,
    emoji: "🙅",
    hint: "Lhaní přátelství poškozuje.",
    hint2: "Představ si, že by ti kamarád lhal. Mohl bys mu pak věřit? Přátelství stojí na tom, že si navzájem věříme.",
    wrong: "Kamarádovi nelžeme — lež ničí důvěru, na které přátelství stojí.",
    solution: "Kamarádovi nelžeme — přátelství stojí na důvěře.",
  },
  {
    question: "Sousedovi schválně ubližujeme. Je to pravda?",
    correct: false,
    emoji: "🏘️",
    hint: "Přemýšlej, jak by ses cítil ty, kdyby ti někdo ubližoval.",
    hint2: "Se sousedy bydlíme blízko a potkáváme se skoro každý den. Chceme spolu vycházet dobře, nebo si dělat zle?",
    wrong: "Sousedovi schválně neubližujeme — k sousedům se chováme hezky.",
    solution: "Sousedovi neubližujeme — k sousedům se chováme hezky.",
  },
  {
    question: "S kamarádem se o hračky a svačinu dělíme. Je to pravda?",
    correct: true,
    emoji: "🍎",
    hint: "Dělení se je projev přátelství.",
    hint2: "Kamarád zapomněl svačinu a ty máš dvě jablka. Co udělá dobrý kamarád? Dělit se znamená dát kousek i druhému.",
    wrong: "S kamarádem se o hračky i svačinu dělíme — to patří k přátelství.",
    solution: "S kamarádem se dělíme — tak vypadá pravé přátelství.",
  },
  {
    question: "Kamaráda pozorně posloucháme, když nám něco vypráví. Je to pravda?",
    correct: true,
    emoji: "👂",
    hint: "Naslouchání ukazuje, že nám na kamarádovi záleží.",
    hint2: "Když ti kamarád vypráví o výletu, díváš se na něj a necháš ho domluvit? Tak mu ukážeš, že tě jeho vyprávění zajímá.",
    wrong: "Kamaráda pozorně posloucháme — dáváme mu najevo, že nás zajímá.",
    solution: "Kamaráda posloucháme — dáváme mu najevo, že nás zajímá, co říká.",
  },
  {
    question: "Kamaráda strkáme a rveme mu věci z ruky. Je to pravda?",
    correct: false,
    emoji: "🙅",
    hint: "Fyzické ubližování kamarádství ničí.",
    hint2: "Jak by ti bylo, kdyby tě někdo strčil a vytrhl ti hračku z ruky? Kamarádi se k sobě chovají ohleduplně a o věc si řeknou.",
    wrong: "Kamaráda nestrkáme ani mu nebereme věci silou — to by ho bolelo a mrzelo.",
    solution: "Kamaráda nestrkáme ani mu nebereme věci silou — to není přátelské chování.",
  },
  {
    question: "Souseda schválně zlobíme a děláme mu naschvály. Je to pravda?",
    correct: false,
    emoji: "😠",
    hint: "Naschvály sousedovi škodí a nejsou zdvořilé.",
    hint2: "Naschvál je věc, kterou děláme schválně, aby to druhého zlobilo — třeba zazvoníme a utečeme. Dělají to dobří sousedé?",
    wrong: "Sousedovi naschvály neděláme — sousedé si mají spíš pomáhat.",
    solution: "Souseda schválně nezlobíme — sousedé si mají spíš pomáhat.",
  },
  {
    question: "Kamarádovi přejeme, aby se mu dařilo. Je to pravda?",
    correct: true,
    emoji: "❤️",
    hint: "Přát někomu dobro je znak přátelství.",
    hint2: "Kamarád vyhrál závod. Raduješ se s ním, nebo se zlobíš? Dobrý kamarád má radost, když se druhému daří.",
    wrong: "Kamarádovi přejeme, aby se mu dařilo — chceme, aby byl šťastný.",
    solution: "Kamarádovi přejeme dobro — chceme, aby byl šťastný.",
  },
  {
    question: "Kamaráda máme rádi takového, jaký je. Je to pravda?",
    correct: true,
    emoji: "👫",
    hint: "Každý je trochu jiný a to je v pořádku.",
    hint2: "Tvůj kamarád má třeba jiné oblíbené jídlo nebo jiné hry než ty. Přestaneš ho mít rád jen kvůli tomu?",
    wrong: "Kamaráda máme rádi takového, jaký je — i s tím, v čem se od nás liší.",
    solution: "Kamaráda přijímáme takového, jaký je — to je součástí přátelství.",
  },
  {
    question: "Kamarádovi bereme věci bez dovolení. Je to pravda?",
    correct: false,
    emoji: "🧸",
    hint: "Brát věci bez dovolení kamaráda mrzí.",
    hint2: "Než si půjčíš kamarádovu gumu, co mu řekneš? Věc patří tomu, kdo ji vlastní, a on rozhoduje, jestli ji půjčí.",
    wrong: "Kamarádovi věci bez dovolení nebereme — nejdřív se zeptáme.",
    solution: "Kamarádovi věci bez dovolení nebereme — nejdřív se zeptáme.",
  },
  {
    question: "S kamarády si rádi hrajeme společné hry. Je to pravda?",
    correct: true,
    emoji: "🎲",
    hint: "Společná hra kamarádství posiluje.",
    hint2: "Vzpomeň si na honičku nebo schovávanou s kamarády o přestávce. Baví vás to spolu a těšíte se na další hru?",
    wrong: "S kamarády si rádi hrajeme — společná hra je jedna z hezkých věcí na přátelství.",
    solution: "S kamarády si hrajeme rádi — to je jedna z hezkých věcí na přátelství.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Kamarád spadl a bolí ho koleno. Co uděláš?",
    correctAnswer: "Pomůžu mu vstát a řeknu to dospělému",
    options: [
      "Pomůžu mu vstát a řeknu to dospělému",
      "Budu se mu smát",
      "Odejdu si hrát jinam, jako by se nic nestalo",
      "Řeknu mu, že je nešikovný",
    ],
    emoji: "🤕",
    hints: [
      "Přemýšlej, co potřebuje kamarád, kterého něco bolí.",
      "Kamarád sedí na zemi a pláče. Potřebuje dvě věci: někoho, kdo mu podá ruku, a dospělého, který se podívá na zraněné koleno a ošetří ho.",
    ],
    optionFeedback: {
      "Budu se mu smát": "Smát se někomu, koho něco bolí, je kruté — kamarádovi by bylo ještě hůř.",
      "Odejdu si hrát jinam, jako by se nic nestalo": "Když odejdeš, kamarád zůstane se zraněním sám a nikdo mu nepomůže.",
      "Řeknu mu, že je nešikovný": "Spadnout se může každému; výčitka kamarádovi nepomůže, jen ho zarmoutí.",
    },
    explanation:
      "Když se kamarádovi něco stane, pomůžeme mu a přivedeme dospělého. Smích, útěk nebo posměch kamarádovi jen ublíží.",
  },
  {
    question: "Potkáš souseda na chodbě domu. Co je slušné udělat?",
    correctAnswer: "Pozdravím ho",
    options: ["Předstírám, že ho nevidím", "Pozdravím ho", "Rychle utíkám pryč", "Mluvím jen s kamarády, sousedy nezdravím"],
    emoji: "👋",
    hints: [
      "Slušnost platí ke všem, které potkáme, i k sousedům.",
      "Ráno na chodbě potkáš pana souseda ze třetího patra. Jaká slova mu řekneš, aby poznal, že jsi slušně vychovaný? Třeba „Dobrý den!“",
    ],
    optionFeedback: {
      "Předstírám, že ho nevidím": "Předstírat, že souseda nevidíš, je nezdvořilé — soused by si mohl myslet, že se na něj zlobíš.",
      "Rychle utíkám pryč": "Útěk nedává smysl, soused ti nic zlého nedělá.",
      "Mluvím jen s kamarády, sousedy nezdravím": "Slušnost platí ke všem, nejen ke kamarádům — sousedy zdravíme také.",
    },
    explanation:
      "Souseda zdravíme stejně jako kamarády — pozdrav je základní slušnost. Přehlížení nebo útěk sousedovi nepřijde milé.",
  },
  {
    question: "Kamarád ti půjčí svou oblíbenou hračku. Jak se o ni budeš starat?",
    correctAnswer: "Budu s ní zacházet opatrně a vrátím mu ji v pořádku",
    options: ["Nechám ji ležet venku v dešti", "Půjčím ji dál někomu jinému bez dovolení", "Budu s ní zacházet opatrně a vrátím mu ji v pořádku", "Budu si s ní hrát tak drsně, že se rozbije"],
    emoji: "🧸",
    hints: [
      "Půjčenou věc si opatruj tak, jako bys chtěl, aby si opatroval tvoji věc kamarád.",
      "Představ si, že kamarád dostane svou hračku zpátky. Má se na ni těšit a hrát si s ní dál jako předtím? Pak s ní musíš být šetrný a vrátit ji celou a čistou.",
    ],
    optionFeedback: {
      "Nechám ji ležet venku v dešti": "Déšť hračku zničí a kamarád by o ni přišel.",
      "Půjčím ji dál někomu jinému bez dovolení": "Hračka není tvoje — o tom, komu ji půjčí, rozhoduje kamarád.",
      "Budu si s ní hrát tak drsně, že se rozbije": "Rozbitou hračku už kamarádovi v pořádku nevrátíš, velmi by ho to mrzelo.",
    },
    explanation:
      "O půjčenou hračku se staráme opatrně a vrátíme ji v pořádku. Nechat ji venku, půjčit ji dál bez dovolení nebo ji rozbít by kamaráda mrzelo.",
  },
  {
    question: "Do třídy přijde nový spolužák, který tam ještě nikoho nezná. Co můžeš udělat?",
    correctAnswer: "Pozvu ho, aby si hrál s námi",
    options: ["Budu se mu smát, že je nový", "Budu ho úplně ignorovat", "Řeknu ostatním, ať si s ním nehrají", "Pozvu ho, aby si hrál s námi"],
    emoji: "🙋",
    hints: [
      "Nový spolužák je ve třídě sám a nikoho nezná — čím mu pomůžeš?",
      "Vzpomeň si, jak je člověku, když nikoho nezná a stojí o přestávce sám. Co by mu nejvíc pomohlo, aby se mezi vámi rychle cítil dobře?",
    ],
    optionFeedback: {
      "Budu se mu smát, že je nový": "Za to, že je nový, nemůže — posměch by ho zranil.",
      "Budu ho úplně ignorovat": "Když si ho nikdo nevšímá, zůstane sám a smutný.",
      "Řeknu ostatním, ať si s ním nehrají": "Vylučovat někoho z party je zlé a ubližuje mu to.",
    },
    explanation:
      "Nového spolužáka pozveme, aby si hrál s námi — tak se rychle stane naším kamarádem. Posměch, ignorování nebo vylučování by mu ublížily.",
  },
  {
    question: "Sousedka nese těžké tašky s nákupem. Jak jí pomůžeš?",
    correctAnswer: "Nabídnu jí, že jí s taškami pomůžu",
    options: [
      "Nabídnu jí, že jí s taškami pomůžu",
      "Předstírám, že ji nevidím",
      "Počkám, jestli si sama řekne o pomoc",
      "Řeknu jí, ať si poradí sama",
    ],
    emoji: "🛍️",
    hints: [
      "Pomoc můžeme nabídnout sami, nemusíme čekat, až o ni soused požádá.",
      "Sousedka má plné ruce a tašky jsou těžké. Co ji potěší víc — když ji mineš, nebo když se jí zeptáš, jestli jednu tašku neponeseš ty?",
    ],
    optionFeedback: {
      "Předstírám, že ji nevidím": "Sousedka pomoc potřebuje právě teď; přehlížení jí nepomůže.",
      "Počkám, jestli si sama řekne o pomoc": "Sousedka se možná stydí požádat — pomoc můžeš nabídnout sám.",
      "Řeknu jí, ať si poradí sama": "Takové odmítnutí je nezdvořilé a sousedku by mrzelo.",
    },
    explanation:
      "Když vidíme, že soused potřebuje pomoc, sami mu ji nabídneme. Přehlížení nebo čekání, až si řekne sám, mu nepomůže.",
  },
  {
    question: "Kamarád ti svěří tajemství a poprosí tě, ať to nikomu neříkáš. Co uděláš?",
    correctAnswer: "Tajemství si nechám pro sebe, jak jsem slíbil",
    options: ["Hned to řeknu celé třídě", "Tajemství si nechám pro sebe, jak jsem slíbil", "Napíšu to na papírek a nechám ho ve třídě", "Řeknu to aspoň jednomu dalšímu kamarádovi"],
    emoji: "🤫",
    hints: [
      "Slib je slib — když kamarádovi něco slíbíme, měli bychom to dodržet.",
      "Kamarád ti věří, a proto ti tajemství svěřil. Když ho prozradíš — i jen jednomu člověku — kamarád se to dozví a přestane ti věřit. Co tedy s tajemstvím uděláš?",
    ],
    optionFeedback: {
      "Hned to řeknu celé třídě": "Tím bys porušil slib a kamarád by ti už nic nesvěřil.",
      "Napíšu to na papírek a nechám ho ve třídě": "Papírek si může přečíst kdokoli — tajemství by se prozradilo.",
      "Řeknu to aspoň jednomu dalšímu kamarádovi": "I jeden člověk navíc znamená porušený slib — tajemství patří jen vám dvěma.",
    },
    explanation:
      "Když kamarádovi slíbíme, že tajemství nikomu neřekneme, měli bychom slib dodržet. Prozrazení, byť jen jednomu dalšímu kamarádovi, důvěru poruší.",
  },
  {
    question: "Ve třídě je jen jedna nová hra a všichni ji chtějí hrát najednou. Co uděláš?",
    correctAnswer: "Domluvíme se, kdo bude hrát první, a pak se vystřídáme",
    options: ["Vezmu si hru sám a nikomu ji nepůjčím", "Budu křičet, ať mi hru dají první", "Domluvíme se, kdo bude hrát první, a pak se vystřídáme", "Hru schovám, aby ji neměl nikdo"],
    emoji: "🎲",
    hints: [
      "Když věc chce víc lidí najednou, pomůže domluva a pořadí.",
      "Hra je jen jedna, ale dětí je víc. Nejlepší je dohodnout pořadí — třeba losováním nebo rozpočitadlem — a každý si zahraje chvíli.",
    ],
    optionFeedback: {
      "Vezmu si hru sám a nikomu ji nepůjčím": "Hra patří celé třídě; kdo si ji přivlastní, bere ji ostatním.",
      "Budu křičet, ať mi hru dají první": "Křikem se nic spravedlivě nevyřeší, jen se všichni pohádají.",
      "Hru schovám, aby ji neměl nikdo": "Pak si nezahraje nikdo, ani ty — spor to nevyřeší.",
    },
    explanation:
      "Domluva a střídání jsou spravedlivé řešení, když hru chce hrát víc dětí najednou. Sobecké přivlastnění, křik nebo schování hry problém jen zhorší.",
  },
  {
    question: "Kamarád pláče, protože prohrál ve hře. Co je vhodné udělat?",
    correctAnswer: "Utěším ho a řeknu mu, že příště to může dopadnout líp",
    options: ["Budu se mu smát, že prohrál", "Řeknu mu, že je špatný hráč", "Odejdu, ať si to vyřeší sám", "Utěším ho a řeknu mu, že příště to může dopadnout líp"],
    emoji: "😢",
    hints: [
      "Smutnému kamarádovi pomůže laskavé slovo, ne posměch.",
      "Vzpomeň si, jak je ti, když prohraješ ty. Co bys chtěl v tu chvíli slyšet od kamaráda — výsměch, nebo povzbuzení, že se to příště povede?",
    ],
    optionFeedback: {
      "Budu se mu smát, že prohrál": "Smích by kamaráda ranil ještě víc.",
      "Řeknu mu, že je špatný hráč": "Taková slova ho zarmoutí; prohrát může každý.",
      "Odejdu, ať si to vyřeší sám": "Smutný kamarád potřebuje oporu, ne samotu.",
    },
    explanation:
      "Smutného kamaráda utěšíme a povzbudíme, že příště to může dopadnout lépe. Posměch nebo urážka by mu jen přitížily.",
  },
  {
    question: "Soused ti popřeje hezký den. Jak správně zareaguješ?",
    correctAnswer: "Poděkuji a popřeju mu to samé",
    options: [
      "Poděkuji a popřeju mu to samé",
      "Vůbec neodpovím a jdu dál",
      "Řeknu mu, ať mě nechá na pokoji",
      "Jen zamávám a schovám se za rohem",
    ],
    emoji: "😊",
    hints: [
      "Na pěkné přání odpovíme pěkným přáním.",
      "Soused byl milý a přál ti něco hezkého. Jaká slušná slova se hodí jako odpověď? Představ si, co bys chtěl slyšet ty, kdybys někomu popřál.",
    ],
    optionFeedback: {
      "Vůbec neodpovím a jdu dál": "Neodpovědět na přání je nezdvořilé, soused by si myslel, že ho přehlížíš.",
      "Řeknu mu, ať mě nechá na pokoji": "Soused byl milý — hrubá odpověď by ho urazila.",
      "Jen zamávám a schovám se za rohem": "Schovávat se není potřeba; stačí slušně odpovědět.",
    },
    explanation:
      "Na sousedovo přání odpovíme poděkováním a popřejeme mu totéž. Neodpovědět nebo se schovávat by bylo nezdvořilé.",
  },
  {
    question: "Kamarád udělal chybu a upřímně se ti omluvil. Co uděláš?",
    correctAnswer: "Omluvu přijmu a odpustím mu",
    options: ["Budu se na něj zlobit navždy", "Omluvu přijmu a odpustím mu", "Řeknu mu, že už s ním nikdy nebudu kamarád", "Budu mu tu chybu připomínat pořád dokola"],
    emoji: "🙏",
    hints: [
      "Když se kamarád upřímně omluví, co bys od něj čekal ty, kdyby ses omluvil sám?",
      "Kamarád udělal chybu, ale přišel sám, řekl „promiň“ a myslí to vážně. Když mu to nebudeš vyčítat, můžete si zase hrát jako dřív. Když ano, přijdete o kamaráda oba.",
    ],
    optionFeedback: {
      "Budu se na něj zlobit navždy": "Věčný hněv trápí tebe i kamaráda; upřímná omluva si zaslouží odpuštění.",
      "Řeknu mu, že už s ním nikdy nebudu kamarád": "Kvůli jedné chybě, za kterou se omluvil, nemusí přátelství skončit.",
      "Budu mu tu chybu připomínat pořád dokola": "Připomínáním chyby mu omluvu vlastně nepřijmeš.",
    },
    explanation:
      "Upřímnou omluvu přijmeme a kamarádovi odpustíme — tak přátelství pokračuje. Trvalý hněv nebo připomínání chyby by přátelství jen poškodily.",
  },
  {
    question: "Vidíš souseda, jak se s plnýma rukama snaží otevřít dveře. Co uděláš?",
    correctAnswer: "Přidržím mu dveře",
    options: ["Projdu kolem a nevšímám si ho", "Zabouchnu dveře ještě rychleji", "Přidržím mu dveře", "Počkám, až si poradí úplně sám"],
    emoji: "🚪",
    hints: [
      "Malá pomoc sousedovi, který má plné ruce, hodně usnadní situaci.",
      "Soused nese v obou rukou krabice a nemůže vzít za kliku. Jak mu můžeš jednoduše pomoct, aby prošel dovnitř a nic mu nespadlo?",
    ],
    optionFeedback: {
      "Projdu kolem a nevšímám si ho": "Soused by musel krabice položit na zem — přitom stačí malá pomoc.",
      "Zabouchnu dveře ještě rychleji": "Zabouchnutí dveří je neohleduplné, soused by se nedostal dovnitř.",
      "Počkám, až si poradí úplně sám": "Čekáním mu nepomůžeš; že pomoc potřebuje, vidíš sám.",
    },
    explanation:
      "Přidržení dveří je malá, ale hezká pomoc sousedovi, který má plné ruce. Přehlížení nebo zabouchnutí dveří by mu situaci ztížilo.",
  },
  {
    question: "Kamarádi se rozhodují, jakou hru budou hrát, a ty bys chtěl jinou. Co je vhodné udělat?",
    correctAnswer: "Přidám se ke hře, kterou chce většina, i když jsem chtěl jinou",
    options: ["Budu křičet, dokud nezmění názor", "Odejdu urazeně pryč", "Řeknu, že si s nimi už nikdy nebudu hrát", "Přidám se ke hře, kterou chce většina, i když jsem chtěl jinou"],
    emoji: "🎯",
    hints: [
      "Zamysli se, co je pro partu lepší — prosadit jen sebe, nebo se domluvit s ostatními?",
      "Ve skupině kamarádů nemůže být vždycky po tvém. Když skoro všichni chtějí jinou hru, můžeš si zahrát s nimi a svou oblíbenou hru navrhnout příště. Co je tedy nejlepší udělat teď?",
    ],
    optionFeedback: {
      "Budu křičet, dokud nezmění názor": "Křikem si nikoho nezískáš, jen hru všem pokazíš.",
      "Odejdu urazeně pryč": "Urazit se a odejít znamená přijít o společnou zábavu.",
      "Řeknu, že si s nimi už nikdy nebudu hrát": "Kvůli jedné hře nemusíš končit kamarádství.",
    },
    explanation:
      "Když kamarádi chtějí jinou hru, přidáme se k nim — ve skupině se občas přizpůsobíme ostatním. Křik, urážka nebo odchod by kamarádství jen pokazily.",
  },
  {
    question: "Kamarád má narozeniny. Co uděláš, abys mu udělal radost?",
    correctAnswer: "Popřeju mu a řeknu mu něco hezkého",
    options: [
      "Popřeju mu a řeknu mu něco hezkého",
      "Budu předstírat, že jsem na to zapomněl",
      "Řeknu mu, že narozeniny nejsou důležité",
      "Vůbec si ho nebudu všímat",
    ],
    emoji: "🎂",
    hints: [
      "Přání a milé slovo kamarádovi udělá radost i bez dárku.",
      "Nemusíš mít velký dárek. Stačí přijít, podat kamarádovi ruku a říct mu pár pěkných slov, třeba že je fajn kamarád. Co z nabídky tomu odpovídá?",
    ],
    optionFeedback: {
      "Budu předstírat, že jsem na to zapomněl": "Předstírané zapomnění kamaráda zklame.",
      "Řeknu mu, že narozeniny nejsou důležité": "Pro kamaráda jsou narozeniny důležité — takovou větou mu zkazíš radost.",
      "Vůbec si ho nebudu všímat": "Ignorování v jeho den by kamaráda mrzelo.",
    },
    explanation:
      "Kamarádovi k narozeninám popřejeme a řekneme mu něco hezkého — to mu udělá radost. Předstírané zapomenutí nebo ignorování by ho zklamalo.",
  },
  {
    question: "Na chodbě potkáš souseda, kterého neznáš jménem. Co je slušné udělat?",
    correctAnswer: "I tak ho pozdravím",
    options: ["Pozdravím jen sousedy, které znám jménem", "I tak ho pozdravím", "Budu se tvářit, že ho nevidím", "Zeptám se ho, proč tam vlastně bydlí"],
    emoji: "🏘️",
    hints: [
      "Ke slušnosti nepotřebujeme znát jméno souseda.",
      "Slova „Dobrý den“ se hodí pro každého dospělého, koho potkáš v domě — i pro někoho, koho vidíš poprvé a nevíš, jak se jmenuje.",
    ],
    optionFeedback: {
      "Pozdravím jen sousedy, které znám jménem": "Slušnost nezávisí na tom, jestli známe jméno — zdravíme všechny.",
      "Budu se tvářit, že ho nevidím": "Přehlížení je nezdvořilé, i když souseda neznáš.",
      "Zeptám se ho, proč tam vlastně bydlí": "Taková otázka je vlezlá a nezdvořilá; stačí pozdravit.",
    },
    explanation:
      "Souseda pozdravíme, i když neznáme jeho jméno — slušnost platí ke všem. Zdravit jen některé sousedy by nebylo fér.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Kamarád tě poprosí o pomoc, ale ty zrovna spěcháš domů. Co je nejlepší řešení?",
    correctAnswer: "Aspoň na chvilku mu pomůžu, i když trochu spěchám",
    options: ["Řeknu mu, že nemám vůbec čas, a odejdu", "Budu předstírat, že ho neslyším", "Aspoň na chvilku mu pomůžu, i když trochu spěchám", "Pomůžu mu, ale řeknu mu, že je otravný"],
    emoji: "⏰",
    hints: [
      "Přemýšlej, co by udělal opravdový kamarád, i když se mu to zrovna nehodí.",
      "Tvůj spěch není tak velký, aby ses nemohl na minutku zastavit. Stačí kamarádovi krátce pomoct — a pak můžeš pokračovat domů. Která možnost spojuje obojí?",
    ],
    optionFeedback: {
      "Řeknu mu, že nemám vůbec čas, a odejdu": "Na chvilku čas najdeš — odmítnutím kamaráda necháš v nesnázích.",
      "Budu předstírat, že ho neslyším": "Předstírání je nepoctivé a kamaráda by ranilo.",
      "Pomůžu mu, ale řeknu mu, že je otravný": "Pomoc s urážkou kamarádovi spíš ublíží než pomůže.",
    },
    explanation:
      "Opravdový kamarád si najde chvilku na pomoc, i když zrovna spěchá. Odmítnutí, ignorování nebo nepříjemná poznámka by kamarádovi ublížily.",
  },
  {
    question: "Který z popisů nejlépe sedí na opravdového kamaráda?",
    correctAnswer: "Pomáhá ti, i když nemusí, a raduje se z tvých úspěchů",
    options: ["Směje se ti, když se ti něco nepovede", "Bere ti věci bez dovolení a neomlouvá se", "Mluví o tobě ošklivě, když u toho nejsi", "Pomáhá ti, i když nemusí, a raduje se z tvých úspěchů"],
    emoji: "👫",
    hints: [
      "Hledej popis, ve kterém jsou dvě věci, které dělá dobrý kamarád.",
      "Projdi možnosti jednu po druhé a ptej se: Chtěl bych kamaráda, který dělá tohle? Tři popisy přátelství kazí, jen jeden ho posiluje.",
    ],
    optionFeedback: {
      "Směje se ti, když se ti něco nepovede": "Posmívání není přátelské, kamarád tě má spíš povzbudit.",
      "Bere ti věci bez dovolení a neomlouvá se": "Kdo bere cizí věci bez dovolení, nechová se jako kamarád.",
      "Mluví o tobě ošklivě, když u toho nejsi": "Pomlouvání za zády je znak falešného kamaráda.",
    },
    explanation:
      "Opravdový kamarád ti pomáhá bez nároku na odměnu a přeje ti úspěch. Posmívání, braní věcí a pomlouvání jsou naopak znaky špatného kamaráda.",
  },
  {
    question: "Které chování NEODPOVÍDÁ dobrému sousedskému soužití?",
    correctAnswer: "Pouštět pozdě večer hlasitou hudbu, i když to sousedy ruší",
    options: [
      "Pouštět pozdě večer hlasitou hudbu, i když to sousedy ruší",
      "Pozdravit souseda, když ho potkáš",
      "Pomoct sousedovi donést nákup",
      "Nezlobit se, když soused požádá o klid",
    ],
    emoji: "🔊",
    hints: [
      "Hledej chování, které sousedům způsobuje potíže, ne chování, které jim pomáhá.",
      "U každé možnosti si představ, že to dělá tvůj soused. Tři věci by tě potěšily, jedna by tě v noci budila a nemohl bys spát. Kterou z nich hledáš?",
    ],
    optionFeedback: {
      "Pozdravit souseda, když ho potkáš": "Pozdrav k dobrému soužití patří — hledáš chování, které sousedům vadí.",
      "Pomoct sousedovi donést nákup": "Pomoc s nákupem je hezký sousedský čin, ne chyba.",
      "Nezlobit se, když soused požádá o klid": "Vyhovět prosbě o klid je ohleduplné, to k soužití patří.",
    },
    explanation:
      "Hlasitá hudba pozdě večer sousedy ruší a bere jim klid — to není ohleduplné chování. Pozdrav, pomoc a ochota ke klidu naopak k dobrému soužití patří.",
  },
  {
    question: "Omylem jsi rozbil kamarádovu půjčenou hračku. Co je správné udělat?",
    correctAnswer: "Omluvit se a upřímně mu říct, co se stalo",
    options: ["Schovat rozbitou hračku a tvářit se, že o ničem nevím", "Omluvit se a upřímně mu říct, co se stalo", "Svést to na někoho jiného", "Hračku hodit pryč, aby si ničeho nevšiml"],
    emoji: "💔",
    hints: [
      "Spoj dvě věci: přiznání toho, co se stalo, a omluvu.",
      "Kamarád si stejně všimne, že je hračka rozbitá. Je lepší, když to uslyší od tebe i s omluvou, nebo když na to přijde sám a zjistí, že jsi to tajil?",
    ],
    optionFeedback: {
      "Schovat rozbitou hračku a tvářit se, že o ničem nevím": "Kamarád na to stejně přijde a pak ti přestane věřit.",
      "Svést to na někoho jiného": "Svést vinu na jiného je lež, která ublíží dvěma lidem.",
      "Hračku hodit pryč, aby si ničeho nevšiml": "Vyhozením se nic nevyřeší, kamarád o hračku přijde úplně.",
    },
    explanation:
      "Když se něco stane omylem, je správné přiznat to a omluvit se. Skrývání, lhaní nebo svádění viny na jiného přátelství jen poškodí.",
  },
  {
    question: "Dva kamarádi se pohádali kvůli jedné hračce. Jak se to dá vyřešit nejlépe?",
    correctAnswer: "Domluví se, že se v hračce budou střídat",
    options: ["Jeden z nich hračku schová, aby ji neměl nikdo", "Přestanou spolu kamarádit úplně", "Domluví se, že se v hračce budou střídat", "Hračku rozbijí, aby ji neměl žádný z nich"],
    emoji: "🧸",
    hints: [
      "Řešení musí být spravedlivé pro oba kamarády zároveň.",
      "Hračka je jen jedna a kamarádi dva. Jak zařídit, aby si s ní hrál každý z nich, jen ne oba najednou? Zkus myslet na pořadí a na hodiny.",
    ],
    optionFeedback: {
      "Jeden z nich hračku schová, aby ji neměl nikdo": "Schováním si nezahraje nikdo a hádka pokračuje.",
      "Přestanou spolu kamarádit úplně": "Kvůli jedné hračce nemusí končit přátelství.",
      "Hračku rozbijí, aby ji neměl žádný z nich": "Zničením hračky přijdou oba o zábavu — to není řešení.",
    },
    explanation:
      "Střídání je spravedlivé řešení, ze kterého mají radost oba kamarádi. Schovávání hračky, konec kamarádství nebo její zničení problém nevyřeší.",
  },
  {
    question: "Soused si stěžuje, že jste s kamarády v parku moc hlasitě křičeli. Co uděláš?",
    correctAnswer: "Omluvím se a budeme si hrát tišeji",
    options: ["Budu křičet ještě víc, park je přece pro všechny", "Řeknu sousedovi, ať si toho nevšímá", "Přestaneme si hrát úplně a odejdeme naštvaní", "Omluvím se a budeme si hrát tišeji"],
    emoji: "🔉",
    hints: [
      "Hledej řešení, které bude v pořádku pro tebe i pro souseda zároveň.",
      "Soused má pravdu, že ho křik ruší. Hrát si ale můžete dál — jen jinak. Co můžeš sousedovi říct a jak změnit hru, aby byli spokojení všichni?",
    ],
    optionFeedback: {
      "Budu křičet ještě víc, park je přece pro všechny": "Park je pro všechny — i pro souseda, který chce klid.",
      "Řeknu sousedovi, ať si toho nevšímá": "Takovou odpovědí souseda odbydeš a problém zůstane.",
      "Přestaneme si hrát úplně a odejdeme naštvaní": "Hrát si můžete dál, stačí ztišit hlas — naštvaný odchod není nutný.",
    },
    explanation:
      "Omluva a tišší hra respektují souseda, a přesto si můžete dál hrát. Ještě hlasitější křik, odbytí souseda nebo naštvaný odchod problém neřeší.",
  },
  {
    question: "Kamarád je smutný, protože se mu nedaří ve škole. Co mu pomůže nejvíc?",
    correctAnswer: "Vyslechnu ho a nabídnu mu, že mu s učením pomůžu",
    options: [
      "Vyslechnu ho a nabídnu mu, že mu s učením pomůžu",
      "Řeknu mu, ať se víc snaží, a odejdu",
      "Budu se mu smát, že je pomalý",
      "Řeknu ostatním, že je hloupý",
    ],
    emoji: "📚",
    hints: [
      "Spoj dvě věci, které smutný kamarád potřebuje — vyslechnutí i konkrétní pomoc.",
      "Kamarád potřebuje, abys ho nejdřív nechal vypovídat, a pak nějakou opravdovou pomoc — třeba spolu projdete úkol z matematiky. Která možnost obsahuje obojí?",
    ],
    optionFeedback: {
      "Řeknu mu, ať se víc snaží, a odejdu": "Rada bez pomoci kamarádovi nepomůže, jen ho nechá samotného.",
      "Budu se mu smát, že je pomalý": "Posměch kamarádovi ublíží a sebere mu chuť se učit.",
      "Řeknu ostatním, že je hloupý": "Pomlouvání je zlé a nepravdivé — každému jde něco hůř.",
    },
    explanation:
      "Smutnému kamarádovi pomůže, když ho vyslechneš a nabídneš konkrétní pomoc. Posměch nebo pomlouvání mu naopak ublíží.",
  },
  {
    question: "Který kamarád ti pomáhá opravdu přátelsky?",
    correctAnswer: "Ten, kdo pomůže, i když za to nic nedostane",
    options: [
      "Ten, kdo pomůže jen za odměnu",
      "Ten, kdo pomůže, i když za to nic nedostane",
      "Ten, kdo pomůže, jen když se na to někdo dívá",
      "Ten, kdo pomůže, ale pak se tím všude chlubí",
    ],
    emoji: "❤️",
    hints: [
      "Přemýšlej, proč nám opravdový kamarád pomáhá.",
      "Opravdovému kamarádovi na tobě záleží. Pomáhá proto, že tě má rád — ne proto, že čeká sladkost, pochvalu od ostatních nebo příležitost se pochlubit.",
    ],
    optionFeedback: {
      "Ten, kdo pomůže jen za odměnu": "Pomoc jen za odměnu je spíš obchod než přátelství.",
      "Ten, kdo pomůže, jen když se na to někdo dívá": "Kdo pomáhá jen pro pochvalu druhých, nemyslí na tebe, ale na sebe.",
      "Ten, kdo pomůže, ale pak se tím všude chlubí": "Chlubit se pomocí není přátelské — kamarád pomáhá rád a potichu.",
    },
    explanation:
      "Opravdový kamarád pomáhá i bez očekávání odměny, protože mu na tobě záleží. Pomoc za odměnu, pro pochvalu nebo pro chlubení není přátelství.",
  },
  {
    question: "Soused hrabe listí a nestíhá. O pomoc tě nepožádal. Co můžeš udělat?",
    correctAnswer: "Sám mu nabídnout, že pomůžu",
    options: [
      "Nic, o pomoc přece nepožádal",
      "Počkat, až mě o pomoc poprosí",
      "Sám mu nabídnout, že pomůžu",
      "Poradit mu, ať si najme někoho jiného",
    ],
    emoji: "🍂",
    hints: [
      "Musí nás soused vždycky nejdřív poprosit, abychom mu pomohli?",
      "Někteří lidé se stydí o pomoc požádat, i když by ji potřebovali. Když vidíš, že soused nestíhá, můžeš udělat první krok ty — a jen se ho slušně zeptat.",
    ],
    optionFeedback: {
      "Nic, o pomoc přece nepožádal": "Pomoc můžeme nabídnout i bez požádání — soused se možná jen stydí.",
      "Počkat, až mě o pomoc poprosí": "Soused tě poprosit nemusí, a mezitím se sám nadře.",
      "Poradit mu, ať si najme někoho jiného": "Taková rada mu nepomůže, když můžeš pomoct sám.",
    },
    explanation:
      "Když si všimneme, že soused pomoc potřebuje, můžeme mu ji nabídnout sami, i když o ni nepožádal. Čekání nebo odbytí mu nepomůže.",
  },
  {
    question: "Spolužák se s tebou kamarádí, ale za zády o tobě říká ošklivé věci. Jaký je to kamarád?",
    correctAnswer: "Falešný kamarád",
    options: ["Opravdový kamarád", "Nejlepší kamarád", "Falešný kamarád", "Hodný kamarád, jen žertuje"],
    emoji: "🗣️",
    hints: [
      "Porovnej, jak se chová, když jsi u toho, a jak, když u toho nejsi.",
      "Opravdový kamarád se k tobě chová stejně, ať jsi u toho, nebo ne — a když o tobě někdo mluví ošklivě, zastane se tě. Chová se tak tenhle spolužák?",
    ],
    optionFeedback: {
      "Opravdový kamarád": "Opravdový kamarád tě za zády nepomlouvá, ale zastane se tě.",
      "Nejlepší kamarád": "Nejlepší kamarád by o tobě ošklivě nemluvil — ani před tebou, ani za zády.",
      "Hodný kamarád, jen žertuje": "Ošklivé řeči za zády nejsou žert, ale pomluva.",
    },
    explanation:
      "Kdo je k tobě milý do očí, ale za zády tě pomlouvá, je falešný kamarád. Opravdový kamarád tě podrží, i když u toho nejsi.",
  },
  {
    question: "Pepa a Jirka jsou kamarádi a včera se pohádali. Co je nejlepší?",
    correctAnswer: "Promluví si, omluví se a zase se usmíří",
    options: [
      "Už spolu nikdy nepromluví",
      "Budou se navzájem pomlouvat",
      "Promluví si, omluví se a zase se usmíří",
      "Budou dělat, že se nic nestalo, a zlobit se potichu",
    ],
    emoji: "🤝",
    hints: [
      "Musí hádka vždycky znamenat konec kamarádství?",
      "I nejlepší kamarádi se občas neshodnou. Důležité je, co udělají potom: řeknou si, co je mrzelo, a podají si ruku. Která možnost to popisuje?",
    ],
    optionFeedback: {
      "Už spolu nikdy nepromluví": "Kvůli jedné hádce nemusí přátelství skončit.",
      "Budou se navzájem pomlouvat": "Pomlouvání hádku ještě zhorší.",
      "Budou dělat, že se nic nestalo, a zlobit se potichu": "Tichý hněv nezmizí sám — je lepší si to vyříkat a usmířit se.",
    },
    explanation:
      "I kamarádi se občas pohádají. Důležité je promluvit si, omluvit se a usmířit se — pak kamarádství pokračuje dál.",
  },
  {
    question:
      "Sousedka nese těžké tašky a kamarád tě zve na hru, která může počkat. Co uděláš nejdřív?",
    correctAnswer: "Nejdřív pomůžu sousedce s taškami, hra počká",
    options: ["Nejdřív půjdu hrát, sousedka si poradí sama", "Nejdřív pomůžu sousedce s taškami, hra počká", "Neudělám nic a jen odejdu", "Řeknu sousedce, ať počká, dokud si nedohraju"],
    emoji: "🛍️",
    hints: [
      "Porovnej, co je naléhavější — těžké tašky právě teď, nebo hra, která může počkat.",
      "Tašky jsou těžké právě teď a sousedka je nese sama. Na hru se dostane za pár minut. Co je tedy rozumné udělat jako první a co až potom?",
    ],
    optionFeedback: {
      "Nejdřív půjdu hrát, sousedka si poradí sama": "Hra může počkat, sousedka s těžkými taškami ne.",
      "Neudělám nic a jen odejdu": "Tím nepomůžeš nikomu — ani sousedce, ani sobě.",
      "Řeknu sousedce, ať počká, dokud si nedohraju": "Nechat sousedku čekat s těžkými taškami kvůli hře je bezohledné.",
    },
    explanation:
      "Těžké tašky jsou naléhavější a pomoc zabere jen chvilku, hra může počkat. Rozumné je pomoct nejdřív tam, kde je pomoc opravdu potřeba.",
  },
  {
    question:
      "Nový spolužák se nedávno přistěhoval a nezná pravidla vaší oblíbené hry. Co uděláš?",
    correctAnswer: "Vysvětlím mu pravidla, aby si mohl hrát s námi",
    options: ["Řeknu mu, že pravidla jsou tajná", "Budu se mu smát, že je nezná", "Vysvětlím mu pravidla, aby si mohl hrát s námi", "Nechám ho hrát podle svého a nic mu nevysvětlím"],
    emoji: "🆕",
    hints: [
      "Pomysli na to, jak by ses cítil ty, kdyby ses přistěhoval a nikdo ti nic neukázal.",
      "Nový kamarád chce hrát, ale neví jak. Když mu hru krok za krokem ukážeš, může se hned přidat. Když ne, bude jen stát stranou a dívat se.",
    ],
    optionFeedback: {
      "Řeknu mu, že pravidla jsou tajná": "Tajnůstkaření ho ze hry vyřadí a bude se cítit odstrčený.",
      "Budu se mu smát, že je nezná": "Nemůže je znát, je tu nový — posměch ho raní.",
      "Nechám ho hrát podle svého a nic mu nevysvětlím": "Bez pravidel se bude plést a ostatní se na něj budou zlobit.",
    },
    explanation:
      "Vysvětlení pravidel novému kamarádovi mu pomůže zapojit se a cítit se dobře. Tajnůstkářství nebo posměch by ho naopak odradily.",
  },
  {
    question: "Máš dva kamarády, kteří se spolu nekamarádí. Když jste spolu všichni tři, co je nejlepší?",
    correctAnswer: "Snažím se, aby si spolu rozuměli, a nikoho proti druhému nepoštvávám",
    options: ["Poštvu je proti sobě, aby to bylo zajímavější", "Řeknu jednomu, že ten druhý je špatný kamarád", "Budu si hrát jen s jedním a druhého budu ignorovat", "Snažím se, aby si spolu rozuměli, a nikoho proti druhému nepoštvávám"],
    emoji: "⚖️",
    hints: [
      "Přemýšlej, jak se zachovat spravedlivě k oběma kamarádům najednou.",
      "Oba jsou tvoji kamarádi. Když jednoho z nich budeš pomlouvat nebo vynechávat, ublížíš mu. Když se k oběma chováš stejně, můžete si hrát všichni tři.",
    ],
    optionFeedback: {
      "Poštvu je proti sobě, aby to bylo zajímavější": "Poštvávání ublíží oběma kamarádům a může skončit hádkou.",
      "Řeknu jednomu, že ten druhý je špatný kamarád": "To je pomluva — druhého kamaráda by ranila.",
      "Budu si hrát jen s jedním a druhého budu ignorovat": "Ignorovaný kamarád by byl smutný a cítil by se vyloučený.",
    },
    explanation:
      "Nejlepší je chovat se k oběma kamarádům spravedlivě a nepodporovat mezi nimi spor. Poštvávání nebo vylučování jednoho z nich by situaci jen zhoršilo.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1.map(toTask);
  return shuffle(pool);
}

export const LIDEVOKOLIKAMARADSTVI: TopicMetadata[] = [
  {
    id: "g2-prv-sousedstvi",
    rvpNodeId: "g2-prvouka-lide-kolem-nas-souziti-lidi-lide-v-okoli-sousedstvi-kamaradstvi",
    title: "Lidé v okolí, sousedství, kamarádství",
    studentTitle: "Kamarádi a sousedé",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití lidí",
    briefDescription: "Jak se chováme ke kamarádům a sousedům.",
    keywords: ["kamarád", "soused", "kamarádství", "pomoc", "soužití"],
    goals: [
      "Vědět, jak se chovat ke kamarádům.",
      "Umět pomoci sousedovi.",
      "Rozlišit dobré a špatné chování.",
    ],
    boundaries: ["Pouze základy soužití.", "Bez složitých vztahů."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Ke kamarádům a sousedům jsme hodní a pomáháme jim.",
      steps: ["Přečti větu.", "Je to hezké chování, nebo ošklivé?"],
      commonMistake: "Ubližování a ničení není dobré chování.",
      example: "Kamarádovi pomůžeme, když potřebuje — to je pravda.",
    },
  },
];
