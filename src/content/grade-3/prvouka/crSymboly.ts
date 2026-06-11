import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    question: "Z jakých barevných pruhů se skládá vlajka České republiky?",
    correctAnswer: "Bílý pruh nahoře, červený pruh dole a modrý klín vlevo",
    options: [
      "Bílý pruh nahoře, červený pruh dole a modrý klín vlevo",
      "Modrý pruh nahoře, bílý pruh dole a červený klín vlevo",
      "Červený pruh nahoře, bílý pruh dole a zelený klín vlevo",
      "Tři vodorovné pruhy: modrý, bílý, červený",
    ],
    hints: [
      "Vlajka má dva vodorovné pruhy a jeden klín, který zasahuje ze strany.",
      "Klín směřuje od levého okraje doprostřed vlajky a má modrou barvu.",
    ],
    explanation:
      "Vlajka České republiky se skládá z bílého pruhu nahoře, červeného pruhu dole a modrého klínu, který vychází z levého okraje. Bílá a červená barva pochází z původní moravsko-české zemské symboliky, modrý klín byl přidán při vzniku Československa.",
  },
  {
    question: "Co znázorňuje velký státní znak České republiky?",
    correctAnswer: "Českého lva, moravskou orlici a slezskou orlici",
    options: [
      "Českého lva, moravskou orlici a slezskou orlici",
      "Tři české lvy ve třech polích",
      "Dvě orlice a jednoho orla",
      "Českého lva, polského orla a slovenský štít",
    ],
    hints: [
      "Velký státní znak má tři části — každá představuje jednu historickou zemi.",
      "Česká země má ve znaku lva, Morava a Slezsko mají orlici.",
    ],
    explanation:
      "Velký státní znak České republiky zobrazuje tři historické země: Čechy zastupuje bílý lev na červeném poli, Moravu stříbrno-červeně šachovaná orlice na modrém poli a Slezsko černá orlice se zlatou korunou na zlatém poli.",
  },
  {
    question: "Jak se jmenuje státní hymna České republiky?",
    correctAnswer: "Kde domov můj",
    options: [
      "Kde domov můj",
      "Óda na radost",
      "Má vlast",
      "Čechy krásné, Čechy mé",
    ],
    hints: [
      "Název hymny je zároveň její první slova — je to otázka.",
      "Píseň popsal spisovatel Josef Kajetán Tyl a složil ji František Škroup.",
    ],
    explanation:
      "Státní hymna České republiky se jmenuje Kde domov můj. Slova napsal Josef Kajetán Tyl a melodii složil František Škroup. Pochází z roku 1834 a původně to byla píseň z divadelní hry.",
  },
  {
    question: "Jak se jmenuje hlavní město České republiky?",
    correctAnswer: "Praha",
    options: ["Praha", "Brno", "Ostrava", "Plzeň"],
    hints: [
      "Hlavní město leží na řece Vltavě.",
      "Je to největší město v České republice.",
    ],
    explanation:
      "Hlavní město České republiky je Praha. Leží na řece Vltavě a je největším a nejdůležitějším městem v zemi. Sídlí zde prezident, vláda i parlament.",
  },
  {
    question: "Kdo je hlavou státu v České republice?",
    correctAnswer: "Prezident",
    options: ["Prezident", "Premiér", "Starosta Prahy", "Předseda Senátu"],
    hints: [
      "Hlava státu je nejvyšší ústavní činitel — volí ho občané.",
      "Prezident sídlí na Pražském hradě.",
    ],
    explanation:
      "Hlavou státu v České republice je prezident. Sídlí na Pražském hradě, je volen občany a zastupuje Českou republiku navenek. Jmenuje například vládu nebo podepisuje zákony.",
  },
  {
    question: "Jak se jmenují obě komory českého parlamentu?",
    correctAnswer: "Poslanecká sněmovna a Senát",
    options: [
      "Poslanecká sněmovna a Senát",
      "Sněmovna a Duma",
      "Dolní sněmovna a Horní sněmovna",
      "Rada a Kongres",
    ],
    hints: [
      "Parlament má dvě části — jednu s poslanci a druhou se senátory.",
      "Dolní komora se jmenuje Poslanecká sněmovna, horní komora je Senát.",
    ],
    explanation:
      "Český parlament se skládá ze dvou komor: Poslanecké sněmovny (200 poslanců) a Senátu (81 senátorů). Obě komory schvalují zákony, ale mají různé pravomoci a různé délky volebního období.",
  },
  {
    question: "Co slavíme 28. října?",
    correctAnswer: "Vznik Československa v roce 1918",
    options: [
      "Vznik Československa v roce 1918",
      "Konec druhé světové války",
      "Příchod Cyrila a Metoděje",
      "Nový rok",
    ],
    hints: [
      "Je to den, kdy v roce 1918 vznikl nový stát na mapě Evropy.",
      "Tehdy přestal existovat Rakousko-Uherský stát a vzniklo Československo.",
    ],
    explanation:
      "28. října 1918 vzniklo Československo — nový stát, ve kterém žili Češi a Slováci. Tento den je proto největším státním svátkem České republiky. Říkáme mu také Den vzniku samostatného Československého státu.",
  },
  {
    question: "Co slavíme 8. května?",
    correctAnswer: "Konec druhé světové války v Evropě",
    options: [
      "Konec druhé světové války v Evropě",
      "Vznik Československa",
      "Den vstupu do Evropské unie",
      "Narozeniny prvního prezidenta",
    ],
    hints: [
      "8. května 1945 skončila válka, která trvala šest let.",
      "Tento den se vzdalo Německo — válka v Evropě skončila.",
    ],
    explanation:
      "8. května 1945 kapitulovalo nacistické Německo a v Evropě skončila druhá světová válka. Proto slavíme 8. května jako Den vítězství. Je to svátek míru a svobody.",
  },
  {
    question: "Co slavíme 5. července?",
    correctAnswer: "Příchod Cyrila a Metoděje na Moravu",
    options: [
      "Příchod Cyrila a Metoděje na Moravu",
      "Svátek Jana Husa",
      "Vznik státu",
      "Konec války",
    ],
    hints: [
      "5. července připomínáme dva věrozvěsty, kteří přišli z Byzance.",
      "Přinesli slovanské písmo — hlaholici.",
    ],
    explanation:
      "5. července si připomínáme příchod věrozvěstů Cyrila a Metoděje na Velkou Moravu v roce 863. Přinesli křesťanství a vytvořili slovanské písmo hlaholici, ze které vznikla azbuka. Jsou patroni Evropy.",
  },
  {
    question: "Co slavíme 6. července?",
    correctAnswer: "Den upálení mistra Jana Husa",
    options: [
      "Den upálení mistra Jana Husa",
      "Svátek Cyrila a Metoděje",
      "Vznik Češsko-Slovenské federace",
      "Den české státnosti",
    ],
    hints: [
      "6. července připomínáme kazatele, který bojoval za pravdu a byl za to potrestán.",
      "Jan Hus byl upálen v roce 1415 v Kostnici.",
    ],
    explanation:
      "6. července 1415 byl v Kostnici upálen mistr Jan Hus — český kazatel a reformátor, který kritizoval nepravosti církve. Je považován za symbol pravdy a statečnosti. Proto je tento den státním svátkem.",
  },
  {
    question: "Kolik států sousedí s Českou republikou?",
    correctAnswer: "Čtyři státy",
    options: ["Čtyři státy", "Tři státy", "Pět států", "Dva státy"],
    hints: [
      "Přepočítej: na severu, na jihu, na východě a na západě.",
      "Jedna ze sousedních zemí byla dříve součástí Československa.",
    ],
    explanation:
      "Česká republika sousedí se čtyřmi státy: na západě s Německem, na jihu s Rakouskem, na východě se Slovenskem a na severu s Polskem. Se Slovenskem jsme tvořili jedno společné Československo až do roku 1993.",
  },
  {
    question: "Který stát sousedí s Českou republikou na jihu?",
    correctAnswer: "Rakousko",
    options: ["Rakousko", "Slovensko", "Polsko", "Maďarsko"],
    hints: [
      "Jde o stát, který byl dříve součástí Rakousko-Uherské říše.",
      "Hlavní město tohoto souseda je Vídeň.",
    ],
    explanation:
      "Na jihu sousedí Česká republika s Rakouskem. Hlavní město Rakouska je Vídeň. Obě země byly dlouho součástí habsburské monarchie a sdílejí dlouhou společnou historii.",
  },
  {
    question: "Který stát sousedí s Českou republikou na severu?",
    correctAnswer: "Polsko",
    options: ["Polsko", "Německo", "Slovensko", "Maďarsko"],
    hints: [
      "Severní soused je velká slovanská země.",
      "Hlavní město tohoto státu je Varšava.",
    ],
    explanation:
      "Na severu sousedí Česká republika s Polskem. Polsko je velký slovanský stát s hlavním městem Varšavou. Sdílíme s ním část Krkonošských hor a Jeseníků.",
  },
  {
    question: "Který stát sousedí s Českou republikou na východě?",
    correctAnswer: "Slovensko",
    options: ["Slovensko", "Maďarsko", "Polsko", "Ukrajina"],
    hints: [
      "Tento soused byl dříve součástí společného státu s Českou republikou.",
      "Rozdělili jsme se v roce 1993.",
    ],
    explanation:
      "Na východě sousedí Česká republika se Slovenskem. Česká republika a Slovensko tvořily jedno Československo až do 1. ledna 1993, kdy se mírumilovně rozdělily. Dodnes máme velmi blízké vztahy.",
  },
  {
    question: "Který stát sousedí s Českou republikou na západě?",
    correctAnswer: "Německo",
    options: ["Německo", "Francie", "Polsko", "Rakousko"],
    hints: [
      "Tento soused leží na západ od nás a je jednou z největších zemí v Evropě.",
      "Hlavní město tohoto státu je Berlín.",
    ],
    explanation:
      "Na západě sousedí Česká republika s Německem. Německo je jednou z největších a nejsilnějších zemí v Evropě. S Českou republikou sdílíme dlouhou hranici táhnoucí se přes hraniční hory jako Šumava nebo Krušné hory.",
  },
  {
    question: "Kdy byl přijat státní svátek 1. ledna?",
    correctAnswer: "Den obnovy samostatného českého státu — vznik ČR v roce 1993",
    options: [
      "Den obnovy samostatného českého státu — vznik ČR v roce 1993",
      "Vznik Československa v roce 1918",
      "Konec druhé světové války",
      "Vstup do Evropské unie v roce 2004",
    ],
    hints: [
      "1. leden je zároveň Nový rok, ale v Česku má i státní historický význam.",
      "Přesně 1. ledna 1993 přestalo existovat Československo a vznikla samostatná ČR.",
    ],
    explanation:
      "1. ledna je státní svátek ze dvou důvodů: je to Nový rok a zároveň Den obnovy samostatného českého státu. Právě 1. ledna 1993 vznikla samostatná Česká republika po mírovém rozdělení Československa.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const CRSYMBOLY: TopicMetadata[] = [
  {
    id: "g3-prvouka-misto-kde-zijeme-nase-vlast-ceska-republika-hlavni-mesto-statni-symboly",
    rvpNodeId:
      "g3-prvouka-misto-kde-zijeme-nase-vlast-ceska-republika-hlavni-mesto-statni-symboly",
    title: "Česká republika — státní symboly",
    studentTitle: "Česká republika",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Naše vlast",
    briefDescription:
      "Znáš státní symboly ČR a základní fakta o naší zemi.",
    illustrationDesc:
      "dítě drží v ruce malou českou vlajku a dívá se na mapu České republiky přišpendlenou na nástěnce, kolem jsou obrázky Pražského hradu a státního znaku",
    keywords: [
      "vlajka",
      "státní znak",
      "hymna",
      "Praha",
      "prezident",
      "parlament",
      "Poslanecká sněmovna",
      "Senát",
      "státní svátky",
      "sousední státy",
      "Německo",
      "Rakousko",
      "Slovensko",
      "Polsko",
      "28. října",
      "Kde domov můj",
    ],
    goals: [
      "Popsat barvy a prvky české vlajky.",
      "Vyjmenovat části velkého státního znaku.",
      "Uvést název státní hymny.",
      "Pojmenovat hlavní město a hlavu státu.",
      "Vysvětlit, co je parlament a jak se jmenují jeho komory.",
      "Vyjmenovat alespoň tři státní svátky a říct, co se v ten den slaví.",
      "Ukázat na mapě nebo vyjmenovat čtyři sousední státy ČR.",
    ],
    boundaries: [
      "Základní fakta přístupná žákům 3. třídy, bez podrobné ústavní teorie.",
      "Státní svátky jen ty v zadání, ne celý kalendář.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Vlajka: bílý pruh + červený pruh + modrý klín vlevo. Státní znak: lev (Čechy) + moravská orlice + slezská orlice. Hymna: Kde domov můj. Sousedé: Německo, Rakousko, Slovensko, Polsko.",
      steps: [
        "Vybav si barvy vlajky: bílá nahoře, červená dole, modrý klín vlevo.",
        "Státní znak má tři pole — lev a dvě orlice.",
        "Hymna začíná slovy: Kde domov můj.",
        "Parlament = Poslanecká sněmovna + Senát.",
        "Vznik ČSR = 28. října 1918.",
      ],
      commonMistake:
        "Záměna 5. července (Cyril a Metoděj) a 6. července (Jan Hus) — oba svátky jsou v červenci a jdou po sobě.",
      example:
        "Při zpěvu hymny na školní slavnosti žáci vstávají — je to projev úcty ke státnímu symbolu.",
    },
  },
];
