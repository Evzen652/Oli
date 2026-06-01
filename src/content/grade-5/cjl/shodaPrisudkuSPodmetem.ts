import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface FillItem {
  sentence: string;
  blank: string;
  options: string[];
  hint: string;
}

// Level 1: jasny rod podmětu
const POOL_L1: FillItem[] = [
  { sentence: "Žáci ___ fotbal.", blank: "hráli", options: ["hráli", "hrály", "hrála", "hrálo"], hint: "Žáci = mužský životný → -i." },
  { sentence: "Dívky ___ píseň.", blank: "zpívaly", options: ["zpívaly", "zpívali", "zpívala", "zpívalo"], hint: "Dívky = ženský rod → -y." },
  { sentence: "Chlapci ___ do vody.", blank: "skočili", options: ["skočili", "skočily", "skočila", "skočilo"], hint: "Chlapci = mužský životný → -i." },
  { sentence: "Holky ___ domů.", blank: "běžely", options: ["běžely", "běželi", "běžela", "běželo"], hint: "Holky = ženský rod → -y." },
  { sentence: "Ptáci ___ na jih.", blank: "odletěli", options: ["odletěli", "odletěly", "odletěla", "odletělo"], hint: "Ptáci = mužský životný → -i." },
  { sentence: "Kočky ___ celé odpoledne.", blank: "spaly", options: ["spaly", "spali", "spala", "spalo"], hint: "Kočky = ženský rod → -y." },
  { sentence: "Stromy ___ ve větru.", blank: "padaly", options: ["padaly", "padali", "padala", "padalo"], hint: "Stromy = mužský neživotný → -y." },
  { sentence: "Kameny ___ na cestě.", blank: "ležely", options: ["ležely", "leželi", "ležela", "leželo"], hint: "Kameny = mužský neživotný → -y." },
  { sentence: "Kamarádky ___ včas.", blank: "přišly", options: ["přišly", "přišli", "přišla", "přišlo"], hint: "Kamarádky = ženský rod → -y." },
  { sentence: "Bratři ___ na výlet.", blank: "šli", options: ["šli", "šly", "šla", "šlo"], hint: "Bratři = mužský životný → šli." },
  { sentence: "Sestry ___ na výlet.", blank: "šly", options: ["šly", "šli", "šla", "šlo"], hint: "Sestry = ženský rod → šly." },
  { sentence: "Vlci ___ z lesa.", blank: "vyběhli", options: ["vyběhli", "vyběhly", "vyběhla", "vyběhlo"], hint: "Vlci = mužský životný → -i." },
  { sentence: "Ryby ___ pomalu.", blank: "plávaly", options: ["plávaly", "plávali", "plávala", "plávalo"], hint: "Ryby = ženský rod → -y." },
  { sentence: "Koně ___ po poli.", blank: "běželi", options: ["běželi", "běžely", "běžela", "běželo"], hint: "Koně = mužský životný → -i." },
  { sentence: "Ovce ___ na louce.", blank: "pásly se", options: ["pásly se", "pásli se", "pásla se", "páslо se"], hint: "Ovce = ženský rod → -y." },
  { sentence: "Psi ___ celou noc.", blank: "štěkali", options: ["štěkali", "štěkaly", "štěkala", "štěkalo"], hint: "Psi = mužský životný → -i." },
  { sentence: "Holubi ___ nad střechami.", blank: "létali", options: ["létali", "létaly", "létala", "létalo"], hint: "Holubi = mužský životný → -i." },
  { sentence: "Žákyně ___ loutkové divadlo.", blank: "hrály", options: ["hrály", "hráli", "hrála", "hrálo"], hint: "Žákyně = ženský rod → -y." },
  { sentence: "Hoši ___ od radosti.", blank: "křičeli", options: ["křičeli", "křičely", "křičela", "křičelo"], hint: "Hoši = mužský životný → -i." },
  { sentence: "Mravenci ___ po zemi.", blank: "lezli", options: ["lezli", "lezly", "lezla", "lezlo"], hint: "Mravenci = mužský životný → -i." },
  { sentence: "Hory ___ na obzoru.", blank: "čněly", options: ["čněly", "čněli", "čněla", "čnělo"], hint: "Hory = ženský rod → -y." },
  { sentence: "Vosy ___ kolem nás.", blank: "létaly", options: ["létaly", "létali", "létala", "létalo"], hint: "Vosy = ženský rod → -y." },
  { sentence: "Žáci ___ test.", blank: "napsali", options: ["napsali", "napsaly", "napsala", "napsalo"], hint: "Žáci = mužský životný → -i." },
  { sentence: "Dívky ___ na oslavu.", blank: "přišly", options: ["přišly", "přišli", "přišla", "přišlo"], hint: "Dívky = ženský rod → -y." },
  { sentence: "Chlapci ___ domů pozdě.", blank: "přišli", options: ["přišli", "přišly", "přišla", "přišlo"], hint: "Chlapci = mužský životný → -i." },
  { sentence: "Myši ___ zásoby.", blank: "snědly", options: ["snědly", "snědli", "snědla", "snědlo"], hint: "Myši = ženský rod → -y." },
  { sentence: "Lvi ___ na slunci.", blank: "odpočívali", options: ["odpočívali", "odpočívaly", "odpočívala", "odpočívalo"], hint: "Lvi = mužský životný → -i." },
  { sentence: "Motýli ___ nad květinami.", blank: "poletovali", options: ["poletovali", "poletovaly", "poletovala", "poletovalo"], hint: "Motýli = mužský životný → -i." },
  { sentence: "Laně ___ v lese.", blank: "pobíhaly", options: ["pobíhaly", "pobíhali", "pobíhala", "pobíhalo"], hint: "Laně = ženský rod → -y." },
  { sentence: "Stromy ___ na jaře.", blank: "kvetly", options: ["kvetly", "kvetli", "kvetla", "kvetlo"], hint: "Stromy = mužský neživotný → -y." },
];

// Level 2: smiseny podmět (mužský životný + ostatní)
const POOL_L2: FillItem[] = [
  { sentence: "Bratři a sestry ___ spolu.", blank: "hráli", options: ["hráli", "hrály", "hrála", "hrálo"], hint: "Bratři = mužský životný → celá skupina -i." },
  { sentence: "Maminka a táta ___ pozdě.", blank: "přišli", options: ["přišli", "přišly", "přišla", "přišlo"], hint: "Táta = mužský životný → skupina -i." },
  { sentence: "Kočky a pes ___ ze zahrady.", blank: "utekli", options: ["utekli", "utekly", "utekla", "uteklo"], hint: "Pes = mužský životný → skupina -i." },
  { sentence: "Okna a dveře ___ otevřené.", blank: "zůstaly", options: ["zůstaly", "zůstali", "zůstala", "zůstalo"], hint: "Žádný mužský životný → -y." },
  { sentence: "Lucie a Pavel ___ do kina.", blank: "šli", options: ["šli", "šly", "šla", "šlo"], hint: "Pavel = mužský životný → šli." },
  { sentence: "Žáci a žákyně ___ test.", blank: "napsali", options: ["napsali", "napsaly", "napsala", "napsalo"], hint: "Žáci = mužský životný → -i." },
  { sentence: "Teta a strýc ___ na dovolenou.", blank: "odjeli", options: ["odjeli", "odjely", "odjela", "odjelo"], hint: "Strýc = mužský životný → -i." },
  { sentence: "Tety a babičky ___ na dovolenou.", blank: "odjely", options: ["odjely", "odjeli", "odjela", "odjelo"], hint: "Jen ženský rod → -y." },
  { sentence: "Ryby a žáby ___ v rybníku.", blank: "žily", options: ["žily", "žili", "žila", "žilo"], hint: "Žáby a ryby = ženský rod → -y." },
  { sentence: "Děti a dospělí ___ film.", blank: "sledovali", options: ["sledovali", "sledovaly", "sledovala", "sledovalo"], hint: "Dospělí = mužský životný → -i." },
  { sentence: "Housle a klarinet ___ v orchestru.", blank: "hrály", options: ["hrály", "hráli", "hrála", "hrálo"], hint: "Oba neživotné → -y." },
  { sentence: "Kluk a dívka ___ na oslavu.", blank: "přišli", options: ["přišli", "přišly", "přišla", "přišlo"], hint: "Kluk = mužský životný → -i." },
  { sentence: "Sestra a bratr ___ domů.", blank: "přišli", options: ["přišli", "přišly", "přišla", "přišlo"], hint: "Bratr = mužský životný → -i." },
  { sentence: "Holky a kluci ___ volejbal.", blank: "hráli", options: ["hráli", "hrály", "hrála", "hrálo"], hint: "Kluci = mužský životný → -i." },
  { sentence: "Kvítky a tráva ___ na louce.", blank: "rostly", options: ["rostly", "rostli", "rostla", "rostlo"], hint: "Žádný mužský životný → -y." },
  { sentence: "Otec a syn ___ auto.", blank: "opravili", options: ["opravili", "opravily", "opravila", "opravilo"], hint: "Oba mužský životný → -i." },
  { sentence: "Matky a otcové ___ na schůzi.", blank: "přišli", options: ["přišli", "přišly", "přišla", "přišlo"], hint: "Otcové = mužský životný → -i." },
  { sentence: "Tygři a lvice ___ ze zoo.", blank: "utekli", options: ["utekli", "utekly", "utekla", "uteklo"], hint: "Tygři = mužský životný → -i." },
  { sentence: "Skály a hory ___ se k nebi.", blank: "tyčily", options: ["tyčily", "tyčili", "tyčila", "tyčilo"], hint: "Oba ženský neživotný → -y." },
  { sentence: "Myši a krysy ___ zásoby.", blank: "snědly", options: ["snědly", "snědli", "snědla", "snědlo"], hint: "Oba ženský rod → -y." },
  { sentence: "Pavel a Lucie ___ spolu.", blank: "pracovali", options: ["pracovali", "pracovaly", "pracovala", "pracovalo"], hint: "Pavel = mužský životný → -i." },
  { sentence: "Babička a dědeček ___ na zahradu.", blank: "šli", options: ["šli", "šly", "šla", "šlo"], hint: "Dědeček = mužský životný → šli." },
  { sentence: "Paní a páni ___ do kina.", blank: "šli", options: ["šli", "šly", "šla", "šlo"], hint: "Páni = mužský životný → šli." },
  { sentence: "Kameny a dřeva ___ na zemi.", blank: "ležely", options: ["ležely", "leželi", "ležela", "leželo"], hint: "Oba neživotné → -y." },
  { sentence: "Žáci a paní učitelka ___ do divadla.", blank: "šli", options: ["šli", "šly", "šla", "šlo"], hint: "Žáci = mužský životný → -i." },
  { sentence: "Slepice a kohouti ___ kokrhali.", blank: "hlasitě kokrhali", options: ["hlasitě kokrhali", "hlasitě kokrhaly", "hlasitě kokrhala", "hlasitě kokrhalo"], hint: "Kohouti = mužský životný → -i." },
  { sentence: "Psi a kočky ___ na dvorku.", blank: "pobíhali", options: ["pobíhali", "pobíhaly", "pobíhala", "pobíhalo"], hint: "Psi = mužský životný → -i." },
  { sentence: "Páv a pávi ___ na dvorku.", blank: "tančili", options: ["tančili", "tančily", "tančila", "tančilo"], hint: "Pávi = mužský životný → -i." },
  { sentence: "Jana a Honza ___ do obchodu.", blank: "šli", options: ["šli", "šly", "šla", "šlo"], hint: "Honza = mužský životný → šli." },
  { sentence: "Kluci a holky ___ ve sboru.", blank: "zpívali", options: ["zpívali", "zpívaly", "zpívala", "zpívalo"], hint: "Kluci = mužský životný → -i." },
];

// Level 3: souveti a slozitejsi podměty
const POOL_L3: FillItem[] = [
  { sentence: "Generálové v průvodu ___.", blank: "pochodovali", options: ["pochodovali", "pochodovaly", "pochodovala", "pochodovalo"], hint: "Generálové = mužský životný → -i." },
  { sentence: "Učitelé a žáci o problému ___.", blank: "diskutovali", options: ["diskutovali", "diskutovaly", "diskutovala", "diskutovalo"], hint: "Učitelé i žáci = mužský životný → -i." },
  { sentence: "Princové a princezny celou noc ___.", blank: "tančili", options: ["tančili", "tančily", "tančila", "tančilo"], hint: "Princové = mužský životný → -i." },
  { sentence: "Studenti a studentky zkoušky ___.", blank: "složili", options: ["složili", "složily", "složila", "složilo"], hint: "Studenti = mužský životný → -i." },
  { sentence: "Králové a šlechtici u stolu ___.", blank: "seděli", options: ["seděli", "seděly", "seděla", "sedělo"], hint: "Králové i šlechtici = mužský životný → -i." },
  { sentence: "Ženy a muži celou noc ___.", blank: "tančili", options: ["tančili", "tančily", "tančila", "tančilo"], hint: "Muži = mužský životný → -i." },
  { sentence: "Stromy a keře na jaře ___.", blank: "rozvily se", options: ["rozvily se", "rozvili se", "rozvinulo se", "rozvil se"], hint: "Stromy a keře = neživotné → -y." },
  { sentence: "Hasiči a záchranáři na místo ___.", blank: "přijeli", options: ["přijeli", "přijely", "přijela", "přijelo"], hint: "Oba mužský životný → -i." },
  { sentence: "Kamarádi a kamarádky na oslavu ___.", blank: "přišli", options: ["přišli", "přišly", "přišla", "přišlo"], hint: "Kamarádi = mužský životný → -i." },
  { sentence: "Vojáci a důstojníci na rozkaz ___.", blank: "vypochodovali", options: ["vypochodovali", "vypochodovaly", "vypochodovala", "vypochodovalo"], hint: "Oba mužský životný → -i." },
  { sentence: "Herci a herečky na pódium ___.", blank: "vstoupili", options: ["vstoupili", "vstoupily", "vstoupila", "vstoupilo"], hint: "Herci = mužský životný → -i." },
  { sentence: "Babičky a dědové společně ___.", blank: "tančili", options: ["tančili", "tančily", "tančila", "tančilo"], hint: "Dědové = mužský životný → -i." },
  { sentence: "Prezidenti dvou států spolu ___.", blank: "jednali", options: ["jednali", "jednaly", "jednala", "jednalo"], hint: "Prezidenti = mužský životný → -i." },
  { sentence: "Ptáci a motýli nad zahradou ___.", blank: "poletovali", options: ["poletovali", "poletovaly", "poletovala", "poletovalo"], hint: "Ptáci = mužský životný → -i." },
  { sentence: "Dívky a chlapci spolu ___.", blank: "soutěžili", options: ["soutěžili", "soutěžily", "soutěžila", "soutěžilo"], hint: "Chlapci = mužský životný → -i." },
  { sentence: "Ryby a žraloci ve vodě ___.", blank: "plavali", options: ["plavali", "plávaly", "plávala", "plávalo"], hint: "Žraloci = mužský životný → -i." },
  { sentence: "Sloni a nosorožci po pláni ___.", blank: "chodili", options: ["chodili", "chodily", "chodila", "chodilo"], hint: "Oba mužský životný → -i." },
  { sentence: "Řeky a potoky do moře ___.", blank: "tekly", options: ["tekly", "tekli", "tekla", "teklo"], hint: "Oba ženský neživotný → -y." },
  { sentence: "Matky a otcové na schůzce ___.", blank: "diskutovali", options: ["diskutovali", "diskutovaly", "diskutovala", "diskutovalo"], hint: "Otcové = mužský životný → -i." },
  { sentence: "Závodníci a trenéři výsledky ___.", blank: "slavili", options: ["slavili", "slavily", "slavila", "slavilo"], hint: "Závodníci i trenéři = mužský životný → -i." },
  { sentence: "Stáda a pastevci po horách ___.", blank: "putovali", options: ["putovali", "putovaly", "putovala", "putovalo"], hint: "Pastevci = mužský životný → -i." },
  { sentence: "Kněží a mniši v kostele ___.", blank: "zpívali", options: ["zpívali", "zpívaly", "zpívala", "zpívalo"], hint: "Oba mužský životný → -i." },
  { sentence: "Básníci a malíři v kavárně ___.", blank: "besedovali", options: ["besedovali", "besedovaly", "besedovala", "besedovalo"], hint: "Oba mužský životný → -i." },
  { sentence: "Záchranáři a lékaři rychle ___.", blank: "zasáhli", options: ["zasáhli", "zasáhly", "zasáhla", "zasáhlo"], hint: "Oba mužský životný → -i." },
  { sentence: "Vlci a lišky v noci ___.", blank: "lovili", options: ["lovili", "lovily", "lovila", "lovilo"], hint: "Vlci = mužský životný → -i." },
  { sentence: "Větve a listy při bouři ___.", blank: "padaly", options: ["padaly", "padali", "padala", "padalo"], hint: "Oba neživotné → -y." },
  { sentence: "Dívky a jonáci spolu ___.", blank: "soutěžili", options: ["soutěžili", "soutěžily", "soutěžila", "soutěžilo"], hint: "Jonáci = mužský životný → -i." },
  { sentence: "Lodě a čluny v přístavu ___.", blank: "kotvily", options: ["kotvily", "kotvili", "kotvila", "kotvilo"], hint: "Oba ženský/neživotný → -y." },
  { sentence: "Sportovci a fanoušci ___.", blank: "jásali", options: ["jásali", "jásaly", "jásala", "jásalo"], hint: "Sportovci = mužský životný → -i." },
  { sentence: "Princezny a rytíři na hradě ___.", blank: "hodovali", options: ["hodovali", "hodovaly", "hodovala", "hodovalo"], hint: "Rytíři = mužský životný → -i." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30).map(({ sentence, blank, options, hint }) => ({
    question: `Doplň správný tvar slovesa: "${sentence}"`,
    correctAnswer: blank,
    options: options,
    blanks: [blank],
    hints: [
      hint,
      "Mužský životný rod (chlapci, psi, vlci) → přísudek s -i/-li/-eli.",
      "Ostatní rody (ženský, střední, mužský neživotný) → přísudek s -y/-ly/-ely.",
      "I jeden mužský živý podmět ve skupině → celá skupina dostane -i.",
    ],
  }));
}

export const SHODAPRISUDKUSPODMETEM: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-skladba-shoda-prisudku-s-podmetem",
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-shoda-prisudku-s-podmetem",
    title: "Shoda přísudku s podmětem",
    studentTitle: "Shoda přísudku s podmětem",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Procvičíš správné koncovky sloves – hrali nebo hraly.",
    keywords: ["shoda přísudku", "podmět", "rod", "hrali hraly", "koncovky sloves"],
    goals: [
      "Doplnit správnou koncovku přísudku podle rodu a čísla podmětu",
      "Rozlišit mužský životný od ostatních rodů",
      "Správně určit shodu při několikanásobném podmětu",
    ],
    boundaries: [
      "Neprobíráme složité větné vzorce",
      "Bez historické gramatiky",
    ],
    gradeRange: [5, 5],
    inputType: "fill_blank",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Najdi podmět a zjisti jeho rod. Mužský životný → -i/-li. Ostatní rody (ženský, střední, mužský neživotný) → -y/-ly.",
      steps: [
        "Najdi podmět ve větě.",
        "Zjisti rod podmětu: je mužský životný (chlapec, pes, strom)?",
        "Mužský životný → přísudek s -i (hráli, přišli).",
        "Ostatní → přísudek s -y (hrály, přišly).",
        "Při několikanásobném podmětu: stačí jeden mužský životný → -i.",
      ],
      commonMistake: "Žáci zaměňují mužský životný s mužským neživotným (stromy, kameny → hrály, ne hráli).",
      example: "Chlapci hráli (mužský životný → -i). Dívky hrály (ženský → -y). Stromy padaly (mužský neživotný → -y).",
    },
  },
];
