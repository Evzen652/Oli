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
    correctAnswer: "5 let",
    options: ["4 roky", "5 let", "6 let", "7 let"],
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
      "Vydávat nové zákony místo parlamentu",
      "Řídit stát — vykonávat zákony a spravovat jednotlivá ministerstva",
      "Rozhodovat sama o vyhlášení války nebo míru",
      "Volit prezidenta místo občanů v přímé volbě",
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
      "Nejvyšší soud, který rozhoduje jen o nejtěžších trestných činech",
      "Soud, který dohlíží na dodržování Ústavy a chrání základní práva",
      "Správní soud, který řeší jen spory o daních a poplatcích",
      "Soud, který řeší jen stížnosti na výsledky voleb",
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
      "Jsou to v podstatě totéž — oba společně přímo řídí celou vládu",
      "Prezident = hlava státu (ceremoniální + jmenovací role); premiér = šéf vlády – výkonná moc",
      "Premiér je nadřazen prezidentovi a jmenuje ho do funkce",
      "Prezident osobně řídí jednotlivá ministerstva místo premiéra",
    ],
    hints: ["V ČR je prezident spíš symbolická funkce."],
    solutionSteps: ["Prezident = hlava státu, reprezentuje ČR; premiér + vláda = každodenní řízení státu."],
  },
  {
    question: "Proč je tajné hlasování důležité pro demokracii?",
    correctAnswer: "Chrání voliče před tlakem nebo odvetou za svobodné hlasování",
    options: [
      "Je to jen dlouholetá tradice, která nemá žádný praktický účel",
      "Chrání voliče před tlakem nebo odvetou za svobodné hlasování",
      "Usnadňuje a urychluje sčítání odevzdaných hlasů",
      "Je to jedna z povinných podmínek pro vstup do EU",
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
      "Veškerá moc ve státě patří jen prezidentovi jako hlavě státu",
      "Moc je rozdělena mezi zákonodárnou (parlament), výkonnou (vláda) a soudní – soudy",
      "Vláda rozhoduje úplně o všem bez kontroly parlamentu i soudů",
      "Soud může sám vydávat nové zákony místo parlamentu",
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
      "O vítězi nakonec rozhoduje Ústavní soud podle stížností",
      "Hlasy se tajně sečtou — vítěz je strana nebo kandidát s nejvyšším počtem",
      "Prezident sám jmenuje vítěze podle vlastního uvážení",
      "Vítěz je určen losováním mezi všemi kandidáty",
    ],
    hints: ["Demokratické volby = spravedlivé sčítání."],
    solutionSteps: ["Po uzavření volebních místností se hlasy sčítají — transparentně a kontrolovaně."],
  },
];

// L3 — náročnější „proč" otázky (select_one). Varianty drag_order/match_pairs
// byly odstraněny, protože téma je select_one (emitovaly by nekompatibilní úlohy).
const POOL_L3: PracticeTask[] = [
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
    question: "Proč komunistický režim nebyl demokracií?",
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
    correctAnswer: "Všechny jsou důležité — volba stran i prezidenta ovlivňuje stát různými způsoby",
    options: [
      "Všechny jsou důležité — volba stran i prezidenta ovlivňuje stát různými způsoby",
      "Jen prezidentská volba má smysl",
      "Jen volby do Sněmovny jsou důležité",
      "Volby jsou zbytečné — politici dělají, co chtějí",
    ],
    hints: ["Parlament schvaluje zákony, prezident reprezentuje."],
    solutionSteps: ["Všechny typy voleb jsou důležité — parlamentní, senátní, prezidentské i komunální."],
  },
];

function gen(level: number): PracticeTask[] {
  // L3 = náročnější podmnožina (L2) + nejtěžší „proč" otázky (L3).
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : [...POOL_L2, ...POOL_L3];
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
    contentType: "factual",
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
