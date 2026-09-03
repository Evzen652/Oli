/**
 * K čemu je téma dobré + zajímavost — pro dialog „Co je dobré vědět".
 *
 * ## Proč vznikl nový soubor a nezachránil se `categoryInfo.ts`
 *
 * `CATEGORY_INFO` má 73 ručně psaných hesel s poli `whyWeUseIt` a `funFact`.
 * Změřeno 2026-09-03: **žádné z nich se nikdy nezobrazí.** Klíče jsou z dřívější
 * taxonomie („matematika::Zlomky", „čeština::Vyjmenovaná slova"), obsah ale mezitím
 * přešel na RVP názvy („matematika::Číslo a početní operace::Zlomky",
 * „čeština::Jazyková výchova::Pravopis"). `getCategoryInfo` tedy vrací `null`
 * pro všech 229 témat — box se zajímavostí i celý panel „K čemu jsou čísla?"
 * v `TopicBrowser` jsou od té změny mrtvý kód.
 *
 * Překlíčovat starý soubor nešlo 1:1: staré kategorie se rozpadly na podtémata
 * („Zlomky" byla kategorie, dnes je to téma) a `visualExamples` v něm stojí na
 * emoji, která v aplikaci být nemají. Proto nový, malý soubor klíčovaný podle
 * **současné** taxonomie, se dvěma poli, která si uživatel vyžádal:
 *
 * - `useful` — k čemu to je v životě. Dítě potřebuje vědět PROČ, jinak ho to nebaví.
 * - `funFact` — zajímavost (historická nebo současná), která nabudí zvědavost.
 *
 * ## Pravidla pro psaní
 *
 * - Obojí musí být **pravda**. Když si nejsem jistý číslem, radši ho neuvádím.
 * - `useful` mluví o životě dítěte, ne o osnovách. Ne „naučíš se zaokrouhlovat",
 *   ale „v obchodě ti to řekne, jestli ti zbydou peníze".
 * - `funFact` není poučka. Je to věc, kterou dítě řekne doma u večeře.
 * - Žádné emoji — ikonu nese rozhraní.
 *
 * Klíč: `${subject}::${category}::${topic}`, fallback `${subject}::${category}`.
 */

export interface TopicInsight {
  /** K čemu to je v životě — 1–2 věty, 2. osoba. */
  useful: string;
  /** Zajímavost, která nabudí zvědavost. */
  funFact: string;
}

/** Klíčováno podle SOUČASNÉ taxonomie — viz docblock výše. */
export const TOPIC_INSIGHT: Record<string, TopicInsight> = {
  // ───────────────────────── MATEMATIKA ─────────────────────────
  "matematika::Číslo a početní operace::Číselný obor 0–100": {
    useful: "Do sta počítáš pokaždé, když si přepočítáváš peníze v peněžence nebo hlídáš čas — hodina má šedesát minut a ty se do sta vejdou.",
    funFact: "Slovo „procento“ znamená doslova „ze sta“. Proto se všechny slevy v obchodě počítají právě do sta.",
  },
  "matematika::Číslo a početní operace::Číselný obor 0–1000": {
    useful: "Tisícovka je hranice, za kterou začínají velké nákupy, vzdálenosti mezi městy a stránky v tlustých knihách.",
    funFact: "Metr má přesně tisíc milimetrů. Když si představíš tisíc, představuješ si obyčejné pravítko rozdělené na nejmenší dílky.",
  },
  "matematika::Číslo a početní operace::Číselný obor 0–1 000 000": {
    useful: "Milion potkáš u počtu obyvatel, u cen bytů i u zhlédnutí videí. Bez něj bys neuměl/a říct, jestli je číslo velké, nebo obrovské.",
    funFact: "Kdybys počítal/a jedno číslo za sekundu bez přestávky, k milionu bys došel/došla až za jedenáct a půl dne.",
  },
  "matematika::Číslo a početní operace::Násobení a dělení": {
    useful: "Násobení je zkratka pro sčítání pořád dokola. Místo „4 + 4 + 4 + 4 + 4“ řekneš „pětkrát čtyři“ a máš hotovo.",
    funFact: "Znak × zavedl v roce 1631 anglický matematik William Oughtred. Do té doby se násobení psalo slovy.",
  },
  "matematika::Číslo a početní operace::Násobilka": {
    useful: "Malá násobilka je nářadí, které použiješ pokaždé, když počítáš cenu více stejných věcí — pět rohlíků, tři lístky, osm balíčků.",
    funFact: "Nejstarší dochovaná násobilka pochází z Číny, je jí přes dva tisíce let a je zapsaná na bambusových proužcích.",
  },
  "matematika::Číslo a početní operace::Písemné početní operace": {
    useful: "Písemný postup zvládne čísla, která už ti nevejdou do hlavy. Proto se ho drží účetní, prodavači i stavaři.",
    funFact: "Způsob, jak sčítáme pod sebou, se do Evropy dostal z arabských knih. Ještě ve 13. století se u nás počítalo na počitadle.",
  },
  "matematika::Číslo a početní operace::Velká čísla a desetinná čísla": {
    useful: "Desetinná čísla jsou řeč cen, váhy a míry: 1,5 litru, 0,75 kilogramu, 12,90 korun.",
    funFact: "Desetinnou tečku prosadil na začátku 17. století John Napier. Půlka světa dodnes píše tečku tam, kde my píšeme čárku.",
  },
  "matematika::Číslo a početní operace::Zlomky": {
    useful: "Zlomek je způsob, jak se spravedlivě rozdělit — půlka pizzy, čtvrt hodiny, třetina čokolády.",
    funFact: "Staří Egypťané uměli zapsat skoro jen zlomky s jedničkou nahoře. Tři čtvrtiny proto psali jako polovinu a čtvrtinu dohromady.",
  },
  "matematika::Geometrie v rovině a v prostoru::Body, přímky, úsečky": {
    useful: "Bez úsečky a pravítka bys nenakreslil/a plán pokoje ani nezměřil/a, jestli se skříň vejde ke zdi.",
    funFact: "Přímka je nekonečná, takže se na papír nikdy nevejde celá. Kreslíme z ní vždycky jen kousek.",
  },
  "matematika::Geometrie v rovině a v prostoru::Rovinné útvary": {
    useful: "Tvary poznáš na dopravních značkách: trojúhelník varuje, kruh přikazuje nebo zakazuje.",
    funFact: "Včely stavějí plástve ze šestiúhelníků. Pokryjí jimi plochu beze zbytku a spotřebují nejmíň vosku.",
  },
  "matematika::Geometrie v rovině a v prostoru::Obvod a obsah": {
    useful: "Obvod potřebuješ na plot kolem zahrady, obsah na to, kolik trávníku dovnitř koupit.",
    funFact: "Dva pozemky se stejným obvodem můžou mít úplně jiný obsah. Nejvíc plochy při stejném obvodu má vždycky kruh.",
  },
  "matematika::Geometrie v rovině a v prostoru::Konstrukce a obsah": {
    useful: "Rýsování je jazyk, kterým se domlouvají architekti a truhláři. Kdo ho neumí přečíst, nepostaví podle plánu nic.",
    funFact: "Kružítko a pravítko stačí na většinu konstrukcí, ale rozdělit jimi libovolný úhel na tři stejné díly nejde. Dokázalo se to až v roce 1837.",
  },
  "matematika::Geometrie v rovině a v prostoru::Souměrnost": {
    useful: "Souměrnost hlídá, aby ti sedělo obojí — křídla motýla, obě půlky obličeje i písmena, která se v zrcadle nezmění.",
    funFact: "Písmena A, H, I, M, O, T, U, V, W, X a Y jsou souměrná podle svislé osy. V zrcadle vypadají stejně.",
  },
  "matematika::Nestandardní aplikační úlohy a problémy::Slovní úlohy": {
    useful: "Slovní úloha je trénink na to, co tě v životě potká pořád: z běžné věty vytáhnout, co se má spočítat.",
    funFact: "Nejstarší slovní úlohy jsou na egyptském papyru starém přes tři a půl tisíce let. I v nich šlo o chleba a pivo.",
  },
  "matematika::Nestandardní aplikační úlohy a problémy::Slovní a logické úlohy": {
    useful: "Když si úlohu umíš přeložit do čísel, poradíš si i s tím, co jsi nikdy předtím neviděl/a.",
    funFact: "Hlavolam s převozem vlka, kozy a zelí sepsal mnich Alkuin už kolem roku 800.",
  },
  "matematika::Nestandardní aplikační úlohy a problémy::Logické úlohy": {
    useful: "Logika je dovednost vyloučit to, co nemůže platit. Používá ji detektiv i programátor.",
    funFact: "Sudoku vzniklo v roce 1979 v USA pod názvem Number Place. Slávu mu udělalo až Japonsko.",
  },
  "matematika::Závislosti, vztahy a práce s daty::Měření a jednotky": {
    useful: "Jednotky jsou domluva, díky které si rozumíme. Bez nich by „dvě“ neznamenalo nic.",
    funFact: "Metr byl původně definovaný jako desetimiliontina vzdálenosti od severního pólu k rovníku.",
  },
  "matematika::Závislosti, vztahy a práce s daty::Práce s daty": {
    useful: "Tabulka a graf ukážou na první pohled to, co by ve větách trvalo přečíst pět minut.",
    funFact: "První koláčový graf nakreslil William Playfair v roce 1801. Do té doby se čísla jen vypisovala.",
  },

  // ───────────────────────── ČEŠTINA ─────────────────────────
  "čeština::Jazyková výchova::Zvuková stránka jazyka": {
    useful: "Když slyšíš, jestli je souhláska tvrdá, nebo měkká, napíšeš správně i slovo, které jsi nikdy neviděl/a.",
    funFact: "Háček nad písmeny se připisuje Janu Husovi. Do té doby se „č“ psalo jako „cz“ a texty byly o poznání delší.",
  },
  "čeština::Jazyková výchova::Slovní zásoba": {
    useful: "Čím víc slov znáš, tím přesněji řekneš, co myslíš — a tím míň nedorozumění.",
    funFact: "Největší český slovník má přes dvě stě tisíc hesel. V běžném dni si přitom vystačíš zhruba s pěti tisíci slovy.",
  },
  "čeština::Jazyková výchova::Tvarosloví": {
    useful: "Slovní druhy jsou návod, jak se slovo chová ve větě. Podle nich poznáš, co se ohýbá a co zůstává.",
    funFact: "Čeština má sedm pádů. Finština jich má patnáct, takže na náš předložkový „v domě“ jí stačí jediné slovo.",
  },
  "čeština::Jazyková výchova::Pravopis": {
    useful: "Pravopis je slušnost vůči tomu, kdo tě čte. Chyba ho zdrží a někdy i splete.",
    funFact: "Ypsilon se kdysi vyslovovalo jinak než „i“. Rozdíl ve výslovnosti dávno zmizel, ale pravidlo zůstalo.",
  },
  "čeština::Jazyková výchova::Nauka o slově": {
    useful: "Když znáš kořen slova, odhadneš i význam slova, které slyšíš poprvé.",
    funFact: "Slovo „robot“ vymyslel malíř Josef Čapek pro hru svého bratra Karla z roku 1920. Vzniklo z „roboty“, tedy nucené práce.",
  },
  "čeština::Jazyková výchova::Skladba": {
    useful: "Podmět a přísudek jsou kostra věty. Kdo je najde, ví, kdo co dělá — i v dlouhém souvětí.",
    funFact: "Čeština snese skoro libovolné pořadí slov ve větě. Angličtina by se při stejné výměně rozpadla.",
  },
  "čeština::Jazyková výchova::Jazyková výchova": {
    useful: "Pravidla jazyka nejsou samoúčel. Díky nim tě přečte i někdo, kdo tě nezná.",
    funFact: "Nejznámější české slovo bez jediné samohlásky je „scvrnkls“ — osm souhlásek za sebou.",
  },
  "čeština::Komunikační a slohová výchova::Práce s textem": {
    useful: "Vytáhnout z textu to podstatné potřebuješ u návodu, u zadání i u zprávy od kamaráda.",
    funFact: "Zkušený čtenář nečte písmeno po písmenu. Oko skáče po slovech a část textu si domýšlí.",
  },
  "čeština::Komunikační a slohová výchova::Čtení": {
    useful: "Kdo čte s porozuměním, nemusí se ptát. Vyčte si to sám.",
    funFact: "Ve starověku se četlo nahlas. Tiché čtení bylo tak neobvyklé, že si ho současníci zapisovali jako pozoruhodnost.",
  },
  "čeština::Komunikační a slohová výchova::Psaní": {
    useful: "Psaní rukou si pamatuješ líp než ťukání do klávesnice. Mozek si při něm dělá poznámky sám.",
    funFact: "Nejstarší známá česká věta je jen přípisek na okraji staré listiny. Někdo si tam poznamenal, kdo komu dal půdu.",
  },
  "čeština::Komunikační a slohová výchova::Slohová výchova": {
    useful: "Popis, dopis i vypravování mají svůj tvar. Když ho dodržíš, čtenář se v textu neztratí.",
    funFact: "Slovo „sloh“ je příbuzné se slovesem „složit“. Text se opravdu skládá, nepíše se na jeden zátah.",
  },
  "čeština::Komunikační a slohová výchova::Čtení a naslouchání": {
    useful: "Naslouchat znamená rozumět, ne jen slyšet — u výkladu, u zprávy i při hádce.",
    funFact: "Člověk mluví asi sto padesát slov za minutu, ale rozumět stíháme mnohem víc. V tom rozdílu se ztrácí pozornost.",
  },
  "čeština::Komunikační a slohová výchova::Komunikační a slohová výchova": {
    useful: "Kdo umí říct, co myslí, nemusí to opakovat podruhé.",
    funFact: "Otázku od oznámení v češtině rozeznáš jen podle toho, jak zvedneš hlas na konci. Písmena přitom zůstanou stejná.",
  },
  "čeština::Literární výchova::Literární žánry": {
    useful: "Když poznáš, jestli čteš pohádku, nebo báseň, víš dopředu, co od textu čekat.",
    funFact: "Příběh o Popelce se vypráví po celém světě. Nejstarší známá verze je z Číny a je jí přes tisíc let.",
  },
  "čeština::Literární výchova::Práce s knihou": {
    useful: "V knize se orientuješ podle obsahu a čísel stránek. Stejně to pak funguje v učebnici i v příručce.",
    funFact: "Než vznikla kniha se stránkami, četlo se ze svitků. Listovat se nedalo, muselo se odmotávat.",
  },
  "čeština::Literární výchova::Literární druhy a žánry": {
    useful: "Druh textu ti napoví, jak ho číst. Báseň pomalu, návod přesně.",
    funFact: "Bajky s mluvícími zvířaty se připisují Ezopovi, který podle tradice žil v 6. století před naším letopočtem.",
  },
  "čeština::Literární výchova::Práce s textem": {
    useful: "Najít v textu hlavní myšlenku je dovednost, kterou použiješ u každé učebnice i u novinového článku.",
    funFact: "Knihu, kterou čteš očima, si v hlavě přehráváš vlastním hlasem. Proto tě může „unavit“ i tiché čtení.",
  },
  "čeština::Literární výchova::Literární pojmy a žánry": {
    useful: "Přirovnání nebo rým jsou nástroje, kterými autor pracuje. Kdo je vidí, čte pozorněji.",
    funFact: "Rým se v evropské poezii rozšířil až ve středověku. Antické básně se rýmovat nemusely.",
  },
  "čeština::Literární výchova::Literární výchova": {
    useful: "Literatura je zkušenost, kterou nemusíš prožít. Stačí ji přečíst.",
    funFact: "V Česku vyjde každý rok kolem patnácti tisíc nových knih. To je víc než jedna každou hodinu, ve dne v noci.",
  },

  // ───────────────────────── PRVOUKA ─────────────────────────
  "prvouka::Místo, kde žijeme::Obec a okolí": {
    useful: "Znát svoje okolí znamená umět říct, kde bydlíš, a najít cestu domů.",
    funFact: "Skoro každá obec u nás má svůj znak. Většina jich vznikla podle toho, čím se tam lidé živili.",
  },
  "prvouka::Místo, kde žijeme::Naše vlast": {
    useful: "Vlajka, hymna a mapa jsou věci, podle kterých svou zemi poznáš mezi ostatními.",
    funFact: "Česká hymna je částí písně z divadelní hry z roku 1834. Původně ji zpívala postava slepého houslisty.",
  },
  "prvouka::Lidé kolem nás::Soužití lidí": {
    useful: "Pravidla ve třídě fungují ze stejného důvodu jako pravidla silničního provozu — aby si lidé nepřekáželi.",
    funFact: "Pozdrav „ahoj“ k nám doputoval od námořníků. Původně to bylo volání z lodi na loď.",
  },
  "prvouka::Lidé kolem nás::Soužití a komunikace": {
    useful: "Umět se domluvit je dovednost, kterou využiješ víc než většinu vzorců.",
    funFact: "Podávání ruky prý vzniklo proto, aby oba ukázali, že v ní nemají zbraň.",
  },
  "prvouka::Lidé a čas::Měření času a tradice": {
    useful: "Hodiny a kalendář ti řeknou, kdy má co být. Bez nich bys přišel/přišla pozdě všude.",
    funFact: "Dřív se čas měřil sluncem a stínem. Sluneční hodiny fungují dodnes, ale v noci a v mlze mlčí.",
  },
  "prvouka::Lidé a čas::Minulost a současnost": {
    useful: "Když víš, jak se žilo dřív, líp chápeš, proč věci kolem tebe vypadají, jak vypadají.",
    funFact: "Hrady se nestavěly kvůli kráse, ale kvůli výhledu. Kdo viděl dál, měl víc času se připravit.",
  },
  "prvouka::Rozmanitost přírody::Příroda na jaře a v létě": {
    useful: "Podle přírody poznáš, jaké je období — a taky co si vzít na sebe.",
    funFact: "Sněženka kvete tak brzy, že ji sníh většinou nezastaví. Proslavila se tím i ve svém jméně.",
  },
  "prvouka::Rozmanitost přírody::Příroda na podzim a v zimě": {
    useful: "Když víš, proč stromy shazují listí, poznáš i to, kdy je čas začít přikrmovat ptáky.",
    funFact: "Listy na podzim nezežloutnou. Žluté barvivo v nich bylo celou dobu, jen ho přebíjela zelená.",
  },
  "prvouka::Rozmanitost přírody::Domácí a hospodářská zvířata": {
    useful: "Znát, co která zvířata potřebují, je základ toho, aby ses o ně uměl/a starat.",
    funFact: "Kráva stráví přežvykováním kolem osmi hodin denně. To je skoro celá pracovní směna.",
  },
  "prvouka::Rozmanitost přírody::Živá a neživá příroda": {
    useful: "Rozdíl mezi živým a neživým je první třídění, které v přírodě uděláš. Všechna další na něm stojí.",
    funFact: "Kámen neroste, ale krystal ano. Proto se o krystalech dlouho spekulovalo, jestli nejsou živé.",
  },
  "prvouka::Rozmanitost přírody::Rostliny a živočichové": {
    useful: "Kdo pozná strom nebo ptáka, chodí venku úplně jinak. Vidí, co ostatní přehlédnou.",
    funFact: "Ve stromě putuje voda z kořenů do koruny i přes třicet metrů vysoko, a to bez jediného čerpadla.",
  },
  "prvouka::Rozmanitost přírody::Ekosystémy": {
    useful: "Když víš, kdo koho v přírodě potřebuje, pochopíš, proč nejde vytáhnout jeden druh a nechat zbytek beze změny.",
    funFact: "Po návratu vlků do Yellowstonu se podle vědců zazelenaly břehy řek. Jelenům se přestalo vyplácet se u vody zdržovat.",
  },
  "prvouka::Člověk a jeho zdraví::Zdravý životní styl": {
    useful: "Spánek, jídlo a pohyb rozhodují o tom, jak ti půjde všechno ostatní. I škola.",
    funFact: "Dítě potřebuje spát devět až jedenáct hodin. Právě ve spánku se ukládá to, co se přes den naučilo.",
  },
  "prvouka::Člověk a jeho zdraví::Prevence a první pomoc": {
    useful: "Znát tísňové číslo a umět říct, kde jsi, je dovednost, která opravdu zachraňuje.",
    funFact: "Číslo 112 funguje ve všech zemích Evropské unie a dovoláš se na něj i z telefonu bez kreditu.",
  },
  "prvouka::Člověk a jeho zdraví::Lidské tělo": {
    useful: "Když víš, jak tělo funguje, poznáš, kdy je něco v pořádku a kdy ne.",
    funFact: "Miminko má v těle asi tři sta kostí, dospělý jen dvě stě šest. Část jich během růstu sroste dohromady.",
  },
  "prvouka::Člověk a jeho zdraví::Bezpečnost a první pomoc": {
    useful: "Většina úrazů se dá odvrátit tím, že člověk dopředu ví, co dělat.",
    funFact: "Při oživování se hrudník stlačuje asi stokrát za minutu. Záchranáři si ten rytmus pamatují podle známé písničky.",
  },

  // ───────────────────────── PŘÍRODOVĚDA ─────────────────────────
  "přírodověda::Rozmanitost přírody::Rozmanitost přírody": {
    useful: "Třídit přírodu znamená vědět, co s čím souvisí. To je základ všeho dalšího poznávání.",
    funFact: "Vědci popsali kolem jednoho a půl milionu druhů. Odhadují ale, že jich na Zemi žije mnohonásobně víc.",
  },
  "přírodověda::Rozmanitost přírody::Ekosystémy a životní prostředí": {
    useful: "Když rozumíš tomu, jak spolu příroda drží, poznáš, co znamená jediný zásah navíc.",
    funFact: "Jeden vzrostlý buk vyrobí za slunečný den podle odhadů tolik kyslíku, že by vystačil desítkám lidí.",
  },
  "přírodověda::Rozmanitost přírody::Energie a její zdroje": {
    useful: "Energie stojí peníze a mění krajinu. Proto se vyplatí vědět, odkud se bere.",
    funFact: "Slunce dodá Zemi za jedinou hodinu víc energie, než kolik lidstvo spotřebuje za celý rok.",
  },
  "přírodověda::Rozmanitost přírody::Neživá příroda - rozšíření": {
    useful: "Horniny, voda a vzduch jsou materiál, ze kterého je postavené všechno kolem. Včetně tvého domu.",
    funFact: "Voda, kterou dnes piješ, tu byla i v době dinosaurů. V přírodě pořád koluje ta stejná.",
  },
  "přírodověda::Rozmanitost přírody::Třídění organismů": {
    useful: "Systém v přírodě je jako rejstřík. Bez něj by se v milionech druhů nedalo vyznat.",
    funFact: "Dvouslovné latinské názvy zavedl Carl Linné v 18. století. Používají se dodnes po celém světě.",
  },
  "přírodověda::Člověk a jeho zdraví::Člověk a jeho zdraví": {
    useful: "Vědět, jak tělo pracuje, je první krok k tomu, aby ti sloužilo dlouho.",
    funFact: "Srdce udělá za den kolem sta tisíc stahů, a to celý život bez jediné přestávky.",
  },
  "přírodověda::Člověk a jeho zdraví::Lidské tělo - soustavy": {
    useful: "Soustavy jsou týmy orgánů. Když víš, kdo v které hraje, pochopíš i to, proč únava jedné dolehne na zbytek.",
    funFact: "Kdyby se všechny cévy v těle natáhly za sebe, měřily by desítky tisíc kilometrů.",
  },
  "přírodověda::Člověk a jeho zdraví::Návyky a prevence": {
    useful: "Většina nemocí se dá odvrátit dřív, než začne. Návykem, ne lékem.",
    funFact: "Mytí rukou před ošetřením prosadil lékař Ignác Semmelweis v roce 1847. Kolegové se mu tehdy vysmáli.",
  },
  "přírodověda::Člověk a jeho zdraví::Vývoj člověka a rozmnožování": {
    useful: "Vědět, jak se tělo mění, ti ušetří strach z toho, co je úplně normální.",
    funFact: "Za první rok života vyroste miminko asi o polovinu své výšky. Kdyby takhle rostlo dál, přerostlo by v deseti letech dům.",
  },

  // ───────────────────────── VLASTIVĚDA ─────────────────────────
  "vlastivěda::Místo, kde žijeme::Místo, kde žijeme": {
    useful: "Mapa je návod, jak se dostat kamkoli. I tam, kde jsi nikdy nebyl/a.",
    funFact: "Sněžka měří 1 603 metrů. Everest je víc než pětkrát vyšší.",
  },
  "vlastivěda::Místo, kde žijeme::Evropa a svět": {
    useful: "Když víš, kde která země leží, dávají smysl i zprávy, které z ní přicházejí.",
    funFact: "Česko nemá moře, ale od nejbližšího pobřeží je to jen asi tři sta kilometrů. Autem za půl dne.",
  },
  "vlastivěda::Lidé kolem nás::Lidé kolem nás": {
    useful: "Pravidla soužití nejsou omezení. Jsou to dohody, díky kterým se dá žít vedle sebe.",
    funFact: "Právo být slyšen mají i děti. Když se rozhoduje o něčem, co se jich týká, musí se je někdo zeptat.",
  },
  "vlastivěda::Lidé kolem nás::Demokracie a stát": {
    useful: "Kdo rozumí tomu, jak se rozhoduje, pozná, kdy může mluvit do věci i on sám.",
    funFact: "Slovo „demokracie“ je řecké a znamená doslova vládu lidu.",
  },
  "vlastivěda::Lidé a čas::Lidé a čas": {
    useful: "Historie je paměť. Bez ní by se každá generace učila totéž znovu od začátku.",
    funFact: "Karel IV. založil pražskou univerzitu v roce 1348. Je nejstarší ve střední Evropě.",
  },
  "vlastivěda::Lidé a čas::Novověk - habsburská monarchie": {
    useful: "Většina hranic, měst a silnic kolem tebe vznikla právě v téhle době.",
    funFact: "Marie Terezie zavedla v roce 1774 povinnou školní docházku. Od té doby se do školy chodí i tehdy, když se nechce.",
  },
  "vlastivěda::Lidé a čas::Národní obrození a 19. století": {
    useful: "Že se dnes učíš česky, není samozřejmost. Bylo to rozhodnutí lidí před dvěma sty lety.",
    funFact: "Josef Jungmann sepsal pětidílný slovník s víc než sto tisíci českými slovy. Mnohá do něj musel teprve vymyslet.",
  },
  "vlastivěda::Lidé a čas::20. století - od T. G. Masaryka po dnešek": {
    useful: "Tohle století vysvětluje, proč Česko vypadá tak, jak vypadá.",
    funFact: "Československo vzniklo 28. října 1918 a rozdělilo se na konci roku 1992. Existovalo tedy sedmdesát čtyři let.",
  },

  // ───────────────────────── DĚJEPIS ─────────────────────────
  "dejepis::Úvod do dějepisu::Historie a historické prameny": {
    useful: "Bez pramenů je historie jen vyprávění. S nimi je to poznání, které se dá ověřit.",
    funFact: "Odpadky jsou pro archeology cennější než poklady. Sídlištní jáma prozradí, co lidé opravdu jedli.",
  },
  "dejepis::Úvod do dějepisu::Pomocné vědy historické": {
    useful: "Datovat nález, přečíst starý zápis nebo poznat pečeť — bez těchhle věd by prameny mlčely.",
    funFact: "Radiokarbonovou metodu vymyslel Willard Libby v roce 1949 a dostal za ni Nobelovu cenu.",
  },
  "dejepis::Pravěk::Vývoj člověka": {
    useful: "Pravěk ukazuje, že skoro všechno, co dnes umíme, musel někdo vymyslet úplně poprvé.",
    funFact: "Věstonická venuše je stará asi devětadvacet tisíc let. Je to nejstarší známá keramická soška na světě.",
  },

  // ───────────────────────── FYZIKA ─────────────────────────
  "fyzika::Měření fyzikálních veličin::Délka, objem, hmotnost": {
    useful: "Změřit znamená dohodnout se na čísle. Bez měření by nešlo nic vyrobit ani porovnat.",
    funFact: "Kilogram byl přes sto let daný jedním kovovým válečkem uloženým v Paříži. Od roku 2019 se počítá z přírodní konstanty.",
  },
  "fyzika::Měření fyzikálních veličin::Hustota, teplota, čas": {
    useful: "Hustota vysvětlí, proč loď plave a kámen ne — a proč se olej drží nad vodou.",
    funFact: "Led je řidší než voda, a proto plave. Kdyby to tak nebylo, rybníky by promrzaly ode dna a ryby by v nich nepřežily.",
  },
};

/**
 * Záchranná síť pro téma, které v `TOPIC_INSIGHT` ještě není (nový obsah).
 * Box se tak nikdy nezobrazí prázdný a nikdy nechybí.
 */
export const CATEGORY_INSIGHT: Record<string, TopicInsight> = {
  "matematika::Číslo a početní operace": {
    useful: "Počítání je nástroj, kterým si ověříš, jestli ti sedí peníze, čas i množství.",
    funFact: "Nula se do Evropy dostala až ve středověku. Římané ji ve svých číslicích vůbec neměli.",
  },
  "matematika::Geometrie v rovině a v prostoru": {
    useful: "Geometrie je řeč tvarů a rozměrů. Mluví jí každý plán, výkres i návod na skládačku.",
    funFact: "Slovo „geometrie“ znamená řecky „měření země“. Vzniklo z vyměřování polí po záplavách Nilu.",
  },
  "matematika::Závislosti, vztahy a práce s daty": {
    useful: "Data ti řeknou, co se opakuje a co je výjimka. To je základ každého rozhodnutí.",
    funFact: "Čísla se dají zobrazit tak, aby vypadala hůř i líp, než jsou. Proto se vyplatí dívat se na osu grafu.",
  },
  "matematika::Nestandardní aplikační úlohy a problémy": {
    useful: "Tyhle úlohy nemají naučený postup. Trénují přesně to, co potřebuješ u nového problému.",
    funFact: "Hlavolamy se používají i u přijímacích pohovorů. Nejde v nich o výsledek, ale o to, jak k němu člověk dojde.",
  },
  "čeština::Jazyková výchova": {
    useful: "Pravidla jazyka jsou dohoda, díky které ti rozumí i cizí člověk.",
    funFact: "Čeština patří mezi jazyky, kde se slova ohýbají. Angličan se místo koncovek musí spolehnout na pořadí slov.",
  },
  "čeština::Komunikační a slohová výchova": {
    useful: "Umět se vyjádřit je dovednost, kterou použiješ v každé práci i v každém sporu.",
    funFact: "Když člověk vypráví příběh, posluchači se v mozku rozsvítí podobná místa jako vypravěči.",
  },
  "čeština::Literární výchova": {
    useful: "Čtení je nejlevnější způsob, jak zažít něco, co bys jinak nezažil/a.",
    funFact: "Knihovny existovaly už ve starověku. Ta v Alexandrii měla podle odhadů statisíce svitků.",
  },
  "prvouka::Místo, kde žijeme": {
    useful: "Orientovat se v okolí je první krok k tomu, aby ses neztratil/a nikde jinde.",
    funFact: "Sever je na mapách nahoře jen z dohody. Staré mapy mívaly nahoře východ, odkud vychází slunce.",
  },
  "prvouka::Lidé kolem nás": {
    useful: "Pravidla soužití jsou důvod, proč spolu můžou vyjít i lidé, kteří se neznají.",
    funFact: "Děti si pravidla hry často vymýšlejí samy. Je to úplně stejný postup, jakým vznikají zákony.",
  },
  "prvouka::Lidé a čas": {
    useful: "Čas se dá měřit i vyprávět. Obojí potřebuješ, abys věděl/a, kde ve světě zrovna jsi.",
    funFact: "Rok má 365 dní a ještě skoro čtvrt dne navíc. Proto máme každý čtvrtý rok jeden den přidaný.",
  },
  "prvouka::Rozmanitost přírody": {
    useful: "Příroda je systém, ne náhoda. Kdo ho vidí, pozná i to, kdy se něco pokazilo.",
    funFact: "V jediné lžíci lesní půdy žije víc organismů, než kolik je lidí na Zemi.",
  },
  "prvouka::Člověk a jeho zdraví": {
    useful: "O tělo se stará jeho majitel. Základní znalosti jsou k tomu potřeba stejně jako u kola nebo počítače.",
    funFact: "Kýchnutí vyletí z nosu rychlostí přes sto kilometrů v hodině.",
  },
  "přírodověda::Rozmanitost přírody": {
    useful: "Když rozumíš přírodě, poznáš, co v ní má být — a co tam nepatří.",
    funFact: "Houby jsou blíž zvířatům než rostlinám. Neumí totiž fotosyntézu.",
  },
  "přírodověda::Člověk a jeho zdraví": {
    useful: "Znát vlastní tělo je nejlepší prevence. Poznáš dřív, že něco není v pořádku.",
    funFact: "Mozek váží jen kolem půldruhého kilogramu, ale spotřebuje asi pětinu veškeré energie těla.",
  },
  "vlastivěda::Místo, kde žijeme": {
    useful: "Mapa a světové strany jsou dovednost, kterou využiješ na výletě i v cizím městě.",
    funFact: "Nejdelší česká řeka je Vltava, ale do moře odtéká voda pod jménem Labe.",
  },
  "vlastivěda::Lidé kolem nás": {
    useful: "Vědět, jak funguje stát a obec, znamená vědět, koho se ptát, když něco nefunguje.",
    funFact: "Volit se u nás smí od osmnácti let. Ještě v roce 1918 volila jen část dospělých.",
  },
  "vlastivěda::Lidé a čas": {
    useful: "Dějiny vysvětlují dnešek. Bez nich by většina věcí kolem tebe vypadala jako náhoda.",
    funFact: "Letopočet, který používáme, se rozšířil až ve středověku. Předtím se počítalo od založení Říma.",
  },
  "dejepis::Úvod do dějepisu": {
    useful: "Dějepis není seznam letopočtů. Je to návod, jak poznat, čemu se dá věřit.",
    funFact: "Historikové rozlišují pramen a literaturu. Pramen vznikl tehdy, literatura o tom píše až dnes.",
  },
  "dejepis::Pravěk": {
    useful: "Pravěk je devadesát devět procent dějin člověka. Zbytek je to, co se stalo potom.",
    funFact: "Oheň se lidé naučili ovládat statisíce let před tím, než vynalezli písmo.",
  },
  "fyzika::Měření fyzikálních veličin": {
    useful: "Fyzika začíná měřením. Bez čísla je to jen dojem.",
    funFact: "Soustava jednotek SI má sedm základních veličin. Všechny ostatní se z nich odvozují.",
  },
};

/**
 * Nejdřív téma, pak kategorie. Nikdy nevrací `null` pro obsah, který
 * v aplikaci je — kategorie pokrývají všechny existující předměty.
 */
export function getTopicInsight(
  subject: string,
  category: string,
  topic?: string,
): TopicInsight | null {
  if (topic) {
    const exact = TOPIC_INSIGHT[`${subject}::${category}::${topic}`];
    if (exact) return exact;
  }
  return CATEGORY_INSIGHT[`${subject}::${category}`] ?? null;
}
