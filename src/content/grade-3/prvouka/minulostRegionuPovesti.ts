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
    question: "Co je pověst?",
    correctAnswer: "Příběh z minulosti smíchaný s historií a fantazií",
    options: [
      "Příběh z minulosti smíchaný s historií a fantazií",
      "Pravdivá zpráva o historické události",
      "Báseň o hrdinech",
      "Novinový článek o dávné době",
    ],
    hints: [
      "Pověst není ani pohádka, ani přesná historická zpráva — je to něco mezi.",
      "Pověst má základ v historii, ale přidává nadpřirozené nebo zveličené prvky.",
    ],
    explanation:
      "Pověst je příběh, který má základ v historické skutečnosti, ale je smíchaný s fantazií a doplněný o zázračné nebo nadpřirozené události. Nejedná se o přesný historický záznam.",
  },
  {
    question: "Kdo byla Libuše podle pověsti?",
    correctAnswer: "Česká kněžna a věštkyně, zakladatelka Prahy",
    options: [
      "Česká kněžna a věštkyně, zakladatelka Prahy",
      "Dcera Krakonoše ze Sudet",
      "Česká učitelka, která psala kroniky",
      "Selka z Moravy, která vynikala v zemědělství",
    ],
    hints: [
      "Libuše byla dcera knížete Kroka a měla dar věštění.",
      "Podle pověsti zahlédla místo, kde vyrostl slavný hrad.",
    ],
    explanation:
      "Libuše byla podle pověsti česká kněžna s darem věštění. Prorokovala vznik velkého města — Prahy — a vybrala si za manžela prostého oráče Přemysla.",
  },
  {
    question: "Kdo byl Přemysl Oráč podle pověsti?",
    correctAnswer: "Prostý rolník, kterého si Libuše vybrala za muže a zakladatel rodu Přemyslovců",
    options: [
      "Prostý rolník, kterého si Libuše vybrala za muže a zakladatel rodu Přemyslovců",
      "Rytíř, který porazil draka a stal se knížetem",
      "Syn Krakonoše, vládce Krkonoš",
      "Kupec z Bavorska, který přišel do Čech",
    ],
    hints: [
      "Přemysl přišel z pole — oral půdu, když pro něj přijeli Libušini poslové.",
      "Z Přemysla a Libuše vznikl slavný vládnoucí rod.",
    ],
    explanation:
      "Přemysl byl prostý oráč z Stadiče. Libuše ho nechala přivézt ke svému dvoru a vzala si ho za muže. Společně se stali zakladateli rodu Přemyslovců, který vládl Čechám po staletí.",
  },
  {
    question: "Jak se jmenuje rod, který podle pověsti založili Libuše a Přemysl?",
    correctAnswer: "Přemyslovci",
    options: ["Přemyslovci", "Lucemburkové", "Habsburkové", "Slavníkovci"],
    hints: [
      "Název rodu vychází ze jména Přemysl.",
      "Tento rod vládl Čechám od pradávna až do roku 1306.",
    ],
    explanation:
      "Libuše a Přemysl Oráč jsou považováni za zakladatele rodu Přemyslovců. Tento rod vládl českému knížectví a království po několik staletí.",
  },
  {
    question: "Kde podle pověsti spí Blaničtí rytíři?",
    correctAnswer: "V hoře Blaník ve středních Čechách",
    options: [
      "V hoře Blaník ve středních Čechách",
      "Pod Vyšehradem v Praze",
      "V jeskyních Moravského krasu",
      "Pod hradem Karlštejn",
    ],
    hints: [
      "Blaničtí rytíři jsou spojeni s horou, která nese jejich jméno.",
      "Tato hora se nachází v Posázaví.",
    ],
    explanation:
      "Podle pověsti spí Blaničtí rytíři v nitru hory Blaník. Jsou připraveni probudit se a přijít na pomoc českému národu v době největší nouze.",
  },
  {
    question: "Kdy podle pověsti vyjdou Blaničtí rytíři z hory?",
    correctAnswer: "Když bude Česká země v největší nouzi a nebezpečí",
    options: [
      "Když bude Česká země v největší nouzi a nebezpečí",
      "Každý rok na Vánoce",
      "Jakmile se probudí Krakonoš",
      "Na příkaz českého krále",
    ],
    hints: [
      "Rytíři spí a čekají na okamžik, kdy budou opravdu zapotřebí.",
      "Jejich probuzení je spojeno s obranou vlasti.",
    ],
    explanation:
      "Pověst říká, že Blaničtí rytíři čekají hluboko v hoře a probudí se jedině tehdy, když bude Čechám hrozit největší nebezpečí. Přijedou na pomoc a zachrání zemi.",
  },
  {
    question: "Kdo je Krakonoš?",
    correctAnswer: "Duch hor, vládce Krkonoš",
    options: [
      "Duch hor, vládce Krkonoš",
      "Český král ze středověku",
      "Blanický rytíř, který se probudil",
      "Syn Přemysla Oráče",
    ],
    hints: [
      "Krakonoš patří k nejvyššímu pohoří v Čechách.",
      "Ovládá počasí a přírodu v horách.",
    ],
    explanation:
      "Krakonoš je podle pověstí mohutný duch hor, který vládne Krkonoším. Může být laskavý k pocestným a chudým lidem, ale potrestá ty, kteří jsou pyšní nebo ničí přírodu.",
  },
  {
    question: "Kde Krakonoš podle pověstí žije a vládne?",
    correctAnswer: "V Krkonoších",
    options: ["V Krkonoších", "V Šumavě", "V Tatrách", "Na Blaníku"],
    hints: [
      "Název hory je skryt v jeho jménu.",
      "Krkonoše jsou nejvyšší pohoří v Čechách.",
    ],
    explanation:
      "Krakonoš je duch a vládce Krkonoš — nejvyššího pohoří v České republice. Proto se mu také říká Pán hor nebo Duch Krkonoš.",
  },
  {
    question: "Kde můžeme nejlépe zjistit, jak vypadalo naše město nebo vesnice v minulosti?",
    correctAnswer: "V místním muzeu nebo archivu",
    options: [
      "V místním muzeu nebo archivu",
      "V televizním zpravodajství",
      "Na internetovém nákupním portálu",
      "Ve školní jídelně",
    ],
    hints: [
      "Hledáme místo, kde se uchovávají staré věci a dokumenty.",
      "Jedno z těchto míst má staré mapy, fotografie a předměty.",
    ],
    explanation:
      "Muzeum uchovává staré předměty, fotografie a modely, které ukazují, jak místo vypadalo dříve. Archiv má staré dokumenty, mapy a listiny. Obě místa jsou klíčové zdroje informací o místní historii.",
  },
  {
    question: "Co je kronika?",
    correctAnswer: "Kniha, do které se zapisovaly důležité události v pořadí, jak šly za sebou",
    options: [
      "Kniha, do které se zapisovaly důležité události v pořadí, jak šly za sebou",
      "Sborník pohádek a pověstí",
      "Mapa starého města",
      "Jídelní lístek ze středověku",
    ],
    hints: [
      "Kronika zaznamenávala historii — co se stalo, kdy a kde.",
      "Kroniky psali kronikáři, například ve vesnicích nebo klášterech.",
    ],
    explanation:
      "Kronika je historický záznam, kde kronikář zapisoval události v časovém pořadí — co se kdy stalo v obci, zemi nebo klášteře. Je to cenný historický pramen.",
  },
  {
    question: "Jak se nazývá člověk, který zapisoval historii do kroniky?",
    correctAnswer: "Kronikář",
    options: ["Kronikář", "Archivář", "Muzejník", "Průvodce"],
    hints: [
      "Slovo je odvozeno od slova kronika.",
      "Tento člověk psal a uchovával záznamy o událostech.",
    ],
    explanation:
      "Kronikář byl člověk, jehož úkolem bylo zapisovat důležité události do kroniky. Ve středověku to bývali mniši, později se kronikáři vyskytovali i ve vesnicích a městech.",
  },
  {
    question: "Co se dozvíme z historických pramenů?",
    correctAnswer: "Jak lidé žili, co se dělo a jak vypadalo místo v minulosti",
    options: [
      "Jak lidé žili, co se dělo a jak vypadalo místo v minulosti",
      "Jaké počasí bude příští týden",
      "Co si koupíme v obchodě",
      "Jak se vaří dnešní jídla",
    ],
    hints: [
      "Historické prameny jsou staré záznamy, předměty a fotografie.",
      "Díky nim se přenášíme zpátky do minulosti.",
    ],
    explanation:
      "Historické prameny — jako kroniky, listiny, fotografie, předměty v muzeu nebo vyprávění starých lidí — nám říkají, jak lidé v minulosti žili, co zažívali a jak se měnilo jejich okolí.",
  },
  {
    question: "Kdo je pro nás živým historickým pramenem o místní minulosti?",
    correctAnswer: "Starší lidé, kteří si pamatují, jak to tady bývalo",
    options: [
      "Starší lidé, kteří si pamatují, jak to tady bývalo",
      "Malé děti ve školce",
      "Pracovníci supermarketu",
      "Řidiči autobusů",
    ],
    hints: [
      "Přímý svědek události je nejcennější zdroj — byl u toho.",
      "Starší lidé mohou vyprávět o věcech, které sami zažili.",
    ],
    explanation:
      "Starší lidé jsou živými historickými prameny — mohou nám přímo vyprávět, jak to v obci nebo městě vypadalo, co se změnilo a jak se žilo dříve. Jejich vzpomínky jsou nenahraditelné.",
  },
  {
    question: "Proč navštěvujeme hrady a zámky?",
    correctAnswer: "Protože jsou to historické stavby, které nám ukazují minulost",
    options: [
      "Protože jsou to historické stavby, které nám ukazují minulost",
      "Protože tam prodávají nejlevnější jídlo",
      "Protože tam trénují hasiči",
      "Protože jsou to nové sportovní haly",
    ],
    hints: [
      "Hrady byly stavěny před stovkami let pro ochranu a bydlení šlechty.",
      "Navštívením hradu se dotkneme skutečné minulosti.",
    ],
    explanation:
      "Hrady a zámky jsou historické stavby ze středověku nebo novověku. Navštěvujeme je, protože nám ukazují, jak žili lidé v minulosti — jak vypadaly jejich domovy, jak se bránili nepřátelům.",
  },
  {
    question: "Jak se liší pověst od pohádky?",
    correctAnswer: "Pověst je vázána na skutečné místo nebo postavu z history, pohádka ne",
    options: [
      "Pověst je vázána na skutečné místo nebo postavu z history, pohádka ne",
      "Pohádka je vždy delší než pověst",
      "Pověst se vždy šťastně končí",
      "Pohádka nemá žádné postavy",
    ],
    hints: [
      "Přemysl Oráč byl skutečný historický rod, pohádkový princ je vymyšlený.",
      "Pověst se váže ke konkrétní hoře, hradu nebo městu.",
    ],
    explanation:
      "Pověst je spojena s konkrétním místem (hora Blaník, Vyšehrad) nebo historickou postavou (Libuše, Přemysl). Pohádka je zcela vymyšlená bez vazby na skutečná místa nebo osoby.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const MINULOSTREGIONUPOVESTI: TopicMetadata[] = [
  {
    id: "g3-prvouka-lide-a-cas-minulost-a-soucasnost-minulost-naseho-regionu-povesti",
    title: "Minulost našeho regionu, pověsti",
    studentTitle: "Historie a pověsti",
    subject: "prvouka",
    category: "Lidé a čas",
    topic: "Minulost a současnost",
    briefDescription: "Poznáš historii svého regionu a nejznámější české pověsti.",
    keywords: ["pověsti", "region", "minulost", "Libuše", "Přemysl", "Krakonoš", "Blaník"],
    goals: [
      "Porozumět pojmu pověst a odlišit ho od pohádky a historického faktu.",
      "Vědět, kde a jak se dozvídáme o minulosti svého regionu (muzeum, archiv, kronika, starší lidé).",
      "Znát nejznámější české pověsti — o Libuši a Přemyslu Oráči, Blanických rytířích a Krakonošovi.",
    ],
    boundaries: ["Detailní historické datování a letopočty nejsou součástí obsahu pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Pověst = příběh z minulosti smíchaný s historií a fantazií. Libuše = kněžna, Přemysl = oráč. Blaničtí rytíři spí v hoře. Krakonoš vládne Krkonoším.",
      steps: [
        "Vzpomeň si, co víš o dané pověsti nebo historickém prameni.",
        "Pověst má vždy základ v historii, ale je doplněna fantazií.",
        "Historické prameny: muzeum, archiv, kronika, starší lidé.",
        "Libuše a Přemysl = zakladatelé Přemyslovců. Blaničtí rytíři = spí v Blaníku. Krakonoš = vládce Krkonoš.",
      ],
      commonMistake:
        "Pověst není pohádka — pohádka je zcela vymyšlená, pověst se váže ke skutečnému místu nebo postavě.",
      example:
        "Pověst o Blanických rytířích: rytíři spí v hoře Blaník a probudí se, až bude Čechám nejhůře.",
    },
  },
];
