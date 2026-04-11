import type { TopicMetadata, HelpData } from "../../types";
import { mapQPoolToTasks, type QPool } from "../helpers";

const CR_QUESTIONS: QPool[] = [
  { question: "🏛️ Jak se jmenuje hlavní město České republiky?", correct: "Praha", options: ["Praha", "Brno", "Ostrava", "Plzeň"], hints: ["Je to největší město v ČR a sídlí tam prezident.", "Na Pražském hradě sídlí hlava státu."] },
  { question: "🇨🇿 Jaké barvy má česká vlajka?", correct: "Bílá, červená a modrá", options: ["Bílá, červená a modrá", "Bílá a červená", "Modrá a žlutá", "Červená a zelená"], hints: ["Česká vlajka má tři barvy. Modrý klín je vlevo.", "Nahoře bílý pruh, dole červený a vlevo modrý trojúhelník."] },
  { question: "🦁 Co je na státním znaku České republiky?", correct: "Dvouocasý lev", options: ["Dvouocasý lev", "Orel", "Medvěd", "Vlk"], hints: ["Je to zvíře se dvěma ocasy. Jaké?", "Český lev má korunku a DVA ocasy."] },
  { question: "🎵 Jak začíná česká hymna?", correct: "Kde domov můj", options: ["Kde domov můj", "Nad Tatrou sa blýská", "Hej Slované", "Ach synku"], hints: ["Hymna se ptá na domov. Jak ta otázka zní?", "Kde domov můj, kde domov můj…"] },
  { question: "💰 Jakou měnou platíme v České republice?", correct: "Česká koruna (Kč)", options: ["Česká koruna (Kč)", "Euro (€)", "Dolar ($)", "Libra (£)"], hints: ["V Česku neplatíme eurem. Jak se jmenuje naše měna?", "Koruny a haléře — česká koruna."] },
  { question: "🏔️ Jak se jmenuje nejvyšší hora České republiky?", correct: "Sněžka", options: ["Sněžka", "Praděd", "Říp", "Ještěd"], hints: ["Je v Krkonoších a měří 1603 m.", "Nejvyšší hora ČR má sníh i v létě — proto se jmenuje…"] },
  { question: "🗺️ Ve které části Evropy leží Česká republika?", correct: "Ve střední Evropě", options: ["Ve střední Evropě", "V západní Evropě", "Ve východní Evropě", "V jižní Evropě"], hints: ["ČR leží uprostřed Evropy. Jak se ta část jmenuje?", "Není to západ ani východ, ale…"] },
  { question: "🤝 Která země sousedí s ČR na východě?", correct: "Slovensko", options: ["Slovensko", "Polsko", "Rakousko", "Německo"], hints: ["Na východ od ČR je země, se kterou jsme dříve tvořili jeden stát.", "Dříve to bylo Československo. Jaká země je na východě?"] },
  // Nové otázky
  { question: "🏛️ Kdo je hlava státu v České republice?", correct: "Prezident", options: ["Prezident", "Král", "Starosta", "Učitel"], hints: ["Hlava státu sídlí na Pražském hradě. Kdo to je?", "V České republice je hlavou státu prezident."] },
  { question: "🇨🇿 Kolik sousedních zemí má Česká republika?", correct: "4", options: ["4", "3", "5", "6"], hints: ["Německo, Polsko, Slovensko a… která je čtvrtá?", "ČR sousedí se 4 zeměmi: Německo, Polsko, Slovensko, Rakousko."] },
  { question: "🏔️ Jak se jmenuje pohoří, kde je Sněžka?", correct: "Krkonoše", options: ["Krkonoše", "Šumava", "Beskydy", "Jeseníky"], hints: ["Nejvyšší hora ČR je v tomto pohoří na severu.", "Krkonoše jsou nejvyšší české hory — leží na hranici s Polskem."] },
  { question: "🌊 Jaká velká řeka protéká Prahou?", correct: "Vltava", options: ["Vltava", "Labe", "Morava", "Odra"], hints: ["Tato řeka je nejdelší v ČR a teče přes hlavní město.", "Karlův most stojí přes tuto řeku."] },
  { question: "🏙️ Které je druhé největší město v ČR?", correct: "Brno", options: ["Brno", "Ostrava", "Plzeň", "Olomouc"], hints: ["Je to hlavní město Moravy.", "Brno leží na jihu Moravy a je druhé největší."] },
  { question: "🇨🇿 Kdy slavíme Den vzniku ČR?", correct: "1. ledna", options: ["1. ledna", "28. října", "17. listopadu", "5. července"], hints: ["Česká republika vznikla 1. 1. 1993.", "Na Nový rok 1993 vznikla samostatná Česká republika."] },
  { question: "🎆 Co slavíme 28. října?", correct: "Vznik Československa", options: ["Vznik Československa", "Vánoce", "Velikonoce", "Den dětí"], hints: ["28. října 1918 se stalo něco důležitého pro náš stát.", "V tento den vzniklo Československo — předchůdce ČR."] },
  { question: "🌲 Jak se jmenuje pohoří na jihozápadě ČR?", correct: "Šumava", options: ["Šumava", "Krkonoše", "Beskydy", "Jeseníky"], hints: ["Toto pohoří je na hranici s Německem a Rakouskem.", "Šumava je známá hustými lesy a Černým jezerem."] },
];

const HELP_CR: HelpData = {
  hint: "ČR má hlavní město Prahu, vlajku s bílou, červenou a modrou, a hymnu Kde domov můj.",
  steps: ["Přečti otázku — týká se vlajky, hymny, měny, nebo geografie?", "Vzpomeň si na základní fakta o ČR.", "Vyber správnou odpověď."],
  commonMistake: "Česká vlajka má TŘI barvy (bílá, červená, modrá), ne dvě!",
  example: "🏛️ Hlavní město ČR → Praha ✅",
  visualExamples: [{ label: "Základní fakta o ČR", illustration: "🏛️ Hlavní město: Praha\n🇨🇿 Vlajka: bílá, červená, modrá\n🦁 Znak: dvouocasý lev\n🎵 Hymna: Kde domov můj\n💰 Měna: česká koruna (Kč)\n🏔️ Nejvyšší hora: Sněžka" }],
};

const TOWN_QUESTIONS: QPool[] = [
  { question: "🏫 Kam chodí děti do školy?", correct: "Do základní školy", options: ["Do základní školy", "Na úřad", "Na policii", "Do nemocnice"], hints: ["Děti se učí číst, psát a počítat. Kde?", "Škola je místo, kde se děti vzdělávají."] },
  { question: "🏥 Kam jdeš, když jsi nemocný?", correct: "K lékaři nebo do nemocnice", options: ["K lékaři nebo do nemocnice", "Na poštu", "Do knihovny", "Na úřad"], hints: ["Když tě něco bolí, kdo ti pomůže?", "Lékaři pracují v ordinaci nebo v nemocnici."] },
  { question: "📮 Kam doneseš dopis, aby ho pošťák doručil?", correct: "Na poštu", options: ["Na poštu", "Do školy", "Na úřad", "Do obchodu"], hints: ["Dopisy a balíky se posílají odkud?", "Na poště můžeš poslat dopis, balík a koupit známku."] },
  { question: "👨‍💼 Kdo řídí obec?", correct: "Starosta", options: ["Starosta", "Učitel", "Policista", "Lékař"], hints: ["Obec má svého vedoucího. Jak se mu říká?", "Starosta rozhoduje o důležitých věcech v obci."] },
  { question: "🚒 Koho zavoláš, když hoří?", correct: "Hasiče (150)", options: ["Hasiče (150)", "Policii (158)", "Záchranku (155)", "Poštu"], hints: ["Při požáru potřebuješ někoho s hadicí a žebříkem.", "Hasiči hasí oheň. Jejich číslo je 150."] },
  { question: "📚 Kde si můžeš půjčit knihy zdarma?", correct: "V knihovně", options: ["V knihovně", "V obchodě", "Na poště", "Ve škole"], hints: ["Je to místo plné knih, kam můžeš přijít a půjčit si je.", "V knihovně si půjčuješ knihy — a je to zadarmo."] },
  // Nové otázky
  { question: "🏪 Kde si koupíš potraviny?", correct: "V obchodě (supermarketu)", options: ["V obchodě (supermarketu)", "Na poště", "V knihovně", "Na úřadě"], hints: ["Chleba, mléko, ovoce — kde to koupíš?", "V obchodě nebo supermarketu prodávají potraviny."] },
  { question: "🏥 Kdo tě ošetří, když máš horečku?", correct: "Lékař", options: ["Lékař", "Starosta", "Knihovník", "Poštovní doručovatel"], hints: ["Když jsi nemocný, kdo tě vyšetří?", "Lékař (doktor) tě vyšetří a předepíše lék."] },
  { question: "🚌 Čím se dostaneš do školy, když je daleko?", correct: "Autobusem", options: ["Autobusem", "Letadlem", "Lodí", "Lanovkou"], hints: ["Hromadná doprava ve městě — čím jezdí děti?", "Autobus jezdí pravidelně a zastaví u školy."] },
  { question: "🏛️ Kde sídlí obecní úřad?", correct: "Na radnici", options: ["Na radnici", "V kostele", "V nemocnici", "Ve škole"], hints: ["Úřad, kde pracuje starosta. Jak se ta budova jmenuje?", "Radnice je budova, kde sídlí vedení obce."] },
  { question: "👮 Kdo dohlíží na bezpečnost v obci?", correct: "Policie", options: ["Policie", "Pošťák", "Učitel", "Lékař"], hints: ["Kdo řeší zločiny a dohlíží na pořádek?", "Policie chrání občany a udržuje bezpečnost."] },
  { question: "⛪ Co najdeme na náměstí v mnoha českých městech?", correct: "Kostel nebo kašnu", options: ["Kostel nebo kašnu", "Letiště", "Stadion", "Továrnu"], hints: ["Náměstí je centrum města. Co tam obvykle stojí?", "Na náměstí bývá kostel, kašna, radnice, socha…"] },
  { question: "🌳 Kam jdeš odpočívat do přírody ve městě?", correct: "Do parku", options: ["Do parku", "Na úřad", "Na poštu", "Do obchodu"], hints: ["Ve městě je místo se stromy, lavičkami a trávou.", "Park je zelená plocha ve městě pro odpočinek."] },
  { question: "💊 Kde koupíš léky?", correct: "V lékárně", options: ["V lékárně", "V obchodě", "Na poště", "Ve škole"], hints: ["Léky nekoupíš v běžném obchodě. Kam pro ně zajdeš?", "Lékárna prodává léky a je tam lékárník."] },
];

const HELP_TOWN: HelpData = {
  hint: "V obci najdeš školu, poštu, úřad, nemocnici, policii, hasiče a knihovnu.",
  steps: ["Přečti otázku — o jaké službě nebo budově se mluví?", "Vzpomeň si, co v té budově lidé dělají.", "Vyber správnou odpověď."],
  commonMistake: "Starosta řídí obec, ne ředitel — ředitel řídí školu!",
  example: "👨‍💼 Kdo řídí obec? → Starosta ✅",
  visualExamples: [{ label: "Důležitá místa v obci", illustration: "🏫 Škola — vzdělávání\n🏥 Nemocnice — zdraví\n📮 Pošta — dopisy, balíky\n🏛️ Úřad — starosta\n🚒 Hasiči — 150\n👮 Policie — 158\n📚 Knihovna — knihy zdarma" }],
};

const FAMILY_QUESTIONS: QPool[] = [
  { question: "👨‍👩‍👧‍👦 Kdo patří do rodiny?", correct: "Rodiče, děti, prarodiče", options: ["Rodiče, děti, prarodiče", "Jen kamarádi", "Jen spolužáci", "Jen sousedé"], hints: ["Rodina = lidé, kteří k sobě patří. Kdo to je?", "Maminka, tatínek, děti, babička, dědeček…"] },
  { question: "🤝 Jak se chováme ke starším lidem?", correct: "S úctou a respektem", options: ["S úctou a respektem", "Ignorujeme je", "Křičíme na ně", "Utečeme"], hints: ["Starší lidé si zaslouží slušné chování. Jak se říká?", "Chováme se k nim s úctou — pozdravíme, pomůžeme."] },
  { question: "🙋 Co uděláš, když potkáš souseda?", correct: "Pozdravím", options: ["Pozdravím", "Utečím", "Nic", "Zakřičím"], hints: ["Slušný člověk pozdraví. Co řekneš?", "Dobrý den! — to je základní pravidlo slušnosti."] },
  { question: "😡 Co uděláš, když se pohádáš s kamarádem?", correct: "Omluvím se a zkusím to vyřešit", options: ["Omluvím se a zkusím to vyřešit", "Uhodím ho", "Přestanu s ním mluvit navždy", "Řeknu to učitelce"], hints: ["Hádky se stávají. Co je nejlepší udělat?", "Omluva a rozhovor pomohou víc než křik nebo mlčení."] },
  { question: "🏠 Jak můžeš doma pomáhat?", correct: "Uklidit si pokoj, pomoci s nádobím", options: ["Uklidit si pokoj, pomoci s nádobím", "Nic nedělat", "Jen se dívat na televizi", "Odejít ven"], hints: ["Doma má každý své úkoly. Co můžeš udělat ty?", "Úklid pokoje, pomoc s nádobím — to jsou věci, které zvládneš."] },
  { question: "🎂 Proč slavíme narozeniny?", correct: "Oslavujeme, že se někdo narodil", options: ["Oslavujeme, že se někdo narodil", "Protože dostaneme dort", "Protože nemusíme do školy", "Nemá to důvod"], hints: ["Narozeniny připomínají den, kdy se člověk narodil.", "Je to oslava života — proto gratulujeme a dáváme dárky."] },
  // Nové otázky
  { question: "🙏 Co řekneš, když ti někdo něco dá?", correct: "Děkuji", options: ["Děkuji", "Nic", "Dej mi víc", "To nechci"], hints: ["Slušný člověk poděkuje. Jaké kouzelné slovo to je?", "Děkuji — základní pravidlo slušnosti."] },
  { question: "🙋 Co řekneš, když něco chceš?", correct: "Prosím", options: ["Prosím", "Dej mi to!", "Chci to!", "Nic"], hints: ["Slušná žádost začíná jedním slovem…", "Prosím — když chceš něco poprosit."] },
  { question: "👵 Kdo jsou prarodiče?", correct: "Babička a dědeček", options: ["Babička a dědeček", "Bratranec a sestřenice", "Teta a strýc", "Rodiče"], hints: ["Rodiče tvých rodičů — kdo to je?", "Babička a dědeček = prarodiče."] },
  { question: "🎓 Co je povinností každého dítěte?", correct: "Chodit do školy", options: ["Chodit do školy", "Pracovat", "Řídit auto", "Nakupovat"], hints: ["Každé dítě v Česku musí od 6 let dělat jednu důležitou věc.", "Školní docházka je povinná — děti musí chodit do školy."] },
  { question: "🗳️ Co je demokracie?", correct: "Lidé rozhodují volbami", options: ["Lidé rozhodují volbami", "Rozhoduje jeden člověk", "Rozhoduje počasí", "Nikdo nerozhoduje"], hints: ["V demokracii mají lidé právo volit. Co to znamená?", "Demo = lid, kracie = vláda. Lidé si volí své zástupce."] },
  { question: "📜 Jaká práva mají děti?", correct: "Právo na vzdělání, hru a ochranu", options: ["Právo na vzdělání, hru a ochranu", "Žádná práva", "Jen právo na jídlo", "Jen právo pracovat"], hints: ["Děti mají svá speciální práva. Jaká?", "Každé dítě má právo chodit do školy, hrát si a být chráněno."] },
  { question: "🏠 Proč je důležité dodržovat pravidla doma?", correct: "Aby se všem žilo dobře", options: ["Aby se všem žilo dobře", "Aby rodiče nebyli naštvaní", "Pravidla nejsou důležitá", "Je to jedno"], hints: ["Pravidla pomáhají, aby rodina fungovala. Proč?", "Když dodržujeme pravidla, všichni se cítí bezpečně a dobře."] },
  { question: "🤝 Co znamená spolupráce?", correct: "Pracujeme společně na jednom cíli", options: ["Pracujeme společně na jednom cíli", "Každý pracuje sám", "Nikdo nepracuje", "Jeden dělá vše"], hints: ["Spolupráce = spolupracujeme. Co to znamená?", "Když pracujeme společně a pomáháme si — to je spolupráce."] },
];

const HELP_FAMILY: HelpData = {
  hint: "Rodina je základ — patří sem rodiče, děti, prarodiče. Ke všem se chováme s úctou.",
  steps: ["Přečti otázku — o čem se mluví?", "Vzpomeň si na pravidla chování doma i venku.", "Vyber nejslušnější a nejrozumnější odpověď."],
  commonMistake: "Hádky se řeší rozhovorem a omluvou, ne bitkou nebo mlčením!",
  example: "🤝 Jak se chováme ke starším? → S úctou a respektem ✅",
  visualExamples: [{ label: "Pravidla chování", illustration: "🙋 Pozdrav → Dobrý den!\n🤝 Respekt → ke starším i mladším\n🙏 Omluva → když uděláš chybu\n🏠 Pomoc → doma i ve škole\n😊 Slušnost → prosím, děkuji" }],
};

export const SOCIETY_TOPICS: TopicMetadata[] = [
  { id: "pr-czech-republic", title: "Česká republika", subject: "prvouka", category: "Lidé a společnost", topic: "Naše země",
    topicDescription: "Poznáš základní fakta o České republice — hlavní město, vlajku, znak a hymnu.",
    briefDescription: "Naučíš se základní fakta o ČR: hlavní město, vlajku, znak, hymnu a měnu.",
    keywords: ["česká republika", "praha", "vlajka", "znak", "hymna", "česko", "koruna"],
    goals: ["Naučíš se základní státní symboly České republiky."],
    boundaries: ["Pouze základní fakta", "Žádná politika"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(CR_QUESTIONS), helpTemplate: HELP_CR },
  { id: "pr-town-services", title: "Obec a město", subject: "prvouka", category: "Lidé a společnost", topic: "Naše země",
    topicDescription: "Poznáš základní fakta o České republice — hlavní město, vlajku, znak a hymnu.",
    briefDescription: "Poznáš důležité budovy a služby v obci — poštu, úřad, nemocnici…",
    keywords: ["obec", "město", "starosta", "pošta", "nemocnice", "policie", "hasiči", "knihovna"],
    goals: ["Naučíš se, kdo a co je v obci důležité a kde najdeš pomoc."],
    boundaries: ["Pouze základní služby", "Žádná správní struktura"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(TOWN_QUESTIONS), helpTemplate: HELP_TOWN },
  { id: "pr-family-rules", title: "Rodina a pravidla chování", subject: "prvouka", category: "Lidé a společnost", topic: "Rodina a společnost",
    topicDescription: "Naučíš se o rodině, pravidlech chování, slušnosti a respektu.",
    briefDescription: "Naučíš se o rodině, respektu, slušném chování a řešení hádek.",
    keywords: ["rodina", "pravidla", "chování", "respekt", "slušnost", "pomoc doma"],
    goals: ["Naučíš se základy slušného chování a spolupráce v rodině i mezi kamarády."],
    boundaries: ["Pouze základní pravidla chování", "Žádné rodinné problémy"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(FAMILY_QUESTIONS), helpTemplate: HELP_FAMILY },
];
