import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Generátor vracel na všech úrovních
// tentýž seznam se stejnou nápovědou. Teď tři oddělené banky:
// L1 proč a jak píšeme úhledně (nadpis, okraje, odstavce, mezery, držení
// pera, koncept × čistopis) · L2 co udělat v konkrétní situaci · L3 podle
// poznámky učitele poznat, co chybí, kde začít odstavec a jaký dát nadpis.

const L1: PracticeTask[] = [
  choice("Proč je důležité psát čitelně?", "aby to přečetl každý, komu je to určené", [
    { value: "aby sloh vyšel co nejdelší", why: "O délku nejde." },
    { value: "aby se psalo co nejrychleji", why: "Čitelné psaní bývá naopak pomalejší." },
    { value: "aby se spotřebovalo víc papíru", why: "S papírem to nesouvisí." },
  ], { hints: ["Co se stane se slohem, který nikdo nerozluští?", "Píšeme pro čtenáře — musí rozeznat každé písmeno."], explanation: "Čitelně píšeme proto, aby text přečetl každý, komu je určený." }),
  choice("Co patří k úpravě textu?", "nadpis, okraje a odstavce", [
    { value: "jen barva inkoustu", why: "Barva o přehlednosti nerozhoduje." },
    { value: "jen velikost písma", why: "Písmo je jen jedna část úpravy." },
    { value: "jen počet stran", why: "Počet stran s úpravou nesouvisí." },
  ], { hints: ["Co všechno dělá stránku přehlednou?", "Úprava není jen písmo: patří k ní i název nahoře, volné místo po stranách a členění na části."], explanation: "K úpravě patří nadpis, okraje a odstavce." }),
  choice("Kdy začínáme nový odstavec?", "když začíná nová myšlenka", [
    { value: "po každé větě", why: "Pak by byl každý řádek odstavcem." },
    { value: "po každém slově", why: "To by se nedalo číst." },
    { value: "nikdy, píšeme vše v kuse", why: "Text v kuse je nepřehledný." },
  ], { hints: ["Co mají společného věty v jednom odstavci?", "Odstavec drží pohromadě věty o jedné věci; když přijde jiná věc, začneme znovu od kraje."], explanation: "Nový odstavec začínáme, když přecházíme k nové myšlence." }),
  choice("Co je nadpis?", "název, který říká, o čem text bude", [
    { value: "poslední věta celého slohu", why: "Poslední věta je závěr." },
    { value: "podpis autora pod textem", why: "Podpis říká, kdo psal." },
    { value: "datum, kdy byl sloh napsán", why: "Datum říká, kdy se psalo." },
  ], { hints: ["Co čteš jako první, když otevřeš článek v časopise?", "Nadpis stojí nahoře a prozradí téma, například Můj pes."], explanation: "Nadpis je název, který čtenáři řekne, o čem se bude psát." }),
  choice("Kam na stránku píšeme nadpis?", "nahoru na stránku", [
    { value: "doprostřed textu", why: "Tam už by čtenář četl." },
    { value: "na úplný konec", why: "Nadpis má být vidět hned." },
    { value: "na okraj", why: "Okraj zůstává volný." },
  ], { hints: ["Co čtenář uvidí jako první?", "Název stojí před vším ostatním, obvykle uprostřed prvního řádku."], explanation: "Nadpis píšeme nahoru, před text." }),
  choice("Proč necháváme okraje?", "aby byl text přehledný a bylo kam psát opravy", [
    { value: "abychom popsali co nejméně papíru", why: "O úsporu papíru nejde." },
    { value: "protože se to hezky vybarvuje", why: "Okraje se nevybarvují." },
    { value: "okraje nejsou vůbec potřeba", why: "Bez okrajů je stránka natěsnaná." },
  ], { hints: ["K čemu je volné místo po stranách stránky?", "Učitel tam píše poznámky a stránka nevypadá natěsnaná."], explanation: "Okraje dělají stránku přehlednou a je kam napsat poznámku nebo opravu." }),
  choice("Co odděluje jednotlivá slova?", "mezera", [
    { value: "tečka", why: "Tečka ukončuje větu." },
    { value: "čárka", why: "Čárka odděluje části věty." },
    { value: "pomlčka", why: "Pomlčka mezi slova běžně nepatří." },
  ], { hints: ["Jak poznáš, kde jedno slovo končí a druhé začíná?", "Mezi slovy necháváme malé prázdné místo, jinak by se slila."], explanation: "Slova od sebe odděluje mezera." }),
  choice("Jakým tempem píšeme, aby bylo písmo čitelné?", "klidně, ne příliš rychle", [
    { value: "co nejrychleji", why: "Ve spěchu se písmena kroutí." },
    { value: "jedno písmeno za minutu", why: "Tak pomalu psát nemusíme." },
    { value: "na tempu nezáleží", why: "Záleží — spěch písmo kazí." },
  ], { hints: ["Co se stane s písmem, když spěcháš?", "Když spěcháme, písmena se kroutí a slévají; stálé tempo je lepší."], explanation: "Píšeme klidně a ne příliš rychle." }),
  choice("Jak sedíme při psaní?", "rovně, s oběma nohama na zemi", [
    { value: "shrbeně s hlavou na lavici", why: "Tak bolí záda a písmo je křivé." },
    { value: "bokem k lavici", why: "Sešit pak leží šikmo." },
    { value: "napůl vleže na židli", why: "Tak se psát nedá." },
  ], { hints: ["Jak mají vypadat záda, když píšeš?", "Správné sezení: záda opřená, chodidla na podlaze, sešit před sebou."], explanation: "Sedíme rovně a nohy máme na zemi." }),
  choice("Jak držíme pero?", "lehce, třemi prsty", [
    { value: "celou pěstí", why: "Tak se nedá psát jemně." },
    { value: "dvěma prsty za konec", why: "Pero by se kývalo." },
    { value: "křečovitě a pevně", why: "Ruka by se brzy unavila." },
  ], { hints: ["Kolik prstů se pera dotýká?", "Pero drží palec, ukazováček a prostředníček — nesvíráme ho."], explanation: "Pero držíme lehce třemi prsty." }),
  choice("Proč píšeme do řádků?", "text je rovný a dobře se čte", [
    { value: "aby se ušetřil papír", why: "O papír nejde." },
    { value: "je to úplně jedno", why: "Nakřivo psaný text se čte špatně." },
    { value: "kvůli barvě sešitu", why: "Barva nehraje roli." },
  ], { hints: ["Proč má sešit linky?", "Po linkách oko snadno klouže zleva doprava a písmo nepadá."], explanation: "Do řádků píšeme, aby byl text rovný a dobře se četl." }),
  choice("Co je čistopis?", "text přepsaný načisto bez chyb", [
    { value: "první koncept", why: "Koncept je pracovní verze." },
    { value: "sešit na výkresy", why: "To je výtvarná výchova." },
    { value: "papír na poznámky", why: "Poznámky nejsou čistopis." },
  ], { hints: ["Kterou verzi odevzdáváme — první pokus, nebo konečnou?", "Nejdřív koncept se škrty, pak ho pečlivě přepíšeme."], explanation: "Čistopis je text přepsaný načisto, bez chyb a škrtů." }),
  choice("K čemu je koncept?", "k prvnímu zapsání myšlenek, které pak opravíme", [
    { value: "k okamžitému odevzdání paní učitelce", why: "Odevzdává se čistopis." },
    { value: "ke kreslení obrázků k textu", why: "Koncept je na psaní." },
    { value: "k ničemu, rovnou píšeme načisto", why: "Bez konceptu bývá čistopis plný škrtů." },
  ], { hints: ["Co napíšeš dřív, než uděláš čistopis?", "Do konceptu smíme škrtat a přepisovat — je to pracovní verze."], explanation: "Koncept je první verze, kterou ještě opravujeme." }),
];

const L2: PracticeTask[] = [
  choice("Píšeš sloh o prázdninách. Kam napíšeš nadpis „Moje prázdniny“?", "nahoru doprostřed prvního řádku", [
    { value: "na konec textu pod podpis", why: "Nadpis má být vidět hned." },
    { value: "na levý okraj v půlce stránky", why: "Okraj zůstává volný." },
    { value: "do posledního řádku", why: "Tam už text končí." },
  ], { hints: ["Kde čtenář hledá název?", "Název stojí před vším ostatním a je vycentrovaný."], explanation: "Nadpis píšeme nahoru doprostřed prvního řádku." }),
  choice("Tvůj text o psovi má dvě části: jak pes vypadá a co spolu děláme. Jak je rozdělíš?", "do dvou odstavců", [
    { value: "každou větu na nový řádek", why: "Pak by se části ztratily." },
    { value: "všechno do jednoho bloku", why: "Části by nešly rozeznat." },
    { value: "každé slovo na nový řádek", why: "To by se nedalo číst." },
  ], { hints: ["Kolik různých témat text má?", "Každé téma dostane vlastní část, která začíná od kraje s odsazením."], explanation: "Dvě témata — dva odstavce." }),
  choice("Kamarád napsal: „Jdudoškolyvčas.“ Co je špatně?", "chybí mezery mezi slovy", [
    { value: "chybí nadpis", why: "Jedna věta nadpis nepotřebuje." },
    { value: "chybí okraje", why: "O okrajích tu nic nevíme." },
    { value: "je tam moc odstavců", why: "Je to jediná věta." },
  ], { hints: ["Kolik slov ve větě je a kde jedno končí?", "Oko potřebuje volné místo, aby slova od sebe rozeznalo."], explanation: "Správně: Jdu do školy včas. — slova musí dělit mezery." }),
  choice("Honza psal tak rychle, že nikdo nepozná, jestli napsal a, nebo o. Co má příště udělat?", "psát pomaleji a pečlivěji", [
    { value: "psát ještě rychleji", why: "Spěch písmo zhoršuje." },
    { value: "psát drobnějším písmem", why: "Drobné písmo se čte ještě hůř." },
    { value: "psát bez mezer", why: "Bez mezer se čte hůř." },
  ], { hints: ["Proč se písmena Honzovi pletou?", "Když spěcháme, tvary písmen se ztrácejí; klidné tempo pomůže."], explanation: "Honza má psát pomaleji a pečlivěji." }),
  choice("Text vede až k samému kraji papíru a učitel nemá kam psát poznámky. Co chybí?", "okraje", [
    { value: "nadpis", why: "Nadpis s místem na poznámky nesouvisí." },
    { value: "odstavce", why: "Odstavce dělí text, místo na poznámky nedávají." },
    { value: "mezery", why: "Mezery jsou mezi slovy." },
  ], { hints: ["Kde se na stránce píšou poznámky učitele?", "Po stranách stránky má zůstat volný pruh, na který se nepíše."], explanation: "Chybí okraje — volné místo po stranách." }),
  choice("Při psaní ti řádky utíkají šikmo nahoru. Co pomůže?", "psát do linkovaného sešitu nebo s podložkou s linkami", [
    { value: "psát rychleji, ať je to hotové", why: "Rychlost řádky nesrovná." },
    { value: "otočit papír vzhůru nohama", why: "To nepomůže." },
    { value: "psát mnohem větším písmem", why: "Velikost písma řádky nesrovná." },
  ], { hints: ["Co ti ukáže, kde má řádek vést?", "Vodicí čáry pod papírem či v sešitě udrží písmo rovně."], explanation: "Pomůže linkovaný sešit nebo podložka s linkami." }),
  choice("Uděláš v čistopisu chybu. Jak ji opravíš, aby byl text úhledný?", "přeškrtnu ji jednou tenkou čarou", [
    { value: "přetřu ji tolikrát, až je černá", why: "Černá skvrna je neúhledná." },
    { value: "vygumuji do papíru díru", why: "Díra stránku zničí." },
    { value: "přepíšu písmena přes ni", why: "Přepsaná písmena nejdou přečíst." },
  ], { hints: ["Jak opravit chybu, aby stránka zůstala čistá?", "Oprava má být nenápadná a čitelná — žádné čmáranice ani díry."], explanation: "Chybu přeškrtneme jednou tenkou čarou." }),
  choice("Lucie píše tak drobně, že se to nedá přečíst. Co jí poradíš?", "psát písmena větší a zřetelnější", [
    { value: "psát ještě drobněji", why: "To by bylo horší." },
    { value: "psát bez mezer", why: "Bez mezer se čte hůř." },
    { value: "psát jen tužkou", why: "Tužka velikost písma nezmění." },
  ], { hints: ["Proč se Luciino písmo nedá číst?", "Drobné tvary oko nerozliší; pomůže zvětšit je a dotáhnout."], explanation: "Lucie má psát větší a zřetelnější písmena." }),
  choice("Na konci řádku ti nestačí místo na celé slovo. Co uděláš?", "slovo rozdělím a dopíšu na další řádek", [
    { value: "napíšu ho přes okraj", why: "Okraj má zůstat volný." },
    { value: "napíšu ho malinkými písmeny", why: "Malinká písmena nejdou přečíst." },
    { value: "vynechám ho úplně", why: "Věta by pak nedávala smysl." },
  ], { hints: ["Smí se psát do okraje?", "Slova můžeme dělit mezi slabikami a pokračovat o linku níž."], explanation: "Slovo rozdělíme mezi slabikami a pokračujeme na dalším řádku." }),
  choice("Píšeš přání babičce. Jak ho upravíš?", "oslovení nahoře, text pod ním a podpis dole", [
    { value: "podpis nahoře a oslovení dole", why: "Pořadí je obrácené." },
    { value: "všechno do jednoho řádku", why: "Přání by bylo nepřehledné." },
    { value: "text dokola po okrajích", why: "Tak se nedá číst." },
  ], { hints: ["Co babičce napíšeš jako první a co jako poslední?", "Přání má pevné pořadí: začíná se tím, komu píšeme, a končí se tím, kdo píše."], explanation: "Nahoře oslovení, pod ním text a dole podpis." }),
  choice("Martin píše slova nalepená na sebe a věty bez teček. Co jeho text zlepší nejvíc?", "mezery mezi slovy a tečky za větami", [
    { value: "větší a barevnější nadpis", why: "Nadpis slova ani věty neoddělí." },
    { value: "širší okraje na stránce", why: "Okraje slova neoddělí." },
    { value: "pero jiné barvy", why: "Barva nepomůže." },
  ], { hints: ["Co Martinovi chybí, aby šla slova i věty od sebe rozeznat?", "Volné místo odděluje slova, znaménko na konci odděluje věty."], explanation: "Nejvíc pomohou mezery a tečky." }),
  choice("Do sešitu píšeš dvě cvičení za sebou. Jak je oddělíš?", "vynechám řádek a napíšu číslo dalšího cvičení", [
    { value: "napíšu je hned za sebe bez mezery", why: "Pak nepoznáš, kde jedno končí." },
    { value: "druhé napíšu přes první", why: "Tak se nedá číst ani jedno." },
    { value: "druhé napíšu do okraje", why: "Okraj zůstává volný." },
  ], { hints: ["Jak má učitel poznat, kde jedna úloha končí a další začíná?", "Volné místo a označení úlohy stránku přehledně rozdělí."], explanation: "Vynecháme řádek a označíme další cvičení číslem." }),
  choice("Při psaní se ti třese ruka únavou. Co uděláš?", "chvíli si odpočinu a protáhnu prsty", [
    { value: "budu psát ještě rychleji", why: "Unavená ruka píše ve spěchu hůř." },
    { value: "sevřu pero pevněji", why: "Ruka se unaví ještě víc." },
    { value: "dopíšu to levou rukou", why: "Písmo by bylo nečitelné." },
  ], { hints: ["Co pomůže unavené ruce?", "Unavená ruka píše nečitelně — krátká pauza a uvolnění pomůže víc než spěch."], explanation: "Chvíli si odpočineme a protáhneme prsty." }),
];

const L3: PracticeTask[] = [
  choice("Paní učitelka napsala pod sloh: „Nevím, kde končí jedna myšlenka a začíná další.“ Co máš příště udělat?", "rozdělit text do odstavců", [
    { value: "napsat větší nadpis", why: "Nadpis myšlenky neoddělí." },
    { value: "nechat širší okraje", why: "Okraje myšlenky neoddělí." },
    { value: "psát tmavším perem", why: "Barva myšlenky neoddělí." },
  ], { hints: ["Jak se na stránce oddělují myšlenky?", "Když přejdeš k jiné věci, začni znovu od kraje s malým odsazením."], explanation: "Každou myšlenku dáme do vlastního odstavce." }),
  choice("Paní učitelka napsala pod sloh: „Nemám kam napsat opravu.“ Co chybělo?", "okraje", [
    { value: "nadpis", why: "Nadpis s místem na opravu nesouvisí." },
    { value: "odstavce", why: "Odstavce místo na opravu nedají." },
    { value: "datum", why: "Datum s místem na opravu nesouvisí." },
  ], { hints: ["Kde učitel obvykle píše opravy?", "Volný pruh po stranách je místo pro poznámky; když ho zaplníš, učitel nemá kam psát."], explanation: "Chyběly okraje." }),
  choice("Paní učitelka napsala pod sloh: „Nevím, o čem budu číst, dokud to nedočtu.“ Co chybělo?", "nadpis", [
    { value: "okraje", why: "Okraje téma neprozradí." },
    { value: "odstavce", why: "Odstavce téma neprozradí." },
    { value: "podpis", why: "Podpis říká, kdo psal." },
  ], { hints: ["Co čtenáři prozradí téma hned na začátku?", "Krátký název nad textem řekne, o čem se bude psát."], explanation: "Chyběl nadpis." }),
  choice("Paní učitelka napsala pod sloh: „Slova se mi slévají dohromady.“ Co chybělo?", "mezery mezi slovy", [
    { value: "větší nadpis nahoře", why: "Nadpis slova neoddělí." },
    { value: "širší okraje", why: "Okraje slova neoddělí." },
    { value: "víc odstavců", why: "Odstavce oddělují myšlenky, ne slova." },
  ], { hints: ["Co odděluje jednotlivá slova?", "Když slova stojí natěsno u sebe, oko je nerozliší — potřebují trochu volného místa."], explanation: "Chyběly mezery mezi slovy." }),
  choice("Paní učitelka napsala pod sloh: „Nepoznám, kde věta končí.“ Co chybělo?", "tečky na konci vět", [
    { value: "mezery mezi slovy", why: "Mezery oddělují slova, ne věty." },
    { value: "nadpis", why: "Nadpis věty neoddělí." },
    { value: "okraje", why: "Okraje věty neoddělí." },
  ], { hints: ["Jaké znaménko ukončuje oznamovací větu?", "Znaménko za posledním slovem říká čtenáři: tady se zastav."], explanation: "Chyběly tečky na konci vět." }),
  choice("Text: „Moje kočka se jmenuje Micka. Je černá a má zelené oči. V neděli jsme jeli na výlet do Brna. Jeli jsme vlakem.“ Kde má začít nový odstavec?", "u věty V neděli jsme jeli na výlet do Brna.", [
    { value: "u věty Je černá a má zelené oči.", why: "Tahle věta ještě patří ke kočce." },
    { value: "u věty Jeli jsme vlakem.", why: "Tahle věta patří k výletu." },
    { value: "nikde, všechno patří k sobě", why: "Kočka a výlet jsou dvě různá témata." },
  ], { hints: ["Kde se mění téma? O čem je začátek a o čem zbytek?", "Nový odstavec začíná tam, kde přestaneme psát o kočce a začneme o něčem jiném."], explanation: "První dvě věty jsou o kočce, další o výletě — odstavec začíná větou o neděli." }),
  choice("Text: „Ráno jsem vstal a nasnídal se. Pak jsem šel do školy. Odpoledne jsem hrál fotbal s kamarády. Dali jsme tři góly.“ Kde má začít nový odstavec?", "u věty Odpoledne jsem hrál fotbal s kamarády.", [
    { value: "u věty Pak jsem šel do školy.", why: "Ráno a cesta do školy patří k sobě." },
    { value: "u věty Dali jsme tři góly.", why: "Góly patří k fotbalu." },
    { value: "nikde, všechno patří k sobě", why: "Dopoledne a zábava po škole jsou dva celky." },
  ], { hints: ["Rozděl den na části — co bylo dopoledne a co potom?", "Ráno a škola patří k sobě; zábava po škole je nový celek."], explanation: "Nový odstavec začíná tam, kde přechází vyprávění ke hře po škole." }),
  choice("Který nadpis se nejlépe hodí k textu o tom, jak se staráme o morče?", "Péče o morče", [
    { value: "Můj den", why: "Tento nadpis je o něčem jiném." },
    { value: "Zvířata", why: "Příliš obecné — nepozná se, o co jde." },
    { value: "Návštěva u babičky", why: "S textem nesouvisí." },
  ], { hints: ["O čem přesně text je?", "Nadpis má krátce a přesně pojmenovat téma — ne příliš obecně, ne o něčem jiném."], explanation: "Nejlépe sedí „Péče o morče“ — řekne přesně, o čem text je." }),
  choice("Který nadpis se nejlépe hodí k textu o výletě na hrad Karlštejn?", "Výlet na Karlštejn", [
    { value: "Hrady v Evropě", why: "Text je o jednom výletě, ne o všech hradech." },
    { value: "Moje škola", why: "S textem nesouvisí." },
    { value: "Cestování", why: "Příliš obecné." },
  ], { hints: ["Který nadpis říká přesně, kam se jelo?", "Obecný nadpis je moc široký; nadpis o jiném tématu k textu nesedí."], explanation: "„Výlet na Karlštejn“ přesně vystihuje téma." }),
  choice("Máš opsat básničku. Jak zachováš její úpravu?", "každý verš na nový řádek a mezi slokami vynechám řádek", [
    { value: "celou básničku napíšu do jednoho odstavce", why: "Tak by zmizely verše i sloky." },
    { value: "každé slovo napíšu na zvláštní řádek", why: "Verš má víc slov." },
    { value: "vynechám nadpis i jméno autora", why: "Nadpis a autor k básni patří." },
  ], { hints: ["Jak vypadá báseň v čítance?", "Básnička se píše po řádcích a skupiny řádků jsou od sebe oddělené."], explanation: "Každý verš píšeme na nový řádek a sloky oddělujeme vynechaným řádkem." }),
  choice("Píšeš pozvánku na nástěnku. Jak ji upravíš, aby se dala přečíst i z dálky?", "velké, zřetelné písmo a krátký text", [
    { value: "drobné písmo, ať se vejde co nejvíc textu", why: "Drobné písmo z dálky nepřečteš." },
    { value: "text přes celou plochu bez mezer", why: "Bez mezer se čte špatně." },
    { value: "žlutá pastelka na bílém papíře", why: "Světlá barva na bílé splývá." },
  ], { hints: ["Co přečteš z druhého konce chodby?", "Na dálku oko rozliší jen výrazná písmena a málo slov."], explanation: "Z dálky přečteme velké, zřetelné písmo a krátký text." }),
  choice("Tvůj koncept je plný škrtů. Co uděláš, než text odevzdáš?", "přepíšu ho úhledně načisto", [
    { value: "odevzdám ho tak, jak je", why: "Učitel by se v něm těžko vyznal." },
    { value: "přetřu škrty barvou", why: "Barevné skvrny stránku nezlepší." },
    { value: "vytrhnu škrtnutá místa", why: "Stránka by byla děravá." },
  ], { hints: ["Může učitel dobře číst text plný škrtů?", "Škrtaný koncept je pracovní verze; odevzdává se čistopis."], explanation: "Koncept úhledně přepíšeme načisto." }),
  choice("Ve slohu máš úvod, hlavní část a závěr. Jak je na stránce oddělíš?", "každou část začnu novým odstavcem", [
    { value: "každou napíšu jinou barvou", why: "Barvy se ve slohu nepoužívají." },
    { value: "mezi ně nakreslím obrázek", why: "Obrázky sloh nečlení." },
    { value: "napíšu je do jedné dlouhé řádky", why: "Části by splynuly." },
  ], { hints: ["Jak čtenář pozná, kde končí úvod?", "Každý díl slohu začíná na novém řádku s odsazením."], explanation: "Úvod, hlavní část a závěr začínáme vždy novým odstavcem." }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3);
}

export const UHLEDNEPISANI: TopicMetadata[] = [
  {
    id: "g3-cjl-uhledne-psani",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-psani-uhledne-a-citelne-psani-uprava-textu",
    title: "Úhledné a čitelné psaní, úprava textu",
    studentTitle: "Píšu přehledně",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Psaní",
    briefDescription: "Naučíš se psát čitelně a správně upravovat text.",
    keywords: ["čitelné psaní", "úprava textu", "okraje", "odstavce", "nadpis", "rukopis"],
    goals: ["Psát čitelně s dodržením mezer a okrajů.", "Správně dělit text na odstavce.", "Opravit chybu v textu přehledně."],
    boundaries: ["Základní pravidla úpravy textu."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Čitelný text: mezery mezi slovy, přímé řádky, okraje na stránce, odstavce pro nové myšlenky.",
      steps: ["Piš pomalu a zřetelně.", "Nechej okraje.", "Každou novou myšlenku začni na novém řádku (odstavec).", "Po dokončení zkontroluj čitelnost."],
      commonMistake: "Slova bez mezer: 'Jdudoskoly.' → správně: 'Jdu do školy.'",
      example: "Správná úprava: nadpis uprostřed, odstavce odsazené, věty s tečkami, okraje.",
    },
  },
];
