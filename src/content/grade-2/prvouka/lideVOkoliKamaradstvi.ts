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
//   L1 = rozpoznání izolovaného faktu/pravidla: co je soused, co je
//        kamarádství, základní pravidla chování — formát Ano/Ne
//        (2 možnosti).
//   L2 = aplikace: rozpoznání správného/nesprávného chování v konkrétní
//        situaci — výběr ze 4 možností.
//   L3 = transfer (kombinace dvou faktů, rozlišení blízkých situací
//        „dobrý vs. špatný kamarád“, jednoduché „co bys udělal, kdyby...“
//        scénáře) — většinou 4 možnosti, jen menšina Ano/Ne.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Soused je člověk, který bydlí blízko nás. Je to pravda?",
    correct: true,
    emoji: "🏘️",
    hint: "Sousedé bydlí v okolí našeho domu nebo bytu.",
    solution: "Soused je člověk, který bydlí blízko nás — třeba ve stejném domě nebo ulici.",
  },
  {
    question: "Kamarád je někdo, s kým si rádi hrajeme a trávíme čas. Je to pravda?",
    correct: true,
    emoji: "👫",
    hint: "Přemýšlej, jak trávíš čas s kamarádem.",
    solution: "Kamarád je ten, s kým si rádi hrajeme a je nám s ním dobře.",
  },
  {
    question: "Kamarádovi pomáháme, když to potřebuje. Je to pravda?",
    correct: true,
    emoji: "🤝",
    hint: "Pomoc je základ přátelství.",
    solution: "Kamarádovi pomáháme — tak vypadá opravdové přátelství.",
  },
  {
    question: "Souseda zdravíme, když ho potkáme. Je to pravda?",
    correct: true,
    emoji: "👋",
    hint: "Pozdrav je základní slušnost.",
    solution: "Souseda zdravíme — je to slušné a přátelské chování.",
  },
  {
    question: "Kamarádovi lžeme, i když se nás na něco zeptá. Je to pravda?",
    correct: false,
    emoji: "🙅",
    hint: "Lhaní přátelství poškozuje.",
    solution: "Kamarádovi nelžeme — přátelství stojí na důvěře.",
  },
  {
    question: "Sousedovi schválně ubližujeme. Je to pravda?",
    correct: false,
    emoji: "🏘️",
    hint: "Přemýšlej, jak by ses cítil ty, kdyby ti někdo ubližoval.",
    solution: "Sousedovi neubližujeme — k sousedům se chováme hezky.",
  },
  {
    question: "S kamarádem se o hračky a svačinu dělíme. Je to pravda?",
    correct: true,
    emoji: "🍎",
    hint: "Dělení se je projev přátelství.",
    solution: "S kamarádem se dělíme — tak vypadá pravé přátelství.",
  },
  {
    question: "Kamaráda pozorně posloucháme, když nám něco vypráví. Je to pravda?",
    correct: true,
    emoji: "👂",
    hint: "Naslouchání ukazuje, že nám na kamarádovi záleží.",
    solution: "Kamaráda posloucháme — dáváme mu najevo, že nás zajímá, co říká.",
  },
  {
    question: "Kamaráda strkáme a rveme mu věci z ruky. Je to pravda?",
    correct: false,
    emoji: "🙅",
    hint: "Fyzické ubližování kamarádství ničí.",
    solution: "Kamaráda nestrkáme ani mu nebereme věci silou — to není přátelské chování.",
  },
  {
    question: "Souseda schválně zlobíme a děláme mu naschvály. Je to pravda?",
    correct: false,
    emoji: "😠",
    hint: "Naschvály sousedovi škodí a nejsou zdvořilé.",
    solution: "Souseda schválně nezlobíme — sousedé si mají spíš pomáhat.",
  },
  {
    question: "Kamarádovi přejeme, aby se mu dařilo. Je to pravda?",
    correct: true,
    emoji: "❤️",
    hint: "Přát někomu dobro je znak přátelství.",
    solution: "Kamarádovi přejeme dobro — chceme, aby byl šťastný.",
  },
  {
    question: "Kamaráda máme rádi takového, jaký je. Je to pravda?",
    correct: true,
    emoji: "👫",
    hint: "Každý je trochu jiný a to je v pořádku.",
    solution: "Kamaráda přijímáme takového, jaký je — to je součástí přátelství.",
  },
  {
    question: "Kamarádovi bereme věci bez dovolení. Je to pravda?",
    correct: false,
    emoji: "🧸",
    hint: "Brát věci bez dovolení kamaráda mrzí.",
    solution: "Kamarádovi věci bez dovolení nebereme — nejdřív se zeptáme.",
  },
  {
    question: "S kamarády si rádi hrajeme společné hry. Je to pravda?",
    correct: true,
    emoji: "🎲",
    hint: "Společná hra kamarádství posiluje.",
    solution: "S kamarády si hrajeme rádi — to je jedna z hezkých věcí na přátelství.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Kamarádovi spadl a bolí ho koleno. Co uděláš?",
    correctAnswer: "Pomůžu mu vstát a řeknu to dospělému",
    options: [
      "Pomůžu mu vstát a řeknu to dospělému",
      "Budu se mu smát",
      "Odejdu si hrát jinam, jako by se nic nestalo",
      "Řeknu mu, že je nešikovný",
    ],
    emoji: "🤕",
    hints: [
      "Přemýšlej, co potřebuje kamarád, kterému je zle nebo ho něco bolí.",
      "Opravdový kamarád v takové chvíli pomůže a přivede pomoc dospělého.",
    ],
    explanation:
      "Když se kamarádovi něco stane, pomůžeme mu a přivedeme dospělého. Smích, útěk nebo posměch kamarádovi jen ublíží.",
  },
  {
    question: "Potkáš souseda na chodbě domu. Co je slušné udělat?",
    correctAnswer: "Pozdravím ho",
    options: ["Předstírám, že ho nevidím", "Pozdravím ho", "Rychle utíkám pryč", "Mluvím jen s kamarády, sousedy nezdravím"],
    emoji: "👋",
    hints: [
      "Pozdrav patří ke slušnému chování ke všem, které potkáme, i k sousedům.",
      "Nezáleží na tom, jestli je to kamarád, nebo soused — zdravíme oba.",
    ],
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
      "Vrácení v pořádku je znak toho, že si půjčené věci vážíme.",
    ],
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
      "Pozvání ke společné hře je nejjednodušší způsob, jak někoho přijmout mezi kamarády.",
    ],
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
      "Nabídnutí pomoci je hezký sousedský čin.",
    ],
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
      "Vyzrazení tajemství by kamaráda mrzelo a poškodilo by důvěru mezi vámi.",
    ],
    explanation:
      "Když kamarádovi slíbíme, že tajemství nikomu neřekneme, měli bychom slib dodržet. Prozrazení, byť jen jednomu dalšímu kamarádovi, důvěru poruší.",
  },
  {
    question: "Ve třídě je jen jedna nová hra a všichni ji chtějí hrát najednou. Co uděláš?",
    correctAnswer: "Domluvíme se, kdo bude hrát první, a pak se vystřídáme",
    options: ["Vezmu si hru sám a nikomu ji nepůjčím", "Budu křičet, ať mi hru dají první", "Domluvíme se, kdo bude hrát první, a pak se vystřídáme", "Hru schovám, aby ji neměl nikdo"],
    emoji: "🎲",
    hints: [
      "Když věc chce víc lidí najednou, pomůže domluva a střídání.",
      "Spravedlivé řešení je takové, ze kterého mají radost všichni kamarádi.",
    ],
    explanation:
      "Domluva a střídání jsou spravedlivé řešení, když hru chce hrát víc dětí najednou. Sobecké přivlastnění, křik nebo schování hry problém jen zhorší.",
  },
  {
    question: "Vidíš dva kamarády, jak si hrají, a jeden z nich pláče, protože prohrál. Co je vhodné udělat?",
    correctAnswer: "Utěším ho a řeknu mu, že příště to může dopadnout líp",
    options: ["Budu se mu smát, že prohrál", "Řeknu mu, že je špatný hráč", "Odejdu, ať si to vyřeší sám", "Utěším ho a řeknu mu, že příště to může dopadnout líp"],
    emoji: "😢",
    hints: [
      "Smutnému kamarádovi pomůže laskavé slovo, ne posměch.",
      "Utěšení a povzbuzení kamarádovi pomůže se z prohry rychleji dostat.",
    ],
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
      "Poděkování a stejné přání zpátky je slušná odpověď.",
    ],
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
      "Přijetí omluvy pomáhá přátelství pokračovat dál.",
    ],
    explanation:
      "Upřímnou omluvu přijmeme a kamarádovi odpustíme — tak přátelství pokračuje. Trvalý hněv nebo připomínání chyby by přátelství jen poškodily.",
  },
  {
    question: "Vidíš souseda, jak se s plnýma rukama snaží otevřít dveře. Co uděláš?",
    correctAnswer: "Přidržím mu dveře",
    options: ["Projdu kolem a nevšímám si ho", "Zabouchnu dveře ještě rychleji", "Přidržím mu dveře", "Počkám, až si poradí úplně sám"],
    emoji: "🚪",
    hints: [
      "Malá pomoc, jako přidržení dveří, sousedovi hodně usnadní situaci.",
      "Nemusíme čekat na požádání — pomoc si všimneme a nabídneme sami.",
    ],
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
      "Přidání se ke společné hře je lepší než urážka nebo odchod.",
    ],
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
      "Přání a hezké slovo kamarádovi udělá radost bez ohledu na dárek.",
      "Ignorování narozenin by kamaráda naopak mrzelo.",
    ],
    explanation:
      "Kamarádovi k narozeninám popřejeme a řekneme mu něco hezkého — to mu udělá radost. Předstírané zapomenutí nebo ignorování by ho zklamalo.",
  },
  {
    question: "Na chodbě potkáš souseda, kterého neznáš jménem. Co je slušné udělat?",
    correctAnswer: "I tak ho pozdravím",
    options: ["Pozdravím jen sousedy, které znám jménem", "I tak ho pozdravím", "Budu se tvářit, že ho nevidím", "Zeptám se ho, proč tam vlastně bydlí"],
    emoji: "🏘️",
    hints: [
      "Ke zdravení nepotřebujeme znát jméno souseda.",
      "Slušnost platí ke všem sousedům, ne jen k těm, které dobře známe.",
    ],
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
      "Pomoc nemusí trvat dlouho — stačí chvilka, aby kamarádovi nebylo líto.",
    ],
    explanation:
      "Opravdový kamarád si najde chvilku na pomoc, i když zrovna spěchá. Odmítnutí, ignorování nebo nepříjemná poznámka by kamarádovi ublížily.",
  },
  {
    question: "Který z popisů nejlépe sedí na opravdového kamaráda?",
    correctAnswer: "Pomáhá ti, i když nemusí, a raduje se z tvých úspěchů",
    options: ["Směje se ti, když se ti něco nepovede", "Bere ti věci bez dovolení a neomlouvá se", "Mluví o tobě ošklivě, když u toho nejsi", "Pomáhá ti, i když nemusí, a raduje se z tvých úspěchů"],
    emoji: "👫",
    hints: [
      "Spoj dohromady dvě věci, které dělá dobrý kamarád — pomoc i radost z tvého úspěchu.",
      "Ostatní možnosti popisují chování, které přátelství spíš kazí.",
    ],
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
      "Tři možnosti jsou příklady dobrého soužití, jedna mu odporuje.",
    ],
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
      "Skrývání pravdy by kamaráda mrzelo víc než samotná rozbitá hračka.",
    ],
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
      "Střídání dá hračku postupně oběma, aniž by o ni někdo úplně přišel.",
    ],
    explanation:
      "Střídání je spravedlivé řešení, ze kterého mají radost oba kamarádi. Schovávání hračky, konec kamarádství nebo její zničení problém nevyřeší.",
  },
  {
    question: "Soused si stěžuje, že jste s kamarády v parku moc hlasitě křičeli. Co uděláš?",
    correctAnswer: "Omluvím se a budeme si hrát tišeji",
    options: ["Budu křičet ještě víc, park je přece pro všechny", "Řeknu sousedovi, ať si nevšímá", "Přestaneme si hrát úplně a odejdeme naštvaní", "Omluvím se a budeme si hrát tišeji"],
    emoji: "🔉",
    hints: [
      "Hledej řešení, které bude v pořádku pro tebe i pro souseda zároveň.",
      "Omluva a tišší hra ti dovolí hrát si dál a souseda přitom neruší.",
    ],
    explanation:
      "Omluva a tišší hra respektují souseda, a přesto si můžete dál hrát. Ještě hlasitější křik, ignorování nebo naštvané odejití problém neřeší.",
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
      "Posměch nebo pomluva situaci jen zhorší.",
    ],
    explanation:
      "Smutnému kamarádovi pomůže, když ho vyslechneš a nabídneš konkrétní pomoc. Posměch nebo pomlouvání mu naopak ublíží.",
  },
  {
    question: "Opravdový kamarád ti pomáhá, jen když z toho sám něco má. Je to pravda?",
    correctAnswer: NE,
    options: [ANO, NE],
    emoji: "❤️",
    hints: [
      "Přemýšlej, jestli přátelství funguje jako výpočet výhod, nebo jako to, že si lidé chtějí navzájem pomáhat.",
    ],
    explanation:
      "Ne, to není pravda — opravdový kamarád pomáhá i bez očekávání odměny, protože mu na tobě záleží.",
  },
  {
    question: "Sousedům můžeme nabídnout pomoc i tehdy, když nás o ni sami nepožádají. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🏘️",
    hints: [
      "Pomoc nemusí vždy přijít jen na požádání — někdy si jí všimneme sami.",
    ],
    explanation:
      "Ano, to je pravda — všimneme-li si, že soused pomoc potřebuje, můžeme mu ji nabídnout sami, i když o ni nepožádal.",
  },
  {
    question: "Kamarád, který o tobě mluví ošklivě, když u toho nejsi, je opravdový kamarád. Je to pravda?",
    correctAnswer: NE,
    options: [ANO, NE],
    emoji: "🗣️",
    hints: [
      "Opravdový kamarád se za tebe zastane, i když u toho nejsi.",
    ],
    explanation:
      "Ne, to není pravda — pomlouvání za zády není přátelské chování, opravdový kamarád tě naopak podrží.",
  },
  {
    question: "I opravdoví kamarádi se občas pohádají, ale kamarádství tím nekončí. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🤝",
    hints: [
      "Přemýšlej, jestli hádka vždy musí znamenat konec přátelství.",
    ],
    explanation:
      "Ano, to je pravda — i kamarádi se občas neshodnou, důležité je, že se pak zase usmíří.",
  },
  {
    question:
      "Vidíš sousedku, jak nese těžké tašky, a zároveň tě kamarád zve na hru, která může počkat. Co uděláš nejdřív?",
    correctAnswer: "Nejdřív pomůžu sousedce s taškami, hra počká",
    options: ["Nejdřív půjdu hrát, sousedka si poradí sama", "Nejdřív pomůžu sousedce s taškami, hra počká", "Neudělám nic a jen odejdu", "Řeknu sousedce, ať počká, dokud si nedohraju"],
    emoji: "🛍️",
    hints: [
      "Porovnej, co je naléhavější — těžké tašky právě teď, nebo hra, která může počkat.",
      "Pomoc s taškami zabere jen chvilku, hru si zahrajete i potom.",
    ],
    explanation:
      "Těžké tašky jsou naléhavější a pomoc zabere jen chvilku, hra může počkat. Rozumné je pomoct nejdřív tam, kde je pomoc opravdu potřeba.",
  },
  {
    question:
      "Do třídy přišel kamarád, který se nedávno přistěhoval a nezná pravidla vaší oblíbené hry. Co uděláš?",
    correctAnswer: "Vysvětlím mu pravidla, aby si mohl hrát s námi",
    options: ["Řeknu mu, že pravidla jsou tajná", "Budu se mu smát, že je nezná", "Vysvětlím mu pravidla, aby si mohl hrát s námi", "Nechám ho hrát podle svého a nic mu nevysvětlím"],
    emoji: "🆕",
    hints: [
      "Pomysli na to, jak by ses cítil ty, kdyby ses přistěhoval a nikdo ti nic nevysvětlil.",
      "Vysvětlení pravidel je způsob, jak nového kamaráda přijmout mezi sebe.",
    ],
    explanation:
      "Vysvětlení pravidel novému kamarádovi mu pomůže zapojit se a cítit se dobře. Tajnůstkářství nebo posměch by ho naopak odradily.",
  },
  {
    question: "Máš dva kamarády, kteří se spolu nekamarádí. Když jste spolu všichni tři, co je nejlepší?",
    correctAnswer: "Snažím se, aby si spolu rozuměli, a nikoho proti druhému nepodněcuji",
    options: ["Poštvu je proti sobě, aby to bylo zajímavější", "Řeknu jednomu, že ten druhý je špatný kamarád", "Budu si hrát jen s jedním a druhého budu ignorovat", "Snažím se, aby si spolu rozuměli, a nikoho proti druhému nepodněcuji"],
    emoji: "⚖️",
    hints: [
      "Přemýšlej, jak se zachovat spravedlivě k oběma kamarádům najednou.",
      "Podněcování sporu nebo vylučování jednoho z kamarádů situaci jen zhorší.",
    ],
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
