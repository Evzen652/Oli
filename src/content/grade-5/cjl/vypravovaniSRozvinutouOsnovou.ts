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
    question: "Co je osnova vyprávění?",
    correctAnswer: "plán textu po částech",
    options: ["plán textu po částech", "seznam všech postav", "seznam použitých slov", "popis prostředí děje"],
    hints: ["Vzniká před psaním, ne po něm. K čemu ti při psaní slouží?"],
    explanation: "Osnova je kostra textu — rozvrhne, co se v které části stane. Díky ní se při psaní neztratíš a nic důležitého nevynecháš.",
  },
  {
    question: "Jaká jsou čtyři základní části osnovy vyprávění?",
    correctAnswer: "úvod, zápletka, vyvrcholení, závěr",
    options: [
      "začátek, střed, konec",
      "úvod, zápletka, vyvrcholení, závěr",
      "popis, dialog, akce, konec",
      "postavy, prostředí, děj, poučení",
    ],
    hints: ["Čtyři kroky: kdo a kde → co se pokazilo → nejhorší chvíle → jak to dopadlo."],
    explanation: "Vyprávění postupuje od uvedení do situace přes vzniklý problém a jeho vyhrocení až k rozuzlení. Trojice začátek–střed–konec je jen hrubší dělení bez zachycení napětí.",
  },
  {
    question: "Co patří do úvodu vyprávění?",
    correctAnswer: "postavy, místo a doba děje",
    options: ["vyvrcholení příběhu", "závěr s poučením", "postavy, místo a doba děje", "přímá řeč postav"],
    hints: ["Čtenář zatím neví nic. Co mu musíš dát, aby se v příběhu vyznal?"],
    explanation: "Úvod čtenáře uvede do situace — představí, kdo v příběhu vystupuje, kde a kdy se odehrává. Napětí i rozuzlení přicházejí až později.",
  },
  {
    question: "Co je zápletka ve vyprávění?",
    correctAnswer: "problém, který rozjede děj",
    options: ["závěrečné poučení", "popis prostředí děje", "seznam hlavních postav", "problém, který rozjede děj"],
    hints: ["Do klidné situace něco vstoupí a od té chvíle se příběh nedá zastavit. Co to je?"],
    explanation: "Zápletka naruší klidný začátek a nastolí problém, který je potřeba vyřešit. Bez ní by se v příběhu nic nedělo.",
  },
  {
    question: "Co je vyvrcholení ve vyprávění?",
    correctAnswer: "nejnapínavější okamžik",
    options: ["nejnapínavější okamžik", "klidný začátek děje", "úvod s popisem místa", "rozuzlení konfliktu"],
    hints: ["Je to místo, kde čtenář zadrží dech. Kde v příběhu leží?"],
    explanation: "Vyvrcholení je vrchol napětí — chvíle, kdy se rozhoduje. Rozuzlení přichází až po něm, v závěru.",
  },
  {
    question: "Co obsahuje závěr vyprávění?",
    correctAnswer: "rozuzlení celého děje",
    options: [
      "nová zápletka příběhu",
      "rozuzlení celého děje",
      "popis prostředí děje",
      "seznam hlavních postav",
    ],
    hints: ["Na co má čtenář v poslední části konečně dostat odpověď?"],
    explanation: "Závěr říká, jak problém ze zápletky dopadl. Nová zápletka by naopak příběh znovu otevřela, místo aby ho uzavřela.",
  },
  {
    question: "Rozvitá osnova se liší od jednoduché tím, že:",
    correctAnswer: "dělí části na podčásti",
    options: ["je vždy kratší než jiná", "vynechává celý závěr", "dělí části na podčásti", "má jen holé body bez popisu"],
    hints: ["Označení jako II.A a II.B napovídají. Co se s hlavními body stalo?"],
    explanation: "Rozvitá osnova každou hlavní část rozepíše na menší kroky (II.A, II.B). Text je díky tomu naplánovaný podrobněji, ale části zůstávají stejné.",
  },
  {
    question: "Jaký čas se nejčastěji používá ve vyprávění?",
    correctAnswer: "minulý",
    options: ["budoucí", "přítomný", "podmiňovací způsob", "minulý"],
    hints: ["Vyprávění popisuje to, co se už odehrálo — proto slovesa bývají v tvaru, který ukazuje, že už je to za námi."],
    explanation: "Vyprávíme obvykle o tom, co se stalo, takže převažují tvary jako 'přišel', 'stalo se'. Přítomný čas se používá jen zvláštním záměrem, aby děj působil bezprostředně.",
  },
  {
    question: "Co pomáhá vyprávění udělat živým a napínavým?",
    correctAnswer: "přímá řeč a napětí",
    options: ["přímá řeč a napětí", "seznam suchých faktů", "odborné vědecké termíny", "opakování stejných vět"],
    hints: ["Kdy máš při čtení pocit, že jsi u toho — když se dozvídáš údaje, nebo když postavy mluví?"],
    explanation: "Když postavy promluví vlastními slovy a čtenář neví, jak to dopadne, text ožije. Výčet faktů ani odborné termíny takový účinek nemají.",
  },
  {
    question: "Proč je osnova užitečná před psaním?",
    correctAnswer: "udrží přehlednou strukturu",
    options: [
      "nutí psát kratší texty",
      "udrží přehlednou strukturu",
      "je povinná ze zákona",
      "zakazuje přímou řeč",
    ],
    hints: ["Co se stane s dlouhým textem, který píšeš bez plánu?"],
    explanation: "S osnovou víš, kam text směřuje, a nezapomeneš žádnou část. Na délku textu ani na použití přímé řeči přitom nemá vliv.",
  },
  {
    question: "Jaký prvek dělá vyprávění věrohodnějším?",
    correctAnswer: "citovaná slova v uvozovkách",
    options: ["odborné termíny v textu", "mnoho přídavných jmen", "citovaná slova v uvozovkách", "vědecká fakta a čísla"],
    hints: ["Porovnej 'Volal o pomoc' a '„Pomozte!“ zvolal'. Ve které variantě postavu skoro slyšíš?"],
    explanation: "Přímá řeč dává postavám vlastní hlas a čtenář má pocit, že je u toho. Hromada přídavných jmen ani odborné výrazy věrohodnost nezvýší.",
  },
  {
    question: "Ve které části osnovy se typicky nachází dialog?",
    correctAnswer: "v zápletce a vyvrcholení",
    options: ["vždy jen v úvodu", "vždy jen v závěru", "nikdy se nepoužívá", "v zápletce a vyvrcholení"],
    hints: ["Kde se v příběhu postavy nejvíc střetávají a musí spolu jednat?"],
    explanation: "Rozhovory nesou konflikt, a ten je nejsilnější uprostřed příběhu. V úvodu ještě postavy představujeme a v závěru už se spíš uzavírá.",
  },
  {
    question: "Co je poučení (morální závěr) ve vyprávění?",
    correctAnswer: "co příběh ukázal",
    options: ["co příběh ukázal", "seznam hlavních postav", "popis prostředí děje", "datum napsání textu"],
    hints: ["Dočteš poslední větu a něco si z příběhu odneseš. Co to je?"],
    explanation: "Poučení je myšlenka, kterou si čtenář odnese — třeba že se vyplatí být poctivý. Nemusí být vyslovena přímo, může plynout ze samotného děje.",
  },
  {
    question: "Jaký prvek vyprávění udržuje čtenáře v napětí?",
    correctAnswer: "odkládané řešení a zvraty",
    options: [
      "mnoho popisů prostředí",
      "odkládané řešení a zvraty",
      "krátké věty bez emocí",
      "vědecké informace navíc",
    ],
    hints: ["Kdyby se problém vyřešil hned na druhé stránce, četl bys dál?"],
    explanation: "Napětí drží nejistota — čtenář chce vědět, jak to dopadne, a autor odpověď odkládá. Popisy naopak děj brzdí.",
  },
  {
    question: "Jak správně začneme vyprávění, aby čtenáře zaujalo?",
    correctAnswer: "situací, dialogem, otázkou",
    options: ["vždy popisem počasí", "výčtem všech postav", "situací, dialogem, otázkou", "datem celé události"],
    hints: ["Kdy tě text chytne dřív — když se hned něco děje, nebo když se dvě strany popisuje obloha?"],
    explanation: "Čtenáře zaujme dění nebo otázka, na kterou chce znát odpověď. Popis počasí a výčet postav ho na začátku spíš unaví.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Který zápis je rozvitá osnova příběhu o ztraceném psu?",
    correctAnswer: "I. Úvod, II.A Zmizení, II.B Hledání",
    options: ["I. Pes, II. Rodina, III. Konec", "I. Popis psa, II. Dialog", "jen seznam událostí", "I. Úvod, II.A Zmizení, II.B Hledání"],
    hints: ["Poznávacím znamením rozvité osnovy jsou označení jako II.A a II.B. Kde je vidíš?"],
    explanation: "Rozvitá osnova dělí hlavní části na menší kroky, proto se objevují podbody II.A a II.B. Ostatní zápisy jsou jen výčty bez plánu děje.",
  },
  {
    question: "Jaký problém nastane, když ve vyprávění vynecháme zápletku?",
    correctAnswer: "nebude co řešit",
    options: ["nebude co řešit", "příběh bude lepší", "závěr přijde dřív", "postavy ztratí jméno"],
    hints: ["Zůstane ti úvod a závěr. Co mezi nimi chybí?"],
    explanation: "Bez zápletky se v příběhu neobjeví žádný problém, takže není co vyhrotit ani rozuzlit. Text pak působí jako pouhý popis.",
  },
  {
    question: "Co je retrospektivní vyprávění?",
    correctAnswer: "vrací se do minulosti",
    options: [
      "jde od začátku ke konci",
      "vrací se do minulosti",
      "vypráví o budoucnosti",
      "vypráví z pohledu zvířete",
    ],
    hints: ["Předpona 'retro-' znamená 'zpět'. Kterým směrem se takové vyprávění obrací?"],
    explanation: "Retrospektiva začne v přítomnosti a teprve pak se vrací k dřívějším událostem, aby vysvětlila, jak k dnešnímu stavu došlo.",
  },
  {
    question: "Jak zapíšeme osnovu ve formě vět?",
    correctAnswer: "každý bod je stručná věta",
    options: ["každý bod je jedno slovo", "jsou to jen přídavná jména", "každý bod je stručná věta", "body se vůbec nepíšou"],
    hints: ["Bod 'Les' ti za týden nic nepřipomene. Co s ním musíš udělat, aby fungoval?"],
    explanation: "Větná osnova zapisuje každý bod jako krátkou větu ('Pavel se ztratí v lese'), takže je i po čase jasné, co se v té části mělo stát.",
  },
  {
    question: "Jak se liší jednoduchá a složená osnova?",
    correctAnswer: "složená má podčásti",
    options: ["jednoduchá má podčásti", "složená nemá úvod", "liší se jen délkou", "složená má podčásti"],
    hints: ["Jedna z nich zůstává u hlavních bodů, druhá je ještě rozepisuje. Která je která?"],
    explanation: "Jednoduchá osnova má jen hlavní body, složená je dále dělí na podbody. Obě přitom obsahují všechny čtyři části vyprávění.",
  },
  {
    question: "Ve které části osnovy se nejčastěji popisuje prostředí?",
    correctAnswer: "v úvodu a začátku zápletky",
    options: ["v úvodu a začátku zápletky", "až ve vyvrcholení", "výhradně v závěru", "ve všech částech stejně"],
    hints: ["Kdy potřebuje čtenář vědět, kde se příběh odehrává — hned, nebo až v nejnapínavější chvíli?"],
    explanation: "Prostředí se představuje na začátku, aby čtenář věděl, kde se ocitl. Ve vyvrcholení by dlouhý popis jen brzdil napětí.",
  },
  {
    question: "Jakou funkci mají výrazy jako 'najednou' nebo 'v ten okamžik'?",
    correctAnswer: "vytvářejí napětí a zlom",
    options: [
      "popisují prostředí děje",
      "vytvářejí napětí a zlom",
      "uvozují přímou řeč",
      "nemají žádnou funkci",
    ],
    hints: ["Co s tebou udělá věta, která začne slovem 'Najednou'?"],
    explanation: "Tyhle výrazy signalizují, že se děj právě láme a přichází něco nečekaného. Čtenář se díky nim připraví na zvrat.",
  },
  {
    question: "Jak zapíšeme vyvrcholení do osnovy?",
    correctAnswer: "stručně nejtěžší okamžik",
    options: ["podrobně celý závěr", "výčet všech postav", "stručně nejtěžší okamžik", "rozepsaný dialog"],
    hints: ["Osnova je jen plán. Kolik místa v ní má zabrat jedna část?"],
    explanation: "Do osnovy patří krátká poznámka typu 'III. Pavel uvízne nad propastí'. Rozepsat scénu se všemi detaily je až úkolem samotného textu.",
  },
  {
    question: "Proč je přímá řeč v osnově označena jen stručně?",
    correctAnswer: "osnova je jen plán",
    options: ["přímá řeč je zakázaná", "osnova ji nemá nikdy", "záleží na délce textu", "osnova je jen plán"],
    hints: ["Kdyby v osnově byly celé dialogy, čím by se lišila od hotového textu?"],
    explanation: "V osnově stačí poznámka 'dialog bratrů o ztrátě'. Konkrétní repliky se vypisují až v textu, jinak by osnova ztratila smysl.",
  },
  {
    question: "Co je kompoziční zásada stupňování ve vyprávění?",
    correctAnswer: "napětí roste a pak klesá",
    options: ["napětí roste a pak klesá", "napětí hned od začátku klesá", "vyvrcholení je na začátku", "napětí je stále stejné"],
    hints: ["Nakresli si průběh napětí jako čáru od úvodu k závěru. Jaký tvar ti vyjde?"],
    explanation: "Napětí se od úvodu postupně stupňuje až k vyvrcholení a po něm v závěru opadá. Kdyby bylo stále stejné, čtenář by neměl proč pokračovat.",
  },
  {
    question: "Jak napsat závěr, aby byl přesvědčivý?",
    correctAnswer: "uzavřít otázky a zapůsobit",
    options: [
      "napsat jen slovo konec",
      "uzavřít otázky a zapůsobit",
      "doslova opakovat úvod",
      "přidat novou zápletku",
    ],
    hints: ["Co čtenáři vadí víc — že se něco nedozvěděl, nebo že text skončil moc rychle?"],
    explanation: "Dobrý závěr zodpoví, co zůstalo otevřené, a nechá po sobě dojem nebo myšlenku. Nová zápletka by naopak text znovu otevřela.",
  },
  {
    question: "Jak na sebe navazuje zápletka a vyvrcholení?",
    correctAnswer: "napětí se stupňuje postupně",
    options: ["odděluje je prázdný řádek", "vyvrcholení je vždy kratší", "napětí se stupňuje postupně", "mezi nimi je vždy dialog"],
    hints: ["Pozná čtenář přesné místo, kde jedna část končí a druhá začíná?"],
    explanation: "Zápletka plynule přerůstá ve vyvrcholení — napětí roste, až dosáhne vrcholu. Ostrá hranice mezi nimi v textu neexistuje.",
  },
  {
    question: "Co znamená začít vyprávění rovnou uprostřed děje?",
    correctAnswer: "čtenáře vhodíme do akce",
    options: ["začneme popisem počasí", "začneme až rozuzlením", "vynecháme celý závěr", "čtenáře vhodíme do akce"],
    hints: ["Kniha začne větou 'Dveře za ním zapadly a on věděl, že je konec.' Co autor vynechal?"],
    explanation: "Autor přeskočí uvedení do situace a hodí čtenáře rovnou do dění. Souvislosti pak doplňuje postupně, což udrží pozornost od první věty.",
  },
  {
    question: "Jak se liší vyprávění od popisu?",
    correctAnswer: "vyprávění má děj, popis ne",
    options: ["vyprávění má děj, popis ne", "popis má děj, vyprávění ne", "popis je vždy kratší", "obojí znamená totéž"],
    hints: ["Zeptej se u obou textů: stane se v něm něco, nebo se jen dozvídám, jak něco vypadá?"],
    explanation: "Vyprávění sleduje události v čase, popis zachycuje stav a vlastnosti. Délka o rozdílu nerozhoduje.",
  },
  {
    question: "Proč je dobré v závěru shrnout hlavní myšlenku příběhu?",
    correctAnswer: "čtenář si odnese myšlenku",
    options: [
      "text je tím delší",
      "čtenář si odnese myšlenku",
      "není to vůbec nutné",
      "zkrátí se tím závěr",
    ],
    hints: ["Proč si některé příběhy pamatuješ roky a jiné hned zapomeneš?"],
    explanation: "Když příběh vyústí v myšlenku, zůstane čtenáři v hlavě i po dočtení. Bez ní působí jako pouhý sled událostí.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je epizoda ve vyprávění?",
    correctAnswer: "kratší příběh uvnitř většího",
    options: ["druh úvodní zápletky", "zvláštní typ osnovy", "kratší příběh uvnitř většího", "závěrečné poučení díla"],
    hints: ["V dlouhé knize se občas odehraje uzavřená příhoda, která má vlastní začátek i konec. Jak se jí říká?"],
    explanation: "Epizoda je samostatná příhoda vsazená do většího příběhu. Má vlastní zápletku i rozuzlení, ale hlavní děj tím nekončí.",
  },
  {
    question: "Co je rámcový příběh?",
    correctAnswer: "vnější příběh obalující další",
    options: ["podrobný popis prostředí", "závěrečné poučení díla", "zvláštní typ osnovy", "vnější příběh obalující další"],
    hints: ["V Tisíci a jedné noci Šeherezáda vypráví další a další příběhy. Čím je její vlastní příběh pro ty ostatní?"],
    explanation: "Rámcový příběh tvoří vnější obal, uvnitř kterého postavy vyprávějí příběhy další. Drží tak dohromady jinak nesouvisející vyprávění.",
  },
  {
    question: "Jak poznáme, že je kompozice vyprávění správná?",
    correctAnswer: "děj roste a logicky se uzavře",
    options: ["děj roste a logicky se uzavře", "text má správnou délku", "je v něm hodně přídavných jmen", "postavy mají jména"],
    hints: ["Nejde o to, jak je text dlouhý ani jak je napsaný. Zeptej se na průběh napětí a na konec."],
    explanation: "Dobrá kompozice znamená, že napětí plynule roste k vyvrcholení a závěr na děj navazuje. Délka ani bohatost jazyka o tom nerozhodují.",
  },
  {
    question: "Jak se liší vypravěč v 1. a ve 3. osobě?",
    correctAnswer: "1. osoba vypráví sám hrdina",
    options: [
      "3. osoba vypráví sám hrdina",
      "1. osoba vypráví sám hrdina",
      "1. osoba je vždy minulý čas",
      "3. osoba je vždy kratší",
    ],
    hints: ["Porovnej 'Viděl jsem ho' a 'Pavel ho viděl'. Kdo v každé z těch vět mluví?"],
    explanation: "V 1. osobě vypráví jedna z postav a čtenář vidí děj jen jejíma očima. Ve 3. osobě stojí vypravěč mimo příběh a může vidět na všechny.",
  },
  {
    question: "Jak se nazývá zlomový okamžik, kdy se děj obrátí?",
    correctAnswer: "peripetie",
    options: ["expozice", "epilog", "peripetie", "prolog"],
    hints: ["Není to ani úvod, ani závěr. Je to bod, po kterém už příběh nemůže pokračovat jako dřív."],
    explanation: "Peripetie je obrat, po němž se děj vydá jiným směrem a začne se schylovat k rozuzlení. Expozice je naopak úvod a epilog doslov.",
  },
  {
    question: "Co je expozice?",
    correctAnswer: "úvod s postavami a místem",
    options: ["vrchol napětí příběhu", "doslov po hlavním ději", "rozhovor dvou postav", "úvod s postavami a místem"],
    hints: ["Slovo souvisí s 'vystavit, ukázat'. Co se čtenáři ukazuje jako první?"],
    explanation: "Expozice je odborné označení pro úvodní část, která představí prostředí a postavy. Bez ní by čtenář nevěděl, kde se ocitl.",
  },
  {
    question: "Co je epilog?",
    correctAnswer: "doslov po hlavním ději",
    options: ["doslov po hlavním ději", "úvod před hlavním dějem", "vrchol napětí příběhu", "zlomový obrat děje"],
    hints: ["Předpona 'epi-' znamená 'po'. Kde takový text v knize stojí?"],
    explanation: "Epilog je závěrečná část připojená za rozuzlení — dovypráví, jak se postavám vedlo dál. Jeho protějškem na začátku je prolog.",
  },
  {
    question: "Proč se v osnově píší jen krátké body?",
    correctAnswer: "je to plán, ne hotový text",
    options: [
      "delší body jsou zakázané",
      "je to plán, ne hotový text",
      "osnova se nikomu neukazuje",
      "kratší text se lépe čte",
    ],
    hints: ["K čemu by ti byla osnova, kdyby byla stejně dlouhá jako samotné vyprávění?"],
    explanation: "Osnova má sloužit k rychlé orientaci při psaní. Kdyby obsahovala celé věty a dialogy, přestala by být plánem a stala se textem.",
  },
  {
    question: "Proč autor záměrně zdržuje odhalení řešení?",
    correctAnswer: "udrží čtenáře v napětí",
    options: ["text je tím delší", "je to autorova chyba", "udrží čtenáře v napětí", "zkrátí se tím závěr"],
    hints: ["Kdybys hned na druhé stránce věděl, jak to dopadne, četl bys dál?"],
    explanation: "Dokud čtenář nezná rozuzlení, chce pokračovat. Odkládání odpovědi je proto vědomý postup, ne nedostatek.",
  },
  {
    question: "Jak se říká tomu, když text předem naznačí, co se stane?",
    correctAnswer: "předznamenání",
    options: ["retrospektiva", "epilog", "peripetie", "předznamenání"],
    hints: ["Autor v první kapitole zmíní staré zbraně na zdi a v poslední se z nich vystřelí. Jak se takovému náznaku říká?"],
    explanation: "Předznamenání je nenápadný náznak budoucí události. Čtenář ho pochopí většinou až zpětně, a příběh tím působí promyšleněji.",
  },
  {
    question: "Který zápis je rozvitá osnova výletu třídy?",
    correctAnswer: "I. Přípravy, II.A Cesta, II.B Příjezd",
    options: ["I. Přípravy, II.A Cesta, II.B Příjezd", "I. Výlet, II. Třída, III. Autobus", "jen seznam událostí za sebou", "jen datum a cíl výletu"],
    hints: ["Hledej zápis, kde jsou hlavní části ještě rozdělené na menší kroky."],
    explanation: "Rozvitou osnovu poznáš podle podbodů II.A a II.B. Ostatní možnosti jsou jen výčty pojmů nebo údajů, ne plán děje.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const VYPRAVOVANISROZVINUTOUOSNOVOU: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-rozvinutou-osnovou",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-rozvinutou-osnovou",
    title: "Vyprávění s rozvinutou osnovou",
    studentTitle: "Vypravování",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Sestavíš osnovu a napíšeš vypravování s napětím.",
    keywords: ["vyprávění", "osnova", "zápletka", "vyvrcholení", "závěr", "příběh"],
    goals: [
      "Sestavit rozvitou osnovu vyprávění",
      "Rozlišit části příběhu (úvod, zápletka, vyvrcholení, závěr)",
      "Napsat vyprávění s napětím a přímou řečí",
    ],
    boundaries: [
      "Bez složité naratologické analýzy",
      "Rozšiřující nad rámec RVP 5. ročníku: úroveň 3 (expozice, peripetie, epilog, rámcový příběh, předznamenání)",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Osnova vyprávění: I. Úvod (kdo, kde, kdy) → II. Zápletka (problém) → III. Vyvrcholení (vrchol napětí) → IV. Závěr (rozuzlení).",
      steps: [
        "Vymysli hlavní postavu a prostředí (úvod).",
        "Vytvoř problém nebo konflikt (zápletka).",
        "Stupňuj napětí k vrcholu (vyvrcholení).",
        "Vyřeš problém a zakonči příběh (závěr).",
        "Rozveď osnovu na podčásti (A, B, C).",
      ],
      commonMistake: "Žáci vynechávají vyvrcholení nebo zápletku. Příběh bez problému není napínavý.",
      example: "I. Pavel jde do lesa. II. Ztratí se. III. Napadne ho medvěd. IV. Záchranáři ho najdou.",
    },
  },
];
