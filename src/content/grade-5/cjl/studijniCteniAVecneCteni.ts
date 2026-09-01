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
    question: "Co je studijní čtení?",
    correctAnswer: "pomalé čtení kvůli učení",
    options: ["pomalé čtení kvůli učení", "rychlé čtení pro zábavu", "hledání jednoho údaje", "čtení nahlas ostatním"],
    hints: ["Zeptej se, proč čteš. Chceš si text zapamatovat, nebo si jen něco rychle najít?"],
    explanation: "Při studijním čtení jde o to text pochopit a udržet v hlavě, proto se čte pomalu, podtrhává a dělají se poznámky. Zábava ani rychlé vyhledání jeho cílem není.",
  },
  {
    question: "Co je věcné čtení?",
    correctAnswer: "hledání konkrétního údaje",
    options: [
      "čtení celé knihy pomalu",
      "hledání konkrétního údaje",
      "čtení kvůli zábavě",
      "hlasité čtení ve třídě",
    ],
    hints: ["Otvíráš jízdní řád. Přečteš ho celý, nebo tě zajímá jen jeden řádek?"],
    explanation: "Věcné čtení má praktický cíl: najít v textu určitou informaci. Zbytek textu se přeskočí, protože ho ke splnění úkolu nepotřebuješ.",
  },
  {
    question: "Ve které situaci použijeme studijní čtení?",
    correctAnswer: "příprava na test",
    options: ["hledání spoje v jízdním řádu", "čtení horoskopu v časopise", "příprava na test", "prohlížení letáku se slevami"],
    hints: ["Ve třech případech ti stačí přelétnout text očima. V jednom si ho musíš zapamatovat."],
    explanation: "Na test potřebuješ látku pochopit a udržet v paměti, což vyžaduje pomalé čtení s poznámkami. V ostatních případech hledáš jen konkrétní údaj.",
  },
  {
    question: "Ve které situaci použijeme věcné čtení?",
    correctAnswer: "hledání otevírací doby",
    options: ["příprava na velkou zkoušku", "čtení románu pro pobavení", "studium celé encyklopedie", "hledání otevírací doby"],
    hints: ["Kdy ti stačí najít jediný údaj a text pak zavřít?"],
    explanation: "Otevírací dobu si najdeš během chvilky a zbytek textu tě nezajímá — to je přesně věcné čtení. Zkouška i studium vyžadují čtení studijní.",
  },
  {
    question: "Co jsou poznámky při studijním čtení?",
    correctAnswer: "zápis klíčových myšlenek",
    options: ["zápis klíčových myšlenek", "opis celého textu", "zvýraznění hezkých vět", "seznam všech slov textu"],
    hints: ["Kdyby poznámky byly stejně dlouhé jako text, k čemu by ti byly?"],
    explanation: "Dobré poznámky zachytí jen podstatné myšlenky, ideálně vlastními slovy. Opis celého textu by ti při opakování nijak nepomohl.",
  },
  {
    question: "Proč je při studijním čtení důležité dělat si poznámky?",
    correctAnswer: "pomáhají zapamatovat obsah",
    options: [
      "prodlužují dobu čtení",
      "pomáhají zapamatovat obsah",
      "nahrazují čtení textu",
      "nemají žádný užitek",
    ],
    hints: ["Co se stane v hlavě, když musíš myšlenku přeformulovat a napsat?"],
    explanation: "Když látku zapisuješ vlastními slovy, musíš jí nejdřív porozumět — a právě to ji ukotví v paměti. Poznámky ale čtení nenahrazují.",
  },
  {
    question: "Co je přehledové čtení?",
    correctAnswer: "rychlé přehlédnutí textu",
    options: ["pomalé studijní čtení", "hledání jednoho údaje", "rychlé přehlédnutí textu", "hlasité čtení ostatním"],
    hints: ["Vezmeš knihu a chceš za minutu vědět, o čem je. Co uděláš?"],
    explanation: "Přehledové čtení znamená projet nadpisy, obrázky a shrnutí, aby sis udělal obrázek o celku. Podrobnosti se přitom vynechávají.",
  },
  {
    question: "Co je vyhledávací čtení?",
    correctAnswer: "rychlé hledání údaje",
    options: ["pomalé čtení celého textu", "čtení kvůli zábavě", "učení se nazpaměť", "rychlé hledání údaje"],
    hints: ["Přejíždíš očima po stránce a hledáš jedno číslo. Zbytek textu ani nečteš."],
    explanation: "Při vyhledávacím čtení oči přejíždějí text a hledají konkrétní slovo, jméno nebo číslo. Souvislý obsah se přitom nesleduje.",
  },
  {
    question: "V jízdním řádu hledáš spoj ve 14:30. Co uděláš?",
    correctAnswer: "projedu časy a najdu spoj",
    options: ["projedu časy a najdu spoj", "přečtu celý jízdní řád", "zavolám na informace", "přečtu jen první stránku"],
    hints: ["Jízdní řád je tabulka čísel. Co v ní hledáš a co můžeš klidně přeskočit?"],
    explanation: "Hledáš jediný údaj, takže projedeš sloupec s časy a ostatní přeskočíš. Číst celý jízdní řád by byla zbytečná práce.",
  },
  {
    question: "Jaký typ čtení zvolíš při přípravě referátu o Egyptě?",
    correctAnswer: "studijní čtení s výpisky",
    options: [
      "hledání jediného údaje",
      "studijní čtení s výpisky",
      "čtení kvůli zábavě",
      "rychlé přehlédnutí textu",
    ],
    hints: ["Referát vyžaduje, abys hodně informací pochopil do hloubky a zapamatoval si je — stačí k tomu rychlé vyhledání jednoho údaje?"],
    explanation: "Referát musíš pochopit natolik, abys ho dokázal odvyprávět, což znamená pomalé čtení a výpisky. Jediný údaj by ti na celé vystoupení nestačil.",
  },
  {
    question: "Jak se liší studijní a věcné čtení v rychlosti?",
    correctAnswer: "studijní je pomalejší",
    options: ["věcné je pomalejší", "obojí je stejně rychlé", "studijní je pomalejší", "záleží jen na délce"],
    hints: ["U kterého z nich se musíš u každé věty zastavit a promyslet ji?"],
    explanation: "Studijní čtení jde pomalu, protože text zpracováváš a zapisuješ. Věcné může být rychlé, protože většinu textu přeskočíš.",
  },
  {
    question: "Hledáš na webu recept na koláč. Jaký typ čtení zvolíš?",
    correctAnswer: "věcné čtení",
    options: ["studijní čtení", "přehledové čtení", "čtení nahlas", "věcné čtení"],
    hints: ["Potřebuješ pochopit a zapamatovat si celý text, nebo jen najít konkrétní údaje o surovinách a postupu?"],
    explanation: "Z receptu potřebuješ suroviny a kroky, ne pochopení celé stránky. Vyhledáš si tedy jen ty části a zbytek přeskočíš.",
  },
  {
    question: "Co podtrháváme při studijním čtení?",
    correctAnswer: "klíčové pojmy a fakta",
    options: ["klíčové pojmy a fakta", "úplně každou větu", "vůbec nic nepodtrháváme", "jen nadpisy kapitol"],
    hints: ["Kdyby byl podtržený celý text, poznal bys při opakování, co je nejdůležitější?"],
    explanation: "Podtrhává se jen to podstatné — pojmy, definice, klíčová čísla. Podtržený celý odstavec ztrácí smysl, protože nic nezvýrazňuje.",
  },
  {
    question: "Proč je věcné čtení výhodné pro konkrétní úkoly?",
    correctAnswer: "nemusím číst celý text",
    options: [
      "text je tím delší",
      "nemusím číst celý text",
      "čte se pomaleji",
      "nepotřebuji přemýšlet",
    ],
    hints: ["V čem ti pomůže, když víš přesně, co hledáš?"],
    explanation: "Když máš jasný cíl, projdeš jen tu část textu, kde odpověď čekáš. Ušetříš tím čas, který bys strávil čtením nepotřebného.",
  },
  {
    question: "Jaký typ čtení použiješ, když hledáš ve slovníku význam neznámého slova?",
    correctAnswer: "vyhledávací",
    options: ["studijní", "přehledové", "vyhledávací", "hlasité"],
    hints: ["Potřebuješ přečíst celý slovník od začátku, nebo jen najít a přečíst jedno konkrétní heslo?"],
    explanation: "Ve slovníku hledáš jediné heslo, které najdeš podle abecedy. Ostatní hesla přitom vůbec nečteš.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Chceš se naučit článek o fotosyntéze na test. Jaký postup zvolíš?",
    correctAnswer: "pomalu, podtrhat, výpisky",
    options: ["přehlédnout jen nadpisy", "přečíst první věty odstavců", "přečíst jednou rychle", "pomalu, podtrhat, výpisky"],
    hints: ["Na test musíš informace pochopit a dlouhodobě si je zapamatovat — stačí k tomu rychlé přelétnutí nadpisů?"],
    explanation: "Učení vyžaduje pomalé čtení, zvýraznění podstatného a vlastní zápis. Rychlé přelétnutí by ti dalo jen hrubou představu, ne znalost.",
  },
  {
    question: "Hledáš, ve které kapitole učebnice jsou zlomky. Jak postupuješ?",
    correctAnswer: "podívám se do obsahu",
    options: ["podívám se do obsahu", "přečtu celou učebnici", "zeptám se kamaráda", "listuji od konce"],
    hints: ["Nemusíš číst celou učebnici, abys našel jednu kapitolu — jaký nástroj v knize ti pomůže rychle najít stránku?"],
    explanation: "Obsah a rejstřík jsou v knize právě proto, aby se dala najít konkrétní kapitola. Listování ani čtení celé učebnice by trvalo mnohem déle.",
  },
  {
    question: "Jaký je účel opakovaného čtení při studiu?",
    correctAnswer: "upevní zapamatování",
    options: [
      "prodlouží jen studium",
      "upevní zapamatování",
      "zhorší porozumění",
      "nemá žádný smysl",
    ],
    hints: ["Co si pamatuješ líp — písničku, kterou jsi slyšel jednou, nebo tu, kterou znáš zpaměti?"],
    explanation: "Při druhém a třetím čtení si všimneš souvislostí, které ti poprvé unikly, a látka se ukotví. Proto se opakování při učení vyplácí.",
  },
  {
    question: "Jakou techniku použiješ při čtení obtížného textu?",
    correctAnswer: "shrnu odstavec vlastními slovy",
    options: ["přečtu jen nadpisy", "přečtu text jednou rychle", "shrnu odstavec vlastními slovy", "přeskočím těžké části"],
    hints: ["Jak si ověříš, že jsi odstavci opravdu rozuměl, ještě než přejdeš k dalšímu?"],
    explanation: "Když odstavec shrneš vlastními slovy, hned poznáš, jestli jsi mu porozuměl. Přeskakování těžkých míst potíž jen odloží.",
  },
  {
    question: "Proč se doporučuje při studijním čtení zastavovat a přemýšlet?",
    correctAnswer: "lépe porozumím a zapamatuji",
    options: ["šetřím tím čas", "text je tím kratší", "je to jen zvyk", "lépe porozumím a zapamatuji"],
    hints: ["Jaký je rozdíl mezi tím, když text jen projedeš očima, a když se u něj zastavíš?"],
    explanation: "Pauza dá mozku čas propojit novou informaci s tím, co už víš. Bez zastavení text spíš proletíš, aniž by v tobě něco zůstalo.",
  },
  {
    question: "Jaký typ čtení je nejlepší, když v textu hledáš jméno osoby?",
    correctAnswer: "vyhledávací čtení",
    options: ["vyhledávací čtení", "studijní čtení", "opakované čtení", "hlasité čtení"],
    hints: ["Jméno začíná velkým písmenem a v textu vyčnívá. Musíš kvůli němu číst věty?"],
    explanation: "Jméno je konkrétní cíl, takže stačí přejíždět očima po stránce, dokud nevyskočí. Číst přitom celé věty by bylo zbytečné.",
  },
  {
    question: "Co jsou výpisky?",
    correctAnswer: "stručný zápis klíčových bodů",
    options: [
      "opis celého textu",
      "stručný zápis klíčových bodů",
      "seznam všech nadpisů",
      "překlad textu do češtiny",
    ],
    hints: ["Mají ti při opakování ušetřit práci. Jak dlouhé tedy musí být?"],
    explanation: "Výpisky zkracují text na podstatné body, aby se z nich dalo opakovat. Kdyby obsahovaly všechno, nebyly by k ničemu.",
  },
  {
    question: "Hledáš informaci v encyklopedii. Jak postupuješ?",
    correctAnswer: "najdu heslo v rejstříku",
    options: ["přečtu celou encyklopedii", "přečtu jen předmluvu", "najdu heslo v rejstříku", "listuji náhodně stránkami"],
    hints: ["Chceš přečíst celou encyklopedii, nebo jen vyhledat jedno konkrétní heslo?"],
    explanation: "Encyklopedie je uspořádaná tak, aby se v ní hledalo podle rejstříku nebo abecedy. Náhodné listování by trvalo neúměrně dlouho.",
  },
  {
    question: "Jaké je dobré pořadí kroků při studijním čtení?",
    correctAnswer: "přehled, čtení, shrnutí",
    options: ["shrnutí, přehled, čtení", "čtení, přehled, shrnutí", "na pořadí nezáleží", "přehled, čtení, shrnutí"],
    hints: ["Co ti pomůže dřív — vědět, o čem text bude, nebo si to shrnout? A kdy se to shrnutí dá udělat?"],
    explanation: "Nejdřív si uděláš hrubý přehled, pak čteš podrobně a nakonec si obsah shrneš. Shrnout text před přečtením logicky nejde.",
  },
  {
    question: "Na webu školy hledáš telefon do jídelny. Co uděláš?",
    correctAnswer: "najdu kontakty a přečtu číslo",
    options: ["najdu kontakty a přečtu číslo", "přečtu celou stránku", "přečtu si aktuality", "prohlédnu fotogalerii"],
    hints: ["Webové stránky mají nabídku s odkazy. Který z nich tě dovede nejrychleji k cíli?"],
    explanation: "Stránky jsou rozdělené do sekcí právě proto, aby se dal údaj najít rychle. Číst celý web kvůli jednomu číslu nedává smysl.",
  },
  {
    question: "Co je myšlenková mapa?",
    correctAnswer: "grafický přehled vztahů pojmů",
    options: [
      "náčrtek postav z textu",
      "grafický přehled vztahů pojmů",
      "seznam všech slov textu",
      "barevné zvýraznění vět",
    ],
    hints: ["Není to seznam ani obrázek. Co v ní kromě pojmů uvidíš navíc?"],
    explanation: "Myšlenková mapa zapisuje pojmy a spojuje je čarami podle toho, jak spolu souvisejí. Díky tomu je vidět struktura celého tématu naráz.",
  },
  {
    question: "Proč je dobré nejdřív přehlédnout nadpisy a až pak číst podrobně?",
    correctAnswer: "získám přehled o struktuře",
    options: ["ušetřím čas na čtení", "nemusím číst vůbec", "získám přehled o struktuře", "nadpisy jsou nejdůležitější"],
    hints: ["Co ti při podrobném čtení pomůže, když už předem tušíš, jak je text uspořádaný?"],
    explanation: "Když znáš rozvržení textu, víš při čtení, kam která informace patří, a snáz se v ní orientuješ. Podrobné čtení tím ale nenahradíš.",
  },
  {
    question: "Jaký typ čtení zvolíš, když chceš posoudit, zda je text pro tebe užitečný?",
    correctAnswer: "přehledové čtení",
    options: ["studijní čtení", "vyhledávací čtení", "hlasité čtení", "přehledové čtení"],
    hints: ["Ještě nevíš, jestli text vůbec budeš potřebovat. Vyplatí se do něj hned investovat hodinu?"],
    explanation: "Rychlé přehlédnutí ti během chvilky ukáže, o čem text je a jestli má smysl číst ho pořádně. Studijní čtení by u nepotřebného textu bylo plýtvání časem.",
  },
  {
    question: "Jaký typ čtení zvolíš pro zábavný román před spaním?",
    correctAnswer: "čtení pro zábavu",
    options: ["čtení pro zábavu", "studijní čtení s výpisky", "vyhledávací čtení", "opakované čtení"],
    hints: ["Budeš z románu zkoušený? Podle toho poznáš, jestli si musíš dělat poznámky."],
    explanation: "Román čteš kvůli prožitku, ne kvůli zapamatování, takže poznámky ani podtrhávání nepotřebuješ. Volíš tempo, které ti vyhovuje.",
  },
  {
    question: "K čemu jsou při vyhledávání v textu nadpisy a tučná slova?",
    correctAnswer: "navedou mě na správné místo",
    options: [
      "vždy zpomalí čtení",
      "navedou mě na správné místo",
      "nemají žádný význam",
      "nahrazují celý text",
    ],
    hints: ["Proč autor některá slova zvýraznil? Komu tím chtěl pomoct?"],
    explanation: "Nadpisy a zvýrazněná slova fungují jako ukazatele — napoví, kde v textu hledanou informaci čekat. Samotný obsah ale nenahrazují.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je kritické čtení?",
    correctAnswer: "hodnotím, zda je to pravda",
    options: ["učím se text nazpaměť", "hledám jediný údaj", "hodnotím, zda je to pravda", "čtu jen kvůli zábavě"],
    hints: ["Při studijním čtení text přijímáš. Co děláš navíc, když mu tak úplně nevěříš?"],
    explanation: "Kritický čtenář se ptá, odkud autor informaci má a jestli dává smysl. Nejde jen o zapamatování obsahu, ale o jeho posouzení.",
  },
  {
    question: "Co znamená prohlédnout si text ještě před čtením?",
    correctAnswer: "prohlédnu nadpisy a obrázky",
    options: ["přečtu jen první větu", "přečtu poslední odstavec", "přečtu text dvakrát", "prohlédnu nadpisy a obrázky"],
    hints: ["Než se do textu pustíš, chceš vědět, co tě čeká. Čeho si na stránce všimneš nejdřív?"],
    explanation: "Nadpisy, obrázky a shrnutí ti během chvilky prozradí, o čem text bude a jak je uspořádaný. Vlastní čtení pak jde snáz.",
  },
  {
    question: "Jak se liší věcné a výběrové čtení?",
    correctAnswer: "věcné hledá jeden údaj",
    options: ["věcné hledá jeden údaj", "výběrové hledá jeden údaj", "obojí znamená totéž", "liší se jen rychlostí"],
    hints: ["Jedno z nich míří na jedinou informaci, druhé čte celé vybrané části. Které je které?"],
    explanation: "Věcné čtení míří na konkrétní údaj a zbytek ignoruje. Při výběrovém čteš celé vybrané pasáže a jiné vynecháváš.",
  },
  {
    question: "Proč je důležité vybrat správný typ čtení?",
    correctAnswer: "jiný cíl, jiný postup",
    options: [
      "typ čtení nehraje roli",
      "jiný cíl, jiný postup",
      "rozhoduje délka textu",
      "vždy je nejlepší studijní",
    ],
    hints: ["Vyplatí se dělat si výpisky z detektivky? A přelétnout očima učebnici před testem?"],
    explanation: "Každý cíl vyžaduje jiný postup — na test se čte pomalu, jízdní řád se prohledá. Použít studijní čtení všude by znamenalo ztrácet čas.",
  },
  {
    question: "K čemu je dobré si po studijním čtení látku zopakovat?",
    correctAnswer: "ukáže, co ještě neumím",
    options: ["jen prodlouží učení", "zhorší zapamatování", "ukáže, co ještě neumím", "nemá žádný smysl"],
    hints: ["Když si po přečtení zkusíš látku vybavit bez textu, co se dozvíš?"],
    explanation: "Při opakování se ukáže, která místa ti ještě nesedí, a můžeš se k nim vrátit. Bez toho bys žil v domnění, že umíš všechno.",
  },
  {
    question: "Co je aktivní čtení?",
    correctAnswer: "čtu, ptám se a zapisuji",
    options: ["čtu nahlas a rychle", "jen přeletím nadpisy", "čtu bez přemýšlení", "čtu, ptám se a zapisuji"],
    hints: ["Slovo 'aktivní' napovídá, že u toho něco děláš. Co konkrétně?"],
    explanation: "Aktivní čtenář si u textu klade otázky, hledá souvislosti a zapisuje si. Text tak zpracovává, místo aby ho jen očima přejel.",
  },
  {
    question: "Proč je dobré ověřit si informaci ve druhém zdroji?",
    correctAnswer: "jeden zdroj se může mýlit",
    options: ["jeden zdroj se může mýlit", "dva texty se čtou rychleji", "je to školní povinnost", "druhý zdroj bývá kratší"],
    hints: ["Co když se autor spletl nebo měl zastaralé údaje? Jak to zjistíš?"],
    explanation: "Když dva nezávislé texty tvrdí totéž, roste šance, že je to pravda. Rozpor mezi nimi je naopak signál, že je potřeba hledat dál.",
  },
  {
    question: "Proč u věcného textu sledujeme datum vydání?",
    correctAnswer: "starší údaje mohou být neplatné",
    options: [
      "datum nehraje žádnou roli",
      "starší údaje mohou být neplatné",
      "starší text bývá kratší",
      "je to jen formalita",
    ],
    hints: ["Počet obyvatel města nebo ceny se rok od roku mění. Co to znamená pro starou knihu?"],
    explanation: "Údaje jako počty obyvatel, ceny nebo vědecké poznatky se mění. Text starý dvacet let proto může uvádět čísla, která už neplatí.",
  },
  {
    question: "Co znamená psát si poznámky na okraj textu?",
    correctAnswer: "zapisuji si postřehy k textu",
    options: ["opisuji si text na okraj", "překládám text do češtiny", "zapisuji si postřehy k textu", "kreslím si tam obrázky"],
    hints: ["Poznámka na okraji má stát hned vedle místa, kterého se týká. Co v ní tedy bude?"],
    explanation: "Na okraj se píše vlastní komentář, otázka nebo shrnutí odstavce. Při opakování hned vidíš, co tě na daném místě napadlo.",
  },
  {
    question: "Jak číst text, u kterého si nejsi jistý, zda mluví pravdu?",
    correctAnswer: "studijně i kriticky",
    options: ["jen rychle přehlédnout", "jen vyhledat jeden údaj", "číst jako román", "studijně i kriticky"],
    hints: ["Nestačí text pochopit. Co s ním musíš udělat navíc?"],
    explanation: "U pochybného textu je potřeba obsah nejen pochopit, ale i posoudit — kdo ho napsal, odkud čerpal a zda si neodporuje.",
  },
  {
    question: "Jak poznáš, že jsi text opravdu pochopil?",
    correctAnswer: "dokážu ho převyprávět",
    options: ["dokážu ho převyprávět", "přečetl jsem ho celý", "trvalo mi to dlouho", "podtrhal jsem hodně vět"],
    hints: ["Zavři knihu a zkus někomu říct, co v ní bylo. Co ti to prozradí?"],
    explanation: "Převyprávění vlastními slovy je nejspolehlivější zkouška porozumění. Přečíst text celý nebo ho podtrhat ještě neznamená rozumět mu.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const STUDIJNICTENIAVECNECTENI: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-studijni-cteni-a-vecne-cteni",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-studijni-cteni-a-vecne-cteni",
    title: "Studijní čtení a věcné čtení",
    studentTitle: "Jak číst texty",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení a naslouchání",
    briefDescription: "Naučíš se číst studijně i věcně – pro různé účely.",
    keywords: ["studijní čtení", "věcné čtení", "přehledové čtení", "vyhledávací čtení", "poznámky", "výpisky"],
    goals: [
      "Rozlišit studijní a věcné čtení",
      "Vybrat správný typ čtení pro situaci",
      "Použít techniky efektivního čtení (podtrhávání, výpisky)",
    ],
    boundaries: [
      "Bez pokročilé teorie čtenářských strategií",
      "Neprobíráme akademické citace",
      "Rozšiřující nad rámec RVP 5. ročníku: kritické čtení a ověřování zdrojů v úrovni 3",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Studijní čtení = pomalu, podtrhávám, dělám poznámky – učím se. Věcné čtení = hledám konkrétní informaci, přeskočím zbytek.",
      steps: [
        "Zjisti, proč čteš – co potřebuješ vědět nebo najít.",
        "Učíš se? → studijní čtení (pomalu, poznámky).",
        "Hledáš konkrétní údaj? → věcné čtení (cíleně, rychleji).",
        "Chceš přehled? → přehledové čtení (prohlédni nadpisy).",
      ],
      commonMistake: "Žáci čtou vždy stejně – vždy studijně nebo vždy rychle. Správný typ čtení závisí na cíli.",
      example: "Příprava na test z dějepisu = studijní čtení. Hledání spoje v jízdním řádu = věcné čtení.",
    },
  },
];
