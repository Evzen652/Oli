/**
 * Přírodopis 6. ročník — Korýši: rak říční, krab, dafnie a stínka (select_one).
 *
 * Fakta, na kterých se shodují učebnice 6. ročníku (Fraus, Nová škola, SPN):
 * tělo kryje krunýř a dělí se na hlavohruď a zadeček; dva páry tykadel;
 * dýchání žábrami (i u suchozemské stínky, proto potřebuje vlhko); rak říční
 * má pět párů hrudních nohou, první pár tvoří klepeta, žije v čistých sladkých
 * vodách, je aktivní v noci, je chráněný a ukazuje čistotu vody, při růstu
 * svléká krunýř, samice nosí vajíčka pod zadečkem; krab je mořský se zadečkem
 * podvinutým pod hlavohrudí; dafnie je drobný korýš sladkých vod a potrava
 * ryb; stínka žije na vlhkých místech a rozkládá odumřelé zbytky rostlin.
 * Srovnání: hmyz 3 páry nohou a 1 pár tykadel, pavoukovci 4 páry nohou a
 * žádná tykadla.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • korýš zařazený mezi hmyz („malý členovec s krunýřem je hmyz“),
 *  • záměna počtů nohou a tykadel (6 = hmyz, 8 = pavoukovci, pár × noha),
 *  • dýchání plícemi nebo vzdušnicemi místo žaber,
 *  • krunýř zaměněný za ulitu či kost (rak jako měkkýš, krunýř, který roste).
 *
 *  • L1 — zapamatování: přímá otázka na jeden znak, prostředí nebo zástupce.
 *  • L2 — použití: počítání nohou, zařazení zástupce, srovnání, význam.
 *  • L3 — přenos: neznámý živočich z popisu znaků, „vysvětli, proč“, závěr.
 *
 * Každá otázka má pevně tři distraktory, takže jedna otázka = jedna úloha
 * a `ruzneUlohy()` vrátí celou banku úrovně. Generátor nemá stav na úrovni modulu.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural } from "@/lib/czechGrammar";
import { pick, buildChoiceTask as choice, losUlohy, ruzneUlohy } from "./_shared";

interface Fakt {
  q: string;
  key: string;
  /** Přesně tři distraktory: [možnost, proč je to chyba]. */
  d: [string, string][];
  h: [string, string];
  e: string;
  s?: string[];
}

const uloha = (f: Fakt): PracticeTask | null =>
  choice(
    f.q,
    f.key,
    f.d.map(([value, why]) => ({ value, why })),
    { hints: f.h, explanation: f.e, solutionSteps: f.s },
  );

const nohou = (n: number) => `${n} ${plural(n, "noha", "nohy", "nohou")}`;
const tykadel = (n: number) => `${n} ${plural(n, "tykadlo", "tykadla", "tykadel")}`;

// Opakované vysvětlení záměn.
const FB_HMYZ = "Hmyz má tři páry nohou a jeden pár tykadel. Korýš má nohou víc a tykadla ve dvou párech.";
const FB_PAVOUK = "Pavoukovci mají čtyři páry nohou a žádná tykadla. Korýši tykadla mají.";
const FB_MEKKYS = "Měkkýši mají měkké nečlánkované tělo, často v ulitě. Korýš má krunýř a článkované nohy.";
const FB_PLICE = "Plícemi dýchají suchozemští obratlovci. Korýši mají žábry.";
const FB_VZDUSNICE = "Vzdušnicemi dýchá hmyz. Korýši dýchají žábrami.";

// ── L1 — zapamatování ───────────────────────────────────────────────────────
const L1: Fakt[] = [
  {
    q: "Čím dýchá rak říční?",
    key: "žábrami",
    d: [
      ["plícemi", FB_PLICE],
      ["vzdušnicemi", FB_VZDUSNICE],
      ["celým povrchem těla", "Celým povrchem těla dýchá třeba žížala. Rak má pod krunýřem dýchací orgány."],
    ],
    h: [
      "Rak žije celý život pod vodou. Jakým orgánem získávají kyslík z vody ryby?",
      "Plíce potřebují vzduch a trubičky rozvedené po těle má hmyz. Rak bere kyslík přímo z vody tenkými lístky ukrytými po stranách hlavohrudi.",
    ],
    e: "Rak říční dýchá žábrami. Žábry má po stranách hlavohrudi pod krunýřem a berou kyslík z vody.",
  },
  {
    q: "Jak se jmenuje korýš, který žije na souši?",
    key: "stínka",
    d: [
      ["dafnie", "Dafnie žije ve volné vodě rybníků a tůní. Mimo vodu nepřežije."],
      ["rak říční", "Rak říční žije v čistých potocích a řekách. Na souši dlouho nevydrží."],
      ["blešivec", "Blešivec je drobný korýš z potoků. Žije pod kameny ve vodě, ne na souši."],
    ],
    h: [
      "U každého nabízeného korýše si vybav, kde žije: v potoce, v rybníce, nebo jinde?",
      "Rak říční žije v potoce, ne na souši. Kterého korýše najdeš ve vlhkém sklepě nebo v tlejícím listí?",
    ],
    e: "Stínka je suchozemský korýš. Žije na vlhkých místech, pod kameny, v listí a ve sklepech. Dafnie, rak i blešivec žijí ve vodě.",
  },
  {
    q: "Z jakých částí se skládá tělo raka říčního?",
    key: "z hlavohrudi a zadečku",
    d: [
      ["z hlavy, hrudi a zadečku", "Tři oddělené části má tělo hmyzu. U raka hlava s hrudí srostly v jeden celek."],
      ["z hlavy a zadečku", "Hlava raka není samostatná, srostla s hrudí v jeden celek."],
      ["z hlavy a trupu", "Hlava a trup jsou části těla obratlovců. U raka jsou hlava a hruď srostlé."],
    ],
    h: [
      "Porovnej raka s hmyzem: je mezi hlavou a hrudí raka zúžení, nebo tvoří jeden kus?",
      "Přední část těla nese tykadla, oči, klepeta a kráčivé nohy. Zadní článkovaná část končí ploutvičkou, kterou rak mrskne, když couvá.",
    ],
    e: "Tělo raka se skládá z hlavohrudi, kde srostla hlava s hrudí, a ze článkovaného zadečku. Tři oddělené části (hlava, hruď, zadeček) má hmyz.",
  },
  {
    q: "Kolik párů tykadel mají korýši?",
    key: "dva páry",
    d: [
      ["jeden pár", "Jeden pár tykadel má hmyz. Korýši mají tykadla dvojí, krátká a dlouhá."],
      ["ani jeden pár", "Bez tykadel jsou pavoukovci. Korýši tykadla mají."],
      ["čtyři páry", "Čtyři páry mají pavoukovci, ale nohou, ne tykadel."],
    ],
    h: [
      "Prohlédni si raka zepředu: má tykadla jen dlouhá, nebo i krátká?",
      "Hmyz má tykadla jen jedna, pavoukovci žádná. Korýši mají tykadla dlouhá i krátká a obojí vlevo i vpravo.",
    ],
    e: "Korýši mají dva páry tykadel: pár dlouhých a pár krátkých. Tím se liší od hmyzu (jeden pár) i od pavoukovců (bez tykadel).",
  },
  {
    q: "Co kryje tělo raka říčního?",
    key: "krunýř",
    d: [
      ["ulita", "Ulitu mají měkkýši, třeba hlemýžď. Rakův obal kryje celé tělo i nohy."],
      ["šupiny", "Šupiny mají ryby. Rak kosti ani šupiny nemá."],
      ["slizká kůže", "Slizkou kůži má třeba žížala. Povrch raka je pevný."],
    ],
    h: [
      "Rak nemá kosti uvnitř těla. Co tedy drží tvar jeho těla zvenku a kryje i nohy?",
      "Ulitu nosí jen měkkýši. Rakův obal kryje celé tělo i klepeta a je zpevněný vápenatými látkami.",
    ],
    e: "Tělo raka kryje krunýř. Je zpevněný vápenatými látkami, chrání raka a drží tvar jeho těla. Krunýř je vnější kostra raka, vnitřní kosti rak nemá.",
  },
  {
    q: "Jak se jmenuje první pár nohou raka, kterým uchopuje potravu?",
    key: "klepeta",
    d: [
      ["tykadla", "Tykadla jsou na hlavě a slouží k hmatu a čichu, potravu jimi rak neuchopí."],
      ["kusadla", "Kusadla jsou ústní části, kterými se potrava kouše. Nohy to nejsou."],
      ["chapadla", "Chapadla má nezmar nebo sépie. Rak má na předních nohou něco jiného."],
    ],
    h: [
      "Přední nohy raka jsou velké a na konci se sevřou jako kleště. Jak se jim říká?",
      "Rak jimi sevře kořist nebo prst toho, kdo ho neopatrně chytí. Tykadla jsou na hlavě, chapadla mají jiní živočichové.",
    ],
    e: "První pár nohou raka tvoří klepeta. Rak jimi uchopuje potravu a brání se jimi.",
  },
  {
    q: "Kde žije krab?",
    key: "ve slané mořské vodě",
    d: [
      ["ve sladkých rybnících", "Ve sladké vodě žije u nás rak nebo dafnie. Krab je mořský živočich."],
      ["v čistých potocích", "Čisté potoky jsou domovem raka říčního, ne kraba."],
      ["ve vlhkých sklepech", "Ve vlhkých sklepech najdeš stínku. Krab dýchá žábrami ve vodě a u moře."],
    ],
    h: [
      "Vzpomeň si, kde jsi kraba mohl vidět na obrázku, ve filmu nebo na dovolené.",
      "V čistých potocích žije rak říční, ne krab. Z jakého prostředí pochází většina krabů?",
    ],
    e: "Krabi žijí převážně v moři a na mořském pobřeží. Do české přírody patří rak, ne krab.",
  },
  {
    q: "Kde žije rak říční?",
    key: "v čistých sladkých vodách",
    d: [
      ["ve slané mořské vodě", "V moři žije krab. Rak říční je sladkovodní."],
      ["ve znečištěných stokách", "Rak ve znečištěné vodě nepřežije, potřebuje čistou vodu."],
      ["pod kůrou suchých pařezů", "Rak dýchá žábrami a na suchu nežije. Pod kůrou hledej spíš stínku."],
    ],
    h: [
      "Rak říční má jméno podle místa, kde žije. Co víš o vodě v řekách?",
      "V moři žije krab, ne rak. Zbylé možnosti porovnej podle toho, jak rak snáší znečištění.",
    ],
    e: "Rak říční žije v čistých sladkých vodách, hlavně v potocích a řekách. Znečištěnou vodu nesnese.",
  },
  {
    q: "Jak se nazývá drobný korýš, kterého chovatelé kupují jako krmivo pro akvarijní ryby?",
    key: "dafnie",
    d: [
      ["stínka", "Stínka je korýš, ale žije na souši, pod kameny a ve sklepech. Rybám se nedává."],
      ["trepka", "Trepka je jednobuněčný prvok, ne korýš."],
      ["pijavka", "Pijavka je kroužkovec, ne korýš, a jako krmivo se neprodává."],
    ],
    h: [
      "Hledej korýše, který se vznáší ve volné vodě rybníků a je tak drobný, že ho ryby spolknou celého.",
      "Chovatelé mu říkají lidově „vodní blecha“, protože ve vodě poskakuje. Jeden ze zbylých organismů žije na souši, druhý není korýš vůbec.",
    ],
    e: "Dafnie je drobný korýš sladkých vod. Ryby ji v přírodě požírají, a proto se prodává jako krmivo pro akvarijní ryby.",
  },
  {
    q: "Kde najdeš v přírodě stínku?",
    key: "pod kameny a kůrou ve vlhku",
    d: [
      ["na suchých slunných skalách", "Na suchu by stínce vyschly žábry. Proto se sucha a slunce vyhýbá."],
      ["ve slané mořské vodě", "V moři žije krab. Stínka je suchozemský korýš."],
      ["na listech v koruně stromů", "V korunách stromů je sucho a vítr. Stínka se drží vlhka u země."],
    ],
    h: [
      "Vzpomeň si, čím stínka dýchá a co ten orgán potřebuje. Kde to najde?",
      "V moři žije krab, ne stínka. Porovnej zbylá místa: kde je sucho a vítr a kde se drží vlhkost?",
    ],
    e: "Stínka žije na vlhkých a tmavých místech: pod kameny, pod kůrou, v listí nebo ve sklepech. Vlhko potřebuje kvůli žábrám.",
  },
  {
    q: "Do které skupiny živočichů patří stínka?",
    key: "mezi korýše",
    d: [
      ["mezi hmyz", "Hmyz má tři páry nohou a jeden pár tykadel. Stínka má nohou víc než šest."],
      ["mezi pavoukovce", FB_PAVOUK],
      ["mezi měkkýše", FB_MEKKYS],
    ],
    h: [
      "Prohlédni si stínku: kolik má nohou a tykadel a jaký má povrch těla? Pak to porovnej se znaky skupin.",
      "Srovnávací klíč: hmyz má šest nohou a jeden pár tykadel, pavoukovci osm nohou a žádná tykadla, měkkýši nemají článkované nohy.",
    ],
    e: "Stínka patří mezi korýše, i když žije na souši. Má krunýř, tykadla, mnoho nohou a dýchá žábrami jako rak.",
  },
  {
    q: "Jak se jmenuje mořský korýš, který má zadeček podvinutý pod hlavohrudí?",
    key: "krab",
    d: [
      ["rak říční", "Rak říční má zadeček natažený dozadu a žije ve sladké vodě."],
      ["stínka", "Stínka žije na souši ve vlhku, ne v moři."],
      ["sépie", "Sépie žije v moři, ale je to měkkýš. Krunýř ani článkované nohy nemá."],
    ],
    h: [
      "Hledej korýše z mořského pobřeží, který vypadá, jako by zadeček neměl vůbec.",
      "Jeho tělo je široké a ploché, zadeček má schovaný vespod a po písku často běhá bokem. Rak má zadeček natažený a žije v potoce.",
    ],
    e: "Krab je mořský korýš. Zadeček má krátký a podvinutý pod hlavohrudí, proto vypadá široce a často se pohybuje bokem.",
  },
  {
    q: "Kde nosí samice raka říčního vajíčka?",
    key: "pod zadečkem",
    d: [
      ["v ulitě na zádech", "Ulitu mají měkkýši. Rak má krunýř a ulitu nenosí."],
      ["v hnízdě na břehu", "Hnízda stavějí ptáci. Samice raka vajíčka nosí přímo na těle."],
      ["na klepetech", "Klepeta slouží k uchopení potravy a obraně, vajíčka na nich nejsou."],
    ],
    h: [
      "Samice raka vajíčka neopouští, nosí je přilepená na vlastním těle. Na které části?",
      "Klepeta potřebuje samice k lovu a obraně, takže tam vajíčka nebudou. Na které části těla by byla nejlépe chráněná?",
    ],
    e: "Samice raka nosí vajíčka přilepená pod zadečkem, dokud se z nich nevylíhnou mladí raci. Tak jsou vajíčka chráněná.",
  },
  {
    q: "Kdy je rak říční nejaktivnější?",
    key: "v noci",
    d: [
      ["v poledne", "V poledne je světlo a rak by byl snadnou kořistí. Tou dobou sedí v úkrytu."],
      ["jen v zimě", "V zimě je rak málo pohyblivý. Aktivní je v teplé části roku."],
      ["ve dne", "Ve dne se rak skrývá pod kameny nebo v noře v břehu."],
    ],
    h: [
      "Kdy je pro raka bezpečné vylézt z úkrytu, když se bojí nepřátel?",
      "Zima to nebude, tehdy je rak málo pohyblivý. Lidé u potoka raka skoro nikdy nevidí. Kdy tedy nejspíš vyráží za potravou?",
    ],
    e: "Rak říční je aktivní v noci. Přes den se skrývá pod kameny, pod kořeny nebo v norách v břehu.",
  },
  {
    q: "Čím se živí dafnie?",
    key: "drobnými řasami ve vodě",
    d: [
      ["malými rybkami v rybníce", "Je to naopak: ryby požírají dafnie. Dafnie je příliš drobná, aby lovila ryby."],
      ["krví, kterou saje z ryb", "Krev saje pijavka. Dafnie není parazit."],
      ["listy leknínů a rákosu", "Dafnie je drobounká a volně se vznáší, listy rostlin neokusuje."],
    ],
    h: [
      "Dafnie je sama tak malá, že ji ryby spolknou celou. Jak drobná musí být její potrava?",
      "Dafnie se vznáší ve volné vodě a nohama si k sobě víří vodu. Z ní odfiltruje nejmenší zelené organismy, které se ve vodě vznášejí.",
    ],
    e: "Dafnie se živí drobnými řasami a dalšími mikroskopickými organismy, které odfiltruje z vody. Sama je potravou ryb.",
  },
  {
    q: "Čím se živí stínka?",
    key: "odumřelými zbytky rostlin",
    d: [
      ["krví, kterou saje z lidí", "Krev saje třeba klíště. Stínka není parazit."],
      ["hmyzem chyceným do sítě", "Síť spřádá pavouk. Stínka nic neloví."],
      ["sladkým nektarem z květů", "Nektar sbírá hmyz, třeba včela. Stínka žije u země v tlejícím listí."],
    ],
    h: [
      "Vybav si, kde stínka žije. Jaká potrava je na takovém místě po ruce?",
      "Sítě spřádají pavouci, ne korýši. Stínku najdeš v tlejícím listí a pod starou kůrou. Co tam zbývá k jídlu?",
    ],
    e: "Stínka se živí odumřelými zbytky rostlin, například spadaným listím a tlející kůrou. Pomáhá tak jejich rozkladu.",
  },
];

// ── L2 — použití ────────────────────────────────────────────────────────────
/** Počítání nohou: pět párů kráčivých nohou na zvíře. */
function pocitani(q: string, zvirat: number, h: [string, string], navic = ""): Fakt {
  const naJedno = 10;
  const kroky =
    zvirat === 1
      ? [`5 párů × 2 nohy v páru = ${nohou(naJedno)}.`]
      : [`Jedno zvíře: 5 párů × 2 = ${nohou(naJedno)}.`, `Všechna zvířata: ${zvirat} × ${naJedno} = ${nohou(zvirat * naJedno)}.`];
  return {
    q,
    key: nohou(zvirat * naJedno),
    d: [
      [nohou(zvirat * 6), "Počítáš se třemi páry nohou na zvíře, to platí pro hmyz. Korýš má pět párů kráčivých nohou."],
      [nohou(zvirat * 8), "Počítáš se čtyřmi páry nohou na zvíře, to platí pro pavoukovce. Korýš má pět párů kráčivých nohou."],
      [nohou(zvirat * 5), `Počítáš páry místo nohou. Každý pár tvoří dvě nohy, takže počet párů je potřeba zdvojnásobit.${navic}`],
    ],
    h,
    e: "Jeden pár jsou dvě nohy, levá a pravá. Pět párů je tedy deset nohou na jedno zvíře a pro víc zvířat se to násobí jejich počtem.",
    s: kroky,
  };
}

const KORYS = "Který z nich je korýš?";
const L2: Fakt[] = [
  pocitani(
    "Rak říční má na hlavohrudi pět párů kráčivých nohou. Kolik je to nohou celkem?",
    1,
    [
      "Jeden pár znamená levou a pravou nohu. Kolik nohou je v pěti takových dvojicích?",
      "Nepleť si pár s jednou nohou a nepočítej jako u hmyzu nebo pavouka. Spočítej dvojice a každou vezmi dvakrát.",
    ],
  ),
  pocitani(
    "Ochránci přírody při sčítání vylovili tři raky a hned je pustili zpátky. Každý rak má pět párů kráčivých nohou. Kolik kráčivých nohou měli všichni tři dohromady?",
    3,
    [
      "Kolik nohou má jeden rak, když pár tvoří dvě nohy? Pak počítej pro tři raky.",
      "Ověř si nejdřív jednoho raka: pět dvojic nohou. Teprve potom násob počtem vylovených zvířat.",
    ],
  ),
  {
    q: "Rak říční má dva páry tykadel. Kolik tykadel má celkem?",
    key: tykadel(4),
    d: [
      [tykadel(2), "Dvě tykadla jsou jen jeden pár, jako u hmyzu. Rak má páry dva a každý pár tvoří dvě tykadla."],
      [tykadel(0), "Bez tykadel jsou pavoukovci. Rak tykadla má."],
      [tykadel(8), "Osm je počet nohou pavouka. Tykadla s nohama nepleť."],
    ],
    h: [
      "Jeden pár tykadel je levé a pravé tykadlo. Kolik jich je ve dvou párech?",
      "Rak má na hlavě dlouhá i krátká tykadla. Spočítej, kolik je dlouhých a kolik krátkých, a sečti je.",
    ],
    e: "Pár znamená dvě tykadla. Dva páry jsou tedy čtyři tykadla: dvě dlouhá a dvě krátká.",
    s: [`2 páry × 2 tykadla v páru = ${tykadel(4)}.`],
  },
  {
    q: `Na zahradě pod starým prknem najdeš tyto živočichy. ${KORYS}`,
    key: "stínka",
    d: [
      ["mravenec", "Mravenec je hmyz: má tři páry nohou a jeden pár tykadel."],
      ["pavouk křižák", "Křižák je pavoukovec: má čtyři páry nohou a žádná tykadla."],
      ["hlemýžď", "Hlemýžď je měkkýš s ulitou a svalnatou nohou. Krunýř ani článkované nohy nemá."],
    ],
    h: [
      "Hledej živočicha, který dýchá žábrami, a proto se drží ve vlhku pod prknem.",
      "U každého spočítej nohy a tykadla: šest nohou má hmyz, osm nohou bez tykadel pavoukovec, bez článkovaných nohou je měkkýš. Který zbude?",
    ],
    e: "Stínka je korýš: má krunýř, tykadla, mnoho nohou a dýchá žábrami. Proto žije ve vlhku pod prknem nebo kamenem.",
  },
  {
    q: `V akváriu v obchodě se zvířaty plavou tito živočichové. ${KORYS}`,
    key: "kreveta",
    d: [
      ["potápník", "Potápník je vodní brouk, tedy hmyz se třemi páry nohou."],
      ["plovatka", "Plovatka je vodní plž s ulitou, tedy měkkýš."],
      ["vodouch", "Vodouch je pavouk, který žije pod vodou. Má osm nohou a žádná tykadla."],
    ],
    h: [
      "Hledej vodního živočicha s tenkým krunýřem, dlouhými tykadly a deseti nohama, který vypadá jako malý rak.",
      "Jeden je brouk, jeden plž s ulitou a jeden pavouk. Zbývá ten, který má stejnou stavbu těla jako rak.",
    ],
    e: "Kreveta je korýš příbuzný rakovi. Má krunýř, dva páry tykadel, pět párů nohou a dýchá žábrami.",
  },
  {
    q: `Na mořském pobřeží našly děti tyto živočichy. ${KORYS}`,
    key: "krab",
    d: [
      ["slávka", "Slávka je mlž se dvěma lasturami, tedy měkkýš."],
      ["sépie", "Sépie je hlavonožec, tedy měkkýš. Krunýř ani článkované nohy nemá."],
      ["medúza", "Medúza je žahavec s měkkým tělem a chapadly. Krunýř nemá."],
    ],
    h: [
      "Hledej mořského živočicha s tvrdým krunýřem a klepety.",
      "Dva z ostatních jsou měkkýši a jeden je měkký žahavec s chapadly. Korýš má článkované nohy a běhá po písku.",
    ],
    e: "Krab je mořský korýš. Má krunýř, klepeta a pět párů hrudních nohou a zadeček podvinutý pod hlavohrudí.",
  },
  {
    q: `V kapce vody z rybníka vidíš pod lupou tyto drobné organismy. ${KORYS}`,
    key: "dafnie",
    d: [
      ["larva komára", "Komár je hmyz, a tedy i jeho larva patří k hmyzu."],
      ["nezmar", "Nezmar je žahavec s chapadly. Krunýř ani článkované nohy nemá."],
      ["trepka", "Trepka je jednobuněčný prvok, ne živočich s krunýřem."],
    ],
    h: [
      "Hledej drobného živočicha s průhledným krunýřkem, který poskakuje ve vodě pomocí velkých tykadel.",
      "Jeden organismus je jediná buňka, jeden má chapadla a jeden se jednou promění v létající hmyz. Který zbude?",
    ],
    e: "Dafnie je drobný korýš sladkých vod. Má krunýř a velkými tykadly se ve vodě odráží.",
  },
  {
    q: `Ve vodě a u vody žijí tito živočichové. ${KORYS}`,
    key: "rak říční",
    d: [
      ["pijavka koňská", "Pijavka je kroužkovec s měkkým článkovaným tělem bez nohou."],
      ["larva chrostíka", "Chrostík je hmyz, a tedy i jeho larva patří k hmyzu."],
      ["vodouch stříbřitý", "Vodouch je pavouk. Má čtyři páry nohou a žádná tykadla."],
    ],
    h: [
      "Hledej živočicha s tvrdým krunýřem, klepety a dvěma páry tykadel.",
      "Jeden živočich nemá nohy vůbec, jeden je mládě hmyzu a jeden má osm nohou bez tykadel. Který zbude?",
    ],
    e: "Rak říční je korýš: má krunýř, dva páry tykadel, pět párů hrudních nohou a dýchá žábrami.",
  },
  {
    q: "Tři z těchto živočichů jsou korýši. Který mezi ně nepatří?",
    key: "klíště",
    d: [
      ["stínka", "Stínka je korýš, i když žije na souši. Dýchá žábrami."],
      ["krab", "Krab je mořský korýš s krunýřem a klepety."],
      ["dafnie", "Dafnie je drobný sladkovodní korýš."],
    ],
    h: [
      "U každého živočicha si vybav, jestli má tykadla. Který je nemá?",
      "Tři živočichové dýchají žábrami a mají dva páry tykadel. Čtvrtý má osm nohou, tykadla žádná a saje krev.",
    ],
    e: "Klíště je pavoukovec: má čtyři páry nohou a žádná tykadla. Stínka, krab i dafnie jsou korýši.",
  },
  {
    q: "Čím se krab liší od raka říčního?",
    key: "má zadeček podvinutý pod hlavohrudí",
    d: [
      ["dýchá plícemi místo žaber", "Krab dýchá žábrami stejně jako rak. Oba jsou korýši."],
      ["nemá tykadla, jen klepeta", "Krab tykadla má, dva páry jako rak. Bez tykadel jsou pavoukovci."],
      ["má jen tři páry kráčivých nohou", "Tři páry nohou má hmyz. Krab má stejně jako rak pět párů hrudních nohou."],
    ],
    h: [
      "Nabídnuté rozdíly se týkají dýchání, tykadel, nohou a tvaru těla. Které znaky mají všichni korýši stejné?",
      "Oba jsou korýši, takže dýchají stejně. Když se na kraba podíváš shora, proč vypadá kratší a širší než rak?",
    ],
    e: "Krab má zadeček krátký a podvinutý pod hlavohrudí, proto je široký a chodí často bokem. Rak má zadeček natažený dozadu. Dýchání, tykadla i počet nohou mají stejné.",
  },
  {
    q: "Čím se stínka liší od raka říčního?",
    key: "žije na souši na vlhkých místech",
    d: [
      ["dýchá vzdušnicemi jako hmyz", "Stínka není hmyz. Dýchá jako ostatní korýši a její dýchací orgány musí zůstat vlhké."],
      ["má jen tři páry nohou jako hmyz", "Tři páry nohou má hmyz. Stínka jich má víc."],
      ["nemá žádná tykadla jako pavouk", "Stínka tykadla má. Bez tykadel jsou pavoukovci."],
    ],
    h: [
      "Oba jsou korýši. Projdi nabízené rozdíly a u každého si ověř, jestli nepatří spíš jiné skupině členovců.",
      "Tři páry nohou jsou znak hmyzu, takže tahle možnost padá. U zbylých si vybav, co mají všichni korýši společné.",
    ],
    e: "Stínka je suchozemský korýš, žije na vlhkých místech. Dýchá ale žábrami jako rak, proto se sucha vyhýbá.",
  },
  {
    q: "Čím se dafnie liší od raka říčního?",
    key: "je drobná a vznáší se ve volné vodě",
    d: [
      ["žije jen ve slaném moři jako krab", "Dafnie je sladkovodní, žije v rybnících a tůních."],
      ["dýchá vzdušnicemi jako vodní hmyz", "Dafnie je korýš a dýchá jinak než hmyz."],
      ["je to hmyz, protože je tak malá", "Velikost o skupině nerozhoduje. Dafnie je korýš jako rak."],
    ],
    h: [
      "Oba jsou sladkovodní korýši. Porovnej jejich velikost a to, kde ve vodě jsou.",
      "Rak leze po dně a měří přes deset centimetrů. Druhý korýš měří pár milimetrů a dno nepotřebuje.",
    ],
    e: "Dafnie je drobný korýš, který se vznáší ve volné vodě rybníků a tůní. Rak je velký a žije na dně. Oba jsou sladkovodní korýši.",
  },
  {
    q: "Co mají rak, krab a stínka společného?",
    key: "dýchají žábrami",
    d: [
      ["žijí ve sladké vodě", "Ve sladké vodě žije jen rak. Krab žije v moři a stínka na souši."],
      ["mají tři páry nohou", "Tři páry nohou má hmyz. Korýši jich mají víc."],
      ["mají jeden pár tykadel", "Jeden pár tykadel má hmyz. Korýši mají dva páry."],
    ],
    h: [
      "Každý z nich žije jinde. Hledej znak, který nezávisí na prostředí.",
      "Šest nohou je znak hmyzu, ne korýšů. U zbylých možností si ověř, jestli platí pro všechny tři živočichy.",
    ],
    e: "Rak, krab i stínka jsou korýši, a proto všichni dýchají žábrami. Žijí každý jinde: rak ve sladké vodě, krab v moři, stínka na vlhké souši.",
  },
  {
    q: "Proč ochránci přírody sledují, zda v potoce žije rak říční?",
    key: "rak vydrží jen v čisté vodě",
    d: [
      ["rak vyčistí i hodně špinavou vodu", "Rak znečištěnou vodu nevyčistí. Ve špinavé vodě sám nepřežije."],
      ["rak škodí rybám, a proto se loví", "Rak je chráněný, neloví se. Sledují ho kvůli čistotě vody."],
      ["rak přežije i v odpadní vodě", "Je to naopak: rak je na znečištění velmi citlivý."],
    ],
    h: [
      "Zamysli se, co rak ke svému životu nutně potřebuje. Co pak jeho přítomnost říká o potoce?",
      "Rak je chráněný, takže se neloví. Některé živočichy vědci používají jako ukazatele stavu prostředí. Co ukazuje rak?",
    ],
    e: "Rak říční žije jen v čisté vodě. Když v potoce žije, je to znamení, že voda je čistá. Je tedy ukazatelem čistoty vody.",
  },
  {
    q: "Proč je rak říční v Česku chráněný?",
    key: "ubývá ho kvůli znečištění vod a račímu moru",
    d: [
      ["přemnožil se v rybnících a škodí rybám", "Rak se nepřemnožil, naopak ho ubylo. Ryby neohrožuje, spíš je sám jejich kořistí."],
      ["žije jen v jedné řece v Česku", "Rak říční žije v mnoha potocích po celé republice, jen je ho čím dál méně."],
      ["ubývá ho, protože v zimě zamrzá", "Rak přečká zimu v úkrytu na dně. Ubývá ho z jiných příčin."],
    ],
    h: [
      "Zamysli se, proč se vůbec nějaký druh zapisuje mezi chráněné.",
      "Přemnožený živočich chráněný nebývá. Uvažuj, co rakovi škodí ve vodě a co k nám lidé zavlekli spolu s cizími druhy raků.",
    ],
    e: "Raka říčního ubylo kvůli znečištění a úpravám toků a hlavně kvůli račímu moru, který k nám zavlekli američtí raci. Proto je ohrožený a chráněný.",
  },
  {
    q: "Kdo v rybníce požírá dafnie?",
    key: "ryby",
    d: [
      ["plovatky", "Plovatka je vodní plž, který seškrabává řasy z kamenů a rostlin. Dafnie neloví."],
      ["larvy komárů", "Larvy komárů filtrují z vody drobné řasy a zbytky. Dafnie nepožírají."],
      ["bobři", "Bobr je býložravec, okusuje kůru a větve stromů."],
    ],
    h: [
      "U každého nabízeného živočicha si urči, jestli loví drobné živočichy, nebo se živí rostlinami a řasami.",
      "Plovatka seškrabává řasy z kamenů, takže ta to nebude. Kdo v rybníce loví drobné živočichy ve volné vodě?",
    ],
    e: "Dafnie jsou důležitou potravou ryb, hlavně mladých rybek. Proto se prodávají i jako krmivo pro akvarijní ryby.",
  },
  {
    q: "Čím je stínka užitečná na zahradě?",
    key: "rozkládá odumřelé zbytky rostlin",
    d: [
      ["opyluje květy jako včela", "Opylují hlavně včely a další hmyz. Stínka ke květům neleze."],
      ["loví mšice jako beruška", "Mšice loví beruška. Stínka se živí odumřelými rostlinami."],
      ["chytá mouchy do sítí jako pavouk", "Sítě spřádá pavouk. Stínka nic neloví."],
    ],
    h: [
      "Zjisti nejdřív, čím se stínka živí. Z toho plyne, k čemu je na zahradě.",
      "Chytání much do sítí patří pavoukům, ne korýšům. Čím se živí zvíře, které žije v tlejícím listí u země?",
    ],
    e: "Stínka se živí odumřelými zbytky rostlin a pomáhá je rozkládat. Tím vrací živiny do půdy.",
  },
];

// ── L3 — přenos ─────────────────────────────────────────────────────────────
const KAM = "Kam ho zařadíš?";
const ZAVER = "Který závěr plyne z jeho znaků?";
const SKUPINY = {
  korys: "do skupiny korýšů",
  hmyz: "do skupiny hmyzu",
  pavouk: "do skupiny pavoukovců",
  mekkys: "do skupiny měkkýšů",
};
const FB3 = {
  korys: "Korýš má dva páry tykadel a dýchá žábrami. Popis tomu neodpovídá.",
  hmyz: "Hmyz má jeden pár tykadel a tři páry nohou. Popis tomu neodpovídá.",
  pavouk: "Pavoukovci mají čtyři páry nohou a žádná tykadla. Popis tomu neodpovídá.",
  mekkys: "Měkkýš má měkké nečlánkované tělo, často v ulitě. Popis tomu neodpovídá.",
};
type Sk = keyof typeof SKUPINY;
const zarad = (q: string, klic: Sk, h: [string, string], e: string): Fakt => ({
  q,
  key: SKUPINY[klic],
  d: (Object.keys(SKUPINY) as Sk[]).filter((k) => k !== klic).map((k) => [SKUPINY[k], FB3[k]] as [string, string]),
  h,
  e,
});

const L3: Fakt[] = [
  zarad(
    `Přírodovědec popsal živočicha, který vypadá jako velký brouk a leze po dně bystřiny: tělo kryje krunýř, má dva páry tykadel a deset kráčivých nohou. ${KAM}`,
    "korys",
    [
      "Vzhled může klamat. Spočítej nohy a tykadla a porovnej je se znaky skupin.",
      "Brouk je hmyz a hmyz má šest nohou a jeden pár tykadel. Sedí to na popsaného živočicha? Které skupině odpovídá deset nohou?",
    ],
    "Dva páry tykadel a pět párů kráčivých nohou jsou znaky korýšů. Podobnost s broukem nerozhoduje: hmyz má šest nohou a jeden pár tykadel.",
  ),
  zarad(
    `Přírodovědec popsal živočicha: tělo má rozdělené na hlavu, hruď a zadeček, má jeden pár tykadel, tři páry nohou a dva páry křídel. ${KAM}`,
    "hmyz",
    [
      "Spočítej nohy a tykadla. Která skupina členovců má právě tolik?",
      "Křídla mají jen jedni členovci. Ověř to i počtem nohou: šest, osm, nebo deset?",
    ],
    "Tělo ze tří částí, jeden pár tykadel, tři páry nohou a křídla jsou znaky hmyzu.",
  ),
  zarad(
    `Přírodovědec popsal živočicha: tělo se skládá z hlavohrudi a zadečku, má čtyři páry nohou a je bez tykadel. ${KAM}`,
    "pavouk",
    [
      "Spočítej nohy a všimni si, že tykadla chybějí. Kterou skupinu to určuje?",
      "Hlavohruď a zadeček mají dva různé typy členovců. Rozhodne počet nohou a to, že živočich nemá žádná tykadla.",
    ],
    "Čtyři páry nohou a žádná tykadla mají pavoukovci. Hlavohruď a zadeček mají i korýši, ti ale mají dva páry tykadel.",
  ),
  zarad(
    `Přírodovědec popsal mořského živočicha s tvrdou schránkou ze dvou lastur: má nečlánkované tělo bez krunýře a svalnatou nohu. ${KAM}`,
    "mekkys",
    [
      "Tvrdá schránka ještě neznamená krunýř. Má tento živočich článkované nohy?",
      "Lastury nosí třeba škeble v rybníce. Vybav si, kam patří živočichové, kteří se pohybují jednou svalnatou nohou.",
    ],
    "Nečlánkované tělo, svalnatá noha a schránka ze dvou lastur jsou znaky měkkýšů, třeba slávky nebo škeble. Tvrdá schránka není krunýř, členovci mají článkované nohy.",
  ),
  zarad(
    `Přírodovědec popsal suchozemského živočicha z vlhkého sklepa: tělo kryje krunýř, má dva páry tykadel, víc nohou než hmyz i pavouci a dýchá žábrami. ${KAM}`,
    "korys",
    [
      "Nenech se zmást tím, že žije na souši. Rozhoduj podle tykadel a dýchání.",
      "Postup: tykadla ve dvou párech, víc nohou než osm a dýchání vodním orgánem. Kterou skupinu tyto znaky určují, i když živočich bydlí ve sklepě?",
    ],
    "Dva páry tykadel, mnoho nohou a žábry mají korýši. Takový suchozemský korýš je třeba stínka. Na souši přežije jen ve vlhku.",
  ),
  zarad(
    `Přírodovědec popsal živočicha: má jeden pár tykadel, tři páry nohou, dýchá vzdušnicemi a jeho larva žije ve vodě. ${KAM}`,
    "hmyz",
    [
      "Život larvy ve vodě o skupině nerozhoduje. Spočítej nohy a tykadla dospělce.",
      "Vzdušnice jsou trubičky rozvedené po těle. Která skupina jimi dýchá a má šest nohou?",
    ],
    "Jeden pár tykadel, tři páry nohou a vzdušnice jsou znaky hmyzu. Larvy některého hmyzu, třeba chrostíka nebo komára, žijí ve vodě.",
  ),
  zarad(
    `Přírodovědec popsal živočicha: má čtyři páry nohou, je bez tykadel, na hlavohrudi nese klepítka a na konci zadečku jedový bodec. ${KAM}`,
    "pavouk",
    [
      "Klepítka mají i jiní členovci. Rozhoduj podle počtu nohou a tykadel.",
      "Spočítej nohy a zkontroluj tykadla. Tento živočich s bodcem žije v teplých krajích a je blízký příbuzný klíštěte.",
    ],
    "Čtyři páry nohou a žádná tykadla mají pavoukovci. Takový pavoukovec s klepítky a bodcem je štír.",
  ),
  {
    q: `Přírodovědec popsal humra: mořský živočich s krunýřem, dvěma páry tykadel, pěti páry kráčivých nohou a velkými klepety, dýchá žábrami. ${ZAVER}`,
    key: "je to korýš jako rak",
    d: [
      ["je to hmyz jako brouk", FB3.hmyz],
      ["je to pavoukovec jako štír", "Klepítka má i štír, ale pavoukovci nemají tykadla a mají čtyři páry nohou."],
      ["je to měkkýš jako sépie", "Sépie také žije v moři, ale je měkkýš bez krunýře a článkovaných nohou."],
    ],
    h: [
      "Život v moři ani klepeta o skupině samy nerozhodují. Spočítej nohy a tykadla.",
      "Postup: kolik párů tykadel, kolik párů nohou, čím dýchá. Se kterým známým živočichem se humr shoduje ve všech třech znacích?",
    ],
    e: "Humr má krunýř, dva páry tykadel, pět párů kráčivých nohou s klepety a dýchá žábrami. Je to tedy korýš, blízký příbuzný raka.",
  },
  {
    q: `Přírodovědec popsal blešivce z potoka: je drobný, z boku zploštělý, má krunýř, dva páry tykadel a dýchá žábrami. ${ZAVER}`,
    key: "korýš, protože má žábry a dva páry tykadel",
    d: [
      ["hmyz, protože je drobný a skáče jako blecha", "Jméno a velikost o skupině nerozhodují. Hmyz má jen jeden pár tykadel a dýchá vzdušnicemi."],
      ["pavoukovec, protože má více než šest nohou", "Pavoukovci nemají tykadla. Víc než šest nohou mají i korýši."],
      ["měkkýš, protože nemá kosti ani páteř", "Kosti nemá žádný bezobratlý. Měkkýš nemá krunýř ani článkované nohy."],
    ],
    h: [
      "Jméno živočicha může klamat. Rozhoduj jen podle tykadel a dýchání.",
      "Které znaky v popisu jsou rozlišovací a které jen popisují vzhled? Velikost a tvar skupinu neurčí, počet tykadel a dýchací orgán ano.",
    ],
    e: "Blešivec má krunýř, dva páry tykadel a dýchá žábrami, je to tedy korýš. Jméno připomíná blechu, ale s hmyzem nemá nic společného.",
  },
  {
    q: "Přírodovědec popsal buchanku z tůně: drobný živočich s krunýřem a dvěma páry tykadel, který se vznáší ve vodě a je potravou ryb. Kam ji zařadíš a proč?",
    key: "korýš, protože má krunýř a dva páry tykadel",
    d: [
      ["prvok, protože je velmi drobná a žije ve vodě", "Prvok je jediná buňka, nemá článkované nohy ani tykadla. Malá velikost nestačí."],
      ["hmyz, protože má tvrdý krunýř a článkované nohy", "Pevný povrch těla i článkované nohy mají všichni členovci. Hmyz má jen jeden pár tykadel."],
      ["pavoukovec, protože má víc nohou než hmyz", "Víc nohou než hmyz mají i korýši. Pavoukovci nemají tykadla, buchanka je má."],
    ],
    h: [
      "Velikost o skupině nerozhoduje. Najdi v popisu znak, který mají jen jedni členovci.",
      "Pevný obal těla mají všichni členovci, rozhodují až tykadla. Kolik jejich párů má která skupina? Porovnej se živočichem, který se v tůni také vznáší a je potravou ryb.",
    ],
    e: "Buchanka má krunýř a dva páry tykadel, proto patří mezi korýše, podobně jako dafnie. Velikost ani krunýř samotný skupinu neurčí.",
  },
  {
    q: `Přírodovědec popsal krevetu: mořský živočich s tenkým krunýřem, dlouhými tykadly ve dvou párech, pěti páry nohou a žábrami. ${ZAVER}`,
    key: "je to korýš, příbuzný rakovi",
    d: [
      ["je to měkkýš, příbuzný sépii", "Sépie je měkkýš bez krunýře a článkovaných nohou. Kreveta je má."],
      ["je to hmyz, příbuzný cvrčkovi", "Hmyz má tři páry nohou a jeden pár tykadel. Kreveta má víc."],
      ["je to ryba, příbuzná sardince", "Ryba má páteř, ploutve a šupiny. Kreveta má krunýř a článkované nohy."],
    ],
    h: [
      "Mořský život nic neurčuje, v moři žijí ryby, měkkýši i členovci. Spočítej páry nohou a tykadel.",
      "Postup: má článkované nohy a krunýř? Kolik párů tykadel? Čím dýchá? Najdi známého živočicha se stejnými znaky.",
    ],
    e: "Kreveta má krunýř, dva páry tykadel, pět párů nohou a žábry. Je to korýš, příbuzný rakovi a krabovi.",
  },
  {
    q: "Vysvětli, proč rak během růstu několikrát svléká krunýř.",
    key: "Protože krunýř neroste a brzy je malý",
    d: [
      ["Protože se krunýř opotřebuje jako zuby", "Krunýř se svléká kvůli růstu, ne kvůli opotřebení."],
      ["Protože se krunýř ve vodě rozpouští", "Krunýř je zpevněný vápenatými látkami a ve vodě se nerozpouští. Rak ho svléká kvůli růstu."],
      ["Protože se na zimu mění za teplejší", "Krunýř nehřeje. Rak ho svléká, když mu začne být malý."],
    ],
    h: [
      "Porovnej, jak roste živé tělo raka a jak se chová pevný obal na jeho povrchu.",
      "Představ si dítě v tvrdém brnění. Když vyroste, brnění mu nepovolí. Co musí udělat, aby mohlo růst dál?",
    ],
    e: "Krunýř je pevný a neroste. Pod starým krunýřem se vytvoří nový, zatím měkký. Rak starý svlékne, rychle se zvětší a nový krunýř pak ztvrdne.",
  },
  {
    q: "Vysvětli, proč stínka žije jen na vlhkých místech.",
    key: "Protože dýchá žábrami, které nesmí vyschnout",
    d: [
      ["Protože pije jen kapky rosy na kamenech", "Stínka potřebuje vlhko kvůli dýchání, ne kvůli pití."],
      ["Protože dýchá plícemi, které na slunci vysychají", "Stínka nedýchá plícemi jako obratlovci. Dýchá stejně jako ostatní korýši."],
      ["Protože ve tmě a vlhku nemá žádné nepřátele", "Nepřátele má stínka i ve vlhku, třeba ježka nebo ptáky. Vlhko potřebuje kvůli dýchání."],
    ],
    h: [
      "Stínka je příbuzná raka. Čím dýchá rak a co ten orgán potřebuje?",
      "Krok 1: urči, čím korýši dýchají. Krok 2: pomysli, co se s takovým orgánem stane na suchém vzduchu.",
    ],
    e: "Stínka dýchá žábrami jako ostatní korýši. Žábry fungují jen vlhké, na suchu by vyschly a stínka by se udusila. Proto žije pod kameny, v listí a ve sklepech.",
  },
  {
    q: "Vysvětli, proč je rak, který přišel o obě klepeta, snadnější kořistí.",
    key: "Protože se nemá čím bránit nepříteli",
    d: [
      ["Protože bez klepet nemůže dýchat", "Rak dýchá žábrami pod krunýřem. Klepeta s dýcháním nesouvisí."],
      ["Protože bez klepet nemůže couvat", "Při útěku rak couvá mrsknutím zadečku, klepeta k tomu nepotřebuje."],
      ["Protože bez klepet ve tmě nic necítí", "Hmatá a čichá rak tykadly. Klepeta k tomu neslouží."],
    ],
    h: [
      "Krok 1: vyjmenuj, k čemu rak klepeta používá. Krok 2: která z těch činností chybí zvířeti, na které útočí ryba nebo vydra?",
      "Dýchání obstarávají žábry, ne klepeta. Zbylé možnosti porovnej s tím, k čemu slouží zadeček a tykadla.",
    ],
    e: "Klepeta jsou přeměněný první pár nohou. Rak jimi uchopuje potravu a hlavně se jimi brání. Bez nich se nepříteli neubrání, i když dál může couvat a hmatat tykadly.",
  },
  {
    q: "Vysvětli, proč jsou pro raka, který loví v noci, důležitá tykadla.",
    key: "Protože jimi ve tmě hmatá a čichá",
    d: [
      ["Protože jimi dýchá kyslík z vody", "Kyslík z vody berou žábry, ne tykadla."],
      ["Protože jimi chytá a drží kořist", "Kořist rak chytá klepety. Tykadla jsou tenká a citlivá."],
      ["Protože jimi plave jako ploutvemi", "Tykadla k plavání neslouží. Při útěku rak prudce mrskne zadečkem s ocasní ploutvičkou a couvá."],
    ],
    h: [
      "V noci rak moc nevidí. Který smysl mu pomůže najít potravu?",
      "Krok 1: vyluč činnosti, na které má rak jiné orgány. Krok 2: tenká pohyblivá vlákna na hlavě slouží ke smyslům. Ke kterým?",
    ],
    e: "Tykadla jsou smyslové orgány. Rak jimi hmatá a čichá, a proto najde potravu i ve tmě.",
  },
  {
    q: "Vysvětli, proč se rak po svlékání krunýře několik dní skrývá v úkrytu.",
    key: "Protože nový krunýř je zatím měkký",
    d: [
      ["Protože bez krunýře nemůže dýchat", "Rak dýchá žábrami i po svlékání. Úkryt ho chrání před nepřáteli."],
      ["Protože krunýř mu doroste až za rok", "Nový krunýř ztvrdne během několika dní, ne za rok."],
      ["Protože po svlékání přestane vidět", "Rak po svlékání vidí dál. Zranitelný je kvůli měkkému povrchu těla."],
    ],
    h: [
      "Co raka chrání před rybami a jinými nepřáteli? A v jakém stavu to je hned po svlékání?",
      "Krok 1: čím se rak brání? Krok 2: jaký je nový obal těla v prvních dnech, než do něj vstoupí vápenaté látky?",
    ],
    e: "Nový krunýř je po svlékání několik dní měkký, než ztvrdne vápenatými látkami. Do té doby je rak snadnou kořistí, a proto se skrývá.",
  },
  {
    q: "Vysvětli, proč dafnie žije v rybnících a tůních, a ne v bystrém potoce.",
    key: "Protože se jen vznáší a proud by ji odnesl",
    d: [
      ["Protože v proudu nemůže dýchat plícemi", "Dafnie plíce nemá. Je to korýš."],
      ["Protože v potocích žije jen hmyz", "V potocích žije mnoho živočichů, třeba i rak říční, který je korýš."],
      ["Protože v rybníce je slaná voda", "Voda v rybníce je sladká. Slaná je voda v moři."],
    ],
    h: [
      "Krok 1: jak se dafnie ve vodě pohybuje a jak je silná? Krok 2: čím se liší voda v potoce od vody v rybníce?",
      "Dafnie plíce nemá, takže tahle možnost padá. Co se stane s drobným zvířetem, které neumí silně plavat, ve vodě, která se stále hýbe?",
    ],
    e: "Dafnie je drobný korýš, který se vznáší ve volné vodě. V bystrém proudu by se neudržela, proto žije ve stojaté vodě rybníků a tůní.",
  },
  {
    q: "Který závěr plyne z toho, že v potoce pod továrnou raci vymizeli?",
    key: "voda se pravděpodobně znečistila",
    d: [
      ["raci odešli do moře za kraby", "Rak říční je sladkovodní, v moři nežije."],
      ["raci přešli na souš jako stínky", "Rak dýchá žábrami ve vodě a na souši nežije."],
      ["v potoce je teď příliš čistá voda", "Rak čistou vodu naopak potřebuje."],
    ],
    h: [
      "Rak je ukazatelem stavu vody. Co může továrna do potoka vypouštět?",
      "Krok 1: co rak ke svému životu nutně potřebuje? Krok 2: co se v potoce pravděpodobně změnilo, když zmizel právě pod továrnou?",
    ],
    e: "Rak říční žije jen v čisté vodě. Když pod továrnou vymizel, nejrozumnější závěr je, že se voda znečistila. Ochránci přírody by ji měli nechat prověřit.",
  },
  {
    q: "Který závěr plyne z toho, že v rybníce po otravě vody uhynuly skoro všechny dafnie?",
    key: "rybám bude chybět potrava",
    d: [
      ["ryby budou mít víc kyslíku", "Dafnie jsou pro ryby hlavně potrava. Jejich zmizení rybám nepomůže."],
      ["rybám to neublíží, dafnie nejedí", "Ryby dafnie jedí, jsou pro ně důležitou potravou."],
      ["rybníku to prospěje, bude čistší", "Otrava rybník nevyčistí. Úhyn dafnií je naopak varování."],
    ],
    h: [
      "Krok 1: kdo v rybníce dafnie požírá? Krok 2: jakou roli hrají dafnie v životě ryb a co se změní, když zmizí?",
      "Dafnie jsou článkem potravního řetězce. Když jeden článek zmizí, projeví se to u toho, kdo na něm závisí.",
    ],
    e: "Dafnie jsou potravou ryb, hlavně mladých rybek. Když uhynou, rybám bude chybět potrava. Úhyn navíc ukazuje, že voda je znečištěná.",
  },
  {
    q: "Který závěr plyne z porovnání znaků stínky a hmyzu?",
    key: "stínka je korýš, protože má víc nohou a žábry",
    d: [
      ["stínka je hmyz, protože má krunýř", "Pevný povrch těla mají všichni členovci, nejen hmyz."],
      ["stínka je hmyz, protože žije na souši", "Na souši žijí i pavoukovci a někteří korýši. Prostředí skupinu neurčí."],
      ["stínka je pavoukovec, protože má hodně nohou", "Pavoukovci nemají tykadla. Stínka tykadla má."],
    ],
    h: [
      "Postup: porovnej počet nohou a to, čím stínka a hmyz dýchají.",
      "Hmyz má šest nohou a dýchá vzdušnicemi. Spočítej nohy stínky a vybav si, proč se drží ve vlhku.",
    ],
    e: "Hmyz má tři páry nohou a dýchá vzdušnicemi. Stínka má nohou víc a dýchá jako ostatní korýši žábrami, proto hmyz není. Je to korýš.",
  },
];

const genL1 = () => uloha(pick(L1));
const genL2 = () => uloha(pick(L2));
const genL3 = () => uloha(pick(L3));

function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const KORYSI_TOPICS: TopicMetadata[] = [
  {
    id: "g6-pri-korysi-6",
    rvpNodeId: "g6-prirodopis-biologie-zivocichu-bezobratli-clenovci-uvod-korysi-rak-krab-dafnie",
    displayName: "Korýši – rak, krab, dafnie",
    title: "Korýši - rak, krab, dafnie",
    studentTitle: "Korýši: rak, krab, dafnie a stínka",
    subject: "prirodopis",
    category: "Biologie živočichů",
    topic: "Bezobratlí - členovci (úvod)",
    briefDescription: "Poznáš korýše podle krunýře, tykadel a žaber a odlišíš je od hmyzu.",
    keywords: [
      "korýši", "korýš", "rak říční", "krab", "dafnie", "stínka", "krunýř", "hlavohruď",
      "zadeček", "tykadla", "žábry", "klepeta", "členovci",
    ],
    goals: [
      "Poznat korýše podle krunýře, dvou párů tykadel, žaber a kráčivých nohou.",
      "Odlišit korýše od hmyzu, pavoukovců a měkkýšů.",
      "Vysvětlit význam raka říčního, dafnie a stínky a spojit znak s jeho funkcí.",
    ],
    boundaries: [
      "Jen zástupci z běžných učebnic 6. ročníku; latinské názvy nejsou klíčem.",
      "Přesný počet nohou stínky a stavba jejích dýchacích orgánů se nerozebírají.",
      "Srovnání s hmyzem a pavoukovci jen v základních znacích (nohy, tykadla, dýchání).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Korýš má krunýř, tělo z hlavohrudi a zadečku, dva páry tykadel a dýchá žábrami. Hmyz má tři páry nohou a jeden pár tykadel, pavoukovci čtyři páry nohou a žádná tykadla.",
      steps: [
        "Spočítej nohy: šest, osm, nebo víc?",
        "Spočítej tykadla: žádná, jeden pár, nebo dva páry?",
        "Zjisti, čím živočich dýchá, a podle všech tří znaků ho zařaď.",
      ],
      commonMistake: "Považovat stínku za hmyz, splést pár nohou s jednou nohou nebo si myslet, že rak dýchá plícemi.",
      example: "Živočich s krunýřem, dvěma páry tykadel, deseti nohama a žábrami je korýš, třeba rak říční.",
    },
  },
];
