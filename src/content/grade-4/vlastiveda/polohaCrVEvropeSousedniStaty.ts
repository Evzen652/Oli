/**
 * Vlastivěda 4. ročník — Poloha ČR v Evropě, sousední státy.
 *
 * Přepsáno 2026-09-11. Původní úlohy měly jednu nápovědu, „postup“, který
 * jen zopakoval odpověď, a žádnou diagnostiku. Obsahovaly i chyby:
 * „Polsko je největší ze sousedů ČR“ (největší je Německo), vymyšlené
 * „Českomoravské království v rámci Rakouska-Uherska“ (šlo o České království
 * a Markrabství moravské, Rakousko-Uhersko vzniklo až roku 1867), anglické
 * „Czechoslovakia“ v nápovědě a distraktory se slovem „prý“.
 *
 * Gradace:
 *  • L1 — kde Česko leží, sousedé podle světových stran, hlavní město, jazyk.
 *  • L2 — největší města, kam odtéká voda z řek, Československo, EU.
 *  • L3 — úvahy: kam dojdu z Prahy na sever, proč „střecha Evropy“, proč
 *         vnitrozemská poloha znamená dovoz přes jiné státy.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

const POOL_L1: PracticeTask[] = [
  choice("Ve které části Evropy leží Česko?", "Ve střední Evropě", [
    { value: "Na jihu Evropy", why: "Na jihu Evropy leží třeba Itálie nebo Španělsko u Středozemního moře." },
    { value: "Na severu Evropy", why: "Na severu Evropy leží Norsko, Švédsko nebo Finsko." },
    { value: "Na západě Evropy", why: "Na západě Evropy leží Francie nebo Portugalsko u oceánu." },
  ], {
    hints: ["Podívej se na mapu Evropy. Je Česko u některého okraje, nebo spíš uprostřed?", "Česko je daleko od všech moří i oceánů a sousedí s Německem, Polskem, Slovenskem a Rakouskem. Jak se říká části Evropy uprostřed?"],
    explanation: "Česko leží ve střední Evropě — daleko od moří, uprostřed kontinentu. Proto se mu někdy říká srdce Evropy.",
  }),
  choice("Jaké je hlavní město Česka?", "Praha", [
    { value: "Brno", why: "Brno je druhé největší město a centrum Moravy, ale hlavní město to není." },
    { value: "Ostrava", why: "Ostrava je třetí největší město, hlavní město ale ne." },
    { value: "Plzeň", why: "Plzeň je krajské město na západě Čech." },
  ], {
    hints: ["V hlavním městě sídlí prezident a vláda.", "Protéká jím Vltava, stojí v něm Pražský hrad a Karlův most. Jak se jmenuje?"],
    explanation: "Hlavním městem Česka je Praha. Sídlí v ní prezident, vláda i parlament a je to největší město v zemi.",
  }),
  choice("Se kterými státy Česko sousedí?", "Německo, Polsko, Slovensko a Rakousko", [
    { value: "Německo, Polsko, Slovensko a Maďarsko", why: "S Maďarskem Česko nesousedí — leží mezi nimi Slovensko." },
    { value: "Německo, Francie, Rakousko a Polsko", why: "Francie leží za Německem, s Českem nesousedí." },
    { value: "Polsko, Slovensko, Ukrajina a Rakousko", why: "Ukrajina leží daleko na východě, s Českem nesousedí." },
  ], {
    hints: ["Česko má čtyři sousedy — na každé světové straně jednoho.", "Na západě je velký stát s Berlínem, na severu stát s Varšavou, na východě bývalá část Československa a na jihu stát s Vídní."],
    explanation: "Česko sousedí se čtyřmi státy: Německem (západ a sever), Polskem (sever), Slovenskem (východ) a Rakouskem (jih).",
  }),
  choice("Který soused leží od Česka na západě?", "Německo", [
    { value: "Polsko", why: "Polsko leží na severu a severovýchodě." },
    { value: "Slovensko", why: "Slovensko leží na východě." },
    { value: "Rakousko", why: "Rakousko leží na jihu." },
  ], {
    hints: ["Tento soused je ze všech našich sousedů největší.", "Jeho hlavní město je Berlín a s Českem má nejdelší hranici — přes Šumavu, Krušné hory a na severu Čech."],
    explanation: "Na západě a severozápadě sousedí Česko s Německem. Je to náš největší a nejlidnatější soused a máme s ním nejdelší hranici.",
  }),
  choice("Který soused leží od Česka na severu a severovýchodě?", "Polsko", [
    { value: "Německo", why: "Německo leží hlavně na západě a severozápadě." },
    { value: "Slovensko", why: "Slovensko leží na východě." },
    { value: "Maďarsko", why: "S Maďarskem Česko vůbec nesousedí." },
  ], {
    hints: ["Na hranici s tímto sousedem leží Krkonoše se Sněžkou.", "Jeho hlavní město je Varšava. Hranice s ním vede přes Krkonoše, Orlické hory a Jeseníky."],
    explanation: "Na severu a severovýchodě sousedí Česko s Polskem. Hranice vede přes Krkonoše, Orlické hory a Jeseníky.",
  }),
  choice("Který soused leží od Česka na východě?", "Slovensko", [
    { value: "Maďarsko", why: "Maďarsko s Českem nesousedí — leží za Slovenskem." },
    { value: "Polsko", why: "Polsko leží na severu." },
    { value: "Rakousko", why: "Rakousko leží na jihu." },
  ], {
    hints: ["S tímto státem jsme kdysi tvořili jednu zemi.", "Jeho hlavní město je Bratislava a jazyk je češtině velmi podobný. Do konce roku 1992 jsme spolu tvořili jeden společný stát."],
    explanation: "Na východě sousedí Česko se Slovenskem. Dlouhá léta jsme spolu tvořili jeden stát, Československo, a naše jazyky jsou si velmi blízké.",
  }),
  choice("Který soused leží od Česka na jihu?", "Rakousko", [
    { value: "Slovensko", why: "Slovensko leží na východě." },
    { value: "Maďarsko", why: "S Maďarskem Česko nesousedí." },
    { value: "Itálie", why: "Itálie leží mnohem jižněji, za Rakouskem a Alpami." },
  ], {
    hints: ["Hlavní město tohoto souseda je Vídeň.", "Hranice s ním vede na jihu Čech a jižní Moravy. Za ním leží Alpy."],
    explanation: "Na jihu sousedí Česko s Rakouskem. Hranice vede podél jižních Čech a jižní Moravy. Hlavní město Rakouska je Vídeň.",
  }),
  choice("Má Česko vlastní pobřeží u moře?", "Ne, Česko je vnitrozemský stát", [
    { value: "Ano, u Jaderského moře", why: "K Jaderskému moři má přístup Chorvatsko, ne Česko." },
    { value: "Ano, u Baltského moře", why: "U Baltského moře leží Polsko a Německo, Česko ne." },
    { value: "Ano, u Severního moře", why: "Do Severního moře jen odtéká Labe, pobřeží tam Česko nemá." },
  ], {
    hints: ["Obkrouž prstem hranici Česka na mapě. Dotkneš se někde moře?", "Česko je ze všech stran obklopené souší a sousedy. Jak se říká státu, který nemá pobřeží?"],
    explanation: "Česko je vnitrozemský stát — je ze všech stran obklopené souší. Na moře se jezdí přes jiné státy.",
  }),
  choice("Kolik sousedních států má Česko?", "Čtyři", [
    { value: "Tři", why: "Sousedů je víc: Německo, Polsko, Slovensko a Rakousko." },
    { value: "Pět", why: "Pět by jich bylo s Maďarskem, ale s tím Česko nesousedí." },
    { value: "Šest", why: "Tolik sousedů Česko nemá." },
  ], {
    hints: ["Na každé světové straně leží jeden velký soused.", "Sever — Polsko, západ — Německo, jih — Rakousko, východ — Slovensko. Spočítej je."],
    explanation: "Česko má čtyři sousedy: Německo, Polsko, Slovensko a Rakousko. S Maďarskem nesousedí.",
  }),
  choice("Jaký je úřední jazyk v Česku?", "Čeština", [
    { value: "Slovenština", why: "Slovenština je úřední jazyk Slovenska. Je češtině podobná, ale je to jiný jazyk." },
    { value: "Němčina", why: "Němčinou se mluví v Německu a Rakousku." },
    { value: "Polština", why: "Polštinou se mluví v Polsku." },
  ], {
    hints: ["Právě v tomhle jazyce čteš tuto otázku.", "Tímto jazykem mluví lidé v Čechách, na Moravě i ve Slezsku a píšou se jím úřední dokumenty."],
    explanation: "Úředním jazykem Česka je čeština. Mluví se jí v Čechách, na Moravě i ve Slezsku.",
  }),
  choice("Jak se jmenuje měna, kterou se platí v Česku?", "Česká koruna", [
    { value: "Euro", why: "Eurem se platí na Slovensku, v Německu nebo Rakousku, ale ne v Česku." },
    { value: "Dolar", why: "Dolarem se platí v USA." },
    { value: "Zlotý", why: "Zlotým se platí v Polsku." },
  ], {
    hints: ["Mince a bankovky mají zkratku Kč.", "Česko zatím euro nemá. Platí se tu vlastní měnou, jejíž jméno připomíná královskou čelenku."],
    explanation: "V Česku se platí českou korunou (Kč). Většina sousedů už platí eurem, Česko zatím ne.",
  }),
  choice("Ze kterých tří historických zemí se Česko skládá?", "Čechy, Morava a Slezsko", [
    { value: "Čechy, Morava a Slovensko", why: "Slovensko je samostatný stát, historickou zemí Česka není." },
    { value: "Čechy, Bavorsko a Morava", why: "Bavorsko je část Německa." },
    { value: "Morava, Slezsko a Halič", why: "Halič leží v Polsku a na Ukrajině. A chybějí Čechy." },
  ], {
    hints: ["Jedna z nich dala celému státu jméno.", "Na západě jsou Čechy, na východě Morava a na severovýchodě menší třetí země kolem Opavy a Ostravy."],
    explanation: "Česko tvoří tři historické země: Čechy, Morava a část Slezska. Proto se někdy mluví o „zemích Koruny české“.",
  }),
  choice("Ve kterém podnebném pásu leží Česko?", "V mírném pásu", [
    { value: "V tropickém pásu", why: "Tropy jsou u rovníku, je tam horko celý rok." },
    { value: "V polárním pásu", why: "Polární pás je u pólů, je tam zima skoro celý rok." },
    { value: "V pouštním pásu", why: "Pouštní pás není podnebný pás. Česko má dost srážek." },
  ], {
    hints: ["Máme u nás jaro, léto, podzim i zimu.", "Česko je daleko od rovníku i od pólů, uprostřed mezi horkem a mrazem. Jak se takový pás jmenuje?"],
    explanation: "Česko leží v mírném pásu. Proto se u nás střídají čtyři roční období a není tu ani trvalé horko, ani trvalý mráz.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Která čtyři města jsou v Česku největší?", "Praha, Brno, Ostrava a Plzeň", [
    { value: "Praha, Liberec, Olomouc a Zlín", why: "Liberec, Olomouc a Zlín jsou krajská města, ale menší než Brno, Ostrava a Plzeň." },
    { value: "Praha, Brno, Jihlava a Kladno", why: "Jihlava a Kladno jsou menší města." },
    { value: "Praha, Ostrava, Pardubice a Tábor", why: "Pardubice a Tábor nepatří mezi čtyři největší." },
  ], {
    hints: ["Za Prahou je druhé největší centrum Moravy.", "Po Praze následuje Brno, pak průmyslové město na severovýchodě a nakonec město známé pivovarem na západě Čech."],
    explanation: "Největší česká města jsou Praha, Brno, Ostrava a Plzeň. Brno je centrum jižní Moravy, Ostrava severní Moravy a Plzeň západních Čech.",
  }),
  choice("Do kterého moře nakonec doteče voda z Vltavy?", "Do Severního moře", [
    { value: "Do Černého moře", why: "Do Černého moře teče voda z Moravy přes Dunaj." },
    { value: "Do Baltského moře", why: "Do Baltského moře teče Odra." },
    { value: "Do Jaderského moře", why: "Do Jaderského moře z Česka žádná řeka neteče." },
  ], {
    hints: ["Vltava se u Mělníka vlévá do jiné řeky. Kam teče ta?", "Labe teče přes Německo na sever a u Hamburku se vlévá do moře mezi Německem a Velkou Británií."],
    explanation: "Vltava se u Mělníka vlévá do Labe a Labe teče přes Německo do Severního moře.",
  }),
  choice("Do kterého moře doteče voda z řeky Moravy?", "Do Černého moře", [
    { value: "Do Severního moře", why: "Do Severního moře teče Labe s Vltavou." },
    { value: "Do Baltského moře", why: "Do Baltského moře teče Odra." },
    { value: "Do Středozemního moře", why: "Do Středozemního moře z Česka žádná řeka neteče." },
  ], {
    hints: ["Morava se vlévá do velké řeky, která teče přes Vídeň a Budapešť.", "Dunaj teče na jihovýchod přes celou Evropu a končí v moři u Rumunska a Bulharska."],
    explanation: "Morava se vlévá do Dunaje a Dunaj teče do Černého moře. Voda z jižní Moravy tak skončí až u Rumunska.",
  }),
  choice("Do kterého moře doteče voda z Odry?", "Do Baltského moře", [
    { value: "Do Severního moře", why: "Do Severního moře teče Labe." },
    { value: "Do Černého moře", why: "Do Černého moře teče Morava přes Dunaj." },
    { value: "Do Jaderského moře", why: "Odra teče na sever, Jaderské moře je na jihu." },
  ], {
    hints: ["Odra teče z Česka na sever přes Polsko.", "Odra končí v moři, které leží na sever od Polska, u Švédska a Finska."],
    explanation: "Odra pramení v Oderských vrších, teče přes Ostravu a Polsko a vlévá se do Baltského moře.",
  }),
  choice("Proč se o Česku říká, že leží v srdci Evropy?", "Leží uprostřed Evropy a vedou přes něj cesty", [
    { value: "Má tvar srdce", why: "Tvar Česka srdce nepřipomíná. Jde o polohu." },
    { value: "Je největším státem Evropy", why: "Česko je malé, největší je Rusko. Jde o polohu uprostřed." },
    { value: "Leží u moře uprostřed Evropy", why: "Česko u moře neleží." },
  ], {
    hints: ["Srdce je v těle uprostřed.", "Česko leží mezi západem a východem i mezi severem a jihem Evropy. Co to znamená pro cesty, obchod a cestování?"],
    explanation: "Česko leží uprostřed Evropy. Přes jeho území odedávna vedly obchodní cesty a dnes tudy jezdí auta i vlaky mezi západem a východem, severem a jihem.",
  }),
  choice("Jak se jmenoval společný stát Čechů a Slováků?", "Československo", [
    { value: "Rakousko-Uhersko", why: "Rakousko-Uhersko byla monarchie, ze které Československo roku 1918 vzniklo." },
    { value: "Velká Morava", why: "Velká Morava byl slovanský stát v 9. století, dávno před Československem." },
    { value: "Svatá říše římská", why: "Svatá říše římská byla středověká říše, ne stát Čechů a Slováků." },
  ], {
    hints: ["Název spojuje jména obou národů.", "Stát vznikl 28. října 1918 a zanikl, když se na konci roku 1992 rozdělil na dvě země."],
    explanation: "Češi a Slováci žili v jednom státě, Československu, od roku 1918 do konce roku 1992. Pak se stát pokojně rozdělil na Česko a Slovensko.",
  }),
  choice("Kdy vznikly samostatné státy Česko a Slovensko?", "1. ledna 1993", [
    { value: "28. října 1918", why: "Tehdy vzniklo Československo, společný stát." },
    { value: "17. listopadu 1989", why: "Tehdy začala sametová revoluce, stát se ale ještě nerozdělil." },
    { value: "1. května 2004", why: "Tehdy Česko vstoupilo do Evropské unie." },
  ], {
    hints: ["Stalo se to na Nový rok.", "Československo se rozdělilo po sametové revoluci, na začátku roku, který končí trojkou."],
    explanation: "Samostatné Česko a Slovensko vznikly 1. ledna 1993, když se Československo pokojně rozdělilo.",
  }),
  choice("Od kterého roku je Česko členem Evropské unie?", "Od roku 2004", [
    { value: "Od roku 1993", why: "V roce 1993 vzniklo samostatné Česko, do Evropské unie vstoupilo později." },
    { value: "Od roku 1999", why: "V roce 1999 vstoupilo Česko do NATO, ne do Evropské unie." },
    { value: "Od roku 2010", why: "Tou dobou už bylo Česko v Evropské unii šest let." },
  ], {
    hints: ["Stalo se to 1. května, ve stejném roce jako u Slovenska a Polska.", "Česko vstoupilo do Evropské unie jedenáct let po svém vzniku v roce 1993, pět let po vstupu do NATO. Přičti k roku 1993 jedenáct."],
    explanation: "Česko je členem Evropské unie od 1. května 2004. Do obranné aliance NATO vstoupilo už v roce 1999.",
  }),
  choice("Které město je druhé největší v Česku?", "Brno", [
    { value: "Ostrava", why: "Ostrava je třetí největší." },
    { value: "Plzeň", why: "Plzeň je čtvrtá největší." },
    { value: "Olomouc", why: "Olomouc je menší než Brno, Ostrava i Plzeň." },
  ], {
    hints: ["Je to hlavní město Moravy.", "Stojí v něm hrad Špilberk a sídlí v něm Ústavní soud. Je to krajské město Jihomoravského kraje."],
    explanation: "Druhým největším městem Česka je Brno, centrum jižní Moravy. Za ním následují Ostrava a Plzeň.",
  }),
  choice("Se kterým sousedem má Česko nejdelší hranici?", "S Německem", [
    { value: "S Polskem", why: "Hranice s Polskem je dlouhá, ale o něco kratší než s Německem." },
    { value: "Se Slovenskem", why: "Hranice se Slovenskem je kratší." },
    { value: "S Rakouskem", why: "Hranice s Rakouskem je nejkratší z těchto čtyř." },
  ], {
    hints: ["Tento soused obklopuje Čechy ze dvou stran.", "Hranice s ním vede po Šumavě na jihozápadě, přes Krušné hory na severozápadě až k Liberci."],
    explanation: "Nejdelší hranici má Česko s Německem — vede ze Šumavy přes Český les a Krušné hory až na sever Čech. Hranice s Polskem je jen o málo kratší.",
  }),
  choice("Kterým směrem leží Brno od Prahy?", "Na jihovýchod", [
    { value: "Na sever", why: "Na sever od Prahy leží Ústí nad Labem a Liberec." },
    { value: "Na západ", why: "Na západ od Prahy leží Plzeň." },
    { value: "Na jihozápad", why: "Na jihozápad leží Šumava. Brno je na opačné straně." },
  ], {
    hints: ["Brno je na Moravě. Kde leží Morava vzhledem k Čechám?", "Morava je na východě a jižní Morava na jihu. Spoj ty dva směry dohromady."],
    explanation: "Brno leží na jihu Moravy, tedy od Prahy na jihovýchod. Po dálnici D1 je to asi 200 kilometrů.",
  }),
  choice("Kterým sousedním státem protéká Labe, než doteče do moře?", "Německem", [
    { value: "Polskem", why: "Polskem teče Odra, ne Labe." },
    { value: "Rakouskem", why: "Rakouskem teče Dunaj." },
    { value: "Slovenskem", why: "Labe teče na sever, Slovensko je na východě." },
  ], {
    hints: ["Labe opouští Česko u Děčína a teče na sever.", "Na severu Čech za Děčínem leží soused, jehož velké přístavní město na Labi je Hamburk."],
    explanation: "Labe opouští Česko u Hřenska za Děčínem a teče přes Německo — kolem Drážďan a Hamburku — do Severního moře.",
  }),
  choice("Které pohoří tvoří velkou část hranice s Polskem?", "Krkonoše a Jeseníky", [
    { value: "Šumava", why: "Šumava leží na hranici s Německem a Rakouskem." },
    { value: "Krušné hory", why: "Krušné hory leží na hranici s Německem." },
    { value: "Bílé Karpaty", why: "Bílé Karpaty leží na hranici se Slovenskem." },
  ], {
    hints: ["Hledej hory na severu Česka.", "V jednom z těch pohoří je Sněžka, nejvyšší hora Česka. To druhé leží na severu Moravy."],
    explanation: "Velkou část hranice s Polskem tvoří horský oblouk na severu: Krkonoše se Sněžkou, Orlické hory a Jeseníky.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Proč se Česku říká „střecha Evropy“?", "Řeky z něj odtékají do tří různých moří", [
    { value: "Má nejvyšší hory Evropy", why: "Nejvyšší hory Evropy jsou Alpy a Kavkaz. Sněžka je mnohem nižší." },
    { value: "Leží na nejvyšším místě Evropy", why: "Česko není nejvýš položenou zemí Evropy." },
    { value: "Je z něj vidět celá Evropa", why: "Z českých hor celou Evropu neuvidíš." },
  ], {
    hints: ["Ze střechy stéká voda na různé strany.", "Labe teče do Severního moře, Odra do Baltského a Morava přes Dunaj do Černého. Odkud voda stéká na tolik stran?"],
    explanation: "Z Česka odtéká voda do tří moří: Labem do Severního, Odrou do Baltského a Moravou přes Dunaj do Černého. Česko je jako střecha, ze které voda stéká na různé strany.",
  }),
  choice("Proč musí Česko zboží z lodí dovážet přes jiné státy?", "Nemá moře ani vlastní námořní přístav", [
    { value: "Česko lodě zakazuje", why: "Lodě zakázané nejsou, jen k nim Česko nemá moře." },
    { value: "Po českých řekách lodě nejezdí", why: "Po Labi a Vltavě lodě jezdí, ale ty velké námořní připlouvají jen do mořských přístavů." },
    { value: "Je to levnější než vlastní přístav", why: "Nejde o cenu. Česko přístav mít nemůže, protože neleží u moře." },
  ], {
    hints: ["Kde přistávají velké námořní lodě?", "Velké lodě s kontejnery připlouvají do přístavů u moře, třeba do Hamburku. Česko je vnitrozemské. Jak se zboží dostane dál?"],
    explanation: "Česko je vnitrozemský stát, nemá moře ani námořní přístav. Zboží z lodí se vykládá v cizích přístavech, třeba v Hamburku, a do Česka jede vlakem, kamionem nebo lodí po Labi.",
  }),
  choice("Vydáš se z Prahy přímo na sever. Do kterého státu dojdeš?", "Do Německa", [
    { value: "Do Polska", why: "Polsko leží spíš na severovýchod. Přímo na sever od Prahy je Německo." },
    { value: "Do Rakouska", why: "Rakousko leží na jihu." },
    { value: "Do Slovenska", why: "Slovensko leží na východě." },
  ], {
    hints: ["Polsko je sice na severu Česka, ale kde přesně vzhledem k Praze?", "Přímo na sever od Prahy leží Ústí nad Labem a za ním Krušné hory a Drážďany. Ve kterém státě jsou Drážďany?"],
    explanation: "Přímo na sever od Prahy leží Ústí nad Labem a hned za hranicí Německo s Drážďany. Polsko je od Prahy spíš na severovýchod, za Libercem a Krkonošemi.",
  }),
  choice("Vydáš se z Brna přímo na jih. Do kterého státu dojdeš?", "Do Rakouska", [
    { value: "Do Slovenska", why: "Slovensko leží od Brna spíš na východ a jihovýchod." },
    { value: "Do Maďarska", why: "Maďarsko je dál a s Českem nesousedí." },
    { value: "Do Německa", why: "Německo leží na západě." },
  ], {
    hints: ["Na jih od Brna leží Mikulov a Pálava.", "Z Mikulova je to kousek přes hranici a pak dál na jih do velkého města na Dunaji. Ve kterém státě leží Vídeň?"],
    explanation: "Na jih od Brna leží Mikulov a hned za hranicí Rakousko. Vídeň je od Brna jen asi 130 kilometrů.",
  }),
  choice("Proč si Češi a Slováci dobře rozumějí?", "Dlouho žili v jednom státě a jazyky mají podobné", [
    { value: "Mluví úplně stejným jazykem", why: "Čeština a slovenština jsou dva jazyky, jen si jsou velmi podobné." },
    { value: "Platí stejnou měnou", why: "Slovensko platí eurem a Česko korunou." },
    { value: "Mají stejné hlavní město", why: "Hlavní město Česka je Praha, Slovenska Bratislava." },
  ], {
    hints: ["Jak se jmenoval stát, který Češi a Slováci měli společný?", "Přes 70 let žili v Československu, poslouchali stejné rádio a četli stejné knihy. Jaké mají jazyky?"],
    explanation: "Češi a Slováci žili přes 70 let v jednom státě, Československu. Jejich jazyky jsou si tak blízké, že si rozumějí i bez učení.",
  }),
  choice("Proč se v Česku střídají čtyři roční období?", "Leží v mírném pásu", [
    { value: "Leží u rovníku", why: "U rovníku je horko celý rok a roční období jako u nás tam nejsou." },
    { value: "Leží u moře", why: "Česko u moře neleží. Roční období souvisí s polohou na Zemi." },
    { value: "Má vysoké hory", why: "Hory to nezpůsobují, roční období jsou i v nížinách." },
  ], {
    hints: ["Jak je u rovníku a jak u pólu?", "U rovníku je stále horko, u pólů stále mráz. Česko leží mezi nimi. Jak se ten pás jmenuje?"],
    explanation: "Česko leží v mírném pásu, mezi horkými tropy a studenými póly. Proto se u nás střídá teplé léto, studená zima a mezi nimi jaro a podzim.",
  }),
  choice("Proč přes Česko jezdí tolik kamionů z ciziny?", "Vedou tudy cesty mezi západem a východem Evropy", [
    { value: "V Česku je nejlevnější benzín", why: "Cena benzínu to nevysvětlí. Důvodem je poloha uprostřed Evropy." },
    { value: "Kamiony nesmějí jezdit jinudy", why: "Jezdit mohou i jinudy, ale přes Česko je to často nejkratší cesta." },
    { value: "Česko je největší stát Evropy", why: "Česko je malé. Důležitá je jeho poloha." },
  ], {
    hints: ["Kudy nejkratší cestou z Německa do Polska nebo na Slovensko?", "Česko leží mezi Německem, Polskem, Slovenskem a Rakouskem. Co to znamená pro kamion, který veze zboží z jednoho do druhého?"],
    explanation: "Česko leží uprostřed Evropy mezi západem a východem. Nejkratší cesty mezi Německem, Polskem, Slovenskem a Rakouskem často vedou přes Česko.",
  }),
  choice("Kterým směrem teče Labe, když opouští Česko?", "Na sever do Německa", [
    { value: "Na jih do Rakouska", why: "Na jih teče Morava. Labe teče na sever." },
    { value: "Na východ na Slovensko", why: "Labe teče opačným směrem, na sever." },
    { value: "Na západ do Bavorska", why: "Labe opouští Česko na severu, u Děčína." },
  ], {
    hints: ["Labe pramení v Krkonoších a nakonec doteče do Severního moře.", "Z Krkonoš teče Labe přes Hradec Králové a Mělník k Děčínu. Za Děčínem opustí Česko — jakým směrem?"],
    explanation: "Labe opouští Česko u Děčína a teče na sever přes Německo do Severního moře.",
  }),
  choice("Morava teče z Česka na jih, Odra na sever. Co z toho plyne?", "Jejich voda skončí v různých mořích", [
    { value: "Obě doteče do stejného moře", why: "Neteče. Morava skončí v Černém moři, Odra v Baltském." },
    { value: "Obě řeky tečou do Vltavy", why: "Morava ani Odra se do Vltavy nevlévají." },
    { value: "Obě řeky pramení v Praze", why: "Morava pramení na Králickém Sněžníku a Odra v Oderských vrších." },
  ], {
    hints: ["Kam teče řeka, která teče na jih, a kam ta, která teče na sever?", "Morava se vlévá do Dunaje a ten teče do Černého moře. Odra teče přes Polsko do Baltu. Jsou to stejná moře?"],
    explanation: "Morava teče na jih do Dunaje a Černého moře, Odra na sever do Baltského moře. Jejich prameny jsou přitom na Moravě blízko sebe — leží tu hranice mezi povodími.",
  }),
  choice("Který soused Česka má nejvíc obyvatel?", "Německo", [
    { value: "Polsko", why: "Polsko má asi 37 milionů obyvatel, Německo přes 80 milionů." },
    { value: "Rakousko", why: "Rakousko má asi 9 milionů obyvatel, méně než Česko." },
    { value: "Slovensko", why: "Slovensko má asi 5 milionů obyvatel." },
  ], {
    hints: ["Česko má skoro 11 milionů obyvatel. Který soused jich má mnohonásobně víc?", "Tento soused má přes 80 milionů obyvatel — nejvíc ze všech států Evropské unie. Jeho hlavní město je Berlín."],
    explanation: "Nejlidnatějším sousedem je Německo s více než 80 miliony obyvatel. Polsko má asi 37 milionů, Rakousko 9 a Slovensko 5 milionů.",
  }),
  choice("Proč je hlavním městem Praha, a ne Brno?", "Od středověku tu sídlili čeští králové", [
    { value: "Praha leží přesně uprostřed Česka", why: "Praha není přesně uprostřed. Důvod je historický." },
    { value: "Brno je moc malé", why: "Brno je druhé největší město. Rozhodla historie, ne velikost." },
    { value: "Praha leží u moře", why: "Praha u moře neleží." },
  ], {
    hints: ["Kde stojí hrad, na kterém bydleli čeští panovníci?", "Na Pražském hradě sídlili Přemyslovci i Karel IV. a dnes tam sídlí prezident. Jak dlouho už je Praha centrem země?"],
    explanation: "Praha je hlavním městem od středověku — sídlili tu čeští knížata a králové a vyrostla v největší město. Brno bylo hlavním městem Moravy.",
  }),
  choice("Se kterou zemí Česko nesousedí, i když je blízko?", "S Maďarskem", [
    { value: "Se Slovenskem", why: "Se Slovenskem Česko sousedí na východě." },
    { value: "S Rakouskem", why: "S Rakouskem Česko sousedí na jihu." },
    { value: "S Polskem", why: "S Polskem Česko sousedí na severu." },
  ], {
    hints: ["Tři z nabídnutých států s Českem sousedí.", "Tahle země leží na jih od Slovenska a jejím hlavním městem je Budapešť. Mezi ní a Českem je Slovensko."],
    explanation: "Česko nesousedí s Maďarskem — mezi nimi leží Slovensko. Sousedy Česka jsou Německo, Polsko, Slovensko a Rakousko.",
  }),
  choice("Kudy vede na Moravě hranice mezi povodím Černého a Baltského moře?", "Na Moravě blízko pramenů Moravy a Odry", [
    { value: "Středem Prahy", why: "Praha leží v povodí Labe a Severního moře, ne na této hranici." },
    { value: "Po celé hranici s Rakouskem", why: "Na jihu je celé území v povodí Dunaje a Černého moře." },
    { value: "Přes Šumavu", why: "Šumavou vede hranice mezi povodím Severního a Černého moře, ne Baltského." },
  ], {
    hints: ["Hledej místo, kde pramení řeky tekoucí do Černého i Baltského moře.", "Morava teče na jih a Odra na sever, a jejich prameny jsou nedaleko sebe na severu Moravy. Tam musí být hranice."],
    explanation: "Hranice mezi povodím Černého a Baltského moře vede přes Moravu — mezi prameny Moravy a Odry. Voda z jedné strany teče na jih k Dunaji, z druhé na sever do Polska.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const POLOHACRVEVROPESOUSEDNISTATY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-poloha-cr-v-evrope-sousedni-staty",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-poloha-cr-v-evrope-sousedni-staty",
    title: "Poloha ČR v Evropě, sousední státy",
    studentTitle: "ČR v Evropě",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš polohu ČR, sousední státy a základní fakta o naší zemi.",
    keywords: ["česká republika", "evropa", "sousední státy", "Německo", "Polsko", "Slovensko", "Rakousko", "Praha"],
    goals: [
      "Vyjmenovat 4 sousední státy ČR a určit jejich polohu",
      "Určit polohu ČR v Evropě",
      "Vyjmenovat největší česká města",
      "Vysvětlit, co znamená vnitrozemská poloha a proč je Česko „střechou Evropy“",
    ],
    boundaries: ["Podrobná geopolitika není cílem", "Historické hranice ČR nejsou vyžadovány"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Česko leží ve střední Evropě. Čtyři sousedé: Německo (západ), Polsko (sever), Slovensko (východ), Rakousko (jih).",
      steps: [
        "Vzpomeň si na mapu Evropy a najdi Česko uprostřed.",
        "Urči, kdo leží na které světové straně.",
        "Česko nemá moře — je to vnitrozemský stát.",
      ],
      commonMistake: "S Maďarskem Česko nesousedí — mezi nimi leží Slovensko.",
      example: "Vltava → Labe → Německo → Severní moře.",
    },
  },
];
