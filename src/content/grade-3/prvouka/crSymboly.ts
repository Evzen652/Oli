import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolovaná fakta (vlajka, znak, hymna, hlavní město,
//        hlava státu, komory parlamentu, svátky, počet sousedů)
//   L2 = aplikace: směr konkrétního souseda, přiřazení části znaku k zemi,
//        počty poslanců/senátorů zvlášť, autor slov/hudby hymny zvlášť,
//        hlavní město souseda → který stát
//   L3 = transfer (2 kroky): rozdíly let mezi historickými daty,
//        rozlišení blízkých dat (5.7. vs 6.7.), kombinace dvou faktů
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
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
    question: "Kolik komor má český parlament?",
    correctAnswer: "Dvě",
    options: ["Dvě", "Jednu", "Tři", "Čtyři"],
    hints: [
      "Komora je jedna část parlamentu — spočítej, kolik jich český parlament má.",
      "Jedna komora je Poslanecká sněmovna, druhá je Senát.",
    ],
    explanation:
      "Český parlament má dvě komory: Poslaneckou sněmovnu a Senát. Říkáme mu proto dvoukomorový parlament.",
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
      "Vznik Česko-Slovenské federace",
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
  {
    question: "V jakém roce vznikla píseň Kde domov můj?",
    correctAnswer: "V roce 1834",
    options: ["V roce 1834", "V roce 1918", "V roce 1848", "V roce 1793"],
    hints: [
      "Píseň vznikla v 19. století, dávno předtím, než se stala hymnou samostatného státu.",
      "Autoři byli Josef Kajetán Tyl a František Škroup.",
    ],
    explanation:
      "Píseň Kde domov můj vznikla v roce 1834 jako součást divadelní hry Josefa Kajetána Tyla, hudbu složil František Škroup. Státní hymnou samostatného Československa se stala až o desítky let později.",
  },
];

const POOL_L2: PracticeTask[] = [
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
    question:
      "Kterou historickou zemi ve státním znaku představuje bílý lev na červeném poli?",
    correctAnswer: "Čechy",
    options: ["Čechy", "Moravu", "Slezsko", "Slovensko"],
    hints: [
      "Lev je nejznámější část státního znaku — najdeš ho i na erbu Prahy.",
      "Toto pole zabírá ve znaku dvě ze čtyř částí.",
    ],
    explanation:
      "Bílý (stříbrný) lev na červeném poli představuje Čechy — historické jádro dnešní České republiky. Lev je i na mnoha městských znacích, například na znaku Prahy.",
  },
  {
    question:
      "Kterou historickou zemi ve státním znaku představuje stříbrno-červeně šachovaná orlice?",
    correctAnswer: "Moravu",
    options: ["Moravu", "Čechy", "Slezsko", "Rakousko"],
    hints: [
      "Tato orlice má na sobě šachovnicový vzor.",
      "Najdeš ji i na moravských vlajkách a znacích měst, jako je Brno.",
    ],
    explanation:
      "Stříbrno-červeně šachovaná orlice na modrém poli představuje Moravu. Tento vzor pochází z historického znaku Moravského markrabství.",
  },
  {
    question:
      "Kterou historickou zemi ve státním znaku představuje černá orlice se zlatou korunou?",
    correctAnswer: "Slezsko",
    options: ["Slezsko", "Moravu", "Čechy", "Polsko"],
    hints: [
      "Toto pole má zlatý podklad — jediné, které není červené nebo modré.",
      "Tato země leží na severovýchodě dnešní ČR a sousedí s Polskem.",
    ],
    explanation:
      "Černá orlice se zlatou korunkou na zlatém poli představuje Slezsko — nejmenší z historických zemí, jejichž spojení tvoří velký státní znak ČR.",
  },
  {
    question: "Kolik poslanců zasedá v Poslanecké sněmovně?",
    correctAnswer: "200 poslanců",
    options: ["200 poslanců", "81 poslanců", "150 poslanců", "300 poslanců"],
    hints: [
      "Je to kulaté číslo, které se snadno pamatuje.",
      "Senát má mnohem méně členů — 81.",
    ],
    explanation:
      "V Poslanecké sněmovně zasedá 200 poslanců. Je to dolní komora parlamentu a schvaluje zákony společně se Senátem.",
  },
  {
    question: "Kolik senátorů zasedá v Senátu?",
    correctAnswer: "81 senátorů",
    options: ["81 senátorů", "200 senátorů", "150 senátorů", "100 senátorů"],
    hints: [
      "Senát má mnohem méně členů než Poslanecká sněmovna.",
      "Je to liché číslo, které se nedá jednoduše zaokrouhlit.",
    ],
    explanation:
      "V Senátu zasedá 81 senátorů. Senát je horní komora parlamentu, senátoři jsou voleni na delší období než poslanci.",
  },
  {
    question: "Kdo napsal slova státní hymny Kde domov můj?",
    correctAnswer: "Josef Kajetán Tyl",
    options: [
      "Josef Kajetán Tyl",
      "František Škroup",
      "Bedřich Smetana",
      "Antonín Dvořák",
    ],
    hints: [
      "Byl to spisovatel a divadelník, autor slavné divadelní hry.",
      "Píseň pochází z jeho divadelní hry Fidlovačka.",
    ],
    explanation:
      "Slova hymny Kde domov můj napsal Josef Kajetán Tyl pro divadelní hru Fidlovačka aneb žádný hněv a žádná rvačka. Hudbu k nim složil František Škroup.",
  },
  {
    question: "Kdo složil hudbu státní hymny Kde domov můj?",
    correctAnswer: "František Škroup",
    options: [
      "František Škroup",
      "Josef Kajetán Tyl",
      "Bedřich Smetana",
      "Antonín Dvořák",
    ],
    hints: [
      "Byl to hudební skladatel, současník Josefa Kajetána Tyla.",
      "Slova k jeho melodii napsal spisovatel Tyl.",
    ],
    explanation:
      "Hudbu ke státní hymně Kde domov můj složil František Škroup, slova napsal Josef Kajetán Tyl. Píseň vznikla v roce 1834.",
  },
  {
    question: "Ve kterém sousedním státě leží hlavní město Vídeň?",
    correctAnswer: "Rakousko",
    options: ["Rakousko", "Německo", "Slovensko", "Polsko"],
    hints: [
      "Tento stát sousedí s ČR na jihu.",
      "Ve Vídni sídlí rakouská vláda a prezident.",
    ],
    explanation:
      "Hlavní město Vídeň leží v Rakousku, které sousedí s Českou republikou na jihu.",
  },
  {
    question: "Ve kterém sousedním státě leží hlavní město Berlín?",
    correctAnswer: "Německo",
    options: ["Německo", "Rakousko", "Polsko", "Slovensko"],
    hints: [
      "Tento stát sousedí s ČR na západě.",
      "Je to jedna z největších zemí Evropy.",
    ],
    explanation:
      "Hlavní město Berlín leží v Německu, které sousedí s Českou republikou na západě.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Kolik let uplynulo mezi vznikem Československa v roce 1918 a vznikem samostatné České republiky v roce 1993?",
    correctAnswer: pad(75, "ROK"),
    options: [pad(75, "ROK"), pad(74, "ROK"), pad(76, "ROK"), pad(85, "ROK")],
    hints: [
      "Odečti menší letopočet od většího: 1993 − 1918.",
      "Obě data jsou v našem letopočtu (n. l.), takže se prostě odečítají.",
    ],
    explanation:
      "Mezi vznikem Československa (1918) a vznikem samostatné České republiky (1993) uplynulo 1993 − 1918 = 75 let.",
  },
  {
    question:
      "Kolik let uplynulo od upálení mistra Jana Husa v roce 1415 do vzniku samostatné České republiky v roce 1993?",
    correctAnswer: pad(578, "ROK"),
    options: [pad(578, "ROK"), pad(577, "ROK"), pad(579, "ROK"), pad(588, "ROK")],
    hints: [
      "Odečti: 1993 − 1415.",
      "Obě data jsou v našem letopočtu, takže rozdíl spočítáš jednoduchým odečtením.",
    ],
    explanation:
      "Od upálení Jana Husa (1415) do vzniku samostatné České republiky (1993) uplynulo 1993 − 1415 = 578 let.",
  },
  {
    question:
      "Kolik let uplynulo od příchodu Cyrila a Metoděje na Velkou Moravu v roce 863 do vzniku samostatné České republiky v roce 1993?",
    correctAnswer: pad(1130, "ROK"),
    options: [pad(1130, "ROK"), pad(1129, "ROK"), pad(1131, "ROK"), pad(1140, "ROK")],
    hints: [
      "Odečti: 1993 − 863.",
      "Obě data jsou n. l. (náš letopočet), takže se prostě odečítají.",
    ],
    explanation:
      "Od příchodu Cyrila a Metoděje (863) do vzniku samostatné České republiky (1993) uplynulo 1993 − 863 = 1130 let.",
  },
  {
    question:
      "Kolik let uplynulo mezi vznikem Československa v roce 1918 a koncem druhé světové války v roce 1945?",
    correctAnswer: pad(27, "ROK"),
    options: [pad(27, "ROK"), pad(26, "ROK"), pad(28, "ROK"), pad(37, "ROK")],
    hints: [
      "Odečti: 1945 − 1918.",
      "Obě data jsou v našem letopočtu — spočítej rozdíl odečtením.",
    ],
    explanation:
      "Mezi vznikem Československa (1918) a koncem druhé světové války (1945) uplynulo 1945 − 1918 = 27 let.",
  },
  {
    question:
      "Kolik let uplynulo mezi koncem druhé světové války v roce 1945 a vznikem samostatné České republiky v roce 1993?",
    correctAnswer: pad(48, "ROK"),
    options: [pad(48, "ROK"), pad(47, "ROK"), pad(49, "ROK"), pad(58, "ROK")],
    hints: [
      "Odečti: 1993 − 1945.",
      "Obě data jsou n. l., stačí odečíst menší od většího.",
    ],
    explanation:
      "Mezi koncem druhé světové války (1945) a vznikem samostatné České republiky (1993) uplynulo 1993 − 1945 = 48 let.",
  },
  {
    question:
      "Kolik let uplynulo mezi příchodem Cyrila a Metoděje na Velkou Moravu (863) a upálením mistra Jana Husa (1415)?",
    correctAnswer: pad(552, "ROK"),
    options: [pad(552, "ROK"), pad(551, "ROK"), pad(553, "ROK"), pad(562, "ROK")],
    hints: [
      "Odečti: 1415 − 863.",
      "Obě data jsou n. l. — rozdíl spočítáš odečtením.",
    ],
    explanation:
      "Mezi příchodem Cyrila a Metoděje (863) a upálením Jana Husa (1415) uplynulo 1415 − 863 = 552 let.",
  },
  {
    question:
      "Kolik let uplynulo mezi příchodem Cyrila a Metoděje na Velkou Moravu (863) a vznikem Československa (1918)?",
    correctAnswer: pad(1055, "ROK"),
    options: [pad(1055, "ROK"), pad(1054, "ROK"), pad(1056, "ROK"), pad(1065, "ROK")],
    hints: [
      "Odečti: 1918 − 863.",
      "Obě data jsou n. l., takže se prostě odečítají.",
    ],
    explanation:
      "Mezi příchodem Cyrila a Metoděje (863) a vznikem Československa (1918) uplynulo 1918 − 863 = 1055 let.",
  },
  {
    question:
      "Který svátek je v kalendářním roce dřív — svátek Cyrila a Metoděje (5. července), nebo den upálení mistra Jana Husa (6. července)?",
    correctAnswer: "Svátek Cyrila a Metoděje (5. července)",
    options: [
      "Svátek Cyrila a Metoděje (5. července)",
      "Den upálení mistra Jana Husa (6. července)",
      "Oba svátky připadají na stejný den",
      "Nelze to určit",
    ],
    hints: [
      "Porovnej čísla dnů — 5. je před 6.",
      "Oba svátky jsou v červenci, jdou hned po sobě.",
    ],
    explanation:
      "Svátek Cyrila a Metoděje připadá na 5. července, den upálení mistra Jana Husa na 6. července. V kalendáři je tedy dřív svátek Cyrila a Metoděje.",
  },
  {
    question:
      "Co se stalo dřív — vznik Československa (28. října 1918), nebo konec druhé světové války (8. května 1945)?",
    correctAnswer: "Vznik Československa (28. října 1918)",
    options: [
      "Vznik Československa (28. října 1918)",
      "Konec druhé světové války (8. května 1945)",
      "Obě události se staly ve stejném roce",
      "Nelze to určit",
    ],
    hints: [
      "Porovnej letopočty — 1918 je menší číslo než 1945.",
      "Mezi oběma událostmi uplynulo 27 let.",
    ],
    explanation:
      "Vznik Československa (1918) předchází konci druhé světové války (1945) — mezi oběma událostmi uplynulo 27 let.",
  },
  {
    question:
      "Co bylo dřív — příchod Cyrila a Metoděje na Velkou Moravu (863 n. l.), nebo vznik Československa (1918)?",
    correctAnswer: "Příchod Cyrila a Metoděje (863 n. l.)",
    options: [
      "Příchod Cyrila a Metoděje (863 n. l.)",
      "Vznik Československa (1918)",
      "Obě události se staly ve stejném století",
      "Nelze to určit",
    ],
    hints: [
      "Porovnej letopočty — 863 je mnohem menší číslo než 1918.",
      "Mezi oběma událostmi uplynulo více než tisíc let.",
    ],
    explanation:
      "Příchod Cyrila a Metoděje (863 n. l.) je o více než tisíc let starší než vznik Československa (1918).",
  },
  {
    question:
      "Který sousední stát ČR byl s naší zemí až do roku 1993 součástí společného státu a zároveň leží na východě od České republiky?",
    correctAnswer: "Slovensko",
    options: ["Slovensko", "Rakousko", "Polsko", "Německo"],
    hints: [
      "Hledej souseda, který splňuje obě podmínky zároveň.",
      "Společný stát s ČR se rozdělil 1. ledna 1993.",
    ],
    explanation:
      "Slovensko je jediný soused, který zároveň leží na východě od ČR a byl s ní až do roku 1993 součástí společného Československa.",
  },
  {
    question:
      "Který sousední stát ČR leží na severu a zároveň má hlavní město Varšavu?",
    correctAnswer: "Polsko",
    options: ["Polsko", "Německo", "Rakousko", "Slovensko"],
    hints: [
      "Hledej souseda, který splňuje obě podmínky zároveň.",
      "Tento stát leží nad Krkonošemi a Jeseníky.",
    ],
    explanation:
      "Polsko je soused na severu ČR a jeho hlavním městem je Varšava — obě podmínky splňuje jen tento stát.",
  },
  {
    question:
      "Který sousední stát ČR leží na západě a zároveň má hlavní město Berlín?",
    correctAnswer: "Německo",
    options: ["Německo", "Rakousko", "Polsko", "Slovensko"],
    hints: [
      "Hledej souseda, který splňuje obě podmínky zároveň.",
      "Tento stát sdílí s ČR hranici táhnoucí se přes Šumavu a Krušné hory.",
    ],
    explanation:
      "Německo je soused na západě ČR a jeho hlavním městem je Berlín — obě podmínky splňuje jen tento stát.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
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
