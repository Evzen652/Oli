import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Generátor vracel na všech úrovních
// tentýž seznam, převážně s jednou společnou nápovědou. Teď tři oddělené banky:
// L1 co je ilustrace a k čemu slouží · L2 který obrázek se hodí ke konkrétní
// větě · L3 najít, v čem ilustrace s textem nesouhlasí, vybrat nejdůležitější
// chvíli příběhu a náladu obrázku.

const L1: PracticeTask[] = [
  choice("Co je ilustrace ke knize?", "obrázek, který doprovází text", [
    { value: "jméno autora knihy", why: "Jméno autora obrázek není." },
    { value: "obsah na začátku knihy", why: "Obsah je seznam kapitol." },
    { value: "rejstřík na konci knihy", why: "Rejstřík je seznam slov." },
  ], { hints: ["Co v knize nečteš, ale prohlížíš si?", "Ilustrace ukazuje postavy a místa, o kterých se v knize píše."], explanation: "Ilustrace je obrázek, který doprovází text knihy." }),
  choice("Jak se jmenuje výtvarník, který kreslí obrázky do knih?", "ilustrátor", [
    { value: "tiskař", why: "Tiskař knihu tiskne." },
    { value: "spisovatel", why: "Spisovatel píše text." },
    { value: "překladatel", why: "Překladatel převádí text do jiného jazyka." },
  ], { hints: ["Od jakého slova je odvozen název té práce?", "Spisovatel píše, výtvarník kreslí — jméno jeho povolání souvisí se slovem ilustrace."], explanation: "Obrázky do knih kreslí ilustrátor." }),
  choice("V čem ilustrace pomáhá čtenáři?", "lépe si představit postavy a místa", [
    { value: "číst rychleji", why: "Na rychlost čtení obrázek vliv nemá." },
    { value: "naučit se pravopis", why: "Pravopis se z obrázků neučíme." },
    { value: "zjistit, kolik kniha stojí", why: "Cena s obrázkem nesouvisí." },
  ], { hints: ["Co ti obrázek ukáže, co si jinak musíš jen domýšlet?", "Obrázek dá tváře hrdinům a ukáže prostředí, kde se příběh odehrává."], explanation: "Ilustrace pomáhá představit si postavy a prostředí." }),
  choice("Co má ilustrace k příběhu zobrazovat?", "to, o čem text vypráví", [
    { value: "cokoli, co mě napadne", why: "Obrázek, který s textem nesouvisí, čtenáře mate." },
    { value: "jen krajinu bez postav", why: "Postavy jsou v příběhu důležité." },
    { value: "jen barevné čáry", why: "Z čar se čtenář nic nedozví." },
  ], { hints: ["Jak souvisí obrázek s příběhem?", "Ilustrace a text tvoří pár — obrázek ukazuje, co slova popisují."], explanation: "Ilustrace zobrazuje to, o čem text vypráví." }),
  choice("Co je titulní ilustrace?", "obrázek na obálce knihy", [
    { value: "poslední obrázek v knize", why: "Titulní je na začátku, na obálce." },
    { value: "fotografie autora", why: "Fotka autora není ilustrace k příběhu." },
    { value: "mapa v příloze knihy", why: "Mapa bývá uvnitř nebo vzadu." },
  ], { hints: ["Co uvidíš jako první, když vezmeš knihu do ruky?", "Titulní strana je vpředu — obrázek tam má nalákat ke čtení."], explanation: "Titulní ilustrace je obrázek na obálce knihy." }),
  choice("Proč mají knížky pro malé děti hodně obrázků?", "obrázky pomáhají textu porozumět", [
    { value: "aby byly knihy tlustší", why: "O tloušťku nejde." },
    { value: "aby byly knihy dražší", why: "O cenu nejde." },
    { value: "obrázky nahrazují čtení", why: "Obrázky čtení doplňují, nenahrazují." },
  ], { hints: ["Co pomáhá malému čtenáři, když ještě čte pomalu?", "Obrázek napoví, o čem se píše, a malý čtenář se v příběhu lépe vyzná."], explanation: "Obrázky pomáhají dětem porozumět příběhu." }),
  choice("Co uděláš dřív, než začneš kreslit ilustraci?", "pozorně si přečtu text", [
    { value: "vyberu nejhezčí pastelku", why: "Pastelka počká — nejdřív musíš vědět co kreslit." },
    { value: "nakreslím, co mě napadne", why: "Obrázek musí sedět k textu." },
    { value: "zjistím, kolik kniha stojí", why: "Cena kreslení nepomůže." },
  ], { hints: ["Jak zjistíš, co máš nakreslit?", "Bez znalosti příběhu nevíš, jak vypadají postavy ani co se děje."], explanation: "Nejdřív si pozorně přečteme text." }),
  choice("Jak vybereš scénu, kterou nakreslíš?", "vyberu nejdůležitější nebo nejzajímavější chvíli příběhu", [
    { value: "vyberu úplně náhodnou větu", why: "Náhodná věta nemusí být důležitá." },
    { value: "nakreslím všechno najednou do jednoho obrázku", why: "Obrázek by byl přeplněný." },
    { value: "nakreslím jen samotný nadpis", why: "Nadpis není scéna." },
  ], { hints: ["Která chvíle příběhu tě zaujala nejvíc?", "Dobrá ilustrace zachytí okamžik, na který si čtenář vzpomene."], explanation: "Kreslíme nejdůležitější nebo nejzajímavější chvíli příběhu." }),
  choice("Co musí na ilustraci souhlasit s textem?", "postavy, místo a děj", [
    { value: "jen barva papíru", why: "Barva papíru s textem nesouvisí." },
    { value: "jen velikost obrázku", why: "Velikost s textem nesouvisí." },
    { value: "nic, obrázek je volný", why: "Ilustrace k textu patří." },
  ], { hints: ["Kdo, kde a co — co z toho musí obrázek ukázat správně?", "Když text říká, že kotě leze na strom, obrázek nemůže ukázat psa u misky."], explanation: "S textem musí souhlasit postavy, místo i děj." }),
  choice("Podle čeho poznáš, jak má postava na obrázku vypadat?", "podle popisu v textu", [
    { value: "podle toho, co se mi líbí", why: "Postava má vypadat tak, jak ji popsal autor." },
    { value: "podle úplně jiné knihy", why: "Jiná kniha má jiné postavy." },
    { value: "podle náhody", why: "Náhoda s textem nesouvisí." },
  ], { hints: ["Kdo rozhodl, jestli má princezna zlaté, nebo černé vlasy?", "Autor v knize prozradí, jaké mají hrdinové vlasy, oblečení nebo velikost — ilustrátor ho poslechne."], explanation: "Postavu kreslíme podle popisu v textu." }),
  choice("Čím se liší ilustrace od fotografie?", "ilustraci někdo nakreslil nebo namaloval", [
    { value: "ilustrace je vždy černobílá", why: "Ilustrace bývají i barevné." },
    { value: "fotografie je vždy menší", why: "Velikost o tom nerozhoduje." },
    { value: "vůbec se neliší", why: "Fotka se vyfotí, ilustrace se kreslí." },
  ], { hints: ["Jak vznikne fotka a jak obrázek v pohádkové knize?", "Fotografii pořídí fotoaparát, kdežto obrázek vzniká rukou výtvarníka."], explanation: "Ilustrace je nakreslená nebo namalovaná, fotografie vyfocená." }),
  choice("Čím může ilustrátor kreslit?", "pastelkami, barvami, tuší i na počítači", [
    { value: "jen obyčejnou tužkou", why: "Ilustrátor může použít mnoho technik." },
    { value: "jen fixami", why: "Fixy jsou jen jedna z možností." },
    { value: "jen černou tuší", why: "Tuš je jen jedna z možností." },
  ], { hints: ["Musí mít všechny obrázky v knihách stejnou techniku?", "Výtvarník si vybere techniku, která se k příběhu hodí — ruční i digitální."], explanation: "Ilustrátor může použít pastelky, barvy, tuš i počítač." }),
  choice("Kam v knize obvykle patří ilustrace?", "blízko textu, ke kterému se vztahuje", [
    { value: "vždy až na úplný konec knihy", why: "Obrázek daleko od textu by čtenáře mátl." },
    { value: "na zadní stranu obálky", why: "Tam bývá spíš krátký popis knihy." },
    { value: "do obsahu knihy", why: "V obsahu jsou kapitoly." },
  ], { hints: ["Kdy se čtenáři obrázek hodí nejvíc?", "Obrázek pomůže nejvíc, když ho čtenář vidí zároveň s částí, o které čte."], explanation: "Ilustrace bývá u textu, ke kterému patří." }),
];

const L2: PracticeTask[] = [
  choice("Text: „Kotě lezlo na strom.“ Který obrázek se k větě hodí?", "kotě šplhající po kmeni", [
    { value: "kotě u misky s mlékem", why: "Kotě v textu leze na strom, nepije." },
    { value: "pes sedící na stromě", why: "V textu je kotě." },
    { value: "prázdný strom bez zvířat", why: "Chybí hlavní postava." },
  ], { hints: ["Kdo je ve větě a co dělá?", "Obrázek musí ukázat správnou postavu i to, co právě dělá."], explanation: "K větě patří kotě, které šplhá po stromě." }),
  choice("Text: „Karkulka šla lesem a nesla košík.“ Který obrázek se k větě hodí?", "dívka s košíkem na lesní cestě", [
    { value: "dívka doma u stolu", why: "Karkulka je v lese, ne doma." },
    { value: "vlk ležící v posteli", why: "Tato věta je o Karkulce na cestě." },
    { value: "prázdný les bez lidí", why: "Chybí hlavní postava." },
  ], { hints: ["Kde Karkulka je a co má v ruce?", "Ilustrace k jedné větě ukazuje právě to, co ta věta říká."], explanation: "K větě patří dívka s košíkem v lese." }),
  choice("Text: „Děti stavěly sněhuláka.“ Který obrázek se k větě hodí?", "děti v zimě staví sněhuláka", [
    { value: "děti se koupou v rybníku", why: "V textu je zima a sníh." },
    { value: "sněhulák na prázdné zahradě", why: "Chybí děti, které ho staví." },
    { value: "děti sedí ve třídě", why: "Děti jsou venku ve sněhu." },
  ], { hints: ["Jaké roční období to je a kdo tam je?", "Na obrázku nesmí chybět postavy ani jejich činnost."], explanation: "K větě patří děti, které staví sněhuláka." }),
  choice("Text: „Dědeček chytal ryby u rybníka.“ Který obrázek se k větě hodí?", "dědeček s udicí u vody", [
    { value: "dědeček v obchodě s rybami", why: "Dědeček ryby chytá, nekupuje." },
    { value: "ryby v akváriu", why: "Chybí dědeček i rybník." },
    { value: "babička u rybníka", why: "V textu je dědeček." },
  ], { hints: ["Kdo ryby chytá a kde?", "Postava, místo i činnost musí na obrázku odpovídat větě."], explanation: "K větě patří dědeček s udicí u vody." }),
  choice("Text: „V noci svítil na nebi měsíc a hvězdy.“ Který obrázek se k větě hodí?", "tmavé nebe s měsícem a hvězdami", [
    { value: "slunce nad loukou", why: "V textu je noc." },
    { value: "déšť a husté mraky", why: "Přes mraky by hvězdy nesvítily." },
    { value: "duha po bouřce", why: "Duha je ve dne." },
  ], { hints: ["Je to ve dne, nebo v noci?", "Denní doba a počasí na obrázku musí sedět s textem."], explanation: "K větě patří noční nebe s měsícem a hvězdami." }),
  choice("Text: „Vlaštovky na podzim odlétají na jih.“ Který obrázek se k větě hodí?", "hejno vlaštovek letí nad podzimní krajinou", [
    { value: "vlaštovky staví hnízdo na jaře", why: "V textu je podzim a odlet." },
    { value: "vrabec na krmítku v zimě", why: "V textu jsou vlaštovky." },
    { value: "vlaštovky zavřené v kleci", why: "Vlaštovky v textu odlétají." },
  ], { hints: ["Jaké je roční období a co ptáci dělají?", "Zkontroluj ptáky, roční období i činnost."], explanation: "K větě patří vlaštovky, které letí nad podzimní krajinou." }),
  choice("Text: „Maminka upekla k narozeninám dort se svíčkami.“ Který obrázek se k větě hodí?", "dort se zapálenými svíčkami", [
    { value: "chléb na prkénku", why: "V textu je narozeninový dort." },
    { value: "maminka nakupuje v obchodě", why: "V textu maminka peče." },
    { value: "hromada dárků bez dortu", why: "Chybí to hlavní — dort." },
  ], { hints: ["Co je v té větě to nejdůležitější?", "Obrázek má ukázat hlavní věc z věty."], explanation: "K větě patří narozeninový dort se svíčkami." }),
  choice("Text: „Pejsek a kočička myli podlahu.“ Který obrázek se k větě hodí?", "pejsek a kočička drhnou podlahu", [
    { value: "pejsek spí v boudě", why: "Chybí kočička i mytí." },
    { value: "kočička chytá myš", why: "Chybí pejsek i mytí." },
    { value: "děti uklízí pokoj", why: "V textu jsou pejsek a kočička." },
  ], { hints: ["Kolik postav je ve větě a co dělají?", "Na obrázku musí být obě postavy a jejich společná práce."], explanation: "K větě patří pejsek s kočičkou při mytí podlahy." }),
  choice("Text: „Na louce kvetly vlčí máky.“ Který obrázek se k větě hodí?", "louka s červenými květy", [
    { value: "zasněžená louka", why: "Máky v zimě nekvetou." },
    { value: "les plný hub", why: "V textu je louka s máky." },
    { value: "pole se žlutou řepkou", why: "Máky jsou červené." },
  ], { hints: ["Jakou barvu mají vlčí máky?", "Barvy na obrázku musí odpovídat tomu, co v textu roste."], explanation: "Vlčí máky jsou červené — k větě patří louka s červenými květy." }),
  choice("Text: „Honza se ztratil v lese a plakal.“ Který obrázek se k větě hodí?", "smutný chlapec sám mezi stromy", [
    { value: "veselý chlapec na hřišti", why: "Honza je smutný a v lese." },
    { value: "chlapec doma v posteli", why: "Honza je v lese." },
    { value: "les, kde nikdo není", why: "Chybí Honza." },
  ], { hints: ["Jak se Honza cítí a kde je?", "Ilustrace zachytí i náladu postavy, nejen místo."], explanation: "K větě patří smutný chlapec sám v lese." }),
  choice("Text: „Na hradě žil starý král s bílým vousem.“ Který obrázek se k větě hodí?", "šedivý král s dlouhým vousem na hradě", [
    { value: "mladý král bez vousů", why: "Král je starý a má vous." },
    { value: "rytíř na koni", why: "V textu je král." },
    { value: "hrad, v němž nikdo není", why: "Chybí král." },
  ], { hints: ["Jak král vypadá podle textu?", "Každý detail z popisu postavy musí být na obrázku vidět."], explanation: "K větě patří starý král s bílým vousem." }),
  choice("Text: „Ježek nesl na zádech jablko.“ Který obrázek se k větě hodí?", "ježek s jablkem napíchnutým na bodlinách", [
    { value: "ježek spí v listí", why: "Ježek v textu nese jablko." },
    { value: "jablko visí na stromě", why: "Chybí ježek." },
    { value: "veverka s oříškem", why: "V textu je ježek." },
  ], { hints: ["Kdo co nese a kde to má?", "Obrázek má ukázat postavu i předmět přesně tak, jak to říká věta."], explanation: "K větě patří ježek s jablkem na zádech." }),
  choice("Text: „Na nádraží přijel dlouhý vlak.“ Který obrázek se k větě hodí?", "vagony za lokomotivou u nástupiště", [
    { value: "autobus na zastávce", why: "V textu je vlak." },
    { value: "prázdné koleje", why: "Vlak přijel — musí tam být." },
    { value: "letadlo na letišti", why: "V textu je nádraží a vlak." },
  ], { hints: ["Co přijelo a kam?", "Místo i dopravní prostředek musí souhlasit s větou."], explanation: "K větě patří vlak na nádraží." }),
];

const L3: PracticeTask[] = [
  choice("Text: „Myška našla v poli klas. Nesla ho domů, ale cestou ji uviděla sova. Myška se rychle schovala do díry.“ Která chvíle je pro ilustraci nejnapínavější?", "sova letí nad myškou, která utíká k díře", [
    { value: "myška stojí v poli u klasu", why: "To je klidný začátek, napětí přijde až potom." },
    { value: "prázdné pole bez zvířat", why: "Chybí postavy i děj." },
    { value: "sova spí na stromě", why: "V příběhu sova myšku honí." },
  ], { hints: ["Kdy se čtenář o myšku nejvíc bojí?", "Nejnapínavější chvíle je ta, kdy hrozí nebezpečí a nevíme, jak to dopadne."], explanation: "Nejvíc napětí má chvíle, kdy sova myšku honí." }),
  choice("Text: „Honza si v zimě oblékl bundu a šel sáňkovat.“ Na ilustraci je chlapec v kraťasech na pláži. Co je špatně?", "roční období a oblečení nesedí s textem", [
    { value: "chlapec je nakreslený moc malý", why: "Velikost není ta hlavní chyba." },
    { value: "chybí nadpis", why: "Ilustrace nadpis nepotřebuje." },
    { value: "nic, obrázek sedí", why: "V textu je zima a sáně." },
  ], { hints: ["Kdy se v textu jezdí na sáňkách?", "Porovnej počasí, místo a oblečení na obrázku s tím, co říká věta."], explanation: "V textu je zima a bunda, na obrázku léto a pláž." }),
  choice("Text: „Babička měla červený šátek.“ Na ilustraci má babička modrý šátek. Co ilustrátor přehlédl?", "barvu šátku", [
    { value: "babiččin věk", why: "Věk v textu není." },
    { value: "velikost obrázku", why: "Velikost s textem nesouvisí." },
    { value: "babiččino jméno", why: "Jméno se nekreslí." },
  ], { hints: ["Který údaj o babičce text přesně uvádí?", "Porovnej každý detail z věty s obrázkem — co se liší?"], explanation: "Text říká červený, obrázek ukazuje modrý." }),
  choice("Text: „Tři kůzlátka se schovala před vlkem.“ Na obrázku jsou dvě kůzlátka. Co je špatně?", "počet kůzlátek", [
    { value: "barva vlka", why: "O barvě vlka text nic neříká." },
    { value: "to, že je obrázek barevný", why: "Barevnost není chyba." },
    { value: "nic, obrázek sedí", why: "V textu jsou tři kůzlátka." },
  ], { hints: ["Kolik zvířátek text uvádí?", "Spočítej postavy na obrázku a porovnej je s číslem ve větě."], explanation: "Text uvádí tři kůzlátka, obrázek jen dvě." }),
  choice("Máš jen jednu stránku na ilustraci celé pohádky O Budulínkovi. Co nakreslíš?", "lišku, jak odnáší Budulínka", [
    { value: "babiččin dům, v němž nikdo není", why: "Chybí postavy i děj." },
    { value: "Budulínka, jak si čistí zuby", why: "To se v pohádce neděje." },
    { value: "dědečka při práci na poli", why: "To není hlavní chvíle pohádky." },
  ], { hints: ["Která chvíle pohádky je nejdůležitější?", "Jeden obrázek za celou pohádku má ukázat její zlom — to, co všechno změní."], explanation: "Nejdůležitější je chvíle, kdy liška odnáší Budulínka." }),
  choice("Jaký obrázek se hodí na pozvánku na školní karneval?", "děti v maskách a kostýmech", [
    { value: "děti píší diktát", why: "Diktát s karnevalem nesouvisí." },
    { value: "zimní les bez lidí", why: "S karnevalem nesouvisí." },
    { value: "prázdná třída", why: "Nic neříká o karnevalu." },
  ], { hints: ["Co se na karnevalu nosí?", "Obrázek na pozvánce má na první pohled prozradit, na jakou akci zveme."], explanation: "Ke karnevalu patří děti v maskách." }),
  choice("Kreslíš obrázek k básni o dešti. Jaké barvy zvolíš?", "šedé mraky a modré kapky", [
    { value: "zářivě žluté slunce", why: "Při dešti slunce obvykle nesvítí." },
    { value: "oranžové listí a sluníčko", why: "Sluníčko k dešti nepatří." },
    { value: "růžová srdíčka", why: "Srdíčka s deštěm nesouvisí." },
  ], { hints: ["Jak vypadá obloha, když prší?", "Barvy mají odpovídat počasí a náladě básně."], explanation: "K dešti se hodí šedá a modrá — mraky a kapky." }),
  choice("Text: „Byla tma a les šuměl. Karel se bál.“ Jakou náladu má mít ilustrace?", "tajemnou a strašidelnou", [
    { value: "veselou a slunečnou", why: "V textu je tma a strach." },
    { value: "slavnostní a vánoční", why: "O svátcích text nemluví." },
    { value: "sportovní a rychlou", why: "Nic takového v textu není." },
  ], { hints: ["Jak se Karel cítí?", "Barvy i světlo na obrázku mají vyjádřit pocit postavy."], explanation: "Tma a strach — obrázek má být tajemný a strašidelný." }),
  choice("Text: „Pes Alík je malý, hnědý a má bílou skvrnu na uchu.“ Která ilustrace je přesná?", "malý hnědý pes s bílou skvrnou na uchu", [
    { value: "velký černý pes", why: "Alík je malý a hnědý." },
    { value: "malý hnědý pes bez skvrny", why: "Chybí bílá skvrna." },
    { value: "malá hnědá kočka se skvrnou", why: "Alík je pes." },
  ], { hints: ["Kolik údajů o Alíkovi text uvádí?", "Ilustrace je přesná, jen když sedí všechny údaje zároveň."], explanation: "Přesná je jen ilustrace, kde sedí velikost, barva i skvrna." }),
  choice("Proč ilustrátor čte celou knihu, i když kreslí jen jeden obrázek?", "aby obrázek odpovídal ději a postavám", [
    { value: "aby věděl, kolik kniha stojí", why: "Cena kreslení nepomůže." },
    { value: "aby kreslil rychleji", why: "Čtení kreslení nezrychlí." },
    { value: "knihu vůbec číst nemusí", why: "Bez čtení by nevěděl, co kreslit." },
  ], { hints: ["Mohl by nakreslit správně hrdinu, o kterém nic neví?", "Postavy a události popsané v knize musí ilustrátor znát, aby je nakreslil věrně."], explanation: "Ilustrátor musí znát děj i postavy." }),
  choice("Chceš ukázat, jak se příběh postupně vyvíjel. Co nakreslíš?", "řadu obrázků za sebou", [
    { value: "jeden jediný obrázek", why: "Jeden obrázek ukáže jen jednu chvíli." },
    { value: "jen nadpis příběhu", why: "Nadpis vývoj neukáže." },
    { value: "portrét autora", why: "Portrét děj neukáže." },
  ], { hints: ["Kolik chvil příběhu chceš ukázat?", "Když má obrázek zachytit, co bylo dřív a co potom, potřebuješ víc okének."], explanation: "Postup děje ukáže řada obrázků — třeba komiks." }),
  choice("Text: „Vrána seděla na větvi a v zobáku držela sýr. Pod stromem čekala liška.“ Na obrázku drží sýr liška. Co je špatně?", "kdo drží sýr", [
    { value: "barva lišky", why: "O barvě lišky text nic neříká." },
    { value: "druh stromu", why: "Strom text nepopisuje." },
    { value: "nic, obrázek sedí", why: "V textu má sýr vrána." },
  ], { hints: ["Kdo má podle textu sýr?", "Zkontroluj, jestli si postavy na obrázku neprohodily role."], explanation: "Sýr drží vrána, ne liška." }),
  choice("Máš ilustrovat recept na palačinky. Co nakreslíš?", "jednotlivé kroky přípravy", [
    { value: "portrét kuchaře", why: "Portrét nepomůže palačinky upéct." },
    { value: "lampu v kuchyni", why: "Lampa s receptem nesouvisí." },
    { value: "zimní krajinu", why: "S receptem nesouvisí." },
  ], { hints: ["Co potřebuje ten, kdo podle receptu vaří?", "U návodu obrázky ukazují postup — co se dělá nejdřív a co potom."], explanation: "K receptu kreslíme jednotlivé kroky přípravy." }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3);
}

export const VLASTNIVYTVARNY: TopicMetadata[] = [
  {
    id: "g3-cjl-vlastni-vytvarny-doprovod",
    rvpNodeId: "g3-cjl-literarni-vychova-prace-s-textem-vlastni-vytvarny-doprovod-k-textu",
    title: "Vlastní výtvarný doprovod k textu",
    studentTitle: "Kreslím k příběhu",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s textem",
    briefDescription: "Naučíš se vytvořit ilustraci, která odpovídá obsahu textu.",
    keywords: ["ilustrace", "obrázek k textu", "výtvarný doprovod", "ilustrátor", "scéna z příběhu"],
    goals: ["Vybrat vhodnou scénu pro ilustraci.", "Nakreslit ilustraci odpovídající textu.", "Pochopit vztah textu a obrázku."],
    boundaries: ["Základní ilustrace k literárnímu textu."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Ilustrace = obrázek k textu. Nakresli to, co text popisuje — nejdůležitější scénu.",
      steps: ["Přečti text.", "Vyber nejzajímavější moment.", "Nakresli ho — postavy, prostředí, děj.", "Zkontroluj: souhlasí obrázek s textem?"],
      commonMistake: "Kreslení něčeho, co v textu není — ilustrace musí odpovídat příběhu.",
      example: "Text: 'Kotě lezlo na strom.' → Ilustrace: kotě na stromě (ne kotě u misky s jídlem).",
    },
  },
];
