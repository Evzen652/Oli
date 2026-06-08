import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Každý task = seřaď historické události husitské doby ve správném pořadí
const VSECHNY_TASKY: PracticeTask[] = [
  {
    question: "Seřaď události husitské doby od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus začíná kázat v Betlémské kapli",
      "Jan Hus upálen na Kostnickém koncilu (6. 7. 1415)",
      "1. pražská defenestrace – vypuknutí husitských válek (1419)",
      "Basilejská kompaktáta – mír mezi husity a církví (1436)",
    ],
    hints: ["Kázání bylo nejdříve, kompaktáta (1436) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Jan Hus kázal v Betlémské kapli česky — ne latinsky — a přiváděl tisíce posluchačů. Po jeho upálení roku 1415 čekalo Čechy 17 let náboženských válek, které skončily Basilejskými kompaktáty roku 1436.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje prodej odpustků a korupci v církvi",
      "Kostnický koncil – Hus odsouzen jako kacíř",
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace – začátek husitských válek (1419)",
    ],
    hints: ["Kritika byla nejdříve, defenestrace (1419) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Hus byl odsouzen jako kacíř, přestože přijel do Kostnice s císařovým glejtem (slibem bezpečnosti). Porušení slibu pobouřilo Čechy a roku 1419 vedlo k vypuknutí husitských válek.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli v Praze",
      "Jan Hus upálen v Kostnici (1415)",
      "Jan Žižka vede husitské vojsko – vozová hradba",
      "Bitva u Lipan – táborité poraženi kališníky (1434)",
    ],
    hints: ["Kázání bylo nejdříve, Lipany (1434) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Jan Žižka byl vojenský génius — vynalezl vozovou hradbu, která umožnila porazit rytířské armády. Husité díky ní odrazili pět papežských křižáckých výprav. Bitva u Lipan (1434) byl ale jejich vnitřní souboj.",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "1. pražská defenestrace (1419)",
      "Pět křižáckých výprav proti husitům – všechny odraženy",
      "Basilejská kompaktáta – konec husitských válek (1436)",
    ],
    hints: ["1415 → 1419 → křižácké výpravy → kompaktáta 1436.", "Hus byl upálen roku 1415."],
    explanation: "Husité odrazili pět papežských výprav — to bylo v tehdejší Evropě nevídané. Nakonec ne silou zbraní, ale diplomaticky: Basilejská kompaktáta (1436) husitům povolila přijímat pod obojím.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – zlatý věk Čech",
      "Jan Hus kázal v Praze – kritika církve",
      "Jan Hus upálen (1415)",
      "Husitské války (1419–1436)",
    ],
    hints: ["Karel IV. byl nejdříve, husitské války (1419–1436) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Karel IV. zanechal Čechám prosperující říši. Po jeho smrti (1378) nastoupil slabý Václav IV. a narůstala náboženská nespokojenost — živnou půdu pro Jana Husa a jeho kritiku korupce v církvi.",
  },
  {
    question: "Seřaď husitské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – narozen 1369",
      "Jan Hus začíná kázat v Betlémské kapli",
      "Kostnický koncil – Hus odsouzen a upálen (1415)",
      "Husitské války – 1419 až 1436",
    ],
    hints: ["1369 → kázání → 1415 → 1419–1436.", "Hus se narodil roku 1369."],
    explanation: "Jan Hus se narodil roku 1369 v Husinci v jižních Čechách. Stal se profesorem na Karlově universitě a kazatelem v Betlémské kapli — a zemřel jako mučedník v Kostnici ve svých 46 letech.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli česky",
      "Hus dostal od císaře glejt (slib bezpečnosti)",
      "Jan Hus upálen na Kostnickém koncilu",
      "1. pražská defenestrace – husitské války",
    ],
    hints: ["Kázání bylo nejdříve, defenestrace nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Císař Zikmund dal Husovi glejt — slib bezpečí. Přesto ho v Kostnici uvěznili a upálili. Porušení císařského slibu bylo skandální a roku 1419 vyvolalo první pražskou defenestraci, start husitských válek.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (6. 7. 1415)",
      "1. pražská defenestrace – husité vyhodili radní z okna (1419)",
      "Bitva u Lipan – táborité poraženi (1434)",
      "Basilejská kompaktáta – konec husitských válek (1436)",
    ],
    hints: ["1415 → 1419 → 1434 → 1436.", "Hus byl upálen roku 1415."],
    explanation: "Husitské války trvaly 17 let (1419–1436). Záhy se rozkol objevil uvnitř: táborité (radikální) vs. kališníci (umírnění). Bitva u Lipan (1434) táborité porazila, a kališníci pak uzavřeli mír v Basileji.",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kritizuje odpustky a korupci",
      "Kostnický koncil (1414–1418) – Hus odsouzen",
      "Jan Žižka vede husity – 5 výprav poraženo",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Kritika byla nejdříve, kompaktáta (1436) nejpozději.", "Kostnický koncil byl 1414–1418."],
    explanation: "Husité pod Žižkovým vedením odrazili pět papežských křižáckých výprav — nevídaný výsledek v tehdejší Evropě. Jejich vozová hradba (husitský vozový válečný systém) změnila středověkou taktiku.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli – tisíce posluchačů",
      "Jan Hus upálen jako kacíř (1415)",
      "Husitské války – táborité a kališníci (1419–1436)",
      "Jiří z Poděbrad – husitský král (1458)",
    ],
    hints: ["Kázání bylo nejdříve, Jiří z Poděbrad (1458) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Jiří z Poděbrad (1458–1471) byl prvním husitským králem Čech — a jedním z mála nekatolicích panovníků středověké Evropy. Husitství tak nevymizelo, ale přetrvalo v české státnosti.",
  },
  {
    question: "Seřaď mezníky husitské doby od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. zemřel (1378) – začátek hospodářské a náboženské krize",
      "Jan Hus kázal v Praze",
      "Jan Hus upálen (1415)",
      "Basilejská kompaktáta (1436)",
    ],
    hints: ["Karel IV. zemřel roku 1378, kompaktáta byla roku 1436.", "Hus byl upálen roku 1415."],
    explanation: "Karel IV. zanechal Čechám prosperující říši, ale duchovně neklidnou. Po jeho smrti (1378) začala hospodářská i náboženská krize — a Jan Hus byl hlasem nespokojenosti, dokud nebyl umlčen ohněm.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli (přelom 14./15. stol.)",
      "Hus jede do Kostnice s glejtem",
      "Kostnický koncil – Hus odsouzen a upálen (1415)",
      "1. pražská defenestrace (1419)",
    ],
    hints: ["Kázání bylo nejdříve, defenestrace (1419) nejpozději.", "Kostnický koncil byl roku 1415."],
    explanation: "Kostnický koncil (1414–1418) byl největší církevní sněm pozdního středověku. Jan Hus přijel s císařovým glejtem, ale byl uvězněn a odsouzen — porušení slibu rozhořčilo celé Čechy.",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus upálen (1415)",
      "Husité odrazili 1. křižáckou výpravu (1420)",
      "Bitva u Lipan – vnitřní boj husitů (1434)",
      "Basilejská kompaktáta – mír (1436)",
    ],
    hints: ["1415 → 1420 → 1434 → 1436.", "Hus byl upálen roku 1415."],
    explanation: "Rok 1420: husité odrazili první papežskou výpravu u Vítkova — Žižkovo vítězství. Pět výprav celkem odrazili, ale nakonec padli ne pod křižáky, ale sami mezi sebou: Bitva u Lipan 1434.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Kázání Jana Husa v Betlémské kapli",
      "Hus upálen – husitství se radikalizuje",
      "Žižka a husitské vojsko odráží křižáky (1420–1431)",
      "Bitva u Lipan – kališníci poráží táborité (1434)",
    ],
    hints: ["Kázání bylo nejdříve, Lipany (1434) nejpozději.", "Žižka bránil husity v letech 1420–1431."],
    explanation: "Husitská taktika byla revoluční: vozová hradba přeměnila selský vůz v pohyblivou pevnost. Pět křížových výprav se rozbilo o tuto obranu. Ale bitva u Lipan (1434) byla přímou bitvou husitů navzájem.",
  },
  {
    question: "Seřaď husitské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje církev",
      "Kostnický koncil – Hus odsouzen a upálen (1415)",
      "1. pražská defenestrace (1419) – husitské války začínají",
      "Basilejská kompaktáta (1436) – konec válek",
    ],
    hints: ["Kritika byla nejdříve, kompaktáta (1436) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Basilejská kompaktáta (1436) byla první uznání práv kacířů v dějinách církve — husitům bylo povoleno přijímat pod obojím, způlat kalich vína. Byl to kompromis, ne vítězství, ale husitství přežilo.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kázání v češtině pro prostý lid",
      "Hus upálen (1415) – mučedník",
      "Husitské války – pět papežských výprav poraženo",
      "Kompaktáta 1436 – husité uznáni",
    ],
    hints: ["Kázání bylo nejdříve, kompaktáta (1436) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Jan Hus kázal česky — ne latinsky jako ostatní kněží. Pro chudý lid to bylo revoluční: poprvé mohli rozumět kazateli. Tato demokratizace víry byla jedním z důvodů, proč ho církev odsoudila.",
  },
  {
    question: "Seřaď mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – zlatý věk Čech (zemřel 1378)",
      "Jan Hus kázal v Praze",
      "1. pražská defenestrace – vypuknutí válek (1419)",
      "Basilejská kompaktáta – konec husitských válek (1436)",
    ],
    hints: ["Karel IV. zemřel roku 1378, kompaktáta byla roku 1436.", "Defenestrace byla roku 1419."],
    explanation: "Zlatý věk Karla IV. trval do jeho smrti roku 1378. Pak přišla krize — slabý Václav IV., odpustky, korupce. Jan Hus zapaloval dav svým kázáním a roku 1415 byl upálen, ale jeho dílo přetrvalo v husitství.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – narozen 1369, kazatel v Praze",
      "Jan Hus upálen v Kostnici (1415)",
      "1. pražská defenestrace (1419)",
      "Bitva u Lipan (1434) – kališníci vs. táborité",
    ],
    hints: ["1369 → 1415 → 1419 → 1434.", "Hus se narodil roku 1369."],
    explanation: "Jan Hus žil jen 46 let, ale jeho vliv trval staletí. Byl popraven roku 1415 — a přesto jeho myšlenky přežily celé husitské hnutí (1419–1436) a inspirovaly reformaci 100 let po jeho smrti.",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli",
      "Kostnický koncil – Hus odsouzen",
      "Husitské války (1419–1436) – Jan Žižka velí",
      "Jiří z Poděbrad – husitský král (1458)",
    ],
    hints: ["Kázání bylo nejdříve, Jiří z Poděbrad (1458) nejpozději.", "Kostnický koncil byl roku 1415."],
    explanation: "Jiří z Poděbrad byl husitský šlechtic, který se roku 1458 stal prvním husitským králem Čech. Byl vzácnou postavou: nekatolický vládce, jehož uznala část Evropy, ale zároveň byl exkomunikován papežem.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kritika prodeje odpustků",
      "Jan Hus upálen (6. 7. 1415)",
      "Husité odrazili pět křižáckých výprav",
      "Basilejská kompaktáta – mír a uznání husitů (1436)",
    ],
    hints: ["Kritika byla nejdříve, kompaktáta (1436) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Odpustky — placené prominutí hříchů — Hus označil za korupci. Církev ho za to odsoudila. Ironie je, že 100 let po Husově upálení Martin Luther zahájil reformaci přesně se stejnou kritikou odpustků.",
  },
  {
    question: "Seřaď husitské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kázal česky v Betlémské kapli",
      "Hus upálen – stává se mučedníkem (1415)",
      "1. pražská defenestrace – husité vyhodili radní (1419)",
      "Bitva u Lipan – rozkol husitů (1434)",
    ],
    hints: ["Kázání bylo nejdříve, Lipany (1434) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Husitství se brzy rozdělilo na dvě křídla: kališníci (umírnění, chtěli jen přijímání pod obojím) a táborité (radikální, chtěli reformu celé společnosti). Bitva u Lipan (1434) tento spor rozhodla.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje církev a korupci",
      "Hus odsouzen na Kostnickém koncilu",
      "Žižkova vozová hradba odráží rytíře",
      "Basilejská kompaktáta – konec husitských válek",
    ],
    hints: ["Kritika byla nejdříve, kompaktáta nejpozději.", "Kostnický koncil byl roku 1415."],
    explanation: "Žižkova vozová hradba změnila středověkou taktiku: z prostých selských vozů vytvořil pohyblivou pevnost. Tento vynález byl tak revoluční, že ho evropská vojska napodobovala ještě 150 let.",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Hus upálen (1415) – mučednictví",
      "1. pražská defenestrace – start husitských válek (1419)",
      "Žižka vede husity k vítězstvím",
      "Basilejská kompaktáta – mír (1436)",
    ],
    hints: ["1415 → 1419 → Žižka → kompaktáta 1436.", "Hus byl upálen roku 1415."],
    explanation: "1. pražská defenestrace (1419): husité vyhodili z oken radnice 7 konšelů na pikle. Tento akt byl symbolem revolty — začátek 17letých husitských válek, které změnily Čechy na pokolení.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kázal v Betlémské kapli (kolem 1402)",
      "Jan Hus upálen (1415)",
      "Husitské války začínají (1419)",
      "Basilejská kompaktáta – konec válek (1436)",
    ],
    hints: ["1402 → 1415 → 1419 → 1436.", "Hus byl upálen roku 1415."],
    explanation: "Betlémská kaple byla postavena roku 1391 speciálně pro česká kázání — ne latinská. Jan Hus zde kázal od roku 1402 a přiváděl tisíce lidí z Prahy i venkova. Byla to líheň husitského hnutí.",
  },
  {
    question: "Seřaď mezníky husitství od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal česky pro prostý lid",
      "Kostnický koncil – Hus odsouzen jako kacíř (1415)",
      "Husitské války – táborité a kališníci bojují za reformu",
      "Jiří z Poděbrad – husitský král Čech (1458)",
    ],
    hints: ["Kázání bylo nejdříve, Jiří z Poděbrad (1458) nejpozději.", "Kostnický koncil byl roku 1415."],
    explanation: "Husitství trvalo 40 let — od Husova upálení (1415) po Basilejská kompaktáta (1436) — a jeho plody viděl Jiří z Poděbrad, první husitský král (1458). Hus změnil dějiny Čech na celá staletí.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Václav IV. – slabý nástupce Karla IV. (vládl od 1378)",
      "Jan Hus kázal v Praze – náboženská krize",
      "Husitské války (1419–1436)",
      "Basilejská kompaktáta – husité uznáni (1436)",
    ],
    hints: ["Václav IV. nastoupil roku 1378, kompaktáta byla roku 1436.", "Husitské války byly 1419–1436."],
    explanation: "Václav IV. byl slabý vládce — opak Karla IV. Pod jeho vládou se nakupila napětí: hospodářská krize, korupce v církvi, odpustky. Jan Hus tuto nespokojenost artikuloval — za cenu vlastního života.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kázal v češtině, ne latině",
      "Jan Hus upálen (6. 7. 1415)",
      "1. pražská defenestrace (1419)",
      "Bitva u Lipan (1434) – kališníci vítězí nad táborité",
    ],
    hints: ["Kázání bylo nejdříve, Lipany (1434) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Hus kázal česky v době, kdy všechny církevní obřady byly v latině — jazyce, kterému nerozuměl prostý lid. Byl to revoluční krok: demokratizace víry, která stála Husa život a Čechy 17 let válek.",
  },
  {
    question: "Seřaď husitské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje korupci v církvi",
      "Jan Hus upálen na Kostnickém koncilu (1415)",
      "Husité odrazili pět křižáckých výprav (1420–1431)",
      "Basilejská kompaktáta – konec husitských válek (1436)",
    ],
    hints: ["Kritika byla nejdříve, kompaktáta (1436) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Pět křižáckých výprav (1420–1431) — všechny odraženy husity. To byl nevídaný výsledek: selská armáda s vozovou hradbou porazila rytíře celé Evropy. Husité jako vojenská síla neměli v Evropě obdobu.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – zlatý věk Čech (zemřel 1378)",
      "Václav IV. – náboženská krize",
      "Jan Hus upálen (1415)",
      "Basilejská kompaktáta (1436) – konec husitských válek",
    ],
    hints: ["Karel IV. zemřel roku 1378, kompaktáta byla roku 1436.", "Hus byl upálen roku 1415."],
    explanation: "Karel IV. byl moudrý diplomat, který udržoval náboženský mír. Václav IV. (od 1378) byl neschopný — a napětí narůstalo. Hus byl hlasem nespokojenosti, který církev umlčela, ale hnutí nezastavila.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kázal v Betlémské kapli",
      "Hus upálen – kalich jako symbol husitů",
      "Žižka velí husitskému vojsku – odráží křižáky",
      "Kompaktáta 1436 – husité uznáni církví",
    ],
    hints: ["Kázání bylo nejdříve, kompaktáta (1436) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Kalich se stal symbolem husitů — přijímání vína (krve Kristovy) bylo jejich hlavním požadavkem. Katolická církev totiž podávala víno pouze kněžím. Právo přijímat 'pod obojím' husité roku 1436 prosadili.",
  },
  {
    question: "Seřaď husitské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Hus – kázal česky v Praze",
      "Hus upálen jako kacíř (1415)",
      "1. pražská defenestrace – start válek (1419)",
      "Bitva u Lipan – rozkol husitů (1434)",
    ],
    hints: ["Kázání bylo nejdříve, Lipany (1434) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Bitva u Lipan (1434) nebyla boj s křižáky — byl to boj husitů navzájem. Kališníci (s katolickými šlechtici) porazili táborité. Husitské hnutí přestalo být jednotné — ale mír pak byl pro husity příznivý.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Hus kázal v Betlémské kapli – tisíce posluchačů",
      "Jan Hus upálen (1415) – stává se mučedníkem",
      "Husitské války – Jan Žižka a pět vítězných výprav",
      "Basilejská kompaktáta – husité uznáni (1436)",
    ],
    hints: ["Kázání bylo nejdříve, kompaktáta (1436) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Basilejská kompaktáta (1436) husitům přiznávala přijímání pod obojím — skromný výsledek po 17 letech válek. Ale byl to průlom: poprvé v dějinách středověku získalo kacířské hnutí formální uznání.",
  },
  {
    question: "Seřaď mezníky husitské doby od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus – narozen 1369, kazatel",
      "Kostnický koncil – Hus odsouzen a upálen",
      "Husitské války (1419–1436)",
      "Jiří z Poděbrad – husitský král (1458)",
    ],
    hints: ["1369 → Kostnice → 1419–1436 → Jiří z Poděbrad.", "Hus se narodil roku 1369."],
    explanation: "Od Husova narození (1369) po Jiřího z Poděbrad (1458) uplynulo 89 let — a celou tuto dobu formovalo husitství českou společnost. Jiří z Poděbrad byl jeho posledním politickým plodem.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Hus kritizuje korupci v církvi",
      "Hus upálen (1415) – zápalná jiskra husitství",
      "1. pražská defenestrace (1419) – start husitských válek",
      "Kompaktáta 1436 – konec válek, husité uznáni",
    ],
    hints: ["Kritika byla nejdříve, kompaktáta (1436) nejpozději.", "Hus byl upálen roku 1415."],
    explanation: "Husitství přežilo válku i kompaktáta. Jiří z Poděbrad (1458) byl nekatolický král — první a poslední v dějinách Čech. Husitská tradice se tak stala součástí české státní identity.",
  },
  {
    question: "Seřaď husitské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Karel IV. zemřel – náboženské a hospodářské nepokoje (1378)",
      "Jan Hus kázal v Betlémské kapli",
      "Jan Hus upálen (1415)",
      "Basilejská kompaktáta – mír (1436)",
    ],
    hints: ["Karel IV. zemřel roku 1378, kompaktáta byla roku 1436.", "Hus byl upálen roku 1415."],
    explanation: "Karel IV. zanechal Čechám prosperující říši, ale po jeho smrti roku 1378 začala hospodářská i náboženská krize. Jan Žižka zemřel roku 1424 uprostřed válek — ale husité pokračovali pod jeho generály jako neporažené vojsko.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(VSECHNY_TASKY).slice(0, 35);
}

export const MISTRJANHUSHUSITSKEVALKY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-husitstvi-mistr-jan-hus-husitske-valky",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-husitstvi-mistr-jan-hus-husitske-valky",
    title: "Mistr Jan Hus, husitské války",
    studentTitle: "Jan Hus",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš kazatele Jana Husa, proč byl upálen a jak vznikly husitské války.",
    keywords: ["Jan Hus", "husitství", "Žižka", "Betlémská kaple", "kalich", "odpustky", "1415"],
    goals: [
      "Popsat Jana Husa a jeho přínos",
      "Vysvětlit příčiny husitských válek",
      "Znát rok 1415 a Kostnický koncil",
      "Popsat husitský symbol — kalich",
    ],
    boundaries: ["Detailní vojenská strategie není cílem", "Basilejský koncil do hloubky není vyžadován"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Jan Hus 1369–1415 = kazatel, Betlémská kaple, kritik odpustků. Upálen 6. 7. 1415 v Kostnici. Husitské války 1419–1436.",
      steps: [
        "Hus = kazatel, ne panovník",
        "1415 = upálen v Kostnici → husitské války",
        "Žižka = vojevůdce, vozová hradba",
        "Kalich = symbol přijímání pod obojím",
        "1436 = kompaktáta, konec válek",
      ],
      commonMistake: "Žáci si pletou Jana Husa a Jana Žižku — Hus byl kazatel, Žižka vojevůdce.",
      example: "Jan Hus: kazatel v Betlémské kapli → 1415 upálen v Kostnici → 1419 husitské války → 1434 Lipany → 1436 kompaktáta.",
    },
  },
];
