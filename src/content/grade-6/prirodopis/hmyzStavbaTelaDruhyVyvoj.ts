/**
 * Přírodopis 6. ročník — Hmyz: stavba těla, druhy, vývoj (categorize).
 *
 * Všechny tři úrovně třídí šest položek do dvou košů, typy úloh se nemíchají.
 *
 * - L1 (zapamatování): známí živočichové podle jména → „Hmyz“ / „Není hmyz“.
 *   Mezi tím, co hmyz není, jsou jen typické pasti (pavoukovci, stonožky,
 *   mnohonožky, korýši, žížala, hlemýžď). V každé úloze je aspoň jeden pavoukovec.
 * - L2 (použití): druhy hmyzu podle vývoje → proměna dokonalá / nedokonalá.
 *   V každé úloze je aspoň jeden hmyz s vodní larvou (vážka, šídlo, jepice),
 *   jehož larva dospělci nepodobá, a přesto má proměnu nedokonalou.
 *   Rozhoduje kukla, ne podobnost larvy.
 * - L3 (přenos): popisy bez jména. Varianta A třídí podle znaků těla,
 *   varianta B podle popsaného vývoje. Varianty se v jedné úloze nemíchají.
 *
 * Fakta: tělo hmyzu = hlava, hruď, zadeček; tři páry nohou a křídla na hrudi;
 * jeden pár tykadel. Pavoukovci: hlavohruď, čtyři páry nohou, bez tykadel.
 * Korýši: krunýř, rak má pět párů nohou. Blechy mají proměnu dokonalou,
 * vši nedokonalou. Číslovky jsou psané slovy (bez dosazování čísel).
 *
 * Generátor nemá stav mezi voláními: počítadlo variant L3 se nastavuje
 * na začátku `gen()`.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, shuffle, buildCategorizeTask as cat, ruzneUlohy } from "./_shared";

type Polozka = {
  /** text položky, jak ho žák vidí */
  t: string;
  /** proč patří do svého koše (pokračování věty za „protože“) */
  proc: string;
  /** značky pro nápovědu a pravidla výběru */
  z?: Znak[];
};
type Znak = "pavoukovec" | "clanky" | "korys" | "bez-nohou" | "vodni-larva" | "bezkridly" | "podobnost";

// ── Koše ─────────────────────────────────────────────────────────────────
const HMYZ = "Hmyz";
const NENI = "Není hmyz";
const DOK_L2 = "Proměna dokonalá (s kuklou)";
const NED_L2 = "Proměna nedokonalá (bez kukly)";
const DOK_L3 = "Proměna dokonalá";
const NED_L3 = "Proměna nedokonalá";

// ── L1: jména ────────────────────────────────────────────────────────────
const L1_HMYZ: Polozka[] = [
  { t: "včela medonosná", proc: "má tři páry nohou, tykadla a dva páry křídel na hrudi" },
  { t: "mravenec", proc: "má tělo z hlavy, hrudi a zadečku, tři páry nohou a tykadla" },
  { t: "chroust", proc: "je brouk: má tři páry nohou, tykadla a blanitá křídla krytá krovkami" },
  { t: "slunéčko sedmitečné", proc: "je malý brouk se třemi páry nohou a krátkými tykadly" },
  { t: "moucha domácí", proc: "má tři páry nohou, tykadla a jeden pár křídel na hrudi" },
  { t: "komár", proc: "má tři páry dlouhých nohou, tykadla a jeden pár křídel" },
  { t: "kobylka", proc: "má tři páry nohou (zadní skákavé), dlouhá tykadla a křídla na hrudi" },
  { t: "vážka", proc: "má tři páry nohou, krátká tykadla a dva páry křídel na hrudi" },
  { t: "čmelák", proc: "má tři páry nohou, tykadla a dva páry křídel jako včela" },
  { t: "babočka paví oko", proc: "je motýl: má tři páry nohou, tykadla a dva páry křídel" },
  { t: "šváb", proc: "má tělo z hlavy, hrudi a zadečku, tři páry nohou a dlouhá tykadla" },
  { t: "blecha", proc: "má tři páry nohou a tykadla; křídla nemá, a přesto je to hmyz" },
  { t: "veš", proc: "má tři páry nohou a tykadla; bezkřídlý parazit, ale pořád hmyz" },
];
const L1_PAVOUKOVCI: Polozka[] = [
  { t: "pavouk křižák", proc: "je pavoukovec: má čtyři páry nohou, hlavohruď a nemá tykadla", z: ["pavoukovec"] },
  { t: "klíště", proc: "je pavoukovec: dospělé klíště má čtyři páry nohou a nemá tykadla", z: ["pavoukovec"] },
  { t: "sekáč", proc: "je pavoukovec: má čtyři páry dlouhých nohou a nemá tykadla", z: ["pavoukovec"] },
  { t: "štír", proc: "je pavoukovec: má čtyři páry nohou, klepítka a nemá tykadla", z: ["pavoukovec"] },
];
const L1_JINI: Polozka[] = [
  { t: "stonožka", proc: "má na každém článku trupu jeden pár nohou, tedy mnoho párů", z: ["clanky"] },
  { t: "mnohonožka", proc: "má na většině článků těla dva páry nohou, tedy desítky párů", z: ["clanky"] },
  { t: "rak říční", proc: "je korýš: má tvrdý krunýř a pět párů nohou", z: ["korys"] },
  { t: "stínka", proc: "je suchozemský korýš, který žije pod kameny a ve vlhku: má sedm párů nohou", z: ["korys"] },
  { t: "žížala", proc: "je kroužkovec: nemá žádné nohy ani tykadla", z: ["bez-nohou"] },
  { t: "hlemýžď", proc: "je měkkýš: nemá článkované nohy, leze po svalnaté noze", z: ["bez-nohou"] },
];

// ── L2: druhy podle vývoje ───────────────────────────────────────────────
const L2_DOK: Polozka[] = [
  { t: "babočka paví oko", proc: "se housenka zakuklí a z kukly vylétne motýl" },
  { t: "bělásek zelný", proc: "se jeho housenka mění v kuklu a teprve z ní vyletí motýl" },
  { t: "včela medonosná", proc: "se larva v buňce plástu zakuklí a z kukly vyleze dospělá včela" },
  { t: "čmelák", proc: "stejně jako včela prochází stadiem kukly" },
  { t: "mravenec", proc: "se beznohá larva zakuklí; „mravenčí vajíčka“ jsou ve skutečnosti kukly" },
  { t: "moucha domácí", proc: "z beznohé larvy vznikne kukla a z ní teprve moucha" },
  { t: "komár", proc: "se vodní larva promění v kuklu (také ve vodě) a z kukly vylétne komár" },
  { t: "chroust", proc: "larva (ponrava) žije v půdě, pak se zakuklí a vyleze brouk" },
  { t: "slunéčko sedmitečné", proc: "se jeho larva přichytí na list a zakuklí" },
  { t: "blecha", proc: "se larva zapřede do zámotku a zakuklí, i když dospělá blecha nemá křídla", z: ["bezkridly"] },
  { t: "mandelinka bramborová", proc: "se larva zakuklí v půdě a z kukly vyleze brouk" },
];
const L2_NED_VODNI: Polozka[] = [
  { t: "vážka", proc: "vodní larva sice dospělci nepodobá, ale kuklu nemá: dospělec vyleze přímo z ní", z: ["vodni-larva"] },
  { t: "šídlo modré", proc: "je příbuzné vážce: z vodní larvy vyleze dospělec přímo, bez kukly", z: ["vodni-larva"] },
  { t: "jepice", proc: "larva žije ve vodě a roste svlékáním; okřídlená jepice se pak ještě jednou svlékne, kuklu ale nemá", z: ["vodni-larva"] },
];
const L2_NED_JINE: Polozka[] = [
  { t: "kobylka zelená", proc: "larva vypadá jako malá kobylka bez křídel a jen se svléká" },
  { t: "saranče", proc: "larva je podobná dospělci, roste svlékáním a kuklu nemá" },
  { t: "cvrček polní", proc: "mládě vypadá jako malý cvrček a křídla mu dorostou bez kukly" },
  { t: "šváb", proc: "z vajíček se líhnou malí švábi bez křídel, kuklu nemají" },
  { t: "veš dětská", proc: "larva vypadá jako malá veš a po svlékáních dospěje bez kukly", z: ["bezkridly"] },
  { t: "mšice", proc: "mladé mšice jsou podobné dospělým a kuklu nemají" },
  { t: "kněžice (ploštice)", proc: "larva je podobná dospělci, jen nemá křídla; kukla chybí" },
  { t: "škvor obecný", proc: "mladí škvoři vypadají jako dospělí, jen menší, a kuklu nemají" },
];

// ── L3 A: popisy těla ────────────────────────────────────────────────────
const L3_TELO_HMYZ: Polozka[] = [
  { t: "Tři páry článkovaných nohou na hrudi a jeden pár tykadel.", proc: "tři páry nohou a tykadla jsou znaky hmyzu" },
  { t: "Tělo z hlavy, hrudi a zadečku, šest nohou, žádná křídla.", proc: "tři části těla a šest nohou rozhodují, chybějící křídla ne", z: ["bezkridly"] },
  { t: "Na hrudi dva páry blanitých křídel a tři páry nohou, na hlavě tykadla.", proc: "křídla i tři páry nohou vyrůstají z hrudi, to umí jen hmyz" },
  { t: "Tělo z hlavy, hrudi a zadečku, na hlavě tykadla a složené oči.", proc: "tělo rozdělené na hlavu, hruď a zadeček a tykadla má hmyz" },
  { t: "Šest nohou vyrůstá z hrudi, zadeček je úplně bez nohou.", proc: "šest nohou jen na hrudi je stavba hmyzu" },
  { t: "Tři páry nohou, jeden pár tvrdých krovek a pod nimi blanitá křídla.", proc: "tři páry nohou a křídla s krovkami má brouk, tedy hmyz" },
  { t: "Drobný tvor bez křídel skáče v srsti psa, má šest nohou a krátká tykadla.", proc: "šest nohou a tykadla mají i bezkřídlí zástupci hmyzu", z: ["bezkridly"] },
  { t: "Tři páry nohou, jen jeden pár křídel a krátká tykadla na hlavě.", proc: "tři páry nohou a tykadla ukazují na hmyz, počet křídel nerozhoduje" },
];
const L3_TELO_NENI: Polozka[] = [
  { t: "Tělo z hlavohrudi a zadečku, čtyři páry nohou, bez tykadel.", proc: "hlavohruď, čtyři páry nohou a chybějící tykadla má pavoukovec", z: ["pavoukovec"] },
  { t: "Čtyři páry nohou, bez tykadel, přisává se na kůži a saje krev.", proc: "čtyři páry nohou a žádná tykadla má pavoukovec, ne hmyz", z: ["pavoukovec"] },
  { t: "Čtyři páry dlouhých tenkých nohou, tělo jako jedna kulička, bez tykadel.", proc: "čtyři páry nohou bez tykadel patří pavoukovci", z: ["pavoukovec"] },
  { t: "Hlavohruď s klepítky, čtyři páry nohou a na konci zadečku jedový osten.", proc: "hlavohruď a čtyři páry nohou jsou znaky pavoukovce", z: ["pavoukovec"] },
  { t: "Mnoho párů nohou (patnáct i více), po jednom páru na každém článku trupu.", proc: "hmyz má jen tři páry nohou, mnoho párů má stonožka", z: ["clanky"] },
  { t: "Dlouhé válcovité tělo z mnoha článků, na většině článků dva páry nohou.", proc: "tolik nohou má mnohonožka, hmyz má jen tři páry", z: ["clanky"] },
  { t: "Pět párů nohou, tvrdý krunýř, žije ve vodě.", proc: "pět párů nohou a krunýř má korýš", z: ["korys"] },
  { t: "Sedm párů nohou, šedý krunýř, žije pod kameny na souši.", proc: "sedm párů nohou a krunýř má suchozemský korýš", z: ["korys"] },
];

// ── L3 B: popisy vývoje ──────────────────────────────────────────────────
const L3_VYVOJ_DOK: Polozka[] = [
  { t: "Housenka se několikrát svlékne, pak se přichytí na větvičku, přestane žrát a v tvrdém obalu se za pár týdnů přemění v dospělce.", proc: "mezi housenkou a dospělcem je stadium, které nežere a mění stavbu těla, tedy kukla" },
  { t: "Beznohá larva přestane žrát, na několik dní ztuhne v hnědém obalu a pak se z něj vyklube dospělec s křídly.", proc: "ztuhlé stadium v obalu, které nežere, je kukla" },
  { t: "Larva žije tři roky v půdě a několikrát se svlékne, pak si vyhloubí dutinu, přestane žrát a její tělo se tam přestaví v dospělce s krovkami.", proc: "před dospělcem je stadium, které nežere a přestavuje tělo, tedy kukla" },
  { t: "Larvy krmené v buňkách plástu rostou a svlékají se, pak přestanou žrát, dělnice buňky zavíčkují a uvnitř se jejich tělo přemění v dospělce.", proc: "v zavíčkované buňce prochází larva stadiem kukly" },
  { t: "Larva visí ve vodě u hladiny a svléká se, pak se změní v tvora zcela jiného tvaru, který už nežere, a teprve z něj vylétne dospělec.", proc: "stadium, které nežere a ze kterého teprve vylétne dospělec, je kukla, i když larva žije ve vodě", z: ["vodni-larva"] },
  { t: "Larva nepodobná dospělci přestane žrát a několik dní leží nehybně v obalu, teprve pak se objeví dospělec.", proc: "nehybné stadium v obalu je kukla", z: ["podobnost"] },
  { t: "Housenka kolem sebe upřede hedvábné vlákno, uvnitř přestane žrát a její tělo se změní v dospělce s křídly.", proc: "v obalu z vlákna prochází housenka stadiem kukly" },
  { t: "Larva žije v hnoji a svléká se, pak na pár dní ztvrdne v soudečkovitý obal a z něj vylétne dospělec.", proc: "ztvrdlý obal, ve kterém jedinec nežere, je kukla" },
];
const L3_VYVOJ_NED: Polozka[] = [
  { t: "Z vajíčka se líhne larva podobná dospělci, jen bez křídel, a několikrát se svléká.", proc: "se larva jen svléká a roste, klidové stadium chybí", z: ["podobnost"] },
  { t: "Larva žije ve vodě, dýchá žábrami a po posledním svlékání z ní vyleze okřídlený dospělec.", proc: "dospělec vzniká z larvy svlékáním, kukla chybí, i když larva dospělci nepodobá", z: ["vodni-larva"] },
  { t: "Mladý jedinec vypadá jako malý dospělec bez křídel, roste a svléká se, až má křídla.", proc: "vývoj probíhá jen svlékáním, bez klidového stadia", z: ["podobnost"] },
  { t: "Larva loví pod vodou, pak vyleze na stéblo, naposledy se svlékne a vyleze z ní okřídlený dospělec.", proc: "dospělec vzniká z larvy posledním svlékáním, bez klidového stadia", z: ["vodni-larva"] },
  { t: "Nymfa podobná dospělci saje rostlinné šťávy a po několika svlékáních dospěje.", proc: "nymfa dospívá svlékáním, klidové stadium chybí", z: ["podobnost"] },
  { t: "Mládě bez křídel skáče v trávě jako dospělec, křídla mu dorůstají s každým svlékáním.", proc: "křídla dorůstají postupně při svlékání, kukla chybí" },
  { t: "Larvy vypadají jako zmenšení dospělci a celý život sají krev na hlavě člověka.", proc: "se larvy od dospělců liší jen velikostí a klidové stadium nemají", z: ["podobnost"] },
  { t: "Z vajíček na listu se líhnou drobní jedinci stejného tvaru těla jako dospělci, sají šťávu a při každém svlékání povyrostou.", proc: "mláďata rostou jen svlékáním a klidové stadium nemají", z: ["podobnost"] },
];

// ── Zadání (L1, L2 a L3 bez společných slov) ─────────────────────────────
const ZADANI_L1 = "Roztřiď živočichy: patří mezi hmyz, nebo ne?";
const ZADANI_L2 = "Jak se vyvíjí tyto druhy hmyzu? Zařaď je podle typu proměny.";
const ZADANI_L3A = "Přečti popisy neznámých tvorů a rozhodni o každém z nich.";
const ZADANI_L3B = "Přečti, co pozorovatel zapsal o vývoji, a rozhodni o každém zápisu.";

const ma = (xs: Polozka[], z: Znak) => xs.some((x) => x.z?.includes(z));
/** Položky seřazené podle pořadí v bance — pořadí v koši pak netvoří nové úlohy. */
const podleBanky = (banka: Polozka[], vyber: Polozka[]) => banka.filter((x) => vyber.includes(x));

function sestav(
  zadani: string,
  kose: [string, Polozka[]][],
  hints: [string, string],
): PracticeTask {
  const vse = shuffle(kose.flatMap(([kos, p]) => p.map((x) => ({ ...x, kos }))));
  return cat(
    zadani,
    kose.map(([name, p]) => ({ name, items: p.map((x) => x.t) })),
    {
      hints,
      explanation: vse
        .map((x) => `„${x.t.replace(/\.$/, "")}“ patří do skupiny „${x.kos}“, protože ${x.proc}.`)
        .join(" "),
    },
  );
}

// ── L1 ───────────────────────────────────────────────────────────────────
function genL1(): PracticeTask {
  const hmyz = podleBanky(L1_HMYZ, pickN(L1_HMYZ, 3));
  const pavouk = pickN(L1_PAVOUKOVCI, 1);
  const zbytekNeni = [...L1_PAVOUKOVCI.filter((x) => !pavouk.includes(x)), ...L1_JINI];
  const neniBanka = [...L1_PAVOUKOVCI, ...L1_JINI];
  const neni = podleBanky(neniBanka, [...pavouk, ...pickN(zbytekNeni, 2)]);

  const h0 = [
    "Spočítej u každého živočicha páry nohou: jsou to tři páry, nebo víc či žádné?",
    ma(neni, "clanky") ? "U dlouhého článkovaného těla nepočítej články, ale nohy na nich." : "",
    ma(neni, "korys") ? "Krunýř ani život ve vodě o skupině nerozhoduje, rozhodují nohy." : "",
    ma(neni, "bez-nohou") ? "Kdo nemá žádné článkované nohy, nemůže mít ani tři páry." : "",
  ].filter(Boolean).join(" ");
  const h1 = [
    "Zkontroluj, jestli má živočich tykadla a tělo rozdělené na tři části: hlavu, hruď a zadeček.",
    "Osminohý živočich s hlavohrudí tykadla nemá.",
    hmyz.some((x) => /blecha|veš/.test(x.t)) ? "Chybějící křídla o zařazení nerozhodují." : "",
  ].filter(Boolean).join(" ");

  return sestav(ZADANI_L1, [[HMYZ, hmyz], [NENI, neni]], [h0, h1]);
}

// ── L2 ───────────────────────────────────────────────────────────────────
function genL2(): PracticeTask {
  const dok = podleBanky(L2_DOK, pickN(L2_DOK, 3));
  const nedBanka = [...L2_NED_VODNI, ...L2_NED_JINE];
  const vodni = pickN(L2_NED_VODNI, 1);
  const ned = podleBanky(nedBanka, [...vodni, ...pickN(nedBanka.filter((x) => !vodni.includes(x)), 2)]);
  const vse = [...dok, ...ned];

  const h0 = [
    "U každého druhu si vybav celý vývoj od vajíčka: je v něm stadium kukly, kdy jedinec nežere a jeho tělo se přestavuje na dospělce?",
    ma(vse, "vodni-larva") ? "Nenech se zmást tím, že larva žije jinde a vypadá jinak než dospělec." : "",
  ].filter(Boolean).join(" ");
  const h1 = [
    "Vybav si, co u daného druhu následuje po larvě: vznikne z ní nejdřív kukla, nebo jen dál roste?",
    "Kde kukla chybí, mění se larva postupným svlékáním v dospělého jedince.",
    ma(vse, "bezkridly") ? "To, jestli má dospělec křídla, o typu vývoje nerozhoduje." : "",
  ].filter(Boolean).join(" ");

  return sestav(ZADANI_L2, [[DOK_L2, dok], [NED_L2, ned]], [h0, h1]);
}

// ── L3 ───────────────────────────────────────────────────────────────────
function genL3Telo(): PracticeTask {
  const hmyz = podleBanky(L3_TELO_HMYZ, pickN(L3_TELO_HMYZ, 3));
  const neni = podleBanky(L3_TELO_NENI, pickN(L3_TELO_NENI, 3));
  const vse = [...hmyz, ...neni];

  const h0 = [
    "Hledej v každém popisu počet nohou a počet částí těla, ne to, jak tvor žije.",
    ma(vse, "bezkridly") ? "Chybějící křídla o zařazení nerozhodují." : "",
    ma(vse, "korys") ? "Tvrdý krunýř ani život ve vodě také ne." : "",
  ].filter(Boolean).join(" ");
  const h1 = [
    "Stačí jeden jasný znak: tři páry nohou, nebo tělo rozdělené na hlavu, hruď a zadeček.",
    ma(vse, "pavoukovec") ? "Čtyři páry nohou a hlavohruď ukazují na jiné členovce." : "",
    ma(vse, "clanky") ? "Tvor s mnoha páry nohou na článcích mezi šestinohé nepatří." : "",
  ].filter(Boolean).join(" ");

  return sestav(ZADANI_L3A, [[HMYZ, hmyz], [NENI, neni]], [h0, h1]);
}

function genL3Vyvoj(): PracticeTask {
  const vodni = L3_VYVOJ_NED.filter((x) => x.z?.includes("vodni-larva"));
  const prvni = pickN(vodni, 1);
  // jen jedna vodní larva v úloze — dva skoro stejné zápisy by se opakovaly
  const suchozemske = L3_VYVOJ_NED.filter((x) => !x.z?.includes("vodni-larva"));
  const ned = podleBanky(L3_VYVOJ_NED, [...prvni, ...pickN(suchozemske, 2)]);
  const dok = podleBanky(L3_VYVOJ_DOK, pickN(L3_VYVOJ_DOK, 3));
  const vse = [...dok, ...ned];

  const h0 = [
    "Rozhoduje jen to, zda je ve vývoji klidové stadium, kdy jedinec nežere a přestavuje své tělo.",
    ma(vse, "vodni-larva") ? "Kde larva žije, o typu vývoje nerozhoduje." : "",
  ].filter(Boolean).join(" ");
  const h1 = [
    "Hledej, zda je mezi larvou a dospělcem období, kdy jedinec nežere a mění stavbu těla.",
    "Kde takové období chybí a larva se postupným svlékáním mění v dospělého jedince, jde o druhý typ vývoje. Svlékání samo nerozhoduje, larvy se svlékají u obou typů.",
    ma(vse, "podobnost") ? "Podobnost larvy s dospělcem sama o ničem nerozhoduje." : "",
  ].filter(Boolean).join(" ");

  return sestav(ZADANI_L3B, [[DOK_L3, dok], [NED_L3, ned]], [h0, h1]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return ruzneUlohy(() => genL1());
  if (level === 2) return ruzneUlohy(() => genL2());
  let i = 0; // střídání variant L3 — nastavuje se při každém volání, modul nemá stav
  return ruzneUlohy(() => (i++ % 2 === 0 ? genL3Telo() : genL3Vyvoj()));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const HMYZ_STAVBA_TELA_DRUHY_VYVOJ: TopicMetadata[] = [
  {
    id: "g6-pri-hmyz-stavba-tela-druhy-vyvoj-6",
    rvpNodeId: "g6-prirodopis-biologie-zivocichu-bezobratli-clenovci-uvod-hmyz-stavba-tela-druhy-vyvoj",
    displayName: "Hmyz a jeho proměna",
    title: "Hmyz - stavba těla, druhy, vývoj",
    studentTitle: "Hmyz a jeho proměna",
    subject: "prirodopis",
    category: "Biologie živočichů",
    topic: "Bezobratlí - členovci (úvod)",
    briefDescription: "Poznáš hmyz podle stavby těla a rozlišíš proměnu dokonalou a nedokonalou",
    keywords: [
      "hmyz", "stavba těla hmyzu", "hlava hruď zadeček", "tykadla", "křídla",
      "pavoukovci", "proměna dokonalá", "proměna nedokonalá", "kukla", "larva", "housenka", "členovci",
    ],
    goals: [
      "Poznat hmyz podle stavby těla: hlava, hruď, zadeček, tři páry nohou, tykadla, křídla na hrudi.",
      "Odlišit hmyz od pavoukovců, stonožek, mnohonožek a korýšů.",
      "Zařadit vývoj hmyzu jako proměnu dokonalou (s kuklou) nebo nedokonalou (bez kukly).",
      "Rozhodnout o neznámém živočichovi nebo vývoji podle popsaných znaků.",
    ],
    boundaries: [
      "Jen znaky hmyzu a jeho odlišení od ostatních členovců a známých bezobratlých.",
      "Rozhoduje přítomnost kukly, ne podobnost larvy s dospělcem.",
      "Bez latinských názvů a bez podrobného systému řádů hmyzu.",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Hmyz má tělo z hlavy, hrudi a zadečku, tři páry nohou, jeden pár tykadel a křídla na hrudi. U vývoje rozhoduje, jestli je v něm kukla.",
      steps: [
        "Spočítej páry nohou: tři páry = hmyz, čtyři páry = pavoukovec, mnoho párů = stonožka nebo mnohonožka.",
        "Zkontroluj tykadla a části těla: pavoukovci tykadla nemají a mají hlavohruď.",
        "U vývoje hledej kuklu: vajíčko, larva, kukla, dospělec = proměna dokonalá.",
        "Chybí-li kukla (vajíčko, larva, dospělec), jde o proměnu nedokonalou.",
      ],
      commonMistake: "Myslet si, že vážka má proměnu dokonalou, protože její vodní larva vypadá jinak než dospělec. Rozhoduje kukla, a tu vážka nemá.",
      example: "Pavouk = není hmyz (čtyři páry nohou). Moucha = hmyz s proměnou dokonalou. Kobylka = hmyz s proměnou nedokonalou.",
    },
  },
];
