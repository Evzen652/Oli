/**
 * Přírodopis 6. ročník — Pavoukovci: pavouci, štíři, klíšťata (select_one).
 *
 * Fakta, na kterých se shodují učebnice 6. ročníku (Fraus, Nová škola, SPN)
 * a doporučení SZÚ a MZd ČR k ochraně před klíšťaty:
 * tělo z hlavohrudi a zadečku, 4 páry kráčivých nohou, bez tykadel a křídel;
 * klepítka s jedovou žlázou (pavouci), snovací bradavky na zadečku, mimotělní
 * trávení; zástupci křižák, sklípkan, vodouch (zvon se vzduchem), sekáč
 * (pavoukovec, ne pavouk), štír (jedový osten na konci zadečku), klíště
 * (saje krev, přenáší klíšťovou encefalitidu a lymeskou boreliózu), roztoči.
 * Pro lidi je zatím k dispozici jen očkování proti klíšťové encefalitidě. Klíště se vytahuje
 * pinzetou u kůže, celé, bez oleje; místo se vydezinfikuje a sleduje.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • pavouk je hmyz (3 páry nohou, tři části těla, tykadla, křídla),
 *  • klíště je hmyz nebo „brouček“, protože saje krev jako blecha či komár,
 *  • lidové rady u klíštěte (olej, máslo, stisk prsty, ranku nesledovat),
 *  • záměna nemocí a léčby (očkování proti borelióze, antibiotika na vlastní pěst),
 *  • pavouk žvýká kusadly; stonožka nebo rak jsou pavoukovci.
 *
 *  • L1 — zapamatování: jedna věta, jeden fakt.
 *  • L2 — použití: situace, na kterou se pravidlo aplikuje.
 *  • L3 — přenos: určení z popisu znaků, rozhodnutí v neznámé situaci,
 *    spojení znaku s funkcí. Vždy je mezi možnostmi distraktor, který
 *    odpovídá části znaků, takže úloha nejde vyřešit vylučováním.
 *
 * Každá otázka má pevně tři distraktory, takže jedna otázka = jedna úloha
 * a `ruzneUlohy()` vrátí celou banku úrovně. Generátor nemá stav na úrovni modulu.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad, pluralWithNumber } from "@/lib/czechGrammar";
import { pick, buildChoiceTask as choice, losUlohy, ruzneUlohy } from "./_shared";

interface Fakt {
  q: string;
  key: string;
  /** Přesně tři distraktory: [možnost, proč je to chyba]. */
  d: [string, string][];
  h: [string, string];
  e: string;
}

const uloha = (f: Fakt): PracticeTask | null =>
  choice(
    f.q,
    f.key,
    f.d.map(([value, why]) => ({ value, why })),
    { hints: f.h, explanation: f.e },
  );

const pary = (n: number) => pluralWithNumber(n, "pár", "páry", "párů");
const nohou = (n: number) => pluralWithNumber(n, "noha", "nohy", "nohou");

// Opakovaně používané vysvětlení hlavní miskoncepce.
const STAVBA = `Pavoukovci mají ${pary(4)} nohou a tělo ze dvou částí, hlavohrudi a zadečku.`;
const FB_HMYZ = `To platí pro hmyz. ${STAVBA}`;
const FB_KREV = "Sání krve o skupině nerozhoduje, rozhoduje stavba těla.";
const FB_OLEJ = "Olej klíště rychle nepustí, jen zdrží jeho vytažení, a přidušené klíště může do rány vypustit víc zárodků. Olej ani máslo nepoužívej.";
const FB_ANTIBIOTIKA = "Antibiotika předepisuje jen lékař, když se objeví příznaky. Sám si je nikdo nemá brát.";

// ── L1 — zapamatování ───────────────────────────────────────────────────────
const L1: Fakt[] = [
  {
    q: "Kolik párů nohou má pavouk?",
    key: pary(4),
    d: [
      [pary(3), FB_HMYZ],
      [pary(5), `Pět párů kráčivých nohou má rak, který patří mezi korýše. Pavouk má ${nohou(8)}.`],
      [pary(8), `Pavouk má ${nohou(8)}, ale pár tvoří vždy dvě nohy. Párů je tedy polovina.`],
    ],
    h: [
      "Spočítej páry nohou u pavouka na obrázku v učebnici; hmyz má o pár méně.",
      "Jeden pár tvoří dvě nohy naproti sobě, na levé a pravé straně těla. Když znáš celkový počet nohou pavouka, vyděl ho dvěma.",
    ],
    e: `Pavouk má ${nohou(8)}, tedy ${pary(4)}. Hmyz má o jeden pár méně, ${pary(3)}. Podle toho pavoukovce od hmyzu nejsnáz rozeznáš.`,
  },
  {
    q: "Ze kterých částí se skládá tělo pavouka?",
    key: "z hlavohrudi a zadečku",
    d: [
      ["z hlavy, hrudi a zadečku", "To je stavba těla hmyzu. U pavouka je hlava srostlá s hrudí v jeden celek."],
      ["z hlavy a trupu", "Hlavu a trup má třeba člověk. Pavouk má hlavu srostlou s hrudí a za ní zadeček."],
      ["z mnoha podobných článků", "Z mnoha podobných článků je tělo stonožky. Tělo pavouka má jen dvě části."],
    ],
    h: [
      "Podívej se na pavouka: je jeho hlava oddělená od hrudi, nebo s ní tvoří jeden celek?",
      "Hmyz má tělo ze tří částí. U pavouka jsou dvě přední z nich srostlé dohromady a za nimi je ještě jedna část, na které jsou snovací bradavky.",
    ],
    e: "Tělo pavouka tvoří hlavohruď, tedy srostlá hlava s hrudí, a zadeček. Tělo ze tří částí, hlavy, hrudi a zadečku, má hmyz.",
  },
  {
    q: "Který útvar pavouk na těle nemá?",
    key: "tykadla",
    d: [
      ["oči", "Pavouk oči má, na hlavohrudi jich bývá až osm."],
      ["klepítka s jedem u úst", "Klepítka pavouk má. Nejsou to velká klepeta jako u raka, ale malé útvary u úst, kterými vstřikuje jed."],
      ["snovací bradavky", "Snovací bradavky pavouk má na zadečku a tvoří jimi vlákno."],
    ],
    h: [
      "Vzpomeň si, čím se hmyz dotýká okolí a čichá. Má takový útvar i pavouk?",
      "Pavouk potřebuje vidět, ochromit kořist a tvořit vlákno. Hledej útvar, který mají na hlavě brouci a motýli, ale pavoukovci žádný nemají.",
    ],
    e: "Pavoukovci nemají tykadla ani křídla. Oči, klepítka i snovací bradavky pavouk má.",
  },
  {
    q: "Který z těchto živočichů patří mezi pavoukovce?",
    key: "křižák obecný",
    d: [
      ["mravenec lesní", `Mravenec má ${pary(3)} nohou a tykadla, je to hmyz.`],
      ["stonožka škvorová", `Stonožka má mnohem víc než ${pary(4)} nohou, patří k jiným členovcům.`],
      ["rak říční", `Rak má ${pary(5)} kráčivých nohou a tykadla, patří mezi korýše.`],
    ],
    h: [
      "Vylučuj živočichy, kteří mají tykadla nebo velký počet nohou.",
      "Hmyz má tři páry nohou a tykadla, korýši tykadla a pět párů kráčivých nohou, stonožky desítky nohou. Zbývá živočich, který si na zahradě splétá kruhovou síť.",
    ],
    e: `Křižák obecný je pavouk: má ${pary(4)} nohou, tělo z hlavohrudi a zadečku a nemá tykadla. Mravenec je hmyz, rak korýš a stonožka patří ke stonožkovcům.`,
  },
  {
    q: "Který z těchto živočichů je pavoukovec, a ne hmyz?",
    key: "klíště obecné",
    d: [
      ["blecha obecná", `${FB_KREV} Blecha má ${pary(3)} nohou a je to hmyz.`],
      ["komár pisklavý", `${FB_KREV} Komár má ${pary(3)} nohou a křídla, je to hmyz.`],
      ["štěnice domácí", `${FB_KREV} Štěnice má ${pary(3)} nohou a tykadla, je to hmyz.`],
    ],
    h: [
      "Všichni tito živočichové sají krev. Rozhoduj podle stavby těla, ne podle potravy.",
      "Hmyz má tři páry nohou a tykadla. Hledej drobného živočicha bez tykadel, který čeká v trávě na hostitele a má o pár nohou víc.",
    ],
    e: `Klíště obecné má v dospělosti ${pary(4)} nohou a nemá tykadla, je to pavoukovec. Blecha, komár i štěnice také sají krev, ale jsou to hmyz.`,
  },
  {
    q: "Který živočich z nabídky je pavoukovec žijící hlavně v teplých krajích?",
    key: "štír",
    d: [
      ["rak", `Rak má také klepeta, ale i tykadla a ${pary(5)} nohou. Je to korýš.`],
      ["kudlanka", `Kudlanka žije v teple a loví, ale má ${pary(3)} nohou a křídla. Je to hmyz.`],
      ["stonožka", `Stonožka má mnohem víc než ${pary(4)} nohou, patří k jiným členovcům.`],
    ],
    h: [
      "Hledej živočicha bez tykadel a křídel, který má čtyři páry nohou.",
      "Kudlanka má křídla a tykadla, rak tykadla a pět párů kráčivých nohou, stonožka desítky nohou. Zbývá živočich s velkými klepety a jedovým ostnem na konci těla.",
    ],
    e: `Štír je pavoukovec: má ${pary(4)} nohou, velká klepeta a na konci zadečku jedový osten. Žije hlavně v teplých krajích.`,
  },
  {
    q: "Který z těchto živočichů s dlouhýma tenkýma nohama patří mezi pavoukovce?",
    key: "sekáč",
    d: [
      ["komár", `Komár má dlouhé nohy, ale také křídla a jen ${pary(3)} nohou. Je to hmyz.`],
      ["stonožka", `Stonožka má mnohem víc než ${pary(4)} nohou, patří k jiným členovcům.`],
      ["koník luční", `Koník má dlouhé skákací nohy, ale ${pary(3)} nohou a tykadla. Je to hmyz.`],
    ],
    h: [
      "Dlouhé nohy o skupině nerozhodují. Hledej živočicha bez křídel a bez tykadel.",
      "Komár má křídla, koník tykadla a tři páry nohou, stonožka desítky nohou. Zbývá živočich s osmi velmi dlouhými nohama, který často sedí na zdech a kmenech.",
    ],
    e: `Sekáč má ${pary(4)} dlouhých nohou a nemá tykadla ani křídla, patří tedy mezi pavoukovce. Pavouk to ale není: nemá snovací bradavky ani jed a hlavohruď mu splývá se zadečkem v jeden celek.`,
  },
  {
    q: "Čím pavouk vytváří vlákno na pavučinu?",
    key: "snovacími bradavkami",
    d: [
      ["klepítky u úst", "Klepítky pavouk kouše a vstřikuje jed. Vlákno z nich nevychází."],
      ["slinnými žlázami v ústech", "Ze slinných žláz spřádá vlákno housenka bource. Pavouk ho tvoří na zadečku."],
      ["zadními nohami", "Nohama pavouk vlákno jen přidržuje a natahuje, netvoří ho."],
    ],
    h: [
      "Vlákno vychází ze zadní části těla pavouka.",
      "Hledej útvar na zadečku, ne na hlavohrudi. Klepítka slouží k lovu a nohy vlákno jen natahují a upevňují.",
    ],
    e: "Pavouk tvoří vlákno snovacími bradavkami na konci zadečku. Z bradavek vychází tekutá hmota, která při vytahování ztuhne ve vlákno. Nohama ho pavouk natahuje do sítě.",
  },
  {
    q: "Čím pavouk ochromí svou kořist?",
    key: "jedem z klepítek",
    d: [
      ["jedem z ostnu na zadečku", "Jedový osten na konci zadečku má štír, pavouk ne."],
      ["stiskem kráčivých nohou", "Nohama pavouk kořist drží, ale ochromí ji jed."],
      ["kyselinou ze snovacích bradavek", "Snovací bradavky tvoří vlákno, jed z nich nevychází."],
    ],
    h: [
      "Jedovou žlázu má pavouk vpředu, u úst.",
      "Snovací bradavky na zadečku tvoří vlákno a nohy slouží k chůzi. Kořist pavouk kousne útvary, které má po stranách úst.",
    ],
    e: "Pavouk kořist kousne klepítky a vstříkne do ní jed. Jed kořist ochromí nebo zabije. Osten s jedem má štír.",
  },
  {
    q: "Kde má štír jedový osten?",
    key: "na konci zadečku",
    d: [
      ["na hlavohrudi u úst", "U úst má štír klepítka, osten tam není."],
      ["na konci klepet", "Klepety štír kořist chytá a drží, jed jimi nevstřikuje."],
      ["na posledním páru nohou", "Nohy slouží k chůzi, jed v nich není."],
    ],
    h: [
      "Vybav si štíra v útočném postoji: kterou část těla zvedá vysoko nad sebe?",
      "Klepeta jsou vpředu a slouží k chycení kořisti. Jed štír vstříkne útvarem na opačné straně těla, který nosí prohnutý nad hlavohrudí.",
    ],
    e: "Štír má jedový osten na konci zadečku. Zadeček nosí zdvižený nad tělem a osten zabodne do kořisti nebo útočníka.",
  },
  {
    q: "Čím se živí klíště?",
    key: "sáním krve",
    d: [
      ["sáním rostlinných šťáv", "Rostlinné šťávy sají třeba mšice. Klíště potřebuje krev živočichů."],
      ["lovem drobného hmyzu", "Hmyz loví pavouci. Klíště kořist neloví, přisaje se na hostitele."],
      ["požíráním tlejícího listí", "Tlející listí zpracovávají třeba žížaly. Klíště se přisává na živočichy."],
    ],
    h: [
      "Klíště se na člověka nebo zvíře přisaje a zůstane na něm několik dní. Co z něj bere?",
      "Klíště se přisaje do kůže a několik dní se zvětšuje, až je velké jako hrášek. Co mu z hostitele celou dobu proudí do těla?",
    ],
    e: "Klíště se živí krví. Přisaje se do kůže člověka nebo zvířete a několik dní saje. Při tom může přenést nemoc.",
  },
  {
    q: "Kterou nemoc může přenášet klíště?",
    key: "klíšťovou encefalitidu",
    d: [
      ["tropickou malárii", "Malárii přenáší komár v tropech, ne klíště."],
      ["africkou spavou nemoc", "Spavou nemoc přenáší africká moucha tse-tse, ne klíště."],
      ["sezonní chřipku", "Chřipku způsobuje virus a šíří se kapénkami."],
    ],
    h: [
      "Vyluč nemoci, které přenáší jiný živočich nebo které se šíří vzduchem.",
      "Malárii přenáší komár, spavou nemoc africká moucha a chřipka se šíří kapénkami. Klíště přenáší nemoc, která napadá mozek a mozkové blány.",
    ],
    e: "Klíště může přenést klíšťovou encefalitidu, zánět mozku a mozkových blan. Proti ní se dá nechat očkovat.",
  },
  {
    q: "Která nemoc se šíří přisátím klíštěte?",
    key: "lymeská borelióza",
    d: [
      ["tropická malárie", "Malárii přenáší komár v tropech, ne klíště."],
      ["africká spavá nemoc", "Spavou nemoc přenáší africká moucha tse-tse."],
      ["tetanus", "Tetanus vzniká po znečištění rány hlínou, klíště ho nepřenáší."],
    ],
    h: [
      "Vyluč nemoci, které se u nás nevyskytují nebo které vznikají jinak než kousnutím či přisátím.",
      "Malárie a spavá nemoc se šíří v tropech hmyzem, tetanus se dostane do rány ze země. Klíště přenáší bakteriální nemoc, která se často projeví červeným kruhem na kůži.",
    ],
    e: "Přisátím klíštěte se šíří lymeská borelióza, nemoc způsobená bakteriemi. Často se projeví červenou skvrnou, která se kolem místa přisátí zvětšuje.",
  },
  {
    q: "Mezi které organismy patří klíště?",
    key: "mezi pavoukovce",
    d: [
      ["mezi hmyz", `Klíště má v dospělosti ${pary(4)} nohou a nemá tykadla, hmyz to není.`],
      ["mezi korýše", "Korýši mají tykadla a většinou žijí ve vodě. Klíště tykadla nemá."],
      ["mezi kroužkovce", "Kroužkovci, třeba žížala, nemají článkované nohy. Klíště je členovec s nohama."],
    ],
    h: [
      "Klíště je drobné a saje krev, ale o skupině rozhoduje stavba těla.",
      "Spočítej nohy dospělého klíštěte a zjisti, jestli má tykadla. Podle toho ho přiřaď ke skupině, kam patří i křižák.",
    ],
    e: `Klíště je pavoukovec: dospělé má ${pary(4)} nohou a nemá tykadla. Stejně jako pavouci patří mezi členovce.`,
  },
  {
    q: "Kolik nohou má dospělé klíště?",
    key: nohou(8),
    d: [
      [nohou(6), "Šest nohou má hmyz a také malá larva klíštěte. Dospělé klíště má o pár víc."],
      [nohou(10), "Deset kráčivých nohou má rak, který patří mezi korýše."],
      [nohou(4), `Pavoukovci nemají ${nohou(4)}, ale ${pary(4)} nohou. Nohou je tedy dvakrát víc.`],
    ],
    h: [
      "Klíště patří do stejné skupiny jako pavouk. Kolik nohou má pavouk?",
      "Pavoukovci mají čtyři páry nohou. Jeden pár jsou dvě nohy, takže počet párů vynásob dvěma.",
    ],
    e: `Dospělé klíště má ${nohou(8)}, tedy ${pary(4)}, jako všichni pavoukovci. Jen jeho larva má ${nohou(6)}.`,
  },
  {
    q: "Který útvar mají pavoukovci, ale hmyz ne?",
    key: "hlavohruď",
    d: [
      ["tykadla", "Tykadla má hmyz. Pavoukovci je nemají."],
      ["křídla", "Z členovců má křídla jen hmyz, pavoukovci nikdy."],
      ["složené oči", "Složené oči má hmyz, třeba moucha. Pavouk má jednoduché oči."],
    ],
    h: [
      "Tři možnosti jsou znaky hmyzu. Hledej část těla, která u hmyzu chybí.",
      "Hmyz má hlavu oddělenou od hrudi. U pavoukovců tyto dvě části srostly v jednu. Jak se jmenuje?",
    ],
    e: "Pavoukovci mají hlavohruď, srostlou hlavu s hrudí. Hmyz má hlavu a hruď oddělené a navíc tykadla, složené oči a často křídla.",
  },
];

// ── L2 — použití ────────────────────────────────────────────────────────────
const L2: Fakt[] = [
  {
    q: "Po návratu z lesa chceš mít jistotu, že na tobě není klíště. Co uděláš?",
    key: "prohlédnout celé tělo i záhyby kůže",
    d: [
      ["prohlédnout jen ruce a obličej", "Klíště často leze pod oblečení a přisaje se v teplých záhybech kůže, třeba v podkolenní jamce."],
      ["počkat, až se objeví svědění", "Přisátí klíštěte většinou nebolí ani nesvědí. Proto je potřeba se prohlédnout."],
      ["vyklepat z bot hlínu a jehličí", "Klíště z bot často vyleze výš na tělo. Prohlédnout je nutné celé tělo."],
    ],
    h: [
      "Klíště přisátí necítíš. Kde všude na tobě může být?",
      "Klíště leze po těle nahoru a hledá teplou tenkou kůži, třeba v podkolenních jamkách, v tříslech nebo v podpaží. Prohlídka jen odkrytých míst nestačí.",
    ],
    e: "Po návratu z přírody si prohlédni celé tělo, hlavně záhyby kůže: podkolenní jamky, třísla, podpaží a za ušima. Přisátí nebolí, takže bez prohlídky klíště snadno přehlédneš.",
  },
  {
    q: "Na noze máš přisáté klíště. Jak ho správně odstraníš?",
    key: "uchopíš ho pinzetou u kůže a vytáhneš",
    d: [
      ["potřeš ho olejem a počkáš, až pustí", FB_OLEJ],
      ["stiskneš ho prsty a rychle vytrhneš", "Zmáčknuté klíště může do rány vytlačit víc zárodků a snadno se utrhne."],
      ["přiložíš k němu horkou sirku", "Pálení může způsobit popáleninu a dráždí klíště, které pak do rány vypustí víc zárodků."],
    ],
    h: [
      "Klíště se nesmí zmáčknout ani přidusit. Čím ho vytáhneš šetrně?",
      "Nástroj přilož co nejblíž ke kůži, aby nestiskl nafouklé tělo klíštěte. Pak ho tahej pomalu a rovnoměrně, dokud nevyjde celé.",
    ],
    e: "Klíště uchop pinzetou nebo kartičkou těsně u kůže a pomalu ho vytáhni celé. Pak místo vydezinfikuj. Olej, máslo ani mačkání prsty nepoužívej: klíště by mohlo do rány vypustit víc zárodků.",
  },
  {
    q: "Jdeš na výlet vysokou trávou. Které oblečení sníží riziko, že se na tebe přisaje klíště?",
    key: "dlouhé světlé kalhoty zastrčené do ponožek",
    d: [
      ["kraťasy, aby bylo klíště hned vidět", "Na holé kůži se klíště přisaje dřív, než si ho všimneš. Zakrytá kůže chrání lépe."],
      ["tmavé dlouhé kalhoty volně přes boty", "Na tmavé látce klíště nevidíš a volnou nohavicí se snadno dostane ke kůži."],
      ["sandály a lehké krátké ponožky", "Odkryté kotníky jsou pro klíště nejsnazší cesta ke kůži."],
    ],
    h: [
      "Klíště leze ze země a z trávy nahoru po nohou. Co mu cestu ke kůži ztíží?",
      "Rozhodují dvě věci: klíště se nesmí dostat pod oblečení a na látce ho musíš včas uvidět. Které barvě tmavé klíště nejvíc vynikne?",
    ],
    e: "Nejlépe chrání dlouhé světlé kalhoty zastrčené do ponožek. Klíště se nedostane ke kůži a na světlé látce ho včas uvidíš.",
  },
  {
    q: "Proti které nemoci přenášené klíštětem se dá u nás nechat očkovat?",
    key: "jen proti klíšťové encefalitidě",
    d: [
      ["jen proti lymeské borelióze", "Pro lidi zatím očkování proti borelióze není k dispozici. Očkovat se dá proti klíšťové encefalitidě."],
      ["proti encefalitidě i borelióze", "Očkovat se dá jen proti encefalitidě. Proti borelióze se lidé zatím očkovat nemohou."],
      ["proti žádné z nich", "Proti klíšťové encefalitidě očkování existuje a lékaři ho doporučují."],
    ],
    h: [
      "Klíště přenáší u nás dvě hlavní nemoci. Jednu způsobuje virus, druhou bakterie. Proti které existuje očkovací látka?",
      "Nemoc způsobenou bakteriemi léčí lékař antibiotiky, očkovat se proti ní zatím nedá. Očkovací látka chrání před nemocí způsobenou virem, která napadá mozek.",
    ],
    e: "Očkovat se dá jen proti klíšťové encefalitidě, kterou způsobuje virus. Pro lidi zatím očkování proti lymeské borelióze není k dispozici, a proto je důležitá prevence a sledování místa přisátí.",
  },
  {
    q: "Po odstranění klíštěte si zapíšeš do kalendáře datum. K čemu ti to bude?",
    key: "víš, do kdy místo sledovat a co říct lékaři",
    d: [
      ["víš, kdy jít na očkování proti lymeské borelióze", "Pro lidi zatím očkování proti borelióze není k dispozici. Datum slouží ke sledování místa přisátí."],
      ["víš, kdy začít sám doma brát antibiotika z lékárničky", FB_ANTIBIOTIKA],
      ["víš, za kolik dní určitě onemocníš", "Většina přisátí nemoc nepřenese. Datum pomůže sledovat, jestli se neobjeví příznaky."],
    ],
    h: [
      "Nemoc od klíštěte se může projevit až po dnech nebo týdnech. Proč je dobré znát den přisátí?",
      `Nemoc se může ukázat až během ${pad(4, "TÝDEN")}. K čemu je počáteční den, když chceš hlídat konec tohoto období nebo popsat potíže?`,
    ],
    e: `Podle data poznáš, do kdy místo sledovat (asi ${pad(4, "TÝDEN")}). Když se objeví zarudnutí nebo horečka, lékař podle něj posoudí, jestli příznaky souvisejí s klíštětem.`,
  },
  {
    q: `Na zdi sedí drobný živočich, který má ${pary(4)} nohou a tělo ze dvou částí. Kam patří?`,
    key: "mezi pavoukovce",
    d: [
      ["mezi hmyz", FB_HMYZ],
      ["mezi korýše", "Korýši mají tykadla a víc párů nohou. Tento živočich odpovídá pavoukovcům."],
      ["mezi stonožkovce", "Stonožky mají mnohem víc párů nohou a tělo z mnoha článků."],
    ],
    h: [
      "Porovnej počet párů nohou se skupinami členovců, které znáš.",
      "Hmyz má tři páry nohou a tělo ze tří částí, stonožky desítky nohou. Která skupina má tělo z hlavohrudi a zadečku?",
    ],
    e: `Znaky pavoukovců jsou ${pary(4)} nohou a tělo ze dvou částí, hlavohrudi a zadečku. Hmyz má ${pary(3)} nohou a tělo ze tří částí.`,
  },
  {
    q: "Na zahradě visí v síti pavouk křižák. Proč ho nemáme zabíjet?",
    key: "loví hmyz včetně škůdců",
    d: [
      ["opyluje květy stromů", "Květy opylují včely a jiný hmyz. Pavouk květy neopyluje, nanejvýš na nich číhá na kořist."],
      ["kypří půdu na záhonech", "Půdu kypří a provzdušňují žížaly. Pavouk žije v síti."],
      ["patří mezi užitečný hmyz", `Pavouk není hmyz. ${STAVBA}`],
    ],
    h: [
      "Co se chytá do sítě křižáka?",
      "Pavouk v síti čeká na kořist. Pomysli, kdo do ní vlétá a jestli jsou mezi nimi i živočichové, kteří na zahradě škodí.",
    ],
    e: "Křižák do sítě chytá mouchy, mšice a další hmyz, mezi nimi i škůdce. Proto je na zahradě užitečný.",
  },
  {
    q: "Kamarád ukazuje sklípkana v teráriu a tvrdí, že je to velký hmyz. Jak mu to vyvrátíš?",
    key: `má ${pary(4)} nohou a žádná tykadla`,
    d: [
      ["má jed, a hmyz jed nemá", "Jed má i hmyz, třeba včela. O skupině rozhoduje stavba těla."],
      ["je velký, a hmyz je vždy drobný", "Velikost o skupině nerozhoduje, rozhoduje stavba těla."],
      ["má chlupy, a hmyz chlupy nemá", "Chlupy má i hmyz, třeba čmelák. O skupině rozhoduje stavba těla."],
    ],
    h: [
      "O tom, kam živočich patří, rozhoduje stavba těla, ne velikost ani jed.",
      "Spočítej sklípkanovi nohy a podívej se, jestli má na hlavě útvary, kterými hmyz čichá a hmatá.",
    ],
    e: `Sklípkan má ${pary(4)} nohou a nemá tykadla, takže je to pavouk, ne hmyz. Jed, chlupy ani velikost o skupině nerozhodují.`,
  },
  {
    q: "Spolužák tvrdí, že klíště je malý brouček. Který znak ukazuje, že nemá pravdu?",
    key: `klíště má v dospělosti ${nohou(8)}`,
    d: [
      ["klíště saje krev", `${FB_KREV} Krev saje i hmyz, třeba komár.`],
      ["klíště je velmi malé", "Velikost o skupině nerozhoduje. Drobný je i mnohý hmyz."],
      ["klíště žije v trávě", "V trávě žije i mnoho hmyzu. Prostředí o skupině nerozhoduje."],
    ],
    h: [
      "Brouk je hmyz. Který znak hmyzu klíště nemá?",
      "Potrava, velikost ani prostředí o skupině nerozhodují. Porovnej počet nohou brouka a dospělého klíštěte.",
    ],
    e: `Brouci jsou hmyz a mají ${nohou(6)}. Dospělé klíště má ${nohou(8)} a nemá tykadla, je to pavoukovec.`,
  },
  {
    q: "Po vytažení klíštěte zůstala na kůži malá ranka. Co s ní uděláš?",
    key: "vydezinfikuješ ji a pár týdnů sleduješ",
    d: [
      ["necháš ji být, klíště už je pryč", "I odstraněné klíště mohlo přenést nákazu. Místo je potřeba sledovat."],
      ["potřeš ji olejem, aby se zahojila", "Olej ranku nevyčistí. Místo se má vydezinfikovat."],
      ["vymačkáš z ní krev a zalepíš ji", "Mačkáním ranku podráždíš a nečistoty zatlačíš hlouběji. Stačí dezinfekce."],
    ],
    h: [
      "Ranka se musí vyčistit. A co dál, když se nemoc může projevit až později?",
      `Borelióza se může ukázat až po dnech či týdnech jako zarudnutí. Místo proto asi ${pad(4, "TÝDEN")} kontroluj.`,
    ],
    e: `Místo přisátí vydezinfikuj a asi ${pad(4, "TÝDEN")} sleduj. Když se objeví zarudnutí, které se zvětšuje, nebo horečka, jdi k lékaři.`,
  },
  {
    q: "Po výletu se prohlížíš v koupelně. Kde hledáš klíště nejpečlivěji?",
    key: "v podkolenních jamkách a tříslech",
    d: [
      ["na chodidlech a na hřbetech obou rukou", "Klíště vyhledává tenkou teplou kůži v záhybech, ne silnou kůži chodidel."],
      ["na kolenou zepředu a na holeních nohou", "Tudy klíště většinou jen přeleze. Přisaje se výš, v teplých záhybech kůže."],
      ["na nehtech a na loktech", "Klíště potřebuje tenkou a prokrvenou kůži. Na nehtu se nepřisaje."],
    ],
    h: [
      "Klíště se přisává tam, kde je kůže tenká, teplá a schovaná.",
      "Hledej místa, kde se kůže při pohybu ohýbá a přikrývá sama sebe, třeba za kolenem nebo mezi stehnem a břichem.",
    ],
    e: "Klíště se nejčastěji přisává v záhybech s tenkou teplou kůží: v podkolenních jamkách, v tříslech, v podpaží a u dětí i za ušima a ve vlasech.",
  },
  {
    q: "Než vyrazíš do lesa, chceš se chránit před klíšťaty. Co kromě vhodného oblečení pomůže?",
    key: "repelent nastříkaný na kůži a oblečení",
    d: [
      ["tableta antibiotik spolknutá předem", FB_ANTIBIOTIKA],
      ["česnek snědený ráno před výletem", "Jídlo klíšťata neodpuzuje. Chrání přípravek určený proti klíšťatům."],
      ["silný parfém na krku a zápěstích", "Parfém klíšťata neodpuzuje. Chrání přípravek určený proti klíšťatům."],
    ],
    h: [
      "Hledej prostředek, který klíšťata odpuzuje, než se k tobě dostanou.",
      "Léky nemoc předem nezastaví a jídlo ani vůně klíště neodradí. Existují přípravky ve spreji, které se prodávají právě proti klíšťatům a komárům.",
    ],
    e: "Před klíšťaty chrání repelent na kůži a oblečení, chůze po cestách a prohlídka těla po návratu. Antibiotika předem nikdo nebere.",
  },
  {
    q: "Ve sklepě najdeš pavouka. Podle čeho ho bezpečně odlišíš od brouka?",
    key: "má tělo ze dvou částí a nemá tykadla",
    d: [
      ["rychle běhá a schovává se do škvír", "Rychle běhá i mnoho brouků. O skupině rozhoduje stavba těla."],
      ["žije ve tmě a vlhku", "Ve sklepě žijí i brouci. Prostředí o skupině nerozhoduje."],
      ["je větší než většina brouků", "Velikost o skupině nerozhoduje. Brouci bývají i větší než pavouci."],
    ],
    h: [
      "Chování ani prostředí nerozhodují. Porovnej stavbu těla.",
      "Brouk je hmyz: tělo ze tří částí a na hlavě útvary, kterými čichá. Který znak pavouk nemá?",
    ],
    e: "Pavouk má tělo z hlavohrudi a zadečku a nemá tykadla. Brouk má tělo ze tří částí a tykadla. Běhání, velikost ani prostředí o skupině nerozhodují.",
  },
  {
    q: "Ve škole pozorujete mikroskopem roztoče z prachu. Do které skupiny je zařadíte?",
    key: "k pavoukovcům",
    d: [
      ["k hmyzu", `Roztoči z prachu mají v dospělosti ${pary(4)} nohou a nemají tykadla, nejsou to hmyz.`],
      ["k prvokům", "Prvok je jediná buňka. Roztoč je drobný mnohobuněčný živočich s nohama."],
      ["k bakteriím", "Bakterie jsou jednobuněčné a nohy nemají."],
    ],
    h: [
      "Roztoč je malý, ale má článkované nohy. Spočítej je.",
      "Prvoci ani bakterie nohy nemají. Hmyz má tři páry nohou a tykadla. Kam patří drobný živočich se čtyřmi páry nohou, stejně jako klíště?",
    ],
    e: `Většina roztočů, i ti z prachu, má v dospělosti ${pary(4)} nohou a nemá tykadla. Patří tedy mezi pavoukovce stejně jako klíště.`,
  },
  {
    q: `Vodouch stříbřitý žije pod vodou. Má ${pary(4)} nohou, nemá tykadla a spřádá vlákno. Kam ho zařadíš?`,
    key: "k pavoukovcům",
    d: [
      ["k vodnímu hmyzu", `Pod vodou žije i hmyz, ale vodouch má ${pary(4)} nohou a snovací bradavky.`],
      ["ke korýšům", "Korýši mají tykadla. Vodouch tykadla nemá a spřádá vlákno."],
      ["k měkkýšům", "Měkkýši nemají článkované nohy. Vodouch je členovec."],
    ],
    h: [
      "Život ve vodě o skupině nerozhoduje. Rozhoduj podle nohou, tykadel a vlákna.",
      "Hmyz má tři páry nohou a tykadla, korýši tykadla a měkkýši článkované nohy nemají. Pod vodou si vodouch ze snovacích bradavek upřede zvon na vzduch. Do které skupiny patří křižák, který také spřádá?",
    ],
    e: `Vodouch stříbřitý je pavouk, tedy pavoukovec: má ${pary(4)} nohou, snovací bradavky a nemá tykadla. Život ve vodě o skupině nerozhoduje.`,
  },
];

// ── L3 — přenos ─────────────────────────────────────────────────────────────
const L3: Fakt[] = [
  {
    q: `Pod kamenem žije šedý živočich. Má tykadla a ${pary(7)} nohou, ale nemá křídla. Kam patří?`,
    key: "mezi korýše",
    d: [
      ["mezi hmyz", `Tykadla má i hmyz, ale jen ${pary(3)} nohou.`],
      ["mezi pavoukovce", `Pavoukovci nemají tykadla a mají ${pary(4)} nohou.`],
      ["mezi stonožkovce", "Tykadla a žádná křídla mají i stonožkovci, ale jejich párů nohou jsou desítky."],
    ],
    h: [
      "Krok 1: rozhodni, kterou skupinu vyřadí tykadla. Krok 2: rozhoduj podle počtu párů nohou.",
      "Hmyz má tři páry nohou, stonožkovci desítky párů a pavoukovci žádná tykadla. Která skupina členovců s tykadly má nohou víc než hmyz, ale méně než stonožkovci?",
    ],
    e: `Tykadla a ${pary(7)} nohou bez křídel ukazují na korýše. Takovým korýšem je mokřice, která žije na souši pod kameny. Hmyz má ${pary(3)} nohou, stonožkovci desítky nohou a pavoukovci nemají tykadla.`,
  },
  {
    q: `Živočich má ${pary(4)} nohou, velká klepeta a na konci zadečku jedový osten. Který je to?`,
    key: "štír",
    d: [
      ["rak", `Klepeta má i rak, ale nemá jedový osten, má tykadla a ${pary(5)} nohou.`],
      ["křižák", `Křižák má ${pary(4)} nohou, ale velká klepeta ani osten nemá.`],
      ["sršeň", `Sršeň má na konci zadečku žihadlo, ale je to hmyz se ${pary(3)} nohou a křídly.`],
    ],
    h: [
      "Každý znak sedí na víc živočichů. Hledej toho, na koho sedí všechny tři zároveň.",
      "Krok 1: čtyři páry nohou má pavoukovec. Krok 2: který pavoukovec nosí klepeta a na zadečku jed?",
    ],
    e: `Štír je pavoukovec se ${pary(4)} nohou, velkými klepety a jedovým ostnem na konci zadečku. Rak má klepeta, ale je korýš. Sršeň má žihadlo, ale je hmyz.`,
  },
  {
    q: `Drobný živočich se ${pary(4)} nohou čeká na stéblu trávy, až kolem projde hostitel. Jak se živí?`,
    key: "saje krev hostitele",
    d: [
      ["loví hmyz do pavučiny", "Čtyři páry nohou má i pavouk, ale ten loví kořist a na hostitele nečeká."],
      ["saje šťávy z trávy", "Na trávě sedí jen proto, aby se dostal na hostitele. Rostlinné šťávy nesaje."],
      ["požírá odumřelé listí", "Kdo jí odumřelé listí, hostitele nepotřebuje."],
    ],
    h: [
      "Krok 1: urči živočicha podle nohou a čekání na hostitele. Krok 2: vzpomeň si, co od hostitele potřebuje.",
      "Pavoukovec, který číhá v trávě a přichytí se na procházejícího člověka nebo zvíře, se na něj přisaje. Co z něj bere?",
    ],
    e: "Pavoukovec, který v trávě čeká na hostitele, je klíště. Přisaje se na hostitele a saje jeho krev.",
  },
  {
    q: "Týden po odstranění klíštěte se kolem místa přisátí zvětšuje červený kruh. Co je správné udělat?",
    key: "jít k lékaři, může jít o boreliózu",
    d: [
      ["počkat, zarudnutí samo zmizí", "Zvětšující se zarudnutí je typický projev boreliózy. Bez léčby nemoc postupuje."],
      ["vzít si antibiotika z lékárničky", FB_ANTIBIOTIKA],
      ["nechat se očkovat proti borelióze", "Pro lidi zatím očkování proti borelióze není k dispozici a po nákaze by očkování ani nepomohlo."],
    ],
    h: [
      "Krok 1: kterou nemoc prozrazuje zvětšující se červený kruh? Krok 2: kdo ji může léčit?",
      "Rostoucí zarudnutí kolem místa přisátí se objevuje u bakteriální nemoci od klíštěte. Očkovat se proti ní zatím nedá a léky vybírá odborník.",
    ],
    e: "Zvětšující se červený kruh kolem místa přisátí je typický projev lymeské boreliózy. Je nutné jít k lékaři, který předepíše léčbu. Pro lidi zatím očkování proti borelióze není k dispozici.",
  },
  {
    q: "Při vytahování se klíště utrhlo a v kůži zůstala jeho malá část. Co uděláš?",
    key: "vydezinfikuješ místo a sleduješ, jestli se nezanítí",
    d: [
      ["vyšťouráš zbytek jehlou, dokud ho nedostaneš", "Šťouráním ranku poraníš a zaneseš do ní nečistoty. Zbytek se obvykle vyloučí sám."],
      ["potřeš místo olejem, aby zbytek vyklouzl ven", "Olej zbytek nevytáhne. Místo se má vydezinfikovat a sledovat."],
      ["necháš místo být, protože klíště už je venku", "Šťourat se v místě opravdu nemá, ale sledovat ho je nutné. Při zarudnutí nebo zánětu jdi k lékaři."],
    ],
    h: [
      "Krok 1: co udělat hned s poraněným místem? Krok 2: co dělat v dalších dnech?",
      "Zbytek klíštěte se obvykle vyloučí sám, šťourání ranku jen poraní. Důležité je místo vyčistit a pak ho hlídat, jestli nezčervená.",
    ],
    e: "Místo vydezinfikuj a sleduj. Malý zbytek se obvykle vyloučí sám. Když se objeví zarudnutí, otok nebo zánět, jdi k lékaři.",
  },
  {
    q: "Kamarád chce přisáté klíště nejdřív potřít olejem, aby se samo pustilo. Proč to není dobrý nápad?",
    key: "přidušené klíště může do rány vypustit víc zárodků",
    d: [
      ["olej v ranku pálí a kůže se po něm zanítí", "Olej v ranku nepálí. Nebezpečí je v klíštěti: přidušené může do rány vypustit víc zárodků."],
      ["olejem se klíště ke kůži přilepí ještě pevněji", "Olej klíště nepřilepí. Nebezpečí je v tom, že přidušené klíště může do rány vypustit víc zárodků."],
      ["olej klíště zabije a mrtvé už nejde vytáhnout", "I mrtvé klíště jde vytáhnout. Nebezpečí je v tom, že přidušené může do rány vypustit víc zárodků."],
    ],
    h: [
      "Krok 1: pustí se klíště od oleje hned, nebo to trvá? Krok 2: co se mezitím děje v ranku?",
      "Pomysli, co dělá živočich, který se začne dusit: v klidu se pustí, nebo se brání? A co má klíště v sobě, když saje?",
    ],
    e: "Olej klíště rychle nepustí, jen zdrží jeho vytažení, a přidušené klíště může do rány vypustit víc choroboplodných zárodků. Tím roste riziko nákazy. Proto se klíště vytahuje hned pinzetou bez mazání.",
  },
  {
    q: "Proč pavouk nepotřebuje zuby, i když se živí jinými živočichy?",
    key: "potravu natráví mimo tělo a vysaje ji",
    d: [
      ["potravu rozžvýká tvrdými kusadly", "Kusadla má hmyz. Pavouk potravu nežvýká, natráví ji mimo tělo a vysaje."],
      ["kořist polyká vcelku jako had", "Pavouk kořist nepolyká. Vstříkne do ní trávicí šťávy a tekutou potravu vysaje."],
      ["živí se jen krví své kořisti", "Krev saje klíště. Pavouk vysaje celý natrávený obsah těla kořisti."],
    ],
    h: [
      "Krok 1: pavouk nemá zuby ani kusadla, kterými by potravu rozžvýkal. Krok 2: v jaké podobě tedy musí potravu přijmout?",
      "Pavouk do kořisti vstříkne kromě jedu i trávicí šťávy. Ty začnou kořist rozkládat ještě venku. Co pavouk pak s rozloženou potravou udělá?",
    ],
    e: "Pavouk má mimotělní trávení: do kořisti vstříkne trávicí šťávy, které ji natráví, a tekutou potravu pak vysaje. Zuby ani kusadla k tomu nepotřebuje.",
  },
  {
    q: "Vodouch stříbřitý žije pod hladinou. K čemu mu slouží pavučina, kterou si tam upřede?",
    key: "drží pod vodou zásobu vzduchu jako zvon",
    d: [
      ["chytá do ní ryby jako do rybářské sítě", "Vodouch loví drobné vodní živočichy, ryby do pavučiny nechytá."],
      ["dýchá jí kyslík z vody jako rybí žábry", "Pavoukovci žábry nemají. Vodouch dýchá vzduch, který si nosí pod vodu."],
      ["plave na ní po hladině jako na voru", "Vodouch žije pod hladinou. Pavučina tvoří zvon naplněný vzduchem."],
    ],
    h: [
      "Krok 1: pavouk dýchá vzduch, ne vodu. Krok 2: jak může dlouho žít pod hladinou?",
      "Vodouch si na chloupcích nosí z hladiny bublinky a pouští je pod hustou pavučinu upevněnou na rostlinách. Co se pod ní hromadí?",
    ],
    e: "Vodouch si pod vodou upřede hustou pavučinu a naplní ji vzduchem z hladiny. Vznikne zvon se zásobou vzduchu, ve kterém dýchá, odpočívá a jí.",
  },
  {
    q: "Co lze očekávat u pavouka, kterému by chyběly snovací bradavky?",
    key: "nedokázal by tvořit vlákno na pavučinu",
    d: [
      ["nedokázal by kořist ochromit jedem", "Jed vstřikují klepítka u úst. Snovací bradavky jsou na zadečku a tvoří vlákno."],
      ["nemohl by chodit po zemi ani po zdi", "Pavouk chodí nohama na hlavohrudi. Bradavky s chůzí nesouvisí."],
      ["nedokázal by vidět blížící se kořist", "Oči má pavouk na hlavohrudi. Bradavky s viděním nesouvisí."],
    ],
    h: [
      "Krok 1: k čemu snovací bradavky slouží? Krok 2: co z toho pavouk bez nich nezvládne?",
      "Snovací bradavky jsou na zadečku. Jed je v klepítkách, oči i nohy na hlavohrudi. Co vychází ze zadečku?",
    ],
    e: "Snovací bradavky tvoří vlákno. Bez nich by pavouk nemohl splést síť ani obalit kořist. Jed, zrak a chůze závisí na jiných částech těla.",
  },
  {
    q: `Drobný živočich na kameni má ${nohou(8)}, tvrdý lesklý povrch těla a nemá tykadla ani křídla. Připomíná malého brouka. Kam ho zařadíš?`,
    key: "mezi pavoukovce, podle počtu nohou",
    d: [
      ["mezi hmyz, podle podoby s broukem", `Podoba nerozhoduje. Brouk má ${nohou(6)} a tykadla, tento živočich ne.`],
      ["mezi korýše, podle tvrdého krunýře", "Tvrdý povrch těla mají mnozí členovci. Korýši mají tykadla, tento živočich je nemá."],
      ["mezi stonožkovce, podle článkovaného těla", "Článkované tělo mají všichni členovci. Stonožky mají navíc desítky nohou a tykadla."],
    ],
    h: [
      "Podoba může klamat. Rozhoduj podle toho, kolik má živočich nohou a co mu chybí.",
      "Krok 1: převeď počet nohou na počet párů. Krok 2: porovnej se skupinami členovců a zohledni chybějící tykadla.",
    ],
    e: `Živočich má ${nohou(8)}, tedy ${pary(4)}, a nemá tykadla ani křídla. To jsou znaky pavoukovců, i když připomíná brouka.`,
  },
  {
    q: `Dívka měla po výletu přisáté klíště a za ${pad(10, "DEN")} dostala horečku a bolí ji hlava. Očkovaná nebyla. Co je správné?`,
    key: "jít k lékaři a říct o přisátém klíštěti",
    d: [
      ["vzít doma antibiotika proti encefalitidě", "Na encefalitidu, kterou způsobuje virus, antibiotika nezabírají. Léčbu určuje lékař."],
      ["nechat se hned očkovat proti encefalitidě", "Očkování chrání jen předem. Po nákaze už nepomůže."],
      ["počkat, klíště přece bylo vytažené", "I vytažené klíště mohlo nákazu přenést. Horečka po přisátí je důvod jít k lékaři."],
    ],
    h: [
      "Krok 1: co mohou horečka a bolest hlavy po přisátí klíštěte znamenat? Krok 2: kdo to posoudí?",
      "Po přisátí klíštěte se může rozvinout zánět mozku. Očkování chrání jen před nákazou, ne po ní, a antibiotika na viry nepůsobí.",
    ],
    e: "Horečka a bolest hlavy po přisátí klíštěte mohou být příznaky klíšťové encefalitidy. Je nutné jít k lékaři a říct mu o klíštěti. Očkování po nákaze nepomůže a antibiotika na viry nezabírají.",
  },
  {
    q: "Proč se po návratu z lesa vyplatí najít přisáté klíště co nejdřív?",
    key: "čím kratší přisátí, tím menší riziko nákazy",
    d: [
      ["později se celé zavrtá hluboko pod kůži", "Klíště se pod kůži nezavrtává, zůstává přisáté na povrchu."],
      ["za den samo odpadne a nákaza tím zmizí", "Nasáté klíště odpadne až po několika dnech a celou dobu může přenášet nákazu."],
      ["po první hodině už nákaza nehrozí", "Naopak: čím déle klíště saje, tím víc roste riziko nákazy."],
    ],
    h: [
      "Krok 1: kdy klíště přenáší zárodky? Krok 2: co se s rizikem děje, když saje déle?",
      "Zárodky se do rány dostávají během sání. Klíště saje několik dní. Porovnej klíště odstraněné po pár hodinách a po dvou dnech.",
    ],
    e: "Zárodky přecházejí do rány během sání. Čím dřív klíště odstraníš, tím menší je riziko nákazy, a proto se tělo prohlíží hned po návratu. Platí to hlavně pro boreliózu. Virus encefalitidy se může přenést hned po přisátí, proto před ní chrání očkování.",
  },
  {
    q: "Lékař řekl alergikovi, že mu vadí drobní pavoukovci z prachu v matraci. Co mu nejspíš pomůže?",
    key: "prát povlečení na vysokou teplotu a často větrat",
    d: [
      ["postříkat postel repelentem proti klíšťatům", "Repelent odpuzuje klíšťata venku. Roztoče z prachu v matraci neodstraní."],
      ["prohlédnout celé tělo, jestli na něm nejsou přisátí", "Roztoči z prachu se na člověka nepřisávají a krev nesají. Prohlídka těla patří ke klíšťatům."],
      ["dát do pokoje zvlhčovač, aby vzduch nebyl suchý", "Roztočům se ve vlhku daří. Zvlhčovač by jim pomohl."],
    ],
    h: [
      "Krok 1: kteří drobní pavoukovci žijí v prachu a čím se živí? Krok 2: co jim v posteli škodí?",
      "Tito živočichové nesají krev, živí se odumřelými šupinkami kůže a daří se jim v teple a vlhku. Co jim naopak nesvědčí a jak to v posteli zařídíš?",
    ],
    e: "Drobní pavoukovci z prachu jsou roztoči. Nesají krev, živí se odumřelými šupinkami kůže a daří se jim v teple a vlhku. Alergikovi pomůže prát povlečení na vysokou teplotu a často větrat, aby byl vzduch sušší. Repelent ani prohlídka těla nepomohou, roztoči z prachu se na člověka nepřisávají.",
  },
  {
    q: `Larva klíštěte má jen ${pary(3)} nohou jako hmyz. Proč ji přesto řadíme mezi pavoukovce?`,
    key: `nemá tykadla a dospělé klíště má ${pary(4)} nohou`,
    d: [
      ["saje krev hostitele stejně jako dospělé klíště", `${FB_KREV} Krev saje i hmyz, třeba komár.`],
      ["je stejně drobná jako roztoči, kteří jsou pavoukovci", "Velikost o skupině nerozhoduje. Drobný je i mnohý hmyz."],
      ["čeká v trávě na hostitele jako dospělá klíšťata", "Prostředí ani způsob života o skupině nerozhodují. Rozhoduje stavba těla."],
    ],
    h: [
      "Krok 1: rozhoduje stavba těla, ne potrava ani místo. Krok 2: který znak hmyzu larvě chybí a jak vypadá, až doroste?",
      "Larva má o pár nohou méně než dospělec. Podívej se na její hlavovou část a pak na to, kolik nohou bude mít po posledním svlékání.",
    ],
    e: `Larva klíštěte má ${pary(3)} nohou, ale nemá tykadla a vyroste z ní dospělé klíště se ${pary(4)} nohou. Skupinu určujeme podle stavby těla celého živočicha, nejen jedné vývojové fáze. Potrava, velikost ani prostředí nerozhodují.`,
  },
  {
    q: "Jak se může nákaza dostat od nemocné myši přes klíště až k člověku?",
    key: "klíště nasálo krev myši a pak člověka",
    d: [
      ["klíště přeletělo z myši na člověka", "Klíště nemá křídla, je to pavoukovec. Na dalšího hostitele čeká v trávě."],
      ["klíště kouslo myš jedem a pak člověka", "Klíště nemá jed. Zárodky nasaje s krví nemocného zvířete a dalšímu hostiteli je předá slinami při sání."],
      ["klíště sneslo vajíčko do kůže člověka", "Klíště klade vajíčka na zem, ne do kůže. Nákazu přenáší sáním krve."],
    ],
    h: [
      "Krok 1: čím se klíště živí? Krok 2: co se stane, když to dělá postupně na dvou hostitelích?",
      "Klíště během života saje na několika hostitelích. Zárodky z krve nemocného zvířete si nese v těle a při dalším sání je předá.",
    ],
    e: "Klíště saje krev postupně na několika hostitelích. Když nasálo krev nemocné myši, nese zárodky v sobě a při sání na člověku mu je předá slinami.",
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
export const PAVOUKOVCI_PAVOUCI_STIRI_KLISTATA_TOPICS: TopicMetadata[] = [
  {
    id: "g6-pri-pavoukovci-pavouci-stiri-klistata-6",
    rvpNodeId: "g6-prirodopis-biologie-zivocichu-bezobratli-clenovci-uvod-pavoukovci-pavouci-stiri-klistata",
    displayName: "Pavoukovci – pavouci, štíři, klíšťata",
    title: "Pavoukovci - pavouci, štíři, klíšťata",
    studentTitle: "Pavouci, štíři a klíšťata",
    subject: "prirodopis",
    category: "Biologie živočichů",
    topic: "Bezobratlí - členovci (úvod)",
    briefDescription: "Poznáš pavoukovce podle stavby těla a víš, jak se chránit před klíštětem.",
    keywords: [
      "pavoukovci", "pavouk", "křižák", "sklípkan", "vodouch", "sekáč", "štír", "klíště",
      "roztoči", "hlavohruď", "zadeček", "snovací bradavky", "klepítka", "encefalitida", "borelióza",
    ],
    goals: [
      "Poznat pavoukovce podle stavby těla a odlišit je od hmyzu.",
      "Spojit znaky pavoukovců s jejich funkcí (vlákno, jed, mimotělní trávení).",
      "Bezpečně odstranit klíště, chránit se před ním a vědět, kdy jít k lékaři.",
    ],
    boundaries: [
      "Jen zástupci z běžných učebnic 6. ročníku; latinské názvy nejsou klíčem.",
      "Sporné věci (otáčení klíštěte, počty druhů, zda je sekáč pavouk) nejsou klíčem.",
      "Léčbu určuje lékař; úlohy učí prevenci a správný postup, ne léčení.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: `Pavoukovci mají ${pary(4)} nohou, tělo z hlavohrudi a zadečku a nemají tykadla ani křídla. Hmyz má ${pary(3)} nohou a tykadla.`,
      steps: [
        "Najdi v zadání znaky stavby těla: počet nohou, tykadla, křídla, části těla.",
        "Podle znaků urči skupinu; potrava, velikost ani prostředí nerozhodují.",
        "U klíštěte vybírej postup, který klíště nedusí ani nemačká, a nezapomeň místo sledovat.",
      ],
      commonMistake: "Považovat pavouka nebo klíště za hmyz, nebo klíště potírat olejem.",
      example: `Živočich se ${pary(4)} nohou bez tykadel je pavoukovec. Klíště se vytahuje pinzetou u kůže a místo se pak sleduje.`,
    },
  },
];
