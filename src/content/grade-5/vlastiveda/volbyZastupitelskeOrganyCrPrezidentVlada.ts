import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Z kolika komor se skládá Parlament České republiky?",
    correctAnswer: "Dvou — Poslanecká sněmovna a Senát",
    options: [
      "Dvou — Poslanecká sněmovna a Senát",
      "Jedné — pouze Senát",
      "Tří — Sněmovna, Senát a Prezident",
      "Jedné — pouze Sněmovna",
    ],
    hints: ["Dvoukomorový parlament."],
    solutionSteps: ["Parlament ČR tvoří Poslanecká sněmovna (dolní komora) a Senát (horní komora)."],
  },
  {
    question: "Kolik poslanců má Poslanecká sněmovna?",
    correctAnswer: "200",
    options: ["200", "81", "100", "500"],
    hints: ["Senát má 81 senátorů."],
    solutionSteps: ["Poslanecká sněmovna má 200 poslanců volených na 4 roky."],
  },
  {
    question: "Kolik senátorů má Senát ČR?",
    correctAnswer: "81",
    options: ["81", "200", "100", "60"],
    hints: ["Sněmovna má 200 poslanců."],
    solutionSteps: ["Senát má 81 senátorů volených na 6 let."],
  },
  {
    question: "Na jak dlouho jsou voleni poslanci Poslanecké sněmovny?",
    correctAnswer: "4 roky",
    options: ["4 roky", "6 let", "5 let", "2 roky"],
    hints: ["Senátoři mají delší funkční období."],
    solutionSteps: ["Poslanci jsou voleni na 4 roky, senátoři na 6 let."],
  },
  {
    question: "Na jak dlouho je volen prezident ČR?",
    correctAnswer: "5 let – max. 2 funkční období",
    options: ["5 let – max. 2 funkční období", "4 roky", "6 let", "7 let"],
    hints: ["Delší než poslanci, kratší než senátoři."],
    solutionSteps: ["Prezident ČR je volen přímou volbou na 5 let, max. 2× za sebou."],
  },
  {
    question: "Kdo volí prezidenta ČR?",
    correctAnswer: "Přímo občané v přímé volbě",
    options: [
      "Přímo občané v přímé volbě",
      "Parlament – Sněmovna a Senát",
      "Vláda",
      "Jmenuje ho EU",
    ],
    hints: ["Od roku 2013 volíme prezidenta přímo."],
    solutionSteps: ["Od 2013 probíhá přímá prezidentská volba — hlasují všichni občané 18+."],
  },
  {
    question: "Od kolika let mohou občané ČR volit?",
    correctAnswer: "18 let",
    options: ["18 let", "16 let", "21 let", "15 let"],
    hints: ["Věk plnoletosti."],
    solutionSteps: ["V ČR mají volební právo všichni občané od 18 let věku."],
  },
  {
    question: "Co je úkolem vlády?",
    correctAnswer: "Řídit stát — vykonávat zákony a spravovat jednotlivá ministerstva",
    options: [
      "Řídit stát — vykonávat zákony a spravovat jednotlivá ministerstva",
      "Vydávat zákony",
      "Rozhodovat o válce a míru",
      "Volit prezidenta",
    ],
    hints: ["Vláda = exekutiva."],
    solutionSteps: ["Vláda (premiér + ministři) je výkonná moc — spravuje stát a plní zákony."],
  },
  {
    question: "Jak se nazývá vedoucí vlády ČR?",
    correctAnswer: "Předseda vlády – premiér",
    options: ["Předseda vlády – premiér", "Prezident", "Předseda Sněmovny", "Kancléř"],
    hints: ["Jmenuje ho prezident."],
    solutionSteps: ["Vládu vede předseda vlády (premiér), jmenovaný prezidentem."],
  },
  {
    question: "Komu je vláda odpovědná?",
    correctAnswer: "Poslanecké sněmovně",
    options: ["Poslanecké sněmovně", "Prezidentovi", "Senátu", "Ústavnímu soudu"],
    hints: ["Sněmovna může vládě vyslovit nedůvěru."],
    solutionSteps: ["Vláda musí mít důvěru Poslanecké sněmovny, která může vládě vyslovit nedůvěru."],
  },
  {
    question: "Jaký typ hlasování musí být ve volbách?",
    correctAnswer: "Tajné hlasování",
    options: ["Tajné hlasování", "Veřejné hlasování zdvižením ruky", "Online hlasování", "Ústní hlasování"],
    hints: ["Volí se za plentou."],
    solutionSteps: ["Volby v demokratickém státě jsou vždy tajné — nikdo neví, koho jsi volil."],
  },
  {
    question: "Co je Ústavní soud?",
    correctAnswer: "Soud, který dohlíží na dodržování Ústavy a chrání základní práva",
    options: [
      "Soud, který dohlíží na dodržování Ústavy a chrání základní práva",
      "Nejvyšší trestní soud",
      "Správní soud pro daňové spory",
      "Soud pro volební spory",
    ],
    hints: ["Ústava = základní zákon státu."],
    solutionSteps: ["Ústavní soud rozhoduje, zda jsou zákony v souladu s Ústavou ČR."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč má Parlament dvě komory — Sněmovnu a Senát?",
    correctAnswer: "Senát kontroluje a brzdí Sněmovnu — zabraňuje unáhleným rozhodnutím",
    options: [
      "Senát kontroluje a brzdí Sněmovnu — zabraňuje unáhleným rozhodnutím",
      "Sněmovna a Senát dělají totéž — je to nadbytečné",
      "Senát volí prezidenta",
      "Sněmovna je pro západ, Senát pro východ Čech",
    ],
    hints: ["Dvoukomorový systém = pojistka demokracie."],
    solutionSteps: ["Senát jako 'pojistka' přezkoumává zákony Sněmovny a zabraňuje rychlým nekvalitním rozhodnutím."],
  },
  {
    question: "Proč je volba prezidenta přímá — tedy kdy volí přimo občané?",
    correctAnswer: "Přímá volba dává prezidentovi silnější demokratický mandát od lidu",
    options: [
      "Přímá volba dává prezidentovi silnější demokratický mandát od lidu",
      "Parlament není schopný vybrat prezidenta",
      "Je to levnější než parlamentní volba",
      "EU nařídila přímou volbu prezidenta",
    ],
    hints: ["Čím víc lidí prezidenta volí, tím silnější má mandát."],
    solutionSteps: ["Přímá volba = prezident je odpovědný přímo občanům, ne jen parlamentu."],
  },
  {
    question: "Jak se liší role prezidenta a premiéra?",
    correctAnswer: "Prezident = hlava státu (ceremoniální + jmenovací role); premiér = šéf vlády – výkonná moc",
    options: [
      "Prezident = hlava státu (ceremoniální + jmenovací role); premiér = šéf vlády – výkonná moc",
      "Jsou to totéž — oba řídí vládu",
      "Premiér je nadřazen prezidentovi",
      "Prezident řídí ministerstva přímo",
    ],
    hints: ["V ČR je prezident spíš symbolická funkce."],
    solutionSteps: ["Prezident = hlava státu, reprezentuje ČR; premiér + vláda = každodenní řízení státu."],
  },
  {
    question: "Proč je tajné hlasování důležité pro demokracii?",
    correctAnswer: "Chrání voliče před tlakem nebo odvetou za svobodné hlasování",
    options: [
      "Chrání voliče před tlakem nebo odvetou za svobodné hlasování",
      "Je to jen tradice bez účelu",
      "Usnadňuje sčítání hlasů",
      "Je to povinné pro vstup do EU",
    ],
    hints: ["Co by se stalo, kdyby zaměstnavatel věděl, koho voliš?"],
    solutionSteps: ["Tajnost volby chrání slobodu rozhodnutí — nikdo nemůže být trestán za svůj volební hlas."],
  },
  {
    question: "Proč vláda potřebuje důvěru Sněmovny?",
    correctAnswer: "V demokracii musí výkonná moc být kontrolována zákonodárnou mocí",
    options: [
      "V demokracii musí výkonná moc být kontrolována zákonodárnou mocí",
      "Je to jen zvyk bez právního základu",
      "Vláda kontroluje Sněmovnu, ne obráceně",
      "Sněmovna potřebuje souhlas vlády",
    ],
    hints: ["Zákonodárná moc kontroluje moc výkonnou."],
    solutionSteps: ["Dělba mocí: Sněmovna kontroluje vládu — pokud vládě nevěří, může ji odvolat."],
  },
  {
    question: "Proč mají senátoři delší funkční období (6 let) než poslanci (4 roky)?",
    correctAnswer: "Senát má být stabilnější a méně ovlivnitelný krátkodobými politickými náladami",
    options: [
      "Senát má být stabilnější a méně ovlivnitelný krátkodobými politickými náladami",
      "Senátoři jsou starší, takže potřebují víc času",
      "Je to historický omyl",
      "EU nařídila 6letý mandát",
    ],
    hints: ["Delší mandát = větší kontinuita a stabilita."],
    solutionSteps: ["Senát s 6letým mandátem a třetinovými obnovy zajišťuje kontinuitu a nezávislost."],
  },
  {
    question: "Co znamená princip dělby moci?",
    correctAnswer: "Moc je rozdělena mezi zákonodárnou (parlament), výkonnou (vláda) a soudní – soudy",
    options: [
      "Moc je rozdělena mezi zákonodárnou (parlament), výkonnou (vláda) a soudní – soudy",
      "Moc má jen prezident",
      "Vláda rozhoduje o všem",
      "Soud může vydávat zákony",
    ],
    hints: ["Tři složky státní moci."],
    solutionSteps: ["Dělba moci = zákonodárná (parlament), výkonná (vláda), soudní (soudy) — vzájemná kontrola."],
  },
  {
    question: "Proč v demokracii nestačí jedny volby na celý život?",
    correctAnswer: "Pravidelné volby umožňují lidu zhodnotit politiky a vyměnit je, pokud selhali",
    options: [
      "Pravidelné volby umožňují lidu zhodnotit politiky a vyměnit je, pokud selhali",
      "Je to jen tradice",
      "Politici sami chtějí být pravidelně voleni",
      "EU nařídila pravidelné volby",
    ],
    hints: ["Volba = způsob kontroly politiků."],
    solutionSteps: ["Pravidelné volby zajišťují, že politici jsou odpovědní voličům — jinak je lze vyměnit."],
  },
  {
    question: "Kdo jmenuje ministry vlády?",
    correctAnswer: "Prezident na návrh předsedy vlády",
    options: [
      "Prezident na návrh předsedy vlády",
      "Sněmovna přímo hlasováním",
      "Premiér sám bez prezidenta",
      "Senát",
    ],
    hints: ["Premiér navrhuje, prezident jmenuje."],
    solutionSteps: ["Formálně jmenuje ministry prezident, ale vybírá je premiér (předseda vlády)."],
  },
  {
    question: "Jak se zjistí, kdo zvítězil ve volbách?",
    correctAnswer: "Hlasy se tajně sečtou — vítěz je strana nebo kandidát s nejvyšším počtem",
    options: [
      "Hlasy se tajně sečtou — vítěz je strana nebo kandidát s nejvyšším počtem",
      "O vítězi rozhoduje Ústavní soud",
      "Prezident jmenuje vítěze",
      "Vítěz je určen loterií",
    ],
    hints: ["Demokratické volby = spravedlivé sčítání."],
    solutionSteps: ["Po uzavření volebních místností se hlasy sčítají — transparentně a kontrolovaně."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď orgány ČR podle počtu členů od nejméně po nejvíce.",
    correctAnswer: "Prezident → Senát → Sněmovna",
    items: [
      "Prezident (1 osoba)",
      "Senát (81 senátorů)",
      "Poslanecká sněmovna (200 poslanců)",
    ],
    hints: ["Prezident je vždy jen 1 osoba."],
    solutionSteps: ["1 prezident < 81 senátorů < 200 poslanců."],
  },
  {
    question: "Spoj orgán s jeho funkcí.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "Poslanecká sněmovna", right: "200 poslanců, schvaluje zákony" },
      { left: "Senát", right: "81 senátorů, kontroluje zákony" },
      { left: "Prezident", right: "Hlava státu, jmenuje vládu" },
      { left: "Vláda", right: "Výkonná moc, řídí ministerstva" },
      { left: "Ústavní soud", right: "Dohlíží na ústavnost zákonů" },
    ],
    hints: ["Sněmovna schvaluje, Senát kontroluje."],
    solutionSteps: ["Zákonodárná moc: Sněmovna + Senát. Výkonná: Vláda + Prezident. Soudní: Ústavní soud."],
  },
  {
    question: "Proč je dělba moci zárukou demokracie?",
    correctAnswer: "Žádná skupina nemá všechnu moc — navzájem se kontrolují a brzdí",
    options: [
      "Žádná skupina nemá všechnu moc — navzájem se kontrolují a brzdí",
      "Dělba moci způsobuje chaos",
      "Demokracie funguje lépe se silným vůdcem",
      "Dělba moci je jen formální — ve skutečnosti vládne president",
    ],
    hints: ["Montesquieu — otec principu dělby moci."],
    solutionSteps: ["Dělba moci zabraňuje tyranii — každý orgán kontroluje ostatní."],
  },
  {
    question: "Jak se liší volby poslanců a volba prezidenta v ČR?",
    correctAnswer: "Poslanci: stranické listiny; prezident: přímá osobní volba občany",
    options: [
      "Poslanci: stranické listiny; prezident: přímá osobní volba občany",
      "Obě volby jsou totožné",
      "Prezidenta volí Senát, poslance prezident",
      "Prezident není volený",
    ],
    hints: ["Prezidentskou volbu zavedla ČR v 2013."],
    solutionSteps: ["Parlamentní volby = výběr stran; prezidentská = osobní přímá volba."],
  },
  {
    question: "Proč komunikistický režim nebyl demokracií?",
    correctAnswer: "Byly jen jedny 'volby', jeden povolený výsledek a žádná dělba moci",
    options: [
      "Byly jen jedny 'volby', jeden povolený výsledek a žádná dělba moci",
      "Komunisté volby neměli vůbec",
      "Komunismus byl jen jiný typ demokracie",
      "Dělba moci existovala, jen jinak pojmenovaná",
    ],
    hints: ["Srovnej svobodné volby s komunistickými 'volbami'."],
    solutionSteps: ["Komunistické 'volby' měly jen povolený výsledek; KSČ držela všechnu moc — anti-demokracie."],
  },
  {
    question: "Jak bys jako 18letý využil volební právo? Která volba je nejdůležitější?",
    correctAnswer: "Všechny jsou důležité — volba stránek i prezidenta ovlivňuje stát různými způsoby",
    options: [
      "Všechny jsou důležité — volba stránek i prezidenta ovlivňuje stát různými způsoby",
      "Jen prezidentská volba má smysl",
      "Jen volby do Sněmovny jsou důležité",
      "Volby jsou zbytečné — politici dělají, co chtějí",
    ],
    hints: ["Parlament schvaluje zákony, prezident reprezentuje."],
    solutionSteps: ["Všechny typy voleb jsou důležité — parlamentní, senátní, prezidentské i komunální."],
  },
];

function gen(level: number): PracticeTask[] {
  // POOL_L3 obsahuje drag_order/match_pairs tasks — pro select_one topic použij L1+L2
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : [...POOL_L1, ...POOL_L2];
  return shuffle(pool).slice(0, 30);
}

export const VOLBYZASTUPITELSKEORGANYCRPREZIDENTVLADA: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-kolem-nas-demokracie-a-stat-volby-zastupitelske-organy-cr-prezident-vlada",
    rvpNodeId: "g5-vlastiveda-lide-kolem-nas-demokracie-a-stat-volby-zastupitelske-organy-cr-prezident-vlada",
    title: "Volby, zastupitelské orgány ČR, prezident, vláda",
    studentTitle: "Volby a parlament",
    subject: "vlastivěda",
    category: "Lidé kolem nás",
    topic: "Demokracie a stát",
    briefDescription: "Pochopíš, jak funguje demokracie a kdo řídí Česko.",
    keywords: ["volby", "parlament", "sněmovna", "senát", "prezident", "vláda", "demokracie", "dělba moci"],
    goals: [
      "Žák popíše strukturu parlamentu ČR (Sněmovna, Senát)",
      "Žák vysvětlí roli prezidenta a vlády",
      "Žák chápe princip tajného hlasování a dělby moci",
    ],
    boundaries: ["Detailní volební systémy (d'Hondtova metoda)", "Mezinárodní srovnání systémů"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Sněmovna má 200 poslanců (4 roky), Senát má 81 senátorů (6 let), prezident volen na 5 let.",
      steps: [
        "Parlament = Sněmovna (200, 4 r.) + Senát (81, 6 let)",
        "Prezident = hlava státu, přímá volba, 5 let",
        "Vláda = výkonná moc, odpovědná Sněmovně",
        "Tajné hlasování = ochrana svobody",
        "Dělba moci = zákonodárná + výkonná + soudní",
      ],
      commonMistake: "Zaměňování počtu poslanců (200) a senátorů (81).",
      example: "Vláda potřebuje důvěru Sněmovny — jinak musí odstoupit.",
    },
  },
];
