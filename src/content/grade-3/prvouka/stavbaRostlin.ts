import type { TopicMetadata, PracticeTask } from "@/lib/types";

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
//   L1 = rozpoznání: pojmenovat část rostliny / barvivo a přiřadit jí
//        jednu základní vlastnost („která část dělá X", „kde je chlorofyl").
//   L2 = aplikace: vysvětlit funkci části nebo pojem (co dělá stonek, co je
//        fotosyntéza, opylení, klíčení, co list k fotosyntéze potřebuje).
//   L3 = transfer: dvoukrokové úvahy, důsledky a řetězce (cesta vody kořen→
//        stonek→list, co se stane bez světla / bez opylení, jak rostliny
//        pomáhají dýchat, šíření semen), rozlišení miskoncepcí.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Která část rostliny upevňuje rostlinu v půdě?",
    correctAnswer: "Kořen",
    options: ["Kořen", "Stonek", "List", "Květ"],
    emoji: "🌱",
    hints: [
      "Tato část je skrytá pod zemí.",
      "Bez ní by rostlinu vítr snadno vyvrátil.",
    ],
    explanation:
      "Kořen zarůstá hluboko do půdy a upevňuje rostlinu, aby ji vítr ani déšť nevyvrátily. Zároveň nasává vodu a minerální látky.",
  },
  {
    question: "Která část rostliny vyrábí potravu (cukr)?",
    correctAnswer: "List",
    options: ["Kořen", "List", "Stonek", "Plod"],
    emoji: "🍃",
    hints: [
      "Potrava vzniká fotosyntézou — vzpomeň si, kde v rostlině probíhá.",
      "Zelená barva prozrazuje, kde je barvivo pro výrobu cukru.",
    ],
    explanation:
      "Potravu (cukr) vyrábí list pomocí fotosyntézy. Chlorofyl v listu zachycuje světlo a přeměňuje vodu a oxid uhličitý na cukr, který rostlina využívá jako energii.",
  },
  {
    question: "Jak se jmenuje zelené barvivo v listech?",
    correctAnswer: "Chlorofyl",
    options: ["Fotosyntéza", "Kyslík", "Chlorofyl", "Pylník"],
    emoji: "🟢",
    hints: [
      "Je to název barviva, ne názvu děje ani plynu.",
      "Jeho název začíná na chloro a dává listům jejich barvu.",
    ],
    explanation:
      "Zelené barvivo v listech se jmenuje chlorofyl. Zachycuje sluneční světlo a umožňuje fotosyntézu — výrobu cukru pro rostlinu.",
  },
  {
    question: "Která část rostliny přijímá vodu z půdy?",
    correctAnswer: "Kořen",
    options: ["List", "Květ", "Plod", "Kořen"],
    emoji: "💧",
    hints: [
      "Voda je v půdě — která část tam sahá?",
      "Je to stejná část, která rostlinu drží v zemi.",
    ],
    explanation:
      "Kořen nasává z půdy vodu i minerální látky rozpuštěné ve vodě a předává je stonku, který je vede vzhůru do listů.",
  },
  {
    question: "Která část rostliny svou barvou a vůní přitahuje včely a motýly?",
    correctAnswer: "Květ",
    options: ["Květ", "Kořen", "Stonek", "Semeno"],
    emoji: "🌸",
    hints: [
      "Je to nejnápadnější, často barevná část rostliny.",
      "Včely tam létají pro sladkou šťávu a pyl.",
    ],
    explanation:
      "Květ láká svou barvou a vůní opylovače — včely, motýly a další hmyz. Ti při návštěvě přenášejí pyl, a tak umožní vznik semen.",
  },
  {
    question: "Ve které části rostliny probíhá fotosyntéza?",
    correctAnswer: "V listech",
    options: ["V kořeni", "V listech", "V květu", "V plodu"],
    emoji: "🍃",
    hints: [
      "Fotosyntéza potřebuje zelené barvivo — kde ho je nejvíc?",
      "Probíhá tam, kde se vyrábí cukr ze světla.",
    ],
    explanation:
      "Fotosyntéza probíhá hlavně v listech, protože právě v nich je nejvíc chlorofylu, který zachycuje sluneční světlo.",
  },
  {
    question: "Ze které části rostliny po opylení vznikají semena?",
    correctAnswer: "Z květu",
    options: ["Z kořene", "Z listu", "Z květu", "Ze stonku"],
    emoji: "🌷",
    hints: [
      "Semena vznikají tam, kde předtím sedal hmyz.",
      "Je to nápadná, často barevná část rostliny.",
    ],
    explanation:
      "Po opylení se z květu vytvoří semena a kolem nich vyroste plod. Bez květu by rostlina semena neměla.",
  },
  {
    question: "Která část rostliny chrání semena?",
    correctAnswer: "Plod",
    options: ["Kořen", "List", "Stonek", "Plod"],
    emoji: "🍎",
    hints: [
      "Jablko nebo šípek — jak se takové části říká?",
      "Semena jsou schovaná uvnitř této části.",
    ],
    explanation:
      "Plod (například jablko nebo šípek) obaluje a chrání semena. Zároveň pomáhá jejich šíření, když ho snědí zvířata.",
  },
  {
    question: "Kde jsou uložena semena rostliny?",
    correctAnswer: "V plodu",
    options: ["V plodu", "V kořeni", "V listu", "Ve stonku"],
    emoji: "🍅",
    hints: [
      "Rozkroj jablko nebo rajče — co najdeš uvnitř?",
      "Je to dužnatá část, která semena chrání.",
    ],
    explanation:
      "Semena jsou uložena uvnitř plodu, který je chrání. Když plod dozraje, semena se z něj mohou uvolnit a vyklíčit.",
  },
  {
    question: "Jakou barvu mají zdravé listy díky chlorofylu?",
    correctAnswer: "Zelenou",
    options: ["Červenou", "Zelenou", "Modrou", "Hnědou"],
    emoji: "🌿",
    hints: [
      "Podívej se na trávu nebo listy stromů v létě.",
      "Barvu určuje zelené barvivo v listech.",
    ],
    explanation:
      "Zdravé listy jsou zelené díky chlorofylu. Když chlorofyl ubývá (na podzim nebo bez světla), list žloutne a hnědne.",
  },
  {
    question: "Která část rostliny nese listy, květy a plody a drží je nahoře?",
    correctAnswer: "Stonek",
    options: ["Kořen", "Semeno", "Stonek", "Chlorofyl"],
    emoji: "🌾",
    hints: [
      "U stromu se této části říká kmen.",
      "Spojuje kořen dole s listy a květy nahoře.",
    ],
    explanation:
      "Stonek (u stromů kmen) drží rostlinu vzpřímenou a nese listy, květy i plody. Zároveň jimi proudí voda z kořene do listů.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jaká je hlavní funkce kořene?",
    correctAnswer: "Přijímat vodu a minerální látky z půdy a upevňovat rostlinu",
    options: ["Vyrábět cukr pomocí slunečního světla", "Přitahovat hmyz k opylení", "Chránit semena před poškozením", "Přijímat vodu a minerální látky z půdy a upevňovat rostlinu"],
    emoji: "🌱",
    hints: [
      "Kořen roste pod zemí — co odtud může brát a k čemu rostlinu drží?",
      "Cukr ze světla vyrábí jiná část — kořen má dva jiné úkoly.",
    ],
    explanation:
      "Kořen plní dvě důležité funkce: upevňuje rostlinu v půdě, aby nespadla, a nasává z půdy vodu spolu s minerálními látkami, které rostlina potřebuje k životu.",
  },
  {
    question: "Co dělá stonek (nebo kmen u stromu)?",
    correctAnswer: "Vede vodu a živiny z kořene do listů a nese listy a květy",
    options: [
      "Vede vodu a živiny z kořene do listů a nese listy a květy",
      "Vyrábí kyslík a vydává ho do vzduchu",
      "Přijímá vodu přímo z deště",
      "Chrání semena uvnitř plodu",
    ],
    emoji: "🌾",
    hints: [
      "Stonek je jako trubka — přemýšlej, co jí musí protékat vzhůru.",
      "Spojuje kořen dole s listy nahoře.",
    ],
    explanation:
      "Stonek (u stromů kmen) slouží jako dopravní cesta. Vede vodu a minerální látky z kořene do listů a zároveň nese listy, květy a plody.",
  },
  {
    question: "Proč jsou listy zelené?",
    correctAnswer: "Protože obsahují chlorofyl — zelené barvivo potřebné k fotosyntéze",
    options: ["Protože přijímají vodu, která je zelená", "Protože obsahují chlorofyl — zelené barvivo potřebné k fotosyntéze", "Protože na nich sedá zelený hmyz", "Protože jsou blíž slunci než kořen"],
    emoji: "🍃",
    hints: [
      "Barvu způsobuje látka uvnitř listu, ne voda ani hmyz.",
      "Tato látka umí zachytit sluneční světlo.",
    ],
    explanation:
      "Listy jsou zelené díky chlorofylu. Tato látka zachycuje sluneční světlo a umožňuje fotosyntézu — výrobu cukru ze světla, vody a oxidu uhličitého.",
  },
  {
    question: "Co je fotosyntéza?",
    correctAnswer: "Výroba cukru v listu ze světla, vody a oxidu uhličitého",
    options: ["Přijímání vody kořenem z půdy", "Rozkvétání květu na jaře", "Výroba cukru v listu ze světla, vody a oxidu uhličitého", "Klíčení semene po zasazení do půdy"],
    emoji: "☀️",
    hints: [
      "Foto = světlo. Co rostlina se světlem v listu vytvoří?",
      "Není to přijímání vody ani kvetení — je to výroba potravy.",
    ],
    explanation:
      "Fotosyntéza je proces, při kterém list pomocí chlorofylu přeměňuje sluneční světlo, vodu a oxid uhličitý na cukr jako potravu. Jako vedlejší produkt vzniká kyslík, který dýcháme.",
  },
  {
    question: "K čemu slouží květ rostliny?",
    correctAnswer: "Přitahuje opylovače (hmyz) a po opylení vznikají semena",
    options: ["Přijímá dešťovou vodu pro rostlinu", "Vyrábí kyslík místo listů", "Upevňuje rostlinu pevně v půdě", "Přitahuje opylovače (hmyz) a po opylení vznikají semena"],
    emoji: "🌸",
    hints: [
      "Přemýšlej, proč jsou květy barevné a voní.",
      "Co se v květu vytvoří poté, co ho navštíví včela?",
    ],
    explanation:
      "Květ láká opylovače — včely, motýly a další hmyz — svou barvou a vůní. Hmyz přenese pyl z jednoho květu na druhý (opylení) a pak může vzniknout semeno.",
  },
  {
    question: "Co je opylení?",
    correctAnswer: "Přenos pylu z jednoho květu na druhý, po němž vznikají semena",
    options: ["Přenos pylu z jednoho květu na druhý, po němž vznikají semena", "Rozkvétání rostliny během jara", "Klíčení semene ve vlhké půdě", "Odkvétání a opadávání okvětních lístků"],
    emoji: "🐝",
    hints: [
      "Pyl je žlutý prášek na tyčinkách — přemýšlej, co se s ním musí stát.",
      "Není to samotné kvetení ani klíčení — jde o přenos.",
    ],
    explanation:
      "Opylení nastane, když hmyz nebo vítr přenese pyl z tyčinek jednoho květu na pestík druhého. Po opylení může květ vytvořit semeno a kolem semene se vytvoří plod.",
  },
  {
    question: "Jaká je funkce plodu?",
    correctAnswer: "Chrání semena a pomáhá jejich šíření (ptáky, zvířaty, větrem)",
    options: ["Přijímá vodu z půdy pro celou rostlinu", "Chrání semena a pomáhá jejich šíření (ptáky, zvířaty, větrem)", "Vyrábí potravu pro kořen", "Přitahuje hmyz k opylení"],
    emoji: "🍎",
    hints: [
      "Co je uvnitř jablka, třešně nebo šípku a co je obaluje?",
      "Přemýšlej, proč zvířata plody jedí a odnášejí jinam.",
    ],
    explanation:
      "Plod chrání semena a pomáhá jejich šíření. Zvířata sní dužnatý plod a semena vyloučí jinde. Jiné plody se šíří větrem (javor) nebo se chytají na srst zvířat.",
  },
  {
    question: "Kde rostlina přijímá minerální látky?",
    correctAnswer: "Z půdy pomocí kořene",
    options: ["Ze vzduchu pomocí listů", "Ze světla pomocí chlorofylu", "Z půdy pomocí kořene", "Z plodů jiných rostlin"],
    emoji: "🪨",
    hints: [
      "Minerální látky jsou rozpuštěné v půdní vodě.",
      "Která část rostliny sahá do půdy a nasává vodu?",
    ],
    explanation:
      "Minerální látky (živiny) jsou rozpuštěné v půdní vodě. Kořen je nasává spolu s vodou a stonek je dopravuje do listů, kde se využívají při fotosyntéze a růstu.",
  },
  {
    question: "Co list nutně potřebuje, aby mohl dělat fotosyntézu?",
    correctAnswer: "Světlo, vodu a oxid uhličitý",
    options: ["Tmu a chladno", "Jen vodu z deště", "Jen půdu bez světla", "Světlo, vodu a oxid uhličitý"],
    emoji: "☀️",
    hints: [
      "Vzpomeň si, co dává do fotosyntézy slunce, kořen a vzduch.",
      "Ve tmě by fotosyntéza fungovat nemohla.",
    ],
    explanation:
      "Fotosyntéza potřebuje tři vstupy: světlo (ze slunce), vodu (od kořene) a oxid uhličitý (ze vzduchu). Z nich list vyrobí cukr a uvolní kyslík.",
  },
  {
    question: "Co je klíčení semene?",
    correctAnswer: "Probuzení zárodku v semeni, ze kterého začne růst nová rostlina",
    options: ["Probuzení zárodku v semeni, ze kterého začne růst nová rostlina", "Přenos pylu mezi dvěma květy", "Výroba cukru v zelených listech rostliny", "Opadávání listů během podzimu"],
    emoji: "🌱",
    hints: [
      "Co se děje se semínkem fazole, které zaseješ a zaléváš?",
      "Není to opylení ani fotosyntéza — jde o začátek růstu rostliny.",
    ],
    explanation:
      "Klíčení je probuzení zárodku uvnitř semene. Když semeno dostane vodu a teplo, začne z něj růst kořínek a první lístky — vzniká nová rostlina.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co se stane s rostlinou, když dlouho nemá dost světla?",
    correctAnswer: "Nemůže dělat fotosyntézu, žloutne a chřadne",
    options: ["Roste rychleji, protože šetří energii", "Nemůže dělat fotosyntézu, žloutne a chřadne", "Přestane přijímat vodu kořenem", "Přestane kvést, ale jinak je v pořádku"],
    emoji: "🥀",
    hints: [
      "Světlo je jeden ze tří vstupů fotosyntézy — co se stane, když chybí?",
      "Bez výroby cukru rostlina nemá potravu.",
    ],
    explanation:
      "Bez dostatku světla nemůže list dělat fotosyntézu a rostlina nemá potravu. Chlorofyl se rozkládá, list žloutne, rostlina slábne a nakonec uhyne.",
  },
  {
    question: "Zaseješ fazoli a zaléváš ji v teple. Co se se semenem stane nejdřív?",
    correctAnswer: "Vyklíčí — zárodek se probudí a vyroste kořínek a lístky",
    options: ["Rovnou se z něj stane květ", "Okamžitě vytvoří plod se semeny", "Vyklíčí — zárodek se probudí a vyroste kořínek a lístky", "Rozpustí se ve vodě a zmizí"],
    emoji: "🌱",
    hints: [
      "Semeno vypadá neživě, ale uvnitř je zárodek, který čeká na vodu a teplo.",
      "Nová rostlina musí nejdřív vyrůst — teprve mnohem později kvete a plodí.",
    ],
    explanation:
      "Semeno obsahuje zárodek. Když dostane vodu a teplo, vyklíčí — nejdřív vyroste kořínek a první lístky. Kvetení a plody přijdou až mnohem později, když rostlina vyroste.",
  },
  {
    question: "Jak se dostane voda z půdy až do listů na vrcholku rostliny?",
    correctAnswer: "Kořen ji nasaje z půdy a stonek ji vede vzhůru do listů",
    options: ["List ji nasaje přímo ze vzduchu", "Květ ji nasbírá z deště a pošle dolů", "Plod ji vyrobí a rozvede po rostlině", "Kořen ji nasaje z půdy a stonek ji vede vzhůru do listů"],
    emoji: "💧",
    hints: [
      "Jde o spolupráci dvou částí — jedna vodu bere, druhá ji dopraví nahoru.",
      "Voda putuje odspodu (z půdy) nahoru (k listům).",
    ],
    explanation:
      "Voda putuje zdola nahoru: kořen ji nasaje z půdy i s minerálními látkami a stonek ji jako trubka vede vzhůru až do listů, kde se využije při fotosyntéze.",
  },
  {
    question: "Proč rostliny pomáhají lidem a zvířatům dýchat?",
    correctAnswer: "Při fotosyntéze uvolňují do vzduchu kyslík, který dýcháme",
    options: [
      "Při fotosyntéze uvolňují do vzduchu kyslík, který dýcháme",
      "Protože spotřebují všechen kyslík ze vzduchu",
      "Protože z půdy vyrábějí vodu k pití",
      "Protože přitahují hmyz, který čistí vzduch",
    ],
    emoji: "🌬️",
    hints: [
      "Vzpomeň si, jaký plyn rostlina uvolňuje do vzduchu, když na světle vyrábí cukr.",
      "Ten plyn potřebujeme při každém nádechu.",
    ],
    explanation:
      "Při fotosyntéze rostlina vyrábí cukr a jako vedlejší produkt uvolňuje kyslík. Právě ten kyslík lidé i zvířata potřebují k dýchání.",
  },
  {
    question: "Co by se stalo, kdyby květy žádné rostliny nikdo neopyloval?",
    correctAnswer: "Nevznikla by semena ani plody",
    options: ["Rostliny by rostly rychleji", "Nevznikla by semena ani plody", "Kořeny by přestaly nasávat vodu", "Listy by přestaly být zelené"],
    emoji: "🐝",
    hints: [
      "Přemýšlej, k čemu opylení vede — co po něm v květu vzniká.",
      "Bez tohoto kroku by chyběl další článek: semena a plody.",
    ],
    explanation:
      "Bez opylení by z květů nevznikla semena a bez semen ani plody. Proto jsou opylovači jako včely tak důležití pro rostliny i pro naši úrodu.",
  },
  {
    question: "Semeno javoru má křidélka. K čemu rostlině pomáhají?",
    correctAnswer: "Aby ho vítr odnesl dál od mateřské rostliny",
    options: ["Aby přitáhla včely k opylení", "Aby vyráběla cukr místo listů", "Aby ho vítr odnesl dál od mateřské rostliny", "Aby nasávala vodu ze vzduchu"],
    emoji: "🍁",
    hints: [
      "Křidélka roztočí vítr — kam tím semeno posune?",
      "Proč je pro rostlinu dobré, aby semeno nespadlo hned pod ni?",
    ],
    explanation:
      "Křidélka umožní, aby javorové semeno odnesl vítr daleko od mateřského stromu. Dál od stínu a kořenů rodičovské rostliny má nová rostlinka víc světla i místa k růstu.",
  },
  {
    question: "Která věta je správná?",
    correctAnswer: "Cukr vyrábí list, kořen přijímá vodu z půdy",
    options: ["Cukr vyrábí kořen, list přijímá vodu z půdy", "Cukr i vodu vyrábí květ", "Cukr vyrábí plod, list nasává vodu ze vzduchu", "Cukr vyrábí list, kořen přijímá vodu z půdy"],
    emoji: "🧠",
    hints: [
      "Vzpomeň si, kde je chlorofyl a která část sahá do půdy.",
      "Nepleť si úkoly kořene a listu — každý dělá něco jiného.",
    ],
    explanation:
      "Cukr vyrábí list fotosyntézou (má chlorofyl a je na světle). Kořen cukr nevyrábí — ten přijímá z půdy vodu a minerální látky. Časté je právě zaměnit úkoly kořene a listu.",
  },
  {
    question: "Proč zvířata pomáhají rostlinám, když snědí jejich plody?",
    correctAnswer: "Semena vyloučí na jiném místě, kde mohou vyklíčit",
    options: [
      "Semena vyloučí na jiném místě, kde mohou vyklíčit",
      "Ničí tím semena, aby rostlin nebylo moc",
      "Přenášejí tím pyl mezi květy",
      "Dodávají rostlině světlo k fotosyntéze",
    ],
    emoji: "🦔",
    hints: [
      "Co se stane se semeny uvnitř plodu, který zvíře sní?",
      "Zvíře se pohybuje — kam semena odnese?",
    ],
    explanation:
      "Zvíře sní dužnatý plod i se semeny, přejde jinam a semena vyloučí na novém místě. Tam mohou vyklíčit dál od mateřské rostliny — plod tak pomáhá šíření semen.",
  },
  {
    question: "Rostlina na okně se naklání listy ke sklu. Proč to dělá?",
    correctAnswer: "Roste za světlem, které potřebuje k fotosyntéze",
    options: ["Utíká před vodou, které má moc", "Roste za světlem, které potřebuje k fotosyntéze", "Hledá u okna víc oxidu uhličitého k pití", "Snaží se dostat blíž ke kořenu"],
    emoji: "🪟",
    hints: [
      "Co u okna rostlina získá víc než v rohu místnosti?",
      "Přemýšlej, který vstup fotosyntézy přichází právě od okna.",
    ],
    explanation:
      "Rostlina roste za světlem, protože ho potřebuje k fotosyntéze. Proto se listy natáčejí k oknu, kde je světla nejvíc.",
  },
  {
    question: "V jakém pořadí jdou za sebou děje v životě rostliny?",
    correctAnswer: "Klíčení → růst → kvetení → opylení → vznik plodu se semeny",
    options: ["Kvetení → klíčení → opylení → růst → plod", "Opylení → klíčení → plod → kvetení → růst", "Klíčení → růst → kvetení → opylení → vznik plodu se semeny", "Plod → semeno → kvetení → klíčení → růst"],
    emoji: "🔄",
    hints: [
      "Začni tím, co dělá zaseté semínko, a skonči novými semeny.",
      "Semena mohou vzniknout až po tom, co květ někdo opylí.",
    ],
    explanation:
      "Rostlina nejdřív ze semene vyklíčí, vyroste, pak vykvete. Květ se opylí a teprve potom vznikne plod s novými semeny — a celý koloběh může začít znovu.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const STAVBAROSTLIN: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-rostliny-a-zivocichove-stavba-rostlin-koren-stonek-list-kvet-plod",
    title: "Stavba rostlin",
    studentTitle: "Části rostliny",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Rostliny a živočichové",
    briefDescription: "Znáš části rostliny a jejich funkce.",
    illustrationDesc:
      "velká kvetoucí rostlina s kořenem, stonkem, listy, květem a plodem — každá část je vidět, vedle stojí dítě s prstem namířeným na květ",
    keywords: [
      "kořen",
      "stonek",
      "kmen",
      "list",
      "květ",
      "plod",
      "semeno",
      "chlorofyl",
      "fotosyntéza",
      "opylení",
      "klíčení",
      "části rostliny",
      "stavba rostliny",
      "kyslík",
      "minerální látky",
    ],
    goals: [
      "Pojmenovat základní části rostliny: kořen, stonek, list, květ, plod, semeno.",
      "Vysvětlit funkci každé části rostliny.",
      "Popsat fotosyntézu jako výrobu cukru ze světla, vody a CO₂.",
      "Vysvětlit, co je opylení a proč je důležité.",
      "Popsat klíčení semene.",
    ],
    boundaries: [
      "Základní pojmy pro 3. třídu — bez buněčné biologie ani chemických rovnic.",
      "Fotosyntéza jen jako jednoduchá představa (světlo + voda + CO₂ → cukr + kyslík), bez stechiometrie.",
      "Opylení jen základně — bez podrobné botanické anatomie.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Rostlina má 6 hlavních částí: kořen (přijímá vodu z půdy), stonek (vede vodu nahoru), list (vyrábí potravu fotosyntézou), květ (opylení → semena), plod (chrání semena), semeno (klíčení).",
      steps: [
        "Kořen — pod zemí, nasává vodu a minerální látky, upevňuje rostlinu.",
        "Stonek — vede vodu a živiny z kořene do listů.",
        "List — zelený díky chlorofylu, dělá fotosyntézu (světlo + voda + CO₂ → cukr + kyslík).",
        "Květ — přitahuje hmyz, po opylení vznikají semena.",
        "Plod — chrání semena a pomáhá jejich šíření.",
        "Semeno — zárodek nové rostliny, klíčí, když dostane vodu a teplo.",
      ],
      commonMistake:
        "Záměna: fotosyntéza probíhá v LISTECH (ne v kořeni). Kořen přijímá vodu, ale nevyrábí cukr. Chlorofyl je v listech, ne v plodech.",
      example:
        "Jabloň: kořen nasaje vodu → stonek ji dovede do listů → listy fotosyntézou vyrobí cukr → květ přitáhne včelu → opylení → vznikne jablko (plod) se semeny uvnitř.",
    },
  },
];
