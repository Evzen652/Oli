import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Před psaním vlastního textu je nejdůležitější:",
    correctAnswer: "vybrat téma a promyslet příběh",
    options: [
      "vymyslet nadpis a podnadpis",
      "vybrat téma a promyslet příběh",
      "spočítat, kolik to má slov",
      "narýsovat okraje stránky",
    ],
    hints: ["Co musíš vědět dřív, než napíšeš první větu — jak se text bude jmenovat, nebo o čem vlastně bude?"],
    explanation: "Nejdřív musíš vědět, o čem píšeš a co se v textu stane. Nadpis i úprava se dají doladit až nakonec, ale bez tématu není co psát.",
  },
  {
    question: "Co je téma vlastního literárního textu?",
    correctAnswer: "hlavní myšlenka textu",
    options: [
      "název textu na první straně",
      "hlavní myšlenka textu",
      "délka textu ve stranách",
      "počet postav v textu",
    ],
    hints: ["Kdyby se tě někdo zeptal, o čem tvůj text je, co bys odpověděl?"],
    explanation: "Téma je to, o čem text v jádru vypovídá — přátelství, odvaha, ztráta. Název ani rozsah o obsahu nic neprozradí.",
  },
  {
    question: "Jak správně začneme psát povídku?",
    correctAnswer: "úvodem, který představí situaci",
    options: [
      "podrobným popisem počasí",
      "úvodem, který představí situaci",
      "rovnou závěrem příběhu",
      "podpisem autora textu",
    ],
    hints: ["Čtenář na začátku nic neví. Co mu musíš dát, aby se v příběhu zorientoval a zůstal u něj?"],
    explanation: "Dobrý úvod čtenáře uvede do situace — kdo, kde a co se chystá. Když začneš závěrem nebo dlouhým popisem počasí, čtenář ztratí zájem.",
  },
  {
    question: "Co musí povídka nebo pohádka obsahovat?",
    correctAnswer: "postavy, prostředí a děj",
    options: [
      "jen podrobný popis postav",
      "postavy, prostředí a děj",
      "jen rozhovory postav",
      "jen závěrečné poučení",
    ],
    hints: ["Zkus si představit text, ve kterém se nikdo nepohne. Bude to ještě příběh?"],
    explanation: "Příběh potřebuje někoho, kdo jedná, místo, kde jedná, a události, které se stanou. Samotný popis nebo samotné dialogy příběh netvoří.",
  },
  {
    question: "Co je charakteristické pro pohádku?",
    correctAnswer: "kouzelné a nadpřirozené prvky",
    options: [
      "doložené historické události",
      "kouzelné a nadpřirozené prvky",
      "výsledky vědeckých pokusů",
      "rozhovory bez jakéhokoli děje",
    ],
    hints: ["Co mají společného mluvící zvíře, čarodějnice a kouzelný prsten? A může se to stát doopravdy?"],
    explanation: "Pohádku poznáš podle toho, že se v ní děje něco, co v běžném světě není možné. Historická ani vědecká látka tenhle znak nemá.",
  },
  {
    question: "Jak správně ukončíme vlastní literární text?",
    correctAnswer: "rozuzlením a pointou",
    options: [
      "pouhým slovem konec",
      "rozuzlením a pointou",
      "ponecháním děje nedokončeného",
      "shrnutím všech postav",
    ],
    hints: ["Čtenář dočte poslední větu. Co se musel dozvědět, aby neměl pocit, že text náhle utnul?"],
    explanation: "Závěr má odpovědět, jak dopadl problém ze zápletky, a nechat čtenáři myšlenku na konec. Slovo 'konec' samo o sobě nic nevyřeší.",
  },
  {
    question: "Jaký žánr bys vybral pro příběh o kouzelném lesním skřítkovi?",
    correctAnswer: "pohádku",
    options: [
      "detektivní povídku",
      "pohádku",
      "historický román",
      "věcný popis",
    ],
    hints: ["Skřítek v běžném světě neexistuje. Který žánr s takovými bytostmi počítá?"],
    explanation: "Nadpřirozená bytost patří do žánru, kde je kouzlo přirozenou součástí světa. V detektivce ani v historickém románu by působila cizorodě.",
  },
  {
    question: "Co je pointa v literárním textu?",
    correctAnswer: "překvapivý závěr textu",
    options: [
      "první věta textu",
      "překvapivý závěr textu",
      "podrobný popis postav",
      "seznam použitých knih",
    ],
    hints: ["Proč si někdy pamatuješ z celé povídky hlavně poslední větu?"],
    explanation: "Pointa je vyvrcholení na konci, které čtenáře překvapí nebo přinutí přemýšlet. Právě kvůli ní si text zapamatuje.",
  },
  {
    question: "Jaký žánr vybrat pro příběh plný napětí a záhady?",
    correctAnswer: "detektivní povídku",
    options: [
      "lyrickou báseň",
      "detektivní povídku",
      "veselou říkanku",
      "věcný popis přístroje",
    ],
    hints: ["Který z uvedených žánrů je celý postavený na tom, že čtenář něco do konce neví?"],
    explanation: "Napětí a nevyřešená záhada jsou základem detektivního žánru. Lyrická báseň ani říkanka na takovém napětí nestojí.",
  },
  {
    question: "Co je osnova textu a proč ji tvoříme?",
    correctAnswer: "plán textu předem",
    options: [
      "seznam použitých slov",
      "plán textu předem",
      "závěrečné shrnutí textu",
      "soupis chyb po napsání",
    ],
    hints: ["Vzniká před psaním, nebo až po něm? A k čemu ti při psaní pomůže?"],
    explanation: "Osnova je stručný plán, co a v jakém pořadí napíšeš. Díky ní se příběh nerozpadne a nezapomeneš žádnou důležitou část.",
  },
  {
    question: "Co je dialog v literárním textu?",
    correctAnswer: "rozhovor postav v přímé řeči",
    options: [
      "popis prostředí kolem postav",
      "rozhovor postav v přímé řeči",
      "popis vzhledu jedné postavy",
      "vnitřní myšlenky vypravěče",
    ],
    hints: ["Podívej se do knihy na místa s uvozovkami a pomlčkami na začátku řádku. Co se tam odehrává?"],
    explanation: "Dialog je rozhovor dvou nebo více postav zapsaný přímou řečí. Popis ani vnitřní myšlenky dialogem nejsou — chybí jim výměna replik.",
  },
  {
    question: "Jak přímá řeč text oživuje?",
    correctAnswer: "dává postavám vlastní hlas",
    options: [
      "nahrazuje děj popisem",
      "dává postavám vlastní hlas",
      "zpomaluje tempo příběhu",
      "skrývá, kdo právě mluví",
    ],
    hints: ["Porovnej 'Řekl jí, že se zlobí' a '„Zlobím se!“ vykřikl'. Ve které variantě postavu skoro slyšíš?"],
    explanation: "V přímé řeči čtenář slyší postavu jejími vlastními slovy, takže působí živě a děj se zrychluje. Vyprávění o tom, co postava řekla, je odtažitější.",
  },
  {
    question: "Co je nezbytné pro dobrou charakteristiku postavy?",
    correctAnswer: "vzhled, chování i pocity",
    options: [
      "jen jméno a věk postavy",
      "vzhled, chování i pocity",
      "jen seznam jejích přátel",
      "jen místo, kde postava žije",
    ],
    hints: ["Kdyby ses o někom dozvěděl jen jméno a věk, poznal bys ho? Co dalšího potřebuješ vědět?"],
    explanation: "Aby byla postava živá, musí čtenář vědět, jak vypadá, jak jedná a co prožívá uvnitř. Samotné údaje jako jméno nebo věk to nezajistí.",
  },
  {
    question: "Jak se liší pohádka od povídky?",
    correctAnswer: "pohádka má kouzla, povídka ne",
    options: [
      "povídka má kouzla, pohádka ne",
      "pohádka má kouzla, povídka ne",
      "pohádka je vždy delší",
      "obojí je úplně totéž",
    ],
    hints: ["V jednom z těch žánrů se může stát i to, co ve skutečném světě není možné. Ve kterém?"],
    explanation: "Pohádka pracuje s kouzly a nadpřirozenými bytostmi, povídka se drží možného světa. Délka o zařazení nerozhoduje.",
  },
  {
    question: "Co je správné pravidlo pro psaní vlastního textu?",
    correctAnswer: "osnova, psaní, oprava",
    options: [
      "psát rovnou a neopravovat",
      "osnova, psaní, oprava",
      "napsat text jen jednou",
      "opravit dřív, než začnu psát",
    ],
    hints: ["Tři kroky jdou v určitém pořadí. Co dává smysl dělat jako první a co až úplně nakonec?"],
    explanation: "Nejdřív si text naplánuješ, pak napíšeš a nakonec opravíš. Žádný autor neodevzdá první verzi — právě úpravy z textu udělají dobrý text.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak vybrat správné téma pro vlastní báseň?",
    correctAnswer: "téma, které mě zajímá",
    options: [
      "téma s nejdelším názvem",
      "téma, které mě zajímá",
      "téma, které nikoho nezajímá",
      "vždy jen počasí",
    ],
    hints: ["O čem se ti bude psát líp — o věci, ke které nic necítíš, nebo o té, která ti leží v hlavě?"],
    explanation: "Nejlepší básně vyrůstají z vlastního prožitku. Když tě téma zajímá, snáz k němu najdeš obrazy a slova.",
  },
  {
    question: "Co je rýmové schéma ABAB?",
    correctAnswer: "rýmuje se 1.+3. a 2.+4. verš",
    options: [
      "rýmuje se 1.+2. a 3.+4. verš",
      "rýmuje se 1.+3. a 2.+4. verš",
      "rýmují se všechny verše",
      "rýmuje se jen 1. a 4. verš",
    ],
    hints: ["Písmena jdou za sebou A-B-A-B. Které pozice mají stejné písmeno?"],
    explanation: "Stejná písmena označují stejný rým. U schématu ABAB se tedy rýmuje první verš se třetím a druhý se čtvrtým — rýmy se střídají.",
  },
  {
    question: "Co je rýmové schéma AABB?",
    correctAnswer: "rýmuje se 1.+2. a 3.+4. verš",
    options: [
      "rýmuje se 1.+3. a 2.+4. verš",
      "rýmuje se 1.+2. a 3.+4. verš",
      "rýmují se všechny verše",
      "nerýmuje se žádný verš",
    ],
    hints: ["Písmena jdou za sebou A-A-B-B. Stojí stejná písmena vedle sebe, nebo obden?"],
    explanation: "U schématu AABB se rýmují sousední dvojice veršů — první s druhým a třetí se čtvrtým. Tomu se říká sdružený rým.",
  },
  {
    question: "Jak napsat zajímavé zahájení povídky?",
    correctAnswer: "začít akcí nebo dialogem",
    options: [
      "začít popisem počasí",
      "začít akcí nebo dialogem",
      "začít výčtem postav",
      "začít shrnutím konce",
    ],
    hints: ["Kdy tě kniha chytne dřív — když se hned něco děje, nebo když se dvě strany popisuje obloha?"],
    explanation: "Když text začne děním nebo replikou, čtenář je hned uvnitř příběhu. Dlouhý popis nebo výčet postav ho na začátku spíš odradí.",
  },
  {
    question: "Jaký typ vypravěče se hodí do pohádky pro děti?",
    correctAnswer: "er-forma, tedy 3. osoba",
    options: [
      "ich-forma, tedy 1. osoba",
      "er-forma, tedy 3. osoba",
      "2. osoba, oslovení ty",
      "střídání všech osob",
    ],
    hints: ["Jak začíná většina pohádek, které znáš — 'Byl jednou jeden…', nebo 'Byl jsem jednou…'?"],
    explanation: "Pohádky se tradičně vyprávějí zvenčí ve 3. osobě, takže vypravěč vidí na všechny postavy. Střídání osob by malého čtenáře jen zmátlo.",
  },
  {
    question: "Jak správně napsat napínavou scénu?",
    correctAnswer: "krátké věty a rychlé tempo",
    options: [
      "dlouhé popisné věty",
      "krátké věty a rychlé tempo",
      "podrobný popis prostředí",
      "výčet vlastností postav",
    ],
    hints: ["Aby čtenář cítil napětí, věty nesmí být dlouhé a popisné — mají znít, jako by se to dělo rychle, teď hned."],
    explanation: "Krátké věty čtenář přečte rychleji, a text tím zrychlí i děj. Dlouhý popis napětí naopak brzdí.",
  },
  {
    question: "Jak správně napsat klidnou, idylickou scénu?",
    correctAnswer: "delší věty a bohatý popis",
    options: [
      "krátké věty bez popisu",
      "delší věty a bohatý popis",
      "jen rychlé dialogy",
      "výčet událostí za sebou",
    ],
    hints: ["Je to opak toho, co bys použil v napínavé scéně. Co tedy s délkou vět uděláš?"],
    explanation: "Rozvité věty a smyslové detaily čtení zpomalí, a čtenář se tak v klidné scéně může zdržet. Krátké věty by naopak vytvořily spěch.",
  },
  {
    question: "Co je hlavní chyba začínajících autorů?",
    correctAnswer: "hodně popisu, málo děje",
    options: [
      "hodně děje, málo popisu",
      "hodně popisu, málo děje",
      "příliš krátký nadpis",
      "příliš mnoho kapitol",
    ],
    hints: ["Co se v takovém textu nestane, i když je dlouhý?"],
    explanation: "Začátečníci často dlouze popisují prostředí a vzhled, ale příběh se nikam nehne. Čtenáře drží u textu především děj.",
  },
  {
    question: "Jak zapsat vnitřní myšlenky postavy?",
    correctAnswer: "odlišit je od přímé řeči",
    options: [
      "psát je stejně jako dialog",
      "odlišit je od přímé řeči",
      "vůbec je nezapisovat",
      "psát je vždy velkými písmeny",
    ],
    hints: ["Myšlenku postava nevysloví nahlas. Jak dá autor čtenáři najevo, že ji nikdo jiný neslyší?"],
    explanation: "Myšlenky se zapisují jinak než mluvená řeč — kurzivou nebo bez uvozovek. Kdyby vypadaly stejně jako dialog, čtenář by nepoznal, co bylo řečeno nahlas.",
  },
  {
    question: "Jak vytvořit napínavou zápletku v povídce?",
    correctAnswer: "cíl postavy a překážky",
    options: [
      "jen popis prostředí",
      "cíl postavy a překážky",
      "jen rozhovory postav",
      "jen výčet postav",
    ],
    hints: ["Kdyby postava dostala všechno hned, o co by se čtenář bál?"],
    explanation: "Napětí vzniká z toho, že postava něco chce a něco jí v tom brání. Bez překážky není konflikt, a tedy ani napětí.",
  },
  {
    question: "Co je pointa pohádky nebo bajky?",
    correctAnswer: "poučení plynoucí z děje",
    options: [
      "poslední věta textu",
      "poučení plynoucí z děje",
      "seznam všech postav",
      "název celé bajky",
    ],
    hints: ["Kvůli čemu se bajka vlastně vypráví? Kvůli příběhu samotnému, nebo kvůli tomu, co si z něj odneseš?"],
    explanation: "Bajka i pohádka mířila odjakživa k ponaučení — líný nedostane odměnu, pyšný pohoří. Poslední věta je jen místem, kde se to poučení objeví.",
  },
  {
    question: "Jak se liší hrdina a záporák v literárním textu?",
    correctAnswer: "hrdina usiluje, záporák brání",
    options: [
      "záporák usiluje, hrdina brání",
      "hrdina usiluje, záporák brání",
      "hrdina i záporák jsou totéž",
      "záporák vždy nakonec zemře",
    ],
    hints: ["Jeden z nich má v příběhu cíl, druhý mu stojí v cestě. Který je který?"],
    explanation: "Hrdina (protagonista) o něco usiluje, záporák (antagonista) mu v tom brání. Z toho střetu vzniká děj — a jak dopadne, není dané předem.",
  },
  {
    question: "Jak zlepšit text po prvním napsání?",
    correctAnswer: "přečíst nahlas a opravit",
    options: [
      "odevzdat rovnou první verzi",
      "přečíst nahlas a opravit",
      "opravit jen pravopisné chyby",
      "text pro jistotu zkrátit na půl",
    ],
    hints: ["Když si text přečteš potichu, přeskočíš spoustu míst. Co se změní, když ho vyslovíš?"],
    explanation: "Při čtení nahlas uslyšíš věty, které drhnou nebo se opakují — a ty pak opravíš. Samotná kontrola pravopisu takové chyby neodhalí.",
  },
  {
    question: "Co jsou klišé v literárním textu?",
    correctAnswer: "obehraná, neoriginální fráze",
    options: [
      "odborný termín z učebnice",
      "obehraná, neoriginální fráze",
      "obzvlášť zdařilá věta",
      "cizí slovo v textu",
    ],
    hints: ["Proč už spojení 'krásná jako růže' nikoho nepřekvapí?"],
    explanation: "Klišé je obrat, který byl použit tolikrát, že přestal cokoli sdělovat. Není chybný, jen otřelý — a čtenáře proto míjí.",
  },
  {
    question: "Jak napsat originální text bez klišé?",
    correctAnswer: "hledat vlastní obrazy",
    options: [
      "opisovat od slavných autorů",
      "hledat vlastní obrazy",
      "psát jen o počasí",
      "používat co nejvíc frází",
    ],
    hints: ["Když tě napadne první přirovnání, napadlo pravděpodobně i všechny ostatní. Co s tím uděláš?"],
    explanation: "Originalita vzniká tím, že popíšeš věc po svém — vlastním přirovnáním a vlastním pohledem. Opisování cizích obratů vede zpět ke klišé.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je kompoziční oblouk příběhu?",
    correctAnswer: "napětí stoupá a pak klesá",
    options: [
      "napětí je pořád stejné",
      "napětí stoupá a pak klesá",
      "napětí od začátku jen klesá",
      "napětí přijde až za koncem",
    ],
    hints: ["Nakresli si průběh napětí v dobrodružné knize jako čáru. Jaký tvar ti vyjde?"],
    explanation: "Příběh se rozbíhá, napětí roste až k vrcholu a po něm přichází rozuzlení. Ta křivka je důvod, proč se dobře napsaná kniha čte jedním dechem.",
  },
  {
    question: "Co je nespolehlivý vypravěč?",
    correctAnswer: "vypravěč, jemuž nelze věřit",
    options: [
      "vypravěč stojící mimo příběh",
      "vypravěč, jemuž nelze věřit",
      "vypravěč bez jména",
      "vypravěč, který mlčí",
    ],
    hints: ["Představ si příběh vyprávěný někým, kdo lže nebo si věci pamatuje špatně. Co to udělá se čtenářem?"],
    explanation: "Nespolehlivý vypravěč podává děj zkresleně — buď záměrně, nebo protože sám všemu nerozumí. Čtenář si proto musí pravdu domýšlet sám.",
  },
  {
    question: "Proč se vyplatí pocit spíš ukázat než ho pojmenovat?",
    correctAnswer: "čtenář ho pak prožije sám",
    options: [
      "text je tím vždy kratší",
      "čtenář ho pak prožije sám",
      "je to jednodušší na psaní",
      "vyhneme se tak přímé řeči",
    ],
    hints: ["Porovnej 'Byl smutný' a 'Slzy mu stékaly po tvářích'. Ve které větě ten smutek opravdu cítíš?"],
    explanation: "Když autor pocit jen pojmenuje, čtenář ho vezme na vědomí. Když ho ukáže jednáním a detailem, čtenář si ho odvodí sám — a proto ho i prožije.",
  },
  {
    question: "Co je román v dopisech?",
    correctAnswer: "příběh složený z dopisů",
    options: [
      "příběh o poštovním úřadu",
      "příběh složený z dopisů",
      "příběh psaný jen v básních",
      "příběh bez jakýchkoli postav",
    ],
    hints: ["Nejde o to, o čem se píše, ale o to, jakou podobu má samotný text. Z čeho se skládá?"],
    explanation: "Takový román netvoří souvislé vyprávění, ale dopisy nebo deníkové zápisy postav. Čtenář se děj dozvídá jen z toho, co si postavy navzájem napíšou.",
  },
  {
    question: "Jak se liší vnitřní a vnější konflikt v příběhu?",
    correctAnswer: "vnitřní je sám se sebou",
    options: [
      "vnitřní je s jinou osobou",
      "vnitřní je sám se sebou",
      "vnější je sám se sebou",
      "obojí je úplně totéž",
    ],
    hints: ["Rozhodnout se mezi strachem a odvahou — odehrává se takový boj venku, nebo uvnitř postavy?"],
    explanation: "Vnitřní konflikt je zápas postavy s vlastními pochybnostmi, vnější je střet s jinou postavou nebo s okolnostmi. Silné příběhy mívají obojí zároveň.",
  },
  {
    question: "Která věta lépe ukazuje, že je postava smutná?",
    correctAnswer: "'Slzy mu stékaly po tvářích.'",
    options: [
      "'Byl velmi smutný.'",
      "'Slzy mu stékaly po tvářích.'",
      "'Cítil se dost špatně.'",
      "'Vůbec nebyl veselý.'",
    ],
    hints: ["Tři z těch vět čtenáři pocit oznámí. Jedna mu ho dá vidět. Která?"],
    explanation: "Popis konkrétního detailu nechá čtenáře, aby si pocit odvodil sám — a tím ho zasáhne silněji než pouhé sdělení 'byl smutný'.",
  },
  {
    question: "Proč autor ukončí kapitolu v nejnapínavější chvíli?",
    correctAnswer: "aby čtenář četl dál",
    options: [
      "aby si čtenář odpočinul",
      "aby čtenář četl dál",
      "aby byl text kratší",
      "aby se vyhnul rozuzlení",
    ],
    hints: ["Co uděláš, když kapitola skončí větou 'Dveře se pomalu otevřely'?"],
    explanation: "Nedořečená situace v čtenáři vyvolá potřebu vědět, jak to dopadne, a ten proto pokračuje do další kapitoly. Rozuzlení přijde, jen o kus dál.",
  },
  {
    question: "Co znamená, že má text význam i mezi řádky?",
    correctAnswer: "postava říká něco jiného, než myslí",
    options: [
      "postava mluví nahlas a jasně",
      "postava říká něco jiného, než myslí",
      "text má dva různé konce",
      "text je psaný ve dvou jazycích",
    ],
    hints: ["Když někdo řekne 'To je v pořádku' a přitom mu je do pláče, co se čtenář dozví z těch slov a co ze situace?"],
    explanation: "Skrytý význam vzniká tam, kde se rozchází to, co postava vysloví, a to, co doopravdy cítí. Čtenář rozdíl odhalí z chování a okolností.",
  },
  {
    question: "Jak vytvořit psychologicky složitou postavu?",
    correctAnswer: "má silné stránky i slabiny",
    options: [
      "je jen dobrá, nebo jen zlá",
      "má silné stránky i slabiny",
      "má popsaný jen vzhled",
      "nikdy nemluví, jen jedná",
    ],
    hints: ["Znáš ve skutečném životě někoho, kdo je jen dobrý, nebo jen zlý?"],
    explanation: "Věrohodná postava má klady i zápory, stejně jako skuteční lidé. Postava jen dobrá nebo jen zlá působí ploše a čtenář jí neuvěří.",
  },
  {
    question: "Co znamená vymyslet pro příběh vlastní svět?",
    correctAnswer: "svět s vlastními pravidly",
    options: [
      "věrný popis skutečného města",
      "svět s vlastními pravidly",
      "mapa nakreslená na obálce",
      "seznam postav a jejich jmen",
    ],
    hints: ["Nestačí vymyslet jména a místa. Co musí ve smyšleném světě fungovat, aby čtenáři dával smysl?"],
    explanation: "Vlastní svět potřebuje pravidla, která platí po celou dobu — jak funguje magie, kdo komu vládne, co je zakázané. Bez nich se příběh stane nevěrohodným.",
  },
  {
    question: "Co znamená, že se postava v příběhu vyvíjí?",
    correctAnswer: "na konci je jiná než na začátku",
    options: [
      "na konci je stejná jako na začátku",
      "na konci je jiná než na začátku",
      "má na konci jiné jméno",
      "objeví se až v samotném závěru",
    ],
    hints: ["Zbabělec, který na konci obstojí — co se u něj během příběhu změnilo?"],
    explanation: "Vývoj postavy znamená, že ji události proměnily — něco pochopila, něco překonala. Postava, která zůstane stejná, čtenáře obvykle nezaujme.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const VLASTNILITERARNITEXTNADANETEMA: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-text-na-dane-tema",
    rvpNodeId: "g5-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-text-na-dane-tema",
    title: "Vlastní literární text na dané téma",
    studentTitle: "Vlastní text",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s textem",
    briefDescription: "Vytvoříš vlastní literární text a pochopíš, jak na to.",
    keywords: ["vlastní text", "tvorba", "pohádka", "povídka", "báseň", "žánr", "téma"],
    goals: [
      "Vybrat vhodný žánr a téma pro vlastní text",
      "Sestavit osnovu a napsat vlastní literární text",
      "Opravit a zdokonalit napsaný text",
    ],
    boundaries: [
      "Bez hodnocení vlastní tvůrčí práce AI",
      "Rozšiřující nad rámec RVP 5. ročníku: úroveň 3 (kompoziční oblouk, nespolehlivý vypravěč, vnitřní a vnější konflikt, vývoj postavy)",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Postup tvorby textu: 1. Vyber žánr (pohádka, povídka, báseň). 2. Urči téma. 3. Sestav osnovu. 4. Piš. 5. Oprav a zlepši.",
      steps: [
        "Vyber žánr: pohádka, povídka nebo báseň.",
        "Urči téma: o čem to bude.",
        "Vymysli postavy, prostředí a děj.",
        "Sestav osnovu (plán).",
        "Piš a použij přímou řeč pro oživení.",
        "Přečti nahlas a oprav.",
      ],
      commonMistake: "Žáci začnou psát bez plánu a příběh se rozpadne nebo nemá závěr. Osnova pomáhá.",
      example: "Téma: ztracený pes. Žánr: povídka. Osnova: Pavel najde psa → hledají majitele → šťastné setkání.",
    },
  },
];
