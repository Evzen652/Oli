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
  { question: "Jak se nazývá buňka, která vznikne spojením vajíčka a spermie?", correctAnswer: "Zygota", options: ["Zygota", "Embryo", "Plod", "Novorozenec"], hints: ["Tato buňka je úplně první krok nového života, hned po spojení vajíčka a spermie."] },
  { question: "Jak dlouho trvá těhotenství přibližně?", correctAnswer: "40 týdnů – přibližně 9 měsíců", options: ["12 měsíců, tedy celý rok", "40 týdnů – přibližně 9 měsíců", "6 měsíců, tedy půl roku", "20 týdnů, tedy asi 5 měsíců"], hints: ["40 týdnů = přibližně 9 měsíců."] },
  { question: "Jak se jmenuje vývojové stadium od 2. do 8. týdne těhotenství?", correctAnswer: "Embryo", options: ["Zygota", "Plod", "Embryo", "Vajíčko"], hints: ["Toto vývojové stadium přichází hned po první buňce nového života a trvá zhruba do konce 2. měsíce těhotenství."] },
  { question: "Od kterého týdne se embryo nazývá plodem?", correctAnswer: "Od 9. týdne těhotenství", options: ["Od 20. týdne", "Od 2. týdne", "Od 1. dne po oplodnění", "Od 9. týdne těhotenství"], hints: ["Plod má již všechny základní orgány."] },
  { question: "Jak se jmenuje první menstruace u dívek?", correctAnswer: "Menarché", options: ["Menarché", "Puberta", "Ovulace", "Laktace"], hints: ["Tenhle odborný název patří jen té úplně první menstruaci v životě dívky."] },
  { question: "Jaké jsou základní pohlavní hormony u dívek a chlapců?", correctAnswer: "Dívky: estrogen. Chlapci: testosteron.", options: ["Dívky: testosteron. Chlapci: estrogen.", "Dívky: estrogen. Chlapci: testosteron.", "Oba stejně: jen hormon růstu.", "Žádné hormony se na tom nepodílejí."], hints: ["Hormony řídí pohlavní vývoj."] },
  { question: "Co je placenta?", correctAnswer: "Orgán spojující matku s plodem – přenáší živiny a kyslík a vylučuje odpadní látky plodu", options: ["Orgán ve vaječnících, který produkuje zralá vajíčka", "Sval děložní stěny, který pomáhá při samotném porodu", "Orgán spojující matku s plodem – přenáší živiny a kyslík a vylučuje odpadní látky plodu", "Buňky, které chrání plod před škodlivými bakteriemi"], hints: ["Placenta = 'zásobník' a 'odpadkový koš' plodu."] },
  { question: "Pohlavní rozmnožování člověka vyžaduje:", correctAnswer: "Vajíčko od ženy a spermii od muže", options: ["Pouze vajíčko, spermie potřeba nejsou", "Pouze spermii, vajíčko se vyvine samo", "Vajíčko od ženy i vajíčko od muže", "Vajíčko od ženy a spermii od muže"], hints: ["Nový život vzniká spojením dvou buněk. Od koho každá z nich pochází?"] },
  { question: "Co se stane při porodu?", correctAnswer: "Děložní svaly se stahují a vytlačují plod z dělohy ven do světa", options: ["Děložní svaly se stahují a vytlačují plod z dělohy ven do světa", "Plod se narodí sám bez pomoci matky", "Porod probíhá vždy císařským řezem", "Placenta se rozpadne a plod odpadne sám"], hints: ["Porod = konec těhotenství."] },
  { question: "Co je menstruační cyklus?", correctAnswer: "Pravidelný měsíční cyklus – přibližně 28 dní přípravy dělohy na možné oplodnění", options: ["Cyklus dívčích emocí způsobený hormony bez biologického účelu", "Pravidelný měsíční cyklus – přibližně 28 dní přípravy dělohy na možné oplodnění", "Ztráta vaječníků při přechodu do dospělosti", "Tvorba nových vajíček každý týden"], hints: ["Menstruace = vylití nepoužité děložní výstelky, pokud nedošlo k oplodnění."] },
  { question: "Proč jsou tělesné změny v pubertě normální?", correctAnswer: "Jsou způsobeny hormony a jsou součástí přirozeného dospívání – každý je zažívá, jen v trochu jiném čase", options: ["Jsou poruchou vývoje, která může být léčena léky", "Jsou výsledkem stravovacích návyků a mohou být zastaveny", "Jsou způsobeny hormony a jsou součástí přirozeného dospívání – každý je zažívá, jen v trochu jiném čase", "Jsou způsobeny stresem a zmizí samy bez dospívání"], hints: ["Dospívání je přirozené – nelze ho zastavit ani uspěchat."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se liší úloha ženského a mužského těla při vzniku nového života?", correctAnswer: "Ženské tělo tvoří vajíčka a nosí plod, mužské tvoří spermie", options: ["Obě těla mají při vzniku nového života úplně stejnou úlohu", "Ženské tělo tvoří spermie a mužské tělo nosí plod", "Mužské tělo tvoří hormony, ženské tělo zajišťuje pohyb", "Ženské tělo tvoří vajíčka a nosí plod, mužské tvoří spermie"], hints: ["Obě těla přispějí jednou pohlavní buňkou. Které z nich navíc plod devět měsíců nosí?"] },
  { question: "Co je ovulace a kdy v cyklu probíhá?", correctAnswer: "Uvolnění zralého vajíčka z vaječníku, přibližně uprostřed cyklu", options: ["Uvolnění zralého vajíčka z vaječníku, přibližně uprostřed cyklu", "Postupná tvorba vajíčka, která trvá celých devět měsíců", "Pohyb spermie směrem k vajíčku uvnitř dělohy", "Odloučení děložní výstelky na samém konci cyklu"], hints: ["Cyklus trvá zhruba 28 dní. Kdy asi musí být vajíčko připravené, aby mohlo být oplodněno?"] },
  { question: "Proč by těhotná žena neměla pít alkohol a kouřit?", correctAnswer: "Škodlivé látky projdou placentou do těla plodu a poškodí jeho vývoj", options: ["Plod si všechny látky vyrábí sám, na matce vůbec nezáleží", "Škodlivé látky projdou placentou do těla plodu a poškodí jeho vývoj", "Ovlivní to jenom váhu dítěte v okamžiku narození", "Placenta plod před všemi škodlivými látkami dokonale ochrání"], hints: ["Placenta propouští k plodu živiny z krve matky. Propouští jen to, co je zdravé?"] },
  { question: "V jakém pořadí se plod během těhotenství vyvíjí?", correctAnswer: "Nejdřív se založí orgány, pak přibývají pohyby a smysly, nakonec dozrávají plíce", options: ["Nejdřív se objeví pohyby, potom orgány a nakonec dělení buněk", "Vyvíjí se úplně rovnoměrně, celou dobu jen roste do velikosti", "Nejdřív se založí orgány, pak přibývají pohyby a smysly, nakonec dozrávají plíce", "Od 20. týdne je zcela hotový a zbytek času už jen přibírá"], hints: ["Co musí být hotové jako první, aby vůbec mohlo fungovat všechno ostatní?"] },
  { question: "Proč se dospívání u každého spouští v jinou dobu?", correctAnswer: "Řídí ho hormony a ty se u každého člověka zapnou trochu jindy", options: ["Rozhoduje o tom hlavně to, kolik toho člověk sní", "Závisí to na tom, kolik má člověk sourozenců", "Spouští se u všech dětí přesně ve stejném věku", "Řídí ho hormony a ty se u každého člověka zapnou trochu jindy"], hints: ["Co dospívání řídí? A je to u všech lidí nastavené na stejný čas?"] },
  { question: "Co se v těle děje, když vajíčko není oplodněno?", correctAnswer: "Připravená děložní výstelka se odloučí a odejde při menstruaci", options: ["Připravená děložní výstelka se odloučí a odejde při menstruaci", "Vajíčko zůstane v děloze uložené až do dalšího cyklu", "Vaječníky přestanou další vajíčka nadobro tvořit", "Děloha si výstelku uschová a použije ji příští měsíc znovu"], hints: ["Děloha se každý měsíc chystá přijmout oplodněné vajíčko. Co s přípravou udělá, když nepřijde?"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Dvojčata se narodila ve stejný den, ale vůbec si nejsou podobná. Jak je to možné?", correctAnswer: "Vznikla ze dvou různých vajíček, každé oplodnila jiná spermie", options: ["Jedno z nich se vyvíjelo mimo dělohu, a proto vypadá jinak", "Vznikla ze dvou různých vajíček, každé oplodnila jiná spermie", "Jedno se narodilo o celý měsíc dřív než to druhé", "Dvojčata si podle všeho nikdy podobná nejsou"], hints: ["Kolik vajíček muselo být oplodněno, aby vznikly dvě odlišné zygoty?"] },
  { question: "Proč je pro dítě důležité, aby se narodilo až kolem 40. týdne?", correctAnswer: "V posledních týdnech dozrávají plíce, aby dítě po narození dýchalo samo", options: ["V posledních týdnech si plod teprve vytváří vlastní placentu", "Do 40. týdne se plodu dokončuje kostra a rostou mu zuby", "V posledních týdnech dozrávají plíce, aby dítě po narození dýchalo samo", "V posledních týdnech si plod začne vyrábět vlastní krev"], hints: ["V děloze dostává plod kyslík od matky. Co musí umět v okamžiku, kdy se to přeruší?"] },
  { question: "Spolužák je v šesté třídě o hlavu menší než dívky ve třídě a trápí ho to. Co je pravda?", correctAnswer: "Dívky začínají dospívat dřív, chlapci je obvykle dorostou později", options: ["Znamená to, že jeho růst už definitivně skončil", "Kdyby víc sportoval a jedl, dorostl by je hned teď", "Je to odchylka vývoje, kterou je potřeba léčit", "Dívky začínají dospívat dřív, chlapci je obvykle dorostou později"], hints: ["Dospívání nezačíná u všech stejně. Která skupina bývá napřed a co to znamená za dva roky?"] },
  { question: "Proč se o placentě říká, že je pro plod zásobárnou i odpadkovým košem zároveň?", correctAnswer: "Přivádí mu z krve matky živiny a kyslík a odvádí od něj odpadní látky", options: ["Přivádí mu z krve matky živiny a kyslík a odvádí od něj odpadní látky", "Vyrábí pro plod potravu a ukládá mu zásoby tuku na horší časy", "Chrání plod před nárazy zvenčí a udržuje ho v teple", "Dodává plodu hotovou krev, protože si ji sám vytvořit neumí"], hints: ["Plod v děloze nejí ani nedýchá a přesto potřebuje obojí řešit. Kudy to jde dovnitř a ven?"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ROZMNOZOVACISOUSTAVAVYVOJCLOVEKAUVOD: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-rozmnozovaci-soustava-vyvoj-cloveka-uvod",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-rozmnozovaci-soustava-vyvoj-cloveka-uvod",
    title: "Rozmnožovací soustava, vývoj člověka (úvod)",
    studentTitle: "Vznik nového života",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Vývoj člověka a rozmnožování",
    briefDescription: "Dozvíš se základy o vzniku a vývoji nového života.",
    keywords: ["oplodnění", "těhotenství", "embryo", "plod", "hormony", "menstruace", "zygota"],
    goals: ["Popsat základní fáze vývoje od zygoty po novorozence", "Vysvětlit roli hormonů v pohlavním dozrávání", "Pochopit tělesné změny v pubertě jako přirozené"],
    boundaries: [
      "Neprobírá sexuální chování podrobně",
      "Neprobírá antikoncepci podrobně",
      "Neprobírá genetiku ani chromozomy — patří na 2. stupeň",
      "Neprobírá pohlavně přenosné nemoci ani vývojové vady",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vajíčko + spermie → zygota → embryo (1–8 týden) → plod (9–40 týden) → novorozenec.",
      steps: [
        "1. Oplodnění: vajíčko + spermie → zygota.",
        "2. Embryo: 1.–8. týden (zakládají se orgány).",
        "3. Plod: 9.–40. týden (vývoj a růst).",
        "4. Porod: přibližně ve 40. týdnu.",
        "5. Hormony puberty: estrogen (dívky), testosteron (chlapci).",
      ],
      commonMistake: "Záměna embrya a plodu — embryo je 1.–8. týden, od 9. týdne mluvíme o plodu.",
      example: "Vajíčko + spermie → zygota → embryo (1.–8. týden) → plod (9.–40. týden) → narození.",
    },
  },
];
