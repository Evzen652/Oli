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
  {
    question: "Co je osnova vyprávění?",
    correctAnswer: "plán textu rozčleněný na části (úvod, zápletka, vyvrcholení, závěr)",
    options: [
      "seznam postav",
      "plán textu rozčleněný na části (úvod, zápletka, vyvrcholení, závěr)",
      "seznam slov",
      "popis prostředí",
    ],
    hints: ["Osnova = kostru textu. Pomáhá napsat text přehledně."],
  },
  {
    question: "Jaká jsou čtyři základní části osnovy vyprávění?",
    correctAnswer: "úvod – zápletka – vyvrcholení – závěr",
    options: [
      "začátek – střed – konec",
      "úvod – zápletka – vyvrcholení – závěr",
      "popis – dialog – akce – konec",
      "postavy – prostředí – děj – poučení",
    ],
    hints: ["Čtyři části: kdo/kde/kdy → co se stalo → napětí → rozuzlení."],
  },
  {
    question: "Co patří do úvodu vyprávění?",
    correctAnswer: "uvedení postav, místa a doby děje",
    options: [
      "vyvrcholení příběhu",
      "závěr s poučením",
      "uvedení postav, místa a doby děje",
      "přímá řeč postav",
    ],
    hints: ["Úvod: kdo, kde, kdy – orientuje čtenáře."],
  },
  {
    question: "Co je zápletka ve vyprávění?",
    correctAnswer: "problém nebo událost, která narušuje klidný začátek a rozjede děj",
    options: [
      "závěrečné poučení",
      "popis prostředí",
      "problém nebo událost, která narušuje klidný začátek a rozjede děj",
      "seznam postav",
    ],
    hints: ["Zápletka = konflikt nebo problém, který je třeba vyřešit."],
  },
  {
    question: "Co je vyvrcholení ve vyprávění?",
    correctAnswer: "nejnapínavější okamžik příběhu, kulminace děje",
    options: [
      "klidný závěr",
      "úvod s popisem",
      "nejnapínavější okamžik příběhu, kulminace děje",
      "rozuzlení konfliktu",
    ],
    hints: ["Vyvrcholení = ten moment, kdy čtenář drží dech."],
  },
  {
    question: "Co obsahuje závěr vyprávění?",
    correctAnswer: "rozuzlení – jak se vše vyřešilo",
    options: [
      "nová zápletka",
      "popis prostředí",
      "rozuzlení – jak se vše vyřešilo",
      "seznam postav",
    ],
    hints: ["Závěr = konec příběhu, řešení problému."],
  },
  {
    question: "Rozvitá osnova se liší od jednoduché tím, že:",
    correctAnswer: "každou část dělí na dílčí podčásti (I.A, I.B, II.A...)",
    options: [
      "je vždy kratší",
      "každou část dělí na dílčí podčásti (I.A, I.B, II.A...)",
      "neobsahuje závěr",
      "je jen v bodech bez popisků",
    ],
    hints: ["Rozvitá osnova = podrobnější plán s podčástmi."],
  },
  {
    question: "Jaký čas se nejčastěji používá ve vyprávění?",
    correctAnswer: "minulý čas (byl, přišel, stalo se)",
    options: [
      "budoucí čas",
      "přítomný čas vždy",
      "minulý čas (byl, přišel, stalo se)",
      "podmiňovací způsob",
    ],
    hints: ["Vyprávění = to, co se stalo → minulý čas."],
  },
  {
    question: "Co pomáhá vyprávění udělat živým a napínavým?",
    correctAnswer: "přímá řeč, napětí, detaily smyslového vnímání",
    options: [
      "jen seznam faktů",
      "přímá řeč, napětí, detaily smyslového vnímání",
      "vědecké termíny",
      "opakování stejných vět",
    ],
    hints: ["Živé vyprávění = postavy mluví, čtenář cítí napětí."],
  },
  {
    question: "Proč je osnova užitečná před psaním?",
    correctAnswer: "pomáhá se neztratit v textu a udržet přehlednou strukturu",
    options: [
      "nutí psát kratší texty",
      "pomáhá se neztratit v textu a udržet přehlednou strukturu",
      "je povinná ze zákona",
      "zabraňuje přímé řeči",
    ],
    hints: ["Osnova = mapa textu. Bez ní se snadno ztratíme."],
  },
  {
    question: "Jaký prvek z přímé řeči dělá vyprávění věrohodnějším?",
    correctAnswer: "doslova citovaná slova postav v uvozovkách",
    options: [
      "odborné termíny",
      "doslova citovaná slova postav v uvozovkách",
      "mnoho přídavných jmen",
      "vědecká fakta",
    ],
    hints: ["'Pomozte!' zvolal. – přímá řeč dává postavám hlas."],
  },
  {
    question: "Ve které části osnovy se typicky nachází přímá řeč a dialog?",
    correctAnswer: "v zápletce a vyvrcholení",
    options: [
      "v úvodu vždy",
      "v závěru vždy",
      "v zápletce a vyvrcholení",
      "nikdy se nepoužívá",
    ],
    hints: ["Dialog a napětí jsou nejsilnější v prostřední části příběhu."],
  },
  {
    question: "Co je poučení (morální závěr) ve vyprávění?",
    correctAnswer: "závěrečná myšlenka, co příběh naučil nebo ukázal",
    options: [
      "seznam postav",
      "závěrečná myšlenka, co příběh naučil nebo ukázal",
      "popis prostředí",
      "datum napsání",
    ],
    hints: ["Poučení = co si čtenář odnáší z příběhu."],
  },
  {
    question: "Jaký prvek vyprávění udržuje čtenáře v napětí?",
    correctAnswer: "záměrné odkládání vyřešení problému, nečekané zvraty",
    options: [
      "mnoho popisů prostředí",
      "záměrné odkládání vyřešení problému, nečekané zvraty",
      "stručné a krátké věty bez emocí",
      "vědecké informace",
    ],
    hints: ["Napětí = čtenář neví, co bude dál."],
  },
  {
    question: "Jak správně začneme vyprávění, aby čtenáře zaujalo?",
    correctAnswer: "zajímavou situací, dialogem nebo otázkou",
    options: [
      "popisem počasí vždy",
      "zajímavou situací, dialogem nebo otázkou",
      "vysvětlením všech postav",
      "datem události",
    ],
    hints: ["Dobrý začátek chytí čtenáře od první věty."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak zní rozvitá osnova pro příběh o ztraceném psu?",
    correctAnswer: "I. Úvod (pes, rodina, zahrada) II.A Zápletka (pes zmizel) II.B Hledání III. Vyvrcholení (pes nalezen) IV. Závěr",
    options: [
      "I. Pes II. Rodina III. Zahrada IV. Konec",
      "I. Úvod (pes, rodina, zahrada) II.A Zápletka (pes zmizel) II.B Hledání III. Vyvrcholení (pes nalezen) IV. Závěr",
      "I. Popis psa II. Dialog III. Závěr",
      "jen seznam hlavních událostí",
    ],
    hints: ["Rozvitá osnova má podčásti (A, B, C) v každé části."],
  },
  {
    question: "Jaký problém nastane, když ve vyprávění vynecháme zápletku?",
    correctAnswer: "příběh nebude zajímavý – nebude co řešit",
    options: [
      "příběh bude lepší",
      "příběh nebude zajímavý – nebude co řešit",
      "závěr přijde dříve",
      "postavy ztratí jméno",
    ],
    hints: ["Bez zápletky = bez konfliktu = nudný příběh."],
  },
  {
    question: "Co je retrospektivní vyprávění?",
    correctAnswer: "vyprávění, které začíná v přítomnosti a vrací se zpět do minulosti",
    options: [
      "vyprávění od začátku do konce",
      "vyprávění, které začíná v přítomnosti a vrací se zpět do minulosti",
      "vyprávění o budoucnosti",
      "vyprávění z pohledu zvířete",
    ],
    hints: ["Retrospektiva = zpětný pohled. Začínám závěrem a vracím se."],
  },
  {
    question: "Jak zapíšeme osnovu ve formě vět?",
    correctAnswer: "každý bod osnovy = stručná věta popisující obsah té části",
    options: [
      "každý bod = jedno slovo",
      "každý bod osnovy = stručná věta popisující obsah té části",
      "jen přídavná jména",
      "záleží na délce textu",
    ],
    hints: ["Osnova ve větách: 'I. Pavel jde do lesa.' 'II. Ztratí se.' atd."],
  },
  {
    question: "Jak se liší jednoduché a složené osnovy?",
    correctAnswer: "jednoduché mají 3–4 body; složené mají podčásti (I.A, I.B, II.A...)",
    options: [
      "jednoduchá je vždy kratší",
      "jednoduché mají 3–4 body; složené mají podčásti (I.A, I.B, II.A...)",
      "složená je bez úvodu",
      "záleží jen na autorovi",
    ],
    hints: ["Rozvitá = detailnější. Jednoduchá = jen hlavní body."],
  },
  {
    question: "Ve které části osnovy se nejčastěji opisuje prostředí?",
    correctAnswer: "v úvodu a na začátku zápletky",
    options: [
      "ve vyvrcholení",
      "v závěru",
      "v úvodu a na začátku zápletky",
      "v každé části stejně",
    ],
    hints: ["Úvod nastavuje scénu – prostředí, čas, kdo tam je."],
  },
  {
    question: "Jakou funkci mají příslovce jako 'najednou', 'tu se stalo', 'v ten okamžik'?",
    correctAnswer: "vytvářejí napětí a označují zlomový okamžik děje",
    options: [
      "popisují prostředí",
      "uvozují dialog",
      "vytvářejí napětí a označují zlomový okamžik děje",
      "jen gramatická funkce",
    ],
    hints: ["'Najednou...' = moment překvapení = napětí."],
  },
  {
    question: "Jak zapíšeme vyvrcholení do osnovy?",
    correctAnswer: "stručně popisujeme nejtěžší okamžik nebo konflikt",
    options: [
      "popisujeme závěr",
      "stručně popisujeme nejtěžší okamžik nebo konflikt",
      "vyjmenujeme postavy",
      "pišeme dialog",
    ],
    hints: ["Vyvrcholení v osnově: 'III. Pavel visí nad propastí.' apod."],
  },
  {
    question: "Proč je přímá řeč v osnově označena jen stručně?",
    correctAnswer: "osnova je plán, dialog se rozepisuji až v samotném textu",
    options: [
      "protože přímá řeč je zakázaná",
      "osnova je plán, dialog se rozepisuji až v samotném textu",
      "osnova přímou řeč neobsahuje nikdy",
      "záleží na délce textu",
    ],
    hints: ["V osnově jen naznačíme: 'dialog mezi bratry'. Detaily píšeme v textu."],
  },
  {
    question: "Co je kompoziční zásada stupňování ve vyprávění?",
    correctAnswer: "napětí roste od úvodu ke vyvrcholení a poté klesá v závěru",
    options: [
      "příběh začíná napínavě a poté klesá",
      "napětí roste od úvodu ke vyvrcholení a poté klesá v závěru",
      "vyvrcholení je na začátku",
      "záleží na žánru",
    ],
    hints: ["Dramaturgie: úvod → narůstá → vrchol → rozuzlení → klid."],
  },
  {
    question: "Jak napsat závěr, aby byl přesvědčivý?",
    correctAnswer: "uzavřít otevřené otázky a zanechat čtenáře se silným pocitem",
    options: [
      "jen napsat 'konec'",
      "uzavřít otevřené otázky a zanechat čtenáře se silným pocitem",
      "opakovat úvod doslova",
      "přidat novou zápletku",
    ],
    hints: ["Dobrý závěr = všechno vyřešeno + emocionální tečka."],
  },
  {
    question: "Jak se správně stírá hranice mezi zápletkou a vyvrcholením?",
    correctAnswer: "napětí se stupňuje postupně – zápletka roste do vyvrcholení",
    options: [
      "jsou odděleny prázdnou řádkou",
      "napětí se stupňuje postupně – zápletka roste do vyvrcholení",
      "vyvrcholení je vždy kratší než zápletka",
      "záleží na žánru",
    ],
    hints: ["Příběh plynule přechází od problému k vrcholu."],
  },
  {
    question: "Co je 'in medias res' začátek vyprávění?",
    correctAnswer: "začínáme uprostřed děje, bez úvodu a prezentace postav",
    options: [
      "začínáme popisem prostředí",
      "začínáme uprostřed děje, bez úvodu a prezentace postav",
      "začínáme závěrem",
      "začínáme dialogem vždy",
    ],
    hints: ["Latinsky: in medias res = do středu věci. Čtenář je vhozen do akce."],
  },
  {
    question: "Jak se liší vyprávění od popisu?",
    correctAnswer: "vyprávění = příběh s dějem v čase; popis = jak něco vypadá nebo je",
    options: [
      "jsou totéž",
      "vyprávění = příběh s dějem v čase; popis = jak něco vypadá nebo je",
      "popis je vždy kratší",
      "vyprávění nepoužívá přídavná jména",
    ],
    hints: ["Vyprávění = co se stalo. Popis = jak to je."],
  },
  {
    question: "Proč je dobré v závěru shrnout hlavní poučení příběhu?",
    correctAnswer: "čtenář si odnáší z příběhu smysluplnou myšlenku",
    options: [
      "kvůli délce textu",
      "čtenář si odnáší z příběhu smysluplnou myšlenku",
      "není nutné",
      "záleží na žánru",
    ],
    hints: ["Poučení = přidaná hodnota příběhu. Dává mu smysl."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je epizoda ve vyprávění?",
    correctAnswer: "kratší uzavřený příběh v rámci většího příběhu",
    options: [
      "typ zápletky",
      "kratší uzavřený příběh v rámci většíhopříběhu",
      "druh osnovy",
      "závěrečné poučení",
    ],
    hints: ["Epizoda = vedlejší příběhová linie nebo kapitola."],
  },
  {
    question: "Co je rámcový příběh?",
    correctAnswer: "vnější příběh, který uvozuje vnitřní příběhy (pohádka v pohádce)",
    options: [
      "jen popis prostředí",
      "vnější příběh, který uvozuje vnitřní příběhy (pohádka v pohádce)",
      "závěrečné poučení",
      "typ osnovy",
    ],
    hints: ["Tisíc a jedna noc = rámcový příběh, uvnitř jsou další příběhy."],
  },
  {
    question: "Jak poznáme, zda je kompozice vyprávění správná?",
    correctAnswer: "děj plynule roste k vyvrcholení a logicky se rozuzluje",
    options: [
      "jen délkou textu",
      "děj plynule roste k vyvrcholení a logicky se rozuzluje",
      "počtem přídavných jmen",
      "záleží na autorovi",
    ],
    hints: ["Správná kompozice = napětí roste, pak klesá, konec dává smysl."],
  },
  {
    question: "Co je vypravěč v 1. osobě a co v 3. osobě?",
    correctAnswer: "1. osoba = 'já' (subjektivní pohled); 3. osoba = 'on/ona' (objektivnější pohled)",
    options: [
      "1. osoba je vždy v minulém čase",
      "1. osoba = 'já' (subjektivní pohled); 3. osoba = 'on/ona' (objektivnější pohled)",
      "3. osoba je vždy kratší",
      "záleží jen na žánru",
    ],
    hints: ["1. osoba: 'Viděl jsem...' 3. osoba: 'Pavel viděl...'"],
  },
  {
    question: "Jak se nazývá moment v příběhu, kdy se vše zlomí a problém začíná řešit?",
    correctAnswer: "peripetie (obrat, zlomový bod)",
    options: [
      "expozice",
      "zápletka",
      "peripetie (obrat, zlomový bod)",
      "epilog",
    ],
    hints: ["Peripetie = moment obratu děje."],
  },
  {
    question: "Co je expozice?",
    correctAnswer: "úvod příběhu představující prostředí a postavy",
    options: [
      "vyvrcholení",
      "úvod příběhu představující prostředí a postavy",
      "závěrečné poučení",
      "dialog postav",
    ],
    hints: ["Expozice = představení světa příběhu."],
  },
  {
    question: "Co je epilog?",
    correctAnswer: "doslov nebo závěr příběhu po hlavním ději",
    options: [
      "úvod příběhu",
      "doslov nebo závěr příběhu po hlavním ději",
      "typ zápletky",
      "dialog postav",
    ],
    hints: ["Epilog = co se stalo poté, po hlavním příběhu."],
  },
  {
    question: "Jak se v osnově označí přímá řeč?",
    correctAnswer: "stručnou poznámkou: 'dialog X a Y o problému Z'",
    options: [
      "celou větou v uvozovkách",
      "stručnou poznámkou: 'dialog X a Y o problému Z'",
      "vůbec se neoznačí",
      "záleží na délce dialogu",
    ],
    hints: ["V osnově jen naznačíme – v textu pak rozepisujeme."],
  },
  {
    question: "Proč autor záměrně zdržuje odhalení řešení ve vyvrcholení?",
    correctAnswer: "aby udržel čtenáře v napětí co nejdéle",
    options: [
      "aby text byl delší",
      "aby udržel čtenáře v napětí co nejdéle",
      "záleží na žánru",
      "je to chyba",
    ],
    hints: ["Umělé zdržení = suspense. Čtenář chce vědět, jak to dopadne."],
  },
  {
    question: "Jak se nazývá literární technika, kde budoucí události jsou naznačeny dříve?",
    correctAnswer: "předznamenání (foreshadowing)",
    options: [
      "retrospektiva",
      "předznamenání (foreshadowing)",
      "epilog",
      "peripetie",
    ],
    hints: ["Naznačení budoucnosti = čtenář tuší, ale neví jistě."],
  },
  {
    question: "Jak zapíšeme rozvitou osnovu vyprávění o výletu třídy?",
    correctAnswer: "I. Přípravy (kdo jde, kam, kdy) II.A Cesta autobusem II.B Příjezd III. Vyvrcholení (nečekaná situace) IV. Návrat a závěr",
    options: [
      "I. Výlet II. Třída III. Autobus IV. Konec",
      "I. Přípravy (kdo jde, kam, kdy) II.A Cesta autobusem II.B Příjezd III. Vyvrcholení (nečekaná situace) IV. Návrat a závěr",
      "jen chronologický seznam událostí",
      "záleží na délce výletu",
    ],
    hints: ["Rozvitá osnova = čtyři části s podčástmi."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const VYPRAVOVANISROZVINUTOUOSNOVOU: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-rozvinutou-osnovou",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-rozvinutou-osnovou",
    title: "Vyprávění s rozvinutou osnovou",
    studentTitle: "Vypravování",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Sestavíš osnovu a napíšeš vypravování s napětím.",
    keywords: ["vyprávění", "osnova", "zápletka", "vyvrcholení", "závěr", "příběh"],
    goals: [
      "Sestavit rozvitou osnovu vyprávění",
      "Rozlišit části příběhu (úvod, zápletka, vyvrcholení, závěr)",
      "Napsat vyprávění s napětím a přímou řečí",
    ],
    boundaries: [
      "Bez složité naratologické analýzy",
      "Neprobíráme avantgardní kompoziční techniky",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Osnova vyprávění: I. Úvod (kdo, kde, kdy) → II. Zápletka (problém) → III. Vyvrcholení (vrchol napětí) → IV. Závěr (rozuzlení).",
      steps: [
        "Vymysli hlavní postavu a prostředí (úvod).",
        "Vytvoř problém nebo konflikt (zápletka).",
        "Eskaluj napětí k vrcholu (vyvrcholení).",
        "Vyřeš problém a zakončí příběh (závěr).",
        "Rozveď osnovu na podčásti (A, B, C).",
      ],
      commonMistake: "Žáci vynechávají vyvrcholení nebo zápletku. Příběh bez problému není napínavý.",
      example: "I. Pavel jde do lesa. II. Ztratí se. III. Napadne ho medvěd. IV. Záchranáři ho najdou.",
    },
  },
];
