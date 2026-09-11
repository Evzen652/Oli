import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Generátor vracel na všech úrovních
// tentýž seznam se stejnou nápovědou. Teď tři oddělené banky:
// L1 co je popis a co do něj patří · L2 poznat větu z popisu, vybrat přesné
// přídavné jméno, vzhled × povaha, smysly · L3 stavba popisu (začátek,
// podrobnosti, závěr), věta, která do popisu nepatří, a poznat věc z popisu.

const L1: PracticeTask[] = [
  choice("Co je popis?", "text, který ukazuje vzhled a vlastnosti věci", [
    { value: "příběh o tom, co se stalo", why: "To je vypravování — v něm se něco děje." },
    { value: "návod, jak něco udělat", why: "Návod radí postup, popis ukazuje, jaká věc je." },
    { value: "dopis kamarádovi", why: "Dopis je zpráva pro někoho, ne popis věci." },
  ], { hints: ["Když něco popisuješ, vyprávíš děj, nebo říkáš, jak to vypadá?", "V popisu se nic neděje — čtenář si má věc představit: barvu, tvar, velikost, z čeho je."], explanation: "Popis ukazuje, jak věc, zvíře nebo osoba vypadá a jaké má vlastnosti." }),
  choice("Který slovní druh popis potřebuje nejvíc?", "přídavná jména", [
    { value: "citoslovce", why: "Citoslovce (haf, bum) vyjadřují zvuky a pocity, ne vlastnosti." },
    { value: "spojky", why: "Spojky jen spojují slova a věty." },
    { value: "předložky", why: "Předložky stojí před podstatnými jmény, vlastnosti neříkají." },
  ], { hints: ["Který druh slov odpovídá na otázku jaký?", "Slova jako červený, kulatý nebo měkký čtenáři řeknou, jaká věc je."], explanation: "Popis stojí na přídavných jménech — ta vyjadřují vlastnosti (jaký?)." }),
  choice("V jakém pořadí popisujeme předmět?", "od celku k podrobnostem", [
    { value: "od nejmenší drobnosti k celku", why: "Čtenář by nevěděl, k čemu drobnost patří." },
    { value: "náhodně, jak mě co napadne", why: "Neuspořádaný popis se špatně čte." },
    { value: "podle abecedy", why: "Abeceda s popisem věci nesouvisí." },
  ], { hints: ["Co čtenář potřebuje vědět nejdřív, aby si věc představil?", "Nejdřív řekneme, co to je a jak je to velké; teprve potom přidáváme drobné části."], explanation: "Popisujeme od celku k podrobnostem — nejdřív celá věc, pak její části." }),
  choice("Čím popis začneme?", "řekneme, co popisujeme", [
    { value: "napíšeme, co se stalo včera", why: "To by byl začátek vypravování." },
    { value: "vyjmenujeme drobné části", why: "Drobnosti přijdou až po celku." },
    { value: "napíšeme datum", why: "Datum patří do dopisu nebo omluvenky." },
  ], { hints: ["Co musí čtenář vědět hned v první větě?", "Aby čtenář tušil, o čem čte, věc hned na začátku pojmenujeme."], explanation: "Popis začneme tím, že pojmenujeme věc: Popíšu svůj penál." }),
  choice("Co popisujeme u zvířete?", "vzhled, velikost a chování", [
    { value: "jen jméno zvířete", why: "Ze jména si zvíře nikdo nepředstaví." },
    { value: "co zvíře včera provedlo", why: "To je děj — patří do vypravování." },
    { value: "kolik zvíře stálo", why: "Cena neřekne, jak zvíře vypadá." },
  ], { hints: ["Co všechno potřebuje čtenář vědět, aby si zvíře představil?", "Nejde o jedinou věc — co na zvířeti uvidíš, jak je veliké a co obvykle dělá."], explanation: "U zvířete popíšeme, jak vypadá, jak je velké a jak se chová." }),
  choice("Co popisujeme u osoby?", "vzhled a povahu", [
    { value: "jen jméno", why: "Jméno nic neřekne o tom, jaký člověk je." },
    { value: "jen věk", why: "Věk je jen jeden údaj." },
    { value: "co dělala o prázdninách", why: "To je děj — patří do vypravování." },
  ], { hints: ["Jaké dvě stránky člověka tě zajímají — to, co vidíš, a co ještě?", "U člověka popíšeme, jak vypadá (vlasy, oči, postava) a jaký je (veselý, pilný)."], explanation: "Popis osoby zachytí vzhled i povahu." }),
  choice("V jakém čase píšeme popis?", "v přítomném", [
    { value: "v minulém", why: "Minulý čas patří do vypravování o tom, co se stalo." },
    { value: "v budoucím", why: "Věc popisujeme takovou, jaká je teď." },
    { value: "střídavě ve všech", why: "Střídání časů by čtenáře mátlo." },
  ], { hints: ["Popisuješ věc takovou, jaká byla, nebo jaká je teď?", "Slovesa v popisu: je, má, vypadá — věc máme před sebou právě teď."], explanation: "Popis píšeme v přítomném čase: je, má, vypadá." }),
  choice("Které smysly můžeme v popisu použít?", "zrak, sluch, hmat, čich i chuť", [
    { value: "jen zrak", why: "Věc můžeme i ohmatat, přičichnout k ní nebo ji ochutnat." },
    { value: "jen zrak a sluch", why: "Zapomněl jsi na hmat, čich a chuť." },
    { value: "žádný", why: "Bez smyslů bychom věc nepoznali." },
  ], { hints: ["Poznáš jablko jen očima, nebo i jinak?", "Jablko je červené, voní, je šťavnaté a má hladkou slupku — každá vlastnost patří k jinému smyslu."], explanation: "Popis může zapojit všech pět smyslů." }),
  choice("Jaký má být dobrý popis?", "přesný a výstižný", [
    { value: "co nejdelší", why: "Délka sama nepomůže — záleží na přesnosti." },
    { value: "plný děje", why: "Děj patří do vypravování." },
    { value: "hlavně vtipný", why: "Vtip nepomůže čtenáři si věc představit." },
  ], { hints: ["Co potřebuje čtenář, aby si věc představil správně?", "Nejde o délku — každé slovo má říct něco pravdivého a důležitého o věci."], explanation: "Dobrý popis je přesný a výstižný." }),
  choice("Čím se popis liší od vypravování?", "popis ukazuje vzhled, vypravování děj", [
    { value: "nijak se neliší", why: "Liší se — jeden ukazuje vzhled, druhý děj." },
    { value: "popis je vždy delší", why: "O délce to nerozhoduje." },
    { value: "vypravování nemá postavy", why: "Vypravování postavy má." },
  ], { hints: ["Odpovídá popis na otázku Co se stalo?, nebo Jaké to je?", "Ve vypravování se něco přihodí; v popisu si věc jen prohlížíme."], explanation: "Popis ukazuje, jak věc vypadá; vypravování vypráví, co se stalo." }),
  choice("Co se hodí na konec popisu předmětu?", "k čemu věc slouží a co se nám na ní líbí", [
    { value: "nová zápletka s napětím", why: "Zápletka patří do vypravování." },
    { value: "datum, kdy jsme popis psali", why: "Datum do popisu nepatří." },
    { value: "pozdrav a podpis autora", why: "Pozdrav a podpis patří do dopisu." },
  ], { hints: ["Co je dobré o věci říct na konci, když už víme, jak vypadá?", "Závěr popisu prozradí užitek věci či tvůj vztah k ní."], explanation: "Na konci popisu řekneme, k čemu věc slouží a co se nám na ní líbí." }),
  choice("Proč v popisu používáme přesná přídavná jména?", "aby si čtenář věc dobře představil", [
    { value: "aby byl text delší", why: "O délku nejde." },
    { value: "protože se to musí", why: "Přesná slova mají smysl — pomáhají čtenáři." },
    { value: "aby se text rýmoval", why: "Popis není báseň." },
  ], { hints: ["Co čtenáři řekne víc: pěkný míč, nebo červený gumový míč?", "Konkrétní vlastnost (barva, materiál, tvar) vykreslí věc čtenáři před očima."], explanation: "Přesná přídavná jména pomáhají čtenáři, aby si věc představil." }),
  choice("Kdy se v životě hodí umět popisovat?", "když hledáme ztracenou věc nebo zvíře", [
    { value: "když píšeme pozvánku na oslavu", why: "Pozvánka říká co, kdy a kde — ne jak něco vypadá." },
    { value: "když píšeme omluvenku", why: "Omluvenka vysvětluje, proč žák chyběl." },
    { value: "když přejeme k narozeninám", why: "Přání nic nepopisuje." },
  ], { hints: ["Kdy potřebují ostatní vědět, jak něco přesně vypadá?", "Když něco hledáme, musí si to ostatní umět představit, aby to poznali."], explanation: "Popis se hodí třeba v oznámení o ztraceném psovi — podle něj ho lidé poznají." }),
];

const L2: PracticeTask[] = [
  choice("Která věta patří do popisu psa?", "Pes má krátkou hnědou srst.", [
    { value: "Pes mi včera utekl na zahradu.", why: "To je děj — co se stalo, ne jak pes vypadá." },
    { value: "Psa jsme dostali loni.", why: "To je příběh o psovi, ne jeho popis." },
    { value: "Na procházce jsme potkali souseda.", why: "Tahle věta o psovi vůbec nic neříká." },
  ], { hints: ["Která věta ti pomůže psa vidět před sebou?", "Věta z popisu říká, jaký pes je; ostatní věty vyprávějí, co se stalo."], explanation: "Do popisu patří věta o vzhledu: Pes má krátkou hnědou srst." }),
  choice("Která věta do popisu kočky nepatří?", "Kočka včera shodila hrnek.", [
    { value: "Kočka má bílé tlapky.", why: "To je vzhled — do popisu patří." },
    { value: "Kočka má zelené oči.", why: "To je vzhled — do popisu patří." },
    { value: "Kočka je malá a hebká.", why: "To jsou vlastnosti — do popisu patří." },
  ], { hints: ["Která věta vypráví, co kočka provedla?", "Popis ukazuje, jaká kočka je. Věta o tom, co se včera stalo, je děj."], explanation: "Věta „Kočka včera shodila hrnek.“ vypráví děj, do popisu nepatří." }),
  choice("Která věta patří do popisu jablka?", "Jablko má hladkou červenou slupku.", [
    { value: "Jablko jsem snědl po obědě.", why: "To je děj." },
    { value: "Babička jablka česala na zahradě.", why: "To je děj o babičce." },
    { value: "Jablko spadlo ze stromu.", why: "To je děj — co se stalo." },
  ], { hints: ["Ve které větě se nic neděje, jen se dozvíš, jaké jablko je?", "Hledej vlastnosti (barva, povrch), ne to, co kdo s jablkem udělal."], explanation: "Do popisu patří: Jablko má hladkou červenou slupku." }),
  choice("Která věta patří do popisu penálu?", "Penál je modrý a má dvě přihrádky.", [
    { value: "Penál mi ráno spadl pod lavici.", why: "To je děj." },
    { value: "Penál jsem si koupil v papírnictví.", why: "To je děj — kde a kdy jsem ho koupil." },
    { value: "Zítra si do penálu dám nové pastelky.", why: "To je plán, ne popis." },
  ], { hints: ["Která věta ti řekne, jak penál vypadá?", "Popis zachytí barvu, tvar a části; věci, které se staly nebo stanou, do něj nepatří."], explanation: "Do popisu patří: Penál je modrý a má dvě přihrádky." }),
  choice("Která věta do popisu babičky nepatří?", "Babička včera upekla bábovku.", [
    { value: "Babička má šedé vlasy a brýle.", why: "To je vzhled — do popisu patří." },
    { value: "Babička je laskavá a trpělivá.", why: "To je povaha — do popisu patří." },
    { value: "Babička je malá a štíhlá.", why: "To je postava — do popisu patří." },
  ], { hints: ["Která věta vypráví, co babička dělala?", "Do popisu osoby patří vzhled a povaha; to, co se včera stalo, je děj."], explanation: "Věta o pečení bábovky vypráví děj, do popisu nepatří." }),
  choice("Které přídavné jméno nejlépe popíše čerstvý sníh?", "bílý", [
    { value: "zelený", why: "Sníh zelený není." },
    { value: "horký", why: "Sníh je studený." },
    { value: "hranatý", why: "Sníh nemá hrany." },
  ], { hints: ["Jakou barvu má sníh, když právě napadne?", "Vyber vlastnost, která ke sněhu opravdu patří; ostatní by sněhu neseděly."], explanation: "Čerstvý sníh je bílý." }),
  choice("Které přídavné jméno nejlépe popíše kaktus?", "pichlavý", [
    { value: "hebký", why: "Hebký je třeba kožíšek, kaktus píchá." },
    { value: "tekutý", why: "Kaktus je rostlina, ne tekutina." },
    { value: "průhledný", why: "Kaktus není průhledný." },
  ], { hints: ["Co ucítíš, když se kaktusu dotkneš?", "Kaktus má ostny — hledej vlastnost, kterou poznáš hmatem."], explanation: "Kaktus je pichlavý." }),
  choice("Kterým slovem popíšeš polštář přesněji než slovem „pěkný“?", "měkký", [
    { value: "hezký", why: "Hezký je stejně neurčitý jako pěkný." },
    { value: "dobrý", why: "Dobrý neřekne, jaký polštář je na dotek." },
    { value: "super", why: "Super je hovorové a nic konkrétního neříká." },
  ], { hints: ["Které slovo řekne o polštáři něco, co opravdu ucítíš?", "Pěkný, hezký, dobrý — to jsou jen pocity. Přesné slovo pojmenuje skutečnou vlastnost."], explanation: "„Měkký“ je přesná vlastnost polštáře; pěkný, hezký nebo super nic konkrétního neřeknou." }),
  choice("Který popis psa je nejlepší?", "Pes je velký, má černou srst a dlouhé uši.", [
    { value: "Pes je hezký.", why: "Z toho si psa nikdo nepředstaví." },
    { value: "Pes je prostě pes.", why: "To nic neříká." },
    { value: "Pes je hodně moc pěkný.", why: "Pořád nevíme, jak vypadá." },
  ], { hints: ["Ze které věty by sis psa dokázal nakreslit?", "Dobrý popis obsahuje konkrétní vlastnosti — velikost, barvu, části těla."], explanation: "Nejlepší je popis s konkrétními vlastnostmi: velký, černá srst, dlouhé uši." }),
  choice("Která věta popisuje povahu?", "Tomáš je veselý a ochotný.", [
    { value: "Tomáš má hnědé vlasy.", why: "Vlasy jsou vzhled." },
    { value: "Tomáš je vysoký.", why: "Výška je vzhled." },
    { value: "Tomáš má modrou bundu.", why: "Bunda je oblečení." },
  ], { hints: ["Která věta mluví o tom, jaký Tomáš je uvnitř?", "Povaha je to, jak se člověk chová k ostatním; na fotce ji neuvidíš."], explanation: "Veselý a ochotný — to je povaha." }),
  choice("Která věta popisuje vzhled?", "Lucie má dlouhé světlé vlasy.", [
    { value: "Lucie je zvídavá.", why: "Zvídavost je povaha." },
    { value: "Lucie je trpělivá.", why: "Trpělivost je povaha." },
    { value: "Lucie ráda pomáhá.", why: "To je povaha." },
  ], { hints: ["Co by sis mohl všimnout na fotce?", "Vzhled je to, co vidíme očima: postava, vlasy, oči, oblečení."], explanation: "Dlouhé světlé vlasy jsou vzhled." }),
  choice("Který smysl používáš ve větě „Chleba voní po kmínu.“?", "čich", [
    { value: "zrak", why: "Vůni očima nevidíš." },
    { value: "sluch", why: "Vůni neuslyšíš." },
    { value: "hmat", why: "Vůni se nedotkneš." },
  ], { hints: ["Čím poznáš, že něco voní?", "Vůni a zápach vnímáme nosem."], explanation: "Vůni vnímáme čichem." }),
  choice("Který smysl používáš ve větě „Kůra stromu je drsná.“?", "hmat", [
    { value: "čich", why: "Drsnost nosem nepoznáš." },
    { value: "sluch", why: "Drsnost neuslyšíš." },
    { value: "chuť", why: "Kůru neochutnáváme." },
  ], { hints: ["Jak poznáš, že je něco drsné?", "Drsné, hladké, měkké — to poznáme, když na věc sáhneme."], explanation: "Drsnost poznáme hmatem." }),
];

const L3: PracticeTask[] = [
  choice("Popisuješ hrnek. Která věta patří na začátek?", "Na stole stojí bílý hrnek s uchem.", [
    { value: "Na uchu je malá oprýskaná tečka.", why: "To je drobnost — přijde až po celku." },
    { value: "Z hrnku rád piju kakao.", why: "K čemu věc slouží, patří spíš na konec." },
    { value: "Hrnek mi včera spadl.", why: "To je děj, do popisu nepatří." },
  ], { hints: ["Co má čtenář vědět jako první?", "Nejdřív celek — co to je a jak celkově vypadá; drobnosti a užitek přijdou později."], explanation: "Na začátek patří celek: Na stole stojí bílý hrnek s uchem." }),
  choice("Popisuješ batoh. Která věta se hodí na konec?", "Batoh nosím do školy a mám ho rád.", [
    { value: "Batoh je zelený a dost velký.", why: "To je celek — patří na začátek." },
    { value: "Na boku má síťovou kapsu.", why: "To je podrobnost — patří doprostřed." },
    { value: "Batoh je z pevné látky.", why: "To je vlastnost — patří doprostřed." },
  ], { hints: ["Co se říká na závěr, když už víme, jak věc vypadá?", "Závěr popisu prozradí užitek věci či tvůj vztah k ní."], explanation: "Na konec patří, k čemu batoh slouží a co si o něm myslíme." }),
  choice("Popis kola: 1. Moje kolo je modré a lehké. 3. Nejraději na něm jezdím k babičce. Která věta patří doprostřed?", "Má černé pneumatiky a zvonek na řídítkách.", [
    { value: "Včera jsem na něm spadl.", why: "To je děj." },
    { value: "Kolo jsem dostal k narozeninám.", why: "To je děj, ne popis." },
    { value: "Zítra ho umyju.", why: "To je plán, ne popis." },
  ], { hints: ["Co následuje po celku a před závěrem?", "Uprostřed popisu jsou podrobnosti — jednotlivé části věci."], explanation: "Doprostřed patří podrobnosti: pneumatiky a zvonek." }),
  choice("Který popis postupuje od celku k podrobnostem?", "Strom je vysoký. Má hustou korunu. Na větvích visí jablka.", [
    { value: "Na větvích visí jablka. Má hustou korunu. Strom je vysoký.", why: "Tady je pořadí obrácené — od drobností k celku." },
    { value: "Má hustou korunu. Na větvích visí jablka. Strom je vysoký.", why: "Celek (vysoký strom) je až na konci." },
    { value: "Jablka jsou sladká. Včera jsme strom zalévali. Strom je vysoký.", why: "Je tu děj a celek je až na konci." },
  ], { hints: ["Která ukázka začíná celým stromem?", "Postup: celá věc → větší části → drobnosti."], explanation: "Od celku k podrobnostem: vysoký strom → koruna → jablka na větvích." }),
  choice("Text: „Náš pes Brok je velký a chlupatý. Má černou srst a bílou skvrnu na čele. Minulý týden se ztratil. Je hravý a přátelský.“ Která věta do popisu nepatří?", "Minulý týden se ztratil.", [
    { value: "Náš pes Brok je velký a chlupatý.", why: "To je celek — do popisu patří." },
    { value: "Má černou srst a bílou skvrnu na čele.", why: "To je vzhled — do popisu patří." },
    { value: "Je hravý a přátelský.", why: "To je povaha — do popisu patří." },
  ], { hints: ["Která věta vypráví, co se stalo?", "Popis ukazuje, jaký pes je; událost z minulého týdne je děj."], explanation: "Věta o tom, že se pes ztratil, je děj — do popisu nepatří." }),
  choice("Jak zní věta „Mám pěkný svetr.“ přesněji?", "Mám teplý vlněný svetr.", [
    { value: "Mám hezký svetr.", why: "Hezký je stejně neurčitý jako pěkný." },
    { value: "Mám moc pěkný svetr.", why: "Slovo „moc“ nic konkrétního nepřidá." },
    { value: "Mám super svetr.", why: "Super je hovorové a nic neříká." },
  ], { hints: ["Která věta ti řekne, jaký ten svetr opravdu je?", "Nahraď pocitové slovo skutečnou vlastností — materiálem, barvou, tím, jak hřeje."], explanation: "„Teplý vlněný“ říká konkrétní vlastnosti; ostatní slova jsou jen pocity." }),
  choice("Text: „Je kulatý, oranžový a má drsnou slupku. Uvnitř je šťavnatý a sladký.“ Co se popisuje?", "pomeranč", [
    { value: "citron", why: "Citron je žlutý a kyselý." },
    { value: "jablko", why: "Jablko má hladkou slupku." },
    { value: "mrkev", why: "Mrkev je dlouhá a slupku nemá." },
  ], { hints: ["Které ovoce je oranžové a má drsnou slupku?", "Spoj všechny vlastnosti dohromady: barva, tvar, slupka i chuť musí sedět zároveň."], explanation: "Kulatý, oranžový, drsná slupka, sladký — to je pomeranč." }),
  choice("Text: „Je malá, šedá, má dlouhý tenký ocásek a kulatá ouška. Ráda hlodá.“ Co se popisuje?", "myš", [
    { value: "kočka", why: "Kočka je větší a nehlodá." },
    { value: "veverka", why: "Veverka je zrzavá a má huňatý ocas." },
    { value: "ježek", why: "Ježek má bodliny." },
  ], { hints: ["Které malé šedé zvířátko má tenký ocásek?", "Ověř každou vlastnost: velikost, barva, ocas, uši i to, co zvíře dělá."], explanation: "Malá, šedá, tenký ocásek, hlodá — to je myš." }),
  choice("Text: „Pan Novák je vysoký a má brýle. Je trpělivý a rád pomáhá.“ Co popisuje druhá věta?", "povahu", [
    { value: "vzhled", why: "Vzhled popisuje první věta." },
    { value: "oblečení", why: "O oblečení tu nic není." },
    { value: "děj", why: "Nic se tu nestalo." },
  ], { hints: ["Jde v druhé větě o to, co vidíš, nebo jak se pan Novák chová?", "Trpělivost ani ochotu na fotce neuvidíš — to je vnitřní vlastnost člověka."], explanation: "Trpělivý a rád pomáhá — to je povaha." }),
  choice("Která věta zapojuje nejvíc smyslů?", "Chléb je křupavý, zlatavý a krásně voní.", [
    { value: "Chléb je hnědý a má tvar bochníku.", why: "Tady je jen zrak." },
    { value: "Chléb leží na stole.", why: "To je jen místo, ne vlastnost." },
    { value: "Chléb je kulatý.", why: "Tady je jen tvar — zrak." },
  ], { hints: ["Ve které větě chléb vidíš, slyšíš i cítíš?", "Počítej smysly: barva je zrak, vůně čich, křupání sluch i hmat."], explanation: "Křupavý, zlatavý a voní — zapojuje zrak, sluch, hmat i čich." }),
  choice("Kamarád nikdy neviděl tvého morčete. Co mu v popisu řekneš nejdřív?", "jak je velké a jakou má barvu", [
    { value: "kdy jsi ho dostal", why: "To je příběh, ne popis." },
    { value: "co dělalo minulou neděli", why: "To je děj." },
    { value: "kolik stálo", why: "Z ceny si ho nepředstaví." },
  ], { hints: ["Co potřebuje kamarád, aby si morče představil?", "Popis začíná celkem — nejdřív to, čeho si člověk všimne na první pohled."], explanation: "Nejdřív popíšeme celek: velikost a barvu." }),
  choice("Ztratil se pes. Která věta v oznámení pomůže psa poznat nejvíc?", "Je to malý bílý pudl s červeným obojkem.", [
    { value: "Je to hodný pes.", why: "Hodných psů je hodně, podle toho ho nikdo nepozná." },
    { value: "Máme ho moc rádi.", why: "To psa popsat nepomůže." },
    { value: "Ztratil se včera večer.", why: "Čas je užitečný, ale podle něj psa nepoznáš." },
  ], { hints: ["Podle čeho by cizí člověk psa na ulici poznal?", "Poznávací znamení jsou vlastnosti, které uvidíš: velikost, barva, plemeno, obojek."], explanation: "Nejvíc pomůže přesný popis vzhledu." }),
  choice("Text: „Židle je dřevěná. Má čtyři nohy a opěradlo. Sedím na ní u psacího stolu.“ K čemu je poslední věta?", "říká, k čemu věc slouží", [
    { value: "popisuje barvu", why: "O barvě tu nic není." },
    { value: "vypráví, co se stalo", why: "Nic se nestalo — je to běžné použití." },
    { value: "pojmenuje věc", why: "Věc pojmenovala už první věta." },
  ], { hints: ["Co se o židli dozvíš z poslední věty?", "Závěr popisu často prozradí užitek věci."], explanation: "Poslední věta říká, k čemu židle slouží." }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3);
}

export const POPISPREDMETU: TopicMetadata[] = [
  {
    id: "g3-cjl-popis-predmetu",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-predmetu-zvirete-osoby",
    title: "Popis předmětu, zvířete, osoby",
    studentTitle: "Popis věci a zvířete",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se přesně popsat věc, zvíře nebo osobu.",
    keywords: ["popis", "přídavná jména", "vzhled", "vlastnosti", "od celku k detailu", "smysly"],
    goals: ["Napsat popis předmětu od celku k detailu.", "Použít přídavná jména pro přesnější popis.", "Rozlišit popis od vypravování."],
    boundaries: ["Jednoduchý popis pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Popis: Jaký? Jak velký? Jaké barvy? Z čeho? K čemu slouží? — od celku k detailu.",
      steps: ["Pojmenuj, co popisuješ.", "Celek: velikost, tvar, barva.", "Detaily: části, materiál, zvláštnosti.", "Zakončení: k čemu slouží."],
      commonMistake: "Přidání děje do popisu: 'Míč skočil přes plot.' → to patří do vypravování, ne popisu.",
      example: "Jablko je kulaté ovoce. Je zelené nebo červené. Má hladkou slupku a uvnitř bílou dužinu. Jablko je sladké a šťavnaté.",
    },
  },
];
