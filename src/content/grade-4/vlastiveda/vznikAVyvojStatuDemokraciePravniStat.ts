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
    question: "Co je to stát?",
    correctAnswer: "Území s obyvateli, vládou a právním řádem",
    options: [
      "Území s obyvateli, vládou a právním řádem",
      "Jen skupina lidí na jednom místě",
      "Vláda bez území",
      "Armáda s velitelem",
    ],
    hints: ["Stát má 3 základní prvky: území, obyvatelé, vláda."],
    solutionSteps: ["Stát je organizované společenství — má území, obyvatele, vládu a právo."],
  },
  {
    question: "Co znamená slovo demokracie?",
    correctAnswer: "Vláda lidu (řecky demos = lid, kratos = vláda)",
    options: [
      "Vláda lidu (řecky demos = lid, kratos = vláda)",
      "Vláda krále",
      "Vláda církve",
      "Vláda armády",
    ],
    hints: ["Demokracie pochází z řeckého jazyka."],
    solutionSteps: ["Demokracie = demos (lid) + kratos (vláda) → vláda lidu — lidé rozhodují o svém státu."],
  },
  {
    question: "Co je to ústava?",
    correctAnswer: "Základní zákon státu, který určuje práva a povinnosti",
    options: [
      "Základní zákon státu, který určuje práva a povinnosti",
      "Zákon o daních",
      "Kniha zákonů",
      "Rozhodnutí vlády",
    ],
    hints: ["Ústava je nejvyšší zákon — ostatní zákony musí být v souladu s ní."],
    solutionSteps: ["Ústava je základní zákon státu — určuje, jak stát funguje a jaká jsou práva občanů."],
  },
  {
    question: "Kdy byla přijata Ústava ČR?",
    correctAnswer: "V roce 1993",
    options: ["V roce 1993", "V roce 1918", "V roce 1968", "V roce 1989"],
    hints: ["ČR vznikla v roce 1993."],
    solutionSteps: ["Ústava ČR byla přijata roku 1993, kdy vznikla samostatná Česká republika."],
  },
  {
    question: "Jaký je typ vlády v ČR?",
    correctAnswer: "Parlamentní republika",
    options: ["Parlamentní republika", "Monarchie", "Diktatura", "Federace"],
    hints: ["ČR nemá krále — je to republika."],
    solutionSteps: ["ČR je parlamentní republika — nejvyšší moc má parlament volený občany."],
  },
  {
    question: "Jak se nazývá nejvyšší zákonodárný orgán ČR?",
    correctAnswer: "Parlament (Poslanecká sněmovna + Senát)",
    options: [
      "Parlament (Poslanecká sněmovna + Senát)",
      "Vláda",
      "Prezident",
      "Ministerstvo",
    ],
    hints: ["Zákonodárci tvoří zákony — parlament."],
    solutionSteps: ["Parlamentem ČR jsou dvě komory: Poslanecká sněmovna (200 poslanců) a Senát (81 senátorů)."],
  },
  {
    question: "Kdo je hlavou státu ČR?",
    correctAnswer: "Prezident",
    options: ["Prezident", "Premiér", "Předseda sněmovny", "Hejtman"],
    hints: ["Hlava státu je nejvyšší symbol státu."],
    solutionSteps: ["Hlavou státu ČR je prezident — volí ho lidé přímou volbou na 5 let."],
  },
  {
    question: "Kdo vede vládu ČR?",
    correctAnswer: "Předseda vlády (premiér)",
    options: ["Předseda vlády (premiér)", "Prezident", "Ministr financí", "Předseda sněmovny"],
    hints: ["Předseda vlády = premiér."],
    solutionSteps: ["Vládu ČR vede předseda vlády (premiér) — jmenuje ho prezident."],
  },
  {
    question: "Na kolik let se volí prezident ČR?",
    correctAnswer: "Na 5 let",
    options: ["Na 5 let", "Na 4 roky", "Na 10 let", "Na celý život"],
    hints: ["Prezidentské volby se konají každých 5 let."],
    solutionSteps: ["Prezident ČR je volen na 5leté funkční období — může být zvolen maximálně dvakrát."],
  },
  {
    question: "Co je to volné volby?",
    correctAnswer: "Volby, kde mohou hlasovat všichni dospělí občané tajně a dobrovolně",
    options: [
      "Volby, kde mohou hlasovat všichni dospělí občané tajně a dobrovolně",
      "Volby, kde hlasuje jen šlechta",
      "Volby povinné pod hrozbou trestu",
      "Volby organizované církví",
    ],
    hints: ["Svobodné volby jsou základem demokracie."],
    solutionSteps: ["Svobodné volby = tajné hlasování, dobrovolné, bez nátlaku — základ demokracie."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi přímou a zastupitelskou demokracií?",
    correctAnswer: "Přímá = lidé rozhodují sami (hlasování); zastupitelská = volí zástupce, kteří rozhodují",
    options: [
      "Přímá = lidé rozhodují sami (hlasování); zastupitelská = volí zástupce, kteří rozhodují",
      "Přímá = vláda rozhoduje, zastupitelská = prezident rozhoduje",
      "Jsou to totéž",
      "Přímá je starší forma demokracie v ČR",
    ],
    hints: ["ČR má zastupitelskou demokracii — volíme poslance."],
    solutionSteps: ["Přímá demokracie: hlasují všichni (referendum). Zastupitelská: volíme zástupce (parlament), kteří rozhodují za nás."],
  },
  {
    question: "Co je to Listina základních práv a svobod?",
    correctAnswer: "Zákon zaručující práva každého člověka v ČR — součást ústavy",
    options: [
      "Zákon zaručující práva každého člověka v ČR — součást ústavy",
      "Seznam povinností daňových poplatníků",
      "Zákon o volbách",
      "Zákon o státní symbolice",
    ],
    hints: ["Listina = seznam základních práv — co smíme a co nám stát zaručuje."],
    solutionSteps: ["Listina základních práv a svobod zaručuje každému člověku v ČR: právo na život, svobodu, vzdělání, ochranu soukromí a mnoho dalšího."],
  },
  {
    question: "Co je to právní stát?",
    correctAnswer: "Stát, kde platí zákony stejně pro všechny — i pro vládu a úředníky",
    options: [
      "Stát, kde platí zákony stejně pro všechny — i pro vládu a úředníky",
      "Stát s mnoha zákony",
      "Stát, kde rozhodují soudci",
      "Stát, kde právo = peníze",
    ],
    hints: ["V právním státě nikdo není nad zákonem."],
    solutionSteps: ["Právní stát = zákony platí pro všechny bez výjimky — i pro politiky a vládu. Nikdo není nad zákonem."],
  },
  {
    question: "Kolik poslanců má Poslanecká sněmovna ČR?",
    correctAnswer: "200",
    options: ["200", "81", "150", "300"],
    hints: ["Poslanecká sněmovna = nižší komora parlamentu."],
    solutionSteps: ["Poslanecká sněmovna ČR má 200 poslanců, volených každé 4 roky."],
  },
  {
    question: "Kolik senátorů má Senát ČR?",
    correctAnswer: "81",
    options: ["81", "200", "100", "60"],
    hints: ["Senát = horní komora parlamentu."],
    solutionSteps: ["Senát ČR má 81 senátorů, volených na 6 let (třetina obnovována každé 2 roky)."],
  },
  {
    question: "Co jsou to základní lidská práva?",
    correctAnswer: "Práva, která má každý člověk od narození — nezávisle na státě",
    options: [
      "Práva, která má každý člověk od narození — nezávisle na státě",
      "Práva udělená vládou",
      "Práva zaručená jen občanům ČR",
      "Práva vydaná soudem",
    ],
    hints: ["Základní práva = právo na život, svobodu, důstojnost — nikomu je nelze vzít."],
    solutionSteps: ["Základní lidská práva jsou přirozená — právo na život, svobodu, vzdělání. Stát je chrání, ale nedává."],
  },
  {
    question: "Co je to nezávislá justice (soud)?",
    correctAnswer: "Soudy rozhodují nezávisle na vládě — nikdo jim nemůže říkat, jak rozhodovat",
    options: [
      "Soudy rozhodují nezávisle na vládě — nikdo jim nemůže říkat, jak rozhodovat",
      "Soudy jsou podřízeny prezidentovi",
      "Soudy jsou součástí vlády",
      "Parlament řídí soudy",
    ],
    hints: ["Nezávislost soudů = základ právního státu."],
    solutionSteps: ["Nezávislá justice = soudy rozhodují bez politického tlaku — základ právního státu a ochrany práv občanů."],
  },
  {
    question: "Proč je zakázána diskriminace?",
    correctAnswer: "Všichni lidé mají stejná práva bez ohledu na barvu pleti, pohlaví nebo náboženství",
    options: [
      "Všichni lidé mají stejná práva bez ohledu na barvu pleti, pohlaví nebo náboženství",
      "Diskriminace je zakázána jen v zaměstnání",
      "Diskriminace je zákazána jen v školách",
      "Zákaz diskriminace se týká jen voleb",
    ],
    hints: ["Diskriminace = nerovné zacházení bez důvodu."],
    solutionSteps: ["Diskriminace je zakázána, protože každý člověk má stejnou důstojnost — ústava zaručuje rovnost."],
  },
  {
    question: "Co je to svoboda slova?",
    correctAnswer: "Právo vyjadřovat své názory bez strachu z trestu",
    options: [
      "Právo vyjadřovat své názory bez strachu z trestu",
      "Právo mluvit jen česky",
      "Právo kritizovat jen vládu",
      "Povinnost říkat pravdu",
    ],
    hints: ["Svoboda slova = základ demokracie — bez ní není kritika možná."],
    solutionSteps: ["Svoboda slova zaručuje, že každý může vyjadřovat názory, kritizovat vládu a sdílet informace bez strachu."],
  },
  {
    question: "Jak vznikají zákony v ČR?",
    correctAnswer: "Zákon navrhne poslanec nebo vláda → sněmovna hlasuje → senát schválí → podepíše prezident",
    options: [
      "Zákon navrhne poslanec nebo vláda → sněmovna hlasuje → senát schválí → podepíše prezident",
      "Zákon vydá přímo prezident",
      "Zákon navrhnou občané a vláda ho podepíše",
      "Zákon vydávají soudy",
    ],
    hints: ["Zákonodárný proces má více kroků."],
    solutionSteps: ["Zákon: návrh (poslanec/vláda) → hlasování sněmovny → posouzení senátu → podpis prezidenta → platný zákon."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Proč nemůže v demokratickém státě jedna osoba vládnout neomezeně?",
    correctAnswer: "Moc je rozdělena — zákonodárná, výkonná, soudní se navzájem kontrolují",
    options: [
      "Moc je rozdělena — zákonodárná, výkonná, soudní se navzájem kontrolují",
      "Protože ústava zakazuje dlouhou vládu",
      "Protože demokracie nemá vůdce",
      "Protože parlament může vždy odvolat prezidenta",
    ],
    hints: ["Dělba moci = kontrola moci mezi třemi složkami."],
    solutionSteps: ["V demokracii je moc rozdělena na zákonodárnou (parlament), výkonnou (vláda) a soudní — navzájem se kontrolují."],
  },
  {
    question: "Jaký je rozdíl mezi demokracií a diktaturou?",
    correctAnswer: "Demokracie = svobodné volby, práva občanů, dělba moci; diktatura = jedna osoba vládne bez kontroly",
    options: [
      "Demokracie = svobodné volby, práva občanů, dělba moci; diktatura = jedna osoba vládne bez kontroly",
      "Diktatura je rychlejší verze demokracie",
      "V demokracii rozhoduje prezident, v diktatuře parlament",
      "Diktatury existovaly jen ve starověku",
    ],
    hints: ["Diktatura = koncentrace moci v jedněch rukou bez kontroly."],
    solutionSteps: ["Demokracie: svobodné volby + práva + dělba moci. Diktatura: moc jedné strany/osoby, bez voleb a práv."],
  },
  {
    question: "Jak se lidé mohou zapojit do demokracie kromě voleb?",
    correctAnswer: "Referendum, petice, demonstrace, aktivní občanství v obcích",
    options: [
      "Referendum, petice, demonstrace, aktivní občanství v obcích",
      "Jen volbami jednou za 4 roky",
      "Placením daní",
      "Prostřednictvím soudů",
    ],
    hints: ["Demokracie není jen o volbách."],
    solutionSteps: ["Občané se zapojují: volby, referendum (hlasování o konkrétní věci), petice, demonstrace, místní samospráva."],
  },
  {
    question: "Proč jsou nezávislá média důležitá pro demokracii?",
    correctAnswer: "Informují občany a kontrolují vládu — bez svobodných médií není demokracie",
    options: [
      "Informují občany a kontrolují vládu — bez svobodných médií není demokracie",
      "Média jsou jen zábava",
      "Média slouží vládě",
      "Nezávislá média jsou nebezpečná pro demokracii",
    ],
    hints: ["Svobodný tisk = 'čtvrtá moc' — kontroluje vládu."],
    solutionSteps: ["Nezávislá média informují občany o chování vlády — bez svobodného tisku nemá veřejnost přístup k pravdivým informacím."],
  },
  {
    question: "Jak se Atény (starověké Řecko) liší od moderní demokracie ČR?",
    correctAnswer: "V Aténách mohli hlasovat jen svobodní muži-občané; v ČR mají právo volit všichni dospělí",
    options: [
      "V Aténách mohli hlasovat jen svobodní muži-občané; v ČR mají právo volit všichni dospělí",
      "V Aténách hlasoval každý — bylo to dokonalejší",
      "V Aténách bylo více svobody než v ČR",
      "Atény a ČR mají identický systém",
    ],
    hints: ["Aténská demokracie vylučovala ženy, otroky a cizince."],
    solutionSteps: ["Aténská demokracie: jen svobodní muži-občané. ČR: všichni dospělí občané bez rozdílu pohlaví nebo původu."],
  },
  {
    question: "Co je to ústavní soud a proč je důležitý?",
    correctAnswer: "Soud kontrolující, zda jsou zákony v souladu s ústavou — ochrana práv před nezákonnými zákony",
    options: [
      "Soud kontrolující, zda jsou zákony v souladu s ústavou — ochrana práv před nezákonnými zákony",
      "Nejvyšší soud pro trestní věci",
      "Soud pro volební spory",
      "Soud pro mezinárodní kauzy",
    ],
    hints: ["Ústavní soud = hlídač ústavy."],
    solutionSteps: ["Ústavní soud ČR kontroluje, zda přijímané zákony neporušují ústavu — chrání občany před protiústavními zákonody."],
  },
  {
    question: "Proč je důležité dodržovat zákony i tehdy, když s nimi nesouhlasíme?",
    correctAnswer: "Bez dodržování zákonů by společnost nefungovala — změny jdou přes demokratický proces",
    options: [
      "Bez dodržování zákonů by společnost nefungovala — změny jdou přes demokratický proces",
      "Zákony jsou vždy spravedlivé — nemá cenu je zpochybňovat",
      "Zákon lze ignorovat, pokud nám nesedí",
      "Zákony dodržují jen ti, co se bojí trestu",
    ],
    hints: ["Demokracie funguje jen tehdy, když většina respektuje pravidla."],
    solutionSteps: ["Zákony jsou základ spolupráce — nesouhlas řešíme demokraticky (petice, volby, soud), ne jejich porušením."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const count = level === 3 ? Math.min(pool.length, 35) : Math.min(pool.length, 30);
  return shuffle(pool).slice(0, count);
}

export const VZNIKAVYVOJSTATUDEMOKRACIEPRAVNISTAT: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-kolem-nas-stat-a-spolecnost-vznik-a-vyvoj-statu-demokracie-pravni-stat",
    rvpNodeId: "g4-vlastiveda-lide-kolem-nas-stat-a-spolecnost-vznik-a-vyvoj-statu-demokracie-pravni-stat",
    title: "Vznik a vývoj státu, demokracie, právní stát",
    studentTitle: "Demokracie a stát",
    subject: "vlastivěda",
    category: "Lidé kolem nás",
    topic: "Lidé kolem nás",
    briefDescription: "Pochopíš, co je demokracie, jak funguje stát a proč jsou zákony pro všechny.",
    keywords: ["demokracie", "stát", "ústava", "parlament", "prezident", "právní stát", "volby", "práva"],
    goals: [
      "Vysvětlit pojem demokracie a právní stát",
      "Popsat orgány ČR (parlament, vláda, prezident)",
      "Vyjmenovat základní práva a svobody",
      "Pochopit roli zákonů ve společnosti",
    ],
    boundaries: ["Politické strany nejsou cílem", "Mezinárodní právo není vyžadováno"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "conceptual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Demokracie = vláda lidu. ČR = parlamentní republika. Parlament: sněmovna (200) + senát (81). Prezident = hlava státu.",
      steps: [
        "Stát = území + obyvatelé + vláda + právo",
        "Demokracie = svobodné volby + práva + dělba moci",
        "ČR: parlament tvoří zákony, vláda spravuje, soudy chrání",
        "Základní práva: život, svoboda, vzdělání, rovnost",
      ],
      commonMistake: "Žáci si pletou premiéra a prezidenta — prezident = hlava státu, premiér = vede vládu.",
      example: "ČR: prezident (hlava státu) + vláda (premiér) + parlament (sněmovna + senát) = demokratická republika.",
    },
  },
];
