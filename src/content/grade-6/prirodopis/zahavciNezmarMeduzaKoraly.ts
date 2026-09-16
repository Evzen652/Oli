/**
 * Přírodopis 6. ročník — Žahavci: nezmar, medúza, korály (select_one).
 *
 * Fakta, na kterých se shodují učebnice 6. ročníku (Fraus, Nová škola, SPN):
 * žahavé buňky s vymrštitelným vláknem (lov a obrana); tělo ze dvou vrstev
 * buněk, paprsčitě souměrné; láčkovitá (trávicí) dutina s jedním otvorem,
 * kolem něj chapadla; rozptýlená nervová soustava; dva tvary těla — přisedlý
 * polyp a volně plovoucí medúza. Nezmar: sladkovodní polyp, rozmnožuje se hlavně
 * pučením, velká schopnost regenerace, zelený nezmar má v těle řasy. Medúzy
 * žijí převážně v moři a pohybují se stahováním zvonu. Korály: kolonie polypů
 * s vápenitou schránkou, útesy v teplých mělkých mořích, soužití s řasami,
 * při oteplení zbělají. Sasanka: mořský polyp bez vápenité schránky.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • záměna podle vzhledu nebo prostředí (medúza je ryba, nezmar je pijavka či larva),
 *  • přisedlý barevný organismus je rostlina, řasa nebo nerost,
 *  • přenos znaků z jiných skupin (zuby, čelisti, žábry, kostra, ulita, semena),
 *  • záměna polypu a medúzy, prostředí a role řas (světlo potřebují řasy, ne polyp).
 *
 *  • L1 — zapamatování: přímá otázka na jeden fakt.
 *  • L2 — použití: znak → funkce, pravidlo na známou situaci.
 *  • L3 — přenos: popis se dvěma až třemi znaky, nový případ, vyvrácení tvrzení.
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
const FB_RYBA = "Ryba má páteř, ploutve a žábry. Medúza nemá kostru ani žábry a kořist omračuje žahavými buňkami, patří tedy mezi žahavce.";
const FB_ZUBY = "Zuby mají obratlovci, kusadla nebo čelisti třeba hmyz. Žahavci nic takového nemají, kořist omračují žahavými buňkami.";
const FB_ULITA = "Ulitu mají měkkýši, třeba hlemýžď. Žahavci ulitu nemají.";
const FB_SEMENA = "Semena mají jen rostliny. Žahavec je živočich, rozmnožuje se pučením nebo pohlavně.";

// ── L1 — zapamatování ───────────────────────────────────────────────────────
const L1: Fakt[] = [
  {
    q: "Čím žahavci omračují a chytají kořist?",
    key: "žahavými buňkami",
    d: [
      ["jedovým zubem", `${FB_ZUBY} Jedový zub má například had.`],
      ["silnými čelistmi", FB_ZUBY],
      ["lepkavou sítí", "Lepkavou síť spřádá pavouk. Žahavci žádnou síť nestaví."],
    ],
    h: [
      "Vzpomeň si, podle čeho dostali žahavci své jméno.",
      "Na chapadlech mají žahavci zvláštní buňky, které při dotyku vystřelí vlákno s jedem a kořist ochromí. Zuby ani síť k tomu nepotřebují.",
    ],
    e: "Žahavci mají na chapadlech žahavé buňky. Při dotyku vymrští vlákno s jedem, které kořist omráčí. Proto se celé skupině říká žahavci.",
  },
  {
    q: "Kde žije nezmar?",
    key: "v rybnících a tůních",
    d: [
      ["v teplých mořích", "V teplých mořích žijí korály a mnohé medúzy. Nezmar je sladkovodní."],
      ["ve vlhké půdě", "Ve vlhké půdě žije žížala. Nezmar je vodní živočich."],
      ["v lidských střevech", "Ve střevech žijí parazité, třeba tasemnice. Nezmar žije volně."],
    ],
    h: [
      "Nezmar je jediný žahavec, kterého běžně najdeš v české přírodě. Jaká voda u nás je?",
      "U nás není moře. Nezmar sedí přichycený na rostlinách ve stojaté sladké vodě a v létě ho lze najít na vodních rostlinách.",
    ],
    e: "Nezmar žije ve sladké stojaté vodě, v rybnících a tůních, kde se přichytí na vodní rostliny. Mezi žahavci je to výjimka, většina žije v moři.",
  },
  {
    q: "Do které skupiny živočichů patří medúza?",
    key: "mezi žahavce",
    d: [
      ["mezi ryby", FB_RYBA],
      ["mezi měkkýše", "Měkkýši mají svalnatou nohu a často ulitu, jako hlemýžď. Medúza má chapadla se žahavými buňkami."],
      ["mezi prvoky", "Prvok je jediná buňka. Medúza je mnohobuněčná a má chapadla."],
    ],
    h: [
      "Co se stane, když se medúzy dotkneš? Podle toho se jmenuje její skupina.",
      "Medúza nemá páteř, ploutve, žábry ani ulitu. Na chapadlech má buňky, které pálí, stejně jako nezmar a korály.",
    ],
    e: "Medúza patří mezi žahavce: má chapadla se žahavými buňkami, paprsčitě souměrné tělo a láčkovitou dutinu. Rybou není, nemá páteř ani žábry.",
  },
  {
    q: "Z čeho vznikají korálové útesy?",
    key: "z vápenitých schránek polypů",
    d: [
      ["z těl mořských rostlin", "Korály nejsou rostliny, ale živočichové. Útes tvoří pevné schránky, které si polypy samy vytvářejí."],
      ["z usazeného mořského písku", "Písek útes nestaví. Útes staví živé korály, které si tvoří pevnou schránku."],
      ["z ulit mořských plžů", FB_ULITA],
    ],
    h: [
      "Útes staví drobní živočichové, kteří žijí pohromadě a každý si kolem sebe tvoří pevný obal.",
      "Korál je kolonie malých přisedlých žahavců. Každý z nich si vytváří tvrdou oporu z vápence a po generacích z nich vyroste útes.",
    ],
    e: "Korálový útes tvoří vápenité schránky korálových polypů. Polypy žijí v koloniích, schránky se hromadí po mnoho let a vzniká útes.",
  },
  {
    q: "Z kolika vrstev buněk je tělo žahavce?",
    key: "ze dvou vrstev",
    d: [
      ["z jediné vrstvy", "Z jediné vrstvy buněk tělo žahavce není. Má vnější vrstvu, která ho kryje, a vnitřní, která vystýlá trávicí dutinu."],
      ["ze tří vrstev", "Tři vrstvy mají složitější živočichové, třeba ploštěnci. Žahavci jich mají méně."],
      ["z jediné buňky", "Z jediné buňky je prvok. Žahavec je mnohobuněčný."],
    ],
    h: [
      "Tělo žahavce má vnější vrstvu, která ho kryje, a vnitřní, která vystýlá trávicí dutinu.",
      "Spočítej vrstvy: jedna je na povrchu těla, druhá lemuje dutinu, kde se tráví. Mezi nimi je jen rosolovitá hmota bez buněk.",
    ],
    e: "Tělo žahavců tvoří dvě vrstvy buněk: vnější kryje tělo a nese žahavé buňky, vnitřní vystýlá láčkovitou dutinu a tráví potravu.",
  },
  {
    q: "Jak se nazývá přisedlý tvar těla žahavců?",
    key: "polyp",
    d: [
      ["medúza", "Medúza je druhý tvar těla žahavců, ten volně plove. Přisedlý tvar se jmenuje jinak."],
      ["larva", "Larva je mládě, které se teprve vyvíjí. Tady jde o tvar těla dospělého žahavce."],
      ["pupen", "Pupen je výrůstek, ze kterého vznikne nový jedinec. Není to tvar těla."],
    ],
    h: [
      "Žahavci mají dva tvary těla. Jeden plove jako zvon, druhý sedí přichycený na podkladu.",
      "Přisedlý tvar vypadá jako trubička nebo váček s chapadly nahoře. Takový tvar má nezmar, sasanka i korál.",
    ],
    e: "Přisedlý tvar těla žahavců je polyp: váček přichycený k podkladu s ústy a chapadly nahoře. Volně plovoucí tvar je medúza.",
  },
  {
    q: "Jak se nazývá volně plovoucí tvar těla žahavců?",
    key: "medúza",
    d: [
      ["polyp", "Polyp je přisedlý tvar těla, sedí přichycený k podkladu."],
      ["larva", "Larva je mládě ve vývoji, ne tvar těla dospělého žahavce."],
      ["sasanka", "Sasanka je žahavec s přisedlým tvarem těla, volně neplove."],
    ],
    h: [
      "Vybav si průhledný zvon s chapadly na okraji, který se vznáší v moři.",
      "Přisedlý tvar mají nezmar a korál. Ten druhý tvar má zvon, který se stahuje, a vznáší se ve vodě.",
    ],
    e: "Volně plovoucí tvar těla žahavců se jmenuje medúza. Má tvar zvonu nebo kotouče s chapadly na okraji. Přisedlý tvar je polyp.",
  },
  {
    q: "Jakým způsobem se nezmar nejčastěji rozmnožuje?",
    key: "pučením",
    d: [
      ["semeny", FB_SEMENA],
      ["dělením buňky", "Dělením buňky se rozmnožuje prvok. Nezmar je mnohobuněčný."],
      ["výtrusy", "Výtrusy mají houby a mechy, ne živočichové."],
    ],
    h: [
      "Na těle nezmara vyroste malý výrůstek s chapadly. Co se z něj stane?",
      "Nový jedinec vyroste přímo z těla rodiče a pak se oddělí. Vybav si, jak se tomu způsobu rozmnožování říká.",
    ],
    e: "Nezmar se nejčastěji rozmnožuje pučením: na jeho těle vyroste pupen, z něj malý nezmar a ten se oddělí. Umí se rozmnožovat i pohlavně.",
  },
  {
    q: "Co obklopuje ústní otvor nezmara?",
    key: "věnec chapadel",
    d: [
      ["řada drobných zubů", FB_ZUBY],
      ["pár dlouhých tykadel", "Tykadla mají hmyz a korýši a slouží jako smysly. Nezmar tykadla nemá."],
      ["pár silných klepet", "Klepeta má rak. Nezmar kořist chytá jinak."],
    ],
    h: [
      "Vzpomeň si, čím nezmar loví a kam potom potravu dopraví.",
      "Na horním konci nezmara je otvor, kterým přijímá potravu. Kolem něj vyrůstá několik dlouhých ohebných výběžků s žahavými buňkami.",
    ],
    e: "Ústní otvor nezmara obklopuje věnec chapadel. Chapadla mají žahavé buňky, chytají kořist a přitahují ji k ústům.",
  },
  {
    q: "Ve kterých mořích rostou velké pestré korálové útesy?",
    key: "v teplých mělkých mořích",
    d: [
      ["v chladných hlubokých mořích", "Velké pestré útesy v chladných hlubinách nevznikají. Jejich korály s řasami potřebují teplo i světlo, v hlubinách je zima a tma."],
      ["v teplých hlubokých mořích", "Teplo nestačí. V hloubce je tma a řasy v těle korálů potřebují světlo."],
      ["v chladných mělkých mořích", "Světla je tu dost, ale útesové korály potřebují teplou vodu."],
    ],
    h: [
      "Útesové korály potřebují dvě věci: teplo a dostatek světla. Kde voda splní obojí?",
      "V korálech žijí řasy, které potřebují světlo, a to proniká jen do malé hloubky. Útesy se proto najdou hlavně v tropech u pobřeží.",
    ],
    e: "Korálové útesy rostou v teplých a mělkých mořích. V teplé vodě se korálům daří a do malé hloubky proniká světlo, které potřebují řasy žijící v jejich těle.",
  },
  {
    q: "Jakou souměrnost má tělo žahavců?",
    key: "paprsčitou",
    d: [
      ["dvoustrannou", "Dvoustrannou souměrnost (levá a pravá polovina) má většina živočichů, třeba ryba nebo člověk. Žahavci ne."],
      ["nepravidelnou", "Nepravidelné tělo mají houbovci. Tělo žahavců souměrné je."],
      ["kulovou", "Kulovou souměrnost mají jen některé jednobuněčné organismy. Žahavci ji nemají."],
    ],
    h: [
      "Podívej se na medúzu shora: chapadla vyrůstají po celém okraji kolem středu.",
      "Tělo se dá rozdělit na stejné části mnoha rovinami, které procházejí středem.",
    ],
    e: "Žahavci mají paprsčitě souměrné tělo: části těla se opakují kolem středu, jako paprsky kola. Proto mohou chytat kořist ze všech stran.",
  },
  {
    q: "Kde žijí medúzy nejčastěji?",
    key: "ve slané mořské vodě",
    d: [
      ["ve sladkých rybnících", "V rybnících žije hlavně nezmar. Medúzy jsou převážně mořské."],
      ["v horských potocích", "V proudu potoka by se plovoucí medúza neudržela. Medúzy žijí převážně v moři."],
      ["ve vlhkém lesním mechu", "Medúza je vodní živočich, na souši by vyschla."],
    ],
    h: [
      "Kde jsi mohl nebo mohla medúzu vidět, třeba na dovolené?",
      "Medúzy se vznášejí ve velké vodě a plavci se jich bojí u pláže. V českých rybnících je nenajdeš skoro nikdy.",
    ],
    e: "Medúzy žijí převážně v moři. Vznášejí se ve vodě a pohybují se stahováním zvonu. Ve sladké vodě žije z žahavců hlavně nezmar.",
  },
  {
    q: "Jakou nervovou soustavu mají žahavci?",
    key: "rozptýlenou",
    d: [
      ["trubicovitou", "Trubicovitou nervovou soustavu mají obratlovci. Žahavci nemají mozek ani míchu."],
      ["žebříčkovitou", "Žebříčkovitou nervovou soustavu mají třeba hmyz nebo žížala. Žahavci ji mají jednodušší."],
      ["žádnou", "Žahavci nervové buňky mají, jinak by nereagovali na dotyk kořisti."],
    ],
    h: [
      "Žahavci nemají mozek. Nervové buňky mají, ale jak jsou v těle uspořádány?",
      "Nervové buňky žahavců nejsou soustředěné do jednoho místa ani do provazců. Tvoří síť rozprostřenou po celém těle.",
    ],
    e: "Žahavci mají rozptýlenou nervovou soustavu: nervové buňky tvoří síť po celém těle. Mozek ani nervové provazce nemají.",
  },
  {
    q: "Jak se jmenuje dutina, ve které nezmar tráví potravu?",
    key: "láčkovitá dutina",
    d: [
      ["žaludeční vak", "Žaludek mají složitější živočichové. Nezmar tráví v jednoduché dutině uvnitř těla."],
      ["potravní vakuola", "Potravní vakuolu má prvok uvnitř jediné buňky. Nezmar je mnohobuněčný."],
      ["plicní vak", "Plicní vak mají suchozemští plži a slouží k dýchání, ne k trávení."],
    ],
    h: [
      "Tělo nezmara je jako váček. Jak se jmenuje prostor uvnitř toho váčku?",
      "Dutina slouží k trávení a má jediný otvor, kterým potrava vstupuje i zbytky odcházejí.",
    ],
    e: "Nezmar tráví potravu v láčkovité dutině. Je to prostor uvnitř těla s jediným otvorem, kterým potrava vstupuje a zbytky odcházejí.",
  },
  {
    q: "Který žahavec žije v českých rybnících a tůních?",
    key: "nezmar",
    d: [
      ["korál", "Korály žijí v teplých mořích, v Česku ve volné přírodě nerostou."],
      ["sasanka", "Sasanka je mořský živočich, v rybnících nežije."],
      ["pijavka", "Pijavka v rybnících žije, ale není to žahavec. Je to kroužkovec bez chapadel."],
    ],
    h: [
      "Většina žahavců žije v moři. Hledej výjimku, která snese sladkou vodu.",
      "Hledaný žahavec je malý polyp, sedí na vodních rostlinách a rozmnožuje se pučením. Zelená forma má v těle řasy.",
    ],
    e: "V českých rybnících a tůních žije nezmar. Je to drobný sladkovodní polyp s chapadly. Korály a sasanky žijí v moři, pijavka není žahavec.",
  },
  {
    q: "Který z těchto mořských živočichů patří mezi žahavce?",
    key: "sasanka",
    d: [
      ["hvězdice", "Hvězdice žije v moři, ale je to ostnokožec. Žahavé buňky nemá."],
      ["chobotnice", "Chobotnice má chapadla, ale je to měkkýš. Žahavé buňky nemá."],
      ["mořská houba", "Mořská houba je houbovec, přisedá, ale chapadla se žahavými buňkami nemá."],
    ],
    h: [
      "Chapadla nebo přisedání nestačí. Rozhoduje, kdo má na chapadlech buňky, které pálí.",
      "Vylučuj: jeden živočich má ostny a pět ramen, druhý je měkkýš s přísavkami, třetí nemá chapadla vůbec. Zbývá barevný přisedlý polyp.",
    ],
    e: "Mezi žahavce patří sasanka. Je to mořský polyp s chapadly, na kterých má žahavé buňky. Chobotnice je měkkýš, hvězdice ostnokožec a mořská houba houbovec.",
  },
  {
    q: "Proč je dobré se u moře vyhnout plovoucím medúzám?",
    key: "jejich žahavé buňky pálí kůži",
    d: [
      ["jejich ostré zuby mohou kousnout", FB_ZUBY],
      ["jejich ulity pořežou kůži", FB_ULITA],
      ["jejich žábry vypouštějí jed", "Medúza žábry nemá. Pálení způsobují buňky na chapadlech."],
    ],
    h: [
      "Co se stane s kůží plavce, který se dotkne chapadel medúzy?",
      "Medúza nekouše ani neřeže. Na chapadlech má buňky, které při dotyku vystřelí vlákno s jedem.",
    ],
    e: "Medúzy mají na chapadlech žahavé buňky. Při dotyku vystřelí vlákna s jedem a kůže pálí a zčervená. Proto je lepší se jim vyhnout.",
  },
];

// ── L2 — použití ────────────────────────────────────────────────────────────
const L2: Fakt[] = [
  {
    q: "K čemu nezmarovi slouží láčkovitá dutina?",
    key: "tráví se v ní potrava",
    d: [
      ["dozrávají v ní semena", FB_SEMENA],
      ["hromadí se v ní jed", "Jed je v žahavých buňkách na chapadlech, ne v dutině uvnitř těla."],
      ["ukládá se v ní vzduch", "Nezmar žije ve vodě a vzduch v těle neukládá. Kyslík přijímá z vody povrchem těla."],
    ],
    h: [
      "Kam putuje kořist, kterou chapadla přitáhla k ústům?",
      "Dutina má jediný otvor obklopený chapadly. Vystýlá ji vnitřní vrstva buněk, která kořist rozkládá.",
    ],
    e: "Láčkovitá dutina slouží k trávení: potrava do ní vstoupí ústy a vnitřní vrstva buněk ji rozloží. Nestrávené zbytky odejdou stejným otvorem.",
  },
  {
    q: "Proč nezmar doroste, i když mu odřízneme část těla?",
    key: "má velkou schopnost regenerace",
    d: [
      ["má v těle zásobu semen", FB_SEMENA],
      ["má pevnou vnitřní kostru", "Nezmar žádnou kostru nemá. Kostra by chybějící část těla stejně nedoplnila."],
      ["má tvrdou ochrannou ulitu", FB_ULITA],
    ],
    h: [
      "Jak se jmenuje schopnost těla obnovit to, co chybí?",
      "Stejnou schopnost v menší míře má ještěrka, které doroste ocas. U nezmara je tak velká, že ho proslavila i jménem.",
    ],
    e: "Nezmar má velkou schopnost regenerace: jeho buňky dokážou vytvořit chybějící část těla. I z malého kousku může vyrůst celý nezmar.",
  },
  {
    q: "Co udělá žahavá buňka, když se jí dotkne kořist?",
    key: "vymrští vlákno s jedem",
    d: [
      ["přisaje se ke kořisti přísavkou", "Přísavky má pijavka nebo chobotnice. Žahavá buňka pracuje jinak."],
      ["prokousne kořist ostrým zubem", FB_ZUBY],
      ["obalí kořist lepkavým slizem", "Sliz kořist nezastaví. Žahavá buňka kořist ochromí."],
    ],
    h: [
      "Žahavá buňka je jako malá zbraň, která čeká na dotyk. Co asi vystřelí?",
      "Uvnitř žahavé buňky je stočené tenké vlákno. Při dotyku se vymrští ven, zabodne se do kořisti a vpustí do ní látku, která ji ochromí.",
    ],
    e: "Při dotyku žahavá buňka vymrští tenké vlákno s jedem. Vlákno kořist zasáhne a jed ji ochromí, takže ji chapadla mohou přitáhnout k ústům.",
  },
  {
    q: "Proč tropické korálové útesy nevznikají v hlubokém moři?",
    key: "řasy v jejich těle potřebují světlo",
    d: [
      ["polypy samy fotosyntetizují na světle", "Fotosyntézu nedělá polyp, ale řasy, které žijí v jeho těle."],
      ["v hloubce je voda příliš teplá", "Je to naopak: v hloubce je voda chladná. Tropické útesové korály potřebují teplou vodu."],
      ["v hloubce nežije žádná kořist", "Kořist žije i v hloubce. Rozhoduje světlo, které tam nepronikne."],
    ],
    h: [
      "Co v hlubokém moři chybí? Pomysli, kam až pronikne sluneční světlo.",
      "Korály žijí v soužití s drobnými organismy, které jim dodávají živiny. Ty organismy potřebují k výrobě živin totéž co rostliny.",
    ],
    e: "V korálech žijí řasy, které na světle vyrábějí živiny a část jich předávají korálu. Světlo proniká jen do malé hloubky, proto útesy vznikají v mělké vodě.",
  },
  {
    q: "Čím se liší polyp od medúzy?",
    key: "polyp přisedá, medúza volně plove",
    d: [
      ["polyp volně plove, medúza přisedá", "Je to obráceně. Polyp je přichycený k podkladu, medúza se vznáší ve vodě."],
      ["polyp je rostlina, medúza živočich", "Rostlinou není ani jeden. Polyp i medúza jsou dva tvary těla žahavců, tedy živočichů."],
      ["polyp má páteř, medúza ji nemá", "Páteř mají jen obratlovci. Polyp ani medúza páteř nemají."],
    ],
    h: [
      "Oba tvary mají chapadla se žahavými buňkami. Rozdíl je v tom, jak žijí.",
      "Pomysli, jak vypadá nezmar na listu a jak medúza v moři. Který z nich je přichycený k podkladu?",
    ],
    e: "Polyp je přisedlý tvar těla (nezmar, sasanka, korál), medúza je volně plovoucí tvar. Oba mají chapadla se žahavými buňkami.",
  },
  {
    q: "Plavce v moři popálila medúza a kůže ho pálí. Co je rozumné udělat?",
    key: "vylézt z vody a opláchnout místo mořskou vodou",
    d: [
      ["vylézt z vody a opláchnout místo sladkou vodou", "Sladká voda může způsobit, že na kůži vystřelí další žahavé buňky. Oplachuje se mořskou vodou."],
      ["zůstat ve vodě a místo silně třít pískem", "Tření pískem může vyvolat vystřelení dalších žahavých buněk a kůži ještě podráždí."],
      ["vylézt z vody a jed z místa vysát ústy", "Vysávání nepomáhá a jed by se dostal do úst. Místo se jen opláchne mořskou vodou."],
    ],
    h: [
      "Na kůži mohly zůstat žahavé buňky, které ještě nevystřelily. Co je nesmí podráždit?",
      "Nejdřív se dostaň do bezpečí mimo vodu. Pak zvaž, jaká voda nevystřelené žahavé buňky nevydráždí, když jsou zvyklé na své prostředí. Nic netři.",
    ],
    e: "Plavec má vylézt z vody a místo opláchnout mořskou vodou. Sladká voda ani tření nevystřelené žahavé buňky neodstraní, naopak je vyprovokují. Při silné reakci, dušnosti nebo otoku je potřeba hned vyhledat lékaře.",
  },
  {
    q: "K čemu je žahavci paprsčitě souměrné tělo, když čeká na kořist?",
    key: "zachytí kořist, ať připluje z kterékoli strany",
    d: [
      ["plave rychle jedním směrem za kořistí", "Rychlé plavání jedním směrem umožňuje dvoustranně souměrné tělo, třeba rybě. Žahavci kořist nepronásledují."],
      ["rozdělí se na dvě stejné poloviny", "Souměrnost neznamená, že se tělo samo dělí. Nezmar se rozmnožuje hlavně pučením."],
      ["udrží se přichycený k podkladu", "K přichycení slouží spodní část těla, ne souměrnost. Medúza je také paprsčitě souměrná, a přitom plove."],
    ],
    h: [
      "Paprsčitá souměrnost znamená, že se části těla opakují kolem středu. Kde všude pak jsou chapadla?",
      "Nezmar ani sasanka za potravou nepluje, čekají na místě. Odkud k nim může kořist přijít?",
    ],
    e: "Chapadla paprsčitě souměrného žahavce jsou rozložená kolem celého těla. Kořist tak zachytí, ať přijde z kterékoli strany, a nemusí ji pronásledovat.",
  },
  {
    q: "Jak nezmar ve vodě získává kyslík, když nemá žábry?",
    key: "přijímá ho celým povrchem těla",
    d: [
      ["nasává ho chapadly jako trubičkami", "Chapadla slouží k lovu, ne k dýchání. Nejsou to trubičky pro vodu ani vzduch."],
      ["vyplouvá pro vzduch k hladině", "Nezmar je přisedlý polyp a k hladině pro vzduch nevyplouvá."],
      ["vyrábí si ho v láčkovité dutině", "Láčkovitá dutina slouží k trávení. Kyslík si nezmar nevyrábí, přijímá ho z vody."],
    ],
    h: [
      "Tělo nezmara je tenké, jen ze dvou vrstev buněk. Kudy může kyslík z vody projít?",
      "Nezmar nemá žádný zvláštní dýchací orgán. Kyslík se dostane přímo do buněk, které se dotýkají vody.",
    ],
    e: "Nezmar přijímá kyslík z vody celým povrchem těla. Jeho tělo má jen dvě vrstvy buněk, takže kyslík snadno pronikne ke všem buňkám a žábry nepotřebuje.",
  },
  {
    q: "Proč jsou korálové útesy ohrožené, když se moře otepluje?",
    key: "polypy v teplé vodě přijdou o drobné řasy a zbělají",
    d: [
      ["korály v teplé vodě přestanou kvést", "Kvetou jen rostliny. Korál je živočich a květy nemá."],
      ["polypy se v teplé vodě promění ve volné medúzy", "Korálový polyp se v medúzu nepromění. Oteplení mu škodí jinak."],
      ["teplá voda korálům rozpustí kořeny", "Korály kořeny nemají, jsou to živočichové přichycení vápenitou schránkou."],
    ],
    h: [
      "Korál žije v soužití s drobnými organismy, které mu dávají barvu i živiny. Co se s nimi stane v přehřátém moři?",
      "Vzpomeň si, kdo v korálu vyrábí živiny na světle. Co by se stalo s barvou korálu, kdyby o ně přišel?",
    ],
    e: "V příliš teplé vodě polypy ztrácejí řasy, které jim dodávají živiny i barvu. Korály zbělají, a když to trvá dlouho, uhynou.",
  },
  {
    q: "K čemu slouží nezmarovi chapadla?",
    key: "chytá jimi potravu a přináší ji k ústům",
    d: [
      ["dýchá jimi kyslík jako ryba žábrami", "Nezmar žábry nemá. Kyslík přijímá celým povrchem těla."],
      ["nasává jimi živiny jako rostlina kořeny", "Nezmar kořeny nemá a živiny z vody nenasává. Potravu loví."],
      ["staví z nich pevnou vápenitou schránku", "Vápenitou schránku si tvoří korály, nezmar ne. A chapadla k tomu neslouží."],
    ],
    h: [
      "Chapadla jsou kolem úst a nesou žahavé buňky. Co z toho plyne pro jejich práci?",
      "Představ si kořist, která se dotkne chapadla. Co s ní chapadlo udělá a kam ji pak dopraví?",
    ],
    e: "Chapadla nezmarovi slouží k lovu: žahavé buňky na nich kořist ochromí a chapadla ji přitáhnou k ústům.",
  },
  {
    q: "Korál odumře, ale útes po něm zůstane. Co z korálu zbude?",
    key: "jeho vápenitá schránka",
    d: [
      ["jeho dřevnatý stonek", "Stonek mají rostliny. Korál je živočich a po smrti z něj zbude pevná schránka."],
      ["jeho kostěná páteř", "Páteř mají obratlovci. Korál žádnou kost nemá."],
      ["jeho tvrdá ulita", FB_ULITA],
    ],
    h: [
      "Korál je měkký polyp. Co pevného si během života kolem sebe vytvoří?",
      "Po smrti polypu se měkké tělo rozloží. Zbude jen to, co je z nerostné hmoty, kterou polyp vylučoval, a na tom rostou další korály.",
    ],
    e: "Z odumřelého korálu zůstane vápenitá schránka. Na starých schránkách rostou další polypy, a tak útes pomalu roste.",
  },
  {
    q: "Na těle nezmara vyrostl malý výrůstek s chapadly. Co se s ním stane?",
    key: "oddělí se a vyroste z něj nový nezmar",
    d: [
      ["rozvine se z něj květ se semeny", FB_SEMENA],
      ["promění se v plovoucí medúzu", "Nezmar tvar medúzy nemá, vždy je to polyp. Z výrůstku vznikne zase polyp."],
      ["vylíhne se z něj larva jako z vajíčka", "Výrůstek není vajíčko. Už má chapadla a je to malý jedinec."],
    ],
    h: [
      "Výrůstek s chapadly je pupen. K čemu nezmarovi pupeny slouží?",
      "Tento způsob rozmnožování je nepohlavní. Pomysli, jestli výrůstek zůstane na těle rodiče navždy.",
    ],
    e: "Výrůstek je pupen. Doroste, oddělí se a vznikne z něj nový nezmar. Tomuto rozmnožování se říká pučení.",
  },
  {
    q: "Nezmar sedí na listu vodní rostliny a kolem pluje perloočka. Co se stane, když zavadí o chapadlo?",
    key: "perloočka uvízne a nezmar ji přitáhne k ústům",
    d: [
      ["nezmar se lekne a rychle odplave pryč", "Nezmar je přisedlý polyp, neodplouvá. Na kořist na chapadlech čeká."],
      ["perloočka nezmara spase jako zelenou řasu", "Perloočka je drobný korýš a nezmara nespase. Nezmar je dravec a loví tu on."],
      ["nezmar ji vstřebá celým povrchem těla", "Nezmar kořist povrchem těla nevstřebá. Chapadla ji přitáhnou k ústům a stráví ji v láčkovité dutině."],
    ],
    h: [
      "Co je na chapadlech nezmara a co to udělá s drobným živočichem?",
      "Ochromená kořist nemůže uplavat. Chapadla ji pak dopraví k otvoru, který vede do trávicí dutiny.",
    ],
    e: "Perloočku ochromí žahavé buňky na chapadle a chapadla ji přitáhnou k ústům. V láčkovité dutině se stráví.",
  },
  {
    q: "Jak se medúza pohybuje ve vodě?",
    key: "stahuje zvon a vytlačuje z něj vodu",
    d: [
      ["kmitá brvami po celém těle jako trepka", "Brvami se pohybuje jednobuněčná trepka. Medúza je mnohobuněčná."],
      ["vlní se celým tělem jako ryba", FB_RYBA],
      ["leze po dně pomocí chapadel", "Medúza je volně plovoucí tvar. Chapadla slouží k lovu, ne k lezení."],
    ],
    h: [
      "Tělo medúzy má tvar zvonu nebo deštníku. Co se stane, když ho stáhne?",
      "Pomysli, jak se pohybuje nafouknutý balonek, ze kterého najednou uniká vzduch.",
    ],
    e: "Medúza stáhne zvon, vytlačí z něj vodu a tím se posune opačným směrem. Pak se zvon zase rozevře a pohyb se opakuje.",
  },
  {
    q: "Z povrchu nezmara vystřelila vlákna. Co je nejspíš vyvolalo?",
    key: "dotyk kořisti nebo nepřítele",
    d: [
      ["prudké sluneční světlo", "Na světlo žahavé buňky nereagují. Vystřelí při dotyku."],
      ["nedostatek kyslíku ve vodě", "Nedostatek kyslíku nezmarovi škodí, ale žahavé buňky nespouští."],
      ["dozrání semen v těle", FB_SEMENA],
    ],
    h: [
      "Žahavé buňky slouží k lovu a obraně. Kdy je nezmar potřebuje?",
      "Žahavá buňka má na povrchu citlivý výběžek. Na jaký podnět asi reaguje?",
    ],
    e: "Žahavé buňky vystřelí vlákna při dotyku kořisti nebo nepřítele. Nezmar je tak používá k lovu i k obraně.",
  },
];

// ── L3 — přenos ─────────────────────────────────────────────────────────────
const L3: Fakt[] = [
  {
    q: "Popis: „Drobný živočich přisedlý na rostlině v tůni, s chapadly kolem úst. Na boku mu vyrůstají malí jedinci.“ Co to je?",
    key: "nezmar",
    d: [
      ["řasa", "Řasa je zelený organismus bez chapadel a kořist neloví."],
      ["pijavka", "Pijavka v tůni žije, ale je to kroužkovec bez chapadel a nepřisedá."],
      ["larva komára", "Larva komára volně plave a rozmnožuje se až dospělý komár. Nepučí."],
    ],
    h: [
      "Tři znaky: přisedá, má chapadla kolem úst a rozmnožuje se výrůstky. Který žahavec žije v tůni?",
      "Porovnej, jestli popsaný živočich přisedá, nebo volně plove, a jestli je sladkovodní. Z žahavců splňuje obojí jen jeden polyp.",
    ],
    e: "Přisedlý sladkovodní živočich s chapadly kolem úst, který se rozmnožuje pučením, je nezmar.",
  },
  {
    q: "Popis: „Mořský živočich přisedlý na skále, s pestrými chapadly. Vápenitou schránku netvoří.“ Co to je?",
    key: "sasanka",
    d: [
      ["korál", "Korál je také přisedlý mořský polyp, ale vytváří si vápenitou schránku."],
      ["mořská houba", "Mořská houba přisedá, ale chapadla nemá."],
      ["medúza", "Medúza je volně plovoucí tvar, na skále nesedí."],
    ],
    h: [
      "Přisedlý mořský polyp s chapadly je buď korál, nebo jiný žahavec. Co rozhodne?",
      "Rozlišovací znak je schránka. Polyp, který si ji nestaví, žije jednotlivě a často vypadá jako barevný květ.",
    ],
    e: "Přisedlý mořský polyp s chapadly, který si nestaví vápenitou schránku, je sasanka. Korál je podobný, ale schránku tvoří.",
  },
  {
    q: "Popis: „Mořský žahavec bez vápenité schránky. Na podkladu nesedí, volně plave a pohybuje se stahováním těla.“ Co to je?",
    key: "medúza",
    d: [
      ["korál", "Korál je mořský žahavec, ale tvoří si vápenitou schránku a přisedá."],
      ["sasanka", "Sasanka schránku netvoří a žije v moři, ale je to přisedlý polyp."],
      ["nezmar", "Nezmar schránku netvoří, ale žije ve sladké vodě a přisedá."],
    ],
    h: [
      "Vyluč nejdřív toho, kdo nežije v moři, a toho, kdo si staví schránku.",
      "Zbudou dva mořští žahavci bez schránky. Jen jeden z nich nesedí na jednom místě.",
    ],
    e: "Mořský žahavec bez schránky, který volně plave a pohybuje se stahováním těla, je medúza. Korál si tvoří schránku, sasanka přisedá a nezmar žije ve sladké vodě.",
  },
  {
    q: "Popis: „Přisedlý mořský žahavec žije v koloniích. Z toho, co po sobě zanechá, roste v teplém mělkém moři útes.“ Co to je?",
    key: "korál",
    d: [
      ["sasanka", "Sasanka je také přisedlý mořský žahavec, ale žije jednotlivě a útes po ní nezůstane."],
      ["medúza", "Medúza volně plave, nepřisedá a útes nestaví."],
      ["nezmar", "Nezmar přisedá, ale žije jednotlivě ve sladké vodě, ne v moři."],
    ],
    h: [
      "Dva znaky: život v koloniích a útes, který po nich zůstane.",
      "Přisedlých mořských žahavců je víc. Rozhoduje, kdo si během života vytváří pevnou vápenitou oporu.",
    ],
    e: "Přisedlý mořský žahavec, který žije v koloniích a po kterém zůstává útes, je korál. Polypy si tvoří vápenité schránky a z nich útes roste. Sasanka žije jednotlivě a schránku netvoří.",
  },
  {
    q: "Žák tvrdí, že korál je rostlina, protože se nehýbe a je barevný. Který znak to tvrzení vyvrací?",
    key: "chapadly se žahavými buňkami loví kořist",
    d: [
      ["roste pomalu a stále na jednom místě", "To naopak tvrzení podporuje, protože tak rostou i rostliny. Nic nevyvrací."],
      ["je pestře zbarvený jako kvetoucí rostlina", "Barva nerozhoduje. Barevné jsou rostliny i živočichové."],
      ["potřebuje ke svému životu hodně světla", "Světlo potřebují řasy v korálu. Tvrzení to nevyvrací, spíš ho mate."],
    ],
    h: [
      "Hledej znak, který rostlina mít nemůže.",
      "Porovnej, jak se korál živí. Rostlina si potravu vyrábí, živočich ji musí získat. Který ze znaků ukazuje na získávání potravy?",
    ],
    e: "Korál loví: chapadly se žahavými buňkami chytá drobnou kořist. To rostlina nedělá. Nehybnost ani barva nerozhodují, vápenitá hmota je jen jeho schránka.",
  },
  {
    q: "Vědci našli neznámého mořského živočicha. Který znak by prokázal, že patří mezi žahavce?",
    key: "má žahavé buňky na chapadlech",
    d: [
      ["má pevnou vápenitou ulitu", FB_ULITA],
      ["má tělo složené z článků", "Článkované tělo mají kroužkovci a členovci, žahavci ne."],
      ["má kostěnou kostru uvnitř těla", "Vnitřní kostru z kostí s páteří mají obratlovci, žahavci ne."],
    ],
    h: [
      "Který znak má každý žahavec a jiná skupina ho nemá?",
      "Chapadla mají i chobotnice. Rozhoduje, co je na chapadlech: jen u jedné skupiny při dotyku vystřelí vlákno s jedem.",
    ],
    e: "Žahavce prokazují žahavé buňky. Mají je všichni žahavci a skupina podle nich dostala jméno. Ulita, články ani kostěná kostra k žahavcům nepatří.",
  },
  {
    q: "Na pláži leží vyplavený rosolovitý kotouč, který při doteku pálí. Proč ho nebrat do ruky, i když už je mrtvý?",
    key: "nevystřelené žahavé buňky mohou stále pálit",
    d: [
      ["jed se z mrtvé medúzy odpařuje do vzduchu", "Jed se neodpařuje. Pálí jen při dotyku, když vystřelí žahavé buňky."],
      ["ostré zuby mohou kousnout i po smrti", FB_ZUBY],
      ["chapadla se k ruce přisají jako přísavky", "Přísavky má chobotnice nebo pijavka. Chapadla medúzy pálí žahavými buňkami."],
    ],
    h: [
      "Krok 1: urči, co u tohoto živočicha pálí. Krok 2: potřebuje to ke své práci živé tělo?",
      "Žahavá buňka vystřelí po dotyku sama, bez pokynu mozku. Co to znamená pro vyplavené tělo?",
    ],
    e: "Vyplavená medúza může pálit i mrtvá. Žahavé buňky, které ještě nevystřelily, reagují na dotyk samy. Proto se na ni nesahá. Zuby ani přísavky medúza nemá a jed se neodpařuje.",
  },
  {
    q: "Proč nezmar zelený nepatří mezi rostliny, přestože je zelený?",
    key: "barvu mu dávají řasy v těle a potravu loví",
    d: [
      ["barvu mu dává vlastní chlorofyl, jen nemá kořeny", "Vlastní chlorofyl zelený nezmar nemá. Zelenou barvu mají řasy, které žijí v jeho těle."],
      ["barvu mu dává odraz zelené vody v tůni", "Zelená barva není odraz. Nezmar je zelený i ve sklenici s čistou vodou."],
      ["barvu mu dává plíseň, která na něm roste", "Plíseň je houba a nezmara nebarví. Barvu mu dávají organismy uvnitř těla."],
    ],
    h: [
      "Zelená barva nerozhoduje. Rozhoduje, jak se organismus živí.",
      "Rostlina kořist nechytá, živočich ano. Zvaž, co dělá nezmar svými chapadly a odkud se v jeho těle může vzít zelená barva.",
    ],
    e: "Zelenou barvu nezmarovi dávají drobné řasy, které žijí v jeho buňkách. Sám nezmar je živočich: chapadly se žahavými buňkami loví kořist.",
  },
  {
    q: "Korál i sasanka jsou mořské polypy s chapadly. Který znak je od sebe odlišuje?",
    key: "korál si vytváří vápenitou schránku",
    d: [
      ["sasanka si vytváří vápenitou schránku", "Je to obráceně. Sasanka schránku netvoří, korál ano."],
      ["korál nemá na chapadlech žahavé buňky", "Žahavé buňky mají oba, jsou to žahavci."],
      ["sasanka volně plove jako medúza", "Sasanka je polyp, přisedá stejně jako korál."],
    ],
    h: [
      "Oba přisedají a oba mají žahavé buňky. Hledej znak, který má jen jeden z nich.",
      "Pomysli, který z nich staví útesy a co k tomu potřebuje.",
    ],
    e: "Korál si vytváří vápenitou schránku a v koloniích staví útesy. Sasanka schránku netvoří. Oba jsou přisedlí polypi se žahavými buňkami.",
  },
  {
    q: "Žáci rozřízli nezmara napůl a za několik dní měli dva celé nezmary. Co pokus ukazuje?",
    key: "každá půlka dorostla chybějící část těla",
    d: [
      ["každá půlka vyklíčila jako ze semene", FB_SEMENA],
      ["každá půlka se chovala jako jediná buňka", "Nezmar je mnohobuněčný. Jednobuněčný je prvok, který se dělí."],
      ["každá půlka byla předtím samostatný jedinec", "Nezmar byl jeden jedinec. Dva vznikli až po rozříznutí."],
    ],
    h: [
      "Z každé poloviny vznikl celý živočich. Co každé polovině chybělo?",
      "Vzpomeň si, čím je nezmar známý a proč dostal takové jméno. Co by musela udělat polovina těla, aby byla zase celá?",
    ],
    e: "Pokus ukazuje regeneraci: každá polovina nezmara dorostla chybějící část těla a vznikli dva celí nezmaři.",
  },
  {
    q: "Potápěč vidí, že korály v moři teplejším než obvykle začínají bělat. Co by jim nejspíš pomohlo, aby nezbělaly?",
    key: "aby voda kolem útesu zůstala chladnější",
    d: [
      ["aby voda byla ještě teplejší, jako v tropech", "Korály sice potřebují teplou vodu, ale přehřátí je právě příčina bělání. Další teplo by jim uškodilo."],
      ["aby polypy dostaly novou vápenitou schránku", "Schránka zůstává i u zbělalých korálů. Problém je v živých polypech, které přišly o řasy."],
      ["aby se korály přesunuly do hlubin bez světla", "Řasy v korálech potřebují světlo. Ve tmě by korál o živiny přišel také."],
    ],
    h: [
      "Krok 1: co korály v přehřátém moři ztrácejí? Krok 2: co tu ztrátu spouští?",
      "Řasy korál opouštějí, když je mu příliš horko. Hledej změnu, která odstraní příčinu, ne jen následek.",
    ],
    e: "Korály zbělají, když v přehřáté vodě přijdou o řasy, které jim dávají barvu a živiny. Pomohlo by, kdyby voda kolem útesu zůstala chladnější. Víc tepla by bělání zhoršilo, schránka problém není a v hlubinách chybí světlo pro řasy.",
  },
  {
    q: "Na kameni v tůni sedí drobný zelený organismus. Jak rozhodneš, zda je to nezmar, nebo řasa?",
    key: "zjistím, jestli má chapadla a chytá kořist",
    d: [
      ["zjistím, jestli je zelený", "Zelené mohou být oba, zelený nezmar má v těle řasy. Barva nerozhodne."],
      ["zjistím, jestli se nehýbe z místa", "Oba sedí na místě. Nehybnost nerozhodne."],
      ["zjistím, jestli žije ve sladké vodě", "Oba žijí ve sladké vodě tůně. Prostředí nerozhodne."],
    ],
    h: [
      "Vylučuj znaky, které mají oba organismy stejné.",
      "Barva, místo i prostředí jsou společné. Hledej znak, kterým se liší živočich od organismu, který si potravu vyrábí.",
    ],
    e: "Rozhodne způsob výživy a stavba: nezmar má chapadla a chytá kořist, řasa ne. Barva, nehybnost ani sladká voda je neodliší.",
  },
  {
    q: "Rybář tvrdí, že medúza je ryba, protože plave v moři. Který znak to tvrzení vyvrací?",
    key: "chybí jí páteř a má žahavé buňky",
    d: [
      ["žije volně v otevřeném moři", "V moři žijí ryby i medúzy. To tvrzení nevyvrací."],
      ["má průhledné rosolovité tělo", "Průhledné bývají i některé rybky. Samo o sobě to nic nevyvrací."],
      ["loví drobné mořské živočichy", "Drobné živočichy loví i ryby. To tvrzení nevyvrací."],
    ],
    h: [
      "Hledej znak, který ryba mít musí, a znak, který ryba mít nemůže.",
      "Ryba je obratlovec. Porovnej, co má ryba uvnitř těla a čím medúza loví.",
    ],
    e: "Medúza nemá páteř, takže není obratlovec ani ryba. Má žahavé buňky, a proto patří mezi žahavce.",
  },
  {
    q: "Živočich má paprsčitě souměrné tělo ze dvou vrstev buněk a trávicí dutinu s jedním otvorem. Kam patří?",
    key: "mezi žahavce",
    d: [
      ["mezi prvoky", "Prvok je jediná buňka, nemá vrstvy buněk."],
      ["mezi měkkýše", "Měkkýši paprsčitě souměrné tělo nemají a jejich stavba je složitější, mají svalnatou nohu a plášť."],
      ["mezi ploštěnce", "Ploštěnci mají dvoustranně souměrné tělo a tři vrstvy buněk."],
    ],
    h: [
      "Tři znaky: souměrnost, počet vrstev buněk a trávicí dutina. Kterou skupinu všechny tři popisují?",
      "Nejdřív vyluč skupinu, která nemá vrstvy buněk vůbec. Pak vyluč ty, které mají dvoustranně souměrné tělo.",
    ],
    e: "Paprsčitá souměrnost, dvě vrstvy buněk a láčkovitá dutina s jedním otvorem jsou znaky žahavců.",
  },
  {
    q: "Ve dvou tůních žijí hnědí nezmaři. V první je hodně drobných korýšů, ve druhé žádní. Co lze čekat?",
    key: "v první se nezmarům bude dařit lépe",
    d: [
      ["ve druhé si nezmaři potravu vyrobí sami", "Potravu si na světle vyrábějí rostliny a řasy. Hnědý nezmar řasy v těle nemá, musí lovit."],
      ["v obou tůních se jim bude dařit stejně", "Nezmar je dravec. Bez kořisti nemá potravu, takže rozdíl bude."],
      ["ve druhé se nezmaři přesunou do moře", "Nezmar je sladkovodní přisedlý polyp, do moře se nepřesune."],
    ],
    h: [
      "Krok 1: čím se nezmar živí? Krok 2: kde té potravy najde víc?",
      "Hnědý nezmar si potravu vyrobit neumí. Loví chapadly drobné vodní živočichy. Zvaž, kde ho čeká hlad.",
    ],
    e: "Hnědý nezmar je dravec a živí se drobnými živočichy, které loví chapadly. V tůni s hojností korýšů bude mít dost potravy a bude se mu dařit lépe.",
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
export const ZAHAVCI_NEZMAR_MEDUZA_KORALY: TopicMetadata[] = [
  {
    id: "g6-pri-zahavci-nezmar-meduza-koraly-6",
    rvpNodeId: "g6-prirodopis-biologie-zivocichu-bezobratli-zahavci-plostenci-hlisti-zahavci-nezmar-meduza-koraly",
    displayName: "Žahavci – nezmar, medúza, korály",
    title: "Žahavci - nezmar, medúza, korály",
    studentTitle: "Žahavci: nezmar, medúza a korály",
    subject: "prirodopis",
    category: "Biologie živočichů",
    topic: "Bezobratlí - žahavci, ploštěnci, hlísti",
    briefDescription: "Poznáš žahavce podle žahavých buněk, chapadel a tvaru těla.",
    keywords: [
      "žahavci", "nezmar", "medúza", "korál", "sasanka", "žahavé buňky", "chapadla",
      "láčkovitá dutina", "polyp", "pučení", "regenerace", "korálový útes",
    ],
    goals: [
      "Poznat nezmara, medúzu, korál a sasanku podle znaků stavby a života.",
      "Spojit znak žahavců (žahavé buňky, chapadla, láčkovitá dutina, schránka) s jeho funkcí.",
      "Rozlišit polyp a medúzu a vysvětlit, proč korálové útesy potřebují teplé mělké moře.",
    ],
    boundaries: [
      "Jen zástupci z běžných učebnic 6. ročníku; latinské názvy nejsou klíčem.",
      "Přesný mechanismus výstřelu vlákna a střídání pokolení se nerozebírá.",
      "První pomoc při popálení jen v bezpečné obecné podobě; při silné reakci lékař.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Žahavce poznáš podle žahavých buněk na chapadlech. Polyp přisedá (nezmar, sasanka, korál), medúza volně plove. Korál si na rozdíl od sasanky tvoří vápenitou schránku.",
      steps: [
        "Najdi v zadání znaky: prostředí, tvar těla, chapadla, schránku.",
        "Rozhodni, jestli jde o přisedlý polyp, nebo plovoucí medúzu.",
        "Znak spoj s funkcí: žahavé buňky loví, chapadla přinášejí potravu, dutina tráví.",
      ],
      commonMistake: "Myslet si, že medúza je ryba nebo korál rostlina, a zapomenout, že světlo potřebují řasy v korálu, ne polyp.",
      example: "Přisedlý polyp v tůni, který pučí, je nezmar. Průhledný plovoucí zvon s chapadly v moři je medúza.",
    },
  },
];
