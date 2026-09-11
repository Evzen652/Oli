import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Vypadly nápovědy společné pro
// celé téma, gramatické chyby („abecedně seřazenými fakta“), obskurní
// příklady (Diderot, věstník) a klíče dvakrát delší než distraktory.
// Každá úloha má vlastní nápovědy a zpětnou vazbu.
//
// L1 = co je encyklopedie, slovník, periodikum · L2 = vyber zdroj pro
// konkrétní potřebu · L3 = kombinace zdrojů, ověřování, periodicita.

const L1: PracticeTask[] = [
  choice("Co najdeš v encyklopedii?", "vysvětlení věcí a jevů ze světa", [
    { value: "překlady slov do cizího jazyka", why: "Překlady jsou v překladovém slovníku." },
    { value: "zprávy o tom, co se stalo dnes", why: "Dnešní zprávy přinášejí noviny." },
    { value: "pohádky na dobrou noc", why: "Pohádky jsou v knize pohádek." },
  ], {
    hints: ["Kam se podíváš, když chceš vědět víc o sopkách nebo o dinosaurech?", "Encyklopedie vysvětluje, jak svět funguje — přírodu, dějiny, vědu. Neřeší, jak se slova překládají, ani co se stalo dnes."],
    explanation: "Encyklopedie vysvětluje věci a jevy ze světa — o přírodě, dějinách, vědě.",
  }),
  choice("K čemu slouží výkladový slovník?", "vysvětluje, co slova znamenají", [
    { value: "překládá slova do cizího jazyka", why: "To dělá překladový slovník." },
    { value: "přináší zprávy ze světa", why: "To dělají noviny." },
    { value: "obsahuje mapy", why: "Mapy jsou v atlasu." },
  ], {
    hints: ["Co uděláš, když narazíš na české slovo, kterému nerozumíš?", "Výkladový slovník „vykládá“ slova — ke každému heslu napíše, co znamená, a často přidá i příklad věty."],
    explanation: "Výkladový slovník vysvětluje význam slov.",
  }),
  choice("K čemu slouží překladový slovník?", "říká, jak se slovo řekne v jiném jazyce", [
    { value: "vysvětluje fakta o zvířatech", why: "To dělá encyklopedie." },
    { value: "obsahuje básně", why: "Básně jsou ve sbírce básní." },
    { value: "ukazuje mapy", why: "Mapy jsou v atlasu." },
  ], {
    hints: ["Jak zjistíš, jak se anglicky řekne „kočka“?", "Překladový slovník spojuje dva jazyky: u slova v jednom jazyce najdeš, jak se řekne v druhém."],
    explanation: "Překladový slovník říká, jak se slovo řekne v jiném jazyce.",
  }),
  choice("Co jsou periodika?", "noviny a časopisy, které vycházejí pravidelně", [
    { value: "slovníky cizích slov", why: "Slovník vychází jako jedna kniha, ne pravidelně." },
    { value: "knihy, které vyjdou jen jednou", why: "Periodika vycházejí opakovaně." },
    { value: "atlasy a mapy", why: "Atlas není periodikum." },
  ], {
    hints: ["Co ti nosí pošťák každý týden nebo každý měsíc znovu?", "Slovo periodikum souvisí se slovem perioda — pravidelné opakování. Hledej tiskoviny, jejichž nová čísla přicházejí stále znovu."],
    explanation: "Periodika jsou noviny a časopisy — vycházejí pravidelně, třeba denně nebo měsíčně.",
  }),
  choice("Jak často vychází deník?", "každý den", [
    { value: "jednou za rok", why: "Jednou za rok vychází třeba ročenka." },
    { value: "jednou za měsíc", why: "Jednou za měsíc vychází měsíčník." },
    { value: "jen o prázdninách", why: "Deník vychází celý rok." },
  ], {
    hints: ["Co je schované ve slově „deník“?", "Deník, týdeník, měsíčník — název prozrazuje, jak často noviny vycházejí."],
    explanation: "Deník vychází každý den — proto se tak jmenuje.",
  }),
  choice("Jak jsou hesla v encyklopedii nejčastěji seřazena?", "podle abecedy", [
    { value: "podle velikosti", why: "Podle velikosti by se heslo hledalo těžko." },
    { value: "náhodně", why: "Náhodně by nic nešlo najít." },
    { value: "podle barvy obálky", why: "Obálka s hesly nesouvisí." },
  ], {
    hints: ["Jak rychle najdeš slovo „sopka“?", "Stejně jako ve slovníku nebo v telefonním seznamu — rozhoduje první písmeno slova."],
    explanation: "Hesla jsou seřazena podle abecedy, abychom je rychle našli.",
  }),
  choice("Kde zjistíš, jak se správně píše nějaké slovo?", "v pravopisném slovníku", [
    { value: "v atlasu", why: "Atlas má mapy." },
    { value: "v kuchařce", why: "Kuchařka má recepty." },
    { value: "v jízdním řádu", why: "Jízdní řád má odjezdy spojů." },
  ], {
    hints: ["Která kniha se zabývá pravopisem?", "Když si nejsi jistý nebo jistá, jak se slovo píše (i/y, s/z), pomůže slovník, který ukazuje správný zápis slov."],
    explanation: "Správný zápis slov najdeme v pravopisném slovníku (Pravidla českého pravopisu).",
  }),
  choice("V jaké knize najdeš mapy?", "v atlasu", [
    { value: "ve slovníku", why: "Slovník vysvětluje slova." },
    { value: "ve zpěvníku", why: "Ve zpěvníku jsou písničky." },
    { value: "v deníku", why: "Deník jsou noviny." },
  ], {
    hints: ["Kam se podíváš, když hledáš, kde leží hory nebo řeky?", "Kniha plná map má vlastní název — používáte ji i ve vlastivědě, když hledáte hory, řeky a města."],
    explanation: "Mapy najdeme v atlasu.",
  }),
  choice("Heslo „sopka“ najdeš v encyklopedii u písmene…", "S", [
    { value: "V", why: "V by bylo pro slovo vulkán, ale hledáme sopku." },
    { value: "P", why: "P by bylo pro příroda — heslo je ale sopka." },
    { value: "Z", why: "Z by bylo pro Země — heslo je ale sopka." },
  ], {
    hints: ["Jakým písmenem začíná slovo, které hledáš?", "Hesla jsou podle abecedy. Rozhoduje první písmeno hledaného slova, ne téma, do kterého patří."],
    explanation: "Sopka začíná písmenem S, proto ji hledáme u S.",
  }),
  choice("Dětský časopis, který vychází každý týden, je…", "periodikum", [
    { value: "encyklopedie", why: "Encyklopedie vyjde jako kniha, ne každý týden." },
    { value: "slovník", why: "Slovník vysvětluje slova a nevychází pravidelně." },
    { value: "atlas", why: "Atlas je kniha map." },
  ], {
    hints: ["Vychází ten časopis jednou, nebo pořád znovu?", "Tiskoviny, které vycházejí pravidelně znovu a znovu, mají společný název."],
    explanation: "Časopis vychází pravidelně každý týden — je to periodikum.",
  }),
  choice("Co najdeš ve slovníku synonym?", "slova s podobným významem", [
    { value: "jména slavných lidí", why: "Ta najdeš v encyklopedii." },
    { value: "recepty na jídla", why: "Ty jsou v kuchařce." },
    { value: "mapy států", why: "Mapy jsou v atlasu." },
  ], {
    hints: ["Jak jinak říct „velký“, aby se slovo neopakovalo?", "Synonyma jsou slova, která znamenají skoro totéž: velký — obrovský — veliký."],
    explanation: "Slovník synonym nabízí slova s podobným významem.",
  }),
  choice("Proč noviny vycházejí tak často?", "přinášejí nové zprávy", [
    { value: "jsou tenké", why: "Tloušťka s tím nesouvisí." },
    { value: "jsou levné", why: "Cena nevysvětluje, proč vycházejí často." },
    { value: "papír rychle žloutne", why: "Barva papíru s tím nesouvisí." },
  ], {
    hints: ["Co se ve světě děje každý den?", "Každý den se stane něco nového. Noviny o tom chtějí psát, dokud je to čerstvé."],
    explanation: "Noviny přinášejí čerstvé zprávy, proto vycházejí často.",
  }),
  choice("Kde najdeš význam neznámého českého slova?", "ve výkladovém slovníku", [
    { value: "v jízdním řádu", why: "Jízdní řád má odjezdy spojů." },
    { value: "v atlasu", why: "Atlas má mapy." },
    { value: "v kuchařce", why: "Kuchařka má recepty." },
  ], {
    hints: ["Která kniha vysvětluje slova?", "Slovník, který slova „vykládá“, ti ke každému slovu napíše, co znamená."],
    explanation: "Význam slov najdeme ve výkladovém slovníku.",
  }),
];

const L2: PracticeTask[] = [
  choice("Chceš zjistit, jak se anglicky řekne „pes“. Co použiješ?", "překladový slovník", [
    { value: "výkladový slovník češtiny", why: "Ten slovo vysvětlí česky, ale nepřeloží." },
    { value: "encyklopedii zvířat", why: "Ta píše o psech, ale nepřekládá." },
    { value: "atlas světa", why: "Atlas má mapy." },
  ], {
    hints: ["Potřebuješ slovo vysvětlit, nebo přeložit?", "Když hledáš, jak se slovo řekne v jiném jazyce, potřebuješ knihu, která spojuje dva jazyky."],
    explanation: "Na překlad slova do angličtiny použijeme překladový slovník.",
  }),
  choice("Chceš vědět, kolik obyvatel má Praha. Kde to najdeš?", "v encyklopedii", [
    { value: "ve slovníku synonym", why: "Ten nabízí slova s podobným významem." },
    { value: "v překladovém slovníku", why: "Ten překládá slova." },
    { value: "ve zpěvníku", why: "Ve zpěvníku jsou písničky." },
  ], {
    hints: ["Je počet obyvatel slovo, nebo fakt o světě?", "Fakta o městech, státech a přírodě shromažďuje kniha s hesly o světě."],
    explanation: "Počet obyvatel je fakt o městě — najdeme ho v encyklopedii.",
  }),
  choice("Chceš vědět, co se včera stalo ve vašem městě. Kam se podíváš?", "do novin", [
    { value: "do encyklopedie", why: "Encyklopedie nepíše o včerejších událostech." },
    { value: "do atlasu", why: "Atlas má mapy, ne zprávy." },
    { value: "do výkladového slovníku", why: "Slovník vysvětluje slova." },
  ], {
    hints: ["Který zdroj přináší čerstvé zprávy?", "Včerejší události najdeš v tiskovině, která vychází každý den."],
    explanation: "O včerejších událostech píšou noviny.",
  }),
  choice("Chceš zjistit, kudy vede cesta z Brna do Olomouce. Co použiješ?", "atlas nebo mapu", [
    { value: "výkladový slovník", why: "Slovník cestu neukáže." },
    { value: "encyklopedii rostlin", why: "Rostliny s cestou nesouvisí." },
    { value: "časopis o vaření", why: "V časopise o vaření cesty nejsou." },
  ], {
    hints: ["Na čem uvidíš města a silnice mezi nimi?", "Cestu z místa na místo ukáže to, co kreslí města, silnice a řeky."],
    explanation: "Cestu mezi městy ukáže atlas nebo mapa.",
  }),
  choice("Nevíš, jestli se píše „výlet“, nebo „vílet“. Co použiješ?", "pravopisný slovník", [
    { value: "atlas", why: "Atlas s pravopisem nepomůže." },
    { value: "encyklopedii zvířat", why: "Ta s pravopisem nepomůže." },
    { value: "dnešní noviny", why: "Noviny nejsou příručka pravopisu." },
  ], {
    hints: ["Která kniha řeší, jak se slova píšou?", "Na správný zápis slov je příručka, která se jmenuje podle pravopisu."],
    explanation: "Správný zápis slova ověříme v pravopisném slovníku.",
  }),
  choice("Chceš slovo „velký“ nahradit jiným, aby se neopakovalo. Kam se podíváš?", "do slovníku synonym", [
    { value: "do atlasu", why: "Atlas slova nenabízí." },
    { value: "do novin", why: "Noviny jiná slova nenabídnou." },
    { value: "do jízdního řádu", why: "Jízdní řád slova nenabízí." },
  ], {
    hints: ["Kde najdeš slova s podobným významem?", "Existuje slovník, který ke každému slovu nabízí jiná slova, která znamenají skoro totéž."],
    explanation: "Slova s podobným významem (obrovský, veliký) nabízí slovník synonym.",
  }),
  choice("Proč je dětský časopis periodikum, a kniha pohádek ne?", "časopis vychází pravidelně znovu", [
    { value: "časopis má obrázky", why: "Obrázky má i kniha pohádek." },
    { value: "kniha je delší", why: "Délka nerozhoduje." },
    { value: "časopis je levnější", why: "Cena nerozhoduje." },
  ], {
    hints: ["Kolikrát časopis vyjde a kolikrát kniha?", "Periodikum poznáš podle toho, že vychází opakovaně. Kniha vyjde jednou."],
    explanation: "Časopis vychází pravidelně znovu a znovu, kniha vyjde jednou — proto je jen časopis periodikum.",
  }),
  choice("Proč nemusíš číst celou encyklopedii, když hledáš heslo „delfín“?", "hesla jsou seřazená podle abecedy", [
    { value: "delfín je vždy na první straně", why: "Delfín bude u písmene D." },
    { value: "encyklopedie má jen jedno heslo", why: "Encyklopedie má hesel tisíce." },
    { value: "o delfínech se v ní nepíše", why: "O zvířatech encyklopedie píše." },
  ], {
    hints: ["Jak najdeš slovo v seznamu seřazeném podle písmen?", "Stačí najít první písmeno hledaného slova a v něm listovat dál."],
    explanation: "Hesla jsou seřazená podle abecedy, stačí nalistovat písmeno D.",
  }),
  choice("Jaký je rozdíl mezi encyklopedií a výkladovým slovníkem?", "encyklopedie vysvětluje věci, slovník slova", [
    { value: "je to totéž", why: "Každá kniha slouží k něčemu jinému." },
    { value: "slovník je vždy větší", why: "O velikost nejde." },
    { value: "encyklopedie nemá abecedu", why: "Encyklopedie bývá také abecední." },
  ], {
    hints: ["O čem píše encyklopedie a o čem slovník?", "Jedna kniha vypráví o věcech a jevech ve světě, druhá vysvětluje samotná slova."],
    explanation: "Encyklopedie vysvětluje věci a jevy ze světa, výkladový slovník vysvětluje význam slov.",
  }),
  choice("Co je heslo v encyklopedii?", "slovo, pod kterým se o věci píše", [
    { value: "tajné slovo k počítači", why: "To je jiný význam slova heslo." },
    { value: "nadpis celé knihy", why: "Nadpis knihy je jeden, hesel jsou tisíce." },
    { value: "jméno autora", why: "Autor heslem není." },
  ], {
    hints: ["Pod jakým slovem najdeš článek o sopkách?", "V encyklopedii je každý článek nadepsaný slovem, podle kterého ho najdeš v abecedě."],
    explanation: "Heslo je slovo, pod kterým je v encyklopedii článek o dané věci.",
  }),
  choice("Chceš zjistit zítřejší počasí. Kde ho najdeš?", "v novinách nebo ve zprávách", [
    { value: "v atlasu", why: "Atlas má mapy, ne předpověď." },
    { value: "v pravopisném slovníku", why: "Ten řeší pravopis." },
    { value: "v encyklopedii", why: "Encyklopedie nepíše, jaké bude zítra počasí." },
  ], {
    hints: ["Který zdroj přináší zprávy o tom, co bude zítra?", "Předpověď se mění každý den — najdeš ji tam, kde se zprávy obnovují denně."],
    explanation: "Předpověď počasí přinášejí noviny a zprávy, protože se mění každý den.",
  }),
  choice("V novinách je článek o včerejším zápase. Proč ho nenajdeš v encyklopedii?", "encyklopedie nepíše o denních událostech", [
    { value: "zápasy jsou tajné", why: "Zápasy tajné nejsou." },
    { value: "encyklopedie je jen o zvířatech", why: "Encyklopedie píše o mnoha oborech." },
    { value: "články se nesmí opisovat", why: "S tím to nesouvisí." },
  ], {
    hints: ["Jak často vychází encyklopedie a jak často noviny?", "Encyklopedie vyjde jednou za dlouhou dobu a zachycuje to, co platí dlouho. Včerejší zápas je čerstvá zpráva."],
    explanation: "Encyklopedie zachycuje stálé informace, ne včerejší události — ty jsou v novinách.",
  }),
  choice("Jaký zdroj je nejlepší na referát o životě tygrů?", "encyklopedie zvířat", [
    { value: "překladový slovník", why: "Ten jen překládá slova." },
    { value: "sportovní časopis", why: "Ten píše o sportu." },
    { value: "jízdní řád", why: "Ten má odjezdy spojů." },
  ], {
    hints: ["Kde najdeš, kde tygři žijí a co jedí?", "Pro referát potřebuješ fakta o zvířeti. Hledej knihu, která vysvětluje přírodu."],
    explanation: "Fakta o životě tygrů najdeme v encyklopedii zvířat.",
  }),
];

const L3: PracticeTask[] = [
  choice("Chceš zjistit, co znamená slovo „ekosystém“, a pak si přečíst víc o lese. Co použiješ?", "slovník a pak encyklopedii", [
    { value: "jen dnešní noviny", why: "Noviny slovo nevysvětlí a o lese nemusí psát." },
    { value: "jen atlas světa", why: "Atlas má mapy." },
    { value: "jen zpěvník písniček", why: "Ve zpěvníku jsou písničky." },
  ], {
    hints: ["Máš dva úkoly. Který zdroj se hodí na který?", "Na význam slova je jeden druh knihy, na fakta o přírodě jiný. Použiješ oba."],
    explanation: "Význam slova najdeme ve slovníku, podrobnosti o lese v encyklopedii.",
  }),
  choice("Proč nehledáš dnešní počasí v encyklopedii?", "obsahuje stálé informace, ne dnešní", [
    { value: "počasí není důležité", why: "Počasí důležité je." },
    { value: "encyklopedie o počasí nic neví", why: "O počasí obecně píše, ale ne o dnešním." },
    { value: "encyklopedie je příliš malá", why: "Velikost nerozhoduje." },
  ], {
    hints: ["Mění se dnešní počasí rychleji, než vyjde nová encyklopedie?", "Encyklopedie popisuje, jak věci fungují dlouhodobě. Dnešní počasí je čerstvá zpráva."],
    explanation: "Encyklopedie má stálé informace. Dnešní počasí najdeme ve zprávách.",
  }),
  choice("Kniha má tisíce hesel o přírodě, dějinách i vědě seřazených podle abecedy. Co to je?", "encyklopedie", [
    { value: "periodikum", why: "Periodikum vychází pravidelně, kniha hesel ne." },
    { value: "překladový slovník", why: "Ten překládá slova, nevysvětluje přírodu." },
    { value: "atlas", why: "Atlas má mapy." },
  ], {
    hints: ["Která kniha vysvětluje svět v heslech?", "Abecední hesla o přírodě, dějinách i vědě v jedné knize — to je typický znak jednoho druhu knihy."],
    explanation: "Abecední hesla o přírodě, dějinách a vědě má encyklopedie.",
  }),
  choice("Proč může časopis psát o tématu podrobněji než deník?", "vychází méně často a má víc času", [
    { value: "je menší", why: "Velikost nerozhoduje." },
    { value: "nemá redaktory", why: "Redaktory má." },
    { value: "píše jen o sportu", why: "Časopisy píšou o mnoha tématech." },
  ], {
    hints: ["Kolik času mají redaktoři deníku a kolik měsíčníku?", "Deník musí stihnout zprávy do zítřka. Časopis vychází třeba jednou za měsíc a redakce se tak může tématu věnovat déle."],
    explanation: "Časopis vychází méně často, takže má víc času na podrobné články.",
  }),
  choice("Máš slovník českých slov a encyklopedii států světa. Kde zjistíš, co znamená slovo „ošatka“?", "ve slovníku českých slov", [
    { value: "v encyklopedii států", why: "Ta píše o státech, ne o slovech." },
    { value: "v obou stejně", why: "Encyklopedie států slovo nevysvětlí." },
    { value: "v žádné z nich", why: "Slovník slovo vysvětlí." },
  ], {
    hints: ["Hledáš fakt o státě, nebo význam slova?", "Význam slova vysvětlí kniha, která se zabývá slovy."],
    explanation: "Význam slova „ošatka“ (košík na pečivo) najdeme ve slovníku českých slov.",
  }),
  choice("Chceš vědět, jak se anglicky řekne „strom“ a co přesně je strom podle přírodopisu. Co potřebuješ?", "překladový slovník i encyklopedii", [
    { value: "jen překladový slovník", why: "Ten slovo přeloží, ale nevysvětlí stavbu stromu." },
    { value: "jen encyklopedii", why: "Ta vysvětlí strom, ale nepřeloží." },
    { value: "jen noviny", why: "Noviny ani jedno nesplní." },
  ], {
    hints: ["Kolik máš úkolů a na co je který zdroj?", "Jeden úkol je překlad, druhý vysvětlení z přírodopisu. Každý potřebuje jiný zdroj."],
    explanation: "Na překlad je překladový slovník, na vysvětlení z přírodopisu encyklopedie.",
  }),
  choice("Proč jsou noviny periodikum, ale kniha s pěti sty stranami ne?", "noviny vycházejí znovu a znovu", [
    { value: "noviny jsou kratší", why: "Délka nerozhoduje." },
    { value: "kniha nemá obrázky", why: "Obrázky nerozhodují." },
    { value: "noviny jsou barevné", why: "Barva nerozhoduje." },
  ], {
    hints: ["Kolikrát vznikne nové vydání novin a kolikrát nové vydání knihy?", "Délka ani vzhled nerozhodují. Periodikum poznáš jen podle pravidelného vycházení."],
    explanation: "Periodikum vychází pravidelně znovu — noviny ano, kniha vyjde jednou.",
  }),
  choice("O dinosaurech najdeš informace na internetu i v encyklopedii. Proč je dobré je porovnat?", "ověřím si, že jsou pravdivé", [
    { value: "internet je vždy chybný", why: "Na internetu je i mnoho pravdivých informací." },
    { value: "encyklopedie je vždy zastaralá", why: "Nemusí být — i tak je dobré srovnávat." },
    { value: "aby byl referát delší", why: "O délku nejde." },
  ], {
    hints: ["Co když se dva zdroje neshodují?", "Když najdeš totéž ve dvou spolehlivých zdrojích, je informace spíš pravdivá. Když se liší, je potřeba hledat dál."],
    explanation: "Porovnáním zdrojů si ověříme, že informace jsou pravdivé.",
  }),
  choice("Proč vychází encyklopedie v nových vydáních?", "přibývají nové objevy a poznatky", [
    { value: "stará vydání jsou ošklivá", why: "O vzhled nejde." },
    { value: "mění se abeceda", why: "Abeceda se nemění." },
    { value: "musí být tlustší", why: "O tloušťku nejde." },
  ], {
    hints: ["Zůstává věda pořád stejná?", "Vědci stále objevují nové věci. Nové vydání encyklopedie je doplní."],
    explanation: "Přibývají nové objevy, proto encyklopedie vychází v nových, doplněných vydáních.",
  }),
  choice("Na obálce časopisu stojí „číslo 7, ročník 12“. Co to znamená?", "sedmé vydání ve dvanáctém roce vycházení", [
    { value: "časopis má sedm stran", why: "Číslo neudává počet stran." },
    { value: "časopis stojí dvanáct korun", why: "Ročník neudává cenu." },
    { value: "je pro děti od sedmi do dvanácti let", why: "Čísla neudávají věk čtenářů." },
  ], {
    hints: ["Proč periodika svá vydání číslují?", "Periodikum vychází znovu a znovu, a tak se jednotlivá vydání číslují. Ročník říká, kolikátý rok časopis vychází."],
    explanation: "Číslo 7 je sedmé vydání v roce, ročník 12 znamená dvanáctý rok, kdy časopis vychází.",
  }),
  choice("Který zdroj ti nejspíš řekne, co se stalo dnes ráno?", "dnešní zprávy", [
    { value: "encyklopedie", why: "Encyklopedie nepíše o dnešních událostech." },
    { value: "atlas", why: "Atlas má mapy." },
    { value: "výkladový slovník", why: "Slovník vysvětluje slova." },
  ], {
    hints: ["Který zdroj se obnovuje každý den?", "O tom, co se právě stalo, informují noviny, rádio nebo zpravodajství na internetu."],
    explanation: "O tom, co se stalo dnes, informují zprávy — noviny, rádio, internet.",
  }),
  choice("Heslo „Karel IV.“ hledáš v encyklopedii. U kterého písmene?", "K", [
    { value: "C", why: "C by bylo pro císař, ale heslo je jméno Karel." },
    { value: "P", why: "P by bylo pro Praha, heslo je ale Karel." },
    { value: "Č", why: "Č by bylo pro Čechy, heslo je ale Karel." },
  ], {
    hints: ["Jakým písmenem začíná jméno panovníka?", "Hesla o lidech se řadí podle jejich jména. Nerozhoduje, čím byl nebo kde vládl."],
    explanation: "Karel začíná písmenem K, proto heslo hledáme u K.",
  }),
  choice("Proč se vyplatí výkladový slovník, i když slovo znáš?", "zjistíš i jeho další významy", [
    { value: "naučíš se překládat", why: "Překlady jsou v překladovém slovníku." },
    { value: "najdeš v něm mapy", why: "Mapy jsou v atlasu." },
    { value: "dozvíš se zprávy", why: "Zprávy jsou v novinách." },
  ], {
    hints: ["Má slovo „koruna“ jen jeden význam?", "Mnoho slov má víc významů (koruna stromu, koruna krále, koruna na zaplacení). Slovník je vyjmenuje."],
    explanation: "Výkladový slovník ukáže i další významy slova, které možná neznáš.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const ENCYKLOPEDIESLOVNIKPERIODIKA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-encyklopedie-slovnik-periodika",
    rvpNodeId: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-encyklopedie-slovnik-periodika",
    displayName: "Encyklopedie a slovníky",
    title: "Encyklopedie, slovník, periodika",
    studentTitle: "Knihy a zdroje info",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Poznáš, k čemu slouží encyklopedie, slovníky, noviny a časopisy.",
    keywords: ["encyklopedie", "slovník", "periodikum", "noviny", "časopis", "atlas", "zdroj informací"],
    goals: [
      "Rozlišit encyklopedii, slovník a periodikum",
      "Vybrat vhodný zdroj informací",
    ],
    boundaries: ["Bez odborné bibliografie", "Bez citací zdrojů"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka"],
    generator: gen,
    helpTemplate: {
      hint: "Encyklopedie = věci a jevy; výkladový slovník = význam slov; překladový = jiný jazyk; periodikum = vychází pravidelně",
      steps: [
        "Co potřebuješ zjistit — fakt, význam slova, překlad, nebo dnešní zprávu?",
        "Fakt o světě → encyklopedie.",
        "Význam nebo pravopis slova → slovník.",
        "Čerstvé zprávy → noviny a časopisy (periodika).",
      ],
      commonMistake: "Hledat dnešní události v encyklopedii nebo překlad ve výkladovém slovníku",
      example: "Kolik obyvatel má Praha? → encyklopedie. Jak se anglicky řekne pes? → překladový slovník.",
    },
  },
];
