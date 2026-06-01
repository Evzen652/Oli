import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL_L1: QA[] = [
  { q: "Co je encyklopedie?", a: "Příručka s abecedně seřazenými fakty o světě", opts: ["Příručka s abecedně seřazenými fakty o světě", "Příručka s výkladem slov", "Novinový deník", "Sbírka pohádek"] },
  { q: "Co je slovník?", a: "Příručka s výkladem nebo překladem slov", opts: ["Příručka s výkladem nebo překladem slov", "Příručka s fakty o světě", "Novinový deník", "Sbírka básní"] },
  { q: "Co jsou periodika?", a: "Tiskoviny vycházející opakovaně (noviny, časopisy)", opts: ["Tiskoviny vycházející opakovaně (noviny, časopisy)", "Jednorázové knihy", "Encyklopedie", "Slovníky"] },
  { q: "Jak jsou hesla v encyklopedii seřazena?", a: "abecedně", opts: ["abecedně", "podle velikosti tématu", "chronologicky", "tematicky vždy na skupiny"] },
  { q: "Jak často vycházejí noviny?", a: "Denně", opts: ["Denně", "Týdně", "Měsíčně", "Ročně"] },
  { q: "Jak často vycházejí časopisy?", a: "Týdně nebo měsíčně", opts: ["Týdně nebo měsíčně", "Denně", "Ročně", "Jednou za 10 let"] },
  { q: "K čemu slouží výkladový slovník?", a: "Vysvětluje, co slova znamenají", opts: ["Vysvětluje, co slova znamenají", "Překládá slova do jiného jazyka", "Uvádí fakta o světě", "Poskytuje synonyma"] },
  { q: "K čemu slouží překladový slovník?", a: "Překládá slova z jednoho jazyka do druhého", opts: ["Překládá slova z jednoho jazyka do druhého", "Vysvětluje, co slova znamenají", "Uvádí fakta o světě", "Uvádí synonyma a antonyma"] },
  { q: "Kde najdeme heslo 'sopka' v encyklopedii?", a: "V části na písmeno S", opts: ["V části na písmeno S", "V části na písmeno Z (záchrana)", "V části na písmeno V (vulkán)", "Na konci encyklopedie"] },
  { q: "Novinový článek je příkladem:", a: "periodika (noviny = denní tisk)", opts: ["periodika (noviny = denní tisk)", "encyklopedie", "slovníku", "románu"] },
  { q: "Diderot nebo Britannica jsou příklady:", a: "encyklopedií", opts: ["encyklopedií", "slovníků", "periodik", "románů"] },
  { q: "Slovník synonymů nám pomáhá:", a: "najít slova s podobným významem", opts: ["najít slova s podobným významem", "přeložit text", "zjistit fakta o světě", "naučit se číst"] },
  { q: "Co je naučný slovník?", a: "Stručně vysvětluje odborné pojmy z různých oborů", opts: ["Stručně vysvětluje odborné pojmy z různých oborů", "Překládá slova do cizích jazyků", "Sbírá básně a prózu", "Uvádí jízdní řády"] },
  { q: "Kde hledáme informace o historii vynálezu kola?", a: "V encyklopedii (pod heslem 'kolo' nebo 'doprava')", opts: ["V encyklopedii (pod heslem 'kolo' nebo 'doprava')", "V překladovém slovníku", "V novinách", "V časopise pro děti"] },
  { q: "Co je věstník?", a: "Periodikum s úředními nebo spolkovými oznámeními", opts: ["Periodikum s úředními nebo spolkovými oznámeními", "Denní noviny", "Dětský časopis", "Encyklopedie"] },
  { q: "Jaký zdroj použijeme, pokud nevíme, co znamená slovo 'biodiverzita'?", a: "Slovník nebo naučná encyklopedie", opts: ["Slovník nebo naučná encyklopedie", "Denní noviny", "Románový text", "Jízdní řád"] },
];

const POOL_L2: QA[] = [
  { q: "Jaký je rozdíl mezi encyklopedií a slovníkem?", a: "Encyklopedie = fakty o světě; slovník = výklad nebo překlad slov", opts: ["Encyklopedie = fakty o světě; slovník = výklad nebo překlad slov", "Jsou to stejné věci", "Encyklopedie je menší; slovník větší", "Slovník má abecední řazení, encyklopedie ne"] },
  { q: "Jaký zdroj použijeme pro překlad slova 'house' z angličtiny?", a: "Překladový slovník (anglicko-český)", opts: ["Překladový slovník (anglicko-český)", "Encyklopedie", "Noviny", "Výkladový slovník češtiny"] },
  { q: "Jaký je rozdíl mezi novinami a časopisem?", a: "Noviny = denní tisk; časopisy = týdenní nebo měsíční", opts: ["Noviny = denní tisk; časopisy = týdenní nebo měsíční", "Jsou to stejné věci", "Noviny jsou větší; časopisy menší", "Časopisy jsou denní; noviny týdenní"] },
  { q: "Co je Slovník spisovné češtiny?", a: "Výkladový slovník s normativními tvary a pravidly", opts: ["Výkladový slovník s normativními tvary a pravidly", "Překladový slovník", "Encyklopedie českých autorů", "Sbírka básní"] },
  { q: "Proč jsou noviny periodika?", a: "Protože vychází opakovaně (denně)", opts: ["Protože vychází opakovaně (denně)", "Protože mají mnoho stran", "Protože jsou barevné", "Protože obsahují reklamy"] },
  { q: "Kde najdeme heslo 'Vltava' v encyklopedii?", a: "V části na písmeno V", opts: ["V části na písmeno V", "V části na písmeno R (řeky)", "V části na písmeno P (Praha)", "Na konci encyklopedie"] },
  { q: "K čemu slouží rejstřík na konci encyklopedie?", a: "Pro rychlé vyhledávání hesel nebo pojmů", opts: ["Pro rychlé vyhledávání hesel nebo pojmů", "Pro čtení o světě", "Pro překlad slov", "Pro výklad slov"] },
  { q: "Informaci o počtu obyvatel Prahy hledáme:", a: "V encyklopedii nebo statistické ročence", opts: ["V encyklopedii nebo statistické ročence", "V překladovém slovníku", "V beletrii", "V dětském časopisu"] },
  { q: "Synonymum slova 'šedivý' hledáme:", a: "Ve slovníku synonym (tezauru)", opts: ["Ve slovníku synonym (tezauru)", "V encyklopedii", "V novinách", "V románu"] },
  { q: "Dětský časopis 'ABC' je příkladem:", a: "periodika (časopis, vychází opakovaně)", opts: ["periodika (časopis, vychází opakovaně)", "encyklopedie", "výkladového slovníku", "naučné knihy"] },
  { q: "Které zdroje patří mezi periodika?", a: "Noviny, časopisy, věstníky", opts: ["Noviny, časopisy, věstníky", "Encyklopedie, slovníky, atlasy", "Románové knihy, sbírky básní", "Jízdní řády, mapy, plány"] },
  { q: "Co je 'naučný slovník' vs. 'výkladový slovník'?", a: "Naučný = odborné pojmy; výkladový = obecná slova s vysvětlením", opts: ["Naučný = odborné pojmy; výkladový = obecná slova s vysvětlením", "Jsou to stejné věci", "Naučný = překlady; výkladový = fakta", "Oba jsou encyklopedie"] },
  { q: "Proč hesla v encyklopedii jsou seřazena abecedně?", a: "Aby čtenář snadno a rychle našel hledané heslo", opts: ["Aby čtenář snadno a rychle našel hledané heslo", "Protože je to zákon", "Protože písmena jsou hezká", "Protože encyklopedie je dlouhá"] },
  { q: "Příklad výkladového slovníku česky:", a: "Slovník spisovné češtiny pro školu a veřejnost", opts: ["Slovník spisovné češtiny pro školu a veřejnost", "Anglicko-český slovník", "Diderotova encyklopedie", "Lidové noviny"] },
  { q: "Co obsahuje novinový článek, co encyklopedie ne?", a: "Aktuální informace a zprávy (co se stalo dnes)", opts: ["Aktuální informace a zprávy (co se stalo dnes)", "Fakta o historii", "Výklad slov", "Překlad do jiných jazyků"] },
  { q: "Proč jsou encyklopedie vydávány v nových edicích?", a: "Protože svět se mění a přibývají nová fakta", opts: ["Protože svět se mění a přibývají nová fakta", "Protože stará vydání jsou ošklivá", "Protože musí být delší", "Protože se mění abeceda"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Encyklopedie = fakta o světě, abecedně; Slovník = výklad nebo překlad slov",
      "Periodika = vycházejí opakovaně (noviny denně, časopisy týdně/měsíčně)",
      "Výkladový slovník = co slovo znamená; překladový = jak se řekne v jiném jazyce",
    ],
    solutionSteps: [
      "Urči, jaký zdroj informací hledáš.",
      "Fakta o světě → encyklopedie",
      "Výklad nebo překlad slov → slovník",
      "Aktuální zprávy → noviny/periodika",
    ],
  }));
}

export const ENCYKLOPEDIESLOVNIKPERIODIKA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-encyklopedie-slovnik-periodika",
    rvpNodeId: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-encyklopedie-slovnik-periodika",
    title: "Encyklopedie, slovník, periodika",
    studentTitle: "Knihy a zdroje info",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Poznáš různé druhy informačních zdrojů — encyklopedie, slovníky a periodika.",
    keywords: ["encyklopedie", "slovník", "periodika", "noviny", "časopis", "výkladový slovník", "překladový slovník"],
    goals: [
      "Rozlišit encyklopedii, slovník a periodika",
      "Vybrat správný zdroj pro danou potřebu",
    ],
    boundaries: ["Bez digitálních databází a internetu", "Bez pokročilé bibliografie"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Encyklopedie=fakta o světě; Slovník=výklad/překlad slov; Periodika=noviny/časopisy vycházející opakovaně",
      steps: [
        "Potřebuji fakta o tématu? → encyklopedie",
        "Potřebuji vysvětlit slovo? → výkladový slovník",
        "Potřebuji přeložit slovo? → překladový slovník",
        "Potřebuji aktuální zprávy? → noviny/periodika",
      ],
      commonMistake: "Záměna encyklopedie a slovníku — encyklopedie popisuje svět, slovník popisuje slova",
      example: "Co znamená 'metafora'? → slovník; Kde leží Kilimandžáro? → encyklopedie; Jaké je dnešní počasí? → noviny",
    },
  },
];
