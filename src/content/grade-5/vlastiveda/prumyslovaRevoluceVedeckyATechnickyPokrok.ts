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
    question: "Co je průmyslová revoluce?",
    correctAnswer: "Přechod od ruční výroby k výrobě v továrnách pomocí strojů",
    options: [
      "Přechod od ruční výroby k výrobě v továrnách pomocí strojů",
      "Revoluce ve Francii roku 1789",
      "Vznik národního obrození",
      "Válka o průmyslová území",
    ],
    hints: ["Mysl na parní stroj a továrny."],
    solutionSteps: ["Průmyslová revoluce (19. stol.) = nahrazení lidské práce stroji v továrnách."],
  },
  {
    question: "Kdo vynalezl praktický parní stroj?",
    correctAnswer: "James Watt",
    options: ["James Watt", "Thomas Edison", "Alexander Graham Bell", "Karl Benz"],
    hints: ["Jeho příjmení se používá jako jednotka výkonu."],
    solutionSteps: ["James Watt zdokonalil parní stroj v 70. letech 18. stol. — základ průmyslové revoluce."],
  },
  {
    question: "Kdy Alexander Graham Bell vynalezl telefon?",
    correctAnswer: "1876",
    options: ["1876", "1879", "1885", "1903"],
    hints: ["Šlo o rok po polovině 19. století."],
    solutionSteps: ["Bell patentoval telefon roku 1876."],
  },
  {
    question: "Kdy Thomas Edison vynalezl žárovku?",
    correctAnswer: "1879",
    options: ["1879", "1876", "1885", "1903"],
    hints: ["O tři roky po telefonu."],
    solutionSteps: ["Edison vyrobil praktickou žárovku roku 1879."],
  },
  {
    question: "Kdy Karl Benz sestrojil první automobil?",
    correctAnswer: "1885",
    options: ["1885", "1876", "1879", "1903"],
    hints: ["Automobilka Benz je předchůdce Mercedes-Benz."],
    solutionSteps: ["Karl Benz vyrobil první automobil s benzínovým motorem roku 1885."],
  },
  {
    question: "Kdy bratři Wrightové uskutečnili první let letadlem?",
    correctAnswer: "1903",
    options: ["1903", "1885", "1876", "1910"],
    hints: ["Stalo se to na přelomu 19. a 20. století."],
    solutionSteps: ["Orville a Wilbur Wrightovi provedli první motorový let 17. prosince 1903 v Kitty Hawk."],
  },
  {
    question: "Jaký průmysl se rozvíjel v Liberci během průmyslové revoluce?",
    correctAnswer: "Textilní průmysl",
    options: ["Textilní průmysl", "Potravinářství", "Těžba zlata", "Sklářství"],
    hints: ["Výroba látek, přízí, tkanin."],
    solutionSteps: ["Liberec byl centrem textilní výroby — přezdívalo se mu 'Manchestru Čech'."],
  },
  {
    question: "Kdo byli dělníci v průmyslové revoluci?",
    correctAnswer: "Lidé pracující v továrnách za mzdu",
    options: [
      "Lidé pracující v továrnách za mzdu",
      "Šlechtici vlastnící stroje",
      "Rolníci na polích",
      "Kněží v klášterech",
    ],
    hints: ["Vytvořili novou společenskou třídu."],
    solutionSteps: ["Průmyslová revoluce vytvořila dělnickou třídu — pracující v továrních podmínkách."],
  },
  {
    question: "Co přinesly železnice průmyslové revoluci?",
    correctAnswer: "Rychlou přepravu lidí a zboží na velké vzdálenosti",
    options: [
      "Rychlou přepravu lidí a zboží na velké vzdálenosti",
      "Nahradily parní stroje",
      "Zničily obchod",
      "Sloužily jen vojsku",
    ],
    hints: ["Lokomotiva = parní stroj na kolejích."],
    solutionSteps: ["Železnice umožnily rychlou a levnou přepravu surovin i výrobků → ekonomický rozmach."],
  },
  {
    question: "Ve které zemi průmyslová revoluce začala?",
    correctAnswer: "Velká Británie – Anglie",
    options: ["Velká Británie (Anglie)", "Francie", "Německo", "Česko"],
    hints: ["Ostrov na severozápadě Evropy."],
    solutionSteps: ["Průmyslová revoluce začala v Anglii v 2. pol. 18. stol., poté se šířila do Evropy."],
  },
  {
    question: "Jak se nazývá výroba ve velkých budovách se stroji a dělníky?",
    correctAnswer: "Tovární výroba",
    options: ["Tovární výroba", "Domácká výroba", "Manufakturní výroba", "Cechovní výroba"],
    hints: ["Taková budova se nazývá továrna."],
    solutionSteps: ["Továrna = velká budova s parními stroji, kde pracují dělníci za mzdu."],
  },
  {
    question: "Jak průmyslová revoluce změnila česká města?",
    correctAnswer: "Lidé se stěhovali z venkova do měst za prací v továrnách",
    options: [
      "Lidé se stěhovali z venkova do měst za prací v továrnách",
      "Města se vyprázdnila",
      "Továrny se stavěly jen na venkově",
      "Nic se nezměnilo",
    ],
    hints: ["Továrny lákaly pracovní sílu."],
    solutionSteps: ["Industrializace vedla k urbanizaci — masovému stěhování do měst."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak spolu parní stroj a průmyslová revoluce souvisejí?",
    correctAnswer: "Parní stroj poháněl tovární stroje a lokomotivy — byl motorem průmyslové revoluce",
    options: [
      "Parní stroj poháněl tovární stroje a lokomotivy — byl motorem průmyslové revoluce",
      "Parní stroj průmyslovou revoluci zastavil",
      "Parní stroj sloužil jen na lodích",
      "Průmyslová revoluce parní stroj nevyužívala",
    ],
    hints: ["Pára = levná energie pro pohon strojů."],
    solutionSteps: ["Wattův parní stroj (1769) poskytl levnou a spolehlivou energii, která pohání továrny i vlaky."],
  },
  {
    question: "Proč průmyslová revoluce zhoršila životní podmínky dělníků?",
    correctAnswer: "Pracovní doba byla 12–16 hodin, dělníci žili v přeplněných slumech bez hygieny",
    options: [
      "Pracovní doba byla 12–16 hodin, dělníci žili v přeplněných slumech bez hygieny",
      "Dělníci dostávali vysoké mzdy a krátkou pracovní dobu",
      "Továrny byly zdravé a moderní",
      "Dělníci žili lépe než šlechtici",
    ],
    hints: ["Uvažuj o podmínkách první továrny v 19. stol."],
    solutionSteps: ["Rané továrny byly nebezpečné, mzdy nízké, pracovní doba enormní → chudoba dělníků."],
  },
  {
    question: "Jak železnice urychlila průmyslový rozvoj?",
    correctAnswer: "Umožnila levnou přepravu surovin a výrobků, propojila průmyslová centra",
    options: [
      "Umožnila levnou přepravu surovin a výrobků, propojila průmyslová centra",
      "Zpomalila průmysl tím, že zrušila koňskou dopravu",
      "Sloužila pouze pro přepravu osob",
      "Železnice s průmyslem nesouvisela",
    ],
    hints: ["Bez surovin nemůže továrna vyrábět."],
    solutionSteps: ["Levná přeprava surovin (uhlí, železo) a hotových výrobků urychlovalo průmyslový rozvoj."],
  },
  {
    question: "Proč se průmyslová revoluce v Čechách rozvinula zejména v textilním odvětví?",
    correctAnswer: "Čechy měly tradici textilní výroby a dostupnou pracovní sílu z venkova",
    options: [
      "Čechy měly tradici textilní výroby a dostupnou pracovní sílu z venkova",
      "Textil byl nejdražší průmysl",
      "Habsburkové textilnímu průmyslu zakazoval rozvoj",
      "V Čechách se nevyrábět jiné výrobky",
    ],
    hints: ["Liberec = centrum textilu, přezdívka 'Manchester Čech'."],
    solutionSteps: ["Tradice tkaní + vykořenění zemědělců po zrušení nevolnictví = ideální podmínky pro textilky."],
  },
  {
    question: "Jak vynález automobilu (1885) změnil společnost?",
    correctAnswer: "Umožnil osobní přepravu na delší vzdálenosti, vedl k rozvoji silnic a měst",
    options: [
      "Umožnil osobní přepravu na delší vzdálenosti, vedl k rozvoji silnic a měst",
      "Nahradil lokomotivy",
      "Sloužil jen armádě",
      "Neměl žádný vliv do 20. století",
    ],
    hints: ["Dnes mají auta zásadní vliv na urbanismus."],
    solutionSteps: ["Automobil umožnil individuální mobilitu a vedl k rozvoji silniční infrastruktury."],
  },
  {
    question: "Co mají společného Bell, Edison, Benz a Wrightovi?",
    correctAnswer: "Všichni jsou vynálezci z 19.–20. stol., kteří změnili každodenní život",
    options: [
      "Všichni jsou vynálezci z 19.–20. stol., kteří změnili každodenní život",
      "Všichni byli Češi",
      "Všechny vynálezy se týkaly dopravy",
      "Všichni pracovali pro stejnou firmu",
    ],
    hints: ["Hledej společný rys všech čtyř."],
    solutionSteps: ["Telefon, žárovka, auto, letadlo — různé oblasti, ale stejný dopad: změna civilizace."],
  },
  {
    question: "Proč průmyslová revoluce vedla ke vzniku nové společenské třídy — dělnictva?",
    correctAnswer: "Továrny potřebovaly tisíce pracovníků, kteří se stěhovali z venkova",
    options: [
      "Továrny potřebovaly tisíce pracovníků, kteří se stěhovali z venkova",
      "Dělníci existovali odjakživa",
      "Šlechta se stala dělníky",
      "Dělnická třída zanikla průmyslem",
    ],
    hints: ["Kdo pracoval v továrnách?"],
    solutionSteps: ["Masivní poptávka po levné práci v továrnách přitáhla venkované do měst → nová dělnická třída."],
  },
  {
    question: "Jak Edison ovlivnil každodenní život svým vynálezem žárovky?",
    correctAnswer: "Elektrické světlo prodloužilo pracovní i volný čas do noci",
    options: [
      "Elektrické světlo prodloužilo pracovní i volný čas do noci",
      "Žárovka nahradila parní stroj",
      "Jen osvětlovala ulice",
      "Žárovka neměla vliv na každodenní život",
    ],
    hints: ["Bez světla se muselo spát se soumrakem."],
    solutionSteps: ["Elektrické světlo umožnilo práci, čtení i zábavu v noci — zásadní změna rytmu života."],
  },
  {
    question: "Proč strojírenství a chemický průmysl rostly v Čechách v 19. stol.?",
    correctAnswer: "Čechy měly uhlí, rudy a vzdělané dělníky i inženýry",
    options: [
      "Čechy měly uhlí, rudy a vzdělané dělníky i inženýry",
      "Habsburkové dotovali průmysl v Čechách",
      "Čechy neměly průmysl, jen textil",
      "Strojírenství se rozvíjelo jen ve Vídni",
    ],
    hints: ["Přírodní zdroje + lidský kapitál = průmysl."],
    solutionSteps: ["Ostrava, Kladno — uhlí a železo; Praha, Plzeň — strojírny. Vzdělaná pracovní síla díky Tereziánským školám."],
  },
  {
    question: "Jak průmyslová revoluce ovlivnila zemědělství?",
    correctAnswer: "Stroje nahradily ruční práci na polích, méně lidí muselo pracovat v zemědělství",
    options: [
      "Stroje nahradily ruční práci na polích, méně lidí muselo pracovat v zemědělství",
      "Zemědělství zcela zaniklo",
      "Průmysl a zemědělství spolu nesouvisely",
      "V zemědělství žádné stroje nebyly",
    ],
    hints: ["Zemědělské stroje = parní mlátičky, secí stroje."],
    solutionSteps: ["Průmyslová revoluce zasáhla i zemědělství — stroje zvýšily produktivitu a uvolnily lidi do továren."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď vynálezy chronologicky od nejdřívějšího.",
    correctAnswer: "Parní stroj → Telefon → Žárovka → Automobil → Letadlo",
    items: [
      "Parní stroj (Watt, ~1769)",
      "Telefon (Bell, 1876)",
      "Žárovka (Edison, 1879)",
      "Automobil (Benz, 1885)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Parní stroj je ze 18. stol."],
    solutionSteps: ["1769 pára → 1876 telefon → 1879 žárovka → 1885 auto → 1903 letadlo."],
  },
  {
    question: "Spoj vynálezce s jeho vynálezem.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "James Watt", right: "Parní stroj" },
      { left: "Alexander Graham Bell", right: "Telefon (1876)" },
      { left: "Thomas Edison", right: "Žárovka (1879)" },
      { left: "Karl Benz", right: "Automobil (1885)" },
      { left: "Wright bratři", right: "Letadlo (1903)" },
    ],
    hints: ["Bell → zvuk → telefon."],
    solutionSteps: ["Každý vynálezce má jedno klíčové dílo."],
  },
  {
    question: "Který výrok o průmyslové revoluci je NEPRAVDIVÝ?",
    correctAnswer: "Průmyslová revoluce okamžitě zlepšila životní úroveň všech dělníků",
    options: [
      "Průmyslová revoluce okamžitě zlepšila životní úroveň všech dělníků",
      "Parní stroj byl klíčovým vynálezem průmyslové revoluce",
      "Průmyslová revoluce začala ve Velké Británii",
      "Železnice umožnila rychlou přepravu zboží",
    ],
    hints: ["Mysl na slumové čtvrti v průmyslových městech."],
    solutionSteps: ["Průmyslová revoluce zpočátku zhoršila podmínky dělníků — přeplněná města, nízké mzdy."],
  },
  {
    question: "Jak průmyslová revoluce změnila společnost ve třech oblastech?",
    correctAnswer: "Ekonomika – továrny, společnost – dělnická třída, životní styl – stěhování do měst",
    options: [
      "Ekonomika (továrny), společnost (dělnická třída), životní styl (stěhování do měst)",
      "Jen ekonomika se změnila",
      "Jen životní styl se zlepšil",
      "Přinesla jen nové náboženství",
    ],
    hints: ["Uvažuj o hospodářství, vrstvách společnosti a způsobu bydlení."],
    solutionSteps: ["Průmyslová revoluce = trojí přeměna: ekonomická, sociální a urbanistická."],
  },
  {
    question: "Proč se Čechy staly průmyslově vyspělou oblastí habsburské monarchie?",
    correctAnswer: "Přírodní zdroje – uhlí, vzdělané obyvatelstvo a napojení na obchodní cesty",
    options: [
      "Přírodní zdroje (uhlí), vzdělané obyvatelstvo a napojení na obchodní cesty",
      "Habsburkové vědomě investovali jen do Čech",
      "Čechy měly největší armádu",
      "Šlo o náhodu bez příčin",
    ],
    hints: ["Co bylo v Čechách pod zemí? Co pod Terezií ve školách?"],
    solutionSteps: ["Uhlí (Ostrava, Kladno), Tereziánské reformy školství a poloha v srdci Evropy → průmysl."],
  },
  {
    question: "Kde bys v 19. stol. nejspíše žil jako nový průmyslový dělník a proč?",
    correctAnswer: "V průmyslovém městě – Liberec, Kladno, Praha — továrny byly ve městech",
    options: [
      "V průmyslovém městě (Liberec, Kladno, Praha) — továrny byly ve městech",
      "Na venkově — továrny byly jen na vsích",
      "Ve Vídni — tam byl veškerý průmysl",
      "V Berlíně — Habsburkové průmysl nedovolovali",
    ],
    hints: ["Továrny vznikaly tam, kde byl přístup k uhlí a pracovní síle."],
    solutionSteps: ["Průmyslová centra v Čechách: Praha (strojírny), Liberec (textil), Kladno (hutě), Ostrava (uhlí)."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const PRUMYSLOVAREVOLUCEVEDECKYATECHNICKYPOKROK: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-prumyslova-revoluce-vedecky-a-technicky-pokrok",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-prumyslova-revoluce-vedecky-a-technicky-pokrok",
    title: "Průmyslová revoluce, vědecký a technický pokrok",
    studentTitle: "Průmyslová revoluce",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Národní obrození a 19. století",
    briefDescription: "Poznáš vynálezce a stroje, které změnily svět.",
    keywords: ["průmyslová revoluce", "parní stroj", "watt", "edison", "bell", "benz", "továrna", "železnice"],
    goals: [
      "Žák popíše podstatu průmyslové revoluce",
      "Žák uvede klíčové vynálezy a jejich vynálezce",
      "Žák vysvětlí dopad průmyslové revoluce na společnost",
    ],
    boundaries: ["Detailní technický popis strojů", "Ekonomická teorie"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Pamatuj na čtyři vynálezce a roky: Bell 1876, Edison 1879, Benz 1885, Wright 1903.",
      steps: [
        "Průmyslová revoluce: přechod od ruční výroby k tovární",
        "Klíčový vynález: parní stroj (Watt)",
        "Bell 1876: telefon",
        "Edison 1879: žárovka",
        "Benz 1885: automobil",
        "Wright 1903: letadlo",
      ],
      commonMistake: "Zaměňování roku vynálezu telefonu (1876) a žárovky (1879).",
      example: "Edison vynalezl žárovku roku 1879 — od té doby svítíme v noci.",
    },
  },
];
