/**
 * Přírodopis 6. ročník — Kroužkovci: žížala, pijavka (select_one).
 *
 * Fakta, na kterých se shodují učebnice 6. ročníku (Fraus, Nová škola, SPN):
 * tělo z článků, kožně svalový vak, žebříčková nervová soustava; žížala
 * (štětinky, opasek a kokon, obojetník, dýchá povrchem těla, živí se
 * odumřelými zbytky rostlin, kypří a provzdušňuje půdu, tvoří humus, po dešti
 * vylézá kvůli nedostatku vzduchu v zaplavených chodbách); pijavka lékařská
 * (dvě přísavky, sladké vody, saje krev, sliny brání srážení krve, využití
 * v lékařství); nitěnka (bahno znečištěných vod, ukazatel znečištění).
 * Latinské názvy ani název látky ze slin klíčem nejsou.
 * Mýtus o rozpůlené žížale se objevuje jen jako distraktor s opravou.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • zařazení podle tvaru: žížala jako had, hlíst nebo obecný „červ“,
 *  • kroužkovec jako hmyz, štětinky jako nožky,
 *  • přenesené dýchání (plíce, žábry), nepochopení vlhké kůže,
 *  • mylný účinek pijavky (jed, trvalý parazit) a žížaly (okusuje kořeny).
 *
 *  • L1 — zapamatování: přímá otázka na fakt.
 *  • L2 — použití: vysvětlení jevu nebo situace.
 *  • L3 — přenos: poznání živočicha z popisu, úsudek ve dvou krocích, nový případ.
 *
 * Každá otázka má pevně tři distraktory, takže jedna otázka = jedna úloha
 * a `ruzneUlohy()` vrátí celou banku úrovně. Generátor nemá stav na úrovni modulu.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
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

// Opakovaná vysvětlení typických záměn.
const FB_HLIST = "Hlíst má tělo hladké, bez článků. Kroužkovce poznáš právě podle článků.";
const FB_HAD = "Had je obratlovec s kostrou a páteří. Kroužkovci kostru nemají.";
const FB_HMYZ = "Hmyz má tři páry článkovaných nohou a tělo ze tří částí. Kroužkovci nohy nemají.";
const FB_PLICE = "Plíce kroužkovci nemají. Kyslík přijímají celým povrchem vlhkého těla.";

// ── L1 — zapamatování ───────────────────────────────────────────────────────
const L1: Fakt[] = [
  {
    q: "Z čeho se skládá tělo kroužkovců?",
    key: "z mnoha podobných článků",
    d: [
      ["z jednoho hladkého celku bez článků", "Hladké tělo bez článků mají hlísti. Kroužkovci dostali jméno podle článků, které tělo dělí jako kroužky."],
      ["z hlavohrudi a zadečku", "Hlavohruď a zadeček mají pavoukovci. Tělo kroužkovců se dělí na mnoho článků."],
      ["z hlavy, hrudi a zadečku", FB_HMYZ],
    ],
    h: [
      "Podívej se na žížalu zblízka: jak vypadá její tělo po délce?",
      "Skupina se jmenuje kroužkovci. Co na těle žížaly připomíná kroužky a kolikrát se to opakuje?",
    ],
    e: "Tělo kroužkovců tvoří mnoho podobných článků, které se opakují za sebou jako kroužky. Podle nich skupina dostala jméno.",
  },
  {
    q: "Čím dýchá žížala?",
    key: "celým povrchem těla",
    d: [
      ["plícemi jako člověk", FB_PLICE],
      ["žábrami jako ryba", "Žábry žížala nemá, žije v půdě, ne ve vodě. Kyslík přijímá celou vlhkou kůží."],
      ["vzdušnicemi jako hmyz", "Vzdušnice má hmyz. Žížala hmyz není a dýchací orgány nemá."],
    ],
    h: [
      "Porovnej žížalu s člověkem, rybou a hmyzem. Má stejné orgány jako oni?",
      "Žížala na suchu rychle hyne. Která část jejího těla nesmí vyschnout a co s tím může souviset?",
    ],
    e: "Žížala nemá plíce ani žábry. Kyslík přijímá celým povrchem těla přes vlhkou kůži, a proto nesmí vyschnout.",
  },
  {
    q: "Kde žije pijavka lékařská?",
    key: "ve sladkých vodách",
    d: [
      ["ve střevech člověka", "Pijavka není vnitřní parazit. Krev saje z povrchu těla a pak odpadne."],
      ["v půdě jako žížala", "V půdě žije žížala. Pijavka lékařská potřebuje vodu."],
      ["ve slané mořské vodě", "Pijavka lékařská není mořský živočich. Žije v rybnících a tůních."],
    ],
    h: [
      "Pijavka se přisaje k noze člověka, který se brodí. Kde se to může stát?",
      "Pijavka lékařská žije i u nás, kde moře není. Kam do vody se tu lidé chodí brodit?",
    ],
    e: "Pijavka lékařská žije ve sladkých vodách: v rybnících, tůních a pomalu tekoucích potocích.",
  },
  {
    q: "Čím se pijavka přichytí k podkladu?",
    key: "dvěma přísavkami",
    d: [
      ["štětinkami na článcích", "Štětinky má žížala. Pijavka je nemá."],
      ["šesti drobnými nožkami", FB_HMYZ],
      ["lepkavým slizem na břiše", "Sliz pijavku nepřidrží. Drží se útvary, které k podkladu přilnou podtlakem."],
    ],
    h: [
      "Pijavka se drží pevně i v proudu vody. Vzpomeň si, proč je těžké ji sundat z kůže.",
      "Pijavka se po dně posouvá tak, že se chytí jedním koncem těla, pak druhým. Co na koncích těla k tomu potřebuje?",
    ],
    e: "Pijavka má dvě přísavky, jednu na předním a druhou na zadním konci těla. Přichytí se jimi k podkladu i ke kůži.",
  },
  {
    q: "Čím se živí žížala?",
    key: "odumřelými zbytky rostlin",
    d: [
      ["živými kořeny rostlin", "Žížala kořeny neokusuje a rostlinám neškodí. Žere odumřelé zbytky, například spadané listí."],
      ["krví drobných živočichů", "Krev saje pijavka, ne žížala."],
      ["drobným hmyzem v půdě", "Žížala není dravec. Živí se odumřelými částmi rostlin."],
    ],
    h: [
      "Co žížala v noci zatahuje do své chodby? Vzpomeň si na podzimní zahradu.",
      "Žížaly pomáhají tvořit humus. Z čeho humus vzniká?",
    ],
    e: "Žížala se živí odumřelými zbytky rostlin, například spadaným listím, které zatahuje do chodeb. Živé kořeny nežere.",
  },
  {
    q: "Co vytváří opasek žížaly?",
    key: "kokon, obal pro vajíčka",
    d: [
      ["jed proti nepřátelům", "Žížala jedovatá není. Opasek vylučuje sliz, ze kterého vznikne obal na vajíčka."],
      ["zásobu vody na sucho", "Opasek vodu neskladuje. Slouží při rozmnožování."],
      ["novou hlavu po poranění", "Opasek nové části těla nevytváří. Slouží k tvorbě obalu pro vajíčka."],
    ],
    h: [
      "Opasek je světlejší ztluštělý pás na přední části těla. Mají ho jen dospělé žížaly. Proč asi jen ony?",
      "Opasek vylučuje sliz, který po čase ztuhne. K čemu může sloužit pevný obal ze slizu, který žížala nechá v půdě?",
    ],
    e: "Opasek vylučuje sliz, ze kterého vznikne kokon, obal pro vajíčka. V kokonu se vyvíjejí malé žížaly.",
  },
  {
    q: "Mezi které živočichy patří žížala?",
    key: "mezi kroužkovce",
    d: [
      ["mezi hlísty", FB_HLIST],
      ["mezi plazy", `${FB_HAD} Žížala tedy není malý had.`],
      ["mezi hmyz", FB_HMYZ],
    ],
    h: [
      "Rozhoduje stavba těla, ne to, že je žížala dlouhá a nemá nohy. Z čeho se skládá její tělo?",
      "Prohlédni si tělo žížaly. Podle čeho, co na něm vidíš, se může jmenovat celá skupina?",
    ],
    e: "Žížala patří mezi kroužkovce, protože má tělo z mnoha článků. Není to had (nemá kostru), hmyz (nemá nohy) ani hlíst (má články).",
  },
  {
    q: "Kde má pijavka přísavky?",
    key: "na předním a zadním konci těla",
    d: [
      ["po celé spodní straně těla", "Pijavka nemá přísavky po celém břiše, má jen dvě."],
      ["jen kolem úst na hlavě", "Jedna přísavka je u úst, ale druhá je na opačném konci těla."],
      ["na každém článku těla", "Přísavky nejsou na každém článku. Pijavka má jen dvě."],
    ],
    h: [
      "Kolik přísavek pijavka má? Podle toho vyluč možnosti, které by jich znamenaly mnoho.",
      "Jedna přísavka obklopuje ústa, kterými pijavka saje krev. Kde musí být druhá, větší, aby se pijavka mohla střídavě přitahovat?",
    ],
    e: "Pijavka má dvě přísavky: přední kolem úst a zadní na konci těla. Střídavým přisáváním se posouvá.",
  },
  {
    q: "Jak se jmenuje stavba těla, ve které je kůže srostlá se svaly?",
    key: "kožně svalový vak",
    d: [
      ["chitinový krunýř", "Chitinový krunýř mají hmyz a korýši. Kroužkovci ho nemají."],
      ["vnitřní kostra", "Vnitřní kostru mají obratlovci. Kroužkovci kostru nemají."],
      ["vápenitá ulita", "Ulitu mají plži, například hlemýžď. Kroužkovci ji nemají."],
    ],
    h: [
      "Kroužkovci nemají kostru ani krunýř. Co jim dává tvar a umožňuje pohyb?",
      "Název má tři slova. Dvě říkají, z čeho se obal těla skládá, třetí popisuje jeho tvar.",
    ],
    e: "Kůže kroužkovců je srostlá se svalovinou a tvoří kožně svalový vak. Stahováním jeho svalů se živočich pohybuje.",
  },
  {
    q: "Jakou nervovou soustavu mají kroužkovci?",
    key: "žebříčkovou",
    d: [
      ["rozptýlenou", "Rozptýlenou nervovou soustavu má nezmar. Kroužkovci mají nervy uspořádané do řady uzlin."],
      ["trubicovitou", "Trubicovitou nervovou soustavu mají obratlovci. Je uložená na hřbetní straně těla v jedné trubici, ne v řadě uzlin."],
      ["provazcovitou", "Provazcovitou nervovou soustavu mají ploštěnci. U kroužkovců jsou v každém článku uzliny propojené podélně i napříč."],
    ],
    h: [
      "V každém článku je pár nervových uzlin a ty jsou spojené s uzlinami v sousedních článcích. Jaký tvar to připomíná?",
      "Názvy nervových soustav vycházejí z jejich tvaru. Nakresli si dvě řady uzlin spojené podélně i napříč a hledej název podle podobného předmětu.",
    ],
    e: "Kroužkovci mají žebříčkovou nervovou soustavu: v článcích jsou páry uzlin propojené podélnými i příčnými nervy jako příčky žebříku.",
  },
  {
    q: "Jak se nazývají drobné výrůstky na článcích žížaly?",
    key: "štětinky",
    d: [
      ["nožičky", "Žížala nohy nemá. Výrůstky na článcích jsou jen krátké tuhé chloupky."],
      ["brvy", "Brvy mají prvoci, třeba trepka. Žížala je nemá."],
      ["šupinky", "Šupiny mají ryby a plazi. Žížala má na článcích tuhé chloupky."],
    ],
    h: [
      "Přejeď prstem po žížale od konce k hlavě. Ucítíš drobné tuhé chloupky. Jak se jmenují?",
      "Výrůstky jsou krátké a tuhé jako chloupky kartáče. Nejsou to končetiny a nekmitají jako vlákna u prvoků.",
    ],
    e: "Na článcích žížaly jsou drobné tuhé štětinky. Žížala se jimi opírá o okolí, když se pohybuje.",
  },
  {
    q: "Jaké pohlavní orgány má žížala?",
    key: "samčí i samičí zároveň",
    d: [
      ["jen samčí, nebo jen samičí", "Žížaly se nedělí na samce a samice. Každá je obojetník."],
      ["žádné, množí se rozpůlením", "To je mýtus. Z rozpůlené žížaly nevzniknou dvě nové. Žížaly se množí vajíčky v kokonu."],
      ["jen samičí, samci nejsou", "Žížala má i samčí orgány. Je obojetník."],
    ],
    h: [
      "Vzpomeň si, jak se říká živočichům, kteří se nedělí na samce a samice. Co takové slovo znamená?",
      "Při páření si dvě žížaly vymění pohlavní buňky a obě potom kladou vajíčka. Co z toho plyne pro orgány každé z nich?",
    ],
    e: "Žížala je obojetník: má samčí i samičí pohlavní orgány. Přesto se páří dvě žížaly a vymění si samčí pohlavní buňky.",
  },
  {
    q: "Kde žije nitěnka?",
    key: "v bahně znečištěných vod",
    d: [
      ["v suché lesní půdě", "Nitěnka potřebuje vodu. V půdě žije žížala."],
      ["v čistých horských potocích", "Je to naopak: nitěnka snese i znečištěnou vodu s málem kyslíku a v čistých potocích jí moc nežije."],
      ["ve střevech ryb", "Nitěnka není parazit. Žije volně na dně."],
    ],
    h: [
      "Nitěnka potřebuje vodu, ale vydrží i tam, kde je v ní málo kyslíku. Které prostředí z nabídky tomu odpovídá?",
      "Nejdřív vyluč prostředí bez vody. Pak zvaž, ve které vodě bývá kyslíku málo a kde by ostatní živočichové strádali.",
    ],
    e: "Nitěnka žije v bahně na dně znečištěných vod, kde snese i málo kyslíku. Mnoho nitěnek proto ukazuje na znečištěnou vodu.",
  },
  {
    q: "Čím se živí pijavka lékařská?",
    key: "krví obratlovců",
    d: [
      ["zbytky rostlin v bahně", "Odumřelými zbytky rostlin se živí žížala. Pijavka lékařská saje krev."],
      ["řasami a sinicemi", "Pijavka nespásá řasy. Je to cizopasník, který saje krev."],
      ["masem mrtvých ryb", "Pijavka lékařská mršiny nežere, saje krev živých živočichů."],
    ],
    h: [
      "K čemu pijavce slouží přísavka kolem úst, kterou se přichytí ke kůži?",
      "Pijavka je cizopasník. Přisává se k rybám, žábám i savcům. Co mají tito živočichové společného a co od nich pijavka získá?",
    ],
    e: "Pijavka lékařská saje krev obratlovců: ryb, obojživelníků i savců včetně člověka. Po nasycení sama odpadne.",
  },
  {
    q: "Jak se žížala pohybuje v půdě?",
    key: "střídavým stahováním svalů",
    d: [
      ["pomocí drobných nožek", "Žížala nohy nemá. Štětinkami se jen opírá."],
      ["kmitáním brv na povrchu", "Brvy mají prvoci. Žížala se pohybuje svaly."],
      ["vlněním do stran jako had", "Žížala se nevlní do stran jako had. Střídavě se natahuje a zkracuje."],
    ],
    h: [
      "Sleduj žížalu: přední část se natáhne a ztenčí, pak se zkrátí a ztloustne. Co to způsobuje?",
      "Vzpomeň si na kožně svalový vak. Která jeho část umí měnit délku a tloušťku těla?",
    ],
    e: "Žížala se pohybuje střídavým stahováním okružních a podélných svalů kožně svalového vaku. Štětinkami se přitom opírá, aby neklouzala zpět.",
  },
  {
    q: "Kterého kroužkovce lidé chovají, aby ho lékaři mohli přikládat nemocným?",
    key: "pijavka",
    d: [
      ["žížala", "Žížala je užitečná hlavně pro půdu. Chovy pro lékařské účely má pijavka lékařská."],
      ["nitěnka", "Nitěnky se chovají jako krmivo pro ryby. Ke kůži se nepřisávají."],
      ["hlísta", "Hlísta dětská není kroužkovec. Je to cizopasník ze střev, který člověku škodí."],
    ],
    h: [
      "Lékař potřebuje živočicha, který se sám přichytí ke kůži. Kdo z nabídky to umí?",
      "Porovnej, čím se každý z nabízených živočichů živí. Kdo z nich přichází do styku s krví člověka?",
    ],
    e: "V lékařství se používá pijavka lékařská. Látka z jejích slin brání srážení krve.",
  },
];

// ── L2 — použití ────────────────────────────────────────────────────────────
const L2: Fakt[] = [
  {
    q: "Proč žížaly po vydatném dešti vylézají na povrch?",
    key: "v zaplavených chodbách jim chybí vzduch",
    d: [
      ["chtějí se napít dešťové vody", "Žížala nevylézá kvůli pití. V chodbách zaplavených vodou má málo kyslíku."],
      ["na povrchu okusují čerstvé kořeny", "Žížala kořeny neokusuje, živí se odumřelými zbytky rostlin."],
      ["venku mohou lépe dýchat plícemi", FB_PLICE],
    ],
    h: [
      "Čím a z čeho žížala dýchá, když sedí v suché chodbě?",
      "Porovnej, kde žížala žije a co potřebuje k dýchání. Co se v chodbě změní, když ji zaplní voda?",
    ],
    e: "Po vydatném dešti zaplaví voda chodby v půdě a vytlačí z nich vzduch. Žížalám chybí kyslík, a proto vylézají na povrch.",
  },
  {
    q: "Proč ranka po přisátí pijavky dlouho krvácí?",
    key: "látka ze slin brání srážení krve",
    d: [
      ["jed ze slin ranku rozleptává", "Sliny pijavky nejsou jed. Obsahují látku, která brání srážení krve."],
      ["v rance zůstane kus pijavky", "Pijavka v rance nic nenechává. Sama odpadne, když se nasytí."],
      ["pijavka vysála všechnu krev z okolí", "Pijavka nevysaje všechnu krev. Krvácení způsobuje látka ze slin."],
    ],
    h: [
      "Porovnej to s obyčejným škrábnutím. Proč u něj krvácení brzy přestane?",
      "Co se normálně stane s krví v malé rance? Co by pijavce při sání vadilo?",
    ],
    e: "Sliny pijavky obsahují látku, která brání srážení krve. Proto ranka krvácí ještě dlouho po tom, co pijavka odpadne. Není to jed.",
  },
  {
    q: "Proč musí mít žížala stále vlhkou kůži?",
    key: "dýchá celým povrchem těla",
    d: [
      ["na suchu by jí vyschly plíce", FB_PLICE],
      ["vlhko jí nahrazuje kostru", "Oporu těla dává kožně svalový vak, ne vlhkost."],
      ["sliz ji chrání jen před ptáky", "Hlavní úloha slizu není ochrana před ptáky. Sliz udržuje kůži vlhkou, aby jí mohl procházet kyslík."],
    ],
    h: [
      "Vzpomeň si, jaké dýchací orgány žížala má.",
      "Plíce i žábry mají vlhký povrch, přes který prochází kyslík. Co u žížaly plní stejnou úlohu?",
    ],
    e: "Žížala dýchá celým povrchem těla. Kyslík prochází jen vlhkou kůží, proto ji žížala udržuje slizem vlhkou.",
  },
  {
    q: "Co dělají žížaly pro půdu na zahradě?",
    key: "kypří ji a tvoří humus",
    d: [
      ["okusují v ní kořeny", "Žížaly kořeny neokusují a rostlinám neškodí."],
      ["vysávají z ní vodu", "Žížaly půdu nevysušují. Chodbami do ní naopak proniká voda a vzduch."],
      ["odnášejí z ní živiny", "Žížaly živiny neodnášejí, ale vracejí je do půdy ve formě humusu."],
    ],
    h: [
      "Žížala si razí chodby a polyká půdu se zbytky rostlin. Co to udělá s půdou?",
      "Co se stane s půdou, když jí vedou chodby? A co vznikne ze zbytků, které žížala strávila?",
    ],
    e: "Žížaly svými chodbami kypří a provzdušňují půdu. Ze zbytků rostlin, které stráví, vzniká humus. Půda je díky nim úrodnější.",
  },
  {
    q: "Kterého z těchto živočichů zařadíš mezi kroužkovce?",
    key: "nitěnku",
    d: [
      ["hlístu dětskou", FB_HLIST],
      ["stonožku", "Stonožka má článkované nohy a patří mezi členovce. Kroužkovci nohy nemají."],
      ["slimáka", "Slimák je plž, tedy měkkýš. Jeho tělo není rozdělené na články."],
    ],
    h: [
      "Kroužkovce poznáš podle stavby těla. Který znak je pro ně typický?",
      "U každého živočicha si ověř dvě věci: má tělo z článků? A má nohy?",
    ],
    e: "Nitěnka má tělo z článků a nemá nohy, je to kroužkovec. Hlísta je hlíst, stonožka je členovec a slimák je měkkýš.",
  },
  {
    q: "Který živočich z nabídky mezi kroužkovce nepatří?",
    key: "hlísta dětská",
    d: [
      ["žížala obecná", "Žížala má tělo z článků, je to kroužkovec."],
      ["pijavka lékařská", "Pijavka má tělo z článků, je to kroužkovec."],
      ["nitěnka obecná", "Nitěnka má tělo z článků, je to kroužkovec."],
    ],
    h: [
      "Tři živočichové mají tělo z článků. Který má tělo hladké?",
      "Všichni čtyři jsou dlouzí a bez nohou, tvar tedy nerozhoduje. Vzpomeň si, který z nich patří do jiné skupiny živočichů.",
    ],
    e: "Hlísta dětská má hladké tělo bez článků, patří mezi hlísty. Žížala, pijavka i nitěnka mají tělo z článků, jsou to kroužkovci.",
  },
  {
    q: "Proč lékaři pijavky někdy přikládají pacientům?",
    key: "pomáhají proti tvorbě krevních sraženin",
    d: [
      ["vysají z těla jed a nemoc", "Pijavka nemoci nevysává. Využívá se látka z jejích slin."],
      ["jejich jed zabíjí v ráně bakterie", "Pijavka jedovatá není. Lékaři ji přikládají kvůli látce ze slin, která brání srážení krve."],
      ["zacelí ránu svým lepkavým slizem", "Pijavka rány nezaceluje. Ranka po ní naopak krvácí déle."],
    ],
    h: [
      "Vzpomeň si, proč ranka po pijavce dlouho krvácí. Jak by se to dalo využít v nemocnici?",
      "Po některých operacích krev v cévách špatně proudí a hrozí, že je ucpe. Co dělá látka ze slin pijavky s krví?",
    ],
    e: "Látka ze slin pijavky brání srážení krve. Lékaři proto pijavky někdy využívají tam, kde hrozí krevní sraženiny a krev špatně proudí.",
  },
  {
    q: "Proč je dobře, když je v kompostu hodně žížal?",
    key: "rozloží zbytky na humus",
    d: [
      ["sežerou v něm škodlivý hmyz", "Žížala není dravec, hmyz nežere."],
      ["zahřejí ho teplem svých těl", "Žížaly kompost nezahřívají. Pomáhají rozkládat zbytky rostlin."],
      ["okusují v něm kořeny plevelů", "Žížaly kořeny neokusují, živí se odumřelými zbytky."],
    ],
    h: [
      "V kompostu jsou odumřelé zbytky rostlin. Co s nimi žížala udělá?",
      "Co se v kompostu děje se zbytky rostlin, když je žížala spolkne a pak vyloučí?",
    ],
    e: "Žížaly se živí odumřelými zbytky rostlin a rozkládají je na humus. Kompost s nimi rychleji dozraje v úrodnou zeminu.",
  },
  {
    q: "Proč žížala na suchém chodníku v poledním slunci zahyne?",
    key: "vyschne jí kůže a nemůže dýchat",
    d: [
      ["na slunci jí přestanou fungovat plíce", FB_PLICE],
      ["nenajde tam žádné kořeny k jídlu", "Žížala kořeny nejí a hlad ji za pár hodin nezabije. Nebezpečné je vyschnutí."],
      ["na suchu se jí rozpadnou články", "Články se nerozpadnou. Problém je vyschlá kůže."],
    ],
    h: [
      "Porovnej rozpálený chodník s vlhkou půdou. Co žížale na chodníku chybí?",
      "Vzpomeň si, přes co žížala přijímá kyslík. Co s tímto povrchem udělá polední slunce?",
    ],
    e: "Na slunci žížale vyschne kůže. Protože dýchá povrchem těla přes vlhkou kůži, suchou kůží už kyslík nepřijme a zahyne.",
  },
  {
    q: "Co udělá pijavka, když se nasaje krve?",
    key: "sama odpadne a odplave",
    d: [
      ["zůstane přisátá napořád", "Pijavka není trvalý cizopasník. Po nasycení odpadne."],
      ["zavrtá se hluboko pod kůži", "Pijavka se pod kůži nezavrtává, saje z povrchu."],
      ["naklade do rány vajíčka", "Pijavka do rány vajíčka neklade. Klade je do kokonu mimo hostitele."],
    ],
    h: [
      "Pijavka saje krev z povrchu těla. Co asi udělá, když je plná?",
      "Pijavka se nasaje jen jednou za dlouhou dobu a nasátá krev jí vystačí na několik měsíců. Na hostiteli nežije.",
    ],
    e: "Nasátá pijavka sama odpadne a odplave. Není to trvalý cizopasník a do těla nevniká.",
  },
  {
    q: "Jak šetrně odstranit pijavku přisátou na kůži?",
    key: "podsunout nehet pod přísavku",
    d: [
      ["prudce ji strhnout silou", "Silou ji nestrhávej. Poraníš kůži a rána bude krvácet víc."],
      ["posypat ji hrstí soli", "Sůl pijavku podráždí a ta může do rány vyvrhnout obsah trávicí trubice."],
      ["rozmáčknout ji na kůži", "Rozmáčknutím se do rány může dostat obsah jejího těla."],
    ],
    h: [
      "Pijavka se drží podtlakem. Jak přísavku uvolnit, aniž by se kůže trhala?",
      "Kůže se netrhá, když se podtlak zruší na okraji přísavky. Čím tenkým a tupým to zvládneš i bez nástrojů?",
    ],
    e: "Pijavku je nejlepší nechat odpadnout. Jinak nejdřív nehtem uvolni přední přísavku u úst, pak zadní a pijavku hned odstraň, jinak se znovu přisaje. Ranku potom umyj a přelep. Strhávat silou, solit ani mačkat se nedoporučuje.",
  },
  {
    q: "Proč žížala nepatří mezi hady?",
    key: "nemá kostru a tělo má z článků",
    d: [
      ["je menší než všichni hadi", "Velikost o zařazení nerozhoduje. Rozhoduje stavba těla."],
      ["nemá jedovaté zuby", "Ani většina hadů jedovatá není. Rozhoduje kostra a články."],
      ["žije pod zemí, ne na zemi", "Místo, kde živočich žije, o zařazení nerozhoduje."],
    ],
    h: [
      "Had je obratlovec. Co musí mít každý obratlovec uvnitř těla?",
      "Zařazení určuje stavba těla, ne velikost ani místo, kde živočich žije. Porovnej, co mají uvnitř a z čeho se skládá jejich tělo.",
    ],
    e: "Had je obratlovec s kostrou a páteří. Žížala nemá kostru a její tělo tvoří články, proto je to kroužkovec.",
  },
  {
    q: "Proč žížala nepatří mezi hmyz?",
    key: "nemá nohy ani tělo ze tří částí",
    d: [
      ["žije v zemi, ne ve vzduchu", "I mnoho hmyzu žije v zemi. Místo o zařazení nerozhoduje."],
      ["nemá na těle křídla", "Některý hmyz křídla nemá, a přesto je to hmyz."],
      ["je delší než všechen hmyz", "Délka o zařazení nerozhoduje."],
    ],
    h: [
      "Jak vypadá tělo každého hmyzu? Kolik má částí a kolik párů nohou?",
      "Křídla ani délka nerozhodují, některý hmyz křídla nemá. Každý hmyz má ale hlavu, hruď a zadeček a na hrudi článkované nohy.",
    ],
    e: "Hmyz má tělo ze tří částí (hlava, hruď, zadeček) a tři páry nohou. Žížala nemá nohy a tělo tvoří mnoho článků, je to kroužkovec.",
  },
  {
    q: "Co mají žížala a pijavka společného?",
    key: "obě mají tělo z článků",
    d: [
      ["obě sají krev", "Krev saje jen pijavka. Žížala se živí odumřelými zbytky rostlin."],
      ["obě žijí v půdě", "V půdě žije žížala, pijavka lékařská žije ve vodě."],
      ["obě dýchají žábrami", "Žábry nemá ani jedna. Obě dýchají povrchem těla."],
    ],
    h: [
      "Porovnej potravu, prostředí a stavbu těla. Ve kterém bodě se shodují?",
      "Jedna žije v půdě, druhá ve vodě, a živí se úplně jinak. Patří ale do stejné skupiny, takže shodu hledej ve stavbě těla.",
    ],
    e: "Žížala i pijavka jsou kroužkovci, obě mají tělo z článků. Liší se prostředím i potravou.",
  },
  {
    q: "Čím se pijavka liší od žížaly?",
    key: "má přísavky a nemá štětinky",
    d: [
      ["má nohy a nemá články", "Pijavka nohy nemá a tělo má z článků jako žížala."],
      ["dýchá plícemi, ne kůží", "Pijavka plíce nemá, dýchá povrchem těla stejně jako žížala."],
      ["je hmyz, ne kroužkovec", "Pijavka není hmyz. Je to kroužkovec jako žížala."],
    ],
    h: [
      "Obě mají tělo z článků a dýchají kůží. Čím se pijavka přichytí a co jí oproti žížale chybí?",
      "Porovnej, čím se každá z nich při pohybu přidržuje podkladu.",
    ],
    e: "Pijavka má dvě přísavky a štětinky nemá. Žížala přísavky nemá, ale má štětinky. Obě jsou kroužkovci a dýchají povrchem těla.",
  },
];

// ── L3 — přenos ─────────────────────────────────────────────────────────────
const L3: Fakt[] = [
  {
    q: "Živočich má tělo z mnoha článků, na obou koncích přísavku a saje krev ryb a obojživelníků. Co je to za živočicha?",
    key: "pijavka",
    d: [
      ["hlísta", FB_HLIST],
      ["plovatka", "Plovatka je vodní plž s ulitou. Tělo nemá z článků a krev nesaje."],
      ["housenka", "Housenka je larva hmyzu a má nožky. Přísavky nemá."],
    ],
    h: [
      "Tři znaky: články, přísavky a sání krve. Který živočich splňuje všechny?",
      "Projdi možnosti jednu po druhé a u každé zkontroluj, jestli má články, přísavky a jestli saje krev.",
    ],
    e: "Článkované tělo, dvě přísavky a sání krve jsou znaky pijavky. Hlísta nemá články, plovatka je plž a housenka má nožky.",
  },
  {
    q: "Červený živočich s tělem z článků žije v hustých shlucích v bahně znečištěného potoka. Co je to za živočicha?",
    key: "nitěnka",
    d: [
      ["žížala", "Žížala žije v půdě, ne v bahně pod vodou."],
      ["pijavka", "Pijavka má přísavky a saje krev. Ve shlucích v bahně nežije."],
      ["hlísta", FB_HLIST],
    ],
    h: [
      "Rozhodni podle prostředí: kdo z kroužkovců žije v bahně znečištěné vody?",
      "Tento drobný červený kroužkovec snese vodu s málem kyslíku. Akvaristé ho kupují jako krmivo pro ryby.",
    ],
    e: "V bahně znečištěné vody žije nitěnka, drobný červený kroužkovec. Snese málo kyslíku, proto jí tam žije mnoho.",
  },
  {
    q: "V ulehlé jílovité půdě bez žížal rostou rostliny hůř než v kypré zahradní půdě. Co je nejpravděpodobnější příčina?",
    key: "ke kořenům se hůř dostane vzduch a voda",
    d: [
      ["chybí žížaly, které by žraly škodlivý hmyz", "Žížala není dravec, hmyz nežere. Živí se odumřelými zbytky rostlin."],
      ["kořeny nedostanou potravu, kterou nosí žížaly", "Žížaly kořenům potravu nenosí. Zbytky rostlin zpracují na humus a půdu provzdušní."],
      ["chybí sliz žížal, který by kořeny zvlhčoval", "Sliz žížale udržuje vlhkou kůži kvůli dýchání. Kořeny nezvlhčuje."],
    ],
    h: [
      "Krok 1: co žížaly v půdě dělají? Krok 2: co z toho mají kořeny?",
      "Porovnej ulehlou půdu s půdou plnou chodeb. Čím se liší pro kořeny, které potřebují dýchat a přijímat vodu?",
    ],
    e: "Žížaly razí chodby, kterými se do půdy dostává vzduch a voda. V ulehlé půdě bez žížal chodby chybí, kořeny hůř dýchají a hůř přijímají vodu, a proto rostliny rostou pomaleji.",
  },
  {
    q: "Proč žížaly vylézají na povrch hlavně v noci, a ne za slunečného dne?",
    key: "v noci je vlhko a kůže jim nevyschne",
    d: [
      ["v noci lépe vidí na spadané listí", "Žížala oči nemá. Potravu nehledá zrakem."],
      ["v noci se jim lépe dýchá plícemi", FB_PLICE],
      ["ve dne spí a v noci loví hmyz", "Žížala není dravec, hmyz neloví. Živí se odumřelými zbytky rostlin."],
    ],
    h: [
      "Krok 1: co žížale na povrchu ve dne hrozí? Krok 2: jak se noc liší ode dne?",
      "Porovnej poledne a noc: kdy je vzduch chladnější a vlhčí? Proč na tom žížale záleží?",
    ],
    e: "Žížala dýchá celým povrchem těla přes vlhkou kůži. Ve dne by jí na slunci kůže vyschla. V noci je chladněji a vlhko, a tak může na povrchu sbírat listí bez rizika.",
  },
  {
    q: "Pijavek lékařských v přírodě ubývá. Jak s tím souvisí vysoušení tůní a mokřadů?",
    key: "přijdou o vodní prostředí, kde žijí",
    d: [
      ["přijdou o rostliny, kterými se živí", "Pijavka lékařská rostliny nejí. Saje krev obratlovců."],
      ["v suché půdě nemohou razit chodby", "Chodby v půdě razí žížala. Pijavka lékařská v půdě nežije."],
      ["bez vody přestanou fungovat žábry", "Pijavka žábry nemá, dýchá povrchem těla. Potřebuje ale vodu, ve které žije."],
    ],
    h: [
      "Krok 1: kde pijavka lékařská žije? Krok 2: co se s tím místem stane po vysušení?",
      "Porovnej pijavku se žížalou: která z nich umí žít v půdě a která potřebuje něco jiného?",
    ],
    e: "Pijavka lékařská žije ve sladkých stojatých vodách, v tůních, rybnících a mokřadech. Když se vysuší, pijavka přijde o prostředí, ve kterém žije, a v přírodě jí ubývá.",
  },
  {
    q: "Žák položí žížalu na suchý papír a slyší tiché šustění. Co ho způsobuje?",
    key: "štětinky škrábající o papír",
    d: [
      ["nožky dupající po papíru", "Žížala nohy nemá."],
      ["vzduch unikající z plic", FB_PLICE],
      ["sliz praskající při vysychání", "Sliz je měkký a vlhký, nepraská. Šustí něco tuhého."],
    ],
    h: [
      "Šustí něco tuhého, co se při pohybu dotýká papíru. Co z nabídky žížala opravdu má?",
      "Vzpomeň si, co ucítíš, když přejedeš prstem po žížale od konce k hlavě.",
    ],
    e: "Šustění dělají štětinky, které při pohybu škrábou o papír. Žížala nemá nohy ani plíce a sliz je měkký.",
  },
  {
    q: "Rybář najde v bahně potoka velké množství nitěnek. Co to prozrazuje o vodě?",
    key: "voda je znečištěná",
    d: [
      ["voda je velmi čistá", "Je to naopak. Nitěnky snesou znečištěnou vodu s málem kyslíku."],
      ["voda je bohatá na kyslík", "Je to naopak. Nitěnky se přemnoží tam, kde je kyslíku málo a jiní živočichové strádají."],
      ["voda je velmi studená", "Množství nitěnek neukazuje teplotu vody."],
    ],
    h: [
      "Nitěnka snese vodu s málem kyslíku. Ve které vodě bývá kyslíku málo?",
      "Kyslíku ve vodě ubývá, když se v ní rozkládá hodně látek. Odkud se takové látky v potoce berou?",
    ],
    e: "Velké množství nitěnek ukazuje na znečištěnou vodu. Nitěnky snesou málo kyslíku a jsou ukazatelem znečištění.",
  },
  {
    q: "Na mokré hlíně leží vedle sebe hlíst a žížala. Podle čeho je spolehlivě rozlišíš?",
    key: "žížala má tělo z článků",
    d: [
      ["žížala má drobné nožky", "Žížala nohy nemá, na článcích má jen štětinky."],
      ["hlíst má tělo z článků", "Je to obráceně. Hlíst má tělo hladké, bez článků."],
      ["žížala má hlavu s očima", "Žížala oči nemá. Rozlišovacím znakem jsou články."],
    ],
    h: [
      "Oba jsou dlouzí a bez nohou. Který znak těla se liší?",
      "Prohlédni povrch obou živočichů. U jednoho uvidíš rýhy, které tělo dělí na kroužky, druhý je hladký.",
    ],
    e: "Žížala má tělo z článků (je kroužkovec), hlíst má tělo hladké. Nohy ani oči nemá ani jeden z nich.",
  },
  {
    q: "Zahrádkář chce mít kyprou půdu bez častého rytí. Co mu pomůže?",
    key: "nechat v záhonech žít žížaly",
    d: [
      ["vysbírat žížaly, než okoušou kořeny", "Žížaly kořeny neokusují. Jejich sběr by půdě uškodil."],
      ["rozpůlit žížaly, aby jich bylo víc", "To je mýtus. Rozpůlením se žížaly nerozmnoží, naopak zahynou nebo se zraní."],
      ["přidat do půdy hmyz, který ji provrtá", "Hmyz za žížaly tuhle práci neudělá a zbytky rostlin na humus nezpracuje. Nejvíc pomohou žížaly, které v záhonu už žijí."],
    ],
    h: [
      "Vzpomeň si, co žížaly dělají pro půdu na zahradě. Která možnost jim pomůže a která uškodí?",
      "U každé možnosti si ověř, jestli vychází z pravdy o žížalách, nebo z pověry.",
    ],
    e: "Žížaly kypří a provzdušňují půdu a tvoří humus. Nejvíc pomůže nechat je v záhonech žít.",
  },
  {
    q: "V akváriu se živočich posouvá jako píďalka: přisaje se předním koncem, přitáhne zadní a znovu se natáhne. Co je to za živočicha?",
    key: "pijavka",
    d: [
      ["žížala", "Žížala přísavky nemá a ve vodě nežije."],
      ["nitěnka", "Nitěnka přísavky nemá, žije zahrabaná v bahně."],
      ["housenka", "Takto se pohybují jen housenky píďalek. Housenky mají nožky, přísavky nemají a ve vodě nežijí."],
    ],
    h: [
      "Čím se živočich přichytí předním i zadním koncem? Kdo takový útvar má?",
      "Takový pohyb vyžaduje útvar, který se přilepí k podkladu podtlakem na obou koncích těla. Hledej vodního kroužkovce.",
    ],
    e: "Pohyb střídavým přisáváním předního a zadního konce je typický pro pijavku, která má dvě přísavky.",
  },
  {
    q: "Živočich žije v půdě, má tělo z článků se štětinkami a na přední části světlejší ztluštělý pás. Co je to za živočicha?",
    key: "žížala",
    d: [
      ["pijavka", "Pijavka štětinky nemá a žije ve vodě."],
      ["hlísta", FB_HLIST],
      ["stonožka", "Stonožka má nohy, ne štětinky."],
    ],
    h: [
      "Ztluštělý pás je opasek. Který kroužkovec žije v půdě a má na článcích štětinky?",
      "Pijavka štětinky nemá a žije ve vodě. U zbylých možností ověř, jestli mají články a štětinky, a ne nohy.",
    ],
    e: "Život v půdě, štětinky na článcích a opasek jsou znaky žížaly. Opasek sice v době rozmnožování mají i pijavky, ty ale žijí ve vodě a štětinky nemají.",
  },
  {
    q: "Co by se stalo se žížalou, kdyby jí kůže přestala vylučovat sliz?",
    key: "kůže by vyschla a udusila by se",
    d: [
      ["nemohla by se napít vody z půdy", "Sliz neslouží k pití. Udržuje kůži vlhkou kvůli dýchání."],
      ["nemohla by trávit spadané listy", "Trávení se odehrává uvnitř těla, sliz na kůži s ním nesouvisí."],
      ["přestala by hmatem cítit půdu", "Sliz k hmatu neslouží. Je potřebný k dýchání."],
    ],
    h: [
      "Krok 1: k čemu žížale slouží vlhká kůže? Krok 2: co se stane, když vyschne?",
      "Vzpomeň si, kudy žížala přijímá kyslík a co k tomu potřebuje.",
    ],
    e: "Sliz udržuje kůži vlhkou a přes vlhkou kůži žížala dýchá. Bez slizu by kůže vyschla, kyslík by neprošel a žížala by se udusila.",
  },
  {
    q: "Který znak rozhodne, že neznámý živočich patří mezi kroužkovce?",
    key: "tělo z článků bez článkovaných nohou",
    d: [
      ["dlouhé tělo bez nohou", "Dlouhé tělo bez nohou mají i hlísti a hadi. Tvar nerozhoduje."],
      ["tělo z článků s článkovanými nohami", "Tělo z článků a článkované nohy mají členovci, třeba stonožka. Kroužkovci nohy nemají."],
      ["sliz na povrchu těla", "Sliz mají i plži. Sám o sobě kroužkovce neurčí."],
    ],
    h: [
      "Který znak mají všichni kroužkovci? Mají ho i některé jiné skupiny?",
      "Uvědom si, že tělo z článků má i stonožka. Čím se od kroužkovce liší?",
    ],
    e: "Kroužkovce určuje tělo z mnoha podobných článků. Články ale mají i členovci, třeba stonožka nebo housenka, a ti mají článkované nohy. Kroužkovec má články a článkované nohy nemá. Dlouhé tělo bez nohou mají i hlísti a hadi, sliz i plži.",
  },
  {
    q: "Proč pijavka nepotřebuje štětinky jako žížala?",
    key: "posouvá se pomocí přísavek",
    d: [
      ["kráčí po dně na nožkách", "Pijavka nohy nemá."],
      ["plave jen pomocí ploutví", "Ploutve mají ryby. Pijavka plave vlněním těla."],
      ["nehýbe se, žije stále přisátá", "Pijavka není trvalý cizopasník. Po nasycení odpadne a pohybuje se."],
    ],
    h: [
      "Žížala se štětinkami opírá o chodbu. Čím se přichytí k podkladu pijavka?",
      "Vzpomeň si, jak se pijavka posouvá po dně akvária a čím se přitom drží.",
    ],
    e: "Pijavka se při pohybu přichytí přísavkami a střídavě je posouvá, takže štětinky nepotřebuje. Ve vodě umí i plavat vlněním těla.",
  },
  {
    q: "Kos chytil žížalu za přední konec, ale nemůže ji z chodby vytáhnout. Co jí pomáhá?",
    key: "zapírá se štětinkami o stěny",
    d: [
      ["přisaje se přísavkou ke stěně", "Přísavky má pijavka, žížala ne."],
      ["drží se nožkami za kořeny", "Žížala nohy nemá."],
      ["pouští jed, který kosa odradí", "Žížala jedovatá není."],
    ],
    h: [
      "Čím se žížala drží v chodbě, když se pohybuje?",
      "Vzpomeň si, proč žížala při pohybu v chodbě neklouže zpátky.",
    ],
    e: "Žížala se zapírá štětinkami o stěny chodby. Proto ji pták vytahuje ztěžka.",
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
export const KROUZKOVCI_ZIZALA_PIJAVKA: TopicMetadata[] = [
  {
    id: "g6-pri-krouzkovci-zizala-pijavka-6",
    rvpNodeId: "g6-prirodopis-biologie-zivocichu-bezobratli-mekkysi-krouzkovci-krouzkovci-zizala-pijavka",
    displayName: "Kroužkovci – žížala a pijavka",
    title: "Kroužkovci - žížala, pijavka",
    studentTitle: "Žížala a pijavka",
    subject: "prirodopis",
    category: "Biologie živočichů",
    topic: "Bezobratlí - měkkýši, kroužkovci",
    briefDescription: "Poznáš kroužkovce, jak žijí žížala a pijavka a k čemu jsou užitečné.",
    keywords: [
      "kroužkovci", "žížala", "pijavka", "nitěnka", "články", "štětinky", "opasek",
      "kokon", "přísavky", "kožně svalový vak", "obojetník", "humus", "dýchání kůží",
    ],
    goals: [
      "Poznat kroužkovce podle těla z článků a odlišit je od hlístů, hadů a hmyzu.",
      "Vysvětlit, jak žížala dýchá, pohybuje se a proč je užitečná pro půdu.",
      "Popsat pijavku, její přísavky a využití v lékařství.",
    ],
    boundaries: [
      "Jen zástupci z běžných učebnic 6. ročníku; latinské názvy nejsou klíčem.",
      "Mořští kroužkovci se neprobírají.",
      "Mýtus o rozpůlené žížale se objevuje jen jako chyba s opravou.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Kroužkovce poznáš podle těla z článků. Dýchají celým povrchem vlhkého těla. Žížala má štětinky a opasek, pijavka dvě přísavky.",
      steps: [
        "Najdi v zadání znak: články, štětinky, přísavky, prostředí nebo potravu.",
        "Přiřaď znak k živočichovi nebo k jeho funkci.",
        "Vyluč možnosti, které patří hmyzu, hlístům, hadům nebo plžům.",
      ],
      commonMistake: "Myslet si, že žížala je had nebo hmyz, že dýchá plícemi, nebo že pijavka je jedovatá.",
      example: "Žížala po dešti vylézá, protože v zaplavených chodbách jí chybí vzduch. Dýchá totiž celým povrchem těla.",
    },
  },
];
