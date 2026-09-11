import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a zpětné vazby a na L2/L3 jen pět až sedm různých otázek. Teď:
// L1 druhy hornin, nerosty a jejich příklady · L2 vlastnosti (tvrdost,
// štěpnost, užití) · L3 vznik a přeměny hornin, úvahy.

const L1: PracticeTask[] = [
  choice("Jak se jmenují horniny, které vznikly ztuhnutím magmatu?", "vyvřelé", [
    { value: "usazené", why: "Usazené horniny vznikají usazováním úlomků a schránek, třeba na dně moře." },
    { value: "přeměněné", why: "Přeměněné horniny vznikají z jiných hornin tlakem a teplem." },
    { value: "nerosty", why: "Nerosty nejsou horniny — horniny se z nerostů skládají." },
  ], {
    hints: ["Magma je roztavená hornina v hloubce. Co s ní udělá sopka?", "Magma vyvře k povrchu nebo zůstane v hloubce a ztuhne. Podle toho, že vyvřelo, se takové horniny jmenují."],
    explanation: "Horniny, které vznikly ztuhnutím magmatu nebo lávy, se jmenují vyvřelé.",
  }),
  choice("Která hornina je vyvřelá?", "žula", [
    { value: "pískovec", why: "Pískovec vznikl ze slepeného písku — je usazený." },
    { value: "vápenec", why: "Vápenec vznikl ze schránek mořských živočichů — je usazený." },
    { value: "mramor", why: "Mramor vznikl přeměnou vápence — je přeměněný." },
  ], {
    hints: ["Hledej horninu, která vznikla z magmatu v hloubce Země.", "Tato hornina má zřetelná zrna — růžový nebo šedý živec, šedý křemen a lesklou slídu."],
    explanation: "Žula vznikla pomalým tuhnutím magmatu v hloubce — je to vyvřelá hornina.",
  }),
  choice("Která hornina je usazená?", "pískovec", [
    { value: "žula", why: "Žula ztuhla z magmatu — je vyvřelá." },
    { value: "čedič", why: "Čedič ztuhl z lávy — je vyvřelý." },
    { value: "rula", why: "Rula vznikla přeměnou — je přeměněná." },
  ], {
    hints: ["Usazené horniny vznikly z úlomků, které se usadily, třeba na dně moře.", "Hledej horninu ze slepených zrnek, jaká najdeš na pláži nebo na pískovišti. Zrnka k sobě časem spojil přírodní tmel."],
    explanation: "Pískovec vznikl slepením usazených zrnek písku — je to usazená hornina.",
  }),
  choice("Která hornina je přeměněná?", "mramor", [
    { value: "žula", why: "Žula ztuhla z magmatu — je vyvřelá." },
    { value: "vápenec", why: "Vápenec je usazený; přeměnou z něj teprve vzniká jiná hornina." },
    { value: "pískovec", why: "Pískovec je usazený." },
  ], {
    hints: ["Přeměněné horniny vznikly z jiných hornin působením tlaku a tepla.", "Tato hornina vznikla z vápence a sochaři ji mají rádi, protože se dá vyleštit do lesku."],
    explanation: "Mramor vznikl přeměnou vápence za vysokého tlaku a teploty.",
  }),
  choice("Z čeho se skládají horniny?", "z nerostů", [
    { value: "z kovů", why: "Kovy se z některých hornin získávají, ale horniny se z nich neskládají." },
    { value: "ze zkamenělin", why: "Zkameněliny jsou jen v některých horninách." },
    { value: "z písku", why: "Písek je jen jedna usazenina; i ten je z nerostů." },
  ], {
    hints: ["Podívej se zblízka na žulu. Z čeho je poskládaná?", "Žula je složená z drobných zrn živce, křemene a slídy. Každé zrno je jiný…"],
    explanation: "Horniny se skládají z nerostů — žula třeba z živce, křemene a slídy.",
  }),
  choice("Který nerost je nejtvrdší?", "diamant", [
    { value: "křemen", why: "Křemen je tvrdý (7), ale ne nejtvrdší." },
    { value: "mastek", why: "Mastek je naopak nejměkčí." },
    { value: "sůl kamenná", why: "Sůl kamenná je měkká." },
  ], {
    hints: ["Který nerost je na konci Mohsovy stupnice tvrdosti?", "Tento nerost poškrábe všechny ostatní; brusiči ho používají k řezání skla."],
    explanation: "Diamant má na Mohsově stupnici tvrdost 10 — je nejtvrdší.",
  }),
  choice("Který nerost je nejměkčí?", "mastek", [
    { value: "diamant", why: "Diamant je nejtvrdší." },
    { value: "křemen", why: "Křemen poškrábe i sklo." },
    { value: "živec", why: "Živec je poměrně tvrdý." },
  ], {
    hints: ["Který nerost je na začátku Mohsovy stupnice?", "Tento nerost je tak měkký, že ho poškrábeš nehtem, a dělá se z něj dětský pudr."],
    explanation: "Mastek má tvrdost 1 — je nejměkčí a poškrábe ho i nehet.",
  }),
  choice("Ze kterého nerostu se získává kuchyňská sůl?", "sůl kamenná", [
    { value: "křemen", why: "Křemen je v písku a sklu." },
    { value: "sádrovec", why: "Ze sádrovce se vyrábí sádra." },
    { value: "kalcit", why: "Kalcit tvoří vápenec." },
  ], {
    hints: ["Který nerost je slaný?", "Tento nerost vznikl vypařením starých moří a těží se v dolech i solných jezerech."],
    explanation: "Kuchyňská sůl se získává ze soli kamenné (halitu).",
  }),
  choice("Ze které horniny se pálí vápno?", "z vápence", [
    { value: "ze žuly", why: "Žula se používá na dlažbu a pomníky." },
    { value: "z čediče", why: "Čedič se používá na štěrk." },
    { value: "z pískovce", why: "Pískovec se používá na stavby a sochy." },
  ], {
    hints: ["Název té horniny se podobá slovu vápno.", "Tato usazená hornina vznikla ze schránek mořských živočichů; v peci se z ní vypálí vápno."],
    explanation: "Vápno se pálí z vápence.",
  }),
  choice("Který nerost tvoří většinu písku?", "křemen", [
    { value: "slída", why: "Slída je v písku jen v malých lesklých šupinkách." },
    { value: "kalcit", why: "Kalcit se ve vodě a vzduchu rozpadá rychleji." },
    { value: "sůl kamenná", why: "Sůl by se ve vodě rozpustila." },
  ], {
    hints: ["Který nerost je tvrdý a odolá vodě i větru nejdéle?", "Z tohoto nerostu se vyrábí sklo; jeho průhledné krystaly se jmenují křišťál."],
    explanation: "Písek je hlavně z křemene, který je tvrdý a odolný.",
  }),
  choice("Jak se jmenuje stupnice tvrdosti nerostů?", "Mohsova stupnice", [
    { value: "Celsiova stupnice", why: "Celsiova stupnice měří teplotu." },
    { value: "Richterova stupnice", why: "Richterova stupnice měří sílu zemětřesení." },
    { value: "Beaufortova stupnice", why: "Beaufortova stupnice měří sílu větru." },
  ], {
    hints: ["Stupnice má deset stupňů od mastku po diamant.", "Pojmenovaná je podle německého mineraloga Friedricha Mohse."],
    explanation: "Tvrdost nerostů se určuje Mohsovou stupnicí od 1 (mastek) do 10 (diamant).",
  }),
  choice("Z čeho vzniklo černé uhlí?", "z pravěkých rostlin", [
    { value: "z pravěkých živočichů", why: "Z drobných mořských organismů vznikla ropa; uhlí vzniklo z rostlin." },
    { value: "z vychladlé lávy", why: "Z lávy vznikají vyvřelé horniny." },
    { value: "z mořského písku", why: "Z písku vznikl pískovec." },
  ], {
    hints: ["Uhlí hoří. Co živého kdysi rostlo v bažinách?", "Před miliony let rostly v bažinách obří přesličky a kapradiny; zasypané se měnily v uhlí."],
    explanation: "Černé uhlí vzniklo z pravěkých rostlin, které byly zasypané a stlačené.",
  }),
  choice("Co je ruda?", "hornina, ze které se získává kov", [
    { value: "druh drahého kamene", why: "Drahé kameny se brousí do šperků; ruda se taví." },
    { value: "nerost, ze kterého se vyrábí sůl", why: "Sůl se získává ze soli kamenné." },
    { value: "zkamenělá rostlina", why: "Zkamenělé rostliny jsou zkameněliny." },
  ], {
    hints: ["Odkud se berou železo, měď nebo stříbro?", "Kovy se v přírodě skoro nevyskytují čisté; získávají se tavením určitých hornin."],
    explanation: "Ruda je hornina s tolika kovem, že se vyplatí ho z ní získávat — třeba železná ruda.",
  }),
];

const L2: PracticeTask[] = [
  choice("Křemen má tvrdost 7, sklo asi 5,5. Co se stane, když křemenem přejedeš po skle?", "křemen sklo poškrábe", [
    { value: "sklo poškrábe křemen", why: "Škrábe vždy tvrdší materiál ten měkčí." },
    { value: "nestane se nic", why: "Rozdíl tvrdosti je dost velký, aby vznikl vryp." },
    { value: "oba se rozbijí", why: "Škrábnutí nic nerozbije." },
  ], {
    hints: ["Který z těch dvou materiálů je tvrdší?", "Tvrdší nerost vždy zanechá vryp na měkčím. Porovnej čísla 7 a 5,5."],
    explanation: "Křemen je tvrdší než sklo, proto sklo poškrábe.",
  }),
  choice("Mastek má tvrdost 1. Čím ho poškrábeš?", "i nehtem", [
    { value: "jen diamantem", why: "Diamant je potřeba jen na nejtvrdší nerosty." },
    { value: "vůbec ničím", why: "Mastek je nejměkčí nerost." },
    { value: "jen ocelovým nožem", why: "Nůž mastek poškrábe, ale stačí i něco mnohem měkčího." },
  ], {
    hints: ["Mastek je nejměkčí nerost. Stačí na něj něco měkkého?", "Tvůj nehet má tvrdost asi 2,5 — víc než mastek. A tvrdší materiál vždycky škrábe ten měkčí."],
    explanation: "Mastek je tak měkký, že ho poškrábeš i nehtem.",
  }),
  choice("Který nerost zašumí, když na něj kápneš ocet?", "kalcit", [
    { value: "křemen", why: "Křemen s octem nereaguje." },
    { value: "sůl kamenná", why: "Sůl se ve vodě rozpustí, ale nešumí." },
    { value: "slída", why: "Slída s octem nereaguje." },
  ], {
    hints: ["Který nerost tvoří vápenec?", "Kyseliny rozpouštějí vápenec a uvolní se přitom bublinky plynu."],
    explanation: "Kalcit s kyselinou šumí — uvolňuje se oxid uhličitý. Tak se pozná vápenec.",
  }),
  choice("Který nerost se dá štípat na tenké lesklé plátky?", "slída", [
    { value: "křemen", why: "Křemen se neštípe, láme se nerovně." },
    { value: "kalcit", why: "Kalcit se štípe na kosočtverečné kousky, ne na plátky." },
    { value: "diamant", why: "Diamant se na plátky neštípe." },
  ], {
    hints: ["Který nerost se v žule třpytí jako drobné zrcátko?", "Tento nerost se odlupuje jako listy knihy; kdysi se z něj dělala okénka do kamen."],
    explanation: "Slída se štípe na tenké průhledné lesklé plátky.",
  }),
  choice("Proč se žula používá na dlažební kostky?", "je tvrdá a odolná", [
    { value: "je měkká a snadno se opracuje", why: "Žula je tvrdá, opracovat ji je naopak těžké." },
    { value: "je velmi lehká", why: "Žula je těžká." },
    { value: "rozpouští se ve vodě", why: "Kdyby se rozpouštěla, dlažba by nevydržela." },
  ], {
    hints: ["Co musí vydržet dlažba na ulici?", "Po dlažbě jezdí auta a prší na ni; hornina musí odolat oděru i mrazu."],
    explanation: "Žula je tvrdá a odolná vůči oděru i mrazu, proto je dobrá na dlažbu.",
  }),
  choice("Jaká zrna vidíš v žule?", "živec, křemen a slídu", [
    { value: "sůl a písek", why: "Sůl by se deštěm rozpustila." },
    { value: "uhlí a vápenec", why: "To jsou jiné horniny." },
    { value: "diamanty a zlato", why: "Ty v žule běžně nejsou." },
  ], {
    hints: ["Žula je pestrá — růžová, šedá a lesklá zrna. Co to je?", "Růžová nebo bílá zrna jsou živec, šedá průsvitná křemen a lesklé šupinky…"],
    explanation: "Žula se skládá z živce, křemene a slídy.",
  }),
  choice("Proč pískovcové skály snadno rozrušuje vítr a voda?", "jsou ze slepených zrnek písku, která se snadno uvolní", [
    { value: "jsou z tvrdého ztuhlého magmatu", why: "Ztuhlé magma (žula) je naopak velmi odolné." },
    { value: "jsou tvořené hlavně ledem a sněhem", why: "Skály nejsou z ledu." },
    { value: "jsou to pozůstatky kovových rud", why: "Pískovec není ruda." },
  ], {
    hints: ["Z čeho je pískovec?", "Zrnka písku drží v pískovci jen tmel; když ho voda vymyje, zrnka se uvolní."],
    explanation: "Pískovec je ze slepených zrn písku; vítr a voda je snadno uvolňují — tak vznikly skalní města.",
  }),
  choice("Kde vzniká vápenec?", "na dně moří z usazených schránek živočichů", [
    { value: "v sopce z vychladlé lávy", why: "Z lávy vznikají vyvřelé horniny." },
    { value: "hluboko pod zemí z tlaku a žáru", why: "Tak vznikají přeměněné horniny." },
    { value: "v jeskyni ze zamrzlé vody", why: "Led horninu netvoří." },
  ], {
    hints: ["Vápenec patří mezi usazené horniny. Kde se usazuje?", "Drobní mořští živočichové mají schránky z vápníku; po smrti klesnou na dno a vrstvy se stlačí."],
    explanation: "Vápenec vznikl na dně moří ze schránek drobných živočichů.",
  }),
  choice("Jak se jmenují zkamenělé zbytky pravěkých organismů?", "zkameněliny", [
    { value: "krystaly", why: "Krystaly jsou pravidelné tvary nerostů." },
    { value: "rudy", why: "Rudy jsou horniny s kovy." },
    { value: "nerosty", why: "Nerosty nejsou zbytky organismů." },
  ], {
    hints: ["Otisk mušle nebo trilobita v kameni — jak se to jmenuje?", "Takové nálezy se hledají hlavně v usazených horninách, třeba ve vápenci."],
    explanation: "Zbytky nebo otisky pravěkých organismů v horninách jsou zkameněliny.",
  }),
  choice("Který nerost je v tužce jako tuha?", "grafit", [
    { value: "diamant", why: "Diamant je ze stejného prvku, ale je nejtvrdší — psát by nešel." },
    { value: "mastek", why: "Mastek je bílý a v tužkách není." },
    { value: "slída", why: "Slída je lesklá a průhledná." },
  ], {
    hints: ["Tuha je šedočerná a měkká. Co to je?", "Tento nerost je tak měkký, že na papíře zanechá šedou čáru; je ze stejného prvku jako diamant."],
    explanation: "Tuha v tužkách je grafit — měkký, šedočerný a mastný na omak.",
  }),
  choice("Ze které horniny je postavený Karlův most?", "z pískovce", [
    { value: "ze žuly", why: "Žula se používá hlavně na dlažbu." },
    { value: "z mramoru", why: "Mramor je na most příliš drahý a v Čechách vzácný." },
    { value: "z čediče", why: "Čedič se používá na štěrk." },
  ], {
    hints: ["Karlův most je postavený z kamenných kvádrů z okolí Prahy. Z jaké horniny?", "Tato usazená hornina se dobře opracovává, ale časem se drolí — most se proto často opravuje."],
    explanation: "Karlův most je z pískovce, který se dobře opracovává.",
  }),
  choice("Jak se jmenuje čistý průhledný křemen?", "křišťál", [
    { value: "slída", why: "Slída je lesklá a štípe se na plátky." },
    { value: "sůl kamenná", why: "Sůl tvoří krychličky a je slaná." },
    { value: "grafit", why: "Grafit je černý a neprůhledný." },
  ], {
    hints: ["Tento průhledný nerost tvoří šestiboké krystaly.", "Z jeho jména je odvozené slovo pro broušené sklo, ze kterého se dělají lustry."],
    explanation: "Čistý průhledný křemen se jmenuje křišťál.",
  }),
];

const L3: PracticeTask[] = [
  choice("Pískovec byl kdysi písek na dně moře. Jak se z něj stala hornina?", "písek se usadil a časem stmelil", [
    { value: "písek se roztavil v sopce", why: "Roztavením vzniká magma a z něj vyvřelé horniny." },
    { value: "písek zmrzl", why: "Mráz horninu nevytvoří." },
    { value: "písek se žárem změnil v mramor", why: "Mramor vzniká z vápence, ne z písku." },
  ], {
    hints: ["Pískovec patří mezi usazené horniny. Co to znamená?", "Vrstvy písku se stlačily a zrnka se spojila tmelem — tak vzniká každá usazená hornina."],
    explanation: "Písek se usadil, vrstvy se stlačily a zrnka stmelila — vznikl pískovec.",
  }),
  choice("Co vznikne z vápence za vysokého tlaku a teploty?", "mramor", [
    { value: "žula", why: "Žula vzniká z magmatu." },
    { value: "pískovec", why: "Pískovec vzniká z písku." },
    { value: "uhlí", why: "Uhlí vzniká z rostlin." },
  ], {
    hints: ["Taková hornina patří mezi přeměněné.", "Z vápence se přeměnou stane lesklá hornina, ze které se tesají sochy."],
    explanation: "Přeměnou vápence vzniká mramor.",
  }),
  choice("Diamant i grafit jsou z uhlíku. Proč je diamant tvrdý a grafit měkký?", "atomy uhlíku jsou v nich jinak uspořádané", [
    { value: "diamant obsahuje železo", why: "Diamant je čistý uhlík." },
    { value: "grafit je starší", why: "Stáří o tvrdosti nerozhoduje." },
    { value: "diamant je vždy větší", why: "Velikost o tvrdosti nerozhoduje." },
  ], {
    hints: ["Když jsou oba ze stejného prvku, v čem se můžou lišit?", "Stejné kostičky stavebnice můžeš poskládat do pevné kostky, nebo do vrstev, které se po sobě smekají."],
    explanation: "V diamantu jsou atomy uhlíku pevně provázané do mřížky, v grafitu tvoří vrstvy, které po sobě kloužou.",
  }),
  choice("Oblázek poškrábe sklo a ocelový nůž ho nepoškrábe. Co to asi je?", "křemen", [
    { value: "mastek", why: "Mastek poškrábeš nehtem." },
    { value: "kalcit", why: "Kalcit poškrábe nůž." },
    { value: "sádrovec", why: "Sádrovec poškrábeš nehtem." },
  ], {
    hints: ["Oblázek je tvrdší než sklo i ocel. Který nerost je tak tvrdý?", "Sklo a ocel mají tvrdost kolem 5,5. Hledej nerost s tvrdostí 7, který je i v písku."],
    explanation: "Křemen (tvrdost 7) poškrábe sklo i ocel — oblázky v řekách jsou často z křemene.",
  }),
  choice("Proč jsou v Moravském krasu jeskyně?", "voda rozpouští vápenec", [
    { value: "vyhloubily je sopky", why: "Sopky jeskyně v krasu nevytvořily." },
    { value: "vyfoukal je vítr", why: "Vítr pod zemí nepůsobí." },
    { value: "vykopali je lidé", why: "Krasové jeskyně jsou přírodní." },
  ], {
    hints: ["Z jaké horniny je Moravský kras?", "Dešťová voda je slabě kyselá a pomalu rozkládá horninu, ze které je kras — tisíce let v ní vymílá chodby."],
    explanation: "Voda s oxidem uhličitým rozpouští vápenec a vymílá v něm jeskyně.",
  }),
  choice("Jak vzniká krápník?", "usazováním vápence z kapající vody", [
    { value: "tuhnutím lávy v jeskyni", why: "Láva se do krasových jeskyní nedostane." },
    { value: "zamrznutím vody v jeskyni", why: "Led by roztál; krápník je z kamene." },
    { value: "prohlubováním jeskyně větrem", why: "Vítr krápníky nevytváří." },
  ], {
    hints: ["Voda v krasu rozpouští vápenec. Co se stane, když ze stropu kápne?", "Z kapky se odpaří voda a rozpuštěný vápenec se usadí — milimetr za desítky let. Tak roste kapka po kapce."],
    explanation: "Z kapající vody se usazuje vápenec a pomalu vzniká krápník.",
  }),
  choice("Proč je uhlí neobnovitelný zdroj?", "vznikalo miliony let a spotřebujeme ho rychle", [
    { value: "těží se jen v zimě, kdy je potřeba", why: "Uhlí se těží celý rok." },
    { value: "je ho v zemi nekonečně mnoho", why: "Zásoby uhlí jsou omezené." },
    { value: "doroste v dolech za několik let", why: "Uhlí vzniká miliony let." },
  ], {
    hints: ["Jak dlouho uhlí vznikalo a jak rychle ho spálíme?", "Pravěké rostliny se v uhlí měnily nepředstavitelně dlouho; my ho spotřebujeme za pár set let."],
    explanation: "Uhlí vznikalo miliony let — co spotřebujeme, se za lidský život neobnoví.",
  }),
  choice("Čedič vznikl rychlým ztuhnutím lávy na povrchu. Jaký je?", "jemnozrnný a tmavý", [
    { value: "hrubozrnný a světlý", why: "Tak vypadá žula, která tuhla pomalu v hloubce." },
    { value: "měkký a kluzký", why: "Takový je mastek." },
    { value: "průhledný", why: "Průhledný je křišťál." },
  ], {
    hints: ["Když láva ztuhne rychle, mají krystaly čas vyrůst?", "Rychlým tuhnutím vznikají jen drobná zrnka a hornina má barvu skoro jako uhlí."],
    explanation: "Čedič tuhl rychle, proto má drobná zrna; je tmavý.",
  }),
  choice("Proč má žula velká zrna a čedič drobná?", "žula tuhla pomalu v hloubce, čedič rychle na povrchu", [
    { value: "žula je mnohem starší než čedič, a proto je hrubší", why: "Velikost zrn určuje rychlost tuhnutí, ne stáří." },
    { value: "čedič je usazená hornina z jemného bahna", why: "Čedič je vyvřelý." },
    { value: "žula vznikla přeměnou z pískovce pod tlakem", why: "Žula je vyvřelá hornina z magmatu." },
  ], {
    hints: ["Kde tuhla žula a kde čedič?", "Čím pomaleji magma chladne, tím víc času mají krystaly nerostů vyrůst."],
    explanation: "Žula chladla pomalu v hloubce a krystaly vyrostly; čedič ztuhl rychle na povrchu.",
  }),
  choice("Diamant a grafit jsou z téhož prvku. Z jakého?", "z uhlíku", [
    { value: "ze železa", why: "Železo je kov, diamant ani grafit ho neobsahují." },
    { value: "z křemíku", why: "Z křemíku a kyslíku je křemen." },
    { value: "z vápníku", why: "Vápník je v kalcitu." },
  ], {
    hints: ["Z čeho je tuha v tužce a z čeho uhlí?", "Tentýž prvek tvoří uhlí, grafit i diamant — jen je jinak uspořádaný."],
    explanation: "Diamant i grafit jsou čistý uhlík.",
  }),
  choice("Ze které horniny bys vytesal nebo vytesala sochu, která má být hladká a lesklá?", "z mramoru", [
    { value: "z pískovce", why: "Pískovec se dá opracovat, ale je drsný a drolí se." },
    { value: "z uhlí", why: "Uhlí je křehké a špiní." },
    { value: "z jílu", why: "Jíl je měkký, na tesání se nehodí." },
  ], {
    hints: ["Která hornina se dá vyleštit do lesku?", "Tato přeměněná hornina z vápence byla oblíbená u sochařů už ve starověkém Řecku."],
    explanation: "Mramor se dá vyleštit do lesku — proto je oblíbený u sochařů.",
  }),
  choice("Proč jsou kameny v potoce oblé?", "voda je valí a obrušuje", [
    { value: "takové vznikly v sopce", why: "V sopce vznikají ostrohranné úlomky." },
    { value: "rozpustily se", why: "Většina kamenů se ve vodě nerozpouští." },
    { value: "někdo je obrousil", why: "Obrušuje je příroda, ne lidé." },
  ], {
    hints: ["Co se děje s kamenem, který voda roky kutálí po dně?", "Kameny do sebe narážejí a písek je obrušuje, až zmizí ostré hrany."],
    explanation: "Voda kameny valí a o sebe se obrušují, až jsou oblé.",
  }),
  choice("Jak se jmenuje děj, při kterém se horniny dokola mění jedna v druhou?", "koloběh hornin", [
    { value: "koloběh vody", why: "V koloběhu vody se mění skupenství vody." },
    { value: "potravní řetězec", why: "Potravní řetězec popisuje, kdo koho jí." },
    { value: "fotosyntéza", why: "Fotosyntézou rostliny vyrábějí živiny." },
  ], {
    hints: ["Horniny se rozpadají, usazují, přeměňují i taví a znovu tuhnou — pořád dokola.", "Stejně jako se dokola mění voda na páru, déšť a led, mění se i horniny. Podle toho se ten děj jmenuje."],
    explanation: "Koloběh hornin: vyvřelé se rozpadají na usazeniny, ty se přeměňují a taví a znovu tuhnou.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const HORNINYANEROSTYDRUHYVLASTNOSTIVZNIK: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-horniny-a-nerosty-druhy-vlastnosti-vznik",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-horniny-a-nerosty-druhy-vlastnosti-vznik",
    title: "Horniny a nerosty - druhy, vlastnosti, vznik",
    studentTitle: "Horniny a kameny",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Neživá příroda - rozšíření",
    briefDescription: "Poznáš různé druhy hornin a nerostů a jak vznikají.",
    keywords: ["horniny", "nerosty", "minerály", "žula", "vápenec", "diamant", "uhlí", "Mohsova stupnice"],
    goals: ["Rozlišit tři typy hornin (vyvřelé, usazené, přeměněné)", "Popsat Mohsovu stupnici tvrdosti", "Uvést příklady užitných nerostů"],
    boundaries: ["Neprobírá chemické složení nerostů do hloubky", "Neprobírá krystalografii"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Horniny: vyvřelé (žula, čedič), usazené (vápenec, písek, uhlí), přeměněné (rula, mramor).",
      steps: [
        "Vyvřelé: magma → ochlazení → žula, čedič",
        "Usazené: vrstvení, stmelení → vápenec, uhlí",
        "Přeměněné: tlak + teplo → rula, mramor",
        "Mohsova stupnice: 1 (mastek) → 10 (diamant)",
      ],
      commonMistake: "Hornina NENÍ totéž jako nerost. Hornina = více nerostů dohromady.",
      example: "Žula = hornina z křemene + živce + slídy. Diamant = nerost (čistý uhlík).",
    },
  },
];
