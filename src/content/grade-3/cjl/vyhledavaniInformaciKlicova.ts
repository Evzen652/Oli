import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). L1 a L2 se točily kolem dvou textů
// (poměr unikátních úloh 0,58) a nápověda byla u všech úloh stejná.
// Teď tři oddělené banky, každá úloha s vlastním textem a nápovědou:
// L1 najít v krátkém textu konkrétní údaj · L2 klíčová slova (co to je,
// vybrat je v textu) · L3 spojit dva údaje, poznat tvrzení, které text
// nepodporuje, hlavní myšlenka × detail, strategie hledání.

const L1: PracticeTask[] = [
  choice("Text: „Velryby žijí v oceánech. Živí se drobnými krevetami zvanými kril.“ Čím se velryby živí?", "drobnými krevetami", [
    { value: "velkými rybami", why: "Text mluví o drobných krevetách." },
    { value: "mořskými řasami", why: "O řasách text nemluví." },
    { value: "medúzami", why: "O medúzách text nemluví." },
  ], { hints: ["Najdi větu se slovem živí.", "Odpověď stojí hned za slovesem „živí se“."], explanation: "Velryby se živí drobnými krevetami — krilem." }),
  choice("Text: „Slunečnice roste na slunci. Z jejích semen se lisuje olej.“ Co se lisuje ze semen slunečnice?", "olej", [
    { value: "mouka", why: "Mouka se mele z obilí." },
    { value: "cukr", why: "Cukr se vyrábí z řepy." },
    { value: "med", why: "Med dělají včely." },
  ], { hints: ["Která věta mluví o semenech?", "Přečti větu se slovem „lisuje“ až do konce."], explanation: "Ze semen slunečnice se lisuje olej." }),
  choice("Text: „Mravenci žijí v mraveništi. V jednom mraveništi může být až milion mravenců.“ Kolik mravenců může žít v jednom mraveništi?", "až milion", [
    { value: "až tisíc", why: "Text uvádí mnohem víc." },
    { value: "až sto", why: "Text uvádí mnohem víc." },
    { value: "až deset", why: "Text uvádí mnohem víc." },
  ], { hints: ["Hledej v textu údaj o počtu.", "U otázky „kolik“ se dívej po čísle nebo slově, které vyjadřuje množství."], explanation: "V mraveništi může být až milion mravenců." }),
  choice("Text: „Karel IV. založil v Praze univerzitu roku 1348.“ Kdy byla univerzita založena?", "roku 1348", [
    { value: "roku 1918", why: "Tento letopočet v textu není." },
    { value: "roku 1620", why: "Tento letopočet v textu není." },
    { value: "roku 2000", why: "Tento letopočet v textu není." },
  ], { hints: ["Hledej v textu letopočet.", "Otázka „kdy“ se ptá na čas — v textu je jediný letopočet."], explanation: "Univerzita byla založena roku 1348." }),
  choice("Text: „Veverka si na zimu schovává oříšky do dutin stromů.“ Kam si veverka schovává oříšky?", "do dutin stromů", [
    { value: "do nory v zemi", why: "O noře text nemluví." },
    { value: "do ptačích hnízd", why: "O hnízdech text nemluví." },
    { value: "pod kámen u potoka", why: "O kameni text nemluví." },
  ], { hints: ["Hledej část věty, která odpovídá na otázku kam.", "Místo stojí na konci věty za slovem „oříšky“."], explanation: "Veverka schovává oříšky do dutin stromů." }),
  choice("Text: „Knihovna je otevřená v pondělí a ve středu od 13 do 18 hodin.“ Ve které dny je knihovna otevřená?", "v pondělí a ve středu", [
    { value: "v úterý a ve čtvrtek", why: "Tyto dny v textu nejsou." },
    { value: "každý den v týdnu", why: "Text uvádí jen dva dny." },
    { value: "jen v sobotu", why: "Sobota v textu není." },
  ], { hints: ["Najdi v textu názvy dnů v týdnu.", "Časy (13 až 18 hodin) jsou jiný údaj — otázka se ptá na dny."], explanation: "Knihovna je otevřená v pondělí a ve středu." }),
  choice("Text: „Ježek je noční živočich. Přes den spí v listí a v noci hledá potravu.“ Kdy ježek hledá potravu?", "v noci", [
    { value: "přes den", why: "Přes den ježek spí." },
    { value: "ráno", why: "O ránu text nemluví." },
    { value: "v poledne", why: "O poledni text nemluví." },
  ], { hints: ["Hledej větu se slovem potravu.", "Rozliš, co ježek dělá přes den a co potom."], explanation: "Ježek hledá potravu v noci." }),
  choice("Text: „Vlak do Brna odjíždí v 8.15 z prvního nástupiště.“ Ze kterého nástupiště vlak odjíždí?", "z prvního", [
    { value: "z druhého", why: "Text uvádí jiné nástupiště." },
    { value: "z pátého", why: "Text uvádí jiné nástupiště." },
    { value: "z posledního", why: "Text uvádí jiné nástupiště." },
  ], { hints: ["Najdi slovo nástupiště.", "Údaj o místě stojí těsně před slovem „nástupiště“."], explanation: "Vlak odjíždí z prvního nástupiště." }),
  choice("Text: „Čáp bílý přilétá k nám na jaře a na podzim odlétá do Afriky.“ Kam čáp na podzim odlétá?", "do Afriky", [
    { value: "do Asie", why: "Asie v textu není." },
    { value: "na sever", why: "Text uvádí jiný cíl." },
    { value: "do Ameriky", why: "Amerika v textu není." },
  ], { hints: ["Která část věty mluví o podzimu?", "Za slovem „odlétá“ je cíl cesty."], explanation: "Čáp na podzim odlétá do Afriky." }),
  choice("Text: „Na výlet si vezměte svačinu, pití a pláštěnku. Sraz je v 7 hodin před školou.“ Kde je sraz?", "před školou", [
    { value: "na nádraží", why: "Nádraží v textu není." },
    { value: "v tělocvičně", why: "Tělocvična v textu není." },
    { value: "u školní jídelny", why: "Jídelna v textu není." },
  ], { hints: ["Hledej větu se slovem sraz.", "Odpověď na otázku kde bývá za údajem o čase."], explanation: "Sraz je před školou." }),
  choice("Text: „Nejvyšší horou Česka je Sněžka. Měří 1603 metrů.“ Kolik metrů měří Sněžka?", "1603 metrů", [
    { value: "603 metrů", why: "Chybí první číslice." },
    { value: "2603 metrů", why: "Číslo v textu je jiné." },
    { value: "1306 metrů", why: "Číslice jsou přeházené." },
  ], { hints: ["Hledej číslo za slovem měří.", "Čti číslo pozorně číslici po číslici — pozor na přeházené pořadí."], explanation: "Sněžka měří 1603 metrů." }),
  choice("Text: „Kočka domácí spí až šestnáct hodin denně.“ Kolik hodin denně kočka spí?", "až šestnáct", [
    { value: "až osm", why: "Text uvádí víc hodin." },
    { value: "až dvě", why: "Text uvádí víc hodin." },
    { value: "až dvacet čtyři", why: "Tolik ne — celý den by kočka jen spala." },
  ], { hints: ["Najdi v textu údaj o hodinách.", "Číslo může být napsané i slovem, ne jen číslicemi."], explanation: "Kočka spí až šestnáct hodin denně." }),
  choice("Text: „Divadelní představení začíná v 18 hodin. Vstupenky se prodávají v pokladně od 17 hodin.“ Od kolika hodin se prodávají vstupenky?", "od 17 hodin", [
    { value: "od 18 hodin", why: "To je začátek představení." },
    { value: "od 10 hodin", why: "Tento čas v textu není." },
    { value: "od 8 hodin", why: "Tento čas v textu není." },
  ], { hints: ["V textu jsou dva časy. Ke kterému patří vstupenky?", "Najdi větu se slovem „vstupenky“ a čas vezmi z ní, ne z první věty."], explanation: "Vstupenky se prodávají od 17 hodin; představení začíná v 18." }),
];

const L2: PracticeTask[] = [
  choice("Co jsou klíčová slova?", "slova, která vystihují, o čem text je", [
    { value: "nejdelší slova v celém textu", why: "Délka o důležitosti nerozhoduje." },
    { value: "slova, kterým nerozumíme", why: "Neznámá slova nemusí být důležitá." },
    { value: "první slova každé věty", why: "Na začátku věty nemusí stát to hlavní." },
  ], { hints: ["Kdybys měl popsat obsah dvěma výrazy, jaké by to byly?", "Nejdůležitější výrazy nesou téma — bez nich by ztratil smysl."], explanation: "Klíčová slova vystihují, o čem text je." }),
  choice("K čemu jsou klíčová slova dobrá?", "rychle ukážou, o čem text je", [
    { value: "opravují pravopisné chyby", why: "S pravopisem nesouvisí." },
    { value: "jsou jen v básních", why: "Jsou v každém textu." },
    { value: "jsou to vždy přídavná jména", why: "Nejčastěji to jsou podstatná jména." },
  ], { hints: ["Jak poznáš téma článku, když ho jen přelétneš očima?", "Pár důležitých výrazů prozradí téma bez čtení každé věty."], explanation: "Klíčová slova rychle prozradí téma." }),
  choice("Která slova obvykle klíčová nejsou?", "pomocná slova jako a, je, se", [
    { value: "jméno hlavní postavy", why: "Jméno hlavní postavy bývá klíčové." },
    { value: "slovo, které označuje téma", why: "To je klíčové." },
    { value: "název důležitého místa", why: "Důležité místo bývá klíčové." },
  ], { hints: ["Která slova najdeš v každém textu, ať je o čemkoli?", "Drobná spojovací slova text drží pohromadě, ale téma neprozradí."], explanation: "Pomocná slova (a, je, se) klíčová nebývají." }),
  choice("Kde v textu často najdeš klíčová slova?", "v nadpisu a na začátku textu", [
    { value: "jen v poslední větě", why: "Poslední věta téma neprozradí vždy." },
    { value: "jen v číslech stránek", why: "Čísla stránek téma neprozradí." },
    { value: "nikde, text je nemá", why: "Každý text má téma." },
  ], { hints: ["Co čteš jako první?", "Autor obvykle téma prozradí hned — v názvu a v prvních větách."], explanation: "Klíčová slova bývají v nadpisu a na začátku." }),
  choice("Text: „Velryby jsou největší savci. Žijí v oceánech a živí se krilem.“ Která slova jsou klíčová?", "velryba, oceán, kril", [
    { value: "jsou, se, a", why: "To jsou pomocná slova." },
    { value: "voda, malý, plout", why: "Tato slova v textu nejsou." },
    { value: "kočka, pes, les", why: "S textem nesouvisí." },
  ], { hints: ["O kom text je, kde žije a co jí?", "Klíčová slova odpovídají na otázky kdo, kde a co — pomocná slova vynech."], explanation: "Velryba, oceán, kril — to je jádro textu." }),
  choice("Text: „Slunečnice je vysoká rostlina se žlutým květem. Ze semen slunečnice se lisuje olej.“ Která slova jsou klíčová?", "slunečnice, semena, olej", [
    { value: "je, se, ze", why: "To jsou pomocná slova." },
    { value: "louka, tráva, strom", why: "Tato slova v textu nejsou." },
    { value: "pes, kost, bouda", why: "S textem nesouvisí." },
  ], { hints: ["O čem text je a co se z ní vyrábí?", "Hledej podstatná jména, na kterých stojí téma textu."], explanation: "Slunečnice, semena, olej — to vystihuje text." }),
  choice("Text: „Hasiči jezdí k požárům. Hasí oheň vodou a pěnou. Zachraňují lidi i zvířata.“ Která slova jsou klíčová?", "hasiči, požár, záchrana", [
    { value: "jezdí, a, i", why: "To nejsou klíčová slova." },
    { value: "kuchař, oběd, polévka", why: "S textem nesouvisí." },
    { value: "moře, ryby, loď", why: "S textem nesouvisí." },
  ], { hints: ["Kdo v textu jedná a co dělá?", "Klíčová slova shrnou, o kom text je a jaká je jeho práce."], explanation: "Hasiči, požár, záchrana — to je téma textu." }),
  choice("Text: „Čápi stavějí hnízda na komínech. Živí se žábami a na zimu odlétají do Afriky.“ Která slova jsou klíčová?", "čáp, hnízdo, Afrika", [
    { value: "na, se, a", why: "To jsou pomocná slova." },
    { value: "kočka, myš, stodola", why: "S textem nesouvisí." },
    { value: "kouř, oheň, kamna", why: "Komín je jen místo hnízda, o ohni text není." },
  ], { hints: ["O kterém ptákovi text je?", "Vyber slova o hlavní postavě a nejdůležitějších údajích o ní."], explanation: "Čáp, hnízdo, Afrika — to je jádro textu." }),
  choice("Text: „Zubař pečuje o naše zuby. Radí nám, jak si je čistit, a opravuje kazy.“ Která slova jsou klíčová?", "zubař, zuby, kazy", [
    { value: "nám, jak, je", why: "To jsou pomocná slova." },
    { value: "pekař, chleba, pec", why: "S textem nesouvisí." },
    { value: "zmrzlina, léto, pláž", why: "S textem nesouvisí." },
  ], { hints: ["O kom text je a o co pečuje?", "Klíčová jsou podstatná jména, bez kterých by text ztratil smysl."], explanation: "Zubař, zuby, kazy — to vystihuje text." }),
  choice("Text: „Sněžka je nejvyšší hora Česka. Leží v Krkonoších.“ Která slova jsou klíčová?", "Sněžka, hora, Krkonoše", [
    { value: "je, v, se", why: "To jsou pomocná slova." },
    { value: "moře, pláž, loď", why: "S textem nesouvisí." },
    { value: "řeka, most, voda", why: "S textem nesouvisí." },
  ], { hints: ["O čem text je a kde to leží?", "Jména míst bývají klíčová — řeknou, kde se text odehrává."], explanation: "Sněžka, hora, Krkonoše — to je jádro textu." }),
  choice("Text: „Motýl se líhne z kukly. Předtím je to housenka, která jí listy.“ Která slova jsou klíčová?", "motýl, kukla, housenka", [
    { value: "se, je, z", why: "To jsou pomocná slova." },
    { value: "pták, hnízdo, vejce", why: "S textem nesouvisí." },
    { value: "strom, kůra, kořen", why: "Stromy nejsou téma textu." },
  ], { hints: ["Čím vším motýl během života je?", "Klíčová slova tady ukazují proměnu jednoho živočicha."], explanation: "Motýl, kukla, housenka — to vystihuje text." }),
  choice("Chceš zjistit, kdy akce začíná. Čeho si budeš v textu všímat?", "čísel a údajů o čase", [
    { value: "jmen postav", why: "Jména neřeknou, kdy akce je." },
    { value: "přídavných jmen", why: "Vlastnosti neřeknou čas." },
    { value: "posledního slova textu", why: "Čas může být kdekoli." },
  ], { hints: ["Na co se ptá otázka kdy?", "Odpověď na „kdy“ je vždy nějaký údaj o čase — hodiny, dny, datum."], explanation: "Hledáme čísla a časové údaje." }),
  choice("Nadpis zní „Jak se starat o akvárium“. O čem text bude?", "o péči o rybičky a jejich domov", [
    { value: "o rybolovu na řece", why: "Nadpis mluví o akváriu, ne o řece." },
    { value: "o stavbě domu", why: "S nadpisem nesouvisí." },
    { value: "o práci na zahradě", why: "S nadpisem nesouvisí." },
  ], { hints: ["Co ti prozradí nadpis?", "Nadpis je nejkratší shrnutí textu — z jeho slov poznáš téma."], explanation: "Text bude o péči o akvárium a rybičky." }),
];

const L3: PracticeTask[] = [
  choice("Text: „Mravenec unese předmět až 50krát těžší, než je sám.“ Kdyby byl stejně silný kluk, který váží 30 kg, kolik by unesl?", "1500 kg", [
    { value: "150 kg", why: "30 · 50 není 150." },
    { value: "500 kg", why: "30 · 50 není 500." },
    { value: "80 kg", why: "Čísla nesčítáme, násobíme." },
  ], { hints: ["Kolikrát víc než sám unese mravenec?", "Spoj údaj z textu s novým číslem: váhu kluka vynásob tím, kolikrát je mravenec silnější."], explanation: "30 kg · 50 = 1500 kg." }),
  choice("Text: „Mravenci žijí ve velkých skupinách. Královna klade vajíčka a dělnice hledají potravu.“ Které tvrzení text nepodporuje?", "Mravenci žijí každý sám.", [
    { value: "Mravenci žijí ve skupinách.", why: "To v textu je." },
    { value: "Královna klade vajíčka.", why: "To v textu je." },
    { value: "Dělnice hledají potravu.", why: "To v textu je." },
  ], { hints: ["Které tvrzení textu odporuje?", "Porovnej každé tvrzení s textem — jedno říká opak."], explanation: "Text říká, že mravenci žijí ve skupinách, ne sami." }),
  choice("Text: „Vlak odjíždí v 8 hodin. Cesta trvá 2 hodiny.“ V kolik hodin vlak dorazí?", "v 10 hodin", [
    { value: "v 8 hodin", why: "To je čas odjezdu." },
    { value: "ve 2 hodiny", why: "To je délka cesty." },
    { value: "v 6 hodin", why: "Cesta se k odjezdu přičítá." },
  ], { hints: ["Který čas je odjezd a co je délka cesty?", "Odpověď v textu přímo není — musíš spojit dva údaje dohromady."], explanation: "8 + 2 = 10 — vlak dorazí v 10 hodin." }),
  choice("Text: „Petr má 3 králíky. Eva má o 2 králíky víc než Petr.“ Kolik králíků má Eva?", "5", [
    { value: "3", why: "To má Petr." },
    { value: "2", why: "O tolik má Eva víc." },
    { value: "1", why: "Eva má víc, ne méně." },
  ], { hints: ["Kolik má Petr a o kolik má Eva víc?", "Spoj oba údaje: k Petrovu počtu přičti rozdíl."], explanation: "3 + 2 = 5 králíků." }),
  choice("Text: „Knihovna je otevřená v pondělí a ve středu. Dnes je úterý.“ Kdy nejdřív si můžeš půjčit knihu?", "zítra ve středu", [
    { value: "dnes v úterý", why: "V úterý je zavřeno." },
    { value: "včera v pondělí", why: "To už bylo." },
    { value: "až v sobotu", why: "Středa je dřív a je otevřeno." },
  ], { hints: ["Který otevírací den přijde po úterý jako první?", "Spoj otevírací dny s dnešním dnem."], explanation: "Nejbližší otevírací den po úterý je středa." }),
  choice("Text: „Sova loví v noci. Ve dne spí v dutině stromu.“ Které tvrzení text nepodporuje?", "Sova loví hlavně ve dne.", [
    { value: "Sova loví v noci.", why: "To v textu je." },
    { value: "Sova spí v dutině stromu.", why: "To v textu je." },
    { value: "Sova ve dne spí.", why: "To v textu je." },
  ], { hints: ["Kdy sova podle textu loví?", "Hledej tvrzení, které textu odporuje."], explanation: "Text říká, že sova loví v noci." }),
  choice("Hledáš v jízdním řádu, kdy jede autobus. Jak budeš číst?", "přelétnu tabulku očima a hledám čísla", [
    { value: "čtu každé slovo od začátku", why: "To by trvalo zbytečně dlouho." },
    { value: "čtu odzadu", why: "Tak se hledání nezrychlí." },
    { value: "hledám nejdelší slovo", why: "Délka slova čas neřekne." },
  ], { hints: ["Musíš číst všechno, když hledáš jeden údaj?", "U hledání konkrétního údaje stačí rychle projet očima a zastavit se u čísel."], explanation: "Tabulku přelétneme očima a hledáme čísla — časy." }),
  choice("Text: „Ve škole byl koncert. Po koncertu jsme šli do parku.“ Kam jste šli po koncertu?", "do parku", [
    { value: "na koncert", why: "Koncert byl předtím." },
    { value: "do školy", why: "Ve škole byl koncert." },
    { value: "domů", why: "O domově text nemluví." },
  ], { hints: ["Slovo koncert je v textu dvakrát. Která věta odpovídá?", "Nestačí najít stejné slovo — ověř, že věta odpovídá právě na otázku."], explanation: "Po koncertu šli do parku." }),
  choice("Text: „Jana je starší než Petr. Petr je starší než Tom.“ Kdo je nejmladší?", "Tom", [
    { value: "Jana", why: "Jana je nejstarší." },
    { value: "Petr", why: "Petr je starší než Tom." },
    { value: "všichni jsou stejně staří", why: "Text říká, že se liší." },
  ], { hints: ["Seřaď děti od nejstaršího.", "Spoj obě věty: kdo je starší než kdo?"], explanation: "Jana > Petr > Tom — nejmladší je Tom." }),
  choice("Text: „V lese rostou smrky a buky. Buky na podzim shazují listí, smrky zůstávají zelené.“ Který strom je v zimě zelený?", "smrk", [
    { value: "buk", why: "Buk na podzim shazuje listí." },
    { value: "oba", why: "Buk listí shazuje." },
    { value: "žádný", why: "Smrk zůstává zelený." },
  ], { hints: ["Který strom listí neshazuje?", "Zima přijde po podzimu — co se se stromy stane na podzim?"], explanation: "Smrk zůstává zelený i v zimě." }),
  choice("Text: „Velryby jsou savci. Dýchají vzduch, a proto se vynořují na hladinu.“ Které tvrzení text nepodporuje?", "Velryby dýchají pod vodou žábrami.", [
    { value: "Velryby jsou savci.", why: "To v textu je." },
    { value: "Velryby dýchají vzduch.", why: "To v textu je." },
    { value: "Velryby se vynořují na hladinu.", why: "To v textu je." },
  ], { hints: ["Proč se velryby vynořují?", "Jedno tvrzení odporuje tomu, co text říká o dýchání."], explanation: "Velryby dýchají vzduch, žábry nemají." }),
  choice("Jak poznáš, že nalezená věta opravdu odpovídá na otázku?", "ověřím, že mluví o tom, na co se ptám", [
    { value: "stačí, že obsahuje stejné slovo", why: "Stejné slovo může být i v jiné větě." },
    { value: "vyberu vždy první větu", why: "Odpověď může být kdekoli." },
    { value: "vyberu vždy nejdelší větu", why: "Délka o správnosti nerozhoduje." },
  ], { hints: ["Stačí najít v textu stejné slovo jako v otázce?", "Po nalezení věty se zeptej: odpovídá opravdu na to, na co se ptám?"], explanation: "Musíme ověřit, že věta odpovídá právě na naši otázku." }),
  choice("Text: „Pes je věrný přítel člověka. Hlídá dům, doprovází nás na procházkách a pomáhá i hasičům.“ Co je hlavní myšlenka?", "pes je pro člověka užitečný a věrný pomocník", [
    { value: "psi pomáhají hasičům při záchraně", why: "To je jen jeden příklad." },
    { value: "psi chodí s lidmi na procházky", why: "To je jen jeden příklad." },
    { value: "psi hlídají dům jen v noci", why: "To v textu není." },
  ], { hints: ["Co spojuje všechny příklady v textu?", "Hlavní myšlenka shrnuje celek, jednotlivé příklady jsou detaily."], explanation: "Hlavní myšlenka: pes je člověku věrným pomocníkem; ostatní jsou příklady." }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3);
}

export const VYHLEDAVANIINFO: TopicMetadata[] = [
  {
    id: "g3-cjl-vyhledavani-informaci",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-informaci-v-textu-klicova-slova",
    title: "Vyhledávání informací v textu, klíčová slova",
    studentTitle: "Hledám info v textu",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení",
    briefDescription: "Naučíš se najít klíčové informace a klíčová slova v textu.",
    keywords: ["klíčová slova", "vyhledávání informací", "hlavní myšlenka", "text", "porozumění"],
    goals: ["Najít klíčová slova v textu.", "Vyhledat konkrétní informaci z textu.", "Rozlišit důležité a méně důležité informace."],
    boundaries: ["Krátké texty přiměřené 3. ročníku."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová slova = to nejdůležitější. Hledej: kdo/co je v textu hlavní? O čem celý text je?",
      steps: ["Přečti celý text.", "Zeptej se: O čem to celé je?", "Podtrhni slova, která se opakují nebo jsou nejdůležitější.", "To jsou klíčová slova."],
      commonMistake: "Vybírání dlouhých slov místo klíčových — délka slova neznamená důležitost.",
      example: "Text o velrybách: klíčová slova = velryba, savec, oceán (ne: 'jsou', 'živí se', 'obrovské').",
    },
  },
];
