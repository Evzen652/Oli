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
    question: "Kolik světadílů má Země?",
    correctAnswer: "7",
    options: ["7", "5", "6", "8"],
    hints: ["Vzpomeň na všechny: Evropa, Asie, Afrika, SAmr, JAmr, Austrálie, Antarktida."],
    solutionSteps: ["Sedm světadílů: Evropa, Asie, Afrika, Severní Amerika, Jižní Amerika, Australie, Antarktida."],
  },
  {
    question: "Kolik oceánů má Země?",
    correctAnswer: "5",
    options: ["5", "4", "3", "7"],
    hints: ["Tichý, Atlantský, Indický, Severní Ledový, Jižní."],
    solutionSteps: ["Pět oceánů: Tichý, Atlantský, Indický, Severní Ledový, Jižní (Antarktický)."],
  },
  {
    question: "Který oceán je největší?",
    correctAnswer: "Tichý oceán",
    options: ["Tichý oceán", "Atlantský oceán", "Indický oceán", "Severní Ledový oceán"],
    hints: ["Leží mezi Asií, Amerikou a Austrálií."],
    solutionSteps: ["Tichý oceán je největší oceán světa — pokrývá přibližně třetinu zemského povrchu."],
  },
  {
    question: "Který světadíl je největší?",
    correctAnswer: "Asie",
    options: ["Asie", "Afrika", "Severní Amerika", "Evropa"],
    hints: ["Je větší než celá Afrika."],
    solutionSteps: ["Asie je největší světadíl (44 milionů km²) — přibližně třetina pevniny Země."],
  },
  {
    question: "Který světadíl je nejmenší?",
    correctAnswer: "Australie",
    options: ["Australie", "Evropa", "Antarktida", "Jižní Amerika"],
    hints: ["Je to zároveň ostrov."],
    solutionSteps: ["Australie je nejmenší světadíl a zároveň největší ostrov."],
  },
  {
    question: "Na kterém světadíle leží Česká republika?",
    correctAnswer: "Evropa",
    options: ["Evropa", "Asie", "Afrika", "Severní Amerika"],
    hints: ["Je to světadíl uprostřed."],
    solutionSteps: ["ČR leží ve střední Evropě."],
  },
  {
    question: "Který světadíl leží celý na jižní polokouli a pokrývá ho led?",
    correctAnswer: "Antarktida",
    options: ["Antarktida", "Australie", "Jižní Amerika", "Afrika"],
    hints: ["Je to nejjižnější a nejchladnější kontinent."],
    solutionSteps: ["Antarktida leží kolem jižního pólu — pokrývá ji ledovce a nikdo tam trvale nežije."],
  },
  {
    question: "Který oceán leží mezi Evropou a Amerikou?",
    correctAnswer: "Atlantský oceán",
    options: ["Atlantský oceán", "Tichý oceán", "Indický oceán", "Severní Ledový oceán"],
    hints: ["Přes tento oceán plula Columbus roku 1492."],
    solutionSteps: ["Atlantský oceán leží mezi Evropou, Afrikou na východě a Amerikami na západě."],
  },
  {
    question: "Který světadíl je nejlidnatější?",
    correctAnswer: "Asie",
    options: ["Asie", "Afrika", "Evropa", "Severní Amerika"],
    hints: ["Čína a Indie jsou největší státy světa podle počtu obyvatel."],
    solutionSteps: ["Asie má přes 4,7 miliardy obyvatel — více než polovina lidstva."],
  },
  {
    question: "Jak se nazývá oceán u jižního pólu?",
    correctAnswer: "Jižní (Antarktický) oceán",
    options: ["Jižní (Antarktický) oceán", "Tichý oceán", "Indický oceán", "Atlantský oceán"],
    hints: ["Obklopuje Antarktidu."],
    solutionSteps: ["Jižní (Antarktický) oceán obklopuje Antarktidu — nejjižnější ze pěti oceánů."],
  },
  {
    question: "Jak se nazývá oceán u severního pólu?",
    correctAnswer: "Severní Ledový oceán",
    options: ["Severní Ledový oceán", "Atlantský oceán", "Tichý oceán", "Arktický oceán"],
    hints: ["Je to nejmenší oceán, ze severu obklopuje Arktidu."],
    solutionSteps: ["Severní Ledový oceán je nejmenší ze pěti oceánů a leží kolem severního pólu."],
  },
  {
    question: "Na kterém světadíle leží Egypt a Sahara?",
    correctAnswer: "Afrika",
    options: ["Afrika", "Asie", "Jižní Amerika", "Evropa"],
    hints: ["Sahara je největší poušť světa."],
    solutionSteps: ["Egypt a Sahara leží v Africe — druhém největším světadílu."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč je Asie zároveň největší i nejlidnatější světadíl?",
    correctAnswer: "Velká rozloha umožňuje více zemědělské půdy a velkých říčních civilizací",
    options: [
      "Velká rozloha umožňuje více zemědělské půdy a velkých říčních civilizací",
      "Asie má nejlepší klima",
      "Největší plocha = automaticky nejvíce lidí",
      "Asie má nejméně hor",
    ],
    hints: ["Čína a Indie — miliardové populace v úrodných nížinách."],
    solutionSteps: ["Velká úrodná území (Čína, Indie, Jihovýchodní Asie) umožnily rozvoj hustě osídlených civilizací."],
  },
  {
    question: "Proč Antarktida nemá stálé obyvatelstvo?",
    correctAnswer: "Extrémní chlad (−60 °C), ledový povrch bez půdy a izolovanost od ostatního světa",
    options: [
      "Extrémní chlad (−60 °C), ledový povrch bez půdy a izolovanost",
      "Je to mezinárodní park — lidé jsou tam zakázáni",
      "Antarktida je pod vodou",
      "Antarktida nemá vzduch",
    ],
    hints: ["Žijí tam jen vědci ve stanicích."],
    solutionSteps: ["Průměrná teplota −60 °C, žádná orná půda, izolovanost — nezahrnitelné pro stálé osídlení."],
  },
  {
    question: "Jak Tichý oceán ovlivňuje klima Asie a Ameriky?",
    correctAnswer: "Reguluje teplotu a přináší srážky (monsuny na Asii, Tichý proud na Ameriku)",
    options: [
      "Reguluje teplotu a přináší srážky — monsuny pro Asii",
      "Tichý oceán klima neovlivňuje",
      "Přináší jen sucho",
      "Způsobuje zemětřesení, ale ne klimatické jevy",
    ],
    hints: ["Oceány jsou obrovské zásobníky tepla a vlhkosti."],
    solutionSteps: ["Tichý oceán: monsunové deště pro Asii, El Niño ovlivňuje klima Ameriky, Pacifické proudy."],
  },
  {
    question: "Proč jsou Amerika a Asie na opačných stranách Tichého oceánu?",
    correctAnswer: "Tektonické desky — Země se vyvíjela a kontinenty se pohybovaly od sebe",
    options: [
      "Tektonické desky — Země se vyvíjela a kontinenty se pohybovaly od sebe",
      "Amerika se odtrhla od Evropy, ne Asie",
      "Tichý oceán vždy existoval na místě, kde byl suchý",
      "Amerika a Asie nebyly nikdy spojeny",
    ],
    hints: ["Teorie kontinentální drift."],
    solutionSteps: ["Pangea (pracontinent) se postupně rozpadla → dnešní rozmístění kontinentů je výsledkem tektoniky."],
  },
  {
    question: "Co mají společného Jižní Amerika a Afrika?",
    correctAnswer: "Pasují k sobě jako puzzle — kdysi byly spojeny (Pangea), podobná fauna a flora",
    options: [
      "Pasují k sobě jako puzzle — kdysi byly spojeny (Pangea), podobná fauna a flora",
      "Oba leží na severu",
      "Oba mají arctické klima",
      "Oba jsou nejmenší světadíly",
    ],
    hints: ["Mapa: pobřeží JAmr a Afriky vypadá jako puzzle."],
    solutionSteps: ["Jižní Amerika a Afrika se kdysi dotýkaly (Gondwana) — odpadly po rozpadu Pangey."],
  },
  {
    question: "Proč se Australie nazývá 'ostrovní světadíl'?",
    correctAnswer: "Je zároveň největší ostrov a nejmenší světadíl — ze všech stran obklopena vodou",
    options: [
      "Je zároveň největší ostrov a nejmenší světadíl — ze všech stran obklopena vodou",
      "Australie je jen ostrov, ne světadíl",
      "Australie leží na Antarktidě",
      "Australie se nazývá tak proto, že tam žijí klokani",
    ],
    hints: ["Australský pevninský blok = ostrov + světadíl."],
    solutionSteps: ["Australie je ze všech stran obklopena oceánem → splňuje definici ostrova i světadílu."],
  },
  {
    question: "Proč Severní a Jižní Amerika jsou dva různé světadíly a ne jeden?",
    correctAnswer: "Historicky, kulturně a geograficky jsou odlišné — Panamská šíje je úzká spojnice",
    options: [
      "Historicky, kulturně a geograficky jsou odlišné — Panamská šíje je úzká spojnice",
      "Jsou odděleny oceánem — žádné spojení neexistuje",
      "Jsou totéž — jen jiný název",
      "EU rozhodla, že jsou to dva světadíly",
    ],
    hints: ["Panamský průplav byl vykopán, aby lodě neplovaly kolem světadílu."],
    solutionSteps: ["SAmr a JAmr spojuje úzká Panamská šíje — historicky i kulturně jsou to odlišné celky."],
  },
  {
    question: "Jak se liší Severní Ledový oceán od ostatních oceánů?",
    correctAnswer: "Je nejmenší a pokrytý ledem — přístup je možný jen v létě",
    options: [
      "Je nejmenší a pokrytý ledem — přístup je možný jen v létě",
      "Je největší ze všech oceánů",
      "Nemá žádný led — je nejteplejší",
      "Leží u rovníku",
    ],
    hints: ["Arktický led se v létě zmenšuje."],
    solutionSteps: ["Severní Ledový oceán = nejmenší, pokrytý ledem celý rok nebo část roku (závisí na klimatu)."],
  },
  {
    question: "Proč Afrika je druhý největší světadíl, ale ne nejlidnatější?",
    correctAnswer: "Velká část Afriky je poušť (Sahara) nebo džungle — málo úrodné půdy",
    options: [
      "Velká část Afriky je poušť (Sahara) nebo džungle — méně úrodné půdy",
      "Afrika má méně lidí, protože je malá",
      "Afrika je nejprázdnější světadíl",
      "Afrika má jen 100 milionů obyvatel",
    ],
    hints: ["Sahara = třetina Afriky je poušť."],
    solutionSteps: ["Sahara (třetina Afriky) + tropické pralesy = omezená plocha pro hustá osídlení."],
  },
  {
    question: "Co by se stalo, kdyby všechny ledovce Antarktidy roztály?",
    correctAnswer: "Světové oceány by stouply o cca 60 metrů — velká část pevnin by se zaplavila",
    options: [
      "Světové oceány by stouply o cca 60 metrů — velká část pevnin by se zaplavila",
      "Nic by se nestalo",
      "Stouplo by o 1 metr",
      "Pouze Antarktida by se zaplavila",
    ],
    hints: ["Antarktida drží 70 % sladké vody světa v ledu."],
    solutionSteps: ["Antarktický ledový příkrov obsahuje 26 milionů km³ ledu → tání = stoupnutí oceánů o ~60 m."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď světadíly od největšího po nejmenší.",
    correctAnswer: "Asie → Afrika → SAmr → Severní Amerika → Antarktida → Evropa → Australie",
    items: [
      "Asie (44 mil. km²)",
      "Afrika (30 mil. km²)",
      "Severní Amerika (24 mil. km²)",
      "Jižní Amerika (18 mil. km²)",
      "Antarktida (14 mil. km²)",
      "Evropa (10 mil. km²)",
      "Australie (8 mil. km²)",
    ],
    hints: ["Asie je největší, Australie nejmenší."],
    solutionSteps: ["Asie > Afrika > SAmr > JAmr > Antarktida > Evropa > Australie."],
  },
  {
    question: "Spoj oceán s jeho polohou nebo charakteristikou.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "Tichý oceán", right: "Největší oceán světa" },
      { left: "Atlantský oceán", right: "Mezi Evropou/Afrikou a Amerikami" },
      { left: "Indický oceán", right: "Mezi Afrikou, Asií a Austrálií" },
      { left: "Severní Ledový oceán", right: "Nejmenší, u severního pólu" },
      { left: "Jižní oceán", right: "Obklopuje Antarktidu" },
    ],
    hints: ["Tichý = největší."],
    solutionSteps: ["Každý oceán má svou zeměpisnou polohu a charakteristiku."],
  },
  {
    question: "Jak by se jmenoval nejmenší světadíl bez Australie (jako samostatné kontinent)?",
    correctAnswer: "Evropa — pokud by Australii nepočítali jako světadíl",
    options: [
      "Evropa — je to nejmenší tradiční světadíl bez ostrovního kontinentu",
      "Antarktida",
      "Jižní Amerika",
      "Afrika",
    ],
    hints: ["Australie je zároveň ostrov a světadíl."],
    solutionSteps: ["Bez Australie jako světadílu by nejmenší kontinent byla Evropa (10 mil. km²)."],
  },
  {
    question: "Proč se říká, že Atlantský oceán se každý rok zvětšuje?",
    correctAnswer: "Tektonické desky se pohybují — Atlantický oceán se rozevírá o cca 2–3 cm ročně",
    options: [
      "Tektonické desky se pohybují — Atlantický oceán se rozevírá o 2–3 cm ročně",
      "Atlantický oceán se zmenšuje",
      "Je to jen legenda bez vědeckého základu",
      "Stoupá hladina moří vlivem tání ledovců",
    ],
    hints: ["Středoatlantský hřbet = místo, kde se desky oddalují."],
    solutionSteps: ["Středoatlantský hřbet je zóna spreadingu — Severní Amerika a Evropa se vzdalují ~2,5 cm/rok."],
  },
  {
    question: "Jak by vypadala Země, kdyby měla jen jeden oceán (Panthalassa)?",
    correctAnswer: "Tak vypadala v době Pangey — jeden praoceán kolem jednoho superkontinentu",
    options: [
      "Tak vypadala v době Pangey — jeden praoceán kolem superkontinentu",
      "Taková Země nikdy neexistovala",
      "Byl by to mix oceánu a pouště",
      "Tak to bude vypadat za 1000 let",
    ],
    hints: ["Pangea = pracontinent."],
    solutionSteps: ["Před 250 mil. lety existoval superkontinent Pangea a praoceán Panthalassa kolem něj."],
  },
  {
    question: "Který výrok o světadílech je NEPRAVDIVÝ?",
    correctAnswer: "Evropa je největší světadíl",
    options: [
      "Evropa je největší světadíl",
      "Asie je největší světadíl",
      "Australie je nejmenší světadíl",
      "Antarktida nemá stálé obyvatelstvo",
    ],
    hints: ["Asie je největší."],
    solutionSteps: ["Největší světadíl je Asie (44 mil. km²), ne Evropa (10 mil. km²)."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SVETADILYAOCEANYZEMEPREHLED: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-svetadily-a-oceany-zeme-prehled",
    rvpNodeId: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-svetadily-a-oceany-zeme-prehled",
    title: "Světadíly a oceány Země - přehled",
    studentTitle: "Světadíly a oceány",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Evropa a svět",
    briefDescription: "Poznáš všechny světadíly a oceány naší planety.",
    keywords: ["světadíly", "oceány", "asie", "afrika", "tichý oceán", "atlantský oceán", "antarktida", "australie"],
    goals: [
      "Žák jmenuje 7 světadílů a 5 oceánů",
      "Žák uvede největší a nejmenší světadíl a oceán",
      "Žák umístí světadíly na mapu světa",
    ],
    boundaries: ["Politická geografie světa", "Detailní fyzická geografie kontinentů"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "7 světadílů: Evropa, Asie, Afrika, SAmr, JAmr, Australie, Antarktida. 5 oceánů: Tichý, Atlantský, Indický, Severní Ledový, Jižní.",
      steps: [
        "7 světadílů: Evropa, Asie, Afrika, Severní Amerika, Jižní Amerika, Australie, Antarktida",
        "5 oceánů: Tichý (největší), Atlantský, Indický, Severní Ledový (nejmenší), Jižní",
        "Největší světadíl: Asie",
        "Nejmenší světadíl: Australie",
      ],
      commonMistake: "Zapomínání Jižního (Antarktického) oceánu — nejnověji uznaný z pěti oceánů.",
      example: "Tichý oceán je největší — pokrývá třetinu povrchu Země.",
    },
  },
];
