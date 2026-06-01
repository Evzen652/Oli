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
  { question: "Co je nikotin?", correctAnswer: "Návyková látka obsažená v tabáku – cigarety, doutníky", options: ["Návyková látka obsažená v tabáku (cigarety, doutníky)", "Složka alkoholu způsobující opojení", "Bezpečná látka povolená pro děti", "Vitamín v zeleninovém kouři"], hints: ["Nikotin způsobuje závislost na kouření."] },
  { question: "Co způsobuje kouření pro plíce?", correctAnswer: "Dehet ucpává alveoly, způsobuje záněty, chronický kašel a zvyšuje riziko rakoviny plic", options: ["Dehet ucpává alveoly, způsobuje záněty, chronický kašel a zvyšuje riziko rakoviny plic", "Kouření pročišťuje dýchací cesty", "Kouření neovlivňuje plíce – jen hrdlo", "Kouření způsobuje alergii, ale ne rakovinu"], hints: ["Cigaretový kouř obsahuje více než 4 000 chemických látek."] },
  { question: "Jaký je věkový limit pro alkohol a cigarety v ČR?", correctAnswer: "18 let", options: ["18 let", "15 let", "21 let", "16 let"], hints: ["V ČR platí zákon zakazující prodej alkoholu a tabáku osobám mladším 18 let."] },
  { question: "Co jsou ilegální drogy?", correctAnswer: "Látky zakázané zákonem – heroin, kokain, pervitin, LSD", options: ["Látky zakázané zákonem (heroin, kokain, pervitin, LSD)", "Léky bez lékařského předpisu", "Alkohol v nadměrném množství", "Cigarety prodávané bez daňové pásky"], hints: ["Ilegální = protizákonné, za jejich držení hrozí trest."] },
  { question: "Co je tělesná závislost?", correctAnswer: "Tělo látku fyzicky potřebuje – bez ní nastávají abstinenční příznaky – třes, pocení, bolest", options: ["Tělo látku fyzicky potřebuje – bez ní nastávají abstinenční příznaky (třes, pocení, bolest)", "Touha po látce pouze v mysli, bez fyzických příznaků", "Zvyk brát lék podle doporučení lékaře", "Alergie na návykovou látku"], hints: ["Tělesná závislost = buňky se přizpůsobily látce."] },
  { question: "Co je psychická závislost?", correctAnswer: "Silná touha po látce v mysli – přesvědčení, že bez ní nelze fungovat", options: ["Silná touha po látce v mysli – přesvědčení, že bez ní nelze fungovat", "Fyzická potřeba látky způsobující třes a pocení", "Alergická reakce na návykovou látku", "Lékařsky předepsaná závislost pro léčbu bolesti"], hints: ["Psychická závislost = 'hlava chce', ne jen 'tělo chce'."] },
  { question: "Proč jsou drogy nebezpečné zejména pro mozek mladých lidí?", correctAnswer: "Mozek se vyvíjí do 25 let – drogy narušují jeho vývoj, poškozují paměť, koncentraci a emocionální vývoj", options: ["Mozek se vyvíjí do 25 let – drogy narušují jeho vývoj, poškozují paměť, koncentraci a emocionální vývoj", "Drogy jsou stejně nebezpečné pro děti i dospělé", "Mozek mladých lidí se lépe zregeneruje – drogy jsou méně nebezpečné", "Drogy poškozují jen játra a plíce, ne mozek"], hints: ["Prefrontální kůra (rozhodování) dozrává posledni – do 25 let."] },
  { question: "Jak se bránit tlaku vrstevníků na zkoušení drog?", correctAnswer: "Říci jasně ne, opustit situaci, svěřit se důvěryhodné dospělé osobě", options: ["Říci jasně ne, opustit situaci, svěřit se důvěryhodné dospělé osobě", "Zkusit jednou – závislost nevznikne hned", "Nikomu nic neříkat a situaci ignorovat", "Přesvědčit kamarády, aby přestali a pak odejít"], hints: ["Opravdový přítel respektuje tvé 'ne'."] },
  { question: "Kde může nezletilý v ČR vyhledat pomoc s drogami?", correctAnswer: "U rodičů, školního poradce, lékaře, nebo na lince 116 111 – Linka bezpečí", options: ["U rodičů, školního poradce, lékaře, nebo na lince 116 111 (Linka bezpečí)", "Pouze u policisty – jiná pomoc neexistuje", "Pomoc není dostupná pro nezletilé", "Pouze na internetu anonymně"], hints: ["Linka bezpečí 116 111 – bezplatná, anonymní, 24/7."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč alkohol ničí játra?", correctAnswer: "Játra prioritně odbourávají alkohol – při chronické konzumaci se přetěžují → zánět – hepatitida → jizva – cirhóza → selhání jater", options: ["Játra prioritně odbourávají alkohol – při chronické konzumaci se přetěžují → zánět (hepatitida) → jizva (cirhóza) → selhání jater", "Alkohol ničí ledviny, ne játra.", "Játra jsou odolná – alkohol je poškozuje jen při dávce nad 1 litr denně.", "Alkohol se tráví v žaludku – játra nejsou zatížena."], hints: ["Cirhóza jater = nezvratná – transplantace jater je jedinou léčbou."] },
  { question: "Jak funguje závislost na nikotin na buněčné úrovni?", correctAnswer: "Nikotin se váže na acetylcholinové receptory → uvolní se dopamin – pocit pohody. Mozek sníží počet receptorů → bez cigarety padá dopamin → abstinenční příznaky.", options: ["Nikotin se váže na acetylcholinové receptory → uvolní se dopamin (pocit pohody). Mozek sníží počet receptorů → bez cigarety padá dopamin → abstinenční příznaky.", "Nikotin způsobuje závislost tím, že se hromadí v tukové tkáni.", "Závislost na nikotin je jen psychická – tělo fyzicky nikotin nepotřebuje.", "Nikotin posiluje imunitu – závislost je vedlejším příjemným efektem."], hints: ["Dopamin = hormon odměny. Závislost = mozek ho potřebuje uměle."] },
  { question: "Proč jsou energetické nápoje nebezpečné pro srdce mladých lidí?", correctAnswer: "Obsahují vysoké dávky kofeinu a cukru + taurin → zrychlují srdeční tep, mohou způsobit arytmii – nepravidelný tep a přetěžují srdce.", options: ["Obsahují vysoké dávky kofeinu a cukru + taurin → zrychlují srdeční tep, mohou způsobit arytmii (nepravidelný tep) a přetěžují srdce.", "Energetické nápoje jsou bezpečné – kofein v nich je jako v kávě.", "Energetické nápoje jsou nebezpečné jen pro dospělé, ne pro děti.", "Srdeční rizika způsobuje cukr v nápoji, ne kofein."], hints: ["Jedna plechovka energie = 80 mg kofeinu (jako 1–2 espressa)."] },
  { question: "Jak pasivní kouření poškozuje zdraví?", correctAnswer: "Vydechovaný kouř + kouř z cigarety – postranní proud obsahují stejné toxiny jako přímé kouření – poškozují plíce, zvyšují riziko rakoviny a kardiovaskulárních chorob i u nekuřáků.", options: ["Vydechovaný kouř + kouř z cigarety (postranní proud) obsahují stejné toxiny jako přímé kouření – poškozují plíce, zvyšují riziko rakoviny a kardiovaskulárních chorob i u nekuřáků.", "Pasivní kouření je bezpečné – toxiny se zředí ve vzduchu.", "Pasivní kouření škodí jen při dlouhodobém pobytu v zakouřené místnosti.", "Postranní proud cigarety je méně toxický než přímý kouř."], hints: ["Děti kuřáků mají vyšší výskyt astmatu a infekcí dýchacích cest."] },
  { question: "Jak marihuana ovlivňuje mozek mladého člověka?", correctAnswer: "THC – účinná látka narušuje vývoj mozku – ovlivňuje paměť, motivaci, koncentraci a může spustit psychózu u disponovaných jedinců. Riziko je vyšší při dřívějším zahájení.", options: ["THC (účinná látka) narušuje vývoj mozku – ovlivňuje paměť, motivaci, koncentraci a může spustit psychózu u disponovaných jedinců. Riziko je vyšší při dřívějším zahájení.", "Marihuana je přírodní – přirozené látky nemohou poškodit mozek.", "Marihuana ovlivňuje jen koordinaci, ne paměť ani psychiku.", "Marihuana je bezpečná pro mladé – problémy nastávají jen u dospělých."], hints: ["Endokanabinoidy = přirozené receptory pro THC. Mozek na ně spoléhá v vývoji."] },
  { question: "Proč je prevence lepší než léčba závislosti?", correctAnswer: "Závislost mění strukturu mozku – léčba trvá roky, relaps je časté. Prevencí se mozek nevyvine závislostní vzorce. Závislost poškozuje zdraví, rodinu a kariéru.", options: ["Závislost mění strukturu mozku – léčba trvá roky, relaps je časté. Prevencí se mozek nevyvine závislostní vzorce. Závislost poškozuje zdraví, rodinu a kariéru.", "Léčba závislosti je jednoduchá – stačí přestat brát drogu.", "Prevence je jen pro lidi bez vůle – silní jedinci si poradí sami.", "Závislost lze vyléčit léky za 1–2 týdny bez nutnosti prevence."], hints: ["Relaps = návrat k užívání po abstinenci."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak alkohol způsobuje 'výpadky paměti' (blackout)?", correctAnswer: "Alkohol blokuje přenos signálů v hipokampu – paměťové centrum – nové vzpomínky se nevytváří, i když člověk jedná zdánlivě vědomě. Mozek nezaznamenal události.", options: ["Alkohol blokuje přenos signálů v hipokampu (paměťové centrum) – nové vzpomínky se nevytváří, i když člověk jedná zdánlivě vědomě. Mozek nezaznamenal události.", "Alkohol způsobuje výpadky tím, že uspí část mozku.", "Výpadky vznikají dehydratací – alkohol odvodní mozek.", "Výpadky paměti způsobuje nikotin, ne alkohol."], hints: ["Hipokampus = centrum vytváření nových vzpomínek."] },
  { question: "Proč je heroin tak vysoce návykový?", correctAnswer: "Heroin přeměňuje na morfin v mozku, váže se na opioidní receptory → masivní uvolnění dopaminu. Mozek snižuje přirozené receptory → bez heroinu nastává extrémní utrpení – abstinenční syndrom.", options: ["Heroin přeměňuje na morfin v mozku, váže se na opioidní receptory → masivní uvolnění dopaminu. Mozek snižuje přirozené receptory → bez heroinu nastává extrémní utrpení (abstinenční syndrom).", "Heroin je návykový, protože způsobuje euforii, která je příjemná.", "Heroin je návykový jen psychicky – fyzická závislost nevzniká.", "Heroin ovlivňuje jen srdce a plíce – mozek zůstává nezměněn."], hints: ["Opioidní krize v USA: miliony lidí závislých na lékařsky předepsaných opioidech."] },
  { question: "Jak sociální tlak vrstevníků ovlivňuje první experimentování s drogami?", correctAnswer: "Touha patřit do skupiny – konformita, strach z odmítnutí, zvědavost a podcenění rizika. Prevence zahrnuje nácvik odmítnutí a budování identity mimo skupinu konzumentů.", options: ["Touha patřit do skupiny (konformita), strach z odmítnutí, zvědavost a podcenění rizika. Prevence zahrnuje nácvik odmítnutí a budování identity mimo skupinu konzumentů.", "Sociální tlak nehraje roli – drogy zkouší jen jedinci s problémovým zázemím.", "Experimentování s drogami je přirozené pro dospívající – nevede nutně k závislosti.", "Prevence je zbytečná – kdo chce, ten drogy najde bez vlivu vrstevníků."], hints: ["Peer pressure = tlak vrstevníků. Asertivita = zdravé odmítnutí."] },
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
