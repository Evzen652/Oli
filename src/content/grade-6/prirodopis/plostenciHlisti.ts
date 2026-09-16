/**
 * Přírodopis 6. ročník — Ploštěnci a hlísti (select_one).
 *
 * Fakta, na kterých se shodují učebnice 6. ročníku (Fraus, Nová škola, SPN):
 * ploštěnci mají ploché tělo a jsou většinou obojetníci; ploštěnka žije volně
 * pod kameny v potocích, je dravá a dobře regeneruje; motolice jaterní cizopasí
 * v játrech ovcí a skotu a vyvíjí se ve vodním plži (plovatce), proto na
 * podmáčených pastvinách; tasemnice cizopasí ve střevě, má hlavičku
 * s přísavkami a háčky, tělo z článků a nemá trávicí soustavu, člověk se nakazí
 * masem s larvami. Hlísti mají oblé nečlánkované tělo kryté pevnou kutikulou,
 * trávicí trubici s ústy i řitním otvorem a jsou odděleného pohlaví; škrkavka
 * dětská žije v tenkém střevě (vajíčka z neumyté zeleniny a špinavých rukou),
 * roup dětský v tlustém střevě (vajíčka kolem řitního otvoru, svědění).
 * Cizopasné červy léčí lékař odčervovacími léky, ne antibiotiky.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • všichni „červi“ v jedné skupině (ploštěnci × hlísti × kroužkovci),
 *  • tasemnice jí ústy a přísavky slouží k sání potravy,
 *  • záměna cesty nákazy (maso × neumytá zelenina × ruce × plž),
 *  • antibiotika na červy, léčba jen jednoho dítěte, ploštěnka jako cizopasník.
 *
 *  • L1 — zapamatování: přímá otázka na pojem nebo zástupce.
 *  • L2 — použití: od znaku k důsledku, od cizopasníka k nákaze a prevenci.
 *  • L3 — přenos: určení z popisu několika znaků, nový případ, znak a funkce.
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
const FB_ZIZALA = "Žížala má tělo z kroužků (článků) a patří ke kroužkovcům. Hlísti jsou oblí a nečlánkovaní.";
const FB_PIJAVKA = "Pijavka má tělo z kroužků a patří ke kroužkovcům, ne k ploštěncům ani k hlístům.";
const FB_ANTIBIOTIKA = "Antibiotika působí na bakterie, ne na červy. Cizopasné červy léčí lékař odčervovacími léky.";
const FB_PLOSTENKA_VOLNE = "Ploštěnka není cizopasník. Žije volně ve vodě pod kameny a loví drobné živočichy.";

// ── L1 — zapamatování ───────────────────────────────────────────────────────
const BANK_L1: Fakt[] = [
  {
    q: "Který živočich patří mezi ploštěnce?",
    key: "tasemnice",
    d: [
      ["žížala", FB_ZIZALA],
      ["škrkavka", "Škrkavka má oblé tělo a patří mezi hlísty, ne mezi ploštěnce."],
      ["pijavka", FB_PIJAVKA],
    ],
    h: [
      "Ploštěnci mají ploché tělo, které není rozdělené na kroužky. Který z nabízených živočichů takové tělo má?",
      "Pijavka je sice zploštělá, ale její tělo tvoří kroužky. Mysli na plochého cizopasníka, kterým se člověk může nakazit z masa.",
    ],
    e: "Mezi ploštěnce patří tasemnice, protože má ploché tělo. Žížala a pijavka jsou kroužkovci a škrkavka je oblý hlíst.",
  },
  {
    q: "Který živočich patří mezi hlísty?",
    key: "roup",
    d: [
      ["tasemnice", "Tasemnice má ploché tělo z článků a patří mezi ploštěnce."],
      ["žížala", FB_ZIZALA],
      ["pijavka", FB_PIJAVKA],
    ],
    h: [
      "Hlísti mají oblé tělo, které není rozdělené na články ani kroužky. Který živočich takový je?",
      "Žížala je sice oblá, ale její tělo tvoří kroužky. Hledej drobného bílého červa, který dětem způsobuje noční svědění.",
    ],
    e: "Mezi hlísty patří roup dětský: má oblé nečlánkované tělo. Tasemnice je plochý ploštěnec, žížala a pijavka jsou kroužkovci.",
  },
  {
    q: "Kde v těle člověka cizopasí škrkavka dětská?",
    key: "v tenkém střevě",
    d: [
      ["v tlustém střevě", "V tlustém střevě žije roup dětský. Škrkavka žije v tenkém střevě."],
      ["v žaludku", "V žaludku je silně kyselé prostředí. Dospělá škrkavka žije až za ním ve střevě."],
      ["v jaterních žlučovodech", "V jaterních žlučovodech cizopasí motolice jaterní, a to hlavně u ovcí a skotu."],
    ],
    h: [
      "Škrkavka se živí natrávenou potravou. Ve které části trávicí soustavy se potrava tráví a vstřebává?",
      "Jaterní žlučovody patří motolici, ne škrkavce. Porovnej obě části střeva: ve které z nich je ještě hodně živin, které lze polykat?",
    ],
    e: "Škrkavka dětská žije v tenkém střevě. Tam je dost natrávené potravy, kterou polyká. V tlustém střevě žije roup.",
  },
  {
    q: "Kde v těle člověka žije roup dětský?",
    key: "v tlustém střevě",
    d: [
      ["v tenkém střevě", "V tenkém střevě žije škrkavka dětská. Roup žije v tlustém střevě."],
      ["v žaludku", "V žaludku je silně kyselé prostředí, roup tam nežije."],
      ["v jaterních žlučovodech", "V jaterních žlučovodech cizopasí motolice jaterní, hlavně u ovcí a skotu."],
    ],
    h: [
      "Samičky tohoto červa v noci vylézají ven k řitnímu otvoru. Která část střeva je k řitnímu otvoru nejblíž?",
      "Jaterní žlučovody patří motolici, ne roupovi. Samička musí mít ze svého místa v trávicí soustavě co nejkratší cestu ven z těla.",
    ],
    e: "Roup dětský žije v tlustém střevě. Odtud samičky snadno vylézají k řitnímu otvoru, kde kladou vajíčka.",
  },
  {
    q: "Jaké tělo mají hlísti?",
    key: "oblé a nečlánkované",
    d: [
      ["ploché a z článků", "Ploché tělo z článků má tasemnice, a ta patří mezi ploštěnce."],
      ["oblé a z kroužků", "Oblé tělo z kroužků má žížala. Ta patří mezi kroužkovce."],
      ["ploché a nečlánkované", "Ploché nečlánkované tělo má ploštěnka nebo motolice. Ty jsou ploštěnci."],
    ],
    h: [
      "Vybav si škrkavku: připomíná spíš pásek, nebo provázek? A je rozdělená na kroužky?",
      "Rozhodni o dvou věcech zvlášť: tvar průřezu (plochý, nebo kulatý) a to, zda se tělo skládá z opakujících se dílů. Hlísti se od žížaly liší právě tím druhým.",
    ],
    e: "Hlísti mají oblé tělo, které není rozdělené na články. Tím se liší od plochých ploštěnců i od článkovaných kroužkovců.",
  },
  {
    q: "Který živočich žije volně pod kameny v potocích?",
    key: "ploštěnka",
    d: [
      ["tasemnice", "Tasemnice je cizopasník a žije ve střevě hostitele, ne volně v potoce."],
      ["motolice", "Motolice je cizopasník. Dospělá žije v játrech ovcí a skotu."],
      ["škrkavka", "Škrkavka je cizopasník a žije v tenkém střevě člověka."],
    ],
    h: [
      "Cizopasník žije v těle hostitele, volně žijící živočich si potravu hledá sám. Který z nabízených živočichů není cizopasník?",
      "Hledej plochého dravce z čisté tekoucí vody. Když ho rozpůlíš, z každé poloviny doroste celý živočich.",
    ],
    e: "Volně pod kameny v potocích žije ploštěnka. Je to dravý ploštěnec, ne cizopasník. Ostatní nabízení živočichové žijí v těle hostitele.",
  },
  {
    q: "Čím se tasemnice drží ve střevě?",
    key: "přísavkami a háčky na hlavičce",
    d: [
      ["ústy zakousnutými do stěny", "Tasemnice nemá ústa ani trávicí soustavu. Drží se přísavkami a háčky."],
      ["chapadly se žahavými buňkami", "Chapadla se žahavými buňkami má nezmar, žahavec. Tasemnice je nemá."],
      ["štětinkami na článcích", "Štětinky má žížala, kroužkovec. Tasemnice se drží jen hlavičkou."],
    ],
    h: [
      "Přední část tasemnice je drobná hlavička. Co na ní je, aby ji proud potravy ze střeva nevyplavil?",
      "Chapadla se žahavými buňkami patří žahavcům, ne ploštěncům. Uvaž, jaké útvary pomáhají udržet se na hladké stěně, kolem které proudí tekutina.",
    ],
    e: "Tasemnice se drží ve střevě přísavkami a háčky na hlavičce. Ty slouží jen k přichycení, potravu jimi nepřijímá.",
  },
  {
    q: "Který cizopasník žije v játrech ovcí a skotu?",
    key: "motolice",
    d: [
      ["tasemnice", "Dospělá tasemnice žije ve střevě, ne v játrech."],
      ["škrkavka", "Škrkavka dětská žije v tenkém střevě člověka."],
      ["ploštěnka", FB_PLOSTENKA_VOLNE],
    ],
    h: [
      "Hledej plochého cizopasníka, který má v celém jméně přídavné jméno odvozené od orgánu, kde žije.",
      "Škrkavka žije v tenkém střevě člověka, ne v játrech. Hledej cizopasníka, jehož larvy se vyvíjejí ve vodním plži, a proto je častý na podmáčených pastvinách.",
    ],
    e: "V játrech (žlučovodech) ovcí a skotu cizopasí motolice jaterní. Mezihostitelem je jí vodní plž plovatka.",
  },
  {
    q: "Která z těchto částí těla tasemnici chybí?",
    key: "trávicí soustava",
    d: [
      ["přísavky na hlavičce", "Přísavky na hlavičce tasemnice má. Drží se jimi ve střevě."],
      ["články s vajíčky", "Články s vajíčky tasemnice má. Zralé články odcházejí se stolicí."],
      ["nervová soustava", "Jednoduchou nervovou soustavu tasemnice má, stejně jako ostatní ploštěnci."],
    ],
    h: [
      "Tasemnice žije v natrávené potravě hostitele. Kterou část těla proto nepotřebuje?",
      "Tasemnice přijímá živiny celým povrchem těla. Přísavkami se drží a v článcích dozrávají vajíčka. Co by jí bylo k ničemu?",
    ],
    e: "Tasemnici chybí trávicí soustava. Žije v potravě, kterou už natrávil hostitel, a živiny přijímá celým povrchem těla.",
  },
  {
    q: "Kde kladou samičky roupa vajíčka?",
    key: "kolem řitního otvoru",
    d: [
      ["na stěně tenkého střeva", "V tenkém střevě žije škrkavka. Samičky roupa vylézají ven."],
      ["ve svalech hostitele", "Ve svalech hostitele se vyvíjejí larvy tasemnice, ne vajíčka roupa."],
      ["ve vodě v potoce", "Vajíčka nekladou do vody. Do vody se dostávají vajíčka motolice."],
    ],
    h: [
      "Roupi způsobují dětem v noci svědění. Kde asi samičky vajíčka kladou, když to svědí?",
      "Ve svalech se vyvíjejí larvy tasemnice, ne vajíčka roupa. Mysli na to, kde přesně dítě v noci svědí.",
    ],
    e: "Samičky roupa v noci vylézají ze střeva a kladou vajíčka kolem řitního otvoru. Způsobují tím svědění.",
  },
  {
    q: "Která vlastnost platí pro rozmnožování ploštěnců?",
    key: "většinou jsou obojetníci",
    d: [
      ["vždy jsou samci a samice", "Samce a samice mají hlísti. Ploštěnci jsou většinou obojetníci."],
      ["rozmnožují se jen dělením", "Ploštěnci se nerozmnožují jen dělením. Většinou jsou obojetníci a tvoří vajíčka."],
      ["rozmnožují se výtrusy", "Výtrusy mají houby a mechy, ne živočichové."],
    ],
    h: [
      "Obojetník má v jednom těle samčí i samičí pohlavní orgány. Platí to pro ploštěnce, nebo pro hlísty?",
      "Rozmnožování jen dělením k ploštěncům nepatří, tvoří vajíčka. Rozhodni, jestli mají ploštěnci samce a samice zvlášť jako hlísti.",
    ],
    e: "Ploštěnci jsou většinou obojetníci: jeden jedinec má samčí i samičí pohlavní orgány. Hlísti jsou naopak odděleného pohlaví.",
  },
  {
    q: "Který hlíst žije v tenkém střevě člověka?",
    key: "škrkavka",
    d: [
      ["roup", "Roup je sice hlíst, ale žije v tlustém střevě."],
      ["tasemnice", "Tasemnice ve střevě také žije, ale je to ploštěnec, ne hlíst."],
      ["žížala", FB_ZIZALA],
    ],
    h: [
      "Nejdřív vyber jen hlísty: oblé nečlánkované červy. Pak rozhodni podle části střeva.",
      "Tasemnice je plochá a žížala má kroužky, hlísti to nejsou. Ze dvou hlístů jeden žije v tlustém střevě a druhý v tenkém.",
    ],
    e: "V tenkém střevě žije škrkavka dětská, hlíst s oblým tělem. Roup žije v tlustém střevě a tasemnice je ploštěnec.",
  },
  {
    q: "Čím je kryto tělo hlístů?",
    key: "pevnou pružnou kutikulou",
    d: [
      ["tvrdým článkovaným krunýřem", "Článkovaný krunýř mají hmyz a korýši. Hlísti ho nemají."],
      ["drobnými kostěnými šupinami", "Šupiny mají ryby a plazi, ne červi."],
      ["vápenatou ulitou", "Ulitu mají plži, třeba hlemýžď. Hlísti ji nemají."],
    ],
    h: [
      "Škrkavka musí přežít ve střevě plném trávicích šťáv. Čím je chráněná, když nemá krunýř ani ulitu?",
      "Hlísti nemají kostru, krunýř, šupiny ani ulitu. Jejich tělo kryje odolná vrstva na povrchu pokožky, která je chrání před natrávením.",
    ],
    e: "Tělo hlístů kryje pevná pružná kutikula, kterou vylučuje pokožka. Chrání je například před trávicími šťávami ve střevě.",
  },
  {
    q: "Čím se živí ploštěnka?",
    key: "drobnými vodními živočichy",
    d: [
      ["krví ryb a obojživelníků", FB_PLOSTENKA_VOLNE],
      ["natrávenou potravou ve střevě", "Natrávenou potravou ve střevě se živí cizopasníci. Ploštěnka žije volně."],
      ["odumřelými zbytky rostlin", "Ploštěnka je dravec. Loví drobné živočichy, rostlinné zbytky nejí."],
    ],
    h: [
      "Ploštěnka žije volně pod kameny v potoce a je dravá. Co asi loví?",
      "Ploštěnka není cizopasník, takže nesaje krev ani nežije ve střevě. Dravec se živí jinými živočichy, které ve vodě chytí.",
    ],
    e: "Ploštěnka je dravý ploštěnec. Živí se drobnými vodními živočichy, které loví pod kameny v potocích.",
  },
  {
    q: "Který živočich je mezihostitelem motolice jaterní?",
    key: "plovatka, vodní plž",
    d: [
      ["prase chované na statku", "Prase je hostitelem larev tasemnice, ne motolice."],
      ["komár anofeles z tropů", "Komár anofeles přenáší malárii. S motolicí nesouvisí."],
      ["klíště obecné z lesa", "Klíště přenáší boreliózu a encefalitidu, motolici ne."],
    ],
    h: [
      "Mezihostitel je živočich, ve kterém se vyvíjejí larvy cizopasníka. Motolice je nejčastější na podmáčených pastvinách. Kdo tam žije?",
      "Vajíčka motolice se dostanou s trusem ovce do vody. Larvy se vyvíjejí v živočichovi, který žije v mokřinách a má ulitu.",
    ],
    e: "Mezihostitelem motolice jaterní je vodní plž plovatka. Proto se motolice vyskytuje na podmáčených pastvinách, kde plži žijí.",
  },
  {
    q: "Který ploštěnec má tělo složené z mnoha článků?",
    key: "tasemnice",
    d: [
      ["ploštěnka", "Ploštěnka má ploché tělo bez článků."],
      ["motolice", "Motolice má ploché lístkovité tělo bez článků."],
      ["žížala", "Žížala má tělo z článků, ale není ploštěnec. Patří ke kroužkovcům."],
    ],
    h: [
      "Články jsou opakující se díly těla řazené za sebou. Pozor, otázka se ptá jen na ploštěnce.",
      "Motolice má lístkovité tělo v jednom kuse. Článkované tělo poznáš i podle toho, že se od něj jednotlivé díly oddělují a odcházejí se stolicí.",
    ],
    e: "Z ploštěnců má tělo z mnoha článků tasemnice. Ploštěnka a motolice články nemají, žížala je kroužkovec.",
  },
];

// ── L2 — použití ────────────────────────────────────────────────────────────
const BANK_L2: Fakt[] = [
  {
    q: "Tasemnice nemá trávicí soustavu. Jak tedy získává živiny?",
    key: "povrchem těla z natrávené potravy",
    d: [
      ["nasává je ústy a přísavkami", "Tasemnice nemá ústa. Přísavky ji jen přidržují ve střevě."],
      ["saje krev ze stěny střeva přísavkami", "Přísavky tasemnici jen přidržují. Krev nesaje, živiny bere z natrávené potravy kolem sebe."],
      ["loví drobné živočichy ve střevě", "Tasemnice není dravec. Žije v potravě, kterou natrávil hostitel."],
    ],
    h: [
      "Kolem tasemnice je stále potrava, kterou už natrávil hostitel. Jak se živiny mohou dostat do těla bez úst?",
      "Přísavky slouží jen k přichycení. Tasemnice je plochá a velmi dlouhá, takže má velký povrch, kterým může živiny přijímat.",
    ],
    e: "Tasemnice žije v potravě, kterou natrávil hostitel. Živiny přijímá celým povrchem těla, proto trávicí soustavu nepotřebuje.",
  },
  {
    q: "Jak se člověk nejčastěji nakazí škrkavkou?",
    key: "spolkne vajíčka z neumyté zeleniny",
    d: [
      ["sní nedostatečně upravené maso", "Takto se člověk nakazí tasemnicí. Škrkavka se šíří vajíčky z hlíny."],
      ["bodne ho nakažený komár", "Komár přenáší malárii, ne škrkavky."],
      ["vykoupe se v potoce s plži", "Vodní plži jsou mezihostitelé motolice. Škrkavka se šíří vajíčky."],
    ],
    h: [
      "Vajíčka škrkavky odcházejí se stolicí a mohou se dostat do hlíny. Co z hlíny může člověk spolknout?",
      "Nákaza škrkavkou začíná v ústech. Mysli na jídlo, které roste na zahradě a před jídlem se má dobře opláchnout.",
    ],
    e: "Škrkavkou se člověk nakazí, když spolkne její vajíčka, například s neumytou zeleninou nebo ze špinavých rukou.",
  },
  {
    q: "Jak se člověk nakazí tasemnicí?",
    key: "sní nedopečené maso s larvami",
    d: [
      ["spolkne vajíčka z neumyté zeleniny", "Takto se šíří škrkavka. Tasemnice se ve střevě usadí z masa s larvami."],
      ["podá ruku nakaženému člověku", "Tasemnice ve střevě vyroste z larev v mase, ne z podání ruky."],
      ["napije se vody z potoka", "Tasemnici ve střevě člověk nedostane z vody z potoka. Vyroste mu z larev ve špatně tepelně upraveném mase."],
    ],
    h: [
      "Larvy tasemnice žijí ve svalech zvířat, třeba prasete nebo skotu. Jak se mohou dostat do lidského střeva?",
      "Larvy ve svalech zničí dostatečně vysoká teplota. Nebezpečné je tedy jídlo, které se nepeklo ani nevařilo dost dlouho.",
    ],
    e: "Tasemnicí se člověk nakazí, když sní syrové nebo nedostatečně tepelně upravené maso s larvami. Ve střevě z larvy vyroste tasemnice.",
  },
  {
    q: "Proč se roupi snadno přenášejí mezi dětmi ve školce?",
    key: "dítě se škrábe a vajíčka roznese rukama",
    d: [
      ["roupy přenáší komár při bodnutí", "Komáři roupy nepřenášejí. Vajíčka se šíří rukama."],
      ["děti jedí ve školce nedopečené maso", "Z masa s larvami se šíří tasemnice, ne roupi."],
      ["roupi se šíří kašlem a kýcháním", "Kašlem se šíří viry a bakterie. Roupi se šíří vajíčky na rukou."],
    ],
    h: [
      "Samičky kladou vajíčka kolem řitního otvoru a to svědí. Co dítě udělá a kam se vajíčka dostanou?",
      "Ve školce si děti půjčují hračky a nemyjí si vždy ruce. Vajíčka z kůže se dostanou na prsty, z prstů na hračky a pak do úst dalšího dítěte.",
    ],
    e: "Svědění nutí dítě se škrábat, vajíčka ulpí na prstech a pod nehty. Odtud se dostanou na hračky a do úst dalších dětí.",
  },
  {
    q: "Vajíčka motolice jaterní se dostanou s trusem ovce do vody. Kde se z nich nejdřív vyvíjejí larvy?",
    key: "ve vodním plži plovatce",
    d: [
      ["ve svalech chovaného prasete", "Ve svalech zvířat se vyvíjejí larvy tasemnice, ne motolice."],
      ["v komárovi z mokřiny", "Komár motolici nepřenáší. Přenáší třeba malárii."],
      ["v rybách z blízkého potoka", "Mezihostitelem motolice není ryba, ale vodní plž plovatka."],
    ],
    h: [
      "Larvy se vyvíjejí v mezihostiteli. Který živočich žije v mokřinách, kam se vajíčka z trusu dostanou?",
      "Motolice je nejčastější na podmáčených pastvinách. Hledej živočicha s ulitou, který potřebuje vodu.",
    ],
    e: "Larvy motolice se nejdřív vyvíjejí ve vodním plži plovatce. Pak se dostanou na trávu a ovce je spase. Dospělá motolice žije v játrech.",
  },
  {
    q: "Které opatření chrání člověka před tasemnicí?",
    key: "maso důkladně propéct nebo provařit",
    d: [
      ["užít antibiotika při bolesti břicha", FB_ANTIBIOTIKA],
      ["nosit venku repelent proti komárům", "Komáři tasemnici nepřenášejí. Nákaza přichází z masa."],
      ["pít jen převařenou vodu z potoka", "Převařená voda před tasemnicí ve střevě nechrání. Rozhoduje tepelná úprava masa."],
    ],
    h: [
      "Tasemnice se šíří larvami ve svalech zvířat. Co larvy spolehlivě zničí?",
      "Larvy v mase nepřežijí vysokou teplotu. Opatření proto musí souviset s přípravou jídla, ne s vodou nebo hmyzem.",
    ],
    e: "Před tasemnicí chrání důkladná tepelná úprava masa, protože teplo larvy zničí. Pomáhá i veterinární kontrola masa.",
  },
  {
    q: "Které opatření chrání člověka před škrkavkou?",
    key: "mýt ruce a zeleninu před jídlem",
    d: [
      ["maso důkladně propéct na pánvi", "Propečené maso chrání před tasemnicí. Škrkavka se šíří vajíčky z hlíny."],
      ["užít pro jistotu antibiotika", FB_ANTIBIOTIKA],
      ["odvodnit podmáčenou pastvinu", "Odvodnění pastviny chrání ovce před motolicí, ne člověka před škrkavkou."],
    ],
    h: [
      "Vajíčka škrkavky se dostávají do úst z hlíny. Na čem všem mohou ulpět?",
      "Nákaza začíná tím, že člověk vajíčka spolkne. Ochrana tedy musí vajíčka odstranit dřív, než se dostanou do úst.",
    ],
    e: "Před škrkavkou chrání mytí rukou a důkladné omytí zeleniny. Tak se odstraní vajíčka z hlíny dřív, než je člověk spolkne.",
  },
  {
    q: "Které opatření chrání ovce před motolicí jaterní?",
    key: "odvodnit podmáčenou pastvinu",
    d: [
      ["dát ovcím antibiotika do vody", FB_ANTIBIOTIKA],
      ["zakázat lidem hladit ovce", "Motolice se nepřenáší dotykem. Larvy se vyvíjejí ve vodním plži."],
      ["pást ovce na mokré louce u vody", "Právě na mokrých loukách žijí plži, ve kterých se motolice vyvíjí. Riziko by stouplo."],
    ],
    h: [
      "Larvy motolice se vyvíjejí ve vodním plži. Jak lze plžům na pastvině vzít prostředí, ve kterém žijí?",
      "Motolice se nešíří dotykem a antibiotika na červy nepůsobí. Pomůže změnit místo, kde se ovce pasou, aby tam nebyla stojatá voda.",
    ],
    e: "Když se pastvina odvodní, zmizí vodní plži, ve kterých se vyvíjejí larvy motolice. Ovce se pak nemají odkud nakazit.",
  },
  {
    q: "Proč by si dítě s roupy mělo stříhat nehty nakrátko?",
    key: "vajíčka roupů se pod nimi drží",
    d: [
      ["dospělí roupi žijí pod nehty", "Dospělí roupi žijí v tlustém střevě, ne pod nehty."],
      ["krátké nehty léčí roupy ve střevě", "Nehty střevo neléčí. Roupy léčí lékař odčervovacími léky."],
      ["pod nehty se množí bakterie roupů", "Roupi nejsou bakterie, ale červi. Pod nehty se drží jejich vajíčka."],
    ],
    h: [
      "Dítě se v noci škrábe kolem řitního otvoru. Co mu přitom zůstane na prstech?",
      "Pod dlouhými nehty se snadno drží nečistota a to, co tam dítě při škrábání zachytí. Odtud se to pak dostane do úst.",
    ],
    e: "Při škrábání se vajíčka roupů zachytí pod nehty. Krátké nehty a mytí rukou brání tomu, aby je dítě znovu spolklo.",
  },
  {
    q: "Čím se liší tělo škrkavky od těla tasemnice?",
    key: "škrkavka je oblá, tasemnice plochá",
    d: [
      ["škrkavka je plochá, tasemnice oblá", "Je to obráceně. Škrkavka je hlíst s oblým tělem, tasemnice je plochý ploštěnec."],
      ["obě jsou oblé a z článků", "Oblé tělo z článků má žížala. Škrkavka články nemá a tasemnice je plochá."],
      ["obě jsou ploché a bez článků", "Tasemnice je článkovaná a škrkavka je oblá."],
    ],
    h: [
      "Škrkavka je hlíst a tasemnice ploštěnec. Co prozrazují názvy těch dvou skupin o tvaru těla?",
      "U každé možnosti ověř obě poloviny zvlášť: sedí tvar u škrkavky a sedí i u tasemnice? Nezapomeň, že tasemnice má tělo z článků.",
    ],
    e: "Škrkavka je hlíst, a má proto oblé tělo. Tasemnice je ploštěnec s plochým tělem z článků.",
  },
  {
    q: "Dítě si stěžuje na svědění kolem řitního otvoru, hlavně v noci. Kterého cizopasníka lékař hledá?",
    key: "roupa dětského",
    d: [
      ["škrkavku dětskou", "Škrkavka žije v tenkém střevě a svědění kolem řitního otvoru nezpůsobuje."],
      ["tasemnici", "Tasemnice se projevuje spíš bolestmi břicha a články ve stolici, ne nočním svěděním."],
      ["motolici jaterní", "Motolice cizopasí hlavně v játrech ovcí a skotu."],
    ],
    h: [
      "Svědění vzniká tam, kam samičky cizopasníka kladou vajíčka. Který červ je klade na kůži?",
      "Samičky tohoto hlísta vylézají v noci z tlustého střeva a kladou vajíčka ven z těla. Proto svědění přichází hlavně v noci.",
    ],
    e: "Noční svědění kolem řitního otvoru způsobuje roup dětský. Samičky tam v noci kladou vajíčka.",
  },
  {
    q: "Proč se tělo tasemnice může stále prodlužovat?",
    key: "za hlavičkou dorůstají nové články",
    d: [
      ["prodlužuje se jediný dlouhý článek", "Tasemnice nemá jeden článek, ale dlouhou řadu článků."],
      ["přirůstají k ní články jiných tasemnic", "Články se k tasemnici nepřipojují zvenku. Vznikají u hlavičky."],
      ["napíná se, když polyká potravu", "Tasemnice nemá ústa a potravu nepolyká. Přijímá ji povrchem těla."],
    ],
    h: [
      "Tělo tasemnice tvoří hlavička a za ní řada dílů. Kde nové díly vznikají?",
      "Nejmladší články jsou nejblíž hlavičce, nejstarší a nejzralejší na konci těla. Tasemnice nic nepolyká a nepřijímá díly zvenku.",
    ],
    e: "Za hlavičkou tasemnice stále dorůstají nové články a starší se posouvají dál. Proto může být tasemnice několik metrů dlouhá.",
  },
  {
    q: "Proč odcházejí se stolicí nemocného celé články tasemnice?",
    key: "zralé články jsou plné vajíček",
    d: [
      ["zbavuje se jimi nestrávené potravy", "Tasemnice potravu netráví ani nepolyká, přijímá ji povrchem těla."],
      ["články jsou odumřelé a prázdné", "Zralé články nejsou prázdné. Nesou vajíčka."],
      ["každý článek je samostatná tasemnice", "Článek je jen část těla. Celá tasemnice má hlavičku a mnoho článků."],
    ],
    h: [
      "Na konci těla tasemnice jsou nejstarší články. Co v nich za tu dobu dozrálo?",
      "Tasemnice je obojetník a v každém článku má pohlavní orgány. Uvolněné články se dostanou ven, aby se cizopasník mohl šířit dál.",
    ],
    e: "Nejstarší články na konci těla jsou plné vajíček. Uvolní se a odcházejí se stolicí, a tak se tasemnice šíří dál.",
  },
  {
    q: "Čím se škrkavka liší od tasemnice v tom, jak přijímá potravu?",
    key: "polyká ústy natrávenou potravu",
    d: [
      ["přijímá živiny jen povrchem těla", "Jen povrchem těla přijímá živiny tasemnice, která trávicí soustavu nemá."],
      ["saje krev ze stěny střeva", "Škrkavka krev nesaje. Polyká natrávenou potravu, která ji ve střevě obklopuje."],
      ["přijímá živiny přísavkami", "Přísavky škrkavka nemá. Má je tasemnice, a i té slouží jen k přichycení."],
    ],
    h: [
      "Tasemnice nemá trávicí soustavu, škrkavka ano. Co z toho plyne pro cestu, kudy se potrava dostane do těla škrkavky?",
      "Přísavky patří tasemnici, ne škrkavce. Hlísti mají trávicí trubici s otvorem na obou koncích.",
    ],
    e: "Škrkavka má ústa i trávicí trubici. Polyká natrávenou potravu ze střeva hostitele a nestrávené zbytky vylučuje řitním otvorem.",
  },
  {
    q: "Jak se dítě nejčastěji nakazí roupy?",
    key: "spolkne vajíčka ze špinavých rukou",
    d: [
      ["sní nedopečené maso s larvami", "Z masa s larvami se člověk nakazí tasemnicí, ne roupy."],
      ["bodne ho nakažený komár", "Komáři roupy nepřenášejí."],
      ["vykoupe se v rybníce s plži", "Vodní plži jsou mezihostitelé motolice. Roupi se šíří vajíčky."],
    ],
    h: [
      "Vajíčka roupů jsou na kůži, prádle a hračkách. Jak se z nich dostanou do úst?",
      "Nákaza začíná tím, že dítě vajíčka spolkne. Mysli na to, čím se dítě dotýká všeho kolem a pak třeba jídla.",
    ],
    e: "Roupy se dítě nakazí, když spolkne vajíčka, nejčastěji ze špinavých rukou nebo z hraček. Proto je důležité mytí rukou.",
  },
];

// ── L3 — přenos ─────────────────────────────────────────────────────────────
const BANK_L3: Fakt[] = [
  {
    q: "Neznámý červ má oblé nečlánkované tělo a trávicí trubici s řitním otvorem. U tohoto druhu jsou samci i samice. Kam ho zařadíš?",
    key: "mezi hlísty",
    d: [
      ["mezi kroužkovce", "Kroužkovci, třeba žížala, mají tělo z kroužků. Tento červ je nečlánkovaný."],
      ["mezi ploštěnce", "Ploštěnci mají ploché tělo a jsou většinou obojetníci. Tento červ je oblý."],
      ["mezi žahavce", "Žahavci, třeba nezmar, mají chapadla se žahavými buňkami a nejsou to červi."],
    ],
    h: [
      "Porovnej tři znaky: tvar těla, články a pohlaví. Která skupina splňuje všechny zároveň?",
      "Krok 1: oblé tělo vylučuje ploché ploštěnce. Krok 2: tělo bez článků vylučuje žížalu a její příbuzné. Zbude skupina, kam patří škrkavka.",
    ],
    e: "Oblé nečlánkované tělo, trávicí trubice s řitním otvorem a oddělená pohlaví jsou znaky hlístů. Kroužkovci mají články, ploštěnci ploché tělo.",
  },
  {
    q: "Plochý živočich bez trávicí soustavy má tělo z mnoha článků a žije ve střevě. O koho jde?",
    key: "o tasemnici",
    d: [
      ["o škrkavku", "Škrkavka ve střevě žije, ale je oblá, nečlánkovaná a trávicí trubici má."],
      ["o žížalu", "Žížala má články, ale je oblá, má trávicí soustavu a žije v půdě."],
      ["o motolici", "Motolice je plochá, ale bez článků a žije v játrech."],
    ],
    h: [
      "Projdi znaky jeden po druhém: plochý, bez trávicí soustavy, s články, ve střevě. Kdo splní všechny?",
      "Krok 1: plochý tvar vylučuje oblé červy. Krok 2: ze dvou plochých cizopasníků má články jen ten, který žije ve střevě.",
    ],
    e: "Ploché článkované tělo bez trávicí soustavy a život ve střevě jsou znaky tasemnice. Motolice je plochá, ale nemá články.",
  },
  {
    q: "Ovce na podmáčené pastvině onemocněla a veterinář zjistil, že má poškozená játra. Který cizopasník je nejpravděpodobnější?",
    key: "motolice jaterní",
    d: [
      ["škrkavka dětská", "Škrkavka dětská cizopasí ve střevě člověka, ne v játrech ovcí."],
      ["ploštěnka mléčná", FB_PLOSTENKA_VOLNE],
      ["roup dětský", "Roup dětský žije v tlustém střevě dětí, ne v játrech ovcí."],
    ],
    h: [
      "Dvě stopy: poškozená játra a mokrá pastvina. Který cizopasník potřebuje vodní prostředí pro svůj vývoj?",
      "Krok 1: vyluč volně žijícího ploštěnce a cizopasníky lidského střeva. Krok 2: ověř, že zbylý cizopasník se vyvíjí ve vodním plži a žije v játrech.",
    ],
    e: "Na podmáčené pastvině žijí vodní plži, mezihostitelé motolice jaterní. Dospělá motolice cizopasí v játrech ovcí a poškozuje je.",
  },
  {
    q: "Proč u ovcí na podmáčené pastvině pomůže proti nemoci jater, když se pastvina odvodní?",
    key: "ubude vodních plžů, ve kterých se vyvíjí motolice",
    d: [
      ["ubude komárů, kteří motolici přenášejí bodnutím", "Komáři motolici nepřenášejí. Její larvy se vyvíjejí ve vodním plži."],
      ["ubude klíšťat, která motolici přenášejí na ovce", "Klíšťata motolici nepřenášejí. Mezihostitelem je vodní plž."],
      ["ovce přestanou pít z louží vajíčka škrkavek", "Škrkavka dětská nemoc jater u ovcí nezpůsobuje. Jde o motolici."],
    ],
    h: [
      "Krok 1: který cizopasník poškozuje játra ovcí? Krok 2: kde probíhá vývoj jeho larev?",
      "Odvodnění vezme stojatou vodu. Přemýšlej, který živočich bez vody na pastvině nepřežije a co to znamená pro cizopasníka.",
    ],
    e: "Játra ovcí poškozuje motolice jaterní. Její larvy se vyvíjejí ve vodních plžích. Po odvodnění plži zmizí a motolice nemá mezihostitele.",
  },
  {
    q: "Honza ve škole viděl, jak učitel rozpůlil ploštěnku. Z každé poloviny za pár týdnů dorostl celý živočich. Jakou schopnost to dokazuje?",
    key: "regeneraci ztracených částí těla",
    d: [
      ["pučení jako u nezmara", "Při pučení vyroste nový jedinec jako výrůstek na zdravém těle. Tady dorostla chybějící část."],
      ["dělení buňky jako u prvoků", "Ploštěnka je mnohobuněčná. Dělení jediné buňky je znak prvoků."],
      ["odolnost vůči všem zraněním", "Ploštěnka není odolná vůči všemu. Umí jen obnovit chybějící část těla."],
    ],
    h: [
      "Poloviny ploštěnky si dokázaly vytvořit to, co jim chybělo. Jak se taková schopnost jmenuje?",
      "Krok 1: nejde o prvoka, ploštěnka má mnoho buněk. Krok 2: nový jedinec nevyrostl jako výrůstek, ale chybějící část těla se obnovila.",
    ],
    e: "Ploštěnka umí obnovit ztracené části těla, tedy regenerovat. Proto z každé poloviny doroste celý živočich.",
  },
  {
    q: "Sourozenci mají roupy. Které opatření zabrání opakované nákaze?",
    key: "mytí rukou, krátké nehty a léčba celé rodiny",
    d: [
      ["mytí rukou, krátké nehty a léčba jen dítěte, které svědí", "Vajíčka se v rodině snadno šíří dál. Když se léčí jen jedno dítě, nákaza se vrátí od ostatních."],
      ["mytí rukou, propečené maso a antibiotika pro rodinu", "Antibiotika na červy nepůsobí a roupi se masem nešíří. Léčí se odčervovacím lékem od lékaře."],
      ["převařená voda, propečené maso a léčba celé rodiny", "Voda a maso roupy nepřenášejí. Bez mytí rukou a krátkých nehtů se vajíčka roznášejí dál."],
    ],
    h: [
      "Krok 1: jak se roupi šíří? Krok 2: kdo všechno v domácnosti mohl vajíčka spolknout?",
      "Vajíčka jsou na rukou, pod nehty, na prádle i hračkách. Opatření musí přerušit šíření u všech, jinak se nákaza vrátí.",
    ],
    e: "Roupi se šíří vajíčky na rukou. Pomáhá mytí rukou, krátké nehty, praní prádla a léčba celé rodiny odčervovacím lékem od lékaře.",
  },
  {
    q: "Pod kamenem v čistém potoce najdeš malého dravého živočicha. Tělo má ploché, bez kroužků i bez článků, a nemá přísavky. Kam ho zařadíš?",
    key: "mezi ploštěnce",
    d: [
      ["mezi hlísty", "Hlísti mají oblé tělo. Tento živočich je plochý."],
      ["mezi kroužkovce", "V potocích žijí i zploštělé pijavky, ale ty mají tělo z kroužků a přísavky. Tento živočich nemá ani jedno."],
      ["mezi žahavce", "Žahavci, třeba nezmar, mají trubkovité tělo s chapadly se žahavými buňkami. Plochý dravec bez chapadel to není."],
    ],
    h: [
      "Pod kameny v potocích žijí i pijavky. Které znaky z popisu pijavku vylučují?",
      "Krok 1: bez kroužků a přísavek to není pijavka. Krok 2: plochého nečlánkovaného dravce přiřaď ke skupině, kam patří i motolice.",
    ],
    e: "Ploché tělo bez kroužků a článků má ploštěnka, dravec z čistých potoků. Patří mezi ploštěnce. Pijavky v potocích také žijí, ale mají tělo z kroužků a přísavky.",
  },
  {
    q: "Při kontrole na jatkách našel veterinář ve svalech prasete drobné měchýřky s larvami. Proč takové maso nesmí do obchodu?",
    key: "člověk by se nakazil tasemnicí",
    d: [
      ["člověk by se nakazil škrkavkou", "Škrkavkou se člověk nakazí vajíčky z hlíny, ne larvami v mase."],
      ["člověk by se nakazil motolicí", "Larvy motolice se vyvíjejí ve vodním plži, ne ve svalech prasete."],
      ["člověk by se nakazil roupy", "Roupi se šíří vajíčky na rukou, ne masem."],
    ],
    h: [
      "Krok 1: který cizopasník má larvy ve svalech zvířat? Krok 2: jak se z nich stane dospělý červ?",
      "Larvy ve svalech čekají, až maso sní další hostitel. Ve střevě člověka z nich vyroste plochý článkovaný červ.",
    ],
    e: "Měchýřky s larvami ve svalech (boubele) patří tasemnici. Kdyby člověk snědl maso nedostatečně upravené, vyrostla by mu tasemnice ve střevě.",
  },
  {
    q: "Drobný bílý červ s oblým tělem způsobuje dětem v noci svědění. Nákaza se v kolektivu šíří rukama a hračkami. O koho jde?",
    key: "o roupa dětského",
    d: [
      ["o škrkavku dětskou", "Škrkavka je také oblá, ale měří až desítky centimetrů a svědění nezpůsobuje. Nakazí se jí člověk hlavně z neumyté zeleniny."],
      ["o tasemnici", "Tasemnice je plochá a článkovaná, ne oblá."],
      ["o motolici jaterní", "Motolice je plochá a žije v játrech."],
    ],
    h: [
      "Krok 1: oblé tělo znamená hlísta. Krok 2: který hlíst klade vajíčka mimo střevo, a proto způsobuje svědění?",
      "Druhý oblý cizopasník člověka je velký a šíří se z neumyté zeleniny. Hledej drobného hlísta, jehož vajíčka se snadno roznášejí na prstech.",
    ],
    e: "Drobný oblý červ, noční svědění a šíření rukama v kolektivu jsou znaky roupa dětského. Samičky v noci vylézají z tlustého střeva a kladou vajíčka kolem řitního otvoru.",
  },
  {
    q: "Červ s oblým tělem dlouhým přes 20 cm žije v tenkém střevě. Člověk se nakazil ze zeleniny, kterou neumyl. O koho jde?",
    key: "o škrkavku dětskou",
    d: [
      ["o tasemnici", "Tasemnice žije také ve střevě, ale je plochá a nakazí se jí člověk z masa."],
      ["o roupa dětského", "Roup je oblý, ale drobný a žije v tlustém střevě."],
      ["o žížalu obecnou", "Žížala žije v půdě, není cizopasník a má tělo z kroužků."],
    ],
    h: [
      "Krok 1: oblé tělo a cizopasení ve střevě znamenají hlísta. Krok 2: který hlíst je velký a žije v tenkém střevě?",
      "Porovnej velikost a místo: jeden oblý cizopasník je drobný a žije v tlustém střevě, druhý je dlouhý a žije v tenkém. Vajíčka toho druhého bývají v hlíně.",
    ],
    e: "Velký oblý červ z tenkého střeva, kterým se člověk nakazí z neumyté zeleniny, je škrkavka dětská.",
  },
  {
    q: "Živočich má ploché tělo bez článků a přísavky. Cizopasí v játrech ovcí. O koho jde?",
    key: "o motolici",
    d: [
      ["o tasemnici", "Tasemnice má přísavky, ale její tělo je z článků a žije ve střevě."],
      ["o ploštěnku", FB_PLOSTENKA_VOLNE],
      ["o pijavku", "Pijavka má přísavky, ale tělo z kroužků. Je to kroužkovec a nežije v játrech."],
    ],
    h: [
      "Přísavky má víc živočichů. Rozhodni podle tvaru těla a místa, kde cizopasí.",
      "Krok 1: vyluč živočicha s kroužky a toho, kdo žije volně. Krok 2: ze dvou plochých cizopasníků vyber toho bez článků, který nežije ve střevě.",
    ],
    e: "Ploché tělo bez článků, přísavky a cizopasení v játrech ovcí jsou znaky motolice jaterní.",
  },
  {
    q: "Ploštěnka i tasemnice patří mezi ploštěnce, ale trávicí soustavu má jen ploštěnka. Čím se to dá vysvětlit?",
    key: "tasemnice žije v natrávené potravě hostitele",
    d: [
      ["ploštěnka je cizopasník a živí se krví", FB_PLOSTENKA_VOLNE],
      ["tasemnice potravu tráví přísavkami", "Přísavky tasemnici jen přidržují, netráví."],
      ["tasemnice potravu vůbec nepotřebuje", "Tasemnice potřebuje živiny, jen je přijímá celým povrchem těla."],
    ],
    h: [
      "Krok 1: kde každý z nich žije? Krok 2: kdo musí potravu sám ulovit a strávit a kdo ji má kolem sebe hotovou?",
      "Dravec potřebuje orgány, které ulovenou kořist rozloží. Cizopasník ve střevě dostává potravu, kterou už rozložil někdo jiný.",
    ],
    e: "Ploštěnka loví kořist a musí ji strávit. Tasemnice žije v natrávené potravě hostitele a živiny přijímá povrchem těla, trávicí soustavu nepotřebuje.",
  },
  {
    q: "Kamarád tvrdí, že tasemnice je příbuzná žížaly, protože obě mají tělo z článků. Proč nemá pravdu?",
    key: "tasemnice je plochá, žížala oblá",
    d: [
      ["žížala je hlíst, tasemnice ne", "Žížala není hlíst. Má tělo z kroužků a patří ke kroužkovcům."],
      ["tasemnice nemá žádné články", "Tasemnice články má. Liší se od žížaly tvarem těla."],
      ["žížala je cizopasník, tasemnice ne", "Je to obráceně. Tasemnice je cizopasník, žížala žije volně v půdě."],
    ],
    h: [
      "Podobnost v jednom znaku ještě neznamená příbuznost. Který jiný znak těla se u nich liší?",
      "Krok 1: porovnej tvar těla na průřezu. Krok 2: články tasemnice jsou jen opakující se díly s vajíčky, které dorůstají za hlavičkou. Kroužky žížaly jsou jiný typ článků.",
    ],
    e: "Tasemnice je plochá a patří mezi ploštěnce, žížala je oblá a patří mezi kroužkovce. Tvar těla je jeden z hlavních znaků, podle kterých se tyto skupiny rozlišují. Články tasemnice a kroužky žížaly nejsou stejný znak, proto podobnost o příbuznosti nerozhoduje.",
  },
  {
    q: "Dítě mělo roupy a lékař mu dal lék. Za měsíc je má znovu, i když si myje ruce. Co je nejpravděpodobnější příčina?",
    key: "nakazilo se znovu od neléčeného sourozence",
    d: [
      ["roupi odolali všem odčervovacím lékům", "Odčervovací léky na roupy zabírají. Nákaza se spíš vrátila od někoho z rodiny."],
      ["chyběla antibiotika k odčervovacímu léku", FB_ANTIBIOTIKA],
      ["roupi se mu vylíhli z nedopečeného masa", "Masem se šíří tasemnice, ne roupi."],
    ],
    h: [
      "Krok 1: jak snadno se roupi šíří mezi lidmi v jedné domácnosti? Krok 2: kdo další mohl mít vajíčka?",
      "Dítě si ruce myje, a přesto se nakazilo. Vajíčka mohla přijít od někoho, kdo s ním sdílí pokoj, ručníky a hračky a nebyl léčen.",
    ],
    e: "Roupi se v rodině snadno šíří. Když se léčí jen jedno dítě, může se nakazit znovu od sourozence. Proto lékař léčí celou rodinu.",
  },
  {
    q: "Tasemnice nemá oči ani trávicí soustavu a její tělo tvoří hlavně články s pohlavními orgány. Jak to souvisí s jejím způsobem života?",
    key: "hostitel jí dává potravu, ona se hlavně množí",
    d: [
      ["ve tmě střeva nepotřebuje vůbec žádnou potravu", "Tasemnice potravu potřebuje, přijímá ji povrchem těla."],
      ["potravu si vyrábí sama uvnitř svých článků", "Potravu si vyrábějí rostliny. Tasemnice ji bere od hostitele."],
      ["je to jen nedospělá larva, která ještě doroste", "Dospělá tasemnice žije ve střevě a oči ani trávicí soustavu mít nebude."],
    ],
    h: [
      "Krok 1: co tasemnici zajišťuje hostitel? Krok 2: na co pak cizopasník vynakládá většinu těla?",
      "Ve střevě nepotřebuje hledat kořist ani ji trávit. Aby se cizopasník dostal k dalšímu hostiteli, musí vytvořit obrovské množství vajíček.",
    ],
    e: "Hostitel dává tasemnici úkryt i natrávenou potravu, takže oči ani trávicí soustavu nepotřebuje. Její tělo slouží hlavně k tvorbě vajíček.",
  },
];

const genL1 = () => uloha(pick(BANK_L1));
const genL2 = () => uloha(pick(BANK_L2));
const genL3 = () => uloha(pick(BANK_L3));

function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const PLOSTENCI_HLISTI: TopicMetadata[] = [
  {
    id: "g6-pri-plostenci-hlisti-6",
    rvpNodeId: "g6-prirodopis-biologie-zivocichu-bezobratli-zahavci-plostenci-hlisti-plostenci-tasemnice-motolice-hlisti-skrkavka",
    displayName: "Ploštěnci a hlísti",
    title: "Ploštěnci a hlísti",
    studentTitle: "Ploštěnci a hlísti – tasemnice, motolice, škrkavka, roup",
    subject: "prirodopis",
    category: "Biologie živočichů",
    topic: "Bezobratlí - žahavci, ploštěnci, hlísti",
    briefDescription: "Poznáš ploštěnce a hlísty a víš, jak se chránit před cizopasnými červy",
    keywords: [
      "ploštěnci", "hlísti", "ploštěnka", "motolice", "tasemnice", "škrkavka", "roup",
      "cizopasník", "mezihostitel", "regenerace", "obojetník", "prevence",
    ],
    goals: [
      "Rozlišit ploštěnce a hlísty podle stavby těla a způsobu života.",
      "Spojit cizopasníka s místem v těle, cestou nákazy a prevencí.",
      "Určit organismus z popisu znaků a vysvětlit souvislost znaku a funkce.",
    ],
    boundaries: [
      "Jen zástupci z běžných učebnic 6. ročníku; latinské názvy nejsou klíčem.",
      "Tasemnice se nerozlišuje na hovězí a vepřovou.",
      "Léčbu určuje lékař; úlohy učí prevenci, ne léčení.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Ploštěnci jsou plocí (ploštěnka, motolice, tasemnice), hlísti oblí a nečlánkovaní (škrkavka, roup). U cizopasníka se ptej: kde žije, jak se jím člověk nakazí a co tomu zabrání.",
      steps: [
        "Najdi v zadání znak: tvar těla, články, místo v těle nebo cestu nákazy.",
        "Přiřaď znak ke skupině nebo ke konkrétnímu červovi.",
        "U prevence vyber opatření, které přeruší právě tuhle cestu nákazy.",
      ],
      commonMistake: "Považovat žížalu za hlísta, myslet si, že tasemnice jí ústy, nebo chtít na červy antibiotika.",
      example: "Svědění kolem řitního otvoru v noci způsobuje roup. Chrání mytí rukou, krátké nehty a léčba celé rodiny.",
    },
  },
];
