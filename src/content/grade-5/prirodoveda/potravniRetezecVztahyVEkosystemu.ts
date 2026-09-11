import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a zpětné vazby. Teď: L1 producenti, konzumenti, rozkladači
// a jednoduché řetězce · L2 vztahy (predace, parazitismus, symbióza) a co se
// stane, když ubude článek · L3 důsledky zásahů do potravních vztahů.
// Řetězce se v možnostech píšou s čárkami — šipky audit považuje za meta-text.

const L1: PracticeTask[] = [
  choice("Kdo je v potravním řetězci producent?", "rostlina", [
    { value: "liška", why: "Liška loví jiné živočichy — je konzument." },
    { value: "zajíc", why: "Zajíc jí rostliny — je konzument." },
    { value: "hřib", why: "Hřib rozkládá zbytky — je rozkladač." },
  ], {
    hints: ["Kdo si potravu vyrábí sám ze světla?", "Producent vyrábí živiny ze slunečního světla, vody a vzduchu; má k tomu zelené barvivo."],
    explanation: "Producenti jsou rostliny — potravu si vyrábějí ze světla.",
  }),
  choice("Co ukazuje potravní řetězec?", "kdo je potravou pro koho", [
    { value: "jak jsou živočichové velcí", why: "Velikost řetězec neukazuje." },
    { value: "kde živočichové bydlí", why: "Místo, kde žijí, řetězec neukazuje." },
    { value: "kolik je v lese stromů", why: "Počet stromů řetězec neukazuje." },
  ], {
    hints: ["Co znamená šipka mezi trávou a zajícem?", "Šipka vede od toho, kdo je snězen, k tomu, kdo ho sní: tráva, zajíc, liška."],
    explanation: "Potravní řetězec ukazuje, kdo se kým živí.",
  }),
  choice("Kdo patří na konec řetězce: tráva – zajíc – …?", "liška", [
    { value: "mrkev", why: "Mrkev je rostlina — patří na začátek." },
    { value: "hřib", why: "Hřib je rozkladač." },
    { value: "motýl", why: "Motýl zajíce neloví." },
  ], {
    hints: ["Kdo loví zajíce?", "Na konci řetězce je masožravá šelma s ryšavým kožichem a huňatým ocasem."],
    explanation: "Zajíce loví liška: tráva, zajíc, liška.",
  }),
  choice("Kdo patří na začátek řetězce: … – housenka – sýkora?", "list", [
    { value: "jestřáb", why: "Jestřáb loví ptáky — patří na konec." },
    { value: "žížala", why: "Žížala housenky nekrmí." },
    { value: "kámen", why: "Kámen není potrava." },
  ], {
    hints: ["Čím se živí housenka?", "Na začátku řetězce je vždy rostlina nebo její část, kterou housenka okusuje."],
    explanation: "Housenka jí listy a sýkora housenky: list, housenka, sýkora.",
  }),
  choice("Kdo je rozkladač?", "houba", [
    { value: "srnec", why: "Srnec jí rostliny — je konzument." },
    { value: "dub", why: "Dub si potravu vyrábí — je producent." },
    { value: "vlk", why: "Vlk loví — je konzument." },
  ], {
    hints: ["Kdo mění spadané listí a mrtvá těla zpět na živiny?", "Rozkladači nemají zelené barvivo a rostou třeba na tlejícím dřevě nebo v lesní hrabance."],
    explanation: "Houby rozkládají odumřelé zbytky na živiny.",
  }),
  choice("Čím se živí býložravec?", "rostlinami", [
    { value: "jinými živočichy", why: "Tak se živí masožravec." },
    { value: "jen houbami", why: "Býložravci jedí hlavně rostliny." },
    { value: "kamením", why: "Kamení není potrava." },
  ], {
    hints: ["Co jí kráva, srnec nebo zajíc?", "Býložravci spásají trávu, okusují listy a výhonky; masožravci loví živočichy."],
    explanation: "Býložravec se živí rostlinami.",
  }),
  choice("Který živočich je masožravec?", "vlk", [
    { value: "srnec", why: "Srnec jí rostliny." },
    { value: "zajíc", why: "Zajíc jí rostliny." },
    { value: "kráva", why: "Kráva spásá trávu." },
  ], {
    hints: ["Který z nich loví jiná zvířata?", "Masožravci mají ostré zuby a drápy; ostatní tři se živí rostlinami."],
    explanation: "Vlk loví jiné živočichy — je masožravec.",
  }),
  choice("Který živočich je všežravec?", "divoké prase", [
    { value: "srnec", why: "Srnec jí jen rostliny." },
    { value: "rys", why: "Rys loví živočichy." },
    { value: "housenka", why: "Housenka jí listy." },
  ], {
    hints: ["Kdo jí rostliny i živočichy?", "Tento živočich vyryje ze země kořínky i žížaly a sní žaludy stejně jako myš."],
    explanation: "Divoké prase jí rostliny i živočichy — je všežravec.",
  }),
  choice("Čím začíná každý potravní řetězec?", "rostlinou nebo řasou", [
    { value: "velkou šelmou", why: "Šelma je na konci řetězce." },
    { value: "houbou nebo plísní", why: "Houby jsou rozkladači." },
    { value: "člověkem, který loví", why: "Člověk je konzument." },
  ], {
    hints: ["Kdo si jako jediný dokáže potravu vyrobit?", "Bez organismů, které vyrábějí živiny ze světla, by ostatní neměli co jíst."],
    explanation: "Každý řetězec začíná producentem — rostlinou nebo řasou.",
  }),
  choice("Odkud rostliny berou energii na růst?", "ze slunečního světla", [
    { value: "z jiných rostlin", why: "Rostliny jiné rostliny nejedí." },
    { value: "z hmyzu", why: "Až na výjimky rostliny hmyz nejedí." },
    { value: "ze tmy", why: "Ve tmě rostliny živiny nevyrobí." },
  ], {
    hints: ["Proč pokojové květiny rostou u okna lépe?", "Zelené listy zachytí světlo a vyrobí z vody a vzduchu cukry — tomu se říká fotosyntéza."],
    explanation: "Rostliny získávají energii ze slunečního světla fotosyntézou.",
  }),
  choice("Který organismus je konzument?", "zajíc", [
    { value: "dub", why: "Dub si potravu vyrábí — je producent." },
    { value: "hřib", why: "Hřib rozkládá zbytky — je rozkladač." },
    { value: "mech", why: "Mech si potravu vyrábí — je producent." },
  ], {
    hints: ["Konzument potravu nevyrábí, ale sní.", "Dub a mech si živiny vyrábějí a hřib rozkládá — konzument je tu jen jeden."],
    explanation: "Zajíc potravu sní — je konzument.",
  }),
  choice("Proč jsou rozkladači v přírodě důležití?", "mění mrtvé zbytky zpět na živiny", [
    { value: "loví škodlivé šelmy", why: "Rozkladači nic neloví." },
    { value: "vyrábějí kyslík ze světla", why: "To dělají rostliny." },
    { value: "opylují květy", why: "Opylují hlavně včely a jiný hmyz." },
  ], {
    hints: ["Co by se stalo se spadaným listím bez rozkladačů?", "Z listí a mrtvých těl by se v lese vršily hromady; rozkladači z nich udělají humus, ze kterého rostou nové rostliny."],
    explanation: "Rozkladači vracejí živiny z mrtvých zbytků zpět do půdy.",
  }),
  choice("Kdo je producent v rybníce?", "řasy", [
    { value: "kapr", why: "Kapr jí drobné živočichy — je konzument." },
    { value: "štika", why: "Štika loví ryby — je konzument." },
    { value: "volavka", why: "Volavka loví ryby a žáby — je konzument." },
  ], {
    hints: ["Kdo v rybníce vyrábí potravu ze světla?", "Drobné zelené organismy v létě barví vodu dozelena; živí se jimi plankton a jím ryby."],
    explanation: "V rybníce jsou producenty řasy a vodní rostliny.",
  }),
];

const L2: PracticeTask[] = [
  choice("Kdo chybí v řetězci: řasy – perloočky – … – štika?", "plotice", [
    { value: "volavka", why: "Volavka loví ryby, patřila by až za štiku." },
    { value: "rákos", why: "Rákos je rostlina — patří na začátek." },
    { value: "vydra", why: "Vydra loví ryby, patřila by až na konec." },
  ], {
    hints: ["Čím se živí štika a co jedí perloočky?", "Štika loví menší ryby; malá stříbrná rybka se zase živí drobnými korýši, jako jsou perloočky."],
    explanation: "Plotice jí perloočky a štika plotice: řasy, perloočky, plotice, štika.",
  }),
  choice("Co se stane s počtem zajíců, když z lesa zmizí lišky?", "zajíců přibude", [
    { value: "zajíců ubude", why: "Lovec zmizel, zajíci přežijí spíš." },
    { value: "nic se nezmění", why: "Úbytek lovce se na kořisti projeví." },
    { value: "zajíci vymřou", why: "Zajícům chybí jen lovec, ne potrava." },
  ], {
    hints: ["Kdo zajíce loví?", "Když chybí predátor, přežije víc zajíců a mají víc mláďat."],
    explanation: "Bez lišek přežije víc zajíců, a jejich počet vzroste.",
  }),
  choice("Co se stane s trávou, když se přemnoží zajíci?", "trávy ubude", [
    { value: "trávy přibude", why: "Víc zajíců spase víc trávy." },
    { value: "tráva zezelená", why: "Barva se nezmění." },
    { value: "nic se nestane", why: "Víc býložravců sní víc rostlin." },
  ], {
    hints: ["Čím se zajíci živí?", "Víc zajíců spase víc rostlin a tráva nestihne dorůst."],
    explanation: "Přemnožení býložravci spasou víc rostlin, a tak jich ubude.",
  }),
  choice("Co je predace?", "jeden živočich loví a jí druhého", [
    { value: "dva organismy si navzájem pomáhají", why: "To je symbióza." },
    { value: "parazit žije na úkor hostitele", why: "To je parazitismus." },
    { value: "rozklad mrtvých zbytků", why: "To dělají rozkladači." },
  ], {
    hints: ["Co dělá sova, když chytí myš?", "Predátor je lovec a kořist ten, kdo je uloven."],
    explanation: "Predace je vztah lovce a kořisti.",
  }),
  choice("Co je parazitismus?", "jeden žije na úkor druhého a škodí mu", [
    { value: "dva organismy si navzájem pomáhají", why: "To je symbióza." },
    { value: "jeden živočich loví druhého", why: "To je predace." },
    { value: "rozklad mrtvých těl", why: "To dělají rozkladači." },
  ], {
    hints: ["Co dělá klíště na psovi?", "Klíště saje krev a psovi škodí, ale nezabije ho hned — potřebuje ho, aby se mohlo živit."],
    explanation: "Parazit žije na hostiteli nebo v něm a škodí mu, třeba klíště nebo tasemnice.",
  }),
  choice("Který živočich je parazit?", "klíště", [
    { value: "včela", why: "Včela opyluje květy." },
    { value: "slunéčko", why: "Slunéčko loví mšice." },
    { value: "žížala", why: "Žížala rozkládá zbytky rostlin." },
  ], {
    hints: ["Který z nich saje krev jiných živočichů?", "Tento drobný pavoukovec se přisaje na kůži a může přenést nemoc."],
    explanation: "Klíště saje krev hostitele — je to parazit.",
  }),
  choice("Co je symbióza?", "soužití, ze kterého mají užitek oba", [
    { value: "lov kořisti", why: "To je predace." },
    { value: "soužití, při kterém jeden škodí druhému", why: "To je parazitismus." },
    { value: "rozklad listí", why: "To dělají rozkladači." },
  ], {
    hints: ["Jak si pomáhají včela a květ?", "Včela dostane nektar a květ je opylený — obě strany mají prospěch."],
    explanation: "Symbióza je soužití, ze kterého mají prospěch obě strany.",
  }),
  choice("Který příklad je symbióza?", "houba a strom si vyměňují živiny", [
    { value: "liška loví zajíce", why: "To je predace." },
    { value: "klíště saje krev psa", why: "To je parazitismus." },
    { value: "plíseň rozkládá chléb", why: "To je rozklad." },
  ], {
    hints: ["Ve kterém příkladu mají užitek obě strany?", "Houbová vlákna obalí kořeny; hřib dostane cukr a dub vodu a minerály."],
    explanation: "Houba a strom si pomáhají: strom dává cukry, houba vodu a minerály.",
  }),
  choice("Který příklad je predace?", "sova loví myš", [
    { value: "včela opyluje květ", why: "To je vzájemná pomoc." },
    { value: "tasemnice žije ve střevě", why: "To je parazitismus." },
    { value: "plíseň rozkládá chléb", why: "To je rozklad." },
  ], {
    hints: ["Ve kterém příkladu jeden živočich uloví druhého?", "Predátor je lovec; hledej dvojici lovce a kořisti."],
    explanation: "Sova uloví myš — to je predace.",
  }),
  choice("Kdo chybí v řetězci: žalud – … – liška?", "myš", [
    { value: "dub", why: "Dub je producent — patřil by na začátek." },
    { value: "sokol", why: "Sokol lišce za potravu neslouží." },
    { value: "hřib", why: "Hřib je rozkladač." },
  ], {
    hints: ["Kdo jí žaludy a sám je potravou lišky?", "Malý hlodavec si dělá ze žaludů zásoby na zimu a liška ho ráda uloví."],
    explanation: "Myš jí žaludy a liška myši: žalud, myš, liška.",
  }),
  choice("Jak se jmenují organismy, které si potravu vyrábějí samy?", "producenti", [
    { value: "konzumenti", why: "Konzumenti potravu jedí." },
    { value: "rozkladači", why: "Rozkladači rozkládají zbytky." },
    { value: "predátoři", why: "Predátoři loví." },
  ], {
    hints: ["Rostliny si potravu vyrábějí ze světla. Jak jim v řetězci říkáme?", "Slovo pochází z latiny a znamená výrobci — ti, kdo něco vytvářejí."],
    explanation: "Organismy, které si potravu vyrábějí, jsou producenti.",
  }),
  choice("Kdo patří mezi rozkladače?", "žížala", [
    { value: "srnec", why: "Srnec jí rostliny." },
    { value: "káně", why: "Káně loví myši." },
    { value: "jetel", why: "Jetel je rostlina — producent." },
  ], {
    hints: ["Kdo požírá spadané listí a mění ho na hlínu?", "Tento živočich žije v půdě, nemá nohy a po dešti leze na povrch."],
    explanation: "Žížala zpracovává odumřelé listí na humus.",
  }),
  choice("Proč je v lese víc srnců než vlků?", "vlk potřebuje ulovit mnoho srnců", [
    { value: "vlci jsou chránění", why: "Ochrana počet kořisti nevysvětlí." },
    { value: "srnci jsou větší", why: "Velikost to nevysvětlí." },
    { value: "vlci neumějí lovit", why: "Vlci jsou výborní lovci." },
  ], {
    hints: ["Kolik srnců za rok spotřebuje jedna smečka?", "Na konci řetězce je vždy méně živočichů, protože každý dravec sní za život velké množství kořisti."],
    explanation: "Jeden dravec se uživí jen z mnoha kusů kořisti, proto je dravců méně.",
  }),
];

const L3: PracticeTask[] = [
  choice("Zemědělec postříkal pole jedem proti hmyzu. Co se může stát ptákům, kteří hmyz jedí?", "ubude jim potravy a mohou se otrávit", [
    { value: "budou mít víc potravy", why: "Hmyzu ubude, ne přibude." },
    { value: "nic se jim nestane", why: "Úbytek hmyzu i jed se na ptácích projeví." },
    { value: "začnou jíst obilí a zesílí", why: "Hmyzožraví ptáci obilím hmyz nenahradí." },
  ], {
    hints: ["Co zbude ptákům k jídlu po postřiku?", "Jed zabije hmyz; kdo sní otráveného brouka, přijme i jed."],
    explanation: "Postřik ptákům ubere potravu a jed se k nim dostane přes hmyz.",
  }),
  choice("V lese zmizeli všichni vlci a rysové. Co se stane s mladými stromky?", "přemnožení srnci je okusují", [
    { value: "stromky porostou lépe", why: "Víc srnců spase víc stromků." },
    { value: "nic se nestane", why: "Chybějící predátoři se projeví." },
    { value: "přibude stromků, protože srnců ubude", why: "Bez predátorů srnců přibude." },
  ], {
    hints: ["Kdo loví srnce a co srnci jedí?", "Bez predátorů se srnců přemnoží a spasou výhonky mladých stromků."],
    explanation: "Bez šelem se srnci přemnoží a okusují mladé stromky.",
  }),
  choice("Jak by vypadal les bez rozkladačů?", "hromadilo by se listí a mrtvá těla", [
    { value: "les by byl čistší", why: "Bez rozkladačů by se zbytky hromadily." },
    { value: "stromy by rostly rychleji", why: "Stromům by chyběly živiny z rozkladu." },
    { value: "nic by se nezměnilo", why: "Rozkladači jsou pro les nezbytní." },
  ], {
    hints: ["Kdo v lese uklízí spadané listí?", "Houby, bakterie a žížaly mění odumřelé zbytky na hlínu; bez nich by zůstaly ležet."],
    explanation: "Bez rozkladačů by se zbytky hromadily a půdě by chyběly živiny.",
  }),
  choice("Který řetězec je sestavený správně?", "tráva, kobylka, žába, čáp", [
    { value: "čáp, žába, kobylka, tráva", why: "Řetězec začíná rostlinou, ne dravcem." },
    { value: "kobylka, tráva, žába, čáp", why: "Na začátku musí být rostlina." },
    { value: "tráva, žába, kobylka, čáp", why: "Žába jí kobylky, ne naopak." },
  ], {
    hints: ["Čím řetězec začíná?", "Na začátku je rostlina, pak býložravec a po něm ti, kdo loví — od menšího lovce k většímu."],
    explanation: "Kobylka jí trávu, žába kobylky a čáp žáby.",
  }),
  choice("Je člověk v potravním řetězci konzument?", "ano, jí rostliny i živočichy", [
    { value: "ne, je to producent", why: "Člověk si potravu ze světla nevyrábí." },
    { value: "ne, je to rozkladač", why: "Člověk nerozkládá mrtvé zbytky." },
    { value: "ne, do řetězce vůbec nepatří", why: "Člověk se živí rostlinami i živočichy." },
  ], {
    hints: ["Umí si člověk vyrobit potravu ze světla?", "Člověk potravu nevyrábí ani nerozkládá; sní zeleninu i maso, je tedy všežravec."],
    explanation: "Člověk je konzument — všežravec.",
  }),
  choice("Mšice sají šťávu z růže a slunéčka jedí mšice. Jakou roli má slunéčko?", "je predátor mšic", [
    { value: "je producent", why: "Producent je růže." },
    { value: "je parazit růže", why: "Na růži parazitují mšice." },
    { value: "je rozkladač", why: "Slunéčko loví živé mšice." },
  ], {
    hints: ["Kdo tu koho jí?", "Slunéčko loví živé mšice — v řetězci růže, mšice, slunéčko je až na konci."],
    explanation: "Slunéčko je predátor — loví mšice.",
  }),
  choice("Proč lišejník vydrží i na holé skále?", "houba a řasa si navzájem pomáhají", [
    { value: "je to druh kamene", why: "Lišejník je živý organismus." },
    { value: "nepotřebuje světlo ani vodu", why: "Světlo i vodu potřebuje." },
    { value: "živí se kamením", why: "Kamení není potrava." },
  ], {
    hints: ["Z čeho se lišejník skládá?", "Jedna jeho část drží vodu a dává úkryt, druhá vyrábí ze světla živiny — žijí spolu."],
    explanation: "Lišejník je soužití houby a řasy, které si navzájem pomáhají.",
  }),
  choice("Mravenci chrání mšice a sbírají jejich sladkou šťávu. Jaký je to vztah?", "soužití s užitkem pro obě strany", [
    { value: "predace — mravenci mšice loví", why: "Mravenci mšice nejedí, ale chrání." },
    { value: "parazitismus — mšice mravencům škodí", why: "Mšice mravencům neškodí." },
    { value: "rozklad — mravenci mšice rozkládají", why: "Mšice jsou živé." },
  ], {
    hints: ["Co z toho mají mravenci a co mšice?", "Mravenci dostanou sladkou potravu a mšice ochranu před slunéčky — škodu nemá nikdo z nich."],
    explanation: "Mravenci i mšice mají ze soužití prospěch.",
  }),
  choice("V rybníce se přemnožily štiky. Co se stane?", "ubude menších ryb", [
    { value: "přibude menších ryb", why: "Víc lovců sní víc kořisti." },
    { value: "štiky začnou jíst rákos", why: "Štiky jsou dravé ryby." },
    { value: "nic se nestane", why: "Přemnožení dravců se projeví." },
  ], {
    hints: ["Čím se štiky živí?", "Víc lovců v rybníce sní víc kořisti; drobné rybky budou mizet."],
    explanation: "Víc štik sní víc drobných ryb.",
  }),
  choice("Proč je dobré nechat na zahradě hromadu listí a větví?", "žijí v ní rozkladači a přezimují ježci", [
    { value: "hromada odpuzuje všechny ptáky", why: "Ptáci v ní naopak hledají potravu." },
    { value: "listí se na slunci samo zapálí", why: "Hromada listí se sama nevznítí." },
    { value: "hromada chrání trávník před deštěm", why: "Nejde o déšť, ale o úkryt a rozklad." },
  ], {
    hints: ["Kdo se může v hromadě listí schovat na zimu?", "V tlejícím listí žijí žížaly a houby; ježek si v něm udělá zimní pelíšek."],
    explanation: "Hromada listí je domovem rozkladačů a úkrytem ježků.",
  }),
  choice("Který organismus není konzument?", "smrk", [
    { value: "srna", why: "Srna jí rostliny — je konzument." },
    { value: "sýkora", why: "Sýkora jí hmyz — je konzument." },
    { value: "kuna", why: "Kuna loví — je konzument." },
  ], {
    hints: ["Kdo z nich si potravu vyrábí sám?", "Konzumenti potravu jedí; jeden z nich je jehličnatý strom."],
    explanation: "Smrk je producent, ostatní jsou konzumenti.",
  }),
  choice("V řetězci obilí – myš – sova zmizí myši. Co se stane?", "sovy budou hladovět a obilí bude méně okousané", [
    { value: "sovy budou mít víc potravy", why: "Myši jsou potravou sov." },
    { value: "obilí bude rychleji mizet", why: "Myši obilí jedí — bez nich ho zbude víc." },
    { value: "sovy začnou jíst obilí", why: "Sovy jsou dravci." },
  ], {
    hints: ["Kdo jí myši a co jedí myši?", "Když zmizí článek uprostřed řetězce, strádá ten nad ním a daří se tomu pod ním."],
    explanation: "Bez myší sovám chybí potrava a obilí zůstane víc.",
  }),
  choice("Proč je potravní síť stabilnější než jediný řetězec?", "živočichové mají víc druhů potravy", [
    { value: "v síti je méně živočichů", why: "Síť je naopak bohatší." },
    { value: "v síti žijí jen rostliny", why: "Síť zahrnuje rostliny i živočichy." },
    { value: "síť je kratší", why: "Délka nerozhoduje." },
  ], {
    hints: ["Co udělá liška, když zrovna nejsou myši?", "Liška může jíst myši, zajíce, ptáky i ovoce; když jedna potrava chybí, najde jinou."],
    explanation: "V síti má každý víc zdrojů potravy, a výpadek jednoho ji nerozbije.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const POTRAVNIRETEZECVZTAHYVEKOSYSTEMU: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-potravni-retezec-vztahy-v-ekosystemu",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-potravni-retezec-vztahy-v-ekosystemu",
    title: "Potravní řetězec, vztahy v ekosystému",
    studentTitle: "Potravní řetězec",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Ekosystémy a životní prostředí",
    briefDescription: "Poznáš, jak jsou organismy v přírodě propojeny potravními řetězci.",
    keywords: ["potravní řetězec", "producent", "konzument", "rozkladač", "ekosystém", "predátor", "kořist", "symbioza"],
    goals: ["Sestavit jednoduchý potravní řetězec", "Rozlišit producenty, konzumenty a rozkladače", "Popsat základní ekologické vztahy (predace, symbioza, parazitismus)"],
    boundaries: ["Neprobírá matematické modely populační ekologie", "Neprobírá evoluci interakcí"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Potravní řetězec: Producent → Primární konzument → Sekundární → Terciární konzument → Rozkladači.",
      steps: [
        "Producent: rostlina (fotosyntéza).",
        "Primární konzument: bylinožravec (zajíc).",
        "Sekundární konzument: malý masožravec (liška).",
        "Terciární konzument: vrcholový predátor (orel).",
        "Rozkladači: houby a bakterie vracejí živiny do půdy.",
      ],
      commonMistake: "Šipka v potravním řetězci ukazuje směr toku energie (→ = je sněden).",
      example: "Tráva → Zajíc → Liška → Orel. Mrtvé organismy → houby (rozkladači).",
    },
  },
];
