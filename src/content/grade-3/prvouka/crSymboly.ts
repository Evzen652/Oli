import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Chybná možnost = konkrétní typická chyba + vysvětlení, proč právě ta nesedí. */
interface Chybna {
  o: string;
  why: string;
}

/**
 * Výběrová úloha s kompletní dokumentací (CONTENT_AUTHORING §0):
 * dvě vlastní nápovědy, vysvětlení PROČ a zpětná vazba u KAŽDÉ chybné možnosti.
 */
function q(
  question: string,
  correctAnswer: string,
  chybne: [Chybna, Chybna, Chybna],
  hints: [string, string],
  explanation: string,
): PracticeTask {
  const optionFeedback: Record<string, string> = {};
  for (const c of chybne) optionFeedback[c.o] = c.why;
  return {
    question,
    correctAnswer,
    options: shuffle([correctAnswer, ...chybne.map((c) => c.o)]),
    optionFeedback,
    hints,
    explanation,
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolovaná fakta (vlajka, znak, hymna, hlavní město,
//        hlava státu, komory parlamentu, svátky, počet sousedů)
//   L2 = aplikace: směr konkrétního souseda, přiřazení části znaku k zemi,
//        počty poslanců/senátorů zvlášť, autor slov/hudby hymny zvlášť,
//        hlavní město souseda → který stát
//   L3 = transfer (2 kroky): rozdíly let mezi historickými daty,
//        rozlišení blízkých dat (5. 7. vs 6. 7.), kombinace dvou faktů
//
// Opraveno 2026-09-12 (inventura obsahu): doplněna zpětná vazba u všech
// chybných možností, nápovědy odstupňované (velká je podrobnější a delší)
// a u porovnávacích úloh přeformulován klíč tak, aby nestál doslova v zadání.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  q(
    "Z jakých barevných pruhů se skládá vlajka České republiky?",
    "Bílý pruh nahoře, červený pruh dole a modrý klín vlevo",
    [
      {
        o: "Modrý pruh nahoře, bílý pruh dole a červený klín vlevo",
        why: "Barvy jsou prohozené. Modrá na naší vlajce netvoří vodorovný pruh, ale klín u žerdi.",
      },
      {
        o: "Červený pruh nahoře, bílý pruh dole a zelený klín vlevo",
        why: "Zelená barva na české vlajce vůbec není a světlejší pruh patří nahoru, tmavší dolů.",
      },
      {
        o: "Tři vodorovné pruhy: modrý, bílý, červený",
        why: "Tři samostatné vodorovné pruhy bez klínu má třeba vlajka Nizozemska. Naše vlajka klín má.",
      },
    ],
    [
      "Vlajka má dva vodorovné pruhy a k tomu klín, který zasahuje od okraje dovnitř.",
      "Rozhoduj ve dvou krocích. Nejdřív urči, který pruh je nahoře a který dole — světlejší barva patří vždy nad tmavší. Potom se podívej na klín u žerdi: má barvu, která se v žádném z vodorovných pruhů neopakuje.",
    ],
    "Vlajka České republiky má bílý pruh nahoře, červený pruh dole a modrý klín, který vychází z levého okraje. Bílá a červená pocházejí z českých zemských barev, modrý klín přibyl při vzniku Československa.",
  ),
  q(
    "Co znázorňuje velký státní znak České republiky?",
    "Českého lva, moravskou orlici a slezskou orlici",
    [
      {
        o: "Tři české lvy ve třech polích",
        why: "Ve znaku jsou čtyři pole a lev je jen ve dvou z nich. Zbylá dvě pole patří ptákům, ne lvům.",
      },
      {
        o: "Dvě orlice a jednoho orla",
        why: "Orel ve znaku není. Vedle dvou orlic je tam čtyřnohá šelma.",
      },
      {
        o: "Českého lva, polského orla a slovenský štít",
        why: "Polsko ani Slovensko do našeho znaku nepatří. Obě orlice zastupují historické země našeho státu.",
      },
    ],
    [
      "Velký státní znak má čtyři pole a představují se v nich tři historické země.",
      "Každá historická země má vlastní zvíře. Jedna z nich má ve znaku čtyřnohou šelmu, zbylé dvě ptáka s roztaženými křídly. Spočítej, kolik ptáků se na znaku objevuje, a podle toho vyřaď možnosti, které mluví o jiných zvířatech.",
    ],
    "Velký státní znak zobrazuje tři historické země: Čechy zastupuje bílý lev na červeném poli, Moravu stříbrno-červeně šachovaná orlice na modrém poli a Slezsko černá orlice se zlatou korunou na zlatém poli.",
  ),
  q(
    "Jak se jmenuje státní hymna České republiky?",
    "Kde domov můj",
    [
      { o: "Óda na radost", why: "Óda na radost je hymna Evropské unie, ne jednotlivého státu." },
      { o: "Má vlast", why: "Má vlast je cyklus symfonických básní Bedřicha Smetany. Hymnou se nikdy nestal." },
      { o: "Čechy krásné, Čechy mé", why: "Je to známá vlastenecká píseň, ale státní hymna to není." },
    ],
    [
      "Název hymny tvoří její první tři slova a celá věta je otázka.",
      "Zpívá se na začátku slavností a po sportovních vítězstvích. Její první věta je otázka po tom, kde leží náš rodný kraj — a právě tahle otázka dala písni jméno. Podle toho poznáš, která z možností je opravdu otázkou.",
    ],
    "Státní hymna České republiky se jmenuje Kde domov můj. Slova napsal Josef Kajetán Tyl, melodii složil František Škroup. Píseň pochází z roku 1834 z divadelní hry Fidlovačka.",
  ),
  q(
    "Jak se jmenuje hlavní město České republiky?",
    "Praha",
    [
      { o: "Brno", why: "Brno je druhé největší město a sídlí v něm nejvyšší soudy, hlavní město to ale není." },
      { o: "Ostrava", why: "Ostrava je velké město na severovýchodě země, hlavním městem není." },
      { o: "Plzeň", why: "Plzeň je krajské město na západě Čech, ne hlavní město republiky." },
    ],
    [
      "Hledané město leží na řece Vltavě.",
      "Je to největší město v zemi a sídlí v něm prezident, vláda i obě komory parlamentu. Vede přes ně Karlův most a nad řekou se tyčí hrad, ve kterém jsou uloženy korunovační klenoty.",
    ],
    "Hlavním městem České republiky je Praha. Leží na Vltavě, je největším městem v zemi a sídlí v ní prezident, vláda i parlament.",
  ),
  q(
    "Kdo je hlavou státu v České republice?",
    "Prezident",
    [
      { o: "Premiér", why: "Premiér stojí v čele vlády a řídí ministry, hlavou státu ale není." },
      { o: "Starosta Prahy", why: "Starosta vede jedno město. Celý stát nezastupuje." },
      { o: "Předseda Senátu", why: "Předseda Senátu řídí jednání horní komory parlamentu, stát navenek nezastupuje." },
    ],
    [
      "Tato osoba sídlí na Pražském hradě a volí ji přímo občané ve dvoukolové volbě.",
      "Zastupuje stát navenek, podepisuje zákony, jmenuje vládu a je vrchním velitelem armády. Její funkční období trvá pět let a stejný člověk je může mít nejvýše dvakrát za sebou.",
    ],
    "Hlavou státu je prezident. Sídlí na Pražském hradě, volí ho občané a zastupuje republiku navenek — jmenuje vládu, podepisuje zákony a přijímá velvyslance.",
  ),
  q(
    "Jak se jmenují obě komory českého parlamentu?",
    "Poslanecká sněmovna a Senát",
    [
      { o: "Sněmovna a Duma", why: "Duma je ruský parlament. V českém parlamentu komora s tímto názvem není." },
      { o: "Dolní sněmovna a Horní sněmovna", why: "Dolní a horní je jen označení postavení komor, ne jejich oficiální název." },
      { o: "Rada a Kongres", why: "Kongres mají Spojené státy, rady bývají ve městech a krajích. Parlament je netvoří." },
    ],
    [
      "Jednu komoru tvoří poslanci, druhou senátoři — od těchto slov se odvozují i názvy.",
      "Obě komory sídlí v Praze na Malé Straně. Jedna z nich má dvouslovný název odvozený od poslanců, druhá název jednoslovný odvozený od senátorů. Když si to spojíš, poznáš mezi možnostmi jedinou dvojici oficiálních názvů.",
    ],
    "Český parlament tvoří Poslanecká sněmovna (200 poslanců) a Senát (81 senátorů). Obě komory se podílejí na schvalování zákonů, ale mají různé pravomoci i různě dlouhé volební období.",
  ),
  q(
    "Kolik komor má český parlament?",
    "Dvě",
    [
      { o: "Jednu", why: "Jedinou komoru má třeba slovenský parlament. U nás zákon projednávají dva různé sbory." },
      { o: "Tři", why: "Třetí komora u nás neexistuje — zákony projednávají jen poslanci a senátoři." },
      { o: "Čtyři", why: "Čtyři komory nemá parlament v žádné evropské zemi, u nás je jich méně." },
    ],
    [
      "Vzpomeň si, jaké skupiny zákonodárců u nás schvalují zákony, a spočítej je.",
      "Návrh zákona putuje nejdřív k poslancům a potom k senátorům. Každá z těchto skupin má vlastní budovu i vlastní jednací sál. Kolik takových sálů napočítáš, tolik má parlament komor.",
    ],
    "Český parlament má dvě komory — Poslaneckou sněmovnu a Senát. Proto mu říkáme dvoukomorový parlament: zákon musí projít oběma.",
  ),
  q(
    "Co slavíme 28. října?",
    "Vznik Československa v roce 1918",
    [
      { o: "Konec druhé světové války", why: "Konec války v Evropě připadá na 8. května, ne na podzim." },
      { o: "Příchod Cyrila a Metoděje", why: "Příchod věrozvěstů si připomínáme 5. července." },
      { o: "Nový rok", why: "Nový rok je 1. ledna. Ten den navíc slavíme obnovu samostatného českého státu." },
    ],
    [
      "Ten den roku 1918 se na mapě Evropy objevil úplně nový stát.",
      "Rakousko-Uhersko se na konci první světové války rozpadlo a Češi se Slováky si založili společnou republiku. Hledej tedy možnost, která mluví o zrodu nového státu na podzim před více než sto lety.",
    ],
    "28. října 1918 vzniklo Československo — nový stát Čechů a Slováků. Proto je to největší státní svátek a říká se mu Den vzniku samostatného československého státu.",
  ),
  q(
    "Co slavíme 8. května?",
    "Konec druhé světové války v Evropě",
    [
      { o: "Vznik Československa", why: "Vznik Československa slavíme 28. října, tedy na podzim." },
      { o: "Den vstupu do Evropské unie", why: "Do Evropské unie jsme vstoupili 1. května 2004, státní svátek to ale není." },
      { o: "Narozeniny prvního prezidenta", why: "Narozeniny prezidentů se u nás jako státní svátek neslaví." },
    ],
    [
      "Ten den roku 1945 se v Evropě přestalo bojovat.",
      "Předcházela mu válka, která začala roku 1939 a zasáhla skoro celý svět. Osmého května 1945 podepsalo Německo kapitulaci a zbraně na evropských bojištích umlkly. Hledej možnost, která mluví právě o ukončení bojů.",
    ],
    "8. května 1945 kapitulovalo nacistické Německo a v Evropě skončila druhá světová válka. Slavíme proto Den vítězství — svátek míru a svobody.",
  ),
  q(
    "Co slavíme 5. července?",
    "Příchod Cyrila a Metoděje na Moravu",
    [
      { o: "Svátek mistra Jana Husa", why: "Jana Husa si připomínáme až o den později, 6. července." },
      { o: "Vznik samostatného státu", why: "Vznik samostatného státu slavíme 28. října, případně 1. ledna." },
      { o: "Konec druhé světové války", why: "Konec války v Evropě připadá na 8. května." },
    ],
    [
      "Ten den si připomínáme dva bratry, kteří přišli z Byzance a přinesli slovanské písmo.",
      "Byli to věrozvěsti, které roku 863 pozval kníže Rastislav na Velkou Moravu. Sestavili hlaholici, aby se dalo psát a kázat srozumitelně slovanským jazykem. Hledej proto možnost, která mluví o tom, že k nám tito dva muži dorazili.",
    ],
    "5. července si připomínáme příchod věrozvěstů Cyrila a Metoděje na Velkou Moravu roku 863. Přinesli křesťanství a slovanské písmo hlaholici.",
  ),
  q(
    "Co slavíme 6. července?",
    "Den upálení mistra Jana Husa",
    [
      { o: "Svátek Cyrila a Metoděje", why: "Cyrila a Metoděje si připomínáme o den dřív, 5. července." },
      { o: "Vznik Česko-Slovenské federace", why: "Takový den v seznamu českých státních svátků není." },
      { o: "Den české státnosti", why: "Den české státnosti připadá na 28. září, kdy zemřel svatý Václav." },
    ],
    [
      "Ten den roku 1415 zemřel v Kostnici kazatel, který kritizoval poměry v církvi.",
      "Přednášel na pražské univerzitě, psal česky a před církevním sněmem odmítl odvolat své učení. Sněm ho proto odsoudil a nechal zemřít na hranici. Hledej možnost, která mluví právě o tomto trestu.",
    ],
    "6. července 1415 byl v Kostnici upálen mistr Jan Hus, český kazatel a reformátor. Je symbolem pravdy a statečnosti, proto je tento den státním svátkem.",
  ),
  q(
    "Kolik států sousedí s Českou republikou?",
    "Čtyři státy",
    [
      { o: "Tři státy", why: "Tolik by ti vyšlo, kdybys na jednoho souseda zapomněl. Projdi znovu všechny světové strany." },
      { o: "Pět států", why: "Pátý soused by musel ležet na jihovýchodě, tam ale společnou hranici nemáme." },
      { o: "Dva státy", why: "Dva sousedy má země sevřená mezi dvěma státy. Naše hranice se dotýká více zemí." },
    ],
    [
      "Projdi postupně sever, jih, východ i západ a u každé strany si vzpomeň na sousední zemi.",
      "Hranice České republiky tvoří skoro pravidelný ovál a za každou jeho stranou leží jiná země. Vyjmenuj je popořadě od severu po směru hodinových ručiček, každou si spočítej na prstech a porovnej výsledek s možnostmi.",
    ],
    "Česká republika sousedí se čtyřmi státy: na západě s Německem, na jihu s Rakouskem, na východě se Slovenskem a na severu s Polskem.",
  ),
  q(
    "Co kromě Nového roku slavíme 1. ledna?",
    "Den obnovy samostatného českého státu — vznik ČR v roce 1993",
    [
      { o: "Vznik Československa v roce 1918", why: "Vznik Československa připadá na 28. října, ne na začátek roku." },
      { o: "Konec druhé světové války", why: "Konec války v Evropě si připomínáme 8. května." },
      { o: "Vstup do Evropské unie v roce 2004", why: "Do Evropské unie jsme vstoupili 1. května a státní svátek z toho nevznikl." },
    ],
    [
      "Ten den roku 1993 se Československo mírumilovně rozdělilo na dvě samostatné země.",
      "Nový rok se slaví po celém světě, u nás má ale první lednový den ještě druhý důvod. Vzpomeň si, co se stalo s Československem na přelomu let 1992 a 1993, a vyber možnost, která mluví právě o této změně.",
    ],
    "1. ledna je státní svátek hned ze dvou důvodů: je to Nový rok a zároveň Den obnovy samostatného českého státu. Právě 1. ledna 1993 vznikla po mírovém rozdělení Československa samostatná Česká republika.",
  ),
  q(
    "V jakém roce vznikla píseň Kde domov můj?",
    "V roce 1834",
    [
      { o: "V roce 1918", why: "To je rok vzniku Československa. Píseň byla tehdy už dávno známá." },
      { o: "V roce 1848", why: "Rok 1848 je rokem revolucí v Evropě, píseň je ale o kus starší." },
      { o: "V roce 1793", why: "V roce 1793 se ani jeden z autorů písně ještě nenarodil." },
    ],
    [
      "Píseň je mnohem starší než samostatné Československo — vznikla v první polovině 19. století.",
      "Poprvé zazněla v divadelní hře Fidlovačka od Josefa Kajetána Tyla, kterou uvedli v Praze za časů národního obrození. Bylo to ještě dřív než revoluční rok 1848, a přitom v době, kdy oba autoři byli mladí muži.",
    ],
    "Píseň Kde domov můj vznikla roku 1834 jako součást divadelní hry Fidlovačka. Slova napsal Josef Kajetán Tyl, hudbu složil František Škroup. Státní hymnou se stala až po vzniku Československa.",
  ),
];

const POOL_L2: PracticeTask[] = [
  q(
    "Který stát sousedí s Českou republikou na severu?",
    "Polsko",
    [
      { o: "Německo", why: "Německo je náš západní soused, ne severní." },
      { o: "Slovensko", why: "Slovensko leží na východě od nás." },
      { o: "Maďarsko", why: "S Maďarskem společnou hranici vůbec nemáme — dělí nás Slovensko a Rakousko." },
    ],
    [
      "Severní soused je velká slovanská země, kterou od nás dělí Krkonoše a Jeseníky.",
      "Na severní hranici se zvedají hřebeny Krkonoš a Jeseníků a hned za nimi začíná rozsáhlá rovina. Hlavní město té země leží na řece Visle a jmenuje se Varšava.",
    ],
    "Na severu sousedí Česká republika s Polskem. Hranici tvoří převážně horské hřebeny Krkonoš a Jeseníků, hlavním městem Polska je Varšava.",
  ),
  q(
    "Který stát sousedí s Českou republikou na jihu?",
    "Rakousko",
    [
      { o: "Slovensko", why: "Slovensko je náš východní soused." },
      { o: "Polsko", why: "Polsko leží na severu od nás." },
      { o: "Maďarsko", why: "Maďarsko s Českou republikou nesousedí, leží až za Slovenskem." },
    ],
    [
      "Jižní soused je země, se kterou jsme dřív patřili do jedné habsburské monarchie.",
      "Hranice s ním vede od Šumavy dál na východ až k jižní Moravě. Hlavní město té země leží na Dunaji, jmenuje se Vídeň a z Brna je to tam jen asi sto kilometrů.",
    ],
    "Na jihu sousedí Česká republika s Rakouskem. Obě země byly dlouho součástí habsburské monarchie, hlavním městem Rakouska je Vídeň.",
  ),
  q(
    "Který stát sousedí s Českou republikou na východě?",
    "Slovensko",
    [
      { o: "Maďarsko", why: "Maďarsko s námi společnou hranici nemá, leží jižněji." },
      { o: "Polsko", why: "Polsko je soused na severu." },
      { o: "Ukrajina", why: "Ukrajina leží až za východním sousedem, s Českou republikou hranici nemá." },
    ],
    [
      "Východní soused s námi až do roku 1993 tvořil jeden společný stát.",
      "Rozdělení proběhlo mírovou cestou k 1. lednu 1993 a obě země si zůstaly blízké — rozumíme si i bez překladu. Hlavní město toho státu leží na Dunaji a jmenuje se Bratislava.",
    ],
    "Na východě sousedí Česká republika se Slovenskem. Až do 1. ledna 1993 jsme tvořili jeden stát — Československo. Hlavním městem Slovenska je Bratislava.",
  ),
  q(
    "Který stát sousedí s Českou republikou na západě?",
    "Německo",
    [
      { o: "Francie", why: "Francie leží mnohem dál na západ, společnou hranici s námi nemá." },
      { o: "Polsko", why: "Polsko je soused na severu." },
      { o: "Rakousko", why: "Rakousko je soused na jihu." },
    ],
    [
      "Západní soused je nejlidnatější země Evropské unie.",
      "Hranice s ním vede přes Šumavu, Český les a Krušné hory a je ze všech našich hranic nejdelší. Hlavní město té země leží na řece Sprévě a jmenuje se Berlín.",
    ],
    "Na západě sousedí Česká republika s Německem. Hranice vede přes Šumavu, Český les a Krušné hory a je naší nejdelší hranicí. Hlavním městem Německa je Berlín.",
  ),
  q(
    "Kterou historickou zemi ve státním znaku představuje bílý lev na červeném poli?",
    "Čechy",
    [
      { o: "Moravu", why: "Moravu zastupuje stříbrno-červeně šachovaná orlice na modrém poli, ne lev." },
      { o: "Slezsko", why: "Slezsko má ve znaku černou orlici se zlatou korunou na zlatém poli." },
      { o: "Slovensko", why: "Slovensko není historickou zemí českého státu a ve znaku vůbec není." },
    ],
    [
      "Tohle zvíře najdeš i ve znaku hlavního města a ve velkém státním znaku zabírá dvě pole ze čtyř.",
      "Ve velkém státním znaku se opakuje dvakrát — v levém horním a pravém dolním poli. Zastupuje tu historickou zemi, která tvoří západní část našeho území a dala celé republice jméno.",
    ],
    "Bílý (stříbrný) lev na červeném poli představuje Čechy — historické jádro dnešní České republiky. Ve velkém státním znaku se objevuje dvakrát a najdeme ho i na znaku Prahy.",
  ),
  q(
    "Kterou historickou zemi ve státním znaku představuje stříbrno-červeně šachovaná orlice?",
    "Moravu",
    [
      { o: "Čechy", why: "Čechy zastupuje ve znaku bílý lev na červeném poli." },
      { o: "Slezsko", why: "Slezská orlice je černá se zlatou korunkou, šachovnicový vzor nemá." },
      { o: "Rakousko", why: "Rakousko není historickou zemí českého státu, ve znaku proto být nemůže." },
    ],
    [
      "Ten vzor vypadá jako šachovnice a je umístěný v modrém poli.",
      "Stejnou orlici uvidíš na zemských praporech i na znacích měst jako Brno a Olomouc. Zastupuje historickou zemi, která leží mezi Čechami a Slezskem a tvoří jihovýchodní část republiky.",
    ],
    "Stříbrno-červeně šachovaná orlice na modrém poli představuje Moravu. Vzor pochází ze znaku Moravského markrabství a dodnes ho najdeme na moravských praporech.",
  ),
  q(
    "Kterou historickou zemi ve státním znaku představuje černá orlice se zlatou korunou?",
    "Slezsko",
    [
      { o: "Moravu", why: "Moravská orlice je stříbrno-červeně šachovaná, ne černá." },
      { o: "Čechy", why: "Čechy zastupuje bílý lev na červeném poli." },
      { o: "Polsko", why: "Polský orel je bílý na červeném poli a v našem státním znaku není." },
    ],
    [
      "Její pole má zlatý podklad — jako jediné není červené ani modré.",
      "Je to nejmenší z historických zemí českého státu. Větší část jejího území dnes leží v Polsku, u nás z ní zůstal jen pruh kolem Opavy a Ostravy.",
    ],
    "Černá orlice se zlatou korunkou na zlatém poli představuje Slezsko — nejmenší z historických zemí, které spolu tvoří velký státní znak.",
  ),
  q(
    "Kolik poslanců zasedá v Poslanecké sněmovně?",
    "200 poslanců",
    [
      { o: "81 poslanců", why: "Číslo 81 patří počtu senátorů, ne poslanců." },
      { o: "150 poslanců", why: "Číslo 150 je tísňová linka hasičů. S počtem poslanců nesouvisí." },
      { o: "300 poslanců", why: "Tolik zákonodárců mají mnohem lidnatější státy. Naše sněmovna je menší." },
    ],
    [
      "Je to kulaté číslo, které se snadno pamatuje, a je výrazně větší než počet senátorů.",
      "Sněmovna je dolní a početnější komora parlamentu — senátorů je jen 81. Hledej mezi možnostmi kulaté číslo, které je zároveň větší než dvojnásobek počtu senátorů, ale menší než tři sta.",
    ],
    "V Poslanecké sněmovně zasedá 200 poslanců. Je to dolní komora parlamentu a poslanci se do ní volí na čtyři roky.",
  ),
  q(
    "Kolik senátorů zasedá v Senátu?",
    "81 senátorů",
    [
      { o: "200 senátorů", why: "Dvě stě je počet poslanců ve sněmovně, ne senátorů." },
      { o: "150 senátorů", why: "Tolik členů nemá ani jedna z komor českého parlamentu." },
      { o: "100 senátorů", why: "Sto je kulaté číslo, počet senátorů ale kulatý není." },
    ],
    [
      "Senát má mnohem méně členů než sněmovna a jejich počet není kulatý.",
      "Každý senátor zastupuje jeden volební obvod a republika je rozdělená přesně na tolik obvodů, kolik má Senát křesel. Je to liché číslo těsně pod devadesátkou, takže se nedá zaokrouhlit na celé stovky.",
    ],
    "V Senátu zasedá 81 senátorů, každý za jeden volební obvod. Senát je horní komora parlamentu a senátoři se volí na šest let.",
  ),
  q(
    "Kdo napsal slova státní hymny Kde domov můj?",
    "Josef Kajetán Tyl",
    [
      { o: "František Škroup", why: "Škroup složil k písni hudbu, slova od něj nejsou." },
      { o: "Bedřich Smetana", why: "Smetana složil cyklus Má vlast. Na hymně se nepodílel." },
      { o: "Antonín Dvořák", why: "Dvořák psal symfonie a opery, text hymny od něj nepochází." },
    ],
    [
      "Autor slov byl spisovatel a divadelník, ne hudební skladatel.",
      "Text vznikl jako píseň pro postavu slepého houslisty v jeho divadelní hře Fidlovačka z roku 1834. Mezi možnostmi proto hledej jméno, které patří spisovateli a autorovi divadelních her, ne skladateli.",
    ],
    "Slova hymny napsal Josef Kajetán Tyl pro divadelní hru Fidlovačka. Hudbu k nim složil František Škroup.",
  ),
  q(
    "Kdo složil hudbu státní hymny Kde domov můj?",
    "František Škroup",
    [
      { o: "Josef Kajetán Tyl", why: "Tyl napsal k písni slova, melodii ne." },
      { o: "Bedřich Smetana", why: "Smetanovi bylo v době vzniku písně teprve deset let, hudbu k ní nesložil." },
      { o: "Antonín Dvořák", why: "Dvořák se narodil až v roce 1841, tedy dlouho po vzniku písně." },
    ],
    [
      "Autor melodie byl hudební skladatel a dirigent pražského Stavovského divadla.",
      "Byl to současník a spolupracovník autora textu — společně připravili pro divadlo hru Fidlovačka. Mezi možnostmi proto hledej skladatele, který žil ve stejné době jako Josef Kajetán Tyl, ne ty pozdější.",
    ],
    "Hudbu ke státní hymně složil František Škroup, dirigent Stavovského divadla. Slova napsal Josef Kajetán Tyl, píseň vznikla roku 1834.",
  ),
  q(
    "Ve kterém sousedním státě leží hlavní město Vídeň?",
    "Rakousko",
    [
      { o: "Německo", why: "Německým hlavním městem je Berlín." },
      { o: "Slovensko", why: "Slovenským hlavním městem je Bratislava." },
      { o: "Polsko", why: "Polským hlavním městem je Varšava." },
    ],
    [
      "Tenhle stát sousedí s Českou republikou na jihu.",
      "To město leží na Dunaji jen kousek od našich hranic a kdysi odtud panovníci vládli celé habsburské monarchii, do níž patřily i české země. Mezi možnostmi proto hledej souseda ležícího jižně od nás.",
    ],
    "Hlavní město Vídeň leží v Rakousku, které sousedí s Českou republikou na jihu. Z Vídně se za Habsburků vládlo i českým zemím.",
  ),
  q(
    "Ve kterém sousedním státě leží hlavní město Berlín?",
    "Německo",
    [
      { o: "Rakousko", why: "Rakouským hlavním městem je Vídeň." },
      { o: "Polsko", why: "Polským hlavním městem je Varšava." },
      { o: "Slovensko", why: "Slovenským hlavním městem je Bratislava." },
    ],
    [
      "Tenhle stát sousedí s Českou republikou na západě a je z našich sousedů nejlidnatější.",
      "To město bylo za studené války rozdělené zdí na východní a západní část a zeď padla až v roce 1989. Dnes je hlavním městem té sousední země, se kterou máme nejdelší společnou hranici.",
    ],
    "Hlavní město Berlín leží v Německu, které sousedí s Českou republikou na západě a je naším nejlidnatějším sousedem.",
  ),
];

const POOL_L3: PracticeTask[] = [
  q(
    "Kolik let uplynulo mezi vznikem Československa v roce 1918 a vznikem samostatné České republiky v roce 1993?",
    pad(75, "ROK"),
    [
      { o: pad(74, "ROK"), why: "O rok méně — nejspíš jsi odečítal od roku 1992 místo od 1993." },
      { o: pad(76, "ROK"), why: "O rok více — zkontroluj, jestli sis při odčítání nepřičetl rok navíc." },
      { o: pad(85, "ROK"), why: "Tolik by vyšlo, kdyby druhý letopočet byl 1908. Zkontroluj číslice desítek." },
    ],
    [
      "Odečti menší letopočet od většího a dej pozor na přechod přes desítku.",
      "Zapiš oba letopočty pod sebe a odčítej po řádech: 1993 − 1918. Jednotky 3 a 8 nejdou odečíst přímo, takže si musíš vypůjčit z desítek. Výsledek vyjde o něco menší než osmdesát.",
    ],
    "Od vzniku Československa (1918) do vzniku samostatné České republiky (1993) uplynulo 1993 − 1918 = 75 let.",
  ),
  q(
    "Kolik let uplynulo od upálení mistra Jana Husa v roce 1415 do vzniku samostatné České republiky v roce 1993?",
    pad(578, "ROK"),
    [
      { o: pad(577, "ROK"), why: "O jedna méně — při odčítání jednotek ti vypadla jedna při výpůjčce." },
      { o: pad(579, "ROK"), why: "O jedna více — zkontroluj jednotky, 3 − 5 vyžaduje výpůjčku z desítek." },
      { o: pad(588, "ROK"), why: "Tolik by vyšlo, kdybys odčítal rok 1405. Zkontroluj číslici desítek." },
    ],
    [
      "Odečti letopočet Husovy smrti od letopočtu vzniku republiky.",
      "Počítej po řádech: 1993 − 1415. Nejdřív odečti stovky, potom desítky a nakonec jednotky, u kterých si musíš vypůjčit z vyššího řádu. Výsledek je o něco menší než šest set.",
    ],
    "Od upálení Jana Husa (1415) do vzniku samostatné České republiky (1993) uplynulo 1993 − 1415 = 578 let.",
  ),
  q(
    "Kolik let uplynulo od příchodu Cyrila a Metoděje na Velkou Moravu v roce 863 do vzniku samostatné České republiky v roce 1993?",
    pad(1130, "ROK"),
    [
      { o: pad(1129, "ROK"), why: "O jedna méně — zkontroluj, jak jsi odečetl jednotky." },
      { o: pad(1131, "ROK"), why: "O jedna více — při odčítání ti přebyla jedna." },
      { o: pad(1140, "ROK"), why: "Tolik by vyšlo, kdybys odečítal rok 853. Zkontroluj desítky." },
    ],
    [
      "Od letopočtu 1993 odečti rok příchodu věrozvěstů.",
      "Rozděl si odčítání na dva snazší kroky: 1993 − 800 a z výsledku pak ještě odečti 63. Konečné číslo vyjde o něco větší než tisíc sto let.",
    ],
    "Od příchodu Cyrila a Metoděje (863) do vzniku samostatné České republiky (1993) uplynulo 1993 − 863 = 1130 let.",
  ),
  q(
    "Kolik let uplynulo mezi vznikem Československa v roce 1918 a koncem druhé světové války v roce 1945?",
    pad(27, "ROK"),
    [
      { o: pad(26, "ROK"), why: "O rok méně — zkontroluj odčítání jednotek, 5 − 8 vyžaduje výpůjčku." },
      { o: pad(28, "ROK"), why: "O rok více — nejspíš jsi počítal do roku 1946." },
      { o: pad(37, "ROK"), why: "Tolik by vyšlo, kdyby první letopočet byl 1908. Zkontroluj desítky." },
    ],
    [
      "Odečti rok vzniku Československa od roku, kdy skončila válka.",
      "Spočítej to na dvě etapy: z roku 1918 do roku 1938 uplyne rovných dvacet let a pak zbývá dopočítat zbytek do roku 1945. Obě části sečti — výsledek bude mezi dvaceti a třiceti.",
    ],
    "Mezi vznikem Československa (1918) a koncem druhé světové války (1945) uplynulo 1945 − 1918 = 27 let.",
  ),
  q(
    "Kolik let uplynulo mezi koncem druhé světové války v roce 1945 a vznikem samostatné České republiky v roce 1993?",
    pad(48, "ROK"),
    [
      { o: pad(47, "ROK"), why: "O rok méně — nejspíš jsi počítal jen do roku 1992." },
      { o: pad(49, "ROK"), why: "O rok více — zkontroluj, jestli jsi nezačal už rokem 1944." },
      { o: pad(58, "ROK"), why: "Tolik by vyšlo, kdyby válka skončila roku 1935. Zkontroluj číslici desítek." },
    ],
    [
      "Odečti rok konce války od roku vzniku samostatné České republiky.",
      "Rozděl si výpočet: z roku 1945 do roku 1990 uplyne čtyřicet pět let a pak přidej zbývající roky do roku 1993. Výsledek je o dva menší než padesát.",
    ],
    "Mezi koncem druhé světové války (1945) a vznikem samostatné České republiky (1993) uplynulo 1993 − 1945 = 48 let.",
  ),
  q(
    "Kolik let uplynulo mezi příchodem Cyrila a Metoděje na Velkou Moravu (863) a upálením mistra Jana Husa (1415)?",
    pad(552, "ROK"),
    [
      { o: pad(551, "ROK"), why: "O jedna méně — zkontroluj jednotky, 5 − 3 dává 2, ne 1." },
      { o: pad(553, "ROK"), why: "O jedna více — při sčítání mezikroků ti přebyla jedna." },
      { o: pad(562, "ROK"), why: "Tolik by vyšlo, kdyby věrozvěsti přišli roku 853. Zkontroluj desítky." },
    ],
    [
      "Odečti rok příchodu věrozvěstů od roku Husovy smrti.",
      "Postupuj po krocích: z roku 863 do roku 1000 chybí sto třicet sedm let a z roku 1000 do roku 1415 je čtyři sta patnáct let. Obě čísla sečti a dostaneš celý rozdíl.",
    ],
    "Mezi příchodem Cyrila a Metoděje (863) a upálením Jana Husa (1415) uplynulo 1415 − 863 = 552 let.",
  ),
  q(
    "Kolik let uplynulo mezi příchodem Cyrila a Metoděje na Velkou Moravu (863) a vznikem Československa (1918)?",
    pad(1055, "ROK"),
    [
      { o: pad(1054, "ROK"), why: "O jedna méně — zkontroluj poslední krok odčítání." },
      { o: pad(1056, "ROK"), why: "O jedna více — při počítání ti přebyl jeden rok." },
      { o: pad(1065, "ROK"), why: "Tolik by vyšlo, kdyby věrozvěsti přišli roku 853. Zkontroluj číslici desítek." },
    ],
    [
      "Odečti rok příchodu věrozvěstů od roku vzniku Československa.",
      "Rozděl si to na dva skoky: z roku 863 do roku 1863 uplyne rovných tisíc let a potom zbývá dopočítat zbytek do roku 1918. Výsledek je proto jen o něco větší než tisíc.",
    ],
    "Mezi příchodem Cyrila a Metoděje (863) a vznikem Československa (1918) uplynulo 1918 − 863 = 1055 let.",
  ),
  q(
    "Který svátek připadá v kalendáři na dřívější den — svátek Cyrila a Metoděje, nebo den upálení mistra Jana Husa?",
    "Dřív je svátek Cyrila a Metoděje",
    [
      { o: "Dřív je den upálení mistra Jana Husa", why: "Husův svátek připadá na 6. července, tedy o den později." },
      { o: "Oba svátky připadají na stejný den", why: "Každý z nich má vlastní datum — 5. a 6. července." },
      { o: "Pořadí se každý rok mění", why: "Data státních svátků jsou pevná, mění se jen den v týdnu, na který padnou." },
    ],
    [
      "Připomeň si přesné datum obou svátků a porovnej čísla dnů.",
      "Oba svátky jsou v červenci a v kalendáři jdou hned po sobě, takže rozhoduje jediné číslo. Menší číslo dne znamená dřívější místo v kalendáři, i když ta historická událost nastala později.",
    ],
    "Svátek Cyrila a Metoděje připadá na 5. července, den upálení mistra Jana Husa na 6. července. V kalendáři je tedy dřív svátek věrozvěstů, přestože se odehrál o stovky let dřív než Husova smrt.",
  ),
  q(
    "Co se stalo dřív — vznik Československa (28. října 1918), nebo konec druhé světové války (8. května 1945)?",
    "Dřív vzniklo Československo",
    [
      { o: "Dřív skončila druhá světová válka", why: "Válka skončila roku 1945, tedy o 27 let později než vznikl společný stát." },
      { o: "Obě události se staly ve stejném roce", why: "Letopočty se liší: 1918 a 1945 dělí celé generace." },
      { o: "Z uvedených dat to nejde poznat", why: "Poznat to lze snadno — stačí porovnat oba letopočty jako běžná čísla." },
    ],
    [
      "Porovnej letopočty v závorkách: menší číslo znamená dřívější událost.",
      "Nejdřív si u každé události vypiš samotný rok. Potom je porovnej jako obyčejná čísla — menší letopočet leží na časové ose vlevo. Nakonec si rozdíl spočítej a uvidíš, že mezi událostmi leží skoro tři desetiletí.",
    ],
    "Československo vzniklo roku 1918, druhá světová válka skončila roku 1945. Menší letopočet je dřív, takže vznik státu předchází konci války o 27 let.",
  ),
  q(
    "Co bylo dřív — příchod Cyrila a Metoděje na Velkou Moravu (863), nebo vznik Československa (1918)?",
    "Dřív přišli Cyril a Metoděj",
    [
      { o: "Dřív vzniklo Československo", why: "Společný stát vznikl roku 1918, tedy více než tisíc let po věrozvěstech." },
      { o: "Obě události se staly ve stejném století", why: "Rok 863 patří do 9. století, rok 1918 do 20. století." },
      { o: "Z uvedených letopočtů to nejde poznat", why: "Poznat to jde — stačí porovnat trojciferné a čtyřciferné číslo." },
    ],
    [
      "Jeden letopočet je trojciferný, druhý čtyřciferný — už to napoví, který je starší.",
      "Trojciferné číslo je vždy menší než čtyřciferné, takže rok 863 leží na časové ose mnohem dál vlevo. Když si rozdíl spočítáš, zjistíš, že mezi oběma událostmi uplynulo dokonce více než tisíc let.",
    ],
    "Rok 863 je trojciferný, rok 1918 čtyřciferný, takže příchod věrozvěstů je starší. Mezi oběma událostmi uplynulo 1055 let.",
  ),
  q(
    "Který sousední stát ČR byl s naší zemí až do roku 1993 součástí společného státu a zároveň leží na východě od České republiky?",
    "Slovensko",
    [
      { o: "Rakousko", why: "Rakousko leží na jihu a společný stát jsme s ním netvořili." },
      { o: "Polsko", why: "Polsko leží na severu a v jednom státě s námi nikdy nebylo." },
      { o: "Německo", why: "Německo je západní soused a společný stát jsme s ním neměli." },
    ],
    [
      "Musí platit obě podmínky zároveň — nejdřív vyřaď státy, které neleží na východě.",
      "Začni směrem: na východ od nás leží jediná země. Potom u ní ověř druhou podmínku, tedy jestli s námi až do roku 1993 tvořila jeden stát. Zůstane ti jediná možnost, která splňuje obojí najednou.",
    ],
    "Slovensko je jediný soused, který leží na východě od ČR a zároveň s námi až do 1. ledna 1993 tvořil společné Československo.",
  ),
  q(
    "Který sousední stát ČR leží na severu a zároveň má hlavní město Varšavu?",
    "Polsko",
    [
      { o: "Německo", why: "Německo leží na západě a jeho hlavním městem je Berlín." },
      { o: "Rakousko", why: "Rakousko je jižní soused a hlavní město má Vídeň." },
      { o: "Slovensko", why: "Slovensko leží na východě a jeho hlavním městem je Bratislava." },
    ],
    [
      "Nejdřív si vyber souseda na severu a teprve pak u něj zkontroluj hlavní město.",
      "Ze čtyř sousedů leží na severu jediný a hranici s ním tvoří Krkonoše a Jeseníky. Když k němu přiřadíš hlavní město ležící na řece Visle, budou obě podmínky splněné zároveň.",
    ],
    "Polsko je náš severní soused a jeho hlavním městem je Varšava. Obě podmínky zároveň splňuje jen tento stát.",
  ),
  q(
    "Který sousední stát ČR leží na západě a zároveň má hlavní město Berlín?",
    "Německo",
    [
      { o: "Rakousko", why: "Rakousko je jižní soused a jeho hlavním městem je Vídeň." },
      { o: "Polsko", why: "Polsko leží na severu a hlavní město má Varšavu." },
      { o: "Slovensko", why: "Slovensko je východní soused s hlavním městem Bratislavou." },
    ],
    [
      "Postupuj ve dvou krocích: nejdřív urči souseda na západě.",
      "Na západ od nás leží jen jeden stát a hranice s ním vede přes Šumavu, Český les a Krušné hory. Potom ověř druhou podmínku — jeho hlavní město leží na řece Sprévě a bylo kdysi rozdělené zdí.",
    ],
    "Německo je náš západní soused a jeho hlavním městem je Berlín. Obě podmínky splňuje jen tento stát.",
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const CRSYMBOLY: TopicMetadata[] = [
  {
    id: "g3-prvouka-misto-kde-zijeme-nase-vlast-ceska-republika-hlavni-mesto-statni-symboly",
    rvpNodeId:
      "g3-prvouka-misto-kde-zijeme-nase-vlast-ceska-republika-hlavni-mesto-statni-symboly",
    title: "Česká republika — státní symboly",
    studentTitle: "Česká republika",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Naše vlast",
    briefDescription:
      "Znáš státní symboly ČR a základní fakta o naší zemi.",
    illustrationDesc:
      "dítě drží v ruce malou českou vlajku a dívá se na mapu České republiky přišpendlenou na nástěnce, kolem jsou obrázky Pražského hradu a státního znaku",
    keywords: [
      "vlajka",
      "státní znak",
      "hymna",
      "Praha",
      "prezident",
      "parlament",
      "Poslanecká sněmovna",
      "Senát",
      "státní svátky",
      "sousední státy",
      "Německo",
      "Rakousko",
      "Slovensko",
      "Polsko",
      "28. října",
      "Kde domov můj",
    ],
    goals: [
      "Popsat barvy a prvky české vlajky.",
      "Vyjmenovat části velkého státního znaku.",
      "Uvést název státní hymny.",
      "Pojmenovat hlavní město a hlavu státu.",
      "Vysvětlit, co je parlament a jak se jmenují jeho komory.",
      "Vyjmenovat alespoň tři státní svátky a říct, co se v ten den slaví.",
      "Ukázat na mapě nebo vyjmenovat čtyři sousední státy ČR.",
    ],
    boundaries: [
      "Základní fakta přístupná žákům 3. třídy, bez podrobné ústavní teorie.",
      "Státní svátky jen ty v zadání, ne celý kalendář.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Vlajka: bílý pruh + červený pruh + modrý klín vlevo. Státní znak: lev (Čechy) + moravská orlice + slezská orlice. Hymna: Kde domov můj. Sousedé: Německo, Rakousko, Slovensko, Polsko.",
      steps: [
        "Vybav si barvy vlajky: bílá nahoře, červená dole, modrý klín vlevo.",
        "Státní znak má čtyři pole — lev a dvě orlice.",
        "Hymna začíná slovy: Kde domov můj.",
        "Parlament = Poslanecká sněmovna + Senát.",
        "Vznik ČSR = 28. října 1918.",
      ],
      commonMistake:
        "Záměna 5. července (Cyril a Metoděj) a 6. července (Jan Hus) — oba svátky jsou v červenci a jdou po sobě.",
      example:
        "Při zpěvu hymny na školní slavnosti žáci vstávají — je to projev úcty ke státnímu symbolu.",
    },
  },
];
