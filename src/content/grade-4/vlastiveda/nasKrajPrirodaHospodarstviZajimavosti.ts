/**
 * Vlastivěda 4. ročník — Náš kraj: příroda, hospodářství, zajímavosti.
 *
 * Přepsáno 2026-09-11. Úlohy měly jednu nápovědu, „postup“, který zopakoval
 * odpověď, žádnou diagnostiku a gramatickou chybu („pracovních míst v výrobě“).
 * Správné odpovědi byly často mnohem delší než ostatní a prozrazovaly se.
 *
 * Téma nezná kraj konkrétního dítěte, proto se ptá na pojmy a souvislosti
 * platné pro každý kraj a příklady bere z celého Česka.
 *
 * Gradace:
 *  • L1 — pojmy: obec, kraj, krajské město, zemědělství, průmysl, památky.
 *  • L2 — jak kraj hospodaří a kdo o něm rozhoduje, regionální výrobky.
 *  • L3 — souvislosti: práce a příroda, proč se hospodářství mění, co kraji
 *         dává jeho krajina.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

const POOL_L1: PracticeTask[] = [
  choice("Co patří k přírodě kraje?", "Hory, řeky, lesy a louky", [
    { value: "Silnice a parkoviště", why: "Silnice a parkoviště postavili lidé, přírodou nejsou." },
    { value: "Továrny a sklady", why: "Továrny patří k hospodářství, ne k přírodě." },
    { value: "Obchody a úřady", why: "Obchody a úřady postavili lidé." },
  ], {
    hints: ["Příroda je to, co nepostavili lidé.", "Hledej věci, které by v krajině byly, i kdyby tam nikdy nežili lidé."],
    explanation: "K přírodě kraje patří hory, řeky, lesy, louky a živočichové. Silnice, továrny a obchody postavili lidé.",
  }),
  choice("Jak se jmenuje úřad, který spravuje kraj?", "Krajský úřad", [
    { value: "Obecní úřad", why: "Obecní úřad spravuje jednu obec, ne celý kraj." },
    { value: "Vláda", why: "Vláda řídí celý stát." },
    { value: "Ředitelství školy", why: "Ředitelství vede školu." },
  ], {
    hints: ["Jméno úřadu je odvozené od slova kraj.", "Obec má obecní úřad, stát má vládu. Co má kraj?"],
    explanation: "Kraj spravuje krajský úřad. Sídlí v krajském městě a stará se třeba o silnice, nemocnice a střední školy v kraji.",
  }),
  choice("Jak se jmenuje město, ve kterém sídlí krajský úřad?", "Krajské město", [
    { value: "Hlavní město", why: "Hlavní město je jen jedno pro celý stát — Praha." },
    { value: "Obec", why: "Obec je každé místo s vlastním úřadem, nejen centrum kraje." },
    { value: "Vesnice", why: "Krajský úřad sídlí ve velkém městě, ne na vesnici." },
  ], {
    hints: ["Každý z krajů má jedno takové město.", "Pro Jihomoravský kraj je to Brno, pro Plzeňský Plzeň. Jak se takovému městu říká?"],
    explanation: "Krajské město je centrum kraje, ve kterém sídlí krajský úřad. Česko má 14 krajů, a tedy 14 krajských měst.",
  }),
  choice("Které odvětví se zabývá pěstováním rostlin a chovem zvířat?", "Zemědělství", [
    { value: "Průmysl", why: "Průmysl vyrábí zboží v továrnách." },
    { value: "Cestovní ruch", why: "Cestovní ruch se stará o turisty." },
    { value: "Obchod", why: "Obchod prodává zboží." },
  ], {
    hints: ["Kdo pracuje na polích a na farmách?", "Pěstuje obilí, zeleninu a chová krávy a prasata. Jak se tomu odvětví říká?"],
    explanation: "Zemědělství pěstuje rostliny a chová hospodářská zvířata. Daří se mu hlavně v nížinách s úrodnou půdou.",
  }),
  choice("Co je průmysl?", "Výroba zboží v továrnách", [
    { value: "Pěstování obilí", why: "Pěstování obilí je zemědělství." },
    { value: "Cestování za památkami", why: "To je cestovní ruch." },
    { value: "Rybaření v řekách", why: "Rybaření je jiná činnost, ne průmysl." },
  ], {
    hints: ["Kde se vyrábějí auta, sklo nebo boty?", "Průmysl vyrábí věci ve velkém — v továrnách a halách se stroji."],
    explanation: "Průmysl je výroba zboží v továrnách, třeba aut, skla nebo potravin. Dává práci mnoha lidem.",
  }),
  choice("Co je cestovní ruch?", "Cestování lidí za poznáním a odpočinkem", [
    { value: "Doprava zboží kamiony", why: "Doprava zboží patří k dopravě, ne k cestovnímu ruchu." },
    { value: "Stavba nových silnic", why: "Stavba silnic je stavebnictví." },
    { value: "Pěstování zeleniny", why: "Pěstování zeleniny je zemědělství." },
  ], {
    hints: ["Týká se to turistů.", "Lidé jezdí na hory, k rybníkům, na hrady a do lázní. Jak se tomu odvětví říká?"],
    explanation: "Cestovní ruch je cestování lidí za poznáním a odpočinkem. Kraje z něj mají příjmy — z hotelů, restaurací a vstupného.",
  }),
  choice("Co je kulturní památka?", "Stavba nebo věc důležitá pro historii", [
    { value: "Nová dálnice", why: "Nová dálnice není památka." },
    { value: "Parkoviště u obchodu", why: "Parkoviště památkou není." },
    { value: "Chráněný les", why: "Chráněný les je přírodní památka, ne kulturní." },
  ], {
    hints: ["Kulturní památku postavili nebo vytvořili lidé dávno.", "Patří sem hrady, zámky, kostely nebo staré domy na náměstí. Proč je chráníme?"],
    explanation: "Kulturní památka je stavba nebo věc, kterou vytvořili lidé a která je důležitá pro historii — třeba hrad Karlštejn nebo Karlův most.",
  }),
  choice("Co je přírodní památka?", "Chráněné místo se vzácnou přírodou", [
    { value: "Starý hrad", why: "Hrad postavili lidé, je to kulturní památka." },
    { value: "Městský park s lavičkami", why: "Park je upravený lidmi, přírodní památkou nebývá." },
    { value: "Nádraží", why: "Nádraží je stavba, ne příroda." },
  ], {
    hints: ["Přírodní památku nevytvořili lidé.", "Může to být skála, jeskyně, vzácná louka nebo prastarý strom. Co je chráněno?"],
    explanation: "Přírodní památka je chráněné místo se vzácnou přírodou — třeba skalní útvar, jeskyně nebo louka se vzácnými květinami.",
  }),
  choice("Kde v kraji žije nejvíc lidí?", "Ve městech", [
    { value: "V horách", why: "V horách žije méně lidí, je tam chladno a málo práce." },
    { value: "V lesích", why: "V lesích skoro nikdo nebydlí." },
    { value: "Na polích", why: "Na polích lidé pracují, ale bydlí v obcích." },
  ], {
    hints: ["Kde je nejvíc domů, škol a práce?", "V krajském městě žije i sto tisíc lidí, na vesnici jen stovky. Kde je jich tedy víc?"],
    explanation: "Nejvíc lidí žije ve městech, kde je práce, školy, nemocnice a obchody. V horách a na venkově žije méně lidí.",
  }),
  choice("Kde se dozvíš o historii svého kraje?", "V muzeu", [
    { value: "V supermarketu", why: "V supermarketu se nakupuje." },
    { value: "Na poště", why: "Na poště se posílají dopisy a balíky." },
    { value: "Na benzínce", why: "Na benzínce se tankuje." },
  ], {
    hints: ["Kde jsou vystavené staré předměty a obrazy?", "Tahle budova uchovává nálezy, staré nástroje a příběhy kraje. Jak se jmenuje?"],
    explanation: "O historii kraje se nejvíc dozvíš v muzeu, kde jsou vystavené staré předměty, nálezy a obrazy. Pomůže i knihovna nebo kronika obce.",
  }),
  choice("Co je tradice?", "Zvyky předávané z generace na generaci", [
    { value: "Nejnovější technika a vynálezy", why: "Nová technika je opakem tradice." },
    { value: "Moderní stavby ze skla a betonu", why: "Moderní stavby jsou nové, ne tradiční." },
    { value: "To, co je právě v módě", why: "Móda se rychle mění. Tradice trvá dlouho." },
  ], {
    hints: ["Tradice dodržovali už tvoji prarodiče.", "Třeba masopust, velikonoční pomlázka nebo zdobení vánočního stromku. Co mají společného?"],
    explanation: "Tradice jsou zvyky, řemesla a oslavy, které se předávají z generace na generaci — třeba masopust, dožínky nebo pouť.",
  }),
  choice("Co jsou regionální výrobky?", "Výrobky typické pro určitý kraj", [
    { value: "Zboží dovezené z ciziny", why: "Dovezené zboží pochází odjinud, ne z kraje." },
    { value: "Výrobky světových firem", why: "Světové firmy prodávají všude stejné věci." },
    { value: "Věci z internetu", why: "Nejde o to, kde se kupují, ale odkud pocházejí." },
  ], {
    hints: ["Jsou spojené s místem, odkud pocházejí.", "Třeba perník z Pardubic, oplatky z Karlových Varů nebo sýr z Olomouce. Co mají společné?"],
    explanation: "Regionální výrobky jsou typické pro určitý kraj — třeba pardubický perník, karlovarské oplatky nebo olomoucké tvarůžky.",
  }),
  choice("Jak se jmenuje nejmenší celek s vlastním úřadem, kde lidé žijí?", "Obec", [
    { value: "Kraj", why: "Kraj je mnohem větší, patří do něj mnoho obcí." },
    { value: "Stát", why: "Stát je největší celek." },
    { value: "Kontinent", why: "Kontinent je díl světa, ne správní celek." },
  ], {
    hints: ["Vesnice i město jsou tohle.", "Má starostu a vlastní úřad. Do jednoho kraje patří stovky takových celků."],
    explanation: "Obec je nejmenší celek s vlastním úřadem a starostou. Obcí je v kraji mnoho, kraje tvoří stát.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Proč se v nížinách pěstuje hodně obilí?", "Je tam úrodná půda a teplo", [
    { value: "Jsou blízko moře", why: "Česko u moře neleží." },
    { value: "Je tam nejvíc lesů", why: "Lesy nejsou pole. Obilí potřebuje úrodnou půdu a teplo." },
    { value: "V horách je obilí zakázané", why: "Zakázané není, jen se tam kvůli chladu nedaří." },
  ], {
    hints: ["Co potřebuje obilí, aby dalo velkou úrodu?", "Obilí potřebuje dlouhé teplé léto a půdu s dostatkem živin. Kde toho je víc?"],
    explanation: "V nížinách je teplé podnebí a úrodná půda, proto jsou tam pole s obilím, cukrovkou a kukuřicí. V horách je na to chladno.",
  }),
  choice("Čím se nejčastěji živí lidé v horských obcích?", "Lesnictvím a cestovním ruchem", [
    { value: "Pěstováním obilí", why: "V horách je na obilí chladno a svahy jsou strmé." },
    { value: "Rybolovem v moři", why: "Česko u moře neleží." },
    { value: "Těžkým průmyslem", why: "Velké továrny bývají spíš ve městech v nížinách." },
  ], {
    hints: ["Co je v horách hodně a kdo tam jezdí?", "V horách rostou velké lesy a v zimě i v létě tam jezdí lyžaři a turisté."],
    explanation: "V horách jsou velké lesy a přijíždí tam hodně turistů. Lidé proto pracují v lesnictví a v hotelech, restauracích a lyžařských areálech.",
  }),
  choice("Co znamená, že je kraj průmyslový?", "Je v něm hodně továren a lidé pracují ve výrobě", [
    { value: "Je v něm hodně lesů", why: "Hodně lesů mají spíš horské kraje." },
    { value: "Jezdí do něj hodně turistů", why: "To by znamenalo cestovní ruch." },
    { value: "Má hodně polí", why: "Hodně polí mají zemědělské kraje." },
  ], {
    hints: ["Průmysl znamená výrobu.", "V průmyslovém kraji stojí továrny, huti a dříve i doly. V čem tam asi hledají práci?"],
    explanation: "Průmyslový kraj má hodně továren, hutí a dříve i dolů a lidé pracují ve výrobě. Příkladem je Moravskoslezský kraj s Ostravou.",
  }),
  choice("Jak turisté pomáhají hospodářství kraje?", "Utrácejí peníze v hotelech a restauracích", [
    { value: "Stavějí v kraji nové továrny", why: "Turisté továrny nestavějí." },
    { value: "Obdělávají místní pole", why: "Turisté pole neobdělávají." },
    { value: "Nijak, jen zabírají místo", why: "Pomáhají, protože v kraji utrácejí peníze." },
  ], {
    hints: ["Za co turisté na výletě platí?", "Turisté spí v hotelu, jedí v restauraci a kupují vstupenky na hrad. Kdo z toho má užitek?"],
    explanation: "Turisté platí za ubytování, jídlo, vstupné a suvenýry. Tím dávají práci místním lidem a přinášejí do kraje peníze.",
  }),
  choice("Proč kraj potřebuje dobré silnice a železnice?", "Aby lidé a zboží snadno cestovali", [
    { value: "Aby vypadal hezky", why: "Nejde o vzhled, ale o dopravu." },
    { value: "Aby měl méně aut", why: "Dobré silnice auta nepřidávají ani neubírají." },
    { value: "Aby nemusel mít školy", why: "Doprava školy nenahradí." },
  ], {
    hints: ["Jak se lidé dostanou do práce a zboží do obchodů?", "Po silnicích a kolejích jezdí lidé do škol a do práce a nákladní auta vozí zboží. Co by se stalo bez nich?"],
    explanation: "Silnice a železnice spojují obce a města. Lidé po nich jezdí do práce a do školy a vozí se po nich zboží do obchodů a továren.",
  }),
  choice("Jak se liší obec od kraje?", "Kraj je velký a leží v něm mnoho obcí", [
    { value: "Obec je větší než kraj", why: "Je to naopak — kraj tvoří mnoho obcí." },
    { value: "Obec a kraj jsou totéž", why: "Obec je jedno město nebo vesnice, kraj je velké území." },
    { value: "Kraj je jen jedna vesnice", why: "Kraj je velké území s mnoha obcemi." },
  ], {
    hints: ["Kolik obcí je v jednom kraji?", "Obec je třeba jedna vesnice nebo město se starostou. Kraj je velký kus země s krajským městem."],
    explanation: "Obec je vesnice nebo město se starostou. Kraj je mnohem větší území a patří do něj stovky obcí.",
  }),
  choice("Proč se chrání přírodní památky?", "Aby vzácná příroda nezanikla", [
    { value: "Aby se na nich dalo stavět", why: "Na chráněných místech se stavět nesmí." },
    { value: "Aby nikdo nesměl do přírody", why: "Do přírody se smí, jen šetrně." },
    { value: "Aby se z nich těžilo", why: "Těžba by je zničila." },
  ], {
    hints: ["Co by se stalo se vzácnou skálou nebo loukou, kdyby ji nikdo nechránil?", "Vzácná místa se snadno zničí stavbou, těžbou nebo sešlapáním a už se nikdy nevrátí. Proč se tedy chrání a kdo z toho má užitek?"],
    explanation: "Přírodní památky se chrání, aby vzácná příroda nezanikla a mohly ji poznat i další generace.",
  }),
  choice("Co jsou přírodní zdroje?", "Voda, půda, lesy a nerosty", [
    { value: "Hrady a zámky", why: "Hrady a zámky jsou kulturní památky." },
    { value: "Silnice a mosty", why: "Silnice a mosty postavili lidé." },
    { value: "Obchody a banky", why: "Obchody a banky nejsou přírodní zdroje." },
  ], {
    hints: ["Přírodní zdroje dává lidem příroda.", "Z přírody bereme vodu na pití, dřevo z lesa, úrodnou půdu a uhlí nebo kámen ze země."],
    explanation: "Přírodní zdroje jsou věci, které nám dává příroda: voda, úrodná půda, lesy a nerosty jako uhlí nebo kámen.",
  }),
  choice("Jak může řeka pomáhat hospodářství kraje?", "Dává vodu, dopravu a elektřinu", [
    { value: "Jen dělá povodně", why: "Povodně bývají, ale řeka dává i vodu a energii." },
    { value: "Brání dopravě", why: "Po řece se naopak dá přepravovat zboží." },
    { value: "Nijak nepomáhá", why: "Řeka je pro kraj velmi užitečná." },
  ], {
    hints: ["Co všechno se dá s řekou dělat?", "Z řeky se bere voda, po Labi jezdí lodě a na přehradách se vyrábí elektřina."],
    explanation: "Řeka dává vodu pro lidi i továrny, po větších řekách jezdí lodě a přehrady na nich vyrábějí elektřinu. Může ale i zaplavit okolí.",
  }),
  choice("Který výrobek je typický pro Pardubice?", "Pardubický perník", [
    { value: "Japonský čaj", why: "Čaj z Japonska není český regionální výrobek." },
    { value: "Italská pizza", why: "Pizza pochází z Itálie." },
    { value: "Americká kola", why: "Kola je americký nápoj." },
  ], {
    hints: ["Hledej výrobek, který nese jméno města.", "Je to sladké pečivo s kořením a medem, často zdobené bílou polevou."],
    explanation: "Pardubický perník je regionální výrobek spojený s Pardubicemi. Každý kraj má něco podobného — třeba olomoucké tvarůžky.",
  }),
  choice("Kdo rozhoduje o věcech celého kraje?", "Krajské zastupitelstvo, které volí lidé", [
    { value: "Ředitel jedné školy", why: "Ředitel vede jen svou školu." },
    { value: "Starosta jedné obce", why: "Starosta vede jen svou obec." },
    { value: "Každý obyvatel sám za sebe", why: "Lidé volí zástupce, kteří rozhodují za ně." },
  ], {
    hints: ["Lidé v kraji si ho volí ve volbách.", "Obec má zastupitelstvo a starostu. Kraj má také zvolené zastupitele a v čele hejtmana."],
    explanation: "O kraji rozhoduje krajské zastupitelstvo, které si lidé volí ve volbách. V čele kraje stojí hejtman.",
  }),
  choice("Proč jsou v kraji muzea a galerie?", "Uchovávají historii a umění pro další generace", [
    { value: "Aby vydělávaly nejvíc peněz", why: "Muzea peníze nevydělávají ve velkém. Jejich úkolem je uchovat historii." },
    { value: "Aby tam sídlily úřady", why: "Úřady sídlí jinde." },
    { value: "Aby děti nemusely do školy", why: "Muzea školu nenahrazují, ale doplňují." },
  ], {
    hints: ["Co by se stalo se starými nálezy a obrazy, kdyby je nikdo neschoval?", "Muzea opatrují staré předměty a galerie obrazy, aby je mohli vidět i lidé za sto let."],
    explanation: "Muzea a galerie uchovávají staré předměty, nálezy a obrazy. Díky nim poznáme historii a umění kraje i za mnoho let.",
  }),
  choice("Kde najdeš informace pro turisty?", "V informačním centru", [
    { value: "V bance", why: "V bance se řeší peníze." },
    { value: "Na úřadu práce", why: "Úřad práce pomáhá hledat zaměstnání." },
    { value: "V nemocnici", why: "Nemocnice léčí nemocné." },
  ], {
    hints: ["Hledej místo s velkým písmenem „i“ na ceduli.", "Dostaneš tam mapy, tipy na výlety a informace o památkách."],
    explanation: "Informační centrum poznáš podle značky „i“. Dostaneš tam mapy, tipy na výlety a informace o památkách a akcích.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Továrna dává lidem práci, ale z komína se kouří. Co je potřeba?", "Vyrábět tak, aby se příroda neničila", [
    { value: "Továrnu hned zavřít", why: "Lidé by přišli o práci. Lepší je vyrábět šetrněji." },
    { value: "Kouř nevadí, práce je důležitější", why: "Znečištěný vzduch škodí zdraví lidí i přírodě." },
    { value: "Postavit komín ještě vyšší", why: "Vyšší komín odnese kouř dál, ale ten dál škodí." },
  ], {
    hints: ["Mají pravdu ti, kdo chtějí práci, i ti, kdo chtějí čistý vzduch?", "Hledej řešení, které zachová práci a zároveň sníží znečištění — třeba filtry na komínech."],
    explanation: "Průmysl dává práci, ale může znečišťovat přírodu. Nejlepší je hledat cestu, jak vyrábět šetrně — třeba filtry, čistší technologie a úsporu energie.",
  }),
  choice("Proč se v horských obcích lidé živí hlavně turisty?", "Pole se tam obdělávají špatně, ale hory lákají", [
    { value: "V horách je nejvíc továren", why: "Továren je v horách málo." },
    { value: "V horách se nesmí pracovat", why: "V horách se pracovat smí." },
    { value: "Na horách nikdo nebydlí", why: "V horských obcích lidé bydlí." },
  ], {
    hints: ["Co nabízejí hory a co jim chybí?", "V horách je chladno a svahy jsou strmé, ale je tam sníh, lesy a krásné výhledy. Kdo za tím přijede?"],
    explanation: "V horách se kvůli chladu a svahům špatně hospodaří na polích. Hory ale lákají lyžaře a turisty, a tak se lidé živí hlavně cestovním ruchem.",
  }),
  choice("Podle čeho poznáš zemědělský kraj od průmyslového?", "Zemědělský má pole a farmy, průmyslový továrny", [
    { value: "Zemědělský je vždy větší", why: "Velikost kraje neurčuje, čím se lidé živí." },
    { value: "Průmyslový má víc lesů", why: "Lesy s průmyslem nesouvisejí." },
    { value: "Zemědělský nemá žádná města", why: "I zemědělský kraj má města." },
  ], {
    hints: ["Čím se v kraji lidé nejvíc živí?", "Když jedeš krajem a vidíš hlavně pole a stáje, je to jeden typ. Když vidíš komíny a haly, je to druhý."],
    explanation: "V zemědělském kraji převládají pole, sady a farmy, v průmyslovém továrny, haly a dříve i doly. Většina krajů má obojí, jen v jiném poměru.",
  }),
  choice("Proč se hospodářství kraje během let mění?", "Staré obory zanikají a vznikají nové", [
    { value: "Hospodářství se nikdy nemění", why: "Mění se — třeba doly na Ostravsku se zavřely." },
    { value: "Mění ho jen počasí", why: "Počasí ho ovlivní, ale hlavně se mění technika a potřeby lidí." },
    { value: "Každý rok se všechno vymění", why: "Změny jsou postupné, ne každý rok všechno." },
  ], {
    hints: ["Vzpomeň si na Ostravu. Kdysi tam byly doly. Jak je to dnes?", "Doly se zavřely a místo nich vznikly nové firmy, obchody a služby. Proč se to děje?"],
    explanation: "Technika a potřeby lidí se mění. Staré obory, jako těžba uhlí, zanikají a vznikají nové, třeba výroba aut, počítačové firmy nebo služby.",
  }),
  choice("Proč je dobré kupovat zeleninu od místních pěstitelů?", "Nevozí se z daleka a podpoří se místní lidé", [
    { value: "Je vždy levnější než v obchodě", why: "Nemusí být levnější. Výhoda je čerstvost a krátká cesta." },
    { value: "Nikdy se nekazí", why: "Kazí se jako každá zelenina." },
    { value: "Je větší než dovezená", why: "Velikost nerozhoduje." },
  ], {
    hints: ["Jak daleko cestuje rajče ze Španělska a jak ze sousední vesnice?", "Kratší cesta znamená čerstvější zeleninu a méně jízd kamionů. A komu tvoje peníze pomůžou?"],
    explanation: "Zelenina od místních pěstitelů se nevozí stovky kilometrů, je čerstvá a doprava méně znečišťuje vzduch. Peníze zůstanou lidem v kraji.",
  }),
  choice("Kolem velkých měst se stavějí domy a obchody na místě polí. Co se tím změní?", "Město roste, ale ubývá polí a přírody", [
    { value: "Polí kolem města přibude", why: "Pole se naopak zastavují." },
    { value: "Krajina zůstane úplně stejná", why: "Změní se — z polí se stanou domy a parkoviště." },
    { value: "Město se tím zmenší", why: "Město se tím naopak rozroste." },
  ], {
    hints: ["Co bylo na místě nového obchodního centra dřív?", "Když se na poli postaví domy a parkoviště, co zmizí a kam se schovají zajíci a koroptve?"],
    explanation: "Když se staví na polích, město roste a lidé mají domy a obchody. Ubývá ale úrodné půdy a přírody a voda se hůř vsakuje.",
  }),
  choice("Obec chce na místě staré aleje postavit parkoviště. O čem je dobré přemýšlet?", "Co lidé získají a co ztratí příroda", [
    { value: "Jen o tom, kolik aut se vejde", why: "Počet míst je důležitý, ale stromy dávají stín a domov ptákům." },
    { value: "Stromy nejsou vůbec důležité", why: "Stromy dávají stín, čistí vzduch a žijí v nich ptáci." },
    { value: "O barvě čar na parkovišti", why: "To je drobnost. Důležitější je, co zmizí." },
  ], {
    hints: ["Mají pravdu jen řidiči, nebo i ti, kdo mají rádi stromy?", "Parkoviště pomůže řidičům, ale stromy dávají stín, čistý vzduch a domov ptákům. Co je potřeba zvážit?"],
    explanation: "Při každé stavbě je dobré zvážit, co lidé získají a co ztratí příroda. Někdy se najde řešení, které zachová obojí — třeba parkoviště jinde.",
  }),
  choice("Proč se zachovávají lidové tradice, jako masopust nebo dožínky?", "Připomínají, jak žili naši předkové", [
    { value: "Protože je to povinné", why: "Povinné to není. Lidé je dodržují, protože jim na nich záleží." },
    { value: "Aby se nemuselo pracovat", why: "Nejde o volno, ale o připomínku historie a společenství." },
    { value: "Protože jsou úplně nové", why: "Tradice jsou naopak staré." },
  ], {
    hints: ["Kdo slavil masopust a dožínky před sto lety?", "Dožínky slavily konec žní a masopust konec zimy. Co nám dnes připomínají?"],
    explanation: "Tradice připomínají, jak žili naši předkové, a spojují lidi v obci. Dožínky slavily konec žní a masopust konec zimy a začátek půstu.",
  }),
  choice("Proč je řeka pro město výhodná i nebezpečná?", "Dává vodu, ale při povodni zaplaví domy", [
    { value: "Řeka je jen výhodná", why: "Řeka může být i nebezpečná, když se vylije." },
    { value: "Řeka je jen nebezpečná", why: "Řeka dává i vodu, dopravu a krásné místo k procházkám." },
    { value: "Řeka se městem nijak nesouvisí", why: "Mnoho měst vzniklo právě u řek." },
  ], {
    hints: ["Proč vznikla většina měst u řek? A co se stane po velkých deštích?", "Z řeky se bere voda a kdysi byla i cestou pro lodě. Když ale napadne hodně deště, vystoupí z břehů a zaplaví okolí."],
    explanation: "Řeka dává městu vodu, dopravu a krásné nábřeží. Při velkých deštích se ale může vylít a zaplavit domy, proto se stavějí hráze a přehrady.",
  }),
  choice("Proč bývají krajská města velká?", "Jsou v nich úřady, školy, nemocnice a práce", [
    { value: "Leží vždy u velkého moře", why: "Česko u moře neleží." },
    { value: "Kolem nich je nejvíc polí a luk", why: "Pole jsou spíš na venkově." },
    { value: "Nikdo jiný je nechce, tak rostou", why: "Naopak, do krajských měst se lidé stěhují kvůli práci a službám." },
  ], {
    hints: ["Kam jezdí lidé z celého kraje na úřad, do nemocnice nebo do střední školy?", "V krajském městě je krajský úřad, velká nemocnice a mnoho škol a firem. Co to udělá s počtem obyvatel?"],
    explanation: "V krajském městě jsou krajský úřad, velké nemocnice, střední a vysoké školy a mnoho firem. Proto tam lidé jezdí a stěhují se a město roste.",
  }),
  choice("Jak se můžeš dozvědět o historii své obce?", "V muzeu, v kronice obce a od starších lidí", [
    { value: "Jen z reklam v televizi", why: "Reklamy o historii obce neinformují." },
    { value: "Historie obcí se nikde nezapisuje", why: "Zapisuje — do obecní kroniky." },
    { value: "Jen od kamarádů ze třídy", why: "Kamarádi toho vědí málo. Víc prozradí kronika a starší lidé." },
  ], {
    hints: ["Kdo si pamatuje, jak obec vypadala před padesáti lety?", "Každá obec má kroniku, kam se zapisují události. A dědeček nebo babička ti řeknou, co zažili."],
    explanation: "O historii obce se dozvíš v místním muzeu, v obecní kronice, ve starých fotografiích a od starších lidí, kteří si pamatují, jak se obec měnila.",
  }),
  choice("Proč se na jižní Moravě pěstuje víno a v Krkonoších se lyžuje?", "Každý kraj využívá to, co mu dává příroda", [
    { value: "Je to náhoda", why: "Není to náhoda. Záleží na podnebí a krajině." },
    { value: "Na jižní Moravě je lyžování zakázané", why: "Zakázané není, jen tam není dost sněhu a hor." },
    { value: "V Krkonoších víno nikdo nechce", why: "V Krkonoších by réva nedozrála kvůli chladu." },
  ], {
    hints: ["Jaké podnebí je na jižní Moravě a jaké v Krkonoších?", "Na jižní Moravě je teplo a slunce pro révu, v Krkonoších sníh a svahy pro lyžaře. Co z toho plyne?"],
    explanation: "Každý kraj využívá to, co mu nabízí příroda. Teplá jižní Morava je vhodná pro vinnou révu, zasněžené Krkonoše pro lyžování.",
  }),
  choice("Proč se dříve na Ostravsku těžilo uhlí?", "Pod zemí tam byly velké zásoby uhlí", [
    { value: "Uhlí se tam dováželo", why: "Uhlí se tam naopak těžilo ze země." },
    { value: "Ostrava leží u moře", why: "Ostrava u moře neleží." },
    { value: "V Ostravě byly nejvyšší hory", why: "Hory s těžbou uhlí nesouvisejí." },
  ], {
    hints: ["Co se na Ostravsku kdysi dobývalo z hlubokých šachet?", "Kvůli černým vrstvám hluboko v zemi tam vznikly doly a huti a Ostrava se stala průmyslovým městem."],
    explanation: "Na Ostravsku byly pod zemí velké zásoby černého uhlí. Proto tam vznikly doly a huti a Ostrava se stala centrem průmyslu. Dnes už se tam netěží.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const NASKRAJPRIRODAHOSPODARSTVIZAJIMAVOSTI: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-kraje-cr-nas-kraj-priroda-hospodarstvi-zajimavosti",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-kraje-cr-nas-kraj-priroda-hospodarstvi-zajimavosti",
    title: "Náš kraj - příroda, hospodářství, zajímavosti",
    studentTitle: "Náš kraj",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš, co tvoří přírodu a hospodářství kraje a jak se kraj spravuje.",
    keywords: ["kraj", "obec", "krajské město", "zemědělství", "průmysl", "cestovní ruch", "památky", "tradice"],
    goals: [
      "Rozlišit obec, kraj a krajské město",
      "Popsat přírodu a hospodářství kraje",
      "Rozlišit kulturní a přírodní památky",
      "Vysvětlit, jak příroda kraje ovlivňuje, čím se lidé živí",
    ],
    boundaries: ["Podrobné statistiky krajů nejsou cílem"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Kraj tvoří mnoho obcí. Centrem je krajské město s krajským úřadem.",
      steps: [
        "Příroda kraje: hory, řeky, lesy, louky.",
        "Hospodářství: zemědělství, průmysl, cestovní ruch.",
        "Památky: kulturní (hrady, zámky) a přírodní (skály, louky).",
        "Každý kraj využívá to, co mu nabízí jeho příroda.",
      ],
      commonMistake: "Obec a kraj nejsou totéž — kraj je velké území s mnoha obcemi.",
      example: "V horách se lidé živí hlavně cestovním ruchem, v nížinách zemědělstvím.",
    },
  },
];
