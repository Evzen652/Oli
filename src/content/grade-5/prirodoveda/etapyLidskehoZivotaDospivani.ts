import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a zpětné vazby a L2/L3 měly jen 4–6 různých otázek. Teď:
// L1 etapy lidského života · L2 změny v dospívání a proč nastávají
// · L3 jak se zachovat k sobě i druhým v dospívání.

const L1: PracticeTask[] = [
  choice("Jak se jmenuje dítě v prvním měsíci života?", "novorozenec", [
    { value: "batole", why: "Batole je dítě zhruba od jednoho do tří let." },
    { value: "kojenec", why: "Kojencem je dítě do jednoho roku; v prvním měsíci mu říkáme ještě jinak." },
    { value: "předškolák", why: "Předškolák je dítě ve školce." },
  ], {
    hints: ["Dítě se právě narodilo. Jak se mu říká?", "Název tohoto období obsahuje slovo „nový“ a „rodit“."],
    explanation: "Dítě v prvních týdnech po narození je novorozenec.",
  }),
  choice("Jak se říká dítěti od jednoho do tří let, které se učí chodit a mluvit?", "batole", [
    { value: "novorozenec", why: "Novorozenec je dítě hned po narození." },
    { value: "školák", why: "Školák chodí do školy." },
    { value: "dospívající", why: "Dospívající je v pubertě." },
  ], {
    hints: ["Jak se pohybuje dítě, které se teprve učí chodit?", "Dítě v tomto věku ještě vrávorá a „batolí se“ — podle toho má jméno."],
    explanation: "Dítě od jednoho do tří let je batole.",
  }),
  choice("Jak se jmenuje období, kdy se z dítěte stává dospělý?", "dospívání", [
    { value: "stáří", why: "Stáří je poslední etapa života." },
    { value: "batolecí věk", why: "Batolecí věk je raně dětský." },
    { value: "kojenecký věk", why: "Kojenecký věk je první rok života." },
  ], {
    hints: ["Kdy se tělo mění z dětského na dospělé?", "Toto období se odborně jmenuje puberta a začíná zhruba mezi 9. a 14. rokem."],
    explanation: "Dospívání (puberta) je období, kdy se z dítěte stává dospělý.",
  }),
  choice("Který sled etap života je správný?", "dětství, dospívání, dospělost, stáří", [
    { value: "dospívání, dětství, stáří, dospělost", why: "Dětství je první." },
    { value: "dětství, dospělost, dospívání, stáří", why: "Dospívání je před dospělostí." },
    { value: "stáří, dospělost, dospívání, dětství", why: "Je to opačně." },
  ], {
    hints: ["Čím život začíná a čím končí?", "Nejdřív jsme děti, pak dospíváme, pak jsme dospělí a nakonec staří."],
    explanation: "Etapy jdou po sobě: dětství, dospívání, dospělost, stáří.",
  }),
  choice("Co se v pubertě mění?", "tělo i nálady", [
    { value: "jen výška", why: "Mění se mnohem víc než výška." },
    { value: "vůbec nic", why: "Puberta přináší mnoho změn." },
    { value: "jen barva očí", why: "Barva očí se nemění." },
  ], {
    hints: ["Mění se v pubertě jen to, jak vypadáme, nebo i to, jak se cítíme?", "Postava roste a mění tvar a zároveň se častěji střídají pocity — jednou radost, jindy smutek."],
    explanation: "V pubertě se mění tělo i nálady — je to přirozené.",
  }),
  choice("Proč se v pubertě mění nálady?", "v těle působí hormony", [
    { value: "kvůli počasí", why: "Počasí náladu ovlivní, ale příčinou pubertálních změn jsou hormony." },
    { value: "protože se méně hraje", why: "Hraní s tím nesouvisí." },
    { value: "kvůli jídlu ve škole", why: "Jídlo to nezpůsobuje." },
  ], {
    hints: ["Jak se jmenují látky, které v těle řídí dospívání?", "Tyto látky vyrábějí žlázy a krví je rozvádějí po celém těle."],
    explanation: "Změny nálad v pubertě způsobují hormony.",
  }),
  choice("Kdy obvykle začíná puberta?", "zhruba mezi 9. a 14. rokem", [
    { value: "hned po narození", why: "Po narození je dítě novorozenec." },
    { value: "po padesátce", why: "To už je dospělost." },
    { value: "u všech přesně v 10 letech", why: "Každému začíná jindy." },
  ], {
    hints: ["Je to spíš na prvním stupni, nebo až po dvacítce?", "Dívkám obvykle začíná o něco dřív než chlapcům, ale každému v jiném věku."],
    explanation: "Puberta obvykle začíná mezi 9. a 14. rokem — u každého jindy.",
  }),
  choice("Co ve stáří obvykle slábne?", "síla a zrak", [
    { value: "zkušenosti", why: "Zkušeností naopak přibývá." },
    { value: "moudrost", why: "Moudrost s věkem neslábne." },
    { value: "počet vzpomínek", why: "Vzpomínek přibývá." },
  ], {
    hints: ["Proč babičky a dědečkové často nosí brýle?", "S věkem ubývá síly ve svalech a oči hůř zaostřují."],
    explanation: "Ve stáří obvykle slábne síla, zrak a sluch; zkušeností ale přibývá.",
  }),
  choice("Jak se jmenuje dítě do jednoho roku, které se živí hlavně mlékem?", "kojenec", [
    { value: "batole", why: "Batole je starší, chodí a jí běžnou stravu." },
    { value: "předškolák", why: "Předškolák chodí do školky." },
    { value: "školák", why: "Školák chodí do školy." },
  ], {
    hints: ["Jak se jmenuje krmení miminka mateřským mlékem?", "Slovo pro toto období je odvozené od kojení."],
    explanation: "Dítě v prvním roce je kojenec.",
  }),
  choice("V kolika letech děti obvykle začínají chodit do školy?", "v 6 letech", [
    { value: "ve 3 letech", why: "Ve 3 letech chodí děti do školky." },
    { value: "v 10 letech", why: "V 10 letech už jsou ve 4. třídě." },
    { value: "v 15 letech", why: "V 15 letech končí základní školu." },
  ], {
    hints: ["Kolik ti bylo, když jsi šel nebo šla do první třídy?", "Povinná školní docházka začíná po šestých narozeninách."],
    explanation: "Do školy děti obvykle nastupují v 6 letech.",
  }),
  choice("Co je v pubertě normální?", "že se tělo mění u každého jinak", [
    { value: "že všichni rostou stejně rychle", why: "Každý roste svým tempem." },
    { value: "že se nic nemění", why: "Mění se tělo i nálady." },
    { value: "že změny začnou všem ve stejný den", why: "Začínají u každého jindy." },
  ], {
    hints: ["Rostou všichni tvoji spolužáci stejně?", "Někdo vyroste dřív, někdo později — obojí je v pořádku."],
    explanation: "Tělo se v pubertě mění u každého jinak a jiným tempem.",
  }),
  choice("Jak se jmenuje období, kdy dítě roste v těle matky?", "těhotenství", [
    { value: "puberta", why: "Puberta je dospívání." },
    { value: "stáří", why: "Stáří je konec života." },
    { value: "batolecí věk", why: "Batolecí věk je po narození." },
  ], {
    hints: ["Jak se říká ženě, která čeká miminko?", "Toto období trvá asi devět měsíců a končí porodem."],
    explanation: "Před narozením roste dítě v těle matky — tomu období se říká těhotenství.",
  }),
  choice("Co pomáhá zdravému dospívání?", "pohyb, spánek a pestrá strava", [
    { value: "ponocování u mobilu", why: "Nedostatek spánku škodí." },
    { value: "sladkosti místo jídla", why: "Tělo potřebuje pestrou stravu." },
    { value: "celý den vsedě", why: "Tělo potřebuje pohyb." },
  ], {
    hints: ["Co tělo potřebuje, když rychle roste?", "Rostoucí tělo potřebuje živiny, odpočinek a pohyb."],
    explanation: "Dospívání prospívá pohyb, dostatek spánku a pestrá strava.",
  }),
];

const L2: PracticeTask[] = [
  choice("Proč se dospívající víc potí a mají mastnější pleť?", "hormony zvýší činnost potních a mazových žláz", [
    { value: "jedí víc sladkostí a tučných jídel", why: "Hlavní příčinou jsou hormony." },
    { value: "méně se myjí", why: "Příčinou jsou hormony; mytí pomáhá." },
    { value: "je jim pořád horko", why: "Příčinou jsou hormony." },
  ], {
    hints: ["Co v pubertě řídí změny v těle?", "Hormony rozproudí činnost žláz v kůži — pot a maz se tvoří víc."],
    explanation: "Hormony zvýší činnost potních a mazových žláz.",
  }),
  choice("Proč je v pubertě důležitá hygiena?", "tělo se víc potí a pleť se víc mastí", [
    { value: "je to jen módní", why: "Hygiena je potřebná, ne módní." },
    { value: "v pubertě se nemusíš mýt", why: "Naopak je mytí ještě důležitější." },
    { value: "aby se zastavil růst", why: "Hygiena růst neovlivní." },
  ], {
    hints: ["Co tělo v pubertě vytváří víc?", "Pot a maz se v pubertě tvoří víc, a proto je potřeba se častěji mýt."],
    explanation: "Tělo se v pubertě víc potí a pleť se mastí, proto je hygiena důležitá.",
  }),
  choice("Co znamená, že dospívání je přirozené?", "prochází jím každý člověk", [
    { value: "týká se jen některých", why: "Týká se všech." },
    { value: "je to nemoc", why: "Dospívání není nemoc." },
    { value: "dá se přeskočit", why: "Přeskočit se nedá." },
  ], {
    hints: ["Prošli pubertou tvoji rodiče?", "Každý dospělý byl kdysi dítětem a musel dospět."],
    explanation: "Dospíváním prochází každý člověk — je to přirozená součást života.",
  }),
  choice("Proč se dospívající častěji přou s rodiči?", "hledají vlastní názor a samostatnost", [
    { value: "rodiče je přestanou mít rádi", why: "Rodiče mají děti rádi dál." },
    { value: "je to kvůli jídlu", why: "Nejde o jídlo." },
    { value: "je to povinné", why: "Není to povinnost." },
  ], {
    hints: ["Co se v dospívání mění v tom, jak přemýšlíš?", "Dospívající chtějí rozhodovat sami za sebe a zkoušejí, co si myslí oni sami, ne jen rodiče."],
    explanation: "Dospívající hledají samostatnost a vlastní názor, a to vede ke sporům.",
  }),
  choice("Proč dospívající potřebují hodně spát?", "tělo roste a potřebuje odpočinek", [
    { value: "jsou líní", why: "Nejde o lenost." },
    { value: "je to jen zvyk", why: "Spánek tělo opravdu potřebuje." },
    { value: "ve spánku se učí rychleji číst", why: "Spánek je hlavně odpočinek a růst." },
  ], {
    hints: ["Kdy tělo nejvíc roste a regeneruje?", "Ve spánku se tvoří růstový hormon a tělo se zotavuje."],
    explanation: "Rostoucí tělo potřebuje dostatek spánku.",
  }),
  choice("Kdy je člověk v Česku plnoletý?", "v 18 letech", [
    { value: "v 15 letech", why: "V 15 letech dostáváš občanský průkaz." },
    { value: "ve 21 letech", why: "Ve 21 letech je plnoletost v některých jiných zemích." },
    { value: "v 16 letech", why: "Plnoletost je později." },
  ], {
    hints: ["Od kdy se smí volit?", "Plnoletý člověk smí volit, uzavírat smlouvy a řídit auto."],
    explanation: "Plnoletost v Česku nastává v 18 letech.",
  }),
  choice("Co je typické pro mladší školní věk (6–11 let)?", "dítě se učí číst, psát a počítat", [
    { value: "dítě se učí chodit", why: "Chodit se učí batole." },
    { value: "člověk odchází do důchodu", why: "To je stáří." },
    { value: "tělo prudce mění puberta", why: "Puberta přichází až později." },
  ], {
    hints: ["Co se děti učí na prvním stupni?", "V tomto věku chodí děti do školy a učí se základním dovednostem."],
    explanation: "V mladším školním věku se děti učí číst, psát a počítat.",
  }),
  choice("Co je typické pro dospělost?", "člověk pracuje a stará se o sebe i rodinu", [
    { value: "člověk se učí chodit", why: "To je batolecí věk." },
    { value: "člověk chodí do školky", why: "To je předškolní věk." },
    { value: "člověk už nic nedělá", why: "Dospělí jsou naopak nejaktivnější." },
  ], {
    hints: ["Co dělají tvoji rodiče každý den?", "Dospělí chodí do práce, starají se o domácnost a vychovávají děti."],
    explanation: "V dospělosti člověk pracuje a stará se o sebe i o druhé.",
  }),
  choice("Proč se změny v pubertě u kamarádů liší?", "každé tělo má vlastní tempo", [
    { value: "někdo pubertou neprojde", why: "Projde jí každý." },
    { value: "záleží na známkách ve škole", why: "Známky to neovlivní." },
    { value: "je to náhoda bez příčiny", why: "Řídí to hormony, u každého jindy." },
  ], {
    hints: ["Rostou všichni stejně rychle?", "Hormony začnou působit u každého v jiném věku, proto se změny liší."],
    explanation: "Každé tělo dospívá vlastním tempem.",
  }),
  choice("Komu se můžeš svěřit, když tě změny v pubertě trápí?", "rodičům, lékaři nebo učiteli", [
    { value: "nikomu, je to ostuda", why: "Není to ostuda, je to přirozené." },
    { value: "jen neznámým lidem na internetu", why: "Cizí lidé na internetu nemusí mít dobré úmysly." },
    { value: "jen mladšímu sourozenci", why: "Lépe poradí dospělý." },
  ], {
    hints: ["Kdo ti o dospívání nejlépe poradí?", "Dospělí, kterým věříš, tím sami prošli a umějí poradit."],
    explanation: "Nejlépe se svěřit rodičům, lékaři nebo učiteli.",
  }),
  choice("Proč se v pubertě mění hlas, zvlášť u chlapců?", "roste hrtan a prodlužují se hlasivky", [
    { value: "hlas se opotřebuje", why: "Hlas se neopotřebuje." },
    { value: "kvůli nachlazení", why: "Nachlazení mutaci nezpůsobuje." },
    { value: "protože víc zpívají", why: "Zpěv to nezpůsobí." },
  ], {
    hints: ["Kde vzniká hlas?", "Delší a silnější hlasivky kmitají pomaleji, a hlas je hlubší."],
    explanation: "V pubertě roste hrtan a hlasivky se prodlužují — hlas se prohloubí.",
  }),
  choice("Co pomůže, když se v dospívání cítíš smutně nebo zmateně?", "promluvit si s někým, komu věřím", [
    { value: "všechno si nechat pro sebe", why: "Sdílení pomáhá." },
    { value: "hrát hry celou noc", why: "Nedostatek spánku náladu zhorší." },
    { value: "přestat jíst", why: "Tělo potřebuje živiny." },
  ], {
    hints: ["Co ti obvykle pomůže, když máš starost?", "Když problém řekneš nahlas někomu blízkému, je hned lehčí."],
    explanation: "Pomáhá promluvit si s někým, komu věříš.",
  }),
  choice("Proč je i stáří důležitou etapou života?", "starší lidé předávají zkušenosti", [
    { value: "starší lidé už nic nevědí", why: "Mají naopak mnoho zkušeností." },
    { value: "ve stáří se začíná chodit do školy", why: "Do školy chodí děti." },
    { value: "ve stáří člověk znovu dospívá", why: "Dospívání je jen jednou." },
  ], {
    hints: ["Co ti mohou naučit babička nebo dědeček?", "Babičky a dědečkové mají za sebou dlouhý život a mnoho zkušeností."],
    explanation: "Starší lidé předávají zkušenosti a moudrost mladším.",
  }),
];

const L3: PracticeTask[] = [
  choice("Kamarád se trápí, že je menší než ostatní. Co mu řekneš?", "každý roste jiným tempem", [
    { value: "už nikdy nevyroste", why: "Většina lidí růst dožene." },
    { value: "je to jeho chyba", why: "Za tempo růstu nikdo nemůže." },
    { value: "má přestat jíst", why: "Jídlo potřebuje k růstu." },
  ], {
    hints: ["Rostou všichni ve stejném věku?", "Někdo vyroste dřív, jiný dožene ostatní až v dalších letech."],
    explanation: "Každý roste jiným tempem; kamarád pravděpodobně ostatní dožene.",
  }),
  choice("Proč bys neměl nebo neměla porovnávat své tělo s fotkami na internetu?", "fotky bývají upravené a neukazují skutečnost", [
    { value: "fotky na internetu jsou vždy pravdivé", why: "Často jsou upravené." },
    { value: "na internetu jsou jen dospělí", why: "O to nejde." },
    { value: "porovnávání vždy pomáhá", why: "Porovnávání často ubližuje." },
  ], {
    hints: ["Jsou fotky na sociálních sítích vždycky skutečné?", "Fotky se upravují aplikacemi a filtry; skutečný člověk tak nevypadá."],
    explanation: "Fotky bývají upravené, proto porovnávání se s nimi škodí sebevědomí.",
  }),
  choice("Spolužák se ostatním posmívá kvůli akné. Jak se zachováš?", "zastanu se jich a řeknu, že je to normální", [
    { value: "přidám se k posměchu", why: "Posměch ubližuje." },
    { value: "budu dělat, že nic nevidím", why: "Mlčení posměch podporuje." },
    { value: "řeknu, že za to můžou sami", why: "Za akné nikdo nemůže." },
  ], {
    hints: ["Jak by ses cítil nebo cítila na jejich místě?", "Akné má v pubertě mnoho lidí; posměch jim jen ublíží."],
    explanation: "Akné je v pubertě běžné — je správné se zastat.",
  }),
  choice("Proč dospívající potřebují víc soukromí?", "stávají se samostatnějšími a mění se jim tělo", [
    { value: "přestanou mít rádi rodinu", why: "Rodinu mají rádi dál." },
    { value: "je to jen rozmar", why: "Je to přirozená potřeba." },
    { value: "soukromí je zakázané", why: "Soukromí je normální." },
  ], {
    hints: ["Co se v dospívání mění a o čem nechceš mluvit před všemi?", "S dospíváním přichází stud a potřeba mít vlastní prostor."],
    explanation: "Dospívající se osamostatňují a mění se jim tělo, proto potřebují víc soukromí.",
  }),
  choice("Jak se může v dospívání změnit vztah s rodiči?", "víc se radíme a dostávám víc zodpovědnosti", [
    { value: "rodiče se už nemusí starat", why: "Rodiče se starají dál." },
    { value: "přestaneme spolu mluvit", why: "Mluvit spolu je důležité." },
    { value: "rodiče rozhodují úplně o všem", why: "Dospívající rozhodují stále víc sami." },
  ], {
    hints: ["Co ti rodiče postupně svěřují?", "Dospívající dostávají víc samostatnosti a rodiče se s nimi víc radí."],
    explanation: "V dospívání přibývá samostatnosti a zodpovědnosti.",
  }),
  choice("Babička už špatně vidí a pomalu chodí. Jak jí můžeš pomoct?", "doprovodit ji a pomoct s nákupem", [
    { value: "nechat ji všechno dělat samotnou", why: "Pomoc je pro ni důležitá." },
    { value: "smát se jí", why: "Posměch ubližuje." },
    { value: "mluvit s ní míň", why: "Starší lidé potřebují společnost." },
  ], {
    hints: ["S čím mají starší lidé potíže?", "Stačí malá pomoc: doprovod, nákup nebo přečtení drobného písma."],
    explanation: "Starším lidem pomůže doprovod a pomoc s běžnými věcmi.",
  }),
  choice("Proč je puberta dobrý čas naučit se o sebe pečovat?", "návyky z mládí si člověk nese do dospělosti", [
    { value: "v dospělosti se už nic nemění", why: "Návyky se dají měnit, ale těžce." },
    { value: "péče o sebe je jen pro dospělé", why: "Péče o sebe je pro každého." },
    { value: "v pubertě se nemusí nic dodržovat", why: "Právě teď se návyky utvářejí." },
  ], {
    hints: ["Jak se mění zvyky, které máš dlouho?", "Co se naučíš teď — spánek, pohyb, hygiena — ti vydrží na celý život."],
    explanation: "Návyky z dospívání si člověk nese do dospělosti.",
  }),
  choice("Co je pravda o dospívání?", "je to přirozená proměna z dítěte v dospělého", [
    { value: "je to nemoc, která se léčí", why: "Dospívání není nemoc." },
    { value: "týká se jen dívek", why: "Týká se dívek i chlapců." },
    { value: "trvá jen pár dní", why: "Trvá několik let." },
  ], {
    hints: ["Kdo pubertou prochází a jak dlouho trvá?", "Dospívá každý — dívky i chlapci — a trvá to několik let."],
    explanation: "Dospívání je přirozená proměna, kterou prochází každý člověk.",
  }),
  choice("Proč se v pubertě může změnit, co tě baví?", "mění se mozek, zájmy i kamarádi", [
    { value: "to se nikdy nestává", why: "Zájmy se v pubertě mění často." },
    { value: "kvůli počasí", why: "Počasí zájmy nemění." },
    { value: "zájmy určují jen rodiče", why: "Zájmy si volíš sám nebo sama." },
  ], {
    hints: ["Mění se v pubertě jen tělo?", "Mozek v dospívání dozrává a člověk hledá, co ho baví a kým chce být."],
    explanation: "V pubertě se mění mozek i zájmy — je to normální.",
  }),
  choice("Co vede ke zdravému sebevědomí?", "všímat si, co mi jde, a učit se nové věci", [
    { value: "porovnávat se jen s nejlepšími", why: "Takové porovnávání sebevědomí snižuje." },
    { value: "věřit každé kritice na internetu", why: "Kritika cizích lidí nemusí být pravdivá." },
    { value: "nic nezkoušet, abych neudělal chybu", why: "Chyby jsou součást učení." },
  ], {
    hints: ["Kdy se cítíš dobře sám nebo sama se sebou?", "Sebevědomí roste, když vidíš, co umíš, a odvážíš se zkoušet to, co jsi ještě nedělal nebo nedělala."],
    explanation: "Zdravé sebevědomí roste z toho, co umíme a čemu se učíme.",
  }),
  choice("Kamarádce se nelíbí, jak se jí mění tělo. Co jí pomůže?", "vědět, že je to normální a přechodné", [
    { value: "začít držet přísnou dietu", why: "Rostoucí tělo potřebuje živiny." },
    { value: "schovávat se před všemi", why: "Schovávání nepomůže." },
    { value: "věřit, že je s ní něco špatně", why: "Změny jsou normální." },
  ], {
    hints: ["Mají podobné pocity i ostatní?", "Mnoho dospívajících se cítí ve svém těle nejistě; změny jsou normální a časem se ustálí."],
    explanation: "Pomůže vědět, že změny jsou normální a projde jimi každý.",
  }),
  choice("Proč lidé v různých etapách života potřebují různé věci?", "tělo i povinnosti se během života mění", [
    { value: "všichni potřebují úplně totéž", why: "Potřeby se s věkem mění." },
    { value: "potřeby se mění jen v zimě", why: "Nejde o roční období." },
    { value: "potřeby určuje jen škola", why: "Potřeby určuje hlavně věk a tělo." },
  ], {
    hints: ["Co potřebuje miminko a co babička?", "Miminko potřebuje mléko a péči, školák vzdělání, dospělý práci a starší člověk pomoc."],
    explanation: "S věkem se mění tělo i povinnosti, a tak i potřeby.",
  }),
  choice("Někdo tě na internetu tlačí, abys mu posílal nebo posílala fotky. Co uděláš?", "přestanu odpovídat a řeknu to dospělému", [
    { value: "pošlu fotku, aby dal pokoj", why: "Poslaná fotka se může zneužít." },
    { value: "nikomu nic neřeknu", why: "Mlčení nepomůže, svěř se." },
    { value: "domluvím si s ním schůzku", why: "S cizím člověkem z internetu se nesetkávej." },
  ], {
    hints: ["Kdo ti v takové situaci pomůže?", "Na nátlak nereaguj, nic neposílej a svěř se rodičům, učiteli nebo Lince bezpečí."],
    explanation: "Nic neposílej, přestaň odpovídat a řekni to dospělému, kterému věříš.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const ETAPYLIDSKEHOZIVOTADOSPIVANI: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-etapy-lidskeho-zivota-dospivani",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-etapy-lidskeho-zivota-dospivani",
    title: "Etapy lidského života, dospívání",
    studentTitle: "Etapy života",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Vývoj člověka a rozmnožování",
    briefDescription: "Poznáš etapy lidského života a co se děje při dospívání.",
    keywords: ["puberta", "dospívání", "hormony", "etapy", "adolescence", "duševní zdraví", "sebeúcta"],
    goals: ["Vyjmenovat etapy lidského života", "Popsat tělesné a emocionální změny v pubertě", "Pochopit, že změny v pubertě jsou normální"],
    boundaries: [
      "Neprobírá psychopatologii dospívání",
      "Neprobírá podrobně pohlavní anatomii",
      "Neprobírá stavbu a zrání mozku — patří na 2. stupeň",
      "Neprobírá psychologické teorie vývoje (Erikson) ani neurochemii",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Etapy: kojenec (0–1), batole (1–3), předškolní (3–6), školní (6–11), puberta (11–18), dospělost (18–65), stáří (65+).",
      steps: [
        "Kojenec: 0–1 rok. Batole: 1–3 roky.",
        "Předškolní: 3–6 let. Školní: 6–11 let.",
        "Puberta/adolescence: 11–18 let.",
        "Tělesné změny: růst, hormony (estrogen/testosteron), pohlavní znaky.",
        "Emocionální: hledání identity, vrstevníci, citlivost.",
      ],
      commonMistake: "Změny v pubertě jsou NORMÁLNÍ – každý prochází pubertou jinak a v jiném čase.",
      example: "Dívky: puberta 10–13 let. Chlapci: 11–14 let. Obě skupiny: hormony způsobují tělesné i emocionální změny.",
    },
  },
];
