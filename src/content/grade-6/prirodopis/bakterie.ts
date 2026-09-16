/**
 * Přírodopis 6. ročník — Bakterie: stavba, význam, bakteriální nemoci (select_one).
 *
 * Faktické téma: poznat bakterii podle stavby (jedna buňka bez jádra, buněčná
 * stěna, jaderná hmota volně v cytoplazmě, někdy bičík nebo pouzdro), rozlišit,
 * kde bakterie pomáhají a kde škodí, a u bakteriální nemoci vybrat správný
 * postup (antibiotika od lékaře, prevence očkováním, hygienou a tepelnou úpravou).
 *
 * Stavba podle zlatého vzoru `dejepis/lovciMamutuVestonickaVenuse.ts`:
 * disjunktní banky POOL_L1 / POOL_L2 / POOL_L3 (každá aspoň 17 položek),
 * helpery výhradně z `./_shared`. Rotace bankou se nastaví na začátku gen(),
 * takže generátor nemá stav mezi voláními.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • bakterie = virus — antibiotika na chřipku a rýmu, klíšťová encefalitida
 *    místo boreliózy, virová nemoc nabídnutá jako bakteriální;
 *  • chybná stavba — bakterie s jádrem, bez stěny, bez dědičné informace,
 *    mnohobuněčná; v popisu organismu záměna s prvokem nebo řasou;
 *  • „všechny bakterie škodí" — kvašení a rozklad připsané plísním, virům
 *    nebo samovolnému ději;
 *  • hygienické a zdravotní mýty — chlad bakterie zabije, maso stačí omýt,
 *    klíště se namaže máslem, klíště je hmyz.
 *
 *  • L1 — zapamatování: přímá otázka na pojem, stavbu nebo příklad nemoci.
 *  • L2 — použití: běžná situace popsaná jednou dvěma větami → co se děje, co udělat.
 *  • L3 — analýza a přenos: rozhodnutí o léčbě, určení organismu z popisu
 *    znaků, znak → funkce, posouzení tvrzení.
 *
 * Fakta jen ta, na kterých se shodují učebnice přírodopisu 6. ročníku
 * (Fraus, Nová škola, SPN). Zdravotní rady odpovídají doporučením SZÚ.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  key: string;
  d: [Distractor, Distractor, Distractor];
  hints: [string, string];
  explanation: string;
}

// ── L1 — zapamatování ────────────────────────────────────────────────────
const POOL_L1: Polozka[] = [
  {
    q: "Co bakteriální buňka NEMÁ?",
    key: "jádro ohraničené membránou",
    d: [
      { value: "pevnou buněčnou stěnu", why: "Bakterie buněčnou stěnu má, drží jí tvar. Chybí jí jádro ohraničené membránou." },
      { value: "cytoplazmu uvnitř buňky", why: "Cytoplazmu má každá buňka, bakterie také. Chybí jí jádro ohraničené membránou." },
      { value: "dědičnou informaci (DNA)", why: "Dědičnou informaci (DNA) bakterie má. Leží ale volně v cytoplazmě, není uzavřená v jádře." },
    ],
    hints: [
      "Porovnej bakterii s buňkou rostliny nebo živočicha. Která část, kterou mají ony, bakterii chybí?",
      "Bakterie má obal, cytoplazmu i dědičnou informaci. Rozmysli si, jestli je její dědičná informace uzavřená v samostatném útvaru, nebo leží volně.",
    ],
    explanation: "Bakterie má buněčnou stěnu, cytoplazmu i dědičnou informaci. Nemá ale jádro ohraničené membránou: její jaderná hmota leží volně v cytoplazmě. Tím se liší od buněk rostlin, hub a živočichů.",
  },
  {
    q: "Čím se některé bakterie aktivně pohybují?",
    key: "tenkým bičíkem",
    d: [
      { value: "vysouvanými panožkami", why: "Panožkami se pohybuje měňavka, což je prvok s jádrem. Bakterie se pohybují bičíkem." },
      { value: "brvami po celém povrchu", why: "Brvami po celém těle se pohybuje trepka, což je prvok. Pohyblivé bakterie mají bičík." },
      { value: "svalovými vlákny", why: "Svaly mají mnohobuněční živočichové. Bakterie je jediná buňka a pohybuje se bičíkem." },
    ],
    hints: [
      "Představ si jednu drobnou buňku, která plave v kapce vody. Co jí může sloužit jako pohon?",
      "Svaly mají jen mnohobuněční živočichové a panožky i brvy patří prvokům. Bakterie používá tenký vláknitý útvar, který se otáčí jako lodní šroub.",
    ],
    explanation: "Pohyblivé bakterie mají jeden nebo více bičíků. Bičík se otáčí a bakterii posouvá v tekutině. Panožky a brvy mají prvoci, svaly mnohobuněční živočichové.",
  },
  {
    q: "Jak se bakterie nejčastěji rozmnožují?",
    key: "dělením buňky na dvě",
    d: [
      { value: "semeny roznášenými větrem", why: "Semeny se rozmnožují semenné rostliny. Bakterie jsou jednobuněčné a množí se dělením." },
      { value: "pučením jako kvasinky", why: "Pučením se množí kvasinky, což jsou houby s jádrem. Bakterie se nejčastěji množí tak, že se buňka rozdělí na dvě." },
      { value: "výtrusy z plodnic", why: "Výtrusy z plodnic tvoří houby. Bakterie se množí tak, že se buňka rozdělí na dvě." },
    ],
    hints: [
      "Bakterie má jen jednu buňku. Jak může z jedné buňky vzniknout víc nových bakterií?",
      "Semena mají rostliny, plodnice s výtrusy houby a kvasinkám vyrůstají drobné výrůstky. Bakterie si vystačí s tím nejjednodušším, co umí její jediná buňka.",
    ],
    explanation: "Bakterie se rozmnožují dělením: buňka zdvojí dědičnou informaci a rozdělí se na dvě nové bakterie. Za vhodných podmínek se to opakuje každých několik desítek minut.",
  },
  {
    q: "Z kolika buněk je složeno tělo jedné bakterie?",
    key: "z jediné buňky",
    d: [
      { value: "z desítek buněk v řetízku", why: "Některé bakterie tvoří řetízky, ale každý článek je samostatná bakterie. Jedna bakterie je jedna buňka." },
      { value: "ze dvou buněk spojených stěnou", why: "Dvě spojené buňky vidíš těsně po rozdělení. Pak jsou to už dvě bakterie, každá z jedné buňky." },
      { value: "ze žádné, nemá buněčnou stavbu", why: "Buněčnou stavbu nemají viry. Bakterie je živá buňka." },
    ],
    hints: [
      "Vzpomeň si, do které skupiny organismů bakterie patří podle počtu buněk.",
      "Buněčnou stavbu nemají viry, bakterie ji mají. Některé bakterie sice drží pohromadě v řetízku nebo shluku, ale ptej se, z čeho je každá z nich.",
    ],
    explanation: "Bakterie jsou jednobuněčné organismy: celé tělo bakterie tvoří jediná buňka. Řetízek nebo shluk bakterií je skupina samostatných jedinců.",
  },
  {
    q: "Čím můžeme pozorovat jednotlivé bakterie?",
    key: "mikroskopem",
    d: [
      { value: "ruční lupou", why: "Lupa zvětší jen několikrát. Bakterie jsou tak malé, že je uvidíš až mikroskopem." },
      { value: "pouhým okem zblízka", why: "Okem uvidíš nanejvýš povlak z milionů bakterií, třeba na zkaženém jídle. Jednotlivou bakterii ne." },
      { value: "nedají se pozorovat vůbec", why: "To platí spíš o virech ve světelném mikroskopu. Bakterie v něm vidět jsou." },
    ],
    hints: [
      "Bakterie měří jen tisíciny milimetru. Kolikrát je potřeba obraz zvětšit, abys ji uviděl?",
      "Okem ani lupou tak malé předměty nerozlišíš, lupa zvětší jen několikrát. Potřebuješ přístroj, který zvětší stokrát až tisíckrát, a ten znáš z hodin přírodopisu.",
    ],
    explanation: "Bakterie měří jen tisíciny milimetru, proto je pozorujeme mikroskopem. Lupa zvětšuje málo a okem uvidíme jen celé kolonie bakterií.",
  },
  {
    q: "Kam patří bakterie mezi živými organismy?",
    key: "k jednobuněčným organismům bez jádra",
    d: [
      { value: "k drobným rostlinám bez listů a květů", why: "Bakterie nejsou rostliny. Nemají jádro a většina z nich si nevyrábí živiny ze světla." },
      { value: "k nejmenším živočichům s vlastním pohybem", why: "Některé bakterie se sice pohybují, ale nejsou to živočichové. Jejich buňka nemá jádro." },
      { value: "k virům, které také způsobují nemoci", why: "Viry nemají buněčnou stavbu, bakterie jsou živé buňky. Nemoc způsobují jen některé bakterie." },
    ],
    hints: [
      "Zeptej se, z kolika buněk bakterie je a co v její buňce chybí.",
      "Rostliny, houby i živočichové mají v buňkách jádro, viry nemají buňku vůbec. Bakterie tvoří samostatnou skupinu, poznáš ji podle toho, co v jejích buňkách chybí.",
    ],
    explanation: "Bakterie jsou samostatná skupina jednobuněčných organismů, jejichž buňka nemá jádro. Nejsou to rostliny, houby, živočichové ani viry.",
  },
  {
    q: "Jaký tvar mají bakterie zvané koky?",
    key: "kulovitý",
    d: [
      { value: "tyčinkovitý", why: "Tyčinkovitý tvar mají tyčinky. Koky jsou kulovité." },
      { value: "spirálovitě stočený", why: "Stočené jsou spirálovité bakterie. Koky jsou kulovité." },
      { value: "nepravidelný, stále se měnící", why: "Měnící se tvar má měňavka, protože nemá pevný obal. Bakterie má stěnu a drží stálý tvar." },
    ],
    hints: [
      "Bakterie mají tři základní tvary. Který z nich se skrývá pod slovem koky?",
      "Bakterie má pevnou buněčnou stěnu, a proto drží stálý tvar. Rozlišujeme kulovité, tyčinkovité a spirálovité bakterie.",
    ],
    explanation: "Koky jsou kulovité bakterie, často spojené do řetízků nebo shluků. Další tvary jsou tyčinky a spirály. Stálý tvar bakterii dává pevná buněčná stěna.",
  },
  {
    q: "Kde leží dědičná informace bakterie?",
    key: "volně v cytoplazmě",
    d: [
      { value: "v jádře s membránou", why: "Jádro s membránou mají buňky rostlin, hub a živočichů. Bakterie jádro nemá." },
      { value: "v buněčné stěně", why: "Stěna je pevný obal, který bakterii chrání a drží tvar. Dědičná informace je uvnitř buňky." },
      { value: "v otáčivém bičíku", why: "Bičík slouží k pohybu. Dědičná informace leží uvnitř buňky." },
    ],
    hints: [
      "Bakterie nemá jádro. Kde tedy může její dědičná informace ležet?",
      "Stěna je obal a bičík slouží k pohybu, ani jedno dědičnou informaci neuchovává. Bez jádra musí jaderná hmota ležet přímo v tom, čím je buňka vyplněná.",
    ],
    explanation: "Bakterie nemá jádro, a proto její dědičná informace (jaderná hmota) leží volně v cytoplazmě. Stěna buňku chrání a bičík slouží k pohybu.",
  },
  {
    q: "Jak se nazývají léky, které ničí bakterie?",
    key: "antibiotika",
    d: [
      { value: "vitamíny", why: "Vitamíny tělo potřebuje, ale bakterie neničí." },
      { value: "očkovací látky", why: "Očkování nemoci předchází, naučí tělo bránit se. Bakterie v nemocném těle neničí." },
      { value: "sirupy proti kašli", why: "Sirup jen zmírní kašel, na původce nemoci nepůsobí." },
    ],
    hints: [
      "Jde o léky, které předepisuje lékař na bakteriální nemoci, třeba na streptokokovou angínu.",
      "Očkování nemoci předchází a sirup jen zmírní kašel. Hledáš lék, který přímo zabíjí bakterie nebo zastaví jejich množení. Tentýž druh léku dostává nemocný s boreliózou.",
    ],
    explanation: "Léky, které ničí bakterie nebo zastaví jejich množení, se nazývají antibiotika. Předepisuje je lékař. Na viry nepůsobí.",
  },
  {
    q: "Jak se nazývá bakteriální nemoc, kterou může přenést klíště?",
    key: "lymeská borelióza",
    d: [
      { value: "klíšťová encefalitida", why: "Klíšťovou encefalitidu klíště také přenáší, ale způsobuje ji virus, ne bakterie." },
      { value: "chřipka", why: "Chřipku způsobuje virus a šíří se kapénkami, ne klíšťaty." },
      { value: "spalničky", why: "Spalničky jsou virová nemoc přenášená vzduchem, ne klíšťaty." },
    ],
    hints: [
      "Klíště přenáší dvě známé nemoci. Jednu způsobuje virus, druhou bakterie. Kterou myslí otázka?",
      "Proti virové nemoci z klíštěte se dá očkovat a její název obsahuje slovo klíšťová. Bakteriální nemoc se často pozná podle zarudlého kruhu kolem místa přisátí.",
    ],
    explanation: "Klíště může přenést bakterie borelie, které způsobují lymeskou boreliózu. Typickým příznakem je zarudlý kruh kolem místa přisátí. Klíšťovou encefalitidu způsobuje virus.",
  },
  {
    q: "Která z těchto nemocí je bakteriální?",
    key: "tetanus",
    d: [
      { value: "chřipka", why: "Chřipku způsobuje virus. Antibiotika na ni nepůsobí." },
      { value: "plané neštovice", why: "Plané neštovice způsobuje virus." },
      { value: "rýma", why: "Rýmu způsobují viry." },
    ],
    hints: [
      "Roztřiď nabídnuté nemoci na ty, které způsobují viry, a na tu, kterou způsobuje bakterie.",
      "Běžné nachlazení, chřipka a dětské nemoci s vyrážkou jsou virové. Bakteriální nemoc z nabídky hrozí po poranění, když se do rány dostane hlína.",
    ],
    explanation: "Tetanus způsobuje bakterie, která žije v půdě a do těla se dostane ranou. Chřipka, plané neštovice i rýma jsou virové nemoci.",
  },
  {
    q: "Kterou nemoc způsobují bakterie?",
    key: "salmonelóza",
    d: [
      { value: "spalničky", why: "Spalničky způsobuje virus." },
      { value: "plané neštovice", why: "Plané neštovice způsobuje virus." },
      { value: "klíšťová encefalitida", why: "Klíšťovou encefalitidu způsobuje virus přenášený klíštětem." },
    ],
    hints: [
      "U každé nemoci si vzpomeň, jestli ji způsobuje virus, nebo bakterie.",
      "Nemoci s vyrážkou z dětství a nemoc z klíštěte, proti které se očkuje, jsou virové. Bakteriální nemoc z nabídky hrozí po jídle z nedostatečně tepelně upravených vajec nebo masa.",
    ],
    explanation: "Salmonelózu způsobují bakterie salmonely, nejčastěji z nedostatečně tepelně upravených vajec nebo masa. Spalničky, plané neštovice i klíšťová encefalitida jsou virové.",
  },
  {
    q: "Která nemoc patří mezi bakteriální?",
    key: "tuberkulóza",
    d: [
      { value: "rýma", why: "Rýmu způsobují viry." },
      { value: "spalničky", why: "Spalničky způsobuje virus." },
      { value: "chřipka", why: "Chřipku způsobuje virus, antibiotika na ni nezabírají." },
    ],
    hints: [
      "Tři z nabídnutých nemocí způsobují viry. Najdi tu, která mezi ně nepatří.",
      "Chřipka, rýma a dětské nemoci s vyrážkou jsou virové. Bakteriální nemoc z nabídky napadá hlavně plíce a dřív se proti ní povinně očkovalo všechny novorozence.",
    ],
    explanation: "Tuberkulózu způsobuje bakterie a napadá hlavně plíce. Léčí se antibiotiky. Rýma, spalničky i chřipka jsou virové nemoci.",
  },
  {
    q: "Kterou nemoc v krku často způsobují bakterie streptokoky?",
    key: "angínu",
    d: [
      { value: "rýmu", why: "Rýmu způsobují viry a postihuje nos, ne mandle." },
      { value: "plané neštovice", why: "Plané neštovice způsobuje virus a projevují se vyrážkou po těle." },
      { value: "spalničky", why: "Spalničky způsobuje virus a projevují se vyrážkou a horečkou." },
    ],
    hints: [
      "Streptokoky napadají v krku mandle. Jak se jmenuje zánět mandlí?",
      "Rýma postihuje nos, neštovice a spalničky se projevují vyrážkou po celém těle. Hledáš nemoc, při které bolí v krku a mandle jsou oteklé a zarudlé.",
    ],
    explanation: "Streptokoky způsobují hnisavou angínu, tedy zánět mandlí. Lékař ji léčí antibiotiky. Rýma, plané neštovice a spalničky jsou virové nemoci.",
  },
  {
    q: "Proti které bakteriální nemoci jsou u nás děti povinně očkovány?",
    key: "proti tetanu",
    d: [
      { value: "proti lymeské borelióze", why: "Proti borelióze se zatím běžně neočkuje, povinné očkování proti ní není. U klíšťat se očkuje proti klíšťové encefalitidě, a to je virová nemoc." },
      { value: "proti rýmě", why: "Rýma je virová a očkování proti ní neexistuje." },
      { value: "proti angíně", why: "Angína může být bakteriální, ale očkování proti ní neexistuje. Léčí ji lékař antibiotiky." },
    ],
    hints: [
      "Vzpomeň si, proti čemu ti lékař dává očkování i po hlubokém poranění špinavým předmětem, třeba hřebíkem od hlíny.",
      "Proti rýmě ani angíně očkování neexistuje a u klíšťat se očkuje proti virové nemoci. Hledáš bakteriální nemoc, jejíž původce žije v půdě a do těla vnikne ranou.",
    ],
    explanation: "Děti jsou u nás povinně očkovány proti tetanu (spolu s dalšími nemocemi). Očkování se po letech opakuje, protože ochrana časem slábne, a bakterie tetanu žijí v půdě, takže mohou vniknout do každé špinavé rány.",
  },
  {
    q: "Jakou roli mají bakterie žijící v půdě?",
    key: "rozkládají odumřelé zbytky organismů",
    d: [
      { value: "rozrušují horniny a mění je v písek", why: "Horniny rozrušuje hlavně voda, mráz a teplo. Půdní bakterie rozkládají odumřelé zbytky." },
      { value: "napadají a ničí kořeny všech rostlin", why: "Škodí jen některé bakterie. Většina půdních bakterií rostlinám pomáhá, protože z odumřelých zbytků uvolňuje živiny." },
      { value: "obalují semena a chrání je před mrazem", why: "Semena chrání jejich vlastní obal. Půdní bakterie rozkládají odumřelé zbytky." },
    ],
    hints: [
      "Co by se stalo s listím a mrtvými živočichy, kdyby v půdě nebyly žádné bakterie?",
      "V lese každý rok spadne spousta listí, a přesto ho nepřibývá. Kam se ztrácí a co z něj pak využijí rostliny?",
    ],
    explanation: "Půdní bakterie jsou rozkladači: rozkládají odumřelé zbytky rostlin a živočichů na látky, které pak znovu využijí rostliny. Bez nich by se příroda zahltila odpadem.",
  },
  {
    q: "Jak se nazývá děj, při kterém bakterie mění cukr na kyselinu, třeba při výrobě jogurtu nebo kysaného zelí?",
    key: "mléčné kvašení",
    d: [
      { value: "alkoholové kvašení", why: "Alkoholové kvašení způsobují kvasinky, třeba při výrobě piva. Jogurt vzniká mléčným kvašením." },
      { value: "plesnivění", why: "Plesnivění způsobují plísně, a ty jídlo kazí. Jogurt dělají užitečné bakterie." },
      { value: "hnití", why: "Hnití je rozklad, po kterém se potravina zkazí. Jogurt vzniká užitečným kvašením." },
    ],
    hints: [
      "Stejný děj probíhá i v kvašených okurkách ze soudku. Jak se jmenuje?",
      "Kvasinky při podobném ději vyrábějí alkohol, plísně a hniloba potraviny kazí. Hledaný děj naopak potravinu okyselí, a tím ji chrání před zkažením.",
    ],
    explanation: "Jogurt vzniká mléčným kvašením: mléčné bakterie mění mléčný cukr na kyselinu mléčnou, mléko zhoustne a zkysne. Stejně vzniká kysané zelí.",
  },
];

// ── L2 — použití v běžné situaci ─────────────────────────────────────────
const POOL_L2: Polozka[] = [
  {
    q: "Babička nakládá nakrouhané zelí do soudku a nechá ho kvasit. Co způsobí, že zelí zkysne?",
    key: "mléčné bakterie",
    d: [
      { value: "plísně, které na zelí vyrostou", why: "Plíseň je houba a zelí kazí. Kvašení způsobují užitečné mléčné bakterie." },
      { value: "viry přítomné ve vzduchu", why: "Viry se nemnoží v zelí, jen v živých buňkách. Kysnutí způsobují mléčné bakterie." },
      { value: "cukr, který zkysne sám od sebe", why: "Cukr se sám na kyselinu nezmění. Přemění ho až mléčné bakterie." },
    ],
    hints: [
      "Kysnutí zelí je užitečný děj. Kdo ho způsobuje: organismus, nebo samotná látka?",
      "Plíseň na potravině znamená, že se zkazila. Viry se množí jen uvnitř živých buněk. Kyselinu v zelí vyrobí drobné organismy, které se používají i při výrobě jogurtu.",
    ],
    explanation: "Zelí zkysne díky mléčným bakteriím. Mění cukr ze zelí na kyselinu mléčnou, která zelí okyselí a chrání ho před zkažením.",
  },
  {
    q: "Táta přidal do teplého mléka lžíci bílého jogurtu a nechal ho do rána stát. Proč z mléka vznikl nový jogurt?",
    key: "Protože bakterie z jogurtu zkvasily mléko.",
    d: [
      { value: "Protože mléko v teple samo zhoustlo.", why: "Mléko samo nezhoustne. Zkvasí ho až bakterie, které přidal táta s jogurtem." },
      { value: "Protože se v mléce rozmnožily plísně.", why: "Plísně jídlo kazí. Jogurt vzniká díky užitečným mléčným bakteriím." },
      { value: "Protože jogurt obsahuje viry, které mléko srazí.", why: "Viry se v mléce nemnoží a jogurt nedělají. Dělají ho mléčné bakterie." },
    ],
    hints: [
      "Co táta do mléka přidal a co v tom, co přidal, žije?",
      "Lžíce jogurtu tu slouží jako startovací kultura. Obsahuje drobné živé organismy, které se v teplém mléce přes noc rozmnožily a mléko změnily.",
    ],
    explanation: "Bílý jogurt obsahuje živé mléčné bakterie. V teplém mléce se přes noc rozmnožily a mléčným kvašením z něj udělaly nový jogurt.",
  },
  {
    q: "Na zahradě se tráva a listí na kompostu za rok změní v tmavou zeminu. Kdo to způsobí?",
    key: "bakterie a další rozkladači",
    d: [
      { value: "déšť, který listí sám rozpustí", why: "Voda listí nerozpustí. Rozkládají ho živé organismy, hlavně bakterie a houby." },
      { value: "viry, které listí rozloží", why: "Viry se množí jen v živých buňkách a nic nerozkládají. Rozkládají bakterie a houby." },
      { value: "kořeny okolních stromů", why: "Kořeny živiny z půdy berou, ale listí nerozkládají. Rozkládají ho bakterie a další rozkladači." },
    ],
    hints: [
      "Rozklad listí je práce živých organismů. Jak se jmenuje skupina, která to dělá?",
      "Déšť listí jen namočí a kořeny z půdy živiny berou. Viry se množí pouze uvnitř živých buněk. Zbytky rozkládají drobné organismy, které žijí v kompostu v obrovském množství.",
    ],
    explanation: "Kompost vzniká díky rozkladačům: bakteriím, houbám a drobným živočichům. Rozkládají zbytky rostlin na živiny, které pak rostliny znovu využijí.",
  },
  {
    q: "V čistírně odpadních vod teče špinavá voda do velkých provzdušňovaných nádrží. Co v nich vodu čistí?",
    key: "bakterie, které rozkládají nečistoty",
    d: [
      { value: "chlor, který nečistoty rozpustí", why: "Chlor se používá k ničení choroboplodných zárodků v pitné vodě, nečistoty nerozpouští. V čistírně pracují bakterie." },
      { value: "viry, které nečistoty spotřebují", why: "Viry se nemnoží v nečistotách, jen v živých buňkách. Nečistoty rozkládají bakterie." },
      { value: "ryby, které nečistoty sežerou", why: "V nádržích čistírny ryby nežijí. Nečistoty rozkládají bakterie." },
    ],
    hints: [
      "Nádrže se provzdušňují, protože tam něco živého potřebuje kyslík. Co to asi je?",
      "V čistírně se napodobuje to, co probíhá v přírodě: drobné organismy rozkládají odpad, stejně jako na kompostu. Vzduch jim dodává kyslík, aby pracovaly rychleji.",
    ],
    explanation: "V čistírně odpadních vod rozkládají nečistoty bakterie. Nádrže se provzdušňují, protože tyto bakterie potřebují kyslík.",
  },
  {
    q: "Po dlouhém užívání antibiotik mívá člověk potíže s trávením. Čím to je?",
    key: "Léky zničily i užitečné střevní bakterie.",
    d: [
      { value: "Antibiotika zničila viry, které trávení pomáhají.", why: "Antibiotika na viry nepůsobí. Ničí bakterie, a to i užitečné bakterie ve střevě." },
      { value: "Léky se ve střevě změnily v bakterie.", why: "Léky se v živé organismy nemění. Potíže vznikají, protože antibiotika zničila i užitečné střevní bakterie." },
      { value: "Plísně z léků se usadily ve střevě.", why: "Antibiotika neobsahují živé plísně. Potíže vznikají, protože léky zničily užitečné střevní bakterie." },
    ],
    hints: [
      "Antibiotika ničí bakterie. Žijí v našem těle i bakterie, které nám pomáhají?",
      "V našich střevech žijí miliardy bakterií, které pomáhají trávit potravu. Lék nerozliší škodlivou bakterii od užitečné, a proto zasáhne i je.",
    ],
    explanation: "Antibiotika nerozlišují škodlivé a užitečné bakterie. Zničí i část bakterií ve střevě, které pomáhají s trávením, a proto mohou přijít potíže.",
  },
  {
    q: "Na kořenech hrachu našla Ema drobné hlízky, ve kterých žijí bakterie. Jak tyto bakterie hrachu pomáhají?",
    key: "získávají pro něj dusík ze vzduchu",
    d: [
      { value: "vyrábějí pro něj cukr ze světla", why: "Cukr ze světla si vyrábí hrách sám v zelených listech. Hlízkové bakterie mu dodávají dusík." },
      { value: "dodávají mu vodu ze vzduchu", why: "Vodu hrách získává kořeny z půdy. Hlízkové bakterie mu dodávají dusík ze vzduchu." },
      { value: "chrání jeho kořeny před mrazem", why: "Hlízky kořeny před mrazem nechrání. Bakterie v nich dodávají rostlině dusík." },
    ],
    hints: [
      "Rostliny potřebují k růstu živiny z půdy. Kterou důležitou živinu mohou tyto bakterie získat ze vzduchu?",
      "Fotosyntézu dělá rostlina sama v listech. Bobovité rostliny se sázejí i proto, aby se půda obohatila o látku, kterou bakterie v hlízkách umí vázat ze vzduchu a které je ve vzduchu nejvíc.",
    ],
    explanation: "Hlízkové bakterie na kořenech bobovitých rostlin (hrách, jetel) získávají dusík ze vzduchu a předávají ho rostlině. Po sklizni zůstane dusík i v půdě.",
  },
  {
    q: "Maminka peče kuřecí maso. Proč ho musí dobře propéct?",
    key: "aby teplo zničilo bakterie, třeba salmonely",
    d: [
      { value: "aby maso získalo víc vitamínů", why: "Pečením vitamínů nepřibude, spíš ubude. Důvodem je zničit bakterie." },
      { value: "aby se zničily plísně uvnitř masa", why: "V čerstvém mase nejsou plísně. V syrovém kuřeti mohou být bakterie salmonely." },
      { value: "aby se v něm nezačaly množit viry", why: "Viry se v mase nemnoží, potřebují živé buňky. Problém jsou bakterie v syrovém mase." },
    ],
    hints: [
      "Co může být v syrovém kuřecím mase nebezpečného a čím se to zničí?",
      "V syrové drůbeži bývají bakterie, které způsobují průjmové onemocnění. Chlad ani opláchnutí je spolehlivě neodstraní. Zničí je až dostatečná teplota v celém kusu masa.",
    ],
    explanation: "V syrovém kuřecím mase mohou být bakterie, například salmonely. Zničí je až dostatečně vysoká teplota v celém kusu masa, proto se maso musí dobře propéct.",
  },
  {
    q: "Mléko v ledničce vydrží déle než na stole. Co s bakteriemi v mléce dělá chlad?",
    key: "zpomalí jejich množení",
    d: [
      { value: "všechny je hned zničí", why: "Chlad bakterie nezničí, jen zpomalí jejich množení. Proto se i mléko v ledničce jednou zkazí." },
      { value: "urychlí jejich dělení", why: "Chlad dělení bakterií naopak zpomaluje. Rychle se množí v teple." },
      { value: "zmrazí je navždy, takže mléko se nezkazí", why: "V ledničce mléko nezmrzne a bakterie žijí dál, jen pomaleji. Mléko se časem zkazí." },
    ],
    hints: [
      "Mléko se zkazí i v ledničce, jen později. Co to prozrazuje o bakteriích v chladu?",
      "Bakterie se nejrychleji množí v teple. Kdyby je chlad zabil, mléko by v ledničce vydrželo neomezeně dlouho. Zamysli se, co tedy chlad s jejich dělením dělá.",
    ],
    explanation: "Chlad bakterie nezabije, jen zpomalí jejich množení. Mléko v ledničce proto vydrží déle, ale ne navždy. Bakterie zničí až dostatečně vysoká teplota.",
  },
  {
    q: "Tomáš přišel ze záchodu a chystá se svačit. Co je nejlepší udělat?",
    key: "umýt si ruce důkladně mýdlem a vodou",
    d: [
      { value: "otřít si ruce do kalhot", why: "Otřením se bakterie neodstraní, jen se rozetřou. Ruce je potřeba umýt mýdlem." },
      { value: "jen si ruce krátce opláchnout vodou", why: "Samotná voda bez mýdla bakterie z kůže spolehlivě neodstraní. Pomůže až mýdlo a důkladné mytí." },
      { value: "nic, bakterie na rukou jsou všechny užitečné", why: "Ze záchodu si můžeš přinést i škodlivé bakterie, třeba původce průjmu. Ruce je potřeba umýt." },
    ],
    hints: [
      "Na záchodě se na ruce snadno dostanou bakterie, které způsobují průjem. Jak je z rukou odstranit?",
      "Voda sama mastnou vrstvu na kůži nerozpustí, a bakterie v ní proto zůstanou. Otřením se jen rozetřou. Pomůže jen důkladné mytí s prostředkem, který mastnotu uvolní.",
    ],
    explanation: "Po záchodě je potřeba umýt si ruce důkladně mýdlem a vodou. Mýdlo uvolní mastnotu a s ní i bakterie, které by se jinak dostaly do jídla.",
  },
  {
    q: "Při hře venku si Klára odřela koleno a v ráně je hlína. Co je správně?",
    key: "ránu vymýt vodou, vydezinfikovat a přelepit",
    d: [
      { value: "hlínu v ráně nechat, zaschne a ránu uzavře", why: "V hlíně žijí bakterie, i původce tetanu. Hlínu je potřeba z rány vymýt." },
      { value: "rány si nevšímat, bakterie do ní nepronikají", why: "Rána je pro bakterie otevřená brána do těla. Je potřeba ji vyčistit a vydezinfikovat." },
      { value: "ránu jen olíznout a zakrýt rukávem", why: "Sliny ani špinavý rukáv ránu nevyčistí. Ránu vymyj, vydezinfikuj a přelep čistou náplastí." },
    ],
    hints: [
      "V hlíně žijí bakterie. Co s nimi v ráně musíš udělat, aby se rána nezanítila?",
      "Nejdřív je potřeba z rány odstranit nečistoty, potom zničit bakterie, které v ní zůstaly, a nakonec ránu chránit před další špínou. Seřaď si tyto kroky a porovnej je s nabídkou.",
    ],
    explanation: "Ránu s hlínou je potřeba vymýt čistou vodou, vydezinfikovat a přelepit. V hlíně žijí bakterie, i původce tetanu, a proto je dobré mít platné očkování.",
  },
  {
    q: "Jirka si na zahradě propíchl nohu rezavým hřebíkem. Na které očkování se ho lékař zeptá?",
    key: "na očkování proti tetanu",
    d: [
      { value: "na očkování proti chřipce", why: "Chřipka je virová a s poraněním nesouvisí. Lékař se ptá na tetanus." },
      { value: "na očkování proti klíšťové encefalitidě", why: "Klíšťovou encefalitidu přenáší klíště, ne hřebík. Po poranění hrozí tetanus." },
      { value: "na očkování proti spalničkám", why: "Spalničky se šíří vzduchem, ne ranou. Po poranění hrozí tetanus." },
    ],
    hints: [
      "Hřebík byl špinavý od hlíny. Která nemoc hrozí, když se do hluboké rány dostane hlína?",
      "Původce této bakteriální nemoci žije v půdě a v prachu a do těla vnikne ranou. Proti chřipce, spalničkám i encefalitidě se očkuje kvůli jiným cestám nákazy.",
    ],
    explanation: "Po hlubokém poranění špinavým předmětem hrozí tetanus, jehož bakterie žijí v půdě. Lékař proto ověří, jestli má Jirka platné očkování proti tetanu.",
  },
  {
    q: "Po procházce lesem našel Adam na noze přisáté klíště. Co má udělat?",
    key: "vytáhnout ho celé a místo vydezinfikovat",
    d: [
      { value: "potřít ho máslem a počkat, až odpadne", why: "Mastnota klíště hned nezabije a klíště může vypustit víc slin s bakteriemi. Vytáhni ho celé." },
      { value: "utrhnout jen jeho tělo, zbytek nechat v kůži", why: "Zbytky klíštěte v kůži se mohou zanítit. Klíště je potřeba vytáhnout celé." },
      { value: "nechat ho být, klíště je hmyz a neškodí", why: "Klíště je pavoukovec, ne hmyz, a může přenést boreliózu. Vytáhni ho co nejdřív celé." },
    ],
    hints: [
      "Čím déle klíště saje, tím víc hrozí přenos nemoci. Jak ho bezpečně odstranit?",
      "Klíště odstraň co nejdřív a tak, aby žádná jeho část nezůstala v kůži a nevypustilo do rány víc slin. Mastnota ho hned nezabije. Po odstranění zbývá ošetřit místo přisátí.",
    ],
    explanation: "Klíště je potřeba co nejdřív vytáhnout celé (pinzetou nebo kartičkou), místo vydezinfikovat a několik týdnů sledovat. Mastnota ani trhání nepomáhají.",
  },
  {
    q: "Tři týdny poté, co Lucii sálo klíště, se jí kolem místa přisátí objevil zarudlý kruh, který se zvětšuje. Co má udělat?",
    key: "jít k lékaři, může to být borelióza",
    d: [
      { value: "počkat, až zarudnutí samo zmizí", why: "Zvětšující se kruh je typický příznak boreliózy. Ta se léčí antibiotiky, proto je potřeba jít k lékaři." },
      { value: "vzít si doma zbylá antibiotika bez rady", why: "Antibiotika předepisuje lékař: vybere správný lék i dobu užívání. Zbytky léků mohou nadělat víc škody než užitku." },
      { value: "kruh jen potřít mastí a nic neřešit", why: "Mast bakterie v těle nezničí. Zarudlý kruh po klíštěti je důvod jít k lékaři." },
    ],
    hints: [
      "Zvětšující se zarudnutí po klíštěti je typický příznak jedné bakteriální nemoci. Kdo ji umí určit a léčit?",
      "Tuto nemoc je potřeba léčit správným lékem po správnou dobu, a ten předepisuje jen odborník. Mast působí jen na kůži a čekání nemoci umožní rozšířit se do těla.",
    ],
    explanation: "Zvětšující se zarudlý kruh po klíštěti je typickým příznakem lymeské boreliózy. Je potřeba jít k lékaři, který předepíše antibiotika.",
  },
  {
    q: "Na výletě chce Ondra pít vodu z neznámé tůně. Proč je to nebezpečné?",
    key: "voda může obsahovat škodlivé bakterie",
    d: [
      { value: "voda z přírody má málo vitamínů", why: "Vitamíny tu nejsou problém. Nebezpečné jsou choroboplodné bakterie ve vodě." },
      { value: "v tůni jsou viry, které léčí jen antibiotika", why: "Antibiotika na viry nepůsobí. V tůni mohou být hlavně škodlivé bakterie." },
      { value: "v tůni rostou plísně, které vodu obarví", why: "Barva vody není to hlavní nebezpečí. V neupravené vodě mohou být bakterie, které způsobí průjem." },
    ],
    hints: [
      "Voda z tůně se neupravuje ani nepřevaří. Co v ní může žít neviditelného?",
      "Do stojaté vody se dostávají výkaly zvířat a s nimi drobné organismy, které způsobují průjmová onemocnění. Pitná voda z kohoutku se proto upravuje.",
    ],
    explanation: "V neupravené vodě mohou být škodlivé bakterie, které způsobují průjmová onemocnění. Proto se v přírodě pije jen voda z ověřeného zdroje nebo převařená.",
  },
  {
    q: "Proč se má syrové maso krájet na jiném prkénku než zelenina do salátu?",
    key: "bakterie z masa by přešly na zeleninu, která se nevaří",
    d: [
      { value: "maso by zeleninu obarvilo a salát by nevypadal hezky", why: "Barva je vedlejší. Jde o to, aby se bakterie ze syrového masa nedostaly do syrové zeleniny." },
      { value: "viry ze zeleniny by se dostaly do masa a zkazily ho", why: "Maso se ještě tepelně upraví. Nebezpečí je opačné: bakterie z masa by přešly na zeleninu." },
      { value: "zelenina by z masa odebrala všechny vitamíny", why: "Zelenina vitamíny z masa neodebírá. Jde o přenos bakterií." },
    ],
    hints: [
      "Maso se ještě bude péct nebo vařit, salát ne. Co z toho plyne pro bakterie na prkénku?",
      "Teplo při vaření zničí bakterie jen v tom jídle, které se opravdu vaří. Zamysli se, co se stane s bakteriemi, které se z prkénka dostanou na jídlo, jež už žádné teplo nedostane.",
    ],
    explanation: "Na syrovém mase mohou být bakterie. Maso se tepelně upraví, zelenina do salátu ne. Kdyby se krájely na stejném prkénku, bakterie by se dostaly do salátu a nikdo by je nezničil.",
  },
  {
    q: "Syrové kuře Kuba před vařením omyl vodou. Jsou teď bakterie na mase zničené?",
    key: "ne, zničí je až důkladné tepelné zpracování",
    d: [
      { value: "ano, voda všechny bakterie z masa spláchne", why: "Voda bakterie nezničí, spíš je rozstříká po kuchyni. Zničí je až teplo." },
      { value: "ano, studená voda bakterie spolehlivě zabije", why: "Chlad bakterie nezabíjí, jen zpomaluje. Zničí je až dostatečně vysoká teplota." },
      { value: "ne, zničí je až několik dní v mrazáku", why: "Mráz bakterie jen uspí, po rozmrazení se množí dál. Zničí je až teplo." },
    ],
    hints: [
      "Stačí voda na zničení bakterií? A co s nimi dělá chlad?",
      "Oplachováním se bakterie jen rozstříkají po okolí a nízká teplota je jen zpomalí. Spolehlivě je zničí až vysoká teplota v celém kusu masa.",
    ],
    explanation: "Omytí bakterie na mase nezničí, spíš je rozstříká po kuchyni. Mráz ani chlad je nezabijí. Zničí je až důkladné tepelné zpracování.",
  },
  {
    q: "Hanka onemocněla streptokokovou angínou. Čím se podle rady lékaře léčí?",
    key: "antibiotiky předepsanými lékařem",
    d: [
      { value: "očkovací látkou proti angíně", why: "Očkování proti angíně neexistuje a očkování nemoc neléčí, jen jí předchází." },
      { value: "jen vitamíny a čajem", why: "Vitamíny a čaj pomohou tělu, ale bakterie nezničí. Streptokokovou angínu lékař léčí antibiotiky." },
      { value: "antibiotiky, která zbyla sousedce", why: "Cizí zbytky léků nemusí být ten správný lék ani v potřebném množství. Antibiotika předepisuje lékař." },
    ],
    hints: [
      "Streptokoky jsou bakterie. Jakým druhem léku se bakteriální nemoc léčí a kdo ho určuje?",
      "Očkování nemoci jen předchází a vitamíny bakterie nezničí. Lék proti bakteriím musí mít správný druh i množství, a proto ho vybírá odborník, který nemocnou vyšetřil.",
    ],
    explanation: "Streptokokovou angínu způsobují bakterie, a proto ji lékař léčí antibiotiky. Lék předepíše přesně pro Hanku a určí, jak dlouho ho má brát.",
  },
];

// ── L3 — analýza a přenos ────────────────────────────────────────────────
const POOL_L3: Polozka[] = [
  {
    q: "Kamarád radí Janě, ať si při každém nachlazení vezme pro jistotu antibiotika. Proč to lékaři nedoporučují?",
    key: "Ničí užitečné bakterie a pomáhá šířit odolné bakterie.",
    d: [
      { value: "Tělo si na lék zvykne a přestane na něj reagovat.", why: "Odolnými se nestává lidské tělo, ale bakterie. Čím častěji se antibiotika berou zbytečně, tím víc odolných bakterií přežívá a šíří se." },
      { value: "Antibiotika se smějí brát jen při vysoké horečce.", why: "O antibiotikách nerozhoduje horečka, ale to, jestli nemoc způsobily bakterie. To posoudí lékař." },
      { value: "Antibiotika nachlazení zhorší, protože viry v těle posílí.", why: "Na viry antibiotika nepůsobí vůbec, neposilují je ani neničí. Zbytečně ale zasáhnou bakterie v těle." },
    ],
    hints: [
      "Na koho antibiotika působí? A co udělají v těle člověka, který žádnou bakteriální nemoc nemá?",
      "V těle žijí i užitečné bakterie a lék je od škodlivých nerozliší. Navíc bakterie, které lék přežijí, se dál množí a předávají mezi lidmi. Zamysli se, co z toho plyne, když se lék bere zbytečně a často.",
    ],
    explanation: "Antibiotika zbytečně zničí i užitečné bakterie v těle. Čím častěji se berou, tím víc se šíří bakterie, na které lék nezabírá, a lidé, kteří antibiotika opravdu potřebují, je pak nemusí mít čím léčit. Nachlazení navíc většinou způsobují viry, na které antibiotika nepůsobí.",
  },
  {
    q: "Honzovi předepsal lékař na bakteriální zánět antibiotika na deset dní. Po třech dnech je mu lépe. Proč má lék brát dál?",
    key: "Protože některé bakterie ještě žijí a nemoc by se mohla vrátit.",
    d: [
      { value: "Protože jinak by se z bakterií staly viry.", why: "Bakterie se ve viry nemění. Když se léčba přeruší, přeživší bakterie se mohou rozmnožit a nemoc se vrátí." },
      { value: "Protože zbylé tablety by se musely vyhodit.", why: "Nejde o šetření léků. Lék se bere tak dlouho, jak určil lékař, protože některé bakterie ještě žijí." },
      { value: "Protože antibiotika zároveň očkují proti nemoci.", why: "Antibiotika neočkují. Berou se celou dobu, kterou určil lékař, aby nemoc nepřetrvala." },
    ],
    hints: [
      "Honzovi je lépe, ale jsou už v jeho těle zničené úplně všechny bakterie?",
      "Lék ničí bakterie postupně a člověku se uleví dřív, než jsou zničené všechny. Rozmysli si, co by udělaly ty, které ještě zbyly, kdyby je lék přestal ničit.",
    ],
    explanation: "Úleva neznamená, že jsou zničené všechny bakterie. Lék se bere tak dlouho, jak určil lékař, jinak se přeživší bakterie rozmnoží a nemoc se vrátí.",
  },
  {
    q: "Lékař zjistil, že Marek má chřipku. Marek chce antibiotika, která mu kdysi pomohla na angínu. Co je pravda?",
    key: "Na chřipku nepomohou, způsobuje ji virus.",
    d: [
      { value: "Pomohou, antibiotika léčí každou nemoc.", why: "Antibiotika léčí jen bakteriální nemoci. Chřipku způsobuje virus." },
      { value: "Pomohou, chřipku i angínu způsobují viry.", why: "Streptokokovou angínu způsobují bakterie, chřipku virus. Proto antibiotika na chřipku nezabírají." },
      { value: "Nepomohou, antibiotika se smějí brát jen jednou za rok.", why: "Žádné takové pravidlo neplatí. Na chřipku nepomohou, protože ji způsobuje virus." },
    ],
    hints: [
      "Porovnej původce obou nemocí: kdo způsobuje angínu od streptokoků a kdo chřipku?",
      "Lék, který zabral na jednu nemoc, nemusí zabrat na jinou. Rozhoduje, jestli má nemoc stejného původce. Antibiotika působí jen na jeden druh původců.",
    ],
    explanation: "Streptokokovou angínu způsobují bakterie, a proto na ni antibiotika zabrala. Chřipku způsobuje virus a na viry antibiotika nepůsobí.",
  },
  {
    q: "Neznámý organismus má jedinou buňku s buněčnou stěnou, jadernou hmotu volně v cytoplazmě a bičík. O co jde?",
    key: "o bakterii",
    d: [
      { value: "o virus", why: "Virus nemá buněčnou stavbu. Tento organismus je buňka." },
      { value: "o prvoka", why: "Prvok má jádro ohraničené membránou. Tady jaderná hmota leží volně." },
      { value: "o zelenou řasu", why: "Řasa má jádro a zelené barvivo. Tady jádro chybí." },
    ],
    hints: [
      "Rozhodující je, jestli má buňka jádro. Co z popisu o jádru plyne?",
      "Bičík mají i někteří prvoci a řasy, podle něj se nerozhodneš. Důležitější je, že dědičná informace neleží v jádře. Taková buňka patří jediné skupině organismů.",
    ],
    explanation: "Jediná buňka se stěnou a s jadernou hmotou volně v cytoplazmě (bez jádra) je bakterie. Bičík jí slouží k pohybu. Prvok i řasa mají jádro, virus nemá buňku vůbec.",
  },
  {
    q: "Neznámý útvar nemá buněčnou stavbu, množí se jen uvnitř cizích buněk a světelným mikroskopem ho nevidíme. O co jde?",
    key: "o virus",
    d: [
      { value: "o bakterii", why: "Bakterie je buňka a ve světelném mikroskopu ji uvidíš." },
      { value: "o prvoka", why: "Prvok je buňka s jádrem a množí se sám. Tento útvar buňkou není." },
      { value: "o výtrus plísně", why: "Výtrus je buňka houby. Tento útvar buněčnou stavbu nemá." },
    ],
    hints: [
      "Porovnej, které z nabídnutých možností mají buňku a které se umí množit samy.",
      "Bakterie, prvok i výtrus plísně jsou buňky a ve světelném mikroskopu je uvidíš. Útvar, který se sám množit neumí a potřebuje k tomu cizí buňku, patří do jiné skupiny.",
    ],
    explanation: "Útvar bez buněčné stavby, který se množí jen v cizích buňkách a je menší, než rozliší světelný mikroskop, je virus.",
  },
  {
    q: "Neznámý organismus tvoří jediná buňka bez buněčné stěny s jádrem ohraničeným membránou a pohybuje se panožkami. O co jde?",
    key: "o prvoka",
    d: [
      { value: "o bakterii", why: "Bakterie nemá jádro a má buněčnou stěnu. Tady je to naopak." },
      { value: "o virus", why: "Virus není buňka. Tento organismus je buňka s jádrem." },
      { value: "o kvasinku", why: "Kvasinka je houba a má buněčnou stěnu. Tady stěna chybí." },
    ],
    hints: [
      "Buňka má jádro. Které z nabídnutých organismů tím můžeš rovnou vyřadit?",
      "Bakterie jádro nemá a virus není buňka. Kvasinka jádro má, ale jako houba má i pevnou stěnu. Zbývá skupina jednobuněčných organismů s jádrem, kam patří i měňavka.",
    ],
    explanation: "Jediná buňka s jádrem, bez buněčné stěny, s panožkami je prvok (třeba měňavka). Bakterie jádro nemá, kvasinka má stěnu a virus buňkou není.",
  },
  {
    q: "Pod mikroskopem je kulovitá buňka bez jádra s pevnou stěnou, obalená slizovým pouzdrem. O jaký organismus jde?",
    key: "o bakterii",
    d: [
      { value: "o virus", why: "Virus nemá buňku, stěnu ani pouzdro." },
      { value: "o prvoka", why: "Prvok má jádro a pevnou stěnu nemá." },
      { value: "o kvasinku", why: "Kvasinka má stěnu, ale také jádro. Tady jádro chybí." },
    ],
    hints: [
      "Kterým znakem se tato buňka liší od buněk hub, prvoků i rostlin?",
      "Pouzdro a kulovitý tvar nejsou rozhodující. Rozhodující je, že buňka nemá jádro, a přitom je to buňka se stěnou. Porovnej to se stavbou každé nabídnuté skupiny.",
    ],
    explanation: "Buňka bez jádra s pevnou stěnou je bakterie. Kulovitý tvar znamená kok a slizové pouzdro ji chrání. Kvasinka i prvok mají jádro, virus nemá buňku.",
  },
  {
    q: "Neznámý organismus tvoří jediná buňka s jádrem, buněčnou stěnou a zelenými chloroplasty, živiny si vyrábí ze světla. O co jde?",
    key: "o zelenou řasu",
    d: [
      { value: "o bakterii", why: "Bakterie nemá jádro. Tato buňka jádro má." },
      { value: "o virus", why: "Virus není buňka a živiny si nevyrábí." },
      { value: "o prvoka", why: "Prvoci jako měňavka nebo trepka nemají buněčnou stěnu. Tato buňka stěnu má." },
    ],
    hints: [
      "Buňka má jádro i chloroplasty. Kdo si vyrábí živiny ze světla?",
      "Jádro vyřazuje bakterii, buněčná stavba vyřazuje virus. Stěna a chloroplasty ukazují na organismus, který si podobně jako rostliny vyrábí živiny fotosyntézou a žije ve vodě.",
    ],
    explanation: "Jediná buňka s jádrem, stěnou a chloroplasty, která provádí fotosyntézu, je zelená řasa. Bakterie nemá jádro a prvoci nemají pevnou buněčnou stěnu.",
  },
  {
    q: "Pod mikroskopem je tyčinkovitá buňka, která se dělí každých dvacet minut a její dědičná informace leží volně v cytoplazmě. Kdo to je?",
    key: "bakterie",
    d: [
      { value: "virus", why: "Virus není buňka a sám se dělit neumí." },
      { value: "prvok", why: "Prvok má dědičnou informaci uzavřenou v jádře." },
      { value: "kvasinka", why: "Kvasinka je houba s jádrem. Tady jádro chybí." },
    ],
    hints: [
      "Kde leží dědičná informace u organismů s jádrem a kde u těch bez jádra?",
      "Tvar tyčinky ani rychlé dělení samy o sobě nerozhodnou. Rozhodne to, že dědičná informace není uzavřená v jádře. Takovou stavbu buňky má jediná nabídnutá skupina.",
    ],
    explanation: "Buňka, jejíž dědičná informace leží volně v cytoplazmě, je bakterie. Tyčinkovitý tvar je jeden z jejích typických tvarů a rychlé dělení je pro bakterie běžné.",
  },
  {
    q: "K čemu slouží bakterii slizové pouzdro na povrchu buňky?",
    key: "chrání ji před vyschnutím a obranou těla",
    d: [
      { value: "slouží jí k pohybu podobně jako bičík", why: "K pohybu slouží bičík. Pouzdro bakterii chrání." },
      { value: "uchovává její dědičnou informaci", why: "Dědičná informace leží uvnitř buňky v cytoplazmě. Pouzdro je ochranný obal." },
      { value: "vyrábí v něm živiny ze světla", why: "Pouzdro neobsahuje zelené barvivo. Je to ochranná vrstva." },
    ],
    hints: [
      "Pouzdro je vrstva slizu na úplném povrchu buňky. K čemu se obvykle hodí obal?",
      "Sliz drží vodu a je kluzký. Zamysli se, před čím takový obal chrání bakterii v suchém prostředí a v těle člověka, kde na ni útočí obranné buňky.",
    ],
    explanation: "Slizové pouzdro bakterii chrání: drží vodu, takže bakterie nevyschne, a ztěžuje obranným buňkám těla ji zničit.",
  },
  {
    q: "Bakterie se v teple dělí zhruba každých dvacet minut. Proč je mléko, které bylo ráno v pořádku, po pěti hodinách na stole zkažené?",
    key: "Z několika bakterií jich opakovaným dělením vznikne obrovské množství.",
    d: [
      { value: "Bakterie do mléka mezitím nalétaly ze vzduchu.", why: "Pár bakterií ze vzduchu mléko nezkazí. Zkazí ho to, že se bakterie, které v mléce už byly, mnohokrát rozdělily." },
      { value: "Teplo mléko zkazí samo i bez bakterií.", why: "Teplo samo mléko nezkazí. Jen urychlí dělení bakterií, které mléko kazí." },
      { value: "Každá bakterie za tu dobu vyrostla do obří buňky.", why: "Bakterie do obřích rozměrů nerostou. Jejich počet roste dělením." },
    ],
    hints: [
      "Kolikrát se bakterie rozdělí za pět hodin, když se dělí každých dvacet minut?",
      "Z jedné bakterie jsou po prvním dělení dvě, pak čtyři, pak osm. Zkus pokračovat a zamysli se, kolik jich bude po patnácti děleních.",
    ],
    explanation: "Za pět hodin se bakterie rozdělí asi patnáctkrát. Z jedné bakterie tak vznikne přes třicet tisíc nových (2, 4, 8, 16…). Z několika bakterií, které v mléce byly ráno, jich je večer obrovské množství a mléko zkazí.",
  },
  {
    q: "V kapce vody leží na jednom konci kousek cukru. Jedna bakterie má bičík, druhá ne. Která se k cukru pravděpodobně dostane dřív?",
    key: "ta s bičíkem, protože se umí aktivně pohybovat",
    d: [
      { value: "ta bez bičíku, protože je lehčí", why: "Lehčí bakterie se sama nepohybuje, jen ji unáší voda. Bakterie s bičíkem může plout k potravě." },
      { value: "obě stejně, bakterie se samy nepohybují", why: "Některé bakterie se pohybují, a to právě bičíkem. Ta s bičíkem se k cukru dostane dřív." },
      { value: "ta s bičíkem, protože bičíkem cukr nasaje z dálky", why: "Bičík potravu nenasává, slouží k pohybu. Bakterie s ním k cukru dopluje." },
    ],
    hints: [
      "K čemu bakterii slouží bičík a co z toho plyne v kapce, kde je potrava jen na jednom místě?",
      "Bakterie bez bičíku je unášena jen náhodným prouděním vody. Porovnej ji s bakterií, která se umí sama posouvat a může plout směrem k potravě.",
    ],
    explanation: "Bičík je orgán pohybu. Bakterie s bičíkem se může sama přesunout tam, kde je víc živin, zatímco bakterie bez bičíku je jen unášena. K cukru se proto nejspíš dostane dřív ta s bičíkem.",
  },
  {
    q: "Petr tvrdí: „Bakterie jsou jen škodlivé, nejlepší by bylo všechny zničit.“ Který argument ho vyvrací?",
    key: "Bez bakterií by se v přírodě mnohem hůř rozkládaly odumřelé zbytky.",
    d: [
      { value: "Bez bakterií by nevznikaly viry, protože viry jsou zmenšené bakterie.", why: "Viry nejsou zmenšené bakterie, nemají buněčnou stavbu." },
      { value: "Bez bakterií by rostliny nedokázaly fotosyntézu.", why: "Fotosyntézu provádějí rostliny samy ve svých zelených částech." },
      { value: "Bez bakterií by zmizela antibiotika na chřipku.", why: "Na chřipku antibiotika nepůsobí, chřipku způsobuje virus." },
    ],
    hints: [
      "Najdi argument, který je pravdivý a ukazuje, že bakterie přírodě pomáhají.",
      "Tři argumenty obsahují chybu: jeden plete bakterie s viry, jeden přisuzuje bakteriím práci rostlin, jeden plete léčbu virové nemoci. Pravdivý argument se týká koloběhu látek v přírodě.",
    ],
    explanation: "Bakterie patří spolu s houbami mezi hlavní rozkladače: bez nich by rozklad odumřelých rostlin a živočichů vázl a živiny by se do půdy vracely mnohem pomaleji. Užitečné jsou i při kvašení a v našich střevech.",
  },
  {
    q: "Eliška tvrdí: „Na rýmu mi pomohla antibiotika, minule jsem je brala a rýma za týden přešla.“ Proč její úvaha neplatí?",
    key: "Rýma je virová a přešla by i bez léků.",
    d: [
      { value: "Rýmu způsobují bakterie, které antibiotika neničí.", why: "Rýmu způsobují viry. A bakterie antibiotika naopak ničí." },
      { value: "Rýma přešla, protože antibiotika zničila viry.", why: "Antibiotika na viry nepůsobí. Rýma přešla, protože se s ní tělo vypořádalo samo." },
      { value: "Antibiotika na rýmu zabírají, jen je měla brát déle.", why: "Na virovou rýmu antibiotika nezabírají, ať se berou jakkoli dlouho." },
    ],
    hints: [
      "Kdo způsobuje rýmu a na koho působí antibiotika?",
      "Když se něco stane po užití léku, nemusí to být díky léku. Zamysli se, jak dlouho rýma trvá, i když se neléčí, a jestli mohl lék na jejího původce vůbec působit.",
    ],
    explanation: "Rýmu způsobují viry, na které antibiotika nepůsobí. Rýma přejde sama zhruba za týden, takže uzdravení s lékem nesouviselo.",
  },
  {
    q: "Adéla ohřála převařené mléko s cukrem a nechala ho přes noc v teple, ale jogurt nevznikl. Co udělala špatně?",
    key: "Nepřidala mléčné bakterie, třeba lžíci jogurtu.",
    d: [
      { value: "Nepřidala plíseň, která jogurt vytváří.", why: "Plíseň jogurt kazí. Jogurt dělají mléčné bakterie." },
      { value: "Mléko nebylo dost teplé, aby samo zhoustlo.", why: "Mléko samo nezhoustne při žádné teplotě. Zhoustne až kvašením, které provádějí mléčné bakterie." },
      { value: "Mléko převařila, a tím zničila viry, které jogurt dělají.", why: "Jogurt nedělají viry, ale mléčné bakterie. Převařit mléko je naopak správně." },
    ],
    hints: [
      "Jogurt vzniká kvašením. Kdo kvašení provádí a mohl být v Adélině mléce?",
      "Převaření zničí v mléce všechno živé, takže se v něm nemá co množit. Při domácí výrobě se proto do teplého mléka přidává startovací kultura.",
    ],
    explanation: "Jogurt vzniká mléčným kvašením, které provádějí živé mléčné bakterie. V převařeném mléce žádné nejsou, a když je Adéla nepřidala (třeba lžící hotového jogurtu), mléko nezkvasí a jogurt z něj nevznikne.",
  },
  {
    q: "Obec postavila čistírnu odpadních vod. Proč do jejích nádrží nesmí téct zbytky antibiotik a dezinfekce?",
    key: "Zničily by bakterie, které vodu čistí.",
    d: [
      { value: "Bakterie by se po nich změnily ve viry.", why: "Bakterie se ve viry nemění. Antibiotika a dezinfekce by je zničily." },
      { value: "Antibiotika by vodu trvale obarvila.", why: "Nejde o barvu. Antibiotika by zničila bakterie, které vodu čistí." },
      { value: "Dezinfekce by bakterie příliš rozmnožila.", why: "Dezinfekce bakterie ničí, ne rozmnožuje. Zničila by ty, které vodu čistí." },
    ],
    hints: [
      "Kdo v čistírně vodu čistí a co s nimi dělají antibiotika a dezinfekce?",
      "Antibiotika a dezinfekce se používají k ničení bakterií a nerozlišují škodlivé od užitečných. Zamysli se, co by se stalo s organismy, na kterých čištění vody stojí.",
    ],
    explanation: "V čistírně rozkládají nečistoty užitečné bakterie. Antibiotika a dezinfekce by je zničily a čistírna by přestala vodu čistit.",
  },
  {
    q: "Proč musí mít zahradník platné očkování proti tetanu?",
    key: "Původce tetanu žije v půdě a do těla vnikne ranou.",
    d: [
      { value: "Tetanus přenášejí klíšťata žijící v trávě.", why: "Klíšťata přenášejí boreliózu a encefalitidu. Tetanus vnikne do těla ranou." },
      { value: "Původce tetanu se šíří kapénkami při kašli.", why: "Tetanus se nešíří kapénkami. Jeho bakterie žijí v půdě a vniknou ranou." },
      { value: "Očkování chrání zahradníka i před boreliózou.", why: "Proti borelióze očkování proti tetanu nechrání." },
    ],
    hints: [
      "S čím zahradník pracuje a jak se k němu mohou dostat bakterie tetanu?",
      "Zahradník se často poraní a do drobných ran se mu dostane hlína. Zamysli se, kde bakterie tetanu žijí a jakou cestou se dostanou do těla.",
    ],
    explanation: "Bakterie tetanu žijí v půdě a v prachu a do těla vniknou ranou. Zahradník se často poraní a má ruce od hlíny, proto potřebuje platné očkování.",
  },
  {
    q: "Na táboře onemocnělo několik dětí salmonelózou po jídle z vajec. Co by tomu nejlépe předešlo?",
    key: "vejce důkladně tepelně upravit a mýt si ruce",
    d: [
      { value: "předem všechny děti očkovat proti salmonelóze", why: "Běžné očkování proti salmonelóze neexistuje. Chrání tepelná úprava a hygiena." },
      { value: "dát všem dětem předem antibiotika", why: "Antibiotika se neberou pro jistotu. Předepisuje je lékař nemocným, zdravým mohou uškodit a nemoci nepředejdou." },
      { value: "skladovat vejce v teple, aby nezplesnivěla", why: "V teple se bakterie množí rychleji. Vejce patří do chladu a pak se důkladně tepelně upraví." },
    ],
    hints: [
      "Salmonely jsou bakterie z vajec. Čím se v jídle zničí a jak se nešíří dál?",
      "Proti salmonelóze se běžně neočkuje a léky se neberou pro jistotu. Zamysli se, co bakterie v jídle spolehlivě zničí a co brání tomu, aby se přenesly rukama.",
    ],
    explanation: "Salmonely zničí důkladná tepelná úprava vajec a přenosu brání mytí rukou. Očkování se proti salmonelóze běžně nedělá a antibiotika se pro jistotu neberou.",
  },
];

// ── Generátor ────────────────────────────────────────────────────────────
function uloha(p: Polozka): PracticeTask | null {
  return choice(p.q, p.key, p.d, { hints: p.hints, explanation: p.explanation });
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  // Rotace bankou se nastaví tady, ne na úrovni modulu: dvě volání gen()
  // se stejným seedem tak dají stejné úlohy.
  let i = 0;
  return ruzneUlohy(() => losUlohy(() => uloha(pool[i++ % pool.length])));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const BAKTERIE_TOPICS: TopicMetadata[] = [
  {
    id: "g6-pri-bakterie-6",
    rvpNodeId: "g6-prirodopis-nebunecni-a-bakterie-viry-a-bakterie-bakterie-stavba-vyznam-bakterialni-nemoci",
    displayName: "Bakterie a bakteriální nemoci",
    title: "Bakterie - stavba, význam, bakteriální nemoci",
    studentTitle: "Bakterie – malí pomocníci i škůdci",
    subject: "prirodopis",
    category: "Nebuněční a bakterie",
    topic: "Viry a bakterie",
    briefDescription: "Jak vypadá bakterie, k čemu je užitečná a jak se bránit nemocem.",
    keywords: [
      "bakterie", "bakteriální buňka", "bičík", "buněčná stěna", "jaderná hmota",
      "antibiotika", "borelióza", "tetanus", "salmonelóza", "kvašení", "rozkladači", "očkování",
    ],
    goals: [
      "Poznat bakterii podle stavby buňky.",
      "Rozlišit, kde bakterie pomáhají a kde škodí.",
      "Vybrat správný postup u bakteriální nemoci: antibiotika od lékaře, očkování, hygiena a tepelná úprava.",
    ],
    boundaries: [
      "Jen stavba bakterie, její význam a běžné bakteriální nemoci.",
      "Žádné latinské názvy bakterií ani přesné rozměry.",
      "Zdravotní rady jen obecné a bezpečné, léčbu vždy určuje lékař.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Bakterie je jedna buňka bez jádra: má stěnu, cytoplazmu a jadernou hmotu volně uvnitř, někdy bičík nebo pouzdro. Antibiotika ničí bakterie, na viry nepůsobí.",
      steps: [
        "Urči, jestli jde o bakterii, virus, nebo organismus s jádrem.",
        "Rozhodni, jestli bakterie v situaci pomáhá (kvašení, rozklad, střeva), nebo škodí (nemoc).",
        "U nemoci zvol bezpečný postup: lékař a antibiotika u bakterií, prevence očkováním, hygienou a tepelnou úpravou.",
      ],
      commonMistake: "Myslet si, že antibiotika pomohou i na chřipku nebo rýmu, případně že všechny bakterie jsou škodlivé.",
      example: "Kysané zelí dělají užitečné mléčné bakterie. Chřipku způsobuje virus, a proto na ni antibiotika nezabírají.",
    },
  },
];
