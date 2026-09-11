/**
 * Vlastivěda 4. ročník — Podnebí ČR, ovzduší, počasí.
 *
 * Přepsáno 2026-09-11. Původní úlohy měly jednu nápovědu, „postup“, který
 * zopakoval odpověď, a žádnou diagnostiku. Sahaly po látce 2. stupně
 * (oxidy síry a dusíku, ozonová vrstva, kumulonimbus, fronty, teplotní
 * inverze) a tvrdily, že na západě Česka prší víc než na východě — přitom
 * nejvíc prší v horách na západě i na východě (Beskydy).
 *
 * Gradace:
 *  • L1 — počasí a podnebí, roční období, přístroje, nejteplejší místa a měsíce.
 *  • L2 — proč je někde tepleji či chladněji, bouřka, severní vítr, laviny.
 *  • L3 — úvahy: proč je počasí v jeden den jinde jiné, proč prudký déšť
 *         po suchu nepomůže, proč se v údolí drží mlha.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

const POOL_L1: PracticeTask[] = [
  choice("Kolik ročních období se u nás střídá?", "Čtyři", [
    { value: "Dvě", why: "Dvě roční období mají některé tropické země — období dešťů a sucha. U nás jsou čtyři." },
    { value: "Tři", why: "Chybí jedno: máme jaro, léto, podzim i zimu." },
    { value: "Šest", why: "Šest ročních období u nás není." },
  ], {
    hints: ["Vyjmenuj je od toho, kdy začíná školní rok.", "Po létě přijde podzim, pak zima a nakonec jaro. Kolik jich je?"],
    explanation: "U nás se střídají čtyři roční období: jaro, léto, podzim a zima. Je to proto, že Česko leží v mírném pásu.",
  }),
  choice("Co je počasí?", "Jaké je venku právě teď — teplota, vítr, déšť", [
    { value: "Jaké bývá na místě po mnoho let", why: "To je podnebí. Počasí je to, co je venku právě teď." },
    { value: "Jen teplota vzduchu", why: "Teplota je jen část počasí. Patří k němu i vítr, déšť, oblačnost." },
    { value: "Jen množství deště za rok", why: "Roční množství deště patří k podnebí. Počasí je teď." },
  ], {
    hints: ["Na počasí se díváš z okna, když se rozhoduješ, co si oblékneš.", "Počasí se mění ze dne na den i během jednoho dne. Popisuje, jak je venku v tuhle chvíli."],
    explanation: "Počasí je to, jaké je venku právě teď na určitém místě: teplota, vítr, oblačnost, déšť nebo sníh. Mění se každý den.",
  }),
  choice("Co je podnebí?", "Jaké počasí bývá na místě po mnoho let", [
    { value: "Jaké počasí je právě dnes", why: "Dnešní stav je počasí. Podnebí je dlouhodobé." },
    { value: "Jen to, jak silně fouká vítr", why: "Vítr je jen část. Podnebí popisuje, jaké počasí na místě obvykle bývá." },
    { value: "Jen dnešní teplota vzduchu", why: "Dnešní teplota je počasí. Podnebí je průměr za mnoho let." },
  ], {
    hints: ["Podnebí se nemění ze dne na den.", "Podnebí popisuje, co na místě obvykle bývá: jak teplá léta, jak studené zimy a kolik prší. Za jak dlouhou dobu se to sleduje?"],
    explanation: "Podnebí popisuje, jaké počasí na určitém místě obvykle bývá po mnoho let. Třeba že na jižní Moravě bývají teplá léta a v Krkonoších dlouhé zimy.",
  }),
  choice("Jaké podnebí má Česko?", "Mírné, se čtyřmi ročními obdobími", [
    { value: "Tropické, horké celý rok", why: "Tropické podnebí je u rovníku. U nás jsou i mrazivé zimy." },
    { value: "Polární, mrazivé celý rok", why: "Polární podnebí je u pólů. U nás bývá i horké léto." },
    { value: "Pouštní, skoro bez deště", why: "V Česku prší dost. Pouštní podnebí je třeba na Sahaře." },
  ], {
    hints: ["Máme u nás horké léto i mrazivou zimu?", "Česko leží daleko od rovníku i od pólu, uprostřed. Jak se jmenuje takové podnebí?"],
    explanation: "Česko má mírné podnebí. Léta jsou teplá, zimy chladné a střídají se čtyři roční období.",
  }),
  choice("Kde v Česku bývá nejtepleji?", "Na jižní Moravě", [
    { value: "V Krkonoších", why: "Krkonoše jsou vysoko, je tam naopak chladno." },
    { value: "Na Šumavě", why: "Šumava je vysoko a patří k nejchladnějším místům." },
    { value: "V Jizerských horách", why: "Jizerské hory jsou chladné a deštivé." },
  ], {
    hints: ["Hledej nízko položené místo na jihu.", "Pěstuje se tam vinná réva a meruňky a leží tam Brno a Znojmo. Kde to je?"],
    explanation: "Nejtepleji bývá na jižní Moravě. Leží nízko a na jihu Česka, proto se tam daří vinné révě, meruňkám i broskvím.",
  }),
  choice("Kde v Česku bývá nejchladněji?", "Na horách", [
    { value: "Na jižní Moravě", why: "Jižní Morava je nejteplejší oblast." },
    { value: "V Praze", why: "Praha leží níž než hory a ve městě je navíc tepleji." },
    { value: "V Polabí", why: "Polabí je nížina, je tam spíš teplo." },
  ], {
    hints: ["Kde leží sníh nejdéle do jara?", "S výškou teplota klesá. Kde jsou v Česku nejvyšší místa?"],
    explanation: "Nejchladněji je na horách — v Krkonoších, na Šumavě nebo v Jeseníkách. S výškou teplota klesá, a proto tam sníh leží dlouho.",
  }),
  choice("Čím změříš teplotu vzduchu?", "Teploměrem", [
    { value: "Srážkoměrem", why: "Srážkoměr měří, kolik napršelo." },
    { value: "Barometrem", why: "Barometr měří tlak vzduchu." },
    { value: "Větrnou korouhví", why: "Korouhev ukazuje, odkud fouká vítr." },
  ], {
    hints: ["Ukazuje stupně Celsia.", "Visí za oknem a podle něj víš, jestli je venku mráz. Jak se jmenuje?"],
    explanation: "Teplotu vzduchu měříme teploměrem ve stupních Celsia. Srážkoměr měří déšť a barometr tlak vzduchu.",
  }),
  choice("V jakých jednotkách u nás měříme teplotu?", "Ve stupních Celsia", [
    { value: "Ve stupních Fahrenheita", why: "Stupně Fahrenheita se používají hlavně v USA." },
    { value: "V metrech", why: "Metry měří délku, ne teplotu." },
    { value: "V litrech", why: "Litry měří objem, ne teplotu." },
  ], {
    hints: ["Za číslem teploty píšeme značku „°C“.", "Voda na této stupnici mrzne při nule a vaří se při stovce. Stupnice je pojmenovaná po švédském vědci."],
    explanation: "Teplotu měříme ve stupních Celsia (°C). Voda na této stupnici mrzne při 0 °C a vaří se při 100 °C.",
  }),
  choice("Který měsíc bývá u nás nejteplejší?", "Červenec", [
    { value: "Květen", why: "V květnu už je teplo, ale nejteplejší bývá až léto." },
    { value: "Září", why: "V září se už ochlazuje." },
    { value: "Březen", why: "Březen je na začátku jara, bývá chladný." },
  ], {
    hints: ["Je to měsíc uprostřed letních prázdnin.", "Prázdniny začínají v jednom měsíci a končí v dalším. Ten první z nich bývá nejteplejší."],
    explanation: "Nejteplejším měsícem u nás bývá červenec, uprostřed léta a prázdnin.",
  }),
  choice("Který měsíc bývá u nás nejchladnější?", "Leden", [
    { value: "Listopad", why: "V listopadu už je chladno, ale nejchladněji bývá v zimě." },
    { value: "Březen", why: "V březnu se už otepluje." },
    { value: "Prosinec", why: "Prosinec je studený, ale nejchladnější bývá měsíc po něm." },
  ], {
    hints: ["Je to první měsíc v roce.", "Po Vánocích a Silvestru přichází měsíc, kdy bývají nejsilnější mrazy. Který to je?"],
    explanation: "Nejchladnějším měsícem u nás bývá leden. Prosinec je studený taky, ale nejsilnější mrazy přicházejí až po Novém roce.",
  }),
  choice("Co nám řekne předpověď počasí?", "Jaké počasí bude v příštích dnech", [
    { value: "Jaké počasí bylo loni", why: "To říkají záznamy o počasí. Předpověď se dívá dopředu." },
    { value: "Jaké je podnebí v Africe", why: "Předpověď počasí popisuje počasí u nás v nejbližších dnech." },
    { value: "Kolik je hodin", why: "Čas ukazují hodiny, ne předpověď počasí." },
  ], {
    hints: ["Předpověď se dívá dopředu, ne dozadu.", "Díváš se na ni večer v televizi, aby bylo jasné, jestli si zítra vzít deštník. Co ti tedy řekne?"],
    explanation: "Předpověď počasí odhaduje, jaké bude počasí v příštích hodinách a dnech. Připravují ji meteorologové z měření na stanicích.",
  }),
  choice("Čím se měří, kolik napršelo?", "Srážkoměrem", [
    { value: "Teploměrem", why: "Teploměr měří teplotu." },
    { value: "Barometrem", why: "Barometr měří tlak vzduchu." },
    { value: "Kompasem", why: "Kompas ukazuje světové strany." },
  ], {
    hints: ["Jméno přístroje napovídá, co měří.", "Je to nádoba, do které padá déšť, a na stupnici se odečte, kolik vody napadalo."],
    explanation: "Množství srážek měří srážkoměr — nádoba, do které padá déšť nebo sníh. Pak se odečte, kolik vody napadlo.",
  }),
  choice("Co je bouřka?", "Déšť s blesky a hromy", [
    { value: "Silný vítr bez deště", why: "Silný vítr může být vichřice. Bouřku poznáš podle blesků a hromů." },
    { value: "Mlha u země", why: "Mlha je mrak u země, blesky při ní nejsou." },
    { value: "Sněžení v létě", why: "V létě u nás nesněží. Při bouřce blýská a hřmí." },
  ], {
    hints: ["Při bouřce se schováváme doma a počítáme sekundy.", "Nejdřív blýskne a za chvíli zahřmí. Často přitom silně prší."],
    explanation: "Bouřka je počasí s blesky a hromy, obvykle se silným deštěm a větrem. U nás bývá hlavně v létě.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Jaký je rozdíl mezi počasím a podnebím?", "Počasí je teď, podnebí je dlouhodobé", [
    { value: "Počasí platí pro celý svět, podnebí pro jedno místo", why: "Obojí se týká určitého místa. Liší se délkou doby." },
    { value: "Podnebí se mění každý den, počasí ne", why: "Je to naopak — počasí se mění každý den." },
    { value: "Je to totéž", why: "Není. Počasí je teď, podnebí popisuje mnoho let." },
  ], {
    hints: ["Který z těch dvou pojmů se mění ze dne na den?", "Dnes prší a zítra svítí — to je jeden pojem. „Na jižní Moravě bývají teplá léta“ — to je ten druhý."],
    explanation: "Počasí je stav venku právě teď a mění se každý den. Podnebí popisuje, jaké počasí na místě obvykle bývá po mnoho let.",
  }),
  choice("Proč je na horách chladněji než v nížinách?", "S výškou teplota klesá", [
    { value: "Hory jsou blíž k severu", why: "Hory nejsou blíž k severu. Rozhoduje výška." },
    { value: "V horách méně svítí slunce", why: "Na horách svítí slunce stejně, často ještě víc." },
    { value: "V horách žije méně lidí", why: "Počet lidí teplotu neurčuje. Rozhoduje nadmořská výška." },
  ], {
    hints: ["Čím výš vystoupáš, tím je vzduch…", "Na Sněžce je o hodně chladněji než v Praze, i když svítí stejné slunce. Co se mění s výškou?"],
    explanation: "S výškou teplota klesá, zhruba o 6 stupňů na každý kilometr. Proto je na horách chladněji a sníh vydrží déle.",
  }),
  choice("Proč je na jižní Moravě nejtepleji?", "Leží nízko a na jihu", [
    { value: "Je tam nejvíc lidí", why: "Počet lidí teplotu nerozhoduje." },
    { value: "Leží u moře", why: "Česko u moře neleží." },
    { value: "Jsou tam vysoké hory", why: "Hory by přinesly chlad. Jižní Morava je naopak nížina." },
  ], {
    hints: ["Srovnej výšku jižní Moravy a hor.", "Jižní Morava je nížina a je nejjižnější částí Česka. Co to dělá s teplotou?"],
    explanation: "Jižní Morava je nížina položená na jihu Česka. Nízká poloha a jih znamenají teplo, a proto se tam daří vinné révě.",
  }),
  choice("Proč se před výletem na hory díváme na předpověď počasí?", "Na horách se počasí rychle mění a může být nebezpečné", [
    { value: "Na horách je počasí vždy stejné", why: "Na horách se počasí mění naopak rychle." },
    { value: "Předpověď je povinná", why: "Povinná není, ale je rozumné ji znát." },
    { value: "Na horách nikdy neprší", why: "Na horách prší víc než v nížinách." },
  ], {
    hints: ["Co se může stát, když tě na hřebeni zastihne bouřka nebo mlha?", "Na horách se počasí mění za pár hodin. Vítr, mlha a bouřka tam turistům snadno ublíží. Proč tedy chceš vědět předem, co tě čeká?"],
    explanation: "Na horách se počasí může rychle zhoršit — přijde mlha, vítr nebo bouřka. Předpověď pomůže vybrat bezpečný den a vzít si správné oblečení.",
  }),
  choice("Kdy u nás bývají bouřky nejčastěji?", "V létě, když je horko", [
    { value: "V zimě při mrazu", why: "V zimě jsou bouřky vzácné. Potřebují teplý vzduch." },
    { value: "Na podzim při mlze", why: "Mlha s bouřkou nesouvisí." },
    { value: "Na jaře při tání", why: "Na jaře bouřky bývají, ale nejčastěji v létě." },
  ], {
    hints: ["Bouřka potřebuje hodně teplého vlhkého vzduchu.", "Po horkém dni se odpoledne na obloze vytvoří obrovské mraky a začne hřmít. Ve kterém ročním období je takových dní nejvíc?"],
    explanation: "Bouřky bývají hlavně v létě. Horký vlhký vzduch rychle stoupá vzhůru a vznikají obrovské bouřkové mraky s blesky.",
  }),
  choice("Jak se zachovat, když tě venku zastihne bouřka?", "Nestát pod osamělým stromem a jít do budovy", [
    { value: "Schovat se pod vysoký strom", why: "Blesk často udeří do vysokého stromu. Pod ním je to nebezpečné." },
    { value: "Vylézt na kopec a rozhlédnout se", why: "Na kopci jsi nejvyšší bod a blesk může udeřit do tebe." },
    { value: "Stát s deštníkem na otevřené louce", why: "Na louce jsi nejvyšší bod a kovový deštník je navíc nebezpečný." },
  ], {
    hints: ["Kam blesk nejčastěji udeří?", "Blesk hledá nejvyšší místo v okolí — osamělý strom, kopec, člověka na louce. Kde jsi v bezpečí?"],
    explanation: "Blesk nejčastěji udeří do vysokých osamělých míst. Proto se nestojí pod osamělým stromem ani na kopci. Nejbezpečnější je budova nebo auto.",
  }),
  choice("Proč se v létě ve městě hůř dýchá než v lese?", "Beton a asfalt hřejí a auta znečišťují vzduch", [
    { value: "Ve městě je víc kyslíku", why: "Víc kyslíku by dýchání usnadnilo. Ve městě je spíš horko a výfuky." },
    { value: "V lese je víc aut", why: "V lese auta skoro nejezdí." },
    { value: "Ve městě neprší", why: "Ve městě prší stejně. Rozdíl dělá beton a doprava." },
  ], {
    hints: ["Čím se liší ulice ve městě od lesní cesty?", "Ve městě je samý asfalt, který se na slunci rozpálí, a jezdí tam spousta aut. V lese je stín a stromy."],
    explanation: "Beton a asfalt se v létě rozpálí a vydávají teplo a auta vypouštějí výfukové plyny. V lese je stín, stromy vypařují vodu a vzduch čistí.",
  }),
  choice("Kdy mluvíme o mrazu?", "Když je teplota pod nulou", [
    { value: "Když je teplota nad nulou", why: "Nad nulou led taje, mráz to není." },
    { value: "Když fouká silný vítr", why: "Vítr může studit, ale mráz znamená teplotu pod nulou." },
    { value: "Když je zataženo", why: "I v zataženém dni může být teplo." },
  ], {
    hints: ["Při mrazu voda zamrzá.", "Voda mrzne, jakmile se ochladí pod určitou hranici na teploměru. Která to je?"],
    explanation: "Mráz je, když teplota klesne pod 0 °C. Voda pak mrzne na led a na oknech se tvoří ledové květy.",
  }),
  choice("Ve kterém ročním období u nás obvykle spadne nejvíc srážek?", "V létě", [
    { value: "V zimě", why: "V zimě bývá sníh, ale vody z něj je méně než z letních dešťů a bouřek." },
    { value: "Na jaře", why: "Na jaře prší, ale nejvíc srážek bývá až v létě." },
    { value: "Na podzim", why: "Podzim bývá spíš mlhavý, nejvíc vody spadne v létě." },
  ], {
    hints: ["Kdy bývají u nás silné bouřky s lijákem?", "Teplý vzduch unese víc vody. V období, kdy je nejtepleji, přicházejí i prudké letní lijáky."],
    explanation: "Nejvíc srážek u nás obvykle spadne v létě — hlavně při bouřkách a lijácích. Teplý vzduch unese víc vodní páry.",
  }),
  choice("Proč lesy v létě ochlazují okolí?", "Stíní a vypařují vodu", [
    { value: "Stromy vyrábějí led", why: "Stromy led nevyrábějí. Chladí stínem a vypařováním." },
    { value: "Stromy odhánějí slunce", why: "Slunce neodženou, jen zachytí jeho paprsky." },
    { value: "V lese pořád sněží", why: "V lese v létě nesněží." },
  ], {
    hints: ["Proč je v lese v horkém dni příjemně?", "Koruny zachytí slunce a z listů se vypařuje voda, která okolí ochladí, stejně jako pot ochladí tělo."],
    explanation: "Stromy vrhají stín a z listů se vypařuje voda, která okolí ochlazuje. Proto je v lese v létě o několik stupňů chladněji než na poli.",
  }),
  choice("Proč na horách napadne víc sněhu než v nížinách?", "Je tam chladněji a víc srážek", [
    { value: "Hory jsou blíž k mrakům a sníh padá jen tam", why: "Sníh padá i v nížinách, jen na horách víc a déle vydrží." },
    { value: "Na horách lidé vyrábějí všechen sníh", why: "Technický sníh se vyrábí na sjezdovkách, ale přírodního napadne víc sám." },
    { value: "V nížinách nikdy nesněží", why: "V nížinách sněží taky, jen méně a sníh rychle roztaje." },
  ], {
    hints: ["Co je potřeba, aby místo déšť padal sníh?", "Na horách je chladněji a vzduch stoupající přes hory tam vyprší víc vody z mraků. Co z toho plyne v zimě?"],
    explanation: "Na horách je chladněji, takže místo deště padá sníh, a navíc tam spadne víc srážek. Sníh tam leží od podzimu do jara.",
  }),
  choice("Proč se v zimě na horách musí dávat pozor na laviny?", "Ze strmého svahu se může utrhnout sníh", [
    { value: "V horách padají kameny ze skal každý den", why: "Laviny jsou ze sněhu, ne z kamení." },
    { value: "Sníh v horách je jedovatý", why: "Sníh jedovatý není. Nebezpečí je, že se utrhne." },
    { value: "Laviny hrozí jen v létě", why: "Laviny jsou ze sněhu, takže hrozí v zimě a na jaře." },
  ], {
    hints: ["Co se může stát s velkou vrstvou sněhu na prudkém svahu?", "Sněhu napadne hodně, na strmém svahu se může dát do pohybu a řítit se dolů. Kde to hrozí i v Česku?"],
    explanation: "Na strmých svazích se může velká vrstva sněhu utrhnout a řítit se dolů jako lavina. V Česku hrozí hlavně v Krkonoších a Jeseníkách.",
  }),
  choice("Co znamená, že fouká severní vítr?", "Vítr fouká od severu", [
    { value: "Vítr fouká na sever", why: "Vítr se pojmenovává podle toho, odkud přichází, ne kam jde." },
    { value: "Vítr fouká jen v noci", why: "Jméno větru neříká nic o denní době." },
    { value: "Vítr fouká jen v zimě", why: "Severní vítr může foukat v kterémkoli ročním období." },
  ], {
    hints: ["Podle čeho se vítr pojmenovává — odkud přichází, nebo kam míří?", "Jižní vítr k nám přináší teplý vzduch od jihu, z teplých krajin. Odkud tedy přichází vítr, kterému říkáme severní?"],
    explanation: "Vítr se pojmenovává podle směru, odkud fouká. Severní vítr přichází od severu a u nás obvykle přináší chladný vzduch.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("V Krkonoších sněží, v Brně je teplo. Jak to, že je ve stejný den jinde jiné počasí?", "Záleží na výšce a poloze místa", [
    { value: "Každé město má vlastní počasí určené zákonem", why: "Počasí zákon neurčuje. Rozhoduje výška a poloha." },
    { value: "V Brně nikdy nesněží", why: "V Brně sněží taky, jen méně často." },
    { value: "Počasí je všude v Česku vždy stejné", why: "Počasí se místo od místa liší." },
  ], {
    hints: ["Krkonoše a Brno se liší hlavně jednou věcí.", "Krkonoše jsou vysoko na severu, Brno nízko na jihu. Jak to ovlivní teplotu a to, jestli padá déšť, nebo sníh?"],
    explanation: "Krkonoše jsou vysoko a na severu, a tak je tam chladněji a místo deště sněží. Brno leží nízko na jihu Moravy, kde je tepleji.",
  }),
  choice("Proč bývá ve městě o něco tepleji než na venkově?", "Domy a doprava hřejí a beton drží teplo", [
    { value: "Města leží blíž ke Slunci", why: "Město není blíž ke Slunci. Teplo vydávají domy, auta a beton." },
    { value: "Ve městě nefouká vítr", why: "I ve městě fouká. Rozdíl je v tom, co teplo vydává a drží." },
    { value: "Na venkově nesvítí slunce", why: "Na venkově svítí slunce stejně." },
  ], {
    hints: ["Co ve městě vydává teplo, i když slunce nesvítí?", "Topení v domech, motory aut a rozpálený asfalt. Co z toho na poli chybí?"],
    explanation: "Ve městě domy topí, auta a továrny vydávají teplo a beton s asfaltem ho drží dlouho do noci. Proto je ve městě tepleji než na poli nebo v lese.",
  }),
  choice("Proč se podnebí nemění ze dne na den, i když počasí ano?", "Podnebí popisuje průměr počasí za mnoho let", [
    { value: "Podnebí se měří jen jednou za rok", why: "Nejde o měření. Podnebí je průměr za dlouhou dobu." },
    { value: "Podnebí nikoho nezajímá", why: "Podnebí je důležité, třeba pro zemědělce." },
    { value: "Počasí a podnebí je totéž", why: "Nejsou. Proto se jedno mění rychle a druhé pomalu." },
  ], {
    hints: ["Kolik let zahrnuje podnebí?", "Jeden deštivý den nezmění, jaké bývá počasí na jižní Moravě po desítky let. Co je tedy podnebí?"],
    explanation: "Podnebí je průměr počasí za mnoho let. Jeden studený týden ho nezmění, proto se mění jen velmi pomalu. Počasí se mění každý den.",
  }),
  choice("Proč se v posledních letech v Česku často mluví o suchu?", "Přibývá horkých dnů a déšť je nerovnoměrný", [
    { value: "V Česku přestalo úplně pršet", why: "Prší dál, ale nerovnoměrně a v horku se voda rychle vypaří." },
    { value: "Řeky tečou do kopce", why: "Řeky tečou z kopce, to se nezměnilo." },
    { value: "Stromy vypijí všechnu vodu", why: "Stromy vodu naopak v krajině zadržují." },
  ], {
    hints: ["Co se děje s vodou, když je dlouho horko?", "V horkém létě se voda rychle vypaří a když pak prší, tak prudce. Kolik vody se přitom vsákne do země?"],
    explanation: "Horkých dnů přibývá a voda se rychle vypaří. Déšť přichází nerovnoměrně — dlouho neprší a pak přijde liják. Proto krajině chybí voda.",
  }),
  choice("Proč prudký liják po suchu nepomůže tolik jako mírný déšť?", "Voda steče po tvrdé zemi a nevsákne se", [
    { value: "Liják je z jiné vody", why: "Voda je stejná. Liší se, kolik se jí stihne vsáknout." },
    { value: "Mírný déšť je teplejší", why: "Teplota rozdíl nedělá. Rozhoduje rychlost padání." },
    { value: "Liják vodu hned vypaří", why: "Liják se nevypaří, ale steče pryč." },
  ], {
    hints: ["Co se stane s vodou, když ji naliješ najednou na vyschlou hlínu v květináči?", "Vyschlá tvrdá zem nestihne tolik vody najednou nasát a voda po ní steče jako po talíři. Kam pak odteče?"],
    explanation: "Vyschlá půda je tvrdá a velké množství vody najednou nestihne nasát. Voda steče do potoků a odteče pryč. Mírný déšť se naopak pomalu vsákne.",
  }),
  choice("Proč hrozny na jižních svazích dozrávají lépe než na severních?", "Slunce na ně svítí přímo a hřeje víc", [
    { value: "Na jih fouká teplý vítr", why: "Vítr to není. Rozhoduje, jak slunce na svah dopadá." },
    { value: "Na severních svazích víc prší", why: "Déšť to nevysvětlí. Jde o slunce." },
    { value: "Na severu jsou jiné hrozny", why: "Hrozny jsou stejné, liší se jen poloha svahu." },
  ], {
    hints: ["Na které straně oblohy je u nás slunce v poledne?", "Slunce je v poledne na jihu. Na který svah tedy dopadají paprsky kolmo a na který jen šikmo?"],
    explanation: "Slunce je u nás v poledne na jihu. Jižní svahy k němu jsou natočené a hřeje na ně víc, proto se tam vinice sázejí.",
  }),
  choice("Když fouká vítr od severu, bývá u nás spíš teplo, nebo chladno?", "Chladno, přináší studený vzduch ze severu", [
    { value: "Teplo, protože sever je blízko moře", why: "Moře to nezahřeje. Na severu je chladněji a vítr odtud přináší chlad." },
    { value: "Směr větru s teplotou nesouvisí", why: "Souvisí. Vítr přináší vzduch z místa, odkud fouká." },
    { value: "Horko, protože na severu svítí víc slunce", why: "Na severu svítí slunce méně a je tam chladněji." },
  ], {
    hints: ["Odkud přichází vzduch, když fouká severní vítr?", "Na severu Evropy je chladněji než u nás. Když vítr fouká odtamtud, co s sebou přinese?"],
    explanation: "Vítr přináší vzduch z místa, odkud fouká. Ze severu přichází chladný vzduch, a proto severní vítr u nás obvykle ochladí.",
  }),
  choice("Proč se ráno v údolí drží mlha, zatímco na kopci svítí slunce?", "Studený vzduch s mlhou se drží dole v údolí", [
    { value: "Na kopci je teplejší zem", why: "Nejde o zem. Studený vzduch je těžší a stéká do údolí." },
    { value: "Mlha se bojí výšky", why: "Mlha nic necítí. Drží se tam, kde je studený vzduch." },
    { value: "Na kopci je mlha zakázaná", why: "Mlha tam být může, jen se častěji drží v údolí." },
  ], {
    hints: ["Co je těžší — chladný, nebo teplý vzduch?", "V noci chladný vzduch stéká po svazích dolů do údolí jako voda. Kde se pak ráno vytvoří mlha?"],
    explanation: "Studený vzduch je těžší a v noci stéká do údolí. Tam se ochladí natolik, že vznikne mlha. Na kopci může být nad mlhou jasno a slunečno.",
  }),
  choice("Proč zemědělci sledují předpověď počasí?", "Podle počasí sejí, sklízejí a chrání úrodu", [
    { value: "Aby věděli, kolik je hodin", why: "Čas ukazují hodiny. Počasí rozhoduje o práci na poli." },
    { value: "Předpověď nikdy nevyjde", why: "Předpověď na pár dní bývá dost přesná a zemědělcům pomáhá." },
    { value: "Jen kvůli zábavě", why: "Pro zemědělce je počasí důležité pro celou úrodu." },
  ], {
    hints: ["Kdy se dá sklízet obilí kombajnem?", "Za deště kombajn nesklidí a mráz zničí kvetoucí stromy. Proč tedy zemědělec chce vědět, jaké bude počasí?"],
    explanation: "Počasí rozhoduje o práci zemědělců: za deště se nesklízí, mráz na jaře zničí květy a sucho úrodu. Podle předpovědi plánují setí, sklizeň i ochranu.",
  }),
  choice("Proč bývá v létě u velkých rybníků a řek chladněji?", "Voda se ohřívá pomalu a ochlazuje okolí", [
    { value: "Nad vodou nesvítí slunce", why: "Slunce svítí i nad vodou. Voda se ale ohřívá pomaleji." },
    { value: "Ve vodě je led", why: "V létě ve vodě led není. Voda se jen pomalu ohřívá." },
    { value: "U vody pořád prší", why: "U vody neprší víc. Chladí sama voda." },
  ], {
    hints: ["Co se ohřeje rychleji — písek na pláži, nebo voda v rybníce?", "Písek pálí do chodidel, voda je příjemně chladná. Co pak voda dělá se vzduchem nad sebou?"],
    explanation: "Voda se ohřívá mnohem pomaleji než země a z hladiny se navíc vypařuje. Proto je u rybníků a řek v horku příjemněji a chladněji.",
  }),
  choice("Čím se liší podnebí Krkonoš od podnebí jižní Moravy?", "Krkonoše jsou chladnější a deštivější", [
    { value: "Krkonoše jsou teplejší a sušší", why: "Je to naopak — Krkonoše jsou vysoko, chladné a deštivé." },
    { value: "Mají úplně stejné podnebí", why: "Liší se výrazně, hlavně teplotou a množstvím srážek." },
    { value: "Na jižní Moravě víc sněží", why: "Na jižní Moravě sněží málo. Víc sněhu je v Krkonoších." },
  ], {
    hints: ["Kde je vysoko a kde nízko?", "S výškou klesá teplota a na horách víc prší. Krkonoše patří k nejvyšším horám, jižní Morava je nížina."],
    explanation: "Krkonoše jsou vysoko, a tak jsou chladné, deštivé a mají dlouhou zimu. Jižní Morava je nízko, je teplá a sušší.",
  }),
  choice("Proč rostliny na horách kvetou na jaře později než v nížině?", "Je tam chladněji a jaro přichází později", [
    { value: "Horské rostliny nemají rády světlo", why: "Horské rostliny světlo potřebují. Kvetou později kvůli chladu." },
    { value: "Na horách nejsou žádné rostliny", why: "Na horách rostliny jsou, jen kvetou později." },
    { value: "V nížině kvetou později", why: "Je to naopak — v nížině je tepleji a kvete se dřív." },
  ], {
    hints: ["Kdy na horách roztaje sníh?", "V nížině už na jaře kvetou stromy a na horách ještě leží sníh. Kdy tam rostliny začnou kvést?"],
    explanation: "Na horách je chladněji a sníh leží déle, takže jaro tam přichází o několik týdnů později. Rostliny proto kvetou později než v nížině.",
  }),
  choice("Proč předpověď počasí na týden dopředu nemusí vyjít?", "Na delší dobu se počasí odhaduje hůř", [
    { value: "Meteorologové ji vymýšlejí", why: "Nevymýšlejí — počítají z měření. Na delší dobu je ale odhad nejistý." },
    { value: "Předpověď vždy vyjde přesně", why: "Na týden dopředu se může změnit, proto se upřesňuje." },
    { value: "Počasí se nikdy nemění", why: "Počasí se mění každý den." },
  ], {
    hints: ["Je snazší odhadnout, co bude zítra, nebo co bude za týden?", "Počasí ovlivňuje mnoho věcí, které se rychle mění. Čím dál dopředu, tím víc se může stát. Co to znamená pro předpověď?"],
    explanation: "Počasí se mění rychle a ovlivňuje ho mnoho věcí. Na zítřek se dá předpovědět dost přesně, ale čím dál dopředu, tím víc je odhad nejistý.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const PODNEBICROVZDUSIPOCASI: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-podnebi-cr-ovzdusi-pocasi",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-podnebi-cr-ovzdusi-pocasi",
    title: "Podnebí ČR, ovzduší, počasí",
    studentTitle: "Počasí a podnebí",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš rozdíl mezi počasím a podnebím a jaké podnebí má Česko.",
    keywords: ["počasí", "podnebí", "teplota", "srážky", "vítr", "bouřka", "předpověď", "mírný pás"],
    goals: [
      "Rozlišit počasí a podnebí",
      "Popsat podnebí Česka a rozdíly mezi horami a nížinami",
      "Pojmenovat přístroje na měření počasí",
      "Vysvětlit, jak se chovat při nebezpečném počasí",
    ],
    boundaries: ["Atmosférické fronty, inverze, složení emisí a ozonová vrstva patří na 2. stupeň"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Počasí je teď, podnebí je dlouhodobé. Na horách je chladněji a víc prší, na jižní Moravě je nejtepleji.",
      steps: [
        "Česko má mírné podnebí se čtyřmi ročními obdobími.",
        "S výškou teplota klesá.",
        "Teplotu měří teploměr, srážky srážkoměr.",
        "Vítr se jmenuje podle toho, odkud fouká.",
      ],
      commonMistake: "Severní vítr nefouká na sever, ale od severu.",
      example: "V Krkonoších může sněžit, zatímco v Brně je teplo — záleží na výšce a poloze.",
    },
  },
];
