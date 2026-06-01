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
    question: "Co je to pravěk?",
    correctAnswer: "Nejstarší období lidských dějin před vznikem písma",
    options: [
      "Nejstarší období lidských dějin před vznikem písma",
      "Středověk",
      "Starověk",
      "Doba Karla IV.",
    ],
    hints: ["Pravěk = před psanými dějinami."],
    solutionSteps: ["Pravěk je nejstarší období lidské historie — lidé ještě neznali písmo."],
  },
  {
    question: "Jak si pravěcí lidé opatřovali potravu?",
    correctAnswer: "Lovili zvěř a sbírali plody (lovci a sběrači)",
    options: [
      "Lovili zvěř a sbírali plody (lovci a sběrači)",
      "Pěstovali obilí na polích",
      "Kupovali jídlo v obchodech",
      "Chovali dobytek na farmách",
    ],
    hints: ["Ve starší době kamenné lidé ještě neznali zemědělství."],
    solutionSteps: ["Lidé starší doby kamenné (paleolitu) lovili zvěř a sbírali plody — byli lovci a sběrači."],
  },
  {
    question: "Jak se nazývá nejstarší doba pravěku?",
    correctAnswer: "Starší doba kamenná (paleolit)",
    options: [
      "Starší doba kamenná (paleolit)",
      "Doba bronzová",
      "Doba železná",
      "Mladší doba kamenná (neolit)",
    ],
    hints: ["Paleolit = starý kámen (řecky)."],
    solutionSteps: ["Nejstarší doba pravěku je starší doba kamenná (paleolit) — lidé vyráběli kamenné nástroje."],
  },
  {
    question: "Co začali lidé dělat v mladší době kamenné (neolitu)?",
    correctAnswer: "Pěstovat obilí a chovat zvířata — stali se zemědělci",
    options: [
      "Pěstovat obilí a chovat zvířata — stali se zemědělci",
      "Tavit kovy",
      "Stavět hrady",
      "Psát knihy",
    ],
    hints: ["Neolit = nový kámen + zemědělství."],
    solutionSteps: ["V neolitu lidé přestali jen lovit a začali pěstovat obilí a chovat zvířata — zemědělská revoluce."],
  },
  {
    question: "Co je to Věstonická venuše?",
    correctAnswer: "Soška z doby kamenné nalezená v Dolních Věstonicích (stará asi 29 000 let)",
    options: [
      "Soška z doby kamenné nalezená v Dolních Věstonicích (stará asi 29 000 let)",
      "Středověká socha v Praze",
      "Soška z doby bronzové",
      "Figurka z doby Karla IV.",
    ],
    hints: ["Tato soška je jednou z nejstarších uměleckých předmětů na světě."],
    solutionSteps: ["Věstonická venuše je keramická sošková ženy stará asi 29 000 let — nalezena u Dolních Věstonic na Moravě."],
  },
  {
    question: "Z čeho se skládá bronz?",
    correctAnswer: "Z mědi a cínu",
    options: ["Z mědi a cínu", "Ze zlata a stříbra", "Ze železa a uhlíku", "Z kamene a hlíny"],
    hints: ["Bronz je slitina dvou kovů."],
    solutionSteps: ["Bronz je slitina mědi a cínu — je pevnější než čistá měď a sloužil na zbraně a nástroje."],
  },
  {
    question: "Jak se nazývají starověcí obyvatelé ČR ze starší doby železné?",
    correctAnswer: "Keltové",
    options: ["Keltové", "Slované", "Germáni", "Římané"],
    hints: ["Tento národ dál jméno dnešním Čechám — Boiové → Bohemia."],
    solutionSteps: ["Keltové (kmen Boiové) obývali české území v době železné — pojmenovali Čechy Bohemia."],
  },
  {
    question: "Kdy přišli Slované do střední Evropy?",
    correctAnswer: "Přibližně v 6. století n. l.",
    options: [
      "Přibližně v 6. století n. l.",
      "Ve 3. století př. n. l.",
      "Ve 12. století n. l.",
      "Ve 2. tisíciletí př. n. l.",
    ],
    hints: ["Slované přišli po zániku Římské říše."],
    solutionSteps: ["Slované přišli do střední Evropy přibližně v 6. století n. l. po odchodu Germánů."],
  },
  {
    question: "Co jsou to kamenné nástroje pravěkých lidí?",
    correctAnswer: "Sekyry, škrabadla, hroty kopí vyrobené z kamene",
    options: [
      "Sekyry, škrabadla, hroty kopí vyrobené z kamene",
      "Kovové meče a štíty",
      "Dřevěné hole",
      "Hliněné nádoby",
    ],
    hints: ["Pravěcí lidé ještě neuměli tavit kovy."],
    solutionSteps: ["Pravěcí lidé tvarovali kameny do nástrojů — sekyry, škrabadla, nože, hroty kopí."],
  },
  {
    question: "Co jsou to oppida u Keltů?",
    correctAnswer: "Keltská opevněná sídliště — hradiště",
    options: [
      "Keltská opevněná sídliště — hradiště",
      "Keltské hrobky",
      "Keltské chrámy",
      "Keltské osady bez opevnění",
    ],
    hints: ["Oppidum = latinský název pro keltské opevněné město."],
    solutionSteps: ["Oppida (oppidum = město latinsky) jsou keltská opevněná hradiště — centra obchodu a řemesel."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi paleolitem a neolitem?",
    correctAnswer: "Paleolit = lovci a sběrači; neolit = zemědělci a pastevci, keramika, osady",
    options: [
      "Paleolit = lovci a sběrači; neolit = zemědělci a pastevci, keramika, osady",
      "Paleolit = bronzové nástroje; neolit = kamenné nástroje",
      "Paleolit = osady; neolit = kočovný život",
      "V obou dobách lidé žili stejně",
    ],
    hints: ["Neolit = zemědělská revoluce — největší změna v pravěku."],
    solutionSteps: ["Paleolit: kočovní lovci. Neolit: usedlí zemědělci, keramika, kůlové domy, chov zvířat."],
  },
  {
    question: "Proč byl vynález zemědělství tak důležitý?",
    correctAnswer: "Lidé se usadili, mohli mít více jídla a budovat větší osady",
    options: [
      "Lidé se usadili, mohli mít více jídla a budovat větší osady",
      "Zemědělství přineslo kovy",
      "Zemědělství umožnilo psaní",
      "Zemědělství nebylo důležité",
    ],
    hints: ["Stabilní přísun jídla = možnost růstu populace a civilizace."],
    solutionSteps: ["Zemědělství dalo lidem stabilní zásoby jídla → usedlý způsob života → větší osady → specializace řemesel."],
  },
  {
    question: "Proč dal keltský kmen Boiové jméno Čechám?",
    correctAnswer: "Latinský název Boiové → Bohemia → Böhmen/Čechy",
    options: [
      "Latinský název Boiové → Bohemia → Böhmen/Čechy",
      "Boiové byli první Slované v Čechách",
      "Boiové postavili první hrady",
      "Boiové přinesli zemědělství do Čech",
    ],
    hints: ["Boiové byli keltský kmen v Čechách."],
    solutionSteps: ["Keltský kmen Boiové dal Čechám latinský název Bohemia — odtud anglické Bohemia i německé Böhmen."],
  },
  {
    question: "Co je to únětická kultura?",
    correctAnswer: "Kultura doby bronzové v ČR (pojmenovaná podle nálezů u Únětice)",
    options: [
      "Kultura doby bronzové v ČR (pojmenovaná podle nálezů u Únětice)",
      "Kultura neolitická",
      "Keltská kultura",
      "Slovanská kultura",
    ],
    hints: ["Únětice je obec u Prahy, kde byly nalezeny bronzové předměty."],
    solutionSteps: ["Únětická kultura je doby bronzové (2000–1500 př. n. l.) — pojmenovaná podle nálezů u Únětice."],
  },
  {
    question: "Jak se jmenoval nejstarší pravěký člověk, jehož pozůstatky jsou v ČR?",
    correctAnswer: "Homo sapiens (kromaňonec) a neandrtálec",
    options: [
      "Homo sapiens (kromaňonec) a neandrtálec",
      "Homo habilis",
      "Australopithecus",
      "Homo erectus",
    ],
    hints: ["Věstonická venuše patří moderním lidem — Homo sapiens."],
    solutionSteps: ["V ČR jsou nálezy neandrtálců (Šipka u Štramberku) a moderních lidí Homo sapiens (Dolní Věstonice)."],
  },
  {
    question: "Proč je nalezení Věstonické venuše v Dolních Věstonicích tak výjimečné?",
    correctAnswer: "Je to jedna z nejstarších keramických figurek na světě (29 000 let)",
    options: [
      "Je to jedna z nejstarších keramických figurek na světě (29 000 let)",
      "Je zlatá",
      "Je to první socha v Čechách",
      "Je vysoká 2 metry",
    ],
    hints: ["Věstonická venuše je stará asi 29 000 let."],
    solutionSteps: ["Věstonická venuše je stará asi 29 000 let a je jednou z nejstarších keramik (keramika z hlíny) na světě."],
  },
  {
    question: "Proč Keltové stavěli oppida?",
    correctAnswer: "Pro ochranu, obchod a výrobu řemesel — byla to správní centra",
    options: [
      "Pro ochranu, obchod a výrobu řemesel — byla to správní centra",
      "Jako hrobky",
      "Jako chrámy bohů",
      "Jako zemědělské usedlosti",
    ],
    hints: ["Oppidum = opevněné centrum keltské společnosti."],
    solutionSteps: ["Oppida sloužila jako centra řemesel, obchodu a správy — chráněná valem a příkopem."],
  },
  {
    question: "Co přinesla doba bronzová oproti době kamenné?",
    correctAnswer: "Tvrdší a ostřejší nástroje a zbraně z bronzu, obchod s kovem",
    options: [
      "Tvrdší a ostřejší nástroje a zbraně z bronzu, obchod s kovem",
      "Zemědělství a osady",
      "Písmo a školy",
      "Hrady a opevnění",
    ],
    hints: ["Bronz je pevnější než kámen."],
    solutionSteps: ["Bronzová doba přinesla pevnější nástroje a zbraně z bronzu → rozvoj obchodu se surovinou (mědí a cínem)."],
  },
  {
    question: "Jak se lišili Keltové od Slovanů?",
    correctAnswer: "Keltové přišli dříve (doba železná), Slované je nahradili v 6. stol. n. l.",
    options: [
      "Keltové přišli dříve (doba železná), Slované je nahradili v 6. stol. n. l.",
      "Keltové a Slované žili ve stejné době",
      "Slované přišli dříve než Keltové",
      "Keltové byli předky Slovanů",
    ],
    hints: ["Chronologie: Keltové → Germáni → Slované."],
    solutionSteps: ["Keltové žili v ČR v době železné (5.–1. stol. př. n. l.), pak přišli Germáni a v 6. stol. n. l. Slované."],
  },
  {
    question: "Proč se starší době kamenné říká paleolit?",
    correctAnswer: "Z řeckého palaios (starý) + lithos (kámen)",
    options: [
      "Z řeckého palaios (starý) + lithos (kámen)",
      "Podle prvního archeologa Paleose",
      "Protože lidé žili v jeskyních",
      "Protože používali bronzové nástroje",
    ],
    hints: ["Lithos = kámen řecky. Palaios = starý."],
    solutionSteps: ["Paleolit pochází z řečtiny: palaios = starý + lithos = kámen → starší (starý) doba kamenná."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jak ovlivnil přechod k zemědělství složení společnosti?",
    correctAnswer: "Vznikly specializace — řemeslníci, obchodníci, náčelníci — třídní společnost",
    options: [
      "Vznikly specializace — řemeslníci, obchodníci, náčelníci — třídní společnost",
      "Společnost se nezměnila",
      "Lidé se stali rovnějšími",
      "Zemědělství způsobilo válečnictví",
    ],
    hints: ["Když ne každý musí shánět jídlo, může se věnovat jiné práci."],
    solutionSteps: ["Zemědělství = přebytek jídla → někteří se mohou specializovat (řemesla, obchod, správa) → vznik sociální hierarchie."],
  },
  {
    question: "Proč se v ČR nedochovaly keltské psané záznamy?",
    correctAnswer: "Keltové nepoužívali písmo pro každodenní záznamy — uchovávali znalosti ústně",
    options: [
      "Keltové nepoužívali písmo pro každodenní záznamy — uchovávali znalosti ústně",
      "Keltové uměli psát, ale záznamy byly zničeny",
      "Keltové neměli kulturu hodnou záznamu",
      "Keltové psali, ale jejich jazyk ještě nebyl přeložen",
    ],
    hints: ["Druidové — kněží Keltů — uchovávali znalosti v paměti."],
    solutionSteps: ["Keltové sice znali řecké a latinské písmo, ale druidové (kněží) úmyslně nepisali — tradice se předávala ústně."],
  },
  {
    question: "Co dokládá, že v pravěku existoval obchod na velké vzdálenosti?",
    correctAnswer: "Nálezy jantaru, mušlí a bronzu (cín z Británie, měď z Alp) daleko od jejich zdrojů",
    options: [
      "Nálezy jantaru, mušlí a bronzu (cín z Británie, měď z Alp) daleko od jejich zdrojů",
      "Pravěcí lidé se přesouvali s celou osadou",
      "Pravěk neměl obchod — každá skupina si vystačila sama",
      "Keramika nalezená na více místech",
    ],
    hints: ["Jantar pochází z Baltského moře, ale nachází se i v Čechách."],
    solutionSteps: ["Jantar ze severu, mušle z jihu a cín z daleka v českých nálezech dokazují rozsáhlé obchodní sítě pravěku."],
  },
  {
    question: "Proč se říká, že neolit byl 'zemědělskou revolucí'?",
    correctAnswer: "Změnil způsob života celé lidské civilizace — z kočovného na usedlý a produktivní",
    options: [
      "Změnil způsob života celé lidské civilizace — z kočovného na usedlý a produktivní",
      "Zemědělství se rozšířilo za jeden rok",
      "Neolit přinesl kovy a písmo",
      "Revoluce proběhla jen v Čechách",
    ],
    hints: ["Revoluce = zásadní, rychlá změna způsobu života."],
    solutionSteps: ["Zemědělská revoluce neolitu = přechod z lovu a sběru na pěstování plodin → základ pro vznik civilizací."],
  },
  {
    question: "Proč Keltové opustili České území v 1. stol. př. n. l.?",
    correctAnswer: "Byli vytlačeni germánskými kmeny — Markomany a Kvády",
    options: [
      "Byli vytlačeni germánskými kmeny — Markomany a Kvády",
      "Sami odešli do Skandinávie",
      "Byli zničeni Slovany",
      "Přesídlili do Itálie",
    ],
    hints: ["Po Keltech přišli do Čech Germáni."],
    solutionSteps: ["Keltové byli z Čech vytlačeni germánskými kmeny (Markomané, Kvádové) kolem 1. stol. př. n. l."],
  },
  {
    question: "Co nám říkají hroby (pohřebiště) z doby bronzové o tehdejší společnosti?",
    correctAnswer: "Bohatší hroby s bronzem a šperky ukazují na hierarchii — někteří lidé měli vyšší status",
    options: [
      "Bohatší hroby s bronzem a šperky ukazují na hierarchii — někteří lidé měli vyšší status",
      "Všichni lidé byli pohřbeni stejně — společnost byla rovná",
      "Hroby ukazují, že lidé neměli žádné šperky",
      "Hroby neukazují nic o společnosti",
    ],
    hints: ["Archeolog ze hrobu vyčte o zemřelém hodně."],
    solutionSteps: ["Bohaté hroby s bronzovými zbraněmi a zlatem ukazují, že existovala elita — náčelníci a bojovníci."],
  },
  {
    question: "Proč přisuzujeme pravěkému umění (Věstonická venuše, jeskynní malby) náboženský nebo magický účel?",
    correctAnswer: "Zobrazovaly plodnost, zvěř pro lov nebo duchy — šlo o rituální předměty",
    options: [
      "Zobrazovaly plodnost, zvěř pro lov nebo duchy — šlo o rituální předměty",
      "Pravěcí lidé malovali jen pro zábavu",
      "Umění bylo výukovým prostředkem",
      "Umění sloužilo k ozdobě obydlí",
    ],
    hints: ["Rituál a magie byly pro pravěké lovce důležité pro přežití."],
    solutionSteps: ["Pravěké sošky a malby nejspíš sloužily rituálům — magické zajištění úspěšného lovu nebo uctívání plodnosti."],
  },
  {
    question: "Co je to neandrtálec a jak se lišil od moderního člověka?",
    correctAnswer: "Primitivnější druh Homo — mohutnější stavba, menší mozek, vymřel asi 40 000 let př. n. l.",
    options: [
      "Primitivnější druh Homo — mohutnější stavba, menší mozek, vymřel asi 40 000 let př. n. l.",
      "Neandrtálec = primát, nikoliv člověk",
      "Neandrtálec byl přímým předkem moderního člověka",
      "Neandrtálec žil v době bronzové",
    ],
    hints: ["Neandrtálci a Homo sapiens žili vedle sebe krátce."],
    solutionSteps: ["Neandrtálec (Homo neanderthalensis) byl samostatný druh — robustnější, vyhynul asi 40 000 let př. n. l., částečně se s Homo sapiens křížil."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const count = level === 3 ? Math.min(pool.length, 40) : Math.min(pool.length, 30);
  return shuffle(pool).slice(0, count);
}

export const PRAVEKAPRVNILIDENANASEMUZEMI: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-pravek-a-prvni-lide-na-nasem-uzemi",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-pravek-a-prvni-lide-na-nasem-uzemi",
    title: "Pravěk a první lidé na našem území",
    studentTitle: "Pravěk v Čechách",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš, jak žili první lidé na území ČR od lovců po zemědělce a Kelty.",
    keywords: ["pravěk", "paleolit", "neolit", "Keltové", "Slované", "Věstonická venuše", "bronz"],
    goals: [
      "Rozlišit hlavní pravěké epochy (paleolit, neolit, bronz, železo)",
      "Popsat způsob života lovců a zemědělců",
      "Znát Věstonickou venuši a Kelty",
      "Vysvětlit, kdy přišli Slované",
    ],
    boundaries: ["Přesné datování není povinné", "Detailní archeologie není cílem"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Pravěk: paleolit (lovci) → neolit (zemědělci) → bronz (bronz = měď+cín) → železo (Keltové). Věstonická venuše = 29 000 let, Dolní Věstonice.",
      steps: [
        "Vzpomeň si na posloupnost: kámen → bronz → železo",
        "Neolit = zemědělci, neolit přišel po paleolitu",
        "Keltové (Boiové) → Bohemia → Čechy",
        "Slované přišli v 6. stol. n. l.",
      ],
      commonMistake: "Žáci si pletou neolit (zemědělci) s neandrtálci — jsou to odlišné věci.",
      example: "Paleolit: Věstonická venuše 29 000 let. Neolit: zemědělci, keramika. Bronz: únětická kultura. Železo: Keltové.",
    },
  },
];
