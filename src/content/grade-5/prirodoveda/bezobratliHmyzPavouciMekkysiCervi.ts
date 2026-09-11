import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a zpětné vazby a na L2/L3 jen 4–7 různých otázek. Teď:
// L1 poznávání skupin (hmyz, pavoukovci, měkkýši, kroužkovci) · L2 proměna
// hmyzu, dýchání, užitek a škodlivost · L3 zrádné případy a úvahy.

const L1: PracticeTask[] = [
  choice("Kolik nohou má hmyz?", "šest", [
    { value: "osm", why: "Osm nohou mají pavoukovci." },
    { value: "čtyři", why: "Čtyři nohy mají například savci; hmyz jich má víc." },
    { value: "deset", why: "Deset nohou má rak — korýš." },
  ], {
    hints: ["Vzpomeň si na mravence nebo včelu. Kolik mají nohou?", "Hmyz má nohy ve třech párech na hrudi; pavouci mají o jeden pár víc."],
    explanation: "Hmyz má šest nohou (tři páry) a tělo ze tří částí: hlavy, hrudi a zadečku.",
  }),
  choice("Kolik nohou má pavouk?", "osm", [
    { value: "šest", why: "Šest nohou má hmyz." },
    { value: "deset", why: "Deset nohou má rak." },
    { value: "sto", why: "Hodně nohou má stonožka, ta ale není pavouk." },
  ], {
    hints: ["Pavouk má víc nohou než hmyz. Kolik?", "Pavoukovci mají čtyři páry nohou — o jeden pár víc než hmyz."],
    explanation: "Pavouk má osm nohou (čtyři páry) a tělo ze dvou částí.",
  }),
  choice("Který živočich patří mezi hmyz?", "včela", [
    { value: "pavouk křižák", why: "Křižák má osm nohou — je to pavoukovec." },
    { value: "hlemýžď", why: "Hlemýžď je měkkýš s ulitou." },
    { value: "žížala", why: "Žížala je kroužkovec bez nohou." },
  ], {
    hints: ["Hledej živočicha se šesti nohama.", "Hmyz má tělo ze tří částí — hlavu, hruď a zadeček — a často i křídla."],
    explanation: "Včela má šest nohou, křídla a tělo ze tří částí — je to hmyz.",
  }),
  choice("Který živočich je měkkýš?", "hlemýžď", [
    { value: "brouk", why: "Brouk má šest nohou a krovky — je to hmyz." },
    { value: "pavouk", why: "Pavouk má osm nohou — je to pavoukovec." },
    { value: "žížala", why: "Žížala má tělo z kroužků — je to kroužkovec." },
  ], {
    hints: ["Měkkýši mají měkké tělo a často ulitu.", "Hledej živočicha, který nosí na zádech ulitu a leze po jedné svalnaté noze."],
    explanation: "Hlemýžď má měkké tělo, svalnatou nohu a ulitu — je to měkkýš.",
  }),
  choice("Kam patří žížala?", "mezi kroužkovce", [
    { value: "mezi hmyz", why: "Hmyz má šest nohou; žížala nemá žádné." },
    { value: "mezi pavoukovce", why: "Pavoukovci mají osm nohou." },
    { value: "mezi měkkýše", why: "Měkkýši mají svalnatou nohu a často ulitu." },
  ], {
    hints: ["Má žížala nohy nebo ulitu?", "Tělo žížaly je složené z mnoha stejných článků jako prstýnků a nemá nohy."],
    explanation: "Žížala má tělo z mnoha článků (kroužků) — patří mezi kroužkovce, lidově červy.",
  }),
  choice("Z kolika částí se skládá tělo hmyzu?", "ze tří", [
    { value: "ze dvou", why: "Ze dvou částí je tělo pavouka." },
    { value: "ze čtyř", why: "Hmyz má hlavu, hruď a zadeček — to jsou tři." },
    { value: "z jedné", why: "Tělo hmyzu je zřetelně rozdělené." },
  ], {
    hints: ["Vzpomeň si na mravence — jak je jeho tělo rozdělené?", "Mravenec má hlavu, pak hruď, na které jsou nohy, a nakonec zadeček."],
    explanation: "Tělo hmyzu tvoří hlava, hruď a zadeček.",
  }),
  choice("Z kolika částí se skládá tělo pavouka?", "ze dvou", [
    { value: "ze tří", why: "Ze tří částí je tělo hmyzu." },
    { value: "ze čtyř", why: "Pavouk má jen hlavohruď a zadeček." },
    { value: "z jedné", why: "Pavoukovo tělo je rozdělené na dvě části." },
  ], {
    hints: ["Pavouk má méně tělních částí než hmyz.", "Pavouk má hlavohruď, na které jsou nohy, a zadeček se snovacími bradavkami."],
    explanation: "Tělo pavouka tvoří hlavohruď a zadeček.",
  }),
  choice("Čím pavouk nejčastěji chytá kořist?", "sítí", [
    { value: "žihadlem", why: "Žihadlo má včela nebo vosa." },
    { value: "ulitou", why: "Ulitu má hlemýžď a kořist s ní nechytá." },
    { value: "sosákem", why: "Sosákem saje motýl nektar." },
  ], {
    hints: ["Co pavouk vyrábí ze snovacích bradavek?", "Z vlákna utká síť; hmyz se na ní přilepí a pavouk ho pak otráví."],
    explanation: "Pavouk utká síť z pavučiny; kořist se do ní chytí a pavouk ji otráví.",
  }),
  choice("Proč jsou včely pro přírodu důležité?", "opylují květy", [
    { value: "žerou mšice", why: "Mšice žerou slunéčka, ne včely." },
    { value: "rozkládají listí", why: "Listí rozkládají hlavně žížaly a houby." },
    { value: "čistí vodu", why: "Vodu filtrují třeba škeble." },
  ], {
    hints: ["Co včela dělá, když létá z květu na květ?", "Na chloupcích přenáší pyl z květu na květ, a díky tomu se z květů stanou plody."],
    explanation: "Včely přenášejí pyl — opylují květy, a bez nich by bylo mnohem méně ovoce.",
  }),
  choice("Který živočich není hmyz?", "pavouk", [
    { value: "moucha", why: "Moucha má šest nohou a křídla — je to hmyz." },
    { value: "motýl", why: "Motýl má šest nohou — je to hmyz." },
    { value: "brouk", why: "Brouk má šest nohou a krovky — je to hmyz." },
  ], {
    hints: ["Spočítej v duchu nohy u každého.", "Hmyz má šest nohou; jeden z těch živočichů má osm, a proto patří jinam."],
    explanation: "Pavouk má osm nohou a tělo ze dvou částí — hmyz to není.",
  }),
  choice("Co má hlemýžď na hlavě?", "tykadla s očima", [
    { value: "kusadla", why: "Kusadla mají brouci nebo mravenci." },
    { value: "sosák", why: "Sosák má motýl." },
    { value: "krovky", why: "Krovky jsou tvrdá křídla brouků." },
  ], {
    hints: ["Čím se hlemýžď dívá a ohmatává okolí?", "Na hlavě má dva páry výběžků; na konci delšího páru jsou oči."],
    explanation: "Hlemýžď má na hlavě tykadla; na delších jsou oči.",
  }),
  choice("Kde žije škeble?", "ve vodě", [
    { value: "v půdě", why: "V půdě žije žížala." },
    { value: "na stromech", why: "Škeble nemá nohy, na stromy by nevylezla." },
    { value: "v poušti", why: "Škeble by v poušti vyschla." },
  ], {
    hints: ["Škeble je měkkýš se dvěma lasturami.", "Lastury se pootevřou, aby škeble mohla filtrovat potravu z tekutiny kolem sebe — v rybníce nebo řece."],
    explanation: "Škeble žije v rybnících a řekách a filtruje z vody potravu.",
  }),
  choice("Který živočich nosí ulitu?", "hlemýžď", [
    { value: "slimák", why: "Slimák je měkkýš, ale ulitu nemá." },
    { value: "žížala", why: "Žížala ulitu nemá, je to kroužkovec." },
    { value: "stonožka", why: "Stonožka má mnoho nohou, ulitu ne." },
  ], {
    hints: ["Který z těch živočichů si nese domeček na zádech?", "Hledej měkkýše, který se při nebezpečí schová do svého domečku na zádech."],
    explanation: "Hlemýžď nosí ulitu, do které se schová; slimák ulitu nemá.",
  }),
];

const L2: PracticeTask[] = [
  choice("Jak se jmenuje proměna, při které z housenky vznikne kukla a z ní motýl?", "dokonalá proměna", [
    { value: "nedokonalá proměna", why: "Při nedokonalé proměně kukla chybí — třeba u kobylky." },
    { value: "svlékání kůže", why: "Svlékání je jen jeden krok růstu, ne celá proměna." },
    { value: "líhnutí", why: "Líhnutí je jen začátek — z vajíčka vyleze larva." },
  ], {
    hints: ["Má motýl ve vývoji stadium kukly?", "Proměna se stadiem kukly se jmenuje jinak než proměna bez kukly, jakou má třeba kobylka."],
    explanation: "Motýl: vajíčko → housenka → kukla → dospělec. Proměně s kuklou říkáme dokonalá.",
  }),
  choice("Který hmyz má nedokonalou proměnu, tedy bez kukly?", "kobylka", [
    { value: "motýl", why: "Motýl se zakuklí — má proměnu dokonalou." },
    { value: "včela", why: "Včela má stadium kukly — proměnu dokonalou." },
    { value: "moucha", why: "Moucha se zakuklí — proměnu má dokonalou." },
  ], {
    hints: ["Hledej hmyz, jehož larva vypadá podobně jako dospělec.", "Larva tohoto hmyzu vypadá jako malý dospělý jedinec bez křídel a roste postupným svlékáním."],
    explanation: "Mladá kobylka vypadá jako malý dospělec a kuklu nevytváří — má nedokonalou proměnu.",
  }),
  choice("Jak se jmenuje larva motýla?", "housenka", [
    { value: "pulec", why: "Pulec je larva žáby." },
    { value: "ponrava", why: "Ponrava je larva chrousta." },
    { value: "kukla", why: "Kukla je klidové stadium, ne larva." },
  ], {
    hints: ["Ta larva žere listy a leze po rostlinách.", "Z vajíčka motýla se vylíhne larva s mnoha páry panožek; po čase se zakuklí."],
    explanation: "Z vajíčka motýla se líhne housenka, která žere listy a pak se zakuklí.",
  }),
  choice("Co je kukla?", "stadium, ve kterém se larva mění v dospělce", [
    { value: "vajíčko, ze kterého se vylíhne housenka", why: "Vajíčko je až na začátku vývoje." },
    { value: "dospělý hmyz, který už neroste", why: "Dospělec z kukly teprve vyleze." },
    { value: "kůže, kterou larva svlékne", why: "Svlečená kůže je jen obal; kukla je živý tvor." },
  ], {
    hints: ["Co je mezi housenkou a motýlem?", "Housenka přestane žrát, obalí se a v klidu se uvnitř přestaví na motýla."],
    explanation: "Kukla je klidové stadium dokonalé proměny, ve kterém se larva mění v dospělce.",
  }),
  choice("Proč je žížala užitečná?", "kypří půdu a mění zbytky rostlin v humus", [
    { value: "opyluje květy na polích a zahradách", why: "Květy opylují hlavně včely a jiný hmyz." },
    { value: "chytá škodlivý hmyz do sítí", why: "Sítě tká pavouk." },
    { value: "čistí vodu v řekách a rybnících", why: "Vodu filtrují škeble." },
  ], {
    hints: ["Kde žížala žije a co tam dělá?", "Žížala dělá v zemi chodbičky, kterými se dostane vzduch ke kořenům, a požírá spadané listí."],
    explanation: "Žížala provzdušňuje půdu a ze zbytků rostlin dělá úrodný humus.",
  }),
  choice("Čím dýchá hmyz?", "vzdušnicemi", [
    { value: "plícemi", why: "Plícemi dýchají savci, ptáci a plazi." },
    { value: "žábrami", why: "Žábrami dýchají ryby." },
    { value: "celým povrchem těla", why: "Celým povrchem těla dýchá žížala." },
  ], {
    hints: ["Hmyz nemá plíce. Jak se k jeho buňkám dostane vzduch?", "Na bocích těla má drobné otvory, ze kterých vedou dovnitř tenké trubičky."],
    explanation: "Hmyz dýchá soustavou trubiček — vzdušnic, do kterých vede vzduch otvory na bocích těla.",
  }),
  choice("Čím pavouk otráví kořist?", "klepítky", [
    { value: "žihadlem", why: "Žihadlo má včela nebo vosa." },
    { value: "sosákem", why: "Sosákem saje motýl nektar." },
    { value: "kusadly", why: "Kusadla má hmyz, třeba brouk; pavouk má klepítka." },
  ], {
    hints: ["U úst má pavouk dva ostré háčky. Jak se jmenují?", "Háčky u úst pavouka jsou spojené s jedovými žlázami; kousnutím kořist ochromí."],
    explanation: "Pavouk má u úst klepítka s jedovými žlázami, kterými kořist otráví.",
  }),
  choice("Který živočich škodí na zahradě?", "slimák", [
    { value: "slunéčko sedmitečné", why: "Slunéčko žere mšice, je užitečné." },
    { value: "žížala", why: "Žížala kypří půdu, je užitečná." },
    { value: "včela", why: "Včela opyluje květy, je užitečná." },
  ], {
    hints: ["Který z nich okusuje listy salátu a jahody?", "Tento měkkýš nemá ulitu a za vlhka vyleze na záhony."],
    explanation: "Slimáci okusují zeleninu a jahody — zahrádkáři je považují za škůdce.",
  }),
  choice("Proč je slunéčko sedmitečné užitečné?", "žere mšice", [
    { value: "opyluje ovocné stromy", why: "Ovocné stromy opylují hlavně včely." },
    { value: "kypří půdu", why: "Půdu kypří žížaly." },
    { value: "rozkládá dřevo", why: "Dřevo rozkládají houby a někteří brouci." },
  ], {
    hints: ["Čím se slunéčko živí?", "Slunéčko i jeho larvy loví drobný hmyz, který saje šťávu z rostlin."],
    explanation: "Slunéčko a jeho larvy požírají mšice, a tím chrání rostliny.",
  }),
  choice("Který z těchto živočichů může přenést nemoc?", "klíště", [
    { value: "slunéčko", why: "Slunéčko žere mšice a lidem neškodí." },
    { value: "čmelák", why: "Čmelák opyluje květy." },
    { value: "žížala", why: "Žížala kypří půdu." },
  ], {
    hints: ["Který z nich saje krev?", "Po návratu z lesa je dobré prohlédnout si kůži, jestli se k ní tento drobný živočich nepřisál."],
    explanation: "Klíště saje krev a může přenést boreliózu nebo klíšťovou encefalitidu.",
  }),
  choice("Kam patří klíště?", "mezi pavoukovce", [
    { value: "mezi hmyz", why: "Hmyz má šest nohou, dospělé klíště osm." },
    { value: "mezi měkkýše", why: "Měkkýši mají měkké tělo bez nohou." },
    { value: "mezi kroužkovce", why: "Kroužkovci nemají nohy." },
  ], {
    hints: ["Spočítej klíštěti nohy.", "Dospělé klíště má čtyři páry nohou, stejně jako křižák."],
    explanation: "Klíště má osm nohou — patří mezi pavoukovce.",
  }),
  choice("Čím motýl saje nektar?", "sosákem", [
    { value: "kusadly", why: "Kusadly hmyz kouše, třeba brouk." },
    { value: "klepítky", why: "Klepítka má pavouk." },
    { value: "žihadlem", why: "Žihadlem se včela brání." },
  ], {
    hints: ["Motýl nemá čím kousat. Jak se dostane k nektaru hluboko v květu?", "Motýl má u hlavy stočenou trubičku, kterou rozvine a strčí do květu. Když nesaje, nosí ji svinutou jako hodinovou pružinu."],
    explanation: "Motýl saje nektar dlouhým sosákem, který má jinak stočený pod hlavou.",
  }),
  choice("Co mají společného hmyz a pavoukovci?", "článkované nohy", [
    { value: "ulitu na zádech", why: "Ulitu mají někteří měkkýši." },
    { value: "šest nohou", why: "Šest nohou má jen hmyz; pavoukovci osm." },
    { value: "dvě křídla", why: "Pavoukovci křídla nemají." },
  ], {
    hints: ["Podívej se, jak jsou poskládané končetiny mravence a pavouka.", "Jejich končetiny se skládají z několika článků jako kolena a lokty — proto obě skupiny patří mezi členovce."],
    explanation: "Hmyz i pavoukovci mají článkované nohy a pevnou pokožku — patří mezi členovce.",
  }),
];

const L3: PracticeTask[] = [
  choice("Stonožka má mnoho nohou. Je to hmyz?", "ne, hmyz má jen šest nohou", [
    { value: "ano, protože má nohy", why: "Nohy mají i pavouci a korýši." },
    { value: "ano, protože je malá", why: "Velikost o zařazení nerozhoduje." },
    { value: "ne, protože nemá hlavu", why: "Hlavu stonožka má." },
  ], {
    hints: ["Kolik nohou má hmyz?", "Stonožka má desítky párů nohou; hmyz jich má přesně tři páry."],
    explanation: "Hmyz má vždy šest nohou. Stonožka jich má mnohem víc, a proto hmyz není.",
  }),
  choice("Slimák nemá ulitu. Patří přesto mezi měkkýše?", "ano, má měkké tělo a svalnatou nohu", [
    { value: "ne, měkkýš musí mít ulitu", why: "Ulitu nemají všichni měkkýši." },
    { value: "ne, je to kroužkovec", why: "Kroužkovci mají tělo z článků." },
    { value: "ne, je to hmyz", why: "Hmyz má šest nohou." },
  ], {
    hints: ["Podle čeho poznáš měkkýše — jen podle ulity?", "Měkkýši mají měkké nečlánkované tělo a lezou po svalnaté noze; ulita je jen u některých."],
    explanation: "Slimák má měkké tělo a svalnatou nohu — je to měkkýš, jen bez ulity.",
  }),
  choice("V jakém pořadí se vyvíjí motýl?", "vajíčko, housenka, kukla, motýl", [
    { value: "vajíčko, kukla, housenka, motýl", why: "Kukla vzniká až z housenky." },
    { value: "housenka, vajíčko, kukla, motýl", why: "Na začátku je vajíčko." },
    { value: "vajíčko, housenka, motýl", why: "Motýl má dokonalou proměnu, stadium kukly nechybí." },
  ], {
    hints: ["Co je úplně na začátku a co na konci?", "Z vajíčka se vylíhne larva, ta se zakuklí a z kukly vyletí dospělec."],
    explanation: "Motýl prochází dokonalou proměnou: vajíčko → housenka → kukla → motýl.",
  }),
  choice("Na listech jsou mšice a u nich slunéčka. Co se stane?", "slunéčka budou mšice žrát", [
    { value: "mšice budou žrát slunéčka", why: "Mšice sají šťávu z rostlin, jiný hmyz nežerou." },
    { value: "slunéčka budou mšice opylovat", why: "Opylují se květy, ne živočichové." },
    { value: "nic, nevšímají si jich", why: "Mšice jsou pro slunéčka potrava." },
  ], {
    hints: ["Kdo je tu lovec a kdo kořist?", "Slunéčka a jejich larvy jsou dravci drobného hmyzu, který saje šťávu z rostlin."],
    explanation: "Slunéčka mšice žerou — zahrádkáři jsou za ně rádi.",
  }),
  choice("Proč se pavouk nepřilepí na vlastní síť?", "chodí po vláknech, která nelepí", [
    { value: "je těžší než hmyz", why: "Hmotnost s lepením nesouvisí." },
    { value: "pavučina nelepí vůbec", why: "Lepivá vlákna v síti jsou — na nich uvízne kořist." },
    { value: "má na nohou ulitu", why: "Ulitu mají měkkýši." },
  ], {
    hints: ["Jsou všechna vlákna v síti stejná?", "Síť má paprsky, které nelepí, a lepivou spirálu; pavouk se lepivých míst vyhýbá."],
    explanation: "V síti jsou lepivá i nelepivá vlákna. Pavouk chodí po nelepivých a lepivým se vyhne.",
  }),
  choice("Kam se na zimu poděje hmyz?", "přečká ji jako vajíčko, kukla nebo schovaný dospělec", [
    { value: "odletí na jih jako vlaštovky", why: "Většina hmyzu nikam neodlétá; přezimuje u nás." },
    { value: "všechen uhyne a nový vznikne ze země", why: "Hmyz nevzniká ze země — rodí se z vajíček." },
    { value: "zmenší se tak, že není vidět", why: "Hmyz se nezmenšuje; schová se." },
  ], {
    hints: ["Kde můžeš v zimě najít třeba slunéčko nebo kuklu motýla?", "Hmyz přečká zimu ve skrýši — pod kůrou, v zemi nebo v listí — často v klidovém stadiu."],
    explanation: "Hmyz přezimuje jako vajíčko, larva, kukla nebo schovaný dospělec a na jaře se znovu objeví.",
  }),
  choice("Který živočich je nejbližší příbuzný pavouka?", "štír", [
    { value: "brouk", why: "Brouk je hmyz se šesti nohama." },
    { value: "hlemýžď", why: "Hlemýžď je měkkýš." },
    { value: "žížala", why: "Žížala je kroužkovec." },
  ], {
    hints: ["Kdo z nich má osm nohou?", "Tento živočich má klepeta a na konci zadečku jedový bodec."],
    explanation: "Štír má osm nohou jako pavouk — oba patří mezi pavoukovce.",
  }),
  choice("Chroust je brouk. Jak se jmenuje jeho larva?", "ponrava", [
    { value: "housenka", why: "Housenka je larva motýla." },
    { value: "pulec", why: "Pulec je larva žáby." },
    { value: "kukla", why: "Kukla není larva, ale klidové stadium." },
  ], {
    hints: ["Larva chrousta žije několik let v zemi a okusuje kořeny.", "Je to tlustá bílá larva stočená do půlkruhu; zahrádkáři ji najdou při rytí záhonu."],
    explanation: "Larvě chrousta se říká ponrava; žije v zemi a okusuje kořeny.",
  }),
  choice("Proč lezou žížaly po vydatném dešti na povrch?", "v podmáčené půdě mají málo vzduchu", [
    { value: "chtějí se napít", why: "Vody mají v mokré zemi dost." },
    { value: "hledají sluneční světlo", why: "Žížaly se světlu spíš vyhýbají." },
    { value: "utíkají před krtkem", why: "Krtek je loví i za sucha; po dešti jde o vzduch." },
  ], {
    hints: ["Čím žížala dýchá a co se stane s půdou, když se zaplní vodou?", "Žížala dýchá celým povrchem těla. Když vzduch v půdě vytlačí voda, musí nahoru."],
    explanation: "Žížala dýchá kůží; v zaplavené půdě je málo vzduchu, a tak vyleze na povrch.",
  }),
  choice("Který hmyz žije ve velkém společenství s královnou?", "včela medonosná", [
    { value: "moucha domácí", why: "Mouchy žijí každá sama." },
    { value: "kobylka zelená", why: "Kobylky společenstva netvoří." },
    { value: "motýl babočka", why: "Motýli společenstva netvoří." },
  ], {
    hints: ["V úlu žijí tisíce jedinců a každý má svou práci.", "Jediná samice klade vajíčka, dělnice sbírají nektar a pečují o plod."],
    explanation: "Včely medonosné žijí v úlu: královna klade vajíčka, dělnice se o všechno starají.",
  }),
  choice("Proč by bez hmyzu bylo mnohem méně ovoce?", "nikdo by neopyloval květy", [
    { value: "stromy by přestaly kvést", why: "Stromy by kvetly dál, jen by květy zůstaly neopylené." },
    { value: "hmyz ovoce hnojí", why: "Ovocné stromy hmyz nehnojí." },
    { value: "ovoce by rychleji hnilo", why: "Hnití s hmyzem nesouvisí." },
  ], {
    hints: ["Co se musí stát s květem, aby z něj byla třešeň nebo jablko?", "Pyl se musí přenést z květu na květ — a to dělají hlavně včely, čmeláci a další hmyz."],
    explanation: "Plod vznikne jen z opyleného květu. Opylují hlavně včely, čmeláci a jiný hmyz.",
  }),
  choice("Který z těchto živočichů není měkkýš?", "stonožka", [
    { value: "hlemýžď", why: "Hlemýžď je měkkýš s ulitou." },
    { value: "slimák", why: "Slimák je měkkýš bez ulity." },
    { value: "škeble", why: "Škeble je měkkýš se dvěma lasturami." },
  ], {
    hints: ["Který z nich má článkované tělo a spoustu nohou?", "Měkkýši lezou po jedné svalnaté noze; jeden z těch živočichů jich má desítky."],
    explanation: "Stonožka má článkované tělo a mnoho nohou — měkkýš to není.",
  }),
  choice("Proč je hlemýžď nejčilejší za vlhka?", "na suchu by vysychal", [
    { value: "za vlhka lépe vidí", why: "Vlhkost jeho zrak nezlepšuje." },
    { value: "za vlhka je v zahradě méně ptáků", why: "Ptáci loví i za deště; jde o vysychání." },
    { value: "bojí se slunce, protože ho oslní", why: "Nejde o světlo, ale o vodu v těle." },
  ], {
    hints: ["Z čeho je hlemýžďovo tělo a co se s ním děje na slunci?", "Měkké tělo pokryté slizem ztrácí v horku a na slunci vodu, proto se hlemýžď zatáhne do ulity."],
    explanation: "Měkké tělo hlemýždě na suchu vysychá; aktivní je proto za vlhka a v noci.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const BEZOBRATLIHMYZPAVOUCIMEKKYSICERVI: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-bezobratli-hmyz-pavouci-mekkysi-cervi",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-bezobratli-hmyz-pavouci-mekkysi-cervi",
    title: "Bezobratlí - hmyz, pavouci, měkkýši, červi",
    studentTitle: "Bezobratlí",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Třídění organismů",
    briefDescription: "Poznáš skupiny bezobratlých živočichů a jejich znaky.",
    keywords: ["bezobratlí", "hmyz", "pavouci", "měkkýši", "červi", "exoskelet", "larva", "metamorfóza"],
    goals: ["Rozlišit hmyz, pavouky, měkkýše a červy podle základních znaků", "Popsat proměnu hmyzu", "Vysvětlit ekologický význam bezobratlých"],
    boundaries: ["Neprobírá fylogenetiku bezobratlých", "Neprobírá mořské bezobratlé do hloubky"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Hmyz: 6 nohou, 3 části. Pavouk: 8 nohou, 2 části. Měkkýši: měkké tělo. Červi: válcovité tělo bez nohou.",
      steps: [
        "Hmyz: hlava + hruď + zadeček, 6 nohou, tykadla.",
        "Pavouci: hlavohruď + zadeček, 8 nohou, žádná tykadla.",
        "Měkkýši: šnek, slimák, mušle – měkké tělo.",
        "Červi: žížala – válcovité tělo bez nohou.",
      ],
      commonMistake: "Pavouk NENÍ hmyz – má 8 nohou a 2 části těla, ne 6 nohou a 3 části.",
      example: "Motýl = hmyz (6 nohou). Křižák = pavouk (8 nohou). Šnek = měkkýš.",
    },
  },
];
