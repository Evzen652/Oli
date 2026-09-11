import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a zpětné vazby, klíče byly nápadně delší než distraktory
// a L3 obsahovala látku nad rámec 5. ročníku (regulace WHO, heroin).
// Teď: L1 co jsou návykové látky a jak škodí · L2 závislost a její projevy
// · L3 jak se zachovat v situacích, kdy mi někdo látku nabízí.

const L1: PracticeTask[] = [
  choice("Co je návyková látka?", "látka, která může způsobit závislost", [
    { value: "každý lék, který se prodává v lékárně", why: "Většina léků závislost nezpůsobuje, když se berou podle lékaře." },
    { value: "látka, která v malém množství vždy neškodí", why: "I malé množství návykové látky může škodit." },
    { value: "vitamín nebo minerál", why: "Vitamíny a minerály jsou pro tělo potřebné." },
  ], {
    hints: ["Co znamená slovo návyk?", "Návyková látka je taková, na kterou si tělo nebo mysl zvyknou a pak ji chtějí znovu a znovu."],
    explanation: "Návyková látka může vyvolat závislost — třeba alkohol, nikotin nebo drogy.",
  }),
  choice("Od kolika let se v Česku smí prodávat alkohol a cigarety?", "od 18 let", [
    { value: "od 15 let", why: "V 15 letech dostáváš občanský průkaz, alkohol ani cigarety se ti prodat nesmějí." },
    { value: "od 16 let", why: "Zákon stanoví hranici plnoletosti." },
    { value: "od 21 let", why: "V některých zemích je hranice 21 let, u nás je nižší." },
  ], {
    hints: ["Kdy je člověk v Česku plnoletý?", "Prodavač musí mladým lidem ukázat, že jim alkohol ani cigarety prodat nesmí, dokud nejsou dospělí."],
    explanation: "Alkohol a tabák se v Česku smějí prodávat jen lidem od 18 let.",
  }),
  choice("Ve kterém výrobku je nikotin?", "v cigaretách", [
    { value: "v ovocném čaji", why: "Ovocný čaj nikotin neobsahuje." },
    { value: "v minerálce", why: "Minerálka nikotin neobsahuje." },
    { value: "v mléce", why: "Mléko nikotin neobsahuje." },
  ], {
    hints: ["Nikotin je v listech jedné rostliny, která se kouří.", "Z listů tabáku se vyrábějí výrobky, které lidé kouří; nikotin v nich způsobuje závislost."],
    explanation: "Nikotin je v tabáku, a tedy v cigaretách.",
  }),
  choice("Jak alkohol působí na mozek?", "zpomaluje reakce a zhoršuje úsudek", [
    { value: "zrychluje myšlení a zlepšuje reakce", why: "Alkohol reakce naopak zpomaluje." },
    { value: "zlepšuje paměť a soustředění", why: "Alkohol paměť i soustředění zhoršuje." },
    { value: "na mozek nemá žádný vliv", why: "Alkohol ovlivňuje mozek velmi silně." },
  ], {
    hints: ["Proč se po alkoholu nesmí řídit auto?", "Opilý člověk reaguje pomalu, hůř odhadne nebezpečí a vrávorá."],
    explanation: "Alkohol tlumí mozek — zpomaluje reakce a zhoršuje rozhodování.",
  }),
  choice("Co je závislost?", "když člověk bez látky nebo činnosti nevydrží", [
    { value: "zdravý každodenní zvyk, třeba čištění zubů", why: "Zdravý zvyk člověku neškodí; závislost ano." },
    { value: "nemoc, která sama přejde za jeden den", why: "Závislost je dlouhodobá a těžko se léčí." },
    { value: "alergie na některé potraviny", why: "Alergie je něco jiného." },
  ], {
    hints: ["Co se stane se závislým člověkem, když látku nemá?", "Závislý člověk myslí hlavně na to, jak látku získat, a bez ní se cítí špatně."],
    explanation: "Závislost je stav, kdy člověk bez látky nebo činnosti nedokáže vydržet.",
  }),
  choice("Čemu kouření škodí nejvíc?", "plícím a srdci", [
    { value: "jen zubům", why: "Kouření zubům škodí, ale nejvíc plícím a srdci." },
    { value: "jen kůži", why: "Kůži škodí, ale nejvíc plícím a srdci." },
    { value: "ničemu, když se kouří jen občas", why: "Kouření škodí i občasným kuřákům." },
  ], {
    hints: ["Kam jde kouř, když se nadechne?", "Kouř jde do plic a jedovaté látky se z nich dostanou do krve; srdce pak musí pracovat víc."],
    explanation: "Kouření nejvíc poškozuje plíce a srdce.",
  }),
  choice("Co je pasivní kouření?", "vdechování kouře z cigaret druhých lidí", [
    { value: "kouření jen o víkendech", why: "I to je aktivní kouření." },
    { value: "kouření elektronické cigarety", why: "I to je kouření — aktivní." },
    { value: "držení cigarety bez zapálení", why: "Pasivní kouření znamená dýchat cizí kouř." },
  ], {
    hints: ["Může škodit kouř i tomu, kdo sám nekouří?", "Kdo sedí v zakouřené místnosti nebo v autě s kuřákem, dýchá stejné jedovaté látky."],
    explanation: "Pasivní kouření je dýchání kouře, který vypouštějí kuřáci kolem nás.",
  }),
  choice("Kamarád ti nabídne cigaretu. Co uděláš?", "odmítnu a řeknu, že nechci", [
    { value: "vezmu si, abych nevypadal nebo nevypadala divně", why: "Opravdový kamarád tvé rozhodnutí přijme." },
    { value: "zkusím jen jednou, to nevadí", why: "I jedno zkoušení může vést k dalšímu." },
    { value: "schovám si ji na později", why: "Tím problém jen odložíš." },
  ], {
    hints: ["Musíš dělat něco, co nechceš?", "Stačí jasně říct ne; když kamarád naléhá, můžeš odejít."],
    explanation: "Nejlepší je jasně odmítnout — mít vlastní názor není nic divného.",
  }),
  choice("Kam může dítě v Česku zavolat o pomoc zdarma a bez udání jména?", "na Linku bezpečí", [
    { value: "na informace o jízdních řádech", why: "Tam ti s trápením nepomůžou." },
    { value: "do obchodu s potravinami", why: "Obchod pomoc nenabízí." },
    { value: "na číslo kamaráda ze třídy", why: "Kamarád může pomoct, ale linka pomoci je zdarma a s odborníky." },
  ], {
    hints: ["Existuje linka pro děti, která je v provozu nonstop.", "Na čísle 116 111 ti poradí odborníci a nemusíš říkat, kdo jsi."],
    explanation: "Linka bezpečí (116 111) pomáhá dětem zdarma, nonstop a anonymně.",
  }),
  choice("Proč jsou energetické nápoje pro děti nevhodné?", "obsahují hodně kofeinu a cukru", [
    { value: "obsahují zdravé vitamíny", why: "Vitamíny nejsou důvod, proč jsou nevhodné." },
    { value: "jsou jen trochu dražší", why: "Nejde o cenu, ale o účinky." },
    { value: "mají v sobě moc bublinek", why: "Bublinky nejsou hlavní problém." },
  ], {
    hints: ["Jaká povzbuzující látka je v kávě i v energetických nápojích?", "Kofein zrychluje srdce a narušuje spánek; cukr škodí zubům a přidává kila."],
    explanation: "Energetické nápoje obsahují hodně kofeinu a cukru, což dětem škodí.",
  }),
  choice("Co jsou drogy?", "látky, které mění vnímání a vedou k závislosti", [
    { value: "léky na bolest hlavy podle lékaře", why: "Léky podle lékaře drogami nejsou." },
    { value: "všechny sladkosti", why: "Sladkosti drogy nejsou." },
    { value: "koření do jídla", why: "Koření drogou není." },
  ], {
    hints: ["Proč jsou drogy zakázané?", "Drogy mění, jak člověk vnímá svět, poškozují mozek a rychle vyvolávají závislost."],
    explanation: "Drogy jsou látky, které mění vnímání a myšlení a vedou k závislosti.",
  }),
  choice("Proč se nesmí řídit po požití alkoholu?", "alkohol zpomaluje reakce", [
    { value: "auto by jelo pomaleji", why: "Auto jede stejně, ale řidič reaguje hůř." },
    { value: "alkohol zlepšuje soustředění", why: "Alkohol soustředění zhoršuje." },
    { value: "řidič by hůř slyšel rádio", why: "Jde o bezpečnost, ne o rádio." },
  ], {
    hints: ["Co se stane s řidičem, když mu náhle vběhne dítě do cesty?", "Po alkoholu řidič zabrzdí pozdě a hůř odhadne vzdálenost i rychlost."],
    explanation: "Alkohol zpomaluje reakce, a proto v Česku řidič nesmí mít v krvi žádný alkohol.",
  }),
  choice("Která povzbuzující látka je v kávě a energetických nápojích?", "kofein", [
    { value: "nikotin", why: "Nikotin je v tabáku." },
    { value: "alkohol", why: "Alkohol je v pivu a víně." },
    { value: "vitamín C", why: "Vitamín C je v ovoci." },
  ], {
    hints: ["Po kávě se člověk cítí čilejší. Která látka to způsobuje?", "Tato látka je v kávě, čaji, kolových nápojích a hlavně v energetických nápojích."],
    explanation: "Kofein povzbuzuje; ve velkém množství ale škodí, hlavně dětem.",
  }),
];

const L2: PracticeTask[] = [
  choice("Jaký je rozdíl mezi tělesnou a psychickou závislostí?", "tělesná je potřeba těla, psychická touha v mysli", [
    { value: "jsou úplně stejné", why: "Liší se v tom, co látku potřebuje — tělo, nebo mysl." },
    { value: "psychická se týká jen svalů", why: "Psychická závislost se týká mysli." },
    { value: "tělesná vzniká jen u sportovců", why: "Tělesná závislost může vzniknout u kohokoli." },
  ], {
    hints: ["Co se ozve, když závislý člověk látku nemá — tělo, nebo hlava?", "U tělesné závislosti se objeví třes nebo bolest, u psychické silná touha a neklid."],
    explanation: "Tělesná závislost znamená, že látku potřebuje tělo; psychická, že po ní touží mysl.",
  }),
  choice("Co jsou abstinenční příznaky?", "potíže, které přijdou, když závislý člověk přestane", [
    { value: "příznaky obyčejného nachlazení nebo chřipky", why: "Nachlazení se závislostí nesouvisí." },
    { value: "dobrá nálada po sportovním výkonu", why: "To je příjemný pocit, ne abstinenční příznak." },
    { value: "běžná únava po dlouhém dni ve škole", why: "Únava po škole se závislostí nesouvisí." },
  ], {
    hints: ["Co se stane se závislým tělem, když najednou látku nedostane?", "Tělo si zvyklo a bez látky reaguje třesem, pocením nebo neklidem."],
    explanation: "Abstinenční příznaky jsou potíže, které se objeví, když závislý člověk látku nemá.",
  }),
  choice("Proč alkohol škodí játrům?", "játra ho musí odbourávat a přetěžují se", [
    { value: "alkohol se ukládá v kostech", why: "Alkohol se v kostech neukládá." },
    { value: "játra alkohol vůbec nezpracovávají", why: "Právě játra alkohol odbourávají." },
    { value: "alkohol játra chladí", why: "Nejde o teplotu." },
  ], {
    hints: ["Který orgán čistí krev od škodlivých látek?", "Játra rozkládají škodlivé látky; když musí pořád zpracovávat alkohol, poškodí se."],
    explanation: "Játra alkohol odbourávají; při častém pití se přetěžují a poškozují.",
  }),
  choice("Proč je alkohol pro děti nebezpečnější než pro dospělé?", "jejich tělo a mozek se ještě vyvíjejí", [
    { value: "děti mají víc krve než dospělí", why: "Děti mají krve méně." },
    { value: "dětem alkohol chutná víc", why: "Chuť nerozhoduje." },
    { value: "děti ho vždycky pijí rychleji", why: "Nejde o rychlost pití." },
  ], {
    hints: ["Je dětský mozek už hotový?", "Mozek dozrává až kolem dvaceti let; alkohol jeho vývoj narušuje a menší tělo ho hůř odbourá."],
    explanation: "Dětské tělo a mozek se vyvíjejí, proto jim alkohol škodí víc.",
  }),
  choice("Jak vzniká závislost na nikotinu?", "mozek si zvykne na příjemný pocit a chce další dávku", [
    { value: "nikotin se hromadí v nehtech", why: "Nikotin působí na mozek." },
    { value: "závislost vznikne až po mnoha letech", why: "Závislost může vzniknout velmi rychle." },
    { value: "nikotin posiluje plíce", why: "Nikotin plíce neposiluje." },
  ], {
    hints: ["Co nikotin dělá v mozku?", "Nikotin na chvíli vyvolá příjemný pocit; mozek si ho zapamatuje a začne dávku vyžadovat."],
    explanation: "Nikotin působí na mozek; ten si zvykne a dožaduje se dalších dávek.",
  }),
  choice("Co obsahuje cigaretový kouř?", "tisíce látek, mnohé jedovaté", [
    { value: "jen vodní páru", why: "Kouř obsahuje mnoho škodlivých látek." },
    { value: "jen vůni tabáku", why: "Vůně je jen malá část." },
    { value: "zdravé vitamíny z tabáku", why: "Kouř vitamíny neobsahuje." },
  ], {
    hints: ["Proč kuřákům žloutnou prsty a zuby?", "V kouři je dehet, oxid uhelnatý a spousta dalších jedů, které ničí plíce."],
    explanation: "Cigaretový kouř obsahuje tisíce látek, z nichž mnohé jsou jedovaté.",
  }),
  choice("Proč mladí lidé někdy začnou kouřit nebo pít?", "chtějí zapadnout do party nebo vypadat dospěle", [
    { value: "doporučuje jim to lékař", why: "Lékaři to nedoporučují." },
    { value: "je to pro ně zdravé", why: "Zdravé to není." },
    { value: "jinak by nemohli chodit do školy", why: "S docházkou to nesouvisí." },
  ], {
    hints: ["Kdo často mladé lidi k prvnímu zkoušení přemluví?", "Často jde o tlak kamarádů a o touhu vypadat starší, než člověk je."],
    explanation: "Za prvním zkoušením bývá tlak party a snaha vypadat dospěle.",
  }),
  choice("Kamarád zkouší drogy. Jak mu můžeš pomoct?", "promluvit s ním a říct to dospělému, kterému věřím", [
    { value: "nic neříkat a nechat to být", why: "Mlčení mu nepomůže." },
    { value: "vyzkoušet to s ním", why: "Tím bys ohrozil nebo ohrozila sebe." },
    { value: "vysmát se mu před ostatními", why: "Posměch nepomůže." },
  ], {
    hints: ["Kdo umí s takovým problémem pomoct?", "Promluv s ním a pak se svěř rodičům, učiteli nebo Lince bezpečí — nejsi na to sám nebo sama."],
    explanation: "Nejvíc pomůže promluvit si s ním a svěřit se dospělému.",
  }),
  choice("Proč jsou elektronické cigarety pro děti nebezpečné?", "obsahují nikotin a vedou k závislosti", [
    { value: "obsahují jen vodní páru", why: "Většina obsahuje nikotin." },
    { value: "jsou bezpečné, protože voní", why: "Vůně nic nemění na nikotinu." },
    { value: "škodí jen dospělým", why: "Dětem škodí ještě víc." },
  ], {
    hints: ["Jaká návyková látka bývá v náplních?", "Sladká vůně klame; v náplni bývá stejná návyková látka jako v tabáku."],
    explanation: "Elektronické cigarety obsahují nikotin a vyvolávají závislost.",
  }),
  choice("Závislost nemusí být jen na látce. Který příklad je závislost na činnosti?", "nemůžu přestat hrát hry na mobilu", [
    { value: "rád nebo ráda si čtu knížky", why: "Záliba ještě není závislost." },
    { value: "chodím každý den do školy", why: "To je povinnost, ne závislost." },
    { value: "piju vodu, když mám žízeň", why: "To je přirozená potřeba." },
  ], {
    hints: ["Kdy se z koníčku stane problém?", "Když na hru myslíš pořád, zanedbáváš kvůli ní spánek i kamarády a bez ní jsi nervózní."],
    explanation: "Závislost může vzniknout i na činnosti, třeba na hrách na mobilu.",
  }),
  choice("Kolik alkoholu smí mít v krvi řidič v Česku?", "žádný", [
    { value: "jedno pivo", why: "I jedno pivo zhoršuje reakce." },
    { value: "sklenku vína", why: "I malé množství je zakázané." },
    { value: "kolik chce, když se cítí dobře", why: "Pocit klame, reakce jsou pomalejší." },
  ], {
    hints: ["Jak přísný je u nás zákon pro řidiče?", "V Česku platí nulová tolerance — i malé množství alkoholu zhoršuje reakce."],
    explanation: "Řidič v Česku nesmí mít v krvi žádný alkohol.",
  }),
  choice("Jak alkohol ovlivňuje chůzi a rovnováhu?", "zhoršuje je", [
    { value: "zlepšuje je", why: "Alkohol rovnováhu naopak zhoršuje." },
    { value: "nijak", why: "Alkohol má na pohyb velký vliv." },
    { value: "zrychluje je", why: "Pohyby jsou pomalejší a nejisté." },
  ], {
    hints: ["Jak chodí opilý člověk?", "Alkohol tlumí část mozku, která řídí souhru pohybů, proto opilý člověk vrávorá."],
    explanation: "Alkohol zhoršuje chůzi i rovnováhu.",
  }),
  choice("Proč je nebezpečné vzít si cizí lék?", "nevím, co obsahuje a jak mi uškodí", [
    { value: "léky jsou vždycky neškodné", why: "Nevhodný lék může vážně uškodit." },
    { value: "cizí lék zabere rychleji", why: "Nejde o rychlost, ale o bezpečnost." },
    { value: "stačí, když pomohl kamarádovi", why: "Co pomohlo jinému, tobě může uškodit." },
  ], {
    hints: ["Kdo určuje, jaký lék a kolik ho máš brát?", "Lék předepisuje lékař konkrétnímu člověku; jiný může mít alergii nebo potřebovat jinou dávku."],
    explanation: "Cizí lék může obsahovat látku, která ti uškodí; léky se berou jen podle lékaře.",
  }),
];

const L3: PracticeTask[] = [
  choice("Na oslavě ti starší spolužák nabízí alkohol. Co je nejlepší udělat?", "odmítnout a jít za dospělým", [
    { value: "ochutnat jen trochu", why: "I malé množství dětem škodí." },
    { value: "vzít si a potají ho vylít", why: "Jasné odmítnutí je jednodušší a bezpečnější." },
    { value: "napít se, aby se mi nesmáli", why: "Kdo se ti směje, nemyslí na tvé dobro." },
  ], {
    hints: ["Kdo ti v takové situaci pomůže?", "Stačí říct ne a jít za dospělým, který na oslavě dohlíží."],
    explanation: "Nejbezpečnější je odmítnout a říct to dospělému.",
  }),
  choice("Proč je těžké přestat kouřit?", "tělo i mysl si na nikotin zvyknou", [
    { value: "cigarety dobře chutnají", why: "Chuť není hlavní důvod." },
    { value: "přestat je zakázané", why: "Přestat se smí a je to dobře." },
    { value: "kouření je zdravé", why: "Kouření je škodlivé." },
  ], {
    hints: ["Jaký druh závislosti nikotin vyvolává?", "Nikotin vyvolává tělesnou i psychickou závislost; bez něj je kuřák neklidný a nervózní."],
    explanation: "Nikotin vyvolává tělesnou i psychickou závislost, proto se přestává těžko.",
  }),
  choice("Kamarád tvrdí, že elektronická cigareta je neškodná. Co je pravda?", "obsahuje nikotin, který vyvolává závislost", [
    { value: "je to jen voňavá pára", why: "V náplni bývá nikotin." },
    { value: "je zdravější než ovoce", why: "Elektronická cigareta zdravá není." },
    { value: "dětem neškodí, jen dospělým", why: "Dětem škodí ještě víc." },
  ], {
    hints: ["Co bývá v náplni kromě vůně?", "V náplních bývá stejná návyková látka jako v tabáku; mladý mozek si na ni zvykne rychle."],
    explanation: "Elektronické cigarety obsahují nikotin, a proto vyvolávají závislost.",
  }),
  choice("Proč je v Česku reklama na cigarety zakázaná?", "stát chce chránit lidi, hlavně mladé, před kouřením", [
    { value: "reklama na cigarety je příliš drahá", why: "Nejde o cenu." },
    { value: "cigarety si už stejně nikdo nekupuje", why: "Kupují, a proto je zákaz potřeba." },
    { value: "reklama na cigarety by byla nudná", why: "Jde o ochranu zdraví." },
  ], {
    hints: ["Na koho reklama působí nejvíc?", "Reklama umí udělat z kouření něco „cool“; zákaz má zabránit, aby lákala mladé."],
    explanation: "Zákaz reklamy chrání hlavně mladé lidi před tím, aby začali kouřit.",
  }),
  choice("Soused kouří v autě, kde sedí jeho malé dítě. Proč je to špatně?", "dítě vdechuje kouř a poškozuje si zdraví", [
    { value: "kouř z auta rychle vyletí, nevadí to", why: "V autě se kouř hromadí." },
    { value: "malým dětem kouř nevadí", why: "Dětem škodí ještě víc." },
    { value: "je to jen nezdvořilé", why: "Jde o zdraví, ne o zdvořilost." },
  ], {
    hints: ["Kam jde kouř v malém uzavřeném prostoru?", "V autě se kouř nahromadí a dítě ho dýchá — je to pasivní kouření."],
    explanation: "Dítě v autě pasivně kouří a poškozuje si plíce.",
  }),
  choice("Podle čeho poznáš, že má někdo problém se závislostí?", "bez látky je neklidný a myslí jen na ni", [
    { value: "rád sportuje", why: "Sport je zdravý zvyk." },
    { value: "má hodně kamarádů", why: "To o závislosti nic neříká." },
    { value: "občas je unavený po škole", why: "Únava je běžná." },
  ], {
    hints: ["Jak se chová člověk, který si nedovede představit ani den bez cigarety nebo alkoholu?", "Přestane se zajímat o jiné věci, a když látku nemá, je nervózní nebo smutný."],
    explanation: "Závislý člověk myslí hlavně na látku a bez ní je neklidný.",
  }),
  choice("Proč nefunguje výmluva „zkusím to jen jednou“?", "i jedno zkoušení může vést k dalšímu a k závislosti", [
    { value: "jednou se nic nikdy nestane", why: "Už první zkušenost může být nebezpečná." },
    { value: "po prvním zkoušení vznikne imunita", why: "Imunita proti závislosti neexistuje." },
    { value: "zkoušet je povinné", why: "Není — odmítnout je v pořádku." },
  ], {
    hints: ["Co se může stát, když se ti to napoprvé zalíbí?", "Mozek si zapamatuje příjemný pocit a chce ho znovu — tak začíná většina závislostí."],
    explanation: "I jediné zkoušení může vést k dalším a pak k závislosti.",
  }),
  choice("Proč se lidé pod vlivem alkoholu často dostanou do nebezpečí?", "alkohol oslabuje úsudek a opatrnost", [
    { value: "alkohol zlepšuje odvahu i reakce", why: "Reakce se zhoršují a odvaha bývá nerozvážná." },
    { value: "opilý člověk vidí lépe", why: "Vidění se zhoršuje." },
    { value: "alkohol chrání před úrazy", why: "Naopak úrazů přibývá." },
  ], {
    hints: ["Jak se po alkoholu mění rozhodování?", "Opilý člověk podcení nebezpečí a udělá věci, které by střízlivý neudělal."],
    explanation: "Alkohol oslabuje úsudek, proto opilí lidé víc riskují.",
  }),
  choice("Jak si můžeš zlepšit náladu bez návykových látek?", "sportovat, být s přáteli nebo dělat koníček", [
    { value: "vypít energetický nápoj", why: "Energetický nápoj obsahuje kofein a cukr." },
    { value: "zkusit cigaretu", why: "Cigareta vede k závislosti." },
    { value: "hrát hry celou noc", why: "Nedostatek spánku náladu zhorší." },
  ], {
    hints: ["Co ti udělá radost a zároveň neublíží?", "Pohyb, přátelé a koníčky zlepší náladu a nevedou k závislosti."],
    explanation: "Sport, přátelé a koníčky zlepšují náladu bez rizika závislosti.",
  }),
  choice("Proč závislost škodí i rodině a přátelům?", "závislý člověk se mění a trápí své okolí", [
    { value: "rodině to vůbec nevadí", why: "Závislost trápí celé okolí." },
    { value: "přátelé se tím také stanou závislými", why: "Závislost se nepřenáší jako rýma." },
    { value: "závislost se týká jen jednoho člověka", why: "Dopady má na celé okolí." },
  ], {
    hints: ["Jak se cítí rodina, když jeden z ní nemyslí na nic jiného než na látku?", "Kdo propadl závislosti, přestane plnit sliby, bývá podrážděný a utrácí peníze — blízcí se trápí."],
    explanation: "Závislost mění chování člověka a trápí jeho rodinu i přátele.",
  }),
  choice("Kamarád se ti svěří, že nemůže přestat hrát hry. Co mu poradíš?", "ať si promluví s rodiči nebo zavolá Linku bezpečí", [
    { value: "ať hraje ještě víc, aby ho to přestalo bavit", why: "Tím by se problém zhoršil." },
    { value: "ať to raději nikomu neříká", why: "Mlčení mu nepomůže." },
    { value: "ať si koupí nový mobil s lepšími hrami", why: "Nový mobil problém neřeší." },
  ], {
    hints: ["Kdo umí se závislostí na hrách pomoct?", "S takovým problémem pomůžou rodiče, školní psycholog nebo Linka bezpečí na čísle 116 111."],
    explanation: "Nejvíc pomůže, když se svěří rodičům nebo Lince bezpečí.",
  }),
  choice("Proč je nikotin nebezpečnější pro mladé než pro dospělé?", "mladý mozek si závislost vytvoří rychleji", [
    { value: "mladí kouří jiné cigarety", why: "Cigarety jsou stejné." },
    { value: "dospělým nikotin neškodí", why: "Škodí všem." },
    { value: "mladí mají silnější plíce", why: "Silnější plíce je nechrání." },
  ], {
    hints: ["Který orgán se v dětství ještě vyvíjí?", "Dospívající mozek se rychle učí — bohužel i závislosti; proto většina kuřáků začala jako mladí."],
    explanation: "Mladý mozek si na nikotin zvykne rychleji, a závislost vznikne snáz.",
  }),
  choice("Proč se léky mají brát jen podle lékaře nebo příbalového letáku?", "špatná dávka může uškodit", [
    { value: "víc léku vždycky víc pomůže", why: "Vyšší dávka může otrávit." },
    { value: "léky se dají brát podle chuti", why: "Chuť nerozhoduje." },
    { value: "leták je jen reklama", why: "Leták obsahuje důležité pokyny." },
  ], {
    hints: ["Co se stane, když si vezmeš víc tablet, než je napsáno?", "Každý lék má správnou dávku; příliš mnoho může poškodit játra nebo jiné orgány."],
    explanation: "Léky se berou jen ve správné dávce — jinak mohou uškodit.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const NAVYKOVELATKYALKOHOLNIKOTINDROGY: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-navyky-a-prevence-navykove-latky-alkohol-nikotin-drogy",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-navyky-a-prevence-navykove-latky-alkohol-nikotin-drogy",
    title: "Návykové látky - alkohol, nikotin, drogy",
    studentTitle: "Drogy a závislosti",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Návyky a prevence",
    briefDescription: "Dozvíš se, jak návykové látky poškozují zdraví a jak se chránit.",
    keywords: ["drogy", "alkohol", "nikotin", "závislost", "prevence", "kouření", "odmítnutí"],
    goals: ["Vysvětlit rozdíl mezi tělesnou a psychickou závislostí", "Popsat zdravotní rizika alkoholu, nikotinu a drog", "Vyjmenovat způsoby, jak odmítnout návykové látky"],
    boundaries: ["Neprobírá farmakologii drog do hloubky", "Neprobírá léčbu závislosti podrobně"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Alkohol: tlumí nervovou soustavu, ničí játra. Nikotin: ničí plíce, způsobuje závislost. Drogy: poškozují mozek a celé tělo.",
      steps: [
        "Závislost: tělesná (abstinenční příznaky) nebo psychická (touha).",
        "Alkohol: povoleno od 18 let, ničí játra, tlumí nervovou soustavu.",
        "Nikotin: v cigaretách, ničí plíce, rakoviny.",
        "Drogy: ilegální, poškozují mozek, extrémně návykové.",
        "Prevence: říci NE, odejít, svěřit se dospělým.",
      ],
      commonMistake: "Alkohol je legální – ale stále je to droga. Nejrozšířenější návyková látka v ČR.",
      example: "Kamarád nabídne cigaretu → jasné NE → odejdi → popiš situaci rodičům.",
    },
  },
];
