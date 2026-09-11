import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Generátor vracel na všech úrovních
// tentýž seznam se stejnou nápovědou. Teď tři oddělené banky:
// L1 co je reprodukce a jak se dělá · L2 krátký text: nejlepší převyprávění,
// hlavní téma, postavy, konec · L3 pořadí událostí, co vynechat, co chybí,
// říct totéž vlastními slovy, příčina a ponaučení.

const L1: PracticeTask[] = [
  choice("Co je reprodukce textu?", "převyprávění obsahu vlastními slovy", [
    { value: "doslovné opsání celého textu", why: "Opis není převyprávění." },
    { value: "překlad do jiného jazyka", why: "To je překlad." },
    { value: "nakreslení obrázku k textu", why: "To je ilustrace." },
  ], { hints: ["Když kamarádovi vyprávíš film, který jsi viděl, opakuješ každou větu?", "Reprodukce znamená říct, o čem text byl, a použít k tomu svoje formulace."], explanation: "Reprodukce je převyprávění obsahu vlastními slovy." }),
  choice("Čím začneme reprodukci?", "řekneme, o čem text je a kdo v něm vystupuje", [
    { value: "přečteme doslova první větu", why: "Doslovné čtení není převyprávění." },
    { value: "začneme od konce příběhu", why: "Pořadí má zůstat zachované." },
    { value: "napíšeme dnešní datum", why: "Datum s obsahem nesouvisí." },
  ], { hints: ["Co potřebuje posluchač vědět hned na začátku?", "Nejdřív téma a postavy, potom děj po částech."], explanation: "Nejdřív řekneme téma a představíme postavy." }),
  choice("Co musíme při reprodukci zachovat?", "hlavní myšlenku a pořadí událostí", [
    { value: "každé slovo originálu", why: "Slova můžeme změnit, obsah ne." },
    { value: "jen samotný závěr", why: "Závěr nestačí." },
    { value: "jen jména postav", why: "Jména nestačí." },
  ], { hints: ["Co by se stalo, kdybys prohodil začátek a konec?", "Posluchač musí pochopit, o co šlo, a děj musí jít ve správném sledu."], explanation: "Zachováme hlavní myšlenku a pořadí událostí." }),
  choice("Co při reprodukci zachovat nemusíme?", "přesná slova a věty originálu", [
    { value: "hlavní postavy", why: "Bez postav by příběh nedával smysl." },
    { value: "hlavní myšlenku", why: "Ta je nejdůležitější." },
    { value: "pořadí událostí", why: "Pořadí musí zůstat." },
  ], { hints: ["Musíš si pamatovat text nazpaměť?", "Důležitý je obsah — jak to autor formuloval, můžeš říct po svém."], explanation: "Přesná slova originálu zachovat nemusíme." }),
  choice("Proč je reprodukce užitečná?", "ukáže, že jsme textu opravdu porozuměli", [
    { value: "naučíme se tak text nazpaměť", why: "Nazpaměť se učí básně, ne převyprávění." },
    { value: "opisování je rychlejší", why: "Reprodukce není opisování." },
    { value: "učí nás jen pravopis", why: "Jde o porozumění." },
  ], { hints: ["Dokážeš vyprávět něco, čemu nerozumíš?", "Kdo umí příběh převyprávět po svém, musel ho pochopit."], explanation: "Reprodukce ukáže, že jsme textu porozuměli." }),
  choice("Jak zjistíme hlavní myšlenku textu?", "zeptáme se, co je v textu nejdůležitější", [
    { value: "přečteme jen první větu", why: "První věta nemusí říct to hlavní." },
    { value: "spočítáme všechna slova", why: "Počet slov nic neřekne." },
    { value: "najdeme nejdelší slovo", why: "Délka slova nic neřekne." },
  ], { hints: ["Kdybys měl celý příběh shrnout jednou větou, co by v ní bylo?", "Hlavní myšlenka je to, bez čeho by příběh nedával smysl."], explanation: "Hlavní myšlenku najdeme otázkou: Co je nejdůležitější?" }),
  choice("Které otázky pomáhají při převyprávění?", "Kdo? Co se stalo? Kde? Kdy? Jak to dopadlo?", [
    { value: "Kolik má text slov?", why: "Počet slov obsah neřekne." },
    { value: "Jakým písmem je psaný?", why: "Písmo s obsahem nesouvisí." },
    { value: "Kolik stránek má celá kniha?", why: "Počet stran obsah neřekne." },
  ], { hints: ["Na co se ptá novinář, když píše zprávu?", "Ptej se na postavy, děj, místo, čas a konec."], explanation: "Kdo, co, kde, kdy a jak to dopadlo — to je kostra převyprávění." }),
  choice("Jaký je rozdíl mezi reprodukcí a opisem?", "reprodukce je vlastními slovy, opis doslova", [
    { value: "žádný, jsou to stejné věci", why: "Liší se — jedno je po svém, druhé přesně." },
    { value: "opis je vždy mnohem kratší", why: "Délka o tom nerozhoduje." },
    { value: "reprodukce se dělá vždy doslova", why: "Doslova se dělá opis." },
  ], { hints: ["Když přepisuješ z tabule, měníš slova?", "Kopie z tabule je přesná, převyprávění říká totéž po svém."], explanation: "Reprodukce je vlastními slovy, opis doslova." }),
  choice("Jak dlouhé má být převyprávění?", "kratší než původní text", [
    { value: "delší než originál", why: "Převyprávění nepřidává." },
    { value: "přesně stejně dlouhé", why: "Pak by to byl skoro opis." },
    { value: "jen jedno slovo", why: "Jedno slovo děj nevypráví." },
  ], { hints: ["Musíš převyprávět každou drobnost?", "Vynecháme detaily a necháme jen to hlavní."], explanation: "Převyprávění je kratší — obsahuje jen to hlavní." }),
  choice("Co můžeme při převyprávění vynechat?", "nepodstatné drobnosti", [
    { value: "hlavní postavu", why: "Bez ní příběh nedává smysl." },
    { value: "konec příběhu", why: "Konec je důležitý." },
    { value: "hlavní problém", why: "Bez něj by nebyl děj." },
  ], { hints: ["Změní se příběh, když vynecháš barvu čepice hrdiny?", "Detaily, na kterých děj nestojí, nejsou potřeba."], explanation: "Vynecháme nepodstatné drobnosti." }),
  choice("V jakém čase obvykle převyprávíme příběh?", "v minulém", [
    { value: "v budoucím", why: "Příběh se už stal." },
    { value: "v žádném", why: "Slovesa mají vždy čas." },
    { value: "v každé větě jiném", why: "Střídání časů mate." },
  ], { hints: ["Vyprávíš, co se stalo, nebo co se stane?", "Převyprávěný příběh už proběhl: šel, našel, vrátil se."], explanation: "Příběh obvykle převyprávíme v minulém čase." }),
  choice("Nevzpomeneš si na přesné slovo z textu. Co uděláš?", "řeknu to jinými slovy", [
    { value: "přestanu vyprávět", why: "Nemusíš — stačí to říct jinak." },
    { value: "vymyslím něco, co v textu nebylo", why: "Převyprávění nesmí měnit obsah." },
    { value: "začnu znovu od začátku", why: "Nepomůže to." },
  ], { hints: ["Musíš použít stejná slova jako autor?", "Důležité je, aby smysl zůstal stejný."], explanation: "Stačí to říct jinými slovy — smysl zůstane stejný." }),
  choice("Smíš do převyprávění přidat, co v textu nebylo?", "ne, drží se toho, co text říká", [
    { value: "ano, čím víc vymyslím, tím lépe", why: "Pak by to byl jiný příběh." },
    { value: "ano, hlavně jiný konec", why: "Změna konce není převyprávění." },
    { value: "ano, klidně nové postavy", why: "Nové postavy příběh změní." },
  ], { hints: ["Kdyby kamarád převyprávěl film a přidal scény, které tam nebyly, byl by to ten film?", "Převyprávění musí věrně odpovídat předloze."], explanation: "Převyprávění se drží toho, co v textu opravdu je." }),
];

const L2: PracticeTask[] = [
  choice("Text: „Kotě Micka vylezlo na vysokou jabloň. Nemohlo slézt a mňoukalo. Tatínek přinesl žebřík a kotě snesl dolů.“ Které převyprávění je nejlepší?", "Kotě uvízlo na stromě a tatínek ho snesl po žebříku.", [
    { value: "Tatínek má doma dlouhý hliníkový žebřík.", why: "To v textu není a není to hlavní." },
    { value: "Kotě spadlo do studny a hasiči ho vytáhli.", why: "To se v textu nestalo." },
    { value: "Micka je kotě, které má ráda mléko a spí.", why: "O tom text není." },
  ], { hints: ["Co se kotěti stalo a kdo mu pomohl?", "Dobré převyprávění řekne problém i řešení, a to vlastními slovy."], explanation: "Kotě uvízlo na stromě a tatínek ho zachránil — to je celý děj." }),
  choice("Text: „Honza zapomněl doma svačinu. O přestávce měl hlad. Kamarád Petr se s ním rozdělil o rohlík.“ O čem text hlavně je?", "o kamarádovi, který se rozdělil o svačinu", [
    { value: "o tom, jak se peče rohlík", why: "O pečení text není." },
    { value: "o Honzově cestě do školy", why: "O cestě text nemluví." },
    { value: "o zvonění na přestávku", why: "Zvonění není hlavní." },
  ], { hints: ["Kdo Honzovi pomohl a jak?", "Hlavní je to, co se v textu stane důležitého — ne drobnosti."], explanation: "Text je o kamarádovi, který se rozdělil o jídlo." }),
  choice("Text: „Lucka se učila jezdit na kole. Několikrát spadla, ale nevzdala se. Za týden už jezdila sama.“ Které převyprávění je nejlepší?", "Lucka se nevzdala a naučila se jezdit na kole.", [
    { value: "Lucka má červené kolo se zvonkem.", why: "Barva kola v textu není." },
    { value: "Lucka spadla z kola a už nikdy nejezdila.", why: "To je opak toho, co se stalo." },
    { value: "Lucka se učila jezdit. Několikrát spadla.", why: "Chybí, jak to dopadlo." },
  ], { hints: ["Jak to s Luckou dopadlo?", "Převyprávění musí obsahovat začátek i konec — nejen pády."], explanation: "Lucka vytrvala a naučila se jezdit." }),
  choice("Text: „V lese se ztratil malý ježek. Hledal cestu domů. Nakonec ho našla jeho maminka a odvedla ho domů.“ Jak příběh dopadl?", "maminka ježka našla a vzala ho s sebou", [
    { value: "ježek zůstal v lese sám", why: "Maminka ho našla." },
    { value: "ježka našel myslivec", why: "Našla ho maminka." },
    { value: "ježek si postavil nový domek", why: "To se nestalo." },
  ], { hints: ["Co se stalo v poslední větě?", "Konec příběhu najdeš za slovem Nakonec."], explanation: "Maminka ježka našla a odvedla domů." }),
  choice("Text: „Babička pekla buchty. Vnučka Anička jí pomáhala plnit je povidly. Pak si spolu sedly a buchty snědly s mlékem.“ Kdo jsou hlavní postavy?", "babička a vnučka", [
    { value: "maminka a Anička", why: "Maminka v textu není." },
    { value: "babička a dědeček", why: "Dědeček v textu není." },
    { value: "Anička a kamarádka", why: "Kamarádka v textu není." },
  ], { hints: ["Kdo v textu pekl a kdo pomáhal?", "Hlavní postavy jsou ty, které v příběhu jednají."], explanation: "Hlavní postavy jsou babička a její vnučka Anička." }),
  choice("Text: „Tomáš našel na ulici peněženku. Odnesl ji na policii. Majitelka mu pak přinesla čokoládu jako poděkování.“ Které převyprávění je nejlepší?", "Tomáš vrátil nalezenou peněženku a majitelka mu poděkovala.", [
    { value: "Tomáš si za nalezené peníze koupil čokoládu.", why: "Čokoládu dostal jako poděkování." },
    { value: "Lidé na ulici často ztrácejí různé věci.", why: "O tom text není." },
    { value: "Tomáš našel na ulici peněženku.", why: "Chybí, co s ní udělal a jak to dopadlo." },
  ], { hints: ["Co Tomáš s peněženkou udělal a jak to skončilo?", "Dobré převyprávění zachytí celý děj, ne jen začátek."], explanation: "Tomáš peněženku vrátil a majitelka mu poděkovala." }),
  choice("Text: „Na jaře si Eva zasadila na zahrádce semínka mrkve. Každý den je zalévala. V létě sklidila velké oranžové mrkve.“ O čem text hlavně je?", "o tom, jak Eva vypěstovala mrkev", [
    { value: "o tom, jak se vaří mrkvová polévka", why: "O vaření text není." },
    { value: "o Evině cestě na prázdniny", why: "O cestě text není." },
    { value: "o barvách různé zeleniny", why: "Barva mrkve není hlavní." },
  ], { hints: ["Co Eva celou dobu dělala?", "Hlavní téma spojuje začátek i konec textu."], explanation: "Text je o tom, jak Eva pěstovala mrkev." }),
  choice("Text: „Pes Bobík hlídal dům. V noci uslyšel zloděje a začal štěkat. Zloděj utekl a rodina byla ráda, že Bobíka má.“ Které převyprávění je nejlepší?", "Bobík štěkotem zahnal zloděje a ochránil dům.", [
    { value: "Bobík je pes, který rád spí a jí granule.", why: "O tom text není." },
    { value: "Zloděj ukradl rodině auto a utekl.", why: "Zloděj nic neukradl." },
    { value: "Pes Bobík hlídal dům.", why: "Chybí, co se stalo." },
  ], { hints: ["Co Bobík v noci udělal a jak to dopadlo?", "Převyprávění má obsahovat problém i jeho vyřešení."], explanation: "Bobík zahnal zloděje — to je hlavní děj." }),
  choice("Text: „Ve škole byl karneval. Děti přišly v maskách. Nejlepší masku měl Jirka, který byl převlečený za draka.“ Které převyprávění je nejlepší?", "Na školním karnevalu vyhrál Jirka s maskou draka.", [
    { value: "Děti chodí do školy každý den.", why: "O tom text není." },
    { value: "Jirka byl na karnevalu převlečený za princeznu.", why: "Jirka byl drak." },
    { value: "Ve škole byl karneval.", why: "Chybí to hlavní — kdo měl nejlepší masku." },
  ], { hints: ["Co je v textu nejzajímavější?", "Převyprávění spojí místo, událost i hlavní postavu."], explanation: "Nejlepší převyprávění zmíní karneval i Jirkovu masku draka." }),
  choice("Text: „Ráno pršelo, a tak Pavel vzal deštník. Odpoledne vysvitlo slunce a Pavel deštník zapomněl ve škole.“ O čem text hlavně je?", "jak Pavel kvůli slunci přišel domů bez deštníku", [
    { value: "jak se vyrábí deštník", why: "O výrobě text není." },
    { value: "o počasí v zimě", why: "Roční období text neuvádí." },
    { value: "o Pavlově oblíbeném předmětu", why: "O předmětech text není." },
  ], { hints: ["Co se Pavlovi odpoledne stalo?", "Hlavní téma je to, co spojuje ranní a odpolední část textu."], explanation: "Text je o tom, jak Pavel zapomněl deštník, když vysvitlo slunce." }),
  choice("Text: „Sova v noci loví myši. Ve dne spí v dutině stromu. Umí otočit hlavu skoro dozadu.“ Co je hlavní téma textu?", "život sovy", [
    { value: "stromy v lese", why: "Strom je jen místo, kde sova spí." },
    { value: "noční obloha", why: "O obloze text není." },
    { value: "život myší", why: "Myši jsou jen potrava sovy." },
  ], { hints: ["O kom jsou všechny tři věty?", "Hlavní téma je to, o čem mluví celý text, ne jen jedna věta."], explanation: "Všechny věty jsou o sově — hlavní téma je život sovy." }),
  choice("Text: „Kamila měla strach z vody. Chodila s tátou na plavání každou sobotu. V létě už přeplavala celý bazén.“ Které převyprávění je nejlepší?", "Kamila překonala strach z vody a naučila se plavat.", [
    { value: "Kamila chodí každou sobotu nakupovat s tátou.", why: "Chodili plavat, ne nakupovat." },
    { value: "Kamila se bojí vody, a proto nikdy neplave.", why: "Nakonec plavat začala." },
    { value: "Kamilin táta pracuje jako trenér plavání.", why: "To v textu není." },
  ], { hints: ["Jak se Kamila změnila od začátku do konce?", "Převyprávění zachytí, jak se hrdinka proměnila."], explanation: "Kamila překonala strach a naučila se plavat." }),
  choice("Text: „Vrána našla ořech, ale nemohla ho rozlousknout. Pustila ho z výšky na silnici. Ořech praskl a vrána si pochutnala.“ Jak vrána problém vyřešila?", "nechala ořech spadnout z velké výšky", [
    { value: "rozlouskla ho zobákem", why: "To nedokázala." },
    { value: "dala ho veverce", why: "Snědla ho sama." },
    { value: "zakopala ho do země", why: "To v textu není." },
  ], { hints: ["Co vrána s ořechem udělala?", "Řešení problému je ve druhé větě."], explanation: "Vrána ořech pustila z výšky, aby praskl." }),
];

const L3: PracticeTask[] = [
  choice("Text: „Martin šel do obchodu pro chleba. Cestou potkal kamaráda a zapovídal se. Když přišel do obchodu, chleba už byl vyprodaný. Domů přinesl rohlíky.“ Které převyprávění má správné pořadí?", "Martin se zapovídal s kamarádem, chleba mezitím vyprodali, a tak koupil rohlíky.", [
    { value: "Martin koupil rohlíky, pak potkal kamaráda a nakonec šel pro chleba.", why: "Pořadí je obrácené." },
    { value: "Martin šel pro chleba, koupil ho a pak potkal kamaráda.", why: "Chleba nekoupil — byl vyprodaný." },
    { value: "Martin potkal kamaráda a šli spolu hrát fotbal.", why: "To se v textu nestalo." },
  ], { hints: ["Co se stalo dřív — setkání s kamarádem, nebo nákup?", "Zkontroluj pořadí událostí i to, jestli každá z nich opravdu v textu je."], explanation: "Martin se zdržel s kamarádem, chleba mezitím došel, a tak koupil rohlíky." }),
  choice("Text: „Kája chtěla psa. Rodiče řekli, že nejdřív musí ukázat, že se o zvíře umí starat. Kája se měsíc starala o sousedovo morče. Pak dostala štěně.“ Která věta do převyprávění nepatří?", "Kája má ráda jahodovou zmrzlinu.", [
    { value: "Kája chtěla psa.", why: "To je začátek příběhu — patří tam." },
    { value: "Kája se měsíc starala o sousedovo morče.", why: "To je důležitá část děje." },
    { value: "Nakonec dostala štěně.", why: "To je konec příběhu — patří tam." },
  ], { hints: ["Která věta v textu vůbec nebyla?", "Převyprávění nesmí přidávat nic, co v textu není."], explanation: "O zmrzlině text nic neříká — do převyprávění nepatří." }),
  choice("Text: „Ve třídě se rozbilo okno. Paní učitelka se ptala, kdo to udělal. Ondra se přiznal, že kopl míč. Paní učitelka ho pochválila, že řekl pravdu.“ Jaké ponaučení text má?", "vyplatí se být upřímný", [
    { value: "okna jsou velmi křehká", why: "To není ponaučení příběhu." },
    { value: "učitelky se často zlobí", why: "Učitelka Ondru pochválila." },
    { value: "míč patří jen do tělocvičny", why: "O tom text nemluví." },
  ], { hints: ["Za co paní učitelka Ondru pochválila?", "Ponaučení vyplývá z konce příběhu — co se hrdinovi vyplatilo."], explanation: "Ondra se přiznal a byl pochválen — vyplatí se být upřímný." }),
  choice("Text: „Bylo jednou malé kuře, které se chodilo koupat do potoka. Jednou ho proud odnesl. Zachránila ho kachna, která ho vzala na záda.“ Převyprávění: „Bylo jednou kuře. Nakonec ho kachna vzala na záda.“ Co v převyprávění chybí?", "že kuře odnesl proud", [
    { value: "jak se kuře jmenovalo", why: "Jméno v textu není." },
    { value: "jakou barvu měla kachna", why: "Barva v textu není." },
    { value: "nic, je úplné", why: "Chybí, proč kachna kuře zachraňovala." },
  ], { hints: ["Proč kachna kuře vzala na záda?", "Bez problému v prostředku příběhu nedává konec smysl."], explanation: "Chybí zápletka — že kuře odnesl proud." }),
  choice("Text: „Anna zasadila fazoli do květináče. Za pár dní vyrostl malý klíček. Anna ho každý den zalévala. Na konci měsíce měla fazole první lusky.“ Které převyprávění má správné pořadí?", "Anna zasadila fazoli, zalévala klíček a nakonec měla lusky.", [
    { value: "Anna měla lusky, zasadila fazoli a zalévala ji.", why: "Lusky byly až na konci." },
    { value: "Anna zalévala lusky a pak zasadila klíček.", why: "Pořadí i děj nesouhlasí." },
    { value: "Anna koupila fazole v obchodě a uvařila je.", why: "To se v textu nestalo." },
  ], { hints: ["Co bylo první a co poslední?", "Seřaď kroky tak, jak šly v čase: zasadit — růst — zalévat — lusky."], explanation: "Správně: zasadila, zalévala, nakonec lusky." }),
  choice("Text: „Déšť nepřestával padat celý den.“ Která věta říká totéž vlastními slovy?", "Celý den pršelo.", [
    { value: "Déšť nepřestával padat.", why: "To je jen opis části věty." },
    { value: "Celý den svítilo slunce.", why: "To je opak." },
    { value: "Pršelo jen chvilku.", why: "Pršelo celý den." },
  ], { hints: ["Jak bys to řekl kamarádovi jednodušeji?", "Vlastními slovy = stejný smysl, jiná slova."], explanation: "„Celý den pršelo.“ říká totéž jinými slovy." }),
  choice("Text: „Pes radostně vrtěl ocasem, když uviděl svého pána.“ Která věta říká totéž vlastními slovy?", "Pes měl radost, že vidí pána.", [
    { value: "Pes vrtěl ocasem.", why: "Chybí proč — radost z pána." },
    { value: "Pes se svého pána bál.", why: "To je opak." },
    { value: "Pán se na psa zlobil.", why: "O tom věta není." },
  ], { hints: ["Co pes cítil?", "Hledej větu, která zachová smysl, ale nepoužije stejná slova."], explanation: "„Pes měl radost, že vidí pána.“ vystihuje smysl." }),
  choice("Text: „Chlapec se celou noc nemohl dočkat rána, protože měl jet na výlet.“ Která věta říká totéž vlastními slovy?", "Chlapec se moc těšil na výlet.", [
    { value: "Chlapec v noci dobře spal.", why: "Nemohl se dočkat — asi nespal." },
    { value: "Chlapec nechtěl jet na výlet.", why: "Naopak se těšil." },
    { value: "Chlapec jel na výlet v noci.", why: "Výlet byl až ráno." },
  ], { hints: ["Proč se nemohl dočkat rána?", "„Nemoci se dočkat“ vyjadřuje velkou radost z toho, co přijde."], explanation: "Chlapec se velmi těšil na výlet." }),
  choice("Text: „Petr jel s tátou na ryby. Měli zelenou loďku a dva pruty. Petr chytil velkého kapra. Večer ho maminka upekla k večeři.“ Kterou informaci můžeš při stručném převyprávění vynechat?", "že loďka byla zelená", [
    { value: "že Petr chytil kapra", why: "To je hlavní událost." },
    { value: "že jel s tátou na ryby", why: "To je začátek příběhu." },
    { value: "že kapra maminka upekla", why: "To je konec příběhu." },
  ], { hints: ["Změní se příběh, když nebudeš vědět barvu lodi?", "Vynechat můžeš jen drobnost, na které děj nestojí."], explanation: "Barva loďky je nepodstatná drobnost." }),
  choice("Text: „Na dvoře žil kohout, který každé ráno kokrhal. Jednou zaspal a celá vesnice zaspala s ním.“ Které převyprávění je vlastními slovy?", "Když kohout jednou nevstal, zaspali i všichni ve vsi.", [
    { value: "Jednou zaspal a celá vesnice zaspala s ním.", why: "To je doslovný opis." },
    { value: "Na dvoře žil kohout, který každé ráno kokrhal.", why: "To je doslovný opis a chybí hlavní událost." },
    { value: "Kohout chodil spát pozdě do noci.", why: "To v textu není." },
  ], { hints: ["Která možnost neopakuje věty z textu slovo od slova?", "Převyprávění zachová smysl, ale použije jiná slova."], explanation: "Jen první možnost říká obsah vlastními slovy." }),
  choice("Text: „Zuzka dostala k narozeninám kolo. Hned chtěla jet ven, ale venku pršelo. Musela počkat až do dalšího dne.“ Která věta převypráví text nejlépe?", "Zuzka dostala kolo, ale kvůli dešti mohla jet až druhý den.", [
    { value: "Zuzka dostala k narozeninám kolo.", why: "Chybí, proč nemohla hned jet." },
    { value: "Zuzka jela v dešti na novém kole.", why: "Kvůli dešti nejela." },
    { value: "Zuzka měla narozeniny a dostala dort.", why: "O dortu text není." },
  ], { hints: ["Co Zuzce zabránilo v jízdě?", "Nejlepší převyprávění spojí dárek, překážku i to, jak to dopadlo."], explanation: "Zuzka musela kvůli dešti počkat do dalšího dne." }),
  choice("Text: „Honzík se bál tmy. Maminka mu koupila malou lampičku. Od té doby Honzík usínal klidně.“ Proč Honzík usínal klidně?", "protože mu v noci svítila lampička", [
    { value: "protože byl velmi unavený", why: "To v textu není." },
    { value: "protože mu maminka zpívala", why: "O zpěvu text není." },
    { value: "protože přestal chodit spát", why: "To nedává smysl." },
  ], { hints: ["Co se změnilo po nákupu?", "Hledej souvislost: čeho se Honzík bál a co mu pomohlo."], explanation: "Lampička zahnala tmu, a tak Honzík usínal klidně." }),
  choice("Text: „Sousedův pes Rex utekl ze zahrady. Děti ho hledaly celé odpoledne. Večer Rex přiběhl sám a byl celý od bláta.“ Které převyprávění je nejlepší?", "Rex utekl, děti ho marně hledaly a večer se vrátil sám.", [
    { value: "Děti si celé odpoledne hrály na zahradě.", why: "Děti psa hledaly." },
    { value: "Rex utekl a už se nikdy nevrátil.", why: "Rex se vrátil." },
    { value: "Rex byl celý od bláta.", why: "To je jen drobnost z konce." },
  ], { hints: ["Co se stalo na začátku, uprostřed a na konci?", "Převyprávění musí mít všechny tři části, detail o blátě není hlavní."], explanation: "Rex utekl, děti ho hledaly a on se večer vrátil sám." }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3);
}

export const REPRODUKCETEXTU: TopicMetadata[] = [
  {
    id: "g3-cjl-reprodukce-textu",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-cteni-reprodukce-precteneho-textu",
    title: "Reprodukce přečteného textu",
    studentTitle: "Převyprávím příběh",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení",
    briefDescription: "Naučíš se převyprávět přečtený příběh vlastními slovy.",
    keywords: ["reprodukce", "převyprávění", "vlastními slovy", "hlavní myšlenka", "pořadí"],
    goals: ["Porozumět textu a převyprávět ho.", "Zachovat hlavní myšlenku a pořadí událostí.", "Odlišit reprodukci od doslovného opisu."],
    boundaries: ["Krátké texty přiměřené 3. ročníku."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Reprodukce = vlastními slovy. Zachovej: kdo, co se stalo, jak to dopadlo. Nemusíš opakovat každé slovo.",
      steps: ["Přečti text.", "Zeptej se: Kdo? Co? Kde? Jak to dopadlo?", "Vlastními slovy povyprávěj hlavní body.", "Dodržuj pořadí."],
      commonMistake: "Opisování doslova — reprodukce = VLASTNÍMI slovy, ne kopírování.",
      example: "Text o kočičce → Reprodukce: 'V příběhu je kotě, které se ztratilo v lese. Hledalo cestu domů a nakonec ho našla jeho maminka.'",
    },
  },
];
