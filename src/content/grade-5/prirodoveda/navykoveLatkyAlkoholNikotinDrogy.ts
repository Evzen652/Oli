import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  { question: "Co je návyková látka?", correctAnswer: "Látka, která způsobuje závislost a touhu po dalším užití", options: ["Látka, která způsobuje závislost a touhu po dalším užití", "Každý lék prodávaný v lékárně", "Látka, která v malém množství neškodí", "Vitamín nebo doplněk stravy"], hints: ["Závislost = tělo nebo mysl látku 'potřebuje'."] },
  { question: "Jaký vliv má alkohol na nervovou soustavu?", correctAnswer: "Tlumí ji – zpomaluje reakce, narušuje koordinaci a úsudek", options: ["Tlumí ji – zpomaluje reakce, narušuje koordinaci a úsudek", "Aktivuje ji – urychluje myšlení", "Nemá žádný vliv na nervovou soustavu", "Posiluje paměť a koncentraci"], hints: ["Proto alkohol způsobuje nejistou chůzi a rozmazané vidění."] },
  { question: "Co je nikotin?", correctAnswer: "Návyková látka obsažená v tabáku – cigarety, doutníky", options: ["Návyková látka obsažená v tabáku – cigarety, doutníky", "Složka alkoholu způsobující opojení", "Bezpečná látka povolená pro děti", "Vitamín v zeleninovém kouři"], hints: ["Nikotin způsobuje závislost na kouření."] },
  { question: "Co způsobuje kouření pro plíce?", correctAnswer: "Dehet ucpává plicní sklípky, dráždí je a zvyšuje riziko rakoviny plic", options: ["Kouření pročišťuje dýchací cesty od hlenu", "Dehet ucpává plicní sklípky, dráždí je a zvyšuje riziko rakoviny plic", "Kouření neovlivňuje plíce, dráždí jen hrdlo", "Kouření způsobuje alergii, ale ne rakovinu"], hints: ["Cigaretový kouř obsahuje více než 4 000 chemických látek."] },
  { question: "Jaký je věkový limit pro alkohol a cigarety v ČR?", correctAnswer: "18 let", options: ["18 let", "15 let", "21 let", "16 let"], hints: ["V ČR platí zákon, který zakazuje prodej alkoholu a tabáku osobám, které ještě nedosáhly plnoletosti."] },
  { question: "Co jsou ilegální drogy?", correctAnswer: "Látky zakázané zákonem – heroin, kokain, pervitin, LSD", options: ["Látky zakázané zákonem – heroin, kokain, pervitin, LSD", "Léky bez lékařského předpisu", "Alkohol v nadměrném množství", "Cigarety prodávané bez daňové pásky"], hints: ["Ilegální = protizákonné, za jejich držení hrozí trest."] },
  { question: "Co je tělesná závislost?", correctAnswer: "Tělo látku fyzicky potřebuje – bez ní nastávají abstinenční příznaky – třes, pocení, bolest", options: ["Tělo látku fyzicky potřebuje – bez ní nastávají abstinenční příznaky – třes, pocení, bolest", "Touha po látce pouze v mysli, bez fyzických příznaků", "Zvyk brát lék podle doporučení lékaře", "Alergie na návykovou látku"], hints: ["Tělesná závislost = buňky se přizpůsobily látce."] },
  { question: "Co je psychická závislost?", correctAnswer: "Silná touha po látce v mysli – přesvědčení, že bez ní nelze fungovat", options: ["Silná touha po látce v mysli – přesvědčení, že bez ní nelze fungovat", "Fyzická potřeba látky způsobující třes a pocení", "Alergická reakce na návykovou látku", "Lékařsky předepsaná závislost pro léčbu bolesti"], hints: ["Psychická závislost = 'hlava chce', ne jen 'tělo chce'."] },
  { question: "Proč jsou drogy nebezpečné zejména pro mozek mladých lidí?", correctAnswer: "Mozek se vyvíjí do 25 let – drogy narušují jeho vývoj, poškozují paměť, koncentraci a emocionální vývoj", options: ["Mozek se vyvíjí do 25 let – drogy narušují jeho vývoj, poškozují paměť, koncentraci a emocionální vývoj", "Drogy jsou stejně nebezpečné pro děti i dospělé", "Mozek mladých lidí se lépe zregeneruje – drogy jsou méně nebezpečné", "Drogy poškozují jen játra a plíce, ne mozek"], hints: ["Prefrontální kůra (rozhodování) dozrává posledni – do 25 let."] },
  { question: "Jak se bránit tlaku vrstevníků na zkoušení drog?", correctAnswer: "Říci jasně ne, opustit situaci, svěřit se důvěryhodné dospělé osobě", options: ["Říci jasně ne, opustit situaci, svěřit se důvěryhodné dospělé osobě", "Zkusit jednou – závislost nevznikne hned", "Nikomu nic neříkat a situaci ignorovat", "Přesvědčit kamarády, aby přestali a pak odejít"], hints: ["Opravdový přítel respektuje tvé 'ne'."] },
  { question: "Kde může nezletilý v ČR vyhledat pomoc s drogami?", correctAnswer: "U rodičů, školního poradce, lékaře, nebo na lince 116 111 – Linka bezpečí", options: ["U rodičů, školního poradce, lékaře, nebo na lince 116 111 – Linka bezpečí", "Pouze u policisty – jiná pomoc neexistuje", "Pomoc není dostupná pro nezletilé", "Pouze na internetu anonymně"], hints: ["Existuje bezplatná a anonymní telefonní linka dostupná nepřetržitě, speciálně pro děti a mladistvé."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč alkohol ničí játra?", correctAnswer: "Játra prioritně odbourávají alkohol – při chronické konzumaci se přetěžují → zánět (hepatitida) → jizva – cirhóza → selhání jater", options: ["Játra prioritně odbourávají alkohol – při chronické konzumaci se přetěžují → zánět (hepatitida) → jizva – cirhóza → selhání jater", "Alkohol ničí ledviny, ne játra.", "Játra jsou odolná – alkohol je poškozuje jen při dávce nad 1 litr denně.", "Alkohol se tráví v žaludku – játra nejsou zatížena."], hints: ["Cirhóza jater = nezvratná – transplantace jater je jedinou léčbou."] },
  { question: "Jak vzniká závislost na nikotinu?", correctAnswer: "Nikotin spouští v mozku pocit odměny a mozek si na něj zvykne", options: ["Nikotin vyvolá závislost tím, že se hromadí v tukové tkáni.", "Nikotin spouští v mozku pocit odměny a mozek si na něj zvykne", "Závislost na nikotinu je jen psychická, tělo ho nepotřebuje.", "Nikotin posiluje imunitu a závislost je jen vedlejší efekt."], hints: ["Mozek si zvykne na to, co mu opakovaně přináší příjemný pocit."] },
  { question: "Proč jsou energetické nápoje nebezpečné pro srdce mladých lidí?", correctAnswer: "Hodně kofeinu a cukru zrychluje tep a přetěžuje srdce", options: ["Energetické nápoje jsou bezpečné – je v nich stejně kofeinu jako v kávě.", "Hodně kofeinu a cukru zrychluje tep a přetěžuje srdce", "Energetické nápoje škodí jen dospělým, dětem neublíží.", "Srdeční potíže způsobuje cukr v nápoji, ne kofein."], hints: ["Zkus odhadnout, kolik povzbuzující látky je v jedné plechovce."] },
  { question: "Jak pasivní kouření poškozuje zdraví?", correctAnswer: "Kouř z okolí obsahuje stejné jedovaté látky jako kouř vdechovaný kuřákem", options: ["Pasivní kouření je bezpečné – jedy se ve vzduchu zředí.", "Kouř z okolí obsahuje stejné jedovaté látky jako kouř vdechovaný kuřákem", "Pasivní kouření škodí jen při dlouhém pobytu v zakouřené místnosti.", "Kouř stoupající z cigarety je méně jedovatý než ten vdechovaný."], hints: ["Děti kuřáků mají vyšší výskyt astmatu a infekcí dýchacích cest."] },
  { question: "Jak marihuana ovlivňuje mozek mladého člověka?", correctAnswer: "Narušuje vývoj mozku a zhoršuje paměť, motivaci i soustředění", options: ["Marihuana je přírodní, a proto mozku uškodit nemůže.", "Narušuje vývoj mozku a zhoršuje paměť, motivaci i soustředění", "Marihuana ovlivňuje jen koordinaci pohybů, paměť ne.", "Marihuana je pro mladé bezpečná, potíže mají až dospělí."], hints: ["Mozek se v tomto věku ještě vyvíjí, proto reaguje jinak než u dospělých."] },
  { question: "Proč je prevence lepší než léčba závislosti?", correctAnswer: "Závislost mění mozek, léčba trvá roky a návraty jsou časté", options: ["Léčba závislosti je jednoduchá – stačí přestat brát drogu.", "Závislost mění mozek, léčba trvá roky a návraty jsou časté", "Prevence je jen pro lidi bez vůle – silní si poradí sami.", "Závislost lze vyléčit léky za dva týdny i bez prevence."], hints: ["Porovnej, co stojí víc úsilí – nezačít, nebo přestat."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak alkohol způsobuje 'výpadky paměti' (blackout)?", correctAnswer: "Alkohol zablokuje ukládání nových vzpomínek v mozku", options: ["Alkohol výpadky způsobí tím, že uspí část mozku.", "Alkohol zablokuje ukládání nových vzpomínek v mozku", "Výpadky vznikají odvodněním – alkohol mozek vysuší.", "Výpadky paměti způsobuje nikotin, ne alkohol."], hints: ["Alkohol nesmaže, co si člověk pamatoval dřív – potíž je jinde."] },
  { question: "Proč je heroin tak vysoce návykový?", correctAnswer: "Vyvolá mimořádně silný pocit odměny a mozek se pak bez něj neobejde", options: ["Heroin je návykový proto, že vyvolává příjemnou euforii.", "Vyvolá mimořádně silný pocit odměny a mozek se pak bez něj neobejde", "Heroin vytváří jen psychickou závislost, tělesná nevzniká.", "Heroin poškozuje srdce a plíce, mozek zůstává nedotčený."], hints: ["Čím silnější je umělá odměna, tím hůř se mozek obejde bez ní."] },
  { question: "Jak sociální tlak vrstevníků ovlivňuje první experimentování s drogami?", correctAnswer: "Touha patřit do skupiny, strach z odmítnutí a podcenění rizika", options: ["Tlak vrstevníků nehraje roli, drogy zkouší jen děti z problémových rodin.", "Touha patřit do skupiny, strach z odmítnutí a podcenění rizika", "Zkoušení drog k dospívání přirozeně patří a k závislosti nevede.", "Prevence je zbytečná, kdo chce, ten si drogu najde sám."], hints: ["Zamysli se, co člověka nutí zkusit něco, co sám nechce."] },
  { question: "Proč jsou cigaretové společnosti globálně regulovány?", correctAnswer: "Tabák způsobuje 8 milionů úmrtí ročně globálně. Státy zakazují reklamu, zvyšují daně a zavádějí věková omezení, aby snížily počet kuřáků a zdravotní náklady.", options: ["Tabák způsobuje 8 milionů úmrtí ročně globálně. Státy zakazují reklamu, zvyšují daně a zavádějí věková omezení, aby snížily počet kuřáků a zdravotní náklady.", "Cigaretové firmy jsou regulovány kvůli ekologickému dopadu tabákového zemědělství.", "Regulace tabáku je politická – zdravotní dopady nejsou vědecky prokázány.", "Tabák je regulován jen v rozvinutých zemích – v rozvojových je bez omezení."], hints: ["Rámcová úmluva WHO o kontrole tabáku: 182 zemí, 2003."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
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
        "1. Závislost: tělesná (abstinenční příznaky) nebo psychická (touha).",
        "2. Alkohol: povoleno od 18 let, ničí játra, tlumí nervovou soustavu.",
        "3. Nikotin: v cigaretách, ničí plíce, rakoviny.",
        "4. Drogy: ilegální, poškozují mozek, extrémně návykové.",
        "5. Prevence: říci NE, odejít, svěřit se dospělým.",
      ],
      commonMistake: "Alkohol je legální – ale stále je to droga. Nejrozšířenější návyková látka v ČR.",
      example: "Kamarád nabídne cigaretu → jasné NE → odejdi → popiš situaci rodičům.",
    },
  },
];
